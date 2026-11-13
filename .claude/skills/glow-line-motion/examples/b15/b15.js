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

  /* 01 ── POINTING OUT AT YOU: a person (front view) points out toward the viewer — the arm thrust down-forward, a burst at its end;
     the call sits on a big round plaque on the wall behind */
  variant('pointout', 'คนชี้มาทางผู้ชม', (d, c) => { const X = st(d);
    art(c, p => { floorD(p);
      const bx = -190, by = -96; p.line(bx, -350, bx, by - 176, S(1.8)); R(p, bx - 34, by - 196, 68, 26, 8, F(2.4));
      ring(p, bx, by, 176, 152, F(3.4)); p.circle(bx, by, 152, F(1)); p.circle(bx, by, 138, S(1.4)); [-1, 1].forEach(sd => screw(p, bx + sd * 164, by, 4));
      hero(p, c, X, bx, by - 34, 140, by + 82, { maxW: 250, size: 40, bigSize: 52, bigW: 250, rip: false });
      const px = 200, k = 1.06; front(p, px, 290, k, { 1: { s: [36, -82], e: [86, -40], h: [128, -2] } });
      const [hx, hy] = fAt(px, 290, k, 140, 6); burst(p, hx, hy, 22, 42, 8, 0, [4, 5, 6]);
    }); });

  /* 02 ── THE ARROW STANDEE: a big arrow-shaped board on a post points at the call card on the wall */
  variant('arrowstand', 'ป้ายลูกศรชี้ข้อความ', (d, c) => { const X = st(d);
    art(c, p => { floorD(p);
      const ay = -10; R(p, -322, ay + 50, 24, 290 - ay - 50, 6, F(2.6)); shape(p, [[-390, 290], [-250, 290], [-290, 268], [-350, 268]], F(2.4));
      shape(p, [[-450, ay - 54], [-170, ay - 54], [-170, ay - 112], [-40, ay], [-170, ay + 112], [-170, ay + 54], [-450, ay + 54]], F(3.4));
      shape(p, [[-430, ay - 34], [-150, ay - 34], [-150, ay - 70], [-70, ay], [-150, ay + 70], [-150, ay + 34], [-430, ay + 34]], S(1.4));
      screw(p, -310, ay, 5);
      R(p, 10, -250, 440, 400, 18, F(3.4)); R(p, 32, -228, 396, 356, 10, S(1.4)); [[34, -226], [426, -226], [34, 126], [426, 126]].forEach(([x, y]) => screw(p, x, y, 4));
      hero(p, c, X, 230, -96, 150, 52, { maxW: 360, size: 44, bigSize: 56, bigW: 370 });
    }); });

  /* 03 ── WAVING FROM THE WINDOW: a person waves out of an open window (shutters swung out); the call hangs below the sill on two chains */
  variant('window', 'คนโบกมือจากหน้าต่าง', (d, c) => { const X = st(d), wx0 = -190, wx1 = 190, wy0 = -320, wy1 = -10;
    art(c, p => {
      const cl = clipG(p, wx0 + 16, wy0 + 16, wx1 - wx0 - 32, wy1 - wy0 - 16); R(cl, wx0, wy0, wx1 - wx0, 400, 0, { fill: 'rgba(255,255,255,.05)', sw: 0, stroke: 'none' });
      const px = -30, k = .96; front(cl, px, 160, k, { 1: { s: [36, -82], e: [96, -132], h: [86, -202] } });
      const [hx, hy] = fAt(px, 160, k, 86, -210); waveArcs(p, hx + 20, hy, 1); waveArcs(p, hx - 26, hy, -1);
      R(p, wx0, wy0, wx1 - wx0, wy1 - wy0, 6, { fill: 'none', sw: 3.4 }); R(p, wx0 + 16, wy0 + 16, wx1 - wx0 - 32, wy1 - wy0 - 16, 2, { fill: 'none', sw: 1.6, stroke: C.soft });
      [-1, 1].forEach(sd => { const x = sd > 0 ? wx1 : wx0; shape(p, [[x, wy0 + 8], [x + sd * 120, wy0 - 14], [x + sd * 120, wy1 + 14], [x, wy1 - 8]], F(3));
        for (let k2 = 1; k2 < 6; k2++) { const y = lerp(wy0 + 8, wy1 - 8, k2 / 6); p.line(x + sd * 14, y - 2 * sd * 0, x + sd * 106, lerp(wy0 - 14, wy1 + 14, k2 / 6) + (y - lerp(wy0 + 8, wy1 - 8, k2 / 6)), S(1.4)); } });
      R(p, wx0 - 40, wy1, wx1 - wx0 + 80, 26, 6, F(3));
      [-150, 150].forEach(x => { for (let y = wy1 + 34; y < 96; y += 18) ell(p, x, y, 6, 9, S(1.6)); });
      R(p, -260, 100, 520, 170, 14, F(3.4)); R(p, -240, 120, 480, 130, 8, S(1.4));
      heroH(p, c, X, -150, 185, 100, -84, 200, { cx: 0, cy: 185, size: 42, maxW: 310, bigSize: 50, bigW: 460 });
    }); });

  /* 04 ── THE CLAPPERBOARD ("start" — the slate of every take): the striped stick is up, hinged at the left; the call sits on the slate */
  variant('clapper', 'กระดานสเลตเริ่มถ่าย', (d, c) => { const X = st(d), x0 = -290, x1 = 290, y0 = -110;
    art(c, p => { floorD(p);
      const stripes = (q, y, h, k0) => { R(q, x0, y, x1 - x0, h, 6, F(3)); for (let x = x0 + 40, i = 0; x < x1; x += 70, i++) shape(q, [[x, y + 2], [x + 34, y + 2], [x + 4, y + h - 2], [x - 30, y + h - 2]].map(([a, b]) => [Math.max(x0 + 2, Math.min(x1 - 2, a)), b]), { fill: C.soft, sw: 0, stroke: 'none' }); };
      R(p, x0, y0, x1 - x0, 290 - y0, 12, F(3.6)); stripes(p, y0, 46);
      R(p, x0 + 22, y0 + 66, x1 - x0 - 44, 290 - y0 - 88, 6, S(1.4)); p.line(x0 + 22, 210, x1 - 22, 210, S(1.4)); [-96, 96].forEach(x => p.line(x, 210, x, 268, S(1.4)));
      const stk = rot(p, -16, x0 + 8, y0 - 2); stripes(stk, y0 - 50, 46);
      p.circle(x0 + 8, y0 - 2, 11, F(2.4)); p.circle(x0 + 8, y0 - 2, 4, SOLID(1));
      hero(p, c, X, 0, 28, 150, 160, { maxW: 470, size: 46, bigSize: 60, bigW: 480, bigDy: 74 });
    }); });

  /* 05 ── HOLDING IT UP HIGH: a person (front view) lifts a big round plate over the head with both arms; the call is on the plate */
  variant('liftup', 'คนยกป้ายกลมเหนือหัว', (d, c) => { const X = st(d), k = .9;
    art(c, p => { floorD(p);
      front(p, 0, 290, k, { [-1]: { s: [-36, -82], e: [-78, -150], h: [-60, -222] }, 1: { s: [36, -82], e: [78, -150], h: [60, -222] } });
      const cy = -196; ring(p, 0, cy, 150, 128, F(3.4)); p.circle(0, cy, 128, F(1)); p.circle(0, cy, 114, S(1.4));
      [-1, 1].forEach(sd => [[-30, 0], [0, -34], [30, -6]].forEach(([dx, dy], i) => star4(p, sd * (204 + dx), cy - 60 + dy + i * 40, 9 - i * 2)));
      hero(p, c, X, 0, cy - 34, 110, cy + 58, { maxW: 180, size: 30, bigSize: 40, bigW: 190, rip: false });
    }); });

  /* 06 ── THE INVITATION CARD: a folded card stands open on the table (the call on its right page), its envelope leaning beside it */
  variant('invite', 'การ์ดคำเชิญตั้งโต๊ะ', (d, c) => { const X = st(d);
    art(c, p => { R(p, -480, 200, 960, 22, 4, F(3)); p.line(-460, 222, -460, 330, S(2)); p.line(460, 222, 460, 330, S(2));
      const ev = rot(p, -10, -330, 200); R(ev, -450, 60, 230, 140, 6, F(3)); ev.path('M -450 60 L -335 140 L -220 60', W(2.2)); R(ev, -270, 76, 30, 34, 3, S(1.4));
      shape(p, [[-220, -190], [10, -250], [10, 200], [-220, 180]], F(3.2)); shape(p, [[-200, -170], [-10, -220], [-10, 180], [-200, 164]], S(1.2));
      R(p, 10, -250, 320, 450, 4, F(3.4)); R(p, 32, -228, 276, 406, 4, S(1.4));
      [[44, -216, 0], [296, -216, 90], [296, 166, 180], [44, 166, 270]].forEach(([x, y, a]) => { const g = rot(p, a, x, y); g.path(`M ${x} ${y + 30} L ${x} ${y} L ${x + 30} ${y}`, S(1.8)); });
      hero(p, c, X, 170, -60, 140, 76, { maxW: 250, size: 40, bigSize: 50, bigW: 250 });
    }); });

  /* 07 ── THE BIG BUTTON: a giant capsule push button sits on its pedestal console (skirt ring, cap with its rim); the call is on the cap */
  variant('bigbutton', 'ปุ่มกดขนาดใหญ่', (d, c) => { const X = st(d);
    art(c, p => { floorD(p);
      shape(p, [[-250, 90], [250, 90], [280, 290], [-280, 290]], F(3.4)); shape(p, [[-226, 112], [226, 112], [250, 268], [-250, 268]], S(1.4));
      [-120, 0, 120].forEach(x => p.circle(x, 200, 10, S(1.6))); R(p, -60, 236, 120, 12, 6, S(1.2));
      R(p, -310, 30, 620, 70, 35, F(3.2)); R(p, -296, 50, 592, 22, 11, S(1.2));
      R(p, -280, -210, 560, 250, 125, F(3.6)); R(p, -254, -186, 508, 202, 101, S(1.4));
      heroH(p, c, X, -150, -85, 120, -70, -68, { cx: 0, cy: -85, size: 48, maxW: 300, bigSize: 54, bigW: 440 });
    }); });

  /* 08 ── THE CURTAIN CALL: on stage between the drawn curtains, a person spreads both arms; the call hangs from the valance on wires */
  variant('curtaincall', 'คนยืนหน้าเวที', (d, c) => { const X = st(d), k = .74;
    art(c, p => {
      ell(p, 0, 252, 470, 40, F(3)); R(p, -470, 252, 940, 50, 0, { fill: C.fill, sw: 0, stroke: 'none' }); p.line(-470, 252, -470, 300, W(3)); p.line(470, 252, 470, 300, W(3));
      [-1, 1].forEach(sd => { const xo = sd * 480, xi = sd * 330;
        p.path(`M ${xo} -290 L ${xi} -290 Q ${sd * 360} -120 ${sd * 400} -40 Q ${sd * 370} 100 ${sd * 380} 240 L ${xo} 240 Z`, F(3.2));
        [.3, .55, .8].forEach(u => p.path(`M ${f1(lerp(xi, xo, u))} -280 Q ${f1(lerp(sd * 380, xo, u))} -100 ${f1(lerp(sd * 410, xo, u))} -40 Q ${f1(lerp(sd * 390, xo, u))} 100 ${f1(lerp(sd * 400, xo, u))} 236`, S(1.4)));
        R(p, sd * 408 - 26, -54, 52, 24, 10, F(2.2)); });
      R(p, -490, -340, 980, 60, 4, F(3)); p.path('M -490 -280 ' + Array.from({ length: 10 }, (_, i) => `Q ${-441 + 98 * i} -246 ${-392 + 98 * i} -280`).join(' '), F(2.6));
      [-180, 180].forEach(x => p.line(x, -262, x, -212, W(2)));
      R(p, -230, -212, 460, 132, 12, F(3.4)); R(p, -214, -196, 428, 100, 6, S(1.2));
      front(p, 0, 262, k, { [-1]: { s: [-36, -82], e: [-86, -96], h: [-134, -118] }, 1: { s: [36, -82], e: [86, -96], h: [134, -118] } });
      heroH(p, c, X, -150, -146, 92, -90, -133, { cx: 0, cy: -146, size: 40, maxW: 290, bigSize: 48, bigW: 400 });
    }); });

  /* 09 ── THE PADDLE SIGNS: round paddle signs stand in a holder; one is raised high — the call on it */
  variant('paddles', 'ป้ายด้ามจับในกระบอก', (d, c) => { const X = st(d);
    art(c, p => { floorD(p);
      [-1, 1].forEach(sd => { const g = rot(p, sd * 30, sd * 40, 200); R(g, sd * 40 - 9, 0, 18, 200, 6, F(2.4)); ring(g, sd * 40, -40, 72, 58, F(3)); g.circle(sd * 40, -40, 58, F(1)); g.circle(sd * 40, -40, 44, S(1.2)); });
      R(p, -11, -60, 22, 270, 6, F(2.6)); [100, 116].forEach(y => p.line(-11, y, 11, y - 6, S(1.4)));
      ring(p, 0, -190, 150, 132, F(3.4)); p.circle(0, -190, 132, F(1)); p.circle(0, -190, 118, S(1.4));
      R(p, -120, 160, 240, 130, 10, F(3.2)); ell(p, 0, 160, 120, 18, F(3)); ell(p, 0, 160, 100, 12, S(1.4)); p.line(-120, 250, 120, 250, S(1.4));
      hero(p, c, X, 0, -226, 108, -124, { maxW: 196, size: 30, bigSize: 42, bigW: 200, rip: false });
    }); });

  /* 10 ── THE ROLL-UP BANNER: a pull-up banner drawn up out of its base cassette, hooked to the top rail; the call heads the banner */
  variant('rollup', 'ป้ายโรลอัพตั้งพื้น', (d, c) => { const X = st(d), x0 = -170, x1 = 170;
    art(c, p => { floorD(p);
      p.line(x1 + 26, -296, x1 + 26, 262, S(2)); R(p, x0, -300, x1 - x0, 560, 0, F(3.4));
      R(p, x0 + 20, -280, x1 - x0 - 40, 300, 8, S(1.4)); lines(p, -110, 70, 220, 3, 34, S(2), [2]); R(p, x0, 186, x1 - x0, 30, 0, { fill: 'rgba(255,255,255,.12)', sw: 0, stroke: 'none' });
      R(p, x0 - 14, -314, x1 - x0 + 28, 22, 10, F(2.8));
      R(p, x0 - 26, 250, x1 - x0 + 52, 34, 16, F(3)); [x0 - 10, x1 + 10].forEach(x => { p.line(x, 284, x + (x < 0 ? -40 : 40), 290, W(3)); });
      hero(p, c, X, 0, -170, 150, -40, { maxW: 290, size: 40, bigSize: 50, bigW: 290 });
    }); });

  /* 11 ── THE BOOKMARK BANNERS: three bookmark-shaped banners hang from a rod on rings; the middle, longest one carries the call */
  variant('bookmarks', 'ป้ายที่คั่นหนังสือแขวน', (d, c) => { const X = st(d), mark = (q, x, w, y1, notch) => shape(q, [[x - w, -270], [x + w, -270], [x + w, y1], [x, y1 - notch], [x - w, y1]], F(3.2));
    art(c, p => { R(p, -440, -306, 880, 18, 8, F(2.6)); [-440, 440].forEach(x => p.circle(x, -297, 16, F(2.4))); [-400, 400].forEach(x => { p.line(x, -330, x, -306, W(2.4)); R(p, x - 20, -350, 40, 20, 6, F(2.2)); });
      [[-290, 90, 60, 50], [290, 90, 10, 50], [0, 180, 250, 80]].forEach(([x, w, y1, n]) => { [-1, 1].forEach(sd => ring(p, x + sd * w * .6, -296, 13, 7, F(2))); mark(p, x, w, y1, n);
        shape(p, [[x - w + 18, -252], [x + w - 18, -252], [x + w - 18, y1 - 22], [x, y1 - n - 18], [x - w + 18, y1 - 22]], S(1.3)); });
      [-290, 290].forEach(x => { star4(p, x, -150, 16, { fill: C.fill, sw: 2 }); lines(p, x - 40, -90, 80, 3, 30, S(1.8), [2]); });
      hero(p, c, X, 0, -110, 150, 30, { maxW: 300, size: 42, bigSize: 52, bigW: 300 });
    }); });

  /* 12 ── THREE BUTTONS IN A ROW: a control pad on a stand with three round buttons; the one for the call is lit and raised, the other two dim */
  variant('threebtn', 'ปุ่มสามปุ่มเรียงกัน', (d, c) => { const X = st(d), act = ICON[d && d.action] ? d.action : null, others = ACTS.filter(a => a !== act).slice(0, 2);
    art(c, p => { floorD(p);
      R(p, -60, 150, 120, 140, 6, F(2.6)); ell(p, 0, 286, 160, 14, F(2.6));
      R(p, -440, -90, 880, 250, 48, F(3.6)); R(p, -418, -68, 836, 206, 36, S(1.4));
      [-280, 280].forEach((x, i) => { ring(p, x, 35, 92, 76, F(2.8)); p.circle(x, 35, 76, F(1.4)); put(p, c, { icon: ICON[others[i]] }, x, 35, 96, null, { o: [[0, .4]] }); });
      haloH(p, 0, 35, 128); ring(p, 0, 35, 104, 86, F(3.2)); p.circle(0, 35, 86, F(1.6));
      if (X && picOf(X)) { put(p, c, X, 0, 35, 110, null, { t: Z.H - tu(.06) }); if (X.label) { shape(p, [[-18, -150], [18, -150], [0, -126]], F(2)); txt(p, X.label, 0, -176, { size: 46, maxW: 700, weight: 800, color: C.ink }); } }
      else if (X) txt(p, X.label, 0, -190, { size: 56, maxW: 760, weight: 800, color: C.ink, wrap: 'mid' }); else star4(p, 0, 35, 40);
    }); });

  /* 13 ── THE MOBILE: a hanging mobile — a balanced bar with two small discs and the big call disc below it, like nodes passing it on */
  variant('mobile', 'โมบายแขวนสามจุด', (d, c) => { const X = st(d);
    art(c, p => { p.circle(0, -330, 9, F(2.2)); p.line(0, -320, 0, -250, W(2)); const bar = rot(p, -4, 0, -250); R(bar, -330, -256, 660, 12, 6, F(2.4)); bar.circle(0, -250, 8, F(2));
      [[-320, 1], [320, -1]].forEach(([x, sd]) => { const y0 = -250 - x * Math.tan(rad(-4)) * -1, yy = x < 0 ? -110 : -60; p.line(x, f1(y0), x, yy - 70, W(1.8)); ring(p, x, yy, 70, 56, F(3)); p.circle(x, yy, 56, F(1)); p.circle(x, yy, 30, S(1.4)); });
      p.line(0, -244, 0, -90, W(1.8)); ring(p, 0, 70, 160, 140, F(3.4)); p.circle(0, 70, 140, F(1)); p.circle(0, 70, 126, S(1.4));
      hero(p, c, X, 0, 34, 116, 124, { maxW: 190, size: 30, bigSize: 44, bigW: 220, rip: false });
    }); });

  /* 14 ── SHOWING IT WITH A SMILE: a person (front view, no face) holds the call sign in front with both arms; a smile badge is pinned on the sign */
  variant('holdsign', 'คนยิ้มถือป้าย', (d, c) => { const X = st(d), k = 1.28;
    art(c, p => { floorD(p);
      front(p, 0, 290, k, { [-1]: { s: [-36, -82], e: [-92, -40], h: [-124, -4] }, 1: { s: [36, -82], e: [92, -40], h: [124, -4] } });
      R(p, -230, -30, 460, 250, 16, F(3.4)); R(p, -210, -10, 420, 210, 8, S(1.4));
      [-1, 1].forEach(sd => R(p, sd * 206 - 18, 20, 36, 60, 14, F(2.6)));
      const bx = 196, by = -26; ring(p, bx, by, 44, 34, F(2.6)); p.circle(bx, by, 34, F(1)); put(p, c, { icon: 'smile' }, bx, by, 56, null, { r: 8 });
      hero(p, c, X, 0, 52, 120, 160, { maxW: 380, size: 40, bigSize: 52, bigW: 390, rip: false });
    }); });

  /* 15 ── POINTING AT THE BUTTON: a person (side view) points straight at a big call button on the wall; a dotted line marks the aim */
  variant('callbutton', 'คนชี้ไปที่ปุ่ม', (d, c) => { const X = st(d), px = -330, k = .96;
    art(c, p => { floorD(p);
      R(p, 40, -280, 380, 480, 34, F(3.4)); R(p, 62, -258, 336, 436, 24, S(1.4)); [[64, -256], [396, -256], [64, 176], [396, 176]].forEach(([x, y]) => screw(p, x, y, 4));
      const bx = 230, by = -84; ring(p, bx, by, 140, 118, F(3.2)); p.circle(bx, by, 118, F(1.4)); p.circle(bx, by, 104, S(1.4));
      person(p, px, 290, k, { s: [4, -76], e: [56, -96], h: [108, -108] }, { far: { s: [-4, -74], e: [8, -30], h: [16, 16] } });
      const [hx, hy] = pAt(px, 290, k, 124, -110); dots(p, [hx + 6, hy], [bx - 150, by + 24], 9);
      hero(p, c, X, bx, by - 22, 130, 128, { maxW: 320, size: 40, bigSize: 46, bigW: 220, rip: false });
    }); });

  /* 16 ── THE DESK BELL: a service bell on the counter rings (sound arcs) and the call pops up above it */
  variant('deskbell', 'กระดิ่งตั้งโต๊ะ', (d, c) => { const X = st(d);
    art(c, p => { R(p, -480, 230, 960, 24, 4, F(3)); p.line(-480, 254, -480, 340, S(2)); p.line(480, 254, 480, 340, S(2));
      ell(p, 0, 222, 190, 22, F(3)); R(p, -190, 196, 380, 26, 0, { fill: C.fill, sw: 0, stroke: 'none' }); p.line(-190, 196, -190, 222, W(3)); p.line(190, 196, 190, 222, W(3)); ell(p, 0, 196, 190, 22, F(3));
      p.path('M -150 192 C -150 70 -80 40 0 40 C 80 40 150 70 150 192 Z', F(3.4)); p.path('M -104 120 C -96 84 -60 66 -24 62', S(1.6));
      R(p, -9, 6, 18, 36, 4, F(2.2)); ell(p, 0, 4, 36, 10, F(2.6));
      [-1, 1].forEach(sd => arcs(p, sd * 210, 110, sd, 3, 30, 22, 40, W(2.4)));
      hero(p, c, X, 0, -196, 140, -48, { maxW: 760, size: 48, bigSize: 60, bigW: 600, halo: 104 });
    }); });

  /* 17 ── THE ROPE BARRIER: two stanchion posts with a sagging rope; the call sign hangs from the rope on two hooks */
  variant('stanchion', 'ป้ายห้อยราวกั้นเชือก', (d, c) => { const X = st(d);
    art(c, p => { floorD(p);
      [-1, 1].forEach(sd => { const x = sd * 360; ell(p, x, 280, 70, 12, F(2.8)); R(p, x - 12, -150, 24, 424, 8, F(2.6)); p.circle(x, -164, 20, F(2.6)); R(p, x - 18, -138, 36, 14, 4, F(2)); });
      tube(p, 'M -350 -122 Q 0 40 350 -122', 18);
      [-120, 120].forEach(x => p.path(`M ${x} ${x < 0 ? -36 : -36} q 0 -18 12 -18 q 12 0 12 14`, W(2.4)));
      R(p, -250, -20, 500, 250, 14, F(3.4)); R(p, -230, 0, 460, 210, 8, S(1.4));
      hero(p, c, X, 0, 70, 130, 186, { maxW: 400, size: 42, bigSize: 52, bigW: 410 });
    }); });

  /* 18 ── THE MARQUEE (the closing sign): a board ringed with bulbs on two posts, a crest on top; the call in the middle */
  variant('marquee', 'ป้ายไฟหลอดรอบกรอบ', (d, c) => { const X = st(d), x0 = -410, x1 = 410, y0 = -240, y1 = 120;
    art(c, p => { floorD(p); [-300, 300].forEach(x => { R(p, x - 14, y1, 28, 290 - y1, 4, F(2.6)); R(p, x - 40, 276, 80, 14, 6, F(2.2)); });
      p.path(`M -120 ${y0} Q -120 -320 0 -320 Q 120 -320 120 ${y0} Z`, F(3)); star4(p, 0, -278, 18, { fill: C.fill, sw: 2.2 });
      R(p, x0, y0, x1 - x0, y1 - y0, 26, F(3.6)); R(p, x0 + 50, y0 + 50, x1 - x0 - 100, y1 - y0 - 100, 10, S(1.4));
      const bulbs = []; for (let x = x0 + 30; x <= x1 - 30; x += 50) bulbs.push([x, y0 + 25], [x, y1 - 25]); for (let y = y0 + 75; y <= y1 - 75; y += 52) bulbs.push([x0 + 25, y], [x1 - 25, y]);
      bulbs.forEach(([x, y]) => { p.circle(x, y, 13, { fill: 'rgba(255,255,255,.18)', sw: 0, stroke: 'none' }); p.circle(x, y, 8, { fill: C.ink, sw: 1.4 }); });
      heroH(p, c, X, -190, -60, 130, -100, -42, { cx: 0, cy: -60, size: 52, maxW: 380, bigSize: 62, bigW: 600 });
    }); });

  /* 19 ── THE WELCOME: a person (side view) opens an arm toward a red-carpet runner that leads to the call on its easel */
  variant('welcome', 'คนยืนเชิญชวน', (d, c) => { const X = st(d), px = -360, k = .92;
    art(c, p => { floorD(p);
      shape(p, [[-300, 290], [480, 290], [400, 214], [-230, 214]], F(3)); shape(p, [[-268, 280], [450, 280], [384, 224], [-212, 224]], S(1.4));
      [[150, 290, 196, -260], [430, 290, 384, -260]].forEach(([a, b, e, f]) => p.line(a, b, e, f, W(5))); p.line(290, 30, 290, 260, S(3));
      R(p, 110, -270, 360, 300, 12, F(3.4)); R(p, 130, -250, 320, 260, 6, S(1.4)); R(p, 100, 30, 380, 20, 6, F(2.6));
      person(p, px, 290, k, { s: [4, -76], e: [50, -64], h: [100, -80] }, { lean: 3, far: { s: [-4, -74], e: [-6, -28], h: [0, 16] } });
      sparkAt(p, ...pAt(px, 290, k, 132, -86, 3), 14, 30, 0, 5, -60, [], true);
      hero(p, c, X, 290, -150, 130, -36, { maxW: 290, size: 40, bigSize: 48, bigW: 300 });
    }); });

  /* 20 ── WAVING GOODBYE: a person walks toward the exit door, turning to wave with one arm raised; the call is on the sign over the door */
  variant('goodbye', 'คนโบกมือลา', (d, c) => { const X = st(d), px = -150, k = .9;
    art(c, p => { floorD(p);
      R(p, 160, -60, 270, 350, 4, { fill: 'rgba(255,255,255,.07)', sw: 3.2 }); R(p, 140, -80, 310, 20, 4, F(2.6));
      shape(p, [[160, -60], [250, -30], [250, 300], [160, 290]], F(3)); p.circle(234, 120, 8, F(2));
      for (let i = 0; i < 3; i++) p.line(300 + i * 40, 270, 330 + i * 40, 30, { sw: 1.4, stroke: 'rgba(255,255,255,.18)' });
      R(p, 100, -310, 380, 190, 14, F(3.4)); R(p, 118, -292, 344, 154, 8, S(1.4)); [190, 390].forEach(x => p.line(x, -120, x, -80, W(2)));
      person(p, px, 290, k, { s: [4, -76], e: [-40, -124], h: [-58, -192] }, { leg: stride, far: { s: [-4, -74], e: [28, -36], h: [40, 10] } });
      const [hx, hy] = pAt(px, 290, k, -62, -204); waveArcs(p, hx - 24, hy, -1); waveArcs(p, hx + 24, hy, 1);
      heroH(p, c, X, 180, -215, 90, 240, -202, { cx: 290, cy: -215, size: 36, maxW: 210, bigSize: 42, bigW: 330 });
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
  ];

  G.cats = G.cats || {};
  G.cats.B15 = { variants: V, SAMPLES, STRESS, draw: (i, d, c) => { setZ(c); CUR = V[i].id; V[i].build(d || {}, c); }, CLAMPS, timing: c => (setZ(c), Object.assign({}, Z)) };
})();
