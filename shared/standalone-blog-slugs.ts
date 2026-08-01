/**
 * Single source of truth for standalone blog page slugs.
 *
 * A "standalone" blog page is one that:
 *   (a) has a dedicated Express GET route in server/routes.ts
 *       (e.g. app.get("/blog/some-slug", …)), AND
 *   (b) must appear in /sitemap.xml via seoRecoveryBlogPosts.
 *
 * This list is consumed by two predeploy guards:
 *   - scripts/check-sitemap-blog-slugs.ts — verifies each slug is in the
 *     seed file (seoRecoveryBlogPosts) so it appears in /sitemap.xml.
 *   - scripts/check-sitemap-200.ts — HTTP-checks the Express route returns
 *     200 OK with a Googlebot UA.
 *
 * By importing from here, both guards stay in sync automatically. Add a slug
 * here whenever you wire a new standalone blog page to an Express route AND
 * add it to server/seed-blog-posts.ts → seoRecoveryBlogPosts.
 */
export const STANDALONE_BLOG_SLUGS: string[] = [
  "independence-day-for-kids",
];
