---
name: Canonical noindex list
description: NOINDEX_SLUGS in shared/seo-config.ts is the single source of truth for noindex URLs; robots.txt and ssr-pages derive/sync via a guard.
---

**Rule:** All "never index this URL" declarations live in `NOINDEX_SLUGS` (shared/seo-config.ts). `server/ssr-pages.ts` assigns `const noIndexPages = NOINDEX_SLUGS` (never a literal array). Each entry needs a matching robots.txt `Disallow:`; `scripts/check-robots-noindex-sync.ts` enforces both directions plus the no-literal-array rule, wired in pre-commit, pre-push, and predeploy (step 10b).

**Why:** /ad-mtpg was once added to 2 of 3 lists and would have been treated as indexable by `shouldNoIndex` consumers; only manual review caught it.

**How to apply:** To noindex a new page, edit exactly two lines: one in NOINDEX_SLUGS, one Disallow in robots.txt. Robots-only crawl blocks for retired URL trees go in `ROBOTS_ONLY_EXEMPTIONS` inside the guard script. Note some NOINDEX_SLUGS entries (author archives, /kids-activity-club, /summer-camp) 301-redirect server-side, so robots + client shouldNoIndex are their effective layers.
