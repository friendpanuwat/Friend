#!/usr/bin/env bash
# strips.sh — check a category sheet video design by design: one row per design, 7 frames after its own start.
# Run from the folder that holds <sheet>/v<sheet>.mp4 (render.js --name v<sheet>). Sheet layout = examples/b0x/sheet-*.html (2 columns, rows 352 px from y 150).
# usage: strips.sh <sheet> <first-k> <last-k> <out.png>   — one row per design, 7 frames: .25 .6 .85 1.1 1.4 1.75 2.4 s after its start
f=$1; rows=""; n=0
for k in $(seq $2 $3); do col=$((k % 2)); row=$((k / 2)); x0=$((col*540)); y0=$((150 + row*352)); at=$(echo "0.3 + $k*0.04" | bc -l | sed "s/^\./0./")
  ins=""; i=0
  for dt in 0.25 0.6 0.85 1.1 1.4 1.75 2.4; do t=$(echo "$at + $dt" | bc -l | sed "s/^\./0./"); ffmpeg -loglevel error -y -ss $t -i $f/v$f.mp4 -frames:v 1 -vf "crop=540:300:$x0:$y0,scale=300:-1" fr$i.png; ins="$ins -i fr$i.png"; i=$((i+1)); done
  ffmpeg -loglevel error -y $ins -filter_complex hstack=7 row$n.png; rows="$rows -i row$n.png"; n=$((n+1)); done
ffmpeg -loglevel error -y $rows -filter_complex vstack=$n $4
