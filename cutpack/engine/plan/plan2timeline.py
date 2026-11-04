#!/usr/bin/env python3
"""Scene plan (JSON) → timeline.js for the engine. The AI writes only the plan; nothing it writes is run as code.

usage: plan2timeline.py <plan.json> <timeline.js>
The plan format is described in PLAN.md. Values are passed to the engine as JSON data (json.dumps), so no plan text
can become code. The engine checks slots, backgrounds and icons again when it builds each scene.
convert(plan, guard=True) is for the checker only: each call is wrapped so one failing scene, subtitle or camera move
is reported (window.__planErr = [[what, index, message]]) and the rest of the clip still builds.
"""
import json, sys


def js(v):
    return json.dumps(v, ensure_ascii=False)


def convert(plan, guard=False):
    out = [f"/* generated from a CutPack scene plan · style {plan['style']} · {plan['clip'].get('file', '')} */"]
    def call(code, what, i, undo=''):
        if not guard: return out.append(code)
        out.append(f"try {{ {code} }} catch (e) {{ {undo}(window.__planErr ??= []).push([{js(what)}, {i}, String(e.message || e)]); }}")
    scenes = sorted(enumerate(plan.get('scenes', [])), key=lambda x: x[1]['t0'])   # keep each scene's index in the plan
    cards = [[s['t0'], s['t1']] for _, s in scenes if s['kind'] == 'card']
    if cards: out.append(f"cards({js(cards)});")
    for i, c in enumerate(plan.get('camera', [])):
        if 'push' in c: call(f"push({js(c['push'])}{', ' + js(c['z']) if 'z' in c else ''});", 'camera', i)
        elif 'pull' in c: call(f"pull({js(c['pull'])}{', true' if c.get('cut') else ''});", 'camera', i)
    lay = plan.get('layout', {})   # from faces.py: where the free space is in THIS clip
    for i, sub in enumerate(plan.get('subtitles', [])):
        opt = {k: sub[k] for k in ('key', 'keyAt') if k in sub}
        if 'subtitleTop' in lay: opt['top'] = lay['subtitleTop']
        call(f"subtitle({js(sub['text'])}, {js(sub['t0'])}, {js(sub['t1'])}{', ' + js(opt) if opt else ''});", 'subtitle', i)
    for i, s in scenes:
        cat, v = s['part'].split('.')
        args = dict(s.get('slots', {}), hit=s['hit'])
        if s['kind'] == 'card':
            args['bg'] = s['bg']
            # a card that fails must not leave its window behind (the engine stops the render on a window with no card)
            call(f"part({js(cat)}, {js(v)}, {js(s['t0'])}, {js(s['t1'])}, {js(args)});", 'scene', i,
                 undo=f"CARD_WIN.splice(CARD_WIN.findIndex(w => w[0] === {js(s['t0'])}), 1); ")
        elif s['kind'] == 'widget':
            pos = s.get('pos') or lay.get('widgetPos', {}).get(s['size'])
            if pos: args['pos'] = pos
            call(f"widgetAt({js(cat)}, {js(v)}, {js(s['size'])}, {js(s['t0'])}, {js(s['t1'])}, {js(args)});", 'scene', i)
        else:
            raise SystemExit(f"unknown scene kind {s['kind']!r}")
    return '\n'.join(out) + '\n'


if __name__ == '__main__':
    plan = json.load(open(sys.argv[1]))
    open(sys.argv[2], 'w').write(convert(plan))
    print('timeline →', sys.argv[2])
