---
name: Rendered font verification
description: Verify genuine typefaces and weights rather than trusting computed CSS font names.
---

When a request requires a genuine brand typeface and specific weights, inspect the browser's actual platform font records, including the loaded face/PostScript name. Computed `font-family` and `font-weight` alone are not sufficient.

**Why:** Legacy fallback faces can reuse brand family names, and the browser can synthesise missing bold weights. A computed Poppins declaration therefore does not prove that Poppins ExtraBold or Bold supplied the rendered glyphs.

**How to apply:** Check representative H1, H2, H3 and body nodes after fonts settle. Confirm the actual custom faces and requested weights. This inspection needs no screenshots. Use distinct page-scoped aliases when changing a global fallback registration would alter pages outside the request.

For the near-me hub, a homepage-match request supersedes earlier page-specific font and extra-bold weight requirements. Reuse the homepage loader instead of restoring independent font files or aliases.

**Why:** The creator explicitly replaced the custom typography direction with the homepage's lighter heading and compact control patterns.

**How to apply:** Treat actual homepage components as the current reference, verify their rendered faces, and do not reintroduce superseded page-only font requirements.