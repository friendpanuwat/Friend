#!/usr/bin/env bash
# Render one base part as a short clip on Friend's sample clip: 0.4 s talking head → card (3 s) → 0.4 s talking head.
# usage: render_part.sh <work_dir> <cat> <variant> <sample_index> <bg> <out_name> [preview_times]
#   with preview_times: stills only (<work>/<out_name>/prev/*.jpg); without: <work>/out/<out_name>.mp4 + .jpg
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"; E="$(cd "$HERE/../../engine/core" && pwd)"
W="$(mkdir -p "$1" && cd "$1" && pwd)"; CAT=$2; V=$3; I=$4; BG=$5; NAME=$6; PREV="${7:-}"
export NODE_PATH="${NODE_PATH:-$(npm root -g)}"
[ -d "$W/base/src_frames" ] || bash "$E/pipeline.sh" "$W/base" "$HERE/../sample-clip/character_talking.mp4" frames >/dev/null
P="$W/$NAME"; rm -rf "$P"; mkdir -p "$P"; ln -sfn "$W/base/src_frames" "$P/src_frames"
python3 - "$HERE/samples.json" "$CAT" "$V" "$I" "$BG" > "$P/timeline.js" <<'PY'
import json, sys
f, cat, v, i, bg = sys.argv[1:]
s = json.load(open(f))[cat][int(i)]
slots = dict(s['slots'], bg=bg, hit=s.get('hit', 1.5))
print("cards([[0.4, 3.4]]);")
print(f"part('{cat}', '{v}', 0.4, 3.4, {json.dumps(slots, ensure_ascii=False)});")
PY
python3 "$E/build_scene.py" "$P" >/dev/null
if [ -n "$PREV" ]; then node "$E/render.js" "$P" preview "$PREV"; exit; fi
node "$E/render.js" "$P" range 0 114 >/dev/null
mkdir -p "$W/out"
ffmpeg -y -loglevel error -framerate 30 -i "$P/out_frames/o%05d.jpg" -vf "scale=540:-2:flags=lanczos" -c:v libx264 -crf 24 -preset medium -pix_fmt yuv420p -movflags +faststart -an "$W/out/$NAME.mp4"
ffmpeg -y -loglevel error -i "$P/out_frames/o00075.jpg" -vf "scale=540:-2" -q:v 5 "$W/out/$NAME.jpg"
rm -rf "$P"
