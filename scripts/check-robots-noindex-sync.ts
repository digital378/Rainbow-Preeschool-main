#!/usr/bin/env tsx
/**
 * Robots ↔ noindex sync guard.
 *
 * `shared/seo-config.ts` `NOINDEX_SLUGS` is the SINGLE source of truth for
 * "this URL must never appear in Google Search". This guard fails the
 * commit/push/deploy when the three declaration layers drift:
 *
 *   1. Public NOINDEX_SLUGS entries and redirect sources must remain crawlable.
 *   2. Private tools and infrastructure Disallow rules must remain blocked;
 *      campaign URLs must remain crawlable for their clean canonicals.
 *   3. server/ssr-pages.ts must derive its `noIndexPages` from NOINDEX_SLUGS
 *      instead of re-declaring a literal array (the drift that let /ad-mtpg
 *      slip past shouldNoIndex()).
 *
 * Exit 0 = in sync. Exit 1 = drift — each problem printed with a fix hint.
 *
 * Run locally:  npx tsx scripts/check-robots-noindex-sync.ts
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { NOINDEX_SLUGS, PRIVATE_ROBOTS_SLUGS } from "../shared/seo-config";
import { legacyPagesData } from "../shared/legacy-pages-data";
import { legacyFinalDestinations } from "../shared/legacy-final-destinations";
import { redirectMap } from "../server/redirects";

const ROOT = process.cwd();
const ROBOTS_PATH = "client/public/robots.txt";
const SSR_PAGES_PATH = "server/ssr-pages.ts";

function fail(messages: string[]): never {
  console.error("check-robots-noindex-sync: FAILED\n");
  for (const m of messages) console.error(`  ✗ ${m}`);
  console.error("");
  console.error("  Canonical list: NOINDEX_SLUGS in shared/seo-config.ts");
  console.error("  Robots rules:   client/public/robots.txt");
  console.error("  Public noindex pages must be crawlable; private tools stay blocked.");
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

// ── Check 1: public noindex pages and redirect sources are crawlable ─────────
for (const slug of NOINDEX_SLUGS) {
  if (PRIVATE_ROBOTS_SLUGS.includes(slug)) {
    if (!disallows.includes(slug)) {
      problems.push(`Private noindex tool "${slug}" must retain Disallow: ${slug}.`);
    }
  } else if (disallows.some((d) => slug === d || slug.startsWith(d))) {
    problems.push(
      `Public noindex "${slug}" is blocked by robots.txt; remove its Disallow rule.`,
    );
  }
}

for (const source of Object.keys(redirectMap)) {
  if (disallows.some((d) => source === d || source.startsWith(d))) {
    problems.push(`Redirect source "${source}" is blocked by robots.txt; remove its Disallow rule.`);
  }
}

// Blog grid hides legacy paths that redirect. Keep its client-safe lookup in
// lockstep with the redirect middleware so new redirects cannot add stale cards.
for (const key of Object.keys(legacyPagesData)) {
  const path = key.replace(/\/$/, "");
  const destination = redirectMap[path];
  if ((legacyFinalDestinations[path] || undefined) !== destination) {
    problems.push(`Blog redirect lookup drift for "${path}": sync shared/legacy-final-destinations.ts with server/redirects.ts.`);
  }
}

// ── Check 2: required infrastructure/private Disallow rules remain ──────────
for (const d of disallows) {
  if (d === "/api/" || PRIVATE_ROBOTS_SLUGS.includes(d)) continue;
  problems.push(`Unexpected robots.txt Disallow: ${d}. Keep only private tools and /api/; campaign URLs need to be crawlable.`);
}
for (const required of ["/api/", ...PRIVATE_ROBOTS_SLUGS]) {
  if (!disallows.includes(required)) {
    problems.push(`Required robots.txt rule is missing: Disallow: ${required}`);
  }
}

// Static fast pages are public duplicate landers: they must be crawlable
// (checked above) but noindex, with a canonical on the final www host.
for (const [name, target] of Object.entries({
  playgroup: "/playgroup",
  nursery: "/nursery",
  kindergarten: "/kindergarten",
  daycare: "/happy-times",
})) {
  const file = `public/${name}-fast.html`;
  const html = readFileSync(resolve(ROOT, file), "utf8");
  if (!/<meta\s+name="robots"\s+content="noindex(?:,\s*(?:follow|nofollow))?"\s*\/?>/i.test(html)) {
    problems.push(`${file} needs a noindex robots meta tag.`);
  }
  if (!html.includes(`<link rel="canonical" href="https://www.rainbowpreschools.com${target}">`)) {
    problems.push(`${file} needs its final www canonical: ${target}.`);
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
  `check-robots-noindex-sync: OK — ${NOINDEX_SLUGS.length} canonical noindex slugs are crawlable/private as configured; ` +
    `${disallows.length} Disallow rules accounted for; ssr-pages derives from NOINDEX_SLUGS.`,
);
