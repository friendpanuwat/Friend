"""stills.py <plan_dir> <work_dir> <out.jpg>: render a still of every card of plan.json (0.35 s after its hit) on the stand-in clip"""
import json, os, subprocess, sys
sys.path.insert(0, '/home/user/Friend/cutpack/engine/plan'); import plan2timeline
plan_dir, work, out = sys.argv[1:4]
SP = '/tmp/claude-0/-home-user-Friend/03bce9f8-bd9e-5a6f-abb3-3573ff100ae5/scratchpad'
base, clip = f'{SP}/stand/base', f'{SP}/stand/stand.mp4'
PIPE = '/home/user/Friend/cutpack/engine/core/pipeline.sh'
plan = json.load(open(os.path.join(plan_dir, 'plan.json')))
os.makedirs(work, exist_ok=True)
open(os.path.join(work, 'timeline.js'), 'w').write(plan2timeline.convert(plan))
for n in ('src_frames', 'voice.wav'):
    d = os.path.join(work, n)
    if not os.path.lexists(d): os.symlink(os.path.join(base, n), d)
subprocess.run(['bash', PIPE, work, clip, 'build'], check=True, stdout=subprocess.DEVNULL)
ts = [min(s['hit'] + .35, s['t1'] - .05) for s in plan['scenes']]
env = dict(os.environ, PREVIEW=','.join(f'{t:.2f}' for t in ts))
subprocess.run(['bash', PIPE, work, clip, 'preview'], check=True, env=env, stdout=subprocess.DEVNULL)
from PIL import Image, ImageDraw
files = sorted(os.listdir(os.path.join(work, 'prev')))
W = 216; H = 384; cols = 7; rows = (len(files) + cols - 1) // cols
sheet = Image.new('RGB', (cols * (W + 6), rows * (H + 30)), (40, 40, 40))
for i, f in enumerate(files):
    im = Image.open(os.path.join(work, 'prev', f)).resize((W, H))
    x, y = (i % cols) * (W + 6), (i // cols) * (H + 30)
    sheet.paste(im, (x, y + 26)); s = plan['scenes'][i]
    ImageDraw.Draw(sheet).text((x + 4, y + 6), f"{s['t0']:.1f}s {s.get('part')}", fill=(255, 255, 255))
sheet.save(out, quality=82); print(out, len(files))
