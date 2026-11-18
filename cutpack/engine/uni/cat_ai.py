#!/usr/bin/env python3
"""Category plans written by the AI — prompt v4 (Friend 2026-11-08: "เริ่มงาน ก. สอน AI ให้เขียนใบประกอบตามหมวด แล้วลองกับ
บทพูดหลาย ๆ เรื่อง จะได้รู้ว่าหมวดไหนใช้บ่อยและยังขาดร่าง").

The planner reads a clip's caption lines and, for the lines that deserve a picture, writes ONE CATEGORY (B01–B21, what
kind of sentence it is) + that category's SLOTS (the ใบประกอบ: the few things in the picture). The program then picks the
variant (scenes/cats.js) and the style draws it, so the AI's instructions do not grow with the number of variants.
A line that deserves a picture but fits no category is written as cat "none" + what it needs: that is how we find
categories we do not have yet. Same model as the web plan (Sonnet 5.5, effort low); same fix round (Haiku 5.5).
Prompt v5 (Friend 2026-11-17: "เขียน skill ให้ละเอียดนะ AI จะได้คิดน้อยๆที่สุดและผลลัพธ์มันจะได้ออกมาดีสม่ำเสมอกันทุกคลิป"): numbered steps,
the category by an ordered list (the first true one wins, no weighing), one rule per line, right and wrong examples; the AI no
longer writes "lead" (the subtitles carry every word) nor "accent" (no style uses it since the old styles were cancelled);
THING lost its optional knobs (tone, shape, v, switch). v4 is in git history.

usage:
  cat_ai.py ask   <captions.json> <duration_s> <ask_dir>             system.txt + user.txt (the request) + lines.json
  cat_ai.py check <ask_dir> <answer.json> <out_dir> <prefix> [<fix_answer.json>]
        → out_dir/sentences.js (SENTENCE calls, one per good picture), report.json (with each picture's rank 1–3), scenes.txt
          (ids for render_test.sh), camera.json (zoom: the strongest lines · accent: 1–2 words per sentence; tools/clip_plan.py)
  cat_ai.py fix   <ask_dir> <out_dir>                                 the fix-round request for the pictures that failed
captions.json = [{"t0": s, "t1": s, "text": "…"}, …] (or {"captions": […]})
"""
import json, os, re, sys

UNI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, UNI)
from recipe_ai import ICONS, HARSH, CORE_ICONS_V2, glen, flat, read_pictures  # noqa: E402

SYSTEM = """You plan the pictures of a Thai talking-head short. Follow the steps exactly. Do not invent anything.
Code does everything else: it picks how each picture looks, the screen, the colours, the timing, the subtitles and the camera. You only fill the answer below.

# Step 1 — which lines get a picture
- Give a picture to about {n} lines (at most {nmax}). Spread them over the whole clip.
- Give a picture only to a line that carries an idea. Skip: greetings, filler ("ก็", "แบบว่า", "อ่ะ"), a line that only repeats the line before.
- Never two pictures on one line. Never pictures on two lines next to each other when the second line only finishes the same sentence.
- "rank": 1 = one of the main points of the clip (about one picture in three), 2 = helps a lot, 3 = only adds.

# Step 2 — the category: go down this list and take the FIRST that is true for the line
1. B15 — the line asks the viewer to follow, comment, save, share or like.
2. B01 — the line says a number (amount, percent, count, years, price) and the number is the point.
3. B05 — "not X but Y", or one thing is wrong and another is right.
4. B07 — a warning: don't, be careful, a risk, a mistake.
5. B06 — someone asks a question, wonders or hesitates.
6. B04 — steps in order, or a list of things to do.
7. B12 — one thing causes the next (because, so, then it leads to).
8. B03 — two things side by side, or one thing before and after a change.
9. B02 — something grows or shrinks, comes or goes, rises or falls.
10. B09 — time: time passing, a deadline, moments in order, how long it takes.
11. B11 — what someone says or writes: a message, a chat, a comment, a review.
12. B10 — who this is for, a kind of person, a crowd.
13. B20 — how two people (or a person and a brand) are linked.
14. B18 — something that happened in a story or in the speaker's life.
15. B19 — someone says how they feel.
16. B21 — a place: where someone is or where something happens.
17. B16 — "X is Y": what a word means.
18. B17 — several things named together that are not steps: examples, parts, costs, reasons.
19. B13 — a tip, a trick, a secret.
20. B08 — a goal, a result, a success.
21. B14 — a short line to remember. Use B14 only when 1–20 are all false.
If none is true, write {{"line":7,"cat":"none","need":"what the line does, in a few English words"}} for that line.

# Step 3 — the slots of that category (write only these keys; leave out every optional key the line does not give)
THING = {{"icon":"icon name","label":"words"}}. icon is required, label is optional.
B01 {{"value":"3,000","unit":"บาท","icon":"icon name"}} — value: the number exactly as said. unit and icon optional.
B02 {{"dir":"up","item":THING,"center":THING}} — dir "up" or "down". item: what grows or goes. center optional: whose (a shop, a wallet).
B03 {{"mode":"versus","a":THING,"b":THING,"win":"b"}} — mode "versus" (two things, win = the better one "a" or "b") or "change" (a = before, b = after, no win).
B04 {{"items":[THING,THING,THING],"mark":{{"at":1,"how":"light"}}}} — exactly 3 items in order. mark optional: the item that matters (at 0, 1 or 2), how "light", "check" (done) or "cross" (wrong).
B05 {{"wrong":THING,"right":THING}}
B06 {{"about":THING}} — who or what is in doubt. Add "options":[THING,THING] only when the line names two choices, "answer":THING only when the line gives it.
B07 {{"thing":THING,"how":"cross"}} — how "cross" (do not do it) or "flag" (be careful).
B08 {{"goal":THING}}
B09 {{"points":[THING,THING,THING]}} — three moments in order, as said. Or {{"result":THING}} when the line says what the time brought.
B10 {{"who":THING,"label":"words"}} — who: a person icon (user, users, baby, …). label: the kind of person, as said.
B11 {{"kind":"chat","quote":"words"}} — kind "chat", "comment", "review" or "message". quote: the words of the message, as said. Add "gone":true only when nobody replied.
B12 {{"items":[THING,THING,THING]}} — exactly 3 links of the chain, in order.
B13 {{"secret":THING}}
B14 {{"idea":THING}}
B15 {{"action":"follow"}} — "follow", "comment", "save", "share" or "like".
B16 {{"term":THING,"means":[THING]}} — term needs a label (the word defined). means: 1 to 3 things.
B17 {{"items":[THING,THING,THING]}} — 2 to 4 things as said. Add "label":"words" only when the line names the group.
B18 {{"what":THING}} — what happened. Add "who":THING and "when":"words" only when said.
B19 {{"feel":THING,"mood":"good"}} — feel: smile, laugh, frown, angry, annoyed, meh, heart, heart-crack or party-popper (label = the feeling word as said). mood "good" or "bad".
B20 {{"a":THING,"b":THING}} — the two. Add "label":"words" for the link as said, "cut":true only when it is over.
B21 {{"place":THING}} — label = the place's name as said. Add "spots":[THING] (1 or 2) only when said.

# Step 4 — "key" and "shows"
- "key": the 1 to 3 words of the line that carry its point, copied exactly (at most 12 letters). The picture lights up when they are said.
- "shows": one short English sentence (at most 12 words): what the viewer sees.

# Hard rules (the code checks every one; a picture that breaks one is sent back to you)
- Every word you write in Thai (key, label, quote, unit, when) is COPIED from that line or the next line. You may drop words at the start or the end. Never reorder, rephrase, shorten or add.
- Count every letter, spaces and Latin letters included: key, label, quote, unit and when at most 12.
- A number appears only if it is said.
- Icons: only names from the icon list. Never: {harsh}. For harm or danger use triangle-alert, shield-alert, heart-crack, battery-low or thumbs-down.
- A tick means yes / good, a cross means no / wrong. Never tick what the speaker warns against.

# Examples
Line 4: "ขั้นแรกล้างมือ ใส่ถุงมือ แล้วค่อยหยิบของ"
RIGHT {{"line":4,"rank":1,"shows":"Three steps: wash, gloves, pick up.","cat":"B04","slots":{{"items":[{{"icon":"droplet","label":"ล้างมือ"}},{{"icon":"hand","label":"ใส่ถุงมือ"}},{{"icon":"package","label":"หยิบของ"}}]}},"key":"ใส่ถุงมือ"}}
WRONG label "ล้างมือให้สะอาด" (not said) · label "ขั้นที่หนึ่ง" (rephrased) · cat B17 (these are steps in order, B04 comes first)
Line 9: "อย่าเล่นมือถือก่อนนอนนะ"
RIGHT {{"line":9,"rank":2,"shows":"A phone at bedtime, crossed out.","cat":"B07","slots":{{"thing":{{"icon":"smartphone","label":"มือถือ"}},"how":"cross"}},"key":"ก่อนนอน"}}
Line 12: "ผมทำร้านนี้มา 5 ปี"
RIGHT {{"line":12,"rank":2,"shows":"The number 5 with years.","cat":"B01","slots":{{"value":"5","unit":"ปี","icon":"store"}},"key":"5 ปี"}}
WRONG value "ห้า" (write the digits as said) · cat B09 (a number that is the point: B01 comes first)

# Step 5 — camera
"zoom": the 6 to 8 strongest lines of the clip (a claim, a turn, the point), strongest first, as line numbers. The camera slowly pushes in on some of them.

# Icons
{icons}

# Answer
Only JSON, no other text:
{{"pictures":[{{"line":4,"rank":1,"shows":"…","cat":"B04","slots":{{…}},"key":"…"}},{{"line":15,"rank":3,"cat":"none","need":"…"}}],"zoom":[4,12,9,1,15,7]}}
"""
FIX = '''

# Fix round
The pictures below broke the rules. Write them again — only these, in the same JSON form ({"pictures":[…]}), each on the same line.
You may change the category. All the rules above still hold.
'''

CATS = {f'B{i:02d}' for i in range(1, 22)}       # B17–B21 added 2026-11-10 (round 6)
TONES = {None, 'main', 'acc', 'soft', 'neg'}
SLOTS = {'B01': {'value', 'unit', 'icon', 'dir', 'money'}, 'B02': {'dir', 'item', 'center', 'n', 'keep', 'end'},
         'B03': {'mode', 'a', 'b', 'win', 'how', 'switch'}, 'B04': {'items', 'mark'}, 'B05': {'wrong', 'right'},
         'B06': {'about', 'options', 'answer'}, 'B07': {'thing', 'how', 'sign'}, 'B08': {'goal', 'who'},
         'B09': {'points', 'at', 'result'}, 'B10': {'who', 'label', 'tags'}, 'B11': {'kind', 'quote', 'mood', 'react', 'gone', 'app'},
         'B12': {'items', 'end'}, 'B13': {'secret'}, 'B14': {'idea'}, 'B15': {'action', 'label'}, 'B16': {'term', 'means'},
         'B17': {'items', 'label'}, 'B18': {'what', 'who', 'when'}, 'B19': {'feel', 'who', 'mood'}, 'B20': {'a', 'b', 'label', 'cut'},
         'B21': {'place', 'spots'}}


def ask(captions, duration, out):
    caps = json.load(open(captions))
    caps = caps['captions'] if isinstance(caps, dict) else caps
    os.makedirs(out, exist_ok=True)
    n = max(3, round(duration / 3)); nmax = round(duration / 2.5)   # the busiest style's count (editorial-overlay: a widget about every 3 s); calmer styles keep the best ranks
    text = SYSTEM.format(n=n, nmax=nmax, harsh=', '.join(sorted(HARSH)), icons=CORE_ICONS_V2)
    open(os.path.join(out, 'system.txt'), 'w').write(text)
    lines = [f'{k + 1}. [{c["t0"]:.1f}-{c["t1"]:.1f}] {re.sub(r"\s+", " ", c["text"].replace(" / ", " ")).strip()}' for k, c in enumerate(caps)]
    open(os.path.join(out, 'user.txt'), 'w').write(f'Clip: {duration:.1f} seconds, {len(caps)} caption lines.\n\n' + '\n'.join(lines) + '\n')
    json.dump({'lines': [l.split('] ', 1)[1] for l in lines], 'times': [[c['t0'], c['t1']] for c in caps], 'duration': duration, 'n': n, 'nmax': nmax},
              open(os.path.join(out, 'lines.json'), 'w'), ensure_ascii=False)
    print('system', len(text), 'chars · user', len(open(os.path.join(out, 'user.txt')).read()), 'chars')


def problems(cat, s, near):
    """what is wrong with one category + slots (empty list = fine)"""
    bad = []
    if not isinstance(s, dict): return ['slots missing']
    extra = set(s) - SLOTS[cat]
    if extra: bad.append(f'{cat}: not slots of this category: {", ".join(sorted(extra))}')

    def words(w, where, most=12):
        if not isinstance(w, str) or not w: bad.append(f'{where}: empty'); return
        if glen(w) > most: bad.append(f'{where} "{w}" longer than {most}')
        if flat(w) not in flat(near): bad.append(f'{where} "{w}" not said here')
        for d in re.findall(r'\d+', w):
            if d not in near: bad.append(f'{where}: number {d} not said')

    def icon(i, where):
        if i not in ICONS: bad.append(f'{where}: unknown icon {i}')
        elif i in HARSH: bad.append(f'{where}: harsh icon {i}')

    def thing(t, where, label=False):
        if not isinstance(t, dict): bad.append(f'{where}: missing'); return
        icon(t.get('icon'), where)
        if t.get('tone') not in TONES: bad.append(f'{where}: unknown tone {t.get("tone")}')
        if t.get('label'): words(t['label'], f'{where} label')
        elif label: bad.append(f'{where}: needs a label')
        if 'v' in t and not (isinstance(t['v'], (int, float)) and 0 < t['v'] <= 1): bad.append(f'{where}: v must be 0.1-1')

    def things(ts, where, n=None, lo=1, hi=3):
        if not isinstance(ts, list): bad.append(f'{where}: must be a list'); return
        if n is not None and len(ts) != n: bad.append(f'{where}: exactly {n}')
        elif not lo <= len(ts) <= hi: bad.append(f'{where}: {lo}-{hi} items')
        for k, t in enumerate(ts): thing(t, f'{where} {k + 1}')

    if cat == 'B01':
        v = str(s.get('value', ''))
        if not re.search(r'\d', v): bad.append('value must be a number that is said')
        elif flat(v) not in flat(near): bad.append(f'number "{v}" not said here')
        if s.get('unit'): words(s['unit'], 'unit')
        if s.get('icon'): icon(s['icon'], 'icon')
        if s.get('dir') not in (None, 'up', 'down'): bad.append('dir must be up or down')
    elif cat == 'B02':
        if s.get('dir') not in ('up', 'down'): bad.append('dir must be up or down')
        thing(s.get('item'), 'item')
        if s.get('center') is not None: thing(s['center'], 'center')
        n, keep = s.get('n', 4), s.get('keep', 1)
        if not (isinstance(n, int) and 2 <= n <= 4): bad.append('n must be 2-4')
        if s.get('dir') == 'down' and not (isinstance(keep, int) and 0 <= keep < n): bad.append('keep must be 0..n-1')
        if s.get('end') is not None: thing(s['end'], 'end')
    elif cat == 'B03':
        if s.get('mode') not in ('versus', 'change'): bad.append('mode must be versus or change')
        thing(s.get('a'), 'a'); thing(s.get('b'), 'b')
        if s.get('mode') == 'versus' and s.get('win') not in ('a', 'b'): bad.append('versus: win must be a or b')
        if s.get('how') not in (None, 'cross', 'check'): bad.append('how must be cross or check')
        if s.get('switch') not in (None, True, False): bad.append('switch must be true or false')
    elif cat in ('B04', 'B12'):
        things(s.get('items'), 'items', n=3)
        m = s.get('mark')
        if m is not None and (not isinstance(m, dict) or m.get('at') not in (0, 1, 2) or m.get('how') not in ('light', 'check', 'cross')):
            bad.append('mark needs at 0-2 and how light|check|cross')
        if s.get('end') is not None: thing(s['end'], 'end')
    elif cat == 'B05':
        thing(s.get('wrong'), 'wrong'); thing(s.get('right'), 'right')
    elif cat == 'B06':
        if not any(k in s for k in ('about', 'options', 'answer')): bad.append('give about, options or answer')
        if s.get('about') is not None: thing(s['about'], 'about')
        if s.get('options') is not None: things(s['options'], 'options', n=2)
        if s.get('answer') is not None: thing(s['answer'], 'answer')
    elif cat == 'B07':
        thing(s.get('thing'), 'thing')
        if s.get('how') not in ('cross', 'flag'): bad.append('how must be cross or flag')
        if s.get('sign'): icon(s['sign'], 'sign')
    elif cat == 'B08':
        thing(s.get('goal'), 'goal')
        if s.get('who'): icon(s['who'], 'who')
    elif cat == 'B09':
        if s.get('points') is None and s.get('result') is None: bad.append('give points or result')
        if s.get('points') is not None: things(s['points'], 'points', n=3)
        if s.get('result') is not None: thing(s['result'], 'result')
        if s.get('at', 2) not in (0, 1, 2): bad.append('at must be 0-2')
    elif cat == 'B10':
        if s.get('who') is None and not s.get('label'): bad.append('give who or label')
        if s.get('who') is not None: thing(s['who'], 'who')
        if s.get('label'): words(s['label'], 'label')
        tags = s.get('tags') or []
        if not isinstance(tags, list) or len(tags) > 2: bad.append('tags: at most 2')
        else:
            for k, w in enumerate(tags): words(w, f'tag {k + 1}')
    elif cat == 'B11':
        if s.get('kind') not in ('chat', 'comment', 'review', 'message'): bad.append('kind must be chat|comment|review|message')
        if s.get('quote'): words(s['quote'], 'quote')
        if s.get('mood') not in (None, 'good', 'bad'): bad.append('mood must be good or bad')
        for k in ('react', 'app'):
            if s.get(k): icon(s[k], k)
        if s.get('gone') not in (None, True, False): bad.append('gone must be true or false')
    elif cat == 'B13':
        thing(s.get('secret'), 'secret')
    elif cat == 'B14':
        thing(s.get('idea'), 'idea')
    elif cat == 'B15':
        if s.get('action') not in ('follow', 'comment', 'save', 'share', 'like'): bad.append('action must be follow|comment|save|share|like')
        if s.get('label'): words(s['label'], 'label')
    elif cat == 'B16':
        thing(s.get('term'), 'term', label=True)
        things(s.get('means'), 'means', lo=1, hi=3)
    elif cat == 'B17':
        things(s.get('items'), 'items', lo=2, hi=4)
        if s.get('label'): words(s['label'], 'label')
    elif cat == 'B18':
        thing(s.get('what'), 'what')
        if s.get('who') is not None: thing(s['who'], 'who')
        if s.get('when'): words(s['when'], 'when')
    elif cat == 'B19':
        thing(s.get('feel'), 'feel')
        if s.get('who') is not None: thing(s['who'], 'who')
        if s.get('mood') not in (None, 'good', 'bad'): bad.append('mood must be good or bad')
    elif cat == 'B20':
        thing(s.get('a'), 'a'); thing(s.get('b'), 'b')
        if s.get('label'): words(s['label'], 'label')
        if s.get('cut') not in (None, True, False): bad.append('cut must be true or false')
    elif cat == 'B21':
        thing(s.get('place'), 'place')
        if s.get('spots') is not None: things(s['spots'], 'spots', lo=1, hi=2)
    return bad


def check(ask_dir, answer, out, prefix, fix_answer=None):
    L = json.load(open(os.path.join(ask_dir, 'lines.json')))
    lines = L['lines']
    pics = read_pictures(answer)
    fixed = set()
    if fix_answer:                                                     # the fix round's pictures replace the same lines
        by_line = {p.get('line'): p for p in read_pictures(fix_answer)}
        fixed = set(by_line)
        pics = [by_line.get(p.get('line'), p) for p in pics]
    os.makedirs(out, exist_ok=True)
    js, report, ids, used = [], [], [], set()
    for k, p in enumerate(pics):
        n = p.get('line'); line = lines[n - 1] if isinstance(n, int) and 0 < n <= len(lines) else ''
        near = ' '.join(lines[max(0, n - 2):n + 1]) if line else ''    # a sentence often runs over the next caption line
        bad = [] if line else [f'line {n} does not exist']
        if n in used: bad.append(f'line {n} has two pictures')
        used.add(n)
        cat = p.get('cat')
        sid = f'{prefix}.{k + 1:02d}'
        row = {'id': sid, 'line': n, 'text': line, 'cat': cat, 'shows': p.get('shows'), 'need': p.get('need'),
               'lead': p.get('lead', ''), 'key': p.get('key', ''), 'slots': p.get('slots'), 'fixed': n in fixed, 'picture': p,
               'rank': p.get('rank') if p.get('rank') in (1, 2, 3) else 2}
        if cat == 'none':
            row.update(ok=not bad, problems=bad); report.append(row); continue
        if cat not in CATS: bad.append(f'unknown category {cat}')
        lead, key = row['lead'], row['key']
        for w, most, where in ((lead, 22, 'lead'), (key, 12, 'key')):
            if w and glen(w) > most: bad.append(f'{where} "{w}" longer than {most}')
            if w and line and flat(w) not in flat(near): bad.append(f'{where} "{w}" not said here')
        if not key: bad.append('no key word')
        if cat in CATS: bad += problems(cat, p.get('slots'), near)
        row.update(ok=not bad, problems=bad); report.append(row)
        if bad: continue
        r = dict(p['slots'], cat=cat, name=f'{lead} {key}'.strip(), say=[lead, key])
        js.append(f'SENTENCE({json.dumps(sid)}, {json.dumps(r, ensure_ascii=False)});')
        ids.append(f'{sid}@{len(ids) % 3}')
    open(os.path.join(out, 'sentences.js'), 'w').write('/* category plans written by the AI for one clip (cat_ai.py check) */\n' + '\n'.join(js) + '\n')
    json.dump(report, open(os.path.join(out, 'report.json'), 'w'), ensure_ascii=False, indent=1)
    open(os.path.join(out, 'scenes.txt'), 'w').write(' '.join(ids) + '\n')
    camera_and_accent(answer, lines, out)
    ok = [r for r in report if r['ok'] and r['cat'] != 'none']
    print(f'{prefix}: {len(report)} lines, {len(ok)} pictures pass, {sum(r["cat"] == "none" for r in report)} need a category we do not have'
          + (f', {len(fixed)} from the fix round' if fix_answer else ''))
    for r in report:
        if not r['ok']: print('  ', r['id'], r['cat'], r['problems'])


def camera_and_accent(answer, lines, out):
    """zoom lines (strongest first) and accent words, checked: a line must exist, an accent word must be said on its line"""
    raw = json.loads(re.search(r'\{.*\}', open(answer).read(), re.S).group(0))
    zoom = [n for n in raw.get('zoom', []) if isinstance(n, int) and 0 < n <= len(lines)]
    acc, dropped = [], []
    for a in raw.get('accent', []):
        n, w = a.get('line'), a.get('word', '')
        if isinstance(n, int) and 0 < n <= len(lines) and w and glen(w) <= 12 and flat(w) in flat(lines[n - 1]): acc.append({'line': n, 'word': w})
        else: dropped.append(a)
    json.dump({'zoom': list(dict.fromkeys(zoom)), 'accent': acc}, open(os.path.join(out, 'camera.json'), 'w'), ensure_ascii=False)
    print(f'camera: {len(zoom)} zoom lines · {len(acc)} accent words' + (f' ({len(dropped)} dropped: {dropped})' if dropped else ''))


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
    if a[0] == 'ask': ask(a[1], float(a[2]), a[3])
    elif a[0] == 'check': check(a[1], a[2], a[3], a[4], a[5] if len(a) > 5 else None)
    elif a[0] == 'fix': fix(a[1], a[2])
    else: sys.exit(__doc__)
