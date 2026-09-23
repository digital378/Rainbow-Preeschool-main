import { shouldNoIndex, PREFERRED_DOMAIN } from "@shared/seo-config";
import { getPageSEO } from "./ssr-pages";

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
  return result;
}