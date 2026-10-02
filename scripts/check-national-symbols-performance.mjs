// National Symbols SSR and interaction/performance contract. This deliberately
// uses CDP without screenshots, video, or tracing.
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import * as chromeLauncher from "chrome-launcher";
import WebSocket from "ws";

const route = "/national-symbols-of-india-for-kids";
const base = (process.env.BASE_URL || "http://127.0.0.1:5000").replace(/\/$/, "");
const baselinePath = "/tmp/symbols-design-baseline.json";
const sourcePath = "client/src/pages/national-symbols-of-india.tsx";
const widths = [{ width: 412, height: 915, mobile: true }, { width: 1280, height: 900, mobile: false }];
const source = await readFile(sourcePath, "utf8");
const originalFontsCss = await readFile("client/public/fonts/symbols-fonts.css", "utf8");
const originalFontBasenames = [...new Set(Array.from(originalFontsCss.matchAll(/url\([^)]*\/([^/)'"]+\.woff2)\)/g), match => match[1]))].sort();
assert.ok(originalFontBasenames.length, "Could not locate the copied original Google font basenames");
const cssLiterals = Array.from(source.matchAll(/<style>\{\`([\s\S]*?)\`\}<\/style>/g), match => match[1]).join("\n");
assert.ok(cssLiterals.length, "Could not locate the page's literal CSS");
const cssHash = createHash("sha256").update(cssLiterals).digest("hex");

const chrome = await chromeLauncher.launch({
  chromeFlags: ["--headless=new", "--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"],
  ...(process.env.CHROME_PATH ? { chromePath: process.env.CHROME_PATH } : {}),
});
let socket;
let noJsTargetId;
try {
  const version = await (await fetch(`http://127.0.0.1:${chrome.port}/json/version`)).json();
  socket = new WebSocket(version.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    socket.once("open", resolve);
    socket.once("error", reject);
  });
  let nextId = 0;
  const pending = new Map();
  let primarySessionId;
  const hydrationDiagnostics = [];
  const hydrationMessage = /hydration|did not match|didn't match|server-rendered|server rendered|react error #(?:418|423|425)|minified react error/i;
  socket.on("message", message => {
    const response = JSON.parse(message);
    if (response.sessionId === primarySessionId && response.method === "Runtime.consoleAPICalled") {
      const text = (response.params.args || []).map(arg => arg.value || arg.description || "").join(" ");
      if ((response.params.type === "error" || response.params.type === "warning") && hydrationMessage.test(text)) {
        hydrationDiagnostics.push({ source: "console", type: response.params.type, text: text.slice(0, 500) });
      }
    }
    if (response.sessionId === primarySessionId && response.method === "Runtime.exceptionThrown") {
      const text = response.params.exceptionDetails?.exception?.description || response.params.exceptionDetails?.text || "";
      if (hydrationMessage.test(text)) hydrationDiagnostics.push({ source: "exception", text: text.slice(0, 500) });
    }
    const task = pending.get(response.id);
    if (!task) return;
    pending.delete(response.id);
    response.error ? task.reject(new Error(response.error.message)) : task.resolve(response.result);
  });
  const send = (method, params = {}, sessionId) => new Promise((resolve, reject) => {
    const id = ++nextId;
    pending.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
  });
  const { targetId } = await send("Target.createTarget", { url: "about:blank" });
  const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });
  primarySessionId = sessionId;
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
  await call("Performance.enable");
  await call("Page.addScriptToEvaluateOnNewDocument", { source: `(() => {
    window.__symbolsPerf = { lcp: [], longTasks: [] };
    window.__h1Track = { node: null, removed: false };
    const captureInitialH1 = () => {
      const h1 = document.querySelector(".symbol-trail-page h1");
      if (h1 && !window.__h1Track.node) window.__h1Track.node = h1;
    };
    new MutationObserver(records => {
      captureInitialH1();
      for (const record of records) for (const removed of record.removedNodes) {
        if (window.__h1Track.node && (removed === window.__h1Track.node || removed.contains?.(window.__h1Track.node))) window.__h1Track.removed = true;
      }
    }).observe(document, { childList: true, subtree: true });
    document.addEventListener("DOMContentLoaded", captureInitialH1, { once: true });
    try {
      new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
          const el = entry.element;
          window.__symbolsPerf.lcp.push({
            value: entry.startTime,
            size: entry.size,
            selector: el ? (el.id ? "#" + el.id : el.tagName.toLowerCase() + (el.classList.length ? "." + Array.from(el.classList).join(".") : "")) : null,
            tag: el?.tagName || null,
            id: el?.id || null,
            text: (el?.textContent || "").replace(/\\s+/g, " ").trim().slice(0, 180),
            url: entry.url || null
          });
        }
      }).observe({ type: "largest-contentful-paint", buffered: true });
      new PerformanceObserver(list => {
        for (const entry of list.getEntries()) window.__symbolsPerf.longTasks.push({ startTime: entry.startTime, duration: entry.duration });
      }).observe({ type: "longtask", buffered: true });
    } catch {}
  })();` });

  const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
  const waitForSelector = async selector => {
    for (let i=0; i<40; i++) {
      if (await evaluate(`!!document.querySelector(${JSON.stringify(selector)})`)) return;
      await wait(100);
    }
    assert.fail(`Expected page structure disappeared: ${selector}`);
  };
  const waitForPage = async () => {
    for (let i = 0; i < 160; i++) {
      if (await evaluate(`!!document.querySelector(".symbol-trail-page")`)) break;
      await wait(250);
    }
    assert.ok(await evaluate(`!!document.querySelector(".symbol-trail-page")`), "National Symbols page did not render");
    await evaluate(`document.fonts?.ready || Promise.resolve()`);
    await wait(1200);
    await evaluate("scrollTo(0,0)");
    await wait(200);
  };
  const snapshot = async () => evaluate(`(() => {
    const root = document.querySelector(".symbol-trail-page");
    if (!root) throw Error("Missing .symbol-trail-page");
    const props = ["display","position","box-sizing","width","height","min-height","margin-top","margin-right","margin-bottom","margin-left","padding-top","padding-right","padding-bottom","padding-left","font-family","font-size","font-weight","line-height","letter-spacing","color","background-color","border-top-width","border-top-style","border-top-color","border-radius","box-shadow","text-align","opacity","transform","grid-template-columns","gap","align-items","justify-content","overflow","object-fit","visibility"];
    const node = (el, hiddenAncestor = false, animatedAncestor = false) => {
      const hidden = hiddenAncestor || el.hidden || el.getAttribute("aria-hidden") === "true";
      if (hidden && el.matches(".faq-a,.answer,[data-faq-answer]")) return null;
      const rect = el.getBoundingClientRect();
      const style = getComputedStyle(el);
      const animatedCompass = el.matches(".compass-icon");
      const animatedGeometry = animatedAncestor || animatedCompass;
      const randomNameTile = el.getAttribute("aria-label")?.startsWith("Name tile:") || false;
      const designAttributes = new Set(["id","class","href","src","alt","style","download","target","rel","aria-label"]);
      const attrs = Array.from(el.attributes).filter(a =>
        designAttributes.has(a.name) &&
        !(el.tagName === "IMG" && ["loading","width","height"].includes(a.name)) &&
        !(randomNameTile && a.name === "aria-label")
      ).map(a => [a.name, a.name === "class" ? Array.from(el.classList).sort().join(" ") : a.name === "style" ? el.style.cssText.split(";").map(rule=>rule.trim()).filter(Boolean).map(rule=>rule.replace(/\\s*:\\s*/,":")).join(";") : a.value]);
      if (randomNameTile) attrs.push(["aria-label", "Name tile: MATCH_NAME_TILE"]);
      attrs.sort((a,b) => a[0].localeCompare(b[0]));
      const children = el.tagName === "STYLE" ? [] : randomNameTile ? [{ text: "MATCH_NAME_TILE" }] : Array.from(el.childNodes).flatMap(child => child.nodeType === Node.TEXT_NODE
        ? ((child.nodeValue || "").replace(/\\s+/g, " ").trim() && !hidden ? [{ text: child.nodeValue.replace(/\\s+/g, " ").trim() }] : [])
        : child.nodeType === Node.ELEMENT_NODE ? [node(child, hidden, animatedGeometry)].filter(Boolean) : []);
      const styles = {};
      for (const key of props) styles[key] = animatedCompass && key === "transform" ? "ANIMATED_COMPASS" : style.getPropertyValue(key);
      return {
        tag: el.tagName.toLowerCase(), attrs, children,
        box: animatedGeometry ? ["ANIMATED_COMPASS","ANIMATED_COMPASS","ANIMATED_COMPASS","ANIMATED_COMPASS"] : [rect.x,rect.y,rect.width,rect.height].map(v => Math.round(v*10)/10),
        styles
      };
    };
    const tree = node(root);
    return { tree, matchNames: Array.from(root.querySelectorAll('[aria-label^="Name tile:"]'),el=>el.getAttribute("aria-label").slice("Name tile:".length).trim()).sort() };
  })()`);
  const waitIsland = async (name, selector) => {
    for (let i=0; i<60; i++) {
      if (await evaluate(`document.querySelector(${JSON.stringify(selector)})?.dataset[${JSON.stringify(`${name}Loaded`)}] === "true"`)) return;
      await wait(100);
    }
    const state = await evaluate(`(() => {const e=document.querySelector(${JSON.stringify(selector)});return {data:e?.dataset?{...e.dataset}:null,root:document.querySelector(".symbol-trail-page")?.dataset,matchCount:document.querySelectorAll("[data-match-name]").length,location:location.href,ready:document.readyState,navigations:performance.getEntriesByType("navigation").length,scriptResources:performance.getEntriesByType("resource").filter(x=>x.initiatorType==="script").map(x=>({name:x.name,status:x.responseStatus,size:x.transferSize}))}})()`);
    assert.fail(`${name} interaction island did not load: ${JSON.stringify(state)}`);
  };
  const getResources = () => evaluate(`performance.getEntriesByType("resource").map(e=>({name:e.name,initiatorType:e.initiatorType}))`);
  const click = async selector => evaluate(`(() => { const el=document.querySelector(${JSON.stringify(selector)}); if(!el) throw Error(${JSON.stringify(`Missing ${selector}`)}); el.click(); return true; })()`);
  const waitUntil = async (expression, message) => {
    for (let i = 0; i < 80; i++) {
      if (await evaluate(expression)) return;
      await wait(100);
    }
    assert.fail(message);
  };
  const snapshotInBaselineNameOrder = async expectedTree => {
    const labels = nameTileLabelsFromTree(expectedTree);
    const actualLabels = await evaluate(`Array.from(document.querySelectorAll('[aria-label^="Name tile:"]'),e=>e.getAttribute("aria-label").slice("Name tile:".length).trim())`);
    assert.deepEqual(actualLabels.slice().sort(), labels.slice().sort(), "The randomized matching name set must remain the same as baseline");
    await evaluate(`(() => {
      const labels = ${JSON.stringify(labels)};
      const nodes = Array.from(document.querySelectorAll('[aria-label^="Name tile:"]'));
      window.__matchNameRestore = nodes.map(el => ({ text: el.textContent, aria: el.getAttribute("aria-label") }));
      nodes.forEach((el,index) => { el.textContent = labels[index]; el.setAttribute("aria-label", "Name tile: " + labels[index]); });
    })()`);
    try {
      return await snapshot();
    } finally {
      await evaluate(`(() => {
        const nodes = Array.from(document.querySelectorAll('[aria-label^="Name tile:"]'));
        nodes.forEach((el,index) => { const old=window.__matchNameRestore?.[index]; if(old){el.textContent=old.text;el.setAttribute("aria-label",old.aria);} });
        delete window.__matchNameRestore;
      })()`);
    }
  };

  if (process.argv.includes("--baseline")) {
    const snapshots = {};
    let browserVersion = "";
    for (const viewport of widths) {
      await call("Emulation.setDeviceMetricsOverride", { width: viewport.width, height: viewport.height, deviceScaleFactor: 1, mobile: viewport.mobile });
      await call("Page.navigate", { url: base + route });
      await waitForPage();
      browserVersion = version.Browser || "";
      snapshots[`${viewport.width}x${viewport.height}`] = {
        ...(await snapshot()),
        perf: await evaluate("window.__symbolsPerf"),
        viewport,
      };
    }
    const baseline = {
      capturedAt: new Date().toISOString(),
      url: base + route,
      browserVersion,
      cssLiteralSha256: cssHash,
      snapshots,
    };
    await writeFile(baselinePath, JSON.stringify(baseline, null, 2));
    const lcp = Object.fromEntries(Object.entries(snapshots).map(([key, value]) => [key, value.perf.lcp.at(-1) || null]));
    console.log(`Saved baseline ${baselinePath}; browser ${browserVersion}; CSS ${cssHash}; LCP ${JSON.stringify(lcp)}`);
  } else {
    const baseline = JSON.parse(await readFile(baselinePath, "utf8"));
    assert.equal(cssHash, baseline.cssLiteralSha256, "The frozen literal CSS changed");

    const response = await fetch(base + route, { headers: { "User-Agent": "Mozilla/5.0 Chrome/128.0.0.0 Safari/537.36" } });
    assert.equal(response.status, 200, "National Symbols page HTTP status");
    const html = await response.text();
    const decode = text => text.replace(/&amp;/g,"&").replace(/&quot;/g,'"').replace(/&#39;|&#x27;/g,"'").replace(/&lt;/g,"<").replace(/&gt;/g,">");
    assert.match(html, /<div[^>]*class="[^"]*symbol-trail-page/,"SSR response must contain the rendered page root");
    assert.match(html, /<h1\b[^>]*>[\s\S]*?<\/h1>/,"SSR response must contain an H1");
    assert.ok(!/<div[^>]*id="root"[^>]*>\s*<\/div>/.test(html),"SSR response must not be an empty #root shell");
    assert.ok(!/enable javascript|javascript is required|please enable javascript/i.test(decode(html)),"SSR response must not be a generic JS-only shell");
    const fontPreloads = Array.from(html.matchAll(/<link\b[^>]*>/gi), match => match[0]).filter(link => /\brel="preload"/i.test(link) && /\bas="font"/i.test(link));
    assert.equal(fontPreloads.length, 1, "Only the above-fold Inter face should be preloaded");
    const preloadHref = fontPreloads[0].match(/\bhref="([^"]+)"/i)?.[1];
    const criticalStyle = html.match(/<style data-symbols-critical>([\s\S]*?)<\/style>/i)?.[1] || "";
    const interLatinFace = Array.from(criticalStyle.matchAll(/@font-face\s*\{([^}]*)\}/gi), match => match[1]).find(face =>
      /font-family\s*:\s*['"]?Inter['"]?\s*;/i.test(face) &&
      /unicode-range\s*:[^;]*U\+0000-00FF/i.test(face)
    );
    const interFaceUrl = interLatinFace?.match(/src\s*:\s*url\(([^)]+)\)/i)?.[1]?.replace(/^['"]|['"]$/g, "");
    const interLatinBasename = originalFontBasenames.find(name => /^UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa1ZL7W0Q5nw\.woff2$/.test(name));
    assert.ok(interLatinBasename, "The original Inter Latin WOFF2 basename should be present");
    assert.equal(preloadHref, `/fonts/symbols-${interLatinBasename}`, "The only preload should be the local Inter Latin face");
    assert.equal(interFaceUrl, preloadHref, "The Inter preload must reference the exact Inter @font-face URL");
    const embeddedFontBasenames = [...new Set(
      Array.from(criticalStyle.matchAll(/url\(([^)]+)\)/g), match => match[1].replace(/^['"]|['"]$/g, ""))
        .filter(url => url.startsWith("/fonts/symbols-"))
        .map(url => url.slice("/fonts/symbols-".length))
    )].sort();
    assert.deepEqual(embeddedFontBasenames, originalFontBasenames, "All original Google WOFF2 basenames should be preserved at first-party URLs");
    const fontFaces = Array.from(criticalStyle.matchAll(/@font-face\s*\{([^}]*)\}/gi), match => match[1]);
    const hasFace = (family, weight) => fontFaces.some(face =>
      new RegExp(`font-family\\s*:\\s*['"]?${family}['"]?\\s*;`, "i").test(face) &&
      new RegExp(`font-weight\\s*:\\s*${weight}(?:\\s*;|\\s*$)`, "i").test(face)
    );
    assert.ok(hasFace("Inter", "600"), "The original Inter 600 face should remain available");
    const localInterFallbacks = fontFaces.filter(face =>
      /font-family\s*:\s*['"]?Inter['"]?\s*;/i.test(face) && /src\s*:\s*local\s*\(/i.test(face)
    );
    assert.ok(localInterFallbacks.length, "The original local Inter alias should remain available for missing heavier weights");
    assert.ok(localInterFallbacks.every(face => /font-weight\s*:\s*700\s+900\s*;/i.test(face)), "The local Inter alias must be restricted to the original unsupplied 700–900 weight range");
    assert.ok(hasFace("Poppins", "600"), "Existing Poppins 600 face should remain available");
    assert.ok(hasFace("Poppins", "700"), "Existing Poppins 700 face should remain available");
    assert.ok(hasFace("Poppins", "800"), "Existing Poppins 800 face should remain available");
    const externalGoogleFontStylesheets = Array.from(html.matchAll(/<link\b[^>]*>/gi), match => match[0]).filter(link =>
      /\brel="stylesheet"/i.test(link) && /\bhref="https?:\/\/fonts\.googleapis\.com\/css/i.test(link)
    );
    assert.deepEqual(externalGoogleFontStylesheets, [], "This route should not retain an external Google Fonts stylesheet link");
    const pageStyleText = Array.from(html.matchAll(/<style(?:\s[^>]*)?>([\s\S]*?)<\/style>/gi), match => match[1]).find(text => text.includes(".symbol-trail-page{font-family:var(--font-sans)"));
    assert.ok(pageStyleText?.includes(".download>*+*"), "SSR must preserve literal CSS combinators inside raw-text style elements");
    assert.ok(!pageStyleText?.includes("&gt;"), "SSR must not HTML-escape CSS combinators in raw-text style elements");

    const noJsTarget = await send("Target.createTarget", { url: "about:blank" });
    noJsTargetId = noJsTarget.targetId;
    assert.notEqual(noJsTargetId, targetId, "No-JS verification must use an isolated second CDP target");
    const noJsSession = await send("Target.attachToTarget", { targetId: noJsTarget.targetId, flatten: true });
    assert.ok(noJsSession.sessionId, "CDP must attach the JavaScript-disabled page target");
    const noJsCall = (method, params={}) => send(method, params, noJsSession.sessionId);
    await noJsCall("Page.enable");
    await noJsCall("Runtime.enable");
    await noJsCall("Emulation.setScriptExecutionDisabled", { value: true });
    await noJsCall("Page.navigate", { url: base + route });
    await wait(1500);
    const noJs = await noJsCall("Runtime.evaluate", { expression: `(() => {
      const p=document.querySelector(".symbol-trail-page");
      return {root:!!p, h1:p?.querySelectorAll("h1").length||0,
        headings:Array.from(p?.querySelectorAll("h1,h2,h3,h4")||[],e=>e.textContent.replace(/\\s+/g," ").trim()),
        cards:Array.from(p?.querySelectorAll("[data-symbol-card]")||[],e=>({id:e.id,name:e.querySelector("h3")?.textContent.trim(),hindi:e.querySelector(".hindi")?.textContent.trim()})),
        hindi:p?.querySelectorAll(".hindi").length||0,crafts:p?.querySelectorAll(".craft").length||0,
        craftsText:Array.from(p?.querySelectorAll(".craft")||[],e=>e.textContent.trim()),
        riddles:p?.querySelectorAll("[data-riddle-id]").length||0,
        riddleAnswers:Array.from(p?.querySelectorAll(".answer")||[],e=>e.textContent.trim()),
        faq:p?.querySelectorAll("[data-faq-question]").length||0,
        faqAnswers:Array.from(p?.querySelectorAll(".faq-a")||[],e=>e.textContent.trim()),
        fullFaqs:Array.from(p?.querySelectorAll(".faq-a")||[],e=>!!e.textContent.trim()),
        images:Array.from(p?.querySelectorAll("img")||[],e=>({src:e.getAttribute("src"),loading:e.loading,width:e.getAttribute("width"),height:e.getAttribute("height")})),
        match:p?.querySelectorAll("[data-match-name]").length||0, passport:!!p?.querySelector('a[href="/downloads/symbol-passport.pdf"]')};
    })()`, returnByValue: true });
    const noJsReport = noJs.result.value;
    assert.ok(noJsReport.root, "JavaScript-disabled browser did not receive SSR body");
    assert.equal(noJsReport.h1, 1, "No-JS H1");
    assert.ok(noJsReport.headings.length >= 20, "No-JS page headings");
    assert.ok(noJsReport.headings.some(text => /India's Symbol Trail/.test(text)), "No-JS page H1 text");
    assert.ok(noJsReport.headings.some(text => /Match the Symbol/.test(text)), "No-JS matching section heading");
    assert.ok(noJsReport.headings.some(text => /Frequently Asked Questions/.test(text)), "No-JS FAQ heading");
    assert.equal(noJsReport.cards.length, 17, "No-JS symbol cards");
    assert.ok(noJsReport.cards.every(card => card.id.startsWith("symbol-") && card.name && card.hindi), "All no-JS cards must include ID, name and Hindi label");
    assert.equal(noJsReport.hindi, 17, "No-JS Hindi labels");
    assert.equal(noJsReport.crafts, 8, "No-JS craft cards");
    assert.ok(noJsReport.craftsText.every(text => text), "No-JS craft cards must include their full text");
    assert.equal(noJsReport.riddles, 8, "No-JS riddles");
    assert.equal(noJsReport.riddleAnswers.filter(Boolean).length, 8, "All no-JS riddle answers must be present");
    assert.equal(noJsReport.faq, 14, "No-JS FAQ questions");
    assert.equal(noJsReport.fullFaqs.filter(Boolean).length, 14, "All full FAQ answers must be in initial HTML");
    assert.equal(noJsReport.match, 12, "No-JS matching names");
    assert.ok(noJsReport.passport, "No-JS passport download");
    assert.ok(noJsReport.images.every(img => img.loading === "lazy" && img.width && img.height), "Every page image must be lazy and have width/height");
    const designDifferences = [];
    const mobileFontReports = [];
    const fontPlatformIssues = [];
    let desktopFontReport = null;
    let currentPerf;
    let identity = null;
    let removedH1 = false;
    for (const viewport of widths) {
      await call("Emulation.setDeviceMetricsOverride", { width: viewport.width, height: viewport.height, deviceScaleFactor: 1, mobile: viewport.mobile });
      const key = `${viewport.width}x${viewport.height}`;
      const expected = baseline.snapshots[key];
      const expectedSnapshot = { tree: structuredClone(expected.tree), matchNames: nameTileLabelsFromTree(expected.tree).sort() };
      normalizeTransientSnapshot(expectedSnapshot.tree);
      let actual;
      if (viewport.mobile) {
        await call("Network.enable");
        await call("Network.setCacheDisabled", { cacheDisabled: true });
        await call("Network.setBlockedURLs", { urls: ["*woff2*"] });
        await call("Page.navigate", { url: base + route });
        await waitForPage();
        const fallbackFonts = await evaluate(`Array.from(document.fonts || [],face=>({family:face.family,status:face.status,weight:face.weight}))`);
        assert.ok(!fallbackFonts.some(face => /^(Inter|Poppins)$/i.test(face.family) && face.status === "loaded"), `Blocked-font mobile pass unexpectedly loaded a branded webfont: ${JSON.stringify(fallbackFonts)}`);
        const fallback = await snapshotInBaselineNameOrder(expected.tree);
        if (JSON.stringify(fallback) !== JSON.stringify(expectedSnapshot)) {
          designDifferences.push(designDifference(key, expectedSnapshot, fallback, "font-blocked fallback"));
        } else {
          console.log(`Frozen mobile fallback snapshot matches at ${key} with webfont requests blocked.`);
        }

        await call("Network.setBlockedURLs", { urls: [] });
        await call("Network.setCacheDisabled", { cacheDisabled: false });
        await call("Page.navigate", { url: base + route });
        await waitForPage();
        const warmedFonts = await evaluate(`Array.from(document.fonts || [],face=>({family:face.family,status:face.status,weight:face.weight}))`);
        assert.ok(warmedFonts.some(face => /^Inter$/i.test(face.family) && face.status === "loaded"), `Warmed mobile page did not load Inter: ${JSON.stringify(warmedFonts)}`);
        assert.ok(warmedFonts.some(face => /^Poppins$/i.test(face.family) && face.status === "loaded"), `Warmed mobile page did not load Poppins: ${JSON.stringify(warmedFonts)}`);
        actual = await snapshotInBaselineNameOrder(expected.tree);
        const fontComparableExpected = withoutFontGeometry(expectedSnapshot);
        const fontComparableActual = withoutFontGeometry(actual);
        const geometryDifferences = findDifferences(geometryOnly(expectedSnapshot), geometryOnly(actual)).map(diff => ({
          ...diff,
          expectedElement: describeTreeNodeAtPath(expectedSnapshot.tree, diff.path),
          actualElement: describeTreeNodeAtPath(actual.tree, diff.path),
        }));
        mobileFontReports.push({
          viewport: key,
          fallbackFonts,
          warmedFonts,
          fallbackMatchesFrozenBaseline: JSON.stringify(fallback) === JSON.stringify(expectedSnapshot),
          warmedNonGeometryMatches: JSON.stringify(fontComparableExpected) === JSON.stringify(fontComparableActual),
          warmedGeometryDifferences: geometryDifferences.slice(0, 20),
        });
        console.log(`Mobile cold-fallback versus warmed-font comparison: ${JSON.stringify(mobileFontReports.at(-1))}`);
        if (JSON.stringify(fontComparableExpected) !== JSON.stringify(fontComparableActual)) {
          designDifferences.push(designDifference(key, fontComparableExpected, fontComparableActual, "font-loaded non-geometry"));
        } else if (geometryDifferences.length) {
          console.log(`Font-loaded mobile layout geometry differs from the frozen cold-font baseline at ${key}; structure, text, classes, and non-geometric computed styles match.`);
        } else {
          console.log(`Font-loaded mobile snapshot exactly matches the frozen baseline at ${key}.`);
        }
      } else {
        await call("Page.navigate", { url: base + route });
        await waitForPage();
        const desktopFontFaces = await evaluate(`Array.from(document.fonts || [],face=>({family:face.family,status:face.status,weight:face.weight}))`);
        const realInter600Loaded = desktopFontFaces.some(face => /^Inter$/i.test(face.family) && face.weight === "600" && face.status === "loaded");
        const metadata = await evaluate(`Array.from(document.querySelectorAll(".symbol-hero-meta > span")).slice(0,2).map(el=>{const style=getComputedStyle(el),rect=el.getBoundingClientRect();return {text:el.textContent.trim(),family:style.fontFamily,weight:style.fontWeight,x:Math.round(rect.x*10)/10,width:Math.round(rect.width*10)/10}})`);
        const platformMetadata = [];
        await call("DOM.getDocument", { depth: 0 });
        for (let index = 1; index <= 2; index++) {
          const nodeResult = await call("Runtime.evaluate", { expression: `document.querySelector(".symbol-hero-meta > span:nth-child(${index})")` });
          const objectId = nodeResult.result?.objectId;
          assert.ok(objectId, `Could not capture CDP object for hero metadata span ${index}`);
          const { nodeId } = await call("DOM.requestNode", { objectId });
          assert.ok(nodeId, `Could not capture DOM node for hero metadata span ${index}`);
          const { fonts } = await call("CSS.getPlatformFontsForNode", { nodeId });
          platformMetadata.push({ ...metadata[index - 1], platformFonts: fonts });
        }
        desktopFontReport = { loadedInter600: realInter600Loaded, metadata: platformMetadata };
        if (!realInter600Loaded) fontPlatformIssues.push({ issue: "Inter 600 face is not loaded", fonts: desktopFontFaces });
        for (const item of platformMetadata) {
          if (!/Inter/i.test(item.family) || item.weight !== "600") {
            fontPlatformIssues.push({ issue: "Hero metadata does not compute to Inter 600", text: item.text, family: item.family, weight: item.weight });
          }
          if (!item.platformFonts.some(font => /^Inter$/i.test(font.familyName) && font.isCustomFont && font.glyphCount > 0)) {
            fontPlatformIssues.push({ issue: "Hero metadata is not rendered with the custom Inter font", text: item.text, platformFonts: item.platformFonts });
          }
        }
        console.log(`Warmed desktop font-platform report: ${JSON.stringify(desktopFontReport)}`);
        actual = await snapshotInBaselineNameOrder(expected.tree);
        if (JSON.stringify(actual) !== JSON.stringify(expectedSnapshot)) {
          designDifferences.push(designDifference(key, expectedSnapshot, actual, "desktop warmed-font"));
        } else {
          console.log(`Warmed-font design snapshot matches frozen baseline at ${key}.`);
        }
      }
      await evaluate("scrollTo(0,0)");
      const h1Before = await evaluate(`(() => { const h=document.querySelector(".symbol-trail-page h1"); return {text:h?.textContent.trim(), identity:window.__h1Track?.node===h, removed:window.__h1Track?.removed}; })()`);
      await click("[data-depth='toddler']");
      const depth = await evaluate(`(() => {const button=document.querySelector("[data-depth='toddler']");const copy=button?.closest("[data-symbol-card]")?.querySelector("[data-detail-copy]");return {active:button?.classList.contains("active"),pressed:button?.getAttribute("aria-pressed"),text:copy?.textContent.trim(),expected:copy?.dataset.toddler}})()`);
      assert.equal(depth.active, true, "Toddler depth button should become active");
      assert.equal(depth.pressed, "true", "Toddler depth aria-pressed");
      assert.equal(depth.text, depth.expected, "Toddler depth should update the detail copy");
      const h1After = await evaluate(`(() => ({text:document.querySelector(".symbol-trail-page h1")?.textContent.trim(), identity:window.__h1Track?.node===document.querySelector(".symbol-trail-page h1"), removed:window.__h1Track?.removed}))()`);
      identity = { before: h1Before, after: h1After };
      removedH1 ||= h1Before.removed || h1After.removed || !h1Before.identity || !h1After.identity || h1Before.text !== h1After.text;

      // Bring each island close to the viewport before clicking; in addition to
      // the near-screen load, the first click must be replayed, not discarded.
      const initiallyLoaded = await evaluate(`["riddles","matching","faq"].map(name=>document.querySelector(name==="riddles"?"[data-riddle-island]":name==="matching"?"[data-match-island]":"[data-faq-island]")?.dataset[name+"Loaded"] === "true")`);
      assert.ok(initiallyLoaded.every(loaded => !loaded), "Deferred interaction islands must not load at initial page view");
      const scriptsBeforeRiddle = (await getResources()).filter(resource => resource.initiatorType === "script");
      await evaluate(`document.querySelector("[data-riddle-island]").scrollIntoView({block:"center"})`);
      const beforeRiddle = await evaluate(`document.querySelector("#riddle-0 .answer")?.hidden`);
      await click("#riddle-0");
      await waitIsland("riddles", "[data-riddle-island]");
      const riddle = await evaluate(`({hidden:document.querySelector("#riddle-0 .answer")?.hidden,expanded:document.querySelector("#riddle-0")?.getAttribute("aria-expanded")})`);
      assert.equal(beforeRiddle, true, "Riddle answer should start hidden");
      assert.equal(riddle.hidden, false, "The first riddle click should reveal its answer");
      assert.equal(riddle.expanded, "true", "Riddle expanded state");
      const scriptsAfterRiddle = (await getResources()).filter(resource => resource.initiatorType === "script");
      assert.ok(scriptsAfterRiddle.some(resource => !scriptsBeforeRiddle.some(previous => previous.name === resource.name)), "Riddle near-screen/first interaction should request a deferred script chunk");

      await waitForSelector("[data-match-island]");
      await evaluate(`document.querySelector("[data-match-island]").scrollIntoView({block:"center"})`);
      const labels = await evaluate(`Array.from(document.querySelectorAll("[data-match-name]"),e=>({id:e.dataset.matchName,label:e.dataset.matchLabel}))`);
      assert.equal(labels.length, 12, "Twelve match names");
      const illustrationIds = await evaluate(`Array.from(document.querySelectorAll("[data-match-illustration]"),e=>e.dataset.matchIllustration)`);
      assert.ok(illustrationIds.includes(labels[0].id), `Matching board lacks illustration for name ${labels[0].id}; illustrations: ${JSON.stringify(illustrationIds)}`);
      const clickContext = await evaluate(`(() => {const e=document.querySelector(${JSON.stringify(`[data-match-illustration="${labels[0].id}"]`)});return {form:!!e?.closest("form"),type:e?.getAttribute("type"),board:!!e?.closest("[data-match-island]"),location:location.href,ready:document.readyState,body:document.body?.textContent.slice(0,160)}})()`);
      assert.ok(clickContext.board, `Matching button is not in its expected board: ${JSON.stringify(clickContext)}`);
      await click(`[data-match-illustration="${labels[0].id}"]`);
      const matchingLoadAfterTap = await evaluate(`({loaded:document.querySelector("[data-match-island]")?.dataset.matchingLoaded,root:document.querySelector(".symbol-trail-page")?.dataset})`);
      assert.ok(matchingLoadAfterTap.loaded, `Matching island did not begin loading on its first tap: ${JSON.stringify(matchingLoadAfterTap)}`);
      await waitIsland("matching", "[data-match-island]");
      const firstMatchSelected = await evaluate(`document.querySelector(${JSON.stringify(`[data-match-illustration="${labels[0].id}"]`)})?.classList.contains("selected")`);
      assert.ok(firstMatchSelected, "First matching-board tap must survive deferred loading");
      const currentMatchState = await evaluate(`(() => {const b=document.querySelector("[data-match-island]");return {names:Array.from(document.querySelectorAll("[data-match-name]"),e=>e.dataset.matchName),board:!!b,buttons:b?.querySelectorAll("button").length,text:b?.textContent.slice(0,240),connected:b?.isConnected,location:location.href,ready:document.readyState,navigations:performance.getEntriesByType("navigation").length,body:document.body?.textContent.slice(0,160)}})()`);
      assert.ok(currentMatchState.names.includes(labels[0].id), `First matching name disappeared after its illustration tap: expected ${labels[0].id}, state ${JSON.stringify(currentMatchState)}`);
      await click(`[data-match-name="${labels[0].id}"]`);
      for (const {id} of labels.slice(1)) {
        await click(`[data-match-illustration="${id}"]`);
        await click(`[data-match-name="${id}"]`);
      }
      const matching = await evaluate(`(() => {const status=document.querySelector(".match-complete[role='status']");return {matched:document.querySelectorAll("[data-match-island] .match-tile.matched").length,disabled:Array.from(document.querySelectorAll("[data-match-island] .match-tile.matched"),e=>e.disabled || e.getAttribute("aria-disabled")==="true"),status:status?.textContent.trim(),statusHidden:status?.hidden}})()`);
      assert.equal(matching.matched, 24, "All 12 pairs should mark both tiles matched");
      assert.ok(matching.disabled.every(Boolean), "Matched tiles should be disabled");
      assert.equal(matching.statusHidden, false, "Completion status should become visible");
      assert.match(matching.status, /all 12 matching pairs/i);

      await evaluate(`document.querySelector("[data-faq-island]").scrollIntoView({block:"center"})`);
      const faqButton = await evaluate(`document.querySelector("[data-faq-question]")?.textContent.trim()`);
      await click("[data-faq-question]");
      await waitIsland("faq", "[data-faq-island]");
      let faq = await evaluate(`(() => {const b=document.querySelector("[data-faq-question]");const a=b?.parentElement.querySelector(".faq-a");return {expanded:b?.getAttribute("aria-expanded"),hidden:a?.hidden,text:a?.textContent.trim(),openCount:Array.from(document.querySelectorAll(".faq-a")).filter(x=>!x.hidden).length}})()`);
      assert.equal(faq.expanded, "true", "FAQ should open");
      assert.equal(faq.hidden, false, "FAQ answer should become visible");
      assert.ok(faq.text, "FAQ answer should have content");
      assert.equal(faq.openCount, 1, "Exactly one FAQ answer should be open");
      await click("[data-faq-question]");
      faq = await evaluate(`(() => {const b=document.querySelector("[data-faq-question]");const a=b?.parentElement.querySelector(".faq-a");return {expanded:b?.getAttribute("aria-expanded"),hidden:a?.hidden,openCount:Array.from(document.querySelectorAll(".faq-a")).filter(x=>!x.hidden).length}})()`);
      assert.equal(faq.expanded, "false", `FAQ should close on second activation: ${JSON.stringify({ faq, url: await evaluate("location.href"), ready: await evaluate("document.readyState"), root: await evaluate("!!document.querySelector('.symbol-trail-page')") })}`);
      assert.equal(faq.hidden, true, "FAQ answer should hide on second activation");
      assert.equal(faq.openCount, 0, "No FAQ answers should remain open");

      const pdf = await evaluate(`(async()=>{const r=await fetch("/downloads/symbol-passport.pdf");const b=new Uint8Array(await r.arrayBuffer());return {status:r.status,type:r.headers.get("content-type"),signature:Array.from(b.slice(0,5)).map(x=>String.fromCharCode(x)).join(""),print:typeof window.print,link:document.querySelector('a[href="/downloads/symbol-passport.pdf"]')?.getAttribute("download")}})()`);
      assert.equal(pdf.status, 200, "Passport PDF must return HTTP 200");
      assert.match(pdf.type || "", /application\/pdf/i, "Passport must have PDF content type");
      assert.equal(pdf.signature, "%PDF-", "Passport response must be a real PDF");
      assert.equal(pdf.print, "function", "Native PDF printing must be available");
      assert.ok(pdf.link, "Passport remains a native download link");

      currentPerf = await evaluate("window.__symbolsPerf");
    }
    await call("Network.setBlockedURLs", { urls: [] });
    await call("Network.setCacheDisabled", { cacheDisabled: false });

    await call("Emulation.setDeviceMetricsOverride", { width: 412, height: 915, deviceScaleFactor: 1, mobile: true });
    await call("Page.navigate", { url: base + route });
    await waitForPage();
    const menuBefore = await evaluate(`(() => {const button=document.querySelector('[data-testid="button-mobile-menu"]');return {exists:!!button,label:button?.getAttribute("aria-label"),open:!!document.querySelector('[data-testid="link-mobile-home"]')}})()`);
    assert.equal(menuBefore.exists, true, "SSR mobile menu toggle should exist before navigation hydration");
    assert.equal(menuBefore.label, "Open menu", "First mobile-menu activation starts closed");
    assert.equal(menuBefore.open, false, "Mobile links should start closed");
    await click('[data-testid="button-mobile-menu"]');
    await waitUntil(`(() => document.querySelector('[data-testid="button-mobile-menu"]')?.getAttribute("aria-label")==="Close menu" && !!document.querySelector('[data-testid="link-mobile-home"]'))()`, "The first mobile-menu tap must open navigation after deferred hydration");
    const firstTapMenu = await evaluate(`({label:document.querySelector('[data-testid="button-mobile-menu"]')?.getAttribute("aria-label"),home:!!document.querySelector('[data-testid="link-mobile-home"]'),themeButton:!!document.querySelector('[data-testid="button-theme-toggle"]')})`);
    assert.equal(firstTapMenu.label, "Close menu", "First tap should be replayed after navigation hydration");
    assert.ok(firstTapMenu.home, "First tap should reveal the mobile home link");
    await click('[data-testid="button-mobile-menu"]');
    await waitUntil(`document.querySelector('[data-testid="button-mobile-menu"]')?.getAttribute("aria-label")==="Open menu"`, "Mobile menu should close on its next activation");

    await call("Emulation.setDeviceMetricsOverride", { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false });
    await call("Page.navigate", { url: base + route });
    await waitForPage();
    const themeBefore = await evaluate(`(() => {const b=document.querySelector('[data-testid="button-theme-toggle"]');return {exists:!!b,visible:!!b&&b.getBoundingClientRect().width>0,label:b?.getAttribute("aria-label")}})()`);
    assert.equal(themeBefore.exists, true, "SSR theme toggle should be available before navigation hydration");
    assert.equal(themeBefore.visible, true, "Desktop theme toggle should be visible");
    assert.equal(themeBefore.label, "Switch to dark mode", "Fresh browser starts in light theme");
    await click('[data-testid="button-theme-toggle"]');
    await waitUntil(`document.documentElement.classList.contains("dark") && localStorage.getItem("rainbow-preschool-theme")==="dark"`, "The first theme-toggle tap must apply and persist dark mode");
    const darkState = await evaluate(`({rootDark:document.documentElement.classList.contains("dark"),stored:localStorage.getItem("rainbow-preschool-theme"),label:document.querySelector('[data-testid="button-theme-toggle"]')?.getAttribute("aria-label")})`);
    assert.equal(darkState.rootDark, true, "Theme toggle should apply the dark class");
    assert.equal(darkState.stored, "dark", "Theme toggle should persist dark mode");
    assert.equal(darkState.label, "Switch to light mode", "Theme toggle label should update in dark mode");

    await call("Emulation.setDeviceMetricsOverride", { width: 412, height: 915, deviceScaleFactor: 1, mobile: true });
    await call("Page.navigate", { url: base + route });
    await waitForPage();
    await click('[data-testid="button-mobile-menu"]');
    await waitUntil(`(() => document.querySelector('[data-testid="button-mobile-menu"]')?.getAttribute("aria-label")==="Close menu" && document.documentElement.classList.contains("dark") && localStorage.getItem("rainbow-preschool-theme")==="dark")()`, "Persisted dark mode should be restored when the navigation hydrates after reload");
    const persistedTheme = await evaluate(`({rootDark:document.documentElement.classList.contains("dark"),stored:localStorage.getItem("rainbow-preschool-theme"),label:document.querySelector('[data-testid="button-theme-toggle"]')?.getAttribute("aria-label")})`);
    assert.deepEqual(persistedTheme, { rootDark: true, stored: "dark", label: "Switch to light mode" }, "Dark mode should persist across reload and navigation hydration");

    console.log(`Final validation diagnostics: ${JSON.stringify({ desktopFontReport, fontPlatformIssues, hydrationDiagnostics, designDifferences, identity, removedH1 })}`);
    assert.deepEqual(fontPlatformIssues, [], `Real Inter 600 was not selected for warmed desktop metadata: ${JSON.stringify(fontPlatformIssues)}`);
    assert.deepEqual(hydrationDiagnostics, [], `React hydration errors were reported: ${JSON.stringify(hydrationDiagnostics)}`);
    assert.equal(removedH1, false, `The initial H1 node/identity changed during hydration or enhancement: ${JSON.stringify(identity)}`);
    assert.deepEqual(designDifferences, [], `Rendered design differs from frozen baseline: ${JSON.stringify(designDifferences)}`);
    await send("Target.closeTarget", { targetId: noJsTargetId });
    noJsTargetId = undefined;
    console.log(`National Symbols SSR/performance PASS: full no-JS body and FAQs, 17 cards/Hindi, 8 crafts/riddles, all lazy sized images; frozen responsive design; first-interaction islands and 12/12 matches; first-tap mobile menu, persistent dark mode, no hydration errors; native PDF ${base}/downloads/symbol-passport.pdf. LCP ${JSON.stringify(currentPerf?.lcp?.at(-1) || null)}. Mobile font comparison ${JSON.stringify(mobileFontReports)}`);
  }
} finally {
  socket?.close();
  await chrome.kill();
}

function countNodes(node) {
  return 1 + (node.children || []).reduce((count, child) => count + (child.tag ? countNodes(child) : 0), 0);
}
function designDifference(viewport, expected, actual, mode) {
  return {
    viewport,
    mode,
    expectedNodes: countNodes(expected.tree),
    actualNodes: countNodes(actual.tree),
    expectedText: flattenText(expected.tree).length,
    actualText: flattenText(actual.tree).length,
    differences: findDifferences(expected, actual).map(diff => ({
      ...diff,
      expectedElement: describeTreeNodeAtPath(expected.tree, diff.path),
      actualElement: describeTreeNodeAtPath(actual.tree, diff.path),
    })),
    structureDifferences: findStructureDifferences(expected.tree, actual.tree),
  };
}
function withoutFontGeometry(snapshot) {
  const copy = structuredClone(snapshot);
  const visit = node => {
    if (!node || typeof node !== "object" || !node.tag) return;
    delete node.box;
    for (const key of ["width","height","grid-template-columns"]) delete node.styles[key];
    for (const child of node.children || []) if (child.tag) visit(child);
  };
  visit(copy.tree);
  return copy;
}
function geometryOnly(snapshot) {
  const visit = node => {
    if (!node || typeof node !== "object" || !node.tag) return node;
    return {
      tag: node.tag,
      attrs: (node.attrs || []).filter(([name]) => ["id","class"].includes(name)),
      box: node.box,
      styles: Object.fromEntries(["width","height","grid-template-columns"].filter(key => key in node.styles).map(key => [key, node.styles[key]])),
      children: (node.children || []).map(visit),
    };
  };
  return { matchNames: snapshot.matchNames, tree: visit(snapshot.tree) };
}
function flattenText(node) {
  return (node.children || []).map(child => child.text || (child.tag ? flattenText(child) : "")).join(" ");
}
function findDifferences(expected, actual, path = "$", differences = []) {
  if (differences.length >= 20 || Object.is(expected, actual)) return differences;
  if (Array.isArray(expected) || Array.isArray(actual)) {
    if (!Array.isArray(expected) || !Array.isArray(actual)) {
      differences.push({ path, expected, actual });
      return differences;
    }
    if (expected.length !== actual.length) {
      const summarize = node => node?.tag ? `${node.tag}${(node.attrs || []).filter(([name]) => ["id","class"].includes(name)).map(([name,value]) => `[${name}=${value}]`).join("")}` : node?.text;
      differences.push({ path: `${path}.length`, expected: expected.length, actual: actual.length, expectedChildren: expected.map(summarize), actualChildren: actual.map(summarize) });
    }
    for (let i = 0; i < Math.min(expected.length, actual.length); i++) findDifferences(expected[i], actual[i], `${path}[${i}]`, differences);
    return differences;
  }
  if (expected && actual && typeof expected === "object" && typeof actual === "object") {
    for (const key of new Set([...Object.keys(expected), ...Object.keys(actual)])) findDifferences(expected[key], actual[key], `${path}.${key}`, differences);
    return differences;
  }
  differences.push({ path, expected, actual });
  return differences;
}
function findStructureDifferences(expected, actual, path = "$", differences = []) {
  if (differences.length >= 20 || Object.is(expected, actual)) return differences;
  if (Array.isArray(expected) || Array.isArray(actual)) {
    if (!Array.isArray(expected) || !Array.isArray(actual)) {
      differences.push({ path, expected, actual });
      return differences;
    }
    if (expected.length !== actual.length) differences.push({ path: `${path}.length`, expected: expected.length, actual: actual.length });
    for (let i = 0; i < Math.min(expected.length, actual.length); i++) findStructureDifferences(expected[i], actual[i], `${path}[${i}]`, differences);
    return differences;
  }
  if (expected && actual && typeof expected === "object" && typeof actual === "object") {
    for (const key of new Set([...Object.keys(expected), ...Object.keys(actual)])) {
      if (key === "box" || key === "styles") continue;
      findStructureDifferences(expected[key], actual[key], `${path}.${key}`, differences);
    }
    return differences;
  }
  differences.push({ path, expected, actual });
  return differences;
}
function describeTreeNodeAtPath(tree, path) {
  let node = tree;
  for (const match of path.matchAll(/\.children\[(\d+)\]/g)) node = node?.children?.[Number(match[1])];
  if (!node?.tag) return null;
  const attrs = Object.fromEntries((node.attrs || []).filter(([name]) => ["id","class"].includes(name)));
  return { tag: node.tag, ...attrs, text: flattenText(node).slice(0, 120) };
}
function normalizeTransientSnapshot(node, animatedAncestor = false) {
  if (node?.tag === "style") node.children = [];
  const designAttributes = new Set(["id","class","href","src","alt","style","download","target","rel","aria-label"]);
  node.attrs = (node.attrs || []).filter(([name]) => designAttributes.has(name) && !(node.tag === "img" && ["loading","width","height"].includes(name)));
  node?.attrs?.forEach(attr => {
    if (attr[0] === "style") attr[1] = normalizeInlineStyle(attr[1]);
    if (attr[0] === "class") attr[1] = attr[1].split(/\s+/).filter(Boolean).sort().join(" ");
    if (attr[0] === "aria-label" && attr[1].startsWith("Name tile:")) attr[1] = "Name tile: MATCH_NAME_TILE";
  });
  const ariaLabel = (node?.attrs || []).find(([name]) => name === "aria-label")?.[1];
  if (typeof ariaLabel === "string" && ariaLabel.startsWith("Name tile:")) node.children = [{ text: "MATCH_NAME_TILE" }];
  const isCompass = (node?.attrs || []).some(([name, value]) => name === "class" && value.split(/\s+/).includes("compass-icon"));
  if (animatedAncestor || isCompass) node.box = ["ANIMATED_COMPASS","ANIMATED_COMPASS","ANIMATED_COMPASS","ANIMATED_COMPASS"];
  if (isCompass) {
    node.styles.transform = "ANIMATED_COMPASS";
  }
  for (const child of node?.children || []) if (child.tag) normalizeTransientSnapshot(child, animatedAncestor || isCompass);
}
function normalizeInlineStyle(cssText) {
  return cssText.split(";").map(rule => rule.trim()).filter(Boolean).map(rule => rule.replace(/\s*:\s*/, ":")).join(";");
}
function nameTileLabelsFromTree(node, labels = []) {
  const ariaLabel = (node?.attrs || []).find(([name]) => name === "aria-label")?.[1];
  if (typeof ariaLabel === "string" && ariaLabel.startsWith("Name tile:")) labels.push(ariaLabel.slice("Name tile:".length).trim());
  for (const child of node?.children || []) if (child.tag) nameTileLabelsFromTree(child, labels);
  return labels;
}