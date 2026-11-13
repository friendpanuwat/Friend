/* b08.js — category B08 "เป้าหมาย / ผลลัพธ์ / ความสำเร็จ": 20 neutral designs — STILL DRAFTS (round 3, waiting for the user's pick).
   Round 1 (plain symbols) → "ขอผลงานที่เป็นมืออาชีพมากกว่านี้ … อยากได้ที่เป็นกลาง ไม่ใช่อันที่มีความหมายเฉพาะตัว"; round 2 (holders / displays: frames,
   panels, boards …) → "มันมีหน้าตาแบบนี้เยอะแล้ว เอาใหม่หมด · เอาแบบสร้างสรรค์ก็ได้ แต่ไม่อยากได้อันที่มีความหมายเฉพาะตัว" → round 3: twenty different
   shapes and mechanisms, each a little physical story of "getting there" that fits any goal: dominoes, a ramp, a bridge, a swinging cradle,
   a ripple, a constellation, spring pads, gears and a rack, a pulley, a glass filling to the brim, a fishing line, a cable car, a seesaw
   catapult, a wind-up walker, a trampoline, a paper plane, a paper boat, a kite, a zip, a swing. House level of detail, drawn with care.
   Slots (same as CutPack CATEGORIES.md B08 — references/cutpack-CATEGORIES.md, cat_ai.py): goal THING (what is reached) · who icon (optional,
   who gets there — it rides / jumps / stands where it fits the design). A missing / unknown icon → its label in big type.
   GL.cats.B08.draw(i, data, { x, y, s, at, hit, speed }) — canvas 1000 × 700 centred at (0,0); hit = seconds after `at` (default 1.8).
   This round places the parts in their final pose (reached); motion comes after the pick. */
(function () {
  const G = window.GL, C = G.C, NS = 'http://www.w3.org/2000/svg';
  const W = (w = 2) => ({ sw: w }), F = (w = 3.2) => ({ fill: C.fill, sw: w }), S = (w = 2) => ({ sw: w, stroke: C.soft });
  const rad = d => d * Math.PI / 180, f1 = v => +v.toFixed(1);
  const GLASS = 'rgba(255,255,255,.07)', LIT = 'rgba(255,255,255,.2)', INK = { fill: C.ink, sw: 1.6 };

  /* TIMING (same system as b01–b06): the keyword c.hit comes from the speech and never moves. M = how long each move takes = 1 / speed
     (c.speed, else GL.stage / GL.motion speed) but at most hit / HIT0. tu(x) = x·M · bH(x) / aH(x) = before / after the keyword.
     Because M ≤ hit / 1.8, tu(x) ≤ bH(1.8 − x). */
  const HIT0 = 1.8; let Z = null; const CLAMPS = {}; let CUR = '';
  function setZ(c) { const sp = Math.min(20, Math.max(.05, +(c.speed ?? G.motion().speed ?? 1) || 1)), H = c.hit ?? HIT0, M = Math.max(.4, Math.min(1 / sp, H / HIT0));
    Z = { sp: 1 / M, want: sp, M, H }; }
  const tu = x => x * Z.M, bH = x => Z.H - x * Z.M, aH = x => Z.H + x * Z.M;
  function fixT(spec) { for (const n in spec) { const k = spec[n]; if (!Array.isArray(k)) continue;
    for (let i = 1; i < k.length; i++) if (k[i][0] < k[i - 1][0] - 1e-9) { k[i] = [k[i - 1][0], k[i][1], k[i][2]]; CLAMPS[CUR] = (CLAMPS[CUR] || 0) + 1; } } return spec; }
  const kf = (e, t, spec) => G.kf(e, t, fixT(spec));

  /* ---------- plumbing (same family as b06.js) ---------- */
  const TR = ['x', 'y', 'r', 's', 'sx', 'sy', 'ky'];
  const sub = (p, a) => { const q = p.child(a || {}); q.H = p.H; q.motion = p.motion; return q; };
  /* keyframes on a pen's group; q's own times come from p (any pen of the same rig works as p — they share t0) */
  const on = (q, p, t, spec) => { const t0 = p.t0 + t * p.ts, fade = q.og && !TR.some(n => spec[n]); kf(fade ? q.og : (q.g || q), t0, spec); };
  function mvG(p, m) { const o = sub(p), g = sub(o); g.og = o.g; if (m) { const K = { ox: m.px || 0, oy: m.py || 0 }; TR.concat('o').forEach(n => { if (m[n]) K[n] = m[n]; }); on(g, p, 0, K); } return g; }
  const art = (c, fn) => { const f = p => { p.H = Z.H; fn(p); }; f.custom = true; f.dur = .35; f.exit = 'pop';
    const a = G.art(f, { x: c.x, y: c.y, s: c.s, at: c.at || 0, speed: 1 }); a.speed = Z.sp; return a; };
  const over = (c, fn) => art(Object.assign({}, c), fn);                     // a rig drawn after the icons (on top of them)
  const atT = (g, p, t) => on(g, p, t, { o: [[0, 0], [tu(.12), 1]] });
  const R = (q, x, y, w, h, rx, o) => q.rect(x, y, w, h, Object.assign({ rx }, o));
  const floor = (p, y = 300, a = -470, b = 470) => { const g = sub(p); g.line(a, y, b, y, S(2)); atT(g, p, 0); return g; };
  const rot = (p, a, x, y) => sub(p, { transform: `rotate(${f1(a)} ${f1(x)} ${f1(y)})` });
  function txt(p, str, x, y, { size = 42, maxW = 1e9, weight = 600, anchor = 'middle', color = C.soft } = {}) {
    const e = p.text(String(str), x, y, { size, weight, anchor, color, dur: .01 });
    const w = e.getBBox().width; if (w > maxW) e.setAttribute('font-size', f1(size * maxW / w));
    return e;
  }
  const P2 = pts => pts.map(([x, y]) => [f1(x), f1(y)]);
  /* a closed polygon with rounded corners (r) */
  function rpoly(pts, r) { const n = pts.length; let d = '';
    for (let i = 0; i < n; i++) { const [x0, y0] = pts[(i + n - 1) % n], [x1, y1] = pts[i], [x2, y2] = pts[(i + 1) % n];
      const l1 = Math.hypot(x0 - x1, y0 - y1), l2 = Math.hypot(x2 - x1, y2 - y1), k1 = Math.min(r, l1 / 2) / l1, k2 = Math.min(r, l2 / 2) / l2;
      const a = [x1 + (x0 - x1) * k1, y1 + (y0 - y1) * k1], b = [x1 + (x2 - x1) * k2, y1 + (y2 - y1) * k2];
      d += `${i ? 'L' : 'M'} ${f1(a[0])} ${f1(a[1])} Q ${f1(x1)} ${f1(y1)} ${f1(b[0])} ${f1(b[1])} `; }
    return d + 'Z'; }
  /* a ring (outer R, inner r) as one filled path: outlined both edges, dark between */
  const ringD = (x, y, Ro, Ri) => `M ${x + Ro} ${y} A ${Ro} ${Ro} 0 1 0 ${x - Ro} ${y} A ${Ro} ${Ro} 0 1 0 ${x + Ro} ${y} Z M ${x + Ri} ${y} A ${Ri} ${Ri} 0 1 1 ${x - Ri} ${y} A ${Ri} ${Ri} 0 1 1 ${x + Ri} ${y} Z`;
  function ring(q, x, y, Ro, Ri, o = F(3.2)) { const e = q.path(ringD(x, y, Ro, Ri), o); e.setAttribute('fill-rule', 'evenodd'); return e; }
  /* an object's entrance at t: pop (grows from px,py) · rise (from below) · drop (from above, lands with a bounce) */
  function inG(p, kind = 'pop', px = 0, py = 0, t = 0) { const K = { px, py, o: [[0, 0], [t, 0], [t + tu(.1), 1]] };
    if (kind === 'rise') K.y = [[0, 50], [t, 50], [t + tu(.3), -5, 'out'], [t + tu(.4), 0, 'soft']];
    else if (kind === 'drop') K.y = [[0, -80], [t, -80], [t + tu(.24), 0, 'in'], [t + tu(.31), -8, 'out'], [t + tu(.4), 0, 'soft']];
    else K.s = [[0, .82], [t, .82], [t + tu(.24), 1.03, 'out'], [t + tu(.38), 1, 'soft']];
    return mvG(p, K); }


  /* ---------- the data ---------- */
  const picOf = it => it && it.icon && (G.icons[it.icon] || G.icons[it.icon + '-pro']);
  function st(d) { const who = d.who ? { icon: d.who } : null; return { goal: d.goal || null, who: who && picOf(who) ? who : null }; }
  /* a THING's picture at (cx, cy), width wd; no picture → its label in big type. o.t = when it comes in · o.mv = keys of the part it rides */
  function pic(it, cx, cy, wd, c, o = {}) {
    if (!it) return null; const at = c.at || 0, X = c.x + cx * c.s, Y = c.y + cy * c.s, fn = picOf(it), t = o.t ?? tu(.12);
    let a;
    if (fn) a = G.art(fn, { x: X, y: Y, w: wd * c.s, at: at + t, speed: Z.sp });
    else { const str = it.label || it.icon; if (!str) return null;
      const f = q => txt(q, str, 0, wd * .13, { size: wd * .3, maxW: wd * 1.8, weight: 700, color: C.ink }); f.custom = true; f.dur = .3; f.exit = 'pop';
      a = G.art(f, { x: X, y: Y, s: c.s, at: at + t, speed: 1 }); a.speed = Z.sp; }
    if (o.mv) { const m = o.mv, K = { ox: X, oy: Y }; ['x', 'y'].forEach(n => { if (m[n]) K[n] = m[n].map(([u, v, e]) => [u, v * c.s, e]); }); ['s', 'r', 'o'].forEach(n => { if (m[n]) K[n] = m[n]; }); kf(a.wrap, at, K); }
    return a;
  }
  const lab = (q, it, x, y, o = {}) => it && it.label && picOf(it) ? txt(q, it.label, x, y, Object.assign({ maxW: 320, color: C.ink, weight: 700 }, o)) : null;
  /* the goal: picture + label */
  function goalAt(p, c, S0, x, y, w, ly, o = {}) { if (!S0.goal) return; pic(S0.goal, x, y, w, c, o); if (ly != null) lab(sub(p), S0.goal, x, ly, o.lab || {}); }
  /* who gets there (optional icon) */
  const whoAt = (p, c, S0, x, y, w, o = {}) => S0.who ? pic(S0.who, x, y, w, c, o) : null;
  /* the traveller: who, or (no who) a plain glowing dot */
  function runner(p, c, S0, x, y, w, o = {}) { if (S0.who) return pic(S0.who, x, y, w, c, o); const g = sub(p); atT(g, p, 0); g.circle(x, y + w * .3, w * .17, { fill: C.ink, sw: 1.6 }); return g; }
  const tickMark = (q, x, y, r) => { q.circle(x, y, r, F(3.2)); q.poly([[x - r * .42, y + 2], [x - r * .1, y + r * .34], [x + r * .44, y - r * .32]], W(5.5)); };

  /* a person doing the design's activity (GL.parts.human, side view, facing right — part of the design, not the `who` slot):
     arm = the near arm { s, e, h } (shoulder, elbow, hand), o.leg(sd) = legs, o.lean = degrees about the feet; feet on fy, scale k */
  const SIDE = { torso: 'M -38 -94 Q 0 -104 32 -92 Q 42 -86 40 -70 L 34 14 Q 0 24 -36 14 L -44 -70 Q -46 -88 -38 -94 Z', head: [8, -134, 31], armOver: true };
  const stand = sd => ({ h: [sd * 6, 8], k: [sd * 10, 88], f: [sd * 14, 166] });
  const stride = sd => sd < 0 ? { h: [-6, 8], k: [-30, 86], f: [-62, 166] } : { h: [6, 8], k: [34, 84], f: [44, 166] };
  function person(q, x, fy, k, arm, o = {}) { const g = q.child({ transform: `translate(${x} ${f1(fy - 166 * k)}) rotate(${o.lean || 0} 0 166) scale(${k})` }, k);
    g.H = q.H; g.motion = q.motion;
    const far = o.far || { s: [arm.s[0] - 8, arm.s[1] + 2], e: [arm.e[0] - 14, arm.e[1] + 10], h: [arm.h[0] - 18, arm.h[1] + 12] }, fa = sub(g);   // the far arm, behind the body
    [[far.s, far.e, 25], [far.e, far.h, 23]].forEach(([a, b, wd]) => fa.line(...a, ...b, { sw: wd + 7 })); [[far.s, far.e, 25], [far.e, far.h, 23]].forEach(([a, b, wd]) => fa.line(...a, ...b, { sw: wd, stroke: C.fill }));
    /* the near arm lies over the body with its own outline (seams at the shoulder and elbow — user: "เปลี่ยนกลับไปมีรอยต่อเหมือนเดิมดีกว่า") */
    return G.parts.human(g, 'line', Object.assign({}, SIDE, { arm: () => arm, leg: o.leg || stand })); }

  const V = [];
  const variant = (id, th, build) => V.push({ id, th, build });
  const ground = (p, y = 300) => floor(p, y);
  /* the goal on a round token (it travels, floats, hangs …): disc + the goal's picture; its label under it */
  function token(q, c, S0, x, y, r, ly, o = {}) { q.circle(x, y, r, F(3.4)); goalAt(q, c, S0, x, y, r * 1.45, ly, o); }
  const halo = (q, x, y, r) => { q.circle(x, y, r, { fill: 'rgba(255,255,255,.06)', sw: 0, stroke: 'none' }); q.circle(x, y, r, S(1.8)); };

  /* 01 ── DOMINOES: one push and the row falls, the last one knocks the goal's token off its post into the light */
  variant('domino', 'โดมิโนล้มต่อกัน', (d, c) => { const S0 = st(d);
    art(c, p => { ground(p); const B = sub(p); atT(B, p, 0);
      person(B, -440, 300, .8, { s: [4, -76], e: [56, -58], h: [110, -66] }, { lean: 10, leg: stride });                // the one who gave the push
      for (let i = 0; i < 6; i++) { const x = -318 + i * 86, g = rot(B, 58, x + 22, 296); R(g, x, 136, 44, 160, 8, F(3)); g.circle(x + 22, 176, 7, W(2)); g.circle(x + 22, 252, 7, W(2)); }   // fallen row
      R(B, 250, 210, 40, 86, 6, F(2.8)); halo(B, 300, 30, 150);                                                                // post
      token(B, c, S0, 300, 30, 115, -170); }); });

  /* 02 ── MARBLE RAMP: the goal's token rolls down the curved ramp and settles in the cradle at the bottom */
  variant('ramp', 'รางกลิ้งลงแอ่ง', (d, c) => { const S0 = st(d);
    art(c, p => { ground(p); const B = sub(p); atT(B, p, 0);
      B.path('M -460 -250 C -220 -250, -150 160, 120 168 L 440 168', { sw: 14 }); B.path('M -460 -250 C -220 -250, -150 160, 120 168 L 440 168', { sw: 8, stroke: C.fill });   // the ramp
      [-400, -150, 120, 380].forEach((x, i) => R(B, x - 8, [-236, 60, 180, 180][i], 16, 300 - [-236, 60, 180, 180][i], 4, F(2.4)));   // legs
      B.path('M 170 168 Q 270 240 370 168', { sw: 10 });                                                                       // the cradle (dip)
      token(B, c, S0, 270, 88, 108, -60);
      whoAt(p, c, S0, -400, -330, 100); }); });

  /* 03 ── BRIDGE: the last plank drops into place and the goal across the gap is reached */
  variant('bridge', 'สะพานต่อถึง', (d, c) => { const S0 = st(d);
    art(c, p => { const B = sub(p); atT(B, p, 0);
      B.path('M -470 160 L -230 160 L -260 300 L -470 300 Z', F(3.4)); B.path('M 470 160 L 230 160 L 260 300 L 470 300 Z', F(3.4));   // cliffs
      const pl = []; for (let i = 0; i < 7; i++) { const x = -222 + i * 64, y = 162 + 26 * Math.sin(Math.PI * (i + .5) / 7); pl.push([x + 28, y]); R(B, x, y - 8, 56, 18, 5, F(2.6)); }   // planks
      B.path('M -230 100 Q 0 150 230 100', S(2.2)); [-230, 230].forEach(x => R(B, x - 6, 90, 12, 72, 3, F(2.4)));             // hand rope + posts
      goalAt(p, c, S0, 350, 30, 190, null); if (S0.goal) lab(sub(p), S0.goal, 350, 250, {});
      whoAt(p, c, S0, 250, 70, 100); }); });

  /* 04 ── CRADLE: the swinging balls pass the knock along and the last one rings the goal */
  variant('cradle', 'ลูกตุ้มส่งแรง', (d, c) => { const S0 = st(d);
    art(c, p => { ground(p); const B = sub(p); atT(B, p, 0);
      R(B, -262, -250, 434, 24, 10, F(3)); B.line(-250, -226, -280, 296, W(4)); B.line(160, -226, 190, 296, W(4));           // frame
      for (let i = 0; i < 4; i++) { const x = -150 + i * 84; B.line(x - 20, -226, x, 80, S(1.8)); B.line(x + 20, -226, x, 80, S(1.8)); B.circle(x, 80, 42, F(3.2)); }   // balls
      person(B, -415, 300, .8, { s: [4, -76], e: [52, -94], h: [104, -102] });                                              // the one who let the first ball go
      halo(B, 340, -20, 150); token(B, c, S0, 340, -20, 112, 190); }); });

  /* 05 ── RIPPLE: a drop falls, the rings spread on the surface and the goal rises from the middle */
  variant('ripple', 'หยดน้ำกระเพื่อม', (d, c) => { const S0 = st(d);
    art(c, p => { const B = sub(p); atT(B, p, 0);
      [[380, 82, S(1.6)], [270, 58, S(2)], [160, 34, W(2.6)]].forEach(([rx, ry, o]) => B.ellipse(0, 210, rx, ry, o));
      goalAt(p, c, S0, 0, -30, 250, null); if (S0.goal) lab(sub(p), S0.goal, 0, -200, {});
      whoAt(p, c, S0, -400, -230, 110); }); });

  /* 06 ── CONSTELLATION: dots join up one after another and close a ring round the goal */
  variant('connect', 'ลากเส้นต่อจุด', (d, c) => { const S0 = st(d), n = 9, R0 = 250, y0 = -30;
    art(c, p => { const B = sub(p); atT(B, p, 0);
      const pts = []; for (let i = 0; i < n; i++) { const a = rad(-90 + i * 360 / n), r = R0 * (i % 2 ? .93 : 1.04); pts.push([f1(Math.cos(a) * r), f1(y0 + Math.sin(a) * r)]); }
      B.shape(pts, { sw: 2.6 }); pts.forEach(([x, y]) => B.circle(x, y, 14, { fill: C.ink, sw: 1.6 }));
      goalAt(p, c, S0, 0, y0, 230, null); if (S0.goal) lab(sub(p), S0.goal, 0, 320, {});
      whoAt(p, c, S0, -400, 200, 110); }); });

  /* 07 ── SPRING PADS: the ball (or who) bounces pad to pad, higher each time, and lands beside the goal */
  variant('bounce', 'กระโดดแป้นสปริง', (d, c) => { const S0 = st(d);
    const pad = (q, x, y, h) => { q.path(`M ${x - 12} ${y + h} ` + [1, 2, 3, 4].map(k => `L ${x + (k % 2 ? 12 : -12)} ${y + h - k * h / 4}`).join(' '), W(3)); R(q, x - 60, y - 14, 120, 18, 7, F(3)); R(q, x - 40, y + h, 80, 14, 5, F(2.6)); };
    art(c, p => { ground(p); const B = sub(p); atT(B, p, 0);
      pad(B, -330, 200, 86); pad(B, -80, 90, 196);
      R(B, 160, -60, 300, 22, 8, F(3.2)); R(B, 296, -38, 28, 334, 6, F(2.8));                                                  // the top platform
      goalAt(p, c, S0, 370, -170, 180, null); if (S0.goal) lab(sub(p), S0.goal, 400, 30, { maxW: 130, size: 36 });
      if (S0.who) whoAt(p, c, S0, 220, -130, 110); else { const g = sub(p); atT(g, p, 0); g.circle(220, -96, 34, { fill: C.ink, sw: 2 }); } }); });

  /* 08 ── GEARS: the gears turn and the rack lifts the goal's platform to the top */
  variant('gears', 'เฟืองหมุนยก', (d, c) => { const S0 = st(d);
    const gear = (q, x, y, r, n) => { let D = ''; for (let i = 0; i < n * 2; i++) { const a0 = i * Math.PI / n, a1 = (i + 1) * Math.PI / n, rr = i % 2 ? r : r + 18, m = (a0 + a1) / 2;
        D += `${i ? 'L' : 'M'} ${f1(x + Math.cos(a0 + .06) * rr)} ${f1(y + Math.sin(a0 + .06) * rr)} L ${f1(x + Math.cos(a1 - .06) * rr)} ${f1(y + Math.sin(a1 - .06) * rr)} `; }
      q.path(D + 'Z', F(3.2)); q.circle(x, y, r * .32, F(2.6)); q.circle(x, y, 8, W(2)); };
    art(c, p => { ground(p); const B = sub(p); atT(B, p, 0);
      gear(B, -250, 160, 100, 10); gear(B, -78, 104, 60, 7);
      R(B, -4, -150, 36, 446, 6, F(3)); for (let y = -120; y < 280; y += 34) B.line(-4, y, -22, y + 10, W(2.4));                // rack
      R(B, -4, -172, 380, 26, 8, F(3.2));                                                                                      // platform
      goalAt(p, c, S0, 220, -270, 170, null); if (S0.goal) lab(sub(p), S0.goal, 230, -100, {});
      whoAt(p, c, S0, -400, -230, 110); }); });

  /* 09 ── PULLEY: the rope is hauled and the goal rises to the wheel at the top */
  variant('pulley', 'รอกดึงขึ้น', (d, c) => { const S0 = st(d), wx = 160, wy = -280;
    art(c, p => { ground(p); const B = sub(p); atT(B, p, 0);
      B.line(-470, -330, 470, -330, S(2)); R(B, wx - 10, -330, 20, 30, 4, F(2.6)); B.circle(wx, wy, 52, F(3.2)); B.circle(wx, wy, 14, W(2.4));   // ceiling, bracket, wheel
      B.line(wx - 52, wy, wx - 52, 34, W(3)); B.path(`M ${wx - 52} 34 Q ${wx - 30} 240 ${wx + 20} 290 Q ${wx + 50} 300 ${wx + 80} 292`, W(3));   // rope down to the hands, slack on the floor
      B.line(wx + 52, wy, wx + 52, -150, W(3)); R(B, wx - 50, -150, 204, 16, 6, F(2.8));                                     // the goal's side + its seat
      person(B, wx - 52 - 7, 300, .8, { s: [4, -76], e: [46, -118], h: [78, -158] }, { lean: -12, leg: sd => sd < 0 ? { h: [-6, 8], k: [-22, 88], f: [-34, 166] } : { h: [6, 8], k: [42, 80], f: [70, 160] } });   // hauling
      goalAt(p, c, S0, wx + 52, -70, 170, null); if (S0.goal) lab(sub(p), S0.goal, wx + 140, 40, { anchor: 'start', maxW: 170 }); }); });

  /* 10 ── BRIM: the glass fills to the brim and the goal floats up to the top */
  variant('brim', 'น้ำเต็มแก้ว', (d, c) => { const S0 = st(d), x = S0.who ? 90 : 0;
    art(c, p => { ground(p); const B = sub(p); atT(B, p, 0);
      B.path(`M ${x - 200} -120 L ${x - 170} 290 Q ${x - 168} 300 ${x - 158} 300 L ${x + 158} 300 Q ${x + 168} 300 ${x + 170} 290 L ${x + 200} -120`, F(3.4));   // the glass
      B.path(`M ${x - 194} -100 Q ${x - 140} -116 ${x - 80} -100 T ${x + 40} -100 T ${x + 160} -100 L ${x + 194} -100 L ${x + 166} 280 L ${x - 166} 280 Z`, { fill: 'rgba(255,255,255,.12)', sw: 2.2 });   // water to the brim
      goalAt(p, c, S0, x, -190, 190, 130);
      whoAt(p, c, S0, -380, 190, 140); }); });

  /* 11 ── FISHING: the line is reeled in and the goal comes up out of the water on the hook */
  variant('fishing', 'ตกเบ็ดได้', (d, c) => { const S0 = st(d), hx = 280, hy = -150;
    art(c, p => { const B = sub(p); atT(B, p, 0); B.line(-470, 300, 40, 300, S(2));
      B.path('M 60 210 Q 170 190 280 210 T 470 210', S(2.4)); B.path('M 120 250 Q 220 236 320 250 T 470 250', S(1.6));       // water
      person(B, -427, 300, .8, { s: [4, -76], e: [44, -40], h: [86, -60] });                                                   // the angler
      B.path(`M -420 230 Q -230 -120 ${hx - 150} -300`, { sw: 9 }); B.circle(-356, 132, 24, F(2.8)); B.line(-356, 132, -330, 112, W(2.4));   // rod + reel
      B.line(hx - 150, -300, hx, hy - 80, S(2)); B.path(`M ${hx} ${hy - 80} L ${hx} ${hy - 50} Q ${hx} ${hy - 26} ${hx + 18} ${hy - 32}`, W(3.2));   // line + hook
      goalAt(p, c, S0, hx, hy + 50, 190, null); if (S0.goal) lab(sub(p), S0.goal, hx, 80, {}); }); });

  /* 12 ── CABLE CAR: the gondola climbs the cable and docks at the top station with the goal */
  variant('cablecar', 'กระเช้าถึงสถานี', (d, c) => { const S0 = st(d), gx = 170, gy = -40;
    art(c, p => { ground(p); const B = sub(p); atT(B, p, 0);
      B.line(-470, 150, 470, -250, W(3));                                                                                       // cable
      R(B, 380, -260, 40, 556, 6, F(3)); R(B, 340, -290, 130, 40, 8, F(3)); R(B, -460, 150, 40, 146, 6, F(3));                  // towers
      const ty = 150 - (gx + 470) * 400 / 940; B.circle(gx, ty, 14, F(2.6)); B.line(gx, ty, gx, gy - 100, W(4));               // hanger
      R(B, gx - 120, gy - 100, 240, 210, 30, F(3.4)); R(B, gx - 120, gy - 100, 240, 26, 13, F(2.8));
      goalAt(p, c, S0, gx, gy + 18, 150, null); if (S0.goal) lab(sub(p), S0.goal, gx, gy + 170, {});
      whoAt(p, c, S0, -320, 200, 130); }); });

  /* 13 ── SEESAW CATAPULT: a weight drops on one end and the goal flies up onto the high ledge */
  variant('catapult', 'กระดานดีดขึ้นหิ้ง', (d, c) => { const S0 = st(d);
    art(c, p => { ground(p); const B = sub(p); atT(B, p, 0);
      B.path('M -150 296 L -100 210 L -50 296 Z', F(3.2)); const g = rot(B, -16, -100, 206); R(g, -400, 196, 600, 22, 8, F(3.2));   // pivot + board (weight end down)
      R(B, -390, 168, 90, 60, 10, F(3.2));                                                                                      // the weight
      R(B, 200, -110, 270, 24, 8, F(3.2)); B.line(440, -86, 440, 296, W(4));                                                   // the high ledge + its post
      goalAt(p, c, S0, 320, -210, 180, null); if (S0.goal) lab(sub(p), S0.goal, 330, -40, {});
      whoAt(p, c, S0, -340, 50, 120); }); });

  /* 14 ── WIND-UP WALKER: the key turns, the little walker toddles over and stops at the goal */
  variant('windup', 'ตัวเดินไขลาน', (d, c) => { const S0 = st(d), x = 60;
    art(c, p => { ground(p); const B = sub(p); atT(B, p, 0);
      B.ellipse(x, 140, 110, 100, F(3.4)); B.circle(x + 40, 110, 12, { fill: C.ink, sw: 1.6 });                                 // body + eye
      R(B, x - 60, 230, 40, 66, 12, F(3)); R(B, x + 20, 230, 40, 66, 12, F(3));                                                 // feet
      B.line(x - 110, 130, x - 160, 130, W(5)); B.path(`M ${x - 160} 100 Q ${x - 200} 100 ${x - 200} 130 Q ${x - 200} 160 ${x - 160} 160 Q ${x - 180} 130 ${x - 160} 100 Z`, F(2.8));   // key
      goalAt(p, c, S0, 330, 150, 200, null); if (S0.goal) lab(sub(p), S0.goal, 330, -20, {});
      if (S0.who) whoAt(p, c, S0, x, -40, 110); }); });

  /* 15 ── TRAMPOLINE: a bounce on the trampoline sends the jumper (or ball) up to the goal */
  variant('trampoline', 'แทรมโพลีนส่งขึ้น', (d, c) => { const S0 = st(d);
    art(c, p => { ground(p); const B = sub(p); atT(B, p, 0);
      B.ellipse(-180, 200, 200, 34, F(3.2)); B.ellipse(-180, 200, 160, 22, S(1.6)); [-340, -20, -180].forEach(x => B.line(x, 220, x, 296, W(4)));   // trampoline
      halo(B, 250, -170, 140);
      goalAt(p, c, S0, 250, -170, 190, 10);
      if (S0.who) whoAt(p, c, S0, 60, -150, 120); else { const g = sub(p); atT(g, p, 0); g.circle(70, -130, 36, { fill: C.ink, sw: 2 }); } }); });

  /* 16 ── PAPER PLANE: the plane loops across and glides down to land by the goal */
  variant('plane', 'เครื่องบินกระดาษร่อนลง', (d, c) => { const S0 = st(d), px = 120, py = 180;
    art(c, p => { ground(p); const B = sub(p); atT(B, p, 0);
      B.path(`M -460 -60 C -300 -300, -80 -260, -160 -120 C -240 0, -60 40, ${px - 120} ${py - 30}`, S(2.2));                  // flight path
      B.path(`M ${px + 90} ${py} L ${px - 110} ${py - 60} L ${px - 40} ${py + 6} Z`, F(3)); B.path(`M ${px + 90} ${py} L ${px - 40} ${py + 6} L ${px - 70} ${py + 40} Z`, F(3));   // the plane, landed
      goalAt(p, c, S0, 340, 130, 200, null); if (S0.goal) lab(sub(p), S0.goal, 340, -20, {});
      whoAt(p, c, S0, -400, 200, 110); }); });

  /* 17 ── PAPER BOAT: the paper boat carrying the goal drifts across and reaches the shore */
  variant('boat', 'เรือกระดาษถึงฝั่ง', (d, c) => { const S0 = st(d), bx = 120;
    art(c, p => { const B = sub(p); atT(B, p, 0);
      B.path('M 300 140 L 470 140 L 470 300 L 330 300 Z', F(3.4));                                                             // the shore
      B.path(`M -470 170 Q -380 150 -290 170 T -110 170 T 70 170 T 250 170 L 310 170`, S(2.4)); B.path('M -440 230 Q -350 214 -260 230 T -80 230 T 100 230 T 280 230', S(1.6));   // water
      B.path(`M ${bx - 170} 100 L ${bx + 170} 100 L ${bx + 110} 170 L ${bx - 110} 170 Z`, F(3.4)); B.path(`M ${bx - 90} 100 L ${bx} -10 L ${bx + 90} 100`, F(3));   // hull + paper sail fold
      goalAt(p, c, S0, bx, -100, 150, null); if (S0.goal) lab(sub(p), S0.goal, bx, -210, {});
      whoAt(p, c, S0, 390, 60, 120); }); });

  /* 18 ── KITE: the kite climbs on the wind with the goal on it */
  variant('kite', 'ว่าวขึ้นสูง', (d, c) => { const S0 = st(d), kx = 200, ky = -150, hx = -358, hy = 18;
    art(c, p => { ground(p); const B = sub(p); atT(B, p, 0);
      B.path(`M ${kx} ${ky - 190} L ${kx + 150} ${ky - 10} L ${kx} ${ky + 170} L ${kx - 150} ${ky - 10} Z`, F(3.4)); B.line(kx, ky - 190, kx, ky + 170, S(1.4)); B.line(kx - 150, ky - 10, kx + 150, ky - 10, S(1.4));
      B.path(`M ${kx} ${ky + 170} Q ${kx - 30} ${ky + 230} ${kx + 10} ${ky + 270} Q ${kx + 40} ${ky + 310} ${kx} ${ky + 360}`, S(2)); [[kx - 22, ky + 230], [kx + 22, ky + 300]].forEach(([x, y]) => B.path(`M ${x - 16} ${y - 10} L ${x + 16} ${y + 10} M ${x + 16} ${y - 10} L ${x - 16} ${y + 10}`, W(2.6)));   // tail + bows
      B.path(`M ${kx} ${ky + 20} Q -120 -10 ${hx} ${hy}`, S(1.8));                                                              // string, down to the hand
      person(B, -400, 300, .8, { s: [4, -76], e: [30, -130], h: [52, -186] });                                                // the one flying it
      goalAt(p, c, S0, kx, ky - 10, 150, null); if (S0.goal) lab(sub(p), S0.goal, kx + 170, ky + 120, { anchor: 'start', maxW: 140 }); }); });

  /* 19 ── ZIPPER: the zip runs open and the goal shows through the opening */
  variant('zipper', 'ซิปรูดเปิด', (d, c) => { const S0 = st(d), x = S0.who ? 80 : 0;
    art(c, p => { const B = sub(p); atT(B, p, 0);
      [-1, 1].forEach(s => { B.path(`M ${x + s * 6} 280 C ${x + s * 30} 120, ${x + s * 230} 40, ${x + s * 240} -320`, { sw: 22 }); B.path(`M ${x + s * 6} 280 C ${x + s * 30} 120, ${x + s * 230} 40, ${x + s * 240} -320`, { sw: 14, stroke: C.fill }); });   // the two sides of the zip
      [-1, 1].forEach(s => { const P = t => { const u = 1 - t; return [u * u * u * (x + s * 6) + 3 * u * u * t * (x + s * 30) + 3 * u * t * t * (x + s * 230) + t * t * t * (x + s * 240), u * u * u * 280 + 3 * u * u * t * 120 + 3 * u * t * t * 40 + t * t * t * -320]; };
        for (let k = 1; k < 16; k++) { const t = k / 16, [ax, ay] = P(t), [bx, by] = P(t + .01), L = Math.hypot(bx - ax, by - ay), nx = -(by - ay) / L * s, ny = (bx - ax) / L * s;
          B.line(f1(ax - nx * 4), f1(ay - ny * 4), f1(ax - nx * 22), f1(ay - ny * 22), W(3)); } });                                     // the teeth (inner side)
      R(B, x - 26, 270, 52, 30, 8, F(2.6)); R(B, x - 40, 210, 80, 60, 14, F(3.2)); R(B, x - 18, 270, 36, 50, 12, F(2.6));        // slider + pull, at the bottom
      goalAt(p, c, S0, x, -150, 210, 20, { lab: { maxW: 170, size: 36 } });
      whoAt(p, c, S0, -390, 200, 130); }); });

  /* 20 ── SWING: the swing rises higher and higher and at the top of the arc touches the goal */
  variant('swing', 'ชิงช้าแกว่งถึง', (d, c) => { const S0 = st(d), px = -120, py = -250, L = 360, a = -62;
    art(c, p => { ground(p); const B = sub(p); atT(B, p, 0);
      R(B, -380, -270, 520, 24, 10, F(3)); B.line(-370, -246, -440, 296, W(4)); B.line(130, -246, 200, 296, W(4));              // frame
      const sx = px + Math.sin(rad(-a)) * L, sy = py + Math.cos(rad(a)) * L;
      B.line(px - 30, py, sx - 30, sy, S(2)); B.line(px + 30, py, sx + 30, sy, S(2)); R(B, sx - 60, sy, 120, 18, 6, F(3));     // ropes + seat, swung up
      halo(B, 370, -170, 130); goalAt(p, c, S0, 370, -170, 170, 10);
      whoAt(p, c, S0, sx, sy - 60, 110); }); });


  /* ---------- redesign options (user 2026-11-13: "10, 20 design ใหม่") — three ways each ---------- */
  const ALT = {}; const alt = (n, id, th, build) => (ALT[n] = ALT[n] || []).push({ id, th, build });
  /* 10A ── SCISSOR LIFT: the scissor arms open and raise the goal's platform to the top */
  alt(10, 'scissor', 'ลิฟต์กรรไกรยกขึ้น', (d, c) => { const S0 = st(d), x = S0.who ? 80 : 0;
    art(c, p => { ground(p); const B = sub(p); atT(B, p, 0);
      R(B, x - 190, 262, 380, 34, 10, F(3.2)); [x - 150, x + 150].forEach(xx => B.circle(xx, 296, 14, F(2.6)));               // base + wheels
      const lv = [262, 150, 38, -74]; for (let i = 0; i < 3; i++) { const y0 = lv[i], y1 = lv[i + 1]; B.line(x - 150, y0, x + 150, y1, { sw: 14 }); B.line(x - 150, y0, x + 150, y1, { sw: 8, stroke: C.fill });
        B.line(x + 150, y0, x - 150, y1, { sw: 14 }); B.line(x + 150, y0, x - 150, y1, { sw: 8, stroke: C.fill }); B.circle(x, (y0 + y1) / 2, 9, F(2.4)); }   // the scissor arms
      R(B, x - 200, -100, 400, 28, 8, F(3.2));                                                                                 // platform
      goalAt(p, c, S0, x, -200, 180, null); if (S0.goal) lab(sub(p), S0.goal, x + 210, -150, { anchor: 'start', maxW: 170 });
      whoAt(p, c, S0, -390, 200, 120); }); });
  /* 10B ── BUBBLE: a bubble rises from the bottom carrying the goal up to the surface */
  alt(10, 'bubble', 'ฟองลอยขึ้น', (d, c) => { const S0 = st(d), x = S0.who ? 80 : 0;
    art(c, p => { const B = sub(p); atT(B, p, 0);
      B.path(`M -470 -250 Q -350 -270 -230 -250 T 10 -250 T 250 -250 T 470 -250`, S(2.4));                                    // the surface
      B.circle(x, -60, 170, { fill: 'rgba(255,255,255,.05)', sw: 3 }); B.path(`M ${x - 120} -120 A 130 130 0 0 1 ${x - 40} -180`, S(2));   // the bubble (a curve of shine along its edge)
      [[x - 60, 200, 34], [x + 40, 270, 20], [x - 20, 320, 12]].forEach(([xx, yy, r]) => B.circle(xx, yy - 40, r, { fill: 'rgba(255,255,255,.05)', sw: 2.2 }));
      goalAt(p, c, S0, x, -60, 200, 150);
      whoAt(p, c, S0, -390, 200, 120); }); });
  /* 10C ── POP-UP BOX: the lid flips open and the spring pops the goal up out of the box */
  alt(10, 'popup', 'กล่องเด้ง', (d, c) => { const S0 = st(d), x = S0.who ? 80 : 0;
    art(c, p => { ground(p); const B = sub(p); atT(B, p, 0);
      B.path(`M ${x - 170} 90 L ${x - 210} -40 L ${x + 130} -40 L ${x + 170} 90 Z`, F(3));                                   // lid, flipped open (back)
      let z = `M ${x} 90`; for (let i = 1; i <= 6; i++) z += ` L ${x + (i % 2 ? 34 : -34)} ${90 - i * 30}`; B.path(z + ` L ${x} -110`, W(4));   // spring
      R(B, x - 170, 90, 340, 206, 14, F(3.4));                                                                                 // box
      token(B, c, S0, x, -200, 112, null); if (S0.goal) lab(sub(p), S0.goal, x, 200, {});
      whoAt(p, c, S0, -390, 200, 120); }); });
  /* 20A ── PARACHUTE: the goal floats down under its parachute and lands on the mark */
  alt(20, 'parachute', 'ร่มชูชีพลงจุด', (d, c) => { const S0 = st(d), x = S0.who ? 80 : 0;
    art(c, p => { ground(p); const B = sub(p); atT(B, p, 0);
      B.ellipse(x, 296, 180, 22, S(2));                                                                                         // the landing mark
      let cn = `M ${x - 230} -170 Q ${x - 230} -330 ${x} -330 Q ${x + 230} -330 ${x + 230} -170`; for (let i = 0; i < 4; i++) { const a = x + 230 - i * 115; cn += ` Q ${a - 57} -200 ${a - 115} -170`; }
      B.path(cn + ' Z', F(3.4)); [-115, 0, 115].forEach(dx => B.path(`M ${x + dx} -175 Q ${x + dx * .9} -280 ${x} -330`, S(1.6)));   // canopy + seams
      [-230, -115, 115, 230].forEach(dx => B.line(x + dx, -170, x + dx * .28, 110, S(1.6)));                                   // lines
      token(B, c, S0, x, 180, 110, null); if (S0.goal) lab(sub(p), S0.goal, x + 250, 200, { anchor: 'start', maxW: 170 });
      whoAt(p, c, S0, -390, 200, 120); }); });
  /* 20B ── CONVEYOR: the belt carries the goal's token to the end and it drops into the cradle */
  alt(20, 'conveyor', 'สายพานส่งลงแอ่ง', (d, c) => { const S0 = st(d);
    art(c, p => { ground(p); const B = sub(p); atT(B, p, 0);
      R(B, -460, -60, 560, 60, 30, F(3.2)); [-430, -280, -130, 20, 70].forEach(x => B.circle(x, -30, 18, W(2.4)));             // belt + rollers
      [-400, 40].forEach(x => R(B, x - 10, 0, 20, 296, 5, F(2.6)));                                                             // legs
      B.path('M 170 170 Q 300 290 430 170', { sw: 12 }); B.path('M 170 170 Q 300 290 430 170', { sw: 6, stroke: C.fill }); [190, 410].forEach(x => R(B, x - 8, 178, 16, 118, 5, F(2.4)));   // the cradle
      token(B, c, S0, 300, 120, 105, -60);
      whoAt(p, c, S0, -260, -200, 110); }); });
  /* 20C ── STATION: the little train pulls in under the station sign that shows the goal */
  alt(20, 'station', 'รถไฟถึงสถานี', (d, c) => { const S0 = st(d), sx = 230;
    art(c, p => { const B = sub(p); atT(B, p, 0);
      B.line(-470, 290, 470, 290, W(3)); for (let x = -440; x <= 440; x += 70) R(B, x - 20, 290, 40, 10, 3, F(2));              // rail + sleepers
      R(B, 40, 214, 430, 30, 6, F(3));                                                                                         // platform
      R(B, sx - 10, -110, 20, 324, 5, F(2.8)); R(B, sx - 150, -300, 300, 200, 18, F(3.4));                                      // sign post + sign
      goalAt(p, c, S0, sx, -230, 120, -130, { lab: { maxW: 260, size: 38 } });
      R(B, -330, 110, 280, 150, 26, F(3.4)); R(B, -300, 130, 90, 60, 10, F(2.6)); R(B, -190, 130, 90, 60, 10, F(2.6));         // car
      B.path('M -40 260 L -40 120 Q -40 70 10 70 L 70 70 Q 110 70 110 130 L 110 260 Z', F(3.4)); R(B, -10, 96, 70, 56, 10, F(2.6));   // front car (driver's cab)
      [-280, -100, 0, 80].forEach(x => B.circle(x, 270, 22, F(3))); R(B, -60, 220, 30, 14, 4, F(2.4));                        // wheels, coupling
      whoAt(p, c, S0, 340, 140, 110); }); });

  /* samples from unrelated topics (neutrality) + a stress set */
  const I = (icon, label) => label ? { icon, label } : { icon };
  const SAMPLES = [
    { say: 'สอบติดคณะที่อยากเข้า', goal: I('graduation-cap', 'สอบติด'), who: 'user' },
    { say: 'ยอดขายถึงเป้าเดือนนี้', goal: I('store', 'ถึงเป้า') },
    { say: 'เก็บเงินครบล้านแรก', goal: I('piggy-bank', 'ล้านแรก') },
    { say: 'ปีนถึงยอดเขาจนได้', goal: I('mountain', 'ถึงยอด'), who: 'user' },
    { say: 'ได้บ้านหลังแรก', goal: I('house', 'บ้านหลังแรก') },
    { say: 'ลดน้ำหนักได้สิบโล', goal: I('scale', 'ลดได้ 10 โล') },
    { say: 'ซ่อมจนรถติดเครื่อง', goal: I('car', 'ติดเครื่อง'), who: 'wrench' },
    { say: 'ทีมชนะการแข่งขัน', goal: I('trophy', 'ชนะ'), who: 'users' },
    { say: 'เดินทางถึงญี่ปุ่นแล้ว', goal: I('plane', 'ถึงญี่ปุ่น'), who: 'user' },
    { say: 'เปิดร้านกาแฟได้สำเร็จ', goal: I('coffee', 'ร้านกาแฟ') },
    { say: 'วิ่งมาราธอนจนจบ', goal: I('flag', 'จบมาราธอน'), who: 'user' },
    { say: 'แบตชาร์จเต็มแล้ว', goal: I('battery-full', 'เต็ม') },
    { say: 'ต้นไม้โตจนออกดอก', goal: I('flower', 'ออกดอก'), who: 'sprout' },
    { say: 'ได้งานที่ใฝ่ฝัน', goal: I('briefcase', 'งานในฝัน'), who: 'user' },
    { say: 'สร้างเว็บเสร็จทันกำหนด', goal: I('laptop', 'เสร็จทัน') },
    { say: 'ผู้ติดตามครบหมื่นคน', goal: I('users', 'หมื่นคน') },
    { say: 'อ่านหนังสือจบร้อยเล่ม', goal: I('book-open', 'ครบร้อยเล่ม') },
    { say: 'หายป่วยกลับมาแข็งแรง', goal: I('heart-pulse', 'แข็งแรง'), who: 'user' },
    { say: 'เรียนจบได้เกียรตินิยม', goal: I('award', 'เกียรตินิยม') },
    { say: 'ใจสงบในที่สุด', goal: I('smile', 'ใจสงบ') },
  ];
  const STRESS = [
    { say: 'ไม่มีป้าย', goal: I('target') },
    { say: 'ไม่มีป้าย + คน', goal: I('house'), who: 'user' },
    { say: 'ป้ายยาว', goal: I('graduation-cap', 'ได้ทุนเรียนต่อต่างประเทศ'), who: 'user' },
    { say: 'ภาษาอังกฤษ', goal: I('rocket', 'Launch day') },
    { say: 'ไม่มีไอคอน (ป้ายแทนภาพ)', goal: { label: 'อิสรภาพ' } },
    { say: 'ไม่มีไอคอน + คน', goal: { label: 'ปลดหนี้' }, who: 'user' },
    { say: 'ชื่อไอคอนที่ไม่มี', goal: I('no-such-icon', 'ความฝัน') },
    { say: 'who ที่ไม่มีจริง', goal: I('trophy', 'แชมป์'), who: 'no-such-who' },
    { say: 'ความรู้สึก', goal: I('smile', 'มีความสุข'), who: 'user' },
    { say: 'สภาพ', goal: I('battery-full', 'พลังเต็ม') },
    { say: 'ตัวเลขในป้าย', goal: I('coins', '1,000,000 บาท'), who: 'user' },
    { say: 'อังกฤษยาว', goal: I('briefcase', 'Dream job at last'), who: 'user' },
    { say: 'ของ', goal: I('car', 'รถคันแรก'), who: 'user' },
    { say: 'กลุ่มคน', goal: I('trophy', 'แชมป์ลีก'), who: 'users' },
    { say: 'ป้ายสั้นมาก', goal: I('star', 'สุด') },
    { say: 'ป้ายแทนภาพยาว', goal: { label: 'สุขภาพดีทั้งครอบครัว' } },
    { say: 'ไม่มีป้าย + ทีม', goal: I('flag'), who: 'users' },
    { say: 'เวลา', goal: I('clock', 'ทันเวลา'), who: 'user' },
    { say: 'สถานที่', goal: I('map-pin', 'ถึงที่หมาย'), who: 'user' },
    { say: 'ป้ายตัวเลข + ไม่มีคน', goal: I('chart-line', 'โต 200%') },
  ];

  G.cats = G.cats || {};
  G.cats.B08 = { variants: V, SAMPLES, STRESS, draw: (i, d, c) => { setZ(c); CUR = V[i].id; V[i].build(d, c); }, CLAMPS, timing: c => (setZ(c), Object.assign({}, Z)),
    ALT, drawAlt: (n, k, d, c) => { setZ(c); CUR = ALT[n][k].id; ALT[n][k].build(d, c); } };
})();
