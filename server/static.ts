import express, { type Express, type Request, type Response } from "express";
import fs from "fs";
import path from "path";
import { injectHomepageFreshness } from "./homepage-freshness";
import { getPageSEO } from "./ssr-pages";

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
  return html.replace("</head>", `    ${scripts.join("\n    ")}\n</head>`);
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  // Homepage: inject freshness signals into the SPA shell before serving.
  // MUST be registered before express.static so it wins over the static
  // middleware's automatic index.html serving for "/".
  app.get("/", (_req, res) => {
    const indexPath = path.resolve(distPath, "index.html");
    let html = fs.readFileSync(indexPath, "utf-8");
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
  app.use("*", (req: Request, res: Response) => {
    res.removeHeader("Set-Cookie");
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    const indexPath = path.resolve(distPath, "index.html");
    let html = fs.readFileSync(indexPath, "utf-8");
    html = injectPageSchemas(req.path, html);
    res.send(html);
  });
}
