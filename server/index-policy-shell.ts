import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { shouldNoIndex, PREFERRED_DOMAIN } from "@shared/seo-config";
import { getPageSEO } from "./ssr-pages";
import { PLAYGROUP_COPY } from "@shared/playgroup-page-content";
import { PLAYGROUP_FAQS } from "@shared/playgroup-faq-data";
import { NURSERY_COPY } from "@shared/nursery-page-content";
import { NURSERY_FAQS } from "@shared/nursery-faq-data";
import { KINDERGARTEN_COPY } from "@shared/kindergarten-page-content";
import { KINDERGARTEN_VISITOR_FAQS, PROGRAMMES_VISITOR_COPY } from "../client/src/pages/visitor-page-copy";
import { PROGRAMMES_COPY, PROGRAMMES_FAQS } from "@shared/programmes-page-content";
import { CONTACT_PAGE_COPY } from "@shared/contact-page-copy";
import { TOP_PRESCHOOLS_COPY } from "@shared/top-preschools-thane-content";
import { ABOUT_PAGE_COPY } from "@shared/about-page-content";
import { anandNagarPage, kalwaPage, manpadaPage, hariniwasPage, dhokaliPage, kasarvadavaliPage } from "@shared/centre-data";
import { playSchoolNearMePhotos } from "@shared/branch-photos";
import { renderPlaySchoolNearMeHtml } from "@shared/play-school-near-me-render";
import { injectSymbolsDocument } from "./symbols-document";

/**
 * Keep the browser's initial document metadata aligned with bot SSR and the
 * hydrated route. The SPA still renders the body; this only corrects the head
 * before JavaScript runs. Leave the homepage's separately maintained shell
 * and its freshness injection untouched.
 */
export function injectIndexPolicyShell(path: string, html: string): string {
  if (path === "/") return html;
  const isBranchPage = path === "/preschool-in-anand-nagar-thane" || path === "/preschool-in-kalwa-thane" || path === "/preschool-in-manpada-thane" || path === "/preschool-in-hariniwas-thane" || path === "/preschool-in-dhokali-thane" || path === "/preschool-in-kasarvadavali-thane";
  const branchImageAlt = path === "/preschool-in-anand-nagar-thane"
    ? "Two children playing with blocks at Rainbow Preschool"
    : path === "/preschool-in-kalwa-thane" ? "Rainbow Preschool children learning together at a classroom table" : path === "/preschool-in-dhokali-thane" ? "Rainbow Preschool International entrance with colourful murals" : "Rainbow Preschool classroom activity";
  const seo = getPageSEO(path);
  if (!seo && path !== "/terms" && path !== "/privacy" && !shouldNoIndex(path)) return html;

  const escape = (value: string) => value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
  const canonical = seo?.canonical ?? `${PREFERRED_DOMAIN}${path}`;
  const robots = seo?.noIndex || shouldNoIndex(path) || path === "/terms" || path === "/privacy"
    ? "noindex, nofollow" : "index, follow";
  let result = html
    .replace(/<meta name="robots" content="[^"]*"\s*\/?>/i, `<meta name="robots" content="${robots}" />`)
    .replace(/<link rel="canonical" href="[^"]*"\s*\/?>/i, `<link rel="canonical" href="${escape(canonical)}" />`);
  if (!seo) return result;
  if (path === "/nursery" || path === "/kindergarten" || path === "/programmes" || path === "/contact" || path === "/top-preschools-in-thane" || path === "/about" || path === "/play-school-near-me" || isBranchPage) result = result.replace('<html lang="en">', '<html lang="en-IN">');

  const updateMeta = (kind: "name" | "property", key: string, value: string) => {
    const tag = `<meta ${kind}="${key}" content="${escape(value)}" />`;
    const pattern = new RegExp(`<meta ${kind}="${key}" content="[^"]*"\\s*\\/?>`, "i");
    result = pattern.test(result)
      ? result.replace(pattern, tag)
      : result.replace("</head>", `    ${tag}\n</head>`);
  };
  result = result.replace(/<title>[^<]*<\/title>/i, `<title>${escape(seo.title)}</title>`);
  updateMeta("name", "description", seo.description);
  updateMeta("name", "robots", robots);
  updateMeta("property", "og:type", seo.ogType ?? "website");
  updateMeta("property", "og:url", canonical);
  updateMeta("property", "og:title", seo.title);
  updateMeta("property", "og:description", seo.description);
  updateMeta("property", "og:image", seo.ogImage ?? `${PREFERRED_DOMAIN}/og-image.jpg`);
  if (path === "/nursery" || path === "/kindergarten" || path === "/programmes" || path === "/contact" || path === "/top-preschools-in-thane" || path === "/about" || path === "/play-school-near-me" || isBranchPage) {
    updateMeta("property", "og:locale", "en_IN");
    updateMeta("property", "og:image:alt", isBranchPage ? seo.ogImageAlt ?? branchImageAlt : path === "/about" ? ABOUT_PAGE_COPY.ogImageAlt : path === "/top-preschools-in-thane" ? TOP_PRESCHOOLS_COPY.ogImageAlt : path === "/contact" ? CONTACT_PAGE_COPY.ogImageAlt : path === "/programmes" ? PROGRAMMES_COPY.ogImageAlt : path === "/kindergarten" ? KINDERGARTEN_COPY.ogImageAlt : path === "/play-school-near-me" ? seo.ogImageAlt ?? "" : NURSERY_COPY.ogImageAlt);
    updateMeta("property", "og:image:type", "image/jpeg");
    updateMeta("property", "og:image:width", "1200");
    updateMeta("property", "og:image:height", "630");
    updateMeta("name", "twitter:image:alt", isBranchPage ? seo.ogImageAlt ?? branchImageAlt : path === "/about" ? ABOUT_PAGE_COPY.ogImageAlt : path === "/top-preschools-in-thane" ? TOP_PRESCHOOLS_COPY.ogImageAlt : path === "/contact" ? CONTACT_PAGE_COPY.ogImageAlt : path === "/programmes" ? PROGRAMMES_COPY.ogImageAlt : path === "/kindergarten" ? KINDERGARTEN_COPY.ogImageAlt : path === "/play-school-near-me" ? seo.ogImageAlt ?? "" : NURSERY_COPY.ogImageAlt);
  }
  updateMeta("name", "twitter:url", canonical);
  updateMeta("name", "twitter:title", seo.title);
  updateMeta("name", "twitter:description", seo.description);
  updateMeta("name", "twitter:image", seo.ogImage ?? `${PREFERRED_DOMAIN}/og-image.jpg`);
  if (seo.keywords) {
    updateMeta("name", "keywords", seo.keywords);
  } else {
    result = result.replace(/\s*<meta name="keywords" content="[^"]*"\s*\/?>/i, "");
  }
  if (path === "/national-symbols-of-india-for-kids") return injectSymbolsDocument(result);
  if (path === "/about") {
    // Let the headline paint with its metric-compatible fallback before the
    // Poppins stylesheet arrives; loading an external font at highest
    // priority competes with the first paint on slow mobile connections.
    result = result.replace(/<link rel="preload" as="font" type="font\/woff2" crossorigin href="https:\/\/fonts\.gstatic\.com\/[^"]+">/, "");
    result = result.replaceAll(
      "family=Poppins:wght@600;700;800&display=optional",
      "family=Poppins:wght@700&display=swap",
    );
    result = result.replace("</head>", `<style>
      #about-initial{position:absolute;top:9rem;left:0;right:0;z-index:2;pointer-events:none;text-align:center;padding:0 1rem}
      #about-initial h1{font-family:Poppins,Inter,sans-serif;font-size:2.25rem;line-height:2.5rem;font-weight:700;margin:0 auto;max-width:56rem}
      @media(min-width:768px){#about-initial{top:12rem}#about-initial h1{font-size:3rem;line-height:1}}
      @media(min-width:1024px){#about-initial{top:14rem}#about-initial h1{font-size:3.75rem;line-height:1}}
    </style></head>`);
    result = result.replace('<div id="root"></div>', `<div id="about-initial"><h1 id="about-initial-h1">${escape(ABOUT_PAGE_COPY.heroHeading)}</h1></div><div id="root"></div>`);
  }
  if (path === "/play-school-near-me") {
    result = result.replace(/<template id="static-lcp-hero-template">[\s\S]*?<\/template>/i, "");
    // The page renderer is the sole source of visitor-visible hub content.
    // Keep it outside the app root so the hub controller can enhance the
    // existing DOM without replacing the stationary H1 or intro.
    result = result.replace(/<link\b(?=[^>]*rel="(?:preload|modulepreload)")(?=[^>]*(?:as="image"|rel="modulepreload"))[^>]*>/gi, "");
    // This route uses homepage weights 600/700, not its 800-weight preload.
    result = result.replace(/<link\b(?=[^>]*rel="preload")(?=[^>]*as="font")[^>]*>/gi, "");
    const deferredStyles: string[] = [];
    result = result.replace(/<link\b(?=[^>]*rel="stylesheet")(?=[^>]*href="(\/assets\/[^"]+\.css)")[^>]*>/gi,
      (tag, href: string) => {
        deferredStyles.push(href);
        return `<noscript>${tag}</noscript>`;
      });
    const stylesheetPath = resolve(process.cwd(), process.env.NODE_ENV === "production"
      ? "dist/public/styles/play-school-near-me.css"
      : "client/public/styles/play-school-near-me.css");
    const stylesheet = readFileSync(stylesheetPath, "utf8").replace(/<\/style/gi, "<\\/style");
    // Keep the common homepage font loading, with swap and the same local
    // size-adjusted Inter fallback. No page-specific downloadable faces.
    result = result.replace(/display=optional/g, "display=swap");
    result = result.replace("</head>", () => `<style data-near-me-css>
    @font-face{font-family:Inter;src:local(Arial),local("Helvetica Neue"),local(Helvetica);font-weight:400 600;font-style:normal;font-display:swap;size-adjust:107%;ascent-override:90%;descent-override:22%;line-gap-override:0%}
    ${stylesheet}</style></head>`);
    result = result.replace(/<script\b(?=[^>]*\btype="module")(?=[^>]*\bsrc="([^"]+)")[^>]*><\/script>/g,
      (_script, entry: string) => `<script type="module">requestAnimationFrame(()=>requestAnimationFrame(async()=>{await Promise.all(${JSON.stringify(deferredStyles)}.map(href=>new Promise((resolve,reject)=>{const link=document.createElement("link");link.rel="stylesheet";link.href=href;link.onload=resolve;link.onerror=reject;document.head.append(link)})));await import(${JSON.stringify(entry).replace(/</g, "\\u003c")})}));</script>`);
    result = result.replace('<div id="root"></div>', `<div id="root"></div>${renderPlaySchoolNearMeHtml()}<div id="near-me-footer"></div>`);
  }
  if (isBranchPage) {
    // Keep the text-led first paint stationary while React mounts.
    const initialId = path === "/preschool-in-anand-nagar-thane" ? "anand-initial" : path === "/preschool-in-kalwa-thane" ? "kalwa-initial" : path === "/preschool-in-hariniwas-thane" ? "hariniwas-initial" : path === "/preschool-in-dhokali-thane" ? "dhokali-initial" : path === "/preschool-in-kasarvadavali-thane" ? "kasarvadavali-initial" : "manpada-initial";
    const branchCopy = path === "/preschool-in-anand-nagar-thane" ? anandNagarPage : path === "/preschool-in-kalwa-thane" ? kalwaPage : path === "/preschool-in-hariniwas-thane" ? hariniwasPage : path === "/preschool-in-dhokali-thane" ? dhokaliPage : path === "/preschool-in-kasarvadavali-thane" ? kasarvadavaliPage : manpadaPage;
    result = result.replace(/<link rel="preload" as="font" type="font\/woff2" crossorigin href="https:\/\/fonts\.gstatic\.com\/[^"]+">/, "");
    result = result.replace("</head>", `<style>
      #${initialId}{position:absolute;z-index:2;top:12.1875rem;left:1rem;width:calc(100vw - 2rem);pointer-events:none}
      #${initialId} h1{font-family:Inter,"Open Sans",sans-serif;font-size:1.875rem;line-height:2.25rem;font-weight:700;letter-spacing:normal;margin:0 0 1.5rem}
      #${initialId} p{font-family:Inter,sans-serif;font-size:1.125rem;line-height:1.75rem;font-weight:600;margin:0;color:#334155}
      @media(min-width:640px){#${initialId}{top:12.1875rem;left:1.5rem;width:calc(100vw - 3rem)}}
      @media(min-width:768px){#${initialId}{top:14.625rem}#${initialId} h1{font-size:2.25rem;line-height:2.5rem}}
      @media(min-width:1024px){#${initialId}{top:14.6875rem;left:max(2rem,calc((100vw - 80rem)/2 + 2rem));width:calc((min(100vw,80rem) - 7rem)/2)}#${initialId} h1{font-size:3rem;line-height:1}}
    </style></head>`);
    result = result.replace('<div id="root"></div>', `<div id="${initialId}"><h1 id="${initialId}-h1">${escape(seo.h1 ?? "")}</h1><p>${escape(branchCopy.heroSubline)}</p></div><div id="root"></div>`);
  }
  if (path === "/playgroup" || path === "/nursery" || path === "/kindergarten") {
    // Keep the first-paint H1 as the LCP candidate after React mounts.
    const stationary = path !== "/playgroup";
    const copy = path === "/kindergarten" ? KINDERGARTEN_COPY : path === "/nursery" ? NURSERY_COPY : PLAYGROUP_COPY;
    const faqs = path === "/kindergarten"
      ? KINDERGARTEN_VISITOR_FAQS.map(faq => ({
          question: faq.question,
          answerSegments: faq.answerSegments ?? [{ text: faq.answer, href: undefined }],
        }))
      : path === "/nursery" ? NURSERY_FAQS : PLAYGROUP_FAQS;
    const id = path === "/kindergarten" ? "kindergarten-initial" : path === "/nursery" ? "nursery-initial" : "playgroup-initial";
    const initialHero = `<div id="${id}"><section><div class="${id}-inner"><span class="${id}-badge">${escape(copy.heroBadge)}</span><h1${stationary ? ` id="${id}-h1"` : ""}>${escape(copy.h1)}</h1><p>${escape(copy.heroSubline)}</p></div></section><div hidden aria-hidden="true">${faqs.map(faq => `<div><strong>${escape(faq.question)}</strong><p>${faq.answerSegments.map(segment => segment.href ? `<a href="${escape(segment.href)}">${escape(segment.text)}</a>` : escape(segment.text)).join("")}</p></div>`).join("")}</div></div>`;
    result = result.replace("</head>", `<style>
      #${id}{padding-top:5rem;font-family:Inter,system-ui,sans-serif}
      #${id} section{padding:4rem 0;background:linear-gradient(120deg,rgba(223,32,96,.1),rgba(255,193,7,.05),rgba(77,176,115,.1))}
      #${id} .${id}-inner{max-width:80rem;margin:auto;padding:0 1rem}
      #${id} .${id}-badge{display:inline-block;padding:.25rem 1rem;margin-bottom:1rem;border-radius:999px;font-size:1rem;background:#f3f4f6}
      #${id} h1{font-size:1.875rem;line-height:1.25;font-weight:700;margin:0 0 1.5rem;max-width:42rem}
      #${id} p{font-size:1.125rem;line-height:1.625;margin:0;max-width:42rem;color:#6b7280}
      @media(min-width:768px){#${id}{padding-top:6rem}#${id} section{padding:6rem 0}#${id} h1{font-size:2.25rem}#${id} p{font-size:1.25rem}}
      @media(min-width:1024px){#${id} section{padding:8rem 0}#${id} h1{font-size:3rem}}
      ${stationary ? `
        #${id}{position:absolute;inset:0 0 auto;z-index:2;pointer-events:none}
        #${id} .${id}-inner{position:relative;top:2px}
        #${id} h1{font-family:Poppins,Inter,sans-serif;line-height:1.2}
        @media(min-width:640px){#${id} .${id}-inner{padding:0 1.5rem}}
        @media(min-width:768px){#${id} h1{line-height:2.5rem;max-width:none}}
        @media(min-width:1024px){
          #${id} .${id}-inner{padding:0 2rem;top:40px}
          #${id} h1,#${id} p{max-width:calc((100% - 3rem)/2)}
          #${id} h1{line-height:1}
        }
        @media(min-width:1280px){#${id} .${id}-inner{top:78px}}
        #${id}.${path === "/nursery" ? "nursery" : "kindergarten"}-hydrated section{background:none}
        #${id}.${path === "/nursery" ? "nursery" : "kindergarten"}-hydrated .${id}-badge,
        #${id}.${path === "/nursery" ? "nursery" : "kindergarten"}-hydrated p{visibility:hidden}
      ` : ""}
    </style></head>`);
    result = result.replace('<div id="root"></div>', stationary
      ? `${initialHero}<div id="root"></div>`
      : `<div id="root">${initialHero}</div>`);
  }
  if (path === "/programmes") {
    const faqHtml = PROGRAMMES_FAQS.map(faq => `<div><strong>${escape(faq.question)}</strong><p>${faq.answerSegments.map(segment => "href" in segment ? `<a href="${escape(segment.href)}">${escape(segment.text)}</a>` : escape(segment.text)).join("")}</p></div>`).join("");
    result = result.replace("</head>", `<style>
      #programmes-initial{position:absolute;inset:0 0 auto;z-index:2;pointer-events:none;padding-top:5rem;font-family:Inter,system-ui,sans-serif}
      #programmes-initial section{padding:3rem 0;background:linear-gradient(120deg,rgba(223,32,96,.05),rgba(255,193,7,.05),rgba(77,176,115,.05))}
      #programmes-initial .programmes-initial-inner{max-width:80rem;margin:auto;padding:0 1rem;text-align:center}
      #programmes-initial h1{font-family:Poppins,Inter,sans-serif;font-size:1.875rem;line-height:2.25rem;font-weight:700;margin:0 0 1rem}
      #programmes-initial p{font-size:1rem;line-height:1.625;margin:0;color:#6b7280}
      @media(min-width:640px){#programmes-initial .programmes-initial-inner{padding:0 1.5rem}}
      @media(min-width:768px){#programmes-initial{padding-top:6rem}#programmes-initial section{padding:4rem 0}#programmes-initial h1{font-size:2.25rem;line-height:2.5rem}#programmes-initial p{font-size:1.125rem}}
      @media(min-width:1024px){#programmes-initial section{padding:5rem 0}}
      #programmes-initial.programmes-hydrated section{background:none}
      #programmes-initial.programmes-hydrated p{visibility:hidden}
    </style></head>`);
    result = result.replace('<div id="root"></div>', `<div id="programmes-initial"><section><div class="programmes-initial-inner"><h1 id="programmes-initial-h1">${escape(PROGRAMMES_COPY.h1)}</h1><p>${escape(PROGRAMMES_VISITOR_COPY.intro ?? "")}</p></div></section><div id="programmes-initial-faq" hidden aria-hidden="true">${faqHtml}</div></div><div id="root"></div>`);
  }
  if (path === "/contact") {
    result = result.replace("</head>", `<style>
      #contact-initial{position:absolute;inset:0 0 auto;z-index:2;pointer-events:none;padding-top:5rem;font-family:Inter,system-ui,sans-serif}
      #contact-initial section{padding:6rem 0;background:linear-gradient(120deg,rgba(223,32,96,.05),rgba(255,193,7,.05),rgba(77,176,115,.05))}
      #contact-initial .contact-initial-inner{max-width:80rem;margin:auto;padding:0 1rem;text-align:center}
      #contact-initial h1{font-family:Poppins,Inter,sans-serif;font-size:2.25rem;line-height:2.5rem;font-weight:700;margin:0 0 1.5rem}
      #contact-initial p{font-size:1.125rem;line-height:1.625;margin:0;color:#6b7280;pointer-events:auto}
      #contact-initial p a{color:inherit;text-decoration:none}
      #contact-initial p a:hover{color:#df2060}
      @media(min-width:640px){#contact-initial .contact-initial-inner{padding:0 1.5rem}}
      @media(min-width:768px){#contact-initial{padding-top:6rem}#contact-initial section{padding:8rem 0}#contact-initial h1{font-size:3rem;line-height:1}}
      @media(min-width:1024px){#contact-initial section{padding:10rem 0}}
      #contact-initial.contact-hydrated section{background:none}
    </style></head>`);
    const linkedIntro = CONTACT_PAGE_COPY.introSegments.map(segment => "href" in segment
      ? `<a href="${escape(segment.href)}">${escape(segment.text)}</a>`
      : escape(segment.text)).join("");
    result = result.replace('<div id="root"></div>', `<div id="contact-initial"><section><div class="contact-initial-inner"><h1 id="contact-initial-h1">${escape(CONTACT_PAGE_COPY.h1)}</h1><p>${linkedIntro}</p></div></section></div><div id="root"></div>`);
  }
  if (path === "/top-preschools-in-thane") {
    // Only this comparison route needs Poppins 700 above the fold; keep the
    // existing font families, and use swap so text stays visible while loading.
    result = result.replaceAll(
      "family=Poppins:wght@600;700;800&display=optional",
      "family=Poppins:wght@700&display=swap",
    );
    result = result.replace("</head>", `<style>
      #top-preschools-initial{position:relative;padding-top:5rem;font-family:Inter,system-ui,sans-serif}
      #top-preschools-initial section{max-width:64rem;margin:auto;padding:3rem 1rem;text-align:center}
      #top-preschools-initial .comparison-badge{display:inline-block;padding:.375rem 1rem;background:#fef2f2;color:#dc2626;font-size:.875rem;font-weight:600;border-radius:9999px;margin-bottom:1rem}
      #top-preschools-initial h1{font-family:Poppins,Inter,sans-serif;font-size:1.875rem;line-height:2.25rem;font-weight:700;color:#111827;margin:0 0 1rem}
      #top-preschools-initial p{font-size:1.125rem;line-height:1.75rem;color:#6b7280;max-width:42rem;margin:0 auto}
      @media(min-width:640px){#top-preschools-initial section{padding:4rem 1rem 3rem}#top-preschools-initial h1{font-size:2.25rem;line-height:2.5rem}}
    </style></head>`);
    result = result.replace('<div id="root"></div>', `<div id="top-preschools-initial"><section><span class="comparison-badge">${escape(TOP_PRESCHOOLS_COPY.badge)}</span><h1 id="top-preschools-initial-h1">${escape(TOP_PRESCHOOLS_COPY.h1)}</h1><p>${escape(TOP_PRESCHOOLS_COPY.introduction)}</p></section></div><div id="root"></div>`);
  }
  return result;
}