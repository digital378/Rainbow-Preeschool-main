#!/usr/bin/env tsx
/**
 * Org-only attribution guard. Two passes:
 *   1. Schema:   `"@type":"Person"` under author / reviewer / reviewedBy /
 *                contributor / creator / publisher / editor.
 *   2. Byline:   `name: "First Last"` near review/testimonial/parent
 *                context, where value is not one of the approved labels
 *                ("Rainbow Preschool International",
 *                 "Rainbow Preschool Curriculum Team",
 *                 "A Rainbow Parent").
 *
 * Exit 0 = clean, exit 1 = regression (file:line printed).
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = process.cwd();

const INCLUDE_DIRS = ["client/src", "server", "shared", "scripts"];
const INCLUDE_EXT = [".ts", ".tsx", ".js", ".jsx"];

// Directories whose contents must never be scanned (build artefacts,
// vendored deps, etc.).
const EXCLUDE_DIR_NAMES = new Set([
  "node_modules",
  "dist",
  "build",
  ".git",
  ".local",
  "coverage",
]);

// This file (and the keyword-targets script) intentionally contains the
// pattern as a literal regex to detect — they must be allow-listed.
const ALLOW_FILES = new Set([
  "scripts/check-no-person-author.ts",
  "scripts/check-keyword-targets.ts",
]);

interface Hit {
  file: string;
  line: number;
  text: string;
}

function walk(dir: string, out: string[]): void {
  for (const entry of readdirSync(dir)) {
    if (EXCLUDE_DIR_NAMES.has(entry)) continue;
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      walk(full, out);
    } else if (INCLUDE_EXT.some((e) => entry.endsWith(e))) {
      out.push(full);
    }
  }
}

// Match an `"@type": "Person"` token, allowing optional whitespace and
// either single or double quotes around the key/value. Catches both
// JSON-LD literals embedded in source and JS object literals that get
// JSON.stringified at runtime.
const PERSON_RE = /["']@type["']\s*:\s*["']Person["']/;

// Restrict failures to Person nodes that sit underneath a property
// indicating editorial attribution. We scan a 6-line window before each
// Person hit and look for one of these property keys ending with `:` so we
// don't flag, say, a hypothetical PeopleAudience entry or a comment.
const ATTRIBUTION_KEYS = [
  "author",
  "reviewer",
  "reviewedBy",
  "contributor",
  "creator",
  "publisher",
  "editor",
];
const ATTRIBUTION_RE = new RegExp(
  `["']?(${ATTRIBUTION_KEYS.join("|")})["']?\\s*:`,
);

// Pass 2: visible-byline scan.
//
// Match `name: "Two Or Three Capitalised Words"` (with optional "&"/"and"
// joining two names like "Amit & Neha Desai"). Each word must be ≥3
// characters long (1 capital + 2+ lowercase) so we skip short connectors
// like "Us"/"Me"/"Of" that would otherwise produce false positives on
// breadcrumb labels such as "About Us". Single capitalised words (brands
// like "Kangaroo Kids") are left to the context check below.
const VISIBLE_NAME_RE =
  /\bname\s*:\s*["']([A-Z][a-z'’]{2,}(?:\s+(?:&|and))?\s+[A-Z][a-z'’]{2,}(?:\s+[A-Z][a-z'’]{2,})?)["']/g;

// Surrounding-context keywords that indicate the literal is being used as
// a visible byline / reviewer / testimonial author.
const BYLINE_CONTEXT_RE =
  /\b(testimonial|reviewer|review|quote|parent|byline|byLine|author|contributor|reviewedBy)\b/i;

// Strictly approved attribution values. Compared exactly against the
// captured `name` literal — anything else fails. Only the two
// organisation names plus the single sanctioned generic testimonial
// label are permitted.
const APPROVED_NAMES = new Set<string>([
  "Rainbow Preschool International",
  "Rainbow Preschool Curriculum Team",
  "A Rainbow Parent",
]);

function isApproved(name: string): boolean {
  return APPROVED_NAMES.has(name);
}

function scanFile(file: string): Hit[] {
  const rel = relative(ROOT, file).replace(/\\/g, "/");
  if (ALLOW_FILES.has(rel)) return [];
  const content = readFileSync(file, "utf-8");
  const lines = content.split(/\r?\n/);
  const hits: Hit[] = [];

  // --- Pass 1: schema Person nodes ---------------------------------------
  for (let i = 0; i < lines.length; i++) {
    if (!PERSON_RE.test(lines[i])) continue;
    const start = Math.max(0, i - 6);
    const window = lines.slice(start, i + 1).join("\n");
    if (!ATTRIBUTION_RE.test(window)) continue;
    hits.push({
      file: rel,
      line: i + 1,
      text: `[schema] ${lines[i].trim()}`,
    });
  }

  // --- Pass 2: visible-byline person-name literals -----------------------
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    VISIBLE_NAME_RE.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = VISIBLE_NAME_RE.exec(line)) !== null) {
      const value = m[1];
      if (isApproved(value)) continue;
      // Look at +/- 8 lines of context. If the surrounding code talks
      // about reviews / testimonials / parents / bylines, treat this as
      // a visible attribution literal that must be org-approved.
      const start = Math.max(0, i - 8);
      const end = Math.min(lines.length, i + 9);
      const window = lines.slice(start, end).join("\n");
      if (!BYLINE_CONTEXT_RE.test(window)) continue;
      hits.push({
        file: rel,
        line: i + 1,
        text: `[visible-byline] ${line.trim()}`,
      });
    }
  }

  return hits;
}

function main(): void {
  const files: string[] = [];
  for (const dir of INCLUDE_DIRS) {
    const full = join(ROOT, dir);
    try {
      const st = statSync(full);
      if (st.isDirectory()) walk(full, files);
    } catch {
      // skip missing dirs
    }
  }

  const allHits: Hit[] = [];
  for (const f of files) {
    allHits.push(...scanFile(f));
  }

  if (allHits.length === 0) {
    console.log(
      `[check-no-person-author] PASSED — scanned ${files.length} source file(s); no Person author/reviewer/contributor entries found.`,
    );
    process.exit(0);
  }

  console.error(
    `[check-no-person-author] FAILED — ${allHits.length} Person author/reviewer/contributor entr${allHits.length === 1 ? "y" : "ies"} found:`,
  );
  for (const h of allHits) {
    console.error(`  [FAIL] ${h.file}:${h.line}  ${h.text}`);
  }
  console.error(
    `\nEditorial rule: only "Rainbow Preschool International" / "Rainbow Preschool Curriculum Team"\n(or generic non-person labels like "A Rainbow Parent") may appear as a byline /\nreviewer / contributor / schema author. For schema, replace the Person node with\nan Organization node (see shared/blog-authors.ts → blogPersonToSchema). For\nvisible bylines, swap the individual name for an org-approved label.`,
  );
  process.exit(1);
}

main();
