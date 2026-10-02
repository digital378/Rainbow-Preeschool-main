---
name: Isolated production runtime
description: Why workspace startup checks cannot prove that a published server has all required packages.
---

Validate production startup outside the workspace's module-resolution tree, and bundle the JavaScript dependencies used by server-side UI rendering.

**Why:** A publish passed its build and workspace startup checks but crashed in production because `react-dom/server` was unavailable. Copying the compiled executable outside the repository reproduced the exact crash. Including only React also exposed an excluded transitive UI dependency, so the complete rendering dependency chain matters.

**How to apply:** When adding server-rendered UI or changing bundle externals, use an isolated executable with no workspace `node_modules` access and exercise a rendered article as well as the homepage. Keep this check in prepublish validation; do not replace the crashing homepage with a fake healthy response.