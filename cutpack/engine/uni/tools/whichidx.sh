#!/usr/bin/env bash
# for each old clip poster: render the scene at index 0/1/2 (frame 3.5 s), find the index whose poster matches best,
# and say whether the new code changes the picture (PSNR of the best match; about 41 = unchanged). usage: whichidx.sh <work> <clip dir> <style>…
set -uo pipefail
U="$(cd "$(dirname "$0")/.." && pwd)"; export NODE_PATH=$(npm root -g)
WK=$1; D=$2; shift 2
[ -d "$WK/base/src_frames" ] || bash "$U/../core/pipeline.sh" "$WK/base" "$U/../../library/sample-clip/character_talking.mp4" frames >/dev/null
for st in "$@"; do for jpg in $D/${st}_*.jpg; do
  sc=$(basename $jpg .jpg); sc=${sc#${st}_}; best=""; bp=0
  for i in 0 1 2; do
    P=$WK/wi/${st}_${sc}_$i; rm -rf $P; mkdir -p $P; ln -sfn $WK/base/src_frames $P/src_frames
    args=""; case $st in *-overlay) args="--speaker .86";; esac
    python3 $U/build.py $P $st $sc --index $i $args >/dev/null 2>&1 || continue
    node $U/../core/render.js $P preview 3.5 >/dev/null 2>&1 || continue
    ffmpeg -v error -y -i $P/prev/p_003.50.jpg -vf scale=540:-2 $P/p.jpg
    p=$(ffmpeg -i $jpg -i $P/p.jpg -lavfi psnr -f null - 2>&1 | grep -o "average:[0-9.inf]*" | cut -d: -f2)
    [ "$p" = "inf" ] && p=99
    if python3 -c "import sys; sys.exit(0 if float('$p') > float('$bp') else 1)"; then bp=$p; best=$i; fi
  done
  echo "$st $sc idx=$best psnr=$bp"
done; done
