#!/usr/bin/env bash
# Prepare a B-roll video for clip(): frames at 30 fps, 1080 px wide, into <project>/broll/<name>/f%05d.jpg
# usage: prep_broll.sh <project_dir> <video | Google Drive link | URL> <name> [start_sec] [dur_sec]
# Still images need no prep: copy them to <project>/img/ and use pic().
set -euo pipefail
PROJ="$(mkdir -p "$1" && cd "$1" && pwd)"; SRC="$2"; NAME="$3"; SS="${4:-0}"; DUR="${5:-}"
HERE="$(cd "$(dirname "$0")" && pwd)"
TMP="$PROJ/_broll_$NAME"; mkdir -p "$TMP"
if [ -f "$SRC" ]; then IN="$SRC"; else bash "$HERE/fetch_video.sh" "$TMP" "$SRC" >/dev/null; IN=$(ls "$TMP"/input.* | head -1); fi
OUT="$PROJ/broll/$NAME"; rm -rf "$OUT"; mkdir -p "$OUT"
ffmpeg -y -loglevel error -ss "$SS" ${DUR:+-t "$DUR"} -i "$IN" -an -vf "fps=30,scale=1080:-2:flags=lanczos" -q:v 3 "$OUT/f%05d.jpg"
rm -rf "$TMP"
N=$(ls "$OUT" | wc -l); echo "broll $NAME: $N frames ($(python3 -c "print(round($N/30,2))") s) → $OUT"
