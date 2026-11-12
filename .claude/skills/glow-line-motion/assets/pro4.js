/* pro4.js — pro icon batch 4 (CutPack priority-1 names, next 20), same standard as pro2/pro3. */
(function () {
  const G = window.GL, C = G.C, P = G.parts;
  const sub = (p, attrs) => p.child(attrs || {});
  const on = (q, p, start, spec) => G.kf(q.g || q, p.t0 + start * p.ts, spec);
  const fine = { sw: 1.2, stroke: C.soft }, mute = { sw: .9, stroke: C.mute };
  const star4 = (p, x, y, r, o = {}) => p.path(`M ${x} ${y - r} Q ${x + r * .16} ${y - r * .16} ${x + r} ${y} Q ${x + r * .16} ${y + r * .16} ${x} ${y + r} Q ${x - r * .16} ${y + r * .16} ${x - r} ${y} Q ${x - r * .16} ${y - r * .16} ${x} ${y - r} Z`, Object.assign({ fill: C.ink, sw: 1.4 }, o));
  const dash = (p, x1, y1, x2, y2, seg = 7, gap = 6, o = fine) => { const L = Math.hypot(x2 - x1, y2 - y1), n = Math.floor(L / (seg + gap)), ux = (x2 - x1) / L, uy = (y2 - y1) / L;
    for (let i = 0; i < n; i++) { const a = i * (seg + gap); p.line(x1 + ux * a, y1 + uy * a, x1 + ux * (a + seg), y1 + uy * (a + seg), o); } };
  const pop = (p, q, at = 0, from = .4) => on(q, p, at, { s: [[0, from], [.42, 1.08, 'out'], [.62, 1]], o: [[0, 0], [.16, 1]] });
  const drop = (p, q, at = 0, dy = -90) => on(q, p, at, { y: [[0, dy], [.55, 0, 'back']], o: [[0, 0], [.2, 1]] });
  const twinkle = (p, q, x, y, at, loop = 2) => on(q, p, at, { loop, ox: x, oy: y, s: [[0, 0], [.3, 1.1, 'back'], [.8, 0, 'in']], r: [[0, 0], [.8, 90, 'lin']] });
  const tube = (p, d, w = 18) => { p.path(d, { sw: w }); p.path(d, { sw: w - 7, stroke: C.fill }); };
  const shakeKeys = (n, amp, step = .05) => { const k = [[0, 0]]; for (let i = 1; i <= n; i++) k.push([i * step, i % 2 ? -amp : amp, 'lin']); k.push([(n + 1) * step, 0, 'out']); return k; };
  const HEART = 'M 0 70 C -96 8, -86 -72, -38 -72 C -14 -72, 0 -54, 0 -38 C 0 -54, 14 -72, 38 -72 C 86 -72, 96 8, 0 70 Z';
  const BUBBLE = 'M 0 -132 C 86 -132, 146 -76, 146 -6 C 146 64, 86 120, 0 120 C -20 120, -40 117, -58 111 L -128 140 L -108 80 C -132 58, -146 28, -146 -6 C -146 -76, -86 -132, 0 -132 Z';
  const bubble = q => { q.path(BUBBLE, { fill: C.fill, sw: 3.2 });
    };
  const bust = (q, x, y, s) => { const b = q.child({ transform: `translate(${x} ${y}) scale(${s})` }, s);
    b.path('M -118 150 C -118 64, -70 30, 0 30 C 70 30, 118 64, 118 150 Z', { fill: C.fill, sw: 3 }); b.path('M -30 34 L 0 74 L 30 34', { sw: 2 });
    b.circle(0, -52, 62, { fill: C.fill, sw: 3 });
    return b; };
  /* thumbs-up hand (thumb up, fingers stacked on the right, cuff on the left) */
  const thumb = q => {
    q.rect(-160, -14, 56, 150, { rx: 10, fill: C.fill, sw: 3 }); q.line(-114, -8, -114, 130, fine); q.circle(-132, 60, 4, { sw: 1.4, stroke: C.soft });
    q.path('M -104 -14 L 8 -14 C 26 -14, 28 -44, 18 -92 C 12 -124, 40 -146, 62 -124 C 82 -104, 78 -54, 72 -14 L 112 -14 Q 142 -14 142 12 Q 142 34 124 38 Q 142 46 140 66 Q 138 84 120 88 Q 134 96 130 112 Q 124 132 100 132 L -104 132 Z', { fill: C.fill, sw: 3 });
    q.path('M 64 38 L 124 38', { sw: 1.8 }); q.path('M 60 88 L 120 88', { sw: 1.8 }); q.path('M 30 -14 C 44 -6, 56 -6, 72 -14', fine);
    q.path('M -80 110 L 40 110', mute);
  };
  const R = {}, rig = (name, dur, fn) => { fn.custom = true; fn.dur = dur; R[name] = fn; };

  /* book — closed book; the cover peeks open on its spine, ribbon sways */
  rig('book-pro', .6, p => {
    const intro = sub(p);
    intro.rect(-120, -150, 250, 300, { rx: 14, fill: C.fill, sw: 2.6 });
    const rb = sub(intro); rb.path('M 70 140 L 70 196 L 82 184 L 94 196 L 94 140', { fill: C.fill, sw: 2 });
    on(rb, p, .7, { loop: 2.4, ox: 82, oy: 140, r: [[0, 0], [.6, 6, 'soft'], [1.8, -6, 'soft'], [2.4, 0, 'soft']] });
    const cv = sub(intro);
    cv.rect(-140, -160, 260, 310, { rx: 16, fill: C.fill, sw: 3.2 }); cv.rect(-140, -160, 40, 310, { rx: 12, fill: C.fill, sw: 2.6 });
    cv.rect(-60, -110, 140, 64, { rx: 8, sw: 2.2 }); cv.line(-36, -78, 56, -78, { sw: 2 });
    [[120, -160, -1, 1], [120, 150, -1, -1]].forEach(([x, y, a, b]) => cv.path(`M ${x} ${y + b * 30} L ${x} ${y + b * 10} Q ${x} ${y} ${x + a * 10} ${y} L ${x + a * 30} ${y}`, { sw: 4.4 }));
    star4(cv, 10, 40, 22); cv.path('M -88 -130 L -88 -30', { sw: 3 });
    on(cv, p, .8, { loop: 3, ox: -140, oy: 0, sx: [[0, 1], [.4, .8, 'io'], [1.6, .8], [2, 1, 'io']] });
    on(intro, p, 0, { r: [[0, -14], [.55, 0, 'back']], s: [[0, .6], [.5, 1, 'out']], o: [[0, 0], [.15, 1]], ox: 0, oy: 150 });
  });

  /* languages — two cards; the letters swap, the arrows between them turn */
  rig('languages-pro', .6, p => {
    const intro = sub(p);
    const card = (x, y, r, a, b) => { const g = sub(intro), q = g.child({ transform: `translate(${x} ${y}) rotate(${r})` });
      q.rect(-78, -78, 156, 156, { rx: 22, fill: C.fill, sw: 3 });
      const t1 = sub(q), t2 = sub(q); t1.text(a, 0, 34, { size: 100, at: 0, dur: .01 }); t2.text(b, 0, 34, { size: 100, at: 0, dur: .01 });
      on(t1, p, .6, { loop: 3.2, o: [[0, 1], [1.4, 1], [1.6, 0], [3, 0], [3.2, 1]] }); on(t2, p, .6, { loop: 3.2, o: [[0, 0], [1.4, 0], [1.6, 1], [3, 1], [3.2, 0]] });
      q.path('M -60 -40 L -60 -60 L -40 -60', { sw: 2.6 }); return g; };
    const L = card(-96, -50, -6, 'A', 'ก'), Rr = card(96, 60, 6, 'ก', 'A');
    const arw = sub(intro), ar = sub(arw);
    ar.path('M -30 70 C -60 100, -70 130, -40 150', { sw: 3 }); ar.poly([[-52, 140], [-38, 152], [-26, 136]], { sw: 3 });
    ar.path('M 30 -70 C 60 -100, 70 -130, 40 -150', { sw: 3 }); ar.poly([[52, -140], [38, -152], [26, -136]], { sw: 3 });
    on(ar, p, .6, { loop: 3.2, r: [[0, 0], [1.3, 0], [1.7, 180, 'io'], [2.9, 180], [3.2, 180]] }); pop(p, arw, .3, .3);
    on(L, p, 0, { x: [[0, -80], [.5, 0, 'back']], o: [[0, 0], [.15, 1]] }); on(Rr, p, .1, { x: [[0, 80], [.5, 0, 'back']], o: [[0, 0], [.15, 1]] });
  });

  /* trash-2 — lid swings open, a crumpled paper drops in, lid shuts */
  rig('trash-2-pro', .6, p => {
    const root = sub(p), intro = sub(root);
    on(root, p, 0, { y: [[0, -70], [.5, 0, 'back']], o: [[0, 0], [.18, 1]] });
    const ball = sub(intro); ball.circle(10, -40, 30, { fill: C.fill, sw: 2.6 }); ball.path('M -6 -56 L 8 -38 L 30 -28', { sw: 2 });
    on(ball, p, .7, { loop: 2.8, ox: 10, oy: -40, y: [[0, -170], [.4, -170], [.75, 60, 'in'], [.8, 60]], o: [[0, 0], [.4, 0], [.42, 1], [.78, 1], [.8, 0]], r: [[.4, 0], [.8, 160, 'lin']] });
    intro.path('M -104 -70 L 104 -70 L 86 150 Q 84 164 70 164 L -70 164 Q -84 164 -86 150 Z', { fill: C.fill, sw: 3.2 });
    [-50, 0, 50].forEach(x => intro.line(x * .9, -40, x * .78, 136, { sw: 2.4 })); intro.path('M -90 -50 L -80 60', { sw: 3 });
    const lid = sub(intro); lid.rect(-126, -100, 252, 30, { rx: 10, fill: C.fill, sw: 3 }); lid.path('M -36 -100 L -36 -124 Q -36 -132 -28 -132 L 28 -132 Q 36 -132 36 -124 L 36 -100', { fill: C.fill, sw: 3 }); 
    on(lid, p, .7, { loop: 2.8, ox: -126, oy: -70, r: [[0, 0], [.25, -32, 'out'], [.85, -32], [1.05, 0, 'in'], [1.12, 2], [1.2, 0]] });
    on(intro, p, .7, { loop: 2.8, ox: 0, oy: 164, sy: [[0, 1], [1.05, 1], [1.12, .96, 'out'], [1.3, 1]] });
  });

  /* user-check — profile rises, a check badge ticks itself in */
  rig('user-check-pro', .9, p => {
    const intro = sub(p), b = sub(intro); bust(b, -20, 0, 1);
    const cb = sub(intro); cb.circle(116, 100, 44, { fill: C.fill, sw: 3.2 });
    const tk = cb.poly([[96, 100], [110, 116], [138, 84]], { sw: 7 }); on(tk, p, .9, { loop: 2.6, draw: [[0, 0], [.3, 1, 'out'], [2.3, 1], [2.5, 0]] });
    on(cb, p, .5, { ox: 116, oy: 100, s: [[0, 0], [.4, 1.12, 'out'], [.55, 1]] });
    const ring = sub(intro); ring.circle(116, 100, 44, { stroke: C.soft, sw: 2 }); on(ring, p, 1.2, { loop: 2.6, ox: 116, oy: 100, s: [[0, 1], [1, 1.6, 'out']], o: [[0, .8], [1, 0]] });
    on(intro, p, 0, { y: [[0, 50], [.5, 0, 'back']], o: [[0, 0], [.2, 1]] });
  });

  /* circle-check — solid glowing disc, dark tick, confetti dots burst */
  rig('circle-check-pro', .6, p => {
    const intro = sub(p);
    for (let i = 0; i < 10; i++) { const a = i * Math.PI / 5, d = sub(intro), x = Math.cos(a) * 150, y = Math.sin(a) * 150; d.dot(x, y, i % 2 ? 5 : 6.5);
      on(d, p, .7, { loop: 2.2, x: [[0, -x * .3], [.5, 0, 'out']], y: [[0, -y * .3], [.5, 0, 'out']], o: [[0, 0], [.1, 1], [.7, 0]], s: [[0, .4], [.5, 1]] }); }
    const disc = sub(intro); disc.circle(0, 0, 122, { fill: C.ink, sw: 2 }); disc.circle(0, 0, 104, { sw: 1.6, stroke: C.fill });
    disc.poly([[-52, 4], [-16, 40], [56, -36]], { sw: 14, stroke: C.fill }); disc.path('M -84 -40 A 92 92 0 0 1 -40 -84', { sw: 5, stroke: C.fill });
    on(disc, p, .7, { loop: 2.2, s: [[0, 1], [.12, 1.08, 'out'], [.35, 1, 'soft']] });
    pop(p, intro, 0, .3);
  });

  /* x — two strokes slash in, then a firm "no" shake */
  rig('x-pro', .6, p => {
    const intro = sub(p), g = sub(intro);
    const a = sub(g); tube(a, 'M -110 -110 L 110 110', 34); const b = sub(g); tube(b, 'M 110 -110 L -110 110', 34);
        on(a, p, 0, { ox: -110, oy: -110, s: [[0, 0], [.25, 1, 'out']] }); on(b, p, .15, { ox: 110, oy: -110, s: [[0, 0], [.25, 1, 'out']] });
    on(g, p, .7, { loop: 2.2, r: shakeKeys(6, 7, .06) });
    [[-150, -60], [150, 60], [140, -130]].forEach(([x, y], i) => { const s = sub(intro); s.line(x, y, x + (x > 0 ? 20 : -20), y - 14, { sw: 3 }); on(s, p, .7, { loop: 2.2, o: [[0, 0], [.05 + i * .02, 1], [.4, 0]] }); });
  });

  /* thumbs-down — hand drops in, nudges down twice */
  rig('thumbs-down-pro', .6, p => {
    const intro = sub(p), h = sub(intro), q = h.child({ transform: 'rotate(180 0 0) translate(0 -6)' }); thumb(q);
    on(h, p, .7, { loop: 2, y: [[0, 0], [.15, 14, 'out'], [.3, 0, 'io'], [.45, 12, 'out'], [.6, 0, 'io']] });
    drop(p, intro, 0, -120);
  });

  /* puzzle — the second piece slides in and clicks into the first */
  rig('puzzle-pro', .6, p => {
    const intro = sub(p);
    const A = sub(intro); A.path('M -110 -100 L -10 -100 L -10 -30 C 20 -40, 40 -20, 40 0 C 40 20, 20 40, -10 30 L -10 100 L -110 100 Q -120 100 -120 90 L -120 -90 Q -120 -100 -110 -100 Z', { fill: C.fill, sw: 3 });
    
    A.path('M -104 -70 L -104 40', { sw: 3 });
    const B = sub(intro); B.path('M -10 -100 L 30 -100 C 20 -130, 40 -150, 60 -150 C 80 -150, 100 -130, 90 -100 L 120 -100 Q 130 -100 130 -90 L 130 90 Q 130 100 120 100 L -10 100 L -10 30 C 20 40, 40 20, 40 0 C 40 -20, 20 -40, -10 -30 Z', { fill: C.fill, sw: 3 });
    
    on(B, p, .5, { loop: 3, x: [[0, 110], [.5, 0, 'back'], [2.2, 0], [2.6, 110, 'in'], [3, 110]], r: [[0, 12], [.5, 0, 'out'], [2.2, 0], [2.6, 12, 'in']], o: [[0, 0], [.1, 1], [2.55, 1], [2.75, 0]] });
    on(A, p, .5, { loop: 3, s: [[0, 1], [.48, 1], [.56, 1.04, 'out'], [.7, 1]] });
    pop(p, A);
  });

  /* biceps-flexed — arm flexes: forearm curls in, the biceps swells, power lines flash */
  rig('biceps-flexed-pro', .6, p => {
    const intro = sub(p), fa = sub(intro);
    fa.path('M 50 100 C 40 30, 50 -40, 66 -84 L 150 -84 C 156 -30, 150 40, 140 110 Z', { fill: C.fill, sw: 3 }); fa.path('M 120 -70 C 126 -20, 124 40, 116 90', mute);
    fa.rect(52, -164, 108, 88, { rx: 30, fill: C.fill, sw: 3 }); ['M 82 -162 q 7 18 0 36', 'M 108 -162 q 7 18 0 36', 'M 134 -160 q 7 18 0 34'].forEach(d => fa.path(d, fine));
    fa.path('M 58 -112 C 90 -104, 124 -100, 156 -106', { sw: 2 }); fa.path('M 64 -146 Q 70 -160 86 -162', { sw: 2.6 });
    const up = sub(intro); up.path('M -166 132 C -198 104, -196 60, -158 46 C -116 32, -40 34, 32 50 Q 112 70 134 116 Q 126 148 70 150 L -146 150 Q -164 148 -166 132 Z', { fill: C.fill, sw: 3 });
    up.path('M -170 110 C -100 118, -20 124, 60 128', mute); up.circle(110, 112, 5, { sw: 1.4, stroke: C.soft });
    const bu = sub(intro); bu.path('M -146 50 C -120 -30, 2 -40, 40 54 Z', { fill: C.fill, stroke: C.fill, sw: 6 }); bu.path('M -146 50 C -120 -30, 2 -40, 40 54', { sw: 3 }); bu.path('M -110 10 C -84 -20, -40 -24, -10 0', fine); bu.path('M -120 20 Q -110 -6 -86 -16', { sw: 3 });
    on(bu, p, .7, { loop: 1.8, ox: -50, oy: 44, sy: [[0, 1], [.3, 1.28, 'out'], [.9, 1.28], [1.3, 1, 'io']], sx: [[0, 1], [.3, 1.04, 'out'], [1.3, 1, 'io']] });
    on(fa, p, .7, { loop: 1.8, ox: 100, oy: 112, r: [[0, 0], [.3, -9, 'out'], [.9, -9], [1.3, 0, 'io']] });
    [[-120, -70, -130, -100], [-60, -84, -60, -118], [0, -70, 10, -100]].forEach(([x1, y1, x2, y2], i) => { const s = sub(intro); s.line(x1, y1, x2, y2, { sw: 3.4 }); on(s, p, .7, { loop: 1.8, o: [[0, 0], [.28 + i * .03, 0], [.34 + i * .03, 1], [.9, 1], [1.1, 0]] }); });
    pop(p, intro);
  });

  /* heart-pulse — heart beats as the pulse line traces through it */
  rig('heart-pulse-pro', .5, p => {
    const intro = sub(p), hb = sub(intro), h = hb.child({ transform: 'scale(1.9)' }, 1.9);
    h.path(HEART, { fill: C.fill, sw: 2.6 });     const pts = [[-140, 10], [-70, 10], [-54, -8], [-40, 10], [-22, 10], [-8, -76], [10, 80], [26, 10], [60, 10], [74, -16], [88, 10], [140, 10]];
    intro.poly(pts, { sw: 1.2, stroke: C.rule }); const tr = intro.poly(pts, { sw: 4 });
    on(tr, p, .5, { loop: 1.8, draw: [[0, 0], [1, 1, 'lin']], o: [[0, 1], [1.2, 1], [1.7, 0]] });
    on(hb, p, .5, { loop: 1.8, s: [[0, 1], [.45, 1], [.55, 1.12, 'out'], [.7, .96], [.85, 1]] });
    pop(p, intro);
  });

  /* zap — bolt strikes: flickers on, sparks burst, a jolt shake */
  rig('zap-pro', .6, p => {
    const intro = sub(p);
    for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4 + .3, s = sub(intro); s.line(Math.cos(a) * 130, Math.sin(a) * 130, Math.cos(a) * 168, Math.sin(a) * 168, { sw: 3 });
      on(s, p, .7, { loop: 2, ox: 0, oy: 0, o: [[0, 0], [.05, 1], [.35, 0]], s: [[0, .8], [.35, 1.15, 'out']] }); }
    const bo = sub(intro);
    bo.shape([[30, -178], [-96, 22], [-6, 22], [-40, 178], [96, -30], [6, -30]], { fill: C.fill, sw: 3.4 });
        on(bo, p, .7, { loop: 2, o: [[0, 1], [.04, .3], [.08, 1], [.12, .4], [.16, 1]], r: shakeKeys(4, 2.5, .05) });
    on(intro, p, 0, { s: [[0, .2], [.25, 1.15, 'out'], [.45, 1]], o: [[0, 0], [.06, 1], [.1, .3], [.14, 1]] });
  });

  /* banknote — two bills; the top one flicks like it is being counted */
  rig('banknote-pro', .6, p => {
    const intro = sub(p);
    const bill = (q, o) => { q.rect(-170, -90, 340, 180, { rx: 14, fill: C.fill, sw: o ? 3 : 2.4, stroke: o ? C.ink : C.soft }); if (!o) return;
      q.circle(0, 0, 46, { sw: 2.4 }); q.text('$', 0, 18, { size: 54 });
      [[-120, 0], [120, 0]].forEach(([x, y]) => q.circle(x, y, 12, { sw: 2 })); q.path('M -150 -40 L -150 30', { sw: 2.6 }); };
    const back = sub(intro); bill(back.child({ transform: 'translate(20 34) rotate(5)' }), false);
    const top = sub(intro); bill(top, true);
    on(top, p, .7, { loop: 2.4, ox: -170, oy: 90, r: [[0, 0], [.18, -7, 'out'], [.36, 0, 'io'], [.54, -5, 'out'], [.72, 0, 'io']], y: [[0, 0], [.18, -10], [.36, 0], [.54, -8], [.72, 0]] });
    on(intro, p, 0, { x: [[0, -140], [.55, 0, 'back']], o: [[0, 0], [.2, 1]] });
  });

  /* store — shopfront: awning flutters, OPEN sign swings, window lights twinkle */
  rig('store-pro', .6, p => {
    const intro = sub(p);
    intro.rect(-160, -40, 320, 196, { rx: 10, fill: C.fill, sw: 3 }); intro.line(-180, 156, 180, 156, { sw: 3 });
    [[-140, 0], [40, 0]].forEach(([x, y]) => { intro.rect(x, y, 100, 86, { rx: 6, sw: 2.4 }); });
    const lights = [[-112, 20], [-68, 64], [70, 22], [116, 60]].map(([x, y], i) => { const l = sub(intro); l.dot(x, y, 4); on(l, p, .8 + i * .3, { loop: 1.6, o: [[0, .2], [.4, 1, 'soft'], [1.6, .2, 'soft']] }); return l; });
    intro.rect(-34, 40, 68, 116, { rx: 6, fill: C.fill, sw: 2.6 }); intro.circle(20, 100, 3.4, { sw: 1.4 });
    const sign = sub(intro); sign.line(-12, 44, -20, 60, { sw: 1.6 }); sign.line(12, 44, 20, 60, { sw: 1.6 }); sign.rect(-28, 58, 56, 24, { rx: 4, fill: C.fill, sw: 1.8 }); sign.text('OPEN', 0, 75, { size: 13, ls: 1 });
    on(sign, p, .7, { loop: 2.6, ox: 0, oy: 44, r: [[0, 0], [.4, 10, 'out'], [.8, -7], [1.2, 4], [1.6, 0], [2.6, 0]] });
    const aw = sub(intro); let a = 'M -180 -40 L -156 -120 L 156 -120 L 180 -40';
    for (let i = 1; i <= 6; i++) a += ` A 30 22 0 0 1 ${180 - 60 * i} -40`;
    aw.path(a + ' Z', { fill: C.fill, sw: 3 }); [-120, -60, 0, 60, 120].forEach(x => aw.line(x * 1.0, -118, x * 1.1, -44, { sw: 1.4, stroke: C.soft }));
    aw.rect(-70, -170, 140, 40, { rx: 8, fill: C.fill, sw: 2.6 }); aw.line(-40, -150, 40, -150, { sw: 2.4 });
    on(aw, p, .7, { loop: 2.2, ox: 0, oy: -120, ky: [[0, 0], [.55, 1.2, 'soft'], [1.65, -1.2, 'soft'], [2.2, 0, 'soft']] });
    pop(p, intro, 0, .6);
  });

  /* bookmark-check — ribbon drops, the check ticks itself, saved sparkle */
  rig('bookmark-check-pro', .7, p => {
    const intro = sub(p), rb = sub(intro);
    rb.path('M -84 -170 L 84 -170 Q 100 -170 100 -154 L 100 176 L 0 104 L -100 176 L -100 -154 Q -100 -170 -84 -170 Z', { fill: C.fill, sw: 3.2 });
        const tk = rb.poly([[-46, -24], [-12, 12], [52, -54]], { sw: 12 }); on(tk, p, .7, { loop: 2.6, draw: [[0, 0], [.35, 1, 'out'], [2.3, 1], [2.5, 0]] });
    on(rb, p, .9, { loop: 2.6, ox: 0, oy: -170, r: [[0, 0], [.65, 2, 'soft'], [1.95, -2, 'soft'], [2.6, 0, 'soft']] });
    on(intro, p, 0, { y: [[0, -160], [.55, 0, 'back']], o: [[0, 0], [.1, 1]] });
  });

  /* arrow-right — slides in, then keeps nudging forward with speed lines */
  rig('arrow-right-pro', .6, p => {
    const intro = sub(p), ar = sub(intro);
    tube(ar, 'M -150 0 L 110 0', 36); tube(ar, 'M 40 -80 L 124 0 L 40 80', 36);
    on(ar, p, .7, { loop: 1.4, x: [[0, 0], [.25, 26, 'out'], [.6, 0, 'io']] });
    [[-200, -50, 50], [-196, 50, 40], [-210, 0, 30]].forEach(([x, y, l], i) => { const s = sub(intro); s.line(x, y, x + l, y, { sw: 3, stroke: C.soft }); on(s, p, .7, { loop: 1.4, x: [[0, 20], [.3, -10, 'out']], o: [[0, 0], [.05 + i * .03, 1], [.45, 0]] }); });
    on(intro, p, 0, { x: [[0, -160], [.55, 0, 'back']], o: [[0, 0], [.15, 1]] });
  });

  /* message-circle-warning — bubble pops, then shudders while the "!" throbs */
  rig('message-circle-warning-pro', .6, p => {
    const intro = sub(p), bub = sub(intro); bubble(bub);
    const ex = sub(bub); ex.line(0, -70, 0, 6, { sw: 14 }); ex.dot(0, 46, 11);
    on(ex, p, .7, { loop: 2, ox: 0, oy: 0, s: [[0, 1], [.1, 1.16, 'out'], [.4, 1, 'soft']] });
    on(bub, p, .7, { loop: 2, ox: 0, oy: 120, r: shakeKeys(5, 3, .05) });
    on(intro, p, 0, { ox: 0, oy: 120, sx: [[0, .3], [.3, 1.12, 'out'], [.45, .96], [.6, 1]], sy: [[0, .3], [.3, .92, 'out'], [.45, 1.04], [.6, 1]], o: [[0, 0], [.12, 1]] });
  });

  /* video — film camera: reels spin, the REC light blinks */
  rig('video-pro', .6, p => {
    const intro = sub(p);
    const reel = (x, y, r) => { const g = sub(intro); g.circle(x, y, r, { fill: C.fill, sw: 3 }); g.circle(x, y, r * .3, { sw: 2 });
      on(g, p, .6, { loop: 2.4, ox: x, oy: y, r: [[0, 0], [2.4, 360, 'lin']] }); };
    reel(-80, -104, 52); reel(40, -96, 44);
    intro.shape([[90, 0], [180, -50], [180, 90], [90, 40]], { fill: C.fill, sw: 3 }); intro.line(180, -50, 180, 90, { sw: 4 });
    intro.rect(-160, -40, 260, 150, { rx: 22, fill: C.fill, sw: 3.2 });
    
    intro.path('M -140 20 L -140 80', { sw: 3 });
    const rec = sub(intro); rec.dot(60, 0, 9); on(rec, p, .6, { loop: 1.2, o: [[0, 1], [.6, 1], [.62, .15], [1.2, .15]] });
    intro.line(-60, 110, -80, 160, { sw: 3 }); intro.line(0, 110, 20, 160, { sw: 3 }); intro.line(-30, 110, -30, 164, { sw: 2.4 });
    pop(p, intro);
  });

  /* graduation-cap — tossed up spinning, lands, the tassel swings */
  rig('graduation-cap-pro', 1, p => {
    const intro = sub(p), cap = sub(intro);
    cap.path('M -100 10 L -100 80 C -60 110, 60 110, 100 80 L 100 10', { fill: C.fill, sw: 3 }); 
    cap.shape([[0, -110], [190, -30], [0, 50], [-190, -30]], { fill: C.fill, sw: 3.2 }); 
    cap.circle(0, -30, 10, { fill: C.fill, sw: 2.4 }); cap.path('M -140 -40 L -40 -82', { sw: 3 });
    const ts = sub(cap); ts.path('M 0 -30 L 150 -20 L 150 60', { sw: 2.6 }); ts.path('M 142 60 L 158 60 L 162 106 L 138 106 Z', { fill: C.fill, sw: 2.2 }); 
    on(ts, p, 1.1, { loop: 2.4, ox: 150, oy: -20, r: [[0, 0], [.3, 10, 'out'], [.7, -8], [1.1, 4], [1.5, 0], [2.4, 0]] });
    on(cap, p, 0, { ox: 0, oy: 0, y: [[0, 0], [.4, -120, 'out'], [.8, 0, 'in'], [.9, -14, 'out'], [1, 0, 'in']], r: [[0, 0], [.8, 360, 'io']], s: [[0, .5], [.3, 1, 'out']], o: [[0, 0], [.1, 1]] });
  });

  /* octagon-alert — drops in, ring pulses out, "!" throbs, small shake */
  rig('octagon-alert-pro', .6, p => {
    const intro = sub(p), oct = r => { const a = []; for (let i = 0; i < 8; i++) { const t = Math.PI / 8 + i * Math.PI / 4; a.push([+(Math.cos(t) * r).toFixed(1), +(Math.sin(t) * r).toFixed(1)]); } return a; };
    const pr = sub(intro); pr.shape(oct(140), { stroke: C.soft, sw: 2 }); on(pr, p, .7, { loop: 2, s: [[0, 1], [.9, 1.35, 'out']], o: [[0, .7], [.9, 0]] });
    const g = sub(intro); g.shape(oct(140), { fill: C.fill, sw: 3.4 }); g.shape(oct(122), { sw: 1.4, stroke: C.soft });
    const ex = sub(g); ex.line(0, -66, 0, 20, { sw: 16 }); ex.dot(0, 62, 12); on(ex, p, .7, { loop: 2, s: [[0, 1], [.1, 1.15, 'out'], [.4, 1, 'soft']] });
    g.path('M -100 -40 L -40 -100', { sw: 3 });
    on(g, p, .7, { loop: 2, r: shakeKeys(4, 3, .05) });
    drop(p, intro, 0, -100);
  });

  /* shield — pops up, emblem tick draws, deflection sparks flash at the edges */
  rig('shield-pro', .6, p => {
    const intro = sub(p), sh = sub(intro);
    const S = 'M 0 -170 C 50 -140, 100 -130, 140 -130 C 140 -10, 120 110, 0 170 C -120 110, -140 -10, -140 -130 C -100 -130, -50 -140, 0 -170 Z';
    sh.path(S, { fill: C.fill, sw: 3.4 }); sh.child({ transform: 'scale(.86)' }, .86).path(S, { sw: 1.6, stroke: C.soft });
        const tk = sh.poly([[-50, 0], [-14, 38], [56, -40]], { sw: 12 }); on(tk, p, .6, { loop: 2.6, draw: [[0, 0], [.35, 1, 'out'], [2.3, 1], [2.5, 0]] });
    [[-1, -40], [1, 30]].forEach(([sd, y], i) => { const s = sub(intro); [[0, 0], [10, -22], [10, 22]].forEach(([dx, dy]) => s.line(sd * (156 + dx), y + dy, sd * (180 + dx), y + dy * 1.6, { sw: 2.6 }));
      on(s, p, 1 + i * .5, { loop: 2.6, o: [[0, 0], [.04, 1], [.4, 0]] }); });
    on(sh, p, .6, { loop: 2.6, s: [[0, 1], [.38, 1], [.46, 1.05, 'out'], [.7, 1]] });
    on(intro, p, 0, { y: [[0, 60], [.55, 0, 'back']], o: [[0, 0], [.2, 1]] });
  });

  /* exits (ท่าออก) mirror each entrance; anything not listed leaves with 'pop' */
  Object.entries({'trash-2-pro': 'rise', 'user-check-pro': 'sink', 'thumbs-down-pro': 'rise', 'zap-pro': 'blink', 'store-pro': 'rise', 'bookmark-check-pro': 'rise', 'arrow-right-pro': 'slide', 'graduation-cap-pro': 'rise', 'octagon-alert-pro': 'rise', 'shield-pro': 'sink'}).forEach(([n, k]) => { R[n].exit = k; });
  Object.assign(G.icons, R);
  const ALIAS = { book: 'book-pro', languages: 'languages-pro', 'trash-2': 'trash-2-pro', trash: 'trash-2-pro', 'user-check': 'user-check-pro', 'circle-check': 'circle-check-pro', x: 'x-pro', cross: 'x-pro',
    'thumbs-down': 'thumbs-down-pro', puzzle: 'puzzle-pro', 'biceps-flexed': 'biceps-flexed-pro', 'heart-pulse': 'heart-pulse-pro', zap: 'zap-pro', banknote: 'banknote-pro', store: 'store-pro',
    'bookmark-check': 'bookmark-check-pro', 'arrow-right': 'arrow-right-pro', 'message-circle-warning': 'message-circle-warning-pro', video: 'video-pro', 'graduation-cap': 'graduation-cap-pro',
    'octagon-alert': 'octagon-alert-pro', shield: 'shield-pro' };
  for (const [a, pro] of Object.entries(ALIAS)) { if (G.icons[a] && !G.icons[a + '-basic'] && !G.icons[a].custom) G.icons[a + '-basic'] = G.icons[a]; G.icons[a] = R[pro]; }
  G.PRO4 = Object.keys(R); G.parts.thumbHand = thumb;
})();
