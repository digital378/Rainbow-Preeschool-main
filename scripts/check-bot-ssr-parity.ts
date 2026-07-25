#!/usr/bin/env tsx
/**
 * Bot/human SSR parity smoke test.
 *
 * Fetches each tested path twice — once with a Googlebot UA (expecting
 * fully-rendered SSR HTML) and once with a real Chrome UA (expecting the
 * React SPA shell). Fails with a printed summary table if any assertion
 * is violated.
 *
 * Run locally:  npm run check:ssr
 *
 * In pre-push: exits 0 with a printed notice when the base URL is
 * unreachable (no dev server running), so only hard-fails when a server
 * IS responding.
 *
 * BASE_URL env var — defaults to http://localhost:5000.
 */

const BASE_URL = process.env.BASE_URL ?? "http://localhost:5000";

const BOT_UA =
  "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";
const HUMAN_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36";

// Title that the static SPA shell (client/index.html) carries.
// BOT responses should NOT have this title — they should carry the
// page-specific title from server/ssr-pages.ts.
const SPA_SHELL_TITLE = "Rainbow Preschool | Playschool, Nursery & Kindergarten";

// A string present in every bot-SSR response (from the renderSSRHtml footer
// in server/bot-ssr.ts) but never in the React SPA shell.
const BOT_SSR_MARKER = "Our Network:";

const PATHS = ["/", "/playgroup", "/preschool-in-manpada-thane"] as const;

// ─── Types ────────────────────────────────────────────────────────────────────

interface FetchResult {
  body: string;
  headers: Headers;
  status: number;
}

interface AssertionResult {
  path: string;
  assertion: string;
  pass: boolean;
  detail: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function fetchHtml(path: string, ua: string): Promise<FetchResult> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "User-Agent": ua, Accept: "text/html,application/xhtml+xml" },
    redirect: "follow",
    signal: AbortSignal.timeout(10_000),
  });
  const body = await res.text();
  return { body, headers: res.headers, status: res.status };
}

function extractTitle(html: string): string {
  const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (!m) return "";
  return m[1]
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

function extractH1(html: string): string {
  const m = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (!m) return "";
  return m[1].replace(/<[^>]+>/g, "").trim();
}

function hasJsonLd(html: string): boolean {
  return /application\/ld\+json/i.test(html);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  // ── Reachability check ────────────────────────────────────────────────────
  // Exits 0 with a notice if the server is not running, so the pre-push hook
  // doesn't block offline / CI environments that don't start the dev server.
  // Only hard-fails when a server IS responding and an assertion fails.
  try {
    await fetch(`${BASE_URL}/`, {
      headers: { "User-Agent": HUMAN_UA },
      signal: AbortSignal.timeout(3_000),
    });
  } catch {
    console.log(
      `[check-bot-ssr-parity] NOTICE: ${BASE_URL} is unreachable — skipping (no server running).`,
    );
    process.exit(0);
  }

  // ── Fetch all paths with both UAs ─────────────────────────────────────────
  const botResponses: Record<string, FetchResult> = {};
  const humanResponses: Record<string, FetchResult> = {};

  for (const path of PATHS) {
    botResponses[path] = await fetchHtml(path, BOT_UA);
    humanResponses[path] = await fetchHtml(path, HUMAN_UA);
  }

  const results: AssertionResult[] = [];

  // ── Per-path BOT assertions ───────────────────────────────────────────────

  for (const path of PATHS) {
    const { body, headers } = botResponses[path];

    // 1. BOT response contains a non-empty <h1>
    const h1 = extractH1(body);
    const h1Pass = h1.length > 0;
    results.push({
      path,
      assertion: "BOT has non-empty <h1>",
      pass: h1Pass,
      detail: h1Pass
        ? `h1: "${h1.slice(0, 60)}"`
        : `No <h1> in bot response for ${path} — ssr-pages.ts entry may be missing or bot-SSR is not activating`,
    });

    // 2. BOT <title> differs from the SPA shell title
    const title = extractTitle(body);
    const titleDiffers = title !== SPA_SHELL_TITLE && title.length > 0;
    results.push({
      path,
      assertion: "BOT <title> differs from SPA shell title",
      pass: titleDiffers,
      detail: titleDiffers
        ? `"${title.slice(0, 70)}"`
        : `Bot response for ${path} has the SPA shell title or empty title — bot-SSR not activating for this path`,
    });

    // 4. BOT response contains at least one JSON-LD block
    const ldPass = hasJsonLd(body);
    results.push({
      path,
      assertion: "BOT has ≥1 JSON-LD block",
      pass: ldPass,
      detail: ldPass
        ? "OK"
        : `No application/ld+json found in bot response for ${path}`,
    });

    // 7. If cf-cache-status is present on the BOT response, it must not be HIT
    const cfBot = headers.get("cf-cache-status");
    if (cfBot !== null) {
      const cfBotPass = cfBot.toUpperCase() !== "HIT";
      results.push({
        path,
        assertion: "cf-cache-status ≠ HIT (bot)",
        pass: cfBotPass,
        detail: cfBotPass
          ? `cf-cache-status: ${cfBot}`
          : `BOT response for ${path} has cf-cache-status: HIT — Cloudflare is caching HTML. A cached bot response can be served to human UAs on the next request.`,
      });
    }
  }

  // ── Assertion 3: BOT titles unique across all paths ───────────────────────

  const botTitles = PATHS.map((p) => extractTitle(botResponses[p].body));
  const uniqueTitleCount = new Set(botTitles).size;
  const titlesUnique = uniqueTitleCount === PATHS.length;
  results.push({
    path: "(all paths)",
    assertion: "BOT titles are unique across paths",
    pass: titlesUnique,
    detail: titlesUnique
      ? botTitles.map((t) => `"${t.slice(0, 40)}"`).join(", ")
      : `Duplicate titles detected — two paths may share the same SSR entry. Titles: ${JSON.stringify(botTitles)}`,
  });

  // ── Per-path HUMAN assertions ─────────────────────────────────────────────

  for (const path of PATHS) {
    const { body, headers } = humanResponses[path];

    // 5. HUMAN response contains <div id="root">
    const hasRoot = body.includes('<div id="root">');
    results.push({
      path,
      assertion: 'HUMAN has <div id="root">',
      pass: hasRoot,
      detail: hasRoot
        ? "OK"
        : `Human response for ${path} is missing <div id="root"> — middleware may have served SSR HTML to a real browser`,
    });

    // 6. HUMAN response does NOT contain the bot-SSR footer marker
    const noMarker = !body.includes(BOT_SSR_MARKER);
    results.push({
      path,
      assertion: "HUMAN has no bot-SSR marker",
      pass: noMarker,
      detail: noMarker
        ? "OK"
        : `Human response for ${path} contains "${BOT_SSR_MARKER}" — CDN may have served a cached bot response to a real user`,
    });

    // 7. If cf-cache-status is present on the HUMAN response, it must not be HIT
    const cfHuman = headers.get("cf-cache-status");
    if (cfHuman !== null) {
      const cfHumanPass = cfHuman.toUpperCase() !== "HIT";
      results.push({
        path,
        assertion: "cf-cache-status ≠ HIT (human)",
        pass: cfHumanPass,
        detail: cfHumanPass
          ? `cf-cache-status: ${cfHuman}`
          : `HUMAN response for ${path} has cf-cache-status: HIT — Cloudflare is caching HTML. A cached response for one UA can be served to the other.`,
      });
    }
  }

  // ── Print summary table ───────────────────────────────────────────────────

  const colPath = Math.max(...results.map((r) => r.path.length), 12);
  const colAssertion = Math.max(...results.map((r) => r.assertion.length), 9);

  console.log(`\n[check-bot-ssr-parity] BASE_URL: ${BASE_URL}\n`);
  console.log(
    `${"Path".padEnd(colPath)}  ${"Assertion".padEnd(colAssertion)}  Status`,
  );
  console.log(
    `${"-".repeat(colPath)}  ${"-".repeat(colAssertion)}  ------`,
  );
  for (const r of results) {
    const status = r.pass ? "✓ PASS" : "✗ FAIL";
    console.log(
      `${r.path.padEnd(colPath)}  ${r.assertion.padEnd(colAssertion)}  ${status}`,
    );
    if (!r.pass) {
      console.error(`  → ${r.detail}`);
    }
  }

  const failures = results.filter((r) => !r.pass);
  if (failures.length === 0) {
    console.log(
      `\n[check-bot-ssr-parity] PASSED — ${results.length} assertion(s) passed.\n`,
    );
    process.exit(0);
  } else {
    console.error(
      `\n[check-bot-ssr-parity] FAILED — ${failures.length} of ${results.length} assertion(s) failed.\n`,
    );
    process.exit(1);
  }
}

main();
