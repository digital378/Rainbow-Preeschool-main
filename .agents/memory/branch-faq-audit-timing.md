---
name: Branch FAQ audit timing
description: Avoid false negatives when checking rendered branch FAQ answers.
---

On visitor branch pages, do not scroll to the FAQ immediately after DOMContentLoaded when auditing phone numbers or text. Wait for the React section heading to mount, then scroll that section into view and wait for its answers to load. Bot HTML already contains the answers.

**Why:** A too-early scroll targets no section or bypasses its intersection trigger, so the visitor DOM appears to contain only FAQ questions even though the answers work after hydration and scrolling.

**How to apply:** In browser checks of branch FAQ content, confirm the hydrated FAQ heading exists before scrolling; inspect answers only after they are present in the DOM.