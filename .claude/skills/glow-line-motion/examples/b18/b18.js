/* b18.js — category B18 "เหตุการณ์" (an event: what happened, who, when). House style of B01–B17, line weight of B16–B17 (bold bright outlines,
   round corners, few thin inner lines, big clear icons). Designs from the user's ideas in references/cutpack-visual-ideas.md ("เหตุการณ์", 20 ideas).
   CutPack (references/cutpack-CATEGORIES.md v2, cat_ai.py): what THING (the event) · who THING (optional) · when = words as said (optional).
   People drawn in a scene are part of the design (whole bodies, no faces/hands); the `who` slot shows as a round badge with its icon.
   GL.cats.B18.draw(i, data, { x, y, s, at, hit, speed }) — canvas 1000 × 700 centred at (0,0); hit = seconds after `at` (default 1.9). */
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
    cp.id = 'b18clip' + (++CID); Object.entries({ x, y, width: w, height: h }).forEach(([k, v]) => r.setAttribute(k, v)); cp.appendChild(r);
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




  /* ---------- the data: what (the event) · who (optional) · when (words, optional) ---------- */
  const WH = d => d && has(d.what) ? d.what : null;
  const WO = d => d && d.who && has(d.who) ? d.who : null;
  const WN = d => d && d.when && String(d.when).trim() ? String(d.when).trim() : null;
  const DOT = (q, x, y, r = 8) => q.circle(x, y, r, SOLID(1));
  const whatV = (q, c, X, x, y, w, ly, o = {}) => hero(q, c, X, x, y, w, ly, Object.assign({ rip: false, size: 44, maxW: 380, bigSize: 54, bigW: 420 }, o));
  const whatH = (q, c, X, ix, iy, w, lx, o = {}) => heroH(q, c, X, ix, iy, w, lx, iy + (o.dy ?? 18), Object.assign({ rip: false, size: 50, maxW: 420, bigSize: 56, bigW: 600 }, o));
  /* who: a round badge with its icon (its label under it); no icon → the label in the badge */
  function whoB(q, c, Wd, x, y, r = 56, o = {}) { const W0 = Wd; if (!W0) return; const t = o.t ?? Z.H, g = popAt(q, x, y, t); ring(g, x, y, r, r - 12, F(3.4)); g.circle(x, y, r - 12, F(1));
    if (picOf(W0)) { put(q, c, { icon: W0.icon }, x, y, r * 1.15, null, { t: t + tu(.04), punch: t + tu(.18) }); if (W0.label && o.label !== false) txt(atG(q, t + tu(.14)), W0.label, x, y + r + (o.ly ?? 34), { size: o.size || 26, maxW: o.maxW || 220, weight: 700, color: C.ink }); }
    else if (W0.label) txt(g, W0.label, x, y + 9, { size: 26, maxW: r * 1.6, weight: 800, color: C.ink }); }
  /* when: a pill tag with the words as said */
  function whenT(q, s, x, y, w = 280, o = {}) { if (!s) return; const g = popAt(q, x, y, o.t ?? Z.H); R(g, x - w / 2, y - 30, w, 60, 30, F(3.4)); DOT(g, x - w / 2 + 30, y, 7); txt(g, s, x + 12, y + 10, { size: o.size || 28, maxW: w - 76, weight: 700, color: C.ink }); }
  const lamp = (q, x, y, k = 1, a = 0) => { const g = rot(q, a, x, y); shape(g, [[x - 34 * k, y], [x + 34 * k, y], [x + 58 * k, y + 40 * k], [x - 58 * k, y + 40 * k]], F(3.4)); return g; };

  /* ---------- motion (user 2026-11-14 "ทำเคลื่อนไหวได้"): the scene comes in part by part (people rise in, things drop or stand up) → the
     happening starts (a light comes on, a screen boots, a banner unfurls, a ribbon is cut, a jump …) → who and when come in → the event lands
     on the keyword H → hold. T0 = the happening (a long sentence waits, then goes). Last frame = the approved still. ---------- */
  const tW = Q => f3(Q.T0 + tu(.2)), tN = Q => f3(Q.T0 + tu(.32));
  const flick = (q, t) => { const g = sub(q); on(g, q, 0, { o: [[0, 0], [t, 0], [t + tu(.04), .8], [t + tu(.08), .1], [t + tu(.14), 1], [t + tu(.18), .3], [t + tu(.26), 1]] }); return g; };
  /* an arm raised from rest: r0 = the turn from the raised pose back down to rest (upper), f0 = the same for the forearm */
  const raise = (hm, p, sd, s, e, r0, f0, t0, t1) => { hm.on('upper' + sd, p, 0, { ox: s[0], oy: s[1], r: armK(r0, t0, t1, sd * -4) }); hm.on('fore' + sd, p, 0, { ox: e[0], oy: e[1], r: armK(f0, t0, t1, 0) }); };
  const swingFit = (t0, end, a = 6) => { const L = Math.max(tu(.2), end - t0), at = k => f3(t0 + L * k);
    return { y: [[0, -300], [Math.max(0, t0 - tu(.18)), -300], [t0, 10, 'in'], [f3(t0 + tu(.06)), 0, 'out']],
      r: [[0, 0], [t0, 0], [at(.3), a, 'out'], [at(.6), -a * .5, 'io'], [at(.85), a * .2, 'io'], [at(1), 0, 'soft']], o: fadeIn(Math.max(0, t0 - tu(.18))) }; };

  /* 01 ── IN THE SPOTLIGHT: the plaque pops onto the wall, the lamp drops in on its rod; the person rises onto the floor mark; the spotlight
     flickers on and the floor circle lights; who and when come; the event lands on the plaque */
  variant('spotlight', 'คนยืนอยู่ในเหตุการณ์', (d, c) => { const X = WH(d), Wh = WO(d), T = WN(d), lx = 190, Q = TL();
    art(c, p => { floorD(p); const lg = flick(p, Q.T0);
      shape(lg, [[lx - 80, -250], [lx + 80, -250], [lx + 230, 262], [lx - 230, 262]], { fill: 'rgba(255,255,255,.06)', sw: 0, stroke: 'none' }); ell(lg, lx, 262, 230, 30, { fill: 'rgba(255,255,255,.1)', sw: 0, stroke: 'none' });
      ell(p, lx, 262, 230, 30, S(2)); const lp = inG(CL(p), 'drop', lx, -280, tu(.14)); lp.line(lx, -350, lx, -296, W(3)); lamp(lp, lx, -296, 1.4);
      front(inG(p, 'rise', lx, 160, tu(.3)), lx, 262, .86);
      disc(inG(p, 'pop', -270, -70, tu(.04)), -270, -70, 170); whatV(p, c, X, -270, -106, 120, 12, { size: 34, maxW: 230, bigW: 250, bigSize: 42 });
      whoB(p, c, Wh, -130, -210, 50, { label: false, t: tW(Q) }); whenT(p, T, -270, 166, 260, { t: tN(Q) });
    }); });

  /* 02 ── ON THE SCREEN: the stand rises, the screen pops on; it boots (a flicker), the live dot blinks; the picture-in-picture pops, the lower bar
     slides in with the when; the event comes up on the screen */
  variant('screen', 'ภาพเหตุการณ์บนหน้าจอ', (d, c) => { const X = WH(d), Wh = WO(d), T = WN(d), Q = TL();
    art(c, p => { floorD(p); const st = inG(p, 'rise', 0, 230, tu(.04)); R(st, -16, 180, 32, 90, 6, F(3)); ell(st, 0, 274, 170, 16, F(3.4));
      R(inG(p, 'pop', 0, -50, tu(.16)), -420, -290, 840, 480, 30, F(4.8)); R(flick(p, Q.T0), -390, -260, 780, 420, 12, { fill: 'rgba(255,255,255,.06)', sw: 1.6, stroke: C.soft });
      const lv = sub(p); on(lv, p, 0, { o: [[0, 0], [Q.T0 + tu(.2), 0], [Q.T0 + tu(.22), 1], [Q.T0 + tu(.4), .2], [Q.T0 + tu(.58), 1]] }); lv.circle(-350, -222, 11, SOLID(1)); lv.circle(-350, -222, 20, S(1.6));
      whatV(p, c, X, -20, -96, 150, 40, { size: 46, maxW: 470 });
      if (Wh) { R(popAt(p, 285, -165, tW(Q)), 200, -240, 170, 150, 14, F(3.4)); put(p, c, { icon: Wh.icon }, 285, -165, 90, null, { t: tW(Q) + tu(.04) }); }
      if (T) { const lb = mvG(p, { px: -390, py: 126, sx: [[0, 0], [tN(Q), 0], [tN(Q) + tu(.25), 1, 'out']], o: fadeIn(tN(Q), .04) }); R(lb, -390, 92, 780, 68, 0, { fill: 'rgba(255,255,255,.12)', sw: 0, stroke: 'none' }); txt(atG(p, tN(Q) + tu(.16)), T, -360, 138, { size: 34, maxW: 700, weight: 700, color: C.ink, anchor: 'start' }); }
    }); });

  /* 03 ── THE GATHERING: the poles rise; the people rise in one by one; the banner unrolls across from the left pole; two raise an arm; the event
     lands on the banner */
  variant('gathering', 'กลุ่มคนรวมตัวกัน', (d, c) => { const X = WH(d), Wh = WO(d), T = WN(d), Q = TL(), uE = f3(Q.T0 + tu(.3));
    art(c, p => { floorD(p); [-430, 430].forEach((x, i) => { const g = inG(p, 'rise', x, 0, tu(.04 + .05 * i)); R(g, x - 9, -310, 18, 600, 6, F(2.6)); g.circle(x, -318, 12, F(2.4)); });
      const bn = mvG(p, { px: -390, py: -190, sx: [[0, .02], [Q.T0 - tu(.1), .02], [uE, 1.02, 'out'], [uE + tu(.1), 1, 'soft']], o: fadeIn(Q.T0 - tu(.1), .02) });
      R(bn, -390, -290, 780, 200, 18, F(4.8)); [[-390, -270], [-390, -110], [390, -270], [390, -110]].forEach(([x, y]) => drawAt(p.line(x, y, x < 0 ? -421 : 421, y, W(2.4)), p, x < 0 ? Q.T0 - tu(.1) : uE, tu(.1)));
      whatH(p, c, X, -280, -190, 100, -200, { cx: 0, maxW: 470, bigW: 680 }); whoB(p, c, Wh, 320, -190, 46, { label: false, t: tW(Q) + tu(.1) });
      [[-300, .7, 0], [-150, .8, 1], [0, .86, 0], [150, .8, -1], [300, .7, 0]].forEach(([x, k, up], i) => { const hm = front(inG(p, 'rise', x, 150, tu(.2 + .07 * i)), x, 290, k, up ? { [up]: { s: [up * 36, -82], e: [up * 86, -140], h: [up * 70, -212] } } : {});
        if (up) raise(hm, p, up, [up * 36, -82], [up * 86, -140], up * 123, up * 65, f3(Q.T0 + tu(.3 + .1 * i / 2)), f3(Q.T0 + tu(.6 + .1 * i / 2))); });
      whenT(p, T, 0, -44, 260, { t: tN(Q) + tu(.1) });
    }); });

  /* 04 ── THE MARCH BANNER: the two people slide in from the sides; the banner comes up between them on its sticks (out of the ground), stops at
     their hands with a bob; the event lands on it */
  variant('march', 'คนถือป้ายในงาน', (d, c) => { const X = WH(d), Wh = WO(d), T = WN(d), k = .92, Q = TL(), tU = Q.T0, tE = f3(Q.T0 + tu(.36));
    art(c, p => { floorD(p);
      const bn = mvG(clipG(p, -500, -350, 1000, 640), { y: [[0, 580], [tU, 580], [tE, -10, 'out'], [tE + tu(.12), 0, 'soft']] });
      [-1, 1].forEach(sd => R(bn, sd * 300 - 8, -232, 16, 270, 5, F(2.6))); R(bn, -300, -250, 600, 220, 16, F(4.8));
      [-1, 1].forEach(sd => { const x = sd * 340; front(mvG(p, { x: [[0, sd * 180], [tu(.04), sd * 180], [tu(.4), -sd * 6, 'out'], [tu(.5), 0, 'soft']], o: fadeIn(tu(.04)) }), x, 290, k, { [-sd]: { s: [-sd * 36, -82], e: [-sd * 62, -150], h: [-sd * 42, -214] } }); });
      whatH(p, c, X, -200, -140, 100, -120, { cx: 0, maxW: 360, bigW: 540, size: 46 });
      whoB(p, c, Wh, 250, -232, 40, { label: false, t: tW(Q) + tu(.2) }); whenT(p, T, 0, 30, 260, { t: tN(Q) + tu(.2) });
    }); });

  /* 05 ── THE MEETING: the screen pops on the wall; the table slides in; the three sit down behind it one by one; the screen comes on; the event */
  variant('meeting', 'ภาพคนกำลังประชุม', (d, c) => { const X = WH(d), Wh = WO(d), T = WN(d), Q = TL();
    art(c, p => { R(inG(p, 'pop', 0, -180, tu(.04)), -300, -330, 600, 300, 20, F(4.6)); R(flick(p, Q.T0), -284, -314, 568, 268, 12, { fill: 'rgba(255,255,255,.06)', sw: 0, stroke: 'none' });
      whatV(p, c, X, 0, -206, 120, -86, { size: 40, maxW: 500 }); whoB(p, c, Wh, 250, -290, 40, { label: false, t: tW(Q) });
      const cl = clipG(p, -500, -350, 1000, 470); [-260, 0, 260].forEach((x, i) => front(mvG(cl, { y: [[0, 220], [tu(.3 + .08 * i), 220], [tu(.56 + .08 * i), -6, 'out'], [tu(.64 + .08 * i), 0, 'soft']] }), x, 290, .8));
      const tb = mvG(p, { x: slideX(tu(.14), -200), o: fadeIn(tu(.14)) }); R(tb, -450, 118, 900, 32, 12, F(4.4)); R(tb, -420, 150, 840, 140, 6, F(4)); whenT(p, T, 0, 220, 300, { t: tN(Q) });
    }); });

  /* 06 ── THE AUDIENCE: the screen pops up front; the audience fills the rows from the back; the screen comes on; the event */
  variant('audience', 'กลุ่มคนกำลังรับฟัง', (d, c) => { const X = WH(d), Wh = WO(d), T = WN(d), Q = TL();
    art(c, p => { R(inG(p, 'pop', 0, -165, tu(.04)), -360, -330, 720, 330, 22, F(4.6)); R(flick(p, Q.T0), -344, -314, 688, 298, 14, { fill: 'rgba(255,255,255,.06)', sw: 0, stroke: 'none' });
      whatV(p, c, X, 0, -200, 130, -70, { size: 42, maxW: 600 }); whoB(p, c, Wh, 300, -290, 40, { label: false, t: tW(Q) });
      whenT(p, T, 0, 60, 280, { t: tN(Q) }); const cl = CL(p);
      [-240, 0, 240].forEach((x, i) => front(inG(cl, 'rise', x, 250, tu(.2 + .06 * i)), x, 330, .62)); [-360, -120, 120, 360].forEach((x, i) => front(inG(cl, 'rise', x, 330, tu(.4 + .06 * i)), x, 430, .8));
    }); });

  /* 07 ── AT THE LECTERN: the backdrop pops; the lectern rises; the speaker comes up behind it and the mic bends to them; the who on the lectern;
     the event on the backdrop */
  variant('lectern', 'คนยืนหน้าเวที', (d, c) => { const X = WH(d), Wh = WO(d), T = WN(d), Q = TL();
    art(c, p => { floorD(p); R(inG(p, 'pop', 0, -185, tu(.04)), -450, -330, 900, 290, 22, F(4.6)); whatH(p, c, X, -330, -196, 100, -250, { cx: -60, maxW: 420, bigW: 560 }); whenT(p, T, 250, -90, 330, { t: tN(Q) });
      front(mvG(clipG(p, -500, -350, 1000, 460), { y: [[0, 300], [tu(.34), 300], [Q.T0 - tu(.06), -8, 'out'], [Q.T0 + tu(.06), 0, 'soft']] }), 0, 290, 1.08);
      drawAt(p.path('M 70 96 Q 84 40 46 22', W(3)), p, Q.T0, tu(.2)); R(popAt(p, 43, 11, Q.T0 + tu(.16)), 30, -6, 26, 34, 10, F(2.4));
      const lc = inG(p, 'rise', 0, 190, tu(.14)); R(lc, -160, 84, 320, 26, 10, F(3.6)); shape(lc, [[-140, 110], [140, 110], [118, 290], [-118, 290]], F(4.6)); whoB(p, c, Wh, 0, 196, 54, { label: false, t: tW(Q) });
    }); });

  /* 08 ── THE STAGE AND THE CROWD: the truss drops in, the stage rises, the crowd fills in; the lamps flick on one by one, the screen comes on;
     the event */
  variant('stagecrowd', 'เวทีพร้อมผู้ร่วมงาน', (d, c) => { const X = WH(d), Wh = WO(d), T = WN(d), Q = TL();
    art(c, p => { const tr = inG(CL(p), 'drop', 0, -318, tu(.04)); R(tr, -470, -340, 940, 44, 6, F(3.6)); for (let x = -450; x < 450; x += 44) tr.path(`M ${x} -336 L ${x + 22} -300 L ${x + 44} -336`, S(1.6));
      [-300, 0, 300].forEach((x, i) => { const lg = inG(CL(p), 'drop', x, -270, tu(.16 + .04 * i)); lg.line(x, -296, x, -280, W(2.4)); lamp(lg, x, -280, .8);
        const bm = flick(p, Q.T0 - tu(.2) + tu(.08 * i)); shape(bm, [[x - 44, -240], [x + 44, -240], [x * .6 + 70, 110], [x * .6 - 70, 110]], { fill: 'rgba(255,255,255,.05)', sw: 0, stroke: 'none' }); });
      R(inG(p, 'pop', 0, -70, tu(.3)), -360, -230, 720, 320, 20, F(4.6)); R(flick(p, Q.T0 + tu(.1)), -344, -214, 688, 288, 12, { fill: 'rgba(255,255,255,.05)', sw: 0, stroke: 'none' });
      whatV(p, c, X, 0, -110, 130, 20, { size: 44, maxW: 600 }); whoB(p, c, Wh, 300, -190, 40, { label: false, t: tW(Q) });
      R(inG(p, 'rise', 0, 142, tu(.1)), -450, 110, 900, 64, 10, F(4.2)); whenT(p, T, 0, 142, 280, { t: tN(Q) });
      const cl = CL(p); [-380, -230, -80, 70, 220, 370].forEach((x, i) => front(inG(cl, 'rise', x, 300, tu(.36 + .04 * i)), x, 440 + (i % 2) * 20, .58));
    }); });

  /* 09 ── THE WALL CALENDAR: the nail pops; the calendar drops on its cord and swings, settling; the day is circled; who and when; the month's
     picture is the event */
  variant('calendar', 'ปฏิทินพร้อมภาพเหตุการณ์', (d, c) => { const X = WH(d), Wh = WO(d), T = WN(d), Q = TL();
    art(c, p => { popAt(p, 0, -342, tu(.04)).circle(0, -342, 9, F(2.6));
      const sw = mvG(CL(p), Object.assign({ px: 0, py: -338 }, swingFit(tu(.3), Q.T0, 5))); sw.path('M -120 -300 L 0 -338 L 120 -300', W(2.2));
      R(sw, -300, -300, 600, 630, 18, F(4.8)); [-120, 120].forEach(x => sw.circle(x, -300, 14, F(2.6)));
      R(sw, -270, -270, 540, 270, 12, { fill: 'rgba(255,255,255,.08)', sw: 2, stroke: C.soft });
      for (let r = 0; r < 4; r++) for (let k = 0; k < 7; k++) { const x = -240 + k * 80, y = 90 + r * 56; R(sw, x - 26, y - 18, 52, 40, 8, S(1.6)); }
      if (!T) sw.line(-120, 34, 120, 34, S(2));
      whatV(p, c, X, 0, -160, 130, -36, { size: 38, maxW: 480 }); whoB(p, c, Wh, 220, -220, 38, { label: false, t: tW(Q) });
      if (T) txt(atG(p, tN(Q)), T, 0, 46, { size: 36, maxW: 500, weight: 800, color: C.ink }); drawAt(p.circle(-240 + 4 * 80, 90 + 2 * 56 + 2, 34, W(3.4)), p, Q.T0 + tu(.1), tu(.3));
    }); });

  /* 10 ── THE GROUP PHOTO: the instant photo drops onto the wall turning to its tilt, the tape goes on; the picture develops (fades up); the caption */
  variant('groupphoto', 'ภาพถ่ายหมู่', (d, c) => { const X = WH(d), Wh = WO(d), T = WN(d), Q = TL();
    art(c, p => { const g0 = mvG(CL(p), { px: 0, py: 0, y: [[0, -560], [tu(.04), -560], [tu(.4), 8, 'out'], [tu(.5), 0, 'soft']], r: [[0, 12], [tu(.04), 12], [tu(.5), 0, 'out']], o: fadeIn(tu(.04)) }), g = rot(g0, -4, 0, 0);
      R(g, -280, -310, 560, 620, 16, F(4.8)); R(g, -250, -280, 500, 420, 6, { fill: 'rgba(255,255,255,.07)', sw: 2.4 });
      const dv = sub(g); on(dv, p, 0, { o: [[0, 0], [Q.T0 - tu(.3), 0], [Q.T0 + tu(.3), 1, 'io']] }); const cl = clipG(dv, -250, -280, 500, 420);
      [[-150, .6, 230], [-50, .66, 260], [50, .66, 260], [150, .6, 230]].forEach(([x, k, fy]) => front(cl, x, fy, k)); [-100, 0, 100].forEach(x => front(cl, x, 330, .62));
      R(popAt(p, -20, -318, tu(.56)), -90, -336, 140, 40, 4, { fill: 'rgba(255,255,255,.16)', sw: 1.4 });
      whatH(rot(p, -4, 0, 0), c, X, -200, 214, 70, -150, { cx: 0, size: 38, maxW: 280, bigSize: 42, bigW: 480, dy: 14 });
      if (T) txt(atG(rot(p, -4, 0, 0), tN(Q)), T, 240, 280, { size: 26, maxW: 200, weight: 700, color: C.ink, anchor: 'end' }); whoB(p, c, Wh, 240, -250, 44, { label: false, t: tW(Q) });
    }); });

  /* 11 ── THE PHOTO FRAME ON THE SHELF: the shelf pops, its legs draw; the frame stands up (from flat), the little frame and the tent card pop
     beside it; the event shows in the frame */
  variant('photoframe', 'ภาพเหตุการณ์ในกรอบ', (d, c) => { const X = WH(d), Wh = WO(d), T = WN(d), Q = TL();
    art(c, p => { R(inG(p, 'pop', 0, 235, tu(.04)), -480, 220, 960, 30, 8, F(3.8)); [-450, 450].forEach(x => drawAt(p.line(x, 250, x, 340, S(2)), p, tu(.14), tu(.2)));
      const fr = mvG(p, { px: 0, py: 220, sy: [[0, .04], [tu(.3), .04], [Q.T0 - tu(.1), 1.04, 'out'], [Q.T0, 1, 'soft']], o: fadeIn(tu(.3), .04) });
      shape(fr, [[180, 200], [230, 220], [210, 220]], F(2.4)); R(fr, -250, -260, 500, 480, 14, F(5.4)); R(fr, -218, -228, 436, 416, 8, F(2.2));
      whatV(p, c, X, 0, -70, 150, 90, { size: 42, maxW: 380 });
      if (Wh) { const sf = popAt(p, 380, 120, tW(Q)); R(sf, 300, 20, 160, 200, 10, F(4.4)); R(sf, 318, 38, 124, 164, 6, F(1.8)); put(p, c, { icon: Wh.icon }, 380, 120, 80, null, { t: tW(Q) + tu(.06) }); }
      if (T) { const tc = popAt(p, -370, 180, tN(Q)); shape(tc, [[-460, 220], [-280, 220], [-300, 130], [-440, 130]], F(3.6)); txt(tc, T, -370, 188, { size: 26, maxW: 140, weight: 700, color: C.ink }); }
    }); });

  /* 12 ── CUTTING THE RIBBON (no person — user 2026-11-14 "12 ลบคนออก"): the sign pops, the posts rise, the ribbon draws across with its bow; the scissors come
     in and snip — the middle piece drops away and the cut ends hang; the event lands */
  variant('ribbon', 'คนกำลังตัดริบบิ้น', (d, c) => { const X = WH(d), Wh = WO(d), T = WN(d), Q = TL(), tC = f3(Q.H - tu(.3));
    art(c, p => { floorD(p); R(inG(p, 'pop', 0, -240, tu(.04)), -340, -320, 680, 160, 18, F(4.6)); whatH(p, c, X, -240, -240, 90, -170, { cx: 0, size: 46, maxW: 420, bigW: 600 }); whenT(p, T, 0, -120, 260, { t: tN(Q) });
      [-420, 420].forEach((x, i) => { const g = inG(p, 'rise', x, 150, tu(.08 + .05 * i)); R(g, x - 12, 20, 24, 270, 6, F(3)); g.circle(x, 14, 16, F(3)); ell(g, x, 284, 60, 10, F(2.6)); });
      const rb = (q, dd) => { q.path(dd, { sw: 26 }); q.path(dd, { sw: 18, stroke: C.fill }); };
      const rl = sub(p); drawAt(rl.path('M -408 50 Q -250 76 -40 56', { sw: 26 }), p, tu(.4), tu(.25)); drawAt(rl.path('M -408 50 Q -250 76 -40 56', { sw: 18, stroke: C.fill }), p, tu(.4), tu(.25));
      drawAt(p.path('M 408 50 Q 300 70 190 64', { sw: 26 }), p, tu(.4), tu(.25)); drawAt(p.path('M 408 50 Q 300 70 190 64', { sw: 18, stroke: C.fill }), p, tu(.4), tu(.25));
      const mid = mvG(p, { y: [[0, 0], [tC, 0], [tC + tu(.3), 260, 'in']], r: [[0, 0], [tC, 0], [tC + tu(.3), 14]], px: 75, py: 60, o: [[0, 0], [tu(.5), 0], [tu(.62), 1], [tC + tu(.2), 1], [tC + tu(.3), 0]] }); rb(mid, 'M -44 56 Q 80 66 194 64');
      drawAt(p.path('M -40 56 Q -10 70 0 110', W(5)), p, tC + tu(.04), tu(.2)); drawAt(p.path('M 190 64 Q 160 80 150 120', W(5)), p, tC + tu(.04), tu(.2));
      const bw = popAt(p, -60, 56, tu(.6)); [-1, 1].forEach(sd => bw.path(`M -60 56 C ${-60 + sd * 70} -10 ${-60 + sd * 90} 100 -60 56 Z`, F(3.4))); bw.circle(-60, 56, 16, F(3));
      put(p, c, { icon: 'scissors' }, 92, 50, 100, null, { t: tC - tu(.4), mv: { x: [[0, 160], [tC - tu(.4), 160], [tC - tu(.06), 0, 'out']], y: [[0, -120], [tC - tu(.4), -120], [tC - tu(.06), 0, 'out']], r: [[0, -20], [tC - tu(.06), -20], [tC, -4, 'in'], [tC + tu(.12), -20, 'out']], px: 92, py: 50 } });
      sparkAt(p, 80, 58, 20, 38, tC, 6, 0, [], false); whoB(p, c, Wh, -60, 180, 44, { label: false, t: tW(Q) });
    }); });

  /* 13 ── THE CELEBRATION: the bunting draws across and its flags drop on; the board pops; the person crouches and jumps with both arms up, the
     confetti bursts; who and when; the event lands on the board */
  variant('celebrate', 'คนกำลังเฉลิมฉลอง', (d, c) => { const X = WH(d), Wh = WO(d), T = WN(d), Q = TL(), tJ = f3(Q.H - tu(.34));
    art(c, p => { floorD(p); drawAt(p.path('M -480 -300 Q 0 -200 480 -300', W(2.4)), p, tu(.04), tu(.35));
      for (let x = -440, i = 0; x <= 440; x += 80, i++) { const u = (x + 480) / 960, y = (1 - u) * (1 - u) * -300 + 2 * u * (1 - u) * -200 + u * u * -300; shape(popAt(p, x, y + 10, tu(.2 + .03 * i)), [[x - 26, y + 2], [x + 26, y + 2], [x, y + 50]], F(2.6)); }
      const sh = mvG(p, { px: -210, py: 284, s: [[0, 1], [tJ, 1], [tJ + tu(.17), .6, 'out'], [tJ + tu(.34), 1, 'in']] }); ell(sh, -210, 284, 90, 12, S(1.6));
      const jp = mvG(inG(p, 'rise', -210, 150, tu(.1)), { px: -210, py: 250, y: [[0, 40], [tJ - tu(.12), 40], [tJ, 44, 'in'], [tJ + tu(.17), -60, 'out'], [tJ + tu(.34), 0, 'in']], sy: [[0, 1], [tJ - tu(.12), 1], [tJ, .9, 'in'], [tJ + tu(.08), 1.04, 'out'], [tJ + tu(.34), 1, 'soft']] });
      front(jp, -210, 250, .9, { [-1]: { s: [-36, -82], e: [-90, -150], h: [-110, -224] }, 1: { s: [36, -82], e: [90, -150], h: [110, -224] } }, { leg: sd => ({ h: [sd * 17, 8], k: [sd * 36, 80], f: [sd * 24, 160] }) });
      [[-380, -150, 20], [-60, -120, -30], [-330, 20, 40], [-90, 30, -10], [-420, -60, 60], [-20, -200, 15]].forEach(([x, y, a], i) => { const g = mvG(p, { x: [[0, -210 - x], [tJ + tu(.12), -210 - x], [tJ + tu(.4), 0, 'out']], y: [[0, 60 - y], [tJ + tu(.12), 60 - y], [tJ + tu(.4), 0, 'out']], o: fadeIn(tJ + tu(.12), .04) }); R(rot(g, a, x, y), x - 12, y - 6, 24, 12, 3, F(2)); });
      const bd = inG(p, 'pop', 260, -40, tu(.3)); R(bd, 60, -200, 400, 330, 24, F(4.6)); R(bd, 250, 130, 20, 160, 4, F(2.6)); ell(bd, 260, 286, 80, 10, F(2.6));
      whatV(p, c, X, 260, -86, 120, 40, { size: 38, maxW: 340, bigW: 350 }); whoB(p, c, Wh, 420, -190, 40, { label: false, t: tW(Q) }); whenT(p, T, 260, -250, 260, { t: tN(Q) });
    }); });

  /* 14 ── THE NOTICE BOARD: the board pops onto the wall; the flyer is pinned up (a drop, the pin goes in); the note with the when and the who's card
     are pinned on after it; the event lands on the flyer */
  variant('notice', 'ป้ายประกาศกิจกรรม', (d, c) => { const X = WH(d), Wh = WO(d), T = WN(d), Q = TL();
    art(c, p => { const bd = inG(p, 'pop', 0, 0, tu(.04)); R(bd, -450, -310, 900, 610, 26, F(4.8)); R(bd, -424, -284, 848, 558, 14, S(1.6));
      const pin = (x, y, t) => popAt(p, x, y, t).circle(x, y, 12, F(2.6));
      const f0 = mvG(p, { y: [[0, -50], [tu(.3), -50], [tu(.46), 0, 'in']], o: fadeIn(tu(.3), .06) }), f = rot(f0, -3, -150, 0); R(f, -380, -250, 420, 500, 10, F(4.2)); pin(-170, -240, tu(.48));
      lines(atG(rot(p, -3, -150, 0), tu(.6)), -320, 120, 300, 3, 34, S(1.8), [2]); whatV(rot(p, -3, -150, 0), c, X, -170, -100, 150, 50, { size: 42, maxW: 360 });
      if (T) { const t = tN(Q), n0 = mvG(p, { y: [[0, -40], [t - tu(.14), -40], [t, 0, 'in']], o: fadeIn(t - tu(.14), .06) }), n2 = rot(n0, 4, 260, -150); R(n2, 100, -240, 320, 170, 8, F(3.8)); pin(260, -232, t + tu(.02)); txt(atG(n2, t + tu(.08)), T, 260, -138, { size: 34, maxW: 280, weight: 800, color: C.ink }); }
      if (Wh) { whoB(p, c, Wh, 270, 120, 90, { size: 28, ly: 36, t: tW(Q) }); pin(270, 30, tW(Q) + tu(.04)); }
    }); });

  /* 15 ── STANDING ROUND IN A CIRCLE: the platform rises, the people come up round it one by one; the post grows and the round sign turns to face
     us; the event lands on it */
  variant('circle', 'คนยืนล้อมวง', (d, c) => { const X = WH(d), Wh = WO(d), T = WN(d), Q = TL();
    art(c, p => { floorD(p); [-330, -170, 170, 330].forEach((x, i) => front(inG(p, 'rise', x, 60, tu(.2 + .06 * i)), x, 160, .62));
      const pf = inG(p, 'rise', 0, 246, tu(.04)); ell(pf, 0, 230, 300, 52, F(4)); R(pf, -300, 230, 600, 30, 0, { fill: C.fill, sw: 0, stroke: 'none' }); [-300, 300].forEach(x => pf.line(x, 230, x, 262, W(4))); ell(pf, 0, 262, 300, 52, { fill: 'none', sw: 4 }); ell(pf, 0, 230, 300, 52, F(4));
      R(mvG(p, growY(0, 230, tu(.5))), -10, 60, 20, 170, 5, F(2.6));
      disc(mvG(p, { px: 0, py: -80, sx: [[0, .04], [Q.T0, .04], [Q.H - tu(.14), 1.04, 'out'], [Q.H, 1, 'soft']], o: fadeIn(Q.T0, .04) }), 0, -80, 150); whatV(p, c, X, 0, -112, 110, 4, { size: 32, maxW: 220, bigW: 230, bigSize: 40 });
      [-440, 440].forEach((x, i) => front(inG(p, 'rise', x, 180, tu(.44 + .06 * i)), x, 300, .8)); whoB(p, c, Wh, 150, 30, 40, { label: false, t: tW(Q) }); whenT(p, T, 0, 230, 260, { t: tN(Q) });
    }); });

  /* 16 ── BY THE SCHEDULE: the board drops onto its legs, its slot lines draw; the person rises in and points; the band sweeps across the slot; the
     event lands in it */
  variant('schedule', 'คนยืนข้างกำหนดการ', (d, c) => { const X = WH(d), Wh = WO(d), T = WN(d), px = -340, Q = TL(), tB = f3(Q.T0 + tu(.24));
    art(c, p => { floorD(p); drawAt(p.line(100, 220, 30, 290, W(5)), p, tu(.04), tu(.2)); drawAt(p.line(330, 220, 400, 290, W(5)), p, tu(.08), tu(.2));
      R(inG(CL(p), 'drop', 170, -50, tu(.16)), -80, -320, 500, 540, 28, F(4.8)); drawAt(p.line(-40, -216, 380, -216, W(3)), p, tu(.5), tu(.2));
      if (T) txt(atG(p, tN(Q)), T, 170, -252, { size: 38, maxW: 420, weight: 800, color: C.ink }); else drawAt(p.line(30, -262, 310, -262, S(2)), p, tu(.5), tu(.2));
      [-160, -60, 140].forEach((y, i) => { DOT(popAt(p, -30, y, tu(.56 + .06 * i)), -30, y, 7); drawAt(p.line(0, y, y === 140 ? 220 : 300, y, S(2)), p, tu(.58 + .06 * i), tu(.2)); });
      R(mvG(p, { px: -60, py: 42, sx: [[0, 0], [tB, 0], [tB + tu(.3), 1, 'out']], o: fadeIn(tB, .04) }), -60, -4, 460, 92, 18, { fill: 'rgba(255,255,255,.12)', sw: 2.4 }); whatH(p, c, X, 0, 42, 64, 46, { cx: 170, size: 36, maxW: 330, bigSize: 38, bigW: 420, dy: 12 });
      const hm = front(inG(p, 'rise', px, 140, tu(.24)), px, 290, 1, { 1: { s: [36, -82], e: [100, -96], h: [156, -110] } }); raise(hm, p, 1, [36, -82], [100, -96], 89, 6, Q.T0 - tu(.1), f3(Q.T0 + tu(.2)));
      whoB(p, c, Wh, 360, 170, 36, { label: false, t: tW(Q) });
    }); });

  /* 17 ── THE VENUE TENT: the poles rise, the roof drops onto them, the scalloped edge draws, the flag goes up and flutters; the sign is let down on
     its wires; the event lands on it */
  variant('tent', 'สถานที่จัดกิจกรรม', (d, c) => { const X = WH(d), Wh = WO(d), T = WN(d), Q = TL();
    art(c, p => { floorD(p); [-420, 420, -250, 250].forEach((x, i) => R(inG(p, 'rise', x, 80, tu(.04 + .04 * i)), x - 9, -120, 18, 410, 5, i < 2 ? F(2.8) : S(2)));
      const rf = inG(CL(p), 'drop', 0, -200, tu(.3)); shape(rf, [[-440, -130], [0, -300], [440, -130]], F(4.6)); rf.line(0, -300, 0, -130, S(1.6)); [-220, 220].forEach(x => rf.line(0, -300, x, -130, S(1.6))); rf.line(0, -300, 0, -346, W(2.6));
      const fl = mvG(p, { px: 0, py: -338, sx: [[0, 0], [tu(.6), 0], [tu(.8), 1, 'out'], [tu(1), .85, 'io'], [tu(1.2), 1, 'io']], o: fadeIn(tu(.6), .04) }); shape(fl, [[0, -346], [56, -330], [0, -314]], F(2.4));
      drawAt(p.path('M -440 -130 ' + Array.from({ length: 8 }, (_, i) => `Q ${-385 + 110 * i} -84 ${-330 + 110 * i} -130`).join(' '), F(3.6)), p, tu(.5), tu(.3));
      const sg = mvG(clipG(p, -500, -110, 1000, 460), { y: [[0, -260], [Q.T0 - tu(.2), -260], [Q.T0 + tu(.1), 8, 'out'], [Q.T0 + tu(.2), 0, 'soft']] }); [-120, 120].forEach(x => sg.line(x, -300, x, -70, W(2.2))); R(sg, -220, -70, 440, 220, 20, F(4.6));
      whatV(p, c, X, 0, 2, 110, 114, { size: 38, maxW: 380, bigW: 400, bigSize: 44, bigDy: 26 }); whoB(p, c, Wh, 180, -40, 34, { label: false, t: tW(Q) + tu(.1) }); whenT(p, T, 0, 236, 280, { t: tN(Q) });
    }); });

  /* 18 ── THROUGH THE ARCH: the arch inflates up from the ground, the banner pops on top; the people walk in from the left and under the arch (nose
     first, left to right); who and when; the event lands on the banner */
  variant('arch', 'ภาพคนร่วมกิจกรรม', (d, c) => { const X = WH(d), Wh = WO(d), T = WN(d), Q = TL(), A = 'M -380 290 L -380 -130 Q -380 -250 -260 -250 L 260 -250 Q 380 -250 380 -130 L 380 290';
    art(c, p => { floorD(p); const ar = mvG(p, { px: 0, py: 290, sy: [[0, .05], [tu(.04), .05], [tu(.4), 1.04, 'out'], [tu(.52), 1, 'soft']], o: fadeIn(tu(.04), .04) }); ar.path(A, { sw: 76 }); ar.path(A, { sw: 64, stroke: C.fill });
      R(inG(p, 'pop', 0, -245, tu(.5)), -300, -310, 600, 130, 22, F(4.6)); whatH(p, c, X, -210, -245, 80, -150, { cx: 0, size: 44, maxW: 420, bigW: 560 });
      [[-160, .7], [-10, .74], [140, .7]].forEach(([x, k], i) => { const g = mvG(CL(p), { x: [[0, -520], [tu(.2 + .1 * i), -520], [Q.H + tu(.1 * i), 0, 'out']] });
        const b = mvG(g, { px: x, py: 290, y: Array.from({ length: 10 }, (_, j) => [f3(tu(.2 + .1 * i) + (Q.H - tu(.2)) * j / 9), j % 2 ? -8 : 0]) }); person(b, x, 290, k, { s: [4, -76], e: [24, -36], h: [40, 4] }, { leg: stride, far: { s: [-4, -74], e: [-24, -36], h: [-36, 6] } }); });
      whoB(p, c, Wh, -380, 40, 44, { label: false, t: tW(Q) }); whenT(p, T, 0, -136, 260, { t: tN(Q) });
    }); });

  /* 19 ── THE EVENT BADGE: the lanyard straps draw down; the badge drops on its clip and swings, settling; the who photo and the when; the event's
     name on the badge */
  variant('lanyard', 'ป้ายชื่องาน', (d, c) => { const X = WH(d), Wh = WO(d), T = WN(d), Q = TL();
    art(c, p => { [-1, 1].forEach(sd => { drawAt(p.path(`M ${sd * 200} -350 L ${sd * 14} -176`, { sw: 22 }), p, tu(.04), tu(.25)); drawAt(p.path(`M ${sd * 200} -350 L ${sd * 14} -176`, { sw: 14, stroke: C.fill }), p, tu(.04), tu(.25)); });
      const sw = mvG(CL(p), Object.assign({ px: 0, py: -164 }, swingFit(tu(.4), Q.T0, 5)));
      R(sw, -30, -184, 60, 40, 10, F(3.4)); R(sw, -230, -150, 460, 480, 30, F(4.8)); R(sw, -50, -130, 100, 18, 9, { fill: C.fill, sw: 2.4 }); sw.line(-190, 112, 190, 112, S(2)); R(sw, -190, 140, 130, 150, 12, F(3.4));
      if (!T) lines(sw, -30, 200, 180, 2, 34, S(2), [1]); if (!(Wh && picOf(Wh))) DOT(sw, -125, 215, 8);
      whatV(p, c, X, 0, -40, 120, 74, { size: 40, maxW: 380, bigW: 400, bigSize: 46 });
      if (Wh && picOf(Wh)) put(p, c, { icon: Wh.icon }, -125, 215, 80, null, { t: tW(Q), punch: tW(Q) + tu(.16) });
      if (T) txt(atG(p, tN(Q)), T, -30, 226, { size: 32, maxW: 210, weight: 800, color: C.ink, anchor: 'start' });
    }); });

  /* 20 ── THE NEWSPAPER ON ITS HOLDER: the rod pops; the paper unrolls down from it; the masthead and the rules draw, the dateline (when) prints;
     the photo comes up with the event, the headline under it; the who in the small photo */
  variant('newspaper', 'แผ่นข่าวเหตุการณ์', (d, c) => { const X = WH(d), Wh = WO(d), T = WN(d), Q = TL(), uE = Math.max(tu(.6), Q.T0 - tu(.2));
    art(c, p => { R(mvG(p, { px: 0, py: -300, sy: [[0, .02], [tu(.2), .02], [uE, 1.02, 'out'], [uE + tu(.1), 1, 'soft']], o: fadeIn(tu(.2), .02) }), -300, -300, 600, 620, 6, F(4.8));
      const rd = inG(p, 'pop', 0, -303, tu(.04)); R(rd, -340, -316, 680, 26, 13, F(3.6)); [-340, 340].forEach(x => rd.circle(x, -303, 18, F(3)));
      R(popAt(p, 0, -248, uE), -260, -270, 520, 44, 6, F(3)); drawAt(p.line(-260, -212, 260, -212, W(2.4)), p, uE + tu(.06), tu(.2)); drawAt(p.line(-260, -170, 260, -170, S(1.6)), p, uE + tu(.1), tu(.2));
      if (T) txt(atG(p, tN(Q)), T, 260, -184, { size: 24, maxW: 300, weight: 700, color: C.ink, anchor: 'end' });
      R(flick(p, Q.T0), -260, -150, 520, 230, 8, { fill: 'rgba(255,255,255,.07)', sw: 2.4 }); if (X && picOf(X)) put(p, c, { icon: X.icon }, 0, -36, 150, null, { t: Q.H - tu(.06), punch: Q.H + tu(.1) });
      if (X && X.label) txt(atG(p, Q.H + tu(.06)), X.label, 0, 140, { size: 46, maxW: 500, weight: 800, color: C.ink }); else if (!X) star4(popAt(p, 0, -36, Q.H), 0, -36, 40);
      [-260, 10].forEach((x, i) => lines(atG(p, uE + tu(.2 + .06 * i)), x, 190, 250, 3, 34, S(1.6), [2]));
      if (Wh) { R(popAt(p, 205, 227, tW(Q)), 150, 172, 110, 110, 8, F(3)); put(p, c, { icon: Wh.icon }, 205, 227, 64, null, { t: tW(Q) + tu(.04) }); }
    }); });

  /* ---------- sample data (A: events from unrelated topics · B: stress) ---------- */
  const I = (icon, label) => label ? (icon ? { icon, label } : { label }) : { icon };
  const D = (say, what, who, when) => ({ say, what, who, when });
  const SAMPLES = [
    D('ปีที่แล้วพี่สาวแต่งงาน', I('heart', 'งานแต่งงาน'), I('user', 'พี่สาว'), 'ปีที่แล้ว'),
    D('เมื่อวานมีถ่ายทอดสดเปิดตัวสินค้า', I('rocket', 'เปิดตัวสินค้า'), null, 'เมื่อวาน'),
    D('ชาวบ้านรวมตัวกันปลูกต้นไม้', I('sprout', 'ปลูกต้นไม้'), I('users', 'ชาวบ้าน'), null),
    D('วันเสาร์นี้มีเดินรณรงค์ลดขยะ', I('recycle', 'ลดขยะ'), null, 'วันเสาร์นี้'),
    D('ทีมประชุมกันทั้งเช้า', I('presentation', 'ประชุมทีม'), I('users', 'ทีม'), 'ทั้งเช้า'),
    D('คนเต็มห้องฟังบรรยายเรื่องเงิน', I('wallet', 'บรรยายเรื่องเงิน'), null, null),
    D('ตอนอายุ 25 ผมขึ้นพูดครั้งแรก', I('mic', 'ขึ้นพูดครั้งแรก'), I('user', 'ผม'), 'อายุ 25'),
    D('คอนเสิร์ตคืนนั้นคนแน่นมาก', I('music', 'คอนเสิร์ต'), null, 'คืนนั้น'),
    D('เดือนหน้ามีวันเกิดแม่', I('cake', 'วันเกิดแม่'), I('user', 'แม่'), 'เดือนหน้า'),
    D('รุ่นเรากลับมาเจอกันอีกครั้ง', I('users', 'งานเลี้ยงรุ่น'), null, 'ปี 2024'),
    D('วันที่ลูกเรียนจบ', I('graduation-cap', 'ลูกเรียนจบ'), I('baby', 'ลูก'), null),
    D('ร้านเปิดวันแรกเมื่อต้นปี', I('store', 'ร้านเปิดวันแรก'), null, 'ต้นปี'),
    D('ทีมเราชนะการแข่งขัน', I('trophy', 'ชนะการแข่งขัน'), I('users', 'ทีมเรา'), null),
    D('สัปดาห์หน้ามีตลาดนัดชุมชน', I('tent', 'ตลาดนัดชุมชน'), null, 'สัปดาห์หน้า'),
    D('ครอบครัวรวมตัวกันวันปีใหม่', I('party-popper', 'วันปีใหม่'), I('users', 'ครอบครัว'), 'วันปีใหม่'),
    D('พรุ่งนี้มีสัมภาษณ์งาน', I('briefcase', 'สัมภาษณ์งาน'), I('user', 'ผม'), 'พรุ่งนี้'),
    D('งานแฟร์หนังสือจัดที่สวน', I('book-open', 'งานหนังสือ'), null, 'ปลายเดือน'),
    D('นักวิ่งหลายพันคนลงแข่งมาราธอน', I('flag', 'มาราธอน'), I('users', 'นักวิ่ง'), 'เช้าวันอาทิตย์'),
    D('งานสัมมนาการตลาดปีนี้', I('presentation', 'สัมมนาการตลาด'), null, 'ปีนี้'),
    D('เมื่อเช้าเกิดน้ำท่วมในเมือง', I('droplets', 'น้ำท่วม'), I('users', 'คนในเมือง'), 'เมื่อเช้า'),
  ];
  const STRESS = [
    D('ไม่มีใคร ไม่มีเวลา', I('music', 'คอนเสิร์ต'), null, null),
    D('ชื่อเหตุการณ์ยาว', I('rocket', 'เปิดตัวแอปพลิเคชันใหม่ของบริษัท'), I('users', 'ทีมงาน'), 'เมื่อวาน'),
    D('ไม่มีไอคอน', I(null, 'งานบวช'), I('user', 'น้องชาย'), 'ปีที่แล้ว'),
    D('ภาษาอังกฤษ', I('trophy', 'Won the final'), I('users', 'Our team'), 'Last year'),
    D('ชื่อไอคอนที่ไม่มี', I('no-such-icon', 'เหตุการณ์'), I('no-such', 'ใครบางคน'), null),
    D('ไม่มีอะไรเลย', null, null, null),
    D('เวลายาว', I('cake', 'วันเกิด'), null, 'วันเสาร์ที่สองของเดือนหน้า'),
    D('ใครไม่มีไอคอน', I('heart', 'งานแต่ง'), I(null, 'เพื่อนสนิท'), 'เดือนก่อน'),
    D('ตัวเลขในเวลา', I('mic', 'พูดครั้งแรก'), I('user', 'ผม'), 'อายุ 18'),
    D('เวลาอย่างเดียว', null, null, 'พรุ่งนี้'),
    D('อังกฤษยาว', I('presentation', 'Annual marketing summit'), null, 'Next Monday'),
    D('ใครอย่างเดียวไม่มีงาน', null, I('users', 'ทุกคน'), null),
    D('สั้นมาก', I('flag', 'วิ่ง'), null, 'เช้านี้'),
    D('ชื่อยาวไม่มีไอคอน', I(null, 'พิธีเปิดสำนักงานแห่งใหม่'), null, 'ต้นเดือน'),
    D('ปกติ', I('store', 'เปิดร้าน'), I('user', 'แม่'), '10 ปีก่อน'),
    D('ไม่มีเวลา', I('graduation-cap', 'รับปริญญา'), I('user', 'พี่ชาย'), null),
    D('ใครยาว', I('users', 'งานเลี้ยง'), I('users', 'เพื่อนร่วมรุ่นทั้งหมด'), 'คืนนี้'),
    D('อังกฤษ 2', I('party-popper', 'New Year'), I('users', 'Family'), 'Jan 1'),
    D('ไม่มีใคร มีเวลา', I('tent', 'ตลาดนัด'), null, 'ทุกวันเสาร์'),
    D('ไม่มีอะไรเลย 2', null, null, null),
  ];

  G.cats = G.cats || {};
  G.cats.B18 = { variants: V, SAMPLES, STRESS, draw: (i, d, c) => { setZ(c); CUR = V[i].id; V[i].build(d || {}, c); }, CLAMPS, timing: c => (setZ(c), Object.assign({}, Z)) };
})();
