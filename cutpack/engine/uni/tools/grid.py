"""One sheet of many scenes at one moment (made in chat ccr-d06e50c1, 2026-11-10: faster than opening 20 sheets).
usage: python3 tools/grid.py <work> <style> <time e.g. 003.30> <crop w:h:x:y> <out.jpg> [cols=5] [prefix=r7.] [filter …]
  reads <work>/<style>_<prefix>*/prev/p_<time>.jpg made by `PREVIEW=1 render_test.sh` (times 0.3 0.9 1.5 2.1 2.7 3.3 4.2 4.8)
  crops used: card 1000:640:40:460 · glass 1000:640:40:620 · split 860:700:110:200 · ios 1080:1920:0:0 (the whole page) · *-overlay 700:420:190:150"""
import sys, glob, subprocess, os
w, st, t, crop, out = sys.argv[1:6]
cols = int(sys.argv[6]) if len(sys.argv) > 6 else 5
pre = sys.argv[7] if len(sys.argv) > 7 else 'r7.'
flt = sys.argv[8:]
ds = sorted(d for d in glob.glob(f'{w}/{st}_{pre}*') if not flt or any(f in d for f in flt))
args = []
for d in ds: args += ['-i', f'{d}/prev/p_{t}.jpg']
n = len(ds)
fc = ''.join(f"[{i}]crop={crop},scale=300:-2,drawtext=text='{os.path.basename(d).split('.')[-1]}':x=6:y=6:fontsize=22:fontcolor=red[v{i}];" for i, d in enumerate(ds))
lay = '|'.join(('+'.join(['w0'] * (i % cols)) or '0') + '_' + ('+'.join(['h0'] * (i // cols)) or '0') for i in range(n))
fc += ''.join(f'[v{i}]' for i in range(n)) + f'xstack=inputs={n}:layout={lay}:fill=gray'
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', *args, '-filter_complex', fc, out], check=True)
print(out, n, 'scenes')
