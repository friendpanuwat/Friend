"""Demo of ข. (speaker shrinks for a widget that has no room) on the English clip — B14 text widgets from the captions,
placed per moment (ก.); the ones with no room get frame(..., {bg: 'glow', o}) around them. Not part of the system."""
import json, os, sys, re
sys.path.insert(0, '/home/user/Friend/cutpack/engine'); sys.path.insert(0, '/home/user/Friend/cutpack/engine/plan')
import assemble, plan2timeline, run_clip, validate, prompt
S, OUT = sys.argv[1], sys.argv[2]
c = 'VID_20261105115846'; d = f'{S}/run3/{c}'
inp = json.load(open(f'{d}/input_track.json'))
icons = ['lightbulb', 'message-circle', 'target', 'sparkles', 'search', 'zap', 'check', 'star']
scenes, last = [], -10
for cap in inp['captions']:
    t0, t1 = cap['t0'], cap['t1']
    if t0 - last < 2.2 or t1 - t0 < 1.3: continue
    toks = [x for x in re.split(r'[ /]+', cap['text']) if x]
    if not 2 <= len(toks) <= 7 or any(validate.graphemes(x) > 12 for x in toks): continue
    t1 = min(t1, t0 + 3.0)
    key = max(range(len(toks)), key=lambda k: len(toks[k]))
    scenes.append({'t0': round(t0, 2), 't1': round(t1, 2), 'part': 'B14.v1' if len(scenes) % 2 == 0 else 'B14.v3', 'size': 'short',
                   'hit': round(min(t0 + .6, t1 - .35), 2), 'say': cap['text'], 'need': '',
                   'slots': {'words': toks, 'key': key, 'icon': icons[len(scenes) % len(icons)]}})
    last = t1
plan = assemble.assemble(inp, {'topic': 'edu', 'camera': [], 'scenes': scenes}, 'overlay')
shrink = []
for s in plan['scenes']:
    if not s.get('pos'): s['pos'] = {'x': 240, 'y': 150}; s['size'] = 'short'; shrink.append([s['t0'] - .5, s['t1'] + .5])
wins = []
for a, b in shrink:   # neighbours closer than 0.8 s share one shrink, so the speaker does not bounce
    if wins and a - wins[-1][1] < .8: wins[-1][1] = b
    else: wins.append([a, b])
js = plan2timeline.convert(plan) + ''.join(f"frame({a:.2f}, {b:.2f}, {{bg: 'glow', s: .8, y: 1150, r: 44, d: .45, o: .45}});\n" for a, b in wins)
R, _ = validate.validate(plan, prompt.load_catalog(), json.load(open(f'{d}/faces_track.json')), render=False)
bad = [i for i in R.issues if i['level'] == 'error' and i['code'] not in ('place-face', 'place-nofit', 'density-low', 'bare-long')]
print('checker errors other than room:', [(i['code'], i['msg'][:60]) for i in bad])
os.makedirs(OUT, exist_ok=True)
open(f'{OUT}/timeline.js', 'w').write(js); json.dump(plan, open(f'{OUT}/plan.json', 'w'), ensure_ascii=False, indent=1)
print(len(plan['scenes']), 'widgets:', sum(1 for s in plan['scenes'] if s.get('where')), 'placed by ก. (', {w: sum(s.get('where') == w for s in plan['scenes']) for w in ('top', 'chest', 'left', 'right')}, ')',
      len(shrink), 'with ข. in', len(wins), 'shrinks')
base = f'{d}/base'
for name in ('src_frames', 'voice.wav', '.hold'):
    src, dst = os.path.join(base, name), os.path.join(OUT, name)
    if os.path.exists(src) and not os.path.lexists(dst): os.symlink(src, dst)
for step in ('build', 'render', 'audio', 'encode'):
    run_clip.sh('bash', run_clip.PIPE, OUT, f'{S}/raw1/{c}.mp4', step)
print('→', f'{OUT}/edit.mp4')
