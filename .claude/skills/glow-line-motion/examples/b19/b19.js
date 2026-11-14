/* b19.js — category B19 "ความรู้สึก / อารมณ์" (a feeling: what is felt, whose, which way). House style of B01–B18, line weight of B16–B18 (bold
   bright outlines, round corners, few thin inner lines, big clear icons). Designs from the user's ideas in references/cutpack-visual-ideas.md
   ("ความรู้สึก", 20 ideas). No faces, no hands (user: "เราไม่วาดหน้าและอวัยวะคน"): the feeling shows as the data's own feel icon (emoji-face
   icons are not body parts) on a real thing + the whole-body pose of a faceless person. Crossed arms = forearms over the body, ends hidden;
   "clenched fists" = a tense body (shoulders up, arms stiff, shaking).
   CutPack (references/cutpack-CATEGORIES.md v2, cat_ai.py): feel THING (smile laugh frown angry annoyed meh heart heart-crack party-popper …,
   label = the feeling word as said) · who THING (optional) · mood good | bad (optional — tilts a few designs: a sign hangs straight or crooked,
   a knot is tangled or smooth, arms up or down).
   GL.cats.B19.draw(i, data, { x, y, s, at, hit, speed }) — canvas 1000 × 700 centred at (0,0); hit = seconds after `at` (default 1.9). */
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
    cp.id = 'b19clip' + (++CID); Object.entries({ x, y, width: w, height: h }).forEach(([k, v]) => r.setAttribute(k, v)); cp.appendChild(r);
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

  /* ---------- the data: feel (the feeling) · who (optional) · mood good | bad (optional) ---------- */
  const FE = d => d && has(d.feel) ? d.feel : null;
  const WO = d => d && d.who && has(d.who) ? d.who : null;
  const MO = d => d && d.mood === 'bad' ? -1 : d && d.mood === 'good' ? 1 : 0;
  const DOT = (q, x, y, r = 8) => q.circle(x, y, r, SOLID(1));
  /* the feeling lands on the keyword: its icon pops, the feeling word under it (no icon → the word big; nothing → a lit star) */
  const feelV = (q, c, X, x, y, w, ly, o = {}) => hero(q, c, X, x, y, w, ly, Object.assign({ rip: false, size: 42, maxW: 320, bigSize: 52, bigW: 340 }, o));
  /* who: a round badge with its icon; no icon → the label in the badge */
  function whoB(q, c, Wd, x, y, r = 44, o = {}) { if (!Wd) return; const t = o.t ?? Z.H, g = popAt(q, x, y, t); ring(g, x, y, r, r - 12, F(3.4)); g.circle(x, y, r - 12, F(1));
    if (picOf(Wd)) put(q, c, { icon: Wd.icon }, x, y, r * 1.15, null, { t: t + tu(.04), punch: t + tu(.18) });
    else if (Wd.label) txt(g, Wd.label, x, y + 9, { size: 26, maxW: r * 1.6, weight: 800, color: C.ink }); }
  const tWho = Q => f3(Q.T0 + tu(.2));

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
    const far = o.far || { s: [arm.s[0] - 8, arm.s[1] + 2], e: [arm.e[0] - 14, arm.e[1] + 10], h: [arm.h[0] - 18, arm.h[1] + 12] }, fa = sub(g);
    [[far.s, far.e, 25], [far.e, far.h, 23]].forEach(([a, b, wd]) => fa.line(...a, ...b, { sw: wd + 7 })); [[far.s, far.e, 25], [far.e, far.h, 23]].forEach(([a, b, wd]) => fa.line(...a, ...b, { sw: wd, stroke: C.fill }));
    return G.parts.human(g, 'line', Object.assign({}, SIDE, o.head ? { head: o.head } : {}, { arm: () => arm, leg: o.seat ? SEATL : (o.leg || stand) })); }
  const HANG = { s: [4, -78], e: [8, -24], h: [12, 30] };
  const UPV = sd => ({ s: [sd * 36, -82], e: [sd * 74, -150], h: [sd * 100, -222] });
  /* a heart (w = its width), centred on (x, y) */
  const heartD = (x, y, w) => { const P = (a, b) => f1(x + a * w) + ' ' + f1(y + b * w);
    return `M ${P(0, .38)} C ${P(-.3, .18)} ${P(-.52, -.02)} ${P(-.5, -.22)} C ${P(-.48, -.44)} ${P(-.2, -.5)} ${P(0, -.3)} C ${P(.2, -.5)} ${P(.48, -.44)} ${P(.5, -.22)} C ${P(.52, -.02)} ${P(.3, .18)} ${P(0, .38)} Z`; };
  /* a coil spring standing from y0 up to y1 (flat loops) */
  const coil = (q, x, y0, y1, rx = 46, n = 8) => { for (let i = 0; i < n; i++) ell(q, x, f1(lerp(y0, y1, (i + .5) / n)), rx, 9, W(4)); };
  /* a tangled knot (bad) or a smooth ring (otherwise) round (x, y) */
  function knot(q, x, y, r, tangled) { if (!tangled) { q.circle(x, y, r, W(4)); q.circle(x, y, r - 16, S(1.6)); return; }
    const pts = []; for (let i = 0; i <= 220; i++) { const a = i / 220 * Math.PI * 2 * 2.6 - .4, rr = r + 16 * Math.sin(a * 5.3) + 11 * Math.sin(a * 8.7 + 1) - 6 * Math.cos(a * 3.1); pts.push([x + rr * Math.cos(a), y + rr * Math.sin(a)]); }
    q.path(pathOf(pts, false), W(3)); }

  /* 01 ── THE SIGN ON A SPRING (ใบหน้ามีสีหน้าดีใจ): the base lands, the round sign springs up on its coil and wobbles; the feeling lands on it */
  variant('spring', 'ป้ายกลมบนสปริง', (d, c) => { const X = FE(d), Wh = WO(d), Q = TL();
    art(c, p => { floorD(p); const st = inG(p, 'rise', 0, 270, tu(.04)); ell(st, 0, 280, 130, 14, F(3.4)); R(st, -64, 254, 128, 26, 12, F(3.2));
      const sp = inG(p, 'rise', 0, 120, tu(.16)); coil(sp, 0, 254, 128); R(sp, -16, 84, 32, 48, 8, F(2.8)); disc(sp, 0, -106, 196);
      feelV(p, c, X, 0, -146, 150, 4, { size: 40, maxW: 270, bigW: 280 }); whoB(p, c, Wh, 196, -262, 46, { t: tWho(Q) });
    }); });

  /* 02 ── MANY FEELINGS ON A RAIL (ใบหน้าหลายอารมณ์): round tiles of feelings sit on a rail; one is lifted out of its slot and shown big */
  variant('tiles', 'แผงหลายอารมณ์', (d, c) => { const X = FE(d), Wh = WO(d), Q = TL();
    art(c, p => { const rl = inG(p, 'pop', 0, 210, tu(.04)); R(rl, -470, 196, 940, 30, 15, F(3.6)); [-440, 440].forEach(x => screw(rl, x, 211, 6));
      [['laugh', -370], ['smile', -200], ['meh', 200], ['frown', 370]].forEach(([ic, x], i) => { const g = inG(p, 'pop', x, 128, tu(.14 + .05 * i)); g.circle(x, 128, 62, F(3.2)); g.circle(x, 128, 50, S(1.4));
        put(p, c, { icon: ic }, x, 128, 70, null, { t: tu(.18 + .05 * i), o: [[0, .5]] }); });
      p.circle(0, 128, 62, S(2.2)); DOT(p, 0, 182, 6);
      disc(inG(p, 'pop', 0, -150, tu(.4)), 0, -150, 172); feelV(p, c, X, 0, -192, 120, -80, { size: 36, maxW: 230, bigW: 250 });
      whoB(p, c, Wh, 290, -260, 44, { t: tWho(Q) });
    }); });

  /* 03 ── THE HANGING SIGN (ใบหน้ามีสีหน้าเศร้า): the sign drops on its two cords; mood bad → one cord gives, the sign swings down crooked */
  variant('hang', 'ป้ายแขวนห้อย', (d, c) => { const X = FE(d), Wh = WO(d), Q = TL(), bad = MO(d) < 0, A = bad ? 18 : 0, px = -160, py = -120;
    art(c, p => { R(inG(p, 'pop', 0, -334, tu(.04)), -330, -346, 660, 22, 11, F(3.2)); [-160, 160].forEach(x => { p.circle(x, -312, 12, F(2.6)); });
      p.line(-160, -300, px, py, W(2.6)); const rx = f1(px + 320 * Math.cos(rad(A))), ry = f1(py + 320 * Math.sin(rad(A)));
      if (bad) { p.path('M 160 -300 Q 168 -262 152 -236', W(2.6)); } else p.line(160, -300, rx, ry, W(2.6));
      const sg = rot(inG(p, 'drop', 0, 0, tu(.12)), A, px, py); R(sg, -220, -120, 440, 300, 26, F(4.8)); R(sg, -196, -96, 392, 252, 16, S(1.4));
      [-160, 160].forEach(x => sg.circle(x, -100, 9, F(2.2))); if (bad) sg.path('M 160 -100 Q 150 -126 166 -146', W(2.6));
      feelV(rot(p, A, px, py), c, X, 0, -6, 130, 116, { size: 40, maxW: 340, bigW: 360, mv: A ? { px, py, r: [[0, A]] } : undefined });
      whoB(p, c, Wh, 340, -230, 44, { t: tWho(Q) });
    }); });

  /* 04 ── LOOKING FAR (คนมองออกไปไกล): on the hilltop a person looks out; the feeling rises over the horizon like the sun */
  variant('horizon', 'คนมองออกไปไกล', (d, c) => { const X = FE(d), Wh = WO(d), Q = TL();
    art(c, p => { floorD(p); p.line(-150, 150, 480, 150, S(2)); [[80, 380, 180], [150, 310, 206]].forEach(([a, b, y]) => p.line(a, y, b, y, S(1.6)));
      disc(inG(p, 'rise', 230, -20, tu(.3)), 230, -20, 156); feelV(p, c, X, 230, -52, 120, 64, { size: 36, maxW: 220, bigW: 240 });
      inG(p, 'rise', -320, 220, tu(.04)).path('M -480 290 L -480 170 Q -330 110 -180 170 Q -110 200 -70 290 Z', F(3.6));
      side(inG(p, 'rise', -330, 60, tu(.16)), -330, 140, .85, HANG, { head: [14, -138, 31] });
      whoB(p, c, Wh, -170, -120, 40, { t: tWho(Q) });
    }); });

  /* 05 ── ARMS CROSSED (คนกอดอก): a person stands with arms crossed beside the A-frame board; the feeling lands on the board */
  variant('crossed', 'คนกอดอก', (d, c) => { const X = FE(d), Wh = WO(d), Q = TL();
    art(c, p => { floorD(p); const bd = inG(p, 'rise', 200, 40, tu(.04)); R(bd, 70, -276, 260, 26, 12, F(3.2)); shape(bd, [[84, -250], [316, -250], [356, 290], [44, 290]], F(4.8));
      shape(bd, [[108, -222], [292, -222], [322, 260], [78, 260]], S(1.4)); feelV(p, c, X, 200, -100, 140, 50, { size: 40, maxW: 230, bigW: 250 });
      const { g } = body(inG(p, 'rise', -230, 160, tu(.2)), -230, 290, 1, { arms: { [-1]: { s: [-36, -82], e: [-56, -32], h: [26, -50] }, 1: { s: [36, -82], e: [56, -32], h: [-26, -42] } } });
      overArm(g, [-56, -32], [30, -52]); overArm(g, [56, -32], [-30, -40]);
      whoB(p, c, Wh, -80, -150, 40, { t: tWho(Q) });
    }); });

  /* 06 ── TENSE (คนกำมือแน่น → ตัวเกร็ง): a stiff person shakes; beside, the meter fills to the top; the feeling shows in its bulb */
  variant('tense', 'คนตัวเกร็ง', (d, c) => { const X = FE(d), Wh = WO(d), Q = TL();
    art(c, p => { drawAt(p.line(-480, 290, 60, 290, S(2)), p, 0, tu(.4));
      const mt = inG(p, 'rise', 200, 0, tu(.04)); R(mt, 160, -326, 80, 400, 40, F(4.4)); for (let y = -280; y <= 40; y += 54) mt.line(256, y, 280, y, S(2));
      mt.circle(200, 160, 104, F(4.4)); mt.circle(200, 160, 88, S(1.4)); R(mt, 182, -300, 36, 370, 18, { fill: 'rgba(255,255,255,.24)', sw: 0, stroke: 'none' });
      feelV(p, c, X, 200, 146, 110, 318, { size: 34, maxW: 300, bigSize: 40, bigW: 180 });
      body(inG(p, 'rise', -200, 160, tu(.2)), -200, 290, 1, { head: [0, -126, 31], arms: { [-1]: { s: [-36, -84], e: [-46, -22], h: [-42, 40] }, 1: { s: [36, -84], e: [46, -22], h: [42, 40] } } });
      arcs(p, -200, 40, -1, 2, 96, 18, 24, W(2.6)); arcs(p, -200, 40, 1, 2, 96, 18, 24, W(2.6));
      whoB(p, c, Wh, -50, -190, 40, { t: tWho(Q) });
    }); });

  /* 07 ── HOLDING UP THE ROUND SIGN (คนยิ้มกว้าง): a person lifts the round sign high over the head; the feeling lands on it */
  variant('placard', 'คนชูป้ายกลม', (d, c) => { const X = FE(d), Wh = WO(d), Q = TL();
    art(c, p => { floorD(p); body(inG(p, 'rise', 0, 160, tu(.04)), 0, 290, .85, { arms: { [-1]: { s: [-36, -82], e: [-82, -150], h: [-70, -234] }, 1: { s: [36, -82], e: [82, -150], h: [70, -234] } } });
      disc(inG(p, 'rise', 0, -180, tu(.2)), 0, -184, 164); feelV(p, c, X, 0, -216, 130, -92, { size: 36, maxW: 230, bigW: 250 });
      whoB(p, c, Wh, 300, -200, 46, { t: tWho(Q) });
    }); });

  /* 08 ── STANDING STILL (คนยืนสงบนิ่ง): a person stands on a stone in still water, the rings settle; the feeling floats on a little raft */
  variant('calm', 'คนยืนสงบนิ่ง', (d, c) => { const X = FE(d), Wh = WO(d), Q = TL();
    art(c, p => { drawAt(p.line(-480, 200, 480, 200, S(2)), p, 0, tu(.4)); [[190, 34, 1.6], [270, 50, 1.2]].forEach(([rx, ry, w]) => ell(p, -200, 214, rx, ry, S(w))); ell(p, 250, 220, 190, 30, S(1.4));
      ell(inG(p, 'pop', -200, 206, tu(.04)), -200, 206, 120, 22, F(3.4)); body(inG(p, 'rise', -200, 80, tu(.16)), -200, 200, .8);
      const rf = inG(p, 'rise', 250, 100, tu(.3)); R(rf, 242, 120, 16, 90, 5, F(2.4)); ell(rf, 250, 210, 124, 18, F(3.4)); disc(rf, 250, -24, 150);
      feelV(p, c, X, 250, -56, 110, 60, { size: 34, maxW: 180, bigSize: 40, bigW: 200 });
      whoB(p, c, Wh, -60, -160, 40, { t: tWho(Q) });
    }); });

  /* 09 ── HEAD BOWED ON THE BENCH (คนก้มหน้า): a person sits on the bench, head bowed; the street lamp beside comes on with the feeling */
  variant('bench', 'คนนั่งก้มหน้า', (d, c) => { const X = FE(d), Wh = WO(d), Q = TL();
    art(c, p => { floorD(p); const bn = inG(p, 'rise', -230, 220, tu(.04)); R(bn, -400, 30, 22, 150, 8, F(3)); [-376, -90].forEach(x => bn.line(x, 186, x, 288, W(6)));
      side(inG(p, 'rise', -270, 60, tu(.18)), -280, 138, 1.6, { s: [0, -76], e: [34, -24], h: [80, -4] }, { seat: true, head: [24, -114, 30] });
      R(bn, -410, 168, 340, 22, 8, F(3.4));
      const lp = inG(p, 'rise', 250, 0, tu(.3)); R(lp, 240, -120, 20, 406, 6, F(3)); ell(lp, 250, 284, 70, 10, F(3)); R(lp, 214, -346, 72, 22, 8, F(3));
      lp.circle(250, -220, 104, F(3.6)); lp.circle(250, -220, 90, { fill: 'rgba(255,255,255,.12)', sw: 1.4, stroke: C.soft });
      feelV(p, c, X, 250, -238, 96, -156, { size: 28, maxW: 160, bigSize: 34, bigW: 170 });
      whoB(p, c, Wh, -70, -150, 40, { t: tWho(Q) });
    }); });

  /* 10 ── LAUGHING IN THE ROCKING CHAIR (คนหัวเราะ): a person rocks back in the chair, shaking; the feeling on the round frame on the wall */
  variant('rocking', 'คนหัวเราะบนเก้าอี้โยก', (d, c) => { const X = FE(d), Wh = WO(d), Q = TL();
    art(c, p => { floorD(p); disc(inG(p, 'pop', 250, -110, tu(.04)), 250, -110, 168); feelV(p, c, X, 250, -150, 120, -26, { size: 36, maxW: 230, bigW: 250 });
      const ch = rot(inG(p, 'rise', -160, 200, tu(.14)), -6, -160, 286);
      ch.path('M -360 262 Q -170 312 20 262', W(6)); [[-290, -280], [-60, -54]].forEach(([a, b]) => ch.line(a, 182, b, 274, W(6)));
      ch.path('M -300 170 L -350 -40', { sw: 22 }); ch.path('M -300 170 L -350 -40', { sw: 15, stroke: C.fill });
      side(ch, -230, 138, 1.3, { s: [0, -76], e: [24, -26], h: [62, -14] }, { seat: true, lean: -16, head: [0, -136, 31] });
      R(ch, -320, 160, 290, 22, 8, F(3.4));
      [-130, -95, -60].forEach(a => tick(p, -244, -40, a, 52, 74, W(3)));
      whoB(p, c, Wh, 420, 160, 40, { t: tWho(Q) });
    }); });

  /* 11 ── STANDING TALL (คนยืนด้วยท่าทางมั่นใจ): hands on hips, feet apart; the flag goes up its pole and flies the feeling */
  variant('confident', 'คนท้าวสะเอว', (d, c) => { const X = FE(d), Wh = WO(d), Q = TL();
    art(c, p => { floorD(p); const pl = inG(p, 'rise', 120, 0, tu(.04)); R(pl, 112, -322, 16, 610, 6, F(2.8)); pl.circle(120, -330, 13, F(2.6)); ell(pl, 120, 286, 70, 10, F(3));
      pl.line(132, -300, 132, 120, S(1.6)); R(pl, 128, 110, 20, 10, 4, F(2));
      inG(p, 'pop', 136, -200, tu(.3)).path('M 136 -318 Q 290 -352 446 -312 L 446 -96 Q 290 -136 136 -102 Z', F(4.4));
      feelV(p, c, X, 290, -246, 100, -146, { size: 34, maxW: 250, bigSize: 42, bigW: 270, bigDy: 40 });
      body(inG(p, 'rise', -230, 160, tu(.16)), -230, 290, 1, { arms: { [-1]: { s: [-36, -82], e: [-84, -38], h: [-40, -2] }, 1: { s: [36, -82], e: [84, -38], h: [40, -2] } },
        leg: sd => ({ h: [sd * 17, 8], k: [sd * 32, 88], f: [sd * 44, 166] }) });
      whoB(p, c, Wh, -80, -170, 40, { t: tWho(Q) });
    }); });

  /* 12 ── A SIGH AT THE WINDOW (คนถอนหายใจ): a person stands at the window, shoulders drop, breathes out — the glass fogs and the feeling shows in it */
  variant('sigh', 'คนถอนหายใจที่หน้าต่าง', (d, c) => { const X = FE(d), Wh = WO(d), Q = TL();
    art(c, p => { floorD(p); const wn = inG(p, 'pop', 180, -80, tu(.04)); R(wn, -60, -316, 480, 470, 20, F(4.8)); R(wn, -36, -292, 432, 422, 10, { fill: 'rgba(255,255,255,.05)', sw: 1.6, stroke: C.soft });
      wn.line(-36, -200, 396, -200, S(2)); R(wn, -90, 154, 540, 26, 10, F(3.4));
      p.circle(140, -40, 146, { fill: 'rgba(255,255,255,.12)', sw: 0, stroke: 'none' }); feelV(p, c, X, 140, -70, 120, 58, { size: 38, maxW: 240, bigW: 250 });
      side(inG(p, 'rise', -300, 160, tu(.16)), -300, 290, 1, HANG, { head: [22, -122, 31] });
      [[-6, 'M -236 4 Q -186 -22 -146 0 Q -112 18 -80 -4'], [16, 'M -232 22 Q -192 8 -160 24 Q -130 38 -96 22']].forEach(([_, dd]) => p.path(dd, W(2.6)));
      whoB(p, c, Wh, -410, -120, 40, { t: tWho(Q) });
    }); });

  /* 13 ── THE BOX THAT POPS (คนทำหน้าประหลาดใจ): the lid flies open, the round head springs up with the feeling; the person leans back, arms up */
  variant('jackbox', 'กล่องเด้งทำให้ตกใจ', (d, c) => { const X = FE(d), Wh = WO(d), Q = TL();
    art(c, p => { floorD(p); const bx = inG(p, 'rise', 160, 200, tu(.04)); R(bx, 40, 100, 240, 190, 14, F(4.6)); R(bx, 60, 120, 200, 150, 8, S(1.4));
      bx.line(280, 190, 316, 190, W(5)); bx.line(316, 190, 316, 150, W(5)); bx.circle(316, 146, 12, F(2.6));
      R(rot(p, -118, 40, 100), 40, 86, 240, 16, 6, F(3.4));
      p.path('M 160 100 L 128 86 L 192 68 L 128 50 L 192 32 L 128 14 L 192 -4 L 160 -20', W(5));
      disc(inG(p, 'pop', 160, -150, tu(.3)), 160, -150, 126); feelV(p, c, X, 160, -152, 120, 210, { size: 34, maxW: 190, bigSize: 40, bigW: 200, bigDy: 16 });
      body(inG(p, 'rise', -270, 160, tu(.2)), -270, 290, .9, { lean: -8, arms: { [-1]: { s: [-36, -82], e: [-78, -128], h: [-92, -184] }, 1: { s: [36, -82], e: [78, -128], h: [92, -184] } } });
      [-140, -90, -40].forEach(a => tick(p, -297, 24, a, 66, 88, W(3)));
      whoB(p, c, Wh, -440, -230, 40, { t: tWho(Q) });
    }); });

  /* 14 ── IN THE HAMMOCK (คนยิ้มอย่างผ่อนคลาย): a person lies back in the hammock as it sways; the feeling hangs on the line above */
  variant('hammock', 'คนนอนเปลผ่อนคลาย', (d, c) => { const X = FE(d), Wh = WO(d), Q = TL();
    art(c, p => { floorD(p); [-400, 400].forEach((x, i) => { const g = inG(p, 'rise', x, 0, tu(.04 + .04 * i)); R(g, x - 11, -300, 22, 586, 6, F(3)); g.circle(x, -306, 13, F(2.6)); ell(g, x, 286, 50, 9, F(2.6)); });
      drawAt(p.path('M -390 -290 Q 0 -250 390 -290', S(1.8)), p, tu(.12), tu(.3)); p.line(0, -270, 0, -250, W(2.4));
      disc(inG(p, 'drop', 0, -150, tu(.2)), 0, -150, 104); feelV(p, c, X, 0, -170, 92, -96, { size: 26, maxW: 150, bigSize: 30, bigW: 160 });
      [-1, 1].forEach(sd => p.line(sd * 390, -30, sd * 332, 0, W(2.6)));
      const g = p.child({ transform: 'translate(20 70) rotate(-82) scale(.85)' }, .85); g.H = p.H; g.motion = p.motion;
      G.parts.human(g, 'line', Object.assign({}, SIDE, { arm: () => ({ s: [4, -78], e: [16, -26], h: [26, 24] }), leg: stand }));
      p.path('M -332 0 Q 0 170 332 0 Q 0 280 -332 0 Z', F(3.8)); p.path('M -280 26 Q 0 196 280 26', S(1.4));
      whoB(p, c, Wh, 300, 180, 42, { t: tWho(Q) });
    }); });

  /* 15 ── PACING (คนมีสีหน้ากังวล): a person paces; above, the line gets tangled (mood bad) — or runs smooth — round the feeling */
  variant('pacing', 'คนเดินวนกังวล', (d, c) => { const X = FE(d), Wh = WO(d), Q = TL();
    art(c, p => { floorD(p); for (let i = 0; i < 18; i++) { const a = i / 18 * Math.PI * 2; p.line(f1(-230 + 190 * Math.cos(a)), f1(306 + 20 * Math.sin(a)), f1(-230 + 190 * Math.cos(a + .14)), f1(306 + 20 * Math.sin(a + .14)), S(2.4)); }
      side(inG(p, 'rise', -230, 160, tu(.04)), -230, 290, .95, { s: [4, -76], e: [24, -36], h: [40, 4] }, { leg: stride, far: { s: [-4, -74], e: [-24, -36], h: [-36, 6] }, head: [16, -128, 31] });
      knot(inG(p, 'pop', 170, -150, tu(.3)), 170, -150, 156, MO(d) < 0); feelV(p, c, X, 170, -150, 120, 90, { size: 42, maxW: 360, bigW: 280, bigDy: 20 });
      whoB(p, c, Wh, -390, -170, 40, { t: tWho(Q) });
    }); });

  /* 16 ── AT THE DOOR (คนยืนท่าทางลังเล): a person steps up to the door, then leans back half a step; the feeling shows in its round window */
  variant('door', 'คนลังเลหน้าประตู', (d, c) => { const X = FE(d), Wh = WO(d), Q = TL();
    art(c, p => { floorD(p); const dr = inG(p, 'pop', 240, 0, tu(.04)); R(dr, 80, -316, 320, 606, 10, F(4.8)); R(dr, 100, -296, 280, 586, 6, F(3));
      ring(dr, 240, -136, 104, 90, F(3.4)); dr.circle(240, -136, 90, { fill: 'rgba(255,255,255,.12)', sw: 0, stroke: 'none' }); R(dr, 344, 10, 14, 58, 7, F(2.4));
      feelV(p, c, X, 240, -136, 110, 40, { size: 34, maxW: 240, bigSize: 40, bigW: 250, bigDy: 14 });
      side(inG(p, 'rise', -230, 160, tu(.2)), -230, 290, 1, { s: [4, -78], e: [-4, -26], h: [2, 28] }, { lean: -7, leg: stride, far: { s: [-4, -76], e: [-16, -28], h: [-12, 26] } });
      whoB(p, c, Wh, -380, -150, 40, { t: tWho(Q) });
    }); });

  /* 17 ── THE HEART IN THE FRAME (หัวใจในกรอบ): the frame drops on its nail, the heart draws itself inside and beats; the feeling in the heart */
  variant('heartframe', 'หัวใจในกรอบ', (d, c) => { const X = FE(d), Wh = WO(d), Q = TL();
    art(c, p => { popAt(p, 0, -338, tu(.04)).circle(0, -338, 9, F(2.6));
      const fr = inG(p, 'drop', 0, 0, tu(.1)); fr.path('M -150 -262 L 0 -332 L 150 -262', W(2.2)); R(fr, -250, -262, 500, 560, 16, F(5)); R(fr, -222, -234, 444, 504, 8, S(1.6));
      inG(p, 'pop', 0, -40, tu(.3)).path(heartD(0, -30, 380), F(4.4)); feelV(p, c, X, 0, -66, 120, 214, { size: 40, maxW: 380, bigW: 300, bigDy: 26 });
      whoB(p, c, Wh, 214, -226, 40, { t: tWho(Q) });
    }); });

  /* 18 ── A SILHOUETTE AND A HEART (ภาพเงาคนกับสัญลักษณ์หัวใจ): a person stands dark against a lit doorway; the heart sign beside lights the feeling */
  variant('silhouette', 'เงาคนกับหัวใจ', (d, c) => { const X = FE(d), Wh = WO(d), Q = TL();
    art(c, p => { floorD(p); const dw = inG(p, 'pop', -310, 0, tu(.04)); R(dw, -440, -300, 260, 590, 14, F(4.6)); R(dw, -418, -278, 216, 566, 8, { fill: 'rgba(255,255,255,.16)', sw: 0, stroke: 'none' });
      body(inG(p, 'rise', -310, 160, tu(.16)), -310, 290, .86);
      const hs = inG(p, 'rise', 170, 100, tu(.3)); R(hs, 160, 80, 20, 206, 6, F(2.8)); ell(hs, 170, 286, 80, 10, F(3)); hs.path(heartD(170, -84, 460), F(4.6));
      feelV(p, c, X, 170, -132, 120, -16, { size: 40, maxW: 300, bigW: 320 });
      whoB(p, c, Wh, 430, 190, 40, { t: tWho(Q) });
    }); });

  /* 19 ── THE BALL THAT OPENS (คนยกมือแสดงความดีใจ): the hanging ball splits, streamers fall, the banner drops with the feeling; arms go up
     (mood bad → arms stay down, head bowed) */
  variant('ballopen', 'คนยกมือดีใจ', (d, c) => { const X = FE(d), Wh = WO(d), Q = TL(), bad = MO(d) < 0;
    art(c, p => { floorD(p); p.line(60, -350, 60, -318, W(2.6));
      [[1, 58], [-1, -58]].forEach(([sd, a]) => rot(p, a, 60, -318).path(`M 60 -318 A 58 58 0 0 ${sd > 0 ? 0 : 1} 60 -202 Z`, F(3.4)));
      ['M 30 -240 Q -40 -150 0 -70 Q 30 0 -20 70', 'M 46 -236 Q -10 -170 -60 -110', 'M 90 -240 Q 160 -150 120 -70 Q 90 0 140 70', 'M 74 -236 Q 130 -170 180 -110'].forEach(dd => p.path(dd, W(2.6)));
      const bn = inG(p, 'drop', 60, -100, tu(.3)); bn.line(60, -280, 60, -262, W(2.4)); R(bn, -40, -262, 200, 300, 12, F(4.4)); shape(bn, [[-40, 38], [160, 38], [60, 84]], F(3.4));
      feelV(p, c, X, 60, -170, 110, -50, { size: 32, maxW: 170, bigSize: 36, bigW: 180 });
      body(inG(p, 'rise', -290, 160, tu(.16)), -290, 290, .9, bad ? { head: [0, -120, 31] } : { arms: { [-1]: UPV(-1), 1: UPV(1) } });
      whoB(p, c, Wh, 340, -60, 46, { t: tWho(Q) });
    }); });

  /* 20 ── THE STICKER (ใบหน้าพร้อมคำกำกับอารมณ์): a round sticker peels off the sheet and sticks onto the card; the feeling word prints under it */
  variant('sticker', 'สติกเกอร์พร้อมคำ', (d, c) => { const X = FE(d), Wh = WO(d), Q = TL();
    art(c, p => { const sh = inG(p, 'pop', -310, 0, tu(.04)); R(sh, -460, -200, 300, 420, 18, F(4.4));
      [[-385, -110], [-235, -110], [-385, 10], [-235, 10], [-385, 130], [-235, 130]].forEach(([x, y], i) => { if (i === 1) { sh.circle(x, y, 50, S(2)); return; } sh.circle(x, y, 50, F(3)); sh.circle(x, y, 38, S(1.4)); });
      const cd = inG(p, 'pop', 190, 0, tu(.16)); R(cd, -80, -290, 540, 580, 24, F(4.8));
      const st = inG(p, 'pop', 190, -80, tu(.36)); st.circle(190, -80, 152, F(4)); st.circle(190, -80, 136, S(1.4));
      feelV(p, c, X, 190, -86, 150, 176, { size: 50, maxW: 460, bigSize: 56, bigW: 260 });
      whoB(p, c, Wh, -310, 276, 40, { t: tWho(Q) });
    }); });

  /* ---------- sample data (A: feelings from unrelated topics · B: stress) ---------- */
  const I = (icon, label) => label ? (icon ? { icon, label } : { label }) : { icon };
  const D = (say, feel, who, mood) => ({ say, feel, who, mood });
  const SAMPLES = [
    D('ดีใจมากที่ได้งานนี้', I('smile', 'ดีใจ'), I('user', 'ผม'), 'good'),
    D('วันนี้อารมณ์ขึ้น ๆ ลง ๆ', I('meh', 'อารมณ์แปรปรวน'), null, null),
    D('เศร้ามากตอนน้องหมาจากไป', I('frown', 'เศร้า'), null, 'bad'),
    D('รู้สึกมีความหวังขึ้นมา', I('sun', 'มีความหวัง'), null, 'good'),
    D('แอบหงุดหงิดที่เพื่อนมาสาย', I('annoyed', 'หงุดหงิด'), I('user', 'ผม'), 'bad'),
    D('โกรธจนตัวสั่น', I('angry', 'โกรธ'), null, 'bad'),
    D('ลูกค้าแฮปปี้มาก', I('laugh', 'แฮปปี้'), I('users', 'ลูกค้า'), 'good'),
    D('ตอนนี้ใจสงบมาก', I('smile', 'ใจสงบ'), null, 'good'),
    D('ผิดหวังในตัวเอง', I('frown', 'ผิดหวัง'), I('user', 'ตัวเอง'), 'bad'),
    D('ขำจนท้องแข็ง', I('laugh', 'ขำมาก'), null, 'good'),
    D('มั่นใจว่าทำได้แน่นอน', I('shield-check', 'มั่นใจ'), null, 'good'),
    D('เหนื่อยใจกับเรื่องนี้', I('meh', 'เหนื่อยใจ'), null, 'bad'),
    D('ตกใจมากตอนเห็นผล', I('zap', 'ตกใจ'), null, null),
    D('สบายใจขึ้นเยอะเลย', I('smile', 'สบายใจ'), null, 'good'),
    D('กังวลเรื่องเงินทุกคืน', I('frown', 'กังวล'), I('user', 'แม่'), 'bad'),
    D('ยังลังเลอยู่เลย', I('meh', 'ลังเล'), null, null),
    D('รักงานนี้มาก', I('heart', 'รักงานนี้'), null, 'good'),
    D('อกหักครั้งแรก', I('heart-crack', 'อกหัก'), I('user', 'เพื่อน'), 'bad'),
    D('ทั้งทีมดีใจสุด ๆ', I('party-popper', 'ดีใจสุด ๆ'), I('users', 'ทั้งทีม'), 'good'),
    D('คนดูประทับใจมาก', I('heart', 'ประทับใจ'), I('users', 'คนดู'), 'good'),
  ];
  const STRESS = [
    D('ไม่มีใคร ไม่มีทิศ', I('smile', 'ดีใจ'), null, null),
    D('คำอารมณ์ยาว', I('meh', 'รู้สึกสับสนปนเปไปหมดเลย'), I('users', 'ทีมงาน'), 'bad'),
    D('ป้ายตรง (good)', I('frown', 'เศร้า'), null, 'good'),
    D('ไม่มีไอคอน', I(null, 'คิดถึงบ้าน'), I('user', 'ผม'), 'bad'),
    D('ภาษาอังกฤษ', I('angry', 'So annoyed'), I('user', 'Me'), 'bad'),
    D('ชื่อไอคอนที่ไม่มี', I('no-such-icon', 'อึดอัด'), I('no-such', 'ใครบางคน'), 'bad'),
    D('ไม่มีอะไรเลย', null, null, null),
    D('ไอคอนอย่างเดียว', I('laugh'), null, 'good'),
    D('ใครไม่มีไอคอน', I('heart', 'รัก'), I(null, 'แฟน'), 'good'),
    D('อังกฤษยาว', I('smile', 'Really relieved now'), null, 'good'),
    D('ยาวไม่มีไอคอน', I(null, 'ภูมิใจในตัวเองที่สุด'), null, 'good'),
    D('ใครอย่างเดียว', null, I('users', 'ทุกคน'), null),
    D('สั้นมาก', I('zap', 'ตกใจ'), null, null),
    D('ทิศเสีย', I('meh', 'เบื่อ'), null, 'bad'),
    D('เส้นเรียบ (good)', I('smile', 'โล่งใจ'), I('user', 'แม่'), 'good'),
    D('ไม่มีทิศ', I('meh', 'ไม่แน่ใจ'), null, null),
    D('ใครยาว', I('heart', 'ซึ้ง'), I('users', 'เพื่อนร่วมรุ่นทั้งหมด'), 'good'),
    D('อังกฤษ 2', I('heart-crack', 'Heartbroken'), I('user', 'Her'), 'bad'),
    D('แขนลง (bad)', I('frown', 'ผิดหวัง'), I('users', 'ทั้งทีม'), 'bad'),
    D('ไม่มีอะไรเลย 2', null, null, null),
  ];

  G.cats = G.cats || {};
  G.cats.B19 = { variants: V, SAMPLES, STRESS, draw: (i, d, c) => { setZ(c); CUR = V[i].id; V[i].build(d || {}, c); }, CLAMPS, timing: c => (setZ(c), Object.assign({}, Z)) };
})();
