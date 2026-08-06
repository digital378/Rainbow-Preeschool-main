---
name: Tester elementFromPoint pointer-events false negative
description: A testing subagent reported a fixed-position tricolour scroll-progress bar as "not observed" even though it was clearly visible in the actual screenshots.
---

When a UI element has `pointer-events: none` (common for fixed overlays like scroll-progress bars, that shouldn't intercept clicks), `document.elementFromPoint(x, y)` skips it entirely during hit-testing — it returns whatever is visually underneath instead.

**Why:** A testing subagent that verifies "is element X at the top of the viewport" via `elementFromPoint` (rather than inspecting rendered pixels) will get a false negative for any `pointer-events:none` element, even when it is rendering correctly on screen.

**How to apply:** When a tester reports a fixed/overlay element as "not observed" or "not found at that position", don't assume it's a real bug — pull the actual screenshot image (`viewImage`) and check the pixels before trusting a DOM-hit-testing-based verdict.
