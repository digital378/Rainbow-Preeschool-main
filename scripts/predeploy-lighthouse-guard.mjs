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

const THRESHOLDS = {
  performance: 60,   // score 0-100
  lcp:         4000, // ms
  cls:         0.1,
  tbt:         1200, // ms
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
  const score = (r) => r.categories.performance.score;
  return score(a) >= score(b) ? a : b;
}

function extractMetrics(lhr) {
  return {
    performance: Math.round((lhr.categories.performance.score ?? 0) * 100),
    lcp:         lhr.audits['largest-contentful-paint'].numericValue,
    cls:         lhr.audits['cumulative-layout-shift'].numericValue,
    tbt:         lhr.audits['total-blocking-time'].numericValue,
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
