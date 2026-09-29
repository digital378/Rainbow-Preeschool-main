---
name: Dev proxy Lighthouse SEO
description: Why a mobile Lighthouse SEO score on Replit preview can be low despite correct app metadata.
---

The Replit development preview proxy can add an `X-Robots-Tag` response header containing `noindex` and `nofollow`. Lighthouse's crawlability audit treats that header as authoritative, so its SEO score can drop even when the app's own meta robots tag says `index, follow` and the origin itself omits the header.

**Why:** A page update was verified with matching canonical, indexable meta robots, and clean WebPage/BreadcrumbList schema, but the dev-domain audit failed crawlability due to the proxy header. The local origin did not send the header.

**How to apply:** When reporting preview Lighthouse SEO scores, inspect the failed audit's directive source and compare preview versus origin response headers before attributing the score to the page. Do not disable the proxy's protection in app code or assume the published domain has the same header.