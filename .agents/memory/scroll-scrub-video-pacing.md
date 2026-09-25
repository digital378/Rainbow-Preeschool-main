---
name: Scroll-scrub video pacing
description: Keep the walkthrough responsive when its scroll-driven video cannot decode as quickly as the visitor scrolls.
---

For the /dummy walkthrough, scrolling and scene text must respond immediately to the visitor, even when the video decoder falls behind. Keep video as the default moving backdrop, but temporarily show the scene stills during a large timing gap and restore the video once it catches up. Shorten the scroll runway rather than making visitors scroll many screen-heights to finish.

**Why:** Buffering alone did not prevent decoding lag. A prior attempt to prioritize every moving frame stretched the desktop journey to nearly 18 screen-heights; the visitor reported slow and stuck scrolling and explicitly requested both fast scrolling and video. Holding scene text until video decoding completes sacrifices responsiveness. Still images are a better temporary bridge than blocking the page or showing the wrong scene text.

**How to apply:** Treat scroll position as authoritative for panel text and stills; compare presented media time with the scroll target to decide when the video is safe to display. Let large seeks catch up quickly instead of forcing long playback, but preserve moving frames when nearby. Check wheel input over scrollable cards, reverse scrolling, scene buttons, and idle video recovery on desktop and mobile. Preserve still-image fallbacks for reduced motion and failed video.