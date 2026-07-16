#!/usr/bin/env tsx
/**
 * Client-side JSON-LD injection guard.
 *
 * Structured data (JSON-LD) should live in server/ssr-pages.ts so that bots
 * see it without executing JavaScript. Direct DOM injection via
 *   document.createElement("script") + type "application/ld+json"
 * in client pages or components bypasses the SSR system and creates
 * schema drift between bot-rendered and JS-rendered views.
 *
 * This script scans every .tsx file under client/src/pages/ and
 * client/src/components/ for the string "application/ld+json". Any hit that
 * is NOT on the allowlist below fails the script with exit code 1.
 *
 * ALLOWLIST: Two categories.
 *
 *   PERMANENT — these files may always contain "application/ld+json":
 *     • components/seo.tsx       — core client-side SEO mechanism; structuredData
 *                                  prop is injected here for JS-rendered users.
 *     • pages/home.tsx           — homepage (/) is intentionally excluded from
 *                                  bot SSR by design (replit.md); sole schema source.
 *
 *   DEFERRED — retained with AUDIT-206 comments until SSR parity is achieved:
 *     • components/legacy-landing-page.tsx            — no SSR structuredData for legacy routes
 *     • components/landing/playgroup-landing-template.tsx — minimal SSR entries for locality pages
 *     • pages/holi-activities.tsx                     — not in SSR staticPages (see #211)
 *     • pages/republic-day-2026.tsx                   — SSR entry has no structuredData field
 *     • pages/preschool-location.tsx                  — dynamic per-centre content differs from SSR
 *
 * To add a new JSON-LD injection legitimately:
 *   1. First check whether server/ssr-pages.ts can cover it instead.
 *   2. If not, add an AUDIT comment explaining why, then add the file path to
 *      DEFERRED_ALLOWLIST below and update this script header.
 *
 * Run locally:   npx tsx scripts/check-no-client-schema-injection.ts
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { resolve, relative, join } from "node:path";

const ROOT = process.cwd();
const CLIENT_SRC = resolve(ROOT, "client/src");

const PATTERN = "application/ld+json";

/**
 * Paths relative to the project root that are permanently permitted to contain
 * "application/ld+json". These will not be removed even after full SSR parity.
 */
const PERMANENT_ALLOWLIST = new Set([
  "client/src/components/seo.tsx",
  "client/src/pages/home.tsx",
]);

/**
 * Paths relative to the project root that are temporarily permitted while SSR
 * coverage is being expanded (see AUDIT-206 comments in each file).
 * Remove entries here as their corresponding SSR coverage is added.
 */
const DEFERRED_ALLOWLIST = new Set([
  "client/src/components/legacy-landing-page.tsx",
  "client/src/components/landing/playgroup-landing-template.tsx",
  "client/src/pages/holi-activities.tsx",
  "client/src/pages/preschool-location.tsx",
]);

const ALLOWLIST = new Set([...PERMANENT_ALLOWLIST, ...DEFERRED_ALLOWLIST]);

function walkTsx(dir: string): string[] {
  const results: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      results.push(...walkTsx(full));
    } else if (entry.endsWith(".tsx") || entry.endsWith(".ts")) {
      results.push(full);
    }
  }
  return results;
}

const scanDirs = [
  resolve(CLIENT_SRC, "pages"),
  resolve(CLIENT_SRC, "components"),
];

const violations: Array<{ rel: string; line: number }> = [];
let scanned = 0;

for (const dir of scanDirs) {
  for (const abs of walkTsx(dir)) {
    const rel = relative(ROOT, abs).replace(/\\/g, "/");
    const lines = readFileSync(abs, "utf8").split("\n");
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes(PATTERN)) {
        if (!ALLOWLIST.has(rel)) {
          violations.push({ rel, line: i + 1 });
        }
      }
    }
    scanned++;
  }
}

const prefix = "[check-no-client-schema-injection]";

if (violations.length > 0) {
  console.error(
    `\n${prefix} ❌  New client-side JSON-LD injection detected!\n`
  );
  for (const { rel, line } of violations) {
    console.error(`  ${rel}:${line}  contains "${PATTERN}"`);
  }
  console.error(`
${prefix} Structured data must live in server/ssr-pages.ts so bots see it
${prefix} without running JavaScript. Client-side DOM injection bypasses the
${prefix} SSR schema system and causes schema drift between crawlers and users.
${prefix}
${prefix} Fix options:
${prefix}   1. Add the schema to the matching entry in server/ssr-pages.ts
${prefix}      (the structuredData array). Bot SSR + the SEO component will
${prefix}      handle injection for bots and JS-rendered users respectively.
${prefix}   2. If the schema genuinely cannot go in SSR (e.g. dynamic content),
${prefix}      add an AUDIT-206 comment explaining why, then add the file path
${prefix}      to DEFERRED_ALLOWLIST in scripts/check-no-client-schema-injection.ts
${prefix}      and update the header comment.
${prefix}
${prefix} Bypass once (emergency only): git commit --no-verify`
  );
  process.exit(1);
}

console.log(
  `${prefix} OK — ${scanned} file(s) scanned, no unauthorised JSON-LD injections found.`
);
process.exit(0);
