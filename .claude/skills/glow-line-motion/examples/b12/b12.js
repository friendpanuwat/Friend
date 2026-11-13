/* b12.js — category B12 "เหตุ → ผล": 20 neutral designs (stills first — the user picks, then motion).
   CutPack CATEGORIES.md B12 (references/cutpack-CATEGORIES.md, cat_ai.py): items [THING ×3] = three links of the chain, in order ·
   end THING (optional) = the sign of the result. "แรงส่งเดินทางทางเดียว ทอดแรกทำให้ทอดถัดไปขยับ — เห็นว่าเกิดต่อกันเอง ไม่ใช่วางเรียงเฉย ๆ".
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

  /* 01 ── NODES: three round nodes on one line; the light runs from node to node (each segment's arrow says which way) to the end */
  variant('nodes', 'จุดต่อจุด', (d, c) => { const S0 = st(d), X = S0.E ? [-370, -130, 110] : [-320, 0, 320], y = -10, r = 80;
    art(c, p => { const xe = S0.E ? 380 : X[2];
      glowP(p, [[-470, y], [X[0] - r, y]], 3); p.circle(-470, y, 9, SOLID());
      for (let i = 0; i < (S0.E ? 3 : 2); i++) { const a = X[i] + r, b = (i < 2 ? X[i + 1] - r : xe - 86), m = (a + b) / 2; glowP(p, [[a, y], [b, y]]); p.poly([[m - 8, y - 12], [m + 6, y], [m - 8, y + 12]], W(3)); }
      X.forEach((x, i) => { if (i === 2) lastHalo(p, S0, x, y, r + 30); p.circle(x, y, r, F(3.4)); p.circle(x, y, r - 12, S(1.6)); thing(p, c, S0, i, x, y, 84, y + r + 46); });
      endAt(p, c, S0, xe, y, 86, y + 140);
    }); });

  /* 02 ── CARDS: three cards in a row, an arrow from each to the next; the last card is the outcome */
  variant('cards', 'การ์ดต่อการ์ด', (d, c) => { const S0 = st(d), X = S0.E ? [-360, -120, 120] : [-310, 0, 310], y = -20, w = 190, h = 250;
    art(c, p => {
      X.forEach((x, i) => { if (i === 2) lastHaloR(p, S0, x, y, w, h, 20); card(p, x, y, w, h); tile(p, x, y - 22, 100, F(2.8));
        thing(p, c, S0, i, x, y - 22, 70, y + 78, { maxW: w - 30, size: 30, wrap: null }); p.line(x - 50, y + 100, x + 50, y + 100, S(2));
        if (i < 2 || S0.E) arrowP(p, [[x + w / 2 + 12, y], [(i < 2 ? X[i + 1] : 370) - (i < 2 ? w / 2 : 72) - 12, y]]); });
      endAt(p, c, S0, 385, y, 66, y + 110);
    }); });

  /* 03 ── FLOW LIST: one card, three rows; a rail on the left joins the rows top to bottom, the last row is lit, the outcome comes out of it */
  variant('flowlist', 'รายการไหลต่อกัน', (d, c) => { const S0 = st(d), ox = S0.E ? -90 : 0, Y = [-150, -5, 140];
    art(c, p => { card(p, ox, -10, 440, 470);
      for (let i = 0; i < 2; i++) arrowP(p, [[ox - 140, Y[i] + 50], [ox - 140, Y[i + 1] - 50]], W(3), 13);
      Y.forEach((y, i) => { const last = i === 2;
        R(p, ox - 200, y - 58, 400, 116, 16, last ? { fill: LIT, sw: 3 } : S(1.8)); tile(p, ox - 140, y, 84, F(3));
        thing(p, c, S0, i, ox - 140, y, 58, null); const it = itOf(S0, i);
        if (it && it.label && picOf(it)) txt(atG(p, tu(.2 + .1 * i)), it.label, ox - 80, y + 11, { maxW: 250, color: C.ink, weight: 700, size: 32, anchor: 'start' });
        else p.line(ox - 80, y, ox + 60, y, S(2));
        if (last && !S0.E) { p.circle(ox + 160, y, 18, SOLID()); p.poly([[ox + 151, y], [ox + 158, y + 8], [ox + 170, y - 7]], { sw: 3.4, stroke: C.fill }); } });
      if (S0.E) { arrowP(p, [[ox + 200, Y[2]], [ox + 300, Y[2]]]); endAt(p, c, S0, 385, Y[2], 62, Y[2] + 104); }
    }); });

  /* 04 ── STEPS DOWN: three small cards step down to the right, each joined to the next by an elbow line */
  variant('stairs', 'การ์ดขั้นบันไดต่อกัน', (d, c) => { const S0 = st(d), P = S0.E ? [[-330, -200], [-90, -30], [150, 140]] : [[-270, -190], [0, 0], [270, 190]], w = 230, h = 120;
    art(c, p => {
      for (let i = 0; i < 2; i++) { const [x, y] = P[i], [x2, y2] = P[i + 1]; arrowP(p, [[x + w / 2, y], [x2, y], [x2, y2 - h / 2 - 8]], W(3), 14); p.circle(x + w / 2, y, 6, SOLID(1)); }
      P.forEach(([x, y], i) => { if (i === 2) lastHaloR(p, S0, x, y, w, h, 18); card(p, x, y, w, h, { head: false, rx: 18 }); tile(p, x - 62, y, 82, F(2.8)); thing(p, c, S0, i, x - 62, y, 56, null);
        const it = itOf(S0, i); if (it && it.label && picOf(it)) txt(atG(p, tu(.2 + .1 * i)), it.label, x + 42, y + 11, { maxW: 110, color: C.ink, weight: 700, size: 30 }); else { p.line(x + 5, y - 10, x + 85, y - 10, S(2)); p.line(x + 5, y + 14, x + 60, y + 14, S(2)); } });
      if (S0.E) { const [x, y] = P[2]; arrowP(p, [[x + w / 2, y], [330, y]]); endAt(p, c, S0, 395, y, 58, y - 90); }
    }); });

  /* 05 ── TOGGLE: the switch on the first panel flips on, the current runs along the wire and lights tile 2, then tile 3 */
  variant('toggle', 'สวิตช์เปิดต่อกัน', (d, c) => { const S0 = st(d), X = S0.E ? [-340, -80, 160] : [-310, 0, 300], y = -20;
    art(c, p => {
      const seg = [[X[0] + 100, y + 60], [X[0] + 140, y + 60], [X[0] + 140, y], [X[1] - 80, y]];
      glowP(p, seg); glowP(p, [[X[1] + 80, y], [X[2] - 80, y]]); if (S0.E) glowP(p, [[X[2] + 80, y], [330, y]]);
      [[X[0] + 140, y + 60], [X[0] + 140, y]].forEach(([a, b]) => p.circle(a, b, 7, F(2.2)));
      card(p, X[0], y, 200, 270, { rx: 22 }); tile(p, X[0], y - 40, 92, F(2.8)); thing(p, c, S0, 0, X[0], y - 40, 62, y + 180);
      R(p, X[0] - 60, y + 34, 120, 56, 28, { fill: LIT, sw: 3 }); p.circle(X[0] + 32, y + 62, 22, SOLID());
      [1, 2].forEach(i => { const x = X[i]; if (i === 2) lastHaloR(p, S0, x, y, 160, 160, 38); tile(p, x, y, 160, { fill: LIT, sw: 3.4 }); R(p, x - 66, y - 66, 132, 132, 30, S(1.6)); thing(p, c, S0, i, x, y, 90, y + 180);
        [-1, 1].forEach(sd => p.line(x + sd * 96, y - 96, x + sd * 112, y - 112, W(2.4))); });
      endAt(p, c, S0, 395, y, 62, y + 120);
    }); });

  /* 06 ── CLICK: the cursor clicks the first card's button, card 2 pops up over it, card 2's button brings up card 3 */
  variant('click', 'คลิกแล้วเด้งต่อกัน', (d, c) => { const S0 = st(d), P = S0.E ? [[-290, -120], [-40, 10], [210, 140]] : [[-250, -130], [0, 0], [250, 130]], w = 230, h = 170;
    art(c, p => {
      P.forEach(([x, y], i) => { if (i === 2) lastHaloR(p, S0, x, y, w, h, 20); card(p, x, y, w, h, { head: false }); tile(p, x - 62, y - 22, 80, F(2.8)); thing(p, c, S0, i, x - 62, y - 22, 54, null);
        const it = itOf(S0, i); if (it && it.label && picOf(it)) txt(atG(p, tu(.2 + .1 * i)), it.label, x + 45, y - 12, { maxW: 110, color: C.ink, weight: 700, size: 28 }); else p.line(x, y - 22, x + 80, y - 22, S(2));
        R(p, x - 90, y + 36, 180, 36, 18, i < 2 ? SOLID(2) : S(2)); });
      const [cx, cy] = [P[0][0] + 30, P[0][1] + 58]; shape(p, [[cx, cy], [cx, cy + 62], [cx + 15, cy + 48], [cx + 26, cy + 72], [cx + 36, cy + 67], [cx + 25, cy + 44], [cx + 45, cy + 44]], F(3));
      [[-1, -1], [0, -1.3], [-1.3, 0]].forEach(([a, b]) => p.line(cx + a * 18, cy + b * 18, cx + a * 32, cy + b * 32, W(2.4)));
      if (S0.E) endAt(p, c, S0, 405, -170, 58, -78);
    }); });

  /* 07 ── SLIDERS: three linked sliders — moving the first pushes the second further, the second pushes the third all the way */
  variant('sliders', 'แถบเลื่อนตามกัน', (d, c) => { const S0 = st(d), ox = S0.E ? -95 : 0, Y = [-140, 0, 140], v = [.45, .7, 1];
    art(c, p => { card(p, ox, 0, 600, 430);
      Y.forEach((y, i) => { tile(p, ox - 230, y, 82, F(2.8)); thing(p, c, S0, i, ox - 230, y, 56, null); const a = ox - 165, b = ox + 215, k = lerp(a, b, v[i]);
        const it = itOf(S0, i); if (it && it.label && picOf(it)) txt(atG(p, tu(.2 + .1 * i)), it.label, a, y - 14, { maxW: 240, color: C.ink, weight: 700, size: 28, anchor: 'start' }); else p.line(a, y - 22, a + 90, y - 22, S(2));
        R(p, a, y + 14, b - a, 14, 7, F(2.2)); R(p, a, y + 14, k - a, 14, 7, SOLID(1.6)); if (i === 2) halo(p, k, y + 21, 36); p.circle(k, y + 21, 18, SOLID());
        if (i < 2) arrowP(p, [[ox + 250, y + 30], [ox + 268, y + 70], [ox + 250, Y[i + 1] - 10]], W(2.6), 12); });
      if (S0.E) { arrowP(p, [[ox + 300, Y[2] + 20], [330, Y[2] + 20]]); endAt(p, c, S0, 392, Y[2] - 20, 58, Y[2] - 115); }
    }); });

  /* 08 ── RINGS: ring 1 fills up and passes it on, ring 2 fills, ring 3 fills — each arrow hands the full ring on to the next */
  variant('rings', 'วงเติมเต็มต่อกัน', (d, c) => { const S0 = st(d), X = S0.E ? [-360, -120, 120] : [-310, 0, 310], y = -20, r = 86;
    art(c, p => {
      X.forEach((x, i) => { if (i === 2) lastHalo(p, S0, x, y, r + 34); ring(p, x, y, r + 10, r - 10, F(2.6)); p.circle(x, y, r, { sw: 9 }); p.circle(x, y, r - 22, S(1.4));
        p.circle(x, y - r, 11, SOLID()); thing(p, c, S0, i, x, y, 80, y + r + 56);
        if (i < 2 || S0.E) arrowP(p, [[x + r + 18, y], [(i < 2 ? X[i + 1] - r : 385 - 66) - 18, y]]); });
      endAt(p, c, S0, 385, y, 62, y + 108);
    }); });

  /* 09 ── GRID PATH: a board of squares; the line enters, turns through link 1, 2, 3 and stops on the outcome square */
  variant('grid', 'ทางเดินบนตาราง', (d, c) => { const S0 = st(d), cs = 130, cx = k => -390 + 65 + cs * k, cy = k => -260 + 65 + cs * k;
    art(c, p => { R(p, -400, -270, 800, 540, 22, F(3.4)); for (let k = 1; k < 6; k++) p.line(-390 + cs * k, -260, -390 + cs * k, 260, S(1.3)); for (let k = 1; k < 4; k++) p.line(-390, -260 + cs * k, 390, -260 + cs * k, S(1.3));
      const A = [cx(1), cy(0)], B = [cx(2), cy(2)], Cc = [cx(4), cy(1)], E = [cx(5), cy(3)];
      const path = [[-430, cy(0)], A, [cx(2), cy(0)], B, [cx(4), cy(2)], Cc]; if (S0.E) path.push([cx(5), cy(1)], E);
      glowP(p, path, 5); p.circle(-430, cy(0), 9, SOLID());
      [A, B, Cc].forEach(([x, y], i) => { if (i === 2) lastHaloR(p, S0, x, y, 108, 108, 26, 12); tile(p, x, y, 108, F(3.2)); thing(p, c, S0, i, x, y - 14, 50, y + 40, { maxW: 98, size: 21, wrap: null }); });
      if (S0.E) { tile(p, E[0], E[1], 112, { fill: LIT, sw: 3.4 }); halo(p, E[0], E[1], 84); thing(p, c, S0, 3, E[0], E[1] - 14, 52, E[1] + 40, { maxW: 98, size: 21, wrap: null }); }
    }); });

  /* 10 ── CHIPS: three capsule chips in a zigzag, joined by smooth S-curves; the last chip leads to the outcome */
  variant('chips', 'ชิปต่อเส้นโค้ง', (d, c) => { const S0 = st(d), P = S0.E ? [[-230, -200], [80, -20], [-170, 160]] : [[-180, -190], [150, 0], [-120, 190]], w = 310, h = 100;
    art(c, p => {
      for (let i = 0; i < 2; i++) { const [x, y] = P[i], [x2, y2] = P[i + 1], a = i === 0 ? [x + w / 2, y] : [x - w / 2, y], b = i === 0 ? [x2 - w / 2 + 40, y2 - h / 2] : [x2 + w / 2 - 40, y2 - h / 2];
        const k = i === 0 ? 1 : -1; p.path(`M ${a[0]} ${a[1]} C ${a[0] + k * 120} ${a[1]}, ${b[0]} ${b[1] - 90}, ${b[0]} ${b[1] - 8}`, W(3)); p.poly([[b[0] - 11, b[1] - 20], [b[0], b[1] - 6], [b[0] + 11, b[1] - 20]], W(3)); p.circle(...a, 6, SOLID(1)); }
      P.forEach(([x, y], i) => { if (i === 2) lastHaloR(p, S0, x, y, w, h, h / 2); R(p, x - w / 2, y - h / 2, w, h, h / 2, F(3.2)); p.circle(x - w / 2 + 52, y, 36, F(2.8)); thing(p, c, S0, i, x - w / 2 + 52, y, 50, null);
        const it = itOf(S0, i); if (it && it.label && picOf(it)) txt(atG(p, tu(.2 + .1 * i)), it.label, x + 35, y + 12, { maxW: 190, color: C.ink, weight: 700, size: 32 }); else { p.line(x - 30, y - 8, x + 100, y - 8, S(2)); p.line(x - 30, y + 14, x + 60, y + 14, S(2)); } });
      if (S0.E) { const [x, y] = P[2]; arrowP(p, [[x + w / 2 + 12, y], [320, y]]); endAt(p, c, S0, 390, y, 60, y - 100); }
    }); });

  /* 11 ── KNOB, METER, LAMP: the knob (link 1) is turned up, the meter (link 2) climbs, the lamp (link 3) lights */
  variant('knob', 'ปุ่มหมุน แถบ ไฟ', (d, c) => { const S0 = st(d), X = S0.E ? [-330, -60, 170] : [-300, 0, 300], y = -20;
    art(c, p => {
      glowP(p, [[X[0] + 115, y], [X[1] - 62, y]]); glowP(p, [[X[1] + 62, y], [X[2] - 92, y]]); if (S0.E) glowP(p, [[X[2] + 92, y], [330, y]]);
      const x0 = X[0]; for (let a = -135; a <= 135; a += 27) { const u = rad(a - 90); p.line(x0 + Math.cos(u) * 104, y + Math.sin(u) * 104, x0 + Math.cos(u) * 118, y + Math.sin(u) * 118, a <= 108 ? W(3) : S(2)); }
      p.circle(x0, y, 90, F(3.4)); p.circle(x0, y, 70, S(1.6)); const u = rad(108 - 90); p.line(x0 + Math.cos(u) * 74, y + Math.sin(u) * 74, x0 + Math.cos(u) * 88, y + Math.sin(u) * 88, W(5));
      thing(p, c, S0, 0, x0, y, 74, y + 170);
      const x1 = X[1]; R(p, x1 - 58, y - 150, 116, 300, 18, F(3.2)); for (let k = 0; k < 6; k++) R(p, x1 - 38, y + 100 - k * 40, 76, 28, 6, k < 5 ? SOLID(1.6) : S(1.8));
      R(p, x1 - 50, y - 250, 100, 84, 18, F(2.8)); thing(p, c, S0, 1, x1, y - 208, 58, y + 190);
      const x2 = X[2]; if (true) lastHalo(p, S0, x2, y, 128); p.circle(x2, y, 88, { fill: LIT, sw: 3.6 }); p.circle(x2, y, 66, S(1.6)); R(p, x2 - 30, y + 88, 60, 40, 8, F(2.8));
      for (let a = 0; a < 360; a += 45) { const v = rad(a); if (a === 90) continue; p.line(x2 + Math.cos(v) * 104, y + Math.sin(v) * 104, x2 + Math.cos(v) * 124, y + Math.sin(v) * 124, W(2.6)); }
      thing(p, c, S0, 2, x2, y, 80, y + 190);
      endAt(p, c, S0, 395, y, 58, y + 108);
    }); });

  /* 12 ── BEAD TUBE: the plunger pushes into the clear tube — bead 1 pushes bead 2, bead 2 pushes bead 3 out of the open end */
  variant('beads', 'ลูกปัดดันในหลอดใส', (d, c) => { const S0 = st(d), y = 0, r = 54;
    art(c, p => { const t0 = -360, t1 = 250;
      R(p, t0, y - 66, t1 - t0, 132, 66, { fill: GLASS, sw: 3.4 }); p.line(t0 + 40, y - 44, t1 - 50, y - 44, S(1.6));
      [t0 + 70, t1 - 70].forEach(x => { p.line(x, y + 66, x, 200, W(3)); R(p, x - 44, 200, 88, 16, 6, F(2.6)); });
      R(p, -480, y - 10, 400, 20, 6, F(2.6)); R(p, -500, y - 50, 24, 100, 8, F(3)); R(p, -82, y - 56, 22, 112, 8, F(3));
      const X = [0, 108, 360]; X.forEach((x, i) => { if (i === 2) lastHalo(p, S0, x, y, r + 30); p.circle(x, y, r, F(3.4)); thing(p, c, S0, i, x, y, 70, y + 140); });
      [[t1 + 16, -30], [t1 + 24, 0], [t1 + 16, 30]].forEach(([x, yy]) => p.line(x, y + yy, x + 26, y + yy, S(2)));
      if (S0.E) endAt(p, c, S0, 360, -200, 58, null), labT(p, S0, 3, 230, -200, { maxW: 150 });
    }); });

  /* 13 ── GROWING TILES: three tiles, each bigger than the one before, with chevrons between — one thing leads to a bigger one */
  variant('grow', 'ใหญ่ขึ้นทีละทอด', (d, c) => { const S0 = st(d), sz = [120, 165, 220], X = S0.E ? [-370, -170, 70] : [-330, -90, 210], by = 130;
    art(c, p => { p.line(-470, by + 14, 470, by + 14, S(1.8));
      X.forEach((x, i) => { const s = sz[i], y = by - s / 2; if (i === 2) lastHalo(p, S0, x, y, s * .7 + 10); tile(p, x, y, s, F(3.4)); p.circle(x - s / 2 + 22, y - s / 2 + 22, 5, S(1.6));
        thing(p, c, S0, i, x, y, s * .58, by + 62, { maxW: Math.max(170, s) });
        if (i < 2 || S0.E) { const xa = x + s / 2 + 16, xb = (i < 2 ? X[i + 1] - sz[i + 1] / 2 : 300) - 16, m = (xa + xb) / 2; [-14, 8].forEach(o => p.poly([[m + o - 8, by - 64 - 16], [m + o + 6, by - 64], [m + o - 8, by - 64 + 16]], W(3.4))); } });
      endAt(p, c, S0, 385, by - 120, 76, by + 62);
    }); });

  /* 14 ── DOORS: the first door is pushed open, it swings into the second and opens it, the second opens the third */
  variant('doors', 'ประตูเปิดดันกันต่อ', (d, c) => { const S0 = st(d), X = S0.E ? [-355, -115, 125] : [-290, 0, 290], fy = 220, w = 130, h = 280;
    art(c, p => { p.line(-480, fy, 480, fy, S(2));
      X.forEach((x, i) => { const L = x - w / 2, T = fy - h; if (i === 2) lastHaloR(p, S0, x + 24, fy - h / 2 - 7, w + 90, h + 14, 10, 18);
        R(p, L - 14, T - 14, w + 28, h + 14, 8, F(3)); R(p, L, T, w, h, 4, { fill: LIT, sw: 2.2 });
        shape(p, [[L + w, T], [L + w + 62, T + 26], [L + w + 62, fy - 8], [L + w, fy]], F(3.2)); p.circle(L + w + 50, fy - h / 2, 5, SOLID(1));
        p.path(`M ${L} ${fy} L ${L + w} ${fy} L ${L + w + 40} ${fy + 50} L ${L - 30} ${fy + 50} Z`, { fill: 'rgba(255,255,255,.08)', sw: 0, stroke: 'none' });
        thing(p, c, S0, i, x - 6, fy - h / 2, 80, fy + 92); });
      if (S0.E) endAt(p, c, S0, 395, fy - h / 2, 58, fy + 92);
    }); });

  /* 15 ── BLOCKS ON A TABLE: the ball rolls in and knocks block 1, which shoves block 2, which tips block 3 off the edge into the box */
  variant('blocks', 'บล็อกดันกันตกกล่อง', (d, c) => { const S0 = st(d), ty = 120, s = 130;
    art(c, p => { R(p, -480, ty, 640, 20, 6, F(3)); [-440, 120].forEach(x => p.line(x, ty + 20, x, 300, W(3)));
      p.circle(-420, ty - 34, 34, F(3.2)); p.path(`M -470 ${ty - 34} l -24 0 M -466 ${ty - 56} l -18 -8 M -466 ${ty - 12} l -18 8`, S(2));
      const blk = (x, y, a, i) => { const g = rot(p, a, x, y); shape(g, [[x - s / 2, y - s / 2], [x - s / 2 + 20, y - s / 2 - 18], [x + s / 2 + 20, y - s / 2 - 18], [x + s / 2, y - s / 2]], F(2.6)); R(g, x - s / 2, y - s / 2, s, s, 12, F(3.4)); thing(p, c, S0, i, x, y, 84, null, { r: a }); };
      blk(-260, ty - s / 2, 0, 0); blk(-125, ty - s / 2, 0, 1);
      lastHalo(p, S0, 230, 135, 110); blk(230, 120, 28, 2);
      p.path(`M 120 ${ty + 30} Q 190 ${ty - 30} 228 50`, S(1.6));
      R(p, 150, 210, 200, 90, 8, F(3.2)); shape(p, [[150, 210], [120, 176], [150, 186]], F(2.4)); shape(p, [[350, 210], [380, 176], [350, 186]], F(2.4));
      labT(p, S0, 0, -260, ty + 66); labT(p, S0, 1, -110, ty + 66); labT(p, S0, 2, 250, 340, { maxW: 200 });
      endAt(p, c, S0, 400, -100, 60, 5);
    }); });

  /* 16 ── POWER STRIP: the plug (link 1) goes in, the strip's lights come on socket by socket, the last socket powers link 3 */
  variant('strip', 'ปลั๊กพ่วงไฟวิ่ง', (d, c) => { const S0 = st(d), y = 120, x0 = -300, x1 = S0.E ? 190 : 300;
    art(c, p => {
      R(p, x0, y - 50, x1 - x0, 100, 24, F(3.4)); R(p, x0 - 50, y - 26, 50, 52, 10, F(3)); tube(p, `M ${x0 - 50} ${y} L -470 ${y} L -470 300`, 14);
      const sx = [lerp(x0, x1, .22), lerp(x0, x1, .5), lerp(x0, x1, .78)];
      sx.forEach((x, i) => { p.circle(x, y, 26, F(2.6)); [-1, 1].forEach(sd => R(p, x + sd * 10 - 3, y - 8, 6, 16, 2, SOLID(1))); p.circle(x + 40, y - 30, 7, SOLID(1));
        const ty = -110, last = i === 2; if (last) lastHaloR(p, S0, x, ty, 120, 120, 29, 18);
        p.line(x, y - 26, x, ty + 66, last ? W(3.6) : S(2)); tile(p, x, ty, 120, i < 2 ? F(3.2) : { fill: LIT, sw: 3.4 });
        thing(p, c, S0, i, x, ty, 76, ty - 92, { maxW: 128, size: 30, wrap: 'up' }); });
      glowP(p, [[x0 + 20, y + 30], [x1 - 20, y + 30]], 3);
      if (S0.E) endAt(p, c, S0, 390, -110, 60, -10);
    }); });

  /* 17 ── STACKED BOXES: the ball drops into box 1, falls through its floor into box 2, then box 3, and rolls out to the end */
  variant('boxes', 'กล่องซ้อนลูกบอลหล่น', (d, c) => { const S0 = st(d), P = [[-150, -210], [-10, -30], [130, 150]], w = 220, h = 110;
    art(c, p => { p.line(-480, 300, 480, 300, S(1.8));
      p.path(`M ${P[0][0]} -340 L ${P[0][0]} ${P[0][1]} L ${P[1][0]} ${P[1][1]} L ${P[2][0]} ${P[2][1]} L ${P[2][0]} 278 L ${S0.E ? 330 : P[2][0] + 60} 278`, S(1.6));
      P.forEach(([x, y], i) => { if (i === 2) lastHaloR(p, S0, x, y - 14, w + 80, h + 40, 14, 14);
        shape(p, [[x - w / 2, y - h / 2], [x - w / 2 - 40, y - h / 2 - 36], [x - w / 2 + 20, y - h / 2 - 30]], F(2.6)); shape(p, [[x + w / 2, y - h / 2], [x + w / 2 + 40, y - h / 2 - 36], [x + w / 2 - 20, y - h / 2 - 30]], F(2.6));
        R(p, x - w / 2, y - h / 2, w, h, 8, F(3.4)); p.line(x - w / 2 + 14, y - h / 2 + 16, x + w / 2 - 14, y - h / 2 + 16, S(1.6));
        thing(p, c, S0, i, x, y + 6, 62, null); labT(p, S0, i, x - w / 2 - 90, y + 12, { maxW: 150, wrap: null }); });
      p.circle(S0.E ? 290 : P[2][0] + 60, 278, 22, SOLID());
      if (S0.E) endAt(p, c, S0, 390, 200, 58, 100);
    }); });

  /* 18 ── FAN, PINWHEEL, FLAG: the fan (link 1) blows, the pinwheel (link 2) spins and its breeze lifts the flag (link 3) */
  variant('fan', 'พัดลม กังหัน ธง', (d, c) => { const S0 = st(d), fy = 270, fx = -350, wx = -40, gx = S0.E ? 190 : 250;
    art(c, p => { p.line(-480, fy, 480, fy, S(2));
      p.line(fx, 100, fx, fy - 20, W(3)); p.ellipse(fx, fy - 12, 74, 13, F(2.6));
      [0, 120, 240].forEach(a => { const g = rot(p, a + 20, fx, 0); g.ellipse(fx, -54, 24, 44, S(2)); });
      ring(p, fx, 0, 104, 92); [0, 45, 90, 135].forEach(a => { const x = Math.cos(rad(a)), y = Math.sin(rad(a)); p.line(fx - x * 92, -y * 92, fx + x * 92, y * 92, S(1.2)); });
      p.circle(fx, 0, 46, F(3.2)); thing(p, c, S0, 0, fx, 0, 60, fy + 44);
      [-40, 10, 60].forEach((y, k) => p.path(`M ${fx + 125} ${y} q 30 -14 60 0 t 60 0`, k === 1 ? W(2.4) : S(2.2)));
      p.line(wx, -30, wx, fy, W(3.2));
      [0, 90, 180, 270].forEach(a => { const g = rot(p, a + 15, wx, -30); g.path(`M ${wx} -30 L ${wx} -140 Q ${wx + 60} -120 ${wx} -30 Z`, F(3)); });
      p.circle(wx, -30, 40, F(3.2)); thing(p, c, S0, 1, wx, -30, 52, fy + 44);
      [-110, -60].forEach((y, k) => p.path(`M ${wx + 110} ${y} q 30 -12 60 0 t 50 0`, k ? S(2.2) : W(2.4)));
      lastHalo(p, S0, gx + 80, -150, 110);
      p.line(gx, -240, gx, fy, W(3.4)); p.circle(gx, -246, 8, SOLID(1));
      p.path(`M ${gx} -230 C ${gx + 60} -260, ${gx + 110} -200, ${gx + 170} -225 L ${gx + 170} -85 C ${gx + 110} -60, ${gx + 60} -120, ${gx} -90 Z`, F(3.4)); thing(p, c, S0, 2, gx + 86, -155, 70, fy + 44, { lx: gx });
      endAt(p, c, S0, 400, 90, 58, 186);
    }); });

  /* 19 ── ROPE WAVE: a person flicks the rope — the wave runs along it, lifting link 1, 2, 3 in turn, and slaps into the post at the far end */
  variant('rope', 'สะบัดเชือกคลื่นวิ่ง', (d, c) => { const S0 = st(d), fy = 290, ry = 120, k = .8, px = -420;
    art(c, p => { floor(p, fy);
      const arm = { s: [4, -76], e: [44, -56], h: [86, -38] }; person(p, px, fy, k, arm, { leg: stride });
      const hd = pAt(px, fy, k, 86, -38), postX = 420, xc = 345, pts = [];
      for (let x = hd[0]; x <= postX; x += 8) { const u = (x - xc) / 52, w = 1 - Math.min(1, Math.max(0, (x - hd[0]) / 60)); pts.push([x, ry - 86 * Math.exp(-u * u) + (hd[1] - ry) * w]); }
      pts.push([postX, ry]); tube(p, pathOf(pts, false), 13);
      R(p, postX - 20, 40, 40, 250, 8, F(3.2)); p.circle(postX, ry, 15, F(2.6)); [-1, 1].forEach(sd => arcs(p, postX + 30, ry - 40, 1, 2, 18, 14, 40, W(2.4)));
      const X = [-200, 0, 200]; X.forEach((x, i) => { p.circle(x, ry, 56, F(3.2)); thing(p, c, S0, i, x, ry, 74, ry + 96, { maxW: 190 }); });
      [-1, 1].forEach(sd => { p.path(`M ${X[2] + sd * 70} ${ry - 64} q ${sd * 10} -10 ${sd * 22} -6`, S(2)); });
      if (!endAt(p, c, S0, postX, -100, 62, -200)) lastHalo(p, S0, X[2], ry, 84);
    }); });


  /* 20 ── BILLIARDS (seen from above): the cue strikes the white ball, it knocks link 1, link 1 knocks link 2, link 2 sends link 3 into the corner pocket */
  variant('billiards', 'บิลเลียดชนต่อกัน', (d, c) => { const S0 = st(d), ox = S0.E ? -80 : 0;
    art(c, p => { const cl = clipG(p, -500, -350, 1000, 700);
      R(p, ox - 380, -235, 760, 470, 46, F(3.4)); R(p, ox - 342, -197, 684, 394, 20, S(2));
      [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([a, b]) => p.circle(ox + a * 350, b * 205, 27, F(3)));
      [-1, 1].forEach(b => p.circle(ox, b * 214, 24, F(3)));
      [-.5, .5].forEach(a => [-1, 1].forEach(b => p.circle(ox + a * 360, b * 216, 4, SOLID(1))));
      const B = [[ox - 215, 135, 30], [ox - 115, 30, 62], [ox + 75, 70, 62], [ox + 265, -128, 60]], pk = [ox + 350, -205];
      [[B[0], B[1]], [B[1], B[2]], [B[2], B[3]], [B[3], [...pk, 0]]].forEach(([a, b]) => p.line(a[0], a[1], b[0], b[1], S(1.6)));
      lastHalo(p, S0, B[3][0], B[3][1], 92);
      p.circle(B[0][0], B[0][1], 30, F(3)); p.circle(B[0][0] - 9, B[0][1] - 9, 5, SOLID(1));
      { const tp = [B[0][0] - 40, B[0][1] + 24], bt = [ox - 395, 222], L = Math.hypot(tp[0] - bt[0], tp[1] - bt[1]), ux = (tp[0] - bt[0]) / L, uy = (tp[1] - bt[1]) / L, nx = -uy, ny = ux;
        shape(cl, [[tp[0] + nx * 6, tp[1] + ny * 6], [tp[0] - nx * 6, tp[1] - ny * 6], [bt[0] - nx * 13, bt[1] - ny * 13], [bt[0] + nx * 13, bt[1] + ny * 13]], F(3));
        cl.line(tp[0] - ux * 40 + nx * 8, tp[1] - uy * 40 + ny * 8, tp[0] - ux * 40 - nx * 8, tp[1] - uy * 40 - ny * 8, W(2)); }
      [1, 2, 3].forEach(i => { const [x, y, r] = B[i]; p.circle(x, y, r, F(3.2)); thing(p, c, S0, i - 1, x, y, r * 1.3, y + r + 38, { maxW: 200, size: 32 }); });
      endAt(p, c, S0, 395, -40, 62, 70);
    }); });


  /* ---------- sample data (A: sentences from unrelated topics · B: stress) ---------- */
  const I = (icon, label) => label ? { icon, label } : { icon };
  const SAMPLES = [
    { say: 'นอนดึก ตื่นสาย เลยตกรถ', items: [I('moon', 'นอนดึก'), I('alarm-clock', 'ตื่นสาย'), I('bus', 'ตกรถ')], end: I('x') },
    { say: 'ฝนตก ถนนลื่น รถชนกัน', items: [I('droplets', 'ฝนตก'), I('triangle-alert', 'ถนนลื่น'), I('car', 'รถชน')] },
    { say: 'รดน้ำทุกวัน ต้นไม้เลยออกดอก', items: [I('droplet', 'รดน้ำ'), I('sprout', 'ต้นโต'), I('flower', 'ออกดอก')], end: I('check') },
    { say: 'ลูกค้าพอใจ บอกต่อ ยอดเพิ่ม', items: [I('smile', 'พอใจ'), I('megaphone', 'บอกต่อ'), I('trending-up', 'ยอดเพิ่ม')], end: I('check') },
    { say: 'รูดบัตร ดอกเบี้ยทบ หนี้ท่วม', items: [I('credit-card', 'รูดบัตร'), I('percent', 'ดอกเบี้ย'), I('trending-down', 'หนี้ท่วม')], end: I('x') },
    { say: 'ซ้อมทุกวัน มือนิ่ง เล่นสด ไม่พลาด', items: [I('repeat', 'ซ้อม'), I('target', 'มือนิ่ง'), I('mic', 'เล่นสด')], end: I('check') },
    { say: 'ดื่มน้ำน้อย ปวดหัว ทำงานไม่ไหว', items: [I('glass-water', 'ดื่มน้อย'), I('heart-crack', 'ปวดหัว'), I('briefcase', 'ไม่ไหว')] },
    { say: 'เก็บเงินได้ ลงทุนต่อ ดอกผลงอกเงย', items: [I('piggy-bank', 'เก็บเงิน'), I('chart-line', 'ลงทุน'), I('coins', 'งอกเงย')], end: I('trending-up') },
    { say: 'ไม่ตอบแชต เขาน้อยใจ เลยทะเลาะกัน', items: [I('message-circle', 'ไม่ตอบ'), I('frown', 'น้อยใจ'), I('angry', 'ทะเลาะ')], end: I('heart-crack') },
    { say: 'ปิดไฟก่อนนอน หลับลึก ตื่นสดชื่น', items: [I('lightbulb-off', 'ปิดไฟ'), I('bed', 'หลับลึก'), I('sunrise', 'สดชื่น')] },
    { say: 'โพสต์คลิปดี คนแชร์ ยอดวิวพุ่ง', items: [I('video', 'คลิปดี'), I('share-2', 'คนแชร์'), I('eye', 'ยอดวิว')], end: I('trending-up') },
    { say: 'น้ำมันขึ้น ค่าส่งแพง ของแพงตาม', items: [I('droplet', 'น้ำมัน'), I('truck', 'ค่าส่ง'), I('shopping-cart', 'ของแพง')], end: I('trending-up') },
    { say: 'อ่านทุกวัน ความรู้เพิ่ม สอบผ่าน', items: [I('book-open', 'อ่าน'), I('brain', 'ความรู้'), I('graduation-cap', 'สอบผ่าน')], end: I('check') },
    { say: 'ลืมปิดแก๊ส หม้อไหม้ ควันเต็มบ้าน', items: [I('cooking-pot', 'ลืมปิด'), I('triangle-alert', 'หม้อไหม้'), I('house', 'ควันเต็ม')], end: I('x') },
    { say: 'ยิ้มให้ก่อน เขายิ้มตอบ บรรยากาศดี', items: [I('smile', 'ยิ้มก่อน'), I('smile', 'ยิ้มตอบ'), I('users', 'บรรยากาศ')] },
    { say: 'ลดราคา คนแห่มา ของหมด', items: [I('badge-percent', 'ลดราคา'), I('users', 'คนแห่มา'), I('package-open', 'ของหมด')], end: I('check') },
    { say: 'ตากฝน เป็นหวัด หยุดงาน', items: [I('umbrella', 'ตากฝน'), I('thermometer', 'เป็นหวัด'), I('bed', 'หยุดงาน')] },
    { say: 'ฝึกพูดทุกวัน มั่นใจขึ้น ได้งาน', items: [I('mic', 'ฝึกพูด'), I('sparkles', 'มั่นใจ'), I('briefcase', 'ได้งาน')], end: I('check') },
    { say: 'กดสวิตช์ ไฟเข้า เครื่องทำงาน', items: [I('power', 'กดสวิตช์'), I('zap', 'ไฟเข้า'), I('cog', 'ทำงาน')] },
    { say: 'ใส่ใจรายละเอียด งานดี ลูกค้ากลับมา', items: [I('search', 'ใส่ใจ'), I('award', 'งานดี'), I('repeat', 'กลับมา')], end: I('heart') },
  ];
  const STRESS = [
    { say: 'ไม่มีป้ายเลย', items: [I('zap'), I('cog'), I('house')], end: I('x') },
    { say: 'ป้ายยาว', items: [I('moon', 'นอนดึกทุกคืนเป็นเดือน'), I('battery-low', 'ร่างกายอ่อนเพลียมาก'), I('heart-pulse', 'ต้องเข้าโรงพยาบาล')], end: I('triangle-alert', 'ป่วยหนัก') },
    { say: 'ภาษาอังกฤษ', items: [I('code', 'Bug'), I('database', 'Crash'), I('users', 'Users leave')], end: I('trending-down', 'Churn') },
    { say: 'ไม่มีไอคอน (ป้ายแทนภาพ)', items: [{ label: 'เหตุ' }, { label: 'ต่อ' }, { label: 'ผล' }], end: { label: 'จบ' } },
    { say: 'ไม่มี end', items: [I('sprout', 'ปลูก'), I('droplet', 'รดน้ำ'), I('apple', 'ออกผล')] },
    { say: 'ชื่อไอคอนที่ไม่มี', items: [I('no-such-icon', 'ตอนแรก'), I('no-such-icon', 'ตอนกลาง'), I('no-such-icon', 'ตอนท้าย')], end: I('no-such-icon') },
    { say: 'ไอคอนซ้ำ ไม่มีป้าย', items: [I('coins'), I('coins'), I('coins')], end: I('trending-up') },
    { say: 'end มีป้าย', items: [I('dumbbell', 'ออกกำลัง'), I('heart-pulse', 'หัวใจแข็งแรง'), I('smile', 'อารมณ์ดี')], end: I('check', 'สุขภาพดี') },
    { say: 'ขาดทอดกลาง', items: [I('siren', 'ไฟไหม้'), {}, I('house', 'บ้านพัง')], end: I('x') },
    { say: 'อังกฤษยาว', items: [I('megaphone', 'Word of mouth'), I('users', 'More customers'), I('store', 'Second branch')], end: I('check') },
    { say: 'ป้ายสั้นมาก', items: [I('cloud', 'ฝน'), I('droplets', 'ท่วม'), I('car', 'ติด')] },
    { say: 'ตัวเลขในป้าย', items: [I('coins', '100'), I('coins', '1,000'), I('coins', '10,000')], end: I('trending-up') },
    { say: 'ป้ายแทนภาพยาว', items: [{ label: 'เปลี่ยนรูปปก' }, { label: 'คนกดดูเพิ่ม' }, { label: 'ยอดวิวพุ่ง' }] },
    { say: 'end ป้ายอย่างเดียว', items: [I('book-open', 'อ่าน'), I('brain', 'เข้าใจ'), I('pen-line', 'เขียนได้')], end: { label: 'เก่งขึ้น' } },
    { say: 'ไม่มีป้าย ไม่มี end', items: [I('sun'), I('cloud'), I('droplets')] },
    { say: 'ผลร้าย', items: [I('cigarette-off', 'สูบบุหรี่'), I('heart-crack', 'ปอดพัง'), I('hospital', 'โรงพยาบาล')], end: I('x') },
    { say: 'ทอดเป็นการกระทำ', items: [I('send', 'ส่ง'), I('mail', 'ถึง'), I('message-circle', 'ตอบ')], end: I('check') },
    { say: 'ทอดเป็นสภาพ', items: [I('thermometer', 'ร้อน'), I('droplets', 'เหงื่อออก'), I('battery-low', 'เพลีย')] },
    { say: 'ทอดว่างทั้งหมด + end', items: [{}, {}, {}], end: I('check') },
    { say: 'ป้ายผสมไทยอังกฤษ', items: [I('wifi', 'เน็ตล่ม'), I('laptop', 'Zoom หลุด'), I('users', 'ประชุมพัง')], end: I('frown', 'แย่') },
  ];

  G.cats = G.cats || {};
  G.cats.B12 = { variants: V, SAMPLES, STRESS, draw: (i, d, c) => { setZ(c); CUR = V[i].id; V[i].build(d, c); }, CLAMPS, timing: c => (setZ(c), Object.assign({}, Z)) };
})();
