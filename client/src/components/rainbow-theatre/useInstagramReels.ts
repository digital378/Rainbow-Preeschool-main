import { useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";

export type Reel = {
  id: string;
  mediaUrl?: string;
  thumbnailUrl?: string;
  caption?: string;
  permalink?: string;
  timestamp: string;
};

type ReelPage = { reels: Reel[]; nextCursor: string | null };

async function fetchInstagramReels(endpoint: string, after: string | null): Promise<ReelPage> {
  const url = new URL(endpoint, window.location.origin);
  if (after) url.searchParams.set("after", after);
  const response = await fetch(url);
  if (!response.ok) throw new Error("Instagram videos are unavailable right now");

  const payload: unknown = await response.json();
  if (
    !payload ||
    typeof payload !== "object" ||
    !Array.isArray((payload as ReelPage).reels)
  ) {
    throw new Error("Invalid Instagram video response");
  }
  return payload as ReelPage;
}

export function useInstagramReels(
  enabled: boolean,
  endpoint = "/dummy/api/instagram/reels",
  options: { tapOnly?: boolean } = {},
) {
  const { tapOnly = false } = options;
  const query = useInfiniteQuery({
    queryKey: [endpoint],
    queryFn: ({ pageParam }) => fetchInstagramReels(endpoint, pageParam),
    initialPageParam: null as string | null,
    getNextPageParam: (page) => page.nextCursor ?? undefined,
    enabled,
    retry: 1,
    staleTime: tapOnly ? Infinity : 5 * 60 * 1000,
    refetchOnWindowFocus: !tapOnly,
    refetchInterval: !tapOnly && enabled ? 10 * 60 * 1000 : false,
  });

  const reels = useMemo(() => {
    const seen = new Set<string>();
    return (query.data?.pages.flatMap((page) => page.reels) ?? [])
      .filter((reel) => {
        if (seen.has(reel.id)) return false;
        seen.add(reel.id);
        return true;
      })
      .sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp));
  }, [query.data]);

  return { ...query, reels };
}