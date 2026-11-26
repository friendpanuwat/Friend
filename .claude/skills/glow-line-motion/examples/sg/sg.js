/* sg.js — หมวด 13–22 · ขนาด 1–6 at the quality of the passed size 7 (s7g: "ผ่าน เอาอันนี้เป็นของจริง" → "กลับไปทำขนาดที่ 1–6 ให้ได้คุณภาพเท่านี้").
   Same language as s7g: flat-filled shapes (no shading), a floor line, big elements filling the box, nothing over an icon. Each concept lays itself out for the box's shape. Header = s7g.js. */
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
  const art = (c, fn) => { const f = p => { p.H = Z.H; fn(p); }; f.custom = true; f.dur = .35; f.exit = 'fade';
    const a = G.art(f, { x: c.x, y: c.y, s: c.s, at: c.at || 0, speed: 1 }); a.speed = Z.sp; if (TRK) TRK.push(a); return a; };
  let TRK = null;
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
    cp.id = 'b04sclip' + (++CID); Object.entries(rx ? { x, y, width: w, height: h, rx } : { x, y, width: w, height: h }).forEach(([k, v]) => r.setAttribute(k, v)); cp.appendChild(r);
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
  function ripple(q, x, y, r, t) { return;   /* no ripples */ const g = sub(q); on(g, q, 0, { ox: x, oy: y, s: [[0, .7], [t, .7], [t + tu(.45), 1.45, 'out']], o: [[0, 0], [t, 0], [t + tu(.04), .8], [t + tu(.45), 0]] }); g.circle(x, y, r, W(2.6)); }
  const popAt = (q, x, y, t) => { const g = sub(q); on(g, q, 0, { ox: x, oy: y, s: [[0, .8], [t, .8], [t + tu(.36), 1, 'io']], o: [[0, 0], [t, 0], [t + tu(.32), 1, 'io']] }); return g; };   /* soft, no overshoot */

  /* a THING (it) at (x, y) width w (+ its label at (lx, ly)). o.t = when it comes in · o.mv = keys of the part it rides ({ px, py, x, y, r, s }) ·
     o.punch = a bump at that time (the moment it is reached) · o.r = a fixed tilt (with its holder) · o.lt = when the label comes in */
  function pic(it, cx, cy, wd, c, o = {}) {
    if (!it) return null; const at = c.at || 0, X = c.x + cx * c.s, Y = c.y + cy * c.s, fn = picOf(it), t = o.t ?? tu(.12);
    let a;
    if (fn) a = G.art(fn, { x: X, y: Y, w: wd * c.s, at: at + t, speed: Z.sp, exit: 'fade', loop: false });   /* in, then still */
    if (fn && TRK) { a.__lb = [cx, cy, wd]; TRK.push(a); }   /* an icon's art box is bigger than what it draws — measure it by its nominal size */
    else { const str = it.label; if (!str) return null;
      const f = q => txt(q, str, 0, wd * .11, { size: wd * .3, maxW: o.bigW || wd * 1.25, weight: 700, color: C.ink, wrap: 'mid' }); f.custom = true; f.dur = .3; f.exit = 'fade';
      a = G.art(f, { x: X, y: Y, s: c.s, at: at + t, speed: 1 }); a.speed = Z.sp; if (TRK) TRK.push(a); }
    iclip(a, c);
    const K = { ox: X, oy: Y }; let any = false;
    if (o.mv) { const m = o.mv; if (m.px != null) { K.ox = c.x + m.px * c.s; K.oy = c.y + m.py * c.s; }
      ['x', 'y'].forEach(n => { if (m[n]) K[n] = m[n].map(([u, v, e]) => e ? [u, f1(v * c.s), e] : [u, f1(v * c.s)]); }); ['r', 's', 'sx', 'sy'].forEach(n => { if (m[n]) K[n] = m[n]; }); any = true; }
    else if (o.r) { K.r = [[0, o.r]]; any = true; }
    if (o.o) { K.o = o.o; any = true; }
    if (any) kf(a.wrap, at, K);
    if (o.punch != null && false) kf(a.g, at, { ox: X, oy: Y, s: [[0, 1], [o.punch, 1], [o.punch + tu(.07), 1.14, 'out'], [o.punch + tu(.3), 1, 'soft']] });
    return a;
  }
  /* an icon is its own art on the stage — the canvas clip (CL) does not reach it, so a thing falling in from far above showed its icon over the design
     above on the sheet. Every icon is clipped to its own canvas (stage coords; one clip per canvas) */
  const ICLIP = {};
  function iclip(a, c) { if (!a || !a.wrap || !a.wrap.parentNode) return; const svg = a.wrap.ownerSVGElement, k = [c.x, c.y, c.s, BOX[0], BOX[1]].join('_');   /* clip icons to the size's box (was the 1000 × 700 canvas → size 6 icons were cut) */
    if (!ICLIP[k] || !svg.contains(ICLIP[k].cp)) { const cp = document.createElementNS(NS, 'clipPath'), r = document.createElementNS(NS, 'rect'); cp.id = 'b04ticlip' + (++CID);
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
  const litOn = (q, t) => { const g = sub(q); on(g, q, 0, { o: [[0, 0], [f3(t - tu(.2)), 0], [f3(t + tu(.3)), 1, 'io']] }); return g; };
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
    on(g, p, 0, { ox: x, oy: y, s: [[0, .7], [t, .7], [f3(t + tu(.36)), 1, 'io']], o: [[0, 0], [t, 0], [f3(t + tu(.32)), 1, 'io']] });
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


  /* ================= S1N — size 1 (860 × 230) · categories 13–22 · one design each (user 2026-11-26: "ขนาดที่ 1 ในหมวด 13–22 เอาแค่ขนาดที่ 1 ก่อน
     10 หมวดนี้ หมวดละ 1 อัน" · standard "b01t–b09t" + B05S/B06S · template rules: graphic shapes and light, no real-world objects · new ideas, plain).
     Lessons kept: centred (D14) · icons, words only for the main point or when there is no icon (D15) · no frame in a frame (D20) · flat strip = long
     things, no square cards (D22) · no dashes, stripes, ripples, sparkles, bubbles (D4) · nothing see-through over something (D24) · one smooth io trip
     tA → H, nothing shorter than ~.3 s, cause before effect (A1 A9 A11). Inner room W × H = 832 × 202 (14 margin). ================= */
  const ioE2 = u => u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2, cl01 = v => Math.max(0, Math.min(1, v));
  const fadeS = (t, d = .32) => [[0, 0], [t, 0], [f3(t + tu(d)), 1, 'io']];
  const sIn = (q, x, y, t, d = .36) => { const g = sub(q); on(g, q, 0, { ox: x, oy: y, s: [[0, .9], [t, .9], [f3(t + tu(d)), 1, 'io']], o: fadeS(t, d) }); return g; };
  function TQ() { const H = Z.H, tA = f3(Math.max(tu(.55), H - tu(1.1))); return { H, tA, tI: f3(tu(.06)) }; }
  const tAt = (T, a) => f3(T.tA + (T.H - T.tA) * a);
  const KW = (T, a, b, fn, n = 20) => { const t0 = tAt(T, a), t1 = tAt(T, b), K = [[0, f3(fn(0))], [t0, f3(fn(0))]];
    for (let i = 1; i <= n; i++) { const u = i / n; K.push([f3(t0 + (t1 - t0) * u), f3(fn(ioE2(u)))]); } return K; };
  const inW = (T, a, b) => KW(T, a, b, u => u, 8);
  const outAfter = (tIn, T, a, b) => fadeS(tIn).concat(KW(T, a, b, u => 1 - u, 8).slice(1));
  const glassF = a => ({ fill: TL_(a), sw: 0, stroke: 'none' });
  const icOf = X => X && picOf(X) ? X.icon : null, lbOf = X => X && X.label && String(X.label).trim() ? String(X.label).trim() : null;
  const LONGW = 16, longW = s => s && s.replace(/[ัิ-ฺ็-๎\s]/g, '').length > LONGW;
  /* a thing at (x, y) size sz: its icon, or (no icon) its word big. o = { t, o, mv, size, maxW } */
  function thing(p, c, X, x, y, sz, o = {}) { if (!X) return null; const t = o.t ?? tu(.12);
    if (icOf(X)) { put(p, c, { icon: X.icon }, x, y, f1(sz), null, { t, o: o.o, mv: o.mv }); return 'icon'; }
    const s = lbOf(X); if (!s) return null; const fs = f1(o.size || Math.max(36, sz * .32));
    const g = mvG(p, Object.assign({ px: x, py: y }, o.mv || {}, { o: o.o || fadeS(t) }));
    txt(g, s, x, f1(y + fs * .36), { size: fs, maxW: f1(o.maxW || sz * 1.3), weight: 800, color: C.ink, wrap: 'mid' }); return 'word'; }
  const litR = (p, at, x, y, w, h, rr) => R(litOn(p, at), f1(x - w / 2), f1(y - h / 2), w, h, rr, { fill: TA(.07), sw: 5, stroke: ACC1 });
  const wordW = (p, s, size) => tw(p, s, size, 800);


  /* ================= S5N — size 5 (860 × 710) · categories 13–22 · the template ชุดฐาน look. Inner room W × H = 832 × 682. ================= */
  const pS5 = (T, a, b) => KW(T, a, b, u => .82 + .18 * u);
  /* an icon box (the template's building block): thick rounded edge, glass inside, the thing's icon (or its word) — g = its group (moves with mv) */
  function tbox(p, c, X, x, y, s, o = {}) { const t = o.t ?? tu(.12), K = Object.assign({ px: x, py: y }, o.mv || {}, { o: o.o || fadeS(t) }); if (!o.mv) K.s = [[0, .86], [t, .86], [f3(t + tu(.36)), 1, 'io']];
    const g = mvG(p, K), rr = f1(s * .24); R(g, f1(x - s / 2), f1(y - s / 2), s, s, rr, F(4.6)); R(g, f1(x - s / 2 + 7), f1(y - s / 2 + 7), f1(s - 14), f1(s - 14), f1(rr - 7), glassF(.07));
    if (X) thing(p, c, X, x, y, f1(s * .62), { t: f3(t + tu(.04)), o: o.io || K.o, mv: Object.assign({ px: x, py: y }, o.mv || { s: K.s }), size: o.size || f1(s * .2), maxW: f1(s * .84) });
    if (o.lit) R(litOn(g, o.lit), f1(x - s / 2), f1(y - s / 2), s, s, rr, { fill: TA(.12), sw: 5, stroke: ACC1 }); return g; }
  const discT = (p, x, y, r, t, mv) => { const g = mvG(p, Object.assign({ px: x, py: y, o: fadeS(t) }, mv || { s: [[0, .86], [t, .86], [f3(t + tu(.36)), 1, 'io']] })); g.circle(x, y, r, F(4.4)); g.circle(x, y, f1(r - 7), glassF(.07)); return g; };
  const wire = (p, dd, t0, t1, w = 3) => { const e = p.path(dd, { sw: w, stroke: C.soft }); on(e, p, 0, { draw: [[0, 0], [t0, 0], [t1, 1, 'io']] }); return e; };

  /* ================= S6N round 2 — size 6 (860 × 965) · BxT look. Inner room W × H = 832 × 937. ================= */
  const pS6 = (T, a, b) => KW(T, a, b, u => .82 + .18 * u);
  const cardT = (p, x, y, w, h, rr, t) => { const g = sIn(p, x, y, t); R(g, f1(x - w / 2), f1(y - h / 2), w, h, rr, F(4.6)); R(g, f1(x - w / 2 + 8), f1(y - h / 2 + 8), f1(w - 16), f1(h - 16), rr - 8, glassF(.035)); return g; };
  const dotT = (q, x, y, r, lit) => q.circle(x, y, r, lit ? { fill: C.ink, sw: 0, stroke: 'none' } : F(3));
  const ACTS = { follow: ['user-plus', 'user-check'], like: ['heart', 'heart'], save: ['bookmark', 'bookmark-check'], share: ['share-2', 'share-2'], comment: ['message-circle', 'message-circle'] };
  const cursor6 = (x, y, k) => pathOf([[0, 0], [0, 56], [14, 43], [24, 64], [34, 59], [24, 39], [42, 39]].map(([a, b]) => [f1(x + a * k), f1(y + b * k)]));

  /* ================= S7N — size 7 (400 × 500) · categories 13–22 · BxT look. Inner room W × H = 372 × 472. ================= */
  const pS7 = (T, a, b) => KW(T, a, b, u => .82 + .18 * u);
  const badge = (p, c, ic, x, y, r, t, o = {}) => { discT(p, x, y, r, t, o.mv); put(p, c, { icon: ic }, x, y, f1(r * 1.15), null, { t: f3(t + tu(.04)), o: o.o, mv: o.mv }); };

  /* ================= S7G — size 7 · graphic "glass stage" look. Inner room W × H = 372 × 472. ================= */
  const FY7 = 200;
  /* a vertical silver-glass gradient (ink colour, bright at the top) in the user space of the shape that uses it */
  function gradV(p, y1, y2, a1 = .2, a2 = .03) { const svg = p.g.ownerSVGElement, lg = document.createElementNS(NS, 'linearGradient'); lg.id = 's7gg' + (++CID);
    Object.entries({ gradientUnits: 'userSpaceOnUse', x1: 0, y1, x2: 0, y2 }).forEach(([k, v]) => lg.setAttribute(k, v));
    [[0, a1], [1, a2]].forEach(([o, a]) => { const s = document.createElementNS(NS, 'stop'); s.setAttribute('offset', o); s.setAttribute('stop-color', C.ink); s.setAttribute('stop-opacity', a); lg.appendChild(s); });
    (svg.querySelector('defs') || svg).appendChild(lg); return `url(#${lg.id})`; }
  /* solid first (nothing behind shows through), then the silver glass, then the edge */
  /* user: "ไม่เอาแรงเงา" — flat fill, no gradient / beam / reflection / halo */
  const glassR = (q, x, y, w, h, rr, sw = 4.4) => R(q, x, y, w, h, rr, { fill: C.fill, sw });
  const glassC = (q, x, y, r, sw = 4.4) => q.circle(x, y, r, { fill: C.fill, sw });
  const glassP = (q, d, y1, y2, sw = 4.4) => q.path(d, { fill: C.fill, sw });
  const floorG = (p, T, y = FY7, a = -176, b = 176) => { const e = p.line(a, y, b, y, { sw: 3.4 }); on(e, p, 0, { draw: [[0, 0], [T.tI, 0], [f3(T.tI + tu(.5)), 1, 'io']] }); };
  /* the reflection: what fn draws, mirrored in the floor, faint and only in a short band under it */
  const refl = () => {}, reflOld = (p, T, fn, y = FY7, band = 70) => { const cl = clipG(p, -186, y + 3, 372, band), g = cl.child({ transform: `matrix(1 0 0 -1 0 ${f1(2 * y)})` }); g.H = p.H; g.motion = p.motion; const r = mvG(g, { o: [[0, 0], [T.tI, 0], [f3(T.tI + tu(.4)), .16, 'io']] }); fn(r); };
  /* light from above: a soft beam narrowing to the top */
  const beamG = () => {}, beamOld = (p, T, x, w0, w1, y0, y1, a, b) => { const g = sub(p); on(g, p, 0, { o: inW(T, a, b) }); g.path(pathOf([[x - w0 / 2, y0], [x + w0 / 2, y0], [x + w1 / 2, y1], [x - w1 / 2, y1]]), { fill: gradV(g, y0, y1, .16, .02), sw: 0, stroke: 'none' }); };
  const halo7 = () => {}, haloOld = (p, T, x, y, r, a) => { const g = sub(p); on(g, p, 0, { o: inW(T, a, Math.min(1, a + .3)) }); g.circle(x, y, f1(r * 1.3), { fill: TA(.05), sw: 0, stroke: 'none' }); g.circle(x, y, r, { fill: TA(.09), sw: 0, stroke: 'none' }); };
  const gearG = (x, y, Rg, n, ph = 0) => { const r0 = Rg * .8, w = Math.PI / n * .5, P = []; for (let i = 0; i < n; i++) { const a = 2 * Math.PI * i / n + ph;
    [[a - w * 1.3, r0], [a - w * .72, Rg], [a + w * .72, Rg], [a + w * 1.3, r0]].forEach(([b, rr]) => P.push([f1(x + rr * Math.cos(b)), f1(y + rr * Math.sin(b))])); } return pathOf(P); };

  /* ================= SG — the ten s7g concepts for any box (W × H inner). shape: flat (> 2.5), wide (> 1.25), square, tall (< .85). ================= */
  const shpG = (W, H) => { const r = W / H; return r > 2.5 ? 'flat' : r > 1.25 ? 'wide' : r < .85 ? 'tall' : 'sq'; };
  const FLRG = H => f1(H / 2 - 6);
  const floorSG = (p, T, W, H) => floorG(p, T, FLRG(H), f1(-W / 2 + 4), f1(W / 2 - 4));
  const pSG = (T, a, b) => KW(T, a, b, u => .82 + .18 * u);
  const capHalfG = (sd, cw, top, bot) => { const ch = bot - top, rr = f1(Math.min(cw / 2, ch / 2)), x = f1(sd * cw / 2), xi = f1(sd * (cw / 2 - rr)), sw = sd < 0 ? 0 : 1;
    return `M 0 ${top} L ${xi} ${top} A ${rr} ${rr} 0 0 ${sw} ${x} ${f1(top + rr)} L ${x} ${f1(bot - rr)} A ${rr} ${rr} 0 0 ${sw} ${xi} ${bot} L 0 ${bot} Z`; };

  /* 13 เคล็ดลับ — แคปซูลแยกออก */
  function Q13(p, c, d, W, H) { const T = TQ(), s = shpG(W, H), fy = FLRG(H), top = f1(-H / 2 + 12), ch = fy - top, cy = f1((top + fy) / 2);
    const ic = f1(Math.min(ch * (s === 'flat' ? .64 : .5), W * .42, Math.min(W, H) * .5)), mv = f1(ic * .56 + 6), cw = f1(Math.min(W * .98 - 2 * mv, s === 'flat' ? 1e9 : ch * (s === 'tall' ? .5 : 1.4)));
    floorSG(p, T, W, H); const XK = sd => KW(T, .05, .5, u => f1(sd * mv * u)), il = f1(Math.min(30, cw / 6));
    [-1, 1].forEach(sd => { const g = mvG(p, { px: 0, py: cy, x: XK(sd), o: fadeS(T.tI) }); glassP(g, capHalfG(sd, cw, top, fy)); g.line(f1(sd * il), f1(top + Math.min(40, ch * .2)), f1(sd * il), f1(fy - Math.min(40, ch * .2)), S(1.6)); });
    thing(p, c, d.secret, 0, cy, ic, { t: tAt(T, .35), o: inW(T, .35, .75), mv: { s: pSG(T, .35, .85) }, size: f1(Math.max(36, ic * .28)), maxW: f1(mv * 1.9) });
    litOn(p, T.H).circle(0, cy, f1(Math.min(mv - 4, ic * .56)), { fill: 'none', sw: 4, stroke: ACC1 }); }

  /* 14 ประโยคเด็ด — แท่นสองชั้น */
  function Q14(p, c, d, W, H) { const T = TQ(), s = shpG(W, H), fy = FLRG(H), w1 = f1(Math.min(W * .96, s === 'flat' ? 560 : 620)), w2 = f1(w1 * .7), h1 = f1(Math.max(24, Math.min(H * .09, 52))), h2 = f1(h1 * .82);
    const room = fy - h1 - h2 - (-H / 2 + 8) - 14, ic = f1(Math.min(room * .95, W * .62, Math.min(W, H) * .75)), iy = f1(fy - h1 - h2 - 14 - ic / 2);
    floorSG(p, T, W, H); const g = sIn(p, 0, fy, T.tI); glassR(g, -w1 / 2, f1(fy - h1), w1, h1, 12); glassR(g, -w2 / 2, f1(fy - h1 - h2), w2, h2, 12); g.line(f1(-w1 / 2 + 24), f1(fy - h1 / 2), f1(w1 / 2 - 24), f1(fy - h1 / 2), S(1.6));
    R(litOn(p, T.H), -w1 / 2, f1(fy - h1), w1, h1, 12, { fill: 'none', sw: 4.4, stroke: ACC1 });
    thing(p, c, d.idea, 0, iy, ic, { t: tAt(T, .1), o: inW(T, .1, .45), mv: { s: pSG(T, .1, .5), y: KW(T, .1, .55, u => f1(26 * (1 - u))) }, size: f1(Math.max(40, ic * .3)), maxW: f1(W * .9) }); }

  /* 15 ชวนทำ — ปุ่มวงแหวน (wide / flat: the button with two pairs of bars each side that light outward) */
  function Q15(p, c, d, W, H) { const T = TQ(), s = shpG(W, H), A = ACTS[d.action] || ACTS.follow, hz = s === 'flat' || s === 'wide', tP = tAt(T, .2), tR = tAt(T, .32);
    const fy = FLRG(H), cy = hz ? f1((-H / 2 + fy) / 2) : f1(-14), rb = f1(hz ? Math.min((fy + H / 2) * .36, W * .16) : Math.min(W, H) * .33);
    floorSG(p, T, W, H);
    if (hz) { const bh = f1(rb * .5), x0 = f1(rb + 26), bw = f1(Math.min((W / 2 - x0 - 30) / 2, rb * 1.3));
      [-1, 1].forEach(sd => [0, 1].forEach(i => { const x = f1(sd * (x0 + i * (bw + 16)) - (sd < 0 ? bw : 0)), g = sIn(p, f1(x + bw / 2), cy, f3(T.tI + tu(.05 * i))); glassR(g, x, f1(cy - bh / 2), bw, bh, f1(bh / 2), 3.6); R(litOn(p, tAt(T, .4 + .25 * i)), x, f1(cy - bh / 2), bw, bh, f1(bh / 2), { fill: TA(.35), sw: 3.6, stroke: ACC1 }); })); }
    else { const Ro = f1(Math.min(W, H) * .49), Ri = f1(Ro * .82); [0, 1, 2, 3].forEach(i => { const a0 = -90 + i * 90 + 6, a1 = a0 + 78, P = (a, r) => f1(r * Math.cos(a * Math.PI / 180)) + ' ' + f1(cy + r * Math.sin(a * Math.PI / 180)), dd = `M ${P(a0, Ro)} A ${Ro} ${Ro} 0 0 1 ${P(a1, Ro)} L ${P(a1, Ri)} A ${Ri} ${Ri} 0 0 0 ${P(a0, Ri)} Z`;
      const g = sIn(p, 0, cy, f3(T.tI + tu(.05 * i))); glassP(g, dd, cy - Ro, cy + Ro, 3.6); litOn(p, tAt(T, .35 + .13 * i)).path(dd, { fill: TA(.35), sw: 3.6, stroke: ACC1 }); }); }
    const press = [[0, 1], [tP, 1], [tR, .93, 'io'], [tAt(T, .5), 1, 'io']], g = mvG(p, { px: 0, py: cy, s: press }), gi = sIn(g, 0, cy, f3(T.tI + tu(.1))); glassC(gi, 0, cy, rb, 5); gi.circle(0, cy, f1(rb - 14), S(1.6));
    litOn(g, T.H).circle(0, cy, rb, { fill: TA(.08), sw: 5, stroke: ACC1 });
    const mv = { px: 0, py: cy, s: press }, isz = f1(rb * 1.2); put(p, c, { icon: A[0] }, 0, cy, isz, null, { t: tu(.2), mv, o: A[0] === A[1] ? undefined : outAfter(tu(.2), T, .35, .55) }); if (A[0] !== A[1]) put(p, c, { icon: A[1] }, 0, cy, isz, null, { t: tAt(T, .35), mv, o: inW(T, .35, .58) });
    const k = f1(Math.max(.8, Math.min(1.5, rb / 90))), tx = f1(rb * .58), ty = f1(cy + rb * .5), sx0 = f1(Math.min(W / 2 - 46 * k, tx + 120)), sy0 = f1(Math.min(fy - 64 * k - 8, ty + 80));
    over(c, q => { const cg = mvG(q, { px: tx, py: ty, x: [[0, f1(sx0 - tx)], [tAt(T, 0), f1(sx0 - tx)], [tP, 0, 'io']], y: [[0, f1(sy0 - ty)], [tAt(T, 0), f1(sy0 - ty)], [tP, 0, 'io']], s: [[0, 1], [tP, 1], [tR, .88, 'io'], [tAt(T, .5), 1, 'io']], o: fadeS(T.tA) }); cg.path(cursor6(tx, ty, k), F(4)); }); }

  /* 16 นิยาม — สองแผ่นเท่ากัน (wide / flat: side by side) */
  function Q16(p, c, d, W, H) { const T = TQ(), s = shpG(W, H), X = d.term || {}, M = (Array.isArray(d.means) ? d.means.filter(has) : []).slice(0, 3), n = Math.max(1, M.length), hz = s === 'flat' || s === 'wide';
    const eqW = hz ? f1(Math.min(90, W * .1)) : 92, gap = 26;
    const pw = hz ? f1((W * .98 - eqW - 2 * gap) / 2) : f1(Math.min(W * .98, 560)), ph = hz ? f1(H * .96) : f1((H * .98 - eqW - 2 * gap) / 2), A1 = hz ? [f1(-pw / 2 - eqW / 2 - gap), 0] : [0, f1(-ph / 2 - eqW / 2 - gap)], A2 = hz ? [f1(pw / 2 + eqW / 2 + gap), 0] : [0, f1(ph / 2 + eqW / 2 + gap)];
    const plate = ([x, y], t) => { const g = sIn(p, x, y, t), rr = f1(Math.min(pw, ph) * .14); glassR(g, f1(x - pw / 2), f1(y - ph / 2), pw, ph, rr); R(g, f1(x - pw / 2 + 12), f1(y - ph / 2 + 12), pw - 24, ph - 24, f1(rr - 8), S(1.6)); };
    plate(A1, T.tI); thing(p, c, X, A1[0], A1[1], f1(Math.min(pw, ph) * .66), { t: tu(.2), size: f1(Math.min(64, ph * .3)), maxW: f1(pw * .86) });
    const eg = mvG(p, { px: 0, py: 0, sx: KW(T, 0, .25, u => Math.max(.001, u)), o: [[0, 0], [tAt(T, 0), 0], [f3(tAt(T, 0) + tu(.06)), 1]] }), bw = f1(eqW * .5), bh = f1(Math.max(10, eqW * .17)), by = f1(eqW * .16);
    [-by, by].forEach(y => R(eg, -bw, f1(y - bh / 2), 2 * bw, bh, f1(bh / 2), F(3.6))); const el = litOn(p, T.H); [-by, by].forEach(y => R(el, -bw, f1(y - bh / 2), 2 * bw, bh, f1(bh / 2), { fill: TA(.6), sw: 3.6, stroke: ACC1 }));
    plate(A2, tAt(T, .2)); const ms = f1(Math.min(ph * .62, (pw * .9 - (n - 1) * 20) / n)), gp = f1(Math.min(36, (pw * .9 - n * ms) / Math.max(1, n - 1)));
    M.forEach((m, i) => { const x = f1(A2[0] + (i - (n - 1) / 2) * (ms + gp)), a = .3 + .5 * i / n; thing(p, c, m, x, A2[1], ms, { t: tAt(T, a), o: inW(T, a, a + .2), mv: { s: pSG(T, a, a + .25) }, size: f1(Math.max(22, ms * .26)), maxW: f1(ms * 1.1) }); }); }

  /* 17 รายการ — แผ่นวงกับการ์ด (no card ever over another — icons sit above every card) */
  function Q17(p, c, d, W, H) { const T = TQ(), s = shpG(W, H), I = (Array.isArray(d.items) ? d.items.filter(has) : []).slice(0, 4), n = Math.max(2, I.length), fy = FLRG(H);
    const ery = f1(Math.max(18, Math.min(H * .09, 52))), ey = f1(fy - ery - 8), erx = f1(W * .48);
    floorSG(p, T, W, H); const pd = sIn(p, 0, ey, T.tI), E = k => `M ${f1(-erx * k)} ${ey} A ${f1(erx * k)} ${f1(ery * k)} 0 1 0 ${f1(erx * k)} ${ey} A ${f1(erx * k)} ${f1(ery * k)} 0 1 0 ${f1(-erx * k)} ${ey} Z`; pd.path(E(1), { fill: C.fill, sw: 3.6 }); pd.path(E(.7), S(1.6));
    const top = f1(-H / 2 + 8), bot = f1(ey - 6), avH = bot - top; let L = [];
    if (s === 'flat' || s === 'wide') { const gp = 22, sz = f1(Math.min(avH * .96, (W * .92 - (n - 1) * gp) / n)); L = I.map((_, i) => [f1((i - (n - 1) / 2) * (sz + gp)), f1(bot - sz / 2), sz, true]); }
    else if (n === 2) { const gp = 26, row = Math.min(avH * .96, (W * .92 - gp) / 2), col = Math.min((avH - gp) / 2, W * .9), sz = f1(Math.max(row, col));
      L = row >= col ? I.map((_, i) => [f1((i - .5) * (sz + gp)), f1(bot - sz / 2), sz, true]) : I.map((_, i) => [0, f1(bot - sz / 2 - (1 - i) * (sz + gp)), sz, true]); }
    else if (n === 4) { const gp = 26, sz = f1(Math.min((avH - gp) / 2, (W * .9 - gp) / 2)); L = I.map((_, i) => [f1((i % 2 - .5) * (sz + gp)), f1(bot - sz / 2 - (1 - Math.floor(i / 2)) * (sz + gp)), sz, true]); }
    else if (n === 3) { const gp = 26, big = f1(Math.min(avH * .52, W * .6)), sm = f1(Math.min(avH - big - gp, (W * .9 - gp) / 2)); L = [[f1(-(sm + gp) / 2), f1(bot - big - gp - sm / 2), sm, false], [f1((sm + gp) / 2), f1(bot - big - gp - sm / 2), sm, false], [0, f1(bot - big / 2), big, true]]; }
    else if (s === 'tall') { const gp = 26, sz = f1(Math.min((avH - gp) / 2, W * .8)); L = I.map((_, i) => [0, f1(bot - sz / 2 - (1 - i) * (sz + gp)), sz, true]); }
    else { const gp = 26, sz = f1(Math.min(avH * .9, (W * .92 - gp) / 2)); L = I.map((_, i) => [f1((i - .5) * (sz + gp)), f1(bot - sz / 2), sz, true]); }
    I.forEach((X, i) => { const [x, y, sz, lit] = L[i], a = .85 * i / n, g = mvG(p, { px: x, py: y, s: KW(T, a, a + .3, u => .8 + .2 * u), o: inW(T, a, a + .25) }), rr = f1(sz * .24);
      glassR(g, f1(x - sz / 2), f1(y - sz / 2), sz, sz, rr, 4.2); R(g, f1(x - sz / 2 + 10), f1(y - sz / 2 + 10), f1(sz - 20), f1(sz - 20), f1(rr - 10), S(1.4)); if (lit) R(litOn(p, T.H), f1(x - sz / 2), f1(y - sz / 2), sz, sz, rr, { fill: 'none', sw: 4.2, stroke: ACC1 });
      thing(p, c, X, x, y, f1(sz * .6), { t: tAt(T, a), o: inW(T, a, a + .25), mv: { s: KW(T, a, a + .3, u => .8 + .2 * u) }, size: f1(Math.max(22, sz * .2)), maxW: f1(sz * .86) }); }); }

  /* 18 เหตุการณ์ — เส้นเวลาชี้จุดนั้น */
  function Q18(p, c, d, W, H) { const T = TQ(), s = shpG(W, H), when = d.when && String(d.when).trim(), bx = f1(-W / 2 + 26), y0 = f1(-H / 2 + 14), y1 = f1(H / 2 - 14), my = 0;
    const tw = when ? (s === 'flat' ? Math.min(220, W * .26) : 0) : 0, dr = f1(Math.min((H - (when && s !== 'flat' ? 70 : 20)) / 2, (W - 80 - tw) / 2 * .92, Math.min(W, H) * .44)), dx = f1(bx + 40 + dr + (W / 2 - tw - (bx + 40) - 2 * dr) / 2), dy = when && s !== 'flat' ? 28 : 0;
    if (when) { if (s === 'flat') txt(atG(p, tu(.12)), when, f1(W / 2 - tw / 2), 12, { size: 34, weight: 800, color: C.kicker, maxW: tw }); else txt(atG(p, tu(.12)), when, dx, f1(-H / 2 + 34), { size: 32, weight: 800, color: C.kicker, maxW: W * .6 }); }
    const ny = [f1(y0 + (y1 - y0) * .16), dy, f1(y1 - (y1 - y0) * .16)];
    const bm = p.line(bx, y0, bx, y1, { sw: 4 }); on(bm, p, 0, { draw: [[0, 0], [T.tI, 0], [f3(T.tI + tu(.5)), 1, 'io']] });
    ny.forEach((y, i) => { const g = sub(p); on(g, p, 0, { o: fadeS(f3(T.tI + tu(.1 * i))) }); g.circle(bx, y, i === 1 ? 16 : 10, i === 1 ? F(4) : F(3)); });
    const ln = p.line(f1(bx + 16), dy, f1(dx - dr), dy, { sw: 3.4 }); on(ln, p, 0, { draw: [[0, 0], [tAt(T, 0), 0], [tAt(T, .3), 1, 'io']] }); litOn(p, T.H).circle(bx, dy, 16, { fill: ACC1, sw: 4, stroke: ACC1 });
    const g = mvG(p, { px: dx, py: dy, s: pSG(T, .25, .6), o: inW(T, .25, .5) }); glassC(g, dx, dy, dr, 5); g.circle(dx, dy, f1(dr - 16), S(1.6)); litOn(g, T.H).circle(dx, dy, dr, { fill: 'none', sw: 5, stroke: ACC1 });
    thing(p, c, d.what, dx, dy, f1(dr * 1.2), { t: tAt(T, .3), o: inW(T, .3, .6), mv: { s: pSG(T, .3, .65) }, size: f1(Math.max(32, dr * .34)), maxW: f1(dr * 1.6) }); }

  /* 19 ความรู้สึก — วงวัดอารมณ์ */
  function Q19(p, c, d, W, H) { const T = TQ(), good = d.mood !== 'bad', tall = shpG(W, H) === 'tall', fy = FLRG(H), Ro = f1(tall ? W * .48 : Math.min((W - 130) / 2, (fy - 8 - (-H / 2 + 10)) / 1.64)), Ri = f1(Ro * .8), dr = f1(Math.min(Ri * .8, Ri - 16)), cy = f1(tall ? Ro * .5 : fy - 8 - dr);   /* the disc sits on the floor, the arc round it · tall: the whole gauge up in the middle, the faces under the arc's ends */
    floorSG(p, T, W, H); const seg = i => { const a0 = 180 + i * 36 + 3, a1 = a0 + 30, P = (a, r) => f1(r * Math.cos(a * Math.PI / 180)) + ' ' + f1(cy + r * Math.sin(a * Math.PI / 180)); return `M ${P(a0, Ro)} A ${Ro} ${Ro} 0 0 1 ${P(a1, Ro)} L ${P(a1, Ri)} A ${Ri} ${Ri} 0 0 0 ${P(a0, Ri)} Z`; };
    const lit = good ? [2, 3, 4] : [2, 1, 0];
    [0, 1, 2, 3, 4].forEach(i => { const g = sIn(p, 0, cy, f3(T.tI + tu(.04 * i))); glassP(g, seg(i), cy - Ro, cy, 3.4); const k = lit.indexOf(i); if (k >= 0) litOn(p, tAt(T, .2 + .25 * k)).path(seg(i), { fill: TA(.4), sw: 3.4, stroke: ACC1 }); });
    const es = f1(Math.min(54, Ro * .3)); [[-1, 'frown'], [1, 'smile']].forEach(([sd, ic]) => put(p, c, { icon: ic }, f1(tall ? sd * (Ro + Ri) / 2 : sd * (Ro + es * .7 + 8)), f1(tall ? cy + es * .9 : cy - es * .5), es, null, { t: tu(.2), o: [[0, 0], [tu(.2), 0], [tu(.5), .6, 'io']] }));
    const cyD = cy; const g = sIn(p, 0, cyD, f3(T.tI + tu(.1))); glassC(g, 0, cyD, dr, 5); g.circle(0, cyD, f1(dr - 14), S(1.6)); litOn(p, T.H).circle(0, cyD, dr, { fill: TA(.08), sw: 5, stroke: ACC1 });
    thing(p, c, d.feel, 0, cyD, f1(dr * 1.3), { t: tAt(T, 0), o: inW(T, 0, .3), size: f1(Math.max(28, dr * .34)), maxW: f1(dr * 1.6) }); }

  /* 20 ความสัมพันธ์ — สะพานแสง */
  function Q20(p, c, d, W, H) { const T = TQ(), cut = d.cut === true, fy = FLRG(H), r = f1(Math.min(H * .2, W * .22, Math.min(W, H) * .23)), ax = f1(-W / 2 + r + 10), bx = f1(W / 2 - r - 10), dy = f1(fy - r - 6), ay = f1(dy - r), nr = f1(Math.max(30, Math.min(r * .55, 64))), rx = f1((bx - ax) / 2), ry = f1(Math.min(ay - (-H / 2 + nr + 12), rx * 1.5)), apy = f1(ay - ry);   /* no hairpin arch in tall boxes */
    floorSG(p, T, W, H); [[ax, d.a], [bx, d.b]].forEach(([x, X], i) => { const g = sIn(p, x, dy, f3(T.tI + tu(.08 * i))); glassC(g, x, dy, r, 4.6); g.circle(x, dy, f1(r - 12), S(1.6)); thing(p, c, X, x, dy, f1(r * 1.25), { t: tu(.18 + .08 * i), size: f1(Math.max(26, r * .34)), maxW: r * 1.6 }); });
    const tw = f1(Math.max(10, Math.min(18, r * .18)));
    [[ax, 1], [bx, 0]].forEach(([x, sw_]) => { const dd = `M ${x} ${ay} A ${rx} ${ry} 0 0 ${sw_} 0 ${apy}`, end = cut ? .8 : 1; [[tw, C.ink], [f1(tw * .5), C.fill]].forEach(([w, col]) => { const e = p.path(dd, { sw: w, stroke: col }); on(e, p, 0, { draw: [[0, 0], [tAt(T, 0), 0], [tAt(T, .45), end, 'io']] }); }); if (!cut) litOn(p, T.H).path(dd, { sw: f1(tw * .5), stroke: TA(.7) }); });
    if (cut) { const mg = popAt(p, 0, apy, tAt(T, .6)); mg.circle(0, apy, f1(nr * .7), F(4)); XX(mg, 0, apy, f1(nr / 40)); }
    else { const g = mvG(p, { px: 0, py: apy, s: pSG(T, .42, .7), o: inW(T, .42, .62) }); glassC(g, 0, apy, nr, 4.4); litOn(g, T.H).circle(0, apy, nr, { fill: TA(.15), sw: 4.4, stroke: ACC1 }); put(p, c, { icon: 'link' }, 0, apy, f1(nr * 1.16), null, { t: tAt(T, .42), o: inW(T, .42, .62), mv: { s: pSG(T, .42, .7) } }); } }

  /* 21 สถานที่ — หมุดเหนือแผ่นวง */
  function Q21(p, c, d, W, H) { const T = TQ(), s = shpG(W, H), P = d.place || {}, SPT = (Array.isArray(d.spots) ? d.spots.filter(has) : []).slice(0, 2), fy = FLRG(H), ery = f1(Math.max(18, Math.min(H * .1, 56))), ey = f1(fy - ery - 6), erx = f1(W * .48);
    const nm = !icOf(P) && lbOf(P), topY = f1(-H / 2 + (nm ? 58 : 10)), r = f1(Math.min((ey - topY - 10) / 2.9, W * .26, Math.min(W, H) * .26)), hy = f1(ey - 10 - r * 1.9);
    const E = k => `M ${f1(-erx * k)} ${ey} A ${f1(erx * k)} ${f1(ery * k)} 0 1 0 ${f1(erx * k)} ${ey} A ${f1(erx * k)} ${f1(ery * k)} 0 1 0 ${f1(-erx * k)} ${ey} Z`;
    const pg0 = sIn(p, 0, ey, T.tI); pg0.path(E(1), { fill: C.fill, sw: 3.6 }); pg0.path(E(.66), S(1.6)); pg0.path(E(.36), S(1.6));
    const sh = sub(p); on(sh, p, 0, { ox: 0, oy: ey, sx: KW(T, .1, .45, v => Math.max(.001, v)), o: inW(T, .1, .4) }); ell(sh, 0, ey, f1(r * .5), f1(Math.min(ery * .26, r * .14)), { fill: TA(.3), sw: 0, stroke: 'none' });
    const pk = { px: 0, py: hy, y: KW(T, 0, .45, u => f1(-Math.min(40, r * .5) * (1 - u))), o: inW(T, 0, .25) }, mg = mvG(p, pk); glassP(mg, pinD(0, hy, r), f1(hy - r), f1(hy + r * 1.9), 4.8); mg.circle(0, hy, f1(r * .72), S(1.6)); litOn(mg, T.H).path(pinD(0, hy, r), { fill: TA(.06), sw: 4.8, stroke: ACC1 });
    if (icOf(P)) put(p, c, { icon: P.icon }, 0, hy, f1(r * 1.1), null, { t: tAt(T, 0), o: pk.o, mv: { px: 0, py: hy, y: pk.y } }); else { mg.circle(0, hy, f1(Math.max(8, r * .16)), { fill: ACC1, sw: 0, stroke: 'none' }); if (nm) pill(p, nm, 0, f1(-H / 2 + 30), { t: tAt(T, .4), size: f1(Math.max(30, Math.min(46, H * .05))), maxW: W * .6 }); }
    const sr = f1(Math.max(22, Math.min(r * .44, 46))), sxx = f1(Math.min(erx * .74, Math.max(r * .9 + sr + 20, W * .3)));
    SPT.forEach((X, i) => { const x = i ? sxx : -sxx, shy = f1(ey - ery * .3 - sr * 1.9), a = .5 + .15 * i, g = mvG(p, { px: x, py: shy, o: inW(T, a, a + .2) }); glassP(g, pinD(x, shy, sr), shy - sr, shy + sr * 1.9, 3.6); thing(p, c, X, x, shy, f1(sr * 1.15), { t: tAt(T, a), o: inW(T, a, a + .2), size: 16, maxW: f1(sr * 1.4) }); }); }

  /* 22 กลไก — ชุดเฟือง (wide / flat: a gear train left → right ending in the result) */
  function Q22(p, c, d, W, H) { const T = TQ(), s = shpG(W, H), Cs = (Array.isArray(d.components) ? d.components.filter(has) : []).slice(0, 3), Rs = d.result && has(d.result) ? d.result : null, n = Math.max(2, Cs.length), fy = FLRG(H);
    floorSG(p, T, W, H); const room = fy - (-H / 2 + 8) - 10, cyC = f1(-H / 2 + 8 + room / 2);
    if (s === 'flat' || s === 'wide') { const rr0 = Rs ? 1 : 0, k = .82; let R1 = f1(Math.min(room / 2, 200)), R2 = f1(R1 * .62), rres = f1(R2 * .9);
      const need = () => 2 * R1 + n * (R2 * 2 * k + (R1 - R2) * 0) + (n - 1) * 0 + (Rs ? 2 * rres + 30 : 0);
      const span = () => R1 + R1 + R2 * k + R2 + (n - 1) * (2 * R2 * k) + (Rs ? 30 + 2 * rres : 0); const sc = Math.min(1, W * .96 / span()); R1 = f1(R1 * sc); R2 = f1(R2 * sc); rres = f1(rres * sc);
      const x0 = f1(-span() / 2 + R1), cy = f1(fy - 8 - R1 - (room - 2 * R1) * .3); let px = x0, pr = R1;
      const g1 = mvG(p, { px: x0, py: cy, r: KW(T, 0, .85, v => f1(120 * v)), o: fadeS(T.tI) }); glassP(g1, gearG(x0, cy, R1, 14), cy - R1, cy + R1, 4.2); g1.circle(x0, cy, f1(R1 * .62), S(1.6)); thing(p, c, d.subject, x0, cy, f1(R1 * .9), { t: tu(.18), size: f1(Math.max(20, R1 * .22)), maxW: f1(R1 * 1.1) });
      Cs.forEach((X, i) => { const x = f1(px + pr + R2 * k), y = cy, sg = i % 2 ? 1 : -1, g2 = mvG(p, { px: x, py: y, r: KW(T, 0, .85, v => f1(sg * 120 * R1 / R2 * v)), o: fadeS(f3(T.tI + tu(.06 * (i + 1)))) });
        glassP(g2, gearG(x, y, R2, 9, i % 2 ? 0 : Math.PI / 9), y - R2, y + R2, 3.8); thing(p, c, X, x, y, f1(R2 * .92), { t: tu(.2 + .06 * i), size: f1(Math.max(16, R2 * .3)), maxW: f1(R2 * 1.1) }); litOn(p, tAt(T, .3 + .2 * i)).circle(x, y, f1(R2 * .62), { fill: TA(.12), sw: 0, stroke: 'none' }); px = x; pr = R2 * k; });
      if (Rs) { const rx = f1(px + R2 + 30 + rres), g = mvG(p, { px: rx, py: cy, s: pSG(T, .75, 1), o: inW(T, .75, .9) }); glassC(g, rx, cy, rres, 4); litOn(g, T.H).circle(rx, cy, rres, { fill: 'none', sw: 4, stroke: ACC1 }); thing(p, c, Rs, rx, cy, f1(rres * 1.2), { t: tAt(T, .75), o: inW(T, .75, .95), mv: { s: pSG(T, .75, 1) }, size: 18, maxW: f1(rres * 1.5) }); } return; }
    const R1 = f1(Math.min(room * .3, W * .28, Math.min(W, H) * .29)), R2 = f1(R1 * .5), gx = f1(-R2 * .6), gy = f1(cyC - R2 * .3), AN = n === 3 ? [-42, 28, 98] : [-24, 66];
    const g1 = mvG(p, { px: gx, py: gy, r: KW(T, 0, .85, v => f1(120 * v)), o: fadeS(T.tI) }); glassP(g1, gearG(gx, gy, R1, 14), gy - R1, gy + R1, 4.2); g1.circle(gx, gy, f1(R1 * .62), S(1.6)); thing(p, c, d.subject, gx, gy, f1(R1 * .9), { t: tu(.18), size: f1(Math.max(20, R1 * .22)), maxW: f1(R1 * 1.1) });
    AN.forEach((a, i) => { const dd = R1 + R2 * .82, x2 = f1(gx + dd * Math.cos(a * Math.PI / 180)), y2 = f1(gy + dd * Math.sin(a * Math.PI / 180)), g2 = mvG(p, { px: x2, py: y2, r: KW(T, 0, .85, v => f1(-120 * R1 / R2 * v)), o: fadeS(f3(T.tI + tu(.06 * (i + 1)))) });
      glassP(g2, gearG(x2, y2, R2, 9, Math.PI / 9), y2 - R2, y2 + R2, 3.8); thing(p, c, Cs[i], x2, y2, f1(R2 * .92), { t: tu(.2 + .06 * i), size: f1(Math.max(16, R2 * .3)), maxW: f1(R2 * 1.1) }); litOn(p, tAt(T, .3 + .2 * i)).circle(x2, y2, f1(R2 * .62), { fill: TA(.12), sw: 0, stroke: 'none' }); });
    if (Rs) { const rres = f1(R2 * .8), rx = f1(W / 2 - rres - 10), ry = f1(fy - rres - 12), g = mvG(p, { px: rx, py: ry, s: pSG(T, .75, 1), o: inW(T, .75, .9) }); glassC(g, rx, ry, rres, 4); litOn(g, T.H).circle(rx, ry, rres, { fill: 'none', sw: 4, stroke: ACC1 }); thing(p, c, Rs, rx, ry, f1(rres * 1.2), { t: tAt(T, .75), o: inW(T, .75, .95), mv: { s: pSG(T, .75, 1) }, size: 18, maxW: f1(rres * 1.5) }); } }

  /* ===== redesigns for the boxes where the shared layout left room (user: "อันที่ยังใช้พื้นที่ไม่คุ้มก็ดีไซน์ใหม่ … แตกต่างกันโดยสิ้นเชิงก็ได้") ===== */
  /* 13 tall — แผ่นปิดเลื่อนขึ้น: a tall glass panel, a cover (with its lock) slides up out of it and the secret is there, big */
  function R13T(p, c, d, W, H) { const T = TQ(), fy = FLRG(H), pw = f1(W * .94), top = f1(-H / 2 + 8), ph = f1(fy - top), cy = f1((top + fy) / 2), rr = f1(pw * .14), ic = f1(pw * .72);
    floorSG(p, T, W, H); const g = sIn(p, 0, cy, T.tI); glassR(g, -pw / 2, top, pw, ph, rr); R(litOn(p, T.H), -pw / 2, top, pw, ph, rr, { fill: 'none', sw: 4.4, stroke: ACC1 });
    thing(p, c, d.secret, 0, cy, ic, { t: tAt(T, .45), o: inW(T, .45, .8), mv: { s: pSG(T, .45, .85) }, size: f1(ic * .26), maxW: f1(pw * .86) });
    const iw = f1(pw - 24), ih = f1(ph - 24), YK = KW(T, 0, .6, u => f1(-ih * u)), cl = clipG(p, f1(-iw / 2), f1(top + 12), iw, ih, f1(rr - 10)), cv = mvG(cl, { px: 0, py: cy, y: YK, o: fadeS(T.tI) });
    R(cv, f1(-iw / 2), f1(top + 12), iw, ih, 0, { fill: C.fill, sw: 0, stroke: 'none' }); cv.line(f1(-iw / 2), f1(top + 12 + ih - 2), f1(iw / 2), f1(top + 12 + ih - 2), { sw: 5 }); R(cv, -40, f1(top + 12 + ih - 34), 80, 14, 7, F(3));
    put(p, c, { icon: 'lock' }, 0, cy, f1(pw * .36), null, { t: tu(.16), mv: { px: 0, py: cy, y: YK }, o: fadeS(tu(.16)).concat(KW(T, .2, .45, u => 1 - u, 8).slice(1)) }); }
  /* 14 tall — เสาแท่นสูง: a tall plinth on the floor, the idea big on top of it */
  function R14T(p, c, d, W, H) { const T = TQ(), fy = FLRG(H), bw = f1(W * .52), bh = f1(H * .34), cw = f1(W * .74), ch = 28, ic = f1(Math.min(W * .9, fy - bh - ch - (-H / 2 + 10) - 14)), iy = f1(fy - bh - ch - 10 - ic / 2);
    floorSG(p, T, W, H); const g = sIn(p, 0, f1(fy - bh / 2), T.tI); glassR(g, -bw / 2, f1(fy - bh), bw, bh, 10); g.line(f1(-bw / 2 + 22), f1(fy - bh + 22), f1(-bw / 2 + 22), f1(fy - 22), S(1.6)); g.line(f1(bw / 2 - 22), f1(fy - bh + 22), f1(bw / 2 - 22), f1(fy - 22), S(1.6));
    glassR(g, -cw / 2, f1(fy - bh - ch), cw, ch, 10); R(litOn(p, T.H), -cw / 2, f1(fy - bh - ch), cw, ch, 10, { fill: 'none', sw: 4.4, stroke: ACC1 });
    thing(p, c, d.idea, 0, iy, ic, { t: tAt(T, .1), o: inW(T, .1, .45), mv: { s: pSG(T, .1, .5), y: KW(T, .1, .55, u => f1(26 * (1 - u))) }, size: f1(ic * .26), maxW: f1(W * .94) }); }
  /* 14 flat — แผ่นใจความยาว: one long glass plate, a quote disc at each end, the idea big in the middle, an accent line fills under it */
  function R14F(p, c, d, W, H) { const T = TQ(), pw = f1(W * .98), ph = f1(H * .94), rr = f1(ph / 2), qr = f1(ph * .32), qx = f1(pw / 2 - rr), ic = f1(ph * .66), ly = f1(ph * .36), lw = f1(pw * .42);
    const g = sIn(p, 0, 0, T.tI); glassR(g, -pw / 2, -ph / 2, pw, ph, rr); R(litOn(p, T.H), -pw / 2, -ph / 2, pw, ph, rr, { fill: 'none', sw: 4.4, stroke: ACC1 });
    [-1, 1].forEach(sd => { const x = f1(sd * qx); g.circle(x, 0, qr, F(3.6)); put(p, c, { icon: 'quote' }, x, 0, f1(qr * 1.1), null, { t: tu(.18) }); });
    thing(p, c, d.idea, 0, -10, ic, { t: tAt(T, .1), o: inW(T, .1, .45), mv: { s: pSG(T, .1, .5) }, size: f1(ph * .36), maxW: f1(pw - 4 * qr - 60) });
    const ul = p.line(-lw / 2, ly, lw / 2, ly, { sw: 7, stroke: ACC1 }); on(ul, p, 0, { draw: [[0, 0], [tAt(T, .5), 0], [T.H, 1, 'io']] }); }
  /* 19 flat / tall — รางอารมณ์: a frown disc at one end, a smile disc at the other, a track between; the big knob with the feeling slides to its side */
  function R19L(p, c, d, W, H) { const T = TQ(), good = d.mood !== 'bad', tall = shpG(W, H) === 'tall', L = tall ? H : W, A = tall ? W : H, M = (u, v) => tall ? [v, -u] : [u, v];
    const er = f1(A * (tall ? .15 : .26)), kr = f1(A * (tall ? .3 : .44)), a0 = f1(-L / 2 + er + 6), a1 = f1(L / 2 - er - 6), th = f1(Math.max(22, A * .12)), t0 = f1(a0 + er + 14), t1 = f1(a1 - er - 14), um = f1((t0 + t1) / 2), off = f1(Math.min((t1 - t0) * .32, (t1 - t0) / 2 - kr - 8)), uk = f1(um + (good ? off : -off));   /* the knob never covers the end discs */
    const s0 = a0, s1 = a1, tw = f1(s1 - s0), rect = tall ? [f1(-th / 2), f1(-s1), th, tw] : [s0, f1(-th / 2), tw, th], g = sIn(p, 0, 0, T.tI);   /* the track ends under the knob at either end — nothing peeks past it */ glassR(g, ...rect, f1(th / 2), 4);
    const cl = clipG(p, rect[0] + 5, rect[1] + 5, rect[2] - 10, rect[3] - 10, f1(th / 2 - 5)), [mx, my] = M(um, 0), lo = Math.min(um, uk), len = Math.abs(uk - um);
    const fg = mvG(cl, Object.assign({ px: mx, py: my, o: fadeS(T.tA, .2) }, tall ? { sy: KW(T, .05, 1, v => Math.max(.001, v)) } : { sx: KW(T, .05, 1, v => Math.max(.001, v)) }));
    R(fg, ...(tall ? [f1(-th / 2), f1(-Math.max(um, uk)), th, len] : [lo, f1(-th / 2), len, th]), 0, { fill: TA(.55), sw: 0, stroke: 'none' });
    [[a0, 'frown'], [a1, 'smile']].forEach(([u, ic], i) => { const [x, y] = M(u, 0), g = sIn(p, x, y, f3(T.tI + tu(.06 * i))); glassC(g, x, y, er, 4); put(p, c, { icon: ic }, x, y, f1(er * 1.2), null, { t: tu(.2), o: [[0, 0], [tu(.2), 0], [tu(.5), .7, 'io']] }); });
    const KK = KW(T, .05, 1, v => f1((uk - um) * v)), mv = tall ? { y: KW(T, .05, 1, v => f1(-(uk - um) * v)) } : { x: KK }, kg = mvG(p, Object.assign({ px: mx, py: my, o: fadeS(f3(T.tI + tu(.1))) }, mv));
    glassC(kg, mx, my, kr, 5); kg.circle(mx, my, f1(kr - 14), S(1.6)); litOn(kg, T.H).circle(mx, my, kr, { fill: TA(.08), sw: 5, stroke: ACC1 });
    thing(p, c, d.feel, mx, my, f1(kr * 1.3), { t: tu(.2), mv: Object.assign({ px: mx, py: my }, mv), size: f1(kr * .34), maxW: f1(kr * 1.6) }); }
  /* 21 flat / wide — การ์ดแผนที่: a map card fills the box (a few soft roads), the pin stands in it with the place's icon; spots are small pins on the roads */
  function R21M(p, c, d, W, H) { const T = TQ(), P = d.place || {}, SPT = (Array.isArray(d.spots) ? d.spots.filter(has) : []).slice(0, 2), cw = f1(W * .98), ch = f1(H * .96), rr = f1(Math.min(cw, ch) * .12), nm = !icOf(P) && lbOf(P);
    const g = sIn(p, 0, 0, T.tI); glassR(g, -cw / 2, -ch / 2, cw, ch, rr); R(litOn(p, T.H), -cw / 2, -ch / 2, cw, ch, rr, { fill: 'none', sw: 4.4, stroke: ACC1 });
    const RD = [`M ${f1(-cw / 2 + 6)} ${f1(ch * .22)} C ${f1(-cw * .2)} ${f1(ch * .05)}, ${f1(cw * .1)} ${f1(ch * .4)}, ${f1(cw / 2 - 6)} ${f1(ch * .14)}`, `M ${f1(-cw * .22)} ${f1(-ch / 2 + 6)} C ${f1(-cw * .18)} ${f1(-ch * .1)}, ${f1(-cw * .3)} ${f1(ch * .2)}, ${f1(-cw * .26)} ${f1(ch / 2 - 6)}`, `M ${f1(cw * .26)} ${f1(-ch / 2 + 6)} C ${f1(cw * .24)} ${f1(-ch * .1)}, ${f1(cw * .32)} ${f1(ch * .1)}, ${f1(cw * .3)} ${f1(ch / 2 - 6)}`];
    RD.forEach(dd => drawAt(p.path(dd, { sw: 3, stroke: C.soft }), p, f3(T.tI + tu(.1)), tu(.6)));
    const r = f1(Math.min(ch * .86 / 2.9, cw * .3)), hy = f1(-r * .45), pk = { px: 0, py: hy, y: KW(T, 0, .45, u => f1(-30 * (1 - u))), o: inW(T, 0, .25) }, mg = mvG(p, pk);
    mg.path(pinD(0, hy, r), F(4.8)); mg.circle(0, hy, f1(r * .72), S(1.6)); litOn(mg, T.H).path(pinD(0, hy, r), { fill: TA(.06), sw: 4.8, stroke: ACC1 });
    if (icOf(P)) put(p, c, { icon: P.icon }, 0, hy, f1(r * 1.1), null, { t: tAt(T, 0), o: pk.o, mv: { px: 0, py: hy, y: pk.y } });
    else { mg.circle(0, hy, f1(r * .16), { fill: ACC1, sw: 0, stroke: 'none' }); if (nm) { const tl = cw < ch, wd = !tl && ch > 300; pill(p, nm, tl ? 0 : wd ? f1(-cw * .32) : f1(r + 30 + Math.min(240, wordW(p, nm, 36)) / 2 + 30), tl ? f1(hy + r * 1.9 + 44) : wd ? f1(-ch * .3) : hy, { t: tAt(T, .4), size: 36, maxW: 240 }); } }
    const sr = f1(r * (cw < ch ? .36 : .5)); SPT.forEach((X, i) => { const tl = cw < ch, wd = !tl && ch > 300, x = f1(tl ? (i ? 1 : -1) * cw * .28 : wd ? (i ? 1 : -1) * cw * .38 : nm ? (i ? cw * .4 : -cw * .36) : i ? cw * .3 : -cw * .26),   /* name tag beside the pin → spots to the far sides; wide → lower far sides */ y = f1(tl ? ch / 2 - 30 : wd ? ch * .3 : i ? -ch * .02 : ch * .1), shy = f1(y - sr * 1.9 + 6), a = .5 + .15 * i, gg = mvG(p, { px: x, py: shy, o: inW(T, a, a + .2) });
      gg.path(pinD(x, shy, sr), F(3.6)); thing(p, c, X, x, shy, f1(sr * 1.15), { t: tAt(T, a), o: inW(T, a, a + .2), size: 16, maxW: f1(sr * 1.4) }); }); }
  /* 22 tall — ชุดเฟืองแนวตั้ง: the subject's gear at the top, the parts' gears meshed down the box, the result at the bottom */
  function R22T(p, c, d, W, H) { const T = TQ(), Cs = (Array.isArray(d.components) ? d.components.filter(has) : []).slice(0, 3), Rs = d.result && has(d.result) ? d.result : null, n = Math.max(2, Cs.length), fy = FLRG(H);
    floorSG(p, T, W, H); let R1 = f1(W * .42), R2 = f1(R1 * .62), rres = f1(R2 * .9); const k = .82, span = () => 2 * R1 + R2 * k + R2 + (n - 1) * 2 * R2 * k + (Rs ? 26 + 2 * rres : 0), room = fy - 10 - (-H / 2 + 8);
    const sc = Math.min(1, room / span()); R1 = f1(R1 * sc); R2 = f1(R2 * sc); rres = f1(rres * sc); const y0 = f1(-H / 2 + 8 + (room - span()) / 2 + R1); let py = y0, pr = R1;
    const g1 = mvG(p, { px: 0, py: y0, r: KW(T, 0, .85, v => f1(120 * v)), o: fadeS(T.tI) }); glassP(g1, gearG(0, y0, R1, 14), y0 - R1, y0 + R1, 4.2); g1.circle(0, y0, f1(R1 * .62), S(1.6)); thing(p, c, d.subject, 0, y0, f1(R1 * .9), { t: tu(.18), size: f1(R1 * .22), maxW: f1(R1 * 1.1) });
    Cs.forEach((X, i) => { const y = f1(py + pr + R2 * k), sg = i % 2 ? 1 : -1, g2 = mvG(p, { px: 0, py: y, r: KW(T, 0, .85, v => f1(sg * 120 * R1 / R2 * v)), o: fadeS(f3(T.tI + tu(.06 * (i + 1)))) });
      glassP(g2, gearG(0, y, R2, 9, i % 2 ? 0 : Math.PI / 9), y - R2, y + R2, 3.8); thing(p, c, X, 0, y, f1(R2 * .92), { t: tu(.2 + .06 * i), size: f1(Math.max(16, R2 * .3)), maxW: f1(R2 * 1.1) }); litOn(p, tAt(T, .3 + .2 * i)).circle(0, y, f1(R2 * .62), { fill: TA(.12), sw: 0, stroke: 'none' }); py = y; pr = R2 * k; });
    if (Rs) { const ry = f1(py + R2 + 26 + rres), g = mvG(p, { px: 0, py: ry, s: pSG(T, .75, 1), o: inW(T, .75, .9) }); glassC(g, 0, ry, rres, 4); litOn(g, T.H).circle(0, ry, rres, { fill: 'none', sw: 4, stroke: ACC1 }); thing(p, c, Rs, 0, ry, f1(rres * 1.2), { t: tAt(T, .75), o: inW(T, .75, .95), mv: { s: pSG(T, .75, 1) }, size: 18, maxW: f1(rres * 1.5) }); } }
  const pick = (fn, alt) => (p, c, d, W, H) => (alt[shpG(W, H)] || fn)(p, c, d, W, H);

  /* ===== round 2 of per-size redesigns (user marked: size 4 B20 B21 · size 1 B18 · B19 square boxes · B17 two items · size 1 B13 "แคปซูลยาวๆ ดูโล่งๆ แปลกๆ") ===== */
  /* 13 flat — แถวช่องล็อก: a row of locked tiles fills the strip; the middle one unlocks, grows and shows the secret, the others dim */
  function R13F(p, c, d, W, H) { const T = TQ(), n = 5, gp = 16, ts = f1(Math.min(H * .8, (W - (n - 1) * gp) / (n + .6))), kS = f1(Math.min(H * .96 / ts, 1.2)), step = f1(ts + gp), rr = f1(ts * .24);
    for (let i = 0; i < n; i++) { if (i === 2) continue; const x = f1((i - 2) * step + (i < 2 ? -1 : 1) * ts * (kS - 1) / 2), t = f3(T.tI + tu(.04 * i));
      glassR(mvG(p, { px: x, py: 0, o: fadeS(t).concat(KW(T, .2, .55, u => 1 - .65 * u, 8).slice(1)) }), f1(x - ts / 2), f1(-ts / 2), ts, ts, rr, 4);
      put(p, c, { icon: 'lock' }, x, 0, f1(ts * .44), null, { t, o: fadeS(t).concat(KW(T, .2, .55, u => 1 - .7 * u, 8).slice(1)) }); }
    const SK = KW(T, .2, .7, u => 1 + (kS - 1) * u), g = mvG(p, { px: 0, py: 0, s: SK, o: fadeS(T.tI) }); glassR(g, -ts / 2, -ts / 2, ts, ts, rr, 4); R(litOn(g, T.H), -ts / 2, -ts / 2, ts, ts, rr, { fill: TA(.1), sw: 4, stroke: ACC1 });
    put(p, c, { icon: 'lock' }, 0, 0, f1(ts * .44), null, { t: T.tI, o: outAfter(T.tI, T, 0, .2) }); put(p, c, { icon: 'lock-open' }, 0, 0, f1(ts * .44), null, { t: tAt(T, 0), o: [[0, 0], [tAt(T, 0), 0], [tAt(T, .12), 1, 'io'], [tAt(T, .22), 1], [tAt(T, .38), 0, 'io']] });
    thing(p, c, d.secret, 0, 0, f1(ts * kS * .72), { t: tAt(T, .45), o: inW(T, .45, .8), mv: { s: pSG(T, .45, .9) }, size: f1(ts * .3), maxW: f1(ts * kS * .9) }); }
  /* 18 flat — เส้นเวลาพาดยาว: a time track across the whole strip with its nodes; the moment is a big disc in the middle; the time (if said) on a tag on the track */
  function R18F(p, c, d, W, H) { const T = TQ(), when = d.when && String(d.when).trim(), dr = f1(H * .47), x0 = f1(-W / 2 + 10), x1 = f1(W / 2 - 10);
    const tr = p.line(x0, 0, x1, 0, { sw: 4 }); on(tr, p, 0, { draw: [[0, 0], [T.tI, 0], [tAt(T, .3), 1, 'io']] });
    [-.42, -.3, .3, .42].forEach((u, i) => { if (when && u === -.3) return; const g = sub(p); on(g, p, 0, { o: inW(T, .05 * i, .05 * i + .2) }); g.circle(f1(u * W), 0, 10, F(3)); });
    [-.17, .17].forEach(u => { const g = sub(p); on(g, p, 0, { o: inW(T, .2, .4) }); g.circle(f1(u * W), 0, 14, F(3.4)); });
    if (when) pill(p, when, f1(-W * .32), 0, { t: tAt(T, .1), size: 36, maxW: f1(W * .2) });
    const g = mvG(p, { px: 0, py: 0, s: pSG(T, .3, .6), o: inW(T, .3, .5) }); glassC(g, 0, 0, dr, 5); g.circle(0, 0, f1(dr - 14), S(1.6)); litOn(g, T.H).circle(0, 0, dr, { fill: 'none', sw: 5, stroke: ACC1 });
    thing(p, c, d.what, 0, 0, f1(dr * 1.2), { t: tAt(T, .35), o: inW(T, .35, .65), mv: { s: pSG(T, .35, .7) }, size: f1(dr * .34), maxW: f1(dr * 1.6) }); }
  /* 19 square — วงสามในสี่: five segments wrap three-quarters round the feeling's disc, a frown and a smile in the gap at the bottom; the segments light toward the feeling's side */
  function R19Q(p, c, d, W, H) { const T = TQ(), good = d.mood !== 'bad', Ro = f1(Math.min(W, H) * .47), Ri = f1(Ro * .8), dr = f1(Ri - 22), cy = f1(-Ro * .06), sp = 270 / 5;
    const seg = i => { const a0 = 135 + i * sp + 3, a1 = a0 + sp - 6, P = (a, r) => f1(r * Math.cos(a * Math.PI / 180)) + ' ' + f1(cy + r * Math.sin(a * Math.PI / 180)); return `M ${P(a0, Ro)} A ${Ro} ${Ro} 0 0 1 ${P(a1, Ro)} L ${P(a1, Ri)} A ${Ri} ${Ri} 0 0 0 ${P(a0, Ri)} Z`; };
    const lit = good ? [2, 3, 4] : [2, 1, 0];
    [0, 1, 2, 3, 4].forEach(i => { const g = sIn(p, 0, cy, f3(T.tI + tu(.04 * i))); glassP(g, seg(i), cy - Ro, cy + Ro, 3.6); const k = lit.indexOf(i); if (k >= 0) litOn(p, tAt(T, .2 + .25 * k)).path(seg(i), { fill: TA(.4), sw: 3.6, stroke: ACC1 }); });
    const es = f1(Ro * .26), ey = f1(cy + Ro * .84); [[-1, 'frown'], [1, 'smile']].forEach(([sd, ic]) => put(p, c, { icon: ic }, f1(sd * Ro * .5), ey, es, null, { t: tu(.2), o: [[0, 0], [tu(.2), 0], [tu(.5), .65, 'io']] }));
    const g = sIn(p, 0, cy, f3(T.tI + tu(.1))); glassC(g, 0, cy, dr, 5); g.circle(0, cy, f1(dr - 14), S(1.6)); litOn(p, T.H).circle(0, cy, dr, { fill: TA(.08), sw: 5, stroke: ACC1 });
    thing(p, c, d.feel, 0, cy, f1(dr * 1.3), { t: tAt(T, 0), o: inW(T, 0, .3), size: f1(dr * .34), maxW: f1(dr * 1.6) }); }
  /* 20 tall — สองแผ่นบนล่าง: a at the top, b at the bottom; a thick link grows from both and meets at a link disc in the middle; ended → it stops short, ✕ */
  function R20T(p, c, d, W, H) { const T = TQ(), cut = d.cut === true, r = f1(Math.min(W * .4, H * .18)), ya = f1(-H / 2 + r + 4), yb = f1(H / 2 - r - 4), nr = f1(r * .42), stop = cut ? f1(nr * .9) : 0, tw = f1(Math.max(12, r * .16));
    [[ya, d.a], [yb, d.b]].forEach(([y, X], i) => { const g = sIn(p, 0, y, f3(T.tI + tu(.08 * i))); glassC(g, 0, y, r, 4.6); g.circle(0, y, f1(r - 12), S(1.6)); thing(p, c, X, 0, y, f1(r * 1.25), { t: tu(.18 + .08 * i), size: f1(r * .34), maxW: r * 1.6 }); });
    [[f1(ya + r), 1], [f1(yb - r), -1]].forEach(([y, sd]) => { const len = f1(Math.max(4, Math.abs(y) - stop)), gg = mvG(p, { px: 0, py: y, sy: KW(T, 0, .45, v => Math.max(.001, v)), o: [[0, 0], [tAt(T, 0), 0], [f3(tAt(T, 0) + tu(.06)), 1]] });
      glassR(gg, f1(-tw / 2), sd > 0 ? y : f1(y - len), tw, len, f1(tw / 2), 3.4); if (!cut) R(litOn(gg, T.H), f1(-tw / 2), sd > 0 ? y : f1(y - len), tw, len, f1(tw / 2), { fill: TA(.5), sw: 3.4, stroke: ACC1 }); });
    if (cut) { const mg = popAt(p, 0, 0, tAt(T, .6)); mg.circle(0, 0, f1(nr * .7), F(4)); XX(mg, 0, 0, f1(nr / 40)); }
    else { const g = mvG(p, { px: 0, py: 0, s: pSG(T, .42, .7), o: inW(T, .42, .62) }); glassC(g, 0, 0, nr, 4.4); litOn(g, T.H).circle(0, 0, nr, { fill: TA(.15), sw: 4.4, stroke: ACC1 }); put(p, c, { icon: 'link' }, 0, 0, f1(nr * 1.16), null, { t: tAt(T, .42), o: inW(T, .42, .62), mv: { s: pSG(T, .42, .7) } }); } }

  /* 13 flat (round 3) — เลื่อนปลดล็อก: a long bar; the secret is masked as dots; the lock knob slides along the bar, each dot goes as it passes, the knob unlocks at the far end and the secret is there */
  function R13S(p, c, d, W, H) { const T = TQ(), cw = f1(W * .98), ch = f1(Math.min(H * .86, 190)), rr = f1(ch / 2), kr = f1(rr - 12), x0 = f1(-cw / 2 + rr), x1 = f1(cw / 2 - rr), A0 = .05, A1 = .7;
    const inv = f => { let lo = 0, hi = 1; for (let i = 0; i < 24; i++) { const m = (lo + hi) / 2; if (ioE2(m) < f) lo = m; else hi = m; } return (lo + hi) / 2; }, at = x => A0 + (A1 - A0) * inv(cl01((x - x0) / (x1 - x0)));
    const g = sIn(p, 0, 0, T.tI); glassR(g, -cw / 2, -ch / 2, cw, ch, rr); R(litOn(p, T.H), -cw / 2, -ch / 2, cw, ch, rr, { fill: 'none', sw: 4.4, stroke: ACC1 });
    const cl = clipG(p, f1(-cw / 2 + 8), f1(-ch / 2 + 8), f1(cw - 16), f1(ch - 16), f1(rr - 8)), fl = mvG(cl, { px: f1(-cw / 2), py: 0, sx: KW(T, A0, A1, u => Math.max(.001, (x0 - (-cw / 2) + u * (x1 - x0)) / cw)), o: fadeS(tAt(T, A0), .2) });
    R(fl, f1(-cw / 2), f1(-ch / 2), cw, ch, 0, { fill: TA(.12), sw: 0, stroke: 'none' });
    const n = 6, d0 = f1(x0 + kr + 40), d1 = f1(x1 - kr - 40), dr = f1(ch * .07);
    for (let i = 0; i < n; i++) { const x = f1(d0 + (d1 - d0) * i / (n - 1)), a = at(x); mvG(p, { px: x, py: 0, s: KW(T, Math.max(0, a - .03), Math.min(1, a + .07), u => Math.max(.001, 1 - u), 6), o: fadeS(f3(tu(.2 + .04 * i))) }).circle(x, 0, dr, { fill: C.ink, sw: 0, stroke: 'none' }); }
    thing(p, c, d.secret, 0, 0, f1(ch * .78), { t: tAt(T, .62), o: inW(T, .62, .9), mv: { s: pSG(T, .62, .95) }, size: f1(ch * .34), maxW: f1(cw * .5) });
    const XK = KW(T, A0, A1, u => f1((x1 - x0) * u)), kg = mvG(p, { px: x0, py: 0, x: XK, o: fadeS(T.tI) }); glassC(kg, x0, 0, kr, 4.6); litOn(kg, tAt(T, A1)).circle(x0, 0, kr, { fill: TA(.2), sw: 4.6, stroke: ACC1 });
    const mv = { px: x0, py: 0, x: XK }; put(p, c, { icon: 'lock' }, x0, 0, f1(kr * 1.1), null, { t: tu(.16), mv, o: outAfter(tu(.16), T, .62, .76) }); put(p, c, { icon: 'lock-open' }, x0, 0, f1(kr * 1.1), null, { t: tAt(T, .62), mv, o: inW(T, .62, .8) }); }
  /* 20 flat — สองแผ่นใหญ่สุดปลาย: a and b on big discs at the two ends; a thick link grows from both and meets at a link disc in the middle; ended → it stops short, ✕ */
  function R20F(p, c, d, W, H) { const T = TQ(), cut = d.cut === true, r = f1(H * .46), ax = f1(-W / 2 + r + 4), bx = f1(W / 2 - r - 4), nr = f1(r * .56), stop = cut ? f1(nr * 1.1) : 0, tw = f1(Math.max(14, r * .2));
    [[ax, d.a], [bx, d.b]].forEach(([x, X], i) => { const g = sIn(p, x, 0, f3(T.tI + tu(.08 * i))); glassC(g, x, 0, r, 4.6); g.circle(x, 0, f1(r - 12), S(1.6)); thing(p, c, X, x, 0, f1(r * 1.25), { t: tu(.18 + .08 * i), size: f1(r * .34), maxW: r * 1.6 }); });
    [[f1(ax + r), 1], [f1(bx - r), -1]].forEach(([x, sd]) => { const len = f1(Math.max(4, Math.abs(x) - stop + (cut ? 0 : 2))), gg = mvG(p, { px: x, py: 0, sx: KW(T, 0, .45, v => Math.max(.001, v)), o: [[0, 0], [tAt(T, 0), 0], [f3(tAt(T, 0) + tu(.06)), 1]] });
      glassR(gg, sd > 0 ? x : f1(x - len), f1(-tw / 2), len, tw, f1(tw / 2), 3.4); if (!cut) R(litOn(gg, T.H), sd > 0 ? x : f1(x - len), f1(-tw / 2), len, tw, f1(tw / 2), { fill: TA(.5), sw: 3.4, stroke: ACC1 }); });
    if (cut) { const mg = popAt(p, 0, 0, tAt(T, .6)); mg.circle(0, 0, f1(nr * .8), F(4)); XX(mg, 0, 0, f1(nr / 36)); }
    else { const g = mvG(p, { px: 0, py: 0, s: pSG(T, .42, .7), o: inW(T, .42, .62) }); glassC(g, 0, 0, nr, 4.4); litOn(g, T.H).circle(0, 0, nr, { fill: TA(.15), sw: 4.4, stroke: ACC1 }); put(p, c, { icon: 'link' }, 0, 0, f1(nr * 1.16), null, { t: tAt(T, .42), o: inW(T, .42, .62), mv: { s: pSG(T, .42, .7) } }); } }

  /* centre a whole design (art + its icons + over-arts) in its box, and report anything past the box */
  function centreAll(q, c, k, i, S) { const inv = q.g.getScreenCTM().inverse(), svg = q.g.ownerSVGElement, pt = svg.createSVGPoint(); let b = null;
    const add = el => { if (!el) return; const r = el.getBoundingClientRect(); if (!r.width && !r.height) return; [[r.left, r.top], [r.right, r.bottom]].forEach(([x, y]) => { pt.x = x; pt.y = y; const l = pt.matrixTransform(inv);
      b = b ? [Math.min(b[0], l.x), Math.min(b[1], l.y), Math.max(b[2], l.x), Math.max(b[3], l.y)] : [l.x, l.y, l.x, l.y]; }); };
    const box = (x0, y0, x1, y1) => { b = b ? [Math.min(b[0], x0), Math.min(b[1], y0), Math.max(b[2], x1), Math.max(b[3], y1)] : [x0, y0, x1, y1]; };
    add(q.g); (TRK || []).forEach(a => { if (a.__lb) { const [x, y, w] = a.__lb, h = w * .45; box(x - h, y - h, x + h, y + h); } else add(a.wrap); }); if (!b) return;
    const dx = f1(-(b[0] + b[2]) / 2), dy = f1(-(b[1] + b[3]) / 2); q.g.setAttribute('transform', `translate(${dx} ${dy})`);
    (TRK || []).forEach(a => { if (!a.wrap || !a.wrap.parentNode) return; const g = document.createElementNS(NS, 'g'); g.setAttribute('transform', `translate(${f1(dx * c.s)} ${f1(dy * c.s)})`); a.wrap.parentNode.insertBefore(g, a.wrap); g.appendChild(a.wrap); });
    const w = b[2] - b[0], h = b[3] - b[1]; if (w > S.w - 6 || h > S.h - 6) console.error(`OVERFLOW size ${k} design ${i}: ${f1(w)}×${f1(h)} in ${S.w}×${S.h}`); }

  /* ----- the sheets ----- */
  function frame(c, W0, H0) { const f = p => { p.rect(-W0 / 2, -H0 / 2, W0, H0, { sw: 3, stroke: '#ffd400' }); }; f.custom = true; f.dur = .01; f.exit = 'pop'; G.art(f, { x: c.x, y: c.y, s: c.s, at: 0, speed: 1 }); }
  const SIZES = [null, { w: 860, h: 230, th: 'แถบแบนยาว' }, { w: 860, h: 470, th: 'กว้าง' }, { w: 560, h: 490, th: 'เกือบจัตุรัส' }, { w: 400, h: 635, th: 'ตั้งแคบ' }, { w: 860, h: 710, th: 'เต็มจอ ทรงนอน' }, { w: 860, h: 965, th: 'เต็มจอ ทรงตั้ง' }, { w: 400, h: 500, th: 'ตั้งแคบ สั้น' }];
  const I = (icon, label) => label ? { icon, label } : { icon };
  const FN = [pick(Q13, { tall: R13T, flat: R13S }), pick(Q14, { tall: R14T, flat: R14F }), Q15, Q16, Q17, pick(Q18, { flat: R18F }), pick(Q19, { flat: R19L, tall: R19L, sq: R19Q }), pick(Q20, { tall: R20T, flat: R20F }), pick(Q21, { flat: R21M, wide: R21M, tall: R21M }), pick(Q22, { tall: R22T })], TH = ['แคปซูลแยกออก', 'แท่นสองชั้น', 'ปุ่มวงแหวน', 'สองแผ่นเท่ากัน', 'แผ่นวงกับการ์ด', 'เส้นเวลาชี้จุดนั้น', 'วงวัดอารมณ์', 'สะพานแสง', 'หมุดเหนือแผ่นวง', 'ชุดเฟือง'];
  const D = [
    { cat: 'B13 เคล็ดลับ', th: TH[0], fn: FN[0], data: [{ say: 'เคล็ดลับคือใส่เกลือนิดเดียว', secret: I('cooking-pot', 'เกลือนิดเดียว') }, { say: 'ความลับคือจ่ายตัวเองก่อน', secret: I('piggy-bank') }, { say: 'วิธีลัดคือกด Ctrl+Z (ไม่มีไอคอน)', secret: { label: 'Ctrl+Z' } }] },
    { cat: 'B14 ประโยคเด็ด', th: TH[1], fn: FN[1], data: [{ say: 'เริ่มจากเล็กๆ แล้วจะไปได้ไกล', idea: I('sprout', 'เริ่มจากเล็กๆ') }, { say: 'ทำอะไรก็ทำด้วยใจ', idea: I('heart', 'ทำด้วยใจ') }, { say: 'ช้าแต่ชัวร์ (ไม่มีไอคอน)', idea: { label: 'ช้าแต่ชัวร์' } }] },
    { cat: 'B15 ชวนทำ', th: TH[2], fn: FN[2], data: [{ say: 'อย่าลืมกดติดตาม', action: 'follow', label: 'กดติดตาม' }, { say: 'เซฟเก็บไว้ (ไม่มีคำ)', action: 'save' }, { say: 'เม้นบอกหน่อยนะ', action: 'comment', label: 'เม้นบอกหน่อย' }] },
    { cat: 'B16 นิยาม', th: TH[3], fn: FN[3], data: [{ say: 'ROI คือกำไรเทียบเงินลงทุน', term: { label: 'ROI' }, means: [I('coins', 'กำไร'), I('wallet', 'เงินลงทุน')] }, { say: 'โซลาร์เซลล์คือแดดเป็นไฟ', term: I('sun', 'โซลาร์เซลล์'), means: [I('zap', 'ไฟฟ้า')] }, { say: 'บุฟเฟต์คือจ่ายครั้งเดียวกินไม่อั้น', term: { label: 'บุฟเฟต์' }, means: [I('wallet', 'จ่ายครั้งเดียว'), I('utensils', 'กิน'), I('infinity', 'ไม่อั้น')] }] },
    { cat: 'B17 รายการ', th: TH[4], fn: FN[4], data: [{ say: 'เมนูเช้ามีกาแฟ ครัวซองต์ น้ำส้ม', items: [I('coffee'), I('croissant'), I('cup-soda')], label: 'เมนูเช้า' }, { say: 'ของที่ต้องพก 4 อย่าง', items: [I('wallet'), I('key'), I('book-open'), I('clock')] }, { say: 'สองอย่าง (ไม่มีไอคอน)', items: [{ label: 'ใจเย็น' }, { label: 'ฟังให้จบ' }] }] },
    { cat: 'B18 เหตุการณ์', th: TH[5], fn: FN[5], data: [{ say: 'ปี 2020 ผมเปิดร้านแรก', what: I('store', 'เปิดร้าน'), who: I('user'), when: 'ปี 2020' }, { say: 'แล้วเขาก็ย้ายไปต่างประเทศ', what: I('plane', 'ย้ายประเทศ') }, { say: 'ตอน ม.6 สอบตก (ไม่มีไอคอน)', what: { label: 'สอบตก' }, when: 'ตอน ม.6' }] },
    { cat: 'B19 ความรู้สึก', th: TH[6], fn: FN[6], data: [{ say: 'ดีใจมากเลย', feel: I('smile', 'ดีใจ'), mood: 'good' }, { say: 'ลูกค้าเสียใจมาก', feel: I('heart-crack', 'เสียใจ'), mood: 'bad', who: I('user') }, { say: 'หงุดหงิดทุกครั้ง', feel: I('annoyed', 'หงุดหงิด'), mood: 'bad' }] },
    { cat: 'B20 ความสัมพันธ์', th: TH[7], fn: FN[7], data: [{ say: 'เขาเป็นลูกค้าประจำร้าน', a: I('user'), b: I('store'), label: 'ลูกค้าประจำ' }, { say: 'เราเป็นเพื่อนกัน (ไม่มีคำ)', a: I('user'), b: I('user') }, { say: 'เลิกกับแฟนเก่าแล้ว', a: I('user'), b: I('heart'), label: 'แฟนเก่า', cut: true }] },
    { cat: 'B21 สถานที่', th: TH[8], fn: FN[8], data: [{ say: 'ร้านอยู่ตลาดน้อย ใกล้ร้านกาแฟ', place: I('store', 'ตลาดน้อย'), spots: [I('coffee')] }, { say: 'ไปดอยอินทนนท์', place: I('mountain', 'ดอยอินทนนท์') }, { say: 'ที่สยาม มีร้านเสื้อกับร้านอาหาร', place: { label: 'สยาม' }, spots: [I('shopping-bag'), I('utensils')] }] },
    { cat: 'B22 กลไก', th: TH[9], fn: FN[9], data: [{ say: 'โซลาร์เซลล์ทำงานยังไง', subject: I('sun', 'โซลาร์เซลล์'), components: [I('sun'), I('zap'), I('plug')], result: I('house') }, { say: 'ระบบผ่อนจ่าย (2 ชิ้น)', subject: { label: 'ผ่อนจ่าย' }, components: [I('wallet'), I('calendar')], result: I('house') }, { say: 'ฝึก พัก กิน (ไม่มีไอคอน ไม่มีผล)', subject: I('dumbbell'), components: [{ label: 'ฝึก' }, { label: 'พัก' }, { label: 'กิน' }] }] },
  ];
  G.cats = G.cats || {};
  G.cats.SG = { D, SIZES, theme, frame,
    draw: (k, i, d, c) => { setZ(c); CUR = 'sg-' + k + '-' + i; const S = SIZES[k]; BOX = [S.w, S.h]; tokens(); EMPTY = false; BLUE = false; art(c, p => { const q = sub(p); TRK = []; D[i].fn(q, c, d || {}, S.w - 28, S.h - 28); centreAll(q, c, k, i, S); TRK = null; }); }, CLAMPS };
})();
