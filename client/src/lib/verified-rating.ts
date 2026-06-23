/**
 * Verified aggregate rating for Rainbow Preschool International.
 *
 * SOURCE: Google Business Profile (maps.google.com) — Rainbow Preschool International, Thane.
 * HOW TO REFRESH: Open the school's Google Business Profile listing, read the aggregate
 * star rating and total review count shown publicly, update the two values below, and
 * update LAST_VERIFIED_DATE to today's ISO date.
 *
 * IMPORTANT: These values must be confirmed against the live GBP listing before every
 * major deploy. Do not inflate or estimate — Google's rich-result policy requires that
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
