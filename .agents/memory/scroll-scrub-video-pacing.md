---
name: Scroll-scrub video pacing
description: Keep the walkthrough video visibly moving during scrolling without hiding it behind fallback stills.
---

For the /dummy walkthrough, scrolling and scene text must respond immediately to the visitor, and the moving video must remain visible during scroll. Once the video is ready, do not cover it with the still-image layer merely because its displayed time briefly trails the scroll destination. Reserve stills for loading, reduced motion, data saving, or genuine video failure. Keep the scroll runway short enough to feel responsive.

**Why:** Buffering alone did not prevent decoding lag. A prior attempt to prioritize every moving frame stretched the desktop journey to nearly 18 screen-heights; the visitor reported slow and stuck scrolling. A later fix shortened the runway but faded the stills back in whenever video lag exceeded a threshold. Browser frame callbacks showed the video was actually moving behind that opaque layer while the visitor saw static images; the user explicitly rejected this and required the background video to move with scrolling.

**How to apply:** Treat scroll position as authoritative for scene text. Let the video seek near large jumps and play through nearby frames to stay close to the scroll target, including reverse scrolling. Check *visible* video frames and the stills' computed opacity during continuous forward and reverse movement, not just video.currentTime or settled endpoints. Test wheel input over scrollable cards and scene buttons on desktop and mobile. Preserve still-image fallbacks for reduced motion and failed video, not transient decoder lag.