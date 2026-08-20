# Indra Intelligence Data API

Read-only data feed + push notifications for Indra Intelligence (the external
AI assistant that answers questions about Rainbow Preschools). This document
is written for whoever builds the Indra Intelligence side of the integration.

## Authentication

Every endpoint below requires the same secret used by the existing
`/api/rps/export` endpoint (`ADMIN_TOKEN`, an environment secret already
configured in this project). Send it as any one of:

- Header: `x-api-key: <token>`
- Header: `Authorization: Bearer <token>`
- Query param: `?token=<token>`

Missing/wrong token → `401 Unauthorized`. Token not configured server-side →
`503 Service unavailable`.

## Pull endpoints (Indra calls these on demand)

| Endpoint | Returns |
|---|---|
| `GET /api/indra/leads` | `{ count, leads: Contact[] }` — every contact-form enquiry |
| `GET /api/indra/blog-posts` | `{ count, blogPosts: BlogPost[] }` — all blog posts |
| `GET /api/indra/seo-snapshots` | `{ count, seoSnapshots: GscSnapshot[] }` — Search Console keyword/position history |
| `GET /api/indra/export` | `{ generatedAt, school, website, leads, blogPosts, seoSnapshots }` — all of the above in one call |

All responses are JSON, `Cache-Control: no-store` (always fresh).

**Deliberately excluded:** the `users` table (admin login credentials) is
never exposed through this API, regardless of endpoint. "Full data access"
here means business data, not authentication secrets.

## Push events (this app calls Indra automatically)

On every new contact-form lead, this app POSTs an event to
`INDRA_WEBHOOK_URL` (an environment variable/secret you set once your
receiving endpoint exists):

```
POST <INDRA_WEBHOOK_URL>
Content-Type: application/json
x-indra-secret: <INDRA_WEBHOOK_SECRET>

{
  "event": "lead.created",
  "data": { ...same shape as one row from /api/indra/leads... },
  "sentAt": "2026-08-20T05:40:00.000Z"
}
```

- Verify the request by checking `x-indra-secret` matches the shared secret
  you were given for `INDRA_WEBHOOK_SECRET`.
- Respond with any `2xx` status to acknowledge. A failure gets retried once
  (with an 8s timeout per attempt), then dropped (logged, not thrown) — this
  app never blocks a real lead submission on Indra being reachable.
- If `INDRA_WEBHOOK_URL` or `INDRA_WEBHOOK_SECRET` is missing, no push is
  attempted — sending real lead data unauthenticated is refused outright.
  Leads are still readable any time via `GET /api/indra/leads` or
  `/api/indra/export`.
- `INDRA_WEBHOOK_URL` must be `https://`. Plain `http://` is only accepted
  against `localhost`/`127.0.0.1`, and only outside production, for local
  development convenience.

## Enabling push

Once your Indra Intelligence project exposes a URL that can receive the POST
above, provide:

- `INDRA_WEBHOOK_URL` — the full URL to POST events to
- `INDRA_WEBHOOK_SECRET` — a shared secret Indra will use to verify the
  request came from this app

Until then, pull (`GET /api/indra/*`) works fully on its own.
