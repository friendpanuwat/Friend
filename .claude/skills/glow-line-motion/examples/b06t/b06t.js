/* b06t.js — template ชุดฐาน category B06 "คำถาม / ความสงสัย" (user 2026-11-14: "เริ่มหมวด b06 ได้"): 50 designs, each its own layout; graphic elements
   only (slots, bubbles, lines, dials, tabs, a "?" glyph — the question sign is the category's own mark), our white-glow line style, colours from GL.theme;
   icon slots ≥ 165, words ≥ 40, marks r ≥ 56; no word chip top-left, no arrow badge top-right, no floor line, no numbers. Header + helpers from b04t.js.
   GL.cats.B06T.draw(i, data, { x, y, s, at, hit }) — canvas 1000 × 700 centred at (0,0). Data = CutPack B06 (cat_ai.py: "someone asks, wonders or hesitates"):
   about THING (who / what is in doubt) · options [THING, THING] (only when the line names two choices) · answer THING (only when the line gives it) —
   at least one of them; any mix. */
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
    cp.id = 'b06tclip' + (++CID); Object.entries({ x, y, width: w, height: h }).forEach(([k, v]) => r.setAttribute(k, v)); cp.appendChild(r);
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
  function iclip(a, c) { if (!a || !a.wrap || !a.wrap.parentNode) return; const svg = a.wrap.ownerSVGElement, k = [c.x, c.y, c.s].join('_');
    if (!ICLIP[k] || !svg.contains(ICLIP[k].cp)) { const cp = document.createElementNS(NS, 'clipPath'), r = document.createElementNS(NS, 'rect'); cp.id = 'b06ticlip' + (++CID);
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
    if (picOf(X)) put(p, c, { icon: X.icon }, o.ix ?? x, o.iy ?? y, iw, null, { t: f3(t + tu(.04)), mv: o.mv || K || undefined, o: lose ? [[0, 1], [T_.H, 1], [f3(T_.H + tu(.3)), .4, 'io']] : undefined, punch: win ? T_.H : undefined });
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
    const pulse = [[0, 1]]; for (let u = T_.tD0, k = 0; u + tu(.5) <= T_.tD1; u += tu(.5), k++) pulse.push([f3(u), 1], [f3(u + tu(.25)), 1.04, 'io'], [f3(u + tu(.5)), 1, 'io']);   /* a slow breath */
    const keep = o.keep ?? Fd.ai >= 0, fin = ans ? [[T_.H, 1], [f3(T_.H + tu(.2)), keep ? .3 : 0]] : [];   /* answered by one of the options: the "?" stays, faint */
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

  /* 01 ── BUBBLE (ฟองคำถาม): a speech bubble holds what is in doubt, the "?" badge on its corner; the options stand in a column on the right;
     the answer lands where the options would be */
  variant('bubble', 'ฟองคำถาม', (d, c) => { art(c, p => { const Fd = QD(d), T_ = QT(d), side = Fd.hasO || Fd.hasN, BX = side ? -210 : 0, BY = -40, BW = side ? 420 : 470, BH = 330;
    const D = bubbleD(BX, BY, BW, BH, BX - BW * .3, BY + BH / 2 + 70, -1); const bg = mvG(p, upK(BX, BY + BH / 2, tu(.04), .3)); bg.path(D, F(4.4));
    if (Fd.hasA) { qthing(p, c, d, 'a', 0, BX, BY, 230, { g: bg, kind: 'none' }); qword(p, d, 'a', 0, BX + 40, BY + BH / 2 + 74, { pill: true, maxW: 300 }); qmark(p, d, BX + BW / 2 - 18, BY - BH / 2 + 18, 58); }
    else qmark(p, d, BX, BY, 120, { plain: true });
    if (Fd.hasO) [[-150], [150]].forEach(([y], i) => { qthing(p, c, d, 'o', i, 300, y, 196, { kind: 'right' }); qword(p, d, 'o', i, 300, i ? 302 : -278, { pill: true, maxW: 300 }); });
    else qans(p, c, d, 280, -20, 240, { wy: 180 }); }); });

  /* the things present, in reading order: about, the two options, the answer apart — [role, i] */
  const QI = d => { const F1 = QD(d), L = []; if (F1.hasA) L.push(['a', 0]); if (F1.hasO) L.push(['o', 0], ['o', 1]); if (F1.hasN) L.push(['n', 0]); return L; };
  /* place item k of the list: slot + words (o.w(k, x, y, sz) → [wx, wy, opts]) */
  function qitems(p, c, d, pos, o = {}) { const L = QI(d); L.forEach(([r, i], k) => { const [x, y, sz] = pos[k]; const extra = typeof o.slot === 'function' ? o.slot(k, r, i, x, y, sz) : (o.slot || {});
      qthing(p, c, d, r, i, x, y, sz, Object.assign({ kind: r === 'n' ? 'pop' : o.kind || 'pop' }, extra));
      if (o.w) { const w = o.w(k, r, i, x, y, sz); if (w) qword(p, d, r, i, w[0], w[1], Object.assign({ t: r === 'n' ? f3(Z.H + tu(.12)) : undefined }, w[2] || {})); } }); return L; }
  const rowP = (k, s, gap, y = 0, cx = 0) => rowXs(k, s, gap, cx).map(x => [x, y, s]);
  const showK = (ph, i, d = .12) => [[0, 0], [f3(ph[0][0] - tu(.1)), 0], [ph[0][0], ph[0][1] === i ? 1 : 0]].concat(posK(ph, w => w === i ? 1 : 0, d).slice(1));
  const SZk = k => k >= 4 ? 176 : k === 3 ? 206 : k === 2 ? 236 : 260;

  /* 02 ── BIG "?" (เครื่องหมายคำถามใหญ่): a big "?" badge on the left; the things in doubt stack in a column on the right */
  variant('bigq', 'เครื่องหมายคำถามใหญ่', (d, c) => { art(c, p => { const Fd = QD(d), L = QI(d).filter(([r]) => r !== 'n'), k = L.length, QX = k ? -250 : 0;
    qmark(p, d, QX, 0, k ? 170 : 200, { t: tu(.12) }); if (Fd.hasN) qans(p, c, d, QX, 0, 300, { wy: 205 });
    const P = arr(k, 'col', 96, -300, 96, 320, 206); L.forEach(([r, i], j) => { const [x, y, sz] = P[j]; qthing(p, c, d, r, i, x, y, sz, { kind: 'right' }); qword(p, d, r, i, f1(x + sz / 2 + 26), f1(y + 16), { anchor: 'start', size: 46, maxW: f1(470 - x - sz / 2 - 26), wrap: null }); }); }); });
  /* standard arrangements for k things inside a box (x0, y0, x1, y1): 'row' | 'col' (4 → 2 × 2) */
  function arr(k, kind, x0, y0, x1, y1, smax = 250) { if (!k) return [];
    if (kind === 'row' || (kind === 'col' && k === 4 && false)) { const s = Math.min(smax, (x1 - x0 - 40 * (k - 1)) / k, y1 - y0); return rowXs(k, s, Math.min(120, (x1 - x0 - s * k) / Math.max(1, k - 1)), (x0 + x1) / 2).map(x => [x, (y0 + y1) / 2, f1(s)]); }
    if (k === 4) { const s = Math.min(smax, x1 > x0 ? (x1 - x0 - 40) / 2 : 1e9, (y1 - y0 - 30) / 2), cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, o = s / 2 + 20; return [[cx - o, cy - o, s], [cx + o, cy - o, s], [cx - o, cy + o, s], [cx + o, cy + o, s]].map(q => q.map(f1)); }
    const s = Math.min(smax, (y1 - y0 - 24 * (k - 1)) / k, x1 > x0 ? x1 - x0 : 1e9); return rowXs(k, s, Math.min(80, (y1 - y0 - s * k) / Math.max(1, k - 1)), (y0 + y1) / 2).map(y => [f1((x0 + x1) / 2), y, f1(s)]); }
  const wBelow = (dy = 56, mw = 300) => (k, r, i, x, y, sz) => [x, f1(y + sz / 2 + dy), { pill: true, maxW: mw }];
  const wAbove = (dy = 60, mw = 300) => (k, r, i, x, y, sz) => [x, f1(y - sz / 2 - dy), { pill: true, maxW: mw }];
  const wRight = (xr = 470) => (k, r, i, x, y, sz) => [f1(x + sz / 2 + 24), f1(y + 16), { anchor: 'start', size: 46, maxW: f1(xr - (x + sz / 2 + 24)), wrap: null }];
  const wAlt = (mw = 300) => (k, r, i, x, y, sz) => [x, f1(k % 2 ? y + sz / 2 + 58 : y - sz / 2 - 58), { pill: true, maxW: mw }];

  /* 03 ── FORK (ทางแยก): a stem rises from what is in doubt and splits to the two options; a lit token waits at the split, wavers, and runs up the
     answer's branch (no answer: it stays at the split, the "?" over it lights). Without options: the line runs from the about to the answer / "?" */
  variant('fork', 'ทางแยก', (d, c) => { art(c, p => { const Fd = QD(d), T_ = QT(d), J = [0, 40], O0 = [-270, -160], O1 = [270, -160], s = 200, A_ = [0, 236], sa = 180;
    if (Fd.hasO) { [O0, O1].forEach((q, i) => { const dd = `M ${J[0]} ${J[1]} C ${J[0]} ${J[1] - 90} ${q[0]} ${q[1] + 160} ${q[0]} ${q[1] + s / 2 + 10}`; drawAt(p.path(dd, { sw: 8, stroke: TL_(.4) }), p, f3(T_.tO(i) - tu(.05)), tu(.3));
        if (Fd.ai === i) { const a = p.path(dd, { sw: 9, stroke: ACC1 }); on(a, p, 0, { draw: [[0, 0], [f3(T_.H - tu(.3)), 0], [T_.H, 1, 'io']] }); } });
      drawAt(p.line(J[0], J[1], A_[0], A_[1] - sa / 2 - 10, { sw: 8, stroke: TL_(.4) }), p, tu(.2), tu(.2));
      [O0, O1].forEach((q, i) => { qthing(p, c, d, 'o', i, q[0], q[1], s, { kind: 'drop' }); qword(p, d, 'o', i, q[0], q[1] - s / 2 - 40, { size: 46, maxW: 360 }); });
      if (Fd.hasA) { qthing(p, c, d, 'a', 0, ...A_, sa, { kind: 'rise' }); qword(p, d, 'a', 0, A_[0] + sa / 2 + 24, A_[1] + 16, { anchor: 'start', size: 46, maxW: 330, wrap: null }); }
      const tk = mvG(p, { x: shakeX(T_.tD0, T_.tD1, 26, .13).concat(Fd.ai >= 0 ? [] : []), o: fadeIn(T_.tQ, .06) }); tk.circle(...J, 20, DOTF());
      qmark(p, d, Fd.hasA ? -230 : 0, Fd.hasA ? 236 : 236, 64); if (Fd.hasN) qans(p, c, d, 0, -120, 200, { wy: -120 + 100 + 56 }); }
    else { const L = [Fd.hasA ? ['a'] : null, Fd.hasN ? ['n'] : null].filter(Boolean), P = L.length === 2 ? [[-250, 60], [250, 60]] : [[-200, 60]];
      if (L.length === 2) drawAt(p.path(`M -120 60 C 0 60 0 -60 120 60`, { sw: 8, stroke: TL_(.4) }), p, tu(.3), tu(.3));
      L.forEach(([r], k) => { qthing(p, c, d, r, 0, ...P[k], 240, { kind: r === 'n' ? 'pop' : 'rise' }); qword(p, d, r, 0, P[k][0], 60 - 120 - 60, { pill: true, maxW: 320, t: r === 'n' ? f3(T_.H + tu(.12)) : undefined }); });
      qmark(p, d, L.length === 2 ? 0 : 160, L.length === 2 ? -110 : 60, L.length === 2 ? 64 : 120); } }); });

  /* 04 ── TOGGLE (สวิตช์ลังเล): the two options at the ends of a switch; the knob in the middle wavers left – right and on H snaps to the answer
     (no answer: it stays in the middle, the "?" in the knob lights). About sits above the switch. Without options: about / answer side by side */
  variant('toggle', 'สวิตช์ลังเล', (d, c) => { art(c, p => { const Fd = QD(d), T_ = QT(d), Y = Fd.hasA ? 120 : 30, XE = 300;
    if (Fd.hasO) { R(mvG(p, { px: 0, py: Y, sx: [[0, .2], [tu(.04), .2], [tu(.34), 1.03, 'out'], [tu(.44), 1, 'soft']], o: fadeIn(tu(.04), .06) }), -455, Y - 120, 910, 240, 120, F(3.6));
      [0, 1].forEach(i => { qthing(p, c, d, 'o', i, i ? XE : -XE, Y, 196, { shape: 'circ' }); qword(p, d, 'o', i, i ? XE : -XE, Y + 120 + 56, { pill: true, maxW: 300 }); });
      const kx = Fd.ai === 0 ? -XE : Fd.ai === 1 ? XE : 0, KX = shakeX(T_.tD0, T_.tD1, 60, .26).concat(kx ? [[f3(T_.H + tu(.14)), kx, 'out']] : []);
      const kg = mvG(p, { x: KX, o: fadeIn(T_.tQ, .06) }); kg.circle(0, Y, 112, { sw: 5, stroke: TL_(.55) }); if (kx) litOn(kg, T_.H).circle(0, Y, 112, { sw: 6, stroke: ACC1 });
      if (!kx) qmark(p, d, 0, Y, 70); else qmark(p, d, 0, Y, 70, { g: kg });
      if (Fd.hasA) { qthing(p, c, d, 'a', 0, -100, -190, 190, { kind: 'drop' }); qword(p, d, 'a', 0, 26, -174, { anchor: 'start', size: 50, maxW: 420, wrap: null }); }
      if (Fd.hasN) qans(p, c, d, 330, -190, 190, { wx: 170, wy: -174, wo: { pill: false, anchor: 'end', size: 50, maxW: 280 } }); }
    else gen(p, c, d); }); });
  /* fallback when a design is about the two options but the line names none: the things present in a row, the "?" above them */
  function gen(p, c, d, y = 60, qy = -200) { const k = QI(d).length; qitems(p, c, d, arr(k, 'row', -420, y - 125, 420, y + 125, 250), { kind: 'drop', w: wBelow(56) }); qmark(p, d, 0, qy, 74); }
  /* about (if any) as a header line at y: icon slot at x + word beside it */
  function header(p, c, d, x, y, s = 180, o = {}) { const Fd = QD(d); if (!Fd.hasA) return false; qthing(p, c, d, 'a', 0, x, y, s, { kind: o.kind || 'drop' }); qword(p, d, 'a', 0, f1(x + s / 2 + 26), f1(y + 18), { anchor: 'start', size: 50, maxW: o.mw || 420, wrap: null }); return true; }

  /* 05 ── DIAL (หน้าปัดลังเล): a half dial with the options at its ends; the needle swings back and forth and settles on the answer on H */
  variant('dial', 'หน้าปัดลังเล', (d, c) => { art(c, p => { const Fd = QD(d), T_ = QT(d); if (!Fd.hasO) return gen(p, c, d);
    const CX = 0, CY = 196, RG = 300, arcP = `M ${CX - RG} ${CY} A ${RG} ${RG} 0 0 1 ${CX + RG} ${CY}`; drawAt(p.path(arcP, { sw: 34 }), p, tu(.04), tu(.4)); drawAt(p.path(arcP, { sw: 26, stroke: C.fill }), p, tu(.04), tu(.4));
    [0, 1].forEach(i => { const x = i ? CX + RG : CX - RG; qthing(p, c, d, 'o', i, x, CY - 20, 180); qword(p, d, 'o', i, x, CY - 20 + 90 + 48, { size: 44, maxW: 260 }); });
    const rf = Fd.ai === 0 ? -62 : Fd.ai === 1 ? 62 : 0, q = k => f3(lerp(T_.tD0, T_.tD1, k)), ng = mvG(p, { px: CX, py: CY, r: [[0, 0], [T_.tD0, 0], [q(.2), -40, 'io'], [q(.45), 38, 'io'], [q(.7), -30, 'io'], [q(.9), 22, 'io'], [q(1), 0, 'io'], [f3(T_.H + tu(.24)), rf, 'out']], o: fadeIn(tu(.4), .06) });
    ng.path(`M ${CX - 13} ${CY} L ${CX} ${CY - 230} L ${CX + 13} ${CY} Z`, { fill: ACC1, sw: 2.4, stroke: ACC1 }); p.circle(CX, CY, 32, F(3.6));
    if (Fd.hasA) header(p, c, d, -380, -232, 170, { mw: 240 }); qmark(p, d, Fd.hasA ? 360 : 0, Fd.hasA ? -232 : -200, 62); if (Fd.hasN) qans(p, c, d, 330, -232, 170, { wx: 230, wy: -216, wo: { pill: false, anchor: 'end', size: 44 } }); }); });

  /* 06 ── SLIDER (สไลเดอร์ลังเล): a track between the options; the knob slides back and forth and settles on the answer's end */
  variant('slider', 'สไลเดอร์ลังเล', (d, c) => { art(c, p => { const Fd = QD(d), T_ = QT(d); if (!Fd.hasO) return gen(p, c, d, 40, -220);
    const TY = 176, XE = 320; R(mvG(p, { px: 0, py: TY, sx: [[0, .1], [tu(.04), .1], [tu(.36), 1.02, 'out'], [tu(.46), 1, 'soft']], o: fadeIn(tu(.04), .05) }), -440, TY - 34, 880, 68, 34, F(3.4));
    [0, 1].forEach(i => { qthing(p, c, d, 'o', i, i ? XE : -XE, -40, 200); qword(p, d, 'o', i, i ? XE : -XE, -40 - 100 - 60, { pill: true, maxW: 280 }); });
    const kx = Fd.ai === 0 ? -XE : Fd.ai === 1 ? XE : 0, kg = mvG(p, { x: shakeX(T_.tD0, T_.tD1, 150, .3).concat([[f3(T_.H + tu(.24)), kx, 'out']]), o: fadeIn(T_.tQ, .06) }); kg.circle(0, TY, 50, F(4)); if (kx) litOn(kg, T_.H).circle(0, TY, 28, DOTF());
    qmark(p, d, 0, Fd.hasA ? -236 : -40, 64); if (Fd.hasA) { qthing(p, c, d, 'a', 0, 0, -40, 180); qword(p, d, 'a', 0, 0, 96, { size: 44, maxW: 300 }); }
    if (Fd.hasN) qans(p, c, d, 0, Fd.hasA ? -236 : -40, 170, Fd.hasA ? { wx: 110, wy: -220, wo: { pill: false, anchor: 'start', size: 46, maxW: 340 } } : { wy: 96, wo: { pill: false, size: 44 } }); }); });

  /* 07 ── RADIO (ตัวเลือกวงกลม): option rows with round choice slots; the choice dot hops between them and lands on the answer (no answer: it
     fades out and the "?" lights). About is the header line */
  variant('radio', 'ตัวเลือกวงกลม', (d, c) => { art(c, p => { const Fd = QD(d), T_ = QT(d); if (!Fd.hasO) return gen(p, c, d, 80, -200);
    const hA = header(p, c, d, -330, -230, 176, { mw: 560 }), Y = hA ? [-20, 210] : [-120, 140], RX = -390, BX = -240, bs = 196;
    [0, 1].forEach(i => { const y = Y[i]; popAt(p, RX, y, T_.tO(i)).circle(RX, y, 48, F(3.6)); qthing(p, c, d, 'o', i, BX, y, bs); qword(p, d, 'o', i, BX + bs / 2 + 30, y + 18, { anchor: 'start', size: 54, maxW: 560, wrap: null }); });
    const yf = Fd.ai >= 0 ? Y[Fd.ai] : Y[0], DY = [[0, f1(Y[0] - yf)], [T_.tD0, f1(Y[0] - yf)]]; let t = T_.tD0, k = 1; while (t + tu(.26) <= T_.tD1) { t += tu(.26); DY.push([f3(t), f1(Y[k % 2] - yf), 'io']); k++; } if (Fd.ai >= 0) DY.push([T_.H, 0, 'io']);
    const dg = mvG(p, { y: DY, o: fadeIn(T_.tQ, .06).concat(Fd.ai >= 0 ? [] : [[T_.H, 1], [f3(T_.H + tu(.1)), 0]]) }); dg.circle(RX, yf, 24, DOTF());
    qmark(p, d, 380, hA ? -230 : Y[0] - 10, 62); if (Fd.hasN) qans(p, c, d, 380, hA ? -230 : -250, 170, { wx: 285, wy: hA ? -214 : -234, wo: { pill: false, anchor: 'end', size: 46, maxW: 220 } }); }); });

  /* 08 ── TABS (แท็บสลับ): one tab per option over a page; the page flips between them, and on H stays on the answer (no answer: both tabs stay, the
     "?" fills the page). About gives the page its title */
  variant('tabs', 'แท็บสลับ', (d, c) => { art(c, p => { const Fd = QD(d), T_ = QT(d); if (!Fd.hasO) return gen(p, c, d);
    const TY = -252, TH = 96, TWd = 420, TX = [-215, 215], PY = -182, PH = 470, bs = 236, BX = -240, BY = 52;
    R(mvG(p, upK(0, PY + PH, tu(.06), .3)), -450, PY, 900, PH, 40, F(3.6));
    const ph = [[T_.tD0, 0]]; for (let t = T_.tD0 + tu(.3), k = 1; t < T_.tD1; t += tu(.3), k++) ph.push([f3(t), k % 2]); if (Fd.ai >= 0) ph.push([T_.H, Fd.ai]); else ph.push([T_.H, -1]);
    const vis = i => showK(ph, i, .08);
    [0, 1].forEach(i => { const x = TX[i], X_ = Fd.op[i], lose = Fd.ai >= 0 && Fd.ai !== i, g0 = mvG(p, { x: glide(i ? 100 : -100, T_.tO(i), f3(T_.tO(i) + tu(.26))), o: fadeIn(T_.tO(i), .05) });
      if (lose) R(g0, x - TWd / 2, TY - TH / 2, TWd, TH, TH / 2, BK); const g = lose ? mvG(g0, { o: [[0, 1], [T_.H, 1], [f3(T_.H + tu(.2)), .45]] }) : g0; R(g, x - TWd / 2, TY - TH / 2, TWd, TH, TH / 2, F(3.4));
      const lt = sub(g); on(lt, p, 0, { o: vis(i) }); R(lt, x - TWd / 2 + 7, TY - TH / 2 + 7, TWd - 14, TH - 14, (TH - 14) / 2, { fill: TA(.2), sw: 0, stroke: 'none' }); if (Fd.ai === i) R(litOn(g, T_.H), x - TWd / 2, TY - TH / 2, TWd, TH, TH / 2, { sw: 5, stroke: ACC1 });
      txt(g, X_.label || '', x, TY + 16, { size: 46, maxW: TWd - 60, weight: 800, color: C.ink });
      const io = vis(i); if (picOf(X_)) put(p, c, { icon: X_.icon }, BX, BY, bs * .72, null, { t: f3(T_.tD0 - tu(.1)), o: io, punch: Fd.ai === i ? T_.H : undefined }); });
    const bx = popAt(p, BX, BY, tu(.2)); R(bx, BX - bs / 2, BY - bs / 2, bs, bs, bs * .24, F(4)); if (Fd.ai >= 0) { R(litOn(bx, T_.H), BX - bs / 2, BY - bs / 2, bs, bs, bs * .24, LIT2()); ripple(p, BX, BY, bs * .58, f3(T_.H + tu(.04))); }
    const qg = sub(p); on(qg, p, 0, { o: [[0, 1], [f3(T_.tD0 - tu(.1)), 1], [T_.tD0, 0]].concat(Fd.ai >= 0 ? [] : [[f3(T_.H - tu(.02)), 0], [T_.H, 1]]) }); qmark(p, d, BX, BY, 90, { g: qg, t: tu(.3) });
    if (Fd.hasA) { const X_ = Fd.ab; if (picOf(X_)) put(p, c, { icon: X_.icon }, 150, BY - 20, 170, null, { t: tu(.3) }); if (X_.label) txt(atG(p, tu(.4)), X_.label, 150, BY + 110, { size: 46, maxW: 520, weight: 800, color: C.ink }); }
    else R(atG(p, tu(.3)), 0, BY - 11, 400, 22, 11, GREY());
    if (Fd.hasN) qans(p, c, d, 330, BY, 170, { wy: BY + 85 + 56 }); }); });

  /* 09 ── POLL (โพลสองแถบ): two poll bars grow together, neck and neck; on H the answer's bar runs on and lights (no answer: they stop even, "?") */
  variant('poll', 'โพลสองแถบ', (d, c) => { art(c, p => { const Fd = QD(d), T_ = QT(d); if (!Fd.hasO) return gen(p, c, d);
    const hA = header(p, c, d, -360, -238, 170, { mw: 520 }), Y = hA ? [-6, 214] : [-110, 150], BX = -350, bs = 180, X0 = -218, X1 = 450, TWd = X1 - X0;
    [0, 1].forEach(i => { const y = Y[i], lose = Fd.ai >= 0 && Fd.ai !== i, win = Fd.ai === i; qthing(p, c, d, 'o', i, BX, y, bs, { kind: 'left' });
      R(mvG(p, { px: X0, py: y, sx: [[0, 0], [T_.tO(i), 0], [f3(T_.tO(i) + tu(.3)), 1, 'out']], o: fadeIn(T_.tO(i), .04) }), X0, y - 36, TWd, 72, 36, F(3.2));
      const e = .5, a = win ? 1 : lose ? .34 : .5, fw = f1((TWd - 16) * a), rg = lose ? mvG(p, { o: [[0, 1], [T_.H, 1], [f3(T_.H + tu(.2)), .45]] }) : p;
      R(mvG(rg, { px: X0 + 8, py: y, sx: [[0, 0], [T_.tD0, 0], [T_.tD1, f3(e / a), 'io'], [T_.H, f3(e / a)], [f3(T_.H + tu(.36)), 1, 'out']] }), X0 + 8, y - 28, fw, 56, 28, { fill: TA(.6), sw: 0, stroke: 'none' });
      qword(p, d, 'o', i, X0 + 8, y - 58, { anchor: 'start', size: 46, maxW: TWd - 20, wrap: null }); });
    qmark(p, d, 400, hA ? -238 : Y[0] - 110, 56); if (Fd.hasN) qans(p, c, d, 360, hA ? -238 : -250, 170, { wx: 265, wy: hA ? -222 : -234, wo: { pill: false, anchor: 'end', size: 46, maxW: 200 } }); }); });

  /* 10 ── COIN (เหรียญเสี่ยง — a flat disc, not a real coin): one big disc turns over and over between the two options (the "?" on its rim side),
     and on H stops on the answer's face (no answer: stops on the "?"). The two options also sit small at the sides */
  variant('coin', 'แผ่นพลิกเสี่ยง', (d, c) => { art(c, p => { const Fd = QD(d), T_ = QT(d); if (!Fd.hasO) return gen(p, c, d);
    const CX = 0, CY = 30, Rd = 150, n = Math.max(2, Math.floor((T_.tD1 - T_.tD0) / tu(.36)));
    const flips = Array.from({ length: n }, (_, k) => f3(lerp(T_.tD0, T_.tD1, k / n))), SX = [[0, 1], [T_.tD0, 1]]; flips.forEach(t => SX.push([t, 1], [f3(t + tu(.15)), 0, 'io'], [f3(t + tu(.3)), 1, 'io'])); SX.push([T_.H, 1], [f3(T_.H + tu(.15)), 0, 'io'], [f3(T_.H + tu(.3)), 1, 'io']);
    const dg = mvG(popAt(p, CX, CY, tu(.2)), { px: CX, py: CY, sx: SX }); dg.circle(CX, CY, Rd, F(4.4)); dg.circle(CX, CY, Rd - 16, SL(1.6)); if (Fd.ai >= 0) litOn(dg, T_.H).circle(CX, CY, Rd, LIT2());
    const face = i => { const K = [[0, 0]]; flips.forEach((t, k) => K.push([f3(t + tu(.15)), k % 2 === i ? 1 : 0])); K.push([f3(T_.H + tu(.15)), Fd.ai === i ? 1 : 0]); return K; };
    [0, 1].forEach(i => { const X_ = Fd.op[i]; if (picOf(X_)) put(p, c, { icon: X_.icon }, CX, CY, 190, null, { t: T_.tD0, o: face(i), mv: { px: CX, py: CY, sx: SX } }); });
    const qo = [[0, 0], [tu(.3), 0], [tu(.4), 1], [T_.tD0, 1], [f3(T_.tD0 + tu(.15)), 0]].concat(Fd.ai >= 0 ? [] : [[f3(T_.H + tu(.15)), 0], [f3(T_.H + tu(.17)), 1]]); const qg = sub(p); on(qg, p, 0, { o: qo }); txt(qg, '?', CX, CY + 60, { size: 170, weight: 800, color: Fd.ai >= 0 ? C.ink : ACC1 });
    [0, 1].forEach(i => { const x = i ? 360 : -360; qthing(p, c, d, 'o', i, x, CY, 176); qword(p, d, 'o', i, x, CY + 88 + 56, { pill: true, maxW: 240 }); });
    if (Fd.hasA) header(p, c, d, -120, -258, 150, { mw: 420 }); if (Fd.hasN) qans(p, c, d, 0, CY, 2 * Rd, { kind: 'none', g: undefined, wy: CY + Rd + 56 }); }); });

  /* 11 ── VENN (สองวงซ้อน): the two options as overlapping circles, the "?" in the shared lens; the circles pulse in turn; on H the answer's circle
     lights and the other fades (no answer: the lens lights with the "?") */
  variant('venn', 'สองวงซ้อน', (d, c) => { art(c, p => { const Fd = QD(d), T_ = QT(d); if (!Fd.hasO) return gen(p, c, d);
    const Rr = 200, Y = Fd.hasA ? 80 : 40, X = [-150, 150], IX = [-236, 236];
    [0, 1].forEach(i => { const x = X[i], lose = Fd.ai >= 0 && Fd.ai !== i, win = Fd.ai === i, X_ = Fd.op[i], g0 = mvG(CL(p), { px: x, py: Y, x: glide(i ? 280 : -280, T_.tO(i), f3(T_.tO(i) + tu(.32)), i ? -12 : 12), o: fadeIn(T_.tO(i), .04) }), g = lose ? mvG(g0, { o: [[0, 1], [T_.H, 1], [f3(T_.H + tu(.3)), .4, 'io']] }) : g0;
      if (win) litOn(g, T_.H).circle(x, Y, Rr - 10, { fill: TA(.14), sw: 0, stroke: 'none' }); g.circle(x, Y, Rr, W(4.4)); const lt = sub(g); on(lt, p, 0, { o: doubtK(T_, i) }); lt.circle(x, Y, Rr, { sw: 5, stroke: TL_(.7) }); if (win) litOn(g, T_.H).circle(x, Y, Rr, { sw: 5, stroke: ACC1 });
      if (picOf(X_)) put(p, c, { icon: X_.icon }, IX[i], Y, 160, null, { t: f3(T_.tO(i) + tu(.2)), mv: { px: IX[i], py: Y, x: glide(i ? 280 : -280, T_.tO(i), f3(T_.tO(i) + tu(.32)), i ? -12 : 12) }, o: lose ? [[0, 1], [T_.H, 1], [f3(T_.H + tu(.3)), .4, 'io']] : undefined, punch: win ? T_.H : undefined });
      else txt(g, X_.label, IX[i], Y + 16, { size: 44, maxW: 180, weight: 800, color: C.ink, wrap: 'mid' });
      qword(p, d, 'o', i, i ? 30 : -30, Y + Rr + 50, { anchor: i ? 'start' : 'end', size: 44, maxW: 300, wrap: null }); });
    qmark(p, d, 0, Y, 58); if (Fd.hasA) header(p, c, d, -120, -260, 150, { mw: 420 }); if (Fd.hasN) qans(p, c, d, 0, Y, 150, { wy: -200 }); }); });

  /* 12 ── THOUGHT (ฟองความคิด): the things in doubt in a row along the bottom; thought circles rise from them one by one into a big round bubble
     that holds the "?" (the answer lands in the bubble) */
  variant('thought', 'ฟองความคิด', (d, c) => { art(c, p => { const Fd = QD(d), T_ = QT(d), L = QI(d).filter(([r]) => r !== 'n'), k = L.length, BX = 230, BY = -130, BR = 170;
    const P = arr(k, 'row', -470, 90, 120, 330, 210); L.forEach(([r, i], j) => { const [x, y, sz] = P[j]; qthing(p, c, d, r, i, x, y, sz, { kind: 'rise' }); qword(p, d, r, i, x, f1(y - sz / 2 - 50), { size: 44, maxW: sz + 30 }); });
    [[60, 60, 22], [110, -10, 32], [-0, 0, 0]].slice(0, 2).forEach(([x, y, r], j) => popAt(p, x, y, f3(T_.tQ - tu(.3) + tu(.12 * j))).circle(x, y, r, F(3.4)));
    popAt(p, BX, BY, f3(T_.tQ - tu(.06))).circle(BX, BY, BR, F(4.4)); qmark(p, d, BX, BY, 110, { plain: true });
    if (Fd.hasN) qans(p, c, d, BX, BY, 230, { kind: 'pop', wy: BY + BR + 50, wo: { pill: true } }); }); });

  /* 13 ── CHAT (แชตถามตอบ): a chat frame; the things in doubt come in as message bubbles on the left; the reply on the right shows typing dots,
     then the answer (or a big "?" when there is none) */
  variant('chat', 'แชตถามตอบ', (d, c) => { art(c, p => { const Fd = QD(d), T_ = QT(d), L = QI(d).filter(([r]) => r !== 'n'), k = L.length, rh = k >= 3 ? 190 : 210, ys = rowXs(k, rh, 18, -40);
    R(mvG(p, upK(0, 330, tu(.02), .3)), -470, -320, 940, 650, 44, F(3.4));
    L.forEach(([r, i], j) => { const y = ys[j], s = rh - 24; qthing(p, c, d, r, i, -330, y, s, { kind: 'left' }); qword(p, d, r, i, -330 + s / 2 + 24, y + 16, { anchor: 'start', size: 46, maxW: 300, wrap: null }); });
    const RX = 300, RY = 170, dots = sub(p); on(dots, p, 0, { o: [[0, 0], [T_.tD0, 0], [f3(T_.tD0 + tu(.06)), 1], [f3(T_.H - tu(.04)), 1], [T_.H, 0]] }); R(dots, RX - 110, RY - 50, 220, 100, 50, F(3.4));
    [-50, 0, 50].forEach((dx, j) => { const g = mvG(dots, { px: RX + dx, py: RY, y: (() => { const K = [[0, 0]]; for (let t = T_.tD0 + tu(.06 * j); t < T_.H - tu(.2); t += tu(.36)) K.push([f3(t), 0], [f3(t + tu(.1)), -12, 'out'], [f3(t + tu(.2)), 0, 'in']); return K; })() }); g.circle(RX + dx, RY, 13, { fill: TL_(.7), sw: 0, stroke: 'none' }); });
    if (Fd.ai < 0) qmark(p, d, RX, RY - 30, 100, { t: T_.H }); if (Fd.hasN) qans(p, c, d, RX, RY - 30, 220, { wx: RX - 130, wy: RY - 14, wo: { pill: false, anchor: 'end', size: 48, maxW: 300 } }); }); });

  /* 14 ── SEARCH (ช่องค้นหา): a search bar slides in, its button holds the "?"; the things in doubt come up as results under it */
  variant('search', 'ช่องค้นหา', (d, c) => { art(c, p => { const Fd = QD(d), T_ = QT(d), k = QI(d).length;
    const bg = mvG(p, { px: -470, py: -230, sx: [[0, 0], [tu(.04), 0], [tu(.36), 1.02, 'out'], [tu(.46), 1, 'soft']], o: fadeIn(tu(.04), .05) }); R(bg, -470, -300, 940, 140, 70, F(3.8));
    const cur = sub(bg); on(cur, p, 0, { o: (() => { const K = [[0, 0]]; for (let t = tu(.4); t < T_.H; t += tu(.3)) K.push([f3(t), 1], [f3(t + tu(.15)), 0]); return K; })() }); cur.line(-410, -262, -410, -198, { sw: 5, stroke: C.ink });
    for (let j = 0; j < 3; j++) R(atG(p, f3(tu(.3) + tu(.06 * j))), -380 + j * 150, -242, 120, 24, 12, GREY());
    qmark(p, d, 392, -230, 56, { t: tu(.3), keep: true }); qitems(p, c, d, arr(k, 'row', -460, -90, 460, 180, 230), { kind: 'rise', w: wBelow(54) }); }); });

  /* 15 ── SPINNER (วงหมุนรอ): a loading ring spins round the "?" while the things in doubt stand in a column beside it; on H the ring closes */
  variant('spinner', 'วงหมุนรอ', (d, c) => { art(c, p => { const Fd = QD(d), T_ = QT(d), k = QI(d).length, CX = k ? -230 : 0, CY = 10, RR = 190;
    p.circle(CX, CY, RR, { sw: 14, stroke: TL_(.12) }); const sp = mvG(p, { px: CX, py: CY, r: [[0, 0], [tu(.3), 0], [f3(T_.H), f1(360 * (T_.H - tu(.3)) / tu(.9))]], o: fadeIn(tu(.3), .06).concat([[T_.H, 1], [f3(T_.H + tu(.1)), 0]]) }); sp.path(arcD(CX, CY, RR, .28), { sw: 14, stroke: TL_(.7) });
    const full = p.path(arcD(CX, CY, RR, 1), { sw: 14, stroke: ACC1 }); on(full, p, 0, { draw: [[0, 0], [T_.H, 0], [f3(T_.H + tu(.3)), 1, 'out']] });
    qmark(p, d, CX, CY, 120, { plain: true }); if (Fd.hasN) qans(p, c, d, CX, CY, 230, { wy: CY + RR + 52 });
    const L = QI(d).filter(([r]) => r !== 'n'), P = arr(L.length, 'col', 120, -300, 300, 320, 200); L.forEach(([r, i], j) => { const [x, y, sz] = P[j]; qthing(p, c, d, r, i, x, y, sz, { kind: 'right' }); qword(p, d, r, i, f1(x + sz / 2 + 22), f1(y + 16), { anchor: 'start', size: 44, maxW: f1(470 - x - sz / 2 - 22), wrap: 'mid' }); }); }); });

  /* 16 ── WANDER (เส้นทางวกวน): a dotted line wanders from the things in doubt up to the "?" (the answer lands at its end) */
  variant('wander', 'เส้นทางวกวน', (d, c) => { art(c, p => { const Fd = QD(d), T_ = QT(d), L = QI(d).filter(([r]) => r !== 'n'), P = arr(L.length, 'row', -470, 110, 200, 330, 210), E = [320, -160];
    L.forEach(([r, i], j) => { const [x, y, sz] = P[j]; qthing(p, c, d, r, i, x, y, sz, { kind: 'drop' }); qword(p, d, r, i, x, f1(y - sz / 2 - 48), { size: 44, maxW: sz + 40 }); });
    const S0 = [P.length ? P[P.length - 1][0] + 40 : -200, 0], pts = [S0, [-120, -60], [-260, -200], [-60, -270], [80, -120], [200, -260], E];
    const n = 26; for (let j = 0; j <= n; j++) { const u = j / n, seg = u * (pts.length - 1), a = Math.floor(Math.min(seg, pts.length - 2)), f = seg - a, x = f1(lerp(pts[a][0], pts[a + 1][0], f)), y = f1(lerp(pts[a][1], pts[a + 1][1], f)); popAt(p, x, y, f3(T_.tQ - tu(.4) + tu(.4 * u))).circle(x, y, 6, { fill: TL_(.55), sw: 0, stroke: 'none' }); }
    qmark(p, d, ...E, 100); if (Fd.hasN) qans(p, c, d, ...E, 220, { wy: E[1] + 110 + 50 }); }); });

  /* 17 ── TILES (ช่องคำถาม): six tiles, all showing a faint "?"; the things in doubt flip up in the first tiles one by one, the last tile keeps the
     big "?" (the answer flips into it on H) */
  variant('tiles', 'ช่องคำถาม', (d, c) => { art(c, p => { const Fd = QD(d), T_ = QT(d), L = QI(d).filter(([r]) => r !== 'n'), s = 210, P = [-1, 0, 1].flatMap(cx => [-1, 1].map(cy => [cx * 250, cy * 140 + 20])).sort((a, b) => a[1] - b[1] || a[0] - b[0]);
    P.forEach(([x, y], j) => { const used = j < L.length || j === 5, g = mvG(p, spinK(x, y, f3(tu(.04 + .04 * j)))); R(g, x - s / 2, y - s / 2, s, s, s * .24, { fill: TL_(.04), sw: 2.6, stroke: TL_(.4) }); if (!used) txt(g, '?', x, y + 34, { size: 100, weight: 800, color: C.mute }); });
    L.forEach(([r, i], j) => { const [x, y] = P[j]; qthing(p, c, d, r, i, x, y, s - 20, { kind: 'flip' }); qword(p, d, r, i, x, f1(y + s / 2 - 4), { size: 40, maxW: s - 10, pill: true }); });
    qmark(p, d, ...P[5], 80); if (Fd.hasN) qans(p, c, d, ...P[5], s - 20, { kind: 'flip', wy: P[5][1] + s / 2 - 4 }); }); });

  /* 18 ── STACK (การ์ดซ้อน): a stack of cards, the top one shows the "?"; on H the top card slides away to show the answer under it (no answer: it
     stays and lights). The things in doubt line up in a column on the left */
  variant('stack', 'การ์ดซ้อน', (d, c) => { art(c, p => { const Fd = QD(d), T_ = QT(d), L = QI(d).filter(([r]) => r !== 'n'), CX = L.length ? 220 : 0, CY = 10, CW = 300, CH = 380;
    [2, 1].forEach(j => R(mvG(p, upK(CX, CY + CH / 2, tu(.04 + .05 * (2 - j)), .3)), CX - CW / 2 + j * 18, CY - CH / 2 - j * 18, CW, CH, 34, F(3)));
    if (Fd.hasN) qans(p, c, d, CX, CY, 230, { kind: 'none', wy: CY + CH / 2 + 50 });
    const tg = mvG(p, Object.assign({ px: CX, py: CY }, Fd.answered && Fd.hasN ? { x: [[0, 0], [T_.H, 0], [f3(T_.H + tu(.3)), 520, 'in']], r: [[0, 0], [T_.H, 0], [f3(T_.H + tu(.3)), 14, 'in']] } : {})); R(tg, CX - CW / 2, CY - CH / 2, CW, CH, 34, F(3.6)); if (!Fd.hasN) qmark(p, d, CX, CY, 110, { g: tg, plain: true, t: tu(.3) }); else txt(atG(tg, tu(.3)), '?', CX, CY + 50, { size: 150, weight: 800, color: C.ink });
    const P = arr(L.length, 'col', -330, -300, -330, 320, 190); L.forEach(([r, i], j) => { const [x, y, sz] = P[j]; qthing(p, c, d, r, i, x, y, sz, { kind: 'left' }); qword(p, d, r, i, f1(x + sz / 2 + 22), f1(y + 16), { anchor: 'start', size: 44, maxW: 190, wrap: 'mid' }); }); }); });

  /* 19 ── BRACKETS (วงเล็บใหญ่): two big round brackets close in round the "?" in the middle; the things in doubt sit in a row under them */
  variant('brackets', 'วงเล็บใหญ่', (d, c) => { art(c, p => { const Fd = QD(d), T_ = QT(d), CY = -120, L = QI(d).filter(([r]) => r !== 'n');
    [-1, 1].forEach(sd => { const g = mvG(p, { x: glide(sd * 200, tu(.1), tu(.4)), o: fadeIn(tu(.1), .05) }); g.path(`M ${sd * 200} ${CY - 170} Q ${sd * 290} ${CY} ${sd * 200} ${CY + 170}`, { sw: 12 }); if (!Fd.answered || Fd.hasN) litOn(g, T_.H).path(`M ${sd * 200} ${CY - 170} Q ${sd * 290} ${CY} ${sd * 200} ${CY + 170}`, { sw: 12, stroke: ACC1 }); });
    qmark(p, d, 0, CY, 120, { plain: true }); if (Fd.hasN) qans(p, c, d, 0, CY, 230, { wx: 0, wy: CY + 175 + 48, wo: { pill: false, size: 44 } });
    const P = arr(L.length, 'row', -470, 150, 470, 330, 180); L.forEach(([r, i], j) => { const [x, y, sz] = P[j]; qthing(p, c, d, r, i, x, y, sz, { kind: 'rise' }); qword(p, d, r, i, f1(x + sz / 2 + 20), f1(y + 16), { anchor: 'start', size: 42, maxW: f1(L.length > 1 ? 170 : 300), wrap: 'mid' }); }); }); });

  /* 20 ── QUESTION RING (วงเครื่องหมายคำถาม): small "?" marks circle round what is in doubt in the middle; on H they gather into one */
  variant('qring', 'วงเครื่องหมายคำถาม', (d, c) => { art(c, p => { const Fd = QD(d), T_ = QT(d), L = QI(d), main = L[0], rest = L.slice(1), CX = rest.length ? -170 : 0, CY = 20, RO = 220;
    if (main) { qthing(p, c, d, main[0], main[1], CX, CY, 240, { kind: 'pop' }); qword(p, d, main[0], main[1], CX, CY - RO - 52, { pill: true, maxW: 320 }); }
    for (let j = 0; j < 6; j++) { const a0 = j * 60, pts = Array.from({ length: 13 }, (_, q) => { const a = rad(a0 + q * 30); return [f1(CX + RO * Math.cos(a)), f1(CY + RO * Math.sin(a))]; }), fin = pts[12];
      const PK = pathK(pts, T_.tQ, T_.H, fin, 24, u => u), g = mvG(p, { px: fin[0], py: fin[1], x: PK.x, y: PK.y, o: [[0, 0], [f3(T_.tQ + tu(.04 * j)), 0], [f3(T_.tQ + tu(.04 * j) + tu(.08)), 1], [T_.H, 1], [f3(T_.H + tu(.12)), 0]] }); g.circle(...fin, 34, F(3)); txt(g, '?', fin[0], fin[1] + 18, { size: 46, weight: 800, color: C.ink }); }
    qmark(p, d, CX + RO * .72, CY - RO * .72, 60, { t: T_.H });
    const P = arr(rest.length, 'col', 330, -300, 330, 320, 196); rest.forEach(([r, i], j) => { const [x, y, sz] = P[j]; qthing(p, c, d, r, i, x, y, sz, { kind: 'right' }); qword(p, d, r, i, f1(x - sz / 2 - 22), f1(y + 16), { anchor: 'end', size: 42, maxW: 150, wrap: 'mid', t: r === 'n' ? f3(T_.H + tu(.12)) : undefined }); }); }); });

  /* a generic design: the things in doubt by an arrangement + its labels, the "?" (or the answer) at Q; o.motif(p, T_, Fd) draws the design's own parts first */
  function gdesign(p, c, d, o) { const Fd = QD(d), T_ = QT(d), L = QI(d).filter(([r]) => r !== 'n'); if (o.motif) o.motif(p, T_, Fd, L);
    const P = o.pos(L.length); L.forEach(([r, i], j) => { const [x, y, sz] = P[j]; const ex = typeof o.slot === 'function' ? o.slot(j, x, y, sz) : (o.slot || {}); qthing(p, c, d, r, i, x, y, sz, Object.assign({ kind: o.kind || 'pop' }, ex));
      const w = o.w(j, r, i, x, y, sz, L.length); if (w) qword(p, d, r, i, w[0], w[1], w[2] || {}); });
    const [qx, qy, qr, qo] = o.q(L.length); qmark(p, d, qx, qy, qr, qo || {}); if (Fd.hasN) qans(p, c, d, qx, qy, o.ns || Math.max(190, qr * 2), Object.assign({}, o.nw ? o.nw(qx, qy) : {})); return { Fd, T_, L, P }; }

  /* 21 ── QUIZ CARD (การ์ดตอบคำถาม): a card with the question line on top (what is in doubt) and the choices as buttons under it; the "?" sits on the
     card's top edge */
  variant('quiz', 'การ์ดตอบคำถาม', (d, c) => { art(c, p => { gdesign(p, c, d, { motif: (p, T_) => { R(mvG(p, upK(0, 320, tu(.02), .3)), -440, -280, 880, 600, 40, F(3.6)); },
    pos: k => k === 1 ? [[0, 30, 250]] : k === 2 ? [[-200, 30, 230], [200, 30, 230]] : [[-280, 50, 190], [0, 50, 190], [280, 50, 190]], kind: 'pop',
    w: (j, r, i, x, y, sz, k) => [x, f1(y + sz / 2 + 54), { pill: true, maxW: k === 3 ? 250 : 340 }], q: k => [0, -280, 64], nw: (x, y) => ({ wy: -170 }), ns: 170 }); }); });

  /* 22 ── RADAR (คลื่นค้นหา): rings spread out from the "?" low in the middle; the things in doubt show up round it like blips, one by one */
  variant('radar', 'คลื่นค้นหา', (d, c) => { art(c, p => { gdesign(p, c, d, { motif: (p, T_) => { [140, 260, 380].forEach((r, j) => drawAt(p.path(`M ${-r} 260 A ${r} ${r} 0 0 1 ${r} 260`, { sw: 2.6, stroke: TL_(.35) }), p, f3(tu(.04 + .06 * j)), tu(.4)));
        for (let t = tu(.5); t < T_.H; t += tu(.4)) rippleE(p, 0, 260, 300, 300, f3(t)); },
    pos: k => [[-330, -10, 190], [330, -10, 190], [0, -170, 190]].slice(0, k), kind: 'pop', w: (j, r, i, x, y, sz) => j < 2 ? [x, f1(y + sz / 2 + 52), { size: 44, maxW: 300 }] : [f1(x + sz / 2 + 24), f1(y + 16), { anchor: 'start', size: 44, maxW: 230, wrap: null }],
    q: k => [0, 196, 90], nw: (x, y) => ({ wx: 130, wy: 212, wo: { pill: false, anchor: 'start', size: 44 } }), ns: 180 }); }); });

  /* 23 ── FOCUS (กรอบส่อง): corner marks hunt from one thing to the next while the doubt plays, then lock on the answer (or the "?") */
  variant('focus', 'กรอบส่อง', (d, c) => { art(c, p => { const r = gdesign(p, c, d, { pos: k => arr(k, 'row', -470, -150, 470, 150, 250).map(q => [q[0], -20, q[2]]), kind: 'pop',
      w: (j, r, i, x, y, sz) => [x, f1(y - sz / 2 - 56), { pill: true, maxW: 280 }], q: k => [0, 250, 62], nw: () => ({ wx: 100, wy: 266, wo: { pill: false, anchor: 'start', size: 44 } }), ns: 170 });
    const { Fd, T_, P } = r; if (!P.length) return; const tgt = Fd.ai >= 0 ? P[QI(d).findIndex(([q, i]) => q === 'o' && i === Fd.ai)] : null, fin = tgt ? [tgt[0], tgt[1], tgt[2] / 2 + 16] : [0, 250, 84], AL = 46;
    const seq = [[T_.tD0, [P[0][0], P[0][1], P[0][2] / 2 + 28]]]; for (let t = T_.tD0 + tu(.3), j = 1; t < T_.tD1; t += tu(.3), j++) { const q = P[j % P.length]; seq.push([f3(t), [q[0], q[1], q[2] / 2 + 28]]); } seq.push([T_.H, fin]);
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sy]) => { const at = q => [q[0] + sx * q[2], q[1] + sy * q[2]], F_ = at(fin), kx = [], ky = [];
      seq.forEach(([t, q], i) => { const [x, y] = at(q); if (!i) { kx.push([0, x], [t, x]); ky.push([0, y], [t, y]); } else { const ta = f3(t - tu(.2)); kx.push([ta, kx[kx.length - 1][1]], [f3(t), x]); ky.push([ta, ky[ky.length - 1][1]], [f3(t), y]); } });
      const cg = mvG(p, { x: offK(kx, F_[0]), y: offK(ky, F_[1]), o: fadeIn(T_.tD0, .06) }), dd = `M ${F_[0]} ${F_[1] - sy * AL} L ${F_[0]} ${F_[1]} L ${F_[0] - sx * AL} ${F_[1]}`; cg.path(dd, { sw: 7, stroke: TL_(.75) }); litOn(cg, T_.H).path(dd, { sw: 8, stroke: ACC1 }); }); }); });

  /* 24 ── SCANNER (เส้นสแกน): a frame holds the things in doubt; a scan line sweeps across it back and forth during the doubt; the "?" on the right */
  variant('scanner', 'เส้นสแกน', (d, c) => { art(c, p => { gdesign(p, c, d, { motif: (p, T_) => { R(mvG(p, upK(-90, 330, tu(.02), .3)), -470, -320, 760, 650, 40, F(3.4));
        const sg = mvG(CL(p), { x: (() => { const K = [[0, 0], [T_.tD0, 0]]; let t = T_.tD0, k = 1; while (t + tu(.4) <= T_.H) { t += tu(.4); K.push([f3(t), k % 2 ? 680 : 0, 'io']); k++; } return K; })(), o: [[0, 0], [T_.tD0, 0], [f3(T_.tD0 + tu(.06)), 1], [T_.H, 1], [f3(T_.H + tu(.1)), 0]] }); sg.line(-440, -300, -440, 310, { sw: 6, stroke: ACC1 }); },
    pos: k => arr(k, 'col', -110, -305, -110, 315, 200).map(q => [k === 4 ? q[0] - 80 : -230, q[1], q[2]]), kind: 'left', w: (j, r, i, x, y, sz) => [f1(x + sz / 2 + 20), f1(y + 16), { anchor: 'start', size: 44, maxW: f1(270 - x - sz / 2 - 20), wrap: 'mid' }],
    q: k => [390, 20, 72], nw: () => ({ wy: 150 }), ns: 160 }); }); });

  /* 25 ── ELLIPSIS (จุดลังเล): the things in doubt in a row; three dots pulse after them, then the "?" (or the answer) lands at the end of the row */
  variant('ellipsis', 'จุดลังเล', (d, c) => { art(c, p => { const L = QI(d).filter(([r]) => r !== 'n'), k = L.length, s = k >= 3 ? 170 : 210, xs = rowXs(k + 1, s, 90, -40);
    gdesign(p, c, d, { motif: (p, T_) => { const x0 = xs[k] - s / 2 - 70; [0, 1, 2].forEach(j => { const g = mvG(p, { px: x0 + j * 26, py: 30, s: (() => { const K = [[0, 1]]; for (let t = T_.tQ + tu(.07 * j); t < T_.H - tu(.1); t += tu(.36)) K.push([f3(t), 1], [f3(t + tu(.1)), 1.5, 'out'], [f3(t + tu(.2)), 1]); return K; })(), o: fadeIn(f3(T_.tQ - tu(.1)), .06) }); g.circle(x0 + j * 26, 30, 9, { fill: TL_(.7), sw: 0, stroke: 'none' }); }); },
      pos: () => xs.slice(0, k).map(x => [x, 30, s]), kind: 'pop', w: wAlt(260), q: () => [xs[k] + 20, 30, Math.min(100, s / 2)], ns: s, nw: () => ({ wy: 30 + s / 2 + 56 }) }); }); });

  /* 26 ── SQUIGGLE (ขีดใต้ลังเล): the things in doubt in a column with their words; a wavy line draws under each word in turn; the "?" on the right */
  variant('squiggle', 'ขีดใต้ลังเล', (d, c) => { art(c, p => { const r = gdesign(p, c, d, { pos: k => arr(k, 'col', -360, -300, -360, 320, 196), kind: 'left',
      w: (j, r, i, x, y, sz) => [f1(x + sz / 2 + 26), f1(y + 4), { anchor: 'start', size: 52, maxW: 330, wrap: null }], q: () => [360, 10, 90], ns: 200, nw: () => ({ wy: 150 }) });
    const { T_, P } = r; P.forEach(([x, y, sz], j) => { const x0 = x + sz / 2 + 26, n = 12, pts = Array.from({ length: n + 1 }, (_, q) => [f1(x0 + q * 22), f1(y + 30 + (q % 2 ? 8 : -6))]); drawAt(p.path(pathOf(pts, false), { sw: 4, stroke: TL_(.6) }), p, f3(T_.tD0 + tu(.2 * j)), tu(.24)); }); }); });

  /* 27 ── TREE (คำถามแตกกิ่ง): the "?" at the top, lines branch down from it to each thing in doubt; on H the answer's branch lights */
  variant('tree', 'คำถามแตกกิ่ง', (d, c) => { art(c, p => { const Fd = QD(d), T_ = QT(d), L = QI(d).filter(([r]) => r !== 'n'), k = L.length, P = arr(k, 'row', -470, 70, 470, 310, 210), Q = [0, -220];
    P.forEach(([x, y, sz], j) => { const dd = `M ${Q[0]} ${Q[1] + 70} C ${Q[0]} ${Q[1] + 160} ${x} ${y - sz / 2 - 120} ${x} ${y - sz / 2 - 8}`; drawAt(p.path(dd, { sw: 5, stroke: TL_(.4) }), p, f3(T_.tQ + tu(.06 * j)), tu(.3));
      const [r, i] = L[j]; if (r === 'o' && Fd.ai === i) { const a = p.path(dd, { sw: 7, stroke: ACC1 }); on(a, p, 0, { draw: [[0, 0], [f3(T_.H - tu(.3)), 0], [T_.H, 1, 'io']] }); } });
    L.forEach(([r, i], j) => { const [x, y, sz] = P[j]; qthing(p, c, d, r, i, x, y, sz, { kind: 'rise' }); qword(p, d, r, i, x, f1(y + sz / 2 + 4 > 300 ? y - sz / 2 - 150 : y + sz / 2 + 4), { size: 40, maxW: sz + 40, pill: true }); });
    qmark(p, d, ...Q, 72, { t: tu(.12) }); if (Fd.hasN) qans(p, c, d, ...Q, 170, { wx: 110, wy: Q[1] + 16, wo: { pill: false, anchor: 'start', size: 46 } }); }); });

  /* 28 ── LIDS (ฝาปิดคำถาม): each thing in doubt sits under a lid with a "?"; the lids lift one by one; the last lid (the answer's) lifts on H */
  variant('lids', 'ฝาปิดคำถาม', (d, c) => { art(c, p => { const Fd = QD(d), T_ = QT(d), L = QI(d), k = L.length, P = arr(k, 'row', -470, -100, 470, 200, 240);
    L.forEach(([r, i], j) => { const [x, y, sz] = P[j], cs = sz + 18, rv = r === 'n' ? T_.H : f3(Math.min(T_.tD1, T_.tQ + tu(.3 * j)));
      qthing(p, c, d, r, i, x, y, sz, { t: f3(rv - tu(.02)), kind: 'none' }); qword(p, d, r, i, x, f1(y - sz / 2 - 56), { pill: true, maxW: 260, t: f3(rv + tu(.16)) });
      const K = Object.assign(fallK(x, y + cs / 2, f3(tu(.06 + .06 * j)), f3(tu(.32 + .06 * j)), 380), {}); K.y = K.y.concat([[rv, 0], [f3(rv + tu(.3)), -460, 'in']]); K.o = K.o.concat([[f3(rv + tu(.2)), 1], [f3(rv + tu(.3)), 0]]);
      const cg = mvG(CL(p), K); R(cg, x - cs / 2, y - cs / 2, cs, cs, cs * .24, F(4.4)); txt(cg, '?', x, y + 40, { size: 110, weight: 800, color: C.mute }); });
    if (!Fd.hasN && Fd.ai < 0) qmark(p, d, 0, 270, 58, { t: T_.H }); }); });

  /* 29 ── TIMELINE (เส้นต่อคำถาม): a line runs across with a node per thing in doubt and the "?" at its end; the line lights to the end on H */
  variant('qline', 'เส้นต่อคำถาม', (d, c) => { art(c, p => { const r = gdesign(p, c, d, { motif: (p, T_) => { drawAt(p.line(-460, 40, 460, 40, { sw: 6, stroke: TL_(.4) }), p, tu(.02), tu(.4)); const a = p.line(-460, 40, 330, 40, { sw: 8, stroke: ACC1 }); on(a, p, 0, { draw: [[0, 0], [T_.tD0, 0], [T_.H, 1, 'io']] }); },
      pos: k => rowXs(k, 190, k >= 3 ? 46 : 90, -130).map(x => [x, 40, 190]), kind: 'drop', w: wAlt(260), q: () => [370, 40, 80], ns: 180, nw: () => ({ wy: 40 - 90 - 56 }) }); }); });

  /* 30 ── NOTCH (ช่องต่อคำถาม): a slot with a notch waits on the right holding the "?"; the things in doubt stand on the left; on H the answer piece
     fits into the slot (no answer: the "?" in the slot lights) */
  variant('notch', 'ช่องต่อคำถาม', (d, c) => { art(c, p => { const S_ = [230, 30], ss = 300; gdesign(p, c, d, { motif: (p, T_) => drawAt(p.path(notchD(...S_, ss + 26, 'round'), DASH(.5)), p, tu(.04), tu(.4)),
    pos: k => arr(k, 'col', -260, -300, -260, 320, 196), kind: 'left', w: (j, r, i, x, y, sz) => [f1(x + sz / 2 + 22), f1(y + 16), { anchor: 'start', size: 44, maxW: 170, wrap: 'mid' }],
    q: () => [S_[0], S_[1], 110, { plain: true }], ns: ss, nw: () => ({ wy: S_[1] + ss / 2 + 52 }) }); }); });
  const notchD = (x, y, s, kind) => { const h = s / 2, r = s * .2, n = s * .16, top = kind === 'tab' ? `L ${f1(x - n)} ${f1(y - h)} L ${x} ${f1(y - h - n * 1.1)} L ${f1(x + n)} ${f1(y - h)}` : `L ${f1(x - n)} ${f1(y - h)} A ${f1(n)} ${f1(n)} 0 0 0 ${f1(x + n)} ${f1(y - h)}`;
    return `M ${f1(x - h + r)} ${f1(y - h)} ${top} L ${f1(x + h - r)} ${f1(y - h)} Q ${f1(x + h)} ${f1(y - h)} ${f1(x + h)} ${f1(y - h + r)} L ${f1(x + h)} ${f1(y + h - r)} Q ${f1(x + h)} ${f1(y + h)} ${f1(x + h - r)} ${f1(y + h)} L ${f1(x - h + r)} ${f1(y + h)} Q ${f1(x - h)} ${f1(y + h)} ${f1(x - h)} ${f1(y + h - r)} L ${f1(x - h)} ${f1(y - h + r)} Q ${f1(x - h)} ${f1(y - h)} ${f1(x - h + r)} ${f1(y - h)} Z`; };

  /* 31 ── HONEYCOMB (รังผึ้งคำถาม): the "?" hexagon in the middle, the things in doubt in hexagons round it */
  variant('comb', 'รังผึ้งคำถาม', (d, c) => { art(c, p => { const hx = (a, rr = 236) => [f1(rr * Math.cos(rad(a))), f1(20 + rr * Math.sin(rad(a)))];
    gdesign(p, c, d, { motif: (p, T_) => popAt(p, 0, 20, tu(.1)).path(hexD(0, 20, 130), F(4.4)), pos: k => [hx(180), hx(0), hx(-90, 220), hx(90, 220)].slice(0, k).map(q => [q[0], q[1], 230]), kind: 'spin', slot: { shape: 'hex' },
      w: (j, r, i, x, y, sz) => j < 2 ? [x, f1(y + sz / 2 + 44), { size: 42, maxW: 260 }] : [f1(x + sz / 2 + 10), f1(y + 16), { anchor: 'start', size: 42, maxW: 200, wrap: null }], q: () => [0, 20, 90, { plain: true }], ns: 240, nw: () => ({ wy: 20 + 120 + 50 }) }); }); });

  /* 32 ── TARGET (เป้าคำถาม): rings round the "?" at the centre; the things in doubt sit on the outer ring */
  variant('qtarget', 'เป้าคำถาม', (d, c) => { art(c, p => { const CX = 0, CY = 20; gdesign(p, c, d, { motif: (p, T_) => { [250, 150].forEach((r, j) => drawAt(p.circle(CX, CY, r, { sw: 3, stroke: TL_(j ? .55 : .4) }), p, f3(tu(.02 + .08 * j)), tu(.4))); },
    pos: k => [[-330, 20], [330, 20], [0, -255], [0, 255]].slice(0, k).map((q, j) => [q[0], q[1], j < 2 ? 200 : 170]), kind: 'pop', slot: { shape: 'circ' },
    w: (j, r, i, x, y, sz) => j < 2 ? [x, f1(y + sz / 2 + 48), { size: 42, maxW: 200 }] : [f1(x + sz / 2 + 18), f1(y + 16), { anchor: 'start', size: 42, maxW: 260, wrap: null }], q: () => [CX, CY, 96], ns: 230, nw: () => ({ wy: CY + 190 }) }); }); });

  /* 33 ── FUNNEL (กรวยคัดคำถาม): the things in doubt drop into a funnel one by one; the "?" (or the answer) comes out of the spout below */
  variant('qfunnel', 'กรวยคัดคำถาม', (d, c) => { art(c, p => { const Fd = QD(d), T_ = QT(d), L = QI(d).filter(([r]) => r !== 'n'), FD = 'M -200 -30 L 200 -30 L 74 110 L 74 150 L -74 150 L -74 110 Z';
    drawAt(p.path(FD, F(4.4)), p, tu(.04), tu(.4)); const P = arr(L.length, 'row', -470, -330, 470, -130, 190);
    L.forEach(([r, i], j) => { const [x, y, sz] = P[j]; qthing(p, c, d, r, i, x, y, sz, { kind: 'drop' }); qword(p, d, r, i, x, f1(y + sz / 2 + 48), { size: 40, maxW: sz + 20 }); });
    const O = [0, 262]; qmark(p, d, ...O, 74, { t: f3(T_.H - tu(.2)) }); if (Fd.hasN) qans(p, c, d, ...O, 170, { wx: 120, wy: O[1] + 16, wo: { pill: false, anchor: 'start', size: 46 } }); }); });

  /* 34 ── SPIRAL (เกลียวคำถาม): a spiral winds in toward the "?" in the middle; the things in doubt stand round the outside */
  variant('qspiral', 'เกลียวคำถาม', (d, c) => { art(c, p => { const CX = 0, CY = 20; gdesign(p, c, d, { motif: (p, T_) => { const pts = Array.from({ length: 80 }, (_, q) => { const a = rad(q * 9), rr = 230 - q * 2.1; return [f1(CX + rr * Math.cos(a)), f1(CY + rr * .82 * Math.sin(a))]; }); drawAt(p.path(pathOf(pts, false), { sw: 3, stroke: TL_(.4) }), p, tu(.1), f3(T_.tQ - tu(.1))); },
    pos: k => [[-370, -150], [370, 170], [370, -150], [-370, 170]].slice(0, k).map(q => [q[0], q[1], 180]), kind: 'pop', w: (j, r, i, x, y, sz) => [x, y < 0 ? f1(y + sz / 2 + 46) : f1(y - sz / 2 - 30), { size: 40, maxW: 220 }],
    q: () => [CX, CY, 88], ns: 200, nw: () => ({ wy: CY + 150 }) }); }); });

  /* 35 ── CHECK ROWS (แถวถามทีละข้อ): a row per thing in doubt with a round "?" slot at its start; the slots turn over one by one; the answer's slot
     lights */
  variant('qrows', 'แถวถามทีละข้อ', (d, c) => { art(c, p => { const Fd = QD(d), T_ = QT(d), L = QI(d), k = L.length, rh = k >= 4 ? 166 : k === 3 ? 206 : 230, ys = rowXs(k, rh, 0, 0), CXq = -400, BX = -250, bs = rh - 22;
    L.forEach(([r, i], j) => { const y = ys[j], g = popAt(p, CXq, y, f3(r === 'n' ? T_.H - tu(.1) : (r === 'a' ? T_.tA : T_.tO(i)))); g.circle(CXq, y, 50, F(3.6)); const lit = (r === 'o' && Fd.ai === i) || r === 'n';
      const qq = sub(g); on(qq, p, 0, { o: lit ? [[0, 1], [T_.H, 1], [f3(T_.H + tu(.08)), 0]] : [[0, 1]] }); txt(qq, '?', CXq, y + 24, { size: 66, weight: 800, color: C.mute });
      if (lit) { const m = popAt(p, CXq, y, T_.H); m.circle(CXq, y, 24, DOTF()); }
      qthing(p, c, d, r, i, BX, y, bs, { kind: 'left' }); qword(p, d, r, i, BX + bs / 2 + 30, y + 18, { anchor: 'start', size: 50, maxW: 560, wrap: null, t: r === 'n' ? f3(T_.H + tu(.12)) : undefined }); });
    if (!Fd.answered) qmark(p, d, 380, ys[0], 60, { t: T_.H }); }); });

  /* 36 ── BOTH WAYS (ลูกศรสองทาง): a two-headed arrow between the things in doubt, the "?" riding its middle and sliding back and forth */
  variant('twoway', 'ลูกศรสองทาง', (d, c) => { art(c, p => { const Fd = QD(d), T_ = QT(d), L = QI(d).filter(([r]) => r !== 'n'), k = L.length, P = k >= 2 ? [[-320, 0, 220], [320, 0, 220]].concat(k === 3 ? [[0, -230, 170]] : []) : [[-280, 20, 240]];
    L.forEach(([r, i], j) => { const [x, y, sz] = P[j]; qthing(p, c, d, r, i, x, y, sz, { kind: j ? 'right' : 'left' }); qword(p, d, r, i, j === 2 ? x + sz / 2 + 22 : x, j === 2 ? y + 16 : f1(y + sz / 2 + 54), j === 2 ? { anchor: 'start', size: 44, maxW: 200, wrap: null } : { pill: true, maxW: 300 }); });
    const ax0 = k >= 2 ? -190 : -140, ax1 = k >= 2 ? 190 : 380; const ag = sub(p); drawAt(ag.line(ax0, 0, ax1, 0, { sw: 7, stroke: TL_(.55) }), p, f3(T_.tQ - tu(.2)), tu(.2)); [[ax0, 1], [ax1, -1]].forEach(([x, sd]) => popAt(p, x, 0, T_.tQ).path(`M ${x + sd * 30} -24 L ${x} 0 L ${x + sd * 30} 24`, { sw: 7, stroke: TL_(.55) }));
    const mid = (ax0 + ax1) / 2, qg = mvG(p, { x: shakeX(T_.tD0, T_.tD1, k >= 2 ? 70 : 0, .3) }); if (Fd.ai < 0) qmark(p, d, mid, 0, 64, { g: qg }); if (Fd.hasN) qans(p, c, d, k >= 2 ? 0 : 280, k >= 2 ? 200 : 20, 180, { wy: k >= 2 ? 200 - 90 - 50 : 150 }); else qmark(p, d, mid, 0, 64); }); });

  /* 37 ── ZIGZAG (ทางซิกแซก): the things in doubt sit on a zigzag that climbs to the "?" at the top right */
  variant('zigq', 'ทางซิกแซก', (d, c) => { art(c, p => { const pts = [[-380, 210], [-150, -40], [80, 190], [300, -150]], Fd = QD(d), T_ = QT(d), L = QI(d).filter(([r]) => r !== 'n'), k = L.length;
    drawAt(p.path(pathOf(pts, false), { sw: 5, stroke: TL_(.4) }), p, tu(.04), tu(.5)); const P = pts.slice(0, 3).slice(0, k);
    L.forEach(([r, i], j) => { const [x, y] = P[j]; qthing(p, c, d, r, i, x, y, 190, { kind: 'pop' }); qword(p, d, r, i, x, j % 2 ? f1(y - 95 - 44) : f1(y + 95 + 50), { size: 42, maxW: 240 }); });
    qmark(p, d, ...pts[3], 84); if (Fd.hasN) qans(p, c, d, ...pts[3], 200, { wy: pts[3][1] + 100 + 50 }); }); });

  /* 38 ── METER (เกจความมั่นใจ): a tall meter fills while the doubt plays and tops out at the "?" (or the answer) on H; the things in doubt on the left */
  variant('qmeter', 'เกจความมั่นใจ', (d, c) => { art(c, p => { const MX = 260; gdesign(p, c, d, { motif: (p, T_) => { R(mvG(p, upK(MX, 320, tu(.04), .34)), MX - 56, -150, 112, 470, 50, F(3.6));
        R(mvG(p, { px: MX, py: 306, sy: [[0, 0], [T_.tD0, 0], [T_.H, 1, 'io']] }), MX - 42, -136, 84, 442, 40, { fill: TA(.5), sw: 0, stroke: 'none' }); },
    pos: k => arr(k, 'col', -300, -300, -300, 320, 196), kind: 'left', w: (j, r, i, x, y, sz) => [f1(x + sz / 2 + 22), f1(y + 16), { anchor: 'start', size: 46, maxW: 260, wrap: null }],
    q: () => [MX, -250, 72], ns: 170, nw: () => ({ wx: MX - 110, wy: -234, wo: { pill: false, anchor: 'end', size: 44 } }) }); }); });

  /* 39 ── WAVE (คลื่นคำถาม): the things in doubt ride a wave; a "?" token bobs along it and stops at the end */
  variant('qwave', 'คลื่นคำถาม', (d, c) => { art(c, p => { const Fd = QD(d), T_ = QT(d), L = QI(d).filter(([r]) => r !== 'n'), k = L.length, wy = x => f1(40 + 90 * Math.sin(x / 140)), xs = rowXs(k, 190, 60, -110);
    drawAt(p.path(pathOf(Array.from({ length: 41 }, (_, q) => { const x = -470 + q * 23.5; return [f1(x), wy(x)]; }), false), { sw: 4, stroke: TL_(.4) }), p, tu(.02), tu(.5));
    L.forEach(([r, i], j) => { const x = xs[j], y = wy(x); qthing(p, c, d, r, i, x, y, 190, { kind: 'pop' }); qword(p, d, r, i, x, y > 40 ? f1(y + 95 + 50) : f1(y - 95 - 40), { size: 42, maxW: 230 }); });
    const E = [380, wy(380)]; if (Fd.hasN) qans(p, c, d, E[0], E[1] - 20, 170, { wy: E[1] + 120 }); { const pts = Array.from({ length: 13 }, (_, q) => { const x = -420 + q * 800 / 12; return [f1(x), f1(wy(x) - 70)]; }), P = pathK(pts, T_.tQ, T_.H, [380, f1(wy(380) - 70)], 24, u => u); qmark(p, d, 380, f1(wy(380) - 70), 56, { g: mvG(p, { px: 380, py: wy(380) - 70, x: P.x, y: P.y }) }); } }); });

  /* 40 ── FLIP CARD (การ์ดพลิกตอบ): one big card shows the "?"; it turns over on H to the answer (no answer: it turns back to the lit "?"); the things in
     doubt line the left side */
  variant('flipq', 'การ์ดพลิกตอบ', (d, c) => { art(c, p => { const Fd = QD(d), T_ = QT(d), L = QI(d).filter(([r]) => r !== 'n'), CX = L.length ? 210 : 0, CY = 10, CW = 330, CH = 420, flip = [[0, 1], [f3(T_.H - tu(.14)), 1], [T_.H, 0, 'in'], [f3(T_.H + tu(.14)), 1, 'out']];
    const cg = mvG(popAt(p, CX, CY, tu(.12)), { px: CX, py: CY, sx: flip }); R(cg, CX - CW / 2, CY - CH / 2, CW, CH, 36, F(4.4)); if (!Fd.hasN && Fd.ai < 0) {} 
    const qg = sub(p); on(qg, p, 0, { o: [[0, 0], [tu(.2), 0], [tu(.26), 1], [T_.H, 1], [f3(T_.H + tu(.01)), Fd.answered ? 0 : 1]] }); qmark(p, d, CX, CY, 120, { g: mvG(qg, { px: CX, py: CY, sx: flip }), plain: true, t: tu(.2) });
    if (Fd.hasN) qans(p, c, d, CX, CY, 250, { kind: 'none', t: T_.H, K: { px: CX, py: CY, sx: [[0, 0], [T_.H, 0], [f3(T_.H + tu(.14)), 1, 'out']], o: [[0, 0], [T_.H, 0], [f3(T_.H + tu(.01)), 1]] }, wy: CY + CH / 2 + 50 });
    const P = arr(L.length, 'col', -300, -300, -300, 320, 190); L.forEach(([r, i], j) => { const [x, y, sz] = P[j]; qthing(p, c, d, r, i, x, y, sz, { kind: 'left' }); qword(p, d, r, i, f1(x + sz / 2 + 20), f1(y + 16), { anchor: 'start', size: 42, maxW: 150, wrap: 'mid' }); }); }); });

  /* 41 ── DIAGONAL (ทแยงคำถาม): the things in doubt in the upper-left half, the "?" alone in the lower-right half; a seam between */
  variant('qdiag', 'ทแยงคำถาม', (d, c) => { art(c, p => { gdesign(p, c, d, { motif: (p, T_) => drawAt(p.line(-470, 300, 470, -300, { sw: 3, stroke: TL_(.45) }), p, tu(.02), tu(.36)),
    pos: k => [[-300, -150, 200], [-80, -150, 0], [-300, 110, 190]].slice(0, 0).concat(k === 1 ? [[-260, -110, 240]] : k === 2 ? [[-330, -170, 196], [-100, -170, 196]] : [[-360, -190, 176], [-150, -190, 176], [-360, 50, 176]]), kind: 'left',
    w: (j, r, i, x, y, sz) => [x, f1(y + sz / 2 + 46), { size: 40, maxW: sz + 30 }], q: () => [270, 150, 110], ns: 230, nw: () => ({ wy: 150 - 115 - 50 }) }); }); });

  /* 42 ── GROWING "?" (คำถามโตขึ้น): three "?" signs, each bigger than the last, pop in a line — the third is the real one; the things in doubt below */
  variant('qgrow', 'คำถามโตขึ้น', (d, c) => { art(c, p => { gdesign(p, c, d, { motif: (p, T_) => [[-330, 36], [-160, 52]].forEach(([x, r], j) => { const g = popAt(p, x, -180, f3(T_.tQ - tu(.36) + tu(.16 * j))); g.circle(x, -180, r, F(3)); txt(g, '?', x, -180 + r * .42, { size: r * 1.25, weight: 800, color: C.mute }); }),
    pos: k => arr(k, 'row', -470, 30, 470, 250, 210), kind: 'rise', w: wBelow(50, 260), q: () => [60, -180, 76], ns: 180, nw: () => ({ wx: 170, wy: -164, wo: { pill: false, anchor: 'start', size: 46 } }) }); }); });

  /* 43 ── PANES (ช่องหน้าต่าง): a 2 × 2 frame; the things in doubt light up their panes one by one, the "?" waits in the last pane */
  variant('panes', 'ช่องสี่ช่อง', (d, c) => { art(c, p => { const PP = [[-210, -150], [210, -150], [-210, 170], [210, 170]]; gdesign(p, c, d, { motif: (p, T_) => PP.forEach(([x, y], j) => R(mvG(p, spinK(x, y, f3(tu(.04 + .05 * j)))), x - 200, y - 145, 400, 290, 30, { fill: TL_(.03), sw: 2.6, stroke: TL_(.4) })),
    pos: k => PP.slice(0, Math.min(3, k)).map(([x, y]) => [x - 80, y, 196]), kind: 'flip', w: (j, r, i, x, y, sz) => [f1(x + sz / 2 + 18), f1(y + 16), { anchor: 'start', size: 42, maxW: 170, wrap: 'mid' }],
    q: () => [PP[3][0], PP[3][1], 96], ns: 220, nw: () => ({ wx: PP[3][0], wy: PP[3][1] + 130, wo: { pill: false, size: 40 } }) }); }); });

  /* 44 ── SEGMENTS (แถบหลายช่อง): one long control cut into segments — one per thing in doubt and a last one for the "?"; a lit block hops along them */
  variant('qseg', 'แถบหลายช่อง', (d, c) => { art(c, p => { const Fd = QD(d), T_ = QT(d), L = QI(d).filter(([r]) => r !== 'n'), n = L.length + 1, cw = 920 / n, xs = rowXs(n, cw, 0), Y = 60, s = Math.min(200, cw - 40);
    R(mvG(p, { px: 0, py: Y, sx: [[0, .2], [tu(.04), .2], [tu(.34), 1.03, 'out'], [tu(.44), 1, 'soft']], o: fadeIn(tu(.04), .06) }), -460, Y - 130, 920, 260, 70, F(3.6));
    xs.slice(1).forEach(x => drawAt(p.line(f1(x - cw / 2), Y - 96, f1(x - cw / 2), Y + 96, { sw: 2.4, stroke: TL_(.35) }), p, tu(.3), tu(.2)));
    const tgt = Fd.ai >= 0 ? L.findIndex(([r, i]) => r === 'o' && i === Fd.ai) : n - 1, ph = [[T_.tD0, 0]]; for (let t = T_.tD0 + tu(.28), j = 1; t < T_.tD1; t += tu(.28), j++) ph.push([f3(t), j % n]); ph.push([T_.H, tgt]);
    const last = xs[tgt], hg = mvG(p, { px: last, py: Y, x: [[0, f1(xs[0] - last)], [f3(T_.tD0 - tu(.1)), f1(xs[0] - last)]].concat(offK(posK(ph, w => xs[w]), last).slice(1)), o: fadeIn(f3(T_.tD0 - tu(.1)), .06) });
    R(hg, f1(last - cw / 2 + 12), Y - 112, f1(cw - 24), 224, 56, { fill: TA(.14), sw: 3, stroke: TL_(.5) }); R(litOn(hg, T_.H), f1(last - cw / 2 + 12), Y - 112, f1(cw - 24), 224, 56, { sw: 5, stroke: ACC1 });
    L.forEach(([r, i], j) => { qthing(p, c, d, r, i, xs[j], Y, s, { kind: 'pop' }); qword(p, d, r, i, xs[j], Y - 130 - 54, { pill: true, maxW: cw - 20 }); });
    qmark(p, d, xs[n - 1], Y, Math.min(84, s / 2 - 10), { keep: true }); if (Fd.hasN) qans(p, c, d, xs[n - 1], Y, s, { wy: Y - 130 - 54 }); }); });

  /* 45 ── WATERMARK (เครื่องหมายจาง): a big faint "?" fills a frame behind the things in doubt; on H it lights (or the answer takes the front) */
  variant('watermark', 'เครื่องหมายจางหลัง', (d, c) => { art(c, p => { const Fd = QD(d), T_ = QT(d), L = QI(d).filter(([r]) => r !== 'n');
    R(mvG(p, upK(0, 320, tu(.02), .3)), -460, -300, 920, 620, 44, F(3.4)); const wg = sub(p); on(wg, p, 0, { o: [[0, 0], [tu(.2), 0], [tu(.4), 1]].concat(Fd.answered ? [[T_.H, 1], [f3(T_.H + tu(.2)), .4]] : []) }); txt(wg, '?', 0, 200, { size: 560, weight: 800, color: TL_(.14) });
    if (!Fd.answered) { const lw = litOn(p, T_.H); txt(lw, '?', 0, 200, { size: 560, weight: 800, color: TA(.32) }); ripple(p, 0, 20, 200, f3(T_.H + tu(.04))); }
    const P = arr(L.length + (Fd.hasN ? 1 : 0), 'row', -430, -110, 430, 150, 220); L.forEach(([r, i], j) => { const [x, y, sz] = P[j]; qthing(p, c, d, r, i, x, y, sz, { kind: 'pop' }); qword(p, d, r, i, x, f1(y + sz / 2 + 52), { pill: true, maxW: 260 }); });
    if (Fd.hasN) { const [x, y, sz] = P[P.length - 1]; qans(p, c, d, x, y, sz, { wy: y + sz / 2 + 52 }); } }); });

  /* 46 ── CASCADE (บันไดคำถาม): the things in doubt step down to the right one below the other; the "?" lands on the bottom step */
  variant('cascade', 'บันไดคำถาม', (d, c) => { art(c, p => { const Fd = QD(d), T_ = QT(d), L = QI(d).filter(([r]) => r !== 'n'), n = L.length + 1, P = Array.from({ length: n }, (_, j) => [f1(n > 1 ? lerp(-330, 330, j / (n - 1)) : 0), f1(n > 1 ? lerp(-210, 200, j / (n - 1)) : 0)]);
    P.slice(0, -1).forEach(([x, y], j) => drawAt(p.path(`M ${x + 100} ${y} L ${P[j + 1][0]} ${y} L ${P[j + 1][0]} ${P[j + 1][1] - 100}`, { sw: 4, stroke: TL_(.4) }), p, f3(T_.tQ - tu(.3) + tu(.1 * j)), tu(.2)));
    L.forEach(([r, i], j) => { const [x, y] = P[j]; qthing(p, c, d, r, i, x, y, 180, { kind: 'drop' }); qword(p, d, r, i, x, f1(y - 90 - 30), { size: 42, maxW: 260 }); });
    const E = P[n - 1]; qmark(p, d, ...E, 86); if (Fd.hasN) qans(p, c, d, ...E, 190, { wx: E[0] - 112, wy: E[1] + 16, wo: { pill: false, anchor: 'end', size: 44 } }); }); });

  /* 47 ── ORBIT (โคจรรอบคำถาม): the things in doubt circle the "?" in the middle once and settle round it */
  variant('qorbit', 'โคจรรอบคำถาม', (d, c) => { art(c, p => { const Fd = QD(d), T_ = QT(d), L = QI(d).filter(([r]) => r !== 'n'), k = L.length, RO = 270, CY = 20, A0 = k === 1 ? [180] : k === 2 ? [180, 0] : [180, 0, -90];
    drawAt(p.circle(0, CY, RO, DASH(.4)), p, tu(.04), tu(.5));
    L.forEach(([r, i], j) => { const af = A0[j], fin = [f1(RO * Math.cos(rad(af))), f1(CY + RO * .8 * Math.sin(rad(af)))], pts = Array.from({ length: 19 }, (_, q) => { const a = rad(af - 360 + q * 20); return [f1(RO * Math.cos(a)), f1(CY + RO * .8 * Math.sin(a))]; });
      const t = r === 'a' ? T_.tA : T_.tO(i), PK = pathK(pts, t, f3(Math.max(t + tu(.6), T_.tD1)), fin, 30), K = { px: fin[0], py: fin[1], x: PK.x, y: PK.y, o: fadeIn(t, .05) };
      qthing(p, c, d, r, i, ...fin, 180, { shape: 'circ', g: mvG(p, K), K, mv: K, t }); qword(p, d, r, i, fin[0], fin[1] < 0 ? f1(fin[1] - 90 - 18) : f1(fin[1] + 90 + 48), { size: 42, maxW: 260, t: f3(Math.max(t + tu(.6), T_.tD1)) }); });
    qmark(p, d, 0, CY, 96); if (Fd.hasN) qans(p, c, d, 0, CY, 200, { wy: CY + 150 }); }); });

  /* 48 ── TOP / BOTTOM (บน-ล่าง): what is in doubt across the top half; a seam; the "?" (or the answer) alone in the bottom half */
  variant('updownq', 'บนถาม-ล่างตอบ', (d, c) => { art(c, p => { gdesign(p, c, d, { motif: (p, T_) => drawAt(p.line(-460, 60, 460, 60, { sw: 2.6, stroke: TL_(.4) }), p, tu(.04), tu(.3)),
    pos: k => arr(k, 'row', -470, -300, 470, -60, 220).map(q => [q[0], -170, Math.min(q[2], 200)]), kind: 'drop', w: (j, r, i, x, y, sz) => [x, f1(y + sz / 2 + 46), { size: 42, maxW: 280 }],
    q: () => [0, 210, 96], ns: 210, nw: () => ({ wx: 130, wy: 226, wo: { pill: false, anchor: 'start', size: 46 } }) }); }); });

  /* 49 ── PENDULUM (ลูกตุ้มคำถาม): the "?" hangs from a pendulum over the things in doubt and swings across them; it comes to rest over the answer
     (no answer: in the middle, lit) */
  variant('qpend', 'ลูกตุ้มคำถาม', (d, c) => { art(c, p => { const Fd = QD(d), T_ = QT(d), L = QI(d).filter(([r]) => r !== 'n'), P = arr(L.length, 'row', -470, 110, 470, 320, 200), PV = [0, -330], LN = 300;
    L.forEach(([r, i], j) => { const [x, y, sz] = P[j]; qthing(p, c, d, r, i, x, y, sz, { kind: 'rise' }); qword(p, d, r, i, x, f1(y - sz / 2 - 28), { size: 42, maxW: 280 }); });
    const ti = Fd.ai >= 0 ? L.findIndex(([r, i]) => r === 'o' && i === Fd.ai) : -1, aF = ti >= 0 ? f1(-Math.atan2(P[ti][0], LN) * 180 / Math.PI) : 0, q = k => f3(lerp(T_.tD0, T_.tD1, k));
    const pg = mvG(p, { px: PV[0], py: PV[1], r: [[0, 0], [T_.tQ, 0], [q(.15), 32, 'io'], [q(.4), -30, 'io'], [q(.65), 24, 'io'], [q(.9), -14, 'io'], [q(1), 0, 'io'], [f3(T_.H + tu(.3)), aF, 'out']], o: fadeIn(f3(T_.tQ - tu(.1)), .06) });
    pg.line(PV[0], PV[1], PV[0], PV[1] + LN - 60, { sw: 5, stroke: TL_(.7) }); p.circle(...PV, 12, F(3));
    qmark(p, d, PV[0], PV[1] + LN, 60, { g: pg }); if (Fd.hasN) qans(p, c, d, 0, -110, 170, { g: undefined, wx: 110, wy: -94, wo: { pill: false, anchor: 'start', size: 44 } }); }); });

  /* 50 ── CORNERS (สี่มุมรอบคำถาม): the "?" in the middle, the things in doubt in the corners, thin lines join them to it */
  variant('corners', 'สี่มุมรอบคำถาม', (d, c) => { art(c, p => { const CC = [[-330, -190], [330, -190], [-330, 190], [330, 190]]; gdesign(p, c, d, { motif: (p, T_, Fd, L) => L.forEach((_, j) => drawAt(p.line(CC[j][0] * .62, CC[j][1] * .62, CC[j][0] * .3, CC[j][1] * .3, { sw: 4, stroke: TL_(.4) }), p, T_.tQ, tu(.2))),
    pos: k => CC.slice(0, k).map(q => [q[0], q[1], 190]), kind: 'pop', w: (j, r, i, x, y, sz) => [x, y < 0 ? f1(y + sz / 2 + 46) : f1(y - sz / 2 - 28), { size: 40, maxW: 280 }],
    q: () => [0, 0, 92], ns: 200, nw: () => ({ wy: 150 }) }); }); });

  /* ---------- sample data: B06's sentences (A) + stress (B: no labels, long labels, English, words only, every mix of about / options / answer) ---------- */
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

  G.cats = G.cats || {};
  G.cats.B06T = { variants: V, SAMPLES, STRESS, theme, draw: (i, d, c) => { setZ(c); CUR = V[i].id; tokens(); EMPTY = false; BLUE = false; V[i].build(d || {}, c); }, CLAMPS, timing: c => (setZ(c), Object.assign({}, Z)) };
})();
