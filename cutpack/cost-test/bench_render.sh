#!/usr/bin/env bash
# CutPack: time every render stage of the talking-head-editorial skill on this machine.
# Run it on the real Hetzner CX23 to replace the numbers measured in a 2-core cloud container (README.md).
# usage: bench_render.sh <work_dir> <video.mp4> <timeline.js> [cores e.g. 0,1] [workers]
#   cores/workers default to every core of the machine.
set -euo pipefail
SK="$(cd "$(dirname "$0")/../../.claude/skills/talking-head-editorial/scripts" && pwd)"
P="$(mkdir -p "$1" && cd "$1" && pwd)"; V="$(realpath "$2")"; cp "$3" "$P/timeline.js"
CORES="${4:-0-$(( $(nproc) - 1 ))}"; W="${5:-$(nproc)}"
export NODE_PATH="${NODE_PATH:-$(npm root -g)}"
TS="taskset -c $CORES"
now() { date +%s.%N; }
since() { python3 -c "print(round($(now)-$1,1))"; }
echo "cores=$CORES workers=$W video=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$V") s"
s=$(now); HOLD=1.0 $TS bash "$SK/pipeline.sh" "$P" "$V" frames >/dev/null; echo "frames   $(since $s) s"
s=$(now); $TS bash "$SK/pipeline.sh" "$P" "$V" build >/dev/null; echo "build    $(since $s) s"
N=$(ls "$P/src_frames" | wc -l); Q=$(( (N + W - 1) / W )); rm -rf "$P/out_frames"
s=$(now)
for i in $(seq 0 $((W - 1))); do a=$((i * Q)); b=$(( (i + 1) * Q < N ? (i + 1) * Q : N )); $TS node "$SK/render.js" "$P" range $a $b & done; wait
echo "render   $(since $s) s  ($(ls "$P/out_frames" | wc -l)/$N frames)"
s=$(now); $TS bash "$SK/pipeline.sh" "$P" "$V" audio >/dev/null; echo "audio    $(since $s) s"
s=$(now); $TS bash "$SK/pipeline.sh" "$P" "$V" encode >/dev/null; echo "encode slower 2-pass (skill now)  $(since $s) s  $(stat -c%s "$P/edit.mp4") bytes"
cd "$P"
for v in "medium 21" "veryfast 23"; do set -- $v
  s=$(now)
  $TS ffmpeg -y -loglevel error -framerate 30 -i out_frames/o%05d.jpg -i master.wav -map 0:v -map 1:a -c:v libx264 -preset $1 -crf $2 \
    -maxrate 4600k -bufsize 9000k -pix_fmt yuv420p -c:a aac -b:a 160k -movflags +faststart -shortest "enc_$1.mp4"
  echo "encode $1 crf$2  $(since $s) s  $(stat -c%s "enc_$1.mp4") bytes"
done
for f in edit.mp4 enc_medium.mp4 enc_veryfast.mp4; do
  echo -n "SSIM vs rendered frames  $f  "
  ffmpeg -loglevel error -framerate 30 -i out_frames/o%05d.jpg -i "$f" -lavfi "[1:v]format=yuv420p[a];[0:v]format=yuv420p[b];[a][b]ssim=stats_file=-" -f null - \
    | awk '{for(i=1;i<=NF;i++) if($i ~ /^All:/){split($i,a,":"); s+=a[2]; n++}} END{printf "%.4f\n", s/n}'
done
