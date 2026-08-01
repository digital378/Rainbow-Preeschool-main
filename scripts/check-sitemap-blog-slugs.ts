#!/usr/bin/env tsx
/**
 * Static guard: assert that every "critical" blog slug exists in
 * `server/seed-blog-posts.ts` → `seoRecoveryBlogPosts`.
 *
 * Why: blog posts are served at Express routes AND appear in /sitemap.xml via
 * `storage.getBlogPosts()` (which is seeded from `seoRecoveryBlogPosts`). If a
 * slug is removed from the seed, it silently vanishes from the sitemap — no
 * HTTP error, no build failure. This script makes that invisible removal
 * visible by failing predeploy.
 *
 * Add a slug here whenever a standalone blog page is wired to both an Express
 * route (server/routes.ts) and the seed-blog-posts array.
 *
 * Run:  npx tsx scripts/check-sitemap-blog-slugs.ts
 */

import { seoRecoveryBlogPosts } from "../server/seed-blog-posts";

// ── Slugs that MUST be present in seoRecoveryBlogPosts ─────────────────────
// Each entry here corresponds to a URL that:
//   (a) has a dedicated Express GET route in server/routes.ts, AND
//   (b) must appear in /sitemap.xml (via storage.getBlogPosts()).
//
// independence-day-for-kids confirmed present 2026-08-01; route registered at
// /blog/independence-day-for-kids in server/routes.ts.
const REQUIRED_SLUGS: string[] = [
  "independence-day-for-kids",
];

const seededSlugs = new Set(seoRecoveryBlogPosts.map((p) => p.slug));

const missing = REQUIRED_SLUGS.filter((slug) => !seededSlugs.has(slug));

if (missing.length > 0) {
  console.error(
    `\n[check-sitemap-blog-slugs] FAIL — ${missing.length} required blog slug(s) are missing from seoRecoveryBlogPosts and will NOT appear in /sitemap.xml:\n`,
  );
  for (const slug of missing) {
    console.error(`  MISSING: ${slug}  (expected at /blog/${slug})`);
  }
  console.error(
    "\nFix: add the slug back to `server/seed-blog-posts.ts` → `seoRecoveryBlogPosts`.",
  );
  process.exit(1);
}

console.log(
  `[check-sitemap-blog-slugs] PASSED — all ${REQUIRED_SLUGS.length} required blog slug(s) are present in the seed and will appear in /sitemap.xml.`,
);
