// SEO Configuration for Rainbow Preschool International
// Centralized config for noindex rules, redirects, and sitemap generation

export const PREFERRED_DOMAIN = "https://www.rainbowpreschools.com";

// Pages that should be noindex, follow (low-intent content)
export const NOINDEX_SLUGS: string[] = [
  // Ad landing pages
  "/ad",
  "/ad-google",
  "/flyer",
  "/rainbow-international-School-Bhramhand",
  
  // Author archives
  "/author/rainbow-preschools",
  "/author/rainbowpreschools",
  
  // Festival/seasonal content
  "/diwali-activity-for-kindergarten",
  "/holi-activities-for-kids",
  "/rainy-season-activities-for-kindergarten",
  "/sports-day-activities-for-kindergarten",
  "/republic-day-2026",
  
  // GK/educational content (low admission intent)
  "/national-symbols-of-india-for-kids",
  "/explore-50-fruits-vegetables-english-hindi",
  "/body-parts-names-in-english-for-preschoolers",
  
  // Motivational/quotes content
  "/36-motivational-thoughts-of-the-day-for-kids",
  "/51-inspiring-life-lessons-that-make-children-confident",
  
  // Games content
  "/best-indoor-games-for-kids-at-home",
  "/play-these-9-games-to-make-kids-smarter",
  "/fun-games-teach-even-odd-numbers",
  "/brain-gym-activities-for-preschoolers",
  "/solitary-play-activities",
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
  
  // Outdated admissions page
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
  { url: "/kids-activity-club", priority: 0.7, changefreq: "monthly" },
  { url: "/summer-camp", priority: 0.7, changefreq: "monthly" },
  { url: "/happy-times", priority: 0.7, changefreq: "monthly" },
];

// High-intent landing pages (priority 0.95)
export const HIGH_INTENT_PAGES = [
  { url: "/preschool-admissions", priority: 0.95, changefreq: "weekly" },
  { url: "/preschool-near-me", priority: 0.95, changefreq: "weekly" },
  { url: "/best-preschool-in-thane", priority: 0.95, changefreq: "weekly" },
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
  { url: "/playgroup-in-thane", priority: 0.85, changefreq: "monthly" },
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
