# Live crawl repair design

## Goal

Resolve the confirmed issues in the 24 September live crawl without changing any centre facts that have not been provided. Keep visitor-facing pages, bot HTML, and analytics-safe URLs consistent, then validate the release before offering the Publish action.

## Decisions

- Use shared page and article data for metadata and copy that must match between the visitor page and bot HTML. Keep the existing bot-SSR architecture; do not replace it with a broad server-rendering migration.
- Correct broken visitor links at their source. Do not add redirects to mask the reported broken links. Add only the explicit Stage 6 redirects listed below.
- Leave Stage 4 untouched. Its centre-specific facts are not available and must not be inferred.
- For Cloudflare email obfuscation, prefer an exclusion limited to `/contact`. Do not disable the feature globally unless a scoped exclusion is unavailable and the user approves that broader change.
- Publishing remains user-initiated. A real physical-phone test cannot be performed from this workspace; mobile browser emulation will be reported separately.

## Work included

### Links, redirects, and accuracy

- Replace the reported broken links with the exact working destinations in the crawl report, including the links on `/kindergarten`, `/nursery`, `/national-symbols-of-india-for-kids`, `/holi-activities-for-kids`, and affected legacy articles.
- Change the four requested `/branches` links and the `/centres` link in the Republic Day article to `/contact`.
- Add 301s: `/thane/aggarwal/` to `/preschool-in-manpada-thane`, `/thane/kasarvadavli/` to `/preschool-in-kasarvadavali-thane`, `/centres` to `/contact`, and `/programme` to `/programmes`.
- Remove only the inaccurate “across 6 generations” claim from the three bot-SSR entries; do not replace it with another unsupported claim.

### Visitor and bot parity

- Reconcile titles, descriptions, and H1s for the affected blog posts and Ghodbunder Road page using shared data consumed by both render paths.
- For the 11 content-gap pages, reuse the visitor page’s existing content data in bot HTML. Extract data from components only where needed; do not invent or shorten page facts to meet a word-count target.
- Add or extend automated parity checks so later edits cannot silently reintroduce metadata or content drift.

### Performance and crawl controls

- Reuse the prepaint homepage hero image instead of mounting a second high-priority image. Defer/code-split below-the-fold homepage modules without delaying above-the-fold content.
- Prevent the delayed Poppins font from shifting the `/contact` footer by applying a scoped, metric-compatible fallback strategy.
- Remove the `Disallow: /*?utm_` rule while retaining clean canonical URLs for campaign variants.
- Apply the narrowest available Cloudflare email-obfuscation exclusion for `/contact`, then verify the returned email link.

## Validation and release

- Run existing static guards, type/build checks, and the full pre-deploy smoke tests.
- Crawl the affected routes as a normal visitor and as Googlebot; check link destinations, status codes, canonical/title/description/H1 parity, and bot-versus-visitor content coverage.
- Run three mobile Lighthouse samples each for `/` and `/contact`; report the distribution rather than treating one passing run as proof.
- Use mobile browser emulation for overflow, forms, and console checks. Clearly mark the requested physical-phone pass as unverified until someone tests a real device.
- Offer the Publish action only after local verification. Do not claim production is updated until the user publishes and the live checks are repeated.

## Out of scope

- Stage 4 centre-data work and any claims that require facts from the user.
- Global Cloudflare email-obfuscation changes unless a page-scoped exclusion is unavailable and the user explicitly approves the broader effect.
- Claims that an actual physical phone was tested from this environment.