/* pro16.js — pro icon batch 16: CutPack priority-3 names 122–141 (food & drink, tech).
   Detail level = batch 15 (pro.js + the small extra details the user asked for, never cluttered), style.md §0 rules.
   Every inner mark is placed from the real outline and kept INSIDE it (user rule after the batch-15 carrot).
   Motion = anticipation, overshoot + settle, follow-through, secondary motion. Entrance and loop sit on separate groups. */
(function () {
  const G = window.GL, C = G.C;
  const sub = (p, attrs) => p.child(attrs || {});
  const on = (q, p, start, spec) => G.kf(q.g || q, p.t0 + start * p.ts, spec);
  const pop = (p, q, at = 0, from = .4) => on(q, p, at, { s: [[0, from], [.42, 1.08, 'out'], [.62, 1]], o: [[0, 0], [.16, 1]] });
  const drop = (p, q, at = 0, dy = -90) => on(q, p, at, { y: [[0, dy], [.55, 0, 'back']], o: [[0, 0], [.2, 1]] });
  const thud = (p, q, oy, dy = -220) => on(q, p, 0, { ox: 0, oy, y: [[0, dy], [.42, 0, 'in']], sy: [[.42, .86], [.56, 1.06, 'out'], [.7, 1]], sx: [[.42, 1.1], [.56, .97, 'out'], [.7, 1]], o: [[0, 0], [.1, 1]] });
  const grow = (p, q, at, oy, ox = 0) => on(q, p, at, { ox, oy, sy: [[0, 0], [.45, 1.06, 'out'], [.6, .98], [.72, 1, 'soft']], o: [[0, 0], [.05, 1]] });
  const show = (p, q) => on(q, p, 0, { o: [[0, 0], [.01, 1]] });
  const flash = (a, b) => [[0, 0], [a, 0], [a + .02, 1], [b, 0]];
  const shakeKeys = (n, amp, step = .05) => { const k = [[0, 0]]; for (let i = 1; i <= n; i++) k.push([i * step, i % 2 ? -amp : amp, 'lin']); k.push([(n + 1) * step, 0, 'out']); return k; };
  const at = (keys, t0) => keys.map(([t, v, e]) => [t + t0, v, e]);
  const tubes = (q, ds, w = 30) => { ds.forEach(d => q.path(d, { sw: w })); ds.forEach(d => q.path(d, { sw: w - 7, stroke: C.fill })); };
  const f1 = v => +v.toFixed(1), rad = d => d * Math.PI / 180;
  const pt = (r, a, cx = 0, cy = 0) => [f1(cx + Math.cos(rad(a)) * r), f1(cy + Math.sin(rad(a)) * r)];
  const SOFT = (w = 2) => ({ sw: w, stroke: C.soft });
  const DROP = (x, y, r) => `M ${x} ${y - r * 1.6} C ${x + r * .5} ${y - r * .8}, ${x + r} ${y - r * .2}, ${x + r} ${y + r * .3} A ${r} ${r} 0 0 1 ${x - r} ${y + r * .3} C ${x - r} ${y - r * .2}, ${x - r * .5} ${y - r * .8}, ${x} ${y - r * 1.6} Z`;
  let clipN = 0;
  const clip = (q, d) => { const NS = 'http://www.w3.org/2000/svg', id = 'gl16clip' + (++clipN), cp = document.createElementNS(NS, 'clipPath'), pa = document.createElementNS(NS, 'path');
    cp.setAttribute('id', id); pa.setAttribute('d', d); cp.appendChild(pa); q.g.appendChild(cp); return `url(#${id})`; };
  /* steam wisps: each draws itself up from (x, y0), rises a little and fades — loops every T */
  const steam = (q, p, xs, y0, h, start, T = 1.8) => xs.forEach((x, i) => { const g = sub(q), s = g.path(`M ${x} ${y0} C ${x - 16} ${y0 - h * .3}, ${x + 16} ${y0 - h * .6}, ${x} ${y0 - h}`, SOFT(3));
    on(s, p, start + i * T / xs.length, { loop: T, draw: [[0, 0], [T * .4, 1, 'out'], [T, 1]] });
    on(g, p, start + i * T / xs.length, { loop: T, y: [[0, 8], [T, -14, 'out']], o: [[0, 0], [T * .15, 1], [T * .6, 1], [T, 0]] }); });
  const R = {}, rig = (name, dur, exit, fn) => { fn.custom = true; fn.dur = dur; fn.exit = exit; R[name] = fn; };

  /* citrus — a half slice: it gets squeezed (squash), juice drops spurt up and fall, the slice springs back */
  rig('citrus-pro', .6, 'pop', p => {
    const intro = sub(p), cx = 0, cy = 100;
    [[-50, -150, .02], [10, -176, 0], [64, -140, .05], [-96, -110, .08]].forEach(([x, y, d]) => { const g = sub(intro); g.path(DROP(0, 0, 9), { fill: C.fill, sw: 2.6 });
      on(g, p, .7, { loop: 2.4, x: [[0, 0], [.42 + d, 0], [.8 + d, x, 'out'], [1.4 + d, x * 1.2]], y: [[0, cy - 20], [.42 + d, cy - 20], [.8 + d, y, 'out'], [1.4 + d, y + 120, 'in']], o: [[0, 0], [.42 + d, 0], [.46 + d, 1], [1.2 + d, 1], [1.4 + d, 0]] }); });
    const sl = sub(intro);
    sl.path(`M ${cx - 170} ${cy} A 170 170 0 0 1 ${cx + 170} ${cy} Z`, { fill: C.fill, sw: 3.4 });
    sl.path(`M ${cx - 146} ${cy} A 146 146 0 0 1 ${cx + 146} ${cy}`, SOFT(2.2));
    for (let i = 0; i < 5; i++) { const a0 = 180 + i * 36, A = pt(16, a0 + 7, cx, cy), B = pt(132, a0 + 3, cx, cy), Cc = pt(132, a0 + 33, cx, cy), D = pt(16, a0 + 29, cx, cy);
      sl.path(`M ${A} L ${B} A 132 132 0 0 1 ${Cc} L ${D} Z`, { fill: C.fill, sw: 2.2, stroke: C.soft }); }
    [[0, 54], [2, 70]].forEach(([i, r]) => { const [x, y] = pt(r, 180 + i * 36 + 18, cx, cy); sl.path(DROP(x, y, 6), { fill: C.fill, sw: 2, stroke: C.soft }); });
    on(sl, p, .7, { loop: 2.4, ox: cx, oy: cy, sy: [[0, 1], [.2, 1], [.4, .82, 'io'], [.52, 1.06, 'out'], [.7, 1, 'soft']], sx: [[0, 1], [.2, 1], [.4, 1.08, 'io'], [.52, .97, 'out'], [.7, 1, 'soft']] });
    pop(p, intro);
  });

  /* coffee — steam curls up from the mug; now and then it is lifted (a sip) and set back on the saucer with a clink */
  rig('coffee-pro', .6, 'squash', p => {
    const intro = sub(p);
    intro.ellipse(0, 146, 168, 16, { fill: C.fill, sw: 3.2 }); intro.ellipse(0, 146, 96, 8, SOFT(1.8));
    const st = sub(intro); steam(st, p, [-62, -12, 38], -78, 96, .7);
    const mg = sub(intro);
    tubes(mg, ['M 86 -22 C 166 -30, 166 84, 80 78'], 26);
    mg.path('M -112 -62 L 92 -62 L 80 112 Q 78 136 54 136 L -86 136 Q -110 136 -112 112 Z', { fill: C.fill, sw: 3.4 });
    mg.path('M -98 -42 Q -10 -30 78 -42', SOFT(2.2)); mg.line(-100, 96, 70, 96, SOFT(2));
    on(mg, p, .7, { loop: 2.8, ox: 0, oy: 136, y: [[0, 0], [1.5, 0], [1.75, -26, 'out'], [2.05, -26], [2.25, 0, 'in']], r: [[0, 0], [1.5, 0], [1.75, -5, 'out'], [2.05, -5], [2.25, 0, 'in']], sy: [[0, 1], [2.25, 1], [2.3, .94, 'out'], [2.42, 1.02], [2.55, 1, 'soft']] });
    const ck = sub(intro); [[-140, 120, -160, 104], [140, 120, 160, 104], [-128, 134, -156, 130], [128, 134, 156, 130]].forEach(([a, b, c, d]) => ck.line(a, b, c, d, { sw: 3 }));
    on(ck, p, .7, { loop: 2.8, o: flash(2.25, 2.5) });
    pop(p, intro);
  });

  /* cookie — a bitten chocolate-chip cookie rocks on its edge; crumbs drop from the bite */
  rig('cookie-pro', .6, 'pop', p => {
    const intro = sub(p);
    [[96, -66, 0], [118, -46, .5], [80, -90, 1]].forEach(([x, y, d]) => { const g = sub(intro); g.rect(x - 5, y - 5, 10, 10, { rx: 3, fill: C.fill, sw: 2.4 });
      on(g, p, .7 + d, { loop: 1.5, ox: x, oy: y, y: [[0, 0], [1.2, 200, 'in']], r: [[0, 0], [1.2, 160]], o: [[0, 0], [.1, 1], [.9, 1], [1.2, 0]] }); });
    const ck = sub(intro);
    ck.path('M 148 -26 A 150 150 0 1 1 26 -148 Q 46 -112 74 -110 Q 82 -82 110 -76 Q 112 -48 148 -26 Z', { fill: C.fill, sw: 3.4 });
    [[-60, -62, 0], [-96, 26, 40], [-22, 84, 80], [48, 40, 20], [6, -18, 60], [62, 98, 10], [-46, -2, 120]].forEach(([x, y, r]) => { const c = ck.child({ transform: `rotate(${r} ${x} ${y})` });
      c.path(`M ${x - 13} ${y - 4} Q ${x - 8} ${y - 15} ${x + 4} ${y - 12} Q ${x + 15} ${y - 6} ${x + 11} ${y + 7} Q ${x + 2} ${y + 15} ${x - 9} ${y + 9} Q ${x - 16} ${y + 3} ${x - 13} ${y - 4} Z`, { fill: C.rule, sw: 2.4 }); });
    ck.path('M -110 70 L -96 84 L -100 100', SOFT(1.8)); ck.path('M 20 -100 L 36 -90', SOFT(1.8));
    on(ck, p, .7, { loop: 2.6, ox: 0, oy: 150, r: [[0, 0], [.5, -7, 'io'], [1.3, 6, 'io'], [2, -3, 'io'], [2.6, 0, 'io']] });
    on(intro, p, 0, { s: [[0, .3], [.5, 1.06, 'out'], [.65, 1]], r: [[0, -120], [.6, 0, 'out']], o: [[0, 0], [.15, 1]] });
  });

  /* cooking-pot — it boils: the lid rattles up and tilts, steam puffs escape from under it, the pot gives a little shake */
  rig('cooking-pot-pro', .6, 'squash', p => {
    const intro = sub(p);
    const st = sub(intro); [[-120, 0], [120, .35]].forEach(([x, d]) => { const g = sub(st); g.path(`M ${x} -40 C ${x - 14} -66, ${x + 14} -90, ${x} -118`, SOFT(3));
      on(g, p, .7 + d, { loop: 1.6, y: [[0, 10], [1.6, -24, 'out']], o: [[0, 0], [.1, 0], [.3, 1], [1, 1], [1.6, 0]] }); });
    const pt2 = sub(intro);
    [-1, 1].forEach(sd => pt2.rect(sd > 0 ? 126 : -168, -6, 42, 26, { rx: 10, fill: C.fill, sw: 3 }));
    pt2.path('M -134 -22 L 134 -22 L 130 112 Q 128 140 100 140 L -100 140 Q -128 140 -130 112 Z', { fill: C.fill, sw: 3.4 });
    pt2.line(-124, 4, 124, 4, SOFT(2.2)); pt2.line(-122, 112, 122, 112, SOFT(1.8));
    on(pt2, p, .7, { loop: 1.6, r: [[0, 0], [.3, 0], ...at(shakeKeys(3, 1), .3).slice(1)] });
    const lO = sub(intro), ld = sub(lO);
    ld.path('M -146 -26 Q -140 -86 0 -90 Q 140 -86 146 -26 Z', { fill: C.fill, sw: 3.4 }); ld.path('M -120 -38 Q -100 -72 0 -74', SOFT(2));
    ld.rect(-20, -114, 40, 26, { rx: 10, fill: C.fill, sw: 3 }); ld.line(-12, -100, 12, -100, SOFT(1.8));
    on(ld, p, .7, { loop: 1.6, ox: -140, oy: -26, y: [[0, 0], [.2, -14, 'out'], [.34, 0, 'in'], [.5, -9, 'out'], [.62, 0, 'in'], [.74, -4], [.84, 0]], r: [[0, 0], [.2, 4, 'out'], [.34, 0, 'in'], [.5, 3], [.62, 0, 'in']] });
    drop(p, lO, .3, -120);
    pop(p, intro);
  });

  /* croissant — fresh from the oven: the five rolls of pastry puff in a wave from tip to tip, steam rises */
  rig('croissant-pro', .6, 'pop', p => {
    const intro = sub(p);
    const st = sub(intro); steam(st, p, [-40, 20], -110, 70, .7, 2);
    /* crescent outline; the four ridges between the pastry rolls are curves kept inside the outline; the rolls puff in a wave */
    const cr = sub(intro);
    cr.path('M -178 78 C -172 -40, -84 -104, 0 -104 C 84 -104, 172 -40, 178 78 C 150 60, 122 42, 92 46 C 62 30, 30 22, 0 22 C -30 22, -62 30, -92 46 C -122 42, -150 60, -178 78 Z', { fill: C.fill, sw: 3.4 });
    [[-1, 40, -88, 14, 50], [-1, 112, -56, 36, 126], [1, 40, -88, 14, 50], [1, 112, -56, 36, 126]].forEach(([sd, x, y1, y2, cx]) => cr.path(`M ${sd * x} ${y1} Q ${sd * cx} ${f1((y1 + y2) / 2)} ${sd * x} ${y2}`, SOFT(2.4)));
    [[-1, 150, 30], [1, 150, 30]].forEach(([sd, x, y]) => cr.path(`M ${sd * (x - 10)} ${y - 22} Q ${sd * (x + 2)} ${y - 6} ${sd * (x - 4)} ${y + 12}`, SOFT(2)));
    cr.path('M -30 -80 Q 0 -90 30 -80', SOFT(2));
    on(cr, p, .7, { loop: 2.4, ox: 0, oy: 40, sx: [[0, 1], [.2, 1], [.34, 1.04, 'out'], [.54, .99], [.7, 1, 'soft']], sy: [[0, 1], [.2, 1], [.34, 1.06, 'out'], [.54, .98], [.7, 1, 'soft']] });
    pop(p, intro);
  });

  /* cup-soda — someone sips: the cup squeezes in, the straw wiggles and little bubbles pop out of its top */
  rig('cup-soda-pro', .6, 'squash', p => {
    const intro = sub(p);
    [[86, -192, 0], [100, -180, .25], [72, -184, .5]].forEach(([x, y, d]) => { const g = sub(intro); g.circle(x, y, 6, SOFT(2.2));
      on(g, p, .7, { loop: 2.4, ox: x, oy: y, y: [[0, 10], [.5 + d, 10], [.9 + d, -6, 'out']], s: [[0, 0], [.5 + d, 0], [.7 + d, 1.2, 'out'], [.9 + d, 0, 'in']] }); });
    const sw = sub(intro); tubes(sw, ['M 16 -92 L 34 -168 L 82 -184'], 18);
    on(sw, p, .7, { loop: 2.4, ox: 16, oy: -92, r: [[0, 0], [.4, 0], [.55, -5, 'io'], [.75, 4, 'io'], [.95, -2, 'io'], [1.1, 0, 'soft']] });
    const cp = sub(intro);
    cp.path('M -92 -72 L 92 -72 L 70 160 Q 68 172 56 172 L -56 172 Q -68 172 -70 160 Z', { fill: C.fill, sw: 3.4 });
    const eL = y => f1(-92 + (y + 72) * 22 / 232 + 10);
    [28, 76].forEach(y => cp.line(eL(y), y, -eL(y), y, SOFT(2.2)));
    cp.path('M -104 -72 L -104 -86 Q -104 -98 -92 -98 L 92 -98 Q 104 -98 104 -86 L 104 -72 Z', { fill: C.fill, sw: 3.2 });
    cp.path('M -84 -98 Q 0 -126 84 -98', { sw: 3 });
    on(cp, p, .7, { loop: 2.4, ox: 0, oy: 172, sx: [[0, 1], [.3, 1], [.5, .94, 'io'], [1, .94], [1.2, 1.02, 'out'], [1.36, 1, 'soft']] });
    pop(p, intro);
  });

  /* egg — it wobbles on its bottom as if about to hatch; a crack draws across it, a few shiver ticks, then it settles */
  rig('egg-pro', .6, 'pop', p => {
    const intro = sub(p), eg = sub(intro);
    eg.path('M 0 -160 C 90 -160, 130 -20, 130 50 C 130 130, 70 170, 0 170 C -70 170, -130 130, -130 50 C -130 -20, -90 -160, 0 -160 Z', { fill: C.fill, sw: 3.4 });
    const cr = sub(eg), c1 = cr.poly([[-96, -6], [-62, -26], [-30, 4], [0, -22], [30, 6], [60, -22], [94, -8]], { sw: 3 }), c2 = cr.poly([[0, -22], [6, -48], [-6, -66]], SOFT(2.2));
    on(c1, p, .7, { loop: 2.8, draw: [[0, 0], [.7, 0], [1.1, 1, 'out'], [2.8, 1]] }); on(c2, p, .7, { loop: 2.8, draw: [[0, 0], [1, 0], [1.2, 1, 'out'], [2.8, 1]] });
    on(cr, p, .7, { loop: 2.8, o: [[0, 1], [2.3, 1], [2.6, 0]] });
    on(eg, p, .7, { loop: 2.8, ox: 0, oy: 170, r: [[0, 0], [.2, -7, 'io'], [.4, 7, 'io'], [.6, -5, 'io'], [.8, 4, 'io'], [1, 0, 'soft'], [1.4, 0], ...at(shakeKeys(4, 2), 1.4).slice(1)] });
    const tk = sub(intro); [[-160, -40, -184, -52], [-160, 0, -186, 0], [160, -40, 184, -52], [160, 0, 186, 0]].forEach(([a, b, c, d]) => tk.line(a, b, c, d, { sw: 3 }));
    on(tk, p, .7, { loop: 2.8, o: [[0, 0], [1.4, 0], [1.42, 1], [1.7, 0]] });
    pop(p, intro);
  });

  /* grape — the bunch swings from its stem, the grapes jiggle one after another down the bunch (follow-through), the leaf flutters */
  rig('grape-pro', .7, 'rise', p => {
    const intro = sub(p), bn = sub(intro), J = [0, -84];
    const lf = sub(bn); lf.path('M 6 -120 C 40 -170, 120 -170, 150 -128 C 110 -96, 50 -96, 6 -120 Z', { fill: C.fill, sw: 3 }); lf.path('M 20 -120 C 60 -132, 104 -132, 138 -128', SOFT(1.8));
    on(lf, p, .7, { loop: 1.6, ox: 6, oy: -120, r: [[0, 0], [.4, -6, 'io'], [1.2, 4, 'io'], [1.6, 0, 'io']] });
    bn.path('M 0 -76 Q -4 -110 8 -134', { sw: 5 }); bn.path('M 4 -116 C -26 -130, -36 -156, -10 -164 C 8 -168, 6 -150, -6 -150', SOFT(2.4));
    const rows = [[100, [0]], [54, [-28, 28]], [8, [-56, 0, 56]], [-38, [-84, -28, 28, 84]]];
    rows.forEach(([y, xs], ri) => xs.forEach(x => { const g = sub(bn); g.circle(x, y, 31, { fill: C.fill, sw: 3.2 });
      const t = (3 - ri) * .08; on(g, p, .7, { loop: 2.8, ox: x, oy: y, s: [[0, 1], [.4 + t, 1], [.5 + t, 1.06, 'out'], [.7 + t, .98], [.82 + t, 1, 'soft']] }); }));
    on(bn, p, .7, { loop: 2.8, ox: J[0], oy: J[1], r: [[0, 0], [.7, 5, 'io'], [1.4, -4, 'io'], [2.1, 2, 'io'], [2.8, 0, 'io']] });
    on(intro, p, 0, { ox: J[0], oy: J[1], y: [[0, -150], [.45, 0, 'back']], o: [[0, 0], [.15, 1]] });
  });

  /* ice-cream-cone — the scoops wobble like jelly (top scoop lags), a drip slides down the waffle cone and falls */
  rig('ice-cream-cone-pro', .6, 'squash', p => {
    const intro = sub(p), cn = sub(intro);
    cn.shape([[-84, 12], [84, 12], [0, 178]], { fill: C.fill, sw: 3.4 });
    const wf = sub(cn, { 'clip-path': clip(cn, 'M -70 22 L 70 22 L 0 158 Z') });
    for (let k = -160; k <= 160; k += 32) { wf.line(k, 20, k + 160, 180, SOFT(2)); wf.line(k, 20, k - 160, 180, SOFT(2)); }
    const s1 = sub(intro);
    s1.path('M -98 16 Q -110 -60 -40 -82 Q 0 -94 40 -82 Q 110 -60 98 16 Q 82 32 66 16 Q 50 38 30 16 Q 10 32 -10 16 Q -30 38 -50 16 Q -70 32 -98 16 Z', { fill: C.fill, sw: 3.2 });
    const s2 = sub(s1); s2.circle(0, -104, 64, { fill: C.fill, sw: 3.4 }); s2.path('M -34 -124 Q 0 -146 34 -122', SOFT(2.2));
    on(s2, p, .7, { loop: 2.4, ox: 0, oy: -42, sx: [[0, 1], [.3, 1], [.42, 1.06, 'io'], [.6, .96, 'io'], [.78, 1.02, 'io'], [.96, 1, 'soft']], sy: [[0, 1], [.3, 1], [.42, .92, 'io'], [.6, 1.05, 'io'], [.78, .98, 'io'], [.96, 1, 'soft']] });
    on(s1, p, .7, { loop: 2.4, ox: 0, oy: 14, sx: [[0, 1], [.2, 1.04, 'io'], [.4, .98, 'io'], [.6, 1, 'soft']], sy: [[0, 1], [.2, .95, 'io'], [.4, 1.02, 'io'], [.6, 1, 'soft']] });
    const dr = sub(intro); dr.path(DROP(50, 34, 8), { fill: C.fill, sw: 2.6 });
    on(dr, p, .7, { loop: 2.4, x: [[0, 0], [.9, 0], [1.7, -18, 'in'], [2.1, -18]], y: [[0, -6], [.9, -6], [1.7, 60, 'in'], [2.1, 150, 'in']], o: [[0, 0], [.9, 0], [1, 1], [1.95, 1], [2.1, 0]] });
    thud(p, intro, 178);
  });

  /* pizza — the slice is picked up: it tilts on its tip with a little anticipation, the toppings jiggle one after another */
  rig('pizza-pro', .6, 'pop', p => {
    const intro = sub(p), sl = sub(intro);
    sl.path('M -150 -110 Q 0 -170 150 -110 L 10 160 Q 0 174 -10 160 Z', { fill: C.fill, sw: 3.4 });
    sl.path('M -128 -90 Q 0 -142 128 -90', SOFT(2.4));
    [[-50, -50, 24, 0], [48, -40, 22, 1], [-4, 36, 20, 2], [6, 104, 12, 3]].forEach(([x, y, r, i]) => { const g = sub(sl); g.circle(x, y, r, { fill: C.fill, sw: 2.8 }); g.circle(f1(x - r * .3), f1(y + r * .2), f1(r * .18), { fill: C.soft, stroke: C.soft, sw: 1 });
      on(g, p, .7, { loop: 2.6, ox: x, oy: y, s: [[0, 1], [.5 + i * .1, 1], [.6 + i * .1, 1.16, 'out'], [.8 + i * .1, 1, 'soft']] }); });
    [[-92, -60], [64, 10], [-14, 72]].forEach(([x, y]) => sl.path(`M ${x - 6} ${y} Q ${x} ${y - 8} ${x + 6} ${y}`, SOFT(2.4)));
    on(sl, p, .7, { loop: 2.6, ox: 0, oy: 166, r: [[0, 0], [.3, 3, 'io'], [.6, -6, 'out'], [1.6, -6], [2, 0, 'io']], y: [[0, 0], [.3, 4, 'io'], [.6, -12, 'out'], [1.6, -12], [2, 0, 'io']] });
    pop(p, intro);
  });

  /* sandwich — it gets squished: the top bun presses down, each layer squashes a moment later (a wave down the stack), all spring back */
  rig('sandwich-pro', .7, 'squash', p => {
    const intro = sub(p);
    const L = (draw, i) => { const g = sub(intro); draw(g); const t = .3 + i * .06; on(g, p, .7, { loop: 2.4, ox: 0, oy: 144, sy: [[0, 1], [t, 1], [t + .14, .92, 'out'], [t + .34, 1.03, 'out'], [t + .5, 1, 'soft']] }); return g; };
    L(g => { g.rect(-160, 96, 320, 48, { rx: 18, fill: C.fill, sw: 3.4 }); g.line(-140, 120, 140, 120, SOFT(1.8)); }, 4);
    L(g => { g.rect(-150, 70, 300, 30, { rx: 10, fill: C.fill, sw: 3 }); [-80, 0, 80].forEach(x => g.circle(x, 85, 7, SOFT(1.8))); }, 3);
    L(g => g.path('M -156 60 L 156 60 L 150 72 L 122 96 L 98 72 L -98 72 L -124 96 L -150 72 Z', { fill: C.fill, sw: 3 }), 2);
    L(g => { let d = 'M -172 64 L -172 50'; for (let x = -172; x < 172; x += 43) d += ` Q ${x + 10.75} 38 ${x + 21.5} 48 Q ${x + 32.25} 58 ${x + 43} 46`; g.path(d + ' L 172 64 Z', { fill: C.fill, sw: 3 }); }, 1);
    const tp = L(g => { g.line(30, 0, 30, -112, { sw: 4 }); g.shape([[30, -112], [72, -102], [30, -90]], { fill: C.fill, sw: 3 });
      g.rect(-164, -4, 328, 52, { rx: 22, fill: C.fill, sw: 3.4 }); }, 0);
    on(tp, p, .7, { loop: 2.4, y: [[0, 0], [.3, 0], [.42, 8, 'out'], [.62, -3, 'out'], [.8, 0, 'soft']] });
    pop(p, intro);
  });

  /* soup — the spoon stirs round the bowl, ripples spread from it, steam curls up */
  rig('soup-pro', .6, 'squash', p => {
    const intro = sub(p);
    const st = sub(intro); steam(st, p, [-70, -16, 38], -40, 110, .7);
    intro.rect(-62, 140, 124, 24, { rx: 8, fill: C.fill, sw: 3 });
    intro.ellipse(0, -10, 172, 30, { fill: C.fill, sw: 3.4 });
    const rp = sub(intro); rp.ellipse(20, -4, 30, 7, SOFT(2));
    on(rp, p, .7, { loop: 1.2, ox: 20, oy: -4, s: [[0, .4], [1.2, 2.4, 'out']], o: [[0, 1], [1.2, 0]] });
    [[-90, -8], [-40, 0]].forEach(([x, y]) => intro.circle(x, y, 7, SOFT(2)));
    const sp = sub(intro); tubes(sp, ['M 20 -4 L 150 -130'], 18); sp.ellipse(20, -2, 26, 8, { fill: C.fill, sw: 3 });
    on(sp, p, .7, { loop: 2.4, ox: 150, oy: -130, r: [[0, 0], [.6, 5, 'io'], [1.2, 0, 'io'], [1.8, -5, 'io'], [2.4, 0, 'io']], x: [[0, 0], [.6, -18, 'io'], [1.2, 0, 'io'], [1.8, 18, 'io'], [2.4, 0, 'io']] });
    intro.path('M -172 -10 Q 0 34 172 -10 Q 164 146 0 146 Q -164 146 -172 -10 Z', { fill: C.fill, sw: 3.4 });
    intro.path('M -150 40 Q 0 76 150 40', SOFT(2));
    pop(p, intro);
  });

  /* wheat — the stalk grows, then sways in the breeze; the heavy ear lags behind and its whiskers tremble */
  rig('wheat-pro', .8, 'sink', p => {
    const intro = sub(p); show(p, intro);
    const pl = sub(intro);
    const lfO = sub(pl), lf = sub(lfO); lf.path('M 0 70 C -40 40, -100 40, -140 -10 C -90 10, -40 30, 0 70 Z', { fill: C.fill, sw: 3 }); lf.path('M -8 62 Q -60 30 -126 -4', SOFT(1.8));
    on(lf, p, .9, { loop: 3.2, ox: 0, oy: 70, r: [[0, 0], [.8, -5, 'soft'], [1.8, 4, 'soft'], [2.6, -2, 'soft'], [3.2, 0, 'soft']] });
    on(lfO, p, .45, { ox: 0, oy: 70, s: [[0, 0], [.35, 1.08, 'out'], [.5, 1]], r: [[0, 40], [.4, 0, 'out']], o: [[0, 0], [.05, 1]] });
    const stk = pl.path('M 0 182 C 6 120, -8 40, 8 -40', { sw: 5 }); on(stk, p, 0, { draw: [[0, 0], [.4, 1, 'out']] });
    const earO = sub(pl), ear = sub(earO), eg = sub(ear);
    for (let i = 0; i < 6; i++) { const y = -46 - i * 24, x = 8 + i * .6; [-1, 1].forEach(sd => { const g = eg.child({ transform: `rotate(${sd * 28} ${x} ${y})` });
      g.ellipse(x + sd * 16, y - 4, 12, 20, { fill: C.fill, sw: 2.8 }); g.line(x + sd * 16, y - 12, x + sd * 16, y + 8, SOFT(1.6)); g.line(x + sd * 16, y - 26, x + sd * 16, y - 56, SOFT(1.8)); }); }
    eg.ellipse(12, -196 + 18, 11, 18, { fill: C.fill, sw: 2.8 });
    on(eg, p, .9, { loop: .5, ox: 10, oy: -40, ky: [[0, 0], [.25, 1.4, 'io'], [.5, 0, 'io']] });
    on(ear, p, .9, { loop: 3.2, ox: 8, oy: -40, r: [[0, 0], [.4, 0], [1.2, 5, 'soft'], [2.1, -4, 'soft'], [2.9, 2, 'soft'], [3.2, 0, 'soft']] });
    on(earO, p, .3, { ox: 8, oy: -40, s: [[0, 0], [.35, 1.08, 'out'], [.5, 1]], o: [[0, 0], [.05, 1]] });
    on(pl, p, .9, { loop: 3.2, ox: 0, oy: 182, r: [[0, 0], [.9, 3, 'soft'], [1.8, -2.5, 'soft'], [2.7, 1.5, 'soft'], [3.2, 0, 'soft']] });
  });

  /* bot — a curious robot: it tilts its head, the antenna wobbles after it (follow-through), its light blinks, the eyes blink */
  rig('bot-pro', .6, 'pop', p => {
    const intro = sub(p), hd = sub(intro);
    hd.rect(-60, 118, 120, 44, { rx: 14, fill: C.fill, sw: 3.2 }); hd.line(-40, 140, 40, 140, SOFT(2));
    const an = sub(hd); an.line(0, -72, 0, -128, { sw: 4.4 }); const bl = sub(an); bl.circle(0, -144, 16, { fill: C.fill, sw: 3.2 }); const lt = sub(bl); lt.circle(0, -144, 7, { fill: C.ink, sw: 1 });
    on(lt, p, .7, { loop: 1.2, o: [[0, 1], [.5, 1], [.55, .2], [.9, .2], [.95, 1]] });
    on(an, p, .7, { loop: 2.8, ox: 0, oy: -72, r: [[0, 0], [.5, 0], [.62, -14, 'out'], [.82, 10, 'io'], [1, -5, 'io'], [1.16, 2], [1.3, 0, 'soft'], [1.9, 0], [2, 12, 'out'], [2.2, -8, 'io'], [2.38, 3], [2.55, 0, 'soft']] });
    [-1, 1].forEach(sd => { hd.rect(sd > 0 ? 130 : -150, 4, 20, 56, { rx: 6, fill: C.fill, sw: 3 }); hd.line(sd > 0 ? 136 : -144, 32, sd > 0 ? 144 : -136, 32, SOFT(1.8)); });
    hd.rect(-130, -72, 260, 192, { rx: 36, fill: C.fill, sw: 3.4 });
    hd.rect(-104, -46, 208, 124, { rx: 22, fill: C.fill, sw: 2.4, stroke: C.soft });
    const ey = sub(hd); [-42, 42].forEach(x => ey.rect(x - 18, -22, 36, 46, { rx: 14, fill: C.ink, sw: 1.6 }));
    on(ey, p, .7, { loop: 2.8, ox: 0, oy: 1, sy: [[0, 1], [1.5, 1], [1.56, .1, 'in'], [1.66, 1, 'out']], x: [[0, 0], [.5, 0], [.62, -8, 'out'], [1.3, -8], [1.5, 0, 'io']] });
    hd.rect(-34, 44, 68, 14, { rx: 7, sw: 2.4, stroke: C.soft });
    on(hd, p, .7, { loop: 2.8, ox: 0, oy: 160, r: [[0, 0], [.5, 0], [.62, -8, 'out'], [.8, -6, 'soft'], [1.3, -6], [1.6, 4, 'io'], [1.9, 4], [2.2, 0, 'io']] });
    pop(p, intro);
  });

  /* cloud — floats in from the left; it bobs and breathes softly while a small cloud behind drifts past slower (parallax) */
  rig('cloud-pro', .7, 'slide', p => {
    const intro = sub(p);
    const sm = sub(intro); sm.path('M -170 -112 Q -196 -112 -194 -134 Q -192 -152 -170 -150 Q -164 -180 -132 -174 Q -110 -190 -92 -162 Q -66 -164 -68 -140 Q -66 -112 -92 -112 Z', { fill: C.fill, sw: 2.6, stroke: C.soft });
    on(sm, p, .7, { loop: 4.4, x: [[0, 0], [4.4, 120, 'lin']], o: [[0, 0], [.6, 1], [3.6, 1], [4.4, 0]] });
    const cO = sub(intro), cl = sub(cO);
    const CL = 'M -140 82 Q -190 82 -190 32 Q -190 -18 -140 -22 Q -136 -100 -60 -104 Q -10 -158 60 -118 Q 130 -128 140 -48 Q 190 -38 190 20 Q 190 82 130 82 Z';
    cl.path(CL, { fill: C.fill, sw: 3.4 });
    cl.path('M -150 52 Q -164 30 -146 10 M -70 -76 Q -40 -100 -6 -92 M 120 -30 Q 150 -20 156 8', SOFT(2));
    cl.line(-130, 62, 128, 62, SOFT(2));
    on(cl, p, .7, { loop: 3, ox: 0, oy: 82, y: [[0, 0], [1.5, -8, 'io'], [3, 0, 'io']], sx: [[0, 1], [1.5, 1.025, 'io'], [3, 1, 'io']], sy: [[0, 1], [1.5, .985, 'io'], [3, 1, 'io']] });
    on(cO, p, 0, { x: [[0, -260], [.6, 0, 'out']], o: [[0, 0], [.15, 1]] });
  });

  /* code — the brackets squeeze in and then push apart, the slash flips half a turn between them */
  rig('code-pro', .6, 'pop', p => {
    const intro = sub(p);
    [[-1, 'M -64 -84 L -152 0 L -64 84'], [1, 'M 64 -84 L 152 0 L 64 84']].forEach(([sd, d]) => { const g = sub(intro); tubes(g, [d], 30);
      on(g, p, .7, { loop: 2.4, x: [[0, 0], [.2, -sd * 10, 'io'], [.45, sd * 16, 'out'], [.75, 0, 'soft']] }); });
    const sl = sub(intro); tubes(sl, ['M 34 -112 L -34 112'], 30);
    on(sl, p, .7, { loop: 2.4, ox: 0, oy: 0, r: [[0, 0], [.3, 0], [.4, -10, 'io'], [.85, 186, 'out'], [1.05, 180, 'soft'], [2.4, 180]], s: [[0, 1], [.3, 1], [.4, .9, 'io'], [.85, 1.08, 'out'], [1.05, 1, 'soft']] });
    pop(p, intro);
  });

  /* cog — steps round a tooth at a time: a small wind-back, a click forward past the mark, settle */
  rig('cog-pro', .6, 'spin', p => {
    const intro = sub(p), cg = sub(intro), pts = [];
    for (let i = 0; i < 8; i++) { const a = i * 45; pts.push(pt(118, a - 15), pt(156, a - 9), pt(156, a + 9), pt(118, a + 15)); }
    cg.shape(pts, { fill: C.fill, sw: 3.4 }); cg.circle(0, 0, 92, SOFT(2.2)); cg.circle(0, 0, 36, { fill: C.fill, sw: 3.2 });
    const k = [[0, 0]]; for (let i = 0; i < 2; i++) { const t = i * .8; k.push([t + .3, i * 45 - 5, 'io'], [t + .5, i * 45 + 50, 'out'], [t + .64, i * 45 + 45, 'soft']); }
    on(cg, p, .7, { loop: 1.6, r: [...k, [1.6, 90]] });
    on(intro, p, 0, { s: [[0, .3], [.5, 1.06, 'out'], [.65, 1]], r: [[0, -120], [.6, 0, 'out']], o: [[0, 0], [.15, 1]] });
  });

  /* cpu — a pulse runs round the pins one after another, the core beats when it arrives */
  rig('cpu-pro', .6, 'pop', p => {
    const intro = sub(p), pins = [];
    [-50, 0, 50].forEach(o => { pins.push([o, -110, o, -150], [110, o, 150, o], [-o, 110, -o, 150], [-110, -o, -150, -o]); });
    const order = [0, 4, 8, 1, 5, 9, 2, 6, 10, 3, 7, 11];
    order.forEach((idx, i) => { const [a, b, c, d] = pins[idx], g = sub(intro); g.line(a, b, c, d, { sw: 5 }); g.circle(c, d, 5, { fill: C.fill, sw: 2.4 });
      on(g, p, .7, { loop: 2.4, o: [[0, .4], [i * .1, .4], [i * .1 + .05, 1], [i * .1 + .35, .4]] }); });
    const ch = sub(intro);
    ch.rect(-110, -110, 220, 220, { rx: 18, fill: C.fill, sw: 3.4 }); ch.circle(-84, -84, 7, { fill: C.soft, stroke: C.soft, sw: 1 });
    const co = sub(ch); co.rect(-56, -56, 112, 112, { rx: 10, fill: C.fill, sw: 3 }); co.line(-30, 0, 30, 0, SOFT(2)); co.line(0, -30, 0, 30, SOFT(2));
    on(co, p, .7, { loop: 2.4, ox: 0, oy: 0, s: [[0, 1], [1.2, 1], [1.28, 1.08, 'out'], [1.5, 1, 'soft']] });
    pop(p, intro);
  });

  /* database — the three disks lift apart (top first) and stack back down with a squash; their lights blink in turn as data is read */
  rig('database-pro', .7, 'squash', p => {
    const intro = sub(p);
    [58, -26, -110].forEach((yt, i) => { const g = sub(intro), lift = i * 10;
      g.path(`M -140 ${yt} L -140 ${yt + 70} A 140 40 0 0 0 140 ${yt + 70} L 140 ${yt} Z`, { fill: C.fill, sw: 3.4 });
      g.ellipse(0, yt, 140, 40, { fill: C.fill, sw: 3.4 }); if (i === 2) g.ellipse(0, yt, 104, 26, SOFT(1.8));
      const lt = sub(g); lt.circle(108, yt + 58, 6, { fill: C.ink, sw: 1 });
      on(lt, p, .7, { loop: 2.4, o: [[0, .3], [.2 + i * .15, .3], [.24 + i * .15, 1], [.5 + i * .15, .3], [1.4 + i * .1, .3], [1.44 + i * .1, 1], [1.7 + i * .1, .3]] });
      on(g, p, .7, { loop: 2.4, ox: 0, oy: yt + 110, y: [[0, 0], [.8, 0], [1.1, -lift * 1.6, 'out'], [1.5, -lift * 1.6], [1.75, 0, 'in']], sy: [[0, 1], [1.75, 1], [1.82, .94, 'out'], [1.96, 1.02], [2.1, 1, 'soft']] }); });
    pop(p, intro);
  });

  /* filter — bits fall into the funnel and vanish at the rim; a single clean drop comes out of the spout */
  rig('filter-pro', .6, 'pop', p => {
    const intro = sub(p);
    [[-90, 0, 1], [-20, .3, 0], [60, .6, 1], [110, .9, 0], [10, 1.2, 1]].forEach(([x, d, k]) => { const g = sub(intro);
      if (k) g.circle(x, -160, 8, { fill: C.fill, sw: 2.6 }); else g.rect(x - 8, -168, 16, 16, { rx: 3, fill: C.fill, sw: 2.6 });
      on(g, p, .7 + d, { loop: 1.5, y: [[0, -30], [.7, 30, 'in']], o: [[0, 0], [.15, 1], [.5, 1], [.7, 0]] }); });
    const fn = sub(intro);
    fn.path('M -172 -136 Q -176 -150 -160 -150 L 160 -150 Q 176 -150 172 -136 L 32 24 L 32 120 Q 32 130 22 126 L -22 104 Q -32 100 -32 88 L -32 24 Z', { fill: C.fill, sw: 3.4 });
    fn.line(-148, -128, 148, -128, SOFT(2.2));
    const dr = sub(intro); dr.path(DROP(0, 140, 8), { fill: C.fill, sw: 2.6 });
    on(dr, p, .7, { loop: 1.5, y: [[0, -10], [.6, -10], [1.2, 30, 'in']], sy: [[0, .6], [.6, .6], [.75, 1.1, 'out'], [.9, 1]], o: [[0, 0], [.6, 0], [.66, 1], [1.05, 1], [1.2, 0]] });
    on(fn, p, .7, { loop: 1.5, ox: 0, oy: -150, sy: [[0, 1], [.55, 1], [.62, .97, 'out'], [.75, 1, 'soft']] });
    pop(p, intro);
  });

  Object.assign(G.icons, R);
  const names = ['citrus', 'coffee', 'cookie', 'cooking-pot', 'croissant', 'cup-soda', 'egg', 'grape', 'ice-cream-cone', 'pizza',
    'sandwich', 'soup', 'wheat', 'bot', 'cloud', 'code', 'cog', 'cpu', 'database', 'filter'];
  const ALIAS = Object.fromEntries(names.map(n => [n, n + '-pro'])); Object.assign(ALIAS, { robot: 'bot-pro', 'ice-cream': 'ice-cream-cone-pro', lemon: 'citrus-pro', funnel: 'filter-pro' });
  for (const [a, pro] of Object.entries(ALIAS)) { if (G.icons[a] && !G.icons[a + '-basic'] && !G.icons[a].custom) G.icons[a + '-basic'] = G.icons[a]; G.icons[a] = R[pro]; }
  G.PRO16 = names.map(n => n + '-pro');
})();
