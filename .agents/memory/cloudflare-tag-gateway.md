---
name: Cloudflare tag gateway interception
description: Why first-party analytics gateway script failures require edge configuration, not just Express routes
---

Production `/xrdb/` traffic is handled by Cloudflare's first-party Google tag gateway before reaching Express. Browser checks showed that some gateway scripts returned 404 while GA4 collection requests returned 204. The development Express route returned an empty 200 for these paths, which is not proof that production tracking is healthy and could silently discard requests if traffic reached the origin.

**Why:** Changing an Express route alone cannot correct a 404 generated upstream by the Cloudflare gateway. A partial fallback could also duplicate or lose measurements while other marketing tags still depend on the current tag setup.

**How to apply:** Investigate the gateway's edge configuration and actual browser request/response behavior before changing analytics transport. Preserve other marketing tags; do not mistake a successful collection request for proof that every gateway script loads. The existing Cloudflare API token lacked zone-settings access at the time this was investigated.