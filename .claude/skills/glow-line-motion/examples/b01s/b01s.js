/* b01s.js — B01 "ตัวเลขเด่น" ชุด 7 ขนาด (user 2026-11-24: "เริ่มทำ B01 ชุด 7 ขนาด · Reference B01-B09 เดิม ทั้งในแง่ของการออกแบบและ animation").
   Rules of this set (user, same message): 1) the 7 sizes must not look 100% the same (similar is fine, may follow the reference)
   2) use the whole box of each size — redesign so there is no / very little empty room 3) no box needed around an icon (it may float)
   4) icons never too small. One "round" (รอบ) = one idea drawn in all 7 sizes.
   Sizes = CutPack motion-graphic standard (cutpack/style-rules/common.md 4.1), drawn at 100 % (the box centred at 0,0):
   1 860×230 · 2 860×470 · 3 560×490 · 4 400×635 · 5 860×710 · 6 860×965 · 7 400×500.
   GL.cats.B01S.draw(round, size, data, { x, y, s, at, hit }). Header + helpers copied from examples/b01t/b01t.js (not edited there). */
(function () {
  const G = window.GL, C = G.C, NS = 'http://www.w3.org/2000/svg';
  const W = (w = 2) => ({ sw: w }), F = (w = 3.2) => ({ fill: C.fill, sw: w }), S = (w = 2) => ({ sw: w, stroke: C.soft });
  const rad = d => d * Math.PI / 180, f1 = v => +v.toFixed(1);
  let GLASS = 'rgba(255,255,255,.07)', LIT = 'rgba(255,255,255,.2)'; const SOLID = (w = 2) => ({ fill: C.ink, sw: w });

  /* TIMING (same system as b01–b11): the keyword c.hit never moves; M = 1/speed but at most hit / HIT0; tu / bH / aH; kf() keeps keys in order */
  const HIT0 = 1.5; let NOBUMP = true; let Z = null; const CLAMPS = {}; let CUR = '';
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
  const art = (c, fn) => { const f = p => { p.H = Z.H; fn(p); }; f.custom = true; f.dur = .35; f.exit = NOBUMP ? 'fade' : 'pop';   /* fade = shrinks a touch in place: never grows past the box on the way out */
    const a = G.art(f, { x: c.x, y: c.y, s: c.s, at: c.at || 0, speed: 1  }); a.speed = Z.sp; return a; };
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
    else K.s = [[0, .86], [t, .86], [t + tu(.32), 1, 'out']];   /* no overshoot (A4) */
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
  const popAt = (q, x, y, t) => { const g = sub(q); on(g, q, 0, { ox: x, oy: y, s: [[0, .6], [t, .6], [t + tu(.3), 1, 'out']], o: [[0, 0], [t, 0], [t + tu(.12), 1]] }); return g; };   /* smooth ease-out, no overshoot (A4) */

  /* a THING (it) at (x, y) width w (+ its label at (lx, ly)). o.t = when it comes in · o.mv = keys of the part it rides ({ px, py, x, y, r, s }) ·
     o.punch = a bump at that time (the moment it is reached) · o.r = a fixed tilt (with its holder) · o.lt = when the label comes in */
  function pic(it, cx, cy, wd, c, o = {}) {
    if (!it) return null; const at = c.at || 0, X = c.x + cx * c.s, Y = c.y + cy * c.s, fn = picOf(it), t = o.t ?? tu(.12);
    let a;
    if (fn) a = G.art(fn, NOBUMP ? { x: X, y: Y, w: wd * c.s, at: at + t, speed: Z.sp, exit: 'fade' } : { x: X, y: Y, w: wd * c.s, at: at + t, speed: Z.sp  });   /* B01S: exit in place (never leaves the box) */
    else { const str = it.label; if (!str) return null;
      const f = q => txt(q, str, 0, wd * .11, { size: wd * .3, maxW: o.bigW || wd * 1.25, weight: 700, color: C.ink, wrap: 'mid' }); f.custom = true; f.dur = .3; f.exit = NOBUMP ? 'fade' : 'pop';
      a = G.art(f, { x: X, y: Y, s: c.s, at: at + t, speed: 1  }); a.speed = Z.sp; }
    const K = { ox: X, oy: Y }; let any = false;
    if (o.mv) { const m = o.mv; if (m.px != null) { K.ox = c.x + m.px * c.s; K.oy = c.y + m.py * c.s; }
      ['x', 'y'].forEach(n => { if (m[n]) K[n] = m[n].map(([u, v, e]) => e ? [u, f1(v * c.s), e] : [u, f1(v * c.s)]); }); ['r', 's', 'sx', 'sy'].forEach(n => { if (m[n]) K[n] = m[n]; }); any = true; }
    else if (o.r) { K.r = [[0, o.r]]; any = true; }
    if (o.o) { K.o = o.o; any = true; }
    if (any) kf(a.wrap, at, K);
    if (o.punch != null && !NOBUMP) kf(a.g, at, { ox: X, oy: Y, s: [[0, 1], [o.punch, 1], [o.punch + tu(.07), 1.14, 'out'], [o.punch + tu(.3), 1, 'soft']] });
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
    if (X && picOf(X)) put(q, c, { icon: X.icon }, x, y, s * .56, null, { t: f3(t + tu(.04)), mv: o.mv, o: o.dim ? dimK(o.dim) : undefined, punch: o.punch });
    else if (X && X.label) txt(g, X.label, x, y + s * .06, { size: s * .17, maxW: s * .84, weight: 800, color: C.ink, wrap: 'mid' }); else DOT(g, x, y, 8); return g; }
  /* a word pill centred at (x, y) sized to its words; o.dim = dims · o.strike = a line through it at that time */
  function pill(q, s, x, y, o = {}) { if (!s) return 0; const t = o.t ?? tu(.3), sz = o.size || 34, g0 = o.g || popAt(q, x, y, t), g = o.dim ? dimG(g0, o.dim) : g0;
    const tm = txt(g, s, x, y + sz * .34, { size: sz, weight: 800, color: C.ink, maxW: o.maxW || 360 }), w = Math.min(o.maxW || 360, tm.getBBox().width); R(g, x - w / 2 - 30, y - sz * .95, w + 60, sz * 1.9, sz * .95, o.lit ? { fill: LIT, sw: 3.4 } : F(3.2)); g.g.appendChild(tm);
    if (o.dim) g0.g.insertBefore(R(g0, x - w / 2 - 30, y - sz * .95, w + 60, sz * 1.9, sz * .95, BK), g0.g.firstChild);
    if (o.strike) drawAt(q.line(x - w / 2 - 12, y, x + w / 2 + 12, y, W(4)), q, o.strike, tu(.2)); return w + 60; }
  const LBL = X => X && X.label && picOf(X) ? X.label : null;   /* a separate word only when the icon is there (no icon → the word is in the box) */
  const slash = (q, x0, y0, x1, y1, t) => drawAt(q.line(x0, y0, x1, y1, W(6)), q, t, tu(.2));


  /* ================= B01S — ตัวเลขเด่น ชุด 7 ขนาด ================= */
  const clamp01 = v => Math.max(0, Math.min(1, v)), eOut = q => 1 - Math.pow(1 - q, 3);
  const VAL = d => d && d.value != null && String(d.value).trim() ? String(d.value).trim() : null;
  const UN = d => d && d.unit && String(d.unit).trim() ? String(d.unit).trim() : null;
  const ICN = d => d && d.icon && (G.icons[d.icon] || G.icons[d.icon + '-pro']) ? d.icon : null;
  const numOf = d => parseFloat(String(VAL(d) || '').replace(/,/g, ''));
  const pctV = d => /%\s*$/.test(VAL(d) || '') ? clamp01(numOf(d) / 100) : null;
  const zeroV = d => numOf(d) === 0;
  const maxOf = d => d && d.max != null && String(d.max).trim() ? parseFloat(String(d.max).replace(/,/g, '')) : NaN;
  const ratioV = d => { const p = pctV(d); if (p != null) return p; const m = maxOf(d), n = numOf(d); return m > 0 && isFinite(n) ? clamp01(n / m) : null; };
  const frac = d => zeroV(d) ? 0 : ratioV(d) ?? (d.dir === 'up' ? .82 : d.dir === 'down' ? .28 : 1);
  function fmtVal(str, q) { const m = String(str).match(/^([^\d]*)([\d,]*\.?\d*)(.*)$/); if (!m || q >= 1 || !m[2]) return str;
    const [, pre, nm, post] = m, n = parseFloat(nm.replace(/,/g, '')), dec = (nm.split('.')[1] || '').length, P = Math.pow(10, dec); let s = (NOBUMP ? Math.floor(n * q * P + 1e-6) / P : n * q).toFixed(dec);   /* floor: the digit never runs ahead of the picture */
    if (nm.includes(',')) { const [i, f] = s.split('.'); s = i.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (f ? '.' + f : ''); } return pre + s + post; }
  const tw = (q, s, size, weight = 800) => { const m = q.text(s, 0, -9999, { size, weight, anchor: 'start', dur: .01 }), w = m.getBBox().width; m.remove(); return w; };
  function num(p, q, v, x, y, o = {}) { if (!v) return null; const t0 = o.t0 ?? tu(.3), t1 = o.t1 ?? Z.H, anchor = o.anchor || 'middle';
    let size = o.size || 160; const w0 = tw(q, v, size); if (o.maxW && w0 > o.maxW) size *= o.maxW / w0; const w = Math.min(w0, o.maxW || 1e9);
    const cx = anchor === 'start' ? x + w / 2 : anchor === 'end' ? x - w / 2 : x, cy = y - size * .36;
    const g = popAt(NOBUMP ? (o.g || q) : mvG(o.g || q, { px: cx, py: cy, s: bumpK(t1, o.punch ?? 1.12) }), cx, cy, t0);
    const e = g.text(v, x, y, { size: f1(size), weight: 800, anchor, color: o.color || ACC1, dur: .01 });
    /* the count runs on the fill's own clock and ease (TQ t0 → t1, 'io') so the number and the picture reach the amount together (A2) */
    const c0 = NOBUMP ? TQ().t0 : t0, c1 = NOBUMP ? TQ().t1 : t1, ez = NOBUMP ? ioE : eOut;
    HOOKS.push(t => { const u = rel(p, t); e.textContent = u >= c1 ? v : fmtVal(v, ez(clamp01((u - c0) / Math.max(.01, c1 - c0)))); });
    return { w, size, cx, cy, x0: cx - w / 2, x1: cx + w / 2, e }; }
  function numRow(p, q, v, u, x, y, o = {}) { if (!v) return null; const s0 = o.size || 160, us0 = o.us || Math.max(40, s0 * .3), gap0 = s0 * .1;
    const nw0 = tw(q, v, s0), uw0 = u ? tw(q, u, us0, 600) : 0, k = Math.min(1, (o.maxW || 800) / (nw0 + (u ? gap0 + uw0 : 0)));
    const size = s0 * k, us = Math.max(Math.min(us0, 40), us0 * k), uw = uw0 * us / us0, tot = nw0 * k + (u ? gap0 * k + uw : 0), an = o.anchor || 'middle';
    const x0 = an === 'middle' ? x - tot / 2 : an === 'end' ? x - tot : x, n = num(p, q, v, x0, y, { size, anchor: 'start', t0: o.t0, t1: o.t1, g: o.g });
    if (u) unitIn(q, u, f1(x0 + nw0 * k + gap0 * k), y, us, 'start', 1e9);
    return { x0, x1: x0 + tot, cx: x0 + tot / 2, cy: n.cy, size, nw: nw0 * k }; }
  /* the unit: slides in just after the keyword H */
  /* the unit: comes in right with the number (user 2026-11-24: "หน่วย เล่ม ไม่ควรออกมาหลังสุด") — it slides in as the number pops, before the count ends */
  function unitIn(q, u, x, y, size, anchor = 'middle', maxW = 400, weight = 600, wrap = null) { if (!u) return; const g = sub(q); const tE = f3(tu(.38));
    on(g, q, 0, NOBUMP ? { y: [[0, 14], [tE, 14], [f3(tE + tu(.3)), 0, 'out']], o: fadeIn(tE, .14) } : { x: [[0, -24], [tE, -24], [f3(tE + tu(.2)), 0, 'out']], o: fadeIn(tE) }); txt(g, u, x, y, { size, weight: 800, anchor, color: ACC1, maxW, wrap }); }   /* same colour + weight as the number (user 2026-11-24: "เอาข้อ 1") */
  /* number + unit on one baseline across the room x0..x1 (user 2026-11-24: "ใช้คำว่าเล่มให้คุ้มกับพื้นที่หน่อย แต่ต้องรองรับข้อมูลทุกชนิดนะ"):
     the unit grows to fill what the number leaves (up to o.uMax), never under o.uMin (40); a long unit / long number shrinks the number first,
     then the unit (to uMin, then narrower). No unit → the number alone takes the room. anchor 'start' (from x0) or 'middle' (centred in x0..x1). */
  function pairRow(p, v, u, x0, x1, y, o = {}) { if (!v) return null; const room = x1 - x0, uMax = o.uMax || 120, uMin = Math.min(uMax, Math.max(40, o.uMin || (o.size || 160) * .34));
    let nS = o.size || 160; const nw0 = tw(p, v, nS);
    if (!u) { const k = Math.min(1, room / nw0), w = nw0 * k; return num(p, p, v, o.anchor === 'middle' ? (x0 + x1) / 2 : x0, y, { size: nS * k, anchor: o.anchor === 'middle' ? 'middle' : 'start', t0: o.t0 }); }
    const gap = nS * .09, u1 = tw(p, u, 100, 700) / 100;   /* unit width per px of size */
    let nw = nw0, us = Math.min(uMax, (room - nw - gap) / u1);
    if (us < uMin && o.under != null) {   /* room below (o.under = { ny, uy, uMax }: baselines of the number and the unit) → the number takes the whole width, the unit sits under it, big */
      const k = Math.min(1, room / nw0), cx = o.anchor === 'middle' ? (x0 + x1) / 2 : x0;
      const U = o.under, n = num(p, p, v, cx, U.ny, { size: nS * k, anchor: o.anchor === 'middle' ? 'middle' : 'start', t0: o.t0 }); unitIn(p, u, cx, U.uy, Math.max(40, Math.min(U.uMax, room / u1)), o.anchor === 'middle' ? 'middle' : 'start', room, 600);
      return { x0, x1, n }; }
    if (us < uMin) {
      const words = typeof Intl !== 'undefined' && Intl.Segmenter ? [...new Intl.Segmenter('th', { granularity: 'word' }).segment(u)].filter(t => t.segment.trim()).length : 1;
      const k2 = Math.max(.6, Math.min(1, (room - gap - u1 * uMin * .55) / nw0)), W2 = room - nw0 * k2 - gap * k2;
      if (words > 1 && W2 >= u1 * 40 * .55) {   /* a long unit of several words → keep the number ≥ 60 % and break the unit into two lines beside it */
        const n2 = nS * k2, nwk = nw0 * k2, g = gap * k2, us2 = Math.max(40, Math.min(uMax, W2 / (u1 * .55))), xs = o.anchor === 'middle' ? (x0 + x1 - nwk - g - Math.min(W2, u1 * us2 * .55)) / 2 : x0;
        const n = num(p, p, v, xs, y, { size: n2, anchor: 'start', t0: o.t0 }); unitIn(p, u, f1(xs + nwk + g), y, f1(us2), 'start', W2, 600, 'up');
        return { x0: xs, x1: x1, n, us: us2 }; }
      /* one word (or no room to break) → share the room: the number down to 60 %, the unit down to 40; still too wide → the number goes smaller */
      let k = Math.max(.6, Math.min(1, (room - gap - u1 * uMin) / nw0)); us = Math.max(40, Math.min(uMin, (room - nw0 * k - gap * k) / u1));
      if (nw0 * k + gap * k + u1 * us > room) k = Math.max(.3, (room - gap - u1 * us) / nw0);
      nS *= k; nw = nw0 * k; }
    const uw = Math.min(u1 * us, room - nw - gap * nS / (o.size || 160)), g2 = gap * nS / (o.size || 160), tot = nw + g2 + uw, xs = o.anchor === 'middle' ? (x0 + x1 - tot) / 2 : x0;
    const n = num(p, p, v, xs, y, { size: nS, anchor: 'start', t0: o.t0 }); unitIn(p, u, f1(xs + nw + g2), y, f1(us), 'start', uw, 600);
    return { x0: xs, x1: xs + tot, n, us }; }
  /* the unit under the number, as big as its width allows (uMax → down to 40, then narrower) */
  const unitUnder = (p, u, x, y, uMax, maxW) => { if (!u) return; const us = Math.max(40, Math.min(uMax, maxW / (tw(p, u, 100, 700) / 100))); unitIn(p, u, x, y, f1(us), 'middle', maxW, 600); };
  let FILL = { fill: LIT, sw: 0, stroke: 'none' };
  const hexRgb = h => { h = String(h).trim().replace('#', ''); if (h.length === 3) h = h.split('').map(x => x + x).join(''); const n = parseInt(h, 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
  const rgba = (h, a) => /^#[0-9a-f]{3,6}$/i.test(String(h).trim()) ? `rgba(${hexRgb(h).join(',')},${a})` : h;
  let ACC1 = C.ink, THEME = null; const TL_ = a => rgba(C.ink, a), TA = a => rgba(ACC1, a);
  function tokens() { THEME = G.themeNow; ACC1 = THEME && THEME.accent || C.ink; LIT = TA(.22); GLASS = TL_(.07); PH = { fill: TL_(.05), sw: 2, stroke: C.soft }; FILL = { fill: TA(.24), sw: 0, stroke: 'none' }; }
  function theme(t) { const r = G.theme(t); tokens(); return r; }

  /* the engine's 'io' ease (cubic in-out) and its inverse: when a filling end that eases 'io' from t0 to t1 passes fraction f */
  const ioE = u => u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;
  const ioAt = (f, t0, t1) => { let lo = 0, hi = 1; for (let k = 0; k < 30; k++) { const m = (lo + hi) / 2; if (ioE(m) < f) lo = m; else hi = m; } return f3(t0 + (t1 - t0) * lo); };
  const fillK = (t0, t1) => [[0, 0], [t0, 0], [t1, 1, 'io']];
  /* an icon box that drops in from just above the box, squashes on landing, kicks dust (from b01t) */
  function dropBox(p, c, ic, x, y, s, t0, t1, o = {}) { if (!ic) return null; if (NOBUMP) return ibox(p, c, { icon: ic }, x, y, s, t0); const by = y + s / 2, K = fallK(x, by, t0, t1, o.h ?? Math.max(120, by + 350));
    const g = mvG(CL(p), K); ibox(p, c, { icon: ic }, x, y, s, t0, { g, mv: K, punch: o.punch }); if (o.dust !== false) dust(p, x, by, t1, s / 220); return g; }
  const KN = () => ({ fill: ACC1, sw: 0, stroke: 'none' });
  /* a horizontal fill bar: the track pops in, the fill grows to fr (eases 'io' t0 → t1), a knob rides its end, a ripple on H */
  function hbar(p, x0, x1, y, h, fr, t0, t1, o = {}) { const r = h / 2; R(inG(p, 'pop', (x0 + x1) / 2, y, o.tIn ?? tu(.1)), x0, y - r, x1 - x0, h, r, F(4));
    if (fr <= 0) return null; const pad = Math.max(7, h * .13), ih = h - 2 * pad, fw = Math.max(ih, (x1 - x0 - 2 * pad) * fr);
    R(mvG(p, { px: x0, py: y, sx: fillK(t0, t1), o: fadeIn(t0, .04) }), x0 + pad, y - ih / 2, fw, ih, ih / 2, FILL);
    const kr = o.kr ?? h * .62, kx = f1(x0 + pad + fw - ih / 2), dx = f1(x0 + pad + ih / 2 - kx), kn = mvG(p, { x: [[0, dx], [t0, dx], [t1, 0, 'io']], o: fadeIn(t0, .04) });
    kn.circle(kx, y, kr, F(4.2)); kn.circle(kx, y, kr * .5, KN()); if (NOBUMP) R(litAt(p, Z.H), x0, y - r, x1 - x0, h, r, { fill: 'none', sw: 5, stroke: ACC1 }); else ripple(p, kx, y, kr + 16, Z.H); return { kx, x0: x0 + pad + ih / 2, x1: x1 - pad - ih / 2 }; }
  /* a vertical fill bar (fills bottom → top) */
  function vbar(p, x, y0, y1, w, fr, t0, t1, o = {}) { const r = w / 2; R(inG(p, 'pop', x, (y0 + y1) / 2, o.tIn ?? tu(.1)), x - r, y0, w, y1 - y0, r, F(4));
    if (fr <= 0) return null; const pad = Math.max(7, w * .13), iw = w - 2 * pad, fh = Math.max(iw, (y1 - y0 - 2 * pad) * fr);
    R(mvG(p, { px: x, py: y1, sy: fillK(t0, t1), o: fadeIn(t0, .04) }), x - iw / 2, y1 - pad - fh, iw, fh, iw / 2, FILL);
    const kr = o.kr ?? w * .6, ky = f1(y1 - pad - fh + iw / 2), dy = f1(y1 - pad - iw / 2 - ky), kn = mvG(p, { y: [[0, dy], [t0, dy], [t1, 0, 'io']], o: fadeIn(t0, .04) });
    kn.circle(x, ky, kr, F(4.2)); kn.circle(x, ky, kr * .5, KN()); if (NOBUMP) R(litAt(p, Z.H), x - r, y0, w, y1 - y0, r, { fill: 'none', sw: 5, stroke: ACC1 }); else ripple(p, x, ky, kr + 16, Z.H); return { ky, y0: y1 - pad - iw / 2, y1: y0 + pad + iw / 2 }; }
  /* a row of ticks under a bar: drawn in early, each lights when the knob passes it (a = from x, b = to x of the knob's travel) */
  function ticksH(p, a, b, y, n, len, fr, t0, t1) { for (let k = 0; k < n; k++) { const f = k / (n - 1), x = f1(lerp(a, b, f)), L = k % 5 === 0 ? len : len * .55;
      drawAt(p.line(x, y, x, y + L, S(2.2)), p, tu(.12 + .01 * k), tu(.14)); if (fr > 0 && f <= fr + 1e-6) { const t = ioAt(f / fr, t0, t1); on(p.line(x, y, x, y + L, { sw: 4, stroke: ACC1 }), p, 0, { o: [[0, 0], [t, 0], [f3(t + tu(.04)), 1]] }); } } }
  /* a row of dots that light as the knob passes */
  function dotsH(p, a, b, y, n, r, fr, t0, t1) { for (let k = 0; k < n; k++) { const f = k / (n - 1), x = f1(lerp(a, b, f)); on(p.circle(x, y, r, S(2)), p, 0, { o: fadeIn(tu(.1 + .02 * k), .06) });
      if (fr > 0 && f <= fr + 1e-6) { const t = ioAt(f / fr, t0, t1); popAt(p, x, y, t).circle(x, y, r, KN()); } } }
  /* a column of dots (bottom → top) that light as the knob passes — fills the room the icon would have used */
  function dotsV(p, x, yb, yt, n, r, fr, t0, t1) { for (let k = 0; k < n; k++) { const f = k / (n - 1), y = f1(lerp(yb, yt, f)); on(p.circle(x, y, r, S(2)), p, 0, { o: fadeIn(tu(.1 + .02 * k), .06) });
      if (fr > 0 && f <= fr + 1e-6) { const t = ioAt(f / fr, t0, t1); popAt(p, x, y, t).circle(x, y, r, KN()); } } }
  /* a free-floating icon (no box — user rule 3): drops in from just above, squashes on landing, kicks dust */
  function flo(p, c, ic, x, y, w, t0, t1, o = {}) { if (!ic) return; if (NOBUMP) return put(p, c, { icon: ic }, x, y, w, null, { t: t0 }); const by = y + w / 2, K = fallK(x, by, t0, t1, o.h ?? Math.min(260, by + BOX[1] / 2));
    put(p, c, { icon: ic }, x, y, w, null, { t: t0, mv: { px: K.px, py: K.py, y: K.y, sx: K.sx, sy: K.sy }, o: K.o, punch: o.punch }); dust(p, x, by, t1, w / 220); }

  /* the size's box drawn as a yellow outline (the sheets only — user 2026-11-24: "ทำกรอบของขนาดนั้นๆ มาให้ผมดูด้วย ใส่เส้นสีเหลือง") */
  function frame(c, W0, H0) { const f = p => { p.rect(-W0 / 2, -H0 / 2, W0, H0, { sw: 3, stroke: '#ffd400' }); };
    f.custom = true; f.dur = .01; f.exit = 'pop'; G.art(f, { x: c.x, y: c.y, s: c.s, at: 0, speed: 1  }); }

  const SIZES = [null, { w: 860, h: 230, th: 'แถบแบนยาว' }, { w: 860, h: 470, th: 'กว้าง' }, { w: 560, h: 490, th: 'เกือบจัตุรัส' }, { w: 400, h: 635, th: 'ตั้งแคบ' },
    { w: 860, h: 710, th: 'เต็มจอ ทรงนอน' }, { w: 860, h: 965, th: 'เต็มจอ ทรงตั้ง' }, { w: 400, h: 500, th: 'ตั้งแคบ สั้น' }];

  /* ---------- ROUND 1 · แถบเติม (from B01T 03 bar): the number counts up and locks on H, a thick bar fills to the amount with a knob riding its
     end, the icon drops in and lands; unit after H. Each size laid out anew for its box. ---------- */
  const R1 = { th: 'แถบเติม' };
  /* 1 · 860×230 flat strip: floating icon at the left, number over a slim bar on the right */
  R1[1] = (d, c) => { const v = VAL(d), u = UN(d), ic = ICN(d), H = Z.H, fr = frac(d), t0 = tu(.34), t1 = f3(H - tu(.04)), x0 = ic ? -235 : -410;
    art(c, p => { flo(p, c, ic, -345, -4, 170, tu(.04), tu(.28)); pairRow(p, v, u, x0, 410, 8, { size: 136, uMax: 96, t0: tu(.3) });
      hbar(p, x0, 410, 66, 54, fr, t0, t1, { kr: 34 }); }); };
  /* 2 · 860×470 wide: big number top-left, floating icon top-right, a thick bar, ticks under it */
  R1[2] = (d, c) => { const v = VAL(d), u = UN(d), ic = ICN(d), H = Z.H, fr = frac(d), t0 = tu(.34), t1 = f3(H - tu(.04));
    art(c, p => { flo(p, c, ic, 318, -116, 196, tu(.04), tu(.28)); pairRow(p, v, u, -410, ic ? 200 : 410, -36, { size: 210, uMax: 150, t0: tu(.3) });
      const b = hbar(p, -410, 410, 100, 96, fr, t0, t1, { kr: 60 }); ticksH(p, -360, 360, 182, 17, 40, fr, t0, t1); }); };
  /* 3 · 560×490 near-square: icon box dropped top-left, number + unit on its right, a fat bar, a dot row */
  R1[3] = (d, c) => { const v = VAL(d), u = UN(d), ic = ICN(d), H = Z.H, fr = frac(d), t0 = tu(.34), t1 = f3(H - tu(.04));
    art(c, p => { dropBox(p, c, ic, -168, -140, 196, tu(.04), tu(.28));
      const nx = ic ? 104 : 0; num(p, p, v, nx, u ? -104 : -70, { size: u ? 160 : 190, maxW: ic ? 320 : 520, t0: tu(.3) });
      unitUnder(p, u, nx, -16, 74, ic ? 320 : 520);
      hbar(p, -262, 262, 104, 100, fr, t0, t1, { kr: 62 }); dotsH(p, -230, 230, 212, 8, 14, fr, t0, t1); }); };
  /* 4 · 400×635 tall narrow: a tall bar on the right fills up; number + unit at the top-left, the icon floats at the bottom-left */
  R1[4] = (d, c) => { const v = VAL(d), u = UN(d), ic = ICN(d), H = Z.H, fr = frac(d), t0 = tu(.34), t1 = f3(H - tu(.04)), cx = -56;
    art(c, p => { vbar(p, 140, -300, 300, 96, fr, t0, t1, { kr: 56 }); num(p, p, v, cx, u ? -166 : -130, { size: 176, maxW: 270, t0: tu(.3) });
      unitUnder(p, u, cx, -66, 84, 270); if (ic) flo(p, c, ic, cx, 140, 262, tu(.04), tu(.28)); else dotsV(p, cx, 270, -10, 6, 17, frac(d), t0, t1); }); };
  /* 5 · 860×710 full, landscape: icon box + huge number on top, a very thick bar, a long tick scale */
  R1[5] = (d, c) => { const v = VAL(d), u = UN(d), ic = ICN(d), H = Z.H, fr = frac(d), t0 = tu(.34), t1 = f3(H - tu(.04));
    art(c, p => { dropBox(p, c, ic, -310, -212, 220, tu(.04), tu(.28)); pairRow(p, v, u, ic ? -170 : -410, 410, -100, { size: 250, uMax: 170, anchor: ic ? 'start' : 'middle', t0: tu(.3) });
      hbar(p, -410, 410, 116, 150, fr, t0, t1, { kr: 90 }); ticksH(p, -350, 350, 248, 21, 54, fr, t0, t1); }); };
  /* 6 · 860×965 full, portrait: a big floating icon on top, the number very large in the middle, the thickest bar, a tick scale */
  R1[6] = (d, c) => { const v = VAL(d), u = UN(d), ic = ICN(d), H = Z.H, fr = frac(d), t0 = tu(.34), t1 = f3(H - tu(.04));
    art(c, p => { flo(p, c, ic, 0, -330, 260, tu(.04), tu(.28)); pairRow(p, v, u, -410, 410, ic ? 46 : -70, { size: ic ? 290 : 380, uMax: ic ? 190 : 240, anchor: 'middle', t0: tu(.3), under: ic ? null : { ny: -150, uy: 40, uMax: 130 } });
      hbar(p, -410, 410, 250, 170, fr, t0, t1, { kr: 100 }); ticksH(p, -340, 340, 396, 21, 58, fr, t0, t1); }); };
  /* 7 · 400×500 short narrow: a tall bar on the LEFT; the icon floats top-right, number + unit under it */
  R1[7] = (d, c) => { const v = VAL(d), u = UN(d), ic = ICN(d), H = Z.H, fr = frac(d), t0 = tu(.34), t1 = f3(H - tu(.04)), cx = 62;
    art(c, p => { vbar(p, -142, -236, 236, 88, fr, t0, t1, { kr: 52 }); flo(p, c, ic, cx, -118, 210, tu(.04), tu(.28));
      num(p, p, v, cx, ic ? (u ? 106 : 140) : -110, { size: 150, maxW: 260, t0: tu(.3) }); unitUnder(p, u, cx, ic ? 196 : -20, 70, 260);
      if (!ic) dotsV(p, cx, 214, 30, 4, 17, frac(d), t0, t1); }); };

  /* ================= ROUNDS 2–5 (user 2026-11-25 after B12: "กลับไปทำหมวด 1" → "ใช้แบบเดิม + ใหม่ 4") — seven sizes × five designs:
     01 = round 1 (the fill bar, passed) + four new ones in the template look of B01T (rounded tiles, thick bands that fill, a knob or a needle riding
     the amount, plain big number counting up and locking on the keyword): RING (a ring fills round to the amount, the icon inside) · GAUGE (a half
     dial, a needle sweeps to the amount) · CARD (one card: icon tile + the big number) · GRID (a grid of squares lights up as the number counts).
     Everything balanced in the middle of the box (B12 lesson D14); no ripples (lesson 32). ================= */
  const arcF = (x, y, r) => `M ${x} ${f1(y - r)} A ${r} ${r} 0 1 1 ${f1(x - .1)} ${f1(y - r)}`;
  const ioK = (t0, t1, a, b) => [[0, a], [t0, a], [t1, b, 'io']];
  const litAt = (q, t) => { const g = sub(q); on(g, q, 0, { o: [[0, 0], [t, 0], [f3(t + tu(.06)), 1]] }); return g; };
  const TQ = () => ({ t0: f3(tu(.34)), t1: f3(Z.H - tu(.04)), tN: f3(tu(.3)), tV: f3(tu(.06)), tI: f3(tu(.14)) });
  /* lay items out in a row / a column centred on (cx, cy): item = { w, h, at(x, y) } (x, y = its centre) */
  const hrow = (items, gap, cx = 0, cy = 0) => { const L = items.filter(Boolean), tot = L.reduce((a, it) => a + it.w, 0) + gap * Math.max(0, L.length - 1); let x = cx - tot / 2; L.forEach(it => { it.at(f1(x + it.w / 2), cy); x += it.w + gap; }); return tot; };
  const vcol = (items, gap, cx = 0, cy = 0) => { const L = items.filter(Boolean), tot = L.reduce((a, it) => a + it.h, 0) + gap * Math.max(0, L.length - 1); let y = cy - tot / 2; L.forEach(it => { it.at(cx, f1(y + it.h / 2)); y += it.h + gap; }); return tot; };
  const asRow = (items, gap) => { const L = items.filter(Boolean); return L.length ? { w: L.reduce((a, it) => a + it.w, 0) + gap * (L.length - 1), h: Math.max(...L.map(it => it.h)), at: (x, y) => hrow(L, gap, x, y) } : null; };
  const asCol = (items, gap) => { const L = items.filter(Boolean); return L.length ? { h: L.reduce((a, it) => a + it.h, 0) + gap * (L.length - 1), w: Math.max(...L.map(it => it.w)), at: (x, y) => vcol(L, gap, x, y) } : null; };
  /* the number (+ unit) as an item: 'row' = on one baseline (pairRow) · 'stack' = the unit under the number */
  function NUM(p, d, size, uMax, room, mode = 'row') { const v = VAL(d), u = UN(d); if (!v) return null; const T = TQ();
    if (mode === 'row') { const w = Math.min(room, tw(p, v, size) + (u ? size * .09 + tw(p, u, uMax, 800) : 0));
      return { w, h: f1(size * .74), at: (x, y) => pairRow(p, v, u, f1(x - w / 2 - 2), f1(x + w / 2 + 2), f1(y + size * .37), { size, uMax, anchor: 'middle', t0: T.tN }) }; }
    const nw = Math.min(room, tw(p, v, size)), ns = size * nw / tw(p, v, size), us = u ? Math.max(40, Math.min(uMax, room / (tw(p, u, 100, 700) / 100))) : 0, uw = u ? Math.min(room, tw(p, u, us, 800)) : 0;
    const hh = ns * .74 + (u ? 16 + us * 1.12 : 0);
    return { w: Math.max(nw, uw), h: f1(hh), at: (x, y) => { const top = y - hh / 2;
      num(p, p, v, x, f1(top + ns * .74), { size: ns, maxW: room, t0: T.tN }); if (u) unitIn(p, u, x, f1(top + ns * .74 + 16 + us * .98), f1(us), 'middle', room, 600); } }; }
  /* the icon as a rounded tile */
  const ICB = (p, c, d, s) => { const ic = ICN(d); return ic ? { w: s, h: s, at: (x, y) => ibox(p, c, { icon: ic }, x, y, s, TQ().tI, { punch: Z.H }) } : null; };

  /* RING — a thick ring fills round (clockwise from the top) to the amount, a knob rides its end; its outer edge lights on the keyword */
  function ringV(p, x, y, R0, bw, fr) { const T = TQ(), g = inG(p, 'pop', x, y, T.tV); ring(g, x, y, R0, R0 - bw, F(3.6)); const rm = f1(R0 - bw / 2);
    if (fr > 0) { const a = p.path(arcF(x, y, rm), { sw: f1(bw - 14), stroke: TA(.24) }); on(a, p, 0, { draw: ioK(T.t0, T.t1, 0, f3(Math.min(.999, fr))) });
      const ka = rad(-90 + 360 * fr), kx = f1(x + rm * Math.cos(ka)), ky = f1(y + rm * Math.sin(ka)), kr = f1(bw * .62), kg = sub(p);
      on(kg, p, 0, { ox: x, oy: y, r: ioK(T.t0, T.t1, f1(-360 * fr), 0), o: fadeIn(T.t0, .04) }); kg.circle(kx, ky, kr, F(4.2)); kg.circle(kx, ky, f1(kr * .5), KN()); }
    litAt(p, Z.H).circle(x, y, R0, { fill: 'none', sw: 5, stroke: ACC1 }); }
  /* the unit alone as an item (big, accent) */
  const UNI = (p, d, size, room) => { const u = UN(d); if (!u) return null; const us = Math.max(40, Math.min(size, room / (tw(p, u, 100, 800) / 100))), w = Math.min(room, tw(p, u, us, 800));
    return { w, h: f1(us * 1.1), at: (x, y) => unitIn(p, u, x, f1(y + us * .36), f1(us), 'middle', room, 600) }; };
  /* a ring with no icon: the value counts up inside it (the unit goes beside or under it — UNI) */
  const RINGV = (p, d, R0, bw) => ({ w: 2 * R0, h: 2 * R0, at: (x, y) => { ringV(p, x, y, R0, bw, frac(d)); const v = VAL(d); if (!v) return; const mw = f1(2 * (R0 - bw - 12)), sz = f1(Math.min((R0 - bw) * 1.05, 260));
    const k = Math.min(1, mw / tw(p, v, sz)); num(p, p, v, x, f1(y + sz * k * .36), { size: f1(sz * k), t0: TQ().tN }); } });
  /* a ring item; inside: the icon (or nothing) */
  const RING = (p, c, d, R0, bw, iw) => ({ w: 2 * R0, h: 2 * R0, at: (x, y) => { ringV(p, x, y, R0, bw, frac(d)); const ic = ICN(d); if (ic && iw) put(p, c, { icon: ic }, x, y, iw, null, { t: TQ().tI, punch: Z.H }); } });
  /* GAUGE — a half dial (band with round ends, ticks inside): the band fills left → right to the amount and a needle sweeps with it */
  function gaugeV(p, x, y, R0, bw, fr) { const T = TQ(), Ri = R0 - bw, e = f1(bw / 2), g = inG(p, 'pop', x, f1(y - R0 / 2), T.tV);
    g.path(`M ${x - R0} ${y} A ${R0} ${R0} 0 0 1 ${x + R0} ${y} A ${e} ${e} 0 0 1 ${x + Ri} ${y} A ${Ri} ${Ri} 0 0 0 ${x - Ri} ${y} A ${e} ${e} 0 0 1 ${x - R0} ${y} Z`, F(3.6));
    const rm = f1(R0 - bw / 2); if (fr > 0) { const a = p.path(`M ${x - rm} ${y} A ${rm} ${rm} 0 0 1 ${x + rm} ${y}`, { sw: f1(bw - 14), stroke: TA(.24) }); on(a, p, 0, { draw: ioK(T.t0, T.t1, 0, f3(fr)) }); }
    for (let k = 0; k <= 10; k++) { const an = rad(180 + 18 * k), r1 = Ri - 16, r2 = Ri - (k % 5 ? 30 : 44);
      drawAt(p.line(f1(x + r1 * Math.cos(an)), f1(y + r1 * Math.sin(an)), f1(x + r2 * Math.cos(an)), f1(y + r2 * Math.sin(an)), S(2.4)), p, f3(T.tV + tu(.1 + .015 * k)), tu(.12)); }
    const L = Ri - 58, an = rad(180 + 180 * fr), ng = sub(p), hw = Math.max(9, R0 * .045), tip = [f1(x + L * Math.cos(an)), f1(y + L * Math.sin(an))], b1 = [f1(x - hw * Math.sin(an)), f1(y + hw * Math.cos(an))], b2 = [f1(x + hw * Math.sin(an)), f1(y - hw * Math.cos(an))];
    on(ng, p, 0, { ox: x, oy: y, r: ioK(T.t0, T.t1, f1(-180 * fr), 0), o: fadeIn(f3(T.tV + tu(.14)), .06) }); shape(ng, [b1, tip, b2], F(3.2));
    const hb = popAt(p, x, y, f3(T.tV + tu(.14))), hr = Math.max(18, R0 * .085); hb.circle(x, y, f1(hr), F(4)); hb.circle(x, y, f1(hr * .42), KN());
    litAt(p, Z.H).path(`M ${x - R0} ${y} A ${R0} ${R0} 0 0 1 ${x + R0} ${y}`, { fill: 'none', sw: 5, stroke: ACC1 }); }
  const hubR = R0 => Math.max(18, R0 * .085);
  const GAUGE = (p, d, R0, bw) => { const hr = hubR(R0); return { w: 2 * R0, h: f1(R0 + hr), at: (x, y) => gaugeV(p, x, f1(y - (R0 + hr) / 2 + R0), R0, bw, frac(d)) }; };
  /* GRID — squares light one by one (from the bottom row up) to the amount, in step with the count; lit = soft fill + accent edge */
  function gridV(p, x0, y0, cols, rows, cell, gap, fr) { const T = TQ(), n = cols * rows, lit = Math.round(n * fr), rx = f1(cell * .24);
    for (let k = 0; k < n; k++) { const i = k % cols, j = rows - 1 - Math.floor(k / cols), x = f1(x0 + i * (cell + gap)), y = f1(y0 + j * (cell + gap));
      const g = sub(p); on(g, p, 0, { o: fadeIn(f3(T.tV + tu(.006 * (i + 2 * (rows - 1 - j)))), .08) }); R(g, x, y, cell, cell, rx, { fill: C.fill, sw: 2.4, stroke: TL_(.4) });
      if (k < lit) { const t = ioAt((k + 1) / lit, T.t0, T.t1), q = sub(p); on(q, p, 0, { ox: f1(x + cell / 2), oy: f1(y + cell / 2), s: [[0, .6], [t, .6], [f3(t + tu(.12)), 1, 'out']], o: fadeIn(t, .05) });
        R(q, x, y, cell, cell, rx, { fill: TA(.3), sw: 3, stroke: ACC1 }); } } }
  const GRID = (p, d, cols, rows, cell, gap) => { const w = cols * (cell + gap) - gap, h = rows * (cell + gap) - gap; return { w, h, at: (x, y) => gridV(p, f1(x - w / 2), f1(y - h / 2), cols, rows, cell, gap, frac(d)) }; };
  /* CARD — one card fills the box (rises in), its edge lights on the keyword; the caller lays the icon tile and the number inside */
  function cardBox(p, rr = 40) { const [W0, H0] = BOX, w = W0 - 16, h = H0 - 16, g = mvG(CL(p), { px: 0, py: 0, s: [[0, .96], [tu(.02), .96], [f3(tu(.36)), 1, 'out']], o: fadeIn(tu(.02), .14) }); R(g, -w / 2, -h / 2, w, h, f1(Math.min(rr, h * .2)), F(3.6));
    const L = litAt(p, Z.H); R(L, -w / 2, -h / 2, w, h, f1(Math.min(rr, h * .2)), { fill: TA(.05), sw: 5, stroke: ACC1 }); return { w, h }; }

  /* the four new designs for one size: R.ring / R.gauge / R.card / R.grid = (d, c) → draws */
  const NEW = {};
  /* 1 · 860 × 230 — everything in one line */
  NEW[1] = {
    ring: (d, c) => art(c, p => { const ic = ICN(d); hrow(ic ? [RING(p, c, d, 100, 28, 104), NUM(p, d, 140, 96, 540)] : [RINGV(p, d, 100, 28), UNI(p, d, 110, 520)], 44); }),
    gauge: (d, c) => art(c, p => { hrow([GAUGE(p, d, 176, 30), ICB(p, c, d, 116), NUM(p, d, 136, 92, ICN(d) ? 280 : 430)], 34); }),
    card: (d, c) => art(c, p => { cardBox(p); hrow([ICB(p, c, d, 150), NUM(p, d, ICN(d) ? 150 : 168, 104, ICN(d) ? 560 : 760)], 40); }),
    grid: (d, c) => art(c, p => { hrow([GRID(p, d, 9, 4, 36, 9), ICB(p, c, d, 110), NUM(p, d, 132, 90, ICN(d) ? 250 : 390)], 30); }) };
  /* 2 · 860 × 470 — wide: the visual on the left, the number on the right */
  NEW[2] = {
    ring: (d, c) => art(c, p => { hrow(ICN(d) ? [RING(p, c, d, 200, 44, 200), NUM(p, d, 210, 140, 360, 'stack')] : [RINGV(p, d, 210, 44), UNI(p, d, 150, 360)], 50); }),
    gauge: (d, c) => art(c, p => { hrow([GAUGE(p, d, 225, 44), asCol([ICB(p, c, d, 110), NUM(p, d, 160, 110, 300, 'stack')], 22)], 40); }),
    card: (d, c) => art(c, p => { cardBox(p); hrow([ICB(p, c, d, 250), NUM(p, d, 220, 150, ICN(d) ? 460 : 760, 'stack')], 50); }),
    grid: (d, c) => art(c, p => { hrow([GRID(p, d, 9, 7, 40, 10), asCol([ICB(p, c, d, 104), NUM(p, d, 150, 100, 290, 'stack')], 20)], 40); }) };
  /* 3 · 560 × 490 — nearly square: the number inside the ring · the dial over the number · tile over number · number over the grid */
  NEW[3] = {
    ring: (d, c) => art(c, p => { const R0 = 228, bw = 38, Ri = R0 - bw, ic = ICN(d); ringV(p, 0, 0, R0, bw, frac(d));
      vcol([ICB(p, c, d, 96) && { w: 96, h: 96, at: (x, y) => put(p, c, { icon: ic }, x, y, 96, null, { t: TQ().tI, punch: Z.H }) }, NUM(p, d, ic ? 120 : 150, 70, f1(1.22 * Ri), 'stack')], 18); }),
    gauge: (d, c) => art(c, p => { vcol([GAUGE(p, d, 246, 44), asRow([ICB(p, c, d, 104), NUM(p, d, 132, 90, ICN(d) ? 380 : 500)], 24)], 34); }),
    card: (d, c) => art(c, p => { cardBox(p); vcol([ICB(p, c, d, 180), NUM(p, d, ICN(d) ? 150 : 180, 100, 480)], 30); }),
    grid: (d, c) => art(c, p => { vcol([asRow([ICB(p, c, d, 104), NUM(p, d, 132, 90, ICN(d) ? 380 : 500)], 24), GRID(p, d, 10, 5, 40, 9)], 34); }) };
  /* 4 · 400 × 635 — tall and narrow: top → bottom */
  NEW[4] = {
    ring: (d, c) => art(c, p => { vcol(ICN(d) ? [RING(p, c, d, 176, 36, 170), NUM(p, d, 140, 80, 360)] : [RINGV(p, d, 186, 38), UNI(p, d, 96, 360)], 44); }),
    gauge: (d, c) => art(c, p => { vcol([ICB(p, c, d, 130), GAUGE(p, d, 180, 36), NUM(p, d, 130, 76, 360)], 40); }),
    card: (d, c) => art(c, p => { cardBox(p); vcol([ICB(p, c, d, 200), NUM(p, d, 150, 84, 340, 'stack')], 40); }),
    grid: (d, c) => art(c, p => { vcol([asRow([ICB(p, c, d, 84), NUM(p, d, 116, 70, ICN(d) ? 260 : 360)], 16), GRID(p, d, 6, 7, 46, 10)], 40); }) };
  /* 5 · 860 × 710 — full screen, landscape */
  NEW[5] = {
    ring: (d, c) => art(c, p => { hrow(ICN(d) ? [RING(p, c, d, 250, 52, 240), NUM(p, d, 210, 140, 260, 'stack')] : [RINGV(p, d, 260, 54), UNI(p, d, 150, 260)], 44); }),
    gauge: (d, c) => art(c, p => { vcol([GAUGE(p, d, 340, 58), asRow([ICB(p, c, d, 150), NUM(p, d, 200, 140, ICN(d) ? 600 : 780)], 30)], 44); }),
    card: (d, c) => art(c, p => { cardBox(p); hrow([ICB(p, c, d, 320), NUM(p, d, 250, 160, ICN(d) ? 400 : 760, 'stack')], 56); }),
    grid: (d, c) => art(c, p => { hrow([GRID(p, d, 10, 10, 42, 9), asCol([ICB(p, c, d, 130), NUM(p, d, 170, 110, 250, 'stack')], 26)], 40); }) };
  /* 6 · 860 × 965 — full screen, portrait */
  NEW[6] = {
    ring: (d, c) => art(c, p => { vcol(ICN(d) ? [RING(p, c, d, 300, 60, 290), NUM(p, d, 250, 170, 800)] : [RINGV(p, d, 320, 62), UNI(p, d, 170, 760)], 56); }),
    gauge: (d, c) => art(c, p => { vcol([ICB(p, c, d, 200), GAUGE(p, d, 380, 64), NUM(p, d, 240, 160, 800)], 44); }),
    card: (d, c) => art(c, p => { cardBox(p); vcol([ICB(p, c, d, 330), NUM(p, d, 240, 170, 760, 'stack')], 60); }),
    grid: (d, c) => art(c, p => { vcol([asRow([ICB(p, c, d, 170), NUM(p, d, 220, 150, ICN(d) ? 590 : 800)], 34), GRID(p, d, 10, 10, 56, 13)], 50); }) };
  /* 7 · 400 × 500 — small portrait */
  NEW[7] = {
    ring: (d, c) => art(c, p => { const R0 = 186, bw = 32, Ri = R0 - bw, ic = ICN(d); ringV(p, 0, 0, R0, bw, frac(d));
      vcol([ic && { w: 74, h: 74, at: (x, y) => put(p, c, { icon: ic }, x, y, 74, null, { t: TQ().tI, punch: Z.H }) }, NUM(p, d, ic ? 100 : 124, 60, f1(1.22 * Ri), 'stack')], 12); }),
    gauge: (d, c) => art(c, p => { vcol([GAUGE(p, d, 178, 34), asRow([ICB(p, c, d, 86), NUM(p, d, 120, 70, ICN(d) ? 266 : 370)], 16)], 34); }),
    card: (d, c) => art(c, p => { cardBox(p); vcol([ICB(p, c, d, 156), NUM(p, d, 130, 76, 340, 'stack')], 30); }),
    grid: (d, c) => art(c, p => { vcol([asRow([ICB(p, c, d, 86), NUM(p, d, 120, 70, ICN(d) ? 266 : 370)], 16), GRID(p, d, 8, 5, 36, 9)], 30); }) };
  /* the five designs of each size (01 = round 1) */
  const SZD = {}; for (let k = 1; k <= 7; k++) SZD[k] = [{ id: 'bar', th: 'แถบเติม', fn: (d, c) => R1[k](d, c) }, { id: 'ring', th: 'วงแหวนเติม', fn: NEW[k].ring },
    { id: 'gauge', th: 'หน้าปัดเข็ม', fn: NEW[k].gauge }, { id: 'card', th: 'การ์ดตัวเลข', fn: NEW[k].card }, { id: 'grid', th: 'ตารางช่องติดไฟ', fn: NEW[k].grid }];

  const ROUNDS = [null, R1];
  const SAMPLES = [
    { say: 'อ่านไป 9 จาก 12 เล่ม', value: '9', max: '12', unit: 'เล่ม', icon: 'book-open' },
    { say: 'ลูกค้ากลับมาซื้อซ้ำ 68%', value: '68%', icon: 'users' },
    { say: 'นอนวันละ 8 ชั่วโมง (ไม่มีค่าเต็ม ไม่มีไอคอน)', value: '8', unit: 'ชั่วโมง' },
  ];
  const STRESS = [
    { say: 'เก็บเงินได้ 1,250,000 บาท (9 หลัก ไม่มีไอคอน)', value: '1,250,000', unit: 'บาท' },
    { say: 'ran 42 kilometers (English · ไม่มีค่าเต็ม)', value: '42', unit: 'kilometers', icon: 'bike' },
    { say: '90% ของคนทำงานเหนื่อย (หน่วยยาว)', value: '90%', unit: 'ของคนทำงาน', icon: 'briefcase' },
    { say: 'สมาชิกใหม่ 4,800 คน (หน่วยสั้นมาก)', value: '4,800', unit: 'คน', icon: 'user-plus', dir: 'up' },
    { say: 'เงินเหลือ 0 บาท (ศูนย์)', value: '0', unit: 'บาท', icon: 'wallet' },
    { say: 'เวลาว่างลดเหลือ 3.5 ชั่วโมง (ลดลง)', value: '3.5', unit: 'ชั่วโมง', icon: 'clock', dir: 'down' },
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
  G.cats.B01S = { ROUNDS, SIZES, SAMPLES, STRESS, theme, frame, S: SZD,
    drawS: (k, i, d, c) => { d = trimLong(d); setZ(c); CUR = 's' + k + '-' + SZD[k][i].id; BOX = [SIZES[k].w, SIZES[k].h]; tokens(); EMPTY = false; BLUE = false; SZD[k][i].fn(d || {}, c); },
    draw: (r, k, d, c) => { d = trimLong(d); setZ(c); CUR = 'r' + r + 's' + k; BOX = [SIZES[k].w, SIZES[k].h]; tokens(); EMPTY = false; BLUE = false; ROUNDS[r][k](d || {}, c); }, CLAMPS };
})();
