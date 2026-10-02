#!/usr/bin/env node
// Screenshot-free baseline capture for legacy article pages.
import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";
import TraceGatherer from "lighthouse/core/gather/gatherers/trace.js";
import { initializeConfig } from "lighthouse/core/config/config.js";
import WebSocket from "ws";
import { readFile, writeFile } from "node:fs/promises";

const base = (process.env.BASE_URL || "http://127.0.0.1:5078").replace(/\/$/, "");
const allPaths = [
  "pre-kg-age-guide",
  "36-motivational-thoughts-of-the-day-for-kids",
  "sports-day-activities-for-kindergarten",
  "body-parts-names-in-english-for-preschoolers",
  "blog/what-age-start-play-school",
];
const requestedPaths = process.env.PATHS?.split(/[,\s]+/).map(path => path.replace(/^\/+|\/+$/g, "")).filter(Boolean);
const paths = requestedPaths?.length
  ? requestedPaths
  : allPaths;
const unknownPaths = paths.filter(path => !allPaths.includes(path));
if (unknownPaths.length) throw new Error(`Unknown PATHS entry: ${unknownPaths.join(", ")}`);
const phase = (process.env.PERF_PHASE || "before").trim();
if (!/^[a-z0-9-]+$/i.test(phase)) throw new Error("PERF_PHASE may contain only letters, numbers, and hyphens");
const domArtifactPath = `/tmp/legacy-dom-${phase}.json`;
const designBaselinePath = process.env.DESIGN_BASELINE || "/tmp/legacy-dom-before-warm.json";
const viewportSpecs = [
  { name: "mobile", width: 412, height: 915, mobile: true },
  { name: "desktop", width: 1280, height: 900, mobile: false },
];
const SCREENSHOT_TRACE_CATEGORY = "disabled-by-default-devtools.screenshot";
const SCREENSHOT_AUDIT_IDS = new Set(["screenshot-thumbnails", "final-screenshot"]);

class ScreenshotFreeTraceGatherer extends TraceGatherer {
  async startSensitiveInstrumentation({ driver, settings }) {
    const categories = TraceGatherer.getDefaultTraceCategories()
      .filter(category => category !== SCREENSHOT_TRACE_CATEGORY)
      .concat(settings.additionalTraceCategories || []);
    await driver.defaultSession.sendCommand("Page.enable");
    await driver.defaultSession.sendCommand("Tracing.start", {
      categories: categories.join(","),
      options: "sampling-frequency=10000",
    });
  }
}

const LH_CONFIG = {
  extends: "lighthouse:default",
  settings: {
    formFactor: "mobile",
    throttlingMethod: "simulate",
    throttling: {
      rttMs: 150, throughputKbps: 1638.4, cpuSlowdownMultiplier: 4,
      requestLatencyMs: 0, downloadThroughputKbps: 0, uploadThroughputKbps: 0,
    },
    screenEmulation: { mobile: true, width: 412, height: 915, deviceScaleFactor: 1.75, disabled: false },
    onlyCategories: ["performance"],
    disableFullPageScreenshot: true,
    skipAudits: [...SCREENSHOT_AUDIT_IDS],
  },
  artifacts: [{ id: "Trace", gatherer: ScreenshotFreeTraceGatherer }],
};

async function assertScreenshotFreeConfig() {
  const { resolvedConfig } = await initializeConfig("navigation", LH_CONFIG);
  const artifacts = resolvedConfig.artifacts || [];
  const audits = resolvedConfig.audits || [];
  const trace = artifacts.find(({ id }) => id === "Trace")?.gatherer?.instance;
  const enabledScreenshotAudits = audits.map(a => a.implementation.meta.id).filter(id => SCREENSHOT_AUDIT_IDS.has(id));
  const categories = TraceGatherer.getDefaultTraceCategories()
    .filter(category => category !== SCREENSHOT_TRACE_CATEGORY)
    .concat(resolvedConfig.settings.additionalTraceCategories || []);
  if (resolvedConfig.settings.disableFullPageScreenshot !== true ||
      artifacts.some(({ id }) => id === "FullPageScreenshot") ||
      enabledScreenshotAudits.length ||
      !(trace instanceof ScreenshotFreeTraceGatherer) ||
      categories.includes(SCREENSHOT_TRACE_CATEGORY)) {
    throw new Error("Screenshot-free Lighthouse config verification failed");
  }
  console.log("Verified Lighthouse has no screenshot/filmstrip source.");
}

const chromeLaunchOptions = () => ({
  chromeFlags: ["--headless=new", "--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"],
  ...(process.env.CHROME_PATH ? { chromePath: process.env.CHROME_PATH } : {}),
});

async function lighthousePage(path) {
  const chrome = await chromeLauncher.launch(chromeLaunchOptions());
  try {
    const result = await lighthouse(`${base}/${path}`, {
      port: chrome.port,
      output: "json",
      logLevel: "error",
    }, LH_CONFIG);
    if (result.lhr.runtimeError) throw new Error(result.lhr.runtimeError.message);
    const lhr = result.lhr;
    const audits = lhr.audits || {};
    const resourceItems = audits["network-requests"]?.details?.items || [];
    const resources = resourceItems.map(item => ({
      url: item.url,
      resourceType: item.resourceType,
      transferSize: item.transferSize ?? null,
      resourceSize: item.resourceSize ?? null,
      statusCode: item.statusCode ?? null,
      mimeType: item.mimeType ?? null,
      category: classifyUrl(item.url || ""),
    }));
    const longTasks = (audits["long-tasks"]?.details?.items || []).map(item => ({
      duration: item.duration ?? item.durationMs ?? null,
      startTime: item.startTime ?? null,
      url: item.url ?? item.attribution?.[0]?.url ?? null,
      attribution: item.attribution ?? null,
    })).filter(item => item.duration > 50);
    return {
      requestedUrl: `${base}/${path}`,
      finalUrl: lhr.finalUrl,
      capturedAt: new Date().toISOString(),
      metrics: Object.fromEntries(["performance", "largest-contentful-paint", "total-blocking-time", "cumulative-layout-shift", "speed-index"].map(id => [
        id, id === "performance" ? lhr.categories?.performance?.score : audits[id]?.numericValue ?? null,
      ])),
      lcpElement: audits["largest-contentful-paint-element"]?.details?.items ??
        audits["lcp-breakdown-insight"]?.details?.items?.find(item => item.type === "node") ?? null,
      lcpAudit: audits["largest-contentful-paint"]?.details ?? null,
      resources,
      resourceTotals: summarizeResources(resources),
      longTasks,
      longTasksAudit: audits["long-tasks"]?.details?.items ?? [],
      lhr,
    };
  } finally {
    await chrome.kill();
  }
}

function classifyUrl(url) {
  const u = url.toLowerCase();
  if (/googletagmanager|google-analytics|gtag\/|gtm\.js|analytics/.test(u)) return "GTM/analytics";
  if (/chat|intercom|crisp|tidio|whatsapp|messenger/.test(u)) return "chat";
  if (/carousel|swiper|slick|embla/.test(u)) return "carousel";
  if (/nav|menu/.test(u)) return "nav";
  if (/\/assets\/|\.js(?:[?#]|$)/.test(u)) return "app";
  return "other";
}

function summarizeResources(resources) {
  const categories = Object.fromEntries(["app", "nav", "chat", "GTM/analytics", "carousel", "other"]
    .map(name => [name, { count: 0, transferBytes: 0, resourceBytes: 0 }]));
  for (const r of resources) {
    const row = categories[r.category] ||= { count: 0, transferBytes: 0, resourceBytes: 0 };
    row.count++;
    row.transferBytes += r.transferSize || 0;
    row.resourceBytes += r.resourceSize || 0;
  }
  return {
    total: {
      count: resources.length,
      transferBytes: resources.reduce((sum, r) => sum + (r.transferSize || 0), 0),
      resourceBytes: resources.reduce((sum, r) => sum + (r.resourceSize || 0), 0),
    },
    categories,
  };
}

async function interactionChecks(evaluate, viewport, options = {}) {
  return evaluate(`(async () => {
    const visible = e => { const r=e.getBoundingClientRect(),s=getComputedStyle(e); return r.width>0&&r.height>0&&s.display!=="none"&&s.visibility!=="hidden"; };
    const h1=document.querySelector("h1");
    const sameH1=()=>!!h1&&h1.isConnected&&document.querySelector("h1")===h1;
    const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
    const header=document.querySelector("header,nav");
    const state=e=>e?.getAttribute("aria-expanded") ?? e?.getAttribute("data-state") ?? null;
    const labels=e=>[e.getAttribute("aria-label"),e.getAttribute("title"),e.innerText,e.textContent].filter(Boolean).join(" ").replace(/\\\\s+/g," ").trim();
    const controls=Array.from(header?.querySelectorAll("button,[role=button],a[aria-label],a[title]")||[]).filter(visible);
    const testToggle=async (name,pattern)=>{
      const control=controls.find(e=>pattern.test(labels(e)));
      if(!control)return {status:"not-found"};
      const before=state(control);
      const observed=()=>JSON.stringify({
        expanded:state(control),
        theme:name==="theme"?{className:document.documentElement.className,dataTheme:document.documentElement.getAttribute("data-theme"),background:getComputedStyle(document.body).backgroundColor}:null,
        search:name==="search"?!!Array.from(document.querySelectorAll('input[type=search],[role=search],dialog')).find(visible):null,
        openSurface:/menu|navigation/i.test(name)?!!Array.from(document.querySelectorAll('[role=menu],[data-state="open"],[aria-expanded="true"]')).find(visible):null
      });
      const beforeObserved=observed();
      control.click(); await wait(120);
      const after=state(control);
      const afterObserved=observed();
      const changed=(before!==null&&after!==before)||beforeObserved!==afterObserved;
      if(changed&&before!==null&&after!==before) { control.click(); await wait(120); }
      else if(changed&&name==="theme") { control.click(); await wait(120); }
      else if(changed) { document.dispatchEvent(new KeyboardEvent("keydown",{key:"Escape",bubbles:true})); await wait(120); }
      return {status:"checked",label:labels(control),before,after,changed,restored:observed()===beforeObserved,h1Connected:sameH1()};
    };

    const headings=Array.from(document.querySelectorAll("h2,h3"));
    const faqHeading=headings.find(e=>/frequently asked questions|\\\\bfaq\\\\b/i.test(e.innerText||e.textContent||""));
    const faqRoot=faqHeading?.closest("section,article,[class*=faq]")||faqHeading?.parentElement?.parentElement||document.querySelector("[class*=faq]");
    const faqTriggers=Array.from(faqRoot?.querySelectorAll("button,[role=button],summary")||[])
      .filter(visible)
      .filter(e=>e.matches("summary")||e.hasAttribute("aria-expanded")||e.className?.toString().includes("faq"));
    const faqState=e=>e.matches("summary")?!!e.closest("details")?.open:(e.hasAttribute("aria-expanded")?e.getAttribute("aria-expanded")==="true":null);
    const faqOriginal=faqTriggers.map(faqState);
    const faqResult={status:faqTriggers.length?"checked":"not-found",triggerCount:faqTriggers.length,singleOpen:null,collapse:null};
    if(faqTriggers.length){
      const first=faqTriggers[0],second=faqTriggers[1];
      if(faqState(first)===false){first.click();await wait(100);}
      const firstOpened=faqState(first)===true;
      if(second&&faqState(second)===false){second.click();await wait(100);}
      faqResult.singleOpen=second?firstOpened&&faqState(second)===true&&faqState(first)===false:firstOpened;
      const active=second&&faqState(second)===true?second:first;
      if(faqState(active)===true){active.click();await wait(260);}
      faqResult.collapse=faqState(active)===false;
      if(second&&firstOpened){
        first.focus();
        first.dispatchEvent(new KeyboardEvent("keydown",{key:"ArrowDown",bubbles:true,cancelable:true}));
        await wait(25);
        faqResult.arrowDownMovesFocusToNext= document.activeElement===second;
        first.blur();
      }
      faqTriggers.forEach((trigger,index)=>{if(faqState(trigger)!==faqOriginal[index])trigger.click();});
      await wait(120);
      faqResult.restored=faqTriggers.every((trigger,index)=>faqState(trigger)===faqOriginal[index]);
      faqResult.h1Connected=sameH1();
    }

    const firstHeaderButton=controls.find(e=>e.matches("button,[role=button]"));
    let headerFirstClick={status:firstHeaderButton?"checked":"not-found"};
    if(firstHeaderButton){
      const before=state(firstHeaderButton);
      firstHeaderButton.click();await wait(120);
      const after=state(firstHeaderButton);
      if(before!==null&&after!==before){firstHeaderButton.click();await wait(120);}
      else document.dispatchEvent(new KeyboardEvent("keydown",{key:"Escape",bubbles:true}));
      headerFirstClick={status:"checked",label:labels(firstHeaderButton),before,after,changed:before!==null&&after!==before,restored:before===null||state(firstHeaderButton)===before,h1Connected:sameH1()};
    }
    const search=await testToggle("search",/search/i);
    const menu=await testToggle(${JSON.stringify(viewport.mobile ? "mobile-navigation" : "desktop-menu")},${viewport.mobile ? "/menu|navigation/i" : "/menu/i"});
    const theme=await testToggle("theme",/theme|dark|light mode/i);

    let ordinaryLink={status:${options.cold ? JSON.stringify("skipped-cold-flow") : JSON.stringify("not-found")}};
    const currentPath=location.pathname;
    const link=Array.from(document.querySelectorAll("a[href]")).find(a=>visible(a)&&a.origin===location.origin&&a.pathname!==currentPath&&!a.hash);
    if(!${options.cold ? "true" : "false"}&&link){
      try {
        const response=await fetch(link.href,{method:"GET",credentials:"same-origin"});
        let prevented=false;
        const intercept=event=>{if(event.target.closest("a")===link){event.preventDefault();prevented=event.defaultPrevented;}};
        document.addEventListener("click",intercept,true);
        link.click();
        document.removeEventListener("click",intercept,true);
        ordinaryLink={status:"checked",href:link.getAttribute("href"),httpStatus:response.status,preventedDefault:prevented,pathnameUnchanged:location.pathname===currentPath,h1Connected:sameH1()};
      } catch(error) {
        ordinaryLink={status:"error",href:link.getAttribute("href"),message:String(error)};
      }
    }
    return {
      faq:faqResult,
      headerFirstClick,
      mobileNavigation:${viewport.mobile ? "menu" : "null"},
      desktopMenu:${viewport.mobile ? "null" : "menu"},
      search,
      theme,
      ordinaryLink,
      h1RetainedAfterAll:sameH1()
    };
  })()`);
}

async function domCapture() {
  const chrome = await chromeLauncher.launch(chromeLaunchOptions());
  let socket;
  try {
    const version = await (await fetch(`http://127.0.0.1:${chrome.port}/json/version`)).json();
    socket = new WebSocket(version.webSocketDebuggerUrl);
    await new Promise((resolve, reject) => { socket.once("open", resolve); socket.once("error", reject); });
    let nextId = 0;
    const pending = new Map();
    socket.on("message", data => {
      const message = JSON.parse(data);
      const task = pending.get(message.id);
      if (!task) return;
      pending.delete(message.id);
      message.error ? task.reject(new Error(message.error.message)) : task.resolve(message.result);
    });
    const send = (method, params = {}, sessionId) => new Promise((resolve, reject) => {
      const id = ++nextId;
      pending.set(id, { resolve, reject });
      socket.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
    });
    const { targetId } = await send("Target.createTarget", { url: "about:blank" });
    const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });
    const call = (method, params = {}) => send(method, params, sessionId);
    const evaluate = async expression => {
      const result = await call("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
      if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
      return result.result.value;
    };
    const waitForDocument = async pagePath => {
      let ready = false;
      for (let i = 0; i < 160; i++) {
        ready = await evaluate("document.readyState === 'complete' && !!document.body && document.body.innerText.trim().length > 0");
        if (ready) break;
        await new Promise(resolve => setTimeout(resolve, 125));
      }
      if (!ready) throw new Error(`Page did not settle: ${pagePath}`);
    };
    const waitForFonts = async () => {
      await evaluate("document.fonts?.ready || Promise.resolve()");
    };
    await call("Page.enable");
    await call("Runtime.enable");
    await call("DOM.enable");
    await call("CSS.enable");
    await call("Page.addScriptToEvaluateOnNewDocument", { source: `(() => {
      window.__legacyLongTasks = [];
      try {
        new PerformanceObserver(list => {
          for (const entry of list.getEntries()) {
            if (entry.duration > 50) window.__legacyLongTasks.push({
              startTime: entry.startTime,
              duration: entry.duration,
              attribution: Array.from(entry.attribution || [], item => ({
                name: item.name || null,
                containerType: item.containerType || null,
                containerName: item.containerName || null,
                containerId: item.containerId || null,
                containerSrc: item.containerSrc || null
              }))
            });
          }
        }).observe({type:"longtask", buffered:true});
      } catch {}
    })();` });
    const pages = {};
    let coldPreKgInteraction = null;
    for (const pagePath of paths) {
      pages[pagePath] = {};
      for (const viewport of viewportSpecs) {
        await call("Emulation.setDeviceMetricsOverride", {
          width: viewport.width, height: viewport.height, deviceScaleFactor: 1, mobile: viewport.mobile,
        });
        await call("Page.navigate", { url: `${base}/${pagePath}` });
        await waitForDocument(pagePath);
        if (process.env.INTERACTIONS === "1" && !coldPreKgInteraction && pagePath === "pre-kg-age-guide" && viewport.mobile) {
          console.log("Cold pre-KG mobile interaction flow starting");
          const startedAt = await evaluate("performance.now()");
          const result = await interactionChecks(evaluate, viewport, { cold: true });
          const completedAt = await evaluate("performance.now()");
          coldPreKgInteraction = {
            navigationAgeAtStartMs: startedAt,
            navigationAgeAtCompletionMs: completedAt,
            completedBefore5000ms: completedAt < 5000,
            ...result,
          };
          console.log(`Cold pre-KG mobile interaction flow completed at ${Math.round(completedAt)}ms`);
        }
        await waitForFonts();
        // Prime exact Latin faces before the cached reload: optional fonts
        // can finish loading without being selected in the current paint.
        await evaluate(`Promise.all(Array.from(document.fonts).filter(face =>
          ["Inter","Poppins"].includes(face.family.replace(/["']/g,"")) &&
          ["400","600","700"].includes(face.weight) &&
          /U\\+0-FF(?:,|$)/i.test(face.unicodeRange)
        ).map(face => face.load()))`);
        await call("Page.reload", { ignoreCache: false });
        await waitForDocument(pagePath);
        await new Promise(resolve => setTimeout(resolve, 8000));
        await waitForFonts();
        await evaluate("scrollTo(0,0)");
        await new Promise(resolve => setTimeout(resolve, 200));
        const snapshot = await evaluate(`(() => {
          const visible = el => {
            const s=getComputedStyle(el),r=el.getBoundingClientRect();
            return s.display!=="none"&&s.visibility!=="hidden"&&Number(s.opacity)!==0&&r.width>0&&r.height>0;
          };
          const text = el => el ? (el.innerText || el.textContent || "").replace(/\\\\s+/g," ").trim() : "";
          const rect = el => {const r=el.getBoundingClientRect();return {x:+r.x.toFixed(1),y:+r.y.toFixed(1),width:+r.width.toFixed(1),height:+r.height.toFixed(1)}};
          const signature = el => ({tag:el.tagName.toLowerCase(),className:typeof el.className==="string"?el.className:"",id:el.id||"",text:text(el).slice(0,220)});
          const main=document.querySelector("main, article, [role=main]")||document.body;
          const sectionEls=Array.from(main.querySelectorAll("section,article,[class*=article],[class*=blog],[class*=content]"))
            .filter((el,i,a)=>a.indexOf(el)===i && visible(el));
          const sectionSignatures=sectionEls.map(el=>({
            ...signature(el),
            heading:text(el.querySelector("h2,h3,h4")||el).slice(0,180),
            children:Array.from(el.children).slice(0,16).map(signature)
          }));
          const styleProps=["display","position","box-sizing","width","height","margin-top","margin-bottom","padding-top","padding-bottom","font-family","font-size","font-weight","line-height","letter-spacing","color","background-color","border-radius","box-shadow","text-align","gap","align-items","justify-content"];
          const repStyle=el=>Object.fromEntries(styleProps.map(k=>[k,getComputedStyle(el).getPropertyValue(k)]));
          const reps={};
          for(const key of ["h1","h2","body","button","nav"]){
            const candidates=key==="button"?document.querySelectorAll("button,[role=button],a[class*=button],a[class*=btn],a[href]"):[];
            const el=key==="body"?document.body:(key==="nav"?document.querySelector("nav,header"):(key==="button"?Array.from(candidates).find(visible):document.querySelector(key)));
            if(el)reps[key]={signature:signature(el),rect:rect(el),computed:repStyle(el)};
          }
          const weightSamples={};
          for(const weight of ["500","600","700"]){
            const el=Array.from(main.querySelectorAll("p,span,li,strong,b,button,a,h1,h2,h3")).find(e=>visible(e)&&getComputedStyle(e).fontWeight===weight);
            if(el)weightSamples[weight]={signature:signature(el),rect:rect(el),computed:repStyle(el)};
          }
          const visibleAnchors=Array.from(document.querySelectorAll("a")).filter(visible).map(a=>[a.getAttribute("href"),text(a)]);
          return {
            title:document.title,url:location.href,viewport:{width:innerWidth,height:innerHeight},
            visibleCopy:document.body.innerText,
            headings:Array.from(document.querySelectorAll("h1,h2")).filter(visible).map(el=>({tag:el.tagName,text:text(el)})),
            tables:Array.from(document.querySelectorAll("table")).filter(visible).map(table=>({
              caption:text(table.querySelector("caption")),
              rows:Array.from(table.querySelectorAll("tr")).map(row=>Array.from(row.querySelectorAll("th,td")).map(text))
            })),
            links:visibleAnchors,
            articleSections:sectionSignatures,
            representatives:reps,weightSamples,
            fontsReady:document.fonts?.status||null,
            fontFaces:Array.from(document.fonts||[],f=>({family:f.family,weight:f.weight,status:f.status})),
            longTasks:window.__legacyLongTasks||[],
            scriptResources:performance.getEntriesByType("resource")
              .filter(e=>e.initiatorType==="script"||/\\.m?js(?:[?#]|$)/i.test(e.name))
              .map(e=>({url:e.name,responseStatus:e.responseStatus||null,transferBytes:e.transferSize||0,resourceBytes:e.decodedBodySize||0})),
          };
        })()`);
        const fontNodes = [];
        await call("DOM.getDocument", { depth: 0 });
        const candidates = {
          H1: "h1", H2: "h2",
          body600: 'main [style*="font-weight: 600"], main strong, main b',
          body500: 'main [style*="font-weight: 500"], main p, main li',
          button700: "button,[role=button],a[class*=button],a[class*=btn],a[href]",
        };
        for (const [label, selectorList] of Object.entries(candidates)) {
          let chosen = null;
          for (const selector of selectorList.split(",").map(s=>s.trim())) {
            const found = await evaluate(`(() => {const e=document.querySelector(${JSON.stringify(selector)});if(!e)return null;const s=getComputedStyle(e);return {selector:${JSON.stringify(selector)},weight:s.fontWeight,text:(e.innerText||e.textContent||"").trim().slice(0,140)}})()`);
            if (found && (label === "H1" || label === "H2" || (label === "body600" && found.weight === "600") || (label === "body500" && found.weight === "500") || (label === "button700" && found.weight === "700"))) {
              chosen = found;
              break;
            }
          }
          if (!chosen && label.startsWith("body")) {
            const wanted = label === "body600" ? "600" : "500";
            chosen = await evaluate(`(() => {const e=Array.from(document.querySelectorAll("main *")).find(e=>{const r=e.getBoundingClientRect(),s=getComputedStyle(e);return r.width>0&&r.height>0&&s.visibility!=="hidden"&&s.display!=="none"&&s.fontWeight===${JSON.stringify(wanted)}&&(e.innerText||e.textContent||"").trim()});if(!e)return null;return {weight:getComputedStyle(e).fontWeight,text:(e.innerText||e.textContent||"").trim().slice(0,140)}})()`);
          }
          if (!chosen && label === "button700") chosen = await evaluate(`(() => {const visible=e=>{const r=e.getBoundingClientRect(),s=getComputedStyle(e);return r.width>0&&r.height>0&&s.visibility!=="hidden"&&s.display!=="none"};const all=Array.from(document.querySelectorAll("button,[role=button],a[class*=button],a[class*=btn],a[href]")).filter(visible);const textful=all.filter(e=>(e.innerText||e.textContent||"").trim());const e=textful.find(e=>getComputedStyle(e).fontWeight==="700")||textful[0]||all.find(e=>getComputedStyle(e).fontWeight==="700")||all[0];return e?{selector:e.tagName.toLowerCase(),weight:getComputedStyle(e).fontWeight,text:(e.innerText||e.textContent||"").trim().slice(0,140)}:null})()`);
          if (!chosen) {
            fontNodes.push({ label, node: null, platformFonts: [], note: "No matching rendered element" });
            continue;
          }
          const expression = label === "H1" || label === "H2"
            ? `document.querySelector(${JSON.stringify(chosen.selector)})`
            : label === "button700"
              ? `Array.from(document.querySelectorAll("button,[role=button],a[class*=button],a[class*=btn],a[href]")).find(e=>{const r=e.getBoundingClientRect(),s=getComputedStyle(e);return r.width>0&&r.height>0&&s.visibility!=="hidden"&&s.display!=="none"&&(e.innerText||e.textContent||"").trim().startsWith(${JSON.stringify(chosen.text.slice(0,35))})})`
              : `Array.from(document.querySelectorAll("main *")).find(e=>{const r=e.getBoundingClientRect(),s=getComputedStyle(e);return r.width>0&&r.height>0&&s.visibility!=="hidden"&&s.display!=="none"&&s.fontWeight===${JSON.stringify(label === "body600" ? "600" : "500")}&&(e.innerText||e.textContent||"").trim()})`;
          const object = await call("Runtime.evaluate", { expression, returnByValue: false });
          let objectId = object.result?.objectId;
          if (!objectId || object.result?.subtype !== "node") {
            fontNodes.push({ label, node: chosen, platformFonts: [], note: "Could not resolve candidate DOM node", remoteObjectType: object.result?.type || null });
            continue;
          }
          const { nodeId } = await call("DOM.requestNode", { objectId });
          const { fonts } = await call("CSS.getPlatformFontsForNode", { nodeId });
          fontNodes.push({ label, node: chosen, platformFonts: fonts });
        }
        const captured = {
          ...snapshot,
          platformFonts: fontNodes,
          fontWarmup: { initialVisitFontsReady: true, samePageReloaded: true, postReloadWaitMs: 8000, fontsReadyAfterWait: snapshot.fontsReady },
        };
        if (process.env.INTERACTIONS === "1" && pagePath === "pre-kg-age-guide" && viewport.mobile) {
          console.log(`Warm interactions ${pagePath} ${viewport.name} starting`);
          captured.interactions = await interactionChecks(evaluate, viewport);
          console.log(`Warm interactions ${pagePath} ${viewport.name} completed`);
        }
        pages[pagePath][viewport.name] = captured;
      }
    }
    return { capturedAt: new Date().toISOString(), baseUrl: base, browserVersion: version.Browser || "", coldPreKgInteraction, pages };
  } finally {
    socket?.close();
    await chrome.kill();
  }
}

async function validateAfterBaseline(dom) {
  if (phase !== "after") return;
  const baseline = JSON.parse(await readFile(designBaselinePath, "utf8"));
  const compareFields = [
    "visibleCopy", "headings", "tables", "links", "articleSections",
    "representatives", "weightSamples", "platformFonts",
  ];
  const differences = [];
  const scriptFailures = [];
  for (const pagePath of paths) {
    for (const viewport of viewportSpecs) {
      const before = baseline.pages?.[pagePath]?.[viewport.name];
      const after = dom.pages?.[pagePath]?.[viewport.name];
      if (!before || !after) {
        differences.push({ pagePath, viewport: viewport.name, field: "snapshot", reason: "Missing before/after snapshot" });
        continue;
      }
      for (const field of compareFields) {
        if (JSON.stringify(before[field]) !== JSON.stringify(after[field])) {
          differences.push({ pagePath, viewport: viewport.name, field });
        }
      }
      if (!after.scriptResources?.length) {
        scriptFailures.push({ pagePath, viewport: viewport.name, reason: "No client script resource entries" });
      } else {
        for (const script of after.scriptResources) {
          if (script.responseStatus >= 400) scriptFailures.push({ pagePath, viewport: viewport.name, url: script.url, responseStatus: script.responseStatus });
        }
      }
    }
  }
  const result = {
    capturedAt: new Date().toISOString(),
    phase,
    baselinePath: designBaselinePath,
    comparedFields: compareFields,
    differences,
    scriptFailures,
    passed: differences.length === 0 && scriptFailures.length === 0,
  };
  const reportPath = `/tmp/legacy-dom-${phase}-comparison.json`;
  await writeFile(reportPath, JSON.stringify(result, null, 2));
  if (!result.passed) {
    throw new Error(`After-baseline validation failed (${differences.length} DOM differences, ${scriptFailures.length} script failures); see ${reportPath}`);
  }
  console.log(`After-baseline DOM/font/geometry and script checks passed; report: ${reportPath}`);
}

async function captureClsDiagnostic() {
  const pagePath = (process.env.DIAG_PATH || "pre-kg-age-guide").replace(/^\/+/, "");
  const diagnosticUrl = `${base}/${pagePath}`;
  const chrome = await chromeLauncher.launch(chromeLaunchOptions());
  let socket;
  try {
    const version = await (await fetch(`http://127.0.0.1:${chrome.port}/json/version`)).json();
    socket = new WebSocket(version.webSocketDebuggerUrl);
    await new Promise((resolve, reject) => { socket.once("open", resolve); socket.once("error", reject); });
    let nextId = 0;
    const pending = new Map();
    const requests = new Map();
    const requestLog = [];
    socket.on("message", data => {
      const message = JSON.parse(data);
      if (message.method === "Network.requestWillBeSent") {
        const p = message.params;
        requests.set(p.requestId, { requestId: p.requestId, url: p.request.url, type: p.type, startTimestamp: p.timestamp, wallTime: p.wallTime });
      } else if (message.method === "Network.responseReceived") {
        const request = requests.get(message.params.requestId);
        if (request) request.response = {
          status: message.params.response.status,
          mimeType: message.params.response.mimeType,
          fromDiskCache: message.params.response.fromDiskCache || false,
          fromServiceWorker: message.params.response.fromServiceWorker || false,
          responseTime: message.params.timestamp,
        };
      } else if (message.method === "Network.loadingFinished") {
        const request = requests.get(message.params.requestId);
        if (request) {
          request.encodedDataLength = message.params.encodedDataLength;
          request.finishedTimestamp = message.params.timestamp;
          requestLog.push(request);
          requests.delete(message.params.requestId);
        }
      } else if (message.method === "Network.loadingFailed") {
        const request = requests.get(message.params.requestId);
        if (request) {
          request.failure = message.params.errorText;
          request.finishedTimestamp = message.params.timestamp;
          requestLog.push(request);
          requests.delete(message.params.requestId);
        }
      }
      const task = pending.get(message.id);
      if (!task) return;
      pending.delete(message.id);
      message.error ? task.reject(new Error(message.error.message)) : task.resolve(message.result);
    });
    const send = (method, params = {}, sessionId) => new Promise((resolve, reject) => {
      const id = ++nextId;
      pending.set(id, { resolve, reject });
      socket.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
    });
    const { targetId } = await send("Target.createTarget", { url: "about:blank" });
    const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });
    const call = (method, params = {}) => send(method, params, sessionId);
    const evaluate = async expression => {
      const result = await call("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
      if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
      return result.result.value;
    };
    await call("Page.enable");
    await call("Runtime.enable");
    await call("DOM.enable");
    await call("CSS.enable");
    await call("Network.enable");
    await call("Network.setCacheDisabled", { cacheDisabled: true });
    await call("Network.setBypassServiceWorker", { bypass: true });
    await call("Network.clearBrowserCache");
    await call("Emulation.setDeviceMetricsOverride", { width: 412, height: 915, deviceScaleFactor: 1.75, mobile: true });
    await call("Page.addScriptToEvaluateOnNewDocument", { source: `(() => {
      const diag=window.__legacyClsDiag={startedAt:performance.now(),shifts:[],samples:[],mutations:[],newResources:[],lastSampleIndex:-1};
      const rect=r=>r?{x:r.x,y:r.y,top:r.top,right:r.right,bottom:r.bottom,left:r.left,width:r.width,height:r.height}:null;
      const describe=e=>e?{tag:e.tagName,id:e.id||"",className:typeof e.className==="string"?e.className:"",text:(e.innerText||e.textContent||"").replace(/\\\\s+/g," ").trim().slice(0,180)}:null;
      const selectors={
        main:"main",article:"article",articleHeader:"article > header,article header",
        h1:"h1",intro:"article > header p,article header p,main p",
        breadcrumb:'nav[aria-label*="breadcrumb" i],[class*="breadcrumb" i]',
        breadcrumbTitle:'ol[class*="items-center"] li:last-child',
        nav:"nav,body > header,header",button:"button,[role=button],a[href]"
      };
      const sample=label=>{const out={label,at:performance.now(),readyState:document.readyState,
        viewport:{width:innerWidth,height:innerHeight,scrollY},html:{className:document.documentElement?.className||"",dataTheme:document.documentElement?.getAttribute("data-theme"),rect:rect(document.documentElement?.getBoundingClientRect())},
        body:{className:document.body?.className||"",rect:rect(document.body?.getBoundingClientRect()),scrollHeight:document.body?.scrollHeight||0},
        themeColor:document.body?getComputedStyle(document.body).backgroundColor:null,
        fonts:{status:document.fonts?.status||null,faces:Array.from(document.fonts||[],f=>({family:f.family,weight:f.weight,status:f.status}))},
        elements:{},styleSheets:[],styleElements:[]};
        for(const [name,selector] of Object.entries(selectors)){
          const root=document.querySelector(selector);
          let e=root;
          if(name==="breadcrumb")e=root?.querySelector("a,ol,li")||root;
          if(name==="button")e=Array.from(document.querySelectorAll(selector)).find(n=>{const r=n.getBoundingClientRect(),s=getComputedStyle(n);return r.width>0&&r.height>0&&s.display!=="none"&&s.visibility!=="hidden"})||null;
          if(e){const s=getComputedStyle(e);out.elements[name]={node:describe(e),rect:rect(e.getBoundingClientRect()),style:{fontFamily:s.fontFamily,fontSize:s.fontSize,fontWeight:s.fontWeight,lineHeight:s.lineHeight,display:s.display,position:s.position,marginTop:s.marginTop,marginBottom:s.marginBottom,paddingTop:s.paddingTop,paddingBottom:s.paddingBottom,transform:s.transform}}}
        }
        out.styleSheets=Array.from(document.styleSheets||[],sheet=>({href:sheet.href,ownerTag:sheet.ownerNode?.tagName||null,ownerId:sheet.ownerNode?.id||null,media:sheet.media?.mediaText||"",disabled:sheet.disabled,ruleCount:(()=>{try{return sheet.cssRules.length}catch{return null}})()}));
        out.styleElements=Array.from(document.querySelectorAll("style,link[rel=stylesheet]"),e=>({tag:e.tagName,id:e.id||"",href:e.href||null,media:e.media||"",disabled:e.disabled||false,length:e.textContent?.length||0,marker:Array.from(e.attributes||[]).filter(a=>a.name.startsWith("data-")).map(a=>[a.name,a.value])}));
        return out;
      };
      const observer=new PerformanceObserver(list=>{for(const e of list.getEntries()){
        const sources=Array.from(e.sources||[],s=>({node:describe(s.node),previousRect:rect(s.previousRect),currentRect:rect(s.currentRect),liveRect:rect(s.node?.getBoundingClientRect())}));
        diag.shifts.push({startTime:e.startTime,duration:e.duration,value:e.value,hadRecentInput:e.hadRecentInput,sources,atEvent:sample("layout-shift")});
      }});
      try{observer.observe({type:"layout-shift",buffered:true})}catch(error){diag.observerError=String(error)}
      const targetTimes=[0,50,100,250,500,750,1000,1500,2000,3000,4000,5000,6000,7000,8000];
      const resourceSeen=new Set();
      const collect=()=>{const t=performance.now();while(diag.lastSampleIndex+1<targetTimes.length&&t>=targetTimes[diag.lastSampleIndex+1]){const label=targetTimes[++diag.lastSampleIndex];diag.samples.push(sample(label+"ms"));for(const r of performance.getEntriesByType("resource"))if(!resourceSeen.has(r.name)){resourceSeen.add(r.name);diag.newResources.push({url:r.name,initiatorType:r.initiatorType,startTime:r.startTime,duration:r.duration,responseEnd:r.responseEnd,transferBytes:r.transferSize||0,encodedBytes:r.encodedBodySize||0,decodedBytes:r.decodedBodySize||0})}}};
      const timer=setInterval(collect,25);
      const mutationObserver=new MutationObserver(records=>{for(const r of records){const target=r.target;const relevant=target===document.documentElement||target===document.body||target.matches?.("main,article,article>header,h1,nav,header,style,link[rel=stylesheet]");if(relevant||Array.from(r.addedNodes||[]).some(n=>n.nodeType===1&&n.matches?.("style,link[rel=stylesheet],nav,header"))){diag.mutations.push({at:performance.now(),type:r.type,target:describe(target),attribute:r.attributeName,oldValue:r.oldValue,added:Array.from(r.addedNodes||[]).filter(n=>n.nodeType===1).map(describe),removed:Array.from(r.removedNodes||[]).filter(n=>n.nodeType===1).map(describe)})}}});
      try{mutationObserver.observe(document,{subtree:true,childList:true,attributes:true,attributeOldValue:true,attributeFilter:["class","style","data-theme","media","disabled"]})}catch{}
      addEventListener("load",()=>diag.samples.push(sample("window-load")),true);
      addEventListener("DOMContentLoaded",()=>diag.samples.push(sample("DOMContentLoaded")),true);
      setTimeout(()=>{collect();clearInterval(timer);diag.completedAt=performance.now();diag.layoutShiftEntries=performance.getEntriesByType("layout-shift").map(e=>({startTime:e.startTime,duration:e.duration,value:e.value,hadRecentInput:e.hadRecentInput,sources:Array.from(e.sources||[],s=>({node:describe(s.node),previousRect:rect(s.previousRect),currentRect:rect(s.currentRect)}))}))},8200);
    })();` });
    await call("Page.navigate", { url: diagnosticUrl });
    const startedAt = Date.now();
    const targetTimes = [0, 500, 1000, 2000, 4000, 6000, 8000];
    const platformFontSamples = [];
    const fontExpression = label => {
      if (label === "H1") return `document.querySelector("h1")`;
      if (label === "intro") return `document.querySelector("article > header p,article header p,main p")`;
      if (label === "breadcrumb") return `document.querySelector('nav[aria-label*="breadcrumb" i] a,[class*="breadcrumb" i] a')`;
      if (label === "breadcrumbTitle") return `document.querySelector('ol[class*="items-center"] li:last-child')`;
      return `Array.from(document.querySelectorAll("button,[role=button],a[href]")).find(e=>{const r=e.getBoundingClientRect(),s=getComputedStyle(e);return r.width>0&&r.height>0&&s.display!=="none"&&s.visibility!=="hidden"&&s.fontWeight==="700"})||Array.from(document.querySelectorAll("button,[role=button],a[href]")).find(e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0&&!!(e.innerText||e.textContent||"").trim()})`;
    };
    const fontSelector = label => label === "H1" ? "h1"
      : label === "intro" ? "article > header p,article header p,main p"
        : label === "breadcrumb" ? 'nav[aria-label*="breadcrumb" i] a,[class*="breadcrumb" i] a'
          : label === "breadcrumbTitle" ? 'ol[class*="items-center"] li:last-child'
          : "button,[role=button],a[href]";
    for (const targetMs of targetTimes) {
      const delay = startedAt + targetMs - Date.now();
      if (delay > 0) await new Promise(resolve => setTimeout(resolve, delay));
      const at = await evaluate("performance.now()");
      const elements = [];
      for (const label of ["H1", "intro", "breadcrumb", "breadcrumbTitle", "button700"]) {
        const expression = fontExpression(label);
        const info = await evaluate(`(()=>{const e=${expression};if(!e)return null;const s=getComputedStyle(e);const r=e.getBoundingClientRect();return {tag:e.tagName,id:e.id||"",className:typeof e.className==="string"?e.className:"",text:(e.innerText||e.textContent||"").replace(/\\\\s+/g," ").trim().slice(0,140),fontFamily:s.fontFamily,fontWeight:s.fontWeight,rect:{x:r.x,y:r.y,width:r.width,height:r.height}}})()`);
        if (!info) { elements.push({ label, element: null, platformFonts: [] }); continue; }
        const { root } = await call("DOM.getDocument", { depth: 0 });
        const { nodeId } = await call("DOM.querySelector", { nodeId: root.nodeId, selector: fontSelector(label) });
        if (!nodeId) {
          elements.push({ label, element: info, platformFonts: [], note: "No matching CDP node" });
          continue;
        }
        try {
          const { fonts } = await call("CSS.getPlatformFontsForNode", { nodeId });
          elements.push({ label, element: info, platformFonts: fonts });
        } catch (error) {
          elements.push({ label, element: info, platformFonts: [], note: `CDP font query failed: ${error.message}` });
        }
      }
      const state = await evaluate("({shifts:window.__legacyClsDiag?.shifts?.length||0,readyState:document.readyState})");
      platformFontSamples.push({ requestedAtMs: targetMs, browserTimeMs: at, ...state, elements });
    }
    const remaining = startedAt + 8500 - Date.now();
    if (remaining > 0) await new Promise(resolve => setTimeout(resolve, remaining));
    const pageData = await evaluate("window.__legacyClsDiag||null");
    const result = {
      capturedAt: new Date().toISOString(),
      url: diagnosticUrl,
      browserVersion: version.Browser || "",
      viewport: { width: 412, height: 915, deviceScaleFactor: 1.75, mobile: true },
      cacheDisabled: true,
      observationWindowMs: 8200,
      pageData,
      platformFontSamples,
      networkRequests: [...requestLog, ...requests.values()],
    };
    const outputPath = `/tmp/legacy-cls-diagnostic-${phase}-${pagePath.replaceAll("/", "-")}.json`;
    await writeFile(outputPath, JSON.stringify(result, null, 2));
    console.log(`Saved cold-mobile CLS diagnostic: ${outputPath}`);
    console.log(JSON.stringify({
      url: result.url,
      shifts: pageData?.shifts?.map(shift => ({ startTime: shift.startTime, value: shift.value, sources: shift.sources.map(source => ({ node: source.node, previousRect: source.previousRect, currentRect: source.currentRect })) })),
      samples: pageData?.samples?.map(sample => ({ label: sample.label, readyState: sample.readyState, fonts: sample.fonts?.faces?.filter(face => face.status === "loaded"), h1: sample.elements?.h1?.rect, articleHeader: sample.elements?.articleHeader?.rect, styleSheets: sample.styleSheets?.map(sheet => sheet.href || `${sheet.ownerTag}#${sheet.ownerId}`) })),
      platformFonts: platformFontSamples.map(sample => ({ at: sample.browserTimeMs, elements: sample.elements.map(element => ({ label: element.label, weight: element.element?.fontWeight, families: element.platformFonts.map(font => font.familyName) })) })),
    }, null, 2));
  } finally {
    socket?.close();
    await chrome.kill();
  }
}

if (process.env.DIAG_CLS === "1") {
  await captureClsDiagnostic();
  process.exit(0);
}

await assertScreenshotFreeConfig();
if (process.env.DOM_ONLY !== "1") {
  for (const pagePath of paths) {
    process.stdout.write(`Lighthouse ${pagePath} … `);
    const report = await lighthousePage(pagePath);
    await writeFile(`/tmp/legacy-perf-${phase}-${pagePath.replaceAll("/", "-")}.json`, JSON.stringify(report, null, 2));
    const m = report.metrics;
    console.log(`LCP ${Math.round(m["largest-contentful-paint"] || 0)}ms TBT ${Math.round(m["total-blocking-time"] || 0)}ms resources ${report.resourceTotals.total.transferBytes}B`);
  }
}
if (process.env.PERF_ONLY !== "1") {
  const dom = await domCapture();
  await writeFile(domArtifactPath, JSON.stringify(dom, null, 2));
  console.log(`Saved settled mobile+desktop DOM and CDP font baseline: ${domArtifactPath}`);
  await validateAfterBaseline(dom);
}