/* b03.js — category B03 "เปรียบเทียบ / ก่อน → หลัง": 20 neutral designs.
   Stills approved by the user (2026-11-13). Motion follows CutPack's rule (CATEGORIES.md §9) + pro motion:
     a enters (.05) → b enters (.3)  — or, for change, a is there and b arrives just before the keyword →
     the VERDICT lands on the keyword (c.hit): the scale tips, needles sweep, the switch slides, a door opens, the loser fades to .3,
     the winner punches, ✓ / ✕ stamps in → hold → exit. Before the keyword both sides look equal (CutPack: "2 ฝั่งน้ำหนักเท่ากันก่อนตัดสิน").
   Slots (same as CutPack CATEGORIES.md B03):
     mode 'versus' | 'change' (a before → b after) · a, b { icon, label? } · win 'a' | 'b' (optional — change → b) ·
     how 'x' (cross the loser) | 'check' (tick the winner) · v { a, b } amounts 0.1–1 · switch true | false for the after state.
   Arrows only where the picture cannot show the direction itself (user's rule from B02).
   GL.cats.B03.draw(i, data, { x, y, s, at, hit })  — canvas 1000 × 700 centred at (0,0); hit = seconds after `at` (default 1.5).
   fits(d) false → the design does not take that data. The last frame equals the approved still. */
(function () {
  const G = window.GL, C = G.C;
  const W = (w = 2) => ({ sw: w }), F = (w = 3.2) => ({ fill: C.fill, sw: w });
  const rad = d => d * Math.PI / 180, f1 = v => +v.toFixed(1);
  const hitOf = c => c.hit ?? 1.5;

  /* ---------- motion plumbing (same as b01 / b02) ---------- */
  const sub = (p, a) => { const q = p.child(a || {}); q.H = p.H; q.motion = p.motion; return q; };
  const on = (q, p, t, spec) => G.kf(q.g || q, p.t0 + t * p.ts, spec);
  const appear = (q, p, t, dy = 14) => on(q, p, t, { o: [[0, 0], [.16, 1]], y: [[0, dy], [.28, 0, 'out']] });
  const pop = (q, p, t, ox = 0, oy = 0, from = .5) => on(q, p, t, { ox, oy, s: [[0, from], [.24, 1.06, 'out'], [.38, 1, 'soft']], o: [[0, 0], [.1, 1]] });
  const drawIn = (el, p, t, dur = .4) => on(el, p, t, { draw: [[0, 0], [dur, 1, 'out']] });
  const art = (c, fn) => { const f = p => { p.H = hitOf(c); fn(p); }; f.custom = true; f.dur = .35; f.exit = 'pop'; return G.art(f, { x: c.x, y: c.y, s: c.s, at: c.at || 0 }); };
  const dimK = (H, to = .3) => [[0, 1], [H, 1], [H + .25, to]];                 // opacity keys: fades to `to` on the keyword
  const inDim = (t, H, to) => to < 1 ? [[0, 0], [t, 0], [t + .16, 1], [H, 1], [H + .25, to]] : [[0, 0], [t, 0], [t + .16, 1]];

  /* the verdict of the data */
  function st(d) {
    const change = d.mode === 'change', win = d.win || (change ? 'b' : null), lose = win ? (win === 'a' ? 'b' : 'a') : null;
    const hasV = !!d.v, va = hasV ? (d.v.a ?? .5) : null, vb = hasV ? (d.v.b ?? .5) : null;
    const amt = s => hasV ? (s === 'a' ? va : vb) : win ? (s === win ? .85 : .35) : .6;   // a length / size for side s
    return { change, win, lose, hasV, va, vb, amt, dim: s => s === lose ? .3 : 1, off: d.switch === false };
  }
  /* when side s enters: a first; b next (versus) or just before the keyword (change: b is what a becomes) */
  const tIn = (d, s, H) => s === 'a' ? .05 : st(d).change ? H - .3 : .3;
  function txt(p, str, x, y, { size = 44, maxW = 1e9, weight = 600, anchor = 'middle', color = C.soft } = {}) {
    const e = p.text(String(str), x, y, { size, weight, anchor, color, dur: .01 });
    const w = e.getBBox().width; if (w > maxW) e.setAttribute('font-size', f1(size * maxW / w));
    return e;
  }
  /* an icon: enters (its own pop) at t; o.keys = extra wrap keyframes in canvas units (x, y, s); o.dimTo fades it on the keyword; o.punch on the keyword */
  function icon(name, cx, cy, wd, c, t, o = {}) {
    if (!name || wd <= 0) return null;
    const fn = G.icons[name] || G.icons[name + '-pro'];
    if (!fn) { console.warn('B03: no icon', name); return null; }
    const at = c.at || 0, H = hitOf(c), X = c.x + cx * c.s, Y = c.y + cy * c.s;
    const a = G.art(fn, { x: X, y: Y, w: wd * c.s, at: at + t });
    const K = {}, k = o.keys || {};
    if (k.x) K.x = k.x.map(([u, v, e]) => [u, v * c.s, e]); if (k.y) K.y = k.y.map(([u, v, e]) => [u, v * c.s, e]);
    if (k.s) { K.s = k.s; K.ox = X; K.oy = Y; }
    if (k.r) { K.r = k.r; K.ox = c.x + o.pivot[0] * c.s; K.oy = c.y + o.pivot[1] * c.s; }   // turn with the thing it hangs on
    if ((o.dimTo ?? 1) < 1) K.o = dimK(o.dimAt ?? H, o.dimTo);
    if (Object.keys(K).length) G.kf(a.wrap, at, K);
    if (o.punch) G.kf(a.g, at + H, { ox: X, oy: Y, s: [[0, 1], [.07, 1.1, 'out'], [.32, 1, 'soft']] });
    return a;
  }
  /* side s of the data: icon at (x, y) width w, label (ly null = none); enters at tIn, loser fades and winner punches on the keyword */
  function thing(d, s, x, y, w, c, ly, o = {}) {
    const T = st(d), H = hitOf(c), t = o.t ?? tIn(d, s, H), to = o.op ?? T.dim(s);
    icon(d[s].icon, x, y, w, c, t, { dimTo: to, keys: o.keys, punch: s === T.win && !o.noPunch });
    if (d[s].label && ly != null) art(c, p => { const g = sub(p); txt(g, d[s].label, o.lx ?? x, ly, { maxW: o.maxW || 300, anchor: o.anchor || 'middle' });
      on(g, p, 0, { o: inDim(t + .1, H, to < 1 ? .45 : 1) }); });
  }
  /* verdict marks: ✕ on the loser / ✓ on the winner (how) — stamped in right after the keyword */
  function badge(p, kind, x, y, r = 38) {
    const g = sub(p); g.circle(x, y, r, F(3)); const k = r * .42;
    if (kind === 'x') { g.line(x - k, y - k, x + k, y + k, W(5)); g.line(x + k, y - k, x - k, y + k, W(5)); }
    else g.poly([[x - k, y + 2], [x - k * .2, y + k * .8], [x + k * 1.05, y - k * .75]], W(5));
    on(g, p, p.H + .08, { ox: x, oy: y, s: [[0, 1.8], [.14, .9, 'in'], [.26, 1.04], [.38, 1, 'soft']], o: [[0, 0], [.06, 1]] });
  }
  function marks(p, d, at) { const T = st(d); if (!d.how || !T.win) return;
    const s = d.how === 'x' ? T.lose : T.win; if (at[s]) badge(p, d.how === 'x' ? 'x' : 'check', at[s][0], at[s][1]); }
  function arrowLine(p, x1, y1, x2, y2, w = 5) {
    const a = Math.atan2(y2 - y1, x2 - x1), h = 20;
    p.line(x1, y1, x2, y2, W(w)); p.poly([[x2 - h * Math.cos(a - .5), y2 - h * Math.sin(a - .5)], [x2, y2], [x2 - h * Math.cos(a + .5), y2 - h * Math.sin(a + .5)]], W(w));
  }
  /* change arrow: slides in along its direction while a turns into b */
  function arrow(p, x1, y1, x2, y2, w = 5, t) { const g = sub(p); arrowLine(g, x1, y1, x2, y2, w); const l = Math.hypot(x2 - x1, y2 - y1);
    on(g, p, t ?? p.H - .55, { o: [[0, 0], [.15, 1]], x: [[0, -(x2 - x1) / l * 40], [.4, 0, 'out']], y: [[0, -(y2 - y1) / l * 40], [.4, 0, 'out']] }); return g; }
  /* magnifier (redesigned at the user's request): a thick double rim around clear glass, a collar where the handle joins,
     a rounded handle with grip grooves (inside its outline). R = glass radius, ang = handle direction (deg). No reflection marks (user rule). */
  const magnifier = (q, cx, cy, R, ang) => { const k = R / 170, g = sub(q, { transform: `rotate(${ang} ${cx} ${cy})` }), Ro = R + 26 * k;
    g.rect(cx + Ro - 6 * k, cy - 22 * k, 52 * k, 44 * k, Object.assign({ rx: 8 * k }, F(3)));                       // collar
    g.line(cx + Ro + 20 * k, cy - 22 * k, cx + Ro + 20 * k, cy + 22 * k, W(1.8));
    g.rect(cx + Ro + 44 * k, cy - 30 * k, 170 * k, 60 * k, Object.assign({ rx: 30 * k }, F(3.4)));                  // handle
    for (let i = 0; i < 4; i++) { const x = cx + Ro + (84 + i * 26) * k; g.line(x, cy - 15 * k, x, cy + 15 * k, W(2)); }
    g.path(`M ${cx + Ro} ${cy} A ${Ro} ${Ro} 0 1 0 ${cx - Ro} ${cy} A ${Ro} ${Ro} 0 1 0 ${cx + Ro} ${cy} Z M ${cx + R} ${cy} A ${R} ${R} 0 1 1 ${cx - R} ${cy} A ${R} ${R} 0 1 1 ${cx + R} ${cy} Z`,
      { fill: C.fill, sw: 3.4, 'fill-rule': 'evenodd' });                                                              // rim band
    g.circle(cx, cy, R + 13 * k, { sw: 1.6, stroke: C.soft }); };
  const vsMark = (p, x, y, r = 46) => { p.circle(x, y, r, F(3)); txt(p, 'VS', x, y + 14, { size: 38, weight: 700, color: C.ink }); };
  /* settle keys: hold `from` until H - lead, then go to 0 on the keyword with a small overshoot */
  const settle = (from, H, lead = .4, os = .15) => [[0, from], [H - lead, from], [H, 0, 'out'], [H + .18, -from * os], [H + .4, 0, 'soft']];
  const flick = (t) => [[0, 0], [t, 0], [t + .05, .9, 'lin'], [t + .09, .15, 'lin'], [t + .14, 1, 'lin'], [t + .19, .35, 'lin'], [t + .26, 1, 'lin']];
  let clipN = 0;
  const clipCircle = (p, x, y, r) => { const NS = 'http://www.w3.org/2000/svg', id = 'b03c' + (++clipN), cp = document.createElementNS(NS, 'clipPath'), e = document.createElementNS(NS, 'circle');
    e.setAttribute('cx', x); e.setAttribute('cy', y); e.setAttribute('r', r); cp.setAttribute('id', id); cp.appendChild(e); p.g.appendChild(cp); return sub(p, { 'clip-path': `url(#${id})` }); };

  const V = [];
  const variant = (id, th, build, fits) => V.push({ id, th, build, fits: fits || (() => true) });

  /* 01 ── SPLIT: the seam draws down, VS pops (or an arrow for change); a then b; the loser fades on the keyword */
  variant('split', 'แบ่งครึ่งจอ', (d, c) => {
    const T = st(d);
    art(c, p => {
      drawIn(p.line(0, -300, 0, 300, { sw: 2.4, stroke: C.soft }), p, 0, .45);
      const m = sub(p); if (T.change) { m.circle(0, -20, 46, F(3)); arrowLine(m, -20, -20, 22, -20, 5); } else vsMark(m, 0, -20);
      pop(m, p, T.change ? p.H - .5 : .2, 0, -20, .3);
      marks(p, d, { a: [-150, -150], b: [350, -150] });
    });
    thing(d, 'a', -250, -20, 230, c, 170); thing(d, 'b', 250, -20, 230, c, 170);
  });

  /* 02 ── SCALE: both pans hang level while the beam wobbles — on the keyword it tips to the heavier / winning side and settles */
  variant('scale', 'ตาชั่งสองแขน', (d, c) => {
    const T = st(d), H = hitOf(c), tilt = T.hasV ? Math.max(-14, Math.min(14, (T.vb - T.va) * 22)) : T.win ? (T.win === 'b' ? 10 : -10) : 0;
    const by = -150, L = 300, end = s => { const k = s === 'a' ? -1 : 1; return [k * L * Math.cos(rad(tilt)), by + k * L * Math.sin(rad(tilt))]; };
    const off = s => { const k = s === 'a' ? -1 : 1, [ex, ey] = end(s); return [k * L - ex, by - ey]; };
    const wob = (from, k) => [[0, from], [.5, from + k * 4, 'soft'], [.8, from - k * 3, 'soft'], [H - .4, from], [H, 0, 'out'], [H + .18, -from * .15], [H + .4, 0, 'soft']];
    art(c, p => {
      const base = sub(p); pop(base, p, 0, 0, 290, .6);
      base.path('M -120 290 L 120 290 L 70 250 L -70 250 Z', F(3)); base.line(0, 250, 0, by, W(6)); base.circle(0, by - 18, 18, F(3));
      const bm = sub(p); on(bm, p, 0, { ox: 0, oy: by, r: tilt ? settle(-tilt, H) : wob(0, 1), o: [[0, 0], [.1, 1]] });
      bm.line(f1(end('a')[0]), f1(end('a')[1]), f1(end('b')[0]), f1(end('b')[1]), { sw: 8 });
      ['a', 'b'].forEach(s => { const [ex, ey] = end(s), py = ey + 170, [dx, dy] = off(s), g = sub(p);
        on(g, p, 0, { x: settle(dx, H), y: settle(dy, H), o: [[0, 0], [.1, 1]] });
        g.line(f1(ex), f1(ey), f1(ex - 110), f1(py), W(2)); g.line(f1(ex), f1(ey), f1(ex + 110), f1(py), W(2));
        g.path(`M ${f1(ex - 125)} ${f1(py)} Q ${f1(ex)} ${f1(py + 70)} ${f1(ex + 125)} ${f1(py)} Z`, F(3)); });
      marks(p, d, { a: [end('a')[0] - 130, end('a')[1] + 20], b: [end('b')[0] + 130, end('b')[1] + 20] });
    });
    ['a', 'b'].forEach(s => { const [ex, ey] = end(s), [dx, dy] = off(s); thing(d, s, ex, ey + 100, 130, c, null, { keys: { x: settle(dx, H), y: settle(dy, H) } });
      if (d[s].label) art(c, p => { const g = sub(p); txt(g, d[s].label, ex, ey + 280, { maxW: 240 }); on(g, p, 0, { x: settle(dx, H), y: settle(dy, H), o: inDim(tIn(d, s, H) + .1, H, s === T.lose ? .45 : 1) }); }); });
  });

  /* 03 ── PODIUM: both blocks rise to the same height, then on the keyword the winner shoots up and the loser sinks */
  variant('podium', 'แท่นสูงต่ำ', (d, c) => {
    const T = st(d), H = hitOf(c), Hh = s => 110 + T.amt(s) * 260, X = { a: -200, b: 200 }, mid = 110 + .6 * 260;
    const ky = s => { const h = Hh(s), m = mid / h, t = tIn(d, s, H); return { sy: [[0, 0], [t, 0], [t + .35, m, 'out'], [Math.max(t + .36, H - .35), m], [H, 1, 'back']], dy: [[0, h], [t, h], [t + .35, h * (1 - m), 'out'], [Math.max(t + .36, H - .35), h * (1 - m)], [H, 0, 'back']] }; };
    art(c, p => {
      drawIn(p.line(-460, 270, 460, 270, { sw: 2.2, stroke: C.soft }), p, 0, .35);
      ['a', 'b'].forEach(s => { const h = Hh(s), K = ky(s), g = sub(p);
        on(g, p, 0, { ox: X[s], oy: 270, sy: K.sy, o: s === T.lose ? [[0, 1], [H, 1], [H + .25, .45]] : [[0, 1]] });
        g.rect(X[s] - 140, 270 - h, 280, h, Object.assign({ rx: 10 }, F(3.4)));
        if (d[s].label) { const lg = sub(p); txt(lg, d[s].label, X[s], 270 - h + 66, { maxW: 240 }); on(lg, p, 0, { y: K.dy, o: inDim(tIn(d, s, H) + .2, H, s === T.lose ? .45 : 1) }); } });
      if (T.change) arrow(p, X.a + 60, 270 - Hh('a') - 170, X.b - 90, 270 - Hh('b') - 120, 4);
      marks(p, d, { a: [X.a + 130, 270 - Hh('a') - 140], b: [X.b + 130, 270 - Hh('b') - 140] });
    });
    ['a', 'b'].forEach(s => thing(d, s, X[s], 270 - Hh(s) - 80, 150, c, null, { t: tIn(d, s, H) + .1, keys: { y: ky(s).dy } }));
  });

  /* 04 ── TUBES: both tubes fill to the same level, then on the keyword each moves to its own amount (the loser's turns hollow) */
  variant('tubes', 'หลอดเติม', (d, c) => {
    const T = st(d), H = hitOf(c), X = { a: -170, b: 170 }, top = -170, bot = 240;
    art(c, p => {
      ['a', 'b'].forEach(s => { const x = X[s], f = T.amt(s), y = bot - 24 - (bot - top - 48) * f, t = tIn(d, s, H), m = .6 / f;
        const tb = sub(p); pop(tb, p, t, x, (top + bot) / 2, .7);
        tb.rect(x - 62, top, 124, bot - top, Object.assign({ rx: 40 }, F(3.2)));
        for (let k = 1; k < 4; k++) tb.line(x + 62, top + k * 100, x + 82, top + k * 100, W(2));
        const fl = sub(tb), lose = s === T.lose;
        on(fl, p, 0, { ox: x, oy: bot - 22, sy: [[0, 0], [t + .1, 0], [t + .5, m, 'out'], [Math.max(t + .51, H - .35), m], [H, 1, 'back']] });
        const sol = sub(fl); sol.rect(x - 40, f1(y), 80, f1(bot - 22 - y), Object.assign({ rx: 26 }, { fill: C.ink, sw: 2 }));
        if (lose) { on(sol, p, H, { o: [[0, 1], [.25, 0]] }); const hol = sub(fl); hol.rect(x - 40, f1(y), 80, f1(bot - 22 - y), Object.assign({ rx: 26 }, { fill: C.fill, sw: 3, stroke: C.soft })); on(hol, p, H, { o: [[0, 0], [.25, 1]] }); } });
      if (T.change) arrow(p, -70, -280, 70, -280, 4);
      marks(p, d, { a: [X.a - 120, top + 30], b: [X.b + 120, top + 30] });
    });
    ['a', 'b'].forEach(s => thing(d, s, X[s], -270, 110, c, 300));
  });

  /* 05 ── CARDS: the cards flip in one by one — on the keyword the loser leans back and fades, the winner punches forward */
  variant('cards', 'การ์ดคู่', (d, c) => {
    const T = st(d), H = hitOf(c), X = { a: -230, b: 230 };
    art(c, p => {
      ['a', 'b'].forEach(s => { const lose = s === T.lose, t = tIn(d, s, H), fl = sub(p), g = sub(fl);
        on(fl, p, t, { ox: X[s], oy: 0, sx: [[0, 0], [.22, 1.06, 'out'], [.34, 1, 'soft']], o: [[0, 0], [.05, 1]] });
        if (lose) on(g, p, H, { ox: X[s], oy: 200, r: [[0, 0], [.3, s === 'a' ? -7.5 : 7.5, 'out'], [.5, s === 'a' ? -6 : 6, 'soft']], y: [[0, 0], [.3, 20, 'out']], o: [[0, 1], [.3, .45]] });
        if (s === T.win) on(g, p, H, { ox: X[s], oy: 0, s: [[0, 1], [.08, 1.06, 'out'], [.3, 1, 'soft']] });
        g.rect(X[s] - 165, -210, 330, 420, Object.assign({ rx: 30 }, F(s === T.win ? 4 : 3.4)));
        if (d[s].label) txt(g, d[s].label, X[s], 160, { maxW: 270 }); });
      if (T.change) arrow(p, -50, 0, 50, 0, 5);
      marks(p, d, { a: [X.a + 150, -200], b: [X.b + 150, -200] });
    });
    ['a', 'b'].forEach(s => { const lose = s === T.lose, dx = lose ? (s === 'a' ? -10 : 10) : 0, dy = lose ? 20 : 0;
      icon(d[s].icon, X[s] + dx, -20 + dy, 180, c, tIn(d, s, H) + .1, { dimTo: T.dim(s), punch: s === T.win, keys: lose ? { x: [[0, -dx], [H, -dx], [H + .3, 0, 'out']], y: [[0, -dy], [H, -dy], [H + .3, 0, 'out']] } : null }); });
  });

  /* 06 ── STACK: the first card sits alone — on the keyword the winner (or the "after") slides in on top and the other is pushed behind */
  variant('stack', 'การ์ดซ้อนหน้า-หลัง', (d, c) => {
    const T = st(d), H = hitOf(c), front = T.win || 'b', back = front === 'a' ? 'b' : 'a', tf = T.win || T.change ? H - .45 : .3;
    art(c, p => {
      const bo = sub(p); on(bo, p, 0, { ox: -110, oy: -40, x: [[0, 190], [tf, 190], [tf + .45, 0, 'out']], y: [[0, 90], [tf, 90], [tf + .45, 0, 'out']], s: [[0, .5], [.05, .5], [.3, 1.04, 'out'], [.42, 1, 'soft']], o: [[0, 0], [.08, 1], [H, 1], [H + .25, T.win ? .5 : 1]] });
      const bk = sub(bo, { transform: 'rotate(-8 -110 -40)' }); bk.rect(-310, -260, 380, 440, Object.assign({ rx: 30 }, { fill: C.fill, sw: 2.4, stroke: C.soft }));
      if (d[back].label) txt(bk, d[back].label, -120, -200, { maxW: 300 });
      const fr = sub(p); on(fr, p, tf, { x: [[0, 520], [.45, 0, 'out'], [.55, -8], [.7, 0, 'soft']], o: [[0, 0], [.1, 1]] });
      fr.rect(-110, -170, 400, 450, Object.assign({ rx: 32 }, F(3.6)));
      if (d[front].label) txt(fr, d[front].label, 90, 230, { maxW: 340 });
      marks(p, d, { [front]: [270, -150], [back]: [-290, -240] });
    });
    icon(d[back].icon, -210, -110, 120, c, .12, { keys: { x: [[0, 190], [tf, 190], [tf + .45, 0, 'out']], y: [[0, 90], [tf, 90], [tf + .45, 0, 'out']] }, dimTo: T.win ? .3 : 1 });
    icon(d[front].icon, 90, 40, 220, c, tf + .1, { punch: true, keys: { x: [[0, 520], [tf, 520], [tf + .45, 0, 'out']] } });
  });

  /* 07 ── TOGGLE: the switch waits in the middle — on the keyword its knob snaps to the winner (or the "after") and that side lights */
  variant('toggle', 'สวิตช์', (d, c) => {
    const T = st(d), H = hitOf(c), side = T.win, kx = side === 'a' ? -150 : side === 'b' ? 150 : 0, lit = !T.off;
    art(c, p => {
      const sw = sub(p); pop(sw, p, .05, 0, 60, .6);
      sw.rect(-230, -15, 460, 150, Object.assign({ rx: 75 }, F(3.6)));
      if (side) { const fp = sub(sw); fp.rect(side === 'a' ? -210 : 0, 5, 210, 110, Object.assign({ rx: 55 }, lit ? { fill: C.ink, sw: 2, stroke: C.ink, 'fill-opacity': .14 } : { fill: C.fill, sw: 2, stroke: C.rule })); on(fp, p, H, { o: [[0, 0], [.15, 1]] }); }
      const kn = sub(sw); kn.circle(kx, 60, 62, F(3.4)); kn.circle(kx, 60, 22, W(2));
      on(kn, p, 0, { x: side ? [[0, -kx], [H - .3, -kx], [H - .2, -kx - Math.sign(kx) * 18, 'out'], [H, 0, 'in'], [H + .12, Math.sign(kx) * 8], [H + .3, 0, 'soft']]
        : [[0, 0], [.6, -24, 'soft'], [.95, 20, 'soft'], [1.25, 0, 'soft']] });
      marks(p, d, { a: [-390, -120], b: [390, -120] });
    });
    thing(d, 'a', -390, 30, 150, c, 180); thing(d, 'b', 390, 30, 150, c, 180, { op: T.off && T.win === 'b' ? .3 : st(d).dim('b') });
  });

  /* 08 ── SIZES: both circles come in the same size — on the keyword each grows or shrinks to its amount */
  variant('sizes', 'วงกลมขนาด', (d, c) => {
    const T = st(d), H = hitOf(c), R = s => 110 + T.amt(s) * 120, X = { a: -230, b: 220 }, R0 = 110 + .6 * 120, k = s => R0 / R(s);
    const sk = s => [[0, k(s)], [H - .35, k(s)], [H, 1, 'back']];
    art(c, p => {
      ['a', 'b'].forEach(s => { const g = sub(p), t = tIn(d, s, H); pop(g, p, t, X[s], 0, .4); const z = sub(g);
        on(z, p, 0, { ox: X[s], oy: 0, s: sk(s), o: s === T.lose ? dimK(H, .45) : [[0, 1]] });
        z.circle(X[s], 0, f1(R(s)), F(3.4)); });
      if (T.change) arrow(p, X.a + R('a') + 14, 0, X.b - R('b') - 14, 0, 4, H - .1);
      marks(p, d, { a: [X.a + R('a') * .72, -R('a') * .72], b: [X.b + R('b') * .72, -R('b') * .72] });
    });
    ['a', 'b'].forEach(s => thing(d, s, X[s], -10, R(s) * 1.05, c, Math.max(R('a'), R('b')) + 70, { keys: { s: sk(s) } }));
  });

  /* 09 ── TUG: the marker on the rope jerks back and forth — on the keyword it is pulled over to the winner */
  variant('tug', 'ชักเย่อ', (d, c) => {
    const T = st(d), H = hitOf(c), mx = T.win === 'a' ? -170 : T.win === 'b' ? 170 : 0;
    art(c, p => {
      drawIn(p.path('M -330 40 Q -160 70 0 60 Q 160 50 330 40', { sw: 9 }), p, .05, .4);
      const cl = sub(p); cl.line(0, -40, 0, 170, { sw: 2.2, stroke: C.soft }); [-40, 0, 40, 80, 120, 160].forEach(y => cl.line(-10, y, 10, y, { sw: 1.6, stroke: C.soft })); appear(cl, p, .2, 0);
      const mk = sub(p); mk.path(`M ${mx} 58 L ${mx - 26} 120 L ${mx + 26} 120 Z`, F(3)); mk.line(mx, 40, mx, 60, W(3));
      on(mk, p, 0, { x: [[0, -mx], [.5, -mx + 22, 'soft'], [.75, -mx - 18, 'soft'], [1.0, -mx + 14, 'soft'], [H - .3, -mx], [H, 0, 'out'], [H + .15, Math.sign(mx) * 10], [H + .35, 0, 'soft']], o: [[0, 0], [.3, 0], [.4, 1]] });
      marks(p, d, { a: [-390, -150], b: [390, -150] });
    });
    thing(d, 'a', -390, 30, 160, c, 190); thing(d, 'b', 390, 30, 160, c, 190);
  });

  /* 10 ── LENS: the magnifier glides in and hovers between them — on the keyword it settles over the winner, which grows */
  variant('lens', 'แว่นขยาย', (d, c) => {
    const T = st(d), H = hitOf(c), X = { a: -240, b: 240 }, lx = T.win ? X[T.win] : 0, ly = T.win ? -10 : -120;
    ['a', 'b'].forEach(s => thing(d, s, X[s], -10, s === T.win ? 200 : 150, c, s === T.win ? 270 : 220, s === T.win ? { keys: { s: [[0, .75], [H - .2, .75], [H, 1, 'back']] } } : {}));
    art(c, p => {                                   // the lens is drawn last: it sits above the things (user: top layer); clear glass — only its rim
      const L = sub(p);
      if (T.win) { on(L, p, .2, { ox: lx, oy: ly, x: [[0, 380 - lx], [.45, -lx, 'out'], [.75, -lx + 30, 'soft'], [H - .55, -lx - 20, 'soft'], [H - .2, 0, 'out'], [H - .05, Math.sign(lx) * -8], [H + .1, 0, 'soft']].map(([t, v, e]) => [Math.max(0, t), v, e]),
          y: [[0, -320], [.45, -110, 'out'], [H - .55, -110], [H - .2, 0, 'out']], o: [[0, 0], [.1, 1]] });
        magnifier(L, lx, ly, 150, 45); }
      else { on(L, p, .2, { y: [[0, -300], [.45, 0, 'out'], [.75, -14, 'soft'], [1.05, 0, 'soft']], o: [[0, 0], [.1, 1]] });
        magnifier(L, 0, -150, 110, 90); }
      if (T.change) arrow(p, -90, 230, 90, 230, 4);
      marks(p, d, { a: [X.a + 140, -170], b: [X.b + 140, -170] });
    });
  });

  /* 11 ── SPOTLIGHTS: both lamps flicker on — on the keyword the loser's lamp flickers out (change: a's goes out as b's comes on) */
  variant('spots', 'ไฟส่องคู่', (d, c) => {
    const T = st(d), H = hitOf(c), X = { a: -240, b: 240 };
    art(c, p => {
      drawIn(p.line(-470, 250, 470, 250, { sw: 2, stroke: C.soft }), p, 0, .35);
      ['a', 'b'].forEach(s => { const x = X[s], final = s !== T.lose && !(T.off && s === T.win);
        const tOn = T.change && s === 'b' ? H - .25 : .4 + (s === 'b' ? .1 : 0), tOff = !final ? (T.change ? H - .3 : H) : null;
        if (T.change && s === 'b' && !final) { /* switch off after: stays dark */ }
        const ok = [...flick(tOn), ...(tOff != null ? [[tOff, 1], [tOff + .05, .2, 'lin'], [tOff + .1, .8, 'lin'], [tOff + .18, 0, 'lin']] : [])];
        const keys = T.change && s === 'b' && !final ? [[0, 0]] : ok;
        const L = sub(p); on(L, p, .05 + (s === 'b' ? .05 : 0), { y: [[0, -80], [.3, 0, 'out']], o: [[0, 0], [.1, 1]] });
        L.line(x, -340, x, -290, W(2)); L.path(`M ${x - 36} -290 L ${x + 36} -290 L ${x + 56} -240 L ${x - 56} -240 Z`, { fill: C.fill, sw: 2, stroke: C.rule });
        const lit = sub(L); lit.path(`M ${x - 36} -290 L ${x + 36} -290 L ${x + 56} -240 L ${x - 56} -240 Z`, F(3)); on(lit, p, 0, { o: keys });
        const bm = sub(p); bm.shape([[x - 50, -240], [x + 50, -240], [x + 170, 250], [x - 170, 250]], { fill: 'rgba(255,255,255,.05)', stroke: 'none', sw: 0 });
        bm.line(x - 50, -240, x - 170, 250, { sw: 1.6, stroke: C.soft }); bm.line(x + 50, -240, x + 170, 250, { sw: 1.6, stroke: C.soft }); on(bm, p, 0, { o: keys }); });
      if (T.change) arrow(p, -70, 0, 70, 0, 4);
      marks(p, d, { a: [X.a + 140, -130], b: [X.b + 140, -130] });
    });
    thing(d, 'a', X.a, 120, 160, c, 310); thing(d, 'b', X.b, 120, 160, c, 310, { op: T.off ? .3 : T.dim('b') });
  });

  /* 12 ── DIALS: both needles sweep up from zero — they settle on their amounts on the keyword (overshoot + settle), the loser's dial fades */
  variant('dials', 'หน้าปัดคู่', (d, c) => {
    const T = st(d), H = hitOf(c), X = { a: -240, b: 240 }, cy = 0, R = 190;
    art(c, p => {
      ['a', 'b'].forEach(s => { const x = X[s], f = T.amt(s), ang = 180 + 180 * f, t = tIn(d, s, H), D = sub(p); pop(D, p, t, x, 0, .6);
        const Dd = sub(D); on(Dd, p, 0, { o: s === T.lose ? dimK(H, .45) : [[0, 1]] });
        Dd.path(`M ${x - R} ${cy} A ${R} ${R} 0 0 1 ${x + R} ${cy} Z`, F(3.4));
        Dd.path(`M ${x - 150} ${cy} A 150 150 0 0 1 ${x + 150} ${cy}`, { sw: 10, stroke: C.rule });
        on(Dd.path(`M ${x - 150} ${cy} A 150 150 0 0 1 ${f1(x + 150 * Math.cos(rad(ang)))} ${f1(cy + 150 * Math.sin(rad(ang)))}`, { sw: 10 }), p, 0, { draw: [[0, 0], [t + .3, 0], [H, 1, 'out']] });
        const nd = sub(Dd); nd.line(x, cy, f1(x + 125 * Math.cos(rad(ang))), f1(cy + 125 * Math.sin(rad(ang))), { sw: 6 });
        on(nd, p, 0, { ox: x, oy: cy, r: [[0, 180 - ang], [t + .3, 180 - ang], [H, 4, 'out'], [H + .15, -2], [H + .32, 0, 'soft']] });
        Dd.circle(x, cy, 16, F(3)); });
      if (T.change) arrow(p, -40, -60, 40, -60, 4);
      marks(p, d, { a: [X.a + 170, -170], b: [X.b + 170, -170] });
    });
    ['a', 'b'].forEach(s => thing(d, s, X[s], 120, 120, c, 250));
  });

  /* 13 ── SLIDER: the handle waits in the middle — on the keyword it slides toward the winner and the track fills behind it */
  variant('slider', 'แถบเลื่อน', (d, c) => {
    const T = st(d), H = hitOf(c), q = T.hasV ? T.vb / (T.va + T.vb) : T.win === 'a' ? .15 : T.win === 'b' ? .85 : .5, hx = -300 + 600 * q;
    art(c, p => {
      const tr = sub(p); appear(tr, p, .05, 20);
      tr.rect(-320, 130, 640, 40, Object.assign({ rx: 20 }, F(3)));
      for (let k = 0; k <= 4; k++) tr.line(-300 + k * 150, 190, -300 + k * 150, 206, W(2));
      if (T.win || (T.hasV && Math.abs(q - .5) > .01)) { const left = T.win === 'a' || (T.hasV && q < .5), fl = left ? tr.line(hx, 150, -300, 150, { sw: 18 }) : tr.line(hx, 150, 300, 150, { sw: 18 });
        on(fl, p, H - .1, { draw: [[0, 0], [.35, 1, 'out']] }); }
      const hd = sub(p); hd.circle(f1(hx), 150, 42, F(3.6)); hd.circle(f1(hx), 150, 12, W(2));
      on(hd, p, 0, { x: [[0, -hx], [H - .45, -hx], [H - .35, Math.sign(hx) * -16 - hx, 'out'], [H, 0, 'out'], [H + .14, Math.sign(hx) * 8], [H + .32, 0, 'soft']], o: [[0, 0], [.15, 0], [.25, 1]] });
      marks(p, d, { a: [-280, -180], b: [380, -180] });
    });
    thing(d, 'a', -390, -80, 150, c, 50); thing(d, 'b', 390, -80, 150, c, 50);
  });

  /* 14 ── DOORS: both doors stand shut — on the keyword the winner's door swings open with light, the loser's stays shut and fades */
  variant('doors', 'ประตูคู่', (d, c) => {
    const T = st(d), H = hitOf(c), X = { a: -230, b: 230 };
    art(c, p => {
      drawIn(p.line(-470, 250, 470, 250, { sw: 2, stroke: C.soft }), p, 0, .35);
      ['a', 'b'].forEach(s => { const x = X[s], open = s !== T.lose, t = tIn(d, s, H), D = sub(p); pop(D, p, Math.min(t, .3), x, 250, .7);
        D.rect(x - 120, -210, 240, 460, Object.assign({ rx: 6 }, F(3.4)));
        const shut = sub(D); shut.rect(x - 100, -190, 200, 440, { fill: C.fill, sw: 2.4, stroke: C.soft }); shut.circle(x + 70, 30, 9, W(2));
        if (open) { on(shut, p, H - .15, { ox: x - 100, oy: 0, sx: [[0, 1], [.3, .25, 'in']], o: [[0, 1], [.25, 1], [.3, 0]] });
          const lt = sub(D); lt.shape([[x - 100, -190], [x + 100, -190], [x + 100, 250], [x - 100, 250]], { fill: 'rgba(255,255,255,.05)', stroke: 'none', sw: 0 }); on(lt, p, H + .1, { o: [[0, 0], [.2, 1]] });
          const lf = sub(D); lf.path(`M ${x - 120} -210 L ${x - 60} -180 L ${x - 60} 222 L ${x - 120} 250 Z`, F(3)); on(lf, p, H + .1, { o: [[0, 0], [.06, 1]] }); }
        else on(shut, p, 0, { o: dimK(H, .5) });
        if (d[s].label) { const g = sub(p); txt(g, d[s].label, x, 310, { maxW: 280 }); on(g, p, 0, { o: inDim(t + .1, H, open ? 1 : .45) }); } });
      if (T.change) arrow(p, -80, -260, 80, -260, 4);
      marks(p, d, { a: [X.a + 120, -230], b: [X.b + 120, -230] });
    });
    ['a', 'b'].forEach(s => { const open = s !== T.lose; icon(d[s].icon, X[s] + (open ? 20 : 0), 40, 150, c, open ? H + .05 : tIn(d, s, H) + .1, { dimTo: T.dim(s), punch: false }); });
  });

  /* 15 ── PUSH: the loser stands on the platform — the winner rushes in, shoves it, and it tumbles off the edge on the keyword */
  variant('push', 'ดันแทนที่', (d, c) => {
    const T = st(d), H = hitOf(c), w = T.win || 'b', l = w === 'a' ? 'b' : 'a';
    if (T.win) {
      art(c, p => {
        const pl = sub(p); appear(pl, p, 0, 20); pl.rect(-380, 200, 640, 30, Object.assign({ rx: 8 }, F(3.2)));
        const sl = sub(p); [-40, 0, 40].forEach(y => sl.line(-330, 60 + y, -230, 60 + y, { sw: 3, stroke: C.soft })); on(sl, p, H - .45, { x: [[0, -160], [.3, 0, 'out']], o: [[0, 0], [.1, 1], [.6, 1], [.9, .7]] });
        marks(p, d, { [w]: [80, -150], [l]: [460, -30] });
        [[w, -50, 290, 300, H - .05, 1], [l, 380, 360, 220, H + .1, .45]].forEach(([s, x, y, mw, t, to]) => { if (!d[s].label) return; const g = sub(p); txt(g, d[s].label, x, y, { maxW: mw }); on(g, p, 0, { o: [[0, 0], [t, 0], [t + .16, to]] }); });
      });
      thing(d, w, -50, 70, 230, c, null, { t: H - .55, keys: { x: [[0, -520], [H - .55, -520], [H - .12, 0, 'out'], [H, 10], [H + .2, 0, 'soft']] } });
      thing(d, l, 380, 230, 150, c, null, { t: .05, keys: { x: [[0, -230], [H - .12, -230], [H + .3, 0, 'in']], y: [[0, -105], [H - .12, -105], [H + .08, -125, 'out'], [H + .3, 0, 'in']] } });
    } else {
      art(c, p => { const pl = sub(p); appear(pl, p, 0, 20); pl.rect(-380, 200, 640, 30, Object.assign({ rx: 8 }, F(3.2))); });
      thing(d, 'a', -170, 80, 210, c, 290, { keys: { x: [[0, -260], [.05, -260], [.45, 0, 'out']] } });
      thing(d, 'b', 120, 80, 210, c, 290, { keys: { x: [[0, 300], [.3, 300], [.7, 0, 'out'], [.8, -10], [.95, 0, 'soft']] } });
    }
  });

  /* 16 ── COMPARE FRAME (user's pick, 2026-11-13, over hourglass / balloons / puzzle / level …): one picture split by a slider handle —
     "before" left, "after" right. The handle waits in the middle, wiggles, then on the keyword slides to show more of the winner;
     the loser's part darkens. Takes versus and change. */
  variant('compare', 'กรอบเลื่อนเทียบ', (d, c) => {
    const T = st(d), H = hitOf(c), hx = T.win === 'a' ? 140 : T.win === 'b' ? -140 : 0, L = -400, R = 400, top = -250, bot = 200;
    const slide = from => T.win ? [[0, from], [.55, from + 14, 'soft'], [.8, from - 12, 'soft'], [H - .4, from], [H - .3, from + Math.sign(hx) * 18, 'out'], [H, 0, 'out'], [H + .14, -Math.sign(hx) * 8], [H + .32, 0, 'soft']]
      : [[0, 0], [.55, 14, 'soft'], [.8, -12, 'soft'], [1.05, 0, 'soft']];
    art(c, p => {
      const fr = sub(p); pop(fr, p, 0, 0, (top + bot) / 2, .7);
      fr.rect(L, top, R - L, bot - top, Object.assign({ rx: 22 }, F(3.6)));
      if (T.lose) { const lx = T.lose === 'a', dk = sub(fr); dk.rect(lx ? L + 6 : hx, top + 6, lx ? hx - L - 6 : R - hx - 6, bot - top - 12, { rx: 18, fill: '#0b0b0b', sw: 0, stroke: 'none' }); on(dk, p, H, { o: [[0, 0], [.3, 1]] }); }
      const hd = sub(fr); on(hd, p, 0, { x: slide(-hx), o: [[0, 0], [.15, 0], [.3, 1]] });
      hd.line(hx, top, hx, bot, W(4)); hd.circle(hx, (top + bot) / 2, 40, F(3.4));
      hd.poly([[hx - 10, -40], [hx - 24, -25], [hx - 10, -10]], W(3)); hd.poly([[hx + 10, -40], [hx + 24, -25], [hx + 10, -10]], W(3));
      ['a', 'b'].forEach(s => { if (!d[s].label) return; const cx = s === 'a' ? (L + hx) / 2 : (hx + R) / 2, g = sub(p); txt(g, d[s].label, cx, 290, { maxW: 300 });
        on(g, p, 0, { x: slide(s === 'a' ? (L - L) / 2 - (L + hx) / 2 + L / 2 : R / 2 - (hx + R) / 2), o: inDim(tIn(d, s, H) + .1, H, s === T.lose ? .45 : 1) }); });
      marks(p, d, { a: [L + 40, top + 40], b: [R - 40, top + 40] });
    });
    ['a', 'b'].forEach(s => { const w = s === 'a' ? hx - L : R - hx, cx = s === 'a' ? (L + hx) / 2 : (hx + R) / 2, c0 = s === 'a' ? L / 2 : R / 2;
      icon(d[s].icon, cx, -25, Math.min(220, w * .62), c, tIn(d, s, H) + .1, { dimTo: T.dim(s), punch: s === T.win, keys: { x: slide(c0 - cx) } }); });
  });

  /* 17 ── BALLOT: both rows come in with empty boxes — on the keyword the winner is ticked, the loser crossed (or "before" struck out) */
  variant('ballot', 'ช่องติ๊ก', (d, c) => {
    const T = st(d), H = hitOf(c), Y = { a: -120, b: 120 };
    art(c, p => {
      const cd = sub(p); pop(cd, p, 0, 0, 0, .7);
      cd.rect(-430, -260, 860, 520, Object.assign({ rx: 30 }, F(3.2))); cd.line(-390, 0, 390, 0, { sw: 1.6, stroke: C.rule });
      ['a', 'b'].forEach(s => { const y = Y[s], k = 22, t = tIn(d, s, H), R = sub(cd); appear(R, p, t, 10);
        R.rect(-380, y - 45, 90, 90, Object.assign({ rx: 14 }, F(3)));
        if (s === T.win) on(R.poly([[-358, y + 2], [-340, y + 22], [-308, y - 22]], W(6)), p, H, { draw: [[0, 0], [.22, 1, 'out']] });
        if (s === T.lose && (d.how === 'x' || T.change)) { on(R.line(-335 - k, y - k, -335 + k, y + k, W(5)), p, H, { draw: [[0, 0], [.12, 1, 'out']] }); on(R.line(-335 + k, y - k, -335 - k, y + k, W(5)), p, H + .1, { draw: [[0, 0], [.12, 1, 'out']] }); }
        if (d[s].label) { const lg = sub(R), e = txt(lg, d[s].label, -50, y + 16, { anchor: 'start', maxW: 420, size: 52, color: C.ink, weight: 700 }); if (s === T.lose) on(lg, p, 0, { o: dimK(H, .45) });
          if (T.change && s === 'a') { const bb = e.getBBox(); on(R.line(bb.x - 6, y - 2, bb.x + bb.width + 6, y - 2, { sw: 4, stroke: C.soft }), p, H, { draw: [[0, 0], [.25, 1, 'out']] }); } } });
    });
    ['a', 'b'].forEach(s => icon(d[s].icon, -165, Y[s], 120, c, tIn(d, s, H) + .05, { dimTo: T.dim(s), punch: s === T.win }));
  });

  /* 18 ── FORK: the road draws up and splits — on the keyword the loser's branch fades to a dashed trail; change: the road runs from a to b */
  variant('fork', 'ทางแยก', (d, c) => {
    const T = st(d), H = hitOf(c);
    art(c, p => {
      if (T.change) { drawIn(p.path('M -330 150 C -150 150, 60 -120, 190 -125', { sw: 8 }), p, .35, H - .45); const hd = sub(p); hd.poly([[160, -152], [200, -125], [162, -98]], W(8)); on(hd, p, H - .1, { o: [[0, 0], [.08, 1]] });
        const dt = sub(p); dt.circle(-330, 150, 14, F(3)); pop(dt, p, .2, -330, 150, .2); }
      else { ['a', 'b'].forEach(s => { const k = s === 'a' ? -1 : 1, D = `M 0 290 L 0 150 C 0 50, ${k * 300} 80, ${k * 300} -30`, lose = s === T.lose;
          const sol = sub(p); drawIn(sol.path(D, { sw: 8 }), p, .1, .55);
          if (lose) { on(sol, p, H, { o: [[0, 1], [.3, 0]] }); const ds = sub(p); ds.path(D, { sw: 5, stroke: C.rule, 'stroke-dasharray': '18 16' }); on(ds, p, H, { o: [[0, 0], [.3, 1]] }); } });
        const dt = sub(p); dt.circle(0, 290, 14, F(3)); pop(dt, p, .05, 0, 290, .2); }
      marks(p, d, T.change ? { b: [400, -260] } : { a: [-180, -290], b: [420, -290] });
    });
    if (T.change) { thing(d, 'a', -330, 40, 150, c, 260); thing(d, 'b', 340, -200, 170, c, -50); }
    else { thing(d, 'a', -300, -240, 150, c, -95, { t: .45 }); thing(d, 'b', 300, -240, 150, c, -95, { t: .55 }); }
  });

  /* 19 ── FRAMES: both pictures swing onto their nails and hang straight — on the keyword the loser's slips crooked and fades */
  variant('frames', 'กรอบรูปติดผนัง', (d, c) => {
    const T = st(d), H = hitOf(c), X = { a: -230, b: 230 };
    art(c, p => {
      ['a', 'b'].forEach(s => { const x = X[s], lose = s === T.lose, t = tIn(d, s, H), ang = s === 'a' ? -9 : 9;
        const sw = sub(p); on(sw, p, t, { ox: x, oy: -250, r: [[0, -22], [.35, 7, 'out'], [.55, -3], [.75, 0, 'soft']], o: [[0, 0], [.06, 1]] });
        const g = sub(sw); if (lose) on(g, p, H, { ox: x, oy: -250, r: [[0, 0], [.18, ang * 1.25, 'in'], [.32, ang * .85], [.46, ang, 'soft']], o: [[0, 1], [.3, .45]] });
        g.line(x, -250, x - 120, -170, W(2)); g.line(x, -250, x + 120, -170, W(2));
        g.rect(x - 170, -170, 340, 340, Object.assign({ rx: 8 }, F(3.6))); g.rect(x - 140, -140, 280, 280, { rx: 4, sw: 1.6, stroke: C.soft });
        const nl = sub(p); nl.circle(x, -254, 9, F(2.4)); pop(nl, p, Math.max(0, t - .05), x, -254, .2);
        if (d[s].label) { const lg = sub(p); txt(lg, d[s].label, x, 250, { maxW: 300 }); on(lg, p, 0, { o: inDim(t + .15, H, lose ? .45 : 1) }); } });
      if (T.change) arrow(p, -40, 0, 40, 0, 4);
      marks(p, d, { a: [X.a + 160, -170], b: [X.b + 160, -170] });
    });
    ['a', 'b'].forEach(s => { const t = tIn(d, s, H), ang = s === 'a' ? -9 : 9, r = [[0, -22], [t, -22], [t + .35, 7, 'out'], [t + .55, -3], [t + .75, 0, 'soft']];
      if (s === T.lose) r.push([H, 0], [H + .18, ang * 1.25, 'in'], [H + .32, ang * .85], [H + .46, ang, 'soft']);
      icon(d[s].icon, X[s], 0, 170, c, t + .2, { dimTo: T.dim(s), punch: s === T.win, keys: { r }, pivot: [X[s], -250] }); });
  });

  /* 20 ── SPLIT CIRCLE: the circle is shared half and half — on the keyword the seam slides to the amounts, the loser's part darkens */
  variant('share', 'วงกลมแบ่งส่วน', (d, c) => {
    const T = st(d), H = hitOf(c), R = 260, q = T.hasV ? T.va / (T.va + T.vb) : .5, sx = -R + 2 * R * q, sy = Math.sqrt(R * R - sx * sx);
    const ca = (-R + sx) / 2, cb = (R + sx) / 2, mv = from => [[0, from], [H - .4, from], [H, 0, 'back']];
    art(c, p => {
      const ci = sub(p); pop(ci, p, 0, 0, 0, .5); ci.circle(0, 0, R, F(3.4));
      if (T.lose) { const L = T.lose === 'a', dk = sub(ci); dk.path(L ? `M ${f1(sx)} ${f1(-sy)} A ${R} ${R} 0 ${q > .5 ? 1 : 0} 0 ${f1(sx)} ${f1(sy)} Z` : `M ${f1(sx)} ${f1(-sy)} A ${R} ${R} 0 ${q < .5 ? 1 : 0} 1 ${f1(sx)} ${f1(sy)} Z`, { fill: '#0a0a0a', sw: 0, stroke: 'none' });
        on(dk, p, H, { o: [[0, 0], [.3, 1]] }); }
      const cl = clipCircle(ci, 0, 0, R - 2), sm = sub(cl); sm.line(f1(sx), -R, f1(sx), R, W(4)); on(sm, p, 0, { x: mv(-sx) });
      if (T.win) { const k = T.win === 'a' ? -1 : 1, R2 = R + 30, y2 = Math.sqrt(R2 * R2 - sx * sx), big = k < 0 ? (q > .5 ? 1 : 0) : (q < .5 ? 1 : 0);
        on(p.path(`M ${f1(sx)} ${f1(-y2)} A ${R2} ${R2} 0 ${big} ${k < 0 ? 0 : 1} ${f1(sx)} ${f1(y2)}`, { sw: 5 }), p, H, { draw: [[0, 0], [.35, 1, 'out']] }); }
      if (T.change) { const ar = sub(p); ar.path(`M -170 -310 Q 0 -360 170 -310`, W(4)); ar.poly([[146, -330], [172, -310], [142, -292]], W(4)); on(ar, p, H - .5, { o: [[0, 0], [.2, 1]] }); }
      marks(p, d, { a: [-300, -230], b: [300, -230] });
    });
    thing(d, 'a', ca, 0, Math.min(170, (sx + R) * .7), c, 15, { lx: -330, anchor: 'end', maxW: 160, keys: { x: mv(-R / 2 - ca) } });
    thing(d, 'b', cb, 0, Math.min(170, (R - sx) * .7), c, 15, { lx: 330, anchor: 'start', maxW: 160, keys: { x: mv(R / 2 - cb) } });
  });

  /* samples from unrelated topics (neutrality) + a stress set (both kept to what each design fits) */
  const SAMPLES = [
    { say: 'กาแฟร้อนกับกาแฟเย็น', mode: 'versus', a: { icon: 'coffee', label: 'ร้อน' }, b: { icon: 'glass-water', label: 'เย็น' } },
    { say: 'ยกเวทเผาผลาญมากกว่าปั่นจักรยาน', mode: 'versus', a: { icon: 'bike', label: 'ปั่นจักรยาน' }, b: { icon: 'dumbbell', label: 'ยกเวท' }, win: 'b', v: { a: .35, b: .8 } },
    { say: 'รถไฟเร็วกว่ารถบัส', mode: 'versus', a: { icon: 'train-front', label: 'รถไฟ' }, b: { icon: 'bus', label: 'รถบัส' }, win: 'a' },
    { say: 'นอนพอ 8 ชั่วโมง กับนอนแค่ 4', mode: 'versus', a: { icon: 'bed', label: 'นอนพอ' }, b: { icon: 'bed', label: 'นอนน้อย' }, v: { a: .9, b: .4 } },
    { say: 'ข้าวกล่องดีกว่าอาหารขยะ', mode: 'versus', a: { icon: 'salad', label: 'ข้าวกล่อง' }, b: { icon: 'pizza', label: 'อาหารขยะ' }, win: 'a', how: 'check' },
    { say: 'จากบ้านเช่า กลายเป็นบ้านของตัวเอง', mode: 'change', a: { icon: 'key', label: 'บ้านเช่า' }, b: { icon: 'house', label: 'บ้านตัวเอง' } },
    { say: 'ปิดแจ้งเตือนแล้วโฟกัสได้', mode: 'change', a: { icon: 'bell', label: 'แจ้งเตือน' }, b: { icon: 'bell-off', label: 'เงียบ' } },
    { say: 'ต้นกล้าโตเป็นต้นไม้ใหญ่', mode: 'change', a: { icon: 'sprout', label: 'ต้นกล้า' }, b: { icon: 'trees', label: 'ต้นไม้ใหญ่' }, v: { a: .25, b: 1 } },
    { say: 'ทีมเราชนะทีมเขา', mode: 'versus', a: { icon: 'users', label: 'ทีมเรา' }, b: { icon: 'users', label: 'ทีมเขา' }, win: 'a' },
    { say: 'ข้อความสั้นอ่านง่ายกว่าข้อความยาว', mode: 'versus', a: { icon: 'message-circle', label: 'สั้น' }, b: { icon: 'file-text', label: 'ยาว' }, win: 'a' },
    { say: 'จากมืดกลายเป็นสว่าง', mode: 'change', a: { icon: 'moon', label: 'มืด' }, b: { icon: 'sun', label: 'สว่าง' } },
    { say: 'แบตเหลือน้อยกว่าที่คิด', mode: 'versus', a: { icon: 'battery-low', label: 'เหลือจริง' }, b: { icon: 'battery-full', label: 'ที่คิด' }, v: { a: .25, b: .8 } },
    { say: 'ยืนทำงานดีกว่านั่งนาน ๆ', mode: 'versus', a: { icon: 'sofa', label: 'นั่งนาน' }, b: { icon: 'person-standing', label: 'ยืนทำงาน' }, win: 'b' },
    { say: 'ร้านใหม่ดีกว่าร้านเก่า', mode: 'versus', a: { icon: 'store', label: 'ร้านเก่า' }, b: { icon: 'store', label: 'ร้านใหม่' }, win: 'b' },
    { say: 'เครื่องใหม่มาแทนเครื่องเก่า', mode: 'change', a: { icon: 'laptop', label: 'เครื่องเก่า' }, b: { icon: 'laptop', label: 'เครื่องใหม่' } },
    { say: 'แป้งกลายเป็นเค้ก', mode: 'change', a: { icon: 'wheat', label: 'แป้ง' }, b: { icon: 'cake', label: 'เค้ก' } },
    { say: 'เดินดีกว่าขับรถในระยะใกล้', mode: 'versus', a: { icon: 'car', label: 'ขับรถ' }, b: { icon: 'person-standing', label: 'เดิน' }, win: 'b', how: 'x' },
    { say: 'ไปภูเขาหรือทะเลดี', mode: 'versus', a: { icon: 'mountain', label: 'ภูเขา' }, b: { icon: 'ship', label: 'ทะเล' } },
    { say: 'หัวใจที่เคยแตกกลับมาดีอีกครั้ง', mode: 'change', a: { icon: 'heart-crack', label: 'เคยเจ็บ' }, b: { icon: 'heart', label: 'หายดี' } },
    { say: 'เวลางานกินเวลาพักผ่อน', mode: 'versus', a: { icon: 'briefcase', label: 'ทำงาน' }, b: { icon: 'bed', label: 'พักผ่อน' }, v: { a: .75, b: .25 } },
  ];
  const STRESS = [
    { say: 'ไม่มีป้ายทั้งสองฝั่ง + ติ๊กฝั่ง b', mode: 'versus', a: { icon: 'apple' }, b: { icon: 'cookie' }, win: 'a', how: 'x' },
    { say: 'ป้ายยาว 12 ตัวอักษร + v', mode: 'versus', a: { icon: 'plane', label: 'เครื่องบินภายใน' }, b: { icon: 'train-front', label: 'รถไฟความเร็วสูง' }, win: 'b', v: { a: .3, b: .9 } },
    { say: 'ของชนิดเดียวกัน ต่างสภาพ (change)', mode: 'change', a: { icon: 'battery-low', label: 'แบตหมด' }, b: { icon: 'battery-full', label: 'ชาร์จเต็ม' } },
    { say: 'v ห่างกันมาก', mode: 'versus', a: { icon: 'smartphone', label: 'จอ' }, b: { icon: 'book', label: 'หนังสือ' }, v: { a: 1, b: .1 }, win: 'a' },
    { say: 'ภาษาอังกฤษ + ✕ ฝั่งแพ้', mode: 'versus', a: { icon: 'tv', label: 'TV' }, b: { icon: 'book-open', label: 'Reading' }, win: 'b', how: 'x' },
    { say: 'change + ✓', mode: 'change', a: { icon: 'lock', label: 'ล็อก' }, b: { icon: 'lock-open', label: 'ปลดล็อก' }, how: 'check' },
    { say: 'switch ปิด (change)', mode: 'change', a: { icon: 'wifi', label: 'ออนไลน์' }, b: { icon: 'wifi-off', label: 'ออฟไลน์' }, switch: false },
    { say: 'change + v ลดลง', mode: 'change', a: { icon: 'trees', label: 'ป่าเดิม' }, b: { icon: 'sprout', label: 'เหลือน้อย' }, v: { a: 1, b: .2 } },
    { say: 'win a ไม่มีป้าย', mode: 'versus', a: { icon: 'sun' }, b: { icon: 'cloud' }, win: 'a' },
    { say: 'ไม่ตัดสิน ไม่มี v', mode: 'versus', a: { icon: 'smile', label: 'ดีใจ' }, b: { icon: 'frown', label: 'เสียใจ' } },
    { say: 'change ป้ายยาว', mode: 'change', a: { icon: 'cloud', label: 'ฝนตกทั้งวัน' }, b: { icon: 'sun', label: 'ฟ้าใสทั้งวัน' } },
    { say: 'win a + ✓', mode: 'versus', a: { icon: 'bike', label: 'จักรยาน' }, b: { icon: 'car', label: 'รถยนต์' }, win: 'a', how: 'check' },
    { say: 'v เท่ากัน', mode: 'versus', a: { icon: 'coffee', label: 'กาแฟ' }, b: { icon: 'glass-water', label: 'น้ำเปล่า' }, v: { a: .5, b: .5 } },
    { say: 'win a + ✕', mode: 'versus', a: { icon: 'umbrella', label: 'พกร่ม' }, b: { icon: 'cloud', label: 'ตากฝน' }, win: 'a', how: 'x' },
    { say: 'change ของต่างชนิด', mode: 'change', a: { icon: 'egg', label: 'ไข่' }, b: { icon: 'cake', label: 'เค้ก' } },
    { say: 'change ไม่มีป้าย', mode: 'change', a: { icon: 'sprout' }, b: { icon: 'flower' } },
    { say: 'win a v', mode: 'versus', a: { icon: 'heart', label: 'ใจ' }, b: { icon: 'banknote', label: 'เงิน' }, win: 'a', v: { a: .8, b: .4 } },
    { say: 'change win a? (ย้อนกลับ)', mode: 'change', a: { icon: 'house', label: 'บ้านเกิด' }, b: { icon: 'plane', label: 'ต่างประเทศ' } },
    { say: 'v กลับด้าน', mode: 'versus', a: { icon: 'smartphone', label: 'หน้าจอ' }, b: { icon: 'trees', label: 'ธรรมชาติ' }, v: { a: .85, b: .15 } },
    { say: 'win b + v (แบ่งส่วน)', mode: 'versus', a: { icon: 'pizza', label: 'ของมัน' }, b: { icon: 'salad', label: 'ผัก' }, win: 'b', v: { a: .3, b: .7 } },
  ];

  G.cats = G.cats || {};
  G.cats.B03 = { variants: V, SAMPLES, STRESS, draw: (i, d, c) => V[i].build(d, c) };
})();
