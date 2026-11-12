"""dbg.py out ids… : per id, source crop | traced (grey body, white lines, lime accent, red accent-ink) with a grid in CELL fractions."""
import sys, cv2, numpy as np
sys.path.insert(0, '.')
from cells import CELLS
from picks import P
from PIL import Image, ImageDraw
out = sys.argv[1]; ids = sys.argv[2:]; rows = []
for id_, cat, nm, (f, x0, y0, x1, y1) in CELLS:
    if id_ not in ids: continue
    g = cv2.imread(f, cv2.IMREAD_GRAYSCALE)[y0:y1, x0:x1]; h, w = g.shape
    bx = [(int(a * w), int(b * h), int(c * w), int(d * h)) for a, b, c, d in P[id_]]
    X0, Y0, X1, Y1 = min(b[0] for b in bx), min(b[1] for b in bx), max(b[2] for b in bx), max(b[3] for b in bx)
    src = g[Y0:Y1, X0:X1]; tr = cv2.imread(f'tr_{id_}.png')
    K = 3 if src.shape[1] < 250 else 2
    a = cv2.resize(cv2.cvtColor(src, cv2.COLOR_GRAY2BGR), None, fx=K, fy=K, interpolation=cv2.INTER_NEAREST)
    b = cv2.resize(tr, (a.shape[1], a.shape[0]), interpolation=cv2.INTER_AREA)
    im = Image.fromarray(np.hstack([a, b])[:, :, ::-1]); d = ImageDraw.Draw(im)
    for fx in np.arange(0, 1.0001, .05):
        px = (fx * w - X0) * K
        if 0 <= px < a.shape[1]:
            for o in (0, a.shape[1]): d.line([(px + o, 0), (px + o, a.shape[0])], fill=(255, 60, 60) if round(fx * 20) % 2 == 0 else (120, 40, 40)); d.text((px + o + 2, 2), f'{fx:.2f}', fill=(255, 90, 90))
    for fy in np.arange(0, 1.0001, .05):
        py = (fy * h - Y0) * K
        if 0 <= py < a.shape[0]:
            d.line([(0, py), (2 * a.shape[1], py)], fill=(60, 140, 255) if round(fy * 20) % 2 == 0 else (30, 60, 120)); d.text((2, py + 2), f'{fy:.2f}', fill=(90, 160, 255))
    d.text((4, a.shape[0] - 14), id_, fill=(255, 255, 0)); rows.append(im)
W = max(r.width for r in rows); H = sum(r.height for r in rows); M = Image.new('RGB', (W, H), (40, 40, 40)); y = 0
for r in rows: M.paste(r, (0, y)); y += r.height
M.save(out, quality=88); print(M.size)
