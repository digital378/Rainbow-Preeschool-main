import { afterAll, expect, it, vi } from "vitest";
import { mediaUrlExpiry, startInstagramReelRefreshJob } from "./dummy-instagram";

afterAll(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
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