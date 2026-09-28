---
name: Retired page invariants
description: Archiving content behind redirects can leave live-page checks referring to retired source records.
---

When consolidating URLs, keep archived content available for editorial comparison but explicitly remove retired pages from live-route and live-metadata invariants. Source-scanning SEO guards may also need narrowly scoped exclusions for archived components; do not weaken checks for pages that still render.

**Why:** A build can succeed while the app fails at startup because a retired article remains in a seeded-content completeness check after its live SEO metadata is removed. Separate scanners can still flag archived components that no visitor can reach.

**How to apply:** For URL-retirement work, verify server startup as well as build, run the full SEO suite, and distinguish archived source from active route inventories in each affected check.