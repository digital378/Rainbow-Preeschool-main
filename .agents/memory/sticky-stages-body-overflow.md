---
name: Sticky stages and body overflow
description: Why a correctly sized sticky scroll stage may still scroll away in the browser
---

When a sticky stage scrolls away despite a tall containing block, inspect the computed overflow of every ancestor before changing the stage layout. Setting only `overflow-x: hidden` on `body` can cause browsers to compute `overflow-y: auto`, making body a scroll container that does not receive the page's actual scrolling. The sticky child then appears not to stick.

**Why:** Multiple changes to the stage's grid and block layout did not help; a page-scoped `overflow-x: clip; overflow-y: visible` on body restored sticky positioning immediately without changing the scroll timing.

**How to apply:** For future immersive/sticky sections, compare the stage's bounding rectangle before and after scrolling, inspect computed ancestor overflow, and prefer a route-scoped overflow override rather than altering site-wide scrolling.