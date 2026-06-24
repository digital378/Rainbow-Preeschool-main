/**
 * Verified aggregate rating for Rainbow Preschool International.
 *
 * SOURCE: Google Business Profile (maps.google.com) — Rainbow Preschool International, Thane.
 * HOW TO REFRESH (every ~120 days / quarterly):
 *   1. Open the Rainbow Preschool International Google Business Profile listing on
 *      maps.google.com — no login required, just view the public listing.
 *   2. Read the aggregate star rating and total review count shown.
 *   3. Update ratingValue, reviewCount, and lastVerifiedDate below.
 *
 * REMINDER MECHANISM: scripts/check-eeat-show-rating.ts reads lastVerifiedDate and
 * prints a prominent warning on every pre-commit, pre-push, and deploy run once the
 * date is more than 120 days old. The warning is non-blocking but intentionally loud.
 *
 * IMPORTANT: Do not inflate or estimate — Google's rich-result policy requires that
 * AggregateRating figures match a publicly verifiable review source.
 *
 * These figures are used on the six high-value commercial landing pages
 * (/playgroup, /nursery, /kindergarten, /play-school-near-me,
 *  /preschool-admissions, /best-preschool-near-me-in-thane)
 * to emit AggregateRating JSON-LD and display star-rating UI in EEATSignals.
 */

export const VERIFIED_RATING = {
  ratingValue: 4.9,
  reviewCount: 487,
  /**
   * ISO-8601 date the figures were last confirmed from the source platform.
   * Update this whenever ratingValue or reviewCount is refreshed.
   */
  lastVerifiedDate: "2026-06-23",
  source: "Google Business Profile",
  sourceUrl: "https://www.google.com/maps/search/Rainbow+Preschool+International+Thane",
} as const;
