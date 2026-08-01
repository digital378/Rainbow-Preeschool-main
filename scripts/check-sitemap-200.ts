#!/usr/bin/env tsx
/**
 * Predeploy smoke-test: every URL listed in `/sitemap.xml` must serve a
 * 200 OK response (NO 301 redirects, NO 404s, NO 5xx). A URL that lives
 * in the sitemap but immediately 301s leaks ranking signal AND surfaces
 * the "URL is in sitemap but redirects" warning in Google Search Console.
 *
 * Hits the same booted server as the freshness/keyword smoke-tests
 * (default `http://127.0.0.1:5000`, override by passing the base URL as
 * argv[2]). Uses the Googlebot user-agent so any bot-only redirect logic
 * is exercised too.
 *
 * Run locally:
 *   npx tsx scripts/check-sitemap-200.ts http://127.0.0.1:5000
 */

import { SITEMAP_ENTRIES } from "../shared/sitemap-entries";
import { redirectMap } from "../server/redirects";

const BASE = (process.argv[2] ?? "http://127.0.0.1:5000").replace(/\/+$/, "");
const UA = "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";
const TIMEOUT_MS = 10_000;
const CONCURRENCY = 8;

// ── Standalone routes to check explicitly ───────────────────────────────────
// These are Express routes that serve static HTML files directly (not via the
// React SPA). They must return 200 OK with Googlebot UA. Checked in addition
// to the sitemap fan-out so a misconfigured file path or missing route is
// caught even if the slug is accidentally absent from the sitemap.
//
// Keep this list in sync with the Express GET routes in server/routes.ts and
// with the REQUIRED_SLUGS list in scripts/check-sitemap-blog-slugs.ts.
const STANDALONE_ROUTES: string[] = [
  "/blog/independence-day-for-kids",
];

console.log(`[check-sitemap-200] BASE=${BASE}`);

// ── Static pre-check ────────────────────────────────────────────────────────
// Catch the "stale curated row" case described in code-review Q5: because
// `buildSitemapXml` dedupes by first-URL-wins, a hand-curated row in
// `SITEMAP_ENTRIES` will keep a URL in the sitemap even after a redirect is
// added for it. The HTTP fan-out below would catch this as a 301, but a
// dedicated static check gives a much clearer diagnostic ("stale curated
// row /foo is now in redirectMap") and runs before paying any HTTP cost.
// A row is "stale" only when its URL truly redirects somewhere ELSE. Some
// trailing-slash variants in `redirectMap` 301 back to the SAME canonical
// no-slash URL (e.g. `/programmes/` → `/programmes`, `/gallery/` → `/gallery`)
// and those rows are correctly serving 200 at the no-slash form, so we
// must ignore self-redirects to avoid false positives.
const isStaleCurated = (url: string): string | null => {
  const direct = redirectMap[url];
  if (direct && direct !== url) return direct;
  const trailing = redirectMap[`${url}/`];
  if (trailing && trailing !== url) return trailing;
  return null;
};
const staleCurated = SITEMAP_ENTRIES
  .map((e) => ({ entry: e, target: isStaleCurated(e.url) }))
  .filter((row): row is { entry: typeof SITEMAP_ENTRIES[number]; target: string } => row.target !== null);
if (staleCurated.length > 0) {
  console.error(
    `\n[check-sitemap-200] FAIL — ${staleCurated.length} hand-curated SITEMAP_ENTRIES row(s) are now redirected by server/redirects.ts:`,
  );
  for (const { entry, target } of staleCurated) {
    console.error(`  [STALE] ${entry.url}  →  ${target}`);
  }
  console.error(
    "\nFix: remove the row from SITEMAP_ENTRIES (it's already in redirectMap) — the dynamic legacy generator + buildSitemapXml dedupe will keep things consistent.",
  );
  process.exit(1);
}

interface UrlStatus {
  url: string;
  status: number | "ERR";
  location?: string | null;
  error?: string;
}

async function fetchHead(url: string): Promise<UrlStatus> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: { "User-Agent": UA },
      redirect: "manual",
      signal: ctrl.signal,
    });
    return {
      url,
      status: res.status,
      location: res.headers.get("location"),
    };
  } catch (err) {
    return {
      url,
      status: "ERR",
      error: err instanceof Error ? err.message : String(err),
    };
  } finally {
    clearTimeout(timer);
  }
}

async function pool<T, R>(
  items: T[],
  worker: (item: T) => Promise<R>,
  size = CONCURRENCY,
): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let i = 0;
  const runners = new Array(Math.min(size, items.length))
    .fill(0)
    .map(async () => {
      while (true) {
        const idx = i++;
        if (idx >= items.length) return;
        out[idx] = await worker(items[idx]);
      }
    });
  await Promise.all(runners);
  return out;
}

(async () => {
  // 1. Fetch and parse sitemap.
  const sitemapUrl = `${BASE}/sitemap.xml`;
  const sitemapRes = await fetch(sitemapUrl, {
    headers: { "User-Agent": UA },
  });
  if (!sitemapRes.ok) {
    console.error(
      `\n[check-sitemap-200] FAIL — could not fetch ${sitemapUrl} (status ${sitemapRes.status}).`,
    );
    process.exit(1);
  }
  const xml = await sitemapRes.text();
  const locs = Array.from(xml.matchAll(/<loc>([^<]+)<\/loc>/g)).map((m) =>
    m[1].trim(),
  );
  if (locs.length === 0) {
    console.error("\n[check-sitemap-200] FAIL — sitemap.xml has zero <loc> entries.");
    process.exit(1);
  }

  console.log(`  [info] /sitemap.xml advertises ${locs.length} URLs`);

  // 2. Translate every <loc> to a request against BASE so we hit the
  //    booted local server even though the sitemap emits the public domain.
  const targets = locs.map((loc) => {
    try {
      const u = new URL(loc);
      return BASE + u.pathname;
    } catch {
      // Already a relative path
      return BASE + (loc.startsWith("/") ? loc : `/${loc}`);
    }
  });

  // 3. Fan out the GETs.
  const results = await pool(targets, fetchHead);

  // 4. Categorise sitemap results.
  const offenders: UrlStatus[] = [];
  for (const r of results) {
    if (r.status === 200) continue;
    offenders.push(r);
  }

  if (offenders.length > 0) {
    console.error(
      `\n[check-sitemap-200] FAIL — ${offenders.length}/${results.length} sitemap URLs do NOT return 200:`,
    );
    for (const o of offenders) {
      const loc = o.location ? ` → ${o.location}` : "";
      const err = o.error ? ` (${o.error})` : "";
      console.error(`  [BAD] ${o.status} ${o.url}${loc}${err}`);
    }
    console.error(
      "\nA sitemap URL must serve 200 OK. 301s belong in `server/redirects.ts` and the URL must be removed from the sitemap (or auto-filtered via `getLiveLegacySitemapEntries`).",
    );
    process.exit(1);
  }

  console.log(
    `\n[check-sitemap-200] PASSED — all ${results.length} sitemap URLs return 200 OK.`,
  );

  // 5. Explicit standalone-route check (Googlebot UA, independent of sitemap).
  //    These Express routes serve static HTML files directly and must return
  //    200 even if they're temporarily absent from the sitemap.
  if (STANDALONE_ROUTES.length > 0) {
    console.log(
      `\n[check-sitemap-200] Checking ${STANDALONE_ROUTES.length} standalone route(s) explicitly …`,
    );
    const standaloneTargets = STANDALONE_ROUTES.map((r) => BASE + r);
    const standaloneResults = await pool(standaloneTargets, fetchHead);
    const standaloneOffenders = standaloneResults.filter((r) => r.status !== 200);
    if (standaloneOffenders.length > 0) {
      console.error(
        `\n[check-sitemap-200] FAIL — ${standaloneOffenders.length} standalone route(s) do NOT return 200:`,
      );
      for (const o of standaloneOffenders) {
        const loc = o.location ? ` → ${o.location}` : "";
        const err = o.error ? ` (${o.error})` : "";
        console.error(`  [BAD] ${o.status} ${o.url}${loc}${err}`);
      }
      console.error(
        "\nFix: check that the Express GET route in server/routes.ts is registered and points to the correct static HTML file.",
      );
      process.exit(1);
    }
    for (const r of standaloneResults) {
      console.log(`  [OK] 200 ${r.url}`);
    }
    console.log(
      `[check-sitemap-200] PASSED — all ${standaloneResults.length} standalone route(s) return 200 OK.`,
    );
  }
})();
