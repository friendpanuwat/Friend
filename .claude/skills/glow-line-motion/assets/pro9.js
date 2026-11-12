/* pro9.js — pro icon batch 9: CutPack priority-2 names, the last 12.
   Detail level = pro.js (one soft inner outline, bands/bases, ticks, the key part brighter) within style.md §0 rules
   (no glints, no decorative sparkles, no buttons/seams/tiny text). Motion = pro.js principles: anticipation, overshoot + settle,
   follow-through, secondary motion; entrance + loop + exit (3rd argument of rig). Entrance and loop sit on separate groups. */
(function () {
  const G = window.GL, C = G.C, P = G.parts;
  const sub = (p, attrs) => p.child(attrs || {});
  const on = (q, p, start, spec) => G.kf(q.g || q, p.t0 + start * p.ts, spec);
  const pop = (p, q, at = 0, from = .4) => on(q, p, at, { s: [[0, from], [.42, 1.08, 'out'], [.62, 1]], o: [[0, 0], [.16, 1]] });
  const drop = (p, q, at = 0, dy = -90) => on(q, p, at, { y: [[0, dy], [.55, 0, 'back']], o: [[0, 0], [.2, 1]] });
  const rise = (p, q, at = 0, dy = 150) => on(q, p, at, { y: [[0, dy], [.55, 0, 'back']], o: [[0, 0], [.15, 1]] });
  const grow = (p, q, at, oy) => on(q, p, at, { ox: 0, oy, sy: [[0, 0], [.45, 1.05, 'out'], [.6, 1]], o: [[0, 0], [.05, 1]] });
  const thud = (p, q, oy, dy = -220) => on(q, p, 0, { ox: 0, oy, y: [[0, dy], [.42, 0, 'in']], sy: [[.42, .86], [.56, 1.06, 'out'], [.7, 1]], sx: [[.42, 1.1], [.56, .97, 'out'], [.7, 1]], o: [[0, 0], [.1, 1]] });
  const show = (p, q) => on(q, p, 0, { o: [[0, 0], [.01, 1]] });
  const flash = (a, b) => [[0, 0], [a, 0], [a + .02, 1], [b, 0]];
  const STAR5 = (cx, cy, R, r) => { const a = []; for (let i = 0; i < 10; i++) { const t = -Math.PI / 2 + i * Math.PI / 5, d = i % 2 ? r : R; a.push([+(cx + Math.cos(t) * d).toFixed(1), +(cy + Math.sin(t) * d).toFixed(1)]); } return a; };
  const R = {}, rig = (name, dur, exit, fn) => { fn.custom = true; fn.dur = dur; fn.exit = exit; R[name] = fn; };

  /* dumbbell — thuds down; squats (anticipation), heaves up with a tilt, the plates clank behind (follow-through), lands with a squash */
  rig('dumbbell-pro', .7, 'rise', p => {
    const intro = sub(p), dO = sub(intro), db = sub(dO); show(p, intro);
    P.capsule(db, -116, 0, 116, 0, 13, { sw: 3 });
    [-1, 1].forEach(sd => db.line(sd * 20, -12, sd * 20, 12, { sw: 2, stroke: C.soft }));
    [-1, 1].forEach(sd => { const pl = sub(db);
      pl.rect(sd > 0 ? 160 : -176, -30, 16, 60, { rx: 6, fill: C.fill, sw: 2.6 });
      pl.rect(sd > 0 ? 136 : -162, -54, 26, 108, { rx: 8, fill: C.fill, sw: 3 });
      pl.rect(sd > 0 ? 100 : -142, -76, 42, 152, { rx: 10, fill: C.fill, sw: 3.4 }); pl.line(sd * 121, -60, sd * 121, 60, { sw: 1.8, stroke: C.soft });
      on(pl, p, .7, { loop: 2.4, ox: sd * 121, oy: 0, r: [[0, 0], [.55, 0], [.66, sd * 4, 'out'], [.8, -sd * 2.5, 'io'], [.94, sd * 1, 'io'], [1.05, 0, 'soft'], [1.5, 0], [1.56, -sd * 3, 'out'], [1.7, sd * 1.5], [1.82, 0, 'soft']] }); });
    on(db, p, .7, { loop: 2.4, ox: 0, oy: 76, y: [[0, 0], [.2, 0], [.32, 8, 'out'], [.62, -60, 'out'], [1.2, -60], [1.5, 0, 'in']], r: [[0, 0], [.32, 0], [.62, -6, 'out'], [1.2, -6], [1.5, 0, 'in']],
      sy: [[0, 1], [.2, 1], [.32, .92, 'out'], [.45, 1.03], [.6, 1], [1.5, 1], [1.56, .9, 'out'], [1.68, 1.03], [1.82, 1, 'soft']] });
    const du = sub(intro); [-1, 1].forEach(sd => { du.line(sd * 150, 96, sd * 186, 88, { sw: 3 }); du.line(sd * 140, 112, sd * 170, 120, { sw: 2.6, stroke: C.soft }); });
    on(du, p, .7, { loop: 2.4, o: flash(1.5, 1.8) });
    thud(p, dO, 76, -200);
  });

  /* salad — a bowl with leaves and tomatoes; the bowl dips (anticipation) and tosses the salad, pieces land with a squash */
  const LEAF = (x, y, a, s) => `M ${x} ${y} C ${x - 40 * s} ${y - 30 * s}, ${x - 30 * s} ${y - 90 * s}, ${x} ${y - 110 * s} C ${x + 30 * s} ${y - 90 * s}, ${x + 40 * s} ${y - 30 * s}, ${x} ${y} Z`;
  rig('salad-pro', .8, 'squash', p => {
    const intro = sub(p), bO = sub(intro), bw = sub(bO); show(p, intro);
    const items = [];
    [[-112, 4, -24, 1], [-40, 0, -6, 1.15], [34, 2, 10, 1.1], [104, 4, 26, .95]].forEach(([x, y, a, s], i) => { const lf = sub(bw), q = lf.child({ transform: `rotate(${a} ${x} ${y})` });
      q.path(LEAF(x, y, a, s), { fill: C.fill, sw: 3 }); q.line(x, y - 6, x, y - 96 * s, { sw: 2, stroke: C.soft }); items.push([lf, x, y, i]); });
    [[-72, -14, 22], [64, -22, 20], [0, -30, 18]].forEach(([x, y, r], i) => { const tm = sub(bw); tm.circle(x, y, r, { fill: C.fill, sw: 3 }); tm.line(x - 6, y - r + 4, x + 6, y - r + 4, { sw: 2.4 }); items.push([tm, x, y, i + 4]); });
    items.forEach(([q, x, y, i]) => on(q, p, .8, { loop: 2.6, ox: x, oy: y, y: [[0, 0], [.4, 0], [.62 + i * .015, -46 - (i % 3) * 10, 'out'], [.95 + i * .02, 0, 'in']], r: [[0, 0], [.4, 0], [.95, (i % 2 ? 1 : -1) * 12, 'io'], [1.2, 0, 'soft']] }));
    bw.rect(-182, -6, 364, 24, { rx: 12, fill: C.fill, sw: 3.2 });
    bw.path('M -172 18 L 172 18 C 166 110, 92 156, 0 156 C -92 156, -166 110, -172 18 Z', { fill: C.fill, sw: 3.4 });
    bw.path('M -150 52 C -120 96, -70 122, 0 126', { sw: 1.8, stroke: C.soft });
    bw.rect(-56, 152, 112, 20, { rx: 8, fill: C.fill, sw: 3 });
    on(bw, p, .8, { loop: 2.6, ox: 0, oy: 172, y: [[0, 0], [.28, 10, 'out'], [.44, -12, 'out'], [.62, 0, 'soft'], [.95, 0], [1.02, 4, 'out'], [1.2, 0, 'soft']],
      sy: [[0, 1], [.28, .93, 'out'], [.44, 1.04], [.62, 1], [.95, 1], [1.02, .95, 'out'], [1.2, 1, 'soft']] });
    thud(p, bO, 172, -200);
  });

  /* building-2 — an office tower with a low wing; they rise one after the other, then an elevator light climbs the floors and comes back down */
  rig('building-2-pro', .9, 'squash', p => {
    const intro = sub(p);
    const gd = intro.line(-186, 171, 186, 171, { sw: 2.6, stroke: C.soft }); on(gd, p, 0, { draw: [[0, 0], [.35, 1, 'out']] });
    const wO = sub(intro), wg = sub(wO);
    wg.rect(-160, -30, 120, 200, { rx: 10, fill: C.fill, sw: 3.2 }); wg.rect(-166, -38, 132, 16, { rx: 6, fill: C.fill, sw: 2.6 });
    for (const y of [10, 66, 122]) for (const x of [-138, -94]) wg.rect(x, y, 30, 26, { rx: 4, fill: C.fill, sw: 2.4 });
    grow(p, wO, .05, 170);
    const tO = sub(intro), tw = sub(tO);
    tw.line(100, -176, 100, -196, { sw: 3 }); const al = sub(tw); al.circle(100, -198, 6, { fill: C.ink, sw: 1 });
    on(al, p, .9, { loop: 1.2, ox: 100, oy: -198, o: [[0, 1], [.1, 1], [.14, .2], [1.1, .2], [1.14, 1]], s: [[0, 1.3], [.12, 1], [1.12, 1.3]] });
    tw.rect(-30, -164, 170, 334, { rx: 12, fill: C.fill, sw: 3.4 }); tw.rect(-38, -176, 186, 20, { rx: 6, fill: C.fill, sw: 3 });
    tw.line(56, -150, 56, 100, { sw: 1.8, stroke: C.soft });
    const floors = [-130, -80, -30, 20, 70];
    floors.forEach(y => [-6, 86].forEach(x => tw.rect(x, y, 34, 30, { rx: 4, fill: C.fill, sw: 2.4 })));
    floors.forEach((y, i) => { const lt = sub(tw); [-6, 86].forEach(x => lt.rect(x + 6, y + 6, 22, 18, { rx: 3, fill: C.soft, stroke: C.soft, sw: 1 }));
      const k = floors.length - 1 - i, up = .25 + k * .22, dn = 1.65 + i * .18;
      on(lt, p, .9, { loop: 3, o: [[0, 0], [up, 0], [up + .03, 1], [up + .3, .25], [dn, .25], [dn + .03, 1], [dn + .3, 0]] }); });
    tw.rect(28, 118, 56, 52, { rx: 6, fill: C.fill, sw: 2.8 }); tw.line(56, 120, 56, 168, { sw: 2.2 });
    grow(p, tO, .2, 170);
  });

  /* clipboard-list — the board rises in; the clip snaps, then the three items get ticked one by one, hold, and clear */
  rig('clipboard-list-pro', .7, 'sink', p => {
    const intro = sub(p), bO = sub(intro), bd = sub(bO);
    bd.rect(-130, -150, 260, 326, { rx: 18, fill: C.fill, sw: 3.4 }); bd.rect(-108, -112, 216, 268, { rx: 8, sw: 1.8, stroke: C.soft });
    const rows = [-60, 10, 80];
    rows.forEach((y, i) => { bd.rect(-82, y - 18, 36, 36, { rx: 6, fill: C.fill, sw: 2.8 });
      const ln = bd.line(-24, y, i === 2 ? 46 : 82, y, { sw: 5, stroke: C.soft });
      const ck = bd.poly([[-76, y - 2], [-66, y + 10], [-44, y - 18]], { sw: 6 });
      const t = .3 + i * .4;
      on(ck, p, .7, { loop: 3, draw: [[0, 0], [t, 0], [t + .2, 1, 'out'], [2.4, 1], [2.6, 0, 'in']] });
      on(ln, p, .7, { loop: 3, o: [[0, 1], [t + .15, 1], [t + .25, .45], [2.4, .45], [2.6, 1]] }); });
    const cO = sub(bd), cl = sub(cO);
    cl.rect(-58, -178, 116, 48, { rx: 12, fill: C.fill, sw: 3.2 }); cl.circle(0, -162, 9, { fill: C.fill, sw: 2.6 });
    on(cl, p, .7, { loop: 3, ox: 0, oy: -130, y: [[0, 0], [.08, -8, 'out'], [.18, 0, 'in']], sy: [[0, 1], [.18, 1], [.22, .9, 'out'], [.34, 1, 'soft']] });
    on(bd, p, .7, { loop: 3, ox: 0, oy: 176, r: [[0, 0], [.18, 0], [.24, -1.5, 'out'], [.4, 1, 'io'], [.55, 0, 'soft']] });
    rise(p, bO, 0, 170);
  });

  /* gem — a cut diamond spins in; it floats, turns on its axis (squash through the edge-on moment) and settles */
  rig('gem-pro', .7, 'spin', p => {
    const intro = sub(p), fO = sub(intro), gm = sub(fO), cut = sub(gm);
    cut.shape([[-72, -112], [72, -112], [154, -40], [0, 152], [-154, -40]], { fill: C.fill, sw: 3.4 });
    cut.line(-154, -40, 154, -40, { sw: 2.6 });
    [[-72, -112, -46, -40], [72, -112, 46, -40], [0, -112, -46, -40], [0, -112, 46, -40]].forEach(([a, b, c, d]) => cut.line(a, b, c, d, { sw: 2, stroke: C.soft }));
    [[-46, -40], [46, -40]].forEach(([x, y]) => cut.line(x, y, 0, 152, { sw: 2, stroke: C.soft }));
    cut.line(-110, -40, -30, 92, { sw: 1.8, stroke: C.soft }); cut.line(110, -40, 30, 92, { sw: 1.8, stroke: C.soft });
    on(cut, p, .7, { loop: 3.2, ox: 0, oy: 0, sx: [[0, 1], [1.6, 1], [1.85, .08, 'in'], [2.1, 1, 'out'], [2.25, .96], [2.4, 1, 'soft']], sy: [[0, 1], [1.85, 1], [1.95, 1.05], [2.15, 1, 'soft']] });
    on(gm, p, .7, { loop: 3.2, y: [[0, 0], [.8, -12, 'soft'], [1.6, 0, 'soft'], [2.4, -12, 'soft'], [3.2, 0, 'soft']] });
    const sh = sub(intro); sh.ellipse(0, 178, 84, 10, { sw: 2.2, stroke: C.soft });
    on(sh, p, .7, { loop: 3.2, ox: 0, oy: 178, s: [[0, 1], [.8, .85, 'soft'], [1.6, 1, 'soft'], [2.4, .85, 'soft'], [3.2, 1, 'soft']] });
    on(fO, p, 0, { s: [[0, .3], [.45, 1.08, 'out'], [.62, 1]], r: [[0, -160], [.55, 0, 'out']], o: [[0, 0], [.15, 1]] });
    show(p, intro);
  });

  /* scale — a balance: the beam tips one way, swings back and settles (damped), the pans hang level and follow their ends */
  rig('scale-pro', .7, 'pop', p => {
    const intro = sub(p);
    intro.rect(-80, 156, 160, 20, { rx: 8, fill: C.fill, sw: 3.2 }); intro.rect(-40, 138, 80, 20, { rx: 6, fill: C.fill, sw: 2.8 });
    intro.rect(-11, -126, 22, 266, { rx: 8, fill: C.fill, sw: 3 });
    const T = [[0, 0], [.25, 0], [.5, -9, 'out'], [.9, 6.5, 'io'], [1.25, -3.6, 'io'], [1.55, 1.6, 'io'], [1.8, 0, 'soft'], [3, 0]];
    const L = 120, rad = d => d * Math.PI / 180;
    [-1, 1].forEach(sd => { const pn = sub(intro), x = sd * L;
      pn.line(x, -128, x - 50, -30, { sw: 2.2, stroke: C.soft }); pn.line(x, -128, x + 50, -30, { sw: 2.2, stroke: C.soft });
      pn.path(`M ${x - 58} -30 L ${x + 58} -30 Q ${x + 52} 14 ${x} 16 Q ${x - 52} 14 ${x - 58} -30 Z`, { fill: C.fill, sw: 3.2 });
      on(pn, p, .7, { loop: 3, y: T.map(([t, v, e]) => [t, +(sd * L * Math.sin(rad(v))).toFixed(2), e]), x: T.map(([t, v, e]) => [t, +(sd * L * (Math.cos(rad(v)) - 1)).toFixed(2), e]) }); });
    const bm = sub(intro); bm.rect(-136, -136, 272, 16, { rx: 8, fill: C.fill, sw: 3 }); [-1, 1].forEach(sd => bm.circle(sd * L, -128, 6, { fill: C.fill, sw: 2.4 }));
    bm.circle(0, -128, 18, { fill: C.fill, sw: 3 }); bm.dot(0, -128, 5);
    on(bm, p, .7, { loop: 3, ox: 0, oy: -128, r: T });
    const tp = sub(intro); tp.shape([[0, -166], [12, -146], [-12, -146]], { fill: C.fill, sw: 2.6 });
    pop(p, intro);
  });

  /* shopping-cart — rolls in, wheels spinning; a parcel drops into the basket, the cart dips under the weight and springs back */
  rig('shopping-cart-pro', .7, 'slide', p => {
    const intro = sub(p), cO = sub(intro), ct = sub(cO);
    const pk = sub(ct); pk.rect(-16, -134, 92, 72, { rx: 6, fill: C.fill, sw: 3 }); pk.line(30, -134, 30, -62, { sw: 4, stroke: C.soft });
    on(pk, p, .7, { loop: 2.6, ox: 30, oy: -62, y: [[0, -60], [.3, -60], [.62, 0, 'in'], [.7, -10, 'out'], [.8, 0, 'in'], [2.1, 0], [2.3, -40, 'in']],
      r: [[0, -20], [.3, -20], [.62, 0, 'in']], o: [[0, 0], [.3, 0], [.36, 1], [2.1, 1], [2.3, 0]] });
    ct.path('M -186 -140 L -150 -140 Q -138 -140 -136 -128 L -104 60 Q -102 72 -88 72 L 150 72', { sw: 6 });
    ct.shape([[-140, -100], [176, -100], [146, 30], [-118, 30]], { fill: C.fill, sw: 3.4 });
    [-70, 0, 70].forEach(x => ct.line(x, -98, x - 6 * (x / 70 + 1) + 6, 28, { sw: 1.8, stroke: C.soft })); ct.line(-130, -36, 160, -36, { sw: 1.8, stroke: C.soft });
    [[-60, 118], [110, 118]].forEach(([x, y]) => { ct.line(x, 72, x, y - 20, { sw: 3 }); const wO = sub(ct), wh = sub(wO); wh.circle(x, y, 20, { fill: C.fill, sw: 3.2 }); wh.line(x, y - 12, x, y + 12, { sw: 2.4 }); wh.dot(x, y, 4);
      on(wO, p, 0, { ox: x, oy: y, r: [[0, -540], [.6, 0, 'out']] });
      on(wh, p, .7, { loop: 2.6, ox: x, oy: y, r: [[0, 0], [.62, 0], [.75, 20, 'out'], [.95, 0, 'soft']] }); });
    on(ct, p, .7, { loop: 2.6, ox: 0, oy: 138, y: [[0, 0], [.62, 0], [.7, 8, 'out'], [.86, -3], [1, 0, 'soft']], sy: [[0, 1], [.62, 1], [.7, .96, 'out'], [.86, 1.02], [1, 1, 'soft']] });
    on(cO, p, 0, { x: [[0, -260], [.6, 0, 'out']], o: [[0, 0], [.15, 1]] });
  });

  /* signature — a pen signs a looping signature over the "sign here" line, lifts, and the ink fades for the next signing */
  rig('signature-pro', .6, 'pop', p => {
    const intro = sub(p); show(p, intro);
    const bl = intro.line(-176, 110, 120, 110, { sw: 2.6, stroke: C.soft }); on(bl, p, 0, { draw: [[0, 0], [.35, 1, 'out']] });
    const xm = sub(intro); xm.line(-176, 60, -150, 86, { sw: 4 }); xm.line(-150, 60, -176, 86, { sw: 4 }); pop(p, xm, .15);
    const sig = intro.path('M -126 76 C -110 -30, -66 -50, -78 20 C -84 60, -38 70, -18 6 C -8 -24, 12 -22, 12 18 C 12 48, 40 40, 50 10 C 58 -10, 74 -10, 80 18 C 86 40, 104 34, 112 10', { sw: 5.4 });
    const T = 1.6, n = 28, Ls = sig.getTotalLength(), xs = [], ys = [];
    for (let i = 0; i <= n; i++) { const pt = sig.getPointAtLength(Ls * i / n), t = +(T * i / n).toFixed(3); xs.push([t, +pt.x.toFixed(1), 'lin']); ys.push([t, +pt.y.toFixed(1), 'lin']); }
    on(sig, p, .6, { loop: 3, draw: [[0, 0], [.2, 0], ...xs.map(([t]) => [t + .2, t / T, 'lin']), [2.5, 1], [2.85, 1]], o: [[0, 0], [.2, 0], [.22, 1], [2.5, 1], [2.85, 0], [3, 0]] });
    const pO = sub(intro), pn = sub(pO), pg = pn.child({ transform: 'rotate(38) scale(.72)' }, .72);
    pg.rect(-20, -224, 40, 168, { rx: 12, fill: C.fill, sw: 3.2 }); pg.line(-20, -170, 20, -170, { sw: 2.4 });
    pg.path('M -20 -58 L 0 0 L 20 -58 Z', { fill: C.fill, sw: 3 }); pg.dot(0, -10, 4);
    const sx = xs[0][1], sy = ys[0][1];
    on(pn, p, .6, { loop: 3, x: [[0, sx + 20], [.2, sx, 'out'], ...xs.map(([t, v]) => [t + .2, v, 'lin']), [2.0, xs[n][1] + 14, 'out'], [2.85, sx + 20, 'io']],
      y: [[0, sy - 30], [.2, sy, 'out'], ...ys.map(([t, v]) => [t + .2, v, 'lin']), [2.0, ys[n][1] - 30, 'out'], [2.85, sy - 30, 'io']] });
    pop(p, pO, .1);
  });

  /* tags — two price tags hang on their strings; they swing in, sway, and the back one lags behind the front one */
  const TAG = 'M 0 -132 L 72 -64 L 72 122 Q 72 140 54 140 L -54 140 Q -72 140 -72 122 L -72 -64 Z';
  rig('tags-pro', .6, 'rise', p => {
    const intro = sub(p);
    const hang = (x, a, sc, front, lag) => { const sw = sub(intro), q = sw.child({ transform: `translate(${x} 0) rotate(${a} 0 -150) scale(${sc})` }, sc);
      q.path('M 0 -196 C 14 -170, -14 -150, 0 -132', { sw: 2.2, stroke: C.soft });
      q.path(TAG, { fill: C.fill, sw: front ? 3.2 : 2.8, stroke: front ? C.ink : C.soft }); q.circle(0, -90, 12, { fill: C.fill, sw: 2.6 });
      q.path('M -54 -64 L 0 -116 L 54 -64', { sw: 1.8, stroke: C.soft });
      if (front) { q.circle(-24, 6, 13, { sw: 2.6 }); q.circle(24, 56, 13, { sw: 2.6 }); q.line(28, -6, -28, 68, { sw: 2.8 }); }
      else [-10, 30, 70].forEach((y, i) => q.line(-40, y, i === 2 ? 10 : 40, y, { sw: 4, stroke: C.soft }));
      on(sw, p, .6 + lag, { loop: 3.2, ox: x, oy: -196 * sc, r: [[0, 0], [.2, 10, 'out'], [.5, -8, 'io'], [.8, 5, 'io'], [1.1, -2.5, 'io'], [1.4, 0, 'soft'], [3.2, 0]] }); return sw; };
    hang(40, 14, .9, false, .12);
    hang(-36, -6, 1, true, 0);
    drop(p, intro, 0, -110);
  });

  /* calendar-days — a month grid; the highlighted day hops forward one square at a time, the page flips at the end of the row */
  rig('calendar-days-pro', .6, 'pop', p => {
    const intro = sub(p), pg = sub(intro);
    pg.rect(-164, -136, 328, 300, { rx: 20, fill: C.fill, sw: 3.4 }); pg.rect(-164, -136, 328, 62, { rx: 20, fill: C.fill, sw: 3.4 });
    pg.line(-164, -84, 164, -84, { sw: 3 }); pg.line(-120, -110, 120, -110, { sw: 4, stroke: C.soft });
    const cx = c => -128 + c * 64, cy = r => -50 + r * 52;
    for (let r = 0; r < 4; r++) for (let c = 0; c < 5; c++) pg.rect(cx(c) - 20, cy(r) - 18, 40, 36, { rx: 6, sw: 2, stroke: C.soft });
    const hl = sub(pg), hq = sub(hl); hq.rect(cx(0) - 22, cy(1) - 20, 44, 40, { rx: 7, fill: C.ink, sw: 2 });
    const xs = [[0, 0]]; for (let i = 1; i <= 4; i++) { xs.push([i * .55 - .25, (i - 1) * 64]); xs.push([i * .55, i * 64, 'back']); }
    on(hl, p, .6, { loop: 2.8, x: [...xs, [2.6, 4 * 64], [2.8, 0, 'io']], o: [[0, 1], [2.5, 1], [2.6, 0], [2.75, 0], [2.8, 1]] });
    on(hq, p, .6, { loop: .55, ox: cx(0), oy: cy(1), s: [[0, 1], [.3, 1], [.36, .82, 'out'], [.5, 1.06, 'out'], [.55, 1]] });
    [-1, 1].forEach(sd => P.capsule(intro, sd * 90, -158, sd * 90, -112, 11, { sw: 2.8 }));
    pop(p, intro);
  });

  /* clock face shared by clock / history */
  const face = (q, r = 122) => { q.circle(0, 0, r, { fill: C.fill, sw: 3.4 }); q.circle(0, 0, r - 14, { sw: 1.6, stroke: C.soft });
    for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6, l = i % 3 ? 12 : 22; q.line(Math.sin(a) * (r - 24), -Math.cos(a) * (r - 24), Math.sin(a) * (r - 24 - l), -Math.cos(a) * (r - 24 - l), { sw: i % 3 ? 2.4 : 3.4 }); } };
  const hands = (q, r = 122) => { const hr = sub(q); hr.line(0, 10, 0, -r * .45, { sw: 7 }); const mn = sub(q); mn.line(0, 14, 0, -r * .68, { sw: 4.6 }); return [hr, mn]; };

  /* clock — the second hand ticks (each tick overshoots and settles), the minute hand creeps, the hour hand barely moves */
  rig('clock-pro', .6, 'pop', p => {
    const intro = sub(p), ck = sub(intro);
    [-1, 1].forEach(sd => ck.line(sd * 66, 112, sd * 84, 140, { sw: 5 }));
    face(ck); const [hr, mn] = hands(ck);
    const sc = sub(ck); sc.line(0, 24, 0, -100, { sw: 1.8 }); sc.circle(0, -78, 5, { fill: C.fill, sw: 1.8 });
    ck.circle(0, 0, 10, { fill: C.fill, sw: 2.6 }); ck.dot(0, 0, 3.4);
    const tick = [[0, 0]]; for (let i = 0; i < 12; i++) { tick.push([i * .5 + .38, i * 30]); tick.push([i * .5 + .46, i * 30 + 32, 'out']); tick.push([i * .5 + .5, (i + 1) * 30, 'soft']); }
    on(sc, p, .6, { loop: 6, r: tick });
    on(mn, p, .6, { loop: 72, r: [[0, 60], [72, 420, 'lin']] }); on(hr, p, 0, { r: [[0, -50]] });
    on(intro, p, 0, { s: [[0, .4], [.45, 1.08, 'out'], [.65, 1]], o: [[0, 0], [.18, 1]] });
  });

  /* history — a counter-clockwise arrow wraps the clock; the hands rewind fast, overshoot back and settle, the arrow ring turns with them */
  rig('history-pro', .6, 'spin', p => {
    const intro = sub(p), rg = sub(intro), r = 160, e = -130 * Math.PI / 180;
    const ex = r * Math.cos(e), ey = r * Math.sin(e), d = [Math.sin(e), -Math.cos(e)], n = [-d[1], d[0]];
    rg.path(`M ${-r} 0 A ${r} ${r} 0 1 0 ${ex.toFixed(1)} ${ey.toFixed(1)}`, { sw: 6 });
    const tip = [ex + d[0] * 16, ey + d[1] * 16];
    rg.poly([[tip[0] - d[0] * 34 + n[0] * 24, tip[1] - d[1] * 34 + n[1] * 24], tip, [tip[0] - d[0] * 34 - n[0] * 24, tip[1] - d[1] * 34 - n[1] * 24]].map(([x, y]) => [+x.toFixed(1), +y.toFixed(1)]), { sw: 6 });
    const ck = sub(intro); face(ck, 118); const [hr, mn] = hands(ck, 118); ck.circle(0, 0, 10, { fill: C.fill, sw: 2.6 }); ck.dot(0, 0, 3.4);
    on(mn, p, .7, { loop: 3.2, r: [[0, 0], [.3, 0], [.4, 12, 'out'], [1.4, -720 - 18, 'io'], [1.6, -720 + 6, 'soft'], [1.75, -720, 'soft'], [3.2, -720]] });
    on(hr, p, .7, { loop: 3.2, r: [[0, 120], [.3, 120], [.4, 124, 'out'], [1.4, -240 - 6, 'io'], [1.6, -240 + 2, 'soft'], [1.75, -240, 'soft'], [3.2, -240]] });
    on(rg, p, .7, { loop: 3.2, r: [[0, 0], [.3, 0], [.4, 6, 'out'], [1.4, -50, 'io'], [1.6, -45, 'soft'], [3, -45], [3.2, 0, 'io']] });
    on(intro, p, 0, { s: [[0, .4], [.45, 1.08, 'out'], [.65, 1]], r: [[0, 90], [.55, 0, 'out']], o: [[0, 0], [.18, 1]] });
  });

  Object.assign(G.icons, R);
  const ALIAS = { dumbbell: 'dumbbell-pro', salad: 'salad-pro', 'building-2': 'building-2-pro', office: 'building-2-pro', 'clipboard-list': 'clipboard-list-pro', gem: 'gem-pro', diamond: 'gem-pro',
    scale: 'scale-pro', 'shopping-cart': 'shopping-cart-pro', cart: 'shopping-cart-pro', signature: 'signature-pro', tags: 'tags-pro', 'calendar-days': 'calendar-days-pro', clock: 'clock-pro', history: 'history-pro' };
  for (const [a, pro] of Object.entries(ALIAS)) { if (G.icons[a] && !G.icons[a + '-basic'] && !G.icons[a].custom) G.icons[a + '-basic'] = G.icons[a]; G.icons[a] = R[pro]; }
  G.PRO9 = Object.keys(R);
})();
