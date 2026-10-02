---
name: Design worker write scope
description: Coordinate shared/server/public foundations separately from scoped frontend design workers.
---

Treat a design worker's `outputDir` as its write boundary. Use a general worker or the main agent for shared content, server renderers and public assets outside that boundary.

**Why:** A design worker scoped to the client source directory produced the frontend but could not create the shared content/rendering contract or the public stylesheet, despite those files being explicitly included in its task. Parallel server work then depended on missing imports.

**How to apply:** Establish cross-directory interfaces and ownership before delegating. Give the design worker only frontend files within its scope, and assign the shared/server/public foundation separately. Do not assume a longer task description overrides the output-directory constraint.

## Exact template reuse

When the user requires the same existing template, require literal reuse of its base styles and component classes—not a new stylesheet that merely resembles its palette and fonts. Check document structure and interaction state transitions yourself before accepting a handoff.

**Why:** A festival-guide handoff described faithful reuse while using a substantially rewritten stylesheet. Other handoffs retained duplicate document shells or failed to reset quiz controls between questions.

**How to apply:** Compare the reference and resulting base CSS directly, confirm one document shell, and exercise the complete quiz and replay. Keep any adapters narrowly scoped to new server-rendered content.