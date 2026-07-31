import express, { type Express, type Request, type Response } from "express";
import fs from "fs";
import path from "path";
import { injectHomepageFreshness } from "./homepage-freshness";
import { getPageSEO, getStaticPagePaths } from "./ssr-pages";

const BASE_URL = "https://www.rainbowpreschools.com";

/**
 * Inject structured-data JSON-LD scripts for any URL that has an entry in
 * staticPages.  This mirrors what bot-ssr.ts does for crawlers, but runs for
 * ALL visitors so that:
 *   1. `curl <url>` (no bot UA) sees the same schemas as Googlebot.
 *   2. Pre-render / ISR services that don't spoof a bot UA still pick up
 *      the schemas.
 *   3. Social-preview crawlers (WhatsApp, Slack, etc.) that are absent from
 *      BOT_USER_AGENTS get correct Open Graph + schema data.
 *
 * Only the `structuredData` array and the `breadcrumbs` list are injected —
 * no page content — so the React app hydrates normally.
 */
function injectPageSchemas(urlPath: string, html: string): string {
  const seo = getPageSEO(urlPath);
  if (!seo) return html;

  const scripts: string[] = [];

  if (seo.structuredData && seo.structuredData.length > 0) {
    for (const schema of seo.structuredData) {
      scripts.push(
        `<script type="application/ld+json">${JSON.stringify(schema)}</script>`,
      );
    }
  }

  // BreadcrumbList — mirrors the auto-injection in bot-ssr.ts renderSSRHtml()
  if (seo.breadcrumbs && seo.breadcrumbs.length > 0) {
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: seo.breadcrumbs.map((b, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: b.name,
        item: `${BASE_URL}${b.url}`,
      })),
    };
    scripts.push(
      `<script type="application/ld+json">${JSON.stringify(breadcrumbSchema)}</script>`,
    );
  }

  if (scripts.length === 0 || !html.includes("</head>")) return html;
  // Use a replacer function so '$' characters in schema JSON are never
  // interpreted as special replacement patterns by String.prototype.replace.
  const injection = `    ${scripts.join("\n    ")}\n</head>`;
  return html.replace("</head>", () => injection);
}

/**
 * Rewrites the Vite-generated main stylesheet link from render-blocking to
 * async so the browser can paint immediately while CSS loads in the background.
 *
 * Before:
 *   <link rel="stylesheet" crossorigin href="/assets/index-HASH.css">
 *
 * After:
 *   <link rel="stylesheet" crossorigin href="/assets/index-HASH.css"
 *         media="print" onload="this.media='all'">
 *   <noscript><link rel="stylesheet" crossorigin href="/assets/index-HASH.css"></noscript>
 *
 * The browser's preload scanner still discovers and fetches the CSS early;
 * the media="print" attribute just prevents it from blocking the first paint.
 * A <noscript> fallback ensures styles load normally when JS is disabled.
 *
 * If no matching link is found the HTML is returned unchanged (safe no-op).
 */
function makeAsyncCSS(html: string): string {
  // Match the Vite main stylesheet link. The filename hash changes every build
  // so we match by pattern (/assets/*.css). Replacer function avoids '$' in
  // href being misinterpreted as a String.replace back-reference.
  // Match the exact format Vite emits: attribute order is stable across builds;
  // only the hash in the filename changes. No \b word-boundary assertions —
  // \b fails after the closing " because both adjacent characters are non-word.
  return html.replace(
    /<link rel="stylesheet" crossorigin href="(\/assets\/[^"]+\.css)">/,
    (_match, href) =>
      `<link rel="stylesheet" crossorigin href="${href}" media="print" onload="this.media='all'">\n    <noscript><link rel="stylesheet" crossorigin href="${href}"></noscript>`,
  );
}

// ---------------------------------------------------------------------------
// Module-level caches — populated on the first request after server start.
//
// baseIndexHtml: the raw dist/public/index.html with makeAsyncCSS already
//   applied.  Eliminates the fs.readFileSync + regex rewrite on every hit.
//
// pageCache: maps URL path → fully-processed SPA shell (base HTML +
//   injectPageSchemas output).  Each unique path is computed once; all
//   subsequent hits are served directly from memory.
//   The homepage is excluded because injectHomepageFreshness adds content
//   that changes over time and must not be frozen.
// ---------------------------------------------------------------------------
let baseIndexHtml: string | null = null;
const pageCache = new Map<string, string>();

function getBaseHtml(indexPath: string): string {
  if (!baseIndexHtml) {
    baseIndexHtml = makeAsyncCSS(fs.readFileSync(indexPath, "utf-8"));
  }
  return baseIndexHtml;
}

/**
 * Pre-warm the page cache for every known static page so the very first
 * visitor (or Googlebot's first crawl) after a deploy is also served from
 * cache.  The homepage "/" is intentionally skipped because
 * injectHomepageFreshness adds dynamic content that must not be frozen.
 */
function prewarmPageCache(indexPath: string): void {
  const baseHtml = getBaseHtml(indexPath);
  const paths = getStaticPagePaths().filter((p) => p !== "/");
  for (const urlPath of paths) {
    if (!pageCache.has(urlPath)) {
      pageCache.set(urlPath, injectPageSchemas(urlPath, baseHtml));
    }
  }
  console.log(`[static] page cache pre-warmed for ${paths.length} paths`);
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  const indexPath = path.resolve(distPath, "index.html");

  // Pre-warm the page cache so the first request to every known URL is fast.
  prewarmPageCache(indexPath);

  // Homepage: inject freshness signals into the SPA shell before serving.
  // MUST be registered before express.static so it wins over the static
  // middleware's automatic index.html serving for "/".
  // NOT cached — injectHomepageFreshness adds dynamic content.
  app.get("/", (_req, res) => {
    let html = getBaseHtml(indexPath);
    html = injectHomepageFreshness("/", html);
    res.removeHeader("Set-Cookie");
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.send(html);
  });

  app.use(express.static(distPath, {
    // Disable automatic index.html serving for directory requests so the
    // explicit app.get("/") handler above always handles "/" in production.
    index: false,
    setHeaders(res, filePath) {
      const ext = path.extname(filePath).toLowerCase();
      if ([".js", ".css", ".woff", ".woff2", ".ttf", ".otf", ".webp", ".png", ".jpg", ".jpeg", ".gif", ".svg", ".ico", ".avif"].includes(ext)) {
        res.removeHeader("Set-Cookie");
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        // Cloudflare's dashboard "Browser Cache TTL" was rewriting our public
        // header to "private" on asset responses, causing CF-Cache-Status: MISS
        // on every JS/CSS request and forcing visitors to fetch from US origin.
        // CDN-Cache-Control is honoured by Cloudflare independently of (and
        // takes precedence over) any Cache-Control rewrite, so we explicitly
        // tell the edge to cache fingerprinted assets for a year.
        res.setHeader("CDN-Cache-Control", "public, max-age=31536000, immutable");
        res.setHeader("Cloudflare-CDN-Cache-Control", "public, max-age=31536000, immutable");
      } else if (ext === ".html") {
        // SPA shell: drop any session cookies (e.g. GAESA) so CF cannot flip
        // public→private and so the edge keeps a cacheable copy.
        res.removeHeader("Set-Cookie");
        res.setHeader("Cache-Control", "no-store");
      }
    },
  }));

  // Fall through to index.html for SPA routing.
  // For known pages (those in staticPages / getPageSEO), inject their
  // structured-data JSON-LD into the shell so Google, curl, and social
  // preview crawlers see the schemas in raw HTML — no JS execution required.
  // NOTE: do NOT pass a path argument to app.use here.
  // Express strips the matched path from req.url inside the handler, so
  // app.use("*", fn) would always see req.path === "/" for every route.
  // Without a path arg, req.originalUrl always contains the real URL.
  app.use((req: Request, res: Response) => {
    res.removeHeader("Set-Cookie");
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    // Use originalUrl (strip query string) to get the real page path.
    const urlPath = req.originalUrl.split("?")[0];
    const cached = pageCache.get(urlPath);
    if (cached) {
      return res.send(cached);
    }
    // First request for this URL: compute and cache.
    const html = injectPageSchemas(urlPath, getBaseHtml(indexPath));
    pageCache.set(urlPath, html);
    res.send(html);
  });
}
