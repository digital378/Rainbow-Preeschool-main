#!/usr/bin/env tsx
/**
 * Sitemap dump (optional, for local inspection / one-off snapshots only).
 *
 * The live /sitemap.xml is generated on-the-fly by the Express handler in
 * `server/index.ts` from `shared/sitemap-entries.ts` + `LAST_UPDATED_ISO` in
 * `shared/site-freshness.ts`, so there is normally NO need to run this
 * script — the deploy serves the dynamic version directly.
 *
 * Use this only when you want a static .xml on disk to diff or share. The
 * output is identical to what the running server would emit for the current
 * value of `LAST_UPDATED_ISO`.
 *
 * Run:  npx tsx scripts/generate-sitemap.ts [output-path]
 */

import * as fs from "fs";
import * as path from "path";

import { buildSitemapXml, SITEMAP_ENTRIES } from "../shared/sitemap-entries";
import { LAST_UPDATED_ISO } from "../shared/site-freshness";

const outputPath =
  process.argv[2] ?? path.join(process.cwd(), "sitemap.generated.xml");

const xml = buildSitemapXml();
fs.writeFileSync(outputPath, xml);

console.log("Sitemap dumped successfully.");
console.log(`Location:   ${outputPath}`);
console.log(`Total URLs: ${SITEMAP_ENTRIES.length}`);
console.log(`<lastmod>:  ${LAST_UPDATED_ISO} (from shared/site-freshness.ts)`);
console.log("");
console.log(
  "Note: this file is NOT served by the app. /sitemap.xml is generated dynamically.",
);
