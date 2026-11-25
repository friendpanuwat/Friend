/* b12s.js — B12 "เหตุ → ผล" ชุด 7 ขนาด (user 2026-11-25 after B11 passed: "ผ่านครับ ทำหมวดต่อไปได้"). Five designs a size (domino, pipe, grow,
   effect card, cascade), clean but not empty; stills first. Data = CutPack B12: items [THING ×3] (1–4 handled) · end (an icon, optional).
   Header + helpers copied from examples/b12t/b12t.js (clip boxes fixed to the size, ripples off, unnamed links faint not dashed).
   GL.cats.B12S.drawS(size, i, data, c). */
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
    cp.id = 'b12sclip' + (++CID); Object.entries({ x, y, width: w, height: h }).forEach(([k, v]) => r.setAttribute(k, v)); cp.appendChild(r);
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
  /* (user 2026-11-14: "หมวดต่อๆไป อยากให้ใช้ icon คนแทน ในกรณีที่มีการใช้ icon user" → "คนทั้งตัวแบบหมวด B") — from the category after B08, the
     'user' icon (head + suited shoulders) is drawn as a whole-body person instead: GL.parts.human, front view, arms down, no face, no hands, no floor
     line. PERSON_FOR_USER = false keeps B08 as approved; the next category sets it to true. */
  const PERSON_FOR_USER = true;
  if (!G.icons['person-body']) { const fb = p => { const g = p.child({ transform: 'translate(0 -2) scale(1.62)' }, 1.62); g.H = p.H; g.motion = p.motion; G.parts.human(g, 'line', { arm: sd => ({ s: [sd * 36, -82], e: [sd * 50, -16], h: [sd * 54, 42] }) }); };
    fb.dur = .4; G.icons['person-body'] = fb; }
  const iconName = n => PERSON_FOR_USER && n === 'user' ? 'person-body' : n;
  const picOf = it => it && it.icon && (G.icons[iconName(it.icon)] || G.icons[iconName(it.icon) + '-pro']);
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
  function ripple(q, x, y, r, t) { return;   /* B12S: no ripples */  const g = sub(q); on(g, q, 0, { ox: x, oy: y, s: [[0, .85], [t, .85], [t + tu(.7), 1.3, 'out']], o: [[0, 0], [t, 0], [t + tu(.12), .5, 'io'], [t + tu(.7), 0, 'io']] }); g.circle(x, y, r, W(2.4)); }   /* B06T: a soft ring */
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
    if (!ICLIP[k] || !svg.contains(ICLIP[k].cp)) { const cp = document.createElementNS(NS, 'clipPath'), r = document.createElementNS(NS, 'rect'); cp.id = 'b12siclip' + (++CID);
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




  /* ================= B10T — คน / กลุ่มเป้าหมาย (People / Target audience) as a template ชุดฐาน =================
     Story: the people come in one by one → the picking runs (an arm goes up, a figure turns round, the crowd parts, a line points, a gap is
     filled …) → on the keyword H the one this sentence is about lights (accent outline + ripple) and the others dim (a solid dark copy stays
     under them) → the who icon lands in its own box (only when it is not a person icon — a person icon IS the figure), the label lands in a lit
     pill, the tags follow. Every design is told by whole-body people (GL.parts.human: no face, no hands), so it reads "people" even with no data.
     No label / no tags → the people still fill the canvas; nothing but a label → the label. */
  const PERSONS = ['user', 'person-body', 'person-standing', 'user-round'];
  function PD(d) { const X = d && has(d.who) ? d.who : null, L = d && d.label != null && String(d.label).trim() ? String(d.label).trim() : null;
    const Tg = (d && Array.isArray(d.tags) ? d.tags : []).map(s => String(s ?? '').trim()).filter(Boolean).slice(0, 2);
    const isP = !!(X && picOf(X) && PERSONS.includes(X.icon)); return { X, L, Tg, badge: X && !isP ? X : null }; }
  /* timing: tC(i) = person i comes in · T0 = the picking starts (a long sentence waits, then goes) · H = the keyword · tL = the label · tT(k) = tag k */
  function PQ(d, n = 5) { const D = PD(d), H = Z.H, st = Math.min(.1, .62 / Math.max(1, n)), tC = i => f3(tu(.08 + st * i)), T0 = f3(Math.max(tu(.08 + st * (n - 1) + .4), H - tu(1.0)));
    return Object.assign({ H, n, tC, T0, tL: f3(H + tu(.06)), tT: k => f3(H + tu(.18 + .1 * k)) }, D); }

  /* ---------- people ---------- */
  function hum(q, x, fy, k, pose = {}) { const g = q.child({ transform: `translate(${f1(x)} ${f1(fy - 166 * k)}) rotate(${pose.lean || 0} 0 166) scale(${k})` }, k); g.H = q.H; g.motion = q.motion;
    const hm = G.parts.human(g, 'line', { arm: sd => (pose.arms && pose.arms[sd]) || FARM(sd), leg: pose.leg, head: pose.head }); return { hm, g }; }
  const same = (a, b) => String(a).trim().toLowerCase() === String(b).trim().toLowerCase();
  const recolor = (g, fn) => g.g.querySelectorAll('*').forEach(e => ['fill', 'stroke'].forEach(a => { const v = e.getAttribute(a); if (v && v !== 'none') { const n = fn(a, v); if (n) e.setAttribute(a, n); } }));
  /* one person at (x, feet fy), scale k (k .5 ≈ 165 tall). o.g = draw into this group (animate it) · o.dim = dims on H (or at that time) with a solid
     dark copy under it · o.lit = an accent copy fades in on H (or at that time) · o.side = side view facing right (o.arm) · o.pose = front pose
     { arms: { '-1': …, 1: … }, leg, head, lean }. Returns { on(name, p, t, spec) } — the same joint keys go to every copy */
  function fig(q, x, fy, k, o = {}) { const g = o.g || q, hms = [], H = Z.H;
    const draw = gg => o.side ? side(gg, x, fy, k, o.arm || HANG, o.sideO || {}) : hum(gg, x, fy, k, o.pose).hm;
    const dt = o.dim === true ? H : o.dim;
    if (dt != null && dt !== false) { const b = sub(g); hms.push(draw(b)); recolor(b, () => C.fill); }
    const gd = dt != null && dt !== false ? mvG(g, { o: [[0, 1], [dt, 1], [f3(dt + tu(.25)), .36, 'io']] }) : g;
    hms.push(draw(gd));
    if (o.lit) { const l = litOn(g, o.lit === true ? H : o.lit); hms.push(draw(l)); recolor(l, (a, v) => same(v, C.ink) ? ACC1 : null); }
    const J = { on: (name, p, t, spec) => hms.forEach(h => h.on(name, p, t, spec)), far: hms.map(h => h.far).filter(Boolean) }; return J; }
  /* an empty place for a person: a dark body with a faint outline */
  function ghostFig(q, x, fy, k) { const b = sub(q); hum(b, x, fy, k); recolor(b, (a, v) => same(v, C.ink) ? TL_(.32) : null); return b; }
  /* entrances for a person's group: rise (from a little below) · pop (grows in) — px/py at the person's middle */
  const rK = (x, y, t, dy = 46) => ({ px: x, py: y, y: [[0, dy], [t, dy], [f3(t + tu(.34)), 0, 'out']], o: fadeIn(t, .1) });
  const gK = (x, y, t) => ({ px: x, py: y, s: [[0, .84], [t, .84], [f3(t + tu(.34)), 1, 'out']], o: fadeIn(t, .1) });
  const inF = (p, x, fy, k, t, kind = 'rise') => mvG(CL(p), kind === 'pop' ? gK(x, fy - 160 * k, t) : rK(x, fy - 160 * k, t));
  /* the person picked out: ripple + soft halo on H */
  const pickFx = (p, x, fy, k, t = Z.H) => { ripple(p, x, f1(fy - 150 * k), f1(150 * k), f3(t + tu(.02))); };
  /* arms: a turn of the drawn pose `fin` that makes it look like `from` (upper, fore) — turnK from the header */
  const ARMUP = sd => ({ s: [sd * 36, -82], e: [sd * 46, -160], h: [sd * 50, -238] });
  const armKeys = (J, p, sd, fin, from, ks) => { const [r0, q0] = turnK(from, fin); J.on('upper' + sd, p, 0, { ox: fin.s[0], oy: fin.s[1], r: ks(r0) }); J.on('fore' + sd, p, 0, { ox: fin.e[0], oy: fin.e[1], r: ks(q0) }); };
  const toFin = (t0, t1) => r => [[0, r], [t0, r], [t1, 0, 'io']];

  /* ---------- words ---------- */
  const TAGS = () => ({ fill: C.fill, sw: 2.6, stroke: C.soft });
  const LITP = () => ({ fill: TA(.16), sw: 4.4, stroke: ACC1 });
  /* how big a pill for s will be (one line, or two lines when it would shrink below ~42) */
  function labSize(q, s, sz, mw) { const w0 = tw(q, s, sz), room = mw - 64; if (w0 <= room || sz * room / w0 >= 42) return { w: Math.min(w0, room) + 64, h: f1(sz * 1.9), one: true };
    const s2 = Math.max(40, sz * .9); return { w: Math.min(room, tw(q, s, s2) * .58) + 64, h: f1(Math.max(sz * 1.9, s2 * 2.24 + 34)), one: false }; }
  /* a pill with words, centred at (x, y): pops at o.t; o.lit = the label look (accent edge); else o.style */
  function lab(q, s, x, y, o = {}) { if (!s) return null; const sz = o.size || 50, mw = o.maxW || 480, t = o.t ?? f3(Z.H + tu(.06)), Sz = labSize(q, s, sz, mw), g = popAt(q, x, y, t);
    txt(g, s, x, y + sz * .34, { size: sz, maxW: mw - 64, weight: 800, color: o.color || C.ink, wrap: Sz.one ? null : 'mid' });
    const bb = g.g.getBBox(), h = Math.max(sz * 1.9, bb.height + 34), w = bb.width + 64;
    const r = R(g, f1(x - w / 2), f1(y - h / 2), f1(w), f1(h), f1(Math.min(h / 2, 48)), o.style || (o.lit ? LITP() : F(3.4))); g.g.insertBefore(r, g.g.firstChild);
    if (o.lit && !o.style) g.g.insertBefore(R(g, f1(x - w / 2), f1(y - h / 2), f1(w), f1(h), f1(Math.min(h / 2, 48)), BK), g.g.firstChild);   /* the lit pill is see-through: a solid back so nothing shows through */
    return { w, h }; }
  /* the who box (only for a who icon that is not a person): lands just before H, lit on H; a who word with no picture → the word in the box */
  function badgeB(p, c, Q, x, y, s = 176) { if (!Q.badge) return; const t = f3(Q.H - tu(.1)), g = popAt(p, x, y, t);
    R(g, x - s / 2, y - s / 2, s, s, s * .24, F(4)); R(litOn(g, Q.H), x - s / 2, y - s / 2, s, s, s * .24, LIT2());
    if (picOf(Q.badge)) put(p, c, { icon: Q.badge.icon }, x, y, s * .7, null, { t: f3(t + tu(.04)), punch: Q.H });
    else txt(g, Q.badge.label, x, y + s * .08, { size: Math.max(40, s * .22), maxW: s * .86, weight: 800, color: C.ink, wrap: 'mid' }); }
  /* the words of the one picked out, kept together as ONE group (user 2026-11-17: "พยายามทำให้ชิ้นส่วนเกาะกลุ่มกันไว้ บางอันห่างกันเกินไป แต่ก็ไม่ได้
     หมายความว่าให้ติดกันเลย"): the who box beside (o.badge 'left' | 'right') or above ('top') the label + tags, with a set gap; the whole group is placed
     in the box [x0, x1] × [y0, y1] — o.align 'middle' | 'start' | 'end' · o.v 'middle' | 'end' (sits on y1, just above the people) | 'start'.
     o.badge [x, y] = the who box at a fixed place · o.row = label and tags on one line when they fit · o.noLabel */
  function info(p, c, Q, x0, y0, x1, y1, o = {}) { const bs = o.bs || 176, b = o.badge ?? 'left', hasB = !!Q.badge && b !== false, gB = 34, gap = 18, lsz = o.size || 50;
    if (hasB && Array.isArray(b)) badgeB(p, c, Q, b[0], b[1], bs);
    const side = hasB && (b === 'left' || b === 'right'), top = hasB && b === 'top', aw = (x1 - x0) - (side ? bs + gB : 0), Ls = !o.noLabel && Q.L ? Q.L : null;
    const L = Ls ? labSize(p, Ls, lsz, aw) : null, tg = Q.Tg.map(s => labSize(p, s, 40, aw)), rowW = tg.reduce((a, v) => a + v.w, 0) + gap * Math.max(0, tg.length - 1);
    const one = !!(o.row && L && tg.length && L.w + 24 + rowW <= aw), inRow = rowW <= aw;
    const tH = !tg.length ? 0 : inRow ? Math.max(...tg.map(v => v.h)) : tg.reduce((a, v) => a + v.h, 0) + 12 * (tg.length - 1);
    const tW = one ? L.w + 24 + rowW : Math.max(L ? L.w : 0, tg.length ? (inRow ? rowW : Math.max(...tg.map(v => v.w))) : 0);
    const tHt = one ? Math.max(L.h, ...tg.map(v => v.h)) : (L ? L.h : 0) + (L && tg.length ? gap : 0) + tH;
    if (!tW && !side && !top) return;
    const uW = side ? bs + (tW ? gB + tW : 0) : Math.max(top ? bs : 0, tW), uH = top ? bs + (tHt ? 24 + tHt : 0) : Math.max(side ? bs : 0, tHt);
    const ux = o.align === 'start' ? x0 : o.align === 'end' ? x1 - uW : (x0 + x1) / 2 - uW / 2, uy = o.v === 'end' ? y1 - uH : o.v === 'start' ? y0 : (y0 + y1) / 2 - uH / 2;
    let tx0 = ux + (uW - tW) / 2, ty0 = uy + (uH - tHt) / 2;
    if (side && b === 'left') { badgeB(p, c, Q, ux + bs / 2, uy + uH / 2, bs); tx0 = ux + bs + gB; }
    else if (side) { badgeB(p, c, Q, ux + uW - bs / 2, uy + uH / 2, bs); tx0 = ux; }
    else if (top) { badgeB(p, c, Q, ux + uW / 2, uy + bs / 2, bs); ty0 = uy + bs + 24; }
    const lx = w => o.align === 'start' || (side && b === 'left') ? tx0 + w / 2 : o.align === 'end' || side ? tx0 + tW - w / 2 : tx0 + tW / 2;
    const tagAt = (k, x, y) => lab(p, Q.Tg[k], x, y, { size: 40, maxW: aw, t: Q.tT(k), style: TAGS(), color: C.soft });
    if (one) { let x = tx0; const my = ty0 + tHt / 2; lab(p, Ls, x + L.w / 2, my, { size: lsz, maxW: aw, lit: true, t: Q.tL }); x += L.w + 24;
      tg.forEach((v, k) => { tagAt(k, x + v.w / 2, my); x += v.w + gap; }); return; }
    let y = ty0; if (L) { lab(p, Ls, lx(L.w), y + L.h / 2, { size: lsz, maxW: aw, lit: true, t: Q.tL }); y += L.h + gap; }
    if (!tg.length) return;
    if (inRow) { let x = lx(rowW) - rowW / 2; tg.forEach((v, k) => { tagAt(k, x + v.w / 2, y + tH / 2); x += v.w + gap; }); }
    else tg.forEach((v, k) => { tagAt(k, lx(v.w), y + v.h / 2); y += v.h + 12; }); }
  /* no words at all (no label, no tags, no who box) → the people move to the middle of the canvas instead of leaving the words' place empty */
  const nw = (p, Q, dy) => !Q.L && !Q.Tg.length && !Q.badge ? sub(p, { transform: `translate(0 ${dy})` }) : p;
  const xsRow = (n, step, cx = 0) => Array.from({ length: n }, (_, i) => f1(cx + (i - (n - 1) / 2) * step));
  const way = (p, dd, t, dur, w = 5, a = .45) => drawAt(p.path(dd, { sw: w, stroke: TL_(a) }), p, t, dur);
  /* a rounded panel that rises in at t (drawn into the canvas clip) */
  const panel = (p, w, h, r, t) => { const g = mvG(CL(p), rK(0, 0, t, 60)); R(g, -w / 2, -h / 2, w, h, r, F(4)); return g; };
  let SEED = 11; const rnd = () => (SEED = SEED * 16807 % 2147483647) / 2147483647;




  /* ================= B12T เหตุ → ผล =================
     User 2026-11-17 on the first round: "อันนี้มันแฟนซีเกินไปแล้ว อยากได้ simple อ่ะครับ เหมือนหมวดที่ 1-9" + "แต่ไม่ได้หมายความว่าให้ copy มานะครับ" →
     plain like B01T–B09T (rounded icon boxes, plain words, thin lines, no halos / glow fills / rings / grids) but none of their looks (no row-with-a-line,
     hops, zig-zag, big arrow, arc, spiral, U-turn, grid, stairs, chevrons, cards fan).
     Story: the links come in early → on T0 the first one acts on the next — knocks, presses, snaps into, rolls onto, pushes, swings into, switches on,
     opens … — each link bumps and its edge lights when reached → on the keyword H the last one (the effect: the end sign, else the last link) lights
     and its word lands. Data: items 1–4 (an icon or a word) + end. No links → two unnamed (dashed) links before the end; one link and no end → an
     unnamed effect place (a lit spark on H). A thing with only a word shows the word inside its box. */
  function CQ(d) { d = d || {}; const all = Array.isArray(d.items) ? d.items.slice(0, 4) : [], K0 = all.filter(has), E = has(d.end) ? d.end : null;
    const N = K0.length ? K0.slice() : [{}, {}]; if (E) N.push(E); if (N.length < 2) N.push({});
    const n = N.length, L = n - 1, H = Z.H, st = Math.min(.13, .52 / n), tI = i => f3(tu(.08 + st * i)), T0 = f3(Math.max(tI(L) + tu(.4), H - tu(1.05)));
    const tF = i => i >= L ? H : f3(lerp(T0, H, i / L));
    return { N, n, L, E, H, T0, tI, tF, LB: i => LBL(N[i]) }; }
  const SZn = n => n <= 2 ? 230 : n === 3 ? 205 : n === 4 ? 180 : 165;
  const lin = (a, b, n, i) => n <= 1 ? (a + b) / 2 : f1(a + (b - a) * i / (n - 1));
  const spanX = (n, s, W = 940) => xsRow(n, Math.min(s + 230, (W - s) / Math.max(1, n - 1)));
  const lwAlt = xs => xs.length > 1 ? Math.min(340, 2 * Math.abs(xs[1] - xs[0]) - 60) : 340;
  const lwRow = xs => xs.length > 1 ? Math.min(340, Math.abs(xs[1] - xs[0]) - 70) : 340;
  const polyD = pts => pathOf(pts, false);
  const qP = (a, c, b, n = 16) => Array.from({ length: n + 1 }, (_, k) => { const u = k / n, m = 1 - u; return [f1(m * m * a[0] + 2 * m * u * c[0] + u * u * b[0]), f1(m * m * a[1] + 2 * m * u * c[1] + u * u * b[1])]; });
  const cP = (a, c1, c2, b, n = 24) => Array.from({ length: n + 1 }, (_, k) => { const u = k / n, m = 1 - u; return [0, 1].map(j => f1(m * m * m * a[j] + 3 * m * m * u * c1[j] + 3 * m * u * u * c2[j] + u * u * u * b[j])); });
  const LITS = () => ({ fill: 'none', sw: 5, stroke: ACC1 });
  const DASHB = () => Object.assign({ fill: C.fill }, DASH(.6), { sw: 3 });
  /* a lit stroke that draws itself t0 → t1 (the push going along) */
  const litP = (q, dd, t0, t1, w = 5, e = 'io') => { const el = q.path(dd, { sw: w, stroke: ACC1 }); on(el, q, 0, { draw: [[0, 0], [t0, 0], [t1, 1, e]] }); return el; };
  /* keys that run a part along legs [{ pts, t0, t1 }] (time even along each leg's samples), relative to fin */
  function trackK(S, fin) { const K = { x: [], y: [] }; S.forEach((sg, j) => sg.pts.forEach((pt, k) => { if (j && !k) return; const t = f3(lerp(sg.t0, sg.t1, k / (sg.pts.length - 1)));
    if (!K.x.length) { K.x.push([0, f1(pt[0] - fin[0])]); K.y.push([0, f1(pt[1] - fin[1])]); } K.x.push([t, f1(pt[0] - fin[0])]); K.y.push([t, f1(pt[1] - fin[1])]); })); return K; }
  /* a plain dot that runs along pts t0 → t1 (o.K = ready keys · o.keep = stays) */
  function orb(p, pts, t0, t1, r = 12, o = {}) { const fin = pts[pts.length - 1], K = o.K || pathK(pts, t0, t1, fin, 24, o.lin ? (u => u) : sm), tin = o.in ?? t0;
    const g = mvG(o.clip ? CL(p) : p, { px: fin[0], py: fin[1], x: K.x, y: K.y, o: [[0, 0], [tin, 0], [f3(tin + tu(.04)), 1], [t1, 1], [f3(t1 + tu(.1)), o.keep ? 1 : 0]] });
    g.circle(fin[0], fin[1], r, DOTF()); return g; }
  const nslot = (q, sh, x, y, s, st) => shp(q, sh, x, y, s, st);
  /* a link's box (o.shape box | circ, or o.draw(q, style)): comes in at o.t (default tI(i)) unless o.g; bumps and its edge lights when reached (tF(i));
     the effect gets a soft ring that fades. Returns the box's group (it bumps) */
  function node(p, c, Q, i, x, y, s, o = {}) { const sh = o.shape || 'box', t = o.t ?? Q.tI(i), tf = o.tf ?? Q.tF(i), eff = i === Q.L, X = Q.N[i], ph = !has(X);
    const g0 = o.g || popAt(p, x, y, t), g = o.noBump ? g0 : mvG(g0, { px: x, py: y, s: bumpK(tf, eff ? 1.08 : 1.05) }), dr = o.draw || ((q, st) => nslot(q, sh, x, y, s, st));
    dr(g, ph ? { fill: C.fill, sw: 3, stroke: TL_(.4) } : F(4));   /* B12S: an unnamed link is faint, not dashed (D4) */ if (o.lit !== false) dr(litOn(g, tf), LITS());
    if (eff && o.rip !== false) ripple(p, x, y, f1(s * .6), f3(tf + tu(.04)));
    if (ph) { if (eff) star4(litOn(g, tf), x, y, f1(s * .22), DOTF()); else g.circle(x, y, 13, { fill: C.soft, sw: 0, stroke: 'none' }); }
    else put(p, c, X, x, y, f1(picOf(X) ? s * .6 : s * .9), null, { t: o.it ?? f3(t + tu(.04)), punch: tf, mv: o.mv, o: o.io, bigW: f1(s * .8) });
    return g; }
  /* plain words (no pill), like B01T–B09T: size, and two lines when too long */
  function wsz(p, str, sz, mw) { const w0 = tw(p, str, sz); if (w0 <= mw || sz * mw / w0 >= 40) return { w: Math.min(w0, mw), h: f1(sz * 1.2) }; const s2 = Math.max(40, sz * .9); return { w: Math.min(mw, tw(p, str, s2) * .6), h: f1(s2 * 2.3) }; }
  function nlab(p, Q, i, x, y, o = {}) { const str = Q.LB(i); if (!str) return null; const eff = i === Q.L, sz = o.size || 46, mw = o.maxW || 300, t = o.t ?? (eff ? f3(Q.H + tu(.06)) : f3(Q.tI(i) + tu(.16)));
    const g = popAt(o.g || p, x, y, t); return txt(g, str, x, f1(y + sz * .34), { size: sz, maxW: mw, weight: 800, color: eff ? ACC1 : C.ink, wrap: 'mid' }); }
  /* the word beside a box of size s: below | above | left | right */
  function labAt(p, Q, i, x, y, s, side = 'below', o = {}) { const str = Q.LB(i); if (!str) return; const sz = o.size || 46, mw = o.maxW || 300, L = wsz(p, str, sz, mw), g = o.g ?? 16;
    let cx = side === 'left' ? x - s / 2 - g - L.w / 2 : side === 'right' ? x + s / 2 + g + L.w / 2 : x, cy = side === 'above' ? y - s / 2 - g - L.h / 2 : side === 'below' ? y + s / 2 + g + L.h / 2 : y;
    cx = Math.max(-490 + L.w / 2, Math.min(490 - L.w / 2, cx)); nlab(p, Q, i, f1(cx), f1(cy), { size: sz, maxW: mw, t: o.t, g: o.gg }); }
  const arrowHead = (q, x, y, a, k = 1, st) => chev(rot(q, a, x, y), x, y, k, st || { sw: 6, stroke: ACC1 });


  /* ================= B12S — เหตุ → ผล ชุด 7 ขนาด (user 2026-11-25 after B11 passed: "ผ่านครับ ทำหมวดต่อไปได้") · stills first, the moment everything
     is shown; animation after the user confirms. Clean but not empty (B11's lesson), nothing leaves the box (D12). Every design tells one thing
     causing the next: the links come in → from T0 the first acts on the next, link by link (tF(i)) → on the keyword H the effect (the end sign,
     else the last link) lands, lit. Five mechanisms, laid out per size: DOMINO (tall cards tip onto the next) · PIPE (one tube through the links,
     the light runs along it) · GROW (each link bigger than the one before — a snowball) · EFFECT CARD (the causes as small tiles across the head,
     the effect big below) · CASCADE (links stepping down, a dot drops from one to the next). No ripples, no dashes, no stripes. ================= */
  function frame(c, W0, H0) { const f = p => { p.rect(-W0 / 2, -H0 / 2, W0, H0, { sw: 3, stroke: '#ffd400' }); }; f.custom = true; f.dur = .01; f.exit = 'pop'; G.art(f, { x: c.x, y: c.y, s: c.s, at: 0, speed: 1 }); }
  const SIZES = [null, { w: 860, h: 230, th: 'แถบแบนยาว' }, { w: 860, h: 470, th: 'กว้าง' }, { w: 560, h: 490, th: 'เกือบจัตุรัส' }, { w: 400, h: 635, th: 'ตั้งแคบ' },
    { w: 860, h: 710, th: 'เต็มจอ ทรงนอน' }, { w: 860, h: 965, th: 'เต็มจอ ทรงตั้ง' }, { w: 400, h: 500, th: 'ตั้งแคบ สั้น' }];
  const SZD = {}; const sd = (k, id, th, fn) => (SZD[k] = SZD[k] || []).push({ id, th, fn });
  const NOFILL = { fill: C.fill, sw: 0, stroke: 'none' };

  /* a link's words at (x, y) — clamped inside the box; the effect's in the accent once it lands */
  function wordC(p, Q, i, x, y, sz, mw, anchor = 'middle') { const str = Q.LB(i); if (!str) return; const eff = i === Q.L, t = eff ? f3(Q.H + tu(.06)) : f3(Q.tI(i) + tu(.16)), w = Math.min(mw, tw(p, str, sz));
    const hx = BOX[0] / 2 - 10, cx = anchor === 'start' ? Math.min(x, hx - w) : anchor === 'end' ? Math.max(x, -hx + w) : Math.max(-hx + w / 2, Math.min(hx - w / 2, x));
    const g = popAt(p, f1(cx), y, t); txt(g, str, f1(cx), f1(y + sz * .34), { size: sz, maxW: mw, weight: 800, color: eff ? ACC1 : C.ink, anchor, wrap: 'mid' }); }
  /* a small arrow (chevron) between two links, lit when the push passes it */
  const arrowC = (p, Q, i, x, y, a, k = 1) => { const t = Q.tF(i + 1), g = rot(p, a, x, y), D = `M ${f1(x - 10 * k)} ${f1(y - 20 * k)} L ${f1(x + 12 * k)} ${y} L ${f1(x - 10 * k)} ${f1(y + 20 * k)}`;
    drawAt(g.path(D, { sw: 5, stroke: TL_(.4) }), p, Q.tI(i), tu(.3)); const l = g.path(D, { sw: 5.6, stroke: ACC1 }); on(l, p, 0, { o: [[0, 0], [f3(t - tu(.16)), 0], [f3(t - tu(.04)), 1, 'io']] }); };

  /* ================= ROUND 2 (user: "แค่เห็นรูปก็ไม่ผ่านแล้วครับ ออกแบบใหม่ทั้งหมด" → "สไตล์ของเรา อ่านวิธีวาดในไฟล์ skill แต่ออกแบบให้เหมาะสมกับขนาดนั้นๆ
     ห้าม copy reference เก่าๆ คิดใหม่ design ใหม่") — pilot: one design per size. Our own style (style.md / drawing.md): the line icons themselves,
     big and floating (no tile around them), plain words, and the skill's connector — a curved line with a chevron head that draws itself in the
     direction of the flow. Cause → effect is told by the arrows: each one sweeps from a link to the next as that link is reached, the links that
     have done their part dim (style.md: "หรี่ที่เหลือลงเหลือ 40%"), the effect is the biggest icon and lands on the keyword with its word in the accent. ================= */
  const DIMQ = (Q, i, t) => i === Q.L ? [[0, 0], [t, 0], [f3(t + tu(.14)), 1]] : [[0, 0], [t, 0], [f3(t + tu(.14)), 1], [Q.H, 1], [f3(Q.H + tu(.3)), .62, 'io']];
  /* a link as its icon, floating (w = width); a word-only link → its word big in place; an unnamed one → a small ring */
  function linkIcon(p, c, Q, i, x, y, w) { const X = Q.N[i], t = Q.tI(i);
    if (!has(X)) { const g = mvG(p, { o: DIMQ(Q, i, t) }); g.circle(x, y, f1(w * .16), { fill: C.fill, sw: 3, stroke: TL_(.55) }); return; }
    if (picOf(X)) { put(p, c, { icon: X.icon }, x, y, w, null, { t, o: DIMQ(Q, i, t), punch: Q.tF(i) }); return; }
    const sz = f1(Math.max(44, Math.min(96, w * .34))), g = mvG(p, { o: DIMQ(Q, i, t) }); txt(g, X.label, x, f1(y + sz * .36), { size: sz, maxW: f1(w * 1.3), weight: 800, color: i === Q.L ? ACC1 : C.ink, wrap: 'mid' }); }
  /* its word (only with an icon): soft for a cause (dims with it), the effect's in the accent once it lands; clamped inside the box */
  function linkWord(p, Q, i, x, y, sz, mw, anchor = 'middle') { const str = Q.LB(i); if (!str) return; const eff = i === Q.L, t = eff ? f3(Q.H + tu(.06)) : f3(Q.tI(i) + tu(.16)), w = Math.min(mw, tw(p, str, sz)), hx = BOX[0] / 2 - 12;
    const cx = anchor === 'start' ? Math.min(x, hx - w) : anchor === 'end' ? Math.max(x, -hx + w) : Math.max(-hx + w / 2, Math.min(hx - w / 2, x));
    const g = mvG(p, { o: eff ? [[0, 0], [t, 0], [f3(t + tu(.16)), 1]] : DIMQ(Q, i, t) }); txt(g, str, f1(cx), f1(y + sz * .34), { size: sz, maxW: mw, weight: 800, color: eff ? ACC1 : C.ink, anchor, wrap: 'mid' }); }
  /* the skill's connector: a curve a → b (bend = sideways pull, + bends to the left of the direction) with a chevron head at b, drawn itself in the
     direction of the flow; it reaches b exactly when link i + 1 is reached; o.k = size of the head */
  function flowArrow(p, Q, i, a, b, bend = .25, o = {}) { const L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1, mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, cx = f1(mx + (b[1] - a[1]) / L * bend * L), cy = f1(my - (b[0] - a[0]) / L * bend * L);
    const D = `M ${f1(a[0])} ${f1(a[1])} Q ${cx} ${cy} ${f1(b[0])} ${f1(b[1])}`, an = Math.atan2(b[1] - cy, b[0] - cx), hd = o.head || 22, H_ = [[b[0] - Math.cos(an - .55) * hd, b[1] - Math.sin(an - .55) * hd], [b[0], b[1]], [b[0] - Math.cos(an + .55) * hd, b[1] - Math.sin(an + .55) * hd]].map(q => q.map(f1));
    const t1 = Q.tF(i + 1), t0 = f3(Math.max(Q.tF(i) + tu(.02), t1 - tu(.42))), sw = o.sw || 4;
    drawAt(p.path(D, { sw: sw - .6, stroke: TL_(.28) }), p, f3(Q.tI(i + 1) - tu(.04)), tu(.3));
    const l = p.path(D, { sw, stroke: ACC1 }); on(l, p, 0, { draw: [[0, 0], [t0, 0], [t1, 1, 'io']] });
    const h = p.poly(H_, { sw, stroke: ACC1 }); on(h, p, 0, { o: [[0, 0], [f3(t1 - tu(.06)), 0], [t1, 1]] }); }
  /* the edge point of a circle of radius r around (x, y) toward (tx, ty) */
  const edge = (x, y, r, tx, ty) => { const d = Math.hypot(tx - x, ty - y) || 1; return [f1(x + (tx - x) / d * r), f1(y + (ty - y) / d * r)]; };
  const conn = (p, Q, i, A, B, ra, rb, bend, o) => flowArrow(p, Q, i, edge(A[0], A[1], ra, B[0], B[1]), edge(B[0], B[1], rb, A[0], A[1]), bend, o);

  /* from below a link's word (so the arrow never crosses it) */
  const below = (x, y, iw, Q, i, ws) => [x, f1(y + iw / 2 + (Q.LB(i) ? ws * 1.5 : 0) + 8)];

  /* ================= ROUND 3 (user 2026-11-25, after the round-2 pilot: "เริ่มออกแบบใหม่ได้ เอาไฟล์ที่แนบ ดูเป็น reference" + the videos of
     B01T–B05T) — the template look: rounded tiles holding the icons, plain words, thin lines that draw themselves, an edge that lights when it is
     reached, calm eased moves, the effect the biggest tile with a soft lit fill and its word in the accent. Five mechanisms, each one telling
     "this sets off that": A DOMINO (tips over onto the next) · A′ CARD "เพราะ … จึง …" (the sizes that stand) · B GROW (each link is born out of
     the one before, bigger) · C FILL (fills up, overflows into the next) · D ARROW (one big arrow carries the causes to the effect) · E RING
     (charges round, shoots a dot to the next). Laid out for each size on its own. No ripples, no dashes, no stripes; everything inside the box. ================= */
  const LONGW = 16, glyphs = s => [...String(s)].filter(ch => !/[ัิ-ฺ็-๎\s]/.test(ch)).length;
  /* lesson 18: a word longer than 16 letters with an icon → no word (the clip says it anyway) */
  const trimL = d => { if (!d) return d; const f = X => X && X.label && picOf(X) && glyphs(X.label) > LONGW ? { icon: X.icon } : X;
    return Object.assign({}, d, { items: Array.isArray(d.items) ? d.items.map(f) : d.items, end: d.end ? f(d.end) : d.end }); };
  const HB = () => [BOX[0] / 2, BOX[1] / 2], clv = (v, a, b) => Math.max(a, Math.min(b, v));
  /* user 2026-11-25: "ลดการใช้ตัวหนังสือลงหน่อย เพราะเวลา motion graphics ขึ้น เสียงของ user ณ เวลานั้นก็พูดถึงเรื่องนี้อยู่แล้ว" → the causes are
     their icons only; the effect keeps its word (the point of the line). A link with no icon still shows its word in its tile (the word is the picture).
     CAUSE_WORDS = true brings the causes' words back (every layout keeps room for them) */
  const CAUSE_WORDS = false;
  const anyW = Q => CAUSE_WORDS && Q.N.slice(0, Q.L).some((X, i) => Q.LB(i));
  /* user 2026-11-25: "พยายามอย่าจัดวางองค์ประกอบให้อยู่ฝั่งใดฝั่งหนึ่งมากเกินไป พยายาม balance ให้อยู่ตรงกลาง" — move the links (and the rects in ext,
     e.g. the effect's word) so their bounding box sits in the middle of the box; ring = the links are discs with a ring round them */
  const center = (P, ring, ext = []) => { let l = 1e9, t = 1e9, r = -1e9, b = -1e9;
    P.forEach(q => { const h = ring ? q.s / 2 + 13 : q.s / 2; l = Math.min(l, q.x - h); r = Math.max(r, q.x + h); t = Math.min(t, q.y - h); b = Math.max(b, q.y + h); });
    ext.forEach(([a, c, d, e]) => { l = Math.min(l, a); t = Math.min(t, c); r = Math.max(r, d); b = Math.max(b, e); });
    const dx = f1(-(l + r) / 2), dy = f1(-(t + b) / 2); P.forEach(q => { q.x = f1(q.x + dx); q.y = f1(q.y + dy); }); return [dx, dy]; };
  /* the rect a word takes: centred on (x, y) or starting / ending there */
  const wRect = (p, str, sz, mw, x, y, an = 'middle') => { if (!str) return null; const w = Math.min(mw, tw(p, str, sz)), l = an === 'start' ? x : an === 'end' ? x - w : x - w / 2; return [l, y - sz * .6, l + w, y + sz * .6]; };
  const spread = (n, a, b) => Array.from({ length: n }, (_, i) => f1(n > 1 ? lerp(a, b, i / (n - 1)) : (a + b) / 2));
  /* a clip with rounded corners (a tile's inside) */
  function clipRR(p, x, y, w, h, rx) { const svg = p.g.ownerSVGElement, cp = document.createElementNS(NS, 'clipPath'), r = document.createElementNS(NS, 'rect');
    cp.id = 'b12sclip' + (++CID); Object.entries({ x, y, width: w, height: h, rx, ry: rx }).forEach(([k, v]) => r.setAttribute(k, f1(v))); cp.appendChild(r);
    (svg.querySelector('defs') || svg).appendChild(cp); return sub(p, { 'clip-path': `url(#${cp.id})` }); }
  /* where the line from a box's centre toward (tx, ty) leaves the box (half sizes hw, hh) */
  const boxEdge = (x, y, hw, hh, tx, ty) => { const dx = tx - x, dy = ty - y, k = Math.min(dx ? hw / Math.abs(dx) : 1e9, dy ? hh / Math.abs(dy) : 1e9); return [f1(x + dx * k), f1(y + dy * k)]; };
  /* a cause's light is on from when it is reached until it has handed over (the next is reached), then goes; the effect's stays */
  const handK = (Q, i, tf, keep) => keep || i === Q.L ? [[0, 0], [tf, 0], [f3(tf + tu(.06)), 1]]
    : [[0, 0], [tf, 0], [f3(tf + tu(.06)), 1], [f3(Q.tF(i + 1) + tu(.12)), 1], [f3(Q.tF(i + 1) + tu(.42)), 0, 'io']];
  /* a link as a tile: rounded box (o.w × o.h, or o.s square; o.shape 'circ') with its icon, its word inside when there is no icon, faint with a dot
     when unnamed. Pops in at o.t (tI) unless o.g is given; on o.tf (tF) it bumps and its edge lights (handK); the effect gets a soft lit fill.
     o.under(q) draws inside it (a level, a ring); o.mv = keys the icon rides when the tile moves */
  function tileN(p, c, Q, i, x, y, o = {}) {
    const w = o.w ?? o.s, h = o.h ?? o.s, sh = o.shape || 'box', t = o.t ?? Q.tI(i), tf = o.tf ?? Q.tF(i), eff = i === Q.L, X = Q.N[i], nm = has(X);
    const g0 = o.g || popAt(p, x, y, t), g = o.bump === false ? g0 : mvG(g0, { px: x, py: y, s: bumpK(tf, eff ? 1.06 : 1.04) });
    const draw = (q, st) => sh === 'circ' ? q.circle(x, y, w / 2, st) : R(q, f1(x - w / 2), f1(y - h / 2), w, h, f1(o.rx ?? Math.min(w, h) * .22), st);
    draw(g, nm ? F(4) : { fill: C.fill, sw: 3, stroke: TL_(.4) }); if (o.under) o.under(g);
    if (o.lit !== false) { const L = sub(g); on(L, g, 0, { o: handK(Q, i, tf, o.keep) }); if (eff) draw(L, { fill: TA(.08), sw: 0, stroke: 'none' }); draw(L, { fill: 'none', sw: 5, stroke: ACC1 }); }
    if (!nm) { if (eff) star4(litOn(g, tf), x, y, f1(Math.min(w, h) * .2), DOTF()); else g.circle(x, y, 10, { fill: C.soft, sw: 0, stroke: 'none' }); return g; }
    if (picOf(X)) put(p, c, X, x, y, f1(Math.min(w, h) * (o.ik ?? .64)), null, { t: o.it ?? f3(t + tu(.04)), punch: o.noPunch ? undefined : tf, mv: o.mv });
    else { const sz = f1(clv(Math.min(w, h) * .3, 26, o.wsz ?? 64)); txt(g, X.label, x, f1(y + sz * .36), { size: sz, maxW: f1(w * .84), weight: 800, color: eff ? ACC1 : C.ink, wrap: 'mid' }); }
    return g; }
  /* a link's word (only with an icon) at (x, y), kept inside the box; the effect's in the accent, landing on the keyword; o.t = when */
  function wordN(p, Q, i, x, y, sz, mw, anchor = 'middle', o = {}) { const str = Q.LB(i); if (!str || (i !== Q.L && !CAUSE_WORDS)) return; const eff = i === Q.L, t = o.t ?? (eff ? f3(Q.H + tu(.06)) : f3(Q.tI(i) + tu(.16)));
    const [hx, hy] = HB(), m = 14, w0 = tw(p, str, sz), w = Math.min(mw, w0), two = w0 > mw && mw / w0 < .72;
    const cx = anchor === 'start' ? clv(x, -hx + m, hx - m - w) : anchor === 'end' ? clv(x, -hx + m + w, hx - m) : clv(x, -hx + m + w / 2, hx - m - w / 2);
    const hh = two ? sz * 1.1 : sz * .55, cy = clv(y, -hy + m + hh, hy - m - hh);
    const g = popAt(p, f1(cx), f1(cy), t); txt(g, str, f1(cx), f1(two ? cy + sz * .34 : cy + sz * .34), { size: sz, maxW: mw, weight: 800, color: eff ? ACC1 : C.ink, anchor, wrap: two ? 'mid' : null }); }
  /* a line that draws itself in (faint), and the push running along it t0 → t1 (accent, settles to half once it has handed over) */
  const baseL = (p, dd, t, w = 3.4, a = .3) => drawAt(p.path(dd, { sw: w, stroke: TL_(a) }), p, t, tu(.26));
  const pushL = (p, dd, t0, t1, w = 4.6, e = 'io') => { const g = sub(p); on(g, p, 0, { o: [[0, 1], [f3(t1 + tu(.2)), 1], [f3(t1 + tu(.5)), .45, 'io']] }); litP(g, dd, t0, t1, w, e); };
  /* a small chevron at (x, y) turned a degrees; lit when the push passes (t) */
  const chevL = (p, x, y, a, k, tIn, t) => { const g = rot(p, a, x, y), D = `M ${f1(x - 9 * k)} ${f1(y - 17 * k)} L ${f1(x + 9 * k)} ${y} L ${f1(x - 9 * k)} ${f1(y + 17 * k)}`;
    drawAt(g.path(D, { sw: 4.4, stroke: TL_(.4) }), p, tIn, tu(.24)); const l = g.path(D, { sw: 5, stroke: ACC1 }); on(l, p, 0, { o: [[0, 0], [f3(t - tu(.1)), 0], [t, 1, 'io']] }); };

  /* A · DOMINO — the causes are tall tiles standing on one line; from T0 the first tips over (faster and faster, 'in') and its top lands on the next
     exactly when that one is reached (tF(i + 1)); that one lights and tips in turn; the last lands on the effect, which lights on the keyword (it does
     not fall). D = { xs, w, h, yb (the line they stand on), E: { x, y, s } } — the effect stands on the same line, one gap after the last */
  function domino(p, c, Q, D) { const m = Q.L;
    for (let i = 0; i < m; i++) { const x = D.xs[i], nx = i + 1 < m ? D.xs[i + 1] - D.w / 2 : D.E.x - D.E.s / 2, px = f1(x + D.w / 2), th = f1(Math.asin(Math.min(.8, (nx - px) / D.h)) * 180 / Math.PI);
      const cy = f1(D.yb - D.h / 2), t0 = Q.tF(i), t1 = Q.tF(i + 1), K = { px, py: D.yb, r: [[0, 0], [t0, 0], [t1, th, 'in']] };
      tileN(p, c, Q, i, x, cy, { w: D.w, h: D.h, g: mvG(popAt(p, x, cy, Q.tI(i)), K), bump: false, mv: K, ik: .76, rx: f1(D.w * .22) }); }
    tileN(p, c, Q, m, D.E.x, D.E.y, { s: D.E.s }); }
  /* fit the dominoes into width W0: each cause .5 h wide with a .32 h gap, the effect kE·h square */
  const domFit = (m, W0, hmax, kE = 1) => { const h = Math.min(hmax, W0 / (m * .82 + kE)); return { h: f1(h), w: f1(h * .5), g: f1(h * .32), s: f1(h * kE) }; };
  /* lay the dominoes out from x0 standing on yb → { xs, E, right } */
  const domLay = (F_, m, x0, yb) => { const xs = Array.from({ length: m }, (_, i) => f1(x0 + F_.w / 2 + i * (F_.w + F_.g))), l = x0 + m * (F_.w + F_.g);
    return { xs, w: F_.w, h: F_.h, yb, E: { x: f1(l + F_.s / 2), y: f1(yb - F_.s / 2), s: F_.s }, right: l + F_.s }; };

  /* B · GROW — every link is born out of the one before: it starts small at that one's centre, slides out along the line and grows to its own place,
     arriving as it is reached (tF); each one bigger than the last, the effect the biggest. P = all links [{ x, y, s }] (the last = the effect) */
  function grow(p, c, Q, P) {
    P.forEach((d, i) => { if (!i) { tileN(p, c, Q, 0, d.x, d.y, { s: d.s }); return; }
      const a = P[i - 1], t1 = Q.tF(i), t0 = f3(Math.max(Q.tF(i - 1) + tu(.02), t1 - tu(.46))), dx = f1(a.x - d.x), dy = f1(a.y - d.y), k0 = f3(Math.min(.6, a.s * .45 / d.s));
      const A = boxEdge(a.x, a.y, a.s / 2, a.s / 2, d.x, d.y), B = boxEdge(d.x, d.y, d.s / 2, d.s / 2, a.x, a.y), ln = p.path(`M ${A[0]} ${A[1]} L ${B[0]} ${B[1]}`, { sw: 3.4, stroke: TL_(.36) });
      on(ln, p, 0, { draw: [[0, 0], [t0, 0], [t1, 1, 'io']] });
      const K = { px: d.x, py: d.y, x: [[0, dx], [t0, dx], [t1, 0, 'io']], y: [[0, dy], [t0, dy], [t1, 0, 'io']], s: [[0, k0], [t0, k0], [t1, 1, 'io']], o: [[0, 0], [t0, 0], [f3(t0 + tu(.06)), 1]] };
      tileN(p, c, Q, i, d.x, d.y, { s: d.s, g: mvG(CL(p), K), t: t0, it: t0, mv: K }); }); }
  /* when a grown link's word comes in (it arrives at tF) */
  const gwT = (Q, i) => i ? f3(Q.tF(i) + tu(.06)) : undefined;

  /* C · FILL — each link fills up from the bottom once it is reached; full, it overflows: a stream runs along the spout into the next, which starts
     filling as the stream reaches it (tF). The effect fills last and lights on the keyword. P = all links [{ x, y, s }]; S[i] = the spout i → i + 1 */
  function fillChain(p, c, Q, P, S) {
    S.forEach((dd, i) => { if (!dd) return; baseL(p, dd, f3(Q.tI(i + 1) - tu(.04))); const t1 = Q.tF(i + 1); pushL(p, dd, f3(t1 - tu(.2)), t1, 4.6, 'in'); });
    P.forEach((d, i) => { const eff = i === Q.L, a = Q.tF(i), b = eff ? f3(Q.H + tu(.45)) : f3(Q.tF(i + 1) - tu(.2)), ins = 7, hh = d.s - 2 * ins;
      tileN(p, c, Q, i, d.x, d.y, { s: d.s, under: q => { if (!has(Q.N[i])) return; const cg = clipRR(q, d.x - d.s / 2 + ins, d.y - d.s / 2 + ins, hh, hh, d.s * .22 - ins * .6);
        const lv = mvG(cg, { y: [[0, hh], [a, hh], [b, 0, eff ? 'out' : 'io']] }); R(lv, f1(d.x - d.s / 2), f1(d.y - d.s / 2), d.s, d.s, 0, { fill: TA(eff ? .13 : .09), sw: 0, stroke: 'none' }); } }); }); }
  /* the spout from link a to link b: out of a's side near its top (toward b), into b's side near its top; o.v = vertical (out of the bottom side) */
  const spout = (a, b, k = .3) => { const sd = Math.sign(b.x - a.x) || 1, ay = f1(a.y - a.s / 2 + a.s * k), by = f1(b.y - b.s / 2 + b.s * k), ax = f1(a.x + sd * a.s / 2), bx = f1(b.x - sd * b.s / 2), mx = f1((ax + bx) / 2);
    return `M ${ax} ${ay} C ${mx} ${ay} ${mx} ${by} ${bx} ${by}`; };

  /* a spout straight down: out of a's bottom, into b's top (an S when they are not in line) */
  const spoutV = (a, b) => { const ay = f1(a.y + a.s / 2), by = f1(b.y - b.s / 2), my = f1((ay + by) / 2); return `M ${a.x} ${ay} C ${a.x} ${my} ${b.x} ${my} ${b.x} ${by}`; };
  /* the biggest tile size that fits n tiles (and n − 1 gaps) into span */
  /* the biggest disc D for n discs zig-zagging ±dx/2 down span (neighbours gap apart along the slant) → { D, v (the step down) } */
  const fitZ = (n, span, dx, gap, dmax) => { for (let D = dmax; D > 30; D -= 2) { const v = Math.max(D * .62, Math.sqrt(Math.max(0, (D + gap) ** 2 - dx * dx))); if ((n - 1) * v + D <= span) return { D, v: f1(v) }; } return { D: 30, v: 30 }; };
  const fitS = (n, span, gap, smax) => f1(Math.min(smax, (span - gap * (n - 1)) / Math.max(1, n)));
  /* E · RING — round links; once reached a link's ring charges (draws itself round from the top); full → a dot shoots along the line to the next,
     arriving as that one is reached (tF). The effect's ring closes on the keyword and it lights. P = all links [{ x, y, s }] (s = the disc);
     the lines run ring edge to ring edge (o.bend = a curve) */
  const ringR = d => f1(d.s / 2 + 13);
  function ringChain(p, c, Q, P, o = {}) {
    P.forEach((d, i) => { if (i + 1 >= P.length) return; const b = P[i + 1], A = edge(d.x, d.y, ringR(d) + 8, b.x, b.y), B = edge(b.x, b.y, ringR(b) + 8, d.x, d.y), bd = (o.bend && o.bend[i]) || 0;
      const L = Math.hypot(B[0] - A[0], B[1] - A[1]) || 1, cx = (A[0] + B[0]) / 2 + (B[1] - A[1]) / L * bd * L, cy = (A[1] + B[1]) / 2 - (B[0] - A[0]) / L * bd * L, pts = bd ? qP(A, [cx, cy], B, 18) : [A, B];
      baseL(p, pathOf(pts, false), f3(Q.tI(i + 1) - tu(.04)), 3); const t1 = Q.tF(i + 1); orb(p, pts, f3(t1 - tu(.24)), t1, 9); });
    P.forEach((d, i) => { const eff = i === Q.L, R0 = ringR(d), a = Q.tF(i), b = eff ? f3(Q.H + tu(.3)) : f3(Q.tF(i + 1) - tu(.26));
      tileN(p, c, Q, i, d.x, d.y, { s: d.s, shape: 'circ', lit: eff, ik: .6, under: q => { q.circle(d.x, d.y, R0, { sw: 3, stroke: TL_(.22) });
        const ar = q.path(arcD(d.x, d.y, R0, 1), { sw: 5, stroke: ACC1 }); on(ar, q, 0, { draw: [[0, 0], [a, 0], [b, 1, 'io']] }); } }); }); }

  /* D · ARROW — one big hollow arrow carries the causes (their icons ride in the shaft, their words outside it) and points at the effect. From T0 the
     shaft fills from the tail; each cause bumps as the fill reaches it (tF); the fill reaches the head and the effect lands, lit, on the keyword.
     A = { d: centre line (path d), w: shaft width, hw: head half-width, hl: head length, iw: icon width, at: [fractions], wd: (i, pt, n) → word } */
  function bigArrow(p, c, Q, A) { const m = Q.L, t = tu(.04), dd = A.d, el = p.path(dd, { sw: A.w }), Lt = el.getTotalLength(), P = u => { const q = el.getPointAtLength(Lt * u); return [f1(q.x), f1(q.y)]; };
    /* flat ends (a round cap poked out under the head as an arc) + a round tail drawn on its own */
    const s0 = P(0), s1 = P(Math.min(1, 3 / Lt)), sl = Math.hypot(s1[0] - s0[0], s1[1] - s0[1]) || 1, tx = (s1[0] - s0[0]) / sl, ty = (s1[1] - s0[1]) / sl, r2 = A.w / 2 - 1.75;
    const ta = [f1(s0[0] - ty * r2), f1(s0[1] + tx * r2)], tb = [f1(s0[0] + ty * r2), f1(s0[1] - tx * r2)], tm = [f1(s0[0] - tx * r2), f1(s0[1] - ty * r2)];
    const ri = A.w / 2 - 3.5, Tp = (u, s) => [f1(s0[0] + tx * u - ty * s), f1(s0[1] + ty * u + tx * s)], tailD = r => { const a = Tp(0, r), m_ = Tp(-r, 0), b = Tp(0, -r), a2 = Tp(8, r), b2 = Tp(8, -r);
      return `M ${a2[0]} ${a2[1]} L ${a[0]} ${a[1]} A ${f1(r)} ${f1(r)} 0 0 1 ${m_[0]} ${m_[1]} A ${f1(r)} ${f1(r)} 0 0 1 ${b[0]} ${b[1]} L ${b2[0]} ${b2[1]} Z`; };
    const tailF = p.path(tailD(ri + .5), { fill: C.fill, sw: 0, stroke: 'none' }); on(tailF, p, 0, { o: [[0, 0], [t, 0], [f3(t + tu(.1)), 1]] });
    const tail = p.path(`M ${ta[0]} ${ta[1]} A ${f1(r2)} ${f1(r2)} 0 0 1 ${tm[0]} ${tm[1]} A ${f1(r2)} ${f1(r2)} 0 0 1 ${tb[0]} ${tb[1]}`, { sw: 3.5 }); drawAt(tail, p, t, tu(.2));
    const inn = p.path(dd, { sw: A.w - 7, stroke: C.fill }); [el, inn].forEach(e => e.setAttribute('stroke-linecap', 'butt')); drawAt(el, p, t, tu(.42)); drawAt(inn, p, t, tu(.42));
    const end = P(1), pre = P(Math.max(0, 1 - 3 / Lt)), ul = Math.hypot(end[0] - pre[0], end[1] - pre[1]) || 1, dx = (end[0] - pre[0]) / ul, dy = (end[1] - pre[1]) / ul, nx = -dy, ny = dx;
    const at = A.atL ? A.atL.map(v => clv(v / Lt, 0, .98)) : A.at || Array.from({ length: m }, (_, i) => (i + .5) / m), fr = [];
    const nAt = u => { const a = P(Math.max(0, u - 2 / Lt)), b = P(Math.min(1, u + 2 / Lt)), l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1; return [-(b[1] - a[1]) / l, (b[0] - a[0]) / l]; };
    /* the soft fill of shaft, tail and head is one layer: drawn solid, the group faded (overlapping pieces no longer leave a hairline where they meet — user: "หัวลูกศรมันยังมีรอยต่อบางๆอยู่") */
    const lg = sub(p); lg.g.setAttribute('opacity', '0.1'); const sw = lg.path(dd + ' ', { sw: A.w - 7, stroke: ACC1 }); sw.setAttribute('stroke-linecap', 'butt'); const K = [[0, 0], [f3(Q.tF(0) - tu(.3)), 0]]; at.forEach((u, i) => K.push([Q.tF(i), f3(u), 'io'])); K.push([f3(Q.H - tu(.06)), 1, 'io']); on(sw, p, 0, { draw: K });
    const tf = lg.path(tailD(ri), { fill: ACC1, sw: 0, stroke: 'none' }); on(tf, p, 0, { o: [[0, 0], [K[1][0], 0], [f3(K[1][0] + tu(.08)), 1]] });
    const pt = (u, s) => [f1(end[0] + dx * u + nx * s), f1(end[1] + dy * u + ny * s)], tip = pt(A.hl, 0), c1 = pt(0, A.hw), c2 = pt(0, -A.hw), e1 = pt(0, A.w / 2), e2 = pt(0, -A.w / 2);
    const hs = (A.w - 7) / 2, io = A.w / 2 - 3.5, b1 = pt(-8, io), b2 = pt(-8, -io), a1 = pt(0, io), a2 = pt(0, -io), f1_ = pt(-8, hs), f2_ = pt(-8, -hs), g1 = pt(0, hs), g2 = pt(0, -hs);
    const hg = atG(p, f3(t + tu(.36))); shape(hg, [b1, a1, c1, tip, c2, a2, b2], { fill: C.fill, sw: 0, stroke: 'none' }); hg.path(pathOf([e1, c1, tip, c2, e2], false), { sw: 3.5 }); lg.g.parentNode.appendChild(lg.g);   /* the soft fill over the head's dark base */
    shape(litOn(lg, f3(Q.H - tu(.06))), [f1_, g1, c1, tip, c2, g2, f2_], { fill: ACC1, sw: 0, stroke: 'none' }); const hl = litOn(p, f3(Q.H - tu(.06))); hl.path(pathOf([e1, c1, tip, c2, e2], false), { sw: 5, stroke: ACC1 });
    at.forEach((u, i) => { const [x, y] = P(u), X = Q.N[i], n = nAt(u); fr.push([x, y]);
      if (!has(X)) { popAt(p, x, y, Q.tI(i)).circle(x, y, 12, { fill: C.soft, sw: 0, stroke: 'none' }); }
      else if (picOf(X)) put(p, c, X, x, y, A.iw, null, { t: Q.tI(i), punch: Q.tF(i) });
      else { const sz = f1(clv(A.w * .3, 26, 60)); txt(popAt(p, x, y, Q.tI(i)), X.label, x, f1(y + sz * .36), { size: sz, maxW: f1(Math.min(A.w * 1.3, A.seg || 1e9)), weight: 800, color: C.ink, wrap: 'mid' }); }
      if (A.wd) A.wd(i, [x, y], n); });
    return { tip, P, n: [nx, ny], dir: [dx, dy] }; }

  /* A′ · CARD — "เพราะ … จึง …": one card fills the box; the causes along its top in small tiles with chevrons between (each lights in turn, the chevron
     after it as the push passes), a divider with a round badge holding a down arrow that nods when the last cause hands over, and the effect big in
     the lower part, landing lit on the keyword. K = { row: { y, s, xs }, ws (word size), split, E: { x, y, s }, ew: (p) → the effect's word } */
  function card2(p, c, Q, K) { const [hx, hy] = HB(), m = Q.L, l = -hx + 8, tp = -hy + 8, W0 = BOX[0] - 16, H0 = BOX[1] - 16;
    const cg = mvG(CL(p), rK(0, 0, tu(.02), 40)); R(cg, l, tp, W0, H0, Math.min(40, W0 * .08), F(3.6));
    const rows = K.rows || [K.row];
    let k = 0; rows.forEach(rw => rw.xs.forEach((x, j) => { const i = k++; if (i >= m) return; tileN(p, c, Q, i, x, rw.y, { s: rw.s });
      if (K.ws) wordN(p, Q, i, x, f1(rw.y + rw.s / 2 + K.ws * .9), K.ws, f1(K.wm || rw.s + 30));
      if (j + 1 < rw.xs.length && i + 1 < m) chevL(p, f1((x + rw.xs[j + 1]) / 2), rw.y, 0, K.ck || .8, f3(Q.tI(i + 1) - tu(.04)), Q.tF(i + 1)); }));
    /* the divider: across (K.split = its y, the badge points down) or, in the wide sizes, upright (K.sx = its x, the badge points right) */
    const vt = K.sx != null, sy = vt ? (K.by ?? 0) : K.split, bx = vt ? K.sx : 0, br = K.br || 30, tN = f3(Q.H - tu(.24)), nod = [[0, 0], [tN, 0], [f3(tN + tu(.1)), 8, 'out'], [f3(tN + tu(.26)), 0, 'soft']];
    if (vt) [[tp + 24, sy - br - 14], [sy + br + 14, tp + H0 - 24]].forEach(([a, b]) => drawAt(p.line(bx, a, bx, b, { sw: 2.4, stroke: TL_(.4) }), p, tu(.2), tu(.3)));
    else [[l + 28, bx - br - 14], [bx + br + 14, l + W0 - 28]].forEach(([a, b]) => drawAt(p.line(a, sy, b, sy, { sw: 2.4, stroke: TL_(.4) }), p, tu(.2), tu(.3)));
    const bg = mvG(popAt(p, bx, sy, tu(.24)), vt ? { x: nod } : { y: nod }); bg.circle(bx, sy, br, F(3.4));
    const ar = vt ? `M ${f1(bx - br * .45)} ${sy} L ${f1(bx + br * .45)} ${sy} M ${f1(bx + br * .1)} ${f1(sy - br * .36)} L ${f1(bx + br * .48)} ${sy} L ${f1(bx + br * .1)} ${f1(sy + br * .36)}`
      : `M ${bx} ${f1(sy - br * .45)} L ${bx} ${f1(sy + br * .45)} M ${f1(bx - br * .36)} ${f1(sy + br * .1)} L ${bx} ${f1(sy + br * .48)} L ${f1(bx + br * .36)} ${f1(sy + br * .1)}`;
    bg.path(ar, { sw: 4 }); const lt = litOn(bg, tN); lt.circle(bx, sy, br, { fill: TA(.14), sw: 5, stroke: ACC1 }); lt.path(ar, { sw: 4.6, stroke: ACC1 });
    tileN(p, c, Q, m, K.E.x, K.E.y, { s: K.E.s }); if (K.ew) K.ew(p); }

  /* ---------- the designs, one size at a time ---------- */
  const WS = [0, 30, 36, 32, 30, 44, 46, 28], ES = [0, 56, 56, 52, 48, 66, 72, 44];

  /* ===== 1 · 860 × 230 — a flat strip: everything in one line, read left → right ===== */
  sd(1, 'card', 'การ์ด เพราะ → จึง', (d, c) => { const Q = CQ(d), m = Q.L, es = Q.LB(m);
    art(c, p => { const SE = 150, ew = es ? Math.min(220, tw(p, es, ES[1])) : 0, rw = SE + (es ? 22 + ew : 0), sx = f1(422 - 34 - rw - 46), lw = sx - 46 - (-422 + 30), gx = m > 1 ? f1(Math.min(170, lw / m)) : 0;
      const s = f1(Math.min(130, m > 1 ? gx - 44 : 150)), cx0 = f1((-422 + 30 + sx - 46) / 2), E = { x: f1(sx + 46 + SE / 2), y: 0, s: SE };
      card2(p, c, Q, { rows: [{ y: 0, s, xs: spread(m, cx0 - gx * (m - 1) / 2, cx0 + gx * (m - 1) / 2) }], sx, br: 28, E, ck: .7, ew: q => { if (es) wordN(q, Q, m, f1(E.x + SE / 2 + 22), 0, ES[1], ew + 30, 'start'); } }); }); });
  sd(1, 'grow', 'แตกออกมา ใหญ่ขึ้นทีละทอด', (d, c) => { const Q = CQ(d), m = Q.L, es = Q.LB(m), cw = anyW(Q);
    art(c, p => { const ew = es ? Math.min(220, tw(p, es, ES[1])) : 0, ss = spread(m, cw ? 96 : 108, cw ? 140 : 156), gp = 52;
      let SE = cw ? 176 : 196, sum = ss.reduce((a, v) => a + v, 0) + SE, room = 820 - gp * m - (es ? ew + 24 : 0), k = Math.min(1, room / sum);
      const S2 = ss.map(v => f1(v * k)); SE = f1(SE * k); const tot = S2.reduce((a, v) => a + v, 0) + gp * m + SE + (es ? ew + 24 : 0); let x = -tot / 2;
      const yc = cw ? -18 : 0, P = S2.map(s => { const o = { x: f1(x + s / 2), y: yc, s }; x += s + gp; return o; }); P.push({ x: f1(x + SE / 2), y: 0, s: SE }); grow(p, c, Q, P);
      P.slice(0, m).forEach((q, i) => wordN(p, Q, i, q.x, f1(q.y + q.s / 2 + 26), WS[1], q.s + gp - 6, 'middle', { t: gwT(Q, i) }));
      if (es) wordN(p, Q, m, f1(P[m].x + SE / 2 + 24), 0, ES[1], ew + 30, 'start'); }); });
  sd(1, 'fill', 'เติมจนล้นไปทอดถัดไป', (d, c) => { const Q = CQ(d), m = Q.L, es = Q.LB(m), cw = anyW(Q);
    art(c, p => { const ew = es ? Math.min(220, tw(p, es, ES[1])) : 0, gp = 70; let s = cw ? 128 : 150, SE = cw ? 172 : 190;
      const room = 820 - gp * m - (es ? ew + 24 : 0), k = Math.min(1, room / (s * m + SE)); s = f1(s * k); SE = f1(SE * k);
      const tot = s * m + gp * m + SE + (es ? ew + 24 : 0), x0 = -tot / 2, yc = cw ? -16 : 0, P = Array.from({ length: m }, (_, i) => ({ x: f1(x0 + s / 2 + i * (s + gp)), y: f1(yc - (m > 1 ? 10 - 20 * i / (m - 1) : 0)), s }));
      P.push({ x: f1(x0 + m * (s + gp) + SE / 2), y: f1(cw ? 0 : 0), s: SE }); fillChain(p, c, Q, P, P.slice(0, m).map((a, i) => spout(a, P[i + 1])));
      P.slice(0, m).forEach((q, i) => wordN(p, Q, i, q.x, f1(q.y + q.s / 2 + 26), WS[1], s + gp - 6));
      if (es) wordN(p, Q, m, f1(P[m].x + SE / 2 + 24), 0, ES[1], ew + 30, 'start'); }); });
  sd(1, 'arrow', 'ลูกศรพาไปสู่ผล', (d, c) => { const Q = CQ(d), m = Q.L, es = Q.LB(m), cw = anyW(Q);
    art(c, p => { const ew = es ? Math.min(210, tw(p, es, ES[1])) : 0, SE = cw ? 160 : 178, y = cw ? -22 : 0, w = cw ? 116 : 140, hl = 62, x0 = -408;
      const xe = f1(410 - (es ? ew + 24 : 0) - SE - 24 - hl), seg = (xe - x0) / m;
      const A = bigArrow(p, c, Q, { d: `M ${x0 + w / 2} ${y} L ${xe} ${y}`, w, hw: f1(w / 2 + 26), hl, iw: f1(Math.min(w * .66, seg * .7)), seg, at: Array.from({ length: m }, (_, i) => (x0 + seg * (i + .5) - x0 - w / 2) / (xe - x0 - w / 2)),
        wd: (i, [x, yy]) => wordN(p, Q, i, x, f1(yy + w / 2 + 28), WS[1], f1(seg - 8)) });
      const E = { x: f1(A.tip[0] + 24 + SE / 2), y, s: SE }; tileN(p, c, Q, m, E.x, E.y, { s: SE }); if (es) wordN(p, Q, m, f1(E.x + SE / 2 + 24), y, ES[1], ew + 30, 'start'); }); });
  sd(1, 'ring', 'ชาร์จเต็มแล้วส่งต่อ', (d, c) => { const Q = CQ(d), m = Q.L, es = Q.LB(m), cw = anyW(Q);
    art(c, p => { const ew = es ? Math.min(220, tw(p, es, ES[1])) : 0, gp = 64; let s = cw ? 112 : 132, SE = cw ? 160 : 176;
      const room = 820 - gp * m - (es ? ew + 24 : 0) - 26 * (m + 1), k = Math.min(1, room / (s * m + SE)); s = f1(s * k); SE = f1(SE * k);
      const tot = (s + 26) * m + gp * m + SE + 26 + (es ? ew + 24 : 0), x0 = -tot / 2, yc = cw ? -18 : 0, P = Array.from({ length: m }, (_, i) => ({ x: f1(x0 + 13 + s / 2 + i * (s + 26 + gp)), y: yc, s }));
      P.push({ x: f1(x0 + m * (s + 26 + gp) + 13 + SE / 2), y: 0, s: SE }); ringChain(p, c, Q, P);
      P.slice(0, m).forEach((q, i) => wordN(p, Q, i, q.x, f1(q.y + ringR(q) + 24), WS[1], s + gp + 12));
      if (es) wordN(p, Q, m, f1(P[m].x + ringR(P[m]) + 22), 0, ES[1], ew + 30, 'start'); }); });

  /* links on a diagonal: the causes (sizes ss) from the first centre A toward the effect E, the last one `gap` clear of it in x and at the share
     ky of the way in y → all links */
  const diag = (ss, A, E, gap, ky) => { const m = ss.length, ex = f1(E.x - Math.sign(E.x - A[0]) * (E.s / 2 + gap + ss[m - 1] / 2)), ey = f1(lerp(A[1], E.y, ky));
    const xs = m > 1 ? spread(m, A[0], ex) : [f1((A[0] + ex) / 2)], ys = m > 1 ? spread(m, A[1], ey) : [f1((A[1] + ey) / 2)]; return xs.map((x, i) => ({ x, y: ys[i], s: ss[i] })).concat([E]); };
  /* a word beside an arrow's shaft on the side n points to (off = from the centre line) */
  const sideW = (p, Q, i, [x, y], n, off, sz, mw) => n[0] > .6 ? wordN(p, Q, i, f1(x + n[0] * off), f1(y + n[1] * off), sz, mw, 'start')
    : n[0] < -.6 ? wordN(p, Q, i, f1(x + n[0] * off), f1(y + n[1] * off), sz, mw, 'end') : wordN(p, Q, i, f1(x + n[0] * off), f1(y + n[1] * (off + sz * .6)), sz, mw);

  /* a straight arrow from A0 into the effect E (its head stops `gap` short of E's edge) → the arrow's centre line */
  const toward = (A0, E, hl, gap = 26) => { const dx = E.x - A0[0], dy = E.y - A0[1], dl = Math.hypot(dx, dy), ux = dx / dl, uy = dy / dl, back = E.s / 2 * Math.min(1 / Math.abs(ux || 1e-6), 1 / Math.abs(uy || 1e-6)) + gap + hl;
    const B = [f1(E.x - ux * back), f1(E.y - uy * back)]; return { d: `M ${f1(A0[0])} ${f1(A0[1])} L ${B[0]} ${B[1]}`, L: Math.hypot(B[0] - A0[0], B[1] - A0[1]) }; };
  /* ===== 2 · 860 × 470 — wide: room for big tiles and words under them ===== */
  sd(2, 'card', 'การ์ด เพราะ → จึง', (d, c) => { const Q = CQ(d), m = Q.L, es = Q.LB(m);
    art(c, p => { const SE = es ? 240 : 270, sx = f1(422 - 36 - SE - 50), lw = sx - 50 - (-422 + 34), gx = m > 1 ? f1(Math.min(220, lw / m)) : 0;
      const s = f1(Math.min(176, m > 1 ? gx - 52 : 200)), cx0 = f1((-422 + 34 + sx - 50) / 2), E = { x: f1(sx + 50 + SE / 2), y: es ? -34 : 0, s: SE };
      card2(p, c, Q, { rows: [{ y: 0, s, xs: spread(m, cx0 - gx * (m - 1) / 2, cx0 + gx * (m - 1) / 2) }], sx, br: 34, E, ck: .9, ew: q => { if (es) wordN(q, Q, m, E.x, f1(E.y + SE / 2 + 40), ES[2], SE + 60); } }); }); });
  sd(2, 'grow', 'แตกออกมา ไต่ขึ้นสู่ผล', (d, c) => { const Q = CQ(d), m = Q.L, es = Q.LB(m), cw = anyW(Q);
    art(c, p => { const big = Q.n > 3, SE = big ? 230 : es ? 250 : 280, E = { x: f1(410 - SE / 2), y: f1(-230 + SE / 2 + (es ? 0 : 20)), s: SE }, ss = spread(m, big ? 110 : 150, big ? 140 : 190);
      const P = diag(ss, [-410 + ss[0] / 2, f1(230 - ss[0] / 2 - (cw ? 52 : 8))], E, 50, .8); center(P, false, es ? [wRect(p, es, ES[2], 400, E.x, E.y + SE / 2 + 40)] : []); grow(p, c, Q, P);
      P.slice(0, m).forEach((q, i) => wordN(p, Q, i, q.x, f1(q.y + q.s / 2 + 30), WS[2], f1(q.s + 40), 'middle', { t: gwT(Q, i) }));
      if (es) wordN(p, Q, m, E.x, f1(E.y + SE / 2 + 40), ES[2], 400); }); });
  sd(2, 'fill', 'เติมจนล้น ไหลลงขั้นถัดไป', (d, c) => { const Q = CQ(d), m = Q.L, es = Q.LB(m);
    art(c, p => { const big = Q.n > 3, SE = big ? 220 : 240, E = { x: f1(410 - SE / 2), y: f1(230 - SE / 2 - 4), s: SE }, s = big ? 120 : 150;
      const P = diag(Array(m).fill(s), [-410 + s / 2, -230 + s / 2 + 4], E, 50, .72); center(P, false, es ? [wRect(p, es, ES[2], 300, E.x, E.y - SE / 2 - 34)] : []); fillChain(p, c, Q, P, P.slice(0, m).map((a, i) => spout(a, P[i + 1])));
      P.slice(0, m).forEach((q, i) => wordN(p, Q, i, q.x, f1(q.y + s / 2 + 30), WS[2], s + 24));
      if (es) wordN(p, Q, m, E.x, f1(E.y - SE / 2 - 34), ES[2], 300); }); });
  sd(2, 'arrow', 'ลูกศรพาไปสู่ผล', (d, c) => { const Q = CQ(d), m = Q.L, es = Q.LB(m), cw = anyW(Q);
    art(c, p => { const SE = Q.n > 3 ? 206 : 230, y = cw ? -40 : 0, w = 200, hl = 90, x0 = -410, E = { x: f1(408 - SE / 2), y: es ? -36 : y, s: SE }, xe = f1(E.x - SE / 2 - 26 - hl), L0 = xe - x0 - w / 2;
      const atL = m > 1 ? spread(m, 8, L0 - 70) : [L0 * .4], sp = m > 1 ? atL[1] - atL[0] : 300;
      bigArrow(p, c, Q, { d: `M ${x0 + w / 2} ${y} L ${xe} ${y}`, w, hw: 140, hl, iw: f1(Math.min(124, sp * .72)), seg: sp, atL, wd: (i, [x, yy]) => wordN(p, Q, i, x, f1(yy + w / 2 + 34), WS[2], f1(sp - 6)) });
      tileN(p, c, Q, m, E.x, E.y, { s: SE }); if (es) wordN(p, Q, m, E.x, f1(E.y + SE / 2 + 40), ES[2], 400); }); });
  sd(2, 'ring', 'ชาร์จเต็มแล้วส่งต่อ เป็นคลื่น', (d, c) => { const Q = CQ(d), m = Q.L, es = Q.LB(m), cw = anyW(Q);
    art(c, p => { const big = Q.n > 3, SE = es ? 236 : 260, E = { x: 0, y: es ? -40 : 0, s: SE }; E.x = f1(410 - ringR(E)); const s = big ? 120 : 150, rr = s / 2 + 13, dv = m > 1 ? (cw ? 76 : 84) : 0;
      const xs = spread(m, -410 + rr, E.x - ringR(E) - 50 - rr), P = xs.map((x, i) => ({ x, y: i % 2 ? dv : -dv, s })); P.push(E); center(P, true, es ? [wRect(p, es, ES[2], 400, E.x, E.y + ringR(E) + 32)] : []); ringChain(p, c, Q, P, { bend: P.map((q, i) => i % 2 ? .14 : -.14) });
      P.slice(0, m).forEach((q, i) => wordN(p, Q, i, q.x, f1(i % 2 || m === 1 ? q.y + rr + 30 : q.y - rr - 26), WS[2], m > 1 ? f1(Math.min(260, (xs[1] - xs[0]) * 1.5)) : 300));
      if (es) wordN(p, Q, m, E.x, f1(E.y + ringR(E) + 32), ES[2], 400); }); });

  /* ===== 3 · 560 × 490 — nearly square ===== */
  sd(3, 'card', 'การ์ด เพราะ → จึง', (d, c) => { const Q = CQ(d), m = Q.L, es = Q.LB(m), cw = anyW(Q);
    art(c, p => { const s = m > 3 ? 92 : m === 3 ? 118 : m === 2 ? 136 : 150, gx = m > 3 ? 140 : m === 3 ? 170 : 200, y1 = f1(-245 + 24 + s / 2 + 8);
      const rows = [{ y: y1, s, xs: spread(m, -gx * (m - 1) / 2, gx * (m - 1) / 2) }], wy = cw ? WS[3] * 1.6 : 0, sy = f1(y1 + s / 2 + wy + 28), room = 237 - sy;
      const E = { x: 0, y: f1(sy + room / 2 + 8), s: f1(Math.min(es ? 180 : 200, room - 40)) }; if (es) E.x = f1(-(E.s + 26 + Math.min(230, tw(p, es, ES[3]))) / 2 + E.s / 2);
      card2(p, c, Q, { rows, ws: WS[3], wm: f1(gx - 8), split: sy, E, ck: m > 3 ? .6 : .8, ew: q => { if (es) wordN(q, Q, m, f1(E.x + E.s / 2 + 26), E.y, ES[3], 230, 'start'); } }); }); });
  sd(3, 'grow', 'แตกออกมา เลี้ยวลงเป็นผลใหญ่', (d, c) => { const Q = CQ(d), m = Q.L, es = Q.LB(m), cw = anyW(Q);
    art(c, p => { const big = m > 3, ss = spread(m, big ? 78 : 96, big ? 100 : 128), gp = big ? 34 : 44, tot = ss.reduce((a, v) => a + v, 0) + gp * (m - 1), k = Math.min(1, 524 / tot), S2 = ss.map(v => f1(v * k));
      let x = -(S2.reduce((a, v) => a + v, 0) + gp * (m - 1)) / 2; const top = -235 + S2[m - 1] / 2, P = S2.map(s => { const o = { x: f1(x + s / 2), y: f1(top + (S2[m - 1] - s) / 2), s }; x += s + gp; return o; });
      const wy = cw ? 52 : 0, SE = f1(Math.min(es ? 200 : 220, 470 - S2[m - 1] - wy - 50)), E = { x: es ? f1(-(SE + 24 + Math.min(250, tw(p, es, ES[3]))) / 2 + SE / 2) : 0, y: f1(235 - SE / 2 - 4), s: SE };
      P.push(E); grow(p, c, Q, P); P.slice(0, m).forEach((q, i) => wordN(p, Q, i, q.x, f1(q.y + q.s / 2 + 26), WS[3], f1(q.s + gp - 6), 'middle', { t: gwT(Q, i) }));
      if (es) wordN(p, Q, m, f1(E.x + SE / 2 + 24), E.y, ES[3], 250, 'start'); }); });
  sd(3, 'fill', 'เติมจนล้น ไหลลงเป็นขั้น', (d, c) => { const Q = CQ(d), m = Q.L, es = Q.LB(m);
    art(c, p => { const big = Q.n > 3, SE = big ? 180 : 200, E = { x: f1(266 - SE / 2), y: f1(235 - SE / 2 - 4), s: SE }, s = big ? 96 : 116;
      const P = diag(Array(m).fill(s), [-266 + s / 2, -235 + s / 2 + 4], E, 40, .7); center(P, false, es ? [wRect(p, es, ES[3], 250, E.x - SE / 2 - 22, E.y + SE / 2 - 30, 'end')] : []);
      fillChain(p, c, Q, P, P.slice(0, m).map((q, i) => spout(q, P[i + 1])));
      if (es) wordN(p, Q, m, f1(E.x - SE / 2 - 22), f1(E.y + SE / 2 - 30), ES[3], 250, 'end'); }); });
  sd(3, 'arrow', 'ลูกศรเฉียงลงสู่ผล', (d, c) => { const Q = CQ(d), m = Q.L, es = Q.LB(m);
    art(c, p => { const w = 136, SE = es ? 176 : 196, E = { x: f1(266 - SE / 2), y: f1(235 - SE / 2 - 4), s: SE }, hl = 60, A = toward([-266 + w / 2, -235 + w / 2 + 4], E, hl);
      const atL = m > 1 ? spread(m, 30, A.L - 50) : [A.L * .4], sp = m > 1 ? atL[1] - atL[0] : 200;
      bigArrow(p, c, Q, { d: A.d, w, hw: 98, hl, iw: f1(Math.min(88, sp * .66)), seg: sp, atL });
      tileN(p, c, Q, m, E.x, E.y, { s: SE }); if (es) wordN(p, Q, m, f1(E.x - SE / 2 - 22), f1(E.y + SE / 2 - 30), ES[3], 250, 'end'); }); });
  sd(3, 'ring', 'ชาร์จต่อกันเป็นวงโค้ง', (d, c) => { const Q = CQ(d), m = Q.L, es = Q.LB(m), cw = anyW(Q);
    art(c, p => { const s = m > 3 ? 80 : 100, rr = s / 2 + 13, SE = es ? 166 : 190, E = { x: 0, y: f1(235 - (SE / 2 + 13) - (es ? 64 : 4)), s: SE }, topY = -235 + rr + 4;
      const ang = m === 1 ? [270] : m === 2 ? [236, 304] : spread(m, 200, 340), rx = 266 - rr, ry = E.y - topY, P = ang.map(a => ({ x: f1(rx * Math.cos(rad(a))), y: f1(E.y + ry * Math.sin(rad(a))), s }));
      P.push(E); ringChain(p, c, Q, P, { bend: P.map((q, i) => i + 2 === P.length ? .16 : -.12) });
      P.slice(0, m).forEach((q, i) => wordN(p, Q, i, q.x, f1(q.y + rr + 24), WS[3], 150));
      if (es) wordN(p, Q, m, E.x, f1(E.y + ringR(E) + 30), ES[3], 360); }); });

  /* ===== 4 · 400 × 635 — tall and narrow: read top → bottom ===== */
  sd(4, 'card', 'การ์ด เพราะ → จึง', (d, c) => { const Q = CQ(d), m = Q.L, es = Q.LB(m), cw = anyW(Q);
    art(c, p => { const two = m > 3, s = two ? 96 : m === 3 ? 92 : 112, gx = m > 1 ? (two ? 130 : m === 3 ? 122 : 150) : 0, y1 = f1(-317 + 26 + s / 2 + 8);
      const wy = cw ? WS[4] * 1.7 : 0, rows = two ? [{ y: y1, s, xs: [-65, 65] }, { y: f1(y1 + s + wy + 26), s, xs: [-65, 65] }] : [{ y: y1, s, xs: spread(m, -gx * (m - 1) / 2, gx * (m - 1) / 2) }];
      const lastY = rows[rows.length - 1].y, sy = f1(lastY + s / 2 + wy + 28), room = 309 - sy - (es ? ES[4] + 30 : 0), E = { x: 0, y: f1(sy + 30 + (room - 30) / 2), s: f1(Math.min(240, room - 50)) };
      card2(p, c, Q, { rows, ws: WS[4], wm: two ? 124 : f1(gx - 6), split: sy, E, ck: .62, ew: q => { if (es) wordN(q, Q, m, 0, f1(E.y + E.s / 2 + 36), ES[4], 340); } }); }); });
  sd(4, 'grow', 'แตกออกมา ลงมาเป็นผลใหญ่', (d, c) => { const Q = CQ(d), m = Q.L, es = Q.LB(m);
    art(c, p => { const SE = m > 2 ? 210 : 240, E = { x: 0, y: f1(310 - SE / 2 - (es ? 72 : 8)), s: SE }, span = E.y - SE / 2 - 30 + 310, k = fitS(m, span, 26, 112), ss = spread(m, f1(k * .82), f1(Math.min(k * 1.12, 124)));
      const fit = Math.min(1, (span - 26 * (m - 1)) / ss.reduce((a, v) => a + v, 0)), S2 = ss.map(v => f1(v * fit)); let y = -310;
      const P = S2.map((s, i) => { const o = { x: m > 1 ? (i % 2 ? 72 : -72) : 0, y: f1(y + s / 2), s }; y += s + 26; return o; }); P.push(E); grow(p, c, Q, P);
      P.slice(0, m).forEach((q, i) => wordN(p, Q, i, f1(q.x + q.s / 2 + 16), q.y, WS[4], f1(186 - 16 - (q.x + q.s / 2 + 16) + 186), 'start', { t: gwT(Q, i) }));
      if (es) wordN(p, Q, m, 0, f1(E.y + SE / 2 + 36), ES[4], 360); }); });
  sd(4, 'fill', 'เติมจนล้น ไหลซิกแซกลง', (d, c) => { const Q = CQ(d), m = Q.L, es = Q.LB(m);
    art(c, p => { const SE = m > 2 ? 200 : 230, E = { x: 0, y: f1(310 - SE / 2 - (es ? 72 : 6)), s: SE }, s = fitS(m, E.y - SE / 2 - 30 + 306, 30, 112);
      const ys = spread(m, -306 + s / 2, E.y - SE / 2 - 30 - s / 2), P = ys.map((y, i) => ({ x: m > 1 ? (i % 2 ? 100 : -100) : 0, y, s })); P.push(E);
      fillChain(p, c, Q, P, P.slice(0, m).map((a, i) => spoutV(a, P[i + 1])));
      P.slice(0, m).forEach((q, i) => q.x <= 0 ? wordN(p, Q, i, f1(q.x + s / 2 + 14), q.y, WS[4], f1(186 - (q.x + s / 2 + 14)), 'start') : wordN(p, Q, i, f1(q.x - s / 2 - 14), q.y, WS[4], f1(q.x - s / 2 - 14 + 186), 'end'));
      if (es) wordN(p, Q, m, 0, f1(E.y + SE / 2 + 34), ES[4], 360); }); });
  sd(4, 'arrow', 'ลูกศรลงสู่ผล', (d, c) => { const Q = CQ(d), m = Q.L, es = Q.LB(m);
    art(c, p => { const w = 140, SE = es ? 200 : 230, E = { x: 0, y: f1(310 - SE / 2 - (es ? 72 : 6)), s: SE }, hl = 60, yEnd = f1(E.y - SE / 2 - 22 - hl), y0 = -310 + w / 2, Lv = yEnd - y0;
      const atL = m > 1 ? spread(m, 0, Lv - 50) : [Lv * .3], sp = m > 1 ? atL[1] - atL[0] : 200;
      bigArrow(p, c, Q, { d: `M 0 ${y0} L 0 ${yEnd}`, w, hw: 104, hl, iw: f1(Math.min(96, sp * .72)), seg: 160, atL });
      tileN(p, c, Q, m, E.x, E.y, { s: SE }); if (es) wordN(p, Q, m, 0, f1(E.y + SE / 2 + 34), ES[4], 360); }); });
  sd(4, 'ring', 'ชาร์จต่อกันลงมา', (d, c) => { const Q = CQ(d), m = Q.L, es = Q.LB(m);
    art(c, p => { const SE = m > 2 ? 180 : 210, E = { x: 0, y: f1(310 - (SE / 2 + 13) - (es ? 72 : 6)), s: SE }, span = E.y - ringR(E) - 34 + 310, Z = m > 1 ? fitZ(m, span, 150, 22, 130) : { D: 130, v: 0 }, D = Z.D, s = f1(D - 26);
      const y0 = -310 + D / 2 + (span - ((m - 1) * Z.v + D)) / 2, P = Array.from({ length: m }, (_, i) => ({ x: m > 1 ? (i % 2 ? 75 : -75) : 0, y: f1(y0 + i * Z.v), s })); P.push(E);
      ringChain(p, c, Q, P, { bend: P.map((q, i) => i % 2 ? .12 : -.12) });
      if (es) wordN(p, Q, m, 0, f1(E.y + ringR(E) + 30), ES[4], 360); }); });
  /* ===== 5 · 860 × 710 — full screen, landscape ===== */
  sd(5, 'card', 'การ์ด เพราะ → จึง', (d, c) => { const Q = CQ(d), m = Q.L, es = Q.LB(m);
    art(c, p => { const s = m > 3 ? 150 : m === 3 ? 180 : 200, gx = m > 1 ? f1(Math.min(270, 760 / m)) : 0, y1 = f1(-355 + 36 + s / 2 + 8), sy = f1(y1 + s / 2 + 40), room = 347 - sy - (es ? ES[5] + 40 : 0);
      const E = { x: 0, y: f1(sy + 36 + (room - 36) / 2), s: f1(Math.min(340, room - 60)) };
      card2(p, c, Q, { rows: [{ y: y1, s, xs: spread(m, -gx * (m - 1) / 2, gx * (m - 1) / 2) }], split: sy, br: 38, E, ck: 1.05, ew: q => { if (es) wordN(q, Q, m, 0, f1(E.y + E.s / 2 + 46), ES[5], 640); } }); }); });
  sd(5, 'grow', 'แตกออกมา ไต่ขึ้นสู่ผล', (d, c) => { const Q = CQ(d), m = Q.L, es = Q.LB(m), cw = anyW(Q);
    art(c, p => { const big = Q.n > 3, SE = big ? 270 : es ? 290 : 320, E = { x: f1(410 - SE / 2), y: f1(-350 + SE / 2 + (es ? 4 : 30)), s: SE }, ss = spread(m, big ? 124 : 160, big ? 164 : 214);
      const P = diag(ss, [-410 + ss[0] / 2, f1(350 - ss[0] / 2 - (cw ? 70 : 10))], E, 64, .78); grow(p, c, Q, P);
      P.slice(0, m).forEach((q, i) => wordN(p, Q, i, q.x, f1(q.y + q.s / 2 + 40), WS[5], f1(q.s + 50), 'middle', { t: gwT(Q, i) }));
      if (es) wordN(p, Q, m, E.x, f1(E.y + SE / 2 + 52), ES[5], 420); }); });
  sd(5, 'fill', 'เติมจนล้น ไหลลงเป็นขั้น', (d, c) => { const Q = CQ(d), m = Q.L, es = Q.LB(m);
    art(c, p => { const big = Q.n > 3, SE = big ? 270 : 300, E = { x: f1(410 - SE / 2), y: f1(350 - SE / 2 - 4), s: SE }, s = big ? 140 : 176;
      const P = diag(Array(m).fill(s), [-410 + s / 2, -350 + s / 2 + 4], E, 64, .72); fillChain(p, c, Q, P, P.slice(0, m).map((a, i) => spout(a, P[i + 1])));
      P.slice(0, m).forEach((q, i) => wordN(p, Q, i, q.x, f1(q.y + s / 2 + 40), WS[5], s + 24));
      if (es) wordN(p, Q, m, E.x, f1(E.y - SE / 2 - 44), ES[5], 380); }); });
  sd(5, 'arrow', 'ลูกศรเฉียงลงสู่ผล', (d, c) => { const Q = CQ(d), m = Q.L, es = Q.LB(m), cw = anyW(Q);
    art(c, p => { const w = 200, SE = es ? 260 : 290, E = { x: f1(410 - SE / 2), y: f1(350 - SE / 2 - 4), s: SE }, hl = 86, A0 = [-410 + w / 2, f1(-350 + w / 2 + 4)];
      const dx = E.x - A0[0], dy = E.y - A0[1], dl = Math.hypot(dx, dy), ux = dx / dl, uy = dy / dl, back = SE / 2 * Math.min(1 / Math.abs(ux), 1 / Math.abs(uy)) + 26 + hl, B = [f1(E.x - ux * back), f1(E.y - uy * back)];
      const L = Math.hypot(B[0] - A0[0], B[1] - A0[1]), atL = m > 1 ? spread(m, 60, L - 70) : [L * .4], sp = m > 1 ? atL[1] - atL[0] : 300;
      bigArrow(p, c, Q, { d: `M ${A0[0]} ${A0[1]} L ${B[0]} ${B[1]}`, w, hw: 145, hl, iw: f1(Math.min(136, sp * .66)), seg: sp, atL, wd: (i, pt, n) => sideW(p, Q, i, pt, n, w / 2 + 22, WS[5], f1(Math.min(300, sp + 40))) });
      tileN(p, c, Q, m, E.x, E.y, { s: SE }); if (es) wordN(p, Q, m, f1(E.x - SE / 2 - 26), f1(E.y + SE / 2 - 40), ES[5], 300, 'end'); }); });
  sd(5, 'ring', 'ชาร์จต่อกันเป็นวงโค้ง', (d, c) => { const Q = CQ(d), m = Q.L, es = Q.LB(m);
    art(c, p => { const s = m > 3 ? 120 : m === 3 ? 144 : 168, SE = m > 2 ? (es ? 240 : 280) : (es ? 280 : 320), E = { x: 0, y: f1(340 - ringR({ s: SE }) - (es ? 84 : 10)), s: SE };
      const xs = spread(m, -406 + s / 2 + 13, 406 - s / 2 - 13), P = xs.map(x => ({ x, y: f1(-200 + (m > 1 ? Math.pow(Math.abs(x) / 340, 2) * 150 : 0)), s }));
      P.push(E); center(P, true, es ? [wRect(p, es, ES[5], 420, E.x, E.y + ringR(E) + 44)] : []);   /* user: "ยังใช้พื้นที่ไม่คุ้ม … ทำให้ทั้งหมดมันขึ้นมาอยู่ตรงกึ่งกลาง" */
      ringChain(p, c, Q, P, { bend: P.map((q, i) => i + 2 === P.length ? .16 : -.1) });
      P.slice(0, m).forEach((q, i) => wordN(p, Q, i, q.x, f1(q.y - ringR(q) - 32), WS[5], m > 1 ? f1(Math.min(300, (xs[1] - xs[0]) * 1.2)) : 360));
      if (es) wordN(p, Q, m, E.x, f1(E.y + ringR(E) + 44), ES[5], 420); }); });

  /* ===== 6 · 860 × 965 — full screen, portrait ===== */
  sd(6, 'card', 'การ์ด เพราะ → จึง', (d, c) => { const Q = CQ(d), m = Q.L, es = Q.LB(m), cw = anyW(Q);
    art(c, p => { const s = m > 3 ? 150 : m === 3 ? 176 : 196, gx = m > 1 ? f1(Math.min(250, 760 / m)) : 0, y1 = f1(-482 + 40 + s / 2 + 10), wy = cw ? WS[6] * 1.7 : 0;
      const rows = [{ y: y1, s, xs: spread(m, -gx * (m - 1) / 2, gx * (m - 1) / 2) }], sy = f1(y1 + s / 2 + wy + 40), room = 474 - sy - (es ? ES[6] + 44 : 0);
      const E = { x: 0, y: f1(sy + 40 + (room - 40) / 2), s: f1(Math.min(420, room - 70)) };
      card2(p, c, Q, { rows, ws: WS[6], wm: f1(gx - 10), split: sy, br: 40, E, ck: 1.1, ew: q => { if (es) wordN(q, Q, m, 0, f1(E.y + E.s / 2 + 50), ES[6], 700); } }); }); });
  sd(6, 'grow', 'แตกออกมา ลงมาเป็นผลใหญ่', (d, c) => { const Q = CQ(d), m = Q.L, es = Q.LB(m);
    art(c, p => { const SE = es ? 370 : 420, E = { x: 0, y: f1(474 - SE / 2 - (es ? 104 : 10)), s: SE }, ss = spread(m, m > 3 ? 150 : 180, m > 3 ? 190 : 236), gp = 50;
      const tot = ss.reduce((a, v) => a + v, 0) + gp * (m - 1), k = Math.min(1, 820 / tot), S2 = ss.map(v => f1(v * k)); let x = -(S2.reduce((a, v) => a + v, 0) + gp * (m - 1)) / 2;
      const P = S2.map(s => { const o = { x: f1(x + s / 2), y: f1(-474 + S2[m - 1] / 2 + 10 + (S2[m - 1] - s) / 2), s }; x += s + gp; return o; });
      P.push(E); grow(p, c, Q, P); P.slice(0, m).forEach((q, i) => wordN(p, Q, i, q.x, f1(q.y + q.s / 2 + 40), WS[6], f1(q.s + gp - 6), 'middle', { t: gwT(Q, i) }));
      if (es) wordN(p, Q, m, 0, f1(E.y + SE / 2 + 56), ES[6], 700); }); });
  sd(6, 'fill', 'เติมจนล้น ไหลซิกแซกลง', (d, c) => { const Q = CQ(d), m = Q.L, es = Q.LB(m);
    art(c, p => { const SE = es ? 330 : 370, E = { x: 0, y: f1(474 - SE / 2 - (es ? 104 : 8)), s: SE }, s = fitS(m, E.y - SE / 2 - 40 + 470, 40, 196);
      const ys = spread(m, -470 + s / 2, E.y - SE / 2 - 40 - s / 2), P = ys.map((y, i) => ({ x: m > 1 ? (i % 2 ? 220 : -220) : 0, y, s })); P.push(E);
      fillChain(p, c, Q, P, P.slice(0, m).map((a, i) => spoutV(a, P[i + 1])));
      P.slice(0, m).forEach((q, i) => q.x <= 0 ? wordN(p, Q, i, f1(q.x + s / 2 + 24), q.y, WS[6], 340, 'start') : wordN(p, Q, i, f1(q.x - s / 2 - 24), q.y, WS[6], 340, 'end'));
      if (es) wordN(p, Q, m, 0, f1(E.y + SE / 2 + 54), ES[6], 700); }); });
  sd(6, 'arrow', 'ลูกศรลงสู่ผล', (d, c) => { const Q = CQ(d), m = Q.L, es = Q.LB(m);
    art(c, p => { const w = 250, SE = es ? 300 : 340, E = { x: 0, y: f1(474 - SE / 2 - (es ? 104 : 8)), s: SE }, hl = 90, yEnd = f1(E.y - SE / 2 - 26 - hl), y0 = -474 + w / 2, Lv = yEnd - y0;
      const atL = m > 1 ? spread(m, 0, Lv - 80) : [Lv * .3], sp = m > 1 ? atL[1] - atL[0] : 300;
      bigArrow(p, c, Q, { d: `M 0 ${y0} L 0 ${yEnd}`, w, hw: 175, hl, iw: f1(Math.min(170, sp * .7)), seg: 300, atL, wd: (i, [x, y]) => wordN(p, Q, i, i % 2 ? f1(-w / 2 - 28) : f1(w / 2 + 28), y, WS[6], 270, i % 2 ? 'end' : 'start') });
      tileN(p, c, Q, m, E.x, E.y, { s: SE }); if (es) wordN(p, Q, m, 0, f1(E.y + SE / 2 + 54), ES[6], 700); }); });
  sd(6, 'ring', 'ชาร์จต่อกันสลับซ้ายขวา', (d, c) => { const Q = CQ(d), m = Q.L, es = Q.LB(m), cw = anyW(Q);
    art(c, p => { const SE = es ? 310 : 360, E = { x: 0, y: f1(474 - (SE / 2 + 13) - (es ? 106 : 6)), s: SE }, D = fitS(m, E.y - ringR(E) - 40 + 474, 24, 214), s = f1(D - 26), cx = cw ? 140 : 200;
      const ys = spread(m, -474 + D / 2, E.y - ringR(E) - 40 - D / 2), P = ys.map((y, i) => ({ x: m > 1 ? (i % 2 ? cx : -cx) : 0, y, s }));
      P.push(E); ringChain(p, c, Q, P, { bend: P.map((q, i) => i % 2 ? .14 : -.14) });
      P.slice(0, m).forEach((q, i) => q.x < 0 || m === 1 ? wordN(p, Q, i, f1(q.x - D / 2 - 18), q.y, WS[6], f1(430 - 14 - (D / 2 + 18) + q.x), 'end') : wordN(p, Q, i, f1(q.x + D / 2 + 18), q.y, WS[6], f1(430 - 14 - D / 2 - 18 - q.x), 'start'));
      if (es) wordN(p, Q, m, 0, f1(E.y + ringR(E) + 50), ES[6], 700); }); });

  /* ===== 7 · 400 × 500 — small portrait ===== */
  sd(7, 'card', 'การ์ด เพราะ → จึง', (d, c) => { const Q = CQ(d), m = Q.L, es = Q.LB(m), cw = anyW(Q);
    art(c, p => { const two = m > 3, s = two ? 70 : m === 3 ? 84 : 100, gx = m > 1 ? (two ? 84 : m === 3 ? 116 : 140) : 0, y1 = f1(-250 + 22 + s / 2 + 6), wy = cw ? WS[7] * 1.7 : 0;
      const rows = [{ y: y1, s, xs: two ? spread(4, -126, 126) : spread(m, -gx * (m - 1) / 2, gx * (m - 1) / 2) }], sy = f1(y1 + s / 2 + wy + 24), room = 242 - sy - (es ? ES[7] + 26 : 0);
      const E = { x: 0, y: f1(sy + 30 + (room - 30) / 2), s: f1(Math.min(200, room - 46)) };
      card2(p, c, Q, { rows, ws: WS[7], wm: two ? 86 : f1(gx - 4), split: sy, br: 26, E, ck: .55, ew: q => { if (es) wordN(q, Q, m, 0, f1(E.y + E.s / 2 + 30), ES[7], 340); } }); }); });
  sd(7, 'grow', 'แตกออกมา ลงมาเป็นผลใหญ่', (d, c) => { const Q = CQ(d), m = Q.L, es = Q.LB(m);
    art(c, p => { const SE = es ? 176 : 226, E = { x: 0, y: f1(244 - SE / 2 - (es ? 68 : 4)), s: SE }, ss = spread(m, m > 3 ? 64 : 86, m > 3 ? 82 : 110), gp = m > 3 ? 22 : 30;
      const tot = ss.reduce((a, v) => a + v, 0) + gp * (m - 1), k = Math.min(1, 372 / tot), S2 = ss.map(v => f1(v * k)); let x = -(S2.reduce((a, v) => a + v, 0) + gp * (m - 1)) / 2;
      const P = S2.map(s => { const o = { x: f1(x + s / 2), y: f1(-244 + S2[m - 1] / 2 + (S2[m - 1] - s) / 2), s }; x += s + gp; return o; });
      P.push(E); grow(p, c, Q, P); P.slice(0, m).forEach((q, i) => wordN(p, Q, i, q.x, f1(q.y + q.s / 2 + 22), WS[7], f1(q.s + gp - 2), 'middle', { t: gwT(Q, i) }));
      if (es) wordN(p, Q, m, 0, f1(E.y + SE / 2 + 34), ES[7], 340); }); });
  sd(7, 'fill', 'เติมจนล้น ไหลซิกแซกลง', (d, c) => { const Q = CQ(d), m = Q.L, es = Q.LB(m);
    art(c, p => { const SE = es ? 156 : 190, E = { x: 0, y: f1(244 - SE / 2 - (es ? 68 : 4)), s: SE }, s = fitS(m, E.y - SE / 2 - 24 + 244, 24, 98);
      const ys = spread(m, -244 + s / 2, E.y - SE / 2 - 24 - s / 2), P = ys.map((y, i) => ({ x: m > 1 ? (i % 2 ? 100 : -100) : 0, y, s })); P.push(E);
      fillChain(p, c, Q, P, P.slice(0, m).map((a, i) => spoutV(a, P[i + 1])));
      P.slice(0, m).forEach((q, i) => q.x <= 0 ? wordN(p, Q, i, f1(q.x + s / 2 + 12), q.y, WS[7], f1(186 - (q.x + s / 2 + 12)), 'start') : wordN(p, Q, i, f1(q.x - s / 2 - 12), q.y, WS[7], f1(q.x - s / 2 - 12 + 186), 'end'));
      if (es) wordN(p, Q, m, 0, f1(E.y + SE / 2 + 32), ES[7], 340); }); });
  sd(7, 'arrow', 'ลูกศรลงสู่ผล', (d, c) => { const Q = CQ(d), m = Q.L, es = Q.LB(m), cw = anyW(Q);
    art(c, p => { const w = 112, SE = es ? 140 : 156, x = es ? f1(-(SE + 18 + Math.min(200, tw(p, es, ES[7]))) / 2 + SE / 2) : cw ? -116 : 0, Ey = f1(244 - SE / 2), hl = 42, yEnd = f1(Ey - SE / 2 - 16 - hl), y0 = -244 + w / 2, Lv = yEnd - y0;
      const atL = m > 1 ? spread(m, 0, Lv - 40) : [Lv * .3], sp = m > 1 ? atL[1] - atL[0] : 200;
      bigArrow(p, c, Q, { d: `M ${x} ${y0} L ${x} ${yEnd}`, w, hw: 76, hl, iw: f1(Math.min(76, sp * .72)), seg: 140, atL, wd: (i, [xx, yy]) => wordN(p, Q, i, f1(xx + w / 2 + 16), yy, WS[7], 180, 'start') });
      tileN(p, c, Q, m, x, Ey, { s: SE }); if (es) wordN(p, Q, m, f1(x + SE / 2 + 18), Ey, ES[7], 200, 'start'); }); });
  sd(7, 'ring', 'ชาร์จต่อกันลงมา', (d, c) => { const Q = CQ(d), m = Q.L, es = Q.LB(m);
    art(c, p => { const SE = es ? 156 : 180, E = { x: 0, y: f1(244 - ringR({ s: SE }) - (es ? 60 : 4)), s: SE }, span = E.y - ringR(E) - 22 + 244, Z = m > 1 ? fitZ(m, span, 150, 18, 112) : { D: 112, v: 0 }, D = Z.D, s = f1(D - 26);
      const y0 = -244 + D / 2 + (span - ((m - 1) * Z.v + D)) / 2, P = Array.from({ length: m }, (_, i) => ({ x: m > 1 ? (i % 2 ? 75 : -75) : 0, y: f1(y0 + i * Z.v), s })); P.push(E);
      ringChain(p, c, Q, P, { bend: P.map((q, i) => i % 2 ? .12 : -.12) });
      if (es) wordN(p, Q, m, 0, f1(E.y + ringR(E) + 30), ES[7], 340); }); });

  /* ---------- sample data + stress ---------- */
  const I = (icon, label) => label ? { icon, label } : { icon };
  const SAMPLES = [
    { say: 'นอนดึก ตื่นสาย เลยตกรถ', items: [I('moon', 'นอนดึก'), I('alarm-clock', 'ตื่นสาย'), I('bus', 'ตกรถ')] },
    { say: 'ลดราคา คนแห่มา ของหมด', items: [I('badge-percent', 'ลดราคา'), I('users', 'คนแห่มา'), I('package-open', 'ของหมด')], end: I('check') },
    { say: 'ฝนตก ถนนลื่น รถชนกัน (ไม่มีคำ)', items: [I('droplets'), I('triangle-alert'), I('car')] },
  ];
  const STRESS = [
    { say: 'ภาษาอังกฤษ + end มีคำ', items: [I('code', 'Bug'), I('database', 'Crash'), I('users', 'Users leave')], end: I('trending-down', 'Churn') },
    { say: 'ไม่มีไอคอน (คำแทนภาพ)', items: [{ label: 'เหตุ' }, { label: 'ต่อ' }, { label: 'ผล' }] },
    { say: 'ป้ายยาว', items: [I('moon', 'นอนดึกทุกคืน'), I('battery-low', 'อ่อนเพลียมาก'), I('frown', 'งานพลาด')] },
    { say: '4 ทอด + end', items: [I('coins', '100'), I('coins', '1,000'), I('coins', '10,000'), I('coins', '100,000')], end: I('trophy') },
    { say: 'ทอดเดียว + end', items: [I('megaphone', 'ประกาศ')], end: I('users', 'ทุกคนรู้') },
    { say: 'ไม่มีทอด มีแต่ end', items: [], end: I('check') },
    { say: 'ป้ายผสมไทยอังกฤษ', items: [I('wifi', 'เน็ตล่ม'), I('laptop', 'Zoom หลุด')], end: I('frown', 'ประชุมพัง') },
    { say: 'ชื่อไอคอนที่ไม่มี', items: [I('no-such-icon', 'ตอนแรก'), I('no-such-icon', 'ตอนท้าย'), I('sun', 'สุดท้าย')] },
    { say: 'ป้ายสั้นมาก', items: [I('cloud', 'ฝน'), I('droplets', 'ท่วม'), I('car', 'ติด')] },
  ];

  G.cats = G.cats || {};
  G.cats.B12S = { S: SZD, SIZES, SAMPLES, STRESS, theme, frame,
    drawS: (k, i, d, c) => { setZ(c); CUR = 's' + k + '-' + SZD[k][i].id; BOX = [SIZES[k].w, SIZES[k].h]; tokens(); EMPTY = false; BLUE = false; SZD[k][i].fn(trimL(d || {}), c); }, CLAMPS };
})();
