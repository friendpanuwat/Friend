/* pro8.js — pro icon batch 8: CutPack priority-2 names, first 20 (rocket already exists; hand-heart, hand-helping, hand-coins,
   ear-off are body parts → paused).
   Standard (see references/style.md §0): main line 3 · dark see-through bodies · only details that carry meaning (no glints,
   no decorative sparkles, no buttons/seams/tiny text, no thin decorative lines) · entrance + looping part animation + exit
   (3rd argument of rig). Two GL.kf on one element → the later one overwrites the transform: entrance and loop always sit on
   separate groups (outer = entrance, inner = loop). */
(function () {
  const G = window.GL, C = G.C, P = G.parts;
  const sub = (p, attrs) => p.child(attrs || {});
  const on = (q, p, start, spec) => G.kf(q.g || q, p.t0 + start * p.ts, spec);
  const pop = (p, q, at = 0, from = .4) => on(q, p, at, { s: [[0, from], [.42, 1.08, 'out'], [.62, 1]], o: [[0, 0], [.16, 1]] });
  const drop = (p, q, at = 0, dy = -90) => on(q, p, at, { y: [[0, dy], [.55, 0, 'back']], o: [[0, 0], [.2, 1]] });
  const rise = (p, q, at = 0, dy = 150) => on(q, p, at, { y: [[0, dy], [.55, 0, 'back']], o: [[0, 0], [.15, 1]] });
  const grow = (p, q, at, oy) => on(q, p, at, { ox: 0, oy, sy: [[0, 0], [.45, 1.05, 'out'], [.6, 1]], o: [[0, 0], [.05, 1]] });   // rises out of the ground
  const thud = (p, q, oy, dy = -220) => on(q, p, 0, { ox: 0, oy, y: [[0, dy], [.42, 0, 'in']], sy: [[.42, .86], [.56, 1.06, 'out'], [.7, 1]], sx: [[.42, 1.1], [.56, .97, 'out'], [.7, 1]], o: [[0, 0], [.1, 1]] });
  const show = (p, q) => on(q, p, 0, { o: [[0, 0], [.01, 1]] });
  const tube = (p, d, w = 18) => { p.path(d, { sw: w }); p.path(d, { sw: w - 7, stroke: C.fill }); };
  const shakeKeys = (n, amp, step = .05) => { const k = [[0, 0]]; for (let i = 1; i <= n; i++) k.push([i * step, i % 2 ? -amp : amp, 'lin']); k.push([(n + 1) * step, 0, 'out']); return k; };
  const shift = (keys, t0) => keys.map(([t, v, e]) => [t + t0, v, e]);
  const flash = (a, b) => [[0, 0], [a, 0], [a + .02, 1], [b, 0]];
  const STAR5 = (cx, cy, R, r) => { const a = []; for (let i = 0; i < 10; i++) { const t = -Math.PI / 2 + i * Math.PI / 5, d = i % 2 ? r : R; a.push([+(cx + Math.cos(t) * d).toFixed(1), +(cy + Math.sin(t) * d).toFixed(1)]); } return a; };
  const HEART = 'M 0 70 C -96 8, -86 -72, -38 -72 C -14 -72, 0 -54, 0 -38 C 0 -54, 14 -72, 38 -72 C 86 -72, 96 8, 0 70 Z';
  const DROP = (x, y, r) => `M ${x} ${y - r * 1.6} C ${x + r * .5} ${y - r * .8}, ${x + r} ${y - r * .2}, ${x + r} ${y + r * .3} A ${r} ${r} 0 0 1 ${x - r} ${y + r * .3} C ${x - r} ${y - r * .2}, ${x - r * .5} ${y - r * .8}, ${x} ${y - r * 1.6} Z`;
  const R = {}, rig = (name, dur, exit, fn) => { fn.custom = true; fn.dur = dur; fn.exit = exit; R[name] = fn; };

  /* chart-column — the axes draw, the three columns grow up, then they rise and fall to new values like live data */
  rig('chart-column-pro', .8, 'squash', p => {
    const intro = sub(p); show(p, intro);
    [-60, 50].forEach(y => { const gl = intro.line(-150, y, 168, y, { sw: 1.6, stroke: C.soft }); on(gl, p, .2, { draw: [[0, 0], [.4, 1, 'out']] }); });
    const ax = intro.path('M -160 -170 L -160 156 L 172 156', { sw: 3.4 }); on(ax, p, 0, { draw: [[0, 0], [.4, 1, 'out']] });
    [-96, -6, 84].forEach(x => { const tk = intro.line(x, 156, x, 172, { sw: 3 }); on(tk, p, .3, { draw: [[0, 0], [.2, 1]] }); });
    [-60, 50].forEach(y => { const tk = intro.line(-174, y, -160, y, { sw: 2.4 }); on(tk, p, .3, { draw: [[0, 0], [.2, 1]] }); });
    [[-96, 60, 1.6], [-6, -40, .7], [84, -110, 1.1]].forEach(([x, top, f], i) => {
      const bO = sub(intro), b = sub(bO), hi = i === 2; b.rect(x - 30, top, 60, 156 - top, { rx: 8, fill: C.fill, sw: hi ? 3.4 : 2.6, stroke: hi ? C.ink : C.soft });
      b.line(x - 18, top + 14, x + 18, top + 14, { sw: 2, stroke: C.soft });
      on(b, p, .9 + i * .15, { loop: 3, ox: x, oy: 156, sy: [[0, 1], [.08, f > 1 ? .96 : 1.04, 'out'], [.55, f * (f > 1 ? 1.04 : .96), 'out'], [.75, f, 'soft'], [1.5, f], [1.95, 1, 'io'], [2.1, f > 1 ? .98 : 1.02, 'soft'], [2.3, 1, 'soft']] });
      on(bO, p, .25 + i * .1, { ox: x, oy: 156, sy: [[0, 0], [.35, 1.06, 'out'], [.5, 1]], o: [[0, 0], [.02, 1]] });
    });
  });

  /* shield-check — the shield lands, the check stamps in with a bump and a safety ring pulses out; the check redraws */
  const SHIELD = 'M 0 -170 C 50 -140, 100 -130, 140 -130 C 140 -10, 120 110, 0 170 C -120 110, -140 -10, -140 -130 C -100 -130, -50 -140, 0 -170 Z';
  rig('shield-check-pro', .6, 'rise', p => {
    const intro = sub(p), w = intro.child({ transform: 'scale(.92)' }, .92);
    const rg = sub(w); rg.path(SHIELD, { stroke: C.soft, sw: 2 });
    on(rg, p, .7, { loop: 2.4, s: [[0, 1], [.8, 1.2, 'out']], o: [[0, .8], [.8, 0]] });
    const sh = sub(w); sh.path(SHIELD, { fill: C.fill, sw: 3.4 }); sh.child({ transform: 'scale(.84)' }, .84).path(SHIELD, { sw: 1.8, stroke: C.soft });
    const tk = sh.poly([[-56, 4], [-16, 46], [62, -44]], { sw: 18 });
    on(tk, p, .7, { loop: 2.4, draw: [[0, 1], [1.8, 1], [1.95, 0, 'in'], [2.05, 0], [2.4, 1, 'out']] });
    on(sh, p, .7, { loop: 2.4, s: [[0, 1], [.08, 1.06, 'out'], [.3, 1, 'soft']] });
    drop(p, intro, 0, -100);
  });

  /* emoji face (same as pro7) */
  const face = q => q.circle(0, 0, 150, { fill: C.fill, sw: 3.4 });
  const eyes = q => [-52, 52].map(x => { const e = sub(q); e.ellipse(x, -34, 14, 20, { fill: C.ink, sw: 1.4 }); return e; });

  /* angry — scowling brows and a hard frown; the face swells and trembles while steam puffs off the top */
  rig('angry-pro', .6, 'pop', p => {
    const intro = sub(p), fc = sub(intro);
    face(fc); eyes(fc);
    const bw = sub(fc); [-1, 1].forEach(sd => bw.line(sd * 88, -96, sd * 28, -68, { sw: 6 }));
    on(bw, p, .7, { loop: 2.4, y: [[0, 0], [.1, 8, 'out'], [.7, 8], [.95, 0, 'soft']] });
    fc.rect(-60, 58, 120, 42, { rx: 16, fill: C.fill, sw: 4 }); fc.line(-56, 79, 56, 79, { sw: 2.4 }); [-30, 0, 30].forEach(x => fc.line(x, 60, x, 98, { sw: 2.4 }));
    on(fc, p, .7, { loop: 2.4, s: [[0, 1], [.12, 1.05, 'out'], [.7, 1.05], [.95, 1, 'soft']], r: shakeKeys(9, 3.5, .05) });
    [-1, 1].forEach((sd, i) => { const st = sub(intro); st.path(`M ${sd * 104} -124 q ${sd * 12} -14 0 -28 q ${-sd * 12} -14 0 -28`, { sw: 3.2, stroke: C.soft });
      on(st, p, .7 + i * .15, { loop: 2.4, y: [[0, 6], [.9, -14, 'out']], o: [[0, 0], [.1, 1], [.6, 1], [.9, 0]] }); });
    pop(p, intro);
  });

  /* leaf — drifts down swaying like a falling leaf, then flutters on its stem in the breeze */
  rig('leaf-pro', .7, 'rise', p => {
    const intro = sub(p), lO = sub(intro), lf = sub(lO), g = lf.child({ transform: 'rotate(35)' });
    g.path('M 0 186 Q -6 168 0 148', { sw: 4.4 });
    g.path('M 0 150 C -110 70, -110 -80, 0 -170 C 110 -80, 110 60, 0 150 Z', { fill: C.fill, sw: 3.2 });
    g.line(0, 140, 0, -140, { sw: 2.6 });
    [64, 4, -56].forEach(y => [-1, 1].forEach(sd => g.line(0, y, sd * 50, y - 42, { sw: 2, stroke: C.soft })));
    const dw = sub(g); dw.path(DROP(0, 0, 10), { fill: C.fill, sw: 2.4 });
    on(dw, p, .7, { loop: 3, y: [[0, -110], [.3, -110], [1.8, 120, 'in']], o: [[0, 0], [.3, 0], [.4, 1], [1.6, 1], [1.8, 0]] });
    on(lf, p, .7, { loop: 3, ox: -107, oy: 152, r: [[0, 0], [.75, 6, 'soft'], [2.25, -6, 'soft'], [3, 0, 'soft']], ky: [[0, 0], [.75, -3, 'soft'], [2.25, 3, 'soft'], [3, 0, 'soft']] });
    on(lO, p, 0, { y: [[0, -170], [.7, 0, 'out']], x: [[0, -50], [.35, 30, 'soft'], [.7, 0, 'soft']], r: [[0, -30], [.7, 0, 'out']], o: [[0, 0], [.15, 1]] });
  });

  /* weight — a heavy weight thuds down; then it heaves up a little and slams back with a squash and dust */
  rig('weight-pro', .7, 'rise', p => {
    const intro = sub(p), wO = sub(intro), w = sub(wO); show(p, intro);
    w.circle(0, -98, 54, { sw: 24 }); w.circle(0, -98, 54, { sw: 17, stroke: C.fill });
    w.path('M -128 150 L -96 -36 Q -92 -56 -70 -56 L 70 -56 Q 92 -56 96 -36 L 128 150 Q 130 164 114 164 L -114 164 Q -130 164 -128 150 Z', { fill: C.fill, sw: 3.4 });
    w.line(-122, 132, 122, 132, { sw: 2.4, stroke: C.soft }); w.text('KG', 0, 78, { size: 64, weight: 800 });
    const du = sub(intro); [-1, 1].forEach(sd => { du.line(sd * 136, 162, sd * 176, 150, { sw: 3 }); du.line(sd * 140, 134, sd * 170, 112, { sw: 2.6, stroke: C.soft }); });
    on(w, p, .7, { loop: 2.2, ox: 0, oy: 164, y: [[0, 0], [.3, 0], [.62, -40, 'out'], [.9, 0, 'in']], sy: [[0, 1], [.1, 1], [.26, .93, 'out'], [.4, 1.04], [.6, 1], [.9, 1], [.96, .9, 'out'], [1.08, 1.03], [1.2, 1, 'soft']], sx: [[0, 1], [.1, 1], [.26, 1.04, 'out'], [.4, .98], [.6, 1], [.9, 1], [.96, 1.06, 'out'], [1.08, .98], [1.2, 1, 'soft']] });
    on(du, p, .7, { loop: 2.2, o: flash(.9, 1.25) });
    thud(p, wO, 164, -200);
  });

  /* badge-percent — a scalloped badge spins in; it turns one scallop at a time while the % pops */
  const BADGE = (() => { const a = []; for (let i = 0; i < 120; i++) { const t = i / 120 * Math.PI * 2, r = 142 + 12 * Math.cos(10 * t); a.push([+(Math.cos(t) * r).toFixed(1), +(Math.sin(t) * r).toFixed(1)]); } return a; })();
  rig('badge-percent-pro', .6, 'spin', p => {
    const intro = sub(p), b = sub(intro); b.shape(BADGE, { fill: C.fill, sw: 3.4 }); b.circle(0, 0, 112, { sw: 1.8, stroke: C.soft });
    on(b, p, .7, { loop: 3, r: [[0, 0], [1.7, 0], [1.82, -3, 'out'], [2.45, 39, 'io'], [2.65, 35, 'soft'], [2.8, 36, 'soft'], [3, 36]] });
    const pc = sub(intro); pc.line(-46, 58, 46, -58, { sw: 10 }); pc.circle(-42, -44, 20, { sw: 7 }); pc.circle(42, 44, 20, { sw: 7 });
    on(pc, p, .7, { loop: 3, s: [[0, 1], [2.5, 1], [2.65, 1.15, 'out'], [2.9, 1, 'soft']] });
    on(intro, p, 0, { s: [[0, .3], [.45, 1.08, 'out'], [.6, 1]], r: [[0, -120], [.55, 0, 'out']], o: [[0, 0], [.15, 1]] });
  });

  /* building — rises out of the ground; its windows switch on and off as if people are working late */
  rig('building-pro', .7, 'squash', p => {
    const intro = sub(p), bO = sub(intro), bd = sub(bO);
    bd.line(30, -176, 30, -196, { sw: 3 }); const al = sub(bd); al.circle(30, -198, 6, { fill: C.ink, sw: 1 });
    on(al, p, .7, { loop: 1.2, ox: 30, oy: -198, o: [[0, 1], [.1, 1], [.14, .2], [1.1, .2], [1.14, 1]], s: [[0, 1.3], [.12, 1], [1.12, 1.3]] });
    bd.rect(-104, -168, 208, 338, { rx: 12, fill: C.fill, sw: 3.4 }); bd.rect(-114, -178, 228, 22, { rx: 6, fill: C.fill, sw: 3 });
    let i = 0;
    for (const y of [-136, -80, -24, 32]) for (const x of [-62, 22]) {
      bd.rect(x, y, 40, 34, { rx: 5, fill: C.fill, sw: 2.6 });
      const lt = sub(bd); lt.rect(x + 7, y + 7, 26, 20, { rx: 3, fill: C.soft, stroke: C.soft, sw: 1 });
      const a = (i * .83) % 2.6; i++;
      on(lt, p, .7, { loop: 3.2, o: [[0, i % 3 ? 1 : 0], [a, i % 3 ? 1 : 0], [a + .04, i % 3 ? 0 : 1], [a + .5, i % 3 ? 0 : 1], [a + .54, i % 3 ? 1 : 0]] });
    }
    bd.rect(-26, 104, 52, 66, { rx: 6, fill: C.fill, sw: 2.8 }); bd.line(10, 136, 10, 142, { sw: 3.4 });
    const gd = intro.line(-180, 171, 180, 171, { sw: 2.6, stroke: C.soft }); on(gd, p, 0, { draw: [[0, 0], [.35, 1, 'out']] });
    grow(p, bO, 0, 170);
  });

  /* factory — saw-tooth roof and a chimney; it rises up, chugs gently, smoke puffs drift out of the chimney */
  rig('factory-pro', .7, 'squash', p => {
    const intro = sub(p);
    [0, 1, 2].forEach(i => { const s = sub(intro); s.circle(130, -128, 17, { fill: C.fill, stroke: C.soft, sw: 2.4 });
      on(s, p, .7 + i * .6, { loop: 1.8, ox: 130, oy: -128, y: [[0, 0], [1.8, -46, 'out']], x: [[0, 0], [1.8, -26, 'soft']], s: [[0, .5], [1.8, 1.4]], o: [[0, 0], [.2, .9], [1.8, 0]] }); });
    const fO = sub(intro), f = sub(fO);
    f.path('M -170 164 L -170 -6 L -100 -56 L -100 -6 L -30 -56 L -30 -6 L 40 -56 L 40 -6 L 104 -6 L 104 -118 L 156 -118 L 156 164 Z', { fill: C.fill, sw: 3.4 });
    [-136, -66, 4].forEach(x => f.rect(x, 52, 36, 30, { rx: 4, fill: C.fill, sw: 2.6 }));
    f.rect(108, 92, 40, 72, { rx: 5, fill: C.fill, sw: 2.6 });
    [-96, -72].forEach(y => f.line(104, y, 156, y, { sw: 2.4, stroke: C.soft }));
    [-100, -30, 40].forEach(x => f.line(x - 60, -14, x - 8, -50, { sw: 1.8, stroke: C.soft }));
    on(f, p, .7, { loop: .9, ox: 0, oy: 164, sy: [[0, 1], [.12, .985, 'out'], [.3, 1, 'soft']] });
    const gd = intro.line(-186, 165, 186, 165, { sw: 2.6, stroke: C.soft }); on(gd, p, 0, { draw: [[0, 0], [.35, 1, 'out']] });
    grow(p, fO, 0, 164);
  });

  /* medal — straps and a starred disc drop in on their ribbon and swing like a pendulum */
  rig('medal-pro', .7, 'rise', p => {
    const intro = sub(p), mO = sub(intro), m = sub(mO);
    m.shape([[-112, -178], [-58, -178], [14, -44], [-34, -30]], { fill: C.fill, sw: 3 });
    m.shape([[112, -178], [58, -178], [-14, -44], [34, -30]], { fill: C.fill, sw: 3 });
    [[-85, -178, -10, -37], [85, -178, 10, -37]].forEach(([a, b, c, d]) => m.line(a, b + 6, c, d - 6, { sw: 2, stroke: C.soft }));
    m.rect(-22, -50, 44, 22, { rx: 8, fill: C.fill, sw: 2.8 });
    const dk = sub(m); dk.circle(0, 52, 96, { fill: C.fill, sw: 3.4 }); dk.circle(0, 52, 76, { sw: 1.8, stroke: C.soft });
    dk.shape(STAR5(0, 58, 44, 19), { fill: C.fill, sw: 2.8 });
    on(dk, p, .7, { loop: 2.8, ox: 0, oy: -40, r: [[0, 0], [.95, 4, 'soft'], [2.35, -4, 'soft'], [2.8, 0, 'soft']] });
    on(m, p, .7, { loop: 2.8, ox: 0, oy: -178, r: [[0, 0], [.7, 5, 'soft'], [2.1, -5, 'soft'], [2.8, 0, 'soft']] });
    drop(p, mO, 0, -140);
  });

  /* package-open — an opened box lands; its two back flaps flap open and the box bounces with excitement */
  rig('package-open-pro', .8, 'squash', p => {
    const intro = sub(p), bO = sub(intro), bx = sub(bO);
    [[[-130, -55], [0, -120], [-40, -176], [-170, -110]], [[0, -120], [130, -55], [170, -110], [40, -176]]].forEach((pts, i) => {
      const fl = sub(bx); fl.shape(pts, { fill: C.fill, sw: 3 });
      const [a, b2, c, d] = pts, mid = (u, v) => [(u[0] + v[0]) / 2, (u[1] + v[1]) / 2];
      fl.line(...mid(a, b2), ...mid(c, d), { sw: 9, stroke: C.soft }); fl.line(...mid(a, b2), ...mid(c, d), { sw: 4, stroke: C.fill });   // torn tape on each flap
      on(fl, p, .8, { loop: 2, ox: i ? 65 : -65, oy: -88, r: [[0, 0], [.2, i ? 7 : -7, 'out'], [.45, 0, 'io'], [.65, i ? 4 : -4, 'out'], [.9, 0, 'io']] }); });
    bx.shape([[-130, -55], [0, -120], [130, -55], [0, 10]], { fill: C.fill, sw: 2.4, stroke: C.soft });
    bx.poly([[-130, -55], [0, -76], [130, -55]], { sw: 1.8, stroke: C.soft }); bx.line(0, -120, 0, -76, { sw: 1.8, stroke: C.soft });   // inner back walls
    bx.shape([[-130, -55], [0, 10], [0, 150], [-130, 85]], { fill: C.fill, sw: 3 });
    bx.shape([[0, 10], [130, -55], [130, 85], [0, 150]], { fill: C.fill, sw: 3 });
    on(bx, p, .8, { loop: 2, ox: 0, oy: 150, y: [[0, 0], [1.14, 0], [1.32, -24, 'out'], [1.5, 0, 'in']], sy: [[0, 1], [1, 1], [1.1, .94, 'out'], [1.2, 1.04], [1.32, 1], [1.5, 1], [1.56, .93, 'out'], [1.66, 1.02], [1.8, 1, 'soft']] });
    thud(p, bO, 150);
  });

  /* headphones — the cups pump on the beat, the band bobs, music notes float up between them */
  rig('headphones-pro', .6, 'pop', p => {
    const intro = sub(p);
    [[-36, 0], [34, .8]].forEach(([x, d]) => { const n = sub(intro);
      n.path(`M ${x} 60 L ${x} 6 Q ${x + 20} 16 ${x + 26} 36`, { sw: 4 }); n.ellipse(x - 11, 62, 14, 10, { fill: C.ink, sw: 1.4 });
      on(n, p, .7 + d, { loop: 1.6, y: [[0, 40], [1.6, -70, 'out']], x: [[0, 0], [.8, 8, 'soft'], [1.6, -4, 'soft']], o: [[0, 0], [.2, 1], [1.2, 1], [1.6, 0]] }); });
    const hp = sub(intro);
    tube(hp, 'M -136 30 L -136 -10 A 136 136 0 0 1 136 -10 L 136 30', 24);
    hp.path('M -70 -124 A 140 140 0 0 1 70 -124', { sw: 30 }); hp.path('M -70 -124 A 140 140 0 0 1 70 -124', { sw: 23, stroke: C.fill });
    [-1, 1].forEach(sd => hp.rect(sd * 136 - 15, -40, 30, 34, { rx: 6, fill: C.fill, sw: 2.6 }));
    on(hp, p, .7, { loop: .8, y: [[0, 0], [.1, 5, 'out'], [.4, 0, 'soft']] });
    [-1, 1].forEach(sd => { const c = sub(hp); c.rect(sd > 0 ? 108 : -172, 0, 64, 142, { rx: 24, fill: C.fill, sw: 3.2 }); c.rect(sd > 0 ? 96 : -116, 14, 20, 114, { rx: 10, fill: C.fill, sw: 2.6 });
      on(c, p, .7, { loop: .8, ox: sd * 140, oy: 71, s: [[0, 1], [.1, 1.07, 'out'], [.35, 1, 'soft']] }); });
    pop(p, intro);
  });

  /* message-square — a square chat bubble pops out of its tail; its lines of text type in, clear, and type again */
  rig('message-square-pro', .6, 'pop', p => {
    const intro = sub(p), bub = sub(intro);
    bub.path('M -150 -126 Q -150 -150 -126 -150 L 126 -150 Q 150 -150 150 -126 L 150 66 Q 150 90 126 90 L -54 90 L -122 150 L -108 90 L -126 90 Q -150 90 -150 66 Z', { fill: C.fill, sw: 3.2 });
    [[-92, 96], [-38, 96], [16, 34]].forEach(([y, xr], i) => { const l = bub.line(-100, y, xr, y, { sw: 7, stroke: C.soft });
      on(l, p, .7, { loop: 3, draw: [[0, 1], [1.8, 1], [2, 0, 'in'], [2.05 + i * .28, 0], [2.33 + i * .28, 1, 'out'], [3, 1]] }); });
    const rr = sub(bub); [0, 18].forEach(dx => rr.poly([[86 + dx, 56], [96 + dx, 66], [116 + dx, 44]], { sw: 3.4 }));
    on(rr, p, .7, { loop: 3, o: [[0, 1], [1.8, 1], [1.9, 0], [2.9, 0], [3, 1]] });
    on(bub, p, 0, { ox: -112, oy: 150, sx: [[0, .3], [.3, 1.12, 'out'], [.45, .96], [.6, 1]], sy: [[0, .3], [.3, .92, 'out'], [.45, 1.04], [.6, 1]] });
    show(p, intro);
  });

  /* box — a closed cube thuds down, then hops with a small tilt and lands with a squash */
  rig('box-pro', .7, 'squash', p => {
    const intro = sub(p), bO = sub(intro), bx = sub(bO);
    bx.shape([[-130, -55], [0, -120], [130, -55], [0, 10]], { fill: C.fill, sw: 3 });
    bx.shape([[-130, -55], [0, 10], [0, 150], [-130, 85]], { fill: C.fill, sw: 3 });
    bx.shape([[0, 10], [130, -55], [130, 85], [0, 150]], { fill: C.fill, sw: 3 });
    bx.line(-65, -87.5, 65, -22.5, { sw: 2.2, stroke: C.soft });
    P.capsule(bx, 44, 32, 86, 11, 9, { sw: 2.4 }); P.capsule(bx, -44, 32, -86, 11, 9, { sw: 2.4 });
    on(bx, p, .7, { loop: 2.2, ox: 0, oy: 150, y: [[0, 0], [.1, 0], [.35, -50, 'out'], [.6, 0, 'in']], r: [[0, 0], [.1, 0], [.3, -6, 'out'], [.6, 0, 'in']],
      sy: [[0, 1], [.1, .9, 'out'], [.2, 1.04], [.35, 1], [.6, 1], [.66, .9, 'out'], [.8, 1, 'soft']] });
    thud(p, bO, 150);
  });

  /* gift — ribboned box with a bow; it rattles with excitement and the lid pops up for a peek */
  rig('gift-pro', .7, 'squash', p => {
    const intro = sub(p), gO = sub(intro), g = sub(gO);
    g.rect(-120, -10, 240, 170, { rx: 10, fill: C.fill, sw: 3.2 }); g.rect(-120, 56, 240, 34, { fill: C.fill, sw: 2.6 }); g.rect(-20, -10, 40, 170, { fill: C.fill, sw: 2.6 });
    const ld = sub(g);
    [-1, 1].forEach(sd => { const bl = sub(ld); bl.path(`M ${sd * -4} -74 C ${sd * 40} -140, ${sd * 122} -132, ${sd * 98} -96 C ${sd * 86} -78, ${sd * 40} -74, ${sd * 4} -74 Z`, { fill: C.fill, sw: 3 });
      on(bl, p, .7, { loop: 2.6, ox: 0, oy: -76, r: [[0, 0], [.6, 0], [.7, sd * -8, 'out'], [.9, sd * 10, 'io'], [1.05, sd * -5, 'io'], [1.2, sd * 2, 'io'], [1.35, 0, 'soft']] }); });
    ld.rect(-140, -74, 280, 64, { rx: 10, fill: C.fill, sw: 3.2 }); ld.rect(-20, -74, 40, 64, { fill: C.fill, sw: 2.6 });
    [-1, 1].forEach(sd => ld.path(`M ${sd * 6} -82 L ${sd * 40} -48 L ${sd * 30} -40 L ${sd * 20} -50 L ${sd * 14} -40 Z`, { fill: C.fill, sw: 2.4 }));
    ld.rect(-18, -92, 36, 24, { rx: 9, fill: C.fill, sw: 2.6 });
    on(g, p, .7, { loop: 2.6, ox: 0, oy: 160, r: shakeKeys(6, 3, .05) });
    on(ld, p, .7, { loop: 2.6, ox: 0, oy: -42, y: [[0, 0], [.5, 0], [.66, -36, 'out'], [.9, 0, 'in']], r: [[0, 0], [.5, 0], [.66, -6, 'out'], [.9, 0, 'in']] });
    thud(p, gO, 160);
  });

  /* palette — swings in; the paint dabs pop one after another while the palette sways */
  rig('palette-pro', .6, 'pop', p => {
    const intro = sub(p), pl = sub(intro);
    pl.path('M 0 -160 C 104 -160, 172 -92, 172 -14 C 172 46, 128 72, 84 64 C 48 58, 26 80, 34 112 C 42 146, 22 164, -8 164 C -104 164, -172 92, -172 0 C -172 -92, -100 -160, 0 -160 Z', { fill: C.fill, sw: 3.4 });
    pl.ellipse(-52, 92, 26, 20, { sw: 3 });
    const br = sub(pl); P.capsule(br, -20, 150, 70, 30, 9, { sw: 2.6 }); br.path('M 70 30 L 84 8 Q 100 -14 112 -6 Q 118 6 100 24 L 82 38 Z', { fill: C.fill, sw: 2.6 }); br.line(64, 26, 80, 40, { sw: 2.4, stroke: C.soft });
    on(br, p, .7, { loop: 2.4, ox: -20, oy: 150, r: [[0, 0], [1.2, 0], [1.35, -6, 'out'], [1.5, 0, 'in'], [1.65, -6, 'out'], [1.8, 0, 'in']] });
    [[-96, -10], [-56, -94], [30, -108], [104, -54]].forEach(([x, y], i) => { const d = sub(pl); d.circle(x, y, 24, { fill: C.soft, stroke: C.ink, sw: 2.4 });
      on(d, p, .7, { loop: 2.4, ox: x, oy: y, s: [[0, 1], [i * .25, 1], [i * .25 + .1, 1.25, 'out'], [i * .25 + .35, 1, 'soft']] }); });
    on(pl, p, .7, { loop: 3, r: [[0, 0], [.75, 4, 'soft'], [2.25, -4, 'soft'], [3, 0, 'soft']] });
    on(intro, p, 0, { s: [[0, .4], [.42, 1.08, 'out'], [.62, 1]], r: [[0, -40], [.5, 0, 'out']], o: [[0, 0], [.16, 1]] });
  });

  /* user-x — a person rises in, a cross stamps in beside them; the cross shakes "no" and the person leans back */
  rig('user-x-pro', .7, 'sink', p => {
    const intro = sub(p), uO = sub(intro), u = sub(uO), q = u.child({ transform: 'translate(-44 10) scale(.86)' }, .86);
    q.path('M -118 150 C -118 64, -70 30, 0 30 C 70 30, 118 64, 118 150 Z', { fill: C.fill, sw: 3 }); q.path('M -30 34 L 0 74 L 30 34', { sw: 2 });
    q.circle(0, -52, 62, { fill: C.fill, sw: 3 });
    on(u, p, .7, { loop: 2.6, ox: -44, oy: 139, r: [[0, 0], [1.2, 0], [1.35, -5, 'out'], [1.9, 0, 'soft']] });
    const xO = sub(intro), x = sub(xO); x.circle(130, -40, 46, { fill: C.fill, sw: 3.2 }); x.line(110, -60, 150, -20, { sw: 10 }); x.line(150, -60, 110, -20, { sw: 10 });
    on(x, p, .7, { loop: 2.6, ox: 130, oy: -40, r: [[0, 0], ...shift(shakeKeys(5, 12, .06).slice(1), 1.2)] });
    on(xO, p, .35, { ox: 130, oy: -40, s: [[0, 0], [.3, 1.15, 'out'], [.45, 1]], o: [[0, 0], [.05, 1]] });
    rise(p, uO, 0, 60);
    show(p, intro);
  });

  /* key — slides in along its own line, pushes into the lock, turns over (teeth swap sides) and back, then pulls out a little */
  rig('key-pro', .7, 'slide', p => {
    const intro = sub(p), kO = sub(intro), k = sub(kO), g = k.child({ transform: 'rotate(-35)' }), t = sub(g);
    t.path('M 98 10 L 98 50 L 122 50 L 122 10', { fill: C.fill, sw: 3 }); t.path('M 132 10 L 132 38 L 152 38 L 152 10', { fill: C.fill, sw: 3 });
    t.rect(-50, -14, 210, 28, { rx: 8, fill: C.fill, sw: 3 }); t.line(-30, 0, 146, 0, { sw: 2, stroke: C.soft });

    t.circle(-104, 0, 64, { fill: C.fill, sw: 3.4 }); t.circle(-126, 0, 20, { sw: 3 });
    t.rect(-42, -22, 18, 44, { rx: 6, fill: C.fill, sw: 2.6 });
    on(k, p, .7, { loop: 2.6, x: [[0, 0], [.12, -6, 'out'], [.34, 18, 'out'], [.42, 16, 'soft'], [1.5, 16], [1.8, 0, 'io']], y: [[0, 0], [.12, 4.3, 'out'], [.34, -12.9, 'out'], [.42, -11.5, 'soft'], [1.5, -11.5], [1.8, 0, 'io']] });
    const ck = sub(intro); [[150, -150, 170, -170], [168, -122, 192, -130], [128, -170, 132, -194]].forEach(([a, b, c, d]) => ck.line(a, b, c, d, { sw: 3 }));
    on(ck, p, .7, { loop: 2.6, o: [[0, 0], [.7, 0], [.72, 1], [1, 0]] });
    on(t, p, .7, { loop: 2.6, sy: [[0, 1], [.4, 1], [.7, -1, 'io'], [1.2, -1], [1.5, 1, 'io']] });
    on(kO, p, 0, { x: [[0, -170], [.6, 0, 'out']], y: [[0, 119], [.6, 0, 'out']], o: [[0, 0], [.15, 1]] });
  });

  /* glasses — drop in, then get nudged up the nose and settle */
  rig('glasses-pro', .6, 'rise', p => {
    const intro = sub(p), gO = sub(intro), gl = sub(gO);
    [-1, 1].forEach(sd => gl.path(`M ${sd * 152} 6 L ${sd * 184} -50`, { sw: 4.4 }));
    [-1, 1].forEach(sd => { gl.circle(sd * 88, 20, 66, { fill: C.fill, sw: 3.6 }); gl.circle(sd * 88, 20, 54, { sw: 1.6, stroke: C.soft }); });
    gl.path('M -24 6 Q 0 -16 24 6', { sw: 4.4 });
    [-1, 1].forEach(sd => { gl.rect(sd * 154 - 8, -2, 16, 16, { rx: 4, fill: C.fill, sw: 2.4 }); gl.ellipse(sd * 30, 44, 7, 12, { fill: C.fill, sw: 2.2 }); });
    on(gl, p, .7, { loop: 2.4, y: [[0, 0], [1.4, 0], [1.55, -16, 'out'], [1.8, 0, 'in'], [1.88, -3], [1.96, 0]], r: [[0, 0], [1.4, 0], [1.55, -3, 'out'], [1.96, 0, 'soft']] });
    drop(p, gO, 0, -120);
  });

  /* activity — the pulse line draws across; a bright dot runs along it and the line jumps when the dot crosses the spike */
  rig('activity-pro', .8, 'pop', p => {
    const intro = sub(p); show(p, intro);
    const PTS = [[-184, 10], [-96, 10], [-64, -110], [-4, 130], [38, -60], [70, 10], [184, 10]];
    [-70, 90].forEach(y => { const gl = intro.line(-184, y, 184, y, { sw: 1.6, stroke: C.soft }); on(gl, p, .1, { draw: [[0, 0], [.5, 1, 'out']] }); });
    const hO = sub(intro), hb = sub(hO), hh = hb.child({ transform: 'translate(-150 -130) scale(.42)' }, .42); hh.path(HEART, { fill: C.fill, sw: 3 });
    on(hO, p, .5, { ox: -150, oy: -130, s: [[0, 0], [.3, 1.1, 'out'], [.45, 1]], o: [[0, 0], [.05, 1]] });
    const lg = sub(intro), ln = lg.poly(PTS, { sw: 7 }); on(ln, p, 0, { draw: [[0, 0], [.7, 1, 'io']] });
    const L = [0]; for (let i = 1; i < PTS.length; i++) L.push(L[i - 1] + Math.hypot(PTS[i][0] - PTS[i - 1][0], PTS[i][1] - PTS[i - 1][1]));
    const T = 1.8, tt = L.map(l => +(l / L[L.length - 1] * T).toFixed(3));
    const dt = sub(intro); dt.circle(0, 0, 13, { fill: C.ink, sw: 2 });
    on(dt, p, .8, { loop: 2.4, x: PTS.map(([x], i) => [tt[i], x, 'lin']), y: PTS.map(([, y], i) => [tt[i], y, 'lin']), o: [[0, 0], [.05, 1], [T, 1], [T + .1, 0]] });
    on(hb, p, .8, { loop: 2.4, ox: -150, oy: -130, s: [[0, 1], [tt[2], 1], [tt[2] + .08, 1.22, 'out'], [tt[2] + .22, .95], [tt[2] + .34, 1.1], [tt[2] + .5, 1]] });
    on(lg, p, .8, { loop: 2.4, ox: 0, oy: 10, sy: [[0, 1], [tt[2], 1], [tt[2] + .1, 1.1, 'out'], [tt[3] + .2, 1, 'soft']] });
  });

  /* droplet — falls in and lands with a jelly wobble; it lifts and drips again, a ripple spreading under it each landing */
  rig('droplet-pro', .7, 'rise', p => {
    const intro = sub(p);
    const rp = sub(intro); rp.ellipse(0, 166, 90, 14, { sw: 2.4, stroke: C.soft });
    on(rp, p, .7, { loop: 2.2, ox: 0, oy: 166, s: [[0, .3], [.9, 1.2, 'out']], o: [[0, 0], [.05, .9], [.9, 0]] });
    [-1, 1].forEach(sd => { const sp = sub(intro); sp.path(DROP(sd * 110, 150, 10), { fill: C.fill, sw: 2.4 });
      on(sp, p, .7, { loop: 2.2, x: [[0, 0], [.5, sd * 36, 'out']], y: [[0, 0], [.25, -44, 'out'], [.5, -8, 'in']], o: [[0, 0], [.02, 1], [.42, 1], [.5, 0]] }); });
    const dO = sub(intro), d = sub(dO); d.path(DROP(0, 30, 96), { fill: C.fill, sw: 3.4 });
    on(d, p, .7, { loop: 2.2, ox: 0, oy: 155, sy: [[0, 1], [.1, .88, 'out'], [.3, 1.06], [.5, .97], [.7, 1, 'soft']], sx: [[0, 1], [.1, 1.08, 'out'], [.3, .96], [.5, 1.02], [.7, 1, 'soft']],
      y: [[0, 0], [1.6, 0], [1.9, -24, 'out'], [2.2, 0, 'in']] });
    const st = sub(dO); st.g.appendChild(d.g); on(st, p, .7, { loop: 2.2, ox: 0, oy: 155, sy: [[0, 1], [1.45, 1], [1.6, .92, 'out'], [1.85, 1.08, 'out'], [2.1, 1.04], [2.2, 1]], sx: [[0, 1], [1.45, 1], [1.6, 1.06, 'out'], [1.85, .95, 'out'], [2.2, 1]] });
    drop(p, dO, 0, -150);
  });

  Object.assign(G.icons, R);
  const ALIAS = { 'chart-column': 'chart-column-pro', 'shield-check': 'shield-check-pro', angry: 'angry-pro', leaf: 'leaf-pro', weight: 'weight-pro',
    'badge-percent': 'badge-percent-pro', discount: 'badge-percent-pro', building: 'building-pro', factory: 'factory-pro', medal: 'medal-pro',
    'package-open': 'package-open-pro', unbox: 'package-open-pro', headphones: 'headphones-pro', 'message-square': 'message-square-pro', box: 'box-pro',
    gift: 'gift-pro', palette: 'palette-pro', 'user-x': 'user-x-pro', key: 'key-pro', glasses: 'glasses-pro', activity: 'activity-pro', droplet: 'droplet-pro' };
  for (const [a, pro] of Object.entries(ALIAS)) { if (G.icons[a] && !G.icons[a + '-basic'] && !G.icons[a].custom) G.icons[a + '-basic'] = G.icons[a]; G.icons[a] = R[pro]; }
  G.PRO8 = Object.keys(R);
})();
