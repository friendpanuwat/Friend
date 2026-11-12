/* pro14.js — pro icon batch 14: CutPack priority-3 names 81–101 (celebration, travel & transport, places, nature; scan-eye skipped = body part).
   Detail level = pro.js (one soft inner outline, bands, the few parts the object really has), style.md §0 rules.
   Motion = anticipation, overshoot + settle, follow-through, secondary motion. Entrance and loop sit on separate groups.
   globe-pro redraws its meridians every frame (a real spinning sphere) through a small setT hook defined below. */
(function () {
  const G = window.GL, C = G.C;
  const sub = (p, attrs) => p.child(attrs || {});
  const on = (q, p, start, spec) => G.kf(q.g || q, p.t0 + start * p.ts, spec);
  const pop = (p, q, at = 0, from = .4) => on(q, p, at, { s: [[0, from], [.42, 1.08, 'out'], [.62, 1]], o: [[0, 0], [.16, 1]] });
  const thud = (p, q, oy, dy = -220) => on(q, p, 0, { ox: 0, oy, y: [[0, dy], [.42, 0, 'in']], sy: [[.42, .86], [.56, 1.06, 'out'], [.7, 1]], sx: [[.42, 1.1], [.56, .97, 'out'], [.7, 1]], o: [[0, 0], [.1, 1]] });
  const grow = (p, q, at, oy, ox = 0) => on(q, p, at, { ox, oy, sy: [[0, 0], [.45, 1.06, 'out'], [.6, .98], [.72, 1, 'soft']], o: [[0, 0], [.05, 1]] });
  const show = (p, q) => on(q, p, 0, { o: [[0, 0], [.01, 1]] });
  const flash = (a, b) => [[0, 0], [a, 0], [a + .02, 1], [b, 0]];
  const shakeKeys = (n, amp, step = .05) => { const k = [[0, 0]]; for (let i = 1; i <= n; i++) k.push([i * step, i % 2 ? -amp : amp, 'lin']); k.push([(n + 1) * step, 0, 'out']); return k; };
  const at = (keys, t0) => keys.map(([t, v, e]) => [t + t0, v, e]);
  const tubes = (q, ds, w = 30) => { ds.forEach(d => q.path(d, { sw: w })); ds.forEach(d => q.path(d, { sw: w - 7, stroke: C.fill })); };
  const f1 = v => +v.toFixed(1), rad = d => d * Math.PI / 180;
  const STAR5 = (cx, cy, R, r) => { const a = []; for (let i = 0; i < 10; i++) { const t = -Math.PI / 2 + i * Math.PI / 5, d = i % 2 ? r : R; a.push([f1(cx + Math.cos(t) * d), f1(cy + Math.sin(t) * d)]); } return a; };
  const DROP = (x, y, r) => `M ${x} ${y - r * 1.6} C ${x + r * .5} ${y - r * .8}, ${x + r} ${y - r * .2}, ${x + r} ${y + r * .3} A ${r} ${r} 0 0 1 ${x - r} ${y + r * .3} C ${x - r} ${y - r * .2}, ${x - r * .5} ${y - r * .8}, ${x} ${y - r * 1.6} Z`;
  let clipN = 0;
  const clip = (q, d) => { const NS = 'http://www.w3.org/2000/svg', id = 'gl14oldclip' + (++clipN), cp = document.createElementNS(NS, 'clipPath'), pt = document.createElementNS(NS, 'path');
    cp.setAttribute('id', id); pt.setAttribute('d', d); cp.appendChild(pt); q.g.appendChild(cp); return `url(#${id})`; };
  const slash = (q, x1, y1, x2, y2) => { q.line(x1, y1, x2, y2, { sw: 22, stroke: C.fill }); q.line(x1, y1, x2, y2, { sw: 6 }); };
  /* a soft puff of smoke / steam that drifts from (x,y) by (dx,dy), growing and fading — loops every T */
  const puff = (q, p, x, y, r, start, T, dx, dy) => { const g = sub(q); g.circle(x, y, r, { fill: C.fill, sw: 2.4, stroke: C.soft });
    on(g, p, start, { loop: T, ox: x, oy: y, x: [[0, 0], [T, dx, 'out']], y: [[0, 0], [T, dy, 'out']], s: [[0, .45], [T, 1.5, 'out']], o: [[0, 0], [.25, 1], [T * .6, .7], [T, 0]] }); };
  /* per-frame hooks (only globe uses one): run after the engine has set every transform for time t */
  const HOOK = []; { const base = window.setT; window.setT = t => { base(t); for (const h of HOOK) h(t); }; }
  const R = {}, rig = (name, dur, exit, fn) => { fn.custom = true; fn.dur = dur; fn.exit = exit; R[name] = fn; };

  /* party-popper — the cone squeezes, kicks back (recoil) and bursts: confetti and streamers fly out, tumble and drift down, fade */
  rig('party-popper-old', .6, 'pop', p => {
    const intro = sub(p); show(p, intro);
    const M = [-65, 65];                                   // mouth centre after the cone's rotation
    const fx = sub(intro);
    const piece = (tx, ty, draw, spin, dly = 0) => { const g = sub(fx); draw(g, tx, ty); const t = .3 + dly;
      on(g, p, .7, { loop: 2.6, ox: tx, oy: ty, x: [[0, M[0] - tx], [t, M[0] - tx], [t + .45, 0, 'out'], [2.6, 0]], y: [[0, M[1] - ty], [t, M[1] - ty], [t + .45, 0, 'out'], [2.2, 30, 'lin']],
        r: [[0, 0], [t, 0], [2.2, spin, 'out']], s: [[0, .3], [t, .3], [t + .3, 1, 'out']], o: [[0, 0], [t, 0], [t + .03, 1], [1.7, 1], [2.1, 0]] }); };
    const bit = (w, h, soft) => (g, x, y) => g.rect(x - w / 2, y - h / 2, w, h, { rx: 2, fill: soft ? C.fill : C.ink, sw: 2.2, stroke: soft ? C.soft : C.ink });
    const ball = soft => (g, x, y) => g.circle(x, y, 7, { fill: soft ? C.fill : C.ink, sw: 2.2, stroke: soft ? C.soft : C.ink });
    piece(28, -46, bit(22, 10), 220); piece(112, -14, bit(20, 9, 1), -180, .04); piece(70, -112, ball(), 0, .02); piece(150, -92, bit(18, 9), 260, .06);
    piece(-28, -128, bit(20, 9, 1), -200, .05); piece(150, 46, ball(1), 0, .03); piece(-112, -58, bit(18, 8), 160, .07); piece(96, -168, ball(1), 0, .08);
    [['M -46 44 C -20 6, -70 -30, -22 -62 S 34 -98, 54 -148', 0], ['M -38 52 C 4 40, 16 2, 58 12 S 118 -14, 168 -40', .05]].forEach(([d, dl]) => { const g = sub(fx), s = g.path(d, { sw: 3.2 });
      on(s, p, .7, { loop: 2.6, draw: [[0, 0], [.3 + dl, 0], [.75 + dl, 1, 'out'], [2.6, 1]] }); on(g, p, .7, { loop: 2.6, o: [[0, 0], [.3, 0], [.32, 1], [1.7, 1], [2.1, 0]] }); });
    const bang = sub(intro); [[-100, 30, 50], [-45, 32, 58], [10, 30, 50]].forEach(([a, r0, r1]) => { const u = rad(a - 45); bang.line(M[0] + Math.cos(u) * r0, M[1] + Math.sin(u) * r0, M[0] + Math.cos(u) * r1, M[1] + Math.sin(u) * r1, { sw: 3.2 }); });
    on(bang, p, .7, { loop: 2.6, o: flash(.3, .5), ox: M[0], oy: M[1], s: [[0, .7], [.3, .7], [.5, 1.2, 'out']] });
    const cO = sub(intro), cn = sub(cO), cg = cn.child({ transform: 'translate(-92 92) rotate(45)' });
    cg.path('M -66 -38 L -5 112 Q 0 122 5 112 L 66 -38 Z', { fill: C.fill, sw: 3.4 });
    cg.path('M -45 10 Q 0 26 45 10', { sw: 2.2, stroke: C.soft }); cg.path('M -26 58 Q 0 68 26 58', { sw: 2.2, stroke: C.soft });
    cg.ellipse(0, -38, 66, 20, { fill: C.fill, sw: 3.2 });
    on(cn, p, .7, { loop: 2.6, ox: -175, oy: 175, s: [[0, 1], [.12, 1], [.26, .93, 'io'], [.34, 1.05, 'out'], [.6, 1, 'soft']], x: [[0, 0], [.3, 0], [.36, -9, 'out'], [.7, 0, 'soft']], y: [[0, 0], [.3, 0], [.36, 9, 'out'], [.7, 0, 'soft']] });
    on(cO, p, 0, { ox: -175, oy: 175, x: [[0, -70], [.5, 0, 'out']], y: [[0, 70], [.5, 0, 'out']], r: [[0, -25], [.5, 4, 'out'], [.65, 0, 'soft']], o: [[0, 0], [.15, 1]] });
  });

  /* smile-plus — the plus squeezes then spins a quarter turn with a pop; the face bounces toward it and its smile widens */
  rig('smile-plus-old', .6, 'pop', p => {
    const intro = sub(p), fc = sub(intro), cx = -24, cy = 24;
    fc.circle(cx, cy, 146, { fill: C.fill, sw: 3.4 });
    const ey = sub(fc); [-1, 1].forEach(sd => ey.circle(cx + sd * 50, cy - 40, 13, { fill: C.ink, sw: 1.4 }));
    on(ey, p, .7, { loop: 2.6, ox: cx, oy: cy - 40, sy: [[0, 1], [1.5, 1], [1.56, .12, 'in'], [1.66, 1, 'out']] });
    const mo = sub(fc); mo.path(`M ${cx - 62} ${cy + 30} Q ${cx} ${cy + 98} ${cx + 62} ${cy + 30}`, { sw: 6 });
    on(mo, p, .7, { loop: 2.6, ox: cx, oy: cy + 30, sx: [[0, 1], [.55, 1], [.7, 1.16, 'out'], [1.9, 1.16], [2.3, 1, 'io']], sy: [[0, 1], [.55, 1], [.7, 1.3, 'out'], [1.9, 1.3], [2.3, 1, 'io']] });
    on(fc, p, .7, { loop: 2.6, ox: cx, oy: cy + 146, r: [[0, 0], [.55, 0], [.7, 5, 'out'], [1, -1.5], [1.25, 0, 'soft']], y: [[0, 0], [.55, 0], [.68, -10, 'out'], [.85, 0, 'in'], [.95, -3], [1.05, 0]] });
    const pO = sub(intro), pl = sub(pO); tubes(pl, ['M 128 -176 L 128 -80', 'M 80 -128 L 176 -128'], 28);
    on(pl, p, .7, { loop: 2.6, ox: 128, oy: -128, r: [[0, 0], [.25, -12, 'out'], [.65, 96, 'out'], [.8, 90, 'soft'], [2.6, 90]], s: [[0, 1], [.25, .82, 'out'], [.55, 1.16, 'out'], [.8, 1, 'soft']] });
    pop(p, intro); on(pO, p, .2, { ox: 128, oy: -128, s: [[0, 0], [.4, 1.15, 'out'], [.55, 1]], o: [[0, 0], [.1, 1]] });
  });

  /* bus — drives in and brakes (the body pitches forward on its springs), then cruises: wheels spin, road dashes stream past, it hits a bump */
  rig('bus-old', .7, 'slide', p => {
    const intro = sub(p); show(p, intro);
    const rd = sub(intro); rd.line(-196, 140, 196, 140, { sw: 4 });
    const ds = sub(rd, { 'clip-path': clip(rd, 'M -190 150 L 190 150 L 190 180 L -190 180 Z') }), dl = sub(ds);
    for (let x = -240; x <= 240; x += 80) dl.line(x, 164, x + 40, 164, { sw: 4, stroke: C.soft });
    on(dl, p, .7, { loop: .5, x: [[0, 0], [.5, -80, 'lin']] });
    const cO = sub(intro), bO = sub(cO), bd = sub(bO);
    bd.rect(-62, -108, 124, 18, { rx: 6, fill: C.fill, sw: 2.6 });
    bd.rect(-176, -92, 352, 196, { rx: 24, fill: C.fill, sw: 3.4 });
    for (let i = 0; i < 5; i++) bd.rect(-152 + i * 56, -66, 46, 60, { rx: 6, fill: C.fill, sw: 2.4, stroke: C.soft });
    bd.rect(128, -66, 34, 78, { rx: 6, fill: C.fill, sw: 2.6 });
    bd.line(-176, 26, 112, 26, { sw: 2, stroke: C.soft });
    bd.path('M 176 -54 L 188 -62 L 188 -30', { sw: 3 });
    bd.circle(162, 66, 7, { fill: C.ink, sw: 1.4 }); bd.line(-170, 52, -170, 76, { sw: 4, stroke: C.soft });
    [-108, 108].forEach(x => bd.path(`M ${x - 46} 104 A 46 46 0 0 1 ${x + 46} 104`, { sw: 2.2, stroke: C.soft }));
    on(bd, p, .7, { loop: 2.4, ox: 0, oy: 104, y: [[0, 0], [.25, -2, 'io'], [.5, 0, 'io'], [1.2, 0], [1.3, 4, 'out'], [1.45, -9, 'out'], [1.65, 1, 'in'], [1.8, 0, 'soft'], [2.15, -2, 'io'], [2.4, 0, 'io']],
      r: [[0, 0], [1.2, 0], [1.32, 1.2, 'out'], [1.55, -1, 'io'], [1.8, 0, 'soft']] });
    on(bO, p, 0, { ox: 108, oy: 108, r: [[0, 0], [.42, 0], [.55, 2.6, 'out'], [.72, -1, 'io'], [.9, 0, 'soft']] });
    [-108, 108].forEach(x => { const w = sub(cO); w.circle(x, 108, 32, { fill: C.fill, sw: 3.4 }); const hb = sub(w); hb.circle(x, 108, 12, { fill: C.fill, sw: 2.4, stroke: C.soft });
      hb.line(x - 22, 108, x + 22, 108, { sw: 2.4, stroke: C.soft }); hb.line(x, 86, x, 130, { sw: 2.4, stroke: C.soft });
      on(hb, p, 0, { ox: x, oy: 108, r: [[0, -400], [.55, 0, 'out']] }); on(w, p, .7, { loop: .6, ox: x, oy: 108, r: [[0, 0], [.6, 360, 'lin']] }); });
    on(cO, p, 0, { x: [[0, -330], [.55, 0, 'out']], o: [[0, 0], [.12, 1]] });
  });

  /* car — front view: it rolls toward us, rides over a bump (body squashes on its springs, tyres lag), the wiper sweeps, the headlights flash */
  rig('car-old', .6, 'pop', p => {
    const intro = sub(p), bd = sub(intro);
    [-1, 1].forEach(sd => { const t = sub(intro); t.rect(sd > 0 ? 108 : -156, 104, 48, 52, { rx: 10, fill: C.fill, sw: 3.2 });
      on(t, p, .7, { loop: 2.4, y: [[0, 0], [.5, 0], [.62, -8, 'out'], [.8, 0, 'in'], [.9, -2], [1, 0]] }); });
    bd.path('M -132 -6 L -102 -112 Q -96 -126 -80 -126 L 80 -126 Q 96 -126 102 -112 L 132 -6 Z', { fill: C.fill, sw: 3.4 });
    bd.path('M -110 -18 L -86 -102 Q -83 -110 -74 -110 L 74 -110 Q 83 -110 86 -102 L 110 -18 Z', { fill: C.fill, sw: 2.4, stroke: C.soft });
    const wp = sub(bd); wp.line(-14, -24, -88, -60, { sw: 3.2 });
    on(wp, p, .7, { loop: 2.4, ox: -14, oy: -24, r: [[0, 0], [1.3, 0], [1.6, 44, 'io'], [1.9, 0, 'io']] });
    [-1, 1].forEach(sd => bd.rect(sd > 0 ? 150 : -178, -40, 28, 20, { rx: 6, fill: C.fill, sw: 2.6 }));
    bd.rect(-172, -10, 344, 118, { rx: 30, fill: C.fill, sw: 3.4 });
    bd.rect(-62, 20, 124, 36, { rx: 10, fill: C.fill, sw: 2.4, stroke: C.soft }); bd.line(-48, 38, 48, 38, { sw: 2, stroke: C.soft });
    bd.rect(-40, 72, 80, 22, { rx: 5, fill: C.fill, sw: 2.2, stroke: C.soft });
    const bm = sub(bd);
    [-1, 1].forEach(sd => { bd.circle(sd * 118, 34, 21, { fill: C.fill, sw: 3.2 }); bd.circle(sd * 118, 34, 9, { fill: C.fill, sw: 2.2, stroke: C.soft });
      [-50, -20, 10, 40].forEach(a => { const u = rad(a + (sd > 0 ? 0 : 180)); bm.line(sd * 118 + Math.cos(u) * 30, 34 + Math.sin(u) * 30, sd * 118 + Math.cos(u) * 46, 34 + Math.sin(u) * 46, { sw: 3 }); }); });
    on(bm, p, .7, { loop: 2.4, o: [[0, 0], [1.95, 0], [1.97, 1], [2.07, .2], [2.12, 1], [2.3, 0]] });
    on(bd, p, .7, { loop: 2.4, ox: 0, oy: 104, y: [[0, 0], [.4, 0], [.5, 5, 'out'], [.66, -16, 'out'], [.86, 2, 'in'], [1, 0, 'soft']], sy: [[0, 1], [.4, 1], [.5, .95, 'out'], [.66, 1.03, 'out'], [.86, .97], [1, 1, 'soft']], r: [[0, 0], [.5, 0], [.66, -1.5], [.9, .8], [1.05, 0, 'soft']] });
    on(intro, p, 0, { ox: 0, oy: 130, s: [[0, .25], [.5, 1.05, 'out'], [.65, 1]], o: [[0, 0], [.16, 1]] });
  });

  /* church — rises from its base; in the tower the bell swings (its clapper lags behind) and rings out in waves on each side */
  rig('church-old', .8, 'squash', p => {
    const intro = sub(p); show(p, intro);
    const gl = intro.line(-192, 170, 192, 170, { sw: 4 }); on(gl, p, 0, { draw: [[0, 0], [.35, 1, 'out']] });
    const wO = sub(intro);
    [-1, 1].forEach(sd => { wO.shape([[sd * 52, -24], [sd * 172, 44], [sd * 172, 170], [sd * 52, 170]], { fill: C.fill, sw: 3.2 });
      const x = sd * 112; wO.path(`M ${x - 14} 136 L ${x - 14} 106 A 14 14 0 0 1 ${x + 14} 106 L ${x + 14} 136 Z`, { fill: C.fill, sw: 2.2, stroke: C.soft }); });
    grow(p, wO, .15, 170);
    const tO = sub(intro);
    tO.rect(-52, -100, 104, 270, { rx: 4, fill: C.fill, sw: 3.4 });
    tO.shape([[-64, -98], [0, -160], [64, -98]], { fill: C.fill, sw: 3.4 });
    tO.line(0, -160, 0, -194, { sw: 5 }); tO.line(-14, -180, 14, -180, { sw: 5 });
    tO.path('M -26 -30 L -26 -70 A 26 26 0 0 1 26 -70 L 26 -30 Z', { fill: C.fill, sw: 2.6 });
    tO.circle(0, 20, 18, { fill: C.fill, sw: 2.2, stroke: C.soft });
    tO.path('M -30 170 L -30 128 A 30 30 0 0 1 30 128 L 30 170', { fill: C.fill, sw: 3 }); tO.line(0, 100, 0, 170, { sw: 2, stroke: C.soft });
    const bc = sub(tO, { 'clip-path': clip(tO, 'M -24 -32 L -24 -70 A 24 24 0 0 1 24 -70 L 24 -32 Z') }), bell = sub(bc);
    const cl = sub(bell); cl.line(0, -60, 0, -42, { sw: 2.2, stroke: C.soft }); cl.circle(0, -40, 4, { fill: C.ink, sw: 1 });
    bell.path('M -3 -86 Q -13 -84 -13 -70 L -15 -52 Q -16 -47 -20 -45 L 20 -45 Q 16 -47 15 -52 L 13 -70 Q 13 -84 3 -86 Z', { fill: C.fill, sw: 2.6 });
    const sw = [[0, 0], [.35, 15, 'io'], [.85, -15, 'io'], [1.3, 10, 'io'], [1.7, -5, 'io'], [2, 0, 'soft'], [2.4, 0]];
    on(bell, p, .7, { loop: 2.4, ox: 0, oy: -84, r: sw });
    on(cl, p, .7, { loop: 2.4, ox: 0, oy: -60, r: [[0, 0], [.43, -12, 'io'], [.93, 12, 'io'], [1.38, -8, 'io'], [1.78, 4, 'io'], [2.08, 0, 'soft'], [2.4, 0]] });
    [[1, .35], [-1, .85], [1, 1.3]].forEach(([sd, t]) => { const wv = sub(intro);
      wv.path(`M ${sd * 62} -82 Q ${sd * 74} -60 ${sd * 62} -38`, { sw: 3 }); wv.path(`M ${sd * 80} -94 Q ${sd * 98} -60 ${sd * 80} -26`, { sw: 2.4, stroke: C.soft });
      on(wv, p, .7, { loop: 2.4, ox: sd * 52, oy: -60, o: [[0, 0], [t, 0], [t + .04, 1], [t + .4, 0]], s: [[0, .8], [t, .8], [t + .4, 1.2, 'out']] }); });
    grow(p, tO, 0, 170);
  });

  /* compass — the needle loses north: a little kick back, a full search spin, then it swings past north and settles in damped wobbles */
  rig('compass-old', .6, 'spin', p => {
    const intro = sub(p), bd = sub(intro), cy = 12;
    bd.rect(-12, -150, 24, 16, { rx: 4, fill: C.fill, sw: 2.6 }); bd.circle(0, -164, 14, { fill: C.fill, sw: 3 });
    bd.circle(0, cy, 150, { fill: C.fill, sw: 3.4 }); bd.circle(0, cy, 124, { fill: C.fill, sw: 2.2, stroke: C.soft });
    [[1, 0], [0, 1], [-1, 0]].forEach(([dx, dy]) => bd.line(dx * 124, cy + dy * 124, dx * 104, cy + dy * 104, { sw: 3, stroke: C.soft }));
    bd.shape([[0, cy - 118], [-11, cy - 98], [11, cy - 98]], { fill: C.ink, sw: 2 });
    const nd = sub(bd);
    nd.shape([[0, cy - 92], [18, cy], [-18, cy]], { fill: C.ink, sw: 2.6 }); nd.shape([[18, cy], [0, cy + 92], [-18, cy]], { fill: C.fill, sw: 2.6 });
    bd.circle(0, cy, 11, { fill: C.fill, sw: 2.6 }); bd.dot(0, cy, 3.5);
    on(nd, p, .7, { loop: 3.2, ox: 0, oy: cy, r: [[0, 0], [.25, -18, 'out'], [1.05, 400, 'io'], [1.3, 340, 'io'], [1.52, 376, 'io'], [1.72, 352, 'io'], [1.92, 364, 'io'], [2.12, 360, 'soft'], [3.2, 360]] });
    on(bd, p, .7, { loop: 3.2, ox: 0, oy: cy, r: [[0, 0], [.25, 4, 'out'], [.6, -3, 'io'], [1.05, 0, 'soft']] });
    on(intro, p, 0, { ox: 0, oy: cy, s: [[0, .3], [.5, 1.06, 'out'], [.65, 1]], r: [[0, -120], [.6, 0, 'out']], o: [[0, 0], [.15, 1]] });
  });

  /* flower — the stem draws up, leaves unfold, the head blooms petal by petal; then it sways in the breeze, the head lagging (follow-through) */
  rig('flower-old', .9, 'sink', p => {
    const intro = sub(p); show(p, intro);
    const gl = intro.line(-64, 172, 64, 172, { sw: 4 }); on(gl, p, 0, { draw: [[0, 0], [.25, 1, 'out']] });
    const pl = sub(intro), hy = -62;
    const st = pl.path(`M 0 172 C -10 100, 6 30, 0 ${hy + 20}`, { sw: 5 }); on(st, p, .05, { draw: [[0, 0], [.4, 1, 'out']] });
    [['M -2 148 C -30 116, -78 122, -100 102 C -84 146, -40 162, -2 148 Z', 'M -8 142 Q -50 126 -90 108', -2, 148, .3, 1],
     ['M 2 122 C 30 88, 78 96, 100 76 C 86 120, 44 138, 2 122 Z', 'M 8 116 Q 50 100 90 82', 2, 122, .38, -1]].forEach(([d, rib, ox, oy, t, sd]) => {
      const lO = sub(pl), lf = sub(lO); lf.path(d, { fill: C.fill, sw: 3 }); lf.path(rib, { sw: 1.8, stroke: C.soft });
      on(lf, p, .9, { loop: 3.6, ox, oy, r: [[0, 0], [.5, sd * 5, 'soft'], [1.4, -sd * 4, 'soft'], [2.3, sd * 3, 'soft'], [3.2, -sd * 1, 'soft'], [3.6, 0, 'soft']] });
      on(lO, p, t, { ox, oy, s: [[0, 0], [.35, 1.1, 'out'], [.5, 1]], r: [[0, sd * 40], [.4, 0, 'out']], o: [[0, 0], [.05, 1]] }); });
    const hO = sub(pl), hd = sub(hO);
    for (let i = 0; i < 6; i++) { const pw = sub(hd), pt = pw.child({ transform: `translate(0 ${hy}) rotate(${i * 60})` });
      pt.path('M 0 -22 C 30 -46, 34 -96, 0 -112 C -34 -96, -30 -46, 0 -22 Z', { fill: C.fill, sw: 3.2 }); pt.line(0, -36, 0, -92, { sw: 1.8, stroke: C.soft });
      on(pw, p, .45 + i * .05, { ox: 0, oy: hy, s: [[0, 0], [.3, 1.08, 'out'], [.45, 1]], o: [[0, 0], [.05, 1]] }); }
    hd.circle(0, hy, 30, { fill: C.fill, sw: 3.2 }); hd.circle(0, hy, 15, { fill: C.fill, sw: 2.2, stroke: C.soft });
    on(hd, p, .9, { loop: 3.6, ox: 0, oy: hy, r: [[0, 0], [.4, 0], [1.3, 7, 'soft'], [2.2, -6, 'soft'], [3.1, 2, 'soft'], [3.6, 0, 'soft']], s: [[0, 1], [.4, 1], [1.3, 1.03, 'soft'], [2.2, .99, 'soft'], [3.6, 1, 'soft']] });
    on(hO, p, .4, { o: [[0, 0], [.01, 1]] });
    on(pl, p, .9, { loop: 3.6, ox: 0, oy: 172, r: [[0, 0], [.9, 3, 'soft'], [1.8, -2.5, 'soft'], [2.7, 1.5, 'soft'], [3.6, 0, 'soft']] });
  });

  /* globe — a tilted sphere that really turns: the meridians sweep across the face (redrawn every frame); poles of the axis poke out */
  rig('globe-old', .6, 'spin', p => {
    const eO = sub(p), intro = sub(eO), tl = intro.child({ transform: 'rotate(-20)' }), R0 = 150, T = 2.4, start = p.t0 + .7 * p.ts;
    tl.line(0, -182, 0, -150, { sw: 4 }); tl.line(0, 150, 0, 182, { sw: 4 });
    tl.circle(0, 0, R0, { fill: C.fill, sw: 3.4 });
    tl.path('M -130 -75 Q 0 -51 130 -75', { sw: 2.2, stroke: C.soft }); tl.path('M -130 75 Q 0 99 130 75', { sw: 2.2, stroke: C.soft }); tl.path('M -150 0 Q 0 30 150 0', { sw: 2.6 });
    const mer = [0, 1, 2, 3].map(() => tl.path(`M 0 ${-R0} L 0 ${R0}`, { sw: 2.4 }));
    const set = u => mer.forEach((e, i) => { const lon = -90 + i * 45 + 45 * u / T, rx = Math.abs(Math.sin(rad(lon))) * R0;
      e.setAttribute('d', rx < .5 ? `M 0 ${-R0} L 0 ${R0}` : `M 0 ${-R0} A ${rx.toFixed(2)} ${R0} 0 0 ${lon > 0 ? 1 : 0} 0 ${R0}`);
      e.setAttribute('stroke', Math.abs(lon) > 70 ? C.soft : C.ink); });
    set(0); HOOK.push(t => set(t < start ? 0 : (t - start) % T));
    on(intro, p, .7, { loop: 2.4, ox: 0, oy: 0, y: [[0, 0], [1.2, -6, 'io'], [2.4, 0, 'io']] });
    on(eO, p, 0, { s: [[0, .3], [.5, 1.06, 'out'], [.65, 1]], r: [[0, -100], [.6, 0, 'out']], o: [[0, 0], [.15, 1]] });
  });

  /* hospital — the building rises; the cross on the roof beats like a heart, the sliding doors open and close */
  rig('hospital-old', .8, 'squash', p => {
    const intro = sub(p); show(p, intro);
    const gl = intro.line(-194, 170, 194, 170, { sw: 4 }); on(gl, p, 0, { draw: [[0, 0], [.35, 1, 'out']] });
    const bO = sub(intro);
    bO.line(-30, -80, -30, -60, { sw: 4 }); bO.line(30, -80, 30, -60, { sw: 4 });
    bO.rect(-160, -60, 320, 230, { rx: 10, fill: C.fill, sw: 3.4 }); bO.line(-160, -38, 160, -38, { sw: 2, stroke: C.soft });
    [-136, -84, 44, 96].forEach(x => [-20, 34].forEach(y => bO.rect(x, y, 40, 38, { rx: 4, fill: C.fill, sw: 2.2, stroke: C.soft })));
    bO.rect(-44, 104, 88, 66, { rx: 3, fill: C.fill, sw: 3 });
    const dc = sub(bO, { 'clip-path': clip(bO, 'M -42 106 L 42 106 L 42 168 L -42 168 Z') });
    [-1, 1].forEach(sd => { const d = sub(dc); d.rect(sd > 0 ? 0 : -42, 106, 42, 64, { fill: C.fill, sw: 2.2, stroke: C.soft }); d.line(sd * 8, 128, sd * 8, 146, { sw: 2.4, stroke: C.soft });
      on(d, p, .7, { loop: 3.2, x: [[0, 0], [1, 0], [1.35, sd * 38, 'out'], [2.3, sd * 38], [2.65, -sd * 2, 'io'], [2.75, 0, 'soft'], [3.2, 0]] }); });
    bO.path('M -66 100 L 66 100 L 56 86 L -56 86 Z', { fill: C.fill, sw: 2.8 });
    grow(p, bO, 0, 170);
    const sO = sub(intro), sg = sub(sO);
    sg.rect(-52, -182, 104, 102, { rx: 18, fill: C.fill, sw: 3.4 });
    tubes(sg, ['M 0 -160 L 0 -102', 'M -29 -131 L 29 -131'], 26);
    on(sg, p, .7, { loop: 1.6, ox: 0, oy: -131, s: [[0, 1], [.1, 1.12, 'out'], [.24, .98, 'io'], [.34, 1.07, 'out'], [.55, 1, 'soft'], [1.6, 1]] });
    on(sO, p, .4, { ox: 0, oy: -80, y: [[0, -60], [.4, 0, 'in'], [.48, 4], [.6, 0, 'soft']], sy: [[.4, .85], [.5, 1.06, 'out'], [.62, 1]], o: [[0, 0], [.1, 1]] });
  });

  /* house — drops onto the ground and squashes; smoke curls from the chimney, the front door swings open and shut */
  rig('house-old', .7, 'rise', p => {
    const intro = sub(p);
    intro.line(-196, 172, 196, 172, { sw: 4 });
    intro.rect(86, -126, 32, 70, { fill: C.fill, sw: 3.2 }); intro.rect(80, -138, 44, 14, { rx: 3, fill: C.fill, sw: 3 });
    intro.rect(-146, -40, 292, 212, { rx: 6, fill: C.fill, sw: 3.4 });
    intro.shape([[-190, -6], [0, -150], [190, -6]], { fill: C.fill, sw: 3.6 }); intro.path('M -150 -22 L 0 -128 L 150 -22', { sw: 2, stroke: C.soft });
    intro.circle(0, -60, 16, { fill: C.fill, sw: 2.4, stroke: C.soft });
    [-122, 62].forEach(x => { intro.rect(x, 20, 60, 56, { rx: 4, fill: C.fill, sw: 2.8 }); intro.line(x + 30, 20, x + 30, 76, { sw: 2, stroke: C.soft }); intro.line(x, 48, x + 60, 48, { sw: 2, stroke: C.soft }); });
    intro.rect(-34, 72, 68, 100, { rx: 4, fill: C.fill, sw: 2.4, stroke: C.soft });
    const dr = sub(intro); dr.rect(-34, 72, 68, 100, { rx: 4, fill: C.fill, sw: 3 }); dr.rect(-22, 86, 44, 30, { rx: 3, sw: 1.8, stroke: C.soft }); dr.dot(20, 128, 4.5);
    on(dr, p, .7, { loop: 3.2, ox: -34, oy: 0, sx: [[0, 1], [.9, 1], [1.0, 1.04, 'out'], [1.4, .2, 'io'], [2.2, .2], [2.55, 1.03, 'in'], [2.65, .98], [2.78, 1, 'soft']] });
    [0, .7, 1.4].forEach(d => puff(intro, p, 102, -150, 10, .7 + d, 2.1, 26, -30));
    thud(p, intro, 172);
  });

  /* map — the folded map opens panel by panel; a dotted route walks across it and a pin drops on the end with a ripple */
  rig('map-old', .8, 'pop', p => {
    const intro = sub(p); show(p, intro);
    const T = [[-180, -110], [-60, -150], [60, -110], [180, -150]], B = [[-180, 150], [-60, 110], [60, 150], [180, 110]];
    for (let i = 0; i < 3; i++) { const g = sub(intro); g.shape([T[i], T[i + 1], B[i + 1], B[i]], { fill: C.fill, sw: 3.2 });
      on(g, p, i * .12, { ox: T[i][0], oy: 0, sx: [[0, 0], [.32, 1.06, 'out'], [.45, 1]], o: [[0, 0], [.04, 1]] }); }
    const ly = sub(intro); on(ly, p, .4, { o: [[0, 0], [.2, 1]] });
    ly.path('M -176 30 C -130 10, -100 70, -62 50 C -20 30, 10 -30, 60 -14 C 100 0, 140 50, 176 20', { sw: 2.2, stroke: C.soft });
    ly.circle(-130, 96, 9, { fill: C.fill, sw: 3 });
    const P0 = [-130, 96], C1 = [-20, 124], C2 = [-30, -60], P3 = [100, -46], N = 12;
    const bz = (t, i) => (1 - t) ** 3 * P0[i] + 3 * (1 - t) ** 2 * t * C1[i] + 3 * (1 - t) * t * t * C2[i] + t ** 3 * P3[i];
    for (let k = 1; k < N; k++) { const t = k / N, d = ly.circle(f1(bz(t, 0)), f1(bz(t, 1)), 4.5, { fill: C.ink, sw: 1 }), a = .15 + k * .07;
      on(d, p, .8, { loop: 4, o: [[0, 0], [a, 0], [a + .04, 1], [3.3, 1], [3.6, 0]] }); }
    const pO = sub(ly), pS = sub(pO);
    pS.path('M 100 -46 C 82 -70, 70 -84, 70 -102 A 30 30 0 1 1 130 -102 C 130 -84, 118 -70, 100 -46 Z', { fill: C.fill, sw: 3.2 }); pS.circle(100, -103, 11, { fill: C.fill, sw: 2.6 });
    on(pS, p, .8, { loop: 4, ox: 100, oy: -46, sy: [[0, 1], [1.3, 1], [1.36, .8, 'out'], [1.5, 1.08], [1.64, 1, 'soft']], sx: [[0, 1], [1.3, 1], [1.36, 1.12, 'out'], [1.5, .96], [1.64, 1, 'soft']] });
    on(pO, p, .8, { loop: 4, y: [[0, -66], [1.02, -66], [1.3, 0, 'in'], [3.3, 0], [3.6, -24, 'in']], o: [[0, 0], [1.02, 0], [1.08, 1], [3.3, 1], [3.6, 0]] });
    const rp = sub(ly); rp.ellipse(100, -46, 26, 8, { sw: 2.4, stroke: C.soft });
    on(rp, p, .8, { loop: 4, ox: 100, oy: -46, s: [[0, .4], [1.3, .4], [1.75, 1.6, 'out']], o: [[0, 0], [1.3, 0], [1.33, 1], [1.75, 0]] });
  });

  /* mountain — the peaks rise in turn; a flag on the summit flutters and a cloud drifts behind the big peak, in front of the far one */
  rig('mountain-old', .8, 'sink', p => {
    const intro = sub(p); show(p, intro);
    const gl = intro.line(-196, 170, 196, 170, { sw: 4 }); on(gl, p, 0, { draw: [[0, 0], [.35, 1, 'out']] });
    const bk = sub(intro); bk.shape([[10, 170], [112, -26], [194, 170]], { fill: C.fill, sw: 3.2 }); bk.poly([[81, 34], [98, 46], [112, 30], [128, 46], [143, 34]], { sw: 2.2, stroke: C.soft });
    grow(p, bk, .15, 170);
    const cd = sub(intro); cd.path('M 0 44 Q -4 24 16 22 Q 22 0 46 6 Q 62 -8 80 8 Q 100 8 98 28 Q 112 36 100 44 Z', { fill: C.fill, sw: 2.6, stroke: C.soft });
    on(cd, p, .9, { loop: 4.4, x: [[0, -40], [4.4, 90, 'lin']], o: [[0, 0], [.8, 1], [3.4, 1], [4.4, 0]] });
    const fr = sub(intro); fr.shape([[-190, 170], [-40, -110], [128, 170]], { fill: C.fill, sw: 3.4 });
    fr.poly([[-85, -26], [-62, -6], [-40, -30], [-16, -4], [10, -26]], { sw: 2.6, stroke: C.soft });
    grow(p, fr, 0, 170);
    const fO = sub(intro); fO.line(-40, -110, -40, -178, { sw: 4 });
    const fl = sub(fO); fl.shape([[-40, -178], [14, -162], [-40, -146]], { fill: C.fill, sw: 3 });
    on(fl, p, .8, { loop: .9, ox: -40, oy: -162, ky: [[0, 0], [.22, 9, 'io'], [.67, -9, 'io'], [.9, 0, 'io']], sx: [[0, 1], [.22, .9, 'io'], [.45, 1, 'io'], [.67, .92, 'io'], [.9, 1, 'io']] });
    on(fO, p, .5, { ox: -40, oy: -110, sy: [[0, 0], [.3, 1.1, 'out'], [.45, 1]], o: [[0, 0], [.05, 1]] });
  });

  /* navigation — the arrow pulls back, darts forward along its heading with speed lines, holds, then eases back */
  rig('navigation-old', .6, 'pop', p => {
    const intro = sub(p); show(p, intro);
    const rt = intro.child({ transform: 'translate(25 -25) rotate(45)' });
    const sl = sub(rt); [[-34, 150, 188], [0, 160, 200], [34, 150, 188]].forEach(([x, a, b]) => sl.line(x, a, x, b, { sw: 3.2 }));
    on(sl, p, .7, { loop: 2.4, y: [[0, -10], [.45, -10], [.6, 0, 'out'], [.9, 14]], o: [[0, 0], [.45, 0], [.5, 1], [.9, 0]] });
    const eO = sub(rt), ar = sub(eO);
    ar.shape([[0, -150], [100, 120], [0, 60], [-100, 120]], { fill: C.fill, sw: 3.4 });
    ar.shape([[0, -150], [0, 60], [-100, 120]], { fill: C.rule, sw: 3 });
    on(ar, p, .7, { loop: 2.4, ox: 0, oy: 0, y: [[0, 0], [.3, 16, 'io'], [.52, -30, 'out'], [.7, -24, 'soft'], [1.4, -24], [2, 0, 'io']], sx: [[0, 1], [.3, 1.08, 'io'], [.52, .9, 'out'], [.72, 1, 'soft']], r: [[0, 0], [.7, 0], [.85, 3, 'io'], [1.05, -2, 'io'], [1.25, 0, 'soft']] });
    on(eO, p, 0, { y: [[0, 240], [.5, 0, 'out'], [.6, 6], [.7, 0, 'soft']], o: [[0, 0], [.15, 1]] });
  });

  /* plane — flies in along its heading; cruises with a gentle bank (wings foreshorten), contrails stream from the engines */
  rig('plane-old', .6, { kind: 'slide', x: [[0, 0], [.14, -12, 'out'], [.5, 300, 'in']], y: [[0, 0], [.14, 12, 'out'], [.5, -300, 'in']] }, p => {
    const intro = sub(p); show(p, intro);
    const rt = intro.child({ transform: 'translate(10 -10) rotate(45)' });
    const ct = sub(rt); on(ct, p, .45, { o: [[0, 0], [.3, 1]] });
    [-62, 62].forEach(x => [0, 1, 2].forEach(j => { const s = ct.line(x, 58 + j * 46, x, 84 + j * 46, { sw: 3.4, stroke: C.soft });
      on(s, p, .7, { loop: .45, y: [[0, 0], [.45, 46, 'lin']], o: j === 0 ? [[0, 0], [.45, 1, 'lin']] : j === 2 ? [[0, 1], [.45, 0, 'lin']] : [[0, 1], [.45, 1]] }); }));
    const eO = sub(rt), pl = sub(eO);
    [-1, 1].forEach(sd => { pl.shape([[sd * 18, -30], [sd * 138, 36], [sd * 138, 58], [sd * 18, 22]], { fill: C.fill, sw: 3.2 });
      pl.shape([[sd * 16, 92], [sd * 60, 124], [sd * 60, 136], [sd * 14, 120]], { fill: C.fill, sw: 3 });
      pl.rect(sd * 62 - 9, 0, 18, 36, { rx: 7, fill: C.fill, sw: 2.6 }); pl.line(sd * 30, -10, sd * 120, 40, { sw: 1.8, stroke: C.soft }); });
    pl.path('M 0 -150 C 14 -150, 20 -128, 20 -100 L 20 110 Q 20 132 0 140 Q -20 132 -20 110 L -20 -100 C -20 -128, -14 -150, 0 -150 Z', { fill: C.fill, sw: 3.4 });
    pl.path('M -11 -114 Q 0 -126 11 -114', { sw: 2.6, stroke: C.soft });
    on(pl, p, .7, { loop: 3.2, ox: 0, oy: 0, sx: [[0, 1], [.8, .86, 'io'], [1.6, 1, 'io'], [2.4, .9, 'io'], [3.2, 1, 'io']], r: [[0, 0], [.8, -4, 'io'], [1.6, 0, 'io'], [2.4, 3, 'io'], [3.2, 0, 'io']], y: [[0, 0], [1.6, -10, 'io'], [3.2, 0, 'io']] });
    on(eO, p, 0, { y: [[0, 280], [.55, 0, 'out']], o: [[0, 0], [.15, 1]] });
  });

  /* ship — sails in and settles; rocks on the swell while the waves roll past in front of the hull, smoke trails from the funnel */
  rig('ship-old', .7, 'slide', p => {
    const intro = sub(p); show(p, intro);
    [0, .7, 1.4].forEach(d => puff(intro, p, 93, -126, 11, .7 + d, 2.1, -50, -50));
    const sO = sub(intro), sh = sub(sO);
    sh.path('M 72 -24 L 78 -112 L 108 -112 L 114 -24 Z', { fill: C.fill, sw: 3.2 }); sh.line(77, -94, 109, -94, { sw: 2.2, stroke: C.soft });
    sh.rect(-80, -84, 110, 58, { rx: 8, fill: C.fill, sw: 3.2 }); sh.rect(-66, -70, 82, 20, { rx: 4, fill: C.fill, sw: 2.2, stroke: C.soft });
    sh.rect(-114, -30, 176, 62, { rx: 8, fill: C.fill, sw: 3.2 });
    [-96, -54, -12, 30].forEach(x => sh.rect(x, -14, 26, 18, { rx: 4, sw: 2, stroke: C.soft }));
    sh.path('M -178 30 L 178 30 L 144 112 Q 140 120 130 120 L -124 120 Q -134 120 -140 112 Z', { fill: C.fill, sw: 3.4 });
    sh.line(-170, 50, 170, 50, { sw: 2.2, stroke: C.soft });
    [-90, -30, 30, 90].forEach(x => sh.circle(x, 78, 8, { fill: C.fill, sw: 2.2, stroke: C.soft }));
    on(sh, p, .7, { loop: 3.2, ox: 0, oy: 100, r: [[0, 0], [.8, 3, 'io'], [1.6, 0, 'io'], [2.4, -3, 'io'], [3.2, 0, 'io']], y: [[0, 0], [.8, -5, 'io'], [1.6, 0, 'io'], [2.4, -5, 'io'], [3.2, 0, 'io']] });
    on(sO, p, 0, { ox: 0, oy: 100, x: [[0, -320], [.6, 0, 'out']], r: [[0, 0], [.45, 0], [.6, -4, 'out'], [.8, 1.5, 'io'], [.95, 0, 'soft']], o: [[0, 0], [.12, 1]] });
    const wc = sub(intro, { 'clip-path': clip(intro, 'M -196 70 L 196 70 L 196 176 L -196 176 Z') });
    const wave = (y, a) => { let d = `M -280 ${y}`; for (let x = -280; x < 280; x += 80) d += ` Q ${x + 20} ${y - a} ${x + 40} ${y} Q ${x + 60} ${y + a} ${x + 80} ${y}`; return d; };
    const w1 = sub(wc); w1.path(wave(110, 9) + ' L 280 128 L -280 128 Z', { fill: C.fill, stroke: 'none' }); w1.path(wave(110, 9), { sw: 3.2 }); on(w1, p, .7, { loop: 1.6, x: [[0, 0], [1.6, -80, 'lin']] });
    const w2 = sub(wc); w2.path(wave(150, 7), { sw: 2.4, stroke: C.soft }); on(w2, p, .7, { loop: 2.4, x: [[0, 0], [2.4, 80, 'lin']] });
  });

  /* sprout — grows from the soil; a water drop falls on the left leaf, the leaf dips and springs back, droplets splash */
  rig('sprout-old', .8, 'sink', p => {
    const intro = sub(p); show(p, intro);
    intro.line(-190, 170, 190, 170, { sw: 4 });
    const so = sub(intro); so.path('M -150 170 Q -120 128 0 126 Q 120 128 150 170 Z', { fill: C.fill, sw: 3.2 }); so.line(-60, 150, -36, 150, { sw: 2.2, stroke: C.soft }); so.line(48, 156, 76, 156, { sw: 2.2, stroke: C.soft });
    on(so, p, 0, { ox: 0, oy: 170, sy: [[0, 0], [.3, 1, 'out']], o: [[0, 0], [.05, 1]] });
    const pl = sub(intro);
    const st = pl.path('M 0 130 C 0 80, -6 40, 0 -20', { sw: 5 }); on(st, p, .2, { draw: [[0, 0], [.35, 1, 'out']] });
    const lO = sub(pl), lf = sub(lO);
    lf.path('M -2 10 C -40 -10, -100 -20, -132 -72 C -80 -86, -30 -60, -2 10 Z', { fill: C.fill, sw: 3.2 }); lf.path('M -8 2 Q -60 -30 -118 -68', { sw: 1.8, stroke: C.soft });
    on(lf, p, .8, { loop: 2.6, ox: -2, oy: 10, r: [[0, 0], [.6, 0], [.68, -13, 'out'], [.86, 6, 'io'], [1.02, -3, 'io'], [1.18, 0, 'soft']] });
    on(lO, p, .4, { ox: -2, oy: 10, s: [[0, 0], [.35, 1.1, 'out'], [.5, 1]], r: [[0, 50], [.4, 0, 'out']], o: [[0, 0], [.05, 1]] });
    const rO = sub(pl), rf = sub(rO);
    rf.path('M 0 -20 C 10 -80, 70 -130, 142 -142 C 140 -80, 90 -30, 0 -20 Z', { fill: C.fill, sw: 3.2 }); rf.path('M 6 -28 Q 70 -70 130 -132', { sw: 1.8, stroke: C.soft });
    on(rf, p, .8, { loop: 2.6, ox: 0, oy: -20, r: [[0, 0], [.7, 0], [.82, 3, 'out'], [1, -2, 'io'], [1.2, 0, 'soft']] });
    on(rO, p, .5, { ox: 0, oy: -20, s: [[0, 0], [.35, 1.1, 'out'], [.5, 1]], r: [[0, -50], [.4, 0, 'out']], o: [[0, 0], [.05, 1]] });
    on(pl, p, .8, { loop: 2.6, ox: 0, oy: 130, r: [[0, 0], [.6, 0], [.75, -1.5, 'out'], [1.4, 1, 'soft'], [2.6, 0, 'soft']] });
    const dp = sub(intro); dp.path(DROP(-98, -86, 8), { fill: C.fill, sw: 2.6 });
    on(dp, p, .8, { loop: 2.6, ox: -98, oy: -76, y: [[0, -96], [.12, -96], [.6, 0, 'in']], sy: [[0, 1.15], [.6, 1.15], [.64, .6, 'out']], o: [[0, 0], [.12, 0], [.2, 1], [.6, 1], [.66, 0]] });
    const sp = sub(intro); [[-118, -92, -130, -104], [-98, -98, -98, -114], [-78, -92, -66, -104]].forEach(([a, b, c, d]) => sp.line(a, b, c, d, { sw: 2.6 }));
    on(sp, p, .8, { loop: 2.6, ox: -98, oy: -84, o: flash(.6, .85), s: [[0, .6], [.6, .6], [.85, 1.25, 'out']] });
  });

  /* tent — pops up and settles; a gust: the door flap lifts and flutters back, the flag on the pole keeps waving */
  rig('tent-old', .7, 'squash', p => {
    const intro = sub(p); show(p, intro);
    const gl = intro.line(-198, 164, 198, 164, { sw: 4 }); on(gl, p, 0, { draw: [[0, 0], [.35, 1, 'out']] });
    const tO = sub(intro), tn = sub(tO);
    [-1, 1].forEach(sd => { tn.line(sd * 107, 50, sd * 190, 164, { sw: 2, stroke: C.soft }); tn.line(sd * 190, 164, sd * 196, 150, { sw: 3 }); });
    tn.line(0, -128, 0, -162, { sw: 4 });
    tn.shape([[-176, 164], [0, -128], [176, 164]], { fill: C.fill, sw: 3.4 });
    tn.line(0, -128, 0, 30, { sw: 2, stroke: C.soft });
    tn.shape([[-64, 164], [0, 30], [64, 164]], { fill: C.fill, sw: 3 }); tn.line(0, 60, 0, 164, { sw: 1.8, stroke: C.soft });
    const fp = sub(tn); fp.shape([[0, 30], [64, 164], [112, 164]], { fill: C.fill, sw: 3 }); fp.line(78, 132, 92, 122, { sw: 2.2, stroke: C.soft });
    on(fp, p, .7, { loop: 2.6, ox: 0, oy: 30, r: [[0, 0], [.4, 0], [.55, -2, 'io'], [.75, 7, 'out'], [.95, -2, 'io'], [1.15, 3, 'io'], [1.4, 0, 'soft']], sx: [[0, 1], [.55, 1], [.75, .92, 'out'], [1.4, 1, 'soft']] });
    on(tn, p, .7, { loop: 2.6, ox: 0, oy: 164, sx: [[0, 1], [.55, 1], [.75, 1.02, 'out'], [1.1, .995], [1.4, 1, 'soft']] });
    const fg = sub(tn); fg.shape([[0, -162], [46, -150], [0, -136]], { fill: C.fill, sw: 3 });
    on(fg, p, .7, { loop: .9, ox: 0, oy: -149, ky: [[0, 0], [.22, 10, 'io'], [.67, -10, 'io'], [.9, 0, 'io']], sx: [[0, 1], [.22, .88, 'io'], [.45, 1, 'io'], [.67, .9, 'io'], [.9, 1, 'io']] });
    on(tO, p, 0, { ox: 0, oy: 164, sy: [[0, 0], [.4, 1.1, 'out'], [.55, .96, 'io'], [.7, 1, 'soft']], sx: [[0, 1.2], [.4, .95, 'out'], [.55, 1.02], [.7, 1, 'soft']], o: [[0, 0], [.05, 1]] });
  });

  /* train-front — rushes toward us; it chugs on the rails, the sleepers stream under it, the headlights flash */
  rig('train-front-old', .6, 'pop', p => {
    const intro = sub(p);
    intro.line(-70, 118, -170, 182, { sw: 3.4 }); intro.line(70, 118, 170, 182, { sw: 3.4 });
    [0, 1, 2].forEach(i => { const tie = intro.line(-120, 150, 120, 150, { sw: 4, stroke: C.soft });
      on(tie, p, .7 + i * .3, { loop: .9, ox: 0, oy: 150, y: [[0, -28], [.9, 30, 'lin']], sx: [[0, .63], [.9, 1.39, 'lin']], o: [[0, 0], [.15, 1], [.7, 1], [.9, 0]] }); });
    const bd = sub(intro);
    bd.rect(-124, -176, 248, 286, { rx: 56, fill: C.fill, sw: 3.4 });
    bd.rect(-44, -168, 88, 14, { rx: 5, sw: 2.2, stroke: C.soft });
    bd.rect(-96, -144, 192, 104, { rx: 22, fill: C.fill, sw: 3 }); bd.path('M -78 -60 L -78 -112 Q -78 -126 -64 -126', { sw: 2, stroke: C.soft });
    bd.line(-124, -8, 124, -8, { sw: 2.2, stroke: C.soft });
    const bm = sub(bd);
    [-1, 1].forEach(sd => { bd.circle(sd * 72, 40, 19, { fill: C.fill, sw: 3.2 }); bd.circle(sd * 72, 40, 8, { fill: C.fill, sw: 2.2, stroke: C.soft });
      [-40, 0, 40].forEach(a => { const u = rad(a + (sd > 0 ? 0 : 180)); bm.line(sd * 72 + Math.cos(u) * 27, 40 + Math.sin(u) * 27, sd * 72 + Math.cos(u) * 42, 40 + Math.sin(u) * 42, { sw: 3 }); }); });
    on(bm, p, .7, { loop: 2.7, o: [[0, 0], [1.2, 0], [1.22, 1], [1.32, .2], [1.37, 1], [1.6, 0]] });
    bd.rect(-100, 90, 200, 26, { rx: 10, fill: C.fill, sw: 3 }); bd.rect(-18, 96, 36, 14, { rx: 4, sw: 2, stroke: C.soft });
    on(bd, p, .7, { loop: .45, ox: 0, oy: 116, y: [[0, 0], [.22, -3, 'io'], [.45, 0, 'io']], sy: [[0, 1], [.22, 1.008, 'io'], [.45, 1, 'io']] });
    on(intro, p, 0, { ox: 0, oy: 150, s: [[0, .2], [.5, 1.06, 'out'], [.65, 1]], o: [[0, 0], [.16, 1]] });
  });

  /* trees — a round tree and a pine grow up; they sway in the wind out of step, the crowns lag behind the trunks, a leaf drifts down */
  rig('trees-old', .8, 'sink', p => {
    const intro = sub(p); show(p, intro);
    const gl = intro.line(-196, 170, 196, 170, { sw: 4 }); on(gl, p, 0, { draw: [[0, 0], [.35, 1, 'out']] });
    const pO = sub(intro), pn = sub(pO);
    pn.rect(79, 120, 22, 50, { rx: 3, fill: C.fill, sw: 3 });
    const tiers = [[[-6, 124], [90, -8], [186, 124]], [[10, 40], [90, -90], [170, 40]], [[32, -44], [90, -168], [148, -44]]];
    let par = pn; tiers.forEach((t, i) => { const g = sub(par); g.shape(t, { fill: C.fill, sw: 3.2 }); if (i < 2) g.path(`M ${t[1][0] - 34} ${t[0][1] - 26} Q ${t[1][0]} ${t[0][1] - 14} ${t[1][0] + 34} ${t[0][1] - 26}`, { sw: 1.8, stroke: C.soft });
      if (i) on(g, p, .8, { loop: 3.6, ox: 90, oy: t[0][1] + 10, r: [[0, 0], [.3, 0], [1.2, 1.6, 'soft'], [2.1, -1.4, 'soft'], [3, .6, 'soft'], [3.6, 0, 'soft']] }); par = g; });
    on(pn, p, .8, { loop: 3.6, ox: 90, oy: 170, r: [[0, 0], [.9, 2.2, 'soft'], [1.8, -1.8, 'soft'], [2.7, 1, 'soft'], [3.6, 0, 'soft']] });
    grow(p, pO, .15, 170, 90);
    const rO = sub(intro), rt = sub(rO), cx = -74, cy = -52;
    rt.path('M -86 170 L -82 20 L -66 20 L -62 170', { fill: C.fill, sw: 3.2 });
    const cr = sub(rt); let d = '', n = 8;
    for (let i = 0; i <= n; i++) { const a = rad(-90 + i * 360 / n), x = f1(cx + Math.cos(a) * 84), y = f1(cy + Math.sin(a) * 84); d += i ? ` A 38 38 0 0 1 ${x} ${y}` : `M ${x} ${y}`; }
    cr.path(d + ' Z', { fill: C.fill, sw: 3.4 });
    cr.path('M -74 20 L -74 -30 M -74 -6 L -110 -44 M -74 -20 L -42 -58', { sw: 2.2, stroke: C.soft });
    on(cr, p, .8, { loop: 3.2, ox: -74, oy: 20, r: [[0, 0], [.3, 0], [1, -3, 'soft'], [1.9, 2.5, 'soft'], [2.7, -1, 'soft'], [3.2, 0, 'soft']] });
    on(rt, p, .8, { loop: 3.2, ox: -74, oy: 170, r: [[0, 0], [.8, -1.6, 'soft'], [1.7, 1.4, 'soft'], [2.5, -.6, 'soft'], [3.2, 0, 'soft']] });
    grow(p, rO, 0, 170, -74);
    const lf = sub(intro); lf.path('M -20 40 Q -8 30 4 40 Q -8 50 -20 40 Z', { fill: C.fill, sw: 2.4 });
    on(lf, p, 1.1, { loop: 3.2, ox: -8, oy: 40, x: [[0, 0], [.8, -30, 'io'], [1.6, 10, 'io'], [2.4, -40, 'io']], y: [[0, 0], [2.4, 120, 'lin']], r: [[0, 0], [.8, -40, 'io'], [1.6, 30, 'io'], [2.4, -50, 'io']], o: [[0, 0], [.2, 1], [2, 1], [2.4, 0]] });
  });

  /* star-off — the struck-out star tries to light up (squeezes, swells, brightens) but fizzles: a shake and it dims again; the slash never lifts */
  rig('star-off-old', .6, 'pop', p => {
    const intro = sub(p), st = sub(intro);
    st.shape(STAR5(0, 14, 152, 64), { fill: C.fill, sw: 3.4 }); st.shape(STAR5(0, 14, 116, 48), { sw: 2, stroke: C.soft });
    on(st, p, .7, { loop: 2.8, ox: 0, oy: 14, s: [[0, 1], [.35, .9, 'io'], [.62, 1.1, 'out'], [.82, 1.08], [1.15, .97, 'in'], [1.35, 1, 'soft']], r: [[0, 0], ...at(shakeKeys(5, 5), .85)], o: [[0, .55], [.35, .55], [.6, 1], [.85, 1], [1.25, .55]] });
    const sl = sub(intro); slash(sl, -160, -150, 160, 150);
    on(sl, p, .7, { loop: 2.8, ox: 0, oy: 0, s: [[0, 1], [.82, 1], [.92, 1.05, 'out'], [1.15, 1, 'soft']] });
    pop(p, intro);
  });

  Object.assign(G.icons, R);
})();
