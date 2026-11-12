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
  const STAR4 = (x, y, r) => { const k = r * .16; return `M ${x} ${y - r} Q ${x + k} ${y - k} ${x + r} ${y} Q ${x + k} ${y + k} ${x} ${y + r} Q ${x - k} ${y + k} ${x - r} ${y} Q ${x - k} ${y - k} ${x} ${y - r} Z`; };
  let clipN = 0;
  const clip = (q, d) => { const NS = 'http://www.w3.org/2000/svg', id = 'gl18clip' + (++clipN), cp = document.createElementNS(NS, 'clipPath'), pa = document.createElementNS(NS, 'path');
    cp.setAttribute('id', id); pa.setAttribute('d', d); cp.appendChild(pa); q.g.appendChild(cp); return `url(#${id})`; };
  /* calendar page shared by calendar-check / calendar-x — same build as calendar-days (pro9.js); returns the grid group */
  const calendar = (q) => { const pg = sub(q);
    pg.rect(-164, -136, 328, 300, { rx: 20, fill: C.fill, sw: 3.4 }); pg.rect(-164, -136, 328, 62, { rx: 20, fill: C.fill, sw: 3.4 });
    pg.line(-164, -84, 164, -84, { sw: 3 }); pg.line(-120, -110, 120, -110, { sw: 4, stroke: C.soft });
    const gd = sub(pg); for (let r = 0; r < 4; r++) for (let c = 0; c < 5; c++) gd.rect(-148 + c * 64, -68 + r * 52, 40, 36, { rx: 6, sw: 2, stroke: C.soft });
    [-1, 1].forEach(sd => P.capsule(q, sd * 90, -158, sd * 90, -112, 11, { sw: 2.8 }));
    return { pg, gd }; };
  /* rays of a sun at (cx, cy): n tapered rays between radius r0 and r1 */
  const rays = (q, cx, cy, r0, r1, angles) => angles.forEach(a => q.shape([pt(r0, a - 7, cx, cy), pt(r1, a, cx, cy), pt(r0, a + 7, cx, cy)], { fill: C.fill, sw: 3 }));
  const R = {}, rig = (name, dur, exit, fn) => { fn.custom = true; fn.dur = dur; fn.exit = exit; R[name] = fn; };

  /* presentation — the board on its easel: the three bars of the chart grow one after another (overshoot + settle), the board settles on its legs */
  rig('presentation-pro', .7, 'squash', p => {
    const intro = sub(p);
    intro.line(0, 60, 0, 112, { sw: 5 }); intro.line(0, 112, -74, 174, { sw: 5 }); intro.line(0, 112, 74, 174, { sw: 5 });
    const bd = sub(intro);
    bd.rect(-176, -140, 352, 202, { rx: 12, fill: C.fill, sw: 3.4 }); bd.rect(-158, -122, 316, 166, { rx: 6, sw: 1.8, stroke: C.soft });
    bd.rect(-190, -158, 380, 24, { rx: 8, fill: C.fill, sw: 3.2 });
    bd.line(-140, 30, 30, 30, SOFT(2.2));
    [[-128, 46], [-74, 80], [-20, 112]].forEach(([x, h], i) => { const b = sub(bd); b.rect(x, 30 - h, 40, h, { rx: 5, fill: i === 2 ? C.ink : C.fill, sw: 2.8 }); const t = .2 + i * .22;
      on(b, p, .7, { loop: 2.8, ox: x + 20, oy: 30, sy: [[0, 1], [t, 1], [t + .05, 0, 'in'], [t + .3, 1.12, 'out'], [t + .46, 1, 'soft']] }); });
    [[60, -96, 136, 1], [60, -64, 124, 0], [60, -32, 112, 0]].forEach(([a, y, b, ink]) => bd.line(a, y, b, y, ink ? { sw: 5 } : SOFT(3)));
    on(bd, p, .7, { loop: 2.8, ox: 0, oy: 62, sy: [[0, 1], [1.7, 1], [1.76, .98, 'out'], [1.9, 1.01], [2, 1, 'soft']] });
    grow(p, intro, 0, 174);
  });

  /* receipt — it prints: the slip feeds down out of the printer slot line by line, holds, then clears and prints again */
  rig('receipt-pro', .7, 'pop', p => {
    const intro = sub(p);
    const win = sub(intro, { 'clip-path': clip(intro, 'M -200 -164 L 200 -164 L 200 190 L -200 190 Z') }), rc = sub(win);
    let zz = 'M -110 -170 L 110 -170 L 110 150'; for (let i = 0; i < 11; i++) { const x = 110 - (i + 1) * 20; zz += ` L ${x + 10} 166 L ${x} 150`; }
    rc.path(zz + ' Z', { fill: C.fill, sw: 3.2 });
    rc.line(-80, -128, 0, -128, { sw: 5 });
    [-90, -58, -26, 6].forEach(y => { rc.line(-80, y, 10, y, SOFT(3)); rc.line(50, y, 80, y, SOFT(3)); });
    rc.line(-80, 46, 80, 46, SOFT(2)); rc.line(-80, 80, -10, 80, { sw: 5 }); rc.line(40, 80, 80, 80, { sw: 5 });
    rc.circle(0, 122, 12, SOFT(2));
    on(rc, p, .7, { loop: 3.4, y: [[0, 0], [1.6, 0], [1.8, 0], [1.81, -320], [1.9, -320], [2.15, -250, 'io'], [2.4, -180, 'io'], [2.65, -100, 'io'], [2.9, 0, 'io'], [2.96, 6], [3.04, 0, 'soft']], o: [[0, 1], [1.5, 1], [1.8, 0], [1.81, 1]] });
    intro.rect(-150, -186, 300, 26, { rx: 10, fill: C.fill, sw: 3.4 }); intro.line(-120, -173, 120, -173, { sw: 4, stroke: C.soft });
    pop(p, intro);
  });

  /* shopping-bag — an item drops into the bag: the bag squashes as it lands, the handles swing after it (follow-through) */
  rig('shopping-bag-pro', .6, 'squash', p => {
    const intro = sub(p);
    const it = sub(intro); it.rect(-30, -60, 60, 56, { rx: 8, fill: C.fill, sw: 3 }); it.line(-30, -40, 30, -40, SOFT(2)); it.line(0, -60, 0, -4, SOFT(2));
    on(it, p, .7, { loop: 2.4, y: [[0, -136], [.1, -136], [.5, 30, 'in']], r: [[0, -14], [.5, 6]], o: [[0, 0], [.1, 0], [.18, 1], [.6, 1]] });
    const bg = sub(intro);
    const hd = sub(bg); tubes(hd, ['M -62 -56 L -62 -104 Q -62 -156 0 -156 Q 62 -156 62 -104 L 62 -56'], 20);
    on(hd, p, .7, { loop: 2.4, ox: 0, oy: -60, r: [[0, 0], [.5, 0], [.6, -7, 'out'], [.8, 5, 'io'], [1, -2, 'io'], [1.16, 0, 'soft']] });
    bg.path('M -132 -62 L 132 -62 L 152 150 Q 154 172 132 172 L -132 172 Q -154 172 -152 150 Z', { fill: C.fill, sw: 3.4 });
    bg.line(-124, -34, 124, -34, SOFT(2.2)); [-62, 62].forEach(x => bg.circle(x, -48, 7, { fill: C.fill, sw: 2.4 }));
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
    const intro = sub(p), { pg, gd } = calendar(intro);
    on(gd, p, .7, { loop: 2.8, o: [[0, 1], [.2, 1], [.4, .3], [2.55, .3], [2.75, 1]] });
    const ckO = sub(pg), ck = ckO.poly([[-74, 46], [-24, 96], [76, -10]], { sw: 16 });
    on(ck, p, .7, { loop: 2.8, draw: [[0, 0], [.3, 0], [.7, 1, 'out'], [2.55, 1], [2.7, 0, 'in']] });
    on(ckO, p, .7, { loop: 2.8, ox: 0, oy: 40, s: [[0, 1], [.65, 1], [.75, 1.14, 'out'], [.95, 1, 'soft']] });
    on(pg, p, .7, { loop: 2.8, ox: 0, oy: 164, sy: [[0, 1], [.7, 1], [.78, .97, 'out'], [.9, 1.01], [1, 1, 'soft']] });
    pop(p, intro);
  });

  /* calendar-x — the days dim, a cross is struck through in two quick strokes and the page shakes "no"; then it clears */
  rig('calendar-x-pro', .6, 'pop', p => {
    const intro = sub(p), shk = sub(intro), { pg, gd } = calendar(shk);
    on(gd, p, .7, { loop: 2.8, o: [[0, 1], [.2, 1], [.4, .3], [2.55, .3], [2.75, 1]] });
    const xO = sub(pg); [[[-60, -20], [60, 110], .3], [[60, -20], [-60, 110], .52]].forEach(([a, b, t]) => { const l = xO.line(a[0], a[1], b[0], b[1], { sw: 16 });
      on(l, p, .7, { loop: 2.8, draw: [[0, 0], [t, 0], [t + .2, 1, 'out'], [2.55, 1], [2.7, 0, 'in']] }); });
    on(shk, p, .7, { loop: 2.8, ox: 0, oy: 40, r: [[0, 0], [.75, 0], ...at(shakeKeys(5, 4, .05), .75).slice(1)] });
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
    const ry = sub(intro); rays(ry, 0, 0, 112, 176, [0, 45, 90, 135, 180, 225, 270, 315]);
    on(ry, p, .7, { loop: 3.2, r: [[0, 0], [3.2, 45, 'lin']], s: [[0, 1], [.8, 1.05, 'io'], [1.6, .96, 'io'], [2.4, 1.05, 'io'], [3.2, 1, 'io']] });
    const cr = sub(intro); cr.circle(0, 0, 90, { fill: C.fill, sw: 3.4 }); cr.circle(0, 0, 68, SOFT(2.2));
    on(cr, p, .7, { loop: 1.6, s: [[0, 1], [.8, 1.04, 'io'], [1.6, 1, 'io']] });
    on(intro, p, 0, { s: [[0, .3], [.5, 1.06, 'out'], [.65, 1]], r: [[0, -60], [.6, 0, 'out']], o: [[0, 0], [.15, 1]] });
  });

  /* sunrise / sunset share the scene: horizon, a half sun (clipped at the horizon), rays above it and an arrow */
  const horizonSun = (p, up) => {
    const intro = sub(p); show(p, intro);
    intro.line(-196, 92, 196, 92, { sw: 4.4 }); [[-140, 122, 140], [-80, 148, 80]].forEach(([a, y, b]) => intro.line(a, y, b, y, SOFT(2.6)));
    const win = sub(intro, { 'clip-path': clip(intro, 'M -200 -200 L 200 -200 L 200 88 L -200 88 Z') }), sn = sub(win);
    const ry = sub(sn); rays(ry, 0, 92, 100, 146, [-160, -125, -90, -55, -20]);
    sn.circle(0, 92, 82, { fill: C.fill, sw: 3.4 }); sn.circle(0, 92, 62, SOFT(2.2));
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
    const intro = sub(p), cy = 22;
    const bt = sub(intro); bt.rect(-32, -176, 64, 20, { rx: 8, fill: C.fill, sw: 3.2 }); bt.rect(-14, -160, 28, 26, { rx: 4, fill: C.fill, sw: 3 });
    on(bt, p, .7, { loop: 2.4, y: [[0, 0], [2, 0], [2.06, 8, 'out'], [2.2, 0, 'soft']] });
    const sb = intro.child({ transform: `rotate(45 0 ${cy})` }); sb.rect(-10, cy - 162, 20, 24, { rx: 5, fill: C.fill, sw: 2.8 });
    intro.circle(0, cy, 140, { fill: C.fill, sw: 3.4 }); intro.circle(0, cy, 118, SOFT(2));
    [0, 90, 180, 270].forEach(a => { const [x1, y1] = pt(108, a - 90, 0, cy), [x2, y2] = pt(88, a - 90, 0, cy); intro.line(x1, y1, x2, y2, { sw: 4 }); });
    const hd = sub(intro); hd.line(0, cy + 16, 0, cy - 100, { sw: 5 });
    on(hd, p, .7, { loop: 2.4, ox: 0, oy: cy, r: [[0, 0], [.1, -6, 'io'], [2, 360, 'io'], [2.4, 360]] });
    intro.circle(0, cy, 12, { fill: C.fill, sw: 3 }); intro.dot(0, cy, 4);
    const ck = sub(intro); [[-44, -180, -64, -192], [44, -180, 64, -192]].forEach(([a, b, c, d]) => ck.line(a, b, c, d, { sw: 3 }));
    on(ck, p, .7, { loop: 2.4, o: flash(2.06, 2.3) });
    pop(p, intro);
  });

  Object.assign(G.icons, R);
  const names = ['presentation', 'receipt', 'shopping-bag', 'truck', 'calendar-check', 'calendar-x', 'moon', 'sun', 'sunrise', 'sunset', 'timer'];
  const ALIAS = Object.fromEntries(names.map(n => [n, n + '-pro'])); Object.assign(ALIAS, { stopwatch: 'timer-pro' });
  for (const [a, pro] of Object.entries(ALIAS)) { if (G.icons[a] && !G.icons[a + '-basic'] && !G.icons[a].custom) G.icons[a + '-basic'] = G.icons[a]; G.icons[a] = R[pro]; }
  G.PRO18 = names.map(n => n + '-pro');
})();
