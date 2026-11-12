/* pro18.js — pro icon batch 18 (the last 11 of the CutPack list): presentation, receipt, shopping-bag, truck,
   calendar-check, calendar-x, moon, sun, sunrise, sunset, timer.
   Detail level = batch 15–17 (pro.js + small meaningful extras, never cluttered), style.md §0 rules.
   Every inner mark is placed from the real outline and kept INSIDE it.
   Motion = anticipation, overshoot + settle, follow-through, secondary motion. Entrance and loop sit on separate groups. */
(function () {
  const G = window.GL, C = G.C, P = G.parts;
  const sub = (p, attrs) => p.child(attrs || {});
  const on = (q, p, start, spec) => G.kf(q.g || q, p.t0 + start * p.ts, spec);
  const pop = (p, q, at = 0, from = .4) => on(q, p, at, { s: [[0, from], [.42, 1.08, 'out'], [.62, 1]], o: [[0, 0], [.16, 1]] });
  const grow = (p, q, at, oy, ox = 0) => on(q, p, at, { ox, oy, sy: [[0, 0], [.45, 1.06, 'out'], [.6, .98], [.72, 1, 'soft']], o: [[0, 0], [.05, 1]] });
  const show = (p, q) => on(q, p, 0, { o: [[0, 0], [.01, 1]] });
  const flash = (a, b) => [[0, 0], [a, 0], [a + .02, 1], [b, 0]];
  const shakeKeys = (n, amp, step = .05) => { const k = [[0, 0]]; for (let i = 1; i <= n; i++) k.push([i * step, i % 2 ? -amp : amp, 'lin']); k.push([(n + 1) * step, 0, 'out']); return k; };
  const at = (keys, t0) => keys.map(([t, v, e]) => [t + t0, v, e]);
  const tubes = (q, ds, w = 30) => { ds.forEach(d => q.path(d, { sw: w })); ds.forEach(d => q.path(d, { sw: w - 7, stroke: C.fill })); };
  const f1 = v => +v.toFixed(1), rad = d => d * Math.PI / 180;
  const pt = (r, a, cx = 0, cy = 0) => [f1(cx + Math.cos(rad(a)) * r), f1(cy + Math.sin(rad(a)) * r)];
  const SOFT = (w = 2) => ({ sw: w, stroke: C.soft });
  /* ref-detail style (user-approved 2026-11-12): detail lines are white like the outline (W), outlines 3–3.2, more real structure */
  const W = (w = 2) => ({ sw: w }), F = (w = 3.2) => ({ fill: C.fill, sw: w });
  const STAR4 = (x, y, r) => { const k = r * .16; return `M ${x} ${y - r} Q ${x + k} ${y - k} ${x + r} ${y} Q ${x + k} ${y + k} ${x} ${y + r} Q ${x - k} ${y + k} ${x - r} ${y} Q ${x - k} ${y - k} ${x} ${y - r} Z`; };
  let clipN = 0;
  const clip = (q, d) => { const NS = 'http://www.w3.org/2000/svg', id = 'gl18clip' + (++clipN), cp = document.createElementNS(NS, 'clipPath'), pa = document.createElementNS(NS, 'path');
    cp.setAttribute('id', id); pa.setAttribute('d', d); cp.appendChild(pa); q.g.appendChild(cp); return `url(#${id})`; };
  /* calendar page shared by calendar-check / calendar-x: full 7×4 grid, 7 binder rings; cell(c, r) = centre of a day cell */
  const CW = 340 / 7, RH = 238 / 4, cell = (c, r) => [f1(-170 + CW * (c + .5)), f1(-76 + RH * (r + .5))];
  const calendar = (q) => { const pg = sub(q);
    pg.rect(-170, -128, 340, 290, Object.assign({ rx: 18 }, F())); pg.line(-170, -76, 170, -76, W(3));
    pg.line(-110, -102, 110, -102, W(3.6));
    const gd = sub(pg); for (let k = 1; k < 7; k++) gd.line(-170 + k * CW, -76, -170 + k * CW, 162, W(1.8)); for (let r = 1; r < 4; r++) gd.line(-170, -76 + r * RH, 170, -76 + r * RH, W(1.8));
    [[0, 0], [2, 0], [5, 1], [3, 2], [6, 3]].forEach(([c, r]) => gd.dot(...cell(c, r), 3.4));
    for (let i = 0; i < 7; i++) q.rect(-132 + i * 44, -148, 12, 38, Object.assign({ rx: 6 }, F(2.4)));
    return { pg, gd }; };
  /* rays of a sun at (cx, cy): n tapered rays between radius r0 and r1 */
  const rays = (q, cx, cy, r0, r1, angles, r2 = r1) => angles.forEach((a, i) => q.shape([pt(r0, a - 8, cx, cy), pt(i % 2 ? r2 : r1, a, cx, cy), pt(r0, a + 8, cx, cy)], F(2.8)));
  const R = {}, rig = (name, dur, exit, fn) => { fn.custom = true; fn.dur = dur; fn.exit = exit; R[name] = fn; };

  /* presentation — the board on its easel: the three bars of the chart grow one after another (overshoot + settle), the board settles on its legs */
  rig('presentation-pro', .7, 'squash', p => {
    const intro = sub(p);
    intro.line(0, 82, 0, 140, W(4)); intro.line(0, 140, -70, 182, W(4)); intro.line(0, 140, 70, 182, W(4)); intro.line(0, 140, 0, 184, W(4)); intro.circle(0, 140, 6, F(2.4));
    const bd = sub(intro);
    bd.rect(-174, -146, 348, 216, F()); bd.rect(-182, 66, 364, 16, Object.assign({ rx: 6 }, F(2.8))); bd.rect(-188, -168, 376, 22, Object.assign({ rx: 9 }, F(3)));
    bd.rect(-150, -122, 128, 168, Object.assign({ rx: 4 }, W(2)));
    const rh = 168 / 5, hl = sub(bd); hl.rect(-148, -122 + rh + 2, 124, rh - 4, { rx: 3, fill: C.rule, stroke: 'none' });
    on(hl, p, .7, { loop: 2.8, y: [[0, 0], [.5, 0], [.62, rh, 'out'], [1.1, rh], [1.22, rh * 2, 'out'], [1.7, rh * 2], [1.82, rh * 3, 'out'], [2.5, rh * 3], [2.7, 0, 'io']] });
    for (let k = 1; k < 3; k++) bd.line(-150 + k * 128 / 3, -122, -150 + k * 128 / 3, 46, W(1.6));
    for (let r = 1; r < 5; r++) bd.line(-150, -122 + r * rh, -22, -122 + r * rh, W(1.6));
    [[4, -106, 120, 4.4], [4, -74, 148, 2], [4, -50, 148, 2]].forEach(([a, y, b, w], i) => { const l = bd.line(a, y, b, y, W(w));
      on(l, p, .7, { loop: 2.8, draw: [[0, 1], [2.5, 1], [2.55, 0], [2.6 + i * .06, 0], [2.8, 1, 'out']] }); });
    [4, 84].forEach((x, i) => { const g = sub(bd); g.rect(x, -24, 64, 34, Object.assign({ rx: 4 }, W(2))); g.line(x + 12, -8, x + (i ? 42 : 52), -8, W(1.6));
      on(g, p, .7, { loop: 2.8, ox: x + 32, oy: -7, s: [[0, 1], [.3 + i * .15, 1], [.38 + i * .15, 1.12, 'out'], [.55 + i * .15, 1, 'soft']] }); });
    on(bd, p, .7, { loop: 2.8, ox: 0, oy: 82, sy: [[0, 1], [1.9, 1], [1.96, .98, 'out'], [2.08, 1.01], [2.2, 1, 'soft']] });
    grow(p, intro, 0, 184);
  });

  /* receipt — it prints: the slip feeds down out of the printer slot line by line, holds, then clears and prints again */
  rig('receipt-pro', .7, 'pop', p => {
    const intro = sub(p);
    const win = sub(intro, { 'clip-path': clip(intro, 'M -200 -164 L 200 -164 L 200 190 L -200 190 Z') }), rc = sub(win);
    let zz = 'M -110 -170 L 110 -170 L 110 150'; for (let i = 0; i < 11; i++) { const x = 110 - (i + 1) * 20; zz += ` L ${x + 10} 166 L ${x} 150`; }
    rc.path(zz + ' Z', F());
    rc.line(-50, -132, 50, -132, W(5)); rc.line(-34, -112, 34, -112, W(1.8)); rc.line(-86, -94, 86, -94, W(1.8));
    [[-74, 46], [-46, 30], [-18, 54], [10, 38]].forEach(([y, w]) => { rc.line(-80, y, -80 + w, y, W(2.2)); rc.line(56, y, 80, y, W(2.2)); });
    rc.line(-86, 30, 86, 30, W(1.8)); rc.line(-80, 54, -24, 54, W(4.4)); rc.line(46, 54, 80, 54, W(4.4)); rc.line(-86, 76, 86, 76, W(1.8));
    rc.circle(0, 112, 16, W(2)); rc.poly([[-7, 112], [-2, 118], [8, 106]], W(2.2));
    on(rc, p, .7, { loop: 3.4, y: [[0, 0], [1.6, 0], [1.8, 0], [1.81, -320], [1.9, -320], [2.15, -250, 'io'], [2.4, -180, 'io'], [2.65, -100, 'io'], [2.9, 0, 'io'], [2.96, 6], [3.04, 0, 'soft']], o: [[0, 1], [1.5, 1], [1.8, 0], [1.81, 1]] });
    intro.rect(-150, -186, 300, 26, Object.assign({ rx: 10 }, F(3.2))); intro.line(-120, -173, 120, -173, W(3.6)); intro.circle(132, -173, 4, W(2));
    pop(p, intro);
  });

  /* shopping-bag — an item drops into the bag: the bag squashes as it lands, the handles swing after it (follow-through) */
  rig('shopping-bag-pro', .6, 'squash', p => {
    const intro = sub(p);
    const it = sub(intro); it.rect(-34, -64, 68, 60, Object.assign({ rx: 8 }, F(3))); it.line(-34, -42, 34, -42, W(2)); it.line(0, -64, 0, -4, W(2));
    it.path('M 0 -64 Q -18 -86 -26 -72 Q -20 -62 0 -64 Q 18 -86 26 -72 Q 20 -62 0 -64', W(2));
    on(it, p, .7, { loop: 2.4, y: [[0, -136], [.1, -136], [.5, 30, 'in']], r: [[0, -14], [.5, 6]], o: [[0, 0], [.1, 0], [.18, 1], [.6, 1]] });
    const bg = sub(intro);
    const hd = sub(bg); tubes(hd, ['M -62 -56 L -62 -104 Q -62 -156 0 -156 Q 62 -156 62 -104 L 62 -56'], 20);
    on(hd, p, .7, { loop: 2.4, ox: 0, oy: -60, r: [[0, 0], [.5, 0], [.6, -7, 'out'], [.8, 5, 'io'], [1, -2, 'io'], [1.16, 0, 'soft']] });
    bg.path('M -132 -62 L 132 -62 L 152 150 Q 154 172 132 172 L -132 172 Q -154 172 -152 150 Z', F());
    bg.line(-128, -26, 128, -26, W(2)); [-62, 62].forEach(x => { bg.circle(x, -44, 8, F(2.4)); bg.dot(x, -44, 3); });
    [-1, 1].forEach(sd => bg.path(`M ${sd * 110} -26 L ${sd * 122} 150 L ${sd * 138} 166`, W(1.8)));
    bg.rect(-40, 40, 80, 52, Object.assign({ rx: 6 }, W(2))); bg.line(-24, 58, 24, 58, W(2.4)); bg.line(-24, 74, 10, 74, W(1.8));
    on(bg, p, .7, { loop: 2.4, ox: 0, oy: 172, sy: [[0, 1], [.5, 1], [.58, .92, 'out'], [.74, 1.04, 'out'], [.9, 1, 'soft']], sx: [[0, 1], [.5, 1], [.58, 1.05, 'out'], [.74, .98], [.9, 1, 'soft']] });
    pop(p, intro);
  });

  /* truck — drives in and brakes (the cargo box pitches forward), then cruises: wheels spin, the road streams past, the box bounces over a bump */
  rig('truck-pro', .7, 'slide', p => {
    const intro = sub(p); show(p, intro);
    const rd = sub(intro); rd.line(-196, 140, 196, 140, { sw: 4 });
    const ds = sub(rd, { 'clip-path': clip(rd, 'M -190 150 L 190 150 L 190 180 L -190 180 Z') }), dl = sub(ds);
    for (let x = -240; x <= 240; x += 80) dl.line(x, 164, x + 40, 164, { sw: 4, stroke: C.soft });
    on(dl, p, .7, { loop: .5, x: [[0, 0], [.5, -80, 'lin']] });
    const tO = sub(intro), bO = sub(tO);
    const bx = sub(bO); bx.rect(-188, -112, 232, 196, { rx: 14, fill: C.fill, sw: 3.4 }); bx.rect(-170, -94, 196, 160, { rx: 8, sw: 1.8, stroke: C.soft });
    bx.line(-76, -94, -76, 66, SOFT(1.8));
    on(bx, p, .7, { loop: 2.4, ox: 44, oy: 84, y: [[0, 0], [1.2, 0], [1.3, 3, 'out'], [1.45, -8, 'out'], [1.65, 1, 'in'], [1.8, 0, 'soft']], r: [[0, 0], [1.3, 0], [1.45, -1.2, 'out'], [1.7, .6], [1.85, 0, 'soft']] });
    const cb = sub(bO); cb.path('M 48 -40 L 128 -40 Q 148 -40 158 -22 L 186 26 Q 190 34 190 44 L 190 74 Q 190 84 180 84 L 48 84 Z', { fill: C.fill, sw: 3.4 });
    cb.path('M 66 -24 L 122 -24 Q 134 -24 141 -12 L 160 22 L 66 22 Z', { fill: C.fill, sw: 2.6 }); cb.line(100, 34, 120, 34, SOFT(2.2));
    cb.circle(178, 56, 6, { fill: C.ink, sw: 1.2 });
    on(cb, p, .7, { loop: 2.4, ox: 120, oy: 84, y: [[0, 0], [.25, -2, 'io'], [.5, 0, 'io'], [1.2, 0], [1.32, -6, 'out'], [1.5, 0, 'in']] });
    on(bO, p, 0, { ox: 110, oy: 108, r: [[0, 0], [.42, 0], [.55, 2.4, 'out'], [.72, -1, 'io'], [.9, 0, 'soft']] });
    [-128, 110].forEach(x => { const w = sub(tO); w.circle(x, 108, 32, { fill: C.fill, sw: 3.4 }); const hb = sub(w); hb.circle(x, 108, 12, { fill: C.fill, sw: 2.4, stroke: C.soft });
      hb.line(x - 22, 108, x + 22, 108, SOFT(2.4)); hb.line(x, 86, x, 130, SOFT(2.4));
      on(w, p, .7, { loop: .6, ox: x, oy: 108, r: [[0, 0], [.6, 360, 'lin']] }); on(hb, p, 0, { ox: x, oy: 108, r: [[0, -400], [.55, 0, 'out']] }); });
    on(tO, p, 0, { x: [[0, -330], [.55, 0, 'out']], o: [[0, 0], [.12, 1]] });
  });

  /* calendar-check — the days dim and a big tick draws across the page with a pop; then it clears */
  rig('calendar-check-pro', .6, 'pop', p => {
    const intro = sub(p), { pg } = calendar(intro), [cx, cy] = cell(4, 1);
    const mk = sub(pg), rg = mk.circle(cx, cy, 25, W(3)), ck = mk.poly([[cx - 12, cy], [cx - 3, cy + 10], [cx + 13, cy - 10]], W(3.6));
    on(rg, p, .7, { loop: 2.8, draw: [[0, 0], [.2, 0], [.5, 1, 'out'], [2.5, 1], [2.65, 0, 'in']] });
    on(ck, p, .7, { loop: 2.8, draw: [[0, 0], [.45, 0], [.65, 1, 'out'], [2.5, 1], [2.65, 0, 'in']] });
    on(mk, p, .7, { loop: 2.8, ox: cx, oy: cy, s: [[0, 1], [.62, 1], [.72, 1.3, 'out'], [.92, 1, 'soft']] });
    on(pg, p, .7, { loop: 2.8, ox: 0, oy: 162, sy: [[0, 1], [.66, 1], [.74, .97, 'out'], [.86, 1.01], [.96, 1, 'soft']] });
    pop(p, intro);
  });

  /* calendar-x — the days dim, a cross is struck through in two quick strokes and the page shakes "no"; then it clears */
  rig('calendar-x-pro', .6, 'pop', p => {
    const intro = sub(p), shk = sub(intro), { pg } = calendar(shk), [cx, cy] = cell(2, 2);
    const mk = sub(pg), rg = mk.circle(cx, cy, 25, W(3)); on(rg, p, .7, { loop: 2.8, draw: [[0, 0], [.2, 0], [.45, 1, 'out'], [2.5, 1], [2.65, 0, 'in']] });
    [[-1, .45], [1, .6]].forEach(([sd, t]) => { const l = mk.line(cx - 11, cy - sd * 11, cx + 11, cy + sd * 11, W(3.6));
      on(l, p, .7, { loop: 2.8, draw: [[0, 0], [t, 0], [t + .12, 1, 'out'], [2.5, 1], [2.65, 0, 'in']] }); });
    on(mk, p, .7, { loop: 2.8, ox: cx, oy: cy, s: [[0, 1], [.7, 1], [.8, 1.3, 'out'], [1, 1, 'soft']] });
    on(shk, p, .7, { loop: 2.8, ox: 0, oy: 40, r: [[0, 0], [.8, 0], ...at(shakeKeys(5, 3, .05), .8).slice(1)] });
    pop(p, intro);
  });

  /* moon — a crescent rocks gently in the night, two small stars beside it twinkle in turn */
  rig('moon-pro', .6, 'pop', p => {
    const intro = sub(p);
    [[132, -112, 22, 0], [176, -36, 13, .8]].forEach(([x, y, r, d]) => { const g = sub(intro); g.path(STAR4(x, y, r), { fill: C.fill, sw: 2.8 });
      on(g, p, .7 + d, { loop: 1.6, ox: x, oy: y, s: [[0, 1], [.3, 1.35, 'out'], [.8, .8, 'soft'], [1.6, 1, 'soft']], r: [[0, 0], [1.6, 90, 'lin']] }); });
    const mn = sub(intro);
    mn.path('M 3.6 -150 A 150 150 0 1 0 143 45.2 A 120 120 0 1 1 3.6 -150 Z', { fill: C.fill, sw: 3.4 });
    [[-90, 10, 18], [-60, 92, 12], [-116, -54, 13]].forEach(([x, y, r]) => mn.circle(x, y, r, SOFT(2.2)));
    on(mn, p, .7, { loop: 3.2, ox: 0, oy: 0, r: [[0, 0], [.8, -7, 'io'], [2.4, 6, 'io'], [3.2, 0, 'io']], y: [[0, 0], [1.6, -6, 'io'], [3.2, 0, 'io']] });
    on(intro, p, 0, { s: [[0, .3], [.5, 1.06, 'out'], [.65, 1]], r: [[0, -60], [.6, 0, 'out']], o: [[0, 0], [.15, 1]] });
  });

  /* sun — its rays turn slowly (an eighth of a turn) while they breathe longer and shorter; the core pulses warmly */
  rig('sun-pro', .6, 'spin', p => {
    const intro = sub(p);
    const ry = sub(intro); rays(ry, 0, 0, 102, 174, [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(a => a - 90), 140);
    on(ry, p, .7, { loop: 3.2, r: [[0, 0], [3.2, 60, 'lin']], s: [[0, 1], [.8, 1.04, 'io'], [1.6, .97, 'io'], [2.4, 1.04, 'io'], [3.2, 1, 'io']] });
    const cr = sub(intro); cr.circle(0, 0, 84, F()); cr.circle(0, 0, 66, W(2));
    on(cr, p, .7, { loop: 1.6, s: [[0, 1], [.8, 1.04, 'io'], [1.6, 1, 'io']] });
    on(intro, p, 0, { s: [[0, .3], [.5, 1.06, 'out'], [.65, 1]], r: [[0, -60], [.6, 0, 'out']], o: [[0, 0], [.15, 1]] });
  });

  /* sunrise / sunset share the scene: horizon, a half sun (clipped at the horizon), rays above it and an arrow */
  const horizonSun = (p, up) => {
    const intro = sub(p); show(p, intro);
    intro.line(-196, 92, 196, 92, W(4)); [[-150, 116, -40], [10, 116, 150], [-110, 138, 90], [-60, 160, 40]].forEach(([a, y, b]) => intro.line(a, y, b, y, W(2)));
    const win = sub(intro, { 'clip-path': clip(intro, 'M -200 -200 L 200 -200 L 200 88 L -200 88 Z') }), sn = sub(win);
    const ry = sub(sn); rays(ry, 0, 92, 98, 156, [-170, -150, -130, -110, -90, -70, -50, -30, -10], 128);
    sn.circle(0, 92, 82, F()); sn.circle(0, 92, 64, W(2));
    const arO = sub(intro), ar = sub(arO); tubes(ar, up ? ['M 0 -98 L 0 -184', 'M -32 -152 L 0 -184 L 32 -152'] : ['M 0 -184 L 0 -98', 'M -32 -130 L 0 -98 L 32 -130'], 22);
    const Y = up ? [[0, 70], [.2, 70], [1.4, 0, 'out'], [2.6, 0], [3, 70, 'in']] : [[0, 0], [.4, 0], [1.6, 70, 'in'], [2.4, 70], [2.8, 0, 'out']];
    on(sn, p, .7, { loop: 3.2, y: Y });
    on(ry, p, .7, { loop: 3.2, ox: 0, oy: 92, s: up ? [[0, .6], [.2, .6], [1.4, 1.06, 'out'], [1.6, 1, 'soft'], [2.6, 1], [3, .6]] : [[0, 1], [.4, 1], [1.6, .6, 'in'], [2.4, .6], [2.8, 1, 'out']] });
    const dy = up ? -1 : 1;
    on(ar, p, .7, { loop: 1.6, y: [[0, 0], [.3, -dy * 8, 'io'], [.6, dy * 14, 'out'], [.9, 0, 'soft']] });
    on(arO, p, 0, { o: [[0, 0], [.4, 0], [.5, 1]] });
    return intro; };
  rig('sunrise-pro', .6, 'sink', p => { horizonSun(p, true); });
  rig('sunset-pro', .6, 'sink', p => { horizonSun(p, false); });

  /* timer — a stopwatch: the hand sweeps a full turn, then the top button is pressed (it dips with a click) and it starts again */
  rig('timer-pro', .6, 'pop', p => {
    const intro = sub(p), cy = 24;
    const bt = sub(intro); bt.rect(-36, -186, 72, 18, Object.assign({ rx: 8 }, F(3))); bt.rect(-14, -168, 28, 26, Object.assign({ rx: 4 }, F(3)));
    on(bt, p, .7, { loop: 2.4, y: [[0, 0], [2, 0], [2.06, 8, 'out'], [2.2, 0, 'soft']] });
    const sb = intro.child({ transform: `rotate(45 0 ${cy})` }); sb.rect(-12, cy - 164, 24, 26, Object.assign({ rx: 5 }, F(2.8))); sb.line(-12, cy - 152, 12, cy - 152, W(1.8));
    intro.circle(0, cy, 142, F()); intro.circle(0, cy, 124, W(2));
    for (let i = 0; i < 60; i++) { const big = i % 15 === 0, mid = i % 5 === 0, a = i * 6 - 90, [x1, y1] = pt(116, a, 0, cy), [x2, y2] = pt(big ? 94 : mid ? 102 : 110, a, 0, cy);
      intro.line(x1, y1, x2, y2, W(big ? 3.2 : mid ? 2.4 : 1.4)); }
    intro.circle(0, cy + 52, 26, W(2)); const sh = sub(intro); sh.line(0, cy + 52, 0, cy + 34, W(2)); intro.dot(0, cy + 52, 3);
    on(sh, p, .7, { loop: 2.4, ox: 0, oy: cy + 52, r: [[0, 0], [.1, 0], [2, 90, 'lin'], [2.4, 90]] });
    const hd = sub(intro); hd.line(0, cy + 22, 0, cy - 98, W(3.6));
    on(hd, p, .7, { loop: 2.4, ox: 0, oy: cy, r: [[0, 0], [.1, -6, 'io'], [2, 360, 'io'], [2.4, 360]] });
    intro.circle(0, cy, 11, F(3)); intro.dot(0, cy, 4);
    const ck = sub(intro); [[-44, -184, -64, -196], [44, -184, 64, -196]].forEach(([a, b, c, d]) => ck.line(a, b, c, d, W(3)));
    on(ck, p, .7, { loop: 2.4, o: flash(2.06, 2.3) });
    pop(p, intro);
  });

  Object.assign(G.icons, R);
  const names = ['presentation', 'receipt', 'shopping-bag', 'truck', 'calendar-check', 'calendar-x', 'moon', 'sun', 'sunrise', 'sunset', 'timer'];
  const ALIAS = Object.fromEntries(names.map(n => [n, n + '-pro'])); Object.assign(ALIAS, { stopwatch: 'timer-pro' });
  for (const [a, pro] of Object.entries(ALIAS)) { if (G.icons[a] && !G.icons[a + '-basic'] && !G.icons[a].custom) G.icons[a + '-basic'] = G.icons[a]; G.icons[a] = R[pro]; }
  G.PRO18 = names.map(n => n + '-pro');
})();
