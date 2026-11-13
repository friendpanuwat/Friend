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

  /* ---------- round 3 (user 2026-11-13: "ไม่ต้องไปสนว่ามันจะมีกี่อัน ขอแค่มันสื่อความหมายว่าจากเหตุไปผล … ออกแบบได้อย่างอิสระ … ตามสกิลของเรา
     ขอแค่มันเป็นชุดฐานที่ใช้ได้กับทุกเนื้อหา"): plain everyday things whose own action makes the next thing happen.
     Any number of links: K = the links that have something (1–4; none → two empty holders) · E = the end sign. Pair designs (one thing acts on
     another) read C = the cause (first link) · M = the links between · F = the effect (end sign, else the last link). ---------- */
  function ch(d) { const all = Array.isArray(d.items) ? d.items.slice(0, 4) : [], K0 = all.filter(has), K = K0.length ? K0 : [{}, {}], E = has(d.end) ? d.end : null;
    const C = K[0], M = E ? K.slice(1) : K.slice(1, -1), F = E || (K.length > 1 ? K[K.length - 1] : null); return { K, E, C, M, F, n: K.length }; }
  const unrot = (pt, pv, a) => { const u = rad(-a), dx = pt[0] - pv[0], dy = pt[1] - pv[1]; return [pv[0] + dx * Math.cos(u) - dy * Math.sin(u), pv[1] + dx * Math.sin(u) + dy * Math.cos(u)]; };
  const spread = (n, a, b) => n === 1 ? [(a + b) / 2] : [...Array(n)].map((_, i) => f1(a + (b - a) * i / (n - 1)));

  /* ---------- motion (user 2026-11-13 "ทำเคลื่อนไหวได้ … มืออาชีพ ไม่เอางานลวก รักษามาตรฐานเหมือนที่ผ่าน ๆ มา"; CutPack B12: the first link is
     set off → the push runs through the links between → on the keyword the last link / the effect happens (+ the end sign) → hold).
     Every part comes in on its own; the mechanism really works; long trips are one smooth trip (B09); secondary moves (squash, shake, ripple). ----------
     TL(): T0 = when the cause fires (a long sentence: it waits, then goes — B05 lesson) · m(i, n) = when middle link i of n is reached · H = the keyword */
  const ft = v => +(+v).toFixed(3);
  function TL() { const H = Z.H, T0 = Math.max(tu(.8), H - tu(1.1)); return { H, T0, m: (i, n) => f1(lerp(T0, H, (i + 1) / (n + 1)) * 1000) / 1000 }; }
  function mvG(p, m) { const o = sub(p), g = sub(o); g.og = o.g; if (m) { const K = { ox: m.px || 0, oy: m.py || 0 }; TR.concat('o').forEach(n => { if (m[n]) K[n] = m[n]; }); on(g, p, 0, K); } return g; }
  /* an entrance at t: pop (grows from px,py) · rise (from below) · drop (from above, lands with a bounce) · slide (from the left) */
  function inG(p, kind = 'pop', px = 0, py = 0, t = 0) { const K = { px, py, o: [[0, 0], [t, 0], [t + tu(.1), 1]] };
    if (kind === 'rise') K.y = [[0, 50], [t, 50], [t + tu(.3), -5, 'out'], [t + tu(.4), 0, 'soft']];
    else if (kind === 'drop') K.y = [[0, -80], [t, -80], [t + tu(.24), 0, 'in'], [t + tu(.31), -8, 'out'], [t + tu(.4), 0, 'soft']];
    else if (kind === 'slide') K.x = [[0, -70], [t, -70], [t + tu(.32), 4, 'out'], [t + tu(.42), 0, 'soft']];
    else K.s = [[0, .82], [t, .82], [t + tu(.24), 1.04, 'out'], [t + tu(.38), 1, 'soft']];
    return mvG(p, K); }
  const SMG = .8, sm = u => .5 - .5 * Math.cos(Math.PI * Math.pow(Math.min(1, Math.max(0, u)), SMG));
  const smInv = f => Math.pow(Math.acos(1 - 2 * Math.min(1, Math.max(0, f))) / Math.PI, 1 / SMG);
  /* a quick shake / squash / bump at t (keys for x, r, sy …) */
  const buzzK = (t, a = 6) => [[0, 0], [t, 0], [t + tu(.03), -a], [t + tu(.06), a], [t + tu(.09), -a * .7], [t + tu(.12), a * .5], [t + tu(.16), 0]];
  const bumpK = (t, v, base = 1) => [[0, base], [t, base], [t + tu(.06), v, 'out'], [t + tu(.22), base, 'soft']];
  /* keys that move a part along a polyline L between t0 and t1 (one smooth trip), relative to its final point fin; K.when(pt) = when it passes pt */
  function pathK(L, t0, t1, fin, n = 28, ease = sm) { const seg = [], cum = [0]; for (let i = 1; i < L.length; i++) { const d = Math.hypot(L[i][0] - L[i - 1][0], L[i][1] - L[i - 1][1]); seg.push(d); cum.push(cum[i - 1] + d); }
    const tot = cum[cum.length - 1], at = dd => { let i = 1; while (i < cum.length - 1 && cum[i] < dd) i++; const u = (dd - cum[i - 1]) / (seg[i - 1] || 1); return [L[i - 1][0] + (L[i][0] - L[i - 1][0]) * u, L[i - 1][1] + (L[i][1] - L[i - 1][1]) * u]; };
    const K = { x: [[0, f1(L[0][0] - fin[0])], [t0, f1(L[0][0] - fin[0])]], y: [[0, f1(L[0][1] - fin[1])], [t0, f1(L[0][1] - fin[1])]] };
    for (let j = 1; j <= n; j++) { const u = j / n, [x, y] = at(tot * ease(u)), t = t0 + (t1 - t0) * u; K.x.push([t, f1(x - fin[0])]); K.y.push([t, f1(y - fin[1])]); }
    K.when = pt => { let bd = 1e9, bs = 0; for (let i = 1; i < L.length; i++) { const a = L[i - 1], b = L[i], dx = b[0] - a[0], dy = b[1] - a[1], l2 = dx * dx + dy * dy || 1, u = Math.min(1, Math.max(0, ((pt[0] - a[0]) * dx + (pt[1] - a[1]) * dy) / l2)), dd = Math.hypot(a[0] + dx * u - pt[0], a[1] + dy * u - pt[1]); if (dd < bd) { bd = dd; bs = cum[i - 1] + u * seg[i - 1]; } }
      const f = bs / tot; let lo = 0, hi = 1; for (let k = 0; k < 30; k++) { const m = (lo + hi) / 2; if (ease(m) < f) lo = m; else hi = m; } return t0 + (t1 - t0) * lo; };
    return K; }
  const drawAt = (el, q, t, dur) => on(el, q, t, { draw: [[0, 0], [dur ?? tu(.3), 1, 'out']] });
  const litG = (q, t, d = .08) => { const g = sub(q); on(g, q, 0, { o: [[0, 0], [t, 0], [t + tu(d), 1]] }); return g; };
  const outG = (q, t, d = .08) => { const g = sub(q); on(g, q, 0, { o: [[0, 1], [t, 1], [t + tu(d), 0]] }); return g; };
  function haloH(q, x, y, r, t) { t = t ?? Z.H; const g = sub(q); on(g, q, 0, { ox: x, oy: y, s: [[0, .6], [t, .6], [t + tu(.3), 1, 'out']], o: [[0, 0], [t, 0], [t + tu(.1), 1]] }); halo(g, x, y, r); return g; }
  /* a ring that blooms out from (x, y) at t and fades (the "it happened" ripple) */
  function ripple(q, x, y, r, t) { const g = sub(q); on(g, q, 0, { ox: x, oy: y, s: [[0, .7], [t, .7], [t + tu(.45), 1.45, 'out']], o: [[0, 0], [t, 0], [t + tu(.04), .8], [t + tu(.45), 0]] }); g.circle(x, y, r, W(2.6)); }
  const popAt = (q, x, y, t) => { const g = sub(q); on(g, q, 0, { ox: x, oy: y, s: [[0, .3], [t, .3], [t + tu(.2), 1.1, 'out'], [t + tu(.34), 1, 'soft']], o: [[0, 0], [t, 0], [t + tu(.06), 1]] }); return g; };

  /* a THING (it) at (x, y) width w (+ its label at (lx, ly)). o.t = when it comes in · o.mv = keys of the part it rides ({ px, py, x, y, r, s }) ·
     o.punch = a bump at that time (the moment it is reached) · o.r = a fixed tilt (with its holder) · o.lt = when the label comes in */
  function pic(it, cx, cy, wd, c, o = {}) {
    if (!it) return null; const at = c.at || 0, X = c.x + cx * c.s, Y = c.y + cy * c.s, fn = picOf(it), t = o.t ?? tu(.12);
    let a;
    if (fn) a = G.art(fn, { x: X, y: Y, w: wd * c.s, at: at + t, speed: Z.sp });
    else { const str = it.label; if (!str) return null;
      const f = q => txt(q, str, 0, wd * .11, { size: wd * .3, maxW: o.bigW || wd * 1.25, weight: 700, color: C.ink, wrap: 'mid' }); f.custom = true; f.dur = .3; f.exit = 'pop';
      a = G.art(f, { x: X, y: Y, s: c.s, at: at + t, speed: 1 }); a.speed = Z.sp; }
    const K = { ox: X, oy: Y }; let any = false;
    if (o.mv) { const m = o.mv; if (m.px != null) { K.ox = c.x + m.px * c.s; K.oy = c.y + m.py * c.s; }
      ['x', 'y'].forEach(n => { if (m[n]) K[n] = m[n].map(([u, v, e]) => e ? [u, f1(v * c.s), e] : [u, f1(v * c.s)]); }); ['r', 's', 'sx', 'sy'].forEach(n => { if (m[n]) K[n] = m[n]; }); any = true; }
    else if (o.r) { K.r = [[0, o.r]]; any = true; }
    if (o.o) { K.o = o.o; any = true; }
    if (any) kf(a.wrap, at, K);
    if (o.punch != null) kf(a.g, at, { ox: X, oy: Y, s: [[0, 1], [o.punch, 1], [o.punch + tu(.07), 1.14, 'out'], [o.punch + tu(.3), 1, 'soft']] });
    return a;
  }
  function put(q, c, it, x, y, w, ly, o = {}) { if (!it) return; const k = o.k ?? 0, t = o.t ?? tu(.12 + .08 * k);
    pic(it, x, y, w, c, { r: o.r, t, bigW: o.bigW, mv: o.mv, punch: o.punch, o: o.o });
    if (ly != null && it.label && picOf(it)) { const g = o.lg || q; txt(atG(g, o.lt ?? t + tu(.1)), it.label, o.lx ?? x, ly, { maxW: o.maxW || 200, color: C.ink, weight: 700, size: o.size || 32, wrap: o.wrap === undefined ? 'down' : o.wrap, anchor: o.anchor || 'middle' }); } }
  /* a round plate with its thing: comes in (pop) at o.t, bumps at o.punch; o.g = draw into this group instead (it rides that part) */
  const plate = (q, c, it, x, y, r, ly, o = {}) => { const t = o.t ?? tu(.12 + .08 * (o.k ?? 0)), g = o.g || inG(q, 'pop', x, y, t), b = o.punch != null && !o.g ? mvG(g, { px: x, py: y, s: bumpK(o.punch, 1.12) }) : g;
    b.circle(x, y, r, F(3.4)); if (o.inner !== false) b.circle(x, y, r - 11, S(1.4)); put(q, c, it, x, y, r * 1.25, ly, Object.assign({}, o, { t: o.g ? o.t : t + tu(.04) })); };
  /* the effect, when it is the end sign: a lit plate with a halo — it pops at o.t (default the keyword) */
  const effect = (q, c, it, x, y, r, ly, o = {}) => { if (!it) return; const t = o.t ?? Z.H - tu(.06); haloH(q, x, y, r + 28, t + tu(.04)); const g = popAt(q, x, y, t);
    g.circle(x, y, r, F(3.4)); g.circle(x, y, r - 11, S(1.4)); ripple(q, x, y, r + 8, t + tu(.08)); put(q, c, it, x, y, r * 1.25, ly, Object.assign({ lt: t + tu(.14) }, o, { t, punch: undefined })); };
  const tick = (q, x, y, a, l1, l2, o = W(2.4)) => { const u = rad(a); return q.line(x + Math.cos(u) * l1, y + Math.sin(u) * l1, x + Math.cos(u) * l2, y + Math.sin(u) * l2, o); };
  const burst = (q, x, y, r1, r2, n = 8, a0 = 0, skip = []) => { for (let k = 0; k < n; k++) { const a = a0 + k * 360 / n; if (!skip.includes(k)) tick(q, x, y, a, r1, r2); } };
  /* ticks that spark out at t (a burst that draws itself) */
  const sparkAt = (q, x, y, r1, r2, t, n = 8, a0 = 0, skip = [], keep = false) => { const g = sub(q); on(g, q, 0, { o: keep ? [[0, 0], [t, 0], [t + tu(.04), 1]] : [[0, 0], [t, 0], [t + tu(.04), 1], [t + tu(.28), 1], [t + tu(.45), 0]] }); for (let k = 0; k < n; k++) { const a = a0 + k * 360 / n; if (!skip.includes(k)) drawAt(tick(g, x, y, a, r1, r2), q, t, tu(.16)); } return g; };
  /* the end-of-chain glow when there is no end sign: the last link's halo blooms on the keyword */
  const lastH = (q, Q, x, y, r, t) => { if (!Q.E) haloH(q, x, y, r, t); };
  const arcsAt = (q, x, y, dir, n, r0, gap, span, t, o = W(2.4), step = .06) => { for (let k = 0; k < n; k++) { const g = sub(q); on(g, q, 0, { o: [[0, 0], [t + tu(step * k), 0], [t + tu(step * k + .05), 1]] }); arcs(g, x, y, dir, 1, r0 + k * gap, gap, span, o); } };

  /* 01 ── BILLIARDS: the cue pulls back and strikes the white ball; the knock runs ball to ball along the lines, and the last ball rolls into the pocket */
  variant('billiards', 'บิลเลียดชนต่อกัน', (d, c) => { const Q = ch(d), T = TL(), ox = Q.E ? -80 : 0, n = Q.n, r = n > 3 ? 50 : 60;
    art(c, p => { const cl = clipG(p, -500, -350, 1000, 700), tb = inG(p, 'rise', ox, 0, 0);
      R(tb, ox - 380, -235, 760, 470, 46, F(3.4)); R(tb, ox - 342, -197, 684, 394, 20, S(2));
      [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([a, b]) => tb.circle(ox + a * 350, b * 205, 27, F(3))); [-1, 1].forEach(b => tb.circle(ox, b * 214, 24, F(3)));
      [-.5, .5].forEach(a => [-1, 1].forEach(b => tb.circle(ox + a * 360, b * 216, 4, SOLID(1))));
      const A = [ox - 140, 70], B = [ox + 262, -126], nx = .44, ny = .9, cue = [ox - 250, 140], pk = [ox + 350, -205];
      const P = [...Array(n)].map((_, i) => { const u = n === 1 ? 1 : i / (n - 1), off = i === n - 1 ? 0 : (i % 2 ? -1 : 1) * 46; return [lerp(A[0], B[0], u) + nx * off, lerp(A[1], B[1], u) + ny * off]; });
      const pts = [cue, ...P], hitT = i => i === 0 ? T.T0 : lerp(T.T0, T.H - tu(.4), i / Math.max(1, n - 1)), H = T.H;
      /* the trajectory lines draw as the knock travels */
      [...pts, pk].forEach((pt, i, a) => { if (!i) return; const e = p.line(a[i - 1][0], a[i - 1][1], pt[0], pt[1], S(1.6)); drawAt(e, p, i < a.length - 1 ? hitT(i - 1) : H - tu(.4), i < a.length - 1 ? tu(.14) : tu(.4)); });
      const cb = inG(p, 'pop', ...cue, tu(.28)), dir = (a, b) => { const L = Math.hypot(b[0] - a[0], b[1] - a[1]); return [(b[0] - a[0]) / L, (b[1] - a[1]) / L]; };
      const d0 = dir(cue, P[0]), cbm = mvG(cb, { x: [[0, 0], [T.T0, 0], [T.T0 + tu(.05), d0[0] * 16, 'out'], [T.T0 + tu(.25), 0, 'soft']], y: [[0, 0], [T.T0, 0], [T.T0 + tu(.05), d0[1] * 16, 'out'], [T.T0 + tu(.25), 0, 'soft']] });
      cbm.circle(...cue, 30, F(3)); cbm.circle(cue[0] - 9, cue[1] - 9, 5, SOLID(1));
      { const tp = [cue[0] - 40, cue[1] + 24], b0 = [cue[0] - 150, cue[1] + 200], L0 = Math.hypot(tp[0] - b0[0], tp[1] - b0[1]), ux = (tp[0] - b0[0]) / L0, uy = (tp[1] - b0[1]) / L0, qx = -uy, qy = ux, bt = [tp[0] - ux * 300, tp[1] - uy * 300];
        const st = mvG(cl, { x: [[0, -ux * 160], [tu(.15), -ux * 160], [tu(.4), 0, 'out'], [T.T0 - tu(.22), 0], [T.T0 - tu(.06), -ux * 60, 'io'], [T.T0, 0, 'in'], [T.T0 + tu(.08), ux * 6], [T.T0 + tu(.3), 0, 'soft']],
          y: [[0, -uy * 160], [tu(.15), -uy * 160], [tu(.4), 0, 'out'], [T.T0 - tu(.22), 0], [T.T0 - tu(.06), -uy * 60, 'io'], [T.T0, 0, 'in'], [T.T0 + tu(.08), uy * 6], [T.T0 + tu(.3), 0, 'soft']] });
        shape(st, [[tp[0] + qx * 6, tp[1] + qy * 6], [tp[0] - qx * 6, tp[1] - qy * 6], [bt[0] - qx * 13, bt[1] - qy * 13], [bt[0] + qx * 13, bt[1] + qy * 13]], F(3)); }
      P.forEach(([x, y], i) => { const last = i === n - 1, t = hitT(i), dd = dir(pts[i], P[i]), g0 = inG(p, 'drop', x, y, tu(.16 + .07 * i));
        let K;
        if (last) { const back = Math.max(40, Math.min(150, Math.hypot(x - pts[i][0], y - pts[i][1]) - 2 * r - 16)), s0 = [x - dd[0] * back, y - dd[1] * back], L = pathK([s0, [x, y]], i ? t : T.T0, H, [x, y], 16, u => 1 - Math.pow(1 - u, 2.2)); K = { x: L.x, y: L.y }; lastH(p, Q, x, y, r + 30, H); }
        else K = { x: [[0, 0], [t, 0], [t + tu(.05), f1(dd[0] * 18), 'out'], [t + tu(.24), 0, 'soft']], y: [[0, 0], [t, 0], [t + tu(.05), f1(dd[1] * 18), 'out'], [t + tu(.24), 0, 'soft']] };
        const g = mvG(g0, K); g.circle(x, y, r, F(3.2));
        put(p, c, Q.K[i], x, y, r * 1.3, y + r + 36, { t: tu(.22 + .07 * i), mv: { x: K.x, y: K.y }, punch: last && !Q.E ? H : t + tu(.02), lt: last ? H + tu(.04) : undefined, maxW: 180, size: 30 }); });
      effect(p, c, Q.E, 395, -40, 62, 70);
    }); });

  /* 02 ── LIGHT SWITCH: the switch (cause) is pressed, the current runs along the wire past each box, the lamp flickers on and lights the effect */
  variant('lamp', 'สวิตช์ผนังเปิดโคมไฟ', (d, c) => { const Q = ch(d), T = TL(), H = T.H, wy = -290, lx = 250, sx = -390;
    art(c, p => { drawAt(p.line(-480, 300, 480, 300, S(1.8)), p, 0, tu(.4));
      const pl = inG(p, 'rise', sx, 100, tu(.05)); R(pl, sx - 75, -20, 150, 230, 16, F(3.4)); [[-58, -3], [58, -3], [-58, 193], [58, 193]].forEach(([a, b]) => pl.circle(sx + a, b, 4, S(1.4)));
      R(pl, sx - 34, 0, 68, 92, 10, F(2.8)); const rk = mvG(pl, { px: sx, py: 46, sy: [[0, 1], [T.T0 - tu(.08), 1], [T.T0, .86, 'in'], [T.T0 + tu(.12), 1, 'out']] });
      R(outG(rk, T.T0), sx - 26, 6, 52, 40, 8, S(2)); R(litG(rk, T.T0), sx - 26, 46, 52, 40, 8, { fill: LIT, sw: 2.4 });
      put(p, c, Q.C, sx, 150, 66, 250, { t: tu(.2), punch: T.T0 });
      const W1 = [[sx, -20], [sx, wy], [lx, wy], [lx, -150]], wire = [p.path(pathOf(W1, false), { sw: 14, stroke: 'rgba(255,255,255,.12)' }), p.path(pathOf(W1, false), S(2.4))];
      drawAt(wire[1], p, tu(.15), tu(.4)); const live = p.path(pathOf(W1, false), W(3.6)); on(live, p, 0, { draw: [[0, 0], [T.T0, 0], [H - tu(.3), 1, 'lin']] }); on(wire[0], p, 0, { o: [[0, 0], [T.T0, 0], [T.T0 + tu(.1), 1]] });
      const L = W1, K = pathK(L, T.T0, H - tu(.3), L[3], 30, u => u), dot = mvG(p, { x: K.x, y: K.y, o: [[0, 0], [T.T0, 0], [T.T0 + tu(.04), 1], [H - tu(.3), 1], [H - tu(.24), 0]] }); halo(dot, ...L[3], 22); dot.circle(...L[3], 10, SOLID());
      const xs = spread(Q.M.length, -230, 110); Q.M.forEach((it, i) => { const pt = [xs[i], wy], tp = K.when(pt), g = inG(p, 'pop', xs[i], wy, tu(.3 + .06 * i)), b = mvG(g, { px: xs[i], py: wy, s: bumpK(tp, 1.12) });
        R(b, xs[i] - 44, wy - 40, 88, 80, 14, F(3.2)); put(p, c, it, xs[i], wy, 58, wy + 82, { t: tu(.34 + .06 * i), punch: tp, maxW: 150, size: 28 }); });
      const lp = inG(p, 'drop', lx, -150, tu(.22)), sw = mvG(lp, { px: lx, py: -170, r: [[0, 0], [tu(.6), 0], [tu(.72), 4, 'out'], [tu(.9), -2], [tu(1.05), 0, 'soft']] });
      sw.path(`M ${lx - 40} -150 L ${lx + 40} -150 L ${lx + 110} -48 L ${lx - 110} -48 Z`, F(3.4)); R(sw, lx - 16, -170, 32, 22, 6, F(2.4));
      sw.circle(lx, -36, 26, F(2)); const bulb = sub(sw); on(bulb, p, 0, { o: [[0, 0], [H - tu(.3), 0], [H - tu(.26), 1], [H - tu(.2), .25], [H - tu(.14), 1], [H - tu(.1), .4], [H - tu(.05), 1]] }); bulb.circle(lx, -36, 26, { fill: C.ink, sw: 2 });
      sparkAt(sw, lx, -36, 40, 56, H - tu(.05), 8, 0, [5, 6, 7], true);
      const cone = sub(p); on(cone, p, 0, { o: [[0, 0], [H - tu(.3), 0], [H - tu(.26), .8], [H - tu(.2), .2], [H - tu(.14), .9], [H - tu(.1), .3], [H - tu(.05), 1]] });
      cone.path(`M ${lx - 140} 300 L ${lx - 62} -40 L ${lx + 62} -40 L ${lx + 140} 300 Z`, { fill: 'rgba(255,255,255,.08)', sw: 0, stroke: 'none' }); cone.path(`M ${lx - 62} -40 L ${lx - 140} 300 M ${lx + 62} -40 L ${lx + 140} 300`, S(1.4));
      if (Q.F) { haloH(p, lx, 175, 96, H); put(p, c, Q.F, lx, 175, 120, 296, { t: H - tu(.06), maxW: 240 }); ripple(p, lx, 175, 80, H); }
    }); });

  /* 03 ── THE MACHINE: the cause dips into the hopper, the machine hums and shakes (its lamps light one by one), and the effect slides out of the chute */
  variant('machine', 'เครื่องใส่เหตุออกผล', (d, c) => { const Q = ch(d), T = TL(), H = T.H, bx = -40, by = 60, w = 380, h = 250, nM = Math.max(1, Q.M.length);
    art(c, p => { drawAt(p.line(-480, 300, 480, 300, S(1.8)), p, 0, tu(.4));
      const shake = { x: [[0, 0], [T.T0 + tu(.1), 0]], r: [[0, 0], [T.T0 + tu(.1), 0]] }; for (let t = T.T0 + tu(.1), k = 0; t < H - tu(.1); t += tu(.07), k++) { shake.x.push([ft(t), k % 2 ? -3 : 3]); shake.r.push([ft(t), k % 2 ? -.6 : .6]); } shake.x.push([H, 0]); shake.r.push([H, 0]);
      const mg0 = inG(p, 'rise', bx, by, tu(.04)), mg = mvG(mg0, Object.assign({ px: bx, py: 300 }, shake));
      [-1, 1].forEach(sd => R(mg, bx + sd * (w / 2 - 50) - 16, by + h / 2, 32, 300 - by - h / 2, 4, F(2.6)));
      shape(mg, [[bx - 150, by - h / 2 - 110], [bx - 10, by - h / 2 - 110], [bx - 50, by - h / 2], [bx - 110, by - h / 2]], F(3.2)); mg.line(bx - 140, by - h / 2 - 96, bx - 20, by - h / 2 - 96, S(1.6));
      R(mg, bx - w / 2, by - h / 2, w, h, 20, F(3.4)); R(mg, bx - w / 2 + 18, by - h / 2 + 18, w - 36, h - 36, 12, S(1.6));
      [0, 1, 2].forEach(k => mg.line(bx + 120, by - h / 2 + 40 + k * 18, bx + 160, by - h / 2 + 40 + k * 18, S(2)));
      mg.circle(bx + 150, by - h / 2 + 100, 10, S(1.6)); const led = sub(mg); { const o = [[0, 0], [T.T0, 0]]; for (let t = T.T0, k = 0; t < H; t += tu(.12), k++) o.push([ft(t), k % 2 ? .2 : 1]); o.push([H, 1]); on(led, p, 0, { o }); } led.circle(bx + 150, by - h / 2 + 100, 10, SOLID(1));
      [[-170, -105], [170, -105], [-170, 105], [170, 105]].forEach(([a, b]) => mg.circle(bx + a, by + b, 4, S(1.4)));
      /* the cause: comes down over the hopper, dips in at T0 */
      const cy0 = by - h / 2 - 190, dip = { y: [[0, -60], [tu(.2), -60], [tu(.46), 4, 'out'], [tu(.56), 0, 'soft'], [T.T0 - tu(.2), 0], [T.T0, 44, 'in'], [T.T0 + tu(.24), 0, 'out']] };
      put(p, c, Q.C, bx - 80, cy0, 110, null, { t: tu(.2), mv: { y: dip.y } }); { const it = Q.C; if (it && it.label && picOf(it)) txt(atG(p, tu(.35)), it.label, bx - 250, cy0 + 10, { maxW: 150, color: C.ink, weight: 700, size: 30, wrap: 'down' }); }
      const xs = spread(nM, bx - 110, bx + 60); (Q.M.length ? Q.M : [null]).forEach((it, i) => { const tl = Q.M.length ? T.m(i, nM) : lerp(T.T0, H, .5);
        if (it) { const g = mvG(mg, { px: xs[i], py: by + 10, s: bumpK(tl, 1.1) }); g.circle(xs[i], by + 10, 46, F(3.2)); put(p, c, it, xs[i], by + 10, 56, by + 92, { t: tu(.3 + .06 * i), punch: tl, maxW: 140, size: 26 }); ripple(p, xs[i], by + 10, 50, tl); }
        else { mg.circle(xs[i], by + 10, 46, F(3)); const lg = litG(mg, tl); lg.circle(xs[i], by + 10, 46, { fill: LIT, sw: 3 }); } });
      shape(inG(p, 'pop', bx + w / 2, by + 90, tu(.3)), [[bx + w / 2, by + 50], [bx + w / 2 + 150, by + 110], [bx + w / 2 + 150, by + 134], [bx + w / 2, by + 90]], F(3));
      if (Q.F) { const fx = bx + w / 2 + 170, fy = by + 30, t0 = H - tu(.32), cl = clipG(p, bx + w / 2 + 2, -350, 600, 700), K = { x: [[0, -190], [t0, -190], [H, 0, 'out'], [H + tu(.06), -6], [H + tu(.2), 0, 'soft']], y: [[0, 30], [t0, 30], [H, 0, 'out']] };
        haloH(p, fx, fy, 100, H + tu(.04)); const g = mvG(cl, K); tile(g, fx, fy, 140, F(3.4)); put(p, c, Q.F, fx, fy, 94, by + 166, { t: t0, mv: K, lt: H + tu(.1), maxW: 200 }); }
    }); });

  /* 04 ── ROPE: a person flicks the rope; one hump runs along it lifting every bead in turn, and slaps into the post (which shudders) */
  variant('rope', 'สะบัดเชือกคลื่นวิ่ง', (d, c) => { const Q = ch(d), T = TL(), H = T.H, fy = 290, ry = 120, k = .8, px = -420;
    art(c, p => { drawAt(p.line(-480, fy, 480, fy, S(2)), p, 0, tu(.4));
      const arm = { s: [4, -76], e: [44, -56], h: [86, -38] }, pg = inG(p, 'slide', px, fy, tu(.05)), hm = person(pg, px, fy, k, arm, { leg: stride });
      hm.on('upper1', p, 0, { ox: 4, oy: -76, r: [[0, 0], [T.T0 - tu(.22), 0], [T.T0 - tu(.06), 14, 'io'], [T.T0 + tu(.06), -16, 'in'], [T.T0 + tu(.22), 4, 'out'], [T.T0 + tu(.36), 0, 'soft']] });
      hm.on('fore1', p, 0, { ox: 44, oy: -56, r: [[0, 0], [T.T0 - tu(.22), 0], [T.T0 - tu(.06), 10, 'io'], [T.T0 + tu(.06), -12, 'in'], [T.T0 + tu(.3), 0, 'soft']] });
      const hd = pAt(px, fy, k, 86, -38), postX = 420, xEnd = 345, A = 86, base = x => ry + (hd[1] - ry) * (1 - Math.min(1, Math.max(0, (x - hd[0]) / 60)));
      const NT = 22, ts = [...Array(NT + 1)].map((_, j) => T.T0 + (H - T.T0) * j / NT), xcAt = j => lerp(hd[0] - 60, xEnd, sm(j / NT)), hump = (x, xc) => A * Math.exp(-Math.pow((x - xc) / 52, 2));
      /* the rope = short overlapping pieces; each piece's height follows the travelling hump (relative to the final still: y key = final − current) */
      const rg = litG(p, tu(.25), .1);
      for (let x = hd[0]; x < postX; x += 10) { const x2 = Math.min(postX, x + 12), y1 = base(x) - hump(x, xEnd), y2 = base(x2) - hump(x2, xEnd), xm = (x + x2) / 2;
        const K = [[0, f1(hump(xm, xEnd))], [T.T0, f1(hump(xm, xEnd))]]; ts.forEach((t, j) => K.push([ft(t), f1(hump(xm, xEnd) - hump(xm, xcAt(j)))]));
        const g = mvG(rg, { y: K }); g.line(x, y1, x2, y2, { sw: 7 }); }
      const po = mvG(inG(p, 'rise', postX, 160, tu(.12)), { px: postX, py: 290, r: buzzK(H - tu(.04), 2.5) }); R(po, postX - 20, 40, 40, 250, 8, F(3.2)); po.circle(postX, ry, 15, F(2.6));
      arcsAt(p, postX + 30, ry - 40, 1, 2, 18, 14, 40, H - tu(.02));
      const r = Q.n > 3 ? 48 : 56, X = spread(Q.n, -210, 210);
      X.forEach((x, i) => { const K = [[0, 0], [T.T0, 0]]; ts.forEach((t, j) => K.push([ft(t), f1(-hump(x, xcAt(j)))])); const tp = ts[Math.max(0, ts.findIndex((_, j) => xcAt(j) >= x))];
        if (i === Q.n - 1) lastH(p, Q, x, ry, r + 28, tp);
        const g = mvG(inG(p, 'pop', x, ry, tu(.3 + .06 * i)), { y: K }); g.circle(x, ry, r, F(3.2)); put(p, c, Q.K[i], x, ry, r * 1.3, ry + r + 40, { t: tu(.34 + .06 * i), mv: { y: K }, punch: tp, maxW: Q.n > 3 ? 130 : 180 }); });
      effect(p, c, Q.E, postX, -100, 62, -200);
    }); });

  /* 05 ── HIGH STRIKER: the person lifts the mallet and slams the pad (cause); the puck shoots up past the lamps and rings the bell (effect) */
  variant('striker', 'ค้อนตีระฆังวัดแรง', (d, c) => { const Q = ch(d), T0x = TL(), T = Object.assign({}, T0x, { T0: Math.max(tu(.8), T0x.H - tu(.65)) }), H = T.H, tx = 90, fy = 290;
    art(c, p => { drawAt(p.line(-480, fy, 480, fy, S(2)), p, 0, tu(.4));
      const tw = inG(p, 'rise', tx, 40, tu(.04)); R(tw, tx - 26, -205, 52, 495, 8, F(3.2)); tw.line(tx, -190, tx, 205, S(1.6)); for (let y = -150; y < 200; y += 50) tw.line(tx - 18, y, tx - 8, y, S(1.4));
      const bs = inG(p, 'rise', tx, 248, tu(.1)); R(bs, tx - 80, 205, 160, 85, 10, F(3.4)); put(p, c, Q.C, tx, 248, 70, fy + 44, { t: tu(.18), punch: T.T0 });
      const pd = tx - 230, pad = mvG(inG(p, 'pop', pd, 271, tu(.14)), { px: pd, py: 280, sy: [[0, 1], [T.T0, 1], [T.T0 + tu(.04), .6, 'in'], [T.T0 + tu(.2), 1, 'out']] }); R(pad, pd - 50, 262, 100, 18, 6, F(2.8)); p.line(pd + 50, 271, tx - 80, 271, W(3));
      sparkAt(p, pd, 250, 60, 84, T.T0, 6, 200, [2, 3, 4]);
      const y0 = 175, yF = -187, tTop = H - tu(.05), pk = { y: [[0, y0 - yF], [T.T0 + tu(.02), y0 - yF], [tTop, 0, 'out'], [tTop + tu(.06), 10, 'out'], [tTop + tu(.2), 0, 'soft']] };
      const tAtY = y => { const f = (y0 - y) / (y0 - yF); return T.T0 + tu(.02) + (tTop - T.T0 - tu(.02)) * (1 - Math.sqrt(Math.max(0, 1 - f))); };
      const ys = spread(Q.M.length, 120, -110); Q.M.forEach((it, i) => { const y = ys[i], sd = i % 2 ? 1 : -1, tp = tAtY(y), g = inG(p, 'pop', tx + sd * 108, y, tu(.24 + .06 * i)), b = mvG(g, { px: tx + sd * 108, py: y, s: bumpK(tp, 1.12) });
        b.line(tx + sd * 26, y, tx + sd * 60, y, W(3)); b.circle(tx + sd * 108, y, 48, F(3.2)); const lt = litG(b, tp, .04); lt.circle(tx + sd * 108, y, 48, { fill: LIT, sw: 0, stroke: 'none' });
        put(p, c, it, tx + sd * 108, y, 62, y + 80, { t: tu(.28 + .06 * i), punch: tp, maxW: 160, size: 28 }); });
      if (Q.F) haloH(p, tx, -262, 100, H); const bl = mvG(inG(p, 'drop', tx, -262, tu(.18)), { px: tx, py: -222, r: [[0, 0], [H, 0], [H + tu(.06), 7, 'out'], [H + tu(.18), -5], [H + tu(.3), 3], [H + tu(.42), 0, 'soft']] });
      bl.line(tx, -205, tx, -222, W(3)); bl.path(`M ${tx - 66} -224 Q ${tx - 60} -300 ${tx} -302 Q ${tx + 60} -300 ${tx + 66} -224 Z`, F(3.4)); R(bl, tx - 76, -228, 152, 14, 7, F(2.8));
      put(p, c, Q.F, tx, -262, 60, null, { t: tu(.26), mv: { px: tx, py: -222, r: [[0, 0], [H, 0], [H + tu(.06), 7, 'out'], [H + tu(.18), -5], [H + tu(.3), 3], [H + tu(.42), 0, 'soft']] } });
      if (Q.F && Q.F.label && picOf(Q.F)) txt(atG(p, H + tu(.1)), Q.F.label, tx + 190, -255, { maxW: 170, color: C.ink, weight: 700, size: 32, wrap: 'down' });
      const pu = mvG(p, { y: pk.y, o: [[0, 0], [tu(.3), 0], [tu(.36), 1]] }); R(pu, tx - 24, -202, 48, 30, 8, SOLID());
      [-1, 1].forEach(sd => arcsAt(p, tx + sd * 82, -256, sd, 2, 18, 16, 40, H, W(2.6)));
      /* the person: lifts the mallet over the shoulder, holds, slams it down on the pad at T0 */
      const px = tx - 470, k = .8, lean = 12; person(inG(p, 'slide', px, fy, tu(.02)), px, fy, k, { s: [4, -76], e: [46, -44], h: [90, -18] }, { lean, leg: stride });
      const hd = pAt(px, fy, k, 90, -18, lean), hc = [pd, 232], mr = [[0, 0], [tu(.45), 0], [T.T0 - tu(.3), -64, 'io'], [T.T0 - tu(.12), -66], [T.T0, 0, 'in'], [T.T0 + tu(.05), 3, 'out'], [T.T0 + tu(.18), 0, 'soft']];
      const ml = mvG(inG(p, 'pop', ...hd, tu(.12)), { px: hd[0], py: hd[1], r: mr }); tube(ml, `M ${hd[0]} ${hd[1]} L ${hc[0]} ${hc[1] - 26}`, 15); R(ml, hc[0] - 50, hc[1] - 26, 100, 52, 10, F(3.2));
    }); });

  /* 06 ── FAN → PINWHEELS → FLAG: the fan (cause) spins up and blows, the wind reaches each pinwheel (it spins and passes it on), the flag (effect) lifts and flies */
  variant('fan', 'พัดลมเป่ากังหันธง', (d, c) => { const Q = ch(d), T = TL(), H = T.H, fy = 270, fx = -350, gx = 230;
    art(c, p => { drawAt(p.line(-480, fy, 480, fy, S(2)), p, 0, tu(.4));
      const spin = (q, x, y, t, per, step) => { const a = mvG(q, { px: x, py: y, r: [[0, 0], [t, 0], [t + tu(.5), step, 'in']] }); return mvG(a, { px: x, py: y }); };
      const fs = inG(p, 'rise', fx, 120, tu(.04)); fs.line(fx, 100, fx, fy - 20, W(3)); fs.ellipse(fx, fy - 12, 74, 13, F(2.6));
      const fh = inG(p, 'pop', fx, 0, tu(.12)), bl = spin(fh, fx, 0, T.T0, 0, 240); on(bl, p, T.T0 + tu(.5), { loop: .36, ox: fx, oy: 0, r: [[0, 0], [.36, 120, 'lin']] });
      [0, 120, 240].forEach(a => { const g = rot(bl, a + 20, fx, 0); g.ellipse(fx, -54, 24, 44, S(2)); });
      ring(fh, fx, 0, 104, 92); [0, 45, 90, 135].forEach(a => { const x = Math.cos(rad(a)), y = Math.sin(rad(a)); fh.line(fx - x * 92, -y * 92, fx + x * 92, y * 92, S(1.2)); });
      fh.circle(fx, 0, 46, F(3.2)); put(p, c, Q.C, fx, 0, 60, fy + 44, { t: tu(.2), punch: T.T0 });
      const xs = spread(Q.M.length, -80, 80), ys = Q.M.map((_, i) => i % 2 ? -110 : -20), stops = [...xs.map((x, i) => [x, ys[i]]), [gx, -150]];
      const wind = (a, b, y, t) => [-30, 20].forEach((o, k) => { const e = p.path(`M ${a} ${y + o} q ${(b - a) / 4} -14 ${(b - a) / 2} 0 t ${(b - a) / 2} 0`, k ? S(2.2) : W(2.4)); on(e, p, 0, { draw: [[0, 0], [t + tu(.04 * k), 0], [t + tu(.04 * k + .26), 1, 'out']] }); });
      const tw = i => lerp(T.T0 + tu(.1), H - tu(.3), Q.M.length ? i / (Q.M.length) : 0);
      let wx0 = fx + 125;
      Q.M.forEach((it, i) => { const x = xs[i], y = ys[i], t = tw(i), tp = t + tu(.26); wind(wx0, x - 120, y, t);
        const st = inG(p, 'rise', x, (y + fy) / 2, tu(.2 + .06 * i)); st.line(x, y, x, fy, W(3.2));
        const ph = inG(p, 'pop', x, y, tu(.24 + .06 * i)), bl2 = spin(ph, x, y, tp, 0, 180); on(bl2, p, tp + tu(.5), { loop: .5, ox: x, oy: y, r: [[0, 0], [.5, 90, 'lin']] });
        [0, 90, 180, 270].forEach(a => { const g = rot(bl2, a + 15, x, y); g.path(`M ${x} ${y} L ${x} ${y - 100} Q ${x + 56} ${y - 82} ${x} ${y} Z`, F(3)); });
        ph.circle(x, y, 38, F(3.2)); put(p, c, it, x, y, 50, fy + 44, { t: tu(.28 + .06 * i), punch: tp, maxW: 150 }); wx0 = x + 110; });
      wind(wx0, gx - 20, -150, tw(Q.M.length));
      if (Q.F) haloH(p, gx + 86, -155, 120, H);
      const pole = inG(p, 'rise', gx, 0, tu(.1)); pole.line(gx, -240, gx, fy, W(3.4)); pole.circle(gx, -246, 8, SOLID(1));
      /* the cloth hangs limp by the pole, then on the keyword the wind unfurls it out to full and it keeps flying (a soft ripple) */
      const lp = sub(p); on(lp, p, 0, { o: [[0, 0], [tu(.18), 0], [tu(.26), 1], [H - tu(.3), 1], [H - tu(.24), 0]] });
      lp.path(`M ${gx} -232 Q ${gx + 26} -200 ${gx + 18} -150 Q ${gx + 10} -110 ${gx + 26} -70 L ${gx + 6} -64 Q ${gx - 6} -110 ${gx + 2} -150 Q ${gx + 8} -196 ${gx} -214 Z`, F(3));
      const fl = mvG(p, { px: gx, py: -160, sx: [[0, .05], [H - tu(.3), .05], [H - tu(.02), 1.05, 'out'], [H + tu(.14), 1, 'soft']], o: [[0, 0], [H - tu(.3), 0], [H - tu(.27), 1]] });
      const fw = mvG(fl, {}); on(fw, p, H + tu(.32), { loop: 1.2, ox: gx, oy: -160, ky: [[0, 0], [.3, 3, 'io'], [.9, -3, 'io'], [1.2, 0, 'io']] });
      fw.path(`M ${gx} -230 C ${gx + 60} -260, ${gx + 110} -200, ${gx + 170} -225 L ${gx + 170} -85 C ${gx + 110} -60, ${gx + 60} -120, ${gx} -90 Z`, F(3.4));
      put(p, c, Q.F, gx + 86, -155, 70, fy + 44, { t: H - tu(.12), lx: gx + 40, lt: H + tu(.06) });
    }); });

  /* 07 ── BLOCKS: the ball rolls in and knocks the first block; the shove runs block to block, and the last one tips off the edge into the box */
  variant('blocks', 'บล็อกดันกันตกกล่อง', (d, c) => { const Q = ch(d), T = TL(), H = T.H, ty = 120, n = Q.n, s = n > 3 ? 112 : 130;
    art(c, p => { const tb = inG(p, 'rise', -160, ty, tu(.02)); R(tb, -480, ty, 640, 20, 6, F(3)); [-440, 120].forEach(x => tb.line(x, ty + 20, x, 300, W(3)));
      const blk = (g, x, y, it, k, K, a0 = 0) => { shape(g, [[x - s / 2, y - s / 2], [x - s / 2 + 20, y - s / 2 - 18], [x + s / 2 + 20, y - s / 2 - 18], [x + s / 2, y - s / 2]], F(2.6)); R(g, x - s / 2, y - s / 2, s, s, 12, F(3.4));
        put(p, c, it, x, y, s * .64, null, { t: tu(.2 + .07 * k), mv: K }); };
      const onT = n - 1, x0 = 130 - s / 2 - (onT - 1) * (s + 6), tS = i => lerp(T.T0, H - tu(.45), onT > 1 ? i / (onT - 1) : 0);
      for (let i = 0; i < onT; i++) { const x = x0 + i * (s + 6), y = ty - s / 2, t = tS(i), K = { x: [[0, 0], [t, 0], [t + tu(.05), 16, 'out'], [t + tu(.24), 0, 'soft']] };
        const g = mvG(inG(p, 'drop', x, y, tu(.12 + .07 * i)), Object.assign({ px: x, py: ty }, K)); blk(g, x, y, Q.K[i], i, { x: K.x }); const it = Q.K[i];
        if (it.label && picOf(it)) txt(atG(p, tu(.3 + .07 * i)), it.label, x, ty + 66, { maxW: s + 20, color: C.ink, weight: 700, size: 30, wrap: 'down' }); }
      const bx = onT ? x0 - s / 2 - 50 : 40, roll = { x: [[0, -330], [tu(.3), -330], [T.T0, 0, 'in'], [T.T0 + tu(.06), -12, 'out'], [T.T0 + tu(.2), 0, 'soft']], r: [[0, -400], [tu(.3), -400], [T.T0, 0, 'in']] };
      const bg = mvG(clipG(p, -500, -350, 1000, 700), { px: bx, py: ty - 34, x: roll.x, r: roll.r }); bg.circle(bx, ty - 34, 34, F(3.2)); bg.line(bx - 20, ty - 34, bx + 20, ty - 34, S(1.6));
      const sl = litG(p, tu(.32)); sl.path(`M ${bx - 50} ${ty - 34} l -24 0 M ${bx - 46} ${ty - 56} l -18 -8 M ${bx - 46} ${ty - 12} l -18 8`, S(2)); on(sl, p, 0, { o: [[0, 0], [tu(.32), 0], [tu(.4), 1], [T.T0, 1], [T.T0 + tu(.1), 0]] });
      /* the last block: waits on the edge, gets shoved, tips over and drops into the box (squash on landing) */
      const xs0 = onT ? x0 + onT * (s + 6) : 130 - s / 2 + 10, ys0 = ty - s / 2, xF = 230, yF = 120, t1 = onT ? tS(onT - 1) + tu(.08) : T.T0, lan = H;
      const LK = { x: [[0, xs0 - xF], [t1, xs0 - xF], [t1 + tu(.14), xs0 - xF + 26, 'out'], [lan, 0, 'in'], [lan + tu(.1), 0]], y: [[0, ys0 - yF], [t1 + tu(.14), ys0 - yF], [t1 + tu(.24), ys0 - yF + 6], [lan, 0, 'in'], [lan + tu(.06), -10, 'out'], [lan + tu(.18), 0, 'soft']], r: [[0, 0], [t1 + tu(.1), 0], [t1 + tu(.24), 14], [lan, 28, 'in'], [lan + tu(.06), 24], [lan + tu(.18), 28, 'soft']] };
      lastH(p, Q, 230, 135, 110, lan);
      const lb = mvG(inG(p, 'drop', xs0, ys0, tu(.12 + .07 * onT)), Object.assign({ px: xF, py: yF }, LK)); blk(lb, xF, yF, Q.K[n - 1], n - 1, { px: xF, py: yF, x: LK.x, y: LK.y, r: LK.r });
      drawAt(p.path(`M 120 ${ty + 30} Q 190 ${ty - 30} 228 50`, S(1.6)), p, lan - tu(.2), tu(.2));
      const bxg = inG(p, 'rise', 250, 255, tu(.2)); R(bxg, 150, 210, 200, 90, 8, F(3.2));
      [[[150, 210], [120, 176], [150, 186]], [[350, 210], [380, 176], [350, 186]]].forEach((sh, k) => { const f = mvG(bxg, { px: sh[0][0], py: 210, r: [[0, 0], [lan, 0], [lan + tu(.05), k ? 8 : -8, 'out'], [lan + tu(.2), 0, 'soft']] }); shape(f, sh, F(2.4)); });
      { const it = Q.K[n - 1]; if (it.label && picOf(it)) txt(atG(p, lan + tu(.08)), it.label, 250, 340, { maxW: 200, color: C.ink, weight: 700, size: 30 }); }
      effect(p, c, Q.E, 400, -100, 60, 5, { t: lan + tu(.02) });
    }); });

  /* 08 ── BOXES: the ball drops into the top box and falls through each box into the next (each box jolts), then rolls out at the bottom */
  variant('boxes', 'กล่องซ้อนลูกบอลหล่น', (d, c) => { const Q = ch(d), T = TL(), H = T.H, n = Q.n, w = 210, h = n > 3 ? 90 : 108, X = spread(n, -170, 140), Y = spread(n, -225, 160);
    art(c, p => { drawAt(p.line(-480, 300, 480, 300, S(1.8)), p, 0, tu(.4));
      const bEnd = [Q.E ? 290 : X[n - 1] + 70, 278], L = [[X[0], -380], ...X.map((x, i) => [x, Y[i]]), [X[n - 1], 278], bEnd];
      const trail = p.path(pathOf([[X[0], -345], ...X.map((x, i) => [x, Y[i]]), [X[n - 1], 278], [Q.E ? 330 : X[n - 1] + 70, 278]], false), S(1.6)); drawAt(trail, p, T.T0, H - T.T0);
      const K = pathK(L, T.T0, H - tu(.08), bEnd, 40, u => u * u * (3 - 2 * u)), ball = mvG(clipG(p, -500, -350, 1000, 700), { x: K.x, y: K.y }); ball.circle(...bEnd, 22, SOLID());
      X.forEach((x, i) => { const y = Y[i], tp = K.when([x, y]); if (i === n - 1) { if (!Q.E) { const gl = sub(p); on(gl, p, 0, { o: [[0, 0], [tp, 0], [tp + tu(.1), 1]] }); lastHaloR(gl, Q, x, y - 14, w + 80, h + 40, 14, 14); } }
        const g0 = inG(p, 'drop', x, y, tu(.08 + .08 * i)), g = mvG(g0, { px: x, py: y + h / 2, y: [[0, 0], [tp, 0], [tp + tu(.05), 8, 'out'], [tp + tu(.22), 0, 'soft']], sy: [[0, 1], [tp, 1], [tp + tu(.05), .93, 'out'], [tp + tu(.22), 1, 'soft']] });
        [[[x - w / 2, y - h / 2], [x - w / 2 - 40, y - h / 2 - 34], [x - w / 2 + 20, y - h / 2 - 28]], [[x + w / 2, y - h / 2], [x + w / 2 + 40, y - h / 2 - 34], [x + w / 2 - 20, y - h / 2 - 28]]].forEach((sh, k) => {
          const f = mvG(g, { px: sh[0][0], py: sh[0][1], r: [[0, 0], [tp - tu(.08), 0], [tp - tu(.02), k ? 12 : -12, 'out'], [tp + tu(.2), 0, 'soft']] }); shape(f, sh, F(2.6)); });
        R(g, x - w / 2, y - h / 2, w, h, 8, F(3.4)); g.line(x - w / 2 + 14, y - h / 2 + 16, x + w / 2 - 14, y - h / 2 + 16, S(1.6));
        put(p, c, Q.K[i], x, y + 6, h * .56, null, { t: tu(.16 + .08 * i), mv: { y: [[0, 0], [tp, 0], [tp + tu(.05), 8, 'out'], [tp + tu(.22), 0, 'soft']] }, punch: tp + tu(.04) });
        const it = Q.K[i]; if (it.label && picOf(it)) txt(atG(p, tu(.3 + .08 * i)), it.label, x - w / 2 - 90, y + 12, { maxW: 150, color: C.ink, weight: 700, size: 30 }); });
      effect(p, c, Q.E, 390, 200, 58, 100);
    }); });

  /* 09 ── CHARGER: the plug (cause) slides in, the bolt flashes, the battery fills cell by cell (the links between) and the effect lights at its tip */
  variant('battery', 'เสียบสายชาร์จแบตเต็ม', (d, c) => { const Q = ch(d), T = TL(), H = T.H, y = 20, bx = -170, bw = 400, bh = 190, nc = Math.max(3, Q.M.length);
    art(c, p => {
      const plugK = { x: [[0, -60], [T.T0 - tu(.3), -60], [T.T0, 0, 'in'], [T.T0 + tu(.05), -4, 'out'], [T.T0 + tu(.16), 0, 'soft']] };
      const br = inG(p, 'slide', -405, y, tu(.06)); R(br, -470, y - 70, 130, 140, 18, F(3.4)); [-1, 1].forEach(sd => R(br, -340, y + sd * 26 - 7, 36, 14, 4, F(2.4))); put(p, c, Q.C, -405, y, 82, y - 100, { t: tu(.16), wrap: 'up', punch: T.T0 });
      const cab = p.path(`M -410 ${y + 70} Q -410 230 -300 230 L ${bx - 40} 230 Q ${bx - 20} 230 ${bx - 20} ${y + 60}`, { sw: 14 }), cab2 = p.path(`M -410 ${y + 70} Q -410 230 -300 230 L ${bx - 40} 230 Q ${bx - 20} 230 ${bx - 20} ${y + 60}`, { sw: 7, stroke: C.fill });
      [cab, cab2].forEach(e => drawAt(e, p, tu(.25), tu(.4)));
      const pl = mvG(litG(p, tu(.5)), { px: bx - 20, py: y + 42, y: [[0, 50], [T.T0 - tu(.3), 50], [T.T0, 0, 'in'], [T.T0 + tu(.05), 4, 'out'], [T.T0 + tu(.16), 0, 'soft']] }); R(pl, bx - 34, y + 20, 28, 44, 6, F(2.6));
      const bt = inG(p, 'pop', bx + bw / 2, y, tu(.12)); R(bt, bx, y - bh / 2, bw, bh, 26, F(3.6)); R(bt, bx + bw, y - 40, 26, 80, 8, F(3));
      const bo = sub(p); on(bo, p, 0, { o: [[0, .35], [T.T0, .35], [T.T0 + tu(.04), 1], [T.T0 + tu(.1), .4], [T.T0 + tu(.16), 1]] }); bo.path(`M ${bx + 40} ${y - bh / 2 - 34} l -14 24 l 14 0 l -10 22`, W(3));
      const cw = (bw - 40 - (nc - 1) * 12) / nc, tc = k => lerp(T.T0 + tu(.18), H - tu(.12), nc > 1 ? k / (nc - 1) : 0);
      for (let k = 0; k < nc; k++) { const x = bx + 20 + k * (cw + 12); R(bt, x, y - bh / 2 + 20, cw, bh - 40, 12, S(2)); const lt = litG(p, tc(k), .1); R(lt, x, y - bh / 2 + 20, cw, bh - 40, 12, { fill: LIT, sw: 2.6 });
        const it = Q.M[k]; if (it) put(p, c, it, x + cw / 2, y - 12, Math.min(70, cw * .62), y + 30, { t: tc(k) - tu(.02), maxW: cw - 10, size: 24, wrap: null }); }
      if (Q.F) { const ln = p.line(bx + bw + 26, y, 350, y, W(3)); drawAt(ln, p, H - tu(.14), tu(.12)); effect(p, c, Q.F, 410, y, 60, y + 106, { maxW: 160 }); }
    }); });

  /* 10 ── SHAKEN BOTTLE: the bottle (cause) is shaken hard, the cap pops off and the spray bursts up, carrying the links between, into the effect */
  variant('bottle', 'เขย่าขวดฝาเด้ง', (d, c) => { const Q = ch(d), T = TL(), H = T.H, bx = -230, by = 110;
    art(c, p => { drawAt(p.line(-480, 300, 480, 300, S(1.8)), p, 0, tu(.4));
      const sh = { r: [[0, 14], [T.T0 - tu(.5), 14]] }; for (let k = 0, t = T.T0 - tu(.5); t < T.T0 - tu(.04); t += tu(.07), k++) sh.r.push([ft(t), k % 2 ? 6 : 22]); sh.r.push([T.T0, 14, 'out']);
      const bo = mvG(inG(p, 'rise', bx, 150, tu(.04)), Object.assign({ px: bx, py: 300 }, { r: sh.r.map(([t, v, e]) => [t, f1(v - 14), e]) })), g = rot(bo, 14, bx, 300);
      g.path(`M ${bx - 80} 300 L ${bx - 80} ${by - 40} Q ${bx - 80} ${by - 110} ${bx - 30} ${by - 150} L ${bx - 30} ${by - 210} L ${bx + 30} ${by - 210} L ${bx + 30} ${by - 150} Q ${bx + 80} ${by - 110} ${bx + 80} ${by - 40} L ${bx + 80} 300 Z`, F(3.6));
      R(g, bx - 80, by + 10, 160, 120, 4, S(1.8)); [[-40, -60, 8], [20, -90, 6], [-10, -130, 7]].forEach(([a, b2, r], k) => { const bb = litG(g, T.T0 - tu(.4) + tu(.08 * k), .06); bb.circle(bx + a, by + b2, r, S(1.8)); });
      const cpv = [bx, by + 70]; put(p, c, Q.C, cpv[0], cpv[1], 80, 340, { t: tu(.14), mv: { px: bx, py: 300, r: sh.r } });
      [-1, 1].forEach(sd => [0, 1].forEach(k => { const e = p.path(`M ${bx + sd * (120 + k * 18)} ${by - 40 + k * 30} q ${sd * 10} 20 0 40`, S(2)); on(e, p, 0, { o: [[0, 0], [T.T0 - tu(.45), 0], [T.T0 - tu(.4), 1], [T.T0, 1], [T.T0 + tu(.2), .9]] }); }));
      const neck = [bx + 30 + 40, by - 230], tgt = [300, -180];
      [p.path(`M ${neck[0]} ${neck[1]} Q ${neck[0] + 20} -330 ${tgt[0] - 60} ${tgt[1] - 40}`, W(2.6)), p.path(`M ${neck[0] - 14} ${neck[1] + 6} Q ${neck[0] - 30} -300 ${neck[0] + 40} -320`, S(2))].forEach((e, k) => on(e, p, 0, { draw: [[0, 0], [T.T0, 0], [k ? T.T0 + tu(.3) : H - tu(.1), 1, 'out']] }));
      /* the cap flies off the neck on an arc and spins */
      const capF = [neck[0] + 100, -303], capL = [[neck[0] + 4, neck[1] - 8], [neck[0] + 40, -320], [neck[0] + 80, -330], capF], ck = pathK(capL, T.T0, T.T0 + tu(.36), capF, 14, u => 1 - Math.pow(1 - u, 2));
      const cg0 = mvG(p, { x: ck.x, y: ck.y, o: [[0, 0], [tu(.3), 0], [tu(.36), 1]] }), cg = mvG(cg0, { px: capF[0], py: capF[1], r: [[0, -40], [T.T0, -40], [T.T0 + tu(.36), 0, 'out']] }), cr = rot(cg, 40, capF[0], capF[1]);
      R(cr, neck[0] + 70, -318, 60, 30, 8, F(3)); for (let k = 0; k < 4; k++) cr.line(neck[0] + 80 + k * 13, -318, neck[0] + 80 + k * 13, -300, S(1.4));
      sparkAt(p, neck[0], neck[1] - 10, 22, 44, T.T0, 6, 200, [3, 4]);
      const pts = Q.M.map((_, i) => { const u = (i + 1) / (Q.M.length + 1); return [lerp(neck[0] + 40, tgt[0] - 80, u), lerp(-80, -200, u) + (i % 2 ? 50 : -10)]; });
      Q.M.forEach((it, i) => plate(p, c, it, pts[i][0], pts[i][1], 46, pts[i][1] + 80, { t: T.m(i, Q.M.length), maxW: 150, size: 28 }));
      [[neck[0] + 70, -60, 14], [neck[0] + 110, -10, 10], [neck[0] + 30, -120, 11]].forEach(([x, y, r], k) => { const e = mvG(p, { y: [[0, 60], [T.T0 + tu(.1 * k), 60], [T.T0 + tu(.1 * k + .5), 0, 'out']], o: [[0, 0], [T.T0 + tu(.1 * k), 0], [T.T0 + tu(.1 * k + .06), 1]] }); e.circle(x, y, r, S(2)); });
      if (Q.F) { const ex = tgt[0] + 40, ey = tgt[1] + 40; haloH(p, ex, ey, 120, H); const g2 = popAt(p, ex, ey, H - tu(.06)); g2.circle(ex, ey, 82, F(3.4)); sparkAt(p, ex, ey, 96, 120, H, 10, 0, [], true); ripple(p, ex, ey, 90, H);
        put(p, c, Q.F, ex, ey, 100, tgt[1] + 186, { t: H - tu(.06), lt: H + tu(.1) }); }
    }); });

  /* 11 ── BULB HORN: the rubber bulb (cause) is squeezed, the horn jolts, and the sound rings out wave by wave past the links between to the effect */
  variant('horn', 'บีบแตรเสียงดัง', (d, c) => { const Q = ch(d), T = TL(), H = T.H, y0 = -40;
    art(c, p => {
      const sq = { sx: [[0, 1], [T.T0 - tu(.1), 1], [T.T0, 1.14, 'in'], [T.T0 + tu(.22), 1, 'out']], sy: [[0, 1], [T.T0 - tu(.1), 1], [T.T0, .74, 'in'], [T.T0 + tu(.22), 1, 'out']] };
      const bu = mvG(inG(p, 'pop', -350, 90, tu(.06)), Object.assign({ px: -300, py: 90 }, sq)); bu.ellipse(-350, 90, 105, 88, F(3.6)); bu.path('M -430 60 Q -400 30 -360 26', S(2));
      put(p, c, Q.C, -350, 96, 80, 220, { t: tu(.16), mv: Object.assign({ px: -300, py: 90 }, sq) });
      const hn = mvG(inG(p, 'pop', 0, y0, tu(.12)), { px: -90, py: y0, r: buzzK(T.T0 + tu(.06), 2) }); R(hn, -262, 70, 34, 40, 8, F(2.8)); tube(hn, `M -228 90 Q -150 90 -150 30 Q -150 ${y0} -90 ${y0}`, 24);
      hn.path(`M -90 ${y0 - 14} L 40 ${y0 - 34} Q 70 ${y0 - 110} 110 ${y0 - 120} L 110 ${y0 + 120} Q 70 ${y0 + 110} 40 ${y0 + 34} L -90 ${y0 + 14} Z`, F(3.6));
      hn.ellipse(110, y0, 22, 120, F(3)); hn.ellipse(110, y0, 10, 90, S(1.6)); R(hn, -90, y0 - 20, 22, 40, 6, F(2.4));
      const air = mvG(p, { o: [[0, 0], [T.T0, 0], [T.T0 + tu(.04), 1], [T.T0 + tu(.3), 1], [T.T0 + tu(.36), 0]] }), ak = pathK([[-228, 90], [-150, 80], [-150, 0], [-90, y0], [90, y0]], T.T0, T.T0 + tu(.3), [90, y0], 16, u => u); const ad = mvG(air, { x: ak.x, y: ak.y }); ad.circle(90, y0, 9, SOLID());
      let x = 140, t = T.T0 + tu(.3); const nM = Q.M.length, step = (H - t) / (nM + 1);
      Q.M.forEach((it, i) => { const mx = nM === 1 ? 250 : 200 + i * 96; arcsAt(p, x, y0, 1, 2, 28, 16, 44, t); plate(p, c, it, mx, y0, 44, y0 + 86, { t: t + tu(.12), punch: t + tu(.2), maxW: 140, size: 28 }); x = mx + 46; t += step; });
      arcsAt(p, x, y0, 1, 3, 28, 18, 46, Math.min(t, H - tu(.16)), W(2.6));
      if (Q.F) effect(p, c, Q.F, 400, y0, 62, y0 + 108);
    }); });

  /* 12 ── PUMP: the handle (cause) is pumped down twice; each stroke sends a puff along the hose past the valves, and the ball (effect) swells up step by step */
  variant('pump', 'สูบลมลูกบอลพอง', (d, c) => { const Q = ch(d), T = TL(), H = T.H, fy = 280, px = -380;
    art(c, p => { drawAt(p.line(-480, fy, 480, fy, S(2)), p, 0, tu(.4));
      const s1 = T.T0, s2 = lerp(T.T0, H - tu(.25), .5), strokes = [s1, s2], hk = [[0, 0], [s1 - tu(.12), 0]]; strokes.forEach(t => { hk.push([t - tu(.02), -10, 'out'], [t + tu(.12), 70, 'in'], [t + tu(.16), 64, 'out'], [t + tu(.34), 0, 'io']); });
      const pb = inG(p, 'rise', px, 120, tu(.04)); R(pb, px - 90, fy - 14, 180, 14, 6, F(2.6)); R(pb, px - 44, -40, 88, fy - 14 + 40, 16, F(3.4));
      const hd = mvG(pb, { y: hk.map(([t, v, e]) => e ? [t, v, e] : [t, v]) }); R(hd, px - 9, -120, 18, 82, 4, F(2.4)); R(hd, px - 90, -136, 180, 24, 12, F(3));
      const ar = litG(p, tu(.4)); ar.path(`M ${px - 22} -70 l 0 -26 m -12 12 l 12 14 l 12 -14`, W(2.6));
      put(p, c, Q.C, px, 110, 70, fy + 44, { t: tu(.14), punch: s1 + tu(.12) });
      const hose = `M ${px + 44} ${fy - 40} Q ${px + 100} ${fy - 40} ${px + 120} ${fy - 20} L 120 ${fy - 20} Q 150 ${fy - 20} 150 ${fy - 60}`; [p.path(hose, { sw: 13 }), p.path(hose, { sw: 6, stroke: C.fill })].forEach(e => drawAt(e, p, tu(.2), tu(.4)));
      const HL = [[px + 44, fy - 40], [px + 120, fy - 20], [120, fy - 20], [150, fy - 60]], xs = spread(Q.M.length, -190, 30);
      strokes.forEach((t, k) => { const K = pathK(HL, t + tu(.12), t + tu(.42), HL[3], 18, u => u), pf = mvG(p, { x: K.x, y: K.y, o: [[0, 0], [t + tu(.12), 0], [t + tu(.14), 1], [t + tu(.42), 1], [t + tu(.46), 0]] }); pf.circle(...HL[3], 9, SOLID());
        if (!k) Q.M.forEach((it, i) => { const tp = K.when([xs[i], fy - 20]); const g = inG(p, 'pop', xs[i], fy - 70, tu(.26 + .06 * i)), b = mvG(g, { px: xs[i], py: fy - 92, s: bumpK(tp, 1.12) }); R(g, xs[i] - 30, fy - 46, 60, 52, 10, F(3)); b.circle(xs[i], fy - 92, 42, F(3.2)); put(p, c, it, xs[i], fy - 92, 54, fy + 44, { t: tu(.3 + .06 * i), punch: tp, maxW: 150 }); }); });
      if (Q.F) { const bx = 230, by = -10, pv = [150, 150], gk = { s: [[0, .4], [s1 + tu(.4), .4], [s1 + tu(.55), .7, 'out'], [s2 + tu(.4), .7], [H, 1.03, 'out'], [H + tu(.14), 1, 'soft']] };
        haloH(p, bx, by, 190, H); const bg = mvG(inG(p, 'pop', ...pv, tu(.3)), Object.assign({ px: pv[0], py: pv[1] }, gk));
        bg.circle(bx, by, 160, F(3.6)); bg.path(`M ${bx - 150} ${by - 40} Q ${bx} ${by - 90} ${bx + 150} ${by - 40}`, S(1.8)); bg.path(`M ${bx - 150} ${by + 40} Q ${bx} ${by + 90} ${bx + 150} ${by + 40}`, S(1.8)); R(bg, 140, by + 140, 20, 40, 6, F(2.4));
        const tk = litG(p, H); [-150, -100, 20, -20].forEach(a => drawAt(tick(tk, bx, by, a, 176, 196), p, H, tu(.14)));
        put(p, c, Q.F, bx, by, 140, fy + 44, { t: tu(.36), mv: Object.assign({ px: pv[0], py: pv[1] }, gk), lx: bx + 40, lt: H + tu(.1) }); }
    }); });

  /* 13 ── BOWLING: the ball (cause) rolls in down the lane, the pins tip one after another, and the hit flies off to the effect */
  variant('bowling', 'โบว์ลิ่งล้มต่อกัน', (d, c) => { const Q = ch(d), T = TL(), H = T.H, fy = 270, np = Math.max(1, Q.M.length);
    art(c, p => { drawAt(p.line(-480, fy, 480, fy, S(2)), p, 0, tu(.4)); drawAt(p.line(-480, fy + 30, 480, fy + 30, S(1.4)), p, tu(.05), tu(.4));
      const tHit = T.T0, roll = { x: [[0, -330], [tu(.3), -330], [tHit, 0, 'in'], [tHit + tu(.06), -10, 'out'], [tHit + tu(.22), 0, 'soft']], r: [[0, -330], [tu(.3), -330], [tHit, 0, 'in']] };
      const bc = clipG(p, -500, -350, 1000, 700), bg = mvG(bc, { px: -230, py: fy - 80, x: roll.x, r: roll.r }); bg.circle(-230, fy - 80, 80, F(3.6)); [[-250, -116], [-222, -128], [-210, -102]].forEach(([x, y]) => bg.circle(x, fy + y + 20, 8, F(2)));
      put(p, c, Q.C, -230, fy - 70, 70, fy + 44, { t: tu(.3), mv: { px: -230, py: fy - 80, x: roll.x } });
      const sl = mvG(p, { o: [[0, 0], [tu(.3), 0], [tu(.36), 1], [tHit, 1], [tHit + tu(.1), 0]] }); [[-380], [-310]].forEach(([x]) => sl.line(x, fy - 50, x + 50, fy - 50, S(2)));
      const xs = spread(np, -40, 160), tp = i => lerp(tHit + tu(.02), H - tu(.3), np > 1 ? i / (np - 1) : 0);
      (Q.M.length ? Q.M : [null]).forEach((it, i) => { const x = xs[i], a = 22 + i * 10, t = tp(i), rk = [[0, 0], [t, 0], [t + tu(.12), a + 8, 'in'], [t + tu(.2), a - 3, 'out'], [t + tu(.32), a, 'soft']];
        const g = mvG(inG(p, 'drop', x, fy - 120, tu(.12 + .06 * i)), { px: x, py: fy, r: rk });
        g.path(`M ${x - 26} ${fy} Q ${x - 52} ${fy - 70} ${x - 32} ${fy - 130} Q ${x - 18} ${fy - 170} ${x - 20} ${fy - 200} Q ${x - 24} ${fy - 236} ${x} ${fy - 240} Q ${x + 24} ${fy - 236} ${x + 20} ${fy - 200} Q ${x + 18} ${fy - 170} ${x + 32} ${fy - 130} Q ${x + 52} ${fy - 70} ${x + 26} ${fy} Z`, F(3.4));
        g.line(x - 20, fy - 196, x + 20, fy - 196, S(1.8)); g.line(x - 22, fy - 182, x + 22, fy - 182, S(1.8));
        put(p, c, it || {}, x, fy - 80, 52, fy + 44, { t: tu(.2 + .06 * i), mv: { px: x, py: fy, r: rk }, maxW: 130, size: 28 }); sparkAt(p, x + 40, fy - 200, 12, 30, t + tu(.06), 4, 300, [2]); });
      if (Q.F) { const ex = 380, ey = -120; effect(p, c, Q.F, ex, ey, 70, ey + 118); const tk = litG(p, H); [-1, 1].forEach(sd => drawAt(tick(tk, ex, ey, 200 + sd * 30, 96, 120), p, H, tu(.14))); }
    }); });

  /* 14 ── DOOR KNOCKER: the knocker (cause) knocks twice, the door swings open on its hinge, the light spills out and falls on the effect inside */
  variant('knocker', 'เคาะประตูแล้วเปิด', (d, c) => { const Q = ch(d), T = TL(), H = T.H, fy = 290, dx = 80, dw = 250, dh = 470, hx = dx - dw / 2, tO = lerp(T.T0, H, .35);
    art(c, p => { drawAt(p.line(-480, fy, 480, fy, S(2)), p, 0, tu(.4));
      const fr = inG(p, 'rise', dx, fy - dh / 2, tu(.04)); R(fr, hx - 26, fy - dh - 26, dw + 52, dh + 26, 10, F(3.4));
      R(litG(fr, tO, .2), hx, fy - dh, dw, dh, 4, { fill: LIT, sw: 2.4 }); R(fr, hx, fy - dh, dw, dh, 4, S(1.6));
      const fl = litG(p, tO, .3); fl.path(`M ${hx} ${fy} L ${dx + dw / 2} ${fy} L ${dx + dw / 2 + 70} ${fy + 50} L ${hx - 90} ${fy + 50} Z`, { fill: 'rgba(255,255,255,.1)', sw: 0, stroke: 'none' });
      /* the closed door folds away on its hinge while the open leaf grows out of it */
      const cd = mvG(fr, { px: hx, py: fy, sx: [[0, 1], [tO, 1], [tO + tu(.22), .02, 'in']], o: [[0, 1], [tO + tu(.2), 1], [tO + tu(.22), 0]] }); R(cd, hx, fy - dh, dw, dh, 4, F(3.4)); R(cd, hx + 24, fy - dh + 30, dw - 48, 150, 6, S(1.6)); R(cd, hx + 24, fy - 210, dw - 48, 150, 6, S(1.6)); cd.circle(dx + dw / 2 - 30, fy - 230, 8, S(2));
      const od = mvG(p, { px: hx, py: fy, sx: [[0, .02], [tO + tu(.2), .02], [tO + tu(.42), 1.04, 'out'], [tO + tu(.56), 1, 'soft']], o: [[0, 0], [tO + tu(.2), 0], [tO + tu(.22), 1]] });
      shape(od, [[hx, fy - dh], [hx - 110, fy - dh + 40], [hx - 110, fy - 24], [hx, fy]], F(3.4));
      shape(od, [[hx - 18, fy - dh + 44], [hx - 92, fy - dh + 70], [hx - 92, fy - dh + 190], [hx - 18, fy - dh + 176]], S(1.6)); shape(od, [[hx - 18, fy - 210], [hx - 92, fy - 196], [hx - 92, fy - 60], [hx - 18, fy - 62]], S(1.6));
      /* the knocker rides the door: centre of the closed door → its place on the open leaf; it swings and knocks twice before */
      const kx = hx - 55, ky = fy - 250, k0 = dx, sx2 = [[0, k0 - kx], [tO, k0 - kx], [tO + tu(.22), (k0 - kx) * .2, 'in'], [tO + tu(.42), 0, 'out']];
      const kn = [[0, 0], [T.T0 - tu(.3), 0], [T.T0 - tu(.2), -24, 'out'], [T.T0 - tu(.12), 0, 'in'], [T.T0 - tu(.05), -24, 'out'], [T.T0, 0, 'in'], [T.T0 + tu(.14), 0]];
      const kg = mvG(mvG(inG(p, 'pop', k0, ky, tu(.18)), { x: sx2 }), { px: kx, py: ky - 54, r: kn }); kg.circle(kx, ky, 46, F(3.4)); kg.circle(kx, ky - 54, 9, F(2.4));
      put(p, c, Q.C, kx, ky, 58, null, { t: tu(.24), mv: { px: kx, py: ky - 54, x: sx2, r: kn } });
      if (Q.C && Q.C.label && picOf(Q.C)) txt(atG(p, tO + tu(.4)), Q.C.label, kx - 160, ky + 10, { maxW: 150, color: C.ink, weight: 700, size: 30 });
      [T.T0 - tu(.12), T.T0].forEach(t => { const g = sub(p); on(g, p, 0, { o: [[0, 0], [t, 0], [t + tu(.02), 1], [t + tu(.1), 0]] }); [[1, -1], [1.4, 0], [1, 1]].forEach(([a, b]) => g.line(k0 + a * 50, ky + b * 30, k0 + a * 72, ky + b * 42, W(2.4))); });
      const xs = spread(Q.M.length, -330, -200); Q.M.forEach((it, i) => { const x = xs[i] + 40 * i, t = lerp(tO + tu(.3), H - tu(.12), Q.M.length > 1 ? i / (Q.M.length - 1) : .5); const mt = inG(p, 'pop', x, fy + 20, t); mt.ellipse(x, fy + 20, 60, 14, F(2.4)); plate(p, c, it, x, fy - 50, 40, null, { t: t + tu(.04) }); });
      if (Q.F) { haloH(p, dx, fy - 210, 130, H); put(p, c, Q.F, dx, fy - 210, 130, fy - 60, { t: H - tu(.06), maxW: 220 }); ripple(p, dx, fy - 210, 90, H); }
    }); });

  /* 15 ── PUPPET: the control bar (cause) sways, then tips; the strings pull, the puppet raises its arm and lifts the effect up */
  variant('puppet', 'หุ่นชักใย', (d, c) => { const Q = ch(d), T = TL(), H = T.H, px = 60, bx = 60, byy = -270, k = .95;
    art(c, p => { drawAt(p.line(-480, 300, 480, 300, S(1.8)), p, 0, tu(.4));
      const tilt = [[0, 6], [tu(.5), 6], [T.T0 - tu(.2), 2, 'io'], [T.T0, 8], [H - tu(.3), -10, 'io'], [H - tu(.2), -12], [H - tu(.05), -10, 'soft']], rel = tilt.map(([t, v, e]) => e ? [t, f1(v + 10), e] : [t, f1(v + 10)]);
      const barO = mvG(inG(p, 'drop', bx, byy, tu(.04)), { px: bx, py: byy, r: rel }), bar = rot(barO, -10, bx, byy); R(bar, bx - 190, byy - 14, 380, 28, 12, F(3.2)); R(bar, bx - 14, byy - 70, 28, 140, 10, F(3)); bar.circle(bx, byy, 50, F(3.4));
      put(p, c, Q.C, bx, byy, 62, null, { t: tu(.14), mv: { px: bx, py: byy, r: tilt } });
      if (Q.C && Q.C.label && picOf(Q.C)) txt(atG(p, tu(.25)), Q.C.label, bx - 330, byy + 10, { maxW: 180, color: C.ink, weight: 700, size: 32 });
      /* the raised arm: shoulder (-36,-82) → hand; it starts down by the side and lifts (in puppet units) */
      const raise = [[0, -150], [T.T0, -150], [H - tu(.3), -8, 'io'], [H - tu(.16), 4], [H, 0, 'soft']];
      const g = p.child({ transform: `translate(${px} ${f1(300 - 166 * k)}) scale(${k})` }, k); g.H = p.H; g.motion = p.motion;
      const pg = mvG(g, { y: [[0, 0], [T.T0, 0], [T.T0 + tu(.1), -8, 'out'], [T.T0 + tu(.26), 0, 'soft'], [H - tu(.3), 0], [H - tu(.2), -10, 'out'], [H, 0, 'soft']], o: [[0, 0], [tu(.2), 0], [tu(.3), 1]] });
      const arm = sd => sd < 0 ? { s: [-36, -82], e: [-74, -130], h: [-82, -190] } : { s: [36, -82], e: [60, -26], h: [64, 34] }, hm = G.parts.human(pg, 'line', { arm });
      hm.on('upper-1', p, 0, { ox: -36, oy: -82, r: raise });
      const sh = [px - 36 * k, 300 - 166 * k - 82 * k], hand0 = [px - 82 * k, 300 - 166 * k - 190 * k], ang = (a) => { const u = rad(a), dx0 = hand0[0] - sh[0], dy0 = hand0[1] - sh[1]; return [sh[0] + dx0 * Math.cos(u) - dy0 * Math.sin(u), sh[1] + dx0 * Math.sin(u) + dy0 * Math.cos(u)]; };
      const head = [px, 300 - 166 * k - 132 * k - 31 * k], hR = [px + 64 * k, 300 - 166 * k + 34 * k];
      const endAtR = (e, a) => { const u = rad(a + 10), dx0 = e[0] - bx, dy0 = e[1] - byy; return [bx + dx0 * Math.cos(u) - dy0 * Math.sin(u), byy + dx0 * Math.sin(u) + dy0 * Math.cos(u)]; };
      const ends = [[bx - 186, byy + 32], [bx - 6, byy - 4], [bx + 182, byy - 34]], kts = [0, tu(.5), T.T0 - tu(.2), T.T0, lerp(T.T0, H - tu(.3), .5), H - tu(.3), H - tu(.2), H - tu(.05), H];
      const tiltAt = t => { for (let i = 1; i < tilt.length; i++) if (t <= tilt[i][0]) return lerp(tilt[i - 1][1], tilt[i][1], (t - tilt[i - 1][0]) / Math.max(1e-6, tilt[i][0] - tilt[i - 1][0])); return -10; };
      const raiseAt = t => { for (let i = 1; i < raise.length; i++) if (t <= raise[i][0]) return lerp(raise[i - 1][1], raise[i][1], (t - raise[i - 1][0]) / Math.max(1e-6, raise[i][0] - raise[i - 1][0])); return 0; };
      /* each string: drawn at its final place, then rotated/stretched about its bottom end so its top follows the bar (the hand's string also follows the hand) */
      const strG = litG(p, tu(.3));
      [[0, () => ang(0), t => ang(raiseAt(t))], [1, () => head, () => head], [2, () => hR, () => hR]].forEach(([j, bF, bT]) => { const b = bF(), a = ends[j], la = Math.hypot(a[0] - b[0], a[1] - b[1]), a0 = Math.atan2(a[1] - b[1], a[0] - b[0]);
        const K = { ox: b[0], oy: b[1], x: [], y: [], r: [], sy: [] }; const T2 = [...new Set(kts.concat([...Array(12)].map((_, q) => lerp(T.T0, H, q / 11))).map(ft))].sort((u, v) => u - v);
        T2.forEach(t => { const top = endAtR(a, tiltAt(t)), bot = bT(t), L2 = Math.hypot(top[0] - bot[0], top[1] - bot[1]), an = Math.atan2(top[1] - bot[1], top[0] - bot[0]); K.x.push([ft(t), f1(bot[0] - b[0])]); K.y.push([ft(t), f1(bot[1] - b[1])]); K.r.push([ft(t), f1((an - a0) * 180 / Math.PI)]); K.sy.push([ft(t), +(L2 / la).toFixed(3)]); });
        const q2 = sub(strG); on(q2, p, 0, { ox: b[0], oy: b[1], x: K.x, y: K.y, r: K.r });
        const q3 = sub(q2, { transform: `rotate(${f1(a0 * 180 / Math.PI - 90)} ${f1(b[0])} ${f1(b[1])})` }), q4 = sub(q3); on(q4, p, 0, { ox: b[0], oy: b[1], sy: K.sy }); q4.line(b[0], b[1], b[0], b[1] + la, S(1.6)); });
      const mids = Q.M.map((_, i) => { const t = (i + 1) / (Q.M.length + 1), A = ends[2], B = hR; return [lerp(A[0], B[0], t) + 90, lerp(A[1], B[1], t)]; });
      Q.M.forEach((it, i) => { const tm = T.m(i, Q.M.length), gg = inG(p, 'pop', mids[i][0], mids[i][1], tu(.3 + .06 * i)); gg.line(mids[i][0] - 90, mids[i][1], mids[i][0] - 44, mids[i][1], S(1.6)); plate(p, c, it, mids[i][0], mids[i][1], 42, null, { g: mvG(gg, { px: mids[i][0], py: mids[i][1], s: bumpK(tm, 1.12) }), t: tu(.36 + .06 * i), punch: tm });
        if (it.label && picOf(it)) txt(atG(p, tu(.46 + .06 * i)), it.label, mids[i][0] + 120, mids[i][1] + 10, { maxW: 140, color: C.ink, weight: 700, size: 28 }); });
      if (Q.F) { const hF = ang(0), ex = hF[0] - 120, ey = hF[1] - 20, ts2 = [...Array(14)].map((_, q) => lerp(T.T0, H, q / 13)), MK = { x: [[0, f1(ang(-150)[0] - hF[0])], [T.T0, f1(ang(-150)[0] - hF[0])]], y: [[0, f1(ang(-150)[1] - hF[1])], [T.T0, f1(ang(-150)[1] - hF[1])]] };
        ts2.forEach(t => { const hp = ang(raiseAt(t)); MK.x.push([ft(t), f1(hp[0] - hF[0])]); MK.y.push([ft(t), f1(hp[1] - hF[1])]); });
        haloH(p, ex, ey, 92, H); const eg = mvG(inG(p, 'pop', ex, ey, tu(.4)), { x: MK.x, y: MK.y }); eg.line(hF[0], hF[1], ex + 50, ey + 30, W(3)); plate(p, c, Q.F, ex, ey, 64, ey + 108, { g: mvG(eg, { px: ex, py: ey, s: bumpK(H, 1.12) }), t: tu(.46), mv: MK, lt: H + tu(.06) }); }
    }); });

  /* 16 ── HAND PUMP: the handle (cause) is worked up and down, the water gushes out, runs along the trough past each marker and fills the bucket (effect) */
  variant('handpump', 'ปั๊มน้ำมือโยก', (d, c) => { const Q = ch(d), T = TL(), H = T.H, fy = 280, px = -300;
    art(c, p => { drawAt(p.line(-480, fy, 480, fy, S(2)), p, 0, tu(.4));
      const pb = inG(p, 'rise', px, 100, tu(.04)); R(pb, px - 70, fy - 30, 140, 30, 8, F(3)); R(pb, px - 44, -90, 88, fy - 30 + 90, 18, F(3.4)); R(pb, px - 54, -110, 108, 26, 10, F(3));
      tube(pb, `M ${px + 44} -50 L ${px + 120} -50 L ${px + 120} -24`, 22);
      const st = [T.T0 - tu(.4), T.T0 - tu(.05)], hk = [[0, 0], [st[0] - tu(.06), 0]]; st.forEach(t => hk.push([t + tu(.12), 30, 'io'], [t + tu(.3), -4, 'io'])); hk.push([st[1] + tu(.42), 0, 'soft']);
      const hd = mvG(inG(p, 'pop', px, -128, tu(.1)), { px, py: -128, r: hk }); tube(hd, `M ${px} -128 L ${px - 120} -220`, 16); R(hd, px - 150, -250, 54, 40, 12, F(3)); pb.circle(px, -128, 10, F(2.4));
      const ar = mvG(p, { o: [[0, 0], [tu(.4), 0], [tu(.48), 1], [T.T0, 1], [T.T0 + tu(.2), .6]] }); ar.path(`M ${px - 100} -290 a 40 40 0 0 0 -40 30`, S(2)); ar.poly([[px - 144, -276], [px - 140, -260], [px - 124, -266]], S(2));
      put(p, c, Q.C, px, 110, 70, fy + 44, { t: tu(.16), punch: T.T0 });
      const tg = inG(p, 'rise', px + 300, 70, tu(.14)); R(tg, px + 90, 52, 420, 30, 6, F(3)); [px + 150, px + 450].forEach(x => tg.line(x, 82, x, fy, W(2.6)));
      [p.path(`M ${px + 120} -20 Q ${px + 124} 20 ${px + 130} 52`, W(3)), p.path(`M ${px + 110} -20 Q ${px + 112} 20 ${px + 116} 52`, S(2))].forEach(e => on(e, p, 0, { draw: [[0, 0], [T.T0, 0], [T.T0 + tu(.14), 1, 'out']] }));
      const tA = T.T0 + tu(.14), tB = H - tu(.32), wv = p.path(`M ${px + 100} 60 q 25 -6 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0`, S(1.8)); on(wv, p, 0, { draw: [[0, 0], [tA, 0], [tB, 1, 'lin']] });
      const front = mvG(p, { x: [[0, 0], [tA, 0], [tB, 400, 'lin']], o: [[0, 0], [tA, 0], [tA + tu(.04), 1], [tB, 1], [tB + tu(.06), 0]] }); front.circle(px + 100, 58, 8, SOLID());
      const xs = spread(Q.M.length, px + 170, px + 400); Q.M.forEach((it, i) => { const tp = lerp(tA, tB, (xs[i] - px - 100) / 400); const g = inG(p, 'pop', xs[i], 0, tu(.22 + .06 * i)); g.line(xs[i], 52, xs[i], 20, W(2.4)); plate(p, c, it, xs[i], -26, 44, -90, { t: tu(.26 + .06 * i), punch: tp, maxW: 140, size: 28, wrap: 'up' }); });
      [p.path(`M ${px + 510} 60 Q ${px + 540} 70 ${px + 546} 130`, W(3)), p.path(`M ${px + 506} 72 Q ${px + 530} 86 ${px + 534} 130`, S(2))].forEach(e => on(e, p, 0, { draw: [[0, 0], [tB, 0], [tB + tu(.12), 1, 'out']] }));
      const bx = 230; if (Q.F) haloH(p, bx, 205, 112, H);
      const bk = inG(p, 'drop', bx, 205, tu(.2)); bk.path(`M ${bx - 90} 130 L ${bx + 90} 130 L ${bx + 72} ${fy} L ${bx - 72} ${fy} Z`, F(3.4)); bk.path(`M ${bx - 90} 130 Q ${bx} 40 ${bx + 90} 130`, S(2));
      const lv = mvG(bk, { px: bx, py: fy, sy: [[0, .02], [tB + tu(.1), .02], [H, 1, 'out']] }); lv.path(`M ${bx - 84} 152 L ${bx + 84} 152 L ${bx + 72} ${fy - 6} L ${bx - 72} ${fy - 6} Z`, { fill: LIT, sw: 0, stroke: 'none' });
      const wl = mvG(bk, { y: [[0, fy - 152], [tB + tu(.1), fy - 158], [H, 0, 'out']], o: [[0, 0], [tB + tu(.1), 0], [tB + tu(.14), 1]] }); wl.path(`M ${bx - 84} 152 q 21 -8 42 0 t 42 0 t 42 0 t 42 0`, W(2));
      put(p, c, Q.F, bx, 214, 70, fy + 44, { t: H - tu(.06), maxW: 200, punch: H + tu(.04) }); if (Q.F) ripple(p, bx, 160, 70, H);
    }); });

  /* 17 ── CROQUET: the mallet (cause) swings back and strikes; the ball rolls through every hoop (each lights as it passes) and knocks the post (effect) */
  variant('croquet', 'ตีลูกผ่านห่วง', (d, c) => { const Q = ch(d), T = TL(), H = T.H, fy = 270;
    art(c, p => { drawAt(p.line(-480, fy, 480, fy, S(2)), p, 0, tu(.4)); drawAt(p.path(`M -480 ${fy + 34} q 60 -10 120 0 t 120 0 t 120 0 t 120 0 t 120 0 t 120 0 t 120 0 t 120 0`, S(1.4)), p, tu(.05), tu(.5));
      const sw = [[0, 0], [tu(.4), 0], [T.T0 - tu(.3), 36, 'io'], [T.T0 - tu(.14), 38], [T.T0, 0, 'in'], [T.T0 + tu(.06), -4, 'out'], [T.T0 + tu(.2), 0, 'soft']];
      const mg = mvG(inG(p, 'pop', -300, -10, tu(.06)), { px: -300, py: -10, r: sw }); tube(mg, `M -300 -10 L -400 ${fy - 46}`, 15); const hd = rot(mg, -30, -410, fy - 40); R(hd, -480, fy - 80, 140, 72, 18, F(3.4)); hd.line(-462, fy - 80, -462, fy - 8, S(1.6)); hd.line(-358, fy - 80, -358, fy - 8, S(1.6));
      const cb = mvG(inG(p, 'pop', -262, fy - 26, tu(.12)), { px: -262, py: fy, x: [[0, 0], [T.T0, 0], [T.T0 + tu(.05), 14, 'out'], [T.T0 + tu(.24), 0, 'soft']] }); cb.circle(-262, fy - 26, 54, F(3.2));
      put(p, c, Q.C, -262, fy - 26, 62, fy + 44, { t: tu(.18), mv: { x: [[0, 0], [T.T0, 0], [T.T0 + tu(.05), 14, 'out'], [T.T0 + tu(.24), 0, 'soft']] }, punch: T.T0 });
      sparkAt(p, -330, fy - 40, 6, 26, T.T0, 3, 150, []);
      const bx0 = -190, bxF = 310, tE = H - tu(.04), u = t => (t - T.T0) / (tE - T.T0), xAt = t => lerp(bx0, bxF, 1 - Math.pow(1 - Math.min(1, Math.max(0, u(t))), 1.7)), tAt = x => { const f = (x - bx0) / (bxF - bx0); return T.T0 + (tE - T.T0) * (1 - Math.pow(1 - f, 1 / 1.7)); };
      const BK = [[0, bx0 - bxF], [T.T0, bx0 - bxF]]; for (let j = 1; j <= 14; j++) { const t = T.T0 + (tE - T.T0) * j / 14; BK.push([ft(t), f1(xAt(t) - bxF)]); } BK.push([tE + tu(.06), -10, 'out'], [tE + tu(.2), 0, 'soft']);
      const tr = p.path(`M -205 ${fy - 26} L 310 ${fy - 26}`, S(1.4)); on(tr, p, 0, { draw: [[0, 0], [T.T0, 0], [tE, 1, 'out']] });
      const xs = spread(Q.M.length, -60, 160); Q.M.forEach((it, i) => { const x = xs[i], tp = tAt(x), hp = inG(p, 'rise', x, fy - 60, tu(.2 + .06 * i));
        hp.path(`M ${x - 52} ${fy} L ${x - 52} ${fy - 84} A 52 52 0 0 1 ${x + 52} ${fy - 84} L ${x + 52} ${fy}`, { sw: 14 }); hp.path(`M ${x - 52} ${fy} L ${x - 52} ${fy - 84} A 52 52 0 0 1 ${x + 52} ${fy - 84} L ${x + 52} ${fy}`, { sw: 7, stroke: C.fill });
        plate(p, c, it, x, fy - 200, 46, null, { t: tu(.3 + .06 * i), punch: tp }); hp.line(x, fy - 154, x, fy - 136, S(2)); ripple(p, x, fy - 200, 50, tp);
        if (it.label && picOf(it)) txt(atG(p, tu(.42 + .06 * i)), it.label, x, fy + 44, { maxW: 150, color: C.ink, weight: 700, size: 28 }); });
      const ball = mvG(p, { x: BK, o: [[0, 0], [T.T0 - tu(.02), 0], [T.T0, 1]] }); ball.circle(bxF, fy - 26, 26, SOLID());
      const po = mvG(inG(p, 'rise', 365, fy - 150, tu(.16)), { px: 365, py: fy, r: [[0, 0], [tE, 0], [tE + tu(.05), 5, 'out'], [tE + tu(.16), -3], [tE + tu(.3), 0, 'soft']] }); R(po, 352, fy - 300, 26, 300, 8, F(3.2)); [0, 1, 2].forEach(k => po.line(352, fy - 260 + k * 60, 378, fy - 248 + k * 60, S(2)));
      if (Q.F) effect(p, c, Q.F, 365, -110, 64, -10, { maxW: 170 });
    }); });

  /* 18 ── GROWING TILES: the first tile comes in, the chevrons fire, and each next tile grows out bigger than the one before */
  variant('grow', 'ใหญ่ขึ้นทีละทอด', (d, c) => { const Q = ch(d), T = TL(), H = T.H, n = Q.n, by = 140, sz = spread(n, n > 3 ? 90 : 115, n > 3 ? 190 : 220), gap = 70;
    art(c, p => { drawAt(p.line(-470, by + 14, 470, by + 14, S(1.8)), p, 0, tu(.4));
      const tot = sz.reduce((a, b) => a + b, 0) + gap * (n - 1) + (Q.E ? gap + 150 : 0); let x = -tot / 2;
      const steps = n - 1 + (Q.E ? 1 : 0), stT = k => k <= 0 ? tu(.2) : steps <= 1 ? H : lerp(T.T0, H, (k - 1) / (steps - 1));
      sz.forEach((s, i) => { const cx = x + s / 2, y = by - s / 2, t = stT(i); if (i === n - 1) lastH(p, Q, cx, y, s * .7 + 10, t);
        const g = mvG(p, { px: cx, py: by, s: [[0, .2], [t, .2], [t + tu(.22), 1.06, 'out'], [t + tu(.36), 1, 'soft']], o: [[0, 0], [t, 0], [t + tu(.05), 1]] }); tile(g, cx, y, s, F(3.4)); g.circle(cx - s / 2 + 22, y - s / 2 + 22, 5, S(1.6));
        put(p, c, Q.K[i], cx, y, s * .58, by + 62, { t: t + tu(.04), maxW: Math.max(150, s), punch: i === n - 1 && !Q.E && i ? t + tu(.2) : undefined });
        x += s; if (i < n - 1 || Q.E) { const m = x + gap / 2, tc = stT(i + 1) - tu(.16);
          [-14, 8].forEach((o, k) => { const e = p.poly([[m + o - 8, by - 60 - 16], [m + o + 6, by - 60], [m + o - 8, by - 60 + 16]], W(3.4)); on(e, p, 0, { o: [[0, 0], [tc + tu(.05 * k), 0], [tc + tu(.05 * k + .04), 1]] }); }); }
        x += gap; });
      if (Q.E) effect(p, c, Q.E, x + 75, by - 80, 72, by + 62);
    }); });

  /* 19 ── BEAD TUBE: the plunger drives into the clear tube; the beads shunt along, and the last one pops out of the open end */
  variant('beads', 'ลูกปัดดันในหลอดใส', (d, c) => { const Q = ch(d), T = TL(), H = T.H, n = Q.n, y = 0, r = n > 3 ? 46 : 54, t0 = -330, t1 = 250;
    art(c, p => {
      const tb = inG(p, 'pop', (t0 + t1) / 2, y, tu(.04)); R(tb, t0, y - 66, t1 - t0, 132, 66, { fill: GLASS, sw: 3.4 }); tb.line(t0 + 40, y - 44, t1 - 50, y - 44, S(1.6));
      [t0 + 70, t1 - 70].forEach(x => { const lg = inG(p, 'rise', x, 140, tu(.1)); lg.line(x, y + 66, x, 200, W(3)); R(lg, x - 44, 200, 88, 16, 6, F(2.6)); });
      const inT = n - 1, xe = t1 - r - 4, xs = [...Array(inT)].map((_, i) => xe - (inT - 1 - i) * (2 * r + 4)), head = inT ? xs[0] - r - 12 : t1 - 70, push = 2 * r + 4, tP = H - tu(.3);
      const PK = { x: [[0, -push], [T.T0, -push], [tP, 0, 'io'], [tP + tu(.05), 6, 'out'], [tP + tu(.2), 0, 'soft']] };
      const pl = mvG(inG(p, 'slide', -300, y, tu(.08)), PK); R(pl, -480, y - 10, head - 22 + 480, 20, 6, F(2.6)); R(pl, -500, y - 50, 24, 100, 8, F(3)); R(pl, head - 22, y - 56, 22, 112, 8, F(3));
      xs.forEach((x, i) => { const g = mvG(inG(p, 'pop', x - push, y, tu(.2 + .06 * i)), { x: PK.x }); g.circle(x, y, r, F(3.4)); put(p, c, Q.K[i], x, y, r * 1.3, y + 140, { t: tu(.24 + .06 * i), mv: { x: PK.x }, maxW: 2 * r + 30, size: 28, lt: tP + tu(.1) }); });
      const lx = 360, LK = { x: [[0, f1(xe - lx)], [T.T0, f1(xe - lx)], [tP, f1(xe + push - lx), 'io'], [H, 0, 'out'], [H + tu(.05), -8], [H + tu(.18), 0, 'soft']], r: [[0, -120], [tP, -120], [H, 0, 'out']] };
      lastH(p, Q, lx, y, r + 30, H);
      const lb = mvG(inG(p, 'pop', xe, y, tu(.2 + .06 * inT)), { px: lx, py: y, x: LK.x, r: LK.r }); lb.circle(lx, y, r, F(3.4)); put(p, c, Q.K[n - 1], lx, y, r * 1.3, y + 140, { t: tu(.24 + .06 * inT), mv: { x: LK.x }, punch: H, lt: H + tu(.06) });
      const ml = mvG(p, { o: [[0, 0], [H - tu(.06), 0], [H, 1], [H + tu(.4), 1], [H + tu(.6), .5]] }); [[t1 + 16, -30], [t1 + 24, 0], [t1 + 16, 30]].forEach(([x, yy]) => ml.line(x, y + yy, x + 26, y + yy, S(2)));
      if (Q.E) { effect(p, c, Q.E, 360, -200, 58, null); if (Q.E.label && picOf(Q.E)) txt(atG(p, H + tu(.12)), Q.E.label, 230, -190, { maxW: 150, color: C.ink, weight: 700, size: 30 }); }
    }); });

  /* 20 ── REMOTE & SCREEN: the button on the remote (cause) is pressed, the signal hops on wave by wave, and the screen flickers on with the effect */
  variant('remote', 'รีโมตเปิดจอ', (d, c) => { const Q = ch(d), T = TL(), H = T.H, sx = 230, sy = -50, sw = 380, sh = 260;
    art(c, p => { drawAt(p.line(-480, 300, 480, 300, S(1.8)), p, 0, tu(.4));
      const rk = [[0, 0], [T.T0 - tu(.3), 0], [T.T0 - tu(.1), -6, 'io'], [T.T0 + tu(.1), 0, 'soft']];
      const rg0 = mvG(inG(p, 'rise', -360, 120, tu(.04)), { px: -360, py: 120, r: rk }), rg = rot(rg0, -24, -360, 120); R(rg, -420, -10, 120, 290, 40, F(3.6));
      const bt = mvG(rg, { px: -360, py: 60, s: [[0, 1], [T.T0 - tu(.06), 1], [T.T0, .84, 'in'], [T.T0 + tu(.14), 1, 'out']] }); bt.circle(-360, 60, 44, F(3.2));
      [0, 1, 2].forEach(k => [0, 1].forEach(j => R(rg, -392 + j * 40, 140 + k * 36, 24, 18, 6, S(1.8)))); const led = sub(rg); on(led, p, 0, { o: [[0, .3], [T.T0, .3], [T.T0 + tu(.03), 1], [T.T0 + tu(.2), 1], [T.T0 + tu(.3), .3]] }); R(led, -376, 6, 32, 12, 5, SOLID(1));
      put(p, c, Q.C, -360, 60, 56, null, { t: tu(.14), mv: { px: -360, py: 120, r: rk.map(([t, v, e]) => e ? [t, v - 24, e] : [t, v - 24]) }, punch: T.T0 }); if (Q.C && Q.C.label && picOf(Q.C)) txt(atG(p, tu(.3)), Q.C.label, -330, 330, { maxW: 200, color: C.ink, weight: 700, size: 30, wrap: null });
      const tip = [-300, -40], xs = spread(Q.M.length, -170, -20); let a = tip, t = T.T0 + tu(.04); const step = (H - tu(.3) - t) / (Q.M.length + 1);
      Q.M.forEach((it, i) => { const yy = -160 + (i % 2) * 90; arcsAt(p, a[0] + 20, a[1] - 10, 1, 2, 22, 14, 40, t, S(2.2)); plate(p, c, it, xs[i] + 30, yy, 44, yy + 80, { t: t + tu(.1), punch: t + tu(.18), maxW: 140, size: 28 }); a = [xs[i] + 80, yy]; t += step; });
      arcsAt(p, a[0] + 10, a[1], 1, 3, 22, 16, 40, t, W(2.4));
      const tv = inG(p, 'rise', sx, sy, tu(.1)); R(tv, sx - sw / 2, sy - sh / 2, sw, sh, 20, F(3.6)); shape(tv, [[sx - 50, sy + sh / 2], [sx + 50, sy + sh / 2], [sx + 80, 290], [sx - 80, 290]], F(3)); tv.circle(sx + sw / 2 - 30, sy + sh / 2 - 9, 4, S(1.2));
      const on2 = sub(tv); on(on2, p, 0, { o: [[0, 0], [H - tu(.24), 0], [H - tu(.2), 1], [H - tu(.16), .2], [H - tu(.1), .9], [H - tu(.06), .4], [H - tu(.02), 1]] }); R(on2, sx - sw / 2 + 18, sy - sh / 2 + 18, sw - 36, sh - 36, 10, { fill: LIT, sw: 2.2 }); on2.circle(sx + sw / 2 - 30, sy + sh / 2 - 9, 4, SOLID(1));
      const scan = mvG(clipG(p, sx - sw / 2 + 18, sy - sh / 2 + 18, sw - 36, sh - 36), { y: [[0, 0], [H - tu(.2), 0], [H + tu(.2), sh - 36, 'lin']], o: [[0, 0], [H - tu(.2), 0], [H - tu(.18), 1], [H + tu(.18), 1], [H + tu(.2), 0]] }); scan.line(sx - sw / 2 + 18, sy - sh / 2 + 18, sx + sw / 2 - 18, sy - sh / 2 + 18, W(2));
      if (!Q.F) R(outG(tv, H - tu(.2)), sx - sw / 2 + 18, sy - sh / 2 + 18, sw - 36, sh - 36, 10, S(1.6));
      if (Q.F) { haloH(p, sx, sy - 10, 110, H); put(p, c, Q.F, sx, sy - 14, 120, sy + 92, { t: H - tu(.04), maxW: 260, size: 30, wrap: null }); }
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
