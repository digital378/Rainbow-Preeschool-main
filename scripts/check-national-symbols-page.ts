import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import { NATIONAL_SYMBOLS, NATIONAL_SYMBOLS_SSR_COPY } from "../shared/national-symbols-page-content";
import { NATIONAL_SYMBOLS_FAQS } from "../shared/national-symbols-faq-data";
import { NATIONAL_SYMBOLS_CRAFTS } from "../shared/national-symbols-craft-data";
import {
  NATIONAL_SYMBOLS_BUILD_DATE, NATIONAL_SYMBOLS_DESCRIPTION,
  NATIONAL_SYMBOLS_HERO_IMAGE, NATIONAL_SYMBOLS_PATH, NATIONAL_SYMBOLS_TITLE,
} from "../shared/national-symbols-page-meta";

const base = process.env.BASE_URL ?? "http://127.0.0.1:5000";
const [visitor, crawler] = await Promise.all([
  fetch(`${base}${NATIONAL_SYMBOLS_PATH}`, { headers: { "User-Agent": "Mozilla/5.0 Chrome/128.0.0.0 Safari/537.36" } }),
  fetch(`${base}${NATIONAL_SYMBOLS_PATH}`, { headers: { "User-Agent": "Googlebot/2.1 (+http://www.google.com/bot.html)" } }),
]);
assert.equal(visitor.status, 200);
assert.equal(crawler.status, 200);
const html = await visitor.text();
assert.equal(await crawler.text(), html, "Visitor and Googlebot initial HTML must be byte-identical");
const decode = (text: string) => text.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;|&#x27;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
const body = html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? "";
assert.ok(body.includes("symbol-trail-page"), "Initial visitor HTML must contain the National Symbols page body");
assert.ok(!/<div[^>]*id="root"[^>]*>\s*<\/div>/i.test(body), "Initial HTML must not be an empty #root shell");
assert.ok(!/enable javascript|javascript is required|please enable javascript/i.test(decode(body)), "Initial HTML must not be a generic JavaScript-only shell");
const parsedPage = new JSDOM(html).window.document.querySelector(".symbol-trail-page");
assert.ok(parsedPage, "Parsed SSR body must contain .symbol-trail-page");
parsedPage.querySelectorAll("style,script").forEach(element => element.remove());
const bodyText = decode(parsedPage.textContent ?? "").replace(/\s+/g, " ");
const includesBodyText = (expected: string) => bodyText.includes(expected.replace(/\s+/g, " ").trim());
assert.equal(decode(html.match(/<title>(.*?)<\/title>/s)?.[1] ?? ""), NATIONAL_SYMBOLS_TITLE);
assert.equal(decode(html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? ""), NATIONAL_SYMBOLS_DESCRIPTION);
assert.equal(NATIONAL_SYMBOLS_TITLE.length, 62);
assert.equal(NATIONAL_SYMBOLS_DESCRIPTION.length, 154);
const schemas = Array.from(html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g), match => JSON.parse(match[1]));
assert.deepEqual(schemas.map(schema => schema["@type"]).sort(), ["BlogPosting", "BreadcrumbList", "ItemList"].sort());
const article = schemas.find(schema => schema["@type"] === "BlogPosting");
assert.equal(article.dateModified, NATIONAL_SYMBOLS_BUILD_DATE);
assert.equal(article.image, NATIONAL_SYMBOLS_HERO_IMAGE);
const items = schemas.find(schema => schema["@type"] === "ItemList").itemListElement;
assert.equal(items.length, 17);
assert.deepEqual(items.map((item: { name: string }) => item.name), NATIONAL_SYMBOLS.map(symbol => symbol.name));
for (const symbol of NATIONAL_SYMBOLS) {
  assert.ok(html.includes(`id="symbol-${symbol.id}"`), `SSR body must contain card id symbol-${symbol.id}`);
  assert.ok(symbol.hindi && includesBodyText(symbol.hindi), `SSR body must contain Hindi label for ${symbol.id}`);
}
for (const craft of NATIONAL_SYMBOLS_CRAFTS) {
  for (const text of [craft.name, craft.instruction, craft.time, craft.ages]) {
    assert.ok(includesBodyText(text), `SSR body must contain craft text: ${text}`);
  }
}
assert.equal(NATIONAL_SYMBOLS_FAQS.length, 14);
for (const [question, answer] of NATIONAL_SYMBOLS_FAQS) {
  assert.ok(includesBodyText(question), `SSR body must contain FAQ question: ${question}`);
  assert.ok(includesBodyText(answer), `SSR body must contain full FAQ answer: ${question}`);
}
for (const text of NATIONAL_SYMBOLS_SSR_COPY.split("\n").filter(Boolean)) {
  assert.ok(includesBodyText(text), `SSR body is missing shared page copy: ${text.slice(0, 100)}`);
}
assert.ok(!html.includes("Reviewed by Rainbow Preschool Curriculum Team"));
assert.equal((await fetch(NATIONAL_SYMBOLS_HERO_IMAGE.replace("https://www.rainbowpreschools.com", base))).status, 200);
console.log(`National symbols PASS: identical visitor/Googlebot initial HTML with full SSR body; 17 card IDs/Hindi labels, all craft copy, and all 14 full FAQ answers; title 62, description 154; exactly BlogPosting + ItemList + one BreadcrumbList; dateModified ${article.dateModified}; hero 200.`);