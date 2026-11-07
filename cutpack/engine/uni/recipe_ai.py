#!/usr/bin/env python3
"""Lego recipes written by the AI (test, Friend 2026-11-07: "start with (a)", same model as the web = Sonnet 5.5).

The planner reads a clip's caption lines and writes, for the lines that deserve a picture, one lego recipe each
(story frame + things + what happens, see scenes/lego.js) — or reuses a recipe of the library. Code checks every
recipe; the good ones become scenes every style can draw.

usage:
  recipe_ai.py ask   <captions.json> <duration_s> <ask_dir> [2]      write system.txt + user.txt (the request); 2 = prompt v2
  recipe_ai.py check <ask_dir> <answer.json> <out_dir> <prefix> [<fix_answer.json>]
        check the answer (+ the fix round's answer, whose pictures replace the same lines) → out_dir/recipes.js,
        report.json, scenes.txt (ids for render_test.sh, with @index)
  recipe_ai.py fix   <ask_dir> <out_dir>                               after check: the fix-round request for the
        pictures that failed (fix_system.txt + fix_user.txt), or "nothing to fix"
Prompt v2 = step 1 (Friend 2026-11-07): the AI first writes what the viewer sees ("shows"), varies the frames, makes at
most 2 icon swaps per clip, never uses harsh icons, copies the words exactly, and reuses the library only for the same
meaning. The fix round is the product's: one more call for the failed pictures (Haiku 5.5), then plain text cards.
"""
import json, os, re, sys

UNI = os.path.dirname(os.path.abspath(__file__))
ENGINE = os.path.dirname(UNI)
ICONS = set(json.load(open(os.path.join(ENGINE, 'icons', 'lucide.json'))))
CORE_ICONS = '\n'.join(l for l in open(os.path.join(ENGINE, 'plan', 'prompt', 'icons_core.txt')).read().splitlines() if l and not l.startswith('#'))
MARKS = set(range(0x0E31, 0x0E32)) | set(range(0x0E34, 0x0E3B)) | set(range(0x0E47, 0x0E4F))
glen = lambda s: sum(1 for ch in s if ord(ch) not in MARKS)            # letters as the eye counts them (Thai marks ride on a letter)
flat = lambda s: re.sub(r'\s+', '', s.replace('/', ''))

LIBRARY = [  # id, what it shows — the recipes of scenes/lego.js
    ('not-worth.lego', 'balance: money vs product, tips to the money side (not worth it)'),
    ('undecided.lego', 'pointer goes between a yes and a no button and stops in the middle (undecided)'),
    ('fewer-customers.lego', 'a shop with 4 people around it, they leave one by one (fewer customers)'),
    ('not-first.lego', 'a 3-line checklist, the first line is crossed (the first thing to do is not X)'),
    ('fix-spot.lego', 'three gears, the broken middle one is found and fixed (fix the right spot)'),
    ('price-cut.lego', 'a price bar drops but the cart is crossed (cutting the price does not sell)'),
    ('lego.views-sales', 'two cards: views crossed, sales ticked (not X but Y)'),
    ('lego.value-price', 'two bars: price short, value long, value ticked (value over price)'),
    ('lego.money-gone', 'a wallet whose coins leave until none, warning sign (money runs out)'),
    ('lego.viewers-drop', 'bar chart going down, arrow down (viewers drop)'),
    ('lego.followers-up', 'bar chart going up, arrow up (followers grow)'),
    ('lego.three-steps', 'three steps with arrows, the last lights up (simple steps)'),
    ('lego.happy', 'a frown turns into a smile (customers become happy)'),
    ('lego.sales-jump', 'a sales bar grows from short to long, tick (sales jump)'),
    ('lego.bell-on', 'a bell and a switch that turns on (turn on notifications)'),
    ('lego.right-people', 'four people, one is focused and lights up (the right people)'),
    ('lego.on-target', 'an arrow hits the bullseye (on target)'),
]

HARSH = {'skull', 'bomb', 'sword', 'swords', 'axe', 'biohazard', 'radiation', 'ghost', 'syringe', 'cigarette', 'wine', 'beer', 'flame'}
CORE_ICONS_V2 = '\n'.join(' '.join(w for w in l.split(' ') if w not in HARSH) for l in CORE_ICONS.splitlines())
LIBRARY_V2 = [  # id, what it says (and what it is NOT for)
    ('not-worth.lego', 'a balance tips to the money side: paying more than you get, not worth it. Not for: worth it, good value'),
    ('undecided.lego', 'a pointer goes between yes and no and stops in the middle: undecided, hesitating'),
    ('fewer-customers.lego', 'people leave a shop one by one: fewer customers, it gets quiet. Not for: growth'),
    ('not-first.lego', 'the first line of a checklist is crossed: the first thing to do is NOT this'),
    ('fix-spot.lego', 'the broken gear among three is found and repaired: find the real problem and fix it'),
    ('price-cut.lego', 'the price drops but the cart is crossed: a lower price still does not sell'),
    ('lego.views-sales', 'views crossed, sales ticked: what matters is not X but Y'),
    ('lego.value-price', 'price bar short, value bar long, value ticked: value matters more than price'),
    ('lego.money-gone', 'coins leave the wallet until none, a warning: money runs out, a loss. Not for: no loss, saving, earning'),
    ('lego.viewers-drop', 'a bar chart going down: viewers (or anything) drop'),
    ('lego.followers-up', 'a bar chart going up: followers (or anything) grow'),
    ('lego.three-steps', 'three steps with arrows, the last lights up: a simple sequence that ends in the goal'),
    ('lego.happy', 'a frown turns into a smile: someone becomes happy, satisfied'),
    ('lego.sales-jump', 'a bar grows from short to long, tick: a result jumps up'),
    ('lego.bell-on', 'a switch turns a bell on: turn on notifications, a call to act'),
    ('lego.right-people', 'one of four people is picked and lights up: the right people, the target customer'),
    ('lego.on-target', 'an arrow hits the bullseye: exactly right, on target'),
]

SYSTEM = """You plan the pictures of a Thai talking-head short. Every picture is a LEGO RECIPE: a story frame + the things in it + what happens. Code turns each recipe into a moving graphic in the customer's style, so you write NO code and choose NO colours, fonts or motion.

# Your job
Read the caption lines (each: number, seconds, words). Pick the lines that carry an idea and give each of them one picture, about one picture every 4-6 seconds (this clip: about {n} pictures, at most {nmax}). Skip filler lines. Never two pictures on one line.
For each picture write the words on screen, taken from that line: "lead" (the words before the key, at most 22 letters) and "key" (the key word or words, at most 12 letters). Then either reuse a library recipe ("use") when it says exactly the same thing, or write a new "recipe".

# Story frames
1. "versus" — two things side by side, one wins.
   {{"layout":"versus","as":"cards"|"scale"|"measure"|"buttons","a":THING,"b":THING,"win":"a"|"b","how":"both"|"cross"|"check"}}
   - cards: two cards, each THING may have a "label". "not X but Y", choosing between two options. The loser is crossed, the winner ticked ("cross" = only cross the loser, "check" = only tick the winner).
   - scale: a balance, the winner is the HEAVIER side and goes down. Weighing, worth it or not, cost against value.
   - measure: two bars, each THING has "v" (0.1-1, long = more). More or less of two things.
   - buttons: a pointer goes between button a and button b and stops in the middle (undecided). Optional "top": an icon above.
2. "count" — things arrive or leave one by one.
   {{"layout":"count","as":"row"|"ring"|"bars","dir":"down"|"up","center":{{"icon":…}},"item":THING,"n":2-4,"keep":0-3,"end":THING}}
   - row: a card with the owner ("center") and n items in a row. ring: the center with n items around it, linked. bars: a bar chart that falls (down) or rises (up), no item needed.
   - down: items leave until "keep" stay (fewer, lost, gone). up: items arrive one by one (more, growing). "end": optional sign at the end (e.g. a red warning).
3. "steps" — a sequence, one step marked.
   {{"layout":"steps","as":"row"|"list","items":[…3 items…],"mark":{{"at":0-2,"how":"light"|"check"|"cross"}}}}
   - row: 3 THINGs with arrows between them (each needs "icon", "label" optional). list: a 3-line checklist, each item {{"label":…}} or {{"skel":0.3-0.9}} (a blank line).
   - light = this step is the important one, check = done / right, cross = wrong / not this one.
4. "change" — one thing changes.
   - {{"layout":"change","as":"swap","from":THING,"to":THING}}: one icon turns into another (before → after).
   - {{"layout":"change","as":"meter","icon":…,"v0":0-1,"v1":0-1,"then":{{"icon":…,"how":"cross"|"check"}}}}: a bar grows or shrinks; optional result below that is crossed or ticked.
   - {{"layout":"change","as":"toggle","icon":…,"on":true|false,"then":{{"how":"check"}}}}: a switch turns on (or off).
5. "aim" — find the one among several.
   - {{"layout":"aim","as":"pick","items":[3 or 4 icon names],"at":index,"bad":true|false,"round":true|false,"how":"pick"|"fix"|"cross"}}: a focus closes in on one. pick = it lights up and the rest fade; fix = it is broken (bad: true) and a wrench repairs it; cross = it is the wrong one. round = round holders (people).
   - {{"layout":"aim","as":"target"}}: an arrow hits the bullseye (on target, exactly right).
THING = {{"icon": icon name, "label": optional words, "tone": "main"|"acc"|"soft"|"neg", "shape": optional "round"}}. acc = the one highlight (positive), soft = faded or inactive, neg = red, only for a negative meaning.

# Rules
- The picture must say what the line says, so a viewer gets it with the sound off. A tick means yes / good, a cross means no / wrong: never tick what the speaker warns against.
- Pick the frame by what the line does: compares → versus; more, less, lost, growing → count; steps, order, first / last → steps; a change or a result → change; find, focus, fix, aim → aim.
- Every word on screen (lead, key, labels) comes from that line, spelled as said (spaces may differ). Labels at most 12 letters. Numbers only if said.
- Icons: only names from the icon list below (Lucide).

# Library (reuse with {{"use": id}} when it fits exactly; you may still write new words)
{library}

# Icons
{icons}

# Answer
Only JSON, no other text:
{{"pictures":[{{"line":7,"lead":"…","key":"…","meaning":"a few English words","recipe":{{…}}}}, {{"line":12,"lead":"…","key":"…","meaning":"…","use":"lego.money-gone"}}]}}
"""


V2_EDITS = [   # (text of v1, text of v2) — step 1, from what round four showed
    ('For each picture write the words on screen, taken from that line:',
     'For each picture first write "shows": one short English sentence of what the viewer will see and why it says the same as the line, '
     'with the same yes or no, good or bad. Then write the recipe that draws exactly that.\nThen write the words on screen, taken from that line:'),
    ('- Pick the frame by what the line does:',
     '- Vary the pictures: use at least 4 different frames in a clip, the same frame kind (layout + as) at most 3 times. "change" + "swap" '
     '(one icon turns into another) is the weakest picture: at most 2 in a clip, only for a real before → after. Prefer frames with a small '
     'story in steps (cards, scale, measure, count, steps, aim).\n'
     '- "keep": 0 (everything leaves) only when the line says all of it is gone; otherwise keep 1.\n'
     '- Pick the frame by what the line does:'),
    ('- Every word on screen (lead, key, labels) comes from that line, spelled as said (spaces may differ). Labels at most 12 letters. Numbers only if said.',
     '- Every word on screen (lead, key, labels) is COPIED from that line (or the next one when the sentence runs on): you may leave words out '
     'at the start or the end, but never reorder, rephrase, shorten or add a word. Spaces may differ. Count every letter, spaces and Latin '
     'letters included: key and labels at most 12, lead at most 22. Numbers only if said.\n'
     '- Never use these icons (harsh or off-brand): ' + ', '.join(sorted(HARSH)) + '. For harm or danger use triangle-alert, shield-alert, '
     'heart-crack, battery-low or thumbs-down.'),
    ('# Library (reuse with {{"use": id}} when it fits exactly; you may still write new words)',
     '# Library (reuse with {{"use": id}} only when it says the SAME thing as the line, with the same yes or no: "there is no loss" is NOT '
     '"money runs out"; you may still write new words)'),
    ('{{"pictures":[{{"line":7,"lead"', '{{"pictures":[{{"line":7,"shows":"…","lead"'),
    ('{{"line":12,"lead"', '{{"line":12,"shows":"…","lead"'),
]
FIX = '''

# Fix round
The pictures below broke the rules. Write them again — only these, in the same JSON form ({"pictures":[…]}), each on the same line.
You may change the frame. All the rules above still hold.
'''


def system_v2():
    t = SYSTEM
    for a, b in V2_EDITS:
        assert a in t, a[:50]
        t = t.replace(a, b)
    return t


def ask(captions, duration, out, v=1):
    caps = json.load(open(captions))
    caps = caps['captions'] if isinstance(caps, dict) else caps
    os.makedirs(out, exist_ok=True)
    n = max(3, round(duration / 5)); nmax = round(duration / 4)
    lib = '\n'.join(f'- {i}: {d}' for i, d in (LIBRARY_V2 if v == 2 else LIBRARY))
    text = (system_v2() if v == 2 else SYSTEM).format(n=n, nmax=nmax, library=lib, icons=CORE_ICONS_V2 if v == 2 else CORE_ICONS)
    open(os.path.join(out, 'system.txt'), 'w').write(text)
    json.dump({'v': v, 'n': n, 'nmax': nmax}, open(os.path.join(out, 'ask.json'), 'w'))
    lines = [f'{k + 1}. [{c["t0"]:.1f}-{c["t1"]:.1f}] {re.sub(r"\s+", " ", c["text"].replace(" / ", " ")).strip()}' for k, c in enumerate(caps)]
    open(os.path.join(out, 'user.txt'), 'w').write(f'Clip: {duration:.1f} seconds, {len(caps)} caption lines.\n\n' + '\n'.join(lines) + '\n')
    json.dump({'lines': [l.split('] ', 1)[1] for l in lines], 'duration': duration}, open(os.path.join(out, 'lines.json'), 'w'), ensure_ascii=False)
    print('system', len(open(os.path.join(out, 'system.txt')).read()), 'chars · user', len(open(os.path.join(out, 'user.txt')).read()), 'chars')


AS = {'versus': {'cards', 'scale', 'measure', 'buttons'}, 'count': {'row', 'ring', 'bars'}, 'steps': {'row', 'list'},
      'change': {'swap', 'meter', 'toggle'}, 'aim': {'pick', 'target'}}
TONES = {'main', 'acc', 'soft', 'neg', None}


def problems(r, line):
    """what is wrong with one recipe (empty list = fine)"""
    bad = []
    L, a = r.get('layout'), r.get('as')
    if L not in AS: return [f'unknown frame {L}']
    if a not in AS[L]: bad.append(f'{L}: unknown kind {a}')
    def thing(t, where, need_icon=True):
        if not isinstance(t, dict): bad.append(f'{where}: missing'); return
        if need_icon and t.get('icon') not in ICONS: bad.append(f'{where}: unknown icon {t.get("icon")}')
        if t.get('tone') not in TONES: bad.append(f'{where}: unknown tone {t.get("tone")}')
        if t.get('label'): words(t['label'], f'{where} label')
    def words(w, where, most=12):
        if glen(w) > most: bad.append(f'{where} "{w}" longer than {most}')
        if flat(w) not in flat(line): bad.append(f'{where} "{w}" not said here')
        for d in re.findall(r'\d+', w):
            if d not in line: bad.append(f'{where}: number {d} not said')
    if L == 'versus':
        if a != 'buttons' and r.get('win') not in ('a', 'b'): bad.append('versus: win must be a or b')
        thing(r.get('a'), 'a'); thing(r.get('b'), 'b')
        if a == 'measure':
            for k in 'ab':
                v = (r.get(k) or {}).get('v')
                if not isinstance(v, (int, float)) or not 0 < v <= 1: bad.append(f'measure: {k}.v must be 0-1')
    elif L == 'count':
        if r.get('dir', 'down') not in ('down', 'up'): bad.append('count: dir must be down or up')
        if a != 'bars': thing(r.get('item'), 'item')
        thing(r.get('center'), 'center')
        n, keep = r.get('n', 4), r.get('keep', 1)
        if not (isinstance(n, int) and 2 <= n <= 4): bad.append('count: n must be 2-4')
        if r.get('dir', 'down') == 'down' and not (isinstance(keep, int) and 0 <= keep < n): bad.append('count: keep must be 0..n-1')
        if r.get('end'): thing(r['end'], 'end')
    elif L == 'steps':
        its = r.get('items') or []
        if len(its) != 3: bad.append('steps: exactly 3 items')
        for k, it in enumerate(its):
            if a == 'row': thing(it, f'step {k + 1}')
            elif it.get('label'): words(it['label'], f'step {k + 1} label')
        m = r.get('mark') or {}
        if m.get('at') not in (0, 1, 2) or m.get('how') not in ('light', 'check', 'cross'): bad.append('steps: mark needs at 0-2 and how light|check|cross')
    elif L == 'change':
        if a == 'swap': thing(r.get('from'), 'from'); thing(r.get('to'), 'to')
        else:
            if r.get('icon') not in ICONS: bad.append(f'change: unknown icon {r.get("icon")}')
            if a == 'meter' and not all(isinstance(r.get(k), (int, float)) and 0 <= r[k] <= 1 for k in ('v0', 'v1')): bad.append('meter: v0 and v1 must be 0-1')
            t = r.get('then')
            if t:
                if t.get('how') not in ('cross', 'check'): bad.append('then: how must be cross or check')
                if a == 'meter' and t.get('icon') not in ICONS: bad.append(f'then: unknown icon {t.get("icon")}')
    elif L == 'aim' and a == 'pick':
        its = r.get('items') or []
        if len(its) not in (3, 4): bad.append('aim: 3 or 4 items')
        for ic in its:
            if ic not in ICONS: bad.append(f'aim: unknown icon {ic}')
        if not (isinstance(r.get('at'), int) and 0 <= r['at'] < len(its)): bad.append('aim: at out of range')
        if r.get('how', 'pick') not in ('pick', 'fix', 'cross'): bad.append('aim: how must be pick|fix|cross')
    return bad


def icons_in(r):
    out = []
    def walk(x, k=None):
        if isinstance(x, dict):
            for kk, v in x.items():
                if kk == 'icon' and isinstance(v, str): out.append(v)
                else: walk(v, kk)
        elif isinstance(x, list):
            for v in x:
                if k == 'items' and isinstance(v, str): out.append(v)
                else: walk(v, k)
    walk(r)
    return out


def read_pictures(path):
    raw = open(path).read()
    return json.loads(re.search(r'\{.*\}', raw, re.S).group(0))['pictures']


def check(ask_dir, answer, out, prefix, fix_answer=None):
    lines = json.load(open(os.path.join(ask_dir, 'lines.json')))['lines']
    v = json.load(open(os.path.join(ask_dir, 'ask.json'))).get('v', 1) if os.path.exists(os.path.join(ask_dir, 'ask.json')) else 1
    lib = {i for i, _ in LIBRARY}
    pics = read_pictures(answer)
    fixed = set()
    if fix_answer:                                                     # the fix round's pictures replace the same lines
        by_line = {p.get('line'): p for p in read_pictures(fix_answer)}
        fixed = set(by_line)
        pics = [by_line.get(p.get('line'), p) for p in pics]
    os.makedirs(out, exist_ok=True)
    js, report, ids, used = [], [], [], set()
    swaps, kinds = 0, {}
    for k, p in enumerate(pics):
        n = p.get('line'); line = lines[n - 1] if isinstance(n, int) and 0 < n <= len(lines) else ''
        near = ' '.join(lines[max(0, n - 2):n + 1]) if line else ''       # a sentence often runs over the next caption line
        bad = [] if line else [f'line {n} does not exist']
        if n in used: bad.append(f'line {n} has two pictures')
        used.add(n)
        lead, key = p.get('lead', ''), p.get('key', '')
        for w, most, where in ((lead, 22, 'lead'), (key, 12, 'key')):
            if w and glen(w) > most: bad.append(f'{where} "{w}" longer than {most}')
            if w and line and flat(w) not in flat(near): bad.append(f'{where} "{w}" not said here')
        if not key: bad.append('no key word')
        rec = p.get('recipe') or {}
        if 'use' in p:
            if p['use'] not in lib: bad.append(f'unknown library recipe {p["use"]}')
            kind = 'library'
        else:
            bad += problems(rec, near); kind = 'new'
        if v == 2:                                                     # step-1 rules
            harsh = sorted(set(icons_in(rec)) & HARSH)
            if harsh: bad.append(f'harsh icon {", ".join(harsh)}')
            fk = (rec.get('layout'), rec.get('as')) if kind == 'new' else None
            if fk == ('change', 'swap'):
                swaps += 1
                if swaps > 2: bad.append('more than 2 icon swaps in this clip: tell it with another frame')
            if fk:
                kinds[fk] = kinds.get(fk, 0) + 1
                if kinds[fk] > 3 and fk != ('change', 'swap'): bad.append(f'frame {fk[0]}/{fk[1]} used more than 3 times: use another frame')
        sid = f'{prefix}.{k + 1:02d}'
        report.append({'id': sid, 'line': n, 'text': line, 'near': near, 'lead': lead, 'key': key, 'meaning': p.get('meaning'),
                       'shows': p.get('shows'), 'kind': kind, 'use': p.get('use'), 'recipe': p.get('recipe'), 'ok': not bad,
                       'problems': bad, 'fixed': n in fixed, 'picture': p})
        if bad: continue
        if kind == 'library':
            js.append(f"RECIPE({json.dumps(sid)}, Object.assign({{}}, SCENES[{json.dumps(p['use'])}].meta.lego, "
                      f"{{say: {json.dumps([lead, key], ensure_ascii=False)}, recipe: {json.dumps(p.get('meaning') or '', ensure_ascii=False)}}}));")
        else:
            r = dict(rec, say=[lead, key], meaning=p.get('meaning') or '', name=p.get('meaning') or '', recipe=p.get('meaning') or '')
            js.append(f'RECIPE({json.dumps(sid)}, {json.dumps(r, ensure_ascii=False)});')
        ids.append(f'{sid}@{len(ids) % 6}')
    open(os.path.join(out, 'recipes.js'), 'w').write('/* recipes written by the AI for one clip (recipe_ai.py check) */\n' + '\n'.join(js) + '\n')
    json.dump(report, open(os.path.join(out, 'report.json'), 'w'), ensure_ascii=False, indent=1)
    open(os.path.join(out, 'scenes.txt'), 'w').write(' '.join(ids) + '\n')
    ok = sum(r['ok'] for r in report)
    print(f'{prefix}: {len(report)} pictures, {ok} pass, {sum(r["kind"] == "library" and r["ok"] for r in report)} from the library'
          + (f', {len(fixed)} from the fix round' if fix_answer else ''))
    for r in report:
        if not r['ok']: print('  ', r['id'], r['problems'])


def fix(ask_dir, out):
    """the fix-round request: the same system prompt + the failed pictures with what is wrong"""
    report = json.load(open(os.path.join(out, 'report.json')))
    failed = [r for r in report if not r['ok']]
    if not failed:
        print('nothing to fix'); return
    open(os.path.join(out, 'fix_system.txt'), 'w').write(open(os.path.join(ask_dir, 'system.txt')).read() + FIX)
    body = open(os.path.join(ask_dir, 'user.txt')).read() + '\n# Pictures to write again\n' + '\n'.join(
        json.dumps({'line': r['line'], 'your_answer': r['picture'], 'what_is_wrong': r['problems']}, ensure_ascii=False) for r in failed) + '\n'
    open(os.path.join(out, 'fix_user.txt'), 'w').write(body)
    print(f'fix round: {len(failed)} pictures')


if __name__ == '__main__':
    a = sys.argv[1:]
    if not a: sys.exit(__doc__)
    if a[0] == 'ask': ask(a[1], float(a[2]), a[3], int(a[4]) if len(a) > 4 else 1)
    elif a[0] == 'check': check(a[1], a[2], a[3], a[4], a[5] if len(a) > 5 else None)
    elif a[0] == 'fix': fix(a[1], a[2])
    else: sys.exit(__doc__)
