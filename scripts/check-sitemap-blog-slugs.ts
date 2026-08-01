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
 *
 * Cross-reference check:
 * The script also parses `server/routes.ts` for every dedicated
 * `app.get("/blog/<literal-slug>", …)` GET route and verifies that each such
 * slug appears in REQUIRED_SLUGS. This ensures that adding a new blog route
 * without updating this guard fails at predeploy time, not silently.
 */

import { seoRecoveryBlogPosts } from "../server/seed-blog-posts";
import { STANDALONE_BLOG_SLUGS } from "../shared/standalone-blog-slugs";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ── Slugs that MUST be present in seoRecoveryBlogPosts ─────────────────────
// Imported from shared/standalone-blog-slugs.ts — the single source of truth
// shared with scripts/check-sitemap-200.ts. Edit that file to add/remove slugs.
const REQUIRED_SLUGS: string[] = STANDALONE_BLOG_SLUGS;

// ── Part 1: verify every REQUIRED_SLUG is present in the seed ───────────────
const seededSlugs = new Set(seoRecoveryBlogPosts.map((p) => p.slug));

const missingSeed = REQUIRED_SLUGS.filter((slug) => !seededSlugs.has(slug));

if (missingSeed.length > 0) {
  console.error(
    `\n[check-sitemap-blog-slugs] FAIL — ${missingSeed.length} required blog slug(s) are missing from seoRecoveryBlogPosts and will NOT appear in /sitemap.xml:\n`,
  );
  for (const slug of missingSeed) {
    console.error(`  MISSING FROM SEED: ${slug}  (expected at /blog/${slug})`);
  }
  console.error(
    "\nFix: add the slug back to `server/seed-blog-posts.ts` → `seoRecoveryBlogPosts`.",
  );
  process.exit(1);
}

// ── Part 2: cross-reference Express routes against REQUIRED_SLUGS ───────────
// Parse server/routes.ts for every literal app.get("/blog/<slug>", …) route
// and verify that each slug is tracked in REQUIRED_SLUGS above.
//
// Matches patterns like:
//   app.get("/blog/some-slug", …)
//   app.get('/blog/some-slug', …)
// but NOT dynamic routes like app.get("/api/blog/:slug", …).
const routesPath = path.resolve(__dirname, "../server/routes.ts");
const routesSource = fs.readFileSync(routesPath, "utf8");

// Match literal (no colon/wildcard) /blog/<slug> paths in GET route registrations.
const routeRegex = /app\.get\(\s*["'`]\/blog\/([a-zA-Z0-9_-]+)["'`]/g;

const routeSlugs: string[] = [];
let match: RegExpExecArray | null;
while ((match = routeRegex.exec(routesSource)) !== null) {
  routeSlugs.push(match[1]);
}

const requiredSet = new Set(REQUIRED_SLUGS);
const untracked = routeSlugs.filter((slug) => !requiredSet.has(slug));

if (untracked.length > 0) {
  console.error(
    `\n[check-sitemap-blog-slugs] FAIL — ${untracked.length} Express blog route(s) in server/routes.ts are NOT tracked in REQUIRED_SLUGS:\n`,
  );
  for (const slug of untracked) {
    console.error(`  UNTRACKED ROUTE: /blog/${slug}`);
  }
  console.error(
    `\nFix: add each slug above to the STANDALONE_BLOG_SLUGS array in shared/standalone-blog-slugs.ts.\n` +
    `This ensures the slug is also present in seoRecoveryBlogPosts and will appear in /sitemap.xml.`,
  );
  process.exit(1);
}

// ── Part 3: verify every REQUIRED_SLUG has a matching Express route ──────────
// The inverse of Part 2: a slug could be added to REQUIRED_SLUGS but its
// corresponding app.get("/blog/<slug>", …) route forgotten in server/routes.ts,
// producing a dead sitemap entry that 404s when visited.
const routeSlugSet = new Set(routeSlugs);
const missingRoute = REQUIRED_SLUGS.filter((slug) => !routeSlugSet.has(slug));

if (missingRoute.length > 0) {
  console.error(
    `\n[check-sitemap-blog-slugs] FAIL — ${missingRoute.length} slug(s) in REQUIRED_SLUGS have no matching Express route in server/routes.ts:\n`,
  );
  for (const slug of missingRoute) {
    console.error(`  MISSING ROUTE: /blog/${slug}`);
  }
  console.error(
    `\nFix: add  app.get("/blog/${missingRoute[0]}", …)  (and equivalents) to server/routes.ts,\n` +
    `or remove the slug from shared/standalone-blog-slugs.ts if the page no longer exists.`,
  );
  process.exit(1);
}

console.log(
  `[check-sitemap-blog-slugs] PASSED — all ${REQUIRED_SLUGS.length} required blog slug(s) are present in the seed and will appear in /sitemap.xml.`,
);
if (routeSlugs.length > 0) {
  console.log(
    `[check-sitemap-blog-slugs] PASSED — all ${routeSlugs.length} Express /blog/* route(s) in server/routes.ts are tracked in REQUIRED_SLUGS.`,
  );
}
console.log(
  `[check-sitemap-blog-slugs] PASSED — all ${REQUIRED_SLUGS.length} REQUIRED_SLUGS have a matching Express route in server/routes.ts.`,
);
