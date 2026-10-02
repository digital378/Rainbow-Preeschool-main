---
name: Idle loading and LCP
description: First-paint performance lessons for deferred scripts and font loading on text-led pages.
---

On a text-led page, calling `requestIdleCallback` as soon as `load` fires does not necessarily defer work beyond first paint. A quiet local browser may run it immediately and download GTM and chat within a few hundred milliseconds of navigation.

**Why:** Production-build mobile Lighthouse network timings showed both arriving near the first paint despite their idle scheduling. Explicit post-load delay with a first-interaction fallback reduced transferred JavaScript and Total Blocking Time. Conversely, preloading an additional Inter font and then trying its local copy both worsened observed LCP across attempts; font-request prioritisation and repaint timing mattered more than eliminating one network hop.

**How to apply:** For noncritical third parties, measure actual request start times rather than inferring deferral from an idle callback. Preserve an interaction trigger so users who need chat or tracking do not wait. For text LCP, benchmark font preload/source changes on a production build and revert them if they regress LCP; do not assume preloading more fonts helps.

For a text-first page with a stationary first-paint H1, changing a Google Fonts stylesheet to a narrower weight and `display=swap` alone had little effect on simulated mobile LCP. Removing that page's high-priority Poppins font preload (while retaining the stylesheet) reduced simulated LCP substantially without changing the final font. **Why:** The preload competed for first-paint bandwidth even though the text could initially paint in a fallback font. **How to apply:** Test both the stylesheet and preload priorities separately on the production build, and check font appearance after load as well as LCP.

A paint-boundary delay around React mounting is not a delay around its static imports, module preloads, or render-blocking stylesheet fetches.

**Why:** Mount-only deferral left the text-led hub over its LCP budget. Delaying entry fetch/evaluation and the shared stylesheet, while retaining complete critical styles, produced consecutive passing production checks.

**How to apply:** Inspect actual request timing. When keeping the app off first paint, schedule entry loading at the HTML shell rather than only delaying mounting inside an already loaded module. Include the reference theme tokens and component utilities in critical CSS; wait for the full stylesheet before mounting shared navigation. Preserve a no-JS stylesheet path and stationary content.

Long multilingual standalone guides can request fonts for off-screen chapters during initial layout, even when every image is lazy-loaded.

**Why:** The festival guide's below-fold Devanagari text triggered substantial early font downloads; these competed with its hero in simulated mobile loading. Skipping off-screen chapter layout, removing an unused italic preload, and matching the preload to the actual responsive image brought LCP within budget without changing the fonts or template.

**How to apply:** Inspect requested font files before changing typography. Consider page-scoped `content-visibility:auto` with intrinsic-size estimates while retaining all initial HTML text. Verify chapter anchors, tabs, FAQ and the complete quiz afterwards; do not apply the change to other pages without measuring them.