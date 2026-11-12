#!/usr/bin/env bash
# Render one overlay widget on Friend's sample clip: the speaker stays on screen, the example sentence as the chest
# subtitle in the skill's style at top 1300 (Friend 2026-11-04: lower than the skill's 1150), the widget pops up in the free space (short = above the head, narrow = beside it) from 0.7 s to 3.2 s,
# key word at 1.5 s. Uses ../base-parts/samples.json.
# usage: render_widget.sh <work_dir> <cat> <variant> <sample_index> <short|narrow> <out_name> [preview_times]
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"; E="$(cd "$HERE/../../engine/core" && pwd)"
W="$(mkdir -p "$1" && cd "$1" && pwd)"; CAT=$2; V=$3; I=$4; K=$5; NAME=$6; PREV="${7:-}"
export NODE_PATH="${NODE_PATH:-$(npm root -g)}"
[ -d "$W/base/src_frames" ] || bash "$E/pipeline.sh" "$W/base" "$HERE/../sample-clip/character_talking.mp4" frames >/dev/null
P="$W/$NAME"; rm -rf "$P"; mkdir -p "$P"; ln -sfn "$W/base/src_frames" "$P/src_frames"
python3 - "${SAMPLES:-$HERE/../base-parts/samples.json}" "$CAT" "$V" "$I" "$K" > "$P/timeline.js" <<'PY'
import json, sys
f, cat, v, i, k = sys.argv[1:]
d = json.load(open(f))
s = d.get(f'{cat}.{v}', d.get(cat))[int(i)]   # pack items are keyed by part id (B01.biz1), base widgets by category
slots = dict(s['slots'], hit=1.5)
say, key = s['say'], s['slots'].get('key')
# the skill's subtitle: the sentence in 3–4 short chunks, each small lead words + one big word (engine subtitle())
opt = {'key': key, 'keyAt': 1.5} if isinstance(key, str) else {}
print(f"subtitle({json.dumps(say, ensure_ascii=False)}, 0.2, 3.6, {json.dumps(opt, ensure_ascii=False)});")
print(f"widgetAt('{cat}', '{v}', '{k}', 0.7, 3.2, {json.dumps(slots, ensure_ascii=False)});")
PY
python3 "$E/build_scene.py" "$P" >/dev/null
if [ -n "$PREV" ]; then node "$E/render.js" "$P" preview "$PREV"; exit; fi
node "$E/render.js" "$P" range 0 114 >/dev/null
mkdir -p "$W/out"
ffmpeg -y -loglevel error -framerate 30 -i "$P/out_frames/o%05d.jpg" -vf "scale=540:-2:flags=lanczos" -c:v libx264 -crf 24 -preset medium -pix_fmt yuv420p -movflags +faststart -an "$W/out/$NAME.mp4"
ffmpeg -y -loglevel error -i "$P/out_frames/o00075.jpg" -vf "scale=540:-2" -q:v 5 "$W/out/$NAME.jpg"
rm -rf "$P"
