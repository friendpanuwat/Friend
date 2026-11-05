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
import glob, json, math, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import room   # noqa: E402  (per-moment widget room, Friend 2026-11-05)
STYLES = os.path.join(HERE, '..', 'styles', 'editorial')
MODEL, EFFORT = 'claude-sonnet-5-5', 'low'
KIND = {'editorial': 'card', 'overlay': 'widget'}


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


def part_row(p, style):
    row = f"- {p['id']} · {p['name']} · hit: {p['hit']} · {p['dur'][0]}–{p['dur'][1]} s"
    if style == 'editorial': row += ' · ' + '/'.join(p['bgs'])
    if p.get('pack'): row += f" · topic {p['pack']}"
    if p.get('use'): row += f" · only for: {p['use']}"
    return row


def library_text(style, cat):
    """The library of one style, grouped by category: what the category is for, its slots, then each variant (base
    parts, then the topic packs' versions of the same category); then each topic pack with its own hero parts."""
    cats = json.loads(read('prompt', 'categories.json'))['categories']
    notes, parts = slot_notes(), cat['cards' if style == 'editorial' else 'widgets']
    wtext = {'wlead': {'type': 'text', 'max': 16}, 'wkey': {'type': 'text', 'max': 12}}
    out = [f"# Library ({'full-screen cards' if style == 'editorial' else 'overlay widgets'}, {len(parts)} parts)",
           "Each category: what sentence it is for, its slots (`!` required, `≤N` letter limit, `<…>` the type of a list's items), then its parts:",
           "  id · name · what happens on the hit · length range in seconds" + (" · backgrounds" if style == 'editorial' else '')
           + " · topic (a topic pack's part: use it only in a clip of that topic)", '']
    for c in cats:
        ps = [p for p in parts if p['id'].startswith(c['id'] + '.')]
        if not ps: continue
        out.append(f"## {c['id']} {c['name']} — {c['when']}")
        slots = dict(ps[0]['slots'])
        if style == 'overlay': slots.update(wtext)
        out.append('slots: ' + ' · '.join(slot_sig(k, v, notes.get(c['id'], {}).get(k, '')) for k, v in slots.items()))
        out += [part_row(p, style) for p in sorted(ps, key=lambda p: (bool(p.get('pack')), p.get('pack') or '', p['id']))]
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
                out.append(part_row(p, style))
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
    """This clip's density rules as numbers (Friend 2026-11-05, "ข้อเสนอบอกตัวเลข"): with only the general rules, the first
    plans at effort low had 7–13 scenes for 60–90 s clips and 34 scene lengths outside their part's range, so every clip
    paid for a fix round (60–80% of its cost). Overlay counts only the time with room, as the checker does."""
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
    return ['', 'Targets for this clip (the checker rejects a plan that misses one: count and check each before you answer):'] + rows


def clip_text(inp, style):
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
    out += targets(inp, style)
    past = (inp.get('history') or {}).get('clips', [])[-10:][::-1]
    if past:
        out.append('Parts used in this customer\'s last clips (newest first):')
        out += [f"- {i + 1}: " + ', '.join(c.get('parts', [])) for i, c in enumerate(past)]
    out += ['', 'Transcript (caption lines; word@start second; / = subtitle chunk):', caption_lines(inp)]
    return '\n'.join(out)


def example_text(style):
    inp = json.loads(read('examples', 'test18_input.json'))
    ans = slots_to_list(json.loads(read('examples', f'test18_{style}.answer.json')))
    return ('# Example (format only; plan each clip afresh)\n## Input\n' + clip_text(inp, style)
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


def answer_schema(style, cat):
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
    scene = {'t0': {'type': 'number'}, 't1': {'type': 'number'}, 'say': {'type': 'string'}, 'shows': {'type': 'string'},
             'part': {'type': 'string', 'enum': [p['id'] for p in parts] + ['custom']}}
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


def code_system_text(cat):
    """Cached block of the scene-code call: the kit guide and the icon names (the same for every clip)."""
    return read('prompt', 'kit.md').strip() + '\n\n' + icons_text(cat)


def code_request(inp, style, answer, cat=None):
    """The second call (DECISIONS 2, step 5), only when the plan has custom scenes: write their code."""
    cat = cat or load_catalog()
    kind = KIND[style]
    rows = ['Write the code of these scenes. Answer {"scenes": [{"i": scene number, "code": function body}]}.', '']
    for i, s in enumerate(answer['scenes']):
        if s.get('part') != 'custom': continue
        words = [w for w in inp.get('words', []) if s['t0'] - .3 <= w['t0'] < s['t1']]
        sl = s.get('slots') or {}
        rows += [f"## scene {i} · {kind}" + (f" · background {s.get('bg')}" if kind == 'card' else f" · widget {s.get('size')}, S = {150 if s.get('size') == 'short' else 180}"),
                 f"t0 {s['t0']} · hit {s['hit']} · t1 {s['t1']}",
                 f"show: {s.get('need', '')}",
                 'words said: ' + ' '.join(f"{w['w']}@{w['t0']:.2f}" for w in words),
                 'text code adds under it: ' + (' / '.join(x for x in (sl.get('lead') or sl.get('wlead'), sl.get('key') or sl.get('wkey')) if x) or 'none'), '']
    return {
        'model': MODEL, 'max_tokens': 16000,
        'betas': ['server-side-fallback-2026-07-01'], 'fallbacks': 'default',
        'output_config': {'effort': EFFORT, 'format': {'type': 'json_schema', 'schema': code_schema()}},
        'system': [{'type': 'text', 'text': code_system_text(cat), 'cache_control': {'type': 'ephemeral'}}],
        'messages': [{'role': 'user', 'content': '\n'.join(rows)}],
    }


def system_text(style, cat):
    return '\n\n'.join([read('prompt', 'system.md').strip(), library_text(style, cat), example_text(style)])


def request(inp, style, cat=None, ttl='5m', model=None):
    """kwargs for client.beta.messages.create (see plan_d.py). The system block carries the cache breakpoint.
    ttl '1h' keeps it an hour (plan_d.cache_ttl chooses from recent traffic, Friend 2026-11-05). model: the planner
    (default Sonnet 5.5); Haiku 5.5 has no server-side fallback, so the fallback beta is left out for it."""
    cat, model = cat or load_catalog(), model or MODEL
    cache = {'type': 'ephemeral', **({'ttl': '1h'} if ttl == '1h' else {})}
    req = {
        'model': model, 'max_tokens': 16000,
        'output_config': {'effort': EFFORT, 'format': {'type': 'json_schema', 'schema': answer_schema(style, cat)}},
        'system': [{'type': 'text', 'text': system_text(style, cat), 'cache_control': cache}],
        'messages': [{'role': 'user', 'content': clip_text(inp, style)}],
    }
    if 'haiku' not in model:   # a declined request is retried server-side
        req.update(betas=['server-side-fallback-2026-07-01'], fallbacks='default')
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
