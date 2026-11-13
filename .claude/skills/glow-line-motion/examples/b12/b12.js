/* b12.js — category B12 "เหตุ → ผล": 20 neutral designs (stills first — the user picks, then motion).
   CutPack CATEGORIES.md B12 (references/cutpack-CATEGORIES.md, cat_ai.py): items [THING ×3] = three links of the chain, in order ·
   end THING (optional) = the sign of the result. "แรงส่งเดินทางทางเดียว ทอดแรกทำให้ทอดถัดไปขยับ — เห็นว่าเกิดต่อกันเอง ไม่ใช่วางเรียงเฉย ๆ".
   Round 3 (current): free design, any number of links — see the round-3 block below.
   Round 1 (science things: circuit board, laser, hydraulics, flasks, steam engine …) → user: "ทำไมมันดูเป็นวิทยาศาสตร์ไปหมด … ผมแค่ต้องการ
   อะไรที่มันเป็นกลาง simple ง่าย ๆ แต่ก็ไม่น้อยจนเกินไป ใส่รายละเอียดเล็ก ๆ น้อย ๆ" + their editorial clips (plain cards, rows, chips, bars,
   connectors) as the example → round 2: neutral cards / tiles / rows / chips / connectors and plain everyday things, in the house glow line.
   Still avoided: dominoes, gears, Newton's cradle, ramps, catapults, pulleys, conveyors, cascades, taps/pipes, snowballs, seesaws, matches.
   Still = the moment after the keyword: the push has gone all the way through, link 3 has fired, the end sign (if any) is lit.
   No end → link 3 gets the halo. A link with no icon → its label in big type; no icon and no label → the holder stays empty.
   GL.cats.B12.draw(i, data, { x, y, s, at, hit, speed }) — canvas 1000 × 700 centred at (0,0); hit = seconds after `at` (default 1.9). */
(function () {
  const G = window.GL, C = G.C, NS = 'http://www.w3.org/2000/svg';
  const W = (w = 2) => ({ sw: w }), F = (w = 3.2) => ({ fill: C.fill, sw: w }), S = (w = 2) => ({ sw: w, stroke: C.soft });
  const rad = d => d * Math.PI / 180, f1 = v => +v.toFixed(1);
  const GLASS = 'rgba(255,255,255,.07)', LIT = 'rgba(255,255,255,.2)', SOLID = (w = 2) => ({ fill: C.ink, sw: w });

  /* TIMING (same system as b01–b11): the keyword c.hit never moves; M = 1/speed but at most hit / HIT0; tu / bH / aH; kf() keeps keys in order */
  const HIT0 = 1.9; let Z = null; const CLAMPS = {}; let CUR = '';
  function setZ(c) { const sp = Math.min(20, Math.max(.05, +(c.speed ?? G.motion().speed ?? 1) || 1)), H = c.hit ?? HIT0, M = Math.max(.4, Math.min(1 / sp, H / HIT0));
    Z = { sp: 1 / M, want: sp, M, H }; }
  const tu = x => x * Z.M, bH = x => Z.H - x * Z.M, aH = x => Z.H + x * Z.M;
  function fixT(spec) { for (const n in spec) { const k = spec[n]; if (!Array.isArray(k)) continue;
    for (let i = 1; i < k.length; i++) if (k[i][0] < k[i - 1][0] - 1e-9) { k[i] = [k[i - 1][0], k[i][1], k[i][2]]; CLAMPS[CUR] = (CLAMPS[CUR] || 0) + 1; } } return spec; }
  const kf = (e, t, spec) => G.kf(e, t, fixT(spec));

  /* ---------- plumbing (b09 family) ---------- */
  const TR = ['x', 'y', 'r', 's', 'sx', 'sy', 'ky'];
  const sub = (p, a) => { const q = p.child(a || {}); q.H = p.H; q.motion = p.motion; return q; };
  const on = (q, p, t, spec) => { const t0 = p.t0 + t * p.ts, fade = q.og && !TR.some(n => spec[n]); kf(fade ? q.og : (q.g || q), t0, spec); };
  const art = (c, fn) => { const f = p => { p.H = Z.H; fn(p); }; f.custom = true; f.dur = .35; f.exit = 'pop';
    const a = G.art(f, { x: c.x, y: c.y, s: c.s, at: c.at || 0, speed: 1 }); a.speed = Z.sp; return a; };
  const over = (c, fn) => art(Object.assign({}, c), fn);
  const atT = (g, p, t) => on(g, p, t, { o: [[0, 0], [tu(.12), 1]] });
  const atG = (q, t) => { const g = sub(q); atT(g, q, t); return g; };
  const R = (q, x, y, w, h, rx, o) => q.rect(x, y, w, h, Object.assign({ rx }, o));
  const rot = (p, a, x, y) => sub(p, { transform: `rotate(${f1(a)} ${f1(x)} ${f1(y)})` });
  const floor = (q, y = 290, a = -480, b = 480) => q.line(a, y, b, y, S(2));
  const lerp = (a, b, k) => a + (b - a) * k;
  const pathOf = (pts, close = true) => 'M ' + pts.map(([x, y]) => f1(x) + ' ' + f1(y)).join(' L ') + (close ? ' Z' : '');
  const shape = (q, pts, o) => q.path(pathOf(pts), o);
  const ringD = (x, y, Ro, Ri) => `M ${x + Ro} ${y} A ${Ro} ${Ro} 0 1 0 ${x - Ro} ${y} A ${Ro} ${Ro} 0 1 0 ${x + Ro} ${y} Z M ${x + Ri} ${y} A ${Ri} ${Ri} 0 1 1 ${x - Ri} ${y} A ${Ri} ${Ri} 0 1 1 ${x + Ri} ${y} Z`;
  function ring(q, x, y, Ro, Ri, o = F(3.2)) { const e = q.path(ringD(x, y, Ro, Ri), o); e.setAttribute('fill-rule', 'evenodd'); return e; }
  /* a hollow tube (white edge, dark core — one shape at any size) */
  const tube = (q, d, w = 16) => { q.path(d, { sw: w }); q.path(d, { sw: w - 7, stroke: C.fill }); };
  const halo = (q, x, y, r) => { q.circle(x, y, r, { fill: 'rgba(255,255,255,.06)', sw: 0, stroke: 'none' }); q.circle(x, y, r, S(1.8)); };
  /* a beam of light / energy: a soft wide glow + a bright core */
  const beam = (q, pts, w = 3.4) => { q.path(pathOf(pts, false), { sw: 18, stroke: 'rgba(255,255,255,.13)' }); q.path(pathOf(pts, false), W(w)); };
  const arcs = (q, x, y, dir, n = 3, r0 = 26, gap = 18, span = 38, o = W(2.4)) => { for (let k = 0; k < n; k++) { const r = r0 + k * gap, a = rad(span);
    q.path(`M ${f1(x + dir * r * Math.cos(a))} ${f1(y - r * Math.sin(a))} A ${r} ${r} 0 0 ${dir > 0 ? 1 : 0} ${f1(x + dir * r * Math.cos(a))} ${f1(y + r * Math.sin(a))}`, o); } };
  let CID = 0;
  function clipG(p, x, y, w, h) { const svg = p.g.ownerSVGElement, cp = document.createElementNS(NS, 'clipPath'), r = document.createElementNS(NS, 'rect');
    cp.id = 'b12clip' + (++CID); Object.entries({ x, y, width: w, height: h }).forEach(([k, v]) => r.setAttribute(k, v)); cp.appendChild(r);
    (svg.querySelector('defs') || svg).appendChild(cp); return sub(p, { 'clip-path': `url(#${cp.id})` }); }
  /* a label; too wide → smaller, or (wrap) two lines broken between Thai words */
  function txt(p, str, x, y, { size = 42, maxW = 1e9, weight = 600, anchor = 'middle', color = C.soft, wrap = null } = {}) {
    str = String(str); const e = p.text(str, x, y, { size, weight, anchor, color, dur: .01 });
    const w = e.getBBox().width; if (w <= maxW) return e;
    if (wrap && maxW / w < .8 && typeof Intl !== 'undefined' && Intl.Segmenter) {
      const seg = [...new Intl.Segmenter('th', { granularity: 'word' }).segment(str)].map(t => t.segment);
      if (seg.length > 1) { let k = 1, best = 1e9, n = 0; const tot = str.length;
        seg.forEach((t, i) => { n += t.length; if (i < seg.length - 1) { const m = Math.max(n, tot - n); if (m < best) { best = m; k = i + 1; } } });
        const l1 = seg.slice(0, k).join('').trim(), l2 = seg.slice(k).join('').trim(), s2 = size * .9, lh = s2 * 1.12;
        const y1 = wrap === 'up' ? y - lh : wrap === 'mid' ? y - lh / 2 : y, a = p.text(l1, x, y1, { size: s2, weight, anchor, color, dur: .01 }), b = p.text(l2, x, y1 + lh, { size: s2, weight, anchor, color, dur: .01 });
        const k2 = Math.min(1, maxW / Math.max(a.getBBox().width, b.getBBox().width)); if (k2 < 1) [a, b].forEach(t => t.setAttribute('font-size', f1(s2 * k2)));
        e.remove(); return a; } }
    e.setAttribute('font-size', f1(size * maxW / w)); return e;
  }
  /* a person doing the design's activity (GL.parts.human, side view facing right — b08's person(); part of the design) */
  const SIDE = { torso: 'M -38 -94 Q 0 -104 32 -92 Q 42 -86 40 -70 L 34 14 Q 0 24 -36 14 L -44 -70 Q -46 -88 -38 -94 Z', head: [8, -134, 31], armOver: true };
  const stand = sd => ({ h: [sd * 6, 8], k: [sd * 10, 88], f: [sd * 14, 166] });
  const stride = sd => sd < 0 ? { h: [-6, 8], k: [-30, 86], f: [-62, 166] } : { h: [6, 8], k: [34, 84], f: [44, 166] };
  function person(q, x, fy, k, arm, o = {}) { const g = q.child({ transform: `translate(${x} ${f1(fy - 166 * k)}) rotate(${o.lean || 0} 0 166) scale(${k})` }, k);
    g.H = q.H; g.motion = q.motion;
    const far = o.far || { s: [arm.s[0] - 8, arm.s[1] + 2], e: [arm.e[0] - 14, arm.e[1] + 10], h: [arm.h[0] - 18, arm.h[1] + 12] }, fa = sub(g);
    [[far.s, far.e, 25], [far.e, far.h, 23]].forEach(([a, b, wd]) => fa.line(...a, ...b, { sw: wd + 7 })); [[far.s, far.e, 25], [far.e, far.h, 23]].forEach(([a, b, wd]) => fa.line(...a, ...b, { sw: wd, stroke: C.fill }));
    return G.parts.human(g, 'line', Object.assign({}, SIDE, { arm: () => arm, leg: o.leg || stand })); }
  /* where a point (lx, ly) of a person drawn by person(x, fy, k, …, lean) lands on the canvas */
  const pAt = (x, fy, k, lx, ly, lean = 0) => { const a = rad(lean), X = lx * k, Y = (ly - 166) * k; return [f1(x + X * Math.cos(a) - Y * Math.sin(a)), f1(fy + X * Math.sin(a) + Y * Math.cos(a))]; };

  /* ---------- the data ---------- */
  const picOf = it => it && it.icon && (G.icons[it.icon] || G.icons[it.icon + '-pro']);
  const has = it => it && (picOf(it) || it.label);
  /* I = the three links (THING or {}) · E = the end sign (only when it has a picture or a label) */
  function st(d) { const I = [0, 1, 2].map(i => (Array.isArray(d.items) && d.items[i]) || {}); return { I, E: has(d.end) ? d.end : null }; }
  const itOf = (S0, i) => i === 3 ? S0.E : S0.I[i];
  /* a THING's picture at (cx, cy), width wd (no icon → its label in big type). o.r = tilt (with the holder) · o.t = when it comes in */
  function pic(it, cx, cy, wd, c, o = {}) {
    if (!it) return null; const at = c.at || 0, X = c.x + cx * c.s, Y = c.y + cy * c.s, fn = picOf(it), t = o.t ?? tu(.12);
    let a;
    if (fn) a = G.art(fn, { x: X, y: Y, w: wd * c.s, at: at + t, speed: Z.sp });
    else { const str = it.label; if (!str) return null;
      const f = q => txt(q, str, 0, wd * .11, { size: wd * .3, maxW: o.bigW || wd * 1.25, weight: 700, color: C.ink, wrap: 'mid' }); f.custom = true; f.dur = .3; f.exit = 'pop';
      a = G.art(f, { x: X, y: Y, s: c.s, at: at + t, speed: 1 }); a.speed = Z.sp; }
    if (o.r) kf(a.wrap, at, { ox: X, oy: Y, r: [[0, o.r]] });
    return a;
  }
  /* link i (0–2) or the end (3): picture at (x, y) width w · its label at (lx, ly) when it has an icon (no icon → the label already is the picture) */
  function thing(q, c, S0, i, x, y, w, ly, o = {}) { const it = itOf(S0, i); if (!it) return;
    pic(it, x, y, w, c, { r: o.r, t: o.t ?? tu(.12 + .1 * i), bigW: o.bigW });
    if (ly != null && it.label && picOf(it)) txt(atG(q, tu(.2 + .1 * i)), it.label, o.lx ?? x, ly, { maxW: o.maxW || 220, color: C.ink, weight: 700, size: o.size || 34, wrap: o.wrap || 'down', anchor: o.anchor || 'middle' }); }
  /* the end sign: halo + a round plate + its picture (+ label). false when there is none */
  function endAt(q, c, S0, x, y, r, ly, o = {}) { if (!S0.E) return false; halo(q, x, y, r + 26); q.circle(x, y, r, F(3.4)); thing(q, c, S0, 3, x, y, r * 1.25, ly, Object.assign({ maxW: 200 }, o)); return true; }
  /* no end sign → the last link is the result: it gets the halo */
  const lastHalo = (q, S0, x, y, r) => { if (!S0.E) halo(q, x, y, r); };
  /* the same glow for a card / tile / chip: a rounded box around it */
  const lastHaloR = (q, S0, x, y, w, h, rx = 30, pad = 24) => { if (S0.E) return; R(q, x - w / 2 - pad, y - h / 2 - pad, w + 2 * pad, h + 2 * pad, rx + pad, { fill: 'rgba(255,255,255,.06)', sw: 0, stroke: 'none' }); R(q, x - w / 2 - pad, y - h / 2 - pad, w + 2 * pad, h + 2 * pad, rx + pad, S(1.8)); };

  const V = [];
  const variant = (id, th, build) => V.push({ id, th, build });

  /* ---------- neutral parts (user 2026-11-13 "เป็นกลาง simple ง่าย ๆ แต่ไม่น้อยเกินไป ใส่รายละเอียดเล็ก ๆ" + their editorial clips as the example:
     plain cards, tiles, rows, chips, connectors — drawn in the house glow line) ---------- */
  /* a card: rounded plate + a small header (dot + short line) */
  function card(q, x, y, w, h, o = {}) { R(q, x - w / 2, y - h / 2, w, h, o.rx ?? 20, o.f || F(3.2));
    if (o.head !== false) { q.circle(x - w / 2 + 26, y - h / 2 + 26, 6, S(1.8)); q.line(x - w / 2 + 42, y - h / 2 + 26, x - w / 2 + 42 + Math.min(90, w * .35), y - h / 2 + 26, S(2)); } }
  const tile = (q, x, y, s, o) => R(q, x - s / 2, y - s / 2, s, s, s * .24, o || F(3.2));
  /* a connector with an arrow head at the end (pts = a polyline) */
  function arrowP(q, pts, o = W(3.2), hd = 16) { q.path(pathOf(pts, false), o); const [a, b] = pts.slice(-2), an = Math.atan2(b[1] - a[1], b[0] - a[0]);
    q.poly([[b[0] - hd * Math.cos(an - .5), b[1] - hd * Math.sin(an - .5)], b, [b[0] - hd * Math.cos(an + .5), b[1] - hd * Math.sin(an + .5)]], o); }
  const glowP = (q, pts, w = 4) => { q.path(pathOf(pts, false), { sw: 14, stroke: 'rgba(255,255,255,.12)' }); q.path(pathOf(pts, false), W(w)); };
  const pulse = (q, x, y) => { halo(q, x, y, 22); q.circle(x, y, 10, SOLID()); };
  const labT = (q, S0, i, x, y, o = {}) => { const it = itOf(S0, i); if (it && it.label && picOf(it)) txt(atG(q, tu(.2 + .1 * i)), it.label, x, y, Object.assign({ maxW: 200, color: C.ink, weight: 700, size: 32, wrap: 'down' }, o)); };

  /* ---------- round 3 (user 2026-11-13: "ไม่ต้องไปสนว่ามันจะมีกี่อัน ขอแค่มันสื่อความหมายว่าจากเหตุไปผล … ออกแบบได้อย่างอิสระ … ไม่ต้องดู reference
     จากคลิป ตามสกิลของเราเลย ขอแค่มันเป็นชุดฐานที่ใช้ได้กับทุกเนื้อหา"): plain everyday things whose own action makes the next thing happen.
     Any number of links: K = the links that have something (1–4; none → two empty holders) · E = the end sign. Pair designs (one thing acts on
     another) read C = the cause (first link) · M = the links between · F = the effect (end sign, else the last link). ---------- */
  function ch(d) { const all = Array.isArray(d.items) ? d.items.slice(0, 4) : [], K0 = all.filter(has), K = K0.length ? K0 : [{}, {}], E = has(d.end) ? d.end : null;
    const C = K[0], M = E ? K.slice(1) : K.slice(1, -1), F = E || (K.length > 1 ? K[K.length - 1] : null); return { K, E, C, M, F, n: K.length }; }
  const spread = (n, a, b) => n === 1 ? [(a + b) / 2] : [...Array(n)].map((_, i) => f1(a + (b - a) * i / (n - 1)));
  /* a THING (it) at (x, y) width w (+ its label at (lx, ly)) — k = 0 cause … higher = later (entrance order) */
  function put(q, c, it, x, y, w, ly, o = {}) { if (!it) return; const k = o.k ?? 0; pic(it, x, y, w, c, { r: o.r, t: tu(.12 + .08 * k), bigW: o.bigW });
    if (ly != null && it.label && picOf(it)) txt(atG(q, tu(.2 + .08 * k)), it.label, o.lx ?? x, ly, { maxW: o.maxW || 200, color: C.ink, weight: 700, size: o.size || 32, wrap: o.wrap === undefined ? 'down' : o.wrap, anchor: o.anchor || 'middle' }); }
  const glowHalo = (q, x, y, r) => halo(q, x, y, r);
  const plate = (q, c, it, x, y, r, ly, o = {}) => { q.circle(x, y, r, F(3.4)); if (o.inner !== false) q.circle(x, y, r - 11, S(1.4)); put(q, c, it, x, y, r * 1.25, ly, o); };
  /* the effect, when it is the end sign: a lit plate with a halo */
  const effect = (q, c, it, x, y, r, ly, o = {}) => { if (!it) return; halo(q, x, y, r + 28); plate(q, c, it, x, y, r, ly, Object.assign({ k: 6 }, o)); };
  const tick = (q, x, y, a, l1, l2, o = W(2.4)) => { const u = rad(a); q.line(x + Math.cos(u) * l1, y + Math.sin(u) * l1, x + Math.cos(u) * l2, y + Math.sin(u) * l2, o); };
  const burst = (q, x, y, r1, r2, n = 8, a0 = 0, skip = []) => { for (let k = 0; k < n; k++) { const a = a0 + k * 360 / n; if (!skip.includes(k)) tick(q, x, y, a, r1, r2); } };

  /* 01 ── BILLIARDS: the cue strikes the white ball; every ball knocks the next one, and the last one runs into the pocket */
  variant('billiards', 'บิลเลียดชนต่อกัน', (d, c) => { const Q = ch(d), ox = Q.E ? -80 : 0, n = Q.n, r = n > 3 ? 50 : 60;
    art(c, p => { const cl = clipG(p, -500, -350, 1000, 700);
      R(p, ox - 380, -235, 760, 470, 46, F(3.4)); R(p, ox - 342, -197, 684, 394, 20, S(2));
      [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([a, b]) => p.circle(ox + a * 350, b * 205, 27, F(3))); [-1, 1].forEach(b => p.circle(ox, b * 214, 24, F(3)));
      [-.5, .5].forEach(a => [-1, 1].forEach(b => p.circle(ox + a * 360, b * 216, 4, SOLID(1))));
      const A = [ox - 140, 70], B = [ox + 262, -126], nx = .44, ny = .9, cue = [ox - 250, 140];
      const P = [...Array(n)].map((_, i) => { const u = n === 1 ? 1 : i / (n - 1), off = i === n - 1 ? 0 : (i % 2 ? -1 : 1) * 46; return [lerp(A[0], B[0], u) + nx * off, lerp(A[1], B[1], u) + ny * off]; });
      [cue, ...P, [ox + 350, -205]].forEach((pt, i, a) => { if (i) p.line(a[i - 1][0], a[i - 1][1], pt[0], pt[1], S(1.6)); });
      p.circle(...cue, 30, F(3)); p.circle(cue[0] - 9, cue[1] - 9, 5, SOLID(1));
      { const tp = [cue[0] - 40, cue[1] + 24], bt = [ox - 395, 222], L = Math.hypot(tp[0] - bt[0], tp[1] - bt[1]), ux = (tp[0] - bt[0]) / L, uy = (tp[1] - bt[1]) / L, qx = -uy, qy = ux;
        shape(cl, [[tp[0] + qx * 6, tp[1] + qy * 6], [tp[0] - qx * 6, tp[1] - qy * 6], [bt[0] - qx * 13, bt[1] - qy * 13], [bt[0] + qx * 13, bt[1] + qy * 13]], F(3)); }
      P.forEach(([x, y], i) => { if (i === n - 1 && !Q.E) halo(p, x, y, r + 30); p.circle(x, y, r, F(3.2)); put(p, c, Q.K[i], x, y, r * 1.3, y + r + 36, { k: i, maxW: 180, size: 30 }); });
      effect(p, c, Q.E, 395, -40, 62, 70);
    }); });

  /* 02 ── LIGHT SWITCH: the switch on the wall (cause) is pressed, the current runs along the ceiling past each box and the lamp lights the effect */
  variant('lamp', 'สวิตช์ผนังเปิดโคมไฟ', (d, c) => { const Q = ch(d), wy = -290, lx = 250, sx = -390;
    art(c, p => { p.line(-480, 300, 480, 300, S(1.8));
      R(p, sx - 75, -20, 150, 230, 16, F(3.4)); [[-58, -3], [58, -3], [-58, 193], [58, 193]].forEach(([a, b]) => p.circle(sx + a, b, 4, S(1.4)));
      R(p, sx - 34, 0, 68, 92, 10, F(2.8)); R(p, sx - 26, 46, 52, 40, 8, { fill: LIT, sw: 2.4 }); put(p, c, Q.C, sx, 150, 66, 250, { k: 0 });
      glowP(p, [[sx, -20], [sx, wy], [lx, wy], [lx, -150]], 3.6);
      const xs = spread(Q.M.length, -230, 110); Q.M.forEach((it, i) => { R(p, xs[i] - 44, wy - 40, 88, 80, 14, F(3.2)); put(p, c, it, xs[i], wy, 58, wy + 82, { k: 1 + i, maxW: 150, size: 28 }); });
      p.path(`M ${lx - 140} 300 L ${lx - 62} -40 L ${lx + 62} -40 L ${lx + 140} 300 Z`, { fill: 'rgba(255,255,255,.08)', sw: 0, stroke: 'none' });
      p.path(`M ${lx - 62} -40 L ${lx - 140} 300 M ${lx + 62} -40 L ${lx + 140} 300`, S(1.4));
      p.path(`M ${lx - 40} -150 L ${lx + 40} -150 L ${lx + 110} -48 L ${lx - 110} -48 Z`, F(3.4)); R(p, lx - 16, -170, 32, 22, 6, F(2.4));
      p.circle(lx, -36, 26, { fill: C.ink, sw: 2 }); burst(p, lx, -36, 40, 56, 8, 0, [5, 6, 7]);
      if (Q.F) { halo(p, lx, 175, 96); put(p, c, Q.F, lx, 175, 120, 296, { k: 6, maxW: 240 }); }
    }); });

  /* 03 ── THE MACHINE: the cause drops into the hopper, the machine works (its lamps light one by one) and the effect slides out of the chute */
  variant('machine', 'เครื่องใส่เหตุออกผล', (d, c) => { const Q = ch(d), bx = -40, by = 60, w = 380, h = 250;
    art(c, p => { p.line(-480, 300, 480, 300, S(1.8));
      [-1, 1].forEach(sd => R(p, bx + sd * (w / 2 - 50) - 16, by + h / 2, 32, 300 - by - h / 2, 4, F(2.6)));
      shape(p, [[bx - 150, by - h / 2 - 110], [bx - 10, by - h / 2 - 110], [bx - 50, by - h / 2], [bx - 110, by - h / 2]], F(3.2)); p.line(bx - 140, by - h / 2 - 96, bx - 20, by - h / 2 - 96, S(1.6));
      R(p, bx - w / 2, by - h / 2, w, h, 20, F(3.4)); R(p, bx - w / 2 + 18, by - h / 2 + 18, w - 36, h - 36, 12, S(1.6));
      [0, 1, 2].forEach(k => p.line(bx + 120, by - h / 2 + 40 + k * 18, bx + 160, by - h / 2 + 40 + k * 18, S(2)));
      p.circle(bx + 150, by - h / 2 + 100, 10, SOLID(1)); [[-170, -105], [170, -105], [-170, 105], [170, 105]].forEach(([a, b]) => p.circle(bx + a, by + b, 4, S(1.4)));
      put(p, c, Q.C, bx - 80, by - h / 2 - 190, 110, null, { k: 0 }); { const it = Q.C; if (it && it.label && picOf(it)) txt(atG(p, tu(.2)), it.label, bx - 250, by - h / 2 - 180, { maxW: 150, color: C.ink, weight: 700, size: 30, wrap: 'down' }); }
      const xs = spread(Math.max(1, Q.M.length), bx - 110, bx + 60); (Q.M.length ? Q.M : [null]).forEach((it, i) => { p.circle(xs[i], by + 10, 46, it ? F(3.2) : { fill: LIT, sw: 3 }); if (it) put(p, c, it, xs[i], by + 10, 56, by + 92, { k: 1 + i, maxW: 140, size: 26 }); });
      shape(p, [[bx + w / 2, by + 50], [bx + w / 2 + 150, by + 110], [bx + w / 2 + 150, by + 134], [bx + w / 2, by + 90]], F(3));
      if (Q.F) { halo(p, bx + w / 2 + 170, by + 30, 100); tile(p, bx + w / 2 + 170, by + 30, 140, F(3.4)); put(p, c, Q.F, bx + w / 2 + 170, by + 30, 94, by + 166, { k: 6, maxW: 200 }); }
    }); });

  /* 04 ── ROPE: a person flicks the rope; the wave runs along it, lifting every bead in turn, and slaps into the post */
  variant('rope', 'สะบัดเชือกคลื่นวิ่ง', (d, c) => { const Q = ch(d), fy = 290, ry = 120, k = .8, px = -420;
    art(c, p => { p.line(-480, fy, 480, fy, S(2));
      const arm = { s: [4, -76], e: [44, -56], h: [86, -38] }; person(p, px, fy, k, arm, { leg: stride });
      const hd = pAt(px, fy, k, 86, -38), postX = 420, xc = 345, pts = [];
      for (let x = hd[0]; x <= postX; x += 8) { const u = (x - xc) / 52, w = 1 - Math.min(1, Math.max(0, (x - hd[0]) / 60)); pts.push([x, ry - 86 * Math.exp(-u * u) + (hd[1] - ry) * w]); }
      pts.push([postX, ry]); tube(p, pathOf(pts, false), 13);
      R(p, postX - 20, 40, 40, 250, 8, F(3.2)); p.circle(postX, ry, 15, F(2.6)); arcs(p, postX + 30, ry - 40, 1, 2, 18, 14, 40, W(2.4));
      const r = Q.n > 3 ? 48 : 56, X = spread(Q.n, -210, 210); X.forEach((x, i) => { if (i === Q.n - 1 && !Q.E) halo(p, x, ry, r + 28); p.circle(x, ry, r, F(3.2)); put(p, c, Q.K[i], x, ry, r * 1.3, ry + r + 40, { k: i, maxW: Q.n > 3 ? 130 : 180 }); });
      effect(p, c, Q.E, postX, -100, 62, -200);
    }); });

  /* 05 ── HIGH STRIKER: a person brings the mallet down on the pad (cause); the puck shoots up past the lamps and rings the bell (effect) */
  variant('striker', 'ค้อนตีระฆังวัดแรง', (d, c) => { const Q = ch(d), tx = 90, fy = 290;
    art(c, p => { p.line(-480, fy, 480, fy, S(2));
      R(p, tx - 26, -205, 52, 495, 8, F(3.2)); p.line(tx, -190, tx, 205, S(1.6)); for (let y = -150; y < 200; y += 50) p.line(tx - 18, y, tx - 8, y, S(1.4));
      R(p, tx - 80, 205, 160, 85, 10, F(3.4)); put(p, c, Q.C, tx, 248, 70, fy + 44, { k: 0 });
      const pd = tx - 230; R(p, pd - 50, 262, 100, 18, 6, F(2.8)); p.line(pd + 50, 271, tx - 80, 271, W(3));
      const ys = spread(Q.M.length, 120, -110); Q.M.forEach((it, i) => { const y = ys[i], sd = i % 2 ? 1 : -1; p.line(tx + sd * 26, y, tx + sd * 60, y, W(3)); p.circle(tx + sd * 108, y, 48, F(3.2)); put(p, c, it, tx + sd * 108, y, 62, y + 80, { k: 1 + i, maxW: 160, size: 28 }); });
      if (Q.F) halo(p, tx, -262, 100); p.line(tx, -205, tx, -222, W(3));
      p.path(`M ${tx - 66} -224 Q ${tx - 60} -300 ${tx} -302 Q ${tx + 60} -300 ${tx + 66} -224 Z`, F(3.4)); R(p, tx - 76, -228, 152, 14, 7, F(2.8));
      put(p, c, Q.F, tx, -262, 60, null, { k: 6 }); if (Q.F && Q.F.label && picOf(Q.F)) txt(atG(p, tu(.5)), Q.F.label, tx + 190, -255, { maxW: 170, color: C.ink, weight: 700, size: 32, wrap: 'down' });
      R(p, tx - 24, -202, 48, 30, 8, SOLID()); [-1, 1].forEach(sd => arcs(p, tx + sd * 82, -256, sd, 2, 18, 16, 40, W(2.6)));
      const px = tx - 470, k = .8, lean = 12; person(p, px, fy, k, { s: [4, -76], e: [46, -44], h: [90, -18] }, { lean, leg: stride });
      const hd = pAt(px, fy, k, 90, -18, lean), hc = [pd, 232]; tube(p, `M ${hd[0]} ${hd[1]} L ${hc[0]} ${hc[1] - 26}`, 15); R(p, hc[0] - 50, hc[1] - 26, 100, 52, 10, F(3.2));
      [-1, 1].forEach(sd => p.line(pd + sd * 64, 248, pd + sd * 82, 236, W(2.4)));
    }); });

  /* 06 ── FAN → PINWHEELS → FLAG: the fan (cause) blows, each pinwheel spins and passes the wind on, the flag (effect) flies */
  variant('fan', 'พัดลมเป่ากังหันธง', (d, c) => { const Q = ch(d), fy = 270, fx = -350, gx = 230;
    art(c, p => { p.line(-480, fy, 480, fy, S(2));
      p.line(fx, 100, fx, fy - 20, W(3)); p.ellipse(fx, fy - 12, 74, 13, F(2.6));
      [0, 120, 240].forEach(a => { const g = rot(p, a + 20, fx, 0); g.ellipse(fx, -54, 24, 44, S(2)); });
      ring(p, fx, 0, 104, 92); [0, 45, 90, 135].forEach(a => { const x = Math.cos(rad(a)), y = Math.sin(rad(a)); p.line(fx - x * 92, -y * 92, fx + x * 92, y * 92, S(1.2)); });
      p.circle(fx, 0, 46, F(3.2)); put(p, c, Q.C, fx, 0, 60, fy + 44, { k: 0 });
      const xs = spread(Q.M.length, -80, 80), ys = Q.M.map((_, i) => i % 2 ? -110 : -20);
      let wx0 = fx + 125; const wind = (a, b, y) => [-30, 20].forEach((o, k) => p.path(`M ${a} ${y + o} q ${(b - a) / 4} -14 ${(b - a) / 2} 0 t ${(b - a) / 2} 0`, k ? S(2.2) : W(2.4)));
      Q.M.forEach((it, i) => { const x = xs[i], y = ys[i]; wind(wx0, x - 120, y); p.line(x, y, x, fy, W(3.2));
        [0, 90, 180, 270].forEach(a => { const g = rot(p, a + 15, x, y); g.path(`M ${x} ${y} L ${x} ${y - 100} Q ${x + 56} ${y - 82} ${x} ${y} Z`, F(3)); });
        p.circle(x, y, 38, F(3.2)); put(p, c, it, x, y, 50, fy + 44, { k: 1 + i, maxW: 150 }); wx0 = x + 110; });
      wind(wx0, gx - 20, -150);
      if (Q.F) halo(p, gx + 86, -155, 120);
      p.line(gx, -240, gx, fy, W(3.4)); p.circle(gx, -246, 8, SOLID(1));
      p.path(`M ${gx} -230 C ${gx + 60} -260, ${gx + 110} -200, ${gx + 170} -225 L ${gx + 170} -85 C ${gx + 110} -60, ${gx + 60} -120, ${gx} -90 Z`, F(3.4));
      put(p, c, Q.F, gx + 86, -155, 70, fy + 44, { k: 6, lx: gx + 40 });
    }); });

  /* 07 ── BLOCKS: the ball rolls into the first block, every block shoves the next, and the last one tips off the table into the box */
  variant('blocks', 'บล็อกดันกันตกกล่อง', (d, c) => { const Q = ch(d), ty = 120, n = Q.n, s = n > 3 ? 112 : 130;
    art(c, p => { R(p, -480, ty, 640, 20, 6, F(3)); [-440, 120].forEach(x => p.line(x, ty + 20, x, 300, W(3)));
      const blk = (x, y, a, it, k) => { const g = rot(p, a, x, y); shape(g, [[x - s / 2, y - s / 2], [x - s / 2 + 20, y - s / 2 - 18], [x + s / 2 + 20, y - s / 2 - 18], [x + s / 2, y - s / 2]], F(2.6)); R(g, x - s / 2, y - s / 2, s, s, 12, F(3.4)); put(p, c, it, x, y, s * .64, null, { r: a, k }); };
      const onT = n - 1, x0 = 130 - s / 2 - (onT - 1) * (s + 6); for (let i = 0; i < onT; i++) { const x = x0 + i * (s + 6); blk(x, ty - s / 2, 0, Q.K[i], i); put(p, c, null, 0, 0, 0); const it = Q.K[i]; if (it.label && picOf(it)) txt(atG(p, tu(.2)), it.label, x, ty + 66, { maxW: s + 20, color: C.ink, weight: 700, size: 30, wrap: 'down' }); }
      const bx = onT ? x0 - s / 2 - 50 : 40; p.circle(bx, ty - 34, 34, F(3.2)); p.path(`M ${bx - 50} ${ty - 34} l -24 0 M ${bx - 46} ${ty - 56} l -18 -8 M ${bx - 46} ${ty - 12} l -18 8`, S(2));
      if (!Q.E) halo(p, 230, 135, 110); blk(230, 120, 28, Q.K[n - 1], n - 1);
      p.path(`M 120 ${ty + 30} Q 190 ${ty - 30} 228 50`, S(1.6));
      R(p, 150, 210, 200, 90, 8, F(3.2)); shape(p, [[150, 210], [120, 176], [150, 186]], F(2.4)); shape(p, [[350, 210], [380, 176], [350, 186]], F(2.4));
      { const it = Q.K[n - 1]; if (it.label && picOf(it)) txt(atG(p, tu(.3)), it.label, 250, 340, { maxW: 200, color: C.ink, weight: 700, size: 30 }); }
      effect(p, c, Q.E, 400, -100, 60, 5);
    }); });

  /* 08 ── BOXES: the ball drops into the top box, falls through each box into the next, and rolls out at the bottom */
  variant('boxes', 'กล่องซ้อนลูกบอลหล่น', (d, c) => { const Q = ch(d), n = Q.n, w = 210, h = n > 3 ? 90 : 108, X = spread(n, -170, 140), Y = spread(n, -225, 160);
    art(c, p => { p.line(-480, 300, 480, 300, S(1.8));
      p.path(pathOf([[X[0], -345], ...X.map((x, i) => [x, Y[i]]), [X[n - 1], 278], [Q.E ? 330 : X[n - 1] + 70, 278]], false), S(1.6));
      X.forEach((x, i) => { const y = Y[i]; if (i === n - 1 && !Q.E) lastHaloR(p, Q, x, y - 14, w + 80, h + 40, 14, 14);
        shape(p, [[x - w / 2, y - h / 2], [x - w / 2 - 40, y - h / 2 - 34], [x - w / 2 + 20, y - h / 2 - 28]], F(2.6)); shape(p, [[x + w / 2, y - h / 2], [x + w / 2 + 40, y - h / 2 - 34], [x + w / 2 - 20, y - h / 2 - 28]], F(2.6));
        R(p, x - w / 2, y - h / 2, w, h, 8, F(3.4)); p.line(x - w / 2 + 14, y - h / 2 + 16, x + w / 2 - 14, y - h / 2 + 16, S(1.6));
        put(p, c, Q.K[i], x, y + 6, h * .56, null, { k: i }); const it = Q.K[i]; if (it.label && picOf(it)) txt(atG(p, tu(.2)), it.label, x - w / 2 - 90, y + 12, { maxW: 150, color: C.ink, weight: 700, size: 30 }); });
      p.circle(Q.E ? 290 : X[n - 1] + 70, 278, 22, SOLID());
      effect(p, c, Q.E, 390, 200, 58, 100);
    }); });

  /* 09 ── CHARGER: the plug (cause) goes in, the battery fills cell by cell (the links between) and the effect lights at its tip */
  variant('battery', 'เสียบสายชาร์จแบตเต็ม', (d, c) => { const Q = ch(d), y = 20, bx = -170, bw = 400, bh = 190, nc = Math.max(3, Q.M.length);
    art(c, p => {
      R(p, -470, y - 70, 130, 140, 18, F(3.4)); [-1, 1].forEach(sd => R(p, -340, y + sd * 26 - 7, 36, 14, 4, F(2.4))); put(p, c, Q.C, -405, y, 82, y - 100, { k: 0, wrap: 'up' });
      tube(p, `M -410 ${y + 70} Q -410 230 -300 230 L ${bx - 40} 230 Q ${bx - 20} 230 ${bx - 20} ${y + 60}`, 14); R(p, bx - 34, y + 20, 28, 44, 6, F(2.6));
      R(p, bx, y - bh / 2, bw, bh, 26, F(3.6)); R(p, bx + bw, y - 40, 26, 80, 8, F(3)); p.path(`M ${bx + 40} ${y - bh / 2 - 34} l -14 24 l 14 0 l -10 22`, W(3));
      const cw = (bw - 40 - (nc - 1) * 12) / nc; for (let k = 0; k < nc; k++) { const x = bx + 20 + k * (cw + 12); R(p, x, y - bh / 2 + 20, cw, bh - 40, 12, { fill: LIT, sw: 2.6 });
        const it = Q.M[k]; if (it) put(p, c, it, x + cw / 2, y - 12, Math.min(70, cw * .62), y + 30, { k: 1 + k, maxW: cw - 10, size: 24, wrap: null }); }
      if (Q.F) { halo(p, 410, y, 86); plate(p, c, Q.F, 410, y, 60, y + 106, { k: 6, maxW: 160 }); p.line(bx + bw + 26, y, 350, y, W(3)); }
    }); });

  /* 10 ── SHAKEN BOTTLE: the bottle (cause) is shaken, the bubbles race up (the links between), the cap pops and the effect bursts out */
  variant('bottle', 'เขย่าขวดฝาเด้ง', (d, c) => { const Q = ch(d), bx = -230, by = 110;
    art(c, p => { p.line(-480, 300, 480, 300, S(1.8));
      const g = rot(p, 14, bx, 300); g.path(`M ${bx - 80} 300 L ${bx - 80} ${by - 40} Q ${bx - 80} ${by - 110} ${bx - 30} ${by - 150} L ${bx - 30} ${by - 210} L ${bx + 30} ${by - 210} L ${bx + 30} ${by - 150} Q ${bx + 80} ${by - 110} ${bx + 80} ${by - 40} L ${bx + 80} 300 Z`, F(3.6));
      R(g, bx - 80, by + 10, 160, 120, 4, S(1.8)); [[-40, -60, 8], [20, -90, 6], [-10, -130, 7]].forEach(([a, b, r]) => g.circle(bx + a, by + b, r, S(1.8)));
      put(p, c, Q.C, bx + 18, by + 70, 80, 340, { k: 0, r: 14 });
      [[-1, 0], [1, 0]].forEach(([sd]) => [0, 1].forEach(k => p.path(`M ${bx + sd * (120 + k * 18)} ${by - 40 + k * 30} q ${sd * 10} 20 0 40`, S(2))));
      const neck = [bx + 30 + 40, by - 230], tgt = [300, -180];
      p.path(`M ${neck[0]} ${neck[1]} Q ${neck[0] + 20} -330 ${tgt[0] - 60} ${tgt[1] - 40}`, W(2.6)); p.path(`M ${neck[0] - 14} ${neck[1] + 6} Q ${neck[0] - 30} -300 ${neck[0] + 40} -320`, S(2));
      const cg = rot(p, 40, neck[0] + 100, -300); R(cg, neck[0] + 70, -318, 60, 30, 8, F(3)); for (let k = 0; k < 4; k++) cg.line(neck[0] + 80 + k * 13, -318, neck[0] + 80 + k * 13, -300, S(1.4));
      const pts = Q.M.map((_, i) => { const u = (i + 1) / (Q.M.length + 1); return [lerp(neck[0] + 40, tgt[0] - 80, u), lerp(-80, -200, u) + (i % 2 ? 50 : -10)]; });
      Q.M.forEach((it, i) => plate(p, c, it, pts[i][0], pts[i][1], 46, pts[i][1] + 80, { k: 1 + i, maxW: 150, size: 28 }));
      [[neck[0] + 70, -60, 14], [neck[0] + 110, -10, 10], [neck[0] + 30, -120, 11]].forEach(([x, y, r]) => p.circle(x, y, r, S(2)));
      if (Q.F) { halo(p, tgt[0] + 40, tgt[1] + 40, 120); p.circle(tgt[0] + 40, tgt[1] + 40, 82, F(3.4)); burst(p, tgt[0] + 40, tgt[1] + 40, 96, 120, 10); put(p, c, Q.F, tgt[0] + 40, tgt[1] + 40, 100, tgt[1] + 186, { k: 6 }); }
    }); });

  /* 11 ── BULB HORN: the rubber bulb (cause) is squeezed, the air runs through the horn and the sound carries to the effect */
  variant('horn', 'บีบแตรเสียงดัง', (d, c) => { const Q = ch(d), y0 = -40;
    art(c, p => {
      p.ellipse(-350, 90, 105, 88, F(3.6)); p.path('M -430 60 Q -400 30 -360 26', S(2)); put(p, c, Q.C, -350, 96, 80, 220, { k: 0 });
      R(p, -262, 70, 34, 40, 8, F(2.8)); tube(p, `M -228 90 Q -150 90 -150 30 Q -150 ${y0} -90 ${y0}`, 24);
      p.path(`M -90 ${y0 - 14} L 40 ${y0 - 34} Q 70 ${y0 - 110} 110 ${y0 - 120} L 110 ${y0 + 120} Q 70 ${y0 + 110} 40 ${y0 + 34} L -90 ${y0 + 14} Z`, F(3.6));
      p.ellipse(110, y0, 22, 120, F(3)); p.ellipse(110, y0, 10, 90, S(1.6)); R(p, -90, y0 - 20, 22, 40, 6, F(2.4));
      const xs = spread(Q.M.length, 230, 300); let x = 140;
      Q.M.forEach((it, i) => { const mx = Q.M.length === 1 ? 250 : 200 + i * 96; arcs(p, x, y0, 1, 2, 28, 16, 44, W(2.4)); plate(p, c, it, mx, y0, 44, y0 + 86, { k: 1 + i, maxW: 140, size: 28 }); x = mx + 46; });
      arcs(p, x, y0, 1, 3, 28, 18, 46, W(2.6));
      if (Q.F) effect(p, c, Q.F, 400, y0, 62, y0 + 108);
    }); });

  /* 12 ── PUMP: the pump (cause) is pushed down, the air runs along the hose past each valve, and the ball (effect) swells up */
  variant('pump', 'สูบลมลูกบอลพอง', (d, c) => { const Q = ch(d), fy = 280, px = -380;
    art(c, p => { p.line(-480, fy, 480, fy, S(2));
      R(p, px - 90, fy - 14, 180, 14, 6, F(2.6)); R(p, px - 44, -40, 88, fy - 14 + 40, 16, F(3.4)); R(p, px - 9, -120, 18, 82, 4, F(2.4)); R(p, px - 90, -136, 180, 24, 12, F(3));
      p.path(`M ${px - 22} -70 l 0 -26 m -12 12 l 12 14 l 12 -14`, W(2.6)); put(p, c, Q.C, px, 110, 70, fy + 44, { k: 0 });
      tube(p, `M ${px + 44} ${fy - 40} Q ${px + 100} ${fy - 40} ${px + 120} ${fy - 20} L 120 ${fy - 20} Q 150 ${fy - 20} 150 ${fy - 60}`, 13);
      const xs = spread(Q.M.length, -190, 30); Q.M.forEach((it, i) => { R(p, xs[i] - 30, fy - 46, 60, 52, 10, F(3)); p.circle(xs[i], fy - 92, 42, F(3.2)); p.line(xs[i], fy - 50, xs[i], fy - 50, S(1)); put(p, c, it, xs[i], fy - 92, 54, fy + 44, { k: 1 + i, maxW: 150 }); });
      if (Q.F) { const bx = 230, by = -10; halo(p, bx, by, 190); p.circle(bx, by, 160, F(3.6)); p.path(`M ${bx - 150} ${by - 40} Q ${bx} ${by - 90} ${bx + 150} ${by - 40}`, S(1.8)); p.path(`M ${bx - 150} ${by + 40} Q ${bx} ${by + 90} ${bx + 150} ${by + 40}`, S(1.8));
        R(p, 140, by + 140, 20, 40, 6, F(2.4)); [-150, -100].forEach(a => tick(p, bx, by, a, 176, 196)); [20, -20].forEach(a => tick(p, bx, by, a, 176, 196)); put(p, c, Q.F, bx, by, 140, fy + 44, { k: 6, lx: bx + 40 }); }
    }); });

  /* 13 ── BOWLING: the ball (cause) rolls into the pins; each pin knocks the next, the last one flies to the effect */
  variant('bowling', 'โบว์ลิ่งล้มต่อกัน', (d, c) => { const Q = ch(d), fy = 270, pins = Q.M.concat(Q.E ? [] : []), np = Math.max(1, Q.M.length);
    art(c, p => { p.line(-480, fy, 480, fy, S(2)); p.line(-480, fy + 30, 480, fy + 30, S(1.4));
      [[-380, -160], [-310, -175]].forEach(([x, a]) => p.line(x, fy - 50, x + 50, fy - 50, S(2)));
      p.circle(-230, fy - 80, 80, F(3.6)); [[-250, -116], [-222, -128], [-210, -102]].forEach(([x, y]) => p.circle(x, fy + y + 20, 8, F(2)));
      put(p, c, Q.C, -230, fy - 70, 70, fy + 44, { k: 0 });
      const pin = (x, a, it, k, ly) => { const g = rot(p, a, x, fy); g.path(`M ${x - 26} ${fy} Q ${x - 52} ${fy - 70} ${x - 32} ${fy - 130} Q ${x - 18} ${fy - 170} ${x - 20} ${fy - 200} Q ${x - 24} ${fy - 236} ${x} ${fy - 240} Q ${x + 24} ${fy - 236} ${x + 20} ${fy - 200} Q ${x + 18} ${fy - 170} ${x + 32} ${fy - 130} Q ${x + 52} ${fy - 70} ${x + 26} ${fy} Z`, F(3.4));
        g.line(x - 20, fy - 196, x + 20, fy - 196, S(1.8)); g.line(x - 22, fy - 182, x + 22, fy - 182, S(1.8));
        const u = rad(a), cx = x + Math.sin(u) * 80, cy = fy - Math.cos(u) * 80; put(p, c, it, cx, cy, 52, ly, { k, r: a, maxW: 130, size: 28 }); };
      const xs = spread(np, -40, 160); (Q.M.length ? Q.M : [null]).forEach((it, i) => pin(xs[i], 22 + i * 10, it || {}, 1 + i, fy + 44));
      if (Q.F) { const ex = 380, ey = -120; halo(p, ex, ey, 100); plate(p, c, Q.F, ex, ey, 70, ey + 118, { k: 6 }); [[-1], [1]].forEach(([sd]) => tick(p, ex, ey, 200 + sd * 30, 96, 120)); }
    }); });

  /* 14 ── DOOR KNOCKER: the knock (cause) opens the door; inside, the light falls on the effect */
  variant('knocker', 'เคาะประตูแล้วเปิด', (d, c) => { const Q = ch(d), fy = 290, dx = 80, dw = 250, dh = 470;
    art(c, p => { p.line(-480, fy, 480, fy, S(2));
      R(p, dx - dw / 2 - 26, fy - dh - 26, dw + 52, dh + 26, 10, F(3.4)); R(p, dx - dw / 2, fy - dh, dw, dh, 4, { fill: LIT, sw: 2.4 });
      p.path(`M ${dx - dw / 2} ${fy} L ${dx + dw / 2} ${fy} L ${dx + dw / 2 + 70} ${fy + 50} L ${dx - dw / 2 - 90} ${fy + 50} Z`, { fill: 'rgba(255,255,255,.1)', sw: 0, stroke: 'none' });
      shape(p, [[dx - dw / 2, fy - dh], [dx - dw / 2 - 110, fy - dh + 40], [dx - dw / 2 - 110, fy - 24], [dx - dw / 2, fy]], F(3.4));
      shape(p, [[dx - dw / 2 - 18, fy - dh + 44], [dx - dw / 2 - 92, fy - dh + 70], [dx - dw / 2 - 92, fy - dh + 190], [dx - dw / 2 - 18, fy - dh + 176]], S(1.6)); shape(p, [[dx - dw / 2 - 18, fy - 210], [dx - dw / 2 - 92, fy - 196], [dx - dw / 2 - 92, fy - 60], [dx - dw / 2 - 18, fy - 62]], S(1.6));
      const kx = dx - dw / 2 - 55, ky = fy - 250; p.circle(kx, ky, 46, F(3.4)); p.circle(kx, ky - 54, 9, F(2.4)); put(p, c, Q.C, kx, ky, 58, null, { k: 0 });
      if (Q.C && Q.C.label && picOf(Q.C)) txt(atG(p, tu(.2)), Q.C.label, kx - 160, ky + 10, { maxW: 150, color: C.ink, weight: 700, size: 30 });
      [[-1, -1], [-1.4, 0], [-1, 1]].forEach(([a, b]) => p.line(kx + a * 70, ky + b * 40, kx + a * 92, ky + b * 52, W(2.4)));
      const xs = spread(Q.M.length, -330, -200); Q.M.forEach((it, i) => { p.ellipse(xs[i] + 40 * i, fy + 20, 60, 14, F(2.4)); plate(p, c, it, xs[i] + 40 * i, fy - 50, 40, null, { k: 1 + i }); });
      if (Q.F) { halo(p, dx, fy - 210, 130); put(p, c, Q.F, dx, fy - 210, 130, fy - 60, { k: 6, maxW: 220 }); }
      p.circle(dx + dw / 2 - 30, fy - 230, 0.1, S(1));
    }); });

  /* 15 ── PUPPET: the control bar (cause) tilts, the strings pull, and the puppet lifts the effect */
  variant('puppet', 'หุ่นชักใย', (d, c) => { const Q = ch(d), px = 60, bx = 60, byy = -270, k = .95;
    art(c, p => { p.line(-480, 300, 480, 300, S(1.8));
      const bar = rot(p, -10, bx, byy); R(bar, bx - 190, byy - 14, 380, 28, 12, F(3.2)); R(bar, bx - 14, byy - 70, 28, 140, 10, F(3)); bar.circle(bx, byy, 50, F(3.4)); put(p, c, Q.C, bx, byy, 62, null, { k: 0, r: -10 });
      if (Q.C && Q.C.label && picOf(Q.C)) txt(atG(p, tu(.2)), Q.C.label, bx - 330, byy + 10, { maxW: 180, color: C.ink, weight: 700, size: 32 });
      const g = p.child({ transform: `translate(${px} ${f1(300 - 166 * k)}) scale(${k})` }, k); g.H = p.H; g.motion = p.motion;
      const arm = sd => sd < 0 ? { s: [-36, -82], e: [-74, -130], h: [-82, -190] } : { s: [36, -82], e: [60, -26], h: [64, 34] };
      G.parts.human(g, 'line', { arm });
      const hand = [px - 82 * k, 300 - 166 * k - 190 * k], head = [px, 300 - 166 * k - 132 * k - 31 * k], hR = [px + 64 * k, 300 - 166 * k + 34 * k];
      const ends = [[bx - 186, byy + 32], [bx - 6, byy - 4], [bx + 182, byy - 34]]; [[ends[0], hand], [ends[1], head], [ends[2], hR]].forEach(([a, b]) => p.line(a[0], a[1], b[0], b[1], S(1.6)));
      const mids = Q.M.map((_, i) => { const t = (i + 1) / (Q.M.length + 1), A = ends[2], B = hR; return [lerp(A[0], B[0], t) + 90, lerp(A[1], B[1], t)]; });
      Q.M.forEach((it, i) => { p.line(mids[i][0] - 90, mids[i][1], mids[i][0] - 44, mids[i][1], S(1.6)); plate(p, c, it, mids[i][0], mids[i][1], 42, null, { k: 1 + i }); if (it.label && picOf(it)) txt(atG(p, tu(.3)), it.label, mids[i][0] + 120, mids[i][1] + 10, { maxW: 140, color: C.ink, weight: 700, size: 28 }); });
      if (Q.F) { const ex = hand[0] - 120, ey = hand[1] - 20; p.line(hand[0], hand[1], ex + 50, ey + 30, W(3)); halo(p, ex, ey, 92); plate(p, c, Q.F, ex, ey, 64, ey + 108, { k: 6 }); }
    }); });

  /* 16 ── HAND PUMP (user 2026-11-13 picked option A of the redesign; the marble run is gone): the handle (cause) is pumped, the water runs along the trough past each marker, and fills the bucket (effect) */
  variant('handpump', 'ปั๊มน้ำมือโยก', (d, c) => { const Q = ch(d), fy = 280, px = -300;
    art(c, p => { p.line(-480, fy, 480, fy, S(2));
      R(p, px - 70, fy - 30, 140, 30, 8, F(3)); R(p, px - 44, -90, 88, fy - 30 + 90, 18, F(3.4)); R(p, px - 54, -110, 108, 26, 10, F(3));
      tube(p, `M ${px + 44} -50 L ${px + 120} -50 L ${px + 120} -24`, 22); p.circle(px, -128, 10, F(2.4));
      tube(p, `M ${px} -128 L ${px - 120} -220`, 16); R(p, px - 150, -250, 54, 40, 12, F(3)); p.path(`M ${px - 100} -290 a 40 40 0 0 0 -40 30`, S(2)); p.poly([[px - 144, -276], [px - 140, -260], [px - 124, -266]], S(2));
      put(p, c, Q.C, px, 110, 70, fy + 44, { k: 0 });
      p.path(`M ${px + 120} -20 Q ${px + 124} 20 ${px + 130} 52`, W(3)); p.path(`M ${px + 110} -20 Q ${px + 112} 20 ${px + 116} 52`, S(2));
      R(p, px + 90, 52, 420, 30, 6, F(3)); p.path(`M ${px + 100} 60 q 25 -6 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0`, S(1.8));
      [px + 150, px + 450].forEach(x => p.line(x, 82, x, fy, W(2.6)));
      const xs = spread(Q.M.length, px + 170, px + 400); Q.M.forEach((it, i) => { p.line(xs[i], 52, xs[i], 20, W(2.4)); plate(p, c, it, xs[i], -26, 44, -90, { k: 1 + i, maxW: 140, size: 28, wrap: 'up' }); });
      p.path(`M ${px + 510} 60 Q ${px + 540} 70 ${px + 546} 130`, W(3)); p.path(`M ${px + 506} 72 Q ${px + 530} 86 ${px + 534} 130`, S(2));
      const bx = 230; if (Q.F) halo(p, bx, 205, 112);
      p.path(`M ${bx - 90} 130 L ${bx + 90} 130 L ${bx + 72} ${fy} L ${bx - 72} ${fy} Z`, F(3.4)); p.path(`M ${bx - 84} 152 L ${bx + 84} 152 L ${bx + 72} ${fy - 6} L ${bx - 72} ${fy - 6} Z`, { fill: LIT, sw: 0, stroke: 'none' });
      p.path(`M ${bx - 84} 152 q 21 -8 42 0 t 42 0 t 42 0 t 42 0`, W(2)); p.path(`M ${bx - 90} 130 Q ${bx} 40 ${bx + 90} 130`, S(2));
      put(p, c, Q.F, bx, 214, 70, fy + 44, { k: 6, maxW: 200 });
    }); });

  /* 17 ── CROQUET: the mallet (cause) strikes the ball, it rolls through every hoop (the links between) and knocks the post (effect) */
  variant('croquet', 'ตีลูกผ่านห่วง', (d, c) => { const Q = ch(d), fy = 270;
    art(c, p => { p.line(-480, fy, 480, fy, S(2)); p.path(`M -480 ${fy + 34} q 60 -10 120 0 t 120 0 t 120 0 t 120 0 t 120 0 t 120 0 t 120 0 t 120 0`, S(1.4));
      tube(p, `M -300 -10 L -400 ${fy - 46}`, 15); const mg = rot(p, -30, -410, fy - 40); R(mg, -480, fy - 80, 140, 72, 18, F(3.4)); mg.line(-462, fy - 80, -462, fy - 8, S(1.6)); mg.line(-358, fy - 80, -358, fy - 8, S(1.6));
      p.circle(-262, fy - 26, 54, F(3.2)); put(p, c, Q.C, -262, fy - 26, 62, fy + 44, { k: 0 }); [[0, -1], [-1, -.5], [-1, .5]].forEach(([a, b]) => tick(p, -330, fy - 40, 180 + 30 * a + 30 * b, 6, 26));
      const xs = spread(Q.M.length, -60, 160); Q.M.forEach((it, i) => { const x = xs[i]; p.path(`M ${x - 52} ${fy} L ${x - 52} ${fy - 84} A 52 52 0 0 1 ${x + 52} ${fy - 84} L ${x + 52} ${fy}`, { sw: 14 }); p.path(`M ${x - 52} ${fy} L ${x - 52} ${fy - 84} A 52 52 0 0 1 ${x + 52} ${fy - 84} L ${x + 52} ${fy}`, { sw: 7, stroke: C.fill });
        plate(p, c, it, x, fy - 200, 46, null, { k: 1 + i }); p.line(x, fy - 154, x, fy - 136, S(2)); if (it.label && picOf(it)) txt(atG(p, tu(.3)), it.label, x, fy + 44, { maxW: 150, color: C.ink, weight: 700, size: 28 }); });
      p.path(`M -205 ${fy - 26} L 310 ${fy - 26}`, S(1.4)); p.circle(310, fy - 26, 26, SOLID());
      R(p, 352, fy - 300, 26, 300, 8, F(3.2)); [0, 1, 2].forEach(k => p.line(352, fy - 260 + k * 60, 378, fy - 248 + k * 60, S(2)));
      if (Q.F) { halo(p, 365, -110, 96); plate(p, c, Q.F, 365, -110, 64, -10, { k: 6, maxW: 170 }); }
    }); });

  /* 18 ── GROWING TILES: one thing leads to a bigger one, and a bigger one again */
  variant('grow', 'ใหญ่ขึ้นทีละทอด', (d, c) => { const Q = ch(d), n = Q.n, by = 140, sz = spread(n, n > 3 ? 90 : 115, n > 3 ? 190 : 220), gap = 70;
    art(c, p => { p.line(-470, by + 14, 470, by + 14, S(1.8));
      const tot = sz.reduce((a, b) => a + b, 0) + gap * (n - 1) + (Q.E ? gap + 150 : 0); let x = -tot / 2;
      sz.forEach((s, i) => { const cx = x + s / 2, y = by - s / 2; if (i === n - 1 && !Q.E) halo(p, cx, y, s * .7 + 10); tile(p, cx, y, s, F(3.4)); p.circle(cx - s / 2 + 22, y - s / 2 + 22, 5, S(1.6));
        put(p, c, Q.K[i], cx, y, s * .58, by + 62, { k: i, maxW: Math.max(150, s) });
        x += s; if (i < n - 1 || Q.E) { const m = x + gap / 2; [-14, 8].forEach(o => p.poly([[m + o - 8, by - 60 - 16], [m + o + 6, by - 60], [m + o - 8, by - 60 + 16]], W(3.4))); } x += gap; });
      if (Q.E) effect(p, c, Q.E, x + 75, by - 80, 72, by + 62);
    }); });

  /* 19 ── BEAD TUBE: the plunger pushes into the clear tube; every bead pushes the next and the last one pops out of the open end */
  variant('beads', 'ลูกปัดดันในหลอดใส', (d, c) => { const Q = ch(d), n = Q.n, y = 0, r = n > 3 ? 46 : 54, t0 = -330, t1 = 250;
    art(c, p => {
      R(p, t0, y - 66, t1 - t0, 132, 66, { fill: GLASS, sw: 3.4 }); p.line(t0 + 40, y - 44, t1 - 50, y - 44, S(1.6));
      [t0 + 70, t1 - 70].forEach(x => { p.line(x, y + 66, x, 200, W(3)); R(p, x - 44, 200, 88, 16, 6, F(2.6)); });
      const inT = n - 1, xe = t1 - r - 4, xs = [...Array(inT)].map((_, i) => xe - (inT - 1 - i) * (2 * r + 4)), head = inT ? xs[0] - r - 12 : t1 - 70;
      R(p, -480, y - 10, head - 22 + 480, 20, 6, F(2.6)); R(p, -500, y - 50, 24, 100, 8, F(3)); R(p, head - 22, y - 56, 22, 112, 8, F(3));
      xs.forEach((x, i) => { p.circle(x, y, r, F(3.4)); put(p, c, Q.K[i], x, y, r * 1.3, y + 140, { k: i, maxW: 2 * r + 30, size: 28 }); });
      const lx = 360; if (!Q.E) halo(p, lx, y, r + 30); p.circle(lx, y, r, F(3.4)); put(p, c, Q.K[n - 1], lx, y, r * 1.3, y + 140, { k: n - 1 });
      [[t1 + 16, -30], [t1 + 24, 0], [t1 + 16, 30]].forEach(([x, yy]) => p.line(x, y + yy, x + 26, y + yy, S(2)));
      if (Q.E) { effect(p, c, Q.E, 360, -200, 58, null); if (Q.E.label && picOf(Q.E)) txt(atG(p, tu(.5)), Q.E.label, 230, -190, { maxW: 150, color: C.ink, weight: 700, size: 30 }); }
    }); });

  /* 20 ── REMOTE & SCREEN: the button on the remote (cause) is pressed, the signal hops on, and the screen comes on with the effect */
  variant('remote', 'รีโมตเปิดจอ', (d, c) => { const Q = ch(d), sx = 230, sy = -50, sw = 380, sh = 260;
    art(c, p => { p.line(-480, 300, 480, 300, S(1.8));
      const rg = rot(p, -24, -360, 120); R(rg, -420, -10, 120, 290, 40, F(3.6)); rg.circle(-360, 60, 44, F(3.2)); [0, 1, 2].forEach(k => [0, 1].forEach(j => R(rg, -392 + j * 40, 140 + k * 36, 24, 18, 6, S(1.8)))); R(rg, -376, 6, 32, 12, 5, SOLID(1));
      put(p, c, Q.C, -333, 58, 56, null, { k: 0, r: -24 }); if (Q.C && Q.C.label && picOf(Q.C)) txt(atG(p, tu(.2)), Q.C.label, -330, 330, { maxW: 200, color: C.ink, weight: 700, size: 30, wrap: null });
      const tip = [-300, -40], xs = spread(Q.M.length, -170, -20); let a = tip;
      Q.M.forEach((it, i) => { const y = -160 + (i % 2) * 90; arcs(p, a[0] + 20, a[1] - 10, 1, 2, 22, 14, 40, S(2.2)); plate(p, c, it, xs[i] + 30, y, 44, y + 80, { k: 1 + i, maxW: 140, size: 28 }); a = [xs[i] + 80, y]; });
      arcs(p, a[0] + 10, a[1], 1, 3, 22, 16, 40, W(2.4));
      R(p, sx - sw / 2, sy - sh / 2, sw, sh, 20, F(3.6)); R(p, sx - sw / 2 + 18, sy - sh / 2 + 18, sw - 36, sh - 36, 10, { fill: LIT, sw: 2.2 });
      shape(p, [[sx - 50, sy + sh / 2], [sx + 50, sy + sh / 2], [sx + 80, 290], [sx - 80, 290]], F(3)); p.circle(sx + sw / 2 - 30, sy + sh / 2 - 9, 4, SOLID(1));
      if (Q.F) { halo(p, sx, sy - 10, 110); put(p, c, Q.F, sx, sy - 14, 120, sy + 92, { k: 6, maxW: 260, size: 30, wrap: null }); }
    }); });

  /* ---------- sample data (A: sentences from unrelated topics, 1–4 links · B: stress) ---------- */
  const I = (icon, label) => label ? { icon, label } : { icon };
  const SAMPLES = [
    { say: 'นอนดึก ตื่นสาย เลยตกรถ', items: [I('moon', 'นอนดึก'), I('alarm-clock', 'ตื่นสาย'), I('bus', 'ตกรถ')], end: I('x') },
    { say: 'กดสวิตช์ ไฟก็ติด', items: [I('power', 'กดสวิตช์'), I('lamp', 'ไฟติด')] },
    { say: 'ใส่ใจรายละเอียด งานเลยออกมาดี', items: [I('search', 'ใส่ใจ')], end: I('award', 'งานดี') },
    { say: 'ฝนตก ถนนลื่น รถชนกัน', items: [I('droplets', 'ฝนตก'), I('triangle-alert', 'ถนนลื่น'), I('car', 'รถชน')] },
    { say: 'โพสต์ดี คนแชร์ ยอดวิวพุ่ง ได้งานใหม่', items: [I('video', 'คลิปดี'), I('share-2', 'คนแชร์'), I('eye', 'ยอดวิว'), I('briefcase', 'งานใหม่')] },
    { say: 'ลูกค้าพอใจ บอกต่อ ยอดเพิ่ม', items: [I('smile', 'พอใจ'), I('megaphone', 'บอกต่อ')], end: I('trending-up', 'ยอดเพิ่ม') },
    { say: 'ดื่มน้ำน้อย เลยปวดหัว', items: [I('glass-water', 'ดื่มน้อย'), I('frown', 'ปวดหัว')] },
    { say: 'เก็บเงินได้ ลงทุนต่อ ดอกผลงอกเงย', items: [I('piggy-bank', 'เก็บเงิน'), I('chart-line', 'ลงทุน'), I('coins', 'งอกเงย')], end: I('trending-up') },
    { say: 'ชาร์จครึ่งชั่วโมง ใช้ได้ทั้งวัน', items: [I('plug', 'ชาร์จ'), I('battery-charging', 'ครึ่งชม.')], end: I('zap', 'ทั้งวัน') },
    { say: 'เครียดสะสม ระเบิดออกมา', items: [I('cloud', 'เครียด'), I('triangle-alert', 'สะสม')], end: I('angry', 'ระเบิด') },
    { say: 'พูดดังเกินไป เพื่อนบ้านตกใจ', items: [I('megaphone', 'พูดดัง')], end: I('frown', 'ตกใจ') },
    { say: 'ฝึกทุกวัน มั่นใจขึ้น ได้งาน', items: [I('repeat', 'ฝึกทุกวัน'), I('sparkles', 'มั่นใจ')], end: I('briefcase', 'ได้งาน') },
    { say: 'ลดราคา คนแห่มา ของหมด', items: [I('badge-percent', 'ลดราคา'), I('users', 'คนแห่มา'), I('package-open', 'ของหมด')], end: I('check') },
    { say: 'ทักไปก่อน เขาเลยยอมเปิดใจ', items: [I('message-circle', 'ทักก่อน')], end: I('heart', 'เปิดใจ') },
    { say: 'ตามกระแส ทำตามทุกอย่าง จนไม่เป็นตัวเอง', items: [I('trending-up', 'กระแส'), I('repeat', 'ทำตาม')], end: I('user-x', 'ไม่ใช่ตัวเอง') },
    { say: 'อ่านทุกวัน ความรู้เพิ่ม เขียนได้ สอบผ่าน', items: [I('book-open', 'อ่าน'), I('brain', 'ความรู้'), I('pen-line', 'เขียนได้'), I('graduation-cap', 'สอบผ่าน')] },
    { say: 'ตั้งใจทีละขั้น ผ่านทีละด่าน ถึงเป้า', items: [I('target', 'ตั้งใจ'), I('flag', 'ผ่านด่าน')], end: I('trophy', 'ถึงเป้า') },
    { say: 'เล็ก ๆ ทำทุกวัน กลายเป็นเรื่องใหญ่', items: [I('sprout', 'เล็ก ๆ'), I('leaf', 'ทุกวัน'), I('trees', 'เรื่องใหญ่')] },
    { say: 'ราคาน้ำมันขึ้น ค่าส่งแพง ของแพงตาม', items: [I('droplet', 'น้ำมัน'), I('truck', 'ค่าส่ง'), I('shopping-cart', 'ของแพง')] },
    { say: 'ประกาศออกไป ทุกคนรู้ทันที', items: [I('megaphone', 'ประกาศ')], end: I('users', 'ทุกคนรู้') },
  ];
  const STRESS = [
    { say: 'ไม่มีป้ายเลย', items: [I('zap'), I('cog'), I('house')], end: I('x') },
    { say: 'ป้ายยาว', items: [I('moon', 'นอนดึกทุกคืนเป็นเดือน'), I('battery-low', 'ร่างกายอ่อนเพลียมาก')], end: I('triangle-alert', 'ต้องเข้าโรงพยาบาล') },
    { say: 'ภาษาอังกฤษ', items: [I('code', 'Bug'), I('database', 'Crash'), I('users', 'Users leave')], end: I('trending-down', 'Churn') },
    { say: 'ไม่มีไอคอน (ป้ายแทนภาพ)', items: [{ label: 'เหตุ' }, { label: 'ต่อ' }], end: { label: 'ผล' } },
    { say: 'ทอดเดียว ไม่มี end', items: [I('sprout', 'ปลูก')] },
    { say: 'ชื่อไอคอนที่ไม่มี', items: [I('no-such-icon', 'ตอนแรก'), I('no-such-icon', 'ตอนท้าย')], end: I('no-such-icon') },
    { say: 'ไอคอนซ้ำ ไม่มีป้าย 4 ทอด', items: [I('coins'), I('coins'), I('coins'), I('coins')] },
    { say: 'end มีป้าย', items: [I('dumbbell', 'ออกกำลัง'), I('heart-pulse', 'หัวใจดี'), I('smile', 'อารมณ์ดี')], end: I('check', 'สุขภาพดี') },
    { say: 'สองทอดพอดี', items: [I('cloud', 'ฝน'), I('car', 'รถติด')] },
    { say: 'อังกฤษยาว', items: [I('megaphone', 'Word of mouth'), I('users', 'More customers')], end: I('store', 'Second branch') },
    { say: 'ป้ายสั้นมาก', items: [I('cloud', 'ฝน'), I('droplets', 'ท่วม'), I('car', 'ติด')] },
    { say: 'ตัวเลขในป้าย', items: [I('coins', '100'), I('coins', '1,000'), I('coins', '10,000'), I('coins', '100,000')] },
    { say: 'ป้ายแทนภาพยาว', items: [{ label: 'เปลี่ยนรูปปก' }, { label: 'คนกดดูเพิ่ม' }], end: { label: 'ยอดวิวพุ่ง' } },
    { say: 'end ป้ายอย่างเดียว', items: [I('book-open', 'อ่าน')], end: { label: 'เก่งขึ้น' } },
    { say: 'ไม่มีป้าย ไม่มี end', items: [I('sun'), I('cloud'), I('droplets')] },
    { say: 'ผลร้าย 4 ทอด', items: [I('cigarette-off', 'สูบบุหรี่'), I('heart-crack', 'ปอดพัง'), I('hospital', 'โรงพยาบาล')], end: I('x') },
    { say: 'ทอดเป็นการกระทำ', items: [I('send', 'ส่ง'), I('mail', 'ถึง')], end: I('message-circle', 'ตอบ') },
    { say: 'ทอดเป็นสภาพ', items: [I('thermometer', 'ร้อน'), I('droplets', 'เหงื่อออก'), I('battery-low', 'เพลีย')] },
    { say: 'ไม่มีทอดเลย มีแต่ end', items: [], end: I('check') },
    { say: 'ป้ายผสมไทยอังกฤษ', items: [I('wifi', 'เน็ตล่ม'), I('laptop', 'Zoom หลุด')], end: I('frown', 'ประชุมพัง') },
  ];

  G.cats = G.cats || {};
  G.cats.B12 = { variants: V, SAMPLES, STRESS, draw: (i, d, c) => { setZ(c); CUR = V[i].id; V[i].build(d, c); }, CLAMPS, timing: c => (setZ(c), Object.assign({}, Z)) };
})();
