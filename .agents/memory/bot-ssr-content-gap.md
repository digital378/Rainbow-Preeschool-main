---
name: Bot-SSR content gap risk
description: server/bot-ssr.ts serves a hand-built synthetic HTML page to known bot user agents, built entirely from each route's entry in server/ssr-pages.ts — not from rendering the real React component tree.
---

This project's `server/bot-ssr.ts` intercepts requests from a hard-coded bot user-agent list (including "googlebot" and other crawlers/AI bots/SEO tools) *before* the real SPA is served, and returns a standalone HTML document assembled purely from that route's entry in `server/ssr-pages.ts` (title, description, intro text, `contentSections`, structured data, internal links).

**Why:** Fixing or enriching content in the actual React page component (e.g. `client/src/pages/*.tsx`) only changes what human visitors and hydrated clients see. It has zero effect on what Googlebot or any other listed bot receives, because bots never reach the React tree at all. Regular (non-bot) requests in dev also don't get server-rendered content — `curl` without a bot UA returns just the client shell.

**How to apply:** Whenever a task requires content to be "crawlable", "indexable", or "available in the initial server-rendered HTML", check whether the route's entry in `server/ssr-pages.ts` has a `contentSections` array covering that content — a rich, fully-featured React page can still have an empty or sparse SSR entry. Verify with `curl -A "Googlebot" <url>` against the actual route, not just visual/browser testing.
