#!/usr/bin/env tsx
/**
 * Soft-marketing-word warning for body copy.
 *
 * Sibling to scripts/check-no-title-cannibalisation.ts. The title check
 * already BLOCKS deploys when banned soft-marketing words ("loved",
 * "amazing", "incredible", "wonderful", "magical", "fabulous", "awesome",
 * "most-loved") appear in page titles. Body copy and descriptions were
 * historically unchecked, so hype language has drifted back into blog
 * posts, testimonials, ad-landing copy and SSR JSON-LD review text.
 *
 * This script scans long-form body copy for the same banned word list and
 * prints WARNINGS (exit 0). The goal is drift visibility for PR reviewers
 * on every build — deploys stay green.
 *
 * Sources scanned:
 *   - server/ssr-pages.ts            (SSR JSON-LD review text, descriptions,
 *                                     intro/section content for static pages)
 *   - server/seed-blog-posts.ts      (blog post `content:` template strings)
 *   - shared/legacy-pages-data.ts    (legacy page intro/section/FAQ content)
 *   - client/src/pages/blog-post.tsx (hardcoded blog post content arrays)
 *   - client/src/pages/testimonials.tsx
 *   - client/src/pages/ad-landing.tsx
 *   - client/src/pages/republic-day-2026.tsx
 *   - client/src/pages/holi-activities.tsx
 *
 * Lines whose first non-whitespace match is `title:` (the field that the
 * title cannibalisation check already covers) are skipped to avoid
 * double-warning on the same regression.
 *
 * Ignore mechanism (two ways to suppress a known-acceptable hit):
 *   1. Inline marker comment on the same line: `// allow-soft-words`
 *      (or `/* allow-soft-words *\/`). Use this for prose where the word
 *      is intentional (e.g. quoting a parent or describing a tradition).
 *   2. Markdown italic asterisks treated as a work/book title:
 *      `*Amazing Machines*`, `*The Wonderful Wizard of Oz*`. Any banned
 *      word that sits between a pair of single asterisks on the same
 *      line is assumed to be part of an italicised title and skipped.
 *
 * Run locally:   npx tsx scripts/check-soft-marketing-words.ts
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = process.cwd();

const BANNED_WORDS = [
  "loved",
  "most-loved",
  "amazing",
  "incredible",
  "wonderful",
  "magical",
  "fabulous",
  "awesome",
];

const FILES = [
  "server/ssr-pages.ts",
  "server/seed-blog-posts.ts",
  "shared/legacy-pages-data.ts",
  "client/src/pages/blog-post.tsx",
  "client/src/pages/testimonials.tsx",
  "client/src/pages/ad-landing.tsx",
  "client/src/pages/republic-day-2026.tsx",
  "client/src/pages/holi-activities.tsx",
];

const ALLOW_MARKER = /\/\/\s*allow-soft-words|\/\*\s*allow-soft-words\s*\*\//;

// Title fields are already enforced (as blocking errors) by
// check-no-title-cannibalisation.ts. Skip them here to avoid duplicate noise.
const TITLE_FIELD_LINE = /^\s*(?:title|h1)\s*:\s*["'`]/;

interface Warning {
  file: string;
  line: number;
  word: string;
  snippet: string;
}

function readLines(rel: string): string[] | null {
  try {
    return readFileSync(resolve(ROOT, rel), "utf8").split("\n");
  } catch {
    return null;
  }
}

/**
 * Returns the [start, end) character ranges of every `*...*` italic span
 * on the given line. We use this to skip banned words that appear inside
 * markdown italics (assumed to be book/work titles like *Amazing Machines*).
 * Doubled asterisks (`**bold**`) are NOT treated as italic title spans.
 */
function italicSpans(line: string): Array<[number, number]> {
  const spans: Array<[number, number]> = [];
  // Single-asterisk italic, not part of `**`. Non-greedy, no newline, no `*`.
  const re = /(?<![*\\])\*(?!\*)([^*\n]+?)\*(?!\*)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(line)) !== null) {
    spans.push([m.index, m.index + m[0].length]);
  }
  return spans;
}

const warnings: Warning[] = [];
const wordRegexes = BANNED_WORDS.map((w) => ({
  word: w,
  re: new RegExp(`\\b${w.replace(/-/g, "\\-")}\\b`, "gi"),
}));

function scanFile(rel: string) {
  const lines = readLines(rel);
  if (!lines) return;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (ALLOW_MARKER.test(line)) continue;
    if (TITLE_FIELD_LINE.test(line)) continue;
    const spans = italicSpans(line);
    for (const { word, re } of wordRegexes) {
      re.lastIndex = 0;
      let m: RegExpExecArray | null;
      while ((m = re.exec(line)) !== null) {
        const inItalic = spans.some(
          ([s, e]) => m!.index >= s && m!.index + m![0].length <= e,
        );
        if (inItalic) continue;
        const snippet = makeSnippet(line, m.index, m[0].length);
        warnings.push({ file: rel, line: i + 1, word, snippet });
      }
    }
  }
}

function makeSnippet(line: string, idx: number, len: number): string {
  const before = Math.max(0, idx - 40);
  const after = Math.min(line.length, idx + len + 40);
  const prefix = before > 0 ? "…" : "";
  const suffix = after < line.length ? "…" : "";
  return (prefix + line.slice(before, after) + suffix).replace(/\s+/g, " ").trim();
}

for (const f of FILES) scanFile(f);

if (warnings.length === 0) {
  console.log(
    `[check-soft-marketing-words] OK — ${FILES.length} file(s) scanned, no soft-marketing drift detected in body copy.`,
  );
  process.exit(0);
}

console.warn(
  `[check-soft-marketing-words] ${warnings.length} soft-marketing warning(s) in body copy ` +
    `(non-blocking — deploy continues):`,
);
for (const w of warnings) {
  console.warn(`  [warn] ${w.file}:${w.line} — "${w.word}" — ${w.snippet}`);
}
console.warn(
  `\nThese are warnings, not errors. To suppress an intentional hit, either:\n` +
    `  - add the marker comment "// allow-soft-words" on the same line, or\n` +
    `  - wrap the phrase in markdown italics (e.g. *Amazing Machines*) when it's a book/work title.\n` +
    `Otherwise, please rewrite the body copy to drop the hype word.`,
);
process.exit(0);
