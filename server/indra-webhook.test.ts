// @vitest-environment node
/**
 * Unit tests for the Indra Intelligence push webhook (pushIndraEvent).
 *
 * Covers:
 *  1. No push when INDRA_WEBHOOK_URL is unset.
 *  2. No push when INDRA_WEBHOOK_SECRET is unset (refuse unauthenticated send).
 *  3. No push when the URL fails validation (plain HTTP to a non-localhost host).
 *  4. Plain HTTP to localhost is allowed outside production (dev convenience).
 *  5. A valid HTTPS config sends the correct payload + secret header.
 *  6. A failed first attempt is retried once; success on retry logs delivered.
 *  7. Two failed attempts give up without throwing (fail-soft for callers).
 *  8. Redirects are disabled (`redirect: "error"`) so an HTTPS endpoint can't
 *     redirect the POST (with its PII body) to a plain-HTTP or internal
 *     address — a redirect response surfaces as a failed attempt, never a
 *     followed request.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { pushIndraEvent } from "./indra-webhook";

const SAMPLE_LEAD = {
  id: "abc-123",
  parentName: "Priya Sharma",
  phone: "9876543210",
  programme: "Playgroup",
};

describe("pushIndraEvent()", () => {
  const OLD_ENV = process.env;
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    process.env = { ...OLD_ENV };
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    process.env = OLD_ENV;
    vi.unstubAllGlobals();
  });

  it("does not call fetch when INDRA_WEBHOOK_URL is unset", async () => {
    delete process.env.INDRA_WEBHOOK_URL;
    process.env.INDRA_WEBHOOK_SECRET = "shared-secret";
    await pushIndraEvent("lead.created", SAMPLE_LEAD);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("does not call fetch when INDRA_WEBHOOK_SECRET is unset (refuses unauthenticated send)", async () => {
    process.env.INDRA_WEBHOOK_URL = "https://indra.example.com/events";
    delete process.env.INDRA_WEBHOOK_SECRET;
    await pushIndraEvent("lead.created", SAMPLE_LEAD);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("does not call fetch for a plain-HTTP non-localhost URL", async () => {
    process.env.INDRA_WEBHOOK_URL = "http://indra.example.com/events";
    process.env.INDRA_WEBHOOK_SECRET = "shared-secret";
    await pushIndraEvent("lead.created", SAMPLE_LEAD);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("does not call fetch for a plain-HTTP URL in production, even to localhost", async () => {
    process.env.NODE_ENV = "production";
    process.env.INDRA_WEBHOOK_URL = "http://localhost:4000/events";
    process.env.INDRA_WEBHOOK_SECRET = "shared-secret";
    await pushIndraEvent("lead.created", SAMPLE_LEAD);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("allows plain HTTP to localhost outside production", async () => {
    process.env.NODE_ENV = "development";
    process.env.INDRA_WEBHOOK_URL = "http://localhost:4000/events";
    process.env.INDRA_WEBHOOK_SECRET = "shared-secret";
    fetchMock.mockResolvedValue({ ok: true, status: 200 });
    await pushIndraEvent("lead.created", SAMPLE_LEAD);
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it("sends the correct method, secret header, and payload for a valid HTTPS config", async () => {
    process.env.INDRA_WEBHOOK_URL = "https://indra.example.com/events";
    process.env.INDRA_WEBHOOK_SECRET = "shared-secret";
    fetchMock.mockResolvedValue({ ok: true, status: 200 });

    await pushIndraEvent("lead.created", SAMPLE_LEAD);

    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toBe("https://indra.example.com/events");
    expect(init.method).toBe("POST");
    expect(init.headers["x-indra-secret"]).toBe("shared-secret");
    expect(init.headers["Content-Type"]).toBe("application/json");

    const body = JSON.parse(init.body as string);
    expect(body.event).toBe("lead.created");
    expect(body.data).toEqual(SAMPLE_LEAD);
    expect(typeof body.sentAt).toBe("string");
  });

  it("retries once on failure and succeeds if the retry works", async () => {
    process.env.INDRA_WEBHOOK_URL = "https://indra.example.com/events";
    process.env.INDRA_WEBHOOK_SECRET = "shared-secret";
    fetchMock
      .mockResolvedValueOnce({ ok: false, status: 500 })
      .mockResolvedValueOnce({ ok: true, status: 200 });

    await pushIndraEvent("lead.created", SAMPLE_LEAD);

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("gives up silently (does not throw) after two failed attempts", async () => {
    process.env.INDRA_WEBHOOK_URL = "https://indra.example.com/events";
    process.env.INDRA_WEBHOOK_SECRET = "shared-secret";
    fetchMock.mockResolvedValue({ ok: false, status: 500 });

    await expect(pushIndraEvent("lead.created", SAMPLE_LEAD)).resolves.toBeUndefined();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("disables redirects on the outgoing request (redirect: \"error\")", async () => {
    process.env.INDRA_WEBHOOK_URL = "https://indra.example.com/events";
    process.env.INDRA_WEBHOOK_SECRET = "shared-secret";
    fetchMock.mockResolvedValue({ ok: true, status: 200 });

    await pushIndraEvent("lead.created", SAMPLE_LEAD);

    const [, init] = fetchMock.mock.calls[0];
    expect(init.redirect).toBe("error");
  });

  it("treats an HTTPS→HTTP redirect as a failed attempt and never sends the PII body onward", async () => {
    process.env.INDRA_WEBHOOK_URL = "https://indra.example.com/events";
    process.env.INDRA_WEBHOOK_SECRET = "shared-secret";
    // `redirect: "error"` makes fetch (undici) throw a TypeError instead of
    // following a 307/308 to the redirect target — simulate that here.
    fetchMock.mockRejectedValue(new TypeError("fetch failed: unexpected redirect"));

    await expect(pushIndraEvent("lead.created", SAMPLE_LEAD)).resolves.toBeUndefined();

    // Retried once against the SAME configured URL, never a redirect target —
    // both calls must still be the original HTTPS destination.
    expect(fetchMock).toHaveBeenCalledTimes(2);
    for (const [url] of fetchMock.mock.calls) {
      expect(String(url)).toBe("https://indra.example.com/events");
    }
  });

  it("treats an HTTPS→internal-host redirect the same way — as a failed attempt, not a follow", async () => {
    process.env.INDRA_WEBHOOK_URL = "https://indra.example.com/events";
    process.env.INDRA_WEBHOOK_SECRET = "shared-secret";
    fetchMock.mockRejectedValue(new TypeError("fetch failed: unexpected redirect"));

    await pushIndraEvent("lead.created", SAMPLE_LEAD);

    // No call was ever made to any internal/private address.
    for (const [url] of fetchMock.mock.calls) {
      expect(String(url)).not.toMatch(/169\.254|10\.|192\.168|localhost|127\.0\.0\.1/);
    }
  });
});
