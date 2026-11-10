#!/usr/bin/env bash
# Run Po's real scripts in a fake Minecraft world (no game needed).
# Usage: bash minecraft-po/tools/sim/run.sh [wood|mine|diamond|lava|fight|chest|craft|talk|phase1]
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
WORK="$(mktemp -d)"
mkdir -p "$WORK/node_modules/@minecraft/server" "$WORK/node_modules/@minecraft/server-ui"
echo '{ "name": "@minecraft/server", "type": "module", "main": "index.js" }' > "$WORK/node_modules/@minecraft/server/package.json"
echo '{ "name": "@minecraft/server-ui", "type": "module", "main": "index.js" }' > "$WORK/node_modules/@minecraft/server-ui/package.json"
cp "$HERE/mock-server.js" "$WORK/node_modules/@minecraft/server/index.js"
cp "$HERE/mock-server-ui.js" "$WORK/node_modules/@minecraft/server-ui/index.js"
cp "$HERE/world.mjs" "$HERE/run.mjs" "$WORK/"
cp -r "$HERE/../../addon/Po_BP/scripts" "$WORK/scripts"
cd "$WORK" && node run.mjs "${1:-wood}"
rm -rf "$WORK"
