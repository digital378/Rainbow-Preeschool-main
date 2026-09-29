#!/usr/bin/env tsx
/**
 * Freshness signal smoke-test for bot SSR.
 *
 * Curls every URL on which the "Reviewed by Rainbow Preschool Curriculum Team
 * — Last updated …" byline + dated JSON-LD is required,
 * pretending to be Googlebot, and exits non-zero if any URL is missing the
 * visible byline, the visible "Last updated:" line, the page schema, or
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
import { HOME_PUBLISH_DATE_ISO } from "../shared/home-publish-date";
import { ADMISSIONS_PUBLISH_DATE_ISO, ADMISSIONS_PUBLISH_DATE_DISPLAY } from "../shared/admissions-page-copy";
import { PLAYGROUP_COPY } from "../shared/playgroup-page-content";
import { NURSERY_COPY } from "../shared/nursery-page-content";
import { KINDERGARTEN_COPY } from "../shared/kindergarten-page-content";

const BASE = (process.argv[2] || "http://localhost:5000").replace(/\/$/, "");
const UA = "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";

const COMMERCIAL_URLS = [
  "/kindergarten",
  "/nursery",
  "/playgroup",
  "/play-school-near-me",
  "/preschool-admissions",
];

const LOCALITY_URLS = [
  "/preschool-in-manpada-thane",
  "/preschool-in-hariniwas-thane",
  "/preschool-in-anand-nagar-thane",
  "/preschool-in-dhokali-thane",
  "/preschool-in-kalwa-thane",
  "/preschool-in-kasarvadavali-thane",
];

// Remaining indexable, evergreen landers (supporting pages).
// "/" is served as the React SPA (bot SSR is bypassed at that path), so its
// freshness signals come from two places:
//   • server/homepage-freshness.ts injects WebPage JSON-LD into the HTML shell.
//   • The <EEATSignals> component in client/src/pages/home.tsx renders the
//     visible byline after React hydrates (visible to Googlebot and users).
// All other URLs use bot SSR (server/ssr-pages.ts) for their freshness signal.
const EVERGREEN_LANDER_URLS = [
  "/",
  "/about",
  "/programmes",
  "/gallery",
  "/contact",
  "/blog",
  "/happy-times",
  "/preschool-readiness-quiz",
  "/top-preschools-in-thane",
  "/testimonials",
  "/faqs",
];

const ALL_URLS = [...COMMERCIAL_URLS, ...LOCALITY_URLS, ...EVERGREEN_LANDER_URLS];

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
  if (path !== "/" && !html.includes("Reviewed by Rainbow Preschool Curriculum Team")) {
    missing.push("byline");
  }
  if (path !== "/" && !html.includes("Last updated:")) {
    missing.push("Last updated: line");
  }
  const admissionsPage = path === "/preschool-admissions";
  const programmePage = path === "/playgroup" || path === "/nursery" || path === "/kindergarten";
  const expectedType = path === "/" || admissionsPage || programmePage ? "WebPage" : "Article";
  if (!new RegExp(`"@type":\\s*"${expectedType}"`).test(html)) {
    missing.push(`${expectedType} JSON-LD`);
  }
  if ((path === "/" || admissionsPage || programmePage) && /"@type":\s*"Article"/.test(html)) {
    missing.push(`unexpected Article JSON-LD on ${path}`);
  }
  const expectedDate = path === "/"
    ? HOME_PUBLISH_DATE_ISO
    : admissionsPage ? ADMISSIONS_PUBLISH_DATE_ISO
    : path === "/playgroup" ? PLAYGROUP_COPY.publishDate
    : path === "/nursery" ? NURSERY_COPY.publishDate
    : path === "/kindergarten" ? KINDERGARTEN_COPY.publishDate
    : LAST_UPDATED_ISO;
  if (
    !html.includes(`"dateModified":"${expectedDate}"`) &&
    !html.includes(`"dateModified": "${expectedDate}"`)
  ) {
    missing.push(`dateModified=${expectedDate}`);
  }
  const expectedDisplay = admissionsPage ? ADMISSIONS_PUBLISH_DATE_DISPLAY
    : path === "/playgroup" ? PLAYGROUP_COPY.publishDateDisplay
    : path === "/nursery" ? NURSERY_COPY.publishDateDisplay
    : path === "/kindergarten" ? KINDERGARTEN_COPY.publishDateDisplay
    : LAST_UPDATED_DISPLAY;
  if (path !== "/" && !html.includes(expectedDisplay)) {
    missing.push(`display="${expectedDisplay}"`);
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
    `[check-freshness-signal] Expecting standard date="${LAST_UPDATED_ISO}", admissions date="${ADMISSIONS_PUBLISH_DATE_ISO}", homepage date="${HOME_PUBLISH_DATE_ISO}"`
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
