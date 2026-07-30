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
 * Exit 0 = clean, exit 1 = regression (file:line printed).
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();

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

function main(): void {
  const allFailures: Failure[] = [];

  for (const relPath of REQUIRED_IMPORT_FILES) {
    allFailures.push(...check(relPath));
  }

  if (allFailures.length === 0) {
    console.log(
      `[check-admissions-howto-sync] PASSED — both SSR and client import ` +
        `admissionHowToSchema from @shared/admissions-howto-data; no local overrides found.`,
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
      `a local HowTo const or inline "@type":"HowTo" object.`,
  );
  process.exit(1);
}

main();
