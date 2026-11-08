#!/usr/bin/env bash
# One still per picture of one clip's category plan, with the variants the picker gives it today (manual test, 2026-11-08):
# stills_cmp.sh <work> <img_dir> <clip_out_dir> <name> <style>   (clip_out_dir = a cat_ai.py check out dir; name = file prefix)
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"; U="$HERE/../../../engine/uni"; W="$(mkdir -p "$1" && cd "$1" && pwd)"; IMG="$(mkdir -p "$2" && cd "$2" && pwd)"
CO="$(cd "$3" && pwd)"; NAME=$4; ST=$5; export NODE_PATH="${NODE_PATH:-$(npm root -g)}"
[ -d "$W/base/src_frames" ] || bash "$U/../core/pipeline.sh" "$W/base" "$HERE/../../sample-clip/character_talking.mp4" frames >/dev/null
(cd "$U" && node cat_stats.js "$CO") > "$W/stats_$NAME.json"
for sc in $(python3 -c "import json; S=json.load(open('$W/stats_$NAME.json')); ix={s.split('@')[0]: s.split('@')[1] for s in open('$CO/scenes.txt').read().split()}; print(' '.join(f\"{p['id']}.{p['pick']}@{ix[p['id']]}\" for c in S['perClip'] for p in c['pictures']))"); do
  id=${sc%@*}; i=${sc#*@}; P="$W/${ST}_$id"; rm -rf "$P"; mkdir -p "$P"; ln -sfn "$W/base/src_frames" "$P/src_frames"
  args=""; case $ST in *-overlay) args="--speaker .86";; esac
  python3 "$U/build.py" "$P" "$ST" "$id" --index "$i" --extra "$CO/sentences.js" $args >/dev/null
  node "$U/../core/render.js" "$P" preview 3.4 >/dev/null
  ffmpeg -y -loglevel error -i "$P/prev/p_003.40.jpg" -vf "scale=360:-2" -q:v 4 "$IMG/${NAME}_${ST}_${id%.*}.jpg"
done
ls "$IMG" | grep -c "^${NAME}_${ST}_"
