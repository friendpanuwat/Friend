#!/usr/bin/env python3
"""Build the plan-D request: the AI picks library parts for one clip and answers with JSON (DECISIONS 2, PLAN.md).

usage: prompt.py <input.json> <editorial|overlay> [--show]    → prints the request (what would be sent) as JSON
The request has two parts:
  system  (cached, the same for every clip of a style): prompt/system.md + the library of that style (parts, slots,
          categories, icons) + one worked example. Its text is built only from files in the repo, in a fixed order,
          so it stays byte-identical between clips and the prompt cache keeps hitting.
  user    (per clip): length, room for widgets, the transcript as caption lines with word times, parts to avoid.
The answer is forced into ANSWER schema (structured outputs): {"topic", "camera": [...], "scenes": [...]}; assemble.py turns
it into a full plan. Model and effort follow DECISIONS ("วางแผนฉากด้วย Sonnet 5.5 effort low").

Input file (one clip, made by the transcription and caption steps; example: examples/test18_input.json):
  {"clip": {"file", "duration", "customer"}, "words": [{"w", "t0", "t1"}], "captions": [{"t0", "t1", "text" with / chunks}],
   "layout": faces.json "layout", "history": {"clips": [{"parts": [...]}]}}
"""
import glob, json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import room   # noqa: E402  (per-moment widget room, Friend 2026-11-05)
STYLES = os.path.join(HERE, '..', 'styles', 'editorial')
MODEL, EFFORT = 'claude-sonnet-5-5', 'low'
# Friend 2026-11-05, after the real-key tests: Sonnet plans and Haiku does the fix round, both answering without thinking
# first (rounds 6–7: about 1.1–1.8 baht a clip with a warm cache, 2.4–3.3 without, against 3.8–5.8 for Sonnet thinking)
THINKING, FIX_MODEL = 'off', 'claude-haiku-5-5'
KIND = {'editorial': 'card', 'overlay': 'widget'}
# Ways to plan better without thinking, under test (Friend 2026-11-06). Off unless named in `ways` or $CUTPACK_PLAN_WAYS
# (comma list), so the default request stays byte-identical. See cost-test/subagent-test/README.md.
#   reason    each scene also writes `job` (its category) and `pick` (the part's name) before `part` (the id)
#   describe  every library part says what its picture means and what it would mislead on (prompt/part_notes.json)
#   example   the worked example is a whole 80 s clip of each style instead of the 18 s one
#   loose     the AI is told code fixes lengths, hit times and gaps, so the meaning of each picture comes first
#   count     this clip's density rules as numbers (the targets taken out on 2026-11-05, now without "count and check")
#   hero      (Friend 2026-11-07, "แบบ D") the 6–8 sentences that carry the clip become AI-written scenes built in beats,
#             with the skill's UI pieces (prompt/kit_hero.md); overlay ones draw their whole card. Not part of 'all'.
WAYS = ('reason', 'describe', 'example', 'loose', 'count', 'hero')


# Manual v2 (Friend 2026-11-08: "เขียนไฟล์สกิลให้ละเอียดกว่านี้" and "ทำให้คู่มือละเอียดขึ้นโดยที่ไม่ต้องยาวขึ้น ... ลดความคลุมเครือ"):
# the editorial skill rewritten as an ordered manual with exact rules for the system's model (prompt/v2/editorial.md,
# prompt/v2/kit_editorial.md; it has the designed scenes of way 'hero' built in). Under test: off unless
# $CUTPACK_MANUAL=v2, and editorial only, so every other request stays byte-identical.
MANUALS = ('v2',)


def manual_of(style, manual=None):
    """'v2' when the new manual is asked for and the style has one, else ''."""
    if manual is None: manual = os.environ.get('CUTPACK_MANUAL', '')
    if manual and manual not in MANUALS: raise ValueError(f'unknown manual: {manual} (known: {", ".join(MANUALS)})')
    return manual if style == 'editorial' else ''


def ways_of(ways=None):
    """The ways asked for: the argument, else $CUTPACK_PLAN_WAYS ('all' = every way). Unknown names stop the run."""
    if ways is None: ways = os.environ.get('CUTPACK_PLAN_WAYS', '')
    if isinstance(ways, str): ways = [w.strip() for w in ways.split(',') if w.strip()]
    ways = (set(WAYS) - {'hero'}) | set(ways) - {'all'} if 'all' in ways else set(ways)
    bad = ways - set(WAYS)
    if bad: raise ValueError(f'unknown plan ways: {sorted(bad)} (known: {", ".join(WAYS)}, all)')
    return frozenset(ways)


def read(*path):
    with open(os.path.join(HERE, *path)) as f: return f.read()


def core_icons(cat):
    """[(theme, [names])] from prompt/icons_core.txt, keeping only names the catalog has (Friend 2026-11-05: the full
    list of 1,539 names was about 40% of the cached prompt; about 300 by theme also helps the AI pick an icon that means
    the words). The checker still accepts every name in catalog.json."""
    have, out = set(cat['icons']), []
    for line in read('prompt', 'icons_core.txt').splitlines():
        if not line.strip() or line.startswith('#'): continue
        theme, names = line.split(':', 1)
        out.append((theme.strip(), [n for n in names.split() if n in have]))
    return out


def icons_text(cat):
    rows = core_icons(cat)
    return '\n'.join([f"# Icons ({sum(len(n) for _, n in rows)} names by theme; pick the one that means the words, use only these)"]
                     + [f"{t}: {' '.join(n)}" for t, n in rows])


def load_catalog():
    return json.loads(read('catalog.json'))


def slot_notes():
    """{cat: {slot: comment}} from the `// comments` in each category's *_SLOTS block in parts/*.js (one source of truth)."""
    notes = {}
    for f in sorted(glob.glob(os.path.join(STYLES, 'parts', 'B*.js'))):
        with open(f) as fh: src = fh.read()
        m = re.search(r'const (B\d\d)_SLOTS = \{\n(.*?)\n\};', src, re.S)
        if not m: continue
        cat = notes.setdefault(m.group(1), {})
        for line in m.group(2).split('\n'):
            names = re.findall(r'(\w+):\s*\{type:', line)
            com = line.split('//', 1)[1].strip() if '//' in line else ''
            for n in names: cat[n] = com
    return notes


def item_sig(item):
    """A list item's type: 'number', or an object such as {t: text, v: number, in: bool} ('?' = may be left out)."""
    if isinstance(item, dict): return '{' + ', '.join(f"{k}:{t}" for k, t in item.items()) + '}'
    return item


def slot_sig(name, spec, note=''):
    t = spec['type']
    note = note or spec.get('note', '')
    s = f"{name}:{t}" + ('!' if spec.get('req') else '')
    if spec.get('max') and t == 'text': s += f"≤{spec['max']}"
    if t == 'list' and spec.get('item'): s += f"<{item_sig(spec['item'])}>"
    if t == 'list' and (spec.get('min') or spec.get('max')): s += f"[{spec.get('min', 0)}–{spec.get('max', '')}]"
    if t == 'choice': s += '(' + '|'.join(repr(x) if x == '' else x for x in spec['of']) + ')'
    if spec.get('index'): s += f" (index into {spec['index']})"
    if spec.get('same'): s += f" (one per {spec['same']})"
    return s + (f" — {note}" if note else '')


def part_row(p, style, notes=None):
    row = f"- {p['id']} · {p['name']} · hit: {p['hit']} · {p['dur'][0]}–{p['dur'][1]} s"
    if style == 'editorial': row += ' · ' + '/'.join(p['bgs'])
    if p.get('pack'): row += f" · topic {p['pack']}"
    if p.get('use'): row += f" · only for: {p['use']}"
    n = (notes or {}).get(p['id'])
    if n:   # way 'describe'
        row += f" · shows: {n['shows']}" + (f" · not for: {n['not']}" if n.get('not') else '')
    return row


def part_notes():
    return {k: v for k, v in json.loads(read('prompt', 'part_notes.json')).items() if not k.startswith('_')}


def library_text(style, cat, ways=frozenset()):
    """The library of one style, grouped by category: what the category is for, its slots, then each variant (base
    parts, then the topic packs' versions of the same category); then each topic pack with its own hero parts."""
    cats = json.loads(read('prompt', 'categories.json'))['categories']
    notes, parts = slot_notes(), cat['cards' if style == 'editorial' else 'widgets']
    wtext = {'wlead': {'type': 'text', 'max': 16}, 'wkey': {'type': 'text', 'max': 12}}
    out = [f"# Library ({'full-screen cards' if style == 'editorial' else 'overlay widgets'}, {len(parts)} parts)",
           "Each category: what sentence it is for, its slots (`!` required, `≤N` letter limit, `<…>` the type of a list's items), then its parts:",
           "  id · name · what happens on the hit · length range in seconds" + (" · backgrounds" if style == 'editorial' else '')
           + " · topic (a topic pack's part: use it only in a clip of that topic)"
           + (" · shows: what its picture means (match it to your `shows`) · not for: sentences it would mislead on" if 'describe' in ways else ''), '']
    pn = part_notes() if 'describe' in ways else None
    for c in cats:
        ps = [p for p in parts if p['id'].startswith(c['id'] + '.')]
        if not ps: continue
        out.append(f"## {c['id']} {c['name']} — {c['when']}")
        slots = dict(ps[0]['slots'])
        if style == 'overlay': slots.update(wtext)
        out.append('slots: ' + ' · '.join(slot_sig(k, v, notes.get(c['id'], {}).get(k, '')) for k, v in slots.items()))
        out += [part_row(p, style, pn) for p in sorted(ps, key=lambda p: (bool(p.get('pack')), p.get('pack') or '', p['id']))]
        out.append('')
    packs = cat.get('packs') or {}
    if packs:
        out.append(f"# Topic packs ({len(packs)} topics)")
        out.append("A clip about one of these topics may use that topic's parts: its versions of the categories above "
                   "(marked `topic`) and the hero parts below, which show sentences only that topic has. Each hero part: "
                   "what sentence it is for, its slots, then the part.")
        out.append('')
        for pid, pk in packs.items():
            out.append(f"## topic {pid} ({pk['name']}) — {pk['when']}")
            for p in [p for p in parts if p.get('pack') == pid and not re.match(r'B\d\d\.', p['id'])]:
                slots = dict(p['slots'])
                if style == 'overlay': slots.update(wtext)
                out.append(f"### {p['id']} — for {p['when']}")
                out.append('slots: ' + ' · '.join(slot_sig(k, v) for k, v in slots.items()))
                out.append(part_row(p, style, pn))
            out.append('')
    out.append(icons_text(cat))
    return '\n'.join(out)


def token_times(inp):
    """[(caption, [(token, start s)])]: caption tokens matched in order to the words; spread evenly if they do not match."""
    words, k, res = inp.get('words', []), 0, []
    for c in inp['captions']:
        toks = c['text'].replace('/', ' / ').split()
        plain = [x for x in toks if x != '/']
        ws = words[k:k + len(plain)]
        if len(ws) == len(plain) and all(w['w'].replace(' ', '') == x for w, x in zip(ws, plain)):
            ts = [w['t0'] for w in ws]; k += len(plain)
        else:
            ts = [round(c['t0'] + (c['t1'] - c['t0']) * i / max(1, len(plain)), 2) for i in range(len(plain))]
        it = iter(ts)
        res.append((c, [(x, None if x == '/' else next(it)) for x in toks]))
    return res


def caption_lines(inp):
    rows = []
    for c, toks in token_times(inp):
        rows.append(f"{c['t0']:.2f}–{c['t1']:.2f} | " + ' '.join('/' if t is None else f'{x}@{t:.2f}' for x, t in toks))
    return '\n'.join(rows)


def room_text(track, d, sub_top, face_box, shortest=1.2):
    """The room ranges (whatever the size) long enough for a widget, with the sizes that fit somewhere in each."""
    out = []
    for w in room.windows(track, d, sub_top, face_box):
        if out and w['t0'] <= out[-1]['t1'] + 1e-6: out[-1]['t1'] = w['t1']; out[-1]['sizes'] |= set(w['sizes'])
        else: out.append({'t0': w['t0'], 't1': w['t1'], 'sizes': set(w['sizes'])})
    return ' · '.join(f"{w['t0']:.1f}–{w['t1']:.1f} s ({', '.join(x for x in ('short', 'narrow') if x in w['sizes'])})"
                      for w in out if w['t1'] - w['t0'] >= shortest)


def targets(inp, style):
    """Way 'count': this clip's density rules as numbers. Taken out on 2026-11-05 (Friend: with thinking on, the AI
    thought for 11–12k tokens to meet them, twice the cost); back as a test option now that planning runs without
    thinking, without the old "count and check each before you answer". Overlay counts only the time with room."""
    import math
    from validate import RULES
    d, lay = inp['clip']['duration'], inp.get('layout', {})
    hit = RULES['hitIn']['card' if style == 'editorial' else 'widget']
    if style == 'editorial':
        lo, hi = RULES['cardShare']
        rows = [f"- at least {math.floor(d / RULES['cardEvery'])} cards, together {lo * d:.0f}–{hi * d:.0f} s of the {d:.0f} s",
                f"- the face alone never longer than {RULES['arollMax']} s anywhere: from {RULES['firstAt']} s to the end, the last seconds included",
                f"- the first card at {RULES['firstAt']} s or later"]
    else:
        span, where = d, 'over the whole clip'
        if inp.get('track'):
            top = lay.get('subtitleTop', 1300)
            if not room.tight(inp['track'], d, top, inp['faceBox']):
                span = sum(b - a for a, b in room.merged(room.windows(inp['track'], d, top, inp['faceBox'])))
                where = 'inside the times with room'
        if math.floor(span / RULES['widgetEvery']) < 1: return []
        rows = [f"- at least {math.floor(span / RULES['widgetEvery'])} widgets, spread {where}",
                f"- never more than {RULES['bareMax']} s without a widget {where}, from the start to the end",
                f"- at least {RULES['widgetGap']} s between one widget's t1 and the next one's t0"]
    rows += ["- every scene's length (t1 − t0) inside its part's range in the library",
             f"- each hit at least {hit} s after its t0 and at least {RULES['hitOut']} s before its t1"]
    return ['', 'Targets for this clip (the checker rejects a plan that misses one):'] + rows


def clip_text(inp, style, ways=frozenset()):
    d = inp['clip']['duration']
    lay = inp.get('layout', {})
    out = [f"Style: {style}", f"Clip length: {d:.2f} s"]
    if style == 'overlay' and inp.get('track'):   # per moment (room.py, Friend 2026-11-05)
        top = lay.get('subtitleTop', 1300)
        rows = room_text(inp['track'], d, top, inp['faceBox'])
        if room.tight(inp['track'], d, top, inp['faceBox']):
            out.append('The face leaves little room for widgets in this clip, so at the times without room the speaker shrinks '
                       'for the widget (code does it): plan widgets over the whole clip as usual. Times with room above, at or '
                       'beside the head: ' + (rows or 'none'))
        else:
            out.append('Times with room for a widget (plan widgets only inside them; code places each one): '
                       + (rows or 'none — the face fills the frame the whole clip, plan no widgets'))
    elif style == 'overlay':
        sizes = [s for s in ('short', 'narrow') if lay.get(f'{s}Fits', True)]
        out.append('Widget sizes with room in this clip: ' + (', '.join(sizes) if sizes else 'none (plan no widgets)'))
    if 'count' in ways: out += targets(inp, style)
    past = (inp.get('history') or {}).get('clips', [])[-10:][::-1]
    if past:
        out.append('Parts used in this customer\'s last clips (newest first):')
        out += [f"- {i + 1}: " + ', '.join(c.get('parts', [])) for i, c in enumerate(past)]
    out += ['', 'Transcript (caption lines; word@start second; / = subtitle chunk):', caption_lines(inp)]
    return '\n'.join(out)


def example_text(style, ways=frozenset(), cat=None):
    """The worked example: the 18 s test clip, or with way 'example' a whole 80 s clip (fitness, the speaker's face
    leaves room for widgets the whole time). With way 'reason' each scene also shows its `job` and `pick`."""
    name = 'long114' if 'example' in ways else 'test18'
    inp = json.loads(read('examples', f'{name}_input.json'))
    ans = json.loads(read('examples', f'{name}_{style}.answer.json'))
    names = {p['id']: p['name'] for p in (cat or load_catalog())['cards' if style == 'editorial' else 'widgets']}
    scenes = []
    for sc in ans['scenes']:
        sc = {k: v for k, v in sc.items() if k not in ('job', 'pick')}
        if 'reason' in ways:   # the fields in schema order: ... shows, job, pick, part ...
            keys = list(sc)
            at = keys.index('part')
            extra = {'job': sc['part'].split('.')[0] if sc['part'] != 'custom' else 'custom', 'pick': names.get(sc['part'], sc.get('need', ''))}
            sc = dict([(k, sc[k]) for k in keys[:at]] + list(extra.items()) + [(k, sc[k]) for k in keys[at:]])
        scenes.append(sc)
    ans = slots_to_list(dict(ans, scenes=scenes))
    head = '# Example (format only; plan each clip afresh)' if name == 'test18' else \
        '# Example: a whole clip (format and how dense a full clip is; plan each clip afresh, never reuse its scenes)'
    return (head + '\n## Input\n' + clip_text(inp, style, ways - {'count'} if name == 'test18' else ways)
            + '\n## Answer\n' + json.dumps(ans, ensure_ascii=False, separators=(',', ':')))


JSON_TYPE = {'text': 'string', 'number': 'number', 'bool': 'boolean'}


def item_schema(item):
    """The JSON schema of one list item from a slot's `item` ('number', or {field: 'text' | 'number' | 'bool', '?' = optional})."""
    if not isinstance(item, dict): return {'type': JSON_TYPE[item]}
    props = {k: {'type': JSON_TYPE[t.rstrip('?')]} for k, t in item.items()}
    return {'type': 'object', 'properties': props, 'required': [k for k, t in item.items() if not t.endswith('?')], 'additionalProperties': False}


def slot_schema(k, spec):
    """The JSON schema of one slot's value."""
    t = spec['type']
    if t == 'list':
        if spec.get('item'): item = item_schema(spec['item'])
        else:
            item = {'type': 'number'} if k == 'at' else (
                {'type': 'object', 'properties': {'t': {'type': 'string'}, 'a': {'type': 'boolean'}, 'b': {'type': 'boolean'}},
                 'required': ['t', 'a', 'b'], 'additionalProperties': False} if k == 'rows' else {'type': 'string'})
        return {'type': 'array', 'items': item}
    if t == 'number': return {'type': 'number'}   # an index is a whole number; the checker rejects anything else
    return {'type': 'string'}                      # text, icon and choice; the checker holds a choice to its list


def answer_schema(style, cat, ways=frozenset()):
    """JSON schema for the answer. `slots` is a list of {name, value} pairs (slots_to_dict turns it back into an object):
    an object with one optional property per slot name had 78–80 optional properties, and the API compiles at most 24
    (real-key test 2026-11-05: every plan request was refused with 400 and asked again without the schema)."""
    parts = cat['cards' if style == 'editorial' else 'widgets']
    names, values = set(), []
    for p in parts:
        for k, spec in p['slots'].items():
            names.add(k)
            sch = slot_schema(k, spec)
            if sch not in values: values.append(sch)
    if style == 'overlay': names |= {'wlead', 'wkey'}
    slot = {'type': 'object', 'additionalProperties': False, 'required': ['name', 'value'],
            'properties': {'name': {'type': 'string', 'enum': sorted(names)},
                           'value': values[0] if len(values) == 1 else {'anyOf': values}}}
    # say and shows come before the part: the AI writes what the picture must mean, then picks it (Friend 2026-11-05: the
    # pictures did not match the words; "ข." = write what each scene shows before choosing)
    scene = {'t0': {'type': 'number'}, 't1': {'type': 'number'}, 'say': {'type': 'string'}, 'shows': {'type': 'string'}}
    if 'reason' in ways:   # the category, then the part's name, then its id: the AI says which picture before the code
        jobs = sorted({p['id'].split('.')[0] for p in parts}) + ['custom']
        scene.update(job={'type': 'string', 'enum': jobs}, pick={'type': 'string'})
    scene['part'] = {'type': 'string', 'enum': [p['id'] for p in parts] + ['custom']}
    scene.update({'bg': {'type': 'string', 'enum': ['glow', 'white', 'cream']}} if style == 'editorial' else {'size': {'type': 'string', 'enum': ['short', 'narrow']}})
    scene.update(hit={'type': 'number'}, need={'type': 'string'}, slots={'type': 'array', 'items': slot})
    cam = {'type': 'object', 'properties': {'move': {'type': 'string', 'enum': ['push', 'pull']}, 't': {'type': 'number'},
                                            'z': {'type': 'number'}, 'cut': {'type': 'boolean'}},
           'required': ['move', 't'], 'additionalProperties': False}
    topics = sorted(cat.get('packs') or {}) + ['none']   # asked first, so the clip's topic is decided before its scenes
    return {'type': 'object', 'additionalProperties': False, 'required': ['topic', 'camera', 'scenes'],
            'properties': {'topic': {'type': 'string', 'enum': topics},
                           'camera': {'type': 'array', 'items': cam},
                           'scenes': {'type': 'array', 'items': {'type': 'object', 'properties': scene, 'required': list(scene),
                                                                 'additionalProperties': False}}}}


def slots_to_list(answer):
    """An answer with slot objects → the form the schema asks for (the example in the prompt is written this way)."""
    out = dict(answer, scenes=[dict(s, slots=[{'name': k, 'value': v} for k, v in s.get('slots', {}).items()])
                               if isinstance(s.get('slots'), dict) else s for s in answer.get('scenes', [])])
    return out


def slots_to_dict(answer):
    """The API's answer → the plan form the rest of the engine reads: each scene's slots as one object. Answers that
    already hold objects (saved replays, tests) pass unchanged; a repeated name keeps its first value."""
    if not isinstance(answer, dict) or not isinstance(answer.get('scenes'), list): return answer
    for s in answer['scenes']:
        if isinstance(s, dict) and isinstance(s.get('slots'), list):
            d = {}
            for e in s['slots']:
                if isinstance(e, dict) and isinstance(e.get('name'), str) and e['name'] not in d: d[e['name']] = e.get('value')
            s['slots'] = d
    return answer


def code_schema():
    return {'type': 'object', 'additionalProperties': False, 'required': ['scenes'],
            'properties': {'scenes': {'type': 'array', 'items': {'type': 'object', 'additionalProperties': False, 'required': ['i', 'code'],
                                                                 'properties': {'i': {'type': 'integer'}, 'code': {'type': 'string'}}}}}}


def code_system_text(cat, ways=frozenset(), style=None):
    """Cached block of the scene-code call: the kit guide and the icon names (the same for every clip)."""
    kit = ('v2', f'kit_{style}.md') if style and manual_of(style) else ('kit_hero.md' if 'hero' in ways else 'kit.md',)
    return read('prompt', *kit).strip() + '\n\n' + icons_text(cat)


def code_request(inp, style, answer, cat=None, ways=None):
    """The second call (DECISIONS 2, step 5), only when the plan has custom scenes: write their code."""
    cat, ways = cat or load_catalog(), ways_of(ways)
    hero = 'hero' in ways
    kind = KIND[style]
    rows = ['Write the code of these scenes. Answer {"scenes": [{"i": scene number, "code": function body}]}.', '']
    for i, s in enumerate(answer['scenes']):
        if s.get('part') != 'custom': continue
        words = [w for w in inp.get('words', []) if s['t0'] - .3 <= w['t0'] < s['t1']]
        sl = s.get('slots') or {}
        size = cat['widgetSizes'].get(s.get('size'), {})
        wdesc = (f" · widget {s.get('size')}, the whole card W = {size.get('W')}, H = {size.get('H')}" if hero else
                 f" · widget {s.get('size')}, S = {150 if s.get('size') == 'short' else 180}")
        rows += [f"## scene {i} · {kind}" + (f" · background {s.get('bg')}" if kind == 'card' else wdesc),
                 f"t0 {s['t0']} · hit {s['hit']} · t1 {s['t1']}",
                 f"show: {s.get('need', '')}",
                 'words said: ' + ' '.join(f"{w['w']}@{w['t0']:.2f}" for w in words),
                 ('words the scene shows (draw them yourself, ≤ 3 words): ' + (' / '.join(x for x in (sl.get('wlead'), sl.get('wkey')) if x) or 'your choice from the words said')
                  if hero and kind == 'widget' else
                  'text code adds under it: ' + (' / '.join(x for x in (sl.get('lead') or sl.get('wlead'), sl.get('key') or sl.get('wkey')) if x) or 'none')), '']
    return {
        'model': MODEL, 'max_tokens': 16000,
        'betas': ['server-side-fallback-2026-07-01'], 'fallbacks': 'default',
        'output_config': {'effort': EFFORT, 'format': {'type': 'json_schema', 'schema': code_schema()}},
        'system': [{'type': 'text', 'text': code_system_text(cat, ways, style), 'cache_control': {'type': 'ephemeral'}}],
        'messages': [{'role': 'user', 'content': '\n'.join(rows)}],
    }


WAY_RULES = {   # added after the `shows` rule of system.md, in this order
    'reason': "- Before `part`, write `job`: the category id whose sentence job this is (B01 a number … B15 the call to "
              "action, BIZ / FIN / FIT / EDU for a topic's hero parts, or custom), then `pick`: the name of the part, as the "
              "library names it, whose picture is your `shows`. `part` is then that part's id. If no part of that job has "
              "the picture, change `job`, or use B14.",
    'describe': "- Every library part says `shows:` what its picture means and `not for:` the sentences it would mislead "
                "on. Choose the part whose `shows` means the same as yours, never one whose `not for` fits the sentence.",
    'hero': "- Choose the 6–8 sentences that carry this clip (the hook, the main claim, each turn, the punch line) and make "
            "each one `part: \"custom\"`: a scene designed for this sentence alone. In `need`, write it as a short story "
            "in 2–4 beats tied to the words said, in the form \"at '<word>' <what appears>; at '<word>' <what changes>; at "
            "'<key word>' <the hit>\": the objects of the sentence (product, price tag, cart, chat, wallet, checklist…), what "
            "appears or changes on which word, and the hit. Plan every other scene from the library as usual. Never reuse "
            "a scene from an example or an earlier clip: design each from this clip's words.",
    'loose': "- Code moves each scene's t0, t1 and hit onto the word times, fits its length into the part's range and "
             "opens the gaps between widgets, so rough seconds are fine. Put your care into the meaning: which sentences "
             "get a scene, and a picture that means the words.",
}


def system_md(ways=frozenset()):
    text = read('prompt', 'system.md').strip()
    extra = [WAY_RULES[w] for w in WAYS if w in ways and w in WAY_RULES]
    if not extra: return text
    anchor = text.index('\n', text.index('- Each scene shows what the words said'))
    return text[:anchor] + '\n' + '\n'.join(extra) + text[anchor:]


def system_text(style, cat, ways=frozenset()):
    md = read('prompt', 'v2', f'{style}.md').strip() if manual_of(style) else system_md(ways)
    return '\n\n'.join([md, library_text(style, cat, ways), example_text(style, ways, cat)])


def request(inp, style, cat=None, ttl='5m', model=None, thinking=THINKING, ways=None):
    """kwargs for client.beta.messages.create (see plan_d.py). The system block carries the cache breakpoint.
    ttl '1h' keeps it an hour (plan_d.cache_ttl chooses from recent traffic, Friend 2026-11-05). model: the planner
    (default Sonnet 5.5); Haiku 5.5 has no server-side fallback, so the fallback beta is left out for it.
    thinking 'off' (default) / 'on': the AI answers without thinking first (Sonnet 5.5 `between_tools`, Haiku 5.5 `disabled`, both allowed
    at effort low) — real-key test 2026-11-05: most of the cost was thinking, not the plan (a 20-scene plan is ~2–3k tokens).
    ways: the test options above (WAYS); None = $CUTPACK_PLAN_WAYS, unset = none."""
    cat, model, ways = cat or load_catalog(), model or MODEL, ways_of(ways)
    cache = {'type': 'ephemeral', **({'ttl': '1h'} if ttl == '1h' else {})}
    req = {
        'model': model, 'max_tokens': 16000,
        'output_config': {'effort': EFFORT, 'format': {'type': 'json_schema', 'schema': answer_schema(style, cat, ways)}},
        'system': [{'type': 'text', 'text': system_text(style, cat, ways), 'cache_control': cache}],
        'messages': [{'role': 'user', 'content': clip_text(inp, style, ways)}],
    }
    if 'haiku' not in model:   # a declined request is retried server-side
        req.update(betas=['server-side-fallback-2026-07-01'], fallbacks='default')
    if thinking == 'off':
        req.update(thinking={'type': 'disabled' if 'haiku' in model else 'between_tools'}, max_tokens=8000)
    return req


def fix_message(issues):
    """The one fix round: the checker's findings, scene by scene, and the ask to return the whole plan again."""
    rows = [f"- {i['code']} · {i['where']}: {i['msg']}" for i in issues]
    return ('The checker rejected some of the plan. Fix exactly these points and return the whole plan again '
            '(same format, unchanged scenes kept as they were):\n' + '\n'.join(rows))


if __name__ == '__main__':
    a = sys.argv[1:]
    if len(a) < 2: sys.exit(__doc__)
    req = request(json.load(open(a[0])), a[1])
    if '--show' in a:
        print(req['system'][0]['text']); print('\n=== user ===\n' + req['messages'][0]['content'])
    else:
        print(json.dumps(req, ensure_ascii=False, indent=1))
