#!/usr/bin/env tsx
/**
 * Freshness signal smoke-test for bot SSR.
 *
 * Curls every URL on which the "Reviewed by Rainbow Preschool Curriculum Team
 * — Last updated …" byline + Article JSON-LD with dateModified is required,
 * pretending to be Googlebot, and exits non-zero if any URL is missing the
 * visible byline, the visible "Last updated:" line, the Article schema, or
 * the expected dateModified date.
 *
 * Run after every monthly bump of shared/site-freshness.ts:
 *   tsx scripts/check-freshness-signal.ts            # checks against http://localhost:5000
 *   tsx scripts/check-freshness-signal.ts https://www.rainbowpreschools.com
 *
 * Exit codes:
 *   0 — all URLs emit the expected freshness signal
 *   1 — one or more URLs are missing the signal (details printed)
 *   2 — could not reach the server at all
 */

import { LAST_UPDATED_ISO, LAST_UPDATED_DISPLAY } from "../shared/site-freshness";

const BASE = (process.argv[2] || "http://localhost:5000").replace(/\/$/, "");
const UA = "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";

const COMMERCIAL_URLS = [
  "/kindergarten",
  "/nursery",
  "/playgroup",
  "/play-school-near-me",
  "/best-preschool-near-me-in-thane",
  "/preschool-admissions",
  "/preschool-near-me",
];

const LOCALITY_URLS = [
  "/preschool-in-manpada-thane",
  "/preschool-in-hariniwas-thane",
  "/preschool-in-anand-nagar-thane",
  "/preschool-in-dhokali-thane",
  "/preschool-in-kalwa-thane",
  "/preschool-in-kasarvadavali-thane",
  "/playgroup-in-manpada",
  "/playgroup-in-kalwa",
  "/playgroup-near-ghodbunder-road",
  "/playgroup-in-anand-nagar",
  "/playgroup-in-kasarvadavali",
  "/playgroup-in-dhokali",
];

const ALL_URLS = [...COMMERCIAL_URLS, ...LOCALITY_URLS];

type CheckResult = {
  url: string;
  ok: boolean;
  status: number;
  missing: string[];
};

const FETCH_TIMEOUT_MS = 15_000;

async function checkUrl(path: string): Promise<CheckResult> {
  const fullUrl = `${BASE}${path}`;
  let html = "";
  let status = 0;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(fullUrl, {
      headers: { "User-Agent": UA },
      signal: controller.signal,
    });
    status = res.status;
    html = await res.text();
  } catch (err) {
    const reason =
      (err as Error).name === "AbortError"
        ? `timeout after ${FETCH_TIMEOUT_MS}ms`
        : (err as Error).message;
    return {
      url: path,
      ok: false,
      status: 0,
      missing: [`fetch failed: ${reason}`],
    };
  } finally {
    clearTimeout(timer);
  }

  const missing: string[] = [];
  if (status !== 200) missing.push(`status=${status}`);
  if (!html.includes("Reviewed by Rainbow Preschool Curriculum Team")) {
    missing.push("byline");
  }
  if (!html.includes("Last updated:")) {
    missing.push("Last updated: line");
  }
  if (!/"@type":\s*"Article"/.test(html)) {
    missing.push("Article JSON-LD");
  }
  if (
    !html.includes(`"dateModified":"${LAST_UPDATED_ISO}"`) &&
    !html.includes(`"dateModified": "${LAST_UPDATED_ISO}"`)
  ) {
    missing.push(`dateModified=${LAST_UPDATED_ISO}`);
  }
  if (!html.includes(LAST_UPDATED_DISPLAY)) {
    missing.push(`display="${LAST_UPDATED_DISPLAY}"`);
  }

  return {
    url: path,
    ok: missing.length === 0,
    status,
    missing,
  };
}

async function main() {
  console.log(`[check-freshness-signal] BASE=${BASE}`);
  console.log(
    `[check-freshness-signal] Expecting LAST_UPDATED_ISO="${LAST_UPDATED_ISO}" / LAST_UPDATED_DISPLAY="${LAST_UPDATED_DISPLAY}"`
  );
  console.log(`[check-freshness-signal] Checking ${ALL_URLS.length} URL(s) as Googlebot…\n`);

  const results = await Promise.all(ALL_URLS.map(checkUrl));

  const failures = results.filter((r) => !r.ok);
  const reachable = results.filter((r) => r.status > 0);

  if (reachable.length === 0) {
    console.error(`[check-freshness-signal] FATAL: could not reach ${BASE} at all.`);
    process.exit(2);
  }

  for (const r of results) {
    const tag = r.ok ? "OK " : "FAIL";
    const detail = r.ok ? "" : `  missing: ${r.missing.join(", ")}`;
    console.log(`  [${tag}] ${r.url}${detail}`);
  }

  console.log(
    `\n[check-freshness-signal] ${results.length - failures.length}/${results.length} passed`
  );

  if (failures.length > 0) {
    console.error(
      `[check-freshness-signal] FAILED — ${failures.length} URL(s) missing the freshness signal.`
    );
    process.exit(1);
  }

  console.log(`[check-freshness-signal] PASSED — all URLs emit the freshness signal.`);
  process.exit(0);
}

main().catch((err) => {
  console.error(`[check-freshness-signal] Unexpected error:`, err);
  process.exit(1);
});
