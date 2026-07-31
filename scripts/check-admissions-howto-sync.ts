#!/usr/bin/env tsx
/**
 * Admissions HowTo schema sync guard.
 *
 * Ensures that both SSR and client consume the shared source-of-truth in
 * `shared/admissions-howto-data.ts` and that neither file re-introduces a
 * local HowTo override.
 *
 * Two checks per file:
 *   1. IMPORT present  — `admissionHowToSchema` is imported from
 *                        `@shared/admissions-howto-data`.
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

/** Files that MUST import admissionHowToSchema from the shared module. */
const REQUIRED_IMPORT_FILES = [
  "server/ssr-pages.ts",
  "client/src/pages/preschool-admissions.tsx",
];

/**
 * Pattern that counts as a correct import.
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

  const lines = src.split(/\r?\n/);
  const failures: Failure[] = [];

  // --- Check 1: required import present ------------------------------------
  const hasImport = IMPORT_RE.test(src);
  if (!hasImport) {
    failures.push({
      file: relPath,
      line: null,
      message:
        `Missing import: 'admissionHowToSchema' must be imported from ` +
        `'@shared/admissions-howto-data'. Do not define a local copy.`,
    });
  }

  // --- Check 2: no local HowTo const / inline literal ----------------------
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Skip import lines themselves — they are the *correct* usage.
    if (/^\s*import\s/.test(line)) continue;

    if (LOCAL_CONST_NAME_RE.test(line)) {
      failures.push({
        file: relPath,
        line: i + 1,
        message:
          `Local HowTo const detected: '${line.trim()}'. ` +
          `Use the shared admissionHowToSchema from @shared/admissions-howto-data instead.`,
      });
    }

    if (INLINE_HOWTO_TYPE_RE.test(line)) {
      failures.push({
        file: relPath,
        line: i + 1,
        message:
          `Inline "@type":"HowTo" literal detected: '${line.trim()}'. ` +
          `Remove it and import admissionHowToSchema from @shared/admissions-howto-data.`,
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

  // Check 1+2: required import files (SSR + client page)
  for (const relPath of REQUIRED_IMPORT_FILES) {
    allFailures.push(...check(relPath));
  }

  // Check 2 only: scan components/ for rogue HowTo definitions
  allFailures.push(...checkComponents());

  if (allFailures.length === 0) {
    console.log(
      `[check-admissions-howto-sync] PASSED — both SSR and client import ` +
        `admissionHowToSchema from @shared/admissions-howto-data; no local overrides found ` +
        `in pages/ or components/.`,
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
    `\nFix: ensure both server/ssr-pages.ts and client/src/pages/preschool-admissions.tsx\n` +
      `import admissionHowToSchema from @shared/admissions-howto-data and do NOT define\n` +
      `a local HowTo const or inline "@type":"HowTo" object. Do not introduce HowTo\n` +
      `schema in client/src/components/ — add to the COMPONENTS_ALLOWLIST only if\n` +
      `the component is a legitimate schema declarer, not a call site.`,
  );
  process.exit(1);
}

main();
