---
name: Asset cleanup reference safety
description: Safe, efficient reference checks for bulk workspace and uploaded-asset cleanup.
---

Evaluate dynamic directory consumers as well as explicit filenames before declaring an asset unreferenced. Keep inputs matched by code's directory/filter logic even when no import names them.

**Why:** Static-import-only checks miss assets consumed by image-processing scripts. The creator required preserving every code-referenced input and making no website changes during cleanup.

**How to apply:** Inspect directory enumeration/filtering and provenance/config references before deletion. Match actual filenames and path context, not suffix substrings that can confuse an unrelated image with a screenshot.

Use a bulk fixed-string search over source files rather than a Python regex scan of the entire source corpus separately for each asset.

**Why:** The per-asset regex cross-product timed out on this workspace; bulk ripgrep matching completed promptly.

**How to apply:** Build the filename set once, scan code once, then validate boundaries and ambiguous paths in the results. Keep the inventory outside deletion targets.