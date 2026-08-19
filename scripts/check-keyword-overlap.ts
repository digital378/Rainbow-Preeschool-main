#!/usr/bin/env tsx
/**
 * Keyword-overlap reporter.
 *
 * Reads seo-audits/keyword-overlap-log.json — a durable log of per-page GSC
 * query-alignment data pulled from page-audit tools (see
 * seo-audits/keyword-overlap-playbook.md for the recording format and the
 * corrective playbook) — and reports THREE kinds of signal:
 *
 *   1. OWNED-PHRASE MISMATCH — a non-excluded query recorded against page A
 *      exactly matches a reserved phrase from the keyword-ownership matrix
 *      (mirrored from scripts/check-no-title-cannibalisation.ts) whose
 *      canonical owner is a DIFFERENT url. This is the clearest signal:
 *      the page is ranking for a phrase another page is supposed to own.
 *
 *   2. EXACT CROSS-PAGE DUPLICATE — the same normalized, non-excluded query
 *      appears under 2+ distinct page urls in the log. Two pages are
 *      competing for literally the same search term.
 *
 *   3. NEAR-DUPLICATE CANDIDATE — two non-excluded queries (on the same or
 *      different pages) share enough words (Jaccard similarity on
 *      significant tokens, stopwords removed) to plausibly be the same
 *      search intent spelled/phrased differently (e.g. "pre school near me"
 *      vs "play school near me", "preschool in thane west" vs the bare
 *      "preschool in thane" owned phrase). These are lower-confidence and
 *      always reported for human review, never auto-resolved.
 *
 * This is a REPORTING tool, not a blocking guard: audit data only arrives
 * when a human supplies fresh screenshots/exports, so there is nothing to
 * gate a commit or deploy on. It always exits 0. Run it manually after
 * logging a new page's audit data into keyword-overlap-log.json:
 *
 *   npx tsx scripts/check-keyword-overlap.ts
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = process.cwd();
const LOG_PATH = "seo-audits/keyword-overlap-log.json";

// ── Keyword-ownership matrix ──────────────────────────────────────────────
// Mirrors the OWNED_PHRASES matrix in scripts/check-no-title-cannibalisation.ts
// (URL-keyed there too). Kept as a separate copy deliberately — the same
// duplication pattern already exists between that guard and
// scripts/check-body-copy-cannibalisation.ts (which mirrors it with
// canonicalFiles instead of canonicalUrls). If the matrix changes, update
// all three.
interface OwnedPhrase {
  phrase: RegExp;
  label: string;
  canonicalUrls: RegExp[];
}

const OWNED_PHRASES: OwnedPhrase[] = [
  { phrase: /\bbest preschool in thane\b/i, label: "Best Preschool in Thane", canonicalUrls: [/^\/best-preschool-near-me-in-thane$/] },
  { phrase: /\bplay school near me\b/i, label: "Play School Near Me", canonicalUrls: [/^\/play-school-near-me$/] },
  { phrase: /\bplaygroup in thane\b/i, label: "Playgroup in Thane", canonicalUrls: [/^\/playgroup$/] },
  { phrase: /\bnursery school in thane\b/i, label: "Nursery School in Thane", canonicalUrls: [/^\/nursery$/] },
  { phrase: /\bkindergarten in thane\b/i, label: "Kindergarten in Thane", canonicalUrls: [/^\/kindergarten$/] },
  { phrase: /\bpreschool admissions in thane\b/i, label: "Preschool Admissions in Thane", canonicalUrls: [/^\/preschool-admissions$/] },
  { phrase: /\bpreschool in thane\b/i, label: "Preschool in Thane", canonicalUrls: [/^\/$/] },
];

// ── Data shapes ────────────────────────────────────────────────────────────
interface QueryEntry {
  query: string;
  position: number;
  impressions: number;
  excludeFromOverlap?: boolean;
  excludeReason?: string;
}
interface AuditEntry {
  date: string;
  source: string;
  queries: QueryEntry[];
}
interface PageEntry {
  url: string;
  canonicalOwnerNote?: string;
  audits: AuditEntry[];
}
interface LogFile {
  pages: PageEntry[];
}

// Flattened row used by every detector below.
interface Row {
  url: string;
  query: string;
  normalized: string;
  position: number;
  impressions: number;
  date: string;
  source: string;
}

function loadLog(): LogFile {
  const raw = readFileSync(resolve(ROOT, LOG_PATH), "utf8");
  return JSON.parse(raw) as LogFile;
}

const STOPWORDS = new Set([
  "in", "near", "me", "the", "a", "for", "with", "and", "of", "to", "school",
]);

function normalize(query: string): string {
  return query
    .toLowerCase()
    .trim()
    .replace(/[,.']/g, "")
    .replace(/\s+/g, " ");
}

function significantTokens(normalized: string): Set<string> {
  return new Set(normalized.split(" ").filter((w) => w.length > 0 && !STOPWORDS.has(w)));
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let intersection = 0;
  for (const w of a) if (b.has(w)) intersection++;
  const union = a.size + b.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

function flattenRows(log: LogFile): Row[] {
  const rows: Row[] = [];
  for (const page of log.pages) {
    for (const audit of page.audits) {
      for (const q of audit.queries) {
        if (q.excludeFromOverlap) continue;
        rows.push({
          url: page.url,
          query: q.query,
          normalized: normalize(q.query),
          position: q.position,
          impressions: q.impressions,
          date: audit.date,
          source: audit.source,
        });
      }
    }
  }
  return rows;
}

function main(): void {
  const log = loadLog();
  const rows = flattenRows(log);

  const ownedMismatches: string[] = [];
  const exactDuplicates: string[] = [];
  const nearDuplicates: string[] = [];

  // 1. Owned-phrase mismatch
  for (const row of rows) {
    for (const rule of OWNED_PHRASES) {
      if (!rule.phrase.test(row.query)) continue;
      const ownsIt = rule.canonicalUrls.some((re) => re.test(row.url));
      if (!ownsIt) {
        ownedMismatches.push(
          `"${row.query}" (pos ${row.position}, ${row.impressions} impr, ${row.date}) recorded on ${row.url} ` +
            `matches the reserved phrase "${rule.label}", owned by ${rule.canonicalUrls
              .map((r) => r.source.replace(/^\^|\$$/g, "").replace(/\\\//g, "/"))
              .join(" or ")}.`,
        );
      }
    }
  }

  // 2. Exact cross-page duplicates
  const byNormalized = new Map<string, Row[]>();
  for (const row of rows) {
    const list = byNormalized.get(row.normalized) ?? [];
    list.push(row);
    byNormalized.set(row.normalized, list);
  }
  for (const [normalized, group] of byNormalized) {
    const distinctUrls = new Set(group.map((r) => r.url));
    if (distinctUrls.size > 1) {
      exactDuplicates.push(
        `"${normalized}" ranks on ${distinctUrls.size} different pages: ` +
          group.map((r) => `${r.url} (pos ${r.position}, ${r.impressions} impr)`).join(", "),
      );
    }
  }

  // 3. Near-duplicate candidates (pairwise, dedup by unordered normalized pair)
  const seenPairs = new Set<string>();
  for (let i = 0; i < rows.length; i++) {
    for (let j = i + 1; j < rows.length; j++) {
      const a = rows[i];
      const b = rows[j];
      if (a.normalized === b.normalized) continue; // already covered by exact-duplicate check
      const pairKey = [a.normalized, b.normalized].sort().join(" ||| ");
      if (seenPairs.has(pairKey)) continue;
      const sim = jaccard(significantTokens(a.normalized), significantTokens(b.normalized));
      if (sim >= 0.5) {
        seenPairs.add(pairKey);
        nearDuplicates.push(
          `"${a.query}" (${a.url}) vs "${b.query}" (${b.url}) — ${Math.round(sim * 100)}% token overlap. Review whether these target the same intent.`,
        );
      }
    }
  }

  console.log(`[check-keyword-overlap] ${rows.length} non-excluded quer${rows.length === 1 ? "y" : "ies"} across ${log.pages.length} page(s) in ${LOG_PATH}.\n`);

  if (ownedMismatches.length > 0) {
    console.log(`OWNED-PHRASE MISMATCHES (${ownedMismatches.length}) — a page ranks for a phrase another page owns:`);
    for (const m of ownedMismatches) console.log("  - " + m);
    console.log("");
  }

  if (exactDuplicates.length > 0) {
    console.log(`EXACT CROSS-PAGE DUPLICATES (${exactDuplicates.length}):`);
    for (const d of exactDuplicates) console.log("  - " + d);
    console.log("");
  }

  if (nearDuplicates.length > 0) {
    console.log(`NEAR-DUPLICATE CANDIDATES FOR REVIEW (${nearDuplicates.length}):`);
    for (const n of nearDuplicates) console.log("  - " + n);
    console.log("");
  }

  if (ownedMismatches.length === 0 && exactDuplicates.length === 0 && nearDuplicates.length === 0) {
    console.log("No overlaps or near-duplicates detected.");
  } else {
    console.log(
      "See seo-audits/keyword-overlap-playbook.md for how to decide between differentiating the two pages' " +
        "targeting vs. consolidating onto one canonical page.",
    );
  }

  // Reporting tool — data freshness depends on manually supplied audits, so
  // this never fails a build. Findings are surfaced for human review.
  process.exit(0);
}

main();
