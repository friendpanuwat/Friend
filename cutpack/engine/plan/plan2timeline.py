#!/usr/bin/env python3
"""Scene plan (JSON) → timeline.js for the engine. The AI writes only the plan; nothing it writes is run as code.

usage: plan2timeline.py <plan.json> <timeline.js>
The plan format is described in PLAN.md. Values are passed to the engine as JSON data (json.dumps), so no plan text
can become code. The engine checks slots, backgrounds and icons again when it builds each scene.
"""
import json, sys


def js(v):
    return json.dumps(v, ensure_ascii=False)


def convert(plan):
    out = [f"/* generated from a CutPack scene plan · style {plan['style']} · {plan['clip'].get('file', '')} */"]
    scenes = sorted(plan.get('scenes', []), key=lambda s: s['t0'])
    cards = [[s['t0'], s['t1']] for s in scenes if s['kind'] == 'card']
    if cards: out.append(f"cards({js(cards)});")
    for c in plan.get('camera', []):
        if 'push' in c: out.append(f"push({js(c['push'])}{', ' + js(c['z']) if 'z' in c else ''});")
        elif 'pull' in c: out.append(f"pull({js(c['pull'])}{', true' if c.get('cut') else ''});")
    lay = plan.get('layout', {})   # from faces.py: where the free space is in THIS clip
    for sub in plan.get('subtitles', []):
        opt = {k: sub[k] for k in ('key', 'keyAt') if k in sub}
        if 'subtitleTop' in lay: opt['top'] = lay['subtitleTop']
        out.append(f"subtitle({js(sub['text'])}, {js(sub['t0'])}, {js(sub['t1'])}{', ' + js(opt) if opt else ''});")
    for s in scenes:
        cat, v = s['part'].split('.')
        args = dict(s.get('slots', {}), hit=s['hit'])
        if s['kind'] == 'card':
            args['bg'] = s['bg']
            out.append(f"part({js(cat)}, {js(v)}, {js(s['t0'])}, {js(s['t1'])}, {js(args)});")
        elif s['kind'] == 'widget':
            pos = s.get('pos') or lay.get('widgetPos', {}).get(s['size'])
            if pos: args['pos'] = pos
            out.append(f"widgetAt({js(cat)}, {js(v)}, {js(s['size'])}, {js(s['t0'])}, {js(s['t1'])}, {js(args)});")
        else:
            raise SystemExit(f"unknown scene kind {s['kind']!r}")
    return '\n'.join(out) + '\n'


if __name__ == '__main__':
    plan = json.load(open(sys.argv[1]))
    open(sys.argv[2], 'w').write(convert(plan))
    print('timeline →', sys.argv[2])
