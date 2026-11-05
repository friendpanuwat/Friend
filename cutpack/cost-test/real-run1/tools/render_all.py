"""Render phase: each saved plan.json → edit.mp4 with the engine's own render step (no API). Logs seconds per style.
usage: render_all.py <raw dir> <work dir> <clip names...>"""
import json, os, sys, time
sys.path.insert(0, '/home/user/Friend/cutpack/engine')
import run_clip
raw, work, names = sys.argv[1], sys.argv[2], sys.argv[3:]
for c in names:
    for style in ('editorial', 'overlay'):
        out = os.path.join(work, c, style)
        if os.path.exists(os.path.join(out, 'edit.mp4')): print(c, style, 'already rendered'); continue
        plan = json.load(open(os.path.join(out, 'plan.json')))
        t0 = time.time()
        try:
            mp4 = run_clip.render(os.path.join(raw, c + '.mp4'), os.path.join(work, c, 'base'), out, plan); err = None
        except RuntimeError as e: mp4, err = None, str(e)[:500]
        rec = {'clip': f'{c}:{style}', 'render_s': round(time.time() - t0, 1), 'mp4': mp4, 'error': err,
               'mb': round(os.path.getsize(mp4) / 1e6, 1) if mp4 else None}
        with open(os.path.join(work, 'renders.jsonl'), 'a') as f: f.write(json.dumps(rec) + '\n')
        print(json.dumps(rec), flush=True)
