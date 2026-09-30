---
name: Google Maps embed checks
description: How to verify coordinate-based Google Maps iframes when HTTP probes disagree.
---

An HTTP HEAD request to a coordinate-based Google Maps embed URL can return 404 even while a browser GET redirects to a working embed with HTTP 200. Do not treat a failing HEAD probe alone as proof that the iframe is broken.

**Why:** A HEAD probe returned 404 for a real coordinate-based URL, but a browser-style GET redirected to the Google Maps embed endpoint and the iframe loaded with HTTP 200. The false negative could have led to replacing a working embed URL.

**How to apply:** Check the actual iframe network request after scrolling it near the viewport, including redirects and final status. For quick shell checks, use GET with redirect following rather than HEAD. Separately check for placeholder/dummy URLs, missing embed URLs, click-to-load gates, and frame restrictions.