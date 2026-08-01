---
name: Bot-SSR blocks standalone blog pages
description: check-sitemap-200 uses Googlebot UA; bot-ssr hard-404s any path not in ssr-pages.ts before the Express route runs. Standalone HTML blog pages need a passthrough.
---

## The rule
Any standalone HTML blog page (those in `STANDALONE_BLOG_SLUGS`) MUST be listed in that shared array so `server/bot-ssr.ts` passes the request through to the Express route handler, rather than returning a hard 404.

## Why
`check-sitemap-200.ts` sends every sitemap URL with a **Googlebot UA**. `setupBotSSR()` is registered in `server/index.ts` at line 195 — *before* `registerRoutes()` at line 235. When bot-ssr receives a Googlebot request for a path not in `ssr-pages.ts`, it responds with `res.status(404)` and returns without calling `next()`. The Express route registered in `registerRoutes()` is never reached, so the sitemap check always sees 404 regardless of what the route handler does.

## How to apply
- When adding a new standalone blog page (a self-contained HTML file served via an Express GET route in `routes.ts`):
  1. Add the slug to `shared/standalone-blog-slugs.ts → STANDALONE_BLOG_SLUGS`
  2. The bot-ssr passthrough in `server/bot-ssr.ts` already imports `STANDALONE_BLOG_SLUGS` and calls `next()` for matching paths — no further change needed there.
  3. The blog-pages/ copy step in `script/build.ts` copies the entire directory to `dist/blog-assets/` automatically.
  4. The in-memory buffer load in `server/routes.ts` uses `dist/blog-assets/` (production) or `blog-pages/` (dev).
- Do NOT rely on `getPageSEO()` returning data for standalone pages — they carry their own JSON-LD in the HTML file.
