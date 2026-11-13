/* pro13.js — pro icon batch 13: CutPack priority-3 names 61–80 (everyday things, people, signs, emoji faces).
   Detail level = pro.js (one soft inner outline, ribs, seams that the object really has), style.md §0 rules.
   Motion = anticipation, overshoot + settle, follow-through, secondary motion. Entrance and loop sit on separate groups.
   Whole-body people (person, users, wheelchair) and emoji faces are not "body parts" and are drawn normally. */
(function () {
  const G = window.GL, C = G.C, P = G.parts;
  const sub = (p, attrs) => p.child(attrs || {});
  const on = (q, p, start, spec) => G.kf(q.g || q, p.t0 + start * p.ts, spec);
  const pop = (p, q, at = 0, from = .4) => on(q, p, at, { s: [[0, from], [.42, 1.08, 'out'], [.62, 1]], o: [[0, 0], [.16, 1]] });
  const drop = (p, q, at = 0, dy = -90) => on(q, p, at, { y: [[0, dy], [.55, 0, 'back']], o: [[0, 0], [.2, 1]] });
  const rise = (p, q, at = 0, dy = 150) => on(q, p, at, { y: [[0, dy], [.55, 0, 'back']], o: [[0, 0], [.15, 1]] });
  const thud = (p, q, oy, dy = -220) => on(q, p, 0, { ox: 0, oy, y: [[0, dy], [.42, 0, 'in']], sy: [[.42, .86], [.56, 1.06, 'out'], [.7, 1]], sx: [[.42, 1.1], [.56, .97, 'out'], [.7, 1]], o: [[0, 0], [.1, 1]] });
  const show = (p, q) => on(q, p, 0, { o: [[0, 0], [.01, 1]] });
  const flash = (a, b) => [[0, 0], [a, 0], [a + .02, 1], [b, 0]];
  const shakeKeys = (n, amp, step = .05) => { const k = [[0, 0]]; for (let i = 1; i <= n; i++) k.push([i * step, i % 2 ? -amp : amp, 'lin']); k.push([(n + 1) * step, 0, 'out']); return k; };
  const at = (keys, t0) => keys.map(([t, v, e]) => [t + t0, v, e]);
  const tubes = (q, ds, w = 30) => { ds.forEach(d => q.path(d, { sw: w })); ds.forEach(d => q.path(d, { sw: w - 7, stroke: C.fill })); };
  const ring = (q, x, y, r, w = 22) => { q.circle(x, y, r, { sw: w }); q.circle(x, y, r, { sw: w - 7, stroke: C.fill }); };
  const f1 = v => +v.toFixed(1), rad = d => d * Math.PI / 180;
  const STAR5 = (cx, cy, R, r) => { const a = []; for (let i = 0; i < 10; i++) { const t = -Math.PI / 2 + i * Math.PI / 5, d = i % 2 ? r : R; a.push([f1(cx + Math.cos(t) * d), f1(cy + Math.sin(t) * d)]); } return a; };
  const DROP = (x, y, r) => `M ${x} ${y - r * 1.6} C ${x + r * .5} ${y - r * .8}, ${x + r} ${y - r * .2}, ${x + r} ${y + r * .3} A ${r} ${r} 0 0 1 ${x - r} ${y + r * .3} C ${x - r} ${y - r * .2}, ${x - r * .5} ${y - r * .8}, ${x} ${y - r * 1.6} Z`;
  const SHIELD = 'M 0 -170 C 50 -140, 100 -130, 140 -130 C 140 -10, 120 110, 0 170 C -120 110, -140 -10, -140 -130 C -100 -130, -50 -140, 0 -170 Z';
  const R = {}, rig = (name, dur, exit, fn) => { fn.custom = true; fn.dur = dur; fn.exit = exit; R[name] = fn; };

  /* scissors — the blades open (slowly) and snap shut (fast) around the pivot screw, twice, with snip marks at the tips */
  rig('scissors-pro', .6, 'pop', p => {
    const intro = sub(p);
    const arm = (sd) => { const a = sub(intro); a.shape([[18, -sd * 12], [186, sd * 46], [18, sd * 14]], { fill: C.fill, sw: 3.2 }); a.line(30, sd * 2, 160, sd * 40, { sw: 1.8, stroke: C.soft });
      tubes(a, [`M ${-78} ${-sd * 44} L 20 0`], 26); ring(a, -110, -sd * 64, 40, 24); return a; };
    const B = arm(-1), A = arm(1);
    intro.circle(20, 0, 13, { fill: C.fill, sw: 3 }); intro.dot(20, 0, 4);
    const snip = [[0, 0], [.1, 0], [.4, 1, 'out'], [.48, 0, 'in'], [.6, 0], [.9, 1, 'out'], [.98, 0, 'in']];
    on(A, p, .7, { loop: 2, ox: 20, oy: 0, r: snip.map(([t, v, e]) => [t, v * 13, e]) }); on(B, p, .7, { loop: 2, ox: 20, oy: 0, r: snip.map(([t, v, e]) => [t, -v * 13, e]) });
    const sm = sub(intro); [[192, -16, 206, -30], [196, 0, 214, 0], [192, 16, 206, 30]].forEach(([a, b, c, d]) => sm.line(a, b, c, d, { sw: 2.8 }));
    on(sm, p, .7, { loop: 2, o: [[0, 0], [.48, 0], [.5, 1], [.62, 0], [.98, 0], [1, 1], [1.12, 0]] });
    on(intro, p, 0, { s: [[0, .4], [.45, 1.08, 'out'], [.62, 1]], r: [[0, -30], [.55, 0, 'out']], o: [[0, 0], [.15, 1]] });
  });

  /* shirt — a T-shirt on a hanger hook swings, the sleeves lagging behind (follow-through) */
  rig('shirt-pro', .7, 'rise', p => {
    const intro = sub(p), sw = sub(intro);
    sw.path('M 0 -128 L 0 -156 Q 0 -184 22 -184 Q 40 -184 40 -166', { sw: 5 });
    [-1, 1].forEach(sd => { const sl = sub(sw); sl.path(`M ${sd * 60} -138 L ${sd * 150} -98 L ${sd * 182} -22 L ${sd * 118} 0 L ${sd * 96} -70 Z`, { fill: C.fill, sw: 3.2 }); sl.line(sd * 164, -40, sd * 130, -26, { sw: 2, stroke: C.soft });
      on(sl, p, .7, { loop: 2.8, ox: sd * 90, oy: -110, r: [[0, 0], [.3, sd * 2], [.75, -sd * 4, 'soft'], [1.45, sd * 3, 'soft'], [2.1, -sd * 2, 'soft'], [2.8, 0, 'soft']] }); });
    sw.path('M -60 -138 Q 0 -112 60 -138 L 104 -112 L 120 0 L 120 158 Q 120 168 110 168 L -110 168 Q -120 168 -120 158 L -120 0 L -104 -112 Z', { fill: C.fill, sw: 3.4 });
    sw.path('M -60 -138 Q 0 -86 60 -138', { sw: 3 }); sw.path('M -40 -126 Q 0 -96 40 -126', { sw: 1.8, stroke: C.soft });
    sw.rect(42, -40, 46, 52, { rx: 4, sw: 2.2, stroke: C.soft }); sw.line(-112, 146, 112, 146, { sw: 1.8, stroke: C.soft });
    on(sw, p, .7, { loop: 2.8, ox: 0, oy: -166, r: [[0, 0], [.6, 5, 'soft'], [1.3, -4, 'soft'], [2, 2.5, 'soft'], [2.8, 0, 'soft']] });
    drop(p, intro, 0, -110);
  });

  /* sofa — someone sits: each seat cushion sinks in turn and puffs back (squash & stretch), the sofa gives a little */
  rig('sofa-pro', .7, 'squash', p => {
    const intro = sub(p), sO = sub(intro), sf = sub(sO);
    sf.rect(-150, -92, 300, 120, { rx: 26, fill: C.fill, sw: 3.4 }); sf.line(0, -80, 0, 18, { sw: 2, stroke: C.soft });
    [-1, 1].forEach(sd => sf.line(sd * 150 - sd * 8, 156, sd * 150 - sd * 8, 176, { sw: 6 }));
    sf.rect(-176, 82, 352, 42, { rx: 12, fill: C.fill, sw: 3.2 });
    [-1, 1].forEach((sd, i) => { const c = sub(sf); c.rect(sd > 0 ? 2 : -130, 22, 128, 64, { rx: 16, fill: C.fill, sw: 3 }); c.line(sd > 0 ? 18 : -114, 40, sd > 0 ? 114 : -18, 40, { sw: 1.8, stroke: C.soft });
      const t = .3 + i * .7; on(c, p, .7, { loop: 2.6, ox: sd * 66, oy: 86, sy: [[0, 1], [t, 1], [t + .1, .78, 'out'], [t + .3, 1.06, 'out'], [t + .5, 1, 'soft']], sx: [[0, 1], [t, 1], [t + .1, 1.06, 'out'], [t + .3, .98], [t + .5, 1, 'soft']] }); });
    [-1, 1].forEach(sd => sf.rect(sd > 0 ? 130 : -184, -34, 54, 158, { rx: 22, fill: C.fill, sw: 3.4 }));
    sf.rect(-176, 120, 352, 40, { rx: 12, fill: C.fill, sw: 3.2 });
    on(sf, p, .7, { loop: 2.6, ox: 0, oy: 176, sy: [[0, 1], [.38, 1], [.44, .98, 'out'], [.6, 1, 'soft'], [1.08, 1], [1.14, .98, 'out'], [1.3, 1, 'soft']] });
    thud(p, sO, 176);
  });

  /* ticket — a tilted admission ticket: the stub tears away along its line, swings, and snaps back on */
  rig('ticket-pro', .6, 'pop', p => {
    const intro = sub(p), tk = intro.child({ transform: 'rotate(-12)' });
    tk.path('M -170 -84 L 74 -84 L 74 84 L -170 84 L -170 30 A 30 30 0 0 0 -170 -30 Z', { fill: C.fill, sw: 3.4 });
    tk.rect(-142, -62, 196, 124, { rx: 8, sw: 1.8, stroke: C.soft });
    tk.shape(STAR5(-50, -4, 40, 17), { fill: C.fill, sw: 2.8 }); [-1, 1].forEach(sd => tk.line(-120, sd * 44, 30, sd * 44, { sw: 3, stroke: C.soft }));
    const st = sub(tk); st.path('M 80 -84 L 170 -84 L 170 -30 A 30 30 0 0 0 170 30 L 170 84 L 80 84 Z', { fill: C.fill, sw: 3.4 });
    st.circle(126, 0, 18, { sw: 2.6 }); st.line(98, -56, 154, -56, { sw: 3, stroke: C.soft }); st.line(98, 56, 154, 56, { sw: 3, stroke: C.soft });
    tk.line(77, -80, 77, 80, { sw: 2, stroke: C.soft });
    on(st, p, .7, { loop: 2.6, ox: 80, oy: 84, x: [[0, 0], [.4, 0], [.6, 22, 'out'], [1.4, 22], [1.6, 0, 'in'], [1.66, -3], [1.74, 0]], r: [[0, 0], [.4, 0], [.6, 14, 'out'], [.8, 10, 'soft'], [1.4, 10], [1.6, 0, 'in']] });
    on(tk, p, .7, { loop: 2.6, ox: -40, oy: 0, r: [[0, 0], [.4, 0], [.6, -2, 'out'], [.8, 0, 'soft'], [1.6, 0], [1.66, 1.5], [1.8, 0, 'soft']] });
    pop(p, intro);
  });

  /* umbrella — the canopy springs open from its tip; raindrops fall onto it, it dips on each hit and sways */
  rig('umbrella-pro', .7, 'pop', p => {
    const intro = sub(p);
    [[-140, 0, -92], [-40, .45, -150], [60, .2, -146], [150, .7, -84]].forEach(([x, d, yl]) => { const r = sub(intro); r.path(DROP(x, -176, 9), { fill: C.fill, sw: 2.4 });
      on(r, p, .7 + d, { loop: 1.2, y: [[0, 0], [.4, yl + 176, 'in']], o: [[0, 0], [.05, 1], [.36, 1], [.42, 0]] }); });
    const um = sub(intro), cO = sub(um);
    cO.path('M -182 0 C -170 -112, -84 -160, 0 -160 C 84 -160, 170 -112, 182 0 Q 152 -22 122 0 Q 92 -22 62 0 Q 32 -22 0 0 Q -32 -22 -62 0 Q -92 -22 -122 0 Q -152 -22 -182 0 Z', { fill: C.fill, sw: 3.4 });
    ['M 0 -158 C -60 -150, -110 -80, -122 0', 'M 0 -158 C -30 -140, -54 -70, -62 0', 'M 0 -158 C 30 -140, 54 -70, 62 0', 'M 0 -158 C 60 -150, 110 -80, 122 0'].forEach(d => cO.path(d, { sw: 2, stroke: C.soft }));
    cO.line(0, -160, 0, -184, { sw: 5 });
    um.path('M 0 -2 L 0 140 Q 0 174 -30 174 Q -58 174 -58 146', { sw: 7 });
    on(um, p, .7, { loop: 2.4, ox: 0, oy: 140, r: [[0, 0], [.6, 3, 'soft'], [1.8, -3, 'soft'], [2.4, 0, 'soft']], y: [[0, 0], [.42, 0], [.48, 4, 'out'], [.65, 0, 'soft'], [1.12, 0], [1.18, 4, 'out'], [1.35, 0, 'soft']] });
    on(cO, p, .1, { ox: 0, oy: -160, sx: [[0, .08], [.45, 1.08, 'out'], [.6, .98], [.72, 1, 'soft']], sy: [[0, 1.1], [.45, .96, 'out'], [.7, 1, 'soft']], o: [[0, 0], [.05, 1]] });
    on(intro, p, 0, { o: [[0, 0], [.01, 1]] });
  });

  /* accessibility — a person seated in a wheelchair (side view, same jointed body as person-standing): the arm pushes the rim,
     the chair rolls forward and back, the spoked wheel turns exactly with the distance travelled */
  const SEATED = { torso: 'M -28 -94 Q 0 -102 24 -92 Q 32 -86 30 -70 L 28 14 Q 0 22 -28 14 L -34 -70 Q -36 -88 -28 -94 Z', head: [6, -134, 30],
    leg: () => ({ h: [0, 4], k: [80, 10], f: [88, 92] }), arm: () => ({ s: [0, -76], e: [22, -24], h: [66, -10] }), armOver: true };
  rig('accessibility-pro', .6, 'pop', p => {
    const intro = sub(p), mv = sub(intro), w = mv.child({ transform: 'translate(-14 -6)' });
    w.path('M -60 -40 L -60 30 L 40 30', { sw: 6 }); w.line(70, 98, 110, 98, { sw: 6 });
    const wh = sub(w); ring(wh, -10, 64, 94, 20); [0, 60, 120].forEach(a => wh.line(f1(-10 + Math.cos(rad(a)) * 82), f1(64 + Math.sin(rad(a)) * 82), f1(-10 - Math.cos(rad(a)) * 82), f1(64 - Math.sin(rad(a)) * 82), { sw: 2.4, stroke: C.soft })); wh.circle(-10, 64, 12, { fill: C.fill, sw: 3 });
    const hm = human(w, 'line', SEATED);
    const k = [[0, 0], [.3, 0], [.38, -4, 'out'], [1, 34, 'io'], [1.6, 34], [2.2, 0, 'io']];
    on(mv, p, .7, { loop: 2.6, x: k });
    on(wh, p, .7, { loop: 2.6, ox: -10, oy: 64, r: k.map(([t, v, e]) => [t, f1(v / 94 * 180 / Math.PI), e]) });
    hm.on('upper1', p, .7, { loop: 2.6, ox: 0, oy: -76, r: [[0, 0], [.3, 0], [.38, -10, 'out'], [1, 18, 'io'], [1.6, 18], [2.2, 0, 'io']] });
    hm.on('torso', p, .7, { loop: 2.6, ox: 0, oy: 14, r: [[0, 0], [.3, 0], [.5, 5, 'out'], [1, 0, 'soft'], [1.6, 0], [1.8, -3, 'out'], [2.2, 0, 'soft']] });
    pop(p, intro);
  });

  /* emoji faces */
  const face = q => q.circle(0, 0, 150, { fill: C.fill, sw: 3.4 });

  /* baby — a baby face with a curl of hair: it giggles with a bouncy hop, blinks, the curl springs after (follow-through) */
  rig('baby-pro', .6, 'pop', p => {
    const intro = sub(p), fc = sub(intro);
    const cl = sub(fc); cl.path('M -6 -150 C -34 -186, 30 -204, 22 -172 C 16 -150, -8 -160, 0 -174', { sw: 4.4 });
    on(cl, p, .7, { loop: 2.4, ox: 0, oy: -150, r: [[0, 0], [.14, -14, 'out'], [.34, 12, 'io'], [.5, -6, 'io'], [.66, 3, 'io'], [.8, 0, 'soft']] });
    face(fc);
    [-1, 1].forEach(sd => { const e = sub(fc); e.circle(sd * 54, -26, 14, { fill: C.ink, sw: 1.4 });
      on(e, p, .7, { loop: 2.4, ox: sd * 54, oy: -26, sy: [[0, 1], [1.7, 1], [1.76, .1, 'in'], [1.86, 1, 'out']] });
      fc.ellipse(sd * 92, 34, 22, 14, { sw: 2.2, stroke: C.soft }); });
    fc.path('M -40 58 Q 0 98 40 58', { sw: 5 });
    on(fc, p, .7, { loop: 2.4, ox: 0, oy: 150, y: [[0, 0], [.1, -16, 'out'], [.26, 0, 'in'], [.36, -8, 'out'], [.5, 0, 'in']], r: [[0, 0], [.1, -4], [.36, 3], [.6, 0, 'soft']] });
    pop(p, intro);
  });

  /* contact-round — a contact card: it flips like a rolodex card (edge-on squash) and the person on it nods */
  rig('contact-round-pro', .6, 'pop', p => {
    const intro = sub(p), cd = sub(intro);
    cd.rect(-150, -140, 300, 300, { rx: 22, fill: C.fill, sw: 3.4 }); cd.rect(-130, -120, 260, 260, { rx: 14, sw: 1.8, stroke: C.soft });
    const ps = sub(cd); ps.circle(0, -28, 46, { fill: C.fill, sw: 3.2 }); ps.path('M -82 116 C -82 56, -42 34, 0 34 C 42 34, 82 56, 82 116', { fill: C.fill, sw: 3.2 });
    on(ps, p, .7, { loop: 2.8, ox: 0, oy: 34, r: [[0, 0], [1.6, 0], [1.75, -5, 'out'], [1.95, 4, 'io'], [2.15, 0, 'soft']], y: [[0, 0], [1.6, 0], [1.75, -6, 'out'], [2, 0, 'soft']] });
    on(cd, p, .7, { loop: 2.8, ox: 0, oy: 0, sx: [[0, 1], [.5, 1], [.75, .06, 'in'], [1, 1.04, 'out'], [1.15, 1, 'soft']] });
    [-1, 1].forEach(sd => P.capsule(intro, sd * 64, -166, sd * 64, -116, 11, { sw: 2.8 }));
    pop(p, intro);
  });

  /* human figure — a jointed body that reads as a person (round head apart from the body, shoulders wider than hips,
     thick limbs that bend at elbow and knee). mode 'line' = house style (ink outline around a dark body, all parts merged as one
     silhouette: every outline is drawn first, then every dark fill), 'solid' = filled white silhouette.
     Returns joint groups; animate them with hm.on(name, p, start, spec) — the same keys go to the outline and the fill copies. */
  const BODY = {
    head: [0, -132, 31],
    torso: 'M -38 -94 Q 0 -102 38 -94 Q 48 -90 46 -70 L 32 14 Q 0 24 -32 14 L -46 -70 Q -48 -90 -38 -94 Z',
    arm: sd => ({ s: [sd * 36, -82], e: [sd * 54, -18], h: [sd * 58, 40] }),
    leg: sd => ({ h: [sd * 17, 8], k: [sd * 21, 88], f: [sd * 24, 166] }) };
  const human = (q, mode, pose = {}) => {
    const solid = mode === 'solid', layers = solid ? [1] : [1, 0], J = {}, add = (k, g) => (J[k] = J[k] || []).push(g);
    layers.forEach(ink => {
      /* limb widths are the BODY (geometry): divide by the pen's stroke factor so they keep their size at any icon size —
         only the outline (+7) thickens when the icon is small, like every other line (user: "ไม่ว่าจะย่อหรือขยาย ไอ้คนมันต้องไม่เปลี่ยนแปลง") */
      const L = sub(q), K = L.k || 1, col = ink ? C.ink : C.fill, w = v => ink && !solid ? v / K + 7 : v / K, o = { stroke: col };
      [-1, 1].forEach(sd => { const g = (pose.leg || BODY.leg)(sd), up = sub(L), lo = sub(up);
        up.line(...g.h, ...g.k, Object.assign({ sw: w(30) }, o)); lo.line(...g.k, ...g.f, Object.assign({ sw: w(27) }, o)); add('thigh' + sd, up); add('shin' + sd, lo); });
      const t = sub(L); t.path(pose.torso || BODY.torso, { fill: col, stroke: col, sw: ink && !solid ? 7 : .5 }); add('torso', t);
      if (!pose.armOver) [-1, 1].forEach(sd => { const g = (pose.arm || BODY.arm)(sd), up = sub(t), lo = sub(up);
        up.line(...g.s, ...g.e, Object.assign({ sw: w(25) }, o)); lo.line(...g.e, ...g.h, Object.assign({ sw: w(23) }, o)); add('upper' + sd, up); add('fore' + sd, lo); });
      const h = sub(t); h.circle(...(pose.head || BODY.head), { fill: col, stroke: col, sw: ink && !solid ? 7 : .5 }); add('head', h); });
    if (pose.armOver) { const g = pose.arm(1), up = sub(q), lo = sub(up);   // side view: the near arm lies over the body, so it keeps its own outline
      const K = q.k || 1; [[up, g.s, g.e, 25], [lo, g.e, g.h, 23]].forEach(([q2, a, b, wd]) => { q2.line(...a, ...b, { sw: wd / K + 7 }); q2.line(...a, ...b, { sw: wd / K, stroke: C.fill }); });
      q.circle(...g.s, 3, { fill: C.fill, stroke: C.fill, sw: 1 }); add('upper1', up); add('fore1', lo); }
    return { on: (name, p, start, spec) => (J[name] || []).forEach(g => on(g, p, start, spec)), J };
  };
  G.parts.human = human;

  /* person-standing — a real little person: bends the knees (anticipation), jumps with both arms swinging overhead,
     lands with bent knees (squash) and straightens; the head lags a beat (follow-through) */
  const jumper = mode => p => {
    const intro = sub(p), wr = intro.child({ transform: 'translate(0 -6) scale(.86)' }, .86), bd = sub(wr), hm = human(bd, mode);
    const T = 2.4, squat = (a, b) => [[0, 0], [.2, 0], [.34, a, 'out'], [.56, 0, 'out'], [1.02, 0], [1.1, b, 'out'], [1.34, 0, 'soft']];
    [-1, 1].forEach(sd => {
      hm.on('thigh' + sd, p, .7, { loop: T, ox: sd * 17, oy: 8, r: squat(sd * -22, sd * -18) });
      hm.on('shin' + sd, p, .7, { loop: T, ox: sd * 21, oy: 88, r: squat(sd * 40, sd * 32) });
      hm.on('upper' + sd, p, .7, { loop: T, ox: sd * 36, oy: -82, r: [[0, 0], [.2, 0], [.34, sd * 18, 'out'], [.6, -sd * 150, 'out'], [.85, -sd * 150], [1.1, -sd * 10, 'in'], [1.25, sd * 6], [1.45, 0, 'soft']] });
      hm.on('fore' + sd, p, .7, { loop: T, ox: sd * 54, oy: -18, r: [[0, 0], [.2, 0], [.34, -sd * 30, 'out'], [.6, -sd * 10, 'out'], [.85, -sd * 10], [1.1, -sd * 24, 'in'], [1.45, 0, 'soft']] }); });
    hm.on('head', p, .7, { loop: T, ox: 0, oy: -100, r: [[0, 0], [.34, 4], [.6, -5, 'out'], [.9, 0, 'soft'], [1.12, 6, 'out'], [1.4, 0, 'soft']] });
    on(bd, p, .7, { loop: T, y: [[0, 0], [.2, 0], [.34, 14, 'out'], [.6, -44, 'out'], [.85, -44, 'soft'], [1.02, 0, 'in'], [1.1, 10, 'out'], [1.34, 0, 'soft']] });
    const gd = sub(wr); gd.line(-110, 180, 110, 180, { sw: 4 });
    pop(p, intro);
  };
  rig('person-standing-pro', .6, 'pop', jumper('line'));

  /* user-round / users-round — round head and rounded shoulders; they nod and breathe, a ring pulses on the nod */
  const roundUser = (q, x, y, s, soft) => { const u = q.child({ transform: `translate(${x} ${y}) scale(${s})` }, s), hd = u.child();
    const st = soft ? { fill: C.fill, sw: 2.8, stroke: C.soft } : { fill: C.fill, sw: 3.4 };
    u.path('M -118 156 A 118 118 0 0 1 118 156 Z', st); u.path('M -88 156 A 88 88 0 0 1 88 156', { sw: 1.8, stroke: C.soft }); hd.circle(0, -60, 70, st); return [u, hd]; };
  rig('user-round-pro', .6, 'sink', p => {
    const intro = sub(p);
    const rp = sub(intro); rp.circle(0, 0, 160, { sw: 2, stroke: C.soft });
    on(rp, p, .7, { loop: 2.6, s: [[0, .9], [.2, .9], [1.1, 1.18, 'out']], o: [[0, 0], [.2, 0], [.22, .7], [1.1, 0]] });
    const [u, hd] = roundUser(intro, 0, 0, 1);
    on(hd, p, .7, { loop: 2.6, ox: 0, oy: 10, r: [[0, 0], [.2, -5, 'out'], [.45, 3, 'io'], [.7, 0, 'soft']], y: [[0, 0], [.2, 6, 'out'], [.45, -4], [.7, 0, 'soft']] });
    on(u, p, .7, { loop: 2.6, ox: 0, oy: 150, sy: [[0, 1], [1.3, 1.025, 'soft'], [2.6, 1, 'soft']] });
    rise(p, intro, 0, 70);
  });
  rig('users-round-pro', .6, 'sink', p => {
    const intro = sub(p);
    const [ub, hb] = roundUser(intro, 62, -26, .74, true), [uf, hf] = roundUser(intro, -40, 30, .86);
    on(hb, p, .7, { loop: 2.6, ox: 0, oy: 10, r: [[0, 0], [1.2, 0], [1.4, 6, 'out'], [1.65, -3, 'io'], [1.9, 0, 'soft']] });
    on(hf, p, .7, { loop: 2.6, ox: 0, oy: 10, r: [[0, 0], [.2, -5, 'out'], [.45, 3, 'io'], [.7, 0, 'soft']], y: [[0, 0], [.2, 6, 'out'], [.45, -4], [.7, 0, 'soft']] });
    rise(p, intro, 0, 70);
  });

  /* ban — the "no" sign stamps down (squash + overshoot) and gives a firm shake */
  rig('ban-pro', .6, 'pop', p => {
    const intro = sub(p), bn = sub(intro);
    tubes(bn, ['M 0 -140 A 140 140 0 1 1 0 140 A 140 140 0 1 1 0 -140', 'M -99 -99 L 99 99'], 32);
    on(bn, p, .7, { loop: 2.4, s: [[0, 1], [.3, 1], [.4, 1.14, 'out'], [.5, .94, 'in'], [.62, 1.03], [.75, 1, 'soft']], r: [[0, 0], [.8, 0], ...at(shakeKeys(5, 6, .06).slice(1), .8)] });
    on(intro, p, 0, { s: [[0, 1.6], [.35, .92, 'in'], [.5, 1.04], [.62, 1]], o: [[0, 0], [.12, 1]] });
  });

  /* circle-x — the X spins a quarter turn inside the disc (snap with overshoot), then a "no" shake */
  rig('circle-x-pro', .6, 'pop', p => {
    const intro = sub(p), dc = sub(intro);
    dc.circle(0, 0, 146, { fill: C.fill, sw: 3.4 }); dc.circle(0, 0, 126, { sw: 1.8, stroke: C.soft });
    const x = sub(dc); tubes(x, ['M -58 -58 L 58 58', 'M 58 -58 L -58 58'], 30);
    on(x, p, .7, { loop: 2.6, r: [[0, 0], [.3, 0], [.4, -10, 'out'], [.8, 96, 'out'], [1, 90, 'soft'], [2.6, 90]] });
    on(dc, p, .7, { loop: 2.6, r: [[0, 0], [1.2, 0], ...at(shakeKeys(5, 4, .05).slice(1), 1.2)] });
    pop(p, intro);
  });

  /* shield-alert / shield-x — a shield takes a hit: the mark stamps in, the shield shakes, a warning ring pulses out */
  const shield = (p, mark, exitDrop) => {
    const intro = sub(p), w = intro.child({ transform: 'scale(.92)' }, .92);
    const rg = sub(w); rg.path(SHIELD, { stroke: C.soft, sw: 2 }); on(rg, p, .7, { loop: 2.4, s: [[0, 1], [.15, 1], [.95, 1.2, 'out']], o: [[0, 0], [.15, 0], [.17, .8], [.95, 0]] });
    const sh = sub(w); sh.path(SHIELD, { fill: C.fill, sw: 3.4 }); sh.child({ transform: 'scale(.84)' }, .84).path(SHIELD, { sw: 1.8, stroke: C.soft });
    const mk = sub(sh); mark(mk);
    on(mk, p, .7, { loop: 2.4, ox: 0, oy: 0, s: [[0, 1], [.05, 1.18, 'out'], [.2, .95], [.35, 1, 'soft']] });
    on(sh, p, .7, { loop: 2.4, r: shakeKeys(6, 3, .05) });
    drop(p, intro, 0, -100);
  };
  rig('shield-alert-pro', .6, 'rise', p => shield(p, q => { q.shape([[-14, -78], [14, -78], [7, 16], [-7, 16]], { fill: C.ink, sw: 6 }); q.dot(0, 56, 13); }));
  rig('shield-x-pro', .6, 'rise', p => shield(p, q => tubes(q, ['M -48 -50 L 48 46', 'M 48 -50 L -48 46'], 26)));

  /* siren — the dome light flashes, its rays flare left then right in turn, the dome pulses */
  rig('siren-pro', .6, 'pop', p => {
    const intro = sub(p);
    [-1, 1].forEach((sd, i) => { const ry = sub(intro); [[-160, 150], [-130, 150], [-100, 150]].forEach(([a, r]) => { const A = rad(sd > 0 ? -180 - a : a); ry.line(f1(Math.cos(A) * 138), f1(Math.sin(A) * 138 + 10), f1(Math.cos(A) * 176), f1(Math.sin(A) * 176 + 10), { sw: 4 }); });
      on(ry, p, .7, { loop: 1.2, o: [[0, 0], [i * .6, 0], [i * .6 + .03, 1], [i * .6 + .45, 0]], ox: 0, oy: 10, s: [[0, .9], [i * .6, .9], [i * .6 + .2, 1.05, 'out']] }); });
    const tp = sub(intro); tp.line(0, -102, 0, -128, { sw: 5 }); tp.circle(0, -136, 9, { fill: C.fill, sw: 2.6 });
    const dm = sub(intro); dm.path('M -108 122 L -108 10 A 108 108 0 0 1 108 10 L 108 122 Z', { fill: C.fill, sw: 3.4 });
    dm.path('M -80 110 L -80 14 A 80 80 0 0 1 80 14 L 80 110', { sw: 1.8, stroke: C.soft });
    const gl = sub(dm); gl.path('M -66 104 L -66 18 A 66 66 0 0 1 66 18 L 66 104 Z', { fill: C.soft, stroke: C.soft, sw: 1 });
    on(gl, p, .7, { loop: .6, o: [[0, .55], [.05, .1], [.3, .1], [.35, .55]] });
    on(dm, p, .7, { loop: .6, ox: 0, oy: 122, s: [[0, 1], [.05, 1.03, 'out'], [.25, 1, 'soft']] });
    intro.rect(-150, 120, 300, 40, { rx: 12, fill: C.fill, sw: 3.4 }); intro.line(-130, 140, 130, 140, { sw: 1.8, stroke: C.soft });
    pop(p, intro);
  });

  /* square-check — the tick is re-drawn into the rounded box, which squashes as it lands */
  rig('square-check-pro', .6, 'pop', p => {
    const intro = sub(p), bx = sub(intro);
    bx.rect(-144, -144, 288, 288, { rx: 44, fill: C.fill, sw: 3.4 }); bx.rect(-122, -122, 244, 244, { rx: 30, sw: 1.8, stroke: C.soft });
    const tk = bx.poly([[-64, 2], [-20, 48], [70, -50]], { sw: 22 });
    on(tk, p, .7, { loop: 2.4, draw: [[0, 1], [1.8, 1], [1.95, 0, 'in'], [2.05, 0], [2.4, 1, 'out']] });
    on(bx, p, .7, { loop: 2.4, ox: 0, oy: 144, s: [[0, 1], [.06, .94, 'out'], [.2, 1.04], [.35, 1, 'soft']] });
    pop(p, intro);
  });

  /* annoyed — heavy-lidded eyes roll up and to the side, the head tilts with a sigh, a puff leaves the corner of the mouth */
  rig('annoyed-pro', .6, 'pop', p => {
    const intro = sub(p), fc = sub(intro);
    face(fc);
    const pu = sub(fc); [-1, 1].forEach(sd => pu.circle(sd * 52, -22, 10, { fill: C.ink, sw: 1.4 }));
    on(pu, p, .7, { loop: 2.8, x: [[0, 0], [.4, 0], [.7, 16, 'io'], [1.2, 16], [1.5, 0, 'io']], y: [[0, 0], [.4, 0], [.7, -8, 'io'], [1.2, -8], [1.5, 0, 'io']] });
    [-1, 1].forEach(sd => { fc.line(sd * 82, -36, sd * 24, -36, { sw: 6 }); fc.line(sd * 84, -78, sd * 34, -88, { sw: 4.4 }); });
    fc.line(-48, 76, 40, 62, { sw: 5 });
    const pf = sub(intro); pf.path('M 60 66 q 16 -6 24 4', { sw: 3, stroke: C.soft }); pf.path('M 70 82 q 18 0 26 12', { sw: 2.6, stroke: C.soft });
    on(pf, p, .7, { loop: 2.8, x: [[0, 0], [1.5, 0], [2, 26, 'out']], o: flash(1.5, 2.1) });
    on(fc, p, .7, { loop: 2.8, ox: 0, oy: 150, r: [[0, 0], [1.4, 0], [1.6, -5, 'io'], [2.3, -5], [2.6, 0, 'io']], y: [[0, 0], [1.4, 0], [1.6, 6, 'io'], [2.3, 6], [2.6, 0, 'io']] });
    pop(p, intro);
  });

  /* laugh — squeezed eyes, a wide open mouth and tears of joy; the face shakes with laughter, the mouth flaps */
  rig('laugh-pro', .6, 'pop', p => {
    const intro = sub(p), fc = sub(intro);
    face(fc);
    [-1, 1].forEach(sd => fc.path(`M ${sd * 82} -24 Q ${sd * 56} -64 ${sd * 30} -24`, { sw: 6 }));
    const mo = sub(fc); mo.path('M -86 22 L 86 22 Q 86 116 0 116 Q -86 116 -86 22 Z', { fill: C.fill, sw: 4.4 }); mo.path('M -40 96 Q 0 70 40 96', { sw: 2.4, stroke: C.soft });
    on(mo, p, .7, { loop: .5, ox: 0, oy: 22, sy: [[0, 1], [.12, .82, 'out'], [.25, 1.04], [.5, 1, 'soft']] });
    [-1, 1].forEach((sd, i) => { const t = sub(fc); t.path(DROP(sd * 104, -6, 11), { fill: C.fill, sw: 2.4 });
      on(t, p, .7 + i * .3, { loop: 1.4, y: [[0, 0], [.2, 0], [1, 70, 'in']], x: [[0, 0], [1, sd * 16, 'out']], o: [[0, 0], [.2, 0], [.25, 1], [.85, 1], [1, 0]] }); });
    on(fc, p, .7, { loop: 1, ox: 0, oy: 150, y: [[0, 0], [.12, -10, 'out'], [.25, 0, 'in'], [.37, -7, 'out'], [.5, 0, 'in'], [.62, -4], [.75, 0]], r: [[0, 0], [.25, -3], [.5, 3], [.75, 0]] });
    pop(p, intro);
  });

  /* meh — dot eyes and a flat mouth: a slow shrug side to side, the eyes glance along, the mouth twists */
  rig('meh-pro', .6, 'pop', p => {
    const intro = sub(p), fc = sub(intro);
    face(fc);
    const ey = sub(fc); [-1, 1].forEach(sd => ey.circle(sd * 52, -30, 14, { fill: C.ink, sw: 1.4 }));
    on(ey, p, .7, { loop: 3.2, x: [[0, 0], [.6, -14, 'io'], [1.4, -14], [1.8, 14, 'io'], [2.6, 14], [3.2, 0, 'io']] });
    const mo = sub(fc); mo.line(-60, 70, 60, 70, { sw: 6 });
    on(mo, p, .7, { loop: 3.2, ox: 0, oy: 70, r: [[0, 0], [.6, -4, 'io'], [1.4, -4], [1.8, 4, 'io'], [2.6, 4], [3.2, 0, 'io']], sx: [[0, 1], [.6, .9, 'io'], [1.4, .9], [1.8, 1, 'io']] });
    on(fc, p, .7, { loop: 3.2, ox: 0, oy: 150, r: [[0, 0], [.6, -6, 'io'], [1.4, -6], [1.8, 6, 'io'], [2.6, 6], [3.2, 0, 'io']] });
    pop(p, intro);
  });

  Object.assign(G.icons, R);
  const names = ['scissors', 'shirt', 'sofa', 'ticket', 'umbrella', 'accessibility', 'baby', 'contact-round', 'person-standing', 'user-round',
    'users-round', 'ban', 'circle-x', 'shield-alert', 'shield-x', 'siren', 'square-check', 'annoyed', 'laugh', 'meh'];
  const ALIAS = Object.fromEntries(names.map(n => [n, n + '-pro'])); Object.assign(ALIAS, { wheelchair: 'accessibility-pro', prohibit: 'ban-pro', 'no-entry': 'ban-pro' });
  for (const [a, pro] of Object.entries(ALIAS)) { if (G.icons[a] && !G.icons[a + '-basic'] && !G.icons[a].custom) G.icons[a + '-basic'] = G.icons[a]; G.icons[a] = R[pro]; }
  G.PRO13 = names.map(n => n + '-pro');
})();
