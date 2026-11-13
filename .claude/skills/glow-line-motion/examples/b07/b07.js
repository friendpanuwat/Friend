/* b07.js — category B07 "คำเตือน / ปัญหา": 20 neutral designs. Stills approved after round 2 (user 2026-11-13: back to the house level of
   detail; 02 03 06 10 19 redesigned → picked 02C 03A 06C 10B 19A; 14 shows its ✕ at the box's top corner), now with motion.
   Slots (same as CutPack CATEGORIES.md B07 — references/cutpack-CATEGORIES.md, cat_ai.py): thing THING (the risky thing or act) ·
   how 'cross' (do not do it) | 'flag' (be careful; also when missing) · sign icon (optional: triangle-alert, octagon-alert, shield-alert …).
   The picture: the thing as it is + a warning symbol. cross → a prohibition mark lies OVER the thing (ring + slash; tape / ✕ label …).
   flag → a warning sign stands BESIDE the thing (the sign icon when given, else a warning triangle). White glow like the whole skill
   (CutPack draws the symbol red; the skill has no colour). cross + sign → the prohibition mark (the sign is not shown).
   Motion (CutPack CATEGORIES B07 + pro motion): the device comes in (0–.4) and the thing with it → the alert builds: the thing trembles and
   the device's own mechanism warns at TA = tu .55 / .8 / 1.05 (lamps flicker, a needle or a column climbs, a beacon flashes, a bell rings,
   a hanger swings …) → ON THE KEYWORD: cross → the prohibition mark stamps down over the thing · flag → the warning sign pops up beside it
   → hold → exit. The last frame equals the approved still.
   GL.cats.B07.draw(i, data, { x, y, s, at, hit, speed }) — canvas 1000 × 700 centred at (0,0); hit = seconds after `at` (default 1.6). */
(function () {
  const G = window.GL, C = G.C, NS = 'http://www.w3.org/2000/svg';
  const W = (w = 2) => ({ sw: w }), F = (w = 3.2) => ({ fill: C.fill, sw: w }), S = (w = 2) => ({ sw: w, stroke: C.soft });
  const rad = d => d * Math.PI / 180, f1 = v => +v.toFixed(1);
  const GLASS = 'rgba(255,255,255,.07)', LIT = 'rgba(255,255,255,.2)', INK = { fill: C.ink, sw: 1.6 };

  /* TIMING (same system as b01–b06): the keyword c.hit comes from the speech and never moves. M = how long each move takes = 1 / speed
     (c.speed, else GL.stage / GL.motion speed) but at most hit / HIT0. tu(x) = x·M · bH(x) / aH(x) = before / after the keyword.
     Because M ≤ hit / 1.6, tu(x) ≤ bH(1.6 − x): the alert beats (TA, last at tu 1.05 + .12) always end before the keyword moves (bH .3). */
  const HIT0 = 1.6; let Z = null; const CLAMPS = {}; let CUR = '';
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

  /* ---------- the alert and the keyword ---------- */
  const TA = () => [tu(.55), tu(.8), tu(1.05)];                                  // the alert beats
  /* a small shake at every alert beat (x in canvas units, or degrees for r) */
  function shakeK(a) { const K = [[0, 0]]; TA().forEach(t => K.push([t - tu(.03), 0], [t, -a, 'out'], [t + tu(.04), a * .8], [t + tu(.08), -a * .45], [t + tu(.12), 0, 'soft'])); return K; }
  /* opacity that flashes at every alert beat (k0 = resting value), then `end` from the keyword on */
  function flashK(k0 = 0, end = k0, t0 = 0) { const K = [[0, 0], [t0, 0], [t0 + tu(.06), k0]];
    TA().forEach(t => K.push([t - tu(.02), k0], [t, 1], [t + tu(.05), .35], [t + tu(.08), 1], [t + tu(.16), k0]));
    if (end !== k0) K.push([bH(.04), k0], [Z.H, end]); return K; }
  /* the prohibition mark stamps down on the keyword (big → lands on the word → settles) */
  const stampK = (x, y) => ({ ox: x, oy: y, s: [[0, 1.8], [bH(.14), 1.8], [Z.H, .92, 'in'], [aH(.1), 1.04], [aH(.22), 1, 'soft']], o: [[0, 0], [bH(.14), 0], [bH(.1), 1]] });
  function stampG(p, x, y) { const g = sub(p); on(g, p, 0, stampK(x, y)); return g; }
  /* the warning pops up on the keyword (from nothing, overshoots, a little wobble, settles) */
  const popK = (x, y) => ({ ox: x, oy: y, s: [[0, 0], [bH(.1), 0], [Z.H, 1.14, 'out'], [aH(.1), .95], [aH(.22), 1, 'soft']], r: [[0, 0], [Z.H, 0], [aH(.06), -6], [aH(.14), 4], [aH(.24), 0, 'soft']], o: [[0, 0], [bH(.1), 0], [bH(.07), 1]] });
  function popG(q, x, y) { const g = sub(q); on(g, q, 0, popK(x, y)); return g; }

  /* ---------- the warning symbols ---------- */
  /* prohibition mark (ring + slash) over a thing, radius r */
  function noMark(q, x, y, r) { const ri = r * .8, w = r * .15, a = ri * .72, n = w / 2 * .7071;
    q.shape(P2([[x - a - n, y - a + n], [x - a + n, y - a - n], [x + a + n, y + a - n], [x + a - n, y + a + n]]), F(3));
    ring(q, x, y, r, ri, F(3.4)); }
  /* … stamped over the thing on the keyword (drawn after the icons) */
  const strike = (c, x, y, r) => over(c, p => noMark(stampG(p, x, y), x, y, r));
  /* warning triangle with "!" — height h, centred at (x, y) */
  function warnTri(q, x, y, h) { const w = h * 1.16;
    q.path(rpoly([[x, y - h / 2], [x + w / 2, y + h / 2], [x - w / 2, y + h / 2]], h * .1), F(3.4));
    q.path(rpoly([[x - h * .05, y - h * .12], [x + h * .05, y - h * .12], [x + h * .032, y + h * .2], [x - h * .032, y + h * .2]], h * .02), INK);
    q.circle(x, y + h * .32, h * .052, INK); }
  const bang = (q, x, y, h) => { R(q, x - h * .07, y - h * .5, h * .14, h * .62, h * .06, INK); q.circle(x, y + h * .38, h * .09, INK); };   // a bare "!"
  const cross = (q, x, y, k, w = 6) => { q.line(x - k, y - k, x + k, y + k, W(w)); q.line(x + k, y - k, x - k, y + k, W(w)); };           // a bare ✕
  /* ✕ badge, round */
  function xBadge(q, x, y, r) { q.circle(x, y, r, F(3.2)); cross(q, x, y, r * .4, 5.5); }
  /* the flag-mode sign beside the thing, popping up on the keyword: the sign icon (when given and known) or the drawn triangle */
  function flagSign(q, c, D, x, y, h, o = {}) { if (D.sign && picOf({ icon: D.sign })) { pic({ icon: D.sign }, x, y, h * 1.1, c, Object.assign({ pop: true }, o)); return true; }
    warnTri(popG(q, x, y), x, y, h); return false; }

  /* ---------- the data ---------- */
  function st(d) { return { thing: d.thing || null, cross: d.how === 'cross', sign: d.sign || null }; }
  const picOf = it => it && it.icon && (G.icons[it.icon] || G.icons[it.icon + '-pro']);
  /* a THING's picture at (cx, cy), width wd; no picture → its label in big type. o.t = when it comes in · o.shake = it trembles at the
     alert beats · o.pop = it pops up on the keyword (a sign icon) · o.r = static turn · o.mv = keys of the part it rides (canvas units) */
  function pic(it, cx, cy, wd, c, o = {}) {
    if (!it) return null; const at = c.at || 0, X = c.x + cx * c.s, Y = c.y + cy * c.s, fn = picOf(it), t = o.t ?? tu(.12);
    let a;
    if (fn) a = G.art(fn, { x: X, y: Y, w: wd * c.s, at: at + t, speed: Z.sp });
    else { const str = it.label || it.icon; if (!str) return null;
      const f = q => txt(q, str, 0, wd * .13, { size: wd * .27, maxW: wd * .95, weight: 700, color: C.ink }); f.custom = true; f.dur = .3; f.exit = 'pop';
      a = G.art(f, { x: X, y: Y, s: c.s, at: at + t, speed: 1 }); a.speed = Z.sp; }
    const K = {};
    if (o.pop) { const P = popK(X, Y); Object.assign(K, P); }
    if (o.r) { K.ox = X; K.oy = Y; K.r = (K.r || [[0, 0]]).map(([u, v, e]) => [u, v + o.r, e]); }
    if (o.shake) { K.ox = K.ox ?? X; K.oy = K.oy ?? Y; K.x = shakeK(o.shake * c.s); }
    if (o.mv) { const m = o.mv; ['x', 'y'].forEach(n => { if (m[n]) K[n] = m[n].map(([u, v, e]) => [u, v * c.s, e]); }); if (m.s) K.s = m.s; }
    if (Object.keys(K).length) { K.ox = K.ox ?? X; K.oy = K.oy ?? Y; kf(a.wrap, at, K); }
    return a;
  }
  /* a THING's label (only when it has a picture — else the label already is the picture) */
  const lab = (q, it, x, y, o = {}) => it && it.label && picOf(it) ? txt(q, it.label, x, y, Object.assign({ maxW: 300, color: C.ink, weight: 700 }, o)) : null;
  const labT = (p, it, x, y, t, o) => { const g = sub(p); atT(g, p, t); return lab(g, it, x, y, o); };
  /* the thing: picture + label under it; it trembles at the alert beats unless o.shake === 0 */
  function thingAt(p, c, S0, x, y, w, ly, o = {}) { if (!S0.thing) return; const t = o.t ?? tu(.14);
    pic(S0.thing, x, y, w, c, Object.assign({ t, shake: 7 }, o)); if (ly != null) labT(p, S0.thing, x, ly, t + tu(.08), o.lab || {}); }

  const V = [];
  const variant = (id, th, build) => V.push({ id, th, build });

  /* 01 ── ROAD SIGN: cross → the post rises with the round plate, the thing on it trembles and the slash stamps over it on the keyword;
     flag → the post rises beside the thing and the warning plate pops up onto it */
  variant('roadsign', 'ป้ายจราจร', (d, c) => {
    const S0 = st(d);
    if (S0.cross) {
      art(c, p => { floor(p, 300);
        const B = inG(sub(p), 'rise', 0, 300);
        R(B, -70, 286, 140, 14, 5, F(2.6)); R(B, -15, 30, 30, 260, 6, F(3));                                                         // base + post
        B.circle(0, -95, 205, F(3.4));                                                                                              // the plate
        if (S0.thing && S0.thing.label && picOf(S0.thing)) R(B, -165, 150, 330, 82, 12, F(3));                                   // label plate (only with a label)
        thingAt(p, c, S0, 0, -95, 210, 207, { t: tu(.36), lab: { maxW: 240, size: 40 } });
      });
      strike(c, 0, -95, 172);
    } else art(c, p => { floor(p, 300);
      thingAt(p, c, S0, -210, -20, 240, 160);
      const x = 250, B = inG(sub(p), 'rise', x, 300);
      R(B, x - 60, 286, 120, 14, 5, F(2.6)); R(B, x - 14, -150, 28, 440, 6, F(3));
      flagSign(B, c, S0, x, -95, 240);
    });
  });

  /* 02 ── WARNING FLAG (user's pick 02C): the pole is planted and its flag waves in the wind beside the thing — on the keyword the warning
     (or ✕) pops up on the flag; cross → the thing is struck through */
  variant('flagpole', 'ธงเตือน', (d, c) => {
    const S0 = st(d), x = 200;
    art(c, p => { floor(p, 300); thingAt(p, c, S0, -230, -20, 240, S0.cross ? 190 : 160);
      const B = inG(sub(p), 'rise', x, 296); B.path(`M ${x - 70} 296 L ${x - 40} 240 L ${x + 40} 240 L ${x + 70} 296 Z`, F(3)); R(B, x - 10, -300, 20, 545, 6, F(3)); B.circle(x, -306, 14, F(2.6));
      const Fl = sub(mvG(B, { px: x + 10, py: -185, sx: [[0, .2], [tu(.25), .2], [tu(.5), 1, 'back']] }));                       // the flag unfurls …
      on(Fl, p, tu(.5), { loop: tu(1.3), ox: x + 10, oy: -185, ky: [[0, 0], [tu(.65), 4, 'soft'], [tu(1.3), 0, 'soft']], sy: [[0, 1], [tu(.65), .96, 'soft'], [tu(1.3), 1, 'soft']] });   // … and waves
      Fl.path(`M ${x + 10} -280 C ${x + 110} -310, ${x + 180} -240, ${x + 280} -270 L ${x + 280} -80 C ${x + 180} -50, ${x + 110} -120, ${x + 10} -90 Z`, F(3.2));
      if (S0.cross) xBadge(popG(Fl, x + 145, -180), x + 145, -180, 46); else flagSign(Fl, c, S0, x + 145, -176, 100); });
    if (S0.cross) strike(c, -230, -20, 160);
  });

  /* 03 ── PINNED NOTE (user's pick 03A): the thing's card is pinned up and trembles — on the keyword a note is slapped on its corner and pinned:
     "!" (flag) or ✕ (cross, the thing struck through) */
  const pin = (q, x, y) => { q.circle(x, y, 16, F(3)); q.line(x + 4, y + 14, x + 10, y + 30, W(2)); };
  variant('note', 'กระดาษโน้ตปักหมุด', (d, c) => {
    const S0 = st(d), H = Z.H;
    art(c, p => { const B = inG(sub(p), 'drop', -50, 200); R(B, -250, -280, 400, 480, 12, F(3.2)); pin(B, -50, -258);
      thingAt(p, c, S0, -50, -60, 240, 140, { t: tu(.38) });
      const N = rot(mvG(sub(p), { px: 250, py: 22, x: [[0, 70], [bH(.16), 70], [H, 0, 'in']], y: [[0, -110], [bH(.16), -110], [H, 0, 'in'], [aH(.08), -10, 'out'], [aH(.18), 0, 'soft']],
        r: [[0, 24], [bH(.16), 24], [H, 0, 'in'], [aH(.1), -3], [aH(.2), 0, 'soft']], o: [[0, 0], [bH(.16), 0], [bH(.12), 1]] }), 8, 250, 120);
      N.path('M 130 0 L 370 0 L 370 190 L 320 240 L 130 240 Z', F(3.2)); N.path('M 320 240 L 330 200 L 370 190', S(1.6)); pin(N, 250, 22);
      if (S0.cross) cross(N, 250, 120, 35); else if (S0.sign && picOf({ icon: S0.sign })) pic({ icon: S0.sign }, 250, 125, 121, c, { pop: true, r: 8 }); else warnTri(N, 250, 125, 110); });
    if (S0.cross) strike(c, -50, -60, 155);
  });

  /* 04 ── SIGNAL LIGHTS: the lamps flicker one after another while the thing trembles — on the keyword the warning lamp lights and holds:
     cross → the top lamp with ✕ (and the thing struck through) · flag → the middle lamp with "!" */
  variant('lights', 'ไฟสัญญาณ', (d, c) => {
    const S0 = st(d), x = 250, ys = [-200, -60, 80], on1 = S0.cross ? 0 : 1;
    art(c, p => { floor(p, 300);
      thingAt(p, c, S0, -210, -40, 240, S0.cross ? 170 : 140);
      const B = inG(sub(p), 'rise', x, 300);
      R(B, x - 60, 286, 120, 14, 5, F(2.6)); R(B, x - 15, 160, 30, 130, 6, F(3));
      R(B, x - 85, -285, 170, 450, 34, F(3.4));                                                                                // housing
      ys.forEach((y, i) => { const lit = i === on1;
        B.path(`M ${x - 66} ${y - 22} A 66 66 0 0 1 ${x + 66} ${y - 22} L ${x + 74} ${y - 50} A 80 80 0 0 0 ${x - 74} ${y - 50} Z`, F(2.6));   // visor
        B.circle(x, y, 52, F(3));
        const fl = sub(B), t = TA()[i]; on(fl, p, 0, { o: [[0, 0], [t - tu(.02), 0], [t, 1], [t + tu(.14), 1], [t + tu(.2), 0]].concat(lit ? [[bH(.04), 0], [Z.H, 1]] : []) });   // flicker in turn, then the warning lamp holds
        fl.circle(x, y, 52, { fill: LIT, sw: 4.4 }); fl.circle(x, y, 70, S(2));
        if (lit) { const sy = popG(B, x, y); if (S0.cross) cross(sy, x, y, 20); else { R(sy, x - 6, y - 28, 12, 36, 5, INK); sy.circle(x, y + 22, 7, INK); } } });
    });
    if (S0.cross) strike(c, -210, -40, 160);
  });

  /* 05 ── FLOOR STAND: the A-frame stand is set down and opens — cross → the thing on its panel trembles and is struck through on the keyword;
     flag → the warning pops up on the panel, next to the thing */
  function aframe(q, p, x, top, bot, wt, wb) {
    const bk = mvG(q, { px: x, py: bot, sx: [[0, .6], [tu(.2), .6], [tu(.42), 1, 'back']] });                                   // the back panel opens out
    bk.path(rpoly([[x - wt / 2 + 6, top + 14], [x + wt / 2 - 6, top + 14], [x + wb / 2 + 34, bot], [x - wb / 2 - 34, bot]], 20), F(2.6));
    q.path(rpoly([[x - wt / 2, top], [x + wt / 2, top], [x + wb / 2, bot], [x - wb / 2, bot]], 22), F(3.4));
    R(q, x - 46, top + 22, 92, 30, 14, F(2.4)); }                                                                              // handle slot
  variant('aframe', 'ป้ายตั้งพื้น', (d, c) => {
    const S0 = st(d);
    if (S0.cross) {
      art(c, p => { floor(p, 300); const B = inG(sub(p), 'drop', 0, 290); aframe(B, p, 0, -300, 290, 260, 380); thingAt(p, c, S0, 0, -50, 200, 205, { t: tu(.38), lab: { maxW: 280 } }); });
      strike(c, 0, -50, 140);
    } else art(c, p => { floor(p, 300); thingAt(p, c, S0, -220, -20, 240, 160); const B = inG(sub(p), 'drop', 230, 290); aframe(B, p, 230, -250, 290, 230, 340); flagSign(B, c, S0, 230, 10, 170); });
  });

  /* 06 ── THERMOMETER (user's pick 06C): the column climbs in steps at the alert beats beside the trembling thing — on the keyword it shoots
     past the danger mark: flag → the warning pops up · cross → it hits the top and the thing is struck through */
  variant('thermo', 'เทอร์โมมิเตอร์', (d, c) => {
    const S0 = st(d), x = 250, top = -300, bulb = 220, lv = S0.cross ? -260 : -200, H = Z.H, k = v => (bulb - v) / (bulb - lv);
    art(c, p => { floor(p, 300); thingAt(p, c, S0, -210, -20, 240, S0.cross ? 190 : 160);
      const B = inG(sub(p), 'rise', x, 300);
      B.path(`M ${x - 34} ${bulb - 50} L ${x - 34} ${top + 34} A 34 34 0 0 1 ${x + 34} ${top + 34} L ${x + 34} ${bulb - 50} A 70 70 0 1 1 ${x - 34} ${bulb - 50} Z`, F(3.4));
      const [t1, t2, t3] = TA(), col = mvG(B, { px: x, py: bulb, sy: [[0, k(150)], [tu(.4), k(150)], [t1, k(40), 'out'], [t2, k(-60), 'out'], [t3, k(-130), 'out'], [bH(.18), k(-130)], [H, 1.04, 'in'], [aH(.14), 1, 'soft']] });
      R(col, x - 12, lv, 24, bulb - lv, 12, { fill: C.ink, sw: 1.6 }); B.circle(x, bulb, 48, { fill: C.ink, sw: 1.6 });       // the column
      [-150, -60, 30, 120].forEach(y => B.line(x + 44, y, x + 70, y, W(2.4))); R(B, x + 44, -240, 60, 10, 4, F(2.2));         // marks + the danger mark
      if (!S0.cross) flagSign(B, c, S0, x + 120, -280, 80); });
    if (S0.cross) strike(c, -210, -20, 160);
  });

  /* 07 ── PHONE ALERT: the thing on the phone's screen trembles — on the keyword the alert banner drops down: ✕ (cross, the thing struck
     through) or the warning (flag) */
  variant('phone', 'มือถือแจ้งเตือน', (d, c) => {
    const S0 = st(d), H = Z.H;
    art(c, p => {
      const B = inG(sub(p), 'rise', 0, 320);
      R(B, -175, -330, 350, 650, 52, F(3.4)); R(B, -152, -306, 304, 602, 34, S(1.6)); R(B, -42, -292, 84, 22, 11, F(2.2));     // body, screen edge, island
      B.line(-50, 280, 50, 280, W(3.4));                                                                                        // home bar
      thingAt(p, c, S0, 0, 10, 220, S0.cross ? 205 : 180, { t: tu(.38), lab: { maxW: 280 } });
      const bn = mvG(sub(p), { y: [[0, -70], [bH(.16), -70], [H, 6, 'out'], [aH(.12), 0, 'soft']], o: [[0, 0], [bH(.16), 0], [bH(.08), 1]] });   // the banner drops in
      R(bn, -136, -250, 272, 92, 20, F(3)); bn.line(-40, -222, 100, -222, S(2.4)); bn.line(-40, -192, 60, -192, S(2));
      if (S0.cross) xBadge(popG(bn, -88, -204), -88, -204, 28); else flagSign(bn, c, S0, -88, -207, 56);
    });
    if (S0.cross) strike(c, 0, 10, 140);
  });

  /* 08 ── PRESSURE GAUGE: the needle climbs in jerks at the alert beats beside the trembling thing — on the keyword it swings into the danger
     band and the face shows "!" (flag), or it slams against the stop and the thing is struck through (cross) */
  variant('gauge', 'เกจแรงดัน', (d, c) => {
    const S0 = st(d), gx = 230, gy = -70, Rr = 175, a0 = -135, a1 = 135, dz = 75, na = S0.cross ? 133 : 105, H = Z.H;
    const P = (a, r) => [f1(gx + Math.sin(rad(a)) * r), f1(gy - Math.cos(rad(a)) * r)];
    art(c, p => { floor(p, 300);
      thingAt(p, c, S0, -230, -30, 240, S0.cross ? 180 : 140);
      const B = inG(sub(p), 'rise', gx, 300);
      R(B, gx - 18, gy + Rr - 4, 36, 300 - gy - Rr + 4, 4, F(2.8)); R(B, gx - 60, 286, 120, 14, 5, F(2.6));                     // stem + foot
      ring(B, gx, gy, Rr, Rr - 20, F(3.4)); B.circle(gx, gy, Rr - 20, { fill: C.fill, sw: 0, stroke: 'none' });                     // bezel + face
      const zr0 = Rr - 58, zr1 = Rr - 36, za = a1 - dz;                                                                              // danger band
      B.path(`M ${P(za, zr1).join(' ')} A ${zr1} ${zr1} 0 0 1 ${P(a1, zr1).join(' ')} L ${P(a1, zr0).join(' ')} A ${zr0} ${zr0} 0 0 0 ${P(za, zr0).join(' ')} Z`, F(2.6));
      for (let a = a0; a <= a1 + .1; a += 54) B.line(...P(a, Rr - 34), ...P(a, Rr - 56), W(2.6));
      B.circle(...P(a1 + 12, Rr - 46), 7, F(2.2));                                                                                   // stop pin
      if (!S0.cross) flagSign(B, c, S0, gx, gy + 78, 66);
      const [t1, t2, t3] = TA(), jerk = (t, v) => [[t - tu(.03), v - 18], [t + tu(.04), v + 6, 'out'], [t + tu(.1), v, 'soft']];
      const N = mvG(B, { px: gx, py: gy, r: [[0, a0], [tu(.4), a0], ...jerk(t1, -70), ...jerk(t2, -10), ...jerk(t3, 40), [bH(.2), 40], [H, na + (S0.cross ? 0 : 8), 'in'],
        ...(S0.cross ? [[aH(.05), na - 5, 'out'], [aH(.12), na + 1], [aH(.2), na, 'soft']] : [[aH(.12), na - 3], [aH(.24), na, 'soft']])] });
      N.shape(P2([[gx - 9, gy + 20], [gx, gy - Rr + 50], [gx + 9, gy + 20]]), F(2.6)); B.circle(gx, gy, 20, F(3)); B.circle(gx, gy, 7, W(2));
    });
    if (S0.cross) strike(c, -230, -30, 160);
  });

  /* 09 ── ROTATING BEACON: the beacon on its post flashes, its beams sweeping left and right at the alert beats — on the keyword both beams
     stay on: flag → the warning plate pops up on the post · cross → the thing is struck through */
  variant('beacon', 'ไฟหมุนเตือน', (d, c) => {
    const S0 = st(d), x = 250, by = -150;
    art(c, p => { floor(p, 300);
      thingAt(p, c, S0, -220, -20, 240, S0.cross ? 190 : 160);
      const B = inG(sub(p), 'rise', x, 300);
      [-1, 1].forEach((s, i) => { const bm = sub(B), [t1, t2, t3] = TA(), o = [[0, 0]];
        (i ? [t2] : [t1, t3]).forEach(t => o.push([t - tu(.02), 0], [t, 1], [t + tu(.1), 1], [t + tu(.16), 0]));
        on(bm, p, 0, { o: o.concat([[bH(.04), 0], [Z.H, 1]]) });                                                              // beams: left, right, left … then both
        bm.shape(P2([[x + s * 40, by - 60], [x + s * 230, by - 140], [x + s * 230, by + 10]]), { fill: GLASS, sw: 0, stroke: 'none' }); });
      R(B, x - 60, 286, 120, 14, 5, F(2.6)); R(B, x - 14, by + 40, 28, 290 - by - 40, 6, F(3));
      R(B, x - 80, by, 160, 46, 10, F(3.2)); R(B, x - 92, by + 40, 184, 18, 6, F(2.8));                                       // base
      B.path(`M ${x - 66} ${by} L ${x - 66} ${by - 70} A 66 66 0 0 1 ${x + 66} ${by - 70} L ${x + 66} ${by} Z`, { fill: GLASS, sw: 3.6 });   // dome
      R(B, x - 14, by - 92, 28, 74, 6, F(2.6));                                                                                // lamp
      const rs = sub(B); on(rs, p, 0, { o: flashK(0, 1, tu(.3)) });
      [[-104, -100, -128, -116], [104, -100, 128, -116], [0, -158, 0, -186]].forEach(([a, b, e, f]) => rs.line(x + a, by + b + 50, x + e, by + f + 50, W(3)));
      if (!S0.cross) flagSign(B, c, S0, x, 140, 120);
    });
    if (S0.cross) strike(c, -220, -20, 160);
  });

  /* 10 ── LIFT OUT OF ORDER (user's pick 10B): the lift's indicator and call button blink at the alert beats — on the keyword the warning
     pops up on the front of the doors (user): "!" (flag) or ✕ (cross, the thing struck through) */
  variant('lift', 'ลิฟต์งดใช้', (d, c) => {
    const S0 = st(d), x = 220;
    art(c, p => { floor(p, 300); thingAt(p, c, S0, -250, -10, 230, S0.cross ? 185 : 155);
      const B = inG(sub(p), 'rise', x, 300); R(B, x - 180, -200, 360, 500, 8, F(3.4)); R(B, x - 160, -180, 158, 480, 4, F(2.8)); R(B, x + 2, -180, 158, 480, 4, F(2.8));
      R(B, x - 90, -320, 180, 90, 14, F(3.2));
      const fl = sub(B); on(fl, p, 0, { o: flashK(0, 0, tu(.3)) }); R(fl, x - 80, -310, 160, 70, 10, { fill: LIT, sw: 0, stroke: 'none' });   // indicator blinks
      R(B, x + 196, -40, 40, 80, 10, F(2.6)); B.circle(x + 216, 0, 11, W(2.2));
      if (S0.cross) xBadge(popG(B, x, 50), x, 50, 66); else flagSign(B, c, S0, x, 50, 160);                                     // the sign on the doors (user: on the front of the lift doors)
      const bt = sub(B); on(bt, p, 0, { o: flashK(0, 1, tu(.3)) }); bt.circle(x + 216, 0, 11, { fill: C.ink, sw: 1.6 });          // call button
    });
    if (S0.cross) strike(c, -250, -10, 150);
  });

  /* 11 ── WALK-THROUGH DETECTOR: the thing passes into the arch while the lamp blinks — on the keyword the display shows ✕ (and the thing is
     struck through) or "!", and the lamp stays lit */
  variant('detector', 'ประตูตรวจจับ', (d, c) => {
    const S0 = st(d);
    art(c, p => { floor(p, 300);
      const B = inG(sub(p), 'rise', 0, 300);
      [-1, 1].forEach(s => { const x = s * 225; R(B, x - 40, -230, 80, 520, 14, F(3.4)); R(B, x - 56, 284, 112, 16, 6, F(2.6)); });
      R(B, -280, -300, 560, 76, 16, F(3.4)); R(B, -70, -286, 140, 48, 8, F(2.8));                                            // top beam + display
      const sy = popG(B, 0, -262); if (S0.cross) cross(sy, 0, -263, 14, 4); else { R(sy, -4, -280, 8, 22, 3, INK); sy.circle(0, -250, 5, INK); }
      B.path('M -40 -300 L -40 -322 A 40 40 0 0 1 40 -322 L 40 -300 Z', F(3.2));                                              // lamp …
      const lt = sub(B); on(lt, p, 0, { o: flashK(0, 1, tu(.3)) }); lt.path('M -40 -300 L -40 -322 A 40 40 0 0 1 40 -322 L 40 -300 Z', { fill: GLASS, sw: 4 });   // … lit
      [[-62, -320, -86, -334], [62, -320, 86, -334]].forEach(([a, b, e, f]) => lt.line(a, b, e, f, W(3)));
      const walk = { s: [[0, .5], [tu(.14), .5], [tu(1.1), 1, 'io']], y: [[0, -40], [tu(.14), -40], [tu(1.1), 0, 'io']] };   // it walks in through the arch
      thingAt(p, c, S0, 0, 10, 220, S0.cross ? 205 : 185, { mv: walk, shake: 0, t: tu(.14) });
      if (!S0.cross && S0.sign && picOf({ icon: S0.sign })) pic({ icon: S0.sign }, 330, -150, 100, c, { pop: true });
    });
    if (S0.cross) strike(c, 0, 10, 150);
  });

  /* 12 ── MEGAPHONE: the megaphone sends out waves at the alert beats — on the keyword the call bubble pops up with the warning (flag), or the
     thing is struck through (cross) */
  function megaphone(q, x, y, a) { const g = rot(q, a, x, y);
    g.path(`M ${x} ${y - 34} L ${x - 190} ${y - 110} Q ${x - 206} ${y} ${x - 190} ${y + 110} L ${x} ${y + 34} Z`, F(3.4));     // horn
    g.ellipse(x - 196, y, 22, 110, F(3)); R(g, x - 4, y - 40, 120, 80, 18, F(3.2));                                         // mouth, body
    g.path(`M ${x + 60} ${y + 40} L ${x + 70} ${y + 120} Q ${x + 74} ${y + 134} ${x + 90} ${y + 134} L ${x + 100} ${y + 134} L ${x + 92} ${y + 40}`, F(3)); }   // grip
  variant('megaphone', 'โทรโข่ง', (d, c) => {
    const S0 = st(d);
    art(c, p => { floor(p, 300);
      thingAt(p, c, S0, -260, 20, 220, S0.cross ? 210 : 175);
      const B = inG(sub(p), 'rise', 260, 296);
      B.line(260, 60, 180, 296, W(3.4)); B.line(260, 60, 340, 296, W(3.4)); B.line(260, 60, 262, 296, W(3.4)); R(B, 236, 40, 48, 30, 6, F(2.6));   // tripod
      const mg = mvG(B, { px: 260, py: 50, r: shakeK(2.5) }); megaphone(mg, 220, -40, 14);
      const mx = 29.8, my = -87.4; [140, 175, 210].forEach((r, i) => { const a1 = rad(194 - 30), a2 = rad(194 + 30), w = sub(B), o = [[0, 0]];       // waves ripple out at every beat
        TA().forEach(t => o.push([t + tu(.03 * i), 0], [t + tu(.03 * i + .02), 1], [t + tu(.03 * i + .12), 0]));
        on(w, p, 0, { o: o.concat([[bH(.04), 0], [Z.H, 1]]) });
        w.path(`M ${f1(mx + Math.cos(a1) * r)} ${f1(my + Math.sin(a1) * r)} A ${r} ${r} 0 0 1 ${f1(mx + Math.cos(a2) * r)} ${f1(my + Math.sin(a2) * r)}`, i === 1 ? W(2.6) : S(2)); });
      if (!S0.cross) { const bb = popG(B, -50, -140); bb.path(rpoly([[-180, -330], [60, -330], [60, -160], [-20, -160], [-50, -120], [-70, -160], [-180, -160]], 22), F(3.2)); if (S0.sign && picOf({ icon: S0.sign })) pic({ icon: S0.sign }, -60, -248, 123, c, { pop: true }); else warnTri(bb, -60, -248, 112); }
    });
    if (S0.cross) strike(c, -260, 20, 150);
  });

  /* 13 ── RADAR: the sweep turns round the scope and the brackets close in on the thing — on the keyword they lock on: flag → a warning badge
     pops on the lock · cross → the thing is struck through */
  variant('radar', 'จอเรดาร์', (d, c) => {
    const S0 = st(d), cx = 0, cy = -30, Rr = 270, tx = 85, ty = -100, H = Z.H;
    art(c, p => {
      const B = inG(sub(p), 'pop', 0, 0);
      R(B, -120, 230, 240, 70, 14, F(3)); R(B, -170, 286, 340, 16, 6, F(2.6));                                                   // stand
      ring(B, cx, cy, Rr, Rr - 24, F(3.4)); B.circle(cx, cy, Rr - 24, { fill: C.fill, sw: 0, stroke: 'none' });
      B.circle(cx, cy, 130, S(1.4)); B.line(cx - Rr + 30, cy, cx + Rr - 30, cy, S(1.2)); B.line(cx, cy - Rr + 30, cx, cy + Rr - 30, S(1.2));
      const sw = rad(-58), sw2 = rad(-20), SW = mvG(B, { px: cx, py: cy, r: [[0, -400], [tu(.3), -400], [H, 0, 'out']] });          // the sweep turns round
      SW.path(`M ${cx} ${cy} L ${f1(cx + Math.cos(sw) * (Rr - 30))} ${f1(cy + Math.sin(sw) * (Rr - 30))} A ${Rr - 30} ${Rr - 30} 0 0 1 ${f1(cx + Math.cos(sw2) * (Rr - 30))} ${f1(cy + Math.sin(sw2) * (Rr - 30))} Z`, { fill: GLASS, sw: 0, stroke: 'none' });
      SW.line(cx, cy, f1(cx + Math.cos(sw2) * (Rr - 30)), f1(cy + Math.sin(sw2) * (Rr - 30)), W(2.4)); B.circle(cx, cy, 8, F(2.4));
      const k = 96, L = 30, br = mvG(B, { px: tx, py: ty, s: [[0, 1.7], [tu(.5), 1.7], [bH(.1), 1.12, 'io'], [H, .94, 'in'], [aH(.12), 1, 'soft']], o: [[0, 0], [tu(.5), 0], [tu(.6), 1]] });   // lock-on brackets close in
      [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(([sx, sy]) => br.poly([[tx + sx * k, ty + sy * (k - L)], [tx + sx * k, ty + sy * k], [tx + sx * (k - L), ty + sy * k]], W(3.6)));
      thingAt(p, c, S0, tx, ty, 150, null, { t: tu(.3) });
      if (S0.thing && S0.thing.label && picOf(S0.thing)) labT(p, S0.thing, tx, ty + 162, tu(.4), { size: 34, maxW: 220 });
      if (!S0.cross) flagSign(B, c, S0, tx + 110, ty - 110, 66);
    });
    if (S0.cross) strike(c, tx, ty, 100);
  });

  /* 14 ── LABEL PRINTER: the printer runs a label out at the alert beats — on the keyword the label is slapped on the box's top corner:
     ✕ (cross, user: "เอากากบาทไปไว้ที่มุมบนก็พอ") or "!" (flag) */
  function printer(q, x, y) { R(q, x - 90, y - 140, 180, 290, 30, F(3.4)); R(q, x - 62, y - 112, 124, 66, 10, F(2.6)); q.line(x - 44, y - 82, x + 30, y - 82, S(1.6));
    for (let r = 0; r < 3; r++) for (let k = 0; k < 3; k++) R(q, x - 54 + k * 40, y - 24 + r * 40, 30, 28, 7, F(2.2));
    R(q, x - 50, y - 152, 100, 16, 6, F(2.6)); }
  function lbl(q, x, y, w, h, a, kind) { const g = rot(q, a, x, y); R(g, x - w / 2, y - h / 2, w, h, 10, F(3));
    if (kind === 'x') cross(g, x, y, h * .24, 5.5); else warnTri(g, x, y + 2, h * .66); }
  variant('labelmaker', 'เครื่องพิมพ์ฉลาก', (d, c) => {
    const S0 = st(d), bx = 130, by = -40, [t1, t2, t3] = TA();
    art(c, p => {
      const B = inG(sub(p), 'pop', bx, 200);
      R(B, bx - 200, by - 230, 400, 470, 18, F(3.4)); B.line(bx - 200, by - 170, bx + 200, by - 170, S(1.6)); B.line(bx, by - 230, bx, by - 170, S(1.6));   // box + flaps
      const P0 = inG(sub(p), 'rise', -340, 270, tu(.1));
      const sp = mvG(P0, { px: -340, py: -26, sy: [[0, 0], [t1 - tu(.02), 0], [t1 + tu(.1), .35], [t2 - tu(.02), .35], [t2 + tu(.1), .7], [t3 - tu(.02), .7], [t3 + tu(.1), 1]] });   // the strip runs out
      R(sp, -362, -118, 44, 92, 4, F(2.4)); sp.path('M -362 -118 L -351 -106 L -340 -118 L -329 -106 L -318 -118', S(1.6));
      printer(P0, -340, 120);
      thingAt(p, c, S0, bx, by + 20, 220, by + 185, { t: tu(.38) });
      if (S0.cross || !(S0.sign && picOf({ icon: S0.sign }))) lbl(stampG(B, bx + 140, by - 200), bx + 140, by - 200, 130, 84, 8, S0.cross ? 'x' : 'tri');   // the label slapped on
      else pic({ icon: S0.sign }, bx + 150, by - 200, 100, c, { pop: true });
    });
  });

  /* 15 ── DOOR HANGER: the hanger swings on the knob, settling — on the keyword its sign pops: no-entry (cross, the thing struck through)
     or the warning (flag) */
  variant('doorhanger', 'ป้ายแขวนประตู', (d, c) => {
    const S0 = st(d), dx = 210, kx = dx + 120, ky = 0;
    art(c, p => { floor(p, 300);
      thingAt(p, c, S0, -250, -20, 230, S0.cross ? 180 : 155);
      const B = inG(sub(p), 'rise', dx, 300);
      R(B, dx - 190, -330, 380, 630, 10, F(3.4)); R(B, dx - 165, -305, 330, 605, 6, F(3));                                    // frame + door
      R(B, kx - 18, ky - 60, 36, 120, 16, F(2.8)); B.circle(kx, ky, 22, F(3));                                                 // rose + knob
      const [t1, t2, t3] = TA(), hg = rot(mvG(B, { px: kx, py: ky, r: [[0, -28], [tu(.3), -28], [t1, 16, 'io'], [t2, -10, 'io'], [t3, 5, 'io'], [bH(.25), 0, 'soft']] }), 7, kx, ky);   // swings, settles
      hg.path(`M ${kx - 60} ${ky + 10} Q ${kx - 60} ${ky - 8} ${kx - 42} ${ky - 8} L ${kx + 42} ${ky - 8} Q ${kx + 60} ${ky - 8} ${kx + 60} ${ky + 10} L ${kx + 60} ${ky + 230} Q ${kx + 60} ${ky + 248} ${kx + 42} ${ky + 248} L ${kx - 42} ${ky + 248} Q ${kx - 60} ${ky + 248} ${kx - 60} ${ky + 230} Z`, F(3.2));
      hg.circle(kx, ky + 26, 24, S(2));                                                                                          // the hole
      if (S0.cross) { const g = popG(hg, kx, ky + 150); g.circle(kx, ky + 150, 46, F(3.4)); R(g, kx - 27.6, ky + 143.1, 55.2, 13.8, 4.6, INK); }
      else if (S0.sign && picOf({ icon: S0.sign })) pic({ icon: S0.sign }, kx - 10, ky + 160, 96, c, { pop: true, r: 7 }); else warnTri(popG(hg, kx, ky + 152), kx, ky + 152, 78);
    });
    if (S0.cross) strike(c, -250, -20, 150);
  });

  /* 16 ── ALARM BELL: the hammer strikes the bell at the alert beats (it shakes, the ring marks flash) — on the keyword it rings on:
     flag → the warning plate pops up under it · cross → the thing is struck through */
  variant('bell', 'กระดิ่งเตือนภัย', (d, c) => {
    const S0 = st(d), x = 240, y = -110;
    art(c, p => {
      thingAt(p, c, S0, -230, -10, 240, S0.cross ? 195 : 155);
      const B = inG(sub(p), 'pop', x, y);
      R(B, x - 120, y - 170, 240, 340, 24, F(3.2));                                                                          // wall plate
      const gg = mvG(B, { px: x, py: y, x: shakeK(4) }); gg.circle(x, y, 135, F(3.6)); gg.circle(x, y, 100, S(1.6)); gg.circle(x, y, 22, F(3)); gg.circle(x, y, 7, W(2));   // gong
      R(B, x - 40, y + 120, 80, 50, 10, F(3));
      const hm = mvG(B, { px: x, py: y + 120, r: shakeK(14) }); hm.line(x, y + 120, x + 34, y + 100, W(4)); hm.circle(x + 40, y + 96, 14, F(2.8));   // striker arm + hammer
      const rg = sub(B); on(rg, p, 0, { o: flashK(0, 1, tu(.3)) });
      [[-160, -40, -190, -60], [-170, 10, -205, 10], [-160, 60, -190, 80], [160, -40, 190, -60], [170, 10, 205, 10], [160, 60, 190, 80]].forEach(([a, b, e, f]) => rg.line(x + a, y + b, x + e, y + f, W(3)));
      if (!S0.cross) flagSign(B, c, S0, x, y + 300, 120);
    });
    if (S0.cross) strike(c, -230, -10, 160);
  });

  /* 17 ── INSPECTION CLIPBOARD: the check rows are written in at the alert beats — on the keyword the mark lands in the first row and the photo
     gets the warning (flag) or is struck through (cross) */
  variant('clipboard', 'คลิปบอร์ดตรวจ', (d, c) => {
    const S0 = st(d), px = 0, py = -90, [t1, t2, t3] = TA();
    art(c, p => {
      const B = inG(sub(p), 'pop', 0, 0);
      R(B, -230, -300, 460, 620, 30, F(3.4)); R(B, -200, -250, 400, 540, 8, F(2.8));                                          // board + paper
      B.path('M -80 -276 L -80 -318 Q -80 -334 -64 -334 L 64 -334 Q 80 -334 80 -318 L 80 -276 Z', F(3)); R(B, -110, -282, 220, 40, 12, F(3)); B.circle(0, -312, 10, W(2.2));   // clip
      R(B, px - 150, py - 130, 300, 250, 10, S(1.8));                                                                          // photo frame
      [185, 245].forEach((y, i) => { R(B, -170, y - 22, 44, 44, 8, F(2.6));
        on(B.line(-100, y - 6, 120, y - 6, S(2)), p, [t1, t2][i], { draw: [[0, 0], [tu(.16), 1, 'out']] }); on(B.line(-100, y + 14, 40 + i * 40, y + 14, S(1.6)), p, [t1, t2][i] + tu(.1), { draw: [[0, 0], [tu(.14), 1, 'out']] }); });
      const mk = stampG(B, -148, 185); if (S0.cross) cross(mk, -148, 185, 10, 4.6); else warnTri(mk, -148, 188, 34);
      thingAt(p, c, S0, px, py - 10, 190, null, { t: tu(.36) });
      if (S0.thing && S0.thing.label && picOf(S0.thing)) labT(p, S0.thing, px, py + 170, tu(.44), { size: 36, maxW: 300 });
      if (!S0.cross) flagSign(B, c, S0, px + 150, py - 130, 74);
    });
    if (S0.cross) strike(c, px, py - 10, 112);
  });

  /* 18 ── WIRE FENCE: the fence goes up in front of the trembling thing — on the keyword the plate swings onto the wire: warning (flag) or
     no-entry (cross, the thing struck through behind the wire) */
  variant('fence', 'รั้วตาข่าย', (d, c) => {
    const S0 = st(d);
    art(c, p => { floor(p, 300); thingAt(p, c, S0, 0, -80, 230, null, { t: tu(.05) }); });
    over(c, p => {
      if (S0.cross) noMark(stampG(p, 0, -80), 0, -80, 150);
      const g = inG(sub(p), 'rise', 0, 296, tu(.12));
      const top = -280, bot = 296, l = -360, r = 360, st = 96;
      for (let k = l - (bot - top); k < r; k += st) { const a = Math.max(l, k), b = Math.min(r, k + (bot - top)); if (b > a) g.line(a, top + (a - k), b, top + (b - k), S(1.3)); }
      for (let k = r + (bot - top); k > l; k -= st) { const a = Math.min(r, k), b = Math.max(l, k - (bot - top)); if (a > b) g.line(a, top + (k - a), b, top + (k - b), S(1.3)); }
      R(g, l - 16, top - 10, r - l + 32, 18, 8, F(2.8));                                                                          // top rail
      [l, r].forEach(x => { R(g, x - 15, top - 30, 30, bot - top + 30, 8, F(3)); R(g, x - 21, top - 44, 42, 18, 8, F(2.4)); });   // posts + caps
      if (S0.thing && S0.thing.label && picOf(S0.thing)) { R(g, -150, 50, 300, 66, 12, F(2.8)); lab(g, S0.thing, 0, 96, { maxW: 260, size: 38 }); }
      if (S0.cross) { const q = popG(g, 0, 205); q.circle(0, 205, 64, F(3.4)); R(q, -38.4, 195.4, 76.8, 19.2, 6.4, INK); } else flagSign(g, c, S0, 0, 202, 112);
    });
  });

  /* 19 ── WARNING TRIANGLE (user's pick 19A): the reflective triangle is unfolded and set on the floor, it glints at the alert beats — on the
     keyword its "!" pops (user: "!" in both modes); cross → the thing is struck through as well */
  variant('hazard', 'สามเหลี่ยมฉุกเฉิน', (d, c) => {
    const S0 = st(d), x = 240, h = 330, b = 270;
    art(c, p => { floor(p, 300); thingAt(p, c, S0, -230, -10, 240, S0.cross ? 190 : 160);
      const B = inG(sub(p), 'pop', x, 296); B.line(x - 120, b, x - 170, 296, W(3.4)); B.line(x + 120, b, x + 170, 296, W(3.4));     // legs
      const T = mvG(B, { px: x, py: b, sy: [[0, .12], [tu(.15), .12], [tu(.42), 1, 'back']] });                                    // it is unfolded upright
      T.path(rpoly([[x, b - h], [x + h * .6, b], [x - h * .6, b]], 24), F(3.4));
      const gl = sub(T); on(gl, p, 0, { o: flashK(.72, .72, tu(.4)) }); gl.path(rpoly([[x, b - h + 80], [x + h * .6 - 70, b - 34], [x - h * .6 + 70, b - 34]], 14), W(2.4));   // the reflector glints
      bang(popG(T, x, b - 100), x, b - 100, 120);                                                                                  // always "!" (user)
      if (!S0.cross && S0.sign && picOf({ icon: S0.sign })) pic({ icon: S0.sign }, x, -260, 90, c, { pop: true }); });
    if (S0.cross) strike(c, -230, -10, 160);
  });

  /* 20 ── EMERGENCY STOP: the button's ring pulses at the alert beats — on the keyword: cross → the button is slammed in, the lamp lights and
     the thing is struck through · flag → the warning plate pops up on the box */
  variant('stopbtn', 'ปุ่มหยุดฉุกเฉิน', (d, c) => {
    const S0 = st(d), x = 240, top = -120, pr = S0.cross ? 16 : 0, H = Z.H;
    art(c, p => { floor(p, 300);
      thingAt(p, c, S0, -230, -10, 240, S0.cross ? 195 : 155);
      const B = inG(sub(p), 'rise', x, 300);
      R(B, x - 140, top, 280, 296 - top, 26, F(3.4));                                                                            // box
      B.ellipse(x, top, 110, 30, F(3));                                                                                          // guard collar
      const pu = sub(B); on(pu, p, 0, { o: flashK(0, 0, tu(.3)) }); pu.ellipse(x, top, 132, 42, S(2.4));                        // the ring pulses
      const cap = mvG(B, { y: S0.cross ? [[0, -pr], [bH(.06), -pr], [H, 2, 'in'], [aH(.1), 0, 'soft']] : null });              // slammed in (cross)
      cap.path(`M ${x - 62} ${top} L ${x - 62} ${top - 40 + pr} L ${x + 62} ${top - 40 + pr} L ${x + 62} ${top} Z`, F(3));       // stem
      cap.ellipse(x, top - 40 + pr, 90, 26, F(3.2)); cap.path(`M ${x - 90} ${top - 40 + pr} Q ${x - 88} ${top - 92 + pr} ${x} ${top - 96 + pr} Q ${x + 88} ${top - 92 + pr} ${x + 90} ${top - 40 + pr}`, F(3.4));   // mushroom cap
      if (S0.cross) { const lt = sub(B); on(lt, p, 0, { o: [[0, 0], [H, 0], [aH(.04), 1]] }); lt.circle(x, top + 100, 40, { fill: GLASS, sw: 3.6 }); lt.circle(x, top + 100, 56, S(2));
        [[-150, -90, -175, -110], [150, -90, 175, -110]].forEach(([a, b, e, f]) => lt.line(x + a, top + b, x + e, top + f, W(3))); }
      else flagSign(B, c, S0, x, top + 112, 120);
    });
    if (S0.cross) strike(c, -230, -10, 160);
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
