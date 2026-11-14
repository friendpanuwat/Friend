/* b03t.js — template ชุดฐาน category B03 "เปรียบเทียบ / ก่อน → หลัง" (user 2026-11-14: "เริ่มทำ template ชุดฐาน หมวด B03 ได้ … คล้ายๆกันได้แต่ไม่ต้อง
   เหมือนกัน 100% ก็จริง แต่ไม่ได้หมายความว่าทั้ง 50 อันหน้าตามันจะต้องคล้ายๆกันไปหมด") — graphic elements only (icon boxes, pills, bars, rings,
   dials, tabs, wedges, lanes …), no real-world objects, our white-glow line style, colours from GL.theme. Icons apart from words; icon slots big
   (≥ 165 on the 1000 × 700 canvas), words ≥ 40, marks r ≥ 56. Round 1 = designs 1–25 (each a different layout) · round 2 = 26–50.
   Not a replacement for the approved B03 (references/approved/b03/). Header + helpers copied from b02t.js.
   GL.cats.B03T.draw(i, data, { x, y, s, at, hit }) — canvas 1000 × 700 centred at (0,0). Data = CutPack B03: mode versus | change · a, b THING ·
   win 'a' | 'b' (change → b) · how 'x' | 'check' · v { a, b } 0.1–1 · switch false (the after state is off) · texts [a, b] (one line of words per
   side, optional — shown where a side has grey lines; none → the grey lines). */
(function () {
  const G = window.GL, C = G.C, NS = 'http://www.w3.org/2000/svg';
  const W = (w = 2) => ({ sw: w }), F = (w = 3.2) => ({ fill: C.fill, sw: w }), S = (w = 2) => ({ sw: w, stroke: C.soft });
  const rad = d => d * Math.PI / 180, f1 = v => +v.toFixed(1);
  let GLASS = 'rgba(255,255,255,.07)', LIT = 'rgba(255,255,255,.2)'; const SOLID = (w = 2) => ({ fill: C.ink, sw: w });

  /* TIMING (same system as b01–b11): the keyword c.hit never moves; M = 1/speed but at most hit / HIT0; tu / bH / aH; kf() keeps keys in order */
  const HIT0 = 1.8; let Z = null; const CLAMPS = {}; let CUR = '';
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
    cp.id = 'b03tclip' + (++CID); Object.entries({ x, y, width: w, height: h }).forEach(([k, v]) => r.setAttribute(k, v)); cp.appendChild(r);
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
    if (X && picOf(X)) put(q, c, { icon: X.icon }, x, y, s * .66, null, { t: f3(t + tu(.04)), mv: o.mv, o: o.dim ? dimK(o.dim) : undefined, punch: o.punch });
    else if (X && X.label) txt(g, X.label, x, y + s * .08, { size: s * .22, maxW: s * .88, weight: 800, color: C.ink, wrap: 'mid' }); else DOT(g, x, y, 8); return g; }
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
  function dropBox(p, c, ic, x, y, s, t0, t1, o = {}) { if (!ic) return null; const by = y + s / 2, K = fallK(x, by, t0, t1, o.h ?? Math.max(120, by + 350));
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

  /* ================= designs 21–50 (user 2026-11-14 "ออกแบบเพิ่มอีก 30 อัน") — same rules: graphic elements only, icon apart from words,
     the number locks on H, colours from the theme (ACC1 = what lights up, TL_() = faint line tints) ================= */
  /* an icon in a round plate that pops at t (o.g = draw into this group; o.mv = the keys it rides) */
  function icirc(p, c, ic, x, y, r, t, o = {}) { if (!ic) return null; const g = o.g || popAt(p, x, y, t); g.circle(x, y, r, F(3.4)); g.circle(x, y, r - 12, S(1.4));
    put(p, c, { icon: ic }, x, y, r * 1.15, null, { t: f3(t + tu(.04)), mv: o.mv, punch: o.punch }); return g; }
  const rowOf = (p, v, u, s0, maxW) => v ? rowW(p, v, u, s0, maxW) : 0;
  const hexD = (x, y, r) => pathOf([0, 1, 2, 3, 4, 5].map(k => [f1(x + r * Math.cos(rad(-90 + 60 * k))), f1(y + r * Math.sin(rad(-90 + 60 * k)))]));
  /* repeating turn: r keys that spin from t0 to t1 by deg, easing to a stop */
  const spinR = (t0, t1, deg) => [[0, 0], [t0, 0], [t1, deg, 'out']];



  /* ================= B03T — เปรียบเทียบ / ก่อน → หลัง (Comparison / Before–After) as a template ชุดฐาน =================
     CutPack B03: mode versus | change · a, b THING (icon + label) · win 'a' | 'b' (change → b) · how 'x' (cross the loser) | 'check' (tick the
     winner) · v { a, b } 0.1–1 · switch false (the after state is off: it does not light) · texts [a, b] (words in place of a side's grey lines).
     Timing: a comes in first (tu .1), b next (versus tu .42 · change: just before the keyword — b is what a becomes). Before H both sides look
     equal (CutPack). On H the verdict lands: the loser dims (.38, solid backing), the winner punches and lights in the accent, ✓ / ✗ stamps in.
     Each of the 50 designs is its own layout (user: "ไม่ได้หมายความว่าทั้ง 50 อันหน้าตามันจะต้องคล้ายๆกันไปหมด"). No word chip top-left, no arrow
     badge top-right, no floor line; icon boxes ≥ 165, words ≥ 40 (pills 50), marks r ≥ 56; colours from the theme only. */
  const SIDES = ['a', 'b'], OTH = s => s === 'a' ? 'b' : 'a';
  const XS = (d, s) => d && has(d[s]) ? d[s] : null;
  function ST(d) { const change = d.mode === 'change', win = d.win === 'a' || d.win === 'b' ? d.win : change ? 'b' : null, lose = win ? OTH(win) : null;
    const hasV = !!(d.v && (d.v.a != null || d.v.b != null)), cl = v => Math.max(.1, Math.min(1, +v || .5)), va = hasV ? cl(d.v.a) : null, vb = hasV ? cl(d.v.b) : null;
    const amt = s => hasV ? (s === 'a' ? va : vb) : win ? (s === win ? .85 : .35) : .6;
    return { change, win, lose, hasV, va, vb, amt, off: d.switch === false, big: win || (hasV && va !== vb ? (va > vb ? 'a' : 'b') : null) }; }
  const tIn = (d, s) => s === 'a' ? tu(.1) : d.mode === 'change' ? f3(Math.max(tu(.6), Z.H - tu(.5))) : tu(.42);
  const TXS = (d, s) => { const k = s === 'a' ? 0 : 1; return d && Array.isArray(d.texts) && d.texts[k] != null && String(d.texts[k]).trim() ? String(d.texts[k]).trim() : null; };
  const LIT2 = () => ({ fill: TA(.18), sw: 5, stroke: ACC1 });
  const NOS = { sw: 0, stroke: 'none' };
  const GREY = () => ({ fill: TL_(.16), sw: 0, stroke: 'none' });
  const SL = (w = 2) => ({ sw: w, stroke: C.soft });
  const DASH = (a = .4) => ({ sw: 2.4, stroke: TL_(a), 'stroke-dasharray': '8 10' });
  const chev = (q, x, y, k = 1, o = W(7)) => q.path(`M ${f1(x - 14 * k)} ${f1(y - 28 * k)} L ${f1(x + 16 * k)} ${y} L ${f1(x - 14 * k)} ${f1(y + 28 * k)}`, o);
  /* add a ride (the part it sits on moves at t) to fall keys: before t everything is shifted by off, then it glides to 0 */
  const rideY = (K, off, t) => { if (!off) return K; K.y = K.y.map(([u, v, e]) => e ? [u, f1(v + off), e] : [u, f1(v + off)]).concat([[t, off], [f3(t + tu(.3)), -6, 'out'], [f3(t + tu(.42)), 0, 'soft']]); return K; };
  /* absolute positions over time → offset keys from the final position */
  const offK = (pts, fin, e = 'io') => pts.map(([t, v], i) => i ? [f3(t), f1(v - fin), e] : [f3(t), f1(v - fin)]);
  const rotP = (x, y, px, py, a) => { const u = rad(a), dx = x - px, dy = y - py; return [f1(px + dx * Math.cos(u) - dy * Math.sin(u)), f1(py + dx * Math.sin(u) + dy * Math.cos(u))]; };
  function shp(q, sh, x, y, sz, o) { return sh === 'circ' ? q.circle(x, y, sz / 2, o) : sh === 'hex' ? q.path(hexD(x, y, sz / 2), o) : R(q, x - sz / 2, y - sz / 2, sz, sz, sz * .24, o); }
  /* side s as an icon slot (box | circ | hex) at (x, y) size sz. o.g = draw into this group (it rides it; o.mv = its keys for the icon) else it pops at o.t.
     The loser dims at H (o.dimAt), the winner bumps + lights on H; no icon → its word in the slot; nothing → an accent dot. o.io = the icon's own opacity keys. */
  function sbox(p, c, d, s, x, y, sz, o = {}) { const T = ST(d), X = XS(d, s), H = Z.H, t = o.t ?? tIn(d, s), sh = o.shape || 'box', da = o.dimAt ?? H;
    const lose = s === T.lose && !o.noDim, win = s === T.win && !T.off && !o.noLit;
    const g0 = o.g || popAt(p, x, y, t); if (lose) shp(g0, sh, x, y, sz, BK);
    const g = lose ? dimG(g0, da) : win ? mvG(g0, { px: x, py: y, s: bumpK(H, 1.08) }) : g0;
    shp(g, sh, x, y, sz, F(4)); if (sh === 'circ') g.circle(x, y, sz / 2 - 13, SL(1.4));
    if (win) { shp(litOn(g, H), sh, x, y, sz, LIT2()); if (o.rip !== false) ripple(p, x, y, sz * .56, f3(H + tu(.04))); }
    if (X && picOf(X)) put(p, c, { icon: X.icon }, x, y, sz * (sh === 'box' ? .72 : .66), null, { t: o.ti ?? f3(t + tu(.04)), mv: o.mv, o: o.io ?? (lose ? dimK(da) : undefined), punch: win ? H : undefined });
    else if (X && X.label) txt(o.tg || g, X.label, x, y + sz * .08, { size: Math.max(40, sz * .22), maxW: sz * (sh === 'box' ? .86 : .7), weight: 800, color: C.ink, wrap: 'mid' });
    else g.circle(x, y, sz * .09, { fill: ACC1, sw: 0, stroke: 'none' });
    return g; }
  /* side s's word as a pill (only when it has an icon — otherwise the word is in the slot); o.anchor start | end = x is that end */
  function tag(p, d, s, x, y, o = {}) { const str = LBL(XS(d, s)); if (!str) return null; const T = ST(d), sz = o.size || 50, mw = o.maxW || 340, w = Math.min(mw, tw(p, str, sz)) + 60;
    const cx = o.anchor === 'start' ? x + w / 2 : o.anchor === 'end' ? x - w / 2 : x;
    pill(o.g || p, str, cx, y, { t: o.t ?? f3(tIn(d, s) + tu(.16)), size: sz, maxW: mw, dim: s === T.lose && !o.noDim ? (o.dimAt ?? Z.H) : undefined }); return { w, cx }; }
  /* side s's word as plain big letters */
  function word(p, d, s, x, y, o = {}) { const str = LBL(XS(d, s)); if (!str) return null; const T = ST(d), t = o.t ?? f3(tIn(d, s) + tu(.16)), sz = o.size || 50;
    const g1 = popAt(o.g || p, x, y - sz * .35, t), g = s === T.lose && !o.noDim ? dimG(g1, o.dimAt ?? Z.H) : g1;
    return txt(g, str, x, y, { size: sz, maxW: o.maxW || 340, weight: 800, color: C.ink, anchor: o.anchor || 'middle', wrap: o.wrap === undefined ? 'mid' : o.wrap }); }
  /* side s's line of words (data.texts) — none → two grey lines in its place */
  function note(p, d, s, x, y, w, o = {}) { const T = ST(d), t = o.t ?? f3(tIn(d, s) + tu(.22)), g1 = atG(o.g || p, t), g = s === T.lose && !o.noDim ? dimG(g1, Z.H) : g1, str = TXS(d, s), an = o.anchor || 'start', x0 = an === 'middle' ? x - w / 2 : x;
    if (str) txt(g, str, an === 'middle' ? x : x0, y + 14, { size: o.size || 40, maxW: w, weight: 600, color: C.soft, anchor: an, wrap: 'down' });
    else { R(g, x0, y - 11, w, 22, 11, GREY()); R(g, an === 'middle' ? x - w * .31 : x0, y + 33, f1(w * .62), 22, 11, GREY()); } }
  /* the verdict mark: stamps in just after H (big → small), ✓ in the accent, ✗ in the line colour */
  function stamp(p, kind, x, y, r = 58) { const t = f3(Z.H + tu(.1)), g = sub(p);
    on(g, p, 0, { ox: x, oy: y, s: [[0, 1.8], [t, 1.8], [f3(t + tu(.14)), .9, 'in'], [f3(t + tu(.26)), 1.04], [f3(t + tu(.38)), 1, 'soft']], o: [[0, 0], [t, 0], [f3(t + tu(.06)), 1]] });
    g.circle(x, y, r, F(3.6)); const k = r / 32;
    if (kind === 'x') XX(g, x, y, k); else g.path(`M ${f1(x - 17 * k)} ${f1(y + 1 * k)} L ${f1(x - 5 * k)} ${f1(y + 13 * k)} L ${f1(x + 18 * k)} ${f1(y - 13 * k)}`, { sw: 5.4, stroke: ACC1 });
    ripple(p, x, y, r + 8, f3(t + tu(.14))); }
  function verdict(p, d, at) { const T = ST(d); if (!d.how || !T.win) return; const s = d.how === 'x' ? T.lose : T.win; if (at[s]) stamp(p, d.how === 'x' ? 'x' : 'check', at[s][0], at[s][1]); }
  const corner = (x, y, sz, sd = 1) => [f1(x + sd * (sz / 2 - 6)), f1(y - sz / 2 + 6)];
  /* an equal level both sides reach before the keyword (CutPack: equal until the verdict) */
  const eqOf = T => Math.min(T.amt('a'), T.amt('b')) * .82;
  /* keys for a fill that reaches its share e/a before H and its own amount on H (change: a fills when it comes, b lands on H) */
  const fillTo = (T, s, t0, a, e) => T.change ? [[0, 0], [t0, 0], [s === 'a' ? f3(t0 + tu(.4)) : Z.H, 1, 'out']]
    : [[0, 0], [t0, 0], [f3(Math.max(t0 + tu(.3), Z.H - tu(.25))), f3(e / a), 'io'], [Z.H, f3(e / a)], [f3(Z.H + tu(.36)), 1, 'out']];
  const doneAt = (T, s, t0) => T.change && s === 'a' ? f3(t0 + tu(.4)) : Z.H;

  /* 01 ── SPLIT (แบ่งครึ่ง): a seam draws down the middle; the two boxes drop into their halves (dust), their pills follow above; the middle
     disc spins in — VS (versus) or a chevron (change) — and on H leans toward the winner while the loser dims */
  variant('split', 'แบ่งครึ่ง', (d, c) => { const T = ST(d), bs = 240, P = { a: [-255, 50], b: [255, 50] };
    art(c, p => { const H = Z.H; drawAt(p.line(0, -300, 0, 300, { sw: 2.4, stroke: TL_(.45) }), p, tu(.02), tu(.32));
      SIDES.forEach(s => { const [x, y] = P[s], t = tIn(d, s), t1 = f3(t + tu(.26)), K = fallK(x, y + bs / 2, t, t1, y + bs / 2 + 360);
        sbox(p, c, d, s, x, y, bs, { g: mvG(CL(p), K), mv: K, t }); dust(p, x, y + bs / 2, t1, 1.1); tag(p, d, s, x, -190, { t: f3(t1 + tu(.04)), maxW: 380 }); });
      const K = Object.assign(spinK(0, 50, tu(.3)), T.win && !T.change ? { x: [[0, 0], [H, 0], [f3(H + tu(.1)), T.win === 'a' ? -24 : 24, 'out'], [f3(H + tu(.32)), 0, 'soft']] } : {}), g = mvG(p, K);
      g.circle(0, 50, 64, F(3.6)); if (T.change) chev(g, 0, 50, 1.15, { sw: 7, stroke: ACC1 }); else txt(g, 'VS', 0, 67, { size: 46, weight: 800, color: C.ink });
      verdict(p, d, { a: corner(...P.a, bs, -1), b: corner(...P.b, bs) });
    }); });

  /* 02 ── BARS (แถบเทียบ): two rows — an icon box slides in from the left, its track grows out beside it and its word sits on the track; both fills
     run to the same level, then on H each goes to its own amount (the winner's end ripples) */
  variant('bars', 'แถบเทียบ', (d, c) => { const T = ST(d), bs = 190, BX = -340, X0 = -205, X1 = 450, TWd = X1 - X0, Y = { a: -118, b: 150 }, e = eqOf(T);
    art(c, p => { const H = Z.H; SIDES.forEach(s => { const y = Y[s], t = tIn(d, s), a = T.amt(s), fw = f1((TWd - 20) * a);
        const K = { px: BX, py: y, x: glide(-260, t, f3(t + tu(.3)), 12), o: fadeIn(t, .04) }; sbox(p, c, d, s, BX, y, bs, { g: mvG(CL(p), K), mv: K, t });
        const t2 = f3(t + tu(.14)), TK = { px: X0, py: y, sx: [[0, 0], [t2, 0], [f3(t2 + tu(.3)), 1, 'out']], o: fadeIn(t2, .04) }; if (s === T.lose) R(mvG(p, TK), X0, y - 44, TWd, 88, 44, BK); const rg = s === T.lose ? dimG(p, H) : p; R(mvG(rg, TK), X0, y - 44, TWd, 88, 44, F(3.2));
        const tf = f3(t2 + tu(.3)); R(mvG(rg, { px: X0 + 10, py: y, sx: fillTo(T, s, tf, a, e) }), X0 + 10, y - 33, fw, 66, 33, { fill: TA(.62), sw: 0, stroke: 'none' });
        if (!T.win || s === T.win) ripple(p, X0 + 10 + fw, y, 44, doneAt(T, s, tf));
        word(p, d, s, X0 + 10, y - 66, { anchor: 'start', size: 46, wrap: null, maxW: TWd - 20, t: tf }); });
      verdict(p, d, { a: corner(BX, Y.a, bs), b: corner(BX, Y.b, bs) });
    }); });

  /* 03 ── COLUMNS (แท่งตั้งคู่): two columns grow up to the same height, a box drops onto each top (squash, dust); on H the columns go to their own
     heights and the boxes ride them — the winner's column lights. The word sits inside the column's foot */
  variant('columns', 'แท่งตั้งคู่', (d, c) => { const T = ST(d), bs = 186, BY = 320, CW = 214, X = { a: -180, b: 180 }, hOf = s => f1(130 + 250 * T.amt(s)), e = Math.min(hOf('a'), hOf('b'));
    art(c, p => { const H = Z.H; SIDES.forEach(s => { const x = X[s], h = hOf(s), t = tIn(d, s), late = T.change && s === 'b', h0 = T.change ? h : e;
        const tE = late ? f3(H - tu(.24)) : f3(t + tu(.35)), tL = late ? H : f3(tE + tu(.26));
        const SY = [[0, 0], [t, 0], [tE, f3(h0 / h * 1.03), 'out'], [f3(tE + tu(.1)), f3(h0 / h), 'soft']].concat(T.change ? [] : [[H, f3(h0 / h)], [f3(H + tu(.3)), 1.03, 'out'], [f3(H + tu(.42)), 1, 'soft']]);
        const cg0 = mvG(p, { px: x, py: BY, sy: SY, o: fadeIn(t, .04) }); if (s === T.lose) R(cg0, x - CW / 2, BY - h, CW, h, 30, BK); const cg = s === T.lose ? dimG(cg0, H) : cg0; R(cg, x - CW / 2, BY - h, CW, h, 30, F(3.6));
        if (s === T.win && !T.off) R(litOn(cg, H), x - CW / 2 + 12, BY - h + 12, CW - 24, h - 24, 20, { fill: TA(.14), sw: 0, stroke: 'none' });
        word(p, d, s, x, BY - 52, { size: 44, maxW: CW - 34, t: tE });
        const yb = f1(BY - h - 12), K = rideY(fallK(x, yb, f3(tL - tu(.26)), tL, 330), T.change ? 0 : f1(h - h0), H);
        sbox(p, c, d, s, x, yb - bs / 2, bs, { g: mvG(CL(p), K), mv: K, t: f3(tL - tu(.26)) }); dust(p, x, yb + (T.change ? 0 : h - h0), tL, .9); });
      verdict(p, d, { a: corner(X.a, BY - hOf('a') - 12 - bs / 2, bs, -1), b: corner(X.b, BY - hOf('b') - 12 - bs / 2, bs) });
    }); });

  /* 04 ── RINGS (วงแหวนคู่): two rings spin in edge-on, each with a round icon plate inside; the accent arcs run round to the same level, then on H
     to their own amounts. Words in pills above the rings */
  variant('rings', 'วงแหวนคู่', (d, c) => { const T = ST(d), R0 = 148, Y = 62, X = { a: -235, b: 235 }, e = eqOf(T);
    art(c, p => { const H = Z.H; SIDES.forEach(s => { const x = X[s], a = T.amt(s), t = tIn(d, s);
        if (s === T.lose) ring(mvG(p, spinK(x, Y, t)), x, Y, R0 + 17, R0 - 17, BK); const rg = s === T.lose ? dimG(p, H) : p; ring(mvG(rg, spinK(x, Y, t)), x, Y, R0 + 17, R0 - 17, F(3.4));
        const tf = f3(t + tu(.32)), arc = rg.path(arcD(x, Y, R0, a), { sw: 18, stroke: ACC1 }); on(arc, rg, 0, { draw: fillTo(T, s, tf, a, e) });
        sbox(p, c, d, s, x, Y, 200, { shape: 'circ', t: f3(t + tu(.12)) });
        const ea = rad(-90 + 360 * a); if (!T.win || s === T.win) ripple(p, f1(x + R0 * Math.cos(ea)), f1(Y + R0 * Math.sin(ea)), 30, doneAt(T, s, tf));
        tag(p, d, s, x, Y - R0 - 92, { maxW: 380 }); });
      verdict(p, d, { a: [X.a - 118, Y - 118], b: [X.b + 118, Y - 118] });
    }); });

  /* 05 ── TOGGLE (สวิตช์): a wide switch track stretches open; the two round plates sit at its ends; the lit knob ring waits in the middle,
     twitches, and on H snaps around the winner (change: the after side) — that half of the track lights (switch off: it stays dark) */
  variant('toggle', 'สวิตช์', (d, c) => { const T = ST(d), TWd = 790, TH = 262, Y = 52, XE = 262, bs = 196;
    art(c, p => { const H = Z.H, kx = T.win === 'a' ? -XE : T.win === 'b' ? XE : 0, lit = T.win && !T.off;
      R(mvG(p, { px: 0, py: Y, sx: [[0, .2], [tu(.04), .2], [tu(.34), 1.03, 'out'], [tu(.44), 1, 'soft']], o: fadeIn(tu(.04), .06) }), -TWd / 2, Y - TH / 2, TWd, TH, TH / 2, F(3.6));
      if (lit) R(litOn(p, H), kx < 0 ? -TWd / 2 + 14 : 0, Y - TH / 2 + 14, TWd / 2 - 14, TH - 28, (TH - 28) / 2, { fill: TA(.14), sw: 0, stroke: 'none' });
      SIDES.forEach(s => { const x = s === 'a' ? -XE : XE; sbox(p, c, d, s, x, Y, bs, { shape: 'circ', rip: false }); tag(p, d, s, x, Y - TH / 2 - 72, { maxW: 360 }); });
      const t0 = f3(Math.max(tu(.6), H - tu(.8))), q = k => f3(lerp(t0, H - tu(.12), k));
      const KX = [[0, 0], [t0, 0], [q(.25), -34, 'io'], [q(.5), 30, 'io'], [q(.75), -14, 'io'], [q(1), 0, 'soft']].concat(kx ? [[H, f1(kx * 1.05), 'in'], [f3(H + tu(.14)), kx, 'soft']] : [[f3(H + tu(.08)), 0]]);
      const kg = mvG(p, { x: KX, o: fadeIn(tu(.5), .06) }); kg.circle(0, Y, 118, { sw: 5, stroke: TL_(.55) });
      const kl = lit || (!T.win) ? litOn(kg, H) : null; if (kl) kl.circle(0, Y, 118, { sw: 6, stroke: ACC1 });
      if (kx) ripple(p, kx, Y, 130, f3(H + tu(.06)));
      verdict(p, d, { a: [-XE - 92, Y + 104], b: [XE + 92, Y + 104] });
    }); });

  /* 06 ── FLIP (พลิกกล่อง): one big box drops in showing the first side; just before H it turns edge-on and comes back showing the winner
     (change: the after) — a copy of the first flies out to a small slot on the left and dims there */
  variant('flip', 'พลิกกล่อง', (d, c) => { const T = ST(d), fin = T.win || 'b', fst = OTH(fin), BX = 112, BY = 40, bs = 300, SXp = -322, SYp = 74, s2 = 176;
    art(c, p => { const H = Z.H, t0 = tu(.1), t1 = f3(t0 + tu(.26)), tf = f3(H - tu(.14)), A = XS(d, fst), B = XS(d, fin), win = !!T.win && !T.off;
      const K0 = fallK(BX, BY + bs / 2, t0, t1, 420), g0 = mvG(CL(p), K0); dust(p, BX, BY + bs / 2, t1, 1.2);
      const FS = [[0, 1], [tf, 1], [H, 0, 'in'], [f3(H + tu(.14)), 1.06, 'out'], [f3(H + tu(.26)), 1, 'soft']], g = mvG(g0, { px: BX, py: BY, sx: FS });
      R(g, BX - bs / 2, BY - bs / 2, bs, bs, bs * .24, F(4.4)); if (win) { R(litOn(g, H), BX - bs / 2, BY - bs / 2, bs, bs, bs * .24, LIT2()); ripple(p, BX, BY, bs * .56, f3(H + tu(.2))); }
      const mvA = { px: BX, py: BY + bs / 2, y: K0.y, sy: K0.sy, sx: K0.sx.concat([[tf, 1], [H, 0, 'in']]) }, mvB = { px: BX, py: BY, sx: [[0, 0], [H, 0], [f3(H + tu(.14)), 1.06, 'out'], [f3(H + tu(.26)), 1, 'soft']] };
      const face = (X, mv, o, ti) => { if (X && picOf(X)) put(p, c, { icon: X.icon }, BX, BY, bs * .72, null, { t: ti, mv, o, punch: X === B && win ? f3(H + tu(.2)) : undefined });
        else { const fg = sub(g); on(fg, p, 0, { o }); if (X && X.label) txt(fg, X.label, BX, BY + bs * .08, { size: 64, maxW: bs * .86, weight: 800, color: C.ink, wrap: 'mid' }); else fg.circle(BX, BY, 26, { fill: ACC1, sw: 0, stroke: 'none' }); } };
      face(A, mvA, [[0, 1], [H, 1], [f3(H + tu(.01)), 0]], f3(t0 + tu(.04))); face(B, mvB, [[0, 0], [H, 0], [f3(H + tu(.01)), 1]], H);
      const LA = LBL(A), LB_ = LBL(B); if (LA) { const og = outG(p, H, .04); pill(og, LA, BX, BY - bs / 2 - 74, { t: f3(t1 + tu(.04)), size: 50, maxW: 380 }); }
      if (LB_) pill(p, LB_, BX, BY - bs / 2 - 74, { t: f3(H + tu(.14)), size: 50, maxW: 380 });
      /* the first side's copy flies to the small slot */
      const ta = f3(H + tu(.42)), P = pathK([[BX, BY], [(BX + SXp) / 2, -150], [SXp, SYp]], H, ta, [SXp, SYp]);
      const K = { px: SXp, py: SYp, x: P.x, y: P.y, s: [[0, bs / s2], [H, bs / s2], [ta, 1, 'out']], o: [[0, 0], [H, 0], [f3(H + tu(.03)), 1]] };
      drawAt(R(p, SXp - s2 / 2 - 12, SYp - s2 / 2 - 12, s2 + 24, s2 + 24, s2 * .3, DASH(.4)), p, tu(.3), tu(.3));
      sbox(p, c, d, fst, SXp, SYp, s2, { g: mvG(p, K), mv: K, t: H, ti: H, dimAt: ta, noLit: true });
      tag(p, d, fst, -462, SYp - s2 / 2 - 76, { t: f3(ta + tu(.04)), dimAt: ta, maxW: 320, anchor: 'start' });
      verdict(p, d, { [fin]: corner(BX, BY, bs), [fst]: corner(SXp, SYp, s2) });
    }); });

  /* 07 ── VENN (วงซ้อน): two big circles slide in from the sides and click into an overlap (the lens flashes, a ripple); each icon sits in its own
     lobe. On H the winner's circle fills with light and the loser fades; no winner → the shared lens lights (common ground) */
  variant('venn', 'วงซ้อน', (d, c) => { const T = ST(d), Rr = 215, Y = 42, X = { a: -150, b: 150 }, IX = { a: -238, b: 238 }, hy = f1(Math.sqrt(Rr * Rr - 150 * 150));
    art(c, p => { const H = Z.H, tb = tIn(d, 'b'), lens = `M 0 ${f1(Y - hy)} A ${Rr} ${Rr} 0 0 1 0 ${f1(Y + hy)} A ${Rr} ${Rr} 0 0 1 0 ${f1(Y - hy)} Z`;
      SIDES.forEach(s => { const x = X[s], t = tIn(d, s), dx = s === 'a' ? -280 : 280, lose = s === T.lose, win = s === T.win && !T.off, rg = lose ? dimG(p, H) : p, X_ = XS(d, s);
        const K = { px: x, py: Y, x: glide(dx, t, f3(t + tu(.32)), s === 'a' ? 12 : -12), o: fadeIn(t, .04) }, g = mvG(CL(rg), K);
        if (win) litOn(g, H).circle(x, Y, Rr - 12, { fill: TA(.16), sw: 0, stroke: 'none' });
        g.circle(x, Y, Rr, W(4.4)); if (win) litOn(g, H).circle(x, Y, Rr, { sw: 5, stroke: ACC1 });
        const mv = { px: IX[s], py: Y, x: K.x };
        if (X_ && picOf(X_)) put(p, c, { icon: X_.icon }, IX[s], Y, 172, null, { t: f3(t + tu(.2)), mv, o: lose ? dimK(H) : undefined, punch: win ? H : undefined });
        else if (X_) txt(g, X_.label, IX[s], Y + 14, { size: 48, maxW: 200, weight: 800, color: C.ink, wrap: 'mid' });
        tag(p, d, s, s === 'a' ? -14 : 14, Y - Rr - 78, { maxW: 380, anchor: s === 'a' ? 'end' : 'start', t: f3(t + tu(.3)) }); });
      const tc = f3(tb + tu(.32)), fl = sub(p); on(fl, p, 0, { o: flashK(tc, .12) }); fl.path(lens, { fill: TA(.22), sw: 0, stroke: 'none' }); ripple(p, 0, Y, 60, tc);
      if (!T.win) { const L = litOn(p, H); L.path(lens, { fill: TA(.24), sw: 3, stroke: ACC1 }); ripple(p, 0, Y, 80, f3(H + tu(.04))); }
      verdict(p, d, { a: [-302, Y - 152], b: [302, Y - 152] });
    }); });

  /* 08 ── RANK (สลับอันดับ): two wide rows slide in from the right one under the other (a on top) — each: icon box · its word big · its line of
     words (texts) or grey lines. On H, if the second side wins (change: always) the rows swap places along a curve, so the winner ends on top, lit */
  variant('rank', 'สลับอันดับ', (d, c) => { const T = ST(d), bs = 184, RW = 880, RH = 236, YT = -128, YB = 138, swap = T.win === 'b';
    art(c, p => { const H = Z.H; SIDES.forEach(s => { const top = s === (swap ? 'b' : 'a'), y = top ? YT : YB, y0 = s === 'a' ? YT : YB, t = tIn(d, s), off = f1(y0 - y), lose = s === T.lose, win = s === T.win && !T.off;
        const K = { px: 0, py: y, x: [[0, 620], [t, 620], [f3(t + tu(.3)), -14, 'out'], [f3(t + tu(.4)), 0, 'soft']].concat(off ? [[H, 0], [f3(H + tu(.16)), top ? -46 : 46, 'io'], [f3(H + tu(.34)), 0, 'soft']] : []),
          y: off ? [[0, off], [H, off], [f3(H + tu(.34)), 0, 'io']] : [[0, 0]], o: fadeIn(t, .04) };
        const g0 = mvG(CL(p), K); if (lose) R(g0, -RW / 2, y - RH / 2, RW, RH, 40, BK); const g = lose ? dimG(g0, H) : g0;
        R(g, -RW / 2, y - RH / 2, RW, RH, 40, F(3.4)); if (win) R(litOn(g, H), -RW / 2, y - RH / 2, RW, RH, 40, { fill: TA(.1), sw: 5, stroke: ACC1 });
        sbox(p, c, d, s, -RW / 2 + 26 + bs / 2, y, bs, { g, mv: K, t, noDim: true, noLit: true, io: lose ? dimK(H) : undefined });
        if (win) ripple(p, -RW / 2 + 26 + bs / 2, y, bs * .56, f3(H + tu(.36)));
        const wx = -RW / 2 + 60 + bs, hasW = !!LBL(XS(d, s)); if (hasW) word(p, d, s, wx, y - 22, { g, anchor: 'start', size: 54, wrap: null, maxW: 470, noDim: true, t: f3(t + tu(.2)) });
        note(p, d, s, wx, hasW ? y + 46 : y - 10, 470, { g, noDim: true, t: f3(t + tu(.26)) }); });
      verdict(p, d, { [swap ? 'b' : 'a']: [RW / 2 - 70, YT], [swap ? 'a' : 'b']: [RW / 2 - 70, YB] });
    }); });

  /* 09 ── DIAGONAL (ทแยงมุม): a seam draws corner to corner; a flies in from the top-left corner, b from the bottom-right, each lands in its half
     (bump + ripple), words beside them along the seam. On H the winner's half lights up */
  variant('diagonal', 'ทแยงมุม', (d, c) => { const T = ST(d), bs = 220, P = { a: [-300, -118], b: [300, 122] }, FR = { a: [[-700, -560], [-520, -300]], b: [[700, 560], [520, 300]] };
    art(c, p => { const H = Z.H; drawAt(p.line(-470, 282, 470, -282, { sw: 3, stroke: TL_(.5) }), p, tu(.02), tu(.36));
      SIDES.forEach(s => { const [x, y] = P[s], t = tIn(d, s), t1 = f3(t + tu(.32)), PK = pathK(FR[s].concat([[x, y]]), t, t1, [x, y]);
        const K = { px: x, py: y, x: PK.x, y: PK.y, s: [[0, .7], [t, .7], [t1, 1, 'out'], [f3(t1 + tu(.06)), 1.1, 'out'], [f3(t1 + tu(.2)), 1, 'soft']], o: fadeIn(t, .04) };
        sbox(p, c, d, s, x, y, bs, { g: mvG(CL(p), K), mv: K, t }); ripple(p, x, y, bs * .58, t1);
        tag(p, d, s, s === 'a' ? -168 : 168, s === 'a' ? -172 : 176, { anchor: s === 'a' ? 'start' : 'end', maxW: 260, t: f3(t1 + tu(.06)) }); });
      verdict(p, d, { a: corner(...P.a, bs, -1), b: corner(...P.b, bs) });
    }); });

  /* 10 ── GAUGE (หน้าปัดเข็ม): a half-dial draws over, the two boxes sit on its ends; the needle springs up, sweeps both ways while it weighs,
     and on H settles toward the winner (or the share of v) — the arc from the winner's end to the needle lights */
  variant('gauge', 'หน้าปัดเข็ม', (d, c) => { const T = ST(d), CX = 0, CY = 150, RG = 320, bs = 176, NL = 250;
    art(c, p => { const H = Z.H, pos = T.hasV && T.va !== T.vb ? f3(.1 + .8 * T.vb / (T.va + T.vb)) : T.win === 'a' ? .14 : T.win === 'b' ? .86 : .5, rf = f1(-90 + 180 * pos);
      const arcP = `M ${CX - RG} ${CY} A ${RG} ${RG} 0 0 1 ${CX + RG} ${CY}`; drawAt(p.path(arcP, { sw: 36 }), p, tu(.04), tu(.4)); drawAt(p.path(arcP, { sw: 28, stroke: C.fill }), p, tu(.04), tu(.4));
      for (let k = 1; k < 8; k++) { const a = rad(180 + k * 22.5); drawAt(p.line(f1(CX + (RG - 40) * Math.cos(a)), f1(CY + (RG - 40) * Math.sin(a)), f1(CX + (RG - 62) * Math.cos(a)), f1(CY + (RG - 62) * Math.sin(a)), { sw: 3, stroke: TL_(.5) }), p, f3(tu(.2 + .03 * k)), tu(.1)); }
      if (T.win && !T.off) { const a0 = T.win === 'a' ? 180 : 180 + 180 * pos, a1 = T.win === 'a' ? 180 + 180 * pos : 360, P = a => f1(CX + RG * Math.cos(rad(a))) + ' ' + f1(CY + RG * Math.sin(rad(a)));
        const la = p.path(`M ${P(a0)} A ${RG} ${RG} 0 0 1 ${P(a1)}`, { sw: 16, stroke: ACC1 }); on(la, p, 0, { draw: [[0, 0], [f3(H + tu(.1)), 0], [f3(H + tu(.4)), 1, 'out']] }); }
      SIDES.forEach(s => { const x = s === 'a' ? CX - RG : CX + RG; sbox(p, c, d, s, x, CY, bs); tag(p, d, s, s === 'a' ? CX - 50 : CX + 50, CY + 142, { anchor: s === 'a' ? 'end' : 'start', maxW: 360 }); });
      const t0 = tu(.5), q = k => f3(lerp(t0, H - tu(.1), k));
      const ng = mvG(p, { px: CX, py: CY, r: [[0, -90], [t0, -90], [q(.3), 55, 'io'], [q(.62), -48, 'io'], [q(1), 0, 'io'], [f3(H + tu(.2)), f1(rf + (rf > 0 ? 6 : rf < 0 ? -6 : 0)), 'out'], [f3(H + tu(.34)), rf, 'soft']], o: fadeIn(f3(tu(.42)), .06) });
      ng.path(`M ${CX - 13} ${CY} L ${CX} ${CY - NL} L ${CX + 13} ${CY} Z`, { fill: ACC1, sw: 2.4, stroke: ACC1 });
      p.circle(CX, CY, 34, F(3.6)); popAt(p, CX, CY, tu(.42)).circle(CX, CY, 12, { fill: ACC1, sw: 0, stroke: 'none' });
      verdict(p, d, { a: [CX - RG - 64, CY - 86], b: [CX + RG + 64, CY - 86] });
    }); });

  /* 11 ── SHARE (แถบแบ่งส่วน): one long bar draws open; the divider drops into the middle (dust); the two boxes drop above their halves with a
     dashed link down to the bar and the words sit in the halves. On H the divider slides to the share (v or the winner) — everything rides it */
  variant('share', 'แถบแบ่งส่วน', (d, c) => { const T = ST(d), BW = 900, BY = 128, BH = 160, bs = 196, BYB = -130, sa = Math.max(.3, Math.min(.7, T.amt('a') / (T.amt('a') + T.amt('b'))));
    art(c, p => { const H = Z.H, xd = f1(-BW / 2 + BW * sa), td = tu(.3), mid = s => s === 'a' ? (-BW / 2 + xd) / 2 : (xd + BW / 2) / 2, mid0 = s => s === 'a' ? -BW / 4 : BW / 4;
      R(mvG(p, { px: 0, py: BY, sx: [[0, .1], [tu(.04), .1], [tu(.36), 1.02, 'out'], [tu(.46), 1, 'soft']], o: fadeIn(tu(.04), .06) }), -BW / 2, BY - BH / 2, BW, BH, 50, F(3.6));
      const ride = (s, extra = {}) => Object.assign({ x: [[0, f1(mid0(s) - mid(s))], [H, f1(mid0(s) - mid(s))], [f3(H + tu(.4)), 0, 'out']] }, extra);
      SIDES.forEach(s => { const lose = s === T.lose, win = s === T.win && !T.off, x0 = s === 'a' ? -BW / 2 + 10 : xd + 4, w = s === 'a' ? xd - 4 - x0 : BW / 2 - 10 - x0, rg = lose ? dimG(p, H) : p;
        if (win) { const sx0 = f3((BW / 2 - 14) / w); R(mvG(litOn(rg, H), { px: s === 'a' ? x0 : x0 + w, py: BY, sx: [[0, sx0], [H, sx0], [f3(H + tu(.4)), 1, 'out']] }), x0, BY - BH / 2 + 10, w, BH - 20, 42, { fill: TA(.26), sw: 0, stroke: 'none' }); }
        const t = tIn(d, s), m = mid(s), K = rideY(fallK(m, BYB + bs / 2, t, f3(t + tu(.26)), 330), 0, H); Object.assign(K, ride(s, {}));
        drawAt(mvG(rg, ride(s)).path(`M ${m} ${BYB + bs / 2 + 8} L ${m} ${BY - BH / 2 - 8}`, DASH(.55)), p, f3(t + tu(.3)), tu(.16));
        sbox(p, c, d, s, m, BYB, bs, { g: mvG(CL(p), K), mv: K, t }); dust(p, m, BYB + bs / 2, f3(t + tu(.26)), .9);
        word(p, d, s, m, BY + 16, { g: mvG(p, ride(s)), size: 48, maxW: f1(w - 50), t: f3(t + tu(.3)) }); });
      const dg = mvG(CL(p), Object.assign(fallK(xd, BY + BH / 2 + 14, td, f3(td + tu(.24)), 420), { x: [[0, f1(-xd)], [H, f1(-xd)], [f3(H + tu(.4)), 0, 'out']] }));
      R(dg, xd - 9, BY - BH / 2 - 14, 18, BH + 28, 9, { fill: ACC1, sw: 2, stroke: ACC1 });
      verdict(p, d, { a: corner(mid('a'), BYB, bs, -1), b: corner(mid('b'), BYB, bs) });
    }); });

  /* 12 ── BUBBLES (ฟองขนาด): two bubbles blow up to the same size; on H each swells or shrinks to its amount (the bigger / winner bounces);
     a's word above-left, b's below-right */
  variant('bubbles', 'ฟองขนาด', (d, c) => { const T = ST(d), Y = 15, X = { a: -238, b: 238 }, rOf = s => f1(100 + 100 * T.amt(s)), r0 = 145;
    art(c, p => { const H = Z.H; SIDES.forEach(s => { const x = X[s], r = rOf(s), t = tIn(d, s), late = T.change && s === 'b', k0 = T.change ? 1 : f3(r0 / r), lose = s === T.lose, win = s === T.win && !T.off, X_ = XS(d, s);
        const SK = (late ? [[0, .1], [t, .1], [H, 1.08, 'out'], [f3(H + tu(.14)), 1, 'soft']] : [[0, .1], [t, .1], [f3(t + tu(.3)), f3(k0 * 1.06), 'out'], [f3(t + tu(.42)), k0, 'soft']])
          .concat(T.change ? [] : [[H, k0], [f3(H + tu(.32)), f3(1.05), 'out'], [f3(H + tu(.46)), 1, 'soft']]);
        const K = { px: x, py: Y, s: SK, o: fadeIn(t, .04) }, g0 = mvG(p, K); if (lose) g0.circle(x, Y, r, BK); const g = lose ? dimG(g0, H) : g0;
        g.circle(x, Y, r, F(4.2)); g.circle(x, Y, r - 14, SL(1.4)); if (win) { const L = litOn(g, H); L.circle(x, Y, r, LIT2()); ripple(p, x, Y, r * 1.08, f3(H + tu(.2))); }
        if (X_ && picOf(X_)) put(p, c, { icon: X_.icon }, x, Y, f1(r * 1.36), null, { t: f3(t + tu(.06)), mv: K, o: lose ? dimK(H) : undefined });
        else if (X_) txt(g, X_.label, x, Y + 16, { size: 48, maxW: r * 1.4, weight: 800, color: C.ink, wrap: 'mid' }); else g.circle(x, Y, 18, { fill: ACC1, sw: 0, stroke: 'none' });
        tag(p, d, s, x, s === 'a' ? -256 : 285, { maxW: 360 }); });
      verdict(p, d, { a: [f1(X.a + rOf('a') * .74), f1(Y - rOf('a') * .74)], b: [f1(X.b + rOf('b') * .74), f1(Y - rOf('b') * .74)] });
    }); });

  /* 13 ── PATH (เส้นทางจุด): node a (bottom-left) and node b (top-right) pop in; a dotted curve between them fills in dot by dot; a lit token
     travels it — change: from a to b, landing on H; versus: from the middle to the winner (no winner: two tokens split to both) */
  variant('path', 'เส้นทางจุด', (d, c) => { const T = ST(d), bs = 220, A = [-330, 172], B = [330, -112];
    art(c, p => { const H = Z.H, bz = u => { const P0 = [A[0] + 100, A[1]], P1 = [-30, A[1]], P2 = [30, B[1]], P3 = [B[0] - 100, B[1]], m = 1 - u;
        return [0, 1].map(i => f1(m * m * m * P0[i] + 3 * m * m * u * P1[i] + 3 * m * u * u * P2[i] + u * u * u * P3[i])); }, N = 15;
      for (let k = 0; k <= N; k++) { const [x, y] = bz(k / N); popAt(p, x, y, f3(tu(.36 + .025 * k))).circle(x, y, 7, { fill: TL_(.5), sw: 0, stroke: 'none' }); }
      SIDES.forEach(s => { const [x, y] = s === 'a' ? A : B; sbox(p, c, d, s, x, y, bs, { shape: 'circ', t: tIn(d, s) }); tag(p, d, s, s === 'a' ? -462 : 462, s === 'a' ? y - bs / 2 - 76 : y + bs / 2 + 76, { maxW: s === 'a' ? 380 : 320, anchor: s === 'a' ? 'start' : 'end' }); });
      const tok = (u0, u1, t0, t1) => { const L = Array.from({ length: 13 }, (_, k) => bz(lerp(u0, u1, k / 12))), fin = L[12], K = pathK(L, t0, t1, fin);
        const g = mvG(p, { px: fin[0], py: fin[1], x: K.x, y: K.y, o: [[0, 0], [t0, 0], [f3(t0 + tu(.05)), 1], [t1, 1], [f3(t1 + tu(.08)), 0]] }); g.circle(fin[0], fin[1], 22, { fill: ACC1, sw: 3, stroke: ACC1 }); ripple(p, fin[0], fin[1], 60, t1); };
      const t0 = T.change ? f3(Math.max(tu(.8), H - tu(.75))) : f3(Math.max(tu(.85), H - tu(.6))), e0 = .02, e1 = .98;
      if (T.change || T.win === 'b') tok(T.change ? e0 : .5, e1, t0, H); else if (T.win === 'a') tok(.5, e0, t0, H); else { tok(.5, e0, t0, H); tok(.5, e1, t0, H); }
      if (!T.change) popAt(p, ...bz(.5), f3(t0 - tu(.2))).circle(...bz(.5), 14, { fill: TL_(.7), sw: 0, stroke: 'none' });
      verdict(p, d, { a: [A[0] + 74, A[1] - 74], b: [B[0] + 74, B[1] - 74] });
    }); });

  /* 14 ── CARDS (การ์ดคู่เอียง): two tall cards drop in one after the other, tilted apart — each: its word as a header, its icon box, its line
     of words (texts) or grey lines. On H the loser leans back on its foot and fades, the winner straightens and lights */
  variant('cards', 'การ์ดคู่เอียง', (d, c) => { const T = ST(d), CWd = 362, CHt = 504, CY = 18, X = { a: -206, b: 206 }, bs = 196;
    art(c, p => { const H = Z.H; SIDES.forEach(s => { const x = X[s], sd = s === 'a' ? -1 : 1, a0 = sd * 4, lose = s === T.lose, win = s === T.win && !T.off, aF = lose ? sd * 10 : win ? 0 : a0;
        const t = tIn(d, s), t1 = f3(t + tu(.28)), K = fallK(x, CY + CHt / 2, t, t1, 640); K.r = [[0, a0], [H, a0], [f3(H + tu(.28)), f1(aF + (aF - a0) * .15), 'out'], [f3(H + tu(.42)), aF, 'soft']];
        const g0 = mvG(CL(p), K); if (lose) R(g0, x - CWd / 2, CY - CHt / 2, CWd, CHt, 40, BK); const g = lose ? dimG(g0, H) : g0;
        R(g, x - CWd / 2, CY - CHt / 2, CWd, CHt, 40, F(4)); if (win) R(litOn(g, H), x - CWd / 2, CY - CHt / 2, CWd, CHt, 40, LIT2());
        dust(p, x, CY + CHt / 2, t1, 1.1);
        const hasW = !!LBL(XS(d, s)), iy = hasW ? CY - 22 : CY - 60; if (hasW) word(p, d, s, x, CY - CHt / 2 + 74, { g, size: 50, maxW: CWd - 50, wrap: null, noDim: true, t: f3(t1 + tu(.04)) });
        sbox(p, c, d, s, x, iy, bs, { g, mv: K, t, noDim: true, noLit: true, io: lose ? dimK(H) : undefined }); if (win) ripple(p, x, iy, bs * .6, f3(H + tu(.1)));
        note(p, d, s, x, iy + bs / 2 + 54, CWd - 70, { g, anchor: 'middle', noDim: true, t: f3(t1 + tu(.1)) }); });
      const top = s => { const sd = s === 'a' ? -1 : 1, aF = s === T.lose ? sd * 10 : s === T.win ? 0 : sd * 4; return rotP(X[s] + sd * (CWd / 2 - 10), CY - CHt / 2 + 10, X[s], CY + CHt / 2, aF); };
      verdict(p, d, { a: top('a'), b: top('b') });
    }); });

  /* 15 ── TABS (แท็บสลับ): a tab bar (the two words) and a panel below; the panel shows a — its icon box and its line of words — then the other
     tab is tried, and on H the bar settles on the winner (change: flips to the after): that tab lights, the panel shows it, the other tab fades */
  variant('tabs', 'แท็บสลับ', (d, c) => { const T = ST(d), fin = T.win || 'b', TBY = -238, TX = { a: -212, b: 212 }, TWd = 400, THt = 100, PY0 = -158, PH_ = 420, bs = 230, BX = -222, BYp = PY0 + PH_ / 2;
    art(c, p => { const H = Z.H, tA = tu(.32), tB = f3(Math.max(tu(.85), H - tu(.75)));
      const ph = T.change ? [[tA, 'a'], [H, 'b']] : fin === 'a' ? [[tA, 'a'], [tB, 'b'], [H, 'a']] : [[tA, 'a'], [tB, 'b'], [H, 'b']];
      const vis = s => { const K = [[0, 0]]; ph.forEach(([t, w], i) => { const on1 = w === s, prev = i ? ph[i - 1][1] === s : false; if (on1 && !prev) K.push([f3(t), 0], [f3(t + tu(.1)), 1]); if (!on1 && prev) K.push([f3(t), 1], [f3(t + tu(.08)), 0]); }); return K; };
      R(mvG(p, upK(0, PY0 + PH_, tu(.1), .3)), -440, PY0, 880, PH_, 40, F(3.6));
      const bx = popAt(p, BX, BYp, tu(.26)); R(bx, BX - bs / 2, BYp - bs / 2, bs, bs, bs * .24, F(4)); if (!T.off) { R(litOn(bx, H), BX - bs / 2, BYp - bs / 2, bs, bs, bs * .24, LIT2()); ripple(p, BX, BYp, bs * .58, f3(H + tu(.04))); }
      SIDES.forEach((s, i) => { const x = TX[s], t = f3(tu(.04 + .08 * i)), g0 = mvG(p, { x: glide(s === 'a' ? -120 : 120, t, f3(t + tu(.26))), o: fadeIn(t, .05) }), lose = s === T.lose, X_ = XS(d, s);
        if (lose) R(g0, x - TWd / 2, TBY - THt / 2, TWd, THt, THt / 2, BK); const g = lose ? dimG(g0, H) : g0; R(g, x - TWd / 2, TBY - THt / 2, TWd, THt, THt / 2, F(3.4));
        const lt = sub(g); on(lt, p, 0, { o: vis(s) }); R(lt, x - TWd / 2 + 8, TBY - THt / 2 + 8, TWd - 16, THt - 16, (THt - 16) / 2, { fill: TA(.22), sw: 0, stroke: 'none' });
        if (s === fin && !T.off) R(litOn(g, H), x - TWd / 2, TBY - THt / 2, TWd, THt, THt / 2, { sw: 5, stroke: ACC1 });
        if (X_ && X_.label) txt(g, X_.label, x, TBY + 17, { size: 46, maxW: TWd - 56, weight: 800, color: C.ink }); else R(g, x - 90, TBY - 11, 180, 22, 11, GREY());
        /* this side's page in the panel */
        const pg = sub(p); on(pg, p, 0, { o: vis(s) }); const io = vis(s);
        if (X_ && picOf(X_)) put(p, c, { icon: X_.icon }, BX, BYp, bs * .72, null, { t: tA, o: io, punch: s === fin && !T.off ? H : undefined });
        else txt(pg, X_ ? X_.label : '', BX, BYp + 18, { size: 54, maxW: bs * .86, weight: 800, color: C.ink, wrap: 'mid' });
        note(p, d, s, -60, BYp - 20, 450, { g: pg, t: 0, noDim: true, size: 48 }); });
      verdict(p, d, { a: [TX.a + TWd / 2 - 20, TBY - 30], b: [TX.b + TWd / 2 - 20, TBY - 30] });
    }); });

  /* 16 ── FOCUS (กรอบโฟกัส): four corner marks open around both boxes, then hunt — to a, to b — and on H lock tight on the winner (change: they
     travel from a to b and lock there; no winner: they settle round both), turning to the accent */
  variant('focus', 'กรอบโฟกัส', (d, c) => { const T = ST(d), bs = 230, Y = 82, X = { a: -230, b: 230 }, AL = 50;
    art(c, p => { const H = Z.H, both = [0, Y, 412, 170], on1 = (s, k = 0) => [X[s], Y, bs / 2 + 30 - k, bs / 2 + 30 - k], fin = T.win ? on1(T.win, 12) : both;
      const t0 = tu(.68), q = k => f3(lerp(t0, H - tu(.26), k));
      const seq = T.change ? [[t0, on1('a')], [H, fin]] : [[t0, both], [q(.4), on1('a')], [q(1), on1('b')], [H, fin]];
      SIDES.forEach(s => { sbox(p, c, d, s, X[s], Y, bs); word(p, d, s, X[s], Y - bs / 2 - 44, { size: 50, maxW: 330, wrap: null }); });
      [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sy]) => { const at = r => [r[0] + sx * r[2], r[1] + sy * r[3]], F_ = at(fin), kx = [], ky = [];
        seq.forEach(([t, r], i) => { const [x, y] = at(r); if (!i) { kx.push([0, x], [t, x]); ky.push([0, y], [t, y]); } else { const ta = f3(t - tu(.24)); kx.push([ta, kx[kx.length - 1][1]], [f3(t), x]); ky.push([ta, ky[ky.length - 1][1]], [f3(t), y]); } });
        const g = mvG(p, { x: offK(kx, F_[0]), y: offK(ky, F_[1]), o: fadeIn(t0, .06), s: [[0, 1], [H, 1], [f3(H + tu(.08)), 1.15, 'out'], [f3(H + tu(.24)), 1, 'soft']], px: F_[0], py: F_[1] });
        const dd = `M ${F_[0]} ${F_[1] - sy * AL} L ${F_[0]} ${F_[1]} L ${F_[0] - sx * AL} ${F_[1]}`; g.path(dd, { sw: 7, stroke: TL_(.75) }); if (!T.off) litOn(g, H).path(dd, { sw: 8, stroke: ACC1 }); });
      ripple(p, fin[0], fin[1], Math.min(fin[2], 200), f3(H + tu(.06)));
      verdict(p, d, { a: corner(X.a, Y, bs, -1), b: corner(X.b, Y, bs) });
    }); });

  /* 17 ── ORBIT (โคจรสลับ): the two plates pop in face to face, then circle each other once round the middle; on H they part — the winner grows
     big in front, the loser shrinks off to the side and fades (no winner: they settle side by side). Words pop where they settle */
  variant('orbit', 'โคจรสลับ', (d, c) => { const T = ST(d), CY = 20, RO = 200, s0 = 230;
    art(c, p => { const H = Z.H, FP = T.win ? { [T.win]: [110, CY, 280], [T.lose]: [-300, CY - 70, 180] } : { a: [-RO, CY, s0], b: [RO, CY, s0] };
      const tO0 = f3(Math.max(tIn(d, 'b') + tu(.3), tu(.8))), tO1 = f3(H - tu(.04));
      SIDES.forEach(s => { const [fx, fy, fs] = FP[s], a0 = s === 'a' ? 180 : 0, L = Array.from({ length: 25 }, (_, k) => [f1(RO * Math.cos(rad(a0 + 360 * k / 24))), f1(CY + RO * Math.sin(rad(a0 + 360 * k / 24)))]);
        const P = pathK(L, tO0, tO1, [fx, fy]), k0 = f3(s0 / fs), t = tIn(d, s), ta = f3(H + tu(.34));
        P.x.push([ta, 0, 'out']); P.y.push([ta, 0, 'out']);
        const K = { px: fx, py: fy, x: P.x, y: P.y, s: [[0, f3(k0 * .3)], [t, f3(k0 * .3)], [f3(t + tu(.22)), f3(k0 * 1.06), 'out'], [f3(t + tu(.34)), k0, 'soft'], [H, k0], [ta, 1, 'out']], o: fadeIn(t, .04) };
        sbox(p, c, d, s, fx, fy, fs, { shape: 'circ', g: mvG(p, K), mv: K, t, rip: false, dimAt: H });
        const up = !T.win || s === T.win; tag(p, d, s, fx, up ? fy - fs / 2 - 72 : fy + fs / 2 + 70, { t: f3(ta + tu(.02)), maxW: s === T.lose ? 240 : 320 }); });
      if (T.win && !T.off) ripple(p, FP[T.win][0], FP[T.win][1], 170, f3(H + tu(.36)));
      verdict(p, d, { a: [f1(FP.a[0] + FP.a[2] * .36), f1(FP.a[1] - FP.a[2] * .36)], b: [f1(FP.b[0] + FP.b[2] * .36), f1(FP.b[1] - FP.b[2] * .36)] });
    }); });

  /* 18 ── CLASH (ปะทะ): the boxes slide in from both edges, wait, then rush at each other and collide in the middle (a spark burst), bounce
     back; on H the winner shoves forward and the loser is knocked back, tilting and fading. Words ride above them */
  variant('clash', 'ปะทะ', (d, c) => { const T = ST(d), bs = 220, Y = 70, FX = T.win === 'a' ? { a: -40, b: 330 } : T.win === 'b' ? { a: -330, b: 40 } : { a: -170, b: 170 };
    art(c, p => { const H = Z.H, tC = f3(Math.max(tIn(d, 'b') + tu(.42), H - tu(.55)));
      SIDES.forEach(s => { const sd = s === 'a' ? -1 : 1, t = tIn(d, s), fx = FX[s], lose = s === T.lose;
        const pts = [[0, sd * 660], [t, sd * 660], [f3(t + tu(.3)), sd * 280], [f3(tC - tu(.16)), sd * 280], [tC, sd * 113], [f3(tC + tu(.2)), sd * 176], [H, sd * 176], [f3(H + tu(.3)), fx]];
        const KX = pts.map(([u, v], i) => i === 1 || !i ? [f3(u), f1(v - fx)] : [f3(u), f1(v - fx), i === 4 ? 'in' : 'out']);
        const K = { px: fx, py: Y + bs / 2, x: KX, o: fadeIn(t, .04) }; if (lose) K.r = [[0, 0], [H, 0], [f3(H + tu(.3)), sd * 11, 'out'], [f3(H + tu(.44)), sd * 8, 'soft']];
        sbox(p, c, d, s, fx, Y, bs, { g: mvG(CL(p), K), mv: K, t });
        word(p, d, s, fx, Y - bs / 2 - 70, { g: mvG(CL(p), { x: KX }), size: 50, maxW: 210, t: f3(t + tu(.3)) }); });
      sparkAt(p, 0, Y, 40, 92, tC, 8, 0); ripple(p, 0, Y, 80, tC);
      if (T.win) sparkAt(p, T.win === 'a' ? 70 : -70, Y, 36, 80, f3(H + tu(.1)), 8, 22.5);
      verdict(p, d, { a: corner(FX.a, Y, bs, -1), b: corner(FX.b, Y, bs) });
    }); });

  /* 19 ── HEX (หกเหลี่ยมประกบ): a spins in, b flies up from the bottom-right corner and clicks onto its edge (a jolts, a ripple at the seam);
     the words sit in the open corners. On H the winner's cell lights, the loser's fades */
  variant('hex', 'หกเหลี่ยมประกบ', (d, c) => { const T = ST(d), sz = 276, P = { a: [-124, -107], b: [124, 107] };
    art(c, p => { const H = Z.H, tb = tIn(d, 'b'), t1 = f3(tb + tu(.32));
      const KA = spinK(...P.a, tIn(d, 'a')); sbox(p, c, d, 'a', ...P.a, sz, { shape: 'hex', g: mvG(mvG(p, KA), { px: P.a[0], py: P.a[1], x: buzzK(t1, 8) }), mv: KA });
      const PK = pathK([[640, 560], [430, 300], P.b], tb, t1, P.b), KB = { px: P.b[0], py: P.b[1], x: PK.x, y: PK.y, s: [[0, .7], [tb, .7], [t1, 1, 'out']], o: fadeIn(tb, .04) };
      sbox(p, c, d, 'b', ...P.b, sz, { shape: 'hex', g: mvG(CL(p), KB), mv: KB }); ripple(p, 0, 0, 60, t1); sparkAt(p, 0, 0, 26, 58, t1, 6, 30);
      tag(p, d, 'a', 52, -168, { anchor: 'start', maxW: 340 }); tag(p, d, 'b', -52, 172, { anchor: 'end', maxW: 340, t: f3(t1 + tu(.06)) });
      verdict(p, d, { a: [-243, -176], b: [243, 176] });
    }); });

  /* 20 ── DOTS (จุดคะแนน): a box drops onto each side, a grid of twelve dots pops in under it in a wave, then the dots light one by one — both
     sides to the same count — and on H the winner's run on (the loser's stop). The word sits at the foot */
  variant('dots', 'จุดคะแนน', (d, c) => { const T = ST(d), bs = 200, BY = -146, X = { a: -235, b: 235 }, nOf = s => Math.max(1, Math.min(12, Math.round(T.amt(s) * 12))), ne = Math.min(nOf('a'), nOf('b'));
    art(c, p => { const H = Z.H; SIDES.forEach(s => { const x = X[s], t = tIn(d, s), t1 = f3(t + tu(.26)), n = nOf(s), rg = s === T.lose ? dimG(p, H) : p, late = T.change && s === 'b';
        const K = fallK(x, BY + bs / 2, t, t1, 360); sbox(p, c, d, s, x, BY, bs, { g: mvG(CL(p), K), mv: K, t }); dust(p, x, BY + bs / 2, t1, 1);
        const lt = k => T.change ? (s === 'a' ? f3(lerp(t1 + tu(.3), t1 + tu(.7), k / Math.max(1, n - 1))) : f3(lerp(t1 + tu(.06), H, k / Math.max(1, n - 1))))
          : k < ne ? f3(lerp(Math.max(t1 + tu(.3), tu(.95)), H - tu(.12), ne > 1 ? k / (ne - 1) : 1)) : f3(lerp(H, H + tu(.3), (k - ne + 1) / Math.max(1, n - ne)));
        for (let k = 0; k < 12; k++) { const dx = f1(x + (k % 4 - 1.5) * 64), dy = f1(26 + Math.floor(k / 4) * 64), tp = late ? f3(t1 + tu(.01 * k)) : f3(t1 + tu(.1 + .025 * k));
          popAt(rg, dx, dy, tp).circle(dx, dy, 24, SL(2.4)); if (k < n) popAt(rg, dx, dy, lt(k)).circle(dx, dy, 18, { fill: ACC1, sw: 0, stroke: 'none' }); }
        tag(p, d, s, x, 262, { maxW: 360, t: f3(t1 + tu(.08)) }); });
      verdict(p, d, { a: corner(X.a, BY, bs, -1), b: corner(X.b, BY, bs) });
    }); });

  /* 21 ── REVEAL (เปิดฝา): two covered slots drop in (dust); the first cover lifts off (the loser / a), then on H the second lifts to show the
     winner (change: the after) — it lights; words appear above as each is shown */
  variant('reveal', 'เปิดฝา', (d, c) => { const T = ST(d), bs = 240, Y = 62, X = { a: -238, b: 238 }, last = T.win || 'b';
    art(c, p => { const H = Z.H, rv = { [OTH(last)]: f3(Math.max(tu(.7), H - tu(.85))), [last]: H };
      SIDES.forEach((s, i) => { const x = X[s], t = f3(tu(.06 + .12 * i)), t1 = f3(t + tu(.26)), r = rv[s], cs = bs + 18;
        sbox(p, c, d, s, x, Y, bs, { t: f3(t1 - tu(.02)), ti: f3(r + tu(.24)) });
        const K = Object.assign(fallK(x, Y + cs / 2, t, t1, 380), {}); K.y = K.y.concat([[r, 0], [f3(r + tu(.06)), 14, 'out'], [f3(r + tu(.34)), -480, 'in']]); K.r = [[0, 0], [r, 0], [f3(r + tu(.34)), (s === 'a' ? -1 : 1) * 14, 'in']];
        K.o = K.o.concat([[f3(r + tu(.24)), 1], [f3(r + tu(.34)), 0]]); const cg = mvG(CL(p), K);
        R(cg, x - cs / 2, Y - cs / 2, cs, cs, cs * .24, F(4.4)); R(cg, x - cs / 2 + 22, Y - cs / 2 + 22, cs - 44, cs - 44, cs * .18, DASH(.45)); cg.circle(x, Y, 22, { fill: TL_(.5), sw: 0, stroke: 'none' });
        dust(p, x, Y + cs / 2, t1, 1.1); ripple(p, x, Y, bs * .56, f3(r + tu(.1)));
        word(p, d, s, x, Y - bs / 2 - 46, { size: 50, maxW: 380, wrap: null, t: f3(r + tu(.16)) }); });
      verdict(p, d, { a: corner(X.a, Y, bs, -1), b: corner(X.b, Y, bs) });
    }); });

  /* 22 ── PIE (วงแบ่งส่วน): a circle draws round; a's icon sits in it, then b's wedge sweeps open from the top to half; on H the edge swings to
     the share (v or the winner) and the winner's wedge lights — the icons ride to the middle of their wedges */
  variant('pie', 'วงแบ่งส่วน', (d, c) => { const T = ST(d), CX = 0, CY = 22, RP = 226, RI = 120, sb = Math.max(.3, Math.min(.7, T.amt('b') / (T.amt('a') + T.amt('b'))));
    art(c, p => { const H = Z.H, tA = tIn(d, 'a'), ts0 = f3(Math.max(tIn(d, 'b'), tu(.42))), ts1 = f3(ts0 + tu(.36)), phF = -90 + 360 * sb;
      const PT = (a, r = RP) => [f1(CX + r * Math.cos(rad(a))), f1(CY + r * Math.sin(rad(a)))], wedge = (a0, a1) => a1 - a0 < .5 ? `M ${CX} ${CY}` : `M ${CX} ${CY} L ${PT(a0).join(' ')} A ${RP} ${RP} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${PT(a1).join(' ')} Z`;
      const phi = u => u <= ts0 ? -90 : u < ts1 ? -90 + 180 * sm((u - ts0) / (ts1 - ts0)) : u <= H ? 90 : u < H + tu(.4) ? 90 + (phF - 90) * eOut((u - H) / tu(.4)) : phF;
      const st = s => s === T.win && !T.off ? { fill: TA(.16), sw: 3, stroke: ACC1 } : { fill: TL_(.05), sw: 3, stroke: C.soft };
      const wa = (T.lose === 'a' ? dimG(p, H) : p).path(wedge(90, 270), st('a')), wb = (T.lose === 'b' ? dimG(p, H) : p).path(wedge(-90, -90), st('b'));
      on(wa, p, 0, { o: fadeIn(tA, .1) }); on(wb, p, 0, { o: fadeIn(ts0, .02) });
      HOOKS.push(t => { const u = rel(p, t), f = phi(u); wa.setAttribute('d', wedge(f, 270)); wb.setAttribute('d', wedge(-90, f)); });
      drawAt(p.circle(CX, CY, RP, W(4.6)), p, tu(.02), tu(.36)); popAt(p, CX, CY, tu(.3)).circle(CX, CY, 14, { fill: ACC1, sw: 0, stroke: 'none' });
      SIDES.forEach(s => { const m0 = s === 'a' ? 180 : 0, mF = s === 'a' ? (phF + 270) / 2 : (phF - 90) / 2, [x0, y0] = PT(m0, RI), [x, y] = PT(mF, RI), X_ = XS(d, s), lose = s === T.lose;
        const t = s === 'a' ? f3(tA + tu(.14)) : ts1, K = { px: x, py: y, x: [[0, f1(x0 - x)], [H, f1(x0 - x)], [f3(H + tu(.4)), 0, 'out']], y: [[0, f1(y0 - y)], [H, f1(y0 - y)], [f3(H + tu(.4)), 0, 'out']] };
        if (X_ && picOf(X_)) put(p, c, { icon: X_.icon }, x, y, 168, null, { t, mv: K, o: lose ? dimK(H) : undefined, punch: s === T.win && !T.off ? f3(H + tu(.4)) : undefined });
        else { const g = mvG(lose ? dimG(p, H) : p, Object.assign({ o: fadeIn(t) }, K)); if (X_) txt(g, X_.label, x, y + 14, { size: 46, maxW: 190, weight: 800, color: C.ink, wrap: 'mid' }); else g.circle(x, y, 16, { fill: ACC1, sw: 0, stroke: 'none' }); }
        tag(p, d, s, s === 'a' ? -470 : 470, s === 'a' ? -256 : 290, { maxW: 380, anchor: s === 'a' ? 'start' : 'end', t: f3(t + tu(.1)) }); });
      if (T.win && !T.off) { const m = T.win === 'a' ? (phF + 270) / 2 : (phF - 90) / 2; ripple(p, ...PT(m, RI), 110, f3(H + tu(.42))); }
      const vm = s => PT(s === 'a' ? (phF + 270) / 2 : (phF - 90) / 2, RP + 14); verdict(p, d, { a: vm('a'), b: vm('b') });
    }); });

  /* 23 ── RACE (เลนแข่ง): two lanes; each box slides in to the start, then both run up the lanes neck and neck; on H the winner surges to its
     mark (v / the winner) by the dashed finish and the loser falls back and fades. Each word rides behind its box */
  variant('race', 'เลนแข่ง', (d, c) => { const T = ST(d), bs = 176, Y = { a: -122, b: 150 }, XS0 = -350, xF = s => f1(-150 + 470 * T.amt(s)), xE = f1(-150 + 470 * Math.min(T.amt('a'), T.amt('b')) * .86);
    art(c, p => { const H = Z.H; SIDES.forEach((s, i) => { const y = Y[s], t = tIn(d, s), fx = xF(s), late = T.change && s === 'b', ts = f3(t + tu(.3));
        const LK = { px: -460, py: y, sx: [[0, 0], [f3(tu(.04 + .08 * i)), 0], [f3(tu(.36 + .08 * i)), 1, 'out']], o: fadeIn(f3(tu(.04 + .08 * i)), .05) };
        if (s === T.lose) R(mvG(p, LK), -460, y - 106, 920, 212, 106, BK); const rg = s === T.lose ? dimG(p, H) : p; R(mvG(rg, LK), -460, y - 106, 920, 212, 106, F(2.8));
        drawAt(rg.line(424, y - 70, 424, y + 70, DASH(.55)), p, tu(.3), tu(.2));
        if (s === T.win && !T.off) R(litOn(rg, H), -460, y - 106, 920, 212, 106, { sw: 5, stroke: ACC1 });
        const run = T.change ? (s === 'a' ? [[f3(ts + tu(.1)), XS0], [f3(ts + tu(.6)), fx]] : [[ts, XS0], [H, fx]]) : [[f3(Math.max(ts + tu(.1), tu(.8))), XS0], [f3(H - tu(.05)), xE], [f3(H + tu(.32)), fx]];
        const pts = [[0, -680], [t, -680], [ts, XS0]].concat(run), KX = pts.map(([u, v], k) => k < 2 ? [f3(u), f1(v - fx)] : [f3(u), f1(v - fx), k === 2 || k === pts.length - 1 ? 'out' : 'io']);
        const K = { px: fx, py: y, x: KX, o: fadeIn(t, .04) }; sbox(p, c, d, s, fx, y, bs, { g: mvG(CL(p), K), mv: K, t });
        tag(p, d, s, fx - bs / 2 - 18, y, { g: mvG(CL(p), { x: KX }), anchor: 'end', size: 46, maxW: Math.min(380, f1(fx - bs / 2 - 18 + 440 - 60)), t: f3(ts + tu(.04)) });
        if (!T.win || s === T.win) ripple(p, fx + bs / 2, y, 50, late || T.change ? KX[KX.length - 1][0] : f3(H + tu(.32))); });
      verdict(p, d, { a: corner(xF('a'), Y.a, bs), b: corner(xF('b'), Y.b, bs) });
    }); });

  /* 24 ── SIGN (เครื่องหมายเทียบ): the boxes rise in; between them two bars slide in from the sides and click into "=" (they shiver while it is
     weighed); on H they swing into ">" or "<" toward the winner / the bigger (change: they fold into an arrow → b); no winner, no v → stays "=" */
  variant('sign', 'เครื่องหมายเทียบ', (d, c) => { const T = ST(d), bs = 250, Y = 44, X = { a: -282, b: 282 }, BL = 150, BHt = 28;
    art(c, p => { const H = Z.H, big = T.big, tg = { top: [0, -26, 0, 1], bot: [0, 26, 0, 1] };
      if (T.change) { tg.top = [40, -22, 38, .58]; tg.bot = [40, 22, -38, .58]; } else if (big) { const sg = big === 'a' ? 1 : -1; tg.top = [0, -24, sg * 22, 1]; tg.bot = [0, 24, -sg * 22, 1]; }
      SIDES.forEach(s => { const x = X[s], t = tIn(d, s), K = { px: x, py: Y + bs / 2, y: [[0, 300], [t, 300], [f3(t + tu(.3)), -12, 'out'], [f3(t + tu(.42)), 0, 'soft']], o: fadeIn(t, .04) };
        sbox(p, c, d, s, x, Y, bs, { g: mvG(CL(p), K), mv: K, t }); tag(p, d, s, x, Y - bs / 2 - 74, { maxW: 340, t: f3(t + tu(.3)) }); });
      const ti = f3(Math.max(tIn(d, 'b') + tu(.2), tu(.55))), tw0 = f3(Math.max(ti + tu(.4), H - tu(.5)));
      ['top', 'bot'].forEach((n, i) => { const y0 = Y + (i ? 26 : -26), [tx, ty, tr, ts] = tg[n], sd = i ? 1 : -1;
        const K = { px: 0, py: y0, x: [[0, sd * 420], [ti, sd * 420], [f3(ti + tu(.26)), 0, 'out']].concat([[H, 0], [f3(H + tu(.26)), tx, 'out']]), y: [[0, 0], [H, 0], [f3(H + tu(.26)), f1(Y + ty - y0), 'out']],
          r: wob(tw0, f3(H - tu(.02)), 3, 5).concat([[f3(H + tu(.26)), f1(tr * 1.12), 'out'], [f3(H + tu(.4)), tr, 'soft']]), s: [[0, 1], [H, 1], [f3(H + tu(.26)), ts, 'out']], o: fadeIn(ti, .04) };
        const g = mvG(CL(p), K); R(g, -BL / 2, y0 - BHt / 2, BL, BHt, BHt / 2, F(3.6)); if (!T.off) R(litOn(g, H), -BL / 2, y0 - BHt / 2, BL, BHt, BHt / 2, { fill: ACC1, sw: 3, stroke: ACC1 }); });
      if (T.change) { const g = mvG(p, { px: -30, py: Y, sx: [[0, 0], [H, 0], [f3(H + tu(.26)), 1, 'out']], o: fadeIn(H, .02) }); R(g, -96, Y - BHt / 2, 132, BHt, BHt / 2, { fill: ACC1, sw: 3, stroke: ACC1 }); }
      sparkAt(p, 0, Y, 70, 104, f3(ti + tu(.26)), 6, 30, [0, 3]); if (big || T.change) ripple(p, 0, Y, 90, f3(H + tu(.26)));
      verdict(p, d, { a: corner(X.a, Y, bs, -1), b: corner(X.b, Y, bs) });
    }); });

  /* 25 ── WHEEL (วงหมุน): the two plates pop in on either side of a wheel; the wheel spins them round (fast, then slowing) and on H stops with
     the winner under the pointer at the top (no winner: a on top) — the pointer clicks and lights, the words pop beside the settled plates */
  variant('wheel', 'วงหมุน', (d, c) => { const T = ST(d), WX = -95, WY = 25, RW = 185, bs = 190, first = T.win || 'a';
    art(c, p => { const H = Z.H, tS0 = f3(Math.max(tIn(d, 'b') + tu(.3), tu(.78))), D = first === 'a' ? 810 : 990, N = 40, ease = u => 1 - Math.pow(1 - u, 3);
      const ang = (s, u) => (s === 'a' ? 180 : 0) + D * (u <= tS0 ? 0 : u >= H ? 1 : ease((u - tS0) / (H - tS0))), Pt = a => [f1(WX + RW * Math.cos(rad(a))), f1(WY + RW * Math.sin(rad(a)))];
      const ts = Array.from({ length: N + 1 }, (_, k) => f3(lerp(tS0, H, k / N)));
      p.circle(WX, WY, RW, DASH(.4)); drawAt(p.circle(WX, WY, RW, { sw: 2.4, stroke: TL_(.3) }), p, tu(.04), tu(.4));
      const aF = ang('a', H), sp = mvG(p, { px: WX, py: WY, r: [[0, f1(ang('a', 0) - aF)]].concat(ts.map(u => [u, f1(ang('a', u) - aF)])), o: fadeIn(tu(.2), .06) });
      const [ax, ay] = Pt(aF), [bx_, by_] = Pt(aF + 180); sp.line(ax, ay, bx_, by_, { sw: 14 }); sp.line(ax, ay, bx_, by_, { sw: 7, stroke: C.fill });
      p.circle(WX, WY, 34, F(3.6)); p.circle(WX, WY, 11, { fill: ACC1, sw: 0, stroke: 'none' });
      SIDES.forEach(s => { const [fx, fy] = Pt(ang(s, H)), [sx0, sy0] = Pt(ang(s, 0)), t = tIn(d, s);
        const K = { px: fx, py: fy, x: [[0, f1(sx0 - fx)]].concat(ts.map(u => [u, f1(Pt(ang(s, u))[0] - fx)])), y: [[0, f1(sy0 - fy)]].concat(ts.map(u => [u, f1(Pt(ang(s, u))[1] - fy)])),
          s: [[0, .3], [t, .3], [f3(t + tu(.22)), 1.08, 'out'], [f3(t + tu(.34)), 1, 'soft']], o: fadeIn(t, .04) };
        sbox(p, c, d, s, fx, fy, bs, { shape: 'circ', g: mvG(p, K), mv: K, t });
        tag(p, d, s, 40, fy, { anchor: 'start', maxW: 360, t: f3(H + tu(.14)) }); });
      const PY = WY - RW - bs / 2 - 10, KP = Object.assign(fallK(WX, PY, tu(.3), tu(.54), 200), {}); KP.r = [[0, 0], [H, 0], [f3(H + tu(.06)), -16, 'out'], [f3(H + tu(.3)), 0, 'soft']];
      const pg = mvG(CL(p), KP), tri = `M ${WX - 32} ${PY - 56} L ${WX + 32} ${PY - 56} L ${WX} ${PY} Z`; pg.path(tri, F(4)); if (!T.off) litOn(pg, H).path(tri, { fill: ACC1, sw: 4, stroke: ACC1 });
      const top = Pt(270), bot = Pt(90); verdict(p, d, { [first]: [top[0] + 70, top[1] - 70], [OTH(first)]: [bot[0] + 70, bot[1] - 70] });
    }); });

  /* ---------- sample data: the same sentences as B03 (A: sentences from unrelated topics · B: stress) + texts on a few ---------- */
  const SAMPLES = [
    { say: 'กาแฟร้อนกับกาแฟเย็น', mode: 'versus', a: { icon: 'coffee', label: 'ร้อน' }, b: { icon: 'glass-water', label: 'เย็น' } },
    { say: 'ยกเวทเผาผลาญมากกว่าปั่นจักรยาน', mode: 'versus', a: { icon: 'bike', label: 'ปั่นจักรยาน' }, b: { icon: 'dumbbell', label: 'ยกเวท' }, win: 'b', v: { a: .35, b: .8 } },
    { say: 'รถไฟเร็วกว่ารถบัส', mode: 'versus', a: { icon: 'train-front', label: 'รถไฟ' }, b: { icon: 'bus', label: 'รถบัส' }, win: 'a' },
    { say: 'นอนพอ 8 ชั่วโมง กับนอนแค่ 4', mode: 'versus', a: { icon: 'bed', label: 'นอนพอ' }, b: { icon: 'bed', label: 'นอนน้อย' }, v: { a: .9, b: .4 } },
    { say: 'ข้าวกล่องดีกว่าอาหารขยะ', mode: 'versus', a: { icon: 'salad', label: 'ข้าวกล่อง' }, b: { icon: 'pizza', label: 'อาหารขยะ' }, win: 'a', how: 'check' },
    { say: 'จากบ้านเช่า กลายเป็นบ้านของตัวเอง', mode: 'change', a: { icon: 'key', label: 'บ้านเช่า' }, b: { icon: 'house', label: 'บ้านตัวเอง' } },
    { say: 'ปิดแจ้งเตือนแล้วโฟกัสได้', mode: 'change', a: { icon: 'bell', label: 'แจ้งเตือน' }, b: { icon: 'bell-off', label: 'เงียบ' } },
    { say: 'ต้นกล้าโตเป็นต้นไม้ใหญ่', mode: 'change', a: { icon: 'sprout', label: 'ต้นกล้า' }, b: { icon: 'trees', label: 'ต้นไม้ใหญ่' }, v: { a: .25, b: 1 }, texts: ['รดน้ำทุกเช้า', 'ให้ร่มเงาทั้งบ้าน'] },
    { say: 'ทีมเราชนะทีมเขา', mode: 'versus', a: { icon: 'users', label: 'ทีมเรา' }, b: { icon: 'users', label: 'ทีมเขา' }, win: 'a' },
    { say: 'ข้อความสั้นอ่านง่ายกว่าข้อความยาว', mode: 'versus', a: { icon: 'message-circle', label: 'สั้น' }, b: { icon: 'file-text', label: 'ยาว' }, win: 'a' },
    { say: 'จากมืดกลายเป็นสว่าง', mode: 'change', a: { icon: 'moon', label: 'มืด' }, b: { icon: 'sun', label: 'สว่าง' } },
    { say: 'แบตเหลือน้อยกว่าที่คิด', mode: 'versus', a: { icon: 'battery-low', label: 'เหลือจริง' }, b: { icon: 'battery-full', label: 'ที่คิด' }, v: { a: .25, b: .8 } },
    { say: 'ยืนทำงานดีกว่านั่งนาน ๆ', mode: 'versus', a: { icon: 'sofa', label: 'นั่งนาน' }, b: { icon: 'person-standing', label: 'ยืนทำงาน' }, win: 'b' },
    { say: 'ร้านใหม่ดีกว่าร้านเก่า', mode: 'versus', a: { icon: 'store', label: 'ร้านเก่า' }, b: { icon: 'store', label: 'ร้านใหม่' }, win: 'b', texts: ['คิวยาว รอนาน', 'บริการไว ราคาดี'] },
    { say: 'เครื่องใหม่มาแทนเครื่องเก่า', mode: 'change', a: { icon: 'laptop', label: 'เครื่องเก่า' }, b: { icon: 'laptop', label: 'เครื่องใหม่' }, texts: ['เปิดช้า ค้างบ่อย', 'เร็ว ลื่น ไม่ค้าง'] },
    { say: 'แป้งกลายเป็นเค้ก', mode: 'change', a: { icon: 'wheat', label: 'แป้ง' }, b: { icon: 'cake', label: 'เค้ก' } },
    { say: 'เดินดีกว่าขับรถในระยะใกล้', mode: 'versus', a: { icon: 'car', label: 'ขับรถ' }, b: { icon: 'person-standing', label: 'เดิน' }, win: 'b', how: 'x' },
    { say: 'ไปภูเขาหรือทะเลดี', mode: 'versus', a: { icon: 'mountain', label: 'ภูเขา' }, b: { icon: 'ship', label: 'ทะเล' } },
    { say: 'หัวใจที่เคยแตกกลับมาดีอีกครั้ง', mode: 'change', a: { icon: 'heart-crack', label: 'เคยเจ็บ' }, b: { icon: 'heart', label: 'หายดี' } },
    { say: 'เวลางานกินเวลาพักผ่อน', mode: 'versus', a: { icon: 'briefcase', label: 'ทำงาน' }, b: { icon: 'bed', label: 'พักผ่อน' }, v: { a: .75, b: .25 } },
  ];
  const STRESS = [
    { say: 'ไม่มีป้ายทั้งสองฝั่ง + ✕ ฝั่งแพ้', mode: 'versus', a: { icon: 'apple' }, b: { icon: 'cookie' }, win: 'a', how: 'x' },
    { say: 'ป้ายยาว + v', mode: 'versus', a: { icon: 'plane', label: 'เครื่องบินภายใน' }, b: { icon: 'train-front', label: 'รถไฟความเร็วสูง' }, win: 'b', v: { a: .3, b: .9 } },
    { say: 'ของชนิดเดียวกัน ต่างสภาพ (change)', mode: 'change', a: { icon: 'battery-low', label: 'แบตหมด' }, b: { icon: 'battery-full', label: 'ชาร์จเต็ม' } },
    { say: 'v ห่างกันมาก', mode: 'versus', a: { icon: 'smartphone', label: 'จอ' }, b: { icon: 'book', label: 'หนังสือ' }, v: { a: 1, b: .1 }, win: 'a' },
    { say: 'ภาษาอังกฤษ + ✕ ฝั่งแพ้', mode: 'versus', a: { icon: 'tv', label: 'TV' }, b: { icon: 'book-open', label: 'Reading' }, win: 'b', how: 'x' },
    { say: 'change + ✓', mode: 'change', a: { icon: 'lock', label: 'ล็อก' }, b: { icon: 'lock-open', label: 'ปลดล็อก' }, how: 'check' },
    { say: 'switch ปิด (change)', mode: 'change', a: { icon: 'wifi', label: 'ออนไลน์' }, b: { icon: 'wifi-off', label: 'ออฟไลน์' }, switch: false },
    { say: 'change + v ลดลง', mode: 'change', a: { icon: 'trees', label: 'ป่าเดิม' }, b: { icon: 'sprout', label: 'เหลือน้อย' }, v: { a: 1, b: .2 } },
    { say: 'win a ไม่มีป้าย', mode: 'versus', a: { icon: 'sun' }, b: { icon: 'cloud' }, win: 'a' },
    { say: 'ไม่ตัดสิน ไม่มี v', mode: 'versus', a: { icon: 'smile', label: 'ดีใจ' }, b: { icon: 'frown', label: 'เสียใจ' } },
    { say: 'change ป้ายยาว', mode: 'change', a: { icon: 'cloud', label: 'ฝนตกทั้งวัน' }, b: { icon: 'sun', label: 'ฟ้าใสทั้งวัน' } },
    { say: 'win a + ✓', mode: 'versus', a: { icon: 'bike', label: 'จักรยาน' }, b: { icon: 'car', label: 'รถยนต์' }, win: 'a', how: 'check' },
    { say: 'v เท่ากัน', mode: 'versus', a: { icon: 'coffee', label: 'กาแฟ' }, b: { icon: 'glass-water', label: 'น้ำเปล่า' }, v: { a: .5, b: .5 } },
    { say: 'ไม่มีไอคอน (คำอย่างเดียว) + win a + ✕', mode: 'versus', a: { label: 'พกร่ม' }, b: { label: 'ตากฝน' }, win: 'a', how: 'x' },
    { say: 'change ของต่างชนิด', mode: 'change', a: { icon: 'egg', label: 'ไข่' }, b: { icon: 'cake', label: 'เค้ก' } },
    { say: 'change ไม่มีป้าย', mode: 'change', a: { icon: 'sprout' }, b: { icon: 'flower' } },
    { say: 'win a + v', mode: 'versus', a: { icon: 'heart', label: 'ใจ' }, b: { icon: 'banknote', label: 'เงิน' }, win: 'a', v: { a: .8, b: .4 } },
    { say: 'ไม่มีไอคอน (change)', mode: 'change', a: { label: 'บ้านเกิด' }, b: { label: 'ต่างประเทศ' } },
    { say: 'v กลับด้าน', mode: 'versus', a: { icon: 'smartphone', label: 'หน้าจอ' }, b: { icon: 'trees', label: 'ธรรมชาติ' }, v: { a: .85, b: .15 } },
    { say: 'win b + v + ✓', mode: 'versus', a: { icon: 'pizza', label: 'ของมัน' }, b: { icon: 'salad', label: 'ผัก' }, win: 'b', v: { a: .3, b: .7 }, how: 'check' },
  ];

  G.cats = G.cats || {};
  G.cats.B03T = { variants: V, SAMPLES, STRESS, theme, draw: (i, d, c) => { setZ(c); CUR = V[i].id; tokens(); EMPTY = false; BLUE = false; V[i].build(d || {}, c); }, CLAMPS, timing: c => (setZ(c), Object.assign({}, Z)) };
})();
