#!/usr/bin/env python3
"""Run the render check over the whole library with the gallery samples Friend reviewed (library/base-parts/samples.json):
every card part × every allowed background × both samples, and every widget × both sizes with the sample's subtitle.
A clean library must give no errors — otherwise the check is too strict or a part has a real problem.
usage: library_sweep.py [cards|widgets]   (both by default)
"""
import json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
import render_check, validate

SAMPLES = json.load(open(os.path.join(HERE, '..', '..', '..', 'library', 'base-parts', 'samples.json')))
CAT = json.load(open(os.path.join(HERE, '..', 'catalog.json')))


def card_plan(cat):
    scenes, t = [], 0.0
    for p in CAT['cards']:
        if not p['id'].startswith(cat): continue
        for s in SAMPLES[cat]:
            for bg in p['bgs']:
                scenes.append({'t0': t + .4, 't1': t + 3.4, 'kind': 'card', 'part': p['id'], 'bg': bg, 'hit': t + 1.5, 'slots': s['slots']})
                t += 4
    return {'version': 1, 'style': 'editorial', 'clip': {'duration': t}, 'script': '', 'subtitles': [], 'camera': [], 'scenes': scenes}


def widget_plan(cat):
    scenes, subs, t = [], [], 0.0
    for p in CAT['widgets']:
        if not p['id'].startswith(cat): continue
        for s in SAMPLES[cat]:
            for size in ('short', 'narrow'):
                key = s['slots'].get('key')
                sub = {'t0': t + .2, 't1': t + 3.6, 'text': s['say']}
                if isinstance(key, str): sub.update(key=key, keyAt=t + 1.5)
                subs.append(sub)
                scenes.append({'t0': t + .7, 't1': t + 3.2, 'kind': 'widget', 'part': p['id'], 'size': size, 'hit': t + 1.5, 'slots': s['slots']})
                t += 4
    return {'version': 1, 'style': 'overlay', 'clip': {'duration': t}, 'script': '', 'subtitles': subs, 'camera': [], 'scenes': scenes}


def one(job):
    name, cat = job
    plan = (card_plan if name == 'cards' else widget_plan)(cat)
    R = validate.Report()
    render_check.run(plan, R)
    for i in R.issues:
        if 'scene' in i: i['part'] = f"{plan['scenes'][i['scene']]['part']}/{plan['scenes'][i['scene']].get('bg') or plan['scenes'][i['scene']].get('size')}"
    return name, cat, len(plan['scenes']), R.issues


if __name__ == '__main__':
    from multiprocessing import Pool
    which = sys.argv[1:] or ['cards', 'widgets']
    cats = sorted({p['id'].split('.')[0] for p in CAT['cards']})
    jobs = [(n, c) for n in which for c in cats]
    bad = total = 0
    with Pool(4) as pool:
        for name, cat, n, issues in pool.imap(one, jobs):
            total += n
            for i in issues: print(f"{name} {cat} {i.get('part', '')}: {i['level']:5} {i['code']:16} {i['where']}: {i['msg']}", flush=True)
            bad += sum(i['level'] == 'error' for i in issues)
    print(f"{total} scenes checked, {bad} errors")
    sys.exit(1 if bad else 0)
