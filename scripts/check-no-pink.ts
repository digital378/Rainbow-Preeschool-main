#!/usr/bin/env tsx
/**
 * No-pink brand-color guard.
 *
 * The Rainbow Preschool brand uses red/primary (#dc2626) as its single
 * warm-accent colour. Pink is explicitly off-brand and must never appear
 * in shipped UI. This static scan fails the deploy (and the pre-commit
 * hook) if any of the following sneak back into the codebase:
 *
 *   1. A Tailwind `pink-*` utility class — bg-, text-, border-, from-,
 *      via-, to-, ring-, fill-, stroke-, accent-, decoration-, divide-,
 *      outline-, placeholder-, shadow-, caret-, etc. — anywhere under
 *      client/src, server, shared, or scripts (any text file we ship).
 *   2. A Tailwind `pink-NNN` class spelled inline inside a string literal
 *      (e.g. `"text-pink-500"` in a JS map / lookup object).
 *   3. A pink hex literal from the Tailwind pink palette: #ec4899
 *      (pink-500), #fdf2f8, #fce7f3, #fbcfe8, #f9a8d4, #f472b6, #db2777,
 *      #be185d, #9f1239, #500724.
 *   4. Pink CSS named colours (`pink`, `lightpink`, `hotpink`, `deeppink`,
 *      `mediumvioletred`, `palevioletred`) when they appear as a CSS
 *      value (not as part of a longer identifier like `mypinkthing`).
 *
 * `client/index.html` is also scanned because the page-loader spinner
 * style block lives there and historically bled pink into the LCP frame.
 *
 * Exit 0 = clean. Exit 1 = regression — every offending file:line is
 * printed so the contributor can grep and fix.
 *
 * Run locally:   npx tsx scripts/check-no-pink.ts
 */
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = process.cwd();

// Source trees we ship to users. Anything under here is fair game.
const INCLUDE_DIRS = ["client/src", "server", "shared", "scripts"];

// Extensions we scan inside the include dirs.
const INCLUDE_EXT = [
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".css",
  ".scss",
  ".html",
  ".md",
];

// Single-file extras outside the include dirs that still ship to users.
const EXTRA_FILES = ["client/index.html"];

// Build artefacts and vendored deps must never be scanned.
const EXCLUDE_DIR_NAMES = new Set([
  "node_modules",
  "dist",
  "build",
  ".git",
  ".local",
  "coverage",
]);

// This file intentionally contains the literal pink hexes / class names
// it is meant to detect. Allow-list it so it doesn't flag itself.
const ALLOW_FILES = new Set(["scripts/check-no-pink.ts"]);

// Tailwind `pink-NNN` utilities. Matches `bg-pink-500`, `text-pink-700`,
// `from-pink-100`, `border-l-pink-400`, `dark:hover:bg-pink-900/30` and
// every other prefixed variant — we just look for the bare `pink-N` shape
// preceded by an alphanum-or-dash boundary so we don't flag e.g. `spinkly`.
const TAILWIND_PINK_RE = /(?<![A-Za-z0-9_])pink-[0-9]{2,3}\b/;

// Pink palette hex literals (case-insensitive, with or without leading #).
// Anchored on the # so we don't flag random 6-char identifiers.
const PINK_HEX_LIST = [
  "ec4899", // pink-500 — the historical offender
  "fdf2f8", // pink-50
  "fce7f3", // pink-100
  "fbcfe8", // pink-200
  "f9a8d4", // pink-300
  "f472b6", // pink-400
  "db2777", // pink-600
  "be185d", // pink-700
  "9f1239", // pink-800 (rose-800 also #9f1239, but pink-coded)
  "500724", // pink-900-ish
];
const PINK_HEX_RE = new RegExp(
  `#(?:${PINK_HEX_LIST.join("|")})\\b`,
  "i",
);

// CSS named pink colours used as standalone values. Require a non-word
// char on each side so we don't flag identifiers like `mypink` or
// `palevioletred_thing`.
const PINK_NAMED_RE =
  /(?<![A-Za-z0-9_-])(?:pink|lightpink|hotpink|deeppink|mediumvioletred|palevioletred)(?![A-Za-z0-9_-])/i;

interface Hit {
  file: string;
  line: number;
  text: string;
  reason: string;
}

function walk(dir: string, out: string[]): void {
  if (!existsSync(dir)) return;
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

function scanFile(file: string): Hit[] {
  const rel = relative(ROOT, file);
  if (ALLOW_FILES.has(rel)) return [];

  const hits: Hit[] = [];
  const src = readFileSync(file, "utf8");
  const lines = src.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Skip lines that are purely a JS/TS line-comment or a CSS comment
    // start, so we don't fail on planning notes that mention "pink".
    // We DO scan comments inside JSX/TS source for hex literals though,
    // because past regressions sneaked in via inline-styled comments
    // that got copy-pasted into props.
    const trimmed = line.trim();
    const isLineComment =
      trimmed.startsWith("//") ||
      trimmed.startsWith("#") ||
      trimmed.startsWith("<!--");

    if (TAILWIND_PINK_RE.test(line)) {
      hits.push({
        file: rel,
        line: i + 1,
        text: line.trim(),
        reason: "Tailwind pink-* utility class",
      });
      continue;
    }
    if (PINK_HEX_RE.test(line)) {
      hits.push({
        file: rel,
        line: i + 1,
        text: line.trim(),
        reason: "Pink palette hex literal",
      });
      continue;
    }
    if (!isLineComment && PINK_NAMED_RE.test(line)) {
      // Only flag CSS named pink in obvious value positions:
      //   1. a CSS rule value:  `: pink;`, `: pink ;`, `: pink}`, `: pink !important`
      //   2. a JS/TS/CSS string literal:  `"pink"`, `'pink'`, `` `pink` ``
      //   3. (CSS files only) inside a CSS colour function:
      //      `linear-gradient(..., pink, ...)`, `rgb(pink)`,
      //      `color-mix(in srgb, pink 50%, white)`, etc.
      //      Restricted to `.css`/`.scss` because in JS/TS/MD/HTML the
      //      pattern `(pink)` appears in English prose ("beetroot (pink)")
      //      and must not be flagged. CSS-function args inside a JS
      //      template-literal still get caught via rule 1 (the colon)
      //      or rule 2 (the surrounding string literal).
      const PINK_TOK =
        "pink|lightpink|hotpink|deeppink|mediumvioletred|palevioletred";
      const isCssFile = /\.(css|scss)$/i.test(file);
      const looksLikeValue =
        new RegExp(`:\\s*(?:${PINK_TOK})\\s*(?:[;}!]|$)`, "i").test(line) ||
        new RegExp(`["'\`](?:${PINK_TOK})["'\`]`, "i").test(line) ||
        (isCssFile &&
          new RegExp(
            `[(,]\\s*(?:${PINK_TOK})\\s*(?:[,)\\s]|\\d+%?)`,
            "i",
          ).test(line));
      if (looksLikeValue) {
        hits.push({
          file: rel,
          line: i + 1,
          text: line.trim(),
          reason: "CSS named pink colour value",
        });
      }
    }
  }
  return hits;
}

function main(): void {
  const files: string[] = [];
  for (const dir of INCLUDE_DIRS) {
    walk(join(ROOT, dir), files);
  }
  for (const extra of EXTRA_FILES) {
    const full = join(ROOT, extra);
    if (existsSync(full)) files.push(full);
  }

  const allHits: Hit[] = [];
  for (const f of files) {
    allHits.push(...scanFile(f));
  }

  if (allHits.length === 0) {
    console.log(
      `[check-no-pink] PASSED — scanned ${files.length} file(s); no pink utility classes, hex literals, or CSS named colours found.`,
    );
    process.exit(0);
  }

  console.error(
    `[check-no-pink] FAILED — ${allHits.length} pink colour usage${allHits.length === 1 ? "" : "s"} found:`,
  );
  for (const h of allHits) {
    console.error(`  ${h.file}:${h.line}  [${h.reason}]  ${h.text}`);
  }
  console.error("");
  console.error(
    "[check-no-pink] The Rainbow Preschool brand uses red/primary (#dc2626) only — pink is off-brand.",
  );
  console.error(
    "[check-no-pink] Replace each pink token with its red equivalent (or another non-pink palette colour where red is already in use).",
  );
  process.exit(1);
}

main();
