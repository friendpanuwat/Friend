#!/usr/bin/env python3
"""Category plans written by the AI — prompt v4 (Friend 2026-11-08: "เริ่มงาน ก. สอน AI ให้เขียนใบประกอบตามหมวด แล้วลองกับ
บทพูดหลาย ๆ เรื่อง จะได้รู้ว่าหมวดไหนใช้บ่อยและยังขาดร่าง").

The planner reads a clip's caption lines and, for the lines that deserve a picture, writes ONE CATEGORY (B01–B16, what
kind of sentence it is) + that category's SLOTS (the ใบประกอบ: the few things in the picture). The program then picks the
variant (scenes/cats.js) and the style draws it, so the AI's instructions do not grow with the number of variants.
A line that deserves a picture but fits no category is written as cat "none" + what it needs: that is how we find
categories we do not have yet. Same model as the web plan (Sonnet 5.5, effort low); same fix round (Haiku 5.5).

usage:
  cat_ai.py ask   <captions.json> <duration_s> <ask_dir>             system.txt + user.txt (the request) + lines.json
  cat_ai.py check <ask_dir> <answer.json> <out_dir> <prefix> [<fix_answer.json>]
        → out_dir/sentences.js (SENTENCE calls, one per good picture), report.json, scenes.txt (ids for render_test.sh)
  cat_ai.py fix   <ask_dir> <out_dir>                                 the fix-round request for the pictures that failed
captions.json = [{"t0": s, "t1": s, "text": "…"}, …] (or {"captions": […]})
"""
import json, os, re, sys

UNI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, UNI)
from recipe_ai import ICONS, HARSH, CORE_ICONS_V2, glen, flat, read_pictures  # noqa: E402

SYSTEM = """You plan the pictures of a Thai talking-head short. Every picture is ONE CATEGORY (what kind of sentence the line is) + that category's SLOTS (the few things in the picture). Code picks how the picture looks and draws it in the customer's style, so you write NO code and choose NO colours, fonts, motion or layout.

# Your job
Read the caption lines (each: number, seconds, words). Pick the lines that carry an idea and give each of them one picture, about one picture every 4-6 seconds (this clip: about {n} pictures, at most {nmax}). Skip filler lines. Never two pictures on one line.
For each picture:
1. "shows": one short English sentence of what the viewer will see and why it says the same as the line, with the same yes or no, good or bad.
2. "cat": the category of what the line DOES (list below), and "slots": the slots of that category only.
3. "lead" and "key": the words on screen, taken from that line: "lead" = the words before the key (at most 22 letters), "key" = the key word or words (at most 12 letters).
If a line clearly deserves a picture but NO category fits what it does, do not force one: write {{"line":7,"cat":"none","need":"what the line does, in a few English words"}} for it instead. This is only for a line no category fits, never a way to skip a line.

# Categories (id — when — slots)
B01 big number — the line SAYS a number (an amount, a percent, a count, years, a price) and the number is the point.
  {{"value":"3,000","unit":"บาท","icon":…,"dir":"up"|"down"}}  value copied exactly as said (digits, comma, %); unit = the word said right after it (optional); icon optional (what the number is about); dir optional.
B02 more / less — something grows or shrinks, arrives or leaves, rises or falls.
  {{"dir":"up"|"down","item":THING,"center":THING,"n":2-4,"keep":0-3,"end":THING}}  item = what grows or leaves (one icon, drawn n times); center = optional owner (a shop, a wallet, a video); keep = how many stay when it goes down (0 only when the line says ALL of it is gone); end = optional sign at the end.
B03 compare / before → after — two things side by side, or one thing that changed.
  {{"mode":"versus"|"change","a":THING,"b":THING,"win":"a"|"b","how":"cross"|"check","switch":true|false}}  versus: a and b side by side, win = the better one, how = only cross the loser or only tick the winner (optional). change: a = before, b = after. Put "v" (0.1-1, long = more) in a and b when the line is about more or less of something. switch only when something is turned on (true) or off (false).
B04 steps / checklist — a sequence, or a list of things to do.
  {{"items":[THING,THING,THING],"mark":{{"at":0-2,"how":"light"|"check"|"cross"}}}}  three items in order, each with an icon (and a label if said); mark optional = the step that matters (light), is done (check) or is wrong (cross).
B05 right vs wrong, "not X but Y" — one thing is wrong, the other is right.
  {{"wrong":THING,"right":THING}}
B06 question / doubt — someone asks, wonders or hesitates.
  {{"about":THING,"options":[THING,THING],"answer":THING}}  about = who or what is in doubt; options only when the line names two choices; answer only when the line gives the answer.
B07 warning / problem — don't do this, watch out, a risk, a mistake.
  {{"thing":THING,"how":"cross"|"flag","sign":icon}}  thing = the risky thing; cross = do not do it; flag = be careful; sign optional (triangle-alert, octagon-alert, shield-alert, …).
B08 goal / result / success — reaching a goal, winning, the result you want.
  {{"goal":THING,"who":icon}}  goal = what is reached; who optional (who gets there).
B09 time / timeline / deadline — time passing, moments in order, how long something takes.
  {{"points":[THING,THING,THING],"at":0-2,"result":THING}}  points = three moments (as said, e.g. day 1, month 1, year 1), at = where it stops; result = what the time brought. Give points, or result, or both.
B10 people / target audience — who this is for, a kind of person, a crowd.
  {{"who":THING,"label":"words","tags":["words","words"]}}  who = the person icon (user, users, …); label = the kind of person, as said; tags optional (at most 2, as said).
B11 what someone says / chat / comment / review — a message, a question in a chat, a comment, a review.
  {{"kind":"chat"|"comment"|"review"|"message","quote":"words said","mood":"good"|"bad","react":icon,"gone":true}}  quote = the words of the message, as said (at most 12 letters); mood optional; react optional reaction icon; gone = no reply, they disappeared.
B12 cause → effect — one thing leads to the next, step by step.
  {{"items":[THING,THING,THING],"end":THING}}  three links of the chain in order; end optional sign of the result.
B13 tip / secret — a tip, a trick, a hidden key point.
  {{"secret":THING}}  the tip itself.
B14 punchline — a short line to remember, the main message.
  {{"idea":THING}}  the heart of the line.
B15 call to action / ending — follow, comment, save, share, like.
  {{"action":"follow"|"comment"|"save"|"share"|"like","label":"words said"}}  label optional.
B16 definition — what something is, "X is Y".
  {{"term":THING,"means":[THING]}}  term with a label (the word defined); means = 1-3 things it is.
THING = {{"icon": icon name, "label": optional words, "tone": optional "acc"|"soft"|"neg", "shape": optional "round"}}. acc = the one highlight (positive), soft = faded or inactive, neg = red, only for a negative meaning. Leave out every optional slot the line does not give.

# Rules
- Pick the category by what the line DOES, not by its topic: a number said and the point → B01; "not X but Y" → B05; a warning → B07; "X is Y" → B16; a short line to remember → B14.
- The picture must say what the line says, so a viewer gets it with the sound off. A tick means yes / good, a cross means no / wrong: never tick what the speaker warns against.
- Every word on screen (lead, key, labels, quote, tags, unit) is COPIED from that line (or the next one when the sentence runs on): you may leave words out at the start or the end, but never reorder, rephrase, shorten or add a word. Spaces may differ. Count every letter, spaces and Latin letters included: key, labels, quote and tags at most 12, lead at most 22. Numbers only if said.
- Icons: only names from the icon list below (Lucide). Never use these icons (harsh or off-brand): {harsh}. For harm or danger use triangle-alert, shield-alert, heart-crack, battery-low or thumbs-down.
- Vary the categories when the lines allow it; never use B14 for a line another category fits.

# Icons
{icons}

# Answer
Only JSON, no other text:
{{"pictures":[{{"line":7,"shows":"…","cat":"B03","slots":{{…}},"lead":"…","key":"…"}}, {{"line":12,"cat":"none","need":"…"}}]}}
"""
# Prompt v5 (Friend 2026-11-08: the editorial skill as a clearer manual, "ทำให้คู่มือละเอียดขึ้นโดยที่ไม่ต้องยาวขึ้น"): ordered steps,
# the speaker's stance before the picture, the categories the AI mixes up. Under test: $CUTPACK_CAT_PROMPT=v5, default v4.
SYSTEM_V5 = """You plan the pictures of a Thai talking-head short. Each picture is ONE CATEGORY (what the line does) + its SLOTS (the few things in it). Code draws it in the customer's style (no code, colours or layout from you).

# Work in this order
1. Lines (number, seconds, words): about one picture every 4-6 seconds (this clip: about {n} pictures, at most {nmax}), never two on one line. First: numbers said, turns (after แต่ / ไม่ใช่ / ไม่มีทาง / อย่า), the main claim, the punch line, things you can show. Never filler (เอ่อ อ่ะ นะครับ ใช่ป่ะ).
2. Stance. Is the speaker FOR the thing the line names, or AGAINST it (warning, mocking, not enough)? AGAINST words: ไม่ ไม่มี ไม่ต้อง อย่า แค่ เลิก ผิด พลาด เสี่ยง เจ๊ง ขาดทุน. FOR: the thing gets the highlight (tone acc), a tick, goes up. AGAINST: it is crossed, goes down or fades (tone soft, or neg for harm). Never tick, raise or acc what the speaker is against: "ถ้าคุณแค่คิดว่ามันเป็นรายได้เสริม" is AGAINST รายได้เสริม.
3. "shows": one short English sentence of what the viewer sees, with the line's stance (same meaning, sound off).
4. "cat": what the line DOES (list below); "slots": that category's only. If a line deserves a picture but no category fits, do not force one: {{"line":7,"cat":"none","need":"what the line does, in a few English words"}} (never a way to skip a line).
5. "lead" and "key": the words on screen, from that line. lead = the words before the key. key = the word that carries the line: the number, the thing or the verb of change; never a particle (ครับ ค่ะ นะ อ่ะ เว้ย), a pronoun (ผม คุณ ยู มัน) or half of a word said (รายได้เสริม, not เสริม).

# Categories (id — when — slots)
B01 big number — the line SAYS a number (an amount, a percent, a count, years, a price) and the number is the point. No number said → not B01.
  {{"value":"3,000","unit":"บาท","icon":…,"dir":"up"|"down"}}  value copied exactly as said (digits, comma, %); unit = the word said right after it (optional); icon optional (what the number is about); dir optional.
B02 more / less — something grows or shrinks, arrives or leaves, rises or falls.
  {{"dir":"up"|"down","item":THING,"center":THING,"n":2-4,"keep":0-3,"end":THING}}  item = what grows or leaves (one icon, drawn n times); center = optional owner (a shop, a wallet, a video); keep = how many stay when it goes down (0 only when the line says ALL of it is gone); end = optional sign at the end.
B03 compare / before → after — two things side by side, or one thing that changed.
  {{"mode":"versus"|"change","a":THING,"b":THING,"win":"a"|"b","how":"cross"|"check","switch":true|false}}  versus: a and b side by side, win = the better one, how = only cross the loser or only tick the winner (optional). change: a = before, b = after. Put "v" (0.1-1, long = more) in a and b when the line is about more or less of something. switch only when something is turned on (true) or off (false).
B04 steps / checklist — a sequence, or a list of things to do.
  {{"items":[THING,THING,THING],"mark":{{"at":0-2,"how":"light"|"check"|"cross"}}}}  three items in order, each with an icon (and a label if said); mark optional = the step that matters (light), is done (check) or is wrong (cross).
B05 right vs wrong, "not X but Y" — one thing is wrong, the other is right (both said).
  {{"wrong":THING,"right":THING}}
B06 question / doubt — someone asks, wonders or hesitates.
  {{"about":THING,"options":[THING,THING],"answer":THING}}  about = who or what is in doubt; options only when the line names two choices; answer only when the line gives the answer.
B07 warning / problem — don't do this, watch out, a risk, a mistake.
  {{"thing":THING,"how":"cross"|"flag","sign":icon}}  thing = the risky thing; cross = do not do it; flag = be careful; sign optional (triangle-alert, octagon-alert, shield-alert, …).
B08 goal / result / success — reaching a goal, winning, the result the speaker WANTS.
  {{"goal":THING,"who":icon}}  goal = what is reached; who optional (who gets there).
B09 time / timeline / deadline — an amount of time, a date, a deadline, moments in order. ตอนที่ / เมื่อ / แล้ว alone are not time.
  {{"points":[THING,THING,THING],"at":0-2,"result":THING}}  points = three moments (as said, e.g. day 1, month 1, year 1), at = where it stops; result = what the time brought. Give points, or result, or both.
B10 people / target audience — who this is for, a kind of person, a crowd.
  {{"who":THING,"label":"words","tags":["words","words"]}}  who = the person icon (user, users, …); label = the kind of person, as said; tags optional (at most 2, as said).
B11 what someone says / chat / comment / review — a message, a question in a chat, a comment, a review.
  {{"kind":"chat"|"comment"|"review"|"message","quote":"words said","mood":"good"|"bad","react":icon,"gone":true}}  quote = the words of the message, as said (at most 12 letters); mood optional; react optional reaction icon; gone = no reply, they disappeared.
B12 cause → effect — one thing leads to the next (ทำให้, เลย, จึง, เพราะ).
  {{"items":[THING,THING,THING],"end":THING}}  three links of the chain in order; end optional sign of the result.
B13 tip / secret — a tip, a trick, a hidden key point.
  {{"secret":THING}}  the tip itself.
B14 punchline — a line to remember, nothing else to show; never when another category fits.
  {{"idea":THING}}  the heart of the line.
B15 call to action / ending — follow, comment, save, share, like.
  {{"action":"follow"|"comment"|"save"|"share"|"like","label":"words said"}}  label optional.
B16 definition — what something is, "X is Y".
  {{"term":THING,"means":[THING]}}  term with a label (the word defined); means = 1-3 things it is.
THING = {{"icon": icon name, "label": optional words, "tone": optional "acc"|"soft"|"neg", "shape": optional "round"}}. acc = the one highlight, soft = faded, neg = red (harm only). Leave out every optional slot the line does not give.

# Rules
- Every word on screen (lead, key, labels, quote, tags, unit) is COPIED from that line (or the next one when the sentence runs on): you may leave words out at the start or the end, but never reorder, rephrase, shorten or add a word. Spaces may differ. Count every letter, spaces and Latin letters included: key, labels, quote and tags at most 12, lead at most 22. Numbers only if said.
- Icons: only names from the icon list below (Lucide). Never use these icons (harsh or off-brand): {harsh}. For harm or danger use triangle-alert, shield-alert, heart-crack, battery-low or thumbs-down.
- Vary the categories.

# Icons
{icons}

# Answer
Only JSON, no other text:
{{"pictures":[{{"line":7,"shows":"…","cat":"B03","slots":{{…}},"lead":"…","key":"…"}}, {{"line":12,"cat":"none","need":"…"}}]}}
"""
FIX = '''

# Fix round
The pictures below broke the rules. Write them again — only these, in the same JSON form ({"pictures":[…]}), each on the same line.
You may change the category. All the rules above still hold.
'''

CATS = {f'B{i:02d}' for i in range(1, 17)}
TONES = {None, 'main', 'acc', 'soft', 'neg'}
SLOTS = {'B01': {'value', 'unit', 'icon', 'dir', 'money'}, 'B02': {'dir', 'item', 'center', 'n', 'keep', 'end'},
         'B03': {'mode', 'a', 'b', 'win', 'how', 'switch'}, 'B04': {'items', 'mark'}, 'B05': {'wrong', 'right'},
         'B06': {'about', 'options', 'answer'}, 'B07': {'thing', 'how', 'sign'}, 'B08': {'goal', 'who'},
         'B09': {'points', 'at', 'result'}, 'B10': {'who', 'label', 'tags'}, 'B11': {'kind', 'quote', 'mood', 'react', 'gone', 'app'},
         'B12': {'items', 'end'}, 'B13': {'secret'}, 'B14': {'idea'}, 'B15': {'action', 'label'}, 'B16': {'term', 'means'}}


def ask(captions, duration, out):
    caps = json.load(open(captions))
    caps = caps['captions'] if isinstance(caps, dict) else caps
    os.makedirs(out, exist_ok=True)
    n = max(3, round(duration / 5)); nmax = round(duration / 4)
    text = (SYSTEM_V5 if os.environ.get('CUTPACK_CAT_PROMPT') == 'v5' else SYSTEM).format(n=n, nmax=nmax, harsh=', '.join(sorted(HARSH)), icons=CORE_ICONS_V2)
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
               'lead': p.get('lead', ''), 'key': p.get('key', ''), 'slots': p.get('slots'), 'fixed': n in fixed, 'picture': p}
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
    ok = [r for r in report if r['ok'] and r['cat'] != 'none']
    print(f'{prefix}: {len(report)} lines, {len(ok)} pictures pass, {sum(r["cat"] == "none" for r in report)} need a category we do not have'
          + (f', {len(fixed)} from the fix round' if fix_answer else ''))
    for r in report:
        if not r['ok']: print('  ', r['id'], r['cat'], r['problems'])


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
