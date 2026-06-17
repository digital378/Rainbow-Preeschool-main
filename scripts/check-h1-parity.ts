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
// Step 4: Compare and report (static pages)
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Step 5: Locality pages (preschool-in-* and playgroup-in-*)
// ---------------------------------------------------------------------------
//
// These pages use template-generated SSR h1s and shared data for client h1s.
// We parse both sides statically and compare per-URL.

/**
 * Parse preschoolCentres map from server/ssr-pages.ts.
 * Returns Map<url, locality>, e.g. "/preschool-in-manpada-thane" → "Manpada"
 */
function parsePrischoolCentresLocalities(): Map<string, string> {
  const lines = readLines("server/ssr-pages.ts");
  const result = new Map<string, string>();
  let inMap = false;
  for (const line of lines) {
    if (!inMap) {
      if (/^const preschoolCentres:/.test(line)) inMap = true;
      continue;
    }
    if (/^\};\s*$/.test(line)) break;
    const m = line.match(/"(\/preschool-in-[^"]+)":\s*\{[^}]*\blocality:\s*"([^"]+)"/);
    if (m) result.set(m[1], m[2]);
  }
  return result;
}

/**
 * Find the h1 template for preschool locality pages in server/ssr-pages.ts.
 * Scans inside the `if (preschoolCentres[cleanPath])` block.
 * Returns the raw template string, e.g. "Preschool in ${centre.locality}, Thane".
 */
function parsePrischoolSSRH1Template(): string | null {
  const lines = readLines("server/ssr-pages.ts");
  let inBranch = false;
  for (const line of lines) {
    if (!inBranch) {
      if (/if\s*\(preschoolCentres\[cleanPath\]\)/.test(line)) inBranch = true;
      continue;
    }
    const m = line.match(/^\s+h1:\s*`([^`]+)`/);
    if (m) return m[1];
    if (/if\s*\(playgroundPages\[cleanPath\]\)/.test(line)) break;
  }
  return null;
}

/**
 * Parse preschoolPageSEO from shared/centre-data.ts.
 * Returns Map<localitySlug, h1>, e.g. "manpada" → "Preschool in Manpada, Thane"
 */
function parsePrischoolClientH1s(): Map<string, string> {
  const lines = readLines("shared/centre-data.ts");
  const result = new Map<string, string>();
  let inObj = false;
  let depth = 0;
  let currentSlug = "";

  for (const line of lines) {
    if (!inObj) {
      if (/^export const preschoolPageSEO/.test(line)) { inObj = true; depth = 1; }
      continue;
    }
    const opens = (line.match(/\{/g) ?? []).length;
    const closes = (line.match(/\}/g) ?? []).length;
    depth += opens - closes;
    if (depth <= 0) break;

    if (depth === 2 && opens > closes) {
      const slugM = line.match(/^\s+["']?([^"':{}\s]+)["']?\s*:\s*\{/);
      if (slugM) currentSlug = slugM[1];
    }
    const h1M = line.match(/^\s+h1:\s*["']([^"']+)["']/);
    if (h1M && currentSlug) result.set(currentSlug, h1M[1]);
  }
  return result;
}

/**
 * Parse playgroundPages URL→h1 from server/ssr-pages.ts.
 * Each entry must have an explicit `h1:` field (added as part of H1 parity fix).
 */
function parsePlaygroupSSRH1s(): Map<string, string> {
  const lines = readLines("server/ssr-pages.ts");
  const result = new Map<string, string>();
  let inMap = false;
  for (const line of lines) {
    if (!inMap) {
      if (/^const playgroundPages:/.test(line)) inMap = true;
      continue;
    }
    if (/^\};\s*$/.test(line)) break;
    const m = line.match(/"(\/playgroup[^"]+)":\s*\{[^}]*\bh1:\s*"([^"]+)"/);
    if (m) result.set(m[1], m[2]);
  }
  return result;
}

/**
 * Parse playgroundLandingPages from shared/playgroup-landing-data.ts.
 * Returns Map<url, h1>, e.g. "/playgroup-in-manpada" → "Playgroup in Manpada, Thane (1.5-2.5 Years)"
 */
function parsePlaygroupClientH1s(): Map<string, string> {
  const lines = readLines("shared/playgroup-landing-data.ts");
  const result = new Map<string, string>();
  let inArray = false;
  let currentUrl = "";
  let inSeo = false;
  let seoDepth = 0;

  for (const line of lines) {
    if (!inArray) {
      if (/^export const playgroundLandingPages/.test(line)) inArray = true;
      continue;
    }
    const urlM = line.match(/^\s+url:\s*["']([^"']+)["']/);
    if (urlM) currentUrl = urlM[1];

    if (!inSeo && /^\s+seo:\s*\{/.test(line)) {
      inSeo = true;
      seoDepth = 1;
      continue;
    }
    if (inSeo) {
      seoDepth += (line.match(/\{/g) ?? []).length - (line.match(/\}/g) ?? []).length;
      const h1M = line.match(/^\s+h1:\s*["']([^"']+)["']/);
      if (h1M && currentUrl) result.set(currentUrl, h1M[1]);
      if (seoDepth <= 0) inSeo = false;
    }
  }
  return result;
}

/**
 * Check that SSR h1s for locality pages match the client h1 values from shared data.
 * Returns an array of error strings (empty = all pass).
 */
function checkLocalityPages(): { errors: string[]; checked: number } {
  const errors: string[] = [];
  let checked = 0;

  // --- Preschool locality pages ---
  const preschoolLocalities = parsePrischoolCentresLocalities();
  const preschoolTemplate = parsePrischoolSSRH1Template();
  const preschoolClientH1s = parsePrischoolClientH1s();

  if (!preschoolTemplate) {
    errors.push(
      "server/ssr-pages.ts — could not find h1 template literal in the preschoolCentres branch. " +
        "Check that the h1 line uses a template literal (backticks) inside the " +
        "`if (preschoolCentres[cleanPath])` block.",
    );
  } else {
    for (const [url, locality] of preschoolLocalities) {
      const ssrH1 = preschoolTemplate.replace("${centre.locality}", locality);
      const localitySlug = locality.toLowerCase().replace(/ /g, "-");
      const clientH1 = preschoolClientH1s.get(localitySlug);
      if (!clientH1) {
        errors.push(
          `H1 MISMATCH for ${url}:\n` +
            `  SSR computed: "${ssrH1}"\n` +
            `  Client: no preschoolPageSEO entry for slug "${localitySlug}" in shared/centre-data.ts. ` +
            `Add the missing entry or remove it from preschoolCentres.`,
        );
        continue;
      }
      checked++;
      if (ssrH1 !== clientH1) {
        errors.push(
          `H1 MISMATCH for ${url}:\n` +
            `  SSR (server/ssr-pages.ts preschoolCentres h1 template → locality "${locality}"): "${ssrH1}"\n` +
            `  Client (shared/centre-data.ts preschoolPageSEO["${localitySlug}"].h1): "${clientH1}"\n` +
            `  Fix: update one side so the h1 texts are byte-equal.`,
        );
      }
    }
  }

  // --- Playgroup locality pages ---
  const playgroupSSRH1s = parsePlaygroupSSRH1s();
  const playgroupClientH1s = parsePlaygroupClientH1s();

  if (playgroupSSRH1s.size === 0) {
    errors.push(
      "server/ssr-pages.ts — playgroundPages map has no explicit h1 fields. " +
        "Add an `h1:` string to every entry in the playgroundPages map.",
    );
  } else {
    for (const [url, ssrH1] of playgroupSSRH1s) {
      const clientH1 = playgroupClientH1s.get(url);
      if (!clientH1) {
        errors.push(
          `H1 MISMATCH for ${url}:\n` +
            `  SSR: "${ssrH1}"\n` +
            `  Client: no entry with url="${url}" in shared/playgroup-landing-data.ts playgroundLandingPages.`,
        );
        continue;
      }
      checked++;
      if (ssrH1 !== clientH1) {
        errors.push(
          `H1 MISMATCH for ${url}:\n` +
            `  SSR (server/ssr-pages.ts playgroundPages[url].h1): "${ssrH1}"\n` +
            `  Client (shared/playgroup-landing-data.ts playgroundLandingPages[url].seo.h1): "${clientH1}"\n` +
            `  Fix: update one side so the h1 texts are byte-equal.`,
        );
      }
    }
  }

  return { errors, checked };
}

function main() {
  const ssrH1s = parseSsrH1s();
  const errors: string[] = [];
  let checked = 0;

  for (const [url, clientSpec] of Object.entries(CLIENT_H1_MAP)) {
    const ssr = ssrH1s.get(url);
    if (!ssr) {
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

  const locality = checkLocalityPages();
  errors.push(...locality.errors);
  checked += locality.checked;

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
    `[check-h1-parity] OK — ${checked} pages checked (${Object.keys(CLIENT_H1_MAP).length} static + ${locality.checked} locality), SSR h1 fields and client <h1> elements all match.`,
  );
  process.exit(0);
}

main();
