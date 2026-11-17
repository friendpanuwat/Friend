"""Turn the two AI answers (captions: Haiku · pictures: Sonnet) into a clip plan for the uni engine, by rule only (no choices).
usage: tools/clip_plan.py <web_dir> <faces.json> [<style> …] [--seed N] [--history customer_history.json]
  (first try at step 4, 2026-11-11: a real clip with the web's two AI steps)
  --seed: the run's random number (default: a new one every run, printed; give it back to make the same plan again)
  --history: the customer's past runs (tools/pick.js stays away from their last 10; this run is added to the file)
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
the AI's accent words gets "acc" (talking-head-motion: the accent colour on 1–2 words per sentence, the rest white).
Random (Friend 2026-11-17: "ต่อให้ user อัพคลิปเดิมลงไปแล้วกดรันอีกรอบนึงผมก็ไม่อยากให้มันออกมาเหมือนกัน"): every run gets a new seed;
tools/pick.js picks each picture's drawing (both glow-line sets in turn, none twice in a clip, none of the customer's last 10
runs, then at random) and the plan keeps the picks (then_<style>.txt names the drawing: <sentence>.<set>.<design>); the style
draws its own random choices (neon: the order of the screens) from RUN.seed in plan_<style>.js.
Drafts: a picture whose category has no draft yet is left out (2026-11-17 Friend deleted the old drafts for the glow-line
sets; until those are in, every category is empty and the clip is subtitles + camera only, then_<style>.txt is empty)."""
import json, math, os, re, subprocess, sys

args = sys.argv[1:]
def flag(name):
    if name not in args: return None
    i = args.index(name); v = args[i + 1]; del args[i:i + 2]; return v
SEED = int(flag('--seed') or int.from_bytes(os.urandom(4), 'big') % 1000000)
HISTORY = flag('--history')
W, FACES = args[0], args[1]
STYLES = args[2:]
UNI = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
PAST = json.load(open(HISTORY)) if HISTORY and os.path.exists(HISTORY) else []
# every: one picture per this many seconds · scene: shortest / longest picture (s) · cover: most of the clip under
# full-screen pictures · run: most full-screen pictures one after another · cut: how the camera gets back to 1.0
RULES = {
    # 2026-11-17 Friend cancelled the 8 old styles (card, glass, split, gold and their overlays; their rules are in git history,
    # git show HEAD~1:cutpack/engine/uni/tools/clip_plan.py) for 12 new ones from sheets Friend made with AI. One by one:
    'neon':          dict(every=4.0, scene=(1.5, 9.9), cover=.8, run=4, cut='soft', over=25),   # over: a small picture on the speaker every ~25 s   # นีออนฟ้า: 10 of the sheet's 12 shots carry a picture (first guess, before a real clip)
}
PUSH = dict(z=1.05, d=1.4, back=1.0, gap=4.0, most=5)
flat = lambda s: re.sub(r'\s+', '', s)
cap = json.load(open(f'{W}/captions.json'))
lines, phrases = cap['captions'], cap['words']
dur = lines[-1]['t1']
report = [r for r in json.load(open(f'{W}/cats/report.json')) if r['ok'] and r['cat'] != 'none']
DRAFTS = json.loads(subprocess.run(['node', os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'drafts.js')],
                                   capture_output=True, text=True, check=True).stdout)   # drafts per category, now
empty = [r for r in report if not DRAFTS.get(r['cat'])]
if empty: print(f"{len(empty)} of {len(report)} pictures left out: no draft yet in {' '.join(sorted({r['cat'] for r in empty}))} (subtitles only there)")
report = [r for r in report if DRAFTS.get(r['cat'])]
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
        big = flat(parts[-1]['w'])                                                  # the accent must be the big word itself
        if any(big and (w in big or (big in w and len(big) >= 3)) for w in accent.get(i, [])): b['acc'] = 1
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
        + sorted({a['line'] for a in camera.get('accent', [])}) \
        + list(range(1, len(lines) + 1))   # then any line the speaker is seen on (neon: 11 pictures covered every line the AI named, so 0 pushes)
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


TEMPLATE = {f'B{i:02d}' for i in range(1, 13)}   # the categories the glow-line template set has (B01T–B12T)
def overlays_for(R, sc):
    """OVERLAYS (Friend 2026-11-17: "ฉากที่เป็นหน้าผมพูดล้วนๆ อยากให้ใส่โอเวอร์เลย์เข้าไปด้วยแต่อย่าใส่เยอะเกินนะใส่แค่นิดเดียวพอ โอเวอร์เลย์
    ให้ใช้ template ชุดฐาน เท่านั้น ห้ามใส่ชุดฐานปกติ"): about one small picture on the speaker every R['over'] seconds, of a
    category the template set has. First a picture of the AI the style left out that falls where the speaker talks; when there is
    none, the full-screen picture of the lowest rank becomes one (so the speaker gets them, the count of pictures stays). Never two
    within 8 s. Returns the overlay pictures; sc loses the ones that moved."""
    if not R.get('over'): return []
    want = max(1, round(dur / R['over'])); out = []
    def free(t0, t1): return not any(t0 < s[2] and t1 > s[1] for s in sc + out)
    def far(t): return all(abs(t - o[1]) >= 8 for o in out)
    shown = {s[0]['id'] for s in sc}
    for r in sorted(report, key=lambda r: (-r.get('rank', 2), r['line'])):
        if len(out) >= want: break
        if r['id'] in shown or r['cat'] not in TEMPLATE: continue
        n = r['line'] - 1; t0, t1 = lines[n]['t0'], lines[n]['t1']
        if t1 - t0 >= 1.5 and free(t0, t1) and far(t0): out.append([r, t0, t1, n])
    for s in sorted(sc, key=lambda s: (-s[0].get('rank', 2), -s[1])):
        if len(out) >= want: break
        if s[0]['cat'] in TEMPLATE and far(s[1]) and len(sc) > 3: sc.remove(s); out.append(s)
    return sorted(out, key=lambda o: o[1])


RUN_PICKS = []
def picks_for(sc, ov=()):
    """the drawing of each picture (tools/pick.js): random, kept in the plan; an overlay from the template set only"""
    ovid = {o[0]['id'] for o in ov}
    req = {'seed': SEED, 'history': PAST, 'scenes': [dict({'id': r['id'], 'cat': r['cat']}, **({'only': 'T'} if r['id'] in ovid else {})) for r, *_ in sorted(list(sc) + list(ov), key=lambda x: x[1])]}
    out = subprocess.run(['node', os.path.join(UNI, 'tools', 'pick.js'), '/dev/stdin'], input=json.dumps(req), capture_output=True, text=True, check=True)
    return json.loads(out.stdout)['picks']


def write(style, R, sc, zooms, suffix, ov=()):
    then, picks = [], picks_for(sc, ov)
    ovid = {o[0]['id'] for o in ov}
    for k, (r, t0, t1, n) in enumerate(sorted(list(sc) + list(ov), key=lambda x: x[1])):
        hit = hit_of([r, t0, t1, n])
        if hit is None or not (t0 + .3 < hit < t1 - .3): hit = (t0 + t1) / 2
        then.append(f"{r['id']}.{picks[r['id']]},{t0:.2f},{t1:.2f},{k},{hit:.2f}")
        RUN_PICKS.append(picks[r['id']])
    f = json.load(open(FACES))
    run = {'seed': SEED, 'overlays': [f"{r['id']}.{picks[r['id']]}" for r, *_ in ov]}
    js = f"const RUN = {json.dumps(run)};\nconst FACES = {json.dumps({'track': f['track'], 'layout': f['layout'], 'keepOut': f['keepOut']})};\nconst CAPTIONS = {json.dumps(CAP, ensure_ascii=False)};\n"
    if zooms: js += f"const ZOOMS = {json.dumps(zooms)};\n"
    js += re.sub(r'"say": \[[^\]]*\]', '"say": ["", ""]', open(f'{W}/cats/sentences.js').read())
    open(f'{W}/plan{suffix}.js', 'w').write(js)
    open(f'{W}/then{suffix}.txt', 'w').write('\n'.join(then) + '\n')
    cover = sum(t1 - t0 for _, t0, t1, _ in sc)
    if ov: print(f"{style}: {len(ov)} overlays on the speaker at {[round(o[1], 1) for o in ov]}")
    print(f'{style}: {len(CAP)} subtitle blocks ({sum("acc" in c for c in CAP)} accent) · {len(then)} pictures, {cover / dur:.0%} of the clip · '
          f'{sum(z["z"] > 1 for z in zooms)} zoom pushes at {[z["t"] for z in zooms if z["z"] > 1]}')


if not STYLES:                                   # the old rule (2026-11-11), for comparing
    R = dict(every=5.0, scene=(2.4, 99), cover=1.0, run=99, zoom=False)
    write('old', R, scenes_for(R), [], '')
for st in STYLES:
    R = RULES[st]; sc = scenes_for(R); ov = overlays_for(R, sc)
    write(st, R, sc, zooms_for(R, sc + ov, R.get('cut', 'soft')), f'_{st}', ov)
print(f'seed {SEED} (same plan again: --seed {SEED})')
if HISTORY:                                       # this run joins the customer's history (a run of the same clip again counts too)
    PAST.append({'clip': os.path.basename(os.path.abspath(W)), 'seed': SEED, 'picks': sorted(set(RUN_PICKS))})
    json.dump(PAST, open(HISTORY, 'w'), ensure_ascii=False, indent=0)
