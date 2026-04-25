#!/usr/bin/env tsx
/**
 * Keyword-targets smoke-test for the 5 commercial destination pages.
 *
 * Verifies that the 15-keyword SEO recovery work stays in place over time.
 * Run after every edit to:
 *   - server/redirects.ts                 (ghost-slug variants → canonical)
 *   - server/ssr-pages.ts                 (commercial-page schema + content)
 *   - server/bot-ssr.ts                   (renderer for `links` field)
 *   - client/src/App.tsx, sitemaps        (no /preschool-near-me references)
 *
 * Asserts (as Googlebot):
 *   1. Each of the 5 commercial pages emits FAQPage JSON-LD.
 *   2. Each programme page (/playgroup, /nursery, /kindergarten) emits an
 *      EducationalOrganization / Organization schema (parity with the locality
 *      pages).
 *   3. /play-school-near-me and /best-preschool-near-me-in-thane each have a
 *      visible body with at least 1,200 words of meaningful prose (length
 *      proxy for content depth).
 *   4. The homepage emits anchor tags to all 5 commercial URLs in the body.
 *   5. Each commercial page emits a self-referential <link rel="canonical">
 *      pointing at its own URL (protects against the historical bug where
 *      /preschool-near-me declared a canonical to /best-preschool-near-me-in-thane).
 *   6. Each commercial page emits the visible "Reviewed by Rainbow Preschool
 *      Curriculum Team" byline (E-E-A-T trust signal; per the editorial rule
 *      no individual person name may appear).
 *   7. Every ghost slug (and trailing-slash variant) returns 301 to its
 *      canonical destination.
 *   8. /preschool-near-me 301s to /best-preschool-near-me-in-thane.
 *   9. /playschool-near-me 301s to /play-school-near-me (NOT to
 *      /best-preschool-near-me-in-thane — historical bug).
 *
 * Usage:
 *   tsx scripts/check-keyword-targets.ts                                # localhost:5000
 *   tsx scripts/check-keyword-targets.ts https://www.rainbowpreschools.com
 *
 * Exit codes:
 *   0 — all assertions passed
 *   1 — one or more assertions failed (details printed)
 *   2 — could not reach the server at all
 */

const BASE = (process.argv[2] || "http://localhost:5000").replace(/\/$/, "");
const UA = "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";
const FETCH_TIMEOUT_MS = 15_000;

const SITE_BASE_URL = "https://www.rainbowpreschools.com";

const COMMERCIAL_PAGES = [
  "/playgroup",
  "/nursery",
  "/kindergarten",
  "/play-school-near-me",
  "/best-preschool-near-me-in-thane",
];

const PROGRAMME_PAGES = ["/playgroup", "/nursery", "/kindergarten"];

const BYLINE = "Reviewed by Rainbow Preschool Curriculum Team";

const DEEP_CONTENT_PAGES = [
  "/play-school-near-me",
  "/best-preschool-near-me-in-thane",
];
const DEEP_CONTENT_MIN_WORDS = 1200;

// Every ghost-slug variant defined in server/redirects.ts must be tested in
// BOTH bare and trailing-slash form. The list below is generated from a base
// mapping so it can never drift partial again.
const REDIRECT_BASE: Array<{ from: string; to: string }> = [
  { from: "/preschool-near-me", to: "/best-preschool-near-me-in-thane" },
  { from: "/playschool-near-me", to: "/play-school-near-me" },
  { from: "/playgroup-near-me", to: "/playgroup" },
  { from: "/nursery-near-me", to: "/nursery" },
  { from: "/kindergarten-near-me", to: "/kindergarten" },
  { from: "/best-playschool-near-me", to: "/play-school-near-me" },
  { from: "/best-playschool-in-thane", to: "/play-school-near-me" },
  { from: "/best-kindergarten-in-thane", to: "/kindergarten" },
  { from: "/best-kindergarten-near-me", to: "/kindergarten" },
  { from: "/playgroup-thane", to: "/playgroup" },
  { from: "/nursery-thane", to: "/nursery" },
  { from: "/kindergarten-thane", to: "/kindergarten" },
  { from: "/play-school-thane", to: "/play-school-near-me" },
  { from: "/playschool-thane", to: "/play-school-near-me" },
  { from: "/best-preschool-thane", to: "/best-preschool-near-me-in-thane" },
  { from: "/preschool-thane", to: "/best-preschool-near-me-in-thane" },
  // Soft-duplicate guard: /preschool-in-thane previously fell through to
  // the SPA shell and rendered the homepage canonical (=/), leaking
  // commercial-keyword equity. Must 301 to the canonical commercial page.
  { from: "/preschool-in-thane", to: "/best-preschool-near-me-in-thane" },

  // ── Wave-2 soft-duplicate guard (Apr 2026 sweep) ─────────────────────────
  // These are the next wave of keyword-close slugs that were returning 200
  // via the SPA shell instead of 301-ing to the canonical commercial page.
  // Each one splits ranking signal from the true destination page.
  { from: "/preschool-near-me-in-thane", to: "/best-preschool-near-me-in-thane" },
  { from: "/best-preschool-near-me", to: "/best-preschool-near-me-in-thane" },
  { from: "/pre-school-thane", to: "/best-preschool-near-me-in-thane" },
  { from: "/playschool-in-thane", to: "/play-school-near-me" },
  { from: "/best-play-school-near-me", to: "/play-school-near-me" },
  { from: "/best-play-school-in-thane", to: "/play-school-near-me" },
  { from: "/best-nursery-near-me", to: "/nursery" },
  { from: "/best-nursery-in-thane", to: "/nursery" },
  { from: "/best-playgroup-near-me", to: "/playgroup" },
  { from: "/best-playgroup-in-thane", to: "/playgroup" },
  // Locality short-form slugs (without -thane suffix)
  { from: "/preschool-in-manpada", to: "/preschool-in-manpada-thane" },
  { from: "/preschool-in-hariniwas", to: "/preschool-in-hariniwas-thane" },
  { from: "/preschool-in-anand-nagar", to: "/preschool-in-anand-nagar-thane" },
  { from: "/preschool-in-dhokali", to: "/preschool-in-dhokali-thane" },
  { from: "/preschool-in-kalwa", to: "/preschool-in-kalwa-thane" },
  { from: "/preschool-in-kasarvadavali", to: "/preschool-in-kasarvadavali-thane" },
  // Broken internal link from nursery SSR page
  { from: "/nursery-school-admission-thane", to: "/nursery" },

  // ── Wave-3 legacy → commercial consolidation (Apr 2026) ──────────────────
  // The legacy /preschool-admission-process-guide is a near-duplicate of the
  // commercial /preschool-admissions page (same documents, fees, process,
  // "what to look for" content). 301 to concentrate ranking signal on the
  // single commercial keeper. Smoke-tested in BOTH bare and trailing-slash
  // form by the REDIRECT_BASE → REDIRECTS expansion below.
  { from: "/preschool-admission-process-guide", to: "/preschool-admissions" },
];

const REDIRECTS: Array<{ from: string; to: string }> = REDIRECT_BASE.flatMap(
  (r) => [r, { from: `${r.from}/`, to: r.to }]
);

type Failure = { url: string; reason: string };

async function fetchHtml(path: string): Promise<{ status: number; html: string }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(`${BASE}${path}`, {
      headers: { "User-Agent": UA },
      signal: controller.signal,
      redirect: "manual",
    });
    let html = "";
    try {
      html = await res.text();
    } catch {
      // ignore body read errors on redirects
    }
    return { status: res.status, html };
  } finally {
    clearTimeout(timer);
  }
}

async function fetchRedirect(
  path: string
): Promise<{ status: number; location: string | null }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(`${BASE}${path}`, {
      headers: { "User-Agent": UA },
      signal: controller.signal,
      redirect: "manual",
    });
    return { status: res.status, location: res.headers.get("location") };
  } finally {
    clearTimeout(timer);
  }
}

function countVisibleWords(html: string): number {
  const bodyMatch = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i);
  const target = bodyMatch ? bodyMatch[1] : html;
  const stripped = target
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&[a-z]+;/gi, " ");
  const words = stripped.trim().split(/\s+/).filter(Boolean);
  return words.length;
}

function hasFaqPageJsonLd(html: string): boolean {
  return /"@type"\s*:\s*"FAQPage"/.test(html);
}

function hasOrgJsonLd(html: string): boolean {
  return /"@type"\s*:\s*"(Educational)?Organization"/.test(html);
}

function hasReviewJsonLd(html: string): boolean {
  return /"@type"\s*:\s*"Review"/.test(html);
}

function hasNoPersonAuthor(html: string): boolean {
  // Per editorial rule, no Person nodes may appear as author/reviewer/contributor
  // in newly added schema. Locate JSON-LD blocks and ensure none of them declare
  // an author with @type Person. This catches accidental regressions even if a
  // Person node is unrelated to a review (e.g. blog author).
  const blocks = html.match(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi) || [];
  for (const block of blocks) {
    if (/"author"\s*:\s*\{[^}]*"@type"\s*:\s*"Person"/.test(block)) return false;
    if (/"reviewer"\s*:\s*\{[^}]*"@type"\s*:\s*"Person"/.test(block)) return false;
  }
  return true;
}

function hasSelfCanonical(html: string, path: string): boolean {
  const expected = `${SITE_BASE_URL}${path}`;
  const re = /<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i;
  const m = html.match(re);
  if (!m) return false;
  return m[1] === expected || m[1] === `${expected}/`;
}

function hasOrgByline(html: string): boolean {
  return html.includes(BYLINE);
}

function hasAnchorTo(html: string, path: string): boolean {
  // Match anchors with absolute or relative href ending with the path
  const escaped = path.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`<a[^>]+href="[^"]*${escaped}(?:[/?#"]|")`, "i");
  return re.test(html);
}

async function main(): Promise<void> {
  console.log(`[check-keyword-targets] BASE=${BASE}`);
  const failures: Failure[] = [];
  let reachableCount = 0;

  // 1+2: schema parity on commercial pages
  for (const path of COMMERCIAL_PAGES) {
    try {
      const { status, html } = await fetchHtml(path);
      if (status === 0) continue;
      reachableCount++;
      if (status !== 200) {
        failures.push({ url: path, reason: `status=${status}` });
        continue;
      }
      if (!hasFaqPageJsonLd(html)) {
        failures.push({ url: path, reason: "missing FAQPage JSON-LD" });
      }
      if (PROGRAMME_PAGES.includes(path) && !hasOrgJsonLd(html)) {
        failures.push({ url: path, reason: "missing Organization JSON-LD" });
      }
      if (PROGRAMME_PAGES.includes(path) && !hasReviewJsonLd(html)) {
        failures.push({ url: path, reason: "missing Review JSON-LD (3 org-authored reviews expected)" });
      }
      if (PROGRAMME_PAGES.includes(path) && !hasNoPersonAuthor(html)) {
        failures.push({
          url: path,
          reason: "found a Person author/reviewer in JSON-LD (editorial rule: org-only)",
        });
      }
      if (!hasSelfCanonical(html, path)) {
        failures.push({
          url: path,
          reason: `canonical link is missing or does not point to ${SITE_BASE_URL}${path}`,
        });
      }
      if (!hasOrgByline(html)) {
        failures.push({
          url: path,
          reason: `missing visible "${BYLINE}" byline`,
        });
      }
    } catch (err) {
      failures.push({
        url: path,
        reason: `fetch failed: ${(err as Error).message}`,
      });
    }
  }

  // 3: deep-content pages have ≥ DEEP_CONTENT_MIN_WORDS in <main>
  for (const path of DEEP_CONTENT_PAGES) {
    try {
      const { status, html } = await fetchHtml(path);
      if (status !== 200) continue;
      const wc = countVisibleWords(html);
      if (wc < DEEP_CONTENT_MIN_WORDS) {
        failures.push({
          url: path,
          reason: `word count ${wc} < ${DEEP_CONTENT_MIN_WORDS} (content too thin)`,
        });
      } else {
        console.log(`  [info] ${path} word count = ${wc}`);
      }
    } catch (err) {
      failures.push({
        url: path,
        reason: `fetch failed: ${(err as Error).message}`,
      });
    }
  }

  // 4: homepage anchors to all 5 commercial pages
  try {
    const { status, html } = await fetchHtml("/");
    if (status === 200) {
      for (const target of COMMERCIAL_PAGES) {
        if (!hasAnchorTo(html, target)) {
          failures.push({
            url: "/",
            reason: `homepage missing anchor to ${target}`,
          });
        }
      }
    } else {
      failures.push({ url: "/", reason: `status=${status}` });
    }
  } catch (err) {
    failures.push({
      url: "/",
      reason: `fetch failed: ${(err as Error).message}`,
    });
  }

  // 5+6+7: ghost-slug 301s
  for (const r of REDIRECTS) {
    try {
      const { status, location } = await fetchRedirect(r.from);
      if (status !== 301) {
        failures.push({
          url: r.from,
          reason: `expected 301, got ${status}`,
        });
        continue;
      }
      if (!location || !location.endsWith(r.to)) {
        failures.push({
          url: r.from,
          reason: `expected redirect to ${r.to}, got ${location ?? "<none>"}`,
        });
      }
    } catch (err) {
      failures.push({
        url: r.from,
        reason: `fetch failed: ${(err as Error).message}`,
      });
    }
  }

  if (reachableCount === 0) {
    console.error(
      `[check-keyword-targets] FATAL: could not reach ${BASE} at all.`
    );
    process.exit(2);
  }

  if (failures.length > 0) {
    console.error(
      `\n[check-keyword-targets] FAILED — ${failures.length} assertion(s):`
    );
    for (const f of failures) {
      console.error(`  [FAIL] ${f.url}  ${f.reason}`);
    }
    process.exit(1);
  }

  console.log(
    `\n[check-keyword-targets] PASSED — ${COMMERCIAL_PAGES.length} commercial pages have full schema + self-canonical + curriculum-team byline, ${DEEP_CONTENT_PAGES.length} deep-content pages meet word target, homepage links to all 5, ${REDIRECTS.length} ghost slugs 301 correctly.`
  );
  process.exit(0);
}

main().catch((err) => {
  console.error(`[check-keyword-targets] Unexpected error:`, err);
  process.exit(1);
});
