---
name: Dense-file edit pitfalls
description: Process lessons for editing dense single-line-JSX files and verifying subagent fix claims
---

Two related pitfalls hit while landing a subagent-built page whose JSX was dense single-line code:

1. **Never combine an Edit tool call with a sed line-range delete on the same file in one batch.** The Edit shifts line numbers, so the sed range silently deletes the wrong lines (it orphaned two array entries and destroyed a riddle entry mid-file). If line-range deletion is needed, re-read the file AFTER any Edit and compute ranges fresh — or prefer exact-string Edits over sed for anything structural.

2. **Subagent "fixed it" reports on dense files can be partially false.** Brittle patch contexts mean style/handler edits get claimed but never land (state variables added, but no CSS, no event wiring). Require grep-verifiable acceptance evidence (e.g. `grep -c "ink-stamp"` must be >0) before believing a fix report, then spot-check yourself.

**Why:** both failure modes are invisible to esbuild/TS parse checks — the file still compiles while behavior is missing or data is corrupted.

**How to apply:** when delegating UI fixes on generated/dense components, put explicit grep-verifiable acceptance criteria in the followup; when editing such files yourself, one operation per file per batch, then verify with targeted greps.

Related: when e2e-verifying scroll-into-view behavior, sample scrollY over time from a distant start position — smooth-scroll journeys look like "no scroll" if measured once mid-flight or while already at the target.
