/* b15.js — category B15 "ชวนทำ / ปิดคลิป" (call to action / ending). House style of B01–B14 (real things with real structure),
   designs from the user's ideas in references/cutpack-visual-ideas.md ("ชวนทำ/ปิดคลิป", 20 ideas) — ideas that need hands / fingers / a face
   are redrawn with whole people (no hands, no face) or with things.
   CutPack (references/cutpack-CATEGORIES.md v2, cat_ai.py): action = follow | comment | save | share | like (required) · label = the words said (optional).
   No platform logos / UI: neutral icons — follow user-plus · comment message-circle · save bookmark · share share-2 · like heart.
   No label → the icon alone; an unknown action → the label big; nothing → a lit four-point star.
   GL.cats.B15.draw(i, data, { x, y, s, at, hit, speed }) — canvas 1000 × 700 centred at (0,0); hit = seconds after `at` (default 1.9). */
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
    cp.id = 'b15clip' + (++CID); Object.entries({ x, y, width: w, height: h }).forEach(([k, v]) => r.setAttribute(k, v)); cp.appendChild(r);
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

  /* ---------- the data: action → a neutral icon (+ the spoken label) ---------- */
  const ICON = { follow: 'user-plus', comment: 'message-circle', save: 'bookmark', share: 'share-2', like: 'heart' };
  const ACTS = ['like', 'comment', 'share', 'save', 'follow'];
  const st = d => { if (!d) return null; const ic = ICON[d.action], lb = d.label && String(d.label).trim();
    if (ic) return lb ? { icon: ic, label: lb } : { icon: ic }; return lb ? { label: lb } : null; };
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

  /* 01 ── POINTING OUT AT YOU: the card pops onto the wall and its screws go in; the person rises in, then thrusts the arm out at the viewer —
     a burst at its end, and the call lands on the card */
  variant('pointout', 'คนชี้มาทางผู้ชม', (d, c) => { const X = st(d), T = TL(), H = T.H, T0 = T.T0;
    art(c, p => { floorD(p);
      card(inG(p, 'pop', -240, -100, tu(.04)), -440, -250, 400, 300); [[-418, -228], [-62, -228], [-418, 28], [-62, 28]].forEach(([x, y], i) => screw(popAt(p, x, y, tu(.2 + .04 * i)), x, y, 4));
      const px = 210, k = 1.04, hm = front(inG(p, 'rise', px, 140, tu(.12)), px, 290, k, { 1: { s: [36, -82], e: [84, -44], h: [124, -8] } });
      hm.on('upper1', p, 0, { ox: 36, oy: -82, r: armK(36, T0, H - tu(.14)) }); hm.on('fore1', p, 0, { ox: 84, oy: -44, r: armK(8, T0, H - tu(.14), 0) });
      const [hx, hy] = fAt(px, 290, k, 136, 2); sparkAt(p, hx, hy, 20, 36, H - tu(.06), 8, 0, [3, 4, 5, 6, 7], true);
      hero(p, c, X, -240, -136, 140, 6, { maxW: 320, size: 42, bigSize: 52, bigW: 330 });
    }); });

  /* 02 ── THE CLICK: the pill button pops; the pointer glides in along one smooth curve, stops on the button and clicks (pointer dips,
     button squashes, click ticks) — the call lands */
  variant('click', 'ลูกศรเมาส์กดปุ่ม', (d, c) => { const X = st(d), T = TL(), H = T.H, T0 = T.T0, tx = 160, ty = 50, tC = H - tu(.1);
    art(c, p => {
      const pl = mvG(inG(p, 'pop', -60, -40, tu(.04)), { px: -60, py: -40, sy: bumpK(tC, .93), sx: bumpK(tC, 1.015) });
      R(pl, -380, -150, 640, 220, 110, F(3.6)); R(pl, -358, -128, 596, 176, 88, S(1.4));
      const cg = mvG(CL(p), Object.assign({ o: fadeIn(tu(.3)) }, pathK([[560, 380], [380, 300], [240, 140], [tx, ty]], Math.max(tu(.3), T0 - tu(.3)), tC - tu(.04), [tx, ty])));
      const pr = mvG(cg, { px: tx, py: ty, s: [[0, 1], [tC - tu(.04), 1], [tC, .86, 'in'], [tC + tu(.14), 1, 'out']] });
      shape(pr, [[0, 0], [0, 170], [42, 132], [72, 198], [102, 184], [72, 120], [126, 120]].map(([x, y]) => [tx + x, ty + y]), F(3.4));
      sparkAt(p, tx, ty, 28, 52, tC, 9, -170, [3, 4, 5, 6, 7, 8], true);
      heroH(p, c, X, -230, -40, 110, -150, -26, { cx: -60, cy: -40, size: 50, maxW: 330, bigSize: 54, bigW: 520 });
    }); });

  /* 03 ── WAVING: the person rises in; the post grows up out of its base and the sign drops onto it; the person lifts an arm and waves —
     the wave arcs light on the keyword, with the call */
  variant('wave', 'คนโบกมือ', (d, c) => { const X = st(d), T = TL(), H = T.H, T0 = T.T0, px = -250, k = 1.02;
    art(c, p => { floorD(p);
      const hm = front(inG(p, 'rise', px, 140, tu(.04)), px, 290, k, { 1: { s: [36, -82], e: [94, -126], h: [86, -200] } });
      hm.on('upper1', p, 0, { ox: 36, oy: -82, r: armK(111, T0, T0 + tu(.3)) }); hm.on('fore1', p, 0, { ox: 94, oy: -126, r: waveK(71, T0, H + tu(.2)) });
      const [hx, hy] = fAt(px, 290, k, 86, -210), wa = litG(p, H - tu(.1)); waveArcs(wa, hx + 22, hy, 1); waveArcs(wa, hx - 24, hy, -1);
      ell(popAt(p, 180, 284, tu(.12)), 180, 284, 80, 11, F(2.6)); R(mvG(p, growY(180, 284, tu(.16))), 170, 40, 20, 244, 6, F(2.6));
      card(inG(CL(p), 'drop', 180, -115, tu(.4)), -10, -270, 380, 310);
      hero(p, c, X, 180, -150, 140, -10, { maxW: 300, size: 42, bigSize: 52, bigW: 310 });
    }); });

  /* 04 ── THE SIGN ON A NAIL: the nail pops; the sign drops in on its string, catches on the nail and swings, settling; the call lands */
  variant('nailsign', 'ป้ายแขวนตะปู', (d, c) => { const X = st(d), T = TL(), H = T.H, T0 = T.T0;
    art(c, p => { const nl = popAt(p, 0, -322, tu(.04)); nl.circle(0, -322, 9, F(2.6));
      const sw = mvG(CL(p), Object.assign({ px: 0, py: -316 }, swingK(Math.max(tu(.5), T0 - tu(.2)), H)));
      sw.path('M -190 -214 L 0 -316 L 190 -214', W(2.2)); card(sw, -280, -220, 560, 420, 18); [-190, 190].forEach(x => sw.circle(x, -196, 9, F(2.2)));
      hero(p, c, X, 0, -50, 160, 106, { maxW: 450, size: 48, bigSize: 60, bigW: 460 });
    }); });

  /* 05 ── AT THE PODIUM: the podium rises; the person comes up behind it and shoots one arm up — the call lands on the podium's front */
  variant('podium', 'คนยกแขนหลังโพเดียม', (d, c) => { const X = st(d), T = TL(), H = T.H, T0 = T.T0, k = 1.14;
    art(c, p => { floorD(p);
      const pg = mvG(clipG(p, -500, -350, 1000, 640), { y: [[0, 300], [tu(.3), 300], [T0 - tu(.05), -8, 'out'], [T0 + tu(.08), 0, 'soft']] });
      const hm = front(pg, 0, 290, k, { 1: { s: [36, -82], e: [70, -152], h: [62, -224] } });
      hm.on('upper1', p, 0, { ox: 36, oy: -82, r: armK(138, T0, H - tu(.16)) }); hm.on('fore1', p, 0, { ox: 70, oy: -152, r: armK(44, T0, H - tu(.16), 0) });
      const pd = inG(p, 'rise', 0, 180, tu(.04)); R(pd, -250, 66, 500, 30, 8, F(3)); shape(pd, [[-220, 96], [220, 96], [200, 290], [-200, 290]], F(3.4)); shape(pd, [[-196, 116], [196, 116], [182, 270], [-182, 270]], S(1.4));
      hero(p, c, X, 0, 168, 100, 254, { maxW: 340, size: 36, bigSize: 48, bigW: 350, bigDy: 26 });
    }); });

  /* 06 ── THE TENT CARD: the table top pops and its legs draw; the card drops onto the table and squashes on landing; the call lands */
  variant('tentcard', 'ป้ายตั้งโต๊ะ', (d, c) => { const X = st(d), T = TL(), H = T.H, T0 = T.T0;
    art(c, p => { R(inG(p, 'pop', 0, 220, tu(.04)), -470, 210, 940, 20, 4, F(3)); [-440, 440].forEach(x => drawAt(p.line(x, 230, x, 340, S(2)), p, tu(.16), tu(.2)));
      const cg = mvG(CL(p), { px: 0, py: 210, y: [[0, -440], [tu(.3), -440], [T0, 0, 'in']], sy: [[0, 1], [T0, 1], [T0 + tu(.06), .92, 'out'], [T0 + tu(.24), 1, 'soft']], o: fadeIn(tu(.3)) });
      shape(cg, [[-226, -190], [226, -190], [254, 210], [-254, 210]], F(3.4)); shape(cg, [[-206, -170], [206, -170], [230, 190], [-230, 190]], S(1.4)); cg.line(-226, -190, 226, -190, W(4));
      hero(p, c, X, 0, -40, 150, 112, { maxW: 400, size: 46, bigSize: 58, bigW: 410 });
    }); });

  /* 07 ── THE BIG BUTTON: the plate pops onto the wall, screws go in, the bezel ring pops; the cap pops in, then is pressed (it sinks
     and springs back) — the call lands on it */
  variant('bigbutton', 'ปุ่มกดขนาดใหญ่', (d, c) => { const X = st(d), T = TL(), H = T.H, T0 = T.T0, tP = H - tu(.14);
    art(c, p => {
      R(inG(p, 'pop', 0, -30, tu(.04)), -250, -280, 500, 500, 50, F(3.4)); [[-214, -244], [214, -244], [-214, 184], [214, 184]].forEach(([x, y], i) => screw(popAt(p, x, y, tu(.18 + .04 * i)), x, y, 5));
      const rg = popAt(p, 0, -30, tu(.3)); ring(rg, 0, -30, 196, 176, F(3)); rg.circle(0, -30, 176, F(1));
      const cp = mvG(popAt(p, 0, -30, Math.max(tu(.4), T0 - tu(.2))), { px: 0, py: -30, s: [[0, 1], [tP, 1], [tP + tu(.06), .9, 'in'], [tP + tu(.2), 1.03, 'out'], [tP + tu(.32), 1, 'soft']] });
      cp.circle(0, -30, 160, F(3.2)); cp.circle(0, -30, 144, S(1.4));
      hero(p, c, X, 0, -74, 130, 46, { maxW: 200, size: 38, bigSize: 46, bigW: 250 });
    }); });

  /* 08 ── ON THE STAGE: the stage and the posts rise, the mic stand grows; the person pops on stage; the board is let down onto the posts and
     the person gives a little hop — the call lands on the board */
  variant('stage', 'คนยืนบนเวที', (d, c) => { const X = st(d), T = TL(), H = T.H, T0 = T.T0;
    art(c, p => { floorD(p);
      [-300, 300].forEach((x, i) => R(inG(p, 'rise', x, 50, tu(.12 + .05 * i)), x - 10, -90, 20, 290, 4, F(2.4)));
      const bd = mvG(CL(p), { y: [[0, -360], [T0 - tu(.1), -360], [H - tu(.24), 8, 'out'], [H - tu(.12), -3, 'io'], [H, 0, 'soft']] }); card(bd, -360, -300, 720, 220, 14);
      const st0 = inG(p, 'rise', 0, 240, tu(.04)); R(st0, -440, 196, 880, 94, 6, F(3.4)); st0.line(-420, 218, 420, 218, S(1.4));
      const mc = mvG(p, growY(-150, 194, tu(.3))); mc.line(-150, 196, -150, 24, W(3)); ell(mc, -150, 194, 40, 7, F(2.2)); mc.line(-150, 24, -128, -6, W(3)); R(mc, -138, -46, 22, 40, 10, F(2.2));
      front(mvG(inG(p, 'pop', 70, 120, tu(.4)), { px: 70, py: 196, y: [[0, 0], [H - tu(.04), 0], [H + tu(.1), -18, 'out'], [H + tu(.24), 0, 'in']], sy: bumpK(H + tu(.24), .95) }), 70, 196, .78);
      heroH(p, c, X, -230, -190, 100, -150, -176, { cx: 0, cy: -190, size: 46, maxW: 470, bigSize: 52, bigW: 620 });
    }); });

  /* 09 ── THE ROUND SIGN ON A POST: the base pops, the post grows up; the round sign turns to face us (edge-on → full) and the call lands */
  variant('roundpost', 'ป้ายกลมบนเสา', (d, c) => { const X = st(d), T = TL(), H = T.H, T0 = T.T0;
    art(c, p => { floorD(p); ell(popAt(p, 0, 284, tu(.04)), 0, 284, 110, 11, F(2.6)); R(mvG(p, growY(0, 284, tu(.1), .3)), -10, 40, 20, 244, 6, F(2.6));
      disc(mvG(p, { px: 0, py: -110, sx: [[0, .04], [T0, .04], [H - tu(.14), 1.04, 'out'], [H, 1, 'soft']], o: fadeIn(T0, .04) }), 0, -110, 200);
      hero(p, c, X, 0, -146, 140, -24, { maxW: 280, size: 40, bigSize: 50, bigW: 290 });
    }); });

  /* 10 ── THE CARD ON THE SHELF: the shelf slides out from the wall, the brackets pop; the card drops onto the shelf, rocks and leans back
     against the wall; the call lands */
  variant('shelf', 'การ์ดวางบนชั้น', (d, c) => { const X = st(d), T = TL(), H = T.H, T0 = T.T0;
    art(c, p => {
      R(mvG(p, { px: 0, py: 142, sx: [[0, .05], [tu(.04), .05], [tu(.3), 1.02, 'out'], [tu(.4), 1, 'soft']], o: fadeIn(tu(.04), .04) }), -400, 130, 800, 24, 4, F(3));
      [-300, 300].forEach((x, i) => { const g = popAt(p, x, 190, tu(.3 + .05 * i)); R(g, x - 9, 154, 18, 70, 4, F(2.4)); screw(g, x, 200, 4); });
      const cg = mvG(CL(p), { px: -220, py: 130, y: [[0, -420], [tu(.4), -420], [T0, 0, 'in'], [T0 + tu(.06), -8, 'out'], [T0 + tu(.14), 0, 'soft']],
        r: [[0, 0], [T0 + tu(.14), 0], [T0 + tu(.3), 3, 'out'], [T0 + tu(.5), 0, 'io']], o: fadeIn(tu(.4)) });
      const g = rot(cg, -3, -200, 130); card(g, -220, -250, 440, 380, 12);
      hero(g, c, X, 0, -90, 150, 56, { maxW: 360, size: 44, bigSize: 56, bigW: 370 });
    }); });

  /* 11 ── THE BOOKMARK TAG: the hook goes into the wall and draws its bend, the ring pops; the tag drops in on the ring and swings, settling */
  variant('bookmark', 'ป้ายรูปที่คั่นหนังสือ', (d, c) => { const X = st(d), T = TL(), H = T.H, T0 = T.T0;
    art(c, p => { R(popAt(p, 0, -330, tu(.04)), -30, -340, 60, 22, 6, F(2.4)); drawAt(p.path('M 0 -318 L 0 -290 Q 0 -270 -18 -270', W(3)), p, tu(.12), tu(.15));
      const sw = mvG(CL(p), Object.assign({ px: 0, py: -270 }, swingK(Math.max(tu(.5), T0 - tu(.2)), H, 6)));
      shape(sw, [[-180, -276], [180, -276], [180, 260], [0, 180], [-180, 260]], F(3.4)); shape(sw, [[-158, -254], [158, -254], [158, 222], [0, 152], [-158, 222]], S(1.4));
      ring(sw, 0, -248, 20, 10, F(2.4));
      hero(p, c, X, 0, -96, 140, 40, { maxW: 290, size: 42, bigSize: 52, bigW: 300 });
    }); });

  /* 12 ── THREE BUTTONS IN A ROW: the plate pops, the buttons pop one by one; the call's own button is pressed and lights — its icon and
     label come up; the other two stay dim */
  variant('threebtn', 'ปุ่มสามปุ่มเรียงกัน', (d, c) => { const X = st(d), T = TL(), H = T.H, T0 = T.T0, act = ICON[d && d.action] ? d.action : null, others = ACTS.filter(a => a !== act).slice(0, 2), tP = H - tu(.16);
    art(c, p => {
      const pl = inG(p, 'pop', 0, 40, tu(.04)); R(pl, -440, -80, 880, 240, 44, F(3.4)); R(pl, -420, -60, 840, 200, 32, S(1.4));
      [-280, 280].forEach((x, i) => { const t = tu(.24 + .16 * i), g = popAt(p, x, 40, t); ring(g, x, 40, 88, 72, F(2.6)); g.circle(x, 40, 72, F(1.4));
        put(p, c, { icon: ICON[others[i]] }, x, 40, 92, null, { t: t + tu(.04), o: [[0, 0], [t + tu(.04), 0], [t + tu(.14), .4]] }); });
      const mb = mvG(popAt(p, 0, 40, tu(.32)), { px: 0, py: 40, s: [[0, 1], [tP, 1], [tP + tu(.06), .88, 'in'], [tP + tu(.2), 1.04, 'out'], [tP + tu(.32), 1, 'soft']] });
      ring(mb, 0, 40, 104, 84, F(3.4)); mb.circle(0, 40, 84, F(1.6)); ripple(p, 0, 40, 110, H);
      if (X && picOf(X)) { put(p, c, X, 0, 40, 110, null, { t: H - tu(.06) }); if (X.label) { const lg = atG(p, H + tu(.12)); shape(lg, [[-16, -120], [16, -120], [0, -98]], F(2)); txt(lg, X.label, 0, -146, { size: 46, maxW: 760, weight: 800, color: C.ink }); } }
      else if (X) txt(popAt(p, 0, -190, H - tu(.06)), X.label, 0, -170, { size: 56, maxW: 760, weight: 800, color: C.ink, wrap: 'mid' }); else star4(popAt(p, 0, 40, H - tu(.06)), 0, 40, 40);
    }); });

  /* 13 ── PINNED AND LINKED: the big disc pops onto the wall and its pin goes in; strings run out from the pin to two more pins, and the small
     discs pop onto them one after the other — the call lands on the big one */
  variant('pinned', 'แผ่นกลมปักหมุดโยงเชือก', (d, c) => { const X = st(d), T = TL(), H = T.H, T0 = T.T0, A0 = [-150, 10], P1 = [270, -200], P2 = [270, 210], pin = [A0[0], A0[1] - 196];
    art(c, p => { const tS = Math.max(tu(.4), T0 - tu(.1));
      [P1, P2].forEach(([x, y], i) => drawAt(p.line(...pin, x, y, W(2)), p, tS + tu(.12 * i), tu(.3)));
      disc(inG(p, 'pop', ...A0, tu(.04)), ...A0, 196); popAt(p, ...pin, tu(.3)).circle(...pin, 10, F(2.2));
      [P1, P2].forEach(([x, y], i) => { const g = popAt(p, x, y, tS + tu(.28 + .12 * i)); disc(g, x, y, 80); g.circle(x, y, 10, F(2.2)); });
      ripple(p, A0[0], A0[1], 200, H); hero(p, c, X, A0[0], A0[1] - 34, 140, A0[1] + 78, { maxW: 230, size: 38, bigSize: 50, bigW: 290, rip: false });
    }); });

  /* 14 ── HOLDING THE SIGN: the person rises in holding the sign; the sign is shown off with a little rock; the call lands and the smile pops */
  variant('holdsign', 'คนถือป้าย', (d, c) => { const X = st(d), T = TL(), H = T.H, T0 = T.T0, k = 1.28;
    art(c, p => { floorD(p); const pg = inG(p, 'rise', 0, 100, tu(.04));
      front(pg, 0, 290, k, { [-1]: { s: [-36, -82], e: [-92, -40], h: [-124, -4] }, 1: { s: [36, -82], e: [92, -40], h: [124, -4] } });
      const sg = mvG(pg, { px: 0, py: 60, r: [[0, 0], [T0, 0], [T0 + tu(.16), -2.5, 'out'], [T0 + tu(.4), 1.8, 'io'], [T0 + tu(.62), -.8, 'io'], [H - tu(.1), 0, 'soft']], y: [[0, 0], [T0, 0], [T0 + tu(.16), -10, 'out'], [H - tu(.1), 0, 'soft']] });
      card(sg, -230, -30, 460, 250, 14); [-1, 1].forEach(sd => R(sg, sd * 206 - 18, 20, 36, 60, 14, F(2.6)));
      put(p, c, { icon: 'smile' }, 178, 18, 44, null, { t: H + tu(.18), punch: H + tu(.3) });
      hero(p, c, X, 0, 54, 120, 166, { maxW: 300, size: 40, bigSize: 52, bigW: 380, rip: false });
    }); });

  /* 15 ── POINTING AT THE BUTTON: the plate and the button pop; the person slides in and raises the arm to point; the dotted line runs out
     to the button, which is pressed — the call lands */
  variant('pointbtn', 'คนชี้ไปที่ปุ่ม', (d, c) => { const X = st(d), T = TL(), H = T.H, T0 = T.T0, px = -330, k = .96, bx = 230, by = -60, tP = H - tu(.12);
    art(c, p => { floorD(p);
      R(inG(p, 'pop', bx, by, tu(.04)), 60, -250, 340, 400, 30, F(3.4)); disc(mvG(popAt(p, bx, by, tu(.18)), { px: bx, py: by, s: [[0, 1], [tP, 1], [tP + tu(.06), .9, 'in'], [tP + tu(.2), 1.03, 'out'], [tP + tu(.3), 1, 'soft']] }), bx, by, 130);
      const hm = person(mvG(p, { x: slideX(tu(.08), -140), o: fadeIn(tu(.08)) }), px, 290, k, { s: [4, -76], e: [56, -96], h: [108, -108] }, { far: { s: [-4, -74], e: [8, -30], h: [16, 16] } });
      hm.on('upper1', p, 0, { ox: 4, oy: -76, r: armK(101, T0, T0 + tu(.3)) }); hm.on('fore1', p, 0, { ox: 56, oy: -96, r: armK(-8, T0, T0 + tu(.3), 0) });
      const [hx, hy] = pAt(px, 290, k, 124, -110), a = [hx + 6, hy], b = [bx - 140, by + 4];
      for (let i = 0; i <= 9; i++) litG(p, T0 + tu(.34 + .025 * i), .04).circle(f1(lerp(a[0], b[0], i / 9)), f1(lerp(a[1], b[1], i / 9)), 3.4, { fill: C.soft, sw: 0, stroke: 'none' });
      hero(p, c, X, bx, by, 120, 116, { maxW: 300, size: 36, bigSize: 42, bigW: 210, rip: false }); ripple(p, bx, by, 136, H);
    }); });

  /* 16 ── THE DESK BELL: the counter pops, the legs draw; the bell drops onto it; its plunger is struck — the bell shivers, the sound rings
     out in arcs — and the call comes up above it on the keyword */
  variant('deskbell', 'กระดิ่งตั้งโต๊ะ', (d, c) => { const X = st(d), T = TL(), H = T.H, T0 = T.T0, tS = Math.max(tu(.6), T0);
    art(c, p => { R(inG(p, 'pop', 0, 240, tu(.04)), -480, 230, 960, 22, 4, F(3)); [-450, 450].forEach(x => drawAt(p.line(x, 252, x, 340, S(2)), p, tu(.14), tu(.2)));
      const bl = mvG(inG(CL(p), 'drop', 0, 200, tu(.24)), { px: 0, py: 230, r: buzzK(tS + tu(.04), 2.4) });
      R(bl, -170, 200, 340, 30, 10, F(3)); bl.path('M -140 200 C -140 80 -76 50 0 50 C 76 50 140 80 140 200 Z', F(3.4));
      const kn = mvG(bl, { y: [[0, 0], [tS - tu(.04), 0], [tS, 12, 'in'], [tS + tu(.12), 0, 'out']] }); R(kn, -8, 16, 16, 36, 4, F(2.2)); ell(kn, 0, 14, 34, 9, F(2.6));
      [-1, 1].forEach(sd => arcsAt(p, sd * 190, 120, sd, 2, 30, 22, 40, tS + tu(.04)));
      hero(p, c, X, 0, -190, 140, -54, { maxW: 760, size: 48, bigSize: 60, bigW: 700 });
    }); });

  /* 17 ── THE COMMENT BOX: the box rises, the lid with its slot drops on; a card comes up out of the slot (overshoots, settles) and the call
     lands on it */
  variant('slotbox', 'กล่องรับความคิดเห็น', (d, c) => { const X = st(d), T = TL(), H = T.H, T0 = T.T0, tE = H - tu(.14);
    art(c, p => { floorD(p);
      card(mvG(clipG(p, -500, -350, 1000, 388), { y: [[0, 340], [T0, 340], [tE, -12, 'out'], [tE + tu(.12), 0, 'soft']] }), -150, -280, 300, 330, 12);
      const lid = inG(p, 'drop', 0, 44, tu(.2)); R(lid, -280, 30, 560, 30, 8, F(3)); R(lid, -170, 38, 340, 12, 6, { fill: C.fill, sw: 2 });
      const bx = inG(p, 'rise', 0, 180, tu(.04)); R(bx, -260, 60, 520, 230, 8, F(3.4)); R(bx, -240, 80, 480, 190, 4, S(1.4));
      hero(p, c, X, 0, -156, 120, -30, { maxW: 230, size: 36, bigSize: 44, bigW: 240 });
    }); });

  /* 18 ── THE CLOSING SIGN: the ceiling line draws and the mounts pop; the sign is let down on its two wires, bobs and settles; the call lands */
  variant('ceiling', 'ป้ายแขวนเพดาน', (d, c) => { const X = st(d), T = TL(), H = T.H, T0 = T.T0, tE = H - tu(.22);
    art(c, p => { drawAt(p.line(-480, -340, 480, -340, S(2)), p, 0, tu(.3));
      const sg = mvG(clipG(p, -500, -334, 1000, 690), { y: [[0, -420], [Math.max(tu(.4), T0 - tu(.2)), -420], [tE, 10, 'out'], [tE + tu(.12), -4, 'io'], [tE + tu(.22), 0, 'soft']] });
      [-300, 300].forEach(x => sg.line(x, -760, x, -200, W(2))); card(sg, -400, -200, 800, 300, 18);
      [-300, 300].forEach((x, i) => R(popAt(p, x, -334, tu(.12 + .05 * i)), x - 22, -340, 44, 12, 4, F(2)));
      heroH(p, c, X, -220, -50, 140, -120, -32, { cx: 0, cy: -50, size: 58, maxW: 460, bigSize: 64, bigW: 700 });
    }); });

  /* 19 ── THE INVITATION: the legs rise and the sign drops onto them; the person slides in and opens an arm toward it — the call lands */
  variant('invite', 'คนยืนเชิญชวน', (d, c) => { const X = st(d), T = TL(), H = T.H, T0 = T.T0, px = -340, k = .94;
    art(c, p => { floorD(p);
      [-10, 390].forEach((x, i) => { const g = inG(p, 'rise', x, 160, tu(.04 + .05 * i)); R(g, x - 9, 40, 18, 250, 4, F(2.4)); R(g, x - 34, 278, 68, 12, 5, F(2)); });
      card(inG(CL(p), 'drop', 190, -90, tu(.28)), -60, -250, 500, 320, 14);
      const hm = person(mvG(p, { x: slideX(tu(.2), -140), o: fadeIn(tu(.2)) }), px, 290, k, { s: [4, -76], e: [50, -64], h: [100, -80] }, { far: { s: [-4, -74], e: [-6, -28], h: [0, 16] } });
      hm.on('upper1', p, 0, { ox: 4, oy: -76, r: armK(65, T0, H - tu(.16)) }); hm.on('fore1', p, 0, { ox: 50, oy: -64, r: armK(33, T0, H - tu(.16), 0) });
      hero(p, c, X, 190, -140, 130, -4, { maxW: 400, size: 44, bigSize: 54, bigW: 410 });
    }); });

  /* 20 ── WAVING GOODBYE (user: "ตัวคนต้องหันหน้าตรงมา"): the door frame draws, the sign pops above it; the door swings open; the person,
     facing us beside the open door, raises an arm and waves goodbye — the call lands on the sign */
  variant('goodbye', 'คนโบกมือลา', (d, c) => { const X = st(d), T = TL(), H = T.H, T0 = T.T0, px = -170, k = .98;
    art(c, p => { floorD(p);
      R(litG(p, T0 + tu(.2), .2), 170, -70, 250, 360, 4, { fill: 'rgba(255,255,255,.06)', sw: 0, stroke: 'none' }); drawAt(R(p, 170, -70, 250, 360, 4, { fill: 'none', sw: 3.2 }), p, tu(.04), tu(.35));
      const dr = mvG(p, { px: 170, py: 110, sx: [[0, 3.1], [T0, 3.1], [T0 + tu(.4), .9, 'out'], [T0 + tu(.52), 1, 'soft']], o: fadeIn(tu(.2)) });
      shape(dr, [[170, -70], [250, -40], [250, 300], [170, 290]], F(3)); dr.circle(234, 120, 7, F(2));
      card(inG(p, 'pop', 295, -220, tu(.3)), 110, -320, 370, 200, 14);
      const hm = front(inG(p, 'rise', px, 140, tu(.12)), px, 290, k, { [-1]: { s: [-36, -82], e: [-94, -126], h: [-86, -200] } });
      hm.on('upper-1', p, 0, { ox: -36, oy: -82, r: armK(-111, T0, T0 + tu(.3), 5) }); hm.on('fore-1', p, 0, { ox: -94, oy: -126, r: waveK(-71, T0, H + tu(.5)) });
      const [hx, hy] = fAt(px, 290, k, -86, -210), wa = litG(p, H - tu(.1)); waveArcs(wa, hx - 24, hy, -1); waveArcs(wa, hx + 22, hy, 1);
      heroH(p, c, X, 190, -220, 90, 250, -207, { cx: 295, cy: -220, size: 36, maxW: 200, bigSize: 42, bigW: 320 });
    }); });

  /* 21 ── THE BOOKMARK BANNERS (round 1, kept by the user as a 21st design): the rod pops up with its brackets and caps; the two side banners
     unroll down from their rings, then the long middle one — the call lands on it */
  variant('bookmarks', 'ป้ายที่คั่นหนังสือแขวน', (d, c) => { const X = st(d), T = TL(), H = T.H, T0 = T.T0, mark = (q, x, w, y1, notch) => shape(q, [[x - w, -270], [x + w, -270], [x + w, y1], [x, y1 - notch], [x - w, y1]], F(3.2));
    art(c, p => {
      [[-290, 90, 60, 50, tu(.34)], [290, 90, 10, 50, tu(.44)], [0, 180, 250, 80, Math.max(tu(.6), T0)]].forEach(([x, w, y1, n, t]) => {
        const e = x === 0 ? H - tu(.16) : t + tu(.3), g = mvG(p, { px: x, py: -270, sy: [[0, .02], [t, .02], [e, 1.04, 'out'], [e + tu(.1), 1, 'soft']], o: fadeIn(t, .02) });
        mark(g, x, w, y1, n); shape(g, [[x - w + 18, -252], [x + w - 18, -252], [x + w - 18, y1 - 22], [x, y1 - n - 18], [x - w + 18, y1 - 22]], S(1.3));
        if (x) { star4(g, x, -150, 16, { fill: C.fill, sw: 2 }); lines(g, x - 40, -90, 80, 3, 30, S(1.8), [2]); } });
      const rd = inG(p, 'pop', 0, -297, tu(.04)); R(rd, -440, -306, 880, 18, 8, F(2.6)); [-440, 440].forEach(x => rd.circle(x, -297, 16, F(2.4)));
      [-400, 400].forEach(x => { rd.line(x, -330, x, -306, W(2.4)); R(rd, x - 20, -350, 40, 20, 6, F(2.2)); });
      [[-290, 90], [290, 90], [0, 180]].forEach(([x, w], i) => [-1, 1].forEach(sd => ring(popAt(p, x + sd * w * .6, -296, tu(.2 + .04 * i)), x + sd * w * .6, -296, 13, 7, F(2))));
      hero(p, c, X, 0, -110, 150, 30, { maxW: 300, size: 42, bigSize: 52, bigW: 300 });
    }); });

  /* ---------- sample data (A: calls from unrelated topics · B: stress) ---------- */
  const A = (action, label) => label ? { action, label } : { action };
  const SAMPLES = [
    Object.assign({ say: 'อย่าลืมกดติดตามนะครับ' }, A('follow', 'กดติดตาม')),
    Object.assign({ say: 'บอกในคอมเมนต์หน่อย ชอบเมนูไหน' }, A('comment', 'บอกในคอมเมนต์')),
    Object.assign({ say: 'ถ้าชอบคลิปนี้ ฝากกดหัวใจด้วย' }, A('like', 'ฝากกดหัวใจ')),
    Object.assign({ say: 'เซฟเก็บไว้ ใช้ตอนไปเที่ยว' }, A('save', 'เซฟเก็บไว้')),
    Object.assign({ say: 'แชร์ให้เพื่อนที่ชอบทำอาหาร' }, A('share', 'แชร์ให้เพื่อน')),
    Object.assign({ say: 'ติดตามไว้ มีสูตรใหม่ทุกสัปดาห์' }, A('follow', 'มีสูตรใหม่ทุกสัปดาห์')),
    Object.assign({ say: 'กดไลก์ให้กำลังใจกันหน่อย' }, A('like', 'กดไลก์')),
    Object.assign({ say: 'คุณคิดยังไง คอมเมนต์มาคุยกัน' }, A('comment', 'มาคุยกัน')),
    Object.assign({ say: 'บันทึกไว้ก่อน เดี๋ยวหาไม่เจอ' }, A('save', 'บันทึกไว้ก่อน')),
    Object.assign({ say: 'ส่งต่อให้คนที่กำลังหางานอยู่' }, A('share', 'ส่งต่อ')),
    Object.assign({ say: 'แล้วเจอกันคลิปหน้า กดติดตามไว้' }, A('follow', 'เจอกันคลิปหน้า')),
    Object.assign({ say: 'ชอบแบบไหน เลือกแล้วกดเลย' }, A('like', 'กดเลย')),
    Object.assign({ say: 'แชร์ไปให้ครอบครัวดูด้วย' }, A('share', 'แชร์ให้ครอบครัว')),
    Object.assign({ say: 'ยิ้มไว้ แล้วกดติดตามกัน' }, A('follow', 'ติดตามกัน')),
    Object.assign({ say: 'กดตรงนี้ เซฟเก็บไว้ดูทีหลัง' }, A('save', 'ดูทีหลัง')),
    Object.assign({ say: 'เปิดแจ้งเตือนไว้ จะได้ไม่พลาด' }, A('follow', 'ไม่พลาดคลิปใหม่')),
    Object.assign({ say: 'ทิ้งคำถามไว้ในคอมเมนต์ได้เลย' }, A('comment', 'ทิ้งคำถามไว้')),
    Object.assign({ say: 'จบแล้วครับ ฝากกดไลก์ด้วย' }, A('like', 'ฝากกดไลก์')),
    Object.assign({ say: 'เชิญเลย แชร์ให้คนที่คุณรัก' }, A('share', 'แชร์ให้คนที่รัก')),
    Object.assign({ say: 'บ๊ายบาย อย่าลืมเซฟคลิปนี้' }, A('save', 'อย่าลืมเซฟ')),
    Object.assign({ say: 'แล้วเจอกันคลิปหน้า กดติดตามไว้' }, A('follow', 'เจอกันคลิปหน้า')),
  ];
  const STRESS = [
    Object.assign({ say: 'ไม่มีป้าย' }, A('follow')),
    Object.assign({ say: 'ป้ายยาว' }, A('comment', 'คอมเมนต์บอกหน่อยว่าอยากให้ทำเรื่องอะไรต่อ')),
    Object.assign({ say: 'ภาษาอังกฤษ' }, A('like', 'Smash that like')),
    Object.assign({ say: 'action ผิด (ป้ายแทนภาพ)' }, A('subscribe', 'กดกระดิ่ง')),
    Object.assign({ say: 'ไม่มีอะไรเลย' }, {}),
    Object.assign({ say: 'ไม่มีป้าย 2' }, A('save')),
    Object.assign({ say: 'อังกฤษยาว' }, A('share', 'Share it with someone who needs it')),
    Object.assign({ say: 'ป้ายสั้นมาก' }, A('like', 'ไลก์')),
    Object.assign({ say: 'ตัวเลขในป้าย' }, A('follow', 'ติดตาม 1 คลิปทุกวัน')),
    Object.assign({ say: 'action ผิดไม่มีป้าย' }, A('watch')),
    Object.assign({ say: 'ป้ายยาวมาก' }, A('save', 'บันทึกคลิปนี้ไว้แล้วกลับมาดูอีกครั้งตอนที่พร้อมลงมือทำ')),
    Object.assign({ say: 'ไม่มีป้าย 3' }, A('comment')),
    Object.assign({ say: 'ป้ายปกติ' }, A('share', 'แชร์ต่อ')),
    Object.assign({ say: 'อังกฤษ 2' }, A('follow', 'Follow for more')),
    Object.assign({ say: 'ไม่มีป้าย 4' }, A('like')),
    Object.assign({ say: 'ป้ายยาว 2' }, A('follow', 'กดติดตามแล้วเปิดแจ้งเตือนจะได้ไม่พลาด')),
    Object.assign({ say: 'ไม่มีป้าย 5' }, A('share')),
    Object.assign({ say: 'ป้ายแทนภาพยาว' }, A('', 'ขอบคุณที่ดูจนจบนะครับ')),
    Object.assign({ say: 'อังกฤษยาว 2' }, A('comment', 'Tell me what you think below')),
    Object.assign({ say: 'ไม่มีอะไรเลย 2' }, null),
    Object.assign({ say: 'ป้ายยาวมาก 2' }, A('save', 'บันทึกคลิปนี้ไว้แล้วกลับมาดูอีกครั้งตอนที่พร้อมลงมือทำ')),
  ];

  G.cats = G.cats || {};
  G.cats.B15 = { variants: V, SAMPLES, STRESS, draw: (i, d, c) => { setZ(c); CUR = V[i].id; V[i].build(d || {}, c); }, CLAMPS, timing: c => (setZ(c), Object.assign({}, Z)) };
})();
