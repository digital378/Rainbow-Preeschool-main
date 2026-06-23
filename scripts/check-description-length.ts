#!/usr/bin/env tsx
/**
 * No-overlong-meta-description guard.
 *
 * Google truncates meta descriptions in SERP snippets at roughly 155–160
 * characters on desktop and ~130 on mobile. Anything beyond ~155 is wasted
 * (and worse: the snippet ends mid-sentence). This guard scans the same
 * source files as `check-no-title-cannibalisation.ts` and fails CI if any
 * `description:` literal exceeds 155 characters.
 *
 * Sources scanned:
 *   - server/ssr-pages.ts            staticPages map → description
 *                                    BLOG_POST_SEO_DATA → description
 *   - shared/centre-data.ts          preschoolPageSEO + localPageSEO →
 *                                    description (paired with canonicalPath)
 *   - shared/playgroup-landing-data  url → seo.description
 *   - shared/legacy-pages-data.ts    141 blog entries → metaDescription
 *   - client/src/pages/*.tsx         <SEO description="..."> literal
 *
 * Run locally:   npx tsx scripts/check-description-length.ts
 */
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = process.cwd();
const MAX_LEN = 155;

interface DescEntry {
  file: string;
  line: number;
  url: string;
  description: string;
}

const entries: DescEntry[] = [];
const errors: string[] = [];

function readLines(rel: string): string[] {
  return readFileSync(resolve(ROOT, rel), "utf8").split("\n");
}

// --- server/ssr-pages.ts -----------------------------------------------------
function scanSsrPages() {
  const file = "server/ssr-pages.ts";
  const lines = readLines(file);
  type MapName = "staticPages" | "blog";
  let inMap: MapName | null = null;
  let currentKey = "";
  let braceDepth = 0;
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
    const keyMatch = line.match(/^\s\s"([^"]+)":\s*\{/);
    if (keyMatch && braceDepth === 1) {
      currentKey = keyMatch[1];
      braceDepth = 2;
      continue;
    }
    if (braceDepth >= 2) {
      const dMatch = line.match(/^\s+description:\s*"((?:[^"\\]|\\.)*)"/);
      if (dMatch) {
        const url = inMap === "staticPages" ? currentKey : `/blog/${currentKey}`;
        entries.push({ file, line: i + 1, url, description: dMatch[1] });
      }
      if (/^\s\s\},?\s*$/.test(line)) {
        braceDepth = 1;
        currentKey = "";
      }
    }
    if (braceDepth === 1 && /^\};\s*$/.test(line)) {
      inMap = null;
      braceDepth = 0;
    }
  }
}

// --- shared/centre-data.ts ---------------------------------------------------
// Pair each `description:` line with the *next* `canonicalPath:` line in the
// same entry block.
function scanCentreData() {
  const file = "shared/centre-data.ts";
  const lines = readLines(file);
  let pendingDesc: { line: number; description: string } | null = null;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const dMatch = line.match(/^\s+description:\s*"((?:[^"\\]|\\.)*)"/);
    if (dMatch) {
      pendingDesc = { line: i + 1, description: dMatch[1] };
      continue;
    }
    const canonMatch = line.match(/^\s+canonicalPath:\s*"((?:[^"\\]|\\.)*)"/);
    if (canonMatch && pendingDesc) {
      entries.push({
        file,
        line: pendingDesc.line,
        url: canonMatch[1],
        description: pendingDesc.description,
      });
      pendingDesc = null;
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
    const dMatch = line.match(/^\s+description:\s*"((?:[^"\\]|\\.)*)"/);
    if (dMatch && currentUrlSeen) {
      entries.push({ file, line: i + 1, url: currentUrl, description: dMatch[1] });
      currentUrlSeen = false;
    }
  }
}

// --- shared/legacy-pages-data.ts ---------------------------------------------
// Each blog entry has a `metaDescription:` field (not `description:`).
function scanLegacyPages() {
  const file = "shared/legacy-pages-data.ts";
  const lines = readLines(file);
  let currentSlug = "";
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const slugMatch = line.match(/^\s+slug:\s*"((?:[^"\\]|\\.)*)"/);
    if (slugMatch) {
      currentSlug = slugMatch[1];
      continue;
    }
    const dMatch = line.match(/^\s+metaDescription:\s*"((?:[^"\\]|\\.)*)"/);
    if (dMatch) {
      entries.push({
        file,
        line: i + 1,
        url: `/blog/${currentSlug}`,
        description: dMatch[1],
      });
    }
  }
}

// --- client/src/pages/*.tsx --------------------------------------------------
const CLIENT_PAGE_URLS: Record<string, string> = {
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
};

function scanClientPages() {
  const dir = "client/src/pages";
  let names: string[];
  try {
    names = readdirSync(resolve(ROOT, dir));
  } catch {
    return;
  }
  for (const name of names) {
    if (!name.endsWith(".tsx")) continue;
    const file = `${dir}/${name}`;
    const lines = readLines(file);
    let waiting = false;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.includes("<SEO")) waiting = true;
      if (waiting) {
        const m = line.match(/description=(?:"((?:[^"\\]|\\.)*)"|\{(?:[^}]+)\})/);
        if (m) {
          if (m[1] !== undefined) {
            entries.push({
              file,
              line: i + 1,
              url: CLIENT_PAGE_URLS[name] ?? "?",
              description: m[1],
            });
          }
          waiting = false;
        }
        if (line.includes("/>")) waiting = false;
      }
    }
  }
}

scanSsrPages();
scanCentreData();
scanPlaygroupLanding();
scanLegacyPages();
scanClientPages();

for (const e of entries) {
  if (e.description.length > MAX_LEN) {
    errors.push(
      `${e.file}:${e.line} — description for ${e.url} is ${e.description.length} chars (limit ${MAX_LEN}). Description: "${e.description}"`,
    );
  }
}

if (errors.length > 0) {
  console.error(`[check-description-length] ${errors.length} violation(s):`);
  for (const err of errors) console.error("  " + err);
  console.error(
    `\nFix: trim each offending description to ${MAX_LEN} chars or fewer. Google truncates SERP snippets around ${MAX_LEN} chars on desktop.`,
  );
  process.exit(1);
}

console.log(
  `[check-description-length] OK — ${entries.length} descriptions scanned, all ≤ ${MAX_LEN} chars.`,
);
process.exit(0);
