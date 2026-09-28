#!/usr/bin/env tsx
/**
 * Admissions HowTo schema removal guard.
 *
 * The admissions page intentionally has no HowTo JSON-LD. Check its client
 * page and its own SSR entry (not unrelated HowTo content elsewhere in SSR).
 *
 * Checks per file:
 *   1. IMPORT absent — `admissionHowToSchema` must not be imported.
 *   2. LOCAL const absent — no locally-defined const whose name contains
 *                           "HowTo" (case-insensitive), and no inline
 *                           `"@type": "HowTo"` literal that is NOT inside
 *                           an import statement.
 *
 * Additionally, every .tsx/.ts file under client/src/components/ is scanned
 * for rogue HowTo definitions (check 2 only). Files listed in
 * COMPONENTS_ALLOWLIST are skipped (e.g. seo.tsx which declares schema
 * helpers and is the canonical declarer, not a rogue call site).
 *
 * Exit 0 = clean, exit 1 = regression (file:line printed).
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve, relative } from "node:path";

const ROOT = process.cwd();
const COMPONENTS_DIR = resolve(ROOT, "client/src/components");

/**
 * Files under client/src/components/ that are permanently permitted to
 * contain HowTo-related identifiers because they *declare* schema helpers
 * rather than introducing a rogue local copy.
 */
const COMPONENTS_ALLOWLIST = new Set([
  "client/src/components/seo.tsx",
]);

function walkTsx(dir: string): string[] {
  const results: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      results.push(...walkTsx(full));
    } else if (entry.endsWith(".tsx") || entry.endsWith(".ts")) {
      results.push(full);
    }
  }
  return results;
}

/** Admissions page and its SSR entry must not include HowTo markup. */
const ADMISSIONS_FILES = [
  "server/ssr-pages.ts",
  "client/src/pages/preschool-admissions.tsx",
];

/**
 * Pattern for a now-forbidden import.
 * Matches lines like:
 *   import { admissionHowToSchema } from "@shared/admissions-howto-data";
 *   import { admissionHowToSchema, ... } from "@shared/admissions-howto-data";
 */
const IMPORT_RE =
  /import\s*\{[^}]*\badmissionHowToSchema\b[^}]*\}\s*from\s*["']@shared\/admissions-howto-data["']/;

/**
 * Pattern for a locally-defined const whose identifier contains "howto"
 * (case-insensitive). Catches both camelCase and PascalCase variants.
 *   const admissionHowToSchema = …
 *   const localHowToData = …
 *   const HOW_TO_STEPS = …
 */
const LOCAL_CONST_NAME_RE = /\bconst\s+\w*[Hh][Oo][Ww][Tt][Oo]\w*/;

/**
 * Pattern for an inline `"@type": "HowTo"` literal that is NOT part of an
 * import path. A fresh copy of a HowTo schema pasted directly into either
 * file would be caught here even if the const name is different.
 */
const INLINE_HOWTO_TYPE_RE = /["']@type["']\s*:\s*["']HowTo["']/;

interface Failure {
  file: string;
  line: number | null;
  message: string;
}

function check(relPath: string): Failure[] {
  const abs = join(ROOT, relPath);
  let src: string;
  try {
    src = readFileSync(abs, "utf-8");
  } catch {
    return [
      {
        file: relPath,
        line: null,
        message: `File not found — expected at ${abs}`,
      },
    ];
  }

  const start = src.indexOf('"/preschool-admissions": {');
  const end = src.indexOf('"/play-school-near-me": {', start);
  if (relPath === "server/ssr-pages.ts" && (start < 0 || end <= start)) {
    return [{ file: relPath, line: null, message: "Admissions SSR entry not found for HowTo check." }];
  }
  const admissionsSource = relPath === "server/ssr-pages.ts" ? src.slice(start, end) : src;
  const lines = admissionsSource.split(/\r?\n/);
  const failures: Failure[] = [];

  // --- Check 1: removed admissions HowTo import stays removed --------------
  const hasImport = IMPORT_RE.test(src);
  if (hasImport) {
    failures.push({
      file: relPath,
      line: null,
      message: "Admissions HowTo schema import must be removed.",
    });
  }

  // --- Check 2: no local HowTo const / inline literal ----------------------
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Import declarations are checked separately above.
    if (/^\s*import\s/.test(line)) continue;

    if (LOCAL_CONST_NAME_RE.test(line)) {
      failures.push({
        file: relPath,
        line: i + 1,
        message:
          `Local HowTo const detected: '${line.trim()}'. ` +
          `Do not add HowTo markup to the admissions page.`,
      });
    }

    if (INLINE_HOWTO_TYPE_RE.test(line)) {
      failures.push({
        file: relPath,
        line: i + 1,
        message:
          `Inline "@type":"HowTo" literal detected: '${line.trim()}'. ` +
          `Remove HowTo markup from the admissions page.`,
      });
    }
  }

  return failures;
}

/**
 * Scans every .tsx/.ts file under client/src/components/ for rogue HowTo
 * definitions (check 2 only — no import requirement). Files in
 * COMPONENTS_ALLOWLIST are skipped.
 */
function checkComponents(): Failure[] {
  const failures: Failure[] = [];
  for (const abs of walkTsx(COMPONENTS_DIR)) {
    const rel = relative(ROOT, abs).replace(/\\/g, "/");
    if (COMPONENTS_ALLOWLIST.has(rel)) continue;

    let src: string;
    try {
      src = readFileSync(abs, "utf-8");
    } catch {
      continue; // unreadable files are not a HowTo violation
    }

    // Quick skip — no HowTo-related content at all
    if (
      !LOCAL_CONST_NAME_RE.test(src) &&
      !INLINE_HOWTO_TYPE_RE.test(src)
    ) {
      continue;
    }

    const lines = src.split(/\r?\n/);
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (/^\s*import\s/.test(line)) continue;

      if (LOCAL_CONST_NAME_RE.test(line)) {
        failures.push({
          file: rel,
          line: i + 1,
          message:
            `Local HowTo const detected: '${line.trim()}'. ` +
            `Import admissionHowToSchema from @shared/admissions-howto-data instead.`,
        });
      }

      if (INLINE_HOWTO_TYPE_RE.test(line)) {
        failures.push({
          file: rel,
          line: i + 1,
          message:
            `Inline "@type":"HowTo" literal detected: '${line.trim()}'. ` +
            `Remove it and import admissionHowToSchema from @shared/admissions-howto-data.`,
        });
      }
    }
  }
  return failures;
}

function main(): void {
  const allFailures: Failure[] = [];

  // Check the admissions SSR entry and browser page.
  for (const relPath of ADMISSIONS_FILES) {
    allFailures.push(...check(relPath));
  }

  // Check 2 only: scan components/ for rogue HowTo definitions
  allFailures.push(...checkComponents());

  if (allFailures.length === 0) {
    console.log(
      `[check-admissions-howto-sync] PASSED — admissions has no HowTo markup; ` +
        `no rogue component-level HowTo definitions found.`,
    );
    process.exit(0);
  }

  console.error(
    `[check-admissions-howto-sync] FAILED — ${allFailures.length} issue${allFailures.length === 1 ? "" : "s"} found:`,
  );
  for (const f of allFailures) {
    const loc = f.line !== null ? `:${f.line}` : "";
    console.error(`  [FAIL] ${f.file}${loc}  ${f.message}`);
  }
  console.error(
    `\nFix: remove HowTo schema from the admissions page and its SSR entry.\n` +
      `Do not introduce unrelated HowTo definitions in client components.`,
  );
  process.exit(1);
}

main();
