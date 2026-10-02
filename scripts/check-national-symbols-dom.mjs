// DOM-only checks. Deliberately never captures screenshots.
import assert from "node:assert/strict";
import * as chromeLauncher from "chrome-launcher";
import WebSocket from "ws";
import { readFile, writeFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";

const file = "client/src/pages/national-symbols-of-india.tsx";
const before = execFileSync("git", ["show", `HEAD:${file}`], { encoding: "utf8" });
const current = await readFile(file, "utf8");
const stylesheet = text => text.match(/<style>\{`([\s\S]*?)`\}<\/style>/)?.[1];
assert.ok(stylesheet(before));
assert.equal(stylesheet(current), stylesheet(before), "Frozen stylesheet must remain byte-identical");
const chrome = await chromeLauncher.launch({
  chromeFlags: ["--headless=new", "--no-sandbox", "--disable-gpu"],
  ...(process.env.CHROME_PATH ? { chromePath: process.env.CHROME_PATH } : {}),
});
let socket;
try {
  const version = await (await fetch(`http://127.0.0.1:${chrome.port}/json/version`)).json();
  socket = new WebSocket(version.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    socket.once("open", resolve); socket.once("error", reject);
  });
  let nextId = 0;
  const pending = new Map();
  socket.on("message", data => {
    const result = JSON.parse(data);
    const promise = pending.get(result.id);
    if (!promise) return;
    pending.delete(result.id);
    result.error ? promise.reject(new Error(result.error.message)) : promise.resolve(result.result);
  });
  const send = (method, params = {}, sessionId) => new Promise((resolve, reject) => {
    const id = ++nextId;
    pending.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
  });
  const { targetId } = await send("Target.createTarget", { url: "about:blank" });
  const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });
  const call = (method, params) => send(method, params, sessionId);
  const evaluate = async expression => {
    const result = await call("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
    return result.result.value;
  };
  await call("Page.enable");
  await call("Emulation.setDeviceMetricsOverride", { width: 412, height: 915, deviceScaleFactor: 1, mobile: true });
  await call("Page.navigate", { url: (process.env.BASE_URL || `https://${process.env.REPLIT_DEV_DOMAIN}`) + "/national-symbols-of-india-for-kids" });
  for (let i = 0; i < 120; i++) {
    if (await evaluate(`document.querySelectorAll("[data-symbol-card]").length===17`)) break;
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  const report = await evaluate(`(() => {
    const page=document.querySelector(".symbol-trail-page");
    if(!page)throw Error("National symbols page did not render");
    return {
      title:document.title, description:document.querySelector('meta[name="description"]').content,
      canonical:document.querySelector('link[rel="canonical"]').href,
      h1Count:document.querySelectorAll("h1").length,
      headings:Array.from(page.querySelectorAll("h1,h2,h3,h4"),el=>({tag:el.tagName,text:el.textContent.replace(/\\s+/g," ").trim()})),
      cards:Array.from(page.querySelectorAll("[data-symbol-card]"),el=>({
        id:el.id,name:el.querySelector("h3").textContent,hindi:el.querySelector(".hindi")?.textContent,
        alt:el.querySelector("img").alt,ariaHidden:!!el.querySelector("img").closest('[aria-hidden="true"]')
      })),
      anchors:Array.from(page.querySelectorAll('a[href^="#symbol-"]'),el=>({href:el.getAttribute("href"),name:el.textContent,target:!!document.getElementById(el.hash.slice(1))})),
      schemas:Array.from(document.querySelectorAll('script[type="application/ld+json"]'),el=>JSON.parse(el.textContent)),
      craftCount:page.querySelectorAll(".craft").length,faqCount:page.querySelectorAll(".faq-q").length,
      bylinePresent:page.textContent.includes("Reviewed by Rainbow Preschool Curriculum Team"),
      links:Array.from(page.querySelectorAll("a"),el=>({href:el.getAttribute("href"),text:el.textContent.trim()})),
      overflow:document.documentElement.scrollWidth>innerWidth
    };
  })()`);
  assert.equal(report.h1Count, 1);
  assert.equal(report.cards.length, 17);
  assert.equal(report.anchors.length, 17);
  assert.ok(report.anchors.every(anchor => anchor.target));
  assert.deepEqual(report.anchors.map(anchor => anchor.name), report.cards.map(card => card.name));
  assert.ok(report.cards.every(card => card.alt && card.hindi && !card.ariaHidden));
  assert.equal(report.craftCount, 8);
  assert.equal(report.faqCount, 14);
  assert.equal(report.bylinePresent, false);
  assert.equal(report.overflow, false);
  assert.equal(report.title.length, 62);
  assert.equal(report.description.length, 154);
  assert.equal(report.canonical, "https://www.rainbowpreschools.com/national-symbols-of-india-for-kids");
  assert.deepEqual(report.schemas.map(schema => schema["@type"]).sort(), ["BlogPosting", "BreadcrumbList", "ItemList"].sort());
  let previousLevel = 0;
  for (const heading of report.headings) {
    const level = Number(heading.tag.slice(1));
    assert.ok(level <= previousLevel + 1, `Skipped level before ${heading.text}`);
    previousLevel = level;
  }
  for (const question of [
    "How many national symbols does India have — 17 or 20?",
    "Which national symbols should LKG and UKG children learn?",
    "Does Rainbow Preschool teach national symbols as part of its curriculum?",
  ]) {
    const answer = await evaluate(`(() => {const button=Array.from(document.querySelectorAll(".faq-q")).find(el=>el.textContent===${JSON.stringify(question)});if(!button)throw Error("FAQ missing");button.click();return new Promise(resolve=>setTimeout(()=>{const el=button.parentElement.querySelector(".faq-a");resolve({text:el?.textContent,link:el?.querySelector("a")?.getAttribute("href")})},50))})()`);
    assert.ok(answer.text);
    if (question.startsWith("Does Rainbow")) {
      assert.equal(answer.text, "Rainbow Preschool International follows a play-based curriculum aligned with NEP 2020, where children learn through stories, crafts and songs. You're welcome to book a visit at any of our 6 centres in Thane.");
      assert.equal(answer.link, "/play-school-near-me");
    }
  }
  for (const path of ["/kindergarten", "/about", "/nursery", "/blog/independence-day-for-kids", "/blog/republic-day-2026"]) assert.ok(report.links.some(link => link.href === path));
  await writeFile("/tmp/national-symbols-dom-report.json", JSON.stringify(report, null, 2));
  console.log("National symbols DOM PASS: frozen CSS; one H1; no skipped levels; 17 linked cards with Hindi and meaningful non-hidden alt; 14 FAQs, 8 crafts; three unique schemas; linked Rainbow FAQ; mobile no overflow.");
  console.log(report.headings.filter(heading => heading.tag !== "H4").map(heading => `${heading.tag}: ${heading.text}`).join("\n"));
} finally {
  socket?.close();
  await chrome.kill();
}