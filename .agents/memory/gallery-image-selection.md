---
name: Gallery image selection
description: Where to source classroom photos for pages — use the curated gallery config, not the raw optimized folder
---

# Gallery image selection

When picking classroom/activity photos for a page, use images from `client/src/lib/gallery-config.ts` (served from `/images/gallery/`) — each entry has a verified alt, caption, and category.

**Why:** The raw `/images/optimized/` folder is unreliable for picking by filename: the same photo exists under multiple filenames (e.g. the "paper binoculars" photo appears as both `classroom-kids-playing.webp` and `children-learning-colorful-toys-preschool.webp`), some images are rotated sideways, and many DSC* photos show kindergarten-style bench classrooms that are wrong for playgroup/toddler pages. Picking gallery images by filename there caused three rounds of user-reported mismatches. Branch-photo filename uniqueness is not visual uniqueness: existing branches can contain the same source image under different names.

**How to apply:** Search `gallery-config.ts` by caption/category first, but treat its captions as hints only — always visually read the actual image file before wiring it in (its captions have been wrong too: `classroom-activity-01` is the binoculars photo, `happy-times-01` is the daycare bunk room). Write the page caption to match what the photo actually shows rather than forcing a pre-chosen caption onto an ambiguous photo. Confirm the depicted classroom setup matches the target programme age (playgroup = floor play/mats, not benches; group photos must not show the daycare bunk room). For new branch photos, compare image content against all existing branch photos, not just filenames; use source matching or perceptual comparison in addition to the registry guard.
