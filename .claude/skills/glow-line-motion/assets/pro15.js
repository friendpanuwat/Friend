/* pro15.js — pro icon batch 15: CutPack priority-3 names 102–121 (magic, battery, home, health, bike, food).
   Detail level = pro.js (one soft inner outline, bands, the few parts the object really has), style.md §0 rules.
   Motion = anticipation, overshoot + settle, follow-through, secondary motion. Entrance and loop sit on separate groups. */
(function () {
  const G = window.GL, C = G.C;
  const sub = (p, attrs) => p.child(attrs || {});
  const on = (q, p, start, spec) => G.kf(q.g || q, p.t0 + start * p.ts, spec);
  const pop = (p, q, at = 0, from = .4) => on(q, p, at, { s: [[0, from], [.42, 1.08, 'out'], [.62, 1]], o: [[0, 0], [.16, 1]] });
  const drop = (p, q, at = 0, dy = -90) => on(q, p, at, { y: [[0, dy], [.55, 0, 'back']], o: [[0, 0], [.2, 1]] });
  const rise = (p, q, at = 0, dy = 150) => on(q, p, at, { y: [[0, dy], [.55, 0, 'back']], o: [[0, 0], [.15, 1]] });
  const thud = (p, q, oy, dy = -220) => on(q, p, 0, { ox: 0, oy, y: [[0, dy], [.42, 0, 'in']], sy: [[.42, .86], [.56, 1.06, 'out'], [.7, 1]], sx: [[.42, 1.1], [.56, .97, 'out'], [.7, 1]], o: [[0, 0], [.1, 1]] });
  const grow = (p, q, at, oy, ox = 0) => on(q, p, at, { ox, oy, sy: [[0, 0], [.45, 1.06, 'out'], [.6, .98], [.72, 1, 'soft']], o: [[0, 0], [.05, 1]] });
  const show = (p, q) => on(q, p, 0, { o: [[0, 0], [.01, 1]] });
  const flash = (a, b) => [[0, 0], [a, 0], [a + .02, 1], [b, 0]];
  const shakeKeys = (n, amp, step = .05) => { const k = [[0, 0]]; for (let i = 1; i <= n; i++) k.push([i * step, i % 2 ? -amp : amp, 'lin']); k.push([(n + 1) * step, 0, 'out']); return k; };
  const at = (keys, t0) => keys.map(([t, v, e]) => [t + t0, v, e]);
  const tubes = (q, ds, w = 30) => { ds.forEach(d => q.path(d, { sw: w })); ds.forEach(d => q.path(d, { sw: w - 7, stroke: C.fill })); };
  const f1 = v => +v.toFixed(1), rad = d => d * Math.PI / 180;
  const SOFT = (w = 2) => ({ sw: w, stroke: C.soft });
  const DROP = (x, y, r) => `M ${x} ${y - r * 1.6} C ${x + r * .5} ${y - r * .8}, ${x + r} ${y - r * .2}, ${x + r} ${y + r * .3} A ${r} ${r} 0 0 1 ${x - r} ${y + r * .3} C ${x - r} ${y - r * .2}, ${x - r * .5} ${y - r * .8}, ${x} ${y - r * 1.6} Z`;
  const STAR4 = (x, y, r) => { const k = r * .16; return `M ${x} ${y - r} Q ${x + k} ${y - k} ${x + r} ${y} Q ${x + k} ${y + k} ${x} ${y + r} Q ${x - k} ${y + k} ${x - r} ${y} Q ${x - k} ${y - k} ${x} ${y - r} Z`; };
  const ZAP = [[30, -178], [-96, 22], [-6, 22], [-40, 178], [96, -30], [6, -30]];
  const scalePts = (a, k, dx = 0, dy = 0) => a.map(([x, y]) => [f1(x * k + dx), f1(y * k + dy)]);
  let clipN = 0;
  const clip = (q, d) => { const NS = 'http://www.w3.org/2000/svg', id = 'gl15clip' + (++clipN), cp = document.createElementNS(NS, 'clipPath'), pt = document.createElementNS(NS, 'path');
    cp.setAttribute('id', id); pt.setAttribute('d', d); cp.appendChild(pt); q.g.appendChild(cp); return `url(#${id})`; };
  const slash = (q, x1, y1, x2, y2) => { q.line(x1, y1, x2, y2, { sw: 22, stroke: C.fill }); q.line(x1, y1, x2, y2, { sw: 6 }); };
  /* a "z" drawn as a line (sleep), drifting up and fading — loops every T */
  const zee = (q, p, x, y, s, start, T, dx, dy) => { const g = sub(q); g.poly([[x - 12 * s, y - 12 * s], [x + 12 * s, y - 12 * s], [x - 12 * s, y + 12 * s], [x + 12 * s, y + 12 * s]], { sw: 4 });
    on(g, p, start, { loop: T, ox: x, oy: y, x: [[0, 0], [T, dx, 'out']], y: [[0, 0], [T, dy, 'out']], s: [[0, .5], [T, 1.2, 'out']], r: [[0, -10], [T, 10, 'io']], o: [[0, 0], [.3, 1], [T * .65, 1], [T, 0]] }); };
  const R = {}, rig = (name, dur, exit, fn) => { fn.custom = true; fn.dur = dur; fn.exit = exit; R[name] = fn; };

  /* wand-sparkles — the wand winds back (anticipation) and flicks; the sparkles at its tip burst bigger and turn a quarter, tiny dots twinkle */
  rig('wand-sparkles-pro', .6, 'pop', p => {
    const intro = sub(p);
    [[130, -160, 0], [-40, -110, .4], [176, -86, .8]].forEach(([x, y, d]) => { const g = sub(intro); g.dot(x, y, 5);
      on(g, p, .7 + d, { loop: 1.8, ox: x, oy: y, s: [[0, 0], [.3, 1.3, 'out'], [.9, 0, 'in']] }); });
    const st = (x, y, r, t, rot) => { const g = sub(intro); g.path(STAR4(x, y, r), { fill: C.fill, sw: 3 }); g.path(STAR4(x, y, r * .42), { fill: C.ink, sw: 1 });
      on(g, p, .7, { loop: 2.4, ox: x, oy: y, s: [[0, 1], [t, 1], [t + .1, 1.3, 'out'], [t + .4, 1, 'soft']], r: [[0, 0], [t, 0], [t + .4, rot, 'out'], [2.4, rot]] }); };
    st(96, -104, 54, .5, 90); st(162, -6, 28, .58, -90); st(8, -158, 24, .64, 90);
    const wO = sub(intro), wd = sub(wO), wg = wd.child({ transform: 'translate(-50 60) rotate(45)' });
    wg.rect(-13, -110, 26, 250, { rx: 9, fill: C.fill, sw: 3.4 }); wg.rect(-13, -110, 26, 46, { rx: 9, fill: C.ink, sw: 2.4 });
    wg.line(-13, 92, 13, 92, SOFT(2.2)); wg.line(-13, 106, 13, 106, SOFT(2.2)); wg.rect(-16, 128, 32, 16, { rx: 6, fill: C.fill, sw: 2.6 });
    wd.path('M -30 -40 Q 0 -78 52 -70', SOFT(2.4));
    on(wd, p, .7, { loop: 2.4, ox: -149, oy: 159, r: [[0, 0], [.28, -9, 'io'], [.5, 8, 'out'], [.68, -2, 'io'], [.88, 0, 'soft']] });
    on(wO, p, 0, { ox: -149, oy: 159, r: [[0, -40], [.5, 4, 'out'], [.65, 0, 'soft']], o: [[0, 0], [.1, 1]] });
    pop(p, intro, 0, .6);
  });

  /* apple — squats (anticipation), hops, lands with a squash; the leaf on the stem flutters after the landing (follow-through) */
  rig('apple-pro', .6, 'rise', p => {
    const intro = sub(p), ap = sub(intro);
    const lf = sub(ap); lf.path('M 14 -122 C 40 -172, 100 -162, 118 -140 C 92 -110, 40 -104, 14 -122 Z', { fill: C.fill, sw: 3 }); lf.path('M 24 -126 C 42 -138, 94 -137, 108 -139', SOFT(1.8)); lf.line(56, -134, 66, -150, SOFT(1.6)); lf.line(80, -137, 92, -150, SOFT(1.6));
    on(lf, p, .7, { loop: 2.4, ox: 14, oy: -122, r: [[0, 0], [.5, 0], [.6, -16, 'out'], [.8, 10, 'io'], [.98, -5, 'io'], [1.14, 2], [1.3, 0, 'soft']] });
    ap.path('M 0 -86 Q 2 -126 20 -150', { sw: 6 });
    ap.path('M 0 -86 C 40 -126, 150 -110, 150 0 C 150 96, 80 166, 30 150 C 12 144, -12 144, -30 150 C -80 166, -150 96, -150 0 C -150 -110, -40 -126, 0 -86 Z', { fill: C.fill, sw: 3.4 });
    ap.path('M -34 -94 Q 0 -72 34 -94', SOFT(2.2));
    on(ap, p, .7, { loop: 2.4, ox: 0, oy: 154, y: [[0, 0], [.16, 0], [.34, -38, 'out'], [.52, 0, 'in']],
      sy: [[0, 1], [.16, .88, 'io'], [.3, 1.06, 'out'], [.52, 1], [.58, .9, 'out'], [.72, 1.03], [.84, 1, 'soft']], sx: [[0, 1], [.16, 1.07, 'io'], [.3, .96, 'out'], [.52, 1], [.58, 1.07, 'out'], [.72, .98], [.84, 1, 'soft']] });
    thud(p, intro, 154);
  });

  /* battery-charging — the cells light up one by one (each pops in), the bolt in front pulses on every cell, then the full battery bumps and resets */
  rig('battery-charging-pro', .6, 'pop', p => {
    const intro = sub(p), bt = sub(intro);
    bt.rect(-160, -76, 290, 152, { rx: 26, fill: C.fill, sw: 3.4 }); bt.rect(130, -32, 30, 64, { rx: 10, fill: C.fill, sw: 3 }); bt.rect(-148, -64, 266, 128, { rx: 16, sw: 1.8, stroke: C.soft });
    [-128, -44, 40].forEach((x, i) => { const c = sub(bt), t = .3 + i * .45; c.rect(x, -44, 70, 88, { rx: 10, fill: C.ink, sw: 2 });
      on(c, p, .7, { loop: 2.8, ox: x + 35, oy: 0, o: [[0, 0], [t, 0], [t + .04, 1], [2.25, 1], [2.4, 0]], s: [[0, .6], [t, .6], [t + .2, 1.06, 'out'], [t + .32, 1, 'soft']] }); });
    const pg = sub(bt); pg.path('M 182 0 Q 198 2 196 44 Q 194 100 160 130', { sw: 5 }); pg.rect(160, -20, 24, 40, { rx: 6, fill: C.fill, sw: 3 }); pg.line(166, -8, 178, -8, SOFT(1.8)); pg.line(166, 8, 178, 8, SOFT(1.8));
    const bo = sub(bt); bo.shape(scalePts(ZAP, .44, -6, 0), { fill: C.fill, sw: 3.4 });
    const beat = t => [[t, 1], [t + .08, 1.16, 'out'], [t + .26, 1, 'soft']];
    on(bo, p, .7, { loop: 2.8, ox: -6, oy: 0, s: [[0, 1], ...beat(.3), ...beat(.75), ...beat(1.2), [1.65, 1], [1.75, 1.24, 'out'], [2, 1, 'soft']] });
    on(bt, p, .7, { loop: 2.8, ox: 0, oy: 0, s: [[0, 1], [1.65, 1], [1.75, 1.04, 'out'], [1.95, 1, 'soft']] });
    pop(p, intro);
  });

  /* battery-full — a bright sweep runs across the three full cells, then the battery hops on the spot with a squash and a "ready" flash */
  rig('battery-full-pro', .6, 'squash', p => {
    const intro = sub(p), bO = sub(intro), bt = sub(bO);
    bt.rect(-160, -76, 290, 152, { rx: 26, fill: C.fill, sw: 3.4 }); bt.rect(130, -32, 30, 64, { rx: 10, fill: C.fill, sw: 3 }); bt.rect(-148, -64, 266, 128, { rx: 16, sw: 1.8, stroke: C.soft });
    [-128, -49, 30].forEach((x, i) => { const c = sub(bt), t = .2 + i * .12; c.rect(x, -44, 68, 88, { rx: 10, fill: C.ink, sw: 2 });
      on(c, p, .7, { loop: 2.4, o: [[0, 1], [t, 1], [t + .06, .3, 'out'], [t + .3, 1, 'in']] }); });
    on(bt, p, .7, { loop: 2.4, ox: 0, oy: 76, y: [[0, 0], [.8, 0], [.98, -26, 'out'], [1.14, 0, 'in']], sy: [[0, 1], [.7, 1], [.8, .9, 'io'], [.94, 1.05, 'out'], [1.14, 1], [1.2, .92, 'out'], [1.34, 1.02], [1.46, 1, 'soft']] });
    const fx = sub(intro); [[-40, -96, -50, -124], [-5, -100, -5, -132], [30, -96, 40, -124]].forEach(([a, b, c, d]) => fx.line(a, b, c, d, { sw: 3.2 }));
    on(fx, p, .7, { loop: 2.4, o: flash(1.16, 1.5), ox: -5, oy: -96, s: [[0, .7], [1.16, .7], [1.5, 1.2, 'out']] });
    pop(p, intro);
  });

  /* bed — the blanket rises and falls with slow breathing; little "z"s float up from the pillow */
  rig('bed-pro', .7, 'squash', p => {
    const intro = sub(p);
    intro.rect(-182, -84, 28, 250, { rx: 12, fill: C.fill, sw: 3.4 }); intro.line(-168, -64, -168, 30, SOFT(2));
    intro.rect(-154, 96, 314, 22, { rx: 6, fill: C.fill, sw: 3 });
    intro.rect(-154, 42, 314, 56, { rx: 14, fill: C.fill, sw: 3.2 });
    const pl = sub(intro); pl.rect(-146, 4, 96, 42, { rx: 20, fill: C.fill, sw: 3 }); pl.path('M -132 26 Q -98 18 -64 26', SOFT(1.8));
    const bk = sub(intro); bk.path('M -40 44 Q -40 22 -18 22 L 150 22 Q 162 22 162 36 L 162 98 L -40 98 Z', { fill: C.fill, sw: 3.2 }); bk.line(-14, 24, -14, 96, SOFT(2.2)); bk.line(-14, 84, 160, 84, SOFT(1.8));
    on(bk, p, .7, { loop: 2.4, ox: 60, oy: 98, sy: [[0, 1], [1.2, 1.12, 'io'], [2.4, 1, 'io']] });
    intro.rect(160, 6, 22, 160, { rx: 10, fill: C.fill, sw: 3.4 });
    [0, .8, 1.6].forEach(d => zee(intro, p, -80, -40, .9, .7 + d, 2.4, 60, -110));
    thud(p, intro, 166);
  });

  /* bed-double — the two pillows get plumped one after the other (squash and puff back), the blanket smooths out with a little ripple */
  rig('bed-double-pro', .7, 'squash', p => {
    const intro = sub(p);
    [-176, 156].forEach(x => { intro.rect(x, 110, 20, 52, { rx: 6, fill: C.fill, sw: 3 }); intro.line(x + 4, 150, x + 16, 150, SOFT(1.8)); });
    intro.path('M -170 40 L -170 -96 Q -170 -136 -130 -136 L 130 -136 Q 170 -136 170 -96 L 170 40 Z', { fill: C.fill, sw: 3.4 });
    intro.rect(-146, -112, 292, 84, { rx: 20, fill: C.fill, sw: 2, stroke: C.soft });
    [[-150, .3, -85], [20, .9, 85]].forEach(([x, t, cx]) => { const pw = sub(intro); pw.rect(x, -40, 130, 64, { rx: 28, fill: C.fill, sw: 3.2 }); pw.path(`M ${x + 20} -8 Q ${x + 65} -18 ${x + 110} -8`, SOFT(1.8));
      on(pw, p, .7, { loop: 2.6, ox: cx, oy: 24, sy: [[0, 1], [t, 1], [t + .1, .8, 'out'], [t + .3, 1.08, 'out'], [t + .46, 1, 'soft']], sx: [[0, 1], [t, 1], [t + .1, 1.08, 'out'], [t + .3, .97], [t + .46, 1, 'soft']] }); });
    intro.rect(-186, 20, 372, 92, { rx: 16, fill: C.fill, sw: 3.4 });
    const bk = sub(intro); bk.path('M -186 54 Q -90 40 0 50 Q 90 40 186 54', { sw: 3 }); bk.line(-170, 74, 170, 74, SOFT(2)); bk.line(-186, 94, 186, 94, { sw: 2.6 });
    on(bk, p, .7, { loop: 2.6, ox: 0, oy: 54, sy: [[0, 1], [1.6, 1], [1.75, 1.6, 'out'], [2, .7, 'io'], [2.2, 1, 'soft']] });
    thud(p, intro, 162);
  });

  /* bike — rolls in and brakes; it rides on: wheels and pedals turn, the frame bobs over the road, dashes stream past */
  rig('bike-pro', .7, 'slide', p => {
    const intro = sub(p); show(p, intro);
    const rd = sub(intro); rd.line(-196, 140, 196, 140, { sw: 4 });
    const ds = sub(rd, { 'clip-path': clip(rd, 'M -190 150 L 190 150 L 190 180 L -190 180 Z') }), dl = sub(ds);
    for (let x = -240; x <= 240; x += 80) dl.line(x, 164, x + 40, 164, { sw: 4, stroke: C.soft });
    on(dl, p, .7, { loop: .5, x: [[0, 0], [.5, -80, 'lin']] });
    const cO = sub(intro), bO = sub(cO);
    const Rw = [-112, 72], Fw = [112, 72], B = [-6, 76], S = [-52, -36], H = [80, -44], Hb = [88, -8];
    [Rw, Fw].forEach(([x, y]) => { const w = sub(bO); w.circle(x, y, 66, { sw: 5 }); w.circle(x, y, 56, SOFT(2)); const sp = sub(w);
      [0, 60, 120].forEach(a => { const u = rad(a); sp.line(x - Math.cos(u) * 54, y - Math.sin(u) * 54, x + Math.cos(u) * 54, y + Math.sin(u) * 54, SOFT(1.8)); });
      w.circle(x, y, 8, { fill: C.fill, sw: 3 });
      on(sp, p, .7, { loop: .7, ox: x, oy: y, r: [[0, 0], [.7, 120, 'lin']] }); });
    const arc = (x, y, r, a0, a1) => `M ${f1(x + Math.cos(rad(a0)) * r)} ${f1(y + Math.sin(rad(a0)) * r)} A ${r} ${r} 0 0 1 ${f1(x + Math.cos(rad(a1)) * r)} ${f1(y + Math.sin(rad(a1)) * r)}`;
    bO.path(arc(Rw[0], Rw[1], 76, -170, -40), { sw: 3.4 }); bO.path(arc(Fw[0], Fw[1], 76, -140, -20), { sw: 3.4 });
    const fr = sub(bO);
    fr.line(B[0], B[1] - 22, Rw[0], Rw[1] - 9, SOFT(2.2)); fr.line(B[0], B[1] + 22, Rw[0], Rw[1] + 9, SOFT(2.2));
    [[Rw, B], [Rw, S], [S, B], [S, H], [Hb, B]].forEach(([a, b]) => fr.line(a[0], a[1], b[0], b[1], { sw: 6 }));
    fr.line(H[0], H[1], Hb[0], Hb[1], { sw: 9 }); fr.line(Hb[0], Hb[1], Fw[0], Fw[1], { sw: 5 });
    fr.line(S[0], S[1], -58, -56, { sw: 5 }); fr.path('M -94 -62 Q -60 -76 -28 -62 Q -56 -50 -94 -62 Z', { fill: C.fill, sw: 3.2 });
    fr.line(H[0], H[1], 74, -66, { sw: 5 }); fr.rect(92, -36, 18, 14, { rx: 4, fill: C.ink, sw: 1.6 }); fr.path('M 62 -70 Q 84 -76 100 -66 Q 108 -58 104 -46', { sw: 5 });
    const ck = sub(bO); ck.circle(B[0], B[1], 22, { fill: C.fill, sw: 3.2 }); ck.circle(B[0], B[1], 8, { fill: C.fill, sw: 2.4, stroke: C.soft });
    [1, -1].forEach(sd => { ck.line(B[0], B[1], B[0], B[1] + sd * 38, { sw: 5 }); ck.rect(B[0] - 14, B[1] + sd * 38 - 4, 28, 8, { rx: 3, fill: C.fill, sw: 2.6 }); });
    on(ck, p, .7, { loop: 1.4, ox: B[0], oy: B[1], r: [[0, 0], [1.4, 360, 'lin']] });
    on(fr, p, .7, { loop: .7, y: [[0, 0], [.35, -2.5, 'io'], [.7, 0, 'io']] });
    on(bO, p, 0, { ox: Fw[0], oy: Fw[1] + 66, r: [[0, 0], [.42, 0], [.55, 3, 'out'], [.72, -1.2, 'io'], [.9, 0, 'soft']] });
    on(cO, p, 0, { x: [[0, -330], [.55, 0, 'out']], o: [[0, 0], [.12, 1]] });
  });

  /* cigarette-off — the ember glows and smoke starts to curl up, but it thins out and dies; the slash never lifts */
  rig('cigarette-off-pro', .6, 'pop', p => {
    const intro = sub(p);
    const sm = sub(intro); const s1 = sm.path('M 150 6 C 128 -30, 172 -62, 150 -100 C 130 -136, 168 -152, 150 -186', SOFT(3)), s2 = sm.path('M 136 4 C 116 -30, 148 -60, 126 -96', SOFT(2.6));
    [s1, s2].forEach((s, i) => on(s, p, .7, { loop: 2.6, draw: [[0, 0], [.2 + i * .1, 0], [1.2 + i * .1, 1, 'out'], [2.6, 1]] }));
    on(sm, p, .7, { loop: 2.6, y: [[0, 0], [1.2, 0], [2.1, -24, 'in']], o: [[0, 1], [1.3, 1], [2.1, 0], [2.6, 0]] });
    const cg = sub(intro);
    cg.rect(-170, 14, 300, 40, { rx: 6, fill: C.fill, sw: 3.4 }); cg.rect(-170, 14, 84, 40, { rx: 6, fill: C.fill, sw: 3 }); cg.line(-160, 34, -96, 34, SOFT(1.8));
    cg.line(-78, 16, -78, 52, SOFT(2)); cg.poly([[130, 14], [138, 22], [132, 30], [140, 38], [132, 46], [130, 54]], SOFT(2)); cg.rect(130, 14, 26, 40, { rx: 5, fill: C.fill, sw: 2.6, stroke: C.soft });
    const em = sub(cg); em.rect(146, 18, 8, 32, { rx: 3, fill: C.ink, sw: 1.4 });
    on(em, p, .7, { loop: 2.6, o: [[0, .3], [.2, 1], [.6, .6], [.9, 1], [1.3, .4], [2.1, .15], [2.6, .3]] });
    on(cg, p, .7, { loop: 2.6, ox: 0, oy: 34, r: [[0, 0], [1.9, 0], ...at(shakeKeys(3, 1.5), 1.9).slice(1)] });
    const sl = sub(intro); slash(sl, -160, -150, 160, 150);
    on(sl, p, .7, { loop: 2.6, s: [[0, 1], [1.9, 1], [2, 1.05, 'out'], [2.2, 1, 'soft']] });
    pop(p, intro);
  });

  /* glass-water — the glass rocks; the water surface tilts the other way and lags behind (slosh), little bubbles rise inside */
  rig('glass-water-pro', .6, 'squash', p => {
    const intro = sub(p), gt = sub(intro);
    const GP = 'M -100 -140 L 100 -140 L 80 150 Q 78 166 62 166 L -62 166 Q -78 166 -80 150 Z';
    gt.path(GP, { fill: C.fill, sw: 3.4 });
    const cl = sub(gt, { 'clip-path': clip(gt, 'M -96 -137 L 96 -137 L 77 148 Q 76 162 61 162 L -61 162 Q -76 162 -77 148 Z') });
    [[-30, 0], [20, .55], [-4, 1.1]].forEach(([x, d]) => { const b = sub(cl); b.circle(x, 130, 7, SOFT(2.2));
      on(b, p, .7 + d, { loop: 1.6, x: [[0, 0], [.6, 6, 'io'], [1.2, -4, 'io']], y: [[0, 0], [1.4, -150, 'in']], o: [[0, 0], [.2, 1], [1.2, 1], [1.4, 0]] }); });
    const sr = sub(cl), sw = sub(sr);
    let d = 'M -260 -40'; for (let x = -260; x < 260; x += 80) d += ` Q ${x + 20} -50 ${x + 40} -40 Q ${x + 60} -30 ${x + 80} -40`;
    sw.path(d, { sw: 3.2 });
    on(sw, p, .7, { loop: 1.6, x: [[0, 0], [1.6, 80, 'lin']] });
    on(sr, p, .7, { loop: 2.4, ox: 0, oy: -40, r: [[0, 0], [.5, 7, 'io'], [1.3, -8, 'io'], [2.1, 4, 'io'], [2.4, 0, 'io']] });
    gt.line(-92, -124, 92, -124, SOFT(2)); gt.line(-76, 140, 76, 140, SOFT(2.2)); gt.path(DROP(66, -86, 7), { fill: C.fill, sw: 2.2 }); gt.path(DROP(56, 10, 5), { fill: C.fill, sw: 2 });
    on(gt, p, .7, { loop: 2.4, ox: 0, oy: 166, r: [[0, 0], [.4, -5, 'io'], [1.2, 5, 'io'], [2, -2, 'io'], [2.4, 0, 'io']] });
    pop(p, intro);
  });

  /* pill — the capsule's halves pull apart (after a small squeeze), granules spray out and fall, the halves snap back together */
  rig('pill-pro', .6, 'spin', p => {
    const intro = sub(p);
    [[-40, -74], [-74, -102], [-10, -124], [52, -84], [34, 58], [76, 36]].forEach(([tx, ty], i) => { const g = sub(intro); g.circle(0, 0, 6 + (i % 2) * 2, { fill: i % 3 ? C.fill : C.ink, sw: 2.4 });
      on(g, p, .7, { loop: 2.6, x: [[0, 0], [.5, 0], [.8, tx, 'out'], [1.6, tx * 1.15]], y: [[0, 0], [.5, 0], [.8, ty, 'out'], [1.6, ty + 50, 'in']], o: [[0, 0], [.5, 0], [.52, 1], [1.35, 1], [1.6, 0]] }); });
    const tb = sub(intro); tb.circle(118, 116, 38, { fill: C.fill, sw: 3.2 }); tb.line(92, 116, 144, 116, SOFT(2.2)); pop(p, tb, .25);
    const pO = sub(intro), rt = sub(pO), cg = rt.child({ transform: 'rotate(-35)' });
    const L = sub(cg), Rr = sub(cg);
    L.path('M 0 -56 L -104 -56 A 56 56 0 0 0 -104 56 L 0 56 Z', { fill: C.fill, sw: 3.4 }); L.path('M -20 -40 L -100 -40', SOFT(1.8));
    Rr.path('M 0 -56 L 104 -56 A 56 56 0 0 1 104 56 L 0 56 Z', { fill: C.rule, sw: 3.4 });
    [[L, -1], [Rr, 1]].forEach(([g, sd]) => on(g, p, .7, { loop: 2.6, x: [[0, 0], [.3, -sd * 4, 'io'], [.5, sd * 22, 'out'], [1.4, sd * 22], [1.66, 0, 'in'], [1.72, -sd * 2], [1.82, 0, 'soft']] }));
    on(rt, p, .7, { loop: 2.6, r: [[0, 0], [.3, -3, 'io'], [.55, 4, 'out'], [.8, 0, 'soft'], [1.66, 0], [1.74, -3], [1.9, 0, 'soft']] });
    on(intro, p, 0, { s: [[0, .3], [.5, 1.06, 'out'], [.65, 1]], r: [[0, -90], [.6, 0, 'out']], o: [[0, 0], [.15, 1]] });
  });

  /* stethoscope — the chest piece listens: it beats lub-dub with ripples spreading from it, the tube sways a little */
  rig('stethoscope-pro', .6, 'pop', p => {
    const intro = sub(p), tb = sub(intro);
    tubes(tb, ['M -112 -150 L -112 -62 Q -112 16 -70 20', 'M -28 -150 L -28 -62 Q -28 16 -70 20', 'M -70 20 Q -70 150 20 150 Q 108 150 108 60 L 108 34'], 18);
    tb.path('M -112 -96 Q -70 -80 -28 -96', SOFT(2.2)); tb.rect(-82, 8, 24, 26, { rx: 6, fill: C.fill, sw: 3 });
    [-112, -28].forEach(x => tb.ellipse(x, -160, 13, 15, { fill: C.ink, sw: 2 }));
    on(tb, p, .7, { loop: 3.2, ox: -70, oy: -150, r: [[0, 0], [1.6, 1.5, 'io'], [3.2, 0, 'io']] });
    const rp = sub(intro); [.2, .45].forEach(t => { const c = sub(rp); c.circle(108, -30, 48, { sw: 2.6 });
      on(c, p, .7, { loop: 1.6, ox: 108, oy: -30, s: [[0, 1], [t, 1], [t + .5, 1.7, 'out']], o: [[0, 0], [t, 0], [t + .02, .9], [t + .5, 0]] }); });
    const cp = sub(intro), cpb = sub(cp);
    cpb.rect(100, 12, 16, 26, { rx: 4, fill: C.fill, sw: 3 }); cpb.line(98, 24, 118, 24, SOFT(2)); cpb.circle(108, -30, 48, { fill: C.fill, sw: 3.4 }); cpb.circle(108, -30, 30, { fill: C.fill, sw: 2.2, stroke: C.soft }); cpb.dot(108, -30, 5);
    on(cpb, p, .7, { loop: 1.6, ox: 108, oy: -30, s: [[0, 1], [.2, 1], [.26, 1.08, 'out'], [.38, 1, 'soft'], [.45, 1], [.51, 1.05, 'out'], [.64, 1, 'soft']] });
    pop(p, intro);
  });

  /* thermometer — the column dips, then shoots up and overshoots, the bulb swells, heat waves rise; then it cools back down */
  rig('thermometer-pro', .7, 'squash', p => {
    const intro = sub(p);
    const hw = sub(intro); [-136, -104, -72].forEach((x, i) => hw.path(`M ${x} 0 Q ${x - 12} -24 ${x} -48 Q ${x + 12} -72 ${x} -96`, { sw: 3 }));
    on(hw, p, .7, { loop: 3.2, y: [[0, 20], [1, 20], [2.2, -30, 'out']], o: [[0, 0], [1, 0], [1.3, 1], [1.9, 1], [2.2, 0]] });
    const tm = sub(intro);
    tm.path('M -26 76 L -26 -144 A 26 26 0 0 1 26 -144 L 26 76 A 50 50 0 1 1 -26 76 Z', { fill: C.fill, sw: 3.4 });
    tm.line(-15, -146, -15, 84, SOFT(1.8)); tm.line(15, -146, 15, 84, SOFT(1.8)); tm.circle(80, -144, 6, { sw: 2.4 });
    for (let i = 0; i < 7; i++) { const y = -130 + i * 30, lg = i % 2 === 0; tm.line(40, y, lg ? 66 : 56, y, { sw: lg ? 3 : 2.2, stroke: lg ? C.ink : C.soft }); }
    const mc = sub(tm); mc.rect(-9, -134, 18, 236, { rx: 9, fill: C.ink, sw: 1.6 });
    on(mc, p, .7, { loop: 3.2, ox: 0, oy: 102, sy: [[0, .36], [.3, .3, 'io'], [1, 1.02, 'out'], [1.15, .97], [1.3, 1, 'soft'], [2.2, 1], [2.8, .36, 'io']] });
    const bl = sub(tm); bl.circle(0, 119, 32, { fill: C.ink, sw: 1.6 });
    on(bl, p, .7, { loop: 3.2, ox: 0, oy: 119, s: [[0, 1], [.3, .94, 'io'], [.5, 1.1, 'out'], [.8, 1, 'soft']] });
    grow(p, intro, 0, 169);
  });

  /* zap-off — the struck-out bolt tries to spark: it flickers, a few sparks start out and fail, it dims again; the slash never lifts */
  rig('zap-off-pro', .6, 'blink', p => {
    const intro = sub(p);
    const sp = sub(intro); for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3 + .5; sp.line(Math.cos(a) * 120, Math.sin(a) * 120, Math.cos(a) * 146, Math.sin(a) * 146, { sw: 3 }); }
    on(sp, p, .7, { loop: 2.6, ox: 0, oy: 0, o: [[0, 0], [.4, 0], [.42, 1], [.62, 0]], s: [[0, .85], [.4, .85], [.62, 1, 'out']] });
    const bo = sub(intro); bo.shape(scalePts(ZAP, .86), { fill: C.fill, sw: 3.4 }); bo.shape(scalePts(ZAP, .64, 2, 0), { sw: 1.8, stroke: C.soft });
    on(bo, p, .7, { loop: 2.6, o: [[0, .5], [.3, .5], [.32, 1], [.36, .3], [.4, 1], [.44, .4], [.6, .9], [.9, .5]], r: [[0, 0], [.6, 0], ...at(shakeKeys(3, 2), .6).slice(1)] });
    const sl = sub(intro); slash(sl, -160, -150, 160, 150);
    on(sl, p, .7, { loop: 2.6, s: [[0, 1], [.6, 1], [.7, 1.05, 'out'], [.9, 1, 'soft']] });
    pop(p, intro);
  });

  /* banana — rocks back and forth on its curved belly like a cradle, slowing at each end */
  rig('banana-pro', .6, 'rise', p => {
    const intro = sub(p);
    intro.line(-110, 108, 90, 108, { sw: 4 });
    const bn = sub(intro);
    bn.path('M 96 -124 L 100 -152 L 118 -150 L 112 -120', { fill: C.fill, sw: 3 });
    bn.path('M 104 -126 C 136 20, 30 128, -150 56 C -158 52, -160 42, -150 38 C -10 74, 72 4, 78 -116 Z', { fill: C.fill, sw: 3.4 });
    bn.path('M 94 -102 C 104 14, 26 92, -128 52', SOFT(2.2)); bn.line(-150, 38, -146, 54, { sw: 5 }); bn.line(98, -124, 114, -122, SOFT(2));
    [[98, -22, 7], [62, 38, 6], [12, 76, 7]].forEach(([x, y, r]) => bn.circle(x, y, r, { fill: C.soft, stroke: C.soft, sw: 1 }));
    on(bn, p, .7, { loop: 2.6, ox: -10, oy: 104, r: [[0, 0], [.65, 7, 'io'], [1.95, -7, 'io'], [2.6, 0, 'io']] });
    thud(p, intro, 108);
  });

  /* beef — a steak on the grill: it sizzles (quick jiggles, sizzle ticks popping around), steam curls up from it */
  rig('beef-pro', .6, 'pop', p => {
    const intro = sub(p);
    const stm = sub(intro); [[-60, 0], [0, .5], [60, 1]].forEach(([x, d]) => { const g = sub(stm), s = g.path(`M ${x} -110 C ${x - 16} -134, ${x + 16} -152, ${x} -176`, SOFT(3));
      on(s, p, .7 + d, { loop: 1.6, draw: [[0, 0], [.6, 1, 'out'], [1.6, 1]] });
      on(g, p, .7 + d, { loop: 1.6, y: [[0, 10], [1.6, -14, 'out']], o: [[0, 0], [.2, 1], [1, 1], [1.6, 0]] }); });
    const sk = sub(intro);
    sk.path('M -150 -20 C -170 -110, -60 -150, 30 -130 C 130 -110, 170 -30, 140 50 C 110 130, -10 150, -90 120 C -150 96, -140 40, -150 -20 Z', { fill: C.fill, sw: 3.4 });
    sk.path('M -124 -18 C -140 -90, -54 -122, 26 -106 C 108 -90, 140 -28, 116 38 C 92 104, -6 122, -76 98 C -124 78, -116 30, -124 -18 Z', SOFT(2.4));
    sk.path('M -80 -40 Q -40 -70 0 -50 Q 30 -36 50 -60', SOFT(2)); sk.path('M -70 50 Q -30 30 10 56', SOFT(2));
    sk.circle(72, 0, 30, { fill: C.fill, sw: 3.2 }); sk.circle(72, 0, 13, { fill: C.fill, sw: 2.2, stroke: C.soft });
    on(sk, p, .7, { loop: 1.6, ox: 0, oy: 130, sy: [[0, 1], [.1, .97, 'io'], [.2, 1.02, 'io'], [.3, 1, 'io'], [.8, 1], [.9, .98, 'io'], [1, 1, 'io']] });
    [[-170, 40, .2], [150, -60, .6], [140, 110, 1], [-120, -120, 1.3]].forEach(([x, y, t]) => { const g = sub(intro); g.line(x - 8, y - 8, x + 8, y + 8, { sw: 2.6 }); g.line(x + 8, y - 8, x - 8, y + 8, { sw: 2.6 });
      on(g, p, .7, { loop: 1.6, ox: x, oy: y, o: flash(t, t + .25), s: [[0, .5], [t, .5], [t + .25, 1.2, 'out']] }); });
    pop(p, intro);
  });

  /* cake — the tiers stack down one by one and the candle lands on top, the flame lights; it flickers and leans like a real flame */
  rig('cake-pro', .9, 'squash', p => {
    const intro = sub(p); show(p, intro);
    const pl = intro.ellipse(0, 156, 184, 12, { fill: C.fill, sw: 3 }); on(pl, p, 0, { s: [[0, 0], [.3, 1, 'out']], ox: 0, oy: 156 });
    const drips = (x0, x1, y) => { let d = `M ${x0} ${y}`; for (let x = x0, i = 0; x < x1; x += 25, i++) d += ` Q ${x + 12.5} ${y + (i % 2 ? 30 : 18)} ${x + 25} ${y}`; return d; };
    const t1 = sub(intro); t1.rect(-150, 40, 300, 112, { rx: 14, fill: C.fill, sw: 3.4 }); t1.path(drips(-150, 150, 62), { sw: 3 });
    t1.line(-150, 122, 150, 122, SOFT(2.2));
    const t2 = sub(intro); t2.rect(-100, -50, 200, 92, { rx: 12, fill: C.fill, sw: 3.4 }); t2.path(drips(-100, 100, -30), { sw: 3 });
    [[-54, -62], [52, -62]].forEach(([x, y]) => { t2.circle(x, y, 13, { fill: C.fill, sw: 3 }); t2.path(`M ${x} ${y - 13} Q ${x + 4} ${y - 24} ${x + 12} ${y - 28}`, { sw: 2.4 }); });
    const cd = sub(intro); cd.rect(-10, -128, 20, 80, { rx: 4, fill: C.fill, sw: 3 }); [-112, -88, -64].forEach(y => cd.line(-10, y, 10, y - 12, SOFT(2))); cd.line(0, -128, 0, -138, { sw: 2.6 });
    const fO = sub(cd), fl = sub(fO); fl.path(DROP(0, -153, 13), { fill: C.fill, sw: 3 }); fl.path(DROP(0, -146, 6), { fill: C.ink, sw: 1 });
    on(fl, p, .9, { loop: .9, ox: 0, oy: -136, sx: [[0, 1], [.15, .86, 'io'], [.3, 1.06, 'io'], [.45, .9, 'io'], [.6, 1.04, 'io'], [.9, 1, 'io']], sy: [[0, 1], [.15, 1.12, 'io'], [.3, .94, 'io'], [.45, 1.08, 'io'], [.6, .96, 'io'], [.9, 1, 'io']], r: [[0, 0], [.2, -5, 'io'], [.5, 4, 'io'], [.9, 0, 'io']] });
    on(fO, p, .65, { ox: 0, oy: -136, s: [[0, 0], [.25, 1.3, 'out'], [.4, 1]], o: [[0, 0], [.05, 1]] });
    [[t1, 0], [t2, .15], [cd, .3]].forEach(([g, a]) => on(g, p, a, { y: [[0, -200], [.32, 0, 'in'], [.4, 4], [.5, 0, 'soft']], o: [[0, 0], [.08, 1]] }));
  });

  /* candy — the wrapped sweet twists: its stripes roll round the body, the wrapper ends flap in turn, the whole sweet wobbles */
  rig('candy-pro', .6, 'spin', p => {
    const intro = sub(p), wb = sub(intro), cg = wb.child({ transform: 'rotate(-15)' });
    [[-1, 0], [1, .4]].forEach(([sd, d]) => { const e = sub(cg); e.path(`M ${sd * 84} -24 L ${sd * 176} -76 Q ${sd * 196} 0 ${sd * 176} 76 L ${sd * 84} 24 Z`, { fill: C.fill, sw: 3.2 });
      e.line(sd * 98, -10, sd * 170, -34, SOFT(2)); e.line(sd * 98, 10, sd * 170, 34, SOFT(2));
      on(e, p, .7, { loop: .8, ox: sd * 84, oy: 0, sx: [[0, 1], [d, 1], [d + .2, .78, 'io'], [d + .4, 1, 'io']] }); });
    cg.ellipse(0, 0, 92, 66, { fill: C.fill, sw: 3.4 });
    const cl = sub(cg, { 'clip-path': clip(cg, 'M -89 0 A 89 63 0 1 0 89 0 A 89 63 0 1 0 -89 0 Z') }), sl = sub(cl);
    for (let x = -240; x <= 200; x += 48) sl.line(x, -80, x + 60, 80, { sw: 9, stroke: C.soft });
    on(sl, p, .7, { loop: .8, x: [[0, 0], [.8, 48, 'lin']] });
    cg.ellipse(0, 0, 92, 66, { sw: 3.4 }); [-1, 1].forEach(sd => cg.rect(sd * 92 - 7, -16, 14, 32, { rx: 5, fill: C.fill, sw: 2.8 }));
    on(wb, p, .7, { loop: 2.4, r: [[0, 0], [.6, 6, 'io'], [1.8, -6, 'io'], [2.4, 0, 'io']] });
    on(intro, p, 0, { s: [[0, .3], [.5, 1.06, 'out'], [.65, 1]], r: [[0, 90], [.6, 0, 'out']], o: [[0, 0], [.15, 1]] });
  });

  /* carrot — pulled up out of the ground; it hops with a squash, the leafy top whips after it (follow-through) */
  rig('carrot-pro', .6, 'sink', p => {
    const intro = sub(p), hp = sub(intro), cr = hp.child({ transform: 'translate(10 10) rotate(30)' });
    /* leaves: blade + a midrib that runs down its centre (the average of the blade's two edges), stopping short of the tip */
    [['M 0 -104 C -30 -130, -60 -170, -46 -196 C -20 -180, -8 -140, 0 -104 Z', 'M -4 -118 C -19 -135, -37 -168, -42 -184', .06],
     ['M 0 -104 C -6 -150, 0 -190, 14 -204 C 28 -180, 18 -140, 0 -104 Z', 'M 2 -118 C 6 -145, 12 -178, 13 -192', 0],
     ['M 0 -104 C 30 -130, 64 -160, 70 -188 C 40 -180, 14 -140, 0 -104 Z', 'M 4 -116 C 22 -135, 48 -166, 60 -178', .1]].forEach(([d, rib, l]) => {
      const g = sub(cr); g.path(d, { fill: C.fill, sw: 3 }); g.path(rib, SOFT(1.6));
      on(g, p, .7, { loop: 2.4, ox: 0, oy: -104, r: [[0, 0], [.18 + l, 6, 'io'], [.42 + l, -12, 'out'], [.62 + l, 8, 'io'], [.8 + l, -3, 'io'], [1 + l, 0, 'soft']] }); });
    /* edges of the root: x at height y (left / right). Ring marks start just INSIDE the edge and curve inward — nothing crosses the outline */
    const eL = y => f1(-64 + (y + 70) * 56 / 220 + 8), eR = y => f1(64 - (y + 70) * 56 / 220 - 8);
    cr.path('M -60 -100 Q 0 -120 60 -100 Q 70 -90 64 -70 L 8 150 Q 0 166 -8 150 L -64 -70 Q -70 -90 -60 -100 Z', { fill: C.fill, sw: 3.4 });
    [[-40, -1, 26], [4, 1, 24], [52, -1, 20], [104, 1, 14]].forEach(([y, sd, w]) => { const x = sd < 0 ? eL(y) : eR(y);
      cr.path(`M ${x} ${y} Q ${f1(x - sd * w * .5)} ${y + 5} ${f1(x - sd * w)} ${y + 2}`, SOFT(2.4)); });
    on(hp, p, .7, { loop: 2.4, ox: 0, oy: 150, y: [[0, 0], [.18, 0], [.36, -34, 'out'], [.54, 0, 'in']], sy: [[0, 1], [.18, .9, 'io'], [.32, 1.06, 'out'], [.54, 1], [.6, .92, 'out'], [.74, 1.02], [.86, 1, 'soft']] });
    rise(p, intro, 0, 170);
  });

  /* chef-hat — hops: the band lands first and squashes, the puffy top keeps going and settles a moment later (follow-through) */
  rig('chef-hat-pro', .6, 'rise', p => {
    const intro = sub(p), hp = sub(intro);
    const pf = sub(hp);
    pf.path('M -110 64 C -170 50, -186 -40, -128 -70 C -138 -150, -40 -170, 0 -120 C 40 -170, 138 -150, 128 -70 C 186 -40, 170 50, 110 64 Z', { fill: C.fill, sw: 3.4 });
    [['M -50 60 Q -56 4 -72 -38'], ['M 0 60 L 0 -64'], ['M 50 60 Q 56 4 72 -38'], ['M 0 -120 Q 6 -104 0 -90'], ['M -128 -70 Q -112 -64 -104 -50'], ['M 128 -70 Q 112 -64 104 -50']].forEach(([d]) => pf.path(d, SOFT(2)));
    on(pf, p, .7, { loop: 2.4, ox: 0, oy: 60, sy: [[0, 1], [.24, .94, 'io'], [.42, 1.08, 'out'], [.62, 1.04], [.7, .88, 'out'], [.86, 1.04], [1, 1, 'soft']] });
    hp.rect(-112, 56, 224, 96, { rx: 12, fill: C.fill, sw: 3.4 }); hp.line(-112, 80, 112, 80, SOFT(2));
    on(hp, p, .7, { loop: 2.4, ox: 0, oy: 152, y: [[0, 0], [.2, 0], [.4, -34, 'out'], [.6, 0, 'in']], sy: [[0, 1], [.2, .92, 'io'], [.34, 1.03, 'out'], [.6, 1], [.66, .92, 'out'], [.8, 1.02], [.92, 1, 'soft']] });
    thud(p, intro, 152);
  });

  /* cherry — the pair swings from the joined stem like two pendulums out of step, the leaf flutters on top */
  rig('cherry-pro', .7, 'rise', p => {
    const intro = sub(p), J = [30, -150];
    [[-84, 86, 62, 'M 30 -150 Q -30 -100 -76 26', 0], [76, 104, 58, 'M 30 -150 Q 50 -60 72 48', .5]].forEach(([x, y, r, st, ph]) => { const g = sub(intro);
      g.path(st, { sw: 4.4 }); g.circle(x, y, r, { fill: C.fill, sw: 3.4 }); g.path(`M ${x - 14} ${y - r + 8} Q ${x} ${y - r + 16} ${x + 12} ${y - r + 6}`, SOFT(2.2));
      const A = ph ? -1 : 1; on(g, p, .7, { loop: 2.8, ox: J[0], oy: J[1], r: [[0, 0], [.7, A * 5, 'io'], [1.4, -A * 4, 'io'], [2.1, A * 2.5, 'io'], [2.8, 0, 'io']] }); });
    const lf = sub(intro); lf.path('M 30 -150 C 70 -190, 140 -184, 160 -150 C 120 -124, 70 -124, 30 -150 Z', { fill: C.fill, sw: 3 }); lf.path('M 42 -150 Q 100 -160 150 -150', SOFT(1.8)); lf.line(84, -155, 96, -172, SOFT(1.6)); lf.line(112, -155, 124, -170, SOFT(1.6)); lf.line(96, -154, 106, -138, SOFT(1.6));
    on(lf, p, .7, { loop: 1.4, ox: J[0], oy: J[1], r: [[0, 0], [.35, -6, 'io'], [1.05, 4, 'io'], [1.4, 0, 'io']] });
    intro.line(J[0], J[1], J[0] - 6, J[1] - 20, { sw: 4.4 }); intro.rect(J[0] - 7, J[1] - 7, 14, 14, { rx: 4, fill: C.fill, sw: 3 });
    on(intro, p, 0, { ox: J[0], oy: J[1], y: [[0, -160], [.45, 0, 'back']], r: [[0, 0], [.4, 0], [.5, 6, 'out'], [.7, -3, 'io'], [.9, 0, 'soft']], o: [[0, 0], [.15, 1]] });
  });

  Object.assign(G.icons, R);
  const names = ['wand-sparkles', 'apple', 'battery-charging', 'battery-full', 'bed', 'bed-double', 'bike', 'cigarette-off', 'glass-water', 'pill',
    'stethoscope', 'thermometer', 'zap-off', 'banana', 'beef', 'cake', 'candy', 'carrot', 'chef-hat', 'cherry'];
  const ALIAS = Object.fromEntries(names.map(n => [n, n + '-pro'])); Object.assign(ALIAS, { bicycle: 'bike-pro', 'no-smoking': 'cigarette-off-pro' });
  for (const [a, pro] of Object.entries(ALIAS)) { if (G.icons[a] && !G.icons[a + '-basic'] && !G.icons[a].custom) G.icons[a + '-basic'] = G.icons[a]; G.icons[a] = R[pro]; }
  G.PRO15 = names.map(n => n + '-pro');
})();
