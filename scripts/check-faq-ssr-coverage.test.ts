#!/usr/bin/env tsx
/**
 * Regression tests for check-faq-ssr-coverage.ts
 *
 * These tests verify that the guard correctly distinguishes between:
 *   - Pages that have FAQPage entries in their staticPages block (should pass)
 *   - Pages where the canonical path appears only in breadcrumbs/links (should fail)
 *   - Pages where the canonical path has no staticPages entry at all (should fail)
 *
 * Run:  npx tsx scripts/check-faq-ssr-coverage.test.ts
 */

// ---------------------------------------------------------------------------
// Inline the core lookup logic so we can test it in isolation.
// (We replicate hasFAQPageSSRCoverage + findStaticPageKeyOffset here rather
// than importing them, because the main script calls process.exit at the end.)
// ---------------------------------------------------------------------------

function findStaticPageKeyOffset(ssrSource: string, path: string): number {
  const escapedPath = path.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const keyPattern = new RegExp(`^  "${escapedPath}"\\s*:`, "m");
  const match = keyPattern.exec(ssrSource);
  return match ? match.index : -1;
}

const MAX_LOOKAHEAD = 6000;

function hasFAQPageSSRCoverage(ssrSource: string, canonicalPath: string): boolean {
  const path = canonicalPath.startsWith("http")
    ? canonicalPath.replace(/^https?:\/\/[^/]+/, "")
    : canonicalPath;

  const keyOffset = findStaticPageKeyOffset(ssrSource, path);
  if (keyOffset === -1) return false;

  const chunk = ssrSource.slice(keyOffset, keyOffset + MAX_LOOKAHEAD);

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
// Test fixtures
// ---------------------------------------------------------------------------

/**
 * Simulates a server/ssr-pages.ts where:
 *   - /target-page has a FAQPage in its structuredData
 *   - /other-page has a FAQPage in its structuredData
 *   - /no-faq-page has NO FAQPage in its structuredData
 *   - /target-page appears in breadcrumbs and internal links BEFORE the staticPages block
 *
 * This is the critical regression case: the path string appears early in the
 * file (in breadcrumb/link arrays) but the guard must anchor to the map key,
 * not the first string occurrence.
 */
const FIXTURE_SSR_SOURCE = `
import { VERIFIED_RATING } from "@shared/verified-rating";

const BASE_URL = "https://www.rainbowpreschools.com";

// Breadcrumbs referencing /target-page — must NOT trigger a false positive
const commonInternalLinks = [
  { text: "Home", url: "/" },
  { text: "Target Page", url: "/target-page" },
  { text: "Other Page", url: "/other-page" },
];

// Inline "@type": "FAQPage" in a helper function — must NOT be attributed to
// /no-faq-page even though it appears between /no-faq-page and /target-page
// in document order.
function helperFAQSchema() {
  return { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: [] };
}

const staticPages: Record<string, any> = {
  "/": {
    title: "Home",
    structuredData: [{ "@type": "WebSite" }],
  },
  "/no-faq-page": {
    title: "No FAQ Page",
    canonical: \`\${BASE_URL}/no-faq-page\`,
    structuredData: [
      { "@type": "EducationalOrganization" },
      { "@type": "WebSite" },
    ],
  },
  "/target-page": {
    title: "Target Page",
    canonical: \`\${BASE_URL}/target-page\`,
    structuredData: [
      { "@context": "https://schema.org", "@type": "EducationalOrganization" },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "What is the target?",
            acceptedAnswer: { "@type": "Answer", text: "It is the target." },
          },
        ],
      },
    ],
  },
  "/other-page": {
    title: "Other Page",
    canonical: \`\${BASE_URL}/other-page\`,
    structuredData: [
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [],
      },
    ],
  },
};
`;

// ---------------------------------------------------------------------------
// Test runner
// ---------------------------------------------------------------------------

let passed = 0;
let failed = 0;

function assert(description: string, actual: boolean, expected: boolean): void {
  if (actual === expected) {
    console.log(`  ✓  ${description}`);
    passed++;
  } else {
    console.error(`  ✗  ${description}`);
    console.error(`     expected: ${expected}, got: ${actual}`);
    failed++;
  }
}

console.log("\n[check-faq-ssr-coverage.test] Running regression tests...\n");

// --- findStaticPageKeyOffset ---

console.log("findStaticPageKeyOffset:");

assert(
  "returns a valid offset for /target-page",
  findStaticPageKeyOffset(FIXTURE_SSR_SOURCE, "/target-page") !== -1,
  true
);

assert(
  "returns a valid offset for /no-faq-page",
  findStaticPageKeyOffset(FIXTURE_SSR_SOURCE, "/no-faq-page") !== -1,
  true
);

assert(
  "returns -1 for a path that does not exist as a map key",
  findStaticPageKeyOffset(FIXTURE_SSR_SOURCE, "/nonexistent-page") === -1,
  true
);

assert(
  "does NOT match /target-page from commonInternalLinks (breadcrumb entry)",
  // The commonInternalLinks entry is a JSON value, not indented as a map key.
  // findStaticPageKeyOffset must return the staticPages key, which is AFTER the links array.
  (() => {
    const offset = findStaticPageKeyOffset(FIXTURE_SSR_SOURCE, "/target-page");
    if (offset === -1) return false;
    // The staticPages key for /target-page must appear AFTER the commonInternalLinks block
    const linksIdx = FIXTURE_SSR_SOURCE.indexOf("commonInternalLinks");
    return offset > linksIdx;
  })(),
  true
);

// --- hasFAQPageSSRCoverage ---

console.log("\nhasFAQPageSSRCoverage:");

assert(
  "returns true for /target-page (has FAQPage in its own block)",
  hasFAQPageSSRCoverage(FIXTURE_SSR_SOURCE, "/target-page"),
  true
);

assert(
  "returns true for /other-page (has FAQPage in its own block)",
  hasFAQPageSSRCoverage(FIXTURE_SSR_SOURCE, "/other-page"),
  true
);

assert(
  "returns false for /no-faq-page (FAQPage only in adjacent blocks / helpers)",
  hasFAQPageSSRCoverage(FIXTURE_SSR_SOURCE, "/no-faq-page"),
  false
);

assert(
  "returns false for a path not in the staticPages map at all",
  hasFAQPageSSRCoverage(FIXTURE_SSR_SOURCE, "/nonexistent"),
  false
);

assert(
  "accepts full BASE_URL canonical (strips domain prefix)",
  hasFAQPageSSRCoverage(
    FIXTURE_SSR_SOURCE,
    "https://www.rainbowpreschools.com/target-page"
  ),
  true
);

// --- Against the real server/ssr-pages.ts ---

console.log("\nAgainst real server/ssr-pages.ts:");

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const realSSR = readFileSync(
  resolve(process.cwd(), "server/ssr-pages.ts"),
  "utf8"
);

assert(
  "/best-preschool-near-me-in-thane has FAQPage in its staticPages block",
  hasFAQPageSSRCoverage(realSSR, "/best-preschool-near-me-in-thane"),
  true
);

assert(
  "/play-school-near-me does NOT currently call createFAQSchema but has FAQPage SSR",
  // Just verifying the lookup works for a known page with FAQPage in SSR
  hasFAQPageSSRCoverage(realSSR, "/play-school-near-me"),
  true
);

assert(
  "/nonexistent-page returns false in real ssr-pages.ts",
  hasFAQPageSSRCoverage(realSSR, "/nonexistent-page-xyz"),
  false
);

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------

console.log(`\n[check-faq-ssr-coverage.test] ${passed} passed, ${failed} failed.\n`);

if (failed > 0) {
  process.exit(1);
}
process.exit(0);
