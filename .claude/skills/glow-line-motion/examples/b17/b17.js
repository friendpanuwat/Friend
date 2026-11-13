/* b17.js — category B17 "รายการ" (list: things of one group, no order, no ranking). House style of B01–B16, line weight of B16
   (bold bright outlines, round corners, few thin inner lines, big clear icons). Designs from the user's ideas in references/cutpack-visual-ideas.md
   ("รายการ", 20 ideas). CutPack (references/cutpack-CATEGORIES.md v2, cat_ai.py): items 2–4 THING (icon + label if said) · label = the group's name (optional).
   No numbers on screen (a list has no order) — bullets / slots instead. An item with no icon → its label big; nothing → an empty slot.
   GL.cats.B17.draw(i, data, { x, y, s, at, hit, speed }) — canvas 1000 × 700 centred at (0,0); hit = seconds after `at` (default 1.9). */
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
    cp.id = 'b17clip' + (++CID); Object.entries({ x, y, width: w, height: h }).forEach(([k, v]) => r.setAttribute(k, v)); cp.appendChild(r);
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



  /* ---------- the data: items 2–4 (icon + label if said) · label = the group's name ---------- */
  const IT = d => (d && Array.isArray(d.items) ? d.items.filter(has) : []).slice(0, 4);
  const GN = d => d && d.label && String(d.label).trim() ? String(d.label).trim() : null;
  const N = its => Math.max(2, its.length);
  const spread = (n, x0, x1) => Array.from({ length: n }, (_, i) => f1(x0 + (x1 - x0) * (i + .5) / n));
  /* 4 → 2 × 2, otherwise one row: the cell centres + cell size inside the box (x0, y0)–(x1, y1) */
  function grid(n, x0, y0, x1, y1) { const r = n === 4 ? 2 : 1, k = n === 4 ? 2 : n, cw = (x1 - x0) / k, chh = (y1 - y0) / r;
    return { cw, ch: chh, at: Array.from({ length: n }, (_, i) => [f1(x0 + cw * (i % k + .5)), f1(y0 + chh * (Math.floor(i / k) + .5))]) }; }
  const DOT = (q, x, y, r = 8) => q.circle(x, y, r, SOLID(1));
  /* one item: its icon (w) at (x, y) and its label at ly; no icon → the label big in the icon's place */
  function itemV(q, c, it, x, y, w, ly, o = {}) { if (!it) return;
    if (picOf(it)) { put(q, c, { icon: it.icon }, x, y, w, null, { t: o.t, r: o.r, punch: o.punch }); if (it.label && ly != null) txt(o.lg || q, it.label, x, ly, { size: o.size || 32, maxW: o.maxW || w * 1.5, weight: 700, color: C.ink, wrap: o.wrap ?? null }); }
    else if (it.label) txt(o.lg || q, it.label, x, y + (o.bigDy ?? 14), { size: o.big || 40, maxW: o.maxW || w * 1.5, weight: 800, color: C.ink, wrap: 'mid' }); }
  /* one item as a row: icon (or a dot) + label to the right */
  function itemH(q, c, it, x, y, w, ic = 56, size = 34, o = {}) { if (!it) return; const pi = !!picOf(it), lx = pi ? x + ic + 18 : x + 32;
    if (pi) put(q, c, { icon: it.icon }, x + ic / 2, y, ic, null, { t: o.t, punch: o.punch }); else DOT(q, x + 10, y);
    if (it.label) txt(o.lg || q, it.label, lx, y + size * .36, { size, maxW: x + w - lx, weight: 650, color: C.ink, anchor: 'start' }); }
  const head = (q, L, x, y, o = {}) => L && txt(q, L, x, y, { size: o.size || 44, maxW: o.maxW || 500, weight: 800, color: C.ink, anchor: o.anchor || 'middle' });
  /* a round-topped cylinder (plinth / bin) */
  function cyl(q, x, r, yt, yb, w = 3.6) { const ry = f1(r * .16); ell(q, x, yb, r, ry, F(3.2)); R(q, x - r, yt, 2 * r, yb - yt, 0, { fill: C.fill, sw: 0, stroke: 'none' }); [x - r, x + r].forEach(xx => q.line(xx, yt, xx, yb, W(w))); ell(q, x, yt, r, ry, F(w)); }

  /* 01 ── ON PLINTHS: each item stands on its own plinth (all the same height — no ranking), its name on the plinth; the group on a wall plaque */
  variant('plinths', 'ของเรียงบนแท่น', (d, c) => { const its = IT(d), n = N(its), L = GN(d), xs = spread(n, -420, 420), r = Math.min(100, 840 / n / 2 - 18);
    art(c, p => { floorD(p);
      if (L) { R(p, -270, -310, 540, 90, 45, F(4.4)); head(p, L, 0, -250, { maxW: 470 }); }
      xs.forEach((x, i) => { cyl(p, x, r, 170, 284); const it = its[i]; itemV(p, c, it, x, 60, Math.min(150, r * 1.5), null, { maxW: r * 2 });
        if (it && it.label && picOf(it)) txt(p, it.label, x, 246, { size: 28, maxW: r * 2 - 20, weight: 700, color: C.ink }); });
    }); });

  /* 02 ── ON THE HOOK RACK: a rack on the wall with a hook per item; a round tag hangs from each hook — icon and name on the tag */
  variant('hooks', 'ป้ายกลมแขวนราวตะขอ', (d, c) => { const its = IT(d), n = N(its), L = GN(d), xs = spread(n, -420, 420), r = Math.min(122, 840 / n / 2 - 14);
    art(c, p => { R(p, -450, -300, 900, 70, 24, F(4.6)); [-420, 420].forEach(x => screw(p, x, -265, 5)); head(p, L, 0, -252, { size: 36, maxW: 700 });
      xs.forEach((x, i) => { p.path(`M ${x} -230 L ${x} -196 Q ${x} -176 ${x + 18} -176`, W(4)); ring(p, x, -168, 14, 6, F(2.4));
        const cy = -150 + r; disc(p, x, cy, r); const it = its[i]; itemV(p, c, it, x, cy - r * .22, r * .9, cy + r * .5, { size: 28, maxW: r * 1.3 }); });
    }); });

  /* 03 ── THE LIST IN A FRAME: a framed board — the group's name in its header band, one tile per item inside */
  variant('framebox', 'รายการในกรอบ', (d, c) => { const its = IT(d), n = N(its), L = GN(d), top = L ? -170 : -260, G = grid(n, -300, top, 300, 270);
    art(c, p => { R(p, -330, -300, 660, 600, 34, F(4.8));
      if (L) { R(p, -330, -300, 660, 120, 34, { fill: 'rgba(255,255,255,.1)', sw: 0, stroke: 'none' }); p.line(-330, -180, 330, -180, W(3)); head(p, L, 0, -224, { maxW: 560 }); }
      G.at.forEach(([x, y], i) => { const w = G.cw - 24, h = G.ch - 24; R(p, x - w / 2, y - h / 2, w, h, 24, F(3.4)); const it = its[i];
        itemV(p, c, it, x, y - h * .14, Math.min(w, h) * .5, y + h * .32, { size: 28, maxW: w - 24 }); });
    }); });

  /* 04 ── THE RECEIPT: a till slip runs up out of the little printer — the group's name at its head, then a line per item (a dotted leader, no
     prices), a zigzag edge on top */
  variant('receipt', 'ใบรายการจากเครื่องพิมพ์', (d, c) => { const its = IT(d), n = N(its), L = GN(d), y0 = L ? -150 : -210, gap = Math.min(96, (150 - y0) / n);
    art(c, p => { const zz = []; for (let x = -220; x <= 220; x += 20) zz.push([x, (x / 20) % 2 ? -322 : -306]);
      shape(p, [[-220, 210], ...zz, [220, 210]], F(4.4));
      if (L) { head(p, L, 0, -232, { size: 40, maxW: 380 }); } for (let x = -190; x <= 190; x += 16) p.line(x, L ? -200 : -262, x + 8, L ? -200 : -262, S(1.6));
      its.forEach((it, i) => { const y = y0 + gap * (i + .5); itemH(p, c, it, -190, y, 260, 50, 30); for (let x = 100; x <= 180; x += 14) p.circle(x, y + 4, 2.2, SOLID(1)); });
      for (let x = -150, k = 0; x <= 150; x += 12, k++) p.line(x, 160, x, k % 3 ? 186 : 192, { sw: k % 4 ? 2 : 4, stroke: C.soft });
      R(p, -290, 200, 580, 100, 26, F(4.6)); R(p, -240, 196, 480, 16, 8, { fill: C.fill, sw: 2.4 }); p.circle(220, 250, 12, F(2.4)); R(p, -230, 236, 120, 26, 10, S(1.8));
    }); });

  /* 05 ── THE ORGANISER BOX: a box split into compartments — one item in each; the group's name on a plate on its rim */
  variant('organizer', 'กล่องหลายช่อง', (d, c) => { const its = IT(d), n = N(its), L = GN(d), G = grid(n, -400, -190, 400, 250);
    art(c, p => { R(p, -420, -210, 840, 480, 30, F(4.8));
      if (n === 4) p.line(-400, 30, 400, 30, W(4)); const k = n === 4 ? 2 : n; for (let j = 1; j < k; j++) { const x = -400 + 800 * j / k; p.line(x, -190, x, 250, W(4)); }
      if (L) { R(p, -180, -296, 360, 74, 24, F(4)); head(p, L, 0, -246, { size: 36, maxW: 320 }); }
      G.at.forEach(([x, y], i) => itemV(p, c, its[i], x, y - G.ch * .12, Math.min(G.cw, G.ch) * .46, y + G.ch * .3, { size: 28, maxW: G.cw - 30 }));
    }); });

  /* 06 ── SORTED INTO BINS: a row of open bins — each item sticks up out of its own bin, its name on the bin's front plate */
  variant('bins', 'กล่องแยกหมวด', (d, c) => { const its = IT(d), n = N(its), L = GN(d), xs = spread(n, -430, 430), w = Math.min(210, 860 / n - 26);
    art(c, p => { floorD(p); if (L) { R(p, -250, -320, 500, 84, 42, F(4.2)); head(p, L, 0, -264, { size: 38, maxW: 440 }); }
      xs.forEach((x, i) => { const it = its[i]; itemV(p, c, it, x, -40, w * .7, null, { maxW: w }); shape(p, [[x - w / 2, 40], [x + w / 2, 40], [x + w / 2 - 16, 284], [x - w / 2 + 16, 284]], F(4.4)); R(p, x - w / 2 - 8, 30, w + 16, 22, 10, F(3.4));
        R(p, x - w / 2 + 26, 150, w - 52, 70, 14, F(2.8)); if (it && it.label && picOf(it)) txt(p, it.label, x, 196, { size: 26, maxW: w - 70, weight: 700, color: C.ink }); else DOT(p, x, 185, 6); });
    }); });

  /* 07 ── THE LIST ON A MUSIC STAND: a lined sheet rests on a music stand — the group's name on top, a line per item */
  variant('musicstand', 'แผ่นรายการบนขาตั้ง', (d, c) => { const its = IT(d), n = N(its), L = GN(d), y0 = L ? -150 : -230, gap = Math.min(96, (80 - y0) / n);
    art(c, p => { floorD(p); [[-170, 290], [170, 290], [0, 290]].forEach(([x, y], i) => p.line(0, 190, x, y, i === 2 ? S(3) : W(5))); R(p, -9, 130, 18, 64, 6, F(2.6));
      R(p, -300, 104, 600, 30, 14, F(4)); R(p, -270, -300, 540, 410, 12, F(4.6));
      if (L) { head(p, L, 0, -230, { maxW: 460 }); p.line(-220, -196, 220, -196, W(3)); }
      its.forEach((it, i) => { const y = y0 + gap * (i + .5); itemH(p, c, it, -220, y, 440, 54, 32); p.line(-220, y + gap / 2 - 4, 220, y + gap / 2 - 4, S(1.4)); });
    }); });

  /* 08 ── THE STICKER SHEET: round stickers on a sheet — one per item, its name printed under it; the group's name at the top */
  variant('stickers', 'สติกเกอร์บนแผ่นกระดาษ', (d, c) => { const its = IT(d), n = N(its), L = GN(d), top = L ? -190 : -280, G = grid(n, -300, top, 300, 290);
    art(c, p => { R(p, -330, -310, 660, 620, 16, F(4.6)); if (L) { head(p, L, 0, -240, { maxW: 560 }); p.line(-290, -210, 290, -210, S(2)); }
      G.at.forEach(([x, y], i) => { const r = Math.min(G.cw, G.ch) * .3, cy = y - G.ch * .1, it = its[i]; p.circle(x, cy, r + 10, S(1.6)); p.circle(x, cy, r, F(4));
        itemV(p, c, it, x, cy, r * 1.15, null, { maxW: r * 1.8, big: 30 }); if (it && it.label && picOf(it)) txt(p, it.label, x, cy + r + 44, { size: 28, maxW: G.cw - 20, weight: 700, color: C.ink }); });
    }); });

  /* 09 ── THE PEGBOARD: a pegboard on the wall — each item hangs on its own peg on a tile, a name tag under it */
  variant('pegboard', 'ไอคอนบนแผงรูหมุด', (d, c) => { const its = IT(d), n = N(its), L = GN(d), G = grid(n, -400, L ? -170 : -250, 400, 260);
    art(c, p => { R(p, -440, -300, 880, 590, 26, F(4.8)); for (let y = -260; y <= 260; y += 52) for (let x = -400; x <= 400; x += 52) p.circle(x, y, 3.2, S(1.2));
      if (L) { R(p, -200, -280, 400, 80, 22, F(4)); head(p, L, 0, -228, { size: 36, maxW: 340 }); }
      G.at.forEach(([x, y], i) => { const s2 = Math.min(G.cw, G.ch) * .52, it = its[i], ty = y - G.ch * .1; p.path(`M ${x} ${f1(ty - s2 / 2 - 34)} L ${x} ${f1(ty - s2 / 2)}`, W(3)); p.circle(x, f1(ty - s2 / 2 - 34), 7, F(2.2));
        R(p, x - s2 / 2, ty - s2 / 2, s2, s2, 22, F(4)); itemV(p, c, it, x, ty, s2 * .62, null, { maxW: s2 * .9, big: 30 });
        if (it && it.label && picOf(it)) { R(p, x - G.cw * .4, ty + s2 / 2 + 12, G.cw * .8, 46, 12, F(2.6)); txt(p, it.label, x, ty + s2 / 2 + 45, { size: 26, maxW: G.cw * .75, weight: 700, color: C.ink }); } });
    }); });

  /* 10 ── THE TWO-TIER RISER: a stepped display stand — the items stand on its two steps, their names on the step fronts */
  variant('riser', 'ไอคอนเรียงสองแถว', (d, c) => { const its = IT(d), n = N(its), L = GN(d), nt = Math.ceil(n / 2), nb = n - nt;
    art(c, p => { floorD(p); R(p, -340, -70, 680, 220, 14, F(4.6)); R(p, -440, 150, 880, 140, 14, F(4.6)); if (L) { R(p, -230, -330, 460, 80, 40, F(4)); head(p, L, 0, -276, { size: 38, maxW: 400 }); }
      const row = (xs, list, yt, yl) => xs.forEach((x, i) => { const it = list[i]; itemV(p, c, it, x, yt - 70, 120, null, { maxW: 200 }); if (it && it.label && picOf(it)) txt(p, it.label, x, yl, { size: 28, maxW: 680 / xs.length - 30, weight: 700, color: C.ink }); });
      row(spread(nt, -320, 320), its.slice(0, nt), -70, -26); row(spread(Math.max(1, nb), -420, 420), its.slice(nt), 150, 240);
    }); });

  /* 11 ── THE HAND OF CARDS: the items as cards fanned out from one corner, each card its own item */
  variant('fan', 'การ์ดรายการหลายใบ', (d, c) => { const its = IT(d), n = N(its), L = GN(d), px = 0, py = 600, span = n <= 2 ? 26 : n === 3 ? 48 : 60, A = n === 1 ? [0] : Array.from({ length: n }, (_, i) => -span / 2 + span * i / (n - 1));
    art(c, p => { if (L) head(p, L, 0, -300, { maxW: 700 });
      A.forEach((a, i) => { const g = rot(p, a, px, py), it = its[i]; R(g, -130, -260, 260, 360, 28, F(4.6));
        const ca = rad(a), rp = (x, y) => [f1(px + (x - px) * Math.cos(ca) - (y - py) * Math.sin(ca)), f1(py + (x - px) * Math.sin(ca) + (y - py) * Math.cos(ca))];
        if (it && picOf(it)) { const [ix, iy] = rp(0, -140); put(p, c, { icon: it.icon }, ix, iy, 120, null, { r: a }); if (it.label) txt(g, it.label, 0, -30, { size: 30, maxW: 220, weight: 700, color: C.ink }); }
        else if (it) txt(g, it.label, 0, -110, { size: 38, maxW: 220, weight: 800, color: C.ink, wrap: 'mid' }); });
    }); });

  /* 12 ── ON THE TABLE: the items stand on a table top; a small tag hangs over the table's edge under each */
  variant('table', 'วัตถุหลายชิ้นบนโต๊ะ', (d, c) => { const its = IT(d), n = N(its), L = GN(d), xs = spread(n, -400, 400), w = Math.min(170, 800 / n - 40);
    art(c, p => { R(p, -470, 110, 940, 32, 10, F(4.4)); [[-430, -460], [430, 460]].forEach(([a, b]) => p.line(a, 142, b, 330, W(5)));
      if (L) { R(p, -240, -310, 480, 84, 42, F(4)); head(p, L, 0, -254, { size: 38, maxW: 420 }); }
      xs.forEach((x, i) => { const it = its[i]; itemV(p, c, it, x, 110 - w * .5 - 8, w, null, { maxW: w * 1.3 }); ell(p, x, 108, w * .5, 9, S(1.6));
        if (it && it.label && picOf(it)) { p.line(x, 142, x, 168, W(2)); R(p, x - 800 / n / 2 + 16, 168, 800 / n - 32, 58, 14, F(3.2)); txt(p, it.label, x, 207, { size: 28, maxW: 800 / n - 50, weight: 700, color: C.ink }); } });
    }); });

  /* 13 ── THE BOOKCASE: a small bookcase with two shelves — the items sit on the shelves, a name strip on the shelf edge under each */
  variant('bookcase', 'สิ่งของบนชั้นวาง', (d, c) => { const its = IT(d), n = N(its), L = GN(d), nt = Math.ceil(n / 2);
    art(c, p => { floorD(p); R(p, -310, -290, 620, 580, 18, F(4.8)); R(p, -340, -340, 680, 62, 16, F(4.2)); [-30, 230].forEach(y => R(p, -310, y, 620, 26, 6, F(3.6)));
      if (L) txt(p, L, 0, -296, { size: 34, maxW: 600, weight: 800, color: C.ink });
      const row = (list, yb) => { const xs = spread(Math.max(1, list.length), -290, 290); xs.forEach((x, i) => { const it = list[i]; itemV(p, c, it, x, yb - 84, 130, null, { maxW: 560 / xs.length - 20 });
        if (it && it.label && picOf(it)) { const w = 560 / xs.length - 40; R(p, x - w / 2, yb - 10, w, 44, 10, F(2.6)); txt(p, it.label, x, yb + 21, { size: 26, maxW: w - 16, weight: 700, color: C.ink }); } }); };
      row(its.slice(0, nt), -30); row(its.slice(nt), 230);
    }); });

  /* 14 ── THE TABBED CARD: an index card with a tab on top — the group's name on the tab, a row per item on the card */
  variant('tabcard', 'การ์ดรายการพร้อมหัวข้อ', (d, c) => { const its = IT(d), n = N(its), L = GN(d), gap = Math.min(120, 470 / n);
    art(c, p => { R(p, -310, -320, 330, 100, 26, F(4.4)); R(p, -340, -250, 680, 540, 30, F(4.8));
      if (L) txt(p, L, -145, -258, { size: 38, maxW: 280, weight: 800, color: C.ink }); else DOT(p, -145, -270, 10);
      its.forEach((it, i) => itemH(p, c, it, -270, -210 + gap * (i + .5), 540, 68, 38));
      for (let i = 1; i < n; i++) p.line(-290, -210 + gap * i, 290, -210 + gap * i, S(1.4));
    }); });

  /* 15 ── THE GARLAND OF DISCS: round discs hang along a string between two nails — one item on each */
  variant('garland', 'วงกลมหลายวงพร้อมป้าย', (d, c) => { const its = IT(d), n = N(its), L = GN(d), xs = spread(n, -420, 420), r = Math.min(116, 840 / n / 2 - 12);
    const sy = x => { const u = (x + 460) / 920; return f1((1 - u) * (1 - u) * -240 + 2 * u * (1 - u) * -60 + u * u * -240); };
    art(c, p => { if (L) head(p, L, 0, -292, { maxW: 600 }); [-460, 460].forEach(x => p.circle(x, -240, 10, F(2.6))); p.path('M -460 -240 Q 0 120 460 -240', W(2.6));
      xs.forEach((x, i) => { const top = +sy(x) + 8, cy = top + r + 22; p.line(x, sy(x), x, top + 22, W(2.2)); p.circle(x, +sy(x), 6, F(2)); disc(p, x, cy, r);
        itemV(p, c, its[i], x, cy - r * .2, r * .9, cy + r * .5, { size: 26, maxW: r * 1.5 }); });
    }); });

  /* 16 ── THE POCKET NOTEBOOK: a notebook bound with a spiral down its side, an elastic band and a pen clipped on it; the list on its page */
  variant('pocketbook', 'รายการในสมุดโน้ต', (d, c) => { const its = IT(d), n = N(its), L = GN(d), y0 = L ? -150 : -230, gap = Math.min(104, (250 - y0) / n);
    art(c, p => { R(p, -280, -310, 540, 610, 26, F(4.8)); for (let y = -270; y <= 270; y += 54) { p.circle(-280, y, 12, F(2.6)); }
      if (L) { head(p, L, 0, -232, { maxW: 400 }); p.line(-200, -196, 220, -196, W(3)); }
      its.forEach((it, i) => itemH(p, c, it, -200, y0 + gap * (i + .5), 400, 56, 34));
      R(p, 196, -310, 26, 610, 8, F(3)); R(p, 236, -330, 30, 300, 12, F(3.4)); shape(p, [[236, -30], [266, -30], [251, 10]], F(2.6)); R(p, 228, -300, 46, 18, 6, F(2.4));
    }); });

  /* 17 ── POINTING DOWN THE LIST: a person (front view) points at a tall list board on its stand */
  variant('pointlist', 'คนชี้รายการบนกระดาน', (d, c) => { const its = IT(d), n = N(its), L = GN(d), px = -330, y0 = L ? -170 : -250, gap = Math.min(110, (200 - y0) / n);
    art(c, p => { floorD(p); p.line(140, 220, 60, 290, W(5)); p.line(300, 220, 380, 290, W(5));
      R(p, -80, -320, 460, 550, 28, F(4.8)); if (L) { head(p, L, 150, -250, { maxW: 400, size: 40 }); p.line(-40, -214, 340, -214, W(3)); }
      its.forEach((it, i) => itemH(p, c, it, -40, y0 + gap * (i + .5), 380, 56, 32));
      front(p, px, 290, 1, { 1: { s: [36, -82], e: [96, -112], h: [150, -138] } });
    }); });

  /* 18 ── THE PICTOGRAM SIGN: a sign hung from the ceiling on two rods — a row of icon tiles with names, the group's name above them */
  variant('pictosign', 'แผงสัญลักษณ์หลายรายการ', (d, c) => { const its = IT(d), n = N(its), L = GN(d), xs = spread(n, -410, 410), w = Math.min(170, 820 / n - 40);
    art(c, p => { p.line(-480, -340, 480, -340, S(2)); [-300, 300].forEach(x => { R(p, x - 9, -340, 18, 120, 4, F(2.6)); });
      R(p, -450, -220, 900, 430, 30, F(4.8)); if (L) { head(p, L, -410, -150, { anchor: 'start', maxW: 820, size: 42 }); p.line(-410, -120, 410, -120, S(2)); }
      xs.forEach((x, i) => { const it = its[i], ty = L ? 0 : -40; R(p, x - w / 2, ty - w / 2, w, w, 26, F(4)); itemV(p, c, it, x, ty, w * .62, null, { maxW: w * .9, big: 30 });
        if (it && it.label && picOf(it)) txt(p, it.label, x, ty + w / 2 + 50, { size: 28, maxW: 820 / n - 20, weight: 700, color: C.ink }); });
    }); });

  /* 19 ── THE GALLERY FRAME: one frame with a window cut in its mat for each item; the group's name on a small plaque under it */
  variant('gallery', 'กลุ่มสัญลักษณ์ในกรอบ', (d, c) => { const its = IT(d), n = N(its), L = GN(d), G = grid(n, -400, -250, 400, 190);
    art(c, p => { R(p, -440, -290, 880, 520, 14, F(5.4)); R(p, -410, -260, 820, 460, 8, F(2));
      G.at.forEach(([x, y], i) => { const w = G.cw - 40, h = G.ch - 30; R(p, x - w / 2, y - h / 2, w, h, 6, F(3.6)); itemV(p, c, its[i], x, y - h * .12, Math.min(w, h) * .48, y + h * .33, { size: 26, maxW: w - 20 }); });
      if (L) { R(p, -200, 254, 400, 66, 14, F(3.8)); head(p, L, 0, 298, { size: 32, maxW: 360 }); }
    }); });

  /* 20 ── THE OVERVIEW POSTER: a poster clipped to a rail by two bulldog clips — the group's name as its title, a tile per item */
  variant('overview', 'แผ่นภาพรวมของรายการ', (d, c) => { const its = IT(d), n = N(its), L = GN(d), G = grid(n, -350, L ? -130 : -220, 350, 280);
    art(c, p => { R(p, -470, -330, 940, 20, 10, F(3)); R(p, -380, -280, 760, 590, 12, F(4.6));
      [-260, 260].forEach(x => { shape(p, [[x - 50, -300], [x + 50, -300], [x + 40, -250], [x - 40, -250]], F(3.6)); p.path(`M ${x - 30} -300 L ${x - 20} -322 L ${x + 20} -322 L ${x + 30} -300`, W(2.6)); });
      if (L) { head(p, L, 0, -178, { maxW: 680, size: 48 }); p.line(-330, -150, 330, -150, W(3)); }
      G.at.forEach(([x, y], i) => { const w = G.cw - 30, h = G.ch - 30; R(p, x - w / 2, y - h / 2, w, h, 22, F(3.4)); itemV(p, c, its[i], x, y - h * .14, Math.min(w, h) * .5, y + h * .32, { size: 28, maxW: w - 24 }); });
    }); });

  /* ---------- sample data (A: lists from unrelated topics · B: stress) ---------- */
  const I = (icon, label) => label ? (icon ? { icon, label } : { label }) : { icon };
  const D = (say, label, ...items) => ({ say, label, items });
  const SAMPLES = [
    D('ค่าใช้จ่ายมีค่าเช่า ค่าไฟ ค่าน้ำ', 'ค่าใช้จ่าย', I('house', 'ค่าเช่า'), I('zap', 'ค่าไฟ'), I('droplets', 'ค่าน้ำ')),
    D('ทีมเรามีนักออกแบบ คนเขียนโค้ด และคนขาย', null, I('palette', 'นักออกแบบ'), I('code', 'คนเขียนโค้ด'), I('store', 'คนขาย')),
    D('ของที่ต้องพกไปทะเล ครีมกันแดด แว่น หมวก ร่ม', 'ของไปทะเล', I('sun', 'ครีมกันแดด'), I('glasses', 'แว่น'), I('shirt', 'หมวก'), I('umbrella', 'ร่ม')),
    D('มีสองแบบ แบบรายเดือนกับแบบรายปี', null, I('calendar', 'รายเดือน'), I('calendar-check', 'รายปี')),
    D('อาหารเช้ามีกาแฟ ขนมปัง ไข่', 'อาหารเช้า', I('coffee', 'กาแฟ'), I('croissant', 'ขนมปัง'), I('egg', 'ไข่')),
    D('ช่องทางขายมีหน้าร้าน ออนไลน์ และตลาดนัด', 'ช่องทางขาย', I('store', 'หน้าร้าน'), I('laptop', 'ออนไลน์'), I('tent', 'ตลาดนัด')),
    D('ต้องมีสามอย่าง เวลา เงิน และใจ', null, I('clock', 'เวลา'), I('wallet', 'เงิน'), I('heart', 'ใจ')),
    D('มื้อเย็นมีพิซซ่ากับแซนด์วิช', 'มื้อเย็น', I('pizza', 'พิซซ่า'), I('sandwich', 'แซนด์วิช')),
    D('เครื่องมือที่ใช้ทุกวัน อีเมล ปฏิทิน โน้ต แชต', 'เครื่องมือ', I('mail', 'อีเมล'), I('calendar', 'ปฏิทิน'), I('notebook-pen', 'โน้ต'), I('message-circle', 'แชต')),
    D('ผลไม้ที่มีวิตามินซี ส้ม ฝรั่ง กีวี', null, I('citrus', 'ส้ม'), I('apple', 'ฝรั่ง'), I('cherry', 'กีวี')),
    D('ไปได้ทั้งรถไฟ รถบัส และเครื่องบิน', 'วิธีเดินทาง', I('train-front', 'รถไฟ'), I('bus', 'รถบัส'), I('plane', 'เครื่องบิน')),
    D('ห้องนี้มีโซฟา เตียง และโคมไฟ', null, I('sofa', 'โซฟา'), I('bed', 'เตียง'), I('lamp', 'โคมไฟ')),
    D('หนังสือที่แนะนำ มีนิยาย ธุรกิจ และจิตวิทยา', 'หนังสือแนะนำ', I('book-open', 'นิยาย'), I('briefcase', 'ธุรกิจ'), I('brain', 'จิตวิทยา')),
    D('วัตถุดิบมีแป้ง น้ำตาล เนย นม', 'วัตถุดิบ', I('wheat', 'แป้ง'), I('candy', 'น้ำตาล'), I('cookie', 'เนย'), I('droplet', 'นม')),
    D('คุณสมบัติที่ดี ซื่อสัตย์ ขยัน ใจเย็น', null, I('shield-check', 'ซื่อสัตย์'), I('zap', 'ขยัน'), I('smile', 'ใจเย็น')),
    D('งานอดิเรกของผมคือวาดรูปกับเล่นดนตรี', 'งานอดิเรก', I('palette', 'วาดรูป'), I('music', 'เล่นดนตรี')),
    D('กีฬาที่ชอบ ปั่นจักรยาน ยกเวท วิ่ง', 'กีฬา', I('bike', 'ปั่นจักรยาน'), I('dumbbell', 'ยกเวท'), I('activity', 'วิ่ง')),
    D('ร้านนี้มีชา กาแฟ และน้ำผลไม้', null, I('cup-soda', 'ชา'), I('coffee', 'กาแฟ'), I('citrus', 'น้ำผลไม้')),
    D('แอปที่ต้องมี ธนาคาร แผนที่ และกล้อง', 'แอปที่ต้องมี', I('landmark', 'ธนาคาร'), I('map', 'แผนที่'), I('camera', 'กล้อง')),
    D('สมาชิกในบ้าน พ่อ แม่ ลูก', 'ครอบครัว', I('user', 'พ่อ'), I('user', 'แม่'), I('baby', 'ลูก')),
  ];
  const STRESS = [
    D('ไม่มีป้ายเลย', null, I('house'), I('zap'), I('droplets')),
    D('ป้ายยาวสี่ข้อ', 'ค่าใช้จ่ายรายเดือนของครอบครัว', I('house', 'ค่าเช่าคอนโด'), I('zap', 'ค่าไฟฟ้าและแอร์'), I('wifi', 'อินเทอร์เน็ตบ้าน'), I('car', 'ค่าผ่อนรถยนต์')),
    D('ไม่มีไอคอน', 'ตัวเลือก', I(null, 'แบบเริ่มต้น'), I(null, 'แบบโปร')),
    D('ภาษาอังกฤษ', 'Daily tools', I('mail', 'Email'), I('calendar', 'Calendar'), I('message-circle', 'Chat')),
    D('ชื่อไอคอนที่ไม่มี', null, I('no-such-icon', 'ของชิ้นแรก'), I('no-such', 'ของชิ้นที่สอง')),
    D('ไม่มีอะไรเลย', null),
    D('สองรายการไม่มีชื่อกลุ่ม', null, I('pizza', 'พิซซ่า'), I('sandwich', 'แซนด์วิช')),
    D('สี่รายการไม่มีป้าย', 'สี่อย่าง', I('sun'), I('moon'), I('star'), I('cloud')),
    D('ผสม', 'ผสม', I('coffee', 'กาแฟ'), I(null, 'ชาไทย'), I('cup-soda')),
    D('ชื่อกลุ่มยาวมาก', 'สิ่งที่ต้องเตรียมก่อนออกเดินทางไกลทุกครั้ง', I('map', 'แผนที่'), I('wallet', 'เงิน')),
    D('ป้ายยาวมาก', null, I('book-open', 'หนังสือที่อ่านแล้วเปลี่ยนชีวิต'), I('brain', 'ความรู้ที่ใช้ได้จริงทุกวัน')),
    D('ไม่มีไอคอนสี่ข้อ', null, I(null, 'จันทร์'), I(null, 'พุธ'), I(null, 'ศุกร์'), I(null, 'อาทิตย์')),
    D('อังกฤษยาว', 'Things to pack', I('sun', 'Sunscreen'), I('glasses', 'Sunglasses'), I('umbrella', 'Umbrella')),
    D('ตัวเลขในป้าย', null, I('calendar', '7 วัน'), I('calendar-check', '30 วัน')),
    D('รายการเดียว', 'มีแค่หนึ่ง', I('gift', 'ของขวัญ')),
    D('ปกติ', 'ผลไม้', I('apple', 'แอปเปิล'), I('citrus', 'ส้ม'), I('cherry', 'เชอร์รี')),
    D('ไม่มีชื่อกลุ่ม สี่ข้อ', null, I('mail', 'อีเมล'), I('phone', 'โทร'), I('message-circle', 'แชต'), I('video', 'วิดีโอ')),
    D('ชื่อกลุ่มอย่างเดียว', 'ว่างเปล่า'),
    D('อังกฤษไม่มีไอคอน', null, I(null, 'Basic'), I(null, 'Pro'), I(null, 'Team')),
    D('ไม่มีอะไรเลย 2', null),
  ];

  G.cats = G.cats || {};
  G.cats.B17 = { variants: V, SAMPLES, STRESS, draw: (i, d, c) => { setZ(c); CUR = V[i].id; V[i].build(d || {}, c); }, CLAMPS, timing: c => (setZ(c), Object.assign({}, Z)) };
})();
