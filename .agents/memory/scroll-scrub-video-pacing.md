---
name: Scroll-scrub video pacing
description: Why a buffered video may still lag behind a scroll-driven camera, and how to judge fixes.
---

For a scroll-driven video, do not equate `preload="auto"` or a full buffered range with smoothness. Random-access decoding and the number of video seconds mapped to each viewport of scrolling can still leave the displayed frame behind the scroll target. Repeated one-frame seeks can make a working MP4 look like a slideshow; let forward scrolling play through intermediate frames, and let the displayed media frame—not the scroll destination—determine which scene text is shown.

**Why:** The opening segment was already buffered in a browser check, yet compressed scroll distance plus sparse keyframes made its displayed frame trail the scroll position. Native smooth scrolling through a whole scene also finished much faster than the video could present intermediate frames. A shorter keyframe interval and a longer desktop scroll runway improved decoded frame counts and reduced lag without forcing a complete upfront download. Even with those changes, an MP4 paused between direct seeks still looked static, and simultaneous text-panel crossfades produced unreadable overlap during transitions.

**How to apply:** Compare `requestVideoFrameCallback` media times against the scroll-derived target, including buttons that navigate between scenes and reverse scrolling. Inspect intermediate frames and text-panel handoffs, not only settled endpoints. Show only one readable panel at a time. Balance keyframe density, resolution, file size, and scroll distance separately for desktop and mobile; preserve still-image fallbacks for reduced motion and failed video.