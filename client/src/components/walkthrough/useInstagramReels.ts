import { useQuery } from "@tanstack/react-query";

export type Reel = {
  id: string;
  mediaUrl: string;
  thumbnailUrl?: string;
  caption?: string;
  permalink?: string;
  timestamp: string;
};

async function fetchInstagramReels(): Promise<Reel[]> {
  try {
    const response = await fetch("/api/instagram/reels");
    if (!response.ok) return [];

    const payload: unknown = await response.json();
    if (!Array.isArray(payload)) return [];

    return payload
      .filter((item): item is Reel => (
        typeof item === "object" &&
        item !== null &&
        typeof (item as Reel).id === "string" &&
        typeof (item as Reel).mediaUrl === "string" &&
        typeof (item as Reel).timestamp === "string"
      ))
      .sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp));
  } catch {
    return [];
  }
}

export function useInstagramReels() {
  const query = useQuery<Reel[]>({
    queryKey: ["/api/instagram/reels"],
    queryFn: fetchInstagramReels,
    refetchOnWindowFocus: true,
    refetchInterval: 10 * 60 * 1000,
  });

  return { ...query, reels: query.data ?? [] };
}