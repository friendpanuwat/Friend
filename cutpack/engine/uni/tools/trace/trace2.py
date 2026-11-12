"""trace every pick: lines (bright cores, even-odd), body (silhouette), mid (the sheet's grey fills inside the body)."""
import sys, json, cv2, numpy as np
sys.path.insert(0, '.')
from cells import CELLS
from picks import P, ACC, THR, DROP, MINA, THICK, TB, EDGE
S = 5; out = {}
for id_, cat, nm, (f, x0, y0, x1, y1) in CELLS:
    g = cv2.imread(f, cv2.IMREAD_GRAYSCALE)[y0:y1, x0:x1]; h, w = g.shape
    bx = [(int(a * w), int(b * h), int(c * w), int(d * h)) for a, b, c, d in P[id_]]
    X0, Y0, X1, Y1 = min(b[0] for b in bx), min(b[1] for b in bx), max(b[2] for b in bx), max(b[3] for b in bx)
    mk = np.zeros_like(g); [cv2.rectangle(mk, (a, b), (c, d), 1, -1) for a, b, c, d in bx]
    g = (g * mk)[Y0:Y1, X0:X1]
    u = cv2.GaussianBlur(cv2.resize(g, None, fx=S, fy=S, interpolation=cv2.INTER_CUBIC), (0, 0), 1.1)
    L = (u > THR.get(id_, 185)).astype(np.uint8)
    if id_ in EDGE:
        e = cv2.Canny(u.astype(np.uint8), 35, 90); L |= (cv2.dilate(e, np.ones((7, 7), np.uint8)) > 0).astype(np.uint8)
        L = cv2.morphologyEx(L, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
    # drop the cell's title: pieces that lie wholly in the top middle band
    tb = (int((.12 - X0 / w) * w * S), 0, int((.88 * w - X0) * S), int((TB.get(id_, .5) * h - Y0) * S))
    n, lab, st, _ = cv2.connectedComponentsWithStats(L, 8)
    for i in range(1, n):
        x, y, ww, hh, a = st[i]
        inbox = lambda B: any(x >= (b0 * w - X0) * S and x + ww <= (b2 * w - X0) * S and y >= (b1 * h - Y0) * S and y + hh <= (b3 * h - Y0) * S for b0, b1, b2, b3 in B)
        if a < S * S * MINA.get(id_, 1.5) or (x >= tb[0] and x + ww <= tb[2] and y + hh <= tb[3]) or inbox(DROP.get(id_, [])): L[lab == i] = 0
    inv = np.pad((1 - L).astype(np.uint8), 1, constant_values=1); m2 = np.zeros((inv.shape[0] + 2, inv.shape[1] + 2), np.uint8)
    cv2.floodFill(inv, m2, (0, 0), 2); sil = (inv[1:-1, 1:-1] != 2).astype(np.uint8)
    sil = cv2.morphologyEx(sil, cv2.MORPH_CLOSE, np.ones((3, 3), np.uint8))
    mid = ((u > 70) & (u <= 185) & (sil > 0) & (L == 0)).astype(np.uint8)
    mid = cv2.morphologyEx(mid, cv2.MORPH_OPEN, np.ones((5, 5), np.uint8))
    am = np.zeros_like(L)
    for a, b, c, d in ACC.get(id_, []):
        am[max(0, int((b * h - Y0) * S)):max(0, int((d * h - Y0) * S)), max(0, int((a * w - X0) * S)):max(0, int((c * w - X0) * S))] = 1
    inner = ((sil > 0) & (L == 0)).astype(np.uint8)
    n2, lab2, st2, ce2 = cv2.connectedComponentsWithStats(inner, 4)
    acc = np.zeros_like(L)
    for i in range(1, n2):
        r = lab2 == i
        if am[r].mean() > .6: acc[r] = 1          # a whole region (most of it in the box) takes the accent, never a box of it
    if id_ in THICK:
        dt = cv2.distanceTransform(L, cv2.DIST_L2, 3); thick = cv2.dilate((dt > 2.6 * S).astype(np.uint8), np.ones((5, 5), np.uint8)) & L
        acc |= thick; L = (L & (1 - thick)).astype(np.uint8)
    acc = cv2.morphologyEx(acc, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
    mid = (mid & (1 - acc)).astype(np.uint8)
    def path(m, mode, tol=1.0, minA=.4):
        cs, _ = cv2.findContours(m, mode, cv2.CHAIN_APPROX_NONE); d = []
        for c in cs:
            if cv2.contourArea(c) < S * S * minA: continue
            a = cv2.approxPolyDP(c, tol, True).reshape(-1, 2) / S
            if len(a) >= 3: d.append('M' + 'L'.join(f'{x:.1f} {y:.1f}' for x, y in a) + 'Z')
        return ''.join(d)
    out[id_] = {'cat': cat, 'name': nm, 'w': round(L.shape[1] / S, 1), 'h': round(L.shape[0] / S, 1),
                'lines': path(L, cv2.RETR_CCOMP), 'body': path(sil, cv2.RETR_EXTERNAL), 'mid': '', 'acc': path(acc, cv2.RETR_CCOMP, 1.2, 3)}
    cv2.imwrite(f'tr_{id_}.png', np.dstack([mid * 120 + acc * 40, sil * 60 + L * 195 + acc * 120, L * 255 + acc * 200]))
json.dump(out, open('traced.json', 'w'))
print(len(out), sum(len(v['lines']) + len(v['body']) + len(v['mid']) for v in out.values()) // 1024, 'KiB')
