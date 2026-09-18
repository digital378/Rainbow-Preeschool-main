---
name: Post-merge dependency setup
description: Why merge reconciliation must clean-install npm dependencies rather than incrementally modifying the existing dependency tree.
---

Use an npm clean install for post-merge dependency reconciliation, with enough time for a full install and schema check.

**Why:** The workspace dependency tree can contain pnpm-style links even though the current npm lockfile is authoritative. Incremental npm installs then fail while renaming packages into hidden temporary paths. A clean install removes that mixed generated state first.

**How to apply:** Keep post-merge setup non-interactive and lockfile-driven. Allow roughly three minutes so dependency installation and database schema reconciliation have a safe buffer.