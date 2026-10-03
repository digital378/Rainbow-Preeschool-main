---
name: Keep the preview online
description: User-required rules for checks, smoke-test ports and restarts.
---

Never stop, kill or restart the "Start application" workflow, and never restart the workspace, just to run checks. The preview on port 5000 must stay online during tasks.

Run predeploy or any production-server smoke test only on a spare port (5199), never 5000.

During normal tasks run only the checks the task needs (for example: npm run build, plus targeted tests). Run the full 18-step predeploy only when the user asks for a publish check.

If a restart is truly required, do it once at the very end of the task and say so in the report.

**Why:** The user explicitly requires checks to leave the preview online.

**How to apply:** Keep the preview workflow running, use 5199 for smoke tests only if it is free, and never kill a listener to free the port. Monitor port 5000 during requested full predeploy verification.