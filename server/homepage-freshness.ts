/**
 * Homepage freshness injection
 *
 * Inject the homepage WebPage freshness signal into the visitor shell for
 * clients that inspect raw HTML before React hydrates.
 *
 * This module injects the same signals directly into the HTML shell so that:
 *   1. check-freshness-signal.ts (which uses fetch() without JS) can verify
 *      the homepage carries the required freshness markers.
 *   2. Bots that do NOT execute JavaScript still see WebPage dateModified.
 * The homepage has dedicated WebPage/organization/preschool structured data;
 * it must not receive generic Article markup.
 *
 * The release date and schema are derived from shared/homepage-content.ts.
 */

import { HOME_STRUCTURED_DATA } from "../shared/homepage-content";

function buildWebPageScript(): string {
  const schema = HOME_STRUCTURED_DATA.find((entry) => entry["@type"] === "WebPage");
  if (!schema) throw new Error("Homepage WebPage structured data is missing");
  return `<script type="application/ld+json">${JSON.stringify(schema)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")}</script>`;
}

/**
 * If `urlPath` is exactly "/", injects:
 *   • The homepage WebPage JSON-LD (including dateModified) before </head>
 * For any other path the HTML is returned unchanged.
 */
export function injectHomepageFreshness(urlPath: string, html: string): string {
  if (urlPath !== "/") return html;

  let result = html;

  // React may already have rendered the homepage schema into this shell.
  // Avoid duplicating its WebPage entry; the visitor and bot paths use the
  // same schema source and release date.
  const hasWebPageSchema = /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?"@type"\s*:\s*(?:"WebPage"|\[[^\]]*"WebPage")/i.test(result);
  if (!hasWebPageSchema && result.includes("</head>")) {
    result = result.replace("</head>", `${buildWebPageScript()}\n</head>`);
  }

  return result;
}
