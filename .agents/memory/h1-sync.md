---
name: H1 sync pattern
description: How SSR h1 and client <h1> tags must stay in sync, and where to find them.
---

The bot SSR system in `server/ssr-pages.ts` has an `h1:` field per URL in `staticPages`.
The client renders its own `<h1>` in the page component. These must match exactly.

**Why:** Google indexes the SSR h1 for bots; real users see the React-rendered h1.
Mismatch confuses ranking signals.

**How to apply:** When changing a page's h1 (either side), always update both:
- `server/ssr-pages.ts` → find the URL key → update `h1:` field
- The corresponding `client/src/pages/*.tsx` → find the `<h1>` element

Contact page is an intentional exception: SSR = "Contact Us — Rainbow Preschool International",
client = "Contact Us" (brand suffix stripped on client for visual cleanliness; guard allows this).
