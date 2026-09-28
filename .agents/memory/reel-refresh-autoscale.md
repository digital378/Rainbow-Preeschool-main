---
name: Reel refresh on Autoscale
description: The accepted tradeoff for refresh timing when the published server can sleep
---

Keep the reel feed's in-process six-hour timer and check cache freshness and URL expiry whenever the feed is requested. If a media URL is already expired, wait for a refresh before replying; if Instagram fails, return the poster and permalink without the expired media URL. For an old cache or URLs within a day of expiry, respond with usable cached data and refresh in the background.

**Why:** The user explicitly declined a separate Scheduled Deployment. An Autoscale deployment can scale to zero when idle, so a server timer cannot guarantee a wall-clock six-hour refresh while nobody visits.

**How to apply:** Do not claim the timer runs during idle periods or add another deployment without a new user request. Preserve request-time checks as the recovery path on the next visit.