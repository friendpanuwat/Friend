/* b04t.js — template ชุดฐาน category B04 "ขั้นตอน / เช็กลิสต์" (user 2026-11-14: "ผ่านครับ เริ่มหมวดที่ 3 ได้ ระหว่างทำไม่ต้องรายงานผม … ส่งให้ผมดูตอนเสร็จ
   ทีเดียว" — the next category after B03): 50 designs, each its own layout; graphic elements only, our white-glow line style, colours from GL.theme.
   Icons apart from words; icon slots ≥ 165 on the 1000 × 700 canvas, words ≥ 40, marks r ≥ 56; no word chip top-left, no arrow badge top-right, no floor
   line; no step numbers on screen (order shows by place, lines, pips, arrows). Not a replacement for the approved B04 (references/approved/b04/).
   Header + helpers copied from b03t.js (icons clipped to their own canvas).
   GL.cats.B04T.draw(i, data, { x, y, s, at, hit }) — canvas 1000 × 700 centred at (0,0). Data = CutPack B04: items 2–4 THINGs (CutPack: 3) · mark { at 0–n,
   how 'light' | 'check' | 'x' } (optional) · texts [one line of words per item] (optional — where a step shows grey lines; none → the grey lines). */
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
    cp.id = 'b04tclip' + (++CID); Object.entries({ x, y, width: w, height: h }).forEach(([k, v]) => r.setAttribute(k, v)); cp.appendChild(r);
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
    if (!ICLIP[k] || !svg.contains(ICLIP[k].cp)) { const cp = document.createElementNS(NS, 'clipPath'), r = document.createElementNS(NS, 'rect'); cp.id = 'b04ticlip' + (++CID);
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
    const K = m && m.at != null && isFinite(+m.at) ? Math.max(0, Math.min(N - 1, Math.round(+m.at))) : N - 1, HOW = m ? (['light', 'check', 'x'].includes(m.how) ? m.how : 'light') : null, H = Z.H;
    const gp = N >= 4 ? .17 : N === 3 ? .22 : .3, tI = i => f3(tu(.08 + gp * i)), tP0 = f3(Math.max(tI(N - 1) + tu(.34), H - tu(.85))), tP = i => i > K ? null : K === 0 ? H : f3(lerp(tP0, H, i / K));
    return { it, N, K, HOW, H, tI, tP, tP0 }; }
  const TXI = (d, i) => d && Array.isArray(d.texts) && d.texts[i] != null && String(d.texts[i]).trim() ? String(d.texts[i]).trim() : null;
  const LBI = (Q, i) => LBL(Q.it[i]);
  const SZ4 = n => n >= 4 ? 176 : n === 3 ? 210 : 240, GP4 = n => n >= 4 ? 52 : n === 3 ? 80 : 150;
  const rowXs = (n, s, gap, cx = 0) => Array.from({ length: n }, (_, k) => f1(cx + (k - (n - 1) / 2) * (s + gap)));
  const RH4 = n => n >= 4 ? 172 : n === 3 ? 214 : 250;
  const bumpsK = (ts, a = 1.08) => { const K = [[0, 1]]; ts.slice().sort((x, y) => x - y).forEach(t => K.push([t, 1], [f3(t + tu(.05)), a, 'out'], [f3(t + tu(.18)), 1, 'soft'])); return K; };
  const stState = (Q, i) => { const tg = i === Q.K, xx = tg && Q.HOW === 'x', dim = xx || (Q.HOW === 'light' && !tg); return { tg, xx, dim, lit: tg && !xx, to: xx ? .42 : .5 }; };
  const dimKeys = (Q, to) => [[0, 1], [Q.H, 1], [f3(Q.H + tu(.2)), to]];
  const passed = (Q, i) => { const t = Q.tP(i); return t != null && t < Q.H - .005 ? t : null; };
  /* step i as an icon slot at (x, y) size sz (o.shape box | circ | hex, or o.draw(q, style) for any outline). o.g = it rides that group (o.mv its keys).
     The progress passing bumps it; on H the target lights (or dims with x), with light the others dim. o.ix / o.iy / o.iw = where the icon sits */
  function stepBox(p, c, d, i, x, y, sz, o = {}) { const Q = STP(d), X = Q.it[i], H = Q.H, t = o.t ?? Q.tI(i), sh = o.shape || 'box', S_ = stState(Q, i), tp = passed(Q, i);
    const draw = o.draw || ((q, st) => shp(q, sh, x, y, sz, st));
    const g0 = o.g || popAt(p, x, y, t); if (S_.dim && o.bk !== false) draw(g0, BK);
    const g1 = S_.dim ? mvG(g0, { o: dimKeys(Q, S_.to) }) : g0, ts = []; if (tp != null) ts.push(tp); if (S_.lit) ts.push(H);
    const g = ts.length && o.bump !== false ? mvG(g1, { px: x, py: y, s: bumpsK(ts) }) : g1;
    draw(g, o.style || F(4)); if (sh === 'circ' && !o.draw) g.circle(x, y, sz / 2 - 13, SL(1.4));
    if (S_.lit && !T_OFF) { draw(litOn(g, H), o.litStyle || LIT2()); if (o.rip !== false) ripple(p, o.ix ?? x, o.iy ?? y, sz * .58, f3(H + tu(.04))); }
    if (tp != null && o.passRip !== false) ripple(p, o.ix ?? x, o.iy ?? y, sz * .48, tp);
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
      if (i < Q.K) { const a = p.path(dd, o.lit || { sw: 7, stroke: ACC1 }); on(a, p, 0, { draw: [[0, 0], [f3(Q.tP(i) + tu(.03)), 0], [Q.tP(i + 1), 1, 'io']] }); } }); }
  /* a token that travels the steps' anchor points (o.via(i) = points between i and i+1), arriving at each on its pass time, at the target on H */
  function token(p, Q, pts, o = {}) { const K = Q.K, fin = pts[K], r = o.r || 20, via = o.via || (() => []), t0 = f3(Q.tP(0) - tu(.14));
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

  /* 01 ── ROW (แถวเชื่อมเส้น): the boxes drop into a row (dust), lines join them; words zigzag above / below; the accent runs along the lines */
  variant('row', 'แถวเชื่อมเส้น', (d, c) => { art(c, p => { const Q = STP(d), n = Q.N, s = SZ4(n), g = GP4(n), xs = rowXs(n, s, g), y = 10;
    links(p, Q, xs.slice(0, -1).map((x, i) => `M ${f1(x + s / 2 + 8)} ${y} L ${f1(xs[i + 1] - s / 2 - 8)} ${y}`));
    xs.forEach((x, i) => { entBox(p, c, d, i, x, y, s, 'drop'); stepWord(p, d, i, x, i % 2 ? y + s / 2 + 62 : y - s / 2 - 46, { size: 44, maxW: s + g - 20 }); });
    markT(p, d, Q.K % 2 ? corner(xs[Q.K], y, s) : cornerB(xs[Q.K], y, s)); }); });

  /* 02 ── CHEVRONS (แถบลูกศรต่อกัน): arrow bands slide in from the left and lock into each other; the icon rides in its band, the word above */
  variant('chevrons', 'แถบลูกศรต่อกัน', (d, c) => { art(c, p => { const Q = STP(d), n = Q.N, st = f1(860 / n), xs = rowXs(n, st, 0, -22), y = 40, h = 250, dp = 50, iw = n >= 4 ? 150 : n === 3 ? 175 : 195;
    xs.forEach((x, i) => { const x0 = f1(x - st / 2 + 6), x1 = f1(x + st / 2 - 6), D = pathOf([[x0, y - h / 2], [x1, y - h / 2], [x1 + dp, y], [x1, y + h / 2], [x0, y + h / 2]].concat(i ? [[x0 + dp, y]] : []));
      entBox(p, c, d, i, x, y, h, 'left', { draw: (q, stl) => q.path(D, stl), ix: f1(x + dp / 2), iw, lw: st - dp - 30 });
      stepWord(p, d, i, f1(x + dp / 2), y - h / 2 - 42, { size: 44, maxW: st - 20 }); });
    markT(p, d, [f1(xs[Q.K] + st / 2 - 34), y + h / 2 - 20]); }); });

  /* 03 ── DIAGONAL (บันไดทแยง): boxes rise in up a diagonal; a ball hops box to box along dashed arcs, landing on the target on H; words beside */
  variant('diagonal', 'บันไดทแยง', (d, c) => { art(c, p => { const Q = STP(d), n = Q.N, s = n >= 4 ? 168 : n === 3 ? 196 : 226, xs = rowXs(n, s, n >= 4 ? 50 : n === 3 ? 90 : 170, -60), ys = xs.map((_, i) => f1(n > 1 ? lerp(190, -190, i / (n - 1)) : 0));
    const pts = xs.map((x, i) => [x, f1(ys[i] - s / 2 - 30)]), via = i => [.25, .5, .75].map(u => [f1(lerp(pts[i][0], pts[i + 1][0], u)), f1(lerp(pts[i][1], pts[i + 1][1], u) - 4 * 120 * u * (1 - u))]);
    xs.slice(0, -1).forEach((x, i) => drawAt(p.path(`M ${pts[i][0]} ${pts[i][1]} Q ${f1((pts[i][0] + pts[i + 1][0]) / 2)} ${f1((pts[i][1] + pts[i + 1][1]) / 2 - 240)} ${pts[i + 1][0]} ${pts[i + 1][1]}`, DASH(.4)), p, f3(Q.tI(i + 1)), tu(.25)));
    xs.forEach((x, i) => { entBox(p, c, d, i, x, ys[i], s, 'rise'); const last = i === n - 1 && n > 1;
      stepWord(p, d, i, f1(last ? x - s / 2 - 18 : x + s / 2 + 18), f1(ys[i] + 16), { anchor: last ? 'end' : 'start', size: 44, maxW: last ? 230 : Math.min(n >= 4 ? 190 : 240, 470 - (x + s / 2 + 18)) }); });
    token(p, Q, pts, { via, r: 18 }); markT(p, d, corner(xs[Q.K], ys[Q.K], s, -1)); }); });

  /* 04 ── RAIL (รางแนวตั้ง): a rail runs down the left with a node per step; each row slides in — icon box, word, its line of words (texts) — and the
     rail lights down to the target, its node filling */
  variant('rail', 'รางแนวตั้ง', (d, c) => { art(c, p => { const Q = STP(d), n = Q.N, rh = RH4(n), s = rh - (n >= 4 ? 8 : 30), ys = rowXs(n, rh, 0, 0), RX = -448, BX = -330;
    links(p, Q, ys.slice(0, -1).map((y, i) => `M ${RX} ${f1(y + 20)} L ${RX} ${f1(ys[i + 1] - 20)}`));
    ys.forEach((y, i) => { const g = popAt(p, RX, y, Q.tI(i)); g.circle(RX, y, 17, F(3)); const lt = passed(Q, i) ?? (i === Q.K ? Q.H : null); if (lt != null) popAt(p, RX, y, lt).circle(RX, y, 9, DOTF());
      entBox(p, c, d, i, BX, y, s, 'left'); const hw = !!LBI(Q, i);
      if (hw) stepWord(p, d, i, BX + s / 2 + 30, f1(y - (n >= 4 ? 22 : 28)), { anchor: 'start', size: n >= 4 ? 46 : 50, maxW: 540, wrap: null });
      stepNote(p, d, i, BX + s / 2 + 30, f1(hw ? y + (n >= 4 ? 24 : 32) : y - 10), 540, { one: n >= 4 }); });
    markT(p, d, corner(BX, ys[Q.K], s, -1)); }); });

  /* 05 ── CYCLE (วงจรวน): an oval loop draws round; the boxes spin in on it; a token runs the loop step to step, landing on the target on H */
  variant('cycle', 'วงจรวน', (d, c) => { art(c, p => { const Q = STP(d), n = Q.N, s = n >= 4 ? 166 : n === 3 ? 186 : 216, RXe = 325, RYe = 208, CY = 20, AN = n >= 4 ? [-90, 0, 90, 180] : n === 3 ? [-90, 30, 150] : [180, 360];
    const P = a => [f1(RXe * Math.cos(rad(a))), f1(CY + RYe * Math.sin(rad(a)))], arcPts = (a0, a1) => { const b = a1 > a0 ? a1 : a1 + 360; return Array.from({ length: 13 }, (_, k) => P(lerp(a0, b, k / 12))); };
    drawAt(p.path(pathOf(Array.from({ length: 72 }, (_, k) => P(k * 5))), { sw: 3, stroke: TL_(.32) }), p, tu(.02), tu(.5));
    links(p, Q, AN.slice(0, -1).map((a, i) => pathOf(arcPts(a, AN[i + 1]), false)), { base: { sw: 0, stroke: 'none' } });
    const pos = AN.map(P); pos.forEach(([x, y], i) => { entBox(p, c, d, i, x, y, s, 'spin'); const a = ((AN[i] % 360) + 360) % 360, vert = a === 90 || a === 270, right = !vert && Math.cos(rad(a)) > .3;
      if (vert) stepWord(p, d, i, x, f1(y < CY ? y + s / 2 + 44 : y - s / 2 - 26), { size: 44, maxW: 300, wrap: null });
      else stepWord(p, d, i, f1(right ? x - s / 2 - 20 : x + s / 2 + 20), f1(y + 16), { anchor: right ? 'end' : 'start', size: 46, maxW: 200 }); });
    token(p, Q, pos, { via: i => arcPts(AN[i], AN[i + 1]).slice(1, -1), r: 18 }); markT(p, d, corner(...pos[Q.K], s)); }); });

  /* 06 ── PROGRESS (แถบความคืบหน้า): a long bar opens with a part per step (the words inside), the boxes drop in above their parts; the fill runs
     part by part and fills the target's part on H */
  variant('progress', 'แถบความคืบหน้า', (d, c) => { art(c, p => { const Q = STP(d), n = Q.N, BW = 920, BY = 196, BH = 124, sw_ = BW / n, xs = rowXs(n, sw_, 0), s = Math.min(SZ4(n), sw_ - 36), y = -66;
    R(mvG(p, { px: -BW / 2, py: BY, sx: [[0, 0], [tu(.04), 0], [tu(.4), 1, 'out']], o: fadeIn(tu(.04), .05) }), -BW / 2, BY - BH / 2, BW, BH, BH / 2, F(3.6));
    xs.slice(1).forEach(x => drawAt(p.line(f1(x - sw_ / 2), BY - BH / 2 + 14, f1(x - sw_ / 2), BY + BH / 2 - 14, { sw: 2.4, stroke: TL_(.4) }), p, tu(.3), tu(.15)));
    const fw = f1(sw_ * (Q.K + 1) - 16), keys = [[0, 0], [f3(Q.tP(0) - tu(.2)), 0]]; for (let i = 0; i <= Q.K; i++) keys.push([Q.tP(i), f3((i + 1) / (Q.K + 1)), 'io']);
    R(mvG(p, { px: -BW / 2 + 8, py: BY, sx: keys }), -BW / 2 + 8, BY - BH / 2 + 8, fw, BH - 16, (BH - 16) / 2, { fill: TA(.45), sw: 0, stroke: 'none' });
    xs.forEach((x, i) => { entBox(p, c, d, i, x, y, s, 'drop'); stepWord(p, d, i, x, BY + 16, { size: 44, maxW: sw_ - 40 }); });
    markT(p, d, corner(xs[Q.K], y, s)); }); });

  /* 07 ── CAROUSEL (สไลด์เลื่อน): the steps sit on a strip that slides in; the strip moves step by step, the one in the middle grows; it stops with the
     target in the middle on H. Words ride under the boxes */
  variant('carousel', 'สไลด์เลื่อน', (d, c) => { art(c, p => { const Q = STP(d), n = Q.N, SPc = 330, s = 200, K = Q.K, y = -14;
    const X = [[0, f1(K * SPc + 760)], [tu(.06), f1(K * SPc + 760)], [tu(.5), f1(K * SPc), 'out']]; for (let i = 1; i <= K; i++) X.push([f3(Q.tP(i) - tu(.24)), f1((K - i + 1) * SPc)], [Q.tP(i), f1((K - i) * SPc), 'io']);
    const ph = [[tu(.5), 0]]; for (let j = 1; j <= K; j++) ph.push([Q.tP(j), j]);
    for (let i = 0; i < n; i++) { const x = f1((i - K) * SPc), K2 = { px: x, py: y, x: X, s: posK(ph, w => w === i ? 1.25 : 1, .24) };
      stepBox(p, c, d, i, x, y, s, { g: mvG(CL(p), K2), mv: K2, t: tu(.08), passRip: false });
      stepWord(p, d, i, x, y + s / 2 + 80, { g: mvG(CL(p), { x: X }), size: 46, maxW: 270, t: tu(.34) }); }
    markT(p, d, corner(0, y, s * 1.25)); }); });

  /* 08 ── CHECKLIST (เช็กลิสต์): rows slide in — a round check slot, the icon box, the word; the checks tick in one by one (accent), the target on H
     (x: a cross, the row dims) */
  variant('checklist', 'เช็กลิสต์', (d, c) => { art(c, p => { const Q = STP(d), n = Q.N, rh = RH4(n), s = rh - (n >= 4 ? 8 : 30), ys = rowXs(n, rh, 0, 0), CX = -408, BX = -262;
    ys.forEach((y, i) => { entBox(p, c, d, i, BX, y, s, 'left', { passRip: false }); const g = popAt(p, CX, y, f3(Q.tI(i) + tu(.1))); g.circle(CX, y, 48, F(3.6));
      const S_ = stState(Q, i), tt = passed(Q, i) ?? (S_.tg ? Q.H : null);
      if (tt != null) { const m = popAt(p, CX, y, tt); if (S_.xx) XX(m, CX, y, 1.3); else m.path(`M ${CX - 21} ${y + 1} L ${CX - 6} ${y + 16} L ${CX + 22} ${y - 16}`, { sw: 6.4, stroke: ACC1 }); ripple(p, CX, y, 58, tt); }
      stepWord(p, d, i, BX + s / 2 + 30, f1(y + 17), { anchor: 'start', size: n >= 4 ? 48 : 52, maxW: 520, wrap: null }); }); }); });

  /* 09 ── WAVE (เส้นคลื่น): the boxes pop in along a wave, dots trace it between them, a token rides the wave; words outside each crest */
  variant('wave', 'เส้นคลื่น', (d, c) => { art(c, p => { const Q = STP(d), n = Q.N, s = n >= 4 ? 172 : n === 3 ? 200 : 230, xs = rowXs(n, s, n >= 4 ? 56 : n === 3 ? 90 : 170), ys = xs.map((_, i) => n < 2 ? 0 : i % 2 ? 118 : -108), pts = xs.map((x, i) => [x, ys[i]]);
    for (let i = 0; i < n - 1; i++) for (let k = 1; k < 10; k++) { const [x, y] = bez(pts[i], pts[i + 1], k / 10); popAt(p, x, y, f3(Q.tI(i + 1) + tu(.02 * k))).circle(x, y, 6, { fill: TL_(.55), sw: 0, stroke: 'none' }); }
    xs.forEach((x, i) => { entBox(p, c, d, i, x, ys[i], s, 'pop'); stepWord(p, d, i, x, i % 2 ? f1(ys[i] + s / 2 + 60) : f1(ys[i] - s / 2 - 44), { size: 44, maxW: s + 70 }); });
    token(p, Q, pts, { via: viaBez(pts), r: 18 }); markT(p, d, Q.K % 2 ? corner(xs[Q.K], ys[Q.K], s) : cornerB(xs[Q.K], ys[Q.K], s)); }); });

  /* 10 ── LADDER (ไต่ขึ้น): the steps rise in from the bottom up (first at the bottom); a light climbs the line beside them to the target; words right */
  variant('ladder', 'ไต่ขึ้น', (d, c) => { art(c, p => { const Q = STP(d), n = Q.N, rh = RH4(n), s = rh - (n >= 4 ? 8 : 30), ys = rowXs(n, rh, 0, 0).reverse(), BX = -190, LX = BX - s / 2 - 40;
    links(p, Q, ys.slice(0, -1).map((y, i) => `M ${LX} ${y} L ${LX} ${ys[i + 1]}`), { base: { sw: 5, stroke: TL_(.35) }, lit: { sw: 8, stroke: ACC1 } });
    ys.forEach((y, i) => { const tt = passed(Q, i) ?? (i === Q.K ? Q.H : null); popAt(p, LX, y, Q.tI(i)).circle(LX, y, 12, F(3)); if (tt != null) popAt(p, LX, y, tt).circle(LX, y, 12, DOTF());
      entBox(p, c, d, i, BX, y, s, 'rise'); stepWord(p, d, i, BX + s / 2 + 32, f1(y + 18), { anchor: 'start', size: 52, maxW: 500, wrap: null }); });
    markT(p, d, corner(BX, ys[Q.K], s, -1)); }); });

  /* 11 ── ZIGZAG (ซิกแซก): steps alternate top / bottom — top ones drop in, bottom ones rise; lines zigzag between; words outside */
  variant('zigzag', 'ซิกแซก', (d, c) => { art(c, p => { const Q = STP(d), n = Q.N, s = SZ4(n), xs = rowXs(n, s, GP4(n)), ys = xs.map((_, i) => n < 2 ? 0 : i % 2 ? 140 : -122);
    links(p, Q, xs.slice(0, -1).map((x, i) => `M ${x} ${ys[i]} L ${xs[i + 1]} ${ys[i + 1]}`));
    xs.forEach((x, i) => { entBox(p, c, d, i, x, ys[i], s, i % 2 ? 'rise' : 'drop'); stepWord(p, d, i, x, i % 2 ? f1(ys[i] + s / 2 + 56) : f1(ys[i] - s / 2 - 40), { size: 44, maxW: s + 120 }); });
    markT(p, d, Q.K % 2 ? corner(xs[Q.K], ys[Q.K], s) : cornerB(xs[Q.K], ys[Q.K], s)); }); });

  /* 12 ── TOWER (ต่อชั้น): wide slabs drop one on another (first at the bottom) — icon at the slab's left, the word along it; the target slab lights */
  variant('tower', 'ต่อชั้น', (d, c) => { art(c, p => { const Q = STP(d), n = Q.N, rh = RH4(n), h = rh - (n >= 4 ? 8 : 26), ys = rowXs(n, rh, 0, 0).reverse(), SW = 780, bx = f1(-SW / 2 + h / 2 + 8);
    ys.forEach((y, i) => { const D = (q, st) => R(q, -SW / 2, y - h / 2, SW, h, 34, st), K = ent('drop', 0, y, h, Q.tI(i)), gg = mvG(CL(p), K);
      const pic_ = picOf(Q.it[i]), g = stepBox(p, c, d, i, 0, y, h, { g: gg, mv: K, t: Q.tI(i), draw: D, ix: pic_ ? bx : 0, iw: pic_ ? f1(h * .62) : 220, lw: pic_ ? h * .8 : SW - 120 }); if (pic_) R(g, bx - h / 2 + 12, y - h / 2 + 12, h - 24, h - 24, (h - 24) * .24, SL(1.6));
      dust(p, 0, y + h / 2, K.land, 1.6); stepWord(p, d, i, bx + h / 2 + 26, f1(y + 18), { g: gg, anchor: 'start', size: 50, maxW: SW - h - 90, wrap: null }); });
    markT(p, d, [SW / 2 - 50, ys[Q.K] - 40]); }); });

  /* 13 ── FAN (พัดซี่): spokes spread from a hub at the bottom to the steps on an arc; each spoke lights in turn, the hub lights on H; words above */
  variant('fan', 'พัดซี่', (d, c) => { art(c, p => { const Q = STP(d), n = Q.N, s = n >= 4 ? 170 : n === 3 ? 192 : 220, HC = [0, 288], Rf = 410, AN = n >= 4 ? [200, 246.7, 293.3, 340] : n === 3 ? [208, 270, 332] : [232, 308];
    const pos = AN.map(a => [f1(HC[0] + Rf * Math.cos(rad(a))), f1(HC[1] + Rf * Math.sin(rad(a)))]);
    pos.forEach(([x, y], i) => { const dd = `M ${HC[0]} ${HC[1]} L ${x} ${y}`, tt = passed(Q, i) ?? (i === Q.K ? Q.H : null); drawAt(p.path(dd, { sw: 4, stroke: TL_(.4) }), p, Q.tI(i), tu(.25));
      if (tt != null) { const a = p.path(dd, { sw: 7, stroke: ACC1 }); on(a, p, 0, { draw: [[0, 0], [f3(tt - tu(.2)), 0], [tt, 1, 'io']] }); } });
    const hg = popAt(p, ...HC, tu(.06)); hg.circle(...HC, 52, F(4)); litOn(hg, Q.H).circle(...HC, 24, DOTF());
    pos.forEach(([x, y], i) => { entBox(p, c, d, i, x, y, s, 'spin'); stepWord(p, d, i, x, f1(y - s / 2 - 38), { size: 44, maxW: n >= 4 ? 220 : 280 }); });
    markT(p, d, [f1(pos[Q.K][0] + s / 2 - 6), f1(pos[Q.K][1] + s / 2 - 6)]); }); });

  /* 14 ── BUBBLES (วงโตขึ้น): circles that grow step by step pop in on one baseline; short links light between; words above */
  variant('bubbles', 'วงโตขึ้น', (d, c) => { art(c, p => { const Q = STP(d), n = Q.N, D = n >= 4 ? [170, 192, 214, 236] : n === 3 ? [190, 218, 246] : [214, 256], gp = n >= 4 ? 34 : 60, tot = D.slice(0, n).reduce((a, b) => a + b, 0) + gp * (n - 1);
    let x0 = -tot / 2; const xs = D.slice(0, n).map(dm => { const x = x0 + dm / 2; x0 += dm + gp; return f1(x); }), BY = 172, ys = xs.map((_, i) => f1(BY - D[i] / 2));
    links(p, Q, xs.slice(0, -1).map((x, i) => `M ${f1(x + D[i] / 2 + 4)} ${ys[i]} L ${f1(xs[i + 1] - D[i + 1] / 2 - 4)} ${ys[i + 1]}`));
    xs.forEach((x, i) => { entBox(p, c, d, i, x, ys[i], D[i], 'pop', { shape: 'circ' }); stepWord(p, d, i, x, f1(ys[i] - D[i] / 2 - 38), { size: 44, maxW: D[i] + gp - 10 }); });
    markT(p, d, [f1(xs[Q.K] + D[Q.K] * .36), f1(ys[Q.K] - D[Q.K] * .36)]); }); });

  /* 15 ── PIPELINE (ท่อเชื่อม): boxes drop in, hollow pipes join them; light flows down the pipes step to step; words in pills (alternating for 4) */
  variant('pipeline', 'ท่อเชื่อม', (d, c) => { art(c, p => { const Q = STP(d), n = Q.N, s = SZ4(n), g = GP4(n) + (n >= 4 ? 6 : 20), xs = rowXs(n, s, g), y = n >= 4 ? 20 : 50;
    xs.slice(0, -1).forEach((x, i) => { const dd = `M ${f1(x + s / 2 - 4)} ${y} L ${f1(xs[i + 1] - s / 2 + 4)} ${y}`, tg = sub(p); on(tg, p, 0, { o: fadeIn(Q.tI(i + 1), .1) }); tube(tg, dd, 30);
      if (i < Q.K) { const a = p.path(dd, { sw: 12, stroke: ACC1 }); on(a, p, 0, { draw: [[0, 0], [f3(Q.tP(i) + tu(.03)), 0], [Q.tP(i + 1), 1, 'io']] }); } });
    xs.forEach((x, i) => { entBox(p, c, d, i, x, y, s, 'drop'); const dn = n >= 3 && i % 2; stepWord(p, d, i, x, dn ? y + s / 2 + 60 : y - s / 2 - 60, { pill: true, size: 44, maxW: n >= 3 ? 340 : Math.min(340, s + g - 70) }); });
    markT(p, d, Q.K % 2 && n >= 3 ? corner(xs[Q.K], y, s) : cornerB(xs[Q.K], y, s)); }); });

  /* 16 ── GRID Z (ตาราง Z): four places read like a Z — across, back diagonally, across; boxes flip in; the lines light; words to the right of each */
  variant('gridz', 'ตาราง Z', (d, c) => { art(c, p => { const Q = STP(d), n = Q.N, s = n >= 4 ? 196 : n === 3 ? 210 : 226, P = [[-352, -150], [118, -150], [-352, 160], [118, 160]].slice(0, n).map(q => n === 2 ? [q[0], 0] : q);
    links(p, Q, P.slice(0, -1).map((a, i) => `M ${a[0]} ${a[1]} L ${P[i + 1][0]} ${P[i + 1][1]}`));
    P.forEach(([x, y], i) => { entBox(p, c, d, i, x, y, s, 'flip'); const lx = f1(x + s / 2 + 22); stepWord(p, d, i, lx, f1(y < 0 ? y - 54 : y + 66), { anchor: 'start', size: 44, maxW: f1(x < 0 ? 118 - s / 2 - 30 - lx : 470 - lx) }); });
    markT(p, d, corner(...P[Q.K], s, -1)); }); });

  /* 17 ── HOPS (ลูกบอลกระโดด): boxes rise in; a lit ball bounces from top to top (a puff at each landing) and stays on the target; words under */
  variant('hops', 'ลูกบอลกระโดด', (d, c) => { art(c, p => { const Q = STP(d), n = Q.N, s = SZ4(n), g = GP4(n), xs = rowXs(n, s, g), y = 118, pts = xs.map(x => [x, f1(y - s / 2 - 32)]);
    xs.forEach((x, i) => { entBox(p, c, d, i, x, y, s, 'rise'); stepWord(p, d, i, x, f1(y + s / 2 + 58), { size: 44, maxW: s + g - 20 }); const tt = passed(Q, i) ?? (i === Q.K ? Q.H : null); if (tt != null) dust(p, x, f1(y - s / 2), tt, .6); });
    token(p, Q, pts, { r: 30, keep: true, via: i => [.25, .5, .75].map(u => [f1(lerp(pts[i][0], pts[i + 1][0], u)), f1(lerp(pts[i][1], pts[i + 1][1], u) - 4 * 190 * u * (1 - u))]), draw: (g, x, y) => g.circle(x, y, 30, DOTF()) });
    markT(p, d, corner(xs[Q.K], y, s, -1)); }); });

  /* phases → keys that show step i only while it is the current one (hidden before the first phase) */
  const showK = (ph, i, d = .12) => [[0, 0], [f3(ph[0][0] - tu(.1)), 0], [ph[0][0], ph[0][1] === i ? 1 : 0]].concat(posK(ph, w => w === i ? 1 : 0, d).slice(1));
  const phOf = Q => { const ph = [[f3(Math.min(Q.tP(0), Q.tI(0) + tu(.4))), 0]]; for (let j = 1; j <= Q.K; j++) ph.push([Q.tP(j), j]); return ph; };

  /* 18 ── TABS (แท็บทีละขั้น): a tab per step (its word on the tab) over one page; the lit tab moves step by step and the page shows that step —
     its icon and its line of words (texts); it settles on the target on H */
  variant('tabs', 'แท็บทีละขั้น', (d, c) => { art(c, p => { const Q = STP(d), n = Q.N, TY = -252, TH = 92, tw_ = f1(900 / n - 14), txs = rowXs(n, 900 / n, 0), PY = -186, PH = 476, bs = 236, BX = -248, BY = 52, ph = phOf(Q);
    R(mvG(p, upK(0, PY + PH, tu(.06), .3)), -450, PY, 900, PH, 40, F(3.6));
    const bx = popAt(p, BX, BY, tu(.2)); R(bx, BX - bs / 2, BY - bs / 2, bs, bs, bs * .24, F(4)); if (stState(Q, Q.K).lit) { R(litOn(bx, Q.H), BX - bs / 2, BY - bs / 2, bs, bs, bs * .24, LIT2()); ripple(p, BX, BY, bs * .58, f3(Q.H + tu(.04))); }
    txs.forEach((x, i) => { const S_ = stState(Q, i), X_ = Q.it[i], g0 = mvG(p, { x: glide(-80, Q.tI(i), f3(Q.tI(i) + tu(.26))), o: fadeIn(Q.tI(i), .05) }); if (S_.dim) R(g0, x - tw_ / 2, TY - TH / 2, tw_, TH, TH / 2, BK);
      const g = S_.dim ? mvG(g0, { o: dimKeys(Q, S_.to) }) : g0; R(g, x - tw_ / 2, TY - TH / 2, tw_, TH, TH / 2, F(3.4)); if (S_.lit) R(litOn(g, Q.H), x - tw_ / 2, TY - TH / 2, tw_, TH, TH / 2, { sw: 5, stroke: ACC1 });
      const lt = sub(g); on(lt, p, 0, { o: showK(ph, i, .1) }); R(lt, x - tw_ / 2 + 7, TY - TH / 2 + 7, tw_ - 14, TH - 14, (TH - 14) / 2, { fill: TA(.2), sw: 0, stroke: 'none' });
      if (X_ && X_.label) txt(g, X_.label, x, TY + 16, { size: 44, maxW: tw_ - 40, weight: 800, color: C.ink }); else R(g, x - 60, TY - 11, 120, 22, 11, GREY());
      const io = showK(ph, i), pg = sub(p); on(pg, p, 0, { o: io });
      if (X_ && picOf(X_)) put(p, c, { icon: X_.icon }, BX, BY, bs * .72, null, { t: f3(ph[0][0] - tu(.1)), o: S_.dim ? io.concat([[f3(Q.H + tu(.2)), S_.to]]) : io, punch: S_.lit ? Q.H : undefined });
      else if (X_) txt(pg, X_.label, BX, BY + 18, { size: 54, maxW: bs * .84, weight: 800, color: C.ink, wrap: 'mid' });
      stepNote(p, d, i, -96, BY - 18, 520, { g: pg, t: 0, noDim: true, size: 46 }); });
    markT(p, d, corner(BX, BY, bs)); }); });

  /* 19 ── DOMINOES (แผ่นเอนต่อกัน): tall tiles drop in side by side (each: its icon box, its word); as the progress passes each tile tips over onto
     the next; the target stands and lights */
  variant('dominoes', 'แผ่นเอนต่อกัน', (d, c) => { art(c, p => { const Q = STP(d), n = Q.N, tw2 = n >= 4 ? 196 : n === 3 ? 226 : 250, xs = rowXs(n, tw2, n >= 4 ? 32 : n === 3 ? 70 : 140), TH2 = 380, y = 20, bsz = n >= 4 ? 170 : 190, by = f1(y - TH2 / 2 + 22 + bsz / 2);
    xs.forEach((x, i) => { const tp = passed(Q, i), K = ent('drop', x, y, TH2, Q.tI(i)); K.px = f1(x + tw2 / 2); if (tp != null) K.r = [[0, 0], [tp, 0], [f3(tp + tu(.12)), 10, 'in'], [f3(tp + tu(.22)), 7, 'out']];
      const gg = mvG(CL(p), K), g = stepBox(p, c, d, i, x, y, tw2, { g: gg, mv: K, t: Q.tI(i), draw: (q, st) => R(q, x - tw2 / 2, y - TH2 / 2, tw2, TH2, 30, st), iy: by, iw: bsz * .72, lw: tw2 - 30 });
      R(g, x - bsz / 2, by - bsz / 2, bsz, bsz, bsz * .24, SL(1.8)); dust(p, x, y + TH2 / 2, K.land, .9);
      stepWord(p, d, i, x, f1(y + TH2 / 2 - 62), { g, size: 42, maxW: tw2 - 30, noDim: true }); });
    markT(p, d, [f1(xs[Q.K] + tw2 / 2 - 16), f1(y - TH2 / 2 + 16)]); }); });

  /* 20 ── TIMELINE (เส้นเวลาสลับข้าง): a centre line draws down; the steps come in from alternate sides, their words across the line; the line and
     its nodes light down to the target */
  variant('timeline', 'เส้นเวลาสลับข้าง', (d, c) => { art(c, p => { const Q = STP(d), n = Q.N, rh = RH4(n), s = rh - (n >= 4 ? 8 : 34), ys = rowXs(n, rh, 0, 0), LX = 0, X = i => (i % 2 ? 1 : -1) * (s / 2 + 60);
    drawAt(p.line(LX, f1(ys[0] - rh / 2 + 10), LX, f1(ys[n - 1] + rh / 2 - 10), { sw: 4, stroke: TL_(.35) }), p, tu(.02), tu(.4));
    links(p, Q, ys.slice(0, -1).map((y, i) => `M ${LX} ${y} L ${LX} ${ys[i + 1]}`), { base: { sw: 0, stroke: 'none' } });
    ys.forEach((y, i) => { const sd = i % 2 ? 1 : -1, tt = passed(Q, i) ?? (i === Q.K ? Q.H : null), g = popAt(p, LX, y, Q.tI(i)); g.circle(LX, y, 18, F(3.4)); if (tt != null) popAt(p, LX, y, tt).circle(LX, y, 10, DOTF());
      entBox(p, c, d, i, X(i), y, s, sd < 0 ? 'left' : 'right'); stepWord(p, d, i, -sd * 40, f1(y + 17), { anchor: sd < 0 ? 'start' : 'end', size: 48, maxW: 390, wrap: null }); });
    markT(p, d, corner(X(Q.K), ys[Q.K], s, Q.K % 2 ? 1 : -1)); }); });

  /* 21 ── U-LOOP (เส้นวนตัว U): across the top, round the bend, back along the bottom; the line lights round the U; words above each box */
  variant('uloop', 'เส้นวนตัว U', (d, c) => { art(c, p => { const Q = STP(d), n = Q.N, s = n >= 4 ? 184 : 200, P = [[-230, -138], [230, -138], [230, 170], [-230, 170]].slice(0, n).map(q => n === 2 ? [q[0], 30] : q);
    links(p, Q, P.slice(0, -1).map((a, i) => { const b = P[i + 1], sg = b[0] > a[0] ? 1 : -1; if (a[1] === b[1]) return `M ${f1(a[0] + sg * (s / 2 + 6))} ${a[1]} L ${f1(b[0] - sg * (s / 2 + 6))} ${b[1]}`;
      const ex = f1(a[0] + s / 2 + 130); return `M ${f1(a[0] + s / 2 + 6)} ${a[1]} C ${ex} ${a[1]} ${ex} ${b[1]} ${f1(b[0] + s / 2 + 6)} ${b[1]}`; }));
    P.forEach(([x, y], i) => { entBox(p, c, d, i, x, y, s, 'pop'); stepWord(p, d, i, x, f1(y - s / 2 - 36), { size: 44, maxW: 380 }); });
    markT(p, d, corner(...P[Q.K], s, -1)); }); });

  /* 22 ── ARROWS (ลูกศรคั่น): fat arrows sit between the boxes and fill with light as the progress passes; words in pills */
  variant('arrows', 'ลูกศรคั่น', (d, c) => { art(c, p => { const Q = STP(d), n = Q.N, s = n >= 4 ? 170 : n === 3 ? 200 : 230, aw = n >= 4 ? 62 : n === 3 ? 96 : 160, xs = rowXs(n, s, aw + 20), y = 30;
    xs.slice(0, -1).forEach((x, i) => { const x0 = f1(x + s / 2 + 10), x1 = f1(xs[i + 1] - s / 2 - 10), D = arrowD(x0, x1, y, 36, 86, Math.min(44, (x1 - x0) * .6), false, true); popAt(p, (x0 + x1) / 2, y, Q.tI(i + 1)).path(D, F(3.4));
      if (i < Q.K) { const tl = f3(lerp(Q.tP(i), Q.tP(i + 1), .5)), L = sub(p); on(L, p, 0, { o: [[0, 0], [tl, 0], [f3(tl + tu(.08)), 1]] }); L.path(D, { fill: ACC1, sw: 3.4, stroke: ACC1 }); ripple(p, (x0 + x1) / 2, y, 40, tl); } });
    xs.forEach((x, i) => { entBox(p, c, d, i, x, y, s, 'drop'); const dn = n >= 3 && i % 2; stepWord(p, d, i, x, dn ? f1(y + s / 2 + 62) : f1(y - s / 2 - 62), { pill: true, size: 44, maxW: n >= 3 ? 340 : Math.min(340, s + aw - 60) }); });
    markT(p, d, Q.K % 2 && n >= 3 ? corner(xs[Q.K], y, s) : cornerB(xs[Q.K], y, s)); }); });

  /* 23 ── PIPS (จุดบอกลำดับ): under each box a row of pips counts its place (one, two, three …) — no numbers; the pips light as the progress passes */
  variant('pips', 'จุดบอกลำดับ', (d, c) => { art(c, p => { const Q = STP(d), n = Q.N, s = SZ4(n), g = GP4(n), xs = rowXs(n, s, g), y = -30, PY = f1(y + s / 2 + 52);
    xs.forEach((x, i) => { entBox(p, c, d, i, x, y, s, 'drop'); stepWord(p, d, i, x, f1(y - s / 2 - 44), { size: 44, maxW: s + g - 20 }); const tt = passed(Q, i) ?? (i === Q.K && Q.HOW !== 'x' ? Q.H : null);
      for (let k = 0; k <= i; k++) { const px = f1(x + (k - i / 2) * 40); popAt(p, px, PY, f3(Q.tI(i) + tu(.2 + .04 * k))).circle(px, PY, 14, F(3)); if (tt != null) popAt(p, px, PY, f3(tt + tu(.03 * k))).circle(px, PY, 9, DOTF()); } });
    markT(p, d, cornerB(xs[Q.K], y, s)); }); });

  /* 24 ── BARS (แท่งไต่ระดับ): bars rise taller step by step, each box drops onto its bar's top; the bars fill with light as passed; words at the feet */
  variant('bars', 'แท่งไต่ระดับ', (d, c) => { art(c, p => { const Q = STP(d), n = Q.N, s = n >= 4 ? 170 : n === 3 ? 196 : 220, bw = s + 8, xs = rowXs(n, bw, n >= 4 ? 40 : n === 3 ? 70 : 140), BY = 330, hs = xs.map((_, i) => f1(n > 1 ? lerp(150, 380, i / (n - 1)) : 260));
    xs.forEach((x, i) => { const h = hs[i], t = Q.tI(i), S_ = stState(Q, i), bg0 = mvG(p, upK(x, BY, t, .3)); if (S_.dim) R(bg0, x - bw / 2, BY - h, bw, h + 40, 24, BK);
      const bg = S_.dim ? mvG(bg0, { o: dimKeys(Q, S_.to) }) : bg0; R(bg, x - bw / 2, BY - h, bw, h + 40, 24, F(3.4)); const tt = passed(Q, i) ?? (S_.lit ? Q.H : null);
      if (tt != null) R(litOn(bg, tt), x - bw / 2 + 10, BY - h + 10, bw - 20, h - 20, 16, { fill: TA(.2), sw: 0, stroke: 'none' });
      stepWord(p, d, i, x, f1(BY - 40), { size: 40, maxW: bw - 24 });
      const yb = f1(BY - h - 12 - s / 2), t0 = f3(t + tu(.24)), t1 = f3(t0 + tu(.26)), K = fallK(x, yb + s / 2, t0, t1, f1(yb + s / 2 + 360)); stepBox(p, c, d, i, x, yb, s, { g: mvG(CL(p), K), mv: K, t: t0 }); dust(p, x, yb + s / 2, t1, .8); });
    markT(p, d, corner(xs[Q.K], f1(BY - hs[Q.K] - 12 - s / 2), s)); }); });

  /* 25 ── HONEYCOMB (รังผึ้ง): hexagon cells spin in, up and down like a comb; light runs from cell to cell; words outside */
  variant('honeycomb', 'รังผึ้ง', (d, c) => { art(c, p => { const Q = STP(d), n = Q.N, sz = n >= 4 ? 224 : n === 3 ? 246 : 260, dx = f1(sz * .866 + 12), xs = rowXs(n, dx, 0), ys = xs.map((_, i) => n < 2 ? 0 : i % 2 ? 78 : -62);
    links(p, Q, xs.slice(0, -1).map((x, i) => `M ${x} ${ys[i]} L ${xs[i + 1]} ${ys[i + 1]}`), { base: { sw: 0, stroke: 'none' }, lit: { sw: 10, stroke: ACC1 } });
    xs.forEach((x, i) => { entBox(p, c, d, i, x, ys[i], sz, 'spin', { shape: 'hex' }); stepWord(p, d, i, x, i % 2 ? f1(ys[i] + sz / 2 + 52) : f1(ys[i] - sz / 2 - 34), { size: 44, maxW: dx * 2 - 60 }); });
    markT(p, d, [f1(xs[Q.K] + sz * .38), f1(ys[Q.K] - sz * .3)]); }); });

  /* 26 ── TOGGLES (สวิตช์ทีละตัว): under each box a switch; as the progress passes each switch flips on (lit); the target's on H (x: stays off) */
  variant('toggles', 'สวิตช์ทีละตัว', (d, c) => { art(c, p => { const Q = STP(d), n = Q.N, s = SZ4(n), g = GP4(n), xs = rowXs(n, s, g), y = -56, TY = f1(y + s / 2 + 88), TW = 136, TK = 66;
    xs.forEach((x, i) => { entBox(p, c, d, i, x, y, s, 'drop'); stepWord(p, d, i, x, f1(y - s / 2 - 44), { size: 44, maxW: s + g - 20 });
      const S_ = stState(Q, i), tt = passed(Q, i) ?? (S_.lit ? Q.H : null), tg0 = popAt(p, x, TY, f3(Q.tI(i) + tu(.2))); R(tg0, x - TW / 2, TY - TK / 2, TW, TK, TK / 2, F(3.4));
      if (tt != null) R(litOn(tg0, tt), x - TW / 2 + 6, TY - TK / 2 + 6, TW - 12, TK - 12, (TK - 12) / 2, { fill: TA(.32), sw: 0, stroke: 'none' });
      const kn = mvG(p, { x: tt != null ? [[0, 0], [tt, 0], [f3(tt + tu(.14)), TW - TK, 'out']] : [[0, 0]], o: fadeIn(f3(Q.tI(i) + tu(.24)), .05) }), kx = f1(x - TW / 2 + TK / 2);
      kn.circle(kx, TY, TK / 2 - 9, F(3)); if (tt != null) litOn(kn, tt).circle(kx, TY, TK / 2 - 9, DOTF()); });
    markT(p, d, cornerB(xs[Q.K], y, s)); }); });

  /* 27 ── RING LIST (วงแบ่งท่อน): a ring cut into one arc per step, the list of steps beside it; the arcs light one by one, the ring's centre shows the
     current step's icon */
  variant('ringlist', 'วงแบ่งท่อน', (d, c) => { art(c, p => { const Q = STP(d), n = Q.N, RC = [-292, 20], RR = 168, rh = RH4(n), s = rh - (n >= 4 ? 8 : 34), ys = rowXs(n, rh, 0, 0), BX = 18, seg = 360 / n, ph = phOf(Q);
    const arc = i => { const a0 = -90 + seg * i + 6, a1 = -90 + seg * (i + 1) - 6, P = a => f1(RC[0] + RR * Math.cos(rad(a))) + ' ' + f1(RC[1] + RR * Math.sin(rad(a))); return `M ${P(a0)} A ${RR} ${RR} 0 ${seg - 12 > 180 ? 1 : 0} 1 ${P(a1)}`; };
    for (let i = 0; i < n; i++) { drawAt(p.path(arc(i), { sw: 30, stroke: TL_(.2) }), p, Q.tI(i), tu(.25)); const tt = passed(Q, i) ?? (i === Q.K && Q.HOW !== 'x' ? Q.H : null);
      if (tt != null) { const a = p.path(arc(i), { sw: 22, stroke: ACC1 }); on(a, p, 0, { draw: [[0, 0], [f3(tt - tu(.2)), 0], [tt, 1, 'io']] }); }
      const X_ = Q.it[i], io = showK(ph, i); if (i <= Q.K) { if (X_ && picOf(X_)) put(p, c, { icon: X_.icon }, RC[0], RC[1], 170, null, { t: f3(ph[0][0] - tu(.1)), o: io }); else if (X_) { const g = sub(p); on(g, p, 0, { o: io }); txt(g, X_.label, RC[0], RC[1] + 18, { size: 50, maxW: 220, weight: 800, color: C.ink, wrap: 'mid' }); } } }
    ys.forEach((y, i) => { entBox(p, c, d, i, BX, y, s, 'right'); stepWord(p, d, i, f1(BX + s / 2 + 24), f1(y + 17), { anchor: 'start', size: 46, maxW: f1(470 - (BX + s / 2 + 24)), wrap: null }); });
    markT(p, d, corner(BX, ys[Q.K], s, -1)); }); });

  /* 28 ── FLIP REVEAL (พลิกเปิดทีละแผ่น): a row of face-down tiles drops in at once; they flip over one by one to show the steps; words above */
  variant('flipreveal', 'พลิกเปิดทีละแผ่น', (d, c) => { art(c, p => { const Q = STP(d), n = Q.N, s = SZ4(n), g = GP4(n), xs = rowXs(n, s, g), y = 30;
    xs.forEach((x, i) => { const tb = f3(tu(.04 + .04 * i)), ft = f3(Q.tI(i) + tu(.22)), bk = mvG(p, { px: x, py: y, sx: [[0, 1], [ft, 1], [f3(ft + tu(.12)), 0, 'in']], o: fadeIn(tb, .05).concat([[f3(ft + tu(.12)), 1], [f3(ft + tu(.13)), 0]]) });
      R(bk, x - s / 2, y - s / 2, s, s, s * .24, F(4)); R(bk, x - s / 2 + 22, y - s / 2 + 22, s - 44, s - 44, s * .18, DASH(.45)); bk.circle(x, y, 16, { fill: TL_(.45), sw: 0, stroke: 'none' });
      const K = { px: x, py: y, sx: [[0, 0], [f3(ft + tu(.12)), 0], [f3(ft + tu(.24)), 1.08, 'out'], [f3(ft + tu(.34)), 1, 'soft']], o: [[0, 0], [f3(ft + tu(.12)), 0], [f3(ft + tu(.13)), 1]] };
      stepBox(p, c, d, i, x, y, s, { g: mvG(p, K), mv: K, t: f3(ft + tu(.12)) }); stepWord(p, d, i, x, f1(y - s / 2 - 44), { size: 44, maxW: s + g - 20, t: f3(ft + tu(.2)) }); });
    markT(p, d, cornerB(xs[Q.K], y, s)); }); });

  /* 29 ── CARDS (การ์ดเรียง): tall cards rise in side by side — the word as a header, the icon box, the line of words (texts); the target card lights */
  variant('cards', 'การ์ดเรียง', (d, c) => { art(c, p => { const Q = STP(d), n = Q.N, cw = n >= 4 ? 214 : n === 3 ? 270 : 330, xs = rowXs(n, cw, n >= 4 ? 16 : n === 3 ? 36 : 80), CH = 520, y = 10, bs = n >= 4 ? 170 : 190;
    xs.forEach((x, i) => { const K = ent('rise', x, y, CH, Q.tI(i)), gg = mvG(CL(p), K), hw = !!LBI(Q, i), iy = f1(hw ? y - 36 : y - 70);
      const g = stepBox(p, c, d, i, x, iy, cw, { g: gg, mv: K, t: Q.tI(i), draw: (q, st) => R(q, x - cw / 2, y - CH / 2, cw, CH, 34, st), iw: bs * .72, lw: cw - 40 }); R(g, x - bs / 2, iy - bs / 2, bs, bs, bs * .24, SL(1.8));
      if (hw) stepWord(p, d, i, x, f1(y - CH / 2 + 62), { g, size: 44, maxW: cw - 30, noDim: true }); stepNote(p, d, i, x, f1(iy + bs / 2 + 52), cw - 44, { g, anchor: 'middle', noDim: true }); });
    markT(p, d, [f1(xs[Q.K] + cw / 2 - 20), f1(y - CH / 2 + 20)]); }); });

  /* 30 ── FOCUS (กรอบโฟกัส): four corner marks hop from box to box with the progress and lock tight on the target on H (turning to the accent) */
  variant('focus', 'กรอบโฟกัส', (d, c) => { art(c, p => { const Q = STP(d), n = Q.N, s = SZ4(n), g = GP4(n) + 10, xs = rowXs(n, s, g), y = 52, AL = 44;
    xs.forEach((x, i) => { entBox(p, c, d, i, x, y, s, 'pop', { passRip: false }); stepWord(p, d, i, x, f1(y - s / 2 - 60), { size: 46, maxW: s + g - 20 }); });
    const R_ = (i, k) => [xs[i], y, s / 2 + k, s / 2 + k], fin = R_(Q.K, 14), seq = [[f3(Q.tP(0) - tu(.14)), R_(0, 28)]]; for (let i = 1; i <= Q.K; i++) seq.push([Q.tP(i), R_(i, 28)]); seq.push([f3(Q.H + tu(.12)), fin]);
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sy]) => { const at = r => [r[0] + sx * r[2], r[1] + sy * r[3]], F_ = at(fin), kx = [], ky = [];
      seq.forEach(([t, r], i) => { const [x, yy] = at(r); if (!i) { kx.push([0, x], [t, x]); ky.push([0, yy], [t, yy]); } else { const ta = f3(t - tu(.2)); kx.push([ta, kx[kx.length - 1][1]], [f3(t), x]); ky.push([ta, ky[ky.length - 1][1]], [f3(t), yy]); } });
      const cg = mvG(p, { x: offK(kx, F_[0]), y: offK(ky, F_[1]), o: fadeIn(seq[0][0], .06) }), dd = `M ${F_[0]} ${F_[1] - sy * AL} L ${F_[0]} ${F_[1]} L ${F_[0] - sx * AL} ${F_[1]}`;
      cg.path(dd, { sw: 7, stroke: TL_(.75) }); litOn(cg, Q.H).path(dd, { sw: 8, stroke: ACC1 }); });
    markT(p, d, cornerB(xs[Q.K], y, s)); }); });

  /* 31 ── SLANTS (แถบเฉียง): slanted panels slide down into place side by side, each holding a step (icon box, word below); they light in turn */
  variant('slants', 'แถบเฉียง', (d, c) => { art(c, p => { const Q = STP(d), n = Q.N, sl = 70, pw = f1((900 - sl) / n), xs = rowXs(n, pw, 0), PH2 = 600, y = 10, bs = Math.min(n >= 4 ? 170 : 206, pw - 40);
    xs.forEach((x, i) => { const P4 = [[x - pw / 2 + sl / 2 + 6, y - PH2 / 2], [x + pw / 2 + sl / 2 - 6, y - PH2 / 2], [x + pw / 2 - sl / 2 - 6, y + PH2 / 2], [x - pw / 2 - sl / 2 + 6, y + PH2 / 2]].map(q => [f1(q[0]), f1(q[1])]);
      const K = ent('drop', x, y, PH2, Q.tI(i)), gg = mvG(CL(p), K), iy = f1(y - 70), g = stepBox(p, c, d, i, x, iy, pw, { g: gg, mv: K, t: Q.tI(i), draw: (q, st) => shape(q, P4, st), iw: bs * .72, lw: pw - 40 });
      R(g, x - bs / 2, iy - bs / 2, bs, bs, bs * .24, SL(1.8)); stepWord(p, d, i, x, f1(y + 150), { g, size: 44, maxW: pw - 50, noDim: true }); });
    markT(p, d, [f1(xs[Q.K] + pw / 2 - 10), f1(y - PH2 / 2 + 40)]); }); });

  /* 32 ── STEPPER (ตัวบอกขั้น): a row of nodes on a line up top marks the order; the page below shows the current step big — icon, word, its line of
     words (texts); node by node it moves on and stops on the target */
  variant('stepper', 'ตัวบอกขั้น', (d, c) => { art(c, p => { const Q = STP(d), n = Q.N, NY = -246, nx = rowXs(n, n > 1 ? 720 / (n - 1) : 0, 0), bs = 256, BX = -250, BY = 70, ph = phOf(Q);
    drawAt(p.line(nx[0], NY, nx[n - 1], NY, { sw: 4, stroke: TL_(.35) }), p, tu(.04), tu(.35)); links(p, Q, nx.slice(0, -1).map((x, i) => `M ${x} ${NY} L ${nx[i + 1]} ${NY}`), { base: { sw: 0, stroke: 'none' } });
    nx.forEach((x, i) => { const tt = passed(Q, i) ?? (i === Q.K ? Q.H : null), g = popAt(p, x, NY, Q.tI(i)); g.circle(x, NY, 30, F(3.6)); if (tt != null) { popAt(p, x, NY, tt).circle(x, NY, 16, DOTF()); ripple(p, x, NY, 40, tt); } });
    const bx = popAt(p, BX, BY, tu(.2)); R(bx, BX - bs / 2, BY - bs / 2, bs, bs, bs * .24, F(4)); const S_ = stState(Q, Q.K); if (S_.lit) { R(litOn(bx, Q.H), BX - bs / 2, BY - bs / 2, bs, bs, bs * .24, LIT2()); ripple(p, BX, BY, bs * .58, f3(Q.H + tu(.04))); }
    for (let i = 0; i <= Q.K; i++) { const X_ = Q.it[i], io = showK(ph, i), pg = sub(p); on(pg, p, 0, { o: io });
      if (X_ && picOf(X_)) put(p, c, { icon: X_.icon }, BX, BY, bs * .72, null, { t: f3(ph[0][0] - tu(.1)), o: i === Q.K && S_.dim ? io.concat([[f3(Q.H + tu(.2)), S_.to]]) : io, punch: i === Q.K && S_.lit ? Q.H : undefined });
      else if (X_) txt(pg, X_.label, BX, BY + 18, { size: 56, maxW: bs * .84, weight: 800, color: C.ink, wrap: 'mid' });
      const hw = !!LBI(Q, i); if (hw) txt(pg, LBI(Q, i), -90, BY - 20, { size: 60, maxW: 540, weight: 800, color: C.ink, anchor: 'start' }); stepNote(p, d, i, -90, hw ? BY + 44 : BY - 10, 540, { g: pg, t: 0, noDim: true, size: 44 }); }
    markT(p, d, corner(BX, BY, bs)); }); });

  /* 33 ── PINS (หมุดเส้นทาง): map-pin shapes pop in up and down along a winding dashed route through their tips; a token runs the route */
  variant('pins', 'หมุดเส้นทาง', (d, c) => { art(c, p => { const Q = STP(d), n = Q.N, r = n >= 4 ? 96 : n === 3 ? 108 : 118, xs = rowXs(n, 2 * r, n >= 4 ? 34 : n === 3 ? 80 : 160), ys = xs.map((_, i) => n < 2 ? -40 : i % 2 ? -10 : -116), tips = xs.map((x, i) => [x, f1(ys[i] + r * 1.9)]);
    drawAt(p.path(curveD(tips), DASH(.5)), p, tu(.1), tu(.5));
    xs.forEach((x, i) => { entBox(p, c, d, i, x, ys[i], 2 * r, 'drop', { draw: (q, st) => q.path(pinD(x, ys[i], r), st), iw: r * 1.32, dust: false }); stepWord(p, d, i, x, f1(ys[i] - r - 34), { size: 44, maxW: 2 * r + 30 }); });
    token(p, Q, tips, { via: viaBez(tips), r: 16 }); markT(p, d, [f1(xs[Q.K] + r * .9), f1(ys[Q.K] + r * .25)]); }); });

  /* 34 ── RING CHAIN (ห่วงคล้องกัน): rings spin in and link into a chain; they light one by one; words alternate above / below */
  variant('ringchain', 'ห่วงคล้องกัน', (d, c) => { art(c, p => { const Q = STP(d), n = Q.N, r = n >= 4 ? 118 : n === 3 ? 132 : 150, dx = f1(2 * r - (n >= 4 ? 30 : 40)), xs = rowXs(n, dx, 0), y = 30;
    xs.forEach((x, i) => { entBox(p, c, d, i, x, y, 2 * r, 'spin', { shape: 'circ', style: { sw: 4.6 }, bk: false, litStyle: { sw: 6, stroke: ACC1 }, iw: r * 1.25 });
      stepWord(p, d, i, x, i % 2 ? f1(y + r + 58) : f1(y - r - 40), { size: 44, maxW: 2 * dx - 60 }); });
    markT(p, d, Q.K % 2 ? [f1(xs[Q.K] + r * .7), f1(y - r * .7)] : [f1(xs[Q.K] + r * .7), f1(y + r * .7)]); }); });

  /* 35 ── ARC (โค้งข้ามฟ้า): the boxes rise in along a high dashed arc; a token sails over it step to step; words under the boxes, inside the arc */
  variant('arc', 'โค้งข้ามฟ้า', (d, c) => { art(c, p => { const Q = STP(d), n = Q.N, s = n >= 4 ? 170 : n === 3 ? 196 : 224, AC = [0, 330], AR = 430, AN = n >= 4 ? [210, 250, 290, 330] : n === 3 ? [214, 270, 326] : [232, 308];
    const P = a => [f1(AC[0] + AR * Math.cos(rad(a))), f1(AC[1] + AR * Math.sin(rad(a)))], pos = AN.map(P);
    drawAt(p.path(pathOf(Array.from({ length: 41 }, (_, k) => P(lerp(AN[0] - 10, AN[n - 1] + 10, k / 40))), false), DASH(.45)), p, tu(.04), tu(.5));
    pos.forEach(([x, y], i) => { entBox(p, c, d, i, x, y, s, 'rise'); stepWord(p, d, i, x, f1(y + s / 2 + 52), { size: 44, maxW: s + 44 }); });
    token(p, Q, pos, { via: i => Array.from({ length: 7 }, (_, k) => P(lerp(AN[i], AN[i + 1], (k + 1) / 8))), r: 18 }); markT(p, d, corner(...pos[Q.K], s)); }); });

  /* 36 ── FUNNEL (กรวยลำดับ): bands narrowing downward slide in from alternate sides — icon at each band's left, the word along it; they light in turn */
  variant('funnel', 'กรวยลำดับ', (d, c) => { art(c, p => { const Q = STP(d), n = Q.N, rh = RH4(n), h = rh - 14, s = h - 22, ys = rowXs(n, rh, 0, 0);
    ys.forEach((y, i) => { const w = f1(n > 1 ? lerp(900, 560, i / (n - 1)) : 760), bx = f1(-w / 2 + 12 + s / 2), K = ent(i % 2 ? 'right' : 'left', 0, y, w, Q.tI(i)), gg = mvG(CL(p), K);
      const g = stepBox(p, c, d, i, 0, y, h, { g: gg, mv: K, t: Q.tI(i), draw: (q, st) => R(q, -w / 2, y - h / 2, w, h, h / 2, st), ix: bx, iw: s * .7, lw: s * .84 });
      g.circle(bx, y, s / 2, SL(1.6)); const lx = f1(bx + s / 2 + 24); stepWord(p, d, i, lx, f1(y + 17), { g: gg, anchor: 'start', size: 48, maxW: f1(w / 2 - 50 - lx), wrap: null }); });
    markT(p, d, [f1((n > 1 ? lerp(900, 560, Q.K / (n - 1)) : 760) / 2 - 40), f1(ys[Q.K] - 10)]); }); });

  /* 37 ── DIAL (หน้าปัดชี้): the steps stand round a half dial; a needle from the hub swings to each step in turn and settles on the target on H */
  variant('dial', 'หน้าปัดชี้', (d, c) => { art(c, p => { const Q = STP(d), n = Q.N, s = n >= 4 ? 170 : n === 3 ? 192 : 220, HC = [0, 296], Rd = 400, AN = n >= 4 ? [205, 245, 295, 335] : n === 3 ? [210, 270, 330] : [235, 305], ph = phOf(Q);
    const pos = AN.map(a => [f1(HC[0] + Rd * Math.cos(rad(a))), f1(HC[1] + Rd * Math.sin(rad(a)))]), arcP = r => `M ${f1(HC[0] - r)} ${HC[1]} A ${r} ${r} 0 0 1 ${f1(HC[0] + r)} ${HC[1]}`;
    drawAt(p.path(arcP(250), { sw: 26, stroke: TL_(.16) }), p, tu(.04), tu(.4)); for (let k = 0; k <= 12; k++) { const a = rad(180 + k * 15); drawAt(p.line(f1(HC[0] + 222 * Math.cos(a)), f1(HC[1] + 222 * Math.sin(a)), f1(HC[0] + 238 * Math.cos(a)), f1(HC[1] + 238 * Math.sin(a)), { sw: 3, stroke: TL_(.45) }), p, f3(tu(.2 + .015 * k)), tu(.1)); }
    pos.forEach(([x, y], i) => { entBox(p, c, d, i, x, y, s, 'drop'); stepWord(p, d, i, x, f1(y - s / 2 - 38), { size: 44, maxW: n >= 4 ? 220 : 280 }); });
    const rk = posK(ph, w => f1(AN[w] + 90), .24), ng = mvG(p, { px: HC[0], py: HC[1], r: [[0, f1(AN[0] + 90 - 40)], [f3(ph[0][0] - tu(.3)), f1(AN[0] + 90 - 40)], [f3(ph[0][0]), f1(AN[0] + 90), 'out']].concat(rk.slice(1)), o: fadeIn(f3(ph[0][0] - tu(.3)), .06) });
    ng.path(`M ${HC[0] - 14} ${HC[1]} L ${HC[0]} ${HC[1] - 230} L ${HC[0] + 14} ${HC[1]} Z`, { fill: ACC1, sw: 2.4, stroke: ACC1 }); const hg = popAt(p, ...HC, tu(.3)); hg.circle(...HC, 40, F(4)); hg.circle(...HC, 14, DOTF());
    markT(p, d, cornerB(...pos[Q.K], s)); }); });

  /* 38 ── BIG ARROW (ลูกศรใหญ่แบ่งช่อง): one big arrow outline draws across; it is cut into a room per step; the rooms fill with light in turn and the
     head lights on H. Words above the rooms */
  variant('bigarrow', 'ลูกศรใหญ่แบ่งช่อง', (d, c) => { art(c, p => { const Q = STP(d), n = Q.N, X0 = -470, X1 = 300, XH = 468, Y = 52, BHh = 300, HHh = 430, cw = (X1 - X0) / n, xs = Array.from({ length: n }, (_, i) => f1(X0 + cw * (i + .5))), s = Math.min(n >= 4 ? 168 : 206, cw - 24);
    const AD = pathOf([[X0, Y - BHh / 2], [X1, Y - BHh / 2], [X1, Y - HHh / 2], [XH, Y], [X1, Y + HHh / 2], [X1, Y + BHh / 2], [X0, Y + BHh / 2]]); drawAt(p.path(AD, F(4.4)), p, tu(.02), tu(.5));
    xs.slice(1).forEach(x => drawAt(p.line(f1(x - cw / 2), Y - BHh / 2 + 12, f1(x - cw / 2), Y + BHh / 2 - 12, { sw: 2.6, stroke: TL_(.4) }), p, tu(.3), tu(.15)));
    xs.forEach((x, i) => { const tt = passed(Q, i) ?? (i === Q.K && Q.HOW !== 'x' ? Q.H : null); if (tt != null) R(litOn(p, tt), f1(x - cw / 2 + 8), Y - BHh / 2 + 8, f1(cw - 16), BHh - 16, 20, { fill: TA(.14), sw: 0, stroke: 'none' });
      entBox(p, c, d, i, x, Y, s, 'pop'); stepWord(p, d, i, x, f1(Y - HHh / 2 - 6), { size: 44, maxW: cw - 16 }); });
    if (!Q.HOW || Q.HOW !== 'x') litOn(p, Q.H).path(pathOf([[X1, Y - HHh / 2], [XH, Y], [X1, Y + HHh / 2]]), { fill: TA(.3), sw: 4.4, stroke: ACC1 });
    markT(p, d, cornerB(xs[Q.K], Y, s)); }); });

  /* 39 ── CONSTELLATION (กลุ่มดาวเชื่อมจุด): boxes spin in scattered like stars; lines join them in order and light star to star */
  variant('constellation', 'กลุ่มดาวเชื่อมจุด', (d, c) => { art(c, p => { const Q = STP(d), n = Q.N, s = n >= 4 ? 170 : n === 3 ? 196 : 220, P = (n >= 4 ? [[-330, -110], [-92, 132], [150, -146], [360, 104]] : n === 3 ? [[-300, -100], [0, 130], [300, -100]] : [[-220, -60], [220, 80]]).slice(0, n);
    links(p, Q, P.slice(0, -1).map((a, i) => `M ${a[0]} ${a[1]} L ${P[i + 1][0]} ${P[i + 1][1]}`), { base: { sw: 3, stroke: TL_(.45), 'stroke-dasharray': '6 12' } });
    [[-420, 230], [-200, -250], [40, 20], [280, 260], [420, -230], [-30, -290]].forEach(([x, y], k) => star4(popAt(p, x, y, f3(tu(.1 + .06 * k))), x, y, 16, { fill: TL_(.5), sw: 0, stroke: 'none' }));
    P.forEach(([x, y], i) => { entBox(p, c, d, i, x, y, s, 'spin'); stepWord(p, d, i, x, y < 0 ? f1(y - s / 2 - 38) : f1(y + s / 2 + 56), { size: 44, maxW: 260 }); });
    markT(p, d, P[Q.K][1] < 0 ? cornerB(...P[Q.K], s) : corner(...P[Q.K], s)); }); });

  /* 40 ── SEGMENT (แถบเลือกเลื่อน): one long tray holds the steps; a lit block slides under each in turn and settles under the target; words above */
  variant('segment', 'แถบเลือกเลื่อน', (d, c) => { art(c, p => { const Q = STP(d), n = Q.N, TW2 = 920, Y = 70, TH2 = 244, cw = TW2 / n, xs = rowXs(n, cw, 0), s = Math.min(n >= 4 ? 172 : 206, cw - 44), ph = phOf(Q), last = xs[Q.K];
    R(mvG(p, { px: 0, py: Y, sx: [[0, .2], [tu(.04), .2], [tu(.34), 1.03, 'out'], [tu(.44), 1, 'soft']], o: fadeIn(tu(.04), .06) }), -TW2 / 2, Y - TH2 / 2, TW2, TH2, 60, F(3.6));
    const hk = { px: last, py: Y, x: [[0, f1(xs[0] - last)], [f3(ph[0][0] - tu(.1)), f1(xs[0] - last)]].concat(offK(posK(ph, w => xs[w]), last).slice(1)), o: fadeIn(f3(ph[0][0] - tu(.12)), .06) }, hg = mvG(p, hk);
    R(hg, f1(last - cw / 2 + 12), Y - TH2 / 2 + 12, f1(cw - 24), TH2 - 24, 46, { fill: TA(.16), sw: 3, stroke: TL_(.5) }); if (stState(Q, Q.K).lit) R(litOn(hg, Q.H), f1(last - cw / 2 + 12), Y - TH2 / 2 + 12, f1(cw - 24), TH2 - 24, 46, { sw: 5, stroke: ACC1 });
    xs.forEach((x, i) => { stepBox(p, c, d, i, x, Y, s, { passRip: false }); stepWord(p, d, i, x, f1(Y - TH2 / 2 - 44), { size: 44, maxW: cw - 20 }); });
    markT(p, d, cornerB(xs[Q.K], Y, s)); }); });

  /* 41 ── STAIRS (ขั้นบันได): a solid staircase rises; each box drops onto its tread; a token climbs tread to tread; words on the riser faces */
  variant('stairs', 'ขั้นบันได', (d, c) => { art(c, p => { const Q = STP(d), n = Q.N, s = n >= 4 ? 168 : n === 3 ? 196 : 224, tw3 = 940 / n, xs = rowXs(n, tw3, 0), ty = xs.map((_, i) => f1(n > 1 ? lerp(165, -108, i / (n - 1)) : 60));
    const pts = [[-470, 340], [-470, ty[0]]]; xs.forEach((x, i) => { const xr = f1(x + tw3 / 2); pts.push([xr, ty[i]]); if (i < n - 1) pts.push([xr, ty[i + 1]]); }); pts.push([470, 340]);
    R(mvG(p, upK(0, 340, tu(.02), .36)), -470, -470, 0, 0, 0, W(0)); const sg = mvG(CL(p), upK(0, 340, tu(.02), .36)); sg.path(pathOf(pts), F(4));
    const tops = xs.map((x, i) => [x, f1(ty[i] - 8 - s / 2)]);
    xs.forEach((x, i) => { const K = ent('drop', x, tops[i][1], s, Q.tI(i)); stepBox(p, c, d, i, x, tops[i][1], s, { g: mvG(CL(p), K), mv: K, t: Q.tI(i) }); dust(p, x, f1(ty[i] - 8), K.land, .8);
      stepWord(p, d, i, x, f1(ty[i] + 62), { size: 44, maxW: tw3 - 30 }); });
    const pts2 = tops.map(([x, y]) => [x, f1(y - s / 2 - 30)]); token(p, Q, pts2, { r: 18, via: i => [.25, .5, .75].map(u => [f1(lerp(pts2[i][0], pts2[i + 1][0], u)), f1(lerp(pts2[i][1], pts2[i + 1][1], u) - 4 * 120 * u * (1 - u))]) });
    markT(p, d, corner(...tops[Q.K], s)); }); });

  /* 42 ── CARD FAN (การ์ดพัด): cards rise into a fan, each tilted round one point below; as the progress passes each card lifts; the target lights */
  variant('cardfan', 'การ์ดพัด', (d, c) => { art(c, p => { const Q = STP(d), n = Q.N, PV = [0, 960], RF = 900, AN = n >= 4 ? [-22.5, -7.5, 7.5, 22.5] : n === 3 ? [-15, 0, 15] : [-8.5, 8.5], cw = 208, ch = 330, bs = 168;
    AN.forEach((a, i) => { const cx = f1(PV[0] + RF * Math.sin(rad(a))), cy = f1(PV[1] - RF * Math.cos(rad(a))), t = Q.tI(i), t1 = f3(t + tu(.3)), tt = passed(Q, i) ?? (stState(Q, i).lit ? Q.H : null);
      const K = { px: cx, py: cy, r: [[0, a]], y: [[0, 520], [t, 520], [t1, -12, 'out'], [f3(t1 + tu(.1)), 0, 'soft']].concat(tt != null ? [[tt, 0], [f3(tt + tu(.2)), -30, 'out']] : []), o: fadeIn(t, .04) }, iy = f1(cy - 50);
      const g = stepBox(p, c, d, i, cx, cy, cw, { g: mvG(CL(p), K), mv: K, t, draw: (q, st) => R(q, cx - cw / 2, cy - ch / 2, cw, ch, 28, st), iy, iw: bs * .72, lw: cw - 30, passRip: false });
      R(g, cx - bs / 2, iy - bs / 2, bs, bs, bs * .24, SL(1.8)); stepWord(p, d, i, cx, f1(cy + ch / 2 - 52), { g, size: 42, maxW: cw - 28, noDim: true }); });
    const a = AN[Q.K], cx = PV[0] + RF * Math.sin(rad(a)), cy = PV[1] - RF * Math.cos(rad(a)); markT(p, d, rotP(cx + cw / 2 - 18, cy - ch / 2 - 12, cx, cy, a)); }); });

  /* 43 ── RING BOX (วงรอบวง): round plates pop in, each inside a ring track; as the progress passes, the ring closes round in the accent */
  variant('ringbox', 'วงรอบวง', (d, c) => { art(c, p => { const Q = STP(d), n = Q.N, s = n >= 4 ? 166 : n === 3 ? 196 : 226, g = GP4(n), xs = rowXs(n, s + 36, g - 36 > 10 ? g - 36 : 12), y = 22, rr = f1(s / 2 + 19);
    xs.forEach((x, i) => { popAt(p, x, y, Q.tI(i)).circle(x, y, rr, { sw: 9, stroke: TL_(.2) }); const tt = passed(Q, i) ?? (i === Q.K && Q.HOW !== 'x' ? Q.H : null);
      if (tt != null) { const a = p.path(arcD(x, y, rr, 1), { sw: 9, stroke: ACC1 }); on(a, p, 0, { draw: [[0, 0], [f3(tt - tu(.3)), 0], [tt, 1, 'io']] }); }
      stepBox(p, c, d, i, x, y, s, { shape: 'circ', t: Q.tI(i) }); stepWord(p, d, i, x, i % 2 ? f1(y + rr + 58) : f1(y - rr - 40), { size: 44, maxW: n >= 4 ? 380 : s + g + 20 }); });
    markT(p, d, Q.K % 2 ? [f1(xs[Q.K] + rr * .72), f1(y - rr * .72)] : [f1(xs[Q.K] + rr * .72), f1(y + rr * .72)]); }); });

  /* 44 ── PYRAMID (พีระมิด): blocks drop in and build a pyramid — the bottom row first, the top last; each block holds its icon and its word */
  variant('pyramid', 'พีระมิด', (d, c) => { art(c, p => { const Q = STP(d), n = Q.N, bw = 256, bh = 236, P = n >= 4 ? [[-272, 160], [0, 160], [272, 160], [0, -100]] : n === 3 ? [[-136, 160], [136, 160], [0, -100]] : [[0, 160], [0, -100]];
    P.forEach(([x, y], i) => { const K = ent('drop', x, y, bh, Q.tI(i)), gg = mvG(CL(p), K), iy = f1(y - 30); dust(p, x, y + bh / 2, K.land, 1.1);
      const g = stepBox(p, c, d, i, x, y, bw, { g: gg, mv: K, t: Q.tI(i), draw: (q, st) => R(q, x - bw / 2, y - bh / 2, bw, bh, 30, st), iy, iw: 128, lw: bw - 40 }); stepWord(p, d, i, x, f1(y + bh / 2 - 34), { g, size: 42, maxW: bw - 30, noDim: true }); });
    markT(p, d, [f1(P[Q.K][0] + bw / 2 - 20), f1(P[Q.K][1] - bh / 2 + 20)]); }); });

  /* 45 ── ROW BARS (แถวแถบเต็ม): rows slide in — icon box, word, and a bar under the word that fills to full as the progress passes that step */
  variant('rowbars', 'แถวแถบเต็ม', (d, c) => { art(c, p => { const Q = STP(d), n = Q.N, rh = RH4(n), s = rh - (n >= 4 ? 8 : 34), ys = rowXs(n, rh, 0, 0), BX = -362, LX = f1(BX + s / 2 + 30), BWd = f1(450 - LX);
    ys.forEach((y, i) => { entBox(p, c, d, i, BX, y, s, 'left'); const S_ = stState(Q, i), hw = !!LBI(Q, i), by = f1(hw ? y + 30 : y);
      if (hw) stepWord(p, d, i, LX, f1(y - 18), { anchor: 'start', size: 48, maxW: BWd, wrap: null });
      const g0 = atG(p, f3(Q.tI(i) + tu(.2))), g = S_.dim ? mvG(g0, { o: dimKeys(Q, S_.to) }) : g0; R(g, LX, by - 14, BWd, 28, 14, { fill: C.fill, sw: 2.4, stroke: TL_(.5) });
      const tt = passed(Q, i) ?? (S_.lit ? Q.H : null); if (tt != null) R(mvG(g, { px: LX, py: by, sx: [[0, 0], [f3(tt - tu(.3)), 0], [tt, 1, 'io']] }), LX + 4, by - 10, BWd - 8, 20, 10, DOTF()); });
    markT(p, d, corner(BX, ys[Q.K], s, -1)); }); });

  /* 46 ── WHEEL (วงหมุนทีละขั้น): the plates sit round a wheel; it turns one step at a time bringing each step under the pointer, the page beside shows
     that step's word and its line of words (texts); it stops on the target */
  variant('wheel', 'วงหมุนทีละขั้น', (d, c) => { art(c, p => { const Q = STP(d), n = Q.N, WC = [-200, 40], RW = n >= 3 ? 180 : 150, s = n >= 4 ? 166 : 180, seg = 360 / n, ph = phOf(Q);
    const tk = [[0, 0], [f3(ph[0][0] - tu(.1)), 0]]; ph.forEach(([t, w], j) => { if (j) tk.push([f3(t - tu(.26)), (w - 1) * seg], [t, w * seg]); });
    const rotAt = t => { if (t <= tk[1][0]) return 0; for (let j = 2; j < tk.length; j += 2) { const [a0, v0] = tk[j], [a1, v1] = tk[j + 1]; if (t < a0) return v0; if (t <= a1) return v0 + (v1 - v0) * (.5 - .5 * Math.cos(Math.PI * (t - a0) / (a1 - a0))); } return tk[tk.length - 1][1]; };
    const T0 = f3(ph[0][0] - tu(.1)), TS = Array.from({ length: 41 }, (_, k) => f3(lerp(T0, Q.H, k / 40))), fin = Q.K * seg, P = (i, r) => [f1(WC[0] + RW * Math.cos(rad(-90 + i * seg - r))), f1(WC[1] + RW * Math.sin(rad(-90 + i * seg - r)))];
    drawAt(p.circle(...WC, RW, { sw: 3, stroke: TL_(.3) }), p, tu(.04), tu(.4)); popAt(p, ...WC, tu(.1)).circle(...WC, 30, F(3.6));
    const pg = mvG(CL(p), fallK(WC[0], f1(WC[1] - RW - s / 2 - 12), tu(.3), tu(.5), 200)); pg.path(`M ${WC[0] - 28} ${f1(WC[1] - RW - s / 2 - 70)} L ${WC[0] + 28} ${f1(WC[1] - RW - s / 2 - 70)} L ${WC[0]} ${f1(WC[1] - RW - s / 2 - 16)} Z`, { fill: ACC1, sw: 3, stroke: ACC1 });
    for (let i = 0; i < n; i++) { const [fx, fy] = P(i, fin), K = { px: fx, py: fy, x: TS.map(t => [t, f1(P(i, rotAt(t))[0] - fx)]), y: TS.map(t => [t, f1(P(i, rotAt(t))[1] - fy)]) }; K.x.unshift([0, K.x[0][1]]); K.y.unshift([0, K.y[0][1]]);
      stepBox(p, c, d, i, fx, fy, s, { shape: 'circ', g: mvG(popAt(p, ...P(i, 0), Q.tI(i)), K), mv: K, t: Q.tI(i), passRip: false });
      if (i <= Q.K) { const io = showK(ph, i), wg = sub(p); on(wg, p, 0, { o: io }); const X_ = Q.it[i]; if (X_ && X_.label) txt(wg, X_.label, 110, -40, { size: 58, maxW: 360, weight: 800, color: C.ink, anchor: 'start' }); stepNote(p, d, i, 110, 24, 360, { g: wg, t: 0, noDim: true, size: 44 }); } }
    markT(p, d, [f1(WC[0] + s / 2), f1(WC[1] - RW - s / 2 + 20)]); }); });

  /* 47 ── PILLS GROW (แถบเม็ดยาวขึ้น): long pills stack down, each longer than the one before; each grows out from its round icon end; they light in turn */
  variant('pillgrow', 'แถบเม็ดยาวขึ้น', (d, c) => { art(c, p => { const Q = STP(d), n = Q.N, rh = RH4(n), h = rh - 16, s = h - 18, ys = rowXs(n, rh, 0, 0), X0 = -450;
    ys.forEach((y, i) => { const L = f1(n > 1 ? lerp(470, 900, i / (n - 1)) : 700), bx = f1(X0 + 9 + s / 2), K = { px: X0, py: y, sx: [[0, f3(h / L)], [Q.tI(i), f3(h / L)], [f3(Q.tI(i) + tu(.32)), 1.02, 'out'], [f3(Q.tI(i) + tu(.42)), 1, 'soft']], o: fadeIn(Q.tI(i), .04) };
      const g = stepBox(p, c, d, i, bx, y, s, { g: mvG(p, K), t: Q.tI(i), draw: (q, st) => R(q, X0, y - h / 2, L, h, h / 2, st), ix: bx, iw: s * .66, lw: s * .8 }); g.circle(bx, y, s / 2, SL(1.6));
      stepWord(p, d, i, f1(bx + s / 2 + 26), f1(y + 17), { anchor: 'start', size: 48, maxW: f1(X0 + L - 40 - (bx + s / 2 + 26)), wrap: null, t: f3(Q.tI(i) + tu(.34)) }); });
    markT(p, d, [f1(X0 + (n > 1 ? lerp(470, 900, Q.K / (n - 1)) : 700) - 50), f1(ys[Q.K] - 20)]); }); });

  /* 48 ── DEAL (แจกการ์ด): the steps are dealt from below one by one — each card spins up in an arc and lands in the row; words above */
  variant('deal', 'แจกการ์ด', (d, c) => { art(c, p => { const Q = STP(d), n = Q.N, s = SZ4(n), g = GP4(n), xs = rowXs(n, s, g), y = 40;
    xs.forEach((x, i) => { const t = Q.tI(i), t1 = f3(t + tu(.34)), PK = pathK([[0, 520], [f1(x * .5), -160], [x, y]], t, t1, [x, y]), K = { px: x, py: y, x: PK.x, y: PK.y, r: [[0, -160], [t, -160], [t1, 0, 'out']], s: [[0, .6], [t, .6], [t1, 1, 'out'], [f3(t1 + tu(.06)), 1.1, 'out'], [f3(t1 + tu(.18)), 1, 'soft']], o: fadeIn(t, .04) };
      stepBox(p, c, d, i, x, y, s, { g: mvG(CL(p), K), mv: K, t }); ripple(p, x, y, s * .56, t1); stepWord(p, d, i, x, f1(y - s / 2 - 44), { size: 44, maxW: s + g - 20, t: f3(t1 + tu(.04)) }); });
    markT(p, d, cornerB(xs[Q.K], y, s)); }); });

  /* 49 ── PIE (วงแบ่งชิ้น): a circle cut into one slice per step; the slices pop in round the clock, each with its icon, and light in turn; words outside */
  variant('pie', 'วงแบ่งชิ้น', (d, c) => { art(c, p => { const Q = STP(d), n = Q.N, CC = [0, 20], RP = n >= 3 ? 250 : 220, seg = 360 / n, a0 = n === 2 ? -180 : -90;
    const PT = (a, r) => [f1(CC[0] + r * Math.cos(rad(a))), f1(CC[1] + r * Math.sin(rad(a)))], wedge = i => { const b0 = a0 + seg * i, b1 = b0 + seg; return `M ${CC[0]} ${CC[1]} L ${PT(b0, RP).join(' ')} A ${RP} ${RP} 0 ${seg > 180 ? 1 : 0} 1 ${PT(b1, RP).join(' ')} Z`; };
    for (let i = 0; i < n; i++) { const m = a0 + seg * (i + .5), [ix, iy] = PT(m, RP * .55), [lx, ly] = PT(m, RP + 30), cs = Math.cos(rad(m)), an = cs > .3 ? 'start' : cs < -.3 ? 'end' : 'middle';
      const tt = passed(Q, i) ?? null; stepBox(p, c, d, i, ...CC, RP * 2, { t: Q.tI(i), draw: (q, st) => q.path(wedge(i), st), ix, iy, iw: n >= 4 ? 140 : 160, lw: 170, passRip: false });
      if (tt != null) litOn(p, tt).path(wedge(i), { fill: TA(.14), sw: 0, stroke: 'none' });
      stepWord(p, d, i, lx, f1(ly + (Math.sin(rad(m)) > .5 ? 40 : Math.sin(rad(m)) < -.5 ? -6 : 16)), { anchor: an, size: 44, maxW: an === 'middle' ? 300 : f1(470 - Math.abs(lx)) }); }
    const m = a0 + seg * (Q.K + .5); markT(p, d, PT(m, RP * .55 + 80)); }); });

  /* 50 ── SPIRAL (เกลียววนเข้า): the steps lie on a curl winding in toward the middle; a dotted curl joins them and a token winds along it */
  variant('spiral', 'เกลียววนเข้า', (d, c) => { art(c, p => { const Q = STP(d), n = Q.N, s = n >= 4 ? 168 : n === 3 ? 196 : 220, P = (n >= 4 ? [[-340, 70], [-70, -205], [290, -36], [40, 178]] : n === 3 ? [[-320, 60], [0, -190], [300, 60]] : [[-240, 20], [240, 20]]).slice(0, n);
    const SL_ = n >= 4 ? ['above', 'right', 'above', 'right'] : n === 3 ? ['above', 'right', 'above'] : ['above', 'above'];
    for (let i = 0; i < n - 1; i++) for (let k = 1; k < 10; k++) { const [x, y] = bez(P[i], P[i + 1], k / 10); popAt(p, x, y, f3(Q.tI(i + 1) + tu(.02 * k))).circle(x, y, 6, { fill: TL_(.55), sw: 0, stroke: 'none' }); }
    P.forEach(([x, y], i) => { entBox(p, c, d, i, x, y, s, 'spin'); if (SL_[i] === 'right') stepWord(p, d, i, f1(x + s / 2 + 20), f1(y + 16), { anchor: 'start', size: 44, maxW: f1(Math.min(300, 470 - (x + s / 2 + 20))), wrap: null }); else stepWord(p, d, i, x, f1(y - s / 2 - 38), { size: 44, maxW: 300 }); });
    token(p, Q, P, { via: viaBez(P), r: 18 }); markT(p, d, SL_[Q.K] === 'above' ? cornerB(...P[Q.K], s) : corner(...P[Q.K], s, -1)); }); });

  /* ---------- sample data: the same sentences as B04 (A) + stress (B: 2 / 4 steps, no labels, words only, long labels, every mark) · texts on a few ---------- */
  const I = (icon, label) => label ? { icon, label } : { icon };
  const SAMPLES = [
    { say: 'ล้างมือ ใส่ถุงมือ แล้วค่อยหยิบ', items: [I('droplet', 'ล้างมือ'), I('shield-check', 'ใส่ถุงมือ'), I('package', 'หยิบของ')] },
    { say: 'ตื่น ยืดเส้น แล้วออกไปวิ่ง', items: [I('bed', 'ตื่น'), I('dumbbell', 'ยืดเส้น'), I('person-standing', 'ออกไปวิ่ง')], mark: { at: 2, how: 'light' } },
    { say: 'เช็กลม เช็กเบรก เช็กไฟ', items: [I('gauge', 'เช็กลม'), I('octagon-alert', 'เช็กเบรก'), I('lightbulb', 'เช็กไฟ')], mark: { at: 1, how: 'check' } },
    { say: 'สมัคร ยืนยันอีเมล แล้วเริ่มใช้', items: [I('user-plus', 'สมัคร'), I('mail', 'ยืนยันอีเมล'), I('rocket', 'เริ่มใช้')], mark: { at: 1, how: 'light' }, texts: ['กรอกชื่อกับเบอร์', 'กดลิงก์ในกล่องจดหมาย', 'ตั้งค่าแล้วใช้ได้เลย'] },
    { say: 'ตวงแป้ง ผสม แล้วอบ', items: [I('wheat', 'ตวงแป้ง'), I('cooking-pot', 'ผสม'), I('cake', 'อบ')], texts: ['แป้งสองถ้วย', 'คนให้เข้ากัน', 'ไฟ 180 องศา 30 นาที'] },
    { say: 'วางแผน ลงมือ ทบทวน', items: [I('clipboard-list', 'วางแผน'), I('hammer', 'ลงมือ'), I('search', 'ทบทวน')], mark: { at: 2, how: 'light' } },
    { say: 'ซื้อตั๋ว ขึ้นรถไฟ ถึงปลายทาง', items: [I('ticket', 'ซื้อตั๋ว'), I('train-front', 'ขึ้นรถไฟ'), I('map-pin', 'ถึงปลายทาง')], mark: { at: 0, how: 'check' } },
    { say: 'หาข้อมูล เขียน แล้วส่ง', items: [I('book-open', 'หาข้อมูล'), I('pen-line', 'เขียน'), I('send', 'ส่ง')], mark: { at: 1, how: 'x' } },
    { say: 'รดน้ำ ใส่ปุ๋ย รอออกดอก', items: [I('droplet', 'รดน้ำ'), I('sprout', 'ใส่ปุ๋ย'), I('flower', 'รอออกดอก')], mark: { at: 1, how: 'light' }, texts: ['ทุกเช้าก่อนแดดแรง', 'เดือนละครั้ง', 'ราวสองสัปดาห์'] },
    { say: 'ปิดไฟ ล็อกประตู แล้วเข้านอน', items: [I('lightbulb-off', 'ปิดไฟ'), I('lock', 'ล็อกประตู'), I('moon', 'เข้านอน')], mark: { at: 1, how: 'check' } },
    { say: 'ถ่ายรูป แต่งรูป แล้วโพสต์', items: [I('camera', 'ถ่ายรูป'), I('brush', 'แต่งรูป'), I('send', 'โพสต์')] },
    { say: 'จดไอเดีย คัดเลือก ลงมือทำ', items: [I('notebook-pen', 'จดไอเดีย'), I('filter', 'คัดเลือก'), I('rocket', 'ลงมือทำ')], mark: { at: 1, how: 'light' }, texts: ['เขียนทุกอย่างที่คิดได้', 'เหลือแค่ข้อที่ทำได้จริง', 'เริ่มวันนี้เลย'] },
    { say: 'ชาร์จแบต เปิดเครื่อง ต่อไวไฟ', items: [I('battery-charging', 'ชาร์จแบต'), I('power', 'เปิดเครื่อง'), I('wifi', 'ต่อไวไฟ')], mark: { at: 0, how: 'x' } },
    { say: 'วัดที่ ก่อผนัง มุงหลังคา', items: [I('ruler', 'วัดที่'), I('building', 'ก่อผนัง'), I('house', 'มุงหลังคา')], mark: { at: 0, how: 'light' } },
    { say: 'ทักทาย ฟัง แล้วค่อยตอบ', items: [I('smile', 'ทักทาย'), I('headphones', 'ฟัง'), I('message-circle', 'ตอบ')], mark: { at: 1, how: 'light' } },
    { say: 'ออกจากบ้าน แวะร้าน กลับบ้าน', items: [I('house', 'ออกจากบ้าน'), I('store', 'แวะร้าน'), I('house', 'กลับบ้าน')] },
    { say: 'ถ่าย ตัดต่อ แล้วฉาย', items: [I('camera', 'ถ่าย'), I('scissors', 'ตัดต่อ'), I('tv', 'ฉาย')], mark: { at: 1, how: 'light' } },
    { say: 'เปิดเตา ใส่น้ำมัน ตอกไข่', items: [I('cooking-pot', 'เปิดเตา'), I('droplet', 'ใส่น้ำมัน'), I('egg', 'ตอกไข่')], mark: { at: 1, how: 'check' } },
    { say: 'จัดเอกสาร เซ็นชื่อ แล้วยื่น', items: [I('file-text', 'จัดเอกสาร'), I('signature', 'เซ็นชื่อ'), I('inbox', 'ยื่น')], mark: { at: 1, how: 'light' }, texts: ['สำเนาบัตรกับทะเบียนบ้าน', 'ทุกหน้าที่มีลายเซ็น', 'ที่ช่องบริการเบอร์สาม'] },
    { say: 'เก็บของ ปิดกล่อง แล้วส่ง', items: [I('package-open', 'เก็บของ'), I('package', 'ปิดกล่อง'), I('truck', 'ส่ง')], mark: { at: 2, how: 'check' } },
  ];
  const STRESS = [
    { say: 'ไม่มีป้ายเลย', items: [I('coffee'), I('book-open'), I('bed')] },
    { say: 'ป้ายยาว 12 ตัว + ✓ ข้อ 3', items: [I('mail', 'เปิดอีเมลก่อนเลย'), I('pen-line', 'ตอบให้ครบทุกฉบับ'), I('send', 'กดส่งอย่างระวัง')], mark: { at: 2, how: 'check' } },
    { say: '✕ ข้อแรก', items: [I('key', 'หากุญแจ'), I('lock', 'ไขล็อก'), I('house', 'เข้าบ้าน')], mark: { at: 0, how: 'x' } },
    { say: 'ภาษาอังกฤษ + ติดไฟข้อ 1', items: [I('search', 'Research'), I('pen-line', 'Write'), I('send', 'Publish')], mark: { at: 0, how: 'light' } },
    { say: '4 ขั้น + ติดไฟข้อ 3', items: [I('search', 'หาข้อมูล'), I('notebook-pen', 'สรุป'), I('monitor', 'นำเสนอ'), I('message-circle', 'ตอบคำถาม')], mark: { at: 2, how: 'light' } },
    { say: '✓ ข้อแรก ไม่มีป้าย', items: [I('bell'), I('smile'), I('heart')], mark: { at: 0, how: 'check' } },
    { say: '2 ขั้น ไม่มี mark', items: [I('shirt', 'ซัก'), I('sun', 'ตาก')] },
    { say: '✕ ข้อสุดท้าย', items: [I('coffee', 'ชง'), I('glass-water', 'เติมน้ำ'), I('cake', 'กินของหวาน')], mark: { at: 2, how: 'x' } },
    { say: '4 ขั้น ไม่มี mark ป้ายยาว', items: [I('map-pin', 'ปักหมุดที่หมาย'), I('car', 'ขับไปตามทาง'), I('coffee', 'แวะพัก'), I('house', 'ถึงบ้านปลอดภัย')] },
    { say: '✓ ข้อกลาง', items: [I('apple', 'ล้าง'), I('scissors', 'หั่น'), I('salad', 'จัดจาน')], mark: { at: 1, how: 'check' } },
    { say: 'ติดไฟข้อกลาง ไม่มีป้าย', items: [I('cloud'), I('droplet'), I('sprout')], mark: { at: 1, how: 'light' } },
    { say: 'ไม่มีไอคอน (คำอย่างเดียว) + ✕ ข้อกลาง', items: [{ label: 'โทรหา' }, { label: 'ทักแชต' }, { label: 'ส่งเมล' }], mark: { at: 1, how: 'x' } },
    { say: 'ติดไฟข้อแรก', items: [I('ruler', 'วัด'), I('scissors', 'ตัด'), I('hammer', 'ประกอบ')], mark: { at: 0, how: 'light' } },
    { say: '✓ ข้อสุดท้าย', items: [I('book', 'อ่าน'), I('notebook-pen', 'จด'), I('brain', 'จำได้')], mark: { at: 2, how: 'check' } },
    { say: '2 ขั้น + ✓ ข้อแรก', items: [I('coffee', 'กาแฟ'), I('laptop', 'เริ่มงาน')], mark: { at: 0, how: 'check' } },
    { say: '✕ ข้อแรก ป้ายยาว', items: [I('cookie', 'กินขนมก่อนนอน'), I('tv', 'ดูจอจนดึกดื่น'), I('bed', 'นอนไม่หลับทั้งคืน')], mark: { at: 0, how: 'x' } },
    { say: 'ติดไฟข้อ 2 (ภาษาอังกฤษ)', items: [I('camera', 'Shoot'), I('scissors', 'Edit'), I('tv', 'Show')], mark: { at: 1, how: 'light' } },
    { say: '✓ ข้อกลาง ไม่มีป้าย', items: [I('wheat'), I('cooking-pot'), I('cake')], mark: { at: 1, how: 'check' } },
    { say: 'ติดไฟข้อ 3 ป้ายยาว', items: [I('file-text', 'กรอกแบบฟอร์ม'), I('signature', 'เซ็นกำกับทุกหน้า'), I('inbox', 'ยื่นที่เคาน์เตอร์')], mark: { at: 2, how: 'light' } },
    { say: '4 ขั้น + ✕ ข้อ 2', items: [I('package-open', 'ใส่ของ'), I('package', 'ปิดกล่อง'), I('tag', 'ติดป้าย'), I('truck', 'ส่ง')], mark: { at: 1, how: 'x' } },
  ];

  G.cats = G.cats || {};
  G.cats.B04T = { variants: V, SAMPLES, STRESS, theme, draw: (i, d, c) => { setZ(c); CUR = V[i].id; tokens(); EMPTY = false; BLUE = false; V[i].build(d || {}, c); }, CLAMPS, timing: c => (setZ(c), Object.assign({}, Z)) };
})();
