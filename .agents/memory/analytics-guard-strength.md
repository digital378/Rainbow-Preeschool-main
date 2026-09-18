---
name: Analytics guard strength
description: Principles for build-time checks that prevent static campaign pages from silently losing or duplicating analytics events
---

# Analytics guard strength

Static campaign-page guards must verify executable tracking calls and their interaction wiring, not merely search for event-name strings. For explicit page views, also require the expected destination and require every page-view-capable tag config to disable automatic page views.

**Why:** Bare string checks pass when an event name survives only in a log message or dead helper, and counting explicit page-view calls does not catch duplicate automatic page views restored by a config change.

**How to apply:** Add mutation tests that remove each dispatch, interaction binding, destination, and automatic-page-view flag. For lead conversions, require the dispatch to occur after the contact request's success check.