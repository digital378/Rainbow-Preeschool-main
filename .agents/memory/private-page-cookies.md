---
name: Private page cookies
description: Session establishment for protected SPA routes despite public HTML caching middleware
---

When protecting an SPA page with a session, issue its cookie on a dedicated redirect response before the request reaches the HTML renderer. Do not attach a new login cookie to the final page response.

**Why:** The existing public HTML middleware intentionally removes Set-Cookie headers to keep pages cacheable. A successful Basic-auth page request appeared to work, but its cookie was stripped and subsequent API requests failed. A 303 response retains the cookie; the redirected page then renders using that session.

**How to apply:** For any new protected page using cookie-based API access, verify both first-page login and a subsequent cookie-only API request, including through the development proxy and production renderer.