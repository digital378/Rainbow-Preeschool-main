---
name: Lighthouse simulated and observed LCP
description: Avoid interpreting the trace's fast first paint as a fast Lighthouse LCP score on programme pages.
---

On programme pages with a static first-paint hero later replaced by React, Lighthouse's *simulated* mobile LCP can remain near 20 seconds even when the trace's observed LCP is around 1 second. Do not conflate the two numbers or claim that the reported Lighthouse LCP improved because the initial H1 is visible.

**Why:** A nursery first-paint change reduced the trace's observed LCP to about 1–2 seconds but three Lighthouse simulated LCP runs still reported about 18–20 seconds. The LCP breakdown identified the hero heading and a short observed render delay; the headline audit and score remained slow.

**How to apply:** For performance reports, distinguish the `largest-contentful-paint` audit value from `metrics.details.items[0].observedLargestContentfulPaint`. Report the requested Lighthouse score and LCP without substituting the observed trace value. Investigate the model's resource dependency chain before attributing the gap to a visual or copy change.