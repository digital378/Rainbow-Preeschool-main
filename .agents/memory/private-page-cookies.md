---
name: Private page cookies
description: Session establishment for protected SPA routes despite public HTML caching middleware
---

When protecting an SPA page with a session, issue its cookie on a dedicated redirect response before the request reaches the HTML renderer. Do not attach a new login cookie to the final page response. In an embedded Replit preview, render a visible sign-in form rather than relying on an HTTP Basic authentication challenge.

**Why:** The existing public HTML middleware intentionally removes Set-Cookie headers to keep pages cacheable. A successful Basic-auth page request appeared to work, but its cookie was stripped and subsequent API requests failed. A 303 response retains the cookie; the redirected page then renders using that session. HTTP Basic challenges are invisible in the embedded preview and appear as a blank white page; modern cross-site iframes may also block ordinary third-party session cookies.

**How to apply:** For protected preview pages, keep unauthenticated private assets closed but serve a form on the page URL. Use a secure partitioned cookie for an HTTPS embedded preview, and provide a top-level sign-in option for browsers that still block iframe cookies. Verify first-page login, the redirected page, and a subsequent cookie-only private asset request through the development proxy, including with third-party cookies disabled.