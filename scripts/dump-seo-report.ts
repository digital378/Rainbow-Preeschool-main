#!/usr/bin/env tsx
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = process.cwd();
const BASE = "https://www.rainbowpreschools.com";

interface Row {
  url: string;
  title: string;
  titleLen: number;
  description: string;
  descLen: number;
  h1: string;
  canonical: string;
  inSitemap: boolean;
  source: string;
}

const sitemapUrls = new Set(
  readFileSync("/tmp/sitemap_urls.txt", "utf8")
    .split("\n")
    .map((l) => l.trim().replace(BASE, ""))
    .filter(Boolean)
    .map((p) => (p === "/" ? "/" : p.replace(/\/$/, ""))),
);

function parseObjectMaps(file: string, mapMatchers: RegExp[]): Map<string, Record<string, string>> {
  const text = readFileSync(resolve(ROOT, file), "utf8");
  const out = new Map<string, Record<string, string>>();
  for (const start of mapMatchers) {
    const m = text.match(start);
    if (!m) continue;
    let i = m.index! + m[0].length;
    let depth = 1;
    const block: string[] = [];
    for (; i < text.length && depth > 0; i++) {
      const ch = text[i];
      if (ch === "{") depth++;
      else if (ch === "}") depth--;
      if (depth > 0) block.push(ch);
    }
    const body = block.join("");
    const entryRe = /(?:^|\n)\s*"([^"]+)":\s*\{/g;
    let em: RegExpExecArray | null;
    while ((em = entryRe.exec(body))) {
      const key = em[1];
      let j = em.index + em[0].length;
      let d = 1;
      const buf: string[] = [];
      for (; j < body.length && d > 0; j++) {
        const c = body[j];
        if (c === "{") d++;
        else if (c === "}") d--;
        if (d > 0) buf.push(c);
      }
      const entry = buf.join("");
      const fields: Record<string, string> = {};
      for (const f of ["title", "description", "h1", "canonical"]) {
        const fm = entry.match(new RegExp(`${f}:\\s*(?:\`([^\`]+)\`|"((?:[^"\\\\]|\\\\.)*)")`));
        if (fm) fields[f] = (fm[1] || fm[2] || "").replace(/\\"/g, '"');
      }
      out.set(key, fields);
    }
  }
  return out;
}

const rows: Row[] = [];

const ssrStatic = parseObjectMaps("server/ssr-pages.ts", [
  /const staticPages: Record<string, PageSEOData> = \{/,
]);
for (const [url, f] of ssrStatic) {
  const norm = url === "/" ? "/" : url.replace(/\/$/, "");
  rows.push({
    url,
    title: f.title || "",
    titleLen: (f.title || "").length,
    description: f.description || "",
    descLen: (f.description || "").length,
    h1: f.h1 || "",
    canonical: (f.canonical || "").replace("${BASE_URL}", BASE),
    inSitemap: sitemapUrls.has(norm),
    source: "ssr-pages.ts (staticPages)",
  });
}

const ssrBlog = parseObjectMaps("server/ssr-pages.ts", [
  /const BLOG_POST_SEO_DATA[: =][^\{]*\{/,
]);
for (const [slug, f] of ssrBlog) {
  const url = `/blog/${slug}`;
  rows.push({
    url,
    title: f.title || "",
    titleLen: (f.title || "").length,
    description: f.description || "",
    descLen: (f.description || "").length,
    h1: f.h1 || "",
    canonical: `${BASE}${url}`,
    inSitemap: sitemapUrls.has(url),
    source: "ssr-pages.ts (BLOG_POST_SEO_DATA)",
  });
}

// Centre / locality data
const centreText = readFileSync(resolve(ROOT, "shared/centre-data.ts"), "utf8");
const centreEntryRe =
  /title:\s*"((?:[^"\\]|\\.)*)"[\s\S]{0,400}?description:\s*"((?:[^"\\]|\\.)*)"[\s\S]{0,400}?h1:\s*"((?:[^"\\]|\\.)*)"[\s\S]{0,200}?canonicalPath:\s*"([^"]+)"/g;
let cm: RegExpExecArray | null;
while ((cm = centreEntryRe.exec(centreText))) {
  const url = cm[4];
  rows.push({
    url,
    title: cm[1],
    titleLen: cm[1].length,
    description: cm[2],
    descLen: cm[2].length,
    h1: cm[3],
    canonical: `${BASE}${url}`,
    inSitemap: sitemapUrls.has(url.replace(/\/$/, "")),
    source: "centre-data.ts",
  });
}

// Playgroup landing data
const pgText = readFileSync(resolve(ROOT, "shared/playgroup-landing-data.ts"), "utf8");
const pgRe =
  /url:\s*"([^"]+)"[\s\S]{0,800}?title:\s*"((?:[^"\\]|\\.)*)"[\s\S]{0,800}?description:\s*"((?:[^"\\]|\\.)*)"/g;
let pm: RegExpExecArray | null;
while ((pm = pgRe.exec(pgText))) {
  const url = pm[1];
  if (rows.find((r) => r.url === url)) continue;
  rows.push({
    url,
    title: pm[2],
    titleLen: pm[2].length,
    description: pm[3],
    descLen: pm[3].length,
    h1: "",
    canonical: `${BASE}${url}`,
    inSitemap: sitemapUrls.has(url.replace(/\/$/, "")),
    source: "playgroup-landing-data.ts",
  });
}

// Sort: site pages first, locality next, blog last; alphabetical within group
function group(r: Row): number {
  if (r.url === "/" || ["/about","/programmes","/gallery","/contact","/blog","/faqs","/testimonials","/preschool-readiness-quiz","/top-preschools-in-thane","/terms","/privacy"].includes(r.url)) return 0;
  if (["/playgroup","/nursery","/kindergarten","/happy-times","/best-preschool-near-me-in-thane","/play-school-near-me","/preschool-admissions"].includes(r.url)) return 1;
  if (r.url.startsWith("/preschool-in-") || r.url.startsWith("/playgroup-in-") || r.url.startsWith("/playgroup-near-")) return 2;
  if (r.url.startsWith("/blog/")) return 4;
  return 3;
}
rows.sort((a, b) => group(a) - group(b) || a.url.localeCompare(b.url));

// Build markdown
const lines: string[] = [];
lines.push(`# Rainbow Preschool — Full SEO Report`);
lines.push("");
lines.push(`Generated: ${new Date().toISOString().split("T")[0]}`);
lines.push(`Base URL: ${BASE}`);
lines.push(`Total pages with SEO metadata: **${rows.length}**`);
lines.push(`Total URLs in XML sitemap: **${sitemapUrls.size}**`);
lines.push("");
lines.push(`Title length limit enforced: **65 chars** (guarded by \`scripts/check-no-title-cannibalisation.ts\` on every commit, push, and predeploy).`);
lines.push("");
lines.push(`Description length recommendation: **150–160 chars** (Google SERP truncation).`);
lines.push("");

const groups: Record<number, string> = {
  0: "## 1. Main Site Pages",
  1: "## 2. Programme & High-Intent SEO Landing Pages",
  2: "## 3. Locality / Hyperlocal Landing Pages",
  3: "## 4. Legacy Content Pages (in sitemap)",
  4: "## 5. Blog Posts",
};

let lastG = -1;
for (const r of rows) {
  const g = group(r);
  if (g !== lastG) {
    lines.push("");
    lines.push(groups[g]);
    lines.push("");
    lines.push("| URL | In Sitemap | Title | Title Len | Description | Desc Len | H1 |");
    lines.push("|---|---|---|---|---|---|---|");
    lastG = g;
  }
  const titleFlag = r.titleLen > 65 ? ` ⚠️` : "";
  const descFlag = r.descLen > 160 ? ` ⚠️` : r.descLen < 100 && r.descLen > 0 ? ` ⓘ` : "";
  const sm = r.inSitemap ? "✅" : "❌";
  const esc = (s: string) => s.replace(/\|/g, "\\|").replace(/\n/g, " ");
  lines.push(
    `| \`${r.url}\` | ${sm} | ${esc(r.title)} | ${r.titleLen}${titleFlag} | ${esc(r.description)} | ${r.descLen}${descFlag} | ${esc(r.h1)} |`,
  );
}

// Sitemap-only URLs (in sitemap but not in any of the SEO data sources)
const knownUrls = new Set(rows.map((r) => (r.url === "/" ? "/" : r.url.replace(/\/$/, ""))));
const orphans = [...sitemapUrls].filter((u) => !knownUrls.has(u));
lines.push("");
lines.push("## 6. Sitemap URLs without dedicated SSR SEO data");
lines.push("");
lines.push("These URLs ship in `sitemap.xml` but do not have a row in `staticPages`, `BLOG_POST_SEO_DATA`, `centre-data.ts`, or `playgroup-landing-data.ts`. They are typically rendered by the legacy-pages handler or have inline page titles.");
lines.push("");
lines.push("| URL |");
lines.push("|---|");
for (const u of orphans.sort()) lines.push(`| \`${u}\` |`);

lines.push("");
lines.push("## 7. SEO Infrastructure");
lines.push("");
lines.push("- **robots.txt**: `client/public/robots.txt` — allows all crawlers; disallows /ad*, /ris*, /flyer, /gsc, /api/, WordPress legacy paths, UTM-tracked URLs.");
lines.push("- **sitemap.xml**: generated dynamically by the server; contains the URLs listed above.");
lines.push("- **llms.txt**: `client/public/llms.txt` — concise AI-search summary with canonical-page-owners table.");
lines.push("- **llms-full.txt**: extended full-content variant for AI crawlers.");
lines.push("- **Bot SSR**: pre-rendered HTML with full meta tags, JSON-LD (`EducationalOrganization`, `LocalBusiness`, `WebSite`, `FAQPage`, `Article`, `BreadcrumbList`), and semantic content served to 20+ bot user-agents.");
lines.push("- **Title guard** (`scripts/check-no-title-cannibalisation.ts`): enforces (1) banned soft-marketing words, (2) ≤65 char limit, (3) keyword ownership, (4) SSR↔client title parity. Runs on pre-commit, pre-push, and predeploy.");
lines.push("- **Soft-word body guard** (`scripts/check-soft-marketing-words.ts`): warn-only sweep across body copy.");
lines.push("- **Brand colour guard** (`scripts/check-no-pink.ts`): blocks pink in CSS/inline styles.");

writeFileSync("seo-report.md", lines.join("\n"));
console.log(`Wrote seo-report.md (${rows.length} pages, ${sitemapUrls.size} sitemap URLs, ${orphans.length} orphans)`);
