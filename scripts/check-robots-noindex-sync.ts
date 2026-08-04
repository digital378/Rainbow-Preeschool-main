#!/usr/bin/env tsx
/**
 * Robots ↔ noindex sync guard.
 *
 * `shared/seo-config.ts` `NOINDEX_SLUGS` is the SINGLE source of truth for
 * "this URL must never appear in Google Search". This guard fails the
 * commit/push/deploy when the three declaration layers drift:
 *
 *   1. Every NOINDEX_SLUGS entry must be covered by a `Disallow:` rule in
 *      client/public/robots.txt (robots matching is prefix-based and
 *      case-sensitive, so both are honoured here).
 *   2. Every non-infrastructure `Disallow:` rule in robots.txt must have a
 *      matching NOINDEX_SLUGS entry — a Disallow with no noindex meta means
 *      the URL can still be indexed from external links ("Indexed, though
 *      blocked by robots.txt").
 *   3. server/ssr-pages.ts must derive its `noIndexPages` from NOINDEX_SLUGS
 *      instead of re-declaring a literal array (the drift that let /ad-mtpg
 *      slip past shouldNoIndex()).
 *
 * Infrastructure Disallow rules are exempt from check 2:
 *   - directory prefixes ending with "/" (e.g. /api/, /mumbai/)
 *   - wildcard/query patterns containing "*" or "?"
 *   - entries in ROBOTS_ONLY_EXEMPTIONS below (crawl-blocks for retired
 *     URL trees that intentionally have no live page to noindex)
 *
 * Exit 0 = in sync. Exit 1 = drift — each problem printed with a fix hint.
 *
 * Run locally:  npx tsx scripts/check-robots-noindex-sync.ts
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { NOINDEX_SLUGS } from "../shared/seo-config";

const ROOT = process.cwd();
const ROBOTS_PATH = "client/public/robots.txt";
const SSR_PAGES_PATH = "server/ssr-pages.ts";

// Disallow rules that intentionally have NO NOINDEX_SLUGS counterpart.
// These block crawling of retired URL trees / non-page routes where no
// live page exists to serve a noindex meta tag.
const ROBOTS_ONLY_EXEMPTIONS = new Set<string>([
  "/thane/kalyan-bhiwandi", // retired franchise page tree, no live route
]);

function fail(messages: string[]): never {
  console.error("check-robots-noindex-sync: FAILED\n");
  for (const m of messages) console.error(`  ✗ ${m}`);
  console.error("");
  console.error("  Canonical list: NOINDEX_SLUGS in shared/seo-config.ts");
  console.error("  Robots rules:   client/public/robots.txt");
  console.error("  To noindex a page, add it to BOTH places (one entry each).");
  process.exit(1);
}

// ── Parse robots.txt Disallow rules ─────────────────────────────────────────
const robotsRaw = readFileSync(resolve(ROOT, ROBOTS_PATH), "utf8");
const disallows: string[] = [];
for (const line of robotsRaw.split("\n")) {
  const m = line.match(/^\s*Disallow:\s*(\S+)\s*$/i);
  if (m) disallows.push(m[1]);
}

if (disallows.length === 0) {
  fail([`No Disallow rules found in ${ROBOTS_PATH} — parsing broken or file emptied.`]);
}

const problems: string[] = [];

// ── Check 1: every canonical slug is covered by a Disallow rule ─────────────
// robots.txt matching is prefix-based and case-sensitive.
for (const slug of NOINDEX_SLUGS) {
  const covered = disallows.some((d) => slug === d || slug.startsWith(d));
  if (!covered) {
    problems.push(
      `NOINDEX_SLUGS entry "${slug}" has no matching Disallow rule in ${ROBOTS_PATH}. Add: Disallow: ${slug}`,
    );
  }
}

// ── Check 2: every non-infra Disallow rule maps back to NOINDEX_SLUGS ───────
for (const d of disallows) {
  if (d.endsWith("/")) continue; // directory prefix (infra rule)
  if (d.includes("*") || d.includes("?")) continue; // wildcard/query pattern
  if (ROBOTS_ONLY_EXEMPTIONS.has(d)) continue;
  if (!NOINDEX_SLUGS.includes(d)) {
    problems.push(
      `robots.txt "Disallow: ${d}" has no matching NOINDEX_SLUGS entry in shared/seo-config.ts. ` +
        `Add "${d}" to NOINDEX_SLUGS (or to ROBOTS_ONLY_EXEMPTIONS in this script if it is a crawl-only block).`,
    );
  }
}

// ── Check 3: ssr-pages.ts must derive noIndexPages from NOINDEX_SLUGS ───────
const ssrRaw = readFileSync(resolve(ROOT, SSR_PAGES_PATH), "utf8");
if (/const\s+noIndexPages\s*=\s*\[/.test(ssrRaw)) {
  problems.push(
    `${SSR_PAGES_PATH} re-declares a literal noIndexPages array. It must derive from the canonical list: const noIndexPages = NOINDEX_SLUGS;`,
  );
}
if (!/const\s+noIndexPages\s*=\s*NOINDEX_SLUGS/.test(ssrRaw)) {
  problems.push(
    `${SSR_PAGES_PATH} no longer assigns noIndexPages from NOINDEX_SLUGS — restore: const noIndexPages = NOINDEX_SLUGS;`,
  );
}

if (problems.length > 0) fail(problems);

console.log(
  `check-robots-noindex-sync: OK — ${NOINDEX_SLUGS.length} canonical noindex slugs all covered by robots.txt; ` +
    `${disallows.length} Disallow rules accounted for; ssr-pages derives from NOINDEX_SLUGS.`,
);
