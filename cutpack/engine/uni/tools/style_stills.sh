#!/usr/bin/env bash
# style_stills.sh <out dir> <speaker frame.jpg> <style> [style …] — the 12 test shots of each style (glow/<style>_test.js) as stills
# (2026-11-18, from the styles 6–10 chat). Writes <out>/out/<style>_<shot>_<i>.jpg + .contrast.json and <out>/<style>.log, and prints
# one line per style: how many stills came out "ok" and how many have something outside TikTok's safe zone (must be 0).
# The frame: the test clip's s00108.jpg to check; library/styles/speaker_standin.jpg for a still kept in the repo (LESSONS 65).
set -euo pipefail
O=$(realpath -m "$1"); FR=$(realpath "$2"); shift 2; mkdir -p "$O"
cd "$(dirname "$0")/.."
for st in "$@"; do list=""; i=0
  for id in $(grep -o "GLOW[A-Z]*('[a-z0-9]*'" glow/${st}_test.js | sed "s/.*('\(.*\)'/\1/"); do list="$list $st:$id@$i"; i=$((i+1)); done
  NODE_PATH=$(npm root -g) node glow/stills.js "$O/work" "$O/out" "$FR" glow/${st}_test.js 3.8 "$list" > "$O/$st.log" 2>&1
  echo "$st $(grep -c ' ok' "$O/$st.log") ok · $(grep -c 'OUTSIDE' "$O/$st.log") outside"
done
