---
name: Private paths and shared UI
description: Why reusing private-preview components can silently suspend a public page in development
---

Keep UI shared with public pages outside directory names covered by the private preview's path guard. Do not weaken that guard to make an import work.

**Why:** Vite serves modules at paths containing their source directories. Importing a shared player from the guarded walkthrough directory caused an anonymous browser's module request to wait on Basic authentication. The whole lazy homepage content remained suspended without a useful page error. A browser that had already authenticated to the private preview displayed it normally, masking the problem.

**How to apply:** Move genuinely shared components to a neutral public component directory and update both consumers. Verify public pages in a fresh anonymous browser, including their lazy-loaded sections; a successful build or an authenticated preview does not catch this issue.