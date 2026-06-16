#!/usr/bin/env tsx
/**
 * Static guard: verifies no social-app in-app browser UA strings have been
 * accidentally added to BOT_USER_AGENTS in server/bot-ssr.ts.
 *
 * Social-app in-app browsers (WhatsApp, Pinterest, Instagram, Facebook App)
 * carry REAL users and must never be treated as bots. This check catches the
 * class of bug where a well-meaning edit adds a UA substring that also matches
 * an in-app browser, causing those users to receive the plain SSR page instead
 * of the full React app.
 *
 * Usage:
 *   tsx scripts/check-bot-ua-list.ts
 *
 * Exit codes:
 *   0 — no banned UA strings found in BOT_USER_AGENTS
 *   1 — one or more banned UA strings found (details printed)
 */

import fs from "fs";
import path from "path";

const BOT_SSR_FILE = path.resolve("server/bot-ssr.ts");

/**
 * UA substrings that identify social-app in-app browsers.
 * These must NEVER appear as entries in BOT_USER_AGENTS.
 *
 * Reference: the comment block at the top of server/bot-ssr.ts lists the
 * authoritative exclusion policy.
 */
const BANNED_UA_SUBSTRINGS: { token: string; label: string }[] = [
  { token: "whatsapp", label: "WhatsApp in-app browser" },
  { token: "pinterest", label: "Pinterest in-app browser" },
  { token: "instagram", label: "Instagram in-app browser" },
  { token: "fbav", label: "Facebook App (FBAV) in-app browser" },
];

function extractBotUAList(source: string): string[] {
  const match = source.match(/const BOT_USER_AGENTS\s*=\s*\[([\s\S]*?)\];/);
  if (!match) {
    console.error(
      "[check-bot-ua-list] ERROR — could not locate BOT_USER_AGENTS array in server/bot-ssr.ts.\n" +
        "  Has the variable been renamed? Update this script to match."
    );
    process.exit(1);
  }
  const entries: string[] = [];
  for (const m of match[1].matchAll(/"([^"]+)"/g)) {
    entries.push(m[1].toLowerCase());
  }
  return entries;
}

const source = fs.readFileSync(BOT_SSR_FILE, "utf-8");
const botUAs = extractBotUAList(source);

let failures = 0;

for (const { token, label } of BANNED_UA_SUBSTRINGS) {
  const hits = botUAs.filter((ua) => ua.includes(token));
  if (hits.length > 0) {
    console.error(
      `[check-bot-ua-list] FAIL — "${token}" (${label}) found in BOT_USER_AGENTS: [${hits.join(", ")}]`
    );
    console.error(
      `[check-bot-ua-list]   Real users arrive via ${label}. They must receive the full React app,`
    );
    console.error(
      `[check-bot-ua-list]   not the plain bot SSR page. Remove "${token}" from server/bot-ssr.ts.`
    );
    failures++;
  }
}

if (failures === 0) {
  console.log(
    `[check-bot-ua-list] PASS — BOT_USER_AGENTS (${botUAs.length} entries) contains no social-app in-app browser UAs.`
  );
  process.exit(0);
} else {
  console.error(
    `[check-bot-ua-list] ${failures} violation(s). Fix server/bot-ssr.ts before committing.`
  );
  process.exit(1);
}
