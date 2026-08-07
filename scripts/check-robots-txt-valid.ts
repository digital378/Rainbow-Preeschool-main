#!/usr/bin/env tsx
/**
 * robots.txt directive-syntax guard.
 *
 * Parses client/public/robots.txt and fails if any non-comment, non-blank
 * line uses a directive keyword that is not in the standard robots.txt spec.
 *
 * Allowed directives:
 *   User-agent, Allow, Disallow, Sitemap, Crawl-delay
 *
 * Comments (lines starting with #) and blank lines are always allowed.
 *
 * Why: non-standard directives such as `LLMs-txt:` or `LLMs-full-txt:` cause
 * strict robots.txt validators (including the one used by the Publishing panel
 * "SEO Rating" check) to mark the file as invalid, silently failing deploys.
 *
 * Exit 0 = all directives are valid.
 * Exit 1 = one or more non-standard directives found.
 *
 * Run locally:  npx tsx scripts/check-robots-txt-valid.ts
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = process.cwd();
const ROBOTS_PATH = "client/public/robots.txt";

// Standard robots.txt directives per the spec + widely-accepted extensions.
// See: https://developers.google.com/search/docs/crawling-indexing/robots/robots_txt
const ALLOWED_DIRECTIVES = new Set([
  "user-agent",
  "allow",
  "disallow",
  "sitemap",
  "crawl-delay",
]);

const raw = readFileSync(resolve(ROOT, ROBOTS_PATH), "utf8");
const lines = raw.split("\n");

const problems: string[] = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const trimmed = line.trim();

  // Skip blank lines and comments.
  if (trimmed === "" || trimmed.startsWith("#")) continue;

  // A valid directive line looks like:  Keyword: value
  const colonIdx = trimmed.indexOf(":");
  if (colonIdx === -1) {
    problems.push(
      `line ${i + 1}: not a valid robots.txt directive (no colon found): ${JSON.stringify(trimmed)}`,
    );
    continue;
  }

  const keyword = trimmed.slice(0, colonIdx).trim().toLowerCase();
  if (!ALLOWED_DIRECTIVES.has(keyword)) {
    problems.push(
      `line ${i + 1}: non-standard directive "${trimmed.slice(0, colonIdx).trim()}:" — ` +
        `only User-agent, Allow, Disallow, Sitemap, and Crawl-delay are permitted. ` +
        `If this is informational, convert it to a comment: # ${trimmed}`,
    );
  }
}

if (problems.length > 0) {
  console.error("check-robots-txt-valid: FAILED\n");
  for (const p of problems) console.error(`  ✗ ${p}`);
  console.error("");
  console.error(`  File: ${ROBOTS_PATH}`);
  console.error(
    "  Non-standard directives cause strict robots.txt validators to mark the file as",
  );
  console.error(
    "  invalid. Convert informational lines to comments (prefix with #).",
  );
  process.exit(1);
}

console.log(
  `check-robots-txt-valid: OK — ${lines.length} lines checked, all directives are standard.`,
);
