---
name: Preview banner layout offset
description: Distinguishing the development preview banner from a sticky-stage layout problem.
---

When checking a private full-screen walkthrough through the proxied development domain, account for the temporary development-preview banner. It can add roughly 45–71px above the page, making a sticky stage and its bottom-anchored panel appear cut off in screenshots even if the actual layout fits.

**Why:** The banner is injected by the development preview, not the walkthrough. Removing its DOM element during a browser session did not remove the layout offset. The same route viewed directly through the local dev server had no offset.

**How to apply:** Use the proxied domain to confirm the private route works, but assess the intended viewport fit with a direct local browser screenshot too. Check the stage's measured top before adjusting the panel's height for an apparent crop.