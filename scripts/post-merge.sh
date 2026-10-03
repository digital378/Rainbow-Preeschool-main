#!/bin/bash
set -e
STAMP=node_modules/.lock-hash
HASH=$(sha256sum package-lock.json | cut -d' ' -f1)
if [ ! -d node_modules ] || [ "$(cat $STAMP 2>/dev/null)" != "$HASH" ]; then
  npm install --legacy-peer-deps --prefer-offline --no-audit --no-fund
  echo "$HASH" > $STAMP
fi
npm run db:push
