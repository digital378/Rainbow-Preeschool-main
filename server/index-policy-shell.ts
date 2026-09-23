import { shouldNoIndex, PREFERRED_DOMAIN } from "@shared/seo-config";
import { getPageSEO } from "./ssr-pages";

/**
 * Give the named noindex pages the same initial metadata for browsers and
 * bots, before the SPA has a chance to hydrate. Other SPA routes retain their
 * existing shell behavior.
 */
export function injectIndexPolicyShell(path: string, html: string): string {
  if (path !== "/terms" && path !== "/privacy" && !shouldNoIndex(path)) {
    return html;
  }

  const canonical = getPageSEO(path)?.canonical ?? `${PREFERRED_DOMAIN}${path}`;
  return html
    .replace(
      /<meta name="robots" content="[^"]*"\s*\/?>/i,
      '<meta name="robots" content="noindex, nofollow" />',
    )
    .replace(
      /<link rel="canonical" href="[^"]*"\s*\/?>/i,
      `<link rel="canonical" href="${canonical}" />`,
    );
}