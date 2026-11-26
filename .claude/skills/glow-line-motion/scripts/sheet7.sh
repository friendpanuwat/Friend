#!/bin/bash
# sheet7.sh — render a seven-size sheet (examples/<cat>/sheet-S<size>.html) as a still or a video.
#   bash scripts/sheet7.sh <cat> <size> <page> <set> <outdir> still [at=4.2]  → <outdir>/S<size>-p<page>-<set>.png  (yellow frames on)
#   bash scripts/sheet7.sh <cat> <size> <page> A    <outdir> video            → <outdir>/<cat>-size<size>[-p<page>].mp4 (FRAME = false, ~6 s)
# <cat> = folder under examples/ (b01s, b12s …) · <set> = A (samples) | B | C (stress) · page = 1 (sizes 4–6 have pages 1–2).
# Every call renders into its own folder, so several can run at once (`… & … & wait`) — sharing one out folder breaks the storyboard step.
set -e
SK="$(cd "$(dirname "$0")/.." && pwd)"
CAT=$1; K=$2; PG=$3; SET=${4:-A}; OUT=$5; MODE=${6:-still}; AT=${7:-4.2}
cd "$SK/examples/$CAT"; mkdir -p "$OUT"
f=".t-$K-$PG-$SET-$MODE.html"
if [ "$MODE" = still ]; then
  sed -e "s/PAGE = [0-9]/PAGE = $PG/" -e "s/SET = 'A'/SET = '$SET'/" "sheet-S$K.html" > "$f"
  node "$SK/scripts/render.js" "$f" "$OUT/o-$K-$PG-$SET" --still --at "$AT" 2>&1 | grep -E "ERROR|rror" || true
  cp "$OUT/o-$K-$PG-$SET/still.png" "$OUT/S$K-p$PG-$SET.png"
else
  N="${CAT%s}-size$K"; grep -q "PAGE = " "sheet-S$K.html" && [ "$K" -ge 4 ] && [ "$K" -le 6 ] && N="$N-p$PG"
  sed -e "s/PAGE = [0-9]/PAGE = $PG/" -e "s/FRAME = true/FRAME = false/" "sheet-S$K.html" > "$f"
  node "$SK/scripts/render.js" "$f" "$OUT/o-$N" --name "$N" 2>&1 | grep -E "ERROR|rror|DURATION" || true
  cp "$OUT/o-$N/$N.mp4" "$OUT/"
fi
rm -f "$f"
