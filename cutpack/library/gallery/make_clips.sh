#!/usr/bin/env bash
# CutPack parts gallery: cut every card (editorial C1–C11, F1) and widget (editorial-overlay W1–W14) of the skills'
# example timelines into a short silent clip + poster, rendered with the skills' own engines (the skills are only read).
# Needs the preview work dir from ../../style-rules/previews/make_previews.sh (src_frames, ed_base, ov_base).
# usage: make_clips.sh <preview_work_dir> <out_dir>
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
ED="$(cd "$HERE/../../../.claude/skills/talking-head-editorial" && pwd)"
OV="$(cd "$HERE/../../../.claude/skills/talking-head-editorial-overlay" && pwd)"
W="$(cd "$1" && pwd)"; OUT="$(mkdir -p "$2" && cd "$2" && pwd)"
export NODE_PATH="${NODE_PATH:-$(npm root -g)}"
PARTS="ed C1 1.86 2.46|ed C2 3.64 5.10|ed C3 6.84 9.98|ed C4 10.82 13.16|ed C5 14.88 17.64|ed C6 19.74 21.02|ed C7 22.30 23.52|\
ed C8 23.54 25.00|ed F1 27.58 29.74|ed C9 31.30 33.84|ed C10 35.74 37.94|ed C11 40.50 42.90|\
ov W1 0.05 2.46|ov W2 3.64 5.10|ov W3 6.84 9.98|ov W4 10.82 13.16|ov W5 13.18 14.86|ov W6 15.60 17.64|ov W7 21.30 22.28|\
ov W8 22.30 23.52|ov W9 23.54 25.00|ov W10 26.95 29.74|ov W11 31.30 33.84|ov W12 35.74 37.94|ov W13 38.27 40.48|ov W14 40.50 42.90"
one() {  # one <ed|ov> <id> <t0> <t1>
  local P="$W/${1}_base" SK; [ "$1" = ed ] && SK="$ED" || SK="$OV"
  local f0 f1 n; f0=$(python3 -c "print(max(0,round(($3-0.2)*30)))"); f1=$(python3 -c "print(round(($4+0.25)*30))")
  local D="$W/parts/$2"; rm -rf "$D"; mkdir -p "$D"; cp -r "$P/." "$D/" 2>/dev/null || true; rm -rf "$D/out_frames" "$D/prev"
  node "$SK/scripts/render.js" "$D" range "$f0" "$f1" >/dev/null
  n=$((f1 - f0))
  ffmpeg -y -loglevel error -framerate 30 -start_number "$f0" -i "$D/out_frames/o%05d.jpg" -frames:v "$n" \
    -vf "scale=540:-2:flags=lanczos" -c:v libx264 -crf 26 -preset medium -pix_fmt yuv420p -movflags +faststart -an "$OUT/$2.mp4"
  local mid=$(( f0 + n * 3 / 5 ))
  ffmpeg -y -loglevel error -i "$D/out_frames/o$(printf %05d $mid).jpg" -vf "scale=540:-2" -q:v 5 "$OUT/$2.jpg"
  rm -rf "$D"
}
export -f one; export W ED OV OUT
echo "$PARTS" | tr '|' '\n' | xargs -P 4 -I{} bash -c 'one {}'
ls "$OUT" | wc -l; du -sh "$OUT"
