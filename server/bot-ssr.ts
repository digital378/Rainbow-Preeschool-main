import type { Request, Response, NextFunction, Express } from "express";
import fs from "fs";
import path from "path";
import { getPageSEO, type PageSEOData } from "./ssr-pages";

const BOT_USER_AGENTS = [
  "googlebot",
  "bingbot",
  "yandex",
  "baiduspider",
  "duckduckbot",
  "slurp",
  "facebookexternalhit",
  "facebot",
  "twitterbot",
  "linkedinbot",
  "whatsapp",
  "telegrambot",
  "applebot",
  "pinterest",
  "semrushbot",
  "ahrefsbot",
  "mj12bot",
  "rogerbot",
  "dotbot",
  "petalbot",
  "bytespider",
  "chatgpt-user",
  "gptbot",
  "oai-searchbot",
  "perplexitybot",
  "claudebot",
  "anthropic-ai",
  "cohere-ai",
  "meta-externalagent",
  "amazonbot",
  "duckassist",
  "youbot",
];

function isBot(userAgent: string): boolean {
  const ua = userAgent.toLowerCase();
  return BOT_USER_AGENTS.some((bot) => ua.includes(bot));
}

const BASE_URL = "https://www.rainbowpreschools.com";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderSSRHtml(seo: PageSEOData, requestUrl: string): string {
  const fullUrl = `${BASE_URL}${requestUrl}`;
  const canonical = seo.canonical || fullUrl;
  const ogImage = seo.ogImage || `${BASE_URL}/og-image.jpg`;
  const robots = seo.noIndex ? "noindex, nofollow" : "index, follow";

  const allStructuredData = [...(seo.structuredData || [])];

  if (seo.breadcrumbs && seo.breadcrumbs.length > 0) {
    allStructuredData.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": seo.breadcrumbs.map((b, i) => ({
        "@type": "ListItem",
        "position": i + 1,
        "name": b.name,
        "item": `${BASE_URL}${b.url}`
      }))
    });
  }

  const structuredDataScripts = allStructuredData
    .map((data) => `<script type="application/ld+json">${JSON.stringify(data)}</script>`)
    .join("\n    ");

  const contentHtml = (seo.contentSections || [])
    .map((section) => {
      let html = `<section>`;
      if (section.heading) {
        html += `<h2>${escapeHtml(section.heading)}</h2>\n`;
      }
      if (section.text) {
        html += `<p>${escapeHtml(section.text)}</p>\n`;
      }
      if (section.items) {
        html += "<ul>\n";
        section.items.forEach((item) => {
          html += `<li>${escapeHtml(item)}</li>\n`;
        });
        html += "</ul>\n";
      }
      html += `</section>`;
      return html;
    })
    .join("\n");

  const internalLinksHtml = (seo.internalLinks || [])
    .map((link) => `<li><a href="${BASE_URL}${link.url}">${escapeHtml(link.text)}</a></li>`)
    .join("\n          ");

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5" />
    <title>${escapeHtml(seo.title)}</title>
    <meta name="description" content="${escapeHtml(seo.description)}" />
    ${seo.keywords ? `<meta name="keywords" content="${escapeHtml(seo.keywords)}" />` : ""}
    <meta name="author" content="Rainbow Preschool International" />
    <meta name="robots" content="${robots}" />
    <link rel="canonical" href="${canonical}" />

    <meta property="og:type" content="${seo.ogType || "website"}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:title" content="${escapeHtml(seo.title)}" />
    <meta property="og:description" content="${escapeHtml(seo.description)}" />
    <meta property="og:image" content="${ogImage}" />
    <meta property="og:site_name" content="Rainbow Preschool International" />
    <meta property="og:locale" content="en_IN" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(seo.title)}" />
    <meta name="twitter:description" content="${escapeHtml(seo.description)}" />
    <meta name="twitter:image" content="${ogImage}" />

    <link rel="icon" type="image/png" href="/favicon.png?v=2" />
    <link rel="apple-touch-icon" href="/favicon.png?v=2" />

    ${structuredDataScripts}

    <style>
      body{margin:0;font-family:Inter,-apple-system,BlinkMacSystemFont,sans-serif;color:#1a1a2e;line-height:1.6}
      header{background:#dc2626;color:#fff;padding:16px 24px}
      header a{color:#fff;text-decoration:none;margin-right:16px}
      main{max-width:960px;margin:0 auto;padding:24px 16px}
      h1{font-family:Poppins,sans-serif;font-size:2rem;margin-bottom:16px}
      h2{font-family:Poppins,sans-serif;font-size:1.5rem;margin-top:32px}
      footer{background:#f5f5f5;padding:24px 16px;text-align:center;margin-top:48px;border-top:1px solid #ddd}
      footer a{color:#dc2626;margin:0 8px}
      a{color:#dc2626}
      ul{padding-left:20px}
      li{margin-bottom:8px}
      .nav{display:flex;gap:16px;flex-wrap:wrap}
      .breadcrumb{font-size:0.875rem;color:#666;margin-bottom:16px}
      .breadcrumb a{color:#dc2626}
      .cta{background:#dc2626;color:#fff;padding:12px 24px;text-decoration:none;display:inline-block;border-radius:6px;margin-top:16px}
      .network{margin-top:24px;padding-top:16px;border-top:1px solid #ddd}
      .network a{color:#1d4ed8}
    </style>
  </head>
  <body>
    <header>
      <nav class="nav" aria-label="Main navigation">
        <a href="${BASE_URL}/">Home</a>
        <a href="${BASE_URL}/about">About Us</a>
        <a href="${BASE_URL}/programmes">Programmes</a>
        <a href="${BASE_URL}/gallery">Gallery</a>
        <a href="${BASE_URL}/blog">Blogs</a>
        <a href="${BASE_URL}/contact">Contact</a>
      </nav>
    </header>
    <main>
      ${seo.breadcrumbs ? `<div class="breadcrumb">${seo.breadcrumbs.map((b) => `<a href="${BASE_URL}${b.url}">${escapeHtml(b.name)}</a>`).join(" › ")}</div>` : ""}
      <h1>${escapeHtml(seo.h1 || seo.title)}</h1>
      ${seo.introText ? `<p>${escapeHtml(seo.introText)}</p>` : ""}
      ${contentHtml}
      ${internalLinksHtml ? `<nav aria-label="Related pages"><h2>Explore More</h2><ul>${internalLinksHtml}</ul></nav>` : ""}
      <a href="${BASE_URL}/contact" class="cta">Enquire Now — Call 82915 68972</a>
      <div class="network">
        <p><strong>Our Network:</strong> <a href="https://rainbowinternationalschool.in" rel="noopener">Rainbow International School</a> — CBSE-affiliated K–12 school in Thane West, Nursery to Class 12</p>
      </div>
    </main>
    <footer>
      <p>&copy; ${new Date().getFullYear()} Rainbow Preschool International. All rights reserved.</p>
      <div>
        <a href="${BASE_URL}/playgroup">Playgroup</a>
        <a href="${BASE_URL}/nursery">Nursery</a>
        <a href="${BASE_URL}/kindergarten">Kindergarten</a>
        <a href="${BASE_URL}/preschool-admissions">Admissions</a>
        <a href="${BASE_URL}/best-preschool-near-me-in-thane">Best Preschool in Thane</a>
        <a href="${BASE_URL}/play-school-near-me">Play School Near Me</a>
      </div>
      <p><a href="https://rainbowinternationalschool.in" rel="noopener">Rainbow International School</a> — CBSE K–12, Nursery to Class 12</p>
      <p><a href="${BASE_URL}/privacy">Privacy Policy</a> | <a href="${BASE_URL}/terms">Terms of Service</a></p>
    </footer>
  </body>
</html>`;
}

export function setupBotSSR(app: Express) {
  app.use((req: Request, res: Response, next: NextFunction) => {
    const userAgent = req.headers["user-agent"] || "";
    if (!isBot(userAgent)) {
      return next();
    }

    const urlPath = req.path;

    if (
      urlPath.startsWith("/api/") ||
      urlPath.startsWith("/assets/") ||
      urlPath.startsWith("/images/") ||
      urlPath.match(/\.(js|css|png|jpg|webp|svg|ico|woff2?|ttf|map|json|xml|txt)$/)
    ) {
      return next();
    }

    const seo = getPageSEO(urlPath);
    if (!seo) {
      return next();
    }

    const html = renderSSRHtml(seo, urlPath);
    res.status(200).set({ "Content-Type": "text/html; charset=utf-8" }).send(html);
  });
}
