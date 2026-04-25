import { legacyPagesData } from "@shared/legacy-pages-data";
import { shouldNoIndex } from "@shared/seo-config";
import type { SitemapEntry } from "@shared/sitemap-entries";
import { redirectMap } from "./redirects";

/**
 * Build a `SitemapEntry[]` for the legacy WordPress-era pages that are
 * STILL LIVE — i.e. every entry in `legacyPagesData` whose slug does not
 * 301-redirect via `server/redirects.ts` and is not flagged
 * `shouldNoIndex()`. Because the filter consults the live redirect map at
 * request-time, adding a new entry to `redirectMap` (or the periodic
 * Wave-N soft-duplicate sweep) automatically removes the corresponding URL
 * from `/sitemap.xml` on the next request — no separate edit is required
 * to keep the sitemap free of "URL is in sitemap but redirects" warnings
 * in Google Search Console.
 *
 * Slugs are normalised by stripping the trailing slash before checking
 * both forms (`/foo` and `/foo/`) against the redirect map, mirroring the
 * normalisation the redirect middleware itself does.
 */
export function getLiveLegacySitemapEntries(): SitemapEntry[] {
  const entries: SitemapEntry[] = [];
  const seen = new Set<string>();

  for (const rawSlug of Object.keys(legacyPagesData)) {
    const slug = rawSlug.endsWith("/") && rawSlug.length > 1
      ? rawSlug.slice(0, -1)
      : rawSlug;

    if (seen.has(slug)) continue;
    seen.add(slug);

    if (redirectMap[slug] || redirectMap[`${slug}/`]) continue;
    if (shouldNoIndex(slug)) continue;

    entries.push({
      url: slug,
      priority: 0.5,
      changefreq: "monthly",
    });
  }

  return entries;
}
