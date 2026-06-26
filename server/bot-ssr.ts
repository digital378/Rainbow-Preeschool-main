import type { Request, Response, NextFunction, Express } from "express";
import fs from "fs";
import path from "path";
import { getPageSEO, type PageSEOData } from "./ssr-pages";
import { VERIFIED_RATING } from "../shared/verified-rating";

// Inclusion rule: only add UA strings that appear EXCLUSIVELY in automated
// crawlers / bots and NEVER in any human-operated browser or in-app browser.
// Do NOT add social-app in-app browsers (WhatsApp, Instagram, Pinterest,
// Facebook app, Telegram app) — those are real users and must receive the
// full React app, not the plain bot HTML.
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
  "telegrambot",
  "applebot",
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

  // For E-E-A-T freshness, inject a generic Article JSON-LD with
  // `dateModified` whenever `seo.lastModified` is set AND no existing
  // BlogPosting/Article schema is already present in `seo.structuredData`.
  // This restores the freshness signal on the 6 commercial + 12 locality
  // pages without duplicating Article markup on blog posts (which already
  // emit their own BlogPosting/Article block with the correct dates,
  // headline, author and publisher via `seo.structuredData`). The visible
  // "Reviewed by Rainbow Preschool Curriculum Team — Last updated …" byline
  // + <time> element below is rendered from the same `lastModified` field
  // so the visible and JSON-LD freshness dates can never drift apart.
  const hasExistingArticle = allStructuredData.some((data) => {
    const t = (data as { "@type"?: unknown })["@type"];
    if (typeof t === "string") return t === "Article" || t === "BlogPosting";
    if (Array.isArray(t)) return t.some((v) => v === "Article" || v === "BlogPosting");
    return false;
  });
  if (seo.lastModified && !hasExistingArticle) {
    // E-E-A-T: emit a rich Article with reviewedBy for pages that don't already
    // have their own Article/BlogPosting in structuredData. Blog posts are excluded
    // here because their ssr-pages.ts entry already includes BlogPosting + reviewedBy.
    // author and reviewer are always the org Curriculum Team for non-blog pages.
    const curriculumTeam = {
      "@type": "Organization",
      name: "Rainbow Preschool Curriculum Team",
      parentOrganization: {
        "@type": "Organization",
        name: "Rainbow Preschool International",
      },
    };
    allStructuredData.push({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: seo.h1 || seo.title,
      description: seo.description,
      url: canonical,
      mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
      dateModified: seo.lastModified,
      author: curriculumTeam,
      reviewedBy: curriculumTeam,
      publisher: {
        "@type": "Organization",
        name: "Rainbow Preschool International",
        logo: { "@type": "ImageObject", url: `${BASE_URL}/images/logo.webp` },
      },
      image: ogImage,
      inLanguage: "en-IN",
    });
  }

  // AggregateRating for the school entity — emitted for ALL pages with lastModified,
  // including blog posts (which have BlogPosting and skip the generic Article above).
  // Decoupled from hasExistingArticle so blog pages also receive this node.
  // Mirrors the node eeat-signals.tsx previously injected client-side.
  if (seo.lastModified) {
    allStructuredData.push({
      "@context": "https://schema.org",
      "@type": "Preschool",
      name: "Rainbow Preschool International",
      url: canonical,
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: VERIFIED_RATING.ratingValue.toFixed(1),
        reviewCount: VERIFIED_RATING.reviewCount,
        bestRating: "5",
        worstRating: "1",
      },
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
      if (section.links && section.links.length > 0) {
        html += "<ul>\n";
        section.links.forEach((link) => {
          const raw = link.url || "";
          const href = /^https?:\/\//i.test(raw)
            ? raw
            : raw.startsWith("/")
              ? `${BASE_URL}${raw}`
              : null;
          if (!href) return;
          html += `<li><a href="${escapeHtml(href)}">${escapeHtml(link.text)}</a></li>\n`;
        });
        html += "</ul>\n";
      }
      if (section.table) {
        html += "<table>\n<thead>\n<tr>";
        section.table.headers.forEach((h) => {
          html += `<th>${escapeHtml(h)}</th>`;
        });
        html += "</tr>\n</thead>\n<tbody>\n";
        section.table.rows.forEach((row) => {
          html += "<tr>";
          row.forEach((cell) => {
            html += `<td>${escapeHtml(cell)}</td>`;
          });
          html += "</tr>\n";
        });
        html += "</tbody>\n</table>\n";
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
      ${seo.lastModified ? `<p style="font-size:0.875rem;color:#666;margin:8px 0 16px"><strong>Reviewed by Rainbow Preschool Curriculum Team</strong> — Last updated: <time datetime="${seo.lastModified}">${escapeHtml(seo.lastModifiedDisplay || seo.lastModified)}</time> · ★★★★★ 4.9/5 (487 parent reviews)</p>` : ""}
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
      urlPath === "/" ||
      urlPath.startsWith("/api/") ||
      urlPath.startsWith("/assets/") ||
      urlPath.startsWith("/images/") ||
      urlPath.match(/\.(js|css|png|jpg|webp|svg|ico|woff2?|ttf|map|json|xml|txt)$/)
    ) {
      return next();
    }

    const seo = getPageSEO(urlPath);

    if (!seo) {
      // Unknown URL — serve a proper noindex 404 SSR page so bots don't
      // fall through to the SPA shell that defaults to "index, follow".
      // A soft 404 (200 + indexable) would let Googlebot try to crawl and
      // index every typo/spam URL that hits the site.
      const notFoundSeo: PageSEOData = {
        title: "Page Not Found | Rainbow Preschool International",
        description: "The page you requested does not exist. Explore our preschool programmes, centres, and admissions information.",
        noIndex: true,
        h1: "Page Not Found",
        canonical: `${BASE_URL}/`,
        breadcrumbs: [{ name: "Home", url: "/" }],
        introText: "Sorry, we couldn't find what you were looking for. Please visit our home page or use the links below to find information about our programmes.",
        contentSections: [
          {
            heading: "Popular Pages",
            links: [
              { text: "Playgroup (1.5–2.5 yrs)", url: "/playgroup" },
              { text: "Nursery (2.5–3.5 yrs)", url: "/nursery" },
              { text: "Kindergarten (4–6 yrs)", url: "/kindergarten" },
              { text: "Preschool Admissions", url: "/preschool-admissions" },
              { text: "Contact Us", url: "/contact" },
            ],
          },
        ],
      };
      const notFoundHtml = renderSSRHtml(notFoundSeo, urlPath);
      res.status(404).set({
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
        "CDN-Cache-Control": "no-store",
        "Cloudflare-CDN-Cache-Control": "no-store",
        "Vary": "User-Agent, Accept-Encoding",
      }).removeHeader("Set-Cookie");
      res.send(notFoundHtml);
      return;
    }

    const html = renderSSRHtml(seo, urlPath);
    res.status(200).set({
      "Content-Type": "text/html; charset=utf-8",
      // Bot SSR responses vary by user-agent and must NEVER be cached at the
      // CDN edge. Defence in depth — three layers, because legacy CF "Cache
      // Everything" Page Rules ignore plain Cache-Control:
      //   1. Cache-Control: no-store          → browsers + standards-compliant CDNs
      //   2. CDN-Cache-Control: no-store      → generic CDN-only directive (RFC draft)
      //   3. Cloudflare-CDN-Cache-Control     → CF-specific, OVERRIDES Page Rules
      //   4. Vary: User-Agent                 → if CF still caches, at least it segments
      //      bot vs human responses so a bot HIT cannot poison the human entry.
      "Cache-Control": "no-store",
      "CDN-Cache-Control": "no-store",
      "Cloudflare-CDN-Cache-Control": "no-store",
      "Vary": "User-Agent, Accept-Encoding",
      // Strip any auth/session cookies that may have been attached upstream —
      // CF flips public→private when Set-Cookie is present, breaking edge cache
      // for the human SPA shell on the same URL once a bot response leaks through.
    }).removeHeader("Set-Cookie");
    res.send(html);
  });
}
