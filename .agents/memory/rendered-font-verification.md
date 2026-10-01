---
name: Rendered font verification
description: Verify genuine typefaces and weights rather than trusting computed CSS font names.
---

When a request requires a genuine brand typeface and specific weights, inspect the browser's actual platform font records, including the loaded face/PostScript name. Computed `font-family` and `font-weight` alone are not sufficient.

**Why:** Legacy fallback faces can reuse brand family names, and the browser can synthesise missing bold weights. A computed Poppins declaration therefore does not prove that Poppins ExtraBold or Bold supplied the rendered glyphs.

**How to apply:** Check representative H1, H2, H3 and body nodes after fonts settle. Confirm the actual custom faces and requested weights. This inspection needs no screenshots. Use distinct page-scoped aliases when changing a global fallback registration would alter pages outside the request.