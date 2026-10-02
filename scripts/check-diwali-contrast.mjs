// DOM-only contrast, background-stability and card-layout audit; no captures.
import assert from "node:assert/strict";
import * as chromeLauncher from "chrome-launcher";
import WebSocket from "ws";
import { writeFile } from "node:fs/promises";

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
  let id = 0;
  const pending = new Map();
  socket.addEventListener("message", event => {
    const result = JSON.parse(event.data);
    const promise = pending.get(result.id);
    if (!promise) return;
    pending.delete(result.id);
    if (result.error) promise.reject(new Error(result.error.message));
    else promise.resolve(result.result);
  });
  const send = (method, params = {}, sessionId) => new Promise((resolve, reject) => {
    const number = ++id;
    pending.set(number, { resolve, reject });
    socket.send(JSON.stringify({ id: number, method, params, ...(sessionId ? { sessionId } : {}) }));
  });
  const { targetId } = await send("Target.createTarget", { url: "about:blank" });
  const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });
  const call = (method, params) => send(method, params, sessionId);
  const evaluate = async expression => {
    const result = await call("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
    return result.result.value;
  };
  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
  await call("Page.enable");
  await call("Runtime.enable");
  await call("Emulation.setDeviceMetricsOverride", { width: 412, height: 915, deviceScaleFactor: 1, mobile: true });
  await call("Page.navigate", { url: (process.env.BASE_URL || `https://${process.env.REPLIT_DEV_DOMAIN}`) + "/diwali-activity-for-kindergarten" });
  for (let attempt = 0; attempt < 80; attempt++) {
    if (await evaluate(`document.readyState==="complete" && !!document.querySelector("#ch7")`)) break;
    await delay(250);
  }
  await evaluate(`window.diwaliContrastAudit = function() {
    const rgba=value=>{const m=value.match(/rgba?\\(([^)]+)\\)/);if(!m)return null;return m[1].split(/[,\\s/]+/).filter(Boolean).map(Number)};
    const mix=(fg,bg)=>{const alpha=fg[3]??1;return fg.slice(0,3).map((c,i)=>c*alpha+bg[i]*(1-alpha))};
    const luminance=rgb=>rgb.map(c=>{c/=255;return c<=.04045?c/12.92:((c+.055)/1.055)**2.4}).reduce((s,c,i)=>s+c*[.2126,.7152,.0722][i],0);
    const contrast=(a,b)=>{const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)};
    function backgrounds(el){
      if(!el)return [[255,255,255]];
      const style=getComputedStyle(el);
      const inherited=backgrounds(el.parentElement);
      const color=rgba(style.backgroundColor)||[0,0,0,0];
      let results=inherited.map(bg=>mix(color,bg));
      if(style.backgroundImage!=="none"){
        const stops=Array.from(style.backgroundImage.matchAll(/rgba?\\([^)]+\\)/g),m=>rgba(m[0]));
        if(stops.length){
          const samples=[];
          for(let i=0;i<stops.length-1;i++)for(let t=0;t<=10;t++){
            const a=stops[i],b=stops[i+1];samples.push([0,1,2,3].map(k=>(a[k]??1)*(1-t/10)+(b[k]??1)*t/10));
          }
          if(stops.length===1)samples.push(stops[0]);
          results=results.flatMap(bg=>samples.map(stop=>mix(stop,bg)));
        }
      }
      return results;
    }
    const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
    const items=[],seen=new Set();let node;
    while(node=walker.nextNode()){
      const text=node.textContent.replace(/\\s+/g," ").trim(),el=node.parentElement;
      if(!text || !el || el.closest("script,style,noscript") || seen.has(el))continue;
      seen.add(el);
      const style=getComputedStyle(el),fg=rgba(style.color);
      if(!fg)continue;
      const size=parseFloat(style.fontSize),weight=parseInt(style.fontWeight)||400;
      const large=size>=24 || (size>=18.6667 && weight>=700),required=large?3:4.5;
      const values=backgrounds(el).map(bg=>contrast(mix(fg,bg),bg));
      // A translucent sticky bar can have a red chapter underneath while scrolling.
      if(el.closest(".topbar")){
        const top=getComputedStyle(el.closest(".topbar"));
        const surface=rgba(top.backgroundColor);
        for(const beneath of [[169,20,10],[122,15,8],[255,250,243]])
          values.push(contrast(mix(fg,mix(surface,beneath)),mix(surface,beneath)));
      }
      const ratio=Math.min(...values);
      items.push({tag:el.tagName,classes:el.className,text:text.slice(0,115),ratio:Number(ratio.toFixed(3)),required,color:style.color,size,weight,hidden:!!el.closest("[hidden]")});
    }
    return {checked:items.length,minimum:Math.min(...items.map(x=>x.ratio)),failures:items.filter(x=>x.ratio+0.005<x.required),items};
  }`);
  const mobile = await evaluate("window.diwaliContrastAudit()");
  const before = await evaluate(`Array.from(document.querySelectorAll(".band")).map(el=>({background:getComputedStyle(el).backgroundImage,color:getComputedStyle(el.querySelector("h2")).color}))`);
  for (const chapter of ["ch2","ch4","ch6"]) {
    await evaluate(`document.getElementById("${chapter}").scrollIntoView({behavior:"instant",block:"start"})`);
    await delay(150);
  }
  const after = await evaluate(`Array.from(document.querySelectorAll(".band")).map(el=>({background:getComputedStyle(el).backgroundImage,color:getComputedStyle(el.querySelector("h2")).color}))`);
  assert.deepEqual(before, after, "Band colours/backgrounds changed after off-screen sections rendered");
  assert(before.every(x=>x.background.includes("gradient")), "A dark chapter band has no background");
  await call("Emulation.setDeviceMetricsOverride", { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false });
  await evaluate(`document.getElementById("ch4").scrollIntoView({behavior:"instant",block:"start"})`);
  await delay(150);
  const desktop = await evaluate("window.diwaliContrastAudit()");
  await evaluate(`document.querySelectorAll(".acc-head").forEach(el=>{if(el.getAttribute("aria-expanded")==="false")el.click()});
    document.querySelectorAll("[role=tab]").forEach(el=>el.click())`);
  const interactive = [await evaluate("window.diwaliContrastAudit()")];
  for (let question = 0; question < 10; question++) {
    await evaluate(`(() => {
      const field=document.querySelectorAll(".quiz-question")[${question}];
      const option=field.querySelector(${question === 0 ? "'input:not([data-correct=\"true\"])'" : "'input[data-correct=\"true\"]'"});
      option.click();document.getElementById("quizCheck").click();
    })()`);
    interactive.push(await evaluate("window.diwaliContrastAudit()"));
    await evaluate(`document.getElementById("quizNext").click()`);
  }
  interactive.push(await evaluate("window.diwaliContrastAudit()"));
  await call("DOM.enable");
  await call("CSS.enable");
  const { root } = await call("DOM.getDocument", { depth: 0 });
  const { nodeIds } = await call("DOM.querySelectorAll", { nodeId: root.nodeId, selector: ".btn,.link-pill,.tab-btn,.chapter-nav a" });
  for (const nodeId of nodeIds) await call("CSS.forcePseudoState", { nodeId, forcedPseudoClasses: ["hover"] });
  await delay(300);
  interactive.push(await evaluate("window.diwaliContrastAudit()"));
  const cards = await evaluate(`(() => {
    const cards=Array.from(document.querySelectorAll(".craft-card"));
    const rows=new Map();
    cards.forEach(el=>{const r=el.getBoundingClientRect();const key=Math.round(r.top);if(!rows.has(key))rows.set(key,[]);rows.get(key).push(r.height)});
    return {equalRows:Array.from(rows.values()).every(row=>Math.max(...row)-Math.min(...row)<=1),
      filled:cards.every(el=>Math.abs(el.querySelector("img").getBoundingClientRect().width-el.getBoundingClientRect().width)<=2),
      fullStory:Array.from(document.querySelectorAll(".story-card p")).every(el=>getComputedStyle(el).maxWidth==="none")};
  })()`);
  const interactiveFailures = interactive.flatMap(x=>x.failures);
  const result = { mobile, desktop, interactiveStates: interactive.length, interactiveFailures,
    interactiveMinimum: Math.min(...interactive.map(x=>x.minimum)), backgroundsStable: true, cards };
  if (process.env.CONTRAST_REPORT) await writeFile(process.env.CONTRAST_REPORT, JSON.stringify(result,null,2));
  console.log(JSON.stringify({mobile:{checked:mobile.checked,minimum:mobile.minimum,failures:mobile.failures},desktop:{checked:desktop.checked,minimum:desktop.minimum,failures:desktop.failures},
    interactiveStates: result.interactiveStates, interactiveMinimum: result.interactiveMinimum, interactiveFailures, backgroundsStable:true,cards},null,2));
  assert.equal(mobile.failures.length + desktop.failures.length + interactiveFailures.length, 0, "Text contrast fails WCAG AA");
  assert(cards.equalRows && cards.filled && cards.fullStory, "Card sizing/full-width story text failed");
} finally {
  socket?.close();
  await chrome.kill();
}