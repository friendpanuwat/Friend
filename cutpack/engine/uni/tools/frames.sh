#!/usr/bin/env bash
# frame-by-frame sheets: frames.sh <work> <out.jpg> <times csv> <scene@index> -- one row per style (card glass split + their overlays), cropped to the picture
# env STYLES = only these rows (e.g. STYLES="card glass")
# EXTRA=<file.js> loads more sentences (e.g. an AI plan). Never run two at once in one <work> dir: the row files would mix.
set -euo pipefail
W=$1; OUT=$2; TIMES=$3; SC=$4; U="$(cd "$(dirname "$0")/.." && pwd)"; export NODE_PATH=$(npm root -g)
[ -d "$W/base/src_frames" ] || bash "$U/../core/pipeline.sh" "$W/base" "$U/../../library/sample-clip/character_talking.mp4" frames >/dev/null
sc=${SC%@*}; i=${SC#*@}
declare -A CROP=([card]="1000:620:40:470" [glass]="1000:620:40:640" [split]="860:700:110:210" [card-overlay]="700:400:190:160" [glass-overlay]="700:400:190:160" [split-overlay]="700:400:190:160")
STYLES=${STYLES:-card glass split card-overlay glass-overlay split-overlay}; NS=$(echo $STYLES | wc -w)
rows=()
for st in $STYLES; do
  P="$W/f_${st}_${sc}"; rm -rf "$P"; mkdir -p "$P"; ln -sfn "$W/base/src_frames" "$P/src_frames"
  args=""; case $st in *-overlay) args="--speaker .86";; esac
  python3 "$U/build.py" "$P" "$st" "$sc" --index "$i" $args ${EXTRA:+--extra "$EXTRA"} >/dev/null
  node "$U/../core/render.js" "$P" preview "$TIMES" >/dev/null
  ffmpeg -y -loglevel error -pattern_type glob -i "$P/prev/p_*.jpg" -vf "crop=${CROP[$st]},scale=170:-2,drawbox=0:0:iw:ih:color=gray@0.5:t=1,tile=$(echo $TIMES | tr ',' '\n' | wc -l)x1" "$W/frow_${st}.jpg"
  rows+=("-i" "$W/frow_${st}.jpg")
done
# pad rows to a common height then stack
ffmpeg -y -loglevel error "${rows[@]}" -filter_complex "$(for k in $(seq 0 $((NS - 1))); do printf '[%d]pad=iw:max(ih\\,110):0:0:black[r%d];' $k $k; done)$(for k in $(seq 0 $((NS - 1))); do printf '[r%d]' $k; done)vstack=$NS" "$OUT"
echo "$OUT"
