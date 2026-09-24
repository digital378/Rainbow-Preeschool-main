import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Request, Response } from "express";

function response() {
  const res = {
    statusCode: 200,
    body: undefined as unknown,
    headers: {} as Record<string, string>,
    setHeader(name: string, value: string) { this.headers[name] = value; return this; },
    status(code: number) { this.statusCode = code; return this; },
    json(body: unknown) { this.body = body; return this; },
  };
  return res;
}

const page = {
  data: [
    { id: "reel-1", media_type: "VIDEO", media_url: "https://example.com/reel.mp4",
      caption: "A day at school", timestamp: "2026-09-01T10:00:00Z",
      permalink: "https://www.instagram.com/reel/example/" },
    { id: "image-1", media_type: "IMAGE", timestamp: "2026-09-02T10:00:00Z" },
    { id: "reel-2", media_type: "VIDEO", media_url: "javascript:alert(1)",
      timestamp: "2026-09-03T10:00:00Z" },
  ],
  paging: { next: "https://graph.instagram.com/next", cursors: { after: "page-two" } },
};

describe("shared public and private Instagram reels", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv("INSTAGRAM_ACCESS_TOKEN", "unit-test-placeholder");
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  async function call(query: Record<string, unknown> = {}, privateRoute = false) {
    const handlers = await import("./dummy-instagram");
    const res = response();
    if (privateRoute) res.setHeader("Cache-Control", "no-store");
    await (privateRoute ? handlers.getDummyInstagramReels : handlers.getPublicInstagramReels)(
      { query } as Request, res as unknown as Response, () => {},
    );
    return res;
  }

  it("returns only video records, sanitizes URLs and caches the public result", async () => {
    const upstream = vi.fn().mockResolvedValue({ ok: true, json: async () => page });
    vi.stubGlobal("fetch", upstream);
    const res = await call();
    expect(res.statusCode).toBe(200);
    expect(res.headers["Cache-Control"]).toBe("public, max-age=60");
    const body = res.body as { reels: { id: string; mediaUrl?: string }[]; nextCursor: string };
    expect(body.reels.map((reel) => reel.id)).toEqual(["reel-2", "reel-1"]);
    expect(body.reels[0].mediaUrl).toBeUndefined();
    expect(body.nextCursor).toBe("page-two");
    expect(JSON.stringify(body)).not.toContain("unit-test-placeholder");
    const privateRes = await call({}, true);
    expect(privateRes.headers["Cache-Control"]).toBe("no-store");
    expect(upstream).toHaveBeenCalledTimes(1);
  });

  it("coalesces concurrent cache misses", async () => {
    let resolve!: (value: unknown) => void;
    const upstream = vi.fn(() => new Promise((done) => { resolve = done; }));
    vi.stubGlobal("fetch", upstream);
    const first = call();
    const second = call();
    await vi.waitFor(() => expect(upstream).toHaveBeenCalledTimes(1));
    resolve({ ok: true, json: async () => page });
    const results = await Promise.all([first, second]);
    expect(results.every((res) => res.statusCode === 200)).toBe(true);
  });

  it("rejects malformed pagination without querying Instagram", async () => {
    const upstream = vi.fn();
    vi.stubGlobal("fetch", upstream);
    expect((await call({ after: ["bad"] })).statusCode).toBe(400);
    expect((await call({ after: "a".repeat(513) })).statusCode).toBe(400);
    expect(upstream).not.toHaveBeenCalled();
  });

  it("reports outages explicitly, does not expose upstream details, and briefly backs off", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const upstream = vi.fn().mockResolvedValue({
      ok: false, status: 401, json: async () => ({ error: { code: 190, message: "private detail" } }),
    });
    vi.stubGlobal("fetch", upstream);
    const first = await call();
    const second = await call();
    expect(first.statusCode).toBe(502);
    expect(second.statusCode).toBe(502);
    expect(first.headers["Cache-Control"]).toBe("no-store");
    expect(JSON.stringify(first.body)).not.toContain("private detail");
    expect(upstream).toHaveBeenCalledTimes(1);
  });

  it("reports missing configuration without an upstream request", async () => {
    vi.stubEnv("INSTAGRAM_ACCESS_TOKEN", "");
    const upstream = vi.fn();
    vi.stubGlobal("fetch", upstream);
    expect((await call()).statusCode).toBe(503);
    expect(upstream).not.toHaveBeenCalled();
  });
});