#!/usr/bin/env bash
# cinematic-cutout-shorts-overlay pipeline.   usage: pipeline.sh <project_dir> <step> [args]
#   frames        – the clip (project/input.*) → 1080×1920 frames at 30 fps (no colour change) + face_sheet.jpg (line every 200 px)
#   cut t1,t2,... – cut the speaker out of the frames at those times → project/cutouts/c_<t>.png + index.json (head position)
#   build         – assets + project/graphics.js + project/timeline.js → project/scene.html, mattes for every behind-the-speaker
#                   range, then check it: JS errors, missing files, graphics on the face or outside the safe area stop here
#   preview       – stills at PREVIEW="t1,t2,..." → project/prev/ + prev.jpg (red guide lines at x 900 and y 240)
#   render        – every frame with 4 parallel workers → project/out_frames/
#   encode        – out_frames + the clip's own audio (+ the few quiet sound cues) → edit.mp4 (≤ ~28 MB) + qc_sheet.jpg
#   hq            – high-quality edit_hq.mp4 (≈8–12 Mbps, ≤ 95 MB) for posting — deliver with deliver_github.sh
#   all           – build render encode
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"; SK="$(dirname "$HERE")"
PROJ="$(mkdir -p "$1" && cd "$1" && pwd)"; STEP="${2:?step: frames|cut|build|preview|render|encode|hq|all}"
export NODE_PATH="${NODE_PATH:-$(npm root -g)}"
IN="$(ls "$PROJ"/input.* 2>/dev/null | head -1)"; [ -n "$IN" ] || { echo "no $PROJ/input.* — run fetch_video.sh first"; exit 1; }
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$IN")
N=$(python3 -c "import math;print(math.floor($DUR*30))")
GUIDE="drawbox=x=900:y=0:w=5:h=1920:color=red:t=fill,drawbox=x=0:y=240:w=1080:h=5:color=red:t=fill"   # safe-area edges: right x 900 · top y 240

frames() {
  rm -rf "$PROJ/src_frames" "$PROJ/mattes" && mkdir -p "$PROJ/src_frames"
  ffmpeg -y -loglevel error -i "$IN" -vf "fps=30,scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920" -q:v 2 "$PROJ/src_frames/s%05d.jpg"
  ffmpeg -y -loglevel error -i "$IN" -vf "fps=1/2,scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,drawgrid=w=200:h=200:t=4:c=yellow@0.8,scale=216:-1,tile=8x$(( ( ${DUR%.*} / 2 + 8 ) / 8 ))" -frames:v 1 "$PROJ/face_sheet.jpg"
  echo "frames: $(ls "$PROJ/src_frames" | wc -l)  duration: $DUR s  · face sheet: $PROJ/face_sheet.jpg (yellow grid every 200 px)"
}
cut() { python3 "$HERE/cutout.py" stills "$PROJ" "${1:?times: t1,t2,...}"; }
build() {
  for f in graphics.js timeline.js; do [ -f "$PROJ/$f" ] || { echo "missing $PROJ/$f"; exit 1; }; done
  mkdir -p "$PROJ/fonts" && cp "$SK"/assets/fonts/*.ttf "$PROJ/fonts/"
  { cat "$SK/assets/engine_head.html"
    echo "const CUTS = $(cat "$PROJ/cutouts/index.json" 2>/dev/null || echo '{}');"
    cat "$SK/assets/cutout_kit.js" "$SK/assets/overlay_kit.js" "$PROJ/graphics.js" "$PROJ/timeline.js" "$SK/assets/engine_tail.html"; } > "$PROJ/scene.html"
  node "$HERE/render.js" "$PROJ" info
  if [ "$(cat "$PROJ/mattes.json")" != "[]" ]; then python3 "$HERE/cutout.py" mattes "$PROJ" "$PROJ/mattes.json"; fi
  node "$HERE/render.js" "$PROJ" check
}
preview() {
  node "$HERE/render.js" "$PROJ" preview "${PREVIEW:?set PREVIEW=t1,t2,...}"
  local n; n=$(ls "$PROJ/prev" | wc -l)
  ffmpeg -y -loglevel error -pattern_type glob -i "$PROJ/prev/p_*.jpg" -vf "$GUIDE,scale=270:-1,tile=4x$(( (n + 3) / 4 ))" -frames:v 1 "$PROJ/prev.jpg"
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
audio() {   # the clip's own audio untouched; the quiet cues (if any) are laid under it without changing its level
  cd "$PROJ"
  if [ -s cues.json ] && [ "$(cat cues.json)" != "[]" ]; then
    python3 "$HERE/sfx.py" cues.json sfx_track.wav "$DUR" >/dev/null
    ffmpeg -y -loglevel error -i "$IN" -i sfx_track.wav -filter_complex "[1:a]aformat=channel_layouts=stereo,aresample=48000[s];[0:a]aresample=48000[v];[v][s]amix=inputs=2:normalize=0:duration=first[m]" -map "[m]" -c:a pcm_s16le mix.wav
  else ffmpeg -y -loglevel error -i "$IN" -vn -c:a pcm_s16le mix.wav; fi
}
encode() {
  audio
  local vb; vb=$(python3 -c "print(int(max(1200, min(4000, 28*8000/float('$DUR') - 160))))")
  ffmpeg -y -loglevel error -framerate 30 -i out_frames/o%05d.jpg -i mix.wav -map 0:v -map 1:a -c:v libx264 -preset slow -b:v ${vb}k -maxrate $((vb * 3 / 2))k -bufsize $((vb * 3))k -pix_fmt yuv420p -c:a aac -b:a 128k -shortest -movflags +faststart edit.mp4
  ffmpeg -y -loglevel error -i edit.mp4 -vf "fps=2,$GUIDE,scale=150:-1,tile=14x$(python3 -c "import math;print(math.ceil(float('$DUR')*2/14))")" -frames:v 1 qc_sheet.jpg
  ls -la edit.mp4; echo "QC sheet (2 frames/s, red lines = x 900 · y 240): $PROJ/qc_sheet.jpg"
}
hq() {
  audio
  local vb; vb=$(python3 -c "print(int(min(12000, 95*8000/float('$DUR') - 256 - 300)))")
  [ "$vb" -lt 2000 ] && { echo "clip too long for a ≤95 MB HQ file ($DUR s)"; exit 1; }
  ffmpeg -y -loglevel error -framerate 30 -i out_frames/o%05d.jpg -i mix.wav -map 0:v -map 1:a -c:v libx264 -preset slow -tune film -b:v ${vb}k -maxrate $((vb * 3 / 2))k -bufsize $((vb * 3))k -pix_fmt yuv420p -c:a aac -b:a 256k -shortest -movflags +faststart edit_hq.mp4
  ls -la edit_hq.mp4
}
case "$STEP" in
  frames) frames ;; cut) cut "${3:-}" ;; build) build ;; preview) preview ;; render) render ;; encode) encode ;; hq) hq ;;
  all) build; render; encode ;;
  *) echo "unknown step $STEP"; exit 1 ;;
esac
