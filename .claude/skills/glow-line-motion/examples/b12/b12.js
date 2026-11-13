/* b12.js — category B12 "เหตุ → ผล": 20 neutral designs (stills first — the user picks, then motion).
   CutPack CATEGORIES.md B12 (references/cutpack-CATEGORIES.md, cat_ai.py): items [THING ×3] = three links of the chain, in order ·
   end THING (optional) = the sign of the result. "แรงส่งเดินทางทางเดียว ทอดแรกทำให้ทอดถัดไปขยับ — เห็นว่าเกิดต่อกันเอง ไม่ใช่วางเรียงเฉย ๆ".
   Every design is a real thing whose own mechanism passes the push on (B09–B11 rules: new things — no dominoes, gears, Newton's cradle,
   ramps, catapults, pulleys, conveyors, cascades, taps/pipes, snowballs, seesaws, matches, hammer-and-crack — all used before or cut;
   the result comes out of the thing's own mechanism; the layouts differ from design to design).
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

  const V = [];
  const variant = (id, th, build) => V.push({ id, th, build });

  /* 01 ── BILLIARDS (seen from above): the cue strikes the white ball, it knocks link 1, link 1 knocks link 2, link 2 sends link 3 into the corner pocket */
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

  /* 02 ── TUNING FORKS: the mallet strikes fork 1 — its ring sets fork 2 humming, fork 2 sets fork 3 ringing loudest */
  variant('forks', 'ส้อมเสียงก้องต่อกัน', (d, c) => { const S0 = st(d), X = S0.E ? [-300, -50, 200] : [-290, 0, 290], fy = 250;
    art(c, p => { floor(p, fy);
      X.forEach((x, i) => { const top = -130 + i * 0 - [0, 15, 30][i];
        R(p, x - 105, 140, 210, 110, 10, F(3.2)); R(p, x - 105, 140, 210, 14, 6, S(1.8));
        R(p, x - 8, 108, 16, 34, 4, F(2.4));
        tube(p, `M ${x - 28} ${top} L ${x - 28} 82 Q ${x - 28} 110 ${x} 110 Q ${x + 28} 110 ${x + 28} 82 L ${x + 28} ${top}`, 17);
        const vib = i === 2 ? W(2.8) : S(2.2); [-1, 1].forEach(sd => arcs(p, x + sd * 34, top + 60, sd, i === 2 ? 3 : 2, 22, 16, 32, vib));
        thing(p, c, S0, i, x, 196, 78, fy + 48, { maxW: 210 }); });
      lastHalo(p, S0, X[2], 195, 92);
      [0, 1].forEach(i => { const mx = (X[i] + X[i + 1]) / 2; arcs(p, mx - 40, -20, 1, 3, 30, 20, 30, S(2.2)); });
      const hx = X[0] - 120, hy = -40; tube(p, `M ${hx - 20} ${hy + 30} L ${hx - 110} ${hy + 170}`, 15); p.ellipse(hx, hy, 26, 34, F(3.2)); p.line(hx - 14, hy - 22, hx - 14, hy + 22, S(1.6));
      if (S0.E) { arcs(p, X[2] + 70, -20, 1, 3, 30, 20, 30, W(2.4)); endAt(p, c, S0, 400, -20, 62, 90); }
    }); });

  /* 03 ── HIGH STRIKER: a person swings the mallet onto the pad (link 1), the puck shoots up past the lamp (link 2) and rings the bell (link 3) */
  variant('striker', 'ค้อนตีระฆังวัดแรง', (d, c) => { const S0 = st(d), tx = S0.E ? 70 : 140, fy = 290;
    art(c, p => { floor(p, fy);
      R(p, tx - 26, -205, 52, 495, 8, F(3.2)); p.line(tx, -190, tx, 205, S(1.6));
      R(p, tx - 80, 205, 160, 85, 10, F(3.4)); thing(p, c, S0, 0, tx, 248, 70, fy + 44, { maxW: 200 });
      const pd = tx - 230; R(p, pd - 50, 262, 100, 18, 6, F(2.8)); p.line(pd + 50, 271, tx - 80, 271, W(3));
      /* lamp (link 2) on an arm */
      p.line(tx - 26, -30, tx - 70, -30, W(3)); p.circle(tx - 128, -30, 56, F(3.2)); thing(p, c, S0, 1, tx - 128, -30, 72, 58, { maxW: 180 });
      /* the bell (link 3) and the puck that hit it */
      lastHalo(p, S0, tx, -262, 100);
      p.line(tx, -205, tx, -222, W(3));
      p.path(`M ${tx - 66} ${-224} Q ${tx - 60} ${-300} ${tx} ${-302} Q ${tx + 60} ${-300} ${tx + 66} ${-224} Z`, F(3.4)); R(p, tx - 76, -228, 152, 14, 7, F(2.8));
      thing(p, c, S0, 2, tx, -262, 60, null);
      const lb = itOf(S0, 2); if (lb && lb.label && picOf(lb)) txt(atG(p, tu(.4)), lb.label, tx - 120, -150, { maxW: 170, color: C.ink, weight: 700, size: 32, wrap: 'down' });
      R(p, tx - 24, -202, 48, 30, 8, SOLID());
      [-1, 1].forEach(sd => arcs(p, tx + sd * 82, -256, sd, 2, 18, 16, 40, W(2.6)));
      /* the person and the mallet on the pad */
      const px = tx - 470, k = .8, lean = 12, arm = { s: [4, -76], e: [46, -44], h: [90, -18] };
      person(p, px, fy, k, arm, { lean, leg: stride });
      const hd = pAt(px, fy, k, 90, -18, lean), hc = [pd, 232];
      tube(p, `M ${hd[0]} ${hd[1]} L ${hc[0]} ${hc[1] - 26}`, 15); R(p, hc[0] - 50, hc[1] - 26, 100, 52, 10, F(3.2));
      [-1, 1].forEach(sd => p.line(pd + sd * 64, 248, pd + sd * 82, 236, W(2.4)));
      endAt(p, c, S0, 340, -230, 62, -128);
    }); });

  /* 04 ── CIRCUIT BOARD: the signal comes in at the edge connector, runs the copper trace through chip 1, chip 2, chip 3 and lights the LED */
  variant('pcb', 'แผงวงจรส่งสัญญาณ', (d, c) => { const S0 = st(d), X = S0.E ? [-260, 0, 250] : [-290, 0, 290], Y = [-90, 85, -90];
    art(c, p => {
      R(p, -470, -262, 940, 504, 26, F(3.4)); [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([a, b]) => p.circle(a * 435, b * 225, 12, S(2)));
      R(p, -470, -150, 30, 120, 4, F(2.4)); for (let y = -138; y < -40; y += 22) p.line(-466, y, -446, y, W(2));
      const q = sub(p); [[-440, -90], [X[0] - 92, -90]];
      const trace = [[[-440, -90], [X[0] - 92, -90]], [[X[0] + 92, -90], [X[0] + 140, -90], [X[0] + 140, Y[1]], [X[1] - 92, Y[1]]], [[X[1] + 92, Y[1]], [X[1] + 130, Y[1]], [X[1] + 130, -90], [X[2] - 92, -90]]];
      if (S0.E) trace.push([[X[2] + 92, -90], [395, -90], [395, 50]]);
      trace.forEach(t => { q.path(pathOf(t, false), { sw: 12, stroke: 'rgba(255,255,255,.12)' }); q.path(pathOf(t, false), W(4.4)); t.slice(1, -1).forEach(([x, y]) => q.circle(x, y, 8, F(2.4))); });
      [[-200, 175], [-150, 175]].forEach(([x, y]) => { p.line(x - 40, y + 20, x + 40, y + 20, S(2)); });
      R(p, -150, 168, 64, 22, 6, F(2.4)); p.line(-180, 179, -150, 179, S(2)); p.line(-86, 179, -56, 179, S(2));
      p.circle(160, 180, 20, F(2.4)); p.line(160, 200, 160, 222, S(2)); p.line(-40, -200, 120, -200, S(2)); p.line(120, -200, 120, -150, S(2)); p.circle(-40, -200, 7, F(2));
      X.forEach((x, i) => { const y = Y[i]; if (i === 2) lastHalo(p, S0, x, y, 120);
        R(p, x - 75, y - 75, 150, 150, 12, F(3.2)); p.circle(x - 52, y - 52, 6, S(1.6));
        [-45, -15, 15, 45].forEach(o => { [-1, 1].forEach(sd => { p.line(x + sd * 75, y + o, x + sd * 92, y + o, W(2.6)); p.line(x + o, y + sd * 75, x + o, y + sd * 92, W(2.6)); }); });
        thing(p, c, S0, i, x, y, 84, y + 132, { maxW: 200, size: 32 }); });
      if (S0.E) { p.line(375, 150, 375, 205, W(2.4)); p.line(415, 150, 415, 205, W(2.4)); endAt(p, c, S0, 395, 108, 56, null); const e = S0.E; if (e.label && picOf(e)) txt(atG(p, tu(.5)), e.label, 395, -150, { maxW: 150, color: C.ink, weight: 700, size: 32 }); }
    }); });

  /* 05 ── ROPE WAVE: a person flicks the rope — the wave runs along it, lifting link 1, 2, 3 in turn, and slaps into the post at the far end */
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

  /* 06 ── MIRRORS: the laser hits mirror 1, which throws it to mirror 2, then mirror 3, and on to the sensor */
  variant('mirrors', 'เลเซอร์สะท้อนกระจก', (d, c) => { const S0 = st(d), fy = 240, M = [[-215, -150], [35, 115], [265, -150]], r = 62;
    art(c, p => { floor(p, fy);
      R(p, -470, 182, 124, 58, 10, F(3.2)); R(p, -346, 194, 26, 24, 4, F(2.4)); p.circle(-440, 211, 8, S(1.6)); p.line(-420, 222, -370, 222, S(1.6));
      const end = S0.E ? [420, 100] : [500, 30], L = [[-320, 206], ...M, end], cut = [];
      for (let i = 0; i < L.length - 1; i++) { const [a, b] = [L[i], L[i + 1]], dx = b[0] - a[0], dy = b[1] - a[1], n = Math.hypot(dx, dy), ra = i ? r : 0, rb = i < 3 ? r : (S0.E ? 60 : 0);
        cut.push([[a[0] + dx / n * ra, a[1] + dy / n * ra], [b[0] - dx / n * rb, b[1] - dy / n * rb]]); }
      const cl = clipG(p, -500, -350, 1000, 700); cut.forEach(s => beam(cl, s));
      [M[0], M[2]].forEach(([x, y]) => { p.line(x, -350, x, y - r - 10, W(3)); R(p, x - 16, y - r - 18, 32, 14, 4, F(2.4)); });
      p.line(M[1][0], M[1][1] + r + 2, M[1][0], fy - 14, W(3)); R(p, M[1][0] - 46, fy - 14, 92, 14, 6, F(2.6));
      M.forEach(([x, y], i) => { if (i === 2) lastHalo(p, S0, x, y, r + 30); p.circle(x, y, r, F(3.6)); p.circle(x, y, r - 11, S(1.6)); });
      thing(p, c, S0, 0, M[0][0], M[0][1], 76, M[0][1] + 8, { lx: -375, maxW: 140, size: 30 });
      thing(p, c, S0, 1, M[1][0], M[1][1], 76, fy + 44, { maxW: 200 });
      thing(p, c, S0, 2, M[2][0], M[2][1], 76, M[2][1] + 8, { lx: 410, maxW: 140, size: 30 });
      if (S0.E) { p.line(420, 160, 420, fy - 12, W(3)); R(p, 380, fy - 12, 80, 12, 5, F(2.4)); endAt(p, c, S0, 420, 100, 60, fy + 44); }
    }); });

  /* 07 ── HYDRAULICS: link 1 weighs its piston down, the oil pushes piston 2 up, piston 2's line lifts piston 3 highest */
  variant('hydraulic', 'กระบอกไฮดรอลิก', (d, c) => { const S0 = st(d), X = S0.E ? [-330, -75, 180] : [-290, 0, 290], fy = 250, top = [60, -20, -100], pis = [170, 10, -70];
    art(c, p => { floor(p, fy); R(p, -440, fy - 24, X[2] + 520 > 880 ? 880 : X[2] + 140 + 440 - 0, 24, 6, F(2.8));
      tube(p, `M ${X[0]} 205 L ${X[2]} 205`, 22);
      X.forEach((x, i) => { const yt = top[i], yp = pis[i], pl = yp - 80;
        if (i === 2) lastHalo(p, S0, x, pl - 64, 96);
        R(p, x - 58, yt, 116, 226 - yt, 10, F(3.2)); R(p, x - 50, yp + 12, 100, 218 - yp - 12, 6, { fill: LIT, sw: 0, stroke: 'none' });
        R(p, x - 50, yp, 100, 14, 4, SOLID(1.6)); R(p, x - 66, yt - 10, 132, 16, 6, F(2.6));
        R(p, x - 9, pl + 10, 18, yp - pl - 10, 4, F(2.4)); R(p, x - 70, pl, 140, 14, 6, F(3));
        thing(p, c, S0, i, x, pl - 60, 104, fy + 46, { maxW: 210 }); });
      p.path(`M ${X[0] - 14} ${pis[0] - 140} l 0 36 m -14 -14 l 14 14 l 14 -14`, W(3));
      endAt(p, c, S0, 405, -200, 62, -100);
    }); });

  /* 08 ── STAGED ROCKET: stage 1 burns and drops away, stage 2 fires and drops away, the top stage (link 3) flies on to the end */
  variant('rocket', 'จรวดแยกท่อน', (d, c) => { const S0 = st(d);
    art(c, p => { const cl = clipG(p, -500, -350, 1000, 700);
      p.path('M -400 300 C -380 40, -170 -150, 175 -195', S(2)); R(p, -450, 292, 100, 12, 5, F(2.4));
      [[-415, 278, 22], [-385, 284, 16], [-440, 286, 14]].forEach(([x, y, r]) => p.circle(x, y, r, S(1.8)));
      const stage = (x, y, a, kind, i) => { const g = rot(p, a, x, y), w = kind === 2 ? 42 : 46;
        if (kind === 2) { g.path(`M ${x - w} ${y + 55} L ${x - w} ${y - 30} Q ${x - w} ${y - 90} ${x} ${y - 125} Q ${x + w} ${y - 90} ${x + w} ${y - 30} L ${x + w} ${y + 55} Z`, F(3.4));
          g.path(`M ${x - 24} ${y + 62} Q ${x - 30} ${y + 120} ${x} ${y + 150} Q ${x + 30} ${y + 120} ${x + 24} ${y + 62}`, W(2.6)); g.path(`M ${x - 10} ${y + 66} Q ${x - 12} ${y + 100} ${x} ${y + 116} Q ${x + 12} ${y + 100} ${x + 10} ${y + 66}`, S(2));
          shape(g, [[x - w, y + 10], [x - w - 26, y + 55], [x - w, y + 55]], F(2.6)); shape(g, [[x + w, y + 10], [x + w + 26, y + 55], [x + w, y + 55]], F(2.6)); }
        else { R(g, x - w, y - 75, w * 2, 150, 12, F(3.4)); g.line(x - w, y - 52, x + w, y - 52, S(1.6));
          shape(g, [[x - 24, y + 75], [x + 24, y + 75], [x + 34, y + 104], [x - 34, y + 104]], F(2.6));
          if (kind === 0) { shape(g, [[x - w, y + 20], [x - w - 28, y + 75], [x - w, y + 75]], F(2.6)); shape(g, [[x + w, y + 20], [x + w + 28, y + 75], [x + w, y + 75]], F(2.6)); } }
        thing(p, c, S0, i, x, y + (kind === 2 ? 0 : 8), 72, null, {}); if (a) { const e = itOf(S0, i); } return g; };
      stage(-305, 150, 160, 0, 0); stage(-70, -30, 128, 1, 1);
      lastHalo(p, S0, 175, -195, 130); stage(175, -195, 62, 2, 2);
      [[-250, 60], [-10, -120]].forEach(([x, y]) => [[0, 0, 16], [20, 10, 11], [-14, 14, 9]].forEach(([a, b, r]) => p.circle(x + a, y + b, r, S(1.8))));
      const lab = (i, x, y) => { const it = itOf(S0, i); if (it && it.label && picOf(it)) txt(atG(p, tu(.3)), it.label, x, y, { maxW: 190, color: C.ink, weight: 700, size: 32, wrap: 'down' }); };
      lab(0, -160, 250); lab(1, 90, 70); lab(2, 220, -40);
      endAt(p, c, S0, 405, -230, 60, -132);
    }); });

  /* 09 ── PINBALL: the plunger fires the ball up the lane; it kicks off bumper 1 onto bumper 2, then bumper 3, which lights the target */
  variant('pinball', 'ตู้พินบอล', (d, c) => { const S0 = st(d), ox = S0.E ? -95 : 0;
    art(c, p => {
      p.path(`M ${ox - 300} 310 L ${ox - 300} -120 Q ${ox - 300} -330 ${ox} -330 Q ${ox + 300} -330 ${ox + 300} -120 L ${ox + 300} 310`, F(3.4));
      p.line(ox + 236, 310, ox + 236, -130, W(3)); p.path(`M ${ox + 236} -130 Q ${ox + 236} -268 ${ox + 110} -290`, S(2));
      R(p, ox + 248, 236, 40, 22, 6, F(2.6)); p.poly([[ox + 268, 258], [ox + 254, 268], [ox + 282, 278], [ox + 254, 288], [ox + 268, 298]], W(2.2));
      p.circle(ox + 268, -60, 14, SOLID(1));
      p.line(ox - 300, 120, ox - 190, 210, W(3)); p.line(ox + 236, 120, ox + 126, 210, W(3));
      tube(p, `M ${ox - 190} 210 L ${ox - 78} 246`, 22); tube(p, `M ${ox + 126} 210 L ${ox + 14} 246`, 22);
      const B = [[ox - 130, -170], [ox + 95, -185], [ox - 20, 10]], pts = [[ox + 236, -140], [ox + 150, -280], [ox - 40, -290], [ox - 150, -238], B[0], B[1], B[2], [ox + 30, 150]];
      p.path(pathOf(pts, false), S(1.6));
      [-1, 1].forEach(sd => shape(p, [[ox + sd * 210, 40], [ox + sd * 210, 130], [ox + sd * 160, 160]], F(2.6)));
      B.forEach(([x, y], i) => { if (i === 2) lastHalo(p, S0, x, y, 96); ring(p, x, y, 68, 54); p.circle(x, y, 54, S(1.6)); thing(p, c, S0, i, x, y, 72, y + 104, { maxW: 190, size: 32 }); });
      p.circle(ox + 30, 152, 20, SOLID());
      endAt(p, c, S0, 370, -40, 62, 70);
    }); });

  /* 10 ── FAN & SAIL CART: the fan (link 1) blows, the cart's sail (link 2) fills and rolls it into the buffer, which lights the lamp (link 3) */
  variant('sailcart', 'พัดลมเป่ารถใบเรือ', (d, c) => { const S0 = st(d), fy = 270, fx = -380, cx = -40, bx = S0.E ? 175 : 230;
    art(c, p => { floor(p, fy);
      p.line(fx, 125, fx, 240, W(3)); p.ellipse(fx, fy - 12, 80, 14, F(2.8));
      [0, 120, 240].forEach(a => { const g = rot(p, a + 20, fx, 20); g.ellipse(fx, 20 - 58, 26, 48, S(2)); });
      ring(p, fx, 20, 108, 96); p.circle(fx, 20, 76, S(1.4)); [0, 45, 90, 135].forEach(a => { const x = Math.cos(rad(a)), y = Math.sin(rad(a)); p.line(fx + x * 76, 20 + y * 76, fx + x * 98, 20 + y * 98, S(1.4)); p.line(fx - x * 76, 20 - y * 76, fx - x * 98, 20 - y * 98, S(1.4)); });
      p.circle(fx, 20, 48, F(3.2)); thing(p, c, S0, 0, fx, 20, 62, fy + 44, { maxW: 200 });
      [-30, 30, 90].forEach((y, k) => p.path(`M ${fx + 135} ${y} q 40 -16 80 0 t 80 0 t ${k === 1 ? 60 : 40} 0`, k === 1 ? W(2.4) : S(2.2)));
      R(p, cx - 110, 168, 220, 62, 12, F(3.2)); [-70, 70].forEach(x => { p.circle(cx + x, 240, 28, F(3)); p.circle(cx + x, 240, 7, SOLID(1)); });
      p.line(cx - 20, 168, cx - 20, -205, W(3.4)); p.line(cx - 20, 150, cx + 95, 150, W(3));
      p.path(`M ${cx - 14} -200 C ${cx + 170} -140, ${cx + 175} 70, ${cx - 14} 144 Z`, F(3.2)); thing(p, c, S0, 1, cx + 62, -28, 88, fy + 44, { lx: cx, maxW: 200 });
      R(p, cx + 110, 186, 14, 26, 4, F(2.4));
      R(p, bx - 54, 176, 108, fy - 176, 8, F(3.2)); [-1, 1].forEach(sd => p.circle(bx - 54 - 0, 190 + sd * 0, 0.1, S(1)));
      R(p, bx - 70, 186, 16, 26, 4, F(2.4)); p.line(bx, 176, bx, 70, W(3));
      lastHalo(p, S0, bx, 14, 88); p.circle(bx, 14, 58, F(3.4)); [-1, 1].forEach(sd => arcs(p, bx + sd * 70, 14, sd, 2, 14, 14, 40, W(2.4)));
      thing(p, c, S0, 2, bx, 14, 76, fy + 44, { maxW: 200 });
      endAt(p, c, S0, 400, -150, 62, -48);
    }); });

  /* 11 ── RELAY MASTS: mast 1 sends, mast 2 catches and passes it over the hill, mast 3 catches it and sends it on to the end */
  variant('towers', 'เสาส่งสัญญาณต่อกัน', (d, c) => { const S0 = st(d), X = S0.E ? [-360, -95, 165] : [-320, 0, 320], by = [215, 175, 230], ty = [-60, -140, -40];
    art(c, p => { const cl = clipG(p, -500, -350, 1000, 700);
      cl.path(`M -520 300 C -440 ${by[0]} ${X[0] - 60} ${by[0] - 10} ${X[0]} ${by[0]} C ${X[0] + 90} ${by[0] + 10} ${X[1] - 120} ${by[1] - 5} ${X[1]} ${by[1]} C ${X[1] + 120} ${by[1] + 5} ${X[2] - 80} ${by[2] - 6} ${X[2]} ${by[2]} C ${X[2] + 90} ${by[2] + 6} 460 270 520 300`, S(2.2));
      X.forEach((x, i) => { const b = by[i], t = ty[i] + 50, h = b - t;
        p.line(x - 46, b, x - 12, t, W(3)); p.line(x + 46, b, x + 12, t, W(3));
        for (let k = 0; k < 4; k++) { const y0 = t + h * k / 4, y1 = t + h * (k + 1) / 4, w0 = 12 + 34 * k / 4, w1 = 12 + 34 * (k + 1) / 4; p.line(x - w0, y0, x + w1, y1, S(1.6)); p.line(x + w0, y0, x - w1, y1, S(1.6)); p.line(x - w1, y1, x + w1, y1, S(1.6)); }
        if (i === 2) lastHalo(p, S0, x, ty[i], 90);
        p.circle(x, ty[i], 58, F(3.4)); p.line(x, ty[i] - 58, x, ty[i] - 86, W(3)); p.circle(x, ty[i] - 90, 6, SOLID(1));
        thing(p, c, S0, i, x, ty[i], 76, b + 54, { maxW: 200 }); });
      for (let i = 0; i < 2; i++) { const a = [X[i] + 64, ty[i] - 20], b = [X[i + 1] - 64, ty[i + 1] - 20], m = [(a[0] + b[0]) / 2, Math.min(a[1], b[1]) - 110];
        p.path(`M ${a[0]} ${a[1]} Q ${m[0]} ${m[1]} ${b[0]} ${b[1]}`, W(2.6)); arcs(p, a[0] - 4, a[1] - 6, 1, 2, 14, 14, 40, S(2)); }
      if (S0.E) { const a = [X[2] + 64, ty[2] - 20]; p.path(`M ${a[0]} ${a[1]} Q ${a[0] + 90} ${-230} 350 -200`, W(2.6)); endAt(p, c, S0, 410, -190, 60, -90); }
    }); });

  /* 12 ── MODEL STEAM ENGINE: the burner (link 1) heats the boiler (link 2), the steam drives the piston and spins the flywheel (link 3) */
  variant('steam', 'เครื่องจักรไอน้ำจำลอง', (d, c) => { const S0 = st(d), wx = S0.E ? 255 : 290, wy = 70;
    art(c, p => {
      R(p, -470, 232, 940, 28, 8, F(3)); p.line(-470, 290, 470, 290, S(1.8));
      [-410, -180].forEach(x => p.line(x, 70, x, 232, W(3)));
      R(p, -380, 158, 180, 74, 10, F(3.2)); p.circle(-290, 195, 30, F(2.8)); thing(p, c, S0, 0, -290, 195, 44, 300 + 32, { maxW: 200 });
      [-345, -290, -235].forEach(x => p.path(`M ${x - 12} 150 Q ${x - 14} 126 ${x} 110 Q ${x + 14} 126 ${x + 12} 150`, W(2.4)));
      R(p, -440, -60, 300, 160, 78, F(3.4)); p.circle(-290, 20, 52, S(1.8)); thing(p, c, S0, 1, -290, 20, 72, -82, { lx: -340, maxW: 170, size: 30 });
      R(p, -224, -175, 40, 118, 6, F(3)); R(p, -232, -188, 56, 16, 5, F(2.6));
      [[-198, -232, 22], [-170, -270, 28], [-130, -300, 20]].forEach(([x, y, r]) => p.circle(x, y, r, S(2)));
      tube(p, `M -170 -58 L -170 -100 Q -170 -122 -148 -122 L 0 -122 Q 22 -122 22 -100 L 22 72`, 16);
      R(p, -60, 72, 160, 80, 10, F(3.2)); [-30, 70].forEach(x => p.line(x, 152, x, 232, W(3)));
      R(p, 100, 106, 38, 14, 4, F(2.4)); R(p, 132, 96, 26, 34, 5, F(2.6));
      const pin = [wx - 78, wy + 62]; tube(p, `M 158 113 L ${pin[0]} ${pin[1]}`, 15);
      lastHalo(p, S0, wx, wy, 172);
      [-1, 1].forEach(sd => p.line(wx, wy, wx + sd * 80, 232, W(3)));
      ring(p, wx, wy, 150, 124, F(3.4)); for (let a = 0; a < 360; a += 60) { const x = Math.cos(rad(a + 15)), y = Math.sin(rad(a + 15)); p.line(wx + x * 58, wy + y * 58, wx + x * 124, wy + y * 124, W(3)); }
      p.circle(wx, wy, 58, F(3.4)); p.circle(...pin, 9, F(2.4)); thing(p, c, S0, 2, wx, wy, 74, 300 + 32, { maxW: 220 });
      endAt(p, c, S0, 420, -235, 58, -140);
    }); });

  /* 13 ── LAB FLASKS: link 1 is heated, its vapour bubbles through flask 2, flask 2's gas makes the beaker (link 3) foam up */
  variant('flasks', 'ขวดทดลองทำปฏิกิริยา', (d, c) => { const S0 = st(d), X = S0.E ? [-330, -70, 190] : [-300, 0, 300], ty = 250;
    art(c, p => { R(p, -480, ty, 960, 22, 6, F(3)); p.line(-480, 300, 480, 300, S(1.8));
      const x0 = X[0], x1 = X[1], x2 = X[2];
      p.line(-450, ty, -450, -150, W(3)); R(p, -476, ty - 14, 70, 14, 5, F(2.4)); p.line(-450, -110, x0 - 24, -110, W(3)); R(p, x0 - 30, -122, 14, 26, 4, F(2.4));
      R(p, x0 - 26, 200, 52, 50, 8, F(3)); p.path(`M ${x0 - 12} 196 Q ${x0 - 14} 176 ${x0} 162 Q ${x0 + 14} 176 ${x0 + 12} 196`, W(2.4));
      p.path(`M ${x0 - 22} -130 L ${x0 - 22} -40 A 88 88 0 1 0 ${x0 + 22} -40 L ${x0 + 22} -130 Z`, F(3.4));
      p.path(`M ${x0 - 84} 66 Q ${x0} 76 ${x0 + 84} 66 A 88 88 0 0 1 ${x0 - 84} 66 Z`, { fill: LIT, sw: 0, stroke: 'none' }); p.path(`M ${x0 - 84} 66 Q ${x0} 76 ${x0 + 84} 66`, S(1.8));
      thing(p, c, S0, 0, x0, 30, 84, ty + 54, { maxW: 200 });
      tube(p, `M ${x0} -130 L ${x0} -168 Q ${x0} -190 ${x0 + 22} -190 L ${x1 - 22} -190 Q ${x1} -190 ${x1} -168 L ${x1} 170`, 14);
      const er = (x, w) => p.path(`M ${x - 26} -60 L ${x - 26} 20 L ${x - w} ${ty - 6} Q ${x - w} ${ty} ${x - w + 8} ${ty} L ${x + w - 8} ${ty} Q ${x + w} ${ty} ${x + w} ${ty - 6} L ${x + 26} 20 L ${x + 26} -60 Z`, F(3.4));
      er(x1, 112); p.path(`M ${x1 - 78} 130 L ${x1 + 78} 130 L ${x1 + 110} ${ty - 4} L ${x1 - 110} ${ty - 4} Z`, { fill: LIT, sw: 0, stroke: 'none' }); p.line(x1 - 78, 130, x1 + 78, 130, S(1.8));
      [[x1 - 40, 112, 8], [x1 + 30, 100, 6], [x1 + 6, 76, 9], [x1 - 14, 48, 6]].forEach(([x, y, r]) => p.circle(x, y, r, S(1.8)));
      thing(p, c, S0, 1, x1, 170, 80, ty + 54, { maxW: 200 });
      tube(p, `M ${x1 + 14} -60 L ${x1 + 14} -110 Q ${x1 + 14} -132 ${x1 + 36} -132 L ${x2 - 22} -132 Q ${x2} -132 ${x2} -110 L ${x2} 150`, 14);
      lastHalo(p, S0, x2, 140, 140);
      p.path(`M ${x2 - 110} 20 L ${x2 - 110} ${ty - 10} Q ${x2 - 110} ${ty} ${x2 - 100} ${ty} L ${x2 + 100} ${ty} Q ${x2 + 110} ${ty} ${x2 + 110} ${ty - 10} L ${x2 + 110} 20 L ${x2 + 126} 6`, F(3.4));
      R(p, x2 - 104, 60, 208, ty - 66, 6, { fill: LIT, sw: 0, stroke: 'none' });
      p.path(`M ${x2 - 110} 60 C ${x2 - 90} 20 ${x2 - 60} 50 ${x2 - 40} 18 C ${x2 - 20} -10 ${x2 + 10} 34 ${x2 + 30} 10 C ${x2 + 52} -14 ${x2 + 80} 40 ${x2 + 110} 30`, W(2.4));
      [[x2 - 60, -40, 18], [x2 + 40, -60, 22], [x2 - 10, -96, 16]].forEach(([x, y, r]) => p.circle(x, y, r, S(2)));
      thing(p, c, S0, 2, x2, 150, 84, ty + 54, { maxW: 200 });
      endAt(p, c, S0, 405, -170, 58, -72);
    }); });

  /* 14 ── WATER WHEEL & STAMP: water from the trough (link 1) turns the wheel (link 2), its shaft's cam lifts and drops the stamp (link 3) */
  variant('waterwheel', 'กังหันน้ำตอกเสาเข็ม', (d, c) => { const S0 = st(d), wx = -160, wy = 30, Rw = 165, sx = S0.E ? 200 : 260;
    art(c, p => { p.line(-480, 290, 480, 290, S(1.8));
      p.path('M -470 250 q 40 -14 80 0 t 80 0 t 80 0 t 80 0', S(2)); p.path('M -430 275 q 40 -12 80 0 t 80 0 t 80 0', S(1.6));
      R(p, -480, -330, 160, 118, 12, F(3.4)); thing(p, c, S0, 0, -400, -271, 74, -172, { maxW: 150, size: 30 });
      shape(p, [[-320, -258], [-215, -214], [-215, -190], [-320, -232]], F(2.8));
      p.path('M -224 -200 Q -210 -184 -206 -150', W(2.6)); p.path('M -236 -196 Q -228 -176 -226 -146', S(2)); p.path('M -214 -204 Q -196 -190 -190 -158', S(2));
      [-1, 1].forEach(sd => p.line(wx, wy, wx + sd * 110, 290, W(3)));
      ring(p, wx, wy, Rw, Rw - 22, F(3.2));
      for (let a = 0; a < 360; a += 30) { const x = Math.cos(rad(a)), y = Math.sin(rad(a)); shape(p, [[wx + x * (Rw - 4) - y * 8, wy + y * (Rw - 4) + x * 8], [wx + x * (Rw + 34) - y * 8, wy + y * (Rw + 34) + x * 8], [wx + x * (Rw + 34) + y * 8, wy + y * (Rw + 34) - x * 8], [wx + x * (Rw - 4) + y * 8, wy + y * (Rw - 4) - x * 8]], F(2.4)); }
      for (let a = 0; a < 360; a += 60) { const x = Math.cos(rad(a + 30)), y = Math.sin(rad(a + 30)); p.line(wx + x * 56, wy + y * 56, wx + x * (Rw - 22), wy + y * (Rw - 22), W(3)); }
      tube(p, `M ${wx + 56} ${wy} L ${sx + 40} ${wy}`, 18);
      p.circle(wx, wy, 56, F(3.4)); thing(p, c, S0, 1, wx, wy, 72, 290 + 44, { maxW: 200 });
      [-70, 70].forEach(o => R(p, sx + o - 9, -230, 18, 520, 4, F(2.8))); R(p, sx - 86, -238, 172, 16, 6, F(2.6)); R(p, sx - 70, -120, 140, 14, 5, S(2));
      p.ellipse(sx, wy - 14, 30, 24, F(3)); R(p, sx - 10, -210, 20, 330, 4, F(2.6)); R(p, sx - 34, -70, 68, 18, 5, F(2.6));
      lastHalo(p, S0, sx, 168, 100);
      R(p, sx - 62, 118, 124, 96, 10, F(3.4)); R(p, sx - 86, 226, 172, 64, 8, F(3)); [-1, 1].forEach(sd => p.line(sx + sd * 70, 222, sx + sd * 96, 208, W(2.4)));
      thing(p, c, S0, 2, sx, 166, 66, 290 + 44, { maxW: 200 });
      endAt(p, c, S0, 410, -230, 58, -132);
    }); });

  /* 15 ── SPARK SPHERES: sphere 1 charges up, the spark jumps to sphere 2, then to sphere 3, and on to the end */
  variant('sparks', 'ลูกบอลประกายไฟ', (d, c) => { const S0 = st(d), X = S0.E ? [-350, -95, 160] : [-310, 0, 310], y = -80, r = 80, fy = 270;
    art(c, p => { p.line(-480, fy, 480, fy, S(1.8));
      const bolt = (a, b, seed) => { const n = 6, pts = [a]; for (let k = 1; k < n; k++) { const u = k / n, j = ((k * 37 + seed * 11) % 5 - 2) * 9; pts.push([lerp(a[0], b[0], u), lerp(a[1], b[1], u) + (k % 2 ? -1 : 1) * (14 + Math.abs(j))]); } pts.push(b); beam(p, pts, 3.6); };
      for (let i = 0; i < 2; i++) bolt([X[i] + r, y], [X[i + 1] - r, y], i);
      if (S0.E) bolt([X[2] + r, y], [410 - 60, y], 3);
      X.forEach((x, i) => { R(p, x - 20, y + r, 40, fy - 40 - y - r, 6, F(3)); [0, 1, 2].forEach(k => p.ellipse(x, y + r + 40 + k * 40, 34, 10, F(2.4)));
        R(p, x - 72, fy - 40, 144, 40, 8, F(3.2)); if (i === 2) lastHalo(p, S0, x, y, r + 30);
        p.circle(x, y, r, F(3.6)); p.path(`M ${x - r + 16} ${y - 20} A ${r - 8} ${r - 8} 0 0 1 ${x - 20} ${y - r + 16}`, S(1.8));
        [[-1, -1], [1, -1], [1, 1]].forEach(([a, b]) => p.line(x + a * (r + 10), y + b * (r * .55), x + a * (r + 24), y + b * (r * .55 + 12), S(2)));
        thing(p, c, S0, i, x, y, 98, fy + 46, { maxW: 200 }); });
      endAt(p, c, S0, 410, y, 60, y + 108);
    }); });

  /* 16 ── MARBLE RUN: the marble rolls down rail 1 and rings plate 1, drops onto rail 2 and rings plate 2, then plate 3, and lands in the cup */
  variant('marble', 'รางลูกแก้วซิกแซก', (d, c) => { const S0 = st(d);
    art(c, p => { const D = [[230, -200], [-400, -40], [262, 150]], r = 56;
      tube(p, 'M -450 -282 Q -100 -250 170 -205', 16); tube(p, 'M 220 -120 Q -60 -96 -335 -40', 16); tube(p, 'M -370 64 Q -60 100 200 150', 16);
      [[-430, -280], [-100, -246], [160, -110], [-160, -84], [-350, 64], [-40, 104]].forEach(([x, y]) => { p.line(x, y + 8, x, y + 26, S(2)); p.circle(x, y + 30, 5, S(1.6)); });
      p.path('M -420 -300 Q -100 -272 186 -228 Q 240 -170 220 -132 Q -60 -112 -340 -60 Q -400 0 -366 46 Q -60 80 206 130 Q 290 186 330 205', S(1.6));
      D.forEach(([x, y], i) => { if (i === 2) lastHalo(p, S0, x, y, r + 30); p.circle(x, y, r, F(3.4)); p.line(x, y - r, x, y - r - 24, W(2.6)); R(p, x - 16, y - r - 32, 32, 10, 4, F(2.2)); });
      thing(p, c, S0, 0, D[0][0], D[0][1], 72, D[0][1] - 104, { maxW: 200, size: 30 });
      thing(p, c, S0, 1, D[1][0], D[1][1], 72, D[1][1] + 96, { maxW: 170, size: 30 });
      thing(p, c, S0, 2, D[2][0], D[2][1], 72, D[2][1] + 96, { maxW: 200, size: 30 });
      [[230, -260], [-400, -100], [262, 90]].forEach(([x, y]) => [-1, 1].forEach(sd => p.line(x + sd * 50, y - 10 + 10, x + sd * 64, y - 2, S(2))));
      if (S0.E) { p.path('M 350 215 L 362 278 L 458 278 L 470 215', F(3.2)); p.circle(410, 252, 20, SOLID()); endAt(p, c, S0, 410, 100, 56, null); const e = S0.E; if (e.label && picOf(e)) txt(atG(p, tu(.5)), e.label, 410, 10, { maxW: 150, color: C.ink, weight: 700, size: 30 }); }
      else p.circle(332, 206, 20, SOLID());
    }); });

  /* 17 ── LENSES: the lamp's light goes through lens 1, lens 2 and lens 3 on the bench, each one gathers it tighter, until it lands as one bright spot */
  variant('lens', 'แสงผ่านเลนส์ต่อกัน', (d, c) => { const S0 = st(d), y0 = -30, X = S0.E ? [-200, 20, 220] : [-190, 60, 300], fy = 250;
    art(c, p => { R(p, -470, 196, 940, 22, 8, F(3)); p.line(-470, fy + 40, 470, fy + 40, S(1.8));
      R(p, -470, y0 - 70, 130, 140, 16, F(3.4)); shape(p, [[-340, y0 - 52], [-310, y0 - 70], [-310, y0 + 70], [-340, y0 + 52]], F(3)); R(p, -425, y0 + 70, 40, 126, 6, F(2.8)); [-40, -10, 20].forEach(o => p.line(-450, y0 + o, -366, y0 + o, S(1.6)));
      const xe = S0.E ? 410 : 470, hw = [70, 56, 34, 12];
      const cone = (xa, ha, xb, hb) => { p.path(pathOf([[xa, y0 - ha], [xb, y0 - hb], [xb, y0 + hb], [xa, y0 + ha]]), { fill: 'rgba(255,255,255,.1)', sw: 0, stroke: 'none' }); p.line(xa, y0 - ha, xb, y0 - hb, S(1.6)); p.line(xa, y0 + ha, xb, y0 + hb, S(1.6)); };
      cone(-310, 70, X[0], hw[0]); cone(X[0], hw[0], X[1], hw[1]); cone(X[1], hw[1], X[2], hw[2]); cone(X[2], hw[2], xe - (S0.E ? 60 : 0), hw[3]);
      X.forEach((x, i) => { const h = 112 - i * 8; R(p, x - 10, y0 + h - 6, 20, 196 - y0 - h + 6, 4, F(2.8)); R(p, x - 40, 182, 80, 14, 5, F(2.6));
        if (i === 2) lastHalo(p, S0, x, y0, h + 24);
        p.path(`M ${x} ${y0 - h} Q ${x + 44} ${y0} ${x} ${y0 + h} Q ${x - 44} ${y0} ${x} ${y0 - h} Z`, F(3.4)); R(p, x - 16, y0 - h - 12, 32, 14, 5, F(2.4)); R(p, x - 16, y0 + h - 2, 32, 14, 5, F(2.4));
        thing(p, c, S0, i, x, y0 - h - 72, 92, fy + 40 - 6 + 40, { maxW: 200, size: 32 }); });
      if (S0.E) endAt(p, c, S0, 410, y0, 60, 90); else p.circle(470, y0, 12, SOLID());
    }); });

  /* 18 ── LAMP, SOLAR PANEL, FAN: the lamp (link 1) shines on the panel (link 2), the current spins the little fan (link 3) */
  variant('solar', 'แผงโซลาร์หมุนพัดลม', (d, c) => { const S0 = st(d), fy = 270, fx = S0.E ? 190 : 270;
    art(c, p => { floor(p, fy);
      p.line(-380, fy, -380, -150, W(3.2)); p.ellipse(-380, fy - 10, 70, 12, F(2.6)); p.line(-380, -150, -330, -190, W(3)); p.circle(-380, -150, 10, F(2.4));
      const lg = rot(p, 30, -300, -210); lg.path('M -360 -270 L -260 -270 L -230 -150 L -390 -150 Z', F(3.4)); lg.line(-385, -160, -235, -160, S(1.8));
      thing(p, c, S0, 0, -305, -218, 62, -45, { lx: -260, maxW: 170, size: 30 });
      p.path('M -218 -150 L -40 -40 L -120 60 L -282 -86 Z', { fill: 'rgba(255,255,255,.1)', sw: 0, stroke: 'none' });
      [[-218, -150, -40, -40], [-282, -86, -120, 60]].forEach(([a, b, e, f]) => p.line(a, b, e, f, S(1.6)));
      const pg = rot(p, -30, -40, 30); R(pg, -170, -40, 260, 150, 10, F(3.4));
      for (let k = 1; k < 4; k++) pg.line(-170 + k * 65, -40, -170 + k * 65, 110, S(1.6)); pg.line(-170, 35, 90, 35, S(1.6));
      R(pg, -78, -6, 76, 82, 8, F(2)); thing(p, c, S0, 1, -40, 22, 66, fy + 44, { maxW: 200 });
      p.line(-20, 108, -20, fy, W(3.2)); R(p, -70, fy - 14, 100, 14, 5, F(2.6));
      tube(p, `M 10 160 Q 40 ${fy - 6} 100 ${fy - 6} L ${fx - 30} ${fy - 6} Q ${fx} ${fy - 6} ${fx} ${fy - 40}`, 12);
      R(p, fx - 40, fy - 40, 80, 40, 8, F(3)); p.line(fx, fy - 40, fx, 20, W(3.2)); R(p, fx - 30, 10, 60, 50, 10, F(3));
      lastHalo(p, S0, fx, -70, 110);
      [0, 120, 240].forEach(a => { const g = rot(p, a + 10, fx, -70); g.path(`M ${fx} -70 C ${fx - 46} -110, ${fx - 34} -160, ${fx} -164 C ${fx + 30} -160, ${fx + 22} -110, ${fx} -70 Z`, F(3)); });
      p.circle(fx, -70, 44, F(3.4)); thing(p, c, S0, 2, fx, -70, 58, fy + 44, { maxW: 200 });
      [[fx - 120, -150], [fx + 120, -150]].forEach(([x, y], k) => p.path(`M ${x} ${y} A 150 150 0 0 ${k} ${x + (k ? -30 : 30)} ${y - 40}`, S(2)));
      endAt(p, c, S0, 400, -190, 60, -92);
    }); });

  /* 19 ── SLINKY: a push squeezes the first coils, the squeeze runs along the spring past link 1, 2, 3 and kicks the bell at the far end */
  variant('slinky', 'สปริงยาวส่งแรง', (d, c) => { const S0 = st(d), y0 = 120, fy = 230, xa = -380, xb = S0.E ? 250 : 330;
    art(c, p => { R(p, -480, fy, 960, 24, 8, F(3)); p.line(-480, fy + 70, 480, fy + 70, S(1.8));
      R(p, -470, y0 - 70, 70, 140, 10, F(3.2)); R(p, -400, y0 - 50, 20, 100, 4, F(2.6)); p.line(-470, y0, -490, y0, W(3)); p.path(`M -455 ${y0 - 110} l 40 0 m -14 -14 l 14 14 l -14 14`, W(3));
      const coils = []; let x = xa; const comp = u => 1 - .6 * Math.exp(-Math.pow((u - .9) / .06, 2));
      while (x < xb) { coils.push(x); x += 34 * comp((x - xa) / (xb - xa)); }
      coils.forEach(cx => p.ellipse(cx, y0, 9, 62, S(1.8))); coils.forEach((cx, k) => { if (k % 1 === 0) p.path(`M ${cx} ${y0 - 62} A 10 62 0 0 1 ${cx} ${y0 + 62}`, W(2.6)); });
      const X = [xa + (xb - xa) * .2, xa + (xb - xa) * .48, xa + (xb - xa) * .76];
      X.forEach((x, i) => { p.line(x, y0 - 62, x, y0 - 100, W(3)); if (i === 2) lastHalo(p, S0, x, y0 - 160, 88); p.circle(x, y0 - 160, 58, F(3.4)); thing(p, c, S0, i, x, y0 - 160, 76, fy + 60, { maxW: 200 }); });
      R(p, xb + 4, y0 - 40, 40, 80, 8, F(3)); p.line(xb + 44, y0, xb + 70, y0, W(3));
      if (!endAt(p, c, S0, 410, y0 - 30, 60, y0 + 70)) [-1, 1].forEach(sd => arcs(p, xb + 60, y0, 1, 2, 18, 16, 40, W(2.4)));
    }); });

  /* 20 ── FLOAT VALVE: the jug (link 1) pours, the float (link 2) rises with the water and pushes its rod up, which raises the flag (link 3) */
  variant('float', 'ลูกลอยยกธง', (d, c) => { const S0 = st(d), tx = -40, ty = 250, tw = 300, lvl = 40, fx = tx + 60;
    art(c, p => { p.line(-480, ty, 480, ty, S(2));
      const jg = rot(p, 52, -330, -150); jg.path('M -380 -250 L -280 -250 L -270 -90 Q -270 -60 -300 -60 L -360 -60 Q -390 -60 -390 -90 Z', F(3.4)); jg.path('M -280 -230 Q -230 -220 -240 -150 Q -248 -110 -272 -110', S(2.4)); jg.path('M -380 -250 L -400 -276', W(3));
      thing(p, c, S0, 0, -312, -150, 70, -20, { lx: -400, maxW: 160, size: 30 });
      p.path(`M -205 -205 Q -150 -190 -142 ${lvl}`, W(2.6)); p.path(`M -214 -196 Q -170 -170 -168 ${lvl}`, S(2));
      R(p, tx - tw / 2, -60, tw, ty + 0 + 60, 12, F(3.4)); R(p, tx - tw / 2 + 8, lvl, tw - 16, ty - lvl - 8, 6, { fill: LIT, sw: 0, stroke: 'none' });
      p.path(`M ${tx - tw / 2 + 8} ${lvl} q 30 -10 60 0 t 60 0 t 60 0 t 60 0 t 44 0`, W(2.2));
      [[-142, lvl + 10, 10], [-120, lvl + 30, 7]].forEach(([x, y, r]) => p.circle(x, y, r, S(1.8)));
      R(p, fx - 8, -260, 16, 270, 4, F(2.6)); R(p, fx - 30, -64, 60, 16, 5, F(2.6));
      p.circle(fx, lvl + 4, 62, F(3.4)); thing(p, c, S0, 1, fx, lvl + 4, 80, ty + 46, { lx: tx, maxW: 200 });
      lastHalo(p, S0, fx + 92, -282, 82);
      p.line(fx, -255, fx, -330, W(3)); shape(p, [[fx + 6, -330], [fx + 170, -310], [fx + 160, -250], [fx + 6, -240]], F(3.4));
      thing(p, c, S0, 2, fx + 84, -284, 62, null);
      const it = itOf(S0, 2); if (it && it.label && picOf(it)) txt(atG(p, tu(.5)), it.label, fx + 250, -280, { maxW: 150, color: C.ink, weight: 700, size: 30, anchor: 'middle' });
      endAt(p, c, S0, 380, -60, 60, 40);
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
