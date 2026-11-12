/* pro.js — rigged animated icons ("-pro"): finer line detail + keyframed part animation
   (anticipation, squash & stretch, follow-through, damped settle, secondary motion).
   Each icon is a rig: separate groups for every moving part, each with its own keyframe track (GL.kf).
   Use like any icon:  GL.art(GL.icons['bell-pro'], { x, y, w })  ·  GL.spot({ icon: 'bell-pro', label })  ·  beats { icon: 'bell-pro' } */
(function () {
  const G = window.GL, C = G.C, P = G.parts;
  const sub = (p, attrs) => p.child(attrs || {});
  const on = (q, p, start, spec) => G.kf(q.g || q, p.t0 + start * p.ts, spec);   // animate a group (Pen) or element
  const star4 = (p, x, y, r, o = {}) => p.path(`M ${x} ${y - r} Q ${x + r * .16} ${y - r * .16} ${x + r} ${y} Q ${x + r * .16} ${y + r * .16} ${x} ${y + r} Q ${x - r * .16} ${y + r * .16} ${x - r} ${y} Q ${x - r * .16} ${y - r * .16} ${x} ${y - r} Z`, Object.assign({ fill: C.ink, sw: 1.4 }, o));
  const HEART = 'M 0 70 C -96 8, -86 -72, -38 -72 C -14 -72, 0 -54, 0 -38 C 0 -54, 14 -72, 38 -72 C 86 -72, 96 8, 0 70 Z';
  const R = {};
  const rig = (name, dur, fn) => { fn.custom = true; fn.dur = dur; R[name] = fn; };

  /* 1 ── heart: beat with squash & stretch, echo ripples, sparkles */
  rig('heart-pro', .8, p => {
    const intro = sub(p), beat = sub(intro);
    [0, .2].forEach(d => { const w = sub(intro); const h = w.child({ transform: 'scale(1.9)' }, 1.9); h.path(HEART, { stroke: C.soft, sw: 1.8 });
      on(w, p, .7, { loop: 1.6, s: [[d, 1], [d + .9, 1.5, 'out']], o: [[d, 0], [d + .04, .7], [d + .9, 0, 'out']] }); });
    const h = beat.child({ transform: 'scale(1.9)' }, 1.9);
    h.path(HEART, { fill: C.fill });
    h.path('M 0 50 C -66 6, -62 -52, -36 -54 C -20 -55, -8 -46, -4 -34', { stroke: C.soft, sw: 1.3 });
    h.path('M 0 50 C 66 6, 62 -52, 36 -54 C 20 -55, 8 -46, 4 -34', { stroke: C.soft, sw: 1.3 });
    h.path('M -64 -26 Q -64 -52 -40 -58', { sw: 3.6 });
    h.dot(-68, -12, 2.6);
    on(beat, p, .7, { loop: 1.6, sx: [[0, 1], [.1, 1.14, 'out'], [.22, .94], [.34, 1.06], [.5, 1]], sy: [[0, 1], [.1, .88, 'out'], [.22, 1.08], [.34, .97], [.5, 1]] });
    [[-150, -110, 18], [156, -96, 14], [132, 118, 12]].forEach(([x, y, r], i) => { const sp = sub(intro); star4(sp, x, y, r);
      on(sp, p, .8 + i * .22, { loop: 1.6, ox: x, oy: y, s: [[0, 0], [.22, 1.1, 'back'], [.5, 0, 'in']], r: [[0, 0], [.5, 90, 'lin']] }); });
    on(intro, p, 0, { s: [[0, .3], [.42, 1.14, 'out'], [.7, 1]], o: [[0, 0], [.18, 1]] });
  });

  /* 2 ── bell: damped swing from the top, clapper lags behind, sound waves on each swing */
  rig('bell-pro', .7, p => {
    const intro = sub(p), cy = -20;
    const wave = side => { const w = sub(intro); [140, 166, 192].forEach((r, i) => { const a1 = -.6, a2 = .6;
      w.path(`M ${side * r * Math.cos(a1)} ${cy + r * Math.sin(a1)} A ${r} ${r} 0 0 ${side > 0 ? 1 : 0} ${side * r * Math.cos(a2)} ${cy + r * Math.sin(a2)}`, { stroke: C.soft, sw: 3 - i * .6 }); }); return w; };
    const wr = wave(1), wl = wave(-1);
    on(wr, p, .7, { loop: 2.6, ox: 0, oy: cy, o: [[0, 0], [.12, 0], [.18, 1], [.5, 0]], s: [[.12, .9], [.5, 1.1, 'out']] });
    on(wl, p, .7, { loop: 2.6, ox: 0, oy: cy, o: [[0, 0], [.32, 0], [.38, 1], [.68, 0]], s: [[.32, .9], [.68, 1.1, 'out']] });
    const sw = sub(intro), cl = sub(sw);
    cl.line(0, 70, 0, 100, { sw: 3 }); cl.circle(0, 110, 16, { fill: C.fill, sw: 3 }); cl.dot(-5, 105, 2.4);
    sw.circle(0, -128, 11, { fill: C.fill, sw: 3 });
    sw.path('M -16 -112 C -70 -104, -84 -60, -86 -6 C -88 40, -100 58, -122 72 L 122 72 C 100 58, 88 40, 86 -6 C 84 -60, 70 -104, 16 -112 Z', { fill: C.fill });
    sw.path('M -86 22 Q 0 38 86 22', { stroke: C.soft, sw: 1.6 }); sw.path('M -84 4 Q 0 20 84 4', { stroke: C.soft, sw: 1.2 });
    sw.rect(-130, 68, 260, 22, { rx: 11, fill: C.fill, sw: 3 });
    sw.path('M -58 -62 Q -68 -24 -66 14', { sw: 3.4 }); sw.dot(-66, 30, 2.4);
    on(sw, p, .7, { loop: 2.6, ox: 0, oy: -128, r: [[0, 0], [.14, -20, 'out'], [.34, 16], [.52, -10], [.68, 6], [.82, -2.5], [.95, 0]] });
    on(cl, p, .7, { loop: 2.6, ox: 0, oy: 70, r: [[0, 0], [.18, 16, 'out'], [.38, -14], [.56, 9], [.72, -4], [.9, 0]] });
    on(intro, p, 0, { y: [[0, -90], [.55, 0, 'back']], o: [[0, 0], [.22, 1]] });
  });

  /* 3 ── alarm clock: second hand sweeps, then the clock rings (shake + hammer + vibration lines) */
  rig('alarm-pro', .6, p => {
    const intro = sub(p), body = sub(intro);
    body.line(-70, 96, -98, 142, { sw: 5 }); body.line(70, 96, 98, 142, { sw: 5 });
    const ham = sub(body); ham.line(0, -118, 0, -152, { sw: 3 }); ham.circle(0, -158, 9, { fill: C.fill, sw: 2.6 });
    [-1, 1].forEach(sd => { const b = body.child({ transform: `translate(${sd * 80} -108) rotate(${sd * 32})` });
      b.path('M -42 0 A 42 42 0 0 1 42 0 Z', { fill: C.fill }); b.line(-30, 0, 30, 0, { sw: 1.4, stroke: C.soft }); b.line(0, 0, 0, 14, { sw: 4 }); });
    const vib = sd => { const v = sub(body); [[0, 0], [16, 22]].forEach(([dx, dy]) => v.path(`M ${sd * (140 + dx)} ${-130 + dy} q ${sd * 10} 14 0 28`, { stroke: C.soft, sw: 2.6 })); return v; };
    const vr = vib(1), vl = vib(-1);
    body.circle(0, 0, 122, { fill: C.fill, sw: 3.4 }); body.circle(0, 0, 108, { stroke: C.soft, sw: 1.6 });
    for (let i = 0; i < 60; i++) { const a = i * Math.PI / 30, big = i % 5 === 0, r1 = big ? 84 : 92;
      body.line(Math.sin(a) * r1, -Math.cos(a) * r1, Math.sin(a) * 98, -Math.cos(a) * 98, { sw: big ? 3 : 1.1, stroke: big ? C.ink : C.soft }); }
    body.path('M -84 -44 A 95 95 0 0 1 -44 -84', { sw: 3.2 });
    const hr = sub(body); hr.line(0, 8, 0, -52, { sw: 6.5 });
    const mn = sub(body); mn.line(0, 12, 0, -78, { sw: 4.4 });
    const sc = sub(body); sc.line(0, 22, 0, -90, { sw: 1.6 }); sc.circle(0, -70, 5, { fill: C.fill, sw: 1.6 });
    body.circle(0, 0, 9, { fill: C.fill, sw: 2.6 }); body.dot(0, 0, 3);
    on(hr, p, 0, { r: [[0, -58]] });
    on(mn, p, .6, { loop: 48, r: [[0, 60], [48, 420, 'lin']] });
    on(sc, p, .6, { loop: 6, r: [[0, 0], [6, 360, 'lin']] });
    const shake = [[0, 0]]; for (let i = 1; i <= 9; i++) shake.push([i * .055, i % 2 ? -5 : 5, 'lin']); shake.push([.56, 0, 'out']);
    on(body, p, .6, { loop: 2.6, ox: 0, oy: 140, r: shake });
    const hk = [[0, 0]]; for (let i = 1; i <= 9; i++) hk.push([i * .055, i % 2 ? -26 : 26, 'lin']); hk.push([.56, 0, 'out']);
    on(ham, p, .6, { loop: 2.6, ox: 0, oy: -118, r: hk });
    [vr, vl].forEach(v => on(v, p, .6, { loop: 2.6, o: [[0, 0], [.03, 1], [.5, 1], [.62, 0]] }));
    on(intro, p, 0, { s: [[0, .4], [.45, 1.08, 'out'], [.65, 1]], o: [[0, 0], [.18, 1]] });
  });

  /* 4 ── light bulb: flickers on, filament glows, rays extend one by one then breathe */
  rig('bulb-pro', 1.3, p => {
    const intro = sub(p), cx = 0, cy = -40, rays = sub(intro);
    [-180, -150, -120, -90, -60, -30, 0, 30, 150].forEach((deg, i) => { const a = deg * Math.PI / 180, x1 = cx + Math.cos(a) * 112, y1 = cy + Math.sin(a) * 112;
      const r = sub(rays); r.line(x1, y1, cx + Math.cos(a) * 146, cy + Math.sin(a) * 146, { sw: 3.4 });
      on(r, p, .95 + i * .05, { ox: x1, oy: y1, s: [[0, 0], [.3, 1, 'back']] }); });
    on(rays, p, 1.6, { loop: 2, ox: cx, oy: cy, s: [[0, 1], [1, 1.06, 'soft'], [2, 1, 'soft']], o: [[0, 1], [1, .55, 'soft'], [2, 1, 'soft']] });
    const lit = sub(intro);
    const halo = sub(lit); halo.circle(0, 0, 24, { stroke: C.soft, sw: 1.4 }); halo.circle(0, 0, 36, { stroke: C.soft, sw: 1 });
    lit.path('M -34 62 C -34 30, -78 8, -78 -40 A 78 78 0 1 1 78 -40 C 78 8, 34 30, 34 62 Z', { fill: C.fill, sw: 3.2 });
    lit.path('M -62 -36 A 62 62 0 0 1 -6 -100', { stroke: C.soft, sw: 1.4 });
    lit.path('M -54 -54 Q -50 -84 -24 -96', { sw: 3.6 }); lit.dot(-58, -38, 2.6);
    lit.line(-14, 62, -14, 8, { sw: 2 }); lit.line(14, 62, 14, 8, { sw: 2 });
    lit.path('M -14 8 q 3.5 -18 7 0 q 3.5 -18 7 0 q 3.5 -18 7 0 q 3.5 -18 7 0', { sw: 2.4 });
    on(halo, p, 1.0, { loop: 1.4, s: [[0, .9], [.7, 1.15, 'soft'], [1.4, .9, 'soft']], o: [[0, .9], [.7, .3, 'soft'], [1.4, .9, 'soft']] });
    intro.rect(-38, 62, 76, 14, { rx: 4, fill: C.fill, sw: 3 });
    [[-34, 76, 68], [-31, 89, 62], [-28, 102, 56]].forEach(([x, y, w]) => intro.rect(x, y, w, 13, { rx: 6.5, fill: C.fill, sw: 2.4 }));
    intro.path('M -14 115 Q 0 130 14 115', { sw: 3.2 });
    on(lit, p, .35, { o: [[0, .3], [.3, .3], [.34, 1, 'lin'], [.4, .35, 'lin'], [.46, 1, 'lin'], [.53, .55, 'lin'], [.6, 1, 'lin']] });
    on(intro, p, 0, { y: [[0, 40], [.45, 0, 'out']], o: [[0, 0], [.2, 1]] });
  });

  /* 5 ── mail: envelope slides in, flap flips open, letter rises with overshoot, badge pops */
  rig('mail-pro', 2, p => {
    const intro = sub(p);
    intro.rect(-150, -70, 300, 190, { rx: 12, fill: C.fill, sw: 3 });
    const back = sub(intro); back.shape([[-146, -70], [0, 34], [146, -70]], { fill: C.fill, sw: 2.6 });
    const lo = sub(intro), li = sub(lo);
    li.rect(-122, -58, 244, 150, { rx: 6, fill: C.fill, sw: 2.6 });
    li.line(-96, -30, 30, -30, { sw: 3 });
    [-6, 14, 34].forEach((y, i) => li.line(-96, y, 96 - i * 30, y, { sw: 1.5, stroke: C.soft }));
    li.path('M 40 66 q 10 -12 20 0 t 20 0 t 20 0', { sw: 1.6 });
    intro.path('M -150 -60 L 0 44 L 150 -60 L 150 108 Q 150 120 138 120 L -138 120 Q -150 120 -150 108 Z', { fill: C.fill, sw: 3 });
    intro.line(-142, 112, -26, 30, { sw: 1.4, stroke: C.soft }); intro.line(142, 112, 26, 30, { sw: 1.4, stroke: C.soft });
    const front = sub(intro); front.shape([[-150, -70], [0, 40], [150, -70]], { fill: C.fill, sw: 3 }); front.path('M -118 -64 L 0 18 L 118 -64', { stroke: C.soft, sw: 1.3 });
    front.circle(0, 22, 10, { fill: C.fill, sw: 2 });
    const bo = sub(intro), bi = sub(bo); bi.circle(138, -76, 28, { fill: C.fill, sw: 3.2 }); bi.text('1', 138, -65, { size: 32, at: 0, dur: .01 });
    on(intro, p, 0, { x: [[0, -300], [.6, 0, 'back']], r: [[0, -12], [.6, 0, 'out']], o: [[0, 0], [.15, 1]] });
    on(front, p, .8, { ox: 0, oy: -70, sy: [[0, 1], [.2, 0, 'in']], o: [[.2, 1], [.21, 0, 'lin']] });
    on(back, p, .8, { ox: 0, oy: -70, sy: [[.2, 0], [.45, -1, 'out']], o: [[.19, 0], [.2, 1, 'lin']] });
    on(lo, p, 1.1, { y: [[0, 0], [.55, -112, 'back']] });
    on(li, p, 1.9, { loop: 2.4, y: [[0, 0], [1.2, -6, 'soft'], [2.4, 0, 'soft']] });
    on(bo, p, 1.55, { ox: 138, oy: -76, s: [[0, 0], [.35, 1, 'back']] });
    on(bi, p, 2.2, { loop: 1.8, ox: 138, oy: -76, s: [[0, 1], [.12, 1.16, 'out'], [.3, 1]] });
  });

  /* 6 ── rocket: dips (anticipation), launches up, hovers; flames flicker, smoke puffs, speed lines */
  rig('rocket-pro', .8, p => {
    const intro = sub(p);
    [[-36, 150, 20], [0, 166, 24], [34, 150, 18], [-14, 140, 16]].forEach(([x, y, r], i) => { const s = sub(intro); s.circle(x, y, r, { fill: C.fill, stroke: C.soft, sw: 2 });
      on(s, p, .6 + i * .22, { loop: .9, ox: x, oy: y, s: [[0, .4], [.9, 1.35, 'out']], o: [[0, .9], [.9, 0, 'out']], y: [[0, -10], [.9, 26, 'out']] }); });
    [[-84, -40, 46], [-104, 20, 56], [84, -20, 52], [104, 40, 48]].forEach(([x, y, l], i) => { const s = sub(intro); s.line(x, y, x, y + l, { sw: 2.2, stroke: C.soft });
      on(s, p, .7 + i * .2, { loop: .8, y: [[0, -40], [.8, 70, 'lin']], o: [[0, 0], [.2, 1], [.8, 0]] }); });
    const hov = sub(intro);
    const fo = sub(hov); fo.path('M -24 94 Q -28 134 0 176 Q 28 134 24 94 Z', { fill: C.fill, sw: 3 });
    const fi = sub(hov); fi.path('M -12 94 Q -13 122 0 146 Q 13 122 12 94 Z', { fill: C.ink, sw: 1.4 });
    on(fo, p, .5, { loop: .32, ox: 0, oy: 94, sy: [[0, 1], [.08, 1.2], [.16, .9], [.24, 1.12], [.32, 1]], sx: [[0, 1], [.08, .92], [.16, 1.06], [.32, 1]] });
    on(fi, p, .5, { loop: .24, ox: 0, oy: 94, sy: [[0, 1], [.06, 1.25], [.14, .85], [.24, 1]] });
    hov.path('M -40 40 L -82 88 Q -86 100 -72 100 L -40 84 Z', { fill: C.fill }); hov.path('M 40 40 L 82 88 Q 86 100 72 100 L 40 84 Z', { fill: C.fill });
    hov.rect(-27, 86, 54, 14, { rx: 4, fill: C.fill, sw: 2.6 });
    hov.path('M 0 -152 C 34 -120, 44 -60, 44 0 L 44 70 Q 44 88 28 90 L -28 90 Q -44 88 -44 70 L -44 0 C -44 -60, -34 -120, 0 -152 Z', { fill: C.fill, sw: 3.2 });
    hov.path('M -33 -88 Q 0 -100 33 -88', { stroke: C.soft, sw: 1.6 }); hov.line(-44, 44, 44, 44, { stroke: C.soft, sw: 1.6 });
    [-30, -10, 10, 30].forEach(x => hov.dot(x, 56, 2.4));
    hov.circle(0, -30, 24, { fill: C.fill, sw: 3.2 }); hov.circle(0, -30, 15, { stroke: C.soft, sw: 1.4 }); hov.path('M -12 -38 Q -8 -46 0 -48', { sw: 2.6 });
    hov.path('M -30 -20 Q -32 20 -30 60', { sw: 2.2, stroke: C.soft });
    on(hov, p, .8, { loop: 1.6, ox: 0, oy: 0, y: [[0, 0], [.8, -8, 'soft'], [1.6, 0, 'soft']], r: [[0, 0], [.8, 1.6, 'soft'], [1.6, 0, 'soft']] });
    on(intro, p, 0, { y: [[0, 200], [.15, 214, 'out'], [.75, 0, 'back']], o: [[0, 0], [.12, 1]] });
  });

  /* 7 ── growth chart: bars grow with overshoot, trend line draws through them, arrow nudges up */
  rig('growth-pro', 1.7, p => {
    const intro = sub(p), base = 130;
    [60, -10, -80].forEach(y => intro.line(-166, y, 178, y, { stroke: C.rule, sw: 1.2 }));
    intro.line(-170, -150, -170, base, { sw: 3 }); intro.line(-170, base, 182, base, { sw: 3 });
    [60, -10, -80].forEach(y => intro.line(-178, y, -170, y, { sw: 2 }));
    const xs = [-130, -70, -10, 50, 110], hs = [52, 88, 70, 126, 174];
    xs.forEach((x, i) => { const bo = sub(intro), bi = sub(bo), last = i === xs.length - 1, top = base - hs[i];
      bi.rect(x - 20, top, 40, hs[i], { rx: 6, fill: C.fill, sw: last ? 3.4 : 2.4, stroke: last ? C.ink : C.soft });
      bi.line(x - 10, top + 12, x - 10, base - 10, { sw: 1.2, stroke: C.soft });
      on(bo, p, .2 + i * .1, { ox: x, oy: base, sy: [[0, 0], [.45, 1, 'back']] });
      on(bi, p, 1.8 + i * .12, { loop: 2.2, ox: x, oy: base, sy: [[0, 1], [.3, 1.06, 'out'], [.7, 1, 'soft']] }); });
    const pts = [[-110, 64], [-50, 28], [10, 46], [70, -14], [130, -62], [166, -98]];
    const tl = intro.poly(pts, { sw: 3.6 }); on(tl, p, .9, { draw: [[0, 0], [.7, 1, 'io']] });
    pts.slice(0, 5).forEach(([x, y], i) => { const d = sub(intro); d.circle(x, y, 7, { fill: C.fill, sw: 2.6 }); on(d, p, .95 + i * .13, { ox: x, oy: y, s: [[0, 0], [.25, 1, 'back']] }); });
    const ao = sub(intro), ai = sub(ao); ai.poly([[146, -100], [168, -100], [168, -78]], { sw: 4 });
    on(ao, p, 1.55, { ox: 168, oy: -100, s: [[0, 0], [.3, 1, 'back']] });
    on(ai, p, 2, { loop: 1.6, x: [[0, 0], [.8, 6, 'soft'], [1.6, 0, 'soft']], y: [[0, 0], [.8, -6, 'soft'], [1.6, 0, 'soft']] });
    const sp = sub(intro); star4(sp, 186, -140, 14);
    on(sp, p, 1.8, { loop: 1.8, ox: 186, oy: -140, s: [[0, 0], [.3, 1.1, 'back'], [.8, 0, 'in']], r: [[0, 0], [.8, 90, 'lin']] });
    on(intro, p, 0, { o: [[0, 0], [.2, 1]] });
  });

  /* 8 ── gears: two meshed gears turning against each other (teeth stay interlocked) */
  const gear = (R, N, d = 16) => {
    const st = 2 * Math.PI / N, pts = [];
    for (let i = 0; i < N; i++) { const a = i * st; [[R - d, a - st * .27], [R, a - st * .14], [R, a + st * .14], [R - d, a + st * .27]].forEach(([r, b]) => pts.push(`${(r * Math.cos(b)).toFixed(1)} ${(r * Math.sin(b)).toFixed(1)}`)); }
    return 'M ' + pts.join(' L ') + ' Z';
  };
  rig('gears-pro', .7, p => {
    const intro = sub(p);
    const mk = (cx, cy, R, N, holes, rot0, turn, period) => {
      const o = intro.child({ transform: `translate(${cx} ${cy})` }), g = sub(o);
      g.path(gear(R, N), { fill: C.fill, sw: 3 });
      g.circle(0, 0, R - 34, { stroke: C.soft, sw: 1.6 });
      for (let i = 0; i < holes; i++) { const a = i * 2 * Math.PI / holes; g.circle(Math.cos(a) * (R - 58) * .9, Math.sin(a) * (R - 58) * .9, R * .1, { stroke: C.soft, sw: 1.6 }); }
      g.circle(0, 0, R * .26, { fill: C.fill, sw: 3 }); g.circle(0, 0, R * .1, { sw: 2 });
      g.path(`M ${-(R - 26) * .7} ${-(R - 26) * .7} A ${R - 26} ${R - 26} 0 0 1 0 ${-(R - 26)}`, { sw: 2.4 });
      on(g, p, .7, { loop: period, r: [[0, rot0], [period, rot0 + turn, 'lin']] });
    };
    mk(-55, -20, 105, 12, 6, 10, 360, 8);
    mk(63.7, 79.6, 66, 8, 4, 17.5, -540, 8);
    on(intro, p, 0, { s: [[0, .5], [.5, 1.06, 'out'], [.7, 1]], r: [[0, -40], [.6, 0, 'out']], o: [[0, 0], [.2, 1]] });
  });

  /* 9 ── target: arrow flies in, target wobbles on its stand, ripple rings, shaft quivers (repeats) */
  rig('target-pro', .6, p => {
    const intro = sub(p);
    intro.line(0, 96, -62, 160, { sw: 4 }); intro.line(0, 96, 62, 160, { sw: 4 }); intro.line(0, 96, 0, 166, { sw: 3, stroke: C.soft });
    const tg = sub(intro);
    tg.circle(0, 0, 112, { fill: C.fill, sw: 3.4 });
    [100, 76, 52].forEach(r => tg.circle(0, 0, r, { stroke: C.soft, sw: 1.1 }));
    [88, 64, 40].forEach(r => tg.circle(0, 0, r, { sw: 2.6 }));
    tg.circle(0, 0, 16, { fill: C.ink, sw: 2 });
    [0, 1].forEach(i => { const rp = sub(intro); rp.circle(0, 0, 22, { stroke: C.ink, sw: 2.4 });
      on(rp, p, .6, { loop: 3.2, s: [[.36 + i * .12, .6], [1.1 + i * .12, 5, 'out']], o: [[.36 + i * .12, 0], [.38 + i * .12, .8], [1.1 + i * .12, 0, 'out']] }); });
    const ao = sub(intro), ai = sub(ao);
    ai.line(0, 0, 124, -124, { sw: 4 });
    ai.poly([[-2, -16], [0, 0], [16, 2]], { sw: 3.4 });
    [[0, 0], [12, 12]].forEach(([dx]) => { ai.path(`M ${100 + dx} ${-100 - dx} l -6 -26 l 22 4 Z`, { fill: C.fill, sw: 2 }); ai.path(`M ${100 + dx} ${-100 - dx} l 26 6 l -4 -22 Z`, { fill: C.fill, sw: 2 }); });
    ai.line(122, -122, 130, -130, { sw: 5 });
    on(ao, p, .6, { loop: 3.2, x: [[0, 250], [.36, 0, 'in']], y: [[0, -250], [.36, 0, 'in']], o: [[0, 0], [.03, 1, 'lin'], [2.7, 1], [3, 0]] });
    on(ai, p, .6, { loop: 3.2, r: [[.36, 0], [.42, -7], [.5, 6], [.58, -4], [.66, 2.4], [.76, -1], [.86, 0]] });
    on(tg, p, .6, { loop: 3.2, ox: 0, oy: 120, r: [[.36, 0], [.46, 3.4, 'out'], [.62, -2.2], [.78, 1.1], [.94, 0]] });
    on(intro, p, 0, { s: [[0, .5], [.45, 1.06, 'out'], [.6, 1]], o: [[0, 0], [.18, 1]] });
  });

  /* 10 ── phone: notification slides in, phone buzzes, badge pops, then it all clears (repeats) */
  rig('notify-pro', .6, p => {
    const intro = sub(p), ph = sub(intro);
    const vib = sd => { const v = sub(intro); [0, 18].forEach(dx => v.path(`M ${sd * (116 + dx)} -40 q ${sd * 12} 20 0 40`, { stroke: C.soft, sw: 2.6 })); return v; };
    const vr = vib(1), vl = vib(-1);
    ph.rect(-95, -90, 6, 30, { rx: 3, fill: C.fill, sw: 2 }); ph.rect(-95, -50, 6, 40, { rx: 3, fill: C.fill, sw: 2 }); ph.rect(89, -80, 6, 54, { rx: 3, fill: C.fill, sw: 2 });
    ph.rect(-90, -172, 180, 344, { rx: 30, fill: C.fill, sw: 3.2 });
    ph.rect(-78, -158, 156, 316, { rx: 20, stroke: C.soft, sw: 1.6 });
    ph.rect(-24, -152, 48, 11, { rx: 5.5, fill: C.fill, sw: 2 });
    ph.line(-30, 148, 30, 148, { sw: 3 });
    [-36, 24, 84].forEach(y => { ph.circle(-48, y, 14, { stroke: C.soft, sw: 1.6 }); ph.line(-24, y - 6, 52, y - 6, { stroke: C.soft, sw: 2 }); ph.line(-24, y + 8, 22, y + 8, { stroke: C.soft, sw: 1.3 }); });
    const nt = sub(ph);
    nt.rect(-70, -136, 140, 58, { rx: 13, fill: C.fill, sw: 2.6 });
    nt.rect(-60, -126, 36, 36, { rx: 9, fill: C.fill, sw: 2.2 }); nt.path('M -54 -114 L -42 -104 L -30 -114', { sw: 1.8 }); nt.rect(-54, -116, 24, 18, { rx: 3, sw: 1.8 });
    nt.line(-14, -116, 54, -116, { sw: 2.6 }); nt.line(-14, -99, 34, -99, { sw: 1.6, stroke: C.soft });
    const bo = sub(intro); bo.circle(86, -166, 25, { fill: C.fill, sw: 3.2 }); bo.text('1', 86, -155, { size: 30, at: 0, dur: .01 });
    on(nt, p, .7, { loop: 3.2, y: [[0, -44], [.36, 0, 'back'], [2.4, 0], [2.7, -44, 'in']], o: [[0, 0], [.14, 1], [2.45, 1], [2.7, 0]] });
    const bz = [[0, 0]]; for (let i = 1; i <= 7; i++) bz.push([i * .05, i % 2 ? -3.2 : 3.2, 'lin']); bz.push([.4, 0, 'out']);
    on(ph, p, .7, { loop: 3.2, ox: 0, oy: 0, r: bz });
    [vr, vl].forEach((v, i) => on(v, p, .7, { loop: 3.2, x: [[0, 0], [.2, (i ? -1 : 1) * 6], [.4, 0]], o: [[0, 0], [.03, 1], [.36, 1], [.5, 0]] }));
    on(bo, p, .7, { loop: 3.2, ox: 86, oy: -166, s: [[0, 0], [.3, 0], [.48, 1.18, 'out'], [.6, 1], [2.4, 1], [2.6, 0, 'in']] });
    on(intro, p, 0, { y: [[0, 60], [.5, 0, 'out']], o: [[0, 0], [.2, 1]] });
  });


  /* ═══════════ ONE ICON, TEN LOOKS — heart variants (G.VARIANTS.heart) ═══════════ */
  const hs = (p, sc, x = 0, y = 0) => p.child({ transform: `translate(${x} ${y}) scale(${sc})` }, sc);

  /* v1 solid: filled glowing heart, beat + burst rays */
  rig('heart-solid', .6, p => {
    const intro = sub(p), rays = sub(intro), beat = sub(intro);
    for (let i = 0; i < 10; i++) { const a = i * Math.PI / 5 - Math.PI / 2, r = sub(rays); r.line(Math.cos(a) * 150, Math.sin(a) * 140, Math.cos(a) * 182, Math.sin(a) * 172, { sw: 3.4 });
      on(r, p, .6, { loop: 1.3, ox: Math.cos(a) * 150, oy: Math.sin(a) * 140, s: [[0, 0], [.08, 0], [.22, 1, 'out'], [.45, 0, 'in']], o: [[0, 0], [.08, 1], [.45, 0]] }); }
    const h = hs(beat, 1.75); h.path(HEART, { fill: C.ink, sw: 2 });
    h.path('M -58 -26 Q -58 -50 -36 -56', { stroke: C.fill, sw: 5 }); h.circle(-62, -10, 3.4, { fill: C.fill, stroke: C.fill, sw: 1 });
    on(beat, p, .6, { loop: 1.3, s: [[0, 1], [.1, 1.12, 'out'], [.22, .95], [.34, 1.05], [.52, 1]] });
    on(intro, p, 0, { s: [[0, .2], [.4, 1.15, 'out'], [.6, 1]], o: [[0, 0], [.15, 1]] });
  });

  /* v2 layers: three nested hearts, each beating a beat later (follow-through) */
  rig('heart-layers', .7, p => {
    const intro = sub(p), L = [[2.05, 0, 'none', 2.8], [1.45, .08, C.fill, 3], [.6, .16, C.ink, 2]];
    L.forEach(([sc, d, fill, sw], i) => { const g = sub(intro), h = hs(g, sc); h.path(HEART, { fill: fill === 'none' ? 'none' : fill, sw, stroke: i === 0 ? C.soft : C.ink });
      if (i === 1) h.path('M -60 -24 Q -60 -50 -36 -56', { sw: 3.4 });
      on(g, p, .7, { loop: 1.5, s: [[d, 1], [d + .12, 1 + .1 * (i + 1), 'out'], [d + .3, .97], [d + .5, 1]] }); });
    on(intro, p, 0, { s: [[0, .5], [.5, 1.06, 'out'], [.7, 1]], o: [[0, 0], [.2, 1]] });
  });

  /* v3 ecg: heartbeat trace runs through a heart outline; the heart thumps on the spike */
  rig('heart-ecg', .5, p => {
    const intro = sub(p), hb = sub(intro), h = hs(hb, 1.9); h.path(HEART, { fill: C.fill, sw: 2.6, stroke: C.soft });
    const pts = [[-196, 10], [-80, 10], [-64, -6], [-52, 10], [-30, 10], [-16, -96], [0, 86], [16, 10], [58, 10], [72, -18], [86, 10], [196, 10]];
    intro.poly(pts, { sw: 1.4, stroke: C.rule });
    const tr = intro.poly(pts, { sw: 3.8 });
    on(tr, p, .5, { loop: 2, draw: [[0, 0], [1.2, 1, 'lin']], o: [[0, 1], [1.4, 1], [1.9, 0]] });
    on(hb, p, .5, { loop: 2, s: [[0, 1], [.5, 1], [.6, 1.12, 'out'], [.75, .96], [.9, 1]] });
    on(intro, p, 0, { o: [[0, 0], [.3, 1]] });
  });

  /* v4 one-line: a single continuous stroke draws the heart with a flourish, fades, repeats */
  rig('heart-oneline', .3, p => {
    const intro = sub(p), g = hs(intro, 1.55);
    const ln = g.path('M -125 110 C -80 112, -40 100, 0 70 C -96 8, -86 -72, -38 -72 C -14 -72, 0 -54, 0 -38 C 0 -54, 14 -72, 38 -72 C 86 -72, 96 8, 0 70 C 34 92, 70 74, 62 52 C 54 32, 26 48, 40 72 C 56 98, 96 112, 125 110', { sw: 3 });
    on(ln, p, .3, { loop: 2.6, draw: [[0, 0], [1.5, 1, 'io']], o: [[0, 1], [2, 1], [2.5, 0]] });
    on(intro, p, 0, { o: [[0, 0], [.1, 1]] });
  });

  /* v5 like: heart pops inside a chat bubble, +1 floats up */
  rig('heart-like', .6, p => {
    const intro = sub(p), bub = sub(intro);
    bub.path('M -150 -112 Q -150 -128 -134 -128 L 134 -128 Q 150 -128 150 -112 L 150 64 Q 150 80 134 80 L -40 80 L -84 124 L -78 80 L -134 80 Q -150 80 -150 64 Z', { fill: C.fill, sw: 3.2 });
    bub.line(-126, -100, -60, -100, { sw: 1.4, stroke: C.soft });
    const hp = sub(bub), h = hs(hp, .95, 0, -18); h.path(HEART, { fill: C.ink, sw: 2 }); h.path('M -56 -26 Q -56 -50 -36 -56', { stroke: C.fill, sw: 5 });
    const pl = sub(intro); pl.text('+1', 126, -150, { size: 44, at: 0, dur: .01 });
    on(bub, p, .6, { loop: 2.2, ox: 0, oy: 80, sy: [[0, 1], [.1, .92, 'out'], [.25, 1.04], [.4, 1]], sx: [[0, 1], [.1, 1.05, 'out'], [.25, .98], [.4, 1]] });
    on(hp, p, .6, { loop: 2.2, ox: 0, oy: -18, s: [[0, 0], [.06, 0], [.26, 1.28, 'out'], [.42, .94], [.56, 1]], r: [[0, -14], [.26, 6, 'out'], [.5, 0]] });
    on(pl, p, .6, { loop: 2.2, y: [[.2, 10], [1.2, -50, 'out']], o: [[0, 0], [.2, 0], [.3, 1], [1, 1], [1.3, 0]] });
    on(intro, p, 0, { y: [[0, 50], [.5, 0, 'back']], o: [[0, 0], [.2, 1]] });
  });

  /* v6 broken: cracks into two halves that tilt apart, then snap back together */
  rig('heart-broken', .5, p => {
    const intro = sub(p), Z = ' L -8 40 L 8 18 L -10 -4 L 6 -22 Z';
    const half = side => { const g = sub(intro), h = hs(g, 1.9);
      h.path(`M 0 -38 C 0 -54, ${side * 14} -72, ${side * 38} -72 C ${side * 86} -72, ${side * 96} 8, 0 70` + Z, { fill: C.fill, sw: 2.6 });
      h.path(side < 0 ? 'M -60 -24 Q -60 -50 -38 -56' : 'M 60 0 Q 56 20 40 34', { sw: 3.2, stroke: side < 0 ? C.ink : C.soft });
      on(g, p, .5, { loop: 2.8, ox: 0, oy: 133, r: [[0, 0], [.6, 0], [.85, side * 13, 'out'], [1.9, side * 13], [2.15, 0, 'back']], x: [[.6, 0], [.85, side * 16, 'out'], [1.9, side * 16], [2.15, 0, 'back']] });
      return g; };
    half(-1); half(1);
    [[-30, 40], [24, 70]].forEach(([x, y], i) => { const sh = sub(intro); sh.shape([[x, y], [x + 12, y + 6], [x + 2, y + 16]], { fill: C.fill, sw: 2 });
      on(sh, p, .5, { loop: 2.8, y: [[.62, 0], [1.6, 110 + i * 30, 'in']], o: [[0, 0], [.62, 0], [.64, 1], [1.5, 0]], r: [[.62, 0], [1.6, 120, 'lin']], ox: x, oy: y }); });
    const sp = sub(intro); star4(sp, 0, -90, 18);
    on(sp, p, .5, { loop: 2.8, ox: 0, oy: -90, s: [[0, 0], [2.12, 0], [2.3, 1.1, 'back'], [2.6, 0, 'in']] });
    on(intro, p, 0, { s: [[0, .6], [.45, 1.05, 'out'], [.6, 1]], o: [[0, 0], [.2, 1]] });
  });

  /* v7 balloon: heart balloon bobbing on a waving string */
  rig('heart-balloon', .8, p => {
    const intro = sub(p), sway = sub(intro), str = sub(sway);
    str.path('M 0 64 C 22 90, -22 118, 0 146 C 18 168, -10 180, 0 196', { sw: 2.2, stroke: C.soft });
    on(str, p, .8, { loop: 1.6, ox: 0, oy: 64, ky: [[0, 0], [.4, 6, 'soft'], [1.2, -6, 'soft'], [1.6, 0, 'soft']] });
    const bal = sub(sway); bal.shape([[-10, 72], [10, 72], [0, 56]], { fill: C.fill, sw: 2.4 });
    const h = hs(bal, 1.55, 0, -46); h.path(HEART, { fill: C.fill, sw: 2.6 });
    h.path('M -58 -22 Q -60 -50 -34 -58', { sw: 3.8 }); h.path('M -40 -30 Q -40 -40 -30 -44', { sw: 2, stroke: C.soft });
    h.path('M 0 50 C 40 30, 64 -6, 58 -40', { sw: 1.3, stroke: C.soft });
    on(sway, p, .8, { loop: 3.2, ox: 0, oy: 196, r: [[0, 0], [.8, 5, 'soft'], [2.4, -5, 'soft'], [3.2, 0, 'soft']], y: [[0, 0], [1.6, -14, 'soft'], [3.2, 0, 'soft']] });
    on(intro, p, 0, { y: [[0, 230], [.8, 0, 'back']], o: [[0, 0], [.2, 1]] });
  });

  /* v8 lock: heart padlock — shackle lifts open, then clicks shut */
  rig('heart-lock', .6, p => {
    const intro = sub(p), sh = sub(intro);
    sh.path('M -50 -30 L -50 -92 A 50 50 0 0 1 50 -92 L 50 -30', { sw: 17 });
    sh.path('M -50 -30 L -50 -92 A 50 50 0 0 1 50 -92 L 50 -30', { sw: 10, stroke: C.fill });
    const body = sub(intro), h = hs(body, 1.6, 0, 34); h.path(HEART, { fill: C.fill, sw: 2.6 });
    h.path('M -58 -24 Q -58 -50 -36 -56', { sw: 3.4 }); hs(body, 1.6 * .8, 0, 34).path(HEART, { sw: 1.2, stroke: C.soft });
    body.circle(0, 34, 13, { fill: C.fill, sw: 3 }); body.path('M -6 44 L -9 74 L 9 74 L 6 44', { fill: C.fill, sw: 2.6 });
    const clk = sub(intro); [[-1, -52], [1, -52]].forEach(([sd, y]) => clk.line(sd * 84, y, sd * 104, y - 18, { sw: 3 }));
    on(sh, p, .6, { loop: 2.8, y: [[0, 0], [.4, 0], [.65, -34, 'out'], [1.7, -34], [1.9, 0, 'in']], r: [[.65, 0], [.9, 0], [1.1, -12, 'out'], [1.5, -12], [1.7, 0, 'io']], ox: -50, oy: -30 });
    on(body, p, .6, { loop: 2.8, s: [[1.9, 1], [1.98, 1.06, 'out'], [2.15, 1]], ox: 0, oy: 34 });
    on(clk, p, .6, { loop: 2.8, o: [[0, 0], [1.9, 0], [1.94, 1], [2.3, 0]] });
    on(intro, p, 0, { y: [[0, -120], [.6, 0, 'back']], o: [[0, 0], [.2, 1]] });
  });

  /* v9 pixel: 8-bit heart built row by row, light sweeps across the pixels */
  rig('heart-pixel', 1.2, p => {
    const intro = sub(p), M = ['..XX...XX..', '.XXXX.XXXX.', 'XXXXXXXXXXX', 'XXXXXXXXXXX', 'XXXXXXXXXXX', '.XXXXXXXXX.', '..XXXXXXX..', '...XXXXX...', '....XXX....', '.....X.....'];
    const c = 31, x0 = -c * 5.5, y0 = -c * 5;
    M.forEach((row, r) => [...row].forEach((ch, k) => { if (ch !== 'X') return;
      const x = x0 + k * c + c / 2, y = y0 + r * c + c / 2, o = sub(intro), i = sub(o), hot = (r === 1 && (k === 1 || k === 2)) || (r === 2 && k === 1);
      i.rect(x - 12.5, y - 12.5, 25, 25, { rx: 4, fill: hot ? C.ink : C.fill, sw: 2.2 });
      on(o, p, r * .07 + k * .012, { ox: x, oy: y, s: [[0, 0], [.3, 1, 'back']] });
      on(i, p, 1.3 + (r + k) * .05, { loop: 2.4, o: [[0, 1], [.25, .3, 'out'], [.7, 1, 'soft']] }); }));
    on(intro, p, 1.3, { loop: 2.4, s: [[0, 1], [.12, 1.05, 'out'], [.3, 1]] });
  });

  /* v10 wings: winged heart flapping, body bobs with each stroke */
  rig('heart-wings', .6, p => {
    const intro = sub(p), fly = sub(intro);
    const WING = 'M 0 18 C -30 -2, -58 -52, -66 -118 C -84 -96, -94 -72, -98 -48 C -112 -72, -132 -88, -152 -96 C -152 -66, -142 -42, -128 -24 C -146 -32, -168 -36, -186 -34 C -172 -6, -142 14, -102 22 C -70 28, -32 28, 0 26 Z';
    [-1, 1].forEach(sd => { const pv = fly.child({ transform: `translate(${sd * 58} -24)` }), w = sub(pv), m = w.child({ transform: `scale(${sd < 0 ? 1 : -1} 1)` });
      m.path(WING, { fill: C.fill, sw: 2.6 }); m.path('M -14 14 C -40 -10, -56 -50, -62 -96', { sw: 1.3, stroke: C.soft }); m.path('M -22 18 C -60 0, -100 -36, -136 -76', { sw: 1.3, stroke: C.soft }); m.path('M -26 22 C -80 14, -130 -4, -166 -26', { sw: 1.3, stroke: C.soft });
      on(w, p, .6, { loop: .9, r: [[0, 0], [.3, sd * 26, 'out'], [.6, sd * -10, 'io'], [.9, 0, 'soft']] }); });
    const h = hs(fly, 1.15, 0, -6); h.path(HEART, { fill: C.fill, sw: 2.8 }); h.path('M -58 -24 Q -58 -50 -36 -56', { sw: 3.6 }); hs(fly, 1.15 * .76, 0, -6).path(HEART, { sw: 1.2, stroke: C.soft });
    on(fly, p, .6, { loop: .9, y: [[0, 0], [.3, 10, 'out'], [.6, -8, 'io'], [.9, 0, 'soft']] });
    on(intro, p, 0, { s: [[0, .3], [.5, 1.08, 'out'], [.65, 1]], y: [[0, 60], [.6, 0, 'out']], o: [[0, 0], [.2, 1]] });
  });
  G.VARIANTS = { heart: ['heart-solid', 'heart-layers', 'heart-ecg', 'heart-oneline', 'heart-like', 'heart-broken', 'heart-balloon', 'heart-lock', 'heart-pixel', 'heart-wings'] };

  Object.assign(G.icons, R);
  /* the user chose this set as the standard look: plain names now resolve to the rigged versions everywhere
     (beats, spot, flow, steps …). The older drawings stay reachable under '<name>-basic'. */
  const ALIAS = { heart: 'heart-pro', bell: 'bell-pro', bulb: 'bulb-pro', envelope: 'mail-pro', mail: 'mail-pro', rocket: 'rocket-pro',
    chart: 'growth-pro', growth: 'growth-pro', gears: 'gears-pro', target: 'target-pro', alarm: 'alarm-pro', notify: 'notify-pro' };
  for (const [a, pro] of Object.entries(ALIAS)) { if (G.icons[a] && !G.icons[a + '-basic']) G.icons[a + '-basic'] = G.icons[a]; G.icons[a] = R[pro]; }
  G.PRO_ALIAS = ALIAS;
  G.PRO = Object.keys(R).filter(n => !G.VARIANTS.heart.includes(n));
})();
