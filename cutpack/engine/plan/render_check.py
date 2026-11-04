#!/usr/bin/env python3
"""The render half of validate.py: build the plan's scene in the engine and measure every visible text box.

usage: render_check.py <plan.json>        (validate.py --render calls run() after the plan passes the other checks)
Catches what only shows on screen: the engine refusing a slot (B14 key out of range, phrase too long…), text running off
the frame or out of its card or widget, two texts touching (this includes Thai marks above and below, since the box is
the font's full line box), and subtitles or widget text in the app's right-hand button strip.
A problem must be seen in 2 samples in a row (0.2 s apart) before it counts, so a word crossing another for a frame
during an entrance is not reported. Cards are full-screen: the right strip is a warning there, not an error.
"""
import json, os, subprocess, sys, tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import plan2timeline

STEP, PAD = .2, 2.0
RIGHT_X, RIGHT_Y = 940, (860, 1620)


def sample_times(plan):
    dur = plan['clip']['duration']
    ts = {round(k * STEP, 3) for k in range(int(dur / STEP) + 1)}
    for s in plan['scenes']:
        ts |= {round(s['hit'] + .45, 3), round(s['t1'] - .25, 3)}
    return sorted(t for t in ts if 0 <= t < dur)


def measure(plan):
    with tempfile.TemporaryDirectory() as d:
        open(os.path.join(d, 'timeline.js'), 'w').write(plan2timeline.convert(plan, guard=True))
        subprocess.run(['python3', os.path.join(HERE, '..', 'core', 'build_scene.py'), d], check=True, capture_output=True)
        tf = os.path.join(d, 'times.json'); json.dump(sample_times(plan), open(tf, 'w'))
        out = subprocess.run(['node', os.path.join(HERE, 'render_check.js'), d, tf], check=True, capture_output=True, text=True)
        return json.loads(out.stdout)


def inter(a, b):
    return min(a[2], b[2]) - max(a[0], b[0]), min(a[3], b[3]) - max(a[1], b[1])


def problems(texts):
    """All problems in one sample, as {key: (level, code, where, msg, owner)} so the same problem can be followed over time."""
    P = {}
    for x in texts:
        b, w = x['box'], f"{x['owner']} \"{x['text'][:24]}\""
        if b[0] < -PAD or b[1] < -PAD or b[2] > 1080 + PAD or b[3] > 1920 + PAD:
            P[('off', x['id'])] = ('error', 'text-off-frame', w, f'text box {b} runs off the frame', x['owner'])
        c = x.get('clip')
        if c and (b[0] < c[0] - PAD or b[1] < c[1] - PAD or b[2] > c[2] + PAD or b[3] > c[3] + PAD):
            P[('cut', x['id'])] = ('error', 'text-cut', w, f'text box {b} is cut by its box {[round(v) for v in c]}', x['owner'])
        if x['owner'] != 'card' and b[2] > RIGHT_X + PAD and b[1] < RIGHT_Y[1] and b[3] > RIGHT_Y[0]:
            P[('right', x['id'])] = ('error', 'text-right-strip', w, f'text reaches x {b[2]:.0f} in the app\'s button strip (> {RIGHT_X})', x['owner'])
        elif x['owner'] == 'card' and b[2] > RIGHT_X + PAD and b[1] < RIGHT_Y[1] and b[3] > RIGHT_Y[0]:
            P[('right', x['id'])] = ('warn', 'text-right-strip', w, f'card text reaches x {b[2]:.0f}, under the app\'s buttons', x['owner'])
    for i, a in enumerate(texts):
        for b in texts[i + 1:]:
            ow, oh = inter(a['box'], b['box'])
            if ow <= 1 or oh <= 1: continue
            worst = max((min(inter(p, q)) for p in a.get('parts') or [a['box']] for q in b.get('parts') or [b['box']]), default=0)
            if worst > 1:
                P[('touch', min(a['id'], b['id']), max(a['id'], b['id']))] = ('error', 'text-overlap', f"{a['owner']} \"{a['text'][:16]}\" / \"{b['text'][:16]}\"",
                                                                               f'letters overlap by {worst:.0f} px (letters or Thai marks touch)', b['owner'] if a['owner'] == 'sub' else a['owner'])
    return P


def owner_index(plan, owner, t):
    """Which scene (card/widget text) or subtitle (sub text) is on screen at t."""
    if owner == 'sub':
        return {'sub': next((i for i, x in enumerate(plan.get('subtitles', [])) if x['t0'] <= t < x['t1']), None)}
    return {'scene': next((i for i, x in enumerate(plan['scenes']) if x['t0'] <= t < x['t1']), None)}


def run(plan, R):
    res = measure(plan)
    for e in res['errors']: R.err('engine', 'render', e)
    for what, i, msg in res.get('planErr', []):
        key = {'scene': 'scene', 'subtitle': 'sub', 'camera': 'cam'}[what]
        R.err('engine', f'{what}s[{i}]', f'the engine refused it: {msg}', **{key: i})
    prev, seen = {}, set()
    for s in res['samples']:
        cur = problems(s['texts'])
        for k, (lvl, code, where, msg, owner) in cur.items():
            if k in prev and k not in seen:
                seen.add(k)
                (R.err if lvl == 'error' else R.warn)(code, f"{s['t']:.2f}s {where}", msg, **owner_index(plan, owner, s['t']))
        prev = cur
    return res

if __name__ == '__main__':
    import validate
    plan = json.load(open(sys.argv[1]))
    R = validate.Report()
    res = run(plan, R)
    for i in R.issues: print(f"{i['level']:5} {i['code']:16} {i['where']}: {i['msg']}")
    print(f"{len(res['samples'])} samples,", 'PASS' if R.ok else 'FAIL')
