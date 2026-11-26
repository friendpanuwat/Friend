"""Turn the two AI answers (captions: Haiku · pictures: Sonnet) into a clip plan for the uni engine, by rule only (no choices).
usage: tools/clip_plan.py <web_dir> <faces.json> [<style> …] [--seed N] [--history customer_history.json] [--old-sets]
  (first try at step 4, 2026-11-11: a real clip with the web's two AI steps)
  --seed: the run's random number (default: a new one every run, printed; give it back to make the same plan again)
  --history: the customer's past runs (tools/pick.js stays away from their last 10; this run is added to the file)
  --old-sets: sets 1–2 even for a style of SEVEN_STYLES (they take set 3 by default; see SEVEN below) · --seven: accepted, the default now
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
# --seven: the 7-size set (ชุด 3 "Template ชุดฐาน 7 ขนาด", Friend 2026-11-26: "ตัดต่อโดยใช้ template ชุดฐาน 7 ขนาด โดยทำทั้ง 2 สไตล์คือสไตล์
# เขียวมะนาวและสไตล์หน้าต่างแอป"): every picture is a design of that set (tools/pick.js pickSeven, "<sentence>.<cat>S.<i>"), drawn at the
# standard size of the card it lands in (glow/bridge.js glowDraw7). Only for the styles whose cards are the 7 standard sizes. No fit pick
# (it measures the old sets' drawings: every design of the new set is drawn to fill its own size); a style's hook check still runs.
# DEFAULT since 2026-11-26 (Friend: "ผมตั้งใจจะใช้ template ชุดฐาน 7 ขนาดเป็นหลักอยู่แล้วครับ" → "เปลี่ยนเลยครับ"): every style of SEVEN_STYLES takes
# set 3 with no flag; the other styles (no 7 standard sizes yet) keep sets 1–2. SEVEN is set per style in the loop at the bottom.
OLD_SETS = '--old-sets' in args
for a in ('--old-sets', '--seven'):
    if a in args: args.remove(a)
SEVEN = False
SEVEN_STYLES = {'lime', 'window', 'neon'}   # neon 2026-11-26 (its 7 sizes: styles/neon.js NEON_SIZE · Friend: "ส่งรูปตอนที่ใส่ motion graphics template ชุดฐาน 7 ขนาดมาให้ดูด้วยครับ")
W, FACES = args[0], args[1]
STYLES = args[2:]
UNI = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
PAST = json.load(open(HISTORY)) if HISTORY and os.path.exists(HISTORY) else []
# every: one picture per this many seconds · scene: shortest / longest picture (s) · cover: most of the clip under
# full-screen pictures · run: most full-screen pictures one after another · cut: how the camera gets back to 1.0 · hook: the first
# picture's window in s (with_hook) · fitPick: the drawing that fills the free space (tools/fit_pick.js) · openFace: the style can open on a
# picture screen with the face · over: one small picture on the speaker every this many s (none now: Friend 2026-11-17 "ยกเลิก 5.")
RULES = {
    # 2026-11-17 Friend cancelled the 8 old styles (card, glass, split, gold and their overlays; their rules are in git history,
    # git show HEAD~1:cutpack/engine/uni/tools/clip_plan.py) for 12 new ones from sheets Friend made with AI. One by one:
    'neon':          dict(every=4.0, scene=(1.5, 9.9), cover=.8, run=4, cut='soft', openFace=True, fitPick=True, hook=(1.8, 3.2)),   # hook 2026-11-26 (Friend: "ให้ใส่ระบบฮุก ... เหมือนกับ 2 สไตล์ที่ทำไปแล้ว")   # fitPick: the drawing that fills the free space (tools/fit_pick.js, final 2026-11-18: "ทดลองเฉพาะสไตล์นี้ก่อน")   # openFace: the style can open on a picture screen with the face (final 2026-11-18)
    'lime':          dict(every=4.0, scene=(1.5, 9.9), cover=.75, run=4, cut='soft', fitPick=True, hook=(1.8, 3.2)),   # hook: the first picture at 2–3 s (2026-11-19)
    'violet':        dict(every=4.0, scene=(1.5, 9.9), cover=.75, run=4, cut='soft', fitPick=True),   # ม่วงคลื่นเสียง: 12 of 12 shots carry a picture (first guess)
    'teal':          dict(every=4.0, scene=(1.5, 9.9), cover=.75, run=4, cut='soft', fitPick=True),   # การ์ดเขียวน้ำทะเล: 12 of 12 shots carry a picture or a card (first guess)
    'yellow':        dict(every=4.0, scene=(3.5, 9.9), cover=.85, run=4, cut='soft', fitPick=True),   # ขั้นตอนเหลือง: 12 of 12 shots carry a picture or step chips; pictures of 3.5 s or more so a screen holds its chips (trial after Friend: "ดูโล่งๆมากกว่าต้นแบบเยอะ", the first clip's 1.5–3 s screens held 1–2 chips and 45 % of it was the speaker alone)
    'pink':          dict(every=4.0, scene=(3.5, 9.9), cover=.85, run=4, cut='soft', fitPick=True),   # การ์ดชมพู: as the styles 6–9 that passed (LESSONS 66)
    'cream':         dict(every=4.0, scene=(3.5, 9.9), cover=.85, run=4, cut='soft'),   # ครีมน้ำเงิน: as the styles 6–10 that passed (LESSONS 66)   # (merged from PR #35: no fitPick yet — cream.js has no fitSize; the all-style rules of chat ccr-103ebebc-89alfv still to add)
    'terminal':      dict(every=4.0, scene=(3.5, 9.9), cover=.85, run=4, cut='soft', fitPick=True),   # เทอร์มินัลแดง: as the styles 6–8 that passed (LESSONS 66)
    'horizon':       dict(every=4.0, scene=(3.5, 9.9), cover=.85, run=4, cut='soft', fitPick=True),   # ขอบฟ้าส้ม: as the yellow and HUD styles that passed (LESSONS 66)
    'hud':           dict(every=4.0, scene=(1.5, 9.9), cover=.85, run=4, cut='soft', fitPick=True),   # เส้นชี้ HUD: as the yellow style that passed · final 2026-11-18: scenes from 1.5 s (was 3.5 so the notes filled, LESSONS 66; no notes now) (Friend: "อยากให้มีฉากโอเวอร์เลย์เยอะกว่านี้หน่อยแต่ไม่ต้องเยอะมากจนดูจุกจิก")
    'window':        dict(every=4.0, scene=(1.5, 9.9), cover=.75, run=4, cut='soft', fitPick=True, hook=(1.8, 3.2)),   # หน้าต่างแอป · hook (Friend 2026-11-19: "ใส่ระบบ hook ให้สไตล์นี้")
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


# SENTENCES (Friend 2026-11-18, for every style: "เวลา user พูดประเด็นอะไรอยู่ อย่าเปลี่ยนฉากกลางคัน ให้เขาพูดเรื่องนั้นให้จบก่อน จากดราฟแรก
# บ่อยครั้งมากที่ผมจะพูดประโยคนั้นๆไม่จบแล้ว แต่ฉากเปลี่ยนไปแล้ว"): a scene starts and ends only where a sentence or a point ends. The caption
# lines (Haiku, step 4) split a long sentence over several lines, and Typhoon's word times run on with no gap (the test clip: 0 of 193
# gaps over 0.05 s), so the AI that plans the pictures (cat_ai.py, step 6) names the lines that end a point (camera.json "ends").
# No answer: the speaker's pauses in the voice (a dip of 0.12 s or more, 16 dB under the median, within 0.2 s of a line's end).
def pause_ends():
    wav = os.path.join(W, 'base', 'voice.wav')
    if not os.path.exists(wav): return list(range(len(lines)))
    import numpy as np
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', wav, '-ac', '1', '-ar', '16000', '-f', 's16le', '-'], capture_output=True).stdout
    x = np.frombuffer(raw, np.int16).astype(float) / 32768; n = len(x) // 160
    db = 20 * np.log10(np.sqrt((x[:n * 160].reshape(n, 160) ** 2).mean(1)) + 1e-9); low = db < np.median(db) - 16
    dips, i = [], 0
    while i < n:
        j = i
        while j < n and low[j]: j += 1
        if j - i >= 12: dips.append((i * .01 + j * .01) / 2)
        i = max(j, i + 1)
    return [k for k in range(len(lines) - 1) if any(abs(d - lines[k]['t1']) < .2 for d in dips)]
ends = sorted({n - 1 for n in camera.get('ends', [])} if camera.get('ends') else set(pause_ends()))
ends = [e for e in ends if 0 <= e < len(lines) - 1] + [len(lines) - 1]
SENT = []                                          # [first line, last line] of each sentence
for e in ends: SENT.append([SENT[-1][1] + 1 if SENT else 0, e])
sent_of = {n: k for k, (a, b) in enumerate(SENT) for n in range(a, b + 1)}
print(f"points: {len(SENT)} ({'the AI' if camera.get('ends') else 'pauses'}) · ends at lines {[e + 1 for e in ends]}")


# OPENING (Friend 2026-11-18, every style: "คลิปต้องเปิดด้วยฉากที่มีหน้า user เสมอ" · "เปิดคลิปด้วยหน้าในกรอบเล็กนับด้วยครับ แต่ต้องไม่ตายตัว
# เช่นต้องไม่เปิดที่หน้าจอเล็กเสมอไปหรือต้องไม่เปิดที่หน้าจอใหญ่เสมอไปใช้สุ่มเหมือนเดิม"): from the run's seed, half the runs open with the
# speaker talking (no picture over the first point: 'speaker'), half with a picture from the first frame on a screen that shows the face,
# full or framed ('face': RUN.open, the style keeps the first screen to those). A style that cannot do 'face' yet (no openFace) always
# opens with the speaker.
def opening(st, R):
    import random
    return 'face' if R.get('openFace') and random.Random(f'{SEED}:open:{st}').random() < .5 else 'speaker'


HOOK_AT = None                                   # the hook's start (s) while a style with `hook` plans (with_hook)
def with_hook(R):
    """THE HOOK (Friend 2026-11-19, lime first: "ภาพขึ้นใน 3 วินาทีแรก (hook)" · "ต้องไม่ใช่ฉากเต็มจอ ต้องเป็นฉากหน้าคนพูด" · "เปิดคลิปมา
    วินาทีแรกต้องเป็นหน้าคนพูดล้วนๆเลยกับ subtitle motion graphic ค่อยไปขึ้นจะเป็นวิ[นาที] 2 หรือ 3 ก็ได้" · "ลองใช้กับสไตล์นี้สไตล์เดียวก่อน"):
    the speaker alone up to the first line that starts inside R['hook'] (s); that line starts the first picture, and the rest of its point
    may change scene line by line (the point rule gives way for the opening only); a first line too long for the window starts the
    picture on its subtitle block inside the window. The picture: the AI's own for that line, else the AI's
    first one later in the same point, moved onto the line (Claude's proposal, Friend: "เริ่มได้ครับ"). The style keeps that first screen to
    the speaker's screens (RUN.hook). No line in the window or no picture in the point: the old opening. Returns the globals to put back."""
    global SENT, sent_of, ends, report, HOOK_AT
    a, b = R['hook']
    starts = [(c['t0'], c['line'], abs(c['t0'] - lines[c['line']]['t0']) < .01) for c in CAP if a - 1e-6 <= c['t0'] <= b + 1e-6]
    pick = next((x for x in starts if x[2]), starts[0] if starts else None)   # a line's start first, else a subtitle block's (a long first line)
    if pick is None: return None
    T, k, _ = pick
    j = sent_of[k]; aj, bj = SENT[j]
    mine = sorted((r for r in report if k <= r['line'] - 1 <= bj), key=lambda r: r['line'])
    if not mine: return None
    saved = (SENT, sent_of, ends, report)
    SENT = SENT[:j] + ([[aj, k - 1]] if k > aj else []) + [[n, n] for n in range(k, bj + 1)] + SENT[j + 1:]
    ends = sorted(set(ends) | set(range(k - 1, bj)))
    sent_of = {n: q for q, (x, y) in enumerate(SENT) for n in range(x, y + 1)}
    first = next((r for r in mine if r['line'] - 1 == k), mine[0])
    report = [r for r in report if r is not first] + [dict(first, line=k + 1, rank=0, hook_t0=T)]
    HOOK_AT = T
    print(f"hook: the speaker alone to {HOOK_AT:.2f} s, the first picture on line {k + 1}" + ('' if _ else ' (from a subtitle block inside the line)')+ ('' if first['line'] - 1 == k else f" (the AI's picture of line {first['line']}, moved)"))
    return saved


def scenes_for(R, open_='speaker'):
    """the style's pictures: best rank first until the style's count, as long as they fit its rules"""
    want = max(3, round(dur / R['every']))
    first_end = HOOK_AT if HOOK_AT is not None else lines[SENT[0][1]]['t1']
    pool = sorted(report, key=lambda r: (r.get('rank', 2), r['line']))
    lo, hi = R['scene']
    chosen = []
    def window(r):                                 # from its sentence's start to the end of a sentence, at least `lo` long
        n = r['line'] - 1; k = sent_of[n]; t0 = r.get('hook_t0', lines[SENT[k][0]]['t0'])
        while lines[SENT[k][1]]['t1'] - t0 < lo and k + 1 < len(SENT): k += 1
        return [r, t0, lines[SENT[k][1]]['t1'], n]
    for r in pool:
        if len(chosen) >= want: break
        s = window(r)
        if open_ == 'speaker' and s[1] < first_end - .01: continue                    # the first point: the speaker
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
        if b[1] < a[2]: a[2] = b[1]                                                  # never into the next picture (b starts on a sentence)
    for s in sc:
        if s[2] - s[1] > hi:                                                         # too long for this style: end on the last sentence end
            # in reach that keeps the key word inside, else on a line's end (a sentence longer than the longest scene), never mid-line
            h = hit_of(s) or s[1]
            cut = [lines[e]['t1'] for e in ends if s[1] < lines[e]['t1'] <= s[1] + hi and lines[e]['t1'] > h + .8] \
                or [l['t1'] for l in lines if s[1] < l['t1'] <= s[1] + hi and l['t1'] > h + .8] \
                or [l['t1'] for l in lines if s[1] < l['t1'] <= s[2]]
            s[2] = max(cut) if cut[-1] <= s[1] + hi else min(cut)
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
    if SEVEN: req['seven'] = True
    out = subprocess.run(['node', os.path.join(UNI, 'tools', 'pick.js'), '/dev/stdin'], input=json.dumps(req), capture_output=True, text=True, check=True)
    return json.loads(out.stdout)['picks']


HOOK_FAIL = False                                # fit_pick.js: the style has no speaker screen for the hook's picture (top of write)
def fit_picks(style, sc, open_, hook=False):
    """FIT PICK (a style with fitPick, Friend 2026-11-18: "motion graphic ที่ระบบจะสุ่มเลือกมาต้องเหมาะสมกับพื้นที่ว่างที่มีอยู่"): every drawing
    the rules allow is drawn from the library with this clip's words and measured; one of those that fill the screen best, at random
    (tools/fit_pick.js). Falls back to picks_for when it fails."""
    order = sorted(sc, key=lambda x: x[1])
    if SEVEN: order = order[:1]                  # --seven: only the hook check of the first picture (write); its picks come from picks_for
    pools = json.loads(subprocess.run(['node', os.path.join(UNI, 'tools', 'pick.js'), '/dev/stdin'], capture_output=True, text=True, check=True,
                                      input=json.dumps({'seed': SEED, 'history': PAST, 'pools': True, 'scenes': [{'id': r['id'], 'cat': r['cat']} for r, *_ in order]})).stdout)['pools']
    D = os.path.join(W, f'fit_{style}'); os.makedirs(D, exist_ok=True)
    f = json.load(open(FACES))
    open(os.path.join(D, 'plan.js'), 'w').write(f"const RUN = {json.dumps({'seed': SEED, 'open': open_ if order and order[0][1] < .3 else 'speaker'})};\nconst FACES = {json.dumps({'track': f['track'], 'layout': f['layout'], 'keepOut': f['keepOut']})};\n"
                                                + re.sub(r'"say": \[[^\]]*\]', '"say": ["", ""]', open(f'{W}/cats/sentences.js').read()))
    scenes = []
    for r, t0, t1, n in order:
        hit = hit_of([r, t0, t1, n])
        if hit is None or not (t0 + .3 < hit < t1 - .3): hit = (t0 + t1) / 2
        scenes.append({'id': r['id'], 't0': round(t0, 2), 't1': round(t1, 2), 'hit': round(hit, 2), 'pool': pools.get(r['id'], [])[:1] if SEVEN else pools.get(r['id'], [])})
    json.dump({'seed': SEED, 'scenes': scenes, **({'hook': True} if hook else {})}, open(os.path.join(D, 'job.json'), 'w'))
    try:
        res = subprocess.run(['node', os.path.join(UNI, 'tools', 'fit_pick.js'), D, style], capture_output=True, text=True, check=True, timeout=1200,
                             env={**os.environ, 'NODE_PATH': subprocess.run(['npm', 'root', '-g'], capture_output=True, text=True).stdout.strip()})
        for w in (res.stderr or '').splitlines():
            if 'not measured' in w: print(f'{style}: {w.strip()}')   # never silent (2026-11-20): a scene fit_pick could not measure takes its drawing from pick.js
        out = json.loads(res.stdout.strip().splitlines()[-1])
        if hook and out.get('hookFail'):
            global HOOK_FAIL; HOOK_FAIL = True; return {}
        if SEVEN: return picks_for(sc)            # (the hook passed)
        print(f"{style}: fit pick (best % of the screen, picked %, kept / measured): " + ' · '.join(f"{k} {v[0]}/{v[1]} {v[2]}/{v[3]}" for k, v in out['sizes'].items()))
        if len(out['picks']) == len(order): return out['picks']
        missing = [r['id'] for r, *_ in order if r['id'] not in out['picks']]
        print(f"{style}: fit pick left some out ({', '.join(missing)}: every drawing of the pool was already used in this clip, or the page could not be measured), the rest by pick.js")
        return {**picks_for(sc), **out['picks']}
    except Exception as e:
        err = (getattr(e, 'stderr', '') or str(e)).strip().splitlines()
        print(f'{style}: fit pick failed ({type(e).__name__}: {" | ".join(err[-3:])[:400]}), pick.js instead'); return picks_for(sc)


def write(style, R, sc, zooms, suffix, ov=(), open_='speaker', hook=False):
    """hook: the first picture is the hook (with_hook). Returns False, writing nothing, when the style says the hook's picture has no
    speaker screen (HOOK_FAIL, fit_pick.js · 2026-11-20 Friend: "1. ก"): the caller plans the clip again without the hook."""
    global HOOK_FAIL
    is_hook = bool(hook and sc and HOOK_AT is not None and abs(min(x[1] for x in sc) - HOOK_AT) < .01)
    HOOK_FAIL = False
    fit = R.get('fitPick') and not ov and (not SEVEN or is_hook)   # --seven: fit_pick.js only for the hook check
    then, picks = [], (fit_picks(style, sc, open_, is_hook) if fit else picks_for(sc, ov))
    if HOOK_FAIL: return False
    ovid = {o[0]['id'] for o in ov}
    for k, (r, t0, t1, n) in enumerate(sorted(list(sc) + list(ov), key=lambda x: x[1])):
        hit = hit_of([r, t0, t1, n])
        if hit is None or not (t0 + .3 < hit < t1 - .3): hit = (t0 + t1) / 2
        then.append(f"{r['id']}.{picks[r['id']]},{t0:.2f},{t1:.2f},{k},{hit:.2f}")
        RUN_PICKS.append(picks[r['id']])
    f = json.load(open(FACES))
    run = {'seed': SEED, 'overlays': [f"{r['id']}.{picks[r['id']]}" for r, *_ in ov], 'open': open_ if sc and sc[0][1] < .3 else 'speaker'}
    # every picture's window, so a style can see the pictures that come next (lime's close-up clips, lime.md 7.2 · 2026-11-20)
    run['scenes'] = [[round(t0, 2), round(t1, 2)] for _, t0, t1, _ in sorted(list(sc) + list(ov), key=lambda x: x[1])]
    if is_hook: run['hook'] = True                 # the first picture is the hook: a speaker's screen
    js = f"const RUN = {json.dumps(run)};\nconst FACES = {json.dumps({'track': f['track'], 'layout': f['layout'], 'keepOut': f['keepOut']})};\nconst CAPTIONS = {json.dumps(CAP, ensure_ascii=False)};\n"
    if zooms: js += f"const ZOOMS = {json.dumps(zooms)};\n"
    js += re.sub(r'"say": \[[^\]]*\]', '"say": ["", ""]', open(f'{W}/cats/sentences.js').read())
    open(f'{W}/plan{suffix}.js', 'w').write(js)
    open(f'{W}/then{suffix}.txt', 'w').write('\n'.join(then) + '\n')
    cover = sum(t1 - t0 for _, t0, t1, _ in sc)
    if ov: print(f"{style}: {len(ov)} overlays on the speaker at {[round(o[1], 1) for o in ov]}")
    print(f"{style}: opens with {run['open']}")
    print(f'{style}: {len(CAP)} subtitle blocks ({sum("acc" in c for c in CAP)} accent) · {len(then)} pictures, {cover / dur:.0%} of the clip · '
          f'{sum(z["z"] > 1 for z in zooms)} zoom pushes at {[z["t"] for z in zooms if z["z"] > 1]}')
    return True


if not STYLES:                                   # the old rule (2026-11-11), for comparing
    R = dict(every=5.0, scene=(2.4, 99), cover=1.0, run=99, zoom=False)
    write('old', R, scenes_for(R), [], '')
for st in STYLES:
    SEVEN = st in SEVEN_STYLES and not OLD_SETS   # set 3 for this style (picks_for, fit_picks and write read it)
    print(f"{st}: pictures from {'set 3 (Template ชุดฐาน 7 ขนาด)' if SEVEN else 'sets 1–2'}")
    R = RULES[st]; op = opening(st, R)
    saved = with_hook(R) if R.get('hook') and op == 'speaker' else None
    sc = scenes_for(R, op); ov = overlays_for(R, sc)
    done = write(st, R, sc, zooms_for(R, sc + ov, R.get('cut', 'soft')), f'_{st}', ov, op, hook=saved is not None)
    if saved: SENT, sent_of, ends, report = saved; HOOK_AT = None
    if not done:                                  # no speaker screen for the hook's picture (Friend 2026-11-20: "1. ก"): the old opening
        print(f"{st}: hook: no speaker screen has room for the first picture, planned again without the hook")
        sc = scenes_for(R, op); ov = overlays_for(R, sc)
        write(st, R, sc, zooms_for(R, sc + ov, R.get('cut', 'soft')), f'_{st}', ov, op)
print(f'seed {SEED} (same plan again: --seed {SEED})')
if HISTORY:                                       # this run joins the customer's history (a run of the same clip again counts too)
    PAST.append({'clip': os.path.basename(os.path.abspath(W)), 'seed': SEED, 'picks': sorted(set(RUN_PICKS))})
    json.dump(PAST, open(HISTORY, 'w'), ensure_ascii=False, indent=0)
