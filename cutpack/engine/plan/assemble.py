#!/usr/bin/env python3
"""AI answer ({camera, scenes}) + the clip input → a full scene plan (PLAN.md) for validate.py and plan2timeline.py.

usage: assemble.py <input.json> <answer.json> <editorial|overlay> <plan.json>
Code, not the AI, adds what the AI must not get wrong:
  * version, style, clip, script (the words joined) and layout (from faces.py, kept in the input)
  * subtitles from the caption step: all of them for overlay; for editorial only the chunks said while the face is on
    screen — a chunk whose words fall inside a card window is left out (the card tells that sentence)
  * kind from the style; camera rows back into {"push": t, "z"} / {"pull": t, "cut": true}
"""
import json, sys
import prompt

TOL = .1


def subtitles(inp, cards):
    """Caption lines → plan subtitles. Each '/' chunk lasts from its first word to the next chunk (or the line's end)."""
    out = []
    for c, toks in prompt.token_times(inp):
        if not cards:
            out.append(dict(c)); continue
        chunks, cur = [], []
        for x, t in toks:
            if x == '/':
                if cur: chunks.append(cur); cur = []
            else: cur.append((x, t))
        if cur: chunks.append(cur)
        spans = []
        for i, ch in enumerate(chunks):
            a = c['t0'] if i == 0 else ch[0][1]
            b = chunks[i + 1][0][1] if i + 1 < len(chunks) else c['t1']
            spans.append((a, b, ' '.join(x for x, _ in ch)))
        run = []
        for sp in spans + [None]:   # None flushes the last run
            if sp is not None and not any(min(sp[1], w1) - max(sp[0], w0) > TOL for w0, w1 in cards):
                run.append(sp); continue
            if run:
                sub = {'t0': round(run[0][0], 3), 't1': round(run[-1][1], 3), 'text': ' / '.join(r[2] for r in run)}
                if len(run) == 1 and len(spans) == 1: sub['text'] = c['text']   # an unchunked line stays as written
                for k in ('key', 'keyAt'):
                    if k in c and run[0][0] <= c.get('keyAt', run[0][0]) <= run[-1][1]: sub[k] = c[k]
                out.append(sub)
            run = []
    return out


def assemble(inp, ans, style):
    kind = prompt.KIND[style]
    scenes = []
    for s in ans['scenes']:
        x = {'t0': s['t0'], 't1': s['t1'], 'kind': kind, 'part': s['part']}
        x.update({'bg': s['bg']} if kind == 'card' else {'size': s['size']})
        x.update(hit=s['hit'], slots={k: v for k, v in s.get('slots', {}).items() if v is not None})
        if s.get('say'): x['say'] = s['say']
        scenes.append(x)
    cam = []
    for c in ans.get('camera', []):
        if c['move'] == 'push': cam.append({'push': c['t'], **({'z': c['z']} if c.get('z') else {})})
        else: cam.append({'pull': c['t'], **({'cut': True} if c.get('cut') else {})})
    cards = [(s['t0'], s['t1']) for s in scenes if kind == 'card']
    plan = {'version': 1, 'style': style, 'clip': inp['clip'],
            'script': ' '.join(w['w'] for w in inp.get('words', [])) or ' '.join(c['text'].replace('/', ' ') for c in inp['captions']),
            'camera': cam, 'subtitles': subtitles(inp, cards), 'scenes': scenes}
    lay = {k: v for k, v in (inp.get('layout') or {}).items() if k in ('subtitleTop', 'widgetPos')}
    if lay: plan['layout'] = lay
    return plan


if __name__ == '__main__':
    a = sys.argv[1:]
    if len(a) < 4: sys.exit(__doc__)
    plan = assemble(json.load(open(a[0])), json.load(open(a[1])), a[2])
    json.dump(plan, open(a[3], 'w'), ensure_ascii=False, indent=1)
    print(f"{len(plan['scenes'])} scenes, {len(plan['subtitles'])} subtitles → {a[3]}")
