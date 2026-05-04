#!/usr/bin/env node
/**
 * scripts/parse-lighthouse.mjs
 *
 * Extracts the key performance fields from a Lighthouse JSON report:
 *   - Headline metrics (Perf score, LCP, CLS, TBT, TTFB)
 *   - LCP element (selector, snippet, nodeLabel)
 *   - LCP phase breakdown: TTFB / Resource Load Delay / Resource Load Time
 *                           / Element Render Delay
 *   - Top 5 layout-shift contributors
 *   - TBT breakdown by long-task source URL
 *   - Bootup time (script eval cost)
 *   - Render-blocking resources
 *
 * Usage:
 *   npx lighthouse https://www.rainbowpreschools.com/ \
 *     --output=json --output-path=./lh-home \
 *     --only-categories=performance \
 *     --chrome-flags="--headless=new"
 *   node scripts/parse-lighthouse.mjs ./lh-home.report.json
 *
 * No npm deps — pure node:fs. Works against Lighthouse 11.x / 12.x JSON.
 */

import { readFileSync } from 'node:fs';

const filePath = process.argv[2];
if (!filePath) {
  console.error('Usage: node scripts/parse-lighthouse.mjs <lh.report.json>');
  process.exit(1);
}

const lh = JSON.parse(readFileSync(filePath, 'utf8'));
const audits = lh.audits || {};
const fmt = (ms) => `${Math.round(ms)} ms`;
const banner = (s) => console.log(`\n=== ${s} ===`);

// ---------- Headline metrics ----------
banner('Headline metrics');
console.log(`Performance score : ${Math.round((lh.categories?.performance?.score ?? 0) * 100)}`);
console.log(`LCP               : ${fmt(audits['largest-contentful-paint']?.numericValue ?? 0)}`);
console.log(`CLS               : ${(audits['cumulative-layout-shift']?.numericValue ?? 0).toFixed(3)}`);
console.log(`TBT               : ${fmt(audits['total-blocking-time']?.numericValue ?? 0)}`);
console.log(`TTFB (server)     : ${fmt(audits['server-response-time']?.numericValue ?? 0)}`);
console.log(`FCP               : ${fmt(audits['first-contentful-paint']?.numericValue ?? 0)}`);

// ---------- LCP element ----------
banner('LCP element');
const lcpEl = audits['largest-contentful-paint-element'];
const lcpItem = lcpEl?.details?.items?.[0]?.node;
if (lcpItem) {
  console.log(`Selector  : ${lcpItem.selector}`);
  console.log(`NodeLabel : ${lcpItem.nodeLabel}`);
  console.log(`Snippet   : ${(lcpItem.snippet || '').slice(0, 200)}`);
} else {
  console.log('(no LCP element details in this report)');
}

// ---------- LCP phase breakdown ----------
banner('LCP phase breakdown');
let phases = null;
for (const item of (lcpEl?.details?.items || [])) {
  if (item.type === 'table' && Array.isArray(item.items)) {
    phases = item.items;
    break;
  }
}
if (phases && phases.length) {
  for (const p of phases) {
    const timing = fmt(p.timing ?? p.duration ?? 0);
    const pct = (p.percent ?? 0);
    console.log(`${(p.phase || p.label || '?').padEnd(28)} ${timing.padStart(10)}  (${typeof pct === 'number' ? pct.toFixed(0) : pct}%)`);
  }
} else {
  const ttfb = audits['server-response-time']?.numericValue ?? 0;
  const lcpTotal = audits['largest-contentful-paint']?.numericValue ?? 0;
  console.log(`TTFB (approx)                ${fmt(ttfb)}`);
  console.log(`Load + Render (approx)       ${fmt(lcpTotal - ttfb)}`);
  console.log('(For the full 4-phase split, ensure Lighthouse >= 11 and re-run.)');
}

// ---------- Top 5 layout-shift contributors ----------
banner('Top 5 layout-shift contributors');
const ls = audits['layout-shifts'] || audits['layout-shift-elements'];
const lsItems = ls?.details?.items || [];
if (!lsItems.length) {
  console.log('(no layout-shift items — CLS may be 0, or this audit is missing)');
} else {
  lsItems
    .slice()
    .sort((a, b) => (b.score ?? b.cumulativeLayoutShiftScore ?? 0)
                  - (a.score ?? a.cumulativeLayoutShiftScore ?? 0))
    .slice(0, 5)
    .forEach((it, i) => {
      const score = (it.score ?? it.cumulativeLayoutShiftScore ?? 0).toFixed(4);
      const node  = it.node?.selector || it.node?.nodeLabel || '(no node)';
      console.log(`${i + 1}. score=${score}  ${node}`);
    });
}

// ---------- TBT by long-task source ----------
banner('TBT — long tasks by attributable URL');
const lt = audits['long-tasks']?.details?.items || [];
if (!lt.length) {
  console.log('(no long-tasks audit items)');
} else {
  const byUrl = new Map();
  for (const t of lt) {
    const url = t.url || '(unknown)';
    const blocking = Math.max(0, (t.duration ?? 0) - 50);
    byUrl.set(url, (byUrl.get(url) || 0) + blocking);
  }
  [...byUrl.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .forEach(([url, ms]) => console.log(`${fmt(ms).padStart(8)}  ${url}`));
}

// ---------- Bootup time ----------
banner('Bootup time (script eval cost)');
const bu = audits['bootup-time']?.details?.items || [];
if (!bu.length) {
  console.log('(no bootup-time items)');
} else {
  bu.slice(0, 8).forEach(it => {
    console.log(
      `${fmt(it.scripting ?? 0).padStart(8)}  parse=${fmt(it.scriptParseCompile ?? 0).padStart(8)}  ${it.url}`,
    );
  });
}

// ---------- Render-blocking resources ----------
banner('Render-blocking resources');
const rbr = audits['render-blocking-resources']?.details?.items || [];
if (!rbr.length) {
  console.log('(none)');
} else {
  rbr.forEach(it => console.log(`${fmt(it.wastedMs ?? 0).padStart(8)}  ${it.url}`));
}

console.log('\nDone.');
