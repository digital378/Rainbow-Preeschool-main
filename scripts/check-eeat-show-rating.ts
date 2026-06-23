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
process.exit(0);
