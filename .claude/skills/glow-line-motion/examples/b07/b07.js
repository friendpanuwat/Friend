/* b07.js — category B07 "คำเตือน / ปัญหา": 20 neutral designs — STILL DRAFTS (round 1, waiting for the user's pick).
   Slots (same as CutPack CATEGORIES.md B07 — references/cutpack-CATEGORIES.md, cat_ai.py): thing THING (the risky thing or act) ·
   how 'cross' (do not do it) | 'flag' (be careful) · sign icon (optional: triangle-alert, octagon-alert, shield-alert …).
   The picture: the thing as it is + a warning symbol. cross → a prohibition mark lies OVER the thing (ring + slash, tapes or chains
   across it, a barrier arm in front of it …). flag → a warning sign stands BESIDE the thing (the sign icon when given, else a warning
   triangle). In this skill the symbol is white glow like everything else (CutPack draws it red; the skill has no colour).
   Every design is a real warning device with a mechanism (road sign, boom barrier, barrier tape, signal lights, floor stand, chain + padlock,
   phone alert, pressure gauge, rotating beacon, rope stanchions, walk-through detector, megaphone, radar, label printer, door hanger,
   alarm bell, inspection clipboard, wire fence, traffic cones, emergency stop button).
   GL.cats.B07.draw(i, data, { x, y, s, at, hit, speed }) — canvas 1000 × 700 centred at (0,0); hit = seconds after `at` (default 1.6).
   Built on the timing system of b06.js. This round places the parts in their final pose; motion comes after the pick. */
(function () {
  const G = window.GL, C = G.C, NS = 'http://www.w3.org/2000/svg';
  const W = (w = 2) => ({ sw: w }), F = (w = 3.2) => ({ fill: C.fill, sw: w }), S = (w = 2) => ({ sw: w, stroke: C.soft });
  const rad = d => d * Math.PI / 180, f1 = v => +v.toFixed(1);
  const GLASS = 'rgba(255,255,255,.07)', INK = { fill: C.ink, sw: 1.6 };

  /* TIMING (same system as b01–b06): the keyword c.hit comes from the speech and never moves. M = how long each move takes = 1 / speed
     (c.speed, else GL.stage / GL.motion speed) but at most hit / HIT0. tu(x) = x·M · bH(x) / aH(x) = before / after the keyword. */
  const HIT0 = 1.6; let Z = null; const CLAMPS = {}; let CUR = '';
  function setZ(c) { const sp = Math.min(20, Math.max(.05, +(c.speed ?? G.motion().speed ?? 1) || 1)), H = c.hit ?? HIT0, M = Math.max(.4, Math.min(1 / sp, H / HIT0));
    Z = { sp: 1 / M, want: sp, M, H }; }
  const tu = x => x * Z.M, bH = x => Z.H - x * Z.M, aH = x => Z.H + x * Z.M;
  function fixT(spec) { for (const n in spec) { const k = spec[n]; if (!Array.isArray(k)) continue;
    for (let i = 1; i < k.length; i++) if (k[i][0] < k[i - 1][0] - 1e-9) { k[i] = [k[i - 1][0], k[i][1], k[i][2]]; CLAMPS[CUR] = (CLAMPS[CUR] || 0) + 1; } } return spec; }
  const kf = (e, t, spec) => G.kf(e, t, fixT(spec));

  /* ---------- plumbing (same family as b06.js) ---------- */
  const TR = ['x', 'y', 'r', 's', 'sx', 'sy'];
  const sub = (p, a) => { const q = p.child(a || {}); q.H = p.H; q.motion = p.motion; return q; };
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

  /* ---------- the warning symbols ---------- */
  /* prohibition mark (ring + slash) over a thing, radius r */
  function noMark(q, x, y, r) { const ri = r * .8, w = r * .15, a = ri * .72, n = w / 2 * .7071;
    q.shape(P2([[x - a - n, y - a + n], [x - a + n, y - a - n], [x + a + n, y + a - n], [x + a - n, y + a + n]]), F(3));
    ring(q, x, y, r, ri, F(3.4)); }
  /* warning triangle with "!" — height h, centred at (x, y) */
  function warnTri(q, x, y, h) { const w = h * 1.16;
    q.path(rpoly([[x, y - h / 2], [x + w / 2, y + h / 2], [x - w / 2, y + h / 2]], h * .1), F(3.4));
    q.path(rpoly([[x - h * .05, y - h * .12], [x + h * .05, y - h * .12], [x + h * .032, y + h * .2], [x - h * .032, y + h * .2]], h * .02), INK);
    q.circle(x, y + h * .32, h * .052, INK); }
  /* ✕ badge, round */
  function xBadge(q, x, y, r) { const k = r * .4; q.circle(x, y, r, F(3.2)); q.line(x - k, y - k, x + k, y + k, W(5.5)); q.line(x + k, y - k, x - k, y + k, W(5.5)); }
  /* no-entry plate: disc + bar */
  function noEntry(q, x, y, r) { q.circle(x, y, r, F(3.4)); R(q, x - r * .6, y - r * .15, r * 1.2, r * .3, r * .1, INK); }
  /* the flag-mode sign beside the thing: the sign icon (when given and known) or the drawn triangle. Returns true when the icon was used. */
  function flagSign(q, c, D, x, y, h, o = {}) { if (D.sign && picOf({ icon: D.sign })) { pic({ icon: D.sign }, x, y, h * 1.1, c, o); return true; } warnTri(q, x, y, h); return false; }

  /* ---------- the data ---------- */
  function st(d) { return { thing: d.thing || null, cross: d.how === 'cross', sign: d.sign || null }; }
  const picOf = it => it && it.icon && (G.icons[it.icon] || G.icons[it.icon + '-pro']);
  /* a THING's picture at (cx, cy), width wd; no picture → its label in big type */
  function pic(it, cx, cy, wd, c, o = {}) {
    if (!it) return null; const at = c.at || 0, X = c.x + cx * c.s, Y = c.y + cy * c.s, fn = picOf(it), t = o.t ?? tu(.12);
    let a;
    if (fn) a = G.art(fn, { x: X, y: Y, w: wd * c.s, at: at + t, speed: Z.sp });
    else { const str = it.label || it.icon; if (!str) return null;
      const f = q => txt(q, str, 0, wd * .13, { size: wd * .27, maxW: wd * .95, weight: 700, color: C.ink }); f.custom = true; f.dur = .3; f.exit = 'pop';
      a = G.art(f, { x: X, y: Y, s: c.s, at: at + t, speed: 1 }); a.speed = Z.sp; }
    if (o.r) kf(a.wrap, at, { r: [[0, o.r]], ox: X, oy: Y });
    return a;
  }
  /* a THING's label (only when it has a picture — else the label already is the picture) */
  const lab = (q, it, x, y, o = {}) => it && it.label && picOf(it) ? txt(q, it.label, x, y, Object.assign({ maxW: 300, color: C.ink, weight: 700 }, o)) : null;
  /* the thing: picture + label under it */
  function thingAt(p, c, S0, x, y, w, ly, o = {}) { if (!S0.thing) return; pic(S0.thing, x, y, w, c, o); if (ly != null) lab(sub(p), S0.thing, x, ly, o.lab || {}); }

  const V = [];
  const variant = (id, th, build) => V.push({ id, th, build });

  /* 01 ── ROAD SIGN: cross → a round prohibition plate on a post, the thing inside it, struck through; flag → the thing, and beside it
     a warning plate on a post */
  variant('roadsign', 'ป้ายจราจร', (d, c) => {
    const S0 = st(d);
    if (S0.cross) {
      art(c, p => { floor(p, 300);
        const B = sub(p); atT(B, p, 0);
        R(B, -70, 286, 140, 14, 5, F(2.6)); R(B, -15, 30, 30, 260, 6, F(3)); B.line(-5, 120, -5, 280, S(1.4));                       // base + post
        R(B, -34, 70, 68, 22, 5, F(2.4)); R(B, -34, -150, 68, 22, 5, F(2.4));                                                         // clamps
        B.circle(0, -95, 205, F(3.4)); B.circle(0, -95, 190, S(1.4));                                                                   // the plate (folded rim)
        if (S0.thing && S0.thing.label && picOf(S0.thing)) R(B, -165, 150, 330, 82, 12, F(3));                                       // label plate (only with a label)
        thingAt(p, c, S0, 0, -95, 210, 207, { lab: { maxW: 240, size: 40 } });
      });
      over(c, p => { const g = sub(p); atT(g, p, .1); noMark(g, 0, -95, 172); });
    } else art(c, p => { floor(p, 300);
      thingAt(p, c, S0, -210, -20, 240, 160);
      const B = sub(p); atT(B, p, 0); const x = 250;
      R(B, x - 60, 286, 120, 14, 5, F(2.6)); R(B, x - 14, -150, 28, 440, 6, F(3)); B.line(x - 4, -60, x - 4, 280, S(1.4));
      R(B, x - 32, -120, 64, 20, 5, F(2.4)); R(B, x - 32, -10, 64, 20, 5, F(2.4));
      flagSign(B, c, S0, x, -95, 240);
    });
  });

  /* 02 ── BOOM BARRIER: a striped arm on its post — cross → the arm lies across the thing and a no-entry plate hangs from it;
     flag → the arm stands raised, the lamp on the post glows and the warning plate is on the post */
  function arm(q, x0, y0, L, h) {                                                                                 // striped arm, drawn horizontal
    q.path(rpoly([[x0, y0 - h / 2], [x0 + L, y0 - h / 2], [x0 + L, y0 + h / 2], [x0, y0 + h / 2]], h * .45), F(3.2));
    for (let s = 70; s < L - 40; s += 74) q.shape(P2([[x0 + s, y0 - h / 2 + 3], [x0 + s + 34, y0 - h / 2 + 3], [x0 + s + 34 - h + 6, y0 + h / 2 - 3], [x0 + s - h + 6, y0 + h / 2 - 3]]), { fill: GLASS, sw: 1.6, stroke: C.soft });
    q.circle(x0 + L - 26, y0, 9, W(2)); }
  variant('barrier', 'ไม้กั้นทาง', (d, c) => {
    const S0 = st(d), px = -345, py = 60, up = S0.cross ? 0 : -32;
    art(c, p => { floor(p, 300);
      thingAt(p, c, S0, 150, S0.cross ? -40 : -10, 220, S0.cross ? 165 : 160);
      const B = sub(p); atT(B, p, 0);
      R(B, -410, 70, 130, 230, 14, F(3.4)); R(B, -425, 56, 160, 22, 8, F(3)); [150, 175, 200].forEach(y => B.line(-388, y, -302, y, S(1.6)));   // cabinet, cap, vents
      R(B, -330, 240, 16, 26, 4, F(2.2));                                                                                         // lock
      const lit = !S0.cross; B.path('M -375 56 L -375 30 A 30 30 0 0 1 -315 30 L -315 56 Z', lit ? { fill: GLASS, sw: 4 } : F(3)); B.line(-375, 30, -315, 30, S(1.4));   // lamp
      if (lit) [[-395, 8, -418, -6], [-345, -12, -345, -40], [-295, 8, -272, -6]].forEach(([a, b, e, f]) => B.line(a, b, e, f, W(3)));
      const A = rot(B, up, px, py); arm(A, px, py, S0.cross ? 730 : 640, 40); R(A, px - 92, py - 16, 62, 32, 6, F(2.8));                           // arm + counterweight
      B.circle(px, py, 30, F(3.2)); B.circle(px, py, 10, W(2.4));
      if (S0.cross) { const k = sub(p); k.line(370, py + 20, 370, py + 52, W(2.4)); noEntry(k, 370, py + 108, 58); }
      else flagSign(B, c, S0, -345, 175, 92);
    });
  });

  /* 03 ── BARRIER TAPE: two posts with tape reels — cross → two tapes cross over the thing; flag → one tape runs in front of it with a
     warning tag hanging from it */
  function tape(q, x1, y1, x2, y2, w = 38) { const L = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / L, uy = (y2 - y1) / L, nx = -uy * w / 2, ny = ux * w / 2;
    q.shape(P2([[x1 + nx, y1 + ny], [x2 + nx, y2 + ny], [x2 - nx, y2 - ny], [x1 - nx, y1 - ny]]), { fill: GLASS, sw: 2.6 });   // see-through tape
    for (let s = 30; s < L - 30; s += 56) { const a = s - w * .4, b = s + w * .4, k = .78;
      q.shape(P2([[x1 + ux * a - nx * k, y1 + uy * a - ny * k], [x1 + ux * (a + 22) - nx * k, y1 + uy * (a + 22) - ny * k], [x1 + ux * (b + 22) + nx * k, y1 + uy * (b + 22) + ny * k], [x1 + ux * b + nx * k, y1 + uy * b + ny * k]]), { fill: GLASS, sw: 1.4, stroke: C.soft }); } }
  function tapePost(q, x) { q.ellipse(x, 296, 62, 12, F(2.6)); R(q, x - 15, -10, 30, 300, 8, F(3)); q.line(x - 5, 20, x - 5, 280, S(1.4));
    R(q, x - 40, -70, 80, 74, 16, F(3.2)); q.circle(x, -33, 18, W(2.2)); q.circle(x, -33, 5, W(2)); }
  variant('tape', 'เทปกั้นเขต', (d, c) => {
    const S0 = st(d);
    art(c, p => { floor(p, 300);
      thingAt(p, c, S0, 0, S0.cross ? 40 : -60, 250, S0.cross ? null : 95);
      const B = sub(p); atT(B, p, 0); [-370, 370].forEach(x => tapePost(B, x));
      if (!S0.cross) { tape(B, -340, 160, 340, 160); B.line(0, 178, 0, 196, W(2)); flagSign(B, c, S0, 0, 248, 100); }
    });
    if (S0.cross) over(c, p => { const g = sub(p); atT(g, p, .1); tape(g, -345, -25, 345, 220, 32); tape(g, 345, -25, -345, 220, 32);
      if (S0.thing && S0.thing.label && picOf(S0.thing)) lab(g, S0.thing, 0, -130, {}); });
  });

  /* 04 ── SIGNAL LIGHTS: a signal head beside the thing — cross → the top lamp lights with ✕ and the thing is struck through;
     flag → the middle lamp lights with "!" */
  variant('lights', 'ไฟสัญญาณ', (d, c) => {
    const S0 = st(d), x = 250, ys = [-200, -60, 80], on1 = S0.cross ? 0 : 1;
    art(c, p => { floor(p, 300);
      thingAt(p, c, S0, -210, -40, 240, S0.cross ? 170 : 140);
      const B = sub(p); atT(B, p, 0);
      R(B, x - 60, 286, 120, 14, 5, F(2.6)); R(B, x - 15, 160, 30, 130, 6, F(3));
      R(B, x - 85, -285, 170, 450, 34, F(3.4)); R(B, x - 110, -250, 25, 380, 8, F(2.6));                                    // housing + side bracket
      ys.forEach((y, i) => { const lit = i === on1;
        B.path(`M ${x - 66} ${y - 22} A 66 66 0 0 1 ${x + 66} ${y - 22} L ${x + 74} ${y - 50} A 80 80 0 0 0 ${x - 74} ${y - 50} Z`, F(2.6));   // visor
        B.circle(x, y, 52, lit ? { fill: GLASS, sw: 4.4 } : F(3));
        if (lit) { B.circle(x, y, 70, S(2));
          if (S0.cross) { B.line(x - 20, y - 20, x + 20, y + 20, W(6)); B.line(x + 20, y - 20, x - 20, y + 20, W(6)); }
          else { R(B, x - 6, y - 28, 12, 36, 5, INK); B.circle(x, y + 22, 7, INK); } }
        else B.circle(x, y, 30, S(1.4)); });
    });
    if (S0.cross) over(c, p => { const g = sub(p); atT(g, p, .1); noMark(g, -210, -40, 160); });
  });

  /* 05 ── FLOOR STAND: an A-frame floor sign — cross → the thing is on its panel, struck through; flag → the stand shows the warning,
     next to the thing */
  function aframe(q, x, top, bot, wt, wb) {
    q.path(rpoly([[x - wt / 2 + 6, top + 14], [x + wt / 2 - 6, top + 14], [x + wb / 2 + 34, bot], [x - wb / 2 - 34, bot]], 20), F(2.6));   // the back panel, splayed behind
    q.path(rpoly([[x - wt / 2, top], [x + wt / 2, top], [x + wb / 2, bot], [x - wb / 2, bot]], 22), F(3.4));
    R(q, x - 46, top + 22, 92, 30, 14, F(2.4));                                                                                // handle slot
    R(q, x - wb / 2 - 4, bot - 8, 46, 16, 5, F(2.4)); R(q, x + wb / 2 - 42, bot - 8, 46, 16, 5, F(2.4)); }                     // feet
  variant('aframe', 'ป้ายตั้งพื้น', (d, c) => {
    const S0 = st(d);
    if (S0.cross) {
      art(c, p => { floor(p, 300); const B = sub(p); atT(B, p, 0); aframe(B, 0, -300, 290, 260, 380); thingAt(p, c, S0, 0, -50, 200, 205, { lab: { maxW: 280 } }); });
      over(c, p => { const g = sub(p); atT(g, p, .1); noMark(g, 0, -50, 140); });
    } else art(c, p => { floor(p, 300); thingAt(p, c, S0, -220, -20, 240, 160); const B = sub(p); atT(B, p, 0); aframe(B, 230, -250, 290, 230, 340); flagSign(B, c, S0, 230, 10, 170); });
  });

  /* 06 ── CHAIN + PADLOCK: cross → two chains cross over the thing, locked; flag → a chain hangs in front of it with a warning tag */
  function chain(q, pts, L = 46) {                                                                               // links along a polyline
    for (let i = 0; i < pts.length - 1; i++) { const [x1, y1] = pts[i], [x2, y2] = pts[i + 1], D = Math.hypot(x2 - x1, y2 - y1), n = Math.max(1, Math.round(D / (L * .78)));
      for (let k = 0; k < n; k++) { const t = (k + .5) / n, x = x1 + (x2 - x1) * t, y = y1 + (y2 - y1) * t, a = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI, g = rot(q, a, x, y);
        if ((k + i) % 2) R(g, x - L / 2, y - 6, L, 12, 6, F(2.6)); else { R(g, x - L / 2, y - 15, L, 30, 15, F(2.8)); R(g, x - L / 2 + 12, y - 4, L - 24, 8, 4, S(1.4)); } } } }
  function eye(q, x, y) { R(q, x - 26, y - 26, 52, 52, 10, F(2.8)); q.circle(x, y, 13, W(2.4)); }
  function padlock(q, x, y, s = 1) { q.path(`M ${x - 30 * s} ${y} L ${x - 30 * s} ${y - 34 * s} A ${30 * s} ${30 * s} 0 0 1 ${x + 30 * s} ${y - 34 * s} L ${x + 30 * s} ${y}`, { sw: 12 }); q.path(`M ${x - 30 * s} ${y} L ${x - 30 * s} ${y - 34 * s} A ${30 * s} ${30 * s} 0 0 1 ${x + 30 * s} ${y - 34 * s} L ${x + 30 * s} ${y}`, { sw: 6, stroke: C.fill });
    R(q, x - 50 * s, y - 6 * s, 100 * s, 84 * s, 14 * s, F(3.2)); q.circle(x, y + 28 * s, 9 * s, W(2.4)); q.line(x, y + 37 * s, x, y + 56 * s, W(3)); }
  variant('chain', 'โซ่คล้องกุญแจ', (d, c) => {
    const S0 = st(d);
    if (S0.cross) {
      art(c, p => { const B = sub(p); atT(B, p, 0); [[-330, -250], [330, -250], [-330, 220], [330, 220]].forEach(([x, y]) => eye(B, x, y)); thingAt(p, c, S0, 0, -15, 230, null); });
      over(c, p => { const g = sub(p); atT(g, p, .1); chain(g, [[-310, -230], [310, 200]]); chain(g, [[310, -230], [-310, 200]]); padlock(g, 215, 150, 1);
        if (S0.thing && S0.thing.label && picOf(S0.thing)) lab(g, S0.thing, 0, 300, {}); });
    } else art(c, p => {
      thingAt(p, c, S0, 0, -120, 220, 30);
      const B = sub(p); atT(B, p, 0); eye(B, -360, 70); eye(B, 360, 70);
      const cat = []; for (let i = 0; i <= 8; i++) { const t = i / 8, x = -340 + 680 * t; cat.push([x, 70 + 120 * (1 - Math.pow(2 * t - 1, 2))]); }
      chain(B, cat, 42); B.circle(0, 205, 14, W(3)); flagSign(B, c, S0, 0, 278, 100);
    });
  });

  /* 07 ── PHONE ALERT: the thing on a phone screen — an alert banner drops in; cross → ✕ on the banner and the thing struck through;
     flag → the banner carries the warning */
  variant('phone', 'มือถือแจ้งเตือน', (d, c) => {
    const S0 = st(d);
    art(c, p => {
      const B = sub(p); atT(B, p, 0);
      R(B, -175, -330, 350, 650, 52, F(3.4)); R(B, -152, -306, 304, 602, 34, S(1.6)); R(B, -42, -292, 84, 22, 11, F(2.2));     // body, screen edge, island
      R(B, -183, -200, 10, 60, 4, F(2)); R(B, -183, -120, 10, 60, 4, F(2)); R(B, 173, -170, 10, 90, 4, F(2)); B.line(-50, 280, 50, 280, W(3.4));   // keys, home bar
      thingAt(p, c, S0, 0, 10, 220, S0.cross ? 205 : 180, { lab: { maxW: 280 } });
      const bn = sub(p); R(bn, -136, -250, 272, 92, 20, F(3)); bn.line(-40, -222, 100, -222, S(2.4)); bn.line(-40, -192, 60, -192, S(2));   // banner + its lines
      if (S0.cross) xBadge(bn, -88, -204, 28); else if (!flagSign(bn, c, S0, -88, -207, 56)) {}
    });
    if (S0.cross) over(c, p => { const g = sub(p); atT(g, p, .1); noMark(g, 0, 10, 140); });
  });

  /* 08 ── PRESSURE GAUGE: a gauge on its pipe beside the thing — flag → the needle sits in the danger band and the face shows "!";
     cross → the needle is pinned at the stop and the thing is struck through */
  variant('gauge', 'เกจแรงดัน', (d, c) => {
    const S0 = st(d), gx = 230, gy = -70, Rr = 175, a0 = -135, a1 = 135, dz = 75, na = S0.cross ? 133 : 105;
    const P = (a, r) => [f1(gx + Math.sin(rad(a)) * r), f1(gy - Math.cos(rad(a)) * r)];
    art(c, p => { floor(p, 300);
      thingAt(p, c, S0, -230, -30, 240, S0.cross ? 180 : 140);
      const B = sub(p); atT(B, p, 0);
      R(B, gx - 18, gy + Rr - 4, 36, 60, 4, F(2.8)); B.shape(P2([[gx - 32, gy + Rr + 56], [gx + 32, gy + Rr + 56], [gx + 40, gy + Rr + 80], [gx + 32, gy + Rr + 104], [gx - 32, gy + Rr + 104], [gx - 40, gy + Rr + 80]]), F(2.8));   // stem + hex nut
      R(B, gx - 16, gy + Rr + 104, 32, 70, 4, F(2.8)); R(B, 40, 214, 400, 40, 8, F(3)); [70, 410].forEach(x => R(B, x - 14, 200, 28, 68, 6, F(2.6)));           // pipe + flanges
      ring(B, gx, gy, Rr, Rr - 20, F(3.4)); B.circle(gx, gy, Rr - 20, { fill: C.fill, sw: 0, stroke: 'none' });                                                      // bezel + face
      const zr0 = Rr - 58, zr1 = Rr - 36, za = a1 - dz;                                                                                                               // danger band
      B.path(`M ${P(za, zr1).join(' ')} A ${zr1} ${zr1} 0 0 1 ${P(a1, zr1).join(' ')} L ${P(a1, zr0).join(' ')} A ${zr0} ${zr0} 0 0 0 ${P(za, zr0).join(' ')} Z`, F(2.6));
      for (let a = za + 8; a < a1 - 2; a += 11) B.line(...P(a, zr0 + 3), ...P(a + 7, zr1 - 3), S(1.4));
      for (let a = a0; a <= a1 + .1; a += 27) B.line(...P(a, Rr - 34), ...P(a, Rr - 56), W(a % 54 === 0 ? 3 : 2));
      B.circle(...P(a1 + 12, Rr - 46), 7, F(2.2));                                                                                                                    // stop pin
      if (!S0.cross) flagSign(B, c, S0, gx, gy + 78, 66);
      const N = rot(B, na, gx, gy); N.shape(P2([[gx - 9, gy + 20], [gx, gy - Rr + 50], [gx + 9, gy + 20]]), F(2.6)); B.circle(gx, gy, 20, F(3)); B.circle(gx, gy, 7, W(2));
    });
    if (S0.cross) over(c, p => { const g = sub(p); atT(g, p, .1); noMark(g, -230, -30, 160); });
  });

  /* 09 ── ROTATING BEACON: a warning beacon on its post, beams out — flag → the warning plate on the post; cross → the thing is struck through */
  variant('beacon', 'ไฟหมุนเตือน', (d, c) => {
    const S0 = st(d), x = 250, by = -150;
    art(c, p => { floor(p, 300);
      thingAt(p, c, S0, -220, -20, 240, S0.cross ? 190 : 160);
      const B = sub(p); atT(B, p, 0);
      [[-1, 1], [1, 1]].forEach(([s]) => B.shape(P2([[x + s * 40, by - 60], [x + s * 230, by - 140], [x + s * 230, by + 10]]), { fill: GLASS, sw: 0, stroke: 'none' }));   // beams
      R(B, x - 60, 286, 120, 14, 5, F(2.6)); R(B, x - 14, by + 40, 28, 290 - by - 40, 6, F(3));
      R(B, x - 80, by, 160, 46, 10, F(3.2)); R(B, x - 92, by + 40, 184, 18, 6, F(2.8));                                       // base
      B.path(`M ${x - 66} ${by} L ${x - 66} ${by - 70} A 66 66 0 0 1 ${x + 66} ${by - 70} L ${x + 66} ${by} Z`, { fill: GLASS, sw: 3.6 });   // dome
      [-34, 0, 34].forEach(dx => B.line(x + dx, by - 6, x + dx, by - (dx ? 108 : 128), S(1.4)));
      R(B, x - 14, by - 92, 28, 74, 6, F(2.6)); R(B, x - 30, by - 104, 60, 18, 6, F(2.4));                                    // lamp + reflector
      [[-104, -100, -128, -116], [104, -100, 128, -116], [0, -158, 0, -186]].forEach(([a, b, e, f]) => B.line(x + a, by + b + 50, x + e, by + f + 50, W(3)));
      if (!S0.cross) flagSign(B, c, S0, x, 140, 120);
    });
    if (S0.cross) over(c, p => { const g = sub(p); atT(g, p, .1); noMark(g, -220, -20, 160); });
  });

  /* 10 ── ROPE STANCHIONS: two stanchions and a rope in front of the thing — flag → a warning plate hangs from the rope;
     cross → a no-entry plate hangs from it and the thing is struck through */
  function stanchion(q, x) { q.ellipse(x, 292, 66, 14, F(2.8)); R(q, x - 30, 274, 60, 16, 6, F(2.4)); R(q, x - 12, -40, 24, 318, 6, F(3)); q.line(x - 3, -10, x - 3, 270, S(1.4));
    q.circle(x, -62, 26, F(3)); R(q, x - 18, -40, 36, 14, 5, F(2.4)); }
  variant('stanchion', 'เสากั้นเชือก', (d, c) => {
    const S0 = st(d);
    art(c, p => {
      floor(p, 300);
      thingAt(p, c, S0, 0, -165, 200, S0.cross ? 2 : -25);
      const B = sub(p); atT(B, p, 0); stanchion(B, -360); stanchion(B, 360);
      const rope = 'M -340 -20 C -150 120, 150 120, 340 -20'; B.path(rope, { sw: 20 }); B.path(rope, { sw: 13, stroke: C.fill });
      [-340, 340].forEach(x => R(B, x - 14, -32, 28, 24, 6, F(2.4)));                                                          // rope hooks
      B.line(0, 85, 0, 112, W(2.4));
      if (S0.cross) noEntry(B, 0, 182, 70); else flagSign(B, c, S0, 0, 178, 120);
    });
    if (S0.cross) over(c, p => { const g = sub(p); atT(g, p, .1); noMark(g, 0, -165, 136); });
  });

  /* 11 ── WALK-THROUGH DETECTOR: the thing passes through the arch — flag → the top lamp and the display flash "!";
     cross → the display shows ✕ and the thing is struck through */
  variant('detector', 'ประตูตรวจจับ', (d, c) => {
    const S0 = st(d);
    art(c, p => { floor(p, 300);
      const B = sub(p); atT(B, p, 0);
      [-1, 1].forEach(s => { const x = s * 225; R(B, x - 40, -230, 80, 520, 14, F(3.4)); for (let y = -180; y <= 230; y += 58) B.line(x - 24, y, x + 24, y, S(1.4));
        R(B, x - 56, 284, 112, 16, 6, F(2.6)); });
      R(B, -280, -300, 560, 76, 16, F(3.4)); R(B, -70, -286, 140, 48, 8, F(2.8));                                            // top beam + display
      if (S0.cross) { B.line(-14, -276, 14, -250, W(4)); B.line(14, -276, -14, -250, W(4)); } else { R(B, -4, -280, 8, 22, 3, INK); B.circle(0, -250, 5, INK); }
      B.path('M -40 -300 L -40 -322 A 40 40 0 0 1 40 -322 L 40 -300 Z', { fill: GLASS, sw: 4 });                                // lamp, lit
      [[-62, -320, -86, -334], [62, -320, 86, -334]].forEach(([a, b, e, f]) => B.line(a, b, e, f, W(3)));
      [-1, 1].forEach(s => { const g = sub(B); R(g, s * 225 - 30, -150, 60, 300, 10, { fill: GLASS, sw: 0, stroke: 'none' }); });   // the side panels glow
      thingAt(p, c, S0, 0, 10, 220, S0.cross ? 205 : 185);
      if (!S0.cross && S0.sign && picOf({ icon: S0.sign })) pic({ icon: S0.sign }, 330, -150, 100, c);
    });
    if (S0.cross) over(c, p => { const g = sub(p); atT(g, p, .1); noMark(g, 0, 10, 150); });
  });

  /* 12 ── MEGAPHONE: a megaphone on its stand calls out at the thing — flag → the call is the warning (in a bubble); cross → the thing
     is struck through */
  function megaphone(q, x, y, a) { const g = rot(q, a, x, y);
    g.path(`M ${x} ${y - 34} L ${x - 190} ${y - 110} Q ${x - 206} ${y} ${x - 190} ${y + 110} L ${x} ${y + 34} Z`, F(3.4));     // horn
    g.ellipse(x - 196, y, 22, 110, F(3)); R(g, x - 4, y - 40, 120, 80, 18, F(3.2)); g.line(x + 40, y - 40, x + 40, y + 40, S(1.4));   // mouth, body
    g.path(`M ${x + 60} ${y + 40} L ${x + 70} ${y + 120} Q ${x + 74} ${y + 134} ${x + 90} ${y + 134} L ${x + 100} ${y + 134} L ${x + 92} ${y + 40}`, F(3));   // grip
    R(g, x + 40, y + 46, 18, 36, 6, F(2.4)); R(g, x + 116, y - 22, 26, 44, 8, F(2.6)); }
  variant('megaphone', 'โทรโข่ง', (d, c) => {
    const S0 = st(d);
    art(c, p => { floor(p, 300);
      thingAt(p, c, S0, -260, 20, 220, S0.cross ? 210 : 175);
      const B = sub(p); atT(B, p, 0);
      B.line(260, 60, 180, 296, W(3.4)); B.line(260, 60, 340, 296, W(3.4)); B.line(260, 60, 262, 296, W(3.4)); R(B, 236, 40, 48, 30, 6, F(2.6));   // tripod
      megaphone(B, 220, -40, 14);
      const mx = 29.8, my = -87.4; [140, 175, 210].forEach((r, i) => { const a1 = rad(194 - 30), a2 = rad(194 + 30);                       // sound waves from the mouth
        B.path(`M ${f1(mx + Math.cos(a1) * r)} ${f1(my + Math.sin(a1) * r)} A ${r} ${r} 0 0 1 ${f1(mx + Math.cos(a2) * r)} ${f1(my + Math.sin(a2) * r)}`, i === 1 ? W(2.6) : S(2)); });
      if (!S0.cross) { B.path(rpoly([[-180, -330], [60, -330], [60, -160], [-20, -160], [-50, -120], [-70, -160], [-180, -160]], 22), F(3.2)); flagSign(B, c, S0, -60, -248, 112); }
    });
    if (S0.cross) over(c, p => { const g = sub(p); atT(g, p, .1); noMark(g, -260, 20, 150); });
  });

  /* 13 ── RADAR: the sweep finds the thing on the scope and locks on — flag → a warning badge on the lock; cross → the thing is struck through */
  variant('radar', 'จอเรดาร์', (d, c) => {
    const S0 = st(d), cx = 0, cy = -30, Rr = 270, tx = 85, ty = -100;
    art(c, p => {
      const B = sub(p); atT(B, p, 0);
      R(B, -120, 230, 240, 70, 14, F(3)); R(B, -170, 286, 340, 16, 6, F(2.6));                                                   // stand
      ring(B, cx, cy, Rr, Rr - 24, F(3.4)); B.circle(cx, cy, Rr - 24, { fill: C.fill, sw: 0, stroke: 'none' });
      [80, 160].forEach(r => B.circle(cx, cy, r, S(1.4))); B.line(cx - Rr + 30, cy, cx + Rr - 30, cy, S(1.2)); B.line(cx, cy - Rr + 30, cx, cy + Rr - 30, S(1.2));
      const sw = rad(-58), sw2 = rad(-20);                                                                                        // the sweep (after the thing)
      B.path(`M ${cx} ${cy} L ${f1(cx + Math.cos(sw) * (Rr - 30))} ${f1(cy + Math.sin(sw) * (Rr - 30))} A ${Rr - 30} ${Rr - 30} 0 0 1 ${f1(cx + Math.cos(sw2) * (Rr - 30))} ${f1(cy + Math.sin(sw2) * (Rr - 30))} Z`, { fill: GLASS, sw: 0, stroke: 'none' });
      B.line(cx, cy, f1(cx + Math.cos(sw2) * (Rr - 30)), f1(cy + Math.sin(sw2) * (Rr - 30)), W(2.4)); B.circle(cx, cy, 8, F(2.4));
      [[-130, 70], [-60, 150], [120, 110]].forEach(([x, y]) => B.circle(x, y, 6, S(2)));                                           // other blips
      const k = 96, L = 30; [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(([sx, sy]) => B.poly([[tx + sx * k, ty + sy * (k - L)], [tx + sx * k, ty + sy * k], [tx + sx * (k - L), ty + sy * k]], W(3.6)));   // lock-on brackets
      thingAt(p, c, S0, tx, ty, 150, null);
      if (S0.thing && S0.thing.label && picOf(S0.thing)) lab(sub(p), S0.thing, tx, ty + 162, { size: 34, maxW: 220 });
      if (!S0.cross) flagSign(B, c, S0, tx + 110, ty - 110, 66);
    });
    if (S0.cross) over(c, p => { const g = sub(p); atT(g, p, .1); noMark(g, tx, ty, 100); });
  });

  /* 14 ── LABEL PRINTER: the printer runs out a warning label and it is stuck on the thing's box — cross → the ✕ label across the thing;
     flag → the "!" label at the box's corner */
  function printer(q, x, y) { R(q, x - 90, y - 140, 180, 290, 30, F(3.4)); R(q, x - 62, y - 112, 124, 66, 10, F(2.6)); q.line(x - 44, y - 82, x + 30, y - 82, S(1.6));
    for (let r = 0; r < 3; r++) for (let k = 0; k < 3; k++) R(q, x - 54 + k * 40, y - 24 + r * 40, 30, 28, 7, F(2.2));
    R(q, x - 50, y - 152, 100, 16, 6, F(2.6)); }
  function lbl(q, x, y, w, h, a, kind) { const g = rot(q, a, x, y); R(g, x - w / 2, y - h / 2, w, h, 10, F(3));
    if (kind === 'x') { const k = h * .26; g.line(x - k, y - k, x + k, y + k, W(5.5)); g.line(x + k, y - k, x - k, y + k, W(5.5)); g.line(x - w / 2 + 26, y, x - h * .5, y, S(2)); g.line(x + h * .5, y, x + w / 2 - 26, y, S(2)); }
    else warnTri(g, x, y + 2, h * .66); }
  variant('labelmaker', 'เครื่องพิมพ์ฉลาก', (d, c) => {
    const S0 = st(d), bx = 130, by = -40;
    art(c, p => {
      const B = sub(p); atT(B, p, 0);
      R(B, bx - 200, by - 230, 400, 470, 18, F(3.4)); B.line(bx - 200, by - 170, bx + 200, by - 170, S(1.6)); B.line(bx, by - 230, bx, by - 170, S(1.6));   // box + flaps
      R(B, -362, -118, 44, 92, 4, F(2.4)); B.path('M -362 -118 L -351 -106 L -340 -118 L -329 -106 L -318 -118', S(1.6)); printer(B, -340, 120);   // the printed strip (cut end) + printer
      thingAt(p, c, S0, bx, by + 20, 220, by + 185);
      if (!S0.cross) { if (S0.sign && picOf({ icon: S0.sign })) pic({ icon: S0.sign }, bx + 150, by - 200, 100, c); else lbl(B, bx + 140, by - 200, 130, 84, 8, 'tri'); }
    });
    if (S0.cross) over(c, p => { const g = sub(p); atT(g, p, .1); lbl(g, bx, by + 62, 380, 72, -12, 'x'); });
  });

  /* 15 ── DOOR HANGER: a door with a hanger on its knob, the thing beside it — flag → the hanger shows the warning;
     cross → it shows no-entry and the thing is struck through */
  variant('doorhanger', 'ป้ายแขวนประตู', (d, c) => {
    const S0 = st(d), dx = 210;
    art(c, p => { floor(p, 300);
      thingAt(p, c, S0, -250, -20, 230, S0.cross ? 180 : 155);
      const B = sub(p); atT(B, p, 0);
      R(B, dx - 190, -330, 380, 630, 10, F(3.4)); R(B, dx - 165, -305, 330, 605, 6, F(3));                                    // frame + door
      R(B, dx - 120, -260, 240, 190, 8, S(1.6)); R(B, dx - 120, -20, 240, 270, 8, S(1.6));                                    // panels
      [-200, 160].forEach(y => R(B, dx - 172, y, 12, 50, 4, F(2.2)));                                                          // hinges
      const kx = dx + 120, ky = 0; R(B, kx - 18, ky - 60, 36, 120, 16, F(2.8)); B.circle(kx, ky, 22, F(3));                     // rose + knob
      const hg = rot(B, 7, kx, ky); hg.path(`M ${kx - 60} ${ky + 10} Q ${kx - 60} ${ky - 8} ${kx - 42} ${ky - 8} L ${kx + 42} ${ky - 8} Q ${kx + 60} ${ky - 8} ${kx + 60} ${ky + 10} L ${kx + 60} ${ky + 230} Q ${kx + 60} ${ky + 248} ${kx + 42} ${ky + 248} L ${kx - 42} ${ky + 248} Q ${kx - 60} ${ky + 248} ${kx - 60} ${ky + 230} Z`, F(3.2));
      hg.circle(kx, ky + 26, 24, S(2)); hg.line(kx - 24, ky + 26, kx - 12, ky + 52, S(1.6)); hg.line(kx + 24, ky + 26, kx + 12, ky + 52, S(1.6));   // the hole + slit
      if (S0.cross) noEntry(hg, kx, ky + 150, 46); else if (S0.sign && picOf({ icon: S0.sign })) pic({ icon: S0.sign }, kx - 10, ky + 160, 96, c, { r: 7 }); else warnTri(hg, kx, ky + 152, 78);
    });
    if (S0.cross) over(c, p => { const g = sub(p); atT(g, p, .1); noMark(g, -250, -20, 150); });
  });

  /* 16 ── ALARM BELL: a wall alarm bell rings beside the thing — flag → its warning plate; cross → the thing is struck through */
  variant('bell', 'กระดิ่งเตือนภัย', (d, c) => {
    const S0 = st(d), x = 240, y = -110;
    art(c, p => {
      thingAt(p, c, S0, -230, -10, 240, S0.cross ? 195 : 155);
      const B = sub(p); atT(B, p, 0);
      R(B, x - 120, y - 170, 240, 340, 24, F(3.2)); [y - 140, y + 140].forEach(yy => B.circle(x, yy, 8, W(2)));                // wall plate + 2 screws
      B.circle(x, y, 135, F(3.6)); B.circle(x, y, 100, S(1.6)); B.circle(x, y, 22, F(3)); B.circle(x, y, 7, W(2));              // gong (dome rim) + centre nut
      R(B, x - 40, y + 120, 80, 50, 10, F(3)); B.line(x, y + 120, x + 34, y + 100, W(4)); B.circle(x + 40, y + 96, 14, F(2.8));  // striker box, arm, hammer
      [[-160, -40, -190, -60], [-170, 10, -205, 10], [-160, 60, -190, 80], [160, -40, 190, -60], [170, 10, 205, 10], [160, 60, 190, 80]].forEach(([a, b, e, f]) => B.line(x + a, y + b, x + e, y + f, W(3)));
      if (!S0.cross) flagSign(B, c, S0, x, y + 300, 120);
    });
    if (S0.cross) over(c, p => { const g = sub(p); atT(g, p, .1); noMark(g, -230, -10, 160); });
  });

  /* 17 ── INSPECTION CLIPBOARD: a checklist with a photo of the thing — flag → a warning mark against its row and on the photo;
     cross → ✕ in its row and the photo is struck through */
  variant('clipboard', 'คลิปบอร์ดตรวจ', (d, c) => {
    const S0 = st(d), px = 0, py = -90;
    art(c, p => {
      const B = sub(p); atT(B, p, 0);
      R(B, -230, -300, 460, 620, 30, F(3.4)); R(B, -200, -250, 400, 540, 8, F(2.8));                                          // board + paper
      B.path('M -80 -276 L -80 -318 Q -80 -334 -64 -334 L 64 -334 Q 80 -334 80 -318 L 80 -276 Z', F(3)); R(B, -110, -282, 220, 40, 12, F(3)); B.circle(0, -312, 10, W(2.2));   // clip
      R(B, px - 150, py - 130, 300, 250, 10, S(1.8));                                                                          // photo frame
      [185, 245].forEach((y, i) => { R(B, -170, y - 22, 44, 44, 8, F(2.6)); B.line(-100, y - 6, 120, y - 6, S(2)); B.line(-100, y + 14, 40 + i * 40, y + 14, S(1.6)); });
      if (S0.cross) { B.line(-158, 173, -138, 197, W(4.6)); B.line(-138, 173, -158, 197, W(4.6)); } else warnTri(B, -148, 188, 34);
      thingAt(p, c, S0, px, py - 10, 190, null);
      if (S0.thing && S0.thing.label && picOf(S0.thing)) lab(sub(p), S0.thing, px, py + 170, { size: 36, maxW: 300 });
      if (!S0.cross) { if (S0.sign && picOf({ icon: S0.sign })) pic({ icon: S0.sign }, px + 150, py - 130, 84, c); else warnTri(B, px + 150, py - 130, 74); }
    });
    if (S0.cross) over(c, p => { const g = sub(p); atT(g, p, .1); noMark(g, px, py - 10, 112); });
  });

  /* 18 ── WIRE FENCE: a chain-link fence stands in front of the thing — flag → a warning plate on the mesh; cross → a no-entry plate,
     and the thing is struck through behind the wire */
  variant('fence', 'รั้วตาข่าย', (d, c) => {
    const S0 = st(d);
    art(c, p => { floor(p, 300); thingAt(p, c, S0, 0, -80, 230, null); });
    over(c, p => { const g = sub(p); atT(g, p, .1);
      if (S0.cross) noMark(g, 0, -80, 150);
      const top = -280, bot = 296, l = -360, r = 360, st = 64;
      for (let k = l - (bot - top); k < r; k += st) { const a = Math.max(l, k), b = Math.min(r, k + (bot - top)); if (b > a) g.line(a, top + (a - k), b, top + (b - k), S(1.3)); }
      for (let k = r + (bot - top); k > l; k -= st) { const a = Math.min(r, k), b = Math.max(l, k - (bot - top)); if (a > b) g.line(a, top + (k - a), b, top + (k - b), S(1.3)); }
      R(g, l - 16, top - 10, r - l + 32, 18, 8, F(2.8));                                                                          // top rail
      [l, r].forEach(x => { R(g, x - 15, top - 30, 30, bot - top + 30, 8, F(3)); R(g, x - 21, top - 44, 42, 18, 8, F(2.4)); });   // posts + caps
      if (S0.thing && S0.thing.label && picOf(S0.thing)) { R(g, -150, 50, 300, 66, 12, F(2.8)); lab(g, S0.thing, 0, 96, { maxW: 260, size: 38 }); }
      if (S0.cross) noEntry(g, 0, 205, 64); else flagSign(g, c, S0, 0, 202, 112);
    });
  });

  /* 19 ── TRAFFIC CONES: cones stand round the thing — flag → the warning sign sits on a cone; cross → a striped pole lies across
     the cones in front of the thing and the thing is struck through */
  function cone(q, x, b = 296, h = 300) { R(q, x - 92, b - 18, 184, 22, 6, F(3)); const t = b - 18 - h;
    q.path(`M ${x - 72} ${b - 18} L ${x - 16} ${t + 10} Q ${x} ${t - 2} ${x + 16} ${t + 10} L ${x + 72} ${b - 18} Z`, F(3.4));
    [[.32, .46], [.62, .76]].forEach(([u, v]) => { const y1 = t + 10 + (b - 28 - t) * u, y2 = t + 10 + (b - 28 - t) * v, w = k => 16 + (72 - 16) * k;
      q.shape(P2([[x - w(u) + 5, y1], [x + w(u) - 5, y1], [x + w(v) - 5, y2], [x - w(v) + 5, y2]]), { fill: GLASS, sw: 1.8, stroke: C.soft }); }); }
  variant('cones', 'กรวยจราจร', (d, c) => {
    const S0 = st(d);
    art(c, p => { floor(p, 300);
      thingAt(p, c, S0, 0, S0.cross ? -110 : -60, 220, S0.cross ? null : 115);
      const B = sub(p); atT(B, p, 0); cone(B, -330, 296, S0.cross ? 250 : 300); cone(B, 330, 296, S0.cross ? 250 : 300);
      if (!S0.cross) { R(B, 330 - 8, -40, 16, 46, 4, F(2.4)); flagSign(B, c, S0, 330, -95, 110); }
    });
    if (S0.cross) over(c, p => { const g = sub(p); atT(g, p, .1); noMark(g, 0, -110, 140); arm(g, -380, 52, 760, 34);
      if (S0.thing && S0.thing.label && picOf(S0.thing)) lab(g, S0.thing, 0, 150, {}); });
  });

  /* 20 ── EMERGENCY STOP: a stop-button box beside the thing — cross → the button is pressed in and the thing is struck through;
     flag → the warning plate on the box */
  variant('stopbtn', 'ปุ่มหยุดฉุกเฉิน', (d, c) => {
    const S0 = st(d), x = 240, top = -120, pr = S0.cross ? 16 : 0;
    art(c, p => { floor(p, 300);
      thingAt(p, c, S0, -230, -10, 240, S0.cross ? 195 : 155);
      const B = sub(p); atT(B, p, 0);
      B.path(`M ${x - 60} 230 Q ${x - 60} 296 ${x - 150} 296`, S(3)); R(B, x - 78, 210, 36, 26, 6, F(2.4));                    // cable + gland
      R(B, x - 140, top, 280, 340, 26, F(3.4));                                                                                  // box
      B.ellipse(x, top, 110, 30, F(3));                                                                                          // guard collar
      B.path(`M ${x - 62} ${top} L ${x - 62} ${top - 40 + pr} L ${x + 62} ${top - 40 + pr} L ${x + 62} ${top} Z`, F(3));       // stem
      B.ellipse(x, top - 40 + pr, 90, 26, F(3.2)); B.path(`M ${x - 90} ${top - 40 + pr} Q ${x - 88} ${top - 92 + pr} ${x} ${top - 96 + pr} Q ${x + 88} ${top - 92 + pr} ${x + 90} ${top - 40 + pr}`, F(3.4));   // mushroom cap
      B.path(`M ${x - 60} ${top - 70 + pr} Q ${x} ${top - 84 + pr} ${x + 60} ${top - 70 + pr}`, S(1.6));
      if (S0.cross) { B.circle(x, top + 100, 40, { fill: GLASS, sw: 3.6 }); B.circle(x, top + 100, 56, S(2)); } else flagSign(B, c, S0, x, top + 112, 120);
      if (S0.cross) [[-150, -90, -175, -110], [150, -90, 175, -110]].forEach(([a, b, e, f]) => B.line(x + a, top + b, x + e, top + f, W(3)));
    });
    if (S0.cross) over(c, p => { const g = sub(p); atT(g, p, .1); noMark(g, -230, -10, 160); });
  });

  /* samples from unrelated topics (neutrality) + a stress set */
  const I = (icon, label) => label ? { icon, label } : { icon };
  const SAMPLES = [
    { say: 'อย่าเล่นมือถือก่อนนอน', thing: I('smartphone', 'มือถือก่อนนอน'), how: 'cross' },
    { say: 'ระวังคลื่นแรงช่วงบ่าย', thing: I('ship', 'คลื่นแรง'), how: 'flag', sign: 'triangle-alert' },
    { say: 'อย่าบิดสายไฟแบบนี้', thing: I('plug', 'บิดสายไฟ'), how: 'cross' },
    { say: 'ระวังพื้นลื่นหลังฝนตก', thing: I('droplets', 'พื้นลื่น'), how: 'flag' },
    { say: 'อย่ากินยาตอนท้องว่าง', thing: I('pill', 'ยาตอนท้องว่าง'), how: 'cross' },
    { say: 'ระวังแบตเตอรี่ร้อนเกิน', thing: I('battery-low', 'แบตร้อน'), how: 'flag' },
    { say: 'อย่าขับรถเร็วในซอย', thing: I('car', 'ขับเร็ว'), how: 'cross', sign: 'octagon-alert' },
    { say: 'ระวังน้ำร้อนลวกมือ', thing: I('coffee', 'น้ำร้อน'), how: 'flag' },
    { say: 'อย่ารูดบัตรตอนเมา', thing: I('credit-card', 'รูดบัตร'), how: 'cross' },
    { say: 'ระวังลิงก์ปลอมในอีเมล', thing: I('mail', 'ลิงก์ปลอม'), how: 'flag', sign: 'shield-alert' },
    { say: 'อย่านอนดึกติดกัน', thing: I('moon', 'นอนดึก'), how: 'cross' },
    { say: 'ระวังของหวานเกินวันละมื้อ', thing: I('cake', 'ของหวาน'), how: 'flag' },
    { say: 'อย่ายกของหนักผิดท่า', thing: I('dumbbell', 'ยกผิดท่า'), how: 'cross' },
    { say: 'ระวังแดดแรงตอนเที่ยง', thing: I('sun', 'แดดเที่ยง'), how: 'flag' },
    { say: 'อย่าแชร์รหัสผ่านให้ใคร', thing: I('key', 'รหัสผ่าน'), how: 'cross' },
    { say: 'ระวังเงินหมดก่อนสิ้นเดือน', thing: I('wallet', 'เงินหมด'), how: 'flag' },
    { say: 'อย่าทิ้งขยะลงท่อ', thing: I('trash-2', 'ทิ้งลงท่อ'), how: 'cross' },
    { say: 'ระวังไฟกระชากตอนฟ้าผ่า', thing: I('zap', 'ไฟกระชาก'), how: 'flag', sign: 'triangle-alert' },
    { say: 'อย่าเล่นเกมทั้งคืน', thing: I('gamepad-2', 'เกมทั้งคืน'), how: 'cross' },
    { say: 'ระวังของมีคมในครัว', thing: I('scissors', 'ของมีคม'), how: 'flag' },
  ];
  const STRESS = [
    { say: 'ไม่มีป้าย (cross)', thing: I('smartphone'), how: 'cross' },
    { say: 'ไม่มีป้าย (flag)', thing: I('bike'), how: 'flag' },
    { say: 'ป้ายยาว', thing: I('laptop', 'นั่งหน้าจอทั้งวันไม่ลุก'), how: 'cross' },
    { say: 'ภาษาอังกฤษ', thing: I('utensils', 'Late-night snacks'), how: 'flag' },
    { say: 'ไม่มีไอคอน (ป้ายแทนภาพ)', thing: { label: 'ตามใจตัวเอง' }, how: 'cross' },
    { say: 'ไม่มีไอคอน + ธง', thing: { label: 'ขับเร็ว' }, how: 'flag' },
    { say: 'ชื่อไอคอนที่ไม่มี', thing: I('no-such-icon', 'อะไรก็ได้'), how: 'cross' },
    { say: 'sign octagon (flag)', thing: I('glass-water', 'น้ำไม่สะอาด'), how: 'flag', sign: 'octagon-alert' },
    { say: 'sign ที่ไม่มีจริง', thing: I('beef', 'เนื้อดิบ'), how: 'flag', sign: 'no-such-sign' },
    { say: 'cross + sign', thing: I('shopping-cart', 'ช้อปเพลิน'), how: 'cross', sign: 'shield-alert' },
    { say: 'ป้ายตัวเลข', thing: I('timer', 'เกิน 2 ชม.'), how: 'flag' },
    { say: 'อังกฤษยาว (cross)', thing: I('tv', 'Binge watching all night'), how: 'cross' },
    { say: 'การกระทำ (flag)', thing: I('car', 'ขับรถตอนง่วง'), how: 'flag', sign: 'triangle-alert' },
    { say: 'การกระทำ (cross)', thing: I('cigarette-off', 'สูบในห้อง'), how: 'cross' },
    { say: 'ไม่มีป้าย sign shield', thing: I('lock'), how: 'flag', sign: 'shield-alert' },
    { say: 'ป้ายสั้นมาก', thing: I('candy', 'หวาน'), how: 'cross' },
    { say: 'คน', thing: I('user', 'คนแปลกหน้า'), how: 'flag' },
    { say: 'ป้ายยาว (flag)', thing: I('thermometer', 'ไข้สูงเกินสามวัน'), how: 'flag' },
    { say: 'ไม่มี how (ถือเป็นธง)', thing: I('umbrella', 'พายุเข้า') },
    { say: 'กลุ่มคน', thing: I('users', 'ฝูงชน'), how: 'cross' },
  ];

  G.cats = G.cats || {};
  G.cats.B07 = { variants: V, SAMPLES, STRESS, draw: (i, d, c) => { setZ(c); CUR = V[i].id; V[i].build(d, c); }, CLAMPS, timing: c => (setZ(c), Object.assign({}, Z)) };
})();
