---
name: Predeploy smoke-test suite
description: How the predeploy.sh smoke-tests work, what each checks, and known gotchas when the homepage is SPA-served.
---

# Predeploy smoke-test suite

## What runs (predeploy.sh steps 5–7.5)
All four run against the PRODUCTION built server (`node dist/index.cjs`) on port 5000, booted after `npm run build`.

| Script | What it checks | Pass criteria |
|---|---|---|
| `check-freshness-signal.ts` | 29 URLs (commercial + locality + evergreen) emit byline + Article JSON-LD + dateModified | 29/29 OK |
| `check-keyword-targets.ts` | 5 commercial pages: FAQPage JSON-LD, canonical, byline; 2 deep-content pages ≥1200 words; 98 ghost-slug 301s | All assertions pass |
| `check-sitemap-200.ts` | Every `<loc>` in /sitemap.xml returns 200 | 80/80 |
| `check-bot-detection.ts` | `TEST_PATH` page: real-user UAs get `<div id="root">`; Googlebot gets JSON-LD | 4/4 |

## Homepage SPA exception

The homepage `/` is intentionally excluded from bot-ssr.ts. This affects two checks:

### check-freshness-signal
`/` stays in `EVERGREEN_LANDER_URLS` because `server/homepage-freshness.ts` injects Article JSON-LD and the hidden byline `<div>` directly into the SPA shell HTML (before `</head>` and `</body>`) for both dev and production. The check still passes 29/29.

**Production path:** `server/static.ts` — `app.get("/")` registered BEFORE `express.static(distPath, { index: false })` so the explicit handler wins. Reads `dist/public/index.html`, calls `injectHomepageFreshness("/", html)`, sends result.

**Dev path:** `server/vite.ts` — `injectHomepageFreshness(url, page)` called inside the Vite catch-all handler.

### check-bot-detection
`TEST_PATH = "/about"` (not `/`). The homepage is SPA-served so Googlebot gets `<div id="root">` there, not JSON-LD. `/about` is a stable Bot-SSR'd page that proves the middleware is alive.

## API log truncation gotcha
`getDeploymentBuild()` returns only ~75 lines of build logs. The Replit UI shows the full output. If a build is failing and the API logs look clean, there may be more failing steps after the truncation point. Check the Replit Publishing > Logs UI directly.

**Why:** The 123536da build had 3 failing predeploy steps. The API returned logs ending at step 6 (keyword-targets), but step 7.5 (bot-detection) also failed — only visible in the full UI logs.

## Verifying fixes before publish
Always run the production server locally to confirm all 3 checks pass:
```bash
npm run build
PORT=5001 NODE_ENV=production node dist/index.cjs &
PROD_PID=$!
# wait for ready, then:
npx tsx scripts/check-freshness-signal.ts http://127.0.0.1:5001
npx tsx scripts/check-bot-detection.ts http://127.0.0.1:5001
npx tsx scripts/check-keyword-targets.ts http://127.0.0.1:5001
kill $PROD_PID
```
