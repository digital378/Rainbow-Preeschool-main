#!/usr/bin/env node
/**
 * Compare Googlebot's server HTML with the hydrated mobile visitor page for
 * every URL in the live sitemap. Prints a Markdown table; does not modify data.
 *
 * Usage: BASE_URL=https://your-dev-host node scripts/report-sitemap-parity.mjs
 */
import { execFileSync } from "node:child_process";
import puppeteer from "puppeteer-core";
import { parse } from "parse5";

const base = (process.env.BASE_URL || "http://127.0.0.1:5000").replace(/\/$/, "");
const botAgent = "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";
const browserAgent = "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Mobile Safari/537.36";
const thinPaths = new Set(["/", "/programmes", "/contact", "/blog", "/preschool-admissions", "/nursery", "/kindergarten",
  "/happy-times", "/holi-activities-for-kids", "/national-symbols-of-india-for-kids",
  "/top-preschools-in-thane", "/testimonials"]);

function element(root, name) {
  if (root.tagName === name) return root;
  for (const child of root.childNodes || []) {
    const found = element(child, name);
    if (found) return found;
  }
  return null;
}

function meta(root, name) {
  if (root.tagName === "meta" && root.attrs?.some((attr) => attr.name === "name" && attr.value === name)) {
    return root.attrs.find((attr) => attr.name === "content")?.value || "";
  }
  for (const child of root.childNodes || []) {
    const found = meta(child, name);
    if (found !== null) return found;
  }
  return null;
}

function visibleText(root) {
  if (!root || ["script", "style", "template", "svg", "noscript"].includes(root.tagName)) return "";
  if (root.nodeName === "#text") return root.value || "";
  if (root.tagName === "br") return " ";
  const text = (root.childNodes || []).map(visibleText).join("");
  const classValue = root.attrs?.find((attribute) => attribute.name === "class")?.value || "";
  // The standalone Janmashtami hero intentionally stacks these two spans.
  // Preserve their visual boundary when parse5 reads text without CSS layout.
  if (root.tagName === "span" && /\bhero-title-(?:main|sub)\b/.test(classValue)) return ` ${text} `;
  return new Set(["p", "div", "section", "article", "header", "footer", "aside", "li", "h1", "h2", "h3", "h4", "h5", "h6", "dt", "dd", "tr"]).has(root.tagName)
    ? ` ${text} ` : text;
}

function normal(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function countWords(text) {
  return normal(text).split(/\s+/).filter(Boolean).length;
}

function imageTuples(root) {
  const images = [];
  function visit(node, excludedAncestor = false) {
    const classValue = node.attrs?.find((attribute) => attribute.name === "class")?.value || "";
    const excluded = excludedAncestor
      || classValue.split(/\s+/).some((name) => name === "animate-marquee" || name === "rainbow-theatre" || name === "ab-section");
    if (node.tagName === "img") {
      const attributes = Object.fromEntries((node.attrs || []).map((attribute) => [attribute.name, attribute.value]));
      // Scope parity to actual page imagery. Exclude the duplicate looping
      // gallery/awards strips, volatile Instagram thumbnails, the image
      // shown only when a video fails, and school brand marks; retain art.
      const src = attributes.src || "";
      const isBrandLogo = /(?:^|\/)(?:rps-logo|rainbow-logo|ris-logo)\.webp(?:[?#]|$)/i.test(src);
      const isSocialThumbnail = /^https?:\/\/[^/]*(?:cdninstagram\.com|instagram\.com)\//i.test(src);
      const isVideoFallback = /(?:^|\/)walkthrough-poster\.webp(?:[?#]|$)/i.test(src);
      const isDecorativeImage = attributes["aria-hidden"]?.toLowerCase() === "true";
      if (!excluded && !isBrandLogo && !isSocialThumbnail && !isVideoFallback && !isDecorativeImage) {
        images.push([
          attributes.src || "",
          attributes.alt || "",
          attributes.width || "",
          attributes.height || "",
        ]);
      }
    }
    for (const child of node.childNodes || []) visit(child, excluded);
  }
  if (root) visit(root);
  return images;
}

function elementById(root, id) {
  if (root.attrs?.some((attribute) => attribute.name === "id" && attribute.value === id)) return root;
  for (const child of root.childNodes || []) {
    const found = elementById(child, id);
    if (found) return found;
  }
  return null;
}

function botFields(html) {
  const tree = parse(html);
  const content = element(tree, "main") || element(tree, "article") || element(tree, "body");
  const hero = elementById(tree, "static-lcp-hero");
  return {
    title: normal(visibleText(element(tree, "title"))),
    description: normal(meta(tree, "description")),
    h1: normal(visibleText(element(tree, "h1"))),
    words: countWords(visibleText(content)),
    // The homepage's prepaint LCP hero is intentionally outside <main>.
    images: [...imageTuples(content), ...imageTuples(hero)],
  };
}

async function main() {
  const mapResponse = await fetch(`${base}/sitemap.xml`, { headers: { "User-Agent": browserAgent } });
  if (!mapResponse.ok) throw new Error(`Sitemap returned ${mapResponse.status}`);
  const sitemap = await mapResponse.text();
  const allPaths = [...new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => {
    const loc = m[1].replace(/&amp;/g, "&");
    const parsed = new URL(loc);
    return parsed.pathname + parsed.search;
  }))];
  if (!allPaths.length) throw new Error("Sitemap had no <loc> entries");
  const shardCount = Number(process.env.SHARD_COUNT || 1);
  const shardIndex = Number(process.env.SHARD_INDEX || 0);
  if (!Number.isInteger(shardCount) || shardCount < 1 || !Number.isInteger(shardIndex) || shardIndex < 0 || shardIndex >= shardCount) {
    throw new Error("Invalid SHARD_COUNT or SHARD_INDEX");
  }
  const requestedPaths = process.env.PATHS ? new Set(process.env.PATHS.split(",").filter(Boolean)) : null;
  const paths = allPaths.filter((path, index) => index % shardCount === shardIndex && (!requestedPaths || requestedPaths.has(path)));

  const executablePath = process.env.CHROME_PATH || execFileSync("which", ["chromium"], { encoding: "utf8" }).trim();
  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: ["--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu"],
  });
  const page = await browser.newPage();
  await page.setUserAgent(browserAgent);
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1, isMobile: true });
  await page.setRequestInterception(true);
  page.on("request", (request) => {
    const url = request.url();
    if (!url.startsWith(base) || ["image", "media", "font"].includes(request.resourceType())) {
      void request.abort();
    } else {
      void request.continue();
    }
  });

  const rows = [];
  try {
    for (const path of paths) {
      const url = `${base}${path}`;
      const row = { path, title: false, description: false, h1: false, botWords: 0, visitorWords: 0, ratio: 0, botImages: 0, visitorImages: 0, imagesMatch: false, imageStatus: "DIFF", status: "", note: "" };
      try {
        const response = await fetch(url, {
          headers: { "User-Agent": botAgent, Accept: "text/html" },
          redirect: "manual",
          signal: AbortSignal.timeout(15_000),
        });
        row.status = String(response.status);
        if (!response.ok) throw new Error(`Bot HTTP ${response.status}`);
        const bot = botFields(await response.text());
        const navigation = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 20_000 });
        if (!navigation?.ok()) throw new Error(`Visitor HTTP ${navigation?.status() || "unknown"}`);
        await page.waitForFunction(() => document.querySelector("h1"), { timeout: 8_000 });
        if (path === "/") {
          await page.waitForFunction(() => document.querySelector('[data-testid="text-seo-interlinks"]'), { timeout: 10_000 });
        }
        if (path === "/blog") {
          await page.waitForFunction(() => document.querySelectorAll('a[href*="/blog/"]').length >= 10, { timeout: 10_000 });
        }
        // These pages contain delayed or intersection-observed sections.
        // Other sitemap pages can be measured immediately after hydration.
        if (thinPaths.has(path)) {
          await page.evaluate(async () => {
            for (let step = 0; step <= 12; step++) {
              window.scrollTo(0, (document.documentElement.scrollHeight - window.innerHeight) * step / 12);
              await new Promise((resolve) => setTimeout(resolve, 25));
            }
            window.scrollTo(0, 0);
          });
          await new Promise((resolve) => setTimeout(resolve, 250));
        } else {
          await new Promise((resolve) => setTimeout(resolve, 120));
        }
        const visitor = await page.evaluate(() => {
          // Match bot-side image scope: main content plus the homepage's
          // prepaint hero. Keep stable editorial imagery; omit known
          // presentation duplicates, live Instagram thumbnails, the
          // conditional video-error poster, and decorative brand logos.
          const excludedImage = (image) => {
            if (image.closest(".animate-marquee, .rainbow-theatre, .ab-section")) return true;
            if (image.getAttribute("aria-hidden") === "true") return true;
            const src = image.getAttribute("src") || "";
            return /(?:^|\/)(?:rps-logo|rainbow-logo|ris-logo)\.webp(?:[?#]|$)/i.test(src)
              || /^https?:\/\/[^/]*(?:cdninstagram\.com|instagram\.com)\//i.test(src)
              || /(?:^|\/)walkthrough-poster\.webp(?:[?#]|$)/i.test(src);
          };
          const roots = [
            document.querySelector("main") || document.querySelector("article") || document.querySelector("#root") || document.body,
            document.querySelector("#static-lcp-hero"),
          ].filter(Boolean);
          const images = roots.flatMap((root) => Array.from(root.querySelectorAll("img")))
            .filter((image) => !excludedImage(image))
            .map((image) => [image.getAttribute("src") || "", image.getAttribute("alt") || "", image.getAttribute("width") || "", image.getAttribute("height") || ""]);
          return {
          title: document.title,
          description: document.querySelector('meta[name="description"]')?.getAttribute("content") || "",
          h1: document.querySelector("h1")?.innerText || "",
          text: (document.querySelector("main") || document.querySelector("article") || document.querySelector("#root") || document.body)?.innerText || "",
          images,
        };
        });
        row.title = bot.title === normal(visitor.title);
        row.description = bot.description === normal(visitor.description);
        row.h1 = bot.h1 === normal(visitor.h1);
        row.botWords = bot.words;
        row.visitorWords = countWords(visitor.text);
        row.ratio = row.visitorWords ? row.botWords / row.visitorWords : 0;
        row.botImages = bot.images.length;
        row.visitorImages = visitor.images.length;
        const botImages = new Set(bot.images.map((image) => JSON.stringify(image)));
        const visitorImages = new Set(visitor.images.map((image) => JSON.stringify(image)));
        row.botUniqueImages = botImages.size;
        row.visitorUniqueImages = visitorImages.size;
        row.imagesMatch = botImages.size === visitorImages.size
          && [...botImages].every((image) => visitorImages.has(image));
        row.imageStatus = botImages.size === 0 && visitorImages.size === 0
          ? "empty (not coverage)"
          : row.imagesMatch ? "match" : "DIFF";
        if (!row.imagesMatch) {
          const missingFromBot = [...visitorImages]
            .filter((image) => !botImages.has(image))
            .map((image) => JSON.parse(image));
          const botOnly = [...botImages]
            .filter((image) => !visitorImages.has(image))
            .map((image) => JSON.parse(image));
          row.imageNote = `visitor-only: ${JSON.stringify(missingFromBot.slice(0, 4))}; bot-only: ${JSON.stringify(botOnly.slice(0, 4))}`;
        }
        if (!row.title || !row.description || !row.h1) {
          row.note = `bot: ${JSON.stringify({ title: bot.title, description: bot.description, h1: bot.h1 })}; visitor: ${JSON.stringify({ title: normal(visitor.title), description: normal(visitor.description), h1: normal(visitor.h1) })}`;
        }
      } catch (error) {
        row.note = String(error?.message || error);
      }
      rows.push(row);
      console.error(`Checked ${rows.length}/${paths.length}: ${path}`);
    }
  } finally {
    await browser.close();
  }

  console.log(`Sitemap parity: ${paths.length}/${allPaths.length} pages (shard ${shardIndex + 1}/${shardCount}) at ${base}\n`);
  console.log("| Page | Title | Description | H1 | Bot words | Visitor words | Bot/visitor | Bot img tags (raw) | Visitor img tags (raw) | Unique image attribute parity | Flag |");
  console.log("| --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | --- |");
  for (const row of rows) {
    const flags = [
      row.note && !row.visitorWords ? "ERROR" : "",
      row.ratio < 0.8 ? "<80%" : "",
    ].filter(Boolean).join(", ");
    console.log(`| ${row.path.replace(/\|/g, "%7C")} | ${row.title ? "yes" : "no"} | ${row.description ? "yes" : "no"} | ${row.h1 ? "yes" : "no"} | ${row.botWords} | ${row.visitorWords} | ${(row.ratio * 100).toFixed(0)}% | ${row.botImages} | ${row.visitorImages} | ${row.imageStatus} (${row.botUniqueImages ?? 0}/${row.visitorUniqueImages ?? 0} unique) | ${flags || "—"} |`);
  }
  const imageMismatchRows = rows.filter((row) => !row.imagesMatch);
  const imageCoverageRows = rows.filter((row) => row.imagesMatch && row.botUniqueImages > 0 && row.visitorUniqueImages > 0);
  const emptyImageRows = rows.filter((row) => row.botUniqueImages === 0 && row.visitorUniqueImages === 0);
  const botImageTotal = rows.reduce((sum, row) => sum + row.botImages, 0);
  const visitorImageTotal = rows.reduce((sum, row) => sum + row.visitorImages, 0);
  const botUniqueImageTotal = rows.reduce((sum, row) => sum + (row.botUniqueImages || 0), 0);
  const visitorUniqueImageTotal = rows.reduce((sum, row) => sum + (row.visitorUniqueImages || 0), 0);
  const failures = rows.filter((row) => !row.title || !row.description || !row.h1 || row.ratio < 0.8 || !row.imagesMatch);
  console.log(`\nSummary: ${rows.length - failures.length}/${rows.length} pages match metadata/H1, have at least 80% bot text, and have unique image attribute parity; ${failures.length} flagged.`);
  console.log(`Image tags (raw occurrences): bot ${botImageTotal}, visitor ${visitorImageTotal}. Unique image attribute tuples: bot ${botUniqueImageTotal}, visitor ${visitorUniqueImageTotal}; ${imageCoverageRows.length}/${rows.length} routes have matching visitor-visible main-image tuples; ${emptyImageRows.length} routes have no images on either side (not counted as coverage); ${imageMismatchRows.length} routes have different unique image sets.\n`);
  for (const row of rows.filter((entry) => entry.note)) {
    console.log(`- ${row.path}: ${row.note}`);
  }
  for (const row of imageMismatchRows) {
    console.log(`- ${row.path} image attributes: ${row.imageNote || "bot and visitor image tuple counts differ"}`);
  }
  if (failures.length) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});