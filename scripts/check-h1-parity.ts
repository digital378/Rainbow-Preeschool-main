#!/usr/bin/env tsx
/**
 * H1 parity guard.
 *
 * Verifies that the `h1:` field in `server/ssr-pages.ts` staticPages
 * matches the visible `<h1>` text rendered by the corresponding client
 * React page component.
 *
 * Why this matters:
 *   Googlebot receives the SSR h1 field; human visitors see the React
 *   <h1> once the SPA hydrates. Drift between the two means the page
 *   that ranked in Google shows a different h1 than what the user
 *   actually sees — a confusing and avoidable SEO regression.
 *
 * Handles three <h1> styles found in the codebase:
 *   1. Same-line literal:   <h1 className="...">Some Text</h1>
 *   2. Multi-line literal:  <h1 className="...">\n  Some Text\n</h1>
 *   3. JSX expression:      <h1 ...>\n  {hero.h1}\n</h1>
 *      (resolves the constant from the file's own `const hero = {...}`)
 *
 * Intentional exceptions (not checked):
 *   /contact  — SSR carries brand suffix ("Contact Us — Rainbow Preschool
 *               International"); client strips it for visual cleanliness
 *               ("Contact Us"). See .agents/memory/h1-sync.md.
 *   /         — home page <h1> lives inside the LandingHero child component,
 *               not directly in home.tsx — cannot be statically extracted.
 *
 * Exit 0 = clean. Exit 1 = mismatch — file:line printed for each.
 *
 * Run locally:  npx tsx scripts/check-h1-parity.ts
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = process.cwd();

function readLines(rel: string): string[] {
  return readFileSync(resolve(ROOT, rel), "utf8").split("\n");
}

// ---------------------------------------------------------------------------
// Step 1: Parse h1 values from server/ssr-pages.ts staticPages
// ---------------------------------------------------------------------------

interface SsrH1Entry {
  file: string;
  line: number;
  url: string;
  h1: string;
}

function parseSsrH1s(): Map<string, SsrH1Entry> {
  const file = "server/ssr-pages.ts";
  const lines = readLines(file);
  const result = new Map<string, SsrH1Entry>();

  let inStaticPages = false;
  let currentKey = "";
  let braceDepth = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (!inStaticPages) {
      if (/^const staticPages: Record<string, PageSEOData> = \{/.test(line)) {
        inStaticPages = true;
        braceDepth = 1;
      }
      continue;
    }

    // Top-level entry key:  `  "/url": {`
    const keyMatch = line.match(/^\s{2}"([^"]+)":\s*\{/);
    if (keyMatch && braceDepth === 1) {
      currentKey = keyMatch[1];
      braceDepth = 2;
      continue;
    }

    if (braceDepth >= 2) {
      // Only capture h1 at depth 2 (top-level field of the entry object)
      if (braceDepth === 2) {
        const h1Match = line.match(/^\s+h1:\s*"((?:[^"\\]|\\.)*)"/);
        if (h1Match && currentKey) {
          result.set(currentKey, {
            file,
            line: i + 1,
            url: currentKey,
            h1: h1Match[1],
          });
        }
      }
      // Closing brace of the current entry: `  },`
      if (/^\s{2}\},?\s*$/.test(line)) {
        braceDepth = 1;
        currentKey = "";
      }
    }

    // Closing brace of the entire map: `};` at column 0
    if (braceDepth === 1 && /^\};\s*$/.test(line)) {
      break;
    }

    // Track brace depth increments inside nested objects (structuredData, etc.)
    // Only count after depth >= 2 so we don't break on map-level braces
    if (braceDepth >= 2) {
      const open = (line.match(/\{/g) ?? []).length;
      const close = (line.match(/\}/g) ?? []).length;
      if (open !== close) {
        // Only adjust if this line isn't already the entry-close we handled above
        if (!/^\s{2}\},?\s*$/.test(line)) {
          braceDepth += open - close;
        }
      }
    }
  }

  return result;
}

// ---------------------------------------------------------------------------
// Step 2: Extract client <h1> text from a TSX page file
// ---------------------------------------------------------------------------

/**
 * Resolve a JSX expression such as "hero.h1" by locating the matching
 * `const hero = { h1: "..." }` declaration in the file.
 */
function resolveJsxExpr(expr: string, lines: string[]): string | null {
  const dotMatch = expr.trim().match(/^(\w+)\.(\w+)$/);
  if (!dotMatch) return null;
  const [, objName, fieldName] = dotMatch;

  let inObj = false;
  let depth = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (!inObj) {
      if (new RegExp(`\\bconst\\s+${objName}[\\s:=]`).test(line)) {
        inObj = true;
        depth =
          (line.match(/\{/g) ?? []).length - (line.match(/\}/g) ?? []).length;
        if (depth <= 0) inObj = false; // single-line const — nothing to scan
      }
      continue;
    }

    depth +=
      (line.match(/\{/g) ?? []).length - (line.match(/\}/g) ?? []).length;

    const fieldRe = new RegExp(
      `\\b${fieldName}:\\s*"((?:[^"\\\\]|\\\\.)*)"`,
    );
    const fieldMatch = line.match(fieldRe);
    if (fieldMatch) return fieldMatch[1];

    if (depth <= 0) break; // exited the const block without finding the field
  }

  return null;
}

/**
 * Extract the text content of the Nth <h1> element from a TSX file.
 * Returns `{ h1, line }` on success, or `null` if not found.
 */
function extractClientH1(
  relPath: string,
  opts: { nthH1?: number } = {},
): { h1: string; line: number } | null {
  const lines = readLines(relPath);
  const nth = opts.nthH1 ?? 1;
  let h1Count = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (!line.includes("<h1")) continue;
    // Skip accidental matches on </h1> lines
    if (line.trimStart().startsWith("</h1>")) continue;

    h1Count++;
    if (h1Count < nth) continue;

    // ── Style 1: same-line literal ─────────────────────────────────────────
    // e.g. `<h1 className="...">Some Text</h1>`
    const inlineLiteral = line.match(/<h1[^>]*>([^<{]+)<\/h1>/);
    if (inlineLiteral) {
      return { h1: inlineLiteral[1].trim(), line: i + 1 };
    }

    // ── Style 2: same-line JSX expression ─────────────────────────────────
    // e.g. `<h1 className="...">{hero.h1}</h1>`
    const inlineJsx = line.match(/<h1[^>]*>\{([^}]+)\}<\/h1>/);
    if (inlineJsx) {
      const resolved = resolveJsxExpr(inlineJsx[1], lines);
      if (resolved !== null) return { h1: resolved, line: i + 1 };
    }

    // ── Styles 3 & 4: opening tag only, content on subsequent line(s) ──────
    // e.g. `<h1 className="...">` followed by content then `</h1>`
    if (line.trimEnd().endsWith(">")) {
      for (let j = i + 1; j < Math.min(i + 6, lines.length); j++) {
        const next = lines[j].trim();

        if (next === "" ) continue; // blank line — keep looking
        if (next.startsWith("</h1>")) break; // empty h1 (shouldn't happen)

        // JSX expression on its own line: `{hero.h1}`
        const jsxOnLine = next.match(/^\{([^}]+)\}$/);
        if (jsxOnLine) {
          const resolved = resolveJsxExpr(jsxOnLine[1], lines);
          if (resolved !== null) return { h1: resolved, line: j + 1 };
          break; // can't resolve — stop
        }

        // Plain text on its own line (may span multiple lines before </h1>)
        let text = next;
        for (let k = j + 1; k < Math.min(j + 4, lines.length); k++) {
          const more = lines[k].trim();
          if (more.startsWith("</h1>") || more === "") break;
          text += " " + more;
        }
        return { h1: text, line: j + 1 };
      }
    }
  }

  return null;
}

// ---------------------------------------------------------------------------
// Step 3: Known URL → client file mapping
// ---------------------------------------------------------------------------
//
// Only include pages that have BOTH:
//   a) a static h1: field in server/ssr-pages.ts staticPages, AND
//   b) a checkable (non-dynamic) <h1> in the client TSX file.
//
// Intentional exclusions:
//   "/"        — home h1 is inside the <LandingHero> component, not home.tsx
//   "/contact" — client strips the brand suffix from the SSR h1 (see
//                .agents/memory/h1-sync.md for the documented exception)
//
// nthH1 — for files that serve multiple routes (legal.tsx handles /terms
//          and /privacy), picks which <h1> occurrence maps to this URL.

const CLIENT_H1_MAP: Record<string, { file: string; nthH1?: number }> = {
  // Core informational pages
  "/about":                       { file: "client/src/pages/about.tsx" },
  "/programmes":                  { file: "client/src/pages/programmes.tsx" },
  "/gallery":                     { file: "client/src/pages/gallery.tsx" },
  "/blog":                        { file: "client/src/pages/blog.tsx" },
  "/testimonials":                { file: "client/src/pages/testimonials.tsx" },
  "/faqs":                        { file: "client/src/pages/faqs.tsx" },
  "/preschool-readiness-quiz":    { file: "client/src/pages/readiness-quiz.tsx" },
  "/top-preschools-in-thane":     { file: "client/src/pages/top-preschools-thane.tsx" },
  // Programme landing pages
  "/playgroup":                   { file: "client/src/pages/playgroup-landing.tsx" },
  "/nursery":                     { file: "client/src/pages/nursery-landing.tsx" },
  "/kindergarten":                { file: "client/src/pages/kindergarten-landing.tsx" },
  "/happy-times":                 { file: "client/src/pages/happy-times-landing.tsx" },
  // SEO commercial landing pages
  "/preschool-admissions":        { file: "client/src/pages/preschool-admissions.tsx" },
  "/best-preschool-near-me-in-thane": { file: "client/src/pages/best-preschool-in-thane.tsx" },
  "/play-school-near-me":         { file: "client/src/pages/play-school-near-me.tsx" },
  // Legal — one file, two routes; nthH1 selects which <h1> applies
  "/terms":                       { file: "client/src/pages/legal.tsx", nthH1: 1 },
  "/privacy":                     { file: "client/src/pages/legal.tsx", nthH1: 2 },
};

// ---------------------------------------------------------------------------
// Step 4: Compare and report
// ---------------------------------------------------------------------------

function main() {
  const ssrH1s = parseSsrH1s();
  const errors: string[] = [];
  let checked = 0;

  for (const [url, clientSpec] of Object.entries(CLIENT_H1_MAP)) {
    const ssr = ssrH1s.get(url);
    if (!ssr) {
      // SSR entry was removed without updating this script's map
      console.warn(
        `[check-h1-parity] WARN  ${url} — no h1 found in server/ssr-pages.ts staticPages. ` +
          `If the SSR entry was intentionally removed, also remove it from CLIENT_H1_MAP ` +
          `in scripts/check-h1-parity.ts.`,
      );
      continue;
    }

    const client = extractClientH1(clientSpec.file, { nthH1: clientSpec.nthH1 });
    if (!client) {
      errors.push(
        `${clientSpec.file} — could not locate <h1> text for ${url} ` +
          `(nthH1=${clientSpec.nthH1 ?? 1}). ` +
          `If the JSX structure changed, update extractClientH1() in ` +
          `scripts/check-h1-parity.ts to match.`,
      );
      continue;
    }

    checked++;

    if (ssr.h1 !== client.h1) {
      errors.push(
        `H1 MISMATCH for ${url}:\n` +
          `  SSR    (${ssr.file}:${ssr.line}): "${ssr.h1}"\n` +
          `  Client (${clientSpec.file}:${client.line}): "${client.h1}"\n` +
          `  Fix: update one or both sides so the h1 text is identical on both.`,
      );
    }
  }

  if (errors.length > 0) {
    console.error(
      `[check-h1-parity] ${errors.length} H1 parity violation(s) found:`,
    );
    for (const e of errors) console.error("\n" + e);
    console.error(
      `\nSee .agents/memory/h1-sync.md for the documented exceptions (contact, home).`,
    );
    process.exit(1);
  }

  console.log(
    `[check-h1-parity] OK — ${checked} pages checked, SSR h1 fields and client <h1> elements all match.`,
  );
  process.exit(0);
}

main();
