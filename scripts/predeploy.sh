#!/usr/bin/env bash
# Pre-deploy guard.
#
# Runs the production build, boots the built server in the background, waits
# for it to start serving on $PREDEPLOY_PORT (default 5000), and then runs
# scripts/check-freshness-signal.ts against it. The deploy is blocked
# (non-zero exit) if any URL is missing the "Reviewed by Rainbow Preschool
# Curriculum Team — Last updated …" byline or the Article JSON-LD
# dateModified.
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
    log "stopping freshness-check server (pid=${SERVER_PID})"
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

log "step 1/3 — npm run build"
if ! npm run build; then
  log "FAIL — production build failed; aborting deploy"
  exit 1
fi

log "step 2/3 — booting production server on ${PREDEPLOY_URL} for the freshness smoke-test"
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
log "server is up; proceeding to freshness smoke-test"

log "step 3/3 — tsx scripts/check-freshness-signal.ts ${PREDEPLOY_URL}"
set +e
npx --no-install tsx scripts/check-freshness-signal.ts "${PREDEPLOY_URL}"
CHECK_EXIT=$?
set -e

if [ "${CHECK_EXIT}" -ne 0 ]; then
  log "FAIL — freshness smoke-test exited ${CHECK_EXIT}; blocking deploy. See offending URLs above."
  exit "${CHECK_EXIT}"
fi

log "PASS — production build + freshness smoke-test both succeeded; deploy may proceed."
exit 0
