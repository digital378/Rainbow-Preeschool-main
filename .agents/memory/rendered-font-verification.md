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

## Cold versus warm comparisons

An `optional` font loader can leave a cold mobile visit using fallback glyphs even after `document.fonts.ready`, while a later cached desktop visit uses the real face. Changing to `swap` therefore makes a cold geometry baseline incomparable without controlling font availability.

**Why:** Identical computed families, weights and frozen CSS produced different metadata widths when one visit retained fallback glyphs and the other loaded Inter. Desktop geometry already matched once the fonts were cached.

**How to apply:** Compare the same actual rendered faces in design checks; keep a separate cold-fallback check where useful, and disclose font-loading differences rather than silently relaxing geometry checks. When self-hosting for performance, copy the exact original font binaries and preserve individual weight declarations and Unicode ranges: replacing separate weights with a variable-weight range can change intermediate requested weights.

Moving font rules into one initial stylesheet can also change which face wins against a broad-weight local alias. A design freeze requires checking each affected weight and selector, not assuming all bold text uses one face.

**Why:** In the symbols guide, real Inter 600 matched the reference metadata, while some riddle text retained a native fallback. Removing the alias corrected 600 but changed riddle line heights; extending the local alias across all higher weights changed other labels and buttons.

**How to apply:** Inspect actual platform fonts for representative labels, buttons and body text at each affected weight. Do not extend an observed fallback to other weights without comparison, or treat matching computed font-family strings as proof of an unchanged design.