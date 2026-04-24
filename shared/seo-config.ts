// SEO Configuration for Rainbow Preschool International
// Centralized config for noindex rules, redirects, and sitemap generation

export const PREFERRED_DOMAIN = "https://www.rainbowpreschools.com";

// ─── Commercial pages "Last Updated" freshness signal ────────────────────────
// Bump this once a month (per docs/seo-seasonal-refresh-playbook.md). A single
// edit here updates the visible byline AND the Article schema dateModified
// across all 5 commercial pages — both the bot SSR copies in
// `server/ssr-pages.ts` and the React `<EEATSignals>` props on the client.
//
// Format:
//   COMMERCIAL_PAGES_LAST_UPDATED          → ISO-8601 date used in JSON-LD
//   COMMERCIAL_PAGES_LAST_UPDATED_DISPLAY  → Human-readable date shown to users
export const COMMERCIAL_PAGES_LAST_UPDATED = "2026-04-24";
export const COMMERCIAL_PAGES_LAST_UPDATED_DISPLAY = "April 24, 2026";

// Pages that should be noindex, follow (low-intent content)
export const NOINDEX_SLUGS: string[] = [
  // Ad landing pages
  "/ad",
  "/ad-google",
  "/flyer",
  "/RIS",
  
  // Author archives
  "/author/rainbow-preschools",
  "/author/rainbowpreschools",
  
  // Programme landing pages (not for organic indexing)
  "/kids-activity-club",
  "/summer-camp",

  // Internal admin tools
  "/GSC",
];

// 301 Redirects for duplicate content consolidation
export const REDIRECT_MAP: Record<string, string> = {
  // Preschool vs daycare duplicates
  "/preschool-vs-daycare-difference-explained": "/preschool-vs-daycare-difference",
  "/preschool-vs-daycare-understanding-difference": "/preschool-vs-daycare-difference",
  
  // Admission process duplicates
  "/preschool-admission-process-explained": "/preschool-admission-process-guide",
  
  // Awards/recognition duplicates
  "/rainbow-preschool-awards-recognition-thane": "/rainbow-preschool-awards-recognition",
  "/rainbow-preschool-awards-achievements": "/rainbow-preschool-awards-recognition",
  
  // Journey duplicates
  "/rainbow-preschool-journey-2007-to-2026": "/rainbow-preschool-journey-since-2007",
  
  // Testimonials duplicates
  "/parent-testimonials-rainbow-preschool-thane": "/parent-testimonials-rainbow-preschool",
  
  // Separation anxiety duplicates
  "/separation-anxiety-tips-playgroup-parents": "/separation-anxiety-playgroup-tips-parents",
  
  // Physical development duplicates
  "/physical-development-activities-preschoolers": "/physical-development-preschool-activities",
  
  // Mid-term playgroup duplicates
  "/mid-term-playgroup-admission": "/mid-term-playgroup-admissions-benefits",
  "/mid-term-playgroup": "/mid-term-playgroup-admissions-benefits",
  
  // Outdated admissions pages
  "/admissions": "/preschool-admissions",
  "/admissions-24-25": "/preschool-admissions",
  
  // WordPress feed URLs → blog
  "/understanding-the-importance-of-preschool-in-early-childhood-development/feed": "/blog",
  "/rainbow-family-wins-cleanest-school-thane/feed": "/blog",
  "/category/uncategorized/feed": "/blog",
  "/impact-of-parent-teacher-communication-on-student-success/feed": "/blog",
  
  // Typos
  "/plyagroup": "/playgroup",
  
  // Old blog posts
  "/solitary-play-activities-for-preschoolers-types-and-benefits": "/blog",
  "/teaching-the-preschoolers-value-of-money": "/blog",
  
  // Old WordPress pages
  "/midterm-playgroup-test": "/playgroup",
  "/rotaract-club-": "/about",
  "/rotaract-club-events": "/about",
  "/image-gallery": "/about",
  "/school-admission-virtual-learning": "/preschool-admissions",
  "/category/event": "/blog",
  
  // Incomplete/malformed URLs
  "/10-incredible-5-": "/blog",
  "/raise-a-reader-easy-": "/blog",
  "/teaching-the-": "/blog",
  "/playgroup/": "/playgroup",
};

// Core pages for sitemap (priority 1.0-0.9)
export const CORE_PAGES = [
  { url: "/", priority: 1.0, changefreq: "weekly" },
  { url: "/about", priority: 0.8, changefreq: "monthly" },
  { url: "/programmes", priority: 0.9, changefreq: "monthly" },
  { url: "/contact", priority: 0.9, changefreq: "monthly" },
  { url: "/blog", priority: 0.7, changefreq: "weekly" },
  { url: "/faqs", priority: 0.6, changefreq: "monthly" },
];

// Programme pages (priority 0.9)
export const PROGRAMME_PAGES = [
  { url: "/playgroup", priority: 0.9, changefreq: "monthly" },
  { url: "/nursery", priority: 0.9, changefreq: "monthly" },
  { url: "/kindergarten", priority: 0.9, changefreq: "monthly" },
  { url: "/happy-times", priority: 0.7, changefreq: "monthly" },
];

// High-intent landing pages — tiered by primary SEO priority
export const HIGH_INTENT_PAGES = [
  { url: "/best-preschool-near-me-in-thane", priority: 0.98, changefreq: "weekly" }, // Primary "best preschool in thane" target
  { url: "/preschool-admissions", priority: 0.95, changefreq: "weekly" },            // Admissions intent
  { url: "/play-school-near-me", priority: 0.92, changefreq: "weekly" },             // Play school / playgroup near me
];

// Local SEO pages (priority 0.9)
export const LOCAL_PRESCHOOL_PAGES = [
  { url: "/preschool-in-manpada-thane", priority: 0.9, changefreq: "monthly" },
  { url: "/preschool-in-hariniwas-thane", priority: 0.9, changefreq: "monthly" },
  { url: "/preschool-in-anand-nagar-thane", priority: 0.9, changefreq: "monthly" },
  { url: "/preschool-in-dhokali-thane", priority: 0.9, changefreq: "monthly" },
  { url: "/preschool-in-kalwa-thane", priority: 0.9, changefreq: "monthly" },
  { url: "/preschool-in-kasarvadavali-thane", priority: 0.9, changefreq: "monthly" },
];

export const LOCAL_PLAYGROUP_PAGES = [
  { url: "/playgroup-in-manpada", priority: 0.85, changefreq: "monthly" },
  { url: "/playgroup-in-kalwa", priority: 0.85, changefreq: "monthly" },
  { url: "/playgroup-near-ghodbunder-road", priority: 0.85, changefreq: "monthly" },
  { url: "/playgroup-in-anand-nagar", priority: 0.85, changefreq: "monthly" },
  { url: "/playgroup-in-kasarvadavali", priority: 0.85, changefreq: "monthly" },
  { url: "/playgroup-in-dhokali", priority: 0.85, changefreq: "monthly" },
];

// Helper to check if a path should be noindex
export function shouldNoIndex(path: string): boolean {
  return NOINDEX_SLUGS.includes(path);
}

// Helper to get redirect target (if any)
export function getRedirectTarget(path: string): string | null {
  return REDIRECT_MAP[path] || null;
}

// Location keywords for context-based internal linking
export const LOCATION_LINK_MAP: Record<string, string> = {
  "manpada": "/preschool-in-manpada-thane",
  "kalwa": "/preschool-in-kalwa-thane",
  "dhokali": "/preschool-in-dhokali-thane",
  "kasarvadavali": "/preschool-in-kasarvadavali-thane",
  "anand-nagar": "/preschool-in-anand-nagar-thane",
  "hariniwas": "/preschool-in-hariniwas-thane",
  "ghodbunder": "/playgroup-near-ghodbunder-road",
};
