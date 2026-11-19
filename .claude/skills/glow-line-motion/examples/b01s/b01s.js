/* b01s.js — B01 ชุด 7 ขนาด (Friend 2026-11-19: "ก. ปรับให้ครบ 7 ขนาด (ลองทำ B01 แค่หมวดเดียวก่อน)" · "แต่เก็บของเก่าไว้ด้วยนะ").
   The B01T ideas (examples/b01t/b01t.js — kept untouched) laid out again to fill each of the 7 CutPack motion-graphic sizes
   (cutpack/style-rules/common.md 4.1): the parts are re-arranged for each shape, the old picture is never scaled / stretched as a whole.
   Look and motion = B01T (header + helpers copied from b01t.js; only the canvas size changed: CL() and the drop height use SZ).
   GL.cats.B01S.draw(i, data, { x, y, s, at, hit, size }) — size 1–7, canvas SZ.w × SZ.h px (the size at 100%) centred at (0,0).
   Data = CutPack B01, the same as B01T: value · unit · icon · dir · max · lines. */
(function () {
  const G = window.GL, C = G.C, NS = 'http://www.w3.org/2000/svg';
  const W = (w = 2) => ({ sw: w }), F = (w = 3.2) => ({ fill: C.fill, sw: w }), S = (w = 2) => ({ sw: w, stroke: C.soft });
  const rad = d => d * Math.PI / 180, f1 = v => +v.toFixed(1);
  let GLASS = 'rgba(255,255,255,.07)', LIT = 'rgba(255,255,255,.2)'; const SOLID = (w = 2) => ({ fill: C.ink, sw: w });

  /* TIMING (same system as b01–b11): the keyword c.hit never moves; M = 1/speed but at most hit / HIT0; tu / bH / aH; kf() keeps keys in order */
  const HIT0 = 1.5; let Z = null; let SZ = { w: 1000, h: 700, n: 0 }; const CLAMPS = {}; let CUR = '';
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
    cp.id = 'b01sclip' + (++CID); Object.entries({ x, y, width: w, height: h }).forEach(([k, v]) => r.setAttribute(k, v)); cp.appendChild(r);
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
  const CL = p => clipG(p, -SZ.w / 2, -SZ.h / 2, SZ.w, SZ.h);

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
  /* a tree standing at (x, y) (user 2026-11-14 "อยากให้ต้นไม้ดูเป็นต้นไม้มากกว่านี้" — the stick-and-ball looked like a lollipop):
     kind 'leaf' = a tapered trunk that forks into a lumpy crown (bumps round an ellipse, a few leaf-mass lines inside) · 'pine' = three
     stacked rounded tiers on a short trunk */
  function tree(q, x, y, k = 1, kind = 'leaf') { const P = (a, b) => f1(x + a * k) + ' ' + f1(y + b * k);
    if (kind === 'pine') { q.path(`M ${P(-7, 0)} L ${P(-5, -22)} L ${P(5, -22)} L ${P(7, 0)} Z`, F(2.4));
      [[-22, 34, 30], [-50, 28, 28], [-76, 20, 26]].forEach(([b, hw, h]) => q.path(`M ${P(-hw, b)} Q ${P(0, b + 6)} ${P(hw, b)} Q ${P(hw * .3, b - h * .5)} ${P(2, b - h)} Q ${P(0, b - h - 4)} ${P(-2, b - h)} Q ${P(-hw * .3, b - h * .5)} ${P(-hw, b)} Z`, F(2.6)));
      return; }
    q.path(`M ${P(-10, 0)} Q ${P(-6, -20)} ${P(-5, -40)} L ${P(-18, -58)} L ${P(-12, -62)} L ${P(-2, -48)} L ${P(4, -66)} L ${P(10, -62)} L ${P(5, -40)} Q ${P(6, -20)} ${P(10, 0)} Z`, F(2.4));
    const cx = 0, cy = -82, rx = 40, ry = 32, n = 8, pts = Array.from({ length: n }, (_, i) => { const a = -Math.PI / 2 + i * 2 * Math.PI / n + (i % 2 ? .12 : 0); return [cx + rx * Math.cos(a), cy + ry * Math.sin(a)]; });
    let d = `M ${P(...pts[0])}`; for (let i = 0; i < n; i++) { const a = pts[i], b = pts[(i + 1) % n], m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], o = [(m[0] - cx) * 1.42, (m[1] - cy) * 1.42]; d += ` Q ${P(cx + o[0], cy + o[1])} ${P(...b)}`; }
    q.path(d + ' Z', F(2.8)); q.path(`M ${P(-20, -70)} Q ${P(-12, -60)} ${P(-2, -64)}`, S(1.4)); q.path(`M ${P(6, -96)} Q ${P(16, -88)} ${P(24, -92)}`, S(1.4)); }
  const arrowR = (q, x, y, a = 0, k = 1) => { const g = rot(q, a, x, y); g.path(`M ${x - 34 * k} ${y} L ${x + 22 * k} ${y} M ${x + 4 * k} ${y - 20 * k} L ${x + 26 * k} ${y} L ${x + 4 * k} ${y + 20 * k}`, W(5)); };

  /* ---------- motion (user 2026-11-14 "ทำเคลื่อนไหวได้ ช่วงนี้ … ทำเคลื่อนไหวได้ไม่ค่อยว้าว … อยากให้ลองกลับไปดูหมวดแรกๆ 1-5 ผมชอบ
     อนิเมชั่นมากเลย"): the B01–B05 way — the data itself travels through the mechanism (falls, flips, flies along an arc), every landing
     squashes and the scene answers (dust, ripples, a wobble, windows lighting in a wave), many small beats instead of one pop, the spots
     arrive one by one, the place arrives last and lands on the keyword H. Last frame = the approved still. ---------- */
  /* a fall onto (px, py) (the bottom / tip of the part): stretched while falling, squashed on landing, one small bounce */
  const fallK = (px, py, t0, t1, h = 320) => ({ px, py, y: [[0, -h], [t0, -h], [t1, 0, 'in'], [f3(t1 + tu(.09)), f1(-h * .06), 'out'], [f3(t1 + tu(.18)), 0, 'in']],
    sy: [[0, 1], [t0, 1.1], [f3(t1 - tu(.02)), 1.1], [t1, .8, 'out'], [f3(t1 + tu(.09)), 1.05, 'out'], [f3(t1 + tu(.18)), .97], [f3(t1 + tu(.26)), 1, 'soft']],
    sx: [[0, 1], [t0, .93], [f3(t1 - tu(.02)), .93], [t1, 1.14, 'out'], [f3(t1 + tu(.09)), .98, 'out'], [f3(t1 + tu(.26)), 1, 'soft']], o: fadeIn(t0, .04) });
  /* grows up from its base (px, py) with an overshoot */
  const upK = (px, py, t, d = .3) => ({ px, py, sy: [[0, 0], [t, 0], [f3(t + tu(d)), 1.08, 'out'], [f3(t + tu(d + .1)), .97, 'io'], [f3(t + tu(d + .18)), 1, 'soft']], o: fadeIn(t, .04) });
  /* spins in edge-on (a coin / a sign turning to face us) */
  const spinK = (px, py, t) => ({ px, py, sx: [[0, 0], [t, 0], [f3(t + tu(.12)), -.6], [f3(t + tu(.24)), 1.08, 'out'], [f3(t + tu(.34)), 1, 'soft']], o: fadeIn(t, .04) });
  /* dust kicked up left and right where something lands */
  const dust = (q, x, y, t, k = 1) => sparkAt(q, x, y, 16 * k, 36 * k, t, 8, 22.5, [1, 2, 5, 6], false);
  /* a flat ring that spreads over the ground at t and fades */
  const rippleE = (q, x, y, rx, ry, t) => { const g = sub(q); on(g, q, 0, { ox: x, oy: y, s: [[0, .4], [t, .4], [f3(t + tu(.5)), 1.5, 'out']], o: [[0, 0], [t, 0], [f3(t + tu(.04)), .8], [f3(t + tu(.5)), 0]] }); ell(g, x, y, rx, ry, W(2.4)); };
  /* a lit flash that comes and goes (windows in a wave) */
  const flashK = (t, hold = .3) => [[0, 0], [t, 0], [f3(t + tu(.04)), .9], [f3(t + tu(hold)), .9], [f3(t + tu(hold + .2)), 0]];
  /* a spot that flies in along an arc from `from` and lands at (x, y) at t1 (a bump, its label after); no `from` → it drops in from above */
  function spotFly(q, c, S, x, y, t0, t1, o = {}) { if (!S) return; const fr = o.from || [x, y - 260], mid = [(fr[0] + x) / 2, Math.min(fr[1], y) - (o.arc ?? 120)], K = pathK([fr, mid, [x, y]], t0, t1, [x, y]);
    const mv = { px: x, py: y, x: K.x, y: K.y }, gO = mvG(o.clip ? CL(q) : q, Object.assign({ o: fadeIn(t0, .04) }, mv)), g = mvG(gO, { px: x, py: y, s: bumpK(t1, 1.16) }), r = o.r || 40, sd = o.side ?? 1;
    if (!picOf(S)) { const w = o.w || 210; R(g, x - w / 2, y - 26, w, 52, 26, F(3.2)); DOT(g, x - w / 2 + 24, y, 6); txt(g, S.label, x + 10, y + 9, { size: 24, maxW: w - 60, weight: 700, color: C.ink }); return; }
    g.circle(x, y, r, F(3.2)); put(q, c, { icon: S.icon }, x, y, r * 1.3, null, { t: t0, mv, punch: t1 });
    if (S.label) txt(atG(q, f3(t1 + tu(.08))), S.label, sd ? x + sd * (r + 14) : x, sd ? y + 9 : y + r + 34, { size: o.size || 26, maxW: o.maxW || 180, weight: 700, color: C.ink, anchor: sd > 0 ? 'start' : sd < 0 ? 'end' : 'middle' }); }
  /* the place lands: its icon arrives (o.mv = the keys of the part it rides, o.tI = when it shows) and punches on H, its name follows;
     no icon → its name pops big at H; nothing → a lit star */
  function landPlace(q, c, X, x, y, w, ly, o = {}) { const H = Z.H, tI = o.tI ?? f3(H - tu(.06));
    if (o.rip !== false) ripple(q, x, y, o.rip || w * .62, f3(H - tu(.02)));
    if (!X) { star4(popAt(q, x, y, H), x, y, w * .3); return; }
    if (!picOf(X)) { const by = y + (o.bigDy ?? 22); txt(popAt(q, o.cx ?? x, by - 20, f3(H - tu(.06))), X.label, o.cx ?? x, by, { size: o.bigSize || 52, maxW: o.bigW || 420, weight: 800, color: C.ink, wrap: 'mid' }); return; }
    put(q, c, { icon: X.icon }, x, y, w, null, { t: tI, mv: o.mv, punch: H });
    if (X.label) txt(atG(q, f3(H + tu(.06))), X.label, o.lx ?? x, o.ly ?? ly, { size: o.size || 44, maxW: o.maxW || 380, weight: 800, color: C.ink, wrap: o.anchor === 'start' ? 'mid' : 'down', anchor: o.anchor || 'middle' }); }
  const tF = (Q, i) => f3(Q.T0 + tu(.08 + .14 * i)), tL = (Q, i) => f3(Q.T0 + tu(.38 + .14 * i)), tP0 = Q => f3(Q.H - tu(.4)), tP1 = Q => f3(Q.H - tu(.04));


  /* ---------- placeholders (what an empty slot looks like) ---------- */
  let PH = { fill: 'rgba(255,255,255,.05)', sw: 2, stroke: C.soft };
  const phC = (q, x, y, r) => { q.circle(x, y, r, PH); q.line(x - r * .3, y, x + r * .3, y, S(2.4)); q.line(x, y - r * .3, x, y + r * .3, S(2.4)); };
  const phBar = (q, x, y, w, h = 26, anchor = 'middle') => { const x0 = anchor === 'start' ? x : x - w / 2; R(q, x0, y - h / 2, w, h, h / 2, PH); };
  let EMPTY = false; /* placeholders only when the template is shown empty (d.empty) — a real line with a slot left out just leaves it out */
  const TX = d => d && d.title && String(d.title).trim() ? String(d.title).trim() : null;
  const SB = d => d && d.sub && String(d.sub).trim() ? String(d.sub).trim() : null;
  const MN = d => d && has(d.main) ? d.main : null;
  const IT = d => (d && Array.isArray(d.items) ? d.items.filter(has) : []).slice(0, 3);
  /* one slot: icon + its word under it · word only → the word big · nothing → placeholders (circle + bar) */
  function slot(q, c, X, x, y, w, ly, o = {}) { const t = o.t ?? f3(Z.H - tu(.06));
    if (!X) { if (EMPTY) { phC(atG(q, t), x, y, w * .55); phBar(atG(q, t), x, ly - 10, w * 1.3); } return; }
    if (!picOf(X)) { txt(popAt(q, x, y, t), X.label, x, y + (o.bigDy ?? 16), { size: o.bigSize || 52, maxW: o.bigW || w * 2, weight: 800, color: C.ink, wrap: 'mid' }); return; }
    put(q, c, { icon: X.icon }, x, y, w, null, { t, punch: f3(t + tu(.14)) });
    if (X.label) txt(atG(q, f3(t + tu(.1))), X.label, x, ly, { size: o.size || 36, maxW: o.maxW || w * 2.2, weight: 700, color: C.ink, wrap: 'down' }); }
  const words = (q, s, x, y, o = {}) => { const t = o.t ?? Z.H; if (!s) { if (EMPTY) phBar(atG(q, t), x, y - (o.size || 40) * .35, o.phW || 300, o.phH || 30, o.anchor); return; }
    txt(atG(q, t), s, x, y, { size: o.size || 40, maxW: o.maxW || 500, weight: o.weight || 800, color: o.color || C.ink, anchor: o.anchor || 'middle', wrap: o.wrap === undefined ? 'down' : o.wrap }); };

  /* ---------- v2 (user 2026-11-14: "บางทีก็อยากให้ไอคอนกับข้อความไม่ต้องผูกติดกันก็ได้ … คุณชอบเอาข้อความไปไว้ข้างใต้ icon เสมอเลย"):
     icons and words are separate slots with their own places — an icon slot never carries a word; when one kind is missing the other
     takes the room. Data: icons [icon names] 0–3 · title (words) · sub (words). ---------- */
  const ICS = d => (d && Array.isArray(d.icons) ? d.icons.filter(n => G.icons[n] || G.icons[n + '-pro']) : []).slice(0, 3);
  /* an icon slot: the icon alone (no word) · empty demo → a placeholder circle */
  const icon = (q, c, n, x, y, w, t) => { t = t ?? f3(Z.H - tu(.06)); if (n) put(q, c, { icon: n }, x, y, w, null, { t, punch: f3(t + tu(.14)) }); else if (EMPTY) phC(atG(q, t), x, y, w * .5); };


  /* ---------- CARD PARTS (user's past template examples, references/templates-ref/, redrawn in our line style): a rounded card, a chip
     title (dot + word), icon boxes apart from words, word pills, list rows, soft bars standing for lines of text, a corner badge,
     emphasis by one big bright word. Icons and words never ride together. ---------- */
  /* the light-blue look (user 2026-11-14 "ลองทำเป็นสีฟ้าอ่อนเหมือนใน reference ให้หน่อย"): GL.cats.CARD.blue = true → thin soft blue-grey edges on
     dark navy cards, and one light-blue accent for what matters (the chip dot, the key word, the lit arc, the tall bar, ticks, the people's
     rings, the button). The sheet sets the navy background and palette; the white look stays the default. */
  let BLUE = false; const ACC = () => BLUE ? '#86ccff' : C.ink, EDGE = (w = 4.4) => BLUE ? { fill: C.fill, sw: 2.4, stroke: '#41566c' } : F(w);
  const DOTA = (q, x, y, r = 7) => q.circle(x, y, r, BLUE ? { fill: ACC(), sw: 0, stroke: 'none' } : SOLID(1));
  const CHK = (q, x, y, k = 1) => q.path(`M ${f1(x - 18 * k)} ${y} L ${f1(x - 5 * k)} ${f1(y + 14 * k)} L ${f1(x + 20 * k)} ${f1(y - 14 * k)}`, BLUE ? { sw: 5, stroke: ACC() } : W(5));
  const XX = (q, x, y, k = 1) => { q.line(x - 15 * k, y - 15 * k, x + 15 * k, y + 15 * k, W(5)); q.line(x - 15 * k, y + 15 * k, x + 15 * k, y - 15 * k, W(5)); };
  /* the card itself: drops in and settles (squash) */
  const cardG = (p, w = 880, h = 560, y0 = 0) => { const g = mvG(CL(p), fallK(0, y0 + h / 2, tu(.04), tu(.24), 220)); R(g, -w / 2, y0 - h / 2, w, h, 40, EDGE(4.4)); return g; };
  /* a chip: a pill with a dot and a word (left edge at x); empty demo → a placeholder pill */
  function chip(q, s, x, y, o = {}) { const t = o.t ?? tu(.3), g = mvG(q, { x: glide(-60, t, f3(t + tu(.24))), o: fadeIn(t) }), sz = o.size || 36;
    if (!s) { if (EMPTY) { R(g, x, y - 30, 200, 60, 30, EDGE(3)); DOTA(g, x + 30, y, 7); phBar(g, x + 110, y, 100, 18); } return 0; }
    const tm = txt(g, s, 0, -999, { size: sz, weight: 700, anchor: 'start', maxW: o.maxW || 520 }), w = Math.min(o.maxW || 520, tm.getBBox().width); tm.remove();
    R(g, x, y - 30, w + 84, 60, 30, EDGE(3)); DOTA(g, x + 30, y, 7); txt(g, s, x + 54, y + sz * .34, { size: sz, weight: 700, color: C.ink, anchor: 'start', maxW: o.maxW || 520 }); return w + 84; }
  /* words with one emphasised word: the plain part soft, the key word big and bright after it; strike = a line through (crossed out) */
  function says(q, plain, em, x, y, o = {}) { const sz = o.size || 40, tE = o.tE ?? Z.H; let w0 = 0;
    if (plain) { const a = txt(atG(q, o.t ?? tE), plain, x, y, { size: sz, weight: 600, color: o.dim ? C.mute : C.soft, anchor: 'start', maxW: o.maxW || 520 }); w0 = a.getBBox().width + 12; }
    if (em) { const g = popAt(q, x + w0 + 40, y - sz * .3, tE), b = txt(g, em, x + w0, y + 4, { size: sz * 1.35, weight: 800, color: o.dim ? C.mute : ACC(), anchor: 'start', maxW: (o.maxW || 520) - w0 }); w0 += b.getBBox().width; }
    if (o.strike) drawAt(q.line(x - 6, y - sz * .3, x + w0 + 6, y - sz * .3, W(4)), q, f3((o.t ?? tE) + tu(.14)), tu(.2));
    return w0; }
  const ROWS = d => (d && Array.isArray(d.rows) ? d.rows : []).slice(0, 3);


  /* ---------- B05 data + small parts ---------- */
  const WR = d => d && has(d.wrong) ? d.wrong : null, RT = d => d && has(d.right) ? d.right : null;
  const TT = Q => { const tN = f3(Math.max(tu(.7), Q.H - tu(1.0))); return { H: Q.H, tN, tR: f3(tN + tu(.3)) }; };
  const dimK = t => [[0, 1], [t, 1], [f3(t + tu(.2)), .38]];
  const dimG = (q, t) => mvG(q, { o: dimK(t) });
  const BK = { fill: C.fill, sw: 0, stroke: 'none' };   /* solid backing drawn under a part that dims (the duo() lesson) */
  /* a ✓ / ✗ badge that pops at t */
  const mark = (q, kind, x, y, r, t) => { const g = popAt(q, x, y, t); g.circle(x, y, r, F(3)); (kind === 'x' ? XX : CHK)(g, x, y, r / 34); return g; };
  /* an icon box (rounded square) — the thing's icon; no icon → its word fits in the box; nothing → a dot. o.dim = dims at that time */
  function ibox(q, c, X, x, y, s, t, o = {}) { const g0 = o.g || popAt(q, x, y, t); if (o.dim) R(g0, x - s / 2, y - s / 2, s, s, s * .24, BK); const g = o.dim ? dimG(g0, o.dim) : g0; R(g, x - s / 2, y - s / 2, s, s, s * .24, F(4));
    if (X && picOf(X)) put(q, c, { icon: X.icon }, x, y, s * .56, null, { t: f3(t + tu(.04)), mv: o.mv, o: o.dim ? dimK(o.dim) : undefined, punch: o.punch });
    else if (X && X.label) txt(g, X.label, x, y + s * .06, { size: s * .17, maxW: s * .84, weight: 800, color: C.ink, wrap: 'mid' }); else DOT(g, x, y, 8); return g; }
  /* a word pill centred at (x, y) sized to its words; o.dim = dims · o.strike = a line through it at that time */
  function pill(q, s, x, y, o = {}) { if (!s) return 0; const t = o.t ?? tu(.3), sz = o.size || 34, g0 = o.g || popAt(q, x, y, t), g = o.dim ? dimG(g0, o.dim) : g0;
    const tm = txt(g, s, x, y + sz * .34, { size: sz, weight: 800, color: C.ink, maxW: o.maxW || 360 }), w = Math.min(o.maxW || 360, tm.getBBox().width); R(g, x - w / 2 - 30, y - sz * .95, w + 60, sz * 1.9, sz * .95, o.lit ? { fill: LIT, sw: 3.4 } : F(3.2)); g.g.appendChild(tm);
    if (o.dim) g0.g.insertBefore(R(g0, x - w / 2 - 30, y - sz * .95, w + 60, sz * 1.9, sz * .95, BK), g0.g.firstChild);
    if (o.strike) drawAt(q.line(x - w / 2 - 12, y, x + w / 2 + 12, y, W(4)), q, o.strike, tu(.2)); return w + 60; }
  const LBL = X => X && X.label && picOf(X) ? X.label : null;   /* a separate word only when the icon is there (no icon → the word is in the box) */
  const slash = (q, x0, y0, x1, y1, t) => drawAt(q.line(x0, y0, x1, y1, W(6)), q, t, tu(.2));

  /* ================= B01T — ตัวเลขเด่น (Key Number) as a template ชุดฐาน =================
     CutPack B01: value (the spoken string, kept exactly) · unit · icon · dir up/down. Graphic elements only (icon boxes, pills, rings, bars,
     dots, segments, tiles, sliders, a stepper, lines) — no real-world objects. The icon sits in its own box, never with a word under it.
     The number counts up and locks on the keyword H (exactly the spoken string), punches, a ripple; the unit follows. A missing slot is
     simply not drawn (no icon → the number takes the room). Fill amounts are real only for %; otherwise dir picks high / low (never a fake
     "full" pointer). No other numbers on screen. */
  const clamp01 = v => Math.max(0, Math.min(1, v)), eOut = q => 1 - Math.pow(1 - q, 3);
  const VAL = d => d && d.value != null && String(d.value).trim() ? String(d.value).trim() : null;
  const UN = d => d && d.unit && String(d.unit).trim() ? String(d.unit).trim() : null;
  const ICN = d => d && d.icon && (G.icons[d.icon] || G.icons[d.icon + '-pro']) ? d.icon : null;
  const DIRV = d => d && (d.dir === 'up' || d.dir === 'down') ? d.dir : null;
  const numOf = d => parseFloat(String(VAL(d) || '').replace(/,/g, ''));
  const pctV = d => /%\s*$/.test(VAL(d) || '') ? clamp01(numOf(d) / 100) : null;
  const zeroV = d => numOf(d) === 0;
  /* the real share of the whole: a % value, or value ÷ max when the speaker gives the whole (user 2026-11-14 "เพิ่มช่องค่าเต็มให้ด้วยครับ":
     data.max = the full amount as spoken, e.g. value '6', max '8' for "นอน 6 จาก 8 ชั่วโมง"); otherwise null → dir decides */
  const maxOf = d => d && d.max != null && String(d.max).trim() ? parseFloat(String(d.max).replace(/,/g, '')) : NaN;
  const ratioV = d => { const p = pctV(d); if (p != null) return p; const m = maxOf(d), n = numOf(d); return m > 0 && isFinite(n) ? clamp01(n / m) : null; };
  const frac = d => zeroV(d) ? 0 : ratioV(d) ?? (d.dir === 'up' ? .82 : d.dir === 'down' ? .28 : 1);
  const posV = d => zeroV(d) ? 0 : ratioV(d) ?? (d.dir === 'up' ? .78 : d.dir === 'down' ? .26 : .62);
  /* the spoken value at fraction q with the same format (commas, decimals, % kept); q = 1 → exactly the spoken string */
  function fmtVal(str, q) { const m = String(str).match(/^([^\d]*)([\d,]*\.?\d*)(.*)$/); if (!m || q >= 1 || !m[2]) return str;
    const [, pre, nm, post] = m, n = parseFloat(nm.replace(/,/g, '')), dec = (nm.split('.')[1] || '').length; let s = (n * q).toFixed(dec);
    if (nm.includes(',')) { const [i, f] = s.split('.'); s = i.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (f ? '.' + f : ''); } return pre + s + post; }
  const tw = (q, s, size, weight = 800) => { const m = q.text(s, 0, -9999, { size, weight, anchor: 'start', dur: .01 }), w = m.getBBox().width; m.remove(); return w; };
  /* the number: pops in at t0, counts to the spoken string on H (o.t1), punches there. Returns its box. */
  function num(p, q, v, x, y, o = {}) { if (!v) return null; const t0 = o.t0 ?? tu(.3), t1 = o.t1 ?? Z.H, anchor = o.anchor || 'middle';
    let size = o.size || 160; const w0 = tw(q, v, size); if (o.maxW && w0 > o.maxW) size *= o.maxW / w0; const w = Math.min(w0, o.maxW || 1e9);
    const cx = anchor === 'start' ? x + w / 2 : anchor === 'end' ? x - w / 2 : x, cy = y - size * .36;
    const g = o.still ? o.g || q : popAt(mvG(o.g || q, { px: cx, py: cy, s: bumpK(t1, o.punch ?? 1.12) }), cx, cy, t0);
    const e = g.text(v, x, y, { size: f1(size), weight: 800, anchor, color: o.color || ACC1, dur: .01 });
    HOOKS.push(t => { const u = rel(p, t); e.textContent = u >= t1 ? v : fmtVal(v, eOut(clamp01((u - t0) / Math.max(.01, t1 - t0)))); });
    return { w, size, cx, cy, x0: cx - w / 2, x1: cx + w / 2, e }; }
  /* number + unit on one baseline (unit smaller, soft, comes in just after H), shrunk together to maxW */
  function numRow(p, q, v, u, x, y, o = {}) { if (!v) return null; const s0 = o.size || 160, us0 = o.us || Math.max(40, s0 * .3), gap0 = s0 * .1;
    const nw0 = tw(q, v, s0), uw0 = u ? tw(q, u, us0, 600) : 0, k = Math.min(1, (o.maxW || 800) / (nw0 + (u ? gap0 + uw0 : 0)));
    const size = s0 * k, us = Math.max(Math.min(us0, 30), us0 * k), uw = uw0 * us / us0, tot = nw0 * k + (u ? gap0 * k + uw : 0), an = o.anchor || 'middle';
    const x0 = an === 'middle' ? x - tot / 2 : an === 'end' ? x - tot : x, n = num(p, q, v, x0, y, { size, anchor: 'start', t0: o.t0, t1: o.t1, g: o.g, punch: o.punch });
    if (u) { const ug = o.g ? sub(o.g) : sub(q); on(ug, q, 0, { x: [[0, -24], [f3(Z.H + tu(.04)), -24], [f3(Z.H + tu(.24)), 0, 'out']], o: fadeIn(f3(Z.H + tu(.04))) });
      ug.text(u, f1(x0 + nw0 * k + gap0 * k), y, { size: f1(us), weight: 600, anchor: 'start', color: C.soft, dur: .01 }); }
    return { x0, x1: x0 + tot, cx: x0 + tot / 2, cy: n.cy, size, nw: nw0 * k }; }
  const rowW = (q, v, u, s0, maxW) => { const us0 = Math.max(40, s0 * .3), nw0 = tw(q, v, s0), uw0 = u ? tw(q, u, us0, 600) : 0, k = Math.min(1, maxW / (nw0 + (u ? s0 * .1 + uw0 : 0))), us = Math.max(Math.min(us0, 30), us0 * k);
    return nw0 * k + (u ? s0 * .1 * k + uw0 * us / us0 : 0); };
  /* an icon box that drops in from just above the canvas edge, squashes on landing, kicks dust (the icon rides along) */
  function dropBox(p, c, ic, x, y, s, t0, t1, o = {}) { if (!ic) return null; const by = y + s / 2, K = fallK(x, by, t0, t1, o.h ?? Math.max(120, by + SZ.h / 2));
    const g = mvG(CL(p), K); ibox(p, c, { icon: ic }, x, y, s, t0, { g, mv: K, punch: o.punch }); if (o.dust !== false) dust(p, x, by, t1, s / 220); return g; }
  /* an icon box that spins in edge-on */
  function spinBox(p, c, ic, x, y, s, t) { if (!ic) return null; const K = spinK(x, y, t), g = mvG(p, K); ibox(p, c, { icon: ic }, x, y, s, t, { g, mv: K, punch: f3(t + tu(.3)) }); return g; }
  /* a round badge with an up / down arrow (dir) */
  function dirB(q, dr, x, y, t, r = 36) { if (!dr) return; const g = popAt(q, x, y, t), s = dr === 'up' ? 1 : -1; g.circle(x, y, r, F(3));
    const a = mvG(g, { y: [[0, 0], [f3(t + tu(.3)), 0], [f3(t + tu(.4)), -s * 7, 'out'], [f3(t + tu(.55)), 0, 'soft']] }), k = r / 36;
    a.path(`M ${x} ${f1(y + s * 17 * k)} L ${x} ${f1(y - s * 17 * k)} M ${f1(x - 13 * k)} ${f1(y - s * 4 * k)} L ${x} ${f1(y - s * 18 * k)} L ${f1(x + 13 * k)} ${f1(y - s * 4 * k)}`, W(4.4)); }
  /* an arc path from the top of a circle, clockwise, through a fraction fr of the turn */
  const arcD = (x, y, r, fr) => { if (fr >= .999) return `M ${x} ${y - r} A ${r} ${r} 0 1 1 ${f1(x - .1)} ${y - r}`; const a = rad(-90 + 360 * fr);
    return `M ${x} ${y - r} A ${r} ${r} 0 ${fr > .5 ? 1 : 0} 1 ${f1(x + r * Math.cos(a))} ${f1(y + r * Math.sin(a))}`; };
  /* something that fills from t0 to t1: draw keys and the matching turn of a dot riding its end */
  const fillK = (t0, t1) => [[0, 0], [t0, 0], [t1, 1, 'io']];
  const ridK = (deg, t0, t1) => [[0, -deg], [t0, -deg], [t1, 0, 'io']];
  const litOn = (q, t) => { const g = sub(q); on(g, q, 0, { o: [[0, 0], [t, 0], [f3(t + tu(.04)), 1]] }); return g; };
  /* words in place of the grey bars (user 2026-11-14 "ถ้าไม่มีข้อความส่งมา ให้แสดงขีดเทาเหมือนเดิม … แก้ทุกอันเลย"): data.lines = [strings], used in order by the
     designs with grey bars (card · list · icon chip · notice); a missing line keeps its grey bar */
  const LN = (d, k) => d && Array.isArray(d.lines) && d.lines[k] != null && String(d.lines[k]).trim() ? String(d.lines[k]).trim() : null;
  const lineIn = (q, s, x, y, w, t, size = 40) => { const g = mvG(q, { x: glide(-30, t, f3(t + tu(.22))), o: fadeIn(t, .05) }); txt(g, s, x, y + size * .34, { size, maxW: w, weight: 700, anchor: 'start', color: C.ink }); };
  let FILL = { fill: LIT, sw: 0, stroke: 'none' }, SOFTT = { sw: 14, stroke: 'rgba(255,255,255,.16)' };

  /* ---------- colour theme (user 2026-11-14: "ทำให้มันเปลี่ยนสีได้"): every colour comes from GL.C (line = ink, card fill, soft lines) plus one
     accent for what lights up (the number, filled amounts, lit dots / segments / ticks, the underline). Tints are made from those, never a fixed
     white. GL.theme({ bg, line, fill, soft, accent }) (engine, all categories) or GL.cats.B01T.theme(...) — the same; theme() = back to the
     default white look. Missing keys keep the default. Lines glow, so a dark background reads best. ---------- */
  const hexRgb = h => { h = String(h).trim().replace('#', ''); if (h.length === 3) h = h.split('').map(x => x + x).join(''); const n = parseInt(h, 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
  const rgba = (h, a) => /^#[0-9a-f]{3,6}$/i.test(String(h).trim()) ? `rgba(${hexRgb(h).join(',')},${a})` : h;
  let ACC1 = C.ink, THEME = null;
  const TL_ = a => rgba(C.ink, a), TA = a => rgba(ACC1, a);
  function tokens() { THEME = G.themeNow; ACC1 = THEME && THEME.accent || C.ink; LIT = TA(.22); GLASS = TL_(.07); PH = { fill: TL_(.05), sw: 2, stroke: C.soft };
    FILL = { fill: TA(.24), sw: 0, stroke: 'none' }; SOFTT = { sw: 14, stroke: TL_(.16) }; }
  function theme(t) { const r = G.theme(t); tokens(); return r; }

  /* ================= B01S — ตัวเลขเด่น ชุด 7 ขนาด =================
     The 7 sizes (cutpack/style-rules/common.md 4.1, px at 100%). Each idea has its own arrangement per size: the same parts (icon box,
     number, unit, ring, bar, dial, card, lines, dir badge) and the same moves as B01T, placed again to fill that shape. Part sizes start
     from the B01T picture sitting in size 5 (≈ .86 of the 1000-unit canvas); a short / narrow size uses smaller parts, never below the
     skill's minimum (words ≥ 34 · icon boxes ≥ 90 · the number stays the biggest thing). Coordinates: canvas centred at (0, 0). */
  const SIZES = { 1: { w: 860, h: 230, th: 'แถบแบนยาว' }, 2: { w: 860, h: 470, th: 'กว้าง' }, 3: { w: 560, h: 490, th: 'เกือบจัตุรัส' }, 4: { w: 400, h: 635, th: 'ตั้งแคบ' },
    5: { w: 860, h: 710, th: 'เต็มจอ ทรงนอน' }, 6: { w: 860, h: 965, th: 'เต็มจอ ทรงตั้ง' }, 7: { w: 400, h: 500, th: 'ตั้งแคบ สั้น' } };
  const PAD = 24;
  /* the unit on its own line under the number (narrow / tall sizes): comes in just after H, like numRow's unit */
  function unitL(q, u, x, y, size, o = {}) { if (!u) return; const g = sub(q); on(g, q, 0, { y: [[0, 22], [f3(Z.H + tu(.04)), 22], [f3(Z.H + tu(.24)), 0, 'out']], o: fadeIn(f3(Z.H + tu(.04))) });
    txt(g, u, x, y, { size, weight: 600, color: C.soft, anchor: o.anchor || 'middle', maxW: o.maxW || SZ.w - 2 * PAD }); }
  /* the number + its unit: inline (numRow) or stacked (number, then the unit line under it). base = the number's baseline. */
  function numB(p, v, u, x, base, ns, o = {}) { if (!v) return null;
    if (!o.stack || !u) return numRow(p, p, v, u, x, base, { size: ns, maxW: o.maxW, anchor: o.anchor || 'middle', t0: o.t0 ?? tu(.32) });
    const n = num(p, p, v, x, base, { size: ns, maxW: o.maxW, anchor: o.anchor || 'middle', t0: o.t0 ?? tu(.32) }), us = o.us || Math.max(36, ns * .3);
    unitL(p, u, o.anchor === 'start' ? n.x0 : n.cx, f1(base + ugOf(ns, us, o.tight)), us, { anchor: o.anchor, maxW: o.maxW });
    return Object.assign({ nw: n.w }, n); }
  /* the height a number block takes from its top to its lowest line (for centring): digits ≈ .74 of the size */
  const ugOf = (ns, us, tight) => f1(tight ? ns * .06 + us * 1.15 : ns * .2 + us * 1.15);   /* number baseline → unit baseline (room for the underline between) */
  const numH = (ns, u, stack, us, tight) => .78 * ns + (stack && u ? ugOf(ns, us, tight) + us * .25 : 0);
  const usOf = ns => Math.max(36, ns * .3);

  /* 01 ── ICON + NUMBER (ไอคอนข้างตัวเลข) — row (box left, number right) in the flat sizes; column (box on top, number under) in the others */
  variant('stat', 'ไอคอนข้างตัวเลข', (d, c) => { const v = VAL(d), u = UN(d), ic = ICN(d), H = Z.H, W2 = SZ.w / 2, H2 = SZ.h / 2;
    const T = { 1: { m: 'row', bs: 168, ns: 150 }, 2: { m: 'row', bs: 240, ns: 220 }, 3: { m: 'col', bs: 160, ns: 150, st: true }, 4: { m: 'col', bs: 180, ns: 170, st: true },
      5: { m: 'col', bs: 250, ns: 230 }, 6: { m: 'col', bs: 300, ns: 300, st: true }, 7: { m: 'col', bs: 150, ns: 140, st: true } }[SZ.n];
    art(c, p => { let n;
      if (T.m === 'row') { const gap = T.bs * .2, mw = SZ.w - 2 * PAD - (ic ? T.bs + gap : 0), rw = ic && v ? rowW(p, v, u, T.ns, mw) : 0, L = -(T.bs + gap + rw) / 2;
        dropBox(p, c, ic, L + T.bs / 2, 0, T.bs, tu(.04), tu(.28));
        n = numRow(p, p, v, u, ic ? L + T.bs + gap : 0, f1(T.ns * .35), { size: T.ns, maxW: mw, anchor: ic ? 'start' : 'middle', t0: tu(.32) });
        if (n) { const uy = Math.min(H2 - 8, T.ns * .35 + T.ns * .26); drawAt(p.line(n.x0, uy, n.x1, uy, S(2.4)), p, tu(.34), tu(.3)); ripple(p, n.x0 + n.nw / 2, n.cy, T.ns * .65, H);
          dirB(p, DIRV(d), Math.min(W2 - 40, n.x1 + 24), Math.max(-H2 + 36, -T.bs / 2 - 10), f3(H + tu(.1)), T.bs < 200 ? 30 : 36); }
      } else { const ns = ic ? T.ns : T.ns * 1.25, us = usOf(ns), g1 = T.bs * .2, nh = numH(ns, u, T.st, us) + ns * .26, tot = (ic ? T.bs + g1 : 0) + nh, top = -tot / 2;
        const by = top + T.bs / 2, base = f1((ic ? top + T.bs + g1 : top) + .78 * ns);
        dropBox(p, c, ic, 0, by, T.bs, tu(.04), tu(.28));
        n = numB(p, v, u, 0, base, ns, { stack: T.st, maxW: SZ.w - 2 * PAD, us });
        if (n) { const uy = f1(base + ns * .2); if (!(T.st && u)) drawAt(p.line(n.x0, uy, n.x1, uy, S(2.4)), p, tu(.34), tu(.3)); else drawAt(p.line(n.cx - 70, uy, n.cx + 70, uy, S(2.4)), p, tu(.34), tu(.3));
          ripple(p, n.cx, n.cy, ns * .62, H);
          if (ic) dirB(p, DIRV(d), Math.min(W2 - 36, T.bs / 2 + 46), by - T.bs / 2 + 30, f3(H + tu(.1)), T.bs < 200 ? 30 : 36);
          else dirB(p, DIRV(d), Math.min(W2 - 36, n.x1 + 30), base - .74 * ns, f3(H + tu(.1)), 32); }
      }
    }); });

  /* 02 ── RING (วงแหวน) — 'side': the ring on the left, the icon box and unit pill on the right (flat sizes; size 1: the ring is too short to hold
     the number, so the icon sits in the ring and the number stands beside it) · 'shoulder': the B01T arrangement (box on the ring's shoulder,
     unit pill under) */
  variant('ring', 'วงแหวน', (d, c) => { const v = VAL(d), u = UN(d), ic = ICN(d), H = Z.H, fr = frac(d), W2 = SZ.w / 2, H2 = SZ.h / 2, t0 = tu(.3), t1 = f3(H - tu(.04));
    const T = { 1: { m: 'tiny', r: 64 }, 2: { m: 'side', r: 172, ns: 120, bs: 150 }, 3: { m: 'sh', r: 150, ns: 116, bs: 100 }, 4: { m: 'sh', r: 140, ns: 110, bs: 96 },
      5: { m: 'side', r: 242, ns: 160, bs: 170 }, 6: { m: 'sh', r: 300, ns: 200, bs: 150 }, 7: { m: 'sh', r: 126, ns: 100, bs: 90 } }[SZ.n];
    art(c, p => { const r = T.r, k = r / 200, tk1 = 26 * k + 2, tk2 = 44 * k + 2, R2 = r + tk2;
      let cx = 0, cy = 0, side = null;
      if (T.m === 'tiny') { cx = -W2 + PAD + R2; }
      else if (T.m === 'side' && (ic || u)) { cx = -W2 + PAD + R2; side = { x: f1((cx + R2 + W2) / 2) }; }
      else if (T.m === 'side') { T.m = 'alone'; }   /* nothing for the right column → the ring alone in the middle */
      else { const pillY = r + 52 + 30 * k, top = -R2, bot = pillY + 32; cy = f1(-(top + bot) / 2); }
      drawAt(p.circle(cx, cy, r, { sw: Math.max(9, 14 * k), stroke: SOFTT.stroke }), p, tu(.04), tu(.3));
      const N = r < 100 ? 24 : 36; for (let q = 0; q < N; q++) { const a = -90 + q * 360 / N; tick(atG(p, tu(.1 + .006 * q)), cx, cy, a, r + tk1, r + tk2, S(1.6));
        if (q / N < fr - 1e-6) tick(litOn(p, f3(t0 + (t1 - t0) * q / N / Math.max(fr, .01))), cx, cy, a, r + tk1 - 2, r + tk2 + 4, { sw: 3.4, stroke: ACC1 }); }
      if (fr > 0) { const arc = p.path(arcD(cx, cy, r, fr), { sw: Math.max(9, 14 * k), stroke: ACC1 }); on(arc, p, 0, { draw: fillK(t0, t1) });
        const rd = mvG(p, { px: cx, py: cy, r: ridK(360 * fr, t0, t1), o: fadeIn(t0, .04) }), a = rad(-90 + 360 * fr); rd.circle(f1(cx + r * Math.cos(a)), f1(cy + r * Math.sin(a)), Math.max(11, 16 * k), { fill: ACC1, sw: 2, stroke: ACC1 }); }
      if (T.m === 'tiny') {   /* size 1: icon in the ring (flies in on an arc), the number + unit beside it, big */
        if (ic) { const L = [[cx - 200, cy - 220], [cx + 120, cy - 200], [cx, cy]], K = pathK(L, tu(.14), tu(.44), [cx, cy]); put(p, c, { icon: ic }, cx, cy, r * 1.05, null, { t: tu(.14), mv: { px: cx, py: cy, x: K.x, y: K.y }, punch: tu(.44) }); }
        const x0 = cx + R2 + 36, n = numRow(p, p, v, u, ic ? x0 : (x0 + W2 - PAD) / 2 + (ic ? 0 : 0), 52, { size: 150, maxW: W2 - PAD - x0, anchor: ic ? 'start' : 'middle', t0: tu(.3) });
        if (!ic && v) { /* no icon: the number in the ring after all would be tiny — keep it beside; the ring holds a lit dot */ popAt(p, cx, cy, tu(.3)).circle(cx, cy, 12, { fill: ACC1, sw: 1, stroke: ACC1 }); }
        if (n) ripple(p, n.x0 + n.nw / 2, n.cy, 90, H);
        return; }
      const n = num(p, p, v, cx, f1(cy + T.ns * .35), { size: T.ns, maxW: f1(r * 1.5), t0: tu(.3) }); if (n) ripple(p, cx, cy, r - 30 * k, H);
      if (T.m === 'side') { const bx = side.x, room = W2 - PAD - (cx + R2) - 20, gy = (ic ? T.bs : 0) + (u ? 70 : 0) + (ic && u ? 50 : 0), by = -gy / 2 + T.bs / 2;
        if (ic) { const L = [[bx - 300, -H2 - 160], [bx - 120, -H2 - 60], [bx, by]], K = pathK(L, tu(.14), tu(.44), [bx, by]), mv = { px: bx, py: by, x: K.x, y: K.y }, g = mvG(CL(p), Object.assign({ o: fadeIn(tu(.14), .04) }, mv));
          ibox(p, c, { icon: ic }, bx, by, T.bs, tu(.14), { g, mv, punch: tu(.44) }); }
        pill(p, u, bx, f1(ic ? by + T.bs / 2 + 50 + 35 : 0), { t: f3(H + tu(.06)), size: T.bs > 160 ? 40 : 34, maxW: room - 60 });
      } else { const bs = T.bs, bx = f1(Math.min(W2 - PAD - bs / 2, cx + r * 1.0)), by = f1(Math.max(-H2 + PAD + bs / 2, cy - r * .9));
        if (ic) { const L = [[-W2 - 120, -H2 - 120], [0, -H2 - 160], [bx, by]], K = pathK(L, tu(.14), tu(.44), [bx, by]), mv = { px: bx, py: by, x: K.x, y: K.y }, g = mvG(CL(p), Object.assign({ o: fadeIn(tu(.14), .04) }, mv));
          ibox(p, c, { icon: ic }, bx, by, bs, tu(.14), { g, mv, punch: tu(.44) }); }
        pill(p, u, cx, f1(cy + r + 52 + 30 * k), { t: f3(H + tu(.06)), size: r > 200 ? 42 : 34, maxW: SZ.w - 2 * PAD - 60 }); }
    }); });

  /* 03 ── PROGRESS BAR (แถบความคืบหน้า) — 'row' (flat sizes: box at the bar's start, number above the bar, unit at the far end) ·
     'col' (box on top, number, the bar full width at the bottom) */
  variant('bar', 'แถบความคืบหน้า', (d, c) => { const v = VAL(d), u = UN(d), ic = ICN(d), H = Z.H, fr = frac(d), W2 = SZ.w / 2, H2 = SZ.h / 2, t0 = tu(.34), t1 = f3(H - tu(.04));
    const T = { 1: { m: 'row', bs: 150, bh: 46, ns: 100 }, 2: { m: 'row', bs: 210, bh: 60, ns: 230 }, 3: { m: 'col', bs: 130, bh: 54, ns: 170 }, 4: { m: 'col', bs: 160, bh: 56, ns: 170, st: true },
      5: { m: 'row', bs: 250, bh: 80, ns: 330 }, 6: { m: 'col', bs: 260, bh: 90, ns: 320, st: true }, 7: { m: 'col', bs: 140, bh: 52, ns: 150, st: true } }[SZ.n];
    art(c, p => { const bh = T.bh, kr = f1(bh * .58); let bx0, bx1, by, nx, base, ns = T.ns, n;
      const bar = () => { R(inG(p, 'pop', (bx0 + bx1) / 2, by, tu(.1)), bx0, by - bh / 2, bx1 - bx0, bh, bh / 2, F(3.4)); const bw = bx1 - bx0;
        if (fr > 0) { const fw = Math.max(bh * .8, (bw - 12) * fr); R(mvG(p, { px: bx0, py: by, sx: fillK(t0, t1), o: fadeIn(t0, .04) }), bx0 + 6, by - bh / 2 + 6, fw, bh - 12, (bh - 12) / 2, FILL);
          const kx = f1(bx0 + 6 + fw - (bh - 12) / 2), kn = mvG(p, { x: [[0, f1(bx0 + 30 - kx)], [t0, f1(bx0 + 30 - kx)], [t1, 0, 'io']], o: fadeIn(t0, .04) }); kn.circle(kx, by, kr, F(4)); ripple(p, kx, by, kr * 1.5, H); } };
      if (T.m === 'row') { const L = -W2 + PAD;
        bx0 = ic ? L + T.bs + 26 : L; bx1 = W2 - PAD;
        const top = -(bh / 2 + ns * .16 + .78 * ns), bot = ic ? T.bs / 2 : bh / 2; by = f1(-(top + bot) / 2);
        dropBox(p, c, ic, L + T.bs / 2, by, T.bs, tu(.04), tu(.28)); bar();
        base = f1(by - bh / 2 - ns * .16);
        const uw = u ? tw(p, u, Math.max(40, ns * .22), 600) + 30 : 0, mw = bx1 - bx0 - 20 - (u && uw < (bx1 - bx0) * .4 ? uw : 0);
        n = numRow(p, p, v, null, bx0, base, { size: ns, maxW: mw, anchor: 'start', t0: tu(.3) });
        if (u && n) { const room = bx1 - n.x1 - 24; if (room > 120) words(p, u, bx1, base, { t: f3(H + tu(.06)), size: Math.max(40, Math.min(ns * .22, 72)), weight: 600, color: C.soft, anchor: 'end', maxW: room, wrap: null });
          else pill(p, u, (bx0 + bx1) / 2, f1(by + bh / 2 + 50), { t: f3(H + tu(.06)), size: 32, maxW: 500 }); }
      } else { const us = usOf(ns), g1 = T.bs * .22, nh = numH(ns, u, T.st, us), g2 = ns * .22, tot = (ic ? T.bs + g1 : 0) + nh + g2 + bh, top = -tot / 2;
        const boxY = top + T.bs / 2; base = f1((ic ? top + T.bs + g1 : top) + .78 * ns); by = f1(top + tot - bh / 2); bx0 = -W2 + PAD; bx1 = W2 - PAD;
        dropBox(p, c, ic, 0, boxY, T.bs, tu(.04), tu(.28)); bar();
        n = numB(p, v, u, 0, base, ns, { stack: T.st, maxW: SZ.w - 2 * PAD, us, t0: tu(.3) }); }
    }); });

  /* 04 ── DIAL (หน้าปัด) — 'stack' = the B01T arrangement (icon box and dir badge in the top corners, the half dial, number under the pivot) ·
     'side' (size 1 only: the dial on the left, number + box + badge on the right) */
  variant('gauge', 'หน้าปัด', (d, c) => { const v = VAL(d), u = UN(d), ic = ICN(d), H = Z.H, ps = posV(d), W2 = SZ.w / 2, H2 = SZ.h / 2, t0 = tu(.36), t1 = f3(H - tu(.04)), N = 12;
    const T = { 1: { m: 'side', r: 160, ns: 130, bs: 110 }, 2: { m: 'stack', r: 250, ns: 130, bs: 120, g: 34 }, 3: { m: 'stack', r: 220, ns: 120, bs: 100, g: 34 },
      4: { m: 'stack', r: 175, ns: 140, bs: 110, g: 40, st: true }, 5: { m: 'stack', r: 320, ns: 170, bs: 140, g: 50 }, 6: { m: 'stack', r: 390, ns: 220, bs: 150, g: 60, st: true },
      7: { m: 'stack', r: 155, ns: 120, bs: 96, g: 30, st: true } }[SZ.n];
    art(c, p => { const r = T.r, k = r / 290, sw = f1(Math.max(15, 22 * k)), pr = f1(Math.max(15, 22 * k)), R1 = r + sw / 2;
      let cx = 0, cy = 0, ns = T.ns;
      if (T.m === 'side') { cy = f1((R1 - pr) / 2); cx = f1(-W2 + PAD + R1); }
      else { /* centred in the room under the corner row (the arc may rise between the corner box and the badge) */ const us = usOf(ns), tot = R1 + pr + T.g + numH(ns, u, T.st, us), a = -H2 + PAD + T.bs * .55, b = H2 - PAD, top = b - a > tot ? a + (b - a - tot) / 2 : -tot / 2; cy = f1(top + R1); }
      for (let q = 0; q < N; q++) { const a0 = 180 + q * 180 / N + 1.6, a1 = 180 + (q + 1) * 180 / N - 1.6, P = a => f1(cx + r * Math.cos(rad(a))) + ' ' + f1(cy + r * Math.sin(rad(a))), dd = `M ${P(a0)} A ${r} ${r} 0 0 1 ${P(a1)}`;
        drawAt(p.path(dd, { sw, stroke: TL_(.16) }), p, tu(.06 + .02 * q), tu(.1)); if ((q + .5) / N <= ps + 1e-6) on(p.path(dd, { sw, stroke: ACC1 }), p, 0, { o: [[0, 0], [f3(t0 + (t1 - t0) * (q + .5) / N / Math.max(ps, .01)), 0], [f3(t0 + (t1 - t0) * (q + .5) / N / Math.max(ps, .01) + tu(.04)), 1]] }); }
      const an = 180 + 180 * ps, nd = mvG(p, { px: cx, py: cy, r: [[0, -180 * ps], [t0, -180 * ps], [t1, 6, 'out'], [f3(t1 + tu(.1)), -2, 'io'], [f3(t1 + tu(.18)), 0, 'soft']], o: fadeIn(tu(.3), .04) });
      nd.line(cx, cy, f1(cx + (r - 70 * k) * Math.cos(rad(an))), f1(cy + (r - 70 * k) * Math.sin(rad(an))), W(f1(Math.max(4.4, 6 * k)))); popAt(p, cx, cy, tu(.3)).circle(cx, cy, pr, SOLID(2));
      let n;
      if (T.m === 'side') { const x0 = cx + R1 + 34, x1 = W2 - PAD, colX = x1 - T.bs / 2;
        n = numRow(p, p, v, u, x0, f1(ns * .35 + 6), { size: ns, maxW: (ic || DIRV(d) ? colX - T.bs / 2 - 20 : x1) - x0, anchor: 'start', t0: tu(.32) });
        dropBox(p, c, ic, colX, f1(-H2 + PAD + T.bs / 2 - 4), T.bs, tu(.04), tu(.26)); dirB(p, DIRV(d), colX, f1(ic ? H2 - PAD - 32 : 0), f3(H + tu(.1)), 30);
      } else { const us = usOf(ns), base = f1(cy + pr + T.g + .78 * ns);
        n = numB(p, v, u, cx, base, ns, { stack: T.st, maxW: SZ.w - 2 * PAD, us });
        const cxB = f1(-W2 + PAD + T.bs / 2), cyB = f1(-H2 + PAD + T.bs / 2);
        dropBox(p, c, ic, cxB, cyB, T.bs, tu(.04), tu(.26)); dirB(p, DIRV(d), f1(W2 - PAD - 36), cyB, f3(H + tu(.1)), T.bs < 120 ? 30 : 36); }
      if (n) ripple(p, cx, cy, 40 * Math.max(.7, k), H);
    }); });

  /* 05 ── STAT CARD (การ์ดสถิติ) — the card = the whole size. 'row' (size 1: icon | number | rule | two lines) · 'top' (icon + lines on top,
     a rule, the number under — the B01T arrangement) · 'narrow' (sizes 4 / 7: icon and badge on top, lines full width, rule, number, unit line) */
  variant('card', 'การ์ดสถิติ', (d, c) => { const v = VAL(d), u = UN(d), ic = ICN(d), H = Z.H, W2 = SZ.w / 2, H2 = SZ.h / 2;
    const T = { 1: { m: 'row', bs: 120, ns: 130, ls: 34 }, 2: { m: 'top', bs: 120, ns: 200, ls: 42 }, 3: { m: 'top', bs: 110, ns: 180, ls: 38 }, 4: { m: 'narrow', bs: 110, ns: 150, ls: 38 },
      5: { m: 'top', bs: 150, ns: 280, ls: 48 }, 6: { m: 'top', bs: 170, ns: 360, ls: 52, st: true }, 7: { m: 'narrow', bs: 100, ns: 120, ls: 36 } }[SZ.n];
    art(c, p => { const cw = SZ.w - 16, ch = SZ.h - 16, ip = SZ.n === 1 ? 34 : 44; cardG(p, cw, ch, 0);
      const X0 = -cw / 2 + ip, X1 = cw / 2 - ip, Y0 = -ch / 2 + ip * .9, Y1 = ch / 2 - ip * .9, bs = T.bs, ls = T.ls;
      const lines2 = (lx, ys, w, sz) => ys.forEach((y, q) => { const L = LN(d, q), t = tu(.36 + .08 * q); if (L) lineIn(p, L, lx, y, w, t, q ? sz * .92 : sz);
        else { const bw = f1(w * (q ? .62 : .94)); R(mvG(p, { px: lx, py: y, sx: [[0, 0], [t, 0], [f3(t + tu(.2)), 1, 'out']], o: fadeIn(t, .04) }), lx, f1(y - 13), bw, 26, 13, PH); } });
      let n;
      if (T.m === 'row') { const ix = X0 + bs / 2; spinBox(p, c, ic, ix, 0, bs, tu(.3)); const nx = ic ? X0 + bs + 34 : X0, rx = 96;
        n = numRow(p, p, v, u, nx, f1(T.ns * .35), { size: T.ns, maxW: rx - 60 - nx, anchor: 'start', t0: tu(.4) });
        drawAt(p.line(rx, -ch / 2 + 40, rx, ch / 2 - 40, S(2)), p, tu(.3), tu(.3)); lines2(rx + 30, [-26, 38], X1 - rx - 30, ls);
        dirB(p, DIRV(d), rx - 40, f1(-ch / 2 + 44), f3(H + tu(.1)), 28);
      } else if (T.m === 'top') { const ix = X0 + bs / 2, iy = Y0 + bs / 2; spinBox(p, c, ic, ix, iy, bs, tu(.3)); const lx = ic ? X0 + bs + 34 : X0, rB = DIRV(d) ? 100 : 0;
        lines2(lx, [f1(iy - bs * .24), f1(iy + bs * .3)], X1 - lx - rB, ls);
        const ry = f1(Y0 + bs + ip * .7); drawAt(p.line(X0, ry, X1, ry, S(2)), p, tu(.3), tu(.3));
        const us = usOf(T.ns), nh = numH(T.ns, u, T.st, us, true), rT = ry + 30, rBm = Y1, base = f1((rT + rBm) / 2 - nh / 2 + .78 * T.ns);
        n = numB(p, v, u, X0, base, T.ns, { stack: T.st, maxW: X1 - X0, anchor: 'start', t0: tu(.4), us, tight: true });
        dirB(p, DIRV(d), f1(X1 - 36), f1(iy), f3(H + tu(.1)), bs < 130 ? 30 : 36);
      } else { const ix = X0 + bs / 2, iy = Y0 + bs / 2; spinBox(p, c, ic, ix, iy, bs, tu(.3)); dirB(p, DIRV(d), f1(X1 - 32), f1(iy), f3(H + tu(.1)), 30);
        const ly0 = ic || DIRV(d) ? Y0 + bs + ip * .9 : Y0 + 30; lines2(X0, [f1(ly0), f1(ly0 + ls * 1.45)], X1 - X0, ls);
        const ry = f1(ly0 + ls * 1.45 + ls * 1.2); drawAt(p.line(X0, ry, X1, ry, S(2)), p, tu(.3), tu(.3));
        const us = usOf(T.ns), nh = numH(T.ns, u, true, us, true), base = f1((ry + 30 + Y1) / 2 - nh / 2 + .78 * T.ns);
        n = numB(p, v, u, X0, base, T.ns, { stack: true, maxW: X1 - X0, anchor: 'start', t0: tu(.4), us, tight: true }); }
      if (n) ripple(p, n.x0 + n.nw / 2, n.cy, Math.min(120, T.ns * .6), H);
    }); });

  /* ---------- sheet helpers: the size's frame (dashed, review only — not part of the picture) ---------- */
  function frame(x, y, w, h) { setZ({ hit: 1.5 }); art({ x, y, s: 1, at: 0 }, p => { const e = R(p, -w / 2, -h / 2, w, h, 6, { sw: 1.6, stroke: TL_(.32), fill: 'none' }); e.setAttribute('stroke-dasharray', '10 9'); }); }

  const SAMPLES = [
    { say: 'วิ่งวันละ 5 กิโล', value: '5', unit: 'กิโล', icon: 'person-standing', lines: ['วิ่งตอนเช้า', 'รอบสวนสาธารณะใกล้บ้าน'] },
    { say: 'แต่งงานกันมา 12 ปี', value: '12', unit: 'ปี', icon: 'heart' },
    { say: 'ค่าไฟลดลง 30%', value: '30%', icon: 'zap', dir: 'down' },
    { say: 'ความชื้นในดิน 65%', value: '65%', icon: 'droplet', lines: ['แปลงผักหลังบ้าน', 'วัดเมื่อเช้านี้'] },
    { say: 'นอนให้ได้ 8 ชั่วโมง', value: '8', unit: 'ชั่วโมง', icon: 'bed', lines: ['เข้านอนสี่ทุ่ม', 'ตื่นหกโมงเช้า'] },
    { say: 'ดื่มน้ำวันละ 2.5 ลิตร', value: '2.5', unit: 'ลิตร', icon: 'glass-water' },
    { say: 'ต้นไม้สูงขึ้น 120 เซนติเมตร', value: '120', unit: 'เซนติเมตร', icon: 'sprout', dir: 'up' },
    { say: 'ยอดขายเพิ่มเป็น 3 เท่า', value: '3', unit: 'เท่า', icon: 'store', dir: 'up' },
    { say: 'ถ่ายไปแล้ว 1,250 รูป', value: '1,250', unit: 'รูป', icon: 'camera' },
    { say: 'คนดูทะลุ 1 ล้านคน', value: '1', unit: 'ล้านคน', icon: 'users' },
    { say: 'ชนะมาแล้ว 7 ครั้ง', value: '7', unit: 'ครั้ง', icon: 'trophy' },
    { say: 'ปีนี้แม่อายุ 60', value: '60', unit: 'ปี', icon: 'cake' },
    { say: 'เปิดร้านมาครบ 100 วัน', value: '100', unit: 'วัน', icon: 'calendar' },
    { say: 'ส่งของไปแล้ว 3,000 กล่อง', value: '3,000', unit: 'กล่อง', icon: 'package' },
    { say: '90% ของคนทำงานเหนื่อย', value: '90%', unit: 'ของคนทำงาน', icon: 'briefcase' },
    { say: 'ฝุ่นเล็กแค่ 2.5 ไมครอน', value: '2.5', unit: 'ไมครอน', icon: 'cloud', dir: 'down' },
    { say: 'สมาชิกใหม่ 4,800 คน', value: '4,800', unit: 'คน', icon: 'user-plus', dir: 'up', lines: ['เดือนก่อนหน้า', 'เดือนหน้า'] },
    { say: 'ราคาลด 50%', value: '50%', icon: 'tag', dir: 'down' },
    { say: 'เที่ยวมาแล้ว 12 ประเทศ', value: '12', unit: 'ประเทศ', icon: 'plane', dir: 'up' },
    { say: 'ปีนี้อ่านหนังสือ 24 เล่ม', value: '24', unit: 'เล่ม', icon: 'book-open' },
  ];
  const STRESS = [
    { say: 'เก็บเงินได้ 1,250,000 บาท (9 หลัก)', value: '1,250,000', unit: 'บาท' },
    { say: 'ค่า π ประมาณ 3.14 (ไม่มีหน่วย ไม่มีไอคอน)', value: '3.14' },
    { say: 'ได้ผล 99.9%', value: '99.9%', icon: 'shield-check', dir: 'up' },
    { say: 'ran 42 kilometers (English)', value: '42', unit: 'kilometers', icon: 'bike' },
    { say: 'ขาดงาน 0 วัน', value: '0', unit: 'วัน', icon: 'calendar' },
    { say: 'ต้นทุนลดลง 12.5%', value: '12.5%', icon: 'coins', dir: 'down' },
    { say: 'ซ่อมไปแล้ว 1,000,000 ครั้ง', value: '1,000,000', unit: 'ครั้ง', icon: 'wrench' },
    { say: 'น้ำหนักลด 15 กิโลกรัม', value: '15', unit: 'กิโลกรัม', dir: 'down' },
    { say: 'ใช้เวลาแค่ 3 นาที', value: '3', unit: 'นาที', icon: 'timer' },
    { say: 'ผ่านมา 25 ปี', value: '25', unit: 'ปี' },
    { say: 'ใบไม้ร่วง 300,000 ใบ', value: '300,000', unit: 'ใบ', icon: 'leaf', dir: 'down' },
    { say: 'สูง 8,848 เมตร', value: '8,848', unit: 'เมตร', icon: 'mountain' },
    { say: 'ลูกคนที่ 2', value: '2', icon: 'baby' },
    { say: 'ขับมา 120,500 กิโลเมตร', value: '120,500', unit: 'กิโลเมตร', icon: 'car' },
    { say: 'ผ่อนบ้านอีก 30 ปี', value: '30', unit: 'ปี', icon: 'house', dir: 'down' },
    { say: 'ทาน 1 ผลต่อวัน', value: '1', unit: 'ผลต่อวัน', icon: 'apple' },
    { say: 'ยา 2 เม็ด', value: '2', unit: 'เม็ด', icon: 'pill' },
    { say: 'ยกได้ 100 กิโล', value: '100', unit: 'กิโล', icon: 'dumbbell', dir: 'up' },
    { say: 'กาแฟวันละ 4 แก้ว', value: '4', unit: 'แก้ว', icon: 'coffee', dir: 'up' },
    { say: '7.5 ล้านวิว', value: '7.5', unit: 'ล้านวิว', icon: 'music' },
  ];

  /* the max slot (value ÷ max): sentences that say the whole */
  const MAXS = [
    { say: 'นอน 6 จาก 8 ชั่วโมง', value: '6', max: '8', unit: 'ชั่วโมง', icon: 'bed' },
    { say: 'เก็บได้ 7,500 จากเป้า 10,000 บาท', value: '7,500', max: '10,000', unit: 'บาท', icon: 'wallet' },
    { say: 'อ่านไป 3 จาก 12 เล่ม', value: '3', max: '12', unit: 'เล่ม', icon: 'book-open' },
    { say: 'ทำไปแล้ว 45 จาก 50 ข้อ', value: '45', max: '50', unit: 'ข้อ', icon: 'list-checks' },
    { say: 'วิ่งได้ 2 จาก 10 กิโล', value: '2', max: '10', unit: 'กิโล', icon: 'person-standing' },
  ];
  G.cats = G.cats || {};
  G.cats.B01S = { variants: V, SIZES, SAMPLES, STRESS, MAXS, theme, frame,
    draw: (i, d, c) => { const n = +c.size || 5; SZ = Object.assign({ n }, SIZES[n]); setZ(c); CUR = V[i].id + '@' + n; tokens(); EMPTY = false; BLUE = false; V[i].build(d || {}, c); },
    CLAMPS, timing: c => (setZ(c), Object.assign({}, Z)) };
})();
