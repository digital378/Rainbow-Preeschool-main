import type { RequestHandler } from "express";

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
const CACHE_MS = 10 * 60 * 1000;
const pageCache = new Map<string, { expires: number; page: ReelPage }>();

function httpsUrl(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.toString() : undefined;
  } catch {
    return undefined;
  }
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

export const getDummyInstagramReels: RequestHandler = async (req, res) => {
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
  if (cached && cached.expires > Date.now()) {
    res.json(cached.page);
    return;
  }

  try {
    const page = await loadReels(cursor, token);
    if (pageCache.size >= 30) pageCache.delete(pageCache.keys().next().value!);
    pageCache.set(key, { page, expires: Date.now() + CACHE_MS });
    res.json(page);
  } catch {
    res.status(502).json({ message: "Instagram feed is temporarily unavailable" });
  }
};