#!/usr/bin/env bash
# Get the source clip into the project.  usage: fetch_video.sh <project_dir> <src> [src ...]
#   src = Google Drive share link ("anyone with the link"), any direct https URL, or a local file.
#   Several srcs = parts of one clip in order → joined into one file.
#   Output: <project_dir>/input.mp4 (or input.<ext> for a single file kept as-is)
set -euo pipefail
PROJ="$(mkdir -p "$1" && cd "$1" && pwd)"; shift
[ $# -ge 1 ] || { echo "usage: fetch_video.sh <project_dir> <src> [src ...]"; exit 1; }
DL="$PROJ/_parts"; mkdir -p "$DL"; i=0; parts=()
for src in "$@"; do
  i=$((i+1)); out="$DL/part$i"
  if [ -f "$src" ]; then cp "$src" "$out"
  else
    id=$(echo "$src" | sed -nE 's#.*/d/([A-Za-z0-9_-]+).*#\1#p; s#.*[?&]id=([A-Za-z0-9_-]+).*#\1#p' | head -1)
    url="$src"; [ -n "$id" ] && url="https://drive.usercontent.google.com/download?id=$id&export=download&confirm=t"
    if ! curl -fL --retry 3 -o "$out" "$url"; then
      echo "DOWNLOAD FAILED: $src"
      echo "→ ถ้าเป็นลิงก์ Google Drive: ตั้งไฟล์เป็น 'ทุกคนที่มีลิงก์' และ environment ต้องตั้ง Network access = Full"
      exit 2
    fi
  fi
  if ! ffprobe -v error -select_streams v:0 -show_entries stream=codec_name -of csv=p=0 "$out" | grep -q .; then
    echo "NOT A VIDEO: $src (ได้หน้าเว็บแทนไฟล์? ตรวจสิทธิ์การแชร์)"; head -c 300 "$out"; echo; exit 3
  fi
  parts+=("$out")
done
if [ ${#parts[@]} -eq 1 ]; then
  ext=$(ffprobe -v error -show_entries format=format_name -of csv=p=0 "${parts[0]}" | grep -q mp4 && echo mp4 || echo mov)
  mv "${parts[0]}" "$PROJ/input.$ext"; OUT="$PROJ/input.$ext"
else
  # re-encode join: parts from phones/CapCut may differ in codec/fps
  args=(); fc=""; n=0
  for p in "${parts[@]}"; do args+=(-i "$p"); fc+="[$n:v]fps=30,scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,setsar=1[v$n];[$n:a]aresample=48000[a$n];"; n=$((n+1)); done
  for k in $(seq 0 $((n-1))); do fc+="[v$k][a$k]"; done
  fc+="concat=n=$n:v=1:a=1[v][a]"
  ffmpeg -y -loglevel error "${args[@]}" -filter_complex "$fc" -map "[v]" -map "[a]" -c:v libx264 -crf 14 -preset fast -c:a aac -b:a 256k "$PROJ/input.mp4"
  OUT="$PROJ/input.mp4"
fi
rm -rf "$DL"
ffprobe -v error -show_entries format=duration,size:stream=codec_name,width,height,r_frame_rate -of compact "$OUT"
echo "INPUT: $OUT"
