---
name: Static ad landing pages
description: Ad landing pages are standalone static HTML in public/, not React pages — build copy, route pattern, and asset-path gotchas
---

# Static ad landing pages

Ad landing pages (e.g. /ad-mtpg) are standalone static HTML files in `public/`, served by dedicated Express routes registered before `setupRedirects`/`setupBotSSR`/`express.static`, with Firebase config placeholders injected server-side from `VITE_FIREBASE_*` env vars. They are NOT React SPA pages — do not recreate them under `client/src/pages/`.

**Why:** Ad landing pages need the fastest possible first load (no SPA bundle download/parse/hydrate). The /ad-mtpg React version felt slow on reload; the static version serves a single ~48KB HTML at <20ms TTFB.

**How to apply:**
- HTML goes in `public/`; add a `cp` step in `script/build.ts` into `dist/ad-assets/` (dist is wiped every build), and make the route try `dist/ad-assets/` first with the `public/` path as fallback (mirrors the blog-pages pattern).
- Every asset the HTML references must exist under `client/public/` (Vite's publish root → dist/public). A file existing only in the source-root `public/` works in dev but is not guaranteed in the production artifact — this bit the logo once.
- Keep the path in `NOINDEX_SLUGS` (shared/seo-config.ts) and robots.txt Disallow; the HTML must also carry its own `<meta name="robots" content="noindex, nofollow">`.
- Bot-SSR is not a problem: the route is registered before it, so bots get the full static page (200).
- Dev gotcha: once `dist/ad-assets/ad-mtpg.html` exists, it shadows `public/ad-mtpg.html` in dev too (dist-first candidates) AND the route caches the HTML in memory — after editing the file, re-copy to dist AND restart the workflow, or you'll test a stale version.
