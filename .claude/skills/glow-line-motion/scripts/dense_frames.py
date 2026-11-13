#!/usr/bin/env python3
# dense_frames.py — look at ONE design of a category sheet video frame by frame (14 frames, every .15 s): catches motion bugs strips.sh misses
# (a part swinging the wrong way, a token sinking into a ramp, a piece leaving the canvas). Sheet layout = examples/b0x/sheet-*.html.
# usage: python3 scripts/dense_frames.py <video.mp4> <k = index of the design on that sheet, 0–9> <out.png>
# Writes a temporary f.png in the current folder — run one at a time per folder (like strips.sh).
import subprocess, sys
from PIL import Image
vid, k, out = sys.argv[1], int(sys.argv[2]), sys.argv[3]
col, row = k % 2, k // 2; x0, y0 = col*540, 150+row*352; at = .3 + k*.04
ts = [.35,.5,.65,.8,.95,1.1,1.25,1.4,1.55,1.7,1.85,2.0,2.2,2.5]
o = Image.new('RGB', (7*360, 2*200))
for i, dt in enumerate(ts):
    subprocess.run(['ffmpeg','-loglevel','error','-y','-ss',f'{at+dt:.3f}','-i',vid,'-frames:v','1','-vf',f'crop=540:300:{x0}:{y0},scale=360:-1','f.png'], check=True)
    o.paste(Image.open('f.png'), ((i%7)*360, (i//7)*200))
o.save(out)
