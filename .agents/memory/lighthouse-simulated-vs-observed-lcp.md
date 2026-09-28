---
name: Lighthouse simulated and observed LCP
description: Why a first-paint heading can still score badly in Lighthouse when React replaces or moves it.
---

On programme pages with a static first-paint hero later replaced by React, Lighthouse's *simulated* mobile LCP can remain near 20 seconds even when the trace's observed LCP is around 1 second. Merely retaining the same DOM node is not enough if it is moved into the React tree after JavaScript: the move can trigger another paint. Keeping the original heading stationary while React reserves matching, visually hidden space for it avoids this late LCP candidate.

**Why:** The initial nursery hero rendered quickly, but replacing or moving its H1 during hydration kept three simulated mobile LCP runs at roughly 18–20 seconds. A stationary heading reduced all three to roughly 2–3 seconds without changing the final hero geometry.

**How to apply:** Distinguish the `largest-contentful-paint` audit value from the trace's observed LCP. Inspect the selected LCP DOM node across hydration, not just whether an initial H1 exists. If the initial node must remain outside React, reserve the same geometry inside React, hide the duplicate visual and clean up the external node on route changes; verify alignment at multiple widths.