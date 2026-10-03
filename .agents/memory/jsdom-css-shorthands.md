---
name: JSDOM CSS shorthand limitations
description: Avoid false negatives when testing computed scroll-container styles in JSDOM.
---

JSDOM does not reliably expand the computed `overflow` shorthand into `overflowX` and `overflowY`.

**Why:** A lazy-mounted scroller styled with `overflow: auto` had empty computed axis longhands in a unit test, whereas an explicit `overflow-y: auto` worked. Treating empty longhands as proof that the element is not scrollable gave a false negative.

**How to apply:** Account for the shorthand when testing scroll-container detection, and verify actual scrolling behavior in the browser rather than assuming JSDOM has complete CSS computed-style support.