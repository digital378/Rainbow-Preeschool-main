/**
 * Homepage freshness injection
 *
 * The homepage ("/") is served as the React SPA to all visitors — bot SSR is
 * intentionally bypassed there so Googlebot executes JavaScript and indexes
 * the live page. However, the client-side EEATSignals component and SEO
 * Article JSON-LD are injected via useEffect and therefore absent from the
 * raw HTML shell that curl/fetch sees before JS runs.
 *
 * This module injects the same signals directly into the HTML shell so that:
 *   1. check-freshness-signal.ts (which uses fetch() without JS) can verify
 *      the homepage carries the required freshness markers.
 *   2. Bots that do NOT execute JavaScript still pick up the Article JSON-LD
 *      and the E-E-A-T reviewer byline.
 *   3. Regular users are unaffected — the hidden <div> is invisible and
 *      React's EEATSignals component renders the visible byline on hydration.
 *
 * Both the Article schema and the hidden byline text are derived from
 * shared/site-freshness.ts, so a single monthly bump to LAST_UPDATED_ISO /
 * LAST_UPDATED_DISPLAY updates every copy automatically.
 */

import { LAST_UPDATED_ISO, LAST_UPDATED_DISPLAY } from "../shared/site-freshness";

const BASE_URL = "https://www.rainbowpreschools.com";

function buildArticleScript(): string {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Rainbow Preschool International — Preschool Chain in Thane Since 2007",
    "datePublished": "2024-06-01",
    "dateModified": LAST_UPDATED_ISO,
    "author": {
      "@type": "Organization",
      "name": "Rainbow Preschool Curriculum Team",
      "parentOrganization": {
        "@type": "Organization",
        "name": "Rainbow Preschool International",
      },
    },
    "reviewedBy": {
      "@type": "Organization",
      "name": "Rainbow Preschool Curriculum Team",
      "parentOrganization": {
        "@type": "Organization",
        "name": "Rainbow Preschool International",
      },
    },
    "publisher": {
      "@type": "Organization",
      "name": "Rainbow Preschool International",
      "logo": {
        "@type": "ImageObject",
        "url": `${BASE_URL}/images/optimized/logo.webp`,
      },
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${BASE_URL}/`,
    },
    "inLanguage": "en-IN",
  };
  return `<script type="application/ld+json">${JSON.stringify(schema)}</script>`;
}

function buildBylineDiv(): string {
  return `<div style="display:none" aria-hidden="true">Reviewed by Rainbow Preschool Curriculum Team \u2014 Last updated: ${LAST_UPDATED_DISPLAY}</div>`;
}

/**
 * If `urlPath` is exactly "/", injects:
 *   • An Article JSON-LD <script> before </head>
 *   • A hidden byline <div> before </body>
 * For any other path the HTML is returned unchanged.
 */
export function injectHomepageFreshness(urlPath: string, html: string): string {
  if (urlPath !== "/") return html;

  let result = html;

  const articleScript = buildArticleScript();
  if (result.includes("</head>")) {
    result = result.replace("</head>", `${articleScript}\n</head>`);
  }

  const bylineDiv = buildBylineDiv();
  if (result.includes("</body>")) {
    result = result.replace("</body>", `${bylineDiv}\n</body>`);
  }

  return result;
}
