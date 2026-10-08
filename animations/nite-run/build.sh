#!/usr/bin/env bash
# Full build: render 900 frames in 3 parallel parts, synthesize audio, master to -14 LUFS, encode.
#   bash build.sh            # everything
#   bash build.sh finish     # only concat + audio + encode (segments already rendered)
set -euo pipefail
cd "$(dirname "$0")"
export NODE_PATH="${NODE_PATH:-$(npm root -g)}"
mkdir -p out
if [ "${1:-}" != "finish" ]; then
  [ -d node_modules/three ] || npm ci
  node render.js --frames 0:330 --out out/seg_a.mp4 > out/log_a.txt 2>&1 &
  node render.js --frames 330:560 --out out/seg_b.mp4 > out/log_b.txt 2>&1 &
  node render.js --frames 560:900 --out out/seg_c.mp4 > out/log_c.txt 2>&1 &
  wait
fi
printf "file 'seg_a.mp4'\nfile 'seg_b.mp4'\nfile 'seg_c.mp4'\n" > out/segs.txt
ffmpeg -y -loglevel error -f concat -safe 0 -i out/segs.txt -c copy out/video.mp4
python3 audio.py out/mix_raw.wav
ffmpeg -y -loglevel error -i out/mix_raw.wav -af loudnorm=I=-14:TP=-1.5:LRA=11 -ar 48000 out/mix.wav
# master (high quality) and a chat-sized copy (~2-pass, <= ~25 MB)
ffmpeg -y -loglevel error -i out/video.mp4 -i out/mix.wav -map 0:v -map 1:a -c:v libx264 -preset slow -crf 16 -pix_fmt yuv420p \
  -c:a aac -b:a 256k -movflags +faststart -shortest out/nite_run_hq.mp4
ffmpeg -y -loglevel error -i out/video.mp4 -c:v libx264 -preset slow -b:v 6000k -pass 1 -passlogfile out/p2 -an -f null /dev/null
ffmpeg -y -loglevel error -i out/video.mp4 -i out/mix.wav -map 0:v -map 1:a -c:v libx264 -preset slow -b:v 6000k -pass 2 -passlogfile out/p2 \
  -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart -shortest out/nite_run.mp4
ls -la out/nite_run*.mp4
