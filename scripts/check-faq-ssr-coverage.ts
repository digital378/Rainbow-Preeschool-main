#!/usr/bin/env tsx
/**
 * FAQPage SSR coverage guard.
 *
 * `createFAQSchema()` builds a FAQPage JSON-LD object that is then passed to
 * the `structuredData` prop of `<SEO>`. Because `<SEO>` injects it via
 * `useEffect`, Google's crawler only sees it if the same FAQPage schema is
 * also present in `server/ssr-pages.ts` (the bot-SSR path).
 *
 * This script:
 *   1. Scans every .tsx file under `client/src/pages/` for calls to
 *      `createFAQSchema(`.
 *   2. For each matching file, extracts the `canonical` string-literal prop
 *      from the `<SEO` component call — that is the canonical URL path the
 *      page is served at.
 *   3. Verifies that `server/ssr-pages.ts` has an entry for that canonical
 *      path in the `staticPages` map whose content contains a
 *      `"@type": "FAQPage"` object in its `structuredData` array.
 *   4. Exits non-zero (blocking the commit/push) if any call site is missing
 *      SSR coverage.
 *
 * Path matching is anchored to actual `staticPages` map keys (2-space-indented
 * entries of the form `  "/path": {`) so breadcrumb/link occurrences of the
 * same path elsewhere in the file are never matched.
 *
 * How to fix a failure
 * --------------------
 *   Add the FAQPage schema to the matching entry in `server/ssr-pages.ts`.
 *   The shared FAQ data files (shared/faq-data.ts, shared/admissions-faq-data.ts,
 *   shared/best-preschool-faq-data.ts) each export a pre-flattened
 *   `*_SCHEMA_ITEMS` array that is ready to drop into the SSR structuredData.
 *
 * Bypass once (emergency only): git commit --no-verify / git push --no-verify
 *
 * Run locally:   npx tsx scripts/check-faq-ssr-coverage.ts
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { resolve, relative, join } from "node:path";

const ROOT = process.cwd();
const PAGES_DIR = resolve(ROOT, "client/src/pages");
const SSR_PAGES_FILE = resolve(ROOT, "server/ssr-pages.ts");

const PREFIX = "[check-faq-ssr-coverage]";

// ---------------------------------------------------------------------------
// 1. Walk client/src/pages/ for .tsx files that call createFAQSchema(
// ---------------------------------------------------------------------------

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

const FAQ_SCHEMA_CALL = "createFAQSchema(";

interface CallSite {
  rel: string;
  canonical: string | null;
}

const callSites: CallSite[] = [];

for (const abs of walkTsx(PAGES_DIR)) {
  const source = readFileSync(abs, "utf8");
  if (!source.includes(FAQ_SCHEMA_CALL)) continue;

  const rel = relative(ROOT, abs).replace(/\\/g, "/");

  // Extract the canonical prop from the <SEO component.
  // Match:  canonical="/some-path"  or  canonical={"/some-path"}
  // We look for a string-literal canonical so we can verify SSR coverage.
  // Dynamic canonicals (computed values) cannot be statically verified — treat
  // as a hard failure so the author is forced to make the path explicit.
  const canonicalMatch =
    source.match(/canonical=["']([^"']+)["']/) ||
    source.match(/canonical=\{["']([^"']+)["']\}/);

  const canonical = canonicalMatch ? canonicalMatch[1] : null;
  callSites.push({ rel, canonical });
}

if (callSites.length === 0) {
  console.log(
    `${PREFIX} OK — no createFAQSchema() call sites found in client/src/pages/.`
  );
  process.exit(0);
}

// ---------------------------------------------------------------------------
// 2. Load server/ssr-pages.ts and check for FAQPage coverage per path
// ---------------------------------------------------------------------------

const ssrSource = readFileSync(SSR_PAGES_FILE, "utf8");
const ssrLines = ssrSource.split("\n");

/**
 * Returns the character offset of the start of the `staticPages` map entry
 * for `path`, or -1 if not found.
 *
 * We match ONLY the top-level map key pattern:
 *   ^  "/path": {   (exactly two leading spaces, followed by colon)
 *
 * This avoids false matches on the same path string appearing in breadcrumbs,
 * internal link arrays, or canonical string values earlier in the file.
 */
function findStaticPageKeyOffset(path: string): number {
  // Escape regex special chars in path (paths like /play-school-near-me are safe,
  // but be defensive for any future path with special chars).
  const escapedPath = path.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  // Two-space indent + quoted key + colon (with optional whitespace before colon)
  const keyPattern = new RegExp(`^  "${escapedPath}"\\s*:`, "m");
  const match = keyPattern.exec(ssrSource);
  return match ? match.index : -1;
}

/**
 * Returns true if `server/ssr-pages.ts` has a FAQPage schema entry associated
 * with `canonicalPath` inside the `staticPages` map.
 *
 * Strategy:
 *   1. Find the staticPages map key for the path (anchored by 2-space indent).
 *   2. Scan forward from that key up to MAX_LOOKAHEAD characters.
 *   3. Stop the scan at the start of the next top-level key so we don't
 *      accidentally count a FAQPage from an adjacent page block.
 *   4. Return true if `"@type": "FAQPage"` appears within that window.
 */
const MAX_LOOKAHEAD = 6000; // characters — large enough for any single page block

function hasFAQPageSSRCoverage(canonicalPath: string): boolean {
  // Normalise: strip leading BASE_URL if present (e.g. full https://... URL)
  const path = canonicalPath.startsWith("http")
    ? canonicalPath.replace(/^https?:\/\/[^/]+/, "")
    : canonicalPath;

  const keyOffset = findStaticPageKeyOffset(path);
  if (keyOffset === -1) {
    return false;
  }

  // Scan forward from the key start up to MAX_LOOKAHEAD characters.
  const chunk = ssrSource.slice(keyOffset, keyOffset + MAX_LOOKAHEAD);

  // Find the start of the next top-level key after our own.
  // Top-level keys look like:  ^  "/some-other-path"\s*:
  // We skip the first match (our own key) by searching from offset 1.
  const nextKeyPattern = /^  "\/[^"]+"\s*:/m;
  const nextKeyMatch = nextKeyPattern.exec(chunk.slice(1));
  const effectiveChunk =
    nextKeyMatch !== null ? chunk.slice(0, nextKeyMatch.index + 1) : chunk;

  return (
    effectiveChunk.includes('"@type": "FAQPage"') ||
    effectiveChunk.includes('"@type":"FAQPage"')
  );
}

// ---------------------------------------------------------------------------
// 3. Report
// ---------------------------------------------------------------------------

const violations: Array<{
  rel: string;
  canonical: string | null;
  reason: string;
}> = [];

for (const { rel, canonical } of callSites) {
  if (canonical === null) {
    violations.push({
      rel,
      canonical,
      reason:
        "Could not extract a string-literal `canonical` prop from the <SEO> component. " +
        "Make the canonical path an explicit string literal so this guard can verify SSR coverage.",
    });
    continue;
  }

  if (!hasFAQPageSSRCoverage(canonical)) {
    violations.push({
      rel,
      canonical,
      reason:
        `No FAQPage entry found in the staticPages map of server/ssr-pages.ts for ` +
        `canonical path "${canonical}". ` +
        `Add a { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: [...] } ` +
        `object to the structuredData array for that path.`,
    });
  }
}

const scanned = callSites.length;

if (violations.length > 0) {
  console.error(
    `\n${PREFIX} ❌  FAQPage SSR coverage missing for ${violations.length} client page(s)!\n`
  );
  for (const { rel, canonical, reason } of violations) {
    console.error(`  File:      ${rel}`);
    console.error(`  Canonical: ${canonical ?? "(unknown)"}`);
    console.error(`  Problem:   ${reason}`);
    console.error("");
  }
  console.error(
    `${PREFIX} createFAQSchema() builds a FAQPage schema injected via useEffect (client-only).`
  );
  console.error(
    `${PREFIX} Google's crawler executes JavaScript late or not at all — it needs the same`
  );
  console.error(
    `${PREFIX} FAQPage schema in server/ssr-pages.ts so bot-SSR HTML contains it directly.`
  );
  console.error(`${PREFIX}`);
  console.error(
    `${PREFIX} Fix: add the FAQPage schema to the matching structuredData array in`
  );
  console.error(
    `${PREFIX} server/ssr-pages.ts.  Use the shared *_SCHEMA_ITEMS export from the`
  );
  console.error(
    `${PREFIX} relevant shared/faq-data file (see shared/best-preschool-faq-data.ts`
  );
  console.error(`${PREFIX} for the pattern).`);
  console.error(`${PREFIX}`);
  console.error(
    `${PREFIX} Bypass once (emergency only): git push --no-verify`
  );
  process.exit(1);
}

console.log(
  `${PREFIX} OK — ${scanned} createFAQSchema() call site(s) checked, all have FAQPage SSR coverage.`
);
process.exit(0);
