/* b05.js — category B05 "ถูกกับผิด" ("ไม่ใช่ X แต่คือ Y"): 20 neutral designs — STILL DRAFTS (round 1, waiting for the user's pick).
   Every design is an everyday object with a real mechanism: the wrong side is rejected by that mechanism (stamped, struck through,
   shredded, binned, does not fit, pushed off, left in the dark, falls off, is swiped away …) and the right side takes its place / gets
   the tick / lights up. Order as spoken: wrong first, right after (CutPack CATEGORIES.md B05 — references/cutpack-CATEGORIES.md).
   Slots (same as CutPack): wrong { icon, label? } · right { icon, label? }. A missing / unknown icon → its label stands in for the picture.
   GL.cats.B05.draw(i, data, { x, y, s, at, no, hit }) — canvas 1000 × 700 centred at (0,0).
     no  = seconds after `at` when the wrong side is rejected (the word "ไม่ใช่"; default hit − 1.15)
     hit = seconds after `at` of the keyword: the right side is confirmed (default 1.9).
   This round only places the parts in their final pose (groups appear + the wrong side fades); the full motion comes after the user picks. */
(function () {
  const G = window.GL, C = G.C;
  const W = (w = 2) => ({ sw: w }), F = (w = 3.2) => ({ fill: C.fill, sw: w }), S = (w = 2) => ({ sw: w, stroke: C.soft });
  const rad = d => d * Math.PI / 180, f1 = v => +v.toFixed(1);
  const GLASS = 'rgba(255,255,255,.07)';            // translucent fill (Pen forces fill-opacity to 1, so the colour carries the alpha)
  const WO = .38, LO = .45;                          // the wrong side fades to WO (its label to LO)
  const hitOf = c => c.hit ?? 1.9, noOf = c => c.no ?? Math.max(.55, hitOf(c) - 1.15), tR = c => noOf(c) + .3;

  /* ---------- motion plumbing (same family as b01–b04) ---------- */
  const sub = (p, a) => { const q = p.child(a || {}); q.H = p.H; q.N = p.N; q.T = p.T; q.motion = p.motion; return q; };
  const on = (q, p, t, spec) => G.kf(q.g || q, p.t0 + t * p.ts, spec);
  const art = (c, fn) => { const f = p => { p.H = hitOf(c); p.N = noOf(c); fn(p); }; f.custom = true; f.dur = .35; f.exit = 'pop'; return G.art(f, { x: c.x, y: c.y, s: c.s, at: c.at || 0 }); };
  const rot = (p, a, x, y) => sub(p, { transform: `rotate(${a} ${x} ${y})` });
  const rotAt = (p, t, a, x, y) => { const o = sub(p); atT(o, p, t); return rot(o, a, x, y); };   // appears at t, keeps its turn
  /* a group of side s: wrong appears at .05 and fades to WO when it is rejected; right appears at tR. o.to = its final opacity */
  function side(p, c, s, o = {}) {
    const t = o.t ?? (s === 'wrong' ? .05 : tR(c)), to = o.to ?? (s === 'wrong' ? WO : 1), N = noOf(c);
    if (to >= 1) { const g = sub(p); on(g, p, 0, { o: [[0, 0], [t, 0], [t + .14, 1]] }); return g; }
    /* a faded side: its dark fills are laid again, solid and without outline, in a base group underneath — a see-through fill
       would let the rig's glow shine through it in blotches */
    const base = sub(p), g = sub(p);
    on(base, p, 0, { o: [[0, 0], [t, 0], [t + .14, 1]] }); on(g, p, 0, { o: [[0, 0], [t, 0], [t + .14, 1], [N + .1, 1], [N + .35, to]] });
    return duo(base, g);
  }
  /* a pen that draws into `dim` and, for every shape filled with C.fill, a solid copy into `base` */
  function duo(base, dim) {
    const q = Object.create(dim), solid = o => o && o.fill === C.fill ? Object.assign({}, o, { sw: 0, stroke: 'none' }) : null;
    ['rect', 'circle', 'ellipse', 'path', 'shape'].forEach(m => q[m] = (...a) => { const o = a[a.length - 1], so = solid(o);
      if (so) base[m](...a.slice(0, -1), so); return dim[m](...a); });
    q.child = attrs => { const b = base.child(attrs), d = dim.child(attrs); b.H = d.H = dim.H; b.N = d.N = dim.N; return duo(b, d); };
    q.g = dim.g; return q;
  }
  const atT = (g, p, t) => on(g, p, t, { o: [[0, 0], [.12, 1]] });
  function txt(p, str, x, y, { size = 42, maxW = 1e9, weight = 600, anchor = 'middle', color = C.soft } = {}) {
    const e = p.text(String(str), x, y, { size, weight, anchor, color, dur: .01 });
    const w = e.getBBox().width; if (w > maxW) e.setAttribute('font-size', f1(size * maxW / w));
    return e;
  }
  const picOf = it => it && it.icon && (G.icons[it.icon] || G.icons[it.icon + '-pro']);
  /* label of side s (skipped when the label already stands in for a missing picture). Draw it into a side() group (it fades with it). */
  function lbl(q, d, s, x, y, o = {}) {
    const it = d[s]; if (!it || !it.label || !picOf(it)) return null;
    return txt(q, it.label, x, y, Object.assign({ maxW: 280 }, s === 'right' ? { color: C.ink, weight: 700 } : {}, o));
  }
  /* the picture of side s at (cx, cy), width wd (canvas units). o.r = [deg, px, py] turns it with what it sits on; o.sy squashes it;
     o.to = final opacity (wrong default WO); o.t = when it appears. No picture → the label in big type. */
  function icon(d, s, cx, cy, wd, c, o = {}) {
    const it = d[s] || {}, at = c.at || 0, H = hitOf(c), N = noOf(c), t = o.t ?? (s === 'wrong' ? .12 : tR(c) + .06);
    const X = c.x + cx * c.s, Y = c.y + cy * c.s, fn = picOf(it);
    let a;
    if (fn) a = G.art(fn, { x: X, y: Y, w: wd * c.s, at: at + t });
    else { const str = it.label || it.icon; if (!str) return null;
      const f = q => txt(q, str, 0, wd * .13, { size: wd * .36, maxW: wd * 1.1, weight: 700, color: C.ink }); f.custom = true; f.dur = .3; f.exit = 'pop';
      a = G.art(f, { x: X, y: Y, s: c.s, at: at + t }); }
    const K = {}, to = o.to ?? (s === 'wrong' ? WO : 1);
    if (to < 1) K.o = [[0, 1], [N + .1, 1], [N + .35, to]];
    if (o.r) { K.r = [[0, o.r[0]]]; K.ox = c.x + o.r[1] * c.s; K.oy = c.y + o.r[2] * c.s; }
    if (o.sy) { K.sy = [[0, o.sy]]; K.ox = X; K.oy = Y; }
    if (Object.keys(K).length) G.kf(a.wrap, at, K);
    if (s === 'right') G.kf(a.g, at + H, { ox: X, oy: Y, s: [[0, 1], [.07, 1.1, 'out'], [.32, 1, 'soft']] });
    return a;
  }
  /* ✕ / ✓ badge: ✕ stamps in when the wrong side is rejected, ✓ on the keyword */
  function badge(p, kind, x, y, r = 36) {
    const g = sub(p), k = r * .42; g.circle(x, y, r, F(3));
    if (kind === 'x') { g.line(x - k, y - k, x + k, y + k, W(5)); g.line(x + k, y - k, x - k, y + k, W(5)); }
    else g.poly([[x - k, y + 2], [x - k * .2, y + k * .8], [x + k * 1.05, y - k * .75]], W(5));
    on(g, p, (kind === 'x' ? p.N : p.H) + .05, { ox: x, oy: y, s: [[0, 1.8], [.14, .9, 'in'], [.26, 1.04], [.38, 1, 'soft']], o: [[0, 0], [.06, 1]] });
    return g;
  }
  /* glow behind the right side: blooms on the keyword */
  function halo(p, x, y, r = 120) {
    const g = sub(p); g.circle(x, y, r, { fill: GLASS, sw: 0, stroke: 'none' }); g.circle(x, y, r, S(2.4));
    on(g, p, p.H, { ox: x, oy: y, s: [[0, .6], [.2, 1.08, 'out'], [.4, 1, 'soft']], o: [[0, 0], [.12, 1]] });
  }
  const floor = (p, y = 300, a = -470, b = 470) => { const g = sub(p); g.line(a, y, b, y, S(2)); atT(g, p, 0); return g; };
  const R = (q, x, y, w, h, rx, o) => q.rect(x, y, w, h, Object.assign({ rx }, o));

  const V = [];
  const variant = (id, th, build) => V.push({ id, th, build });

  /* 01 ── STAMP: two sheets on the desk — a rubber stamp prints ✕ on the wrong sheet, then ✓ on the right one, and lifts away */
  variant('stamp', 'ตรายางประทับ', (d, c) => {
    const X = { wrong: -240, right: 190 }, top = -215, h = 420, w = 300;
    art(c, p => {
      ['wrong', 'right'].forEach(s => { const x = X[s], l = x - w / 2, r = x + w / 2, b = top + h, k = 46, g = side(p, c, s);
        g.path(`M ${l} ${top} L ${r - k} ${top} L ${r} ${top + k} L ${r} ${b} L ${l} ${b} Z`, F(3.2)); g.path(`M ${r - k} ${top} L ${r - k} ${top + k} L ${r} ${top + k}`, W(2));
        lbl(g, d, s, x, 70, { maxW: w - 40 });
        const im = sub(p), cx = x + 68, cy = b - 72; im.circle(cx, cy, 50, W(3.2));
        if (s === 'wrong') { im.line(cx - 22, cy - 22, cx + 22, cy + 22, W(5.5)); im.line(cx + 22, cy - 22, cx - 22, cy + 22, W(5.5)); atT(im, p, p.N); }
        else { im.poly([[cx - 24, cy + 2], [cx - 6, cy + 20], [cx + 26, cy - 16]], W(5.5)); atT(im, p, p.H); } });
      const st = rotAt(p, .1, -8, 300, -200);                               // the stamp, lifted after the ✓
      const sx = 320, sy = -300; st.circle(sx, sy - 40, 30, F(3.2)); st.path(`M ${sx - 18} ${sy - 12} L ${sx + 18} ${sy - 12} L ${sx + 36} ${sy + 50} L ${sx - 36} ${sy + 50} Z`, F(3.2));
      R(st, sx - 95, sy + 50, 190, 54, 12, F(3.4)); st.line(sx - 80, sy + 72, sx + 80, sy + 72, S(1.6)); R(st, sx - 82, sy + 104, 164, 20, 5, F(2.8));
    });
    ['wrong', 'right'].forEach(s => icon(d, s, X[s], -75, 160, c));
  });

  /* 02 ── WHITEBOARD: the wrong line is written and struck through with the marker; the right line is written under it and circled ✓ */
  variant('whiteboard', 'ไวท์บอร์ด', (d, c) => {
    const yW = -200, yR = 10;
    art(c, p => {
      const B = sub(p); atT(B, p, 0);
      R(B, -420, -320, 840, 452, 14, F(3.4)); R(B, -390, 138, 780, 18, 6, F(2.6));                       // board + marker tray
      R(B, -330, 118, 110, 20, 9, F(2.4)); R(B, -220, 120, 34, 16, 6, F(2.2));                             // marker + cap on the tray
      R(B, 190, 110, 120, 28, 6, F(2.6)); B.line(196, 128, 304, 128, S(1.6));                              // eraser (felt line)
      [-330, 330].forEach(x => { R(B, x - 9, 156, 18, 150, 6, F(2.6)); B.line(x - 70, 306, x + 70, 306, W(4)); B.circle(x - 62, 320, 10, F(2.4)); B.circle(x + 62, 320, 10, F(2.4)); });
      const gw = side(p, c, 'wrong'); lbl(gw, d, 'wrong', -165, yW + 18, { anchor: 'start', maxW: 470, size: 54, weight: 700, color: C.ink });
      const k1 = sub(p); k1.path(`M -370 ${yW + 6} C -150 ${yW - 22}, 110 ${yW + 26}, 350 ${yW - 10}`, W(6)); on(k1, p, p.N, { draw: [[0, 0], [.25, 1, 'out']] });
      const gr = side(p, c, 'right'); lbl(gr, d, 'right', -165, yR + 18, { anchor: 'start', maxW: 470, size: 54, weight: 700, color: C.ink });
      const k2 = sub(p); k2.ellipse(-25, yR, 365, 92, W(4.4)); on(k2, p, p.H - .05, { draw: [[0, 0], [.3, 1, 'out']] });
      const k3 = sub(p); k3.poly([[352, yR - 4], [370, yR + 22], [404, yR - 34]], W(6)); on(k3, p, p.H + .2, { draw: [[0, 0], [.15, 1, 'out']] });
    });
    icon(d, 'wrong', -265, yW, 130, c); icon(d, 'right', -265, yR, 130, c);
  });

  /* 03 ── SHREDDER: the wrong card is fed into the shredder (strips fall into the bin); the right card stands beside it ✓ */
  variant('shredder', 'เครื่องทำลายเอกสาร', (d, c) => {
    art(c, p => {
      floor(p);
      const gw = side(p, c, 'wrong'); R(gw, -310, -320, 220, 300, 14, F(3)); lbl(gw, d, 'wrong', -200, -75, { maxW: 190, size: 38 });
      const M = sub(p); atT(M, p, 0);
      const strips = sub(M); [-290, -262, -234, -206, -178, -150, -122].forEach((x, i) => strips.path(`M ${x} 52 C ${x + 6} 100, ${x - 8} 140, ${x + (i % 2 ? 10 : -6)} ${180 + (i % 3) * 14}`, S(2)));
      [[-300, 262, -210, 250], [-250, 276, -150, 262], [-200, 252, -110, 270], [-160, 280, -70, 268]].forEach(([a, y1, b, y2]) => strips.path(`M ${a} ${y1} Q ${(a + b) / 2} ${y1 - 26} ${b} ${y2}`, S(2)));
      R(M, -360, 50, 340, 250, 14, { fill: GLASS, sw: 3 }); R(M, -260, 74, 140, 22, 11, W(2));                   // clear bin + handle slot
      R(M, -385, -30, 390, 84, 18, F(3.4)); R(M, -330, -36, 260, 12, 6, F(2.4));                                 // head + feed slot
      M.line(-370, 30, -10, 30, S(1.6)); M.circle(-48, 2, 15, F(2.6)); M.circle(-90, 2, 6, W(2));               // seam, power button, LED
      const gr = side(p, c, 'right'); R(gr, 110, -110, 290, 400, 20, F(3.2)); lbl(gr, d, 'right', 255, 215, { maxW: 250 });
      badge(p, 'check', 395, -105);
    });
    icon(d, 'wrong', -200, -210, 130, c); icon(d, 'right', 255, 40, 190, c);
  });

  /* 04 ── PEDAL BIN: the lid flips open and the wrong card drops into the bin; the right one stays in the light ✓ */
  variant('bin', 'ถังขยะเหยียบ', (d, c) => {
    const cw = { x: -270, y: -70, r: 18 };
    art(c, p => {
      floor(p);
      const L = sub(p); atT(L, p, 0); L.path('M -404 -8 L -410 -150 Q -410 -172 -388 -172 L -152 -172 Q -130 -172 -130 -150 L -124 -8', F(3)); L.line(-390, -150, -150, -150, S(1.6));   // lid swung open, seen from below
      const gw = side(p, c, 'wrong'), cg = rot(gw, cw.r, cw.x, cw.y); R(cg, cw.x - 105, cw.y - 125, 210, 250, 14, F(3));
      lbl(gw, d, 'wrong', -270, -205, { maxW: 260 });
      const B = sub(p); atT(B, p, 0);
      B.path('M -400 14 L -140 14 L -160 284 Q -162 294 -172 294 L -368 294 Q -378 294 -380 284 Z', F(3.4)); R(B, -414, -10, 302, 26, 10, F(3));
      B.line(-386, 250, -154, 250, S(1.6)); R(B, -306, 284, 76, 16, 6, F(2.6));                                  // seam + pedal
      const gr = side(p, c, 'right'); lbl(gr, d, 'right', 240, 215, { maxW: 300 });
      halo(p, 240, 0, 150); badge(p, 'check', 360, -125);
    });
    icon(d, 'wrong', cw.x, cw.y - 40, 120, c, { r: [cw.r, cw.x, cw.y] }); icon(d, 'right', 240, 0, 210, c);
  });

  /* 05 ── KEY: the wrong key does not fit and is left aside ✕; the right key goes in, turns, and the padlock springs open */
  function key(q, bx, by, R0, len) {
    q.circle(bx, by, R0, F(3.4)); R(q, bx + R0 - 6, by - 26, 30, 52, 8, F(3));
    const x0 = bx + R0 + 24; R(q, x0, by - 17, len, 34, 8, F(3)); q.line(x0 + 10, by, x0 + len - 26, by, S(1.6));
    const t = x0 + len - 150; q.poly([[t, by + 17], [t + 14, by + 40], [t + 36, by + 40], [t + 50, by + 17], [t + 64, by + 32], [t + 86, by + 32], [t + 100, by + 17]], F(2.8));
  }
  variant('key', 'กุญแจผิดดอก', (d, c) => {
    const kw = { x: -290, y: -185, r: -7 }, kr = { x: -200, y: 110 };
    art(c, p => {
      const gw = side(p, c, 'wrong'), wg = rot(gw, kw.r, kw.x, kw.y); key(wg, kw.x, kw.y, 78, 250); lbl(gw, d, 'wrong', kw.x, kw.y + 130, { maxW: 240 });
      const L = sub(p); atT(L, p, 0);
      L.path('M 250 -10 L 250 -170 A 70 70 0 0 1 390 -170 L 390 -95', { sw: 34 }); L.path('M 250 -10 L 250 -170 A 70 70 0 0 1 390 -170 L 390 -95', { sw: 24, stroke: C.fill });   // open shackle
      const gr = side(p, c, 'right'); key(gr, kr.x, kr.y, 96, 300);
      R(L, 190, -14, 260, 250, 44, F(3.4)); L.line(204, 60, 436, 60, S(1.6)); L.line(204, 170, 436, 170, S(1.6));
      L.circle(250, kr.y, 16, W(2.4));                                                                              // keyhole the blade goes into
      lbl(gr, d, 'right', kr.x, kr.y + 150, { maxW: 260 });
      badge(p, 'x', 95, -255); badge(p, 'check', 430, -60);
    });
    icon(d, 'wrong', kw.x, kw.y, 100, c, { r: [kw.r, kw.x, kw.y] }); icon(d, 'right', kr.x, kr.y, 124, c);
  });

  /* 06 ── SORTER: both ride the belt under the scanner arch — the flap drops and the wrong tile slides down the reject chute;
     the right tile rides on to the end ✓ */
  variant('sorter', 'สายพานคัดแยก', (d, c) => {
    const tw = { x: -150, y: 175, r: 38 };
    art(c, p => {
      const B = sub(p); atT(B, p, 0);
      B.line(-230, 52, -330, 300, W(3)); B.line(-70, 52, -170, 300, W(3)); R(B, -370, 290, 240, 40, 10, F(3));                 // chute + reject box
      R(B, -480, 0, 250, 50, 25, F(3.2)); [-450, -390, -330, -270].forEach(x => { B.circle(x, 25, 13, W(2)); });
      R(B, -70, 0, 550, 50, 25, F(3.2)); [-40, 30, 100, 170, 240, 310, 380, 450].forEach(x => B.circle(x, 25, 13, W(2)));
      const fl = rot(B, 62, -230, 25); R(fl, -230, 15, 150, 18, 6, F(2.6)); B.circle(-230, 25, 7, W(2));                     // flap on its hinge
      [50, 440].forEach(x => { R(B, x - 10, 50, 20, 250, 6, F(2.4)); B.line(x - 40, 300, x + 40, 300, W(3)); });
      const gw = side(p, c, 'wrong'), tg = rot(gw, tw.r, tw.x, tw.y); R(tg, tw.x - 80, tw.y - 80, 160, 160, 16, F(3));
      lbl(gw, d, 'wrong', -360, -40, { maxW: 220 });
      const gr = side(p, c, 'right'); R(gr, 210, -190, 190, 190, 18, F(3.2)); lbl(gr, d, 'right', 305, -225, { maxW: 300 });
      badge(p, 'check', 400, -190);
    });
    icon(d, 'wrong', tw.x, tw.y, 100, c, { r: [tw.r, tw.x, tw.y] }); icon(d, 'right', 305, -95, 125, c);
  });

  /* 07 ── DESK LAMP: the lamp first lights the wrong one, then swings its head over to the right one — the wrong is left in the dark */
  variant('lamp', 'โคมไฟตั้งโต๊ะ', (d, c) => {
    const J0 = [0, 255], J1 = [-90, 20], J2 = [110, -200], ang = 62;           // base pivot, elbow, head joint; head aims down-right
    art(c, p => {
      floor(p);
      const cone = sub(p); const a = rad(ang), ux = Math.cos(a), uy = Math.sin(a), nx = -uy, ny = ux, mx = J2[0] + ux * 150, my = J2[1] + uy * 150;
      cone.shape([[mx + nx * 75, my + ny * 75], [mx - nx * 75, my - ny * 75], [470, 300], [150, 300]].map(([x, y]) => [f1(x), f1(y)]), { fill: GLASS, sw: 0, stroke: 'none' });
      on(cone, p, p.H - .1, { o: [[0, 0], [.2, 1]] });
      const A = sub(p); atT(A, p, 0);
      R(A, -120, 262, 240, 38, 18, F(3.2)); R(A, 60, 250, 34, 14, 5, F(2.2));                                                 // weighted base + switch
      const arm = (P, Q) => { const L = Math.hypot(Q[0] - P[0], Q[1] - P[1]), g = rot(A, f1(Math.atan2(Q[1] - P[1], Q[0] - P[0]) * 180 / Math.PI), P[0], P[1]);
        R(g, P[0], P[1] - 11, L, 22, 11, F(2.6)); g.line(P[0] + 26, P[1], P[0] + L - 26, P[1], S(1.4)); };
      arm(J0, J1); arm(J1, J2);
      [J0, J1, J2].forEach(([x, y]) => { A.circle(x, y, 20, F(2.8)); A.circle(x, y, 6, W(2)); });
      const hd = rot(A, ang, J2[0], J2[1]); const x0 = J2[0], y0 = J2[1];
      hd.path(`M ${x0 + 10} ${y0 - 26} L ${x0 + 60} ${y0 - 30} L ${x0 + 150} ${y0 - 75} L ${x0 + 150} ${y0 + 75} L ${x0 + 60} ${y0 + 30} L ${x0 + 10} ${y0 + 26} Z`, F(3.2));
      hd.path(`M ${x0 + 150} ${y0 - 40} A 40 40 0 0 1 ${x0 + 150} ${y0 + 40}`, W(2.4));                                       // bulb in the mouth
      const gw = side(p, c, 'wrong'); lbl(gw, d, 'wrong', -310, 262, { maxW: 260 });
      const gr = side(p, c, 'right'); lbl(gr, d, 'right', 310, 262, { maxW: 280 });
      badge(p, 'x', -200, 30); badge(p, 'check', 420, 10);
    });
    icon(d, 'wrong', -310, 115, 170, c); icon(d, 'right', 310, 115, 175, c);
  });

  /* 08 ── SIGNPOST: two arrow planks on a post — the wrong plank loses a nail and swings down; the right plank points the way ✓ */
  variant('signpost', 'ป้ายบอกทาง', (d, c) => {
    const pv = [0, 70], aw = -38, wi = [-150, 40];          // wrong plank hangs from its lower nail (pv), turned aw°
    art(c, p => {
      const P = sub(p); atT(P, p, 0);
      P.path('M -150 312 Q 0 266 150 312', F(3)); R(P, -24, -270, 48, 575, 6, F(3.2)); P.path('M -32 -268 L 0 -305 L 32 -268 Z', F(3));
      P.line(-8, -200, -8, 290, S(1.4)); P.line(8, -40, 8, 200, S(1.4));
      const gw = side(p, c, 'wrong'), wp = rot(gw, aw, pv[0], pv[1]);
      wp.path('M 60 -20 L -300 -20 L -362 40 L -300 100 L 60 100 Z', F(3.2)); wp.line(-290, 0, 40, 0, S(1.4)); wp.line(-300, 80, 40, 80, S(1.4));
      wp.circle(0, 70, 7, F(2.4)); wp.circle(0, 10, 5, S(1.6));
      lbl(wp, d, 'wrong', -230, 55, { maxW: 200, size: 40 });
      const gr = side(p, c, 'right');
      gr.path('M -60 -250 L 360 -250 L 425 -185 L 360 -120 L -60 -120 Z', F(3.2)); gr.line(-50, -228, 350, -228, S(1.4)); gr.line(-50, -142, 350, -142, S(1.4));
      gr.circle(0, -220, 7, F(2.4)); gr.circle(0, -150, 7, F(2.4));
      lbl(gr, d, 'right', 145, -170, { anchor: 'start', maxW: 215, size: 44 });
      badge(p, 'check', 395, -280, 32);
    });
    icon(d, 'wrong', wi[0], wi[1], 90, c, { r: [aw, pv[0], pv[1]] }); icon(d, 'right', 85, -185, 100, c);
  });

  /* 09 ── PHONE: the wrong card is swiped off the screen ✕; the right card stays on the screen ✓ */
  variant('phone', 'มือถือปัดทิ้ง', (d, c) => {
    const px = 150, wc = { x: -280, y: -15, r: -14 };
    art(c, p => {
      const P = sub(p); atT(P, p, 0);
      R(P, px - 160, -315, 320, 630, 48, F(3.4)); R(P, px - 136, -270, 272, 520, 26, { sw: 1.8, stroke: C.soft });
      R(P, px - 40, -298, 80, 12, 6, W(2)); P.circle(px + 62, -292, 7, W(2)); R(P, px - 50, 274, 100, 10, 5, W(1.8));
      R(P, px - 168, -190, 8, 70, 3, F(2)); R(P, px - 168, -100, 8, 70, 3, F(2)); R(P, px + 160, -150, 8, 100, 3, F(2));
      const gw = side(p, c, 'wrong'), wg = rot(gw, wc.r, wc.x, wc.y); R(wg, wc.x - 110, wc.y - 160, 220, 320, 22, F(3)); lbl(wg, d, 'wrong', wc.x, wc.y + 110, { maxW: 190, size: 38 });
      const sp = sub(p); [-70, 0, 70].forEach((y, i) => sp.line(-130 + i * 8, y - 10, -40 + i * 8, y - 10, S(2.4))); atT(sp, p, p.N);
      const gr = side(p, c, 'right'); R(gr, px - 115, -200, 230, 340, 22, F(3)); lbl(gr, d, 'right', px, 90, { maxW: 200 });
      R(gr, px - 90, 170, 180, 50, 25, F(2.6));
      const ok = sub(gr); ok.poly([[px - 16, 195], [px - 4, 207], [px + 18, 183]], W(4)); atT(ok, p, p.H);
      badge(p, 'x', wc.x - 100, wc.y - 175, 32); badge(p, 'check', px + 115, -200, 32);
    });
    icon(d, 'wrong', wc.x, wc.y - 40, 130, c, { r: [wc.r, wc.x, wc.y] }); icon(d, 'right', px, -60, 150, c);
  });

  /* 10 ── CORKBOARD: the wrong note's pin pops out and the note drops onto the ledge; the right note is pinned up in its place ✓ */
  variant('corkboard', 'บอร์ดปักหมุด', (d, c) => {
    const wn = { x: -275, y: 38, r: -11 }, rn = { x: 75, y: -140 };
    art(c, p => {
      const B = sub(p); atT(B, p, 0); R(B, -430, -325, 860, 500, 14, F(3.4)); R(B, -455, 175, 910, 26, 8, F(3));
      const gw = side(p, c, 'wrong'), wg = rot(gw, wn.r, wn.x, wn.y + 130); R(wg, wn.x - 130, wn.y - 130, 260, 260, 8, F(3)); lbl(wg, d, 'wrong', wn.x, wn.y + 95, { maxW: 220, size: 38 });
      const pin = side(p, c, 'wrong'); pin.ellipse(-90, 166, 16, 9, F(2.6)); pin.line(-74, 166, -40, 160, W(2.4));
      const gr = side(p, c, 'right'), rg = rot(gr, 2, rn.x, rn.y); R(rg, rn.x - 130, rn.y - 130, 260, 260, 8, F(3)); lbl(rg, d, 'right', rn.x, rn.y + 95, { maxW: 220 });
      const pr = sub(p); pr.circle(rn.x, rn.y - 118, 18, F(3)); pr.circle(rn.x - 5, rn.y - 123, 5, W(1.8)); atT(pr, p, tR(c));
      badge(p, 'check', rn.x + 130, rn.y - 125, 34);
    });
    icon(d, 'wrong', wn.x, wn.y - 25, 120, c, { r: [wn.r, wn.x, wn.y + 130] }); icon(d, 'right', rn.x, rn.y - 30, 135, c, { r: [2, rn.x, rn.y] });
  });

  /* 11 ── DRAWERS: the wrong goes into its drawer and the drawer slams shut ✕; the right drawer slides open and the right one rises out ✓ */
  variant('drawers', 'ตู้ลิ้นชัก', (d, c) => {
    art(c, p => {
      const B = sub(p); atT(B, p, 0);
      R(B, -445, -20, 890, 30, 8, F(3)); R(B, -425, 10, 850, 262, 8, F(3.2));
      [-385, 385].forEach(x => B.path(`M ${x - 22} 272 L ${x + 22} 272 L ${x + 12} 312 L ${x - 12} 312 Z`, F(2.6)));
      R(B, 12, 28, 396, 226, 8, F(2.4));                                                                         // the open drawer's empty bay
      const gw = side(p, c, 'wrong', { to: .55 }); R(gw, -408, 28, 396, 226, 10, F(2.8)); gw.circle(-210, 70, 15, F(2.6));
      R(gw, -350, 115, 280, 110, 8, W(2)); lbl(gw, d, 'wrong', -165, 185, { maxW: 150, size: 36, anchor: 'middle' });
      const gr = side(p, c, 'right');
      gr.path('M 12 28 L 408 28 L 432 70 L -12 70 Z', { fill: C.fill, sw: 2.4, stroke: C.soft });              // drawer box seen over its front
      R(gr, -12, 70, 444, 230, 10, F(3)); gr.circle(210, 112, 15, F(2.6)); R(gr, 70, 150, 280, 110, 8, W(2)); lbl(gr, d, 'right', 210, 220, { maxW: 250, size: 40 });
      halo(p, 210, -165, 125); badge(p, 'x', -400, 30, 32); badge(p, 'check', 330, -270, 34);
    });
    icon(d, 'wrong', -295, 170, 80, c, { to: .7 }); icon(d, 'right', 210, -165, 190, c);
  });

  /* 12 ── PULLEY: two buckets on one rope over two pulleys — the wrong bucket is lowered to the ground, the right one hauled up ✓ */
  variant('pulley', 'รอกสองถัง', (d, c) => {
    const L = -235, Rx = 235, yw = 150, yr = -70;           // bucket rim heights
    const bucket = (q, x, y) => { q.path(`M ${x - 104} ${y} Q ${x} ${y - 120} ${x + 104} ${y}`, S(2.4));
      q.path(`M ${x - 100} ${y} L ${x + 100} ${y} L ${x + 80} ${y + 130} Q ${x + 78} ${y + 140} ${x + 66} ${y + 140} L ${x - 66} ${y + 140} Q ${x - 78} ${y + 140} ${x - 80} ${y + 130} Z`, F(3.2));
      R(q, x - 108, y - 12, 216, 24, 8, F(3)); q.circle(x - 104, y, 6, W(2)); q.circle(x + 104, y, 6, W(2)); };
    art(c, p => {
      floor(p, 290);
      const T = sub(p); atT(T, p, 0); R(T, -380, -330, 760, 28, 8, F(3));
      [L, Rx].forEach(x => { T.path(`M ${x - 30} -302 L ${x - 8} -248 M ${x + 30} -302 L ${x + 8} -248`, W(3)); });
      const rope = sub(p); rope.path(`M ${L - 48} ${yw - 60} L ${L - 48} -240 A 48 48 0 0 1 ${L} -288 L ${Rx} -288 A 48 48 0 0 1 ${Rx + 48} -240 L ${Rx + 48} ${yr - 60}`, S(3)); atT(rope, p, 0);
      [L, Rx].forEach(x => { T.circle(x, -240, 48, F(3)); T.circle(x, -240, 36, S(1.6)); T.circle(x, -240, 8, W(2.2)); });
      const gw = side(p, c, 'wrong'); bucket(gw, L - 48, yw); lbl(gw, d, 'wrong', L + 90, yw + 80, { maxW: 200, size: 38, anchor: 'start' });
      const gr = side(p, c, 'right'); bucket(gr, Rx + 48, yr); lbl(gr, d, 'right', Rx + 48, yr + 195, { maxW: 280 });
      badge(p, 'check', Rx + 160, yr - 40, 34);
    });
    icon(d, 'wrong', L - 48, yw + 68, 100, c); icon(d, 'right', Rx + 48, yr + 68, 108, c);
  });

  /* 13 ── SIGNAL: a two-lamp signal — the wrong lamp goes dark ✕, the right lamp lights up ✓ */
  variant('signal', 'ไฟสัญญาณ', (d, c) => {
    const yW = -180, yR = 85;
    art(c, p => {
      const B = sub(p); atT(B, p, 0);
      R(B, -18, 225, 36, 120, 6, F(2.8)); R(B, -70, 338, 140, 12, 5, F(2.4));
      R(B, -140, -325, 280, 550, 42, F(3.4)); R(B, -40, 225, 80, 14, 4, F(2.4));
      const VS = y => `M -104 ${y - 62} A 121 121 0 0 1 104 ${y - 62}`;                                         // visor over each lamp
      [yW, yR].forEach(y => { B.path(VS(y), { sw: 16 }); B.path(VS(y), { sw: 9, stroke: C.fill }); });
      const gw = side(p, c, 'wrong', { to: .5 }); gw.circle(0, yW, 102, F(3)); lbl(gw, d, 'wrong', -175, yW + 15, { anchor: 'end', maxW: 300 });
      const gr = side(p, c, 'right'); gr.circle(0, yR, 102, F(3)); lbl(gr, d, 'right', 175, yR + 15, { anchor: 'start', maxW: 300 });
      const lit = sub(p); lit.circle(0, yR, 102, { fill: GLASS, sw: 4.6 }); lit.circle(0, yR, 150, S(2)); atT(lit, p, p.H);
      badge(p, 'x', 95, yW - 95, 32); badge(p, 'check', 110, yR - 105, 34);
    });
    icon(d, 'wrong', 0, yW, 140, c, { to: .3 }); icon(d, 'right', 0, yR, 140, c);
  });

  /* 14 ── EASEL: the wrong canvas is lifted off the easel and set down against its leg ✕; the right canvas goes up in its place ✓ */
  variant('easel', 'ขาตั้งภาพ', (d, c) => {
    const wc = { x: -330, b: 300, r: -9 };
    art(c, p => {
      floor(p);
      const E = sub(p); atT(E, p, 0);
      E.path('M 0 -300 L 30 300', { sw: 14 }); E.path('M 0 -300 L 30 300', { sw: 7, stroke: C.fill });                     // back leg
      [[-12, -320, -215, 300], [12, -320, 215, 300]].forEach(([x1, y1, x2, y2]) => { E.path(`M ${x1} ${y1} L ${x2} ${y2}`, { sw: 22 }); E.path(`M ${x1} ${y1} L ${x2} ${y2}`, { sw: 14, stroke: C.fill }); });
      R(E, -250, 118, 500, 26, 6, F(3)); E.line(-238, 136, 238, 136, S(1.4));                                                   // ledge
      E.line(-150, 230, 150, 230, W(3));                                                                                         // cross bar
      const gr = side(p, c, 'right'); R(gr, -175, -265, 350, 383, 8, F(3.2)); lbl(gr, d, 'right', 0, 70, { maxW: 300 });
      R(p, -34, -292, 68, 40, 8, F(3));                                                                                          // top clamp
      const gw = side(p, c, 'wrong'), wg = rot(gw, wc.r, wc.x, wc.b); R(wg, wc.x - 125, wc.b - 300, 250, 300, 8, F(3)); lbl(wg, d, 'wrong', wc.x, wc.b - 50, { maxW: 210, size: 38 });
      badge(p, 'x', -420, -40, 30); badge(p, 'check', 175, -265, 34);
    });
    icon(d, 'wrong', wc.x, wc.b - 175, 130, c, { r: [wc.r, wc.x, wc.b] }); icon(d, 'right', 0, -95, 175, c);
  });

  /* 15 ── PATCH PANEL: the plug is pulled out of the wrong jack (its lamp goes out) and pushed into the right jack — its lamp lights ✓ */
  variant('patch', 'แผงเสียบสาย', (d, c) => {
    const X = { wrong: -200, right: 200 }, yJ = 70;
    art(c, p => {
      const B = sub(p); atT(B, p, 0); R(B, -420, -320, 840, 470, 20, F(3.4)); B.line(0, -290, 0, 120, S(1.4));
      ['wrong', 'right'].forEach(s => { const x = X[s], g = side(p, c, s, s === 'wrong' ? { to: .5 } : {});
        lbl(g, d, s, x, -50, { maxW: 320 }); g.circle(x, 5, 14, F(2.4)); g.circle(x, yJ, 34, F(3)); g.circle(x, yJ, 14, { fill: '#040404', sw: 2.4 }); });
      const lit = sub(p); lit.circle(X.right, 5, 14, { fill: C.ink, sw: 2 }); lit.circle(X.right, 5, 28, S(1.8)); atT(lit, p, p.H);
      const P = sub(p); atT(P, p, 0); const x = X.right;
      P.path(`M ${x} 236 C ${x} 330, -20 290, -160 318 S -400 340, -480 300`, { sw: 14 }); P.path(`M ${x} 236 C ${x} 330, -20 290, -160 318 S -400 340, -480 300`, { sw: 7, stroke: C.fill });
      P.path(`M ${x - 14} 206 L ${x + 14} 206 L ${x + 10} 240 L ${x - 10} 240 Z`, F(2.6));
      R(P, x - 26, yJ + 18, 52, 124, 14, F(3.2)); [126, 146, 166].forEach(y => P.line(x - 18, yJ + y - 60, x + 18, yJ + y - 60, S(1.6)));
      P.ellipse(x, yJ + 14, 36, 14, F(3));
      badge(p, 'x', X.wrong + 100, -260, 30); badge(p, 'check', X.right + 100, -260, 32);
    });
    icon(d, 'wrong', X.wrong, -185, 140, c); icon(d, 'right', X.right, -185, 140, c);
  });

  /* 16 ── PENCIL: the pencil flips and rubs the wrong one out (smudges, crumbs); it draws the right one and ticks it ✓ */
  variant('pencil', 'ดินสอยางลบ', (d, c) => {
    const ang = -70, T0 = [334, 146];                         // pencil tip and its angle (from the tip to the eraser end)
    art(c, p => {
      const B = sub(p); atT(B, p, 0); R(B, -450, -300, 900, 560, 10, F(3.2));
      const gw = side(p, c, 'wrong'); lbl(gw, d, 'wrong', -230, 150, { maxW: 300 });
      const sm = sub(p); [[-345, -150, -100, -110], [-360, -60, -110, -20], [-340, 30, -120, 60]].forEach(([a, y1, b, y2]) => sm.path(`M ${a} ${y1} L ${b} ${y2}`, { sw: 34, stroke: 'rgba(255,255,255,.08)' }));
      [[-120, 200], [-95, 214], [-330, 205]].forEach(([x, y]) => sm.path(`M ${x} ${y} q 8 -10 16 0 t 14 2`, S(2))); atT(sm, p, p.N);
      const gr = side(p, c, 'right'); lbl(gr, d, 'right', 190, 150, { maxW: 280 });
      const tk = sub(p); tk.poly([[255, 182], [282, 212], [330, 150]], W(5)); on(tk, p, p.H, { draw: [[0, 0], [.18, 1, 'out']] });
      const P = rotAt(p, 0, ang, T0[0], T0[1]), [x, y] = T0;
      P.path(`M ${x} ${y} L ${x + 26} ${y - 9} L ${x + 26} ${y + 9} Z`, { fill: C.ink, sw: 2 }); P.path(`M ${x + 26} ${y - 9} L ${x + 70} ${y - 22} L ${x + 70} ${y + 22} L ${x + 26} ${y + 9}`, F(2.8));
      R(P, x + 70, y - 22, 250, 44, 4, F(3)); P.line(x + 76, y - 7, x + 314, y - 7, S(1.4)); P.line(x + 76, y + 7, x + 314, y + 7, S(1.4));
      R(P, x + 320, y - 24, 40, 48, 4, F(2.8)); P.line(x + 333, y - 22, x + 333, y + 22, S(1.4)); P.line(x + 347, y - 22, x + 347, y + 22, S(1.4));
      P.path(`M ${x + 360} ${y - 22} L ${x + 384} ${y - 22} Q ${x + 398} ${y - 22} ${x + 398} ${y - 8} L ${x + 398} ${y + 8} Q ${x + 398} ${y + 22} ${x + 384} ${y + 22} L ${x + 360} ${y + 22} Z`, F(2.8));
      badge(p, 'x', -105, -175, 30);
    });
    icon(d, 'wrong', -230, -40, 190, c, { to: .3 }); icon(d, 'right', 190, -40, 190, c);
  });

  /* 17 ── TOASTER: the lever goes down — the wrong slice pops out and tumbles off onto the counter ✕; the right slice pops up ✓ */
  const toast = (q, cx, top, w, h, o) => { const l = cx - w / 2, r = cx + w / 2, b = top + h, k = w * .28;
    return q.path(`M ${l + 12} ${b} Q ${l} ${b} ${l} ${b - 12} L ${l} ${top + k} A ${k} ${k} 0 0 1 ${cx} ${top + w * .1} A ${k} ${k} 0 0 1 ${r} ${top + k} L ${r} ${b - 12} Q ${r} ${b} ${r - 12} ${b} Z`, o); };
  variant('toaster', 'เครื่องปิ้งขนมปัง', (d, c) => {
    const ws = { x: -370, y: 120, r: -24 };
    art(c, p => {
      floor(p, 268);
      const gr = side(p, c, 'right'); toast(gr, 110, -325, 240, 330, F(3.2)); lbl(gr, d, 'right', 110, -45, { maxW: 200, size: 40 });
      const B = sub(p); atT(B, p, 0);
      R(B, -260, -20, 520, 270, 80, F(3.4)); B.line(-170, -20, -50, -20, { sw: 9, stroke: '#040404' }); B.line(50, -20, 170, -20, { sw: 9, stroke: C.fill });
      B.line(-200, 200, 200, 200, S(1.6)); B.circle(170, 120, 26, F(2.8)); B.line(170, 120, 182, 100, W(2.4));
      R(B, 258, 30, 10, 170, 5, W(2)); R(B, 262, 40, 46, 24, 8, F(2.8));                                       // lever (up) in its side slot
      R(B, -200, 250, 60, 16, 5, F(2.4)); R(B, 140, 250, 60, 16, 5, F(2.4));
      const gw = side(p, c, 'wrong'), wg = rot(gw, ws.r, ws.x, ws.y + 140); toast(wg, ws.x, ws.y - 150, 200, 290, F(3)); lbl(wg, d, 'wrong', ws.x, ws.y + 100, { maxW: 170, size: 34 });
      badge(p, 'x', -250, -110, 30); badge(p, 'check', 245, -300, 34);
    });
    icon(d, 'wrong', ws.x, ws.y - 25, 120, c, { r: [ws.r, ws.x, ws.y + 140] }); icon(d, 'right', 110, -170, 160, c);
  });

  /* 18 ── LIGHT BULB: the wrong bulb is unscrewed and set down, dark; the right bulb is screwed into the socket and lights ✓ */
  const bulb = (q, cx, cy, Rr, o) => { const b = Rr * .42, yb = cy + Rr * 1.22;
    q.path(`M ${cx - b} ${yb} C ${cx - b} ${yb - Rr * .4}, ${cx - Rr} ${cy + Rr * .62}, ${cx - Rr} ${cy} A ${Rr} ${Rr} 0 1 1 ${cx + Rr} ${cy} C ${cx + Rr} ${cy + Rr * .62}, ${cx + b} ${yb - Rr * .4}, ${cx + b} ${yb} Z`, o || F(3.2));
    R(q, cx - b, yb, 2 * b, Rr * .42, 6, F(2.8)); [.12, .24, .36].forEach(k => q.line(cx - b + 4, yb + Rr * k, cx + b - 4, yb + Rr * (k - .06), S(1.6)));
    q.path(`M ${cx - b * .5} ${yb + Rr * .42} L ${cx - b * .3} ${yb + Rr * .56} L ${cx + b * .3} ${yb + Rr * .56} L ${cx + b * .5} ${yb + Rr * .42}`, F(2.4)); };
  variant('bulb', 'เปลี่ยนหลอดไฟ', (d, c) => {
    const rb = { x: 170, y: 30 }, wb = { x: -260, y: 150, r: -78 }, Rr = 108;
    art(c, p => {
      floor(p, 300);
      const T = sub(p); atT(T, p, 0); T.line(-470, -335, 470, -335, S(2)); R(T, rb.x - 40, -335, 80, 18, 6, F(2.6)); T.line(rb.x, -317, rb.x, -250, W(3));
      R(T, rb.x - 50, -250, 100, 90, 14, F(3.2)); T.line(rb.x - 50, -222, rb.x + 50, -222, S(1.6)); T.line(rb.x - 50, -195, rb.x + 50, -195, S(1.6));
      const gr = side(p, c, 'right'), up = rot(gr, 180, rb.x, rb.y); bulb(up, rb.x, rb.y, Rr);
      const lit = sub(p); lit.circle(rb.x, rb.y, Rr, { fill: GLASS, sw: 0, stroke: 'none' }); lit.circle(rb.x, rb.y, Rr + 46, S(2)); atT(lit, p, p.H);
      lbl(gr, d, 'right', rb.x, 215, { maxW: 280 });
      const gw = side(p, c, 'wrong'), dn = rot(gw, wb.r, wb.x, wb.y); bulb(dn, wb.x, wb.y, Rr * .9); lbl(gw, d, 'wrong', wb.x + 20, 30, { maxW: 280 });
      badge(p, 'check', rb.x + 125, -100, 34);
    });
    icon(d, 'wrong', wb.x, wb.y, 120, c, { r: [wb.r, wb.x, wb.y] }); icon(d, 'right', rb.x, rb.y, 140, c);
  });

  /* 19 ── CLAW: the claw rides along the rail, passes over the wrong one ✕, drops, grabs the right one and lifts it ✓ */
  variant('claw', 'เครนคีบ', (d, c) => {
    const cx = 170, hy = -150, iy = 10;
    const prong = (q, s) => { q.path(`M ${cx + s * 26} ${hy + 30} C ${cx + s * 95} ${hy + 60}, ${cx + s * 110} ${iy - 20}, ${cx + s * 72} ${iy + 72}`, { sw: 20 });
      q.path(`M ${cx + s * 26} ${hy + 30} C ${cx + s * 95} ${hy + 60}, ${cx + s * 110} ${iy - 20}, ${cx + s * 72} ${iy + 72}`, { sw: 12, stroke: C.fill });
      q.circle(cx + s * 58, hy + 48, 7, W(2)); };
    art(c, p => {
      floor(p);
      const T = sub(p); atT(T, p, 0); R(T, -470, -330, 940, 26, 8, F(3)); [-460, 460].forEach(x => T.circle(x, -317, 6, W(2)));
      R(T, cx - 70, -296, 140, 50, 12, F(3.2)); [cx - 42, cx + 42].forEach(x => T.circle(x, -304, 12, F(2.6)));
      T.line(cx - 10, -246, cx - 10, hy - 20, S(2.4)); T.line(cx + 10, -246, cx + 10, hy - 20, S(2.4));
      const bk = sub(p); atT(bk, p, 0); bk.path(`M ${cx} ${hy + 30} L ${cx} ${iy - 30}`, { sw: 16 }); bk.path(`M ${cx} ${hy + 30} L ${cx} ${iy - 30}`, { sw: 9, stroke: C.fill });
      const gw = side(p, c, 'wrong'); lbl(gw, d, 'wrong', -130, 245, { anchor: 'start', maxW: 220 });
      const gr = side(p, c, 'right'); lbl(gr, d, 'right', cx + 125, iy + 15, { anchor: 'start', maxW: 200 });
      badge(p, 'x', -150, 130, 30); badge(p, 'check', cx + 150, iy - 110, 34);
    });
    icon(d, 'wrong', -250, 215, 160, c); icon(d, 'right', cx, iy, 150, c);
    art(Object.assign({}, c), p => { const H = sub(p); atT(H, p, 0); prong(H, -1); prong(H, 1); R(H, cx - 46, hy - 22, 92, 56, 14, F(3.2)); H.line(cx - 34, hy + 6, cx + 34, hy + 6, S(1.4)); });
  });

  /* 20 ── RADIO: the tuning needle sits on the wrong station (static) and slides along the dial to the right station — it comes in clear ✓ */
  variant('radio', 'วิทยุหมุนหาคลื่น', (d, c) => {
    const X = { wrong: -210, right: 210 };
    art(c, p => {
      const B = sub(p); atT(B, p, 0);
      B.line(395, -140, 445, -330, W(4)); B.line(405, -178, 433, -280, { sw: 7 }); B.circle(447, -336, 9, F(2.4)); R(B, 375, -158, 40, 22, 6, F(2.6));
      R(B, -430, -150, 860, 420, 44, F(3.4));
      R(B, -390, -120, 780, 150, 16, { fill: GLASS, sw: 2.6 });
      for (let x = -360; x <= 360; x += 30) { const big = Math.abs(x - X.wrong) < 1 || Math.abs(x - X.right) < 1 || x % 120 === 0; B.line(x, big ? -10 : 0, x, 18, S(big ? 2 : 1.4)); }
      R(B, -390, 70, 300, 170, 14, F(2.6)); [100, 130, 160, 190, 220].forEach(y => B.line(-366, y, -114, y, S(2)));
      [[200, 155], [330, 155]].forEach(([x, y]) => { B.circle(x, y, 44, F(3)); B.line(x, y, x + 20, y - 34, W(2.6)); });
      ['wrong', 'right'].forEach(s => { const g = side(p, c, s); lbl(g, d, s, X[s], -60, { maxW: 300, size: 40 }); });
      const st = sub(p); [-1, 1].forEach(k => st.path(`M ${X.wrong + k * 80} -330 q ${k * 14} 20 0 40 t 0 40`, S(2))); atT(st, p, .2); on(st, p, p.N, { o: [[0, 1], [.2, 0]] });
      const lit = sub(p); R(lit, X.right - 150, -115, 300, 140, 12, { fill: GLASS, sw: 0, stroke: 'none' }); atT(lit, p, p.H);
      const nd = sub(p); R(nd, X.right - 4, -28, 8, 54, 4, { fill: C.ink, sw: 1.4 }); nd.circle(X.right, -32, 9, { fill: C.ink, sw: 1.4 }); atT(nd, p, .1);
      badge(p, 'x', X.wrong + 95, -320, 30); badge(p, 'check', X.right + 100, -320, 34);
    });
    icon(d, 'wrong', X.wrong, -245, 140, c); icon(d, 'right', X.right, -245, 140, c);
  });

  /* samples from unrelated topics (neutrality) + a stress set */
  const I = (icon, label) => label ? { icon, label } : { icon };
  const SAMPLES = [
    { say: 'ไม่ใช่ยาที่ช่วย แต่คือการนอน', wrong: I('pill', 'ยา'), right: I('bed', 'การนอน') },
    { say: 'ปัญหาไม่ใช่เงิน แต่คือเวลา', wrong: I('banknote', 'เงิน'), right: I('clock', 'เวลา') },
    { say: 'ลูกไม่ได้อยากได้ของเล่น แต่อยากได้เวลาของพ่อแม่', wrong: I('gift', 'ของเล่น'), right: I('users', 'เวลาของพ่อแม่') },
    { say: 'ไม่ใช่ถูกที่สุด แต่คุ้มที่สุด', wrong: I('tag', 'ถูกที่สุด'), right: I('gem', 'คุ้มที่สุด') },
    { say: 'อย่ารดน้ำทุกวัน แค่สัปดาห์ละครั้ง', wrong: I('droplets', 'ทุกวัน'), right: I('calendar', 'สัปดาห์ละครั้ง') },
    { say: 'ไม่ใช่ขับให้เร็ว แต่ขับให้ปลอดภัย', wrong: I('car', 'ขับให้เร็ว'), right: I('shield-check', 'ปลอดภัย') },
    { say: 'ความสุขไม่ใช่เงินเดือน แต่คือคนรอบตัว', wrong: I('wallet', 'เงินเดือน'), right: I('users', 'คนรอบตัว') },
    { say: 'ไม่ต้องใช้แรง ใช้เครื่องมือให้ถูก', wrong: I('dumbbell', 'ใช้แรง'), right: I('wrench', 'เครื่องมือ') },
    { say: 'ไม่ใช่พูดเสียงดัง แต่ฟังให้จบ', wrong: I('megaphone', 'พูดเสียงดัง'), right: I('headphones', 'ฟังให้จบ') },
    { say: 'ไม่ต้องหักโหม แค่ทำสม่ำเสมอ', wrong: I('zap', 'หักโหม'), right: I('repeat', 'สม่ำเสมอ') },
    { say: 'ไม่ใช่โทรไปตาม แต่ส่งเมลสรุป', wrong: I('phone', 'โทรไปตาม'), right: I('mail', 'ส่งเมลสรุป') },
    { say: 'เด็กไม่ได้ต้องการจอ แต่ต้องการหนังสือ', wrong: I('tv', 'จอ'), right: I('book-open', 'หนังสือ') },
    { say: 'ไม่ใช่กาแฟที่ปลุก แต่คือแสงแดด', wrong: I('coffee', 'กาแฟ'), right: I('sun', 'แสงแดด') },
    { say: 'อย่ากินขนมตอนดึก กินผลไม้แทน', wrong: I('cookie', 'ขนม'), right: I('apple', 'ผลไม้') },
    { say: 'ไม่ใช่ดวง แต่คือการซ้อม', wrong: I('dice-5', 'ดวง'), right: I('target', 'การซ้อม') },
    { say: 'ไม่ต้องนั่งรถ เดินไปก็ถึง', wrong: I('car', 'นั่งรถ'), right: I('person-standing', 'เดินไป') },
    { say: 'ต้นไม้ไม่ได้ขาดน้ำ แต่ขาดแดด', wrong: I('droplets', 'ขาดน้ำ'), right: I('sun', 'ขาดแดด') },
    { say: 'ไม่ใช่ซื้อใหม่ แต่ซ่อมของเดิม', wrong: I('package', 'ซื้อใหม่'), right: I('hammer', 'ซ่อมของเดิม') },
    { say: 'ไม่ใช่ความฉลาด แต่คือความอดทน', wrong: I('brain', 'ความฉลาด'), right: I('hourglass', 'ความอดทน') },
    { say: 'กุญแจไม่ใช่สอนเยอะ แต่ถามให้ถูก', wrong: I('book', 'สอนเยอะ'), right: I('circle-help', 'ถามให้ถูก') },
  ];
  const STRESS = [
    { say: 'ไม่มีป้ายเลย', wrong: I('cigarette-off'), right: I('salad') },
    { say: 'ป้ายยาว 12 ตัว', wrong: I('trending-down', 'ลดราคาทั้งร้าน'), right: I('message-circle-heart', 'ตอบแชตลูกค้าไว') },
    { say: 'ภาษาอังกฤษ', wrong: I('zap', 'Faster'), right: I('target', 'Smarter') },
    { say: 'ไม่มีไอคอน (ป้ายแทนภาพ)', wrong: { label: 'ราคา' }, right: { label: 'คุณค่า' } },
    { say: 'ไอคอนเดียวกัน ต่างแค่ป้าย', wrong: I('clock', 'ตอนเช้า'), right: I('clock', 'ตอนเย็น') },
    { say: 'ตัวเลขเป็นป้าย', wrong: I('timer', '5 นาที'), right: I('timer', '30 นาที') },
    { say: 'ฝั่งถูกไม่มีป้าย', wrong: I('cookie', 'ของหวาน'), right: I('apple') },
    { say: 'ฝั่งผิดไม่มีป้าย', wrong: I('tv'), right: I('book-open', 'อ่านหนังสือ') },
    { say: 'ชื่อไอคอนที่ไม่มี', wrong: I('no-such-icon', 'ทางลัด'), right: I('map', 'ทางจริง') },
    { say: 'ของคนละชนิดกันสุด ๆ', wrong: I('pill', 'ยา'), right: I('bed', 'การนอน') },
    { say: 'ป้ายยาว + อังกฤษปน', wrong: I('megaphone', 'ยิงแอด Ads'), right: I('users', 'ปากต่อปาก') },
    { say: 'ภาษาอังกฤษยาว', wrong: I('wallet', 'More money'), right: I('heart', 'More time') },
    { say: 'คน ↔ ของ', wrong: I('user', 'คนเดียว'), right: I('users', 'ทั้งทีม') },
    { say: 'ไม่มีไอคอนฝั่งเดียว', wrong: { label: 'พรสวรรค์' }, right: I('repeat', 'การฝึก') },
    { say: 'ป้ายสั้นมาก', wrong: I('moon', 'ดึก'), right: I('sun', 'เช้า') },
    { say: 'ไอคอนเส้นเยอะ', wrong: I('truck', 'ส่งเอง'), right: I('store', 'มารับที่ร้าน') },
    { say: 'อังกฤษ + ตัวเลข', wrong: I('calendar', '7 days'), right: I('timer', '1 day') },
    { say: 'ป้ายยาว 12 ตัวทั้งคู่', wrong: I('cloud', 'ฝนตกทั้งวันเลย'), right: I('umbrella', 'พกร่มติดตัวไว้') },
    { say: 'คำเดียวทั้งคู่ (อังกฤษ)', wrong: I('lock', 'Hide'), right: I('eye', 'Show') },
    { say: 'ไม่มีป้ายทั้งคู่ (ไอคอนแรง)', wrong: I('trash-2'), right: I('recycle') },
  ];

  G.cats = G.cats || {};
  G.cats.B05 = { variants: V, SAMPLES, STRESS, draw: (i, d, c) => V[i].build(d, c) };
})();
