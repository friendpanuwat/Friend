#!/usr/bin/env bash
# Talking-head editorial pipeline.  usage: pipeline.sh <project_dir> <input.mp4> <step>
#   frames  – trim-safe 1080x1920 source frames + cleaned voice track
#   build   – assemble scene.html from timeline.js + brand.json
#   preview – stills at T (env PREVIEW="1.5,7.6,...") → <project>/prev/ + contact sheet prev.jpg
#   render  – all frames, 4 parallel workers
#   audio   – SFX cues → synth → mix under voice → loudnorm -14 LUFS / -1.5 dBTP
#   encode  – x264 2-pass ≈3.2 Mbps (≈22 MB / 50 s) + QC sheet qc_sheet.jpg
#   hq      – high-quality master edit_hq.mp4 (≈8–12 Mbps, kept ≤ 95 MB for GitHub) — deliver with deliver_github.sh
#   all     – frames build render audio encode
# env HOLD=<sec> (set at the frames step, remembered in <project>/.hold): freeze the last frame that long after the speech
#   so the closing card can be read; voice is padded with silence.
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
PROJ="$(mkdir -p "$1" && cd "$1" && pwd)"; IN="$2"; STEP="${3:-all}"
export NODE_PATH="${NODE_PATH:-$(npm root -g)}"
DUR_IN=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$IN")
if [ -n "${HOLD:-}" ]; then echo "$HOLD" > "$PROJ/.hold"; fi
HOLD=$(cat "$PROJ/.hold" 2>/dev/null || echo 0)
DUR=$(python3 -c "print(round($DUR_IN+$HOLD,3))")
SFX_DB=$(python3 -c "import json,os;p='$PROJ/brand.json';print(json.load(open(p)).get('sfx_db',-17) if os.path.exists(p) else -17)")

frames() {
  rm -rf "$PROJ/src_frames" && mkdir -p "$PROJ/src_frames"
  ffmpeg -y -loglevel error -i "$IN" -vf "fps=30,hqdn3d=1.5:1.5:3:3,scale=1080:1920:force_original_aspect_ratio=increase:flags=lanczos,crop=1080:1920,unsharp=5:5:0.6" -q:v 2 "$PROJ/src_frames/s%05d.jpg"
  N=$(ls "$PROJ/src_frames" | wc -l); EXTRA=$(python3 -c "print(int(round($HOLD*30)))")
  for k in $(seq 1 $EXTRA); do cp "$PROJ/src_frames/$(printf s%05d.jpg $N)" "$PROJ/src_frames/$(printf s%05d.jpg $((N+k)))"; done
  END=$(python3 -c "print(max(0,round($DUR_IN-0.15,2)))")
  ffmpeg -y -loglevel error -i "$IN" -vn -af "aresample=48000,highpass=f=80,afftdn=nf=-28,acompressor=threshold=-22dB:ratio=3:attack=8:release=120:makeup=4dB,equalizer=f=3500:t=q:w=1:g=2,afade=t=out:st=$END:d=0.15,apad=pad_dur=$HOLD" -ac 2 "$PROJ/voice.wav"
  ffmpeg -y -loglevel error -i "$PROJ/src_frames/s00090.jpg" -vf "drawgrid=w=1080:h=100:t=2:c=red@0.6,scale=540:-2" "$PROJ/grid.jpg" 2>/dev/null || true
  echo "frames: $(ls "$PROJ/src_frames" | wc -l)  duration: $DUR s  · layout check (100 px grid): $PROJ/grid.jpg"
}
build()   { python3 "$HERE/build_scene.py" "$PROJ"; }
preview() {
  rm -rf "$PROJ/prev"; node "$HERE/render.js" "$PROJ" preview "${PREVIEW:?set PREVIEW=t1,t2,...}"
  ffmpeg -y -loglevel error -pattern_type glob -i "$PROJ/prev/p_*.jpg" -vf "scale=270:480,tile=8x$(( ( $(ls "$PROJ/prev" | wc -l) + 7 ) / 8 ))" -frames:v 1 "$PROJ/prev.jpg"
  echo "preview sheet: $PROJ/prev.jpg"
}
render() {
  N=$(ls "$PROJ/src_frames" | wc -l); Q=$(( (N + 3) / 4 )); rm -rf "$PROJ/out_frames"
  for i in 0 1 2 3; do s=$((i*Q)); e=$(( (i+1)*Q < N ? (i+1)*Q : N )); node "$HERE/render.js" "$PROJ" range $s $e & done; wait
  echo "rendered: $(ls "$PROJ/out_frames" | wc -l) / $N"
}
audio() {
  node "$HERE/render.js" "$PROJ" sfx
  (cd "$PROJ" && python3 "$HERE/sfx.py" cues.json sfx_track.wav "$DUR")
  ffmpeg -y -loglevel error -i "$PROJ/voice.wav" -i "$PROJ/sfx_track.wav" -filter_complex "[1:a]volume=${SFX_DB}dB,aformat=channel_layouts=stereo[s];[0:a][s]amix=inputs=2:normalize=0:duration=first[m]" -map "[m]" "$PROJ/premix.wav"
  J=$(ffmpeg -i "$PROJ/premix.wav" -af loudnorm=I=-14:TP=-1.5:LRA=9:print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p')
  P=$(echo "$J" | python3 -c "import json,sys;d=json.load(sys.stdin);print(f\"measured_I={d['input_i']}:measured_TP={d['input_tp']}:measured_LRA={d['input_lra']}:measured_thresh={d['input_thresh']}:offset={d['target_offset']}\")")
  ffmpeg -y -loglevel error -i "$PROJ/premix.wav" -af "loudnorm=I=-14:TP=-1.5:LRA=9:$P:linear=true,aresample=48000" -c:a pcm_s16le "$PROJ/master0.wav"
  # loudnorm falls short when the true-peak ceiling binds (peaky speech) → make up the rest with gain into a limiter
  I0=$(ffmpeg -i "$PROJ/master0.wav" -af ebur128 -f null - 2>&1 | grep -E "^\s+I:" | tail -1 | awk '{print $2}')
  G=$(python3 -c "g=-14-float('$I0'); print(round(g,2) if g>0.2 else 0)")
  ffmpeg -y -loglevel error -i "$PROJ/master0.wav" -af "volume=${G}dB,alimiter=limit=0.83:attack=3:release=60:level=false,aresample=48000" -c:a pcm_s16le "$PROJ/master.wav"
  rm -f "$PROJ/master0.wav"
  ffmpeg -i "$PROJ/master.wav" -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+(I:|Peak:)"
}
encode() {
  cd "$PROJ"
  ffmpeg -y -loglevel error -framerate 30 -i out_frames/o%05d.jpg -c:v libx264 -preset slower -b:v 3200k -maxrate 4600k -bufsize 9000k -pass 1 -an -f null /dev/null
  ffmpeg -y -loglevel error -framerate 30 -i out_frames/o%05d.jpg -i master.wav -map 0:v -map 1:a -c:v libx264 -preset slower -b:v 3200k -maxrate 4600k -bufsize 9000k -pass 2 -pix_fmt yuv420p -c:a aac -b:a 160k -movflags +faststart -shortest edit.mp4
  rm -f ffmpeg2pass-0.log*
  ffmpeg -y -loglevel error -i edit.mp4 -vf "fps=1/2,scale=150:-1,tile=13x3" -frames:v 1 qc_sheet.jpg
  ls -la edit.mp4; echo "QC sheet: $PROJ/qc_sheet.jpg"
}
hq() {
  cd "$PROJ"
  # bitrate so the file stays under 95 MB (GitHub hard limit 100 MB), capped at 12 Mbps
  VB=$(python3 -c "print(int(min(12000, 95*8000/float('$DUR') - 256 - 300)))")
  [ "$VB" -lt 2000 ] && { echo "clip too long for a ≤95 MB HQ file ($DUR s)"; exit 1; }
  ffmpeg -y -loglevel error -framerate 30 -i out_frames/o%05d.jpg -c:v libx264 -preset slow -tune film -b:v ${VB}k -maxrate $((VB*3/2))k -bufsize $((VB*3))k -pass 1 -an -f null /dev/null
  ffmpeg -y -loglevel error -framerate 30 -i out_frames/o%05d.jpg -i master.wav -map 0:v -map 1:a -c:v libx264 -preset slow -tune film -b:v ${VB}k -maxrate $((VB*3/2))k -bufsize $((VB*3))k -pass 2 -pix_fmt yuv420p -c:a aac -b:a 256k -movflags +faststart -shortest edit_hq.mp4
  rm -f ffmpeg2pass-0.log*
  ls -la edit_hq.mp4; echo "HQ video bitrate: ${VB} kbps"
}
case "$STEP" in frames|build|preview|render|audio|encode|hq) $STEP;; all) frames; build; render; audio; encode;; *) echo "unknown step $STEP"; exit 1;; esac
