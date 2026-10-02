import assert from "node:assert/strict";
import { NATIONAL_SYMBOLS } from "../shared/national-symbols-page-content";
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
assert.ok(!html.includes("Reviewed by Rainbow Preschool Curriculum Team"));
assert.equal((await fetch(NATIONAL_SYMBOLS_HERO_IMAGE.replace("https://www.rainbowpreschools.com", base))).status, 200);
console.log(`National symbols PASS: identical visitor/Googlebot initial HTML; title 62, description 154; exactly BlogPosting + ItemList + one BreadcrumbList; dateModified ${article.dateModified}; hero 200.`);
console.log("Content remains JavaScript-rendered using the existing interactive page; this check does not claim server-rendered body content.");