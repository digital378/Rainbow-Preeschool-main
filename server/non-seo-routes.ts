/**
 * Server-registered routes that serve real content but intentionally have
 * no entry in `server/ssr-pages.ts`. This includes fast-loading ad-campaign
 * HTML and standalone pages that carry their own complete SEO metadata.
 *
 * Why this file exists: `server/bot-ssr.ts` intercepts requests BEFORE
 * `registerRoutes()` (server/routes.ts) registers these handlers. Any
 * request classified as "not a real browser" (named bots, and — since the
 * accurate-metadata fix — any generic/unrecognized User-Agent) would
 * otherwise be told these real routes are a 404 before ever reaching the
 * actual handler. This list lets `bot-ssr.ts` pass those requests through,
 * and lets `isKnownRoute()` (server/ssr-pages.ts) agree that the route is
 * real when deciding the UA-independent HTTP status in `server/static.ts`
 * and `server/vite.ts`.
 *
 * Keep in sync with `server/routes.ts`: add an entry here whenever you
 * register a new non-`/api/` GET (or other verb) route that isn't backed by
 * an `ssr-pages.ts` entry.
 */
export const NON_SEO_SERVER_ROUTES: string[] = [
  "/playgroup-fast",
  "/nursery-fast",
  "/kindergarten-fast",
  "/daycare-fast",
  "/raksha-bandhan-redesign",
  "/raksha-bandhan-redesign/",
];

/**
 * True for the exact paths above, plus the `/xrdb` GTM beacon endpoints
 * (`/xrdb` and any `/xrdb/*` sub-path) which are handled by a wildcard route
 * rather than a fixed list of exact paths.
 */
export function isNonSeoServerRoute(urlPath: string): boolean {
  if (NON_SEO_SERVER_ROUTES.includes(urlPath)) return true;
  if (urlPath === "/xrdb" || urlPath.startsWith("/xrdb/")) return true;
  return false;
}
