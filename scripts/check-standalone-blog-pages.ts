#!/usr/bin/env tsx
/**
 * Standalone HTML blog page SEO guard.
 *
 * Parses every `.html` file under `blog-pages/` and asserts four
 * minimum-SEO requirements:
 *
 *   1. JSON-LD present       — at least one <script type="application/ld+json">
 *                              block must exist in the file.
 *   2. Canonical tag present — a <link rel="canonical"> element must be in <head>.
 *   3. Meta description      — <meta name="description" content="..."> must be
 *                              present and the content value must be ≥ 100 chars.
 *   4. Title length          — <title>…</title> must be present and ≤ 65 chars.
 *
 * These pages are served directly by Express (not via the React SPA pipeline)
 * so none of the existing guards that scan server/ssr-pages.ts or
 * client/src/pages/ catch regressions here.
 *
 * Exit 0 = all pages pass. Exit 1 = at least one violation found.
 *
 * Run locally:
 *   npx tsx scripts/check-standalone-blog-pages.ts
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { resolve, join, relative } from "node:path";

const ROOT = process.cwd();
const BLOG_PAGES_DIR = resolve(ROOT, "blog-pages");

const TITLE_MAX = 65;
const DESC_MIN = 100;

interface Violation {
  file: string;
  message: string;
}

const violations: Violation[] = [];

/** Recursively collect all .html files under a directory. */
function collectHtmlFiles(dir: string): string[] {
  const results: string[] = [];
  let entries: string[];
  try {
    entries = readdirSync(dir);
  } catch {
    return results;
  }
  for (const name of entries) {
    const full = join(dir, name);
    let stat;
    try {
      stat = statSync(full);
    } catch {
      continue;
    }
    if (stat.isDirectory()) {
      results.push(...collectHtmlFiles(full));
    } else if (name.endsWith(".html")) {
      results.push(full);
    }
  }
  return results;
}

function fail(file: string, message: string) {
  violations.push({ file: relative(ROOT, file), message });
}

function checkFile(filePath: string) {
  let raw: string;
  try {
    raw = readFileSync(filePath, "utf8");
  } catch (err) {
    fail(filePath, `Could not read file: ${err}`);
    return;
  }

  // ── 1. JSON-LD ─────────────────────────────────────────────────────────────
  // Match <script type="application/ld+json"> (whitespace-tolerant, case-insensitive).
  const hasJsonLd = /<script[^>]+type\s*=\s*["']application\/ld\+json["']/i.test(raw);
  if (!hasJsonLd) {
    fail(filePath, "Missing <script type=\"application/ld+json\"> — add at least one JSON-LD block");
  }

  // ── 2. Canonical tag ────────────────────────────────────────────────────────
  const hasCanonical = /<link[^>]+rel\s*=\s*["']canonical["'][^>]*>/i.test(raw);
  if (!hasCanonical) {
    fail(filePath, "Missing <link rel=\"canonical\"> — add a canonical URL tag in <head>");
  }

  // ── 3. Meta description (≥ DESC_MIN chars) ──────────────────────────────────
  // Match <meta name="description" content="..."> in either attribute order.
  // Each variant handles double-quoted and single-quoted attributes separately
  // so content values containing apostrophes (e.g. "India's …") are captured
  // in full without being truncated at the single-quote character.
  const descMatch =
    // name=... content=... (double-quoted content)
    raw.match(/<meta[^>]+name\s*=\s*["']description["'][^>]+content\s*=\s*"([^"]*)"/i) ||
    // name=... content=... (single-quoted content)
    raw.match(/<meta[^>]+name\s*=\s*["']description["'][^>]+content\s*=\s*'([^']*)'/i) ||
    // content=... name=... (double-quoted content)
    raw.match(/<meta[^>]+content\s*=\s*"([^"]*)"[^>]+name\s*=\s*["']description["'][^>]*>/i) ||
    // content=... name=... (single-quoted content)
    raw.match(/<meta[^>]+content\s*=\s*'([^']*)'[^>]+name\s*=\s*["']description["'][^>]*>/i);

  if (!descMatch) {
    fail(filePath, "Missing <meta name=\"description\"> — add a meta description");
  } else {
    const desc = descMatch[1];
    if (desc.length < DESC_MIN) {
      fail(
        filePath,
        `<meta name="description"> content is ${desc.length} chars (minimum ${DESC_MIN}). ` +
          `Description: "${desc.length > 60 ? desc.slice(0, 60) + "…" : desc}"`,
      );
    }
  }

  // ── 4. Title length (≤ TITLE_MAX chars) ─────────────────────────────────────
  const titleMatch = raw.match(/<title[^>]*>([^<]*)<\/title>/i);
  if (!titleMatch) {
    fail(filePath, "Missing <title> element — add a page title");
  } else {
    const title = titleMatch[1].trim();
    if (title.length > TITLE_MAX) {
      fail(
        filePath,
        `<title> is ${title.length} chars (limit ${TITLE_MAX}). Title: "${title}"`,
      );
    }
  }
}

// ── Main ─────────────────────────────────────────────────────────────────────

const htmlFiles = collectHtmlFiles(BLOG_PAGES_DIR);

if (htmlFiles.length === 0) {
  console.log("[check-standalone-blog-pages] No .html files found under blog-pages/ — nothing to check.");
  process.exit(0);
}

for (const f of htmlFiles) {
  checkFile(f);
}

if (violations.length > 0) {
  console.error(`[check-standalone-blog-pages] ${violations.length} violation(s) across ${htmlFiles.length} file(s):\n`);
  for (const v of violations) {
    console.error(`  ${v.file}`);
    console.error(`    ✗ ${v.message}\n`);
  }
  console.error(
    "Fix: ensure every standalone HTML page under blog-pages/ has:\n" +
      "  • At least one <script type=\"application/ld+json\"> block\n" +
      "  • A <link rel=\"canonical\"> tag\n" +
      "  • <meta name=\"description\"> with content ≥ 100 chars\n" +
      "  • A <title> element ≤ 65 chars\n",
  );
  process.exit(1);
}

console.log(
  `[check-standalone-blog-pages] OK — ${htmlFiles.length} file(s) checked, all pass JSON-LD / canonical / description / title requirements.`,
);
process.exit(0);
