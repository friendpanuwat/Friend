#!/usr/bin/env python3
"""Make a plan renderable when it still fails after the AI's one fix (DECISIONS 5: "ถ้ายังไม่ผ่าน ให้ใช้การ์ดตัวอักษรแทน",
"ผู้ใช้ต้องได้คลิปเสมอ").

usage: fallback.py <plan.json> <out.json> [--faces faces.json] [--history history.json] [--no-render]
Only blocking errors are dealt with (validate.QUALITY errors such as density are left for the AI round; the clip is
made anyway). For each one:
  topic     → an unknown topic becomes none (its topic-pack scenes then fail and are swapped like any scene)
  scene     → swapped for a B14 text card/widget built from the scene's own words (lead + key, or wlead + wkey);
              a B14 that still fails, or a scene with no words to show, is dropped
  subtitle  → key/keyAt removed, times trimmed off a card or the subtitle before it; dropped if that is not enough
  camera    → the move is dropped (a zoom out of range is set back to the normal 1.05)
  layout    → the subtitle top is put back inside 1300–1380
Repeats validate → repair until nothing blocks (at most 4 rounds; whatever still blocks after that is removed).
Every change is listed in the plan's "fallbackLog" so it can be shown to Friend.
"""
import copy, json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import validate as V

PHRASE = 14   # B14: each phrase ≤ 14 letters


def phrases(text):
    """Cut a text into B14 phrases at the writer's spaces (never inside a Thai word); None if a word alone is too long."""
    out = []
    for w in str(text).split():
        if V.graphemes(w) > PHRASE: return None
        if out and V.graphemes(out[-1] + ' ' + w) <= PHRASE: out[-1] += ' ' + w
        else: out.append(w)
    return out


KEYS = ('wkey', 'key', 'y', 'goal', 'tip', 'text', 'q', 'when', 'who', 'b', 'a')   # the scene's main words, best first


def words_of(scene):
    """B14 phrases from the scene's own words: lead (or wlead) then its main words; None if there is nothing to show."""
    sl = scene.get('slots', {})
    key = next((sl[k] for k in KEYS if isinstance(sl.get(k), str) and sl[k].strip()), None)
    if key is None: return None
    lead = next((sl[k] for k in ('wlead', 'lead') if isinstance(sl.get(k), str) and sl[k].strip() and sl[k] != key), '')
    lp, kp = phrases(lead) if lead else [], phrases(key)
    if lp is None or kp is None: return None
    words = lp + kp
    if len(words) < 2: return None
    return words[:7], min(len(lp), 6)   # the key's first phrase is the stressed one


def b14(scene, plan, cat):
    """A B14 replacement for this scene, or None if it has nothing to say."""
    w = words_of(scene)
    if not w: return None
    words, key = w
    t0, t1 = scene['t0'], scene['t1']
    lo, hi = 1.2, 3.5
    if t1 - t0 < lo:   # stretch into free time after it if there is some
        nxt = min([s['t0'] for s in plan['scenes'] if s['t0'] >= t1 - 1e-6 and s is not scene] + [plan['clip']['duration']])
        t1 = min(t0 + lo, nxt - (V.RULES['widgetGap'] if scene['kind'] == 'widget' else 0))
        if t1 - t0 < lo - 1e-6: return None
    t1 = min(t1, t0 + hi)
    hit = min(max(scene['hit'], t0 + V.RULES['hitIn'][scene['kind']]), t1 - V.RULES['hitOut'])
    new = {'t0': t0, 't1': round(t1, 3), 'kind': scene['kind'], 'hit': round(hit, 3), 'slots': {'words': words, 'key': key}, 'fallback': scene['part']}
    used = [s['part'] for s in plan['scenes'] if s is not scene]
    near = [s for s in plan['scenes'] if s is not scene and abs(s['t0'] - t0) < 8]
    # B14 variants to choose from: one not used in the clip yet, else the least used, and never the same as a neighbour
    if scene['kind'] == 'card':
        opts = [('B14.v1', 'white'), ('B14.v3', 'cream'), ('B14.v2', 'glow'), ('B14.v1', 'cream'), ('B14.v3', 'white')]
        near_bg = {s.get('bg') for s in near}
        opts.sort(key=lambda o: (used.count(o[0]), o[1] in near_bg, any(s['part'] == o[0] for s in near)))
        part, bg = opts[0]
        new.update(part=part, bg=bg)
    else:
        opts = sorted(['B14.v1', 'B14.v3'], key=lambda o: (used.count(o), any(s['part'] == o for s in near)))
        icon = scene.get('slots', {}).get('icon')
        if isinstance(icon, str) and icon in set(cat['icons']): new['slots']['icon'] = icon
        new.update(part=opts[0], size=scene['size'])
        if scene.get('pos'): new['pos'] = scene['pos']
    return new


def repair(plan, cat=None, faces=None, history=None, render=True, rounds=4):
    cat = cat or json.load(open(os.path.join(HERE, 'catalog.json')))
    p = copy.deepcopy(plan)
    log = p.setdefault('fallbackLog', [])
    for rnd in range(rounds + 1):
        R, _ = V.validate(p, cat, faces, history, render=render)
        block = R.blocking
        if not block: return p, R
        last = rnd == rounds
        drop_scene, swap_scene, drop_sub, drop_cam = set(), set(), set(), set()
        for i in block:
            if 'scene' in i:
                s = p['scenes'][i['scene']]
                # a scene whose own shape is wrong (times not numbers…) cannot become a B14 either: drop it
                (drop_scene if last or s.get('fallback') or i['code'] == 'shape' else swap_scene).add(i['scene'])
            elif 'sub' in i:
                sub = p['subtitles'][i['sub']]
                if last or sub.get('_fixed'): drop_sub.add(i['sub']); continue
                sub['_fixed'] = True
                if i['code'] == 'sub-key':
                    sub.pop('key', None); sub.pop('keyAt', None); log.append(f"subtitle {sub['t0']}: big-word timing removed ({i['msg']})")
                elif i['code'] in ('sub-under-card', 'sub-overlap', 'time'):
                    busy = [(s['t0'], s['t1']) for s in p['scenes'] if s['kind'] == 'card'] + [(x['t0'], x['t1']) for k, x in enumerate(p['subtitles']) if k != i['sub'] and x['t0'] < sub['t0']]
                    a, b = max(0, sub['t0']), min(sub['t1'], p['clip']['duration'])
                    for c0, c1 in busy:
                        if c0 <= a < c1: a = c1
                        if a < c0 < b: b = c0
                    if b - a < .4: drop_sub.add(i['sub'])
                    else: log.append(f"subtitle {sub['t0']}–{sub['t1']} trimmed to {a}–{b}"); sub['t0'], sub['t1'] = round(a, 3), round(b, 3)
                else:
                    drop_sub.add(i['sub'])
            elif 'cam' in i:
                c = p['camera'][i['cam']]
                if i['code'] == 'cam-zoom' and not last and 'push' in c and not c.get('_fixed'):
                    c['z'] = 1.05; c['_fixed'] = True; log.append(f"camera push {c['push']}: zoom set back to 1.05")
                elif i['code'] == 'cam-cut' and not last and 'pull' in c and not c.get('_fixed'):
                    c.pop('cut'); c['_fixed'] = True; log.append(f"camera pull {c['pull']}: soft pull instead of a cut")
                else:
                    drop_cam.add(i['cam'])
            elif i['code'] == 'sub-top':
                lo, hi = V.RULES['subTop']
                p.setdefault('layout', {})['subtitleTop'] = min(hi, max(lo, p['layout'].get('subtitleTop', lo)))
                log.append(f"subtitle top set to {p['layout']['subtitleTop']}")
            elif i['code'] == 'shape' and i['where'] in ('version', 'scenes', 'script'):   # plan-level fields code can supply
                if i['where'] == 'version': p['version'] = 1
                elif i['where'] == 'scenes': p['scenes'] = []
                else: p['script'] = ' '.join(x['text'].replace('/', ' ') for x in p.get('subtitles', []))
                log.append(f"plan field {i['where']} set by code ({i['msg']})")
            elif i['code'] == 'topic' or (i['code'] == 'shape' and i['where'] == 'topic'):   # an unknown topic: base parts only
                p['topic'] = 'none'; log.append(f"topic set to none ({i['msg']})")
            elif i['code'] == 'engine':
                if last: raise SystemExit(f'the engine still refuses the plan: {i["msg"]}')
            else:
                if last: raise SystemExit(f'cannot repair {i["code"]}: {i["msg"]}')
        for k in sorted(swap_scene):
            s = p['scenes'][k]; new = b14(s, p, cat)
            if new: p['scenes'][k] = new; log.append(f"{s['part']} {s['t0']}–{s['t1']} → B14 text {new['part']} ({', '.join(i['code'] for i in block if i.get('scene') == k)})")
            else: drop_scene.add(k)
        for k in sorted(drop_scene, reverse=True):
            s = p['scenes'].pop(k); log.append(f"{s['part']} {s['t0']}–{s['t1']} dropped ({', '.join(i['code'] for i in block if i.get('scene') == k) or 'its B14 failed too'})")
        for k in sorted(drop_sub, reverse=True):
            s = p['subtitles'].pop(k); log.append(f"subtitle {s['t0']}–{s['t1']} \"{s['text']}\" dropped")
        for k in sorted(drop_cam, reverse=True):
            c = p['camera'].pop(k); log.append(f"camera {c} dropped")
    R, _ = V.validate(p, cat, faces, history, render=render)
    return p, R


def clean(p):
    for x in p.get('subtitles', []) + p.get('camera', []): x.pop('_fixed', None)
    return p


if __name__ == '__main__':
    a = sys.argv[1:]
    if len(a) < 2: sys.exit(__doc__)
    opt = lambda k: a[a.index(k) + 1] if k in a else None
    plan = json.load(open(a[0]))
    faces = json.load(open(opt('--faces'))) if opt('--faces') else None
    history = json.load(open(opt('--history'))) if opt('--history') else None
    p, R = repair(plan, faces=faces, history=history, render='--no-render' not in a)
    json.dump(clean(p), open(a[1], 'w'), ensure_ascii=False, indent=1)
    for line in p['fallbackLog']: print('fixed:', line)
    for i in R.issues: print(f"{i['level']:5} {i['code']:16} {i['where']}: {i['msg']}")
    print('RENDERABLE' if not R.blocking else 'STILL BLOCKED', f'({len(p["fallbackLog"])} changes)')
    sys.exit(0 if not R.blocking else 1)
