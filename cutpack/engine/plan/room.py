#!/usr/bin/env python3
"""Where an overlay widget can sit, moment by moment (Friend 2026-11-05).

The face finder (faces.py) samples the face every 0.5 s into a track: [[t, [x0, y0, x1, y1] or null], …]. A widget is
placed for its own time on screen, not for the whole clip: the face box is the union of the samples during the widget
(one sample either side), grown by a margin and by the camera zoom at that time (the plan's push/pull moves, plus
breathing), so it never covers the face, mid-push included. Hair may sit under a widget; the face may not.

Order (Friend 2026-11-05: "ถ้ามีพื้นที่ว่างบนหัวก็เอาไว้บนหัว … ตรงหน้าอกก็ได้ … ใส่ตรงที่มีพื้นที่ว่างเท่านั้น"):
  1. above the head   short widget 600×190 at y 150, in the middle of the frame, if it ends 20 px above the (zoomed) face
  2. at chest level    short widget between the zoomed chin (+40) and the subtitles (−20)
  3. beside the head   narrow widget 210×380, left if there is room, else right (never in the app's button strip)
  4. no room          the widget is left out (fallback.py drops it); the checker counts density only where there is room
  — except in a tight clip (room for less than SHRINK_IF of it): there the speaker shrinks for the widget instead
    (Friend approved the demo 2026-11-05, "ย่อภาพคนพูดชั่วคราว"): the widget sits at the top, the video scales to SHRINK['s']
    over the dark glow backdrop and grows back after it (plan2timeline emits frame()); density counts the whole clip
The size the AI chose is tried first (short: 1 then 2; narrow: 3), then the rest of the order.
No geometry here needs OpenCV, so the planner, the checker and the prompt all use this file.
"""
import numpy as np

W, H = 1080, 1920
TOPBAR, RIGHT_UI, RIGHT_Y, BOTTOM_UI = 150, 940, (860, 1620), 1620
SHORT, NARROW = (600, 190), (210, 380)
BREATH = 1.014                       # CAM.breath in motion.js: the camera always breathes up to this
ZMAX, ORIGIN = 1.08 * BREATH, (540, 864)   # CAM.max × breathing; transform-origin 50% 45% in engine_head.html
PUSH_Z, PULL_S = 1.05, 1.2           # a push without z goes to 1.05; a pull takes about this long to get back to 1.0
STEP = .5                            # seconds between face samples (every 15 frames at 30 fps)
MARGIN = .06                         # grown by this share of the face width on every side


def zoomed(box, z=ZMAX):
    ox, oy = ORIGIN
    return [ox + (box[0] - ox) * z, oy + (box[1] - oy) * z, ox + (box[2] - ox) * z, oy + (box[3] - oy) * z]


def grow(b):
    m = MARGIN * (b[2] - b[0])
    return [max(0, b[0] - m), max(0, b[1] - m), min(W, b[2] + m), min(H, b[3] + m)]


def window_box(track, t0, t1, face_box):
    """The face during [t0, t1] (one sample either side), with the margin. No face seen then → the whole-clip box."""
    bs = [b for t, b in track if t0 - STEP - 1e-6 <= t <= t1 + STEP + 1e-6 and b]
    if not bs: return list(face_box)
    a = np.array(bs, dtype=float)
    return grow([a[:, 0].min(), a[:, 1].min(), a[:, 2].max(), a[:, 3].max()])


def zoom_at(camera, t0, t1):
    """The biggest zoom during [t0, t1] from the plan's camera ({'push': t, 'z'} / {'pull': t}), times breathing.
    A push counts from its start; a pull only once it has had time to get back to 1.0."""
    z0, inside = 1.0, []
    for c in sorted(camera or [], key=lambda c: c['push'] if 'push' in c else c['pull']):
        if 'push' in c:
            if c['push'] <= t0: z0 = c.get('z', PUSH_Z)
            elif c['push'] <= t1: inside.append(c.get('z', PUSH_Z))
        elif c['pull'] + PULL_S <= t0: z0 = 1.0
    return max([z0] + inside) * BREATH


def spots(keep, sub_top):
    """Every place a widget fits next to this keep-out box: {'top' | 'chest': short pos, 'left' | 'right': narrow pos}."""
    kx0, ky0, kx1, ky1 = keep
    out = {}
    sx = (W - SHORT[0]) // 2   # the middle of the frame, like the subtitles (Friend 2026-11-05: "ทำไมไม่อยู่ตรงกลางคลิป")
    if TOPBAR + SHORT[1] + 20 <= ky0: out['top'] = {'x': sx, 'y': TOPBAR}
    band0, band1 = ky1 + 40, sub_top - 20
    if band1 - band0 >= SHORT[1]: out['chest'] = {'x': sx, 'y': round(band0 + (band1 - band0 - SHORT[1]) / 2)}
    ny = int(max(TOPBAR + 10, min(ky0 + 40, sub_top - 20 - NARROW[1])))
    right_max = RIGHT_UI if ny + NARROW[1] > RIGHT_Y[0] else W - 36   # the button strip only matters at its own height
    if ny + NARROW[1] <= sub_top - 20:
        if kx0 - 20 >= 36 + NARROW[0]: out['left'] = {'x': 36, 'y': ny}
        elif kx1 + 20 + NARROW[0] <= right_max: out['right'] = {'x': int(kx1 + 20), 'y': ny}
    return out


ORDER = {'short': [('short', 'top'), ('short', 'chest'), ('narrow', 'left'), ('narrow', 'right')],
         'narrow': [('narrow', 'left'), ('narrow', 'right'), ('short', 'top'), ('short', 'chest')]}


def keep_out(track, t0, t1, camera, face_box):
    return zoomed(window_box(track, t0, t1, face_box), zoom_at(camera, t0, t1))


def place(track, t0, t1, size, camera, sub_top, face_box):
    """→ (size, pos, where) for a widget on screen during [t0, t1], or None when there is no room then."""
    free = spots(keep_out(track, t0, t1, camera, face_box), sub_top)
    for sz, where in ORDER.get(size, ORDER['short']):
        if where in free: return sz, free[where], where
    return None


FREE_MAX, FREE_MIN = (760, 380), (180, 150)   # way 'hero' (Friend 2026-11-07): the AI sizes its widget to the room it gets


def free_spots(keep, sub_top):
    """Every free box around this keep-out box, as big as it can be (capped at FREE_MAX): [(where, x, y, W, H)].
    Above the head and at chest level the box is centred like the subtitles; beside the head it hugs the side."""
    kx0, ky0, kx1, ky1 = keep
    out = []
    h = min(FREE_MAX[1], ky0 - 20 - TOPBAR)
    if h >= FREE_MIN[1]: out.append(('top', (W - FREE_MAX[0]) // 2, TOPBAR, FREE_MAX[0], int(h)))
    band0, band1 = ky1 + 40, sub_top - 20
    h = min(FREE_MAX[1], band1 - band0)
    if h >= FREE_MIN[1]: out.append(('chest', (W - FREE_MAX[0]) // 2, int(band1 - h), FREE_MAX[0], int(h)))
    y = int(max(TOPBAR + 10, ky0)); h = int(min(FREE_MAX[1], sub_top - 20 - y))
    right_max = RIGHT_UI if y + h > RIGHT_Y[0] else W - 36
    w = int(min(FREE_MAX[0], kx0 - 20 - 36))
    if w >= FREE_MIN[0] and h >= FREE_MIN[1]: out.append(('left', 36, y, w, h))
    w = int(min(FREE_MAX[0], right_max - (kx1 + 20)))
    if w >= FREE_MIN[0] and h >= FREE_MIN[1]: out.append(('right', int(kx1 + 20), y, w, h))
    return out


def place_free(track, t0, t1, camera, sub_top, face_box, box=None):
    """Way 'hero': → {'where', 'x', 'y', 'W', 'H'} — the biggest free box during [t0, t1]; with `box` ({'W', 'H'}, the size
    the scene was designed for), the first free place in the usual order where that box fits (centred in it). None: no room."""
    free = free_spots(keep_out(track, t0, t1, camera, face_box), sub_top)
    if not free: return None
    if box is None:
        where, x, y, w, h = max(free, key=lambda f: f[3] * f[4])
        return {'where': where, 'x': x, 'y': y, 'W': w, 'H': h}
    for where, x, y, w, h in sorted(free, key=lambda f: ['top', 'chest', 'left', 'right'].index(f[0])):
        if box['W'] <= w and box['H'] <= h:
            return {'where': where, 'x': int(x + (w - box['W']) / 2) if where in ('top', 'chest') else (x if where == 'left' else x),
                    'y': int(y + (h - box['H']) / 2) if where != 'top' else y, 'W': box['W'], 'H': box['H']}
    return None


def answer_camera(cam):
    """The AI's camera list ({'move', 't', 'z'}) in the plan's form ({'push': t, 'z'} / {'pull': t})."""
    return [{'push': c['t'], **({'z': c['z']} if c.get('z') else {})} if c.get('move') == 'push' else {'pull': c['t']} for c in cam or []]


def windows(track, dur, sub_top, face_box):
    """The times with room for a widget when the camera is not pushed in, merged into ranges:
    [{'t0', 't1', 'sizes': ['short', 'narrow']}] (for the prompt and the density check)."""
    out, t = [], 0.0
    while t < dur - 1e-6:
        t1 = min(dur, t + STEP)
        free = spots(zoomed(window_box(track, t, t1, face_box), BREATH), sub_top)
        sizes = sorted({'short' if w in ('top', 'chest') else 'narrow' for w in free}, key=['short', 'narrow'].index)
        if sizes:
            if out and abs(out[-1]['t1'] - t) < 1e-6 and out[-1]['sizes'] == sizes: out[-1]['t1'] = round(t1, 2)
            else: out.append({'t0': round(t, 2), 't1': round(t1, 2), 'sizes': sizes})
        t = t1
    return out


SHRINK_IF = .8                       # a clip with room for less than this share of its length uses the speaker shrink
SHRINK = {'s': .8, 'y': 1150, 'r': 44, 'd': .45, 'o': .45, 'pos': {'x': (W - SHORT[0]) // 2, 'y': TOPBAR}}
# s .8 and centre y 1150: the video's top edge comes down to 382, below the widget (150–340), and its bottom stays at 1918


def tight(track, dur, sub_top, face_box):
    """True when the face leaves room for a widget during less than SHRINK_IF of the clip."""
    return sum(b - a for a, b in merged(windows(track, dur, sub_top, face_box))) < SHRINK_IF * dur


def shrink_windows(scenes, dur, join=.8):
    """[t0, t1] of each speaker shrink: around each shrink widget (d before, o after), neighbours closer than `join`
    seconds sharing one, so the speaker does not bounce."""
    out = []
    for s in sorted((s for s in scenes if s.get('shrink')), key=lambda s: s['t0']):
        a, b = max(0.0, s['t0'] - SHRINK['d'] - .05), min(dur, s['t1'] + SHRINK['o'] + .05)
        if out and a - out[-1][1] < join: out[-1][1] = max(out[-1][1], b)
        else: out.append([a, b])
    return [(round(a, 3), round(b, 3)) for a, b in out]


def roomy(wins, a, b):
    """The parts of [a, b] that have room, as (start, end) pairs."""
    return [(max(a, w['t0']), min(b, w['t1'])) for w in wins if min(b, w['t1']) > max(a, w['t0'])]


def merged(wins):
    """Room ranges whatever the size, joined where they touch."""
    out = []
    for w in wins:
        if out and w['t0'] <= out[-1][1] + 1e-6: out[-1][1] = max(out[-1][1], w['t1'])
        else: out.append([w['t0'], w['t1']])
    return [tuple(x) for x in out]
