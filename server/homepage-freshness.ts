/**
 * Homepage JSON-LD injection for the initial visitor HTML shell.
 *
 * The homepage React components add schemas after hydration, so include the
 * same shared WebPage, Organization and centre schemas in raw HTML too.
 */
import { HOMEPAGE_STRUCTURED_DATA } from "../shared/homepage-schema";

/**
 * If `urlPath` is exactly "/", inject the reusable homepage schemas before
 * </head>. All other paths are returned unchanged.
 */
export function injectHomepageFreshness(urlPath: string, html: string): string {
  if (urlPath !== "/") return html;

  const schemaScripts = HOMEPAGE_STRUCTURED_DATA
    .map((schema, index) => `<script id="homepage-schema-${index}" type="application/ld+json">${JSON.stringify(schema)}</script>`)
    .join("\n");
  return html.includes("</head>")
    ? html.replace("</head>", `${schemaScripts}\n</head>`)
    : html;
}
