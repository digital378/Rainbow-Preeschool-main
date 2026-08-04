---
name: Gallery image selection
description: Where to source classroom photos for pages — use the curated gallery config, not the raw optimized folder
---

# Gallery image selection

When picking classroom/activity photos for a page, use images from `client/src/lib/gallery-config.ts` (served from `/images/gallery/`) — each entry has a verified alt, caption, and category.

**Why:** The raw `/images/optimized/` folder is unreliable for picking by filename: the same photo exists under multiple filenames (e.g. the "paper binoculars" photo appears as both `classroom-kids-playing.webp` and `children-learning-colorful-toys-preschool.webp`), some images are rotated sideways, and many DSC* photos show kindergarten-style bench classrooms that are wrong for playgroup/toddler pages. Picking gallery images by filename there caused three rounds of user-reported mismatches.

**How to apply:** Search `gallery-config.ts` by caption/category first; if using `/images/optimized/` directly, always visually verify the image (read it) before wiring it into a page, and confirm the depicted classroom setup matches the target programme age (playgroup = floor play/mats, not benches).
