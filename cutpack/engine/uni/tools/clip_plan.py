"""Turn the two AI answers (captions: Haiku · pictures: Sonnet) into a clip plan for the uni engine, by rule only (no choices).
usage: tools/clip_plan.py <web_dir> <faces.json> [<style> …]   (first try at step 4, 2026-11-11: a real clip with the web's two AI steps)
  in  <web_dir>/captions.json (captions.py), <web_dir>/cats/report.json + sentences.js + camera.json (cat_ai.py check), lines.json
  out per style: <web_dir>/plan_<style>.js (FACES, CAPTIONS, ZOOMS, SENTENCE with no words: every word is in CAPTIONS)
      and then_<style>.txt (scenes for build.py); with no style: plan.js + then.txt by the old rule (one picture every 4–6 s)

Each style follows Friend's own skill (Friend 2026-11-12: "แก้ไขสกิลทุก skill ในระบบให้เป็นแบบนั้นทั้งการซูมทั้งความเยอะของฉาก
ทั้งการจัด subtitles", DECISIONS 7): the AI plans once for every style (a picture about every 3 s, each with a rank), and each
style keeps as many as its skill shows, best rank first (RULES below). A style that is not from a skill (split) takes the
middle of the skills; gold keeps its old count (Friend: "ยกเว้น gold").
Pictures: a picture covers its caption line; if the line is shorter than the style's shortest scene it runs on to the end of
the next line(s); a picture never runs into the next one; the key word lands when its words are said (else the middle).
Camera (every style but gold, Friend 2026-11-12 "ซูมช้า 4–5 ครั้ง"): the talking-head-motion way, a slow push to 1.05 over
1.4 s on 4–5 of the AI's strongest lines where the speaker is on screen, at least 4 s apart, back to 1.0 over 1 s when the
line ends (a full-screen cut hides the way back: card and glass reset on the cut; split shrinks the speaker, so it eases
back before).
Subtitles: every chunk of every line, the last phrase of a chunk is the big word (captions.py); a chunk that holds one of
the AI's accent words gets "acc" (talking-head-motion: the accent colour on 1–2 words per sentence, the rest white)."""
import json, math, re, sys

W, FACES = sys.argv[1], sys.argv[2]
STYLES = sys.argv[3:]
# every: one picture per this many seconds · scene: shortest / longest picture (s) · cover: most of the clip under
# full-screen pictures · run: most full-screen pictures one after another · cut: how the camera gets back to 1.0
RULES = {
    'card':          dict(every=3.0, scene=(1.5, 3.0), cover=.55, run=3, cut='hard'),   # editorial: a card every 2–4 s, 40–55 %, ≤ 3 in a row (0.6–3 s; ≥ 1.5 s so a scene can play)
    'glass':         dict(every=6.0, scene=(1.5, 9.9), cover=1.0, run=9, cut='hard'),   # talking-head-motion: 6–10 scenes per ~50 s, each ≥ 1.5 s
    'split':         dict(every=4.5, scene=(1.5, 9.9), cover=.55, run=3, cut='soft'),   # no skill: between the two full-screen skills
    'card-overlay':  dict(every=3.0, scene=(1.2, 9.9), overlay=True),                  # editorial-overlay: a widget about every 3 s
    'glass-overlay': dict(every=3.5, scene=(1.2, 9.9), overlay=True),                  # talking-head-overlay: every 3–4 s
    'split-overlay': dict(every=3.5, scene=(1.2, 9.9), overlay=True),                  # both overlay skills
    'gold':          dict(every=5.0, scene=(2.4, 9.9), cover=1.0, run=9, zoom=False),  # unchanged (Friend: "ยกเว้น gold")
    'gold-overlay':  dict(every=5.0, scene=(2.4, 9.9), overlay=True, zoom=False),
}
PUSH = dict(z=1.05, d=1.4, back=1.0, gap=4.0, most=5)
flat = lambda s: re.sub(r'\s+', '', s)
cap = json.load(open(f'{W}/captions.json'))
lines, phrases = cap['captions'], cap['words']
dur = lines[-1]['t1']
report = [r for r in json.load(open(f'{W}/cats/report.json')) if r['ok'] and r['cat'] != 'none']
try: camera = json.load(open(f'{W}/cats/camera.json'))
except FileNotFoundError: camera = {'zoom': [], 'accent': []}

# phrases of each caption line (in order, by time)
pi, line_ph = 0, []
for i, l in enumerate(lines):
    n = len(flat(l['text'].replace('/', '')))
    got, acc = [], ''
    while pi < len(phrases) and len(flat(acc)) < n:
        got.append(phrases[pi]); acc += phrases[pi]['w']; pi += 1
    line_ph.append(got)
# subtitles: one block per chunk
CAP = []
accent = {}
for a in camera.get('accent', []): accent.setdefault(a['line'] - 1, []).append(flat(a['word']))
for i, l in enumerate(lines):
    ph = list(line_ph[i]); chunks = [c.strip().split(' ') for c in l['text'].split('/')]
    k = 0
    for ch in chunks:
        parts = ph[k:k + len(ch)]; k += len(ch)
        if not parts: continue
        b = {'t0': parts[0]['t0'], 'parts': [[p['w'], p['t0'], 'l'] for p in parts], 'line': i}
        txt = flat(''.join(p['w'] for p in parts))
        if any(w in txt or (txt and txt in w and len(txt) >= 3) for w in accent.get(i, [])): b['acc'] = 1
        CAP.append(b)
    if k != len(ph): print('warning: line', i + 1, 'phrases', len(ph), 'chunk words', k)
for j, c in enumerate(CAP):
    c['parts'][-1][2] = 'k'
    c['t1'] = CAP[j + 1]['t0'] if j + 1 < len(CAP) else lines[-1]['t1']


def scenes_for(R):
    """the style's pictures: best rank first until the style's count, as long as they fit its rules"""
    want = max(3, round(dur / R['every']))
    pool = sorted(report, key=lambda r: (r.get('rank', 2), r['line']))
    lo, hi = R['scene']
    chosen = []
    def window(r):
        n = r['line'] - 1; t0, e = lines[n]['t0'], n
        while lines[e]['t1'] - t0 < lo and e + 1 < len(lines): e += 1
        return [r, t0, lines[e]['t1'], n]
    for r in pool:
        if len(chosen) >= want: break
        s = window(r)
        trial = sorted(chosen + [s], key=lambda x: x[1])
        trial = clip_all([list(x) for x in trial], hi)
        if any(x[2] - x[1] < lo - 1e-6 for x in trial): continue                      # it would squeeze a neighbour too short
        if not R.get('overlay'):
            if sum(x[2] - x[1] for x in trial) > R['cover'] * dur: continue          # too much of the clip under pictures
            run, best = 1, 1
            for a, b in zip(trial, trial[1:]):
                run = run + 1 if b[1] - a[2] < .3 else 1; best = max(best, run)
            if best > R['run']: continue                                             # back to the speaker after a few in a row
        chosen.append(s)
    return clip_all(sorted(chosen, key=lambda x: x[1]), hi)


def clip_all(sc, hi):
    for a, b in zip(sc, sc[1:]):
        if b[1] < a[2]: a[2] = b[1]                                                  # never into the next picture
    for s in sc:
        if s[2] - s[1] > hi:                                                         # too long for this style: keep the key word inside
            h = hit_of(s)
            s[1] = max(s[1], min(h - 1.2, s[2] - hi)) if h else s[1]; s[2] = s[1] + hi
    return sc


def hit_of(s):
    r, t0, t1, n = s[:4]
    key = flat(r['key'])
    for p in line_ph[n] + (line_ph[n + 1] if n + 1 < len(line_ph) else []):
        if flat(p['w']) and (flat(p['w']) in key or key in flat(p['w'])): return p['t0']
    return None


def zooms_for(R, sc, cut):
    """slow pushes on the strongest lines the viewer sees the speaker on"""
    if R.get('zoom') is False: return []
    out, last = [], -9
    full = not R.get('overlay')
    # the AI's strongest lines first; a full-screen style shows pictures on most of them, so then the lines that had a
    # picture this style leaves out (best rank first), then lines with an accent word
    shown = {s[3] + 1 for s in sc}
    cand = list(camera.get('zoom', [])) + [r['line'] for r in sorted(report, key=lambda r: (r.get('rank', 2), r['line'])) if r['line'] not in shown] \
        + sorted({a['line'] for a in camera.get('accent', [])})
    for n in dict.fromkeys(cand):
        if len([z for z in out if z['z'] > 1]) >= min(PUSH['most'], max(2, math.ceil(dur / 10))): break
        l = lines[n - 1]; t = l['t0'] + .1
        if full and any(s[1] - .2 < t < s[2] + .02 or (t < s[1] < t + PUSH['d']) for s in sc): continue   # under a picture, or one comes mid-push
        if any(abs(t - z['t']) < PUSH['gap'] for z in out if z['z'] > 1): continue
        scene_next = [s[1] for s in sc if s[1] > t] if full else []
        nxt = min(scene_next) if scene_next else dur
        back = max(l['t1'], t + PUSH['d'] + .3)
        if scene_next and back + PUSH['back'] > nxt:                                  # a picture comes before the way back ends
            if cut == 'hard': out += [dict(t=t, z=PUSH['z'], d=PUSH['d']), dict(t=nxt, z=1.0, d=.001)]; continue
            nxt -= .6                                                                # split starts shrinking the speaker before the cut
            if t + PUSH['d'] + .5 > nxt: continue                                    # no room to ease back first
            back = max(t + PUSH['d'], nxt - PUSH['back'])
            out += [dict(t=t, z=PUSH['z'], d=PUSH['d']), dict(t=round(back, 2), z=1.0, d=round(nxt - back, 2))]; continue
        out += [dict(t=t, z=PUSH['z'], d=PUSH['d'])]
        if back < dur: out.append(dict(t=round(back, 2), z=1.0, d=round(min(PUSH['back'], dur - back), 2)))   # at the very end it may stay in
    for z in out: z['t'] = round(z['t'], 2)
    return sorted(out, key=lambda z: z['t'])


def write(style, R, sc, zooms, suffix):
    then = []
    for k, (r, t0, t1, n) in enumerate(sc):
        hit = hit_of([r, t0, t1, n])
        if hit is None or not (t0 + .3 < hit < t1 - .3): hit = (t0 + t1) / 2
        then.append(f"{r['id']},{t0:.2f},{t1:.2f},{k},{hit:.2f}")
    f = json.load(open(FACES))
    js = f"const FACES = {json.dumps({'track': f['track'], 'layout': f['layout'], 'keepOut': f['keepOut']})};\nconst CAPTIONS = {json.dumps(CAP, ensure_ascii=False)};\n"
    if zooms: js += f"const ZOOMS = {json.dumps(zooms)};\n"
    js += re.sub(r'"say": \[[^\]]*\]', '"say": ["", ""]', open(f'{W}/cats/sentences.js').read())
    open(f'{W}/plan{suffix}.js', 'w').write(js)
    open(f'{W}/then{suffix}.txt', 'w').write('\n'.join(then) + '\n')
    cover = sum(t1 - t0 for _, t0, t1, _ in sc)
    print(f'{style}: {len(CAP)} subtitle blocks ({sum("acc" in c for c in CAP)} accent) · {len(then)} pictures, {cover / dur:.0%} of the clip · '
          f'{sum(z["z"] > 1 for z in zooms)} zoom pushes at {[z["t"] for z in zooms if z["z"] > 1]}')


if not STYLES:                                   # the old rule (2026-11-11), for comparing
    R = dict(every=5.0, scene=(2.4, 99), cover=1.0, run=99, zoom=False)
    write('old', R, scenes_for(R), [], '')
for st in STYLES:
    R = RULES[st]; sc = scenes_for(R)
    write(st, R, sc, zooms_for(R, sc, R.get('cut', 'soft')), f'_{st}')
