---
name: Wouter server location
description: Wouter's static memory-location hook is not safe for React server rendering in this workspace.
---

Use Wouter's native Router `ssrPath` when rendering visitor components on the server. A memory-location hook with `static: true` is not an SSR substitute.

**Why:** The installed memory-location hook uses `useSyncExternalStore` without a server snapshot. Its static option still produced a production HTTP 500 with “Missing getServerSnapshot” when rendering the page.

**How to apply:** For server-rendered Wouter links and navigation, supply the request path through `ssrPath`. If upgrading Wouter or using a custom location hook, verify a production server render before relying on a browser-only test.