---
name: Instagram Login reel media
description: API/token compatibility and missing playback URLs in Instagram video records
---

Instagram Login access tokens can work with Instagram's Graph host but fail against Facebook's Graph host. An Instagram `VIDEO` item may have a thumbnail and permalink while omitting its direct media URL, even when adjacent videos are playable. A live collaborative reel can have this response: "live on Instagram" does not imply Graph permits direct on-site playback.

**Why:** A valid school account returned a mixed page of playable and non-playable video records. Treating every `VIDEO` as an inline stream makes older playlist selections silently fail.

**How to apply:** Probe the correct API host without printing credentials; do not treat an absent `media_url` as a deleted post. An official Instagram embed may show "Watch on Instagram" instead of playing inline, so it is not a solution when the requirement is on-page playback. For a reel the site owner authorizes, a one-time retrieval from its public post can sometimes obtain a progressive video even when Graph omits `media_url`; verify the actual footage, then host a stable copy rather than scraping at runtime. Offer both MP4 (Safari-compatible) and VP9/Opus WebM: the test browser received a valid H.264/AAC MP4 with HTTP 206 but lacked H.264 decoding, while the WebM played immediately. When neither source is available, show an honest unavailable state instead of a play button that silently links away.