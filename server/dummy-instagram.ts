import type { Request, RequestHandler, Response } from "express";

type InstagramMedia = {
  id?: string;
  media_type?: string;
  media_url?: string;
  thumbnail_url?: string;
  caption?: string;
  permalink?: string;
  timestamp?: string;
};

type InstagramPage = {
  data?: InstagramMedia[];
  paging?: { next?: string; cursors?: { after?: string } };
  error?: { code?: number; type?: string };
};

type Reel = {
  id: string;
  mediaUrl?: string;
  thumbnailUrl?: string;
  caption?: string;
  permalink?: string;
  timestamp: string;
};

type ReelPage = { reels: Reel[]; nextCursor: string | null };

const PAGE_SIZE = 100;
const CACHE_MS = 6 * 60 * 60 * 1000;
const FULL_REFRESH_MS = 6 * 60 * 60 * 1000;
const EXPIRY_CHECK_MS = 60 * 60 * 1000;
const EXPIRY_WINDOW_MS = 24 * 60 * 60 * 1000;
const pageCache = new Map<string, { expires: number; page: ReelPage }>();
const pendingPages = new Map<string, Promise<ReelPage>>();
const nextBackgroundAttempt = new Map<string, number>();
let failureRetryAt = 0;
let budgetStartedAt = 0;
let budgetUsed = 0;
let lastFullRefresh = 0;
let refreshRunning = false;
let refreshJobStarted = false;

function httpsUrl(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

/** Instagram CDN URLs commonly carry their expiry as a hexadecimal `oe` timestamp. */
export function mediaUrlExpiry(url: string): number | undefined {
  try {
    const query = new URL(url).searchParams;
    const oe = query.get("oe");
    if (oe && /^[0-9a-f]{8,}$/i.test(oe)) return parseInt(oe, 16) * 1000;
    for (const key of ["expires", "expiry", "exp"]) {
      const value = query.get(key);
      if (value && /^\d{10,13}$/.test(value)) {
        return value.length === 13 ? Number(value) : Number(value) * 1000;
      }
    }
  } catch {
    // A URL without a known expiry is still refreshed every six hours.
  }
  return undefined;
}

function hasMediaExpiringBy(page: ReelPage, deadline: number): boolean {
  return page.reels.some(({ mediaUrl }) => {
    const expiry = mediaUrl ? mediaUrlExpiry(mediaUrl) : undefined;
    return expiry !== undefined && expiry <= deadline;
  });
}

function withoutExpiredMedia(page: ReelPage): ReelPage {
  const now = Date.now();
  return {
    ...page,
    reels: page.reels.map((reel) => {
      const expiry = reel.mediaUrl ? mediaUrlExpiry(reel.mediaUrl) : undefined;
      return expiry !== undefined && expiry <= now ? { ...reel, mediaUrl: undefined } : reel;
    }),
  };
}

async function loadReels(after: string | null, token: string): Promise<ReelPage> {
  const url = new URL("https://graph.instagram.com/me/media");
  url.searchParams.set(
    "fields",
    "id,media_type,media_product_type,media_url,thumbnail_url,caption,permalink,timestamp",
  );
  url.searchParams.set("limit", String(PAGE_SIZE));
  if (after) url.searchParams.set("after", after);

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    signal: AbortSignal.timeout(12000),
  });
  const payload = (await response.json()) as InstagramPage;
  if (!response.ok || !Array.isArray(payload.data)) {
    // Never log the request URL, token, response body or media URLs.
    console.error("[dummy-instagram] Instagram request failed", response.status, payload.error?.code);
    throw new Error("Instagram feed unavailable");
  }

  const reels: Reel[] = payload.data
    .filter((item) => item.media_type === "VIDEO" && typeof item.id === "string" && typeof item.timestamp === "string")
    .map((item) => ({
      id: item.id!,
      mediaUrl: httpsUrl(item.media_url),
      thumbnailUrl: httpsUrl(item.thumbnail_url),
      caption: item.caption,
      permalink: httpsUrl(item.permalink),
      timestamp: item.timestamp!,
    }))
    .sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp));

  return {
    reels,
    nextCursor: payload.paging?.next ? payload.paging.cursors?.after ?? null : null,
  };
}

function refreshPage(key: string, token: string): Promise<ReelPage> {
  const ongoing = pendingPages.get(key);
  if (ongoing) return ongoing;
  nextBackgroundAttempt.set(key, Date.now() + EXPIRY_CHECK_MS);
  const pending = loadReels(key === "first" ? null : key, token)
    .then((page) => {
      if (pageCache.size >= 30 && !pageCache.has(key)) {
        const oldest = Array.from(pageCache.keys()).find((cursor) => cursor !== "first");
        if (oldest) {
          pageCache.delete(oldest);
          nextBackgroundAttempt.delete(oldest);
        }
      }
      pageCache.set(key, { page, expires: Date.now() + CACHE_MS });
      return page;
    })
    .catch((error) => {
      failureRetryAt = Date.now() + 15_000;
      throw error;
    })
    .finally(() => pendingPages.delete(key));
  pendingPages.set(key, pending);
  return pending;
}

/** Warm the feed on startup, refresh all cached pages every six hours, and check expiring URLs hourly. */
export function startInstagramReelRefreshJob(): void {
  if (refreshJobStarted) return;
  refreshJobStarted = true;
  const refresh = async () => {
    const token = process.env.INSTAGRAM_ACCESS_TOKEN;
    if (!token || refreshRunning || Date.now() < failureRetryAt) return;
    refreshRunning = true;
    try {
      const now = Date.now();
      const full = now - lastFullRefresh >= FULL_REFRESH_MS;
      if (full) {
        // Follow the *current* cursor chain, not old cached cursors displaced by new posts.
        let key: string | null = "first";
        const seen = new Set<string>();
        try {
          while (key && !seen.has(key) && seen.size < 30) {
            seen.add(key);
            const page = await refreshPage(key, token);
            key = page.nextCursor;
          }
          if (key) console.error("[instagram] Scheduled reel refresh stopped at the 30-page safety limit");
          else lastFullRefresh = Date.now();
        } catch {
          // Keep cached posters and links when Instagram is temporarily unavailable.
          console.error("[instagram] Scheduled reel refresh failed; will retry on the next check");
        }
      } else {
        for (const [key, cached] of Array.from(pageCache.entries())) {
          if (!hasMediaExpiringBy(cached.page, now + EXPIRY_WINDOW_MS)) continue;
          if (now < (nextBackgroundAttempt.get(key) ?? 0)) continue;
          try {
            await refreshPage(key, token);
          } catch {
            console.error("[instagram] Expiring reel refresh failed; will retry on the next check");
          }
        }
      }
    } finally {
      refreshRunning = false;
    }
  };
  void refresh();
  const timer = setInterval(() => void refresh(), EXPIRY_CHECK_MS);
  timer.unref();
}

async function handleReels(req: Request, res: Response, publicFeed = false) {
  // Errors must not be cached by the public homepage or an intermediary.
  if (publicFeed) res.setHeader("Cache-Control", "no-store");
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!token) {
    res.status(503).json({ message: "Instagram feed is not configured" });
    return;
  }
  const after = req.query.after;
  if (after !== undefined && (typeof after !== "string" || after.length > 512 || /[\x00-\x1f]/.test(after))) {
    res.status(400).json({ message: "Invalid playlist cursor" });
    return;
  }
  const cursor = after || null;
  const key = cursor ?? "first";
  const cached = pageCache.get(key);
  const sendPage = (page: ReelPage) => {
    if (publicFeed) {
      res.setHeader("Cache-Control", hasMediaExpiringBy(page, Date.now() + 60_000)
        ? "no-store"
        : "public, max-age=60");
    }
    res.json(withoutExpiredMedia(page));
  };
  const now = Date.now();
  if (cached && hasMediaExpiringBy(cached.page, now)) {
    // Do not hand out an already-expired URL. Wait for an in-flight or fresh
    // request; if Instagram fails, return the poster/permalink without mediaUrl.
    try {
      const pending = pendingPages.get(key);
      if (pending || now >= failureRetryAt) {
        sendPage(await (pending ?? refreshPage(key, token)));
        return;
      }
    } catch {
      // Use the existing thumbnail/Instagram link instead of an expired URL.
    }
    res.setHeader("Cache-Control", "no-store");
    res.json(withoutExpiredMedia(cached.page));
    return;
  }
  if (cached) {
    if (
      now >= failureRetryAt &&
      now >= (nextBackgroundAttempt.get(key) ?? 0) &&
      (cached.expires <= now || hasMediaExpiringBy(cached.page, now + EXPIRY_WINDOW_MS))
    ) {
      void refreshPage(key, token).catch(() => {
        // Keep the last usable cached page; the next check can retry.
      });
    }
    sendPage(cached.page);
    return;
  }

  if (Date.now() < failureRetryAt) {
    res.setHeader("Retry-After", "15");
    res.status(502).json({ message: "Instagram feed is temporarily unavailable" });
    return;
  }

  try {
    let pending = pendingPages.get(key);
    if (!pending) {
      if (Date.now() - budgetStartedAt >= 60_000) {
        budgetStartedAt = Date.now();
        budgetUsed = 0;
      }
      // Bound cache-miss work now that the feed is public. Cached responses
      // remain available; concurrent visitors share one upstream request.
      if (pendingPages.size >= 4 || budgetUsed >= 30) {
        res.setHeader("Retry-After", "60");
        res.status(503).json({ message: "Instagram feed is busy. Please try again shortly." });
        return;
      }
      budgetUsed++;
      pending = refreshPage(key, token);
    }
    sendPage(await pending);
  } catch {
    res.setHeader("Retry-After", "15");
    res.status(502).json({ message: "Instagram feed is temporarily unavailable" });
  }
}

// Keep the private endpoint's existing guard and cache headers intact.
export const getDummyInstagramReels: RequestHandler = (req, res) => handleReels(req, res);
export const getPublicInstagramReels: RequestHandler = (req, res) => handleReels(req, res, true);