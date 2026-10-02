---
name: Predeploy smoke-test pitfalls
description: Homepage user-agent differences, local port collisions, schema contract drift, truncated publishing logs, and deployment-build environment boundaries.
---

## Homepage rendering paths

The homepage receives bot SSR for Googlebot, while a browser's initial HTML gets the SPA shell with a separate freshness injection. Never infer bot-visible metadata, H1, or schemas from the browser shell alone.

**Why:** An earlier note incorrectly said the homepage bypassed bot SSR; that assumption hid a real homepage description/H1 mismatch.

**How to apply:** Check initial browser HTML, Googlebot HTML, and hydrated visitor HTML separately before claiming homepage parity.

## Local smoke-test port collision

Run predeploy validation on an unused port when the development workflow already owns the script's default port.

**Why:** The smoke-test production server can fail to bind, while the script's reachability check mistakenly accepts the running development server. Later checks then report misleading failures against the wrong application instance.

**How to apply:** Set `PREDEPLOY_PORT` to a free port for local runs, then confirm the boot log says the production server bound to that port.

## Inherited performance-skip flag

Do not infer that performance was checked from predeploy's generic PASS summary. An inherited performance-skip flag can disable that stage even when the command does not explicitly request skipping it.

**Why:** Two successful validation runs printed the broad success summary while their performance stage was skipped by an existing environment setting. Separate screenshot-free performance checks then exposed a budget failure that the summaries did not show.

**How to apply:** When a full performance-inclusive run is required, explicitly enable the performance stage and inspect its log. If performance is measured separately, report that distinction and retain both passing and failing measurements.

## Schema contract drift

When a page intentionally switches from Article/FAQ/Organization markup to a dated WebPage, update the publishing checks to assert the new schema and that page's own publish date. Do not restore retired markup just to satisfy stale assertions.

**Why:** A publish was blocked by checks that still demanded retired schema types and a site-wide date on programme pages even though their rendered visitor and crawler output correctly used the page-specific WebPage contract.

**How to apply:** Compare both user-agent HTML paths against the current product decision, keep checks strict for the remaining page types, and run the whole pre-publish sequence after changing the assertions.

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
