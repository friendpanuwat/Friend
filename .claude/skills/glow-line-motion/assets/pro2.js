/* pro2.js — more rigged "-pro" icons in the standard the user chose (style.md §0), named after the
   Lucide icons CutPack uses most (icons_preview.pdf, priority 1). Plain names resolve to these; the
   older drawings stay as '<name>-basic'. Same building blocks as pro.js: one group per moving part + GL.kf. */
(function () {
  const G = window.GL, C = G.C;
  const sub = (p, attrs) => p.child(attrs || {});
  const on = (q, p, start, spec) => G.kf(q.g || q, p.t0 + start * p.ts, spec);
  const fine = { sw: 1.2, stroke: C.soft };
  const star4 = (p, x, y, r, o = {}) => p.path(`M ${x} ${y - r} Q ${x + r * .16} ${y - r * .16} ${x + r} ${y} Q ${x + r * .16} ${y + r * .16} ${x} ${y + r} Q ${x - r * .16} ${y + r * .16} ${x - r} ${y} Q ${x - r * .16} ${y - r * .16} ${x} ${y - r} Z`, Object.assign({ fill: C.ink, sw: 1.4 }, o));
  /* stitched / dotted line made of short segments (fine detail) */
  const dash = (p, x1, y1, x2, y2, seg = 7, gap = 6, o = fine) => { const L = Math.hypot(x2 - x1, y2 - y1), n = Math.floor(L / (seg + gap)), ux = (x2 - x1) / L, uy = (y2 - y1) / L;
    for (let i = 0; i < n; i++) { const a = i * (seg + gap); p.line(x1 + ux * a, y1 + uy * a, x1 + ux * (a + seg), y1 + uy * (a + seg), o); } };
  const pop = (p, q, at = 0, from = .4) => on(q, p, at, { s: [[0, from], [.42, 1.08, 'out'], [.62, 1]], o: [[0, 0], [.16, 1]] });
  const R = {}, rig = (name, dur, fn) => { fn.custom = true; fn.dur = dur; R[name] = fn; };

  /* user — profile bust: rises in, head nods, highlight ring pulses */
  rig('user-pro', .6, p => {
    const intro = sub(p);
    [0, .5].forEach(d => { const r = sub(intro); r.circle(0, 0, 150, { stroke: C.soft, sw: 1.6 });
      on(r, p, .6, { loop: 2.4, s: [[d, .9], [d + 1.2, 1.25, 'out']], o: [[d, 0], [d + .1, .7], [d + 1.2, 0]] }); });
    const body = sub(intro);
    body.path('M -118 150 C -118 64, -70 30, 0 30 C 70 30, 118 64, 118 150 Z', { fill: C.fill, sw: 3 });
    body.path('M -30 34 L 0 74 L 30 34', { sw: 2 }); body.path('M -96 150 C -96 86, -60 52, -20 46', fine);
    [94, 116, 138].forEach(y => body.circle(0, y, 3.2, { sw: 1.3, stroke: C.soft })); body.line(0, 78, 0, 150, { sw: .9, stroke: C.mute });
    [-1, 1].forEach(sd => body.path(`M ${sd * 70} 46 C ${sd * 84} 70, ${sd * 92} 100, ${sd * 92} 150`, { sw: .9, stroke: C.mute }));
    body.circle(56, 92, 9, { fill: C.fill, sw: 1.8 }); body.dot(56, 92, 2.6);
    const head = sub(intro);
    head.circle(0, -52, 62, { fill: C.fill, sw: 3 }); head.circle(0, -52, 50, fine);
    head.path('M -40 -80 Q -32 -104 -8 -110', { sw: 3.4 }); head.dot(-46, -64, 2.6);
    head.path('M -58 -70 C -50 -112, 40 -126, 60 -66', { sw: 1.4, stroke: C.soft }); head.path('M -20 -112 C 0 -100, 24 -100, 44 -108', { sw: .9, stroke: C.mute });
    [-1, 1].forEach(sd => head.path(`M ${sd * 62} -62 C ${sd * 74} -60, ${sd * 74} -40, ${sd * 62} -38`, { sw: 1.6 }));
    on(head, p, .7, { loop: 3, ox: 0, oy: 8, r: [[0, 0], [.4, -4, 'soft'], [.9, 3, 'soft'], [1.3, 0, 'soft']], y: [[0, 0], [.4, -4, 'soft'], [1.3, 0, 'soft']] });
    on(body, p, .7, { loop: 3, ox: 0, oy: 150, sy: [[0, 1], [1.5, 1.025, 'soft'], [3, 1, 'soft']] });
    on(intro, p, 0, { y: [[0, 60], [.55, 0, 'back']], o: [[0, 0], [.2, 1]] });
  });

  /* sparkles — three stars twinkle out of phase, the big one breathes and turns */
  rig('sparkles-pro', .5, p => {
    const intro = sub(p);
    const st = (x, y, r, d, period, rot) => { const g = sub(intro); star4(g, x, y, r, { fill: C.fill, sw: 3 }); star4(g, x, y, r * .45, { fill: C.ink, sw: 1 });
      on(g, p, .5 + d, { loop: period, ox: x, oy: y, s: [[0, 1], [period * .25, 1.16, 'out'], [period * .55, .86, 'soft'], [period, 1, 'soft']], r: [[0, 0], [period, rot, 'lin']] }); return g; };
    const big = st(-30, 20, 120, 0, 2.4, 0);
    [[0, -1], [1, 0], [0, 1], [-1, 0]].forEach(([a, b]) => big.line(-30 + a * 18, 20 + b * 18, -30 + a * 70, 20 + b * 70, { sw: .9, stroke: C.soft }));
    [45, 135, 225, 315].forEach(d => { const r = d * Math.PI / 180; big.line(-30 + Math.cos(r) * 58, 20 + Math.sin(r) * 58, -30 + Math.cos(r) * 78, 20 + Math.sin(r) * 78, { sw: 2, stroke: C.soft }); });
    st(118, -110, 46, .3, 1.6, 90);
    st(126, 110, 30, .7, 1.4, -90);
    [[160, 10], [-150, 60]].forEach(([x, y]) => { intro.line(x - 9, y, x + 9, y, { sw: 2 }); intro.line(x, y - 9, x, y + 9, { sw: 2 }); });
    intro.circle(60, 150, 7, { sw: 1.6, stroke: C.soft });
    [[-150, -120], [-160, 130], [40, -170]].forEach(([x, y], i) => { const d = sub(intro); d.dot(x, y, 5);
      on(d, p, .6 + i * .3, { loop: 1.8, ox: x, oy: y, s: [[0, 0], [.3, 1.2, 'out'], [.9, 0, 'in']] }); });
    on(intro, p, 0, { s: [[0, .2], [.45, 1.1, 'out'], [.65, 1]], r: [[0, -30], [.5, 0, 'out']], o: [[0, 0], [.15, 1]] });
  });

  /* brain — two hemispheres with folds; signals run along the folds, the whole brain pulses */
  rig('brain-pro', .6, p => {
    const intro = sub(p), br = sub(intro);
    const L = 'M -6 -128 C -40 -150, -84 -136, -92 -104 C -128 -100, -146 -64, -132 -36 C -158 -14, -154 30, -124 46 C -128 84, -96 112, -60 104 C -42 132, -12 132, -6 118 Z';
    br.path(L, { fill: C.fill, sw: 3 }); br.child({ transform: 'scale(-1 1)' }).path(L, { fill: C.fill, sw: 3 });
    br.line(0, -124, 0, 118, { sw: 2 });
    br.path('M -20 112 C -22 132, -14 146, 0 148 C 14 146, 22 132, 20 112', { fill: C.fill, sw: 2.4 }); br.path('M -10 126 Q 0 132 10 126', fine);
    const folds = ['M -24 -100 C -50 -100, -66 -84, -64 -64', 'M -96 -60 C -70 -60, -56 -40, -62 -16', 'M -30 -34 C -54 -30, -68 -6, -54 16', 'M -110 18 C -86 10, -64 22, -64 44', 'M -36 52 C -58 56, -70 76, -56 96', 'M -20 0 C -10 20, -26 34, -16 52'];
    const curls = ['M -110 -84 q 10 -2 14 8', 'M -136 0 q 12 2 12 14', 'M -92 78 q 2 12 14 12', 'M -48 -128 q 4 12 -6 18', 'M -70 30 q -10 4 -8 16'];
    [-1, 1].forEach(sd => { const g = br.child({ transform: `scale(${sd} 1)` }); folds.forEach(d => g.path(d, { sw: 1.6, stroke: C.soft })); curls.forEach(d => g.path(d, { sw: 1, stroke: C.mute }));
      [[-64, -64], [-62, -16], [-54, 16], [-64, 44], [-56, 96]].forEach(([x, y]) => g.dot(x, y, 2.4)); });
    br.path('M -84 -96 Q -100 -84 -110 -64', { sw: 3 });
    const sig = (d, sd, at) => { const g = br.child({ transform: `scale(${sd} 1)` }), e = g.path(d, { sw: 3.2 });
      on(e, p, at, { loop: 2.4, draw: [[0, 0], [.5, 1, 'io']], o: [[0, 0], [.05, 1], [.7, 1], [1, 0]] }); };
    sig(folds[0], -1, .8); sig(folds[3], 1, 1.1); sig(folds[2], 1, 1.5); sig(folds[4], -1, 1.8);
    on(br, p, .7, { loop: 2.4, s: [[0, 1], [.12, 1.04, 'out'], [.4, 1, 'soft']] });
    pop(p, intro);
  });

  /* check — ring draws itself, the tick snaps in with overshoot, then a soft confirm pulse */
  rig('check-pro', .9, p => {
    const intro = sub(p);
    [0, .25].forEach(d => { const r = sub(intro); r.circle(0, 0, 132, { stroke: C.soft, sw: 2 });
      on(r, p, .9, { loop: 2.2, s: [[d, 1], [d + .9, 1.35, 'out']], o: [[d, 0], [d + .05, .6], [d + .9, 0]] }); });
    const ring = intro.circle(0, 0, 132, { fill: C.fill, sw: 3.4 });
    on(ring, p, 0, { draw: [[0, 0], [.55, 1, 'io']] });
    intro.circle(0, 0, 116, fine);
    for (let i = 0; i < 36; i++) { const a = i * Math.PI / 18, r1 = i % 3 ? 122 : 119; intro.line(Math.cos(a) * r1, Math.sin(a) * r1, Math.cos(a) * 128, Math.sin(a) * 128, { sw: i % 3 ? .8 : 1.4, stroke: i % 3 ? C.mute : C.soft }); }
    intro.path('M -100 -54 A 114 114 0 0 1 -54 -100', { sw: 3 }); intro.dot(-108, -30, 2.4);
    const tk = sub(intro), tick = tk.poly([[-58, 2], [-18, 44], [62, -42]], { sw: 9 });
    on(tick, p, .45, { draw: [[0, 0], [.3, 1, 'out']] });
    on(tk, p, .45, { s: [[.25, 1], [.36, 1.14, 'out'], [.5, 1]] });
    on(intro, p, 0, { o: [[0, 0], [.08, 1]] });
  });

  /* triangle-alert — drops in, then flashes: shakes, rays burst, the "!" throbs */
  rig('triangle-alert-pro', .6, p => {
    const intro = sub(p), rays = sub(intro);
    [-60, -30, 0, 30, 60].forEach(a => { const r = a * Math.PI / 180; rays.line(Math.sin(r) * 150, -40 - Math.cos(r) * 150, Math.sin(r) * 180, -40 - Math.cos(r) * 180, { sw: 3.4 }); });
    on(rays, p, .6, { loop: 2, ox: 0, oy: -40, o: [[0, 0], [.08, 1], [.45, 0]], s: [[0, .85], [.45, 1.1, 'out']] });
    const tri = sub(intro);
    tri.path('M 0 -130 Q 14 -130 22 -116 L 140 92 Q 148 110 128 112 L -128 112 Q -148 110 -140 92 L -22 -116 Q -14 -130 0 -130 Z', { fill: C.fill, sw: 3.4 });
    tri.path('M 0 -104 L 114 94 L -114 94 Z', { sw: 1.3, stroke: C.soft });
    [[0, -96], [104, 88], [-104, 88]].forEach(([x, y]) => tri.circle(x, y, 4, { sw: 1.4, stroke: C.soft }));
    tri.path('M -30 -78 L -96 40', { sw: 3 }); tri.dot(-104, 56, 2.4);
    dash(tri, -90, 104, 90, 104, 10, 8, { sw: 1, stroke: C.mute });
    const ex = sub(tri); ex.line(0, -48, 0, 28, { sw: 12 }); ex.dot(0, 66, 9);
    const sh = [[0, 0]]; for (let i = 1; i <= 6; i++) sh.push([i * .05, i % 2 ? -4 : 4, 'lin']); sh.push([.36, 0, 'out']);
    on(tri, p, .6, { loop: 2, ox: 0, oy: 112, r: sh });
    on(ex, p, .6, { loop: 2, ox: 0, oy: 20, s: [[0, 1], [.1, 1.15, 'out'], [.4, 1, 'soft']] });
    on(intro, p, 0, { y: [[0, -80], [.55, 0, 'back']], o: [[0, 0], [.2, 1]] });
  });

  /* message-circle — bubble pops with squash, typing dots wave in sequence */
  rig('message-circle-pro', .6, p => {
    const intro = sub(p), bub = sub(intro);
    bub.path('M 0 -132 C 86 -132, 146 -76, 146 -6 C 146 64, 86 120, 0 120 C -20 120, -40 117, -58 111 L -128 140 L -108 80 C -132 58, -146 28, -146 -6 C -146 -76, -86 -132, 0 -132 Z', { fill: C.fill, sw: 3.2 });
    bub.path('M -118 -40 C -104 -86, -60 -112, -10 -116', { sw: 3.4 }); bub.dot(-124, -16, 2.6);
    bub.path('M 0 -114 C 74 -114, 126 -66, 128 -6', fine);
    bub.path('M -112 82 L -120 124 L -64 100', { sw: 1, stroke: C.mute });
    bub.line(40, 70, 96, 70, { sw: 1.4, stroke: C.soft }); bub.line(40, 86, 74, 86, { sw: 1, stroke: C.mute });
    const ol = sub(bub); ol.circle(118, -106, 16, { fill: C.fill, sw: 2.6 }); ol.dot(118, -106, 7);
    on(ol, p, .9, { loop: 2, ox: 118, oy: -106, s: [[0, 1], [.2, 1.2, 'out'], [.5, 1, 'soft']] });
    [-56, 0, 56].forEach((x, i) => { const d = sub(bub); d.circle(x, -6, 16, { fill: C.ink, sw: 1.4 });
      on(d, p, .7 + i * .14, { loop: 1.3, y: [[0, 0], [.18, -20, 'out'], [.4, 0, 'in']], o: [[0, .55], [.18, 1], [.5, .55]] }); });
    on(bub, p, 0, { ox: 0, oy: 120, sx: [[0, .3], [.3, 1.12, 'out'], [.45, .96], [.6, 1]], sy: [[0, .3], [.3, .92, 'out'], [.45, 1.04], [.6, 1]] });
    on(intro, p, 0, { o: [[0, 0], [.12, 1]] });
  });

  /* coins — a coin drops in flipping and lands on the stack, which squashes; repeats */
  const coin = (q, x, y, r = 70, ry = 24, th = 16) => {
    q.path(`M ${x - r} ${y} A ${r} ${ry} 0 0 0 ${x + r} ${y} L ${x + r} ${y - th} A ${r} ${ry} 0 0 1 ${x - r} ${y - th} Z`, { fill: C.fill, sw: 2.6 });
    for (let i = -3; i <= 3; i++) { const px = x + r * Math.sin(i * .42); q.line(px, y - th + ry * Math.cos(i * .42) * .98, px, y + ry * Math.cos(i * .42) * .98, { sw: .9, stroke: C.mute }); }
  };
  rig('coins-pro', .7, p => {
    const intro = sub(p), stack = sub(intro);
    for (let i = 0; i < 6; i++) coin(stack, 0, 140 - i * 22, 112, 36, 22);
    stack.ellipse(0, 8, 112, 36, { fill: C.fill, sw: 2.8 }); stack.ellipse(0, 8, 80, 25, fine); stack.ellipse(0, 8, 96, 31, { sw: .8, stroke: C.mute }); stack.text('$', 0, 22, { size: 42, color: C.soft });
    stack.path('M -84 0 Q -70 -14 -40 -20', { sw: 2.6 });
    const side = intro.child({ transform: 'translate(150 0)' }); for (let i = 0; i < 3; i++) coin(side, 0, 140 - i * 18, 52, 17, 18); side.ellipse(0, 86, 52, 17, { fill: C.fill, sw: 2.4 }); side.ellipse(0, 86, 36, 11, fine);
    star4(intro, -150, 30, 12); intro.dot(-128, -10, 2.4);
    const fall = sub(intro), flip = sub(fall);
    flip.circle(0, -90, 66, { fill: C.fill, sw: 3.2 }); flip.circle(0, -90, 52, fine); for (let i = 0; i < 24; i++) { const a = i * Math.PI / 12; flip.line(Math.cos(a) * 58, -90 + Math.sin(a) * 58, Math.cos(a) * 63, -90 + Math.sin(a) * 63, { sw: .8, stroke: C.mute }); } flip.text('$', 0, -72, { size: 54 }); flip.path('M -40 -120 Q -30 -142 -6 -148', { sw: 3 });
    on(fall, p, .6, { loop: 1.8, y: [[0, -100], [.5, 34, 'in'], [.62, 18, 'out'], [.75, 34, 'in']], o: [[0, 0], [.06, 1], [.75, 1], [.85, 0]] });
    on(flip, p, .6, { loop: 1.8, ox: 0, oy: -90, sx: [[0, 1], [.12, -1, 'lin'], [.24, 1, 'lin'], [.36, -1, 'lin'], [.5, .3, 'lin']], sy: [[0, 1], [.5, 1], [.55, .35, 'out']] });
    on(stack, p, .6, { loop: 1.8, ox: 0, oy: 176, sy: [[0, 1], [.5, 1], [.56, .94, 'out'], [.7, 1.02], [.82, 1]], sx: [[0, 1], [.5, 1], [.56, 1.04, 'out'], [.82, 1]] });
    pop(p, intro, 0, .6);
  });

  /* package — isometric box drops and squashes, flaps lift open, a sparkle pops out */
  rig('package-pro', 1.2, p => {
    const intro = sub(p), box = sub(intro);
    box.shape([[-130, -55], [0, -120], [130, -55], [0, 10]], { fill: C.fill, sw: 2, stroke: C.soft }); box.line(0, -120, 0, -40, fine);
    box.shape([[-130, -55], [0, 10], [0, 150], [-130, 85]], { fill: C.fill, sw: 3 });
    box.shape([[0, 10], [130, -55], [130, 85], [0, 150]], { fill: C.fill, sw: 3 });
    box.shape([[-75.8, -17.1], [-54.2, -27.9], [-54.2, 24], [-75.8, 35]], { sw: 1.4, stroke: C.soft });
    [[30, 50, 100, 15], [30, 72, 80, 32]].forEach(([x1, y1, x2, y2]) => box.line(x1, y1, x2, y2, fine));
    box.path('M -112 -20 L -112 60', { sw: 2.6 });
    for (let i = 0; i < 9; i++) { const x = 30 + i * 7, y = 110 - i * 3.5; box.line(x, y, x, y - (i % 3 ? 16 : 22), { sw: i % 2 ? .8 : 1.6, stroke: C.soft }); }
    [-1, 0].forEach(k => { const x = -96 + k * -18, y = 90 + k * -9; box.line(x, y + 14, x, y - 10, { sw: 1.6, stroke: C.soft }); box.poly([[x - 6, y - 2], [x, y - 10], [x + 6, y - 2]], { sw: 1.6, stroke: C.soft }); });
    dash(box, -128, -40, -128, 80, 6, 6, { sw: .8, stroke: C.mute }); dash(box, 128, -40, 128, 80, 6, 6, { sw: .8, stroke: C.mute });
    const lid = sub(box);
    lid.shape([[0, -126], [138, -58], [0, 12], [-138, -58]], { fill: C.fill, sw: 3 });
    lid.shape([[75.8, -92.9], [54.2, -82.1], [-75.8, -17.1], [-54.2, -27.9]], { sw: 1.4, stroke: C.soft });
    lid.path('M -112 -58 L 0 -114', { sw: 2.4 });
    const sp = sub(box); star4(sp, 0, -60, 26); [[-50, -96], [44, -110]].forEach(([x, y]) => sp.dot(x, y, 4));
    on(sp, p, 1.0, { loop: 2.4, ox: 0, oy: -60, s: [[0, 0], [.35, 0], [.6, 1.15, 'back'], [1.4, .9, 'soft'], [1.8, 0, 'in']], y: [[.35, 30], [1.4, -50, 'out']] });
    on(lid, p, 1.0, { loop: 2.4, ox: 138, oy: -58, y: [[0, 0], [.3, -46, 'out'], [1.5, -46], [1.8, 0, 'in']], r: [[0, 0], [.3, 14, 'out'], [1.5, 14], [1.8, 0, 'in']] });
    on(box, p, 0, { ox: 0, oy: 150, y: [[0, -220], [.42, 0, 'in']], sy: [[.42, .86], [.56, 1.06, 'out'], [.7, 1]], sx: [[.42, 1.1], [.56, .97, 'out'], [.7, 1]] });
    on(intro, p, 0, { o: [[0, 0], [.1, 1]] });
  });

  /* trending-down — chart falls: bars shrink, the zig-zag draws down, arrow drops and nudges */
  rig('trending-down-pro', 1.2, p => {
    const intro = sub(p), base = 130;
    [60, -10, -80].forEach(y => intro.line(-166, y, 178, y, { stroke: C.rule, sw: 1.2 }));
    intro.line(-170, -150, -170, base, { sw: 3 }); intro.line(-170, base, 182, base, { sw: 3 });
    [60, -10, -80].forEach(y => { intro.line(-180, y, -170, y, { sw: 2 }); for (let x = -150; x < 180; x += 24) intro.dot(x, y, 1.3, { fill: C.mute, stroke: C.mute }); });
    [-130, -70, -10, 50, 110].forEach(x => intro.line(x, base, x, base + 10, { sw: 1.6 }));
    const xs = [-130, -70, -10, 50, 110], hs = [170, 130, 140, 86, 48];
    xs.forEach((x, i) => { const bo = sub(intro), bi = sub(bo), last = i === xs.length - 1;
      bi.rect(x - 20, base - hs[i], 40, hs[i], { rx: 6, fill: C.fill, sw: last ? 3.4 : 2.4, stroke: last ? C.ink : C.soft });
      bi.line(x - 10, base - hs[i] + 12, x - 10, base - 10, { sw: 1, stroke: C.mute });
      on(bo, p, .1 + i * .08, { ox: x, oy: base, sy: [[0, 0], [.4, 1, 'back']] });
      on(bi, p, 1.6 + i * .12, { loop: 2.2, ox: x, oy: base, sy: [[0, 1], [.3, .93, 'out'], [.7, 1, 'soft']] }); });
    const pts = [[-150, -86], [-90, -40], [-40, -62], [20, 0], [80, 40], [150, 90]];
    const tl = intro.poly(pts, { sw: 3.8 }); on(tl, p, .6, { draw: [[0, 0], [.6, 1, 'io']] });
    const ao = sub(intro), ai = sub(ao); ai.poly([[124, 96], [154, 94], [146, 64]], { sw: 4.4 });
    on(ao, p, 1.15, { ox: 150, oy: 90, s: [[0, 0], [.3, 1, 'back']] });
    on(ai, p, 1.6, { loop: 1.6, x: [[0, 0], [.8, 6, 'soft'], [1.6, 0, 'soft']], y: [[0, 0], [.8, 6, 'soft'], [1.6, 0, 'soft']] });
    on(intro, p, 0, { o: [[0, 0], [.2, 1]] });
  });

  /* briefcase — swings gently from its handle as if carried; clasp catches the light */
  rig('briefcase-pro', .6, p => {
    const intro = sub(p), sw = sub(intro);
    sw.path('M -50 -76 L -50 -110 Q -50 -126 -34 -126 L 34 -126 Q 50 -126 50 -110 L 50 -76', { sw: 9 }); sw.path('M -50 -76 L -50 -110 Q -50 -126 -34 -126 L 34 -126 Q 50 -126 50 -110 L 50 -76', { sw: 3.5, stroke: C.fill });
    sw.rect(-170, -80, 340, 220, { rx: 24, fill: C.fill, sw: 3.2 });
    sw.path('M -170 0 Q 0 26 170 0', { sw: 2.2 }); sw.rect(-156, -66, 312, 192, { rx: 16, sw: 1.1, stroke: C.soft });
    [-1, 1].forEach(sd => sw.line(sd * 110, -80, sd * 110, 140, fine));
    const cl = sub(sw); cl.rect(-24, -6, 48, 34, { rx: 6, fill: C.fill, sw: 2.6 }); cl.circle(0, 11, 5, { sw: 1.6 });
    sw.path('M -150 -40 Q -146 -64 -120 -68', { sw: 3.2 });
    dash(sw, -150, -68, 150, -68); dash(sw, -150, 128, 150, 128); dash(sw, -158, -56, -158, 116); dash(sw, 158, -56, 158, 116);
    [[-170, -80, 1, 1], [170, -80, -1, 1], [-170, 140, 1, -1], [170, 140, -1, -1]].forEach(([x, y, a, b]) => sw.path(`M ${x} ${y + b * 30} L ${x} ${y + b * 8} Q ${x} ${y} ${x + a * 8} ${y} L ${x + a * 30} ${y}`, { sw: 4.6 }));
    [-1, 1].forEach(sd => sw.circle(sd * 50, -84, 5, { fill: C.fill, sw: 1.8 }));
    const tag = sub(sw); tag.line(40, -116, 70, -60, { sw: 1.4, stroke: C.soft }); tag.rect(58, -60, 34, 46, { rx: 5, fill: C.fill, sw: 2 }); tag.circle(75, -50, 3, { sw: 1.2 }); tag.line(64, -36, 86, -36, { sw: 1, stroke: C.soft }); tag.line(64, -26, 80, -26, { sw: 1, stroke: C.mute });
    on(tag, p, .6, { loop: 2.6, ox: 40, oy: -116, r: [[0, 0], [.75, -9, 'soft'], [2.05, 9, 'soft'], [2.6, 0, 'soft']] });
    const gl = sub(sw); star4(gl, 26, -10, 14);
    on(gl, p, .8, { loop: 2.6, ox: 26, oy: -10, s: [[0, 0], [1.2, 0], [1.4, 1.1, 'out'], [1.8, 0, 'in']] });
    on(sw, p, .6, { loop: 2.6, ox: 0, oy: -126, r: [[0, 0], [.65, 3.5, 'soft'], [1.95, -3.5, 'soft'], [2.6, 0, 'soft']] });
    on(intro, p, 0, { y: [[0, -70], [.55, 0, 'back']], o: [[0, 0], [.2, 1]] });
  });

  Object.assign(G.icons, R);
  const ALIAS = { user: 'user-pro', sparkles: 'sparkles-pro', brain: 'brain-pro', check: 'check-pro', 'triangle-alert': 'triangle-alert-pro', warn: 'triangle-alert-pro',
    'message-circle': 'message-circle-pro', bubble: 'message-circle-pro', coins: 'coins-pro', package: 'package-pro', 'trending-down': 'trending-down-pro', down: 'trending-down-pro', briefcase: 'briefcase-pro',
    heart: 'heart-pro', lightbulb: 'bulb-pro', bell: 'bell-pro', mail: 'mail-pro', rocket: 'rocket-pro', target: 'target-pro', 'alarm-clock': 'alarm-pro', settings: 'gears-pro', 'trending-up': 'growth-pro', smartphone: 'notify-pro' };
  for (const [a, pro] of Object.entries(ALIAS)) { const f = R[pro] || G.icons[pro]; if (!f) continue; if (G.icons[a] && !G.icons[a + '-basic'] && !G.icons[a].custom) G.icons[a + '-basic'] = G.icons[a]; G.icons[a] = f; }
  G.PRO2 = Object.keys(R);
})();
