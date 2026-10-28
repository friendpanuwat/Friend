#!/usr/bin/env bash
# minimal-talking-shorts-overlay pipeline.   usage: pipeline.sh <project_dir> <step>
#   frames   – the clip (project/input.*) → 1080×1920 frames at 30 fps (no colour change) + face contact sheet face_sheet.jpg
#   build    – assets + project/graphics.js + project/timeline.js → project/scene.html, then check it (JS / FACE errors stop here)
#   preview  – stills at PREVIEW="t1,t2,..." → project/prev/ + prev.jpg (red guide lines at x 900 and y 280 = edges of the safe area)
#   render   – every frame with 4 parallel workers → project/out_frames/
#   encode   – out_frames + the clip's own audio → edit.mp4 (≤ ~28 MB so it opens in chat on a phone) + qc_sheet.jpg
#   hq       – high-quality edit_hq.mp4 (≈8–12 Mbps, ≤ 95 MB) for posting — deliver with deliver_github.sh
#   all      – build render encode
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"; SK="$(dirname "$HERE")"
PROJ="$(mkdir -p "$1" && cd "$1" && pwd)"; STEP="${2:?step: frames|build|preview|render|encode|hq|all}"
export NODE_PATH="${NODE_PATH:-$(npm root -g)}"
IN="$(ls "$PROJ"/input.* 2>/dev/null | head -1)"; [ -n "$IN" ] || { echo "no $PROJ/input.* — run fetch_video.sh first"; exit 1; }
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$IN")
N=$(python3 -c "import math;print(math.floor($DUR*30))")
GUIDE="drawbox=x=900:y=0:w=5:h=1920:color=red:t=fill,drawbox=x=0:y=280:w=1080:h=5:color=red:t=fill"   # safe-area edges: right x 900 · top y 280

frames() {
  rm -rf "$PROJ/src_frames" && mkdir -p "$PROJ/src_frames"
  ffmpeg -y -loglevel error -i "$IN" -vf "fps=30,scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920" -q:v 2 "$PROJ/src_frames/s%05d.jpg"
  # contact sheet every 2 s with a line every 200 px — measure the head band (hair → chin) for face()
  ffmpeg -y -loglevel error -i "$IN" -vf "fps=1/2,scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,drawgrid=w=1080:h=200:t=4:c=yellow@0.8,scale=216:-1,tile=8x$(( ( ${DUR%.*} / 2 + 8 ) / 8 ))" -frames:v 1 "$PROJ/face_sheet.jpg"
  echo "frames: $(ls "$PROJ/src_frames" | wc -l)  duration: $DUR s  · face sheet: $PROJ/face_sheet.jpg (yellow line every 200 px)"
}
build() {
  for f in graphics.js timeline.js; do [ -f "$PROJ/$f" ] || { echo "missing $PROJ/$f"; exit 1; }; done
  mkdir -p "$PROJ/fonts" && cp "$SK"/assets/fonts/* "$PROJ/fonts/"
  cat "$SK/assets/engine_head.html" "$SK/assets/reflook.js" "$SK/assets/ioslook.js" "$SK/assets/swishylook.js" "$SK/assets/minimal_kit.js" "$SK/assets/overlay_kit.js" \
      "$PROJ/graphics.js" "$PROJ/timeline.js" "$SK/assets/engine_tail.html" > "$PROJ/scene.html"
  node "$HERE/render.js" "$PROJ" check
}
preview() {
  node "$HERE/render.js" "$PROJ" preview "${PREVIEW:?set PREVIEW=t1,t2,...}"
  local n; n=$(ls "$PROJ/prev" | wc -l)
  ffmpeg -y -loglevel error -pattern_type glob -i "$PROJ/prev/p_*.jpg" -vf "$GUIDE,scale=216:-1,tile=8x$(( (n + 7) / 8 ))" -frames:v 1 "$PROJ/prev.jpg"
  echo "preview sheet: $PROJ/prev.jpg"
}
render() {
  rm -rf "$PROJ/out_frames"; local q=$(( (N + 3) / 4 )) pids=()
  for i in 0 1 2 3; do local s=$((i * q)) e=$(( (i + 1) * q < N ? (i + 1) * q : N ))
    node "$HERE/render.js" "$PROJ" range $s $e & pids+=($!); done
  local bad=0; for p in "${pids[@]}"; do wait "$p" || bad=1; done
  [ $bad = 0 ] || { echo "RENDER FAILED"; exit 2; }
  echo "rendered: $(ls "$PROJ/out_frames" | wc -l) / $N frames"
}
encode() {
  cd "$PROJ"
  local vb; vb=$(python3 -c "print(int(max(1200, min(4000, 28*8000/float('$DUR') - 160))))")
  ffmpeg -y -loglevel error -framerate 30 -i out_frames/o%05d.jpg -i "$IN" -map 0:v -map 1:a? -c:v libx264 -preset slow -b:v ${vb}k -maxrate $((vb * 3 / 2))k -bufsize $((vb * 3))k -pix_fmt yuv420p -c:a aac -b:a 128k -shortest -movflags +faststart edit.mp4
  ffmpeg -y -loglevel error -i edit.mp4 -vf "fps=2,$GUIDE,scale=150:-1,tile=14x$(python3 -c "import math;print(math.ceil(float('$DUR')*2/14))")" -frames:v 1 qc_sheet.jpg
  ls -la edit.mp4; echo "QC sheet (2 frames/s, red lines = x 900 · y 280): $PROJ/qc_sheet.jpg"
}
hq() {
  cd "$PROJ"
  local vb; vb=$(python3 -c "print(int(min(12000, 95*8000/float('$DUR') - 256 - 300)))")
  [ "$vb" -lt 2000 ] && { echo "clip too long for a ≤95 MB HQ file ($DUR s)"; exit 1; }
  ffmpeg -y -loglevel error -framerate 30 -i out_frames/o%05d.jpg -i "$IN" -map 0:v -map 1:a? -c:v libx264 -preset slow -tune film -b:v ${vb}k -maxrate $((vb * 3 / 2))k -bufsize $((vb * 3))k -pix_fmt yuv420p -c:a aac -b:a 256k -shortest -movflags +faststart edit_hq.mp4
  ls -la edit_hq.mp4
}
case "$STEP" in
  frames) frames ;; build) build ;; preview) preview ;; render) render ;; encode) encode ;; hq) hq ;;
  all) build; render; encode ;;
  *) echo "unknown step $STEP"; exit 1 ;;
esac
