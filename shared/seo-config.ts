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
// Public noindex pages remain crawlable so search engines can see this signal;
// only internal tools are additionally blocked in robots.txt.
//
// Consumers (do not duplicate this list anywhere):
//   • server/ssr-pages.ts        — `noIndexPages` derives from this array, so
//                                  bot SSR serves <meta name="robots" content="noindex">
//   • client (shouldNoIndex)     — SPA pages call shouldNoIndex() for the same meta
//   • client/public/robots.txt   — must not block public entries; private tools
//                                  are the explicit exception checked by
//                                  scripts/check-robots-noindex-sync.ts.
//
// To noindex a new public page: add it here and its page-level meta tag.
// Do not add a robots.txt Disallow, since that hides the noindex signal.
//
// Rationale per group:
//   Ad landing pages      — Google Ads conversion pages; organic traffic would
//                           dilute paid campaign quality scores.
//   /RIS, /ris, /ris-11th — Rainbow International School campaign pages;
//                           separate school entity, must never surface in
//                           preschool search results. Case variants both listed
//                           because robots.txt matching is case-sensitive.
//   /join-now             — Referral campaign page; internal/shared-link only.
//   /terms, /privacy      — Legal notices remain public but are not search pages.
//   Redirecting author and programme URLs are handled by server/redirects.ts,
//   not by noindex (which a crawler cannot read on a 301 response).
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

  // Public legal notices
  "/terms",
  "/privacy",

  // Internal admin tools
  "/GSC",
  "/gsc",
  "/dummy",

];

// Internal tools are noindex and must also remain crawl-blocked. This is
// intentionally separate from the public campaign/author/programme entries.
export const PRIVATE_ROBOTS_SLUGS: string[] = ["/gsc", "/GSC", "/dummy"];

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
  "ghodbunder": "/play-school-near-me",
};
