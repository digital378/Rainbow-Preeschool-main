---
name: Post-merge dependency setup
description: Why merge reconciliation must clean-install npm dependencies rather than incrementally modifying the existing dependency tree.
---

Use an npm clean install for post-merge dependency reconciliation and deployment builds, with enough time for a full install and schema check.

**Why:** The workspace dependency tree can contain pnpm-style links even though the current npm lockfile is authoritative. Incremental npm installs then fail while renaming packages into hidden temporary paths. The repository also contains Python and JavaScript lockfiles, so deployment package detection can install only Python dependencies and leave Node build tools unavailable. A clean, explicit npm install removes both ambiguities.

**How to apply:** Keep post-merge and deployment setup non-interactive, explicit, and npm-lockfile-driven. Allow roughly three minutes so dependency installation and database schema reconciliation have a safe buffer. Do not restore Tailwind 4 or React 19 as an isolated version bump; the current CSS theme and React Three packages require coordinated migrations first.