/* b06s.js — B06 "คำถาม / ความสงสัย" ชุด 7 ขนาด, made SIZE BY SIZE (user: "ออกแบบทีละขนาด … 10 อัน" — HANDOFF 00). Calm, professional motion as
   B01T–B09T (no flying / orbiting / spinning). Fill each size's box · icons may float, big · ✓-free (B06 has no verdict) · long words (> 16) dropped
   when there is an icon · grey bars never stand in for words. Data = CutPack B06: about · options [2] · answer (any mix). Header + helpers copied
   from examples/b06t/b06t.js (clip boxes fixed to the size). GL.cats.B06S.drawS(size, i, data, c). */
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
    cp.id = 'b06sclip' + (++CID); Object.entries({ x, y, width: w, height: h }).forEach(([k, v]) => r.setAttribute(k, v)); cp.appendChild(r);
    (svg.querySelector('defs') || svg).appendChild(cp); return sub(p, { 'clip-path': `url(#${cp.id})` }); }
  /* a label; too wide → smaller, or (wrap) two lines broken between Thai words */
  function txt(p, str, x, y, { size = 42, maxW = 1e9, weight = 600, anchor = 'middle', color = C.soft, wrap = null } = {}) {
    str = String(str); const e = p.text(str, x, y, { size, weight, anchor, color, dur: .01 });
    const w = e.getBBox().width; if (w <= maxW) return e;
    if (wrap && (maxW / w < .8 || size * maxW / w < 40) && typeof Intl !== 'undefined' && Intl.Segmenter) {
      const seg = [...new Intl.Segmenter('th', { granularity: 'word' }).segment(str)].map(t => t.segment);
      if (seg.length > 1) { let k = 1, best = 1e9, n = 0; const tot = str.length;
        seg.forEach((t, i) => { n += t.length; if (i < seg.length - 1) { const m = Math.max(n, tot - n); if (m < best) { best = m; k = i + 1; } } });
        const l1 = seg.slice(0, k).join('').trim(), l2 = seg.slice(k).join('').trim(), s2 = Math.max(40, size * .9), lh = s2 * 1.12;
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
  function ripple(q, x, y, r, t) { const g = sub(q); on(g, q, 0, { ox: x, oy: y, s: [[0, .85], [t, .85], [t + tu(.7), 1.3, 'out']], o: [[0, 0], [t, 0], [t + tu(.12), .5, 'io'], [t + tu(.7), 0, 'io']] }); g.circle(x, y, r, W(2.4)); }   /* B06T: a soft ring */
  const popAt = (q, x, y, t) => { const g = sub(q); on(g, q, 0, { ox: x, oy: y, s: [[0, .8], [t, .8], [t + tu(.32), 1, 'out']], o: [[0, 0], [t, 0], [t + tu(.14), 1]] }); return g; };

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
    if (o.punch != null) kf(a.g, at, { ox: X, oy: Y, s: [[0, 1], [o.punch, 1], [o.punch + tu(.18), 1.05, 'io'], [o.punch + tu(.42), 1, 'io']] });   /* B06T: a soft swell */
    return a;
  }
  /* an icon is its own art on the stage — the canvas clip (CL) does not reach it, so a thing falling in from far above showed its icon over the design
     above on the sheet. Every icon is clipped to its own canvas (stage coords; one clip per canvas) */
  const ICLIP = {};
  function iclip(a, c) { if (!a || !a.wrap || !a.wrap.parentNode) return; const svg = a.wrap.ownerSVGElement, k = [c.x, c.y, c.s, BOX[0], BOX[1]].join('_');
    if (!ICLIP[k] || !svg.contains(ICLIP[k].cp)) { const cp = document.createElementNS(NS, 'clipPath'), r = document.createElementNS(NS, 'rect'); cp.id = 'b06ticlip' + (++CID);
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
  /* B06T (user: "ลดลูกเล่นของอนิเมชั่นลงอีก แต่ไม่อยากให้แข็งเกินไป และต้องสมูท"): calm, eased moves — no stretch, squash, bounce or overshoot */
  /* a smooth sway on x between t0 and t1 (each swing eased in-out, amplitude a, one swing every st) */
  const shakeX = (t0, t1, a = 4, st = .05) => { const K = [[0, 0], [t0, 0]]; let t = t0, sg = 1; const sw = Math.max(tu(.3), tu(st)); while (t + sw < t1) { t += sw; K.push([f3(t), sg * a, 'io']); sg = -sg; } K.push([f3(t1), 0, 'io']); return K; };
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
  const fallK = (px, py, t0, t1, h = 320) => ({ px, py, y: [[0, -h], [t0, -h], [f3(t1 + tu(.06)), 0, 'out']], o: fadeIn(t0, .08) });
  /* grows up from its base (px, py) with an overshoot */
  const upK = (px, py, t, d = .3) => ({ px, py, sy: [[0, 0], [t, 0], [f3(t + tu(d + .06)), 1, 'out']], o: fadeIn(t, .06) });
  /* spins in edge-on (a coin / a sign turning to face us) */
  const spinK = (px, py, t) => ({ px, py, s: [[0, .8], [t, .8], [f3(t + tu(.34)), 1, 'out']], o: fadeIn(t, .12) });   /* B06T: no edge-on spin — a soft grow-in */
  /* dust kicked up left and right where something lands */
  const dust = () => {};
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
  function ent(kind, x, y, sz, t) { const t1 = f3(t + tu(.34));   /* B06T: every entrance eases in and stops — no overshoot */
    if (kind === 'drop') return Object.assign(fallK(x, y + sz / 2, t, t1, f1(y + sz / 2 + 360)), { land: t1 });
    if (kind === 'rise') { const dy = f1(360 - (y - sz / 2)); return { px: x, py: y, y: [[0, dy], [t, dy], [t1, 0, 'out']], o: fadeIn(t, .08), land: t1 }; }
    if (kind === 'left' || kind === 'right') { const sd = kind === 'left' ? -1 : 1, dx = f1(sd * (510 + sz / 2) - x); return { px: x, py: y, x: [[0, dx], [t, dx], [t1, 0, 'out']], o: fadeIn(t, .08), land: t1 }; }
    if (kind === 'spin') return Object.assign(spinK(x, y, t), { land: t1 });
    if (kind === 'flip') return { px: x, py: y, sx: [[0, .2], [t, .2], [t1, 1, 'out']], o: fadeIn(t, .1), land: t1 };
    return { px: x, py: y, s: [[0, .8], [t, .8], [t1, 1, 'out']], o: fadeIn(t, .12), land: t1 }; }
  function entBox(p, c, d, i, x, y, sz, kind, o = {}) { const Q = STP(d), K = ent(kind, x, y, sz, Q.tI(i)); stepBox(p, c, d, i, x, y, sz, Object.assign({ g: mvG(CL(p), K), mv: K, t: Q.tI(i) }, o));
    if (kind === 'drop' && o.dust !== false) dust(p, x, y + sz / 2, K.land, sz / 220); return K; }
  const curveD = pts => { let s = `M ${pts[0][0]} ${pts[0][1]}`; for (let i = 1; i < pts.length; i++) { const [x0, y0] = pts[i - 1], [x1, y1] = pts[i], mx = f1((x0 + x1) / 2); s += ` C ${mx} ${y0} ${mx} ${y1} ${x1} ${y1}`; } return s; };
  const bez = (a, b, u) => { const mx = (a[0] + b[0]) / 2, m = 1 - u; return [f1(m * m * m * a[0] + 3 * m * m * u * mx + 3 * m * u * u * mx + u * u * u * b[0]), f1(m * m * m * a[1] + 3 * m * m * u * a[1] + 3 * m * u * u * b[1] + u * u * u * b[1])]; };
  const viaBez = pts => i => [.2, .4, .6, .8].map(u => bez(pts[i], pts[i + 1], u));


  /* ================= B06T — คำถาม / ความสงสัย (Question / Curiosity) as a template ชุดฐาน =================
     CutPack B06: about THING · options [THING, THING] · answer THING (any mix, at least one). Story: what is in doubt comes in (about, then the two
     options), the "?" appears and the doubt plays (the options take turns, the "?" pulses), and on the keyword H it resolves —
     answer = one of the options → that option lights, the other dims · answer apart → the answer lands lit in its own slot · no answer → the "?" itself
     lands lit (the question is the point). The "?" leaves (fades) when there is an answer. */
  const QD = d => { const T = X => X && has(X) ? X : null, ab = T(d && d.about), op = (d && Array.isArray(d.options) ? d.options.filter(has) : []).slice(0, 2), an0 = T(d && d.answer);
    const same = (a, b) => a && b && ((a.icon && b.icon && a.icon === b.icon && (!a.label || !b.label || a.label === b.label)) || (!a.icon && !b.icon && a.label === b.label) || (a.label && b.label && a.label === b.label));
    const ai = an0 && op.length === 2 ? op.findIndex(o => same(o, an0)) : -1, an = ai >= 0 ? null : an0;
    return { ab, op: op.length === 2 ? op : [], ai, an, hasA: !!ab, hasO: op.length === 2, hasN: !!an, answered: ai >= 0 || !!an0 }; };
  const QT = d => { const F = QD(d), H = Z.H, tA = tu(.1), tO = i => f3((F.hasA ? tu(.34) : tu(.1)) + tu(.16 * i)), tQ = f3(Math.max(tu(.62), H - tu(.95))); return { H, tA, tO, tQ, tD0: f3(tQ + tu(.2)), tD1: f3(H - tu(.12)) }; };
  /* the doubt: the options take turns (soft glow on one, then the other) between tD0 and tD1 */
  const doubtK = (T_, i) => { const K = [[0, 0]]; let t = T_.tD0, k = 0; while (t + tu(.36) <= T_.tD1) { const on1 = (k % 2) === i; K.push([f3(t), on1 ? 0 : 1], [f3(t + tu(.16)), on1 ? 1 : 0, 'io']); t += tu(.36); k++; } K.push([f3(T_.tD1), K[K.length - 1][1]], [f3(T_.tD1 + tu(.14)), 0, 'io']); return K; };   /* slow, soft turns */
  /* one thing: role 'a' about · 'o' option i · 'n' answer. Draws its slot (box | circ | hex | o.draw), enters by o.kind at its time (o.t), the
     option glows in turn during the doubt, and on H: chosen option / answer light (+ ripple), the other option dims. Returns { g, K } */
  function qthing(p, c, d, role, i, x, y, sz, o = {}) { const F = QD(d), T_ = QT(d), X = role === 'a' ? F.ab : role === 'o' ? F.op[i] : F.an; if (!X) return null;
    const t = o.t ?? (role === 'a' ? T_.tA : role === 'o' ? T_.tO(i) : f3(T_.H - tu(.08))), sh = o.shape || 'box', draw = o.draw || ((q, st) => shp(q, sh, x, y, sz, st));
    const win = (role === 'o' && F.ai === i) || role === 'n', lose = role === 'o' && F.ai >= 0 && F.ai !== i;
    const K = o.K || (o.kind === 'none' ? null : ent(o.kind || (role === 'n' ? 'pop' : 'pop'), x, y, sz, t)), g0 = o.g || (K ? mvG(o.clip === false ? p : CL(p), K) : popAt(p, x, y, t));
    if (lose) draw(g0, BK); const g1 = lose ? mvG(g0, { o: [[0, 1], [T_.H, 1], [f3(T_.H + tu(.3)), .4, 'io']] }) : g0, g = win ? mvG(g1, { px: x, py: y, s: [[0, 1], [T_.H, 1], [f3(T_.H + tu(.16)), 1.04, 'io'], [f3(T_.H + tu(.4)), 1, 'io']] }) : g1;
    draw(g, o.style || F_(4)); if (sh === 'circ' && !o.draw) g.circle(x, y, sz / 2 - 13, SL(1.4));
    if (role === 'o' && F.hasO) { const lt = sub(g); on(lt, p, 0, { o: doubtK(T_, i) }); draw(lt, { fill: TA(.12), sw: 3, stroke: TL_(.6) }); }
    if (win) { draw(litOn(g, T_.H), o.litStyle || LIT2()); if (o.rip !== false) ripple(p, o.ix ?? x, o.iy ?? y, sz * .58, f3(T_.H + tu(.04))); }
    const iw = o.iw || sz * (sh === 'box' ? .72 : .66);
    if (picOf(X)) put(p, c, { icon: X.icon }, o.ix ?? x, o.iy ?? y, iw, null, { t: f3(t + tu(.04)), mv: o.mv || K || undefined, o: o.io || (lose ? [[0, 1], [T_.H, 1], [f3(T_.H + tu(.3)), .4, 'io']] : undefined), punch: win ? T_.H : undefined });
    else txt(g, X.label, o.ix ?? x, (o.iy ?? y) + 16, { size: Math.max(40, Math.min(56, iw * .3)), maxW: o.lw || iw * 1.15, weight: 800, color: C.ink, wrap: 'mid' });
    return { g, K }; }
  const F_ = F;
  /* its words (only when it has an icon): plain or pill; the losing option dims */
  function qword(p, d, role, i, x, y, o = {}) { const Fd = QD(d), T_ = QT(d), X = role === 'a' ? Fd.ab : role === 'o' ? Fd.op[i] : Fd.an, str = LBL(X); if (!str) return null;
    const t = o.t ?? f3((role === 'a' ? T_.tA : role === 'o' ? T_.tO(i) : T_.H) + tu(.16)), lose = role === 'o' && Fd.ai >= 0 && Fd.ai !== i, sz = o.size || 46;
    if (o.pill) { const mw = o.maxW || 320, wd = Math.min(mw, tw(p, str, sz)) + 60, cx = o.anchor === 'start' ? x + wd / 2 : o.anchor === 'end' ? x - wd / 2 : x; pill(o.g || p, str, cx, y, { t, size: sz, maxW: mw, dim: lose ? T_.H : undefined }); return null; }
    const g1 = popAt(o.g || p, x, y - sz * .35, t), g = lose ? mvG(g1, { o: [[0, 1], [T_.H, 1], [f3(T_.H + tu(.2)), .45]] }) : g1;
    return txt(g, str, x, y, { size: sz, maxW: o.maxW || 320, weight: 800, color: C.ink, anchor: o.anchor || 'middle', wrap: o.wrap === undefined ? 'mid' : o.wrap }); }
  /* the "?" sign: a round badge with the glyph; pops at tQ (o.t), pulses during the doubt; on H: answered → fades away (o.keep: stays dim),
     not answered → it lights in the accent and grows a little (the question is the point). o.r radius · o.plain = the glyph alone, no badge */
  function qmark(p, d, x, y, r, o = {}) { const T_ = QT(d), Fd = QD(d), t = o.t ?? T_.tQ, ans = Fd.answered;
    if (ans && t >= T_.H - .01) return null;   /* answered: no late "?" */
    const keep = o.keep ?? Fd.ai >= 0;
    const pulse = [[0, 1]]; for (let u = T_.tD0, k = 0; u + tu(.5) <= T_.tD1; u += tu(.5), k++) pulse.push([f3(u), 1], [f3(u + tu(.25)), 1.04, 'io'], [f3(u + tu(.5)), 1, 'io']);   /* a slow breath */
    const fin = ans ? [[T_.H, 1], [f3(T_.H + tu(.2)), keep ? .3 : 0]] : [];   /* answered by one of the options: the "?" stays, faint */
    if (!o.plain) { const gb = mvG(o.g || p, { o: [[0, 0], [t, 0], [f3(t + tu(.14)), 1]].concat(ans && !keep ? [[T_.H, 1], [f3(T_.H + tu(.2)), 0]] : []) }); gb.circle(x, y, r, { fill: C.fill, sw: 0, stroke: 'none' }); }   /* solid under the "?" (user: "รวมถึงเครื่องหมาย question mark ด้วย") */
    const g0 = mvG(o.g || p, { px: x, py: y, s: [[0, .8], [t, .8], [f3(t + tu(.32)), 1, 'out']].concat(pulse.slice(1)).concat(ans ? [] : [[T_.H, 1], [f3(T_.H + tu(.36)), 1.08, 'io']]), o: [[0, 0], [t, 0], [f3(t + tu(.14)), 1]].concat(fin) });
    if (!o.plain) { g0.circle(x, y, r, F(4)); if (!ans) litOn(g0, T_.H).circle(x, y, r, { fill: TA(.3), sw: 5, stroke: ACC1 }); }
    const gl = txt(g0, '?', x, f1(y + r * .42), { size: f1(r * 1.25), weight: 800, color: C.ink }); if (!ans) { const l2 = txt(litOn(g0, T_.H), '?', x, f1(y + r * .42), { size: f1(r * 1.25), weight: 800, color: ACC1 }); }
    if (!ans) ripple(p, x, y, r + 14, f3(T_.H + tu(.06))); return g0; }
  /* ✓-free answer badge: when the answer is apart and lands — a ring sweeps round it (no ✓ — an answer, not a verdict) */
  const sweepRing = (p, x, y, r, t) => { const a = p.path(arcD(x, y, r, 1), { sw: 6, stroke: ACC1 }); on(a, p, 0, { draw: [[0, 0], [t, 0], [f3(t + tu(.3)), 1, 'out']] }); };
  /* common: the answer apart lands at (x, y) with a ring sweeping round it; its word at o.wy (pill) */
  function qans(p, c, d, x, y, sz, o = {}) { const Fd = QD(d), T_ = QT(d); if (!Fd.an) return; const r = qthing(p, c, d, 'n', 0, x, y, sz, Object.assign({ kind: 'pop' }, o));
    if (o.word !== false) qword(p, d, 'n', 0, o.wx ?? x, o.wy ?? f1(y + sz / 2 + 60), Object.assign({ pill: true, maxW: 320, t: f3(T_.H + tu(.12)) }, o.wo || {})); return r; }
  const bubbleD = (x, y, w, h, tx, ty, side = -1) => { const r = 44, l = x - w / 2, t = y - h / 2, R_ = x + w / 2, b = y + h / 2, a = f1(x + side * w * .18), e = f1(a + side * -60);
    return `M ${l + r} ${t} L ${R_ - r} ${t} Q ${R_} ${t} ${R_} ${t + r} L ${R_} ${b - r} Q ${R_} ${b} ${R_ - r} ${b} L ${Math.max(a, e)} ${b} L ${tx} ${ty} L ${Math.min(a, e)} ${b} L ${l + r} ${b} Q ${l} ${b} ${l} ${b - r} L ${l} ${t + r} Q ${l} ${t} ${l + r} ${t} Z`; };


  /* ================= B06S — คำถาม ชุด 7 ขนาด (per size) ================= */
  function frame(c, W0, H0) { const f = p => { p.rect(-W0 / 2, -H0 / 2, W0, H0, { sw: 3, stroke: '#ffd400' }); }; f.custom = true; f.dur = .01; f.exit = 'pop'; G.art(f, { x: c.x, y: c.y, s: c.s, at: 0, speed: 1 }); }
  const SIZES = [null, { w: 860, h: 230, th: 'แถบแบนยาว' }, { w: 860, h: 470, th: 'กว้าง' }, { w: 560, h: 490, th: 'เกือบจัตุรัส' }, { w: 400, h: 635, th: 'ตั้งแคบ' },
    { w: 860, h: 710, th: 'เต็มจอ ทรงนอน' }, { w: 860, h: 965, th: 'เต็มจอ ทรงตั้ง' }, { w: 400, h: 500, th: 'ตั้งแคบ สั้น' }];
  const SZD = {}; const sd = (k, id, th, fn) => (SZD[k] = SZD[k] || []).push({ id, th, fn });
  const OUT = (a = .55) => ({ sw: 2.8, stroke: TL_(a) });
  /* the things of a line in order: about · option 0 · option 1 · answer (apart) */
  const ITEMS = d => { const F = QD(d), L = []; if (F.hasA) L.push(['a', 0]); if (F.hasO) L.push(['o', 0], ['o', 1]); if (F.hasN) L.push(['n', 0]); return L; };
  const thingOf = (d, r, i) => { const F = QD(d); return r === 'a' ? F.ab : r === 'o' ? F.op[i] : F.an; };
  /* one thing in a cell (x, y, w, h): shape 'card' | 'pill' | 'circ' | 'float'; icon left + word right when the cell is wide, else icon over word;
     no word → the icon alone, centred and bigger */
  function cell(p, c, d, r, i, x, y, w, h, st = {}) { const X = thingOf(d, r, i); if (!X) return; const lab = LBL(X), hasI = !!picOf(X), sh = st.shape || 'card', rx = sh === 'pill' ? h / 2 : sh === 'circ' ? 0 : Math.min(34, h * .18);
    const LS = LIT2(), draw = sh === 'circ' ? (q, s2) => q.circle(x, y, Math.min(w, h) / 2, s2) : sh === 'float' ? (q, s2) => s2 === LS ? R(q, x - w / 2, y - h / 2, w, h, Math.min(34, h * .18), { fill: TA(.06), sw: 4, stroke: ACC1 }) : null
      : (q, s2) => R(q, x - w / 2, y - h / 2, w, h, rx, s2);
    const style = sh === 'float' ? {} : OUT(), wide = w >= (st.wideMin ?? 330);
    let ix = x, iy = y, iw, wx = x, wy, an = 'middle', mw;
    if (!lab || !hasI || st.noWord) { iw = f1(Math.min(h * .78, w * .8, st.cap ?? 300)); }
    else if (wide) { iw = f1(Math.min(h * .66, w * .36, st.cap ?? 220)); ix = f1(x - w / 2 + (st.pad ?? 22) + iw / 2); wx = f1(ix + iw / 2 + 20); wy = f1(y + (st.ws ?? 50) * .36); an = 'start'; mw = f1(x + w / 2 - 18 - wx); }
    else { iw = f1(Math.min(h * .5, w * .7, st.cap ?? 200)); iy = f1(y - h * .14); wy = f1(y + h * .34); mw = w - 24; }
    if (st.solid) { const T_ = QT(d), tb = f3((r === 'a' ? T_.tA : r === 'o' ? T_.tO(i) : T_.H - tu(.08)) - tu(.02)), gb = atG(p, tb), BKs = { fill: C.fill, sw: 0, stroke: 'none' };   /* solid backing (user: no see-through icons) */
      if (sh === 'circ') gb.circle(x, y, Math.min(w, h) / 2, BKs); else R(gb, x - w / 2, y - h / 2, w, h, sh === 'pill' ? h / 2 : Math.min(34, h * .18), BKs); }
    qthing(p, c, d, r, i, x, y, Math.min(w, h), { kind: st.kind || 'pop', draw, style, litStyle: LS, ix, iy, iw, lw: w * .86, rip: false });
    if (lab && hasI && !st.noWord) qword(p, d, r, i, wx, wy, { size: st.ws ?? (wide ? 50 : 40), maxW: mw, anchor: an, wrap: st.wrap !== undefined ? st.wrap : an === 'start' ? 'mid' : null }); }
  /* lay the things across (x0..x1) at y, height h, gap g; returns their centres */
  function rowCells(p, c, d, x0, x1, y, h, g, st, L = ITEMS(d)) { const n = Math.max(1, L.length), w = (x1 - x0 - (n - 1) * g) / n, out = [];
    L.forEach(([r, i], k) => { const x = f1(x0 + w / 2 + k * (w + g)); cell(p, c, d, r, i, x, y, w, h, st); out.push([x, w]); }); return out; }

  /* ---------- SIZE 1 · 860 × 230 ---------- */
  sd(1, 'row', 'การ์ดเรียง + ? ท้าย', (d, c) => { art(c, p => { rowCells(p, c, d, -425, 270, 0, 210, 18, {}); qmark(p, d, 350, 0, 70); }); });
  sd(1, 'qfirst', '? ใหญ่นำหน้า', (d, c) => { art(c, p => { qmark(p, d, -345, 0, 80); rowCells(p, c, d, -240, 425, 0, 200, 16, { shape: 'pill' }); }); });
  /* 03 the things with a small "?" between each pair — "A ? B" reads as a question (arrows would read as steps) */
  sd(1, 'between', 'การ์ดคั่น ?', (d, c) => { const L = ITEMS(d); art(c, p => { const pts = rowCells(p, c, d, -425, L.length > 1 ? 425 : 270, 0, 210, 84, {}, L);
      if (L.length > 1) pts.slice(0, -1).forEach(([x, w]) => qmark(p, d, f1(x + w / 2 + 42), 0, 40, { plain: true, keep: true })); else qmark(p, d, 350, 0, 70); }); });
  sd(1, 'track', 'แคปซูลยาว', (d, c) => { const T_ = QT(d); art(c, p => { outlineIn(p, R(p, -425, -105, 850, 210, 105, OUT(.5)), T_.tA); rowCells(p, c, d, -360, 360, 0, 180, 20, { shape: 'float', wideMin: 260 }); qmark(p, d, 0, -88, 30); }); });
  sd(1, 'segment', 'แถบแบ่งช่อง', (d, c) => { const T_ = QT(d), L = ITEMS(d), n = L.length + 1, w = 850 / n;
    art(c, p => { outlineIn(p, R(p, -425, -105, 850, 210, 34, OUT(.5)), T_.tA); for (let k = 1; k < n; k++) drawAt(p.line(f1(-425 + k * w), -80, f1(-425 + k * w), 80, { sw: 2.4, stroke: TL_(.4) }), p, f3(T_.tA + tu(.06 * k)), tu(.25));
      rowCells(p, c, d, -425, f1(425 - w), 0, 196, 0, { shape: 'float', wideMin: 280 }, L); qmark(p, d, f1(425 - w / 2), 0, 62); }); });
  sd(1, 'plates', 'แผ่นกลม + คำ', (d, c) => { const L = ITEMS(d), n = L.length, w = (760 - (n - 1) * 20) / n;
    art(c, p => { L.forEach(([r, i], k) => { const x0 = -425 + k * (w + 20), X = thingOf(d, r, i), lab = LBL(X) && picOf(X), px = lab ? f1(x0 + 100) : f1(x0 + w / 2);
        cell(p, c, d, r, i, px, 0, 190, 190, { shape: 'circ', cap: 140, noWord: true });   /* the word sits beside the plate only */ if (lab) qword(p, d, r, i, f1(px + 110), 18, { size: 46, maxW: f1(x0 + w - px - 110), anchor: 'start' }); });
      qmark(p, d, 375, 0, 48); }); });
  sd(1, 'brackets', 'วงเล็บใหญ่', (d, c) => { const T_ = QT(d); art(c, p => { [['M -390 -100 Q -425 0 -390 100', -1], ['M 300 -100 Q 335 0 300 100', 1]].forEach(([D], k) => drawAt(p.path(D, { sw: 6, stroke: TL_(.55) }), p, f3(T_.tA + tu(.1 * k)), tu(.3)));
      rowCells(p, c, d, -370, 280, 0, 190, 16, { shape: 'float', wideMin: 280 }); qmark(p, d, 380, 0, 62, { plain: true }); }); });
  sd(1, 'dashed', 'ช่องเส้นประ', (d, c) => { const L = ITEMS(d), T_ = QT(d), n = L.length, w = (700 - (n - 1) * 20) / n;
    art(c, p => { L.forEach((_, k) => drawAt(R(p, f1(-425 + k * (w + 20)), -105, w, 210, 30, DASH(.45)), p, f3(T_.tA + tu(.05 * k)), tu(.3)));
      rowCells(p, c, d, -425, 275, 0, 210, 20, { shape: 'float', wideMin: 280 }, L); qmark(p, d, 355, 0, 66); }); });
  /* 09 (user: "9 ดีไซน์ใหม่") a search field — asking = looking it up: the field draws, the magnifier sits at its start, the things are typed in one
     by one, the "?" blinks at the end like the cursor; on H the answer lights (or the "?" lights) */
  sd(1, 'search', 'ช่องค้นหา', (d, c) => { const T_ = QT(d);
    art(c, p => { outlineIn(p, R(p, -425, -105, 850, 210, 105, OUT(.55)), T_.tA); drawAt(p.line(-275, -70, -275, 70, { sw: 2.4, stroke: TL_(.4) }), p, T_.tA, tu(.25));
      put(p, c, { icon: 'search' }, -350, 0, 120, null, { t: T_.tA }); rowCells(p, c, d, -255, 285, 0, 186, 14, { shape: 'float', wideMin: 250 }); qmark(p, d, 355, 0, 56, { plain: true }); }); });
  /* 10 the "?" holds the answer's place: a tile with "?" at the end; when the answer comes it takes that tile (no answer → the "?" lights) */
  sd(1, 'qtile', 'ช่อง ? รอคำตอบ', (d, c) => { const F = QD(d), T_ = QT(d), L = ITEMS(d).filter(([r]) => r !== 'n'), w = 230;
    art(c, p => { rowCells(p, c, d, -425, f1(425 - w - 24), 0, 210, 18, {}, L.length ? L : [['n', 0]]); outlineIn(p, R(p, 425 - w, -105, w, 210, 34, DASH(.5)), T_.tA);
      if (F.hasN && L.length) cell(p, c, d, 'n', 0, 425 - w / 2, 0, w, 210, { wideMin: 999 }); qmark(p, d, 425 - w / 2, 0, 70, { plain: true }); }); });

  function colCells(p, c, d, x, y0, y1, w, g, st, L = ITEMS(d)) { const n = Math.max(1, L.length), h = (y1 - y0 - (n - 1) * g) / n, out = [];
    L.forEach(([r, i], k) => { const y = f1(y0 + h / 2 + k * (h + g)); cell(p, c, d, r, i, x, y, w, h, st); out.push([y, h]); }); return out; }

  /* ---------- SIZE 2 · 860 × 470 ---------- */
  sd(2, 'qcard', 'การ์ด ? ซ้าย + การ์ดขวา', (d, c) => { const T_ = QT(d); art(c, p => { outlineIn(p, R(p, -425, -230, 250, 460, 40, OUT(.5)), T_.tA); qmark(p, d, -300, 0, 92, { plain: true });
      const L = ITEMS(d); if (L.length > 2) colCells(p, c, d, 125, -230, 230, 600, 16, {}, L); else rowCells(p, c, d, -155, 425, 0, 460, 20, { wideMin: 999 }, L); }); });
  /* 02 a quiz card: what is asked on top, the two options as answer buttons below; the chosen button lights */
  sd(2, 'quiz', 'การ์ดคำถาม + ปุ่มตอบ', (d, c) => { const F = QD(d), T_ = QT(d);
    art(c, p => { const top = F.hasA ? [['a', 0]] : [], bot = F.hasO ? [['o', 0], ['o', 1]] : F.hasN ? [['n', 0]] : [];
      if (top.length) { rowCells(p, c, d, -425, 290, -118, 225, 0, {}, top); qmark(p, d, 360, -118, 64); } else qmark(p, d, 0, -118, 100, { plain: true });
      if (bot.length) rowCells(p, c, d, -425, 425, 118, 225, 24, { shape: 'pill' }, bot); else { outlineIn(p, R(p, -425, 6, 850, 225, 112, DASH(.45)), T_.tA); if (top.length) qmark(p, d, 0, 118, 80, { plain: true, t: f3(T_.tQ + tu(.1)) }); } }); });   /* nothing to answer with → the answer slot waits with a "?" */
  sd(2, 'between', 'การ์ดคั่น ?', (d, c) => { const L = ITEMS(d); art(c, p => { const pts = rowCells(p, c, d, -425, L.length > 1 ? 425 : 230, 0, 460, 96, { wideMin: 999 }, L);
      if (L.length > 1) pts.slice(0, -1).forEach(([x, w]) => qmark(p, d, f1(x + w / 2 + 48), 0, 52, { plain: true, keep: true })); else qmark(p, d, 330, 0, 92); }); });
  /* 04 a search field on top (what is asked), the results below (options / answer) */
  sd(2, 'search', 'ช่องค้นหา + ผลลัพธ์', (d, c) => { const F = QD(d), T_ = QT(d);
    art(c, p => { outlineIn(p, R(p, -425, -230, 850, 150, 75, OUT(.55)), T_.tA); put(p, c, { icon: 'search' }, -350, -155, 100, null, { t: T_.tA });
      const top = F.hasA ? [['a', 0]] : [], bot = (F.hasO ? [['o', 0], ['o', 1]] : []).concat(F.hasN ? [['n', 0]] : []);
      if (top.length) rowCells(p, c, d, -280, 300, -155, 140, 0, { shape: 'float', wideMin: 200, ws: 52 }, top); qmark(p, d, 365, -155, 50, { plain: true });
      if (bot.length) rowCells(p, c, d, -425, 425, 82, 296, 20, { wideMin: 999 }, bot); else { outlineIn(p, R(p, -425, -66, 850, 296, 36, DASH(.4)), T_.tA); qmark(p, d, 0, 82, 96, { plain: true, t: f3(T_.tQ + tu(.1)) }); } }); });   /* no results yet → a big "?" waits */
  /* 05 radio options: one row each; the selection dot hops between them in the doubt and settles on the answer */
  sd(2, 'radio', 'ตัวเลือกวงกลม', (d, c) => { const F = QD(d), T_ = QT(d), L = ITEMS(d);
    art(c, p => { const n = L.length, h = (460 - (n - 1) * 14) / n; L.forEach(([r, i], k) => { const y = f1(-230 + h / 2 + k * (h + 14));
        cell(p, c, d, r, i, 60, y, 730, h, { shape: 'pill', wideMin: 300 }); const rr = Math.min(34, h * .3); drawAt(p.circle(-370, y, rr, { sw: 4, stroke: C.ink }), p, f3(T_.tA + tu(.06 * k)), tu(.25));
        if ((r === 'o' && F.ai === i) || r === 'n') popAt(p, -370, y, T_.H).circle(-370, y, rr * .55, { fill: ACC1, sw: 0, stroke: 'none' }); });   /* the chosen one gets the radio dot on H */
      if (!F.answered) qmark(p, d, 360, 0, Math.min(70, 460 / n * .4)); }); });
  /* 06 a big "?" on the left half, the things stacked on the right */
  sd(2, 'bigq', '? ใหญ่ + คอลัมน์', (d, c) => { art(c, p => { qmark(p, d, -250, 0, 175); colCells(p, c, d, 205, -230, 230, 430, 16, {}); }); });
  /* 07 a chat: the question bubble (left, with "?") and the reply bubble (right, the options / answer — or a waiting "?") */
  sd(2, 'chat', 'แชตถาม-ตอบ', (d, c) => { const F = QD(d), T_ = QT(d), B1 = 'M -400 -230 L 90 -230 Q 115 -230 115 -205 L 115 -40 Q 115 -15 90 -15 L -330 -15 L -385 25 L -380 -15 Q -425 -15 -425 -40 L -425 -205 Q -425 -230 -400 -230 Z',
      B2 = 'M -90 15 L 400 15 Q 425 15 425 40 L 425 205 Q 425 230 400 230 L -65 230 Q -115 230 -115 205 L -115 40 Q -115 15 -90 15 Z';
    art(c, p => { outlineIn(p, p.path(B1, OUT(.55)), T_.tA); const tB = f3(T_.tQ - tu(.1)); drawAt(p.path(B2, OUT(.55)), p, tB, tu(.3));
      if (F.hasA) rowCells(p, c, d, -405, 0, -122, 190, 0, { shape: 'float', wideMin: 250 }, [['a', 0]]); qmark(p, d, F.hasA ? 58 : -155, -122, F.hasA ? 46 : 76, { plain: true });
      const bot = (F.hasO ? [['o', 0], ['o', 1]] : []).concat(F.hasN ? [['n', 0]] : []); if (bot.length) rowCells(p, c, d, -100, 410, 122, 190, 12, { shape: 'float', wideMin: 260 }, bot); else qmark(p, d, 155, 122, 60, { t: tB }); }); });
  /* 08 a half dial: the options at its two ends, the needle sways between them in the doubt and settles on the answer (none → points up at the "?") */
  sd(2, 'dial', 'หน้าปัดลังเล', (d, c) => { const F = QD(d), T_ = QT(d), cx = 0, cy = 200, r = 330, P = a => [f1(cx + r * Math.cos(rad(a))), f1(cy + r * Math.sin(rad(a)))];
    art(c, p => { if (!F.hasO) { rowCells(p, c, d, -425, 270, 0, 460, 20, { wideMin: 999 }); qmark(p, d, 350, 0, 80); return; }
      const [ax, ay] = P(180), [bx, by] = P(0); drawAt(p.path(`M ${ax} ${ay} A ${r} ${r} 0 0 1 ${bx} ${by}`, { sw: 5, stroke: TL_(.45) }), p, T_.tA, tu(.45));
      for (let k = 0; k <= 12; k++) tick(atG(p, f3(T_.tA + tu(.02 * k))), cx, cy, 180 + k * 15, r - 26, r - 8, { sw: 2.4, stroke: TL_(.45) });
      const fin = F.ai === 0 ? -55 : F.ai === 1 ? 55 : 0, Kr = [[0, 0], [T_.tD0, 0]]; let t = T_.tD0, k2 = 0; while (t + tu(.36) <= T_.tD1) { Kr.push([f3(t + tu(.36)), k2 % 2 ? 40 : -40, 'io']); t += tu(.36); k2++; } Kr.push([T_.H, fin, 'io']);
      const nd = mvG(p, { px: cx, py: cy, r: Kr, o: fadeIn(T_.tA, .06) }); nd.line(cx, cy, cx, cy - 200, { sw: 7, stroke: C.ink }); popAt(p, cx, cy, T_.tA).circle(cx, cy, 22, { fill: C.ink, sw: 0, stroke: 'none' });
      /* solid backing under the options so the dial's arc and ticks never show through the icons (user: "อย่าทำให้ไอคอนมันโปร่งแสงจนเห็นเส้นที่อยู่ด้านหลัง") */
      [[-285, 0], [285, 1]].forEach(([x, i]) => R(atG(p, f3(T_.tO(i) - tu(.02))), x - 120, -75, 240, 230, 30, { fill: C.fill, sw: 0, stroke: 'none' }));
      cell(p, c, d, 'o', 0, -285, 40, 240, 230, { shape: 'float', wideMin: 999 }); cell(p, c, d, 'o', 1, 285, 40, 240, 230, { shape: 'float', wideMin: 999 });
      if (F.hasA) cell(p, c, d, 'a', 0, 0, -150, 300, 150, { shape: 'float', wideMin: 250 }); else qmark(p, d, 0, -150, 56); }); });
  sd(2, 'brackets', 'วงเล็บใหญ่', (d, c) => { const T_ = QT(d); art(c, p => { [['M -380 -215 Q -430 0 -380 215'], ['M 255 -215 Q 305 0 255 215']].forEach(([D], k) => drawAt(p.path(D, { sw: 7, stroke: TL_(.55) }), p, f3(T_.tA + tu(.1 * k)), tu(.3)));
      rowCells(p, c, d, -355, 235, 0, 420, 16, { shape: 'float', wideMin: 999 }); qmark(p, d, 360, 0, 92, { plain: true }); }); });
  sd(2, 'qtile', 'ช่อง ? รอคำตอบ', (d, c) => { const F = QD(d), T_ = QT(d), L = ITEMS(d).filter(([r]) => r !== 'n'), w = 300;
    art(c, p => { rowCells(p, c, d, -425, f1(425 - w - 24), 0, 460, 20, { wideMin: 999 }, L.length ? L : [['n', 0]]); outlineIn(p, R(p, 425 - w, -230, w, 460, 40, DASH(.5)), T_.tA);
      if (F.hasN && L.length) cell(p, c, d, 'n', 0, 425 - w / 2, 0, w, 460, { wideMin: 999 }); qmark(p, d, 425 - w / 2, 0, 100, { plain: true }); }); });

  /* ---------- SIZE 3 · 560 × 490 — round 4 (user: the three earlier rounds are void; lay-outs taken from the passed B05 size 3, the mechanism
     turned into a question: the options take turns while in doubt, the "?" waits, and on the keyword H the answer lands lit). Pilot: 3 designs. ---------- */
  const X0 = -275, X1 = 275, Y0 = -240, Y1 = 240;
  /* a slot that waits with a "?" — a faint card from the start; o.ans: the answer apart lands in it on H (no answer → the "?" lights) */
  function qslot(p, c, d, x, y, w, h, o = {}) { const T_ = QT(d), F = QD(d), rx = o.rx ?? Math.min(34, h * .18);
    if (o.solid) R(atG(p, f3((o.t ?? T_.tA) - tu(.02))), f1(x - w / 2), f1(y - h / 2), w, h, rx, BK); outlineIn(p, R(p, f1(x - w / 2), f1(y - h / 2), w, h, rx, OUT(.4)), o.t ?? T_.tA);
    qmark(p, d, x, y, o.r ?? f1(Math.min(96, Math.min(w, h) * .32)), { plain: true, t: o.tq });
    if (o.ans && F.hasN) cell(p, c, d, 'n', 0, x, y, w, h, Object.assign({ wideMin: 999, solid: true }, o.st || {})); }
  /* a value that sways between the two options while in doubt — to v(k) on the same turns as the options' glow (doubtK) — and lands on fin after H */
  function swayK(d, v, start, fin) { const T_ = QT(d), K = [[0, start], [T_.tD0, start]]; let t = T_.tD0, k = 0, cur = start;
    while (t + tu(.36) <= T_.tD1) { cur = v(k % 2); K.push([f3(t + tu(.3)), cur, 'io']); t += tu(.36); k++; }
    K.push([f3(Math.max(t, T_.tD1)), cur], [f3(T_.H + tu(.12)), fin, 'io']); return K; }

  /* 01 two tall cards (B05 s3 "การ์ดคู่ตั้ง"): the two options side by side with a "?" on the seam between them; what is asked runs across the top;
     the answer apart has its own strip at the bottom that waits with the "?" (then the seam has none). No options → [what is asked | the answer's slot] */
  sd(3, 'pair', 'การ์ดคู่ตั้ง + ? คั่น', (d, c) => { const F = QD(d);
    art(c, p => {
      if (!F.hasO) { if (!F.hasA) { if (F.hasN) qslot(p, c, d, 0, 0, 550, 480, { ans: true, r: 120 }); else qmark(p, d, 0, 0, 130); return; }
        const w = 262; if (F.hasA) cell(p, c, d, 'a', 0, X0 + w / 2, 0, w, 480, { wideMin: 999 }); else qslot(p, c, d, X0 + w / 2, 0, w, 480, {});
        qslot(p, c, d, X1 - w / 2, 0, w, 480, { ans: true }); return; }
      const top = F.hasA ? 124 : 0, bot = F.hasN ? 124 : 0, y0 = Y0 + (top ? top + 14 : 0), y1 = Y1 - (bot ? bot + 14 : 0), h = y1 - y0, cy = f1((y0 + y1) / 2), gap = bot ? 24 : 84, w = (550 - gap) / 2;
      if (top) cell(p, c, d, 'a', 0, 0, f1(Y0 + top / 2), 550, top, { wideMin: 300, ws: 52 });
      cell(p, c, d, 'o', 0, f1(X0 + w / 2), cy, w, h, { wideMin: 999, wrap: 'mid' }); cell(p, c, d, 'o', 1, f1(X1 - w / 2), cy, w, h, { wideMin: 999, wrap: 'mid' });
      if (bot) qslot(p, c, d, 0, f1(Y1 - bot / 2), 550, bot, { ans: true, r: 44, st: { wideMin: 300 } }); else qmark(p, d, 0, cy, 36, { keep: true }); }); });

  /* 02 radio options (B05 s3 "ตัวเลือกวงกลม"): what is asked on a header with the "?" at its end; the options as rows, each with a radio circle;
     the selection dot moves between the options while in doubt and settles on the answer (an answer apart gets its own row, waiting with a "?");
     no answer → the dot leaves and the "?" lights */
  sd(3, 'radio', 'ตัวเลือกวงกลม', (d, c) => { const F = QD(d), T_ = QT(d);
    const rows = (F.hasO ? [['o', 0], ['o', 1]] : []).concat(F.hasN || !F.hasO ? [['n', 0]] : []), hd = F.hasA || rows.length < 2, g = 14;
    const one = rows.length < 2, hh = hd ? (rows.length > 2 ? 118 : one ? 218 : 140) : 0, rh = (480 - (hd ? hh + g : 0) - (rows.length - 1) * g) / rows.length, ry = k => f1(Y0 + (hd ? hh + g : 0) + rh / 2 + k * (rh + g));
    const rr = f1(Math.min(30, rh * .26)), rx = X0 + 34, px0 = rx + rr + 18, pw = X1 - px0, pcx = f1(px0 + pw / 2);
    art(c, p => { if (!F.hasO && !F.hasA) { if (F.hasN) qslot(p, c, d, 0, 0, 550, 480, { ans: true, r: 120 }); else qmark(p, d, 0, 0, 130); return; }
      if (hd) { const hy = f1(Y0 + hh / 2); outlineIn(p, R(p, X0, Y0, 550, hh, 34, OUT(.5)), T_.tA);
        if (F.hasA) { cell(p, c, d, 'a', 0, -48, hy, 444, hh, { shape: 'float', wideMin: 300, ws: one ? 58 : 52 }); qmark(p, d, 222, hy, 40, { keep: F.ai >= 0 }); } else qmark(p, d, 0, hy, 52, { plain: true }); }
      rows.forEach(([r, i], k) => { const y = ry(k); drawAt(p.circle(rx, y, rr, { sw: 4, stroke: C.ink }), p, f3((r === 'o' ? T_.tO(i) : T_.tA) - tu(.04)), tu(.25));
        if (r === 'o') cell(p, c, d, r, i, pcx, y, pw, rh, { shape: 'pill', wideMin: 300 }); else qslot(p, c, d, pcx, y, pw, rh, { rx: one ? 34 : rh / 2, r: f1(Math.min(one ? 70 : 44, rh * .3)), ans: true, st: { shape: one ? 'card' : 'pill', wideMin: 300 } }); });
      const fin = F.ai >= 0 ? ry(F.ai) : F.hasN ? ry(rows.length - 1) : null, y0 = F.hasO ? ry(0) : (fin ?? ry(0));
      const dot = mvG(p, { y: F.hasO ? swayK(d, k => ry(k), y0, fin ?? ry(0)) : [[0, y0]], o: [[0, 0], [F.hasO ? T_.tD0 : f3(T_.H - tu(.1)), 0], [f3((F.hasO ? T_.tD0 : T_.H - tu(.1)) + tu(.1)), 1]].concat(fin == null ? [[T_.H, 1], [f3(T_.H + tu(.2)), 0]] : []) });
      dot.circle(rx, 0, f1(rr * .55), DOTF()); }); });

  /* 03 a vertical slider (B05 s3 "สไลเดอร์ตั้ง"): the options at the top and bottom of a column, the "?" in the stop between them, a knob on a track
     beside them — it drifts up and down while in doubt and settles on the answer's stop (answer apart → it lands in the middle stop, where the "?" was) */
  sd(3, 'slider', 'สไลเดอร์ตั้ง', (d, c) => { const F = QD(d), T_ = QT(d);
    art(c, p => {
      if (!F.hasO) { if (!F.hasA) { if (F.hasN) qslot(p, c, d, 0, 0, 550, 480, { ans: true, r: 120 }); else qmark(p, d, 0, 0, 130); return; }
        const h2 = 233; if (F.hasA) cell(p, c, d, 'a', 0, 0, f1(Y0 + h2 / 2), 550, h2, { wideMin: 300, ws: 56 }); else qslot(p, c, d, 0, f1(Y0 + h2 / 2), 550, h2, {});
        qslot(p, c, d, 0, f1(Y1 - h2 / 2), 550, h2, { ans: true, st: { wideMin: 300 } }); return; }
      const top = F.hasA ? 100 : 0, a0 = Y0 + (top ? top + 14 : 0), mh = F.hasN ? 100 : 66, ch = (Y1 - a0 - mh - 28) / 2, tx = 212, cw = tx - 48 - X0, cx = f1(X0 + cw / 2);
      const yA = f1(a0 + ch / 2), yM = f1(a0 + ch + 14 + mh / 2), yB = f1(Y1 - ch / 2);
      if (top) cell(p, c, d, 'a', 0, 0, f1(Y0 + top / 2), 550, top, { wideMin: 300, ws: 52 });
      cell(p, c, d, 'o', 0, cx, yA, cw, ch, { wideMin: 300 }); cell(p, c, d, 'o', 1, cx, yB, cw, ch, { wideMin: 300 });
      if (F.hasN) qslot(p, c, d, cx, yM, cw, mh, { ans: true, r: 34, st: { wideMin: 300 } }); else qmark(p, d, cx, yM, 31);
      drawAt(p.line(tx, yA, tx, yB, { sw: 5, stroke: TL_(.4) }), p, T_.tA, tu(.4));
      [yA, yM, yB].forEach((y, k) => drawAt(p.line(tx - 22, y, tx + 22, y, { sw: 3, stroke: TL_(.45) }), p, f3(T_.tA + tu(.08 + .06 * k)), tu(.2)));
      const fin = F.ai === 0 ? yA : F.ai === 1 ? yB : yM, kn = mvG(p, { y: swayK(d, k => k ? yB : yA, yM, fin), o: fadeIn(T_.tQ, .12) });
      kn.circle(tx, 0, 30, { fill: C.fill, sw: 5, stroke: C.ink }); if (F.answered) litOn(kn, T_.H).circle(tx, 0, 30, { fill: TA(.35), sw: 5, stroke: ACC1 }); }); });

  /* answer only (no options, nothing asked) → one slot over the whole box; nothing at all → a big "?" */
  const onlyN = (p, c, d) => { const F = QD(d); if (F.hasO || F.hasA) return false; if (F.hasN) qslot(p, c, d, 0, 0, 550, 480, { ans: true, r: 120 }); else qmark(p, d, 0, 0, 130); return true; };
  /* the chosen option shows again, lit, in a slot of its own on H (card or circle); o.n: an answer apart lands there too */
  function echo(p, c, d, x, y, w, h, o = {}) { const F = QD(d), T_ = QT(d), H = T_.H, circ = o.shape === 'circ', rr = Math.min(w, h) / 2, rx = o.rx ?? Math.min(34, h * .18);
    if (F.hasN) { if (o.n) cell(p, c, d, 'n', 0, x, y, w, h, Object.assign({ wideMin: 999, solid: true }, circ ? { shape: 'circ' } : {}, o.st || {})); return; }
    if (F.ai < 0) return; const X = F.op[F.ai], t = f3(H - tu(.04)), body = (q, st) => circ ? q.circle(x, y, rr, st) : R(q, f1(x - w / 2), f1(y - h / 2), w, h, rx, st);
    body(atG(p, f3(t - tu(.02))), BK); const g = popAt(p, x, y, t); body(g, LIT2()); ripple(p, x, y, f1(Math.min(w, h) * .55), f3(H + tu(.04)));
    const lab = LBL(X), hasI = !!picOf(X), iw = f1(Math.min(h * (lab ? (circ ? .42 : .5) : .66), w * (circ ? .55 : .7), 260));
    if (hasI) put(p, c, { icon: X.icon }, x, lab ? f1(y - h * (circ ? .13 : .1)) : y, iw, null, { t: f3(t + tu(.04)), punch: H });
    if (lab) txt(atG(p, f3(t + tu(.12))), lab, x, f1(y + h * (circ ? .27 : .3)), { size: o.ws || 48, maxW: w * (circ ? .74 : .86), weight: 800, color: C.ink, wrap: 'mid' });
    else if (!hasI) txt(g, X.label, x, f1(y + 22), { size: 64, maxW: w * .8, weight: 800, color: C.ink, wrap: 'mid' }); }
  /* a closed path with rounded corners (no sharp corners — style.md 7) */
  function rpoly(pts, r) { const n = pts.length; let s = '';
    for (let k = 0; k < n; k++) { const P = pts[k], A = pts[(k + n - 1) % n], B = pts[(k + 1) % n], u = (Q) => { const dx = Q[0] - P[0], dy = Q[1] - P[1], l = Math.hypot(dx, dy); return [dx / l, dy / l]; }, a = u(A), b = u(B);
      s += (k ? ' L ' : 'M ') + f1(P[0] + a[0] * r) + ' ' + f1(P[1] + a[1] * r) + ' Q ' + P[0] + ' ' + P[1] + ' ' + f1(P[0] + b[0] * r) + ' ' + f1(P[1] + b[1] * r); }
    return s + ' Z'; }

  /* 04 staggered cards (B05 s3 "การ์ดซ้อน", laid as steps): the two options on a diagonal (top-left, bottom-right); what is asked fills the
     bottom-left corner, the "?" (or the answer's slot) the top-right. No options → what is asked and the answer's slot overlap on the diagonal */
  sd(3, 'stagger', 'การ์ดเหลื่อม', (d, c) => { const F = QD(d);
    art(c, p => { if (onlyN(p, c, d)) return;
      if (!F.hasO) { const X = F.ab, lab = LBL(X), ix = -168, iy = lab ? -150 : -128, iw = lab ? 150 : 170;
        qthing(p, c, d, 'a', 0, -105, -90, 300, { draw: (q, st) => R(q, X0, Y0, 340, 300, 34, st), style: OUT(), ix, iy, iw, lw: 200 }); if (lab) qword(p, d, 'a', 0, ix, -32, { size: 46, maxW: 200 });
        qslot(p, c, d, 105, 90, 340, 300, { ans: true, solid: true, r: 90 }); return; }
      const w = 340, h = 230, ya = -125, yb = 125;
      cell(p, c, d, 'o', 0, f1(X0 + w / 2), ya, w, h, { wideMin: 300 });
      if (F.hasA) cell(p, c, d, 'o', 1, f1(X1 - w / 2), yb, w, h, { wideMin: 300 }); else cell(p, c, d, 'o', 1, 0, yb, 550, h, { wideMin: 300 });
      const cw = 550 - w - 16, cx = f1(X1 - cw / 2);
      if (F.hasN) qslot(p, c, d, cx, ya, cw, h, { ans: true, r: 56 }); else qmark(p, d, cx, ya, 66);
      if (F.hasA) cell(p, c, d, 'a', 0, f1(X0 + cw / 2), yb, cw, h, { wideMin: 999, wrap: 'mid' }); }); });

  /* 05 the "?" holds the answer's place (B06 s1/s2 "ช่อง ? รอคำตอบ", square): what is asked and the options in a row of small cards on top;
     a big tile below waits with a big "?"; on H the answer (or the chosen option) fills the tile, lit; no answer → the "?" lights */
  sd(3, 'qtile', 'ช่อง ? รอคำตอบ', (d, c) => { const F = QD(d), L = ITEMS(d).filter(([r]) => r !== 'n');
    art(c, p => { if (onlyN(p, c, d)) return; const n = L.length, th = n > 1 ? 190 : 170;
      rowCells(p, c, d, X0, X1, f1(Y0 + th / 2), th, 14, { wideMin: n > 1 ? 999 : 300, wrap: 'mid', ws: n > 2 ? 38 : 44, cap: 80 }, L);
      const ty = f1((Y0 + th + 16 + Y1) / 2), tH = Y1 - (Y0 + th + 16);
      qslot(p, c, d, 0, ty, 550, tH, { ans: true, r: 100, st: { wideMin: 300, ws: 56 } }); echo(p, c, d, 0, ty, 550, tH, { ws: 56 }); }); });

  /* 06 split on the diagonal (B05 s3 "สามเหลี่ยมทแยง"): one option in each triangle, a disc on the diagonal holds the "?" (or the answer's slot);
     the halves glow in turn while in doubt, the chosen half lights on H. What is asked runs across the top. No options → what is asked | the answer */
  sd(3, 'diag', 'สามเหลี่ยมทแยง', (d, c) => { const F = QD(d), T_ = QT(d);
    art(c, p => { if (onlyN(p, c, d)) return;
      const top = F.hasO && F.hasA ? 104 : 0, ya = Y0 + (top ? top + 14 : 0), yb = Y1, w = 550, h = yb - ya, g = 18;
      if (top) cell(p, c, d, 'a', 0, 0, f1(Y0 + top / 2), 550, top, { wideMin: 300, ws: 50 });
      const TLp = rpoly([[X0, ya], [X1 - g * 1.6, ya], [X0, yb - g * 1.6]], 30), BRp = rpoly([[X1, ya + g * 1.6], [X1, yb], [X0 + g * 1.6, yb]], 30);
      const side = (role, i, k) => { const X = role === 'a' ? F.ab : role === 'o' ? F.op[i] : F.an; if (!X) return; const lab = LBL(X), hasI = !!picOf(X), D = k ? BRp : TLp;
        const iw = f1(Math.min(h * (lab ? .36 : .42), 170)), ix = f1(k ? X1 - w * (lab ? .22 : .27) : X0 + w * (lab ? .22 : .27)), iy = f1(k ? yb - h * (lab ? .44 : .3) : ya + h * (lab ? .44 : .3));
        qthing(p, c, d, role, i, ix, iy, iw, { draw: (q, st) => q.path(D, st), style: OUT(), litStyle: LIT2(), ix, iy, iw, lw: w * .5, rip: false, clip: false });
        if (lab) qword(p, d, role, i, k ? X1 - 26 : X0 + 26, k ? yb - 36 : f1(ya + 62), { size: 48, maxW: w * .56, anchor: k ? 'end' : 'start', wrap: null }); };
      const mx = 0, my = f1((ya + yb) / 2);
      if (F.hasO) { side('o', 0, 0); side('o', 1, 1); if (F.hasN) { atG(p, f3(T_.tA)).circle(mx, my, 86, BK); outlineIn(p, p.circle(mx, my, 86, OUT(.5)), T_.tA); qmark(p, d, mx, my, 50, { plain: true }); cell(p, c, d, 'n', 0, mx, my, 172, 172, { shape: 'circ', wideMin: 999, solid: true, noWord: true }); }
        else qmark(p, d, mx, my, 54, { keep: true }); return; }
      side('a', 0, 0);   /* no options: the answer's triangle waits with a "?" */
      const ix = f1(X1 - w * .27), iy = f1(yb - h * .3); outlineIn(p, p.path(BRp, OUT(.4)), T_.tA); qmark(p, d, ix, iy, 70, { plain: true }); if (F.hasN) side('n', 0, 1); }); });

  /* 07 a big "?" (B06 s2 "? ใหญ่ + คอลัมน์"): a big disc with the "?" on the left, what is asked and the options stacked on the right; on H the "?"
     gives way to the answer — the chosen option (or the answer apart) lands in the disc, lit; no answer → the "?" lights */
  sd(3, 'bigq', '? ใหญ่ + คอลัมน์', (d, c) => { const F = QD(d), T_ = QT(d), L = ITEMS(d).filter(([r]) => r !== 'n');
    art(c, p => { if (onlyN(p, c, d)) return; const R0 = 128, qx = f1(X0 + R0 + 2);
      atG(p, f3(T_.tA)).circle(qx, 0, R0, BK); outlineIn(p, p.circle(qx, 0, R0, OUT(.5)), T_.tA); qmark(p, d, qx, 0, 112, { plain: true, keep: false });
      echo(p, c, d, qx, 0, R0 * 2, R0 * 2, { shape: 'circ', n: true, ws: 42 });
      const x0 = f1(qx + R0 + 22), cw = X1 - x0; colCells(p, c, d, f1(x0 + cw / 2), Y0, Y1, cw, 14, { wideMin: 999, wrap: 'mid', ws: L.length > 2 ? 38 : 44 }, L); }); });

  /* 08 a dial (B06 s2 "หน้าปัดลังเล", square): the options in two cards on top, a dial below — its needle sways between them while in doubt and
     settles on the answer (answer apart → straight up, to the middle slot where the "?" was). No options → what is asked | the answer's slot */
  sd(3, 'dial', 'หน้าปัดลังเล', (d, c) => { const F = QD(d), T_ = QT(d);
    art(c, p => { if (onlyN(p, c, d)) return;
      const top = F.hasO && F.hasA ? 100 : 0, ca = Y0 + (top ? top + 14 : 0), cb = 92, ch = cb - ca, cy = f1((ca + cb) / 2), mid = F.hasN && F.hasO, cw = mid ? 180 : 226, cx = f1(X1 - cw / 2), hx = 0, hy = 236, r = 128;
      if (top) cell(p, c, d, 'a', 0, 0, f1(Y0 + top / 2), 550, top, { wideMin: 300, ws: 50 });
      if (F.hasO) { cell(p, c, d, 'o', 0, -cx, cy, cw, ch, { wideMin: 999, wrap: 'mid' }); cell(p, c, d, 'o', 1, cx, cy, cw, ch, { wideMin: 999, wrap: 'mid' });
        if (mid) qslot(p, c, d, 0, cy, 550 - 2 * cw - 28, ch, { ans: true, r: 44, st: { wideMin: 999, wrap: 'mid' } }); else qmark(p, d, 0, cy, 44, { keep: true }); }
      else { cell(p, c, d, 'a', 0, -cx, cy, cw, ch, { wideMin: 999, wrap: 'mid' }); qslot(p, c, d, cx, cy, cw, ch, { ans: true, st: { wideMin: 999, wrap: 'mid' } }); }
      const ang = x => f1(Math.atan2(x - hx, hy - cy) * 180 / Math.PI), A0 = ang(-cx), A1 = ang(cx);
      drawAt(p.path(`M ${f1(hx + r * Math.sin(rad(A0 - 8)))} ${f1(hy - r * Math.cos(rad(A0 - 8)))} A ${r} ${r} 0 0 1 ${f1(hx + r * Math.sin(rad(A1 + 8)))} ${f1(hy - r * Math.cos(rad(A1 + 8)))}`, { sw: 5, stroke: TL_(.45) }), p, T_.tA, tu(.45));
      for (let k = 0; k <= 10; k++) { const a = A0 - 8 + k * (A1 - A0 + 16) / 10; tick(atG(p, f3(T_.tA + tu(.02 * k))), hx, hy, a - 90, r - 24, r - 8, { sw: 2.4, stroke: TL_(.45) }); }
      const fin = F.hasO ? (F.ai === 0 ? A0 : F.ai === 1 ? A1 : 0) : (F.hasN ? A1 : 0), start = F.hasO ? 0 : A0;
      const nd = mvG(p, { px: hx, py: hy, r: swayK(d, k => k ? A1 : A0, start, fin), o: fadeIn(T_.tA, .06) }); nd.line(hx, hy, hx, hy - r + 26, { sw: 7, stroke: C.ink });
      if (F.answered) litOn(nd, T_.H).line(hx, hy, hx, hy - r + 26, { sw: 7, stroke: ACC1 });
      popAt(p, hx, hy, T_.tA).circle(hx, hy, 22, { fill: C.ink, sw: 0, stroke: 'none' }); }); });

  /* 09 a two-part selector (B05 s1 "แถบเลือกสองช่อง", square): what is asked fills a big card on top with the "?" in its corner; a segmented bar
     below holds the options — a highlight slides from one part to the other while in doubt and stops on the answer (answer apart = a third part) */
  sd(3, 'segment', 'แถบเลือกสองช่อง', (d, c) => { const F = QD(d), T_ = QT(d);
    art(c, p => { if (onlyN(p, c, d)) return;
      const sh = 196, sy = f1(Y1 - sh / 2), th = 480 - sh - 16, ty = f1(Y0 + th / 2), topSlot = !F.hasA && F.hasN && F.hasO;
      if (F.hasA) { outlineIn(p, R(p, X0, Y0, 550, th, 36, OUT(.5)), T_.tA); cell(p, c, d, 'a', 0, F.hasO ? -30 : 0, ty, F.hasO ? 490 : 550, th, { shape: 'float', wideMin: 300, ws: 60, cap: 200 }); if (F.hasO) qmark(p, d, 222, f1(Y0 + 52), 38, { keep: F.ai >= 0 }); }
      else if (topSlot) qslot(p, c, d, 0, ty, 550, th, { ans: true, r: 90, st: { wideMin: 300, ws: 56 } });   /* nothing asked: the big card is the answer's slot */
      else { outlineIn(p, R(p, X0, Y0, 550, th, 36, OUT(.5)), T_.tA); qmark(p, d, 0, ty, 100, { plain: true, keep: true }); }
      if (!F.hasO) { qslot(p, c, d, 0, sy, 550, sh, { ans: true, r: 64, rx: 40, st: { wideMin: 300, ws: 46 } }); return; }   /* no options: the bar is one slot that waits */
      const parts = [['o', 0], ['o', 1]].concat(F.hasN && !topSlot ? [['n', 0]] : []), n = parts.length, sw = 550 / n;
      outlineIn(p, R(p, X0, f1(Y1 - sh), 550, sh, 40, OUT(.55)), T_.tA);
      for (let k = 1; k < n; k++) drawAt(p.line(f1(X0 + k * sw), f1(Y1 - sh + 26), f1(X0 + k * sw), f1(Y1 - 26), { sw: 2.4, stroke: TL_(.4) }), p, f3(T_.tA + tu(.06 * k)), tu(.25));
      const px = k => f1(X0 + sw / 2 + k * sw), fin = F.ai >= 0 ? px(F.ai) : n > 2 ? px(2) : px(0);
      const th2 = mvG(p, { x: swayK(d, k => px(k), px(0), fin), o: [[0, 0], [T_.tD0, 0], [f3(T_.tD0 + tu(.12)), 1], [T_.H, 1], [f3(T_.H + tu(.2)), F.answered ? 0 : .5]] });
      R(th2, f1(-sw / 2 + 10), f1(Y1 - sh + 10), f1(sw - 20), sh - 20, 30, { fill: TA(.1), sw: 3, stroke: TL_(.6) });
      parts.forEach(([r, i], k) => { if (r === 'o') cell(p, c, d, r, i, px(k), sy, f1(sw - 20), sh - 20, { shape: 'float', wideMin: 999, wrap: 'mid', ws: 42 });
        else qslot(p, c, d, px(k), sy, f1(sw - 20), sh - 20, { ans: true, r: 44, rx: 30, st: { shape: 'float', wideMin: 999, wrap: 'mid', ws: 42 } }); }); }); });

  /* 10 a poll (B06 "โพล", upright): what is asked on top with the "?"; one tall bar per option — the bars rise and trade places while in doubt
     (smooth, no bounce), on H the answer's bar fills to the top and lights, the other sinks and dims; no answer → both stop level, the "?" lights */
  sd(3, 'poll', 'โพลแท่งตั้ง', (d, c) => { const F = QD(d), T_ = QT(d);
    art(c, p => { if (onlyN(p, c, d)) return;
      const top = 100, hy = f1(Y0 + top / 2);
      if (F.hasA && !F.hasO) cell(p, c, d, 'a', 0, 0, hy, 550, top, { wideMin: 300, ws: 50, cap: 90 });
      else if (F.hasA) { cell(p, c, d, 'a', 0, -40, hy, 470, top, { wideMin: 300, ws: 50, cap: 90 }); qmark(p, d, 236, hy, 36, { keep: true }); } else qmark(p, d, 0, hy, 46, { plain: true, keep: true });
      if (!F.hasO) { qslot(p, c, d, 0, f1((Y0 + top + 14 + Y1) / 2), 550, Y1 - Y0 - top - 14, { ans: true, r: 90, st: { wideMin: 300, ws: 56 } }); return; }
      const L = [['o', 0], ['o', 1]].concat(F.hasN ? [['n', 0]] : []), n = L.length, g = 16, cw = (550 - (n - 1) * g) / n, lh = 150, b0 = Y0 + top + 14, b1 = Y1 - lh - 12, bw = f1(Math.min(170, cw * .6));
      L.forEach(([r, i], k) => { const x = f1(X0 + cw / 2 + k * (cw + g)), win = (r === 'o' && F.ai === i) || r === 'n', lose = r === 'o' && F.ai >= 0 && F.ai !== i;
        const t0 = r === 'o' ? T_.tO(i) : T_.tA; outlineIn(p, R(p, f1(x - bw / 2), b0, bw, b1 - b0, 26, OUT(.35)), t0);
        const fin = win ? 1 : lose ? .3 : r === 'n' ? 1 : .55, rise = f3(Math.min(t0 + tu(.4), T_.tD0 - .01));
        const K = r === 'o' ? [[0, .001], [t0, .001], [rise, .5, 'io']].concat(swayK(d, kk => kk === i ? .82 : .38, .5, fin).slice(1)) : [[0, .001], [T_.H, .001], [f3(T_.H + tu(.4)), 1, 'io']];
        const bar = mvG(p, { px: x, py: b1, sy: K, o: lose ? [[0, 1], [T_.H, 1], [f3(T_.H + tu(.3)), .4, 'io']] : undefined }), inset = 9, D = (q, st) => R(q, f1(x - bw / 2 + inset), f1(b0 + inset), bw - inset * 2, f1(b1 - b0 - inset * 2), 18, st);
        D(bar, { fill: TL_(.55), sw: 0, stroke: 'none' }); if (win) D(litOn(bar, T_.H), { fill: ACC1, sw: 0, stroke: 'none' });
        const ly = f1(Y1 - lh / 2); if (r === 'o') cell(p, c, d, r, i, x, ly, cw, lh, { shape: 'float', wideMin: 999, wrap: 'mid', ws: 40 }); else qslot(p, c, d, x, ly, cw, lh, { ans: true, r: 40, st: { shape: 'float', wideMin: 999, wrap: 'mid', ws: 40 } }); }); }); });
  /* ---------- SIZE 4 · 400 × 635 (tall) — user after size 3: "ออกแบบให้มันมีหน้าตาที่แตกต่างขึ้นหน่อย สร้างสรรค์ขึ้นแต่ยังเรียบๆอยู่ มีอนิเมชั่นที่ต่างไป
     … เพราะรู้สึกว่ามันเหมือนๆกับหมวดอื่นเลย" → lay-outs that come from the question itself (the "?" glyph, a search being typed, a wait that fills),
     with motions no other category uses (light flowing along a line, typing, a ring filling). Pilot: 3 designs. ---------- */
  const X4 = 195, Y4 = 312;

  /* 01 the "?" is the picture: a tall hollow "?" draws itself; what is asked sits in its hook, the two options either side of its stem, and its dot
     is the answer's place. While in doubt the options glow in turn; on H a light runs down the "?" into the dot and the answer appears there
     (no answer → the dot itself lights) */
  sd(4, 'glyph', 'ตัว ? เป็นโครง', (d, c) => { const F = QD(d), T_ = QT(d), H = T_.H;
    art(c, p => { const hx = 0, hy = -190, Rh = 102, P = a => [f1(hx + Rh * Math.cos(rad(a))), f1(hy + Rh * Math.sin(rad(a)))], [sx, sy] = P(160), [ex, ey] = P(32);
      const D = `M ${sx} ${sy} A ${Rh} ${Rh} 0 1 1 ${ex} ${ey} C ${f1(ex - 8)} ${f1(ey + 50)} 0 ${hy + 120} 0 ${hy + 170} L 0 ${hy + 216}`, tw_ = 40, dy = 212, dr = 98;
      const o1 = p.path(D, { sw: tw_, stroke: TL_(.7) }), i1 = p.path(D, { sw: tw_ - 7, stroke: C.fill }); [o1, i1].forEach(e => drawAt(e, p, T_.tA, tu(.6)));
      const flow = p.path(D, { sw: tw_ - 7, stroke: TA(.4) }); on(flow, p, 0, { draw: [[0, 0], [f3(H - tu(.42)), 0], [H, 1, 'io']] });   /* the light runs down the "?" */
      const gd = popAt(p, 0, dy, f3(T_.tA + tu(.5))); gd.circle(0, dy, dr, { fill: C.fill, sw: 4, stroke: TL_(.7) });
      if (F.answered) echo(p, c, d, 0, dy, dr * 2, dr * 2, { shape: 'circ', n: true, ws: 36 });
      else { litOn(gd, H).circle(0, dy, dr, { fill: TA(.4), sw: 5, stroke: ACC1 }); ripple(p, 0, dy, dr + 10, f3(H + tu(.04))); }
      if (F.hasA) cell(p, c, d, 'a', 0, hx, f1(hy - 8), 140, 164, { shape: 'float', wideMin: 999, cap: 74, ws: 34, wrap: 'down' });
      if (F.hasO) { cell(p, c, d, 'o', 0, -116, 0, 152, 186, { shape: 'float', wideMin: 999, cap: 86, ws: 34, wrap: 'down' }); cell(p, c, d, 'o', 1, 122, 0, 144, 186, { shape: 'float', wideMin: 999, cap: 86, ws: 34, wrap: 'down' }); } }); });

  /* 02 a search being typed: the field on top — what is asked is typed in letter by letter behind a blinking caret (no thing asked → "A หรือ B");
     the suggestions drop in below it as a list, a highlight steps between them while in doubt and stops on the answer; no answer → the "?" button lights */
  sd(4, 'type', 'ช่องค้นหาพิมพ์คำ', (d, c) => { const F = QD(d), T_ = QT(d), H = T_.H;
    art(c, p => { const fh = 104, fy = f1(-Y4 + fh / 2), tx0 = -X4 + 92, qx = X4 - 48, mw = qx - 40 - tx0;
      R(atG(p, f3(T_.tA - tu(.02))), -X4, -Y4, X4 * 2, fh, fh / 2, BK); outlineIn(p, R(p, -X4, -Y4, X4 * 2, fh, fh / 2, OUT(.65)), T_.tA); put(p, c, { icon: 'search' }, -X4 + 50, fy, 60, null, { t: T_.tA });
      let str = F.ab ? (F.ab.label || '') : F.hasO ? [F.op[0].label, F.op[1].label].filter(Boolean).join(' หรือ ') : '';
      if (str && tw(p, str, 44) > mw * 1.2) str = (!F.ab && F.hasO) || !picOf(F.ab) ? (F.ab ? str : '') : '';   /* too long for one line → no typing; the icon speaks */
      if (F.ab && !str && picOf(F.ab)) put(p, c, { icon: F.ab.icon }, tx0 + 36, fy, 70, null, { t: f3(T_.tA + tu(.2)) });
      if (str) { const sz = 44, wT = Math.min(mw, tw(p, str, sz)), t0 = f3(T_.tA + tu(.25)), t1 = f3(Math.min(T_.tQ, t0 + tu(.05) * Math.max(4, [...str].length)));
        txt(atG(p, T_.tA), str, tx0, f1(fy + 15), { size: sz, maxW: mw, weight: 800, color: C.ink, anchor: 'start' });
        const cg = clipG(p, tx0 - 6, fy - 40, mw + 14, 80), cov = mvG(cg, { x: [[0, 0], [t0, 0], [t1, f1(wT + 8)]] });
        R(cov, tx0 - 4, fy - 38, wT + 40, 76, 0, { fill: C.fill, sw: 0, stroke: 'none' });
        const bl = [[0, 0], [T_.tA, 0], [f3(T_.tA + tu(.05)), 1]]; for (let t = t1 + tu(.25); t < H - tu(.1); t += tu(.5)) bl.push([f3(t), 1], [f3(t + .02), 0], [f3(t + tu(.25)), 0], [f3(t + tu(.25) + .02), 1]); bl.push([H, bl[bl.length - 1][1]], [f3(H + tu(.1)), 0]);
        mvG(cov, { o: bl }).line(tx0 - 2, fy - 26, tx0 - 2, fy + 26, { sw: 3.4, stroke: C.ink }); }
      qmark(p, d, qx, fy, 36, { keep: F.ai >= 0 });
      const top = -Y4 + fh + 16, rows = (F.hasO ? [['o', 0], ['o', 1]] : []).concat(F.hasN || !F.hasO ? [['n', 0]] : []), n = rows.length;
      const pad = 12, rh = (Y4 - top - pad * 2 - (n - 1) * 10) / n, ry = k => f1(top + pad + rh / 2 + k * (rh + 10));
      outlineIn(p, R(p, -X4, top, X4 * 2, Y4 - top, 30, OUT(.45)), f3(T_.tO(0) - tu(.06)));
      rows.forEach(([r, i], k) => { const y = ry(k), w = X4 * 2 - pad * 2; if (k) drawAt(p.line(-X4 + 24, f1(y - rh / 2 - 5), X4 - 24, f1(y - rh / 2 - 5), { sw: 2, stroke: TL_(.3) }), p, T_.tO(0), tu(.3));
        if (r === 'n') qslot(p, c, d, 0, y, w, rh, { ans: true, r: f1(Math.min(56, rh * .3)), st: { shape: 'float', wideMin: 300, ws: 46 } });
        else cell(p, c, d, r, i, 0, y, w, rh, { shape: 'float', wideMin: 300, ws: 46, cap: 150 }); });
      if (F.hasO) { const fin = F.ai >= 0 ? ry(F.ai) : F.hasN ? ry(n - 1) : ry(0), hl = mvG(p, { y: swayK(d, k => ry(k), ry(0), fin), o: [[0, 0], [T_.tD0, 0], [f3(T_.tD0 + tu(.1)), 1], [H, 1], [f3(H + tu(.2)), 0]] });
        R(hl, -X4 + pad, f1(-rh / 2), X4 * 2 - pad * 2, f1(rh), 24, { fill: TA(.1), sw: 3, stroke: TL_(.6) }); } }); });

  /* 03 a wait that fills: what is asked on top, a big ring with the "?" inside; while in doubt the ring fills slowly (the options below glow in turn),
     it closes on H and the answer appears inside it (no answer → the ring closes round a lit "?") */
  sd(4, 'ring', 'วงโหลดรอคำตอบ', (d, c) => { const F = QD(d), T_ = QT(d), H = T_.H;
    art(c, p => { const top = F.hasA ? 112 : 0, ob = F.hasO ? 176 : 0, za = -Y4 + (top ? top + 16 : 0), zb = Y4 - (ob ? ob + 16 : 0), cy = f1((za + zb) / 2), Rr = f1(Math.min(X4 - 12, (zb - za) / 2 - 8));
      if (top) cell(p, c, d, 'a', 0, 0, f1(-Y4 + top / 2), X4 * 2, top, { wideMin: 300, ws: 48, cap: 90 });
      drawAt(p.circle(0, cy, Rr, { sw: 12, stroke: TL_(.16) }), p, T_.tA, tu(.4));
      const arc = p.path(arcD(0, cy, Rr, 1), { sw: 12, stroke: C.ink }); on(arc, p, 0, { draw: [[0, 0], [T_.tQ, 0], [T_.tD1, .8, 'io'], [f3(H + tu(.22)), 1, 'io']] });
      const lit = p.path(arcD(0, cy, Rr, 1), { sw: 12, stroke: ACC1 }); on(lit, p, 0, { o: [[0, 0], [f3(H + tu(.2)), 0], [f3(H + tu(.3)), 1]] });
      qmark(p, d, 0, cy, f1(Rr * .62), { plain: true, keep: false });
      echo(p, c, d, 0, cy, f1((Rr - 26) * 2), f1((Rr - 26) * 2), { shape: 'circ', n: true, ws: 42 });
      if (ob) rowCells(p, c, d, -X4, X4, f1(Y4 - ob / 2), ob, 14, { wideMin: 999, wrap: 'mid', ws: 40, cap: 90 }, [['o', 0], ['o', 1]]); }); });
  /* the doubt turns as opacity keys between lo and 1 (1 before the doubt), landing on fin after H */
  const qTurnK = (T_, i, lo, fin) => { const K = [[0, 1], [T_.tD0, 1]]; let t = T_.tD0, k = 0, cur = 1;
    while (t + tu(.36) <= T_.tD1) { cur = (k % 2) === i ? 1 : lo; K.push([f3(t + tu(.16)), cur, 'io']); t += tu(.36); k++; }
    K.push([f3(Math.max(t, T_.tD1)), cur], [f3(T_.H + tu(.25)), fin, 'io']); return K; };
  const scaleK = (K, a) => K.map(([t, v, e]) => e ? [t, f3(v * a), e] : [t, f3(v * a)]);
  /* the thing that answers: the chosen option, or the answer apart (null = no answer) */
  const ansOf = F => F.ai >= 0 ? F.op[F.ai] : F.an;

  /* 04 fill in the blank: what is asked on top, a blank line in the middle that waits with a faint "?"; while in doubt each option shows as a
     faint ghost in the blank, in turn (the options below glow with it); on H the answer fills the blank and its line lights */
  sd(4, 'blank', 'เติมคำในช่องว่าง', (d, c) => { const F = QD(d), T_ = QT(d), H = T_.H;
    art(c, p => { const top = F.hasA ? 150 : 0, ob = F.hasO ? 176 : 0, za = -Y4 + (top ? top + 16 : 0), zb = Y4 - (ob ? ob + 16 : 0), by = f1(zb - 30), iw = f1(Math.min(200, (by - za) * .56)), cy = f1(za + iw / 2 + 8);
      if (top) cell(p, c, d, 'a', 0, 0, f1(-Y4 + top / 2), X4 * 2, top, { wideMin: 300, ws: 52, cap: 110 });
      drawAt(p.line(-160, by, 160, by, { sw: 6, stroke: TL_(.55) }), p, T_.tA, tu(.4));
      const qy = f1((za + by) / 2), qg = mvG(p, { o: [[0, 0], [T_.tQ, 0], [f3(T_.tQ + tu(.12)), .45]].concat(F.hasO ? [[T_.tD0, .45], [f3(T_.tD0 + tu(.1)), 0]] : []).concat(F.answered ? [[f3(H - tu(.1)), F.hasO ? 0 : .45], [H, 0]] : [[f3(H - tu(.1)), F.hasO ? 0 : .45], [H, 1]]) });
      txt(qg, '?', 0, f1(qy + (by - za) * .22), { size: f1((by - za) * .62), weight: 800, color: F.answered ? C.ink : ACC1 });
      if (F.hasO) [0, 1].forEach(i => { const X = F.op[i], gk = scaleK(doubtK(T_, i), .38);
        if (picOf(X)) put(p, c, { icon: X.icon }, 0, cy, iw, null, { t: T_.tA, o: gk }); else txt(mvG(p, { o: gk }), X.label, 0, f1(by - 16), { size: 60, maxW: 320, weight: 800, color: C.ink }); });
      const X = ansOf(F);
      if (X) { const lab = LBL(X); if (picOf(X)) put(p, c, { icon: X.icon }, 0, lab ? cy : f1((za + by) / 2), lab ? iw : f1(Math.min(240, (by - za) * .78)), null, { t: f3(H - tu(.04)), punch: H });
        const tw0 = lab || (!picOf(X) && X.label); if (tw0) txt(atG(p, f3(H + tu(.06))), tw0, 0, f1(by - 16), { size: lab ? 52 : 64, maxW: 320, weight: 800, color: C.ink });
        ripple(p, 0, f1((za + by) / 2), f1((by - za) * .45), f3(H + tu(.04))); }
      litOn(p, H).line(-160, by, 160, by, { sw: 6, stroke: ACC1 });
      if (ob) rowCells(p, c, d, -X4, X4, f1(Y4 - ob / 2), ob, 14, { wideMin: 999, wrap: 'mid', ws: 40, cap: 90 }, [['o', 0], ['o', 1]]); }); });

  /* 05 a timed quiz: the question card on top, a time bar under it that runs down while in doubt, the options as answer buttons; the bar runs out
     on H and the chosen button lights (no answer → time is up and the "?" lights) */
  sd(4, 'timer', 'จับเวลาตอบ', (d, c) => { const F = QD(d), T_ = QT(d), H = T_.H;
    art(c, p => { const top = F.hasA ? 196 : 150, ty = f1(-Y4 + top / 2), by = f1(-Y4 + top + 30);
      if (F.hasA) { cell(p, c, d, 'a', 0, -24, ty, X4 * 2 - 48, top, { shape: 'float', wideMin: 300, ws: 54, cap: 130 }); outlineIn(p, R(p, -X4, -Y4, X4 * 2, top, 34, OUT(.55)), T_.tA); qmark(p, d, X4 - 40, f1(-Y4 + 40), 28, { keep: F.ai >= 0 }); }
      else { outlineIn(p, R(p, -X4, -Y4, X4 * 2, top, 34, OUT(.55)), T_.tA); qmark(p, d, 0, ty, 58, { plain: true, keep: true }); }
      outlineIn(p, R(p, -X4, by - 13, X4 * 2, 26, 13, OUT(.45)), T_.tA);
      const bar = mvG(p, { px: -X4 + 6, py: by, sx: [[0, 1], [T_.tQ, 1], [H, .001]], o: fadeIn(T_.tA, .1) }); R(bar, -X4 + 6, by - 7, X4 * 2 - 12, 14, 7, { fill: TL_(.75), sw: 0, stroke: 'none' });
      const a0 = by + 30, L = (F.hasO ? [['o', 0], ['o', 1]] : []).concat(F.hasN || !F.hasO ? [['n', 0]] : []), n = L.length, rh = (Y4 - a0 - (n - 1) * 14) / n;
      L.forEach(([r, i], k) => { const y = f1(a0 + rh / 2 + k * (rh + 14));
        if (r === 'o') cell(p, c, d, r, i, 0, y, X4 * 2, rh, { shape: 'pill', wideMin: 300, ws: 46, cap: 110 });
        else qslot(p, c, d, 0, y, X4 * 2, rh, { ans: true, rx: n > 1 ? rh / 2 : 34, r: f1(Math.min(70, rh * .3)), st: { shape: n > 1 ? 'pill' : 'card', wideMin: 300, ws: 50 } }); }); }); });

  /* 06 the answer opens out: a header with what is asked, a "?" and a chevron; the options sit under it; on H the chevron turns, a panel opens
     down from the header with the answer in it, pushing the options to the bottom (the chosen one lit) */
  sd(4, 'faq', 'กางคำตอบ', (d, c) => { const F = QD(d), T_ = QT(d), H = T_.H, t1 = f3(H + tu(.42));
    art(c, p => { const hh = 126, hy = f1(-Y4 + hh / 2), ob = F.hasO ? 170 : 0, pT = -Y4 + hh + 12, pB = Y4 - (ob ? ob + 14 : 0), oyF = f1(Y4 - ob / 2), oy0 = f1((pT + Y4) / 2), dy0 = f1(oy0 - oyF);
      R(atG(p, f3(T_.tA - tu(.02))), -X4, -Y4, X4 * 2, hh, 30, BK); outlineIn(p, R(p, -X4, -Y4, X4 * 2, hh, 30, OUT(.65)), T_.tA);
      if (F.hasA) cell(p, c, d, 'a', 0, -44, hy, 290, hh, { shape: 'float', wideMin: 250, ws: 46, cap: 84 }); else qmark(p, d, -40, hy, 44, { plain: true, keep: true });
      if (F.hasA) qmark(p, d, X4 - 104, hy, 26, { keep: true });
      mvG(p, { px: X4 - 44, py: hy, r: [[0, 0], [H, 0], [t1, 180, 'io']], o: fadeIn(T_.tA, .1) }).path(`M ${X4 - 60} ${hy - 7} L ${X4 - 44} ${hy + 9} L ${X4 - 28} ${hy - 7}`, { sw: 4.4, stroke: C.ink });
      const pn = mvG(p, { px: 0, py: pT, sy: [[0, .001], [H, .001], [t1, 1, 'io']], o: [[0, 0], [H, 0], [f3(H + tu(.04)), 1]] });
      R(pn, -X4, pT, X4 * 2, pB - pT, 30, F.answered ? { fill: TA(.1), sw: 4, stroke: ACC1 } : { fill: TL_(.05), sw: 3, stroke: TL_(.55) });
      const X = ansOf(F), py = f1((pT + pB) / 2), ph = pB - pT, ta = f3(t1 - tu(.1));
      if (X) { const lab = LBL(X), iw = f1(Math.min(ph * (lab ? .5 : .66), 220)); if (picOf(X)) put(p, c, { icon: X.icon }, 0, lab ? f1(py - ph * .12) : py, iw, null, { t: ta });
        const s0 = lab || (!picOf(X) && X.label); if (s0) txt(atG(p, f3(ta + tu(.1))), s0, 0, f1(lab ? py + ph * .3 : py + 22), { size: lab ? 50 : 66, maxW: 340, weight: 800, color: C.ink, wrap: 'mid' }); ripple(p, 0, py, f1(ph * .4), f3(t1)); }
      else txt(atG(p, ta), '?', 0, f1(py + ph * .2), { size: f1(Math.min(200, ph * .55)), weight: 800, color: ACC1 });
      if (ob) [0, 1].forEach(i => { const w = (X4 * 2 - 14) / 2, x = f1(-X4 + w / 2 + i * (w + 14)), K = { px: x, py: oyF, y: [[0, dy0], [H, dy0], [t1, 0, 'io']], o: fadeIn(T_.tO(i), .12) }, Xo = F.op[i], lab = LBL(Xo);
        qthing(p, c, d, 'o', i, x, oyF, Math.min(w, ob), { K, draw: (q, st) => R(q, f1(x - w / 2), f1(oyF - ob / 2), f1(w), ob, 30, st), style: OUT(), litStyle: LIT2(), ix: x, iy: lab ? f1(oyF - ob * .14) : oyF, iw: f1(Math.min(ob * (lab ? .5 : .62), 100)), lw: w * .86, rip: false });
        if (lab) qword(p, d, 'o', i, x, f1(oyF + ob * .34), { g: mvG(p, { y: K.y }), size: 40, maxW: w - 24, wrap: 'mid' }); }); }); });

  /* 07 a picker wheel: what is asked on top; below, the options roll up through a selection band while in doubt (one step per turn) and stop on
     the answer — an answer apart, or a "?" when there is none, rolls in last */
  sd(4, 'reel', 'วงล้อเลือก', (d, c) => { const F = QD(d), T_ = QT(d), H = T_.H;
    art(c, p => { const top = F.hasA ? 150 : 0;
      if (top) cell(p, c, d, 'a', 0, 0, f1(-Y4 + top / 2), X4 * 2, top, { wideMin: 300, ws: 52, cap: 110 });
      const za = -Y4 + (top ? top + 16 : 0);
      if (!F.hasO) { qslot(p, c, d, 0, f1((za + Y4) / 2), X4 * 2, Y4 - za, { ans: true, r: 90, st: { wideMin: 300, ws: 54 } }); return; }
      const wy = f1((za + Y4) / 2), gap = 150, bh = 132, steps = []; let t = T_.tD0; while (t + tu(.36) <= T_.tD1) { steps.push(f3(t)); t += tu(.36); }
      const last = 1 + steps.length, want = F.ai >= 0 ? F.ai : null, finalJ = want != null && last % 2 === want ? last : last + 1, special = want == null, tF0 = f3(Math.max(t, T_.tD1)), tF1 = f3(H + tu(.12));
      const band = tt => { let b = 1; steps.forEach(ts => { b += sm((tt - ts) / tu(.28)); }); if (finalJ > last) b += sm((tt - tF0) / (tF1 - tF0)); return b; };
      outlineIn(p, R(p, -X4, za, X4 * 2, Y4 - za, 30, OUT(.3)), T_.tA);
      const TS = []; for (let u = 0; u <= tF1 + tu(.3); u += .04) TS.push(f3(u)); if (TS[TS.length - 1] < tF1) TS.push(tF1);
      const keysOf = j => { const t0 = j <= 2 ? T_.tO(Math.min(1, Math.max(0, j - 1))) : T_.tA, Y = [], O = [];
        TS.forEach(u => { const off = (j - band(u)) * gap, a = Math.max(0, Math.min(1, 1 - Math.abs(j - band(u)) * .64)), app = Math.max(0, Math.min(1, (u - t0) / tu(.14))); Y.push([u, f1(off)]); O.push([u, f3(a * app)]); });
        return { px: 0, py: wy, y: Y, o: O }; };
      const LS = LIT2();
      for (let j = 0; j <= finalJ + 1; j++) { const K = keysOf(j);
        if (j === finalJ && special) { if (F.hasN) { const X = F.an, lab = LBL(X); qthing(p, c, d, 'n', 0, 0, wy, bh, { K, draw: (q, st) => st === LS ? R(q, -X4 + 10, f1(wy - bh / 2), X4 * 2 - 20, bh, 26, st) : null, style: {}, litStyle: LS, ix: lab ? -110 : 0, iy: wy, iw: lab ? 96 : 110, lw: 320, rip: false, io: K.o });
            if (lab) qword(p, d, 'n', 0, -45, f1(wy + 17), { g: mvG(p, { y: K.y, o: K.o }), size: 48, maxW: 225, anchor: 'start', t: f3(H - tu(.04)) }); }
          else { const g = mvG(p, K); txt(g, '?', 0, f1(wy + 34), { size: 100, weight: 800, color: C.ink }); txt(litOn(g, H), '?', 0, f1(wy + 34), { size: 100, weight: 800, color: ACC1 }); }
          continue; }
        const i = j % 2, X = F.op[i], lab = LBL(X);
        qthing(p, c, d, 'o', i, 0, wy, bh, { K, draw: (q, st) => st === LS ? R(q, -X4 + 10, f1(wy - bh / 2), X4 * 2 - 20, bh, 26, st) : null, style: {}, litStyle: LS, ix: lab ? -110 : 0, iy: wy, iw: lab ? 96 : 110, lw: 320, rip: false, io: K.o });
        if (lab) qword(p, d, 'o', i, -45, f1(wy + 17), { g: mvG(p, { y: K.y, o: K.o }), size: 48, maxW: 225, anchor: 'start' }); }
      drawAt(p.path(`M ${-X4 + 10} ${f1(wy - bh / 2 + 26)} Q ${-X4 + 10} ${f1(wy - bh / 2)} ${-X4 + 36} ${f1(wy - bh / 2)} L ${X4 - 36} ${f1(wy - bh / 2)} Q ${X4 - 10} ${f1(wy - bh / 2)} ${X4 - 10} ${f1(wy - bh / 2 + 26)} M ${-X4 + 10} ${f1(wy + bh / 2 - 26)} Q ${-X4 + 10} ${f1(wy + bh / 2)} ${-X4 + 36} ${f1(wy + bh / 2)} L ${X4 - 36} ${f1(wy + bh / 2)} Q ${X4 - 10} ${f1(wy + bh / 2)} ${X4 - 10} ${f1(wy + bh / 2 - 26)}`, { sw: 3.4, stroke: TL_(.8) }), p, T_.tA, tu(.4));
      ripple(p, 0, wy, 150, f3(tF1)); }); });

  /* 08 a line looks for the answer: what is asked on top, the options below; while in doubt a line reaches out from the question to one option,
     draws back, reaches to the other …; on H it reaches the answer and stays, lit (an answer apart sits at the bottom, the line runs down between) */
  sd(4, 'link', 'ลากเส้นหาคำตอบ', (d, c) => { const F = QD(d), T_ = QT(d), H = T_.H;
    art(c, p => { const aH = 176, aY = f1(-Y4 + aH / 2), sy = -Y4 + aH, nH = F.hasN ? 170 : 0, nY = f1(Y4 - nH / 2), oH = F.hasN ? 190 : 230, oY = F.hasO ? (F.hasN ? f1((sy + Y4 - nH) / 2) : f1(Y4 - oH / 2)) : 0, ow = 182;
      if (F.hasA) cell(p, c, d, 'a', 0, 0, aY, 300, aH, { wideMin: 999, cap: 96, ws: 42, wrap: 'mid' }); else qmark(p, d, 0, aY, 64, { keep: true });
      popAt(p, 0, sy, T_.tA).circle(0, sy, 9, { fill: C.ink, sw: 0, stroke: 'none' });
      const path = i => i === 'n' ? `M 0 ${sy} L 0 ${f1(nY - nH / 2)}` : (() => { const x = i ? X4 - ow / 2 : -X4 + ow / 2, ty = f1(oY - oH / 2); return `M 0 ${sy} C 0 ${f1(sy + 60)} ${x} ${f1(ty - 60)} ${x} ${ty}`; })();
      const fin = F.ai >= 0 ? F.ai : F.hasN ? 'n' : null;
      if (F.hasO) [0, 1].forEach(i => { const K = [[0, 0]]; let t = T_.tD0, k = 0; while (t + tu(.36) <= T_.tD1) { if (k % 2 === i) K.push([f3(t), 0], [f3(t + tu(.15)), 1, 'io'], [f3(t + tu(.32)), 0, 'io']); t += tu(.36); k++; }
        if (fin === i) K.push([f3(H - tu(.12)), 0], [f3(H + tu(.16)), 1, 'io']); on(p.path(path(i), { sw: 4, stroke: TL_(.6) }), p, 0, { draw: K }); });
      if (fin != null) { const e = p.path(path(fin), { sw: 5, stroke: ACC1 }); on(e, p, 0, { draw: [[0, 0], [f3(H - tu(.12)), 0], [f3(H + tu(.16)), 1, 'io']] }); }
      if (F.hasA && F.hasO) qmark(p, d, 0, f1((sy + oY - oH / 2) / 2), 46, { keep: false });
      if (F.hasO) { cell(p, c, d, 'o', 0, f1(-X4 + ow / 2), oY, ow, oH, { wideMin: 999, wrap: 'mid', ws: 40, cap: 92 }); cell(p, c, d, 'o', 1, f1(X4 - ow / 2), oY, ow, oH, { wideMin: 999, wrap: 'mid', ws: 40, cap: 92 }); }
      if (F.hasN || !F.hasO) { const h2 = F.hasO ? nH : f1(Y4 - sy - 80), y2 = f1(Y4 - h2 / 2); if (!F.hasO && F.hasN) on(p.path(`M 0 ${sy} L 0 ${f1(y2 - h2 / 2)}`, { sw: 5, stroke: ACC1 }), p, 0, { draw: [[0, 0], [f3(H - tu(.12)), 0], [f3(H + tu(.16)), 1, 'io']] });
        qslot(p, c, d, 0, y2, X4 * 2, h2, { ans: true, r: f1(Math.min(80, h2 * .3)), st: { wideMin: 300, ws: 48 } }); } }); });

  /* 09 the question as words: what is asked in big type with its "?" after it, the options as big words with their icons, "หรือ" between;
     while in doubt the words brighten in turn; on H a line draws under the answer (an answer apart comes in under them) and the other word dims */
  sd(4, 'words', 'ประโยคคำถาม', (d, c) => { const F = QD(d), T_ = QT(d), H = T_.H;
    art(c, p => { const A = F.ab, al = A && A.label, ai = A && picOf(A);
      if (A) { const dy2 = F.hasO ? 0 : 50; if (ai) put(p, c, { icon: A.icon }, 0, (al ? -238 : -212) + dy2, al ? 120 : 160, null, { t: T_.tA });
        if (al) { const sz = 64, w = Math.min(290, tw(p, al, sz)); txt(atG(p, f3(T_.tA + tu(.1))), al, -34, -110 + dy2, { size: sz, maxW: 290, weight: 800, color: C.ink, wrap: 'mid' }); qmark(p, d, f1(Math.min(150, -34 + w / 2 + 46)), -130 + dy2, 40, { plain: true, keep: true }); }
        else qmark(p, d, 140, -212, 46, { plain: true, keep: true }); }
      else qmark(p, d, 0, -200, 110, { plain: true, keep: true });
      const rowY = F.hasO ? (F.hasN ? [-6, 128] : [10, 178]) : [], X = ansOf(F);
      const word = (Xo, y, ok, tIn, keyOf) => { const lab = Xo.label, hasI = !!picOf(Xo), mw = hasI ? 270 : 360, two = lab && tw(p, lab, 60) > mw * 1.25, sz = two ? 46 : 60, wx = hasI && lab ? -90 : 0, an = hasI && lab ? 'start' : 'middle', w = lab ? Math.min(mw, two ? mw : tw(p, lab, sz)) : 0;
        if (hasI) put(p, c, { icon: Xo.icon }, lab ? -148 : 0, f1(y - 20), lab ? 84 : 120, null, { t: tIn, o: keyOf ? [[0, 0], [tIn, 0], [f3(tIn + tu(.1)), 1]].concat(keyOf.slice(2)) : undefined });
        if (lab) txt(mvG(atG(p, tIn), keyOf ? { o: keyOf } : null), lab, wx, f1(y + 2), { size: sz, maxW: mw, weight: 800, color: C.ink, anchor: an, wrap: two ? 'mid' : null });
        const x0 = lab ? (an === 'start' ? -190 : -w / 2 - 10) : -70, x1 = lab ? (an === 'start' ? wx + w + 8 : w / 2 + 10) : 70, uy = f1(y + (lab ? (two ? 52 : 26) : 50));
        if (ok) { const e = p.line(f1(x0), uy, f1(x1), uy, { sw: 7, stroke: ACC1 }); on(e, p, 0, { draw: [[0, 0], [f3(H - tu(.04)), 0], [f3(H + tu(.24)), 1, 'io']] }); } };
      if (F.hasO) { [0, 1].forEach(i => word(F.op[i], rowY[i], F.ai === i, T_.tO(i), qTurnK(T_, i, .45, F.ai >= 0 && F.ai !== i ? .35 : 1)));
        txt(atG(p, T_.tO(1)), 'หรือ', 0, f1((rowY[0] + rowY[1]) / 2 + 12), { size: 34, weight: 600, color: C.soft }); }
      if (F.hasN && F.hasO) { word(F.an, 262, true, f3(H - tu(.06)), null); ripple(p, 0, 262, 150, f3(H + tu(.04))); }
      else if (F.hasN) { const X = F.an, lab = X.label, hasI = !!picOf(X), uy = 262;   /* no options: the answer fills the blank under the question — big icon, its word on the line */
        drawAt(p.line(-160, uy, 160, uy, { sw: 5, stroke: TL_(.45) }), p, T_.tA, tu(.4)); on(p.line(-160, uy, 160, uy, { sw: 7, stroke: ACC1 }), p, 0, { draw: [[0, 0], [f3(H - tu(.04)), 0], [f3(H + tu(.24)), 1, 'io']] });
        if (hasI) put(p, c, { icon: X.icon }, 0, lab ? 108 : 150, lab ? 170 : 210, null, { t: f3(H - tu(.06)), punch: H });
        if (lab || !hasI) txt(atG(p, f3(H + tu(.04))), lab, 0, f1(uy - 20), { size: hasI ? 58 : 72, maxW: 340, weight: 800, color: C.ink }); ripple(p, 0, 150, 160, f3(H + tu(.04))); }
      else if (!F.hasO) { drawAt(p.line(-160, 262, 160, 262, { sw: 5, stroke: TL_(.45) }), p, T_.tA, tu(.4));   /* nothing answers: a faint "?" waits on the blank and lights on H */
        const g = mvG(p, { o: [[0, 0], [T_.tQ, 0], [f3(T_.tQ + tu(.12)), .35], [T_.H, .35], [f3(T_.H + tu(.12)), 1]] }); txt(g, '?', 0, 240, { size: 170, weight: 800, color: ACC1 }); ripple(p, 0, 180, 120, f3(T_.H + tu(.04))); } }); });

  /* 10 zoom in on the answer: six tiles — what is asked, the two options and "?" tiles (the unknown); while in doubt the options glow in turn;
     on H the answer's tile grows to fill the whole box (an answer apart comes out of a "?" tile; no answer → that "?" grows, lit) */
  sd(4, 'zoom', 'ซูมเข้าคำตอบ', (d, c) => { const F = QD(d), T_ = QT(d), H = T_.H, tz = f3(H + tu(.42));
    art(c, p => { const tw2 = 190, th = 200, P = [[-99, -210], [99, -210], [-99, 0], [99, 0], [-99, 210], [99, 210]], outK = t => [[0, 0], [t, 0], [f3(t + tu(.1)), 1], [H, 1], [f3(H + tu(.16)), 0]];
      const slot = [F.hasA ? ['a', 0] : null, null, F.hasO ? ['o', 0] : null, F.hasO ? ['o', 1] : null, null, null], src = F.ai >= 0 ? 2 + F.ai : 5, [sx, sy] = P[src];
      slot.forEach((s, k) => { const [x, y] = P[k], t = s ? (s[0] === 'a' ? T_.tA : T_.tO(s[1])) : f3(T_.tA + tu(.06 * k)), g = mvG(p, { o: outK(t) });
        R(g, f1(x - tw2 / 2), f1(y - th / 2), tw2, th, 30, s ? { fill: C.fill, sw: 2.8, stroke: TL_(.55) } : { fill: C.fill, sw: 2.4, stroke: TL_(.25) });
        if (!s) { txt(g, '?', x, f1(y + 30), { size: 86, weight: 800, color: TL_(.32) }); return; }
        const X = s[0] === 'a' ? F.ab : F.op[s[1]], lab = LBL(X), ok = outK(t);
        if (s[0] === 'o') { const lt = sub(g); on(lt, p, 0, { o: doubtK(T_, s[1]) }); R(lt, f1(x - tw2 / 2), f1(y - th / 2), tw2, th, 30, { fill: TA(.12), sw: 3, stroke: TL_(.6) }); }
        if (picOf(X)) put(p, c, { icon: X.icon }, x, lab ? f1(y - 26) : y, lab ? 96 : 120, null, { t, o: ok });
        if (lab) txt(g, lab, x, f1(y + 62), { size: 36, maxW: 170, weight: 800, color: C.ink }); else if (!picOf(X)) txt(g, X.label, x, f1(y + 18), { size: 48, maxW: 170, weight: 800, color: C.ink, wrap: 'mid' }); });
      /* the tile grows into the whole box about the point that keeps it inside the box all the way (its own corner side) */
      const kx = f3(tw2 / (X4 * 2)), ky = f3(th / (Y4 * 2)), Px = f1(sx / (1 - kx)), Py = f1(sy / (1 - ky));
      const Z0 = mvG(p, { px: Px, py: Py, sx: [[0, kx], [H, kx], [tz, 1, 'io']], sy: [[0, ky], [H, ky], [tz, 1, 'io']], o: [[0, 0], [f3(H - tu(.02)), 0], [H, 1]] });
      const X = ansOf(F), tc = f3(tz - tu(.14)); R(Z0, -X4, -Y4, X4 * 2, Y4 * 2, 34, BK); R(Z0, -X4, -Y4, X4 * 2, Y4 * 2, 34, X ? LIT2() : { fill: TA(.1), sw: 5, stroke: ACC1 });
      if (X) { const lab = LBL(X); if (picOf(X)) put(p, c, { icon: X.icon }, 0, lab ? -50 : 0, lab ? 250 : 290, null, { t: tc, punch: f3(tz + tu(.02)) });
        const s0 = lab || (!picOf(X) && X.label); if (s0) txt(atG(p, f3(tc + tu(.08))), s0, 0, lab ? 160 : 30, { size: lab ? 64 : 80, maxW: 340, weight: 800, color: C.ink, wrap: 'mid' }); }
      else txt(atG(p, tc), '?', 0, 110, { size: 330, weight: 800, color: ACC1 });
      ripple(p, 0, 0, 230, tz); }); });

  const outlineIn = (p, el, t) => drawAt(el, p, f3(Math.max(0, t - tu(.04))), tu(.34));

  const I = (icon, label) => label ? { icon, label } : { icon };
  const SAMPLES = [
    /* ordered so the designs built round the two options (03–11) get lines that name two options */
    { say: 'ทำไมร้านเงียบขนาดนี้', about: I('store', 'ร้านเงียบ') },
    { say: 'ต้นไม้ไม่โตเพราะอะไร คำตอบคือแดด', about: I('sprout', 'ต้นไม้'), answer: I('sun', 'แดด') },
    { say: 'จะไปทะเลหรือภูเขาดี', options: [I('ship', 'ทะเล'), I('mountain', 'ภูเขา')] },
    { say: 'ลูกค้ายังลังเลว่าซื้อหรือไม่ซื้อ', about: I('user', 'ลูกค้า'), options: [I('package', 'ซื้อ'), I('ban', 'ไม่ซื้อ')] },
    { say: 'นั่งรถเมล์หรือรถไฟ สุดท้ายเลือกรถไฟ', options: [I('bus', 'รถเมล์'), I('train-front', 'รถไฟ')], answer: I('train-front', 'รถไฟ') },
    { say: 'เช้านี้กาแฟหรือน้ำเปล่าดี', options: [I('coffee', 'กาแฟ'), I('glass-water', 'น้ำเปล่า')] },
    { say: 'เขารักหรือไม่รัก', about: I('user', 'เขา'), options: [I('heart', 'รัก'), I('heart-crack', 'ไม่รัก')] },
    { say: 'ทำงานต่อหรือไปนอน ไปนอนดีกว่า', options: [I('laptop', 'ทำงานต่อ'), I('bed', 'ไปนอน')], answer: I('bed', 'ไปนอน') },
    { say: 'เรียนต่อในประเทศหรือต่างประเทศ', about: I('graduation-cap', 'เรียนต่อ'), options: [I('school', 'ในประเทศ'), I('plane', 'ต่างประเทศ')] },
    { say: 'วิ่งตอนเช้าหรือตอนเย็นดี', options: [I('sun', 'ตอนเช้า'), I('moon', 'ตอนเย็น')] },
    { say: 'ไปทางเขาหรือทางป่า สุดท้ายไปทางป่า', about: I('map', 'ทางไหนดี'), options: [I('mountain', 'ทางเขา'), I('trees', 'ทางป่า')], answer: I('trees', 'ทางป่า') },
    { say: 'ลูกจะโตทันเพื่อนไหม', about: I('baby', 'ลูก') },
    { say: 'มันคุ้มจริงหรือเปล่า', about: I('gem', 'คุ้มไหม') },
    { say: 'ทำไมจำไม่ได้สักที', about: I('brain', 'จำไม่ได้') },
    { say: 'รถสตาร์ทไม่ติดเพราะอะไร แบตหมด', about: I('car', 'รถเสีย'), answer: I('battery-low', 'แบตหมด') },
    { say: 'ทำไมนอนไม่หลับ', about: I('moon', 'นอนไม่หลับ') },
    { say: 'ทำไมปลาไม่กิน น้ำเย็นไป', about: I('fish', 'ปลาไม่กิน'), answer: I('thermometer', 'น้ำเย็นไป') },
    { say: 'เงินหายไปไหนหมด', about: I('wallet', 'เงินหายไปไหน') },
    { say: 'เค้กแฟบเพราะอะไร ตีไข่ไม่พอ', about: I('cake', 'เค้กแฟบ'), answer: I('egg', 'ตีไข่ไม่พอ') },
    { say: 'ใครโทรมาตอนตีสาม', about: I('phone', 'ใครโทรมา') },
  ];
  const STRESS = [
    { say: 'about ไม่มีป้าย', about: I('store') },
    { say: 'ตัวเลือกไม่มีป้าย', options: [I('sun'), I('moon')] },
    { say: 'ป้ายยาว 12 ตัว', about: I('house', 'บ้านหลังนี้ดีไหม'), options: [I('heart', 'ซื้อเก็บไว้เลย'), I('clock', 'รอดูไปก่อนนะ')] },
    { say: 'ภาษาอังกฤษ', about: I('rocket', 'Launch now?'), options: [I('zap', 'Fast'), I('shield-check', 'Safe')] },
    { say: 'ไม่มีไอคอน (ป้ายแทนภาพ)', about: { label: 'ทำไม' }, answer: { label: 'เพราะรัก' } },
    { say: 'มีแต่คำตอบ', answer: I('lightbulb', 'ลองใหม่') },
    { say: 'ตัวเลือกไอคอนเดียวกัน', options: [I('clock', 'ตอนนี้'), I('clock', 'พรุ่งนี้')], answer: { label: 'พรุ่งนี้' } },
    { say: 'ชื่อไอคอนที่ไม่มี', about: I('no-such-icon', 'อะไรเนี่ย') },
    { say: 'คำตอบไม่อยู่ในตัวเลือก', options: [I('ship', 'ทะเล'), I('mountain', 'ภูเขา')], answer: I('house', 'อยู่บ้าน') },
    { say: 'ครบทุกช่อง', about: I('users', 'ทีมเรา'), options: [I('rocket', 'ไปต่อ'), I('octagon-alert', 'หยุดก่อน')], answer: I('rocket', 'ไปต่อ') },
    { say: 'ตัวเลขเป็นป้าย', options: [I('timer', '5 นาที'), I('timer', '30 นาที')], answer: { label: '30 นาที' } },
    { say: 'about ภาษาอังกฤษยาว', about: I('laptop', 'Why so slow?') },
    { say: 'คำตอบป้ายยาว', about: I('sprout', 'ต้นไม้'), answer: I('droplets', 'รดน้ำน้อยเกินไป') },
    { say: 'ตัวเลือกป้ายยาว', options: [I('coffee', 'กาแฟใส่นมเยอะ'), I('glass-water', 'น้ำเปล่าธรรมดา')] },
    { say: 'คำตอบไม่มีป้าย', about: I('cloud', 'ฝนจะตกไหม'), answer: I('umbrella') },
    { say: 'อังกฤษ + คำตอบ', options: [I('book', 'Read'), I('tv', 'Watch')], answer: I('book', 'Read') },
    { say: 'about กับคำตอบไอคอนเดียวกัน', about: I('heart', 'ใจเขา'), answer: I('heart', 'ยังรักอยู่') },
    { say: 'ไม่มีป้ายเลยทั้งหมด', about: I('gift'), options: [I('cake'), I('cookie')], answer: I('cake') },
    { say: 'about ไม่มีไอคอน + ตัวเลือก', about: { label: 'ไปไหนดี' }, options: [I('house', 'บ้าน'), I('store', 'ร้าน')] },
    { say: 'about คน + ตัวเลือก', about: I('user', 'แม่'), options: [I('salad', 'สลัด'), I('pizza', 'พิซซ่า')] },
  ];
  const LONGW = 16;
  const glen = s => { s = String(s || '').replace(/\s+/g, ''); try { return [...new Intl.Segmenter('th', { granularity: 'grapheme' }).segment(s)].length; } catch (e) { return s.length; } };
  const thinT = X => X && typeof X === 'object' && X.icon && (G.icons[X.icon] || G.icons[X.icon + '-pro']) && X.label && glen(X.label) > LONGW ? Object.assign({}, X, { label: undefined }) : X;
  function trimLong(d) { if (!d || typeof d !== 'object') return d; const o = Object.assign({}, d); ['about', 'answer'].forEach(k => { if (o[k]) o[k] = thinT(o[k]); }); if (Array.isArray(o.options)) o.options = o.options.map(thinT); return o; }
  G.cats = G.cats || {};
  G.cats.B06S = { S: SZD, SIZES, SAMPLES, STRESS, theme, frame,
    drawS: (k, i, d, c) => { d = trimLong(d); setZ(c); CUR = 's' + k + '-' + SZD[k][i].id; BOX = [SIZES[k].w, SIZES[k].h]; tokens(); EMPTY = false; BLUE = false; SZD[k][i].fn(d || {}, c); }, CLAMPS };
})();
