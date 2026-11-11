#!/usr/bin/env bash
# One still per style × scene for a review page (Friend 2026-11-10: clips only in one style, "ส่วนสไตล์ที่เหลือทำเป็นภาพมาก็พอ").
# usage: stills.sh <work> <out_dir> "<styles>" "<scene@index …>" [time=3.5]   → <out_dir>/<style>_<scene>.jpg (540 px wide)
#   e.g. stills.sh /tmp/w ../../library/uni-test/round6 "card-overlay glass split glass-overlay split-overlay" "r6.gpu.basket@1"
#   overlay styles get --speaker .86 like the clips; 3.5 s is the moment the clip covers use (after the key word)
set -euo pipefail
W=$1; OUT="$(mkdir -p "$2" && cd "$2" && pwd)"; STYLES=$3; SCENES=$4; AT=${5:-3.5}
U="$(cd "$(dirname "$0")/.." && pwd)"; export NODE_PATH="${NODE_PATH:-$(npm root -g)}"
[ -d "$W/base/src_frames" ] || bash "$U/../core/pipeline.sh" "$W/base" "$U/../../library/sample-clip/character_talking.mp4" frames >/dev/null
one() {
  local st=$1 sc=${2%@*} i=${2#*@} P="$W/s_$1_${2%@*}" args=""
  rm -rf "$P"; mkdir -p "$P"; ln -sfn "$W/base/src_frames" "$P/src_frames"
  case $st in *-overlay) args="--speaker .86";; esac
  python3 "$U/build.py" "$P" "$st" "$sc" --index "$i" $args ${EXTRA:+--extra "$EXTRA"} >/dev/null && node "$U/../core/render.js" "$P" preview "$AT" >/dev/null && \
  ffmpeg -y -loglevel error -i "$P/prev/p_$(printf '%06.2f' "$AT").jpg" -vf "scale=540:-2" -q:v 4 "$OUT/${st}_${sc}.jpg" && echo "ok $st $sc" || echo "FAIL $st $sc"
}
export -f one; export W OUT U AT EXTRA
for st in $STYLES; do for sc in $SCENES; do echo "$st $sc"; done; done | xargs -P 4 -L 1 bash -c 'one $0 $1'
