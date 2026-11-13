/* b05.js — category B05 "ถูกกับผิด" ("ไม่ใช่ X แต่คือ Y"): 33 designs, all in the base set. Stills approved (2026-11-13), now with motion.
   Round 1 (everyday objects) → user: "อยากได้ชุดฐาน ไม่ใช่อันที่มีความหมายเฉพาะตัว" → round 2 (holders/displays with no topic of their own) →
   user: "ชอบของทั้ง 2 รอบเลย เก็บไว้ทั้งหมดเลยครับเป็นชุดฐาน เราจะไม่ทำชุดเฉพาะเรื่อง". Sheet order: round 2 = 01–20, round 1 = 21–33.
   Motion (CutPack CATEGORIES.md B05 + pro motion): the wrong side enters (.05) → at `no` ("ไม่ใช่") the design's own mechanism rejects it
   (stamped, struck through, slid out, flicked off, turned away, dropped, shut away, left in the dark, does not fit …) and it fades →
   the right side enters (no + .3) → on the keyword (`hit`) it is confirmed (✓ stamps in, it lights / is pressed / is lifted / pops up) →
   hold → exit. Order as spoken: wrong first, right after. The last frame equals the approved still.
   Slots (same as CutPack): wrong { icon, label? } · right { icon, label? }. A missing / unknown icon → its label stands in for the picture.
   GL.cats.B05.draw(i, data, { x, y, s, at, no, hit }) — canvas 1000 × 700 centred at (0,0).
     no  = seconds after `at` when the wrong side is rejected (the word "ไม่ใช่"; default hit − 1.15)
     hit = seconds after `at` of the keyword: the right side is confirmed (default 1.9).
   Plumbing: a moving part = mvG(group, keys) in canvas units; its icon gets the same keys (icon(…, { mv })) so they never drift apart.
   Static tilts sit inside the mover (rot()); off0() works out the start offset of a tilted part from its start pose.
   A faded side lays its dark fills again, solid, underneath (duo()) — a see-through fill lets the rig's glow show through in blotches. */
(function () {
  const G = window.GL, C = G.C, NS = 'http://www.w3.org/2000/svg';
  const W = (w = 2) => ({ sw: w }), F = (w = 3.2) => ({ fill: C.fill, sw: w }), S = (w = 2) => ({ sw: w, stroke: C.soft });
  const rad = d => d * Math.PI / 180, f1 = v => +v.toFixed(1);
  const GLASS = 'rgba(255,255,255,.07)';            // translucent fill (Pen forces fill-opacity to 1, so the colour carries the alpha)
  const WO = .38;                                    // the wrong side fades to WO
  const hitOf = c => c.hit ?? 1.9, noOf = c => c.no ?? Math.max(.55, hitOf(c) - 1.15), tR = c => noOf(c) + .3;

  /* ---------- motion plumbing (same family as b01–b04) ---------- */
  const TR = ['x', 'y', 'r', 's', 'sx', 'sy'];
  const sub = (p, a) => { const q = p.child(a || {}); q.H = p.H; q.N = p.N; q.T = p.T; q.motion = p.motion; return q; };
  /* keyframes on a pen's group. Every keyframe rewrites the transform, so a fade (no transform track) sent to a moving group goes to
     the mover's outer wrapper (og) instead — otherwise it would wipe the motion. A duo pen (faded side) gets the same keys on its base (bg). */
  const on = (q, p, t, spec) => { const t0 = p.t0 + t * p.ts, fade = q.og && !TR.some(n => spec[n]);
    G.kf(fade ? q.og : (q.g || q), t0, spec); const b = fade ? q.obg : q.bg; if (b) G.kf(b, t0, spec); };
  const art = (c, fn) => { const f = p => { p.H = hitOf(c); p.N = noOf(c); p.T = tR(c); fn(p); }; f.custom = true; f.dur = .35; f.exit = 'pop'; return G.art(f, { x: c.x, y: c.y, s: c.s, at: c.at || 0 }); };
  const rot = (p, a, x, y) => sub(p, { transform: `rotate(${a} ${x} ${y})` });
  const atT = (g, p, t) => on(g, p, t, { o: [[0, 0], [.12, 1]] });
  const show = (g, p, keys) => on(g, p, 0, { o: keys });                      // opacity keys on a plain group
  /* a moving group: keys { px, py (pivot for r / s), x, y, r, s, sx, sy } in canvas units, times = seconds after the design's `at` */
  function mvG(p, m) { const o = sub(p), g = sub(o); g.og = o.g; g.obg = o.bg; if (m) { const K = { ox: m.px || 0, oy: m.py || 0 }; TR.forEach(n => { if (m[n]) K[n] = m[n]; }); on(g, p, 0, K); } return g; }
  /* start offset of a part drawn tilted by `a` about P (pre-tilt centre c0) that must start with its centre at sc, tilted st */
  function off0(P, c0, a, sc, st = 0) { const u = rad(st), dx = c0[0] - P[0], dy = c0[1] - P[1];
    return { r0: st - a, x: f1(sc[0] - P[0] - (dx * Math.cos(u) - dy * Math.sin(u))), y: f1(sc[1] - P[1] - (dx * Math.sin(u) + dy * Math.cos(u))) }; }
  let CID = 0;
  /* a group clipped to a rectangle (canvas units) — for strips that slide under a sleeve, cables that run off the canvas */
  function clipG(p, x, y, w, h) { const svg = p.g.ownerSVGElement, cp = document.createElementNS(NS, 'clipPath'), r = document.createElementNS(NS, 'rect');
    cp.id = 'b05clip' + (++CID); Object.entries({ x, y, width: w, height: h }).forEach(([k, v]) => r.setAttribute(k, v)); cp.appendChild(r);
    (svg.querySelector('defs') || svg).appendChild(cp); return sub(p, { 'clip-path': `url(#${cp.id})` }); }
  /* a group of side s: wrong appears at .05 and fades to WO when it is rejected; right appears at tR. o.to = final opacity, o.t = appear */
  function side(p, c, s, o = {}) {
    const t = o.t ?? (s === 'wrong' ? .05 : tR(c)), to = o.to ?? (s === 'wrong' ? WO : 1), N = noOf(c), dt = o.dimAt ?? N + .1;
    if (to >= 1) { const g = sub(p); show(g, p, [[0, 0], [t, 0], [t + .14, 1]]); return g; }
    const base = sub(p), g = sub(p);
    show(base, p, [[0, 0], [t, 0], [t + .14, 1]]); show(g, p, [[0, 0], [t, 0], [t + .14, 1], [dt, 1], [dt + .25, to]]);
    return duo(base, g);
  }
  /* a pen that draws into `dim` and, for every shape filled with C.fill, a solid copy into `base` (keyframes go to both: on() reads .bg) */
  function duo(base, dim) {
    const q = Object.create(dim), solid = o => o && o.fill === C.fill ? Object.assign({}, o, { sw: 0, stroke: 'none' }) : null;
    ['rect', 'circle', 'ellipse', 'path', 'shape'].forEach(m => q[m] = (...a) => { const o = a[a.length - 1], so = solid(o);
      if (so) base[m](...a.slice(0, -1), so); return dim[m](...a); });
    q.child = attrs => { const b = base.child(attrs), d = dim.child(attrs); b.H = d.H = dim.H; b.N = d.N = dim.N; b.T = d.T = dim.T; return duo(b, d); };
    q.g = dim.g; q.bg = base.g; return q;
  }
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
  /* the picture of side s at (cx, cy), width wd (canvas units). o.r = [deg, px, py] static turn (with what it sits on); o.sx / o.sy static
     squash; o.mv = the motion keys of the part it sits on (canvas units, same object as for mvG); o.to = final opacity (wrong WO);
     o.t = when it appears; o.dimAt = when the wrong one fades. No picture → the label in big type. */
  function icon(d, s, cx, cy, wd, c, o = {}) {
    const it = d[s] || {}, at = c.at || 0, H = hitOf(c), N = noOf(c), t = o.t ?? (s === 'wrong' ? .12 : tR(c) + .06);
    const X = c.x + cx * c.s, Y = c.y + cy * c.s, fn = picOf(it), sc = v => c.x + v * c.s, scY = v => c.y + v * c.s;
    let a;
    if (fn) a = G.art(fn, { x: X, y: Y, w: wd * c.s, at: at + t });
    else { const str = it.label || it.icon; if (!str) return null;
      const f = q => txt(q, str, 0, wd * .13, { size: wd * .36, maxW: wd * 1.1, weight: 700, color: C.ink }); f.custom = true; f.dur = .3; f.exit = 'pop';
      a = G.art(f, { x: X, y: Y, s: c.s, at: at + t }); }
    /* inner layer (between the glow wrap and the engine's own groups) carries the static turn / squash */
    if (o.r || o.sx || o.sy) { const en = a.ex.parentNode, w = document.createElementNS(NS, 'g'); a.wrap.insertBefore(w, en); w.appendChild(en);
      const K = {}; if (o.r) { K.r = [[0, o.r[0]]]; K.ox = sc(o.r[1]); K.oy = scY(o.r[2]); } else { K.ox = X; K.oy = Y; }
      if (o.sx) K.sx = [[0, o.sx]]; if (o.sy) K.sy = [[0, o.sy]]; G.kf(w, at, K); }
    const K = {}, to = o.to ?? (s === 'wrong' ? WO : 1), dt = o.dimAt ?? N + .1;
    if (to < 1) K.o = [[0, 1], [dt, 1], [dt + .25, to]];
    if (o.mv) { const m = o.mv; K.ox = sc(m.px || 0); K.oy = scY(m.py || 0);
      ['x', 'y'].forEach(n => { if (m[n]) K[n] = m[n].map(([u, v, e]) => [u, v * c.s, e]); }); ['r', 's', 'sx', 'sy'].forEach(n => { if (m[n]) K[n] = m[n]; }); }
    if (Object.keys(K).length) G.kf(a.wrap, at, K);
    if (s === 'right' && !o.noPunch) G.kf(a.g, at + H, { ox: X, oy: Y, s: [[0, 1], [.07, 1.1, 'out'], [.32, 1, 'soft']] });
    return a;
  }
  /* ✕ / ✓ badge: ✕ stamps in when the wrong side is rejected (or at t), ✓ on the keyword */
  function badge(p, kind, x, y, r = 36, t) {
    const g = sub(p), k = r * .42; g.circle(x, y, r, F(3));
    if (kind === 'x') { g.line(x - k, y - k, x + k, y + k, W(5)); g.line(x + k, y - k, x - k, y + k, W(5)); }
    else g.poly([[x - k, y + 2], [x - k * .2, y + k * .8], [x + k * 1.05, y - k * .75]], W(5));
    on(g, p, t ?? (kind === 'x' ? p.N : p.H) + .05, { ox: x, oy: y, s: [[0, 1.8], [.14, .9, 'in'], [.26, 1.04], [.38, 1, 'soft']], o: [[0, 0], [.06, 1]] });
    return g;
  }
  /* glow behind the right side: blooms on the keyword */
  function halo(p, x, y, r = 120) {
    const g = sub(p); g.circle(x, y, r, { fill: GLASS, sw: 0, stroke: 'none' }); g.circle(x, y, r, S(2.4));
    on(g, p, p.H, { ox: x, oy: y, s: [[0, .6], [.2, 1.08, 'out'], [.4, 1, 'soft']], o: [[0, 0], [.12, 1]] });
  }
  const over = (c, fn) => art(Object.assign({}, c), fn);
  const floor = (p, y = 300, a = -470, b = 470) => { const g = sub(p); g.line(a, y, b, y, S(2)); atT(g, p, 0); return g; };
  const R = (q, x, y, w, h, rx, o) => q.rect(x, y, w, h, Object.assign({ rx }, o));
  const land = (t, d = 8) => [[t + .07, -d, 'out'], [t + .16, 0, 'soft']];     // a small bounce after landing at t (append to a y track)
  const shake = (t, a = 10) => [[0, 0], [t, 0], [t + .05, -a], [t + .1, a], [t + .15, -a * .6], [t + .2, a * .4], [t + .25, 0]];

  const V = [];
  const variant = (id, th, build) => V.push({ id, th, build });

  /* 01 ── STAMP: two sheets slide onto the desk — the stamp presses ✕ onto the wrong sheet, travels over, presses ✓ onto the right one
     on the keyword, and lifts away to its resting place */
  variant('stamp', 'ตรายางประทับ', (d, c) => {
    const X = { wrong: -240, right: 190 }, top = -215, h = 420, w = 300, N = noOf(c), H = hitOf(c), T = tR(c);
    const inK = s => { const t = s === 'wrong' ? .05 : T; return { y: [[0, 40], [t, 40], [t + .3, 0, 'out']] }; };
    art(c, p => {
      ['wrong', 'right'].forEach(s => { const x = X[s], l = x - w / 2, r = x + w / 2, b = top + h, k = 46, g = mvG(side(p, c, s), inK(s));
        g.path(`M ${l} ${top} L ${r - k} ${top} L ${r} ${top + k} L ${r} ${b} L ${l} ${b} Z`, F(3.2)); g.path(`M ${r - k} ${top} L ${r - k} ${top + k} L ${r} ${top + k}`, W(2));
        lbl(g, d, s, x, 70, { maxW: w - 40 });
        const im = sub(p), cx = x + 68, cy = b - 72; im.circle(cx, cy, 50, W(3.2));
        if (s === 'wrong') { im.line(cx - 22, cy - 22, cx + 22, cy + 22, W(5.5)); im.line(cx + 22, cy - 22, cx - 22, cy + 22, W(5.5)); atT(im, p, N); }
        else { im.poly([[cx - 24, cy + 2], [cx - 6, cy + 20], [cx + 26, cy - 16]], W(5.5)); atT(im, p, H); } });
      /* the stamp: rubber centre (320,-186) at rest; presses at the imprints (-172,133) and (258,133) */
      const st0 = sub(p); atT(st0, p, .1);
      const sm = mvG(st0, { px: 300, py: -200,
        x: [[0, -492], [N + .22, -492], [T + .2, -62, 'io'], [H + .12, -62], [H + .5, 0, 'out']],
        y: [[0, 79], [N - .2, 79], [N - .02, 319, 'in'], [N + .08, 319], [N + .26, 79, 'out'], [H - .2, 79], [H - .02, 319, 'in'], [H + .1, 319], [H + .5, 0, 'out']],
        r: [[0, 8], [H + .12, 8], [H + .5, 0, 'out']] });
      const st = rot(sm, -8, 300, -200), sx = 320, sy = -300;
      st.circle(sx, sy - 40, 30, F(3.2)); st.path(`M ${sx - 18} ${sy - 12} L ${sx + 18} ${sy - 12} L ${sx + 36} ${sy + 50} L ${sx - 36} ${sy + 50} Z`, F(3.2));
      R(st, sx - 95, sy + 50, 190, 54, 12, F(3.4)); st.line(sx - 80, sy + 72, sx + 80, sy + 72, S(1.6)); R(st, sx - 82, sy + 104, 164, 20, 5, F(2.8));
    });
    ['wrong', 'right'].forEach(s => icon(d, s, X[s], -75, 160, c, { mv: inK(s) }));
  });

  /* 02 ── WHITEBOARD: the board rolls in, the wrong line is written and the marker strikes it through; the right line is written under it,
     circled and ticked on the keyword */
  variant('whiteboard', 'ไวท์บอร์ด', (d, c) => {
    const yW = -200, yR = 10, N = noOf(c), H = hitOf(c), T = tR(c);
    const wr = t => ({ x: [[0, -40], [t, -40], [t + .3, 0, 'out']] });
    art(c, p => {
      const B = mvG(sub(p), { x: [[0, -120], [.3, 0, 'out'], [.36, 6, 'soft'], [.44, 0]] }); atT(B, p, 0);
      R(B, -420, -320, 840, 452, 14, F(3.4)); R(B, -390, 138, 780, 18, 6, F(2.6));                       // board + marker tray
      R(B, -330, 118, 110, 20, 9, F(2.4)); R(B, -220, 120, 34, 16, 6, F(2.2));                             // marker + cap on the tray
      R(B, 190, 110, 120, 28, 6, F(2.6)); B.line(196, 128, 304, 128, S(1.6));                              // eraser (felt line)
      [-330, 330].forEach(x => { R(B, x - 9, 156, 18, 150, 6, F(2.6)); B.line(x - 70, 306, x + 70, 306, W(4)); B.circle(x - 62, 320, 10, F(2.4)); B.circle(x + 62, 320, 10, F(2.4)); });
      const gw = mvG(side(p, c, 'wrong', { t: .25 }), wr(.25)); lbl(gw, d, 'wrong', -165, yW + 18, { anchor: 'start', maxW: 470, size: 54, weight: 700, color: C.ink });
      const k1 = sub(p); on(k1.path(`M -370 ${yW + 6} C -150 ${yW - 22}, 110 ${yW + 26}, 350 ${yW - 10}`, W(6)), p, N, { draw: [[0, 0], [.25, 1, 'out']] });
      const gr = mvG(side(p, c, 'right'), wr(T)); lbl(gr, d, 'right', -165, yR + 18, { anchor: 'start', maxW: 470, size: 54, weight: 700, color: C.ink });
      const k2 = sub(p); on(k2.ellipse(-25, yR, 365, 92, W(4.4)), p, H - .05, { draw: [[0, 0], [.3, 1, 'out']] });
      const k3 = sub(p); on(k3.poly([[352, yR - 4], [370, yR + 22], [404, yR - 34]], W(6)), p, H + .2, { draw: [[0, 0], [.15, 1, 'out']] });
    });
    icon(d, 'wrong', -265, yW, 130, c, { t: .3, mv: wr(.25) }); icon(d, 'right', -265, yR, 130, c, { mv: wr(T) });
  });

  /* 03 ── SHREDDER: the wrong card waits in the feed slot — on "ไม่ใช่" the shredder buzzes, pulls it down and strips spill into the bin;
     the right card rises beside it ✓ */
  variant('shredder', 'เครื่องทำลายเอกสาร', (d, c) => {
    const N = noOf(c), T = tR(c);
    const feed = { y: [[0, -30], [N, -30], [N + .5, 0, 'lin']], x: shake(N, 3).concat([[N + .3, 3], [N + .35, -3], [N + .4, 2], [N + .5, 0]]).filter((k, i, a) => i === 0 || k[0] > a[i - 1][0]) };
    const up = { y: [[0, 60], [T, 60], [T + .3, 0, 'out']] };
    art(c, p => {
      floor(p);
      const gw = mvG(side(p, c, 'wrong'), feed); R(gw, -310, -320, 220, 300, 14, F(3)); lbl(gw, d, 'wrong', -200, -75, { maxW: 190, size: 38 });
      const M = sub(p); atT(M, p, 0);
      const strips = mvG(M, { py: 52, sy: [[0, 0], [N, 0], [N + .55, 1, 'out']] }); show(strips, p, [[0, 0], [N, 0], [N + .02, 1]]);
      [-290, -262, -234, -206, -178, -150, -122].forEach((x, i) => strips.path(`M ${x} 52 C ${x + 6} 100, ${x - 8} 140, ${x + (i % 2 ? 10 : -6)} ${180 + (i % 3) * 14}`, S(2)));
      const pile = sub(M); on(pile, p, N + .35, { o: [[0, 0], [.2, 1]], y: [[0, 20], [.25, 0, 'out']] });
      [[-300, 262, -210, 250], [-250, 276, -150, 262], [-200, 252, -110, 270], [-160, 280, -70, 268]].forEach(([a, y1, b, y2]) => pile.path(`M ${a} ${y1} Q ${(a + b) / 2} ${y1 - 26} ${b} ${y2}`, S(2)));
      R(M, -360, 50, 340, 250, 14, { fill: GLASS, sw: 3 }); R(M, -260, 74, 140, 22, 11, W(2));                   // clear bin + handle slot
      const hd = mvG(M, { x: shake(N, 4).concat([[N + .3, 4], [N + .35, -4], [N + .45, 2], [N + .55, 0]]) });
      R(hd, -385, -30, 390, 84, 18, F(3.4)); R(hd, -330, -36, 260, 12, 6, F(2.4));                               // head + feed slot
      hd.line(-370, 30, -10, 30, S(1.6)); hd.circle(-48, 2, 15, F(2.6)); hd.circle(-90, 2, 6, W(2));            // seam, power button, LED
      const led = sub(hd); led.circle(-90, 2, 6, { fill: C.ink, sw: 1.4 }); show(led, p, [[0, 0], [N - .05, 0], [N, 1], [N + .55, 1], [N + .6, 0]]);
      const gr = mvG(side(p, c, 'right'), up); R(gr, 110, -110, 290, 400, 20, F(3.2)); lbl(gr, d, 'right', 255, 215, { maxW: 250 });
      badge(p, 'check', 395, -105);
    });
    icon(d, 'wrong', -200, -210, 130, c, { mv: feed }); icon(d, 'right', 255, 40, 190, c, { mv: up });
  });

  /* 04 ── PEDAL BIN: the wrong card lies on the closed lid — the pedal goes down, the lid flips open and the card drops in;
     the right one appears in the light ✓ */
  variant('bin', 'ถังขยะเหยียบ', (d, c) => {
    const cw = { x: -270, y: -70, r: 18 }, N = noOf(c), o = off0([cw.x, cw.y], [cw.x, cw.y], cw.r, [cw.x, -155], 0);
    const drop = { px: cw.x, py: cw.y, x: [[0, o.x], [N, o.x], [N + .3, 0, 'in']],
      y: [[0, o.y - 90], [.05, o.y - 90], [.32, o.y, 'in'], [N, o.y], [N + .3, 0, 'in'], ...land(N + .3)], r: [[0, o.r0], [N, o.r0], [N + .3, 0, 'in']] };
    art(c, p => {
      floor(p);
      const L0 = sub(p); show(L0, p, [[0, 0], [N - .12, 0], [N - .1, 1]]);
      const L = mvG(L0, { py: -8, sy: [[0, .15], [N - .12, .15], [N, 1, 'out'], [N + .06, .96], [N + .12, 1]] });
      L.path('M -404 -8 L -410 -150 Q -410 -172 -388 -172 L -152 -172 Q -130 -172 -130 -150 L -124 -8', F(3)); L.line(-390, -150, -150, -150, S(1.6));   // lid swung open, seen from below
      const gw = side(p, c, 'wrong'), cg = rot(mvG(gw, drop), cw.r, cw.x, cw.y); R(cg, cw.x - 105, cw.y - 125, 210, 250, 14, F(3));
      lbl(gw, d, 'wrong', -270, -262, { maxW: 260 });
      const shut = sub(p); show(shut, p, [[0, 0], [.02, 1], [N - .12, 1], [N - .1, 0]]); R(shut, -404, -32, 282, 24, 10, F(3)); R(shut, -300, -44, 66, 14, 6, F(2.4));   // closed lid
      const B = sub(p); atT(B, p, 0);
      B.path('M -400 14 L -140 14 L -160 284 Q -162 294 -172 294 L -368 294 Q -378 294 -380 284 Z', F(3.4)); R(B, -414, -10, 302, 26, 10, F(3));
      B.line(-386, 250, -154, 250, S(1.6));
      const pd = mvG(B, { y: [[0, 0], [N - .22, 0], [N - .12, 8, 'in'], [N + .35, 8], [N + .45, 0, 'out']] }); R(pd, -306, 284, 76, 16, 6, F(2.6));   // pedal
      const gr = side(p, c, 'right'); lbl(gr, d, 'right', 240, 215, { maxW: 300 });
      halo(p, 240, 0, 150); badge(p, 'check', 360, -125);
    });
    icon(d, 'wrong', cw.x, cw.y - 40, 120, c, { r: [cw.r, cw.x, cw.y], mv: drop }); icon(d, 'right', 240, 0, 210, c);
  });

  /* 05 ── KEY: the wrong key pokes at the lock twice, does not fit, backs off ✕; the right key slides in, turns on the keyword and the
     shackle springs open ✓ */
  function key(q, bx, by, R0, len) {
    q.circle(bx, by, R0, F(3.4)); R(q, bx + R0 - 6, by - 26, 30, 52, 8, F(3));
    const x0 = bx + R0 + 24; R(q, x0, by - 17, len, 34, 8, F(3)); q.line(x0 + 10, by, x0 + len - 26, by, S(1.6));
    const t = x0 + len - 150; q.poly([[t, by + 17], [t + 14, by + 40], [t + 36, by + 40], [t + 50, by + 17], [t + 64, by + 32], [t + 86, by + 32], [t + 100, by + 17]], F(2.8));
  }
  variant('key', 'กุญแจผิดดอก', (d, c) => {
    const kw = { x: -290, y: -185, r: -7 }, kr = { x: -200, y: 110 }, N = noOf(c), H = hitOf(c), T = tR(c);
    const poke = { x: [[0, -170], [.05, -170], [N - .32, 95, 'io'], [N - .22, 60], [N - .12, 95, 'in'], [N - .02, 60], [N + .3, 0, 'out']] };
    const turn = { py: kr.y, x: [[0, -150], [T, -150], [T + .35, 0, 'out'], [T + .41, -5], [T + .47, 0]], sy: [[0, 1], [H - .2, 1], [H - .1, .3, 'in'], [H, 1, 'out']] };
    art(c, p => {
      const gw = mvG(side(p, c, 'wrong'), poke), wg = rot(gw, kw.r, kw.x, kw.y); key(wg, kw.x, kw.y, 78, 250); lbl(gw, d, 'wrong', kw.x, kw.y + 130, { maxW: 240 });
      const sk = mvG(sub(p), { y: [[0, 80], [H, 80], [H + .1, -12, 'out'], [H + .22, 0, 'soft']] }); atT(sk, p, 0);
      sk.path('M 250 -10 L 250 -170 A 70 70 0 0 1 390 -170 L 390 -95', { sw: 34 }); sk.path('M 250 -10 L 250 -170 A 70 70 0 0 1 390 -170 L 390 -95', { sw: 24, stroke: C.fill });   // shackle
      const gr = side(p, c, 'right'); key(mvG(gr, turn), kr.x, kr.y, 96, 300);
      const L = sub(p); atT(L, p, 0);
      R(L, 190, -14, 260, 250, 44, F(3.4)); L.line(204, 60, 436, 60, S(1.6)); L.line(204, 170, 436, 170, S(1.6));
      L.circle(250, kr.y, 16, W(2.4));                                                                              // keyhole the blade goes into
      lbl(mvG(gr, { x: turn.x }), d, 'right', kr.x, kr.y + 150, { maxW: 260 });
      badge(p, 'x', 95, -255); badge(p, 'check', 430, -60);
    });
    icon(d, 'wrong', kw.x, kw.y, 100, c, { r: [kw.r, kw.x, kw.y], mv: poke }); icon(d, 'right', kr.x, kr.y, 124, c, { mv: turn });
  });

  /* 06 ── SORTER: the wrong tile rides the belt to the gap — the flap drops and it slides down the reject chute; the right tile is set
     on the far belt and rides on to the end ✓ */
  variant('sorter', 'สายพานคัดแยก', (d, c) => {
    const tw = { x: -150, y: 175, r: 38 }, N = noOf(c), H = hitOf(c), T = tR(c);
    const ride = { px: tw.x, py: tw.y, x: [[0, -250], [.05, -250], [N - .05, 0, 'io']], y: [[0, -255], [N, -255], [N + .4, 0, 'in'], ...land(N + .4)], r: [[0, -38], [N, -38], [N + .3, 0, 'in']] };
    const go = { x: [[0, -225], [T, -225], [H - .1, 0, 'io']], y: [[0, -90], [T, -90], [T + .22, 0, 'in'], ...land(T + .22)] };
    art(c, p => {
      const B = sub(p); atT(B, p, 0);
      B.line(-230, 52, -330, 300, W(3)); B.line(-70, 52, -170, 300, W(3)); R(B, -370, 290, 240, 40, 10, F(3));                 // chute + reject box
      R(B, -480, 0, 250, 50, 25, F(3.2)); [-450, -390, -330, -270].forEach(x => { B.circle(x, 25, 13, W(2)); });
      R(B, -70, 0, 550, 50, 25, F(3.2)); [-40, 30, 100, 170, 240, 310, 380, 450].forEach(x => B.circle(x, 25, 13, W(2)));
      const fl = rot(mvG(B, { px: -230, py: 25, r: [[0, -62], [N - .08, -62], [N + .06, 0, 'in'], [N + .14, -6, 'out'], [N + .22, 0]] }), 62, -230, 25);
      R(fl, -230, 15, 150, 18, 6, F(2.6)); B.circle(-230, 25, 7, W(2));                                                      // flap on its hinge
      [50, 440].forEach(x => { R(B, x - 10, 50, 20, 250, 6, F(2.4)); B.line(x - 40, 300, x + 40, 300, W(3)); });
      const gw = side(p, c, 'wrong'), tg = rot(mvG(gw, ride), tw.r, tw.x, tw.y); R(tg, tw.x - 80, tw.y - 80, 160, 160, 16, F(3));
      lbl(gw, d, 'wrong', -360, -190, { maxW: 220 });
      const gr = mvG(side(p, c, 'right'), go); R(gr, 210, -190, 190, 190, 18, F(3.2)); lbl(gr, d, 'right', 305, -225, { maxW: 300 });
      badge(p, 'check', 400, -190);
    });
    icon(d, 'wrong', tw.x, tw.y, 100, c, { r: [tw.r, tw.x, tw.y], mv: ride }); icon(d, 'right', 305, -95, 125, c, { mv: go });
  });

  /* 07 ── DESK LAMP: the lamp lights the wrong one — on "ไม่ใช่" it goes dark and the head swings over; on the keyword the switch clicks
     and the light falls on the right one ✓ */
  variant('lamp', 'โคมไฟตั้งโต๊ะ', (d, c) => {
    const J0 = [0, 255], J1 = [-90, 20], J2 = [110, -200], ang = 62, ang0 = 118, N = noOf(c), H = hitOf(c);
    const coneTo = (a0, x1, x2) => { const a = rad(a0), ux = Math.cos(a), uy = Math.sin(a), nx = -uy, ny = ux, mx = J2[0] + ux * 150, my = J2[1] + uy * 150;
      return [[mx + nx * 75, my + ny * 75], [mx - nx * 75, my - ny * 75], [x2, 300], [x1, 300]].map(([x, y]) => [f1(x), f1(y)]); };
    art(c, p => {
      floor(p);
      const cone = sub(p); cone.shape(coneTo(ang, 150, 470), { fill: GLASS, sw: 0, stroke: 'none' }); on(cone, p, H - .1, { o: [[0, 0], [.2, 1]] });
      const c0 = sub(p); c0.shape(coneTo(ang0, -150, -470), { fill: GLASS, sw: 0, stroke: 'none' }); show(c0, p, [[0, 0], [.25, 0], [.4, 1], [N - .02, 1], [N + .06, 0]]);
      const A = sub(p); atT(A, p, 0);
      R(A, -120, 262, 240, 38, 18, F(3.2)); const swc = mvG(A, { y: [[0, 0], [H - .16, 0], [H - .11, 5], [H - .02, 0]] }); R(swc, 60, 250, 34, 14, 5, F(2.2));   // base + switch
      const arm = (P, Q) => { const L = Math.hypot(Q[0] - P[0], Q[1] - P[1]), g = rot(A, f1(Math.atan2(Q[1] - P[1], Q[0] - P[0]) * 180 / Math.PI), P[0], P[1]);
        R(g, P[0], P[1] - 11, L, 22, 11, F(2.6)); g.line(P[0] + 26, P[1], P[0] + L - 26, P[1], S(1.4)); };
      arm(J0, J1); arm(J1, J2);
      [J0, J1, J2].forEach(([x, y]) => { A.circle(x, y, 20, F(2.8)); A.circle(x, y, 6, W(2)); });
      const hd = rot(mvG(A, { px: J2[0], py: J2[1], r: [[0, ang0 - ang], [N, ang0 - ang], [N + .45, 0, 'io'], [N + .52, -3, 'out'], [N + .6, 0]] }), ang, J2[0], J2[1]);
      const x0 = J2[0], y0 = J2[1];
      hd.path(`M ${x0 + 10} ${y0 - 26} L ${x0 + 60} ${y0 - 30} L ${x0 + 150} ${y0 - 75} L ${x0 + 150} ${y0 + 75} L ${x0 + 60} ${y0 + 30} L ${x0 + 10} ${y0 + 26} Z`, F(3.2));
      hd.path(`M ${x0 + 150} ${y0 - 40} A 40 40 0 0 1 ${x0 + 150} ${y0 + 40}`, W(2.4));                                       // bulb in the mouth
      const gw = side(p, c, 'wrong'); lbl(gw, d, 'wrong', -310, 262, { maxW: 260 });
      const gr = side(p, c, 'right'); lbl(gr, d, 'right', 310, 262, { maxW: 280 });
      badge(p, 'x', -200, 30); badge(p, 'check', 420, 10);
    });
    icon(d, 'wrong', -310, 115, 170, c); icon(d, 'right', 310, 115, 175, c);
  });

  /* 08 ── SIGNPOST: two arrow planks on a post — the wrong plank's top nail pops and it swings down on the other nail ✕;
     the right plank is nailed on pointing the way ✓ */
  variant('signpost', 'ป้ายบอกทาง', (d, c) => {
    const pv = [0, 70], aw = -38, wi = [-150, 40], N = noOf(c), T = tR(c);
    const swing = { px: pv[0], py: pv[1], r: [[0, -aw], [N, -aw], [N + .3, 0, 'in'], [N + .42, -7, 'out'], [N + .56, 4, 'soft'], [N + .72, 0, 'soft']] };
    const nail = { x: [[0, -140], [T, -140], [T + .3, 0, 'back']] };
    art(c, p => {
      const P = sub(p); atT(P, p, 0);
      P.path('M -150 312 Q 0 266 150 312', F(3)); R(P, -24, -270, 48, 575, 6, F(3.2)); P.path('M -32 -268 L 0 -305 L 32 -268 Z', F(3));
      P.line(-8, -200, -8, 290, S(1.4)); P.line(8, -40, 8, 200, S(1.4));
      const gw = side(p, c, 'wrong'), wp = rot(mvG(gw, swing), aw, pv[0], pv[1]);
      wp.path('M 60 -20 L -300 -20 L -362 40 L -300 100 L 60 100 Z', F(3.2)); wp.line(-290, 0, 40, 0, S(1.4)); wp.line(-300, 80, 40, 80, S(1.4));
      wp.circle(0, 70, 7, F(2.4)); wp.circle(0, 10, 5, S(1.6));
      lbl(wp, d, 'wrong', -230, 55, { maxW: 200, size: 40 });
      const nl = mvG(sub(p), { y: [[0, 0], [N, 0], [N + .3, 90, 'in']], x: [[0, 0], [N, 0], [N + .3, 30]] }); nl.circle(0, 10, 7, F(2.4)); show(nl, p, [[0, 0], [.05, 0], [.15, 1], [N + .2, 1], [N + .3, 0]]);
      const gr = mvG(side(p, c, 'right'), nail);
      gr.path('M -60 -250 L 360 -250 L 425 -185 L 360 -120 L -60 -120 Z', F(3.2)); gr.line(-50, -228, 350, -228, S(1.4)); gr.line(-50, -142, 350, -142, S(1.4));
      gr.circle(0, -220, 7, F(2.4)); gr.circle(0, -150, 7, F(2.4));
      lbl(gr, d, 'right', 145, -170, { anchor: 'start', maxW: 215, size: 44 });
      badge(p, 'check', 395, -280, 32);
    });
    icon(d, 'wrong', wi[0], wi[1], 90, c, { r: [aw, pv[0], pv[1]], mv: swing }); icon(d, 'right', 85, -185, 100, c, { mv: nail });
  });

  /* 09 ── PHONE: the wrong card is on the screen — on "ไม่ใช่" it is swiped off with speed lines ✕; the right card slides up into its place
     and its button ticks on the keyword ✓ */
  variant('phone', 'มือถือปัดทิ้ง', (d, c) => {
    const px = 150, wc = { x: -280, y: -15, r: -14 }, N = noOf(c), H = hitOf(c), T = tR(c), o = off0([wc.x, wc.y], [wc.x, wc.y], wc.r, [px, -30], 0);
    const swipe = { px: wc.x, py: wc.y, x: [[0, o.x], [N, o.x], [N + .35, 0, 'out']], y: [[0, o.y + 70], [.05, o.y + 70], [.32, o.y, 'out'], [N, o.y], [N + .35, 0, 'out']], r: [[0, o.r0], [N, o.r0], [N + .35, 0, 'out']] };
    const up = { y: [[0, 90], [T, 90], [T + .3, 0, 'out']] };
    art(c, p => {
      const P = sub(p); atT(P, p, 0);
      R(P, px - 160, -315, 320, 630, 48, F(3.4)); R(P, px - 136, -270, 272, 520, 26, { sw: 1.8, stroke: C.soft });
      R(P, px - 40, -298, 80, 12, 6, W(2)); P.circle(px + 62, -292, 7, W(2)); R(P, px - 50, 274, 100, 10, 5, W(1.8));
      R(P, px - 168, -190, 8, 70, 3, F(2)); R(P, px - 168, -100, 8, 70, 3, F(2)); R(P, px + 160, -150, 8, 100, 3, F(2));
      const gr = mvG(side(p, c, 'right'), up); R(gr, px - 115, -200, 230, 340, 22, F(3)); lbl(gr, d, 'right', px, 90, { maxW: 200 });
      R(gr, px - 90, 170, 180, 50, 25, F(2.6));
      const ok = sub(gr); ok.poly([[px - 16, 195], [px - 4, 207], [px + 18, 183]], W(4)); atT(ok, p, H);
      const gw = side(p, c, 'wrong'), wg = rot(mvG(gw, swipe), wc.r, wc.x, wc.y); R(wg, wc.x - 110, wc.y - 160, 220, 320, 22, F(3)); lbl(wg, d, 'wrong', wc.x, wc.y + 110, { maxW: 190, size: 38 });
      const sp = sub(p); [-70, 0, 70].forEach((y, i) => sp.line(-130 + i * 8, y - 10, -40 + i * 8, y - 10, S(2.4))); on(sp, p, N + .08, { o: [[0, 0], [.08, 1]], x: [[0, 60], [.25, 0, 'out']] });
      badge(p, 'x', wc.x - 100, wc.y - 175, 32, N + .35); badge(p, 'check', px + 115, -200, 32);
    });
    icon(d, 'wrong', wc.x, wc.y - 40, 130, c, { r: [wc.r, wc.x, wc.y], mv: swipe }); icon(d, 'right', px, -60, 150, c, { mv: up });
  });

  /* 10 ── CORKBOARD: the wrong note is pinned up — on "ไม่ใช่" the pin pops out and the note drops onto the ledge ✕;
     the right note is slapped up in its place and pinned ✓ */
  variant('corkboard', 'บอร์ดปักหมุด', (d, c) => {
    const wn = { x: -275, y: 38, r: -11 }, rn = { x: 75, y: -140 }, N = noOf(c), T = tR(c), P = [wn.x, wn.y + 130];
    const o = off0(P, [wn.x, wn.y], wn.r, [rn.x, rn.y], 2);
    const fall = { px: P[0], py: P[1], x: [[0, o.x], [N, o.x], [N + .45, 0, 'in']], y: [[0, o.y - 60], [.05, o.y - 60], [.3, o.y, 'out'], [N, o.y], [N + .14, o.y - 16, 'out'], [N + .45, 0, 'in'], ...land(N + .45)],
      r: [[0, o.r0], [N, o.r0], [N + .45, 0, 'in'], [N + .55, -3, 'out'], [N + .65, 0, 'soft']] };
    const slap = { px: rn.x, py: rn.y, s: [[0, 1.15], [T, 1.15], [T + .16, .97, 'in'], [T + .26, 1, 'soft']] };
    art(c, p => {
      const B = sub(p); atT(B, p, 0); R(B, -430, -325, 860, 500, 14, F(3.4)); R(B, -455, 175, 910, 26, 8, F(3));
      const gr = side(p, c, 'right'), rg = rot(mvG(gr, slap), 2, rn.x, rn.y); R(rg, rn.x - 130, rn.y - 130, 260, 260, 8, F(3)); lbl(rg, d, 'right', rn.x, rn.y + 95, { maxW: 220 });
      const gw = side(p, c, 'wrong'), wg = rot(mvG(gw, fall), wn.r, P[0], P[1]); R(wg, wn.x - 130, wn.y - 130, 260, 260, 8, F(3)); lbl(wg, d, 'wrong', wn.x, wn.y + 95, { maxW: 220, size: 38 });
      const wpin = mvG(sub(p), { x: [[0, 0], [N, 0], [N + .45, -165]], y: [[0, 0], [N, 0], [N + .15, -50, 'out'], [N + .45, 424, 'in']] }); show(wpin, p, [[0, 0], [.2, 0], [.26, 1], [N + .43, 1], [N + .45, 0]]);
      wpin.circle(rn.x, rn.y - 118, 18, F(3)); wpin.circle(rn.x - 5, rn.y - 123, 5, W(1.8));
      const pin = sub(p); show(pin, p, [[0, 0], [N + .44, 0], [N + .46, .45]]); pin.ellipse(-90, 166, 16, 9, F(2.6)); pin.line(-74, 166, -40, 160, W(2.4));
      const pr = mvG(sub(p), { y: [[0, -40], [T + .14, -40], [T + .24, 0, 'in']] }); pr.circle(rn.x, rn.y - 118, 18, F(3)); pr.circle(rn.x - 5, rn.y - 123, 5, W(1.8)); atT(pr, p, T + .14);
      badge(p, 'check', rn.x + 130, rn.y - 125, 34);
    });
    icon(d, 'wrong', wn.x, wn.y - 25, 120, c, { r: [wn.r, P[0], P[1]], mv: fall }); icon(d, 'right', rn.x, rn.y - 30, 135, c, { r: [2, rn.x, rn.y], mv: slap });
  });

  /* 11 ── DRAWERS: the wrong one sits over its open drawer — on "ไม่ใช่" it sinks in and the drawer slams shut (it shows in the label window) ✕;
     the right drawer slides open and the right one rises out of it ✓ */
  variant('drawers', 'ตู้ลิ้นชัก', (d, c) => {
    const N = noOf(c), T = tR(c);
    const slam = { px: -210, py: 140, y: [[0, 34], [N + .08, 34], [N + .24, 0, 'in'], [N + .3, -5, 'out'], [N + .38, 0, 'soft']], s: [[0, 1.07], [N + .08, 1.07], [N + .24, 1, 'in']] };
    const pull = { px: 210, py: 185, y: [[0, -34], [T, -34], [T + .22, 0, 'out'], [T + .3, 4, 'soft'], [T + .36, 0]], s: [[0, .93], [T, .93], [T + .22, 1, 'out']] };
    const sink = { px: -295, py: 170, x: [[0, 85], [N - .1, 85], [N + .14, 0, 'in']], y: [[0, -335], [N - .1, -335], [N + .14, 0, 'in']], s: [[0, 2.375], [N - .1, 2.375], [N + .14, 1, 'in']] };
    art(c, p => {
      const B = sub(p); atT(B, p, 0);
      R(B, -445, -20, 890, 30, 8, F(3)); R(B, -425, 10, 850, 262, 8, F(3.2));
      [-385, 385].forEach(x => B.path(`M ${x - 22} 272 L ${x + 22} 272 L ${x + 12} 312 L ${x - 12} 312 Z`, F(2.6)));
      R(B, 12, 28, 396, 226, 8, F(2.4));                                                                         // the open drawer's empty bay
      const wb = sub(p); show(wb, p, [[0, 0], [.05, 0], [.15, 1], [N + .2, 1], [N + .24, 0]]); wb.path('M -408 28 L -12 28 L 12 62 L -432 62 Z', { fill: C.fill, sw: 2.4, stroke: C.soft });
      const gw = mvG(side(p, c, 'wrong', { to: .55 }), slam); R(gw, -408, 28, 396, 226, 10, F(2.8)); gw.circle(-210, 70, 15, F(2.6));
      R(gw, -350, 115, 280, 110, 8, W(2)); lbl(gw, d, 'wrong', -165, 185, { maxW: 150, size: 36, anchor: 'middle' });
      const gr = mvG(side(p, c, 'right'), pull);
      gr.path('M 12 28 L 408 28 L 432 70 L -12 70 Z', { fill: C.fill, sw: 2.4, stroke: C.soft });              // drawer box seen over its front
      R(gr, -12, 70, 444, 230, 10, F(3)); gr.circle(210, 112, 15, F(2.6)); R(gr, 70, 150, 280, 110, 8, W(2)); lbl(gr, d, 'right', 210, 220, { maxW: 250, size: 40 });
      halo(p, 210, -165, 125); badge(p, 'x', -400, 30, 32, N + .3); badge(p, 'check', 330, -270, 34);
    });
    icon(d, 'wrong', -295, 170, 80, c, { to: .7, mv: sink }); icon(d, 'right', 210, -165, 190, c, { t: T + .2, mv: { y: [[0, 140], [T + .2, 140], [T + .5, 0, 'out']] } });
  });

  /* 12 ── PULLEY: the wrong bucket hangs high, the right one low — on "ไม่ใช่" the rope runs: the wrong bucket is lowered to the ground ✕
     and the right one is hauled up ✓ */
  variant('pulley', 'รอกสองถัง', (d, c) => {
    const L = -235, Rx = 235, yw = 150, yr = -70, N = noOf(c), Dy = 220;
    const bucket = (q, x, y) => { q.path(`M ${x - 104} ${y} Q ${x} ${y - 120} ${x + 104} ${y}`, S(2.4));
      q.path(`M ${x - 100} ${y} L ${x + 100} ${y} L ${x + 80} ${y + 130} Q ${x + 78} ${y + 140} ${x + 66} ${y + 140} L ${x - 66} ${y + 140} Q ${x - 78} ${y + 140} ${x - 80} ${y + 130} Z`, F(3.2));
      R(q, x - 108, y - 12, 216, 24, 8, F(3)); q.circle(x - 104, y, 6, W(2)); q.circle(x + 104, y, 6, W(2)); };
    const down = { y: [[0, -Dy], [N, -Dy], [N + .6, 0, 'io'], ...land(N + .6, 6)] }, upK = { y: [[0, Dy], [N, Dy], [N + .6, 0, 'io']] };
    art(c, p => {
      floor(p, 290);
      const T0 = sub(p); atT(T0, p, 0); R(T0, -380, -330, 760, 28, 8, F(3));
      [L, Rx].forEach(x => { T0.path(`M ${x - 30} -302 L ${x - 8} -248 M ${x + 30} -302 L ${x + 8} -248`, W(3)); });
      const rope = sub(p); atT(rope, p, 0); rope.path(`M ${L - 48} -240 A 48 48 0 0 1 ${L} -288 L ${Rx} -288 A 48 48 0 0 1 ${Rx + 48} -240`, S(3));
      const lw = (yw - 60) + 240, lr = (yr - 60) + 240;                                                            // rope drops at rest
      mvG(rope, { py: -240, sy: [[0, (lw - Dy) / lw], [N, (lw - Dy) / lw], [N + .6, 1, 'io']] }).line(L - 48, -240, L - 48, yw - 60, S(3));
      mvG(rope, { py: -240, sy: [[0, (lr + Dy) / lr], [N, (lr + Dy) / lr], [N + .6, 1, 'io']] }).line(Rx + 48, -240, Rx + 48, yr - 60, S(3));
      [L, Rx].forEach(x => { T0.circle(x, -240, 48, F(3)); T0.circle(x, -240, 36, S(1.6)); T0.circle(x, -240, 8, W(2.2)); });
      const gw = mvG(side(p, c, 'wrong'), down); bucket(gw, L - 48, yw); lbl(gw, d, 'wrong', L + 90, yw + 80, { maxW: 200, size: 38, anchor: 'start' });
      const rb = sub(p); atT(rb, p, .05); const rm = mvG(rb, upK); bucket(rm, Rx + 48, yr); lbl(side(rm, c, 'right'), d, 'right', Rx + 48, yr + 195, { maxW: 280 });
      badge(p, 'check', Rx + 160, yr - 40, 34);
    });
    icon(d, 'wrong', L - 48, yw + 68, 100, c, { mv: down }); icon(d, 'right', Rx + 48, yr + 68, 108, c, { mv: upK });
  });

  /* 13 ── SIGNAL: the wrong lamp is lit — on "ไม่ใช่" it goes dark ✕; on the keyword the right lamp lights ✓ */
  variant('signal', 'ไฟสัญญาณ', (d, c) => {
    const yW = -180, yR = 85, N = noOf(c), H = hitOf(c);
    art(c, p => {
      const B = sub(p); atT(B, p, 0);
      R(B, -18, 225, 36, 120, 6, F(2.8)); R(B, -70, 338, 140, 12, 5, F(2.4));
      R(B, -140, -325, 280, 550, 42, F(3.4)); R(B, -40, 225, 80, 14, 4, F(2.4));
      const VS = y => `M -104 ${y - 62} A 121 121 0 0 1 104 ${y - 62}`;                                         // visor over each lamp
      [yW, yR].forEach(y => { B.path(VS(y), { sw: 16 }); B.path(VS(y), { sw: 9, stroke: C.fill }); });
      const gw = side(p, c, 'wrong', { to: .5 }); gw.circle(0, yW, 102, F(3)); lbl(gw, d, 'wrong', -175, yW + 15, { anchor: 'end', maxW: 300 });
      const l0 = sub(p); l0.circle(0, yW, 102, { fill: GLASS, sw: 4.6 }); l0.circle(0, yW, 150, S(2)); show(l0, p, [[0, 0], [.18, 0], [.26, 1], [N - .02, 1], [N + .02, .2], [N + .06, .8], [N + .12, 0]]);
      const gr = side(p, c, 'right'); gr.circle(0, yR, 102, F(3)); lbl(gr, d, 'right', 175, yR + 15, { anchor: 'start', maxW: 300 });
      const lit = sub(p); lit.circle(0, yR, 102, { fill: GLASS, sw: 4.6 }); lit.circle(0, yR, 150, S(2)); show(lit, p, [[0, 0], [H, 0], [H + .04, 1], [H + .08, .3], [H + .12, 1]]);
      badge(p, 'x', 95, yW - 95, 32); badge(p, 'check', 110, yR - 105, 34);
    });
    icon(d, 'wrong', 0, yW, 140, c, { to: .3 }); icon(d, 'right', 0, yR, 140, c);
  });

  /* 14 ── EASEL: the wrong canvas is on the easel — on "ไม่ใช่" the clamp lifts, it is taken down and leaned against the leg ✕;
     the right canvas goes up on the ledge and the clamp comes down on it ✓ */
  variant('easel', 'ขาตั้งภาพ', (d, c) => {
    const wc = { x: -330, b: 300, r: -9 }, N = noOf(c), T = tR(c), P = [wc.x, wc.b], o = off0(P, [wc.x, wc.b - 150], wc.r, [0, -32], 0);
    const down = { px: P[0], py: P[1], x: [[0, o.x], [N, o.x], [N + .5, 0, 'io']], y: [[0, o.y - 50], [.05, o.y - 50], [.3, o.y, 'in'], [N, o.y], [N + .2, o.y - 50, 'out'], [N + .5, 0, 'in'], ...land(N + .5, 5)],
      r: [[0, o.r0], [N, o.r0], [N + .5, 0, 'io']] };
    const put = { y: [[0, -50], [T, -50], [T + .3, 0, 'in'], ...land(T + .3, 5)] };
    art(c, p => {
      floor(p);
      const E = sub(p); atT(E, p, 0);
      E.path('M 0 -300 L 30 300', { sw: 14 }); E.path('M 0 -300 L 30 300', { sw: 7, stroke: C.fill });                     // back leg
      [[-12, -320, -215, 300], [12, -320, 215, 300]].forEach(([x1, y1, x2, y2]) => { E.path(`M ${x1} ${y1} L ${x2} ${y2}`, { sw: 22 }); E.path(`M ${x1} ${y1} L ${x2} ${y2}`, { sw: 14, stroke: C.fill }); });
      R(E, -250, 118, 500, 26, 6, F(3)); E.line(-238, 136, 238, 136, S(1.4));                                                   // ledge
      E.line(-150, 230, 150, 230, W(3));                                                                                         // cross bar
      const gr = mvG(side(p, c, 'right'), put); R(gr, -175, -265, 350, 383, 8, F(3.2)); lbl(gr, d, 'right', 0, 70, { maxW: 300 });
      const gw = side(p, c, 'wrong'), wg = rot(mvG(gw, down), wc.r, P[0], P[1]); R(wg, wc.x - 125, wc.b - 300, 250, 300, 8, F(3)); lbl(wg, d, 'wrong', wc.x, wc.b - 50, { maxW: 210, size: 38 });
      const cl = mvG(sub(p), { y: [[0, 83], [N - .05, 83], [N + .1, -30, 'out'], [T + .3, -30], [T + .42, 0, 'in']] }); atT(cl, p, 0); R(cl, -34, -292, 68, 40, 8, F(3));   // top clamp
      badge(p, 'x', -420, -40, 30, N + .5); badge(p, 'check', 175, -265, 34);
    });
    icon(d, 'wrong', wc.x, wc.b - 175, 130, c, { r: [wc.r, P[0], P[1]], mv: down }); icon(d, 'right', 0, -95, 175, c, { mv: put });
  });

  /* 15 ── PATCH PANEL: the plug sits in the wrong jack (its lamp lit) — on "ไม่ใช่" it is pulled out, the lamp goes out ✕;
     the plug is carried over and pushed into the right jack, whose lamp lights on the keyword ✓ */
  variant('patch', 'แผงเสียบสาย', (d, c) => {
    const X = { wrong: -200, right: 200 }, yJ = 70, N = noOf(c), H = hitOf(c), T = tR(c);
    art(c, p => {
      const B = sub(p); atT(B, p, 0); R(B, -420, -320, 840, 470, 20, F(3.4)); B.line(0, -290, 0, 120, S(1.4));
      ['wrong', 'right'].forEach(s => { const x = X[s], g = side(p, c, s, s === 'wrong' ? { to: .5 } : { t: .05 });
        lbl(s === 'right' ? side(g, c, 'right') : g, d, s, x, -50, { maxW: 320 }); g.circle(x, 5, 14, F(2.4)); g.circle(x, yJ, 34, F(3)); g.circle(x, yJ, 14, { fill: '#040404', sw: 2.4 }); });
      const l0 = sub(p); l0.circle(X.wrong, 5, 14, { fill: C.ink, sw: 2 }); l0.circle(X.wrong, 5, 28, S(1.8)); show(l0, p, [[0, 0], [.15, 0], [.25, 1], [N, 1], [N + .05, 0]]);
      const lit = sub(p); lit.circle(X.right, 5, 14, { fill: C.ink, sw: 2 }); lit.circle(X.right, 5, 28, S(1.8)); atT(lit, p, H);
      const P = mvG(clipG(p, -500, -350, 1000, 700), { x: [[0, -400], [N + .12, -400], [T + .35, 0, 'io']], y: [[0, 0], [N, 0], [N + .12, 70, 'out'], [T + .2, 70], [T + .4, 0, 'in'], ...land(T + .4, -6)] });
      atT(P, p, 0); const x = X.right;
      P.path(`M ${x} 236 C ${x} 330, -20 290, -160 318 S -400 340, -480 300`, { sw: 14 }); P.path(`M ${x} 236 C ${x} 330, -20 290, -160 318 S -400 340, -480 300`, { sw: 7, stroke: C.fill });
      P.path(`M ${x - 14} 206 L ${x + 14} 206 L ${x + 10} 240 L ${x - 10} 240 Z`, F(2.6));
      R(P, x - 26, yJ + 18, 52, 124, 14, F(3.2)); [126, 146, 166].forEach(y => P.line(x - 18, yJ + y - 60, x + 18, yJ + y - 60, S(1.6)));
      P.ellipse(x, yJ + 14, 36, 14, F(3));
      badge(p, 'x', X.wrong + 100, -260, 30); badge(p, 'check', X.right + 100, -260, 32);
    });
    icon(d, 'wrong', X.wrong, -185, 140, c); icon(d, 'right', X.right, -185, 140, c);
  });

  /* 16 ── PENCIL: the pencil hovers eraser-down over the wrong one — on "ไม่ใช่" it rubs it out (smudges, crumbs) ✕; it flips over,
     goes to the right one and ticks it on the keyword ✓ */
  variant('pencil', 'ดินสอยางลบ', (d, c) => {
    const ang = -70, T0 = [334, 146], N = noOf(c), H = hitOf(c), Pc = [402, -41], dx = -534, dy = -116;   // Pc = middle of the pencil
    const rub = (v, a) => [[0, v], [N - .1, v], [N, v - a], [N + .1, v + a], [N + .2, v - a], [N + .3, v + a], [N + .4, v], [N + .5, v], [H - .3, 0, 'io']];
    art(c, p => {
      const B = sub(p); atT(B, p, 0); R(B, -450, -300, 900, 560, 10, F(3.2));
      const gw = side(p, c, 'wrong'); lbl(gw, d, 'wrong', -230, 150, { maxW: 300 });
      const sm = sub(p); [[-345, -150, -100, -110], [-360, -60, -110, -20], [-340, 30, -120, 60]].forEach(([a, y1, b, y2], i) => on(sm.path(`M ${a} ${y1} L ${b} ${y2}`, { sw: 34, stroke: 'rgba(255,255,255,.08)' }), p, N + i * .12, { draw: [[0, 0], [.14, 1]] }));
      const cr = sub(p); [[-120, 200], [-95, 214], [-330, 205]].forEach(([x, y]) => cr.path(`M ${x} ${y} q 8 -10 16 0 t 14 2`, S(2))); on(cr, p, N + .3, { o: [[0, 0], [.1, 1]], y: [[0, -30], [.2, 0, 'in']] });
      const gr = side(p, c, 'right'); lbl(gr, d, 'right', 190, 150, { maxW: 280 });
      const tk = sub(p); on(tk.poly([[255, 182], [282, 212], [330, 150]], W(5)), p, H, { draw: [[0, 0], [.18, 1, 'out']] });
      const P0 = sub(p); atT(P0, p, 0);
      const P = rot(mvG(P0, { px: Pc[0], py: Pc[1], r: [[0, 180], [N + .5, 180], [H - .3, 0, 'io']], x: rub(dx, 40), y: rub(dy, 16) }), ang, T0[0], T0[1]), [x, y] = T0;
      P.path(`M ${x} ${y} L ${x + 26} ${y - 9} L ${x + 26} ${y + 9} Z`, { fill: C.ink, sw: 2 }); P.path(`M ${x + 26} ${y - 9} L ${x + 70} ${y - 22} L ${x + 70} ${y + 22} L ${x + 26} ${y + 9}`, F(2.8));
      R(P, x + 70, y - 22, 250, 44, 4, F(3)); P.line(x + 76, y - 7, x + 314, y - 7, S(1.4)); P.line(x + 76, y + 7, x + 314, y + 7, S(1.4));
      R(P, x + 320, y - 24, 40, 48, 4, F(2.8)); P.line(x + 333, y - 22, x + 333, y + 22, S(1.4)); P.line(x + 347, y - 22, x + 347, y + 22, S(1.4));
      P.path(`M ${x + 360} ${y - 22} L ${x + 384} ${y - 22} Q ${x + 398} ${y - 22} ${x + 398} ${y - 8} L ${x + 398} ${y + 8} Q ${x + 398} ${y + 22} ${x + 384} ${y + 22} L ${x + 360} ${y + 22} Z`, F(2.8));
      badge(p, 'x', -105, -175, 30, N + .45);
    });
    icon(d, 'wrong', -230, -40, 190, c, { to: .3, dimAt: N + .15 }); icon(d, 'right', 190, -40, 190, c);
  });

  /* 17 ── TOASTER: the lever goes down — on "ไม่ใช่" the wrong slice pops out, flies off and lands against the side ✕;
     on the keyword the right slice pops up ✓ */
  const toast = (q, cx, top, w, h, o) => { const l = cx - w / 2, r = cx + w / 2, b = top + h, k = w * .28;
    return q.path(`M ${l + 12} ${b} Q ${l} ${b} ${l} ${b - 12} L ${l} ${top + k} A ${k} ${k} 0 0 1 ${cx} ${top + w * .1} A ${k} ${k} 0 0 1 ${r} ${top + k} L ${r} ${b - 12} Q ${r} ${b} ${r - 12} ${b} Z`, o); };
  variant('toaster', 'เครื่องปิ้งขนมปัง', (d, c) => {
    const ws = { x: -370, y: 120, r: -24 }, N = noOf(c), H = hitOf(c), P = [ws.x, ws.y + 140], o = off0(P, [ws.x, ws.y - 5], ws.r, [-110, 135], 0);
    const fly = { px: P[0], py: P[1], x: [[0, o.x], [N, o.x], [N + .6, 0, 'lin']], y: [[0, o.y], [N, o.y], [N + .22, o.y - 310, 'out'], [N + .6, 0, 'in'], ...land(N + .6)], r: [[0, o.r0], [N + .1, o.r0], [N + .6, 0, 'in']] };
    const pop = { y: [[0, 300], [H - .06, 300], [H + .1, -18, 'out'], [H + .22, 0, 'soft']] };
    art(c, p => {
      floor(p, 268);
      const gr = mvG(side(clipG(p, -500, -350, 1000, 598), c, 'right'), pop); toast(gr, 110, -325, 240, 330, F(3.2));   // clip: hidden under the toaster until it pops lbl(gr, d, 'right', 110, -45, { maxW: 200, size: 40 });
      const gw = side(p, c, 'wrong', { dimAt: N + .45 }), wg = rot(mvG(gw, fly), ws.r, P[0], P[1]); toast(wg, ws.x, ws.y - 150, 200, 290, F(3)); lbl(wg, d, 'wrong', ws.x, ws.y + 100, { maxW: 170, size: 34 });
      const B = sub(p); atT(B, p, 0);
      R(B, -260, -20, 520, 270, 80, F(3.4)); B.line(-170, -20, -50, -20, { sw: 9, stroke: '#040404' }); B.line(50, -20, 170, -20, { sw: 9, stroke: C.fill });
      B.line(-200, 200, 200, 200, S(1.6)); B.circle(170, 120, 26, F(2.8)); B.line(170, 120, 182, 100, W(2.4));
      R(B, 258, 30, 10, 170, 5, W(2));
      const lv = mvG(B, { y: [[0, 0], [.15, 0], [.32, 130, 'in'], [N, 130], [N + .08, 70, 'out'], [H - .06, 70], [H + .04, 0, 'out']] }); R(lv, 262, 40, 46, 24, 8, F(2.8));   // lever in its side slot
      R(B, -200, 250, 60, 16, 5, F(2.4)); R(B, 140, 250, 60, 16, 5, F(2.4));
      badge(p, 'x', -250, -110, 30, N + .6); badge(p, 'check', 245, -300, 34);
    });
    icon(d, 'wrong', ws.x, ws.y - 25, 120, c, { t: N + .04, r: [ws.r, P[0], P[1]], mv: fly, dimAt: N + .45 }); icon(d, 'right', 110, -170, 160, c, { t: H - .04, mv: pop });
  });

  /* 18 ── LIGHT BULB: the wrong bulb is in the socket — on "ไม่ใช่" it is unscrewed and set down on the floor, dark ✕; the right bulb
     comes up, is screwed in and lights on the keyword ✓ */
  const bulb = (q, cx, cy, Rr, o) => { const b = Rr * .42, yb = cy + Rr * 1.22;
    q.path(`M ${cx - b} ${yb} C ${cx - b} ${yb - Rr * .4}, ${cx - Rr} ${cy + Rr * .62}, ${cx - Rr} ${cy} A ${Rr} ${Rr} 0 1 1 ${cx + Rr} ${cy} C ${cx + Rr} ${cy + Rr * .62}, ${cx + b} ${yb - Rr * .4}, ${cx + b} ${yb} Z`, o || F(3.2));
    R(q, cx - b, yb, 2 * b, Rr * .42, 6, F(2.8)); [.12, .24, .36].forEach(k => q.line(cx - b + 4, yb + Rr * k, cx + b - 4, yb + Rr * (k - .06), S(1.6)));
    q.path(`M ${cx - b * .5} ${yb + Rr * .42} L ${cx - b * .3} ${yb + Rr * .56} L ${cx + b * .3} ${yb + Rr * .56} L ${cx + b * .5} ${yb + Rr * .42}`, F(2.4)); };
  variant('bulb', 'เปลี่ยนหลอดไฟ', (d, c) => {
    const rb = { x: 170, y: 30 }, wb = { x: -260, y: 150, r: -78 }, Rr = 108, N = noOf(c), H = hitOf(c), T = tR(c);
    const off = { px: wb.x, py: wb.y, x: [[0, rb.x - wb.x], [N + .2, rb.x - wb.x], [N + .7, 0, 'io']],
      y: [[0, rb.y - wb.y], [N, rb.y - wb.y], [N + .2, rb.y - wb.y + 30, 'out'], [N + .7, 0, 'io'], ...land(N + .7, 6)],
      r: [[0, -102], [N, -102], [N + .05, -114], [N + .1, -96], [N + .15, -114], [N + .2, -102], [N + .7, 0, 'io']], s: [[0, 1 / .9], [N + .2, 1 / .9], [N + .7, 1, 'io']] };
    const screw = { px: rb.x, py: rb.y, y: [[0, 170], [N + .55, 170], [H - .15, 0, 'out']], r: [[0, 0], [H - .15, 0], [H - .1, 10], [H - .05, -10], [H, 0]] };
    art(c, p => {
      floor(p, 300);
      const T0 = sub(p); atT(T0, p, 0); T0.line(-470, -335, 470, -335, S(2)); R(T0, rb.x - 40, -335, 80, 18, 6, F(2.6)); T0.line(rb.x, -317, rb.x, -250, W(3));
      R(T0, rb.x - 50, -250, 100, 90, 14, F(3.2)); T0.line(rb.x - 50, -222, rb.x + 50, -222, S(1.6)); T0.line(rb.x - 50, -195, rb.x + 50, -195, S(1.6));
      const gr = side(p, c, 'right', { t: N + .55 }), up = rot(mvG(gr, screw), 180, rb.x, rb.y); bulb(up, rb.x, rb.y, Rr);
      const lit = sub(p); lit.circle(rb.x, rb.y, Rr, { fill: GLASS, sw: 0, stroke: 'none' }); lit.circle(rb.x, rb.y, Rr + 46, S(2)); show(lit, p, [[0, 0], [H, 0], [H + .04, 1], [H + .08, .3], [H + .14, 1]]);
      lbl(gr, d, 'right', rb.x, 215, { maxW: 280 });
      const gw = side(p, c, 'wrong', { dimAt: N }), dn = rot(mvG(gw, off), wb.r, wb.x, wb.y); bulb(dn, wb.x, wb.y, Rr * .9); lbl(gw, d, 'wrong', wb.x + 20, 30, { maxW: 280 });
      const l0 = sub(p); l0.circle(rb.x, rb.y, Rr + 46, S(2)); show(l0, p, [[0, 0], [.15, 0], [.25, 1], [N - .02, 1], [N + .04, 0]]);
      badge(p, 'check', rb.x + 125, -100, 34);
    });
    icon(d, 'wrong', wb.x, wb.y, 120, c, { r: [wb.r, wb.x, wb.y], mv: off, dimAt: N }); icon(d, 'right', rb.x, rb.y, 140, c, { t: N + .6, mv: screw });
  });

  /* 19 ── CLAW: the claw dips over the wrong one, comes up empty ✕, rides along the rail, drops over the right one, grabs it and lifts ✓ */
  variant('claw', 'เครนคีบ', (d, c) => {
    const cx = 170, hy = -150, iy = 10, N = noOf(c), H = hitOf(c), T = tR(c), Dw = 150, Dr = 205, L0 = 76;
    const X = [[0, -420], [N + .1, -420], [T + .3, 0, 'io']];
    const Y = [[0, 0], [N - .35, 0], [N - .1, Dw, 'in'], [N + .05, Dw], [N + .2, 0, 'out'], [T + .3, 0], [T + .52, Dr, 'in'], [H - .12, Dr], [H + .15, 0, 'out']];
    const SY = Y.map(([t, v, e]) => [t, f1((L0 + v) / L0 * 100) / 100, e]);
    const hub = { x: X, y: Y }, lift = { y: [[0, Dr], [H - .12, Dr], [H + .15, 0, 'out']] };
    const prong = (q, s) => { q.path(`M ${cx + s * 26} ${hy + 30} C ${cx + s * 95} ${hy + 60}, ${cx + s * 110} ${iy - 20}, ${cx + s * 72} ${iy + 72}`, { sw: 20 });
      q.path(`M ${cx + s * 26} ${hy + 30} C ${cx + s * 95} ${hy + 60}, ${cx + s * 110} ${iy - 20}, ${cx + s * 72} ${iy + 72}`, { sw: 12, stroke: C.fill });
      q.circle(cx + s * 58, hy + 48, 7, W(2)); };
    art(c, p => {
      floor(p);
      const T1 = sub(p); atT(T1, p, 0); R(T1, -470, -330, 940, 26, 8, F(3)); [-460, 460].forEach(x => T1.circle(x, -317, 6, W(2)));
      const car = mvG(T1, { x: X }); R(car, cx - 70, -296, 140, 50, 12, F(3.2)); [cx - 42, cx + 42].forEach(x => car.circle(x, -304, 12, F(2.6)));
      const cb = mvG(car, { py: -246, sy: SY }); cb.line(cx - 10, -246, cx - 10, hy - 20, S(2.4)); cb.line(cx + 10, -246, cx + 10, hy - 20, S(2.4));
      const bk = mvG(sub(p), hub); atT(bk, p, 0); bk.path(`M ${cx} ${hy + 30} L ${cx} ${iy - 30}`, { sw: 16 }); bk.path(`M ${cx} ${hy + 30} L ${cx} ${iy - 30}`, { sw: 9, stroke: C.fill });
      const gw = side(p, c, 'wrong'); lbl(gw, d, 'wrong', -130, 245, { anchor: 'start', maxW: 220 });
      const gr = mvG(side(p, c, 'right'), lift); lbl(gr, d, 'right', cx + 125, iy + 15, { anchor: 'start', maxW: 200 });
      badge(p, 'x', -150, 130, 30, N + .2); badge(p, 'check', cx + 150, iy - 110, 34);
    });
    icon(d, 'wrong', -250, 215, 160, c); icon(d, 'right', cx, iy, 150, c, { mv: lift });
    over(c, p => { const Hb = mvG(sub(p), hub); atT(Hb, p, 0); const pr = mvG(Hb, { px: cx, py: hy, sx: [[0, 1.22], [H - .12, 1.22], [H - .03, 1, 'in']] });
      prong(pr, -1); prong(pr, 1); R(Hb, cx - 46, hy - 22, 92, 56, 14, F(3.2)); Hb.line(cx - 34, hy + 6, cx + 34, hy + 6, S(1.4)); });
  });

  /* 20 ── RADIO: the needle sits on the wrong station (static crackles) — on "ไม่ใช่" the knob turns and the needle slides along the dial;
     on the keyword it lands on the right station and it comes in clear ✓ */
  variant('radio', 'วิทยุหมุนหาคลื่น', (d, c) => {
    const X = { wrong: -210, right: 210 }, N = noOf(c), H = hitOf(c);
    art(c, p => {
      const B = sub(p); atT(B, p, 0);
      B.line(395, -140, 445, -330, W(4)); B.line(405, -178, 433, -280, { sw: 7 }); B.circle(447, -336, 9, F(2.4)); R(B, 375, -158, 40, 22, 6, F(2.6));
      R(B, -430, -150, 860, 420, 44, F(3.4));
      R(B, -390, -120, 780, 150, 16, { fill: GLASS, sw: 2.6 });
      for (let x = -360; x <= 360; x += 30) { const big = Math.abs(x - X.wrong) < 1 || Math.abs(x - X.right) < 1 || x % 120 === 0; B.line(x, big ? -10 : 0, x, 18, S(big ? 2 : 1.4)); }
      R(B, -390, 70, 300, 170, 14, F(2.6)); [100, 130, 160, 190, 220].forEach(y => B.line(-366, y, -114, y, S(2)));
      [[200, 155], [330, 155]].forEach(([x, y], i) => { B.circle(x, y, 44, F(3)); const k = i ? mvG(B, { px: x, py: y, r: [[0, -150], [N, -150], [H - .1, 0, 'io']] }) : B; k.line(x, y, x + 20, y - 34, W(2.6)); });
      ['wrong', 'right'].forEach(s => { const g = side(p, c, s); lbl(g, d, s, X[s], -60, { maxW: 300, size: 40 }); });
      const st = mvG(sub(p), { x: shake(.2, 4).concat([[.5, 4], [.55, -4], [.6, 0]]) }); [-1, 1].forEach(k => st.path(`M ${X.wrong + k * 80} -330 q ${k * 14} 20 0 40 t 0 40`, S(2))); atT(st, p, .2); on(st, p, N, { o: [[0, 1], [.2, 0]] });
      const lit = sub(p); R(lit, X.right - 150, -115, 300, 140, 12, { fill: GLASS, sw: 0, stroke: 'none' }); atT(lit, p, H);
      const nd = mvG(sub(p), { x: [[0, X.wrong - X.right], [N, X.wrong - X.right], [H - .1, 0, 'io'], [H - .04, 6, 'out'], [H + .04, 0]] }); atT(nd, p, .1);
      R(nd, X.right - 4, -28, 8, 54, 4, { fill: C.ink, sw: 1.4 }); nd.circle(X.right, -32, 9, { fill: C.ink, sw: 1.4 });
      badge(p, 'x', X.wrong + 95, -320, 30); badge(p, 'check', X.right + 100, -320, 34);
    });
    icon(d, 'wrong', X.wrong, -245, 140, c); icon(d, 'right', X.right, -245, 140, c);
  });


  /* ================= round 2: holders and displays with no topic of their own ================= */

  /* SLOT SIGN: the wrong insert slides into the holder — on "ไม่ใช่" it slides back out, tips and drops ✕; the right insert slides in ✓ */
  variant('slotsign', 'ช่องเสียบป้าย', (d, c) => {
    const wc = { x: -130, y: 150, r: -6 }, N = noOf(c), T = tR(c), o = off0([wc.x, wc.y], [wc.x, wc.y], wc.r, [0, -183], 0);
    const out = { px: wc.x, py: wc.y, x: [[0, o.x - 260], [.05, o.x - 260], [.42, o.x, 'out'], [N, o.x], [N + .25, o.x - 250, 'in'], [N + .6, 0, 'out']],
      y: [[0, o.y], [N + .2, o.y], [N + .6, 0, 'in'], ...land(N + .6)], r: [[0, o.r0], [N + .2, o.r0], [N + .6, 0, 'in'], [N + .68, -2, 'out'], [N + .78, 0]] };
    const slideIn = { x: [[0, -300], [T, -300], [T + .4, 0, 'out'], [T + .46, 6, 'soft'], [T + .52, 0]] };
    art(c, p => {
      floor(p, 315);
      const H0 = sub(p); atT(H0, p, 0);
      const gr = mvG(side(p, c, 'right'), slideIn); R(gr, -262, -306, 524, 246, 8, F(3)); lbl(gr, d, 'right', -55, -165, { anchor: 'start', maxW: 290, size: 50 });
      const gw = side(p, c, 'wrong', { dimAt: N + .5 }), wg = rot(mvG(gw, out), wc.r, wc.x, wc.y); R(wg, wc.x - 262, wc.y - 123, 524, 246, 8, F(3));
      lbl(wg, d, 'wrong', wc.x + 75, wc.y + 17, { anchor: 'start', maxW: 290, size: 46 });
      [-332, -64].forEach(y => { R(H0, -285, y, 570, 26, 8, F(3)); H0.line(-272, y + (y < -100 ? 20 : 6), 272, y + (y < -100 ? 20 : 6), S(1.4)); H0.circle(-268, y + 13, 5, W(1.8)); H0.circle(268, y + 13, 5, W(1.8)); });
      R(H0, 272, -332, 16, 294, 6, F(2.6));                                                                   // end stop
      badge(p, 'x', wc.x - 262, wc.y - 95, 30, N + .6); badge(p, 'check', 288, -332, 34);
    });
    icon(d, 'wrong', wc.x - 140, wc.y, 140, c, { r: [wc.r, wc.x, wc.y], mv: out, dimAt: N + .5 }); icon(d, 'right', -150, -183, 150, c, { mv: slideIn });
  });

  /* DECK: the wrong card drops onto the deck — on "ไม่ใช่" it is peeled off and flicked aside ✕; the right card under it shows ✓ */
  variant('deck', 'กองการ์ด', (d, c) => {
    const rc = { x: 150, y: -30 }, wc = { x: -275, y: -10, r: -16 }, N = noOf(c), o = off0([wc.x, wc.y], [wc.x, wc.y], wc.r, [rc.x, rc.y], 0);
    const flick = { px: wc.x, py: wc.y, x: [[0, o.x], [N, o.x], [N + .45, 0, 'out']], y: [[0, o.y - 90], [.05, o.y - 90], [.32, o.y, 'in'], ...land(.32).map(([t, v, e]) => [t, o.y + v, e]), [N, o.y], [N + .18, o.y - 70, 'out'], [N + .45, 0, 'in']],
      r: [[0, o.r0], [N, o.r0], [N + .45, 0, 'out'], [N + .55, -3], [N + .65, 0, 'soft']] };
    art(c, p => {
      const D = mvG(sub(p), { y: [[0, -60], [.25, 0, 'in'], ...land(.25, 6)] }); atT(D, p, 0); [[24, 24], [12, 12]].forEach(([dx, dy]) => R(D, rc.x - 165 + dx, rc.y - 210 + dy, 330, 420, 18, F(2.6)));
      const gr = side(p, c, 'right', { t: N + .1 }); R(gr, rc.x - 165, rc.y - 210, 330, 420, 18, F(3.2)); lbl(gr, d, 'right', rc.x, rc.y + 150, { maxW: 280 });
      const gw = side(p, c, 'wrong'), wg = rot(mvG(gw, flick), wc.r, wc.x, wc.y); R(wg, wc.x - 165, wc.y - 210, 330, 420, 18, F(3.2)); lbl(wg, d, 'wrong', wc.x, wc.y + 150, { maxW: 270 });
      badge(p, 'x', wc.x - 170, wc.y - 225, 32, N + .45); badge(p, 'check', rc.x + 165, rc.y - 210, 36);
    });
    icon(d, 'wrong', wc.x, wc.y - 40, 170, c, { r: [wc.r, wc.x, wc.y], mv: flick }); icon(d, 'right', rc.x, rc.y - 40, 190, c, { t: N + .15 });
  });

  /* PRISM: the turning sign shows the wrong face — on "ไม่ใช่" it turns: the wrong face swings away (narrow) and the right face comes round ✓ */
  variant('prism', 'ป้ายสามเหลี่ยมหมุน', (d, c) => {
    const k = 190 / 470, wx = -235, ax = -47, N = noOf(c), a0 = 470 / 190, b0 = 190 / 470;
    const tw = { px: -330, sx: [[0, a0], [N, a0], [N + .5, 1, 'io']] }, tr = { px: 330, sx: [[0, b0], [N, b0], [N + .5, 1, 'io']] };
    const flat = e => { e.setAttribute('vector-effect', 'non-scaling-stroke'); return e; };
    art(c, p => {
      const P = sub(p); atT(P, p, 0);
      R(P, -400, -342, 800, 22, 8, F(3)); R(P, -400, 252, 800, 22, 8, F(3)); [-390, 390].forEach(x => { R(P, x - 10, -342, 20, 640, 6, F(2.8)); P.line(x - 40, 300, x + 40, 300, W(4)); });
      R(P, ax - 7, -322, 14, 40, 4, F(2.4)); R(P, ax - 7, 212, 14, 42, 4, F(2.4));                                      // axle stubs
      const rf = mvG(sub(p), tr); atT(rf, p, .05); flat(rf.path('M -140 -270 L 330 -287 L 330 212 L -140 212 Z', F(3.2)));
      lbl(side(rf, c, 'right'), d, 'right', 95, 130, { maxW: 400 });
      const gw = mvG(side(p, c, 'wrong'), tw); flat(gw.path('M -330 -287 L -140 -270 L -140 212 L -330 212 Z', F(3))); const sq = sub(gw, { transform: `translate(${wx} 0) scale(${f1(k * 1000) / 1000} 1) translate(${-wx} 0)` });
      lbl(sq, d, 'wrong', wx, 120, { maxW: 380 });
      P.path('M -330 -287 L -140 -270 L 330 -287 L 40 -300 Z', F(2.8));                                                // top face: the third side meets here
      badge(p, 'x', -330, -280, 30, N + .5); badge(p, 'check', 330, -282, 34);
    });
    icon(d, 'wrong', wx, -60, 170, c, { sx: k, mv: tw }); icon(d, 'right', 95, -55, 200, c, { mv: tr });
  });

  /* PULL CARD: the wrong part shows in the window — on "ไม่ใช่" the strip is pulled: the wrong part slides out of the sleeve ✕,
     the right part slides into the window ✓ */
  variant('pullcard', 'การ์ดดึงเลื่อน', (d, c) => {
    const N = noOf(c), pull = { x: [[0, -465], [N, -465], [N + .5, 0, 'io'], [N + .56, 8, 'soft'], [N + .62, 0]] };
    art(c, p => {
      const S1 = mvG(clipG(p, -420, -200, 920, 400), pull); atT(S1, p, 0);
      R(S1, -360, -125, 790, 250, 12, F(3)); R(S1, 430, -56, 56, 112, 22, F(3)); S1.circle(462, 0, 12, W(2.2));       // the strip + its tab
      const gr = side(S1, c, 'right', { t: N + .3 }); lbl(gr, d, 'right', -150, 18, { anchor: 'start', maxW: 165, size: 46 });
      const gw = side(S1, c, 'wrong', { dimAt: N + .35 }); lbl(gw, d, 'wrong', 290, 85, { maxW: 230, size: 38 });
      const S0 = sub(p); atT(S0, p, 0);
      const sl = S0.path('M -400 -180 L 130 -180 Q 150 -180 150 -160 L 150 160 Q 150 180 130 180 L -400 180 Q -420 180 -420 160 L -420 -160 Q -420 -180 -400 -180 Z ' +
        'M -356 -130 L 6 -130 Q 26 -130 26 -110 L 26 110 Q 26 130 6 130 L -356 130 Q -376 130 -376 110 L -376 -110 Q -376 -130 -356 -130 Z', F(3.4));
      sl.setAttribute('fill-rule', 'evenodd'); S0.line(-400, 156, 130, 156, S(1.4));
      badge(p, 'x', 410, -125, 30, N + .5); badge(p, 'check', 26, -130, 34);
    });
    icon(d, 'wrong', 290, -30, 120, c, { mv: pull, dimAt: N + .35 }); icon(d, 'right', -255, 0, 150, c, { t: N + .42, mv: pull });
  });

  /* HANGING SIGNS: the wrong sign hangs level on its two chains — on "ไม่ใช่" one chain comes unhooked and it swings askew ✕;
     the right sign swings in and settles level ✓ */
  const chain = (q, x1, y1, x2, y2) => { const L = Math.hypot(x2 - x1, y2 - y1), n = Math.max(2, Math.round(L / 30)), a = f1(Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI - 90);
    for (let i = 0; i < n; i++) { const t = (i + .5) / n, x = x1 + (x2 - x1) * t, y = y1 + (y2 - y1) * t, g = rot(q, a, x, y);
      if (i % 2) g.line(x, y - 14, x, y + 14, W(2.4)); else g.ellipse(x, y, 7, 16, W(2)); } };
  variant('chains', 'ป้ายแขวนโซ่', (d, c) => {
    const ar = 28, pv = [-370, -190], N = noOf(c), T = tR(c);
    const tilt = { px: pv[0], py: pv[1], r: [[0, -ar], [N, -ar], [N + .3, 5, 'in'], [N + .45, -4, 'out'], [N + .6, 2, 'soft'], [N + .8, 0, 'soft']] };
    const sw = { px: 210, py: -328, r: [[0, 12], [T, 12], [T + .3, -6, 'soft'], [T + .5, 3, 'soft'], [T + .7, 0, 'soft']] };
    art(c, p => {
      const T0 = sub(p); atT(T0, p, 0); R(T0, -470, -350, 940, 22, 8, F(3)); chain(T0, pv[0], -328, pv[0], pv[1] + 10);
      const held = sub(p); show(held, p, [[0, 0], [.05, 0], [.15, 1], [N, 1], [N + .02, 0]]); chain(held, -90, -328, -90, -182);
      const loose = mvG(sub(p), { px: -100, py: -328, r: [[0, 0], [N, 0], [N + .2, 10, 'out'], [N + .4, -6], [N + .6, 0, 'soft']] }); show(loose, p, [[0, 0], [N, 0], [N + .02, 1]]); chain(loose, -100, -328, -112, -236);
      const gr = side(p, c, 'right'), rs = mvG(gr, sw); [70, 350].forEach(a => chain(rs, a, -328, a, -168));
      R(rs, 40, -160, 340, 230, 14, F(3.2)); rs.circle(70, -150, 8, W(2)); rs.circle(350, -150, 8, W(2)); lbl(rs, d, 'right', 210, 40, { maxW: 300 });
      const gw = side(p, c, 'wrong'), wg = rot(mvG(gw, tilt), ar, pv[0], pv[1]); R(wg, pv[0] - 30, pv[1] - 10, 340, 230, 14, F(3.2)); wg.circle(pv[0], pv[1], 8, W(2)); wg.circle(pv[0] + 280, pv[1], 8, W(2));
      lbl(wg, d, 'wrong', pv[0] + 140, pv[1] + 190, { maxW: 290 });
      badge(p, 'x', -190, 150, 30, N + .45); badge(p, 'check', 380, -160, 34);
    });
    icon(d, 'wrong', pv[0] + 140, pv[1] + 85, 130, c, { r: [ar, pv[0], pv[1]], mv: tilt }); icon(d, 'right', 210, -65, 140, c, { mv: sw });
  });

  /* KEYS: two big keys on a panel — on "ไม่ใช่" the wrong key jams (shakes, stays up) ✕; on the keyword the right key is pressed down
     and lights ✓ */
  variant('keys', 'ปุ่มกดสองปุ่ม', (d, c) => {
    const X = { wrong: -220, right: 220 }, b0 = -190, b1 = 120, N = noOf(c), H = hitOf(c), T = tR(c);
    const TOP = { wrong: [-205, 25], right: [-165, 80] };                // key top (y from, y to): up = tall skirt below, pressed = sunk in
    const jam = { x: shake(N, 12) }, press = { y: [[0, -50], [H - .04, -50], [H + .02, 0, 'in'], [H + .1, -4, 'out'], [H + .16, 0]] };
    const keyTop = (g, x, [t0, t1]) => { R(g, x - 122, t0, 244, t1 - t0, 24, F(3.2));
      [[x - 152, b0 + 8, x - 116, t0 + 6], [x + 152, b0 + 8, x + 116, t0 + 6], [x - 152, b1 - 8, x - 116, t1 - 6], [x + 152, b1 - 8, x + 116, t1 - 6]].forEach(([a1, a2, a3, a4]) => g.line(a1, a2, a3, a4, S(1.6))); };
    art(c, p => {
      const B = sub(p); atT(B, p, 0); R(B, -450, -250, 900, 420, 28, F(3.4));
      const gw = mvG(side(p, c, 'wrong', { to: .55 }), jam), x = X.wrong; R(gw, x - 160, b0, 320, b1 - b0, 30, F(3)); keyTop(gw, x, TOP.wrong); lbl(gw, d, 'wrong', x, 220, { maxW: 340 });
      const gr = side(p, c, 'right'), xr = X.right; R(gr, xr - 160, b0, 320, b1 - b0, 30, F(3)); lbl(gr, d, 'right', xr, 220, { maxW: 340 });
      const ku = sub(gr); show(ku, p, [[0, 1], [H - .02, 1], [H, 0]]); keyTop(ku, xr, TOP.wrong);
      const kp = sub(gr); show(kp, p, [[0, 0], [H - .02, 0], [H, 1]]); keyTop(kp, xr, TOP.right);
      const lit = sub(p); R(lit, xr - 122, TOP.right[0], 244, TOP.right[1] - TOP.right[0], 24, { fill: GLASS, sw: 3.8 }); R(lit, xr - 180, b0 - 20, 360, b1 - b0 + 40, 40, S(2)); atT(lit, p, H);
      badge(p, 'x', X.wrong + 160, b0, 30); badge(p, 'check', X.right + 175, b0 - 15, 34);
    });
    icon(d, 'wrong', X.wrong, -95, 150, c, { to: .4, mv: jam }); icon(d, 'right', X.right, -45, 150, c, { mv: press });
  });

  /* GLASS DOME: the wrong one stands in the open — on "ไม่ใช่" a glass dome comes down over it ✕; on the keyword the right one's dome
     is lifted off ✓ */
  const dome = (q, x, rim) => { q.path(`M ${x - 140} ${rim} L ${x - 140} ${rim - 150} A 140 140 0 0 1 ${x + 140} ${rim - 150} L ${x + 140} ${rim}`, { fill: 'rgba(255,255,255,.06)', sw: 3.2 });
    q.ellipse(x, rim, 140, 20, W(2)); q.line(x, rim - 290, x, rim - 304, W(5)); q.circle(x, rim - 316, 15, F(3)); };
  variant('dome', 'โดมแก้วครอบ', (d, c) => {
    const X = { wrong: -230, right: 230 }, py = 180, N = noOf(c), H = hitOf(c);
    art(c, p => {
      floor(p, 232);
      ['wrong', 'right'].forEach(s => { const x = X[s], g = side(p, c, s, s === 'wrong' ? { to: .6 } : { t: .05 });
        g.path(`M ${x - 40} ${py + 6} L ${x - 70} 232 L ${x + 70} 232 L ${x + 40} ${py + 6} Z`, F(2.8)); g.ellipse(x, py, 165, 26, F(3.2));
        lbl(s === 'right' ? side(g, c, 'right') : g, d, s, x, 290, { maxW: 320 }); });
      halo(p, X.right, 90, 120);
    });
    icon(d, 'wrong', X.wrong, 90, 150, c); icon(d, 'right', X.right, 90, 160, c);
    over(c, p => { const g = mvG(sub(p), { y: [[0, -150], [N - .25, -150], [N, 0, 'in'], ...land(N)] }); atT(g, p, .05); dome(g, X.wrong, py);
      const u = mvG(sub(p), { y: [[0, 210], [H - .32, 210], [H - .02, 0, 'out'], [H + .08, 6, 'soft'], [H + .16, 0]] }); atT(u, p, .1); dome(u, X.right, -30);
      badge(p, 'x', X.wrong + 135, -110, 30, N + .1); badge(p, 'check', X.right + 160, -40, 34); });
  });

  /* MAGNET: the magnet comes down over the wrong card — nothing happens ✕; it rides over to the right card and on the keyword
     the card jumps up and sticks ✓ */
  variant('magnet', 'แม่เหล็กดูด', (d, c) => {
    const mx = 180, wc = { x: -250, b: 300, r: -5 }, N = noOf(c), H = hitOf(c);
    const mag = { x: [[0, -430], [N + .1, -430], [H - .3, 0, 'io']], y: [[0, -170], [.05, -170], [.45, 0, 'out'], [N - .22, 0], [N - .06, 40, 'in'], [N + .1, 0, 'out']] };
    const jump = { px: mx, py: -108, y: [[0, 108], [H - .06, 108], [H + .06, -8, 'out'], [H + .16, 0, 'soft']] };
    const drop = { px: wc.x, py: wc.b, y: [[0, -60], [.05, -60], [.3, 0, 'in'], ...land(.3, 6)] };
    art(c, p => {
      floor(p);
      const gr = side(p, c, 'right'), rg = rot(mvG(gr, jump), 3, mx, -108); R(rg, mx - 125, -108, 250, 300, 16, F(3.2)); lbl(rg, d, 'right', mx, 150, { maxW: 220 });
      const M = mvG(clipG(p, -500, -350, 1000, 700), mag); atT(M, p, 0); M.line(mx, -350, mx, -276, S(3)); M.circle(mx, -268, 9, W(2.4));
      const U = `M ${mx - 58} -112 L ${mx - 58} -200 A 58 58 0 0 1 ${mx + 58} -200 L ${mx + 58} -112`;
      M.path(U, { sw: 58 }); M.path(U, { sw: 48, stroke: C.fill }); [-58, 58].forEach(dx => { R(M, mx + dx - 29, -142, 58, 34, 6, F(3)); M.line(mx + dx - 20, -125, mx + dx + 20, -125, S(1.4)); });
      const fl = sub(p); [-1, 1].forEach(k => fl.path(`M ${mx + k * 100} -150 q ${k * 26} 16 ${k * 8} 42`, S(2))); atT(fl, p, H);
      const gw = side(p, c, 'wrong'), wg = rot(mvG(gw, drop), wc.r, wc.x, wc.b); R(wg, wc.x - 125, wc.b - 300, 250, 300, 16, F(3.2)); lbl(wg, d, 'wrong', wc.x, wc.b - 45, { maxW: 220 });
      badge(p, 'x', wc.x + 125, -15, 30, N + .15); badge(p, 'check', mx + 140, -105, 34);
    });
    icon(d, 'wrong', wc.x, wc.b - 175, 150, c, { r: [wc.r, wc.x, wc.b], mv: drop }); icon(d, 'right', mx, 15, 150, c, { r: [3, mx, -108], mv: jump });
  });

  /* BLINDS: on "ไม่ใช่" the wrong window's blind drops shut over it ✕; on the keyword the right window's blind rolls up and the right one
     is in the light ✓ */
  variant('louvre', 'มู่ลี่หน้าต่าง', (d, c) => {
    const X = { wrong: -220, right: 220 }, y0 = -255, y1 = 115, N = noOf(c), H = hitOf(c), UP = .13;
    const slats = (g, x) => { for (let y = y0; y < y1 - 10; y += 47) R(g, x - 168, y, 336, 38, 4, F(2.4)); };
    art(c, p => {
      ['wrong', 'right'].forEach(s => { const x = X[s], g = sub(p); atT(g, p, 0);
        R(g, x - 190, -280, 380, 420, 8, F(3.4)); R(g, x - 165, y0, 330, y1 - y0, 4, { sw: 1.6, stroke: C.rule }); R(g, x - 210, 140, 420, 20, 6, F(2.8));
        const l = side(p, c, s); lbl(l, d, s, x, 215, { maxW: 340 }); });
      const lt = sub(p); R(lt, X.right - 165, -205, 330, 320, 4, { fill: GLASS, sw: 0, stroke: 'none' }); atT(lt, p, H);
      const rb = sub(p); atT(rb, p, 0); rb.line(X.right + 140, y0 + 48, X.right + 140, y0 + 150, S(1.8)); rb.circle(X.right + 140, y0 + 158, 7, W(2));
    });
    icon(d, 'wrong', X.wrong, -70, 170, c, { to: .5 }); icon(d, 'right', X.right, -60, 180, c);
    over(c, p => { const g0 = sub(p); atT(g0, p, .05); const g = mvG(g0, { py: y0, sy: [[0, UP], [N - .1, UP], [N + .18, 1, 'in'], [N + .24, .96, 'out'], [N + .3, 1]] });
      slats(g, X.wrong); g.line(X.wrong + 140, y0, X.wrong + 140, y1 - 6, S(1.8)); g.circle(X.wrong + 140, y1 + 4, 7, W(2));
      const r0 = sub(p); atT(r0, p, .05); slats(mvG(r0, { py: y0, sy: [[0, 1], [H - .3, 1], [H - .04, UP, 'out']] }), X.right);
      badge(p, 'x', X.wrong + 190, -280, 30, N + .2); badge(p, 'check', X.right + 190, -280, 34); });
  });

  /* SHAPE FIT: the wrong (square) tile drops onto its cradle — on "ไม่ใช่" it rocks and will not sit ✕; on the keyword the right (round)
     tile drops into its cradle and settles ✓ */
  variant('fit', 'แท่นรองรูปทรง', (d, c) => {
    const X = { wrong: -230, right: 210 }, top = 130, cy = 40, Rr = 150, wr = 13, N = noOf(c), H = hitOf(c), T = tR(c);
    const rock = { px: X.wrong, py: -30, y: [[0, -180], [.05, -180], [.35, 0, 'in'], ...land(.35)], r: [[0, -wr], [N - .05, -wr], [N + .1, 7, 'out'], [N + .24, -4, 'soft'], [N + .4, 0, 'soft']] };
    const drop = { y: [[0, -240], [T, -240], [H - .06, 0, 'in'], [H + .04, -16, 'out'], [H + .14, 0, 'soft']] };
    art(c, p => {
      floor(p);
      const B = sub(p); atT(B, p, 0); const half = Math.sqrt(Rr * Rr - (top - cy) ** 2);
      let D = `M -470 ${top}`; [X.wrong, X.right].forEach(x => { D += ` L ${f1(x - half)} ${top} A ${Rr} ${Rr} 0 0 0 ${f1(x + half)} ${top}`; });
      D += ` L 470 ${top} L 470 262 Q 470 272 460 272 L -460 272 Q -470 272 -470 262 Z`; B.path(D, F(3.4));
      [-420, 420].forEach(x => R(B, x - 30, 272, 60, 26, 6, F(2.6))); B.line(-450, 160, 450, 160, S(1.4));
      const gr = side(p, c, 'right'); mvG(gr, drop).circle(X.right, cy, Rr - 4, F(3.2)); lbl(gr, d, 'right', X.right, 232, { maxW: 360 });
      const gw = side(p, c, 'wrong'), wg = rot(mvG(gw, rock), wr, X.wrong, -30); R(wg, X.wrong - 135, -165, 270, 270, 18, F(3.2)); lbl(gw, d, 'wrong', X.wrong, 232, { maxW: 360 });
      badge(p, 'x', X.wrong + 150, -170, 30, N + .1); badge(p, 'check', X.right + 120, cy - 125, 34);
    });
    icon(d, 'wrong', X.wrong, -30, 150, c, { r: [wr, X.wrong, -30], mv: rock }); icon(d, 'right', X.right, cy, 170, c, { mv: drop });
  });

  /* CLIP STANDS: the wrong card is clipped up — on "ไม่ใช่" its clip springs open and the card drops ✕; the right card slides down into
     its clip ✓ */
  const clipBase = (q, x, y) => { R(q, x - 65, y - 30, 130, 30, 10, F(3)); q.line(x, y - 30, x, y - 96, W(4)); };
  const shutClip = (q, x) => { R(q, x - 36, 136, 72, 34, 8, F(3)); q.circle(x, 176, 8, F(2.4)); q.line(x - 26, 152, x + 26, 152, S(1.4)); };
  variant('clipstand', 'ที่หนีบการ์ด', (d, c) => {
    const rx = 205, dy = 262, wc = { x: -300, y: 110, r: -13 }, N = noOf(c), T = tR(c), o = off0([wc.x, wc.y], [wc.x, wc.y], wc.r, [-150, -75], 0);
    const fall = { px: wc.x, py: wc.y, x: [[0, o.x], [N, o.x], [N + .42, 0, 'in']], y: [[0, o.y - 110], [.05, o.y - 110], [.33, o.y, 'in'], [N, o.y], [N + .42, 0, 'in'], ...land(N + .42)],
      r: [[0, o.r0], [N, o.r0], [N + .42, 0, 'in'], [N + .5, 2, 'out'], [N + .58, 0]] };
    const slide = { y: [[0, -110], [T, -110], [T + .28, 0, 'in'], ...land(T + .28, 6)] };
    art(c, p => {
      floor(p, dy, -480, 480);
      const B = sub(p); atT(B, p, 0); clipBase(B, rx, dy); clipBase(B, -150, dy);
      const op = sub(p); show(op, p, [[0, 0], [N, 0], [N + .02, 1]]); op.path(`M -150 166 L -190 118 M -150 166 L -110 118`, W(5)); op.circle(-150, 168, 9, F(2.4));   // the open clip
      const gr = mvG(side(p, c, 'right'), slide); R(gr, rx - 140, -300, 280, 450, 14, F(3.2)); lbl(gr, d, 'right', rx, 95, { maxW: 240 });
      shutClip(B, rx);
      const gw = side(p, c, 'wrong'), wg = rot(mvG(gw, fall), wc.r, wc.x, wc.y); R(wg, wc.x - 140, wc.y - 225, 280, 450, 14, F(3.2)); lbl(wg, d, 'wrong', wc.x, wc.y + 160, { maxW: 240 });
      const sc = sub(p); show(sc, p, [[0, 0], [.3, 0], [.32, 1], [N, 1], [N + .02, 0]]); shutClip(sc, -150);
      badge(p, 'x', -150, 60, 30, N + .45); badge(p, 'check', rx + 140, -300, 34);
    });
    icon(d, 'wrong', wc.x, wc.y - 40, 150, c, { r: [wc.r, wc.x, wc.y], mv: fall }); icon(d, 'right', rx, -90, 170, c, { mv: slide });
  });

  /* SLOT BOX: the wrong card goes into the slot — on "ไม่ใช่" the box pushes it back out and it lands beside it ✕; the right card is slid
     in and on the keyword the lamp lights ✓ */
  variant('slotbox', 'กล่องช่องเสียบ', (d, c) => {
    const bx = 190, wc = { x: -300, y: 150, r: -8 }, N = noOf(c), H = hitOf(c), T = tR(c), o = off0([wc.x, wc.y], [wc.x, wc.y], wc.r, [bx, -160], 0);
    const eject = { px: wc.x, py: wc.y, x: [[0, o.x], [N, o.x], [N + .5, 0, 'out']], y: [[0, o.y - 100], [.05, o.y - 100], [.35, o.y, 'in'], [N, o.y], [N + .15, o.y - 80, 'out'], [N + .5, 0, 'in'], ...land(N + .5, 6)],
      r: [[0, o.r0], [N + .1, o.r0], [N + .5, 0, 'in']] };
    const insert = { x: [[0, 200], [T, 200], [T + .3, 0, 'out']], y: [[0, -30], [T + .3, -30], [H - .12, 0, 'in']] };
    art(c, p => {
      floor(p);
      const gr = mvG(side(p, c, 'right'), insert); R(gr, bx - 115, -320, 230, 340, 14, F(3.2)); lbl(gr, d, 'right', bx, -45, { maxW: 200, size: 40 });
      const B = sub(p); atT(B, p, 0); R(B, bx - 230, -10, 460, 310, 26, F(3.4)); R(B, bx - 140, -16, 280, 12, 6, { fill: '#040404', sw: 2.4 });
      B.line(bx - 210, 250, bx + 210, 250, S(1.4)); B.circle(bx + 150, 80, 20, F(2.6)); R(B, bx - 170, 60, 200, 60, 10, W(2));
      const lit = sub(p); lit.circle(bx + 150, 80, 20, { fill: C.ink, sw: 2 }); lit.circle(bx + 150, 80, 38, S(1.8)); atT(lit, p, H);
      const gw = side(p, c, 'wrong'), wg = rot(mvG(gw, eject), wc.r, wc.x, wc.y); R(wg, wc.x - 115, wc.y - 150, 230, 300, 14, F(3.2)); lbl(wg, d, 'wrong', wc.x, wc.y + 110, { maxW: 200, size: 38 });
      badge(p, 'x', wc.x + 115, -20, 30, N + .5); badge(p, 'check', bx + 115, -320, 34);
    });
    icon(d, 'wrong', wc.x, wc.y - 30, 140, c, { r: [wc.r, wc.x, wc.y], mv: eject }); icon(d, 'right', bx, -190, 150, c, { mv: insert });
  });

  /* FROSTED PANE: the frosted panel stands over the right pane — on "ไม่ใช่" it slides across in front of the wrong one ✕; the right pane
     is clear and the right one appears in it ✓ */
  variant('frosted', 'บานกระจกฝ้า', (d, c) => {
    const X = { wrong: -215, right: 215 }, N = noOf(c);
    art(c, p => {
      const B = sub(p); atT(B, p, 0); R(B, -450, -300, 900, 520, 14, F(3.4)); R(B, -460, -312, 920, 22, 8, F(3)); R(B, -460, 210, 920, 22, 8, F(3));
      ['wrong', 'right'].forEach(s => { const x = X[s]; R(B, x - 200, -270, 400, 460, 6, { sw: 1.6, stroke: C.rule }); const g = side(p, c, s, s === 'wrong' ? { to: .6 } : {}); lbl(g, d, s, x, 130, { maxW: 340 }); });
    });
    icon(d, 'wrong', X.wrong, -60, 170, c, { to: .45 }); icon(d, 'right', X.right, -60, 180, c);
    over(c, p => { const g = mvG(sub(p), { x: [[0, 430], [N - .12, 430], [N + .2, 0, 'out'], [N + .26, 8, 'soft'], [N + .32, 0]] }); atT(g, p, .05);
      R(g, X.wrong - 210, -280, 420, 480, 8, { fill: 'rgba(255,255,255,.13)', sw: 3.2 });
      R(g, X.wrong + 170, -100, 16, 160, 8, F(2.6)); [[-380, -240], [-310, -250], [-160, -245], [-60, -235]].forEach(([x, y]) => g.line(x, y, x + 40, y + 40, S(1.4)));
      badge(p, 'x', X.wrong + 210, -280, 30, N + .2); badge(p, 'check', X.right + 200, -270, 34); });
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
    { say: 'ไม่ใช่ทำงานหนัก แต่ทำให้ฉลาด', wrong: I('dumbbell', 'ทำงานหนัก'), right: I('brain', 'ทำให้ฉลาด') },
    { say: 'ไม่ใช่โชค แต่คือการเตรียมตัว', wrong: I('star', 'โชค'), right: I('clipboard-check', 'การเตรียมตัว') },
    { say: 'แผลไม่ได้หายเพราะยา แต่เพราะได้พัก', wrong: I('pill', 'ยา'), right: I('moon', 'ได้พัก') },
    { say: 'ไม่ใช่ปลาตัวใหญ่ แต่ปลาที่สด', wrong: I('fish', 'ตัวใหญ่'), right: I('fish', 'ปลาที่สด') },
    { say: 'ไม่ใช่บ้านหลังใหญ่ แต่คือคนในบ้าน', wrong: I('house', 'บ้านหลังใหญ่'), right: I('users', 'คนในบ้าน') },
    { say: 'ไม่ต้องรีบตอบ คิดก่อนพูด', wrong: I('message-circle', 'รีบตอบ'), right: I('lightbulb', 'คิดก่อนพูด') },
    { say: 'ต้นไม้ไม่ได้ขาดปุ๋ย แต่ขาดน้ำ', wrong: I('sprout', 'ขาดปุ๋ย'), right: I('droplets', 'ขาดน้ำ') },
    { say: 'ลูกค้าไม่ได้ดูราคา แต่ดูบริการ', wrong: I('tag', 'ราคา'), right: I('smile', 'บริการ') },
    { say: 'อย่าเก็บไว้คนเดียว เล่าให้เพื่อนฟัง', wrong: I('lock', 'เก็บไว้คนเดียว'), right: I('message-circle', 'เล่าให้เพื่อนฟัง') },
    { say: 'ไม่ใช่ของแพง แต่คือการซ้อม', wrong: I('gem', 'ของแพง'), right: I('repeat', 'การซ้อม') },
    { say: 'ไม่ใช่เครื่องมือ แต่คือฝีมือ', wrong: I('wrench', 'เครื่องมือ'), right: I('star', 'ฝีมือ') },
    { say: 'ไม่ต้องขับรถ ขี่จักรยานไปก็ได้', wrong: I('car', 'ขับรถ'), right: I('bike', 'ขี่จักรยาน') },
    { say: 'ไม่ใช่ทีวีที่ช่วยให้หลับ แต่คือเพลงเบา ๆ', wrong: I('tv', 'ทีวี'), right: I('music', 'เพลงเบา ๆ') },
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
    { say: 'ไม่มีป้ายเลย', wrong: I('coffee'), right: I('glass-water') },
    { say: 'ป้ายยาว 12 ตัวทั้งคู่', wrong: I('calendar', 'ทำทุกวันไม่หยุด'), right: I('timer', 'พักบ้างเป็นระยะ') },
    { say: 'ภาษาอังกฤษ', wrong: I('rocket', 'Fast'), right: I('target', 'Right') },
    { say: 'ไม่มีไอคอน (ป้ายแทนภาพ)', wrong: { label: 'จำนวน' }, right: { label: 'คุณภาพ' } },
    { say: 'ไอคอนเดียวกัน ต่างแค่ป้าย', wrong: I('sun', 'แดดเช้า'), right: I('sun', 'แดดบ่าย') },
    { say: 'ตัวเลขเป็นป้าย', wrong: I('coins', '100 บาท'), right: I('coins', '10 บาท') },
    { say: 'ฝั่งถูกไม่มีป้าย', wrong: I('car', 'ขับรถ'), right: I('bike') },
    { say: 'ฝั่งผิดไม่มีป้าย', wrong: I('pizza'), right: I('salad', 'สลัด') },
    { say: 'ชื่อไอคอนที่ไม่มี', wrong: I('no-such-icon', 'เดาเอา'), right: I('search', 'หาข้อมูล') },
    { say: 'คนเดียว ↔ กลุ่ม', wrong: I('user', 'ทำคนเดียว'), right: I('users', 'ช่วยกัน') },
    { say: 'ป้ายสั้นมาก', wrong: I('cloud', 'ฝน'), right: I('sun', 'แดด') },
    { say: 'ภาษาอังกฤษยาว', wrong: I('megaphone', 'Louder ads'), right: I('heart', 'Better care') },
    { say: 'ไอคอนเส้นเยอะ', wrong: I('truck', 'ส่งด่วน'), right: I('package', 'แพ็กให้ดี') },
  ];

  /* sheet order: round 2 (01–20) then round 1's topic-like objects (21–33). User 2026-11-13: "ชอบของทั้ง 2 รอบเลย เก็บไว้ทั้งหมดเลย
     เป็นชุดฐาน เราจะไม่ทำชุดเฉพาะเรื่อง" — all 33 are the base set, the picker may use any of them for any sentence. */
  const ORDER = ['stamp', 'slotsign', 'whiteboard', 'deck', 'prism', 'sorter', 'pullcard', 'signpost', 'chains', 'corkboard',
    'drawers', 'keys', 'dome', 'pulley', 'magnet', 'louvre', 'fit', 'clipstand', 'slotbox', 'frosted',
    'shredder', 'bin', 'key', 'lamp', 'phone', 'signal', 'easel', 'patch', 'pencil', 'toaster', 'bulb', 'claw', 'radio'];
  const byId = Object.fromEntries(V.map(v => [v.id, v])), BV = ORDER.map(id => byId[id]);
  if (BV.length !== V.length || BV.some(v => !v)) console.error('B05: ORDER does not match the designs');
  G.cats = G.cats || {};
  G.cats.B05 = { variants: BV, SAMPLES, STRESS, draw: (i, d, c) => BV[i].build(d, c) };
})();
