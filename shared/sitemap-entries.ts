// ─── Sitemap entries — single source of truth ────────────────────────────────
// All indexable URLs that should appear in /sitemap.xml live here, EXCEPT for
// `/blog/:slug` posts. Those are pulled live from `storage.getBlogPosts()` by
// the dynamic route in `server/index.ts` so newly published posts appear in
// /sitemap.xml automatically — no edit to this file required when the team
// publishes a new blog post.
//
// The runtime `<lastmod>` is sourced from `LAST_UPDATED_ISO` in
// `shared/site-freshness.ts`, so bumping the monthly freshness constant also
// refreshes every entry in the generated sitemap automatically — no separate
// edit to a static .xml file is required.
//
// The dynamic route in `server/index.ts` calls `buildSitemapXml({ extraEntries })`
// to render the XML on demand, passing in the live blog-post entries. The
// optional `scripts/generate-sitemap.ts` writer uses the same builder so any
// historical "dump to disk" workflow stays in sync (note: that script does not
// have DB access, so the dump only contains the curated non-blog URLs).

import { LAST_UPDATED_ISO } from "./site-freshness";
import { PREFERRED_DOMAIN } from "./seo-config";

export type SitemapChangefreq =
  | "always"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "never";

export interface SitemapEntry {
  url: string;
  priority: number;
  changefreq: SitemapChangefreq;
  /**
   * Optional per-entry `<lastmod>` (ISO-8601 `YYYY-MM-DD`). When set it
   * overrides the global `lastmod` passed to `buildSitemapXml`. Used by the
   * /sitemap.xml route to emit per-blog-post update dates while non-blog
   * URLs continue to inherit the site-wide `LAST_UPDATED_ISO`.
   */
  lastmod?: string;
}

// NOTE: when adding/removing non-blog URLs, keep this list — and ONLY this
// list — in sync. The dynamic /sitemap.xml route reads from here, so any
// addition is served immediately (no static-file edit needed).
//
// Blog posts (/blog/:slug) are intentionally NOT listed here; they are merged
// in at request time from `storage.getBlogPosts()` by the route handler.
export const SITEMAP_ENTRIES: SitemapEntry[] = [
  // ── CORE PAGES ──────────────────────────────────────────
  { url: "/", priority: 1.0, changefreq: "weekly" },
  { url: "/about", priority: 0.8, changefreq: "monthly" },
  { url: "/programmes", priority: 0.9, changefreq: "monthly" },
  { url: "/gallery", priority: 0.8, changefreq: "monthly" },
  { url: "/contact", priority: 0.9, changefreq: "monthly" },
  { url: "/blog", priority: 0.7, changefreq: "weekly" },
  { url: "/faqs", priority: 0.6, changefreq: "monthly" },

  // ── HIGH-INTENT LANDING PAGES ────────────────────────────
  { url: "/best-preschool-near-me-in-thane", priority: 1.0, changefreq: "weekly" },
  { url: "/preschool-admissions", priority: 1.0, changefreq: "weekly" },
  { url: "/play-school-near-me", priority: 1.0, changefreq: "weekly" },

  // ── PROGRAMME PAGES ──────────────────────────────────────
  { url: "/playgroup", priority: 0.9, changefreq: "monthly" },
  { url: "/nursery", priority: 0.9, changefreq: "monthly" },
  { url: "/kindergarten", priority: 0.9, changefreq: "monthly" },
  { url: "/happy-times", priority: 0.7, changefreq: "monthly" },

  // ── LOCAL SEO – PRESCHOOL CENTRE PAGES ──────────────────
  { url: "/preschool-in-manpada-thane", priority: 0.9, changefreq: "monthly" },
  { url: "/preschool-in-hariniwas-thane", priority: 0.9, changefreq: "monthly" },
  { url: "/preschool-in-anand-nagar-thane", priority: 0.9, changefreq: "monthly" },
  { url: "/preschool-in-dhokali-thane", priority: 0.9, changefreq: "monthly" },
  { url: "/preschool-in-kalwa-thane", priority: 0.9, changefreq: "monthly" },
  { url: "/preschool-in-kasarvadavali-thane", priority: 0.9, changefreq: "monthly" },

  // ── LOCAL SEO – PLAYGROUP PAGES ──────────────────────────
  { url: "/playgroup-in-manpada", priority: 0.85, changefreq: "monthly" },
  { url: "/playgroup-in-kalwa", priority: 0.85, changefreq: "monthly" },
  { url: "/playgroup-near-ghodbunder-road", priority: 0.85, changefreq: "monthly" },
  { url: "/playgroup-in-anand-nagar", priority: 0.85, changefreq: "monthly" },
  { url: "/playgroup-in-kasarvadavali", priority: 0.85, changefreq: "monthly" },
  { url: "/playgroup-in-dhokali", priority: 0.85, changefreq: "monthly" },

  // ── BLOG POSTS (under /blog/:slug) ───────────────────────
  // Blog URLs are pulled live from `storage.getBlogPosts()` by the
  // /sitemap.xml route in `server/index.ts` and merged into the output, so
  // publishing a new post via the admin/API automatically adds it to the
  // next /sitemap.xml response — there is no need to add a row here for
  // posts that live in the DB. All /blog/:slug URLs are now seeded into
  // MemStorage (see `server/seed-blog-posts.ts`), so storage is the single
  // source of truth and no fallback rows are needed here.

  // ── SEASONAL / STANDALONE (high-traffic GSC content) ────
  { url: "/holi-activities-for-kids", priority: 0.7, changefreq: "yearly" },
  { url: "/national-symbols-of-india-for-kids", priority: 0.8, changefreq: "yearly" },
  { url: "/sports-day-activities-for-kindergarten", priority: 0.7, changefreq: "yearly" },
  { url: "/36-motivational-thoughts-of-the-day-for-kids", priority: 0.8, changefreq: "yearly" },
  { url: "/body-parts-names-in-english-for-preschoolers", priority: 0.6, changefreq: "yearly" },
  { url: "/rainy-season-activities-for-kindergarten", priority: 0.6, changefreq: "yearly" },
  { url: "/diwali-activity-for-kindergarten", priority: 0.6, changefreq: "yearly" },
  { url: "/best-indoor-games-for-kids-at-home", priority: 0.6, changefreq: "yearly" },
  { url: "/explore-50-fruits-vegetables-english-hindi", priority: 0.6, changefreq: "yearly" },
  { url: "/solitary-play-activities", priority: 0.5, changefreq: "yearly" },

  // ── INTERACTIVE TOOLS & SOCIAL PROOF ────────────────────
  { url: "/preschool-readiness-quiz", priority: 0.7, changefreq: "monthly" },
  { url: "/top-preschools-in-thane", priority: 0.7, changefreq: "monthly" },
  { url: "/testimonials", priority: 0.6, changefreq: "monthly" },

  // ── LEGACY PAGES – ADMISSION & PLAYGROUP ────────────────
  { url: "/preschool-admission-process-guide", priority: 0.65, changefreq: "monthly" },

  // ── LEGACY PAGES – GENERAL RESOURCES ────────────────────
  { url: "/pre-kg-age-guide", priority: 0.6, changefreq: "monthly" },
  { url: "/guide-to-understanding-good-touch-and-bad-touch", priority: 0.6, changefreq: "monthly" },
  { url: "/impact-of-parent-teacher-communication-on-student-success", priority: 0.55, changefreq: "monthly" },
  { url: "/7-things-you-can-do-to-help-children-overcome-fear", priority: 0.5, changefreq: "monthly" },
  { url: "/importance-of-play-in-childrens-emotional-growth", priority: 0.55, changefreq: "monthly" },
  { url: "/what-makes-children-forget-their-manners", priority: 0.5, changefreq: "monthly" },
  { url: "/trends-in-early-childhood-education", priority: 0.55, changefreq: "monthly" },
  { url: "/healthy-preschool-meals-for-bright-minds-and-bodies", priority: 0.5, changefreq: "monthly" },
  { url: "/boost-early-childhood-development-with-educational-toys", priority: 0.55, changefreq: "monthly" },
  { url: "/6-simple-tips-for-improving-listening-skills-in-preschoolers", priority: 0.5, changefreq: "monthly" },
  { url: "/10-spring-gardening-activitie-for-preschoolers", priority: 0.5, changefreq: "yearly" },
  { url: "/how-to-motivate-your-kids-for-school-8-ways", priority: 0.5, changefreq: "monthly" },
  { url: "/7-ways-teaching-aids-help-children-learn-better", priority: 0.5, changefreq: "monthly" },
];

export interface BuildSitemapOptions {
  domain?: string;
  lastmod?: string;
  /**
   * Override the curated list entirely. Rarely needed — prefer `extraEntries`
   * to merge dynamic rows (e.g. blog posts loaded from the DB) on top of
   * `SITEMAP_ENTRIES`.
   */
  entries?: SitemapEntry[];
  /**
   * Additional entries appended after the base list. The first occurrence of
   * each `url` wins, so curated rows take precedence over dynamic ones.
   */
  extraEntries?: SitemapEntry[];
}

/**
 * Convert a blog post's slug into the `SitemapEntry` shape used by the
 * sitemap builder. Centralised here so the route handler and any future
 * caller use the same priority/changefreq defaults.
 */
export function blogPostSitemapEntry(
  slug: string,
  lastmod?: string,
): SitemapEntry {
  return {
    url: `/blog/${slug}`,
    priority: 0.6,
    changefreq: "monthly",
    ...(lastmod ? { lastmod } : {}),
  };
}

export function buildSitemapXml(options: BuildSitemapOptions = {}): string {
  const domain = options.domain ?? PREFERRED_DOMAIN;
  const lastmod = options.lastmod ?? LAST_UPDATED_ISO;
  const baseEntries = options.entries ?? SITEMAP_ENTRIES;
  const entries = options.extraEntries
    ? [...baseEntries, ...options.extraEntries]
    : baseEntries;

  // Dedup by URL keeping the first occurrence so curated rows in
  // `SITEMAP_ENTRIES` take precedence over any dynamically merged ones.
  const byUrl = new Map<string, SitemapEntry>();
  for (const entry of entries) {
    if (!byUrl.has(entry.url)) {
      byUrl.set(entry.url, entry);
    }
  }
  const deduped = Array.from(byUrl.values());

  const urlBlocks = deduped
    .map(
      (entry) => `  <url>
    <loc>${domain}${entry.url}</loc>
    <lastmod>${entry.lastmod ?? lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority.toFixed(2)}</priority>
  </url>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlBlocks}
</urlset>
`;
}
