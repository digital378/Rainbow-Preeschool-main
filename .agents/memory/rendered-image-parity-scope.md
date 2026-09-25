---
name: Rendered image parity scope
description: Why bot and visitor image audits compare stable, unique main-content image attributes.
---

Compare unique rendered main-content `(src, alt, width, height)` tuples, not raw `<img>` tag counts. Report pages with no editorial image on either side separately; an empty/empty match is not image coverage. Exclude only identified decorative or volatile media, while retaining real editorial illustrations even when their alt is intentionally empty.

**Why:** Looping carousels repeat the same assets, and conditional video-error posters or external social thumbnails change between visits. Raw counts produced false mismatches; counting empty pages as covered overstated the result.

**How to apply:** When an image or audit filter changes, compare hydrated visitor markup with bot HTML for the same route. Deduplicate repeated presentation instances, but do not hide a stable editorial image to force a passing report. Then run the sitemap-wide audit.