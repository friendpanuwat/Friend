/* b02s.js — B02 "เพิ่ม / ลด" ชุด 7 ขนาด (user 2026-11-24: "OK ผ่านครับ เริ่มหมวด 2 ทำ 1 รอบก่อน"). Same rules as b01s (HANDOFF 00):
   the 7 sizes look alike but not 100 % the same · fill each size's box · icons may float without a box · icons never too small · glow / colours as B01–B09.
   Sizes (100 %, box centred at 0,0): 1 860×230 · 2 860×470 · 3 560×490 · 4 400×635 · 5 860×710 · 6 860×965 · 7 400×500.
   GL.cats.B02S.draw(round, size, data, { x, y, s, at, hit }). Data = CutPack B02 (dir · item · n 2–4 · center · keep · end · texts).
   Header + helpers copied from examples/b02t/b02t.js lines 6–585 (not edited there); CL() clips to the size's box. */
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
  const art = (c, fn) => { const f = p => { p.H = Z.H; fn(p); }; f.custom = true; f.dur = .35; f.exit = 'fade';   /* fade: shrinks a touch in place — never grows past the box on the way out (A6) */
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
  function clipG(p, x, y, w, h, rx = 0) { const svg = p.g.ownerSVGElement, cp = document.createElementNS(NS, 'clipPath'), r = document.createElementNS(NS, 'rect');
    cp.id = 'b02sclip' + (++CID); Object.entries(rx ? { x, y, width: w, height: h, rx } : { x, y, width: w, height: h }).forEach(([k, v]) => r.setAttribute(k, v)); cp.appendChild(r);
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
  const popAt = (q, x, y, t) => { const g = sub(q); on(g, q, 0, { ox: x, oy: y, s: [[0, .6], [t, .6], [t + tu(.3), 1, 'out']], o: [[0, 0], [t, 0], [t + tu(.12), 1]] }); return g; };   /* smooth, no overshoot (A4) */

  /* a THING (it) at (x, y) width w (+ its label at (lx, ly)). o.t = when it comes in · o.mv = keys of the part it rides ({ px, py, x, y, r, s }) ·
     o.punch = a bump at that time (the moment it is reached) · o.r = a fixed tilt (with its holder) · o.lt = when the label comes in */
  function pic(it, cx, cy, wd, c, o = {}) {
    if (!it) return null; const at = c.at || 0, X = c.x + cx * c.s, Y = c.y + cy * c.s, fn = picOf(it), t = o.t ?? tu(.12);
    let a;
    if (fn) a = G.art(fn, { x: X, y: Y, w: wd * c.s, at: at + t, speed: Z.sp, exit: 'fade' });   /* the icon leaves in place too */
    else { const str = it.label; if (!str) return null;
      const f = q => txt(q, str, 0, wd * .11, { size: wd * .3, maxW: o.bigW || wd * 1.25, weight: 700, color: C.ink, wrap: 'mid' }); f.custom = true; f.dur = .3; f.exit = 'fade';
      a = G.art(f, { x: X, y: Y, s: c.s, at: at + t, speed: 1 }); a.speed = Z.sp; }
    const K = { ox: X, oy: Y }; let any = false;
    if (o.mv) { const m = o.mv; if (m.px != null) { K.ox = c.x + m.px * c.s; K.oy = c.y + m.py * c.s; }
      ['x', 'y'].forEach(n => { if (m[n]) K[n] = m[n].map(([u, v, e]) => e ? [u, f1(v * c.s), e] : [u, f1(v * c.s)]); }); ['r', 's', 'sx', 'sy'].forEach(n => { if (m[n]) K[n] = m[n]; }); any = true; }
    else if (o.r) { K.r = [[0, o.r]]; any = true; }
    if (o.o) { K.o = o.o; any = true; }
    if (any) kf(a.wrap, at, K);
    if (o.punch != null && false) kf(a.g, at, { ox: X, oy: Y, s: [[0, 1], [o.punch, 1], [o.punch + tu(.07), 1.14, 'out'], [o.punch + tu(.3), 1, 'soft']] });
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
  const CL = p => clipG(p, -BOX[0] / 2, -BOX[1] / 2, BOX[0], BOX[1]); let BOX = [1000, 700];

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
  const litOn = (q, t) => { const g = sub(q); on(g, q, 0, { o: [[0, 0], [f3(t - tu(.12)), 0], [f3(t + tu(.18)), 1, 'io']] }); return g; };   /* glows up softly (user: "สมูทไปเลย") */
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


  /* ================= B02T — เพิ่ม / ลด (Increase / Decrease) as a template ชุดฐาน =================
     CutPack B02: dir up/down · item THING (icon + label) · n 2–4 (default 4) · center THING (owner / where they go in or out, optional) ·
     keep 0–3 (down only: how many stay; default 1, 0 = all gone) · end ('x' | 'check' | 'circle-check' | an icon name, optional).
     Up: the items arrive one by one, the last on H. Down: they are all there, then leave one by one (the last-placed first) until `keep` stay,
     the last leaving on H. **Icon slots are big** (user 2026-11-14: "อยากให้ช่องใส่ไอคอนมันมีขนาดใหญ่ขึ้นกว่านี้หน่อย … เริ่มจากหมวดที่ 2"):
     item boxes 150–240 on the 1000 × 700 canvas, the center 180–260. Item label = a chip apart from the icons; colours from the theme. */
  const UPD = d => !(d && d.dir === 'down');
  const ITM = d => d && has(d.item) ? d.item : null, CEN = d => d && has(d.center) ? d.center : null;
  const NN = d => Math.max(2, Math.min(4, Math.round(+(d && d.n) || 4)));
  const SZ = n => n >= 4 ? 200 : n === 3 ? 230 : 255;
  const rowX = (n, s, gap, cx = 0) => Array.from({ length: n }, (_, k) => f1(cx + (k - (n - 1) / 2) * (s + gap)));
  function EV(d) { const up = UPD(d), n = NN(d), keep = up ? n : (d.keep == null ? 1 : Math.max(0, Math.min(n - 1, Math.round(+d.keep)))), m = up ? n : n - keep, H = Z.H, T0 = Math.max(tu(.55), H - tu(1.15));
    const ts = Array.from({ length: Math.max(1, m) }, (_, j) => f3(m <= 1 ? H : lerp(T0, H, j / (m - 1))));
    return { up, n, keep, m, ts, H, T0, at: k => up ? ts[k] : k >= keep ? ts[n - 1 - k] : null }; }
  const ORD = E => Array.from({ length: E.n }, (_, k) => k).filter(k => E.at(k) != null).sort((a, b) => E.at(a) - E.at(b));
  const multiBump = (ts, a = 1.08) => { const K = [[0, 1]]; ts.filter(t => t != null).sort((x, y) => x - y).forEach(t => K.push([t, 1], [f3(t + tu(.05)), a, 'out'], [f3(t + tu(.18)), 1, 'soft'])); return K; };
  /* the words of item k (user 2026-11-14: "เพิ่มช่องข้อความใหม่: แต่ละแถวใส่ข้อความต่างกันได้ เช่น ชื่อหนังสือแต่ละเล่ม … ถ้าไม่มีข้อความส่งมา ให้แสดงขีดเทาเหมือนเดิม"):
     data.texts = [one string per item]; where a design shows grey lines in an item (rows, pills) the item's text takes their place; none → the grey lines */
  const TXK = (d, k) => d && Array.isArray(d.texts) && d.texts[k] != null && String(d.texts[k]).trim() ? String(d.texts[k]).trim() : null;
  const DASH = (a = .4) => ({ sw: 2.4, stroke: TL_(a), 'stroke-dasharray': '8 10' });
  /* one item at (x, y), size s. up → it comes in (o.in: drop · fly · slide · rise · flip · pop) and lands at its time; o.vanish = it is absorbed right after.
     down → it is there from the start (pops in at o.t0) and leaves at its time (o.out: lift · fly · slide · flip · sink · shrink) unless kept;
     o.hidden = it is not shown before it leaves (it comes out of something). o.shape 'box' | 'circ'. */
  function item(p, c, X, x, y, s, E, k, o = {}) {
    const t = E.at(k), t0 = o.t0 ?? f3(tu(.08 + .06 * k)), up = E.up, K = { px: x, py: y }, dur = o.dur || .3;
    if (up) { const kind = o.in || 'drop', ts = f3(Math.max(tu(.05), t - tu(dur)));
      if (kind === 'drop') Object.assign(K, fallK(x, y + s / 2, ts, t, o.h ?? Math.max(160, y + s / 2 + 350)));
      else if (kind === 'fly') { const fr = o.from || [x, -460], mid = o.mid || [(fr[0] + x) / 2, Math.min(fr[1], y) - 120], P = pathK(o.path ? o.path.concat([[x, y]]) : [fr, mid, [x, y]], ts, t, [x, y]);
        Object.assign(K, { x: P.x, y: P.y, s: [[0, .7], [ts, .7], [t, 1, 'out'], [f3(t + tu(.06)), 1.12, 'out'], [f3(t + tu(.2)), 1, 'soft']], o: fadeIn(ts, .04) }); }
      else if (kind === 'slide') { const dx = o.dx ?? 320; Object.assign(K, { x: [[0, dx], [ts, dx], [t, -10 * Math.sign(dx), 'out'], [f3(t + tu(.1)), 0, 'soft']], o: fadeIn(ts, .04) }); }
      else if (kind === 'rise') Object.assign(K, { y: [[0, o.dy ?? 160], [ts, o.dy ?? 160], [t, -10, 'out'], [f3(t + tu(.1)), 0, 'soft']], o: fadeIn(ts, .04) });
      else if (kind === 'flip') Object.assign(K, { sx: [[0, 0], [ts, 0], [f3(ts + (t - ts) * .5), -.5], [t, 1.08, 'out'], [f3(t + tu(.1)), 1, 'soft']], o: fadeIn(ts, .04) });
      else Object.assign(K, { s: [[0, .2], [ts, .2], [t, 1.12, 'out'], [f3(t + tu(.14)), 1, 'soft']], o: fadeIn(ts, .04) });
      if (o.vanish) { K.o = fadeIn(ts, .04).concat([[t, 1], [f3(t + tu(.08)), 0]]); K.s = kind === 'fly' ? [[0, .7], [ts, .7], [f3(t - tu(.02)), 1, 'out'], [f3(t + tu(.08)), .4]] : [[0, 1], [t, 1], [f3(t + tu(.08)), .4]]; }
    } else { const S0 = [[0, .3], [t0, .3], [f3(t0 + tu(.22)), 1.06, 'out'], [f3(t0 + tu(.34)), 1, 'soft']], O0 = [[0, 0], [t0, 0], [f3(t0 + tu(.05)), 1]];
      if (t == null) Object.assign(K, { s: S0, o: O0 });
      else { const kind = o.out || 'lift', te = f3(t + tu(dur)), OH = [[0, 0], [t, 0], [f3(t + tu(.03)), 1], [f3(te - tu(.05)), 1], [te, 0]], Of = o.hidden ? OH : O0.concat([[t, 1], [te, 0]]), Sx = o.hidden ? [[0, 1]] : S0;
        if (kind === 'lift') Object.assign(K, { s: Sx, y: [[0, 0], [t, 0], [te, -170, 'in']], o: Of });
        else if (kind === 'fly') { const to = o.to || [x, -460], mid = o.mid || [(x + to[0]) / 2, Math.min(y, to[1]) - 120], P = pathK(o.path ? [[x, y]].concat(o.path) : [[x, y], mid, to], t, te, [x, y]);
          Object.assign(K, { s: (o.hidden ? [[0, .5], [t, .5], [f3(t + tu(.1)), 1, 'out']] : S0.concat([[t, 1]])).concat([[te, .7]]), x: P.x, y: P.y, o: Of }); }
        else if (kind === 'slide') { const dx = o.dx ?? 360; Object.assign(K, { s: Sx, x: [[0, 0], [t, 0], [f3(t + tu(.06)), -12 * Math.sign(dx), 'out'], [te, dx, 'in']], o: Of }); }
        else if (kind === 'flip') Object.assign(K, { s: Sx, sx: [[0, 1], [t, 1], [te, 0, 'in']], o: O0.concat([[te, 1], [f3(te + tu(.01)), 0]]) });
        else if (kind === 'sink') Object.assign(K, { s: Sx, y: [[0, 0], [t, 0], [f3(t + tu(.06)), -12, 'out'], [te, o.sinkY ?? 170, 'in']], o: Of });
        else Object.assign(K, { s: Sx.concat([[t, 1], [f3(t + tu(.06)), 1.12, 'out'], [te, 0, 'in']]), o: O0.concat([[f3(te - tu(.02)), 1], [te, 0]]) });
      } }
    const g = mvG(o.clip === false ? p : CL(p), K), sh = o.shape || 'box', mv = Object.assign({}, K); delete mv.o;
    if (o.bare) {} else if (sh === 'circ') { g.circle(x, y, s / 2, F(3.6)); g.circle(x, y, s / 2 - 12, S(1.4)); } else R(g, x - s / 2, y - s / 2, s, s, s * .24, F(4));   /* o.bare = the icon floats, no box (b02s rule 3) */
    if (X && picOf(X)) put(p, c, { icon: X.icon }, x, y, s * (o.bare ? .92 : sh === 'circ' ? .66 : .72), null, { t: up ? f3(Math.max(tu(.05), t - tu(dur))) : (o.hidden ? t : t0), mv, o: o.io || K.o });
    else if (X && X.label) txt(g, X.label, x, y + s * .08, { size: s * .24, maxW: s * .88, weight: 800, color: C.ink, wrap: 'mid' }); else g.circle(x, y, s * .12, { fill: ACC1, sw: 0, stroke: 'none' });
    if (up && (o.in || 'drop') === 'drop' && o.dust !== false) dust(p, x, y + s / 2, t, s / 240);
    if (!up && t != null && o.ghost !== false && !o.hidden) ghost(p, x, y, s, f3(t + tu(dur)), sh);   /* where it was stays as a dashed outline */
    return { t, K, g }; }
  function ghost(p, x, y, s, t, sh = 'box', w) { const g = sub(p); on(g, p, 0, { o: [[0, 0], [f3(t - tu(.12)), 0], [t, 1]] });
    if (sh === 'circ') g.circle(x, y, s / 2, DASH(.4)); else R(g, x - (w || s) / 2, y - s / 2, w || s, s, sh === 'pill' ? s / 2 : s * .24, DASH(.4)); }
  /* the center (owner / where they go): a big box that bumps on every event, its word in a pill (o.ly; o.noLabel) */
  function cbox(p, c, X, x, y, s, ts, o = {}) { if (!X) return null; const t = o.t ?? tu(.1), g0 = popAt(p, x, y, t), K = { px: x, py: y, s: multiBump(ts) }, g = mvG(g0, K);
    if (o.circ) { g.circle(x, y, s / 2, F(4.4)); g.circle(x, y, s / 2 - 16, S(1.4)); } else { R(g, x - s / 2, y - s / 2, s, s, s * .26, F(4.4)); R(g, x - s / 2 + 14, y - s / 2 + 14, s - 28, s - 28, s * .2, S(1.4)); }
    if (picOf(X)) { put(p, c, { icon: X.icon }, x, y, s * .66, null, { t: f3(t + tu(.04)), mv: K }); if (X.label && !o.noLabel) { const ly = o.ly == null ? y + s / 2 + 64 : o.ly > y + 1 ? Math.max(o.ly, y + s / 2 + 64) : o.ly < y - 1 ? Math.min(o.ly, y - s / 2 - 64) : o.ly; pill(p, X.label, o.lx ?? x, ly, { t: tu(.3), size: 54, maxW: o.maxW || 380 }); } }
    else txt(g, X.label, x, y + s * .08, { size: s * .22, maxW: s * .88, weight: 800, color: C.ink, wrap: 'mid' }); return g; }
  /* the item's word as a chip (only when it has an icon — otherwise the word is in the boxes) + the direction badge */
  /* (user 2026-11-14, with a marked-up picture: "ลบขีดเส้นใต้ด้านล่างออกและลบที่ผมวงไว้ออกด้วยทุกอันเลย … โหมดต่อๆไปก็ห้ามทำด้วย") — no word chip
     top-left, no up / down arrow badge top-right, no floor line under the things; base() is kept as a no-op so the designs read the same */
  function base() {}
  /* the end sign after the last change: ✗ / ✓ / an icon */
  function endM(p, c, d, x, y, r = 62) { if (!d.end) return; const t = f3(Z.H + tu(.12)), g = popAt(p, x, y, t); g.circle(x, y, r, F(3.4));
    if (d.end === 'x') XX(g, x, y, r / 30); else if (/check/.test(d.end)) CHK(g, x, y, r / 30); else put(p, c, { icon: d.end }, x, y, r * 1.3, null, { t }); ripple(p, x, y, r + 10, t); }
  const slots = (p, xs, ys, s, r = .28) => xs.forEach((x, k) => on(R(p, x - s / 2 - 10, ys[k] - s / 2 - 10, s + 20, s + 20, s * r, DASH()), p, 0, { o: fadeIn(tu(.04 + .04 * k), .06) }));


  /* ================= B02S — เพิ่ม / ลด ชุด 7 ขนาด ================= */
  /* the size's box drawn as a yellow outline (sheets only) */
  function frame(c, W0, H0) { const f = p => { p.rect(-W0 / 2, -H0 / 2, W0, H0, { sw: 3, stroke: '#ffd400' }); }; f.custom = true; f.dur = .01; f.exit = 'pop'; G.art(f, { x: c.x, y: c.y, s: c.s, at: 0, speed: 1 }); }
  const SIZES = [null, { w: 860, h: 230, th: 'แถบแบนยาว' }, { w: 860, h: 470, th: 'กว้าง' }, { w: 560, h: 490, th: 'เกือบจัตุรัส' }, { w: 400, h: 635, th: 'ตั้งแคบ' },
    { w: 860, h: 710, th: 'เต็มจอ ทรงนอน' }, { w: 860, h: 965, th: 'เต็มจอ ทรงตั้ง' }, { w: 400, h: 500, th: 'ตั้งแคบ สั้น' }];
  /* the biggest grid of n squares in a region (x0, y0, w, h) with gap g; the last row centred. Returns { s, pts } */
  function gridFit(n, x0, y0, w, h, g, cap = 420) { let best = null;
    for (let r = 1; r <= n; r++) { const cols = Math.ceil(n / r), s = Math.min(cap, (w - (cols - 1) * g) / cols, (h - (r - 1) * g) / r); if (!best || s > best.s + .5) best = { s, r, cols }; }
    /* spread the things over the room (no big empty sides) but never further apart than .5 × their size — a group, not scattered */
    const { s, r, cols } = best, gy = r > 1 ? Math.min(Math.max(g, s * .5), (h - r * s) / (r - 1)) : 0, gx = cols > 1 ? Math.min(Math.max(g, s * .5), (w - cols * s) / (cols - 1)) : 0, pts = [];
    for (let i = 0; i < n; i++) { const row = Math.floor(i / cols), inRow = Math.min(cols, n - row * cols), col = i - row * cols;
      pts.push([f1(x0 + w / 2 + (col - (inRow - 1) / 2) * (s + gx)), f1(y0 + h / 2 + (row - (r - 1) / 2) * (s + gy))]); }
    return { s: f1(s), pts }; }
  /* the center's region: 'left' strip or 'top' strip of the box; returns { cx, cy, cs, lab: where its word goes or null, rest: region for the items } */
  function split(Wb, Hb, where, frac, labH = 110) { const x0 = -Wb / 2, y0 = -Hb / 2;
    if (where === 'left') { const cw = Wb * frac, cs = Math.min(cw - 24, Hb - 24), withL = Hb - cs >= labH + 30, cs2 = withL ? Math.min(cs, Hb - labH - 30) : cs, cy = withL ? y0 + (Hb - labH) / 2 : 0;
      return { cx: f1(x0 + cw / 2), cy: f1(cy), cs: f1(cs2), lab: withL ? [f1(x0 + cw / 2), f1(cy + cs2 / 2 + labH / 2 + 10)] : null, rest: [x0 + cw, y0, Wb - cw, Hb] }; }
    const ch = Hb * frac, cs = Math.min(ch - 24, Wb - 24), withL = Wb - cs >= 2 * 260, cx = withL ? -Math.min(160, (Wb - cs) / 4) : 0;
    return { cx: f1(cx), cy: f1(y0 + ch / 2), cs: f1(Math.min(cs, 300)), lab: withL ? [f1(cx + cs / 2 + 30), f1(y0 + ch / 2)] : null, labLeft: true, rest: [x0, y0 + ch, Wb, Hb - ch] }; }
  /* the center box + its word (pill under it, or beside it) */
  const twd = (q, s, size) => { const m = q.text(s, 0, -9999, { size, weight: 800, anchor: 'start', dur: .01 }), w = m.getBBox().width; m.remove(); return w; };
  function centre(p, c, Cn, L, E) { if (!Cn) return; cbox(p, c, Cn, L.cx, L.cy, L.cs, E.ts, { noLabel: true });
    if (Cn.label && picOf(Cn) && L.lab) { const sz = Math.max(44, Math.min(60, L.cs * .26));
      if (L.labLeft) { const mw = L.labMax != null ? L.labMax - L.lab[0] - 30 : BOX[0] / 2 - L.lab[0] - 70, w = Math.min(mw, twd(p, Cn.label, sz));
        if (twd(p, Cn.label, sz) * 40 / sz > mw) txt(atG(p, tu(.3)), Cn.label, f1(L.lab[0] + 30), f1(L.lab[1] + 14), { size: 50, maxW: mw, weight: 800, color: C.ink, wrap: 'mid', anchor: 'start' });   /* too long for a pill at ≥ 40 → two plain lines */
        else pill(p, Cn.label, f1(L.lab[0] + 30 + w / 2), L.lab[1], { t: tu(.3), size: sz, maxW: mw }); }
      else { const mw = Math.max(160, L.cs + 40);   /* too long for a pill at ≥ 40 → plain words in two lines (never smaller than 40) */
        if (twd(p, Cn.label, sz) * 40 / sz > mw) txt(atG(p, tu(.3)), Cn.label, L.lab[0], f1(L.lab[1] + 14), { size: 50, maxW: mw, weight: 800, color: C.ink, wrap: 'mid' });
        else pill(p, Cn.label, L.lab[0], L.lab[1], { t: tu(.3), size: sz, maxW: mw }); } } }

  /* ROUND 1 history (user 2026-11-24): "ช่องรอ" — "เหมือนแค่เอาไอคอนมาต่อกัน"; "ดูดเข้า-ขยายชั้น" — "แฟนซีเกินไปผมอยากได้แบบเรียบๆ"; two plain options
     (A แถบระดับ · B สำรับซ้อน) — then the user set the method: "เอา 50 อันเดิม มาทำใหม่ให้มันเข้ากับขนาดทั้ง 7 … ใช้พื้นที่ให้คุ้มด้วย · หมวด 2 เลือกอันเดิมมา
     ซักอันนึงแล้วปรับให้เข้ากับขนาดทั้ง 7". So each round = one APPROVED B0xT design, laid out anew to fill each size (not the original scaled).
     ---------- ROUND 1 · แท่งโต (B02T 12 'bars'): a bar grows up for each thing and its icon box pops on the top; the bars rise like stairs.
     up — bar by bar, the box landing on H for the last; down — the box sinks into its bar and the bar shrinks away (a dashed box stays).
     Each size: the units (box on bar) are laid out in the grid that gives the biggest boxes (one row on wide sizes, 2 × 2 on narrow ones),
     the bars take all the height that is left; the owner (center) in its own strip. Sizes differ in the box (rounded box / round plate /
     floating icon), bar width and spacing. ---------- */
  /* (user 2026-11-24) try 1 kept B02T's small boxes on thin bars → "ใช้พื้นที่ให้คุ้ม · icon ลอยได้ · Icon ห้ามเล็กเกินไป · ดีไซน์ใหม่ให้ไม่เหมือนต้นฉบับ 100% ก็ได้";
     try 2 = wide pillars in a grid with icons inside + full-height dashed tracks → "มันดูไม่ออกเลยอ่ะว่ากราฟมันสูงขึ้น". Now: ONE big floating icon (the thing)
     + a bar chart in ONE row that clearly rises like stairs (shortest ≈ 30 %, last = full height). The icon sits beside the chart on wide rooms,
     above it on narrow ones; both fill the room. up — the bars grow one by one (overshoot), the icon bumps each time, the last on H; down — the
     chart is full, the bars shrink away from the tallest (a dashed outline stays where each was). Owner (center) in its own strip. */
  const R1 = { th: 'แท่งโต (จาก B02T 12)' };
  const regionOf = (Wb, Hb, L) => L ? L.rest : [-Wb / 2, -Hb / 2, Wb, Hb];
  /* st.band (sizes 5, 6 — user: "ขนาด 5 กับขนาด 6 ยังใช้พื้นที่ได้ไม่คุ้มพอ"): with an owner, the owner (left) and the big icon (right) share ONE top band
     and the chart takes the full width under it (no owner strip eating a side); without an owner, st.alone picks 'side' (icon left of a full-height
     chart) or 'top' (a bigger icon, up to 420, above a full-width chart). */
  function r1(d, c, k, st) { const X = ITM(d), E = EV(d), Cn = CEN(d), Wb = SIZES[k].w, Hb = SIZES[k].h, band = st.band && Cn, m = 12, gI = st.gI ?? 30;
    let L = null, RG, ic, ix, iy, side, x0, y0, w, h, cx0, cy1, cw, ch;
    if (band) { const bh = f1(Hb * st.band), cs = f1(bh - 2 * m); ic = f1(Math.min(bh - 2 * m, 340)); ix = f1(Wb / 2 - m - ic / 2); iy = f1(-Hb / 2 + m + ic / 2);
      L = { cx: f1(-Wb / 2 + m + cs / 2), cy: f1(-Hb / 2 + m + cs / 2), cs, lab: [f1(-Wb / 2 + m + cs), f1(-Hb / 2 + m + cs / 2)], labLeft: true, labMax: ix - ic / 2 - 30 };
      x0 = -Wb / 2 + m; w = Wb - 2 * m; cx0 = x0; cw = w; cy1 = Hb / 2 - m; ch = Hb - 2 * m - bh - gI + m; }
    else { L = Cn ? split(Wb, Hb, st.cwhere, st.cfrac) : null; RG = regionOf(Wb, Hb, L); x0 = RG[0] + m; y0 = RG[1] + m; w = RG[2] - 2 * m; h = RG[3] - 2 * m;
      side = st.alone && !Cn ? st.alone === 'side' : w > h * 1.25; const capI = !Cn && st.alone === 'top' ? 420 : 320;
      ic = f1(side ? Math.min(h * .92, w * .4, capI) : Math.min(w * .78, h * .42, capI)); ix = side ? x0 + ic / 2 : x0 + w / 2; iy = side ? y0 + h / 2 : y0 + ic / 2;
      cx0 = side ? x0 + ic + gI : x0; cy1 = y0 + h; cw = side ? w - ic - gI : w; ch = side ? h : h - ic - gI; }
    const g = st.gap ?? Math.max(14, cw * .05), bw = (cw - (E.n - 1) * g) / E.n, rr = Math.min(22, bw * .22);
    art(c, p => { const KI = { px: ix, py: iy, s: multiBump(E.ts, 1.05) };   /* the icon only breathes a little with each change */
      if (X && picOf(X)) put(p, c, { icon: X.icon }, ix, iy, ic, null, { t: tu(.06), mv: KI, o: fadeIn(tu(.06), .06) });
      else if (X && X.label) txt(mvG(p, Object.assign({ o: fadeIn(tu(.06), .06) }, KI)), X.label, ix, iy + ic * .1, { size: Math.max(44, ic * .26), maxW: ic, weight: 800, color: C.ink, wrap: 'mid' });
      for (let j = 0; j < E.n; j++) { const x = f1(cx0 + j * (bw + g)), bh = f1(ch * (E.n > 1 ? .3 + .7 * j / (E.n - 1) : 1)), top = f1(cy1 - bh), t = E.at(j), lit = { fill: TA(.3), sw: 4, stroke: ACC1 };
        /* smooth, no bounce (user 2026-11-24: "อยากได้การขึ้นลงของกราฟที่มันสมูทไม่ใช่เด้งๆแบบนี้"): one 'io' ease up / down, no overshoot */
        if (E.up) R(mvG(p, { px: x + bw / 2, py: cy1, sy: [[0, 0], [f3(t - tu(.45)), 0], [t, 1, 'io']], o: fadeIn(f3(t - tu(.45)), .03) }), x, top, bw, bh, rr, lit);
        else { const t0 = tu(.1 + .05 * j), K = { px: x + bw / 2, py: cy1, sy: [[0, 0], [t0, 0], [f3(t0 + tu(.4)), 1, 'io']].concat(t == null ? [] : [[t, 1], [f3(t + tu(.45)), 0, 'io']]), o: fadeIn(t0, .03) };
          R(mvG(p, K), x, top, bw, bh, rr, lit); if (t != null) { const g2 = sub(p); on(g2, p, 0, { o: [[0, 0], [f3(t + tu(.25)), 0], [f3(t + tu(.45)), 1]] }); R(g2, x, top, bw, bh, rr, { fill: 'none', sw: 2.4, stroke: TL_(.3) }); } } }
      centre(p, c, Cn, L || {}, E); const er = Math.max(48, Math.min(64, bw * .4)); endM(p, c, d, f1(Math.min(Wb / 2 - er - 6, cx0 + cw - er)), f1(Math.max(-Hb / 2 + er + 6, cy1 - ch + er)), er); }); }
  R1[1] = (d, c) => r1(d, c, 1, { cwhere: 'left', cfrac: .22, gI: 26 });
  R1[2] = (d, c) => r1(d, c, 2, { cwhere: 'left', cfrac: .24, gI: 34 });
  R1[3] = (d, c) => r1(d, c, 3, { cwhere: 'left', cfrac: .3, gI: 26 });
  R1[4] = (d, c) => r1(d, c, 4, { cwhere: 'top', cfrac: .24, gI: 26 });
  R1[5] = (d, c) => r1(d, c, 5, { band: .34, alone: 'side', gI: 36 });
  R1[6] = (d, c) => r1(d, c, 6, { band: .3, alone: 'top', gI: 40 });
  R1[7] = (d, c) => r1(d, c, 7, { cwhere: 'top', cfrac: .25, gI: 22 });

  /* ================= ROUNDS 2–5 (user 2026-11-25 after B01 passed: "ผ่าน ทำหมวด 2 ต่อได้") — seven sizes × five designs:
     01 = round 1 (แท่งโต, passed) + four new, each a different way to see "more / fewer" without words:
     PILE กองซ้อน (cards land on a pile / are lifted off) · TREND เส้นเทรนด์ (a line draws itself up or down, the boxes on it grow or shrink) ·
     LAYERS ชั้นซ้อนรอบ (rings round the thing light up outward / go dark) · CUP ภาชนะ (things drop into a U container / are lifted out).
     Lessons from B01/B12: centred (D14) · the owner / thing as an icon, its word only when there is no icon (D15) · no dashed lines, no ripple,
     no ruler ticks (D4, 32, D18) · smooth ease-out, no bounce (A4) · nothing outside the box (D12, A5) · the owner lights on the keyword. ================= */
  const hrow = (items, gap, cx = 0, cy = 0) => { const L = items.filter(Boolean), tot = L.reduce((a, it) => a + it.w, 0) + gap * Math.max(0, L.length - 1); let x = cx - tot / 2; L.forEach(it => { it.at(f1(x + it.w / 2), cy); x += it.w + gap; }); return tot; };
  const vcol = (items, gap, cx = 0, cy = 0) => { const L = items.filter(Boolean), tot = L.reduce((a, it) => a + it.h, 0) + gap * Math.max(0, L.length - 1); let y = cy - tot / 2; L.forEach(it => { it.at(cx, f1(y + it.h / 2)); y += it.h + gap; }); return tot; };
  const sIn = (q, x, y, t, d = .28) => { const g = sub(q); on(g, q, 0, { ox: x, oy: y, s: [[0, .7], [t, .7], [f3(t + tu(d)), 1, 'out']], o: fadeIn(t, .12) }); return g; };   /* smooth, no overshoot */
  const LITE = (q, t) => litOn(q, t);
  /* a thing as a rounded tile + its icon (or its word when it has no icon). K = the tile's keys; o.io = the icon's own opacity keys; o.lit = edge lights at o.lt */
  function tile(p, c, X, x, y, s, K, o = {}) { const g = mvG(CL(p), K), rr = f1(s * .24); R(g, x - s / 2, y - s / 2, s, s, rr, F(4));
    if (o.lt != null) R(LITE(g, o.lt), x - s / 2, y - s / 2, s, s, rr, { fill: TA(.12), sw: 4.4, stroke: ACC1 });
    const mv = Object.assign({}, K); delete mv.o;
    if (X && picOf(X)) put(p, c, { icon: X.icon }, x, y, f1(s * .7), null, { t: o.it ?? tu(.1), mv, o: o.io || K.o });
    else if (X && X.label) txt(o.io ? mvG(g, { o: o.io }) : g, X.label, x, f1(y + s * .08), { size: f1(s * .24), maxW: f1(s * .84), weight: 800, color: C.ink, wrap: 'mid' });   /* the word hides with the icon when covered */
    else g.circle(x, y, f1(s * .1), { fill: ACC1, sw: 0, stroke: 'none' });
    return g; }
  /* the owner (center) as a big tile with its icon; its edge lights on the keyword */
  const OWN = (p, c, Cn, s) => Cn ? { w: s, h: s, at: (x, y) => { const g = sIn(p, x, y, tu(.04)), rr = f1(s * .26); R(g, x - s / 2, y - s / 2, s, s, rr, F(4.4)); R(g, x - s / 2 + 14, y - s / 2 + 14, s - 28, s - 28, f1(s * .2), S(1.4));
      if (picOf(Cn)) put(p, c, { icon: Cn.icon }, x, y, f1(s * .62), null, { t: tu(.08) }); else txt(g, Cn.label, x, f1(y + s * .08), { size: f1(s * .2), maxW: f1(s * .8), weight: 800, color: C.ink, wrap: 'mid' });
      R(LITE(p, Z.H), x - s / 2, y - s / 2, s, s, rr, { fill: 'none', sw: 5, stroke: ACC1 }); } } : null;
  /* the end sign (✗ / ✓ / an icon) after the last change — its own layer on top, no ripple */
  const ENDI = (p, c, d, r) => d.end && r > 0 ? { w: 2 * r, h: 2 * r, at: (x, y) => over(c, q => { const t = f3(Z.H + tu(.1)), g = sIn(q, x, y, t); g.circle(x, y, r, F(3.4));
      if (d.end === 'x') XX(g, x, y, r / 30); else if (/check/.test(d.end)) CHK(g, x, y, r / 30); else put(q, c, { icon: d.end }, x, y, f1(r * 1.3), null, { t }); }) } : null;
  /* one size's layout: [owner] + design + [end sign] in a row (wide sizes) or a column (narrow), centred in the box */
  function lay(k, d, c, D, opt = {}) { const X = ITM(d), E = EV(d), Cn = opt.own === false ? null : CEN(d), Wb = SIZES[k].w, Hb = SIZES[k].h, m = 14, aw = Wb - 2 * m, ah = Hb - 2 * m, wide = Wb / Hb > 1.05;
    art(c, p => { const gap = f1(Math.max(22, Math.min(Wb, Hb) * .05)), er = d.end ? f1(Math.max(40, Math.min(62, (wide ? ah : aw) * .2))) : 0;
      const os = Cn ? f1(wide ? Math.min(ah, aw * .31, 300) : Math.min(aw * .66, ah * .33, 280)) : 0;
      const rw = wide ? aw - (Cn ? os + gap : 0) - (er ? 2 * er + gap : 0) : aw, rh = wide ? ah : ah - (Cn ? os + gap : 0) - (er ? 2 * er + gap : 0);
      if ((!wide || Wb / Hb < 1.3) && Cn && er) { const top = { w: os + gap + 2 * er, h: Math.max(os, 2 * er), at: (x, y) => hrow([OWN(p, c, Cn, os), ENDI(p, c, d, er)], gap, x, y) };   /* narrow: owner + end sign side by side on top */
        vcol([top, D(p, c, X, E, d, f1(aw), f1(ah - os - gap))], gap); return; }
      (wide ? hrow : vcol)([OWN(p, c, Cn, os), D(p, c, X, E, d, f1(rw), f1(rh)), ENDI(p, c, d, er)], gap); }); }
  const evN = E => Array.from({ length: E.n }, (_, j) => f3(E.n <= 1 ? E.H : lerp(E.T0, E.H, j / (E.n - 1))));   /* one time per place, the last on H */

  /* ===== B02 round 2 (user 2026-11-25: "ผมไม่ชอบการซ้อนของกรอบเลยอ่ะ ดีไซน์ใหม่ได้ไหม … ออกแบบให้มันแบบแตกต่างแต่ก็ยังคงตาม theme" → ทั้ง 5 แบบ,
     "คุณออกแบบเองเลย ให้ดูจากบทเรียน … อันที่ผมให้ผ่านมาแล้ว … reference"): NO frames on frames anywhere. Built from what passed: big floating
     icons, lines that draw themselves, a fill bar with a knob, a ring that fills, an edge that lights on the keyword.
     ARRIVE ทยอยมา · INTO เข้าเจ้าของ · TREND เส้นเทรนด์ · DONUT วงแบ่งช่อง · STAIRS บันได. ===== */
  /* a thing: its icon floating (no box) — or its word when it has no icon. K = keys of its move (px, py + x / y / s / o) */
  function thing(p, c, X, x, y, s, K, o = {}) { const mv = Object.assign({}, K); delete mv.o;
    if (X && picOf(X)) put(p, c, { icon: X.icon }, x, y, f1(s), null, { t: o.t ?? tu(.1), mv, o: K.o });
    else { const g = mvG(CL(p), K), ts = f1(s * .86); R(g, f1(x - ts / 2), f1(y - ts / 2), ts, ts, f1(ts * .24), F(4)); txt(g, (X && X.label) || '', x, f1(y + ts * .08), { size: f1(ts * .24), maxW: f1(ts * .84), weight: 800, color: C.ink, wrap: 'mid' }); } }   /* no icon: the word in ONE rounded tile */
  const KN = () => ({ fill: ACC1, sw: 0, stroke: 'none' });
  const ioE2 = u => u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;
  const ioAt2 = (f, t0, t1) => { let lo = 0, hi = 1; for (let k = 0; k < 30; k++) { const m = (lo + hi) / 2; if (ioE2(m) < f) lo = m; else hi = m; } return f3(t0 + (t1 - t0) * lo); };
  /* ONE smooth trip (user 2026-11-25: "อยากให้อนิเมชั่นมันสมูทไปเลย"): the whole change runs on one io ease from TS(E) to H — no start-stop per step */
  const TS = E => f3(Math.max(tu(.2), E.T0 - tu(.35)));
  const sweepK = (t0, t1, g, n = 24) => { const K = [[0, g(0)], [t0, g(0)]]; for (let i = 1; i <= n; i++) { const u = i / n; K.push([f3(t0 + (t1 - t0) * u), f3(g(ioE2(u)))]); } return K; };   /* a track that follows g(progress) */
  const ioKs = (pts) => { const K = [[0, pts[0][1]]]; pts.forEach(([t, v], i) => K.push(i ? [t, v, 'io'] : [t, v])); return K; };   /* [[t, v], …] → keys with an io ease between */

  /* ARRIVE — the things themselves, big and floating: one by one they come in where they stand (up) · one by one they fade to a faint shadow (down) */
  function ARRIVE(p, c, X, E, d, w, h) { const n = E.n; let B = null;
    for (let r = 1; r <= n; r++) { const cl = Math.ceil(n / r), sz = Math.min(w / (cl + (cl - 1) * .2), h / (r + (r - 1) * .2), 400); if (!B || sz > B.sz + .5) B = { sz, r, cl }; }
    const sz = f1(B.sz), g = f1(sz * .2), W0 = f1(B.cl * sz + (B.cl - 1) * g), H0 = f1(B.r * sz + (B.r - 1) * g);
    return { w: W0, h: H0, at: (cx, cy) => { for (let j = 0; j < n; j++) { const row = Math.floor(j / B.cl), inRow = Math.min(B.cl, n - row * B.cl), col = j - row * B.cl;
      const x = f1(cx + (col - (inRow - 1) / 2) * (sz + g)), y = f1(cy - H0 / 2 + sz / 2 + row * (sz + g)), t = E.at(j);
      if (E.up) thing(p, c, X, x, y, sz, { px: x, py: y, s: [[0, .9], [f3(t - tu(.5)), .9], [t, 1, 'out']], o: [[0, 0], [f3(t - tu(.5)), 0], [t, 1, 'io']] }, { t: f3(t - tu(.52)) });
      else { const t0 = f3(tu(.06 + .05 * j)), K = { px: x, py: y, o: fadeIn(t0, .12) };
        if (t != null) { K.s = [[0, 1], [f3(t - tu(.3)), 1], [f3(t + tu(.2)), .88, 'io']]; K.o = K.o.concat([[f3(t - tu(.3)), 1], [f3(t + tu(.2)), .14, 'io']]); }   /* it fades to a faint shadow of itself */
        thing(p, c, X, x, y, sz, K, { t: t0 }); } } } }; }

  /* INTO — the owner (or, with no owner, the thing's own tile) is the receiver: the things wait in a line, then one by one travel along a curve
     into it and the bar under it fills a step (up) · one by one they come out of it, travel back along the curve and fade (down), the bar empties a step.
     The curves draw themselves first. The receiver's edge lights on the keyword. */
  function INTO(p, c, X, E, d, w, h) { if (w / h > 2.5) return QUEUE(p, c, X, E, d, w, h); const n = E.n, Cn = CEN(d), Rv = Cn || X, wide = w / h > 1.15, bh = f1(Math.max(30, Math.min(56, Math.min(w, h) * .08))), gb = f1(bh * .6);
    const Rs = f1(wide ? Math.min(h - bh - gb, w * .4, 420) : Math.min(w * .7, (h - bh - gb) * .5, 420)), q = f1(wide ? Math.min((h - 10) / (n + (n - 1) * .3), Rs * .62, 220) : Math.min((w - 10) / (n + (n - 1) * .3), Rs * .62, 220));
    const span = f1(wide ? Math.max(Rs * .5, Math.min(w - q - Rs, Rs * 1.1)) : Math.max(Rs * .4, Math.min(h - q - Rs - bh - gb, Rs * .9)));
    const W0 = wide ? f1(q + span + Rs) : f1(Math.max(Rs, n * q + (n - 1) * q * .3)), H0 = wide ? f1(Rs + bh + gb) : f1(q + span + Rs + bh + gb);
    return { w: W0, h: H0, at: (cx, cy) => { const rx = wide ? f1(cx + W0 / 2 - Rs / 2) : cx, ry = wide ? f1(cy - H0 / 2 + Rs / 2) : f1(cy + H0 / 2 - bh - gb - Rs / 2);
      const Q = Array.from({ length: n }, (_, j) => wide ? [f1(cx - W0 / 2 + q / 2), f1(ry + (j - (n - 1) / 2) * q * 1.3)] : [f1(cx + (j - (n - 1) / 2) * q * 1.3), f1(cy - H0 / 2 + q / 2)]);
      const curve = ([x0, y0]) => { const L = [], ex = wide ? rx - Rs * .3 : rx, ey = wide ? ry : ry - Rs * .3, k1 = wide ? [lerp(x0, ex, .55), y0] : [x0, lerp(y0, ey, .55)];
        for (let i = 0; i <= 14; i++) { const u = i / 14; L.push([f1((1 - u) * (1 - u) * x0 + 2 * u * (1 - u) * k1[0] + u * u * ex), f1((1 - u) * (1 - u) * y0 + 2 * u * (1 - u) * k1[1] + u * u * ey)]); } return L; };
      Q.forEach((P0, j) => { const L = curve(P0); drawAt(p.path('M ' + L.map(v => v.join(' ')).join(' L '), { sw: 2.4, stroke: TL_(.24), fill: 'none' }), p, f3(tu(.08 + .04 * j)), tu(.4)); });
      /* the receiver + its bar */
      const g0 = sIn(p, rx, ry, tu(.04)), rr = f1(Rs * .26); R(g0, rx - Rs / 2, ry - Rs / 2, Rs, Rs, rr, F(4.4));
      if (Rv && picOf(Rv)) put(p, c, { icon: Rv.icon }, rx, ry, f1(Rs * .62), null, { t: tu(.08) }); else if (Rv) txt(g0, Rv.label || '', rx, f1(ry + Rs * .08), { size: f1(Rs * .2), maxW: f1(Rs * .8), weight: 800, color: C.ink, wrap: 'mid' });
      R(LITE(p, Z.H), rx - Rs / 2, ry - Rs / 2, Rs, Rs, rr, { fill: 'none', sw: 5, stroke: ACC1 });
      const bx0 = f1(rx - Rs / 2), bw = Rs, by = f1(ry + Rs / 2 + gb + bh / 2), pad = 7, iw = bw - 2 * pad, ihh = bh - 2 * pad;
      R(sIn(p, rx, by, tu(.06)), bx0, by - bh / 2, bw, bh, bh / 2, F(4));
      const fr0 = E.up ? 0 : 1, frE = E.up ? 1 : E.keep / n, steps = [[0, fr0], [TS(E), fr0], [f3(E.H), frE]];   /* one smooth fill T0 → H */
      const fg = mvG(p, { px: bx0 + pad, py: by, sx: steps.map(([t, v], i) => i ? [t, Math.max(.0001, v), 'io'] : [t, Math.max(.0001, v)]), o: fadeIn(tu(.3), .06) }); R(fg, bx0 + pad, by - ihh / 2, iw, ihh, ihh / 2, FILL);
      const kr = f1(bh * .62), kg = mvG(p, { x: steps.map(([t, v], i) => i ? [t, f1(iw * (v - 1)), 'io'] : [t, f1(iw * (v - 1))]), o: fadeIn(tu(.3), .06) }); kg.circle(f1(bx0 + pad + iw - ihh / 2), by, kr, F(4.2)); kg.circle(f1(bx0 + pad + iw - ihh / 2), by, f1(kr * .5), KN());
      /* the travellers */
      Q.forEach((P0, j) => { const t = E.at(j), L = curve(P0);
        if (E.up) { const ts = f3(t - tu(.5)), K = pathK(L, ts, f3(t - tu(.04)), P0); K.px = P0[0]; K.py = P0[1]; K.s = [[0, 1], [f3(t - tu(.16)), 1], [f3(t - tu(.02)), .5, 'in']]; K.o = fadeIn(tu(.12 + .05 * j), .12).concat([[f3(t - tu(.12)), 1], [f3(t - tu(.02)), 0]]); delete K.when;
          thing(p, c, X, P0[0], P0[1], q, K, { t: f3(tu(.1 + .05 * j)) }); }
        if (E.up) thing(p, c, X, P0[0], P0[1], q, { px: P0[0], py: P0[1], o: [[0, 0], [f3(t - tu(.02)), 0], [f3(t + tu(.25)), .14]] }, { t: f3(t - tu(.02)) });   /* where it waited: a faint shadow */
        else if (t != null) { const K = pathK(L.slice().reverse(), t, f3(t + tu(.5)), P0); K.px = P0[0]; K.py = P0[1]; K.s = [[0, .5], [t, .5], [f3(t + tu(.16)), 1, 'out']]; K.o = [[0, 0], [t, 0], [f3(t + tu(.1)), 1], [f3(t + tu(.5)), 1], [f3(t + tu(.7)), .14]]; delete K.when;
          thing(p, c, X, P0[0], P0[1], q, K, { t: f3(t - tu(.02)) }); } }); } }; }

  /* QUEUE (INTO on a flat strip) — the receiver on the right with its bar; the things wait in a row to its left: the front one steps in and the row
     moves up one place (up) · one comes out to the front place and the row moves back (down), the ones that left stay faint. */
  function QUEUE(p, c, X, E, d, w, h) { const n = E.n, Cn = CEN(d), Rv = Cn || X, bh = f1(Math.max(26, h * .14)), gb = f1(bh * .5), Rs = f1(Math.min(h - bh - gb, 260)), gq = f1(Rs * .22);
    const q = f1(Math.min(Rs * .8, (w - Rs - gq) / (n + (n - 1) * .18))), gs = f1(q * .18), W0 = f1(Rs + gq + n * q + (n - 1) * gs), H0 = f1(Rs + gb + bh);
    return { w: W0, h: H0, at: (cx, cy) => { const rx = f1(cx + W0 / 2 - Rs / 2), ry = f1(cy - H0 / 2 + Rs / 2), sx = k => f1(rx - Rs / 2 - gq - q / 2 - k * (q + gs));
      const g0 = sIn(p, rx, ry, tu(.04)), rr = f1(Rs * .26); R(g0, rx - Rs / 2, ry - Rs / 2, Rs, Rs, rr, F(4.4));
      if (Rv && picOf(Rv)) put(p, c, { icon: Rv.icon }, rx, ry, f1(Rs * .62), null, { t: tu(.08) }); else if (Rv) txt(g0, Rv.label || '', rx, f1(ry + Rs * .08), { size: f1(Rs * .2), maxW: f1(Rs * .8), weight: 800, color: C.ink, wrap: 'mid' });
      R(LITE(p, Z.H), rx - Rs / 2, ry - Rs / 2, Rs, Rs, rr, { fill: 'none', sw: 5, stroke: ACC1 });
      const bx0 = f1(rx - Rs / 2), by = f1(ry + Rs / 2 + gb + bh / 2), pad = 6, iw = Rs - 2 * pad, ihh = bh - 2 * pad; R(sIn(p, rx, by, tu(.06)), bx0, by - bh / 2, Rs, bh, bh / 2, F(4));
      const fr0 = E.up ? 0 : 1, frE = E.up ? 1 : E.keep / n, steps = [[0, fr0], [TS(E), fr0], [f3(E.H), frE]];   /* one smooth fill T0 → H */
      R(mvG(p, { px: bx0 + pad, py: by, sx: steps.map(([t, v], i) => i ? [t, Math.max(.0001, v), 'io'] : [t, Math.max(.0001, v)]), o: fadeIn(tu(.3), .06) }), bx0 + pad, by - ihh / 2, iw, ihh, ihh / 2, FILL);
      const kr = f1(bh * .62), kg = mvG(p, { x: steps.map(([t, v], i) => i ? [t, f1(iw * (v - 1)), 'io'] : [t, f1(iw * (v - 1))]), o: fadeIn(tu(.3), .06) }); kg.circle(f1(bx0 + pad + iw - ihh / 2), by, kr, F(4.2)); kg.circle(f1(bx0 + pad + iw - ihh / 2), by, f1(kr * .5), KN());
      if (E.up) { const T = Array.from({ length: n }, (_, j) => E.at(j));
        for (let j = 0; j < n; j++) { const x0 = sx(j), X0 = x => f1(x - x0), K = { px: x0, py: ry, x: [[0, 0]] };
          for (let i = 0; i < j; i++) K.x.push([f3(T[i] - tu(.36)), X0(sx(j - i))], [f3(T[i] - tu(.04)), X0(sx(j - i - 1)), 'io']);
          K.x.push([f3(T[j] - tu(.36)), X0(sx(0))], [f3(T[j] - tu(.04)), X0(rx), 'io']); K.s = [[0, 1], [f3(T[j] - tu(.2)), 1], [f3(T[j] - tu(.02)), .5, 'in']];
          K.o = fadeIn(tu(.12 + .05 * j), .12).concat([[f3(T[j] - tu(.12)), 1], [f3(T[j] - tu(.02)), 0]]); thing(p, c, X, x0, ry, q, K, { t: f3(tu(.1 + .05 * j)) }); }
        for (let i = 0; i < n; i++) { const xv = sx(n - 1 - i), tv = f3(T[i] - tu(.04)); thing(p, c, X, xv, ry, q, { px: xv, py: ry, o: [[0, 0], [tv, 0], [f3(tv + tu(.25)), .14]] }, { t: tv }); } }   /* the place the row left behind: a faint shadow */
      else { const O = ORD(E), T = O.map(j => E.at(j)), m = O.length;
        O.forEach((j, o) => { const xf = sx(m - 1 - o), X0 = x => f1(x - xf), K = { px: xf, py: ry, x: [[0, X0(rx)], [T[o], X0(rx)], [f3(T[o] + tu(.36)), X0(sx(0)), 'io']] };
          for (let o2 = o + 1; o2 < m; o2++) K.x.push([T[o2], X0(sx(o2 - o - 1))], [f3(T[o2] + tu(.36)), X0(sx(o2 - o)), 'io']);
          K.s = [[0, .5], [T[o], .5], [f3(T[o] + tu(.2)), 1, 'out']]; K.o = [[0, 0], [T[o], 0], [f3(T[o] + tu(.08)), 1], [f3(Z.H + tu(.1)), 1], [f3(Z.H + tu(.4)), .3]];
          thing(p, c, X, xf, ry, q, K, { t: f3(T[o] - tu(.02)) }); }); } } }; }

  /* TREND — a line draws itself point by point, rising (up) or falling (down); the soft area under it follows; the thing (big, floating) rides
     the tip of the line; each point lights as it is reached. */
  function TREND(p, c, X, E, d, w, h) { const n = E.n, up = E.up, T = evN(E), ic = f1(Math.min(h * (w / h > 2.5 ? .46 : .36), w * .3, 260)), m = n;
    return { w, h, at: (cx, cy) => { const x0 = f1(cx - w / 2 + ic * .5), x1 = f1(cx + w / 2 - ic * .5), yb = f1(cy + h / 2 - 8), yt = f1(cy - h / 2 + ic + 22), lo = f1(yb - (yb - yt) * .08);
      const P = Array.from({ length: m + 1 }, (_, i) => { const u = i / m, v = up ? u : 1 - u, wig = i && i < m && i % 2 ? .07 : 0; return [f1(lerp(x0, x1, u)), f1(lerp(lo, yt, Math.max(0, v - wig)))]; });
      const t0 = TS(E), t1 = E.H; let Ls = [0]; for (let i = 1; i <= m; i++) Ls.push(Ls[i - 1] + Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]));
      const tot = Ls[m], posAt = f => { const dd = f * tot; let i = 1; while (i < m && Ls[i] < dd) i++; const u = (dd - Ls[i - 1]) / ((Ls[i] - Ls[i - 1]) || 1); return [P[i - 1][0] + (P[i][0] - P[i - 1][0]) * u, P[i - 1][1] + (P[i][1] - P[i - 1][1]) * u]; };
      /* area under the line, revealed left → right with the line's tip (a clip whose rect grows) */
      const cid = 'b02clip' + (++CID), svg = p.g.ownerSVGElement, cp = document.createElementNS(NS, 'clipPath'), cr = document.createElementNS(NS, 'rect');
      Object.entries({ x: x0, y: f1(cy - h / 2), width: f1(x1 - x0), height: h }).forEach(([k, v]) => cr.setAttribute(k, v)); cp.id = cid; cp.appendChild(cr); (svg.querySelector('defs') || svg).appendChild(cp);
      kf(cr, p.t0, { ox: x0, oy: 0, sx: sweepK(t0, t1, f => Math.max(.001, (posAt(f)[0] - x0) / (x1 - x0))) });
      const ag = sub(p, { 'clip-path': `url(#${cid})` }); ag.path('M ' + P.map(v => v.join(' ')).join(' L ') + ` L ${x1} ${yb} L ${x0} ${yb} Z`, { fill: TA(.1), sw: 0, stroke: 'none' });
      on(p.line(x0, yb, x1, yb, S(2.2)), p, 0, { draw: [[0, 0], [tu(.06), 0], [tu(.4), 1, 'out']] });
      on(p.path('M ' + P.map(v => v.join(' ')).join(' L '), { sw: 6, stroke: ACC1, fill: 'none' }), p, 0, { draw: [[0, 0], [t0, 0], [t1, 1, 'io']], o: fadeIn(t0, .04) });
      P.forEach(([x, y], i) => { const t = i ? ioAt2(Ls[i] / tot, t0, t1) : t0, g = sIn(p, x, y, f3(t - tu(.06)), .24); g.circle(x, y, 11, i ? KN() : F(3)); });
      /* the rider: sits on the tip, above the line, gliding with it */
      const lift = ic / 2 + 16, fin = P[m], K = { px: fin[0], py: fin[1] - lift, x: sweepK(t0, t1, f => f1(posAt(f)[0] - fin[0]), 40), y: sweepK(t0, t1, f => f1(posAt(f)[1] - fin[1]), 40), o: fadeIn(f3(t0 - tu(.25)), .2) };
      thing(p, c, X, fin[0], f1(fin[1] - lift), ic, K, { t: f3(t0 - tu(.3)) });
      } }; }

  /* DONUT — a ring cut into n parts round the big thing: the parts light one by one, sweeping round (up) · they go dark one by one (down) */
  function DONUT(p, c, X, E, d, w, h) { const n = E.n, R0 = f1(Math.min(w, h) / 2 * .98), bw = f1(R0 * .26), ga = n > 1 ? 9 : 0;
    return { w: 2 * R0, h: 2 * R0, at: (x, y) => { const Ri = R0 - bw, rm = f1(R0 - bw / 2), P = (r, a) => f1(x + r * Math.cos(rad(a))) + ' ' + f1(y + r * Math.sin(rad(a)));
      const sec = (a0, a1) => `M ${P(R0, a0)} A ${R0} ${R0} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${P(R0, a1)} L ${P(Ri, a1)} A ${Ri} ${Ri} 0 ${a1 - a0 > 180 ? 1 : 0} 0 ${P(Ri, a0)} Z`;
      const t0 = TS(E), t1 = E.H, f0 = E.up ? 0 : 1, f1v = E.up ? 1 : E.keep / n, fAt = u => f0 + (f1v - f0) * u;   /* lit amount, 0 → 1 of the ring */
      for (let k = 0; k < n; k++) { const a0 = -90 + k * 360 / n + ga / 2, a1 = -90 + (k + 1) * 360 / n - ga / 2, g = sIn(p, x, y, f3(tu(.04 + .04 * k)), .3);
        g.path(sec(a0, a1), F(3.6));
        const cid = 'b02sec' + (++CID), svg = p.g.ownerSVGElement, cp = document.createElementNS(NS, 'clipPath'), cpath = document.createElementNS(NS, 'path');
        cpath.setAttribute('d', sec(a0 + .6, a1 - .6)); cp.id = cid; cp.appendChild(cpath); (svg.querySelector('defs') || svg).appendChild(cp);
        const cg = sub(p, { 'clip-path': `url(#${cid})` }), seg = u => clamp01(fAt(u) * n - k);
        const arc = cg.path(`M ${P(rm, a0 - 3)} A ${rm} ${rm} 0 ${a1 - a0 > 174 ? 1 : 0} 1 ${P(rm, a1 + 3)}`, { sw: f1(bw + 6), stroke: TA(.3), fill: 'none' });   /* wider than the part, cut to it by the clip */
        arc.setAttribute('stroke-linecap', 'butt');   /* a straight leading edge, no round tip */
        const pre = E.up ? [] : [[f3(tu(.3)), 0], [f3(t0 - tu(.05)), 1, 'io']];
        on(arc, p, 0, { draw: E.up ? sweepK(t0, t1, seg, 30) : [[0, 0]].concat(pre, sweepK(t0, t1, seg, 30).slice(2)) });
        const done = E.up ? ioAt2((k + 1) / n, t0, t1) : null;
        const lit = sub(p); on(lit, p, 0, { o: E.up ? [[0, 0], [f3(done - tu(.1)), 0], [f3(done + tu(.2)), 1, 'io']] : [[0, 0], [f3(t0 - tu(.2)), 0], [f3(t0), 1, 'io']].concat(k >= E.keep ? [[f3(ioAt2((n - k - 1) / (n - E.keep), t0, t1)), 1], [f3(ioAt2((n - k - .5) / (n - E.keep), t0, t1)), 0, 'io']] : []) });
        lit.path(sec(a0, a1), { fill: 'none', sw: 4.4, stroke: ACC1 }); }
      thing(p, c, X, x, y, f1(Ri * 1.25), { px: x, py: y, o: fadeIn(tu(.1), .1) }, { t: tu(.1) }); } }; }

  /* STAIRS — the thing climbs the steps one by one (up: rising to the right) · walks down them (down: falling to the right); each step it reaches
     lights. One step shape (no boxes on boxes). keep 0 → it fades at the bottom. */
  function STAIRS(p, c, X, E, d, w, h) { const n = E.n, up = E.up, tw0 = w / n, ic = f1(Math.min(tw0 * .7, h * (w / h > 2.5 ? .5 : .42), 260)),   /* < a step's width: it never brushes the next riser */ rh = f1(Math.max(12, (h - ic - 20) / n)), Ht = f1(ic + 20 + rh * n);
    return { w, h: Ht, at: (cx, cy) => { const x0 = cx - w / 2, yb = cy + Ht / 2, tw = w / n, top = k => f1(yb - (up ? k + 1 : n - k) * rh), xs = k => f1(x0 + k * tw);
      let pts = [[f1(x0), yb]]; for (let k = 0; k < n; k++) pts.push([xs(k), top(k)], [xs(k + 1), top(k)]); pts.push([f1(x0 + w), yb]);
      const g0 = sIn(p, cx, f1(yb - rh * n / 2), tu(.04), .32); g0.path(pathOf(pts), { fill: C.fill, sw: 4, 'stroke-linejoin': 'round' });
      const ts = up ? Array.from({ length: n }, (_, k) => E.at(k)) : [f3(tu(.3))].concat(E.ts);   /* when it stands on step k */
      const at = k => [f1(xs(k) + tw / 2), f1(top(k) - ic / 2 - 16)], last = up ? n - 1 : Math.min(n - 1, E.m);
      for (let k = 0; k <= last; k++) { const t = ts[k]; if (t == null) continue; on(p.line(f1(xs(k) + 12), top(k), f1(xs(k + 1) - 12), top(k), { sw: 7, stroke: ACC1 }), p, 0, { o: [[0, 0], [t, 0], [f3(t + tu(.08)), 1]] }); }
      const fin = at(last), XK = [], YK = []; for (let k = 0; k <= last; k++) { const [x, y] = at(k), t = ts[k]; if (!k) { XK.push([0, f1(x - fin[0])], [t, f1(x - fin[0])]); YK.push([0, f1(y - fin[1])], [t, f1(y - fin[1])]); continue; }
        const [px, py] = at(k - 1), t1 = f3(ts[k - 1] + tu(.02)), tm = f3(t1 + (t - t1) * .45);   /* the whole gap: no stop between steps */
        if (up) { XK.push([t1, f1(px - fin[0])], [tm, f1(px - fin[0])], [t, f1(x - fin[0]), 'io']); YK.push([t1, f1(py - fin[1])], [tm, f1(y - 22 - fin[1]), 'io'], [t, f1(y - fin[1]), 'io']); }   /* lift first, then step over */
        else { XK.push([t1, f1(px - fin[0])], [tm, f1(x - tw * .12 - fin[0]), 'io'], [t, f1(x - fin[0]), 'io']); YK.push([t1, f1(py - fin[1])], [tm, f1(py - 6 - fin[1]), 'io'], [t, f1(y - fin[1]), 'io']); } }
      const O = fadeIn(f3(ts[0] - tu(.3)), .14).concat(!up && E.keep === 0 ? [[f3(E.H + tu(.1)), 1], [f3(E.H + tu(.4)), .14]] : []);
      thing(p, c, X, fin[0], fin[1], ic, { px: fin[0], py: fin[1], x: XK, y: YK, o: O }, { t: f3(ts[0] - tu(.32)) }); } }; }

  /* LEVEL — replaces ARRIVE (user 2026-11-25, the plain row of icons: "ทุกขนาดที่ใช้ดีไซน์นี้ดีไซน์ใหม่ด้วย" → "ดีไซน์ใหม่ออกแบบใหม่คิดใหม่"):
     ONE plate (a circle, or a capsule on flat rooms) with the thing big in the middle; inside it a soft level with a gently curved accent surface
     rises to full (up) or drains to what is kept (down) — one smooth trip T0 → H. The surface fades while it passes behind the icon (no outline on it). */
  function LEVEL(p, c, X, E, d, w, h) { const flat = w / h > 1.45, Hh = f1(Math.min(h, flat ? 560 : 620, flat ? w / 1.9 : w)), Ww = f1(flat ? Math.min(w, Hh * 1.9) : Hh), r = f1(Hh / 2);
    return { w: Ww, h: Hh, at: (x, y) => { const x0 = f1(x - Ww / 2), y0 = f1(y - Hh / 2), t0 = TS(E), t1 = E.H, f0 = E.up ? .06 : 1, fE = E.up ? 1 : Math.max(.06, E.keep / E.n);
      const pd = f1(Math.max(9, Hh * .035)), ix = x0 + pd, iy = y0 + pd, iw = Ww - 2 * pd, ih = Hh - 2 * pd, ir = f1(r - pd), lvl = f => f1(iy + ih * (1 - f));
      R(sIn(p, x, y, tu(.04), .32), x0, y0, Ww, Hh, r, F(4.4));
      const cg = clipG(p, ix, iy, iw, ih, ir), K = { y: sweepK(t0, t1, u => f1(lvl(f0 + (fE - f0) * u) - lvl(fE)), 30), o: fadeIn(f3(t0 - tu(.2)), .2) }, mg = mvG(cg, K), Ly = lvl(fE), bow = f1(Math.min(18, ih * .05));
      mg.path(`M ${f1(ix - 4)} ${Ly} Q ${f1(ix + iw / 4)} ${f1(Ly - bow)} ${f1(ix + iw / 2)} ${Ly} T ${f1(ix + iw + 4)} ${Ly} L ${f1(ix + iw + 4)} ${f1(iy + ih + 4 + ih)} L ${f1(ix - 4)} ${f1(iy + ih + 4 + ih)} Z`, { fill: TA(.2), sw: 0, stroke: 'none' });
      const surf = mg.path(`M ${f1(ix - 4)} ${Ly} Q ${f1(ix + iw / 4)} ${f1(Ly - bow)} ${f1(ix + iw / 2)} ${Ly} T ${f1(ix + iw + 4)} ${Ly}`, { sw: 6, stroke: ACC1, fill: 'none' });
      const ic = f1(Math.min(ih * .62, iw * .62, 380)), band = [y - ic * .5 - 14, y + ic * .5 + 14];
      HOOKS.push(t => { const u = rel(p, t), q = clamp01((u - t0) / Math.max(.01, t1 - t0)), yy = lvl(f0 + (fE - f0) * ioE2(q)), dd = Math.max(band[0] - yy, yy - band[1], 0); surf.setAttribute('opacity', f3(clamp01(dd / 30))); });
      thing(p, c, X, x, y, ic, { px: x, py: y, o: fadeIn(tu(.1), .16) }, { t: tu(.1) });
      R(LITE(p, Z.H), x0, y0, Ww, Hh, r, { fill: 'none', sw: 5, stroke: ACC1 }); } }; }

  const SZD = {}; for (let k = 1; k <= 7; k++) SZD[k] = [{ id: 'level', th: 'ระดับในวง', fn: (d, c) => lay(k, d, c, LEVEL) }, { id: 'into', th: 'เข้าเจ้าของ', fn: (d, c) => lay(k, d, c, INTO, { own: false }) },
    { id: 'trend', th: 'เส้นเทรนด์', fn: (d, c) => lay(k, d, c, TREND) }, { id: 'donut', th: 'วงแบ่งช่อง', fn: (d, c) => lay(k, d, c, DONUT) }, { id: 'stairs', th: 'บันได', fn: (d, c) => lay(k, d, c, STAIRS) }];
  const ROUNDS = [null, R1];
  const SAMPLES = [
    { say: 'ลูกค้าเข้าร้านมากขึ้น', dir: 'up', n: 4, item: { icon: 'user' }, center: { icon: 'store', label: 'ร้าน' } },
    { say: 'กินขนมน้อยลง (ไม่มีเจ้าของ)', dir: 'down', n: 4, keep: 1, item: { icon: 'cookie', label: 'ขนม' } },
    { say: 'อีเมลเข้ามาเรื่อย ๆ (3 ชิ้น + เจ้าของไม่มีป้าย)', dir: 'up', n: 3, item: { icon: 'mail', label: 'อีเมล' }, center: { icon: 'inbox' } },
  ];
  const STRESS = [
    { say: 'ใจรักมากขึ้น (2 ชิ้น ไม่มีป้าย)', dir: 'up', n: 2, item: { icon: 'heart' } },
    { say: 'สมาชิกออกจากกลุ่มจนหมด (+ เจ้าของ + สัญลักษณ์จบ)', dir: 'down', n: 4, keep: 0, item: { icon: 'user', label: 'สมาชิก' }, center: { icon: 'users', label: 'กลุ่มเพื่อนสมัยเรียน' }, end: 'x' },
    { say: 'ค่าใช้จ่ายลดลง (ไม่มีไอคอน · เหลือ 2 จาก 3)', dir: 'down', n: 3, keep: 2, item: { label: 'ค่าใช้จ่าย' } },
    { say: 'เงินเก็บเพิ่มขึ้น (+ สัญลักษณ์จบ ✓)', dir: 'up', n: 4, item: { icon: 'coins' }, end: 'check' },
    { say: 'งานเสร็จมากขึ้น (ไม่มีไอคอน + เจ้าของ)', dir: 'up', n: 3, item: { label: 'งาน' }, center: { icon: 'briefcase', label: 'ทีม' } },
    { say: 'ของในตะกร้าลดลง (2 ชิ้น เหลือ 1 + เจ้าของ)', dir: 'down', n: 2, keep: 1, item: { icon: 'package' }, center: { icon: 'shopping-bag' } },
  ];

  /* LONG WORDS (user 2026-11-24: "ถ้าคำยาวมากก็ไม่ต้องมีตัวอักษรเลย เพราะยังไงเสียในคลิปก็พูดถึงสิ่งนั้นอยู่แล้ว"): a label longer than LONGW
     letters (Thai marks and spaces not counted) is dropped when its thing has an icon — the icon alone shows it (and moves into the word's room
     where a design does that). No icon → the label stays (it IS the picture). B01's unit is dropped the same way. */
  const LONGW = 16;
  const glen = s => { s = String(s || '').replace(/\s+/g, ''); try { return [...new Intl.Segmenter('th', { granularity: 'grapheme' }).segment(s)].length; } catch (e) { return s.length; } };
  const iconOK = X => X && X.icon && (G.icons[X.icon] || G.icons[X.icon + '-pro']);
  const thinT = X => X && typeof X === 'object' && !Array.isArray(X) && iconOK(X) && X.label && glen(X.label) > LONGW ? Object.assign({}, X, { label: undefined }) : X;
  function trimLong(d) { if (!d || typeof d !== 'object') return d; const o = Object.assign({}, d);
    ['a', 'b', 'wrong', 'right', 'item', 'center', 'main', 'place'].forEach(k => { if (o[k]) o[k] = thinT(o[k]); });
    if (Array.isArray(o.items)) o.items = o.items.map(thinT);
    if (typeof o.unit === 'string' && glen(o.unit) > LONGW) delete o.unit; return o; }
  G.cats = G.cats || {};
  G.cats.B02S = { ROUNDS, SIZES, SAMPLES, STRESS, theme, frame, S: SZD,
    drawS: (k, i, d, c) => { d = trimLong(d); setZ(c); CUR = 's' + k + '-' + SZD[k][i].id; BOX = [SIZES[k].w, SIZES[k].h]; tokens(); EMPTY = false; BLUE = false; SZD[k][i].fn(d || {}, c); },
    draw: (r, k, d, c) => { d = trimLong(d); setZ(c); CUR = 'r' + r + 's' + k; BOX = [SIZES[k].w, SIZES[k].h]; tokens(); EMPTY = false; BLUE = false; ROUNDS[r][k](d || {}, c); }, CLAMPS };
})();
