/* b21.js — category B21 "สถานที่" (a place: its name/icon, and 1–2 spots in it). House style of B01–B20, line weight of B16–B20 (bold bright
   outlines, round corners, few thin inner lines, big clear icons). Designs from the user's ideas in references/cutpack-visual-ideas.md
   ("สถานที่", 20 ideas). People are whole bodies, no faces, no hands. No numbers that the data does not give (no grid refs, no coordinates).
   CutPack (references/cutpack-CATEGORIES.md v2, cat_ai.py): place THING (icon + label = its name as said) · spots 1–2 THINGs (optional —
   things there or where in it: ชั้น G, หน้า KFC, ห้องนั่งเล่น).
   GL.cats.B21.draw(i, data, { x, y, s, at, hit, speed }) — canvas 1000 × 700 centred at (0,0); hit = seconds after `at` (default 1.9). */
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
    cp.id = 'b21clip' + (++CID); Object.entries({ x, y, width: w, height: h }).forEach(([k, v]) => r.setAttribute(k, v)); cp.appendChild(r);
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


  /* ---------- the data: place (the place) · spots (1–2 things there / where in it, optional) ---------- */
  const PL = d => d && has(d.place) ? d.place : null;
  const SP = d => (d && Array.isArray(d.spots) ? d.spots.filter(has) : []).slice(0, 2);
  const tS = (Q, i) => f3(Q.T0 + tu(.1 + .12 * i));
  /* the place lands on the keyword: its icon pops, its name under it (no icon → the name big; nothing → a lit star) */
  const placeV = (q, c, X, x, y, w, ly, o = {}) => hero(q, c, X, x, y, w, ly, Object.assign({ rip: false, size: 44, maxW: 380, bigSize: 52, bigW: 420 }, o));
  const placeH = (q, c, X, ix, iy, w, lx, o = {}) => heroH(q, c, X, ix, iy, w, lx, iy + (o.dy ?? 16), Object.assign({ rip: false, size: 44, maxW: 380, bigSize: 50, bigW: 560 }, o));
  /* a spot: a small round marker with its icon, the label beside it (o.side 1 right · −1 left · 0 under); no icon → a pill with the label */
  function spot(q, c, S, x, y, o = {}) { if (!S) return; const t = o.t ?? tu(.4), r = o.r || 40, sd = o.side ?? 1;
    if (!picOf(S)) { const g = popAt(q, x, y, t), w = o.w || 210; R(g, x - w / 2, y - 26, w, 52, 26, F(3.2)); DOT(g, x - w / 2 + 24, y, 6); txt(g, S.label, x + 10, y + 9, { size: 24, maxW: w - 60, weight: 700, color: C.ink }); return; }
    const g = popAt(q, x, y, t); g.circle(x, y, r, F(3.2)); put(q, c, { icon: S.icon }, x, y, r * 1.3, null, { t: t + tu(.04), punch: t + tu(.18) });
    if (S.label) txt(atG(q, t + tu(.12)), S.label, sd ? x + sd * (r + 14) : x, sd ? y + 9 : y + r + 34, { size: o.size || 26, maxW: o.maxW || 180, weight: 700, color: C.ink, anchor: sd > 0 ? 'start' : sd < 0 ? 'end' : 'middle' }); }
  /* a map pin (teardrop) with its head at (x, y), radius r; its tip at y + 1.9 r */
  const pinD = (x, y, r) => `M ${x} ${f1(y + r * 1.9)} C ${f1(x - r * .45)} ${f1(y + r * 1.3)} ${f1(x - r)} ${f1(y + r * .7)} ${f1(x - r)} ${y} A ${r} ${r} 0 1 1 ${f1(x + r)} ${y} C ${f1(x + r)} ${f1(y + r * .7)} ${f1(x + r * .45)} ${f1(y + r * 1.3)} ${x} ${f1(y + r * 1.9)} Z`;
  const pin = (q, x, y, r) => { q.path(pinD(x, y, r), F(4)); q.circle(x, y, r * .72, F(1.6)); };
  const winGrid = (q, x0, y0, nx, ny, w, h, gx, gy, lit = []) => { for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) R(q, x0 + i * (w + gx), y0 + j * (h + gy), w, h, 4, lit.includes(j * nx + i) ? { fill: LIT, sw: 2, stroke: C.soft } : S(1.6)); };
  const tree = (q, x, y, k = 1) => { R(q, x - 6 * k, y - 40 * k, 12 * k, 40 * k, 3, F(2.4)); q.circle(x, f1(y - 62 * k), f1(30 * k), F(2.8)); };
  const arrowR = (q, x, y, a = 0, k = 1) => { const g = rot(q, a, x, y); g.path(`M ${x - 34 * k} ${y} L ${x + 22 * k} ${y} M ${x + 4 * k} ${y - 20 * k} L ${x + 26 * k} ${y} L ${x + 4 * k} ${y + 20 * k}`, W(5)); };

  /* 01 ── ONE BUILDING (อาคารหนึ่งหลัง): the building rises, its windows light row by row; the spots tag two floors; the place lands on the
     emblem, its name on the band over the door */
  variant('building', 'อาคารหนึ่งหลัง', (d, c) => { const X = PL(d), Sp = SP(d), Q = TL();
    art(c, p => { floorD(p); const b = inG(p, 'rise', 0, 100, tu(.04)); R(b, -170, -250, 340, 540, 12, F(4.6)); R(b, -190, -266, 380, 26, 8, F(3.2));
      b.circle(0, -165, 66, F(3.2)); winGrid(b, -130, -70, 4, 2, 44, 52, 28, 30); R(b, -46, 160, 92, 130, 8, F(3)); b.line(0, 160, 0, 290, S(1.6));
      R(b, -130, 96, 260, 50, 10, F(3)); placeV(p, c, X, 0, -165, 90, 132, { size: 30, maxW: 230, bigSize: 34, bigW: 300, bigDy: 4 });
      spot(p, c, Sp[0], -250, -40, { t: tS(Q, 0), side: -1 }); spot(p, c, Sp[1], 250, 60, { t: tS(Q, 1), side: 1 });
    }); });

  /* 02 ── SEVERAL BUILDINGS (อาคารหลายหลัง): the skyline rises building by building; the spots mark two of them; the place lands on the
     tallest */
  variant('skyline', 'อาคารหลายหลัง', (d, c) => { const X = PL(d), Sp = SP(d), Q = TL();
    art(c, p => { floorD(p); [[-440, 110, 230], [-310, 130, 360], [-160, 120, 280], [-30, 160, 500], [150, 130, 330], [300, 140, 420], [460, 0, 0]].forEach(([x, w, h], i) => { if (!w) return; const g = inG(p, 'rise', x + w / 2, 290 - h / 2, tu(.04 + .04 * i));
        R(g, x, 290 - h, w, h, 8, F(4)); const nx = Math.floor((w - 24) / 34); winGrid(g, x + (w - (nx * 34 - 14)) / 2, 310 - h, nx, Math.floor((h - 60) / 56), 20, 30, 14, 26); });
      const tx = 50; inG(p, 'rise', tx, -240, tu(.3)).line(tx, -210, tx, -250, W(3)); disc(inG(p, 'pop', tx, -300, tu(.34)), tx, -300, 50);
      placeH(p, c, X, tx, -300, 62, tx + 70, { size: 40, maxW: 330, cx: 200, cy: -300, bigSize: 40, bigW: 420 });
      spot(p, c, Sp[0], -245, -170, { t: tS(Q, 0), side: 0, r: 30, size: 24 }); spot(p, c, Sp[1], 215, -140, { t: tS(Q, 1), side: 0, r: 30, size: 24 });
    }); });

  /* 03 ── THE MAP AND ITS PIN (แผนที่พร้อมหมุด): the folded map opens panel by panel, the roads draw; the spot pins go in; the big pin drops
     with the place */
  variant('mappin', 'แผนที่พร้อมหมุด', (d, c) => { const X = PL(d), Sp = SP(d), Q = TL();
    art(c, p => { const P3 = [[[-330, -150], [-110, -180], [-110, 200], [-330, 230]], [[-110, -180], [110, -150], [110, 230], [-110, 200]], [[110, -150], [330, -180], [330, 200], [110, 230]]];
      P3.forEach((pts, i) => shape(inG(p, 'pop', pts[0][0] + 110, 25, tu(.04 + .06 * i)), pts, F(3.6)));
      ['M -320 60 Q -200 20 -110 40 Q 0 70 110 30 Q 220 -10 320 20', 'M -40 -170 Q -20 0 -60 210', 'M 180 -160 Q 150 20 210 210'].forEach((dd, i) => drawAt(p.path(dd, S(2.6)), p, tu(.3 + .05 * i), tu(.3)));
      p.path('M -330 150 Q -230 120 -150 170 Q -110 190 -110 200', { sw: 10, stroke: 'rgba(255,255,255,.18)' });
      const pg = inG(CL(p), 'drop', 0, -150, f3(Q.H - tu(.3))); ell(p, 0, -44, 30, 8, { fill: 'rgba(255,255,255,.2)', sw: 0, stroke: 'none' }); pin(pg, 0, -180, 70);
      placeV(p, c, X, 0, -180, 74, 290, { size: 42, maxW: 600, bigSize: 30, bigW: 96, bigDy: 6 });
      [[Sp[0], -220, 100], [Sp[1], 220, 70]].forEach(([S0, x, y], i) => { if (!S0) return; pin(popAt(p, x, y + 30, tS(Q, i)), x, y, 18); spot(p, c, S0, x, y - 70, { t: tS(Q, i), side: 0, r: 30, size: 24 }); });
    }); });

  /* 04 ── THE MINI MAP (แผนที่แบบย่อ): the round inset map draws (rim, roads, blocks), the north mark; the spot dots and their names; the pin
     pops in the middle with the place, its name beside */
  variant('minimap', 'แผนที่แบบย่อ', (d, c) => { const X = PL(d), Sp = SP(d), Q = TL(), mx = -150, R0 = 220;
    art(c, p => { const m = inG(p, 'pop', mx, 0, tu(.04)); m.circle(mx, 0, R0, F(4.6)); m.circle(mx, 0, R0 - 18, S(1.4)); shape(m, [[mx - 16, -R0 - 4], [mx + 16, -R0 - 4], [mx, -R0 - 34]], F(2.6));
      [[-60, 30], [20, 30], [70, 120]].forEach(([a, wd], i) => { const u = rad(a), h = Math.sqrt(Math.max(0, (R0 - 20) ** 2 - 0)), dx = Math.cos(u) * (R0 - 22), dy = Math.sin(u) * (R0 - 22); drawAt(p.line(f1(mx - dx), f1(-dy), f1(mx + dx), f1(dy), { sw: 14, stroke: 'rgba(255,255,255,.16)' }), p, tu(.2 + .05 * i), tu(.3)); });
      [[-90, -90], [40, -120], [-110, 80], [60, 90]].forEach(([x, y], i) => R(atG(p, tu(.36 + .03 * i)), mx + x - 30, y - 22, 60, 44, 6, S(1.6)));
      [[Sp[0], -80, 100], [Sp[1], 90, -40]].forEach(([S0, x, y], i) => { if (!S0) return; DOT(popAt(p, mx + x, y, tS(Q, i)), mx + x, y, 9); spot(p, c, S0, 150, 80 + 90 * i, { t: tS(Q, i), side: 1, r: 34 }); });
      pin(popAt(p, mx, -30, f3(Q.H - tu(.16))), mx, -40, 50); placeH(p, c, X, mx, -40, 56, 120, { dy: -54, size: 46, maxW: 330, cx: 220, cy: -100 });
    }); });

  /* 05 ── THE NAME STONE (ป้ายชื่อสถานที่): the base and the stone rise, the shrubs pop; the spots on the base; the place lands on the stone */
  variant('namesign', 'ป้ายชื่อสถานที่', (d, c) => { const X = PL(d), Sp = SP(d), Q = TL();
    art(c, p => { floorD(p); [-400, 400].forEach((x, i) => { const g = popAt(p, x, 250, tu(.3 + .04 * i)); g.circle(x - 30, 250, 40, F(2.8)); g.circle(x + 26, 244, 46, F(2.8)); g.circle(x, 220, 44, F(2.8)); });
      const st = inG(p, 'rise', 0, 60, tu(.04)); R(st, -310, 200, 620, 90, 12, F(4)); R(st, -280, -180, 560, 380, 26, F(4.8)); R(st, -252, -152, 504, 324, 16, S(1.4));
      placeV(p, c, X, 0, -70, 120, 90, { size: 52, maxW: 460, bigSize: 60, bigW: 470 });
      spot(p, c, Sp[0], -200, 245, { t: tS(Q, 0), side: 1, r: 30, size: 24, maxW: 120 }); spot(p, c, Sp[1], 90, 245, { t: tS(Q, 1), side: 1, r: 30, size: 24, maxW: 120 });
    }); });

  /* 06 ── THE PIN OVER THE GROUND (หมุดตำแหน่งบนแผนที่): the ground rings spread; the big pin drops and bounces over its shadow; the spot tags
     stand on the ground; the place lands in the pin */
  variant('locpin', 'หมุดบนพื้น', (d, c) => { const X = PL(d), Sp = SP(d), Q = TL();
    art(c, p => { [[380, 58, 1.6], [250, 40, 1.6], [120, 20, 2]].forEach(([rx, ry, w], i) => ell(mvG(p, { px: 0, py: 232, s: [[0, .4], [tu(.04 + .06 * i), .4], [tu(.4 + .06 * i), 1, 'out']], o: fadeIn(tu(.04 + .06 * i)) }), 0, 232, rx, ry, S(w)));
      ell(p, 0, 232, 70, 14, { fill: 'rgba(255,255,255,.18)', sw: 0, stroke: 'none' });
      pin(inG(CL(p), 'drop', 0, -100, tu(.3)), 0, -160, 110); placeV(p, c, X, 0, -160, 120, 320, { size: 42, maxW: 600, bigSize: 40, bigW: 150, bigDy: 10 });
      [[Sp[0], -340], [Sp[1], 340]].forEach(([S0, x], i) => { if (!S0) return; drawAt(p.line(x, 130, x, 200, W(3)), p, tS(Q, i), tu(.15)); ell(p, x, 200, 30, 7, S(1.6)); spot(p, c, S0, x, 40, { t: tS(Q, i), side: 0, r: 40 }); });
    }); });

  /* 07 ── A ROOM WITH A DOOR AND A WINDOW (ห้องที่มีประตูและหน้าต่าง): the room builds (back wall, side walls, floor), the door and the
     window; the spots on the floor; the place lands in the frame on the wall */
  variant('room', 'ห้องมีประตูหน้าต่าง', (d, c) => { const X = PL(d), Sp = SP(d), Q = TL();
    art(c, p => { const rm = inG(p, 'pop', 0, 0, tu(.04)); shape(rm, [[-470, -340], [-300, -250], [-300, 120], [-470, 290]], F(3.6)); shape(rm, [[470, -340], [300, -250], [300, 120], [470, 290]], F(3.6));
      R(rm, -300, -250, 600, 370, 0, F(3.6)); shape(rm, [[-300, 120], [300, 120], [470, 290], [-470, 290]], F(3.2)); [-150, 0, 150].forEach(x => rm.line(x, 120, x * 1.56, 290, S(1.4)));
      const dr = popAt(p, -385, 0, tu(.3)); shape(dr, [[-440, -170], [-350, -130], [-350, 140], [-440, 196]], F(3.2)); dr.circle(-366, 20, 7, F(2));
      const wn = popAt(p, 385, -60, tu(.36)); shape(wn, [[350, -210], [440, -250], [440, 10], [350, 40]], { fill: 'rgba(255,255,255,.08)', sw: 3.2 }); wn.line(395, -230, 395, 25, S(1.6)); wn.line(350, -85, 440, -120, S(1.6));
      R(popAt(p, 0, -150, tu(.44)), -110, -220, 220, 150, 10, F(3.6)); placeV(p, c, X, 0, -146, 90, -30, { size: 36, maxW: 480, bigSize: 34, bigW: 200, bigDy: 10 });
      spot(p, c, Sp[0], -130, 200, { t: tS(Q, 0), side: 1, r: 36 }); spot(p, c, Sp[1], 150, 200, { t: tS(Q, 1), side: 1, r: 36 });
    }); });

  /* 08 ── A PERSON IN THE OPEN (คนยืนในพื้นที่เปิด): the horizon and the ground lines draw; the person comes up in the middle of the open; the
     flag goes up its pole with the place; the spot markers on the ground */
  variant('openspace', 'คนยืนในที่โล่ง', (d, c) => { const X = PL(d), Sp = SP(d), Q = TL();
    art(c, p => { drawAt(p.line(-480, 40, 480, 40, S(2)), p, 0, tu(.3)); [-1, -.5, 0, .5, 1].forEach((u, i) => drawAt(p.line(f1(u * 120), 40, f1(u * 700), 350, S(1.2)), p, tu(.06 + .03 * i), tu(.3)));
      ell(p, -60, 252, 90, 16, S(1.8)); body(inG(p, 'rise', -60, 140, tu(.2)), -60, 250, .78);
      R(inG(p, 'rise', 180, 50, tu(.26)), 172, -230, 14, 480, 5, F(2.6)); const fl = inG(p, 'pop', 190, -170, tu(.36)); fl.path('M 186 -230 L 420 -230 Q 400 -170 420 -110 L 186 -110 Z', F(4));
      placeV(p, c, X, 290, -186, 70, -134, { size: 30, maxW: 200, bigSize: 32, bigW: 200, bigDy: 6 });
      [[Sp[0], -360, 150], [Sp[1], 380, 250]].forEach(([S0, x, y], i) => { if (!S0) return; ell(p, x, y + 50, 50, 10, S(1.6)); spot(p, c, S0, x, y, { t: tS(Q, i), side: 0, r: 36 }); });
    }); });

  /* 09 ── TWO STREETS CROSS (ถนนสองสายตัดกัน): the two roads draw in, their lane marks; the spot markers on the corners; the pin drops on the
     crossing with the place */
  variant('crossroads', 'ถนนสองสายตัดกัน', (d, c) => { const X = PL(d), Sp = SP(d), Q = TL();
    art(c, p => { const r1 = mvG(p, { px: 0, py: 105, sx: [[0, 0], [tu(.04), 0], [tu(.4), 1, 'out']], o: fadeIn(tu(.04), .04) }); R(r1, -480, 40, 960, 130, 0, { fill: 'rgba(255,255,255,.06)', sw: 0, stroke: 'none' }); r1.line(-480, 40, 480, 40, W(3.4)); r1.line(-480, 170, 480, 170, W(3.4));
      for (let x = -460; x < 460; x += 80) if (Math.abs(x + 20) > 140) r1.line(x, 105, x + 40, 105, S(2.4));
      const r2 = mvG(p, { px: 0, py: 290, sy: [[0, 0], [tu(.2), 0], [tu(.56), 1, 'out']], o: fadeIn(tu(.2), .04) }); shape(r2, [[-60, -340], [60, -340], [180, 290], [-180, 290]], { fill: C.fill, sw: 0, stroke: 'none' });
      r2.line(-60, -340, -96, 40, W(3.4)); r2.line(60, -340, 96, 40, W(3.4)); r2.line(-138, 170, -180, 290, W(3.4)); r2.line(138, 170, 180, 290, W(3.4)); [[-330, -290], [-250, -200], [-150, -100]].forEach(([a, b]) => r2.line(0, a, 0, b, S(2.4))); r2.line(0, 200, 0, 280, S(2.4));
      pin(inG(CL(p), 'drop', 0, -20, f3(Q.H - tu(.3))), 0, -20, 64); placeV(p, c, X, 0, -20, 70, -120, { size: 40, maxW: 380, bigSize: 28, bigW: 90, bigDy: 6 });
      spot(p, c, Sp[0], -310, -100, { t: tS(Q, 0), side: 0, r: 40 }); spot(p, c, Sp[1], 320, 230, { t: tS(Q, 1), side: -1, r: 36 });
    }); });

  /* 10 ── THE ENTRANCE GATE (ประตูทางเข้าสถานที่): the pillars rise, the beam drops on them; the gates swing open; the spots on the pillars;
     the place lands on the beam */
  variant('gate', 'ประตูทางเข้า', (d, c) => { const X = PL(d), Sp = SP(d), Q = TL();
    art(c, p => { floorD(p); [-285, 285].forEach((x, i) => { const g = inG(p, 'rise', x, 70, tu(.04 + .05 * i)); R(g, x - 48, -150, 96, 440, 10, F(4.2)); R(g, x - 60, 250, 120, 40, 8, F(3)); });
      const bm = inG(CL(p), 'drop', 0, -205, tu(.2)); R(bm, -390, -262, 780, 112, 16, F(4.8)); R(bm, -366, -240, 732, 68, 10, S(1.4));
      [-1, 1].forEach(sd => { const lf = mvG(p, { px: sd * 236, py: 100, sx: [[0, 1.4], [tu(.4), 1.4], [tu(.8), 1, 'io']], o: fadeIn(tu(.36)) }); shape(lf, [[sd * 236, -100], [sd * 130, -60], [sd * 130, 250], [sd * 236, 290]], F(3.2));
        for (let k = 1; k < 4; k++) { const x = sd * (236 - 26.5 * k); lf.line(x, -100 + 10 * k, x, 290 - 10 * k, S(1.6)); } });
      placeH(p, c, X, -300, -206, 70, -240, { size: 46, maxW: 560, cx: 0, cy: -210, bigSize: 48, bigW: 680 });
      spot(p, c, Sp[0], -285, 30, { t: tS(Q, 0), side: 0, r: 34, size: 22, maxW: 150 }); spot(p, c, Sp[1], 285, 30, { t: tS(Q, 1), side: 0, r: 34, size: 22, maxW: 150 });
    }); });

  /* 11 ── THE WIDE VIEW (ภาพมุมกว้างของพื้นที่): the wide frame opens from the middle; the hills, the buildings, the trees draw in it; the spot
     markers; the pin drops above with the place */
  variant('panorama', 'ภาพมุมกว้าง', (d, c) => { const X = PL(d), Sp = SP(d), Q = TL();
    art(c, p => { R(mvG(p, { px: 0, py: 45, sx: [[0, .05], [tu(.04), .05], [tu(.4), 1, 'out']], o: fadeIn(tu(.04), .04) }), -470, -120, 940, 330, 16, F(4.6));
      const sc = clipG(p, -458, -108, 916, 306); drawAt(sc.path('M -470 140 Q -300 20 -140 100 Q 0 160 140 60 Q 300 -40 470 90', S(2.4)), p, tu(.3), tu(.4));
      [[-380, 70, 160], [-300, 50, 110], [180, 40, 190], [250, 60, 150], [330, 44, 120]].forEach(([x, w, h], i) => R(atG(sc, tu(.4 + .04 * i)), x, 200 - h, w, h, 4, F(2.6)));
      [[-180, 170, .8], [-120, 180, .7], [60, 190, .8], [420, 190, .7]].forEach(([x, y, k], i) => tree(atG(sc, tu(.5 + .03 * i)), x, y, k));
      pin(inG(CL(p), 'drop', 0, -220, f3(Q.H - tu(.3))), 0, -240, 64); placeV(p, c, X, 0, -240, 70, 280, { size: 44, maxW: 700, bigSize: 28, bigW: 90, bigDy: 6 });
      spot(p, c, Sp[0], -230, 40, { t: tS(Q, 0), side: 1, r: 34 }); spot(p, c, Sp[1], 150, -30, { t: tS(Q, 1), side: 1, r: 34 });
    }); });

  /* 12 ── INSIDE A ROOM (ภาพภายในห้อง): the window and the frame pop on the wall, the sofa slides in, the lamp rises and comes on; the spots
     on the sofa and by the lamp; the place lands in the frame */
  variant('interior', 'ภาพภายในห้อง', (d, c) => { const X = PL(d), Sp = SP(d), Q = TL();
    art(c, p => { floorD(p, 220); const wn = popAt(p, 245, -160, tu(.04)); R(wn, 160, -270, 170, 210, 10, F(3.6)); wn.line(245, -270, 245, -60, S(1.6)); wn.line(160, -165, 330, -165, S(1.6));
      R(popAt(p, -60, -180, tu(.1)), -200, -270, 280, 180, 10, F(3.8)); placeV(p, c, X, -60, -186, 90, -40, { size: 34, maxW: 360, bigSize: 34, bigW: 250, bigDy: 6 });
      const sf = mvG(p, { x: slideX(tu(.2), -120), o: fadeIn(tu(.2)) }); R(sf, -260, 20, 400, 110, 30, F(3.6)); R(sf, -300, 60, 64, 140, 24, F(3.6)); R(sf, 116, 60, 64, 140, 24, F(3.6)); R(sf, -240, 110, 360, 70, 18, F(3.6)); [-260, 140].forEach(x => sf.line(x, 200, x, 220, W(5)));
      const lp = inG(p, 'rise', 420, 40, tu(.3)); lp.line(420, -110, 420, 210, W(4)); ell(lp, 420, 214, 44, 8, F(2.6)); shape(lp, [[380, -180], [460, -180], [480, -110], [360, -110]], F(3.4));
      shape(flick(p, keyAt(Q.T0, .2)), [[370, -110], [470, -110], [500, 0], [340, 0]], { fill: 'rgba(255,255,255,.08)', sw: 0, stroke: 'none' });
      spot(p, c, Sp[0], -60, 60, { t: tS(Q, 0), side: 1, r: 36 }); spot(p, c, Sp[1], 420, 100, { t: tS(Q, 1), side: -1, r: 34 });
    }); });

  /* 13 ── STANDING AT THE ENTRANCE (คนยืนหน้าทางเข้า): the shopfront rises, the awning unrolls, the door; the person comes up in front of it;
     the spots in the window; the place lands on the sign board */
  variant('entrance', 'คนยืนหน้าทางเข้า', (d, c) => { const X = PL(d), Sp = SP(d), Q = TL();
    art(c, p => { floorD(p); const f = inG(p, 'rise', 0, 20, tu(.04)); R(f, -360, -250, 720, 540, 12, F(4.4)); R(f, -100, 0, 200, 290, 8, { fill: 'rgba(255,255,255,.08)', sw: 3.2 }); f.line(0, 0, 0, 290, S(1.6)); f.circle(-20, 150, 6, F(2)); f.circle(20, 150, 6, F(2));
      R(f, -330, 10, 190, 180, 8, { fill: 'rgba(255,255,255,.06)', sw: 3 }); R(f, 140, 10, 190, 180, 8, { fill: 'rgba(255,255,255,.06)', sw: 3 });
      R(popAt(p, 0, -175, tu(.16)), -250, -230, 500, 110, 14, F(4)); const aw = mvG(p, { px: 0, py: -100, sy: [[0, 0], [tu(.3), 0], [tu(.56), 1.06, 'out'], [tu(.64), 1, 'soft']], o: fadeIn(tu(.3), .04) });
      aw.path('M -230 -100 L 230 -100 L 260 -40 Q 228 -14 196 -40 Q 164 -14 132 -40 Q 100 -14 68 -40 Q 36 -14 4 -40 Q -28 -14 -60 -40 Q -92 -14 -124 -40 Q -156 -14 -188 -40 Q -220 -14 -260 -40 Z', F(3.6));
      placeH(p, c, X, -180, -176, 70, -126, { size: 42, maxW: 360, cx: 0, cy: -180, bigSize: 46, bigW: 470 });
      body(inG(p, 'rise', 230, 160, tu(.36)), 240, 300, .82);
      spot(p, c, Sp[0], -235, 100, { t: tS(Q, 0), side: 0, r: 34, size: 22, maxW: 170 }); spot(p, c, Sp[1], 235, 60, { t: tS(Q, 1), side: 0, r: 30, size: 22, maxW: 170 });
    }); });

  /* 14 ── THE STREET SIGN (ป้ายชื่อถนน): the pole rises; the top blade swings in with the place; the lower blades with the spots */
  variant('streetsign', 'ป้ายชื่อถนน', (d, c) => { const X = PL(d), Sp = SP(d), Q = TL();
    art(c, p => { floorD(p); p.line(-480, 250, 480, 250, S(1.6)); const pl = inG(p, 'rise', 0, 60, tu(.04)); R(pl, -12, -300, 24, 590, 6, F(2.8)); pl.circle(0, -306, 14, F(2.6));
      const bl = mvG(p, { px: 0, py: -210, sx: [[0, 0], [tu(.2), 0], [tu(.5), 1.04, 'out'], [tu(.6), 1, 'soft']], o: fadeIn(tu(.2), .04) }); R(bl, -320, -260, 640, 100, 18, F(4.6)); R(bl, -300, -244, 600, 68, 10, S(1.4));
      placeH(p, c, X, -250, -210, 64, -200, { size: 44, maxW: 470, cx: 0, cy: -214 });
      Sp.forEach((S0, i) => { const y = -60 + 110 * i, sd = i ? 1 : -1, t = tS(Q, i), g = mvG(p, { px: 0, py: y, sx: [[0, 0], [f3(t - tu(.2)), 0], [t, 1.04, 'out'], [f3(t + tu(.1)), 1, 'soft']], o: fadeIn(f3(t - tu(.2)), .04) });
        shape(g, sd < 0 ? [[0, y - 36], [-300, y - 36], [-340, y], [-300, y + 36], [0, y + 36]] : [[0, y - 36], [300, y - 36], [340, y], [300, y + 36], [0, y + 36]], F(4));
        if (picOf(S0)) put(p, c, { icon: S0.icon }, sd * 50, y, 48, null, { t: t + tu(.04) }); if (S0.label) txt(atG(p, t + tu(.08)), S0.label, sd * (picOf(S0) ? 90 : 40), y + 10, { size: 30, maxW: 220, weight: 700, color: C.ink, anchor: sd < 0 ? 'end' : 'start' }); });
    }); });

  /* 15 ── THE FLOOR PLAN (แผนผังพื้นที่): the outer walls draw, the inner walls and the door swings; the spot rooms light up with their icons;
     the place lands on the title under the plan */
  variant('floorplan', 'แผนผังพื้นที่', (d, c) => { const X = PL(d), Sp = SP(d), Q = TL();
    art(c, p => { drawAt(p.path('M -420 -280 L 420 -280 L 420 160 L -420 160 Z', W(6)), p, tu(.04), tu(.4));
      ['M -60 -280 L -60 -120 M -60 -40 L -60 160', 'M -420 -40 L -180 -40 M -110 -40 L -60 -40', 'M 180 -40 L 180 160 M -60 -40 L 60 -40 M 130 -40 L 420 -40'].forEach((dd, i) => drawAt(p.path(dd, W(4)), p, tu(.3 + .05 * i), tu(.3)));
      ['M -180 -40 A 70 70 0 0 1 -110 -110', 'M -60 -120 A 80 80 0 0 1 20 -40', 'M 60 -40 A 70 70 0 0 0 130 30'].forEach((dd, i) => drawAt(p.path(dd, S(1.6)), p, tu(.5 + .04 * i), tu(.2)));
      [[Sp[0], -420, -280, 360, 240, -240, -160], [Sp[1], 180, -40, 240, 200, 300, 60]].forEach(([S0, x, y, w, h, cx, cy], i) => { if (!S0) return; R(atG(p, tS(Q, i)), x + 6, y + 6, w - 12, h - 12, 4, { fill: LIT, sw: 0, stroke: 'none' }); spot(p, c, S0, cx, cy, { t: tS(Q, i), side: 0, r: 40, maxW: 220 }); });
      placeH(p, c, X, -130, 240, 64, -80, { size: 44, maxW: 480, cx: 0, cy: 240 });
    }); });

  /* 16 ── THE MARKED PLOT (พื้นที่ในกรอบสี่เหลี่ยม): the corner stakes go in, the rope runs round them; the sign post goes up with the place;
     the spot flags go in inside the plot */
  variant('plot', 'พื้นที่ในกรอบ', (d, c) => { const X = PL(d), Sp = SP(d), Q = TL(), K = [[-330, 20], [330, 20], [440, 260], [-440, 260]];
    art(c, p => { p.line(-480, 20, 480, 20, S(1.4)); K.forEach(([x, y], i) => R(inG(p, 'rise', x, y - 30, tu(.04 + .04 * i)), x - 8, y - 60, 16, 64, 4, F(2.6)));
      drawAt(p.path(pathOf(K.map(([x, y]) => [x, y - 50])), W(3)), p, tu(.3), tu(.4));
      const sg = inG(p, 'rise', 0, -60, tu(.5)); R(sg, -8, -60, 16, 160, 4, F(2.6)); R(sg, -170, -280, 340, 220, 18, F(4.4));
      placeV(p, c, X, 0, -200, 90, -90, { size: 34, maxW: 300, bigSize: 38, bigW: 310 });
      [[Sp[0], -220, 200], [Sp[1], 230, 170]].forEach(([S0, x, y], i) => { if (!S0) return; const g = popAt(p, x, y, tS(Q, i)); g.line(x, y, x, y - 70, W(3)); shape(g, [[x, y - 70], [x + 40, y - 58], [x, y - 46]], F(2.4)); spot(p, c, S0, x - 70, y - 40, { t: tS(Q, i), side: -1, r: 30, size: 24, maxW: 150 }); });
    }); });

  /* 17 ── THE WAY SIGN (ป้ายบอกทาง): the board drops on its rods; the place's row lights with its arrow, then the spot rows */
  variant('wayboard', 'ป้ายบอกทาง', (d, c) => { const X = PL(d), Sp = SP(d), Q = TL();
    art(c, p => { const bd = inG(CL(p), 'drop', 0, 0, tu(.04)); [-300, 300].forEach(x => bd.line(x, -350, x, -230, W(3))); R(bd, -420, -230, 840, 470, 24, F(4.8)); [-60, 80].forEach(y => bd.line(-390, y, 390, y, S(1.6)));
      placeH(p, c, X, -330, -145, 76, -270, { size: 46, maxW: 470, cx: -40, cy: -150 }); arrowR(atG(p, f3(Q.H - tu(.06))), 330, -145, 0, 1.3);
      Sp.forEach((S0, i) => { const y = 10 + 140 * i, t = tS(Q, i); if (picOf(S0)) put(p, c, { icon: S0.icon }, -330, y, 56, null, { t }); if (S0.label) txt(atG(p, t + tu(.06)), S0.label, picOf(S0) ? -270 : -350, y + 12, { size: 36, maxW: 500, weight: 700, color: C.ink, anchor: 'start' }); arrowR(atG(p, t + tu(.1)), 330, y, i ? -90 : 180, 1.1); });
    }); });

  /* 18 ── FROM ABOVE (ภาพสถานที่จากมุมสูง): the roads draw, the blocks and the trees pop; the spot blocks light; the place's block lights and
     the place lands on its roof */
  variant('aerial', 'มุมสูง', (d, c) => { const X = PL(d), Sp = SP(d), Q = TL();
    art(c, p => { [[-480, 150, 960, 60], [-220, -350, 60, 700], [200, -350, 60, 700]].forEach(([x, y, w, h], i) => R(atG(p, tu(.04 + .05 * i)), x, y, w, h, 0, { fill: 'rgba(255,255,255,.07)', sw: 0, stroke: 'none' }));
      [[-480, 150, 480, 150], [-480, 210, 480, 210], [-220, -350, -220, 150], [-160, -350, -160, 150], [200, -350, 200, 150], [260, -350, 260, 150], [-220, 210, -220, 350], [-160, 210, -160, 350], [200, 210, 200, 350], [260, 210, 260, 350]].forEach((L, i) => drawAt(p.line(...L, S(1.8)), p, tu(.04), tu(.3)));
      [[-450, -320, 180, 140], [-450, -150, 180, 260], [300, -320, 160, 150], [300, -130, 160, 240], [-450, 250, 230, 90], [-120, 250, 280, 90], [300, 250, 160, 90]].forEach(([x, y, w, h], i) => { const g = popAt(p, x + w / 2, y + h / 2, tu(.2 + .03 * i)); R(g, x, y, w, h, 8, F(3)); R(g, x + 16, y + 16, w - 32, h - 32, 4, S(1.2)); });
      [[-110, -320], [110, -320], [-110, 110], [110, 110]].forEach(([x, y], i) => popAt(p, x, y, tu(.4 + .03 * i)).circle(x, y, 26, F(2.6)));
      const hb = popAt(p, 0, -100, tu(.5)); R(hb, -120, -260, 240, 320, 12, F(4)); R(flick(p, keyAt(Q.T0, .3)), -104, -244, 208, 288, 6, { fill: LIT, sw: 0, stroke: 'none' });
      placeV(p, c, X, 0, -136, 110, 20, { size: 34, maxW: 220, bigSize: 36, bigW: 220 });
      spot(p, c, Sp[0], -360, -260, { t: tS(Q, 0), side: 0, r: 30, size: 20, maxW: 150 }); spot(p, c, Sp[1], 380, -60, { t: tS(Q, 1), side: 0, r: 36, size: 22, maxW: 150 });
    }); });

  /* 19 ── THE LANDSCAPE AND ITS LANDMARK (ภูมิทัศน์พร้อมจุดเด่น): the hills draw back to front, the lake and the trees; the tower rises on the
     hilltop; the spots by the lake and the trees; the place lands on the tower */
  variant('landmark', 'ภูมิทัศน์จุดเด่น', (d, c) => { const X = PL(d), Sp = SP(d), Q = TL();
    art(c, p => { drawAt(p.path('M -480 120 Q -320 -40 -150 60 Q -20 130 120 40 Q 300 -60 480 80', S(2)), p, tu(.04), tu(.4));
      inG(p, 'rise', 0, 150, tu(.12)).path('M -480 250 L -480 190 Q -260 60 0 40 Q 260 60 480 190 L 480 250 Z', F(3.6)); p.line(-480, 250, 480, 250, S(2));
      ell(popAt(p, 300, 205, tu(.3)), 300, 205, 120, 22, { fill: 'rgba(255,255,255,.1)', sw: 2.4 }); [[-330, 210, .8], [-260, 220, .7], [-400, 225, .7]].forEach(([x, y, k], i) => tree(popAt(p, x, y - 40, tu(.34 + .03 * i)), x, y, k));
      const tw = inG(clipG(p, -500, -350, 1000, 390), 'rise', 0, -100, tu(.44)); R(tw, -56, -170, 112, 212, 6, F(4)); shape(tw, [[-76, -170], [76, -170], [0, -268]], F(4)); R(tw, -20, -6, 40, 48, 4, F(2.4)); tw.circle(0, -96, 46, F(3));
      placeV(p, c, X, 0, -96, 62, 300, { size: 44, maxW: 600, bigSize: 26, bigW: 80, bigDy: 4 });
      spot(p, c, Sp[0], 300, 120, { t: tS(Q, 0), side: 0, r: 36 }); spot(p, c, Sp[1], -200, 120, { t: tS(Q, 1), side: 1, r: 32 });
    }); });

  /* 20 ── THE LOCATION PLAQUE (แผ่นป้ายพิกัด): the plaque pops with its screws; the crosshair draws (rings, cross, ticks); the spot lines; the
     place lands in the crosshair, its name beside (no coordinates — no numbers the data does not give) */
  variant('plaque', 'แผ่นป้ายพิกัด', (d, c) => { const X = PL(d), Sp = SP(d), Q = TL(), cx = -200, cy = -20;
    art(c, p => { const pq = inG(p, 'pop', 0, 0, tu(.04)); R(pq, -440, -270, 880, 540, 30, F(4.8)); [[-404, -234], [404, -234], [-404, 234], [404, 234]].forEach(([x, y]) => screw(pq, x, y, 8));
      drawAt(p.circle(cx, cy, 170, W(4)), p, tu(.2), tu(.4)); drawAt(p.circle(cx, cy, 120, S(1.8)), p, tu(.26), tu(.4));
      [[cx - 200, cy, cx - 70, cy], [cx + 70, cy, cx + 200, cy], [cx, cy - 200, cx, cy - 70], [cx, cy + 70, cx, cy + 200]].forEach((L, i) => drawAt(p.line(...L, W(3)), p, tu(.4 + .04 * i), tu(.2)));
      for (let k = 0; k < 24; k++) if (k % 6) { const g = atG(p, tu(.5)); tick(g, cx, cy, k * 15, 158, 170, S(1.6)); }
      placeH(p, c, X, cx, cy, 120, 40, { dy: -40, size: 48, maxW: 360, cx: 200, cy: -80 });
      p.line(40, 20, 400, 20, S(1.6)); Sp.forEach((S0, i) => { const y = 80 + 80 * i; spot(p, c, S0, 70, y, { t: tS(Q, i), side: 1, r: 26, size: 28, maxW: 280 }); });
    }); });

  /* ---------- sample data (A: places from unrelated topics · B: stress) ---------- */
  const I = (icon, label) => label ? (icon ? { icon, label } : { label }) : { icon };
  const D = (say, place, spots) => ({ say, place, spots });
  const SAMPLES = [
    D('ออฟฟิศเราอยู่ตึกนี้ ชั้น 12', I('building-2', 'ออฟฟิศ'), [I(null, 'ชั้น 12')]),
    D('ย่านนี้มีตึกออฟฟิศเยอะ', I('building', 'ย่านธุรกิจ'), [I('coffee', 'ร้านกาแฟ'), I('store', 'ร้านค้า')]),
    D('ร้านอยู่ในซอยข้างตลาด', I('store', 'ร้านเรา'), [I('shopping-cart', 'ตลาด')]),
    D('บ้านอยู่ใกล้โรงเรียน', I('house', 'บ้าน'), [I('school', 'โรงเรียน'), I('trees', 'สวน')]),
    D('สวนสาธารณะลุมพินี', I('trees', 'สวนลุมพินี'), [I(null, 'ประตู 1')]),
    D('เจอกันที่สถานีรถไฟ', I('train-front', 'สถานีรถไฟ'), [I('coffee', 'หน้าร้านกาแฟ')]),
    D('ห้องทำงานที่บ้าน', I('house', 'ห้องทำงาน'), [I('lamp', 'มุมโคมไฟ'), I('book-open', 'ชั้นหนังสือ')]),
    D('ไปตั้งแคมป์ที่เขาใหญ่', I('tent', 'เขาใหญ่'), [I('mountain', 'จุดชมวิว')]),
    D('ร้านอยู่ตรงสี่แยก', I('store', 'ร้านเรา'), [I('car', 'ที่จอดรถ'), I('coffee', 'คาเฟ่')]),
    D('งานจัดที่ศูนย์ประชุม', I('landmark', 'ศูนย์ประชุม'), [I(null, 'ฮอลล์ 1'), I(null, 'ลานจอดรถ')]),
    D('เมืองนี้วิวสวยมาก', I('mountain', 'เชียงใหม่'), [I('trees', 'ดอย'), I('coffee', 'คาเฟ่')]),
    D('ห้องนั่งเล่นที่บ้าน', I('sofa', 'ห้องนั่งเล่น'), [I('tv', 'ทีวี'), I('lamp', 'โคมไฟ')]),
    D('ร้านกาแฟหน้าปากซอย', I('coffee', 'ร้านกาแฟ'), [I('utensils', 'ขนม')]),
    D('อยู่ถนนสุขุมวิท', I('map-pin', 'สุขุมวิท'), [I(null, 'ซอย 11'), I(null, 'BTS นานา')]),
    D('ผังบ้านใหม่', I('house', 'บ้านใหม่'), [I('bed', 'ห้องนอน'), I('cooking-pot', 'ครัว')]),
    D('ที่ดินแปลงนี้', I('trees', 'ที่ดินเรา'), [I('house', 'บ้าน'), I('trees', 'สวน')]),
    D('ห้างนี้ชั้น G มี KFC', I('shopping-bag', 'ห้าง'), [I(null, 'ชั้น G'), I('utensils', 'KFC')]),
    D('โรงพยาบาลอยู่กลางเมือง', I('hospital', 'โรงพยาบาล'), [I('school', 'โรงเรียน'), I('trees', 'สวน')]),
    D('วัดบนเขา', I('landmark', 'วัดบนเขา'), [I(null, 'ทะเลสาบ'), I('trees', 'ป่า')]),
    D('จุดนัดพบอยู่ที่นี่', I('map-pin', 'จุดนัดพบ'), [I(null, 'ทางออก 3')]),
  ];
  const STRESS = [
    D('ไม่มีจุดย่อย', I('building-2', 'สำนักงานใหญ่'), null),
    D('ชื่อยาว', I('building', 'ศูนย์การค้าแห่งใหม่ใจกลางเมือง'), [I('store', 'ร้านค้าย่อยหลายร้าน')]),
    D('ไม่มีไอคอน', I(null, 'ตลาดน้ำ'), [I(null, 'ท่าเรือ')]),
    D('ภาษาอังกฤษ', I('house', 'Home'), [I('bed', 'Bedroom'), I('sofa', 'Living room')]),
    D('ชื่อไอคอนที่ไม่มี', I('no-such-icon', 'สนามกีฬา'), [I('no-such', 'อัฒจันทร์')]),
    D('ไม่มีอะไรเลย', null, null),
    D('จุดย่อยไม่มีไอคอนยาว', I('house', 'บ้าน'), [I(null, 'ห้องเก็บของหลังบ้าน'), I(null, 'โรงรถ')]),
    D('ไอคอนอย่างเดียว', I('tent'), null),
    D('สั้นมาก', I('store', 'ร้าน'), [I('car', 'รถ')]),
    D('อังกฤษยาว', I('landmark', 'International Convention Center'), [I(null, 'Hall A')]),
    D('ไม่มีไอคอน 2', I(null, 'ภูเขาไฟฟูจิ'), null),
    D('จุดเดียว', I('sofa', 'ห้องรับแขก'), [I('tv', 'ทีวี')]),
    D('ไม่มีที่ มีจุด', null, [I('coffee', 'ร้านกาแฟ')]),
    D('ถนนยาว', I('map-pin', 'ถนนราชดำเนินกลาง'), [I(null, 'อนุสาวรีย์ประชาธิปไตย')]),
    D('ผังไม่มีจุด', I('building-2', 'ออฟฟิศ'), null),
    D('สองจุดยาว', I('trees', 'สวน'), [I('house', 'ศาลาพักผ่อน'), I('trees', 'สนามเด็กเล่น')]),
    D('อังกฤษ', I('shopping-bag', 'Mall'), [I(null, 'Floor 2'), I('coffee', 'Cafe')]),
    D('จุดไม่มีไอคอน', I('hospital', 'โรงพยาบาล'), [I(null, 'ตึก A'), I(null, 'ตึก B')]),
    D('ยาวทั้งคู่', I('mountain', 'อุทยานแห่งชาติดอยอินทนนท์'), [I(null, 'จุดชมวิวกิ่วแม่ปาน')]),
    D('ไม่มีอะไรเลย 2', null, null),
  ];

  G.cats = G.cats || {};
  G.cats.B21 = { variants: V, SAMPLES, STRESS, draw: (i, d, c) => { setZ(c); CUR = V[i].id; V[i].build(d || {}, c); }, CLAMPS, timing: c => (setZ(c), Object.assign({}, Z)) };
})();
