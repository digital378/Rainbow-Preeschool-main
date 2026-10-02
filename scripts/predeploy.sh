#!/usr/bin/env bash
# Pre-deploy guard.
#
# Runs static guards first (fast, no build needed), then the production build,
# boots the built server in the background, waits for it to start serving on
# $PREDEPLOY_PORT (default 5000), and then runs the SEO smoke-tests against
# the same already-booted server:
#
#   1.  scripts/check-no-person-author.ts — static scan that fails if any
#       file under client/src, server, shared, or scripts emits a JSON-LD
#       `"@type": "Person"` node under author / reviewer / reviewedBy /
#       contributor / creator / publisher / editor, or sneaks an
#       individual-name byline into a review/testimonial/parent context.
#       Runs first because it's a fast static check that doesn't need a
#       build or a booted server — fail fast before paying the build cost.
#   2.  scripts/check-no-title-cannibalisation.ts — static scan that fails if
#       any page title poaches a keyword owned by another canonical URL, uses a
#       banned soft-marketing word, exceeds 65 chars, or has SSR/client parity
#       drift.
#   3.  scripts/check-description-length.ts — static scan that fails if any
#       meta-description literal exceeds 155 characters.
#   4.  scripts/check-bot-ua-list.ts — static scan that fails if a social-app
#       in-app browser UA (WhatsApp, Pinterest, Instagram, etc.) has been
#       accidentally added to BOT_USER_AGENTS.
#   5.  scripts/check-h1-parity.ts — static scan that fails if the SSR h1:
#       field in server/ssr-pages.ts does not exactly match the <h1> in the
#       corresponding client TSX page.
#   6.  scripts/check-soft-marketing-words.ts — static scan that warns (non-
#       blocking) if any body-copy file contains banned soft-marketing words.
#   7.  scripts/check-no-pink.ts — static scan that fails if any pink Tailwind
#       utility (`pink-NNN`), pink palette hex (#ec4899, #fce7f3, …), or pink
#       CSS named colour appears under client/src, server, shared, scripts, or
#       in client/index.html. The brand uses red/primary (#dc2626) only; pink
#       is permanently off-brand.
#   8.  scripts/check-eeat-show-rating.ts — static scan that fails if any
#       <EEATSignals> JSX call in client/src/pages/*.tsx is missing
#       showRating={false} (or, for verified-rating pages, is missing the
#       import from client/src/lib/verified-rating.ts). Emitting star-rating
#       rich-result markup without a verified source violates Google policy.
#   9.  scripts/check-sitemap-blog-slugs.ts — static scan that fails if any
#       "critical" blog slug (i.e. a post served by a dedicated Express route
#       AND expected in /sitemap.xml) has been accidentally removed from
#       server/seed-blog-posts.ts → seoRecoveryBlogPosts. Because the sitemap
#       is built dynamically from storage.getBlogPosts() (which reads the seed),
#       removing a slug from the seed silently drops it from the sitemap with
#       no HTTP error. This guard makes that invisible removal visible before
#       the build step.
#   10. scripts/check-standalone-blog-pages.ts — static scan that fails if any
#       .html file under blog-pages/ is missing (a) at least one JSON-LD block,
#       (b) a <link rel="canonical"> tag, (c) a <meta name="description"> with
#       content ≥ 100 chars, or (d) a <title> element ≤ 65 chars. These pages
#       are served directly by Express and are not covered by any of the other
#       static guards that scan server/ssr-pages.ts or client/src/pages/.
#   11. npm run build — production build.
#   12. Boot the production server on $PREDEPLOY_URL for the HTTP smoke-tests.
#   13. scripts/check-freshness-signal.ts — asserts the visible "Last updated"
#       byline + page-specific JSON-LD dateModified across the commercial +
#       locality URLs.
#   14. scripts/check-keyword-targets.ts — asserts the 15 priority commercial
#       keyword guarantees: FAQPage JSON-LD on the surviving commercial pages,
#       Organization JSON-LD on /playgroup, /nursery, /kindergarten, ≥ 1,200
#       visible words inside <main> on /play-school-near-me, the homepage
#       linking to all surviving commercial URLs, all ghost/merged URL variants
#       301-redirecting directly to their canonical page (including trailing
#       slash forms), and /preschool-near-me 301-redirecting to
#       /play-school-near-me.
#   15. scripts/check-sitemap-200.ts — fetches /sitemap.xml and asserts every
#       <loc> entry returns 200 OK. Catches any sitemap row that has been
#       301-redirected (which would surface the "URL is in sitemap but
#       redirects" warning in Google Search Console). Also explicitly checks
#       the STANDALONE_ROUTES list (e.g. /blog/independence-day-for-kids) with
#       Googlebot UA independent of the sitemap, so a misconfigured static-HTML
#       Express route is caught even if the slug is temporarily absent from the
#       sitemap.
#   16. scripts/check-bot-detection.ts — asserts that social-app in-app browser
#       UAs receive the React shell (not the SSR page).
#   16b. scripts/check-ad-pages.ts — standalone ad landing-page guard:
#       asserts the ad HTML build artifact exists in dist/ad-assets/ and
#       matches its source, every local asset it references exists in
#       dist/public, the route returns 200 for normal + Googlebot UAs, and
#       the served HTML has no unresolved/empty FIREBASE_* config values.
#   16c. scripts/check-crawler-metadata.ts — crawler-metadata regression
#       check: enumerates every sitemap URL + client-router route and, for a
#       spoofed Googlebot UA, asserts title/description/canonical are
#       present, self-referencing, and distinct from both the raw SPA-shell
#       values and the homepage's — the failure signature of a route that's
#       missing its server/ssr-pages.ts entry. Also spot-checks Claude-User
#       and Perplexity-User (answer-engine fetchers) on a few routes to
#       confirm they're recognized by BOT_USER_AGENTS in server/bot-ssr.ts.
#   16d. scripts/check-local-reel-media.ts — verifies every mapped local
#       Theatre reel has playable MP4 and WebM files with positive duration,
#       served as video with HTTP byte-range support.
#   17. Lighthouse performance guard — simulated-mobile Lighthouse audit against
#       home + priority landing page. Skippable with SKIP_PERF_GUARD=1.
#   18. Leave the production Cloudflare cache untouched. This validation
#       script also runs locally and during a deployment build, before the
#       new release is live. A cache purge belongs after a successful publish.
#
# The HTTP-based checks (12–15) run against the SAME booted server so we only
# pay the build-and-boot cost once. The deploy is blocked (non-zero exit)
# if ANY check fails — the HTTP checks are run regardless of each other's
# result so a single deploy attempt surfaces every regression at once instead
# of one-at-a-time.
#
# Wired into .replit [deployment].build so it runs automatically on every
# deploy. Can also be invoked manually:
#   bash scripts/predeploy.sh

set -u
set -o pipefail

PREDEPLOY_PORT="${PREDEPLOY_PORT:-5000}"
PREDEPLOY_HOST="127.0.0.1"
PREDEPLOY_URL="http://${PREDEPLOY_HOST}:${PREDEPLOY_PORT}"
WAIT_TIMEOUT_SECS="${PREDEPLOY_WAIT_SECS:-60}"
SERVER_LOG="$(mktemp -t predeploy-server.XXXXXX.log)"
SERVER_PID=""

log() {
  echo "[predeploy] $*"
}

cleanup() {
  if [ -n "${SERVER_PID}" ] && kill -0 "${SERVER_PID}" 2>/dev/null; then
    log "stopping smoke-test server (pid=${SERVER_PID})"
    kill "${SERVER_PID}" 2>/dev/null || true
    # Give it a moment to shut down cleanly, then force-kill if still alive.
    for _ in 1 2 3 4 5; do
      if ! kill -0 "${SERVER_PID}" 2>/dev/null; then
        break
      fi
      sleep 1
    done
    if kill -0 "${SERVER_PID}" 2>/dev/null; then
      kill -9 "${SERVER_PID}" 2>/dev/null || true
    fi
  fi
  if [ -n "${SERVER_LOG}" ] && [ -f "${SERVER_LOG}" ]; then
    rm -f "${SERVER_LOG}"
  fi
}
trap cleanup EXIT INT TERM

log "step 1/18 — tsx scripts/check-no-person-author.ts (editorial-byline guard)"
if ! npx --no-install tsx scripts/check-no-person-author.ts; then
  log "FAIL — editorial-byline guard found a Person author/reviewer/contributor entry. See file:line above."
  log "blocking deploy."
  exit 1
fi

log "step 2/18 — tsx scripts/check-no-title-cannibalisation.ts (title de-cannibalisation guard)"
if ! npx --no-install tsx scripts/check-no-title-cannibalisation.ts; then
  log "FAIL — title de-cannibalisation guard rejected a title (banned soft-word and/or keyword poaching). See file:line above."
  log "blocking deploy."
  exit 1
fi

log "step 3/18 — tsx scripts/check-description-length.ts (meta-description ≤155 chars)"
if ! npx --no-install tsx scripts/check-description-length.ts; then
  log "FAIL — meta-description length guard rejected a description >155 chars. See file:line above."
  log "blocking deploy."
  exit 1
fi

log "step 4/18 — tsx scripts/check-bot-ua-list.ts (no social-app in-app browser UAs in BOT_USER_AGENTS)"
if ! npx --no-install tsx scripts/check-bot-ua-list.ts; then
  log "FAIL — check-bot-ua-list found a social-app in-app browser UA in BOT_USER_AGENTS. See file:line above."
  log "blocking deploy."
  exit 1
fi

log "step 5/18 — tsx scripts/check-h1-parity.ts (SSR h1 vs client <h1> parity)"
if ! npx --no-install tsx scripts/check-h1-parity.ts; then
  log "FAIL — H1 parity guard found a mismatch between server/ssr-pages.ts h1: and client <h1>. See file:line above."
  log "blocking deploy."
  exit 1
fi

# Non-blocking sibling of the title guard. Scans body copy for the same
# banned soft-marketing word list and prints warnings (exit 0). Surfaces
# hype-language drift to PR reviewers without gating the deploy.
log "step 6/18 — tsx scripts/check-soft-marketing-words.ts (body-copy soft-marketing warning, non-blocking)"
npx --no-install tsx scripts/check-soft-marketing-words.ts || true

log "step 7/18 — tsx scripts/check-no-pink.ts (no-pink brand-colour guard)"
if ! npx --no-install tsx scripts/check-no-pink.ts; then
  log "FAIL — no-pink guard found a pink utility class, hex literal, or named colour. See file:line above."
  log "blocking deploy."
  exit 1
fi

log "step 8/18 — tsx scripts/check-eeat-show-rating.ts (EEATSignals showRating guard)"
if ! npx --no-install tsx scripts/check-eeat-show-rating.ts; then
  log "FAIL — EEATSignals showRating guard found a <EEATSignals> call missing showRating={false} (or a verified-rating page missing its import). See file:line above."
  log "blocking deploy."
  exit 1
fi

log "step 9/18 — tsx scripts/check-sitemap-blog-slugs.ts (critical blog-slug sitemap guard)"
if ! npx --no-install tsx scripts/check-sitemap-blog-slugs.ts; then
  log "FAIL — sitemap blog-slug guard: a required slug is missing from server/seed-blog-posts.ts and will not appear in /sitemap.xml. See slug list above."
  log "Fix: add the missing slug back to seoRecoveryBlogPosts in server/seed-blog-posts.ts."
  log "blocking deploy."
  exit 1
fi

log "step 10/18 — tsx scripts/check-standalone-blog-pages.ts (standalone HTML blog page SEO guard)"
if ! npx --no-install tsx scripts/check-standalone-blog-pages.ts; then
  log "FAIL — standalone blog-page SEO guard found a violation (missing JSON-LD, canonical, description, or title). See file:line above."
  log "blocking deploy."
  exit 1
fi

log "step 10b/18 — tsx scripts/check-robots-noindex-sync.ts (robots ↔ noindex sync guard)"
if ! npx --no-install tsx scripts/check-robots-noindex-sync.ts; then
  log "FAIL — NOINDEX_SLUGS (shared/seo-config.ts) and robots.txt Disallow rules have drifted, or ssr-pages re-declares its noindex list. See details above."
  log "blocking deploy."
  exit 1
fi

log "step 10c/18 — tsx scripts/check-robots-txt-valid.ts (robots.txt directive-syntax guard)"
if ! npx --no-install tsx scripts/check-robots-txt-valid.ts; then
  log "FAIL — robots.txt contains non-standard directives that will fail strict validators. Convert informational lines to comments (# prefix)."
  log "blocking deploy."
  exit 1
fi

log "step 10d/18 — tsx scripts/check-branch-photo-uniqueness.ts (within-page and cross-page perceptual photo guard)"
if ! npx --no-install tsx scripts/check-branch-photo-uniqueness.ts; then
  log "FAIL — branch photo guard found a missing photo or a perceptual near-duplicate."
  log "blocking deploy."
  exit 1
fi

log "step 11/18 — npm run build"
log "step 10e/18 — approved Organization metadata and branch identity guard"
if ! npx --no-install vitest run server/organization-schema.test.ts; then
  log "FAIL — shared Organization metadata or branch parent reference guard."
  exit 1
fi
if ! node scripts/build-near-me-styles.mjs || ! npm run build; then
  log "FAIL — production build failed; aborting deploy"
  exit 1
fi

log "step 12/18 — booting production server on ${PREDEPLOY_URL} for the SEO smoke-tests"
NODE_ENV=production PORT="${PREDEPLOY_PORT}" node dist/index.cjs >"${SERVER_LOG}" 2>&1 &
SERVER_PID=$!

# Wait for the server to start serving.
deadline=$(( $(date +%s) + WAIT_TIMEOUT_SECS ))
while :; do
  if ! kill -0 "${SERVER_PID}" 2>/dev/null; then
    log "FAIL — server process exited before binding to port; recent log:"
    sed -n '1,80p' "${SERVER_LOG}" >&2 || true
    exit 1
  fi
  if curl -fsS --max-time 2 -o /dev/null "${PREDEPLOY_URL}/" 2>/dev/null; then
    break
  fi
  if [ "$(date +%s)" -ge "${deadline}" ]; then
    log "FAIL — server did not start serving on ${PREDEPLOY_URL} within ${WAIT_TIMEOUT_SECS}s; recent log:"
    sed -n '1,80p' "${SERVER_LOG}" >&2 || true
    exit 1
  fi
  sleep 1
done
log "server is up; proceeding to SEO smoke-tests"

log "step 13/18 — tsx scripts/check-freshness-signal.ts ${PREDEPLOY_URL}"
set +e
npx --no-install tsx scripts/check-freshness-signal.ts "${PREDEPLOY_URL}"
FRESHNESS_EXIT=$?
set -e

log "step 14/18 — tsx scripts/check-keyword-targets.ts ${PREDEPLOY_URL}"
set +e
npx --no-install tsx scripts/check-keyword-targets.ts "${PREDEPLOY_URL}"
KEYWORD_EXIT=$?
set -e

log "step 15/18 — tsx scripts/check-sitemap-200.ts ${PREDEPLOY_URL}"
set +e
npx --no-install tsx scripts/check-sitemap-200.ts "${PREDEPLOY_URL}"
SITEMAP_EXIT=$?
set -e

log "step 16/18 — tsx scripts/check-bot-detection.ts ${PREDEPLOY_URL}"
set +e
npx --no-install tsx scripts/check-bot-detection.ts "${PREDEPLOY_URL}"
BOT_DETECTION_EXIT=$?
set -e

# Standalone ad landing-page guard. Asserts the ad HTML artifact exists in
# dist/ad-assets/, every referenced local asset is present in dist/public,
# the route returns 200 for both normal and Googlebot UAs, and the served
# HTML has no unresolved (or empty) FIREBASE_* config values.
log "step 16b/18 — tsx scripts/check-ad-pages.ts ${PREDEPLOY_URL}"
set +e
npx --no-install tsx scripts/check-ad-pages.ts "${PREDEPLOY_URL}"
AD_PAGES_EXIT=$?
set -e

# Crawler-metadata regression check. Enumerates every sitemap URL + client-
# router route and asserts, for a spoofed Googlebot UA (plus Claude-User /
# Perplexity-User spot-checks), that title/description/canonical are present
# and self-referencing — not the raw SPA shell and not the homepage's, which
# is what a route missing its server/ssr-pages.ts entry would return.
log "step 16c/18 — tsx scripts/check-crawler-metadata.ts ${PREDEPLOY_URL}"
set +e
npx --no-install tsx scripts/check-crawler-metadata.ts "${PREDEPLOY_URL}"
CRAWLER_METADATA_EXIT=$?
set -e

log "step 16d/18 — tsx scripts/check-local-reel-media.ts ${PREDEPLOY_URL}"
set +e
npx --no-install tsx scripts/check-local-reel-media.ts "${PREDEPLOY_URL}"
LOCAL_REELS_EXIT=$?
set -e

log "step 16e/18 — near-me initial HTML, schema, claim and link contract"
set +e
BASE_URL="${PREDEPLOY_URL}" npx --no-install tsx scripts/predeploy-near-me-contract.ts
NEAR_ME_CONTRACT_EXIT=$?
set -e

# Root-level standalone Diwali guide: assert complete visitor/Googlebot
# document parity, content/schema contract, current sitemap freshness and
# successful image delivery.
log "step 16f/18 — Diwali guide standalone HTML, schema, content and image contract"
set +e
npx --no-install tsx scripts/check-diwali-guide.ts "${PREDEPLOY_URL}"
DIWALI_GUIDE_EXIT=$?
set -e

# ── step 15 — Lighthouse performance guard ───────────────────────────────────
# Runs a simulated-mobile Lighthouse audit against home + priority landing page.
# Skippable during initial threshold calibration: SKIP_PERF_GUARD=1 bash predeploy.sh
#
# Thresholds are set via env vars (LH_MIN_PERF, LH_MAX_LCP, LH_MAX_CLS,
# LH_MAX_TBT). After the first successful baseline run, tune these to
# "observed score minus a small buffer" so the guard catches regressions, not
# just catastrophic failures. See scripts/predeploy-lighthouse-guard.mjs.
PERF_EXIT=0
log "step 16h/18 — national-symbols metadata/schema/HTML-parity contract"
set +e
BASE_URL="${PREDEPLOY_URL}" npx --no-install tsx scripts/check-national-symbols-page.ts
NATIONAL_SYMBOLS_EXIT=$?
set -e
log "step 16i/18 — pre-KG metadata/schema/HTML-parity/content contract"
set +e
BASE_URL="${PREDEPLOY_URL}" npx --no-install tsx scripts/check-pre-kg-page.ts
PRE_KG_EXIT=$?
set -e
if [ "${SKIP_PERF_GUARD:-0}" != "1" ]; then
  log "step 17/18 — Lighthouse performance guard (BASE_URL=${PREDEPLOY_URL})"
  set +e
  BASE_URL="${PREDEPLOY_URL}" \
    LH_MIN_PERF="${LH_MIN_PERF:-60}" \
    LH_MAX_LCP="${LH_MAX_LCP:-4000}" \
    LH_MAX_CLS="${LH_MAX_CLS:-0.1}" \
    LH_MAX_TBT="${LH_MAX_TBT:-1200}" \
    node scripts/predeploy-lighthouse-guard.mjs
  PERF_EXIT=$?
  set -e
else
  log "step 17/18 — Lighthouse performance guard SKIPPED (SKIP_PERF_GUARD=1)"
fi
# ─────────────────────────────────────────────────────────────────────────────

if [ "${FRESHNESS_EXIT}" -ne 0 ] || [ "${KEYWORD_EXIT}" -ne 0 ] || [ "${SITEMAP_EXIT}" -ne 0 ] || [ "${BOT_DETECTION_EXIT}" -ne 0 ] || [ "${AD_PAGES_EXIT}" -ne 0 ] || [ "${CRAWLER_METADATA_EXIT}" -ne 0 ] || [ "${LOCAL_REELS_EXIT}" -ne 0 ] || [ "${NEAR_ME_CONTRACT_EXIT}" -ne 0 ] || [ "${DIWALI_GUIDE_EXIT}" -ne 0 ] || [ "${NATIONAL_SYMBOLS_EXIT}" -ne 0 ] || [ "${PRE_KG_EXIT}" -ne 0 ] || [ "${PERF_EXIT}" -ne 0 ]; then
  if [ "${PRE_KG_EXIT}" -ne 0 ]; then
    log "FAIL — pre-KG metadata/schema/HTML-parity/content contract exited ${PRE_KG_EXIT}."
    exit "${PRE_KG_EXIT}"
  fi
  if [ "${NATIONAL_SYMBOLS_EXIT}" -ne 0 ]; then
    log "FAIL — national-symbols metadata/schema/HTML-parity contract exited ${NATIONAL_SYMBOLS_EXIT}."
  fi
  if [ "${NEAR_ME_CONTRACT_EXIT}" -ne 0 ]; then
    log "FAIL — near-me initial HTML/schema/claim/link contract exited ${NEAR_ME_CONTRACT_EXIT}."
  fi
  if [ "${DIWALI_GUIDE_EXIT}" -ne 0 ]; then
    log "FAIL — standalone Diwali guide contract exited ${DIWALI_GUIDE_EXIT}. See content, parity, freshness, schema, and image checks above."
  fi
  if [ "${FRESHNESS_EXIT}" -ne 0 ]; then
    log "FAIL — freshness smoke-test exited ${FRESHNESS_EXIT}. See offending URLs above."
  fi
  if [ "${KEYWORD_EXIT}" -ne 0 ]; then
    log "FAIL — keyword-targets smoke-test exited ${KEYWORD_EXIT}. See offending assertions above."
  fi
  if [ "${SITEMAP_EXIT}" -ne 0 ]; then
    log "FAIL — sitemap-200 smoke-test exited ${SITEMAP_EXIT}. See offending URLs above."
  fi
  if [ "${BOT_DETECTION_EXIT}" -ne 0 ]; then
    log "FAIL — bot-detection smoke-test exited ${BOT_DETECTION_EXIT}. A social-app in-app browser UA may have been added to BOT_USER_AGENTS."
    log "       Real users (WhatsApp, Pinterest, Instagram) must receive the React shell, not the SSR page."
  fi
  if [ "${AD_PAGES_EXIT}" -ne 0 ]; then
    log "FAIL — standalone ad-page guard exited ${AD_PAGES_EXIT}. Missing dist artifact/asset, non-200 response, or uninjected Firebase config. See details above."
  fi
  if [ "${CRAWLER_METADATA_EXIT}" -ne 0 ]; then
    log "FAIL — crawler-metadata regression check exited ${CRAWLER_METADATA_EXIT}. A route is missing self-referencing title/description/canonical for recognized bots, or an answer-engine UA isn't reaching bot-SSR content. See per-route details above."
  fi
  if [ "${LOCAL_REELS_EXIT}" -ne 0 ]; then
    log "FAIL — local reel media check exited ${LOCAL_REELS_EXIT}. See missing/invalid files or HTTP video responses above."
  fi
  if [ "${PERF_EXIT}" -ne 0 ]; then
    log "FAIL — Lighthouse performance guard exited ${PERF_EXIT}. See per-page results above."
    log "To bypass during threshold calibration: SKIP_PERF_GUARD=1 bash scripts/predeploy.sh"
  fi
  log "tail of booted server log (last 80 lines of ${SERVER_LOG}):"
  tail -n 80 "${SERVER_LOG}" >&2 || true
  log "blocking deploy."
  # Surface whichever HTTP check failed first.
  if [ "${FRESHNESS_EXIT}" -ne 0 ]; then
    exit "${FRESHNESS_EXIT}"
  fi
  if [ "${KEYWORD_EXIT}" -ne 0 ]; then
    exit "${KEYWORD_EXIT}"
  fi
  if [ "${SITEMAP_EXIT}" -ne 0 ]; then
    exit "${SITEMAP_EXIT}"
  fi
  if [ "${BOT_DETECTION_EXIT}" -ne 0 ]; then
    exit "${BOT_DETECTION_EXIT}"
  fi
  if [ "${AD_PAGES_EXIT}" -ne 0 ]; then
    exit "${AD_PAGES_EXIT}"
  fi
  if [ "${CRAWLER_METADATA_EXIT}" -ne 0 ]; then
    exit "${CRAWLER_METADATA_EXIT}"
  fi
  if [ "${LOCAL_REELS_EXIT}" -ne 0 ]; then
    exit "${LOCAL_REELS_EXIT}"
  fi
  if [ "${NEAR_ME_CONTRACT_EXIT}" -ne 0 ]; then
    exit "${NEAR_ME_CONTRACT_EXIT}"
  fi
  exit "${PERF_EXIT}"
fi

# ─────────────────────────────────────────────────────────────────────────────
# Step 18/18 — Do not mutate the production Cloudflare cache here.
#
# predeploy.sh is used both for local validation and as the deployment build
# command. A build runs before the release is live and can still fail; purging
# now could expose stale production assets and cause needless cache misses.
# Purge only after a successful production release through a separate hook.
# ─────────────────────────────────────────────────────────────────────────────
log "step 18/18 — SKIPPED Cloudflare purge (validation must not touch production cache)."

log "PASS — byline guard + title-cannibalisation + description-length + bot-ua-list + h1-parity + no-pink guard + eeat-show-rating guard + sitemap-blog-slugs guard + standalone-blog-pages SEO guard + build + freshness + keyword-targets + sitemap-200 + bot-detection + ad-pages + crawler-metadata + local-reel-media + Lighthouse perf guard all succeeded; deploy may proceed."
exit 0
