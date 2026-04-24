import { google } from "googleapis";
import { storage } from "./storage";
import { format, subDays } from "date-fns";
import { GSC_SYNC_DEFAULT_NOTE } from "@shared/schema";

const SITE_URL = "sc-domain:rainbowpreschools.com";

const TARGET_KEYWORDS = [
  // ── 15 commercial keywords (Task #26 — weekly top-3 tracker) ───────────────
  // Mapped to 5 destination pages. Order mirrors COMMERCIAL_15_KEYWORDS in
  // client/src/pages/gsc-dashboard.tsx — keep the two in sync.
  "playschool near me",
  "play school near me",
  "best playschool in thane",
  "best playschool near me",
  "preschool near me",
  "preschool in thane",
  "preschool near me in thane",
  "best preschool in thane",
  "best preschool near me",
  "playgroup near me",
  "playgroup in thane",
  "nursery near me",
  "nursery in thane",
  "kindergarten near me",
  "best kindergarten in thane",
  // ── Other tracked keywords (brand, informational, seasonal) ────────────────
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

    // Build the full set of site-total rows, then atomically replace the range
    // in a single bulk delete + bulk insert (instead of N individual calls).
    const siteTotalRows = [];
    for (const row of dayRows) {
      const date = row.keys?.[0];
      if (!date) continue;
      siteTotalRows.push({
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
    await storage.replaceGscSnapshotsInRange("__site_total__", startDate, endDate, siteTotalRows);
  } catch {
    // non-fatal — keyword data still synced
  }

  // Per-keyword per-day data for the last 90 days. Stored under keyword key
  // `__daily__:<original keyword>` so they don't pollute the main keyword list.
  // Used by the dashboard to compute true 24-hour position & impression deltas
  // AND the 90-day sparkline trend on the 15-commercial-keywords panel.
  try {
    const dailyStart = format(subDays(new Date(), 90), "yyyy-MM-dd");
    const dailyRes = await sc.searchanalytics.query({
      siteUrl: SITE_URL,
      requestBody: {
        startDate: dailyStart,
        endDate,
        dimensions: ["query", "date"],
        // 90 days × ~25 tracked queries can produce ~2,250 rows on its own,
        // and GSC returns rows for every query (not just our targets) so we
        // request a generous cap — anything we don't care about is dropped
        // by the targetSet filter below.
        rowLimit: 25000,
        dataState: "all",
      },
    });
    const dailyRows = dailyRes.data.rows || [];

    // Preserve any human-authored notes on existing __daily__ rows before the
    // range is wiped + reinserted. The dashboard's 90-day modal lets the team
    // annotate a specific day (e.g. "redirect map removed today"), and those
    // notes live on the same rows GSC also writes — without this preservation
    // step the next 6-hour auto-sync would silently overwrite them with the
    // default "Per-keyword per-day from GSC" string.
    const existingNotes = new Map<string, string>();
    try {
      const existing = await storage.getGscSnapshots();
      for (const s of existing) {
        if (
          s.keyword.startsWith("__daily__:") &&
          s.snapshotDate >= dailyStart &&
          s.snapshotDate <= endDate &&
          s.notes &&
          s.notes !== GSC_SYNC_DEFAULT_NOTE
        ) {
          existingNotes.set(`${s.snapshotDate}::${s.keyword}`, s.notes);
        }
      }
    } catch {
      // non-fatal — worst case we lose any user notes for this sync window
    }

    // Build the full set of daily per-keyword rows, then atomically replace the
    // range in one bulk delete + bulk insert. Previously this loop fired ~1,300
    // individual delete + insert calls every 6 hours; now it's a single sweep.
    const targetSet = new Set(TARGET_KEYWORDS.map(k => k.toLowerCase()));
    const dailyKwRows = [];
    for (const row of dailyRows) {
      const kw = (row.keys?.[0] || "").toLowerCase().trim();
      const date = row.keys?.[1];
      if (!kw || !date || !targetSet.has(kw)) continue;
      const keywordKey = `__daily__:${kw}`;
      const preservedNote = existingNotes.get(`${date}::${keywordKey}`);
      dailyKwRows.push({
        snapshotDate: date,
        keyword: keywordKey,
        position: Math.round((row.position ?? 0) * 10) / 10,
        clicks: Math.round(row.clicks ?? 0),
        impressions: Math.round(row.impressions ?? 0),
        ctr: row.ctr ?? 0,
        page: null,
        notes: preservedNote ?? GSC_SYNC_DEFAULT_NOTE,
      });
    }
    await storage.replaceGscSnapshotsInRange("__daily__:", dailyStart, endDate, dailyKwRows);
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
