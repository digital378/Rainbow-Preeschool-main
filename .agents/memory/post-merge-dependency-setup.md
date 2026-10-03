---
name: Post-merge dependency setup
description: Reuse dependencies after ordinary merges; reserve clean installs for fresh deployment environments or mixed-tree repair.
---

Do not clean-install dependencies on every merge. Reuse the existing dependency tree when the npm lockfile is unchanged; keep the creator's hash-based post-merge setup.

**Why:** The creator explicitly requested stopping repeated node_modules deletion to reduce merge/build delays and preview restart time.

**How to apply:** Preserve the supplied post-merge script rather than restoring npm ci as a routine merge step. Database schema reconciliation still runs on each merge.

The npm lockfile remains authoritative. A clean install is appropriate for a fresh deployment environment or a demonstrated broken dependency tree, not as the default response to every merge.

**Why:** A previous pnpm-linked workspace tree caused incremental npm renames to fail. Mixed Python/JavaScript lockfiles can also mislead deployment dependency detection.

**How to apply:** If dependency installation actually fails, inspect for mixed package-manager links and repair that specific condition. Keep deployment installation explicit and non-interactive. Do not restore Tailwind 4 or React 19 as isolated version bumps; the CSS theme and React Three packages require coordinated migrations.