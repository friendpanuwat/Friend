#!/usr/bin/env bash
# Render every widget in widgets.txt twice: short with sample 0 → <cat>_<v>_0, narrow with sample 1 → <cat>_<v>_1 (4 at a time).
# usage: make_clips.sh <work_dir> <out_dir>
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"; W="$(mkdir -p "$1" && cd "$1" && pwd)"; OUT="$(mkdir -p "$2" && cd "$2" && pwd)"
[ -d "$W/base/src_frames" ] || bash "$HERE/../../engine/core/pipeline.sh" "$W/base" "$HERE/../sample-clip/character_talking.mp4" frames >/dev/null
grep -v '^#' "$HERE/widgets.txt" | while read -r c v; do echo "$c $v 0 short"; echo "$c $v 1 narrow"; done |
  xargs -P 4 -L 1 bash -c 'n="$0_$1_$2"; "'"$HERE"'/render_widget.sh" "'"$W"'" "$0" "$1" "$2" "$3" "$n" && mv "'"$W"'/out/$n.mp4" "'"$W"'/out/$n.jpg" "'"$OUT"'/"'
ls "$OUT" | wc -l; du -sh "$OUT"
