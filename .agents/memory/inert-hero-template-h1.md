---
name: Inert hero template H1
description: Avoid false duplicate-H1 findings when comparing raw HTML parsing with the live browser DOM.
---

When auditing non-home pages for duplicate H1s, exclude descendants of inert HTML templates from raw-document parser results. Compare against the live document DOM rather than counting every H1 token in the response.

**Why:** The home hero is held in a template on other routes. BeautifulSoup counts its H1 as ordinary markup, but that template's contents are not active document nodes and do not create a second page heading. Treating it as visible leads to a false SEO regression.

**How to apply:** For raw visitor-HTML comparisons, remove template elements before heading and word counts; verify a suspicious heading with document.querySelectorAll('h1') in the live browser.