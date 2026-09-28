import { afterEach, expect, it, vi } from "vitest";
import type { Request, Response as ExpressResponse } from "express";
import { mediaUrlExpiry, startInstagramReelRefreshJob } from "./dummy-instagram";

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

it("returns near-expiry cached reels immediately and refreshes in the background", async () => {
  vi.resetModules();
  const { getPublicInstagramReels } = await import("./dummy-instagram");
  vi.useFakeTimers();
  const now = new Date("2026-09-28T00:00:00Z");
  vi.setSystemTime(now);
  vi.stubEnv("INSTAGRAM_ACCESS_TOKEN", "test-token");
  const expires = Math.floor((now.getTime() + 25 * 60 * 60 * 1000) / 1000).toString(16);
  const page = {
    data: [{
      id: "reel-1",
      media_type: "VIDEO",
      media_url: `https://example.com/video?oe=${expires}`,
      thumbnail_url: "https://example.com/poster.jpg",
      permalink: "https://www.instagram.com/reel/example/",
      timestamp: now.toISOString(),
    }],
  };
  const req = { query: {} } as Request;
  const makeResponse = () => {
    const res = { setHeader: vi.fn(), json: vi.fn(), status: vi.fn() };
    res.status.mockReturnValue(res);
    return res;
  };
  vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify(page), { status: 200 })));
  const initial = makeResponse();
  await getPublicInstagramReels(req, initial as unknown as ExpressResponse, vi.fn());
  expect(initial.json).toHaveBeenCalledWith(expect.objectContaining({
    reels: [expect.objectContaining({ mediaUrl: `https://example.com/video?oe=${expires}` })],
  }));

  vi.setSystemTime(now.getTime() + 2 * 60 * 60 * 1000);
  let resolveRefresh!: (response: Response) => void;
  const backgroundFetch = vi.fn(() => new Promise<Response>((resolve) => { resolveRefresh = resolve; }));
  vi.stubGlobal("fetch", backgroundFetch);
  const cached = makeResponse();
  await getPublicInstagramReels(req, cached as unknown as ExpressResponse, vi.fn());
  expect(cached.json).toHaveBeenCalledWith(expect.objectContaining({
    reels: [expect.objectContaining({ mediaUrl: `https://example.com/video?oe=${expires}` })],
  }));
  expect(backgroundFetch).toHaveBeenCalledTimes(1);
  resolveRefresh(new Response(JSON.stringify(page), { status: 200 }));
  await vi.advanceTimersByTimeAsync(0);

  vi.setSystemTime(now.getTime() + 26 * 60 * 60 * 1000);
  let rejectRefresh!: (error: Error) => void;
  vi.stubGlobal("fetch", vi.fn(() => new Promise<Response>((_resolve, reject) => { rejectRefresh = reject; })));
  const expired = makeResponse();
  const reply = getPublicInstagramReels(req, expired as unknown as ExpressResponse, vi.fn());
  expect(expired.json).not.toHaveBeenCalled();
  rejectRefresh(new Error("Instagram temporarily unavailable"));
  await reply;
  expect(expired.json).toHaveBeenCalledWith(expect.objectContaining({
    reels: [expect.objectContaining({
      mediaUrl: undefined,
      thumbnailUrl: "https://example.com/poster.jpg",
      permalink: "https://www.instagram.com/reel/example/",
    })],
  }));
});

it("reads Instagram CDN expiry without exposing URL content", () => {
  expect(mediaUrlExpiry("https://example.com/media?oe=6ABB0000")).toBe(parseInt("6ABB0000", 16) * 1000);
  expect(mediaUrlExpiry("https://example.com/media?expires=1790000000")).toBe(1790000000 * 1000);
  expect(mediaUrlExpiry("https://example.com/media")).toBeUndefined();
});

it("refreshes all feed pages on startup and every six hours, plus expiring URLs hourly", async () => {
  vi.useFakeTimers();
  const now = new Date("2026-09-28T00:00:00Z");
  vi.setSystemTime(now);
  vi.stubEnv("INSTAGRAM_ACCESS_TOKEN", "test-token");
  let calls = 0;
  vi.stubGlobal("fetch", vi.fn(async (requestUrl: URL) => {
    calls++;
    const cursor = requestUrl.searchParams.get("after");
    const expires = Date.now() + (calls === 1 ? 25 : 48) * 60 * 60 * 1000;
    return new Response(JSON.stringify({
      data: [{
        id: cursor ? "reel-2" : "reel-1",
        media_type: "VIDEO",
        media_url: `https://example.com/video?oe=${Math.floor(expires / 1000).toString(16)}`,
        thumbnail_url: "https://example.com/poster.jpg",
        permalink: "https://www.instagram.com/reel/example/",
        timestamp: now.toISOString(),
      }],
      paging: cursor ? undefined : { next: "page-2", cursors: { after: "next-page" } },
    }), { status: 200 });
  }));

  startInstagramReelRefreshJob();
  await vi.waitFor(() => expect(calls).toBe(2));
  await vi.advanceTimersByTimeAsync(60 * 60 * 1000);
  expect(calls).toBe(3);
  await vi.advanceTimersByTimeAsync(5 * 60 * 60 * 1000 + 60 * 60 * 1000);
  expect(calls).toBe(5);
});