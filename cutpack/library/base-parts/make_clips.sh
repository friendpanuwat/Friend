#!/usr/bin/env bash
# Render every line of clips.txt to <out>/<cat>_<v>_<sample>.mp4 + .jpg (540×960, silent), 4 at a time.
# usage: make_clips.sh <work_dir> <out_dir> [list, default clips.txt]
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"; W="$(mkdir -p "$1" && cd "$1" && pwd)"; OUT="$(mkdir -p "$2" && cd "$2" && pwd)"
[ -d "$W/base/src_frames" ] || bash "$HERE/../../engine/core/pipeline.sh" "$W/base" "$HERE/../sample-clip/character_talking.mp4" frames >/dev/null
grep -v "^#" "${3:-$HERE/clips.txt}" | while read -r c v i bg; do echo "$c $v $i $bg"; done |
  xargs -P 4 -L 1 bash -c 'n="$0_$1_$2"; "'"$HERE"'/render_part.sh" "'"$W"'" "$0" "$1" "$2" "$3" "$n" && mv "'"$W"'/out/$n.mp4" "'"$W"'/out/$n.jpg" "'"$OUT"'/"'
ls "$OUT" | wc -l; du -sh "$OUT"
