#!/usr/bin/env python3
"""Check a scene plan before it is rendered (DECISIONS.md items 4 and 5). Nothing in the plan is run.

usage: validate.py <plan.json> [--faces faces.json] [--history history.json] [--render] [--out report.json]
  --faces    faces.py output for this clip: widgets must stay off the face (even mid-zoom) and the plan's layout must fit
  --history  this customer's earlier clips ({"clips": [{"parts": ["B02.v1", ...]}, ...]}, newest last): repeat score
  --render   also build the scene in the engine and measure every text box (overflow, overlap, Thai marks, app strip)
exit 0 = no errors (warnings allowed), 1 = errors. The report lists each issue with a code and where it is, so the AI
can be sent back to fix just that spot once; after that, fallback.py swaps what still fails for a B14 text card.

Every number used for a rule is in RULES, with where it comes from.
"""
import json, math, os, re, sys, unicodedata

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import custom_check, room

HERE = os.path.dirname(os.path.abspath(__file__))

RULES = {
    # 4. density — the skill's 42 s sample: 12 cards ≈ 55 % (editorial), 14 widgets (overlay); Friend's 18 s test: 55 %, 6 widgets
    'cardShare': (.40, .56),        # editorial: share of the clip under full-screen cards (DECISIONS 2: 40–55 %, Friend 2026-11-05:
                                    # a clip at 74 % "แทบไม่เห็นคนพูด"; .56 keeps the approved 18 s clip at 55.05 %)
    'cardAim': .45,                 # editorial: mend.py cuts a clip over the top back to about this
    'faceMin': 1.0,                 # editorial: at least this much face between two cards (the approved clip's shortest is 1.0)
    'cardEvery': 4.0,               # editorial: at least one card per this many seconds of clip
    'arollMax': 4.5,                # editorial: longest stretch of talking head between cards ("ตัดสลับการ์ดทุก 2–4 วินาที")
    'firstAt': .8,                  # editorial: the clip opens on the face + hook, the first card comes after this
    'widgetEvery': 3.5,             # overlay: at least one widget per this many seconds
    'widgetGap': .4,                # overlay: one widget at a time, with a breath between them
    'bareMax': 6.0,                 # overlay: longest stretch with no widget
    # timing of one scene
    'hitIn': {'card': .25, 'widget': .4},   # the key-word event comes after the entrance has landed
    'hitOut': .3,                   # and leaves time to read the result before the scene ends
    'tol': .05,
    'customDur': (1.0, 3.5),        # AI-written scenes: the same range as most library parts
    # variety (DECISIONS 4 "กันคลิปออกมาเหมือนกัน")
    'reusePer': 15,                 # a part may appear 1 + scenes // 15 times in one clip
    'historyClips': 10, 'historyWarn': .35, 'historyLastMax': .5,
    # subtitles — Friend 2026-11-04: chunks of about 12 letters, never higher than 1300, end above the app's bottom bar
    'chunkMax': 12, 'chunkHard': 16, 'chunkMin': .35, 'subTop': (1300, 1380), 'subCover': .6,
    # widget text: ≤ 3 words in the skill; the kit shrinks long text instead of breaking a Thai word
    'wkeyMax': 12, 'wleadMax': 16,
    # camera — talking-head-motion way (Friend 2026-11-04): ~1 push per 10 s, ≥ 4 s apart, 1.04–1.06, never above 1.08
    'pushEvery': 8.0, 'pushZ': (1.04, 1.06),
    # app screen (1080×1920): top bar, right-hand button strip, bottom bar
    'topBar': 150, 'rightX': 940, 'rightY': (860, 1620), 'bottomBar': 1620, 'edge': 20,
}
PART_ID = re.compile(r'B\d\d\.v\d|B\d\d\.[a-z]{3}\d|[A-Z]{3}\.h\d|custom')   # base · a topic pack's version · a topic pack's hero part
TIME_SLOTS = {'at', 'aty'}          # seconds, not facts
ICON_SLOTS = {'icon', 'icons', 'ia', 'ib', 'ic', 'ix', 'iy', 'link'}   # icon names ("share-2") are never shown as text
INDEX_SLOTS = {('B14', 'key')}      # an index into words, not a fact
WIDGET_TEXT = {'wlead', 'wkey'}


def graphemes(s):
    """Letters as the engine counts them (Intl.Segmenter): Thai marks above/below and SARA AM join the letter before."""
    return sum(1 for ch in s if unicodedata.category(ch) not in ('Mn', 'Me') and ch not in 'ำ​‍')


# ---------- numbers said in the script ----------
TH_DIGIT = {'ศูนย์': 0, 'หนึ่ง': 1, 'เอ็ด': 1, 'สอง': 2, 'ยี่': 2, 'สาม': 3, 'สี่': 4, 'ห้า': 5, 'หก': 6, 'เจ็ด': 7, 'แปด': 8, 'เก้า': 9}
TH_MULT = {'สิบ': 10, 'ร้อย': 100, 'พัน': 1000, 'หมื่น': 10_000, 'แสน': 100_000, 'ล้าน': 1_000_000}
TH_WORD = re.compile('|'.join(sorted(list(TH_DIGIT) + list(TH_MULT), key=len, reverse=True)))


def numbers(text):
    """Every number in a text: digits (Thai or Arabic, 1,000 / 1.5) and spelled-out Thai numbers (สามสิบห้า = 35)."""
    text = str(text).translate(str.maketrans('๐๑๒๓๔๕๖๗๘๙', '0123456789'))
    found = {float(m.replace(',', '')) for m in re.findall(r'\d[\d,]*(?:\.\d+)?', text)}
    if 'ครึ่ง' in text: found.add(.5)
    for run in re.finditer(f'(?:{TH_WORD.pattern})+', text):
        total, cur = 0, 0
        for w in TH_WORD.findall(run.group()):
            if w in TH_DIGIT: cur = TH_DIGIT[w]
            elif w == 'ล้าน': total = (total + cur) * 1_000_000; cur = 0
            else: total += (cur or 1) * TH_MULT[w]; cur = 0
        found.add(float(total + cur))
    return found


class Report:
    """issues: {level, code, where, msg} plus scene / sub / cam = the index in the plan it belongs to (fallback.py uses it).
    ctx holds the index being checked, so every issue raised inside a loop carries it."""
    def __init__(self): self.issues, self.ctx = [], {}
    def _add(self, level, code, where, msg, **at):
        self.issues.append({'level': level, 'code': code, 'where': where, 'msg': msg, **{k: v for k, v in {**self.ctx, **at}.items() if v is not None}})
    def err(self, code, where, msg, **at): self._add('error', code, where, msg, **at)
    def warn(self, code, where, msg, **at): self._add('warn', code, where, msg, **at)
    @property
    def ok(self): return not any(i['level'] == 'error' for i in self.issues)
    @property
    def blocking(self): return [i for i in self.issues if i['level'] == 'error' and i['code'] not in QUALITY]


# errors about how good the plan is, not whether it renders right: the AI gets one try to fix them, then the clip is made
# anyway (DECISIONS 5: "ผู้ใช้ต้องได้คลิปเสมอ"). Every other error blocks the render until fallback.py has dealt with it.
QUALITY = {'density-low', 'density-high', 'aroll-long', 'bare-long', 'open-on-card', 'repeat-next', 'reuse', 'history-last', 'sub-chunk', 'sub-fast'}


def overlap(a0, a1, b0, b1, tol=0.0): return min(a1, b1) - max(a0, b0) > tol


def boxes_hit(a, b): return a[0] < b[2] and b[0] < a[2] and a[1] < b[3] and b[1] < a[3]


# ---------- the checks ----------
def check_shape(plan, R):
    for k in ('version', 'style', 'clip', 'script', 'scenes'):
        if k not in plan: R.err('shape', k, f'missing field {k}')
    if plan.get('version') != 1: R.err('shape', 'version', 'version must be 1')
    if plan.get('style') not in ('editorial', 'overlay'): R.err('shape', 'style', 'style must be editorial or overlay')
    d = (plan.get('clip') or {}).get('duration')
    if not isinstance(d, (int, float)) or d <= 0: R.err('shape', 'clip.duration', 'clip.duration must be a positive number')
    if not str(plan.get('script', '')).strip(): R.err('shape', 'script', 'script is empty: numbers on screen cannot be checked')
    if not re.fullmatch(r'[a-z]+', str(plan.get('topic', 'none'))): R.err('shape', 'topic', 'topic must be a topic id (biz, fin …) or none')
    for i, s in enumerate(plan.get('scenes', [])):
        w = f'scenes[{i}]'; R.ctx = {'scene': i}
        for k in ('t0', 't1', 'hit'):
            if not isinstance(s.get(k), (int, float)) or isinstance(s.get(k), bool): R.err('shape', w, f'{k} must be a number')
        if s.get('kind') not in ('card', 'widget'): R.err('shape', w, 'kind must be card or widget')
        if not PART_ID.fullmatch(str(s.get('part', ''))): R.err('shape', w, 'part must look like B02.v1, B02.biz1, BIZ.h1 (or custom)')
        if not isinstance(s.get('slots', {}), dict): R.err('shape', w, 'slots must be an object')
    R.ctx = {}
    for i, s in enumerate(plan.get('subtitles', [])):
        R.ctx = {'sub': i}
        if not (isinstance(s.get('t0'), (int, float)) and isinstance(s.get('t1'), (int, float)) and isinstance(s.get('text'), str)):
            R.err('shape', f'subtitles[{i}]', 'needs t0, t1 and text')
    R.ctx = {}
    return R.ok


def check_scenes(plan, cat, R):
    style, dur = plan['style'], plan['clip']['duration']
    want = 'card' if style == 'editorial' else 'widget'
    lib = {p['id']: p for p in cat['cards' if want == 'card' else 'widgets']}
    icons = set(cat['icons'])
    topic = plan.get('topic') or 'none'
    if topic != 'none' and topic not in (cat.get('packs') or {}): R.err('topic', 'topic', f"unknown topic {topic!r}: use {', '.join(sorted(cat.get('packs') or {}))} or none")
    for i, s in enumerate(plan['scenes']):
        w = f"scenes[{i}] {s['part']} {s['t0']}–{s['t1']}"; R.ctx = {'scene': i}
        if s['kind'] != want: R.err('kind', w, f'{style} uses {want}s only'); continue
        if s['part'] == 'custom': check_custom(s, want, dur, cat, R, w); continue
        P = lib.get(s['part'])
        if not P: R.err('unknown-part', w, f"{s['part']} is not in the {want} library (catalog.json)"); continue
        if P.get('pack') and P['pack'] != topic:   # DECISIONS 3: a clip uses its own topic's parts and the base parts only
            R.err('topic-part', w, f"{s['part']} belongs to topic {P['pack']}, but this clip's topic is {topic}")
        t0, t1, hit, ln = s['t0'], s['t1'], s['hit'], s['t1'] - s['t0']
        if t0 < -R_tol() or t1 > dur + R_tol() or t1 <= t0: R.err('time', w, f'times must be inside 0–{dur} and t0 < t1')
        lo, hi = P['dur']
        if ln < lo - R_tol() or ln > hi + R_tol(): R.err('length', w, f'{ln:.2f} s is outside this part\'s {lo}–{hi} s')
        if hit < t0 + RULES['hitIn'][want] - 1e-9: R.err('hit-early', w, f"hit {hit} must be ≥ {RULES['hitIn'][want]} s after the start (the entrance lands first)")
        if hit > t1 - RULES['hitOut'] + 1e-9: R.err('hit-late', w, f"hit {hit} must be ≥ {RULES['hitOut']} s before the end")
        if want == 'card':
            if s.get('bg') not in P['bgs']: R.err('bg', w, f"bg {s.get('bg')!r} not allowed for {s['part']} ({', '.join(P['bgs'])})")
        elif s.get('size') not in cat['widgetSizes']: R.err('size', w, 'size must be short or narrow')
        slots = s.get('slots', {})
        for k, spec in P['slots'].items():
            v = slots.get(k)
            if spec.get('req') and (v is None or v == '' or v == []): R.err('slot-missing', w, f'slot {k} is required'); continue
            if v is None: continue
            t = spec['type']
            if t == 'text' and not isinstance(v, str): R.err('slot-type', w, f'{k} must be text')
            elif t == 'text' and spec.get('max') and graphemes(v) > spec['max']: R.err('slot-long', w, f'{k} "{v}" is {graphemes(v)} letters, max {spec["max"]}')
            elif t == 'number' and (not isinstance(v, (int, float)) or isinstance(v, bool)): R.err('slot-type', w, f'{k} must be a number')
            elif t == 'number' and spec.get('index'):   # a position in another list slot, counted from 0
                ref = slots.get(spec['index'])
                if v != int(v) or v < 0 or (isinstance(ref, list) and v >= len(ref)): R.err('slot-index', w, f"{k} = {v} is not a position in {spec['index']} (0–{len(ref) - 1 if isinstance(ref, list) else '?'})")
            elif t == 'icon' and v not in icons: R.err('icon', w, f'unknown icon {v!r}')
            elif t == 'choice' and v not in spec.get('of', []): R.err('slot-choice', w, f'{k} must be one of {spec.get("of")}')
            elif t == 'list':
                if not isinstance(v, list): R.err('slot-type', w, f'{k} must be a list'); continue
                if len(v) < spec.get('min', 0) or len(v) > spec.get('max', 99): R.err('slot-count', w, f'{k} has {len(v)} items, allowed {spec.get("min", 0)}–{spec.get("max", "any")}')
                if spec.get('same') and isinstance(slots.get(spec['same']), list) and len(v) != len(slots[spec['same']]):
                    R.err('slot-count', w, f"{k} needs one item per {spec['same']} ({len(slots[spec['same']])}), got {len(v)}")
                if spec.get('item'):
                    bad = [x for x in v if not item_ok(x, spec['item'])]
                    if bad: R.err('slot-type', w, f"{k} items must be {item_desc(spec['item'])} (got {json.dumps(bad[0], ensure_ascii=False)})")
                elif k in TIME_SLOTS:
                    if any(not isinstance(x, (int, float)) for x in v) or v != sorted(v) or (v and (v[0] < t0 - R_tol() or v[-1] > t1 - .2)):
                        R.err('slot-time', w, f'{k} must be rising times inside the scene')
                elif k == 'icons':
                    for x in v:
                        if x not in icons: R.err('icon', w, f'unknown icon {x!r} in icons')
                elif k == 'rows':   # B03 v3: [{t: 'ค่าใช้จ่าย', a: true, b: false}, …]
                    for x in v:
                        if not (isinstance(x, dict) and isinstance(x.get('t'), str) and all(isinstance(x.get(z, False), bool) for z in 'ab')):
                            R.err('slot-type', w, 'rows items must be {"t": text, "a": true|false, "b": true|false}')
                        elif V_graph(x['t']) > 12: R.err('slot-long', w, f'rows "{x["t"]}" is {V_graph(x["t"])} letters, max 12')
                elif any(not isinstance(x, str) for x in v): R.err('slot-type', w, f'{k} items must be text')
        if 'aty' in slots and isinstance(slots['aty'], (int, float)) and not (t0 <= slots['aty'] <= t1 - .2): R.err('slot-time', w, 'aty must be inside the scene')
        extra = set(slots) - set(P['slots']) - (WIDGET_TEXT if want == 'widget' else set())
        if extra: R.err('slot-unknown', w, f'{s["part"]} has no slot {", ".join(sorted(extra))}')
        if want == 'widget':
            for k, mx in (('wkey', RULES['wkeyMax']), ('wlead', RULES['wleadMax'])):
                v = slots.get(k)
                if v is not None and not isinstance(v, str): R.err('slot-type', w, f'{k} must be text')
                elif v and graphemes(v) > mx: R.err('slot-long', w, f'{k} "{v}" is {graphemes(v)} letters, max {mx} (widget text ≤ 3 words)')
            if not (slots.get('wkey') or slots.get('key') or P['id'].startswith('B14')): R.warn('widget-text', w, 'no wkey: the widget shows no word')
    R.ctx = {}


def item_ok(x, item):
    """One list item against a slot's `item`: 'number' / 'text', or {field: 'text' | 'number' | 'bool', '?' = may be left out}."""
    ok = {'text': lambda v: isinstance(v, str), 'number': lambda v: isinstance(v, (int, float)) and not isinstance(v, bool),
          'bool': lambda v: isinstance(v, bool)}
    if not isinstance(item, dict): return ok[item](x)
    if not isinstance(x, dict) or set(x) - set(item): return False
    return all((k in x and ok[t.rstrip('?')](x[k])) or (k not in x and t.endswith('?')) for k, t in item.items())


def item_desc(item):
    return item if not isinstance(item, dict) else '{' + ', '.join(f'"{k}": {t}' for k, t in item.items()) + '}'


def check_custom(s, want, dur, cat, R, w):
    """An AI-written scene (Friend 2026-11-04): same timing rules as a part, its code must pass custom_check."""
    t0, t1, hit = s['t0'], s['t1'], s['hit']
    lo, hi = RULES['customDur']
    if t0 < -R_tol() or t1 > dur + R_tol() or t1 <= t0: R.err('time', w, f'times must be inside 0–{dur} and t0 < t1')
    if not (lo - R_tol() <= t1 - t0 <= hi + R_tol()): R.err('length', w, f'{t1 - t0:.2f} s is outside {lo}–{hi} s for an AI-written scene')
    if hit < t0 + RULES['hitIn'][want] - 1e-9: R.err('hit-early', w, f"hit {hit} must be ≥ {RULES['hitIn'][want]} s after the start")
    if hit > t1 - RULES['hitOut'] + 1e-9: R.err('hit-late', w, f"hit {hit} must be ≥ {RULES['hitOut']} s before the end")
    if want == 'card' and s.get('bg') not in ('glow', 'white', 'cream'): R.err('bg', w, 'bg must be glow, white or cream')
    if want == 'widget' and s.get('size') not in cat['widgetSizes']: R.err('size', w, 'size must be short or narrow')
    limits = {'lead': 26, 'key': 14} if want == 'card' else {'wlead': RULES['wleadMax'], 'wkey': RULES['wkeyMax']}
    for k, v in (s.get('slots') or {}).items():
        if k not in limits: R.err('slot-unknown', w, f'an AI-written {want} takes only {", ".join(limits)} (got {k})')
        elif not isinstance(v, str): R.err('slot-type', w, f'{k} must be text')
        elif graphemes(v) > limits[k]: R.err('slot-long', w, f'{k} "{v}" is {graphemes(v)} letters, max {limits[k]}')
    probs = custom_check.check(s.get('code'))
    if probs: R.err('custom-code', w, 'the scene code is refused: ' + '; '.join(probs[:3]))
    if not str(s.get('need', '')).strip(): R.warn('custom-need', w, 'say what the library was missing (need)')


def R_tol(): return RULES['tol']


def V_graph(x): return graphemes(x)


def room_ranges(plan, faces):
    """Overlay with a face track: the times a widget has room (room.py), or None (no track: the whole clip counts)."""
    if plan['style'] != 'overlay' or not (faces or {}).get('track'): return None
    top = (plan.get('layout') or {}).get('subtitleTop', (faces.get('layout') or {}).get('subtitleTop', 1300))
    dur = plan['clip']['duration']
    if room.tight(faces['track'], dur, top, faces['face']): return None   # the speaker shrinks where there is no room
    return room.merged(room.windows(faces['track'], dur, top, faces['face']))


def check_timeline(plan, R, faces=None):
    style, dur = plan['style'], plan['clip']['duration']
    sc = sorted(plan['scenes'], key=lambda s: s['t0'])
    ix = {id(s): i for i, s in enumerate(plan['scenes'])}
    for a, b in zip(sc, sc[1:]):
        if a['t1'] > b['t0'] + R_tol(): R.err('scene-overlap', f"{a['part']} {a['t0']} / {b['part']} {b['t0']}", 'two scenes on screen at once', scene=ix[id(b)])
        elif style == 'overlay' and b['t0'] - a['t1'] < RULES['widgetGap'] - 1e-9:
            R.err('widget-gap', f"{a['part']} {a['t1']} → {b['part']} {b['t0']}", f"widgets need ≥ {RULES['widgetGap']} s between them", scene=ix[id(b)])
    edges = [0.0] + [x for s in sc for x in (s['t0'], s['t1'])] + [dur]
    gaps = [(edges[k], edges[k + 1]) for k in range(0, len(edges), 2)]
    if style == 'editorial':
        share = sum(s['t1'] - s['t0'] for s in sc) / dur
        lo, hi = RULES['cardShare']
        if share < lo: R.err('density-low', 'scenes', f'cards cover {share:.0%} of the clip, need ≥ {lo:.0%}')
        if share > hi: R.err('density-high', 'scenes', f'cards cover {share:.0%} of the clip, keep ≤ {hi:.0%} so the speaker is seen')
        need = math.floor(dur / RULES['cardEvery'])
        if len(sc) < need: R.err('density-low', 'scenes', f'{len(sc)} cards, need ≥ {need} for {dur:.1f} s')
        for a, b in gaps:
            if b - a > RULES['arollMax'] + R_tol(): R.err('aroll-long', f'{a:.2f}–{b:.2f}', f'{b - a:.1f} s of talking head without a card (max {RULES["arollMax"]})')
        if sc and sc[0]['t0'] < RULES['firstAt']: R.err('open-on-card', sc[0]['part'], f'the clip opens on the face: first card at ≥ {RULES["firstAt"]} s', scene=ix[id(sc[0])])
    else:
        # only the time with room for a widget counts (Friend 2026-11-05: widgets go where there is room, or are left out)
        rooms = room_ranges(plan, faces)
        span = sum(b - a for a, b in rooms) if rooms is not None else dur
        need = math.floor(span / RULES['widgetEvery'])
        if len(sc) < need: R.err('density-low', 'scenes', f'{len(sc)} widgets, need ≥ {need} for {span:.1f} s with room')
        for a, b in gaps:
            for x, y in ([(a, b)] if rooms is None else [(max(a, p), min(b, q)) for p, q in rooms if min(b, q) > max(a, p)]):
                if y - x > RULES['bareMax'] + R_tol(): R.err('bare-long', f'{x:.2f}–{y:.2f}', f'{y - x:.1f} s without a widget (max {RULES["bareMax"]})')


def check_variety(plan, R, history=None):
    sc = sorted(plan['scenes'], key=lambda s: s['t0'])
    ids = [s['part'] for s in sc]
    ix = {id(s): i for i, s in enumerate(plan['scenes'])}
    for a, b in zip(sc, sc[1:]):
        if 'custom' in (a['part'], b['part']): continue
        if a['part'] == b['part']: R.err('repeat-next', f"{b['part']} {b['t0']}", 'the same part twice in a row', scene=ix[id(b)])
        elif a['part'][:3] == b['part'][:3]: R.warn('same-category', f"{b['part']} {b['t0']}", 'two scenes of the same category in a row', scene=ix[id(b)])
    cap = 1 + len(sc) // RULES['reusePer']
    for p in sorted(set(ids) - {'custom'}):
        if ids.count(p) > cap: R.err('reuse', p, f'{p} used {ids.count(p)} times, max {cap} in this clip')
    bgs = [s.get('bg') for s in sc if s['kind'] == 'card']
    for k in range(len(bgs) - 2):
        if bgs[k] == bgs[k + 1] == bgs[k + 2]: R.warn('same-bg', f'cards {k}–{k + 2}', f'three {bgs[k]} cards in a row')
    score = None
    ids = [p for p in ids if p != 'custom']   # every AI-written scene is new: history is about library parts
    if history and history.get('clips') and ids:
        past = history['clips'][-RULES['historyClips']:][::-1]   # most recent first
        weight = lambda p: max([1 - k / RULES['historyClips'] for k, c in enumerate(past) if p in c.get('parts', [])] or [0])
        score = round(sum(weight(p) for p in ids) / len(ids), 3)
        last = sum(p in past[0].get('parts', []) for p in ids) / len(ids)
        if last > RULES['historyLastMax']: R.err('history-last', 'scenes', f'{last:.0%} of the parts were in this customer\'s last clip (max {RULES["historyLastMax"]:.0%})')
        elif score > RULES['historyWarn']: R.warn('history', 'scenes', f'repeat score {score} against the last {len(past)} clips (aim ≤ {RULES["historyWarn"]})')
        if past[0].get('parts') and past[0]['parts'][0] == ids[0]: R.warn('history-opener', ids[0], 'opens with the same part as the last clip')
    return score


def check_numbers(plan, R, cat=None):
    said = numbers(plan.get('script', ''))
    pct = bool(re.search(r'%|เปอร์เซ็นต์|เปอร์เซ็น', plan.get('script', '')))
    lib = {p['id']: p for p in (cat or {}).get('cards', []) + (cat or {}).get('widgets', [])}
    for i, s in enumerate(plan['scenes']):
        cat_id = s['part'].split('.')[0]; R.ctx = {'scene': i}
        specs = (lib.get(s['part']) or {}).get('slots', {})
        for k, v in s.get('slots', {}).items():
            if k in TIME_SLOTS or k in ICON_SLOTS or (cat_id, k) in INDEX_SLOTS: continue
            sp = specs.get(k, {})
            if sp.get('index') or sp.get('shown') is False: continue   # a position in a list, or sizes drawn as shapes (no number on screen)
            if isinstance(v, bool): continue
            if isinstance(v, (int, float)):
                if k == 'of' and v == 100 and pct: continue
                if float(v) not in said: R.err('number-not-said', f"scenes[{i}] {s['part']}", f'{k} = {v} is not in the script (no made-up facts)')
                continue
            vals = [y for x in (v if isinstance(v, list) else [v]) for y in (x.values() if isinstance(x, dict) else [x])]
            for x in vals:
                if isinstance(x, (int, float)) and not isinstance(x, bool):   # a number in a list (nums, amounts, rows[].v)
                    if float(x) not in said: R.err('number-not-said', f"scenes[{i}] {s['part']}", f'{k} shows {x:g}, which is not in the script')
                    continue
                if not isinstance(x, str): continue
                digits = {float(m.replace(',', '')) for m in re.findall(r'\d[\d,]*(?:\.\d+)?', x.translate(str.maketrans('๐๑๒๓๔๕๖๗๘๙', '0123456789')))}
                for n in digits - said: R.err('number-not-said', f"scenes[{i}] {s['part']}", f'"{x}" shows {n:g}, which is not in the script')
                for n in numbers(x) - digits - said: R.warn('number-word', f"scenes[{i}] {s['part']}", f'"{x}" reads as {n:g}, which is not in the script')
    for i, s in enumerate(plan.get('subtitles', [])):
        R.ctx = {'sub': i}
        for n in numbers(s['text']) - said: R.warn('number-word', f'subtitles[{i}]', f'subtitle shows {n:g}, not found in the script')
    R.ctx = {}


def check_subtitles(plan, R, layout):
    style, dur = plan['style'], plan['clip']['duration']
    subs = sorted(plan.get('subtitles', []), key=lambda s: s['t0'])
    ix = {id(s): i for i, s in enumerate(plan.get('subtitles', []))}
    for i, s in enumerate(subs):
        w = f"subtitles {s['t0']}–{s['t1']} \"{s['text']}\""; R.ctx = {'sub': ix[id(s)]}
        if s['t0'] < -R_tol() or s['t1'] > dur + R_tol() or s['t1'] <= s['t0']: R.err('time', w, 'subtitle times must be inside the clip and t0 < t1')
        chunks = [c.strip() for c in s['text'].split('/')] if '/' in s['text'] else [s['text'].strip()]
        if any(not c for c in chunks): R.err('sub-chunk', w, 'empty chunk between /')
        for c in chunks:
            n = graphemes(c.replace(' ', ''))
            if n > RULES['chunkHard']: R.err('sub-chunk', w, f'chunk "{c}" is {n} letters (max {RULES["chunkHard"]}, aim {RULES["chunkMax"]}): split it with /')
            elif n > RULES['chunkMax'] and '/' in s['text']: R.warn('sub-chunk', w, f'chunk "{c}" is {n} letters, aim ≤ {RULES["chunkMax"]}')
        if (s['t1'] - s['t0']) / len(chunks) < RULES['chunkMin']: R.err('sub-fast', w, f'{len(chunks)} chunks in {s["t1"] - s["t0"]:.2f} s is too fast to read')
        if s.get('key') and s['key'] not in s['text']: R.err('sub-key', w, f"key {s['key']!r} is not in the text")
        if 'keyAt' in s and not (s['t0'] <= s['keyAt'] <= s['t1']): R.err('sub-key', w, 'keyAt must be inside the subtitle')
        if i and subs[i - 1]['t1'] > s['t0'] + R_tol(): R.err('sub-overlap', w, 'overlaps the subtitle before it')
        if style == 'editorial':
            for c in plan['scenes']:
                if overlap(s['t0'], s['t1'], c['t0'], c['t1'], .1): R.err('sub-under-card', w, f"runs under the card {c['part']} {c['t0']}–{c['t1']}: editorial subtitles sit on the talking head only")
    R.ctx = {}
    if style == 'overlay' and subs:
        cover = sum(s['t1'] - s['t0'] for s in subs) / dur
        if cover < RULES['subCover']: R.warn('sub-cover', 'subtitles', f'subtitles cover {cover:.0%} of the clip: overlay shows every word')
    top = layout.get('subtitleTop', 1300)
    lo, hi = RULES['subTop']
    if not (lo <= top <= hi): R.err('sub-top', 'layout.subtitleTop', f'subtitle top {top} must be {lo}–{hi} (never higher than 1300, ends above the app bar)')


def check_places(plan, cat, R, layout, faces):
    if plan['style'] != 'overlay': return
    sizes, top = cat['widgetSizes'], layout.get('subtitleTop', 1300)
    keep = faces.get('keepOut') if faces else None
    fits = (faces or {}).get('layout', {})
    track = (faces or {}).get('track')
    for i, s in enumerate(plan['scenes']):
        if s.get('size') not in sizes: continue
        w = f"scenes[{i}] {s['part']} {s['t0']}"; R.ctx = {'scene': i}
        if track and s.get('shrink'): continue   # the speaker shrinks below the widget for its time (room.SHRINK)
        if track:   # per moment (room.py): the face during this widget's own time, zoomed as the camera is then
            if not s.get('pos'): R.err('place-nofit', w, f"no room for a widget at {s['t0']}–{s['t1']}: the face fills the frame then"); continue
            keep = room.keep_out(track, s['t0'], s['t1'], plan.get('camera'), faces.get('face') or keep)
        p = s.get('pos') or layout.get('widgetPos', {}).get(s['size']) or cat['widgetAt'][s['size']]
        W, H = sizes[s['size']]['W'], sizes[s['size']]['H']
        b = [p['x'], p['y'], p['x'] + W, p['y'] + H]
        e = RULES['edge']
        if b[0] < e or b[2] > 1080 - e: R.err('place-edge', w, f'widget {b} runs off the side of the frame')
        if b[1] < RULES['topBar']: R.err('place-topbar', w, f'widget top {b[1]} is under the app\'s top bar (< {RULES["topBar"]})')
        if b[3] > RULES['bottomBar']: R.err('place-bottombar', w, f'widget bottom {b[3]} is under the app\'s bottom bar')
        if b[2] > RULES['rightX'] and overlap(b[1], b[3], *RULES['rightY']): R.err('place-right', w, f'widget reaches x {b[2]} in the app\'s button strip (x > {RULES["rightX"]})')
        if b[3] > top - 10: R.err('place-subtitle', w, f'widget bottom {b[3]} runs into the subtitles at {top}')
        if keep and boxes_hit(b, keep): R.err('place-face', w, f'widget {b} covers the face (keep-out {keep}, sized for the biggest zoom)')
        if faces and not track and fits.get(f"{s['size']}Fits") is False: R.err('place-nofit', w, f"this clip has no room for a {s['size']} widget (faces.json)")
    R.ctx = {}
    if faces and fits.get('subOverFace'): R.warn('sub-face', 'layout', 'the chin is low: subtitles may touch the face when zoomed')


def check_camera(plan, cat, R):
    cam, dur, style = plan.get('camera', []), plan['clip']['duration'], plan['style']
    C = cat['camera']
    pushes, last, zoomed = [], None, False
    cards = [s for s in plan['scenes'] if s['kind'] == 'card']
    for i, c in enumerate(cam):
        t = c.get('push', c.get('pull'))
        w = f'camera[{i}] {"push" if "push" in c else "pull"} {t}'; R.ctx = {'cam': i}
        if not isinstance(t, (int, float)) or not (0 <= t <= dur): R.err('cam-time', w, 'needs a time inside the clip'); continue
        if last is not None and t < last: R.err('cam-order', w, 'camera moves must be in time order')
        last = t
        if 'push' in c:
            z = c.get('z', C['z'])
            if not (1 < z <= C['max']): R.err('cam-zoom', w, f'zoom {z} must be above 1 and ≤ {C["max"]}')
            elif not (RULES['pushZ'][0] <= z <= RULES['pushZ'][1]): R.warn('cam-zoom', w, f'zoom {z}: the talking-head-motion way is {RULES["pushZ"][0]}–{RULES["pushZ"][1]}')
            close = bool(pushes) and t - pushes[-1][1] < C['gap'] - 1e-9
            if close: R.err('cam-often', w, f'pushes must be ≥ {C["gap"]} s apart (Friend: zoom was "พร่ำเพรื่อ")')
            if zoomed: R.warn('cam-push-twice', w, 'pushed again without pulling back first')
            if any(s['t0'] - R_tol() <= t < s['t1'] for s in cards): R.warn('cam-hidden', w, 'push starts under a full-screen card where nobody sees it')
            if not close: pushes.append((i, t))   # a push refused for being too close does not count again below
            zoomed = True
        elif 'pull' in c:
            if c.get('cut'):
                if style == 'overlay': R.err('cam-cut', w, 'overlay never cuts the zoom: pull back softly')
                elif not any(abs(s['t0'] - t) <= R_tol() for s in cards): R.err('cam-cut', w, 'a cut pull-back must sit on a card cut, or the face jumps')
            zoomed = False
        else:
            R.err('cam-shape', f'camera[{i}]', 'each camera move is {"push": t} or {"pull": t}', cam=i)
    R.ctx = {}
    mx = math.ceil(dur / RULES['pushEvery'])
    if len(pushes) > mx: R.err('cam-often', 'camera', f'{len(pushes)} pushes in {dur:.0f} s, max {mx} (about one per 10 s)', cam=pushes[mx][0])


def validate(plan, cat=None, faces=None, history=None, render=False):
    cat = cat or json.load(open(os.path.join(HERE, 'catalog.json')))
    R = Report()
    if not check_shape(plan, R): return R, None
    layout = dict(plan.get('layout') or {})
    if faces:
        for k, v in faces['layout'].items(): layout.setdefault(k, v)
    check_scenes(plan, cat, R)
    check_timeline(plan, R, faces)
    score = check_variety(plan, R, history)
    check_numbers(plan, R, cat)
    check_subtitles(plan, R, layout)
    check_places(plan, cat, R, layout, faces)
    check_camera(plan, cat, R)
    if render and not R.blocking:
        import render_check
        render_check.run(plan, R)
    return R, score


if __name__ == '__main__':
    a = sys.argv[1:]
    if not a: sys.exit(__doc__)
    opt = lambda k: a[a.index(k) + 1] if k in a else None
    plan = json.load(open(a[0]))
    faces = json.load(open(opt('--faces'))) if opt('--faces') else None
    history = json.load(open(opt('--history'))) if opt('--history') else None
    R, score = validate(plan, faces=faces, history=history, render='--render' in a)
    out = {'ok': R.ok, 'errors': sum(i['level'] == 'error' for i in R.issues), 'warnings': sum(i['level'] == 'warn' for i in R.issues),
           'historyScore': score, 'issues': R.issues}
    if opt('--out'): json.dump(out, open(opt('--out'), 'w'), ensure_ascii=False, indent=1)
    for i in R.issues: print(f"{i['level']:5} {i['code']:16} {i['where']}: {i['msg']}")
    print('PASS' if R.ok else 'FAIL', f"({out['errors']} errors, {out['warnings']} warnings)")
    sys.exit(0 if R.ok else 1)
