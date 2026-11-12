"""trace every pick: lines (bright cores, even-odd), body (silhouette), mid (the sheet's grey fills inside the body)."""
import sys, os, json, cv2, numpy as np
sys.path.insert(0, '.')
from cells import CELLS
from picks import P, ACC, THR, DROP, MINA, THICK, TB, EDGE, CLOSE, HOLE, GAP, SEAL
from picks import THICKB, THRB, DARK, ERASE, BCLOSE, SEALF, ACCC, HOLEF, HL, ACCGAP, FADE, HOLEMU, THICKA, ACCLMIN, ACCSMALL, BOPEN, ACCLEDGE, FADEW, PARTS, PATCH
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
    zc = cv2.morphologyEx(acc, cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (27, 27)))
    accz = zc & (1 - acc) & L
    # a mark that lies (mostly) in the accent (a number, a letter, the needle) takes the accent ink whole, not just where the
    # closing reached: else it shows two inks in the styles whose ink and accent ink differ (split, dark cards)
    zn_, zl_, zs_, _ = cv2.connectedComponentsWithStats(L.astype(np.uint8), 8)
    for i in range(1, zn_):
        x, y, ww, hh, a = zs_[i]
        x0_, y0_, x1_, y1_ = max(0, x - 6), max(0, y - 6), min(L.shape[1], x + ww + 6), min(L.shape[0], y + hh + 6)
        r = (zl_[y0_:y1_, x0_:x1_] == i).astype(np.uint8)
        ring = cv2.dilate(r, np.ones((9, 9), np.uint8)) & (1 - r)              # what lies just round the mark
        if zc[y0_:y1_, x0_:x1_][r > 0].mean() > .6 or acc[y0_:y1_, x0_:x1_][ring > 0].mean() > .75:
            accz[y0_:y1_, x0_:x1_][r > 0] = 1
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
    # ---- parts: the picture cut into pieces that move on their own (motion); every pixel goes to exactly one part, except a
    # 'region' part (share) that also keeps the lines it shares with its neighbours (jigsaw pieces) ----
    if id_ not in HOLEF: holes = np.zeros_like(L)
    M = {'lines': L.astype(np.uint8), 'body': sil.astype(np.uint8), 'acc': acc.astype(np.uint8), 'accl': accz.astype(np.uint8),
         'hl': hl.astype(np.uint8), 'hole': holes.astype(np.uint8)}
    U = np.zeros_like(L)
    for m in M.values(): U |= m
    LAY = list(M)
    pool = {k: M[k].copy() for k in LAY}; parts = []
    if os.environ.get('COMPS') and id_ in os.environ['COMPS'].split(','):
        cn, cl, cs, _ = cv2.connectedComponentsWithStats(U, connectivity=8)
        fx = lambda v: (v / S + X0) / w; fy = lambda v: (v / S + Y0) / h
        print(id_, [(round(fx(x), 3), round(fy(y), 3), round(fx(x + ww), 3), round(fy(y + hh), 3)) for x, y, ww, hh, a in cs[1:] if a > S * S * 1])
    def inbox(px, py, b): return X(b[0]) <= px <= X(b[2]) and Y(b[1]) <= py <= Y(b[3])
    def fill_holes(m):
        iv = np.pad((1 - m).astype(np.uint8), 1, constant_values=1); mm = np.zeros((iv.shape[0] + 2, iv.shape[1] + 2), np.uint8)
        cv2.floodFill(iv, mm, (0, 0), 2); return (iv[1:-1, 1:-1] != 2).astype(np.uint8)
    for spec in PARTS.get(id_, []):
        name, kind, arg = spec[:3]; opt = spec[3] if len(spec) > 3 else {}
        lay = opt.get('only', LAY); share = kind == 'region' and opt.get('share', False)
        cur = np.zeros_like(U)
        for k in lay: cur |= pool[k]
        masks = []
        if kind == 'box':
            m = np.zeros_like(U); m[box(*arg)] = 1; masks = [m]
        elif kind == 'poly':
            m = np.zeros_like(U); cv2.fillPoly(m, [np.array([[X(a), Y(b)] for a, b in arg], np.int32)], 1); masks = [m]
        elif kind == 'reflectcut':                      # a thin thing stuck in a round one (the arrow in the target): what it covers is
            wide = np.zeros_like(U); cv2.fillPoly(wide, [np.array([[X(a), Y(b)] for a, b in arg[0]], np.int32)], 1)   # put back by mirroring
            fl = np.zeros_like(U); cv2.fillPoly(fl, [np.array([[X(a), Y(b)] for a, b in arg[1]], np.int32)], 1)        # the round thing
            R = opt['r'] * w * S; cx0, cy0 = X(opt['pivot'][0]), Y(opt['pivot'][1])                                 # through its centre
            yy, xx = np.mgrid[0:U.shape[0], 0:U.shape[1]]
            ring = (M['body'] > 0) & (wide == 0) & (fl == 0) & (np.hypot(xx - cx0, yy - cy0) < R * 1.1)
            cs_, _ = cv2.findContours(ring.astype(np.uint8), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
            pts = np.vstack([c.reshape(-1, 2) for c in cs_]).astype(float)
            pts = pts[np.abs(np.hypot(pts[:, 0] - cx0, pts[:, 1] - cy0) - R) < R * .1]
            A_ = np.c_[2 * pts[:, 0], 2 * pts[:, 1], np.ones(len(pts))]; sol = np.linalg.lstsq(A_, (pts ** 2).sum(1), rcond=None)[0]
            cx_, cy_ = sol[0], sol[1]; rr = np.sqrt(sol[2] + cx_ ** 2 + cy_ ** 2)
            if os.environ.get('COMPS'): print(id_, 'circle', round(cx_ / S, 1), round(cy_ / S, 1), round(rr / S, 1))
            reg = (wide > 0) & (fl == 0) & (np.hypot(xx - cx_, yy - cy_) <= rr + 2 * S)
            # put back by turning the round thing a little round its centre, just past the band (nearby, so a ring that is not
            # quite round still meets itself)
            fx_, fy_ = np.nonzero(fl)[1].mean(), np.nonzero(fl)[0].mean(); ux_, uy_ = fx_ - cx_, fy_ - cy_; ul = np.hypot(ux_, uy_); ux_, uy_ = ux_ / ul, uy_ / ul
            wp = np.array([[X(a), Y(b)] for a, b in arg[0]], float); hw = np.abs((wp[:, 0] - cx_) * -uy_ + (wp[:, 1] - cy_) * ux_).max()
            rad = np.hypot(xx - cx_, yy - cy_) + 1e-6; th = np.arctan2(yy - cy_, xx - cx_)
            dl = np.arcsin(np.minimum(1, hw / rad)) * 1.25 + .05
            sx = np.clip(np.round(cx_ + rad * np.cos(th + dl)), 0, U.shape[1] - 1).astype(int); sy = np.clip(np.round(cy_ + rad * np.sin(th + dl)), 0, U.shape[0] - 1).astype(int)
            bad = (wide[sy, sx] > 0) | (fl[sy, sx] > 0)     # still in the band (near the centre): from the far side
            sx2 = np.clip(np.round(cx_ - rad * np.cos(th)), 0, U.shape[1] - 1).astype(int); sy2 = np.clip(np.round(cy_ - rad * np.sin(th)), 0, U.shape[0] - 1).astype(int)
            sx = np.where(bad, sx2, sx); sy = np.where(bad, sy2, sy)
            Rf = {kk: np.where(reg, M[kk][sy, sx], 0).astype(np.uint8) for kk in LAY}
            core = reg & (rad < hw * 1.2)                 # the very middle: plain, as the middle is just past the band
            rx_, ry_ = int(round(cx_ - ux_ * hw * 1.5)), int(round(cy_ - uy_ * hw * 1.5))
            for kk in LAY: Rf[kk][core] = M[kk][ry_, rx_] if kk in ('body', 'acc', 'hole') else 0
            ink = (M['lines'] | M['accl']) & wide; rink = cv2.dilate(Rf['lines'] | Rf['accl'], np.ones((3, 3), np.uint8))
            shaft = (ink & (1 - rink)).astype(np.uint8)
            ang = np.arctan2(fy_ - cy_, fx_ - cx_); Lk = int(4 * S)
            ker = np.zeros((2 * Lk + 1, 2 * Lk + 1), np.uint8); cv2.line(ker, (int(Lk - Lk * np.cos(ang)), int(Lk - Lk * np.sin(ang))), (int(Lk + Lk * np.cos(ang)), int(Lk + Lk * np.sin(ang))), 1, 1)
            shaft = cv2.morphologyEx(shaft, cv2.MORPH_CLOSE, ker) & wide
            sn, sl, ss, _ = cv2.connectedComponentsWithStats(shaft, 8)          # keep the shaft, not crumbs
            if sn > 1: shaft = (sl == 1 + np.argmax(ss[1:, 4])).astype(np.uint8)
            m = shaft | fl
            masks = [m]
            for kk in LAY:                              # the rest gets the mirrored rings in the band
                pool[kk] = np.where(reg, Rf[kk], pool[kk]).astype(np.uint8)
            M_arrow = {kk: ((M[kk] & fl) | (shaft & (M['lines'] | M['accl']) if kk == 'lines' else 0)).astype(np.uint8) for kk in LAY}
        elif kind == 'poly2':                           # several polygons
            m = np.zeros_like(U)
            for pg in arg: cv2.fillPoly(m, [np.array([[X(a), Y(b)] for a, b in pg], np.int32)], 1)
            masks = [m]
        elif kind in ('comp', 'comps'):
            on = np.zeros_like(U)
            for k in opt.get('on', lay): on |= pool[k]
            cn, cl, cs, _ = cv2.connectedComponentsWithStats(on, connectivity=8); got = []
            for i in range(1, cn):
                x, y, ww, hh, a = cs[i]
                if a >= S * S * 1 and a <= S * S * opt.get('maxa', 1e9) and inbox(x + ww / 2, y + hh / 2, arg): got.append((x + ww / 2, y + hh / 2, (cl == i).astype(np.uint8)))
            if kind == 'comp': masks = [np.bitwise_or.reduce([g[2] for g in got])] if got else []
            else: masks = [g[2] for g in sorted(got, key=lambda g: (g[1], g[0]) if opt.get('sort') == 'y' else (g[0], g[1]))]
        elif kind == 'region':
            r = np.zeros_like(U)
            for a, b in arg:
                lb = lab2[min(Y(b), lab2.shape[0] - 1), min(X(a), lab2.shape[1] - 1)]
                if not lb: raise SystemExit(f'{id_}: part {name}: seed {a, b} is on no enclosed area')
                r |= (lab2 == lb).astype(np.uint8)
            if os.environ.get('COMPS'): print(id_, name, 'region area', r.sum() // (S * S))
            r = fill_holes(r); d = int(opt.get('d', 5) * S)
            masks = [cv2.dilate(r, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2 * d + 1, 2 * d + 1)))]
        masks = [m & cur for m in masks]
        if not masks or not masks[0].any(): raise SystemExit(f'{id_}: part {name} is empty')
        for k, m in enumerate(masks):
            nm_ = name if len(masks) == 1 else f'{name}{k}'
            pm = {kk: (pool[kk] & m if kk in lay else np.zeros_like(U)) for kk in LAY} if kind != 'reflectcut' else M_arrow
            if not share and kind != 'reflectcut':
                for kk in lay: pool[kk] &= 1 - m
            if kind == 'reflectcut':
                for kk in LAY: pool[kk] &= 1 - fl
            pv = (X(opt['pivot'][0]) / S, Y(opt['pivot'][1]) / S) if 'pivot' in opt else None
            parts.append([nm_, pm, pv, opt])
    allm = np.zeros_like(U)
    for nm_, pm, pv, opt in parts:
        if opt.get('share'):
            for v in pm.values(): allm |= v
    restM = {k: v & (1 - allm) for k, v in pool.items()}   # shared lines belong to their parts, not to the rest
    if any(v.sum() for v in restM.values()):
        for nm_, pm, pv, opt in parts:                  # what was under a part closes over its footprint
            if opt.get('under'):
                fp = np.zeros_like(U)
                for v in pm.values(): fp |= v
                fp = cv2.dilate(fp, np.ones((5, 5), np.uint8))
                for k in ('body', 'acc'):
                    restM[k] |= fill_holes(restM[k] | fp) & fp & fill_holes(restM[k])
        for (ax, ay), (bx2, by2), th in PATCH.get(id_, []):
            cv2.line(restM['lines'], (X(ax), Y(ay)), (X(bx2), Y(by2)), 1, max(1, int(th * h * S)))
            restM['body'] = fill_holes(restM['body'] | restM['lines'])
        if sum(v.sum() for v in restM.values()) > S * S * 2 or not parts: parts.append(['rest', restM, None, {}])
    P_out = []
    for nm_, pm, pv, opt in parts:
        m = np.zeros_like(U)
        for v in pm.values(): m |= v
        ys, xs = np.nonzero(m)
        bb = [round(xs.min() / S, 1), round(ys.min() / S, 1), round((xs.max() + 1) / S, 1), round((ys.max() + 1) / S, 1)]
        ab = None
        if pm['acc'].any():
            ay, ax = np.nonzero(pm['acc']); ab = [round(ax.min() / S, 1), round(ay.min() / S, 1), round((ax.max() + 1) / S, 1), round((ay.max() + 1) / S, 1)]
        P_out.append({'n': nm_, 'bb': bb, 'ab': ab, 'pv': [round(pv[0], 1), round(pv[1], 1)] if pv else [round((bb[0] + bb[2]) / 2, 1), round((bb[1] + bb[3]) / 2, 1)],
                      'lines': path(pm['lines'], cv2.RETR_CCOMP), 'body': path(pm['body'], cv2.RETR_EXTERNAL), 'acc': path(pm['acc'], cv2.RETR_CCOMP, 1.2, 3),
                      'accl': path(pm['accl'], cv2.RETR_CCOMP, 1.0, .3), 'hl': path(pm['hl'], cv2.RETR_CCOMP, 1.0, .3), 'hole': path(pm['hole'], cv2.RETR_CCOMP, 1.2, 3)})
    if os.environ.get('PARTVIEW'):                      # one colour per part
        pal = [(80, 80, 255), (80, 220, 80), (255, 120, 60), (60, 200, 255), (255, 80, 200), (200, 200, 60), (160, 100, 255), (255, 255, 255), (120, 255, 200), (255, 160, 160)]
        im = np.zeros(U.shape + (3,), np.uint8)
        for i, (nm_, pm, pv, opt) in enumerate(parts): im[(pm['body'] | pm['acc'] | pm['hole']) > 0] = np.array(pal[i % len(pal)], np.uint8) // 3
        for i, (nm_, pm, pv, opt) in enumerate(parts): im[(pm['lines'] | pm['accl'] | pm['hl']) > 0] = np.array(pal[i % len(pal)], np.uint8)
        cv2.imwrite(f'pt_{id_}.png', im)
        rm = [pm for nm_, pm, pv, opt in parts if nm_ == 'rest']
        if rm: cv2.imwrite(f'rs_{id_}.png', np.dstack([rm[0]['body'] * 90, rm[0]['body'] * 90 + rm[0]['acc'] * 120, rm[0]['body'] * 90]) + np.dstack([rm[0]['lines'] * 165] * 3))
    out[id_] = {'cat': cat, 'name': nm, 'w': round(L.shape[1] / S, 1), 'h': round(L.shape[0] / S, 1), 'parts': P_out,
                'lines': path(L, cv2.RETR_CCOMP), 'body': path(sil, cv2.RETR_EXTERNAL), 'mid': '', 'acc': path(acc, cv2.RETR_CCOMP, 1.2, 3), 'accl': path(accz.astype(np.uint8), cv2.RETR_CCOMP, 1.0, .3),
                'hl': path(hl, cv2.RETR_CCOMP, 1.0, .3), 'hole': path(holes, cv2.RETR_CCOMP, 1.2, 3) if id_ in HOLEF else '', 'fade': FADE.get(id_, ''), 'fw': FADEW.get(id_, '')}
    cv2.imwrite(f'tr_{id_}.png', np.dstack([mid * 120 + acc * 40, sil * 60 + L * 195 + acc * 120, L * 255 + acc * 200]))
json.dump(out, open('traced.json', 'w'))
print(len(out), sum(len(v['lines']) + len(v['body']) + len(v['mid']) for v in out.values()) // 1024, 'KiB')
