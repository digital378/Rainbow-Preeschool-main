#!/usr/bin/env tsx
/**
 * Sitemap dump (optional, for local inspection / one-off snapshots only).
 *
 * The live /sitemap.xml is generated on-the-fly by the Express handler in
 * `server/index.ts` from `shared/sitemap-entries.ts`, so there is normally NO need to run this
 * script — the deploy serves the dynamic version directly.
 *
 * Use this only when you want a static .xml on disk to diff or share. The
 * output contains only the curated non-blog entries; the live server also
 * includes published blog posts and surviving legacy pages.
 *
 * Run:  npx tsx scripts/generate-sitemap.ts [output-path]
 */

import * as fs from "fs";
import * as path from "path";

import { buildSitemapXml, SITEMAP_ENTRIES } from "../shared/sitemap-entries";

const outputPath =
  process.argv[2] ?? path.join(process.cwd(), "sitemap.generated.xml");

const xml = buildSitemapXml();
fs.writeFileSync(outputPath, xml);

console.log("Sitemap dumped successfully.");
console.log(`Location:   ${outputPath}`);
console.log(`Total URLs: ${SITEMAP_ENTRIES.length}`);
console.log("<lastmod>:  only on entries with verified update dates");
console.log("");
console.log(
  "Note: this file is NOT served by the app. /sitemap.xml is generated dynamically.",
);
