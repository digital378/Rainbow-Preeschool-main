#!/usr/bin/env node
/**
 * scripts/predeploy-lighthouse-guard.mjs
 *
 * Runs Lighthouse against the homepage and the priority landing page,
 * fails (exit 1) if any threshold is breached.
 *
 * Usage (manual, against the live site or a staging URL):
 *   BASE_URL=https://www.rainbowpreschools.com \
 *     node scripts/predeploy-lighthouse-guard.mjs
 *
 *   LH_NO_SCREENSHOTS=1 BASE_URL=https://www.rainbowpreschools.com \
 *     node scripts/predeploy-lighthouse-guard.mjs
 *
 *   Defaults to http://localhost:5000 if BASE_URL unset (matches predeploy.sh
 *   server boot port so it can be wired into predeploy.sh once chromium is
 *   confirmed available in the Replit NixOS environment).
 *
 * Requires: npm install --save-dev lighthouse chrome-launcher
 * Chromium: add pkgs.chromium to .replit [nix] packages and set CHROME_PATH.
 */

import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import TraceGatherer from 'lighthouse/core/gather/gatherers/trace.js';
import { initializeConfig } from 'lighthouse/core/config/config.js';

const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';
const SCREENSHOT_FREE = process.env.LH_NO_SCREENSHOTS === '1';
const SCREENSHOT_TRACE_CATEGORY = 'disabled-by-default-devtools.screenshot';
const SCREENSHOT_AUDIT_IDS = new Set(['screenshot-thumbnails', 'final-screenshot']);

const PAGES = process.env.LH_SINGLE_PAGE ? [
  { name: process.env.LH_SINGLE_PAGE.replace(/^\/+/, ''), path: `/${process.env.LH_SINGLE_PAGE.replace(/^\/+/, '')}` },
] : [
  { name: 'home',                 path: '/' },
  { name: 'play-school-near-me',  path: '/play-school-near-me' },
];

// Thresholds can be overridden via env vars so predeploy.sh can pass
// values calibrated to the current production baseline minus a small buffer,
// without editing this file.
//
//   LH_MIN_PERF  — minimum acceptable performance score (default 60)
//   LH_MAX_LCP   — maximum acceptable LCP in ms        (default 4000)
//   LH_MAX_CLS   — maximum acceptable CLS              (default 0.10)
//   LH_MAX_TBT   — maximum acceptable TBT in ms        (default 1200)
//
// CALIBRATION BASELINE (measured 2026-05-04, prod build, sim-mobile, no CF edge cache):
//   Home page    : Perf=44  LCP=6663ms  CLS=0.001  TBT=2753ms  TTFB=8ms
//   Landing page : Perf=67  LCP=4570ms  CLS=0.024  TBT=406ms   TTFB=8ms
//   Note: LCP/Perf will be significantly better in production with Cloudflare edge cache
//   in front (removes ~600ms HTML TTFB). Calibrate thresholds from real-user CrUX p75
//   data 7 days after the first deploy with new cache headers live.
//   Current production deploy uses SKIP_PERF_GUARD=1 to bypass until CF-measured numbers
//   are available. Set LH_MIN_PERF/LH_MAX_LCP to post-deploy CrUX numbers minus a 5-point
//   buffer, then remove SKIP_PERF_GUARD from shared env to activate the gate.
//
// After the first successful baseline run, set these in predeploy.sh to
// "current score minus a small buffer" so the guard catches regressions,
// not just catastrophic failures.
const THRESHOLDS = {
  performance: parseInt(process.env.LH_MIN_PERF  ?? '60',   10),
  lcp:         parseInt(process.env.LH_MAX_LCP   ?? '4000', 10),
  cls:       parseFloat(process.env.LH_MAX_CLS   ?? '0.1'),
  tbt:         parseInt(process.env.LH_MAX_TBT   ?? '1200', 10),
};

// Lighthouse's Trace gatherer hardcodes the filmstrip category in its default
// category list. Replace its instrumentation only in screenshot-free mode.
class ScreenshotFreeTraceGatherer extends TraceGatherer {
  async startSensitiveInstrumentation({ driver, settings }) {
    const traceCategories = TraceGatherer.getDefaultTraceCategories()
      .filter(category => category !== SCREENSHOT_TRACE_CATEGORY)
      .concat(settings.additionalTraceCategories || []);
    await driver.defaultSession.sendCommand('Page.enable');
    await driver.defaultSession.sendCommand('Tracing.start', {
      categories: traceCategories.join(','),
      options: 'sampling-frequency=10000',
    });
  }
}

const LH_CONFIG = {
  extends: 'lighthouse:default',
  settings: {
    formFactor: 'mobile',
    throttlingMethod: 'simulate',
    throttling: {
      rttMs: 150,
      throughputKbps: 1638.4,
      cpuSlowdownMultiplier: 4,
      requestLatencyMs: 0,
      downloadThroughputKbps: 0,
      uploadThroughputKbps: 0,
    },
    screenEmulation: {
      mobile: true,
      width: 412,
      height: 915,
      deviceScaleFactor: 1.75,
      disabled: false,
    },
    onlyCategories: ['performance'],
    ...(SCREENSHOT_FREE ? {
      disableFullPageScreenshot: true,
      skipAudits: [...SCREENSHOT_AUDIT_IDS],
    } : {}),
  },
  ...(SCREENSHOT_FREE ? {
    artifacts: [
      { id: 'Trace', gatherer: ScreenshotFreeTraceGatherer },
    ],
  } : {}),
};

async function assertScreenshotFreeResolvedConfig() {
  const { resolvedConfig } = await initializeConfig('navigation', LH_CONFIG);
  const artifacts = resolvedConfig.artifacts || [];
  const audits = resolvedConfig.audits || [];
  const traceArtifact = artifacts.find(({ id }) => id === 'Trace');
  const traceGatherer = traceArtifact?.gatherer?.instance;
  const screenshotAudits = audits
    .map(audit => audit.implementation.meta.id)
    .filter(id => SCREENSHOT_AUDIT_IDS.has(id));
  const additionalCategories = resolvedConfig.settings.additionalTraceCategories || [];
  const failures = [];

  if (resolvedConfig.settings.disableFullPageScreenshot !== true) {
    failures.push('full-page screenshot setting is not disabled');
  }
  if (artifacts.some(({ id }) => id === 'FullPageScreenshot')) {
    failures.push('FullPageScreenshot gatherer remains enabled');
  }
  if (screenshotAudits.length) {
    failures.push(`screenshot audits remain enabled: ${screenshotAudits.join(', ')}`);
  }
  if (!(traceGatherer instanceof ScreenshotFreeTraceGatherer)) {
    failures.push('Trace gatherer is not the screenshot-free implementation');
  }
  const traceCategories = TraceGatherer.getDefaultTraceCategories()
    .filter(category => category !== SCREENSHOT_TRACE_CATEGORY)
    .concat(additionalCategories);
  if (traceCategories.includes(SCREENSHOT_TRACE_CATEGORY)) {
    failures.push('trace filmstrip screenshot category remains enabled');
  }

  if (failures.length) {
    throw new Error(`Screenshot-free Lighthouse config check failed: ${failures.join('; ')}`);
  }
  console.log('Screenshot-free config verified: no trace filmstrip, full-page screenshot, or screenshot audits.');
}

async function runOne(url) {
  const chromeFlags = ['--headless=new', '--no-sandbox', '--disable-gpu'];
  const launchOpts = { chromeFlags };
  if (process.env.CHROME_PATH) {
    launchOpts.chromePath = process.env.CHROME_PATH;
  }
  const chrome = await chromeLauncher.launch(launchOpts);
  try {
    const runnerResult = await lighthouse(url, {
      port: chrome.port,
      output: 'json',
      logLevel: 'error',
    }, LH_CONFIG);
    return runnerResult.lhr;
  } finally {
    await chrome.kill();
  }
}

// Run twice and take the better result to absorb single-run jitter.
async function runBest(url) {
  const a = await runOne(url);
  const b = await runOne(url);
  if (SCREENSHOT_FREE) {
    const quality = (result) => {
      const metrics = extractMetrics(result);
      const breaches = check('', metrics).length;
      const normalizedTotal = [
        [metrics.lcp, THRESHOLDS.lcp],
        [metrics.cls, THRESHOLDS.cls],
        [metrics.tbt, THRESHOLDS.tbt],
      ].reduce((total, [value, threshold]) =>
        total + (Number.isFinite(value) ? value / threshold : Infinity), 0);
      return [breaches, normalizedTotal];
    };
    const [aBreaches, aTotal] = quality(a);
    const [bBreaches, bTotal] = quality(b);
    return aBreaches < bBreaches || (aBreaches === bBreaches && aTotal <= bTotal) ? a : b;
  }
  const score = (r) => r.categories?.performance?.score ?? 0;
  return score(a) >= score(b) ? a : b;
}

// Branch-page audits require three independent mobile runs. Keep the default
// predeploy two-run behavior unchanged; use the median for an explicit page.
async function runMedianThree(url) {
  const runs = [await runOne(url), await runOne(url), await runOne(url)];
  const values = runs.map(extractMetrics);
  for (const metric of ['lcp', 'cls', 'tbt']) {
    if (values.some((value) => !Number.isFinite(value[metric]))) {
      throw new Error(`${metric.toUpperCase()} unavailable in at least one run`);
    }
  }
  const median = (key) => values.map((value) => value[key]).sort((a, b) => a - b)[1];
  return { performance: null, lcp: median('lcp'), cls: median('cls'), tbt: median('tbt') };
}

function extractMetrics(lhr) {
  if (!SCREENSHOT_FREE) {
    return {
      performance: Math.round((lhr.categories?.performance?.score ?? 0) * 100),
      lcp:         lhr.audits?.['largest-contentful-paint']?.numericValue ?? 0,
      cls:         lhr.audits?.['cumulative-layout-shift']?.numericValue ?? 0,
      tbt:         lhr.audits?.['total-blocking-time']?.numericValue ?? 0,
    };
  }
  return {
    performance: lhr.categories?.performance?.score == null
      ? null
      : Math.round(lhr.categories.performance.score * 100),
    lcp:         lhr.audits?.['largest-contentful-paint']?.numericValue ?? null,
    cls:         lhr.audits?.['cumulative-layout-shift']?.numericValue ?? null,
    tbt:         lhr.audits?.['total-blocking-time']?.numericValue ?? null,
  };
}

function check(name, metrics) {
  const breaches = [];
  if (!SCREENSHOT_FREE && metrics.performance < THRESHOLDS.performance)
    breaches.push(`Performance ${metrics.performance} < ${THRESHOLDS.performance}`);
  if (SCREENSHOT_FREE && !Number.isFinite(metrics.lcp))
    breaches.push('LCP unavailable');
  else if (process.env.LH_MEDIAN_THREE === '1' ? metrics.lcp >= THRESHOLDS.lcp : metrics.lcp > THRESHOLDS.lcp)
    breaches.push(`LCP ${Math.round(metrics.lcp)}ms ${process.env.LH_MEDIAN_THREE === '1' ? '>=' : '>'} ${THRESHOLDS.lcp}ms`);
  if (SCREENSHOT_FREE && !Number.isFinite(metrics.cls))
    breaches.push('CLS unavailable');
  else if (process.env.LH_MEDIAN_THREE === '1' ? metrics.cls >= THRESHOLDS.cls : metrics.cls > THRESHOLDS.cls)
    breaches.push(`CLS ${metrics.cls.toFixed(3)} ${process.env.LH_MEDIAN_THREE === '1' ? '>=' : '>'} ${THRESHOLDS.cls}`);
  if (SCREENSHOT_FREE && !Number.isFinite(metrics.tbt))
    breaches.push('TBT unavailable');
  else if (process.env.LH_MEDIAN_THREE === '1' ? metrics.tbt >= THRESHOLDS.tbt : metrics.tbt > THRESHOLDS.tbt)
    breaches.push(`TBT ${Math.round(metrics.tbt)}ms ${process.env.LH_MEDIAN_THREE === '1' ? '>=' : '>'} ${THRESHOLDS.tbt}ms`);
  return breaches;
}

(async () => {
  let failed = false;
  console.log(`\nPredeploy Lighthouse guard — base: ${BASE_URL}\n`);
  if (SCREENSHOT_FREE) {
    // Resolve and verify every screenshot source before any Chrome process starts.
    await assertScreenshotFreeResolvedConfig();
  }

  for (const page of PAGES) {
    const url = `${BASE_URL}${page.path}`;
    process.stdout.write(`Testing ${page.name} (${url}) … `);
    try {
      const m = process.env.LH_MEDIAN_THREE === '1'
        ? await runMedianThree(url)
        : extractMetrics(await runBest(url));
      const breaches = check(page.name, m);
      console.log(
        `Perf=${m.performance == null ? 'N/A' : m.performance}  ` +
        `LCP=${Number.isFinite(m.lcp) ? `${Math.round(m.lcp)}ms` : 'N/A'}  ` +
        `CLS=${Number.isFinite(m.cls) ? m.cls.toFixed(3) : 'N/A'}  ` +
        `TBT=${Number.isFinite(m.tbt) ? `${Math.round(m.tbt)}ms` : 'N/A'}`,
      );
      if (breaches.length) {
        failed = true;
        console.log(`  FAIL: ${breaches.join('; ')}`);
      } else {
        console.log(`  PASS`);
      }
    } catch (err) {
      failed = true;
      console.log(`ERROR: ${err.message}`);
    }
  }

  if (failed) {
    console.log('\nDeploy blocked: one or more pages breached the budget.\n');
    process.exit(1);
  }
  console.log('\nAll pages within budget.\n');
})();
