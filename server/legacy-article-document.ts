import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { getLegacyPageData } from "@shared/legacy-pages-data";
import { renderLegacyLandingPage } from "./legacy-page-render";

type ManifestEntry = { file: string; css?: string[]; imports?: string[]; isEntry?: boolean };
type Manifest = Record<string, ManifestEntry>;
let cachedManifest: Manifest | undefined;
let cachedStyles: string | undefined;

function buildDirectory() {
  return process.env.NODE_ENV === "production"
    ? resolve(__dirname, "public") : resolve(process.cwd(), "dist/public");
}

function manifest(): Manifest {
  if (cachedManifest && process.env.NODE_ENV === "production") return cachedManifest;
  return cachedManifest = JSON.parse(readFileSync(resolve(buildDirectory(), ".vite/manifest.json"), "utf8"));
}

function styles(): string {
  if (cachedStyles !== undefined && process.env.NODE_ENV === "production") return cachedStyles;
  const entries = manifest();
  const files = new Set<string>();
  const visited = new Set<string>();
  function collect(key: string) {
    if (visited.has(key)) return;
    visited.add(key);
    const entry = entries[key];
    if (!entry) return;
    for (const imported of entry.imports ?? []) collect(imported);
    for (const css of entry.css ?? []) files.add(css);
  }
  collect("index.html");
  if (!files.size) throw new Error("The legacy article stylesheet is missing from the client build.");
  // Preserve selectors, real font weights and all metric overrides. Keep the
  // original medium-weight local fallback, but exclude 400 and 600: a range
  // can shadow either real face and make FontFaceSet.load reject.
  return cachedStyles = Array.from(files).map(file => readFileSync(resolve(buildDirectory(), file), "utf8"))
    .join("\n").replace(/font-display:optional/g, "font-display:swap")
    .replace(/@font-face\s*\{[^}]*\}/g, rule =>
      /font-family:\s*["']?Inter["']?\s*;/.test(rule) && /src:\s*local\(/.test(rule)
        ? rule.replace(/font-weight:\s*400\s+600/, "font-weight:500")
        : rule)
    .replace(/<\/style/gi, "<\\/style");
}

function entry(): string {
  if (process.env.NODE_ENV !== "production") return "/src/legacy-articles/bootstrap.ts";
  const module = manifest()["src/legacy-articles/bootstrap.ts"];
  if (!module?.isEntry || !module.file) throw new Error("The legacy article bootstrap is missing from the build.");
  return `/${module.file}`;
}

function fontFaces(): string {
  const directory = process.env.NODE_ENV === "production"
    ? resolve(__dirname, "public/fonts") : resolve(process.cwd(), "client/public/fonts");
  // The exact original Inter 400/600 and Poppins 600/700/800 declarations,
  // including their individual weight and Unicode ranges. The Latin Inter
  // and heading-700 binaries are embedded so the first paint uses the final
  // glyphs; swap must not change the hero's line breaks after it has painted.
  const critical = new Set([
    "UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa1ZL7W0Q5nw.woff2",
    "pxiByp8kv8JHgFVrLCz7Z1xlFd2JQEk.woff2",
  ]);
  return readFileSync(resolve(directory, "symbols-fonts.css"), "utf8")
    .replace(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)/g, (_, url: string) => {
      const filename = url.split("/").at(-1)!;
      if (critical.has(filename)) {
        const bytes = readFileSync(resolve(directory, `symbols-${filename}`));
        return `url(data:font/woff2;base64,${bytes.toString("base64")})`;
      }
      return `url(/fonts/symbols-${filename})`;
    });
}

export function injectLegacyArticleDocument(path: string, html: string): string {
  const data = getLegacyPageData(`${path.replace(/\/$/, "")}/`);
  if (!data) throw new Error(`Missing legacy article data for ${path}`);
  let result = html
    .replace(/<template id="static-lcp-hero-template">[\s\S]*?<\/template>/i, "")
    .replace(/<link\b(?=[^>]*rel="(?:preload|modulepreload)")(?=[^>]*(?:as="image"|rel="modulepreload"))[^>]*>/gi, "")
    .replace(/<link\b(?=[^>]*rel="preload")(?=[^>]*as="font")[^>]*>/gi, "")
    .replace(/<link\b(?=[^>]*href="https:\/\/fonts\.googleapis\.com\/css2\?family=Inter:[^"]+")[^>]*>/gi, "")
    .replace(/<link\b(?=[^>]*href="\/assets\/[^"]+\.css")[^>]*>/gi, "")
    .replace(/<noscript>\s*<\/noscript>/gi, "")
    .replace(/<script\b(?=[^>]*\btype="module")(?=[^>]*\bsrc="[^"]+")[^>]*><\/script>/g, "")
    .replace(/display=optional/g, "display=swap")
    // Reuse the existing interaction/3.5-second branch. Do not extend the
    // fallback or use requestIdleCallback to load tags during initial paint.
    .replace("var comparisonPage = window.location.pathname === '/top-preschools-in-thane';", "var comparisonPage = true;");
  result = result.replace("</head>", () => `<style data-legacy-critical>${styles()}${fontFaces()}</style>
<script>if(document.fonts){["400 16px Inter","600 16px Inter","600 16px Poppins","700 30px Poppins"].forEach(function(face){document.fonts.load(face).catch(function(error){console.warn("Article font warmup failed",face,error)})})}</script>
<script>try{var t=localStorage.getItem("rainbow-preschool-theme")||"light";document.documentElement.classList.add(t==="system"?(matchMedia("(prefers-color-scheme:dark)").matches?"dark":"light"):t)}catch(e){document.documentElement.classList.add("light")}</script>
<script type="module" src="${entry()}"></script></head>`);
  return result.replace('<div id="root"></div>', () => `<div id="root">${renderLegacyLandingPage(data)}</div>`);
}