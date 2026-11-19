#!/usr/bin/env bash
# clip_all_styles.sh <work dir> [style …]  — one real clip in every style (LESSONS 53)
# the work dir holds: clip.mp4 · base/src_frames/ + base/voice.wav (pipeline.sh frames + audio of the raw clip)
#                     plan_<style>.js + then_<style>.txt per style (uni/tools/clip_plan.py <dir> <faces> <style>…),
#                     else plan.js + then.txt for every style
# each style goes to <work dir>/st_<style>/edit.mp4; one line per style: frames · loudness · size · seconds
set -euo pipefail
W=$(realpath "$1"); shift
E=$(cd "$(dirname "$0")/../.." && pwd)
styles=("$@"); [ ${#styles[@]} -gt 0 ] || styles=(neon lime window teal violet yellow hud horizon terminal pink cream)   # 2026-11-17: the old 8 styles are cancelled; the new ones join one by one
for st in "${styles[@]}"; do
  plan=$W/plan_$st.js; tx=$W/then_$st.txt; [ -f "$plan" ] || { plan=$W/plan.js; tx=$W/then.txt; }
  id=''; IFS=',' read -r id t0 t1 i hit < <(grep -m1 . "$tx") || true
  # no picture at all (no category has a draft yet, 2026-11-17): build the page with scene "-" = subtitles + camera only
  if [ -n "$id" ]; then first=("$id" --t0 "$t0" --t1 "$t1" --index "$i" --hit "$hit"); else first=(-); fi
  then=(); while IFS= read -r l; do [ -n "$l" ] && then+=(--then "$l"); done < <(grep . "$tx" | tail -n +2)
  P=$W/st_$st; s=$(date +%s); mkdir -p "$P"
  ln -sfn "$W/base/src_frames" "$P/src_frames"; ln -sfn "$W/base/voice.wav" "$P/voice.wav"
  python3 "$E/uni/build.py" "$P" "$st" "${first[@]}" --extra "$plan" "${then[@]}" > "$P/build.log"
  if grep -q 'realShapes: true' "$E/uni/styles/$st.js" && [ -n "$id" ]; then   # the pictures' real shapes, then build again (tools/real_shapes.js, 2026-11-18 neon)
    node "$E/uni/tools/real_shapes.js" "$P" "$P/real_shapes.js" > "$P/shapes.log"
    python3 "$E/uni/build.py" "$P" "$st" "${first[@]}" --extra "$plan" --extra "$P/real_shapes.js" "${then[@]}" > "$P/build.log"; fi
  for step in render audio encode; do bash "$E/core/pipeline.sh" "$P" "$W/clip.mp4" $step > "$P/$step.log" 2>&1 < /dev/null; done
  echo "$st · $(tail -1 "$P/render.log") · $(grep -E 'I:' "$P/audio.log" | tail -1 | tr -s ' ') · $(stat -c %s "$P/edit.mp4") bytes · $(( $(date +%s) - s )) s"
done
