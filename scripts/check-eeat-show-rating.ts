#!/usr/bin/env tsx
/**
 * EEATSignals showRating guard.
 *
 * The `showRating` prop on `<EEATSignals>` defaults to `true`, which emits
 * star-rating rich-result markup. Publishing unverified star ratings violates
 * Google's rich-result policy. Every call site must therefore pass
 * `showRating={false}` explicitly unless a verified rating source is wired up.
 *
 * This guard scans every `client/src/pages/*.tsx` file for `<EEATSignals`
 * JSX calls and fails if any call is missing `showRating={false}`.
 *
 * ALLOWLIST: Pages listed in VERIFIED_RATING_PAGES are permitted to omit
 * `showRating={false}` because they import and pass values from
 * `client/src/lib/verified-rating.ts`. All other pages must still include
 * `showRating={false}`.
 *
 * STALENESS CHECK: After the structural scan, this script also reads
 * `lastVerifiedDate` from `client/src/lib/verified-rating.ts` and prints a
 * prominent WARNING if the date is older than 120 days. The check is
 * non-blocking (exit 0) — it will not stop a commit or deploy — but it is
 * intentionally loud so the team knows the GBP figures need refreshing.
 *
 * Run locally:   npx tsx scripts/check-eeat-show-rating.ts
 */
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = process.cwd();
const PAGES_DIR = resolve(ROOT, "client/src/pages");

/**
 * Page basenames (filename only, e.g. "playgroup-landing.tsx") that are
 * permitted to display verified star ratings. These pages must import their
 * ratingValue/reviewCount from `client/src/lib/verified-rating.ts`.
 * All other pages must still carry `showRating={false}`.
 */
const VERIFIED_RATING_PAGES = new Set([
  "playgroup-landing.tsx",
  "nursery-landing.tsx",
  "kindergarten-landing.tsx",
  "play-school-near-me.tsx",
  "preschool-admissions.tsx",
  "best-preschool-in-thane.tsx",
]);

interface Violation {
  file: string;
  line: number;
  reason: string;
}

const violations: Violation[] = [];

let names: string[];
try {
  names = readdirSync(PAGES_DIR);
} catch {
  console.error(
    `[check-eeat-show-rating] Cannot read ${PAGES_DIR} — aborting.`,
  );
  process.exit(1);
}

for (const name of names) {
  if (!name.endsWith(".tsx")) continue;

  const filePath = resolve(PAGES_DIR, name);
  const src = readFileSync(filePath, "utf8");
  const lines = src.split("\n");

  const isVerifiedPage = VERIFIED_RATING_PAGES.has(name);

  for (let i = 0; i < lines.length; i++) {
    if (!lines[i].includes("<EEATSignals")) continue;

    // Opening tag found at line i (1-indexed: i+1).
    // Scan forward to find the closing `/>` or `>` of this JSX element.
    // Collect all text within the opening tag span to look for showRating={false}.
    let tagText = "";
    let j = i;
    let closed = false;

    while (j < lines.length) {
      tagText += lines[j] + "\n";
      // A self-closing tag ends with />
      // An opening tag ends with > (but not />)
      // We stop at the first occurrence of either.
      if (/\/>/.test(lines[j]) || (j > i && />/.test(lines[j]))) {
        closed = true;
        break;
      }
      // Safety: if the tag spans more than 30 lines, something is wrong —
      // stop scanning to avoid a runaway loop.
      if (j - i > 30) break;
      j++;
    }

    if (!closed) {
      // Treat unclosed tags as violations (conservative).
      violations.push({ file: `client/src/pages/${name}`, line: i + 1, reason: "unclosed tag" });
      continue;
    }

    if (isVerifiedPage) {
      // Verified pages must NOT carry showRating={false} (they should be showing ratings).
      // They must also import VERIFIED_RATING (checked at the file level, not per-tag).
      if (tagText.includes("showRating={false}")) {
        violations.push({
          file: `client/src/pages/${name}`,
          line: i + 1,
          reason:
            "verified-rating page still has showRating={false} — remove it and pass ratingValue/reviewCount from VERIFIED_RATING",
        });
      }
    } else {
      // All other pages must explicitly suppress the rating.
      if (!tagText.includes("showRating={false}")) {
        violations.push({ file: `client/src/pages/${name}`, line: i + 1, reason: "missing showRating={false}" });
      }
    }
  }

  // For verified pages, also confirm they import from verified-rating.ts.
  if (isVerifiedPage && src.includes("<EEATSignals") && !src.includes("verified-rating")) {
    violations.push({
      file: `client/src/pages/${name}`,
      line: 1,
      reason:
        "verified-rating page does not import from client/src/lib/verified-rating.ts — ratingValue/reviewCount must come from that central constant",
    });
  }
}

// ─── SSR pages hardcoded aggregateRating guard ─────────────────────────────
// server/ssr-pages.ts must NOT contain hardcoded ratingValue or reviewCount
// literals inside an aggregateRating block. All values must flow from
// VERIFIED_RATING (imported from @shared/verified-rating) so there is a
// single source of truth that is date-stamped and sourced.
const SSR_PAGES_FILE = resolve(ROOT, "server/ssr-pages.ts");
try {
  const ssrSrc = readFileSync(SSR_PAGES_FILE, "utf8");
  const ssrLines = ssrSrc.split("\n");

  // Flag any ratingValue or reviewCount/ratingCount literal string that looks
  // like a hardcoded number inside an aggregateRating block.
  // We detect this by scanning for aggregateRating blocks and checking whether
  // the values within them are string literals (e.g. "4.7", "3997") rather
  // than VERIFIED_RATING references.
  let inAggregateRating = false;
  let aggregateRatingStartLine = -1;

  for (let i = 0; i < ssrLines.length; i++) {
    const line = ssrLines[i];

    if (line.includes("aggregateRating:")) {
      inAggregateRating = true;
      aggregateRatingStartLine = i + 1;
    }

    if (inAggregateRating) {
      // Detect hardcoded numeric string literals for rating/count fields.
      // Pattern: ratingValue: "4.7" or reviewCount: "3997" or ratingCount: "3997"
      if (/(?:ratingValue|reviewCount|ratingCount)\s*:\s*"[\d.]+"/i.test(line)) {
        violations.push({
          file: "server/ssr-pages.ts",
          line: i + 1,
          reason:
            `hardcoded aggregateRating literal — use VERIFIED_RATING from @shared/verified-rating instead (e.g. String(VERIFIED_RATING.ratingValue))`,
        });
      }

      // Exit the block when we see the closing brace of the aggregateRating object.
      if (i > aggregateRatingStartLine && /^\s*\},?\s*$/.test(line)) {
        inAggregateRating = false;
      }
    }
  }
} catch {
  console.warn(
    `[check-eeat-show-rating] WARNING — could not read ${SSR_PAGES_FILE} for aggregateRating guard.`,
  );
}

// ─── Body-copy hardcoded star-rating guard ────────────────────────────────
// Scans known body-copy / blog files for hardcoded star-rating literals of
// the form "X.Y★" (e.g. "4.9★") that appear WITHOUT a VERIFIED_RATING
// interpolation on the same line. After the template-literal refactor in
// blog-post.tsx, any such literal is a regression that will drift stale when
// the GBP figures are refreshed.
const BODY_COPY_FILES = [
  "client/src/pages/blog-post.tsx",
];
// Pattern: a numeric star-rating like 4.9★ or 4.7★ as a literal string.
// This deliberately matches only digit.digit★ so it won't fire on prose like
// "5-star service" or React JSX expressions.
const HARDCODED_STAR_RE = /\d+\.\d+★/;

for (const relPath of BODY_COPY_FILES) {
  const absPath = resolve(ROOT, relPath);
  let src: string;
  try {
    src = readFileSync(absPath, "utf8");
  } catch {
    console.warn(
      `[check-eeat-show-rating] WARNING — could not read ${relPath} for star-rating guard.`,
    );
    continue;
  }

  const lines = src.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!HARDCODED_STAR_RE.test(line)) continue;
    // Allow lines that already use VERIFIED_RATING interpolation.
    if (line.includes("VERIFIED_RATING")) continue;
    violations.push({
      file: relPath,
      line: i + 1,
      reason:
        "hardcoded star-rating literal — interpolate VERIFIED_RATING.ratingValue (and VERIFIED_RATING.reviewCount if a count appears too) so the figure stays in sync when the GBP data is refreshed",
    });
  }
}

if (violations.length > 0) {
  console.error(
    `[check-eeat-show-rating] ${violations.length} violation(s) found:\n`,
  );
  for (const v of violations) {
    console.error(
      `  ${v.file}:${v.line} — ${v.reason}`,
    );
  }
  console.error(`
Fix: add  showRating={false}  to every <EEATSignals> call in client/src/pages/
that is NOT in the VERIFIED_RATING_PAGES allowlist.
For pages in the allowlist, import VERIFIED_RATING from client/src/lib/verified-rating.ts
and pass ratingValue and reviewCount — do not use showRating={false}.
Emitting star-rating rich-result markup without a verified rating source
violates Google's rich-result policy and risks manual actions.`);
  process.exit(1);
}

const total = names.filter((n) => n.endsWith(".tsx")).length;
console.log(
  `[check-eeat-show-rating] OK — scanned ${total} page file(s); verified-rating pages: ${VERIFIED_RATING_PAGES.size}; all others have showRating={false}.`,
);

// ─── Staleness check ──────────────────────────────────────────────────────────
// Read lastVerifiedDate from verified-rating.ts and warn if it is older than
// 120 days (≈ one quarter). Non-blocking: prints a warning but exits 0.
const STALE_DAYS = 120;
const VERIFIED_RATING_FILE = resolve(ROOT, "shared/verified-rating.ts");
try {
  const src = readFileSync(VERIFIED_RATING_FILE, "utf8");
  const match = src.match(/lastVerifiedDate:\s*"(\d{4}-\d{2}-\d{2})"/);
  if (match) {
    const lastVerified = new Date(match[1]);
    const today = new Date();
    const ageDays = Math.floor(
      (today.getTime() - lastVerified.getTime()) / (1000 * 60 * 60 * 24),
    );
    if (ageDays > STALE_DAYS) {
      console.warn(`
╔══════════════════════════════════════════════════════════════════════╗
║  ⚠  RATING FIGURES ARE STALE — ACTION REQUIRED                      ║
╠══════════════════════════════════════════════════════════════════════╣
║  client/src/lib/verified-rating.ts                                   ║
║  lastVerifiedDate: ${match[1]}  (${ageDays} days ago)${" ".repeat(Math.max(0, 18 - String(ageDays).length))}║
║                                                                      ║
║  Google's rich-result policy requires AggregateRating figures to     ║
║  match the live review source. Please:                               ║
║    1. Open the Rainbow Preschool International Google Business        ║
║       Profile listing (maps.google.com).                             ║
║    2. Note the current star rating and total review count.           ║
║    3. Update ratingValue, reviewCount, and lastVerifiedDate in        ║
║       client/src/lib/verified-rating.ts.                             ║
║                                                                      ║
║  This warning is non-blocking — commit/deploy will proceed.          ║
║  Refresh target: every 120 days (quarterly).                         ║
╚══════════════════════════════════════════════════════════════════════╝
`);
    } else {
      const daysUntilStale = STALE_DAYS - ageDays;
      console.log(
        `[check-eeat-show-rating] Rating freshness OK — last verified ${ageDays} day(s) ago (${match[1]}); next refresh due in ${daysUntilStale} day(s).`,
      );
    }
  } else {
    console.warn(
      `[check-eeat-show-rating] WARNING — could not parse lastVerifiedDate from ${VERIFIED_RATING_FILE}. Check the file format.`,
    );
  }
} catch {
  console.warn(
    `[check-eeat-show-rating] WARNING — could not read ${VERIFIED_RATING_FILE} for staleness check.`,
  );
}

process.exit(0);
