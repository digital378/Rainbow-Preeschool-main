// SEO Configuration for Rainbow Preschool International
// Centralized config for noindex rules and site-wide freshness signals.
//
// SOURCE OF TRUTH for URLs and priorities: shared/sitemap-entries.ts
// The dead REDIRECT_MAP, CORE_PAGES, PROGRAMME_PAGES, HIGH_INTENT_PAGES,
// LOCAL_PRESCHOOL_PAGES, and LOCAL_PLAYGROUP_PAGES arrays that previously
// lived here were removed in Phase 2 of the July 2026 SEO audit — nothing
// imported them. Runtime redirects live in server/redirects.ts.

import { LAST_UPDATED_DISPLAY, LAST_UPDATED_ISO } from "./site-freshness";

export const PREFERRED_DOMAIN = "https://www.rainbowpreschools.com";

// ─── Commercial pages "Last Updated" freshness signal ────────────────────────
// These re-export the site-wide freshness constants from `shared/site-freshness.ts`
// so the monthly refresh is a single edit in one file. See that module for details.
//
// Format:
//   COMMERCIAL_PAGES_LAST_UPDATED          → ISO-8601 date used in JSON-LD
//   COMMERCIAL_PAGES_LAST_UPDATED_DISPLAY  → Human-readable date shown to users
export const COMMERCIAL_PAGES_LAST_UPDATED = LAST_UPDATED_ISO;
export const COMMERCIAL_PAGES_LAST_UPDATED_DISPLAY = LAST_UPDATED_DISPLAY;

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

// Helper to check if a path should be noindex
export function shouldNoIndex(path: string): boolean {
  return NOINDEX_SLUGS.includes(path);
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
