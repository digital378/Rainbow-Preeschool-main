---
name: Idle loading and LCP
description: First-paint performance lessons for deferred scripts and font loading on text-led pages.
---

On a text-led page, calling `requestIdleCallback` as soon as `load` fires does not necessarily defer work beyond first paint. A quiet local browser may run it immediately and download GTM and chat within a few hundred milliseconds of navigation.

**Why:** Production-build mobile Lighthouse network timings showed both arriving near the first paint despite their idle scheduling. Explicit post-load delay with a first-interaction fallback reduced transferred JavaScript and Total Blocking Time. Conversely, preloading an additional Inter font and then trying its local copy both worsened observed LCP across attempts; font-request prioritisation and repaint timing mattered more than eliminating one network hop.

**How to apply:** For noncritical third parties, measure actual request start times rather than inferring deferral from an idle callback. Preserve an interaction trigger so users who need chat or tracking do not wait. For text LCP, benchmark font preload/source changes on a production build and revert them if they regress LCP; do not assume preloading more fonts helps.

For a text-first page with a stationary first-paint H1, changing a Google Fonts stylesheet to a narrower weight and `display=swap` alone had little effect on simulated mobile LCP. Removing that page's high-priority Poppins font preload (while retaining the stylesheet) reduced simulated LCP substantially without changing the final font. **Why:** The preload competed for first-paint bandwidth even though the text could initially paint in a fallback font. **How to apply:** Test both the stylesheet and preload priorities separately on the production build, and check font appearance after load as well as LCP.