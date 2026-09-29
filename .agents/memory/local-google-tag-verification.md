---
name: Local Google tag verification gap
description: Limits of verifying delayed GA4 delivery from the local production-build browser.
---

A local Chromium run may fetch the initial Google tag script successfully but block a secondary Google tag request with `ERR_BLOCKED_BY_ORB`. In that state, no GA4 collect request appears even if the app correctly queues the configuration, page view, and contact events.

**Why:** A test of the preschool comparison page confirmed a single queued page view, a delayed GTM request, and contact events queued before the GTM response, but could not establish account-level receipt because the secondary request was blocked. Treating that local network observation as proof of GA4 delivery would overstate the result.

**How to apply:** Test queue order and timing locally without sending synthetic events to the real analytics account. After the user approves publishing, separately verify one page view and each contact event in the live analytics destination, checking for duplicates. Never claim that a queued event guarantees receipt when Google scripts or network requests are blocked.