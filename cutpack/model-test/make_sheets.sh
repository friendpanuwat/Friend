#!/usr/bin/env bash
# CutPack: render the same seconds from every arm of the model comparison and lay them side by side.
# usage: make_sheets.sh <models_dir with A..F + MAPPING.txt + base/src.mp4> <out_dir>
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
SK="$(cd "$HERE/../../.claude/skills/talking-head-editorial" && pwd)"
M="$(cd "$1" && pwd)"; OUT="$(mkdir -p "$2" && cd "$2" && pwd)"
export NODE_PATH="${NODE_PATH:-$(npm root -g)}"
TIMES="1,3,5,7,9,11,13,15,17,19,21,22.5"
for a in A B C D E F; do
  C="$M/cmp/$a"; rm -rf "$C"; mkdir -p "$C"
  cp "$M/$a/timeline.js" "$C/"; cp "$M/$a/.hold" "$C/"; ln -sfn "$M/base/src_frames" "$C/src_frames"
  python3 "$SK/scripts/build_scene.py" "$C" >/dev/null
  node "$SK/scripts/render.js" "$C" preview "$TIMES" || echo "arm $a: JavaScript error while rendering stills"
  cp "$M/$a/timeline.js" "$OUT/timeline_$a.js"; [ -f "$M/$a/plan.md" ] && cp "$M/$a/plan.md" "$OUT/plan_$a.md"
done
cp "$M/MAPPING.txt" "$OUT/"
node "$HERE/sheet.js" "$M" "$OUT" "$SK/assets/fonts" "$TIMES"
ls -la "$OUT"/*.jpg
