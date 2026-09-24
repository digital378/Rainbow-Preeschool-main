---
name: Campaign attribution privacy
description: Distinguishes first-party campaign capture from safe analytics forwarding across SPA and static ad pages.
---

Preserve campaign query values for first-party lead handling, but never assume an allowlisted UTM or click-ID **key** makes its value safe for analytics. Filter every page-location query value and every event parameter independently; static landing pages can have their own inline tracking outside the SPA. Capture attribution, then synchronously remove the query string before any third-party tag loads; build analytics page locations only from filtered values.

**Why:** An allowlisted UTM key can carry an email address, a phone number with separators, or another identifier. Page views, form views and conversions can use separate tracking paths, so filtering only one path is insufficient. Tag managers can also infer `page_location` directly from the browser URL, bypassing event-level filters.

**How to apply:** When touching redirects, attribution, or campaign forms, test standard campaign slugs and PII-shaped allowlisted values in both SPA and static-page tracking. Store the original values first-party for lead handling, scrub them from the visible URL before analytics loads, and allow only sanitized values in analytics payloads. Do not infer third-party delivery from a script's presence alone.