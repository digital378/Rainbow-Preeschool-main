import { google } from "googleapis";
import { storage } from "./storage";
import { format, subDays } from "date-fns";

const SITE_URL = "sc-domain:rainbowpreschools.com";

const TARGET_KEYWORDS = [
  "playschool near me",
  "play school near me",
  "preschool near me",
  "best preschool in thane",
  "best playschool in thane",
  "playgroup near me",
  "playgroup in thane",
  "nursery near me",
  "nursery in thane",
  "kindergarten near me",
  "preschool in thane",
  "pre school thane",
  "pre kg age",
  "rainbow preschool",
  "rainbow preschool thane",
  "holi activities for kids",
  "national symbols of india for kids",
  "sports day activities for kindergarten",
  "36 motivational thoughts of the day for kids",
  "rainbow preschool kasarvadavali",
];

type SyncResult = {
  success: boolean;
  synced: number;
  skipped: number;
  date: string;
  rows: { keyword: string; position: number; clicks: number; impressions: number; ctr: number }[];
  error?: string;
};

function getGscClient() {
  const keyJson = process.env.GSC_SERVICE_ACCOUNT_KEY;
  if (!keyJson) {
    throw new Error("GSC_SERVICE_ACCOUNT_KEY environment variable is not set");
  }

  let credentials: Record<string, string>;
  try {
    credentials = JSON.parse(keyJson);
  } catch {
    throw new Error("GSC_SERVICE_ACCOUNT_KEY is not valid JSON");
  }

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/webmasters.readonly"],
  });

  return google.searchconsole({ version: "v1", auth });
}

export async function syncGscData(daysBack = 90): Promise<SyncResult> {
  const endDate = format(subDays(new Date(), 1), "yyyy-MM-dd");
  const startDate = format(subDays(new Date(), daysBack), "yyyy-MM-dd");
  const snapshotDate = format(new Date(), "yyyy-MM-dd");

  let sc;
  try {
    sc = getGscClient();
  } catch (err: any) {
    return { success: false, synced: 0, skipped: 0, date: snapshotDate, rows: [], error: err.message };
  }

  let response;
  try {
    response = await sc.searchanalytics.query({
      siteUrl: SITE_URL,
      requestBody: {
        startDate,
        endDate,
        dimensions: ["query"],
        rowLimit: 500,
        dataState: "all",
      },
    });
  } catch (err: any) {
    const msg = err?.message || "GSC API request failed";
    return { success: false, synced: 0, skipped: 0, date: snapshotDate, rows: [], error: msg };
  }

  const apiRows = response.data.rows || [];

  // Build a map of keyword → metrics from the API response
  const kwMap: Record<string, { position: number; clicks: number; impressions: number; ctr: number }> = {};
  for (const row of apiRows) {
    const kw = (row.keys?.[0] || "").toLowerCase().trim();
    if (kw && row.position !== undefined) {
      kwMap[kw] = {
        position: row.position!,
        clicks: row.clicks ?? 0,
        impressions: row.impressions ?? 0,
        ctr: row.ctr ?? 0,
      };
    }
  }

  // Also fetch site-level totals broken down by date (one row per actual day,
  // across all queries). This lets the dashboard sum any time window accurately.
  try {
    const totalRes = await sc.searchanalytics.query({
      siteUrl: SITE_URL,
      requestBody: {
        startDate,
        endDate,
        dimensions: ["date"],
        rowLimit: 500,
        dataState: "all",
      },
    });
    const dayRows = totalRes.data.rows || [];

    // Wipe existing site-total entries in this date range so re-syncs are clean
    const existing = (await storage.getGscSnapshots()).filter(
      s => s.keyword === "__site_total__" && s.snapshotDate >= startDate && s.snapshotDate <= endDate
    );
    for (const e of existing) await storage.deleteGscSnapshot(e.id);

    for (const row of dayRows) {
      const date = row.keys?.[0];
      if (!date) continue;
      await storage.addGscSnapshot({
        snapshotDate: date,
        keyword: "__site_total__",
        position: Math.round((row.position ?? 0) * 10) / 10,
        clicks: Math.round(row.clicks ?? 0),
        impressions: Math.round(row.impressions ?? 0),
        ctr: row.ctr ?? 0,
        page: null,
        notes: `Site total per-day (all queries)`,
      });
    }
  } catch {
    // non-fatal — keyword data still synced
  }

  // Per-keyword per-day data for the last 7 days. Stored under keyword key
  // `__daily__:<original keyword>` so they don't pollute the main keyword list.
  // Used by the dashboard to compute true 24-hour position & impression deltas.
  try {
    const dailyStart = format(subDays(new Date(), 8), "yyyy-MM-dd");
    const dailyRes = await sc.searchanalytics.query({
      siteUrl: SITE_URL,
      requestBody: {
        startDate: dailyStart,
        endDate,
        dimensions: ["query", "date"],
        rowLimit: 5000,
        dataState: "all",
      },
    });
    const dailyRows = dailyRes.data.rows || [];

    // Wipe existing daily keyword entries in this date range
    const existingDaily = (await storage.getGscSnapshots()).filter(
      s => s.keyword.startsWith("__daily__:") && s.snapshotDate >= dailyStart && s.snapshotDate <= endDate
    );
    for (const e of existingDaily) await storage.deleteGscSnapshot(e.id);

    const targetSet = new Set(TARGET_KEYWORDS.map(k => k.toLowerCase()));
    for (const row of dailyRows) {
      const kw = (row.keys?.[0] || "").toLowerCase().trim();
      const date = row.keys?.[1];
      if (!kw || !date || !targetSet.has(kw)) continue;
      await storage.addGscSnapshot({
        snapshotDate: date,
        keyword: `__daily__:${kw}`,
        position: Math.round((row.position ?? 0) * 10) / 10,
        clicks: Math.round(row.clicks ?? 0),
        impressions: Math.round(row.impressions ?? 0),
        ctr: row.ctr ?? 0,
        page: null,
        notes: `Per-keyword per-day from GSC`,
      });
    }
  } catch {
    // non-fatal — main keyword data still synced
  }

  const matched: SyncResult["rows"] = [];
  let synced = 0;
  let skipped = 0;

  for (const keyword of TARGET_KEYWORDS) {
    const data = kwMap[keyword.toLowerCase()];
    if (!data) {
      skipped++;
      continue;
    }

    matched.push({ keyword, ...data });

    await storage.addGscSnapshot({
      snapshotDate,
      keyword,
      position: Math.round(data.position * 10) / 10,
      clicks: Math.round(data.clicks),
      impressions: Math.round(data.impressions),
      ctr: data.ctr,
      page: null,
      notes: `Auto-synced from GSC API (${startDate} to ${endDate})`,
    });
    synced++;
  }

  return { success: true, synced, skipped, date: snapshotDate, rows: matched };
}

export function isGscConfigured(): boolean {
  return !!process.env.GSC_SERVICE_ACCOUNT_KEY;
}
