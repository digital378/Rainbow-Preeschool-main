// Push notifications for Indra Intelligence — the external AI assistant that
// answers company questions. Rather than making Indra poll our API, we POST
// it an event the moment something new happens (e.g. a lead comes in).
//
// This module is deliberately fail-soft: a webhook target that's slow, down,
// or not configured yet must NEVER break the caller's own request (e.g. a
// parent submitting the contact form). All errors are caught and logged.
//
// Security: the payload carries real parent/child PII (name, phone, email).
// Push is refused outright — not attempted with a blank secret — unless both
// a webhook URL AND a non-empty shared secret are configured, and the URL is
// validated to prevent misconfigured/insecure destinations.

const REQUEST_TIMEOUT_MS = 8000;

export type IndraEventType = "lead.created";

interface IndraEventPayload<T = unknown> {
  event: IndraEventType;
  data: T;
  sentAt: string;
}

/**
 * Validate the configured webhook destination. HTTPS is required in
 * production; plain HTTP is only permitted against localhost, so a
 * developer can point at a local receiver while testing without ever
 * allowing a production misconfiguration to leak PII over an unencrypted
 * connection to an arbitrary host.
 */
function validateWebhookUrl(rawUrl: string): URL | null {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    console.error(`[indra] INDRA_WEBHOOK_URL is not a valid URL: ${rawUrl}`);
    return null;
  }

  if (url.protocol === "https:") return url;

  const isLocalHost = url.hostname === "localhost" || url.hostname === "127.0.0.1";
  if (url.protocol === "http:" && isLocalHost && process.env.NODE_ENV !== "production") {
    return url;
  }

  console.error(
    `[indra] INDRA_WEBHOOK_URL must use HTTPS (plain HTTP is only allowed against localhost outside production): ${rawUrl}`,
  );
  return null;
}

async function postOnce(url: URL, secret: string, body: string): Promise<void> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-indra-secret": secret,
      },
      body,
      signal: controller.signal,
      // Never follow redirects: a compromised or misconfigured endpoint could
      // redirect to a plain-HTTP or internal address and exfiltrate the PII
      // in this POST body. `fetch` throws a TypeError on a redirect response
      // when `redirect: "error"` is set, which the caller treats as a failed
      // attempt (retried once, then dropped) — never followed.
      redirect: "error",
    });
    if (!res.ok) {
      throw new Error(`Indra webhook responded with HTTP ${res.status}`);
    }
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Fire-and-forget push of a business event to Indra Intelligence.
 * No-ops (with a log line) when INDRA_WEBHOOK_URL or INDRA_WEBHOOK_SECRET
 * isn't configured yet — the receiving side doesn't exist until the user
 * builds it, so this must degrade gracefully rather than throwing, and it
 * must never send real lead data unauthenticated with a blank secret.
 */
export async function pushIndraEvent<T>(event: IndraEventType, data: T): Promise<void> {
  const rawUrl = process.env.INDRA_WEBHOOK_URL;
  if (!rawUrl) {
    console.log(`[indra] push skipped — INDRA_WEBHOOK_URL not configured (event: ${event})`);
    return;
  }

  const secret = process.env.INDRA_WEBHOOK_SECRET || "";
  if (!secret) {
    console.log(
      `[indra] push skipped — INDRA_WEBHOOK_SECRET not configured, refusing to send unauthenticated (event: ${event})`,
    );
    return;
  }

  const url = validateWebhookUrl(rawUrl);
  if (!url) {
    console.log(`[indra] push skipped — INDRA_WEBHOOK_URL failed validation (event: ${event})`);
    return;
  }

  const payload: IndraEventPayload<T> = { event, data, sentAt: new Date().toISOString() };
  const body = JSON.stringify(payload);

  try {
    await postOnce(url, secret, body);
    console.log(`[indra] push delivered (event: ${event})`);
  } catch (err) {
    console.error(
      `[indra] push failed, retrying once (event: ${event}):`,
      err instanceof Error ? err.message : err,
    );
    try {
      await postOnce(url, secret, body);
      console.log(`[indra] push delivered on retry (event: ${event})`);
    } catch (err2) {
      console.error(
        `[indra] push failed on retry, giving up (event: ${event}):`,
        err2 instanceof Error ? err2.message : err2,
      );
    }
  }
}
