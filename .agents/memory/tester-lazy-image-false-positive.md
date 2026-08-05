---
name: Tester lazy-image false positive
description: A testing subagent flagged small `loading="lazy"` icon images as "broken" (naturalWidth 0) when it checked all `<img>` tags without scrolling each one into view first.
---

Small, cheap-to-load icon/illustration images (a few KB each) marked `loading="lazy"` on a long page can report `complete=false`/`naturalWidth=0` to a tester's JS check if the tester queries all `<img>` elements at once instead of scrolling each into view and waiting. This looks like a broken-image bug but is really a timing artifact of native lazy loading.

**Why:** Native `loading="lazy"` defers the network fetch until the element nears the viewport. A tester (or any automated check) that inspects `img.naturalWidth` across the whole DOM without scrolling past every image first will see unloaded — not broken — images.

**How to apply:** Before concluding an image is broken from a tester report, `curl -I` the asset URL directly to confirm it serves 200 with the right content-type/size. If it does, the images are fine — either have the tester scroll fully through the page before checking, or simply drop `loading="lazy"` on small assets (a handful of ~5-15KB icons isn't worth lazy-loading anyway) to remove the ambiguity entirely.
