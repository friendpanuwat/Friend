#!/usr/bin/env python3
"""Cut the speaker out of the clip's own frames (assets/model/u2netp.onnx, CPU, ~0.3 s per frame).

usage:
  cutout.py stills <project> t1,t2,...      → <project>/cutouts/c_<t>.png  full 1080×1920 RGBA (transparent outside the person)
                                              + prints the person's box (x0 y0 x1 y1) so scenes can place it
  cutout.py mattes <project> <ranges.json>  → <project>/mattes/mNNNNN.png  one grey mask per frame (540×960) for every frame
                                              inside the ranges [[t0, t1], ...] — used by titles that sit BEHIND the speaker
Frames come from <project>/src_frames (pipeline.sh frames). Colours are untouched: the cut-out keeps the frame's own pixels.
"""
import json, os, sys
import numpy as np
from PIL import Image, ImageFilter
import onnxruntime as ort

HERE = os.path.dirname(os.path.abspath(__file__))
MODEL = os.path.join(HERE, '..', 'assets', 'model', 'u2netp.onnx')
FPS = 30
_sess = None


def session():
    global _sess
    if _sess is None:
        o = ort.SessionOptions(); o.log_severity_level = 3
        _sess = ort.InferenceSession(MODEL, o, providers=['CPUExecutionProvider'])
    return _sess


def mask(im):
    """RGB PIL image → float mask 0..1 at the image size (soft edge, background pushed to 0)."""
    s = session()
    x = np.asarray(im.resize((320, 320), Image.LANCZOS), np.float32) / 255.
    x = ((x - [0.485, 0.456, 0.406]) / [0.229, 0.224, 0.225]).transpose(2, 0, 1)[None].astype(np.float32)
    m = s.run(None, {s.get_inputs()[0].name: x})[0][0, 0]
    m = (m - m.min()) / max(1e-6, m.max() - m.min())
    m = np.clip((m - .38) / .26, 0, 1)                     # a firm edge: no halo of room round the hair
    a = Image.fromarray((m * 255).astype(np.uint8)).resize(im.size, Image.BICUBIC).filter(ImageFilter.GaussianBlur(1.4))
    return a


def frame(proj, t):
    f = min(max(1, round(t * FPS) + 1), len(os.listdir(os.path.join(proj, 'src_frames'))))
    return Image.open(os.path.join(proj, 'src_frames', f's{f:05d}.jpg')).convert('RGB')


def measure(a):
    """person box + an estimate of the head (centre x, centre y, radius) from the mask — cut() in the kit places by the head"""
    on = a > 110; ys = np.where(on.any(1))[0]; xs = np.where(on.any(0))[0]
    if not len(ys): return {'box': [0, 0, 0, 0], 'head': [540, 700, 120]}
    y0, y1, x0, x1 = int(ys[0]), int(ys[-1]), int(xs[0]), int(xs[-1])
    r = min(y1, y0 + max(40, (y1 - y0) // 10)); row = np.where(on[r])[0]   # a row through the forehead / eyes
    hr = max(40, (row[-1] - row[0]) // 2) if len(row) else 120; hx = int((row[0] + row[-1]) // 2) if len(row) else (x0 + x1) // 2
    return {'box': [x0, y0, x1, y1], 'head': [hx, int(y0 + hr * 1.2), int(hr)]}


def stills(proj, times):
    out = os.path.join(proj, 'cutouts'); os.makedirs(out, exist_ok=True)
    ip = os.path.join(out, 'index.json'); idx = json.load(open(ip)) if os.path.exists(ip) else {}
    for t in times:
        im = frame(proj, t); a = mask(im)
        rgba = im.copy(); rgba.putalpha(a)
        name = f'c_{t:.2f}.png'; rgba.save(os.path.join(out, name), optimize=True)
        info = measure(np.asarray(a)); idx[f'{t:.2f}'] = info
        print(f'cutouts/{name}  person box x {info["box"][0]}-{info["box"][2]} y {info["box"][1]}-{info["box"][3]} · head centre {info["head"][:2]} r {info["head"][2]}')
    json.dump(idx, open(os.path.join(out, 'index.json'), 'w'))


def mattes(proj, ranges):
    out = os.path.join(proj, 'mattes'); os.makedirs(out, exist_ok=True)
    n = len(os.listdir(os.path.join(proj, 'src_frames'))); done = 0
    for t0, t1 in ranges:
        for f in range(max(0, int(t0 * FPS) - 1), min(n, int(t1 * FPS) + 2)):
            p = os.path.join(out, f'm{f:05d}.png')
            if os.path.exists(p): continue
            im = Image.open(os.path.join(proj, 'src_frames', f's{f + 1:05d}.jpg')).convert('RGB').resize((540, 960), Image.BILINEAR)
            a = mask(im).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(.8))   # pull the edge in a hair: no room colour round the head
            m = Image.new('LA', a.size, 255); m.putalpha(a); m.save(p); done += 1   # alpha = person (CSS masks read alpha)
    print(f'mattes: {done} new · {len(os.listdir(out))} total in {out}')


def track(proj, step=3):
    """head centre + radius every few frames from the person mask, smoothed → track.json [[t, x, y, r], ...]"""
    n = len(os.listdir(os.path.join(proj, 'src_frames'))); out = []
    for f in range(0, n, step):
        im = Image.open(os.path.join(proj, 'src_frames', f's{f + 1:05d}.jpg')).convert('RGB').resize((540, 960), Image.BILINEAR)
        hx, hy, hr = measure(np.asarray(mask(im)))['head']; out.append([f / FPS, hx * 2, hy * 2, hr * 2])
    a = np.array(out, float); k = 5   # moving average over ~0.5 s: steady, but still follows a lean
    for c in (1, 2, 3): a[:, c] = np.convolve(np.pad(a[:, c], k, mode='edge'), np.ones(2 * k + 1) / (2 * k + 1), 'valid')
    json.dump([[round(v, 2) for v in r] for r in a.tolist()], open(os.path.join(proj, 'track.json'), 'w'))
    print(f'track: {len(a)} points · head x {a[:,1].min():.0f}-{a[:,1].max():.0f} y {a[:,2].min():.0f}-{a[:,2].max():.0f}')


if __name__ == '__main__':
    mode, proj = sys.argv[1], os.path.abspath(sys.argv[2])
    if mode == 'stills': stills(proj, [float(x) for x in sys.argv[3].split(',') if x.strip()])
    elif mode == 'mattes': mattes(proj, json.load(open(sys.argv[3])))
    elif mode == 'track': track(proj)
    else: sys.exit(__doc__)
