#!/usr/bin/env bash
# Editorial carousel pipeline.  usage: pipeline.sh <project_dir> <step> [args]
#   build                – assemble deck.html from deck.js + brand.json   (env SIZE=1080x1080 | 1080x1350 | 1080x1920)
#   stills [n,n,...]     – PNG per slide → slides/NN.png, layout QC, contact sheet preview.jpg, carousel_png.zip
#   motion               – animated version: slides/NN.mp4 per slide (H.264, 30 fps) + carousel_mp4.zip  (env SFX=1 adds sound effects)
#   grab <video> [t,...] – frames from a talking-head clip: without times → scan.jpg (every 2 s, timestamped) to choose from;
#                          with times (seconds) → img/v_<t>.jpg full-resolution stills for photo()
#   all                  – build + stills
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
PROJ="$(mkdir -p "$1" && cd "$1" && pwd)"; STEP="${2:-all}"; shift 2 || true
export NODE_PATH="${NODE_PATH:-$(npm root -g)}"
FONT="$HERE/../assets/fonts/Mitr-Regular.ttf"

build()  { python3 "$HERE/build_deck.py" "$PROJ" --size "${SIZE:-1080x1080}"; }
stills() {
  [ -n "${1:-}" ] || rm -rf "$PROJ/slides"/*.png
  node "$HERE/render.js" "$PROJ" stills "${1:-}"
  N=$(ls "$PROJ/slides"/*.png | wc -l); C=$(( N < 5 ? N : 5 )); R=$(( (N + C - 1) / C ))
  ffmpeg -y -loglevel error -pattern_type glob -i "$PROJ/slides/*.png" -vf "scale=360:-2,pad=iw+12:ih+12:6:6:color=0x777777,tile=${C}x${R}:color=0x777777" -frames:v 1 "$PROJ/preview.jpg"
  (cd "$PROJ/slides" && rm -f ../carousel_png.zip && zip -q ../carousel_png.zip *.png)
  echo "preview sheet: $PROJ/preview.jpg  ·  zip: $PROJ/carousel_png.zip ($(du -h "$PROJ/carousel_png.zip" | cut -f1))"
}
motion() {
  node "$HERE/render.js" "$PROJ" info >/dev/null
  rm -rf "$PROJ/motion"
  for w in 0 1 2 3; do node "$HERE/render.js" "$PROJ" motion $w 4 & done; wait
  TMP=$(mktemp -d); trap 'rm -rf "$TMP"' RETURN
  for d in "$PROJ"/motion/*/; do
    n=$(basename "$d"); DUR=$(python3 -c "import json;print([s for s in json.load(open('$PROJ/slides.json')) if s['n']==int('$n')][0]['dur'])")
    if [ "${SFX:-0}" = 1 ]; then
      python3 -c "import json;s=[x for x in json.load(open('$PROJ/slides.json')) if x['n']==int('$n')][0];json.dump([dict(c,t=round(c['t']-s['t0'],3)) for c in json.load(open('$PROJ/cues.json')) if s['t0']-.1<=c['t']<s['t0']+s['dur']],open('$TMP/c.json','w'))"
      (cd "$TMP" && python3 "$HERE/sfx.py" c.json s.wav "$DUR" >/dev/null)
      AUD=(-i "$TMP/s.wav"); AF="alimiter=limit=0.8,aresample=48000"   # no voice to sit under → SFX at full level
    else AUD=(-f lavfi -t "$DUR" -i anullsrc=r=48000:cl=stereo); AF="anull"; fi
    ffmpeg -y -loglevel error -framerate 30 -i "$d/f%05d.jpg" "${AUD[@]}" -map 0:v -map 1:a -c:v libx264 -preset slow -crf 17 -pix_fmt yuv420p \
      -af "$AF" -c:a aac -b:a 160k -ac 2 -movflags +faststart -shortest "$PROJ/slides/$n.mp4"
  done
  (cd "$PROJ/slides" && rm -f ../carousel_mp4.zip && zip -q ../carousel_mp4.zip *.mp4)
  ls -la "$PROJ"/slides/*.mp4 | awk '{print $5, $NF}'; echo "zip: $PROJ/carousel_mp4.zip ($(du -h "$PROJ/carousel_mp4.zip" | cut -f1))"
}
grab() {
  V="${1:?usage: pipeline.sh <project> grab <video> [t1,t2,...]}"; mkdir -p "$PROJ/img"
  if [ -z "${2:-}" ]; then
    DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$V"); N=$(python3 -c "import math;print(math.ceil($DUR/2))")
    ffmpeg -y -loglevel error -i "$V" -vf "fps=1/2,scale=200:-2,drawtext=fontfile=$FONT:text='%{eif\:t\:d}s':x=8:y=8:fontsize=26:fontcolor=white:box=1:boxcolor=black@0.6:boxborderw=6,tile=8x$(( (N + 7) / 8 ))" -frames:v 1 "$PROJ/scan.jpg"
    echo "scan sheet (one frame per 2 s, label = second): $PROJ/scan.jpg"
  else
    for t in ${2//,/ }; do
      ffmpeg -y -loglevel error -ss "$t" -i "$V" -frames:v 1 -vf "hqdn3d=1.5:1.5:3:3,unsharp=5:5:0.5" -q:v 1 "$PROJ/img/v_$t.jpg" && echo "img/v_$t.jpg"
    done
  fi
}
case "$STEP" in build|stills|motion|grab) $STEP "$@";; all) build; stills;; *) echo "unknown step $STEP"; exit 1;; esac
