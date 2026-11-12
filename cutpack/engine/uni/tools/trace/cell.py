"""cell.py out id[:x0,y0,x1,y1] … : the whole cell (or a part, cell fractions) with a .05 grid, enlarged."""
import sys, cv2, numpy as np
sys.path.insert(0, '.')
from cells import CELLS
from PIL import Image, ImageDraw
out = sys.argv[1]; rows = []
C = {c[0]: c for c in CELLS}
for arg in sys.argv[2:]:
    id_, _, part = arg.partition(':')
    f, x0, y0, x1, y1 = C[id_][3]; g = cv2.imread(f, cv2.IMREAD_GRAYSCALE)[y0:y1, x0:x1]; h, w = g.shape
    a, b, c, d = [float(v) for v in part.split(',')] if part else (0, 0, 1, 1)
    s = g[int(b * h):int(d * h), int(a * w):int(c * w)]; K = max(1, int(900 / max(s.shape)))
    im = Image.fromarray(cv2.resize(s, None, fx=K, fy=K, interpolation=cv2.INTER_NEAREST)).convert('RGB'); dr = ImageDraw.Draw(im)
    step = .05 if (c - a) > .3 else .01
    for fx in np.arange(0, 1.0001, step):
        px = (fx - a) * w * K
        if 0 <= px < im.width: dr.line([(px, 0), (px, im.height)], fill=(200, 50, 50)); dr.text((px + 2, 2), f'{fx:.2f}', fill=(255, 80, 80))
    for fy in np.arange(0, 1.0001, step):
        py = (fy - b) * h * K
        if 0 <= py < im.height: dr.line([(0, py), (im.width, py)], fill=(50, 110, 220)); dr.text((2, py + 2), f'{fy:.2f}', fill=(90, 160, 255))
    dr.text((4, im.height - 14), f'{id_} {w}x{h}', fill=(255, 255, 0)); rows.append(im)
W = sum(r.width for r in rows); H = max(r.height for r in rows); M = Image.new('RGB', (W, H)); x = 0
for r in rows: M.paste(r, (x, 0)); x += r.width
M.save(out, quality=88); print(M.size)
