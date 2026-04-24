#!/usr/bin/env bash
# Pre-deploy guard.
#
# Runs the production build, boots the built server in the background, waits
# for it to start serving on $PREDEPLOY_PORT (default 5000), and then runs
# both SEO smoke-tests against the same already-booted server:
#
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
#
# Both checks run against the SAME booted server so we only pay the
# build-and-boot cost once. The deploy is blocked (non-zero exit) if EITHER
# check fails — both are run regardless so a single deploy attempt surfaces
# every regression at once instead of one-at-a-time.
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

log "step 1/4 — npm run build"
if ! npm run build; then
  log "FAIL — production build failed; aborting deploy"
  exit 1
fi

log "step 2/4 — booting production server on ${PREDEPLOY_URL} for the SEO smoke-tests"
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

log "step 3/4 — tsx scripts/check-freshness-signal.ts ${PREDEPLOY_URL}"
set +e
npx --no-install tsx scripts/check-freshness-signal.ts "${PREDEPLOY_URL}"
FRESHNESS_EXIT=$?
set -e

log "step 4/4 — tsx scripts/check-keyword-targets.ts ${PREDEPLOY_URL}"
set +e
npx --no-install tsx scripts/check-keyword-targets.ts "${PREDEPLOY_URL}"
KEYWORD_EXIT=$?
set -e

if [ "${FRESHNESS_EXIT}" -ne 0 ] || [ "${KEYWORD_EXIT}" -ne 0 ]; then
  if [ "${FRESHNESS_EXIT}" -ne 0 ]; then
    log "FAIL — freshness smoke-test exited ${FRESHNESS_EXIT}. See offending URLs above."
  fi
  if [ "${KEYWORD_EXIT}" -ne 0 ]; then
    log "FAIL — keyword-targets smoke-test exited ${KEYWORD_EXIT}. See offending assertions above."
  fi
  log "blocking deploy."
  # Surface the keyword exit if it failed, otherwise the freshness exit.
  if [ "${KEYWORD_EXIT}" -ne 0 ]; then
    exit "${KEYWORD_EXIT}"
  fi
  exit "${FRESHNESS_EXIT}"
fi

log "PASS — production build + freshness smoke-test + keyword-targets smoke-test all succeeded; deploy may proceed."
exit 0
