#!/usr/bin/env tsx
/**
 * Shell ↔ React SEO sync guard.
 *
 * The homepage has two sources of truth for its title, description, og:title,
 * og:description, twitter:title, and twitter:description:
 *
 *   1. `client/index.html` — read by social scrapers and crawlers before JS
 *      runs (static shell).
 *   2. `client/src/pages/home.tsx` — the <SEO> component props set after React
 *      hydration.
 *
 * If a developer updates the React SEO props but forgets to mirror the change
 * in index.html (or vice versa), social cards and pre-hydration scrapers show
 * stale data. This script detects that drift and fails the commit/push.
 *
 * Normalisation rule: HTML entities in index.html (`&amp;`, `&lt;`, `&gt;`,
 * `&#39;`, `&quot;`) are decoded before comparison, so `&amp;` == `&`.
 *
 * Coverage: homepage (/) only. Other pages use Bot SSR and do not have this
 * dual-source problem.
 *
 * Run locally:   npx tsx scripts/check-shell-seo-sync.ts
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = process.cwd();

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function readFile(rel: string): string {
  return readFileSync(resolve(ROOT, rel), "utf8");
}

/** Decode the five named HTML entities that commonly appear in meta tags. */
function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

// ---------------------------------------------------------------------------
// Parse client/index.html
// ---------------------------------------------------------------------------

interface ShellValues {
  title: string | null;
  description: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  twitterTitle: string | null;
  twitterDescription: string | null;
}

function parseShell(): ShellValues {
  const html = readFile("client/index.html");

  function extractAttr(pattern: RegExp): string | null {
    const m = html.match(pattern);
    return m ? decodeEntities(m[1]) : null;
  }

  const title = (() => {
    const m = html.match(/<title>([^<]*)<\/title>/);
    return m ? decodeEntities(m[1]) : null;
  })();

  const description = extractAttr(
    /<meta\s+name="description"\s+content="([^"]*)"/
  );

  const ogTitle = extractAttr(
    /<meta\s+property="og:title"\s+content="([^"]*)"/
  );

  const ogDescription = extractAttr(
    /<meta\s+property="og:description"\s+content="([^"]*)"/
  );

  const twitterTitle = extractAttr(
    /<meta\s+name="twitter:title"\s+content="([^"]*)"/
  );

  const twitterDescription = extractAttr(
    /<meta\s+name="twitter:description"\s+content="([^"]*)"/
  );

  return { title, description, ogTitle, ogDescription, twitterTitle, twitterDescription };
}

// ---------------------------------------------------------------------------
// Parse client/src/pages/home.tsx  (SEO component props)
// ---------------------------------------------------------------------------

interface ReactValues {
  title: string | null;
  description: string | null;
}

function parseReact(): ReactValues {
  const src = readFile("client/src/pages/home.tsx");

  // Find the <SEO ... /> block.  The component spans several lines so we need
  // to locate the opening tag and read until the self-closing />.
  const seoBlockMatch = src.match(/<SEO\s([\s\S]*?)\/>/);
  if (!seoBlockMatch) {
    return { title: null, description: null };
  }

  const block = seoBlockMatch[1];

  function extractProp(name: string): string | null {
    // Matches  propName="value with any chars except unescaped quote"
    const re = new RegExp(`${name}="([^"]*)"`, "s");
    const m = block.match(re);
    return m ? m[1] : null;
  }

  return {
    title: extractProp("title"),
    description: extractProp("description"),
  };
}

// ---------------------------------------------------------------------------
// Compare and report
// ---------------------------------------------------------------------------

const shell = parseShell();
const react = parseReact();

const errors: string[] = [];

function check(
  field: string,
  shellValue: string | null,
  reactValue: string | null
): void {
  if (reactValue === null) {
    errors.push(`  ✗ ${field}: could not extract React SEO prop — is the prop missing?`);
    return;
  }
  if (shellValue === null) {
    errors.push(`  ✗ ${field}: could not extract from client/index.html — is the tag missing?`);
    return;
  }
  if (shellValue !== reactValue) {
    errors.push(
      `  ✗ ${field} mismatch:\n` +
      `      index.html : "${shellValue}"\n` +
      `      home.tsx   : "${reactValue}"`
    );
  }
}

// The SEO component applies `title` → og:title, og:title, twitter:title and
// `description` → meta description, og:description, twitter:description.
check("<title>",             shell.title,             react.title);
check("meta[description]",   shell.description,       react.description);
check("og:title",            shell.ogTitle,           react.title);
check("og:description",      shell.ogDescription,     react.description);
check("twitter:title",       shell.twitterTitle,      react.title);
check("twitter:description", shell.twitterDescription, react.description);

if (errors.length > 0) {
  console.error(
    "\n[check-shell-seo-sync] FAIL — index.html shell tags are out of sync with home.tsx <SEO>:\n"
  );
  for (const e of errors) {
    console.error(e);
  }
  console.error(
    "\n  Update both client/index.html AND client/src/pages/home.tsx together,\n" +
    "  or bypass once with --no-verify if you are mid-refactor.\n"
  );
  process.exit(1);
} else {
  console.log("[check-shell-seo-sync] OK — shell tags match React SEO props.");
  process.exit(0);
}
