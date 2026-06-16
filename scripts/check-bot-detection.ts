#!/usr/bin/env tsx
/**
 * Bot-detection HTTP smoke-test.
 *
 * Requests the homepage three times with different User-Agent strings and
 * asserts that the server routes each request correctly:
 *
 *   Real-user UAs (WhatsApp, Pinterest, Instagram in-app browsers)
 *     → must receive the React shell: <div id="root"> present, NOT SSR-only HTML.
 *
 *   Bot UAs (Googlebot)
 *     → must receive SSR HTML: <script type="application/ld+json"> present.
 *
 * This catches the category of bug where a social-app in-app browser UA is
 * accidentally added to BOT_USER_AGENTS, causing real users to see the plain
 * SSR page instead of the interactive React app.
 *
 * Usage:
 *   tsx scripts/check-bot-detection.ts                  # uses http://localhost:5000
 *   tsx scripts/check-bot-detection.ts http://localhost:5000
 *
 * Exit codes:
 *   0 — all assertions passed
 *   1 — one or more assertions failed (details printed)
 *   2 — could not reach the server at all
 */

const BASE = (process.argv[2] || "http://localhost:5000").replace(/\/$/, "");
const FETCH_TIMEOUT_MS = 15_000;
const TEST_PATH = "/";

// ── Real-user in-app browser UAs ─────────────────────────────────────────────
// These MUST receive the React shell (<div id="root">).
// If any of these gets the SSR page it means the UA was mistakenly added to
// BOT_USER_AGENTS and real users are broken.
const REAL_USER_UAS: { name: string; ua: string }[] = [
  {
    name: "WhatsApp iOS",
    ua: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) WhatsApp/23.20.77 Mobile/15E148 Safari/604.1",
  },
  {
    name: "Pinterest iOS",
    ua: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Pinterest/11.31 Mobile/15E148 Safari/604.1",
  },
  {
    name: "Instagram iOS",
    ua: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 303.0.0.30.107",
  },
];

// ── Bot UAs ───────────────────────────────────────────────────────────────────
// These MUST receive SSR HTML (JSON-LD present).
// If a bot UA gets only the React shell it means the bot SSR middleware has
// regressed.
const BOT_UAS: { name: string; ua: string }[] = [
  {
    name: "Googlebot",
    ua: "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

type FetchResult =
  | { ok: true; status: number; body: string }
  | { ok: false; error: string };

async function fetchPage(ua: string): Promise<FetchResult> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(`${BASE}${TEST_PATH}`, {
      headers: { "User-Agent": ua },
      redirect: "follow",
      signal: controller.signal,
    });
    const body = await res.text();
    return { ok: true, status: res.status, body };
  } catch (err: unknown) {
    return { ok: false, error: String(err) };
  } finally {
    clearTimeout(timer);
  }
}

// ── Connectivity probe ────────────────────────────────────────────────────────

const probe = await fetchPage("curl/bot-detection-smoke-test");
if (!probe.ok) {
  console.error(`[check-bot-detection] ERROR — could not reach ${BASE}: ${probe.error}`);
  console.error("[check-bot-detection] Is the server running?");
  process.exit(2);
}

// ── Run assertions ────────────────────────────────────────────────────────────

let failures = 0;
const lines: { pass: boolean; msg: string }[] = [];

// Real-user UAs → expect React shell.
for (const { name, ua } of REAL_USER_UAS) {
  const result = await fetchPage(ua);
  if (!result.ok) {
    lines.push({ pass: false, msg: `[${name}] fetch error: ${result.error}` });
    failures++;
    continue;
  }
  const hasRoot = result.body.includes('<div id="root">');
  const hasJsonLd = result.body.includes('<script type="application/ld+json">');

  if (!hasRoot) {
    lines.push({
      pass: false,
      msg:
        `[${name}] expected <div id="root"> (React shell) but it was absent.\n` +
        (hasJsonLd
          ? `         Response contains JSON-LD — UA was treated as a bot.\n` +
            `         Check BOT_USER_AGENTS in server/bot-ssr.ts.`
          : `         Response appears to be neither the React shell nor the SSR page.`),
    });
    failures++;
  } else {
    lines.push({ pass: true, msg: `[${name}] React shell received (<div id="root"> present). ✓` });
  }
}

// Bot UAs → expect SSR HTML with JSON-LD.
for (const { name, ua } of BOT_UAS) {
  const result = await fetchPage(ua);
  if (!result.ok) {
    lines.push({ pass: false, msg: `[${name}] fetch error: ${result.error}` });
    failures++;
    continue;
  }
  const hasRoot = result.body.includes('<div id="root">');
  const hasJsonLd = result.body.includes('<script type="application/ld+json">');

  if (!hasJsonLd) {
    lines.push({
      pass: false,
      msg:
        `[${name}] expected SSR HTML with JSON-LD but <script type="application/ld+json"> was absent.\n` +
        (hasRoot
          ? `         Response contains <div id="root"> — bot UA may have been removed from BOT_USER_AGENTS.\n` +
            `         Check server/bot-ssr.ts.`
          : `         Response appears to be neither SSR HTML nor the React shell.`),
    });
    failures++;
  } else {
    lines.push({ pass: true, msg: `[${name}] SSR HTML received (JSON-LD present). ✓` });
  }
}

// ── Output ────────────────────────────────────────────────────────────────────

for (const { pass, msg } of lines) {
  if (pass) {
    console.log(`[check-bot-detection] PASS ${msg}`);
  } else {
    console.error(`[check-bot-detection] FAIL ${msg}`);
  }
}

const total = REAL_USER_UAS.length + BOT_UAS.length;
if (failures === 0) {
  console.log(`[check-bot-detection] PASS — all ${total} UA checks passed.`);
  process.exit(0);
} else {
  console.error(`[check-bot-detection] ${failures}/${total} check(s) failed. See details above.`);
  process.exit(1);
}
