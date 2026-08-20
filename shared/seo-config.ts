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

// ─── Canonical noindex list — SINGLE SOURCE OF TRUTH ─────────────────────────
// Every URL that must NEVER appear in Google Search lives here, and ONLY here.
//
// Consumers (do not duplicate this list anywhere):
//   • server/ssr-pages.ts        — `noIndexPages` derives from this array, so
//                                  bot SSR serves <meta name="robots" content="noindex">
//   • client (shouldNoIndex)     — SPA pages call shouldNoIndex() for the same meta
//   • client/public/robots.txt   — must carry a matching `Disallow:` per entry;
//                                  scripts/check-robots-noindex-sync.ts enforces
//                                  this in pre-commit, pre-push, and predeploy.
//
// To noindex a new page: add it here AND add a robots.txt Disallow line.
// The sync guard fails the commit if either side is missed.
//
// Rationale per group:
//   Ad landing pages      — Google Ads conversion pages; organic traffic would
//                           dilute paid campaign quality scores.
//   /RIS, /ris, /ris-11th — Rainbow International School campaign pages;
//                           separate school entity, must never surface in
//                           preschool search results. Case variants both listed
//                           because robots.txt matching is case-sensitive.
//   /join-now             — Referral campaign page; internal/shared-link only.
//   Author archives       — Thin-content archive pages.
//   Programme landing     — /kids-activity-club, /summer-camp: campaign landing
//                           pages not intended for organic indexing.
//   /gsc, /GSC            — Internal Google Search Console data explorer.
//   /dummy                — Internal design-system reference/preview page.
export const NOINDEX_SLUGS: string[] = [
  // Ad landing pages
  "/ad",
  "/ad-google",
  "/ad-mtpg",
  "/flyer",
  "/RIS",
  "/ris",
  "/ris-11th",
  "/join-now",

  // Author archives
  "/author/rainbow-preschools",
  "/author/rainbowpreschools",

  // Programme landing pages (not for organic indexing)
  "/kids-activity-club",
  "/summer-camp",

  // Internal admin tools
  "/GSC",
  "/gsc",
  "/dummy",

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
