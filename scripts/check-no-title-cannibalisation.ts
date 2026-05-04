#!/usr/bin/env tsx
/**
 * No-title-cannibalisation guard.
 *
 * Enforces two SEO hygiene rules across every shipped page title:
 *
 *   1. BANNED SOFT-MARKETING WORDS — titles may not contain any of
 *      "loved", "most-loved", "amazing", "incredible", "wonderful",
 *      "magical", "fabulous", "awesome" (case-insensitive). Body copy
 *      and descriptions are unaffected; this rule only fires on the
 *      `title:` field of SSR page maps and the `title=` prop of the
 *      client `<SEO>` component.
 *
 *   2. KEYWORD OWNERSHIP — every commercial keyword phrase has exactly
 *      one canonical URL, and no other URL's title may contain that
 *      phrase. The matrix:
 *
 *         "Best Preschool in Thane"        → /best-preschool-near-me-in-thane
 *         "Play School Near Me"            → /play-school-near-me
 *         "Playgroup in Thane"             → /playgroup
 *         "Nursery School in Thane"        → /nursery
 *         "Kindergarten in Thane"          → /kindergarten
 *         "Preschool Admissions in Thane"  → /preschool-admissions
 *         (bare) "Preschool in Thane"      → /best-preschool-near-me-in-thane
 *                                            (the home page is brand-led
 *                                            and uses "Preschool Chain in
 *                                            Thane" instead of the bare
 *                                            phrase)
 *
 *      Locality variants such as "Preschool in Manpada, Thane" or
 *      "Playgroup in Kalwa, Thane" do NOT match the bare phrases (the
 *      regex word boundary is anchored to "in <thane>" with thane
 *      immediately after the preposition).
 *
 * Sources scanned:
 *   - server/ssr-pages.ts            staticPages map keys → title
 *                                    BLOG_POST_SEO_DATA slug → title
 *                                    (any top-level `title: "..."` line)
 *   - shared/centre-data.ts          preschoolPageSEO + localPageSEO
 *                                    canonicalPath → title
 *   - shared/playgroup-landing-data  url → seo.title
 *   - client/src/pages/*.tsx         <SEO ... title="..."> literal
 *                                    (file path used as the URL key
 *                                    via a small static map below;
 *                                    files not in the map are scanned
 *                                    only for the banned-word rule)
 *
 * Exit 0 = clean. Exit 1 = regression — every offending file:line is
 * printed.
 *
 * Run locally:   npx tsx scripts/check-no-title-cannibalisation.ts
 */
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = process.cwd();

const BANNED_TITLE_WORDS = [
  "loved",
  "most-loved",
  "amazing",
  "incredible",
  "wonderful",
  "magical",
  "fabulous",
  "awesome",
];

const OWNED_PHRASES: Array<{ phrase: RegExp; label: string; canonicalUrls: RegExp[] }> = [
  {
    phrase: /\bbest preschool in thane\b/i,
    label: "Best Preschool in Thane",
    canonicalUrls: [/^\/best-preschool-near-me-in-thane$/],
  },
  {
    phrase: /\bplay school near me\b/i,
    label: "Play School Near Me",
    canonicalUrls: [/^\/play-school-near-me$/],
  },
  {
    phrase: /\bplaygroup in thane\b/i,
    label: "Playgroup in Thane",
    canonicalUrls: [/^\/playgroup$/, /^\/playgroup-in-thane$/],
  },
  {
    phrase: /\bnursery school in thane\b/i,
    label: "Nursery School in Thane",
    canonicalUrls: [/^\/nursery$/],
  },
  {
    phrase: /\bkindergarten in thane\b/i,
    label: "Kindergarten in Thane",
    canonicalUrls: [/^\/kindergarten$/],
  },
  {
    phrase: /\bpreschool admissions in thane\b/i,
    label: "Preschool Admissions in Thane",
    canonicalUrls: [/^\/preschool-admissions$/],
  },
  {
    phrase: /\bpreschool in thane\b/i,
    label: "Preschool in Thane (bare)",
    canonicalUrls: [/^\/best-preschool-near-me-in-thane$/, /^\/preschool-admissions$/],
  },
];

interface TitleEntry {
  file: string;
  line: number;
  url: string;
  title: string;
}

const titles: TitleEntry[] = [];
const errors: string[] = [];

function readLines(rel: string): string[] {
  return readFileSync(resolve(ROOT, rel), "utf8").split("\n");
}

// --- server/ssr-pages.ts -----------------------------------------------------
//
// Walks the staticPages map (URL keys) and BLOG_POST_SEO_DATA map (slug keys)
// and emits one TitleEntry per top-level `title: "..."` line found inside.
function scanSsrPages() {
  const file = "server/ssr-pages.ts";
  const lines = readLines(file);
  type MapName = "staticPages" | "blog";
  let inMap: MapName | null = null;
  let currentKey = "";
  let braceDepth = 0; // depth INSIDE the current map's `{}`
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!inMap) {
      if (/^const staticPages: Record<string, PageSEOData> = \{/.test(line)) {
        inMap = "staticPages";
        braceDepth = 1;
        continue;
      }
      if (/^const BLOG_POST_SEO_DATA[: =]/.test(line)) {
        inMap = "blog";
        braceDepth = 1;
        continue;
      }
      continue;
    }
    // Detect a top-level entry key: `  "key": {`
    const keyMatch = line.match(/^\s\s"([^"]+)":\s*\{/);
    if (keyMatch && braceDepth === 1) {
      currentKey = keyMatch[1];
      braceDepth = 2;
      continue;
    }
    if (braceDepth >= 2) {
      const titleMatch = line.match(/^\s+title:\s*"((?:[^"\\]|\\.)*)"/);
      if (titleMatch) {
        const url = inMap === "staticPages" ? currentKey : `/blog/${currentKey}`;
        titles.push({ file, line: i + 1, url, title: titleMatch[1] });
      }
      // Closing brace of the current entry: `  },`
      if (/^\s\s\},?\s*$/.test(line)) {
        braceDepth = 1;
        currentKey = "";
      }
    }
    // Closing brace of the entire map at column 0: `};`
    if (braceDepth === 1 && /^\};\s*$/.test(line)) {
      inMap = null;
      braceDepth = 0;
    }
  }
}

// --- shared/centre-data.ts ---------------------------------------------------
//
// preschoolPageSEO and localPageSEO each have a `canonicalPath` and `title`
// — pair them by simple lookahead within each entry block.
function scanCentreData() {
  const file = "shared/centre-data.ts";
  const lines = readLines(file);
  let pendingTitle: { line: number; title: string } | null = null;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const titleMatch = line.match(/^\s+title:\s*"((?:[^"\\]|\\.)*)"/);
    if (titleMatch) {
      pendingTitle = { line: i + 1, title: titleMatch[1] };
      continue;
    }
    const canonMatch = line.match(/^\s+canonicalPath:\s*"((?:[^"\\]|\\.)*)"/);
    if (canonMatch && pendingTitle) {
      titles.push({ file, line: pendingTitle.line, url: canonMatch[1], title: pendingTitle.title });
      pendingTitle = null;
    }
  }
}

// --- shared/playgroup-landing-data.ts ----------------------------------------
function scanPlaygroupLanding() {
  const file = "shared/playgroup-landing-data.ts";
  const lines = readLines(file);
  let currentUrl = "";
  let currentUrlSeen = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const urlMatch = line.match(/^\s+url:\s*"((?:[^"\\]|\\.)*)"/);
    if (urlMatch) {
      currentUrl = urlMatch[1];
      currentUrlSeen = true;
      continue;
    }
    const titleMatch = line.match(/^\s+title:\s*"((?:[^"\\]|\\.)*)"/);
    if (titleMatch && currentUrlSeen) {
      titles.push({ file, line: i + 1, url: currentUrl, title: titleMatch[1] });
      currentUrlSeen = false; // consume — next entry must declare its own url
    }
  }
}

// --- client/src/pages/*.tsx --------------------------------------------------
//
// Map page filename → URL so we can apply the ownership rule. Files not in
// this map are still scanned for the banned-word rule (URL recorded as "?").
const CLIENT_PAGE_URLS: Record<string, string> = {
  // Verified against client/src/App.tsx <Route> bindings — keep in sync.
  "home.tsx": "/",
  "about.tsx": "/about",
  "programmes.tsx": "/programmes",
  "playgroup-landing.tsx": "/playgroup",
  "nursery-landing.tsx": "/nursery",
  "kindergarten-landing.tsx": "/kindergarten",
  "gallery.tsx": "/gallery",
  "contact.tsx": "/contact",
  "blog.tsx": "/blog",
  "preschool-admissions.tsx": "/preschool-admissions",
  "best-preschool-in-thane.tsx": "/best-preschool-near-me-in-thane",
  "play-school-near-me.tsx": "/play-school-near-me",
  "happy-times-landing.tsx": "/happy-times",
  "kids-activity-club-landing.tsx": "/kids-activity-club",
  "summer-camp-landing.tsx": "/summer-camp",
  "readiness-quiz.tsx": "/preschool-readiness-quiz",
  "top-preschools-thane.tsx": "/top-preschools-in-thane",
  "testimonials.tsx": "/testimonials",
  "faqs.tsx": "/faqs",
  "republic-day-2026.tsx": "/blog/republic-day-2026",
  // Locality landing pages (single file, multiple exports).
  // Mapped to /playgroup so the bare "Playgroup in Thane" rule still
  // accepts their titles via the /playgroup canonical owner.
  "local-playgroup.tsx": "/playgroup",
};

function scanClientPages() {
  const dir = "client/src/pages";
  let entries: string[];
  try {
    entries = readdirSync(resolve(ROOT, dir));
  } catch {
    return;
  }
  for (const name of entries) {
    if (!name.endsWith(".tsx")) continue;
    const file = `${dir}/${name}`;
    const lines = readLines(file);
    // Look for `<SEO` and the next title= prop on subsequent lines.
    let waitingForTitle = false;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.includes("<SEO")) {
        waitingForTitle = true;
      }
      if (waitingForTitle) {
        const m = line.match(/title=(?:"((?:[^"\\]|\\.)*)"|\{(?:[^}]+)\})/);
        if (m) {
          if (m[1] !== undefined) {
            titles.push({
              file,
              line: i + 1,
              url: CLIENT_PAGE_URLS[name] ?? "?",
              title: m[1],
            });
          }
          waitingForTitle = false;
        }
      }
    }
  }
}

// --- Validation --------------------------------------------------------------
function validate() {
  for (const entry of titles) {
    // Rule 1: banned words
    for (const w of BANNED_TITLE_WORDS) {
      const re = new RegExp(`\\b${w.replace(/-/g, "\\-")}\\b`, "i");
      if (re.test(entry.title)) {
        errors.push(
          `${entry.file}:${entry.line} — banned soft-marketing word "${w}" in title for ${entry.url}: "${entry.title}"`,
        );
      }
    }
    // Rule 2: keyword ownership
    for (const rule of OWNED_PHRASES) {
      if (!rule.phrase.test(entry.title)) continue;
      if (entry.url === "?") continue; // unknown client URL — only banned-word rule applies
      const allowed = rule.canonicalUrls.some((re) => re.test(entry.url));
      if (!allowed) {
        errors.push(
          `${entry.file}:${entry.line} — title for ${entry.url} contains "${rule.label}", which is owned by ${rule.canonicalUrls
            .map((r) => r.source.replace(/^\^|\$$/g, ""))
            .join(" or ")}. Title: "${entry.title}"`,
        );
      }
    }
  }
}

scanSsrPages();
scanCentreData();
scanPlaygroupLanding();
scanClientPages();
validate();

if (errors.length > 0) {
  console.error(`[check-no-title-cannibalisation] ${errors.length} violation(s):`);
  for (const e of errors) console.error("  " + e);
  console.error(
    `\nFix: rewrite the offending title so it (a) drops the banned soft-marketing word, ` +
      `and/or (b) does not poach a keyword owned by another canonical URL. See the keyword-ownership ` +
      `matrix at the top of this file.`,
  );
  process.exit(1);
}

console.log(
  `[check-no-title-cannibalisation] OK — ${titles.length} titles scanned, no banned words and no keyword poaching detected.`,
);
process.exit(0);
