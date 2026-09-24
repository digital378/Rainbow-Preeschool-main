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
const thinPaths = new Set(["/", "/programmes", "/contact", "/blog", "/nursery", "/kindergarten",
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
  return new Set(["p", "div", "section", "article", "header", "footer", "aside", "li", "h1", "h2", "h3", "h4", "h5", "h6", "dt", "dd", "tr"]).has(root.tagName)
    ? ` ${text} ` : text;
}

function normal(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function countWords(text) {
  return normal(text).split(/\s+/).filter(Boolean).length;
}

function botFields(html) {
  const tree = parse(html);
  const content = element(tree, "main") || element(tree, "article") || element(tree, "body");
  return {
    title: normal(visibleText(element(tree, "title"))),
    description: normal(meta(tree, "description")),
    h1: normal(visibleText(element(tree, "h1"))),
    words: countWords(visibleText(content)),
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
      const row = { path, title: false, description: false, h1: false, botWords: 0, visitorWords: 0, ratio: 0, status: "", note: "" };
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
        // The eleven known thin pages contain intersection-observed sections.
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
        const visitor = await page.evaluate(() => ({
          title: document.title,
          description: document.querySelector('meta[name="description"]')?.getAttribute("content") || "",
          h1: document.querySelector("h1")?.innerText || "",
          text: (document.querySelector("main") || document.querySelector("article") || document.querySelector("#root") || document.body)?.innerText || "",
        }));
        row.title = bot.title === normal(visitor.title);
        row.description = bot.description === normal(visitor.description);
        row.h1 = bot.h1 === normal(visitor.h1);
        row.botWords = bot.words;
        row.visitorWords = countWords(visitor.text);
        row.ratio = row.visitorWords ? row.botWords / row.visitorWords : 0;
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
  console.log("| Page | Title | Description | H1 | Bot words | Visitor words | Bot/visitor | Flag |");
  console.log("| --- | --- | --- | --- | ---: | ---: | ---: | --- |");
  for (const row of rows) {
    const flags = [
      row.note && !row.visitorWords ? "ERROR" : "",
      row.ratio < 0.8 ? "<80%" : "",
    ].filter(Boolean).join(", ");
    console.log(`| ${row.path.replace(/\|/g, "%7C")} | ${row.title ? "yes" : "no"} | ${row.description ? "yes" : "no"} | ${row.h1 ? "yes" : "no"} | ${row.botWords} | ${row.visitorWords} | ${(row.ratio * 100).toFixed(0)}% | ${flags || "—"} |`);
  }
  const failures = rows.filter((row) => !row.title || !row.description || !row.h1 || row.ratio < 0.8);
  console.log(`\nSummary: ${rows.length - failures.length}/${rows.length} pages match metadata/H1 and have at least 80% bot text; ${failures.length} flagged.\n`);
  for (const row of rows.filter((entry) => entry.note)) {
    console.log(`- ${row.path}: ${row.note}`);
  }
  if (failures.length) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});