// ─── Sitemap entries — single source of truth ────────────────────────────────
// All indexable URLs that should appear in /sitemap.xml live here.
//
// The runtime `<lastmod>` is sourced from `LAST_UPDATED_ISO` in
// `shared/site-freshness.ts`, so bumping the monthly freshness constant also
// refreshes every entry in the generated sitemap automatically — no separate
// edit to a static .xml file is required.
//
// The dynamic route in `server/index.ts` calls `buildSitemapXml()` to render
// the XML on demand. The optional `scripts/generate-sitemap.ts` writer uses
// the same builder so any historical "dump to disk" workflow stays in sync.

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
}

// NOTE: when adding/removing URLs, keep this list — and ONLY this list — in
// sync. The dynamic /sitemap.xml route reads from here, so any addition is
// served immediately (no static-file edit needed).
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
  { url: "/blog/what-to-ask-during-a-tour-of-a-preschool-in-thane", priority: 0.6, changefreq: "monthly" },
  { url: "/blog/understanding-the-importance-of-preschool-in-early-childhood-development", priority: 0.6, changefreq: "monthly" },
  { url: "/blog/how-play-based-learning-shapes-young-minds", priority: 0.6, changefreq: "monthly" },
  { url: "/blog/preparing-your-child-for-first-day-preschool", priority: 0.6, changefreq: "monthly" },
  { url: "/blog/role-of-parents-early-education", priority: 0.6, changefreq: "monthly" },
  { url: "/blog/creating-safe-nurturing-learning-environment", priority: 0.6, changefreq: "monthly" },
  // 10 evergreen recovery posts (April 2026)
  { url: "/blog/screen-time-guidelines-preschoolers-india", priority: 0.7, changefreq: "monthly" },
  { url: "/blog/healthy-tiffin-box-ideas-preschoolers", priority: 0.7, changefreq: "monthly" },
  { url: "/blog/toilet-training-toddlers-indian-parents-guide", priority: 0.7, changefreq: "monthly" },
  { url: "/blog/picky-eater-toddler-solutions", priority: 0.7, changefreq: "monthly" },
  { url: "/blog/toddler-tantrum-management-emotional-regulation", priority: 0.7, changefreq: "monthly" },
  { url: "/blog/first-day-preschool-packing-checklist", priority: 0.7, changefreq: "monthly" },
  { url: "/blog/stem-activities-preschoolers-home", priority: 0.7, changefreq: "monthly" },
  { url: "/blog/yoga-mindfulness-preschoolers-daily-routines", priority: 0.7, changefreq: "monthly" },
  { url: "/blog/preparing-preschooler-new-sibling", priority: 0.7, changefreq: "monthly" },
  { url: "/blog/toddler-speech-development-milestones-when-to-worry", priority: 0.7, changefreq: "monthly" },

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
  entries?: SitemapEntry[];
}

export function buildSitemapXml(options: BuildSitemapOptions = {}): string {
  const domain = options.domain ?? PREFERRED_DOMAIN;
  const lastmod = options.lastmod ?? LAST_UPDATED_ISO;
  const entries = options.entries ?? SITEMAP_ENTRIES;

  const seen = new Set<string>();
  const deduped = entries.filter((e) => {
    if (seen.has(e.url)) return false;
    seen.add(e.url);
    return true;
  });

  const urlBlocks = deduped
    .map(
      (entry) => `  <url>
    <loc>${domain}${entry.url}</loc>
    <lastmod>${lastmod}</lastmod>
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
