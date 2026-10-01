import type { Request, Response, NextFunction, Express } from "express";
import fs from "fs";
import path from "path";
import { getPageSEO, type PageSEOData } from "./ssr-pages";
import { VERIFIED_RATING } from "../shared/verified-rating";
import { STANDALONE_BLOG_SLUGS } from "../shared/standalone-blog-slugs";
import { isNonSeoServerRoute } from "./non-seo-routes";
import { storage } from "./storage";
import { redirectMap } from "./redirects";
import { BLOG_LIST_COPY, blogPostToListEntry, legacyBlogListEntries } from "@shared/blog-list-copy";
import { getBlogFeaturedImage, LEGACY_BLOG_FEATURED_IMAGE_URLS, LEGACY_BLOG_LOCAL_POST_SLUGS } from "@shared/blog-featured-image-data";
import { getBlogMetadata } from "@shared/blog-metadata";
import { TOP_PRESCHOOLS_COPY, TOP_PRESCHOOLS_CENTRE_LINKS, TOP_PRESCHOOLS_COMPETITOR_LINKS, TOP_PRESCHOOLS_BREADCRUMB_SCHEMA } from "@shared/top-preschools-thane-content";
import { centres, branchWhatsAppGreeting } from "@shared/centre-data";
import { injectIndexPolicyShell } from "./index-policy-shell";
import { injectPageSchemas } from "./static";

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
  // Answer-engine / LLM-citation fetchers seen live on production access logs.
  // Distinct from the crawler-style bots above (claudebot, perplexitybot):
  // these fire when a real person asks ChatGPT/Claude/Perplexity a question
  // and the assistant fetches the page live to answer/cite it. Missing them
  // means those live, high-intent answers were built from the empty SPA
  // shell instead of real page content.
  "claude-user",
  "perplexity-user",
  "ccbot",
  "google-extended",
  // SEO auditing tools — not in this list by default, so they receive the
  // React shell and incorrectly report the site as having no content. This
  // exact false alarm occurred in an external audit. Adding them here ensures
  // auditing crawlers see the same fully-rendered HTML that Googlebot sees.
  "screamingfrog",
  "sitebulb",
  "lighthouse",
  // getveritas.io's "Site Audit" tool — same false-alarm pattern (reported
  // missing H1, orphan pages, and missing Organization schema, all because
  // it read the pre-hydration SPA shell instead of rendered content).
  // Exact crawler UA string wasn't confirmed at time of writing; matching on
  // "veritas" as a best-effort substring since that's unlikely to appear in
  // any real browser or in-app browser UA.
  "veritas",
];

function isBot(userAgent: string): boolean {
  const ua = userAgent.toLowerCase();
  return BOT_USER_AGENTS.some((bot) => ua.includes(bot));
}

// Signatures that appear in real, JS-executing browser engines (including
// in-app browsers built on those engines, e.g. WhatsApp/Instagram/Facebook's
// iOS/Android webviews, which embed "Safari"/"Chrome" tokens). Also covers
// headless-browser test tooling (Playwright/Puppeteer's default UA strings
// contain "HeadlessChrome"/"Chrome"/"Safari"), so automated UI testing and
// screenshot tools keep seeing the real hydrated React app, not this HTML.
const REAL_BROWSER_SIGNATURES = [
  "chrome/",
  "chromium/",
  "crios/",
  "firefox/",
  "fxios/",
  "safari/",
  "edg/",
  "edga/",
  "edgios/",
  "opr/",
  "opera",
  "ucbrowser",
  "samsungbrowser",
  "miuibrowser",
  "huaweibrowser",
  "yabrowser",
  "vivaldi",
  "brave",
  "silk/",
  // Social-app in-app browsers whose UA strings don't always carry a
  // "Safari/"-style engine token (e.g. Instagram's iOS webview UA ends in
  // "Instagram 303.0.0.30.107" with no trailing "Safari/x.y"), so they'd
  // otherwise fail the engine-signature check above and get misclassified
  // as non-browser clients — sending real users the bot-SSR HTML instead of
  // the interactive React app. Caught by scripts/check-bot-detection.ts.
  "instagram",
  "fbav/",
  "fban/",
  "fb_iab",
  "twitter",
  "line/",
  "micromessenger",
  "snapchat",
  "tiktok",
  "linkedinapp",
  "pinterest",
];

function looksLikeRealBrowser(userAgent: string): boolean {
  const ua = userAgent.toLowerCase();
  return REAL_BROWSER_SIGNATURES.some((sig) => ua.includes(sig));
}

/**
 * Whether this request should receive the plain server-rendered HTML
 * (real per-page title/description/canonical/h1/body) instead of the bare
 * React SPA shell.
 *
 * Historically this only fired for user agents on the explicit
 * `BOT_USER_AGENTS` allow-list, so every other non-JS-executing client —
 * generic SEO audit tools, uncommon/newer crawlers, plain HTTP clients with
 * no UA at all — fell through to the SPA shell and saw the homepage's
 * title/description/canonical on every URL (Google Search Console and an
 * external audit both flagged this: sitemap URLs "canonicalising" to the
 * homepage, and 200s served for URLs that don't exist).
 *
 * Fix: default to serving real content unless the UA is recognisable as an
 * actual browser engine. This keeps the experience for real users (and
 * automated browser-based testing/screenshot tools) completely unchanged,
 * while any client that isn't a real browser — known bot or not — now gets
 * accurate metadata and correct 404s.
 */
function shouldServeSSR(userAgent: string): boolean {
  // Auditors that launch a real browser must measure the hydrated visitor
  // page; their non-browser HTTP crawlers still receive full bot HTML. Do not
  // apply this exception to Googlebot: its mobile UA also contains Chrome.
  const ua = userAgent.toLowerCase();
  if (["lighthouse", "screamingfrog", "sitebulb", "veritas"].some(tool => ua.includes(tool))
      && looksLikeRealBrowser(userAgent) && !ua.includes("googlebot")) return false;
  if (isBot(userAgent)) return true;
  return !looksLikeRealBrowser(userAgent);
}

const BASE_URL = "https://www.rainbowpreschools.com";

function finalInternalPath(raw: string): string | null {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return null;
  let path = raw.split("#")[0].split("?")[0] || "/";
  const seen = new Set<string>();
  while (redirectMap[path] && !seen.has(path)) {
    seen.add(path);
    path = redirectMap[path];
  }
  if (redirectMap[path]) return null;
  return path;
}

/**
 * The listing is assembled per request: the database is authoritative for
 * published posts, while legacy articles remain discoverable until they are
 * retired.  Keeping this here avoids turning the SEO recovery list into a
 * second, stale publishing database.
 */
async function addArticleDiscoveryLinks(seo: PageSEOData): Promise<PageSEOData> {
  if (seo.canonical !== `${BASE_URL}/blog`) return seo;
  const posts = await storage.getBlogPosts();
  const entriesByUrl = new Map<string, ReturnType<typeof blogPostToListEntry>>();
  for (const entry of [...posts.map(blogPostToListEntry), ...legacyBlogListEntries()]) {
    if (!entriesByUrl.has(entry.url)) entriesByUrl.set(entry.url, entry);
  }
  const entries = Array.from(entriesByUrl.values());
  const categories = Array.from(new Set(entries.map((entry) => entry.category))).sort();
  return {
    ...seo,
    blogCards: entries,
    blogCategories: [BLOG_LIST_COPY.allCategory, ...categories],
    blogArticleCount: entries.length,
  };
}

async function addVisitorSelectedBlogImage(seo: PageSEOData, path: string): Promise<PageSEOData> {
  if (!path.startsWith("/blog/")) return seo;
  const slug = path.slice("/blog/".length);
  const isLegacyLocalPost = (LEGACY_BLOG_LOCAL_POST_SLUGS as readonly string[]).includes(slug);
  const apiPost = isLegacyLocalPost ? null : await storage.getBlogPostBySlug(slug);
  const imageUrl = isLegacyLocalPost
    ? LEGACY_BLOG_FEATURED_IMAGE_URLS[slug]
    : apiPost?.imageUrl;
  const image = getBlogFeaturedImage(
    imageUrl,
    getBlogMetadata(slug)?.h1 ?? seo.h1 ?? apiPost?.title ?? seo.title,
  );
  if (!image) return seo;
  return {
    ...seo,
    contentSections: [{ images: [image] }, ...(seo.contentSections || [])],
  };
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const allowedHomepageExternalLinks = new Set([
  "https://www.instagram.com/rainbowpreschools/",
  "https://rainbowinternationalschool.in",
  "https://wa.me/918828195788",
  "https://wa.me/918291568972?text=Hi%2C%20I%20would%20like%20to%20know%20more%20about%20Rainbow%20Preschool",
  "https://wa.me/918291568972?text=Hi%2C%20I%27m%20interested%20in%20Playgroup%20admission",
  "https://wa.me/918291568972?text=Hi%2C%20I%27m%20interested%20in%20Nursery%20admission",
  "tel:+918828195788",
  "tel:+918291568972",
  "https://wa.me/919833781550",
  "tel:+919833781550",
  "tel:+919152489789",
  "https://maps.app.goo.gl/oFnzPGooMos4qACV9",
]);

const allowedTopPreschoolsExternalLinks = new Set([
  TOP_PRESCHOOLS_COPY.admissionsLinks[1].href,
  TOP_PRESCHOOLS_COPY.cta.links[1].href,
  ...TOP_PRESCHOOLS_CENTRE_LINKS.map((link) => link.href),
  ...TOP_PRESCHOOLS_COMPETITOR_LINKS.map((link) => link.href),
]);
const allowedBranchWhatsAppLinks = new Set(centres.flatMap((centre) => {
  const url = `https://wa.me/91${centre.whatsappNumber}`;
  return [url, `${url}?text=${encodeURIComponent(branchWhatsAppGreeting(centre))}`];
}));

function resolvePageLink(url: string): { href: string; external: boolean } | null {
  const hrefPath = finalInternalPath(url);
  if (hrefPath) {
    return { href: `${BASE_URL}${hrefPath}`, external: false };
  }
  return (allowedHomepageExternalLinks.has(url) || allowedTopPreschoolsExternalLinks.has(url) || allowedBranchWhatsAppLinks.has(url))
    ? { href: url, external: !url.startsWith("tel:") }
    : null;
}

function renderImageHtml(image: {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  caption?: string;
  loading?: "eager" | "lazy";
}): string {
  if (!/^\/(?:images|assets|blog|blog-assets|characters|instagram-reels)\/[A-Za-z0-9_./-]+$/.test(image.src) || image.src.includes("..")) return "";
  const width = image.width === undefined ? "" : ` width="${image.width}"`;
  const height = image.height === undefined ? "" : ` height="${image.height}"`;
  const imageHtml = `<img src="${escapeHtml(image.src)}" alt="${escapeHtml(image.alt)}"${width}${height} loading="${image.loading || "lazy"}" />`;
  return image.caption
    ? `<figure>${imageHtml}<figcaption>${escapeHtml(image.caption)}</figcaption></figure>`
    : imageHtml;
}

function renderSSRHtml(seo: PageSEOData, requestUrl: string): string {
  const isEnhancedBranch = requestUrl === "/preschool-in-anand-nagar-thane" || requestUrl === "/preschool-in-kalwa-thane" || requestUrl === "/preschool-in-manpada-thane" || requestUrl === "/preschool-in-hariniwas-thane" || requestUrl === "/preschool-in-dhokali-thane" || requestUrl === "/preschool-in-kasarvadavali-thane";
  // These standalone pages end at their contact CTA in the visitor app.
  // Keep the crawler HTML aligned rather than appending the shared footer.
  const endsAtContact = requestUrl === "/play-school-near-ghodbunder-road"
    || /^\/preschool-in-(?:manpada|hariniwas|anand-nagar|dhokali|kalwa|kasarvadavali)-thane$/.test(requestUrl);
  const fullUrl = `${BASE_URL}${requestUrl}`;
  const canonical = seo.canonical || fullUrl;
  const ogImage = seo.ogImage || `${BASE_URL}/og-image.jpg`;
  const robots = seo.noIndex ? "noindex, nofollow" : "index, follow";

  const allStructuredData = [...(seo.structuredData || [])];

  if (seo.breadcrumbs && seo.breadcrumbs.length > 0) {
    allStructuredData.push(requestUrl === "/top-preschools-in-thane" ? TOP_PRESCHOOLS_BREADCRUMB_SCHEMA : {
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
  if (seo.lastModified && !seo.homepage && !seo.suppressArticleSchema && !isEnhancedBranch && !hasExistingArticle) {
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


  const structuredDataScripts = allStructuredData
    .map((data) => `<script type="application/ld+json">${JSON.stringify(data)}</script>`)
    .join("\n    ");

  const contentHtml = (seo.contentSections || [])
    .map((section) => {
      let html = `<section>`;
      if (section.eyebrow) {
        html += `<p class="section-eyebrow">${escapeHtml(section.eyebrow)}</p>\n`;
      }
      if (section.heading) {
        html += `<h2>${escapeHtml(section.heading)}</h2>\n`;
      }
      if (section.text) {
        html += `<p>${escapeHtml(section.text)}</p>\n`;
      }
      if (section.paragraphs) {
        section.paragraphs.forEach((paragraph) => { html += `<p>${escapeHtml(paragraph)}</p>\n`; });
      }
      if (section.beforeSubsectionsItems) {
        html += `<ol>${section.beforeSubsectionsItems.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ol>\n`;
      }
      const renderRichParagraph = (segments: readonly { text: string; href?: string }[]) => {
        const body = segments.map(segment => {
          const safeLink = segment.href ? resolvePageLink(segment.href) : null;
          return safeLink
            ? `<a href="${escapeHtml(safeLink.href)}">${escapeHtml(segment.text)}</a>`
            : escapeHtml(segment.text);
        }).join("");
        html += `<p>${body}</p>\n`;
      };
      section.richParagraphs?.forEach(renderRichParagraph);
      if (section.subsections) {
        section.subsections.forEach((subsection) => {
          if (subsection.image) html += `${renderImageHtml(subsection.image)}\n`;
          if (subsection.heading) html += `<h3>${escapeHtml(subsection.heading)}</h3>\n`;
          if (subsection.text) html += `<p>${escapeHtml(subsection.text)}</p>\n`;
          if (subsection.items) html += `<ul>${subsection.items.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul>\n`;
          if (subsection.links) {
            subsection.links.forEach(link => {
              const safeLink = resolvePageLink(link.url);
              if (safeLink) {
                const target = link.newTab && safeLink.external ? ' target="_blank"' : "";
                const rel = safeLink.external
                  ? ` rel="${link.nofollow ? "nofollow " : ""}noopener${link.nofollow || !link.newTab ? " noreferrer" : ""}"`
                  : "";
                html += `<a href="${escapeHtml(safeLink.href)}"${target}${rel}>${escapeHtml(link.text)}</a>\n`;
              }
            });
          }
        });
      }
      section.afterSubsectionsRichParagraphs?.forEach(renderRichParagraph);
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
          const safeLink = resolvePageLink(link.url || "");
          if (!safeLink) return;
          const rel = safeLink.external ? ` rel="noopener noreferrer"` : "";
          html += `<li><a href="${escapeHtml(safeLink.href)}"${rel}>${escapeHtml(link.text)}</a></li>\n`;
        });
        html += "</ul>\n";
      }
      if (section.faqItems?.length) {
        html += `<div class="faq-list">\n`;
        section.faqItems.forEach((faq) => {
          const answer = faq.answerSegments.map((segment) => {
            const text = escapeHtml(segment.text);
            if (!segment.href) return text;
            const safeLink = resolvePageLink(segment.href);
            if (!safeLink) return text;
            const rel = safeLink.external ? ` rel="noopener noreferrer"` : "";
            return `<a href="${escapeHtml(safeLink.href)}"${rel}>${text}</a>`;
          }).join("");
           html += section.faqAsHeadings
             ? `<div><h3>${escapeHtml(faq.question)}</h3><p>${answer}</p></div>\n`
             : `<details${section.faqInitiallyClosed ? "" : " open"}><summary>${escapeHtml(faq.question)}</summary><p>${answer}</p></details>\n`;
        });
        html += `</div>\n`;
      }
      if (section.faqOutro) {
        html += `<p>${escapeHtml(section.faqOutro.text)}</p>`;
        const link = resolvePageLink(section.faqOutro.url);
        if (link) html += `<a href="${escapeHtml(link.href)}">${escapeHtml(section.faqOutro.linkText)}</a>`;
      }
      if (section.images && section.images.length > 0) {
        for (const image of section.images) {
          html += `${renderImageHtml(image)}\n`;
        }
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

  const blogControlsHtml = seo.blogCategories && seo.blogArticleCount !== undefined
    ? `<section aria-label="Blog filters"><ul>${seo.blogCategories.map(category => `<li>${escapeHtml(category)}</li>`).join("")}</ul><p>${escapeHtml(BLOG_LIST_COPY.articleCountPattern
      .replace("{count}", String(seo.blogArticleCount))
      .replace("{plural}", seo.blogArticleCount === 1 ? "" : "s"))}</p></section>`
    : "";
  const blogCardsHtml = seo.blogCards
    ? `<section aria-label="Latest articles"><div>${seo.blogCards.map(card => `
      <a href="${escapeHtml(card.url)}"><article>
        <span>${escapeHtml(card.category)}</span>
        <h2>${escapeHtml(card.title)}</h2>
        <p>${escapeHtml(card.excerpt)}</p>
        <div>${escapeHtml(BLOG_LIST_COPY.readArticle)}</div>
      </article></a>`).join("\n")}</div></section>`
    : "";
  const reviewerCreditHtml = seo.lastModified
    ? isEnhancedBranch || requestUrl === "/top-preschools-in-thane" || requestUrl === "/about"
      ? `<p style="font-size:0.875rem;color:#666;margin:24px 0">Last updated: <time datetime="${escapeHtml(seo.lastModified)}">${escapeHtml(seo.lastModifiedDisplay || seo.lastModified)}</time></p>`
      : `<p style="font-size:0.875rem;color:#666;margin:8px 0 16px"><strong>Reviewed by Rainbow Preschool Curriculum Team</strong>${requestUrl === "/playgroup" || requestUrl === "/nursery" ? " — Curriculum Team, Rainbow Preschool International" : ""} — Last updated: <time datetime="${escapeHtml(seo.lastModified)}">${escapeHtml(seo.lastModifiedDisplay || seo.lastModified)}</time>${requestUrl === "/playgroup" || requestUrl === "/nursery" ? " — 4.9 from 487 Google reviews" : ""}</p>`
    : "";
  const finalCallToActionHtml = seo.finalCallToAction
    ? `<section class="final-cta"><h2>${escapeHtml(seo.finalCallToAction.title)}</h2><p>${escapeHtml(seo.finalCallToAction.description)}</p><ul>${seo.finalCallToAction.links.map((link) => {
      const safeLink = resolvePageLink(link.url);
      if (!safeLink) return "";
      const rel = safeLink.external ? ` rel="noopener noreferrer"` : "";
      return `<li><a href="${escapeHtml(safeLink.href)}"${rel}>${escapeHtml(link.text)}</a></li>`;
    }).join("")}</ul></section>`
    : requestUrl === "/contact" || requestUrl === "/top-preschools-in-thane" ? "" : `<a href="${BASE_URL}/contact" class="cta">Enquire Now — Call 82915 68972</a>`;

  return `<!DOCTYPE html>
  <html lang="${requestUrl === "/nursery" || requestUrl === "/kindergarten" || requestUrl === "/programmes" || requestUrl === "/contact" || requestUrl === "/top-preschools-in-thane" || requestUrl === "/about" || isEnhancedBranch ? "en-IN" : "en"}">
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
     <meta property="og:image:alt" content="${escapeHtml(seo.ogImageAlt || "Three preschoolers in red uniforms playing on a bright yellow background with colorful toy blocks")}" />
     ${requestUrl === "/nursery" || requestUrl === "/kindergarten" || requestUrl === "/programmes" || requestUrl === "/contact" || requestUrl === "/top-preschools-in-thane" || requestUrl === "/about" || isEnhancedBranch ? `<meta property="og:image:type" content="image/jpeg" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />` : ""}
    <meta property="og:site_name" content="Rainbow Preschool International" />
    <meta property="og:locale" content="en_IN" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(seo.title)}" />
    <meta name="twitter:description" content="${escapeHtml(seo.description)}" />
    <meta name="twitter:image" content="${ogImage}" />
     <meta name="twitter:image:alt" content="${escapeHtml(seo.ogImageAlt || "Three preschoolers in red uniforms playing on a bright yellow background with colorful toy blocks")}" />

    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    <link rel="icon" type="image/png" sizes="256x256" href="/favicon.png" />
    <link rel="apple-touch-icon" href="/favicon.png" />

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
      ${seo.breadcrumbs && requestUrl !== "/contact" ? `<div class="breadcrumb">${seo.breadcrumbs.map((b) => b.url
        ? `<a href="${BASE_URL}${b.url}">${escapeHtml(b.name)}</a>`
        : `<span>${escapeHtml(b.name)}</span>`).join(" › ")}</div>` : ""}
      ${seo.heroBadge ? `<p>${escapeHtml(seo.heroBadge)}</p>` : ""}
      <h1>${escapeHtml(seo.h1 || seo.title)}</h1>
      ${seo.reviewerAfterContent ? "" : reviewerCreditHtml}
       ${seo.introSegments
         ? `<p>${seo.introSegments.map(segment =>
             segment.href && (
               /^tel:\+?[0-9]+$/.test(segment.href)
               || requestUrl === "/top-preschools-in-thane" && segment.href === "/play-school-near-me"
             )
               ? `<a href="${escapeHtml(segment.href)}">${escapeHtml(segment.text)}</a>`
               : escapeHtml(segment.text)
           ).join("")}</p>`
         : seo.introText ? `<p>${escapeHtml(seo.introText)}</p>` : ""}
      ${seo.heroSubheading ? `<h3>${escapeHtml(seo.heroSubheading)}</h3>` : ""}
      ${(seo.images || []).map(renderImageHtml).join("\n")}
      ${contentHtml}
      ${seo.reviewerAfterContent && !isEnhancedBranch ? reviewerCreditHtml : ""}
      ${blogControlsHtml}
      ${blogCardsHtml}
      ${finalCallToActionHtml}
      ${seo.reviewerAfterContent && isEnhancedBranch ? reviewerCreditHtml : ""}
      ${endsAtContact ? "" : `<div class="network">
        <p><strong>Our Network:</strong> <a href="https://rainbowinternationalschool.in" rel="noopener">Rainbow International School</a> — CBSE-affiliated K–12 school in Thane West, Nursery to Class 12</p>
      </div>`}
    </main>
    ${endsAtContact ? "" : `<footer>
      <p>&copy; ${new Date().getFullYear()} Rainbow Preschool International. All rights reserved.</p>
      <div aria-label="Quick Links">
        <a href="${BASE_URL}/">Home</a>
        <a href="${BASE_URL}/about">About Us</a>
        <a href="${BASE_URL}/programmes">Our Programmes</a>
        ${requestUrl === "/play-school-near-me"
          ? "Find a preschool near you"
          : `<a href="${BASE_URL}/play-school-near-me">Find a preschool near you</a>`}
        <a href="${BASE_URL}/preschool-admissions">Preschool Admissions</a>
        <a href="${BASE_URL}/blog">Blogs</a>
        <a href="${BASE_URL}/contact">Contact Us</a>
      </div>
      <div aria-label="Our Programmes">
        <a href="${BASE_URL}/playgroup">Playgroup</a>
        <a href="${BASE_URL}/nursery">Nursery</a>
        <a href="${BASE_URL}/kindergarten">Kindergarten</a>
      </div>
      <p><a href="https://rainbowinternationalschool.in" rel="noopener">Rainbow International School</a> — CBSE K–12, Nursery to Class 12</p>
      <p><a href="${BASE_URL}/privacy">Privacy Policy</a> | <a href="${BASE_URL}/terms">Terms of Service</a></p>
    </footer>`}
  </body>
</html>`;
}

export function setupBotSSR(app: Express) {
  app.use((req: Request, res: Response, next: NextFunction) => {
    void (async () => {
    const userAgent = req.headers["user-agent"] || "";
    if (!shouldServeSSR(userAgent)) {
      return next();
    }

    const urlPath = req.path;

    if (
      urlPath.startsWith("/api/") ||
      urlPath.startsWith("/assets/") ||
      urlPath.startsWith("/images/") ||
      urlPath.match(/\.(js|css|png|jpe?g|webp|svg|pdf|ico|woff2?|ttf|map|json|xml|txt)$/)
    ) {
      return next();
    }

    // These articles have complete standalone HTML with their own published
    // dates and metadata. Never replace them with shorter generated summaries.
    if (STANDALONE_BLOG_SLUGS.some((slug) => urlPath === `/blog/${slug}`)) {
      return next();
    }

    const seo = getPageSEO(urlPath);

    if (urlPath === "/play-school-near-me" && seo) {
      // Use the exact same shared renderer and policy-shell injection as the
      // visitor response. In particular, do not run the generic bot renderer
      // here: it adds the legacy byline, Article schema and a different body.
      const botTemplate = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5" />
    <title></title>
    <meta name="description" content="" />
    <meta name="author" content="Rainbow Preschool International" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="" />
    <meta property="og:title" content="" />
    <meta property="og:description" content="" />
    <meta property="og:image" content="" />
    <meta property="og:site_name" content="Rainbow Preschool International" />
    <meta property="og:locale" content="en_IN" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="" />
    <meta name="twitter:description" content="" />
    <meta name="twitter:image" content="" />
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    <link rel="icon" type="image/png" sizes="256x256" href="/favicon.png" />
    <link rel="apple-touch-icon" href="/favicon.png" />
  </head>
  <body><div id="root"></div></body>
</html>`;
      const html = injectIndexPolicyShell(urlPath, injectPageSchemas(urlPath, botTemplate));
      res.status(200).set({
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
        "CDN-Cache-Control": "no-store",
        "Cloudflare-CDN-Cache-Control": "no-store",
        "Vary": "User-Agent, Accept-Encoding",
      }).removeHeader("Set-Cookie");
      res.send(html);
      return;
    }

    if (!seo) {
      // Standalone blog pages are self-contained HTML files with their own
      // JSON-LD and meta tags. Pass through to the Express route registered
      // in routes.ts so Googlebot receives the actual page content.
      if (STANDALONE_BLOG_SLUGS.some((slug) => urlPath === `/blog/${slug}`)) {
        return next();
      }

      // Real routes with no ssr-pages.ts entry (fast-loading ad HTML files,
      // GTM beacon endpoint) — see server/non-seo-routes.ts. Pass through to
      // their registered handler in routes.ts instead of a synthetic 404.
      if (isNonSeoServerRoute(urlPath)) {
        return next();
      }

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
              { text: "Kindergarten (3.5–5.5 yrs)", url: "/kindergarten" },
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

    let renderSeo = urlPath === "/blog" ? await addArticleDiscoveryLinks(seo) : seo;
    renderSeo = await addVisitorSelectedBlogImage(renderSeo, urlPath);
    let html = renderSSRHtml(renderSeo, urlPath);
    if (urlPath === "/contact") {
      const email = "admin@rainbowpreschools.com";
      html = html.replace(
        email,
        `<!--email_off--><a href="mailto:${email}">${email}</a><!--/email_off-->`,
      );
    }
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
    })().catch(next);
  });
}
