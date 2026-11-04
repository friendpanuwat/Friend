#!/usr/bin/env python3
"""Build the plan-D request: the AI picks library parts for one clip and answers with JSON (DECISIONS 2, PLAN.md).

usage: prompt.py <input.json> <editorial|overlay> [--show]    → prints the request (what would be sent) as JSON
The request has two parts:
  system  (cached, the same for every clip of a style): prompt/system.md + the library of that style (parts, slots,
          categories, icons) + one worked example. Its text is built only from files in the repo, in a fixed order,
          so it stays byte-identical between clips and the prompt cache keeps hitting.
  user    (per clip): length, room for widgets, the transcript as caption lines with word times, parts to avoid.
The answer is forced into ANSWER schema (structured outputs): {"camera": [...], "scenes": [...]}; assemble.py turns
it into a full plan. Model and effort follow DECISIONS ("วางแผนฉากด้วย Sonnet 5.5 effort low").

Input file (one clip, made by the transcription and caption steps; example: examples/test18_input.json):
  {"clip": {"file", "duration", "customer"}, "words": [{"w", "t0", "t1"}], "captions": [{"t0", "t1", "text" with / chunks}],
   "layout": faces.json "layout", "history": {"clips": [{"parts": [...]}]}}
"""
import glob, json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
STYLES = os.path.join(HERE, '..', 'styles', 'editorial')
MODEL, EFFORT = 'claude-sonnet-5-5', 'low'
KIND = {'editorial': 'card', 'overlay': 'widget'}


def read(*path):
    with open(os.path.join(HERE, *path)) as f: return f.read()


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


def slot_sig(name, spec, note=''):
    t = spec['type']
    s = f"{name}:{t}" + ('!' if spec.get('req') else '')
    if spec.get('max') and t == 'text': s += f"≤{spec['max']}"
    if t == 'list' and (spec.get('min') or spec.get('max')): s += f"[{spec.get('min', 0)}–{spec.get('max', '')}]"
    if t == 'choice': s += '(' + '|'.join(repr(x) if x == '' else x for x in spec['of']) + ')'
    return s + (f" — {note}" if note else '')


def library_text(style, cat):
    """The library of one style, grouped by category: what the category is for, its slots, then each variant."""
    cats = json.loads(read('prompt', 'categories.json'))['categories']
    notes, parts = slot_notes(), cat['cards' if style == 'editorial' else 'widgets']
    out = [f"# Library ({'full-screen cards' if style == 'editorial' else 'overlay widgets'}, {len(parts)} parts)",
           "Each category: what sentence it is for, its slots (`!` required, `≤N` letter limit), then its parts:",
           "  id · name · what happens on the hit · length range in seconds" + (" · backgrounds" if style == 'editorial' else ''), '']
    for c in cats:
        ps = [p for p in parts if p['id'].startswith(c['id'] + '.')]
        if not ps: continue
        out.append(f"## {c['id']} {c['name']} — {c['when']}")
        slots = dict(ps[0]['slots'])
        if style == 'overlay': slots.update({'wlead': {'type': 'text', 'max': 16}, 'wkey': {'type': 'text', 'max': 12}})
        out.append('slots: ' + ' · '.join(slot_sig(k, v, notes.get(c['id'], {}).get(k, '')) for k, v in slots.items()))
        for p in ps:
            row = f"- {p['id']} · {p['name']} · hit: {p['hit']} · {p['dur'][0]}–{p['dur'][1]} s"
            if style == 'editorial': row += ' · ' + '/'.join(p['bgs'])
            out.append(row)
        out.append('')
    out.append(f"# Icons ({len(cat['icons'])} names; use only these)")
    out.append(' '.join(cat['icons']))
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


def clip_text(inp, style):
    d = inp['clip']['duration']
    lay = inp.get('layout', {})
    out = [f"Style: {style}", f"Clip length: {d:.2f} s"]
    if style == 'overlay':
        sizes = [s for s in ('short', 'narrow') if lay.get(f'{s}Fits', True)]
        out.append('Widget sizes with room in this clip: ' + (', '.join(sizes) if sizes else 'none (plan no widgets)'))
    past = (inp.get('history') or {}).get('clips', [])[-10:][::-1]
    if past:
        out.append('Parts used in this customer\'s last clips (newest first):')
        out += [f"- {i + 1}: " + ', '.join(c.get('parts', [])) for i, c in enumerate(past)]
    out += ['', 'Transcript (caption lines; word@start second; / = subtitle chunk):', caption_lines(inp)]
    return '\n'.join(out)


def example_text(style):
    inp = json.loads(read('examples', 'test18_input.json'))
    ans = json.loads(read('examples', f'test18_{style}.answer.json'))
    return ('# Example (format only; plan each clip afresh)\n## Input\n' + clip_text(inp, style)
            + '\n## Answer\n' + json.dumps(ans, ensure_ascii=False, separators=(',', ':')))


def answer_schema(style, cat):
    """JSON schema for the answer. Slots: one optional property per slot name used in this style's library."""
    parts = cat['cards' if style == 'editorial' else 'widgets']
    props = {}
    for p in parts:
        for k, spec in p['slots'].items():
            t = spec['type']
            if t == 'list':
                item = {'type': 'number'} if k == 'at' else (
                    {'type': 'object', 'properties': {'t': {'type': 'string'}, 'a': {'type': 'boolean'}, 'b': {'type': 'boolean'}},
                     'required': ['t', 'a', 'b'], 'additionalProperties': False} if k == 'rows' else {'type': 'string'})
                sch = {'type': 'array', 'items': item}
            elif t == 'number': sch = {'type': 'number'}
            elif t == 'choice': sch = {'type': 'string', 'enum': sorted(set(spec['of']))}
            else: sch = {'type': 'string'}
            old = props.get(k)
            if old is None: props[k] = sch
            elif old != sch:
                if old.get('enum') and sch.get('enum'): props[k] = {'type': 'string', 'enum': sorted(set(old['enum']) | set(sch['enum']))}
                else:
                    opts = old['anyOf'] if 'anyOf' in old else [old]
                    if sch not in opts: opts = opts + [sch]
                    props[k] = {'anyOf': opts}
    if style == 'overlay':
        props.update(wlead={'type': 'string'}, wkey={'type': 'string'})
    scene = {'t0': {'type': 'number'}, 't1': {'type': 'number'}, 'part': {'type': 'string', 'enum': [p['id'] for p in parts] + ['custom']}}
    scene.update({'bg': {'type': 'string', 'enum': ['glow', 'white', 'cream']}} if style == 'editorial' else {'size': {'type': 'string', 'enum': ['short', 'narrow']}})
    scene.update(hit={'type': 'number'}, say={'type': 'string'}, need={'type': 'string'},
                 slots={'type': 'object', 'properties': dict(sorted(props.items())), 'additionalProperties': False})
    cam = {'type': 'object', 'properties': {'move': {'type': 'string', 'enum': ['push', 'pull']}, 't': {'type': 'number'},
                                            'z': {'type': 'number'}, 'cut': {'type': 'boolean'}},
           'required': ['move', 't'], 'additionalProperties': False}
    return {'type': 'object', 'additionalProperties': False, 'required': ['camera', 'scenes'],
            'properties': {'camera': {'type': 'array', 'items': cam},
                           'scenes': {'type': 'array', 'items': {'type': 'object', 'properties': scene, 'required': list(scene),
                                                                 'additionalProperties': False}}}}


def code_schema():
    return {'type': 'object', 'additionalProperties': False, 'required': ['scenes'],
            'properties': {'scenes': {'type': 'array', 'items': {'type': 'object', 'additionalProperties': False, 'required': ['i', 'code'],
                                                                 'properties': {'i': {'type': 'integer'}, 'code': {'type': 'string'}}}}}}


def code_system_text(cat):
    """Cached block of the scene-code call: the kit guide and the icon names (the same for every clip)."""
    return read('prompt', 'kit.md').strip() + f"\n\n# Icons ({len(cat['icons'])} names; use only these)\n" + ' '.join(cat['icons'])


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


def request(inp, style, cat=None):
    """kwargs for client.beta.messages.create (see plan_d.py). The system block carries the cache breakpoint."""
    cat = cat or load_catalog()
    return {
        'model': MODEL, 'max_tokens': 16000,
        'betas': ['server-side-fallback-2026-07-01'], 'fallbacks': 'default',   # a declined request is retried server-side
        'output_config': {'effort': EFFORT, 'format': {'type': 'json_schema', 'schema': answer_schema(style, cat)}},
        'system': [{'type': 'text', 'text': system_text(style, cat), 'cache_control': {'type': 'ephemeral'}}],
        'messages': [{'role': 'user', 'content': clip_text(inp, style)}],
    }


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
