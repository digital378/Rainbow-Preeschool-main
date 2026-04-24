// ─── Site-wide "Last Updated" freshness signal ───────────────────────────────
// Bump these two constants once a month (per docs/seo-seasonal-refresh-playbook.md).
// A single edit here updates the visible byline AND the Article schema
// dateModified across:
//   • Bot SSR copies in `server/ssr-pages.ts`
//     (5 commercial staticPages entries, the preschoolCentres branch, and the
//     playgroundPages branch)
//   • Client React `<EEATSignals>` props on the 6 commercial landing pages,
//     the playgroup-landing-template, and the preschool-location page
//
// LAST_UPDATED_ISO     → ISO-8601 date used in JSON-LD (e.g. "2026-04-24")
// LAST_UPDATED_DISPLAY → Human-readable date shown to users (e.g. "April 24, 2026")
//
// Keep the two values in sync — they must always represent the same calendar day.
export const LAST_UPDATED_ISO = "2026-04-24";
export const LAST_UPDATED_DISPLAY = "April 24, 2026";
