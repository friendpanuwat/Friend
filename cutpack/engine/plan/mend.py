#!/usr/bin/env python3
"""Mend the plan's number-only mistakes in code, before any fix round (Friend 2026-11-05).

The real-key tests showed the fix round was 60–80% of a clip's cost, and the commonest mistakes in first plans were plain
numbers: a scene longer or shorter than its part allows (34 in round 3), a hit too close to a scene's start or end (10),
widgets less than 0.4 s apart. Code sets those right without asking the AI again; what is left (too few scenes, a
wrong part, a number nobody said…) still goes to the fix round.

mend(answer, style, cat, dur) → (a mended copy, notes). Only times move: t0, t1, hit and item times inside a scene
(`at`, `aty`). A mend that would make another rule fail (overlap, leave the clip) is not made.
"""
import copy
from validate import RULES

EPS = 1e-6


def _range(s, lib):
    if s.get('part') == 'custom': return RULES['customDur']
    P = lib.get(s.get('part'))
    return tuple(P['dur']) if P else None


def _r(x): return round(x, 3)


def mend(answer, style, cat, dur):
    if not answer or not isinstance(answer.get('scenes'), list): return answer, []
    kind = 'card' if style == 'editorial' else 'widget'
    lib = {p['id']: p for p in cat['cards' if kind == 'card' else 'widgets']}
    gap = RULES['widgetGap'] if kind == 'widget' else 0.0
    hit_in, hit_out = RULES['hitIn'][kind], RULES['hitOut']
    a = copy.deepcopy(answer)
    sc = sorted((s for s in a['scenes'] if isinstance(s, dict) and all(isinstance(s.get(k), (int, float)) for k in ('t0', 't1', 'hit'))),
                key=lambda s: s['t0'])
    notes = []
    for k, s in enumerate(sc):
        rng = _range(s, lib)
        if not rng: continue
        lo, hi = rng
        t0, t1, hit = s['t0'], s['t1'], s['hit']
        prev_end = sc[k - 1]['t1'] + gap if k else (RULES['firstAt'] if kind == 'card' else 0.0)
        next_start = sc[k + 1]['t0'] - gap if k + 1 < len(sc) else dur
        if t1 - t0 > hi + EPS:   # too long: keep hi seconds around the hit
            n0 = max(t0, min(hit + hit_out - hi, t1 - hi))
            t0, t1 = n0, n0 + hi
        elif t1 - t0 < lo - EPS:   # too short: grow into free time after it, else before it
            if t0 + lo <= next_start + EPS: t1 = t0 + lo
            elif t1 - lo >= prev_end - EPS: t0 = t1 - lo
        if hit < t0 + hit_in: hit = t0 + hit_in
        if hit > t1 - hit_out: hit = t1 - hit_out
        if hit < t0 + hit_in - EPS or t0 < -EPS or t1 > dur + EPS: continue   # cannot be mended by numbers
        if (_r(t0), _r(t1), _r(hit)) != (_r(s['t0']), _r(s['t1']), _r(s['hit'])):
            notes.append(f"{s['part']} {s['t0']}–{s['t1']} hit {s['hit']} → {_r(t0)}–{_r(t1)} hit {_r(hit)}")
            s['t0'], s['t1'], s['hit'] = _r(t0), _r(t1), _r(hit)
        _mend_item_times(s)
    for x, y in zip(sc, sc[1:]):   # one scene at a time, and widgets a breath apart: trim the first one if it stays valid
        if y['t0'] - x['t1'] >= gap - EPS: continue
        rng = _range(x, lib)
        n1 = y['t0'] - gap
        if rng and n1 - x['t0'] >= rng[0] - EPS and x['hit'] <= n1 - hit_out + EPS:
            notes.append(f"{x['part']} {x['t0']}–{x['t1']} ends at {_r(n1)} (gap before {y['part']})")
            x['t1'] = _r(n1); _mend_item_times(x)
    return a, notes


def _mend_item_times(s):
    """Item times of a scene (`at` list, `aty`) kept inside it and rising, after its times moved."""
    sl = s.get('slots')
    if not isinstance(sl, dict): return
    t0, t1 = s['t0'], s['t1']
    at = sl.get('at')
    if isinstance(at, list) and at and all(isinstance(v, (int, float)) for v in at):
        if not all(t0 <= v <= t1 - .2 for v in at) or any(b <= a for a, b in zip(at, at[1:])):
            span = max(0.0, (t1 - .2) - (t0 + .05))
            sl['at'] = [_r(t0 + .05 + span * i / max(1, len(at) - 1)) for i in range(len(at))] if len(at) > 1 else [_r(min(max(at[0], t0), t1 - .2))]
    if isinstance(sl.get('aty'), (int, float)) and not (t0 <= sl['aty'] <= t1 - .2):
        sl['aty'] = _r(min(max(sl['aty'], t0), t1 - .2))
