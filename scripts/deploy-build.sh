#!/usr/bin/env bash
set -euo pipefail

# This repository contains both Node and Python lockfiles. Replit's package
# detection may choose the Python environment only, so install the Node build
# toolchain explicitly before running the production checks.
npm ci --include=dev --legacy-peer-deps

exec bash scripts/predeploy.sh