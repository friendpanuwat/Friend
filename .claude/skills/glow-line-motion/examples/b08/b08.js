/* b08.js — category B08 "เป้าหมาย / ผลลัพธ์ / ความสำเร็จ": 20 SIMPLE, neutral designs — STILL DRAFTS (round 1, waiting for the user's pick).
   User (2026-11-13): "ไม่ต้องพยายาม creative มาก … simple ไปใช้ได้กับทุกเนื้อหา … ไม่เอา motion graphic ที่ทำให้งง ทำให้เป็นกลางกับทุกเนื้อหา"
   → plain shapes everyone reads the same way: a finish post, a bar that fills, a ring that closes, stairs, a peak, a target, a tick, a cup,
   a route to a pin, an arrow, a road, a full gauge, stacked blocks, an open door, a dropped pin, a rising line, three dots, a star, a medal,
   corner marks. Few parts, house level of detail, no extra decoration.
   Slots (same as CutPack CATEGORIES.md B08 — references/cutpack-CATEGORIES.md, cat_ai.py): goal THING (what is reached) · who icon (optional,
   who gets there). No who → only the goal (designs with a traveller use a plain glowing dot). A missing / unknown icon → its label in big type.
   GL.cats.B08.draw(i, data, { x, y, s, at, hit, speed }) — canvas 1000 × 700 centred at (0,0); hit = seconds after `at` (default 1.8).
   This round places the parts in their final pose (arrived / full / lit); motion comes after the pick. */
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
      const f = q => txt(q, str, 0, wd * .13, { size: wd * .3, maxW: wd * 1.1, weight: 700, color: C.ink }); f.custom = true; f.dur = .3; f.exit = 'pop';
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

  const V = [];
  const variant = (id, th, build) => V.push({ id, th, build });

  /* 01 ── FINISH: the traveller reaches the finish post with its flag, where the goal is */
  variant('finish', 'เส้นชัย', (d, c) => { const S0 = st(d);
    art(c, p => { floor(p, 300); const B = sub(p); atT(B, p, 0);
      R(B, 372, -170, 16, 470, 6, F(3)); B.path('M 372 -170 L 230 -128 L 372 -86 Z', F(3));                                  // post + flag
      goalAt(p, c, S0, 200, 120, 210, 268);
      runner(p, c, S0, -40, 170, 190); }); });

  /* 02 ── PROGRESS BAR: the bar fills to the end, where the goal is */
  variant('progress', 'แถบความคืบหน้า', (d, c) => { const S0 = st(d);
    art(c, p => { const B = sub(p); atT(B, p, 0);
      R(B, -420, -10, 620, 76, 38, F(3.2)); R(B, -408, 2, 596, 52, 26, { fill: LIT, sw: 2.6 });                              // track + fill (full)
      goalAt(p, c, S0, 340, 28, 200, 185);
      whoAt(p, c, S0, 160, -110, 120); }); });

  /* 03 ── RING: the ring around the goal closes */
  variant('ring', 'วงความคืบหน้า', (d, c) => { const S0 = st(d);
    art(c, p => { const B = sub(p); atT(B, p, 0);
      B.circle(0, -30, 230, S(1.6)); B.circle(0, -30, 206, { sw: 16 });                                                    // track + the closed ring
      goalAt(p, c, S0, 0, -30, 230, 275);
      whoAt(p, c, S0, 0, -262, 80); }); });

  /* 04 ── STAIRS: the traveller climbs to the top step, where the goal is */
  variant('stairs', 'บันได', (d, c) => { const S0 = st(d);
    art(c, p => { floor(p, 300); const B = sub(p); atT(B, p, 0);
      B.path('M -440 300 L -440 210 L -220 210 L -220 120 L 0 120 L 0 30 L 220 30 L 220 -60 L 440 -60 L 440 300 Z', F(3.2));
      goalAt(p, c, S0, 345, -180, 190, null);
      runner(p, c, S0, 160, -125, 130);
      if (S0.goal) lab(sub(p), S0.goal, 330, 90, { maxW: 190 }); }); });

  /* 05 ── SUMMIT: the flag at the peak carries the goal; the traveller stands at the top */
  variant('summit', 'ยอดเขา', (d, c) => { const S0 = st(d);
    art(c, p => { floor(p, 300); const B = sub(p); atT(B, p, 0);
      B.path('M -470 300 L 0 -150 L 470 300 Z', F(3.4));
      R(B, -6, -340, 12, 190, 4, F(2.6)); B.path('M 6 -340 L 236 -340 L 236 -200 L 6 -200 Z', F(3));                       // pole + flag
      goalAt(p, c, S0, 121, -270, 110, null);
      whoAt(p, c, S0, -90, -150, 110);
      if (S0.goal) lab(sub(p), S0.goal, 0, 200, {}); }); });

  /* 06 ── TARGET: the arrow lands in the middle ring, where the goal is */
  variant('target', 'เป้ากลางวง', (d, c) => { const S0 = st(d), x = 90, y = -30;
    art(c, p => { const B = sub(p); atT(B, p, 0);
      B.circle(x, y, 260, F(3.4)); B.circle(x, y, 190, F(3)); B.circle(x, y, 120, F(3));
      goalAt(p, c, S0, x, y, 160, null);
      const a = Math.atan2(y + 60 - -170, 0), A = sub(p); atT(A, p, 0);
      A.line(-400, -190, x - 112, y - 34, W(5)); A.path(`M ${x - 112} ${y - 34} L ${x - 150} ${y - 28} L ${x - 136} ${y - 58} Z`, F(2.6));   // shaft + head
      A.path('M -400 -190 L -440 -228 M -400 -190 L -446 -196 M -380 -184 L -420 -222 M -380 -184 L -426 -190', W(3));               // fletching
      if (S0.goal) lab(sub(p), S0.goal, x, 290, {});
      whoAt(p, c, S0, -380, 160, 130); }); });

  /* 07 ── CHECK: the goal on its card is checked off */
  variant('check', 'ติ๊กสำเร็จ', (d, c) => { const S0 = st(d), x = S0.who ? 90 : 0;
    art(c, p => { const B = sub(p); atT(B, p, 0);
      R(B, x - 190, -250, 380, 450, 28, F(3.4));
      goalAt(p, c, S0, x, -70, 210, 120);
      tickMark(B, x + 180, -240, 60);
      whoAt(p, c, S0, -340, 90, 150); }); });

  /* 08 ── TROPHY: the goal sits in the cup */
  variant('trophy', 'ถ้วยรางวัล', (d, c) => { const S0 = st(d), x = S0.who ? 90 : 0;
    art(c, p => { const B = sub(p); atT(B, p, 0);
      [-1, 1].forEach(s => B.path(`M ${x + s * 165} -220 C ${x + s * 260} -220, ${x + s * 260} -90, ${x + s * 120} -50`, { sw: 14 }));   // handles
      B.path(`M ${x - 180} -270 L ${x + 180} -270 Q ${x + 180} 10 ${x} 40 Q ${x - 180} 10 ${x - 180} -270 Z`, F(3.4));               // cup
      R(B, x - 26, 40, 52, 90, 6, F(3)); R(B, x - 120, 130, 240, 40, 10, F(3)); R(B, x - 150, 170, 300, 34, 10, F(3));        // stem + base
      goalAt(p, c, S0, x, -130, 170, 262);
      whoAt(p, c, S0, -360, 150, 140); }); });

  /* 09 ── ROUTE: the route runs to the pin, where the goal is; the traveller arrives */
  variant('route', 'เส้นทางถึงหมุด', (d, c) => { const S0 = st(d), px = 280, py = -120;
    art(c, p => { const B = sub(p); atT(B, p, 0);
      B.path(`M -420 240 C -150 240, -120 40, ${px - 30} 60`, S(3)); B.circle(-420, 240, 16, F(2.8));                       // the route + start
      B.path(`M ${px} 60 C ${px - 60} -10, ${px - 130} -60, ${px - 130} ${py} A 130 130 0 1 1 ${px + 130} ${py} C ${px + 130} -60, ${px + 60} -10, ${px} 60 Z`, F(3.4));   // pin
      goalAt(p, c, S0, px, py, 170, null); if (S0.goal) lab(sub(p), S0.goal, px, 140, {});
      runner(p, c, S0, 100, 20, 120); }); });

  /* 10 ── ARROW: the arrow reaches the goal */
  variant('arrow', 'ลูกศรถึงเป้า', (d, c) => { const S0 = st(d);
    art(c, p => { const B = sub(p); atT(B, p, 0);
      B.path('M -440 -34 L 130 -34 L 130 -90 L 236 0 L 130 90 L 130 34 L -440 34 Z', F(3.4));
      B.circle(370, 0, 125, F(3.2));
      goalAt(p, c, S0, 370, 0, 170, 180);
      whoAt(p, c, S0, -380, -130, 110); }); });

  /* 11 ── ROAD: the road runs to the horizon, where the goal is */
  variant('road', 'ถนนสู่ปลายทาง', (d, c) => { const S0 = st(d);
    art(c, p => { const B = sub(p); atT(B, p, 0);
      B.line(-470, -110, 470, -110, S(1.6));
      B.path('M -340 300 L -30 -110 L 30 -110 L 340 300 Z', F(3.4)); B.line(0, 280, 0, -96, S(2));
      goalAt(p, c, S0, 0, -225, 190, null);
      if (S0.goal) lab(sub(p), S0.goal, 120, -210, { anchor: 'start', maxW: 300 });
      runner(p, c, S0, 0, 130, 130); }); });

  /* 12 ── GAUGE: the needle sweeps to full */
  variant('gauge', 'หน้าปัดเต็ม', (d, c) => { const S0 = st(d), cx = 0, cy = 200, Rr = 320;
    const P = (a, r) => [f1(cx + Math.sin(rad(a)) * r), f1(cy - Math.cos(rad(a)) * r)];
    art(c, p => { const B = sub(p); atT(B, p, 0);
      B.path(`M ${cx - Rr} ${cy} A ${Rr} ${Rr} 0 0 1 ${cx + Rr} ${cy} L ${cx + Rr - 50} ${cy} A ${Rr - 50} ${Rr - 50} 0 0 0 ${cx - Rr + 50} ${cy} Z`, F(3.2));   // the band
      B.path(`M ${cx - Rr + 8} ${cy - 2} A ${Rr - 8} ${Rr - 8} 0 0 1 ${cx + Rr - 8} ${cy - 2} L ${cx + Rr - 42} ${cy - 2} A ${Rr - 42} ${Rr - 42} 0 0 0 ${cx - Rr + 42} ${cy - 2} Z`, { fill: LIT, sw: 0, stroke: 'none' });   // filled to full
      B.line(...P(88, 40), ...P(88, Rr - 70), W(5)); B.circle(cx, cy, 24, F(3));                                            // needle at full
      goalAt(p, c, S0, 0, 50, 170, 275);
      whoAt(p, c, S0, -400, 230, 110); }); });

  /* 13 ── BLOCKS: the blocks stack up and the goal goes on top */
  variant('blocks', 'บล็อกต่อขึ้น', (d, c) => { const S0 = st(d), x = S0.who ? 90 : 0;
    art(c, p => { floor(p, 300); const B = sub(p); atT(B, p, 0);
      [[300, 280], [190, 240], [80, 200]].forEach(([b, w]) => R(B, x - w / 2, b - 110, w, 110, 14, F(3.2)));
      goalAt(p, c, S0, x, -110, 200, null); if (S0.goal) lab(sub(p), S0.goal, x + 130, -110, { anchor: 'start', maxW: 240 });
      whoAt(p, c, S0, -340, 190, 150); }); });

  /* 14 ── DOOR: the door opens and the goal is inside */
  variant('door', 'ประตูเปิด', (d, c) => { const S0 = st(d), x = S0.who ? 100 : 0;
    art(c, p => { floor(p, 300); const B = sub(p); atT(B, p, 0);
      R(B, x - 180, -320, 360, 620, 10, F(3.4)); R(B, x - 160, -300, 320, 600, 4, { fill: LIT, sw: 0, stroke: 'none' });      // frame + light
      B.path(`M ${x - 160} -300 L ${x - 270} -260 L ${x - 270} 260 L ${x - 160} 300 Z`, F(3)); B.circle(x - 248, 10, 9, W(2.4));   // the door, swung open
      goalAt(p, c, S0, x, -40, 220, 190);
      whoAt(p, c, S0, -380, 170, 150); }); });

  /* 15 ── PIN: the pin drops onto the goal */
  variant('pin', 'หมุดปักลง', (d, c) => { const S0 = st(d), x = S0.who ? 100 : 0;
    art(c, p => { const B = sub(p); atT(B, p, 0);
      B.ellipse(x, 290, 150, 26, S(2));
      B.path(`M ${x} 280 C ${x - 80} 170, ${x - 175} 60, ${x - 175} -80 A 175 175 0 1 1 ${x + 175} -80 C ${x + 175} 60, ${x + 80} 170, ${x} 280 Z`, F(3.4));
      goalAt(p, c, S0, x, -90, 190, 85);
      whoAt(p, c, S0, -380, 190, 140); }); });

  /* 16 ── CHART: the line climbs to the goal */
  variant('chart', 'กราฟขึ้นถึงเป้า', (d, c) => { const S0 = st(d), gx = 330, gy = -190;
    art(c, p => { const B = sub(p); atT(B, p, 0);
      B.path('M -420 -300 L -420 270 L 440 270', S(2));
      const pts = [[-380, 200], [-220, 120], [-80, 150], [70, 10], [200, -70]];
      B.poly(pts.concat([[gx - 100, gy + 40]]), W(5)); pts.forEach(([x, y]) => B.circle(x, y, 13, F(2.6)));
      B.circle(gx, gy, 110, F(3.2));
      goalAt(p, c, S0, gx, gy, 150, null); if (S0.goal) lab(sub(p), S0.goal, gx, -20, {});
      whoAt(p, c, S0, -300, -180, 120); }); });

  /* 17 ── THREE DOTS: two steps done, the third (the goal) is reached */
  variant('dots', 'จุดสามขั้น', (d, c) => { const S0 = st(d);
    art(c, p => { const B = sub(p); atT(B, p, 0);
      B.line(-330, 20, 140, 20, W(4));
      [-330, -120].forEach(x => B.circle(x, 20, 44, { fill: C.ink, sw: 2 }));
      B.circle(270, 20, 150, F(3.4));
      goalAt(p, c, S0, 270, 20, 180, 230);
      whoAt(p, c, S0, -330, -130, 110); }); });

  /* 18 ── STAR: the star around the goal lights */
  variant('star', 'ดาวสว่าง', (d, c) => { const S0 = st(d), x = S0.who ? 100 : 0, y = -10, Ro = 300, Ri = 140;
    art(c, p => { const B = sub(p); atT(B, p, 0);
      const pts = []; for (let i = 0; i < 10; i++) { const a = rad(-90 + i * 36), r = i % 2 ? Ri : Ro; pts.push([x + Math.cos(a) * r, y + Math.sin(a) * r]); }
      B.path(rpoly(pts, 30), F(3.4));
      goalAt(p, c, S0, x, y + 10, 170, null); if (S0.goal) lab(sub(p), S0.goal, x, 320, {});
      whoAt(p, c, S0, -390, 180, 130); }); });

  /* 19 ── MEDAL: the goal is on the medal */
  variant('medal', 'เหรียญรางวัล', (d, c) => { const S0 = st(d), x = S0.who ? 100 : 0;
    art(c, p => { const B = sub(p); atT(B, p, 0);
      B.path(`M ${x - 150} -330 L ${x - 60} -330 L ${x + 10} -150 L ${x - 70} -130 Z`, F(3)); B.path(`M ${x + 150} -330 L ${x + 60} -330 L ${x - 10} -150 L ${x + 70} -130 Z`, F(3));   // strap
      B.circle(x, 40, 190, F(3.4)); B.circle(x, 40, 160, S(1.6));
      goalAt(p, c, S0, x, 30, 190, null); if (S0.goal) lab(sub(p), S0.goal, x, 285, {});
      whoAt(p, c, S0, -370, 170, 140); }); });

  /* 20 ── FRAME: the corner marks close in on the goal */
  variant('frame', 'กรอบโฟกัส', (d, c) => { const S0 = st(d), x = S0.who ? 100 : 0, y = -40, k = 200, L = 60;
    art(c, p => { const B = sub(p); atT(B, p, 0);
      [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(([sx, sy]) => B.poly([[x + sx * k, y + sy * (k - L)], [x + sx * k, y + sy * k], [x + sx * (k - L), y + sy * k]], W(6)));
      goalAt(p, c, S0, x, y, 250, 250);
      whoAt(p, c, S0, -380, 170, 140); }); });

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
  G.cats.B08 = { variants: V, SAMPLES, STRESS, draw: (i, d, c) => { setZ(c); CUR = V[i].id; V[i].build(d, c); }, CLAMPS, timing: c => (setZ(c), Object.assign({}, Z)) };
})();
