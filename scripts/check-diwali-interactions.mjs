// DOM-only browser verification. Never enables screenshots or trace recording.
import assert from "node:assert/strict";
import * as chromeLauncher from "chrome-launcher";
import WebSocket from "ws";

const base = process.env.BASE_URL || `https://${process.env.REPLIT_DEV_DOMAIN}`;
const chrome = await chromeLauncher.launch({
  chromeFlags: ["--headless=new", "--no-sandbox", "--disable-gpu"],
  ...(process.env.CHROME_PATH ? { chromePath: process.env.CHROME_PATH } : {}),
});
let socket;
try {
  const version = await (await fetch(`http://127.0.0.1:${chrome.port}/json/version`)).json();
  socket = new WebSocket(version.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve, { once: true });
    socket.addEventListener("error", reject, { once: true });
  });
  let nextId = 0;
  const pending = new Map();
  socket.addEventListener("message", event => {
    const message = JSON.parse(event.data);
    const entry = pending.get(message.id);
    if (!entry) return;
    pending.delete(message.id);
    if (message.error) entry.reject(new Error(message.error.message));
    else entry.resolve(message.result);
  });
  const send = (method, params = {}, sessionId) => new Promise((resolve, reject) => {
    const id = ++nextId;
    pending.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
  });
  const target = await send("Target.createTarget", { url: "about:blank" });
  const { sessionId } = await send("Target.attachToTarget", { targetId: target.targetId, flatten: true });
  const call = (method, params) => send(method, params, sessionId);
  const evaluate = async expression => {
    const result = await call("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.text + ": " + result.exceptionDetails.exception?.description);
    return result.result.value;
  };
  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
  await call("Page.enable");
  await call("Runtime.enable");
  await call("Emulation.setDeviceMetricsOverride", { width: 412, height: 915, deviceScaleFactor: 1, mobile: true });
  await call("Page.navigate", { url: base + "/diwali-activity-for-kindergarten" });
  for (let attempt = 0; attempt < 80; attempt++) {
    if (await evaluate(`document.readyState === "complete" && !!document.querySelector("#quizCard")`)) break;
    await delay(250);
  }
  const mobile = await evaluate(`({
    title: document.title,
    h1: document.querySelector("h1")?.textContent.trim(),
    h1Count: document.querySelectorAll("h1").length,
    viewport: innerWidth,
    documentWidth: document.documentElement.scrollWidth,
    crafts: document.querySelectorAll(".craft-card").length,
    heroLoaded: document.querySelector(".hero-art img")?.naturalWidth > 0,
    chapters: Array.from(document.querySelectorAll("main .chapter[id]")).map(e=>e.id)
  })`);
  assert.equal(mobile.h1, "Diwali Activities for Kindergarten");
  assert.equal(mobile.h1Count, 1);
  assert.equal(mobile.crafts, 11);
  assert(mobile.heroLoaded, "Hero image did not load");
  assert(mobile.documentWidth <= mobile.viewport + 1, "Mobile page overflows horizontally");
  assert.deepEqual(mobile.chapters.slice(0, 7), ["ch1","ch2","ch3","ch4","ch5","ch6","ch7"]);

  await evaluate(`document.querySelector("[data-tabs]").scrollIntoView({block:"center",behavior:"instant"})`);
  await delay(400);
  const tab = await evaluate(`(() => {
    const group=document.querySelector("[data-tabs]");
    const buttons=group.querySelectorAll("[role=tab]");
    buttons[1].click();
    const panel=document.getElementById(buttons[1].getAttribute("aria-controls"));
    const clickWorked=buttons[1].getAttribute("aria-selected")==="true" && !panel.hidden &&
      getComputedStyle(panel).display!=="none" && panel.getBoundingClientRect().height>0;
    buttons[1].dispatchEvent(new KeyboardEvent("keydown",{key:"ArrowRight",bubbles:true}));
    return {clickWorked,keyboardWorked:buttons[2].getAttribute("aria-selected")==="true"};
  })()`);
  assert(tab.clickWorked && tab.keyboardWorked, "Age tabs or keyboard navigation failed");

  await evaluate(`document.querySelector("#faqList").scrollIntoView({block:"center",behavior:"instant"})`);
  await delay(400);
  const accordion = await evaluate(`(() => {
    const button=document.querySelector("#faqList .acc-head");
    button.click();
    const panel=document.getElementById(button.getAttribute("aria-controls"));
    const opened=button.getAttribute("aria-expanded")==="true" && !panel.hidden &&
      getComputedStyle(panel).display!=="none" && panel.getBoundingClientRect().height>0;
    button.click();
    return opened && button.getAttribute("aria-expanded")==="false" && panel.hidden;
  })()`);
  assert(accordion, "FAQ open/close failed");

  await evaluate(`document.querySelector("#quizCard").scrollIntoView({block:"center",behavior:"instant"})`);
  await delay(400);
  for (let question = 0; question < 10; question++) {
    const state = await evaluate(`(() => {
      const fieldsets=Array.from(document.querySelectorAll(".quiz-question"));
      const visible=fieldsets.filter(e=>!e.hidden);
      const expected=fieldsets[${question}];
      const check=document.getElementById("quizCheck");
      if(visible.length!==1 || visible[0]!==expected || check.hidden) return {ok:false,reason:"wrong question or hidden check"};
      expected.querySelector('[data-correct="true"]').click();
      check.click();
      const feedback=expected.querySelector(".quiz-feedback");
      const next=document.getElementById("quizNext");
      const ok=!feedback.hidden && !next.hidden && check.hidden;
      next.click();
      return {ok};
    })()`);
    assert(state.ok, `Quiz question ${question + 1} failed: ${state.reason || "feedback/next state"}`);
  }
  assert.equal(await evaluate(`document.getElementById("quizScore").textContent.trim()`), "10 / 10");
  assert.equal(await evaluate(`document.getElementById("quizResult").hidden`), false);
  assert(await evaluate(`getComputedStyle(document.getElementById("quizResult")).display !== "none"`), "Quiz result is CSS-hidden");
  const replay = await evaluate(`(() => {
    document.getElementById("quizReplay").click();
    return !document.getElementById("quizCard").hidden &&
      !document.querySelector(".quiz-question").hidden &&
      !document.getElementById("quizCheck").hidden &&
      document.getElementById("quizNext").hidden &&
      !document.querySelector('.quiz-question input').disabled &&
      !document.querySelector('.quiz-question input:checked');
  })()`);
  assert(replay, "Quiz replay did not reset all state");
  await call("Emulation.setDeviceMetricsOverride", { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false });
  await delay(150);
  assert(await evaluate(`document.documentElement.scrollWidth <= innerWidth + 1`), "Desktop page overflows horizontally");
  console.log("Diwali DOM browser checks PASS: mobile/desktop width, loaded hero, chapter order, age tabs/keyboard, FAQ open/close, all ten quiz questions, 10/10 score and replay. No screenshots or traces captured.");
} finally {
  socket?.close();
  await chrome.kill();
}