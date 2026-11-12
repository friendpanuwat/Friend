"""edgecheck.py: for every draft, the bright lines of the SHEET that the pick's edge cuts (the drawing goes on past the crop)
— per side: how many sheet px of line run into the edge; and whether the sheet itself goes on beyond the cell (cell edge)."""
import sys, cv2, numpy as np
sys.path.insert(0, '.')
from cells import CELLS
from picks import P, THR
for id_, cat, nm, (f, x0, y0, x1, y1) in CELLS:
    G = cv2.imread(f, cv2.IMREAD_GRAYSCALE); g = G[y0:y1, x0:x1]; h, w = g.shape
    bx = [(int(a * w), int(b * h), int(c * w), int(d * h)) for a, b, c, d in P[id_]]
    mk = np.zeros_like(g); [cv2.rectangle(mk, (a, b), (c - 1, d - 1), 1, -1) for a, b, c, d in bx]
    band = mk & (1 - cv2.erode(mk, np.ones((3, 3), np.uint8)))
    L = (g > THR.get(id_, 185) * .85).astype(np.uint8)
    hit = band & L
    # sides of the union's bounding box
    X0, Y0, X1, Y1 = min(b[0] for b in bx), min(b[1] for b in bx), max(b[2] for b in bx), max(b[3] for b in bx)
    ys, xs = np.nonzero(hit); out = {}
    for y, x in zip(ys, xs):
        s = 't' if y <= Y0 + 1 else 'b' if y >= Y1 - 2 else 'l' if x <= X0 + 1 else 'r' if x >= X1 - 2 else 'in'
        out[s] = out.get(s, 0) + 1
    # is the cut at the cell's own edge (the sheet cuts it) or inside the cell (our crop cuts it)?
    cell = {k: v for k, v in out.items() if (k == 't' and Y0 <= 1) or (k == 'b' and Y1 >= h - 1) or (k == 'l' and X0 <= 1) or (k == 'r' and X1 >= w - 1)}
    if out: print(f'{id_:10s} {out}  at cell edge: {cell}')
