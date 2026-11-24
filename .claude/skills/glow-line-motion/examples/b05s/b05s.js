/* b05s.js — B05 "ถูกกับผิด" ชุด 7 ขนาด (user 2026-11-24: "เริ่มหมวดต่อไปได้ทำ 1 รอบ"). One round = one approved B05T design remixed for each of the 7
   sizes (HANDOFF 00) · fill the box · icons may float · icons big · ✓ / ✗ on the TOP layer, sized by the icon · glow / colours as B01–B09 · B05 motion is
   calm (B05T: no squash / bounce / dust). Sizes: 1 860×230 · 2 860×470 · 3 560×490 · 4 400×635 · 5 860×710 · 6 860×965 · 7 400×500.
   GL.cats.B05S.draw(round, size, data, c). Data = CutPack B05 (wrong · right THING · texts). Header + helpers copied from examples/b05t/b05t.js. */
(function () {
  const G = window.GL, C = G.C, NS = 'http://www.w3.org/2000/svg';
  const W = (w = 2) => ({ sw: w }), F = (w = 3.2) => ({ fill: C.fill, sw: w }), S = (w = 2) => ({ sw: w, stroke: C.soft });
  const rad = d => d * Math.PI / 180, f1 = v => +v.toFixed(1);
  let GLASS = 'rgba(255,255,255,.07)', LIT = 'rgba(255,255,255,.2)'; const SOLID = (w = 2) => ({ fill: C.ink, sw: w });

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
    cp.id = 'b05sclip' + (++CID); Object.entries({ x, y, width: w, height: h }).forEach(([k, v]) => r.setAttribute(k, v)); cp.appendChild(r);
    (svg.querySelector('defs') || svg).appendChild(cp); return sub(p, { 'clip-path': `url(#${cp.id})` }); }
  /* a label; too wide → smaller, or (wrap) two lines broken between Thai words */
  function txt(p, str, x, y, { size = 42, maxW = 1e9, weight = 600, anchor = 'middle', color = C.soft, wrap = null } = {}) {
    str = String(str); const e = p.text(str, x, y, { size, weight, anchor, color, dur: .01 });
    const w = e.getBBox().width; if (w <= maxW) return e;
    if (wrap && (maxW / w < .8 || size * maxW / w < 40) && typeof Intl !== 'undefined' && Intl.Segmenter) {
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
  const popAt = (q, x, y, t) => { const g = sub(q); on(g, q, 0, { ox: x, oy: y, s: [[0, .7], [t, .7], [t + tu(.24), 1, 'out']], o: [[0, 0], [t, 0], [t + tu(.1), 1]] }); return g; };   /* B05T: a calm grow-in, no overshoot */

  /* a THING (it) at (x, y) width w (+ its label at (lx, ly)). o.t = when it comes in · o.mv = keys of the part it rides ({ px, py, x, y, r, s }) ·
     o.punch = a bump at that time (the moment it is reached) · o.r = a fixed tilt (with its holder) · o.lt = when the label comes in */
  function pic(it, cx, cy, wd, c, o = {}) {
    if (!it) return null; const at = c.at || 0, X = c.x + cx * c.s, Y = c.y + cy * c.s, fn = picOf(it), t = o.t ?? tu(.12);
    let a;
    if (fn) a = G.art(fn, { x: X, y: Y, w: wd * c.s, at: at + t, speed: Z.sp });
    else { const str = it.label; if (!str) return null;
      const f = q => txt(q, str, 0, wd * .11, { size: wd * .3, maxW: o.bigW || wd * 1.25, weight: 700, color: C.ink, wrap: 'mid' }); f.custom = true; f.dur = .3; f.exit = 'pop';
      a = G.art(f, { x: X, y: Y, s: c.s, at: at + t, speed: 1 }); a.speed = Z.sp; }
    iclip(a, c);
    const K = { ox: X, oy: Y }; let any = false;
    if (o.mv) { const m = o.mv; if (m.px != null) { K.ox = c.x + m.px * c.s; K.oy = c.y + m.py * c.s; }
      ['x', 'y'].forEach(n => { if (m[n]) K[n] = m[n].map(([u, v, e]) => e ? [u, f1(v * c.s), e] : [u, f1(v * c.s)]); }); ['r', 's', 'sx', 'sy'].forEach(n => { if (m[n]) K[n] = m[n]; }); any = true; }
    else if (o.r) { K.r = [[0, o.r]]; any = true; }
    if (o.o) { K.o = o.o; any = true; }
    if (any) kf(a.wrap, at, K);
    if (o.punch != null) kf(a.g, at, { ox: X, oy: Y, s: [[0, 1], [o.punch, 1], [o.punch + tu(.07), 1.14, 'out'], [o.punch + tu(.3), 1, 'soft']] });
    return a;
  }
  /* an icon is its own art on the stage — the canvas clip (CL) does not reach it, so a thing falling in from far above showed its icon over the design
     above on the sheet. Every icon is clipped to its own canvas (stage coords; one clip per canvas) */
  const ICLIP = {};
  function iclip(a, c) { if (!a || !a.wrap || !a.wrap.parentNode) return; const svg = a.wrap.ownerSVGElement, k = [c.x, c.y, c.s].join('_');
    if (!ICLIP[k] || !svg.contains(ICLIP[k].cp)) { const cp = document.createElementNS(NS, 'clipPath'), r = document.createElementNS(NS, 'rect'); cp.id = 'b05ticlip' + (++CID);
      Object.entries({ x: c.x - BOX[0] / 2 * c.s, y: c.y - BOX[1] / 2 * c.s, width: BOX[0] * c.s, height: BOX[1] * c.s }).forEach(([n, v]) => r.setAttribute(n, v)); cp.appendChild(r); (svg.querySelector('defs') || svg).appendChild(cp); ICLIP[k] = { cp }; }
    const g = document.createElementNS(NS, 'g'); g.setAttribute('clip-path', `url(#${ICLIP[k].cp.id})`); g.setAttribute('data-wrap', 1); a.wrap.parentNode.insertBefore(g, a.wrap); g.appendChild(a.wrap); }
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
  /* B05T (user: "หมวด 5 อยากให้ลดลูกเล่นของอนิเมชั่นลงหน่อย"): a calmer fall — it slides down and settles, a small dip, no stretch / squash, no bounce */
  const fallK = (px, py, t0, t1, h = 320) => ({ px, py, y: [[0, -h], [t0, -h], [t1, 0, 'out']], sy: [[0, 1], [t1, 1], [f3(t1 + tu(.06)), .97, 'out'], [f3(t1 + tu(.16)), 1, 'soft']], o: fadeIn(t0, .06) });
  /* grows up from its base (px, py) with an overshoot */
  const upK = (px, py, t, d = .3) => ({ px, py, sy: [[0, 0], [t, 0], [f3(t + tu(d)), 1.08, 'out'], [f3(t + tu(d + .1)), .97, 'io'], [f3(t + tu(d + .18)), 1, 'soft']], o: fadeIn(t, .04) });
  /* spins in edge-on (a coin / a sign turning to face us) */
  const spinK = (px, py, t) => ({ px, py, sx: [[0, 0], [t, 0], [f3(t + tu(.12)), -.6], [f3(t + tu(.24)), 1.08, 'out'], [f3(t + tu(.34)), 1, 'soft']], o: fadeIn(t, .04) });
  /* dust kicked up left and right where something lands */
  const dust = () => {};   /* B05T: no dust (fewer flourishes) */
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

  const phaseK = (ph, s, on1 = 1, off = 0, d = .1) => { const K = [[0, off]]; let cur = null; ph.forEach(([t, w]) => { const was = cur === s, now = w === s; if (was !== now) K.push([f3(t), was ? on1 : off], [f3(t + tu(d)), now ? on1 : off, 'io']); cur = w; }); return K; };
  const posK = (ph, val, d = .22) => { const K = [[0, val(ph[0][1])]]; ph.forEach(([t, w], i) => { if (!i) return; K.push([f3(t - tu(d)), K[K.length - 1][1]], [f3(t), val(w), 'io']); }); return K; };
  const starD = (x, y, r) => pathOf(Array.from({ length: 10 }, (_, k) => { const a = rad(-90 + 36 * k), rr = k % 2 ? r * .45 : r; return [f1(x + rr * Math.cos(a)), f1(y + rr * Math.sin(a))]; }));
  const DOTF = () => ({ fill: ACC1, sw: 0, stroke: 'none' });
  const arrowD = (x0, x1, y, sh, hh, hl, l, r) => { const a = l ? x0 + hl : x0, b = r ? x1 - hl : x1, P = [[a, y - sh / 2], [b, y - sh / 2]];
    if (r) P.push([b, y - hh / 2], [x1, y], [b, y + hh / 2]); P.push([b, y + sh / 2], [a, y + sh / 2]); if (l) P.push([a, y + hh / 2], [x0, y], [a, y - hh / 2]); return pathOf(P); };

  /* ================= B04T — ขั้นตอน / เช็กลิสต์ (Steps / Checklist) as a template ชุดฐาน =================
     CutPack B04: items THINGs in order (2–4; CutPack sends 3) · mark { at, how 'light' | 'check' | 'x' } (optional) · texts [words per step] (optional).
     Timing: the steps come in one by one (tI), then the progress — a line lighting, a token, a needle, a highlight… — passes the steps in order (tP)
     and reaches the marked step (no mark: the last) on the keyword H: it lights (light: the others dim · check: ✓ · x: it dims and gets ✗). */
  const ITS = d => (d && Array.isArray(d.items) ? d.items.filter(has) : []).slice(0, 4);
  function STP(d) { const it = ITS(d), N = Math.max(1, it.length), m = d && d.mark && typeof d.mark === 'object' ? d.mark : null;
    const K = m && m.at != null && isFinite(+m.at) ? Math.max(0, Math.min(N - 1, Math.round(+m.at))) : N - 1, hw = m && m.how === 'cross' ? 'x' : m && m.how, HOW = m ? (['light', 'check', 'x'].includes(hw) ? hw : 'light') : null, H = Z.H, E = N - 1;
    const gp = N >= 4 ? .17 : N === 3 ? .22 : .3, tI = i => f3(tu(.08 + gp * i)), tP0 = f3(Math.max(tI(N - 1) + tu(.34), H - tu(.85))), tP = i => E === 0 ? H : f3(lerp(tP0, H, i / E));
    return { it, N, K, E, HOW, H, tI, tP, tP0 }; }
  /* (user 2026-11-14: "ทำไมมันไม่ไปหยุดที่อันสุดท้าย" → "เอาทางที่คุณคิดว่าดีที่สุด"): the progress always runs every step and ends on the LAST one on H;
     mark only says which step gets the emphasis / ✓ / ✗ on H (CutPack: "the step that matters, is done or is wrong"). K = that step (no mark: the last),
     E = the last step. Designs that show ONE current step (tabs, stepper, wheel, dial, segment, focus, carousel) visit every step and settle on K. */
  const TXI = (d, i) => d && Array.isArray(d.texts) && d.texts[i] != null && String(d.texts[i]).trim() ? String(d.texts[i]).trim() : null;
  const LBI = (Q, i) => LBL(Q.it[i]);
  const SZ4 = n => n >= 4 ? 176 : n === 3 ? 210 : 240, GP4 = n => n >= 4 ? 52 : n === 3 ? 80 : 150;
  const rowXs = (n, s, gap, cx = 0) => Array.from({ length: n }, (_, k) => f1(cx + (k - (n - 1) / 2) * (s + gap)));
  const RH4 = n => n >= 4 ? 172 : n === 3 ? 214 : 250;
  const bumpsK = (ts, a = 1.08) => { const K = [[0, 1]]; ts.slice().sort((x, y) => x - y).forEach(t => K.push([t, 1], [f3(t + tu(.05)), a, 'out'], [f3(t + tu(.18)), 1, 'soft'])); return K; };
  const stState = (Q, i) => { const tg = i === Q.K, xx = tg && Q.HOW === 'x', dim = xx || (Q.HOW === 'light' && !tg); return { tg, xx, dim, lit: tg && !xx, to: xx ? .42 : .5 }; };
  const dimKeys = (Q, to) => [[0, 1], [Q.H, 1], [f3(Q.H + tu(.2)), to]];
  const passed = (Q, i) => { const t = Q.tP(i); return t != null && t < Q.H - .005 ? t : null; };
  const reach = (Q, i) => Q.tP(i);   /* when the progress reaches step i (the last one: on H) */
  /* step i as an icon slot at (x, y) size sz (o.shape box | circ | hex, or o.draw(q, style) for any outline). o.g = it rides that group (o.mv its keys).
     The progress passing bumps it; on H the target lights (or dims with x), with light the others dim. o.ix / o.iy / o.iw = where the icon sits */
  function stepBox(p, c, d, i, x, y, sz, o = {}) { const Q = STP(d), X = Q.it[i], H = Q.H, t = o.t ?? Q.tI(i), sh = o.shape || 'box', S_ = stState(Q, i), tp = passed(Q, i);
    const draw = o.draw || ((q, st) => shp(q, sh, x, y, sz, st));
    const g0 = o.g || popAt(p, x, y, t); if (S_.dim && o.bk !== false) draw(g0, BK);
    const g1 = S_.dim ? mvG(g0, { o: dimKeys(Q, S_.to) }) : g0, ts = [], arr = i === Q.E && !S_.lit; if (tp != null) ts.push(tp); if (S_.lit || arr) ts.push(H);
    const g = ts.length && o.bump !== false ? mvG(g1, { px: x, py: y, s: bumpsK(ts) }) : g1;
    draw(g, o.style || F(4)); if (sh === 'circ' && !o.draw) g.circle(x, y, sz / 2 - 13, SL(1.4));
    if (S_.lit && !T_OFF) { draw(litOn(g, H), o.litStyle || LIT2()); if (o.rip !== false) ripple(p, o.ix ?? x, o.iy ?? y, sz * .58, f3(H + tu(.04))); }
    if (o.passRip !== false) { if (tp != null) ripple(p, o.ix ?? x, o.iy ?? y, sz * .48, tp); if (arr) ripple(p, o.ix ?? x, o.iy ?? y, sz * .52, H); }
    const iw = o.iw || sz * (sh === 'box' ? .72 : .66);
    if (X && picOf(X)) put(p, c, { icon: X.icon }, o.ix ?? x, o.iy ?? y, iw, null, { t: o.ti ?? f3(t + tu(.04)), mv: o.mv, o: o.io ?? (S_.dim ? dimKeys(Q, S_.to) : undefined), punch: S_.lit ? H : undefined });
    else if (X && X.label) txt(o.tg || g, X.label, o.ix ?? x, (o.iy ?? y) + 16, { size: Math.max(40, Math.min(56, (o.iw || sz) * .22)), maxW: o.lw || (o.iw || sz) * .84, weight: 800, color: C.ink, wrap: 'mid' });
    else g.circle(o.ix ?? x, o.iy ?? y, 16, DOTF());
    return g; }
  let T_OFF = false;
  const cornerB = (x, y, sz) => [f1(x + sz / 2 - 6), f1(y + sz / 2 - 6)];   /* bottom-right — where a word sits above the box */
  /* step i's words: plain big letters (o.pill = in a pill) — only when it has an icon (no icon → the words are in the slot) */
  function stepWord(p, d, i, x, y, o = {}) { const Q = STP(d), str = LBI(Q, i); if (!str) return null; const S_ = stState(Q, i), t = o.t ?? f3(Q.tI(i) + tu(.14)), sz = o.size || 46;
    if (o.pill) { const mw = o.maxW || 300, w = Math.min(mw, tw(p, str, sz)) + 60, cx = o.anchor === 'start' ? x + w / 2 : o.anchor === 'end' ? x - w / 2 : x;
      pill(o.g || p, str, cx, y, { t, size: sz, maxW: mw, dim: S_.dim && !o.noDim ? Q.H : undefined }); return null; }
    const g1 = popAt(o.g || p, x, y - sz * .35, t), g = S_.dim && !o.noDim ? mvG(g1, { o: dimKeys(Q, S_.to) }) : g1;
    return txt(g, str, x, y, { size: sz, maxW: o.maxW || 300, weight: 800, color: C.ink, anchor: o.anchor || 'middle', wrap: o.wrap === undefined ? 'mid' : o.wrap }); }
  /* step i's line of words (data.texts) — none → grey lines in its place */
  function stepNote(p, d, i, x, y, w, o = {}) { const Q = STP(d), S_ = stState(Q, i), t = o.t ?? f3(Q.tI(i) + tu(.2)), g1 = atG(o.g || p, t), g = S_.dim && !o.noDim ? mvG(g1, { o: dimKeys(Q, S_.to) }) : g1, str = TXI(d, i), an = o.anchor || 'start', x0 = an === 'middle' ? x - w / 2 : x;
    if (str) txt(g, str, an === 'middle' ? x : x0, y + 14, { size: o.size || 40, maxW: w, weight: 600, color: C.soft, anchor: an, wrap: 'down' });
    else { R(g, x0, y - 11, w, 22, 11, GREY()); if (!o.one) R(g, an === 'middle' ? f1(x - w * .31) : x0, y + 33, f1(w * .62), 22, 11, GREY()); } }
  /* ✓ / ✗ on the target (mark.how) */
  const markT = (p, d, at, r = 58) => { const Q = STP(d); if (Q.HOW === 'check' || Q.HOW === 'x') stamp(p, Q.HOW, at[0], at[1], r); };
  /* the lines between steps: drawn in as the steps come; the accent runs along each one as the progress passes (to the target) */
  function links(p, Q, segs, o = {}) { segs.forEach((dd, i) => { if (!dd) return; drawAt(p.path(dd, o.base || { sw: 4, stroke: TL_(.42) }), p, f3(Q.tI(i + 1) - tu(.04)), tu(.22));
      if (i < Q.E) { const a = p.path(dd, o.lit || { sw: 7, stroke: ACC1 }); on(a, p, 0, { draw: [[0, 0], [f3(Q.tP(i) + tu(.03)), 0], [Q.tP(i + 1), 1, 'io']] }); } }); }
  /* a token that travels the steps' anchor points (o.via(i) = points between i and i+1), arriving at each on its pass time, at the target on H */
  function token(p, Q, pts, o = {}) { const K = Q.E, fin = pts[K], r = o.r || 20, via = o.via || (() => []), t0 = f3(Q.tP(0) - tu(.14));
    const X = [[0, f1(pts[0][0] - fin[0])], [t0, f1(pts[0][0] - fin[0])]], Y = [[0, f1(pts[0][1] - fin[1])], [t0, f1(pts[0][1] - fin[1])]];
    for (let i = 0; i < K; i++) { const P = pathK([pts[i]].concat(via(i), [pts[i + 1]]), f3(Q.tP(i) + tu(.05)), Q.tP(i + 1), fin, 18, o.ease || sm); X.push(...P.x.slice(1)); Y.push(...P.y.slice(1)); }
    const g = mvG(o.clip ? CL(p) : p, { px: fin[0], py: fin[1], x: X, y: Y, o: [[0, 0], [t0, 0], [f3(t0 + tu(.06)), 1]].concat(o.keep ? [] : [[f3(Q.H + tu(.12)), 1], [f3(Q.H + tu(.32)), 0]]) });
    if (o.draw) o.draw(g, fin[0], fin[1]); else { g.circle(fin[0], fin[1], r, DOTF()); g.circle(fin[0], fin[1], r + 9, { sw: 2.6, stroke: ACC1 }); } return g; }
  /* entrance keys: drop (from just past the top edge) · rise (from below) · left / right (from that side) · spin · flip · pop */
  function ent(kind, x, y, sz, t) { const t1 = f3(t + tu(.28));
    if (kind === 'drop') return Object.assign(fallK(x, y + sz / 2, t, t1, f1(y + sz / 2 + 360)), { land: t1 });
    if (kind === 'rise') { const dy = f1(360 - (y - sz / 2)); return { px: x, py: y, y: [[0, dy], [t, dy], [t1, -12, 'out'], [f3(t1 + tu(.1)), 0, 'soft']], o: fadeIn(t, .04), land: t1 }; }
    if (kind === 'left' || kind === 'right') { const sd = kind === 'left' ? -1 : 1, dx = f1(sd * (510 + sz / 2) - x); return { px: x, py: y, x: [[0, dx], [t, dx], [t1, -sd * 12, 'out'], [f3(t1 + tu(.1)), 0, 'soft']], o: fadeIn(t, .04), land: t1 }; }
    if (kind === 'spin') return Object.assign(spinK(x, y, t), { land: f3(t + tu(.34)) });
    if (kind === 'flip') return { px: x, py: y, sy: [[0, 0], [t, 0], [f3(t + tu(.12)), -.5], [f3(t + tu(.24)), 1.08, 'out'], [f3(t + tu(.34)), 1, 'soft']], o: fadeIn(t, .04), land: f3(t + tu(.34)) };
    return { px: x, py: y, s: [[0, .2], [t, .2], [t1, 1.1, 'out'], [f3(t1 + tu(.12)), 1, 'soft']], o: fadeIn(t, .04), land: t1 }; }
  function entBox(p, c, d, i, x, y, sz, kind, o = {}) { const Q = STP(d), K = ent(kind, x, y, sz, Q.tI(i)); stepBox(p, c, d, i, x, y, sz, Object.assign({ g: mvG(CL(p), K), mv: K, t: Q.tI(i) }, o));
    if (kind === 'drop' && o.dust !== false) dust(p, x, y + sz / 2, K.land, sz / 220); return K; }
  const curveD = pts => { let s = `M ${pts[0][0]} ${pts[0][1]}`; for (let i = 1; i < pts.length; i++) { const [x0, y0] = pts[i - 1], [x1, y1] = pts[i], mx = f1((x0 + x1) / 2); s += ` C ${mx} ${y0} ${mx} ${y1} ${x1} ${y1}`; } return s; };
  const bez = (a, b, u) => { const mx = (a[0] + b[0]) / 2, m = 1 - u; return [f1(m * m * m * a[0] + 3 * m * m * u * mx + 3 * m * u * u * mx + u * u * u * b[0]), f1(m * m * m * a[1] + 3 * m * m * u * a[1] + 3 * m * u * u * b[1] + u * u * u * b[1])]; };
  const viaBez = pts => i => [.2, .4, .6, .8].map(u => bez(pts[i], pts[i + 1], u));


  /* ================= B05T — ถูกกับผิด (Correction / Right vs Wrong) as a template ชุดฐาน =================
     CutPack B05: wrong THING · right THING (+ texts [wrong, right]). Timing: the wrong one comes in (tW), is turned down at tN (it dims, ✗ stamps,
     a strike / a crack / a fall …), the right one comes in at tR and lands lit on the keyword H (✓). The last frame: wrong dim with ✗ · right lit with ✓. */
  const SD = (d, s) => { const X = d && (s === 'w' ? d.wrong : d.right); return has(X) ? X : null; };
  const CT = () => { const H = Z.H, tN = f3(Math.max(tu(.75), H - tu(1.0))); return { H, tW: tu(.1), tN, tR: f3(tN + tu(.3)) }; };
  const TXS5 = (d, s) => { const k = s === 'w' ? 0 : 1; return d && Array.isArray(d.texts) && d.texts[k] != null && String(d.texts[k]).trim() ? String(d.texts[k]).trim() : null; };
  const dimW = (t, to = .4) => [[0, 1], [t, 1], [f3(t + tu(.2)), to]];
  /* side s ('w' wrong | 'r' right) as an icon slot (box | circ | hex | o.draw). wrong: dims at tN (o.dimAt) · right: comes in at tR, lights on H */
  function cbox(p, c, d, s, x, y, sz, o = {}) { const T_ = CT(), X = SD(d, s), w = s === 'w', t = o.t ?? (w ? T_.tW : T_.tR), sh = o.shape || 'box', da = o.dimAt ?? T_.tN;
    const draw = o.draw || ((q, st) => shp(q, sh, x, y, sz, st)), g0 = o.g || popAt(p, x, y, t); if (w && o.bk !== false) draw(g0, BK);
    const g = w ? mvG(g0, { o: dimW(da, o.to ?? .4) }) : mvG(g0, { px: x, py: y, s: bumpK(T_.H, 1.04) });
    draw(g, o.style || F(4)); if (sh === 'circ' && !o.draw) g.circle(x, y, sz / 2 - 13, SL(1.4));
    if (!w) { draw(litOn(g, T_.H), o.litStyle || LIT2()); if (o.rip !== false) ripple(p, o.ix ?? x, o.iy ?? y, sz * .58, f3(T_.H + tu(.04))); }
    const iw = o.iw || sz * (sh === 'box' ? .72 : .66);
    if (X && picOf(X)) put(p, c, { icon: X.icon }, o.ix ?? x, o.iy ?? y, iw, null, { t: o.ti ?? f3(t + tu(.04)), mv: o.mv, o: o.io ?? (w ? dimW(da, o.to ?? .4) : undefined), punch: w ? undefined : T_.H });
    else if (X && X.label) txt(g, X.label, o.ix ?? x, (o.iy ?? y) + 16, { size: Math.max(40, iw * .3), maxW: o.lw || iw * 1.15,   /* no icon → the word fills the slot (b05s: slots are big) */ weight: 800, color: C.ink, wrap: 'mid' });
    else g.circle(o.ix ?? x, o.iy ?? y, 16, DOTF());
    return g; }
  /* side s's words (only when it has an icon): plain (o.pill = in a pill); wrong dims at tN, o.strike = a line through it */
  function cword(p, d, s, x, y, o = {}) { const X = SD(d, s), str = LBL(X); if (!str) return null; const T_ = CT(), w = s === 'w', t = o.t ?? f3((w ? T_.tW : T_.tR) + tu(.14)), sz = o.size || 46;
    if (o.pill) { const mw = o.maxW || 320, wd = Math.min(mw, tw(p, str, sz)) + 60, cx = o.anchor === 'start' ? x + wd / 2 : o.anchor === 'end' ? x - wd / 2 : x;
      pill(o.g || p, str, cx, y, { t, size: sz, maxW: mw, strike: w && o.strike ? f3(Math.max(T_.tN + tu(.04), t + tu(.1))) : undefined }); return null; }
    const g1 = popAt(o.g || p, x, y - sz * .35, t), g = w ? mvG(g1, { o: dimW(o.dimAt ?? T_.tN, .4) }) : g1;   /* dims like its icon (.4) */
    const e = txt(g, str, x, y, { size: sz, maxW: o.maxW || 320, weight: 800, color: C.ink, anchor: o.anchor || 'middle', wrap: o.wrap === undefined ? 'mid' : o.wrap });
    if (w && o.strike) { const bb = e.getBBox(); drawAt((o.g || p).line(f1(bb.x - 10), f1(bb.y + bb.height * .55), f1(bb.x + bb.width + 10), f1(bb.y + bb.height * .55), { sw: 5, stroke: C.ink }), p, f3(Math.max(T_.tN + tu(.04), t + tu(.1))), tu(.2)); }
    return e; }
  function cnote(p, d, s, x, y, wd, o = {}) { const T_ = CT(), w = s === 'w', t = o.t ?? f3((w ? T_.tW : T_.tR) + tu(.2)), g1 = atG(o.g || p, t), g = w ? mvG(g1, { o: dimW(T_.tN, .45) }) : g1, str = TXS5(d, s), an = o.anchor || 'start', x0 = an === 'middle' ? x - wd / 2 : x;
    if (str) txt(g, str, an === 'middle' ? x : x0, y + 14, { size: o.size || 40, maxW: wd, weight: 600, color: C.soft, anchor: an, wrap: 'down' });
    else { R(g, x0, y - 11, wd, 22, 11, GREY()); if (!o.one) R(g, an === 'middle' ? f1(x - wd * .31) : x0, y + 33, f1(wd * .62), 22, 11, GREY()); } }
  /* ✗ on the wrong (just after tN), ✓ on the right (just after H) */
  function stampAt(p, kind, x, y, r, t) { const g = sub(p); on(g, p, 0, { ox: x, oy: y, s: [[0, 1.25], [t, 1.25], [f3(t + tu(.2)), 1, 'out']], o: [[0, 0], [t, 0], [f3(t + tu(.1)), 1]] });   /* B05T: a calm stamp (no slam) */
    g.circle(x, y, r, F(3.6)); const k = r / 32; if (kind === 'x') XX(g, x, y, k); else g.path(`M ${f1(x - 17 * k)} ${f1(y + 1 * k)} L ${f1(x - 5 * k)} ${f1(y + 13 * k)} L ${f1(x + 18 * k)} ${f1(y - 13 * k)}`, { sw: 5.4, stroke: ACC1 }); }
  const marks5 = (p, atW, atR, r = 56, tX) => { const T_ = CT(); if (atW) stampAt(p, 'x', atW[0], atW[1], r, tX ?? f3(T_.tN + tu(.04)));   /* tX: when the wrong one has arrived where its ✗ goes */
  if (atR) stampAt(p, 'check', atR[0], atR[1], r, f3(T_.H + tu(.1))); };
  const strikeLine = (p, x0, y0, x1, y1, t, w = 7) => drawAt(p.line(x0, y0, x1, y1, { sw: w, stroke: C.ink }), p, t, tu(.2));
  const bigX = (p, x, y, r, t, w = 12) => { [[-1, -1, 1, 1], [1, -1, -1, 1]].forEach(([a, b, e, f], k) => drawAt(p.line(f1(x + a * r), f1(y + b * r), f1(x + e * r), f1(y + f * r), { sw: w, stroke: C.ink }), p, f3(t + tu(.1 * k)), tu(.16))); };

  /* motion (user: "ทำอนิเมชั่นของหมวด 5 ได้ หมวด 5 อยากให้ลดลูกเล่นของอนิเมชั่นลงหน่อย"): same story beats (wrong in → turned down → right in → lands lit on H)
     but calmer — no squash / bounce / dust, smaller bumps, stamps fade in without a slam, one ripple only where the right one lands */


  /* ================= B05S — ถูกกับผิด ชุด 7 ขนาด ================= */
  function frame(c, W0, H0) { const f = p => { p.rect(-W0 / 2, -H0 / 2, W0, H0, { sw: 3, stroke: '#ffd400' }); }; f.custom = true; f.dur = .01; f.exit = 'pop'; G.art(f, { x: c.x, y: c.y, s: c.s, at: 0, speed: 1 }); }
  const SIZES = [null, { w: 860, h: 230, th: 'แถบแบนยาว' }, { w: 860, h: 470, th: 'กว้าง' }, { w: 560, h: 490, th: 'เกือบจัตุรัส' }, { w: 400, h: 635, th: 'ตั้งแคบ' },
    { w: 860, h: 710, th: 'เต็มจอ ทรงนอน' }, { w: 860, h: 965, th: 'เต็มจอ ทรงตั้ง' }, { w: 400, h: 500, th: 'ตั้งแคบ สั้น' }];

  /* ---------- ROUND 1 · ขีดฆ่าแล้วเขียนใหม่ (B05T 02 'strike'), remixed. Try 1 (icons + words floating in the box) — user: "ไม่ผ่าน โล่งเกินไป".
     Now each side is a CARD that fills its half of the box: big icon + big word + its line of words (data.texts; none → two grey lines).
     The wrong card comes in, at tN its word is struck through, the card dims, ✗ on its corner; a chevron turns to the right card, which comes in and
     lights on H (accent edge) with ✓. 'rows' = two cards one above the other, icon left (2, 3, 5, 6) · 'side' = wrong | right (1) · 'stack' = two cards,
     icon over its word (4, 7). Icons float inside the card (rule 3), or sit in a box / plate on some sizes for variety. ---------- */
  const R1 = { th: 'ขีดฆ่าแล้วเขียนใหม่ (จาก B05T 02)' };
  const floatDraw = () => null;
  function r1(d, c, k, st) { const Wb = SIZES[k].w, Hb = SIZES[k].h, m = 6, T_ = CT(), mode = st.mode, sh = st.shape, flo = sh === 'float', gap = st.gap ?? 40, pad = st.pad ?? 24, P = {}, CD = {};
    const hasW = !!(LBL(SD(d, 'w')) || LBL(SD(d, 'r'))); let ic, chevAt;
    if (mode === 'side') { const hw = (Wb - 2 * m - gap) / 2, h = Hb - 2 * m; ic = f1(Math.min(h - 2 * pad, hw * (hasW ? .4 : .7), st.cap ?? 220));
      ['w', 'r'].forEach((s, i) => { const x0 = -Wb / 2 + m + i * (hw + gap), ix = f1(hasW ? x0 + pad + ic / 2 : x0 + hw / 2), wx = f1(ix + ic / 2 + 20);
        CD[s] = [x0, -Hb / 2 + m, hw, h]; P[s] = { x: ix, y: 0, wx, wy: f1((st.wS ?? 48) * .36), wS: st.wS ?? 48, mw: f1(x0 + hw - pad + 6 - wx), an: 'start', wrap: 'mid' }; }); chevAt = [0, 0, 'right']; }
    else if (mode === 'rows') { const h = (Hb - 2 * m - gap) / 2, w = Wb - 2 * m; ic = f1(Math.min(h - 2 * pad, w * (hasW ? .4 : .7), st.cap ?? 380)); const wS = f1(Math.min(st.wS ?? 80, h * .3));
      ['w', 'r'].forEach((s, i) => { const y0 = -Hb / 2 + m + i * (h + gap), cy = y0 + h / 2, ix = f1(hasW ? -Wb / 2 + m + pad + ic / 2 : 0), wx = f1(ix + ic / 2 + 34);
        CD[s] = [-Wb / 2 + m, y0, w, h]; P[s] = { x: ix, y: f1(cy), wx, wy: f1(cy - wS * .12), wS, mw: f1(Wb / 2 - m - pad - wx), an: 'start', wrap: null, nx: wx, ny: f1(cy + wS * .62), nw: f1(Wb / 2 - m - pad - wx) }; });
      chevAt = [P.w.x, f1(-Hb / 2 + m + (Hb - 2 * m - gap) / 2 + gap / 2), 'down']; }
    else { const h = (Hb - 2 * m - gap) / 2, w = Wb - 2 * m, wS = st.wS ?? 46, wH = hasW ? wS * 2.2 : 0; ic = f1(Math.min(h - 2 * pad - wH, w - 2 * pad, st.cap ?? 300));
      ['w', 'r'].forEach((s, i) => { const y0 = -Hb / 2 + m + i * (h + gap), iy = f1(y0 + pad + ic / 2 + (h - 2 * pad - ic - wH) / 2);
        CD[s] = [-Wb / 2 + m, y0, w, h]; P[s] = { x: 0, y: iy, wx: 0, wy: f1(iy + ic / 2 + wS * 1.1), wS, mw: w - 2 * pad, an: 'middle', wrap: 'down' }; });
      chevAt = [0, f1(-Hb / 2 + m + (Hb - 2 * m - gap) / 2 + gap / 2), 'down']; }
    art(c, p => {
      ['w', 'r'].forEach(s => { const [x0, y0, w, h] = CD[s], Q = P[s], t = s === 'w' ? T_.tW : T_.tR, rr = Math.min(34, Math.min(w, h) * .14);
        /* the card: draws itself as the side comes in · wrong dims at tN · right gets the accent edge on H */
        const gC = s === 'w' ? mvG(p, { o: dimW(T_.tN, .4) }) : p; drawAt(R(gC, x0, y0, w, h, rr, { sw: 2.8, stroke: TL_(.55) }), p, f3(t - tu(.04)), tu(.34));
        if (s === 'r') R(litOn(p, T_.H), x0, y0, w, h, rr, { fill: TA(.06), sw: 4.4, stroke: ACC1 });
        const K = ent('left', Q.x, Q.y, ic, t);
        cbox(p, c, d, s, Q.x, Q.y, ic, flo ? { g: mvG(CL(p), K), mv: K, t, draw: floatDraw, bk: false, rip: false, iw: ic * .94, litStyle: {} } : { g: mvG(CL(p), K), mv: K, t, shape: sh, rip: false });
        cword(p, d, s, Q.wx, Q.wy, { anchor: Q.an, size: Q.wS, maxW: Q.mw, wrap: Q.wrap, strike: s === 'w' });
        if (Q.nx != null && LBL(SD(d, s))) cnote(p, d, s, Q.nx, Q.ny, Q.nw, { size: Math.max(40, Q.wS * .5) }); });
      const [cx, cy, dir] = chevAt, sc = st.chev ?? 1, D = dir === 'down' ? `M ${f1(cx - 30 * sc)} ${f1(cy - 12 * sc)} L ${cx} ${f1(cy + 12 * sc)} L ${f1(cx + 30 * sc)} ${f1(cy - 12 * sc)}` : `M ${f1(cx - 12 * sc)} ${f1(cy - 30 * sc)} L ${f1(cx + 12 * sc)} ${cy} L ${f1(cx - 12 * sc)} ${f1(cy + 30 * sc)}`;
      drawAt(p.path(D, { sw: 7, stroke: TL_(.6) }), p, f3(T_.tN + tu(.1)), tu(.2));
    });
    /* ✗ / ✓ on the top layer, on the card's top-right corner */
    const r = f1(Math.max(22, Math.min(44, ic * .17))), at = s => { const [x0, y0, w] = CD[s]; return [f1(x0 + w - r - 12), f1(y0 + r + 12)]; };
    over(c, q => marks5(q, at('w'), at('r'), r)); }
  R1[1] = (d, c) => r1(d, c, 1, { mode: 'side', shape: 'float', wS: 46, gap: 60, pad: 18 });
  R1[2] = (d, c) => r1(d, c, 2, { mode: 'rows', shape: 'box', wS: 70, gap: 40, pad: 20, chev: .8 });
  R1[3] = (d, c) => r1(d, c, 3, { mode: 'rows', shape: 'float', wS: 56, gap: 40, pad: 18, chev: .8 });
  R1[4] = (d, c) => r1(d, c, 4, { mode: 'stack', shape: 'float', wS: 46, gap: 44, pad: 20, chev: .8 });
  R1[5] = (d, c) => r1(d, c, 5, { mode: 'rows', shape: 'box', wS: 84, gap: 50, pad: 26, chev: 1.1 });
  R1[6] = (d, c) => r1(d, c, 6, { mode: 'rows', shape: 'float', wS: 92, gap: 56, pad: 28, chev: 1.2 });
  R1[7] = (d, c) => r1(d, c, 7, { mode: 'stack', shape: 'circ', wS: 42, gap: 40, pad: 16, chev: .75 });
  const ROUNDS = [null, R1];

  /* ================= PER SIZE (user 2026-11-24: "เริ่มตั้งแต่หมวดที่ 5 เป็นต้นไปผมจะให้คุณออกแบบทีละขนาดเริ่มจากขนาดที่ 1 ก่อน 10 อัน … ทั้ง 7 ขนาด
     ก็จะไม่ซ้ำกันด้วย · โดยใช้วิธีการวาดที่เขียนไว้ในสกิลและ reference เดิม"). Round 1 above (one design remixed for 7 sizes) was not passed.
     Now: each size gets its OWN 10 designs, made for that shape. GL.cats.B05S.drawS(size, i, data, c). Box centred at (0,0).
     Shared: wrong comes in (tW) → turned down at tN (struck / crossed / dims, ✗) → right comes in (tR) and lights on H (✓). Calm B05 motion.
     ✓ / ✗ on the top layer (over). Icons float (rule 3) and are big; words big. ================= */
  const SZD = {}; const SV = k => (SZD[k] = SZD[k] || []);
  const sd = (k, id, th, fn) => SV(k).push({ id, th, fn });
  /* a floating icon for side s (no box); wrong dims at tN (or o.dimAt), right pops at tR and punches on H */
  /* o.cx = the middle of the side's room: a side with no separate word (no label, or no icon → its label takes the icon's place) moves there;
     a word in place of the icon is set big (1.5 × the icon width) */
  /* (user 2026-11-24: "ถ้าในกรณีที่คำยาวมากแล้วมีพื้นที่เหลือเยอะก็ขยายไอคอนให้ใหญ่ขึ้นด้วยก็ได้") an icon without its word, moved into the word's room
     (o.cx), grows up to 1.35 × — never wider than the room (o.room) nor taller than o.hmax (default .83 of the box height) */
  const ICON = (p, c, d, s, x, y, w, o = {}) => { const X = SD(d, s), noW = !LBL(X), noI = !(X && picOf(X)), xx = noW && o.cx != null ? o.cx : x, yy = noW && o.cy != null ? o.cy : y;   /* o.cy: icon over its word → moves to the middle */
    if (noW && !noI && (o.cx != null || o.cy != null)) w = f1(Math.min(w * 1.35, (o.room || w) * .9, o.hmax ?? BOX[1] * .83));
    if (o.mv && (xx !== x || yy !== y)) o = Object.assign({}, o, { mv: Object.assign({}, o.mv, { px: xx, py: yy }) });
    return cbox(p, c, d, s, xx, yy, w, Object.assign({ draw: floatDraw, bk: false, rip: false, iw: noI ? Math.min(w * 1.5, (o.room || w * 2)) : w * .94, lw: noI ? (o.room || w * 2) : undefined, litStyle: {} }, o)); };
  /* (user 2026-11-24: "ไม่เอา X อันใหญ่ ไม่เอาขีดฆ่าตัวหนังสือ แต่ให้มืดลงแทน เหมือนที่ icon เป็น") → the wrong word only dims, to the same level as its icon */
  const WORD = (p, d, s, x, y, o = {}) => cword(p, d, s, x, y, Object.assign({ wrap: 'mid' }, o, { strike: false }));
  const outlineIn = (p, el, t) => drawAt(el, p, f3(t - tu(.04)), tu(.34));
  const OUT = (a = .55) => ({ sw: 2.8, stroke: TL_(a) });
  const LITC = () => ({ fill: TA(.06), sw: 4.4, stroke: ACC1 });
  const MK = (c, atW, atR, r = 28) => over(c, q => marks5(q, atW, atR, r));
  const turn = (p, x, y, dir = 'right', k = 1) => { const T_ = CT(), D = dir === 'down' ? `M ${f1(x - 30 * k)} ${f1(y - 12 * k)} L ${x} ${f1(y + 12 * k)} L ${f1(x + 30 * k)} ${f1(y - 12 * k)}` : `M ${f1(x - 12 * k)} ${f1(y - 28 * k)} L ${f1(x + 12 * k)} ${y} L ${f1(x - 12 * k)} ${f1(y + 28 * k)}`;
    drawAt(p.path(D, { sw: 7, stroke: TL_(.6) }), p, f3(T_.tN + tu(.1)), tu(.2)); };
  const poly = (q, pts, o) => q.path(pathOf(pts), o);

  /* ---------- SIZE 1 · 860 × 230 (แถบแบนยาว) ---------- */
  /* 01 two cards side by side: the wrong card dims; a chevron; the right card lights */
  sd(1, 'cards', 'การ์ดคู่', (d, c) => { const T_ = CT();
    art(c, p => { const gW = mvG(p, { o: dimW(T_.tN, .4) }); outlineIn(p, R(gW, -425, -105, 390, 210, 36, OUT()), T_.tW); outlineIn(p, R(p, 35, -105, 390, 210, 36, OUT()), T_.tR); R(litOn(p, T_.H), 35, -105, 390, 210, 36, LITC());
      ICON(p, c, d, 'w', -340, 0, 150, { cx: -230, room: 360 }); WORD(p, d, 'w', -255, 18, { anchor: 'start', size: 54, maxW: 205 });
      ICON(p, c, d, 'r', 120, 0, 150, { cx: 230, room: 360 }); WORD(p, d, 'r', 205, 18, { anchor: 'start', size: 58, maxW: 205 }); turn(p, 0, 0); });
    MK(c, [-65, -75], [395, -75]); });
  /* 02 a ticker: the wrong fills the track, is struck and shrinks into a chip on the left; the right slides in and fills the rest */
  sd(1, 'ticker', 'แถบเลื่อนแทนที่', (d, c) => { const T_ = CT(), t1 = f3(T_.tN + tu(.36));
    art(c, p => { outlineIn(p, R(p, -425, -105, 850, 210, 105, OUT()), T_.tW); R(litOn(p, T_.H), -425, -105, 850, 210, 105, LITC());
      drawAt(p.circle(-335, 0, 78, { sw: 2.6, stroke: TL_(.45) }), p, T_.tN, tu(.3));
      const K = { px: -335, py: 0, x: [[0, 255], [T_.tN, 255], [t1, 0, 'io']], s: [[0, 1.55], [T_.tN, 1.55], [t1, 1, 'io']] }; ICON(p, c, d, 'w', -335, 0, 110, { g: mvG(p, K), mv: K });
      const gWd = mvG(p, { o: [[0, 1], [f3(T_.tN + tu(.24)), 1], [f3(T_.tN + tu(.36)), 0]] }); WORD(p, d, 'w', 20, 20, { anchor: 'start', size: 64, maxW: 380, g: gWd });
      const KR = { px: -150, py: 0, x: [[0, 520], [T_.tR, 520], [f3(T_.tR + tu(.36)), 0, 'out']], o: fadeIn(T_.tR, .05) }; ICON(p, c, d, 'r', -150, 0, 170, { g: mvG(p, KR), mv: KR, t: T_.tR, cx: 135, room: 520 });
      const gR = mvG(p, { x: [[0, 520], [T_.tR, 520], [f3(T_.tR + tu(.36)), 0, 'out']] }); WORD(p, d, 'r', -40, 22, { anchor: 'start', size: 68, maxW: 440, g: gR }); });
    MK(c, [-280, -58], [380, -70]); });
  /* 03 a toggle: icons at both ends of a long track; the accent ring sits on the wrong, then slides along to the right on H */
  sd(1, 'toggle', 'สวิตช์เลื่อน', (d, c) => { const T_ = CT();
    art(c, p => { outlineIn(p, R(p, -425, -105, 850, 210, 105, OUT(.5)), T_.tW);
      const g = mvG(p, { x: [[0, -650], [T_.tN, -650], [T_.H, 0, 'io']], o: fadeIn(f3(T_.tW + tu(.2)), .06) }); g.circle(325, 0, 94, { fill: TA(.1), sw: 5, stroke: ACC1 });
      ICON(p, c, d, 'w', -325, 0, 150); WORD(p, d, 'w', -225, 18, { anchor: 'start', size: 52, maxW: 190 });
      ICON(p, c, d, 'r', 325, 0, 150); WORD(p, d, 'r', 225, 18, { anchor: 'end', size: 56, maxW: 190 }); });
    MK(c, [-255, -72], [395, -72]); });
  /* 04 push aside: the wrong card fills the strip; the right card slides in from the right and pushes it to the left, where it is squeezed
     narrow and dims (user: "ไม่เอา X อันใหญ่") */
  sd(1, 'push', 'ดันออกข้าง', (d, c) => { const T_ = CT(), tp = f3(T_.tR + tu(.4)), nw = 250;
    art(c, p => { /* the wide card gives way (fades) as the narrow dim card takes its place on the left — no stretched strokes */
      const gBig = mvG(p, { o: [[0, 1], [T_.tR, 1], [f3(T_.tR + tu(.2)), 0]] }); outlineIn(p, R(gBig, -425, -105, 850, 210, 36, OUT()), T_.tW);
      const gW = mvG(p, { o: [[0, 0], [f3(T_.tR + tu(.1)), 0], [tp, .4]] }); R(gW, -425, -105, nw, 210, 36, OUT());
      const KI = { px: -300, py: 0, x: [[0, 300], [T_.tR, 300], [tp, 0, 'io']] }; ICON(p, c, d, 'w', -300, 0, 150, { g: mvG(p, KI), mv: KI, dimAt: T_.tR, room: 220 });
      const gWd = mvG(p, { o: [[0, 1], [T_.tR, 1], [f3(T_.tR + tu(.16)), 0]] }); WORD(p, d, 'w', 20, 22, { anchor: 'start', size: 66, maxW: 380, g: gWd });
      const KR = { px: 140, py: 0, x: [[0, 640], [T_.tR, 640], [tp, 0, 'io']], o: fadeIn(T_.tR, .05) }, gR = mvG(p, KR);
      R(gR, -150, -105, 575, 210, 36, OUT()); R(litOn(p, T_.H), -150, -105, 575, 210, 36, LITC());
      ICON(p, c, d, 'r', -60, 0, 160, { g: mvG(p, KR), mv: KR, t: T_.tR, cx: 137, room: 520 }); WORD(p, d, 'r', 35, 22, { anchor: 'start', size: 66, maxW: 370, g: mvG(p, { x: KR.x }) }); });
    MK(c, [-205, -75], [395, -75]); });
  /* 05 a segmented control: the highlight sits on the wrong segment, then glides to the right one */
  sd(1, 'segment', 'แถบเลือกสองช่อง', (d, c) => { const T_ = CT();
    art(c, p => { outlineIn(p, R(p, -425, -105, 850, 210, 40, OUT(.5)), T_.tW); drawAt(p.line(0, -80, 0, 80, { sw: 2.4, stroke: TL_(.4) }), p, T_.tW, tu(.3));
      const g = mvG(p, { x: [[0, -420], [T_.tN, -420], [T_.H, 0, 'io']], o: fadeIn(f3(T_.tW + tu(.2)), .06) }); R(g, 10, -95, 405, 190, 32, { fill: TA(.1), sw: 4, stroke: ACC1 });
      ICON(p, c, d, 'w', -330, 0, 150, { cx: -215, room: 370 }); WORD(p, d, 'w', -240, 18, { anchor: 'start', size: 52, maxW: 220 });
      ICON(p, c, d, 'r', 95, 0, 150, { cx: 212, room: 370 }); WORD(p, d, 'r', 185, 18, { anchor: 'start', size: 56, maxW: 220 }); });
    MK(c, [-40, -70], [385, -70]); });
  /* 06 two arrow bands, the right one plugs into the wrong one's point */
  sd(1, 'bands', 'แถบลูกศรต่อกัน', (d, c) => { const T_ = CT(), A = [[-425, -105], [-70, -105], [-15, 0], [-70, 105], [-425, 105]], B = [[0, -105], [370, -105], [425, 0], [370, 105], [0, 105], [55, 0]];
    art(c, p => { const gW = mvG(p, { o: dimW(T_.tN, .4) }); outlineIn(p, poly(gW, A, OUT()), T_.tW); outlineIn(p, poly(p, B, OUT()), T_.tR); poly(litOn(p, T_.H), B, LITC());
      ICON(p, c, d, 'w', -340, 0, 150, { cx: -225, room: 330 }); WORD(p, d, 'w', -255, 18, { anchor: 'start', size: 52, maxW: 190 });
      ICON(p, c, d, 'r', 140, 0, 150, { cx: 215, room: 300 }); WORD(p, d, 'r', 225, 18, { anchor: 'start', size: 54, maxW: 150 }); });
    MK(c, [-100, -75], [345, -75]); });
  /* 07 a slanted cut: the strip splits on a diagonal; the wrong side dims, the right side lights */
  sd(1, 'slant', 'แบ่งทแยง', (d, c) => { const T_ = CT(), A = [[-425, -105], [45, -105], [-45, 105], [-425, 105]], B = [[75, -105], [425, -105], [425, 105], [-15, 105]];
    art(c, p => { const gW = mvG(p, { o: dimW(T_.tN, .4) }); outlineIn(p, poly(gW, A, OUT()), T_.tW); outlineIn(p, poly(p, B, OUT()), T_.tR); poly(litOn(p, T_.H), B, LITC());
      ICON(p, c, d, 'w', -335, 0, 150, { cx: -205, room: 330 }); WORD(p, d, 'w', -250, 18, { anchor: 'start', size: 52, maxW: 215 });
      ICON(p, c, d, 'r', 150, 0, 150, { cx: 235, room: 300 }); WORD(p, d, 'r', 235, 18, { anchor: 'start', size: 54, maxW: 175 }); });
    MK(c, [0, -75], [395, -75]); });
  /* 08 a flip: the big card shows the wrong, flips over to the right; the wrong drops into the slot on the left, small and dim */
  sd(1, 'flip', 'พลิกการ์ด', (d, c) => { const T_ = CT(), tf = f3(T_.tN + tu(.16)), out = [[0, 0], [T_.tW, 0], [f3(T_.tW + tu(.1)), 1], [T_.tN, 1], [tf, 0]];
    art(c, p => { drawAt(R(p, -425, -75, 150, 150, 32, DASH(.4)), p, T_.tW, tu(.3));
      const gC = mvG(p, { px: 80, py: 0, sx: [[0, 1], [T_.tN, 1], [tf, 0, 'in'], [T_.tR, 1, 'out']] }); outlineIn(p, R(gC, -255, -105, 680, 210, 36, OUT()), T_.tW); R(litOn(p, T_.H), -255, -105, 680, 210, 36, LITC());
      const gWm = mvG(p, { o: out }); ICON(p, c, d, 'w', -170, 0, 160, { g: gWm, io: out, dimAt: 99, cx: 85, room: 620 }); WORD(p, d, 'w', -75, 20, { anchor: 'start', size: 66, maxW: 470, g: gWm, strike: false });
      ICON(p, c, d, 'w', -350, 0, 110, { t: tf, dimAt: tf });
      ICON(p, c, d, 'r', -170, 0, 160, { cx: 85, room: 620 }); WORD(p, d, 'r', -75, 22, { anchor: 'start', size: 68, maxW: 470 }); });
    MK(c, [-295, -55], [395, -75]); });
  /* 09 a slider: wrong at the left end, right at the right end; the token runs along the track and the track lights behind it */
  sd(1, 'slider', 'สไลเดอร์', (d, c) => { const T_ = CT(), y = 72, x0 = -260, x1 = 260;
    art(c, p => { drawAt(p.line(x0, y, x1, y, { sw: 5, stroke: TL_(.4) }), p, T_.tW, tu(.4));
      for (let i = 0; i <= 8; i++) { const x = f1(lerp(x0, x1, i / 8)); drawAt(p.line(x, y + 16, x, y + 28, { sw: 2.4, stroke: TL_(.4) }), p, f3(T_.tW + tu(.02 * i)), tu(.12)); }
      on(p.line(x0, y, x1, y, { sw: 7, stroke: ACC1 }), p, 0, { draw: [[0, 0], [T_.tN, 0], [T_.H, 1, 'io']] });
      const g = mvG(p, { x: [[0, x0 - x1], [T_.tN, x0 - x1], [T_.H, 0, 'io']], o: fadeIn(T_.tN, .04) }); g.circle(x1, y, 22, { fill: ACC1, sw: 0, stroke: 'none' }); g.circle(x1, y, 32, { sw: 2.6, stroke: ACC1 });
      ICON(p, c, d, 'w', -350, -10, 150, { room: 150 }); WORD(p, d, 'w', -255, -12, { anchor: 'start', size: 50, maxW: 200 });
      ICON(p, c, d, 'r', 350, -10, 150, { room: 150 }); WORD(p, d, 'r', 255, -12, { anchor: 'end', size: 54, maxW: 200 }); });
    MK(c, [-282, -78], [418 - 28, -78]); });
  /* 10 a curved arrow: from the wrong at one end over the top to the right at the other end */
  sd(1, 'curve', 'ลูกศรโค้งแทนที่', (d, c) => { const T_ = CT(), D = 'M -250 -30 Q 0 -150 250 -30';
    art(c, p => { on(p.path(D, { sw: 5, stroke: TL_(.55) }), p, 0, { draw: [[0, 0], [f3(T_.tN + tu(.06)), 0], [T_.tR, 1, 'io']] });
      const ah = atG(p, T_.tR); ah.path('M 222 -66 L 252 -28 L 204 -22', { sw: 5, stroke: TL_(.55) });
      ICON(p, c, d, 'w', -345, 10, 165); WORD(p, d, 'w', -245, 62, { anchor: 'start', size: 48, maxW: 215 });
      ICON(p, c, d, 'r', 345, 10, 165); WORD(p, d, 'r', 245, 62, { anchor: 'end', size: 52, maxW: 215 }); });
    MK(c, [-278, -60], [400, -60]); });
  const I = (icon, label) => label ? { icon, label } : { icon };
  const SAMPLES = [
    { say: 'ไม่ใช่ยาที่ช่วย แต่คือการนอน', wrong: I('pill', 'ยา'), right: I('bed', 'การนอน') },
    { say: 'ปัญหาไม่ใช่เงิน แต่คือเวลา', wrong: I('banknote', 'เงิน'), right: I('clock', 'เวลา') },
    { say: 'ลูกไม่ได้อยากได้ของเล่น แต่อยากได้เวลาของพ่อแม่', wrong: I('gift', 'ของเล่น'), right: I('users', 'เวลาของพ่อแม่') },
    { say: 'ไม่ใช่ถูกที่สุด แต่คุ้มที่สุด', wrong: I('tag', 'ถูกที่สุด'), right: I('gem', 'คุ้มที่สุด'), texts: ['ใช้ไม่นานก็พัง', 'ใช้ได้นาน คุ้มทุกบาท'] },
    { say: 'อย่ารดน้ำทุกวัน แค่สัปดาห์ละครั้ง', wrong: I('droplets', 'ทุกวัน'), right: I('calendar', 'สัปดาห์ละครั้ง') },
    { say: 'ไม่ใช่ขับให้เร็ว แต่ขับให้ปลอดภัย', wrong: I('car', 'ขับให้เร็ว'), right: I('shield-check', 'ปลอดภัย') },
    { say: 'ความสุขไม่ใช่เงินเดือน แต่คือคนรอบตัว', wrong: I('wallet', 'เงินเดือน'), right: I('users', 'คนรอบตัว') },
    { say: 'ไม่ต้องใช้แรง ใช้เครื่องมือให้ถูก', wrong: I('dumbbell', 'ใช้แรง'), right: I('wrench', 'เครื่องมือ') },
    { say: 'ไม่ใช่พูดเสียงดัง แต่ฟังให้จบ', wrong: I('megaphone', 'พูดเสียงดัง'), right: I('headphones', 'ฟังให้จบ') },
    { say: 'ไม่ต้องหักโหม แค่ทำสม่ำเสมอ', wrong: I('zap', 'หักโหม'), right: I('repeat', 'สม่ำเสมอ') },
    { say: 'ไม่ใช่โทรไปตาม แต่ส่งเมลสรุป', wrong: I('phone', 'โทรไปตาม'), right: I('mail', 'ส่งเมลสรุป'), texts: ['ลืมง่าย ไม่มีหลักฐาน', 'อ่านซ้ำได้ ชัดทุกข้อ'] },
    { say: 'เด็กไม่ได้ต้องการจอ แต่ต้องการหนังสือ', wrong: I('tv', 'จอ'), right: I('book-open', 'หนังสือ') },
    { say: 'ไม่ใช่กาแฟที่ปลุก แต่คือแสงแดด', wrong: I('coffee', 'กาแฟ'), right: I('sun', 'แสงแดด') },
    { say: 'อย่ากินขนมตอนดึก กินผลไม้แทน', wrong: I('cookie', 'ขนม'), right: I('apple', 'ผลไม้') },
    { say: 'ไม่ใช่ดวง แต่คือการซ้อม', wrong: I('dice-5', 'ดวง'), right: I('target', 'การซ้อม') },
    { say: 'ไม่ต้องนั่งรถ เดินไปก็ถึง', wrong: I('car', 'นั่งรถ'), right: I('person-standing', 'เดินไป') },
    { say: 'ต้นไม้ไม่ได้ขาดน้ำ แต่ขาดแดด', wrong: I('droplets', 'ขาดน้ำ'), right: I('sun', 'ขาดแดด') },
    { say: 'ไม่ใช่ซื้อใหม่ แต่ซ่อมของเดิม', wrong: I('package', 'ซื้อใหม่'), right: I('hammer', 'ซ่อมของเดิม') },
    { say: 'ไม่ใช่ความฉลาด แต่คือความอดทน', wrong: I('brain', 'ความฉลาด'), right: I('hourglass', 'ความอดทน'), texts: ['เก่งแค่ไหนก็ถอดใจได้', 'ทำต่อจนกว่าจะสำเร็จ'] },
    { say: 'กุญแจไม่ใช่สอนเยอะ แต่ถามให้ถูก', wrong: I('book', 'สอนเยอะ'), right: I('circle-help', 'ถามให้ถูก') },
  ];
  const STRESS = [
    { say: 'ไม่มีป้ายเลย', wrong: I('cigarette-off'), right: I('salad') },
    { say: 'ป้ายยาวมาก (เกิน 16 ตัว → ไม่แสดงคำ)', wrong: I('trending-down', 'ลดราคาสินค้าทั้งร้านทุกชิ้น'), right: I('message-circle-heart', 'ตอบแชตลูกค้าให้ไวภายในห้านาที') },
    { say: 'ป้ายยาว 12 ตัว', wrong: I('trending-down', 'ลดราคาทั้งร้าน'), right: I('message-circle-heart', 'ตอบแชตลูกค้าไว') },
    { say: 'ภาษาอังกฤษ', wrong: I('zap', 'Faster'), right: I('target', 'Smarter') },
    { say: 'ไม่มีไอคอน (ป้ายแทนภาพ)', wrong: { label: 'ราคา' }, right: { label: 'คุณค่า' } },
    { say: 'ไอคอนเดียวกัน ต่างแค่ป้าย', wrong: I('clock', 'ตอนเช้า'), right: I('clock', 'ตอนเย็น') },
    { say: 'ตัวเลขเป็นป้าย', wrong: I('timer', '5 นาที'), right: I('timer', '30 นาที') },
    { say: 'ฝั่งถูกไม่มีป้าย', wrong: I('cookie', 'ของหวาน'), right: I('apple') },
    { say: 'ฝั่งผิดไม่มีป้าย', wrong: I('tv'), right: I('book-open', 'อ่านหนังสือ') },
    { say: 'ชื่อไอคอนที่ไม่มี', wrong: I('no-such-icon', 'ทางลัด'), right: I('map', 'ทางจริง') },
    { say: 'ของคนละชนิดกันสุด ๆ', wrong: I('pill', 'ยา'), right: I('bed', 'การนอน') },
    { say: 'ป้ายยาว + อังกฤษปน', wrong: I('megaphone', 'ยิงแอด Ads'), right: I('users', 'ปากต่อปาก') },
    { say: 'ภาษาอังกฤษยาว', wrong: I('wallet', 'More money'), right: I('heart', 'More time') },
    { say: 'คน ↔ ของ', wrong: I('user', 'คนเดียว'), right: I('users', 'ทั้งทีม') },
    { say: 'ไม่มีไอคอนฝั่งเดียว', wrong: { label: 'พรสวรรค์' }, right: I('repeat', 'การฝึก') },
    { say: 'ป้ายสั้นมาก', wrong: I('moon', 'ดึก'), right: I('sun', 'เช้า') },
    { say: 'ไอคอนเส้นเยอะ', wrong: I('truck', 'ส่งเอง'), right: I('store', 'มารับที่ร้าน') },
    { say: 'อังกฤษ + ตัวเลข', wrong: I('calendar', '7 days'), right: I('timer', '1 day') },
    { say: 'ป้ายยาว 12 ตัวทั้งคู่', wrong: I('cloud', 'ฝนตกทั้งวันเลย'), right: I('umbrella', 'พกร่มติดตัวไว้') },
    { say: 'คำเดียวทั้งคู่ (อังกฤษ)', wrong: I('lock', 'Hide'), right: I('eye', 'Show') },
    { say: 'ไม่มีป้ายทั้งคู่ (ไอคอนแรง)', wrong: I('trash-2'), right: I('recycle') },
  ];
  /* ---------- SIZE 2 · 860 × 470 (กว้าง) ---------- */
  /* 01 two tall cards: icon over its word; the wrong card dims, the right card lights */
  sd(2, 'cards', 'การ์ดคู่แนวตั้ง', (d, c) => { const T_ = CT();
    art(c, p => { const gW = mvG(p, { o: dimW(T_.tN, .4) }); outlineIn(p, R(gW, -425, -230, 390, 460, 40, OUT()), T_.tW); outlineIn(p, R(p, 35, -230, 390, 460, 40, OUT()), T_.tR); R(litOn(p, T_.H), 35, -230, 390, 460, 40, LITC());
      ICON(p, c, d, 'w', -230, -45, 220, { room: 340, cy: 0, hmax: 380 }); WORD(p, d, 'w', -230, 150, { size: 62, maxW: 340 });
      ICON(p, c, d, 'r', 230, -45, 220, { room: 340, cy: 0, hmax: 380 }); WORD(p, d, 'r', 230, 150, { size: 66, maxW: 340 }); turn(p, 0, 0, 'right', 1.2); });
    MK(c, [-71, -194], [389, -194], 32); });
  /* 02 two full-width rows: the wrong row on top dims, a chevron turns down, the right row below lights */
  sd(2, 'rows', 'สองแถวบนล่าง', (d, c) => { const T_ = CT();
    art(c, p => { const gW = mvG(p, { o: dimW(T_.tN, .4) }); outlineIn(p, R(gW, -425, -230, 850, 205, 36, OUT()), T_.tW); outlineIn(p, R(p, -425, 25, 850, 205, 36, OUT()), T_.tR); R(litOn(p, T_.H), -425, 25, 850, 205, 36, LITC());
      ICON(p, c, d, 'w', -320, -128, 170, { cx: 0, room: 700, hmax: 190 }); WORD(p, d, 'w', -200, -102, { anchor: 'start', size: 72, maxW: 590 });
      ICON(p, c, d, 'r', -320, 128, 170, { cx: 0, room: 700, hmax: 190 }); WORD(p, d, 'r', -200, 154, { anchor: 'start', size: 76, maxW: 590 }); turn(p, -320, 0, 'down', .7); });
    MK(c, [391, -196], [391, 59], 30); });
  /* 03 flip: the big card shows the wrong, flips over to the right; the wrong drops into the slot on the left, small and dim */
  sd(2, 'flip', 'พลิกการ์ดใหญ่', (d, c) => { const T_ = CT(), tf = f3(T_.tN + tu(.16)), out = [[0, 0], [T_.tW, 0], [f3(T_.tW + tu(.1)), 1], [T_.tN, 1], [tf, 0]];
    art(c, p => { drawAt(R(p, -425, -110, 220, 220, 40, DASH(.4)), p, T_.tW, tu(.3));
      const gC = mvG(p, { px: 120, py: 0, sx: [[0, 1], [T_.tN, 1], [tf, 0, 'in'], [T_.tR, 1, 'out']] }); outlineIn(p, R(gC, -175, -230, 600, 460, 40, OUT()), T_.tW); R(litOn(p, T_.H), -175, -230, 600, 460, 40, LITC());
      const gWm = mvG(p, { o: out }); ICON(p, c, d, 'w', 125, -55, 230, { g: gWm, io: out, dimAt: 99, room: 520, cy: 0, hmax: 380 }); WORD(p, d, 'w', 125, 150, { size: 70, maxW: 540, g: gWm });
      ICON(p, c, d, 'w', -315, 0, 160, { t: tf, dimAt: tf, room: 200 });
      ICON(p, c, d, 'r', 125, -55, 230, { room: 520, cy: 0, hmax: 380 }); WORD(p, d, 'r', 125, 152, { size: 74, maxW: 540 }); });
    MK(c, [-239, -76], [389, -194], 32); });
  /* 04 a half dial: wrong at the left end, right at the right end; the needle swings from the wrong over to the right on H */
  sd(2, 'dial', 'หน้าปัดเข็มชี้', (d, c) => { const T_ = CT(), cx = 0, cy = 175, r = 330, P = a => [f1(cx + r * Math.cos(rad(a))), f1(cy + r * Math.sin(rad(a)))];
    art(c, p => { const [ax, ay] = P(180), [bx, by] = P(0); drawAt(p.path(`M ${ax} ${ay} A ${r} ${r} 0 0 1 ${bx} ${by}`, { sw: 5, stroke: TL_(.45) }), p, T_.tW, tu(.45));
      for (let k = 0; k <= 12; k++) { const a = 180 + k * 15; tick(atG(p, f3(T_.tW + tu(.02 * k))), cx, cy, a, r - 28, r - 8, { sw: 2.4, stroke: TL_(.45) }); }
      const [mx, my] = P(270), [ex, ey] = P(360); on(p.path(`M ${mx} ${my} A ${r} ${r} 0 0 1 ${ex} ${ey}`, { sw: 9, stroke: ACC1 }), p, 0, { draw: [[0, 0], [f3(T_.H - tu(.3)), 0], [T_.H, 1, 'io']] });
      const nd = mvG(p, { px: cx, py: cy, r: [[0, -110], [T_.tN, -110], [T_.H, 0, 'io']], o: fadeIn(T_.tW, .06) }); nd.line(cx, cy, f1(cx + 175 * Math.cos(rad(-35))), f1(cy + 175 * Math.sin(rad(-35))), { sw: 7, stroke: C.ink }); popAt(p, cx, cy, T_.tW).circle(cx, cy, 24, { fill: C.ink, sw: 0, stroke: 'none' });
      ICON(p, c, d, 'w', -185, 20, 150, { room: 190 }); WORD(p, d, 'w', -285, 222, { size: 48, maxW: 270 });   /* icons inside the dial (the needle points at them), words under the dial's ends */
      ICON(p, c, d, 'r', 185, 20, 150, { room: 190 }); WORD(p, d, 'r', 285, 222, { size: 52, maxW: 270 }); });
    MK(c, [-118, -45], [252, -45], 28); });
  /* 05 tabs: the wrong tab is open, then the right tab is clicked — the panel switches to the right one (big icon + its line of words) */
  sd(2, 'tabs', 'แท็บสลับ', (d, c) => { const T_ = CT(), tw0 = 380, ty0 = -230, th = 84, sw0 = f3(T_.tN + tu(.2));
    art(c, p => { outlineIn(p, R(p, -425, -150, 850, 380, 36, OUT(.5)), T_.tW);
      const gT = mvG(p, { o: dimW(T_.tN, .4) }); outlineIn(p, R(gT, -425, ty0, tw0, th, 26, OUT()), T_.tW); outlineIn(p, R(p, -425 + tw0 + 20, ty0, tw0, th, 26, OUT()), T_.tR); R(litOn(p, T_.H), -425 + tw0 + 20, ty0, tw0, th, 26, LITC());
      WORD(p, d, 'w', -425 + tw0 / 2, ty0 + th / 2 + 18, { size: 48, maxW: tw0 - 40 }); WORD(p, d, 'r', -425 + tw0 * 1.5 + 20, ty0 + th / 2 + 18, { size: 50, maxW: tw0 - 40 });
      const ow = [[0, 0], [T_.tW, 0], [f3(T_.tW + tu(.1)), 1], [T_.tN, 1], [sw0, 0]], gWm = mvG(p, { o: ow });
      ICON(p, c, d, 'w', -225, 40, 250, { g: gWm, io: ow, dimAt: 99, room: 400 }); cnote(p, d, 'w', 0, 30, 380, { g: gWm, size: 44, t: f3(T_.tW + tu(.2)), one: false });
      ICON(p, c, d, 'r', -225, 40, 250, { room: 400 }); cnote(p, d, 'r', 0, 30, 380, { size: 44 }); });
    MK(c, [-75, -230 + 30], [355, -230 + 30], 26); });
  /* 06 up and down: the wrong card sinks low and dims, the right card rises high and lights */
  sd(2, 'updown', 'ขึ้น-ลง', (d, c) => { const T_ = CT(), h = 360, dy = 55;
    art(c, p => { const KW = { y: [[0, 0], [T_.tN, 0], [f3(T_.tN + tu(.4)), dy, 'io']] }, gW0 = mvG(p, KW), gW = mvG(gW0, { o: dimW(T_.tN, .4) });
      outlineIn(p, R(gW, -425, -h / 2 - dy, 395, h, 40, OUT()), T_.tW);
      const KR = { y: [[0, 2 * dy], [T_.tR, 2 * dy], [T_.H, 0, 'io']], o: fadeIn(T_.tR, .05) }, gR = mvG(p, KR); R(gR, 30, -h / 2 - dy, 395, h, 40, OUT()); R(litOn(gR, T_.H), 30, -h / 2 - dy, 395, h, 40, LITC());
      const KWi = { px: -228, py: -95, y: KW.y }; ICON(p, c, d, 'w', -228, -95, 190, { g: mvG(p, KWi), mv: KWi, room: 330, cy: -55, hmax: 300 }); WORD(p, d, 'w', -228, 95, { size: 58, maxW: 340, g: mvG(p, KW) });
      const KRi = { px: 228, py: -95, y: KR.y, o: KR.o }; ICON(p, c, d, 'r', 228, -95, 190, { g: mvG(p, KRi), mv: KRi, t: T_.tR, room: 330, cy: -55, hmax: 300 }); WORD(p, d, 'r', 228, 95, { size: 62, maxW: 340, g: mvG(p, { y: KR.y }) });
      drawAt(p.path('M -20 150 L 20 -150', { sw: 4, stroke: TL_(.5) }), p, f3(T_.tN + tu(.1)), tu(.3)); drawAt(p.path('M 2 -122 L 22 -152 L 34 -116', { sw: 4, stroke: TL_(.5) }), p, f3(T_.tN + tu(.35)), tu(.12)); });
    MK(c, [-65, -235 + dy + 2 * 0 + 36 + dy - dy], [389, -199], 30); });
  /* 07 a diagonal cut: the box splits on a slant — wrong upper-left dims, right lower-right lights */
  sd(2, 'slant', 'แบ่งทแยงใหญ่', (d, c) => { const T_ = CT(), A = [[-425, -230], [120, -230], [-120, 230], [-425, 230]], B = [[150, -230], [425, -230], [425, 230], [-90, 230]];
    art(c, p => { const gW = mvG(p, { o: dimW(T_.tN, .4) }); outlineIn(p, poly(gW, A, OUT()), T_.tW); outlineIn(p, poly(p, B, OUT()), T_.tR); poly(litOn(p, T_.H), B, LITC());
      ICON(p, c, d, 'w', -275, -60, 210, { room: 300, cy: 0, hmax: 330 }); WORD(p, d, 'w', -275, 130, { size: 58, maxW: 270 });
      ICON(p, c, d, 'r', 255, -30, 210, { room: 300, cy: 20, hmax: 330 }); WORD(p, d, 'r', 200, 160, { size: 62, maxW: 300 }); });
    MK(c, [60, -194], [389, -194], 32); });
  /* 08 radio options: two option rows with radio circles; the selection dot leaves the wrong one and lands in the right one on H */
  sd(2, 'radio', 'ตัวเลือกวงกลม', (d, c) => { const T_ = CT(), Y = [-115, 115], rx = -355;
    art(c, p => { const gW = mvG(p, { o: dimW(T_.tN, .4) }); outlineIn(p, R(gW, -425, -220, 850, 210, 105, OUT()), T_.tW); outlineIn(p, R(p, -425, 10, 850, 210, 105, OUT()), T_.tR); R(litOn(p, T_.H), -425, 10, 850, 210, 105, LITC());
      drawAt(gW.circle(rx, Y[0], 42, { sw: 4, stroke: C.ink }), p, T_.tW, tu(.3)); drawAt(p.circle(rx, Y[1], 42, { sw: 4, stroke: C.ink }), p, T_.tR, tu(.3));
      const K = pathK([[rx, Y[0]], [rx - 46, 0], [rx, Y[1]]], T_.tN, T_.H, [rx, Y[1]], 24), g = mvG(p, { px: rx, py: Y[1], x: K.x, y: K.y, o: fadeIn(f3(T_.tW + tu(.2)), .05) }); g.circle(rx, Y[1], 24, { fill: ACC1, sw: 0, stroke: 'none' });
      ICON(p, c, d, 'w', -200, Y[0], 170, { cx: 40, room: 600, hmax: 195 }); WORD(p, d, 'w', -90, Y[0] + 24, { anchor: 'start', size: 68, maxW: 480 });
      ICON(p, c, d, 'r', -200, Y[1], 170, { cx: 40, room: 600, hmax: 195 }); WORD(p, d, 'r', -90, Y[1] + 24, { anchor: 'start', size: 72, maxW: 480 }); });
    MK(c, [370, -175], [370, 55], 30); });
  /* 09 overlap: the right card slides up over the wrong card, which stays behind (upper left), dim */
  sd(2, 'overlap', 'การ์ดซ้อนทับ', (d, c) => { const T_ = CT();
    art(c, p => { const gW = mvG(p, { o: dimW(T_.tN, .4) }); outlineIn(p, R(gW, -425, -230, 640, 330, 40, OUT()), T_.tW);
      ICON(p, c, d, 'w', -320, -110, 170, { room: 190 }); WORD(p, d, 'w', -210, -150, { anchor: 'start', size: 54, maxW: 400 });
      const KR = { y: [[0, 300], [T_.tR, 300], [f3(T_.tR + tu(.4)), 0, 'out']], o: fadeIn(T_.tR, .05) }, gR = mvG(CL(p), KR); R(gR, -225, -95, 650, 325, 40, { fill: C.fill, sw: 2.8, stroke: TL_(.55) }); R(litOn(gR, T_.H), -225, -95, 650, 325, 40, LITC());
      const KRi = { px: -90, py: 68, y: KR.y, o: KR.o }; ICON(p, c, d, 'r', -90, 68, 200, { g: mvG(p, KRi), mv: KRi, t: T_.tR, cx: 100, room: 560 }); WORD(p, d, 'r', 30, 94, { anchor: 'start', size: 72, maxW: 370, g: mvG(p, { y: KR.y }) }); });
    MK(c, [180, -195], [389, -60], 32); });
  /* 10 a big curved arrow under the two: from the wrong to the right */
  sd(2, 'curve', 'ลูกศรโค้งใต้', (d, c) => { const T_ = CT(), D = 'M -250 150 Q 0 300 250 150';
    art(c, p => { on(p.path(D, { sw: 6, stroke: TL_(.55) }), p, 0, { draw: [[0, 0], [f3(T_.tN + tu(.06)), 0], [T_.tR, 1, 'io']] });
      atG(p, T_.tR).path('M 214 182 L 252 148 L 208 138', { sw: 6, stroke: TL_(.55) });
      ICON(p, c, d, 'w', -270, -70, 250, { room: 320, cy: -20, hmax: 330 }); WORD(p, d, 'w', -270, 135, { size: 58, maxW: 320 });
      ICON(p, c, d, 'r', 270, -70, 250, { room: 320, cy: -20, hmax: 330 }); WORD(p, d, 'r', 270, 135, { size: 62, maxW: 320 }); });
    MK(c, [-160, -185], [380, -185], 32); });


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
  G.cats.B05S = { ROUNDS, S: SZD, SIZES, SAMPLES, STRESS, theme, frame,
    drawS: (k, i, d, c) => { d = trimLong(d); setZ(c); CUR = 's' + k + '-' + SZD[k][i].id; BOX = [SIZES[k].w, SIZES[k].h]; tokens(); EMPTY = false; BLUE = false; SZD[k][i].fn(d || {}, c); },
    draw: (r, k, d, c) => { d = trimLong(d); setZ(c); CUR = 'r' + r + 's' + k; BOX = [SIZES[k].w, SIZES[k].h]; tokens(); EMPTY = false; BLUE = false; ROUNDS[r][k](d || {}, c); }, CLAMPS };
})();
