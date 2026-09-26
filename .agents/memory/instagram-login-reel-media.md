---
name: Instagram Login reel media
description: API/token compatibility and missing playback URLs in Instagram video records
---

Instagram Login access tokens can work with Instagram's Graph host but fail against Facebook's Graph host. An Instagram `VIDEO` item may have a thumbnail and permalink while omitting its direct media URL, even when adjacent videos are playable. A live collaborative reel can have this response: "live on Instagram" does not imply Graph permits direct on-site playback.

**Why:** A valid school account returned a mixed page of playable and non-playable video records. Treating every `VIDEO` as an inline stream makes older playlist selections silently fail.

**How to apply:** Probe the correct API host without printing credentials; keep non-playable records visible with an Instagram post link, and choose an item with a media URL for in-page autoplay. Do not turn API errors into an apparently empty feed. An official Instagram embed is a useful after-tap fallback but may show "Watch on Instagram" instead of playing inline; guaranteed inline playback requires a source video that the app can serve. Embedded Instagram content needs at least a 326px inner layout width on small phones, and cross-origin iframes can paint blank inside an isolated player when scaled.