"""trace every pick: lines (bright cores, even-odd), body (silhouette), mid (the sheet's grey fills inside the body)."""
import sys, json, cv2, numpy as np
sys.path.insert(0, '.')
from cells import CELLS
from picks import P, ACC, THR, DROP, MINA, THICK, TB, EDGE, CLOSE, HOLE, GAP, SEAL
from picks import THICKB, THRB, DARK, ERASE, BCLOSE, SEALF, ACCC, HOLEF, HL, ACCGAP, FADE, HOLEMU, THICKA, ACCLMIN, ACCSMALL, BOPEN, ACCLEDGE
S = 5; out = {}
for id_, cat, nm, (f, x0, y0, x1, y1) in CELLS:
    g = cv2.imread(f, cv2.IMREAD_GRAYSCALE)[y0:y1, x0:x1]; h, w = g.shape
    bx = [(int(a * w), int(b * h), int(c * w), int(d * h)) for a, b, c, d in P[id_]]
    X0, Y0, X1, Y1 = min(b[0] for b in bx), min(b[1] for b in bx), max(b[2] for b in bx), max(b[3] for b in bx)
    mk = np.zeros_like(g); [cv2.rectangle(mk, (a, b), (c, d), 1, -1) for a, b, c, d in bx]
    g = (g * mk)[Y0:Y1, X0:X1]
    u = cv2.GaussianBlur(cv2.resize(g, None, fx=S, fy=S, interpolation=cv2.INTER_CUBIC), (0, 0), 1.1)
    H_, W_ = u.shape
    X = lambda v: int(round((v * w - X0) * S)); Y = lambda v: int(round((v * h - Y0) * S))
    box = lambda a, b, c, d: (slice(max(0, Y(b)), max(0, Y(d))), slice(max(0, X(a)), max(0, X(c))))
    def disc(cx, cy, r):
        m = np.zeros(u.shape, np.uint8); cv2.circle(m, (X(cx), Y(cy)), int(r * S), 1, -1); return m > 0
    thr = np.full(u.shape, THR.get(id_, 185), np.float32)
    for spec, tv in THRB.get(id_, []):
        if len(spec) == 4: thr[box(*spec)] = tv
        else: thr[disc(*spec)] = tv
    L = (u > thr).astype(np.uint8)
    if id_ in EDGE:
        e = cv2.Canny(u.astype(np.uint8), 22, 60); L |= (cv2.dilate(e, np.ones((7, 7), np.uint8)) > 0).astype(np.uint8)
        L = cv2.morphologyEx(L, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
    for spec, tv in DARK.get(id_, []):                       # a dark solid shape: smoothed, its speckle holes filled, its real hole kept
        b_ = box(*spec); m = (cv2.GaussianBlur(u, (0, 0), 3)[b_] < tv).astype(np.uint8)
        m = cv2.morphologyEx(m, cv2.MORPH_OPEN, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 7)))
        hn, hlab, hst, _ = cv2.connectedComponentsWithStats((1 - m).astype(np.uint8), 4)
        for i in range(1, hn):
            if hst[i, 4] < S * S * 30: m[hlab == i] = 1
            elif hlab[0, 0] != i:                           # the real hole: a clean circle of the same area
                ys, xs = np.nonzero(hlab == i); m[hlab == i] = 1
                cv2.circle(m, (int(xs.mean()), int(ys.mean())), int(np.sqrt(hst[i, 4] / np.pi)), 0, -1, cv2.LINE_AA)
        L[b_] = m
    # drop the cell's title: pieces that lie wholly in the top middle band
    tb = (int((.12 - X0 / w) * w * S), 0, int((.88 * w - X0) * S), int((TB.get(id_, .5) * h - Y0) * S))
    n, lab, st, _ = cv2.connectedComponentsWithStats(L, 8)
    for i in range(1, n):
        x, y, ww, hh, a = st[i]
        inbox = lambda B: any(x >= (b0 * w - X0) * S and x + ww <= (b2 * w - X0) * S and y >= (b1 * h - Y0) * S and y + hh <= (b3 * h - Y0) * S for b0, b1, b2, b3 in B)
        if a < S * S * MINA.get(id_, 1.5) or (x >= tb[0] and x + ww <= tb[2] and y + hh <= tb[3]) or inbox(DROP.get(id_, [])): L[lab == i] = 0
    for spec in ERASE.get(id_, []): L[box(*spec)] = 0
    for spec, k in BOPEN.get(id_, []):
        b_ = box(*spec); L[b_] = cv2.morphologyEx(L[b_].copy(), cv2.MORPH_OPEN, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (k, k)))
    for spec, k, fill in BCLOSE.get(id_, []):
        b_ = box(*spec); sub = cv2.morphologyEx(L[b_].copy(), cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (k, k)))
        if fill:
            iv = np.pad((1 - sub).astype(np.uint8), 1, constant_values=1); mm = np.zeros((iv.shape[0] + 2, iv.shape[1] + 2), np.uint8)
            cv2.floodFill(iv, mm, (0, 0), 2); sub = (iv[1:-1, 1:-1] != 2).astype(np.uint8)
        L[b_] = sub
    for (ax, ay), (bx2, by2), vis in SEALF.get(id_, []):
        if vis: cv2.line(L, (X(ax), Y(ay)), (X(bx2), Y(by2)), 1, int(2.6 * S))
    Lg = cv2.morphologyEx(L, cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (GAP[id_], GAP[id_]))) if id_ in GAP else L
    if id_ in SEAL:
        Lg = Lg.copy()
        for (ax, ay), (bx2, by2) in SEAL[id_]: cv2.line(Lg, (ax * S, ay * S), (bx2 * S, by2 * S), 1, 3 * S)
    if any(not v for *_, v in SEALF.get(id_, [])):
        Lg = Lg.copy()
        for (ax, ay), (bx2, by2), vis in SEALF[id_]:
            if not vis: cv2.line(Lg, (X(ax), Y(ay)), (X(bx2), Y(by2)), 1, 2 * S)
    dk = disc(*ACCC[id_]) if id_ in ACCC else np.zeros(u.shape, bool)
    holes = np.zeros(u.shape, np.uint8)
    inv = np.pad((1 - Lg).astype(np.uint8), 1, constant_values=1); m2 = np.zeros((inv.shape[0] + 2, inv.shape[1] + 2), np.uint8)
    cv2.floodFill(inv, m2, (0, 0), 2); sil = (inv[1:-1, 1:-1] != 2).astype(np.uint8)
    if id_ in CLOSE or id_ in HOLE:
        Lc = Lg.copy()
        if id_ in CLOSE: Lc[0, :] = Lc[-1, :] = 1; Lc[:, 0] = Lc[:, -1] = 1      # the crop's edge closes an open drawing
        rn, rl, rs, _ = cv2.connectedComponentsWithStats((1 - Lc).astype(np.uint8), connectivity=4)
        for i in range(1, rn):
            r = rl == i; mu = u[r].mean()
            if id_ in CLOSE and rs[i, cv2.CC_STAT_AREA] > S * S * 20 and mu > 40: sil[r] = 1
            if id_ in HOLE and sil[r].all() and rs[i, cv2.CC_STAT_AREA] > S * S * 30 and mu < HOLEMU.get(id_, 26) and dk[r].mean() < .5: sil[r] = 0; holes[r] = 1
    sil = cv2.morphologyEx(sil, cv2.MORPH_CLOSE, np.ones((3, 3), np.uint8)) | L
    mid = ((u > 70) & (u <= 185) & (sil > 0) & (L == 0)).astype(np.uint8)
    mid = cv2.morphologyEx(mid, cv2.MORPH_OPEN, np.ones((5, 5), np.uint8))
    am = np.zeros_like(L)
    for a, b, c, d in ACC.get(id_, []):
        am[max(0, int((b * h - Y0) * S)):max(0, int((d * h - Y0) * S)), max(0, int((a * w - X0) * S)):max(0, int((c * w - X0) * S))] = 1
    inner = ((sil > 0) & (Lg == 0)).astype(np.uint8)
    n2, lab2, st2, ce2 = cv2.connectedComponentsWithStats(inner, 4)
    acc = np.zeros_like(L)
    for i in range(1, n2):
        r = lab2 == i
        if am[r].mean() > .6: acc[r] = 1          # a whole region (most of it in the box) takes the accent, never a box of it
    if id_ in ACCC: acc |= (inner > 0) & dk                # … or the inside of a drawn circle
    if id_ in ACCSMALL:                                     # small bits of the inside cut off by stray marks, next to the accent, take it
        near = cv2.dilate(acc, np.ones((25, 25), np.uint8)) > 0
        for i in range(1, n2):
            r = lab2 == i
            if st2[i, 4] < S * S * ACCSMALL[id_] and near[r].any(): acc[r] = 1
    if id_ in ACCGAP:
        co = ((Lg > 0) & (L == 0) & (sil > 0)).astype(np.uint8); cn, cl, _, _ = cv2.connectedComponentsWithStats(co, 4)
        touch = np.unique(cl[(cv2.dilate(acc, np.ones((3, 3), np.uint8)) > 0) & (co > 0)])
        acc |= np.isin(cl, touch[touch > 0]).astype(np.uint8)
    if id_ in THICK:
        dt = cv2.distanceTransform(L, cv2.DIST_L2, 3); thick = cv2.dilate((dt > 2.6 * S).astype(np.uint8), np.ones((5, 5), np.uint8)) & L
        acc |= thick; L = (L & (1 - thick)).astype(np.uint8)
    if id_ in THICKA:
        dt = cv2.distanceTransform(L, cv2.DIST_L2, 3); tb_ = np.zeros_like(L); tb_[box(*THICKA[id_])] = 1
        thick = cv2.dilate((dt > 2.6 * S).astype(np.uint8), np.ones((5, 5), np.uint8)) & L & tb_
        n3, l3, _, _ = cv2.connectedComponentsWithStats(L, 8); keep = np.unique(l3[thick > 0])
        thick = np.isin(l3, keep[keep > 0]).astype(np.uint8) & tb_     # the whole solid piece, not only its thick middle
        acc |= thick; L = (L & (1 - thick)).astype(np.uint8)
    if id_ in THICKB:
        dt = cv2.distanceTransform(L, cv2.DIST_L2, 3); thick = cv2.dilate((dt > 2.6 * S).astype(np.uint8), np.ones((5, 5), np.uint8)) & L
        L = (L & (1 - thick)).astype(np.uint8)
    acc = cv2.morphologyEx(acc, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
    mid = (mid & (1 - acc)).astype(np.uint8)
    # the accent zone: the accent regions closed over the thin lines inside them (numbers, letters, facets); lines there take
    # the accent's own ink so they do not fade into it
    accz = cv2.morphologyEx(acc, cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (27, 27))) & (1 - acc) & L
    if id_ in ACCLEDGE:
        dout = cv2.distanceTransform(sil.astype(np.uint8), cv2.DIST_L2, 3)
        accz = accz & (dout > ACCLEDGE[id_] * S).astype(np.uint8)
    if ACCLMIN.get(id_):
        an, al, ast, _ = cv2.connectedComponentsWithStats(accz.astype(np.uint8), 8)
        for i in range(1, an):
            if ast[i, 4] < S * S * ACCLMIN[id_]: accz[al == i] = 0; L[al == i] = 0; acc[al == i] = 1   # the dot becomes accent
    hl = np.zeros_like(L)
    if id_ in HL:                                           # thick pieces there are the sheet's highlights
        dz = cv2.distanceTransform(L, cv2.DIST_L2, 3); zn, zl, _, _ = cv2.connectedComponentsWithStats(L, 8)
        hb = np.zeros(u.shape, bool); hb[box(*HL[id_])] = True
        for i in range(1, zn):
            r = zl == i
            if dz[r].max() > 1.6 * S and hb[r].mean() > .8: hl[r] = 1
        accz = accz & (1 - hl); L = (L & (1 - hl)).astype(np.uint8)
    if id_ in HOLEF: holes = cv2.morphologyEx(holes, cv2.MORPH_OPEN, np.ones((5, 5), np.uint8))
    def path(m, mode, tol=1.0, minA=.4):
        cs, _ = cv2.findContours(m, mode, cv2.CHAIN_APPROX_NONE); d = []
        for c in cs:
            if cv2.contourArea(c) < S * S * minA: continue
            a = cv2.approxPolyDP(c, tol, True).reshape(-1, 2) / S
            if len(a) >= 3: d.append('M' + 'L'.join(f'{x:.1f} {y:.1f}' for x, y in a) + 'Z')
        return ''.join(d)
    out[id_] = {'cat': cat, 'name': nm, 'w': round(L.shape[1] / S, 1), 'h': round(L.shape[0] / S, 1),
                'lines': path(L, cv2.RETR_CCOMP), 'body': path(sil, cv2.RETR_EXTERNAL), 'mid': '', 'acc': path(acc, cv2.RETR_CCOMP, 1.2, 3), 'accl': path(accz.astype(np.uint8), cv2.RETR_CCOMP, 1.0, .3),
                'hl': path(hl, cv2.RETR_CCOMP, 1.0, .3), 'hole': path(holes, cv2.RETR_CCOMP, 1.2, 3) if id_ in HOLEF else '', 'fade': FADE.get(id_, '')}
    cv2.imwrite(f'tr_{id_}.png', np.dstack([mid * 120 + acc * 40, sil * 60 + L * 195 + acc * 120, L * 255 + acc * 200]))
json.dump(out, open('traced.json', 'w'))
print(len(out), sum(len(v['lines']) + len(v['body']) + len(v['mid']) for v in out.values()) // 1024, 'KiB')
