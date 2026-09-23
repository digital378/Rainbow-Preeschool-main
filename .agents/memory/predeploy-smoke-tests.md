---
name: Predeploy smoke-test pitfalls
description: Homepage user-agent differences and truncated publishing logs.
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

## Homepage rendering paths

The homepage receives bot SSR for Googlebot, while a browser's initial HTML gets the SPA shell with a separate freshness injection. Never infer bot-visible metadata, H1, or schemas from the browser shell alone.

**Why:** An earlier note incorrectly said the homepage bypassed bot SSR; that assumption hid a real homepage description/H1 mismatch.

**How to apply:** Check initial browser HTML, Googlebot HTML, and hydrated visitor HTML separately before claiming homepage parity.

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
