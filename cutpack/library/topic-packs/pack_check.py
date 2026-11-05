#!/usr/bin/env python3
"""The render check (engine/plan/render_check.py) over one content pack, like tests/library_sweep.py does for the base
library: every pack part × every background it allows × both samples in samples.json. A clean pack gives no errors.
usage: pack_check.py <pack> [widgets]        e.g. pack_check.py biz · pack_check.py biz widgets
"""
import json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
PLAN = os.path.join(HERE, '..', '..', 'engine', 'plan')
sys.path.insert(0, PLAN)
import render_check, validate


def items(pack):
    """[(part id, code, name, hit text, [bgs])] in file order, read from the pack's PART(...) meta."""
    src = open(os.path.join(HERE, '..', '..', 'engine', 'styles', 'editorial', 'packs', pack + '.js'), encoding='utf-8').read()
    out = []
    for m in re.finditer(r"PART\('(\w+)', '(\w+)', \{pack: \w+, code: '([^']+)',(?: use: '[^']*',)? name: '([^']+)', bgs: \[([^\]]*)\].*?hit: '([^']*)'(?:, wide: [\d.]+)?\}", src, re.S):
        out.append((f'{m.group(1)}.{m.group(2)}', m.group(3), m.group(4), m.group(6), re.findall(r"'(\w+)'", m.group(5))))
    return out


def plan(pack):
    samples = json.load(open(os.path.join(HERE, 'samples.json'), encoding='utf-8'))
    scenes, t = [], 0.0
    for pid, code, name, hit, bgs in items(pack):
        for s in samples[pid]:
            for bg in bgs:
                scenes.append({'t0': t + .4, 't1': t + 3.4, 'kind': 'card', 'part': pid, 'bg': bg, 'hit': t + 1.5, 'slots': s['slots']})
                t += 4
    return {'version': 1, 'style': 'editorial', 'clip': {'duration': t}, 'script': '', 'subtitles': [], 'camera': [], 'scenes': scenes}


def widgets(pack):
    """[(part id, code, name, hit text)] of the pack's overlay widgets (packs/<pack>_w.js)."""
    src = open(os.path.join(HERE, '..', '..', 'engine', 'styles', 'editorial', 'packs', pack + '_w.js'), encoding='utf-8').read()
    return [(f'{m.group(1)}.{m.group(2)}', m.group(3), m.group(4), m.group(5)) for m in
            re.finditer(r"WIDGET\('(\w+)', '(\w+)', \{pack: \w+, code: '([^']+)',(?: use: '[^']*',)? name: '([^']+)'.*?hit: '([^']*)'(?:, wide: [\d.]+)?\}", src, re.S)]


def widget_plan(pack):
    """Every widget × both sizes × both samples, with the sample's subtitle, as tests/library_sweep.py does."""
    samples = json.load(open(os.path.join(HERE, 'samples.json'), encoding='utf-8'))
    scenes, subs, t = [], [], 0.0
    for pid, code, name, hit in widgets(pack):
        for s in samples[pid]:
            for size in ('short', 'narrow'):
                sub = {'t0': t + .2, 't1': t + 3.6, 'text': s['say']}
                if isinstance(s['slots'].get('key'), str): sub.update(key=s['slots']['key'], keyAt=t + 1.5)
                subs.append(sub)
                scenes.append({'t0': t + .7, 't1': t + 3.2, 'kind': 'widget', 'part': pid, 'size': size, 'hit': t + 1.5, 'slots': s['slots']})
                t += 4
    return {'version': 1, 'style': 'overlay', 'clip': {'duration': t}, 'script': '', 'subtitles': subs, 'camera': [], 'scenes': scenes}


if __name__ == '__main__':
    pack = sys.argv[1] if len(sys.argv) > 1 else 'biz'
    p = widget_plan(pack) if 'widgets' in sys.argv[2:] else plan(pack)
    R = validate.Report()
    render_check.run(p, R)
    for i in R.issues:
        sc = p['scenes'][i['scene']] if 'scene' in i else {}
        print(f"{i['level']:5} {i['code']:14} {sc.get('part', '')}/{sc.get('bg') or sc.get('size', '')}: {i['msg']}")
    errs = sum(i['level'] == 'error' for i in R.issues)
    print(f"{len(p['scenes'])} scenes checked, {errs} errors, {len(R.issues) - errs} warnings")
    sys.exit(1 if errs else 0)
