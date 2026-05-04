#!/usr/bin/env node
/**
 * parse-lighthouse.mjs
 *
 * Extracts exactly the fields Section A.4 of the brief asks for:
 *   - LCP element (selector, snippet, nodeLabel)
 *   - LCP phase breakdown: TTFB / Resource Load Delay / Resource Load Time
 *                           / Element Render Delay
 *   - Top 5 layout-shift contributors
 *   - Total Blocking Time breakdown by long-task source
 *
 * Usage:  node parse-lighthouse.mjs ./lh-home.report.json
 *
 * No npm deps. Pure node:fs. Works against a Lighthouse 11.x or 12.x JSON.
 */

import { readFileSync } from 'node:fs';

const path = process.argv[2];
if (!path) {
  console.error('Usage: node parse-lighthouse.mjs <lh.json>');
  process.exit(1);
}

const lh = JSON.parse(readFileSync(path, 'utf8'));
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
// LH 11+ exposes the four phases in the second details table of
// largest-contentful-paint-element. Fallback: derive from metrics audit.
const phaseRow = lcpEl?.details?.items?.find(i => i.phase) // unlikely shape
              || null;
const phasesTable = lcpEl?.details?.items?.[1]?.items
                 || lcpEl?.details?.items?.filter(i => i.phase);

// Most reliable: the dedicated 'lcp-lazy-loaded' / 'prioritize-lcp-image' audits
// don't have phases, so we read from metrics:
const m = lh.audits?.metrics?.details?.items?.[0] || {};
const ttfb           = m.observedNavigationStart != null
                         ? (audits['server-response-time']?.numericValue ?? 0)
                         : (audits['server-response-time']?.numericValue ?? 0);
const lcpTotal       = audits['largest-contentful-paint']?.numericValue ?? 0;
const fcp            = audits['first-contentful-paint']?.numericValue ?? 0;

// LH writes the full breakdown into 'largest-contentful-paint-element' as a
// table when available. Try that first.
let phases = null;
for (const item of (lcpEl?.details?.items || [])) {
  if (item.type === 'table' && Array.isArray(item.items)) {
    phases = item.items;
    break;
  }
}

if (phases && phases.length) {
  for (const p of phases) {
    console.log(`${(p.phase || p.label || '?').padEnd(24)} ${fmt(p.timing ?? p.duration ?? 0)}  (${((p.percent ?? 0)).toFixed?.(0) ?? p.percent}%)`);
  }
} else {
  // Fallback: print the 2-phase approximation
  console.log(`TTFB (approx)            ${fmt(ttfb)}`);
  console.log(`Load + Render (approx)   ${fmt(lcpTotal - ttfb)}`);
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
  // Group blocking time by URL
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

// ---------- Bootup time, useful supplement ----------
banner('Bootup time (script eval cost)');
const bu = audits['bootup-time']?.details?.items || [];
bu.slice(0, 8).forEach(it => {
  console.log(`${fmt(it.scripting ?? 0).padStart(8)}  parse=${fmt(it.scriptParseCompile ?? 0).padStart(8)}  ${it.url}`);
});

// ---------- Diagnostics flags ----------
banner('Render-blocking resources');
(audits['render-blocking-resources']?.details?.items || [])
  .forEach(it => console.log(`${fmt(it.wastedMs ?? 0).padStart(8)}  ${it.url}`));

console.log('\nDone.');
