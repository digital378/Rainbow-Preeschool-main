#!/usr/bin/env bash
# Pre-deploy guard.
#
# Runs the editorial-byline static guard, then the production build, boots
# the built server in the background, waits for it to start serving on
# $PREDEPLOY_PORT (default 5000), and then runs both SEO smoke-tests against
# the same already-booted server:
#
#   0. scripts/check-no-person-author.ts — static scan that fails if any
#      file under client/src, server, shared, or scripts emits a JSON-LD
#      `"@type": "Person"` node under author / reviewer / reviewedBy /
#      contributor / creator / publisher / editor, or sneaks an
#      individual-name byline into a review/testimonial/parent context.
#      Runs first because it's a fast static check that doesn't need a
#      build or a booted server — fail fast before paying the build cost.
#   0.5 scripts/check-no-pink.ts — static scan that fails if any pink
#      Tailwind utility (`pink-NNN`), pink palette hex (#ec4899, #fce7f3,
#      …), or pink CSS named colour appears under client/src, server,
#      shared, scripts, or in client/index.html. The brand uses
#      red/primary (#dc2626) only; pink is permanently off-brand.
#   1. scripts/check-freshness-signal.ts — asserts the visible "Last updated"
#      byline + Article JSON-LD dateModified across the 18 commercial +
#      locality URLs.
#   2. scripts/check-keyword-targets.ts — asserts the 15 priority commercial
#      keyword guarantees: FAQPage JSON-LD on the 5 commercial pages,
#      Organization JSON-LD on /playgroup, /nursery, /kindergarten, ≥ 1,200
#      visible words inside <main> on /play-school-near-me and
#      /best-preschool-near-me-in-thane, the homepage linking to all 5
#      commercial URLs, all 16 ghost-slug variants 301-redirecting to their
#      canonical page (32 redirect assertions including trailing-slash forms),
#      and /preschool-near-me 301-redirecting to
#      /best-preschool-near-me-in-thane.
#   3. scripts/check-sitemap-200.ts — fetches /sitemap.xml and asserts every
#      <loc> entry returns 200 OK. Catches any sitemap row that has been
#      301-redirected (which would surface the "URL is in sitemap but
#      redirects" warning in Google Search Console).
#
# The two HTTP-based checks run against the SAME booted server so we only
# pay the build-and-boot cost once. The deploy is blocked (non-zero exit)
# if ANY check fails — the two HTTP checks are run regardless of each
# other's result so a single deploy attempt surfaces every regression at
# once instead of one-at-a-time.
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

log "step 1/6 — tsx scripts/check-no-person-author.ts (editorial-byline guard)"
if ! npx --no-install tsx scripts/check-no-person-author.ts; then
  log "FAIL — editorial-byline guard found a Person author/reviewer/contributor entry. See file:line above."
  log "blocking deploy."
  exit 1
fi

log "step 1.5/6 — tsx scripts/check-no-title-cannibalisation.ts (title de-cannibalisation guard)"
if ! npx --no-install tsx scripts/check-no-title-cannibalisation.ts; then
  log "FAIL — title de-cannibalisation guard rejected a title (banned soft-word and/or keyword poaching). See file:line above."
  log "blocking deploy."
  exit 1
fi

log "step 1.55/6 — tsx scripts/check-description-length.ts (meta-description ≤155 chars)"
if ! npx --no-install tsx scripts/check-description-length.ts; then
  log "FAIL — meta-description length guard rejected a description >155 chars. See file:line above."
  log "blocking deploy."
  exit 1
fi

log "step 1.57/6 — tsx scripts/check-bot-ua-list.ts (no social-app in-app browser UAs in BOT_USER_AGENTS)"
if ! npx --no-install tsx scripts/check-bot-ua-list.ts; then
  log "FAIL — check-bot-ua-list found a social-app in-app browser UA in BOT_USER_AGENTS. See file:line above."
  log "blocking deploy."
  exit 1
fi

# Non-blocking sibling of the title guard. Scans body copy for the same
# banned soft-marketing word list and prints warnings (exit 0). Surfaces
# hype-language drift to PR reviewers without gating the deploy.
log "step 1.6/6 — tsx scripts/check-soft-marketing-words.ts (body-copy soft-marketing warning, non-blocking)"
npx --no-install tsx scripts/check-soft-marketing-words.ts || true

log "step 2/6 — tsx scripts/check-no-pink.ts (no-pink brand-colour guard)"
if ! npx --no-install tsx scripts/check-no-pink.ts; then
  log "FAIL — no-pink guard found a pink utility class, hex literal, or named colour. See file:line above."
  log "blocking deploy."
  exit 1
fi

log "step 3/6 — npm run build"
if ! npm run build; then
  log "FAIL — production build failed; aborting deploy"
  exit 1
fi

log "step 4/6 — booting production server on ${PREDEPLOY_URL} for the SEO smoke-tests"
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

log "step 5/6 — tsx scripts/check-freshness-signal.ts ${PREDEPLOY_URL}"
set +e
npx --no-install tsx scripts/check-freshness-signal.ts "${PREDEPLOY_URL}"
FRESHNESS_EXIT=$?
set -e

log "step 6/7 — tsx scripts/check-keyword-targets.ts ${PREDEPLOY_URL}"
set +e
npx --no-install tsx scripts/check-keyword-targets.ts "${PREDEPLOY_URL}"
KEYWORD_EXIT=$?
set -e

log "step 7/7 — tsx scripts/check-sitemap-200.ts ${PREDEPLOY_URL}"
set +e
npx --no-install tsx scripts/check-sitemap-200.ts "${PREDEPLOY_URL}"
SITEMAP_EXIT=$?
set -e

log "step 7.5/7 — tsx scripts/check-bot-detection.ts ${PREDEPLOY_URL}"
set +e
npx --no-install tsx scripts/check-bot-detection.ts "${PREDEPLOY_URL}"
BOT_DETECTION_EXIT=$?
set -e

# ── step 8 — Lighthouse performance guard ────────────────────────────────────
# Runs a simulated-mobile Lighthouse audit against home + priority landing page.
# Skippable during initial threshold calibration: SKIP_PERF_GUARD=1 bash predeploy.sh
#
# Thresholds are set via env vars (LH_MIN_PERF, LH_MAX_LCP, LH_MAX_CLS,
# LH_MAX_TBT). After the first successful baseline run, tune these to
# "observed score minus a small buffer" so the guard catches regressions, not
# just catastrophic failures. See scripts/predeploy-lighthouse-guard.mjs.
PERF_EXIT=0
if [ "${SKIP_PERF_GUARD:-0}" != "1" ]; then
  log "step 8/8 — Lighthouse performance guard (BASE_URL=${PREDEPLOY_URL})"
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
  log "step 8/8 — Lighthouse performance guard SKIPPED (SKIP_PERF_GUARD=1)"
fi
# ─────────────────────────────────────────────────────────────────────────────

if [ "${FRESHNESS_EXIT}" -ne 0 ] || [ "${KEYWORD_EXIT}" -ne 0 ] || [ "${SITEMAP_EXIT}" -ne 0 ] || [ "${BOT_DETECTION_EXIT}" -ne 0 ] || [ "${PERF_EXIT}" -ne 0 ]; then
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
  if [ "${PERF_EXIT}" -ne 0 ]; then
    log "FAIL — Lighthouse performance guard exited ${PERF_EXIT}. See per-page results above."
    log "To bypass during threshold calibration: SKIP_PERF_GUARD=1 bash scripts/predeploy.sh"
  fi
  log "tail of booted server log (last 80 lines of ${SERVER_LOG}):"
  tail -n 80 "${SERVER_LOG}" >&2 || true
  log "blocking deploy."
  # Surface whichever HTTP check failed first (freshness → keyword → sitemap → bot-detection → perf).
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
  exit "${PERF_EXIT}"
fi

# ─────────────────────────────────────────────────────────────────────────────
# Step 9/9 — Purge Cloudflare edge cache
#
# Runs LAST so it only fires after every other guard has passed. Without this,
# the new CDN-Cache-Control max-age=3600 takes up to an hour to take effect
# at each POP because old cached responses keep being served until they
# naturally expire. Purging forces every POP to re-fetch on the next request.
#
# Non-blocking: if the purge fails (network blip, token rotated, etc.) we log
# a warning and let the deploy succeed. The TTL bump still ships; cache just
# self-heals over the next hour instead of instantly. Skipped entirely when
# either secret is missing so local dev runs of predeploy.sh stay quiet.
# ─────────────────────────────────────────────────────────────────────────────
if [ -n "$CF_ZONE_ID" ] && [ -n "$CF_API_TOKEN" ]; then
  log "step 9/9 — Purging Cloudflare edge cache ..."
  PURGE_RESPONSE=$(curl -sX POST \
    "https://api.cloudflare.com/client/v4/zones/$CF_ZONE_ID/purge_cache" \
    -H "Authorization: Bearer $CF_API_TOKEN" \
    -H "Content-Type: application/json" \
    --data '{"purge_everything":true}')
  if echo "$PURGE_RESPONSE" | grep -q '"success":true'; then
    log "Cloudflare cache purged successfully."
  else
    log "WARNING — Cloudflare cache purge failed: $PURGE_RESPONSE"
    log "Continuing anyway; old cached responses will expire within max-age."
  fi
else
  log "step 9/9 — SKIPPED Cloudflare cache purge (CF_ZONE_ID or CF_API_TOKEN not set)."
fi

log "PASS — byline guard + no-pink guard + build + freshness + keyword-targets + sitemap-200 + bot-detection + Lighthouse perf guard all succeeded; deploy may proceed."
exit 0
