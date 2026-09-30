#!/usr/bin/env node
// Text-only, screenshot-free mobile Lighthouse measurements for a local production build.
import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";
import TraceGatherer from "lighthouse/core/gather/gatherers/trace.js";
import { initializeConfig } from "lighthouse/core/config/config.js";

const screenshotCategory = "disabled-by-default-devtools.screenshot";
const screenshotAudits = new Set(["screenshot-thumbnails", "final-screenshot"]);
const url = process.env.LH_URL;
const runs = Number(process.env.LH_RUNS || "3");
if (!url || !Number.isInteger(runs) || runs < 1) {
  throw new Error("Set LH_URL to the page URL and optionally LH_RUNS to a positive integer.");
}

class ScreenshotFreeTrace extends TraceGatherer {
  async startSensitiveInstrumentation({ driver, settings }) {
    const categories = TraceGatherer.getDefaultTraceCategories()
      .filter(category => category !== screenshotCategory)
      .concat(settings.additionalTraceCategories || []);
    if (categories.includes(screenshotCategory)) throw new Error("Screenshot trace category is enabled");
    await driver.defaultSession.sendCommand("Page.enable");
    await driver.defaultSession.sendCommand("Tracing.start", {
      categories: categories.join(","),
      options: "sampling-frequency=10000",
    });
  }
}

const config = {
  extends: "lighthouse:default",
  settings: {
    formFactor: "mobile",
    throttlingMethod: "simulate",
    throttling: {
      rttMs: 150,
      throughputKbps: 1638.4,
      cpuSlowdownMultiplier: 4,
      requestLatencyMs: 0,
      downloadThroughputKbps: 0,
      uploadThroughputKbps: 0,
    },
    screenEmulation: { mobile: true, width: 412, height: 915, deviceScaleFactor: 1.75, disabled: false },
    onlyCategories: ["performance"],
    disableFullPageScreenshot: true,
    skipAudits: [...screenshotAudits],
  },
  artifacts: [{ id: "Trace", gatherer: ScreenshotFreeTrace }],
};

const { resolvedConfig } = await initializeConfig("navigation", config);
if (
  resolvedConfig.settings.disableFullPageScreenshot !== true ||
  resolvedConfig.artifacts.some(({ id }) => id === "FullPageScreenshot") ||
  resolvedConfig.audits.some(({ implementation }) => screenshotAudits.has(implementation.meta.id)) ||
  !(resolvedConfig.artifacts.find(({ id }) => id === "Trace")?.gatherer?.instance instanceof ScreenshotFreeTrace) ||
  TraceGatherer.getDefaultTraceCategories()
    .filter(category => category !== screenshotCategory)
    .concat(resolvedConfig.settings.additionalTraceCategories || [])
    .includes(screenshotCategory)
) {
  throw new Error("The resolved Lighthouse config can capture screenshots; refusing to launch Chrome");
}
console.log("Screenshot-free Lighthouse config verified");

const results = [];
for (let run = 1; run <= runs; run++) {
  const chrome = await chromeLauncher.launch({
    ...(process.env.CHROME_PATH ? { chromePath: process.env.CHROME_PATH } : {}),
    chromeFlags: ["--headless=new", "--no-sandbox", "--disable-gpu"],
  });
  try {
    const { lhr } = await lighthouse(url, { port: chrome.port, output: "json", logLevel: "error" }, config);
    if (lhr.runtimeError) throw new Error(`Lighthouse navigation failed: ${lhr.runtimeError.message}`);
    const audit = lhr.audits["largest-contentful-paint"];
    const breakdown = lhr.audits["lcp-breakdown-insight"]?.details?.items || [];
    const phases = Object.fromEntries((breakdown.find(item => item.type === "table")?.items || [])
      .map(item => [item.subpart, item.duration]));
    const element = breakdown.find(item => item.type === "node");
    const result = {
      run,
      simulatedLcpMs: audit?.numericValue ?? null,
      observedLcpPhasesMs: phases,
      lcpElement: element ? { selector: element.selector, snippet: element.snippet, text: element.nodeLabel } : null,
      cls: lhr.audits["cumulative-layout-shift"]?.numericValue ?? null,
      tbtMs: lhr.audits["total-blocking-time"]?.numericValue ?? null,
    };
    if (!Number.isFinite(result.simulatedLcpMs) || !result.lcpElement ||
        !Number.isFinite(result.observedLcpPhasesMs.timeToFirstByte)) {
      throw new Error(`Missing LCP or phase data in run ${run}: ${JSON.stringify(result)}`);
    }
    results.push(result);
    console.log(JSON.stringify(result));
  } finally {
    await chrome.kill();
  }
}

const median = values => values.slice().sort((a, b) => a - b)[Math.floor(values.length / 2)];
if (runs % 2 === 1) {
  console.log("MEDIANS", JSON.stringify({
    simulatedLcpMs: median(results.map(result => result.simulatedLcpMs)),
    ttfbMs: median(results.map(result => result.observedLcpPhasesMs.timeToFirstByte)),
    loadDelayMs: median(results.map(result => result.observedLcpPhasesMs.resourceLoadDelay ?? 0)),
    loadDurationMs: median(results.map(result => result.observedLcpPhasesMs.resourceLoadDuration ?? 0)),
    renderDelayMs: median(results.map(result => result.observedLcpPhasesMs.elementRenderDelay ?? 0)),
  }));
}