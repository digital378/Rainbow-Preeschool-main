import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath, {
    setHeaders(res, filePath) {
      const ext = path.extname(filePath).toLowerCase();
      if ([".js", ".css", ".woff", ".woff2", ".ttf", ".otf", ".webp", ".png", ".jpg", ".jpeg", ".gif", ".svg", ".ico", ".avif"].includes(ext)) {
        res.removeHeader("Set-Cookie");
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      } else if (ext === ".html") {
        // SPA shell: drop any session cookies (e.g. GAESA) so CF cannot flip
        // public→private and so the edge keeps a cacheable copy.
        res.removeHeader("Set-Cookie");
        // CF-specific directives override "Cache Everything" Page Rules; we
        // explicitly want CF to honour the same s-maxage as standards-compliant
        // CDNs. Browsers still revalidate via max-age=0.
        res.setHeader("Cache-Control", "public, max-age=0, s-maxage=300, stale-while-revalidate=86400");
        res.setHeader("CDN-Cache-Control", "public, max-age=300, stale-while-revalidate=86400");
        res.setHeader("Cloudflare-CDN-Cache-Control", "public, max-age=300, stale-while-revalidate=86400");
      }
    },
  }));

  // fall through to index.html for SPA routing
  app.use("*", (_req, res) => {
    res.removeHeader("Set-Cookie");
    res.setHeader("Cache-Control", "public, max-age=0, s-maxage=300, stale-while-revalidate=86400");
    res.setHeader("CDN-Cache-Control", "public, max-age=300, stale-while-revalidate=86400");
    res.setHeader("Cloudflare-CDN-Cache-Control", "public, max-age=300, stale-while-revalidate=86400");
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
