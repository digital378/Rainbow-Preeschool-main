---
name: Express catch-all path stripping
description: app.use("*", fn) in Express 4 rewrites req.url so req.path is always "/" inside the handler.
---

## The rule

Never use `app.use("*", fn)` as a SPA catch-all. Express 4's router strips
the matched path from `req.url`, so `req.path` is always `"/"` for every
request that reaches the handler.

## Correct pattern

```ts
// Wrong — req.path is always "/" inside the handler:
app.use("*", (req, res) => { /* req.path === "/" for every URL */ });

// Correct — no path arg; req.url / req.path retain the real URL:
app.use((req, res) => { /* req.path === "/faqs", "/about", … */ });
```

If you need the real path inside any `app.use(path, fn)` handler, use
`req.originalUrl.split("?")[0]` (always the unmodified original URL).

**Why:** injectPageSchemas was calling `getPageSEO("/")` for every SPA
route, silently returning the homepage schemas (EducationalOrganization +
WebSite) for all pages. The bug was invisible because the predeploy
smoke-test uses Googlebot UA → bot-ssr.ts (bypasses injectPageSchemas).

**How to apply:** Any new catch-all middleware that reads `req.path` to do
per-page logic must use `app.use(fn)` without a path arg or use
`req.originalUrl`.
