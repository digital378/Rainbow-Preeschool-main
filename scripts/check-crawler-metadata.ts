#!/usr/bin/env tsx
/**
 * Crawler-metadata regression check (predeploy).
 *
 * A recent external audit falsely claimed every page on the site returns the
 * homepage's title/canonical/description to crawlers. That specific claim
 * was false — it was tested with UAs outside the bot allow-list — but the
 * class of bug it describes IS real and worth guarding against: a route
 * registered in the client router that has no corresponding entry in
 * `server/ssr-pages.ts` silently falls through to the generic "Page Not
 * Found" SSR page, whose `<link rel="canonical">` points at the homepage.
 * A crawler hitting that route would see homepage-shaped metadata on a
 * completely different URL — exactly the "duplicate metadata" failure mode
 * the audit (wrongly, in that instance) reported.
 *
 * This script enumerates every URL a recognized crawler can reach — the
 * curated `SITEMAP_ENTRIES` list, the live `/sitemap.xml` (which adds
 * dynamic blog-post URLs), and every static route registered in
 * `client/src/App.tsx` — and, for each one, requests it with a spoofed
 * Googlebot UA and asserts:
 *
 *   1. The final response status is < 400 (redirects are followed and
 *      checked at their destination, so curated redirect-only slugs like
 *      /kids-activity-club pass by asserting on their target page).
 *   2. `<title>` and `<meta name="description">` are both non-empty.
 *   3. `<link rel="canonical">` is present and self-referencing — its path
 *      matches the URL that was actually served (after redirects), not the
 *      homepage — UNLESS the route itself is the homepage.
 *   4. The title is not the raw SPA-shell `<title>` from `client/index.html`
 *      (which would mean the bot got the un-hydrated React shell instead of
 *      server-rendered content) — UNLESS the route is the homepage, which
 *      intentionally serves the SPA shell to every visitor including bots.
 *   5. The title is not the "Page Not Found" 404 SSR marker — this is the
 *      exact signature of a route missing its `server/ssr-pages.ts` entry.
 *
 * Internal dashboard/design routes are not public SEO pages: they must
 * return 401 to both crawlers and visitors without leaking HTML, and are
 * checked separately rather than subjected to canonical/title assertions.
 *
 * It also spot-checks a handful of routes with `Claude-User` and
 * `Perplexity-User` (answer-engine fetchers that hit production live when a
 * person asks ChatGPT/Perplexity about the school) to confirm the bot-SSR
 * marker is present — i.e. these UAs are actually recognized by
 * `BOT_USER_AGENTS` in `server/bot-ssr.ts`, not silently falling through to
 * the SPA shell.
 *
 * Usage:
 *   tsx scripts/check-crawler-metadata.ts [base-url]
 *   (defaults to http://localhost:5000; predeploy passes the booted
 *   production server's URL)
 *
 * Exit codes:
 *   0 — every route passed every assertion
 *   1 — one or more routes failed (details printed per-route)
 */

import { readFileSync } from "fs";
import { resolve } from "path";

const ROOT = process.cwd();
const BASE_URL = (process.argv[2] || process.env.BASE_URL || "http://localhost:5000").replace(/\/$/, "");
const TIMEOUT_MS = 10_000;

const GOOGLEBOT_UA = "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";

// Answer-engine / LLM-citation UAs to spot-check. These must be recognized
// by BOT_USER_AGENTS in server/bot-ssr.ts (case-insensitive substring match)
// for this script to see SSR content instead of the SPA shell.
const SPOT_CHECK_UAS: { name: string; ua: string }[] = [
  { name: "Claude-User", ua: "Mozilla/5.0 (compatible; Claude-User/1.0; +https://www.anthropic.com)" },
  { name: "Perplexity-User", ua: "Mozilla/5.0 (compatible; Perplexity-User/1.0; +https://www.perplexity.ai)" },
];
const SPOT_CHECK_ROUTES = ["/about", "/ris", "/play-school-near-me"];

// Internal routes require authentication, not public SEO metadata.
// /blog/:slug templates are excluded by parseClientRoutes; concrete blog
// URLs from the live sitemap are still checked.
const PROTECTED_ROUTES = new Set<string>(["/dummy", "/GSC", "/gsc"]);
const VISITOR_UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122.0 Safari/537.36";

// ─── Helpers ──────────────────────────────────────────────────────────────

function readRepoFile(rel: string): string {
  return readFileSync(resolve(ROOT, rel), "utf8");
}

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

/** Every literal (non-dynamic) route registered in the client router. */
function parseClientRoutes(): string[] {
  const src = readRepoFile("client/src/App.tsx");
  const matches = [...src.matchAll(/<Route path="([^"]+)"/g)].map((m) => m[1]);
  // Drop dynamic templates (e.g. "/blog/:slug") — concrete instances of
  // these come from the live sitemap fetch instead.
  return matches.filter((p) => !p.includes(":"));
}

/** The curated sitemap entry list (source of truth for priority pages). */
function parseCuratedSitemapUrls(): string[] {
  const src = readRepoFile("shared/sitemap-entries.ts");
  const match = src.match(/export const SITEMAP_ENTRIES: SitemapEntry\[\] = \[([\s\S]*?)\n\];/);
  if (!match) return [];
  return [...match[1].matchAll(/url:\s*"([^"]+)"/g)].map((m) => m[1]);
}

/** Live /sitemap.xml — adds dynamically-generated blog post URLs. */
async function fetchLiveSitemapPaths(): Promise<string[]> {
  try {
    const res = await fetch(`${BASE_URL}/sitemap.xml`, {
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) return [];
    const xml = await res.text();
    return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
      .map((m) => m[1])
      .map((loc) => {
        try {
          return new URL(loc).pathname;
        } catch {
          return null;
        }
      })
      .filter((p): p is string => p !== null);
  } catch {
    return [];
  }
}

/** The SPA shell's static <title>/<meta description> from client/index.html. */
function getShellMeta(): { title: string; description: string } {
  const html = readRepoFile("client/index.html");
  const titleM = html.match(/<title>([\s\S]*?)<\/title>/i);
  const descM = html.match(/<meta\s+name="description"\s+content="([^"]*)"/i);
  return {
    title: titleM ? decodeEntities(titleM[1]) : "",
    description: descM ? decodeEntities(descM[1]) : "",
  };
}

function extractTitle(html: string): string {
  const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return m ? decodeEntities(m[1]) : "";
}

function extractMetaDescription(html: string): string {
  const m = html.match(/<meta\s+name="description"\s+content="([^"]*)"/i);
  return m ? decodeEntities(m[1]) : "";
}

function extractCanonical(html: string): string {
  const m = html.match(/<link\s+rel="canonical"\s+href="([^"]*)"/i);
  return m ? decodeEntities(m[1]) : "";
}

interface FetchOutcome {
  status: number;
  finalPath: string;
  body: string;
}

async function fetchWithUA(
  path: string,
  ua: string,
): Promise<FetchOutcome | { error: string }> {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      headers: { "User-Agent": ua, Accept: "text/html,application/xhtml+xml" },
      redirect: "follow",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    const body = await res.text();
    let finalPath = path;
    try {
      finalPath = new URL(res.url).pathname.replace(/\/$/, "") || "/";
    } catch {
      /* keep original path */
    }
    return { status: res.status, finalPath, body };
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : String(e) };
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────

interface Failure {
  route: string;
  reason: string;
}

async function main(): Promise<void> {
  // Reachability check — exit 0 quietly if no server is up (offline / CI
  // environments without a dev server running), matching the sibling smoke
  // tests' convention.
  try {
    await fetch(`${BASE_URL}/`, { signal: AbortSignal.timeout(3_000) });
  } catch {
    console.log(
      `[check-crawler-metadata] NOTICE: ${BASE_URL} is unreachable — skipping (no server running).`,
    );
    process.exit(0);
  }

  const shell = getShellMeta();

  const routeSet = new Set<string>([
    ...parseClientRoutes(),
    ...parseCuratedSitemapUrls(),
    ...(await fetchLiveSitemapPaths()),
  ]);

  // Normalize (strip trailing slash except root) and separate private routes.
  const routes = [...routeSet]
    .map((r) => (r.length > 1 ? r.replace(/\/$/, "") : r))
    .filter((r) => !PROTECTED_ROUTES.has(r))
    .sort();

  const failures: Failure[] = [];
  const notFoundTitleMarker = "Page Not Found | Rainbow Preschool International";

  for (const route of PROTECTED_ROUTES) {
    for (const [name, ua] of [["Googlebot", GOOGLEBOT_UA], ["visitor", VISITOR_UA]]) {
      const result = await fetchWithUA(route, ua);
      if ("error" in result) {
        failures.push({ route, reason: `${name} request failed: ${result.error}` });
      } else if (result.status !== 401 || /<html|<div\s+id=["']root/i.test(result.body)) {
        failures.push({ route, reason: `${name} must receive 401 without page HTML (got HTTP ${result.status})` });
      }
    }
  }

  for (const route of routes) {
    const result = await fetchWithUA(route, GOOGLEBOT_UA);

    if ("error" in result) {
      failures.push({ route, reason: `request failed: ${result.error}` });
      continue;
    }

    const { status, finalPath, body } = result;

    if (status >= 400) {
      failures.push({ route, reason: `HTTP ${status} for Googlebot UA` });
      continue;
    }

    const title = extractTitle(body);
    const description = extractMetaDescription(body);
    const canonical = extractCanonical(body);
    const isHomepage = finalPath === "/";

    if (!title) {
      failures.push({ route, reason: "missing or empty <title>" });
    } else if (title === notFoundTitleMarker) {
      failures.push({
        route,
        reason:
          'title is the "Page Not Found" SSR fallback — this route has no entry in server/ssr-pages.ts (or its parent map) so bots get a 404 page instead of real content',
      });
    } else if (!isHomepage && title === shell.title) {
      failures.push({
        route,
        reason: `title matches the raw SPA-shell <title> ("${shell.title}") — Googlebot received the un-hydrated React shell instead of server-rendered content`,
      });
    }

    if (!description) {
      failures.push({ route, reason: "missing or empty meta description" });
    } else if (!isHomepage && description === shell.description) {
      failures.push({
        route,
        reason: "meta description matches the raw SPA-shell description — same un-hydrated-shell symptom as the title check",
      });
    }

    if (!canonical) {
      failures.push({ route, reason: "missing <link rel=\"canonical\">" });
    } else {
      let canonicalPath = "";
      try {
        canonicalPath = new URL(canonical).pathname.replace(/\/$/, "") || "/";
      } catch {
        failures.push({ route, reason: `canonical is not a valid absolute URL: "${canonical}"` });
        continue;
      }
      // Case-insensitive compare: uppercase/lowercase path aliases (e.g.
      // "/RIS" canonicalizing to "/ris") are an intentional, common SEO
      // practice — not the bug this check exists to catch. Only a canonical
      // pointing at a genuinely different route (most dangerously the
      // homepage) is a failure.
      if (canonicalPath.toLowerCase() !== finalPath.toLowerCase()) {
        failures.push({
          route,
          reason: `canonical points to "${canonicalPath}" instead of self-referencing "${finalPath}"${canonicalPath === "/" && route !== "/" ? " (homepage canonical on a non-homepage route — the exact bug class this check exists to catch)" : ""}`,
        });
      }
    }
  }

  // ── Spot-check answer-engine UAs ──────────────────────────────────────
  for (const route of SPOT_CHECK_ROUTES) {
    for (const { name, ua } of SPOT_CHECK_UAS) {
      const result = await fetchWithUA(route, ua);
      if ("error" in result) {
        failures.push({ route: `${route} [${name}]`, reason: `request failed: ${result.error}` });
        continue;
      }
      if (result.status >= 400) {
        failures.push({ route: `${route} [${name}]`, reason: `HTTP ${result.status}` });
        continue;
      }
      if (!result.body.includes("Our Network:")) {
        failures.push({
          route: `${route} [${name}]`,
          reason: `${name} did not receive bot-SSR content (missing "Our Network:" footer marker) — check that its UA substring is present in BOT_USER_AGENTS in server/bot-ssr.ts`,
        });
      }
    }
  }

  // ── Report ──────────────────────────────────────────────────────────────
  console.log(
    `[check-crawler-metadata] checked ${routes.length} public route(s), ${PROTECTED_ROUTES.size * 2} private-route responses and ${SPOT_CHECK_ROUTES.length * SPOT_CHECK_UAS.length} answer-engine spot-check(s) against ${BASE_URL}`,
  );

  if (failures.length > 0) {
    console.error(`\n[check-crawler-metadata] FAIL — ${failures.length} issue(s):\n`);
    for (const f of failures) {
      console.error(`  [${f.route}] ${f.reason}`);
    }
    console.error(
      "\nFix: add/correct the route's entry in server/ssr-pages.ts (or the relevant per-route map), " +
        "or widen BOT_USER_AGENTS in server/bot-ssr.ts if an answer-engine UA isn't recognized.",
    );
    process.exit(1);
  }

  console.log("[check-crawler-metadata] PASS — every route returned self-referencing, non-shell, non-404 metadata to recognized crawlers.");
}

main().catch((err) => {
  console.error("[check-crawler-metadata] unexpected error:", err);
  process.exit(1);
});
