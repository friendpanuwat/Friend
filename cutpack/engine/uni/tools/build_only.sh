#!/usr/bin/env bash
# build_only.sh <work dir> <style> <out dir> — build a real clip's page without rendering (seconds instead of minutes), to see which
# screens a seed takes: then `NODE_PATH=$(npm root -g) node tools/picture_sizes.js <out dir>` lists them (2026-11-18: used to find a
# seed that shows a screen). The work dir as clip_all_styles.sh: base/src_frames, base/voice.wav, plan_<style>.js, then_<style>.txt.
set -euo pipefail
W=$(realpath "$1"); st=$2; P=$(realpath -m "$3"); E=$(cd "$(dirname "$0")/../.." && pwd)
tx=$W/then_$st.txt; IFS=',' read -r id t0 t1 i hit < <(grep -m1 . "$tx")
then=(); while IFS= read -r l; do [ -n "$l" ] && then+=(--then "$l"); done < <(grep . "$tx" | tail -n +2)
mkdir -p "$P"; ln -sfn "$W/base/src_frames" "$P/src_frames"; ln -sfn "$W/base/voice.wav" "$P/voice.wav"
python3 "$E/uni/build.py" "$P" "$st" "$id" --t0 "$t0" --t1 "$t1" --index "$i" --hit "$hit" --extra "$W/plan_$st.js" "${then[@]}" > "$P/build.log"
if grep -q 'realShapes: true' "$E/uni/styles/$st.js"; then   # as clip_all_styles.sh: the pictures' real shapes, then build again
  node "$E/uni/tools/real_shapes.js" "$P" "$P/real_shapes.js" > "$P/shapes.log"
  python3 "$E/uni/build.py" "$P" "$st" "$id" --t0 "$t0" --t1 "$t1" --index "$i" --hit "$hit" --extra "$W/plan_$st.js" --extra "$P/real_shapes.js" "${then[@]}" > "$P/build.log"; fi
