import { readFileSync, writeFileSync } from "node:fs";
import { transform } from "esbuild";
import postcss from "postcss";
import tailwind from "tailwindcss";
import loadConfig from "tailwindcss/loadConfig.js";
// Derive critical tokens from the homepage source rather than maintain a
// second design system. Scope them to the static document before React loads.
const homepage = readFileSync("client/src/index.css", "utf8");
const tokens = homepage.match(/:root\s*\{([\s\S]*?)\}/)?.[1];
if (!tokens) throw new Error("Homepage design tokens were not found.");
const page = readFileSync("client/src/styles/play-school-near-me.css", "utf8");
const config = loadConfig(new URL("../tailwind.config.ts", import.meta.url).pathname);
const buttonUtilities = await postcss([tailwind({
  ...config,
  content: [{raw: readFileSync("shared/button-styles.ts", "utf8"), extension: "ts"}],
})]).process("@tailwind utilities;", { from: undefined });
const css = await transform(`#near-me-document{${tokens}}\n${buttonUtilities.css}\n${page}`, { loader: "css", minify: true });
writeFileSync("client/public/styles/play-school-near-me.css", css.code);