---
name: Scroll-scrub video pacing
description: Why a buffered video may still lag behind a scroll-driven camera, and how to judge fixes.
---

For a scroll-driven video, do not equate `preload="auto"` or a full buffered range with smoothness. Random-access decoding and the number of video seconds mapped to each viewport of scrolling can still leave the displayed frame behind the scroll target.

**Why:** The opening segment was already buffered in a browser check, yet compressed scroll distance plus sparse keyframes made its displayed frame trail the scroll position. Native smooth scrolling through a whole scene also finished much faster than the video could present intermediate frames. A shorter keyframe interval and a longer desktop scroll runway improved decoded frame counts and reduced lag without forcing a complete upfront download.

**How to apply:** Compare `requestVideoFrameCallback` media times against the scroll-derived target, including buttons that navigate between scenes. Balance keyframe density, resolution, file size, and scroll distance separately for desktop and mobile; preserve still-image fallbacks for reduced motion and failed video.