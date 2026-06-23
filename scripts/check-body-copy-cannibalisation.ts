#!/usr/bin/env tsx
/**
 * Body-copy keyword-cannibalization guard.
 *
 * The title-cannibalization guard (check-no-title-cannibalisation.ts) already
 * protects <SEO title=…> and SSR `title:` fields. This companion script catches
 * the same reserved phrases when they appear as VISIBLE BODY COPY — plain text
 * between JSX tags (H1-H3, paragraphs, divs, etc.) — on pages other than the
 * designated canonical page.
 *
 * It also scans shared data files (centre-data.ts, legacy-pages-data.ts,
 * playgroup-landing-data.ts) for reserved phrases in `heading:` field values
 * — these become rendered H2/H3 elements on page.
 *
 * WHY THIS MATTERS
 * ─────────────────
 * If "/about" renders an <h2> that says "Leading Preschool in Thane since 2007",
 * Google can associate that keyword phrase with /about instead of (or alongside)
 * the canonical /best-preschool-near-me-in-thane. That dilutes the ranking
 * signal for the page that is supposed to own the phrase.
 *
 * HOW IT WORKS — TSX PAGE FILES
 * ──────────────────────────────
 * 1. For each .tsx in client/src/pages/ (excluding exempt ad/event pages):
 * 2. Each line is examined for one of the seven reserved phrases (case-insensitive).
 * 3. A line is SKIPPED (not flagged) when:
 *      a. It is a comment or import statement.
 *      b. It contains an anchor context: href=, <a, <Link.
 *      c. The phrase is inside a quoted string (detected by counting unescaped
 *         double/single/backtick quotes before the phrase position on the same
 *         line). A quoted phrase is a data-object value or JSX attribute — it
 *         is not rendered as standalone body text.
 *      d. The file is the canonical page for the matched phrase.
 *      e. The file is in the EXEMPT_FILES list (ad/event landing pages and
 *         internal tools that are not organic SEO targets).
 * 4. Unquoted phrase occurrences on non-canonical, non-exempt pages = ERROR.
 *
 * HOW IT WORKS — SHARED DATA FILES
 * ──────────────────────────────────
 * 1. For each file in DATA_FILES (shared/centre-data.ts, etc.):
 * 2. Only lines whose field name is in VISIBLE_DATA_FIELDS are examined.
 *    Covered fields: heading, content, intro, introParagraph, question, answer.
 *    These values are rendered as visible on-page text (H2/H3 headings, section
 *    copy, FAQ text, intro paragraphs).
 * 3. Pure meta fields (title:, description:, metaDescription:, canonical:,
 *    canonicalPath:, slug:, url:) are skipped — covered by other guards.
 * 4. `h1:` in data files is intentionally excluded — the title-cannibalisation
 *    and h1-parity guards already cover those fields.
 * 5. Lines containing href= or url: are skipped (the phrase is link/anchor text).
 * 6. A reserved phrase in a visible-text field = ERROR, because the value is
 *    shared across pages and the scanner cannot verify it only appears on the
 *    canonical URL.
 *
 * KNOWN LIMITATION
 * ─────────────────
 * Multi-line string values (template literals spanning multiple lines) are not
 * tracked across lines. In practice this is rare in these data files — most
 * visible-text fields are single-line string literals.
 *
 * RESERVED PHRASES AND CANONICAL PAGES
 * ──────────────────────────────────────
 * Phrase                          Canonical file(s)
 * ─────────────────────────────── ──────────────────────────────────────────
 * Best Preschool in Thane         best-preschool-in-thane.tsx
 * Preschool in Thane (bare)       best-preschool-in-thane.tsx
 *                                 preschool-admissions.tsx
 * Play School Near Me             play-school-near-me.tsx
 *                                 play-school-near-*.tsx (locality variants)
 * Playgroup in Thane              playgroup-landing.tsx, local-playgroup.tsx
 * Nursery School in Thane         nursery-landing.tsx
 * Kindergarten in Thane           kindergarten-landing.tsx
 * Preschool Admissions in Thane   preschool-admissions.tsx
 *
 * Run locally:  npx tsx scripts/check-body-copy-cannibalisation.ts
 * Exit 0 = clean. Exit 1 = violation found.
 */
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = process.cwd();
const PAGES_DIR = "client/src/pages";

// ── Files completely exempt from body-copy scanning ─────────────────────────
// These are paid-ad landing pages, event pages, or internal tools that are not
// organic SEO targets. Adding a page here should always have a written reason.
export const EXEMPT_FILES = new Set<string>([
  "gsc-dashboard.tsx",      // internal analytics dashboard, never indexed
  "ad-landing.tsx",         // paid-ad landing page (Google/Meta ads) — not organic
  "ad-google-landing.tsx",  // paid-ad landing page — not organic
  "flyer-landing.tsx",      // paid-ad flyer page — not organic
  "ris-landing.tsx",        // event/campaign landing — not organic
  "ris-11th-landing.tsx",   // event/campaign landing — not organic
]);

// ── Reserved phrases and their canonical source files ───────────────────────
export interface PhraseRule {
  phrase: RegExp;
  label: string;
  /** File basenames that ARE allowed to contain this phrase in body copy. */
  canonicalFiles: ReadonlyArray<string | RegExp>;
}

export const OWNED_PHRASES: PhraseRule[] = [
  {
    phrase: /\bbest preschool in thane\b/i,
    label: "Best Preschool in Thane",
    canonicalFiles: ["best-preschool-in-thane.tsx"],
  },
  {
    phrase: /\bpreschool in thane\b/i,
    label: "Preschool in Thane (bare)",
    // Both the commercial page and the admissions page are canonical for this bare phrase.
    canonicalFiles: ["best-preschool-in-thane.tsx", "preschool-admissions.tsx"],
  },
  {
    phrase: /\bplay school near me\b/i,
    label: "Play School Near Me",
    // The main page and the locality "near X" pages all target this phrase cluster.
    canonicalFiles: [
      "play-school-near-me.tsx",
      /^play-school-near-.+\.tsx$/,
    ],
  },
  {
    phrase: /\bplaygroup in thane\b/i,
    label: "Playgroup in Thane",
    canonicalFiles: ["playgroup-landing.tsx", "local-playgroup.tsx"],
  },
  {
    phrase: /\bnursery school in thane\b/i,
    label: "Nursery School in Thane",
    canonicalFiles: ["nursery-landing.tsx"],
  },
  {
    phrase: /\bkindergarten in thane\b/i,
    label: "Kindergarten in Thane",
    canonicalFiles: ["kindergarten-landing.tsx"],
  },
  {
    phrase: /\bpreschool admissions in thane\b/i,
    label: "Preschool Admissions in Thane",
    canonicalFiles: ["preschool-admissions.tsx"],
  },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

function readLines(rel: string): string[] {
  return readFileSync(resolve(ROOT, rel), "utf8").split("\n");
}

/**
 * Returns true when the matched phrase at `phraseIndex` on `line` appears
 * inside a quoted string (double-quote, single-quote, or backtick).
 *
 * The heuristic counts unescaped quote characters that appear BEFORE the
 * phrase start position. An odd count means we are inside an open string of
 * that type. This reliably distinguishes JSX attribute values and TypeScript
 * data-object string literals from unquoted JSX text content between tags.
 *
 * Limitation: multi-line template literals are not tracked across lines, but
 * they are uncommon for the kind of body copy we are guarding against.
 */
export function isPhraseInsideQuotedString(line: string, phraseIndex: number): boolean {
  const before = line.slice(0, phraseIndex);
  // Count unescaped double quotes
  const dq = (before.match(/(?<!\\)"/g) ?? []).length;
  if (dq % 2 === 1) return true;
  // Count unescaped single quotes
  const sq = (before.match(/(?<!\\)'/g) ?? []).length;
  if (sq % 2 === 1) return true;
  // Count backticks
  const bt = (before.match(/(?<!\\)`/g) ?? []).length;
  if (bt % 2 === 1) return true;
  return false;
}

/**
 * Returns true when `filename` matches one of the canonical-file patterns
 * for `rule`.
 */
export function isCanonicalFile(filename: string, rule: PhraseRule): boolean {
  return rule.canonicalFiles.some((pattern) =>
    pattern instanceof RegExp ? pattern.test(filename) : pattern === filename,
  );
}

/**
 * Returns true when the line should be skipped regardless of phrase content:
 *   - comment lines
 *   - import statements
 *   - lines containing anchor-tag patterns (href=, <a, <Link)
 *   - SEO component lines
 */
export function isSkippedLineType(line: string): boolean {
  const trimmed = line.trimStart();
  if (trimmed.startsWith("//") || trimmed.startsWith("/*") || trimmed.startsWith("*")) return true;
  if (trimmed.startsWith("import ")) return true;
  // Anchor / link context — phrase is link text or JSX attribute, not standalone body copy
  if (/href=/.test(line)) return true;
  if (/<a[ >]/.test(line)) return true;
  if (/<Link[ >]/.test(line)) return true;
  // SEO meta component — already covered by the title guard
  if (/<SEO/.test(line)) return true;
  return false;
}

// ── Testable scan functions ───────────────────────────────────────────────────

/**
 * Scans an array of lines (representing a .tsx page file) for body-copy
 * keyword violations. Returns an array of error message strings.
 *
 * `filename` is the basename only (e.g. "about.tsx") — used to check
 * canonical-file and exempt-file rules.
 */
export function scanPageLines(lines: string[], filename: string): string[] {
  if (EXEMPT_FILES.has(filename)) return [];

  const errors: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (isSkippedLineType(line)) continue;

    for (const rule of OWNED_PHRASES) {
      if (isCanonicalFile(filename, rule)) continue;

      const match = rule.phrase.exec(line);
      if (!match) continue;

      if (isPhraseInsideQuotedString(line, match.index)) continue;

      errors.push(
        `${filename}:${i + 1} — "${rule.label}" appears as unquoted body copy on a ` +
          `non-canonical page. Canonical owner: ${
            rule.canonicalFiles
              .map((p) => (p instanceof RegExp ? p.source : p))
              .join(" or ")
          }. ` +
          `Rephrase to avoid the exact keyword phrase, or use an <a>/<Link> anchor ` +
          `pointing to the canonical page instead. Line: ${line.trim()}`,
      );
    }
  }

  return errors;
}

/**
 * Scans an array of lines (representing a shared data file) for body-copy
 * keyword violations in visible-text fields. Returns an array of error strings.
 *
 * `relPath` is used only for the error message label.
 */
export function scanDataLines(lines: string[], relPath: string): string[] {
  const errors: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (isSkippedLineType(line)) continue;

    const trimmed = line.trimStart();
    const colonIdx = trimmed.indexOf(":");
    if (colonIdx === -1) continue;
    const fieldName = trimmed.slice(0, colonIdx).trim();
    if (!VISIBLE_DATA_FIELDS.has(fieldName)) continue;

    if (/href=/.test(line)) continue;
    if (/\burl:/.test(line)) continue;

    for (const rule of OWNED_PHRASES) {
      const match = rule.phrase.exec(line);
      if (!match) continue;

      errors.push(
        `${relPath}:${i + 1} — "${rule.label}" appears in a "${fieldName}:" field of a ` +
          `shared data file. This text is rendered on pages that may not be the ` +
          `canonical owner. Canonical owner: ${
            rule.canonicalFiles
              .map((p) => (p instanceof RegExp ? p.source : p))
              .join(" or ")
          }. ` +
          `Rephrase to avoid the exact keyword phrase. Line: ${line.trim()}`,
      );
    }
  }

  return errors;
}

// ── Shared constants used by both scan functions and the main runner ──────────

// Visible-text field names in shared data files — values rendered as on-page text.
// `h1:` is intentionally excluded: it is already covered by the title-cannibalisation
// and h1-parity guards, so double-flagging here adds noise without extra protection.
// Meta/link fields (title, description, metaDescription, canonical, canonicalPath,
// slug, url) are also excluded — they are covered by the title and description guards.
export const VISIBLE_DATA_FIELDS = new Set<string>([
  "heading",
  "content",
  "intro",
  "introParagraph",
  "question",
  "answer",
]);

const DATA_FILES = [
  "shared/centre-data.ts",
  "shared/legacy-pages-data.ts",
  "shared/playgroup-landing-data.ts",
] as const;

// ── Main scan ─────────────────────────────────────────────────────────────────

function main(): void {
  const allErrors: string[] = [];

  let pages: string[];
  try {
    pages = readdirSync(resolve(ROOT, PAGES_DIR)).filter((f) => f.endsWith(".tsx"));
  } catch (err) {
    console.error(`[check-body-copy-cannibalisation] Cannot read ${PAGES_DIR}:`, err);
    process.exit(1);
  }

  for (const page of pages) {
    const rel = `${PAGES_DIR}/${page}`;
    const fileLines = readLines(rel);
    allErrors.push(...scanPageLines(fileLines, page));
  }

  for (const dataFile of DATA_FILES) {
    const fileLines = readLines(dataFile);
    allErrors.push(...scanDataLines(fileLines, dataFile));
  }

  if (allErrors.length > 0) {
    console.error(
      `[check-body-copy-cannibalisation] ${allErrors.length} body-copy keyword violation(s) found:`,
    );
    for (const e of allErrors) console.error("  " + e);
    console.error(
      `\nWhy this matters: reserved keyword phrases in rendered headings let Google ` +
        `associate the phrase with the wrong URL, diluting the ranking signal for the ` +
        `canonical page.\n` +
        `Fix options:\n` +
        `  1. Rephrase the copy to avoid the exact match (e.g. "Preschool Chain in Thane"\n` +
        `     instead of "Preschool in Thane").\n` +
        `  2. Replace the text with an <a>/<Link> anchor pointing to the canonical URL\n` +
        `     (anchor text linking to the canonical page is SEO-neutral or beneficial).\n` +
        `  3. For TSX pages: add the file to EXEMPT_FILES only for non-organic pages\n` +
        `     (ad pages, internal tools).`,
    );
    process.exit(1);
  }

  console.log(
    `[check-body-copy-cannibalisation] OK — ${pages.length} page files and ` +
      `${DATA_FILES.length} shared data files scanned, ` +
      `no reserved-phrase violations detected.`,
  );
  process.exit(0);
}

// Only run when invoked directly (not when imported by the test suite).
const isMain =
  process.argv[1] &&
  (process.argv[1].endsWith("check-body-copy-cannibalisation.ts") ||
    process.argv[1].endsWith("check-body-copy-cannibalisation.js"));

if (isMain) {
  main();
}
