---
name: Bot-SSR content gap risk
description: server/bot-ssr.ts serves a hand-built synthetic HTML page to known bot user agents, built entirely from each route's entry in server/ssr-pages.ts — not from rendering the real React component tree.
---

This project's `server/bot-ssr.ts` intercepts requests from a hard-coded bot user-agent list (including "googlebot" and other crawlers/AI bots/SEO tools) *before* the real SPA is served, and returns a standalone HTML document assembled purely from that route's entry in `server/ssr-pages.ts` (title, description, intro text, `contentSections`, structured data, internal links).

**Why:** Fixing or enriching content in the actual React page component (e.g. `client/src/pages/*.tsx`) only changes what human visitors and hydrated clients see. It has zero effect on what Googlebot or any other listed bot receives, because bots never reach the React tree at all. Regular (non-bot) requests in dev also don't get server-rendered content — `curl` without a bot UA returns just the client shell.

**How to apply:** Whenever a task requires content to be "crawlable", "indexable", or "available in the initial server-rendered HTML", check whether the route's entry in `server/ssr-pages.ts` has a `contentSections` array covering that content — a rich, fully-featured React page can still have an empty or sparse SSR entry. Verify with `curl -A "Googlebot" <url>` against the actual route, not just visual/browser testing.

Byte-identical visitor/crawler HTML does not prove that the body is server-rendered: both may receive the same JavaScript app shell.

**Why:** A strict design freeze can make shared app-shell delivery preferable to replacing the visitor layout with the generic crawler summary, but page content then still depends on JavaScript. Head metadata/schema parity and initial-body coverage are separate guarantees.

**How to apply:** Inspect the actual response body and routing exceptions, not only the SEO data entry or equality check. Disclose JavaScript-dependent content when reporting parity. If adding full React SSR later, preserve the surrounding app navigation/footer as well as the page component; rendering the component alone is not necessarily the existing visitor layout.

**Correction:** a path listed in `NOINDEX_SLUGS` (`shared/seo-config.ts`) is NOT broken/404 for bots by default — `getPageSEO()`'s generic `noIndexPages` fallback branch serves it a real HTTP 200 with `noindex, nofollow`, a self-referencing canonical (falls back to request URL), and a generic (shared across ALL noindex fallback routes) title/body. Don't assume "it's in the noindex list" means "bots get nothing" — check the actual response before concluding a route needs a fix. The gap in this generic branch is content *quality* (one identical boilerplate title/description shared by every noindex utility page, e.g. `/ad`, `/flyer`, `/join-now`, `/GSC`), not brokenness. A route genuinely missing from every map in `server/ssr-pages.ts` gets a real 404 whose canonical hardcodes the homepage URL — that IS a bug, and is what `scripts/check-crawler-metadata.ts` (wired into predeploy) now guards against across every sitemap + client-router route.
