/* b08.js — category B08 "เป้าหมาย / ผลลัพธ์ / ความสำเร็จ": 20 neutral designs — STILL DRAFTS (round 2, waiting for the user's pick).
   Round 1 (plain symbols: finish post, bar, trophy, medal …) → user: "ขอผลงานที่เป็นมืออาชีพมากกว่านี้ · ที่ผมบอกว่า simple หมายถึงความแตกต่าง
   ตัว design ไม่ใช่คุณภาพงาน · อยากได้ที่เป็นกลาง ไม่ใช่อันที่มีความหมายเฉพาะตัว · ออกแบบใหม่ทั้งหมด ตั้งใจวาด" → round 2 = holders / displays that
   show the goal as reached (the B05 base-set rule: take the icon away and the object tells no story of its own): a picture light, a stage,
   a lift, a shelf, a fill tube, a marquee frame, a rail carriage, a crane, a split-flap board, a shutter, a note board, a locker, a tray,
   a status panel, a hanging sign, a screen, a label printer, an easel, an instant camera, a desk lamp. House level of detail, drawn with care.
   Slots (same as CutPack CATEGORIES.md B08 — references/cutpack-CATEGORIES.md, cat_ai.py): goal THING (what is reached) · who icon (optional,
   who gets there; it stands at the left and the display moves right). A missing / unknown icon → its label in big type.
   GL.cats.B08.draw(i, data, { x, y, s, at, hit, speed }) — canvas 1000 × 700 centred at (0,0); hit = seconds after `at` (default 1.8).
   This round places the parts in their final pose (reached / lit / open); motion comes after the pick. */
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

  const V = [];
  const variant = (id, th, build) => V.push({ id, th, build });
  /* layout: with a `who` the display moves right (O) and who stands on the left */
  const offO = S0 => S0.who ? 90 : 0;
  const whoLeft = (p, c, S0, x = -380, y = 190, w = 140) => whoAt(p, c, S0, x, y, w);

  /* 01 ── PICTURE LIGHT: the goal hangs framed on the wall with its name plate — the picture light above it switches on */
  variant('framelight', 'กรอบรูปไฟส่อง', (d, c) => { const S0 = st(d), O = offO(S0);
    art(c, p => { const B = sub(p); atT(B, p, 0);
      B.shape(P2([[O - 104, -262], [O + 104, -262], [O + 236, 150], [O - 236, 150]]), { fill: 'rgba(255,255,255,.1)', sw: 0, stroke: 'none' });   // the light
      R(B, O - 34, -340, 68, 16, 6, F(2.6)); B.line(O, -324, O, -294, W(4));                                                  // wall mount + arm
      B.path(`M ${O - 122} -294 L ${O + 122} -294 L ${O + 104} -262 L ${O - 104} -262 Z`, F(3.2));                           // the lamp
      R(B, O - 210, -220, 420, 340, 10, F(3.6)); R(B, O - 182, -192, 364, 284, 4, S(1.6));                                    // frame + mat
      R(B, O - 120, 152, 240, 62, 10, F(3));                                                                                    // name plate
      goalAt(p, c, S0, O, -50, 200, 194, { lab: { size: 34, maxW: 210 } });
      whoLeft(p, c, S0); }); });

  /* 02 ── STAGE: the curtains part and the spotlight finds the goal on the stage */
  variant('stage', 'เวทีม่านเปิด', (d, c) => { const S0 = st(d);
    art(c, p => { const B = sub(p); atT(B, p, 0);
      B.shape(P2([[-50, -270], [50, -270], [200, 236], [-200, 236]]), { fill: GLASS, sw: 0, stroke: 'none' });             // spotlight
      R(B, -470, 236, 940, 30, 6, F(3)); B.line(-470, 300, 470, 300, S(2));                                                  // stage edge + floor
      [-1, 1].forEach(s => { B.path(`M ${s * 460} -276 L ${s * 250} -276 Q ${s * 268} -60 ${s * 330} 236 L ${s * 460} 236 Z`, F(3.2));   // curtains, drawn aside
        B.path(`M ${s * 380} -276 Q ${s * 384} -40 ${s * 398} 236`, S(1.6)); R(B, s * 330 - 28, -40, 56, 18, 8, F(2.4)); });    // fold + tie-back
      R(B, -470, -336, 940, 62, 10, F(3.2));                                                                                   // valance
      goalAt(p, c, S0, 0, 30, 220, 200);
      whoAt(p, c, S0, -175, 150, 110); }); });

  /* 03 ── LIFT: the needle over the doors reaches the top floor, the doors slide open on the goal */
  variant('lift', 'ลิฟต์ถึงชั้นบน', (d, c) => { const S0 = st(d), O = offO(S0), dc = [O, -130];
    art(c, p => { const B = sub(p); atT(B, p, 0); B.line(-470, 300, 470, 300, S(2));
      R(B, O - 200, -60, 400, 360, 10, F(3.4));                                                                                 // door frame
      R(B, O - 130, -40, 260, 340, 4, { fill: GLASS, sw: 0, stroke: 'none' });                                                  // light inside
      R(B, O - 180, -40, 50, 340, 4, F(2.8)); R(B, O + 130, -40, 50, 340, 4, F(2.8));                                           // doors, slid open
      B.path(`M ${dc[0] - 150} ${dc[1] + 40} A 150 150 0 0 1 ${dc[0] + 150} ${dc[1] + 40} Z`, F(3.2));                            // dial
      [-58, 0, 58].forEach(a => { const u = rad(a - 90); B.line(f1(dc[0] + Math.cos(u) * 118), f1(dc[1] + 40 + Math.sin(u) * 118), f1(dc[0] + Math.cos(u) * 136), f1(dc[1] + 40 + Math.sin(u) * 136), W(a === 58 ? 4 : 2)); });
      const N = rot(B, 58, dc[0], dc[1] + 40); N.line(dc[0], dc[1] + 40, dc[0], dc[1] - 76, W(5)); B.circle(dc[0], dc[1] + 40, 12, F(2.6));
      goalAt(p, c, S0, O, 100, 190, 262, { lab: { maxW: 240 } });
      whoLeft(p, c, S0); }); });

  /* 04 ── SHELF: the goal is set on the wall shelf, its name tag under it */
  variant('shelf', 'ชั้นโชว์ติดผนัง', (d, c) => { const S0 = st(d), O = offO(S0);
    art(c, p => { const B = sub(p); atT(B, p, 0);
      R(B, O - 280, 96, 560, 26, 6, F(3.2));                                                                                    // shelf board
      [-1, 1].forEach(s => B.path(`M ${O + s * 200} 122 L ${O + s * 200} 218 Q ${O + s * 200} 226 ${O + s * 192} 222 L ${O + s * 120} 122 Z`, F(2.8)));   // brackets
      goalAt(p, c, S0, O, -25, 220, 184, { lab: { maxW: 220 } });
      whoLeft(p, c, S0, -380, 50); }); });

  /* 05 ── FILL TUBE: the tube fills to the top beside the goal */
  variant('tube', 'หลอดเติมเต็ม', (d, c) => { const S0 = st(d), O = offO(S0), x = O + 250;
    art(c, p => { const B = sub(p); atT(B, p, 0);
      R(B, x - 112, 270, 224, 30, 10, F(3)); R(B, x - 58, -290, 116, 570, 58, F(3.4));                                         // stand + tube
      R(B, x - 38, -250, 76, 510, 38, { fill: LIT, sw: 2.4 });                                                                    // full
      R(B, x - 74, -318, 148, 34, 12, F(3));                                                                                    // cap
      [-180, -70, 40, 150].forEach(y => B.line(x + 66, y, x + 92, y, W(2.4))); B.line(x + 66, -236, x + 104, -236, W(4));        // marks + the full mark
      goalAt(p, c, S0, O - 140, -40, 250, 150);
      whoLeft(p, c, S0); }); });

  /* 06 ── MARQUEE: the bulbs round the frame light up and the goal shines in the middle */
  variant('marquee', 'กรอบหลอดไฟ', (d, c) => { const S0 = st(d), O = offO(S0), w = 520, h = 480, x0 = O - w / 2, y0 = -270;
    art(c, p => { const B = sub(p); atT(B, p, 0);
      R(B, x0, y0, w, h, 34, F(3.4)); R(B, x0 + 58, y0 + 58, w - 116, h - 116, 14, S(1.6));
      const bulbs = []; for (let i = 0; i <= 6; i++) { const x = x0 + 70 + i * (w - 140) / 6; bulbs.push([x, y0 + 29], [x, y0 + h - 29]); }
      for (let i = 1; i <= 4; i++) { const y = y0 + 29 + i * (h - 58) / 5; bulbs.push([x0 + 29, y], [x0 + w - 29, y]); }
      bulbs.forEach(([x, y]) => B.circle(f1(x), f1(y), 13, { fill: C.ink, sw: 1.6 }));
      goalAt(p, c, S0, O, -50, 220, 125);
      whoLeft(p, c, S0); }); });

  /* 07 ── RAIL: the carriage carrying the goal glides along the rail to the end stop */
  variant('rail', 'รางเลื่อนถึงปลาย', (d, c) => { const S0 = st(d), cx = 260;
    art(c, p => { const B = sub(p); atT(B, p, 0); B.line(-470, 300, 470, 300, S(2));
      [-380, 380].forEach(x => { R(B, x - 12, 186, 24, 110, 6, F(2.8)); R(B, x - 40, 286, 80, 14, 5, F(2.4)); });              // supports
      R(B, -440, 166, 880, 22, 11, F(3)); R(B, -428, 118, 30, 48, 6, F(2.6)); R(B, 398, 118, 30, 48, 6, F(2.6));               // rail + end stops
      R(B, cx - 120, 104, 240, 56, 16, F(3.2)); [cx - 76, cx + 76].forEach(x => B.circle(x, 166, 15, F(2.6)));                // carriage + wheels
      R(B, cx - 12, 8, 24, 98, 5, F(2.8)); R(B, cx - 130, -280, 260, 290, 16, F(3.2));                                         // post + card
      goalAt(p, c, S0, cx, -160, 180, -30, { lab: { maxW: 230, size: 38 } });
      whoAt(p, c, S0, -300, 60, 150); }); });

  /* 08 ── CRANE: the crane lowers the goal onto its marked spot */
  variant('crane', 'เครนวางลงที่หมาย', (d, c) => { const S0 = st(d), x = 90;
    art(c, p => { const B = sub(p); atT(B, p, 0); B.line(-470, 300, 470, 300, S(2));
      R(B, -470, -338, 940, 30, 8, F(3)); R(B, x - 70, -318, 140, 50, 10, F(3.2)); [x - 40, x + 40].forEach(xx => B.circle(xx, -318, 12, F(2.4)));   // beam + trolley
      B.line(x, -268, x, -40, W(2.4)); R(B, x - 34, -50, 68, 40, 8, F(3)); B.path(`M ${x} -10 L ${x} 16 Q ${x} 40 ${x + 22} 40 Q ${x + 40} 40 ${x + 40} 22`, { sw: 8 });   // cable, block, hook
      R(B, x - 170, 290, 340, 18, 6, F(2.6));                                                                                  // the marked spot
      goalAt(p, c, S0, x, 180, 210, null); if (S0.goal) lab(sub(p), S0.goal, x + 150, 200, { anchor: 'start', maxW: 220 });
      whoAt(p, c, S0, -330, 200, 140); }); });

  /* 09 ── SPLIT-FLAP: the board's flaps fall and settle on the goal */
  variant('splitflap', 'แผ่นพลิกแสดงผล', (d, c) => { const S0 = st(d), O = offO(S0);
    art(c, p => { const B = sub(p); atT(B, p, 0);
      R(B, O - 220, -270, 440, 470, 26, F(3.4)); R(B, O - 190, -240, 380, 410, 14, F(2.8));
      B.line(O - 190, -35, O + 190, -35, { sw: 9, stroke: '#040404' }); B.line(O - 190, -35, O + 190, -35, S(1.4)); [-1, 1].forEach(s => R(B, O + s * 200 - 8, -52, 16, 34, 5, F(2.4)));
      goalAt(p, c, S0, O, -90, 210, 120);
      whoLeft(p, c, S0); }); });

  /* 10 ── SHUTTER: the shutter rolls up and the goal is in the window */
  variant('shutter', 'บานม้วนเปิด', (d, c) => { const S0 = st(d), O = offO(S0);
    art(c, p => { const B = sub(p); atT(B, p, 0);
      R(B, O - 250, -230, 500, 490, 10, F(3.4)); R(B, O - 226, -206, 452, 442, 4, { fill: GLASS, sw: 0, stroke: 'none' });   // window + light
      R(B, O - 226, -206, 452, 34, 4, F(2.8)); R(B, O - 226, -176, 452, 14, 5, F(2.6));                                      // shutter rolled up + its bottom rail
      R(B, O - 276, -292, 552, 70, 18, F(3.2)); R(B, O - 284, 258, 568, 26, 8, F(3));                                        // roller box + sill
      goalAt(p, c, S0, O, 30, 230, 210);
      whoLeft(p, c, S0); }); });

  /* 11 ── NOTE BOARD: the note with the goal is pinned to the board */
  variant('noteboard', 'บอร์ดปักหมุด', (d, c) => { const S0 = st(d), O = offO(S0);
    art(c, p => { const B = sub(p); atT(B, p, 0);
      R(B, O - 270, -280, 540, 520, 16, F(3.4)); R(B, O - 244, -254, 488, 468, 8, S(1.6));                                    // board + frame
      const N = rot(B, -3, O, -40); N.path(`M ${O - 150} -200 L ${O + 150} -200 L ${O + 150} 90 L ${O + 100} 140 L ${O - 150} 140 Z`, F(3.2)); N.path(`M ${O + 100} 140 L ${O + 108} 98 L ${O + 150} 90`, S(1.6));
      N.circle(O, -176, 16, F(3)); N.line(O + 4, -162, O + 9, -146, W(2));                                                     // pin
      goalAt(p, c, S0, O, -60, 190, 95, { lab: { maxW: 250 } });
      whoLeft(p, c, S0); }); });

  /* 12 ── LOCKER: the locker door swings open and the goal is inside */
  variant('locker', 'ล็อกเกอร์เปิด', (d, c) => { const S0 = st(d), O = offO(S0);
    art(c, p => { const B = sub(p); atT(B, p, 0); B.line(-470, 300, 470, 300, S(2));
      R(B, O - 180, -320, 360, 620, 12, F(3.4)); R(B, O - 156, -296, 312, 572, 6, { fill: GLASS, sw: 0, stroke: 'none' });    // cabinet + light
      B.line(O - 156, 120, O + 156, 120, W(2.6));                                                                               // shelf
      B.path(`M ${O + 180} -320 L ${O + 300} -280 L ${O + 300} 260 L ${O + 180} 300 Z`, F(3.2));                               // the door, swung open
      [-230, -205, -180].forEach(y => B.line(O + 214, y + 6, O + 270, y + 20, S(1.6))); R(B, O + 270, -20, 12, 60, 5, F(2.2));  // vents + handle
      goalAt(p, c, S0, O, -40, 220, 200);
      whoLeft(p, c, S0, -390); }); });

  /* 13 ── TRAY: the goal's card is dropped into the top tray */
  variant('tray', 'ถาดเอกสาร', (d, c) => { const S0 = st(d), O = offO(S0);
    art(c, p => { const B = sub(p); atT(B, p, 0); B.line(-470, 300, 470, 300, S(2));
      [-1, 1].forEach(s => R(B, O + s * 270 - 14, 100, 28, 200, 6, F(2.8)));                                                    // side posts
      R(B, O - 190, -230, 380, 400, 14, F(3.2));                                                                                // the card
      [[130, 90], [230, 64]].forEach(([y, h]) => { B.path(`M ${O - 262} ${y} L ${O + 262} ${y} L ${O + 262} ${y + h - 14} Q ${O + 262} ${y + h} ${O + 248} ${y + h} L ${O - 248} ${y + h} Q ${O - 262} ${y + h} ${O - 262} ${y + h - 14} Z`, F(3.2));
        B.path(`M ${O - 50} ${y} A 50 26 0 0 0 ${O + 50} ${y}`, S(1.8)); });                                                   // trays + finger notches
      goalAt(p, c, S0, O, -90, 200, 80);
      whoLeft(p, c, S0, -390, 120); }); });

  /* 14 ── STATUS PANEL: the panel's lights fill one by one and the screen shows the goal */
  variant('panel', 'แผงไฟสถานะ', (d, c) => { const S0 = st(d), O = offO(S0);
    art(c, p => { const B = sub(p); atT(B, p, 0);
      R(B, O - 240, -290, 480, 560, 32, F(3.4)); R(B, O - 204, -254, 408, 300, 16, F(2.8));                                  // body + screen
      [-2, -1, 0, 1, 2].forEach(i => R(B, O + i * 74 - 30, 98, 60, 30, 12, { fill: LIT, sw: 2.6 }));                         // status lights, all on
      B.circle(O, 196, 28, F(3)); B.circle(O, 196, 12, W(2));                                                                   // button
      goalAt(p, c, S0, O, -130, 190, 10);
      whoLeft(p, c, S0); }); });

  /* 15 ── HANGING SIGN: the sign swings on its wall bracket and settles, showing the goal */
  variant('hangsign', 'ป้ายแขวนกิ่ง', (d, c) => { const S0 = st(d), x = 60;
    art(c, p => { const B = sub(p); atT(B, p, 0);
      R(B, -330, -330, 36, 140, 8, F(3)); B.line(-294, -300, 300, -300, W(5)); B.line(-294, -220, -150, -300, W(3.6));          // wall plate, arm, brace
      B.circle(300, -300, 9, F(2.4));
      [x - 150, x + 150].forEach(xx => { B.line(xx, -300, xx, -246, W(2.4)); B.circle(xx, -300, 8, F(2.2)); });               // hooks
      R(B, x - 210, -246, 420, 380, 20, F(3.4));
      goalAt(p, c, S0, x, -80, 210, 90);
      whoAt(p, c, S0, -380, 230, 120); }); });

  /* 16 ── SCREEN: the progress bar on the screen completes and the goal comes up */
  variant('screen', 'จอโหลดเสร็จ', (d, c) => { const S0 = st(d), O = offO(S0);
    art(c, p => { const B = sub(p); atT(B, p, 0);
      R(B, O - 270, -300, 540, 380, 22, F(3.4)); R(B, O - 246, -276, 492, 332, 10, S(1.6));                                  // monitor + screen
      R(B, O - 26, 80, 52, 96, 6, F(3)); R(B, O - 140, 176, 280, 26, 10, F(3));                                                // neck + base
      R(B, O - 190, 0, 380, 34, 17, F(2.8)); R(B, O - 184, 6, 368, 22, 11, { fill: LIT, sw: 0, stroke: 'none' });            // progress bar, full
      goalAt(p, c, S0, O, -175, 160, -42, { lab: { size: 36, maxW: 300 } });
      whoLeft(p, c, S0); }); });

  /* 17 ── LABEL PRINTER: the printer runs out the goal's label */
  variant('labelprinter', 'เครื่องพิมพ์ฉลาก', (d, c) => { const S0 = st(d), O = S0.who ? 40 : -30;
    art(c, p => { const B = sub(p); atT(B, p, 0);
      { let z = `M ${O - 110} -70 L ${O + 440} -70`; for (let i = 1; i <= 8; i++) z += ` L ${O + (i % 2 ? 460 : 440)} ${-70 + i * 25}`; B.path(z + ` L ${O - 110} 130 Z`, F(3.2)); }   // the label strip (zigzag cut end)
      R(B, O - 330, -130, 240, 320, 34, F(3.4)); R(B, O - 296, -100, 172, 84, 12, F(2.6));                                    // printer + display
      for (let r = 0; r < 2; r++) for (let k = 0; k < 3; k++) R(B, O - 292 + k * 58, 10 + r * 56, 46, 42, 9, F(2.2));          // keys
      R(B, O - 98, -60, 14, 180, 5, F(2.4));                                                                                    // the exit slot
      goalAt(p, c, S0, O + 50, 30, 150, null); if (S0.goal) lab(sub(p), S0.goal, O + 270, 46, { maxW: 250, size: 44 });
      whoAt(p, c, S0, -380, 260, 110); }); });

  /* 18 ── EASEL: the cloth is pulled off the canvas on the easel and the goal is unveiled */
  variant('easel', 'ขาตั้งเปิดผ้าคลุม', (d, c) => { const S0 = st(d), O = offO(S0);
    art(c, p => { const B = sub(p); atT(B, p, 0); B.line(-470, 300, 470, 300, S(2));
      B.line(O, -330, O, 290, W(4)); B.line(O - 70, -300, O - 210, 300, W(5)); B.line(O + 70, -300, O + 210, 300, W(5));         // legs
      R(B, O - 230, 110, 460, 26, 8, F(3));                                                                                     // ledge
      R(B, O - 210, -290, 420, 400, 8, F(3.4));                                                                                 // canvas
      B.path(`M ${O + 214} -280 C ${O + 300} -200, ${O + 250} -20, ${O + 300} 100 C ${O + 330} 180, ${O + 300} 250, ${O + 330} 296 L ${O + 240} 296 C ${O + 250} 200, ${O + 230} 120, ${O + 222} 40 Z`, F(3));   // the cloth, pulled aside
      goalAt(p, c, S0, O, -100, 220, 75);
      whoLeft(p, c, S0, -400); }); });

  /* 19 ── INSTANT CAMERA: the camera prints the photo — the goal develops on it */
  variant('camera', 'กล้องพิมพ์รูป', (d, c) => { const S0 = st(d), O = offO(S0);
    art(c, p => { const B = sub(p); atT(B, p, 0);
      R(B, O - 160, -10, 320, 300, 16, F(3.2)); R(B, O - 130, 20, 260, 200, 6, { fill: GLASS, sw: 2 });                       // the photo
      R(B, O - 230, -300, 460, 290, 40, F(3.4));                                                                                // camera body
      B.circle(O, -150, 92, F(3.2)); B.circle(O, -150, 56, S(1.8)); R(B, O + 130, -270, 70, 40, 10, F(2.6));                  // lens, flash
      R(B, O - 190, -32, 380, 16, 6, F(2.6));                                                                                   // the slot
      goalAt(p, c, S0, O, 115, 150, 260, { lab: { maxW: 260, size: 36 } });
      whoLeft(p, c, S0); }); });

  /* 20 ── LAMP: the desk lamp turns on and lights the goal on the desk */
  variant('lamp', 'โคมไฟส่อง', (d, c) => { const S0 = st(d), lx = -260;
    art(c, p => { const B = sub(p); atT(B, p, 0);
      B.line(-470, 270, 470, 270, S(2));                                                                                         // desk
      B.shape(P2([[lx + 150, -170], [lx + 210, -230], [480, 250], [20, 270]]), { fill: GLASS, sw: 0, stroke: 'none' });         // the light
      R(B, lx - 90, 246, 180, 24, 8, F(3)); B.line(lx, 246, lx - 60, 30, W(5)); B.line(lx - 60, 30, lx + 90, -200, W(5));          // base, arms
      [[lx, 246], [lx - 60, 30]].forEach(([x, y]) => B.circle(x, y, 13, F(2.6)));
      const sh = rot(B, 45, lx + 120, -220); sh.path(`M ${lx + 70} -220 L ${lx + 170} -220 L ${lx + 200} -140 L ${lx + 40} -140 Z`, F(3.2));   // shade
      goalAt(p, c, S0, 240, 90, 220, 260);
      whoAt(p, c, S0, -40, 190, 110); }); });

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
