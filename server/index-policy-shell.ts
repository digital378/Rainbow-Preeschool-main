import { shouldNoIndex, PREFERRED_DOMAIN } from "@shared/seo-config";
import { getPageSEO } from "./ssr-pages";
import { PLAYGROUP_COPY } from "@shared/playgroup-page-content";
import { PLAYGROUP_FAQS } from "@shared/playgroup-faq-data";

/**
 * Keep the browser's initial document metadata aligned with bot SSR and the
 * hydrated route. The SPA still renders the body; this only corrects the head
 * before JavaScript runs. Leave the homepage's separately maintained shell
 * and its freshness injection untouched.
 */
export function injectIndexPolicyShell(path: string, html: string): string {
  if (path === "/") return html;
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
  updateMeta("name", "twitter:url", canonical);
  updateMeta("name", "twitter:title", seo.title);
  updateMeta("name", "twitter:description", seo.description);
  updateMeta("name", "twitter:image", seo.ogImage ?? `${PREFERRED_DOMAIN}/og-image.jpg`);
  if (seo.keywords) {
    updateMeta("name", "keywords", seo.keywords);
  } else {
    result = result.replace(/\s*<meta name="keywords" content="[^"]*"\s*\/?>/i, "");
  }
  if (path === "/playgroup") {
    // The SPA replaces this route-specific first-paint markup on mount. The
    // H1 is visible immediately even on a slow connection; it has no entrance
    // animation, and the hydrated component retains its existing styling.
    const initialHero = `<div id="playgroup-initial"><section><div class="playgroup-initial-inner"><span class="playgroup-initial-badge">${PLAYGROUP_COPY.heroBadge}</span><h1>${PLAYGROUP_COPY.h1}</h1><p>${PLAYGROUP_COPY.heroSubline}</p></div></section><div hidden aria-hidden="true">${PLAYGROUP_FAQS.map(faq => `<div><strong>${escape(faq.question)}</strong><p>${faq.answerSegments.map(segment => segment.href ? `<a href="${escape(segment.href)}">${escape(segment.text)}</a>` : escape(segment.text)).join("")}</p></div>`).join("")}</div></div>`;
    result = result.replace("</head>", `<style>
      #playgroup-initial{padding-top:5rem;font-family:Inter,system-ui,sans-serif}
      #playgroup-initial section{padding:4rem 0;background:linear-gradient(120deg,rgba(223,32,96,.1),rgba(255,193,7,.05),rgba(77,176,115,.1))}
      #playgroup-initial .playgroup-initial-inner{max-width:80rem;margin:auto;padding:0 1rem}
      #playgroup-initial .playgroup-initial-badge{display:inline-block;padding:.25rem 1rem;margin-bottom:1rem;border-radius:999px;font-size:1rem;background:#f3f4f6}
      #playgroup-initial h1{font-size:1.875rem;line-height:1.25;font-weight:700;margin:0 0 1.5rem;max-width:42rem}
      #playgroup-initial p{font-size:1.125rem;line-height:1.625;margin:0;max-width:42rem;color:#6b7280}
      @media(min-width:768px){#playgroup-initial{padding-top:6rem}#playgroup-initial section{padding:6rem 0}#playgroup-initial h1{font-size:2.25rem}#playgroup-initial p{font-size:1.25rem}}
      @media(min-width:1024px){#playgroup-initial section{padding:8rem 0}#playgroup-initial h1{font-size:3rem}}
    </style></head>`);
    result = result.replace('<div id="root"></div>', `<div id="root">${initialHero}</div>`);
  }
  return result;
}