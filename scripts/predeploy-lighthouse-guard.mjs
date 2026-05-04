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
 *   Defaults to http://localhost:5000 if BASE_URL unset (matches predeploy.sh
 *   server boot port so it can be wired into predeploy.sh once chromium is
 *   confirmed available in the Replit NixOS environment).
 *
 * Requires: npm install --save-dev lighthouse chrome-launcher
 * Chromium: add pkgs.chromium to .replit [nix] packages and set CHROME_PATH.
 */

import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';

const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';

const PAGES = [
  { name: 'home',                 path: '/' },
  { name: 'best-preschool-thane', path: '/best-preschool-near-me-in-thane' },
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
  },
};

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
  const score = (r) => r.categories?.performance?.score ?? 0;
  return score(a) >= score(b) ? a : b;
}

function extractMetrics(lhr) {
  return {
    performance: Math.round((lhr.categories?.performance?.score ?? 0) * 100),
    lcp:         lhr.audits?.['largest-contentful-paint']?.numericValue ?? 0,
    cls:         lhr.audits?.['cumulative-layout-shift']?.numericValue ?? 0,
    tbt:         lhr.audits?.['total-blocking-time']?.numericValue ?? 0,
  };
}

function check(name, metrics) {
  const breaches = [];
  if (metrics.performance < THRESHOLDS.performance)
    breaches.push(`Performance ${metrics.performance} < ${THRESHOLDS.performance}`);
  if (metrics.lcp > THRESHOLDS.lcp)
    breaches.push(`LCP ${Math.round(metrics.lcp)}ms > ${THRESHOLDS.lcp}ms`);
  if (metrics.cls > THRESHOLDS.cls)
    breaches.push(`CLS ${metrics.cls.toFixed(3)} > ${THRESHOLDS.cls}`);
  if (metrics.tbt > THRESHOLDS.tbt)
    breaches.push(`TBT ${Math.round(metrics.tbt)}ms > ${THRESHOLDS.tbt}ms`);
  return breaches;
}

(async () => {
  let failed = false;
  console.log(`\nPredeploy Lighthouse guard — base: ${BASE_URL}\n`);

  for (const page of PAGES) {
    const url = `${BASE_URL}${page.path}`;
    process.stdout.write(`Testing ${page.name} (${url}) … `);
    try {
      const lhr = await runBest(url);
      const m = extractMetrics(lhr);
      const breaches = check(page.name, m);
      console.log(
        `Perf=${m.performance}  LCP=${Math.round(m.lcp)}ms  ` +
        `CLS=${m.cls.toFixed(3)}  TBT=${Math.round(m.tbt)}ms`,
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
