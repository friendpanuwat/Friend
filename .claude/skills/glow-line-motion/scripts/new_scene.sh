#!/usr/bin/env bash
# Create <workdir>/scene.html from the template (or from an example) with the engine path filled in.
# usage: new_scene.sh <workdir> [example-name]     e.g. new_scene.sh $P rows-simplify
set -euo pipefail
SK="$(cd "$(dirname "$0")/.." && pwd)"; P="${1:?usage: new_scene.sh <workdir> [example]}"; SRC="$SK/assets/template.html"
[ -n "${2:-}" ] && SRC="$SK/examples/${2%.html}.html"
[ -f "$SRC" ] || { echo "NOT FOUND: $SRC  (examples: $(ls "$SK/examples" | sed 's/\.html//' | tr '\n' ' '))"; exit 1; }
mkdir -p "$P"; [ -f "$P/scene.html" ] && cp "$P/scene.html" "$P/scene.bak.html"
sed "s#\.\./assets/glowline\.js#file://$SK/assets/glowline.js#" "$SRC" > "$P/scene.html"
echo "SCENE $P/scene.html  (from $(basename "$SRC"))"
