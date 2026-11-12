/* pro5.js — pro icon batch 5 (CutPack priority-1 names, next 20; body-part icons skipped for now).
   Standard: main line 3 · dark see-through bodies · one glint + dot · only details that carry meaning;
   every rig has an entrance, a looping part animation, and an exit (fn.exit, see GL.EXIT). */
(function () {
  const G = window.GL, C = G.C, P = G.parts;
  const sub = (p, attrs) => p.child(attrs || {});
  const on = (q, p, start, spec) => G.kf(q.g || q, p.t0 + start * p.ts, spec);
  const star4 = (p, x, y, r, o = {}) => p.path(`M ${x} ${y - r} Q ${x + r * .16} ${y - r * .16} ${x + r} ${y} Q ${x + r * .16} ${y + r * .16} ${x} ${y + r} Q ${x - r * .16} ${y + r * .16} ${x - r} ${y} Q ${x - r * .16} ${y - r * .16} ${x} ${y - r} Z`, Object.assign({ fill: C.ink, sw: 1.4 }, o));
  const pop = (p, q, at = 0, from = .4) => on(q, p, at, { s: [[0, from], [.42, 1.08, 'out'], [.62, 1]], o: [[0, 0], [.16, 1]] });
  const drop = (p, q, at = 0, dy = -90) => on(q, p, at, { y: [[0, dy], [.55, 0, 'back']], o: [[0, 0], [.2, 1]] });
  const twinkle = (p, q, x, y, at, loop = 2) => on(q, p, at, { loop, ox: x, oy: y, s: [[0, 0], [.3, 1.1, 'back'], [.8, 0, 'in']], r: [[0, 0], [.8, 90, 'lin']] });
  const tube = (p, d, w = 18) => { p.path(d, { sw: w }); p.path(d, { sw: w - 7, stroke: C.fill }); };
  const shakeKeys = (n, amp, step = .05) => { const k = [[0, 0]]; for (let i = 1; i <= n; i++) k.push([i * step, i % 2 ? -amp : amp, 'lin']); k.push([(n + 1) * step, 0, 'out']); return k; };
  const HEART = 'M 0 70 C -96 8, -86 -72, -38 -72 C -14 -72, 0 -54, 0 -38 C 0 -54, 14 -72, 38 -72 C 86 -72, 96 8, 0 70 Z';
  const BUBBLE = 'M 0 -132 C 86 -132, 146 -76, 146 -6 C 146 64, 86 120, 0 120 C -20 120, -40 117, -58 111 L -128 140 L -108 80 C -132 58, -146 28, -146 -6 C -146 -76, -86 -132, 0 -132 Z';
  const BULB = 'M -34 62 C -34 30, -78 8, -78 -40 A 78 78 0 1 1 78 -40 C 78 8, 34 30, 34 62 Z';
  const R = {}, rig = (name, dur, exit, fn) => { fn.custom = true; fn.dur = dur; fn.exit = exit; R[name] = fn; };

  /* heart-crack — the heart splits along its crack, halves tilt apart, then knit back */
  rig('heart-crack-pro', .6, 'pop', p => {
    const intro = sub(p), zig = 'L 8 90 L -12 50 L 12 10 L -14 -30 Z';
    const L = sub(intro), Rr = sub(intro);
    L.path(`M 0 -72 C 0 -103, -27 -137, -72 -137 C -163 -137, -182 15, 0 133 ${zig}`, { fill: C.fill, sw: 3.2 });
    L.path('M -136 -40 Q -136 -104 -84 -118', { sw: 3 }); L.dot(-140, -16, 2.6);
    Rr.path(`M 0 -72 C 0 -103, 27 -137, 72 -137 C 163 -137, 182 15, 0 133 ${zig}`, { fill: C.fill, sw: 3.2 });
    const sh = sub(intro); sh.shape([[-6, 20], [8, 34], [-4, 44]], { fill: C.fill, sw: 2 }); sh.shape([[4, 64], [14, 76], [2, 80]], { fill: C.fill, sw: 2 });
    const open = (sd) => [[0, 0], [.3, 0], [.42, sd * 11, 'out'], [1.5, sd * 11], [1.8, 0, 'io'], [1.86, -sd * 1.5], [1.95, 0]];
    on(L, p, .7, { loop: 2.6, ox: 0, oy: 133, r: open(-1), x: [[0, 0], [.3, 0], [.42, -8, 'out'], [1.5, -8], [1.8, 0, 'io']] });
    on(Rr, p, .7, { loop: 2.6, ox: 0, oy: 133, r: open(1), x: [[0, 0], [.3, 0], [.42, 8, 'out'], [1.5, 8], [1.8, 0, 'io']] });
    on(sh, p, .7, { loop: 2.6, y: [[0, 0], [.32, 0], [1.2, 120, 'in']], o: [[0, 0], [.32, 0], [.34, 1], [1, 1], [1.2, 0]] });
    pop(p, intro);
  });

  /* heart-off — a slash cuts across, the heart dims and sinks a little; then it heals */
  rig('heart-off-pro', .6, 'pop', p => {
    const intro = sub(p), h = sub(intro), hh = h.child({ transform: 'scale(1.9)' }, 1.9);
    hh.path(HEART, { fill: C.fill, sw: 1.7 }); h.path('M -136 -40 Q -136 -104 -84 -118', { sw: 3 }); h.dot(-140, -16, 2.6);
    const gap = intro.line(-150, -150, 150, 150, { sw: 20, stroke: C.fill }), sl = intro.line(-150, -150, 150, 150, { sw: 6 });
    [gap, sl].forEach(e => on(e, p, .7, { loop: 2.6, draw: [[0, 0], [.1, 0], [.4, 1, 'out'], [2, 1], [2.3, 0, 'in']] }));
    on(h, p, .7, { loop: 2.6, s: [[0, 1], [.35, 1], [.5, .92, 'out'], [2, .92], [2.3, 1, 'back']], o: [[0, 1], [.35, 1], [.5, .55], [2, .55], [2.3, 1]] });
    pop(p, intro);
  });

  /* map-pin — drops onto its shadow, then hops and lands with a squash */
  rig('map-pin-pro', .7, 'rise', p => {
    const intro = sub(p), shd = sub(intro), pin = sub(intro);
    shd.ellipse(0, 168, 64, 13, { sw: 2, stroke: C.soft });
    pin.path('M 0 150 C -40 90, -112 24, -112 -48 A 112 112 0 0 1 112 -48 C 112 24, 40 90, 0 150 Z', { fill: C.fill, sw: 3.2 });
    pin.circle(0, -48, 42, { fill: C.fill, sw: 3 });
    pin.path('M -84 -64 Q -78 -112 -36 -132', { sw: 3 }); pin.dot(-90, -40, 2.6);
    on(pin, p, .7, { loop: 2.2, ox: 0, oy: 150, y: [[0, 0], [.1, 0], [.34, -46, 'out'], [.56, 0, 'in'], [.66, -8, 'out'], [.76, 0, 'in']],
      sy: [[0, 1], [.1, .9, 'out'], [.2, 1.05], [.56, 1], [.6, .9, 'out'], [.72, 1]], sx: [[0, 1], [.1, 1.06, 'out'], [.2, .97], [.56, 1], [.6, 1.06, 'out'], [.72, 1]] });
    on(shd, p, .7, { loop: 2.2, ox: 0, oy: 168, s: [[0, 1], [.1, 1], [.34, .7, 'out'], [.56, 1, 'in']], o: [[0, 1], [.34, .5], [.56, 1]] });
    on(pin, p, 0, { ox: 0, oy: 150, y: [[0, -180], [.4, 0, 'in']], sy: [[.4, .86], [.52, 1.05, 'out'], [.64, 1]], o: [[0, 0], [.1, 1]] });
    on(shd, p, 0, { ox: 0, oy: 168, s: [[0, .3], [.4, 1, 'in']], o: [[0, 0], [.2, 1]] });
  });

  /* lightbulb-off — the bulb tries to switch on, sputters, and the slash cuts it off again */
  rig('lightbulb-off-pro', .6, 'blink', p => {
    const intro = sub(p), b = intro.child({ transform: 'translate(0 -10) scale(1.3)' }, 1.3), glass = sub(b);
    glass.path(BULB, { fill: C.fill, sw: 2.6 }); glass.path('M -54 -54 Q -50 -84 -24 -96', { sw: 2.8 }); glass.dot(-58, -38, 2.2);
    glass.line(-14, 62, -14, 14, { sw: 1.8, stroke: C.soft }); glass.line(14, 62, 14, 14, { sw: 1.8, stroke: C.soft });
    glass.path('M -14 14 q 3.5 -14 7 0 q 3.5 -14 7 0 q 3.5 -14 7 0 q 3.5 -14 7 0', { sw: 2, stroke: C.soft });
    b.rect(-38, 62, 76, 14, { rx: 4, fill: C.fill, sw: 2.6 });
    [[-34, 76, 68], [-30, 89, 60]].forEach(([x, y, w]) => b.rect(x, y, w, 13, { rx: 6.5, fill: C.fill, sw: 2 }));
    b.path('M -14 102 Q 0 116 14 102', { sw: 2.6 });
    on(glass, p, .7, { loop: 2.6, o: [[0, .55], [.3, .55], [.33, 1, 'lin'], [.38, .5, 'lin'], [.42, 1, 'lin'], [.5, .45, 'lin'], [.62, .55]] });
    const gap = intro.line(-130, -170, 130, 150, { sw: 20, stroke: C.fill }), sl = intro.line(-130, -170, 130, 150, { sw: 6 });
    [gap, sl].forEach(e => on(e, p, .7, { loop: 2.6, draw: [[0, 1], [.2, 1], [.3, 0, 'in'], [.55, 0], [.75, 1, 'out']] }));
    pop(p, intro);
  });

  /* battery-low — the last cell blinks, the battery gives a weak shiver */
  rig('battery-low-pro', .6, 'pop', p => {
    const intro = sub(p), bt = sub(intro);
    bt.rect(-160, -76, 290, 152, { rx: 26, fill: C.fill, sw: 3.4 }); bt.rect(130, -32, 30, 64, { rx: 10, fill: C.fill, sw: 3 });
    bt.path('M -144 -26 Q -144 -60 -110 -60', { sw: 3 }); bt.dot(-144, -6, 2.4);
    const cell = sub(bt); cell.rect(-128, -44, 54, 88, { rx: 10, fill: C.ink, sw: 2 });
    on(cell, p, .7, { loop: 1.6, o: [[0, 1], [.5, 1], [.55, .15, 'lin'], [.9, .15], [.95, 1, 'lin']] });
    on(bt, p, .7, { loop: 3.2, r: shakeKeys(5, 2, .05) });
    pop(p, intro);
  });

  /* droplets — two drops wobble like jelly, a little drip falls from the big one */
  const DROP = (x, y, r) => `M ${x} ${y - r * 1.6} C ${x + r * .5} ${y - r * .8}, ${x + r} ${y - r * .2}, ${x + r} ${y + r * .3} A ${r} ${r} 0 0 1 ${x - r} ${y + r * .3} C ${x - r} ${y - r * .2}, ${x - r * .5} ${y - r * .8}, ${x} ${y - r * 1.6} Z`;
  rig('droplets-pro', .7, 'sink', p => {
    const intro = sub(p), big = sub(intro), sm = sub(intro), dr = sub(intro);
    big.path(DROP(-34, 20, 92), { fill: C.fill, sw: 3.2 }); big.path('M -100 34 Q -102 -8 -74 -44', { sw: 3 }); big.dot(-102, 58, 2.6);
    sm.path(DROP(108, -64, 42), { fill: C.fill, sw: 3 }); sm.path('M 82 -56 Q 82 -76 96 -92', { sw: 2.4 });
    dr.path(DROP(-34, 150, 14), { fill: C.fill, sw: 2.4 });
    const jelly = (q, oy, d) => on(q, p, .7 + d, { loop: 2, ox: 0, oy, sy: [[0, 1], [.25, .93, 'out'], [.5, 1.04], [.75, .98], [1, 1, 'soft']], sx: [[0, 1], [.25, 1.05, 'out'], [.5, .97], [.75, 1.01], [1, 1, 'soft']] });
    jelly(big, 140, 0); jelly(sm, -12, .4);
    on(dr, p, .7, { loop: 2, y: [[0, -20], [.2, -20], [.7, 50, 'in']], o: [[0, 0], [.2, 0], [.24, 1], [.6, 1], [.7, 0]], s: [[0, .4], [.3, 1]] });
    drop(p, intro, 0, -110);
  });

  /* utensils — fork and knife stand side by side and clink against each other */
  rig('utensils-pro', .7, 'sink', p => {
    const intro = sub(p);
    const fork = q => { P.capsule(q, 0, 40, 0, 184, 11, { sw: 3 }); P.capsule(q, 0, 4, 0, 44, 8, { sw: 2.6 });
      q.path('M -34 -70 L -34 -30 Q -34 4 0 8 Q 34 4 34 -30 L 34 -70', { fill: C.fill, sw: 3 }); [-25, -8, 8, 25].forEach(x => q.line(x, -160, x, -50, { sw: 4.5 })); };
    const knife = q => { P.capsule(q, 0, 18, 0, 184, 14, { sw: 3 });
      q.path('M -8 -176 C 32 -154, 34 -60, 24 18 L -18 18 Z', { fill: C.fill, sw: 3 }); q.path('M -12 -120 L -12 -40', { sw: 2.6 }); };
    const fo = sub(intro), fi = sub(fo), fc = fi.child({ transform: 'translate(-64 0) scale(.94)' }, .94); fork(fc);
    const ko = sub(intro), ki = sub(ko), kc = ki.child({ transform: 'translate(64 0) scale(.94)' }, .94); knife(kc);
    const sp = sub(intro); star4(sp, 0, -150, 18);
    on(fi, p, .7, { loop: 2.2, ox: -64, oy: 170, r: [[0, 0], [.25, 7, 'out'], [.32, 5.5], [.6, 0, 'soft']] });
    on(ki, p, .7, { loop: 2.2, ox: 64, oy: 170, r: [[0, 0], [.25, -7, 'out'], [.32, -5.5], [.6, 0, 'soft']] });
    twinkle(p, sp, 0, -150, .95, 2.2);
    on(fo, p, 0, { y: [[0, 140], [.5, 0, 'back']], o: [[0, 0], [.15, 1]] }); on(ko, p, .1, { y: [[0, 140], [.5, 0, 'back']], o: [[0, 0], [.15, 1]] });
  });

  /* award — rosette medal: flips like a coin to catch the light, ribbons sway */
  rig('award-pro', .7, 'rise', p => {
    const intro = sub(p), rib = sub(intro), md = sub(intro);
    const tail = (sd) => { const t = sub(rib); t.path(`M ${sd * 26} 20 L ${sd * 92} 170 L ${sd * 58} 156 L ${sd * 40} 190 L ${sd * -14} 54 Z`, { fill: C.fill, sw: 3 });
      on(t, p, .7, { loop: 2.6, ox: sd * 20, oy: 30, r: [[0, 0], [.65, sd * 4, 'soft'], [1.95, -sd * 3, 'soft'], [2.6, 0, 'soft']] }); };
    tail(-1); tail(1);
    const fl = sub(md);
    fl.circle(0, -40, 100, { fill: C.fill, sw: 3.4 }); fl.circle(0, -40, 74, { sw: 1.6, stroke: C.soft });
    star4(fl, 0, -40, 36, { fill: C.fill, sw: 3 }); fl.path('M -70 -80 Q -58 -112 -26 -126', { sw: 3 }); fl.dot(-80, -58, 2.4);
    on(fl, p, .7, { loop: 2.6, ox: 0, oy: -40, sx: [[0, 1], [1.4, 1], [1.7, -1, 'io'], [2, 1, 'io']] });
    const sp = sub(intro); star4(sp, 120, -140, 14); twinkle(p, sp, 120, -140, 1.2, 2.6);
    drop(p, intro, 0, -120);
  });

  /* message-circle-heart — the heart inside beats, small hearts float out of the bubble */
  rig('message-circle-heart-pro', .6, 'pop', p => {
    const intro = sub(p), bub = sub(intro);
    bub.path(BUBBLE, { fill: C.fill, sw: 3.2 }); bub.path('M -118 -40 C -104 -86, -60 -112, -10 -116', { sw: 3.4 }); bub.dot(-124, -16, 2.6);
    const hb = sub(bub), h = hb.child({ transform: 'translate(0 -6) scale(.95)' }, .95); h.path(HEART, { fill: C.ink, sw: 2 });
    on(hb, p, .7, { loop: 1.6, ox: 0, oy: -6, s: [[0, 1], [.1, 1.14, 'out'], [.22, .96], [.34, 1.06], [.5, 1]] });
    [[120, -130, .3, 0], [150, -60, .22, .8]].forEach(([x, y, s, d]) => { const f = sub(intro), ff = f.child({ transform: `translate(${x} ${y}) scale(${s})` }, s); ff.path(HEART, { fill: C.fill, sw: 2.4 });
      on(f, p, .9 + d, { loop: 1.6, y: [[0, 30], [1.4, -40, 'out']], o: [[0, 0], [.2, 1], [1.1, 1], [1.4, 0]] }); });
    on(bub, p, 0, { ox: 0, oy: 120, sx: [[0, .3], [.3, 1.12, 'out'], [.45, .96], [.6, 1]], sy: [[0, .3], [.3, .92, 'out'], [.45, 1.04], [.6, 1]] });
    on(intro, p, 0, { o: [[0, 0], [.12, 1]] });
  });

  /* arrow-down / arrow-up — the arrow nudges in its direction, speed lines trail behind */
  const arrowV = (sd) => p => {   // sd = 1 down, -1 up
    const intro = sub(p), ar = sub(intro);
    tube(ar, `M 0 ${-sd * 150} L 0 ${sd * 110}`, 36); tube(ar, `M -80 ${sd * 40} L 0 ${sd * 124} L 80 ${sd * 40}`, 36);
    ar.path(`M -10 ${-sd * 130} L -10 ${sd * 40}`, { sw: 2, stroke: C.fill }); ar.dot(-6, -sd * 140, 2.4);
    on(ar, p, .7, { loop: 1.4, y: [[0, 0], [.25, sd * 26, 'out'], [.6, 0, 'io']] });
    [[-50, 50], [50, 40], [0, 30]].forEach(([x, l], i) => { const s = sub(intro), y0 = -sd * 168; s.line(x, y0, x, y0 - sd * l * .7, { sw: 3, stroke: C.soft });
      on(s, p, .7, { loop: 1.4, y: [[0, sd * 20], [.3, -sd * 10, 'out']], o: [[0, 0], [.05 + i * .03, 1], [.45, 0]] }); });
    on(intro, p, 0, { y: [[0, -sd * 160], [.55, 0, 'back']], o: [[0, 0], [.15, 1]] });
  };
  rig('arrow-down-pro', .6, 'sink', arrowV(1));
  rig('arrow-up-pro', .6, 'rise', arrowV(-1));

  /* phone — the handset rings: it buzzes and sound waves pulse from the earpiece */
  rig('phone-pro', .6, 'pop', p => {
    const intro = sub(p), hs = sub(intro);
    const waves = sub(intro); [64, 104].forEach((r, i) => { const w = sub(waves); w.path(`M 40 ${-80 - r} A ${r} ${r} 0 0 1 ${40 + r} -80`, { sw: 3.4 - i * .8, stroke: i ? C.soft : C.ink });
      on(w, p, .7, { loop: 1.6, ox: 40, oy: -80, o: [[0, 0], [.1 + i * .1, 0], [.16 + i * .1, 1], [.7, 0]], s: [[0, .9], [.7, 1.08, 'out']] }); });
    hs.path('M -120 -150 Q -150 -150 -150 -110 C -150 40, -40 150, 110 150 Q 150 150 150 120 L 150 80 Q 150 60 130 54 L 76 40 Q 56 36 44 52 L 26 74 C -20 54, -54 20, -74 -26 L -52 -44 Q -36 -56 -40 -76 L -54 -130 Q -60 -150 -80 -150 Z', { fill: C.fill, sw: 3.2 });
    hs.path('M -128 -96 C -128 -40, -112 0, -84 40', { sw: 3 }); hs.dot(-128, -118, 2.4);
    on(hs, p, .7, { loop: 1.6, ox: 0, oy: 0, r: shakeKeys(7, 5, .045) });
    on(intro, p, 0, { s: [[0, .4], [.42, 1.08, 'out'], [.62, 1]], r: [[0, -30], [.5, 0, 'out']], o: [[0, 0], [.16, 1]] });
  });

  /* lock — the shackle lifts and clicks shut, the body bumps, a spark pops */
  rig('lock-pro', .7, 'pop', p => {
    const intro = sub(p), sk = sub(intro), bd = sub(intro);
    tube(sk, 'M -70 0 L -70 -86 A 70 70 0 0 1 70 -86 L 70 0', 24);
    bd.rect(-116, -20, 232, 176, { rx: 28, fill: C.fill, sw: 3.4 });
    bd.circle(0, 50, 17, { fill: C.ink, sw: 2 }); bd.line(0, 60, 0, 100, { sw: 10 });
    bd.path('M -96 20 Q -96 0 -76 0', { sw: 3 }); bd.dot(-96, 40, 2.4);
    on(sk, p, .7, { loop: 2.6, y: [[0, 0], [.2, -26, 'out'], [.9, -26], [1.02, 0, 'in']] });
    on(bd, p, .7, { loop: 2.6, ox: 0, oy: 156, sy: [[0, 1], [1.02, 1], [1.08, .95, 'out'], [1.22, 1]] });
    const sp = sub(intro); star4(sp, 110, -110, 16); twinkle(p, sp, 110, -110, 1.72, 2.6);
    drop(p, intro, 0, -100);
  });

  /* star — spins a fifth of a turn with a squash, twinkles around it */
  rig('star-pro', .6, 'spin', p => {
    const intro = sub(p), st = sub(intro), pts = [];
    for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 66 : 158; pts.push([+(Math.cos(a) * r).toFixed(1), +(Math.sin(a) * r + 10).toFixed(1)]); }
    st.shape(pts, { fill: C.fill, sw: 3.4 }); st.path('M -40 -26 L -6 -110', { sw: 3 }); st.dot(-48, -8, 2.4);
    on(st, p, .7, { loop: 2.4, ox: 0, oy: 10, r: [[0, 0], [1.4, 0], [1.9, 72, 'io']], s: [[0, 1], [1.4, 1], [1.55, .9, 'out'], [1.9, 1.06], [2.1, 1, 'soft']] });
    [[-150, -120, 14, 0], [150, -90, 10, .6], [130, 140, 12, 1.1]].forEach(([x, y, r, d]) => { const s = sub(intro); star4(s, x, y, r); twinkle(p, s, x, y, .8 + d, 2.4); });
    on(intro, p, 0, { s: [[0, 0], [.45, 1.1, 'out'], [.6, 1]], r: [[0, -90], [.5, 0, 'out']], o: [[0, 0], [.15, 1]] });
  });

  /* arrow-left-right — the two arrows swap: top one slides left, bottom one right, then back */
  rig('arrow-left-right-pro', .7, 'pop', p => {
    const intro = sub(p), a = sub(intro), b = sub(intro);
    tube(a, 'M 150 -64 L -130 -64', 30); tube(a, 'M -72 -124 L -138 -64 L -72 -4', 30); a.dot(140, -70, 2.4);
    tube(b, 'M -150 64 L 130 64', 30); tube(b, 'M 72 4 L 138 64 L 72 124', 30);
    on(a, p, .7, { loop: 2, x: [[0, 0], [.3, -24, 'out'], [.7, 0, 'io']] }); on(b, p, .7, { loop: 2, x: [[0, 0], [.15, 0], [.45, 24, 'out'], [.85, 0, 'io']] });
    on(a, p, 0, { x: [[0, 160], [.5, 0, 'back']], o: [[0, 0], [.15, 1]] }); on(b, p, .12, { x: [[0, -160], [.5, 0, 'back']], o: [[0, 0], [.15, 1]] });
  });

  /* link — two chain links tug apart and snap back together with a spark */
  rig('link-pro', .6, 'pop', p => {
    const intro = sub(p), g = intro.child({ transform: 'rotate(-45)' }), A = sub(g), B = sub(g);
    const ring = (q, x) => { q.rect(x - 96, -44, 192, 88, { rx: 44, sw: 22 }); q.rect(x - 96, -44, 192, 88, { rx: 44, sw: 15, stroke: C.fill }); };
    ring(A, -62); ring(B, 62); A.path('M -130 -30 Q -150 -16 -146 6', { sw: 2.4 });
    on(A, p, .7, { loop: 2.2, x: [[0, 0], [.3, -18, 'out'], [.6, 0, 'in'], [.66, 3], [.74, 0]] });
    on(B, p, .7, { loop: 2.2, x: [[0, 0], [.3, 18, 'out'], [.6, 0, 'in'], [.66, -3], [.74, 0]] });
    const sp = sub(intro); [[0, -1], [1, 0], [0, 1], [-1, 0]].forEach(([a, b]) => sp.line(a * 20, b * 20, a * 40, b * 40, { sw: 3 }));
    on(sp, p, .7, { loop: 2.2, s: [[0, .6], [.6, .6], [.8, 1.2, 'out']], o: [[0, 0], [.6, 0], [.62, 1], [.9, 0]] });
    pop(p, intro);
  });

  /* quote — the two marks bob in turn, as if someone is speaking */
  rig('quote-pro', .7, 'pop', p => {
    const intro = sub(p);
    const Q = 'M 0 0 Q 0 -96 92 -120 L 102 -94 Q 52 -78 46 -40 L 84 -40 Q 106 -40 106 -18 L 106 52 Q 106 74 84 74 L 22 74 Q 0 74 0 52 Z';
    [-150, 20].forEach((x, i) => { const o = sub(intro), q = sub(o), m = q.child({ transform: `translate(${x} 20)` });
      m.path(Q, { fill: C.fill, sw: 3.2 }); m.path('M 14 -24 Q 22 -76 66 -98', { sw: 2.6 });
      on(q, p, .7 + i * .3, { loop: 1.6, ox: x + 53, oy: 94, y: [[0, 0], [.18, -16, 'out'], [.4, 0, 'in']], r: [[0, 0], [.18, -4, 'out'], [.4, 0, 'in']] });
      pop(p, o, i * .12); });
  });

  /* send — paper plane flies in from the lower left, then glides with a dotted trail */
  rig('send-pro', .7, { kind: 'slide', x: [[0, 0], [.14, -16, 'out'], [.55, 340, 'in']], y: [[0, 0], [.14, 16, 'out'], [.55, -300, 'in']], dur: .55, o: [[0, 1], [.4, 1], [.55, 0]] }, p => {
    const intro = sub(p), pl = sub(intro);
    pl.shape([[-150, -6], [156, -140], [40, 156], [2, 40]], { fill: C.fill, sw: 3.2 }); pl.line(2, 40, 156, -140, { sw: 2.4 });
    pl.path('M -110 -12 L 90 -100', { sw: 2.6 }); pl.dot(-122, -6, 2.2);
    const tr = sub(intro); [0, 1, 2].forEach(i => tr.line(-140 - i * 34, 110 + i * 30, -122 - i * 34, 94 + i * 30, { sw: 3, stroke: C.soft }));
    on(tr, p, .7, { loop: 1.8, o: [[0, 0], [.2, 1], [1.2, 1], [1.6, 0]], x: [[0, 10], [1.6, -14]], y: [[0, -10], [1.6, 14]] });
    on(pl, p, .7, { loop: 1.8, ox: 0, oy: 0, x: [[0, 0], [.9, 8, 'soft'], [1.8, 0, 'soft']], y: [[0, 0], [.9, -10, 'soft'], [1.8, 0, 'soft']], r: [[0, 0], [.9, -3, 'soft'], [1.8, 0, 'soft']] });
    on(intro, p, 0, { x: [[0, -220], [.6, 0, 'out']], y: [[0, 200], [.6, 0, 'out']], o: [[0, 0], [.15, 1]] });
  });

  /* pen-line — the pen writes a line along the bottom, lifts, and the line clears */
  rig('pen-line-pro', .6, 'slide', p => {
    const intro = sub(p), ln = intro.line(-150, 150, 90, 150, { sw: 4 });
    const pen = sub(intro), pg = pen.child({ transform: 'translate(-10 55) rotate(40)' });
    pg.rect(-26, -170, 52, 230, { rx: 14, fill: C.fill, sw: 3.2 }); pg.line(-26, -120, 26, -120, { sw: 2.4 });
    pg.path('M -26 60 L 0 124 L 26 60 Z', { fill: C.fill, sw: 3 }); pg.dot(0, 112, 4);
    pg.path('M -12 -150 L -12 -130', { sw: 2.6 }); pg.path('M -12 -100 L -12 30', { sw: 2.6 });
    on(ln, p, .7, { loop: 2.6, draw: [[0, 0], [1.1, 1, 'io'], [2.2, 1], [2.4, 0, 'in']] });
    on(pen, p, .7, { loop: 2.6, x: [[0, -60], [1.1, 180, 'io'], [1.4, 180], [2.4, -60, 'io']], y: [[0, 0], [.3, -6], [.55, 4], [.8, -6], [1.1, 0], [1.3, -30, 'out'], [2.2, -30], [2.4, 0]] });
    pop(p, intro);
  });

  /* printer — a sheet feeds out of the slot, the status light blinks, then it resets */
  rig('printer-pro', .7, 'pop', p => {
    const intro = sub(p);
    intro.rect(-96, -160, 192, 120, { rx: 10, fill: C.fill, sw: 2.8 });
    const out = sub(intro); out.rect(-96, -20, 192, 112, { rx: 8, fill: C.fill, sw: 2.8 }); [10, 34, 58].forEach((y, i) => out.line(-64, y, i === 2 ? 10 : 64, y, { sw: 2.2, stroke: C.soft }));
    const bd = sub(intro); bd.path('M -150 -60 L 150 -60 Q 176 -60 176 -34 L 176 70 Q 176 96 150 96 L 116 96 L 116 60 L -116 60 L -116 96 L -150 96 Q -176 96 -176 70 L -176 -34 Q -176 -60 -150 -60 Z', { fill: C.fill, sw: 3.2 });
    bd.path('M -156 -10 Q -156 -40 -126 -40', { sw: 3 }); bd.dot(-156, 10, 2.4);
    const lt = sub(bd); lt.dot(130, -24, 8);
    on(out, p, .7, { loop: 2.8, y: [[0, 0], [.2, 0], [1.2, 78, 'io'], [2.3, 78], [2.31, 0, 'lin']], o: [[0, 1], [2.1, 1], [2.3, 0], [2.31, 0], [2.5, 1]] });
    on(bd, p, .7, { loop: 2.8, ox: 0, oy: 96, r: [[0, 0], [.2, 0], [.3, -.8, 'lin'], [.4, .8, 'lin'], [.5, -.8, 'lin'], [.6, .8, 'lin'], [.7, -.8, 'lin'], [.8, .8, 'lin'], [.9, -.8, 'lin'], [1, .8, 'lin'], [1.2, 0]] });
    on(lt, p, .7, { loop: .6, o: [[0, 1], [.3, 1], [.32, .2], [.6, .2]] });
    pop(p, intro);
  });

  Object.assign(G.icons, R);
  const ALIAS = { 'heart-crack': 'heart-crack-pro', 'heart-off': 'heart-off-pro', 'map-pin': 'map-pin-pro', 'lightbulb-off': 'lightbulb-off-pro', 'battery-low': 'battery-low-pro',
    droplets: 'droplets-pro', utensils: 'utensils-pro', award: 'award-pro', 'message-circle-heart': 'message-circle-heart-pro', 'arrow-down': 'arrow-down-pro', 'arrow-up': 'arrow-up-pro',
    phone: 'phone-pro', lock: 'lock-pro', star: 'star-pro', 'arrow-left-right': 'arrow-left-right-pro', link: 'link-pro', quote: 'quote-pro', send: 'send-pro', 'pen-line': 'pen-line-pro', printer: 'printer-pro' };
  for (const [a, pro] of Object.entries(ALIAS)) { if (G.icons[a] && !G.icons[a + '-basic'] && !G.icons[a].custom) G.icons[a + '-basic'] = G.icons[a]; G.icons[a] = R[pro]; }
  G.PRO5 = Object.keys(R);
})();
