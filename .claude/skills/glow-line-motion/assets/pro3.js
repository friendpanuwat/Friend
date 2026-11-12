/* pro3.js — pro icon batch 3 (CutPack priority-1 names, next 20), same standard as pro2.js:
   main line 3 · detail 1.1–1.6 soft · dark see-through bodies · one glint + dot · only details that carry meaning (no stitching / rivets / tick rings / hairlines);
   every moving part is its own group with GL.kf keyframes (intro once, then a loop). */
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
  /* tube = outlined thick line (shackles, arrows, handles) */
  const tube = (p, d, w = 18) => { p.path(d, { sw: w }); p.path(d, { sw: w - 7, stroke: C.fill }); };
  /* a group that moves along a list of points (constant speed per segment) */
  const follow = (q, p, start, pts, loop) => on(q, p, start, { loop, x: pts.map(([x], i) => [i * loop / (pts.length - 1), x, 'lin']), y: pts.map(([, y], i) => [i * loop / (pts.length - 1), y, 'lin']) });
  /* profile bust used by users / user-plus (box ±118 × −114…150) */
  const bust = (q, x, y, s) => {
    const b = q.child({ transform: `translate(${x} ${y}) scale(${s})` }, s);
    b.path('M -118 150 C -118 64, -70 30, 0 30 C 70 30, 118 64, 118 150 Z', { fill: C.fill, sw: 3 });
    b.path('M -30 34 L 0 74 L 30 34', { sw: 2 });
    b.circle(0, -52, 62, { fill: C.fill, sw: 3 });
        return b;
  };
  const R = {}, rig = (name, dur, fn) => { fn.custom = true; fn.dur = dur; R[name] = fn; };

  /* bookmark — ribbon drops onto a page, sways, a saved-sparkle pops */
  rig('bookmark-pro', .7, p => {
    const intro = sub(p), page = sub(intro);
    page.rect(-150, -140, 300, 290, { rx: 18, fill: C.fill, sw: 2.6 });
    [-96, -66, -36, -6, 24, 54, 84].forEach((y, i) => page.line(-116, y, i % 3 === 2 ? -10 : 20, y, fine));
    page.path('M 150 110 L 110 150', { sw: 2 }); page.path('M 150 110 L 116 110 Q 110 110 110 116 L 110 150', { fill: C.fill, sw: 2 });
    const ro = sub(intro), rib = sub(ro);
    rib.path('M 50 -172 L 130 -172 Q 140 -172 140 -162 L 140 150 L 90 112 L 40 150 L 40 -162 Q 40 -172 50 -172 Z', { fill: C.fill, sw: 3 });
    rib.circle(90, -100, 20, { fill: C.fill, sw: 2.2 }); star4(rib, 90, -100, 11);     on(rib, p, .9, { loop: 2.8, ox: 90, oy: -172, r: [[0, 0], [.7, 2.5, 'soft'], [2.1, -2.5, 'soft'], [2.8, 0, 'soft']] });
    on(ro, p, .25, { y: [[0, -150], [.5, 0, 'back']], o: [[0, 0], [.1, 1]] });
    pop(p, page);
  });

  /* circle-help — ring draws, the "?" tilts as if thinking, small ?s drift up */
  const qpath = 'M -46 -40 C -46 -100, 50 -100, 50 -44 C 50 -8, 0 -6, 0 34';
  rig('circle-help-pro', .7, p => {
    const intro = sub(p);
    const ring = intro.circle(0, 0, 140, { fill: C.fill, sw: 3.2 }); on(ring, p, 0, { draw: [[0, 0], [.55, 1, 'io']] });
    intro.path('M -108 -60 A 124 124 0 0 1 -60 -108', { sw: 3 });
    const qg = sub(intro); qg.path(qpath, { sw: 14 }); qg.path('M -30 -52 C -24 -76, 10 -82, 26 -66', { sw: 2, stroke: C.fill }); qg.dot(0, 78, 11);
    on(qg, p, .7, { loop: 2.4, ox: 0, oy: 78, r: [[0, 0], [.4, -10, 'out'], [.9, 8], [1.3, -4], [1.6, 0]] });
    [[120, -120, .32, 0], [-128, -96, .24, .8]].forEach(([x, y, s, d]) => { const m = sub(intro), mm = m.child({ transform: `translate(${x} ${y}) scale(${s})` }, s); mm.path(qpath, { sw: 12 }); mm.dot(0, 78, 11);
      on(m, p, 1 + d, { loop: 2.4, y: [[0, 20], [1.6, -40, 'out']], o: [[0, 0], [.2, 1], [1.2, 1], [1.6, 0]] }); });
    on(intro, p, 0, { o: [[0, 0], [.08, 1]] });
  });

  /* users — two people rise in one after the other and bob out of step */
  rig('users-pro', .8, p => {
    const intro = sub(p), back = sub(intro), front = sub(intro);
    bust(back, 66, -14, .78); bust(front, -46, 14, .9);
    on(back, p, .9, { loop: 3, y: [[0, 0], [1.5, -6, 'soft'], [3, 0, 'soft']] });
    on(front, p, 1.6, { loop: 3, y: [[0, 0], [1.5, -5, 'soft'], [3, 0, 'soft']] });
    on(intro, p, 0, { y: [[0, 60], [.6, 0, 'back']], o: [[0, 0], [.2, 1]] });
  });

  /* eye — pupil looks left and right, the eye blinks */
  rig('eye-pro', .6, p => {
    const intro = sub(p), e = sub(intro);
    e.path('M -172 0 Q 0 -150 172 0 Q 0 150 -172 0 Z', { fill: C.fill, sw: 3.2 });
    for (let i = 1; i <= 7; i++) { const t = i / 8, x = -172 * (1 - t) * (1 - t) + 172 * t * t, y = -300 * t * (1 - t);   // points on the upper lid
      e.line(x, y - 3, x + (x / 172) * 16, y - 24, { sw: 2.4 }); }
    const ir = sub(e);
    ir.circle(0, 0, 58, { fill: C.fill, sw: 3 });
    ir.circle(0, 0, 24, { fill: C.ink, sw: 1.4 }); ir.circle(-12, -14, 7, { fill: C.fill, stroke: C.fill, sw: 1 });
    on(ir, p, .7, { loop: 3.2, x: [[0, 0], [.5, -46, 'io'], [1.3, -46], [1.8, 46, 'io'], [2.5, 46], [2.9, 0, 'io']] });
    on(e, p, .7, { loop: 3.2, sy: [[0, 1], [2.92, 1], [3.0, .06, 'in'], [3.1, 1, 'out']] });
    pop(p, intro);
  });

  /* utensils-crossed — fork and knife swing in, cross with a clink and a sparkle */
  rig('utensils-crossed-pro', .7, p => {
    const intro = sub(p);
    const fork = q => { P.capsule(q, 0, 40, 0, 184, 11, { sw: 3 }); P.capsule(q, 0, 4, 0, 44, 8, { sw: 2.6 });
      q.path('M -34 -70 L -34 -30 Q -34 4 0 8 Q 34 4 34 -30 L 34 -70', { fill: C.fill, sw: 3 }); [-25, -8, 8, 25].forEach(x => q.line(x, -160, x, -50, { sw: 4.5 })); };
    const knife = q => { P.capsule(q, 0, 18, 0, 184, 14, { sw: 3 });
      q.path('M -8 -176 C 32 -154, 34 -60, 24 18 L -18 18 Z', { fill: C.fill, sw: 3 }); q.path('M -12 -120 L -12 -40', { sw: 2.6 }); };
    const fo = sub(intro), fi = sub(fo), fc = fi.child({ transform: 'rotate(-32 0 10)' }); fork(fc);
    const ko = sub(intro), ki = sub(ko), kc = ki.child({ transform: 'rotate(32 0 10)' }); knife(kc);
    on(fo, p, 0, { ox: 0, oy: 10, r: [[0, -50], [.5, 0, 'back']], x: [[0, -60], [.5, 0, 'out']], o: [[0, 0], [.15, 1]] });
    on(ko, p, 0, { ox: 0, oy: 10, r: [[0, 50], [.5, 0, 'back']], x: [[0, 60], [.5, 0, 'out']], o: [[0, 0], [.15, 1]] });
    on(fi, p, .8, { loop: 2.4, ox: 0, oy: 10, r: [[0, 0], [.18, -6, 'out'], [.3, 0, 'in']] });
    on(ki, p, .8, { loop: 2.4, ox: 0, oy: 10, r: [[0, 0], [.18, 6, 'out'], [.3, 0, 'in']] });
  });

  /* search — magnifier circles over a page of results, lines inside the lens shimmer */
  rig('search-pro', .6, p => {
    const intro = sub(p), mg = sub(intro);
    P.capsule(mg, 48, 48, 138, 138, 19, { sw: 3 });
    P.capsule(mg, 34, 34, 56, 56, 24, { sw: 2.6 });
    mg.circle(-24, -24, 96, { fill: C.fill, sw: 3.6 });
    const ln = sub(mg); [[-80, -60, 40], [-80, -32, 20], [-80, -4, 50], [-80, 24, 10]].forEach(([x, y, w], i) => ln.line(x, y, x + w + 40, y, i ? fine : { sw: 2 }));
    on(ln, p, .8, { loop: 1.6, o: [[0, 1], [.8, .45, 'soft'], [1.6, 1, 'soft']] });
        on(mg, p, .7, { loop: 3, x: [[0, 0], [.75, 14, 'soft'], [1.5, 0, 'soft'], [2.25, -14, 'soft'], [3, 0, 'soft']], y: [[0, 0], [.75, -10, 'soft'], [1.5, -18, 'soft'], [2.25, -10, 'soft'], [3, 0, 'soft']], r: [[0, 0], [1.5, 4, 'soft'], [3, 0, 'soft']] });
    pop(p, intro);
  });

  /* handshake — two hands meet from the sides, fingers wrap over, they shake */
  rig('handshake-pro', .8, p => {
    const intro = sub(p), shake = sub(intro), L = sub(shake), Rr = sub(shake), T = sub(shake);
    L.rect(-206, -14, 96, 70, { rx: 12, fill: C.fill, sw: 3 }); L.line(-128, -10, -128, 52, fine); L.circle(-160, 21, 4, { sw: 1.4, stroke: C.soft });
    L.path('M -112 -18 C -70 -32, -20 -34, 24 -22 L 34 30 C -10 48, -60 54, -112 54 Z', { fill: C.fill, sw: 3 });
    L.path('M -96 40 C -70 36, -40 30, -20 24', mute);
    Rr.rect(110, -32, 96, 70, { rx: 12, fill: C.fill, sw: 3 }); Rr.line(128, -28, 128, 34, fine); Rr.circle(160, 3, 4, { sw: 1.4, stroke: C.soft });
    Rr.path('M 112 -36 C 84 -48, 40 -48, -4 -38 C -6 -10, 30 20, 72 36 C 90 40, 102 38, 112 34 Z', { fill: C.fill, sw: 3 });
    Rr.path('M 96 -26 C 76 -32, 56 -32, 40 -30', mute);
    for (let i = 3; i >= 0; i--) { const x0 = -10 + i * 22; P.capsule(Rr, x0, -32 + i * 2, x0 - 18, 28 - i * 5, 11, { sw: 2.6 }); }
    P.capsule(T, -50, -22, 12, -50, 12, { sw: 2.6 }); T.path('M -20 -42 Q -8 -48 4 -50', fine);
    [L, T].forEach(g => on(g, p, 0, { x: [[0, -90], [.6, 0, 'out']] })); on(Rr, p, 0, { x: [[0, 90], [.6, 0, 'out']] });
    on(shake, p, .8, { loop: 2.4, y: [[0, 0], [.15, -14, 'out'], [.3, 10, 'io'], [.45, -8, 'io'], [.6, 0, 'io']], r: [[0, 0], [.15, -2], [.3, 2], [.6, 0]] });
    [[-60, -100], [0, -122], [60, -100]].forEach(([x, y], i) => { const s = sub(intro); s.line(x * .78, y * .78 + 4, x, y, { sw: 3 }); on(s, p, .8, { loop: 2.4, o: [[0, 0], [.6 + i * .04, 0], [.66 + i * .04, 1], [1.1, 0]] }); });
    on(intro, p, 0, { o: [[0, 0], [.2, 1]] });
  });

  /* infinity — a glowing dot runs the endless loop, with two fading followers */
  rig('infinity-pro', .5, p => {
    const intro = sub(p), pts = [];
    for (let i = 0; i <= 96; i++) { const t = i / 96 * Math.PI * 2, d = 1 + Math.sin(t) ** 2; pts.push([+(178 * Math.cos(t) / d).toFixed(1), +(178 * Math.sin(t) * Math.cos(t) / d).toFixed(1)]); }
    intro.poly(pts, { sw: 18 }); intro.poly(pts, { sw: 11, stroke: C.fill });
        [0, .12, .24].forEach((d, i) => { const g = sub(intro); g.circle(0, 0, 9 - i * 2.5, { fill: C.ink, sw: 1, stroke: C.ink }); on(g, p, 0, { o: [[0, 1 - i * .3]] }); follow(g, p, .5 - d, pts, 3); });
    pop(p, intro);
  });

  /* image — framed landscape: mountains slide up, sun rises, a cloud drifts */
  rig('image-pro', .8, p => {
    const intro = sub(p);
    intro.rect(-170, -130, 340, 260, { rx: 22, fill: C.fill, sw: 3.2 });
    const sun = sub(intro); sun.circle(90, -62, 24, { fill: C.fill, sw: 2.6 }); const rays = sub(sun); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; rays.line(90 + Math.cos(a) * 32, -62 + Math.sin(a) * 32, 90 + Math.cos(a) * 42, -62 + Math.sin(a) * 42, { sw: 2 }); }
    on(rays, p, 1, { loop: 8, ox: 90, oy: -62, r: [[0, 0], [8, 360, 'lin']] });
    const cl = sub(intro); cl.path('M -110 -66 a 16 16 0 0 1 28 -12 a 20 20 0 0 1 36 6 a 12 12 0 0 1 2 22 L -104 -50 a 10 10 0 0 1 -6 -16 Z', { fill: C.fill, sw: 2 });
    on(cl, p, 1, { loop: 5, x: [[0, -10], [2.5, 30, 'soft'], [5, -10, 'soft']] });
    const mt = sub(intro);
    mt.shape([[-150, 112], [-70, 0], [-20, 50], [40, -36], [150, 112]], { fill: C.fill, sw: 2.8 });
    mt.poly([[52, -20], [40, -36], [24, -14], [36, -8], [44, -18], [52, -10]], { sw: 1.6 }); mt.poly([[-80, 14], [-70, 0], [-60, 14]], { sw: 1.6 });
    on(mt, p, .3, { y: [[0, 60], [.5, 0, 'back']], o: [[0, 0], [.1, 1]] });
    on(sun, p, .5, { y: [[0, 70], [.7, 0, 'out']], o: [[0, 0], [.1, 1]] });
    pop(p, intro, 0, .7);
  });

  /* user-plus — profile rises, the plus badge spins in, then throbs */
  rig('user-plus-pro', .9, p => {
    const intro = sub(p), b = sub(intro); bust(b, -20, 0, 1);
    const pb = sub(intro); pb.circle(116, 100, 44, { fill: C.fill, sw: 3.2 }); pb.line(94, 100, 138, 100, { sw: 7 }); pb.line(116, 78, 116, 122, { sw: 7 });
    on(pb, p, .5, { ox: 116, oy: 100, s: [[0, 0], [.4, 1.12, 'out'], [.55, 1]], r: [[0, -90], [.45, 0, 'out']] });
    on(b, p, 1.2, { loop: 2.6, ox: -20, oy: 150, sy: [[0, 1], [1.3, 1.02, 'soft'], [2.6, 1, 'soft']] });
    const ring = sub(intro); ring.circle(116, 100, 44, { stroke: C.soft, sw: 2 }); on(ring, p, 1.2, { loop: 2.6, ox: 116, oy: 100, s: [[0, 1], [1, 1.6, 'out']], o: [[0, .8], [1, 0]] });
    on(intro, p, 0, { y: [[0, 50], [.5, 0, 'back']], o: [[0, 0], [.2, 1]] });
  });

  /* tag — price tag hangs from its string and swings to rest */
  rig('tag-pro', .6, p => {
    const intro = sub(p), sw = sub(intro);
    sw.path('M 0 -196 C 14 -160, -14 -128, 0 -100', { sw: 2.2, stroke: C.soft });
    const t = sw.child({ transform: 'rotate(10 0 -96)' });
    t.path('M 0 -132 L 72 -64 L 72 122 Q 72 140 54 140 L -54 140 Q -72 140 -72 122 L -72 -64 Z', { fill: C.fill, sw: 3 });
    t.circle(0, -90, 12, { fill: C.fill, sw: 2.6 });
    t.circle(-24, 0, 13, { sw: 2.4 }); t.circle(24, 50, 13, { sw: 2.4 }); t.line(28, -12, -28, 62, { sw: 2.6 });
        on(sw, p, .4, { loop: 3.2, ox: 0, oy: -196, r: [[0, 0], [.2, 12, 'out'], [.5, -9], [.8, 6], [1.1, -3], [1.4, 0], [3.2, 0]] });
    on(intro, p, 0, { y: [[0, -100], [.45, 0, 'back']], o: [[0, 0], [.15, 1]] });
  });

  /* wallet — card slides up out of the pocket and back, snap button throbs */
  rig('wallet-pro', .6, p => {
    const intro = sub(p), card = sub(intro);
    card.rect(-130, -150, 200, 124, { rx: 12, fill: C.fill, sw: 2.6 }); card.rect(-110, -126, 34, 26, { rx: 5, sw: 1.6 }); card.line(-110, -76, -20, -76, { sw: 2 });
    on(card, p, .8, { loop: 2.6, y: [[0, 30], [.4, -30, 'out'], [1.6, -30], [2, 30, 'in']] });
    intro.rect(-170, -90, 340, 210, { rx: 28, fill: C.fill, sw: 3.2 });
    intro.path('M -150 -50 Q -146 -72 -122 -76', { sw: 3 });
    const tab = sub(intro); tab.path('M 170 -30 L 96 -30 Q 64 -30 64 2 L 64 28 Q 64 60 96 60 L 170 60', { fill: C.fill, sw: 3 });
    const sn = sub(tab); sn.circle(104, 15, 14, { fill: C.fill, sw: 2.6 }); sn.dot(104, 15, 4);
    on(sn, p, .9, { loop: 2.6, ox: 104, oy: 15, s: [[0, 1], [2, 1], [2.08, 1.2, 'out'], [2.3, 1]] });
    pop(p, intro);
  });

  /* calendar — top page flips up, the date gets circled and ticked */
  rig('calendar-pro', .7, p => {
    const intro = sub(p);
    const page = (q, marked) => {
      q.rect(-160, -126, 320, 276, { rx: 20, fill: C.fill, sw: 3 });
      q.path('M -160 -60 L 160 -60', { sw: 2.4 });
      for (let r = 0; r < 4; r++) for (let c = 0; c < 7; c++) q.circle(-120 + c * 40, -28 + r * 40, 3.6, { sw: 1.3, stroke: C.soft });
      return q;
    };
    const base = page(sub(intro));
    const ring = base.circle(40, 52, 18, { sw: 2.8 }); on(ring, p, .9, { loop: 3, draw: [[0, 0], [.5, 0], [.85, 1, 'io'], [2.6, 1], [2.7, 0]] });
    const ck = base.poly([[30, 52], [38, 60], [52, 44]], { sw: 2.8 }); on(ck, p, .9, { loop: 3, draw: [[0, 0], [.9, 0], [1.05, 1, 'out'], [2.6, 1], [2.7, 0]] });
    const top = page(sub(intro)); on(top, p, .9, { loop: 3, ox: 0, oy: -126, sy: [[0, 1], [.4, 0, 'in'], [2.6, 0], [2.95, 1, 'out']], o: [[0, 1], [.4, 1], [.41, 0], [2.6, 0], [2.61, 1]] });
    for (let i = 0; i < 6; i++) { const x = -110 + i * 44; intro.rect(x - 6, -146, 12, 36, { rx: 6, fill: C.fill, sw: 2.2 }); }
    intro.path('M -146 -30 L -146 120', { sw: 2.6 });
    pop(p, intro);
  });

  /* repeat — the loop of arrows turns half a turn, pauses, turns again */
  rig('repeat-pro', .6, p => {
    const intro = sub(p), lp = sub(intro);
    tube(lp, 'M -130 26 L -130 -8 Q -130 -62 -76 -62 L 116 -62'); lp.shape([[92, -98], [138, -62], [92, -26]], { fill: C.fill, sw: 3 });
    tube(lp, 'M 130 -26 L 130 8 Q 130 62 76 62 L -116 62'); lp.shape([[-92, 26], [-138, 62], [-92, 98]], { fill: C.fill, sw: 3 });
    on(lp, p, .7, { loop: 2, r: [[0, 0], [.55, 180, 'io'], [2, 180]] });
    pop(p, intro);
  });

  /* book-open — a page turns over the spine, ribbon hangs, sparkle */
  rig('book-open-pro', .7, p => {
    const intro = sub(p);
    intro.path('M -176 128 C -110 110, -40 114, 0 134 C 40 114, 110 110, 176 128', { sw: 2.4, stroke: C.soft });
    const half = (q, sd) => { q.path(`M 0 -110 C ${sd * 40} -130, ${sd * 110} -134, ${sd * 170} -116 L ${sd * 170} 110 C ${sd * 110} 92, ${sd * 40} 96, 0 116 Z`, { fill: C.fill, sw: 3 });
      for (let i = 0; i < 6; i++) q.line(sd * 24, -76 + i * 28, sd * (i === 5 ? 90 : 146), -80 + i * 28, i ? fine : { sw: 2 }); };
    half(sub(intro), -1); half(sub(intro), 1);
    const fl = sub(intro); half(fl, 1);
    on(fl, p, .9, { loop: 2.6, ox: 0, oy: 0, sx: [[0, 1], [.7, -1, 'io'], [.75, -1]], o: [[0, 0], [.02, 1], [.72, 1], [.76, 0]] });
    intro.line(0, -110, 0, 116, { sw: 2.6 });
    intro.path('M 6 -112 L 6 150 L 16 140 L 26 150 L 26 -100', { fill: C.fill, sw: 2 });
    intro.path('M -150 -100 Q -130 -112 -100 -116', { sw: 3 });
    pop(p, intro);
  });

  /* ear — sound waves travel in from the left and fade into the ear */
  rig('ear-pro', .6, p => {
    const intro = sub(p), ear = sub(intro);
    ear.path('M -40 -60 C -40 -130, 20 -160, 70 -150 C 130 -136, 150 -70, 130 -20 C 116 14, 84 30, 76 66 C 70 112, 40 150, 0 148 C -30 146, -46 124, -48 104 C -50 80, -30 70, -20 50 Z', { fill: C.fill, sw: 3.2 });
    ear.path('M -6 -60 C -4 -100, 40 -112, 70 -96 C 96 -80, 100 -44, 80 -20 C 66 -4, 46 4, 40 30', { sw: 2.4 });
    ear.path('M 18 -42 C 28 -58, 52 -58, 56 -40 C 58 -26, 44 -20, 38 -10', { sw: 1.8 });
    ear.path('M 20 -132 C 60 -138, 100 -118, 116 -80', fine); ear.path('M 26 100 C 30 120, 14 136, -6 134', mute);
        [0, 1, 2].forEach(i => { const w = sub(intro), r = 50 + i * 34;
      w.path(`M ${-210 + r * Math.cos(-.7)} ${r * Math.sin(-.7)} A ${r} ${r} 0 0 1 ${-210 + r * Math.cos(.7)} ${r * Math.sin(.7)}`, { sw: 3 - i * .6, stroke: i ? C.soft : C.ink });
      on(w, p, .7 + i * .25, { loop: 1.8, x: [[0, -20], [1.4, 40, 'out']], o: [[0, 0], [.2, 1], [1.4, 0]] }); });
    on(ear, p, .7, { loop: 1.8, ox: 40, oy: 0, s: [[0, 1], [1.2, 1], [1.3, 1.03, 'out'], [1.6, 1]] });
    pop(p, intro);
  });

  /* fish — swims in, tail flaps, body sways, bubbles rise */
  rig('fish-pro', .7, p => {
    const intro = sub(p), swim = sub(intro);
    const tail = sub(swim); tail.path('M 84 0 L 152 -82 Q 164 -88 162 -74 L 138 0 L 162 74 Q 164 88 152 82 Z', { fill: C.fill, sw: 3 });
    on(tail, p, .7, { loop: .7, ox: 90, oy: 0, r: [[0, 0], [.17, 14, 'soft'], [.52, -14, 'soft'], [.7, 0, 'soft']] });
    swim.path('M -50 -62 C -20 -112, 30 -112, 56 -56 Z', { fill: C.fill, sw: 2.6 }); swim.path('M -10 64 C 10 96, 40 96, 50 58 Z', { fill: C.fill, sw: 2.4 });
    swim.path('M -158 0 C -116 -76, 20 -98, 98 -20 Q 106 0 98 20 C 20 98, -116 76, -158 0 Z', { fill: C.fill, sw: 3.2 });
    swim.path('M -72 -46 Q -46 0 -72 46', { sw: 2.2 }); swim.path('M -150 4 L -132 8', { sw: 2 });
    swim.circle(-110, -16, 15, { fill: C.fill, sw: 2.4 }); swim.circle(-110, -16, 6, { fill: C.ink, sw: 1 }); swim.path('M -120 -50 Q -80 -76 -40 -76', { sw: 3 });
    on(swim, p, .7, { loop: 2.4, ox: 0, oy: 0, y: [[0, 0], [1.2, -8, 'soft'], [2.4, 0, 'soft']], r: [[0, 0], [.6, 2, 'soft'], [1.8, -2, 'soft'], [2.4, 0, 'soft']] });
    [[-180, -60, 9], [-196, -100, 6], [-174, -140, 11]].forEach(([x, y, r], i) => { const b = sub(intro); b.circle(x, y, r, fine); b.dot(x - r * .35, y - r * .35, 1.6);
      on(b, p, .8 + i * .5, { loop: 2, y: [[0, 40], [2, -40, 'lin']], o: [[0, 0], [.3, 1], [1.6, 1], [2, 0]] }); });
    on(intro, p, 0, { x: [[0, 200], [.7, 0, 'out']], o: [[0, 0], [.2, 1]] });
  });

  /* crown — drops and settles, jewels twinkle in turn, sparkles around */
  rig('crown-pro', .7, p => {
    const intro = sub(p), cr = sub(intro);
    cr.path('M -150 60 L -172 -82 L -90 -8 L 0 -124 L 90 -8 L 172 -82 L 150 60 Z', { fill: C.fill, sw: 3.2 });
    [[-172, -82], [0, -124], [172, -82]].forEach(([x, y]) => cr.circle(x, y, 11, { fill: C.fill, sw: 2.6 }));
    cr.rect(-158, 58, 316, 48, { rx: 10, fill: C.fill, sw: 3 });
    cr.path('M -126 30 L -138 -36', { sw: 3 });
    [-100, 0, 100].forEach((x, i) => { const j = sub(cr); j.shape([[x, 66], [x + 13, 82], [x, 98], [x - 13, 82]], { fill: C.fill, sw: 2.2 }); j.dot(x, 82, 3);
      on(j, p, .9 + i * .3, { loop: 2.4, ox: x, oy: 82, s: [[0, 1], [.15, 1.3, 'out'], [.45, 1, 'soft']] }); });
    on(cr, p, .8, { loop: 3, ox: 0, oy: 106, r: [[0, 0], [1.5, 2.5, 'soft'], [3, 0, 'soft']] });
    on(intro, p, 0, { ox: 0, oy: 106, y: [[0, -150], [.4, 0, 'in']], sy: [[.4, .88], [.52, 1.04, 'out'], [.66, 1]], o: [[0, 0], [.1, 1]] });
  });

  /* message-circle-question — bubble pops, the "?" inside tilts, a small ? drifts out */
  rig('message-circle-question-pro', .6, p => {
    const intro = sub(p), bub = sub(intro);
    bub.path('M 0 -132 C 86 -132, 146 -76, 146 -6 C 146 64, 86 120, 0 120 C -20 120, -40 117, -58 111 L -128 140 L -108 80 C -132 58, -146 28, -146 -6 C -146 -76, -86 -132, 0 -132 Z', { fill: C.fill, sw: 3.2 });
        const q = sub(bub), qq = q.child({ transform: 'translate(0 -18) scale(.9)' }, .9); qq.path(qpath, { sw: 14 }); qq.dot(0, 78, 11);
    on(q, p, .7, { loop: 2.4, ox: 0, oy: 52, r: [[0, 0], [.4, -9, 'out'], [.9, 7], [1.3, -3], [1.6, 0]] });
    const m = sub(intro), mm = m.child({ transform: 'translate(150 -130) scale(.3)' }, .3); mm.path(qpath, { sw: 14 }); mm.dot(0, 78, 11);
    on(m, p, 1, { loop: 2.4, y: [[0, 20], [1.6, -30, 'out']], o: [[0, 0], [.2, 1], [1.2, 1], [1.6, 0]] });
    on(bub, p, 0, { ox: 0, oy: 120, sx: [[0, .3], [.3, 1.12, 'out'], [.45, .96], [.6, 1]], sy: [[0, .3], [.3, .92, 'out'], [.45, 1.04], [.6, 1]] });
    on(intro, p, 0, { o: [[0, 0], [.12, 1]] });
  });

  /* share-2 — signals travel from the centre node along both links, nodes throb on arrival */
  rig('share-2-pro', .9, p => {
    const intro = sub(p), A = [96, -112], B = [-96, 0], Cc = [96, 112];
    [A, Cc].forEach(N => { const l = intro.line(B[0], B[1], N[0], N[1], { sw: 3.4 }); on(l, p, .3, { draw: [[0, 0], [.4, 1, 'io']] }); });
    const node = ([x, y], at) => { const o = sub(intro), i = sub(o); i.circle(x, y, 44, { fill: C.fill, sw: 3.2 }); i.dot(x, y, 7); i.path(`M ${x - 30} ${y - 14} A 32 32 0 0 1 ${x - 14} ${y - 30}`, { sw: 2.6 });
      on(o, p, at, { ox: x, oy: y, s: [[0, 0], [.35, 1.1, 'out'], [.5, 1]] }); return i; };
    node(B, 0); const na = node(A, .55), nc = node(Cc, .65);
    [[A, na], [Cc, nc]].forEach(([N, nn]) => { const d = sub(intro); d.circle(0, 0, 8, { fill: C.ink, sw: 1, stroke: C.ink });
      const pts = [B, N]; on(d, p, 1, { loop: 2, x: [[0, B[0]], [.6, N[0], 'io'], [2, N[0]]], y: [[0, B[1]], [.6, N[1], 'io'], [2, N[1]]], o: [[0, 0], [.05, 1], [.6, 1], [.65, 0]] });
      on(nn, p, 1, { loop: 2, ox: N[0], oy: N[1], s: [[0, 1], [.6, 1], [.72, 1.14, 'out'], [.95, 1]] }); });
    on(intro, p, 0, { o: [[0, 0], [.1, 1]] });
  });

  /* exits (ท่าออก) mirror each entrance; anything not listed leaves with 'pop' */
  Object.entries({'users-pro': 'sink', 'utensils-crossed-pro': 'spin', 'handshake-pro': 'fade', 'infinity-pro': 'spin', 'user-plus-pro': 'sink', 'tag-pro': 'rise', 'repeat-pro': 'spin', 'fish-pro': 'slideL', 'crown-pro': 'rise'}).forEach(([n, k]) => { R[n].exit = k; });
  Object.assign(G.icons, R);
  const ALIAS = { bookmark: 'bookmark-pro', 'circle-help': 'circle-help-pro', users: 'users-pro', eye: 'eye-pro', 'utensils-crossed': 'utensils-crossed-pro', search: 'search-pro', magnifier: 'search-pro',
    handshake: 'handshake-pro', infinity: 'infinity-pro', image: 'image-pro', 'user-plus': 'user-plus-pro', follow: 'user-plus-pro', tag: 'tag-pro', wallet: 'wallet-pro', calendar: 'calendar-pro', repeat: 'repeat-pro',
    'book-open': 'book-open-pro', ear: 'ear-pro', fish: 'fish-pro', crown: 'crown-pro', 'message-circle-question': 'message-circle-question-pro', 'share-2': 'share-2-pro', share: 'share-2-pro' };
  for (const [a, pro] of Object.entries(ALIAS)) { if (G.icons[a] && !G.icons[a + '-basic'] && !G.icons[a].custom) G.icons[a + '-basic'] = G.icons[a]; G.icons[a] = R[pro]; }
  G.PRO3 = Object.keys(R);
})();
