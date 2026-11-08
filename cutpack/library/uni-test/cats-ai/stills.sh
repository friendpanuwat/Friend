#!/usr/bin/env bash
# One still per picture (after the key word) in one style, for the round-15 page: stills.sh <work> <out_dir> <clip>… (style: STYLE=card)
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"; U="$HERE/../../../engine/uni"; W="$(mkdir -p "$1" && cd "$1" && pwd)"; OUT="$(mkdir -p "$2" && cd "$2" && pwd)"; shift 2
export NODE_PATH="${NODE_PATH:-$(npm root -g)}"; ST="${STYLE:-card}"
[ -d "$W/base/src_frames" ] || bash "$U/../core/pipeline.sh" "$W/base" "$HERE/../../sample-clip/character_talking.mp4" frames >/dev/null
for clip in "$@"; do
  for sc in $(cat "$HERE/out/$clip/scenes.txt"); do
    id=${sc%@*}; i=${sc#*@}; P="$W/${ST}_$id"; rm -rf "$P"; mkdir -p "$P"; ln -sfn "$W/base/src_frames" "$P/src_frames"
    args=""; case $ST in *-overlay) args="--speaker .86";; esac
    python3 "$U/build.py" "$P" "$ST" "$id" --index "$i" --extra "$HERE/out/$clip/sentences.js" $args >/dev/null
    node "$U/../core/render.js" "$P" preview 3.4 >/dev/null
    ffmpeg -y -loglevel error -i "$P/prev/p_003.40.jpg" -vf "scale=360:-2" -q:v 4 "$OUT/${ST}_$id.jpg"
  done
done
ls "$OUT" | wc -l
