#!/bin/sh
#
# One-time setup for local git hooks.
#
# Tells git to look for hooks in the repo-tracked `.githooks/` directory
# instead of the per-clone `.git/hooks/`. Re-running is safe (idempotent).
#
# Usage:
#     bash scripts/install-hooks.sh

set -e

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || true)"
if [ -z "$REPO_ROOT" ]; then
  echo "install-hooks: not inside a git working tree — nothing to do." >&2
  exit 1
fi

cd "$REPO_ROOT"

if [ ! -d .githooks ]; then
  echo "install-hooks: '.githooks' directory not found at $REPO_ROOT." >&2
  exit 1
fi

# Make sure every hook in .githooks is executable.
chmod +x .githooks/* 2>/dev/null || true

CURRENT="$(git config --get core.hooksPath || true)"
if [ "$CURRENT" = ".githooks" ]; then
  echo "install-hooks: already pointing at .githooks — no change."
else
  git config core.hooksPath .githooks
  echo "install-hooks: set core.hooksPath -> .githooks"
fi

echo "install-hooks: done. 'npm run check' will now run before each commit."
echo "             Bypass once with:  git commit --no-verify"
echo "             Bypass via env:    SKIP_PRECOMMIT=1 git commit ..."
