---
name: Two public directories (top-level vs client/public)
description: server/index.ts serves BOTH public/ and client/public unconditionally — know which one a given asset actually needs to live in.
---

# Two public directories

The repo has two directories named `public/`:
- `client/public/` — Vite's real `publicDir` (root is `client/`). Anything here is copied into `dist/public/` by the build and is what `serveStatic()` serves in production via the compiled server.
- top-level `public/` (repo root) — served by a **separate, unconditional** `express.static(path.join(process.cwd(), "public"), ...)` call in `server/index.ts`, registered before the dev/prod branch. This runs in both `NODE_ENV=development` and `production`, and is NOT copied by the Vite build — it's read straight from the deployed source tree at request time.

**Why this matters:** files placed in top-level `public/` are served correctly in production too (confirmed: the live homepage hero image `hero-banner-1.webp` and its responsive variants exist ONLY in top-level `public/images/optimized/`, never in `client/public/` or `dist/public/`, and are genuinely live in production). Deployments ship the full source tree, not just `dist/`, so this works.

**How to apply:**
- For most images/media referenced by React components (`/images/...` URLs), top-level `public/` is an established, working convention in this project — no need to duplicate into `client/public/`.
- Exception already documented in `static-ad-pages.md`: the standalone ad-landing HTML routes have their own dist-first custom resolution logic (checks `dist/ad-assets/` before falling back to `public/`) — that specific mechanism is unrelated to the general `express.static` middleware described here and has its own gotchas.
- If an asset ever 404s only in production, check middleware *registration order* in `server/index.ts` first (a route registered earlier can shadow/hide a later static handler), not just which `public/` folder it's in.
