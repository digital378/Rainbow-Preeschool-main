# Live crawl repair design

## Goal

Resolve the confirmed issues in the 24 September live crawl without changing any centre facts that have not been provided. Keep visitor-facing pages, bot HTML, and analytics-safe URLs consistent, then validate the release before offering the Publish action.

## Decisions

- Use shared page and article data for metadata and copy that must match between the visitor page and bot HTML. Keep the existing bot-SSR architecture; do not replace it with a broad server-rendering migration.
- Correct broken visitor links at their source. Do not add redirects to mask the reported broken links. Add only the explicit Stage 6 redirects listed below.
- Leave Stage 4 untouched. Its centre-specific facts are not available and must not be inferred.
- Keep Cloudflare's email obfuscation enabled elsewhere. Surround the email in `/contact` HTML with `<!--email_off-->` and `<!--/email_off-->` so Cloudflare leaves that page's address alone.
- Publishing remains user-initiated. A real physical-phone test cannot be performed from this workspace; mobile browser emulation will be reported separately.

## Work included

### Links, redirects, and accuracy

- Edit each source link, without introducing redirects for broken visitor links:
  - `/kindergarten`: `/blog/parents-prepare-child-school` → `/blog/preparing-your-child-for-first-day-preschool`.
  - `/nursery`: `/blog/preschool-vs-daycare` → `/blog/preschool-vs-daycare-difference`.
  - `/nursery`, specifically its Hariniwas (Panchpakadi) entry: `/preschool-near-panch-pakhadi-thane-west` → `/preschool-in-hariniwas-thane`.
  - `/kindergarten`, `/nursery`, `/blog/first-day-preschool-packing-checklist`, and `/blog/yoga-mindfulness-preschoolers-daily-routines`: `/branches` → `/contact`.
  - `/national-symbols-of-india-for-kids`: `/admissions` → `/preschool-admissions`, and `/republic-day-2026` → `/blog/republic-day-2026`.
  - The shared template used by 22 legacy articles: `/best-preschool-in-thane` → `/best-preschool-near-me-in-thane`.
  - `/holi-activities-for-kids`: both `/brain-gym-activities-for-preschoolers` and `/innovative-learning-activities-for-preschoolers` → `/blog/50-fun-learning-activities-preschoolers`.
  - `/blog/republic-day-2026`: `/centres` → `/contact`.
- Add only the specified 301 redirects, in the exact-match map before the `/thane/*` homepage catch-all: `/thane/aggarwal` and `/thane/aggarwal/` → `/preschool-in-manpada-thane`; `/thane/kasarwadavli` and `/thane/kasarwadavli/` → `/preschool-in-kasarvadavali-thane`; `/centres` → `/contact`; `/programme` → `/programmes`. Do not add an alternate spelling or change other redirects.
- Remove only the inaccurate “across 6 generations” claim from the three bot-SSR entries; do not replace it with another unsupported claim.

### Visitor and bot parity

- For every affected page, use the current bot `<title>` and meta description and the current visitor H1 and body text as the canonical shared values. Both render paths must consume them. Do not change URLs, slugs, publish dates, `dateModified`, or sitemap `lastmod` as a side effect.
- Reconcile affected blog posts and `/playgroup-near-ghodbunder-road` under this rule.
- For all 11 content-gap pages, reuse the visitor page's existing main content in bot HTML. Baseline bot vs visitor word counts from the report: `/` 291 vs 783; `/programmes` 182 vs 442; `/contact` 167 vs 464; `/blog` 596 vs 2,045; `/nursery` 493 vs 1,532; `/kindergarten` 521 vs 1,278; `/happy-times` 121 vs 1,015; `/holi-activities-for-kids` 183 vs 2,769; `/national-symbols-of-india-for-kids` 1,023 vs 3,311; `/top-preschools-in-thane` 318 vs 943; `/testimonials` 175 vs 916. Extract data from components only where needed; do not invent or shorten page facts to meet a word-count target.
- Add or extend automated parity checks so later edits cannot silently reintroduce metadata or content drift.

### Performance and crawl controls

- Reuse the prepaint homepage hero photo already in the initial HTML instead of mounting a second React image. Hold back below-the-fold JavaScript until after the first screen is visible; image compression alone cannot address the reported render delay.
- Prevent the delayed Poppins font from shifting the `/contact` footer by applying a scoped, metric-compatible fallback strategy.
- Remove the `Disallow: /*?utm_` rule while retaining clean canonical URLs for campaign variants.
- Add Cloudflare's `<!--email_off-->` / `<!--/email_off-->` comments around the `/contact` email, including bot HTML where applicable, and verify the response contains a working email link rather than `/cdn-cgi/l/email-protection`.

## Validation and release

- Run existing static guards, type/build checks, and the full pre-deploy smoke tests.
- For **every sitemap page**, compare normal-visitor and Googlebot HTML and report a table with title, description, and H1 match (yes/no) plus both main-content word counts. Flag every page where bot words are below 80% of visitor words. Check the exact link destinations and redirect status separately.
- Run three mobile Lighthouse samples each for `/` and `/contact`. Target homepage LCP <4 s in all three and `/contact` CLS <0.1 in all three; report each measured result and any misses rather than treating one passing run as proof.
- Use mobile browser emulation for overflow, forms, and console checks. Clearly mark the requested physical-phone pass as unverified until someone tests a real device.
- Offer the Publish action only after local verification. Do not claim production is updated until the user publishes and the live checks are repeated.

## Out of scope

- Stage 4 centre-data work and any claims that require facts from the user.
- Global Cloudflare email-obfuscation setting changes.
- Content rewrites for near-duplicate playgroup locality pages.
- Claims that an actual physical phone was tested from this environment.