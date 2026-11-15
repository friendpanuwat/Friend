/* b05t.js — template ชุดฐาน category B05 "ถูกกับผิด" (user 2026-11-14: "เริ่มทำหมวด B05 ได้ ทำออกมาเป็นภาพก่อนจนกว่าผมจะสั่งให้ทำ animation"): 50 designs,
   each its own layout; graphic elements only, our white-glow line style, colours from GL.theme; icon slots ≥ 165, words ≥ 40, marks r ≥ 56; no word chip
   top-left, no arrow badge top-right, no floor line, no numbers. The old trial (20 designs, before the template rules) is in examples/b05t-trial/.
   Header + helpers copied from b04t.js (icons clipped to their own canvas, words wrap rather than shrink under 40).
   GL.cats.B05T.draw(i, data, { x, y, s, at, hit }) — canvas 1000 × 700 centred at (0,0). Data = CutPack B05 (cat_ai.py: "not X but Y — one thing is wrong,
   the other is right"): wrong THING · right THING · texts [wrong, right] (optional — words in place of grey lines). */
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
    cp.id = 'b05tclip' + (++CID); Object.entries({ x, y, width: w, height: h }).forEach(([k, v]) => r.setAttribute(k, v)); cp.appendChild(r);
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
      Object.entries({ x: c.x - 500 * c.s, y: c.y - 350 * c.s, width: 1000 * c.s, height: 700 * c.s }).forEach(([n, v]) => r.setAttribute(n, v)); cp.appendChild(r); (svg.querySelector('defs') || svg).appendChild(cp); ICLIP[k] = { cp }; }
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
    else if (X && X.label) txt(g, X.label, o.ix ?? x, (o.iy ?? y) + 16, { size: Math.max(40, Math.min(56, iw * .3)), maxW: o.lw || iw * 1.15, weight: 800, color: C.ink, wrap: 'mid' });
    else g.circle(o.ix ?? x, o.iy ?? y, 16, DOTF());
    return g; }
  /* side s's words (only when it has an icon): plain (o.pill = in a pill); wrong dims at tN, o.strike = a line through it */
  function cword(p, d, s, x, y, o = {}) { const X = SD(d, s), str = LBL(X); if (!str) return null; const T_ = CT(), w = s === 'w', t = o.t ?? f3((w ? T_.tW : T_.tR) + tu(.14)), sz = o.size || 46;
    if (o.pill) { const mw = o.maxW || 320, wd = Math.min(mw, tw(p, str, sz)) + 60, cx = o.anchor === 'start' ? x + wd / 2 : o.anchor === 'end' ? x - wd / 2 : x;
      pill(o.g || p, str, cx, y, { t, size: sz, maxW: mw, strike: w && o.strike ? f3(Math.max(T_.tN + tu(.04), t + tu(.1))) : undefined }); return null; }
    const g1 = popAt(o.g || p, x, y - sz * .35, t), g = w ? mvG(g1, { o: dimW(T_.tN, .62) }) : g1;
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

  /* 01 ── SWAP (แทนที่ข้างกัน): the wrong drops in, is crossed and dims; a chevron points on and the right drops in beside it, lit */
  variant('swap', 'แทนที่ข้างกัน', (d, c) => { art(c, p => { const T_ = CT(), bs = 236, Y = 50, XW = -252, XR = 252;
    const KW = ent('drop', XW, Y, bs, T_.tW); cbox(p, c, d, 'w', XW, Y, bs, { g: mvG(CL(p), KW), mv: KW }); dust(p, XW, Y + bs / 2, KW.land, 1);
    const KR = ent('drop', XR, Y, bs, T_.tR); cbox(p, c, d, 'r', XR, Y, bs, { g: mvG(CL(p), KR), mv: KR }); dust(p, XR, Y + bs / 2, KR.land, 1);
    const ag = mvG(p, { x: glide(-40, T_.tN, f3(T_.tN + tu(.3))), o: fadeIn(T_.tN, .06) }); chev(ag, -12, Y, 1.3, { sw: 8, stroke: TL_(.6) }); chev(litOn(ag, T_.H), -12, Y, 1.3, { sw: 8, stroke: ACC1 });
    cword(p, d, 'w', XW, Y - bs / 2 - 64, { pill: true, strike: true }); cword(p, d, 'r', XR, Y - bs / 2 - 64, { pill: true });
    marks5(p, cornerB(XW, Y, bs), cornerB(XR, Y, bs)); }); });

  /* 02 ── STRIKE (ขีดฆ่าแล้วเขียนใหม่): two lines one above the other — the wrong word is struck through and dims, the right one is written under it */
  variant('strike', 'ขีดฆ่าแล้วเขียนใหม่', (d, c) => { art(c, p => { const T_ = CT(), bs = 200, BX = -330, YW = -128, YR = 146;
    const KW = ent('left', BX, YW, bs, T_.tW); cbox(p, c, d, 'w', BX, YW, bs, { g: mvG(CL(p), KW), mv: KW }); const KR = ent('left', BX, YR, bs, T_.tR); cbox(p, c, d, 'r', BX, YR, bs, { g: mvG(CL(p), KR), mv: KR });
    cword(p, d, 'w', BX + bs / 2 + 34, YW + 20, { anchor: 'start', size: 60, maxW: 560, wrap: null, strike: true }); cword(p, d, 'r', BX + bs / 2 + 34, YR + 20, { anchor: 'start', size: 60, maxW: 560, wrap: null });
    drawAt(p.path(`M ${BX - 30} ${f1((YW + YR) / 2 - 14)} L ${BX} ${f1((YW + YR) / 2 + 14)} L ${BX + 30} ${f1((YW + YR) / 2 - 14)}`, { sw: 7, stroke: TL_(.6) }), p, f3(T_.tN + tu(.1)), tu(.2));
    marks5(p, corner(BX, YW, bs, -1), corner(BX, YR, bs, -1)); }); });

  /* 03 ── FLIP (พลิกด้าน): the wrong shows big, is crossed and flies off small into the corner slot; the big card flips round to the right one */
  variant('flipcard', 'พลิกด้าน', (d, c) => { art(c, p => { const T_ = CT(), BX = 112, BY = 40, bs = 300, SX = -322, SY = 76, s2 = 176, ta = f3(T_.tN + tu(.4));
    drawAt(R(p, SX - s2 / 2 - 12, SY - s2 / 2 - 12, s2 + 24, s2 + 24, s2 * .3, DASH(.4)), p, tu(.3), tu(.3));
    const P = pathK([[BX, BY], [(BX + SX) / 2, -150], [SX, SY]], T_.tN, ta, [SX, SY]), KW = { px: SX, py: SY, x: P.x, y: P.y, s: [[0, f3(bs / s2)], [T_.tN, f3(bs / s2)], [ta, 1, 'out']], o: fadeIn(T_.tW, .05) };
    cbox(p, c, d, 'w', SX, SY, s2, { g: mvG(p, KW), mv: KW, dimAt: ta });
    const KR = { px: BX, py: BY, sx: [[0, 0], [T_.tR, 0], [f3(T_.tR + tu(.24)), 1.06, 'out'], [f3(T_.tR + tu(.34)), 1, 'soft']], o: fadeIn(T_.tR, .03) }; cbox(p, c, d, 'r', BX, BY, bs, { g: mvG(p, KR), mv: KR });
    cword(p, d, 'r', BX, BY - bs / 2 - 70, { pill: true, maxW: 380 }); cword(p, d, 'w', -462, SY - s2 / 2 - 72, { pill: true, anchor: 'start', maxW: 320, strike: true, t: ta });
    marks5(p, cornerB(SX, SY, s2), corner(BX, BY, bs), 56, ta); }); });

  /* 04 ── STAMPS (ตราประทับ): two tall cards (word, icon, its line of words) — a big ✗ stamps the wrong card, a ✓ the right one */
  variant('stamps', 'ตราประทับ', (d, c) => { art(c, p => { const T_ = CT(), CW = 360, CH = 500, Y = 12, bs = 196;
    [['w', -205], ['r', 205]].forEach(([s, x]) => { const K = ent('rise', x, Y, CH, s === 'w' ? T_.tW : T_.tR), gg = mvG(CL(p), K), iy = Y - 34;
      const g = cbox(p, c, d, s, x, iy, CW, { g: gg, mv: K, draw: (q, st) => R(q, x - CW / 2, Y - CH / 2, CW, CH, 36, st), iw: bs * .72, lw: CW - 60 }); R(g, x - bs / 2, iy - bs / 2, bs, bs, bs * .24, SL(1.8));
      cword(p, d, s, x, Y - CH / 2 + 66, { g, size: 48, maxW: CW - 50 }); cnote(p, d, s, x, iy + bs / 2 + 50, CW - 70, { g, anchor: 'middle' }); });
    marks5(p, [-205 + CW / 2 - 30, Y + CH / 2 - 30], [205 + CW / 2 - 30, Y + CH / 2 - 30], 66); }); });

  /* 05 ── DROP OUT (ตกออกจากช่อง): the wrong sits in the slot, is crossed and falls out tumbling to the floor corner; the right drops into the slot */
  variant('dropout', 'ตกออกจากช่อง', (d, c) => { art(c, p => { const T_ = CT(), SX = 130, SY = -48, bs = 252, WX = -310, WY = 196, s2 = 176, ta = f3(T_.tN + tu(.42));
    drawAt(R(p, SX - bs / 2 - 16, SY - bs / 2 - 16, bs + 32, bs + 32, bs * .3, DASH(.5)), p, tu(.04), tu(.3));
    const P = pathK([[SX, SY], [SX - 160, SY - 120], [WX, WY]], T_.tN, ta, [WX, WY], 24, u => u * u), KW = { px: WX, py: WY, x: P.x, y: P.y, r: [[0, 0], [T_.tN, 0], [ta, -22, 'in'], [f3(ta + tu(.1)), -16, 'out']], s: [[0, f3(bs / s2)], [T_.tN, f3(bs / s2)], [ta, 1]], o: fadeIn(T_.tW, .05) };
    cbox(p, c, d, 'w', WX, WY, s2, { g: mvG(CL(p), KW), mv: KW, dimAt: ta }); dust(p, WX, WY + s2 / 2, ta, 1);
    const KR = ent('drop', SX, SY, bs, T_.tR); cbox(p, c, d, 'r', SX, SY, bs, { g: mvG(CL(p), KR), mv: KR }); dust(p, SX, SY + bs / 2, KR.land, 1);
    cword(p, d, 'r', -60, SY + 16, { anchor: 'end', size: 52, maxW: 360 }); cword(p, d, 'w', WX + s2 / 2 + 26, WY + 18, { anchor: 'start', size: 46, maxW: 300, strike: true, t: ta });
    marks5(p, [f1(WX - s2 / 2 + 10), f1(WY - s2 / 2 - 4)], corner(SX, SY, bs), 56, ta); }); });

  /* 06 ── ERASE (ลบออก): a wide soft swipe rubs the wrong out to a dashed ghost; the right comes in big beside it */
  variant('erase', 'ลบออก', (d, c) => { art(c, p => { const T_ = CT(), WX = -262, WY = -92, s1 = 206, RX = 150, RY = 62, s2 = 282;
    cbox(p, c, d, 'w', WX, WY, s1, { to: .22 }); drawAt(R(p, WX - s1 / 2 - 10, WY - s1 / 2 - 10, s1 + 20, s1 + 20, s1 * .3, DASH(.45)), p, f3(T_.tN + tu(.2)), tu(.2));
    const sw = p.path(`M ${WX - 170} ${WY + 120} L ${WX + 170} ${WY - 120}`, { sw: 70, stroke: TL_(.1) }); on(sw, p, 0, { draw: [[0, 0], [T_.tN, 0], [f3(T_.tN + tu(.24)), 1, 'io']] });
    const KR = ent('pop', RX, RY, s2, T_.tR); cbox(p, c, d, 'r', RX, RY, s2, { g: mvG(p, KR), mv: KR });
    cword(p, d, 'w', WX, WY - s1 / 2 - 62, { pill: true, strike: true, maxW: 300 }); cword(p, d, 'r', RX, RY - s2 / 2 - 64, { pill: true, maxW: 340 });
    marks5(p, cornerB(WX, WY, s1), cornerB(RX, RY, s2)); }); });

  /* 07 ── COVER (แปะทับ): the right card slaps down over the corner of the wrong one, which is crossed and dims behind it */
  variant('cover', 'แปะทับ', (d, c) => { art(c, p => { const T_ = CT(), bs = 262, W_ = [-142, -46], R_ = [132, 70];
    const KW = ent('drop', ...W_, bs, T_.tW); cbox(p, c, d, 'w', ...W_, bs, { g: mvG(CL(p), KW), mv: KW });
    const KR = { px: R_[0], py: R_[1], x: [[0, 600], [T_.tR, 600], [f3(T_.tR + tu(.3)), -16, 'out'], [f3(T_.tR + tu(.4)), 0, 'soft']], r: [[0, 14], [T_.tR, 14], [f3(T_.tR + tu(.3)), 0, 'out']], o: fadeIn(T_.tR, .04) };
    cbox(p, c, d, 'r', ...R_, bs, { g: mvG(CL(p), KR), mv: KR }); ripple(p, R_[0] - bs / 2, R_[1] - 40, 60, f3(T_.tR + tu(.3)));
    cword(p, d, 'w', W_[0], W_[1] - bs / 2 - 62, { pill: true, strike: true, maxW: 340 }); cword(p, d, 'r', R_[0], R_[1] + bs / 2 + 62, { pill: true, maxW: 340 });
    marks5(p, [W_[0] - bs / 2 + 6, W_[1] + bs / 2 - 6], cornerB(...R_, bs)); }); });

  /* 08 ── UPRIGHT SWITCH (สวิตช์ตั้ง): a tall switch — the wrong at the top, the right at the bottom; the lit knob drops from the wrong to the right */
  variant('vswitch', 'สวิตช์ตั้ง', (d, c) => { art(c, p => { const T_ = CT(), TX = -150, YW = -150, YR = 152, bs = 196, TWd = 270;
    R(mvG(p, { px: TX, py: 0, sy: [[0, .2], [tu(.04), .2], [tu(.34), 1.03, 'out'], [tu(.44), 1, 'soft']], o: fadeIn(tu(.04), .06) }), TX - TWd / 2, -300, TWd, 600, TWd / 2, F(3.6));
    cbox(p, c, d, 'w', TX, YW, bs, { shape: 'circ' }); cbox(p, c, d, 'r', TX, YR, bs, { shape: 'circ', rip: false });
    const kg = mvG(p, { y: [[0, YW - YR], [T_.tN, YW - YR], [T_.H, 0, 'in'], [f3(T_.H + tu(.1)), -12, 'out'], [f3(T_.H + tu(.2)), 0, 'soft']], o: fadeIn(tu(.4), .06) }); kg.circle(TX, YR, 116, { sw: 5, stroke: TL_(.55) }); litOn(kg, T_.H).circle(TX, YR, 116, { sw: 6, stroke: ACC1 }); ripple(p, TX, YR, 130, f3(T_.H + tu(.04)));
    cword(p, d, 'w', TX + TWd / 2 + 34, YW + 18, { anchor: 'start', size: 54, maxW: 440, wrap: null, strike: true }); cword(p, d, 'r', TX + TWd / 2 + 34, YR + 18, { anchor: 'start', size: 54, maxW: 440, wrap: null });
    marks5(p, [TX - TWd / 2 - 14, YW - 92], [TX - TWd / 2 - 14, YR + 92]); }); });

  /* 09 ── RADIO (ตัวเลือกวงกลม): two option rows; the choice dot sits on the wrong, it gets a cross, the dot jumps down to the right one */
  variant('radio', 'ตัวเลือกวงกลม', (d, c) => { art(c, p => { const T_ = CT(), YW = -122, YR = 142, RX = -388, BX = -236, bs = 200;
    [['w', YW], ['r', YR]].forEach(([s, y]) => { const t = s === 'w' ? T_.tW : f3(T_.tR - tu(.2)); popAt(p, RX, y, t).circle(RX, y, 48, F(3.6)); cbox(p, c, d, s, BX, y, bs, { t: f3(t + tu(.06)) });
      cword(p, d, s, BX + bs / 2 + 30, y + 20, { anchor: 'start', size: 58, maxW: 500, wrap: null, strike: s === 'w', t: f3(t + tu(.14)) }); });
    const dg = mvG(p, { y: [[0, YW - YR], [T_.tN, YW - YR], [f3(T_.H - tu(.1)), YW - YR], [T_.H, 0, 'in']], o: [[0, 0], [f3(T_.tW + tu(.3)), 0], [f3(T_.tW + tu(.36)), 1], [T_.tN, 1], [f3(T_.tN + tu(.08)), 0], [f3(T_.H - tu(.1)), 0], [T_.H, 1]] }); dg.circle(RX, YR, 24, DOTF());
    const xg = popAt(p, RX, YW, f3(T_.tN + tu(.04))); XX(xg, RX, YW, 1.2); ripple(p, RX, YR, 60, T_.H); }); });

  /* 10 ── NO SIGN (ป้ายห้าม): the wrong sits inside a "no" ring (circle and slash) that draws over it; the right sits in a lit ring beside it */
  variant('nosign', 'ป้ายห้าม', (d, c) => { art(c, p => { const T_ = CT(), Y = 54, XW = -240, XR = 240, bs = 206, RR = 152;
    cbox(p, c, d, 'w', XW, Y, bs); const ng = sub(p); drawAt(ng.circle(XW, Y, RR, { sw: 16, stroke: C.ink }), p, T_.tN, tu(.24)); drawAt(ng.line(f1(XW - RR * .7), f1(Y - RR * .7), f1(XW + RR * .7), f1(Y + RR * .7), { sw: 16, stroke: C.ink }), p, f3(T_.tN + tu(.2)), tu(.16));
    cbox(p, c, d, 'r', XR, Y, bs); drawAt(p.circle(XR, Y, RR, { sw: 10, stroke: TL_(.3) }), p, T_.tR, tu(.3)); const lr = p.circle(XR, Y, RR, { sw: 10, stroke: ACC1 }); on(lr, p, 0, { draw: [[0, 0], [f3(T_.H - tu(.2)), 0], [T_.H, 1, 'io']] });
    cword(p, d, 'w', XW, Y - RR - 64, { pill: true, maxW: 340, strike: true }); cword(p, d, 'r', XR, Y - RR - 64, { pill: true, maxW: 340 });
    marks5(p, null, [f1(XR + RR * .72), f1(Y + RR * .72)]); }); });

  /* 11 ── FORK (ทางแยก): a path rises and splits — the left branch to the wrong is cut by a crossed bar, the right branch lights up to the right one */
  variant('fork', 'ทางแยก', (d, c) => { art(c, p => { const T_ = CT(), bs = 200, W_ = [-262, -126], R_ = [262, -126], B0 = [0, 300], BJ = [0, 120];
    const lp = `M ${B0[0]} ${B0[1]} L ${BJ[0]} ${BJ[1]} C 0 40 ${W_[0]} 60 ${W_[0]} ${W_[1] + bs / 2 + 10}`, rp = `M ${B0[0]} ${B0[1]} L ${BJ[0]} ${BJ[1]} C 0 40 ${R_[0]} 60 ${R_[0]} ${R_[1] + bs / 2 + 10}`;
    drawAt(p.path(lp, { sw: 10, stroke: TL_(.3) }), p, tu(.04), tu(.4)); drawAt(p.path(rp, { sw: 10, stroke: TL_(.3) }), p, tu(.04), tu(.4)); const lr = p.path(rp, { sw: 10, stroke: ACC1 }); on(lr, p, 0, { draw: [[0, 0], [T_.tR, 0], [T_.H, 1, 'io']] });
    const bg = popAt(p, -150, 52, T_.tN); bg.path(`M -205 22 L -95 82`, { sw: 22 }); bg.path(`M -205 22 L -95 82`, { sw: 14, stroke: C.fill });
    cbox(p, c, d, 'w', ...W_, bs); cbox(p, c, d, 'r', ...R_, bs);
    cword(p, d, 'w', W_[0], W_[1] - bs / 2 - 60, { pill: true, strike: true, maxW: 340 }); cword(p, d, 'r', R_[0], R_[1] - bs / 2 - 60, { pill: true, maxW: 340 });
    marks5(p, [-150, 52], cornerB(...R_, bs)); }); });

  /* 12 ── COLUMNS (ตาราง ✗ | ✓): two columns headed by a ✗ and a ✓ — the wrong under the ✗ dims, the right under the ✓ lights */
  variant('columns', 'ตาราง ✗ | ✓', (d, c) => { art(c, p => { const T_ = CT(), CW = 400, CH = 590, Y = 20, bs = 214;
    [['w', -228], ['r', 228]].forEach(([s, x]) => { const K = ent('rise', x, Y, CH, s === 'w' ? T_.tW : T_.tR), gg = mvG(CL(p), K), iy = Y + 10;
      cbox(p, c, d, s, x, iy, CW, { g: gg, mv: K, draw: (q, st) => R(q, x - CW / 2, Y - CH / 2, CW, CH, 40, st), iw: bs * .72, lw: CW - 60, rip: false }); R(gg, x - bs / 2, iy - bs / 2, bs, bs, bs * .24, SL(1.8));
      cword(p, d, s, x, iy + bs / 2 + 72, { g: gg, size: 50, maxW: CW - 50 }); });
    marks5(p, [-228, Y - CH / 2 + 80], [228, Y - CH / 2 + 80], 60); }); });

  /* 13 ── CURVED ARROW (ลูกศรโค้งแทนที่): the wrong up top is struck; a fat curved arrow sweeps down from it to the right one, which lands lit */
  variant('curvearrow', 'ลูกศรโค้งแทนที่', (d, c) => { art(c, p => { const T_ = CT(), W_ = [-300, -142], s1 = 196, R_ = [262, 130], s2 = 250;
    /* (user: "13 แก้ไขลูกศร") the arrow leaves the wrong box's right side, bends over and comes straight down onto the top of the right box;
       its head is a solid triangle that follows the line's end direction (straight down), the line stops at the head's base */
    const x0 = W_[0] + s1 / 2 + 18, y0 = W_[1], tipY = f1(R_[1] - s2 / 2 - 16), baseY = f1(tipY - 50), ap = `M ${x0} ${y0} C ${f1(x0 + 300)} ${y0} ${R_[0]} ${f1(baseY - 170)} ${R_[0]} ${baseY}`;
    const head = `M ${R_[0]} ${tipY} L ${R_[0] - 34} ${baseY} L ${R_[0] + 34} ${baseY} Z`;
    drawAt(p.path(ap, { sw: 18, stroke: TL_(.45) }), p, T_.tN, tu(.3)); const hg = popAt(p, R_[0], baseY, f3(T_.tN + tu(.28))); hg.path(head, { fill: TL_(.45), sw: 3, stroke: TL_(.45) });
    const la = p.path(ap, { sw: 18, stroke: ACC1 }); on(la, p, 0, { draw: [[0, 0], [T_.tR, 0], [f3(T_.H - tu(.1)), 1, 'io']] }); litOn(p, f3(T_.H - tu(.1))).path(head, { fill: ACC1, sw: 3, stroke: ACC1 });
    cbox(p, c, d, 'w', ...W_, s1); const KR = ent('pop', ...R_, s2, T_.tR); cbox(p, c, d, 'r', ...R_, s2, { g: mvG(p, KR), mv: KR });
    cword(p, d, 'w', W_[0], W_[1] + s1 / 2 + 62, { pill: true, maxW: 320, strike: true }); cword(p, d, 'r', R_[0] - s2 / 2 - 26, R_[1] + 18, { anchor: 'end', size: 52, maxW: 330 });
    marks5(p, corner(...W_, s1, -1), cornerB(...R_, s2)); }); });

  /* 14 ── POP (ฟองแตก): the wrong bubble bursts — a dashed ring and sparks are left with its icon dim — the right bubble swells big and lit */
  variant('pop', 'ฟองแตก', (d, c) => { art(c, p => { const T_ = CT(), W_ = [-250, 40], R_ = [220, 30], r1 = 118, r2 = 156;
    const wg = mvG(p, { px: W_[0], py: W_[1], s: [[0, 1], [T_.tN, 1], [f3(T_.tN + tu(.05)), 1.12, 'out'], [f3(T_.tN + tu(.1)), .9]], o: fadeIn(T_.tW, .05).concat([[T_.tN, 1], [f3(T_.tN + tu(.1)), 0]]) }); wg.circle(...W_, r1, F(4));
    drawAt(p.circle(...W_, r1, DASH(.5)), p, f3(T_.tN + tu(.08)), tu(.2)); sparkAt(p, ...W_, r1 + 10, r1 + 50, T_.tN, 10, 0, [], true);
    const X_ = SD(d, 'w'); if (X_ && picOf(X_)) put(p, c, { icon: X_.icon }, ...W_, r1 * 1.3, null, { t: f3(T_.tW + tu(.04)), o: dimW(T_.tN, .4) }); else if (X_) txt(atG(p, T_.tW), X_.label, W_[0], W_[1] + 16, { size: 46, maxW: r1 * 1.6, weight: 800, color: C.mute, wrap: 'mid' });
    const KR = { px: R_[0], py: R_[1], s: [[0, .2], [T_.tR, .2], [f3(T_.tR + tu(.4)), 1.08, 'out'], [f3(T_.tR + tu(.52)), 1, 'soft']], o: fadeIn(T_.tR, .04) }; cbox(p, c, d, 'r', ...R_, r2 * 2, { shape: 'circ', g: mvG(p, KR), mv: KR });
    cword(p, d, 'w', W_[0], W_[1] - r1 - 74, { pill: true, maxW: 320, strike: true }); cword(p, d, 'r', R_[0], R_[1] + r2 + 62, { pill: true, maxW: 340 });
    marks5(p, [f1(W_[0] + r1 * .72), f1(W_[1] + r1 * .72)], [f1(R_[0] + r2 * .72), f1(R_[1] - r2 * .72)]); }); });

  /* 15 ── TABS (แท็บ): two tabs — the page first shows the wrong (its icon, its words); its tab is struck and dims, the right tab lights and the page turns */
  variant('tabs', 'แท็บ', (d, c) => { art(c, p => { const T_ = CT(), TY = -250, TH = 96, TWd = 420, TX = { w: -215, r: 215 }, PY = -182, PH = 470, bs = 240, BX = -240, BY = 52;
    R(mvG(p, upK(0, PY + PH, tu(.06), .3)), -450, PY, 900, PH, 40, F(3.6)); const bx = popAt(p, BX, BY, tu(.2)); R(bx, BX - bs / 2, BY - bs / 2, bs, bs, bs * .24, F(4)); R(litOn(bx, T_.H), BX - bs / 2, BY - bs / 2, bs, bs, bs * .24, LIT2()); ripple(p, BX, BY, bs * .58, f3(T_.H + tu(.04)));
    const ow = [[0, 0], [f3(T_.tW + tu(.2)), 0], [f3(T_.tW + tu(.3)), 1], [T_.tR, 1], [f3(T_.tR + tu(.1)), 0]], orr = [[0, 0], [T_.tR, 0], [f3(T_.tR + tu(.1)), 1]];
    ['w', 'r'].forEach(s => { const x = TX[s], w = s === 'w', X_ = SD(d, s), g0 = mvG(p, { x: glide(w ? -100 : 100, w ? T_.tW : f3(T_.tW + tu(.1)), f3((w ? T_.tW : T_.tW + tu(.1)) + tu(.26))), o: fadeIn(w ? T_.tW : f3(T_.tW + tu(.1)), .05) });
      if (w) R(g0, x - TWd / 2, TY - TH / 2, TWd, TH, TH / 2, BK); const g = w ? mvG(g0, { o: dimW(T_.tN, .45) }) : g0; R(g, x - TWd / 2, TY - TH / 2, TWd, TH, TH / 2, F(3.4));
      if (!w) { R(litOn(g, T_.tR), x - TWd / 2 + 7, TY - TH / 2 + 7, TWd - 14, TH - 14, (TH - 14) / 2, { fill: TA(.2), sw: 0, stroke: 'none' }); R(litOn(g, T_.H), x - TWd / 2, TY - TH / 2, TWd, TH, TH / 2, { sw: 5, stroke: ACC1 }); }
      if (X_ && X_.label) { const e = txt(g, X_.label, x, TY + 16, { size: 46, maxW: TWd - 60, weight: 800, color: C.ink }); if (w) { const bb = e.getBBox(); strikeLine(p, f1(bb.x - 10), f1(bb.y + bb.height * .55), f1(bb.x + bb.width + 10), f1(bb.y + bb.height * .55), f3(T_.tN + tu(.04)), 5); } } else R(g, x - 80, TY - 11, 160, 22, 11, GREY());
      const io = w ? ow : orr, pg = sub(p); on(pg, p, 0, { o: io }); if (X_ && picOf(X_)) put(p, c, { icon: X_.icon }, BX, BY, bs * .72, null, { t: w ? f3(T_.tW + tu(.2)) : T_.tR, o: io, punch: w ? undefined : T_.H });
      else if (X_) txt(pg, X_.label, BX, BY + 18, { size: 54, maxW: bs * .84, weight: 800, color: C.ink, wrap: 'mid' }); cnote(p, d, s, -84, BY - 18, 500, { g: pg, t: 0 }); });
    marks5(p, [TX.w - TWd / 2 - 4, TY], corner(BX, BY, bs)); }); });

  /* 16 ── TOSS (โยนทิ้ง): the wrong sits big in the middle; crossed, it is tossed off spinning to the top corner; the right drops into its place */
  variant('toss', 'โยนทิ้ง', (d, c) => { art(c, p => { const T_ = CT(), R_ = [100, 44], s2 = 286, W_ = [-296, -96], s1 = 182, ta = f3(T_.tN + tu(.4));
    const P = pathK([R_, [-60, -260], W_], T_.tN, ta, W_), KW = { px: W_[0], py: W_[1], x: P.x, y: P.y, r: [[0, 0], [T_.tN, 0], [ta, -22, 'out']], s: [[0, f3(s2 / s1)], [T_.tN, f3(s2 / s1)], [ta, 1, 'out']], o: fadeIn(T_.tW, .05) };
    cbox(p, c, d, 'w', ...W_, s1, { g: mvG(CL(p), KW), mv: KW, dimAt: ta }); const KR = ent('drop', ...R_, s2, T_.tR); cbox(p, c, d, 'r', ...R_, s2, { g: mvG(CL(p), KR), mv: KR }); dust(p, R_[0], R_[1] + s2 / 2, KR.land, 1.3);
    cword(p, d, 'r', R_[0], R_[1] - s2 / 2 - 62, { pill: true, maxW: 380 }); cword(p, d, 'w', W_[0], W_[1] + s1 / 2 + 70, { pill: true, maxW: 300, strike: true, t: ta });
    marks5(p, rotP(W_[0] + s1 / 2 - 6, W_[1] - s1 / 2 + 6, ...W_, -22), cornerB(...R_, s2), 56, ta); }); });

  /* 17 ── CORNER (ย่อเข้ามุม): the wrong shrinks off into the top corner, crossed and dim; the right takes the middle big and lit */
  variant('corner', 'ย่อเข้ามุม', (d, c) => { art(c, p => { const T_ = CT(), R_ = [60, 30], s2 = 330, W_ = [-366, 212], s1 = 168, ta = f3(T_.tN + tu(.36));
    const KW = { px: W_[0], py: W_[1], x: [[0, f1(R_[0] - W_[0])], [T_.tN, f1(R_[0] - W_[0])], [ta, 0, 'io']], y: [[0, f1(R_[1] - W_[1])], [T_.tN, f1(R_[1] - W_[1])], [ta, 0, 'io']], s: [[0, f3(s2 / s1)], [T_.tN, f3(s2 / s1)], [ta, 1, 'io']], o: fadeIn(T_.tW, .05) };
    cbox(p, c, d, 'w', ...W_, s1, { g: mvG(p, KW), mv: KW, dimAt: ta }); const KR = ent('pop', ...R_, s2, T_.tR); cbox(p, c, d, 'r', ...R_, s2, { g: mvG(p, KR), mv: KR });
    cword(p, d, 'w', W_[0] + s1 / 2 + 26, W_[1] + 16, { anchor: 'start', size: 44, maxW: 300, wrap: null, strike: true, t: ta }); cword(p, d, 'r', R_[0] + s2 / 2 + 26, R_[1] + 18, { anchor: 'start', size: 52, maxW: 200 });
    marks5(p, corner(...W_, s1), corner(...R_, s2, -1), 56, ta); }); });

  /* 18 ── SCRATCH (ขีดทับทิ้ง): a scribble scratches the wrong out (it dims); the right sits clean across the diagonal, lit */
  variant('scratch', 'ขีดทับทิ้ง', (d, c) => { art(c, p => { const T_ = CT(), W_ = [-252, -112], s1 = 212, R_ = [252, 120], s2 = 236;
    cbox(p, c, d, 'w', ...W_, s1); const zz = Array.from({ length: 9 }, (_, k) => [f1(W_[0] - s1 / 2 + 20 + k * (s1 - 40) / 8), f1(W_[1] + (k % 2 ? 70 : -70))]); drawAt(p.path(pathOf(zz, false), { sw: 4.4, stroke: C.ink }), p, T_.tN, tu(.3));
    const KR = ent('rise', ...R_, s2, T_.tR); cbox(p, c, d, 'r', ...R_, s2, { g: mvG(CL(p), KR), mv: KR });
    cword(p, d, 'w', W_[0] + s1 / 2 + 28, W_[1] + 18, { anchor: 'start', size: 50, maxW: 340, strike: true }); cword(p, d, 'r', R_[0] - s2 / 2 - 28, R_[1] + 18, { anchor: 'end', size: 52, maxW: 360 });
    marks5(p, corner(...W_, s1, -1), cornerB(...R_, s2)); }); });

  /* 19 ── SPELL CHECK (ตรวจคำ): the wrong word gets a wavy underline; a suggestion card pops under it with the right one, lit and ticked */
  variant('spell', 'ตรวจคำ', (d, c) => { art(c, p => { const T_ = CT(), W_ = [-330, -140], s1 = 186, CX0 = -250, CY0 = -6, CWd = 700, CHt = 262, R_ = [-118, 125], s2 = 194;
    cbox(p, c, d, 'w', ...W_, s1); const e = cword(p, d, 'w', W_[0] + s1 / 2 + 30, W_[1] + 22, { anchor: 'start', size: 60, maxW: 520, wrap: null });
    if (e) { const bb = e.getBBox(), n = Math.max(6, Math.round(bb.width / 26)), wy = f1(bb.y + bb.height + 8), wv = Array.from({ length: n + 1 }, (_, k) => [f1(bb.x + k * bb.width / n), f1(wy + (k % 2 ? 9 : -5))]); drawAt(p.path(pathOf(wv, false), { sw: 5, stroke: C.ink }), p, T_.tN, tu(.3)); }
    const cg = mvG(p, { px: CX0, py: CY0, sy: [[0, 0], [f3(T_.tR - tu(.1)), 0], [f3(T_.tR + tu(.16)), 1.03, 'out'], [f3(T_.tR + tu(.26)), 1, 'soft']], o: fadeIn(f3(T_.tR - tu(.02)), .06) });
    cg.path(`M ${CX0} ${CY0 + 14} L ${CX0 + 30} ${CY0 - 14} L ${CX0 + 60} ${CY0 + 14}`, F(3.4)); R(cg, CX0, CY0 + 12, CWd, CHt, 36, F(3.6));
    cbox(p, c, d, 'r', ...R_, s2); cword(p, d, 'r', R_[0] + s2 / 2 + 30, R_[1] + 20, { anchor: 'start', size: 56, maxW: 380, wrap: null });
    marks5(p, null, [CX0 + CWd - 40, CY0 + 40]); }); });

  /* 20 ── NOTE (แก้ในโน้ต): one note card — the wrong line (icon, word, its line of words) is struck and dims, the right line is written under it */
  variant('note', 'แก้ในโน้ต', (d, c) => { art(c, p => { const T_ = CT(), bs = 188, BX = -336, YW = -132, YR = 150;
    R(mvG(p, { px: 0, py: 300, sy: [[0, 0], [tu(.02), 0], [tu(.32), 1.02, 'out'], [tu(.42), 1, 'soft']], o: fadeIn(tu(.02), .05) }), -456, -296, 912, 596, 40, F(3.6));
    [['w', YW], ['r', YR]].forEach(([s, y]) => { cbox(p, c, d, s, BX, y, bs); const hw = !!LBL(SD(d, s)); if (hw) cword(p, d, s, BX + bs / 2 + 30, y - 18, { anchor: 'start', size: 52, maxW: 600, wrap: null, strike: s === 'w' }); cnote(p, d, s, BX + bs / 2 + 30, hw ? y + 38 : y - 10, 600, { one: true }); });
    marks5(p, corner(BX, YW, bs, -1), corner(BX, YR, bs, -1)); }); });

  /* 21 ── TARGET (เข้าเป้า): the wrong flies wide of the target, crossed; the right lands in the bullseye, lit */
  variant('target', 'เข้าเป้า', (d, c) => { art(c, p => { const T_ = CT(), CX = 150, CY = 30, R1 = 128, R2 = 236, s2 = 212, W_ = [-338, -168], s1 = 170;
    [R2, R1].forEach((r, k) => drawAt(p.circle(CX, CY, r, { sw: k ? 4 : 3, stroke: TL_(k ? .6 : .45) }), p, f3(tu(.02 + .08 * k)), tu(.4)));
    const Pw = pathK([[-620, 200], [-420, -40], W_], T_.tW, f3(T_.tW + tu(.32)), W_), KW = { px: W_[0], py: W_[1], x: Pw.x, y: Pw.y, o: fadeIn(T_.tW, .04) }; cbox(p, c, d, 'w', ...W_, s1, { shape: 'circ', g: mvG(CL(p), KW), mv: KW });
    const Pr = pathK([[-620, 300], [-200, -120], [CX, CY]], T_.tR, f3(T_.tR + tu(.4)), [CX, CY]), KR = { px: CX, py: CY, x: Pr.x, y: Pr.y, o: fadeIn(T_.tR, .04) }; cbox(p, c, d, 'r', CX, CY, s2, { shape: 'circ', g: mvG(CL(p), KR), mv: KR }); ripple(p, CX, CY, 200, f3(T_.H + tu(.1)));
    cword(p, d, 'w', W_[0], W_[1] + s1 / 2 + 62, { pill: true, maxW: 300, strike: true }); cword(p, d, 'r', CX - R2 - 18, CY + 150, { anchor: 'end', size: 50, maxW: 300 });
    marks5(p, [f1(W_[0] + s1 * .36), f1(W_[1] - s1 * .36)], [f1(CX + 90), f1(CY - 90)]); }); });

  /* 22 ── FIT (ช่องพอดี): a slot with a round notch; the wrong piece (a pointed tab) won't fit — it bounces off, crossed; the right piece drops in */
  const notchD = (x, y, s, kind) => { const h = s / 2, r = s * .2, n = s * .16, top = kind === 'tab' ? `L ${f1(x - n)} ${f1(y - h)} L ${x} ${f1(y - h - n * 1.1)} L ${f1(x + n)} ${f1(y - h)}` : `L ${f1(x - n)} ${f1(y - h)} A ${f1(n)} ${f1(n)} 0 0 0 ${f1(x + n)} ${f1(y - h)}`;
    return `M ${f1(x - h + r)} ${f1(y - h)} ${top} L ${f1(x + h - r)} ${f1(y - h)} Q ${f1(x + h)} ${f1(y - h)} ${f1(x + h)} ${f1(y - h + r)} L ${f1(x + h)} ${f1(y + h - r)} Q ${f1(x + h)} ${f1(y + h)} ${f1(x + h - r)} ${f1(y + h)} L ${f1(x - h + r)} ${f1(y + h)} Q ${f1(x - h)} ${f1(y + h)} ${f1(x - h)} ${f1(y + h - r)} L ${f1(x - h)} ${f1(y - h + r)} Q ${f1(x - h)} ${f1(y - h)} ${f1(x - h + r)} ${f1(y - h)} Z`; };
  variant('fit', 'ช่องพอดี', (d, c) => { art(c, p => { const T_ = CT(), S_ = [170, 48], ss = 282, W_ = [-300, 86], s1 = 220;
    drawAt(p.path(notchD(...S_, ss + 26, 'round'), DASH(.5)), p, tu(.04), tu(.4));
    const KW = { px: W_[0], py: W_[1], x: [[0, f1(S_[0] - W_[0])], [T_.tW, f1(S_[0] - W_[0])], [T_.tN, f1(S_[0] - W_[0])], [f3(T_.tN + tu(.34)), 0, 'out']], y: [[0, -500], [T_.tW, -500], [f3(T_.tW + tu(.3)), f1(S_[1] - 30 - W_[1]), 'in'], [T_.tN, f1(S_[1] - 30 - W_[1])], [f3(T_.tN + tu(.34)), 0, 'out']], r: [[0, 0], [T_.tN, 0], [f3(T_.tN + tu(.34)), -12, 'out']], o: fadeIn(T_.tW, .04) };
    cbox(p, c, d, 'w', ...W_, s1, { g: mvG(CL(p), KW), mv: KW, draw: (q, st) => q.path(notchD(...W_, s1, 'tab'), st), iy: W_[1] + 10, dimAt: f3(T_.tN + tu(.2)) });
    const KR = ent('drop', ...S_, ss, T_.tR); cbox(p, c, d, 'r', ...S_, ss, { g: mvG(CL(p), KR), mv: KR, draw: (q, st) => q.path(notchD(...S_, ss, 'round'), st), iy: S_[1] + 14 }); dust(p, S_[0], S_[1] + ss / 2, KR.land, 1.2);
    cword(p, d, 'r', S_[0], S_[1] - ss / 2 - 70, { pill: true, maxW: 380 }); cword(p, d, 'w', W_[0], W_[1] - s1 / 2 - 76, { pill: true, maxW: 300, strike: true });
    marks5(p, rotP(W_[0] + s1 / 2 - 8, W_[1] + s1 / 2 - 8, ...W_, -12), cornerB(...S_, ss), 56, f3(T_.tN + tu(.34))); }); });

  /* 23 ── FILTER (กรวยคัด): the wrong tries the funnel and is thrown back out to the side, crossed; the right slips through and comes out lit below */
  variant('filter', 'กรวยคัด', (d, c) => { art(c, p => { const T_ = CT(), FD = 'M -196 -96 L 196 -96 L 74 62 L 74 112 L -74 112 L -74 62 Z', W_ = [-322, -206], s1 = 176, O_ = [0, 210], s2 = 184, RT = [322, -206];
    drawAt(p.path(FD, F(4.4)), p, tu(.04), tu(.4));
    const KW = { px: W_[0], py: W_[1], x: [[0, 322], [T_.tW, 322], [f3(T_.tN - tu(.3)), 322], [T_.tN, 140, 'in'], [f3(T_.tN + tu(.3)), 0, 'out']], y: [[0, -400], [T_.tW, -400], [f3(T_.tW + tu(.26)), 120, 'in'], [f3(T_.tN - tu(.3)), 120], [T_.tN, 130], [f3(T_.tN + tu(.3)), 0, 'out']], r: [[0, 0], [T_.tN, 0], [f3(T_.tN + tu(.3)), -18, 'out']], o: fadeIn(T_.tW, .04) };
    cbox(p, c, d, 'w', ...W_, s1, { g: mvG(CL(p), KW), mv: KW, dimAt: f3(T_.tN + tu(.1)) });
    const KR = { px: O_[0], py: O_[1], y: [[0, -110], [f3(T_.H - tu(.08)), -110], [f3(T_.H + tu(.18)), 10, 'out'], [f3(T_.H + tu(.28)), 0, 'soft']], o: [[0, 0], [f3(T_.H - tu(.08)), 0], [T_.H, 1]] };
    cbox(p, c, d, 'r', ...O_, s2, { g: mvG(CL(p), KR), mv: KR, t: f3(T_.H - tu(.08)) });
    cword(p, d, 'w', -470, W_[1] + s1 / 2 + 58, { anchor: 'start', size: 46, maxW: 300, wrap: null, strike: true, t: f3(T_.tN + tu(.3)) }); cword(p, d, 'r', O_[0] + s2 / 2 + 30, O_[1] + 18, { anchor: 'start', size: 52, maxW: 330, wrap: null, t: f3(T_.H + tu(.1)) });
    marks5(p, rotP(W_[0] + s1 / 2 - 6, W_[1] - s1 / 2 + 6, ...W_, -18), corner(...O_, s2, -1), 56, f3(T_.tN + tu(.3))); }); });

  /* 24 ── DEAD END (ทางตัน): two lanes — the wrong runs into a wall half way and stops, crossed; the right runs its lane to the end, lit */
  variant('deadend', 'ทางตัน', (d, c) => { art(c, p => { const T_ = CT(), Y = { w: -122, r: 150 }, bs = 176, FX = { w: 20, r: 352 }, WX = 150;
    ['w', 'r'].forEach(s => { const y = Y[s], w = s === 'w', t = w ? T_.tW : T_.tR, LK = { px: -470, py: y, sx: [[0, 0], [f3(w ? tu(.04) : tu(.12)), 0], [f3(w ? tu(.36) : tu(.44)), 1, 'out']], o: fadeIn(w ? tu(.04) : tu(.12), .05) };
      if (w) R(mvG(p, LK), -470, y - 104, 940, 208, 104, BK); R(mvG(w ? mvG(p, { o: dimW(T_.tN, .45) }) : p, LK), -470, y - 104, 940, 208, 104, F(2.8));
      if (!w) R(litOn(p, T_.H), -470, y - 104, 940, 208, 104, { sw: 5, stroke: ACC1 });
      const fx = FX[s], end = w ? T_.tN : T_.H, KX = [[0, f1(-640 - fx)], [t, f1(-640 - fx)], [f3(t + tu(.3)), f1(-320 - fx), 'out'], [f3(end - tu(.3)), f1(-320 - fx)], [end, 0, w ? 'in' : 'io']].concat(w ? [[f3(end + tu(.08)), -14, 'out'], [f3(end + tu(.2)), 0, 'soft']] : []);
      const K = { px: fx, py: y, x: KX, o: fadeIn(t, .04) }; cbox(p, c, d, s, fx, y, bs, { g: mvG(CL(p), K), mv: K });
      cword(p, d, s, fx - bs / 2 - 18, y + 2, { pill: true, anchor: 'end', size: 44, maxW: Math.min(340, f1(fx - bs / 2 - 18 + 450 - 60)), strike: w, g: mvG(CL(p), { x: KX }) }); });
    const wg = popAt(p, WX, Y.w, tu(.4)); R(wg, WX - 16, Y.w - 84, 32, 168, 14, F(3.6)); sparkAt(p, WX - 30, Y.w, 20, 54, T_.tN, 6, 90, [0, 3]);
    marks5(p, [WX + 70, Y.w - 40], cornerB(FX.r, Y.r, bs)); }); });

  /* 25 ── UP / DOWN (ขึ้น-ลง): two rails — the wrong sinks to the bottom of its rail and dims, the right rises to the top of its rail, lit */
  variant('updown', 'ขึ้น-ลง', (d, c) => { art(c, p => { const T_ = CT(), bs = 200, X = { w: -258, r: 258 }, YF = { w: 180, r: -180 };
    ['w', 'r'].forEach((s, i) => { const x = X[s], y = YF[s], w = s === 'w', t = w ? T_.tW : f3(T_.tR - tu(.2)); drawAt(R(p, x - 124, -312, 248, 624, 70, DASH(.45)), p, f3(tu(.02 + .06 * i)), tu(.4));
      if (!w) R(litOn(p, T_.H), x - 124, -312, 248, 624, 70, { sw: 4, stroke: ACC1 }); const mt = w ? T_.tN : f3(T_.H - tu(.3)), K = { px: x, py: y, y: [[0, f1(-y)], [mt, f1(-y)], [f3(mt + tu(.3)), w ? 8 : -8, w ? 'in' : 'io'], [f3(mt + tu(.4)), 0, 'soft']], s: [[0, .2], [t, .2], [f3(t + tu(.24)), 1.06, 'out'], [f3(t + tu(.34)), 1, 'soft']], o: fadeIn(t, .04) };
      cbox(p, c, d, s, x, y, bs, { g: mvG(p, K), mv: K }); cword(p, d, s, w ? x + 134 : x - 134, y + 18, { anchor: w ? 'start' : 'end', size: 50, maxW: 330, wrap: null, strike: w, g: mvG(p, { y: K.y }), t: f3(t + tu(.2)) }); });
    marks5(p, corner(X.w, YF.w, bs, -1), cornerB(X.r, YF.r, bs)); }); });

  /* 26 ── BIG X (กากบาททับทั้งแผ่น): two panels — a huge X is drawn right across the wrong panel, which dims; the right panel lights */
  variant('bigx', 'กากบาททับทั้งแผ่น', (d, c) => { art(c, p => { const T_ = CT(), PW = 400, PH2 = 540, Y = 16, bs = 210;
    [['w', -226], ['r', 226]].forEach(([s, x]) => { const K = ent('drop', x, Y, PH2, s === 'w' ? T_.tW : T_.tR), gg = mvG(CL(p), K), iy = Y - 40;
      const g = cbox(p, c, d, s, x, iy, PW, { g: gg, mv: K, draw: (q, st) => R(q, x - PW / 2, Y - PH2 / 2, PW, PH2, 40, st), iw: bs * .72, lw: PW - 60, rip: s === 'r' }); R(g, x - bs / 2, iy - bs / 2, bs, bs, bs * .24, SL(1.8));
      cword(p, d, s, x, iy + bs / 2 + 70, { g, size: 50, maxW: PW - 50 }); });
    bigX(p, -226, Y, 190, T_.tN, 14); marks5(p, null, [226 + PW / 2 - 34, Y - PH2 / 2 + 34], 62); }); });

  /* 27 ── DIAGONAL (ทแยงแบ่ง): a seam cuts the frame corner to corner — the wrong in the upper half, crossed and dim; the right in the lower half, lit */
  variant('diag', 'ทแยงแบ่ง', (d, c) => { art(c, p => { const T_ = CT(), W_ = [-300, -118], R_ = [300, 122], bs = 224;
    drawAt(p.line(-470, 282, 470, -282, { sw: 3, stroke: TL_(.5) }), p, tu(.02), tu(.36));
    const KW = ent('left', ...W_, bs, T_.tW); cbox(p, c, d, 'w', ...W_, bs, { g: mvG(CL(p), KW), mv: KW }); const KR = ent('right', ...R_, bs, T_.tR); cbox(p, c, d, 'r', ...R_, bs, { g: mvG(CL(p), KR), mv: KR });
    cword(p, d, 'w', -168, -172, { pill: true, anchor: 'start', maxW: 260, strike: true }); cword(p, d, 'r', 168, 176, { pill: true, anchor: 'end', maxW: 260 });
    marks5(p, corner(...W_, bs, -1), cornerB(...R_, bs)); }); });

  /* 28 ── ORBIT OUT (หลุดวง): the wrong circles the middle on a dashed orbit, then is flung off into the corner, crossed; the right takes the centre, lit */
  variant('orbitout', 'หลุดวง', (d, c) => { art(c, p => { const T_ = CT(), CC = [70, 20], RO = 236, s2 = 236, W_ = [-376, -214], s1 = 172;
    drawAt(p.circle(...CC, RO, DASH(.45)), p, tu(.04), tu(.5)); const L = Array.from({ length: 13 }, (_, k) => [f1(CC[0] + RO * Math.cos(rad(160 + 25 * k))), f1(CC[1] + RO * Math.sin(rad(160 + 25 * k)))]);
    const P1 = pathK(L, f3(T_.tW + tu(.1)), T_.tN, W_), last = L[L.length - 1], P2 = pathK([last, [last[0] - 200, last[1] - 260], W_], T_.tN, f3(T_.tN + tu(.36)), W_);
    const KW = { px: W_[0], py: W_[1], x: P1.x.concat(P2.x.slice(2)), y: P1.y.concat(P2.y.slice(2)), o: fadeIn(T_.tW, .05) }; cbox(p, c, d, 'w', ...W_, s1, { shape: 'circ', g: mvG(CL(p), KW), mv: KW, dimAt: f3(T_.tN + tu(.3)) });
    const KR = ent('pop', ...CC, s2, T_.tR); cbox(p, c, d, 'r', ...CC, s2, { shape: 'circ', g: mvG(p, KR), mv: KR });
    cword(p, d, 'w', W_[0], W_[1] + s1 / 2 + 58, { pill: true, maxW: 260, strike: true, t: f3(T_.tN + tu(.36)) }); cword(p, d, 'r', CC[0], CC[1] + s2 / 2 + 62, { pill: true, maxW: 340 });
    marks5(p, [f1(W_[0] + s1 * .36), f1(W_[1] + s1 * .36)], [f1(CC[0] + s2 * .36), f1(CC[1] - s2 * .36)], 56, f3(T_.tN + tu(.36))); }); });

  /* 29 ── CRACK (แตกร้าว): the wrong hexagon cracks down the middle and its halves drift apart, dim; the right hexagon stays whole and lights */
  variant('crack', 'แตกร้าว', (d, c) => { art(c, p => { const T_ = CT(), Y = 40, XW = -236, XR = 236, RH = 140;
    const hv = (x, a) => [f1(x + RH * Math.cos(rad(a))), f1(Y + RH * Math.sin(rad(a)))], zz = x => [[x, Y - RH], [x - 12, Y - 70], [x + 12, Y - 24], [x - 12, Y + 24], [x + 12, Y + 70], [x, Y + RH]];
    const halfL = [hv(XW, -90), hv(XW, -150), hv(XW, 150), hv(XW, 90)].concat(zz(XW).slice(1, -1).reverse()), halfR = [hv(XW, -90)].concat(zz(XW).slice(1, -1), [hv(XW, 90), hv(XW, 30), hv(XW, -30)]);
    [[halfL, -1], [halfR, 1]].forEach(([pts, sd]) => { const g0 = popAt(p, XW, Y, T_.tW), g1 = mvG(g0, { px: XW, py: Y + RH, x: [[0, 0], [T_.tN, 0], [f3(T_.tN + tu(.3)), sd * 18, 'out']], r: [[0, 0], [T_.tN, 0], [f3(T_.tN + tu(.3)), sd * 6, 'out']] }); shape(g1, pts, BK); shape(mvG(g1, { o: dimW(T_.tN, .42) }), pts, F(4)); });
    const X_ = SD(d, 'w'); if (X_ && picOf(X_)) put(p, c, { icon: X_.icon }, XW, Y, 180, null, { t: f3(T_.tW + tu(.04)), o: dimW(T_.tN, .4) }); else if (X_) txt(atG(p, T_.tW), X_.label, XW, Y + 16, { size: 50, maxW: 200, weight: 800, color: C.mute, wrap: 'mid' });
    sparkAt(p, XW, Y, 30, 80, T_.tN, 6, 0, [1, 2, 4, 5]);
    cbox(p, c, d, 'r', XR, Y, RH * 2, { shape: 'hex' }); cword(p, d, 'w', XW, Y - RH - 58, { pill: true, maxW: 320, strike: true }); cword(p, d, 'r', XR, Y - RH - 58, { pill: true, maxW: 320 });
    marks5(p, [XW + 112, Y + 90], [XR + 112, Y + 90]); }); });

  /* 30 ── SHRED (ฉีกเป็นแถบ): the wrong card is cut into strips that slip apart, dim; the right card drops in whole, lit */
  variant('shred', 'ฉีกเป็นแถบ', (d, c) => { art(c, p => { const T_ = CT(), Y = 30, XW = -236, XR = 236, CWd = 270, CHt = 320, n = 4, sw2 = CWd / n;
    for (let k = 0; k < n; k++) { const x0 = f1(XW - CWd / 2 + k * sw2), g0 = popAt(p, XW, Y, T_.tW), g1 = mvG(g0, { y: [[0, 0], [T_.tN, 0], [f3(T_.tN + tu(.3)), (k % 2 ? 22 : -14) + k * 6, 'out']], x: [[0, 0], [T_.tN, 0], [f3(T_.tN + tu(.3)), (k - 1.5) * 10, 'out']] });
      R(g1, x0 + 3, Y - CHt / 2, sw2 - 6, CHt, 10, BK); R(mvG(g1, { o: dimW(T_.tN, .42) }), x0 + 3, Y - CHt / 2, sw2 - 6, CHt, 10, F(3.6)); }
    const X_ = SD(d, 'w'); if (X_ && picOf(X_)) put(p, c, { icon: X_.icon }, XW, Y, 180, null, { t: f3(T_.tW + tu(.04)), o: dimW(T_.tN, .4) }); else if (X_) txt(atG(p, T_.tW), X_.label, XW, Y + 16, { size: 50, maxW: 220, weight: 800, color: C.mute, wrap: 'mid' });
    const KR = ent('drop', XR, Y, CHt, T_.tR); cbox(p, c, d, 'r', XR, Y, CWd, { g: mvG(CL(p), KR), mv: KR, draw: (q, st) => R(q, XR - CWd / 2, Y - CHt / 2, CWd, CHt, 30, st), iw: 190 });
    cword(p, d, 'w', XW, Y - CHt / 2 - 58, { pill: true, maxW: 320, strike: true }); cword(p, d, 'r', XR, Y - CHt / 2 - 58, { pill: true, maxW: 320 });
    marks5(p, [XW + CWd / 2 - 10, Y + CHt / 2 - 10], [XR + CWd / 2 - 10, Y + CHt / 2 - 10]); }); });

  /* 31 ── BROKEN LINK (เส้นเชื่อมขาด): lines run from a hub to both; the line to the wrong snaps (a gap, sparks, ✗), the line to the right lights */
  variant('link', 'เส้นเชื่อมขาด', (d, c) => { art(c, p => { const T_ = CT(), HB = [0, -226], W_ = [-264, 104], R_ = [264, 104], bs = 216;
    const g = popAt(p, ...HB, tu(.06)); g.circle(...HB, 50, F(4)); litOn(g, T_.H).circle(...HB, 22, DOTF());
    const lw1 = `M ${HB[0] - 30} ${HB[1] + 40} L ${f1(lerp(HB[0], W_[0], .42))} ${f1(lerp(HB[1], W_[1], .42))}`, lw2 = `M ${f1(lerp(HB[0], W_[0], .58))} ${f1(lerp(HB[1], W_[1], .58))} L ${W_[0] + 60} ${W_[1] - bs / 2 - 6}`;
    drawAt(p.path(lw1, { sw: 8, stroke: TL_(.5) }), p, tu(.2), tu(.25)); drawAt(p.path(lw2, { sw: 8, stroke: TL_(.5) }), p, tu(.2), tu(.25)); sparkAt(p, f1(lerp(HB[0], W_[0], .5)), f1(lerp(HB[1], W_[1], .5)), 18, 48, T_.tN, 6, 0);
    const rl = `M ${HB[0] + 30} ${HB[1] + 40} L ${R_[0] - 60} ${R_[1] - bs / 2 - 6}`; drawAt(p.path(rl, { sw: 8, stroke: TL_(.5) }), p, T_.tR, tu(.25)); const a = p.path(rl, { sw: 9, stroke: ACC1 }); on(a, p, 0, { draw: [[0, 0], [f3(T_.H - tu(.3)), 0], [T_.H, 1, 'io']] });
    cbox(p, c, d, 'w', ...W_, bs); cbox(p, c, d, 'r', ...R_, bs); cword(p, d, 'w', W_[0], W_[1] + bs / 2 + 60, { pill: true, maxW: 340, strike: true }); cword(p, d, 'r', R_[0], R_[1] + bs / 2 + 60, { pill: true, maxW: 340 });
    marks5(p, [f1(lerp(HB[0], W_[0], .5) - 70), f1(lerp(HB[1], W_[1], .5))], corner(...R_, bs)); }); });

  /* 32 ── ARROW BANDS (แถบลูกศรสองชั้น): two arrow bands — the wrong band above dims with its word struck, the right band below lights */
  variant('bands', 'แถบลูกศรสองชั้น', (d, c) => { art(c, p => { const T_ = CT(), BW2 = 860, BH2 = 210, Y = { w: -122, r: 128 }, bs = 176, IX = -330;
    ['w', 'r'].forEach(s => { const y = Y[s], D = pathOf([[-450, y - BH2 / 2], [370, y - BH2 / 2], [450, y], [370, y + BH2 / 2], [-450, y + BH2 / 2]]), K = ent('left', 0, y, BW2, s === 'w' ? T_.tW : T_.tR), gg = mvG(CL(p), K);
      const g = cbox(p, c, d, s, 0, y, BH2, { g: gg, mv: K, draw: (q, st) => q.path(D, st), ix: IX, iw: bs * .72, lw: bs * .9 }); R(g, IX - bs / 2, y - bs / 2, bs, bs, bs * .24, SL(1.8));
      cword(p, d, s, IX + bs / 2 + 34, y + 20, { g: gg, anchor: 'start', size: 58, maxW: 560, wrap: null, strike: s === 'w' }); });
    marks5(p, [400, Y.w - 70], [400, Y.r + 70]); }); });

  /* 33 ── PUSH OUT (ดันออก): the wrong sits in the slot; the right slides in from the side and shoves it out — it skids off tilted, crossed */
  variant('pushout', 'ดันออก', (d, c) => { art(c, p => { const T_ = CT(), S_ = [126, 36], bs = 268, W_ = [-318, 60], s1 = 184, ta = f3(T_.tR + tu(.3));
    drawAt(R(p, S_[0] - bs / 2 - 16, S_[1] - bs / 2 - 16, bs + 32, bs + 32, bs * .3, DASH(.5)), p, tu(.04), tu(.3));
    const KW = { px: W_[0], py: W_[1], x: [[0, f1(S_[0] - W_[0])], [f3(T_.tR + tu(.18)), f1(S_[0] - W_[0])], [ta, 0, 'out']], y: [[0, f1(S_[1] - W_[1])], [f3(T_.tR + tu(.18)), f1(S_[1] - W_[1])], [ta, 0, 'out']], r: [[0, 0], [f3(T_.tR + tu(.18)), 0], [ta, -12, 'out']], s: [[0, f3(bs / s1)], [f3(T_.tR + tu(.18)), f3(bs / s1)], [ta, 1, 'out']], o: fadeIn(T_.tW, .05) };
    cbox(p, c, d, 'w', ...W_, s1, { g: mvG(CL(p), KW), mv: KW }); const KR = { px: S_[0], py: S_[1], x: [[0, 620], [T_.tR, 620], [f3(T_.tR + tu(.3)), -14, 'out'], [f3(T_.tR + tu(.42)), 0, 'soft']], o: fadeIn(T_.tR, .04) };
    cbox(p, c, d, 'r', ...S_, bs, { g: mvG(CL(p), KR), mv: KR });
    cword(p, d, 'r', S_[0], S_[1] - bs / 2 - 70, { pill: true, maxW: 380 }); cword(p, d, 'w', W_[0], W_[1] + s1 / 2 + 66, { pill: true, maxW: 300, strike: true, t: ta });
    marks5(p, rotP(W_[0] - s1 / 2 + 8, W_[1] - s1 / 2 + 8, ...W_, -12), cornerB(...S_, bs), 56, ta); }); });

  /* 34 ── SLIDER (สไลเดอร์): a track with the wrong above one end and the right above the other; the lit knob slides from the wrong end to the right */
  variant('slider', 'สไลเดอร์', (d, c) => { art(c, p => { const T_ = CT(), TY = 168, XW = -300, XR = 300, bs = 214, BY = -64;
    R(mvG(p, { px: 0, py: TY, sx: [[0, .1], [tu(.04), .1], [tu(.36), 1.02, 'out'], [tu(.46), 1, 'soft']], o: fadeIn(tu(.04), .05) }), -440, TY - 40, 880, 80, 40, F(3.4));
    const fl = R(mvG(p, { px: -432, py: TY, sx: [[0, .08], [T_.tN, .08], [T_.H, 1, 'io']] }), -432, TY - 30, 864, 60, 30, { fill: TA(.4), sw: 0, stroke: 'none' });
    cbox(p, c, d, 'w', XW, BY, bs); cbox(p, c, d, 'r', XR, BY, bs);
    const kg = mvG(p, { x: [[0, XW - XR], [T_.tN, XW - XR], [T_.H, 0, 'io'], [f3(T_.H + tu(.1)), 10, 'out'], [f3(T_.H + tu(.2)), 0, 'soft']], o: fadeIn(tu(.4), .06) }); kg.circle(XR, TY, 52, F(4)); litOn(kg, T_.H).circle(XR, TY, 30, DOTF());
    cword(p, d, 'w', XW, BY - bs / 2 - 60, { pill: true, maxW: 320, strike: true }); cword(p, d, 'r', XR, BY - bs / 2 - 60, { pill: true, maxW: 320 });
    marks5(p, cornerB(XW, BY, bs), cornerB(XR, BY, bs)); }); });

  /* 35 ── ACCORDION (แผงพับ): the wrong panel folds shut (its word struck); the right panel opens below with its icon and its line of words */
  variant('accordion', 'แผงพับ', (d, c) => { art(c, p => { const T_ = CT(), PW2 = 880, HH = 100, YW = -248, YR = -128, BY0 = YR + HH / 2, BH = 300, bs = 214, BX = -300;
    [['w', YW], ['r', YR]].forEach(([s, hy]) => { const w = s === 'w', t = w ? T_.tW : T_.tR, X_ = SD(d, s), g0 = mvG(p, { x: glide(-100, t, f3(t + tu(.26))), o: fadeIn(t, .05) }); if (w) R(g0, -PW2 / 2, hy - HH / 2, PW2, HH, 30, BK);
      const g = w ? mvG(g0, { o: dimW(T_.tN, .5) }) : g0; R(g, -PW2 / 2, hy - HH / 2, PW2, HH, 30, F(3.8)); if (!w) R(litOn(g, T_.H), -PW2 / 2, hy - HH / 2, PW2, HH, 30, { sw: 5, stroke: ACC1 });
      if (X_ && X_.label) { const e = txt(g, X_.label, -PW2 / 2 + 40, hy + 17, { size: 50, maxW: 640, weight: 800, color: C.ink, anchor: 'start' }); if (w) { const bb = e.getBBox(); strikeLine(p, f1(bb.x - 10), f1(bb.y + bb.height * .55), f1(bb.x + bb.width + 10), f1(bb.y + bb.height * .55), f3(T_.tN + tu(.04)), 5); } }
      chev(mvG(g, { px: PW2 / 2 - 60, py: hy, r: w ? [[0, 90], [T_.tN, 90], [f3(T_.tN + tu(.2)), 0, 'io']] : [[0, 0], [T_.tR, 0], [f3(T_.tR + tu(.2)), 90, 'io']] }), PW2 / 2 - 64, hy, .7, { sw: 5, stroke: C.ink }); });
    const body = mvG(p, { px: 0, py: BY0, sy: [[0, 0], [T_.tR, 0], [f3(T_.tR + tu(.3)), 1, 'out']], o: fadeIn(T_.tR, .04) }); R(body, -PW2 / 2 + 16, BY0 - 6, PW2 - 32, BH, 30, F(3));
    const by = BY0 + BH / 2 - 6; cbox(p, c, d, 'r', BX, by, bs, { t: f3(T_.tR + tu(.2)) }); cnote(p, d, 'r', BX + bs / 2 + 30, by - 20, 520, { size: 44 });
    marks5(p, [PW2 / 2 - 170, YW], corner(BX, by, bs)); }); });

  /* 36 ── DIAL (หน้าปัดชี้): the needle points at the wrong end of a half dial, then swings over to the right end and settles; that arc lights */
  variant('dial', 'หน้าปัดชี้', (d, c) => { art(c, p => { const T_ = CT(), CX = 0, CY = 152, RG = 320, bs = 180, NL = 248;
    const arcP = `M ${CX - RG} ${CY} A ${RG} ${RG} 0 0 1 ${CX + RG} ${CY}`; drawAt(p.path(arcP, { sw: 36 }), p, tu(.04), tu(.4)); drawAt(p.path(arcP, { sw: 28, stroke: C.fill }), p, tu(.04), tu(.4));
    const la = p.path(`M ${CX} ${CY - RG} A ${RG} ${RG} 0 0 1 ${CX + RG} ${CY}`, { sw: 16, stroke: ACC1 }); on(la, p, 0, { draw: [[0, 0], [f3(T_.H - tu(.1)), 0], [f3(T_.H + tu(.3)), 1, 'out']] });
    cbox(p, c, d, 'w', CX - RG, CY, bs); cbox(p, c, d, 'r', CX + RG, CY, bs);
    const ng = mvG(p, { px: CX, py: CY, r: [[0, -60], [T_.tN, -60], [f3(T_.tN + tu(.12)), -72, 'out'], [f3(T_.H - tu(.3)), -60], [T_.H, 64, 'io'], [f3(T_.H + tu(.14)), 54, 'soft']], o: fadeIn(tu(.4), .06) });
    ng.path(`M ${CX - 13} ${CY} L ${CX} ${CY - NL} L ${CX + 13} ${CY} Z`, { fill: ACC1, sw: 2.4, stroke: ACC1 }); p.circle(CX, CY, 34, F(3.6)); popAt(p, CX, CY, tu(.42)).circle(CX, CY, 12, DOTF());
    cword(p, d, 'w', CX - 52, CY + 142, { pill: true, anchor: 'end', maxW: 340, strike: true }); cword(p, d, 'r', CX + 52, CY + 142, { pill: true, anchor: 'start', maxW: 340 });
    marks5(p, [CX - RG - 64, CY - 88], [CX + RG + 64, CY - 88]); }); });

  /* 37 ── BRACKET (สายคัดเลือก): both stand on the left; their lines join and run to the final slot — the right rides its lit line in, the wrong's line is cut */
  variant('bracket', 'สายคัดเลือก', (d, c) => { art(c, p => { const T_ = CT(), bs = 190, W_ = [-300, -140], R_ = [-300, 160], JX = -60, JY = 10, SX = 252, s2 = 232, t0 = f3(T_.H - tu(.5));
    const lineP = y => `M ${W_[0] + bs / 2} ${y} L ${JX} ${y} L ${JX} ${JY}`; drawAt(p.path(lineP(W_[1]), { sw: 4, stroke: TL_(.5) }), p, tu(.3), tu(.3)); drawAt(p.path(lineP(R_[1]), { sw: 4, stroke: TL_(.5) }), p, f3(T_.tR + tu(.1)), tu(.3));
    sparkAt(p, -96, W_[1], 16, 40, T_.tN, 6, 0); const cut = popAt(p, -96, W_[1], T_.tN); cut.line(-106, W_[1] - 24, -86, W_[1] + 24, { sw: 10, stroke: C.fill });
    drawAt(p.path(`M ${JX} ${JY} L ${SX - s2 / 2 - 14} ${JY}`, { sw: 4, stroke: TL_(.5) }), p, tu(.5), tu(.2)); drawAt(R(p, SX - s2 / 2 - 12, JY - s2 / 2 - 12, s2 + 24, s2 + 24, s2 * .3, DASH(.45)), p, tu(.55), tu(.3));
    const ln = p.path(lineP(R_[1]) + ` L ${SX - s2 / 2 - 14} ${JY}`, { sw: 6, stroke: ACC1 }); on(ln, p, 0, { draw: [[0, 0], [t0, 0], [T_.H, 1, 'io']] });
    cbox(p, c, d, 'w', ...W_, bs); const Rg = popAt(p, ...R_, T_.tR); R(Rg, R_[0] - bs / 2, R_[1] - bs / 2, bs, bs, bs * .24, F(4)); const XR = SD(d, 'r'); if (XR && picOf(XR)) put(p, c, { icon: XR.icon }, ...R_, bs * .72, null, { t: f3(T_.tR + tu(.04)) }); else if (XR) txt(Rg, XR.label, R_[0], R_[1] + 16, { size: 44, maxW: bs * .84, weight: 800, color: C.ink, wrap: 'mid' });
    const P = pathK([R_, [JX, R_[1]], [JX, JY], [SX, JY]], t0, T_.H, [SX, JY]), K = { px: SX, py: JY, x: P.x, y: P.y, s: [[0, f3(bs / s2)], [t0, f3(bs / s2)], [T_.H, 1, 'out']], o: [[0, 0], [t0, 0], [f3(t0 + tu(.04)), 1]] };
    cbox(p, c, d, 'r', SX, JY, s2, { g: mvG(p, K), mv: K, t: t0 });
    cword(p, d, 'w', -184, W_[1] - 40, { anchor: 'start', size: 48, maxW: 300, wrap: null, strike: true }); cword(p, d, 'r', -180, R_[1] + 62, { anchor: 'start', size: 48, maxW: 300, wrap: null });
    marks5(p, corner(...W_, bs, -1), cornerB(SX, JY, s2)); }); });

  /* 38 ── TIP OVER (แผ่นเอนล้ม): two tall tiles stand; the wrong one tips back on its corner and dims; the right stands and lights */
  variant('tipover', 'แผ่นเอนล้ม', (d, c) => { art(c, p => { const T_ = CT(), TW2 = 236, TH2 = 450, Y0 = -186, Y1 = 264, X = { w: -205, r: 205 }, bs = 196;
    ['w', 'r'].forEach(s => { const x = X[s], w = s === 'w', sd = w ? -1 : 1, t = w ? T_.tW : T_.tR, t1 = f3(t + tu(.28)), pv = [x + sd * TW2 / 2, Y1], K = fallK(pv[0], pv[1], t, t1, 560);
      K.r = w ? [[0, 0], [T_.tN, 0], [f3(T_.tN + tu(.26)), -23, 'in'], [f3(T_.tN + tu(.36)), -18, 'out'], [f3(T_.tN + tu(.46)), -20, 'soft']] : [[0, 0]];
      const g = cbox(p, c, d, s, x, -64, TW2, { g: mvG(CL(p), K), mv: K, t, draw: (q, st) => R(q, x - TW2 / 2, Y0, TW2, TH2, 40, st), iw: bs * .72, lw: TW2 - 40, dimAt: f3(T_.tN + tu(.2)) }); R(g, x - bs / 2, -64 - bs / 2, bs, bs, bs * .24, SL(1.8));
      dust(p, x, Y1, t1, 1.1); cword(p, d, s, x, 150, { g, size: 46, maxW: TW2 - 40, t: f3(t1 + tu(.06)) }); });
    marks5(p, rotP(X.w + TW2 / 2 - 40, Y0 + 40, X.w - TW2 / 2, Y1, -20), corner(X.r, Y0 + 100, 200)); }); });

  /* 39 ── HALO (แสงส่อง): rings of light open round the right one in the middle; the wrong is left small in the dark, crossed */
  variant('halo', 'แสงส่อง', (d, c) => { art(c, p => { const T_ = CT(), R_ = [140, 34], s2 = 250, W_ = [-338, 34], s1 = 178;
    [1.5, 1.25].forEach((k, i) => { const g = sub(p); on(g, p, 0, { ox: R_[0], oy: R_[1], s: [[0, .6], [f3(T_.H - tu(.1) + tu(.08 * i)), .6], [f3(T_.H + tu(.3) + tu(.08 * i)), 1, 'out']], o: [[0, 0], [f3(T_.H - tu(.1) + tu(.08 * i)), 0], [f3(T_.H + tu(.1 * i)), 1]] }); g.circle(...R_, f1(s2 / 2 * k + 16), { fill: TA(.05 + .03 * i), sw: 2, stroke: TL_(.35) }); });
    cbox(p, c, d, 'w', ...W_, s1, { shape: 'circ' }); const KR = ent('pop', ...R_, s2, T_.tR); cbox(p, c, d, 'r', ...R_, s2, { shape: 'circ', g: mvG(p, KR), mv: KR });
    cword(p, d, 'w', W_[0], W_[1] - s1 / 2 - 62, { pill: true, maxW: 280, strike: true }); cword(p, d, 'r', R_[0], R_[1] + s2 / 2 * 1.5 + 50, { pill: true, maxW: 360 });
    marks5(p, [f1(W_[0] + s1 * .36), f1(W_[1] + s1 * .36)], [f1(R_[0] + s2 * .36), f1(R_[1] - s2 * .36)]); }); });

  /* 40 ── CRUMPLE (ขยำทิ้ง): the wrong card scrunches into a crumpled ball and rolls to the corner, dim and crossed; the right card lies flat, lit */
  variant('crumple', 'ขยำทิ้ง', (d, c) => { art(c, p => { const T_ = CT(), R_ = [126, -18], s2 = 296, W_ = [-326, 186], rB = 104, ta = f3(T_.tN + tu(.36));
    const ball = pathOf(Array.from({ length: 16 }, (_, k) => { const a = rad(k * 22.5), r = k % 2 ? rB * .8 : rB * (1 + (k % 4 ? .04 : -.06)); return [f1(W_[0] + r * Math.cos(a)), f1(W_[1] + r * Math.sin(a))]; }));
    const KW = { px: W_[0], py: W_[1], x: [[0, f1(R_[0] - W_[0])], [T_.tN, f1(R_[0] - W_[0])], [ta, 0, 'in']], y: [[0, f1(R_[1] - W_[1])], [T_.tN, f1(R_[1] - W_[1])], [ta, 0, 'in']], r: [[0, 0], [T_.tN, 0], [ta, -200, 'in']], s: [[0, 1.4], [T_.tN, 1.4], [ta, 1]], o: [[0, 0], [T_.tN, 0], [f3(T_.tN + tu(.06)), 1]] };
    /* until it is turned down the wrong one is a flat card in the middle; at tN it scrunches into the ball (card out, ball in) */
    { const OC = [[0, 1], [T_.tN, 1], [f3(T_.tN + tu(.08)), 0]], cg = mvG(popAt(p, ...R_, T_.tW), { px: R_[0], py: R_[1], s: [[0, 1], [T_.tN, 1], [f3(T_.tN + tu(.08)), .7]], o: OC });
      cbox(p, c, d, 'w', ...R_, s2, { g: cg, mv: { px: R_[0], py: R_[1], s: [[0, 1], [T_.tN, 1], [f3(T_.tN + tu(.08)), .7]] }, io: [[0, 0], [f3(T_.tW + tu(.04)), 0], [f3(T_.tW + tu(.14)), 1], [T_.tN, 1], [f3(T_.tN + tu(.08)), 0]], dimAt: 99 }); }
    cbox(p, c, d, 'w', ...W_, rB * 2, { g: mvG(CL(p), KW), mv: { px: W_[0], py: W_[1], x: KW.x, y: KW.y, s: KW.s }, draw: (q, st) => q.path(ball, st), iw: 130, dimAt: ta, io: [[0, 0], [T_.tN, 0], [f3(T_.tN + tu(.06)), 1], [ta, 1], [f3(ta + tu(.2)), .4]] });
    [[-50, -40, 30, -10], [10, 30, 60, 60], [-60, 40, -20, 70]].forEach(([a, b, e, f]) => drawAt(p.line(W_[0] + a, W_[1] + b, W_[0] + e, W_[1] + f, { sw: 2, stroke: TL_(.35) }), p, ta, tu(.1)));
    const KR = ent('drop', ...R_, s2, T_.tR); cbox(p, c, d, 'r', ...R_, s2, { g: mvG(CL(p), KR), mv: KR }); dust(p, R_[0], R_[1] + s2 / 2, KR.land, 1.2);
    cword(p, d, 'r', R_[0] - s2 / 2 - 26, R_[1] + 18, { anchor: 'end', size: 52, maxW: 300 }); cword(p, d, 'w', W_[0] + rB + 26, W_[1] + 18, { anchor: 'start', size: 46, maxW: 300, wrap: null, strike: true, t: ta });
    marks5(p, [W_[0] + 80, W_[1] - 80], corner(...R_, s2), 56, ta); }); });

  /* 41 ── SEGMENT (แถบเลือกสองช่อง): a two-part control; the lit block sits under the wrong, it is struck, the block slides over to the right */
  variant('segment', 'แถบเลือกสองช่อง', (d, c) => { art(c, p => { const T_ = CT(), Y = 60, X = { w: -225, r: 225 }, bs = 196;
    R(mvG(p, { px: 0, py: Y, sx: [[0, .2], [tu(.04), .2], [tu(.34), 1.03, 'out'], [tu(.44), 1, 'soft']], o: fadeIn(tu(.04), .06) }), -455, Y - 128, 910, 256, 128, F(3.6)); drawAt(p.line(0, Y - 90, 0, Y + 90, { sw: 2.4, stroke: TL_(.35) }), p, tu(.3), tu(.2));
    const hg = mvG(p, { px: X.r, py: Y, x: [[0, X.w - X.r], [f3(T_.H - tu(.3)), X.w - X.r], [T_.H, 0, 'io']], o: fadeIn(f3(T_.tW + tu(.3)), .06) }); R(hg, X.r - 214, Y - 112, 428, 224, 112, { fill: TA(.16), sw: 3, stroke: TL_(.5) }); R(litOn(hg, T_.H), X.r - 214, Y - 112, 428, 224, 112, { sw: 5, stroke: ACC1 });
    cbox(p, c, d, 'w', X.w, Y, bs); cbox(p, c, d, 'r', X.r, Y, bs); cword(p, d, 'w', X.w, Y - 128 - 70, { pill: true, maxW: 340, strike: true }); cword(p, d, 'r', X.r, Y - 128 - 70, { pill: true, maxW: 340 });
    marks5(p, [X.w - 150, Y + 96], [X.r + 150, Y + 96]); }); });

  /* 42 ── VALVE (วาล์วปิด): two pipes run from one source; the valve on the wrong one's pipe shuts (crossed) — the flow runs down the right one's pipe and lights it */
  variant('valve', 'วาล์วปิด', (d, c) => { art(c, p => { const T_ = CT(), SRC = [-410, 10], Y = { w: -128, r: 150 }, BX = 292, bs = 210, VX = -122;
    const pipe = y => `M ${SRC[0] + 40} ${SRC[1]} C ${SRC[0] + 120} ${SRC[1]} ${SRC[0] + 120} ${y} ${SRC[0] + 210} ${y} L ${BX - bs / 2 - 8} ${y}`;
    const sg = popAt(p, ...SRC, tu(.04)); sg.circle(...SRC, 44, F(4)); sg.circle(...SRC, 18, DOTF());
    ['w', 'r'].forEach(s => { const y = Y[s], tg = sub(p); on(tg, p, 0, { o: fadeIn(s === 'w' ? tu(.2) : f3(T_.tR - tu(.1)), .1) }); tube(tg, pipe(y), 34); cbox(p, c, d, s, BX, y, bs); });
    const a = p.path(pipe(Y.r), { sw: 14, stroke: ACC1 }); on(a, p, 0, { draw: [[0, 0], [T_.tR, 0], [T_.H, 1, 'io']] });
    const vg = popAt(p, VX, Y.w, tu(.3)); vg.circle(VX, Y.w, 46, F(4)); const vb = mvG(vg, { px: VX, py: Y.w, r: [[0, 90], [T_.tN, 90], [f3(T_.tN + tu(.2)), 0, 'out']] }); R(vb, VX - 34, Y.w - 9, 68, 18, 9, { fill: C.ink, sw: 0, stroke: 'none' });
    cword(p, d, 'w', BX - bs / 2 - 18, Y.w - 104, { pill: true, anchor: 'end', maxW: 280, strike: true }); cword(p, d, 'r', BX - bs / 2 - 18, Y.r - 104, { pill: true, anchor: 'end', maxW: 280 });
    marks5(p, [VX, Y.w + 80], cornerB(BX, Y.r, bs)); }); });

  /* 43 ── PINS (หมุดเส้นทาง): two map pins pop in; the wrong pin is crossed and fades, the dashed route runs on to the right pin, which lights */
  variant('pins', 'หมุดเส้นทาง', (d, c) => { art(c, p => { const T_ = CT(), rP = 100, P_ = { w: [-236, -50], r: [236, -50] };
    const tipR = [P_.r[0], f1(P_.r[1] + rP * 1.9)], route = `M -470 300 C -240 300 -60 ${tipR[1] + 40} ${tipR[0]} ${tipR[1]}`; drawAt(p.path(route, DASH(.5)), p, tu(.1), tu(.5)); const lr = p.path(route, { sw: 6, stroke: ACC1 }); on(lr, p, 0, { draw: [[0, 0], [T_.tR, 0], [T_.H, 1, 'io']] });
    ['w', 'r'].forEach(s => { const [x, y] = P_[s], K = ent('drop', x, y, rP * 2, s === 'w' ? T_.tW : T_.tR); cbox(p, c, d, s, x, y, rP * 2, { g: mvG(CL(p), K), mv: K, draw: (q, st) => q.path(pinD(x, y, rP), st), iw: rP * 1.32 });
      cword(p, d, s, x, y - rP - 40, { size: 46, maxW: 320, strike: s === 'w' }); });
    marks5(p, [f1(P_.w[0] - rP * 1.15), f1(P_.w[1] + rP * .2)], [f1(P_.r[0] + rP * 1.15), f1(P_.r[1] + rP * .2)]); }); });

  /* 44 ── PILLS (เม็ดคำใหญ่): two long pills — icon and word inside each; a line strikes the wrong pill end to end and it dims; the right pill lights */
  variant('pills', 'เม็ดคำใหญ่', (d, c) => { art(c, p => { const T_ = CT(), Y = { w: -122, r: 150 }, PW3 = 860, PH3 = 204, IX = -322, bs = 172;
    ['w', 'r'].forEach(s => { const y = Y[s], K = ent('left', 0, y, PW3, s === 'w' ? T_.tW : T_.tR), gg = mvG(CL(p), K);
      const pic_ = picOf(SD(d, s)), g = cbox(p, c, d, s, 0, y, PH3, { g: gg, mv: K, draw: (q, st) => R(q, -PW3 / 2, y - PH3 / 2, PW3, PH3, PH3 / 2, st), ix: pic_ ? IX : 0, iw: pic_ ? bs * .7 : 200, lw: pic_ ? bs * .9 : PW3 - 160 }); if (pic_) g.circle(IX, y, bs / 2, SL(1.6));
      cword(p, d, s, IX + bs / 2 + 34, y + 20, { g: gg, anchor: 'start', size: 58, maxW: 520, wrap: null }); });
    strikeLine(p, -PW3 / 2 + 20, Y.w, PW3 / 2 - 20, Y.w, f3(T_.tN + tu(.04)), 7); marks5(p, [PW3 / 2 - 70, Y.w - 76], [PW3 / 2 - 70, Y.r - 76]); }); });

  /* 45 ── WHEEL (วงหมุนเลือก): the wheel turns with both on it and stops with the right under the pointer at the top (lit), the wrong at the bottom, crossed */
  variant('wheel', 'วงหมุนเลือก', (d, c) => { art(c, p => { const T_ = CT(), WX = -95, WY = 25, RW = 185, bs = 190, tS0 = f3(T_.tN), D = 450, ease = u => 1 - Math.pow(1 - u, 3), N = 40;
    const ang = (s, u) => (s === 'w' ? 0 : 180) + D * (u <= tS0 ? 0 : u >= T_.H ? 1 : ease((u - tS0) / (T_.H - tS0))), Pt = a => [f1(WX + RW * Math.cos(rad(a))), f1(WY + RW * Math.sin(rad(a)))], ts = Array.from({ length: N + 1 }, (_, k) => f3(lerp(tS0, T_.H, k / N)));
    p.circle(WX, WY, RW, DASH(.4)); const aF = ang('r', T_.H), sp = mvG(p, { px: WX, py: WY, r: [[0, f1(ang('r', 0) - aF)]].concat(ts.map(u => [u, f1(ang('r', u) - aF)])), o: fadeIn(tu(.2), .06) });
    const [ax, ay] = Pt(aF), [bx_, by_] = Pt(aF + 180); sp.line(ax, ay, bx_, by_, { sw: 14 }); sp.line(ax, ay, bx_, by_, { sw: 7, stroke: C.fill }); p.circle(WX, WY, 34, F(3.6)); p.circle(WX, WY, 11, DOTF());
    ['w', 'r'].forEach(s => { const [fx, fy] = Pt(ang(s, T_.H)), [sx0, sy0] = Pt(ang(s, 0)), t = s === 'w' ? T_.tW : f3(T_.tW + tu(.2));
      const K = { px: fx, py: fy, x: [[0, f1(sx0 - fx)]].concat(ts.map(u => [u, f1(Pt(ang(s, u))[0] - fx)])), y: [[0, f1(sy0 - fy)]].concat(ts.map(u => [u, f1(Pt(ang(s, u))[1] - fy)])), s: [[0, .3], [t, .3], [f3(t + tu(.22)), 1.08, 'out'], [f3(t + tu(.34)), 1, 'soft']], o: fadeIn(t, .04) };
      cbox(p, c, d, s, fx, fy, bs, { shape: 'circ', g: mvG(p, K), mv: K, t, dimAt: T_.H }); cword(p, d, s, 40, fy + 18, { anchor: 'start', size: 50, maxW: 400, wrap: null, strike: s === 'w', t: f3(T_.H + tu(.14)) }); });
    const PY = WY - RW - bs / 2 - 10, KP = fallK(WX, PY, tu(.3), tu(.54), 200); KP.r = [[0, 0], [T_.H, 0], [f3(T_.H + tu(.06)), -16, 'out'], [f3(T_.H + tu(.3)), 0, 'soft']];
    const pg = mvG(CL(p), KP), tri = `M ${WX - 32} ${PY - 56} L ${WX + 32} ${PY - 56} L ${WX} ${PY} Z`; pg.path(tri, F(4)); litOn(pg, T_.H).path(tri, { fill: ACC1, sw: 4, stroke: ACC1 });
    const top = Pt(270), bot = Pt(90); marks5(p, [f1(bot[0] - bs / 2 - 46), bot[1]], [f1(top[0] - bs / 2 - 46), top[1]], 56, f3(T_.H + tu(.04))); }); });

  /* 46 ── STEP UP (ก้าวขึ้นขั้น): two steps — the wrong stays crossed on the low step, the right lands on the high step, lit; the words on the step faces */
  variant('stepup', 'ก้าวขึ้นขั้น', (d, c) => { art(c, p => { const T_ = CT(), s1 = 190, s2 = 214, LT = 168, HT = -36, W_ = [-246, f1(LT - 8 - s1 / 2)], R_ = [246, f1(HT - 8 - s2 / 2)];
    const sg = mvG(CL(p), upK(0, 340, tu(.02), .36)); sg.path(pathOf([[-470, 340], [-470, LT], [-20, LT], [-20, HT], [470, HT], [470, 340]]), F(4));
    const KW = ent('drop', ...W_, s1, T_.tW); cbox(p, c, d, 'w', ...W_, s1, { g: mvG(CL(p), KW), mv: KW }); dust(p, W_[0], LT - 8, KW.land, .9);
    const KR = ent('drop', ...R_, s2, T_.tR); cbox(p, c, d, 'r', ...R_, s2, { g: mvG(CL(p), KR), mv: KR }); dust(p, R_[0], HT - 8, KR.land, 1);
    cword(p, d, 'w', W_[0], LT + 70, { size: 46, maxW: 380, strike: true }); cword(p, d, 'r', R_[0], HT + 80, { size: 52, maxW: 420 });
    marks5(p, corner(...W_, s1), corner(...R_, s2)); }); });

  /* 47 ── FOCUS (ซูมโฟกัส): the corner marks first frame the wrong (it is crossed and drops out of focus), then jump to lock on the right one */
  variant('zoomfocus', 'ซูมโฟกัส', (d, c) => { art(c, p => { const T_ = CT(), R_ = [112, 40], s2 = 296, W_ = [-352, -196], s1 = 172, AL = 52;
    cbox(p, c, d, 'w', ...W_, s1); const KR = ent('pop', ...R_, s2, T_.tR); cbox(p, c, d, 'r', ...R_, s2, { g: mvG(p, KR), mv: KR });
    const rw = [W_[0], W_[1], s1 / 2 + 26, s1 / 2 + 26], rr = [R_[0], R_[1], s2 / 2 + 22, s2 / 2 + 22];
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sy]) => { const at = r => [r[0] + sx * r[2], r[1] + sy * r[3]], [x0, y0] = at(rw), [x1, y1] = at(rr);
      const cg = mvG(p, { x: [[0, x0 - x1], [f3(T_.H - tu(.3)), x0 - x1], [T_.H, 0, 'io']], y: [[0, y0 - y1], [f3(T_.H - tu(.3)), y0 - y1], [T_.H, 0, 'io']], o: fadeIn(f3(T_.tW + tu(.3)), .06) }), dd = `M ${x1} ${y1 - sy * AL} L ${x1} ${y1} L ${x1 - sx * AL} ${y1}`;
      cg.path(dd, { sw: 7, stroke: TL_(.75) }); litOn(cg, T_.H).path(dd, { sw: 8, stroke: ACC1 }); });
    cword(p, d, 'w', W_[0] + s1 / 2 + 30, W_[1] + 16, { anchor: 'start', size: 46, maxW: 320, wrap: null, strike: true }); cword(p, d, 'r', R_[0], R_[1] + s2 / 2 + 70, { pill: true, maxW: 380 });
    marks5(p, cornerB(...W_, s1), cornerB(...R_, s2)); }); });

  /* 48 ── LEVEL BARS (แถบระดับ): two rows — the wrong's bar only creeps a little and dims; the right's bar runs full and lights */
  variant('levelbars', 'แถบระดับ', (d, c) => { art(c, p => { const T_ = CT(), bs = 188, BX = -350, X0 = -220, X1 = 450, TWd = X1 - X0, Y = { w: -118, r: 150 };
    ['w', 'r'].forEach(s => { const y = Y[s], w = s === 'w', t = w ? T_.tW : T_.tR, K = ent('left', BX, y, bs, t); cbox(p, c, d, s, BX, y, bs, { g: mvG(CL(p), K), mv: K });
      const t2 = f3(t + tu(.14)), TK = { px: X0, py: y, sx: [[0, 0], [t2, 0], [f3(t2 + tu(.3)), 1, 'out']], o: fadeIn(t2, .04) }; if (w) R(mvG(p, TK), X0, y - 40, TWd, 80, 40, BK); const rg = w ? mvG(p, { o: dimW(T_.tN, .45) }) : p; R(mvG(rg, TK), X0, y - 40, TWd, 80, 40, F(3.2));
      const a = w ? .26 : 1, fw = f1((TWd - 20) * a); R(mvG(rg, { px: X0 + 10, py: y, sx: [[0, 0], [f3(t2 + tu(.3)), 0], [w ? T_.tN : T_.H, 1, 'io']] }), X0 + 10, y - 30, fw, 60, 30, { fill: TA(.6), sw: 0, stroke: 'none' });
      cword(p, d, s, X0 + 10, y - 62, { anchor: 'start', size: 48, maxW: TWd - 20, wrap: null, strike: w, t: f3(t2 + tu(.3)) }); });
    marks5(p, corner(BX, Y.w, bs, -1), corner(BX, Y.r, bs, -1)); }); });

  /* 49 ── TILTED CARDS (การ์ดเอียง): two cards drop in — word, icon, line of words; the wrong card leans back and fades, the right straightens and lights */
  variant('cardtilt', 'การ์ดเอียง', (d, c) => { art(c, p => { const T_ = CT(), CWd = 362, CHt = 504, CY = 18, X = { w: -206, r: 206 }, bs = 196;
    ['w', 'r'].forEach(s => { const x = X[s], w = s === 'w', a0 = w ? -4 : 4, aF = w ? -10 : 0, t = w ? T_.tW : T_.tR, t1 = f3(t + tu(.28)), K = fallK(x, CY + CHt / 2, t, t1, 640);
      K.r = w ? [[0, a0], [T_.tN, a0], [f3(T_.tN + tu(.28)), -11.5, 'out'], [f3(T_.tN + tu(.42)), aF, 'soft']] : [[0, a0], [T_.H, a0], [f3(T_.H + tu(.28)), 0, 'out']];
      const iy = f1(CY - 22), g = cbox(p, c, d, s, x, iy, CWd, { g: mvG(CL(p), K), mv: K, t, draw: (q, st) => R(q, x - CWd / 2, CY - CHt / 2, CWd, CHt, 40, st), iw: bs * .72, lw: CWd - 60 }); R(g, x - bs / 2, iy - bs / 2, bs, bs, bs * .24, SL(1.8));
      dust(p, x, CY + CHt / 2, t1, 1.1); cword(p, d, s, x, CY - CHt / 2 + 72, { g, size: 50, maxW: CWd - 50 }); cnote(p, d, s, x, iy + bs / 2 + 54, CWd - 70, { g, anchor: 'middle' }); });
    marks5(p, rotP(X.w - CWd / 2 + 30, CY + CHt / 2 - 30, X.w, CY + CHt / 2, -10), [X.r + CWd / 2 - 24, CY + CHt / 2 - 24]); }); });

  /* 50 ── SPLIT FRAME (กรอบแบ่งครึ่ง): one frame, split down the middle — the wrong half gets a big X over its icon and dims, the right half lights */
  variant('splitframe', 'กรอบแบ่งครึ่ง', (d, c) => { art(c, p => { const T_ = CT(), FW = 900, FH = 540, Y = 16, X = { w: -225, r: 225 }, bs = 224, iy = Y - 34;
    R(mvG(p, { px: 0, py: Y, sy: [[0, 0], [tu(.02), 0], [tu(.32), 1.02, 'out'], [tu(.42), 1, 'soft']], o: fadeIn(tu(.02), .05) }), -FW / 2, Y - FH / 2, FW, FH, 44, F(3.8));
    drawAt(p.line(0, Y - FH / 2 + 20, 0, Y + FH / 2 - 20, { sw: 2.6, stroke: TL_(.4) }), p, tu(.3), tu(.3)); const cg = popAt(p, 0, iy, T_.tR); cg.circle(0, iy, 40, F(3.4)); chev(cg, -3, iy, .7, { sw: 6, stroke: ACC1 });
    ['w', 'r'].forEach(s => { cbox(p, c, d, s, X[s], iy, bs); cword(p, d, s, X[s], iy + bs / 2 + 80, { size: 52, maxW: 380, strike: s === 'w' }); });
    bigX(p, X.w, iy, 120, T_.tN, 10); marks5(p, null, corner(X.r, iy, bs)); }); });

  /* ---------- sample data: B05's sentences (A) + stress (B: no labels, long labels, English, words only, same icon, a missing icon …) · texts on a few ---------- */
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

  G.cats = G.cats || {};
  G.cats.B05T = { variants: V, SAMPLES, STRESS, theme, draw: (i, d, c) => { setZ(c); CUR = V[i].id; tokens(); EMPTY = false; BLUE = false; V[i].build(d || {}, c); }, CLAMPS, timing: c => (setZ(c), Object.assign({}, Z)) };
})();
