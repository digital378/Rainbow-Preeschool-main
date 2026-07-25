import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { injectHomepageFreshness } from "./homepage-freshness";

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

  // fall through to index.html for SPA routing
  app.use("*", (_req, res) => {
    res.removeHeader("Set-Cookie");
    res.setHeader("Cache-Control", "no-store");
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
