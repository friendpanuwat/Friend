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
    if (o.punch) kf(a.g, at, { ox: X, oy: Y, s: [[0, 1], [Z.H, 1], [aH(.07), 1.12, 'out'], [aH(.3), 1, 'soft']] });   // arrived: a little pulse on the keyword
    return a;
  }
  const lab = (q, it, x, y, o = {}) => it && it.label && picOf(it) ? txt(q, it.label, x, y, Object.assign({ maxW: 320, color: C.ink, weight: 700 }, o)) : null;
  /* the goal: picture + label */
  function goalAt(p, c, S0, x, y, w, ly, o = {}) { if (!S0.goal) return; pic(S0.goal, x, y, w, c, o);
    if (ly != null) { const lg = sub(p); if (o.labT != null) on(lg, p, 0, { o: [[0, 0], [o.labT, 0], [o.labT + tu(.15), 1]] }); lab(lg, S0.goal, x, ly, o.lab || {}); } }   // o.labT = when the label shows (a goal that travels)
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
  /* the goal on a round token (it travels, floats, hangs …): disc + the goal's picture */
  function token(q, c, S0, x, y, r, ly, o = {}) { q.circle(x, y, r, F(3.4)); goalAt(q, c, S0, x, y, r * 1.45, ly, o); }
  const halo = (q, x, y, r) => { q.circle(x, y, r, { fill: 'rgba(255,255,255,.06)', sw: 0, stroke: 'none' }); q.circle(x, y, r, S(1.8)); };
  /* a halo that blooms in on the keyword */
  function haloH(q, x, y, r) { const g = sub(q); on(g, q, 0, { ox: x, oy: y, s: [[0, .6], [Z.H, .6], [aH(.3), 1, 'out']], o: [[0, 0], [Z.H, 0], [aH(.12), 1]] }); halo(g, x, y, r); }
  /* the light celebration on the keyword: a ring blooms out from the goal and fades */
  function cheer(q, x, y, r) { const g = sub(q); on(g, q, 0, { ox: x, oy: y, s: [[0, .75], [Z.H, .75], [aH(.5), 1.4, 'out']], o: [[0, 0], [Z.H, 0], [aH(.04), .85], [aH(.5), 0]] }); g.circle(x, y, r, W(3)); }
  let CID = 0;
  function clipG(p, x, y, w, h) { const svg = p.g.ownerSVGElement, cp = document.createElementNS(NS, 'clipPath'), r = document.createElementNS(NS, 'rect');
    cp.id = 'b08clip' + (++CID); Object.entries({ x, y, width: w, height: h }).forEach(([k, v]) => r.setAttribute(k, v)); cp.appendChild(r);
    (svg.querySelector('defs') || svg).appendChild(cp); return sub(p, { 'clip-path': `url(#${cp.id})` }); }
  const bez = (a, b, c2, d, t) => { const u = 1 - t; return [u * u * u * a[0] + 3 * u * u * t * b[0] + 3 * u * t * t * c2[0] + t * t * t * d[0], u * u * u * a[1] + 3 * u * u * t * b[1] + 3 * u * t * t * c2[1] + t * t * t * d[1]]; };
  const lerp = (a, b, k) => a + (b - a) * k;
  /* tracks x, y (and r) from a list of [time, x, y, r?] points, relative to the final point (fx, fy) */
  function track(pts, fx, fy, e = 'lin') { const K = { x: [], y: [], r: [] }; pts.forEach(([t, x, y, r], i) => { K.x.push([t, f1(x - fx), i ? e : undefined]); K.y.push([t, f1(y - fy), i ? e : undefined]); K.r.push([t, f1(r || 0), i ? e : undefined]); });
    ['x', 'y', 'r'].forEach(n => K[n] = K[n].map(k => k[2] ? k : [k[0], k[1]])); return K; }

  /* 01 ── DOMINOES: a person gives the first domino a push, the row falls one after another and the last one knocks into the goal's post */
  variant('domino', 'โดมิโนล้มต่อกัน', (d, c) => { const S0 = st(d), H = Z.H;
    art(c, p => { ground(p); const B = sub(p); atT(B, p, 0);
      const hm = person(B, -440, 300, .8, { s: [4, -76], e: [56, -58], h: [110, -66] }, { lean: 10, leg: stride });
      hm.on('upper1', p, 0, { ox: 4, oy: -76, r: [[0, 48], [tu(.3), 48], [tu(.45), -6, 'out'], [tu(.6), 0, 'soft']] });   // the push
      const t0 = tu(.48), t1 = bH(.2);
      for (let i = 0; i < 6; i++) { const x = -318 + i * 86, ti = lerp(t0, t1, i / 5), g = mvG(B, { px: x + 22, py: 296, r: [[0, 0], [ti, 0], [ti + tu(.16), 58, 'in']] });
        R(g, x, 136, 44, 160, 8, F(3)); g.circle(x + 22, 176, 7, W(2)); g.circle(x + 22, 252, 7, W(2)); }
      const ps = mvG(B, { px: 270, py: 296, r: [[0, 0], [H - tu(.04), 0], [aH(.06), 5, 'out'], [aH(.2), 0, 'soft']] }); R(ps, 250, 210, 40, 86, 6, F(2.8));   // post (knocked)
      haloH(B, 300, 30, 150); B.circle(300, 30, 115, F(3.4)); goalAt(B, c, S0, 300, 30, 167, -170, { t: tu(.15), punch: true }); cheer(B, 300, 30, 150); }); });

  /* 02 ── RAMP: the goal's token rolls down the curved ramp, faster and faster, and rocks to rest in the cradle at the bottom */
  variant('ramp', 'รางกลิ้งลงแอ่ง', (d, c) => { const S0 = st(d), H = Z.H, fx = 270, fy = 88, r0 = 108;
    const P0 = [-460, -250], P1 = [-220, -250], P2 = [-150, 160], P3 = [120, 168], pts = [];
    for (let k = 0; k <= 8; k++) { const t = .14 + .86 * k / 8, [x, y] = bez(P0, P1, P2, P3, t), [x2, y2] = bez(P0, P1, P2, P3, Math.min(1, t + .01)), dx = x2 - x, dy = y2 - y, L = Math.hypot(dx, dy) || 1; pts.push([x + dy / L * r0, y - dx / L * r0]); }
    pts.push([170, 60]); let dist = 0; const T0 = tu(.3), T1 = H, n = pts.length + 1;
    const P = pts.concat([[fx, fy]]).map((q, i, a) => { if (i) dist += Math.hypot(q[0] - a[i - 1][0], q[1] - a[i - 1][1]); return [T0 + (T1 - T0) * Math.sqrt(i / (a.length - 1)), q[0], q[1], dist]; });
    const turns = 360 * Math.round(dist / (2 * Math.PI * r0)), K = track(P.map(([t, x, y, s]) => [t, x, y, s / dist * turns - turns]), fx, fy, 'lin');
    K.x.push([aH(.14), 14, 'out'], [aH(.3), -6, 'soft'], [aH(.44), 0, 'soft']); K.r.push([aH(.14), 8, 'out'], [aH(.3), -3, 'soft'], [aH(.44), 0, 'soft']);
    art(c, p => { ground(p); const B = sub(p); atT(B, p, 0);
      B.path('M -460 -250 C -220 -250, -150 160, 120 168 L 440 168', { sw: 14 }); B.path('M -460 -250 C -220 -250, -150 160, 120 168 L 440 168', { sw: 8, stroke: C.fill });   // the ramp
      [-400, -150, 120, 380].forEach((x, i) => R(B, x - 8, [-236, 60, 180, 180][i], 16, 300 - [-236, 60, 180, 180][i], 4, F(2.4)));   // legs
      B.path('M 170 168 Q 270 240 370 168', { sw: 10 });                                                                       // the cradle (dip)
      const tk = mvG(B, { px: fx, py: fy, x: K.x, y: K.y, r: K.r }); tk.circle(fx, fy, r0, F(3.4));
      goalAt(B, c, S0, fx, fy, r0 * 1.45, -60, { t: tu(.12), mv: { x: K.x, y: K.y, r: K.r }, punch: true, labT: H });
      cheer(B, fx, fy, 140);
      whoAt(p, c, S0, -400, -330, 100); }); });

  /* 03 ── BRIDGE: the planks drop into place one by one, the rope draws across, and who (if any) walks over to the goal */
  variant('bridge', 'สะพานต่อถึง', (d, c) => { const S0 = st(d), H = Z.H;
    art(c, p => { const B = sub(p); atT(B, p, 0);
      B.path('M -470 160 L -230 160 L -260 300 L -470 300 Z', F(3.4)); B.path('M 470 160 L 230 160 L 260 300 L 470 300 Z', F(3.4));   // cliffs
      [-230, 230].forEach(x => R(B, x - 6, 90, 12, 72, 3, F(2.4)));                                                            // posts
      for (let i = 0; i < 7; i++) { const x = -222 + i * 64, y = 162 + 26 * Math.sin(Math.PI * (i + .5) / 7), ti = lerp(tu(.32), S0.who ? tu(1.0) : bH(.3), i / 6);
        const g = mvG(B, { y: [[0, -70], [ti, -70], [ti + tu(.12), 0, 'in'], [ti + tu(.18), -6, 'out'], [ti + tu(.24), 0, 'soft']], o: [[0, 0], [ti, 0], [ti + tu(.04), 1]] }); R(g, x, y - 8, 56, 18, 5, F(2.6)); }
      on(B.path('M -230 100 Q 0 150 230 100', S(2.2)), p, tu(.3), { draw: [[0, 0], [tu(.6), 1, 'out']] });                     // hand rope
      goalAt(p, c, S0, 350, 30, 190, null, { t: tu(.15), punch: true }); if (S0.goal) lab(sub(p), S0.goal, 350, 250, {}); cheer(B, 350, 30, 130);
      whoAt(p, c, S0, 250, 70, 100, { mv: { x: [[0, -600], [tu(1.1), -600], [H, 0, 'io']], y: [[0, 0], [tu(1.1), 0], [lerp(tu(1.1), H, .25), -10, 'out'], [lerp(tu(1.1), H, .5), 0, 'in'], [lerp(tu(1.1), H, .75), -10, 'out'], [H, 0, 'in']] } }); }); });

  /* 04 ── CRADLE: the person lets the first ball go — the knock passes along the row twice, and the last ball swings out and rings the goal */
  variant('cradle', 'ลูกตุ้มส่งแรง', (d, c) => { const S0 = st(d), H = Z.H;
    art(c, p => { ground(p); const B = sub(p); atT(B, p, 0);
      R(B, -262, -250, 434, 24, 10, F(3)); B.line(-250, -226, -280, 296, W(4)); B.line(160, -226, 190, 296, W(4));           // frame
      const K0 = [[0, -38], [tu(.45), -38], [tu(.7), 0, 'in'], [tu(1.2), 0], [tu(1.36), -30, 'out'], [bH(.4), -30], [bH(.25), 0, 'in']];
      const K3 = [[0, 0], [tu(.7), 0], [tu(.95), 30, 'out'], [tu(1.2), 0, 'in'], [bH(.25), 0], [H, 34, 'out'], [aH(.28), 0, 'in']];
      for (let i = 0; i < 4; i++) { const x = -150 + i * 84, g = mvG(B, { px: x, py: -226, r: i === 0 ? K0 : i === 3 ? K3 : null }); g.line(x - 20, -226, x, 80, S(1.8)); g.line(x + 20, -226, x, 80, S(1.8)); g.circle(x, 80, 42, F(3.2)); }
      const hm = person(B, -415, 300, .8, { s: [4, -76], e: [52, -94], h: [104, -102] });
      hm.on('upper1', p, 0, { ox: 4, oy: -76, r: [[0, -14], [tu(.45), -14], [tu(.55), 8, 'out'], [tu(.7), 0, 'soft']] });   // lets go
      haloH(B, 340, -20, 150); B.circle(340, -20, 112, F(3.4)); goalAt(B, c, S0, 340, -20, 162, 190, { t: tu(.15), punch: true }); cheer(B, 340, -20, 150); }); });

  /* 05 ── RIPPLE: a drop falls, the rings spread on the surface and the goal rises out of the middle */
  variant('ripple', 'หยดน้ำกระเพื่อม', (d, c) => { const S0 = st(d), H = Z.H;
    art(c, p => { const B = sub(p); atT(B, p, 0);
      const dr = mvG(B, { y: [[0, 0], [tu(.25), 0], [tu(.55), 480, 'in']], o: [[0, 0], [tu(.24), 0], [tu(.28), 1], [tu(.55), 1], [tu(.57), 0]] });
      dr.path('M 0 -330 Q 22 -298 22 -284 A 22 22 0 0 1 -22 -284 Q -22 -298 0 -330 Z', F(2.8));                              // the drop
      [[380, 82, S(1.6)], [270, 58, S(2)], [160, 34, W(2.6)]].forEach(([rx, ry, o], i) => { const t = tu(.55 + (2 - i) * .14);
        const g = mvG(B, { px: 0, py: 210, s: [[0, .1], [t, .1], [t + tu(.5), 1, 'out']], o: [[0, 0], [t, 0], [t + tu(.04), 1]] }); g.ellipse(0, 210, rx, ry, o); });
      const up = { y: [[0, 170], [tu(.8), 170], [H, 0, 'out']], s: [[0, .5], [tu(.8), .5], [H, 1, 'out']], o: [[0, 0], [tu(.8), 0], [tu(.95), 1]] };
      goalAt(p, c, S0, 0, -30, 250, -200, { t: tu(.6), mv: up, punch: true, labT: H }); cheer(B, 0, -30, 170);
      whoAt(p, c, S0, -400, -230, 110); }); });

  /* 06 ── CONSTELLATION: the dots light up, the lines join them one after another and close the ring round the goal on the keyword */
  variant('connect', 'ลากเส้นต่อจุด', (d, c) => { const S0 = st(d), n = 9, R0 = 250, y0 = -30, H = Z.H;
    art(c, p => { const B = sub(p); atT(B, p, 0);
      const pts = []; for (let i = 0; i < n; i++) { const a = rad(-90 + i * 360 / n), r = R0 * (i % 2 ? .93 : 1.04); pts.push([f1(Math.cos(a) * r), f1(y0 + Math.sin(a) * r)]); }
      pts.forEach(([x, y], i) => { const ts = lerp(tu(.6), bH(.2), i / (n - 1)); on(B.line(x, y, ...pts[(i + 1) % n], { sw: 2.6 }), p, ts, { draw: [[0, 0], [tu(.2), 1, 'out']] }); });
      pts.forEach(([x, y], i) => { const t = tu(.2 + i * .04), g = mvG(B, { px: x, py: y, s: [[0, 0], [t, 0], [t + tu(.16), 1.3, 'out'], [t + tu(.28), 1, 'soft'], [H, 1], [aH(.08), 1.5, 'out'], [aH(.3), 1, 'soft']] }); g.circle(x, y, 14, { fill: C.ink, sw: 1.6 }); });
      goalAt(p, c, S0, 0, y0, 230, null, { t: tu(.12), punch: true }); if (S0.goal) lab(sub(p), S0.goal, 0, 320, {}); cheer(B, 0, y0, 170);
      whoAt(p, c, S0, -400, 200, 110); }); });

  /* 07 ── SPRING PADS: the ball (or who) drops onto the first pad and bounces pad to pad, higher each time, onto the goal's platform */
  variant('bounce', 'กระโดดแป้นสปริง', (d, c) => { const S0 = st(d), H = Z.H, t1 = tu(.5), t2 = tu(.95);
    const pad = (q, x, y, h, t) => { const g = mvG(q, { px: x, py: y + h, sy: [[0, 1], [t - tu(.02), 1], [t + tu(.03), .82, 'out'], [t + tu(.12), 1.04, 'out'], [t + tu(.2), 1, 'soft']] });
      g.path(`M ${x - 12} ${y + h} ` + [1, 2, 3, 4].map(k => `L ${x + (k % 2 ? 12 : -12)} ${y + h - k * h / 4}`).join(' '), W(3)); R(g, x - 60, y - 14, 120, 18, 7, F(3)); R(q, x - 40, y + h, 80, 14, 5, F(2.6)); };
    const m1 = (t1 + t2) / 2, m2 = (t2 + H) / 2, J = { x: [[0, -550], [t1, -550], [t2, -300, 'lin'], [H, 0, 'lin']],
      y: [[0, -160], [tu(.2), -160], [t1, 248, 'in'], [m1, -60, 'out'], [t2, 138, 'in'], [m2, -170, 'out'], [H, 0, 'in'], [aH(.08), -14, 'out'], [aH(.18), 0, 'in']] };
    art(c, p => { ground(p); const B = sub(p); atT(B, p, 0);
      pad(B, -330, 200, 86, t1); pad(B, -80, 90, 196, t2);
      R(B, 160, -60, 300, 22, 8, F(3.2)); R(B, 296, -38, 28, 334, 6, F(2.8));                                                  // the top platform
      goalAt(p, c, S0, 370, -170, 180, null, { t: tu(.12), punch: true }); if (S0.goal) lab(sub(p), S0.goal, 400, 30, { maxW: 130, size: 36 }); cheer(B, 370, -170, 120);
      if (S0.who) whoAt(p, c, S0, 220, -130, 110, { t: tu(.15), mv: J }); else { const g = mvG(B, Object.assign({ o: [[0, 0], [tu(.15), 0], [tu(.2), 1]] }, J)); g.circle(220, -96, 34, { fill: C.ink, sw: 2 }); } }); });

  /* 08 ── GEARS: the gears turn and the rack lifts the goal's platform up to the top */
  variant('gears', 'เฟืองหมุนยก', (d, c) => { const S0 = st(d), H = Z.H, lift = { y: [[0, 330], [tu(.35), 330], [H, -10, 'io'], [aH(.12), 0, 'soft']] };
    const gear = (q, x, y, r, n) => { let D = ''; for (let i = 0; i < n * 2; i++) { const a0 = i * Math.PI / n, a1 = (i + 1) * Math.PI / n, rr = i % 2 ? r : r + 18;
        D += `${i ? 'L' : 'M'} ${f1(x + Math.cos(a0 + .06) * rr)} ${f1(y + Math.sin(a0 + .06) * rr)} L ${f1(x + Math.cos(a1 - .06) * rr)} ${f1(y + Math.sin(a1 - .06) * rr)} `; }
      q.path(D + 'Z', F(3.2)); q.circle(x, y, r * .32, F(2.6)); q.circle(x, y, 8, W(2)); };
    art(c, p => { ground(p); const B = sub(p); atT(B, p, 0);
      gear(mvG(B, { px: -250, py: 160, r: [[0, 0], [tu(.35), 0], [H, 180, 'io']] }), -250, 160, 100, 10);
      gear(mvG(B, { px: -78, py: 104, r: [[0, 0], [tu(.35), 0], [H, -308.6, 'io']] }), -78, 104, 60, 7);
      const rk = mvG(clipG(B, -470, -400, 940, 700), lift);
      R(rk, -4, -150, 36, 446, 6, F(3)); for (let y = -120; y < 280; y += 34) rk.line(-4, y, -22, y + 10, W(2.4));               // rack
      R(rk, -4, -172, 380, 26, 8, F(3.2));                                                                                     // platform
      goalAt(p, c, S0, 220, -270, 170, null, { t: tu(.15), mv: lift, punch: true }); if (S0.goal) { const lg = sub(p); on(lg, p, 0, { o: [[0, 0], [H, 0], [aH(.15), 1]] }); lab(lg, S0.goal, 230, -100, {}); }
      cheer(B, 220, -270, 120);
      whoAt(p, c, S0, -400, -230, 110); }); });

  /* 09 ── PULLEY: the person hauls on the rope in three pulls and the goal rises to the wheel */
  variant('pulley', 'รอกดึงขึ้น', (d, c) => { const S0 = st(d), wx = 160, wy = -280, H = Z.H, [a1, a2, a3] = [tu(.55), tu(.85), tu(1.15)];
    const up = { y: [[0, 300], [a1 - tu(.1), 300], [a1, 200, 'out'], [a2 - tu(.1), 200], [a2, 110, 'out'], [a3 - tu(.1), 110], [a3, 40, 'out'], [bH(.15), 40], [H, -8, 'out'], [aH(.14), 0, 'soft']] };
    art(c, p => { ground(p); const B = sub(p); atT(B, p, 0);
      B.line(-470, -330, 470, -330, S(2)); R(B, wx - 10, -330, 20, 30, 4, F(2.6)); B.circle(wx, wy, 52, F(3.2)); B.circle(wx, wy, 14, W(2.4));   // ceiling, bracket, wheel
      B.line(wx - 52, wy, wx - 52, 34, W(3)); B.path(`M ${wx - 52} 34 Q ${wx - 30} 240 ${wx + 20} 290 Q ${wx + 50} 300 ${wx + 80} 292`, W(3));   // rope down to the hands, slack on the floor
      const sd = mvG(clipG(B, -470, wy, 940, 700), up); sd.line(wx + 52, -760, wx + 52, -150, W(3)); R(sd, wx - 50, -150, 204, 16, 6, F(2.8));   // the goal's side + its seat
      const pull = [[0, 0]]; [a1, a2, a3].forEach(t => pull.push([t - tu(.12), 0], [t, -7, 'out'], [t + tu(.14), 0, 'soft']));
      person(mvG(B, { px: wx - 59, py: 300, r: pull }), wx - 52 - 7, 300, .8, { s: [4, -76], e: [46, -118], h: [78, -158] }, { lean: -12, leg: sd2 => sd2 < 0 ? { h: [-6, 8], k: [-22, 88], f: [-34, 166] } : { h: [6, 8], k: [42, 80], f: [70, 160] } });
      goalAt(p, c, S0, wx + 52, -70, 170, null, { t: tu(.15), mv: up, punch: true }); if (S0.goal) { const lg = sub(p); on(lg, p, 0, { o: [[0, 0], [H, 0], [aH(.15), 1]] }); lab(lg, S0.goal, wx + 140, 40, { anchor: 'start', maxW: 170 }); }
      cheer(B, wx + 52, -70, 120); }); });

  /* 10 ── SCISSOR LIFT: the scissor arms open and raise the goal's platform to the top (user kept all three new 10s: 10 11 12) */
  variant('scissor', 'ลิฟต์กรรไกรยกขึ้น', (d, c) => { const S0 = st(d), x = S0.who ? 80 : 0, H = Z.H;
    const sy = [[0, .28], [tu(.35), .28], [H, 1.02, 'io'], [aH(.12), 1, 'soft']], up = { y: sy.map(([t, v, e]) => [t, f1(336 * (1 - v)), e]) };
    art(c, p => { ground(p); const B = sub(p); atT(B, p, 0);
      R(B, x - 190, 262, 380, 34, 10, F(3.2)); [x - 150, x + 150].forEach(xx => B.circle(xx, 296, 14, F(2.6)));               // base + wheels
      const S2 = mvG(B, { px: x, py: 262, sy }), lv = [262, 150, 38, -74];
      for (let i = 0; i < 3; i++) { const y0 = lv[i], y1 = lv[i + 1]; S2.line(x - 150, y0, x + 150, y1, { sw: 14 }); S2.line(x - 150, y0, x + 150, y1, { sw: 8, stroke: C.fill });
        S2.line(x + 150, y0, x - 150, y1, { sw: 14 }); S2.line(x + 150, y0, x - 150, y1, { sw: 8, stroke: C.fill }); S2.circle(x, (y0 + y1) / 2, 9, F(2.4)); }   // the scissor arms
      R(mvG(B, up), x - 200, -100, 400, 28, 8, F(3.2));                                                                      // platform
      goalAt(p, c, S0, x, -200, 180, null, { t: tu(.15), mv: up, punch: true }); if (S0.goal) { const lg = sub(p); on(lg, p, 0, { o: [[0, 0], [H, 0], [aH(.15), 1]] }); lab(lg, S0.goal, x + 210, -150, { anchor: 'start', maxW: 170 }); }
      cheer(B, x, -200, 120);
      whoAt(p, c, S0, -390, 200, 120); }); });

  /* 11 ── BUBBLE: a bubble rises from the deep carrying the goal, wobbling, and reaches the surface on the keyword */
  variant('bubble', 'ฟองลอยขึ้น', (d, c) => { const S0 = st(d), x = S0.who ? 80 : 0, H = Z.H;
    const up = { y: [[0, 430], [tu(.2), 430], [H, 0, 'out']], x: [[0, 0], [tu(.6), -22, 'soft'], [tu(1.1), 16, 'soft'], [H, 0, 'soft']] };
    art(c, p => { const B = sub(p); atT(B, p, 0);
      B.path(`M -470 -250 Q -350 -270 -230 -250 T 10 -250 T 250 -250 T 470 -250`, S(2.4));                                    // the surface
      const bb = mvG(B, Object.assign({ px: x, py: -60, sx: [[0, 1], [H, 1], [aH(.08), 1.07, 'out'], [aH(.24), 1, 'soft']], sy: [[0, 1], [H, 1], [aH(.08), .93, 'out'], [aH(.24), 1, 'soft']] }, up));
      bb.circle(x, -60, 170, { fill: 'rgba(255,255,255,.05)', sw: 3 }); bb.path(`M ${x - 120} -120 A 130 130 0 0 1 ${x - 40} -180`, S(2));
      [[x - 60, 200, 34], [x + 40, 270, 20], [x - 20, 320, 12]].forEach(([xx, yy, r], i) => { const g = mvG(B, { y: [[0, 260 + i * 40], [tu(.3 + i * .1), 260 + i * 40], [H, 0, 'out']], o: [[0, 0], [tu(.3 + i * .1), 0], [tu(.4 + i * .1), 1]] }); g.circle(xx, yy - 40, r, { fill: 'rgba(255,255,255,.05)', sw: 2.2 }); });
      goalAt(p, c, S0, x, -60, 200, 150, { t: tu(.15), mv: up, punch: true, labT: Z.H }); cheer(B, x, -60, 190);
      whoAt(p, c, S0, -390, 200, 120); }); });

  /* 12 ── POP-UP BOX: the closed box rattles — on the keyword the lid flips open and the spring pops the goal up out of it */
  variant('popup', 'กล่องเด้ง', (d, c) => { const S0 = st(d), x = S0.who ? 80 : 0, H = Z.H;
    const shake = [[0, 0]]; [tu(.55), tu(.85), tu(1.15)].forEach(t => shake.push([t - tu(.03), 0], [t, -8, 'out'], [t + tu(.04), 7], [t + tu(.08), -4], [t + tu(.12), 0, 'soft']));
    const pop = { y: [[0, 270], [bH(.05), 270], [H, -40, 'out'], [aH(.1), 12, 'in'], [aH(.2), 0, 'soft']], o: [[0, 0], [bH(.05), 0], [bH(.03), 1]] };
    art(c, p => { ground(p); const B = sub(p); atT(B, p, 0);
      mvG(B, { px: x - 170, py: 90, sy: [[0, 0], [H, 0], [aH(.12), 1, 'out']], o: [[0, 0], [H, 0], [H + .001, 1]] }).path(`M ${x - 170} 90 L ${x - 210} -40 L ${x + 130} -40 L ${x + 170} 90 Z`, F(3));   // lid, flipped open
      const sp = mvG(B, { px: x, py: 90, sy: [[0, .05], [bH(.05), .05], [H, 1.15, 'out'], [aH(.1), .94], [aH(.2), 1, 'soft']], o: [[0, 0], [bH(.05), 0], [bH(.03), 1]] });
      let z = `M ${x} 90`; for (let i = 1; i <= 6; i++) z += ` L ${x + (i % 2 ? 34 : -34)} ${90 - i * 30}`; sp.path(z + ` L ${x} -110`, W(4));   // spring
      const bx = mvG(B, { x: shake }); R(bx, x - 170, 90, 340, 206, 14, F(3.4));                                              // box
      const cl = mvG(bx, { o: [[0, 1], [H, 1], [H + .001, 0]] }); R(cl, x - 182, 72, 364, 26, 8, F(3));                        // the closed lid
      const tk = mvG(B, pop); tk.circle(x, -200, 112, F(3.4));
      goalAt(p, c, S0, x, -200, 162, null, { t: tu(.15), mv: pop, punch: true }); if (S0.goal) lab(sub(p), S0.goal, x, 200, {}); cheer(B, x, -200, 140);
      whoAt(p, c, S0, -390, 200, 120); }); });

  /* 13 ── FISHING: the angler reels in three times and the goal comes up out of the water on the hook */
  variant('fishing', 'ตกเบ็ดได้', (d, c) => { const S0 = st(d), hx = 280, hy = -150, H = Z.H, [a1, a2, a3] = [tu(.5), tu(.8), tu(1.1)], tip = -310;
    const reel = { y: [[0, 380], [a1 - tu(.1), 380], [a1, 300, 'out'], [a2 - tu(.1), 300], [a2, 220, 'out'], [a3 - tu(.1), 220], [a3, 160, 'out'], [bH(.2), 160], [H, -12, 'out'], [aH(.14), 6, 'soft'], [aH(.28), 0, 'soft']] };
    const L0 = hy - 80 - tip, ln = reel.y.map(([t, v, e]) => [t, f1((L0 + v) / L0), e]);
    art(c, p => { const B = sub(p); atT(B, p, 0); B.line(-470, 300, 40, 300, S(2));
      B.path('M 60 210 Q 170 190 280 210 T 470 210', S(2.4)); B.path('M 120 250 Q 220 236 320 250 T 470 250', S(1.6));       // water
      const hm = person(B, -427, 300, .8, { s: [4, -76], e: [44, -40], h: [86, -60] });                                       // the angler
      const crank = [[0, 0]]; [a1, a2, a3].forEach(t => crank.push([t - tu(.12), 0], [t, -16, 'out'], [t + tu(.12), 0, 'soft'])); hm.on('fore1', p, 0, { ox: 44, oy: -40, r: crank });
      B.path(`M -420 230 Q -230 -120 ${hx} ${tip}`, { sw: 9 }); B.circle(-356, 132, 24, F(2.8)); B.line(-356, 132, -330, 112, W(2.4));   // rod + reel
      mvG(B, { px: hx, py: tip, sy: ln }).line(hx, tip, hx, hy - 80, S(2));                                                  // line (shortens as it is reeled in)
      const hk = mvG(B, reel); hk.path(`M ${hx} ${hy - 80} L ${hx} ${hy - 50} Q ${hx} ${hy - 26} ${hx + 18} ${hy - 32}`, W(3.2));   // hook
      goalAt(p, c, S0, hx, hy + 50, 190, null, { t: tu(.1), mv: Object.assign({ o: [[0, 0], [a2, 0], [a2 + tu(.1), 1]] }, reel), punch: true }); if (S0.goal) { const lg = sub(p); on(lg, p, 0, { o: [[0, 0], [H, 0], [aH(.15), 1]] }); lab(lg, S0.goal, hx, 80, {}); }
      cheer(B, hx, hy + 50, 130); }); });

  /* 14 ── CABLE CAR: the gondola carrying the goal climbs the cable and docks at the top station, swinging to rest */
  variant('cablecar', 'กระเช้าถึงสถานี', (d, c) => { const S0 = st(d), gx = 170, gy = -40, H = Z.H, ty = 150 - (gx + 470) * 400 / 940;
    const X = [[0, -560], [tu(.25), -560], [H, 0, 'io']], ride = { x: X, y: X.map(([t, v, e]) => [t, f1(-v * 400 / 940), e]) };
    const sw = [[0, -3], [H, -3], [aH(.12), 5, 'out'], [aH(.3), -2, 'soft'], [aH(.45), 0, 'soft']];
    art(c, p => { ground(p); const B = sub(p); atT(B, p, 0);
      B.line(-470, 150, 470, -250, W(3));                                                                                       // cable
      R(B, 380, -260, 40, 556, 6, F(3)); R(B, 340, -290, 130, 40, 8, F(3)); R(B, -460, 150, 40, 146, 6, F(3));                  // towers
      const gd = mvG(mvG(B, ride), { px: gx, py: ty, r: sw }); gd.circle(gx, ty, 14, F(2.6)); gd.line(gx, ty, gx, gy - 100, W(4));   // hanger
      R(gd, gx - 120, gy - 100, 240, 210, 30, F(3.4)); R(gd, gx - 120, gy - 100, 240, 26, 13, F(2.8));
      goalAt(p, c, S0, gx, gy + 18, 150, null, { t: tu(.15), mv: ride, punch: true }); if (S0.goal) { const lg = sub(p); on(lg, p, 0, { o: [[0, 0], [H, 0], [aH(.15), 1]] }); lab(lg, S0.goal, gx, gy + 170, {}); }
      cheer(B, gx, gy + 18, 140);
      whoAt(p, c, S0, -320, 200, 130); }); });

  /* 15 ── SEESAW CATAPULT: a weight drops onto one end, the board flips and the goal flies up in an arc onto the high ledge */
  variant('catapult', 'กระดานดีดขึ้นหิ้ง', (d, c) => { const S0 = st(d), H = Z.H, ti = bH(.45), mid = lerp(ti, H, .55);
    const fly = { x: [[0, -170], [ti, -170], [H, 0, 'lin']], y: [[0, 380], [ti, 380], [mid, -110, 'out'], [H, 0, 'in'], [aH(.08), -12, 'out'], [aH(.18), 0, 'in']], r: [[0, 0], [ti, 0], [H, 360, 'lin']] };
    art(c, p => { ground(p); const B = sub(p); atT(B, p, 0);
      B.path('M -150 296 L -100 210 L -50 296 Z', F(3.2)); R(mvG(B, { px: -100, py: 206, r: [[0, 16], [ti, 16], [ti + tu(.08), -16, 'in'], [ti + tu(.14), -13, 'out'], [ti + tu(.2), -16, 'soft']] }), -400, 196, 600, 22, 8, F(3.2));   // pivot + board
      mvG(B, { y: [[0, -440], [ti - tu(.24), -440], [ti, 0, 'in'], [ti + tu(.06), -10, 'out'], [ti + tu(.12), 0, 'in']], o: [[0, 0], [ti - tu(.24), 0], [ti - tu(.2), 1]] }).rect(-390, 168, 90, 60, { rx: 10, fill: C.fill, sw: 3.2 });   // the weight drops
      R(B, 200, -110, 270, 24, 8, F(3.2)); B.line(440, -86, 440, 296, W(4));                                                   // the high ledge + its post
      goalAt(p, c, S0, 320, -210, 180, null, { t: tu(.15), mv: fly, punch: true }); if (S0.goal) { const lg = sub(p); on(lg, p, 0, { o: [[0, 0], [H, 0], [aH(.15), 1]] }); lab(lg, S0.goal, 330, -40, {}); }
      cheer(B, 320, -210, 120);
      whoAt(p, c, S0, -340, 50, 120); }); });

  /* 16 ── WIND-UP WALKER: the key turns, the little walker toddles across and stops at the goal with a hop */
  variant('windup', 'ตัวเดินไขลาน', (d, c) => { const S0 = st(d), x = 60, H = Z.H, T0 = tu(.3), n = 8;
    const wk = { x: [[0, -330], [T0, -330], [H, 0, 'lin']], y: [[0, 0]], r: [[0, 0]] };
    for (let i = 1; i <= n; i++) { const t = lerp(T0, H, i / n), tm = lerp(T0, H, (i - .5) / n); wk.y.push([tm, -12, 'out'], [t, 0, 'in']); wk.r.push([tm, i % 2 ? 4 : -4, 'soft'], [t, 0, 'soft']); }
    wk.y.push([aH(.1), -26, 'out'], [aH(.22), 0, 'in']);
    const key = [[0, 1]]; for (let i = 1; i <= n; i++) key.push([lerp(T0, H, (i - .5) / n), -1, 'io'], [lerp(T0, H, i / n), 1, 'io']);
    art(c, p => { ground(p); const B = sub(p); atT(B, p, 0);
      const W0 = mvG(B, Object.assign({ px: x, py: 296 }, wk));
      W0.ellipse(x, 140, 110, 100, F(3.4)); W0.circle(x + 40, 110, 12, { fill: C.ink, sw: 1.6 });                               // body + eye
      R(W0, x - 60, 230, 40, 66, 12, F(3)); R(W0, x + 20, 230, 40, 66, 12, F(3));                                               // feet
      W0.line(x - 110, 130, x - 160, 130, W(5)); mvG(W0, { px: x - 160, py: 130, sx: key }).path(`M ${x - 160} 100 Q ${x - 200} 100 ${x - 200} 130 Q ${x - 200} 160 ${x - 160} 160 Q ${x - 180} 130 ${x - 160} 100 Z`, F(2.8));   // key (turning)
      goalAt(p, c, S0, 330, 150, 200, null, { t: tu(.12), punch: true }); if (S0.goal) lab(sub(p), S0.goal, 330, -20, {}); cheer(B, 330, 150, 130);
      if (S0.who) whoAt(p, c, S0, x, -40, 110, { mv: { x: wk.x, y: wk.y } }); }); });

  /* 17 ── TRAMPOLINE: the jumper (or ball) drops onto the trampoline, the bed gives, and it is sent flying up to the goal */
  variant('trampoline', 'แทรมโพลีนส่งขึ้น', (d, c) => { const S0 = st(d), H = Z.H, t1 = tu(.6), t2 = tu(.74), mid = lerp(t2, H, .55);
    const J = { x: [[0, -250], [t2, -250], [H, 0, 'out']], y: [[0, -170], [tu(.25), -170], [t1, 270, 'in'], [lerp(t1, t2, .5), 300, 'out'], [t2, 270, 'in'], [mid, -140, 'out'], [H, 0, 'in']] };
    art(c, p => { ground(p); const B = sub(p); atT(B, p, 0);
      const bd = mvG(B, { px: -180, py: 200, y: [[0, 0], [t1, 0], [lerp(t1, t2, .5), 26, 'out'], [t2, 0, 'in'], [t2 + tu(.08), -6, 'out'], [t2 + tu(.16), 0, 'soft']] });
      bd.ellipse(-180, 200, 200, 34, F(3.2)); bd.ellipse(-180, 200, 160, 22, S(1.6)); [-340, -20, -180].forEach(x => B.line(x, 220, x, 296, W(4)));   // trampoline
      haloH(B, 250, -170, 140);
      goalAt(p, c, S0, 250, -170, 190, 10, { t: tu(.12), punch: true }); cheer(B, 250, -170, 140);
      if (S0.who) whoAt(p, c, S0, 60, -150, 120, { t: tu(.2), mv: J }); else { const g = mvG(B, Object.assign({ o: [[0, 0], [tu(.2), 0], [tu(.25), 1]] }, J)); g.circle(70, -130, 36, { fill: C.ink, sw: 2 }); } }); });

  /* 18 ── PAPER PLANE: the plane loops across along its trail and glides down to land by the goal */
  variant('plane', 'เครื่องบินกระดาษร่อนลง', (d, c) => { const S0 = st(d), px = 120, py = 180, H = Z.H, T0 = tu(.25), T1 = bH(.12), fa = Math.atan2(60, 200) * 180 / Math.PI;
    const A = [[-460, -60], [-300, -300], [-80, -260], [-160, -120]], Bz = [[-160, -120], [-240, 0], [-60, 40], [px - 120, py - 30]], pts = [];
    for (let k = 0; k <= 16; k++) { const s = k / 16, [P0, P1, P2, P3] = s < .5 ? A : Bz, t = s < .5 ? s * 2 : s * 2 - 1, q = bez(P0, P1, P2, P3, t), q2 = bez(P0, P1, P2, P3, Math.min(1, t + .02)), q0 = bez(P0, P1, P2, P3, Math.max(0, t - .02));
      pts.push([lerp(T0, T1, s), q[0], q[1], Math.atan2(q2[1] - q0[1], q2[0] - q0[0]) * 180 / Math.PI]); }
    for (let i = 1; i < pts.length; i++) { while (pts[i][3] - pts[i - 1][3] > 180) pts[i][3] -= 360; while (pts[i][3] - pts[i - 1][3] < -180) pts[i][3] += 360; }
    const fr = pts[pts.length - 1][3]; pts.push([H, px, py, fr + (fa - fr)]);
    const K = track(pts.map(([t, x, y, r]) => [t, x, y, r - fa]), px, py, 'lin');
    art(c, p => { ground(p); const B = sub(p); atT(B, p, 0);
      on(B.path(`M -460 -60 C -300 -300, -80 -260, -160 -120 C -240 0, -60 40, ${px - 120} ${py - 30}`, S(2.2)), p, T0, { draw: [[0, 0], [T1 - T0, 1, 'lin']] });   // flight trail
      const pl = mvG(B, { px, py, x: K.x, y: K.y, r: K.r, o: [[0, 0], [T0 - tu(.05), 0], [T0, 1]] });
      pl.path(`M ${px + 90} ${py} L ${px - 110} ${py - 60} L ${px - 40} ${py + 6} Z`, F(3)); pl.path(`M ${px + 90} ${py} L ${px - 40} ${py + 6} L ${px - 70} ${py + 40} Z`, F(3));   // the plane
      goalAt(p, c, S0, 340, 130, 200, null, { t: tu(.12), punch: true }); if (S0.goal) lab(sub(p), S0.goal, 340, -20, {}); cheer(B, 340, 130, 130);
      whoAt(p, c, S0, -400, 200, 110); }); });

  /* 19 ── PAPER BOAT: the paper boat carrying the goal bobs across the water and bumps gently into the shore */
  variant('boat', 'เรือกระดาษถึงฝั่ง', (d, c) => { const S0 = st(d), bx = 120, H = Z.H, T0 = tu(.2);
    const sail = { x: [[0, -560], [T0, -560], [H, 8, 'out'], [aH(.1), -4, 'soft'], [aH(.24), 0, 'soft']], y: [[0, 0]], r: [[0, 0]] };
    for (let i = 1; i <= 4; i++) { const t = lerp(T0, H, i / 4), tm = lerp(T0, H, (i - .5) / 4); sail.y.push([tm, -10, 'soft'], [t, 0, 'soft']); sail.r.push([tm, -4, 'soft'], [t, 3, 'soft']); }
    sail.r.push([aH(.2), 0, 'soft']);
    art(c, p => { const B = sub(p); atT(B, p, 0);
      B.path('M 300 140 L 470 140 L 470 300 L 330 300 Z', F(3.4));                                                             // the shore
      B.path(`M -470 170 Q -380 150 -290 170 T -110 170 T 70 170 T 250 170 L 310 170`, S(2.4)); B.path('M -440 230 Q -350 214 -260 230 T -80 230 T 100 230 T 280 230', S(1.6));   // water
      const bt = mvG(B, Object.assign({ px: bx, py: 170 }, sail)); bt.path(`M ${bx - 170} 100 L ${bx + 170} 100 L ${bx + 110} 170 L ${bx - 110} 170 Z`, F(3.4)); bt.path(`M ${bx - 90} 100 L ${bx} -10 L ${bx + 90} 100`, F(3));   // hull + paper sail fold
      goalAt(p, c, S0, bx, -100, 150, null, { t: tu(.15), mv: { x: sail.x, y: sail.y }, punch: true }); if (S0.goal) { const lg = sub(p); on(lg, p, 0, { o: [[0, 0], [H, 0], [aH(.15), 1]] }); lab(lg, S0.goal, bx, -210, {}); }
      cheer(B, bx, -100, 120);
      whoAt(p, c, S0, 390, 60, 120); }); });

  /* 20 ── KITE: the person lets the kite climb on the wind, swaying higher and higher, with the goal on it */
  variant('kite', 'ว่าวขึ้นสูง', (d, c) => { const S0 = st(d), kx = 200, ky = -150, hx = -358, hy = 18, H = Z.H;
    const T = [0, tu(.3), tu(.8), tu(1.2), H], DX = [-400, -400, -250, -120, 0], DY = [230, 230, 130, 90, 0], E = [undefined, undefined, 'out', 'soft', 'out'];
    const rise = { x: T.map((t, i) => E[i] ? [t, DX[i], E[i]] : [t, DX[i]]), y: T.map((t, i) => E[i] ? [t, DY[i], E[i]] : [t, DY[i]]) };
    const vF = [kx - hx, ky + 20 - hy], aF = Math.atan2(vF[1], vF[0]), lF = Math.hypot(...vF);
    const str = { r: T.map((t, i) => { const v = [vF[0] + DX[i], vF[1] + DY[i]], r = f1((Math.atan2(v[1], v[0]) - aF) * 180 / Math.PI); return E[i] ? [t, r, E[i]] : [t, r]; }),
      s: T.map((t, i) => { const v = Math.hypot(vF[0] + DX[i], vF[1] + DY[i]) / lF; return E[i] ? [t, f1(v * 1000) / 1000, E[i]] : [t, f1(v * 1000) / 1000]; }) };
    art(c, p => { ground(p); const B = sub(p); atT(B, p, 0);
      mvG(B, Object.assign({ px: hx, py: hy }, str)).path(`M ${kx} ${ky + 20} Q -120 -10 ${hx} ${hy}`, S(1.8));               // string, from the hand to the kite
      const K = mvG(mvG(B, rise), { px: kx, py: ky, r: [[0, -18], [tu(.8), 10, 'soft'], [tu(1.2), -8, 'soft'], [H, 0, 'soft']] });
      K.path(`M ${kx} ${ky - 190} L ${kx + 150} ${ky - 10} L ${kx} ${ky + 170} L ${kx - 150} ${ky - 10} Z`, F(3.4)); K.line(kx, ky - 190, kx, ky + 170, S(1.4)); K.line(kx - 150, ky - 10, kx + 150, ky - 10, S(1.4));
      const tl = mvG(K, null); on(tl, p, 0, { loop: tu(1.1), ox: kx, oy: ky + 170, r: [[0, -8], [tu(.55), 8, 'soft'], [tu(1.1), -8, 'soft']] });
      tl.path(`M ${kx} ${ky + 170} Q ${kx - 30} ${ky + 230} ${kx + 10} ${ky + 270} Q ${kx + 40} ${ky + 310} ${kx} ${ky + 360}`, S(2)); [[kx - 22, ky + 230], [kx + 22, ky + 300]].forEach(([x, y]) => tl.path(`M ${x - 16} ${y - 10} L ${x + 16} ${y + 10} M ${x + 16} ${y - 10} L ${x - 16} ${y + 10}`, W(2.6)));   // tail + bows
      person(B, -400, 300, .8, { s: [4, -76], e: [30, -130], h: [52, -186] });                                                // the one flying it
      goalAt(p, c, S0, kx, ky - 10, 150, null, { t: tu(.15), mv: rise, punch: true }); if (S0.goal) { const lg = sub(p); on(lg, p, 0, { o: [[0, 0], [H, 0], [aH(.15), 1]] }); lab(lg, S0.goal, kx + 170, ky + 120, { anchor: 'start', maxW: 140 }); }
      cheer(B, kx, ky - 10, 140); }); });

  /* 21 ── ZIPPER: the slider runs down, the zip opens wide and the goal shows through the opening */
  variant('zipper', 'ซิปรูดเปิด', (d, c) => { const S0 = st(d), x = S0.who ? 80 : 0, H = Z.H, open = [[0, .04], [tu(.3), .04], [H, 1, 'out']];
    art(c, p => { const B = sub(p); atT(B, p, 0);
      [-1, 1].forEach(s => { const sd = mvG(B, { px: x, py: 0, sx: open });
        sd.path(`M ${x + s * 6} 280 C ${x + s * 30} 120, ${x + s * 230} 40, ${x + s * 240} -320`, { sw: 22 }); sd.path(`M ${x + s * 6} 280 C ${x + s * 30} 120, ${x + s * 230} 40, ${x + s * 240} -320`, { sw: 14, stroke: C.fill });   // a side of the zip
        const P = t => { const u = 1 - t; return [u * u * u * (x + s * 6) + 3 * u * u * t * (x + s * 30) + 3 * u * t * t * (x + s * 230) + t * t * t * (x + s * 240), u * u * u * 280 + 3 * u * u * t * 120 + 3 * u * t * t * 40 + t * t * t * -320]; };
        for (let k = 1; k < 16; k++) { const t = k / 16, [ax, ay] = P(t), [bx, by] = P(t + .01), L = Math.hypot(bx - ax, by - ay), nx = -(by - ay) / L * s, ny = (bx - ax) / L * s;
          sd.line(f1(ax - nx * 4), f1(ay - ny * 4), f1(ax - nx * 22), f1(ay - ny * 22), W(3)); } });                                     // its teeth
      const sl = mvG(B, { y: [[0, -560], [tu(.3), -560], [H, 0, 'out']] }); R(sl, x - 26, 270, 52, 30, 8, F(2.6)); R(sl, x - 40, 210, 80, 60, 14, F(3.2)); R(sl, x - 18, 270, 36, 50, 12, F(2.6));   // slider + pull
      goalAt(p, c, S0, x, -150, 210, 20, { t: tu(.12), mv: { s: [[0, .6], [tu(.7), .6], [H, 1, 'out']], o: [[0, 0], [tu(.7), 0], [tu(1.0), 1]] }, punch: true, lab: { maxW: 170, size: 36 }, labT: H });
      cheer(B, x, -150, 140);
      whoAt(p, c, S0, -390, 200, 130); }); });

  /* 22 ── PARACHUTE: the goal floats down under its parachute, drifting side to side, and lands on the mark (user kept all three new 20s: 22 23 24) */
  variant('parachute', 'ร่มชูชีพลงจุด', (d, c) => { const S0 = st(d), x = S0.who ? 80 : 0, H = Z.H;
    const fall = { y: [[0, -500], [tu(.2), -500], [H, 0, 'out'], [aH(.08), -10, 'out'], [aH(.18), 0, 'in']], x: [[0, -70], [tu(.2), -70], [tu(.7), 50, 'soft'], [tu(1.2), -30, 'soft'], [H, 0, 'soft']] };
    art(c, p => { ground(p); const B = sub(p); atT(B, p, 0);
      const mk = mvG(B, { px: x, py: 296, s: [[0, 1], [H, 1], [aH(.1), 1.12, 'out'], [aH(.3), 1, 'soft']] }); mk.ellipse(x, 296, 180, 22, S(2));   // the landing mark
      const pc = mvG(B, fall);
      let cn = `M ${x - 230} -170 Q ${x - 230} -330 ${x} -330 Q ${x + 230} -330 ${x + 230} -170`; for (let i = 0; i < 4; i++) { const a = x + 230 - i * 115; cn += ` Q ${a - 57} -200 ${a - 115} -170`; }
      pc.path(cn + ' Z', F(3.4)); [-115, 0, 115].forEach(dx => pc.path(`M ${x + dx} -175 Q ${x + dx * .9} -280 ${x} -330`, S(1.6)));   // canopy + seams
      [-230, -115, 115, 230].forEach(dx => pc.line(x + dx, -170, x + dx * .28, 110, S(1.6)));                                   // lines
      pc.circle(x, 180, 110, F(3.4));
      goalAt(p, c, S0, x, 180, 160, null, { t: tu(.15), mv: fall, punch: true }); if (S0.goal) { const lg = sub(p); on(lg, p, 0, { o: [[0, 0], [H, 0], [aH(.15), 1]] }); lab(lg, S0.goal, x + 250, 200, { anchor: 'start', maxW: 170 }); }
      cheer(B, x, 180, 140);
      whoAt(p, c, S0, -390, 200, 120); }); });

  /* 23 ── CONVEYOR: the belt carries the goal's token along, it tips off the end and drops into the cradle */
  variant('conveyor', 'สายพานส่งลงแอ่ง', (d, c) => { const S0 = st(d), H = Z.H, fx = 300, fy = 120, r0 = 105, T0 = tu(.25), T1 = bH(.4);
    const run = { x: [[0, -680], [T0, -680], [T1, -230, 'lin'], [H, 0, 'lin'], [aH(.12), 10, 'out'], [aH(.26), 0, 'soft']], y: [[0, -285], [T1, -285], [lerp(T1, H, .3), -300, 'out'], [H, 0, 'in'], [aH(.08), -14, 'out'], [aH(.18), 0, 'in']],
      r: [[0, -360], [T1, f1(-360 + 450 / r0 * 57.3)], [H, 0, 'lin']] };
    art(c, p => { ground(p); const B = sub(p); atT(B, p, 0);
      R(B, -460, -60, 560, 60, 30, F(3.2)); [-430, -280, -130, 20, 70].forEach(x => B.circle(x, -30, 18, W(2.4)));             // belt + rollers
      [-400, 40].forEach(x => R(B, x - 10, 0, 20, 296, 5, F(2.6)));                                                             // legs
      B.path('M 170 170 Q 300 290 430 170', { sw: 12 }); B.path('M 170 170 Q 300 290 430 170', { sw: 6, stroke: C.fill }); [190, 410].forEach(x => R(B, x - 8, 178, 16, 118, 5, F(2.4)));   // the cradle
      const tk = mvG(B, Object.assign({ px: fx, py: fy, o: [[0, 0], [T0 - tu(.05), 0], [T0, 1]] }, run)); tk.circle(fx, fy, r0, F(3.4));
      goalAt(p, c, S0, fx, fy, r0 * 1.45, -60, { t: tu(.12), mv: Object.assign({ o: [[0, 0], [T0 - tu(.05), 0], [T0, 1]] }, run), punch: true, labT: H }); cheer(B, fx, fy, 140);
      whoAt(p, c, S0, -260, -200, 110); }); });

  /* 24 ── STATION: the little train pulls in and stops under the station sign that shows the goal */
  variant('station', 'รถไฟถึงสถานี', (d, c) => { const S0 = st(d), sx = 230, H = Z.H;
    art(c, p => { const B = sub(p); atT(B, p, 0);
      B.line(-470, 290, 470, 290, W(3)); for (let x = -440; x <= 440; x += 70) R(B, x - 20, 290, 40, 10, 3, F(2));              // rail + sleepers
      R(B, 40, 214, 430, 30, 6, F(3));                                                                                         // platform
      R(B, sx - 10, -110, 20, 324, 5, F(2.8)); R(B, sx - 150, -300, 300, 200, 18, F(3.4));                                      // sign post + sign
      goalAt(p, c, S0, sx, -230, 120, -130, { t: tu(.15), punch: true, lab: { maxW: 260, size: 38 } }); cheer(B, sx, -200, 170);
      const tr = mvG(clipG(B, -470, -400, 940, 800), { x: [[0, -820], [tu(.2), -820], [H, 8, 'out'], [aH(.1), -4, 'soft'], [aH(.22), 0, 'soft']] });
      R(tr, -330, 110, 280, 150, 26, F(3.4)); R(tr, -300, 130, 90, 60, 10, F(2.6)); R(tr, -190, 130, 90, 60, 10, F(2.6));      // car
      tr.path('M -40 260 L -40 120 Q -40 70 10 70 L 70 70 Q 110 70 110 130 L 110 260 Z', F(3.4)); R(tr, -10, 96, 70, 56, 10, F(2.6));   // front car (driver's cab)
      [-280, -100, 0, 80].forEach(x => tr.circle(x, 270, 22, F(3))); R(tr, -60, 220, 30, 14, 4, F(2.4));                       // wheels, coupling
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
    { say: 'ได้ทุนเรียนต่อแล้ว', goal: I('graduation-cap', 'ได้ทุน') },
    { say: 'คิดค้นสูตรใหม่สำเร็จ', goal: I('lightbulb', 'สูตรใหม่'), who: 'user' },
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
    { say: 'ส่งงานลูกค้าครบทุกชิ้น', goal: I('package', 'ส่งครบ') },
    { say: 'ย้ายมาอยู่เมืองใหม่ได้แล้ว', goal: I('map-pin', 'เมืองใหม่'), who: 'user' },
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
    { say: 'ไม่มีป้าย + คน', goal: I('heart'), who: 'user' },
    { say: 'ป้ายแทนภาพสั้น', goal: { label: 'สำเร็จ' } },
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
    { say: 'อังกฤษ + ทีม', goal: I('rocket', 'We made it'), who: 'users' },
    { say: 'ตัวเลขยาว', goal: I('banknote', 'ยอดขาย 12,500,000') },
  ];

  G.cats = G.cats || {};
  G.cats.B08 = { variants: V, SAMPLES, STRESS, draw: (i, d, c) => { setZ(c); CUR = V[i].id; V[i].build(d, c); }, CLAMPS, timing: c => (setZ(c), Object.assign({}, Z)) };
})();
