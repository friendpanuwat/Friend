/* b16.js — category B16 "นิยาม" (definition: X is Y). House style of B01–B15; line weight as the user pointed to (pro icons, B01–B03 clips:
   "แค่อยากให้ดูลายเส้นการวาด") — bold bright outer outlines, round corners, few thin inner lines, big clear icons, one solid silhouette per thing.
   Designs from the user's ideas in references/cutpack-visual-ideas.md ("นิยาม", 20 ideas) — not copied from the clips.
   CutPack (references/cutpack-CATEGORIES.md v2, cat_ai.py): term THING (icon + label, label required) · means 1–3 THING.
   No term icon → the term's label big; nothing → a lit four-point star. Means: icon + label rows (no icon → a dot; none → two faint lines).
   GL.cats.B16.draw(i, data, { x, y, s, at, hit, speed }) — canvas 1000 × 700 centred at (0,0); hit = seconds after `at` (default 1.9). */
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
    cp.id = 'b16clip' + (++CID); Object.entries({ x, y, width: w, height: h }).forEach(([k, v]) => r.setAttribute(k, v)); cp.appendChild(r);
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


  /* ---------- the data: term (icon + label) · means (1–3 things) ---------- */
  const TM = d => d && d.term && has(d.term) ? d.term : null;
  const MS = d => (d && Array.isArray(d.means) ? d.means.filter(has) : []).slice(0, 3);
  const DOT = (q, x, y, r = 8) => q.circle(x, y, r, SOLID(1));
  /* the means as rows (icon or a dot + label), centred on y; none → two faint lines */
  function rows(q, c, M, x, y, w, o = {}) { const n = M.length, ic = (o.ic || 54) * 1.2, size = (o.size || 34) * 1.25, gap = Math.max(o.gap || 76, ic + 12);
    if (!n) { lines(atG(q, (o.tm || (() => Z.H))(0)), x, y - 15, w * .8, 2, 30, S(2), [1]); return; }
    const y0 = y - (n - 1) * gap / 2;
    const tm = o.tm || (() => Z.H);
    M.forEach((m, i) => { const yy = y0 + i * gap, pi = !!picOf(m), lx = pi ? x + ic + 18 : x + 32, t = tm(i), lg = mvG(q, { x: [[0, -26], [t + tu(.04), -26], [t + tu(.26), 0, 'out']], o: fadeIn(t + tu(.04)) });
      if (pi) put(q, c, { icon: m.icon }, x + ic / 2, yy, ic, null, { t, punch: t + tu(.16) }); else DOT(popAt(q, x + 10, yy, t), x + 10, yy);
      if (m.label) txt(lg, m.label, lx, yy + size * .36, { size, maxW: x + w - lx, weight: 600, color: C.ink, anchor: 'start', wrap: n === 1 ? 'mid' : null }); }); }
  /* the means side by side (icon over label) between x0 and x1, centred on y */
  function cols(q, c, M, x0, x1, y, o = {}) { const n = M.length, ic = (o.ic || 64) * 1.2, size = (o.size || 28) * 1.25;
    if (!n) { lines(atG(q, Z.H), x0 + (x1 - x0) * .15, y - 15, (x1 - x0) * .7, 2, 30, S(2), [1]); return; }
    const w = (x1 - x0) / n, tm = o.tm || (() => Z.H);
    M.forEach((m, i) => { const cx = x0 + w * (i + .5), t = tm(i);
      if (picOf(m)) { put(q, c, { icon: m.icon }, cx, y - (m.label ? ic * .32 : 0), ic, null, { t, punch: t + tu(.16) }); if (m.label) txt(atG(q, t + tu(.1)), m.label, cx, y + ic * .5 + size * .5, { size, maxW: w - 24, weight: 600, color: C.ink, wrap: n === 1 ? 'down' : null }); }
      else txt(popAt(q, cx, y, t), m.label, cx, y + size * .4, { size: size * 1.1, maxW: w - 24, weight: 700, color: C.ink, wrap: n === 1 ? 'mid' : null }); }); }
  /* the term sideways (icon + label) or stacked — thin wrappers so every design reads the same */
  const termH = (q, c, T, ix, iy, w, lx, o = {}) => heroH(q, c, T, ix, iy, w, lx, iy + (o.dy ?? 18), Object.assign({ rip: false, size: 52, maxW: 420, bigSize: 58, bigW: 600 }, o));
  const termV = (q, c, T, x, y, w, ly, o = {}) => hero(q, c, T, x, y, w, ly, Object.assign({ rip: false, size: 46, maxW: 380, bigSize: 56, bigW: 420 }, o));


  /* ---------- motion (user 2026-11-13 "ทำเคลื่อนไหวได้"): the thing comes in part by part and does its job (drops, swings, opens, rises,
     slides out) → the term lands at T0 → the meanings come in one by one, the last one on the keyword H → hold. Last frame = the approved still. ---------- */
  /* a hung thing drops in at t0 and swings, the swing squeezed to settle exactly at `end` (keys never run past it) */
  const swingFit = (t0, end, a = 6) => { const L = Math.max(tu(.2), end - t0), at = k => f3(t0 + L * k);
    return { y: [[0, -300], [Math.max(0, t0 - tu(.18)), -300], [t0, 10, 'in'], [f3(t0 + tu(.06)), 0, 'out']],
      r: [[0, 0], [t0, 0], [at(.3), a, 'out'], [at(.6), -a * .5, 'io'], [at(.85), a * .2, 'io'], [at(1), 0, 'soft']], o: fadeIn(Math.max(0, t0 - tu(.18))) }; };
  const mT = (T, n) => i => n > 1 ? f3(lerp(T.T0 + tu(.3), T.H, i / (n - 1))) : T.H;

  /* 01 ── THE BOARD: the board pops onto the wall, the ledge slides in, chalk and eraser drop on; the term is written, underlined, then the meanings */
  variant('board', 'คำศัพท์บนกระดาน', (d, c) => { const T = TM(d), M = MS(d), Q = TL();
    art(c, p => { const bd = inG(p, 'pop', 0, -40, tu(.04)); R(bd, -430, -300, 860, 520, 32, F(4.6)); R(bd, -404, -274, 808, 468, 18, S(1.6));
      R(mvG(p, { px: 0, py: 235, sx: [[0, .05], [tu(.2), .05], [tu(.45), 1.02, 'out'], [tu(.55), 1, 'soft']], o: fadeIn(tu(.2), .04) }), -330, 222, 660, 26, 13, F(3.4));
      R(inG(p, 'drop', -215, 212, tu(.5)), -250, 202, 70, 20, 8, F(2.6)); R(inG(p, 'drop', 220, 208, tu(.58)), 170, 194, 100, 28, 10, F(3));
      termH(p, c, T, -300, -186, 100, -220, { cx: 0, maxW: 560, bigW: 720, t: Q.T0 }); drawAt(p.line(-340, -108, 340, -108, W(3)), p, Q.T0 + tu(.12), tu(.3));
      rows(p, c, M, -330, 50, 660, { tm: mT(Q, M.length) });
    }); });

  /* 02 ── HOLDING UP THE WORD CARD: the person rises in and lifts the arm — the card comes up with the hand; the term, then the meanings */
  variant('wordcard', 'คนถือบัตรคำ', (d, c) => { const T = TM(d), M = MS(d), Q = TL(), px = -340, tA = tu(.3), tC = tu(.6);
    art(c, p => { floorD(p);
      const hm = front(inG(p, 'rise', px, 140, tu(.04)), px, 290, 1, { 1: { s: [36, -82], e: [96, -118], h: [148, -150] } });
      hm.on('upper1', p, 0, { ox: 36, oy: -82, r: armK(98, tA, tC) }); hm.on('fore1', p, 0, { ox: 96, oy: -118, r: armK(40, tA, tC, 0) });
      const cd = popAt(p, -180, -24, tC - tu(.08)); R(cd, -176, -300, 510, 420, 34, F(4.6)); R(cd, -200, -58, 44, 70, 18, F(3));
      termV(p, c, T, 80, -222, 96, -134, { size: 40, maxW: 420, bigW: 440, bigDy: 30, t: Q.T0 }); drawAt(p.line(-120, -72, 280, -72, S(2)), p, Q.T0 + tu(.12), tu(.25));
      rows(p, c, M, -130, 34, 440, { gap: 62, size: 28, ic: 44, tm: mT(Q, M.length) });
    }); });

  /* 03 ── THE FRAMED WORD: the nail pops; the frame drops in on its cord and swings on the nail, settling; the plaque pops below; term, meanings */
  variant('framed', 'คำศัพท์ในกรอบ', (d, c) => { const T = TM(d), M = MS(d), Q = TL();
    art(c, p => { popAt(p, 0, -338, tu(.04)).circle(0, -338, 9, F(2.6));
      const sw = mvG(CL(p), Object.assign({ px: 0, py: -334 }, swingFit(tu(.3), Q.T0 - tu(.02), 6))); sw.path('M -150 -300 L 0 -334 L 150 -300', W(2.4));
      R(sw, -214, -306, 428, 330, 16, F(5)); R(sw, -182, -274, 364, 266, 8, F(2.4));
      const pl = inG(p, 'pop', 0, 175, tu(.3)); R(pl, -300, 70, 600, 210, 22, F(4.4)); [-268, 268].forEach(x => screw(pl, x, 175, 5));
      termV(p, c, T, 0, -172, 120, -50, { size: 42, maxW: 330, bigW: 330, bigSize: 50, t: Q.T0 });
      rows(p, c, M, -240, 175, 480, { gap: 58, size: 30, ic: 44, tm: mT(Q, M.length) });
    }); });

  /* 04 ── THE NOTEPAD: the pad drops onto the desk and settles at its tilt, the rings pop along the top, the margin draws; heading, underline, notes */
  variant('notepad', 'สมุดหัวข้อและคำอธิบาย', (d, c) => { const T = TM(d), M = MS(d), Q = TL();
    art(c, p => { const g0 = inG(CL(p), 'drop', 0, 0, tu(.04)), g = rot(g0, -3, 0, 0);
      R(g, -300, -270, 600, 570, 26, F(4.6)); R(g, -300, -300, 600, 80, 26, F(4.6));
      for (let x = -240, i = 0; x <= 240; x += 80, i++) { const r = popAt(g, x, -290, tu(.36 + .04 * i)); r.circle(x, -300, 11, F(2.6)); r.line(x, -289, x, -268, W(3)); }
      drawAt(g.line(-226, -200, -226, 280, S(1.8)), p, tu(.5), tu(.3));
      termH(g, c, T, -150, -146, 92, -84, { cx: 30, size: 48, maxW: 330, bigW: 430, t: Q.T0 }); drawAt(g.line(-196, -82, 260, -82, W(3)), p, Q.T0 + tu(.12), tu(.3));
      rows(g, c, M, -196, 90, 450, { tm: mT(Q, M.length) });
    }); });

  /* 05 ── THE BOOK ON ITS STAND: the legs draw, the ledge pops; the book drops on and falls open from its spine; term on the left, meanings on the right */
  variant('bookstand', 'หนังสือเปิดหน้าคำศัพท์', (d, c) => { const T = TM(d), M = MS(d), Q = TL(), tO = Math.max(tu(.5), Q.T0 - tu(.3));
    art(c, p => { floorD(p); [[-300, -340], [300, 340]].forEach(([a, b], i) => drawAt(p.line(a, 236, b, 290, W(5)), p, tu(.04 + .05 * i), tu(.2)));
      const bk = inG(CL(p), 'drop', 0, 0, tu(.24));
      [-1, 1].forEach(sd => p && mvG(bk, { px: 0, py: 0, sx: [[0, .05], [tO, .05], [tO + tu(.3), 1.02, 'out'], [tO + tu(.4), 1, 'soft']] }).path(`M 0 -246 Q ${sd * 200} -284 ${sd * 410} -246 L ${sd * 410} 204 Q ${sd * 200} 178 0 204 Z`, F(4.6)));
      bk.line(0, -246, 0, 204, W(3)); R(inG(p, 'pop', 0, 216, tu(.12)), -440, 196, 880, 40, 16, F(4.2));
      termV(p, c, T, -205, -96, 130, 44, { size: 42, maxW: 320, bigW: 330, bigSize: 50, t: Q.T0 });
      rows(p, c, M, 34, -24, 350, { gap: 74, size: 32, ic: 50, tm: mT(Q, M.length) });
    }); });

  /* 06 ── THE WORD IN A CIRCLE: the ring pops in turning; the term lands in it; the brace draws open and the meanings come out of it */
  variant('circle', 'คำในวงกลม', (d, c) => { const T = TM(d), M = MS(d), Q = TL(), cx = -250;
    art(c, p => { const rg = mvG(inG(p, 'pop', cx, 0, tu(.04)), { px: cx, py: 0, r: [[0, -40], [tu(.04), -40], [tu(.4), 3, 'out'], [tu(.55), 0, 'soft']] }); ring(rg, cx, 0, 176, 152, F(4.6)); rg.circle(cx, 0, 152, F(1));
      termV(p, c, T, cx, -38, 120, 84, { size: 40, maxW: 250, bigSize: 46, bigW: 260, bigDy: 26, t: Q.T0 });
      drawAt(p.path('M 30 -210 Q -14 -210 -14 -166 L -14 -44 Q -14 0 -58 0 Q -14 0 -14 44 L -14 166 Q -14 210 30 210', { sw: 6 }), p, Q.T0 + tu(.1), tu(.3));
      rows(p, c, M, 50, 0, 420, { gap: 92, size: 38, ic: 62, tm: mT(Q, M.length) });
    }); });

  /* 07 ── THE NAME TAG: the plinth rises; the thing drops onto it with a bump and its name lights on the plinth; the string draws out and the tag
     pops on its end with a little swing; the meanings fill the tag */
  variant('nametag', 'ป้ายชื่อวัตถุ', (d, c) => { const T = TM(d), M = MS(d), Q = TL(), cx = -230, tL = Q.T0, tS = Q.T0 + tu(.2);
    art(c, p => { floorD(p); const pl = inG(p, 'rise', cx, 220, tu(.04));
      ell(pl, cx, 270, 160, 24, F(3.4)); R(pl, cx - 160, 166, 320, 104, 0, { fill: C.fill, sw: 0, stroke: 'none' }); [cx - 160, cx + 160].forEach(x => pl.line(x, 166, x, 270, W(3.4))); ell(pl, cx, 166, 160, 24, F(3.6));
      if (T && picOf(T)) { put(p, c, T, cx, -40, 230, null, { t: tL - tu(.24), mv: { y: [[0, -90], [tL - tu(.24), -90], [tL, 0, 'in'], [tL + tu(.06), -10, 'out'], [tL + tu(.14), 0, 'soft']] } });
        if (T.label) txt(atG(p, tL + tu(.06)), T.label, cx, 236, { size: 34, maxW: 280, weight: 800, color: C.ink }); }
      else if (T) txt(popAt(p, cx, -30, tL), T.label, cx, -10, { size: 60, maxW: 360, weight: 800, color: C.ink, wrap: 'mid' }); else star4(popAt(p, cx, -40, tL), cx, -40, 60);
      drawAt(p.path(`M ${cx + 110} -120 Q 0 -200 76 -16`, W(2.4)), p, tS - tu(.2), tu(.2));
      const tg = mvG(popAt(p, 76, -10, tS), { px: 76, py: -10, r: [[0, 0], [tS, 0], [tS + tu(.15), 8, 'out'], [tS + tu(.4), -4, 'io'], [tS + tu(.62), 0, 'soft']] }), g = rot(tg, 6, 60, -10);
      shape(g, [[40, -10], [104, -190], [450, -190], [450, 180], [104, 180]], F(4.4)); g.circle(76, -10, 13, F(2.6));
      rows(rot(p, 6, 60, -10), c, M, 126, -5, 300, { gap: 70, size: 30, ic: 46, tm: mT({ T0: tS + tu(.2), H: Q.H }, M.length) });
    }); });

  /* 08 ── THE FACT SHEET: the hook pops; the sheet drops in on its clip and swings, settling; the header band lights; term, meanings */
  variant('factsheet', 'แผ่นข้อมูลคำศัพท์', (d, c) => { const T = TM(d), M = MS(d), Q = TL();
    art(c, p => { popAt(p, 0, -338, tu(.04)).circle(0, -338, 9, F(2.6));
      const sw = mvG(CL(p), Object.assign({ px: 0, py: -334 }, swingFit(tu(.3), Q.T0 - tu(.02), 5)));
      R(sw, -280, -262, 560, 590, 18, F(4.6)); R(litG(sw, Q.T0 - tu(.1), .2), -280, -210, 560, 150, 0, { fill: 'rgba(255,255,255,.1)', sw: 0, stroke: 'none' }); sw.line(-280, -60, 280, -60, W(2.6));
      sw.path('M -54 -276 L -34 -334 L 34 -334 L 54 -276', W(3.2)); shape(sw, [[-96, -284], [96, -284], [76, -226], [-76, -226]], F(3.6));
      termH(p, c, T, -180, -136, 100, -100, { cx: 0, maxW: 340, bigW: 480, t: Q.T0 });
      rows(p, c, M, -226, 110, 470, { tm: mT(Q, M.length) });
    }); });

  /* 09 ── POINTING AT THE WORD: the easel legs draw, the board drops onto it; the person rises in and raises the arm to point at the term */
  variant('pointboard', 'คนชี้คำบนกระดาน', (d, c) => { const T = TM(d), M = MS(d), Q = TL(), px = -350;
    art(c, p => { floorD(p);
      [[-60, -110], [380, 430]].forEach(([a, b], i) => drawAt(p.line(a, 96, b, 290, W(5)), p, tu(.04 + .05 * i), tu(.25))); drawAt(p.line(160, 96, 160, 290, S(3)), p, tu(.14), tu(.25));
      const bd = inG(CL(p), 'drop', 165, -100, tu(.3)); R(bd, -130, -300, 590, 384, 26, F(4.6)); R(bd, -100, 82, 530, 20, 9, F(3));
      const hm = front(inG(p, 'rise', px, 140, tu(.12)), px, 290, 1, { 1: { s: [36, -82], e: [92, -128], h: [148, -172] } });
      hm.on('upper1', p, 0, { ox: 36, oy: -82, r: armK(124, Q.T0 - tu(.3), Q.T0) }); hm.on('fore1', p, 0, { ox: 92, oy: -128, r: armK(10, Q.T0 - tu(.3), Q.T0, 0) });
      termH(p, c, T, -40, -212, 90, 30, { cx: 165, size: 46, maxW: 390, bigW: 520, t: Q.T0 }); drawAt(p.line(-90, -152, 420, -152, W(3)), p, Q.T0 + tu(.12), tu(.3));
      rows(p, c, M, -90, -30, 510, { gap: 64, size: 32, ic: 48, tm: mT(Q, M.length) });
    }); });

  /* 10 ── THE NAMEPLATE: the desk pops and its legs draw; the nameplate rises onto it; the term on its face, the short meanings along the edge */
  variant('nameplate', 'ป้ายชื่อพร้อมคำอธิบายสั้น', (d, c) => { const T = TM(d), M = MS(d), Q = TL();
    art(c, p => { R(inG(p, 'pop', 0, 210, tu(.04)), -480, 196, 960, 26, 6, F(3.4)); [-450, 450].forEach(x => drawAt(p.line(x, 222, x, 340, S(2)), p, tu(.14), tu(.2)));
      const np = mvG(clipG(p, -500, -350, 1000, 546), { px: 0, py: 196, y: [[0, 330], [tu(.3), 330], [tu(.62), -8, 'out'], [tu(.74), 0, 'soft']] });
      shape(np, [[-390, -66], [390, -66], [356, -120], [-356, -120]], F(3.6)); R(np, -390, -66, 780, 262, 20, F(4.6));
      termH(p, c, T, -290, 8, 100, -210, { cx: 0, size: 56, maxW: 560, bigW: 700, dy: 20, t: Q.T0 }); drawAt(p.line(-340, 76, 340, 76, S(2)), p, Q.T0 + tu(.12), tu(.3));
      cols(p, c, M, -380, 380, 128, { ic: 42, size: 26, tm: mT(Q, M.length) });
    }); });

  /* 11 ── THE FLASH CARDS: the term card pops in; the meaning card slides out from behind it and turns to its tilt; the meanings come up on it */
  variant('flashcards', 'การ์ดคำศัพท์และความหมาย', (d, c) => { const T = TM(d), M = MS(d), Q = TL(), tS = Q.T0 + tu(.1);
    art(c, p => { const bm = mvG(p, { x: [[0, -330], [tS, -330], [tS + tu(.4), 10, 'out'], [tS + tu(.52), 0, 'soft']], y: [[0, 200], [tS, 200], [tS + tu(.4), 0, 'out']], o: fadeIn(tS, .05) });
      R(rot(bm, 6, 200, -150), -40, -300, 470, 330, 30, F(4.4));
      rows(rot(p, 6, 200, -150), c, M, 0, -196, 390, { gap: 52, size: 28, ic: 40, tm: mT({ T0: tS + tu(.2), H: Q.H }, M.length) });
      const f = rot(inG(p, 'pop', -200, 70, tu(.04)), -4, -190, 90); R(f, -440, -96, 480, 340, 30, F(4.8));
      termV(rot(p, -4, -190, 90), c, T, -200, 40, 130, 170, { size: 44, maxW: 400, bigW: 410, bigSize: 52, t: Q.T0 });
    }); });

  /* 12 ── THE BOOK WITH TABS: the book rises; the term lands on the cover; a page tab slides out of its side for each meaning */
  variant('tabbook', 'หนังสือพร้อมแถบคั่นหน้า', (d, c) => { const T = TM(d), M = MS(d), Q = TL(), n = Math.max(1, M.length), tm = mT(Q, M.length);
    art(c, p => {
      for (let i = 0; i < n; i++) { const y = (i - (n - 1) / 2) * 156 - 10, m = M[i], t = M.length ? tm(i) - tu(.2) : Q.H - tu(.2), K = [[0, -320], [t, -320], [t + tu(.26), 8, 'out'], [t + tu(.36), 0, 'soft']];
        const tb = mvG(p, { x: K, o: fadeIn(t, .04) }); R(tb, 140, y - 56, 320, 112, 22, F(4));
        if (m) { const pi = !!picOf(m), lx = pi ? 280 : 236; if (pi) put(p, c, { icon: m.icon }, 240, y, 62, null, { t: t + tu(.1), mv: { x: K } }); else DOT(tb, 214, y);
          if (m.label) txt(tb, m.label, lx + 6, y + 13, { size: 38, maxW: 434 - lx, weight: 600, color: C.ink, anchor: 'start' }); }
        else lines(tb, 220, y - 10, 160, 2, 24, S(2), [1]); }
      const bk = inG(p, 'rise', -40, 0, tu(.04)); R(bk, -270, -300, 460, 590, 22, F(4.8)); bk.line(-212, -300, -212, 290, W(3));
      termV(p, c, T, -20, -96, 140, 50, { size: 44, maxW: 330, bigW: 340, bigSize: 52, t: Q.T0 });
    }); });

  /* 13 ── WORD = MEANING: the term's block drops, the term lands on it; the equals bars pop; the meaning's block drops and fills, line by line */
  variant('equals', 'เครื่องหมายเท่ากับ', (d, c) => { const T = TM(d), M = MS(d), Q = TL(), tB = Q.T0 + tu(.2);
    art(c, p => { drawAt(p.line(-480, 178, 480, 178, S(2)), p, 0, tu(.3));
      const blk = (g, x0, x1) => { shape(g, [[x0, -150], [x1, -150], [x1 + 34, -186], [x0 + 34, -186]], F(3.4)); shape(g, [[x1, -150], [x1 + 34, -186], [x1 + 34, 140], [x1, 176]], F(3.4)); R(g, x0, -150, x1 - x0, 326, 18, F(4.6)); };
      blk(inG(CL(p), 'drop', -320, 10, tu(.1)), -470, -170); blk(inG(CL(p), 'drop', 255, 10, tB - tu(.3)), 70, 440);
      [-30, 22].forEach((y, i) => R(popAt(p, -40, y + 13, Q.T0 + tu(.1 + .08 * i)), -104, y, 128, 26, 13, F(3.6)));
      termV(p, c, T, -320, -46, 120, 92, { size: 40, maxW: 260, bigW: 270, bigSize: 48, t: Q.T0 - tu(.1) });
      rows(p, c, M, 96, 14, 330, { gap: 84, size: 32, ic: 52, tm: mT({ T0: tB, H: Q.H }, M.length) });
    }); });

  /* 14 ── THE TWO-PART FRAME: the frame pops; the term lands on top; the divider draws out from the middle and the tab bobs down; the meanings below */
  variant('splitframe', 'กรอบคำและความหมาย', (d, c) => { const T = TM(d), M = MS(d), Q = TL(), tD = Q.T0 + tu(.12);
    art(c, p => { R(inG(p, 'pop', 0, 0, tu(.04)), -290, -312, 580, 620, 34, F(4.8));
      p && R(mvG(p, { px: 0, py: -40, sx: [[0, 0], [tD, 0], [tD + tu(.25), 1, 'out']], o: fadeIn(tD, .04) }), -290, -42, 580, 4, 2, F(3));
      const tb = mvG(popAt(p, 0, -40, tD + tu(.2)), { y: [[0, 0], [tD + tu(.34), 0], [tD + tu(.44), 8, 'io'], [tD + tu(.56), 0, 'soft']] }); tb.circle(0, -40, 30, F(3.6)); tb.path('M -12 -48 L 0 -34 L 12 -48', W(3));
      termV(p, c, T, 0, -196, 120, -84, { size: 46, maxW: 480, bigW: 500, t: Q.T0 });
      rows(p, c, M, -232, 136, 470, { tm: mT({ T0: tD + tu(.2), H: Q.H }, M.length) });
    }); });

  /* 15 ── THE DISPLAY CASE: the plinth rises, the base slab pops; the glass case is lowered onto it; the term lights inside; the meanings on the front */
  variant('vitrine', 'ตู้โชว์คำจำกัดความ', (d, c) => { const T = TM(d), M = MS(d), Q = TL(), tG = Math.max(tu(.5), Q.T0 - tu(.3));
    art(c, p => { floorD(p);
      const gl = mvG(CL(p), { y: [[0, -400], [tu(.3), -400], [tG, 6, 'out'], [tG + tu(.1), 0, 'soft']] }); R(gl, -214, -290, 428, 332, 12, { fill: GLASS, sw: 4.4 }); R(gl, -232, -306, 464, 22, 10, F(3.4));
      R(inG(p, 'pop', 0, 58, tu(.16)), -256, 40, 512, 36, 12, F(4)); R(inG(p, 'rise', 0, 180, tu(.04)), -224, 76, 448, 214, 14, F(4.6));
      haloH(p, 0, -150, 120, Q.T0 + tu(.02)); termV(p, c, T, 0, -150, 150, -10, { size: 40, maxW: 370, bigW: 380, bigSize: 50, t: Q.T0 });
      rows(p, c, M, -192, 184, 390, { gap: 58, size: 28, ic: 42, tm: mT(Q, M.length) });
    }); });

  /* 16 ── READING THE DEFINITION: the person rises in holding the closed book; it falls open from its spine; term on the left, meanings on the right */
  variant('reader', 'คนอ่านคำจำกัดความ', (d, c) => { const T = TM(d), M = MS(d), Q = TL(), tO = Math.max(tu(.45), Q.T0 - tu(.3));
    art(c, p => { floorD(p); const pg = inG(p, 'rise', 0, 140, tu(.04)); front(pg, 0, 290, 1.15);
      [-1, 1].forEach(sd => mvG(pg, { px: 0, py: 140, sx: [[0, .06], [tO, .06], [tO + tu(.3), 1.02, 'out'], [tO + tu(.4), 1, 'soft']] }).path(`M 0 4 Q ${sd * 170} -26 ${sd * 360} 4 L ${sd * 360} 272 Q ${sd * 170} 248 0 272 Z`, F(4.6)));
      pg.line(0, 4, 0, 272, W(3)); [-1, 1].forEach(sd => R(mvG(pg, { x: [[0, -sd * 330], [tO, -sd * 330], [tO + tu(.3), sd * 6, 'out'], [tO + tu(.4), 0, 'soft']] }), sd * 360 - 20, 110, 40, 70, 18, F(3)));
      termV(p, c, T, -176, 96, 110, 212, { size: 38, maxW: 290, bigW: 300, bigSize: 46, bigDy: 26, t: Q.T0 });
      rows(p, c, M, 30, 140, 310, { gap: 64, size: 26, ic: 40, tm: mT(Q, M.length) });
    }); });

  /* 17 ── THE ICON SIGN: the bracket pops onto the wall and its arm slides out; the sign drops onto its chains and swings, settling; the term with
     its big icon; the small sign drops under it with the meanings */
  variant('bladesign', 'ป้ายคำศัพท์พร้อมไอคอน', (d, c) => { const T = TM(d), M = MS(d), Q = TL(), tS = Q.T0 + tu(.1);
    art(c, p => { p.line(-470, -340, -470, 340, S(2)); R(inG(p, 'pop', -463, -252, tu(.04)), -480, -312, 34, 120, 10, F(3.4));
      const ar = mvG(p, { px: -446, py: -261, sx: [[0, .03], [tu(.12), .03], [tu(.4), 1, 'out']], o: fadeIn(tu(.12), .04) }); R(ar, -446, -270, 580, 18, 9, F(3.4)); drawAt(p.path('M -446 -206 L -230 -262', W(3.4)), p, tu(.4), tu(.15));
      const sw = mvG(CL(p), Object.assign({ px: -120, py: -252 }, swingFit(tu(.5), Q.T0 - tu(.02), 5))); [-300, 60].forEach(x => sw.line(x, -252, x, -206, W(2.4))); R(sw, -390, -206, 540, 256, 30, F(4.8));
      termH(p, c, T, -280, -78, 120, -194, { cx: -120, size: 52, maxW: 320, bigW: 500, t: Q.T0 });
      const sb = mvG(clipG(p, -500, 50, 1000, 300), { y: [[0, -260], [tS, -260], [tS + tu(.26), 8, 'out'], [tS + tu(.36), 0, 'soft']] }); [-300, 60].forEach(x => sb.line(x, 50, x, 92, W(2.4))); R(sb, -380, 92, 520, 200, 24, F(4.2));
      cols(p, c, M, -370, 130, 190, { ic: 56, size: 26, tm: mT({ T0: tS + tu(.3), H: Q.H }, M.length) });
    }); });

  /* 18 ── THE WORD MAP: the pin board pops; the term's pill lands at the top; a branch draws down to each meaning and its pill pops on the end */
  variant('wordmap', 'แผนภาพคำและความหมาย', (d, c) => { const T = TM(d), M = MS(d), n = M.length, Q = TL(), tm = mT(Q, n);
    art(c, p => { const bd = inG(p, 'pop', 0, 0, tu(.04)); R(bd, -462, -312, 924, 620, 30, F(4.6)); R(bd, -436, -286, 872, 568, 18, S(1.6));
      const w = n ? Math.min(270, 820 / n - 24) : 0, xs = M.map((_, i) => -410 + (820 / n) * (i + .5));
      xs.forEach((x, i) => drawAt(p.path(`M 0 -130 C 0 -30 ${x} -40 ${x} 76`, W(2.6)), p, tm(i) - tu(.28), tu(.26)));
      R(popAt(p, 0, -191, Q.T0 - tu(.04)), -230, -252, 460, 122, 61, F(4.4)); termH(p, c, T, -150, -191, 80, -96, { cx: 0, size: 44, maxW: 300, bigW: 420, bigSize: 48, t: Q.T0 });
      M.forEach((m, i) => { const x = xs[i], t = tm(i), g = popAt(p, x, 124, t - tu(.04)); R(g, x - w / 2, 76, w, 96, 48, F(4)); g.circle(x, 76, 10, F(2.4));
        const pi = !!picOf(m); if (pi) put(p, c, { icon: m.icon }, x - w / 2 + 54, 124, 56, null, { t });
        if (m.label) txt(atG(p, t + tu(.06)), m.label, pi ? x - w / 2 + 94 : x, 137, { size: 34, maxW: pi ? w - 112 : w - 40, weight: 600, color: C.ink, anchor: pi ? 'start' : 'middle' }); });
      if (!n) drawAt(p.line(-200, 110, 200, 110, S(2)), p, Q.H, tu(.3));
    }); });

  /* 19 ── THE DICTIONARY PAGE: the dictionary drops and falls open, the thumb tabs pop down its edge, the text lines draw; the entry box draws round
     the headword and its meanings */
  variant('dictionary', 'หน้าพจนานุกรม', (d, c) => { const T = TM(d), M = MS(d), Q = TL(), tO = tu(.3);
    art(c, p => { const bk = inG(CL(p), 'drop', 0, 0, tu(.04));
      [-1, 1].forEach(sd => { const pg = mvG(bk, { px: 0, py: 0, sx: [[0, .05], [tO, .05], [tO + tu(.3), 1.02, 'out'], [tO + tu(.4), 1, 'soft']] });
        [24, 12].forEach(dy => pg.path(`M 0 ${236 + dy} Q ${sd * 230} ${196 + dy} ${sd * 470} ${216 + dy}`, S(2))); pg.path(`M 0 -232 Q ${sd * 220} -264 ${sd * 440} -224 L ${sd * 470} 216 Q ${sd * 230} 196 0 236 Z`, F(4.6)); });
      bk.line(0, -232, 0, 236, W(3)); [-150, -60, 30, 120].forEach((y, i) => R(popAt(p, 465, y + 27, tu(.66 + .05 * i)), 452 + i * 3, y, 26, 54, 8, i === 1 ? SOLID(2) : F(2.6)));
      for (let k = 0; k < 7; k++) drawAt(p.line(-410, -170 + k * 54, -50, -170 + k * 54, S(1.8)), p, tu(.7 + .03 * k), tu(.2));
      R(litG(p, Q.T0 - tu(.1), .2), 40, -200, 380, 380, 18, { fill: 'rgba(255,255,255,.05)', sw: 0, stroke: 'none' }); drawAt(R(p, 40, -200, 380, 380, 18, S(2.2)), p, Q.T0 - tu(.2), tu(.35));
      termH(p, c, T, 100, -142, 72, 150, { cx: 230, size: 42, maxW: 260, bigW: 340, bigSize: 46, t: Q.T0 }); drawAt(p.line(64, -94, 396, -94, W(2.4)), p, Q.T0 + tu(.12), tu(.25));
      rows(p, c, M, 66, 50, 340, { gap: 70, size: 30, ic: 46, tm: mT(Q, M.length) });
    }); });

  /* 20 ── THE DEFINITION CARD ON THE DESK (from above): the desk outline draws; the cup slides in, the pencil rolls in; the card slides onto the desk,
     turning to its tilt; the term is written, then the meanings */
  variant('deskcard', 'การ์ดนิยามบนโต๊ะ', (d, c) => { const T = TM(d), M = MS(d), Q = TL();
    art(c, p => { drawAt(R(p, -490, -330, 980, 660, 34, S(2)), p, 0, tu(.4));
      const pc0 = mvG(CL(p), { x: [[0, 260], [tu(.3), 260], [tu(.6), -6, 'out'], [tu(.7), 0, 'soft']], o: fadeIn(tu(.3)) }), pc = rot(pc0, 28, 380, 120);
      R(pc, 290, 104, 220, 32, 8, F(3.4)); shape(pc, [[290, 104], [290, 136], [244, 120]], F(3)); R(pc, 490, 104, 30, 32, 6, F(3));
      const cp = mvG(CL(p), { x: slideX(tu(.16), -200), o: fadeIn(tu(.16)) }); cp.circle(-400, 230, 64, F(4)); cp.circle(-400, 230, 48, S(1.8)); R(cp, -350, 214, 44, 32, 14, F(3.2));
      const g0 = mvG(CL(p), { px: 0, py: 0, y: [[0, -560], [tu(.36), -560], [tu(.72), 8, 'out'], [tu(.84), 0, 'soft']], r: [[0, 14], [tu(.36), 14], [tu(.84), 0, 'out']], o: fadeIn(tu(.36)) }), g = rot(g0, -5, 0, 0);
      R(g, -300, -250, 560, 440, 16, F(4.6)); drawAt(g.line(-300, -110, 260, -110, W(2.6)), p, Q.T0 + tu(.12), tu(.3));
      const g2 = rot(p, -5, 0, 0); termH(g2, c, T, -224, -178, 90, -158, { cx: -20, size: 48, maxW: 380, bigW: 520, t: Q.T0 });
      rows(g2, c, M, -250, 40, 480, { tm: mT(Q, M.length) });
    }); });

  /* ---------- sample data (A: definitions from unrelated topics · B: stress) ---------- */
  const I = (icon, label) => label ? (icon ? { icon, label } : { label }) : { icon };
  const D = (say, term, ...means) => ({ say, term, means });
  const SAMPLES = [
    D('ภาษีคือเงินที่เราจ่ายให้รัฐ', I('coins', 'ภาษี'), I('wallet', 'เงินที่จ่าย'), I('landmark', 'ให้รัฐ')),
    D('เงินเฟ้อคือของแพงขึ้น เงินซื้อได้น้อยลง', I('trending-up', 'เงินเฟ้อ'), I('shopping-cart', 'ของแพงขึ้น'), I('wallet', 'ซื้อได้น้อยลง')),
    D('หลับลึกคือช่วงที่ร่างกายซ่อมแซมตัวเอง', I('moon', 'หลับลึก'), I('bed', 'พักเต็มที่'), I('heart-pulse', 'ร่างกายซ่อมแซม')),
    D('ฟรีแลนซ์คือคนทำงานอิสระ ไม่มีนายจ้างประจำ', I('laptop', 'ฟรีแลนซ์'), I('briefcase', 'ทำงานอิสระ'), I('calendar', 'เลือกเวลาเอง'), I('user', 'ไม่มีนายจ้าง')),
    D('โปรตีนคือสารอาหารที่สร้างกล้ามเนื้อ', I('egg', 'โปรตีน'), I('dumbbell', 'สร้างกล้ามเนื้อ')),
    D('สตาร์ทอัพคือธุรกิจเล็กที่โตเร็ว', I('rocket', 'สตาร์ทอัพ'), I('store', 'ธุรกิจเล็ก'), I('trending-up', 'โตเร็ว')),
    D('ดอกเบี้ยคือค่าเช่าเงิน', I('percent', 'ดอกเบี้ย'), I('coins', 'ค่าเช่าเงิน')),
    D('ภูมิคุ้มกันคือทหารของร่างกาย', I('shield', 'ภูมิคุ้มกัน'), I('shield-check', 'ป้องกันเชื้อโรค'), I('heart-pulse', 'ดูแลร่างกาย')),
    D('คลาวด์คือการเก็บไฟล์ไว้บนอินเทอร์เน็ต', I('cloud', 'คลาวด์'), I('folder', 'เก็บไฟล์'), I('globe', 'บนอินเทอร์เน็ต')),
    D('มินิมอลคือมีน้อยแต่พอดี', I('leaf', 'มินิมอล'), I('package', 'ของน้อย'), I('smile', 'พอดีกับชีวิต')),
    D('คอนเทนต์คือเรื่องที่เราเล่าให้คนดู', I('video', 'คอนเทนต์'), I('message-circle', 'เรื่องที่เล่า'), I('users', 'ให้คนดู')),
    D('สภาพคล่องคือมีเงินสดพร้อมใช้', I('droplets', 'สภาพคล่อง'), I('banknote', 'เงินสด'), I('zap', 'พร้อมใช้ทันที')),
    D('แบรนด์คือสิ่งที่คนนึกถึงเมื่อเห็นเรา', I('gem', 'แบรนด์'), I('brain', 'สิ่งที่คนนึกถึง'), I('star', 'ภาพจำ')),
    D('กาแฟดริปคือการรินน้ำร้อนผ่านผงกาแฟ', I('coffee', 'กาแฟดริป'), I('droplets', 'รินน้ำร้อน'), I('filter', 'ผ่านผงกาแฟ')),
    D('เดดไลน์คือเส้นตายของงาน', I('clock', 'เดดไลน์'), I('calendar', 'วันส่งงาน'), I('flag', 'เส้นตาย')),
    D('นิสัยคือสิ่งที่ทำซ้ำจนเป็นอัตโนมัติ', I('repeat', 'นิสัย'), I('rotate-ccw', 'ทำซ้ำ'), I('zap', 'อัตโนมัติ')),
    D('บุฟเฟต์คือจ่ายครั้งเดียว กินได้ไม่อั้น', I('utensils', 'บุฟเฟต์'), I('wallet', 'จ่ายครั้งเดียว'), I('infinity', 'กินไม่อั้น')),
    D('คาร์บอนฟุตพริ้นท์คือควันที่เราปล่อยจากการใช้ชีวิต', I('factory', 'คาร์บอนฟุตพริ้นท์'), I('factory', 'ควันที่ปล่อย'), I('house', 'จากชีวิตประจำวัน'), I('car', 'การเดินทาง')),
    D('วันหยุดยาวคือหยุดติดกันหลายวัน', I('calendar', 'วันหยุดยาว'), I('sun', 'หยุดติดกันหลายวัน')),
    D('เมนเทอร์คือคนที่ช่วยชี้ทางให้เรา', I('compass', 'เมนเทอร์'), I('user', 'คนมีประสบการณ์'), I('map', 'ช่วยชี้ทาง')),
  ];
  const STRESS = [
    D('คำไม่มีไอคอน', I(null, 'อีคิว'), I('heart', 'เข้าใจอารมณ์'), I('users', 'เข้าใจคนอื่น')),
    D('คำยาว', I('brain', 'ความฉลาดทางอารมณ์ในที่ทำงาน'), I('heart', 'เข้าใจอารมณ์')),
    D('ความหมายยาวสามข้อ', I('book-open', 'นิยาม'), I('message-circle', 'อธิบายความหมายของคำให้ชัดเจน'), I('target', 'บอกว่าสิ่งนั้นคืออะไรจริง ๆ'), I('sparkles', 'ใช้ได้กับทุกเรื่องที่พูดถึง')),
    D('ความหมายไม่มีไอคอน', I('coins', 'ภาษี'), I(null, 'เงินที่จ่ายให้รัฐ'), I(null, 'ตามรายได้')),
    D('ความหมายมีแต่ไอคอน', I('rocket', 'สตาร์ทอัพ'), I('store'), I('trending-up')),
    D('ภาษาอังกฤษ', I('cloud', 'Cloud'), I('folder', 'Files online'), I('globe', 'Anywhere')),
    D('ชื่อไอคอนที่ไม่มี', I('no-such-icon', 'คำศัพท์'), I('no-such', 'ความหมาย')),
    D('ความหมายข้อเดียวยาว', I('clock', 'เดดไลน์'), I('flag', 'วันสุดท้ายที่ต้องส่งงานให้ลูกค้า')),
    D('ไม่มีความหมาย', I('gem', 'แบรนด์')),
    D('ไม่มีอะไรเลย', null),
    D('คำสั้นมาก', I('zap', 'AI'), I('brain', 'สมองกล')),
    D('อังกฤษยาว', I('leaf', 'Minimalism'), I('package', 'Fewer things'), I('smile', 'More space for what matters')),
    D('คำไม่มีไอคอน ความหมายข้อเดียว', I(null, 'KPI'), I('target', 'ตัวชี้วัดผลงาน')),
    D('ตัวเลขในความหมาย', I('percent', 'ดอกเบี้ย'), I('coins', 'ร้อยละ 5 ต่อปี')),
    D('ปกติสองข้อ', I('coffee', 'ลาเต้'), I('coffee', 'เอสเปรสโซ'), I('droplets', 'นมร้อน')),
    D('คำยาวไม่มีไอคอน', I(null, 'ความรับผิดชอบต่อสังคม'), I('users', 'ดูแลคนรอบข้าง')),
    D('ความหมายยาวมาก', I('shield', 'ประกัน'), I('wallet', 'จ่ายเงินทีละน้อยเพื่อรับความคุ้มครองเมื่อเกิดเรื่องไม่คาดคิด')),
    D('ความหมายว่าง', I('sun', 'วันหยุด'), {}),
    D('อังกฤษ 2', I('video', 'Content'), I('message-circle', 'Stories we tell')),
    D('ไม่มีอะไรเลย 2', {}),
  ];

  G.cats = G.cats || {};
  G.cats.B16 = { variants: V, SAMPLES, STRESS, draw: (i, d, c) => { setZ(c); CUR = V[i].id; V[i].build(d || {}, c); }, CLAMPS, timing: c => (setZ(c), Object.assign({}, Z)) };
})();
