import { build as esbuild } from "esbuild";
import { build as viteBuild } from "vite";
import { rm, readFile, cp, readdir, mkdir } from "fs/promises";
import { existsSync } from "fs";
import { resolve } from "path";
import {
  validateStaticAdTracking,
  validateStaticAdTrackingCoverage,
  type StaticAdTrackingRequirements,
} from "../scripts/static-ad-tracking";

const staticAdConversionEvents = [
  "google_ads_leads",
  "google_ads_call",
  "google_ads_whatsapp",
];

const staticAdPages: StaticAdTrackingRequirements[] = [
  {
    file: "public/ad-mtpg.html",
    pagePath: "/ad-mtpg",
    measurementId: "G-G1MX1N0M05",
    pageViewConfigIds: ["G-G1MX1N0M05"],
    conversionEvents: staticAdConversionEvents,
  },
  {
    file: "public/ad-google.html",
    pagePath: "/ad-google",
    measurementId: "G-G1MX1N0M05",
    pageViewConfigIds: ["GT-55BFZCQT", "G-G1MX1N0M05"],
    conversionEvents: staticAdConversionEvents,
  },
];

async function checkStaticAdTracking() {
  const discoveredFiles = (await readdir("public"))
    .filter((file) => /^ad-.+\.html$/.test(file))
    .map((file) => `public/${file}`)
    .sort();
  validateStaticAdTrackingCoverage(discoveredFiles, staticAdPages);

  for (const page of staticAdPages) {
    const html = await readFile(page.file, "utf-8");
    validateStaticAdTracking(html, page);
  }
  console.log("static ad tracking check passed.");
}

// server deps to bundle to reduce openat(2) syscalls
// which helps cold start times
const allowlist = [
  "@google/generative-ai",
  "@replit/connectors-sdk",
  "axios",
  "compression",
  "connect-pg-simple",
  "cors",
  "date-fns",
  "drizzle-orm",
  "drizzle-zod",
  "express",
  "express-rate-limit",
  "express-session",
  "googleapis",
  "jsonwebtoken",
  "memorystore",
  "multer",
  "nanoid",
  "nodemailer",
  "openai",
  "passport",
  "passport-local",
  "pg",
  "stripe",
  "uuid",
  "ws",
  "zod",
  "zod-validation-error",
];

async function buildAll() {
  await checkStaticAdTracking();
  await rm("dist", { recursive: true, force: true });

  // The same immutable date is embedded in the client and server bundles.
  // A later publish rebuilds both, so the reviewer credit reflects that publish.
  const publishDate = new Date().toISOString().slice(0, 10);
  process.env.HOME_PUBLISH_DATE = publishDate;

  console.log("building client...");
  await viteBuild();

  console.log("building server...");
  const pkg = JSON.parse(await readFile("package.json", "utf-8"));
  const allDeps = [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.devDependencies || {}),
  ];
  const externals = allDeps.filter((dep) => !allowlist.includes(dep));

  await esbuild({
    entryPoints: ["server/index.ts"],
    platform: "node",
    bundle: true,
    format: "cjs",
    outfile: "dist/index.cjs",
    define: {
      "process.env.NODE_ENV": '"production"',
      __HOME_PUBLISH_DATE__: JSON.stringify(publishDate),
    },
    minify: true,
    external: externals,
    logLevel: "info",
  });

  // Copy standalone HTML blog pages into dist/blog-assets/ so they are
  // co-located with the compiled server bundle and are reachable regardless
  // of the runtime working directory (process.cwd() can differ between the
  // build container and the production Cloud Run container).
  const blogPagesDir = resolve("blog-pages");
  if (existsSync(blogPagesDir)) {
    console.log("copying blog-pages → dist/blog-assets ...");
    await cp(blogPagesDir, resolve("dist", "blog-assets"), { recursive: true });
    console.log("done.");
  }

  // Copy standalone ad landing HTML into dist/ad-assets/ for the same reason:
  // server/index.ts resolves it relative to the compiled bundle first.
  const adMtpgHtml = resolve("public", "ad-mtpg.html");
  if (existsSync(adMtpgHtml)) {
    console.log("copying ad-mtpg.html → dist/ad-assets ...");
    await cp(adMtpgHtml, resolve("dist", "ad-assets", "ad-mtpg.html"));
    console.log("done.");
  }

  // The Raksha Bandhan article is served directly by server/routes.ts, so carry
  // only its HTML and WebP artwork into the production bundle. The authoring
  // PNGs are intentionally excluded: they are far larger than the responsive assets.
  const rakhiTrailDir = resolve("public", "raksha-bandhan-redesign");
  if (existsSync(rakhiTrailDir)) {
    const outputDir = resolve("dist", "raksha-bandhan-redesign");
    await mkdir(outputDir, { recursive: true });
    const trailFiles = await readdir(rakhiTrailDir);
    for (const fileName of trailFiles) {
      if (fileName === "index.html" || fileName.endsWith(".webp")) {
        await cp(resolve(rakhiTrailDir, fileName), resolve(outputDir, fileName));
      }
    }
    console.log("copied Raksha Bandhan article HTML + WebP assets.");
  }

  // Copy the Janmashtami standalone article and its generated artwork into
  // the production bundle. The source directory also contains JPG/SVG
  // fallbacks and the printable colouring-page PDF.
  const janmashtamiDir = resolve("public", "janmashtami-for-kids");
  if (existsSync(janmashtamiDir)) {
    await cp(janmashtamiDir, resolve("dist", "janmashtami-for-kids"), {
      recursive: true,
    });
    console.log("copied Janmashtami article HTML + artwork.");
  }
}

buildAll().catch((err) => {
  console.error(err);
  process.exit(1);
});
