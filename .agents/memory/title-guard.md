---
name: Title cannibalisation guard
description: The guard script, where it's wired, and what it enforces.
---

Script: `scripts/check-no-title-cannibalisation.ts`
Run: `npx tsx scripts/check-no-title-cannibalisation.ts`

**Wired into:**
- `.githooks/pre-commit` (explicit call after npm run check)
- `.githooks/pre-push` (explicit call after npm run check)
- `scripts/predeploy.sh` step 1.5

**NOT in `npm run check`** — package.json cannot be edited (fullstack-js skill rule).
Triple coverage via hooks + predeploy is sufficient.

**What it enforces:**
1. Banned soft-marketing words in titles: loved, most-loved, amazing, incredible, wonderful, magical, fabulous, awesome
2. Keyword ownership matrix — each phrase has one canonical URL; no other page's title may contain it
3. SSR/client title parity — byte-equal titles required for URLs that appear in both staticPages and a client <SEO title="..."> literal
4. Title length ≤ 65 chars

**Legacy blog titles** (shared/legacy-pages-data.ts) are warnings only — non-blocking; 93 warnings as of June 2026 (all length-only, no keyword violations).

**Why:** Bots rank the SSR title; humans see the client title once SPA mounts. Any drift means the tab title differs from what ranked the page.
