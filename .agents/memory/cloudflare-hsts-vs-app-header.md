---
name: Cloudflare HSTS vs app-level header
description: An app-level Strict-Transport-Security header doesn't cover the bare/apex-domain redirect issued by Cloudflare before the request reaches the origin server.
---

This project's Express app sets `Strict-Transport-Security` itself (e.g. via helmet/manual middleware) on responses it serves, which covers `www.<domain>`. But `<domain>` (no www) → `www.<domain>` is a 301 issued directly by Cloudflare at the edge and never reaches Express, so it lacked the header even though the final destination had it. An external audit correctly flagged this as `noHsts`.

**Why:** Browsers only start enforcing HSTS after they've received the header once; a first-hit redirect without it leaves a small window where that specific hop isn't HSTS-protected. Zone-level HSTS via Cloudflare's `security_header` setting applies to every response from the zone, including edge-issued redirects.

**How to apply:** Check current state via `cloudflare.request({ method: "GET", path: "/zones/<zone_id>/settings/security_header" })` (Cloudflare MCP). If `strict_transport_security.enabled` is `false`, enabling it (mirror the app's existing `max_age`/`include_subdomains` values) fixes the gap without needing an app-level change. Avoid turning on `preload` unless the user explicitly wants HSTS-preload-list submission — it's a much harder-to-reverse commitment than the `enabled`/`max_age`/`include_subdomains` fields.
