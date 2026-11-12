#!/usr/bin/env bash
# clip_all_styles.sh <work dir> [style …]  — one real clip in every style (LESSONS 53)
# the work dir holds: clip.mp4 · base/src_frames/ + base/voice.wav (pipeline.sh frames + audio of the raw clip)
#                     plan.js + then.txt (uni/tools/clip_plan.py)
# each style goes to <work dir>/st_<style>/edit.mp4; one line per style: frames · loudness · size · seconds
set -euo pipefail
W=$(realpath "$1"); shift
E=$(cd "$(dirname "$0")/../.." && pwd)
styles=("$@"); [ ${#styles[@]} -gt 0 ] || styles=(card glass split gold card-overlay glass-overlay split-overlay gold-overlay)
IFS=',' read -r id t0 t1 i hit < <(head -1 "$W/then.txt")
then=(); while IFS= read -r l; do [ -n "$l" ] && then+=(--then "$l"); done < <(tail -n +2 "$W/then.txt")
for st in "${styles[@]}"; do
  P=$W/st_$st; s=$(date +%s); mkdir -p "$P"
  ln -sfn "$W/base/src_frames" "$P/src_frames"; ln -sfn "$W/base/voice.wav" "$P/voice.wav"
  python3 "$E/uni/build.py" "$P" "$st" "$id" --t0 "$t0" --t1 "$t1" --index "$i" --hit "$hit" --extra "$W/plan.js" "${then[@]}" > "$P/build.log"
  for step in render audio encode; do bash "$E/core/pipeline.sh" "$P" "$W/clip.mp4" $step > "$P/$step.log" 2>&1 < /dev/null; done
  echo "$st · $(tail -1 "$P/render.log") · $(grep -E 'I:' "$P/audio.log" | tail -1 | tr -s ' ') · $(stat -c %s "$P/edit.mp4") bytes · $(( $(date +%s) - s )) s"
done
