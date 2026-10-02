import React from "react";
import { renderToString } from "react-dom/server";
import { Router } from "wouter";
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import NationalSymbolsOfIndia from "../client/src/pages/national-symbols-of-india";
import { renderSymbolsNavigation, renderSymbolsFooter } from "./symbols-chrome";

const route = "/national-symbols-of-india-for-kids";
let documentBody: string | undefined;
let styles: string | undefined;

function getBody() {
  // One stable random game order per served document. Both user agents receive
  // the same markup, and controllers read that order without reshuffling it.
  const page = () => renderToString(<Router ssrPath={route}><NationalSymbolsOfIndia /></Router>)
    // React escapes text children; CSS is a raw-text HTML element, not normal
    // text. Restore its literal selectors without altering editorial text.
    .replace(/<style>([\s\S]*?)<\/style>/g, (_, css: string) => `<style>${css
      .replace(/&quot;/g, '"').replace(/&#x27;/g, "'")
      .replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&amp;/g, "&")}</style>`);
  return documentBody ??= `<div class="relative z-10 min-h-screen flex flex-col">${renderSymbolsNavigation()}<main class="flex-1">${page()}</main>${renderSymbolsFooter()}</div>`;
}

function getStyles() {
  if (styles !== undefined && process.env.NODE_ENV === "production") return styles;
  const directory = process.env.NODE_ENV === "production"
    ? resolve(__dirname, "public/assets")
    : resolve(process.cwd(), "dist/public/assets");
  const file = readdirSync(directory).find(name => /^main-[\w-]+\.css$/.test(name) || /^index-[\w-]+\.css$/.test(name));
  if (!file) throw new Error("Build the client before serving the complete National Symbols document: its compiled stylesheet is missing.");
  // Reuse, rather than approximate, the actual design-system/Tailwind CSS.
  styles = readFileSync(resolve(directory, file), "utf8")
    // The original loader supplied genuine Inter 400/600, but retained the
    // legacy local fallback for unsupplied bold weights. Preserve that bold
    // appearance without letting its broad range mask the genuine 600 face.
    .replace(/@font-face\{[^}]*font-family:Inter;[^}]*src:local\([^}]*\}/g,
      face => face.replace("font-weight:400 600", "font-weight:700 900"))
    .replace(/<\/style/gi, "<\\/style")
    .replace(/@font-face\s*\{/g, "@font-face{font-display:swap;");
  return styles;
}

function getEntry() {
  if (process.env.NODE_ENV !== "production") return "/src/symbols/bootstrap.ts";
  const manifest = JSON.parse(readFileSync(resolve(__dirname, "public/.vite/manifest.json"), "utf8"));
  const entry = manifest["src/symbols/bootstrap.ts"];
  if (!entry?.isEntry || !entry.file) throw new Error("The National Symbols hydration entry is missing from the build manifest.");
  return `/${entry.file}`;
}

export function injectSymbolsDocument(html: string) {
  let result = html
    .replace(/<template id="static-lcp-hero-template">[\s\S]*?<\/template>/i, "")
    .replace(/<link\b(?=[^>]*rel="(?:preload|modulepreload)")(?=[^>]*(?:as="image"|as="font"|rel="modulepreload"))[^>]*>/gi, "")
    .replace(/<link\b(?=[^>]*href="\/assets\/[^"]+\.css")[^>]*>/gi, "")
    .replace(/<noscript>\s*<\/noscript>/gi, "")
    .replace(/<link\b(?=[^>]*href="https:\/\/fonts\.googleapis\.com\/css2\?family=Inter:[^"]+")[^>]*>/gi, "")
    .replace(/<script\b(?=[^>]*\btype="module")(?=[^>]*\bsrc="[^"]+")[^>]*><\/script>/g, "")
    .replace(/display=optional/g, "display=swap");
  // Idle callbacks can execute during startup. Keep analytics queued and load
  // tags on real interaction or a guaranteed post-first-screen fallback.
  result = result
    .replace("var comparisonPage = window.location.pathname === '/top-preschools-in-thane';", "var comparisonPage = true;")
    .replace("setTimeout(scheduleAnalytics, 3500);", "setTimeout(scheduleAnalytics, 8000);");
  const font = "/fonts/symbols-UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa1ZL7W0Q5nw.woff2";
  // The exact existing web faces: expose their URLs immediately rather than
  // discovering them through an external stylesheet after the first paint.
  const fontDirectory = process.env.NODE_ENV === "production"
    ? resolve(__dirname, "public/fonts") : resolve(process.cwd(), "client/public/fonts");
  const faces = readFileSync(resolve(fontDirectory, "symbols-fonts.css"), "utf8")
    .replace(/https:\/\/fonts\.gstatic\.com\/[^)]+/g, source => `/fonts/symbols-${source.split("/").at(-1)}`);
  result = result.replace("</head>", `<style data-symbols-critical>${getStyles()}${faces}</style>
<noscript><style>.symbol-trail-page .reveal.pending{opacity:1;transform:none}.symbol-trail-page .faq-a[hidden],.symbol-trail-page .answer[hidden]{display:block}</style></noscript>
<link rel="preload" as="font" type="font/woff2" crossorigin href="${font}">
<script>try{var t=localStorage.getItem("rainbow-preschool-theme")||"light";document.documentElement.classList.add(t==="system"?(matchMedia("(prefers-color-scheme:dark)").matches?"dark":"light"):t)}catch(e){document.documentElement.classList.add("light")}</script>
<script type="module" src="${getEntry()}"></script></head>`);
  return result.replace('<div id="root"></div>', `<div id="root">${getBody()}</div>`);
}