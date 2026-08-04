/**
 * Standalone ad landing-page guard (predeploy, HTTP + build-artifact).
 *
 * /ad-mtpg is a static HTML page served outside the SPA. During its
 * conversion two production-only breakages slipped through dev testing:
 * the HTML wasn't copied into the build artifact, and a referenced image
 * existed only in the source-root public/ (not the Vite-published
 * client/public/) — both 404'd in production while looking fine in dev.
 *
 * For each standalone ad page this script asserts, against the PRODUCTION
 * build + booted production server:
 *
 *   1. The HTML artifact exists in dist/ad-assets/ (script/build.ts copy step
 *      ran) and matches the source file in public/.
 *   2. Every local asset the HTML references (img src, favicon, preload
 *      images) exists in the Vite-published output dist/public/.
 *   3. The route returns HTTP 200 with text/html for a normal browser UA.
 *   4. The route returns HTTP 200 for a Googlebot UA (bot-SSR must not
 *      intercept and 404 it).
 *   5. The served HTML contains no unresolved FIREBASE_* placeholders —
 *      i.e. server-side env injection actually ran AND the env vars were
 *      present (an empty replacement like apiKey: "" also fails).
 *
 * Usage: tsx scripts/check-ad-pages.ts <base-url>
 * Exits non-zero on any failure — wired into scripts/predeploy.sh so a
 * broken ad page blocks the deploy.
 */

import { existsSync, readFileSync } from "fs";
import { join, resolve } from "path";

const ROOT = process.cwd();

/** Standalone ad pages served by dedicated Express routes. */
const AD_PAGES: Array<{
  route: string;
  sourceHtml: string; // repo-relative source file
  distHtml: string; // repo-relative build artifact
}> = [
  {
    route: "/ad-mtpg",
    sourceHtml: "public/ad-mtpg.html",
    distHtml: "dist/ad-assets/ad-mtpg.html",
  },
];

const NORMAL_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";
const GOOGLEBOT_UA =
  "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";

const FIREBASE_PLACEHOLDERS = [
  "FIREBASE_API_KEY",
  "FIREBASE_AUTH_DOMAIN",
  "FIREBASE_PROJECT_ID",
  "FIREBASE_APP_ID",
];

const BASE_URL = (process.argv[2] || "").replace(/\/$/, "");
if (!BASE_URL) {
  console.error("Usage: tsx scripts/check-ad-pages.ts <base-url>");
  process.exit(2);
}

let failures = 0;
function fail(msg: string) {
  failures++;
  console.error(`  ✗ ${msg}`);
}
function ok(msg: string) {
  console.log(`  ✓ ${msg}`);
}

/**
 * Extract root-relative local asset URLs referenced by the HTML:
 * <img src="/...">, <link href="/..."> (favicon), and
 * <link rel="preload" as="image" href="/...">. External URLs and
 * data: URIs are ignored.
 */
function localAssetRefs(html: string): string[] {
  const refs = new Set<string>();
  const attrRe = /(?:src|href)\s*=\s*"(\/[^"]+)"/gi;
  let m: RegExpExecArray | null;
  while ((m = attrRe.exec(html)) !== null) {
    const url = m[1].split(/[?#]/)[0];
    // Only file-like assets (have an extension); skip route links like "/".
    if (/\.[a-z0-9]+$/i.test(url)) refs.add(url);
  }
  return [...refs];
}

async function fetchPage(
  url: string,
  ua: string,
): Promise<{ status: number; contentType: string; body: string }> {
  const res = await fetch(url, {
    headers: { "User-Agent": ua },
    redirect: "manual",
  });
  return {
    status: res.status,
    contentType: res.headers.get("content-type") || "",
    body: await res.text(),
  };
}

async function main() {
  for (const page of AD_PAGES) {
    console.log(`\nChecking standalone ad page ${page.route} ...`);

    // ── 1. Build artifact exists in dist/ad-assets/ ─────────────────────────
    const distPath = resolve(ROOT, page.distHtml);
    const srcPath = resolve(ROOT, page.sourceHtml);
    if (!existsSync(distPath)) {
      fail(
        `${page.distHtml} missing — script/build.ts did not copy ${page.sourceHtml} into the build artifact. In production the server would fall back to a path that may not exist.`,
      );
    } else {
      ok(`${page.distHtml} exists in build artifact`);
      if (existsSync(srcPath)) {
        const distHtml = readFileSync(distPath, "utf8");
        const srcHtml = readFileSync(srcPath, "utf8");
        if (distHtml !== srcHtml) {
          fail(
            `${page.distHtml} differs from ${page.sourceHtml} — stale build artifact; re-run npm run build.`,
          );
        } else {
          ok(`${page.distHtml} matches source ${page.sourceHtml}`);
        }
      }
    }

    // ── 2. Every referenced local asset exists in dist/public ───────────────
    const htmlForAssets = existsSync(distPath)
      ? readFileSync(distPath, "utf8")
      : existsSync(srcPath)
        ? readFileSync(srcPath, "utf8")
        : null;
    if (htmlForAssets === null) {
      fail(`Cannot read HTML for ${page.route} from dist or source.`);
    } else {
      const refs = localAssetRefs(htmlForAssets);
      let missing = 0;
      for (const ref of refs) {
        const assetPath = join(ROOT, "dist", "public", ...ref.split("/").filter(Boolean));
        if (!existsSync(assetPath)) {
          missing++;
          fail(
            `Referenced asset ${ref} is NOT in dist/public — it would 404 in production. Ensure the file lives under client/public/ (the Vite root), not only in the source-root public/.`,
          );
        }
      }
      if (missing === 0) {
        ok(`All ${refs.length} referenced local assets exist in dist/public`);
      }
    }

    // ── 3–5. HTTP checks against the booted production server ───────────────
    const url = `${BASE_URL}${page.route}`;
    for (const [label, ua] of [
      ["normal browser UA", NORMAL_UA],
      ["Googlebot UA", GOOGLEBOT_UA],
    ] as const) {
      try {
        const res = await fetchPage(url, ua);
        if (res.status !== 200) {
          fail(
            `${page.route} returned ${res.status} for ${label} (expected 200).${label.includes("Googlebot") ? " Bot-SSR may be intercepting the route — the ad-page handler must be registered before setupBotSSR, or the slug must be passed through." : ""}`,
          );
          continue;
        }
        if (!res.contentType.includes("text/html")) {
          fail(
            `${page.route} for ${label}: unexpected Content-Type "${res.contentType}" (expected text/html).`,
          );
          continue;
        }
        ok(`${page.route} → 200 text/html for ${label}`);
        const leftover = FIREBASE_PLACEHOLDERS.filter((p) =>
          res.body.includes(`"${p}"`),
        );
        if (leftover.length > 0) {
          fail(
            `${page.route} (${label}): unresolved Firebase placeholder(s) in served HTML: ${leftover.join(", ")} — config injection did not run.`,
          );
        } else if (/:\s*""/.test(res.body.match(/firebaseConfig\s*=\s*\{[\s\S]*?\}/)?.[0] || "")) {
          fail(
            `${page.route} (${label}): firebaseConfig contains an empty value — a VITE_FIREBASE_* env var is missing in this environment.`,
          );
        } else {
          ok(`Firebase config fully injected (no placeholders, no empty values)`);
        }
      } catch (err) {
        fail(`${page.route} fetch failed for ${label}: ${err}`);
      }
    }
  }

  if (failures > 0) {
    console.error(`\ncheck-ad-pages: ${failures} failure(s). Blocking deploy.`);
    process.exit(1);
  }
  console.log(`\ncheck-ad-pages: all checks passed.`);
}

main().catch((err) => {
  console.error("check-ad-pages crashed:", err);
  process.exit(1);
});
