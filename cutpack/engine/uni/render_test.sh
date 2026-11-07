#!/usr/bin/env bash
# Render the uni test: every base scene × every style as a short silent clip on Friend's sample clip
# (0.5 s speaker → scene 4 s → 0.5 s speaker).
# usage: render_test.sh <work_dir> <out_dir> [styles] [scenes]        e.g.  render_test.sh /tmp/w out "card glass split" "not-worth not-worth.stars"
#   a scene id is <meaning> or <meaning>.<picture>; every picture of one meaning gets the same place in the clip (index),
#   so a style dresses them alike. env WIDTH = clip width (720)
#   PREVIEW=1 → stills only (<work>/<style>_<scene>/prev/) and contact sheets <work>/sheet_<style>.jpg, no MP4
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"; CORE="$HERE/../core"
W="$(mkdir -p "$1" && cd "$1" && pwd)"; OUT="$(mkdir -p "$2" && cd "$2" && pwd)"
MEANINGS="price-cut not-worth undecided fewer-customers not-first fix-spot"
STYLES="${3:-card glass split}"; SCENES="${4:-$MEANINGS}"; WIDTH="${WIDTH:-720}"
export NODE_PATH="${NODE_PATH:-$(npm root -g)}"
[ -d "$W/base/src_frames" ] || bash "$CORE/pipeline.sh" "$W/base" "$HERE/../../library/sample-clip/character_talking.mp4" frames >/dev/null
one() {
  local st=$1 sc=$2 i=$3 P="$W/$1_$2"
  rm -rf "$P"; mkdir -p "$P"; ln -sfn "$W/base/src_frames" "$P/src_frames"
  python3 "$HERE/build.py" "$P" "$st" "$sc" --index "$i" >/dev/null
  if [ -n "${PREVIEW:-}" ]; then node "$CORE/render.js" "$P" preview 0.3,0.9,1.5,2.1,2.7,3.3,4.2,4.8; return; fi
  node "$CORE/render.js" "$P" range 0 150 >/dev/null
  ffmpeg -y -loglevel error -framerate 30 -i "$P/out_frames/o%05d.jpg" -vf "scale=$WIDTH:-2:flags=lanczos" -c:v libx264 -crf 23 -preset medium -pix_fmt yuv420p -movflags +faststart -an "$OUT/${st}_${sc}.mp4"
  ffmpeg -y -loglevel error -i "$P/out_frames/o00105.jpg" -vf "scale=540:-2" -q:v 4 "$OUT/${st}_${sc}.jpg"
  rm -rf "$P/out_frames"
}
export -f one; export W OUT HERE CORE WIDTH
jobs=()
idx() { local i=0 m; for m in $MEANINGS; do [ "$m" = "${1%%.*}" ] && { echo $i; return; }; i=$((i+1)); done; echo 0; }
for st in $STYLES; do for sc in $SCENES; do jobs+=("$st $sc $(idx $sc)"); done; done
printf '%s\n' "${jobs[@]}" | xargs -P 4 -L 1 bash -c 'one $0 $1 $2'
if [ -n "${PREVIEW:-}" ]; then
  for st in $STYLES; do
    for sc in $SCENES; do ffmpeg -y -loglevel error -pattern_type glob -i "$W/${st}_${sc}/prev/p_*.jpg" -vf "scale=180:320,tile=8x1" "$W/row_${st}_${sc}.jpg"; done
    ffmpeg -y -loglevel error $(for sc in $SCENES; do printf -- '-i %s ' "$W/row_${st}_${sc}.jpg"; done) -filter_complex "vstack=$(echo $SCENES | wc -w)" "$W/sheet_${st}.jpg"
    echo "sheet: $W/sheet_${st}.jpg"
  done
fi
