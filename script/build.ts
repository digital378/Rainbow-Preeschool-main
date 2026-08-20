import { build as esbuild } from "esbuild";
import { build as viteBuild } from "vite";
import { rm, readFile, cp, readdir, mkdir } from "fs/promises";
import { existsSync } from "fs";
import { resolve } from "path";

// server deps to bundle to reduce openat(2) syscalls
// which helps cold start times
const allowlist = [
  "@google/generative-ai",
  "axios",
  "connect-pg-simple",
  "cors",
  "date-fns",
  "drizzle-orm",
  "drizzle-zod",
  "express",
  "express-rate-limit",
  "express-session",
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
  await rm("dist", { recursive: true, force: true });

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
}

buildAll().catch((err) => {
  console.error(err);
  process.exit(1);
});
