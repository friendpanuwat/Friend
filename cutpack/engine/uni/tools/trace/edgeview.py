"""edgeview.py out ids… : each cell with the pick boxes (green), the cut points (red), and a .05 grid."""
import sys, cv2, numpy as np
sys.path.insert(0, '.')
from cells import CELLS
from picks import P, THR
from PIL import Image, ImageDraw
out = sys.argv[1]; ids = sys.argv[2:]; tiles = []
for id_, cat, nm, (f, x0, y0, x1, y1) in CELLS:
    if ids and id_ not in ids: continue
    g = cv2.imread(f, cv2.IMREAD_GRAYSCALE)[y0:y1, x0:x1]; h, w = g.shape
    bx = [(int(a * w), int(b * h), int(c * w), int(d * h)) for a, b, c, d in P[id_]]
    mk = np.zeros_like(g); [cv2.rectangle(mk, (a, b), (c - 1, d - 1), 1, -1) for a, b, c, d in bx]
    band = mk & (1 - cv2.erode(mk, np.ones((3, 3), np.uint8))); hit = band & (g > THR.get(id_, 185) * .85)
    K = 480 / w; im = Image.fromarray(cv2.cvtColor(g, cv2.COLOR_GRAY2RGB)).resize((480, int(h * K))); d = ImageDraw.Draw(im)
    for a, b, c, e in bx: d.rectangle((a * K, b * K, c * K, e * K), outline=(0, 255, 0), width=2)
    for y, x in zip(*np.nonzero(hit)): d.ellipse((x * K - 3, y * K - 3, x * K + 3, y * K + 3), fill=(255, 0, 0))
    for v in np.arange(0, 1.0001, .1): d.line([(v * 480, 0), (v * 480, 6)], fill=(255, 200, 0)); d.text((v * 480 + 1, 6), f'{v:.1f}', fill=(255, 200, 0)); d.line([(0, v * h * K), (6, v * h * K)], fill=(0, 200, 255)); d.text((8, v * h * K), f'{v:.1f}', fill=(0, 200, 255))
    d.text((4, im.height - 14), id_, fill=(255, 255, 0)); tiles.append(im)
cols = 3; W = 480 * cols; rows = [tiles[i:i + cols] for i in range(0, len(tiles), cols)]
H = sum(max(t.height for t in r) for r in rows); M = Image.new('RGB', (W, H), (40, 40, 40)); y = 0
for r in rows:
    for i, t in enumerate(r): M.paste(t, (i * 480, y))
    y += max(t.height for t in r)
M.save(out, quality=85); print(M.size)
