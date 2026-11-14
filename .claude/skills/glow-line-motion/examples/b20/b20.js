/* b20.js — category B20 "ความสัมพันธ์" (how two are linked: a, b, the link's name, and whether it is over). House style of B01–B19, line
   weight of B16–B19 (bold bright outlines, round corners, few thin inner lines, big clear icons). Designs from the user's ideas in
   references/cutpack-visual-ideas.md ("ความสัมพันธ์", 20 ideas). People are whole bodies, no faces, no hands — also no hand symbols (the
   handshake idea is a knot / linked rings / clinking cups instead: user 2026-11-14 "คุณวาดอวัยวะคนได้ไม่ดีเลย").
   CutPack (references/cutpack-CATEGORIES.md v2, cat_ai.py): a THING · b THING · label = the link as said (optional) · cut = true when the link
   is over (optional — every design shows the break its own way: a gap, a snapped line, a split floor, things moved apart).
   GL.cats.B20.draw(i, data, { x, y, s, at, hit, speed }) — canvas 1000 × 700 centred at (0,0); hit = seconds after `at` (default 1.9). */
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
    cp.id = 'b20clip' + (++CID); Object.entries({ x, y, width: w, height: h }).forEach(([k, v]) => r.setAttribute(k, v)); cp.appendChild(r);
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

  /* per-frame hooks (b01): drawing that a keyframe can't do (the turning cube) runs on every setT */
  const HOOKS = []; { const base = window.setT; window.setT = t => { base(t); for (const h of HOOKS) h(t); }; }
  const rel = (p, t) => ((p.motion ? p.motion.time(t) : t) - p.t0) / p.ts;

    /* ---------- B15 parts ---------- */
  const star4 = (q, x, y, r, o) => q.path(`M ${x} ${y - r} Q ${f1(x + r * .16)} ${f1(y - r * .16)} ${x + r} ${y} Q ${f1(x + r * .16)} ${f1(y + r * .16)} ${x} ${y + r} Q ${f1(x - r * .16)} ${f1(y + r * .16)} ${x - r} ${y} Q ${f1(x - r * .16)} ${f1(y - r * .16)} ${x} ${y - r} Z`, o || { fill: C.ink, sw: 1.2 });
  /* ---------- motion (user 2026-11-13 "เลือก B ครับ อันอื่นผ่านหมดทำเคลื่อนไหวได้เลย"): every part comes in on its own → the holder does
     its thing (unrolls, rises, flips, unfurls, lights, prints …) → on the keyword the idea lands, lit (halo + ripple) → hold.
     T0 = when the holder's main move starts (a long sentence waits, then goes) · H = the keyword. Last frame = the approved still. ---------- */
  const screw = (q, x, y, r = 5) => { q.circle(x, y, r, S(1.4)); q.line(x - r * .6, y - r * .6, x + r * .6, y + r * .6, S(1.2)); };
  const lines = (q, x, y, w, n, gap, o = S(2), short = []) => { for (let k = 0; k < n; k++) q.line(x, y + k * gap, x + (short.includes(k) ? w * .6 : w), y + k * gap, o); };
  const ell = (q, x, y, rx, ry, o) => q.path(`M ${x - rx} ${y} A ${rx} ${ry} 0 1 0 ${x + rx} ${y} A ${rx} ${ry} 0 1 0 ${x - rx} ${y} Z`, o);
  const fadeIn = (t, d = .1) => [[0, 0], [t, 0], [t + tu(d), 1]];
  const slideX = (t, dx = -70) => [[0, dx], [t, dx], [t + tu(.32), 4, 'out'], [t + tu(.42), 0, 'soft']];
  const floorD = (p, y = 290) => drawAt(p.line(-480, y, 480, y, S(2)), p, 0, tu(.4));
  /* the idea lands at o.t (default the keyword): halo blooms (o.halo = radius), a ripple, then the picture pops in and its label follows;
     no picture → the label is the hero, popping in big; nothing → a lit star */
  function hero(q, c, X, x, y, w, ly, o = {}) { const t = o.t ?? Z.H - tu(.06);
    if (o.halo) haloH(q, x, y, o.halo, t + tu(.02)); if (o.rip !== false) ripple(q, x, y, o.rip || w * .6, t + tu(.04));
    if (!X) { star4(popAt(q, x, y, t), x, y, w * .3); return; }
    if (!picOf(X)) { const by = y + (o.bigDy ?? 22); txt(popAt(q, x, by - 20, t), X.label, x, by, { size: o.bigSize || 72, maxW: o.bigW || 560, weight: 800, color: C.ink, wrap: 'mid' }); return; }
    put(q, c, X, x, y, w, null, { t, mv: o.mv });
    if (X.label) txt(atG(q, t + tu(.12)), X.label, x, ly, { size: o.size || 50, maxW: o.maxW || 560, weight: 800, color: C.ink, wrap: 'down' });
  }
  /* sideways: picture at (ix, iy), label beside it (anchor start at lx); no picture → the label big at (cx, cy) */
  function heroH(q, c, X, ix, iy, w, lx, ly, o = {}) { const t = o.t ?? Z.H - tu(.06);
    if (o.rip !== false) ripple(q, ix, iy, w * .6, t + tu(.04));
    if (!X) { star4(popAt(q, o.cx ?? ix, o.cy ?? iy, t), o.cx ?? ix, o.cy ?? iy, w * .3); return; }
    if (!picOf(X)) { const cx = o.cx ?? 0, cy = (o.cy ?? iy) + 20; txt(popAt(q, cx, cy - 20, t), X.label, cx, cy, { size: o.bigSize || 64, maxW: o.bigW || 560, weight: 800, color: C.ink, wrap: 'mid' }); return; }
    put(q, c, X, ix, iy, w, null, { t, mv: o.mv });
    if (X.label) txt(o.lg || atG(q, t + tu(.12)), X.label, lx, ly, { size: o.size || 50, maxW: o.maxW || 360, weight: 800, color: C.ink, anchor: 'start', wrap: 'mid' });
  }

  const V = [];
  const variant = (id, th, build) => V.push({ id, th, build });

  /* a person seen from the front (GL.parts.human, the default body) — arms[sd] = { s, e, h } for the left (-1) / right (1) arm */
  const FARM = sd => ({ s: [sd * 36, -82], e: [sd * 54, -18], h: [sd * 58, 40] });
  function front(q, x, fy, k, arms = {}, o = {}) { const g = q.child({ transform: `translate(${x} ${f1(fy - 166 * k)}) scale(${k})` }, k); g.H = q.H; g.motion = q.motion;
    return G.parts.human(g, 'line', { arm: sd => arms[sd] || FARM(sd), leg: o.leg }); }
  const fAt = (x, fy, k, lx, ly) => [f1(x + lx * k), f1(fy + (ly - 166) * k)];
  const dots = (q, a, b, n, r = 3.4) => { for (let i = 0; i <= n; i++) q.circle(f1(lerp(a[0], b[0], i / n)), f1(lerp(a[1], b[1], i / n)), r, { fill: C.soft, sw: 0, stroke: 'none' }); };
  const waveArcs = (q, x, y, dir = 1) => arcs(q, x, y, dir, 2, 30, 18, 40, W(2.2));

  /* round 2 (user: "มันดูแฟนซีเกินไป … ลดลงนิดนึง ดีไซน์ใหม่ทั้งหมด") — one plain main thing per design, no decoration
     (no curtains / bulbs / stripes / sparkles); same line weight and structure as B01–B14 */
  const card = (q, x0, y0, w, h, r = 16) => { R(q, x0, y0, w, h, r, F(3.4)); R(q, x0 + 20, y0 + 20, w - 40, h - 40, Math.max(4, r - 8), S(1.4)); };
  const disc = (q, x, y, r) => { ring(q, x, y, r, r - 20, F(3.4)); q.circle(x, y, r - 20, F(1)); q.circle(x, y, r - 34, S(1.4)); };
  const post = (q, x, y0, y1 = 290, bw = 80) => { R(q, x - 10, y0, 20, y1 - y0 - 6, 6, F(2.6)); ell(q, x, y1 - 6, bw, 11, F(2.6)); };

  /* ---------- motion (user 2026-11-13 "ผ่านทั้งหมดครับทำเคลื่อนไหวได้เลย"): every part comes in on its own → the thing does its job
     (drops and swings, rises, flips open, is pressed, is pointed at, rings …) → on the keyword the call lands, lit (ripple + icon pops, label follows)
     → hold. T0 = the main move (a long sentence waits, then goes) · H = the keyword. Last frame = the approved still. ---------- */
  const f3 = v => +v.toFixed(3);
  /* an arm joint swings from r0 into place between t0 and t1 (overshoots a little, settles) */
  const armK = (r0, t0, t1, os = -5) => [[0, r0], [t0, r0], [t1, os, 'out'], [f3(t1 + tu(.1)), 0, 'soft']];
  /* a waving forearm: swings up from r0 at t0, then waves (± a) until t1, settles */
  function waveK(r0, t0, t1, a = 16) { const K = [[0, r0], [t0, r0], [f3(t0 + tu(.3)), 0, 'out']]; let t = t0 + tu(.3), sg = 1;
    while (t + tu(.16) <= t1) { t += tu(.16); K.push([f3(t), sg * a, 'io']); sg = -sg; } K.push([f3(t + tu(.16)), 0, 'soft']); return K; }
  /* a thing that drops in on its hanger and swings on (px, py) until just before the keyword */
  const swingK = (t0, H, a = 7) => ({ y: [[0, -300], [tu(.1), -300], [t0 - tu(.1), 10, 'in'], [t0, 0, 'out']],
    r: [[0, 0], [t0, 0], [t0 + tu(.2), a, 'out'], [t0 + tu(.5), -a * .55, 'io'], [t0 + tu(.8), a * .2, 'io'], [H - tu(.1), 0, 'soft']], o: fadeIn(tu(.1)) });
  const growY = (x, y, t, d = .25) => ({ px: x, py: y, sy: [[0, 0], [t, 0], [t + tu(d), 1.04, 'out'], [t + tu(d + .1), 1, 'soft']], o: fadeIn(t, .04) });
  const CL = p => clipG(p, -500, -350, 1000, 700);

  const flick = (q, t) => { const g = sub(q); on(g, q, 0, { o: [[0, 0], [t, 0], [t + tu(.04), .8], [t + tu(.08), .1], [t + tu(.14), 1], [t + tu(.18), .3], [t + tu(.26), 1]] }); return g; };
  /* an arm raised from rest: r0 = the turn from the raised pose back down to rest (upper), f0 = the same for the forearm */
  const raise = (hm, p, sd, s, e, r0, f0, t0, t1) => { hm.on('upper' + sd, p, 0, { ox: s[0], oy: s[1], r: armK(r0, t0, t1, sd * -4) }); hm.on('fore' + sd, p, 0, { ox: e[0], oy: e[1], r: armK(f0, t0, t1, 0) }); };
  const swingFit = (t0, end, a = 6) => { const L = Math.max(tu(.2), end - t0), at = k => f3(t0 + L * k);
    return { y: [[0, -300], [Math.max(0, t0 - tu(.18)), -300], [t0, 10, 'in'], [f3(t0 + tu(.06)), 0, 'out']],
      r: [[0, 0], [t0, 0], [at(.3), a, 'out'], [at(.6), -a * .5, 'io'], [at(.85), a * .2, 'io'], [at(1), 0, 'soft']], o: fadeIn(Math.max(0, t0 - tu(.18))) }; };

  /* ---------- people (whole bodies, no face, no hands) ---------- */
  /* from the front with a full pose: o.arms[sd] = { s, e, h } · o.leg · o.head · o.lean → { hm, g } (g = the body's group, body units) */
  function body(q, x, fy, k, o = {}) { const g = q.child({ transform: `translate(${x} ${f1(fy - 166 * k)}) rotate(${o.lean || 0} 0 166) scale(${k})` }, k); g.H = q.H; g.motion = q.motion;
    const hm = G.parts.human(g, 'line', { arm: sd => (o.arms && o.arms[sd]) || FARM(sd), leg: o.leg, head: o.head }); return { hm, g }; }
  /* a forearm that lies over the body (crossed arms) keeps its own outline */
  const overArm = (g, a, b, wd = 23) => { g.line(...a, ...b, { sw: wd + 7 }); g.line(...a, ...b, { sw: wd, stroke: C.fill }); };
  /* from the side (faces right): b18's person() + o.head (a bowed head) · o.seat = sitting, hips at fy */
  const SEATL = () => ({ h: [0, 4], k: [80, 10], f: [88, 98] });
  function side(q, x, fy, k, arm, o = {}) { const oy = o.seat ? 4 : 166, g = q.child({ transform: `translate(${x} ${f1(fy - oy * k)}) rotate(${o.lean || 0} 0 ${oy}) scale(${k})` }, k);
    g.H = q.H; g.motion = q.motion;
    const farOf = a => ({ s: [a.s[0] - 8, a.s[1] + 2], e: [a.e[0] - 14, a.e[1] + 10], h: [a.h[0] - 18, a.h[1] + 12] }), far = o.far || farOf(arm);
    /* the far arm is jointed too (upper → fore) so it can move with the near one (sideArm) */
    const fu = sub(g), ff = sub(fu); ff.line(...far.e, ...far.h, { sw: 30 }); ff.line(...far.e, ...far.h, { sw: 23, stroke: C.fill }); fu.line(...far.s, ...far.e, { sw: 32 }); fu.line(...far.s, ...far.e, { sw: 25, stroke: C.fill });
    const hm = G.parts.human(g, 'line', Object.assign({}, SIDE, o.head ? { head: o.head } : {}, { arm: () => arm, leg: o.seat ? SEATL : (o.leg || stand) }));
    hm.far = { u: fu, f: ff, pose: far, of: farOf }; return hm; }
  const HANG = { s: [4, -78], e: [8, -24], h: [12, 30] };
  const UPV = sd => ({ s: [sd * 36, -82], e: [sd * 74, -150], h: [sd * 100, -222] });
  /* a heart (w = its width), centred on (x, y) */
  const heartD = (x, y, w) => { const P = (a, b) => f1(x + a * w) + ' ' + f1(y + b * w);
    return `M ${P(0, .38)} C ${P(-.3, .18)} ${P(-.52, -.02)} ${P(-.5, -.22)} C ${P(-.48, -.44)} ${P(-.2, -.5)} ${P(0, -.3)} C ${P(.2, -.5)} ${P(.48, -.44)} ${P(.5, -.22)} C ${P(.52, -.02)} ${P(.3, .18)} ${P(0, .38)} Z`; };
  /* a coil spring standing from y0 up to y1 (flat loops) */
  /* ---------- motion (user 2026-11-14 "ทำเคลื่อนไหวได้"): every part comes in on its own → the thing / the person does its move
     (a spring bounces, a cord gives, a lid flies open, arms go up, a head bows, a chair rocks, glass fogs …) → who comes in → the feeling
     lands on the keyword H (icon pops, its word follows) → hold. T0 = the main move (a long sentence waits, then goes). Last frame = the still. ---------- */
  /* a shake on x from t0 to t1 */
  const shakeX = (t0, t1, a = 4, st = .05) => { const K = [[0, 0], [t0, 0]]; let t = t0, sg = 1; while (t + tu(st) < t1) { t += tu(st); K.push([f3(t), sg * a]); sg = -sg; } K.push([f3(t1), 0]); return K; };
  /* a dying wobble (rotation) from t0 to t1 */
  const wob = (t0, t1, a = 6, n = 4) => { const K = [[0, 0], [t0, 0]]; for (let i = 1; i <= n; i++) K.push([f3(t0 + (t1 - t0) * i / (n + 1)), f1(a * (i % 2 ? 1 : -1) * (1 - (i - 1) / n)), 'io']); K.push([f3(t1), 0, 'soft']); return K; };
  /* legs swing while walking (side view, stride pose), from t0 to t1 */
  const walkLegs = (hm, p, t0, t1) => { [1, -1].forEach(sd => { const K = [[0, 0], [t0, 0]]; let t = t0, g = sd; while (t + tu(.14) < t1) { t += tu(.14); K.push([f3(t), g * 12, 'io']); g = -g; } K.push([f3(t1), 0, 'soft']); hm.on('thigh' + sd, p, 0, { ox: sd * 6, oy: 8, r: K }); }); };
  const keyAt = (t, d) => f3(t + tu(d));


  /* ---------- the data: a · b (the two) · label (the link, optional) · cut (the link is over, optional) ---------- */
  const PA = d => d && has(d.a) ? d.a : null;
  const PB = d => d && has(d.b) ? d.b : null;
  const LB = d => d && d.label && String(d.label).trim() ? String(d.label).trim() : null;
  const CUT = d => !!(d && d.cut === true);
  const DOT = (q, x, y, r = 8) => q.circle(x, y, r, SOLID(1));
  const tA = Q => f3(Q.T0 + tu(.1)), tB = Q => f3(Q.T0 + tu(.22));
  /* one side: a round plate with its icon, its label under (o.ly = gap); no icon → the label in the plate; nothing → a dot */
  function party(q, c, X, x, y, r = 64, o = {}) { const t = o.t ?? tu(.3), g = popAt(q, x, y, t); ring(g, x, y, r, r - 12, F(3.4)); g.circle(x, y, r - 12, F(1));
    if (!X) { DOT(g, x, y, 8); return; }
    if (picOf(X)) { put(q, c, { icon: X.icon }, x, y, r * 1.2, null, { t: t + tu(.04), punch: t + tu(.18) });
      if (X.label && o.label !== false) txt(atG(q, t + tu(.12)), X.label, x, y + r + (o.ly ?? 58), { size: o.size || 30, maxW: o.maxW || 220, weight: 700, color: C.ink }); }
    else txt(g, X.label, x, y + 10, { size: o.big || 28, maxW: r * 1.6, weight: 800, color: C.ink, wrap: 'mid' }); }
  /* the link's name: a pill tag that pops on the keyword (no label → a small ripple there) */
  function link(q, s, x, y, w = 280, o = {}) { const t = o.t ?? Z.H - tu(.06); if (!s) { ripple(q, x, y, 30, t); return; }
    const g = popAt(q, x, y, t); R(g, x - w / 2, y - 32, w, 64, 32, F(3.6)); txt(g, s, x, y + 11, { size: o.size || 30, maxW: w - 44, weight: 800, color: C.ink }); }
  /* a mirrored copy (faces the other way): draw into this group with the person's own x */
  const mir = (q, x) => { const g = q.child({ transform: `matrix(-1 0 0 1 ${f1(2 * x)} 0)` }); g.H = q.H; g.motion = q.motion; return g; };
  /* a zigzag crack from (x, y0) to (x, y1) */
  const crack = (q, x, y0, y1, a = 14, o = W(3.4)) => { const n = 6, pts = []; for (let i = 0; i <= n; i++) pts.push([x + (i % 2 ? a : -a) * (i && i < n ? 1 : 0), lerp(y0, y1, i / n)]); return q.path(pathOf(pts, false), o); };
  /* a small bust (a person in a node / a crowd) */
  const bust = (q, x, y, k = 1, o = F(2.8)) => { q.path(`M ${f1(x - 30 * k)} ${f1(y + 34 * k)} Q ${f1(x - 30 * k)} ${f1(y + 4 * k)} ${x} ${f1(y + 4 * k)} Q ${f1(x + 30 * k)} ${f1(y + 4 * k)} ${f1(x + 30 * k)} ${f1(y + 34 * k)} Z`, o); q.circle(x, f1(y - 16 * k), f1(15 * k), o); };
  /* a capsule (a finger, a link bar) with its own outline */
  const STEP = { s: [4, -78], e: [16, -26], h: [32, 24] }, LEANF = { head: [16, -134, 31], lean: 3, leg: sd => sd < 0 ? { h: [-6, 8], k: [-14, 86], f: [-24, 166] } : { h: [6, 8], k: [18, 86], f: [30, 166] } };
  const caps = (q, a, b, wd) => { q.line(...a, ...b, { sw: wd + 7 }); q.line(...a, ...b, { sw: wd, stroke: C.fill }); };

  /* THE BOND (idea "คนสองคนจับมือกัน") — no hands at all (user 2026-11-14: "ลองเอาแบบเป็นอย่างอื่นแทนที่ไม่ใช่มือ … คุณวาดอวัยวะคนได้ไม่ดีเลย";
     two hand drawings were turned down: one traced the user's picture, three redrawn ones did not read as hands). Three takes for the user to pick
     (o.style / BS): 'knot' a rope from each side tied in a square knot · 'rings' a's and b's plates are two rings linked through each other ·
     'cups' two cups clink. cut → untied / unlinked / apart. */
  const ringT = (q, x, y, r, w) => { q.circle(x, y, r, { sw: w + 7 }); q.circle(x, y, r, { sw: w, stroke: C.fill }); };
  const arcT = (q, x, y, r, a0, a1, w) => { const P = a => f1(x + r * Math.cos(rad(a))) + ' ' + f1(y + r * Math.sin(rad(a))), d = `M ${P(a0)} A ${r} ${r} 0 0 1 ${P(a1)}`; q.path(d, { sw: w + 7 }); q.path(d, { sw: w, stroke: C.fill }); };
  let BS = 'rings';

  /* ---------- motion (user 2026-11-14 "ทำเคลื่อนไหวได้"): the scene comes in part by part → the two come in (a, then b) → the link forms
     (rings slide and catch, arms go out, a line draws, a plug goes in, a box is passed …) or, when cut, breaks (unlinks, cracks, drops,
     turns away) → the link's name lands on the keyword H → hold. T0 = the main move (a long sentence waits, then goes). Last frame = the still. ---------- */
  const ang = (a, b) => Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI, nrm = v => ((v % 360) + 540) % 360 - 180;
  /* an arm moves from pose `from` to its drawn pose `fin` between t0 and t1 (front body: joints 'upper'/'fore' + sd) */
  const turnK = (a, b) => { const u0 = ang(a.s, a.e), u1 = ang(b.s, b.e); return [f1(nrm(u0 - u1)), f1(nrm((ang(a.e, a.h) - u0) - (ang(b.e, b.h) - u1)))]; };
  function armMove(hm, p, sd, fin, from, t0, t1) { const [r0, q0] = turnK(from, fin);
    hm.on('upper' + sd, p, 0, { ox: fin.s[0], oy: fin.s[1], r: armK(r0, t0, t1, 0) }); hm.on('fore' + sd, p, 0, { ox: fin.e[0], oy: fin.e[1], r: armK(q0, t0, t1, 0) }); }
  /* the same for a side-view person (near arm = joints 'upper1'/'fore1', far arm = hm.far) */
  function sideArm(hm, p, fin, from, t0, t1) { armMove(hm, p, 1, fin, from, t0, t1); const F1 = hm.far.pose, F0 = hm.far.of(from), [r0, q0] = turnK(F0, F1);
    on(hm.far.u, p, 0, { ox: F1.s[0], oy: F1.s[1], r: armK(r0, t0, t1, 0) }); on(hm.far.f, p, 0, { ox: F1.e[0], oy: F1.e[1], r: armK(q0, t0, t1, 0) }); }
  /* keys that bring a part in from offset v (x or y) to 0 between t0 and t1, a little past, then settle */
  const glide = (v, t0, t1, os = 0) => [[0, v], [t0, v], [t1, os, 'out'], [f3(t1 + tu(.1)), 0, 'soft']];
  const TM = Q => keyAt(Q.T0, .3), TE = Q => f3(Q.H - tu(.12));

  /* 01 ── THE BOND (คนสองคนจับมือกัน — no hands): rings — the two rings come in apart, a's icon then b's ride in them; they slide together and
     catch, linked (cut → they start linked and pull apart); the link's name lands under them. knot / cups kept as still options. */
  variant('bond', 'ผูกพันกัน', (d, c) => { const A = PA(d), B = PB(d), cut = CUT(d), Q = TL(), st = d.bs || BS, tM = TM(Q), tE = TE(Q);
    art(c, p => {
      if (st === 'knot') { const dx = cut ? 90 : 0, U1 = `M -296 -26 L ${-40 - dx} -26 Q ${34 - dx} -26 ${34 - dx} 12 Q ${34 - dx} 50 ${-40 - dx} 50 L ${-120 - dx} 50`,
          U2 = `M 296 26 L ${40 + dx} 26 Q ${-34 + dx} 26 ${-34 + dx} -12 Q ${-34 + dx} -50 ${40 + dx} -50 L ${120 + dx} -50`;
        const kg = inG(p, 'pop', 0, 0, tu(.2)); tube(kg, U2, 34); tube(kg, U1, 34); if (!cut) tube(kg, 'M 86 26 L 40 26 Q 14 26 0 16', 34);
        party(p, c, A, -370, 0, 72, { t: tA(Q) }); party(p, c, B, 370, 0, 72, { t: tB(Q) }); link(p, LB(d), 0, 200, 300); }
      else if (st === 'rings') { const ox = cut ? 175 : 100, o0 = cut ? 100 : 330, r = 140, y = -30, P0 = mvG(p, { o: fadeIn(tu(.1)) });
        const xK = sd => glide(sd * (o0 - ox), tM, tE, cut ? sd * 8 : -sd * 8), G2 = sd => mvG(P0, { x: xK(sd) });
        [-1, 1].forEach(sd => G2(sd).circle(sd * ox, y, r, { fill: C.fill, sw: 0, stroke: 'none' })); ringT(G2(-1), -ox, y, r, 24); ringT(G2(1), ox, y, r, 24);
        arcT(cut ? outG(G2(-1), tM, .03) : litG(G2(-1), f3(tE - tu(.06)), .03), -ox, y, r, -48, -8, 24);
        if (!cut) ripple(p, 0, y - 98, 34, f3(tE - tu(.04)));
        [[A, -1, tA(Q)], [B, 1, tB(Q)]].forEach(([X, sd, t]) => { const x = sd * (ox + 30); if (!X) { DOT(mvG(popAt(p, x, y, t), { x: xK(sd) }), x, y, 8); return; }
          if (picOf(X)) { put(p, c, { icon: X.icon }, x, y, 110, null, { t, mv: { px: x, py: y, x: xK(sd) } }); if (X.label) txt(atG(p, Math.max(t + tu(.12), tE)), X.label, x, y + r + 72, { size: 32, maxW: 240, weight: 700, color: C.ink }); }
          else txt(mvG(popAt(p, x, y, t), { x: xK(sd) }), X.label, x, y + 10, { size: 34, maxW: 150, weight: 800, color: C.ink, wrap: 'mid' }); });
        link(p, LB(d), 0, 250, 280); }
      else { const bx = cut ? 230 : 135, tl = cut ? 0 : 16;
        [[-1, A, tA(Q)], [1, B, tB(Q)]].forEach(([sd, X, t], i) => { const x = sd * bx, g0 = inG(p, 'rise', x, 60, tu(.14 + .06 * i)), g = rot(g0, sd * -tl, x, 150);
          shape(g, [[x - 66, -110], [x + 66, -110], [x + 50, 150], [x - 50, 150]], F(4)); g.line(x - 58, -30, x + 58, -30, S(1.6)); ell(g, x, -110, 66, 12, F(2.8));
          if (X && picOf(X)) put(p, c, { icon: X.icon }, f1(x + sd * -tl * 1.2), 50, 84, null, { t, r: sd * -tl, punch: t + tu(.16) }); else if (X) txt(popAt(p, x, 60, t), X.label, x, 70, { size: 26, maxW: 90, weight: 800, color: C.ink, wrap: 'mid' });
          if (X && X.label && picOf(X)) txt(atG(p, t + tu(.12)), X.label, x, 206, { size: 30, maxW: 220, weight: 700, color: C.ink }); });
        if (!cut) sparkAt(p, 0, -128, 22, 44, Q.T0, 7, -90, [3, 4], true); link(p, LB(d), 0, 286, 280); }
    }); });

  /* 02 ── STANDING BETWEEN TWO GROUPS (คนยืนอยู่ระหว่างสองกลุ่ม): the step, the groups come up; the one in the middle steps up and reaches
     out to one side, then the other (cut → reaches both, then one arm drops) */
  variant('between', 'คนเชื่อมสองกลุ่ม', (d, c) => { const A = PA(d), B = PB(d), cut = CUT(d), Q = TL(), T = Q.T0, tM = TM(Q);
    art(c, p => { floorD(p); R(inG(p, 'rise', 0, 240, tu(.04)), -90, 200, 180, 90, 12, F(3.6));
      [-420, -340, -260].forEach((x, i) => body(inG(p, 'rise', x, 160, tu(.1 + .04 * i)), x, 290, .62)); [260, 340, 420].forEach((x, i) => body(inG(p, 'rise', x, 160, tu(.1 + .04 * i)), x, 290, .62));
      const out = sd => ({ s: [sd * 36, -82], e: [sd * 96, -96], h: [sd * 158, -104] });
      const { hm } = body(inG(p, 'rise', 0, 100, tu(.24)), 0, 200, .8, { arms: { [-1]: out(-1), 1: cut ? FARM(1) : out(1) } });
      armMove(hm, p, -1, out(-1), FARM(-1), tM, keyAt(T, .56));
      if (cut) { const [r0, q0] = turnK(out(1), FARM(1)), K = v => [[0, 0], [keyAt(T, .42), 0], [keyAt(T, .68), v, 'out'], [keyAt(T, .76), v], [keyAt(T, .96), 0, 'io']];
        hm.on('upper1', p, 0, { ox: 36, oy: -82, r: K(r0) }); hm.on('fore1', p, 0, { ox: 54, oy: -18, r: K(q0) }); }
      else armMove(hm, p, 1, out(1), FARM(1), keyAt(T, .42), keyAt(T, .68));
      party(p, c, A, -340, -150, 60, { t: tA(Q) }); party(p, c, B, 340, -150, 60, { t: tB(Q) });
      link(p, LB(d), 0, -230, 280);
    }); });

  /* 03 ── FACE TO FACE (คนสองคนยืนหันหน้าเข้าหากัน): the two walk in from the sides (nose first) and stop facing each other;
     cut → the floor between them cracks open */
  variant('facing', 'หันหน้าเข้าหากัน', (d, c) => { const A = PA(d), B = PB(d), cut = CUT(d), Q = TL(), T = Q.T0, tM = TM(Q), dx = cut ? 190 : 140;
    art(c, p => { if (cut) { drawAt(outG(p, tM, .02).line(-480, 290, 480, 290, S(2)), p, 0, tu(.4)); const fl = litG(p, tM, .02); fl.line(-480, 290, -24, 290, S(2)); fl.line(24, 290, 480, 290, S(2)); drawAt(crack(p, 0, 290, 340, 12, W(3)), p, tM, tu(.2)); }
      else floorD(p);
      [[-1, tu(.1)], [1, tu(.16)]].forEach(([sd, t0]) => { const wg = mvG(p, { x: glide(sd * 240, t0, T), o: fadeIn(t0) }), hm = side(sd < 0 ? wg : mir(wg, sd * dx), sd * dx, 290, 1, STEP, LEANF); walkLegs(hm, p, t0, T); });
      party(p, c, A, -320, -190, 58, { t: tA(Q) }); party(p, c, B, 320, -190, 58, { t: tB(Q) });
      link(p, LB(d), 0, -100, 240);
    }); });

  /* 04 ── BACK TO BACK (คนสองคนหันหลังให้กัน): the two come up back to back and lean in to each other; cut → they walk off apart (nose
     first), a dashed line is left between */
  variant('backs', 'หันหลังให้กัน', (d, c) => { const A = PA(d), B = PB(d), cut = CUT(d), Q = TL(), T = Q.T0, tM = TM(Q), tE = TE(Q), dx = cut ? 210 : 62;
    art(c, p => { floorD(p); if (cut) { const dl = litG(p, tE, .1); for (let y = -60; y < 280; y += 40) dl.line(0, y, 0, y + 20, S(2)); }
      [[-1, tu(.1)], [1, tu(.16)]].forEach(([sd, t0]) => { const g0 = inG(p, 'rise', sd * 62, 160, t0), wg = cut ? mvG(g0, { x: glide(-sd * (210 - 62), tM, tE) }) : mvG(g0, { px: sd * dx, py: 290, r: bumpK(tM, -sd * 3, 0) });
        const hm = side(sd < 0 ? mir(wg, sd * dx) : wg, sd * dx, 290, 1, STEP, LEANF); if (cut) walkLegs(hm, p, tM, tE); });
      party(p, c, A, -330, -170, 58, { t: tA(Q) }); party(p, c, B, 330, -170, 58, { t: tB(Q) });
      link(p, LB(d), 0, -250, 260);
    }); });

  /* 05 ── SIDE BY SIDE (คนสองคนยืนเคียงกัน): the platform, the two come up on it; the bracket draws over both; cut → the platform splits
     and the halves slide apart with them, the bracket draws broken */
  variant('sidebyside', 'ยืนเคียงกัน', (d, c) => { const A = PA(d), B = PB(d), cut = CUT(d), Q = TL(), T = Q.T0, tM = TM(Q), gx = cut ? 26 : 0;
    art(c, p => { floorD(p);
      if (cut) [-1, 1].forEach((sd, i) => { const sg = mvG(p, { x: glide(-sd * 30, tM, keyAt(T, .6)) }); R(inG(sg, 'rise', sd * 135, 270, tu(.04)), sd < 0 ? -270 : gx, 250, 270 - gx, 40, 10, F(3.4));
          body(inG(sg, 'rise', sd * 140, 130, tu(.14 + .06 * i)), sd * 140, 250, .92); });
      else { R(inG(p, 'rise', 0, 270, tu(.04)), -270, 250, 540, 40, 10, F(3.4)); [-110, 110].forEach((x, i) => body(inG(p, 'rise', x, 130, tu(.14 + .06 * i)), x, 250, .92)); }
      const tb = cut ? keyAt(T, .62) : tM;
      if (cut) { drawAt(p.path('M -190 -70 L -190 -110 L -40 -110', W(3.4)), p, tb, tu(.25)); drawAt(p.path('M 190 -70 L 190 -110 L 40 -110', W(3.4)), p, tb, tu(.25)); }
      else { drawAt(p.path('M 0 -110 L -190 -110 L -190 -70', W(3.4)), p, tb, tu(.3)); drawAt(p.path('M 0 -110 L 190 -110 L 190 -70', W(3.4)), p, tb, tu(.3)); }
      party(p, c, A, -380, -40, 60, { t: tA(Q) }); party(p, c, B, 380, -40, 60, { t: tB(Q) });
      link(p, LB(d), 0, -110, 260);
    }); });

  /* 06 ── ROUND THE TABLE (คนยืนล้อมโต๊ะ): people come up round the table; a's card, b's card; the people lean in (a bob); cut → a crack runs
     across the table between them */
  variant('table', 'ยืนล้อมโต๊ะ', (d, c) => { const A = PA(d), B = PB(d), cut = CUT(d), Q = TL(), T = Q.T0, tM = TM(Q);
    art(c, p => { floorD(p); [-300, -100, 100, 300].forEach((x, i) => body(mvG(inG(p, 'rise', x, 60, tu(.06 + .04 * i)), { y: bumpK(keyAt(T, .3 + .05 * i), 6, 0) }), x, 170, .6));
      [-440, 440].forEach((x, i) => body(inG(p, 'rise', x, 160, tu(.22 + .04 * i)), x, 290, .8));
      const tb = mvG(inG(p, 'rise', 0, 160, tu(.2)), cut ? { x: shakeX(keyAt(T, .4), keyAt(T, .7), 4) } : {}); R(tb, -24, 140, 48, 140, 8, F(3)); ell(tb, 0, 284, 110, 12, F(3)); R(tb, -330, 120, 660, 30, 12, F(3.4)); ell(tb, 0, 106, 330, 46, F(4));
      if (cut) drawAt(crack(p, 0, 64, 150, 12, W(3.4)), p, keyAt(T, .4), tu(.2));
      [[-190, A, tA(Q)], [190, B, tB(Q)]].forEach(([x, X, t]) => { party(p, c, X, x, -150, 54, { t, ly: 0, label: false }); if (X && X.label && picOf(X)) txt(atG(p, t + tu(.12)), X.label, x + Math.sign(x) * 74, -140, { size: 28, maxW: 170, weight: 700, color: C.ink, anchor: x < 0 ? 'end' : 'start' }); });
      link(p, LB(d), 0, -230, 260);
    }); });

  /* 07 ── A RING OF LINKED ARMS (คนยืนเชื่อมมือเป็นวง): people come up round the ring, back row first; the arms go out and link round the
     ring, one pair after another; cut → one link at the front stays open */
  variant('armring', 'เชื่อมแขนเป็นวง', (d, c) => { const A = PA(d), B = PB(d), cut = CUT(d), Q = TL(), T = Q.T0, n = 8, cx = 0, cy = 140, rx = 360, ry = 90;
    art(c, p => { floorD(p);
      const P = Array.from({ length: n }, (_, i) => { const a = Math.PI / 2 + i * 2 * Math.PI / n, y = cy + ry * Math.sin(a); return { x: f1(cx + rx * Math.cos(a)), fy: f1(y), k: +(.5 + .2 * (y - (cy - ry)) / (2 * ry)).toFixed(3), a }; });
      const order = P.map((q, i) => i).sort((i, j) => P[i].fy - P[j].fy), gap = cut ? [0, 1] : null;
      order.forEach((i, m) => { const q = P[i], L = P[(i + n - 1) % n], Rn = P[(i + 1) % n];
        const toB = (o, open) => { if (open) return null; const mx = (q.x + o.x) / 2, my = (q.fy + o.fy) / 2 - 100 * (q.k + o.k) / 2, hx = (mx - q.x) / q.k, hy = (my - q.fy) / q.k + 166, sd = Math.sign(hx) || 1;
          return { s: [sd * 36, -82], e: [f1((sd * 36 + hx) / 2), f1((-82 + hy) / 2 + 10)], h: [f1(hx), f1(hy)] }; };
        const left = L.x < Rn.x ? L : Rn, right = L.x < Rn.x ? Rn : L, li = left === L ? (i + n - 1) % n : (i + 1) % n, ri = right === L ? (i + n - 1) % n : (i + 1) % n;
        const open = j => gap && ((i === gap[0] && j === gap[1]) || (i === gap[1] && j === gap[0]));
        const al = toB(left, open(li)), ar = toB(right, open(ri)), { hm } = body(inG(p, 'rise', q.x, q.fy - 100, tu(.06 + .04 * m)), q.x, q.fy, q.k, { arms: { [-1]: al || FARM(-1), 1: ar || FARM(1) } });
        const t0 = keyAt(T, .04 * m); if (al) armMove(hm, p, -1, al, FARM(-1), t0, f3(t0 + tu(.3))); if (ar) armMove(hm, p, 1, ar, FARM(1), t0, f3(t0 + tu(.3))); });
      party(p, c, A, -410, -250, 54, { t: tA(Q) }); party(p, c, B, 410, -250, 54, { t: tB(Q) });
      link(p, LB(d), 0, -260, 260);
    }); });

  /* 08 ── THE NETWORK (แผนภาพเครือข่ายคน): the nodes pop, the thin lines draw; a's and b's big nodes; the bold line draws from a to b (cut → it
     draws from both ends and stops short, a gap); the link's name lands on it */
  variant('network', 'เครือข่ายคน', (d, c) => { const A = PA(d), B = PB(d), cut = CUT(d), Q = TL(), tM = TM(Q), a = [-250, -60], b = [250, 60];
    art(c, p => { const N = [[-420, -230], [-380, 170], [-90, -250], [-60, 230], [120, -200], [420, -150], [400, 230], [140, 250]];
      [[0, a], [1, a], [2, a], [3, a], [3, b], [4, b], [5, b], [6, b], [7, b], [2, 4], [1, 3]].forEach(([i, q], k) => { const s = N[i], e = Array.isArray(q) ? q : N[q]; drawAt(p.line(...s, ...e, S(2)), p, tu(.2 + .02 * k), tu(.2)); });
      N.forEach(([x, y], i) => { const g = popAt(p, x, y, tu(.06 + .03 * i)); g.circle(x, y, 40, F(3)); bust(g, x, y + 2, .8, S(2)); });
      if (cut) { drawAt(p.line(-170, -41, -40, -10, W(5)), p, tM, tu(.2)); drawAt(p.line(170, 41, 40, 10, W(5)), p, tM, tu(.2)); } else drawAt(p.line(-170, -41, 170, 41, W(5)), p, tM, tu(.4));
      party(p, c, A, a[0], a[1], 80, { t: tA(Q) }); party(p, c, B, b[0], b[1], 80, { t: tB(Q) });
      link(p, LB(d), 0, -110, 240);
    }); });

  /* 09 ── THE CORD AND PLUG (เส้นเชื่อมคนสองคน): the stands rise, the cords draw; the plug slides into the socket (cut → it starts in and is
     pulled out, a spark); the link's name over it */
  variant('plug', 'สายเชื่อมสองฝ่าย', (d, c) => { const A = PA(d), B = PB(d), cut = CUT(d), Q = TL(), tM = TM(Q), gx = cut ? 40 : 0;
    art(c, p => { floorD(p); [-330, 330].forEach((x, i) => { const g = inG(p, 'rise', x, 150, tu(.04 + .05 * i)); R(g, x - 10, 40, 20, 240, 6, F(2.8)); ell(g, x, 284, 76, 10, F(3)); });
      drawAt(p.path(`M -330 200 Q -330 250 -230 250 L ${-90 - gx} 250`, W(5)), p, tu(.2), tu(.3)); drawAt(p.path(`M 330 200 Q 330 250 230 250 L ${90 + gx} 250`, W(5)), p, tu(.2), tu(.3));
      const pl = mvG(popAt(p, -60 - gx, 250, tu(.46)), { x: glide(cut ? 40 : -60, tM, keyAt(Q.T0, .5), cut ? -6 : 4) }); R(pl, -96 - gx, 228, 50, 44, 10, F(3)); [236, 264].forEach(y => pl.line(-46 - gx, y - 6, -20 - gx, y - 6, W(5)));
      const sk = popAt(p, 60 + gx, 250, tu(.5)); R(sk, 20 + gx, 222, 76, 56, 12, F(3.2)); [236, 264].forEach(y => sk.line(26 + gx, y - 6, 40 + gx, y - 6, S(2)));
      if (cut) sparkAt(p, 0, 244, 14, 30, keyAt(Q.T0, .4), 6, 0, [], true); else ripple(p, -10, 244, 34, keyAt(Q.T0, .5));
      party(p, c, A, -330, -60, 100, { t: tA(Q), ly: -236 }); party(p, c, B, 330, -60, 100, { t: tB(Q), ly: -236 });
      link(p, LB(d), 0, 150, 260);
    }); });

  /* 10 ── POINTING (คนหนึ่งชี้ไปยังอีกคน): both come up; one lifts an arm and points, the dotted line runs to the other; cut → the other turns
     away */
  variant('pointing', 'คนชี้ไปอีกคน', (d, c) => { const A = PA(d), B = PB(d), cut = CUT(d), Q = TL(), T = Q.T0, tM = TM(Q), PT = { s: [4, -78], e: [62, -92], h: [124, -104] };
    art(c, p => { floorD(p); const hm = side(inG(p, 'rise', -280, 160, tu(.06)), -280, 290, 1, PT); sideArm(hm, p, PT, HANG, tM, keyAt(T, .5));
      if (cut) { body(inG(outG(p, keyAt(T, .7), .06), 'rise', 260, 160, tu(.12)), 260, 290, 1); side(litG(p, keyAt(T, .7), .06), 260, 290, 1, HANG); }
      else body(inG(p, 'rise', 260, 160, tu(.12)), 260, 290, 1);
      const dt = sub(p); dots(dt, [-140, 34], [190, 50], 9, 4); [...dt.g.children].forEach((e, i) => on({ g: e }, p, 0, { o: fadeIn(keyAt(T, .5 + .03 * i), .04) }));
      party(p, c, A, -300, -190, 58, { t: tA(Q) }); party(p, c, B, 260, -190, 58, { t: tB(Q) });
      link(p, LB(d), 0, -40, 240);
    }); });

  /* 11 ── THE FAMILY CHART (ภาพคนในแผนผังครอบครัว): the bar and its drops draw, the dim nodes pop; a on top, b below; the bold line runs from a
     down to b (cut → it breaks halfway); the link's name on it */
  variant('familytree', 'แผนผังครอบครัว', (d, c) => { const A = PA(d), B = PB(d), cut = CUT(d), Q = TL(), tM = TM(Q);
    art(c, p => { drawAt(p.path('M 0 -150 L 0 -100 M -260 -100 L 280 -100 M 40 -100 L 40 -10 M 280 -100 L 280 -10', S(2.4)), p, tu(.2), tu(.3));
      [[40, 50], [280, 50]].forEach(([x, y], i) => { const g = popAt(p, x, y, tu(.36 + .05 * i)); g.circle(x, y, 58, F(3)); bust(g, x, y + 4, 1.1, S(2)); });
      if (cut) { drawAt(p.path('M -260 -100 L -160 -100', W(5)), p, tM, tu(.2)); drawAt(p.path('M -100 -100 L 0 -100 L 0 -150', W(5)), p, tM, tu(.2)); drawAt(p.path('M -260 -100 L -260 -16', W(5)), p, tM, tu(.2)); }
      else drawAt(p.path('M 0 -150 L 0 -100 L -260 -100 L -260 -16', W(5)), p, tM, tu(.4));
      party(p, c, A, 0, -230, 76, { t: tA(Q), ly: 0, label: false }); if (A && A.label && picOf(A)) txt(atG(p, tA(Q) + tu(.12)), A.label, 100, -220, { size: 30, maxW: 260, weight: 700, color: C.ink, anchor: 'start' });
      party(p, c, B, -260, 70, 82, { t: tB(Q) });
      link(p, LB(d), -130, -100, 230);
    }); });

  /* 12 ── REACHING TO EACH OTHER (คนสองคนยื่นมือเข้าหากัน): both come up; the arms reach out toward each other, a spark in the gap;
     cut → they stand further apart, the arms that were out drop */
  variant('reach', 'ยื่นแขนเข้าหากัน', (d, c) => { const A = PA(d), B = PB(d), cut = CUT(d), Q = TL(), T = Q.T0, tM = TM(Q), dx = cut ? 260 : 200, RE = { s: [4, -78], e: [62, -76], h: [124, -72] }, ARM = cut ? HANG : RE;
    art(c, p => { floorD(p);
      [[-1, tu(.06), tM], [1, tu(.12), keyAt(T, .4)]].forEach(([sd, t0, ta]) => { const g = inG(p, 'rise', sd * dx, 160, t0), hm = side(sd < 0 ? g : mir(g, sd * dx), sd * dx, 290, 1, ARM); sideArm(hm, p, ARM, cut ? RE : HANG, ta, f3(ta + tu(.3))); });
      if (!cut) sparkAt(p, 0, 52, 16, 34, keyAt(T, .76), 8, 22.5, [], true);
      party(p, c, A, -330, -190, 58, { t: tA(Q) }); party(p, c, B, 330, -190, 58, { t: tB(Q) });
      link(p, LB(d), 0, -110, 240);
    }); });

  /* 13 ── THE SEESAW (คนสองกลุ่มอยู่คนละฝั่ง): the pivot, the plank, the groups come up on its ends; it rocks and comes level; cut → it
     starts level and snaps in the middle, both halves drop */
  variant('seesaw', 'กระดานหกสองฝั่ง', (d, c) => { const A = PA(d), B = PB(d), cut = CUT(d), Q = TL(), T = Q.T0, tM = TM(Q), tE = TE(Q);
    art(c, p => { floorD(p); shape(inG(p, 'rise', 0, 260, tu(.04)), [[-60, 290], [60, 290], [0, 196]], F(3.6));
      if (cut) { [[-1, -40], [1, 40]].forEach(([sd, px]) => { const h = mvG(inG(p, 'rise', sd * 240, 200, tu(.12)), { px, py: 200, r: [[0, 0], [tM, 0], [keyAt(T, .5), -sd * 11, 'in'], [keyAt(T, .6), -sd * 8, 'out'], [keyAt(T, .7), -sd * 9, 'soft']] });
          R(h, sd < 0 ? -430 : 40, 190, 390, 24, 10, F(3.4)); (sd < 0 ? [-400, -310] : [310, 400]).forEach((x, i) => body(inG(h, 'rise', x, 120, tu(.2 + .04 * i)), x, 190, .6)); });
        sparkAt(p, 0, 196, 12, 30, keyAt(T, .3), 6, 0, [], false); }
      else { const pk = mvG(inG(p, 'rise', 0, 200, tu(.12)), { px: 0, py: 188, r: wob(tM, tE, 6, 3) }); R(pk, -440, 176, 880, 24, 10, F(3.4)); [-400, -310, 310, 400].forEach((x, i) => body(inG(pk, 'rise', x, 120, tu(.2 + .04 * i)), x, 176, .6)); }
      party(p, c, A, -355, -230, 58, { t: tA(Q) }); party(p, c, B, 355, -230, 58, { t: tB(Q) });
      link(p, LB(d), 0, 90, 240);
    }); });

  /* 14 ── A SMALL GROUP INSIDE A BIG ONE (คนกลุ่มเล็กอยู่ในกลุ่มใหญ่): b's big ring and its people; a's small ring rolls in from outside and
     settles inside it (cut → it starts inside and moves out); then a and b are named */
  variant('nested', 'กลุ่มเล็กในกลุ่มใหญ่', (d, c) => { const A = PA(d), B = PB(d), cut = CUT(d), Q = TL(), T = Q.T0, bx = cut ? -110 : 40, sx = cut ? 330 : -10, sy = cut ? 150 : 80;
    art(c, p => { const bg = inG(p, 'pop', bx, 20, tu(.04)); bg.circle(bx, 20, 250, W(4.6)); bg.circle(bx, 20, 234, S(1.4));
      [[-150, -60], [170, -40], [100, 170], [-170, 140]].forEach(([x, y], i) => { if (!cut && Math.hypot(x + 50, y - 80) < 130) return; bust(popAt(p, bx + x * .9, 20 + y * .9, tu(.16 + .03 * i)), bx + f1(x * .85), f1(20 + y * .85), .9, S(2)); });
      const o0 = cut ? [-10 - 330, 80 - 150] : [340, 70], sg = mvG(p, { x: glide(o0[0], tu(.36), f3(T - tu(.02))), y: glide(o0[1], tu(.36), f3(T - tu(.02))), o: fadeIn(tu(.3)) });
      sg.circle(sx, sy, 112, F(4)); [-40, 0, 40].forEach(x => bust(sg, sx + x, sy + 40, .8, F(2.4)));
      party(p, c, B, bx, -230, 56, { t: tB(Q), ly: 0, label: false }); if (B && B.label && picOf(B)) txt(atG(p, tB(Q) + tu(.12)), B.label, bx + 76, -220, { size: 30, maxW: 200, weight: 700, color: C.ink, anchor: 'start' });
      party(p, c, A, sx, sy - 40, 46, { t: tA(Q), ly: 0, label: false, big: 22 }); if (A && A.label && picOf(A)) txt(atG(p, tA(Q) + tu(.12)), A.label, sx, sy + 150, { size: 28, maxW: 220, weight: 700, color: C.ink });
      link(p, LB(d), 330, cut ? -120 : 280, 240);
    }); });

  /* 15 ── HANDING OVER (คนส่งของให้อีกคน): both come up; one holds the box out, it slides across and the other's arms come up to take it;
     cut → they hold it between them, it drops to the floor, the arms fall */
  variant('give', 'ส่งของให้อีกคน', (d, c) => { const A = PA(d), B = PB(d), cut = CUT(d), Q = TL(), T = Q.T0, tM = TM(Q), HO = { s: [4, -78], e: [48, -40], h: [104, -52] }, ARM = cut ? HANG : HO;
    art(c, p => { floorD(p);
      const ha = side(inG(p, 'rise', -170, 160, tu(.06)), -170, 290, 1, ARM), hb = side(mir(inG(p, 'rise', 170, 160, tu(.12)), 170), 170, 290, 1, ARM);
      if (cut) { sideArm(ha, p, HANG, HO, tM, keyAt(T, .5)); sideArm(hb, p, HANG, HO, tM, keyAt(T, .5)); }
      else { sideArm(ha, p, HO, HANG, tu(.4), tu(.64)); sideArm(hb, p, HO, HANG, tM, keyAt(T, .56)); }
      const by = cut ? 220 : 20, bx = cut ? rot(mvG(p, { y: [[0, -200], [tM, -200], [keyAt(T, .52), 0, 'in'], [keyAt(T, .6), -10, 'out'], [keyAt(T, .7), 0, 'in']], o: fadeIn(tu(.3)) }), -8, 0, 250)
        : mvG(p, { x: glide(-70, tM, keyAt(T, .56)), o: fadeIn(tu(.5)) });
      R(bx, -66, by - 50, 132, 100, 10, F(3.6)); bx.line(-66, by - 18, 66, by - 18, S(1.6)); bx.line(0, by - 50, 0, by - 18, S(1.6));
      party(p, c, A, -330, -190, 58, { t: tA(Q) }); party(p, c, B, 330, -190, 58, { t: tB(Q) });
      link(p, LB(d), 0, -150, 240);
    }); });

  /* 16 ── JOINED BY ONE ROPE (คนหลายคนเชื่อมด้วยเส้น): the row comes up, the arms go up one after another; the rope runs from a's plate over
     the arms to b's; cut → it runs in from both ends and stops short over the middle one, whose arms stay down */
  variant('rope', 'คนเชื่อมด้วยเชือก', (d, c) => { const A = PA(d), B = PB(d), cut = CUT(d), Q = TL(), T = Q.T0, tM = TM(Q), xs = [-280, -140, 0, 140, 280], k = .72;
    art(c, p => { floorD(p); const up = sd => ({ s: [sd * 36, -82], e: [sd * 70, -150], h: [sd * 76, -226] });
      xs.forEach((x, i) => { const mid = cut && i === 2, { hm } = body(inG(p, 'rise', x, 160, tu(.06 + .04 * i)), x, 290, k, { arms: mid ? {} : { [-1]: up(-1), 1: up(1) } });
        if (!mid) [-1, 1].forEach(sd => armMove(hm, p, sd, up(sd), FARM(sd), keyAt(T, -.3 + .05 * i), keyAt(T, -.06 + .05 * i))); });
      const hy = f1(290 + (-226 - 166) * k), H = []; xs.forEach((x, i) => { if (!(cut && i === 2)) { H.push([x - 76 * k, hy], [x + 76 * k, hy]); } });
      const pts = [[-420, -40]].concat(H.filter(h => h[0] < 0)), pts2 = H.filter(h => h[0] > 0).concat([[420, -40]]);
      if (cut) { drawAt(p.path(pathOf(pts.concat([[-60, hy + 60]]), false), W(4)), p, tM, tu(.3)); drawAt(p.path(pathOf([[420, -40]].concat(pts2.slice(0, -1).reverse(), [[60, hy + 60]]), false), W(4)), p, tM, tu(.3)); }
      else drawAt(p.path(pathOf(pts.concat(pts2), false), W(4)), p, tM, tu(.5));
      party(p, c, A, -420, -110, 56, { t: tA(Q), ly: 0, label: false }); party(p, c, B, 420, -110, 56, { t: tB(Q), ly: 0, label: false });
      [[A, -420], [B, 420]].forEach(([X, x], i) => { if (X && X.label && picOf(X)) txt(atG(p, (i ? tB(Q) : tA(Q)) + tu(.12)), X.label, x, -200, { size: 28, maxW: 180, weight: 700, color: C.ink }); });
      link(p, LB(d), 0, -230, 260);
    }); });

  /* 17 ── TALKING (คนสองคนพูดคุยกัน): the wall rises, the two sit down turned to each other; sound arcs go one way, then back; cut → they
     sit turned to each other, then turn away */
  variant('talk', 'นั่งคุยกัน', (d, c) => { const A = PA(d), B = PB(d), cut = CUT(d), Q = TL(), T = Q.T0, tM = TM(Q), tS = keyAt(T, .5);
    art(c, p => { floorD(p); const wl = inG(p, 'rise', 0, 240, tu(.04)); R(wl, -340, 200, 680, 90, 12, F(3.6)); wl.line(-340, 230, 340, 230, S(1.6));
      const sit = (q, x) => side(q, x, 176, 1.2, { s: [0, -76], e: [26, -24], h: [64, -8] }, { seat: true }), dropIn = (q, t) => mvG(q, { y: [[0, -60], [t, -60], [f3(t + tu(.24)), 4, 'in'], [f3(t + tu(.32)), 0, 'soft']], o: fadeIn(t) });
      const facing = cut ? outG(p, tS, .06) : p; sit(dropIn(facing, tu(.12)), -150); sit(mir(dropIn(facing, tu(.18)), 150), 150);
      if (cut) { const aw = litG(p, tS, .06); sit(mir(aw, -130), -130); sit(aw, 130); }
      else { arcsAt(p, -60, 6, 1, 2, 22, 16, 34, tM); arcsAt(p, 60, 6, -1, 2, 22, 16, 34, keyAt(T, .56)); }
      party(p, c, A, -360, -200, 58, { t: tA(Q) }); party(p, c, B, 360, -200, 58, { t: tB(Q) });
      link(p, LB(d), 0, -150, 240);
    }); });

  /* 18 ── THE PAIR AND THE SIGN (ภาพคนคู่กับป้ายความสัมพันธ์): the posts rise, the board drops onto them; the two come up under it; a and b on
     the board, the link's name between them; cut → the board cracks and its right half swings down */
  variant('pairsign', 'คนคู่กับป้าย', (d, c) => { const A = PA(d), B = PB(d), cut = CUT(d), Q = TL(), T = Q.T0, tM = TM(Q);
    art(c, p => { floorD(p); [-300, 300].forEach((x, i) => R(inG(p, 'rise', x, 100, tu(.04 + .04 * i)), x - 10, -80, 20, 370, 6, F(2.8)));
      if (cut) { const L = inG(CL(p), 'drop', -160, -200, tu(.14)), Rg = mvG(inG(CL(p), 'drop', 160, -200, tu(.14)), { px: 300, py: -300, r: [[0, 0], [tM, 0], [keyAt(T, .46), 12, 'in'], [keyAt(T, .58), 7, 'out'], [keyAt(T, .7), 9, 'soft']] });
        R(L, -360, -320, 356, 230, 22, F(4.6)); R(Rg, 4, -320, 356, 230, 22, F(4.6)); drawAt(crack(p, 0, -320, -90, 10, W(3)), p, f3(tM - tu(.06)), tu(.12)); }
      else R(inG(CL(p), 'drop', 0, -200, tu(.14)), -360, -320, 720, 230, 22, F(4.6));
      [-110, 110].forEach((x, i) => body(inG(p, 'rise', x, 160, tu(.3 + .06 * i)), x, 290, .8));
      party(p, c, A, -230, -220, 56, { t: tA(Q) }); party(p, c, B, cut ? 218 : 230, cut ? -232 : -220, 56, { t: tB(Q) });
      link(p, LB(d), 0, -220, 170, { size: 26 });
    }); });

  /* 19 ── TWO CIRCLES OVERLAPPING (วงกลมสองวงซ้อนกัน): the two circles come in from the sides and overlap, the shared part lights; then a
     and b are named; cut → they start overlapped and slide apart, the light goes out */
  variant('venn', 'วงกลมซ้อนกัน', (d, c) => { const A = PA(d), B = PB(d), cut = CUT(d), Q = TL(), T = Q.T0, ox = cut ? 240 : 125, r = cut ? 200 : 210, o0 = cut ? 125 : 340, t0 = tu(.3), t1 = f3(T - tu(.02));
    art(c, p => { const lens = (q, R0, X0) => { const h = Math.sqrt(R0 * R0 - X0 * X0); q.path(`M 0 ${f1(-30 - h)} A ${R0} ${R0} 0 0 1 0 ${f1(-30 + h)} A ${R0} ${R0} 0 0 1 0 ${f1(-30 - h)} Z`, { fill: 'rgba(255,255,255,.16)', sw: 0, stroke: 'none' }); };
      if (cut) lens(outG(mvG(p, { o: fadeIn(tu(.1)) }), keyAt(t0, .1), .06), r, 125); else lens(litG(p, f3(t1 - tu(.04)), .1), r, ox);
      [-1, 1].forEach((sd, i) => { const g = mvG(p, { x: glide(sd * (o0 - ox), t0, t1, cut ? sd * 6 : -sd * 6), o: fadeIn(tu(.06 + .08 * i)) }); g.circle(sd * ox, -30, r, { sw: 4.6 }); g.circle(sd * ox, -30, r - 16, S(1.4)); });
      party(p, c, A, -ox - (cut ? 0 : 70), -60, 70, { t: tA(Q), ly: 30 }); party(p, c, B, ox + (cut ? 0 : 70), -60, 70, { t: tB(Q), ly: 30 });
      link(p, LB(d), 0, 250, 280);
    }); });

  /* 20 ── UNDER ONE FRAME (คนสองคนยืนใต้กรอบเดียวกัน): the frame rises, its header pops; the two come up inside; a and b; the link's name lands
     on the header; cut → the frame splits down the middle and the halves slide apart with the two */
  variant('frame', 'ใต้กรอบเดียวกัน', (d, c) => { const A = PA(d), B = PB(d), cut = CUT(d), Q = TL(), T = Q.T0, gx = cut ? 40 : 0, t0 = tu(.5), t1 = f3(T - tu(.02));
    art(c, p => { floorD(p);
      if (cut) [-1, 1].forEach((sd, i) => { const sg = mvG(p, { x: glide(-sd * gx * 1.5, t0, t1) }), h = inG(sg, 'rise', sd * (170 + gx), 0, tu(.04 + .04 * i)), dd = `M ${sd * gx} -220 L ${sd * (310 + gx)} -220 L ${sd * (310 + gx)} 290`;
          h.path(dd, { sw: 34 }); h.path(dd, { sw: 27, stroke: C.fill }); body(inG(sg, 'rise', sd * (120 + gx * 1.5), 160, tu(.24 + .06 * i)), sd * (120 + gx * 1.5), 290, .86); });
      else { const f = inG(p, 'rise', 0, 0, tu(.04)); f.path('M -310 290 L -310 -220 L 310 -220 L 310 290', { sw: 34 }); f.path('M -310 290 L -310 -220 L 310 -220 L 310 290', { sw: 27, stroke: C.fill });
        [-120, 120].forEach((x, i) => body(inG(p, 'rise', x, 160, tu(.24 + .06 * i)), x, 290, .86)); }
      R(inG(p, 'pop', 0, -270, tu(.2)), -230, -310, 460, 76, 18, F(4));
      if (cut) drawAt(crack(p, 0, -306, -236, 8, W(3)), p, t0, tu(.1));
      party(p, c, A, -150 - gx * 1.5, -110, 52, { t: tA(Q), ly: 0, label: false }); party(p, c, B, 150 + gx * 1.5, -110, 52, { t: tB(Q), ly: 0, label: false });
      [[A, -1], [B, 1]].forEach(([X, sd], i) => { if (X && X.label && picOf(X)) txt(atG(p, (i ? tB(Q) : tA(Q)) + tu(.12)), X.label, sd * (400 + gx), -20, { size: 28, maxW: 150, weight: 700, color: C.ink }); });
      link(p, LB(d), 0, -272, 400, { size: 32 });
    }); });

  /* ---------- sample data (A: links from unrelated topics · B: stress) ---------- */
  const I = (icon, label) => label ? (icon ? { icon, label } : { label }) : { icon };
  const D = (say, a, b, label, cut) => ({ say, a, b, label, cut });
  const SAMPLES = [
    D('เราสองบริษัทจับมือกันทำโปรเจกต์นี้', I('building-2', 'บริษัทเรา'), I('store', 'พาร์ตเนอร์'), 'คอลแลบ'),
    D('ผมเป็นคนกลางระหว่างทีมขายกับทีมช่าง', I('users', 'ทีมขาย'), I('users', 'ทีมช่าง'), 'คนกลาง'),
    D('เขาเป็นคู่แข่งกันมาตลอด', I('user', 'เขา'), I('user', 'คู่แข่ง'), 'คู่แข่ง'),
    D('เลิกกับแฟนเก่าไปแล้ว', I('user', 'ผม'), I('user', 'แฟนเก่า'), 'แฟนเก่า', true),
    D('พ่อกับแม่อยู่ด้วยกันมา 30 ปี', I('user', 'พ่อ'), I('user', 'แม่'), 'คู่ชีวิต'),
    D('หุ้นส่วนสองคนนั่งคุยงานกัน', I('user', 'ผม'), I('briefcase', 'หุ้นส่วน'), 'หุ้นส่วน'),
    D('เพื่อนกลุ่มนี้รักกันมาก', I('user', 'ผม'), I('users', 'แก๊งเพื่อน'), 'เพื่อนสนิท'),
    D('ลูกค้ากับแบรนด์เชื่อมกันผ่านคอมมูนิตี้', I('users', 'ลูกค้า'), I('store', 'แบรนด์'), 'คอมมูนิตี้'),
    D('ครีเอเตอร์กับแบรนด์ที่สปอนเซอร์', I('user', 'ครีเอเตอร์'), I('store', 'แบรนด์'), 'สปอนเซอร์'),
    D('หัวหน้าสั่งงานลูกน้อง', I('user', 'หัวหน้า'), I('user', 'ลูกน้อง'), 'เจ้านาย'),
    D('ลุงกับหลาน', I('user', 'ลุง'), I('baby', 'หลาน'), 'ลุงกับหลาน'),
    D('อยากคืนดีกับเพื่อนเก่า', I('user', 'ผม'), I('user', 'เพื่อนเก่า'), 'เพื่อนเก่า'),
    D('สองฝ่ายต่อรองกันอยู่', I('users', 'ฝ่ายเรา'), I('users', 'อีกฝ่าย'), 'คู่เจรจา'),
    D('ทีมเราเป็นส่วนหนึ่งของบริษัทใหญ่', I('users', 'ทีมเรา'), I('building-2', 'บริษัทแม่'), 'บริษัทลูก'),
    D('รุ่นพี่ส่งต่องานให้รุ่นน้อง', I('user', 'รุ่นพี่'), I('user', 'รุ่นน้อง'), 'พี่เลี้ยง'),
    D('ทุกคนในชุมชนเชื่อมถึงกัน', I('users', 'ชาวบ้าน'), I('house', 'ชุมชน'), 'เครือข่าย'),
    D('คุยกับที่ปรึกษาทุกอาทิตย์', I('user', 'ผม'), I('user', 'ที่ปรึกษา'), 'ที่ปรึกษา'),
    D('เราสองคนเป็นพี่น้องกัน', I('user', 'พี่'), I('user', 'น้อง'), 'พี่น้อง'),
    D('ลูกค้าเก่ากับลูกค้าใหม่มีจุดร่วม', I('users', 'ลูกค้าเก่า'), I('users', 'ลูกค้าใหม่'), 'จุดร่วม'),
    D('เราอยู่บ้านเดียวกัน', I('user', 'ผม'), I('user', 'รูมเมต'), 'รูมเมต'),
  ];
  const STRESS = [
    D('cut จับมือ', I('user', 'ผม'), I('user', 'แฟนเก่า'), 'เลิกกันแล้ว', true),
    D('cut', I('users', 'ทีม A'), I('users', 'ทีม B'), 'แยกทาง', true),
    D('cut', I('user', 'เขา'), I('user', 'เธอ'), null, true),
    D('ไม่ cut (ชิดกัน)', I('user', 'ผม'), I('user', 'เพื่อน'), 'คู่หู'),
    D('cut ป้ายยาว', I('user', 'ผม'), I('user', 'อดีตหุ้นส่วนทางธุรกิจ'), 'เคยเป็นหุ้นส่วนกันมานาน', true),
    D('ไม่มีไอคอน', I(null, 'คุณแม่'), I(null, 'ลูกสาว'), 'แม่ลูก'),
    D('cut วงแขน', I('users', 'ผม'), I('users', 'แก๊งเก่า'), 'เคยสนิท', true),
    D('cut เส้นขาด', I('user', 'ผม'), I('user', 'ลูกค้าเก่า'), 'ขาดการติดต่อ', true),
    D('cut ถอดปลั๊ก', I('store', 'แบรนด์'), I('user', 'ครีเอเตอร์'), 'จบสัญญา', true),
    D('cut หันหลัง', I('user', 'หัวหน้า'), I('user', 'ผม'), 'เคยเป็นลูกน้อง', true),
    D('cut ผังครอบครัว', I('user', 'พ่อ'), I('user', 'ลูก'), 'ตัดขาด', true),
    D('ภาษาอังกฤษ', I('user', 'Me'), I('user', 'My mentor'), 'Mentor'),
    D('cut กระดานหัก', I('users', 'Team A'), I('users', 'Team B'), 'Rivals', true),
    D('cut ออกจากกลุ่ม', I('users', 'ทีมเรา'), I('building-2', 'บริษัทเดิม'), 'แยกตัวออกมา', true),
    D('cut ของตก', I('user', 'ผม'), I('user', 'เพื่อน'), 'ไม่ส่งต่อแล้ว', true),
    D('cut เชือกขาด', I('users', 'สมาชิก'), I('house', 'ชมรม'), 'ยุบชมรม', true),
    D('cut หันออก', I('user', 'ผม'), I('user', 'แฟนเก่า'), 'ไม่คุยกันแล้ว', true),
    D('cut ป้ายแตก', I('user', 'เขา'), I('user', 'เธอ'), 'หย่าร้าง', true),
    D('cut วงแยก', I('users', 'ลูกค้า'), I('store', 'แบรนด์'), null, true),
    D('ไม่มีอะไรเลย', null, null, null),
  ];

  G.cats = G.cats || {};
  G.cats.B20 = { variants: V, SAMPLES, STRESS, draw: (i, d, c) => { setZ(c); CUR = V[i].id; V[i].build(d || {}, c); }, CLAMPS, timing: c => (setZ(c), Object.assign({}, Z)) };
})();
