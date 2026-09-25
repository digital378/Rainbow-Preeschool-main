---
name: Predeploy smoke-test pitfalls
description: Homepage user-agent differences, truncated publishing logs, and deployment-build environment boundaries.
---

## Homepage rendering paths

The homepage receives bot SSR for Googlebot, while a browser's initial HTML gets the SPA shell with a separate freshness injection. Never infer bot-visible metadata, H1, or schemas from the browser shell alone.

**Why:** An earlier note incorrectly said the homepage bypassed bot SSR; that assumption hid a real homepage description/H1 mismatch.

**How to apply:** Check initial browser HTML, Googlebot HTML, and hydrated visitor HTML separately before claiming homepage parity.

## API log truncation gotcha
`getDeploymentBuild()` returns only ~75 lines of build logs. The Replit UI shows the full output. If a build is failing and the API logs look clean, there may be more failing steps after the truncation point. Check the Replit Publishing > Logs UI directly.

**Why:** A failed build's API logs stopped before a later failing check, which was only visible in the full UI logs.

## Deployment build is not production runtime
Keep local/predeploy validation free of external production mutations. Do not use `REPLIT_DEPLOYMENT` to identify a deployment build; it is set in the published app's runtime, not reliably in the build phase. A cache purge belongs after a successful production release, outside the build script.

**Why:** The build also runs before promotion and may fail, while the same validation script can be invoked locally. Purging the live cache there would affect the current release, not the new one.

**How to apply:** For future CDN invalidation, arrange a separate post-release trigger and verify it only runs after the new version is serving; leave build-time checks read-only against live services.

## Attribution guard context
Visible-byline checks should require specific attribution evidence, not any nearby mention of a parent in unrelated page copy.

**Why:** A centre locality next to a "Parent Partnership" trust-card heading was misidentified as a person's byline and blocked an otherwise valid publish.

**How to apply:** When changing editorial guards, test both real person attributions and unrelated names beside family-oriented text. Run the full publish checks, not only the individual guard.
