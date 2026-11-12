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
    for s in a['scenes']:
        if isinstance(s, dict) and isinstance(s.get('t0'), (int, float)): s['_t0'] = s['t0']   # to move camera cuts along
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
    if kind == 'card': notes += _fit_cards(a, lib, dur, hit_in, hit_out)
    _move_cuts(a, notes)
    return a, notes


def _move_cuts(a, notes):
    """An editorial cut-pull sits exactly at a card's t0 (the cut hides it): when the card moved, the cut moves with it;
    when the card was dropped, the pull is soft."""
    moved = {s.pop('_t0'): s['t0'] for s in a['scenes'] if isinstance(s, dict) and '_t0' in s}
    dropped = a.pop('_dropped', [])
    for c in a.get('camera') or []:
        if not (isinstance(c, dict) and c.get('cut') and isinstance(c.get('t'), (int, float))): continue
        old = next((t for t in moved if abs(t - c['t']) < 1e-6), None)
        if old is not None and abs(moved[old] - c['t']) > 1e-6:
            notes.append(f"camera cut {c['t']} → {moved[old]} (its card moved)"); c['t'] = moved[old]
        elif old is None and any(abs(t - c['t']) < 1e-6 for t in dropped):
            c['cut'] = False; notes.append(f"camera pull {c['t']} soft (its card was dropped)")


def _fit_cards(a, lib, dur, hit_in, hit_out):
    """Editorial (Friend 2026-11-05: "เห็นหน้าคนน้อยเกินไป" — a clip with cards over 74 % of it). A clip over the top share is
    cut back to about cardAim: cards shortened toward their part's shortest length, each placed so the face before and after
    it is shared evenly (no face stretch past arollMax if it can be helped), then B14 text cards dropped (then others).
    Then every two cards keep at least faceMin of face between them."""
    notes = []
    sc = lambda: sorted((s for s in a['scenes'] if isinstance(s, dict) and _range(s, lib)), key=lambda s: s['t0'])
    share = lambda: sum(s['t1'] - s['t0'] for s in sc()) / dur

    def place(s, L, before, after):
        """Card s at length L inside its own time, holding its hit, centred in the face time around it."""
        L = max(L, _range(s, lib)[0], hit_in + hit_out)
        lo0, hi0 = max(s['t0'], s['hit'] + hit_out - L), min(s['t1'] - L, s['hit'] - hit_in)
        if hi0 < lo0 - EPS: return False
        t0 = min(max((before + after - L) / 2, lo0), hi0)
        if (abs(t0 - s['t0']) < EPS and abs(t0 + L - s['t1']) < EPS): return False
        s['t0'], s['t1'] = _r(t0), _r(t0 + L); _mend_item_times(s); return True

    def drop(s, why):
        a['scenes'].remove(s); notes.append(f"{s['part']} {s['t0']}–{s['t1']} dropped ({why})")
        a.setdefault('_dropped', []).append(s.get('_t0', s['t0']))

    def neighbours(cards, k):
        return (cards[k - 1]['t1'] if k else RULES['firstAt'] - .4), (cards[k + 1]['t0'] if k + 1 < len(cards) else dur)

    hi, aim = RULES['cardShare'][1], RULES['cardAim']
    if share() > hi:
        cards = sc()
        need = (share() - aim) * dur   # shorten every card in proportion to how much it can give
        room = [(s['t1'] - s['t0']) - max(_range(s, lib)[0], hit_in + hit_out) for s in cards]
        total = sum(max(0, v) for v in room)
        f = min(1.0, need / total) if total > EPS else 0
        for k, s in enumerate(cards):
            if room[k] > EPS and place(s, (s['t1'] - s['t0']) - room[k] * f, *neighbours(cards, k)):
                notes.append(f"{s['part']} → {s['t0']}–{s['t1']} (cards were over {hi:.0%} of the clip)")
        while share() > aim + EPS:   # still too much: drop cards, B14 text first, never leaving a long face stretch
            cards = sc()
            cand = [k for k in range(len(cards)) if neighbours(cards, k)[1] - neighbours(cards, k)[0] <= RULES['arollMax'] + EPS]
            if not cand: break
            k = min(cand, key=lambda k: (not cards[k]['part'].startswith('B14'), neighbours(cards, k)[1] - neighbours(cards, k)[0]))
            drop(cards[k], f"cards {share():.0%} of the clip")
    changed = True
    while changed:   # a breath of face between two cards
        changed = False
        cards = sc()
        for k in range(len(cards) - 1):
            x, y = cards[k], cards[k + 1]
            if y['t0'] - x['t1'] >= RULES['faceMin'] - EPS: continue
            want = RULES['faceMin'] - (y['t0'] - x['t1'])
            if place(x, (x['t1'] - x['t0']) - want, neighbours(cards, k)[0], y['t0'] - RULES['faceMin']) and y['t0'] - x['t1'] >= RULES['faceMin'] - EPS:
                notes.append(f"{x['part']} ends at {x['t1']} (face before {y['part']})"); changed = True; break
            if place(y, (y['t1'] - y['t0']) - want, x['t1'] + RULES['faceMin'], neighbours(cards, k + 1)[1]) and y['t0'] - x['t1'] >= RULES['faceMin'] - EPS:
                notes.append(f"{y['part']} starts at {y['t0']} (face after {x['part']})"); changed = True; break
            # neither can give: drop one, B14 text first, if that leaves no face stretch past arollMax
            opts = [j for j in (k, k + 1) if neighbours(cards, j)[1] - neighbours(cards, j)[0] <= RULES['arollMax'] + EPS]
            if opts:
                j = min(opts, key=lambda j: (not cards[j]['part'].startswith('B14'), cards[j]['t1'] - cards[j]['t0']))
                drop(cards[j], 'too little face between two cards'); changed = True; break
    return notes


def _mend_item_times(s):
    """Item times of a scene (`at` list, `aty`) kept inside it and rising, after its times moved."""
    sl = s.get('slots')
    if not isinstance(sl, dict): return
    t0, t1 = s['t0'], s['t1']
    at = sl.get('at')
    if isinstance(at, list) and at and all(isinstance(v, (int, float)) for v in at):
        if not all(t0 <= v <= t1 - .21 for v in at) or any(b <= a for a, b in zip(at, at[1:])):
            span = max(0.0, (t1 - .21) - (t0 + .05))   # .21: a hundredth inside the checker's t1 - .2 (rounding)
            sl['at'] = [_r(t0 + .05 + span * i / max(1, len(at) - 1)) for i in range(len(at))] if len(at) > 1 else [_r(min(max(at[0], t0), t1 - .21))]
    if isinstance(sl.get('aty'), (int, float)) and not (t0 <= sl['aty'] <= t1 - .21):
        sl['aty'] = _r(min(max(sl['aty'], t0), t1 - .21))
