/* b01t.js — TEST (user 2026-11-14: "ลองทำ template ชุดฐานหมวด 1 มา 20 แบบ หน้าตาไม่จำเป็นต้องแตกต่างกันโดยสิ้นเชิงคล้ายๆกันได้ขอแค่ห้ามเหมือนกันเป๊ะ 100%"):
   category B01 "ตัวเลขเด่น" redone in the template ชุดฐาน way — graphic elements only (icon boxes, pills, rings, bars, dots, segments, tiles,
   a slider, a stepper, lines), **no real-world objects**, our white-glow line style. Icons and words sit apart (no word under an icon).
   Not a replacement for the approved B01 (references/approved/b01/). Header + helpers copied from b05t.js (b05t → cards.js → b21).
   GL.cats.B01T.draw(i, data, { x, y, s, at, hit }) — canvas 1000 × 700 centred at (0,0). Data = CutPack B01: value · unit · icon · dir. */
(function () {
  const G = window.GL, C = G.C, NS = 'http://www.w3.org/2000/svg';
  const W = (w = 2) => ({ sw: w }), F = (w = 3.2) => ({ fill: C.fill, sw: w }), S = (w = 2) => ({ sw: w, stroke: C.soft });
  const rad = d => d * Math.PI / 180, f1 = v => +v.toFixed(1);
  let GLASS = 'rgba(255,255,255,.07)', LIT = 'rgba(255,255,255,.2)'; const SOLID = (w = 2) => ({ fill: C.ink, sw: w });

  /* TIMING (same system as b01–b11): the keyword c.hit never moves; M = 1/speed but at most hit / HIT0; tu / bH / aH; kf() keeps keys in order */
  const HIT0 = 1.5; let Z = null; const CLAMPS = {}; let CUR = '';
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
    cp.id = 'b01tclip' + (++CID); Object.entries({ x, y, width: w, height: h }).forEach(([k, v]) => r.setAttribute(k, v)); cp.appendChild(r);
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
    if (X && picOf(X)) put(q, c, { icon: X.icon }, x, y, s * .56, null, { t: f3(t + tu(.04)), mv: o.mv, o: o.dim ? dimK(o.dim) : undefined, punch: o.punch });
    else if (X && X.label) txt(g, X.label, x, y + s * .06, { size: s * .17, maxW: s * .84, weight: 800, color: C.ink, wrap: 'mid' }); else DOT(g, x, y, 8); return g; }
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
  const frac = d => zeroV(d) ? 0 : pctV(d) ?? (d.dir === 'up' ? .82 : d.dir === 'down' ? .28 : 1);
  const posV = d => zeroV(d) ? 0 : pctV(d) ?? (d.dir === 'up' ? .78 : d.dir === 'down' ? .26 : .62);
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

  /* 01 ── ICON + NUMBER (ไอคอนข้างตัวเลข): the icon box drops in and kicks dust; the number pops beside it and counts, locks on H; the unit
     slides in after it, a dir badge on its shoulder. No icon → the number in the middle. */
  variant('stat', 'ไอคอนข้างตัวเลข', (d, c) => { const v = VAL(d), u = UN(d), ic = ICN(d), H = Z.H;
    art(c, p => { const rw = ic && v ? rowW(p, v, u, 200, 620) : 0, L = -(230 + 50 + rw) / 2; dropBox(p, c, ic, L + 115, 0, 230, tu(.04), tu(.28));
      const n = numRow(p, p, v, u, ic ? L + 280 : 0, 70, { size: 200, maxW: ic ? 620 : 880, anchor: ic ? 'start' : 'middle', t0: tu(.32) });
      if (n) { drawAt(p.line(n.x0, 130, n.x1, 130, S(2.4)), p, tu(.34), tu(.3)); ripple(p, n.x0 + n.nw / 2, n.cy, 130, H); dirB(p, DIRV(d), Math.min(440, n.x1 + 20), -130, f3(H + tu(.1))); }
    }); });

  /* 02 ── RING (วงแหวน): the track draws round, small ticks outside light one after another, the arc fills to the amount with a dot riding its
     end; the number counts in the middle and locks on H; the icon box flies in on an arc to the ring's shoulder; unit pill under. */
  variant('ring', 'วงแหวน', (d, c) => { const v = VAL(d), u = UN(d), ic = ICN(d), H = Z.H, fr = frac(d), cx = 0, cy = -30, r = 200, t0 = tu(.3), t1 = f3(H - tu(.04));
    art(c, p => { drawAt(p.circle(cx, cy, r, SOFTT), p, tu(.04), tu(.3));
      const N = 36; for (let k = 0; k < N; k++) { const a = -90 + k * 360 / N; tick(atG(p, tu(.1 + .006 * k)), cx, cy, a, r + 26, r + 44, S(1.6)); if (k / N < fr - 1e-6) tick(litOn(p, f3(t0 + (t1 - t0) * k / N / Math.max(fr, .01))), cx, cy, a, r + 24, r + 48, { sw: 3.4, stroke: ACC1 }); }
      if (fr > 0) { const arc = p.path(arcD(cx, cy, r, fr), { sw: 14, stroke: ACC1 }); on(arc, p, 0, { draw: fillK(t0, t1) });
        const rd = mvG(p, { px: cx, py: cy, r: ridK(360 * fr, t0, t1), o: fadeIn(t0, .04) }), a = rad(-90 + 360 * fr); rd.circle(f1(cx + r * Math.cos(a)), f1(cy + r * Math.sin(a)), 16, { fill: ACC1, sw: 2, stroke: ACC1 }); }
      const n = num(p, p, v, cx, cy + 46, { size: 130, maxW: 300, t0: tu(.3) }); if (n) ripple(p, cx, cy, r - 30, H);
      if (ic) { const L = [[-420, -300], [-60, -380], [200, -200]], K = pathK(L, tu(.14), tu(.44), [200, -200]), mv = { px: 200, py: -200, x: K.x, y: K.y }, g = mvG(p, Object.assign({ o: fadeIn(tu(.14), .04) }, mv));
        ibox(p, c, { icon: ic }, 200, -200, 110, tu(.14), { g, mv, punch: tu(.44) }); }
      pill(p, u, cx, 270, { t: f3(H + tu(.06)), size: 34, maxW: 420 });
    }); });

  /* 03 ── PROGRESS BAR (แถบความคืบหน้า): the icon box drops at the bar's start; the bar fills to the amount, its knob riding the end, ripple
     on H; the number sits on the bar's start, the unit at the far end (or under the bar when there is no room). */
  variant('bar', 'แถบความคืบหน้า', (d, c) => { const v = VAL(d), u = UN(d), ic = ICN(d), H = Z.H, fr = frac(d), bx0 = ic ? -250 : -420, bx1 = 420, bw = bx1 - bx0, by = 150, t0 = tu(.34), t1 = f3(H - tu(.04));
    art(c, p => { dropBox(p, c, ic, -350, by, 150, tu(.04), tu(.28));
      R(inG(p, 'pop', (bx0 + bx1) / 2, by, tu(.1)), bx0, by - 30, bw, 60, 30, F(3.4));
      if (fr > 0) { R(mvG(p, { px: bx0, py: by, sx: fillK(t0, t1), o: fadeIn(t0, .04) }), bx0 + 6, by - 24, Math.max(48, (bw - 12) * fr), 48, 24, FILL);
        const kx = bx0 + 6 + Math.max(48, (bw - 12) * fr) - 24, kn = mvG(p, { x: [[0, f1(bx0 + 30 - kx)], [t0, f1(bx0 + 30 - kx)], [t1, 0, 'io']], o: fadeIn(t0, .04) }); kn.circle(kx, by, 34, F(4)); ripple(p, kx, by, 50, H); }
      const n = numRow(p, p, v, null, bx0, by - 92, { size: 170, maxW: bw - 40, anchor: 'start', t0: tu(.3) });
      if (u && n) { const room = bx1 - n.x1 - 40; if (room > 140) words(p, u, bx1, by - 92, { t: f3(H + tu(.06)), size: 48, weight: 600, color: C.soft, anchor: 'end', maxW: room, wrap: null }); else pill(p, u, (bx0 + bx1) / 2, by + 110, { t: f3(H + tu(.06)), size: 32, maxW: 500 }); }
    }); });

  /* 04 ── DIAL (หน้าปัด): the half dial's segments light in a wave, the needle sweeps from the left end, overshoots and settles on the amount on
     H; the number and unit under the pivot; the icon box drops into the corner. */
  variant('gauge', 'หน้าปัด', (d, c) => { const v = VAL(d), u = UN(d), ic = ICN(d), H = Z.H, ps = posV(d), cx = 0, cy = 120, r = 290, t0 = tu(.36), t1 = f3(H - tu(.04)), N = 12;
    art(c, p => { for (let k = 0; k < N; k++) { const a0 = 180 + k * 180 / N + 1.6, a1 = 180 + (k + 1) * 180 / N - 1.6, P = a => f1(cx + r * Math.cos(rad(a))) + ' ' + f1(cy + r * Math.sin(rad(a))), dd = `M ${P(a0)} A ${r} ${r} 0 0 1 ${P(a1)}`;
        drawAt(p.path(dd, { sw: 22, stroke: TL_(.16) }), p, tu(.06 + .02 * k), tu(.1)); if ((k + .5) / N <= ps + 1e-6) on(p.path(dd, { sw: 22, stroke: ACC1 }), p, 0, { o: [[0, 0], [f3(t0 + (t1 - t0) * (k + .5) / N / Math.max(ps, .01)), 0], [f3(t0 + (t1 - t0) * (k + .5) / N / Math.max(ps, .01) + tu(.04)), 1]] }); }
      const an = 180 + 180 * ps, nd = mvG(p, { px: cx, py: cy, r: [[0, -180 * ps], [t0, -180 * ps], [t1, 6, 'out'], [f3(t1 + tu(.1)), -2, 'io'], [f3(t1 + tu(.18)), 0, 'soft']], o: fadeIn(tu(.3), .04) });
      nd.line(cx, cy, f1(cx + (r - 70) * Math.cos(rad(an))), f1(cy + (r - 70) * Math.sin(rad(an))), W(6)); popAt(p, cx, cy, tu(.3)).circle(cx, cy, 22, SOLID(2));
      const n = numRow(p, p, v, u, cx, 310, { size: 140, maxW: 720, t0: tu(.32) }); if (n) ripple(p, cx, cy, 40, H);
      dropBox(p, c, ic, -390, -250, 120, tu(.04), tu(.26)); dirB(p, DIRV(d), 400, -250, f3(H + tu(.1)));
    }); });

  /* 05 ── STAT CARD (การ์ดสถิติ): the card drops and settles; the icon box spins in at its corner, two soft bars grow beside it (lines of text),
     a rule draws; the number counts at the bottom and locks on H; the dir badge pops on the corner. */
  variant('card', 'การ์ดสถิติ', (d, c) => { const v = VAL(d), u = UN(d), ic = ICN(d), H = Z.H;
    art(c, p => { cardG(p, 860, 580, 0); spinBox(p, c, ic, -320, -160, 130, tu(.3)); const lx = ic ? -220 : -360;
      [[-185, 340], [-130, 220]].forEach(([y, w], k) => R(mvG(p, { px: lx, py: y, sx: [[0, 0], [tu(.36 + .08 * k), 0], [tu(.56 + .08 * k), 1, 'out']], o: fadeIn(tu(.36 + .08 * k), .04) }), lx, y - 13, w, 26, 13, PH));
      drawAt(p.line(-370, -50, 370, -50, S(2)), p, tu(.3), tu(.3));
      const n = numRow(p, p, v, u, -360, 190, { size: 190, maxW: 720, anchor: 'start', t0: tu(.4) }); if (n) ripple(p, n.x0 + n.nw / 2, n.cy, 120, H);
      dirB(p, DIRV(d), 340, -170, f3(H + tu(.1)));
    }); });

  /* 06 ── CAPSULE (เม็ดยาใหญ่): a long capsule stretches open from its middle; the icon rolls in from the left into the round end (turning as it
     rolls); the number counts inside and locks on H; the unit pill hangs below; dir badge on the capsule's shoulder. */
  variant('capsule', 'เม็ดยาใหญ่', (d, c) => { const v = VAL(d), u = UN(d), ic = ICN(d), H = Z.H;
    art(c, p => { R(mvG(p, { px: 0, py: 0, sx: [[0, .1], [tu(.04), .1], [tu(.3), 1.04, 'out'], [tu(.4), 1, 'soft']], o: fadeIn(tu(.04), .04) }), -420, -125, 840, 250, 125, F(4.4));
      if (ic) { const mv = { px: -290, py: 0, x: [[0, -260], [tu(.24), -260], [tu(.54), 8, 'out'], [tu(.64), 0, 'soft']], r: [[0, -300], [tu(.24), -300], [tu(.54), 10, 'out'], [tu(.64), 0, 'soft']] }, g = mvG(CL(p), Object.assign({ o: fadeIn(tu(.24), .04) }, mv));
        g.circle(-290, 0, 92, F(3.4)); g.circle(-290, 0, 78, S(1.4)); put(p, c, { icon: ic }, -290, 0, 100, null, { t: tu(.24), mv, punch: tu(.56) }); }
      const n = numRow(p, p, v, null, ic ? 70 : 0, 52, { size: 150, maxW: ic ? 470 : 720, t0: tu(.36) }); if (n) ripple(p, n.cx, n.cy, 110, H);
      if (u) { drawAt(p.line(ic ? 70 : 0, 125, ic ? 70 : 0, 175, S(2)), p, f3(H), tu(.1)); pill(p, u, ic ? 70 : 0, 222, { t: f3(H + tu(.08)), size: 34, maxW: 520 }); }
      dirB(p, DIRV(d), 400, -130, f3(H + tu(.1)));
    }); });

  /* 07 ── COLUMNS (กราฟแท่ง): five columns grow up one by one with an overshoot (rising when up, falling when down); the last one lights,
     a spark leaves its top and flies along an arc to the number, which locks on H; the icon box drops into the top-left. */
  variant('columns', 'กราฟแท่ง', (d, c) => { const v = VAL(d), u = UN(d), ic = ICN(d), H = Z.H, dr = DIRV(d), hs = dr === 'up' ? [.3, .45, .55, .75, 1] : dr === 'down' ? [1, .78, .6, .45, .28] : [.55, .8, .45, .7, 1], by = 290;
    art(c, p => { drawAt(p.line(-440, by, 140, by, S(2)), p, tu(.04), tu(.3));
      hs.forEach((h, k) => { const x = -420 + k * 110, hh = 250 * h, t = tu(.12 + .08 * k), last = k === 4; R(mvG(p, upK(x + 38, by, t)), x, by - hh, 76, hh, 16, last ? { fill: LIT, sw: 4, stroke: ACC1 } : F(3.2)); if (last) dust(p, x + 38, by, f3(t + tu(.3)), .7); });
      const tx = -420 + 4 * 110 + 38, ty = by - 250 * hs[4] - 10, n = numRow(p, p, v, u, 450, -150, { size: 150, maxW: 560, anchor: 'end', t0: tu(.5) });
      if (n) { const L = [[tx, ty], [(tx + n.cx) / 2, Math.min(ty, n.cy) - 140], [n.cx, n.cy]], K = pathK(L, f3(H - tu(.4)), f3(H - tu(.02)), [n.cx, n.cy]);
        mvG(p, { x: K.x, y: K.y, o: [[0, 0], [f3(H - tu(.4)), 0], [f3(H - tu(.36)), 1], [f3(H - tu(.02)), 1], [H, 0]] }).circle(n.cx, n.cy, 12, SOLID(2)); ripple(p, n.cx, n.cy, 110, H); }
      dropBox(p, c, ic, -380, -250, 120, tu(.04), tu(.26));
    }); });

  /* 08 ── DOT GRID (จุดเต็มแถว): a grid of empty dots draws in; they fill one by one in a wave up to the amount (all when there is no %), the last
     one lands on H with a ripple; the number counts above; the icon box drops into the right. */
  variant('dots', 'จุดเต็มแถว', (d, c) => { const v = VAL(d), u = UN(d), ic = ICN(d), H = Z.H, fr = frac(d), NX = 12, NY = 3, NT = NX * NY, lit = Math.round(fr * NT), t0 = tu(.36), t1 = f3(H - tu(.04));
    art(c, p => { for (let i = 0; i < NX; i++) for (let j = 0; j < NY; j++) { const k = i * NY + j, x = -341 + i * 62, y = 140 + j * 64; on(p.circle(x, y, 16, S(1.8)), p, 0, { o: fadeIn(tu(.06 + .012 * k), .06) });
        if (k < lit) { const t = f3(t0 + (t1 - t0) * (lit > 1 ? k / (lit - 1) : 1)); popAt(p, x, y, t).circle(x, y, 16, { fill: ACC1, sw: 1, stroke: ACC1 }); if (k === lit - 1) ripple(p, x, y, 26, t); } }
      const n = numRow(p, p, v, u, -380, -10, { size: 170, maxW: ic ? 600 : 780, anchor: 'start', t0: tu(.3) });
      dropBox(p, c, ic, 360, -150, 150, tu(.04), tu(.28)); if (n && !ic) dirB(p, DIRV(d), 400, -150, f3(H + tu(.1)));
    }); });

  /* 09 ── SLIDER (สไลเดอร์): the track draws, the icon box drops at its start; the knob slides to the amount with a word bubble riding above it —
     the number counting inside — and the track lights behind; it settles on H. */
  variant('slider', 'สไลเดอร์', (d, c) => { const v = VAL(d), u = UN(d), ic = ICN(d), H = Z.H, ps = posV(d), tx0 = ic ? -300 : -430, tx1 = 430, ty = 190, t0 = tu(.34), t1 = f3(H - tu(.04));
    art(c, p => { dropBox(p, c, ic, -400, ty, 130, tu(.04), tu(.26)); R(inG(p, 'pop', (tx0 + tx1) / 2, ty, tu(.1)), tx0, ty - 16, tx1 - tx0, 32, 16, F(3));
      const kx = f1(tx0 + 20 + (tx1 - tx0 - 40) * ps), dx = f1(tx0 + 20 - kx); if (ps > 0) R(mvG(p, { px: tx0, py: ty, sx: fillK(t0, t1), o: fadeIn(t0, .04) }), tx0 + 4, ty - 12, Math.max(24, kx - tx0), 24, 12, FILL);
      const g = mvG(p, { x: [[0, dx], [t0, dx], [t1, 0, 'io']], o: fadeIn(tu(.28), .04) }); g.circle(kx, ty, 36, F(4.2)); g.circle(kx, ty, 22, S(1.6));
      const bw = Math.min(700, (v ? tw(p, v, 110) : 100) + (u ? tw(p, u, 40, 600) + 22 : 0) + 90), bx = Math.max(-480 + bw / 2, Math.min(480 - bw / 2, kx)), bub = popAt(g, kx, 60, tu(.32));
      R(bub, bx - bw / 2, -100, bw, 160, 40, F(3.6)); bub.path(`M ${kx - 20} 59 L ${kx} 96 L ${kx + 20} 59`, F(3.6)); bub.line(kx - 18, 58, kx + 18, 58, { sw: 6, stroke: C.fill });
      numRow(p, bub, v, u, bx, 18, { size: 110, maxW: bw - 70, t0: tu(.36), g: bub }); ripple(p, kx, ty, 50, H);
    }); });

  /* 10 ── DIGIT TILES (ช่องตัวเลข): each digit has its own tile; the tiles drop in one after another and squash, the digits roll and lock left to
     right, the last on H; commas / points sit between; the icon box spins in above, the unit pill under. */
  variant('tiles', 'ช่องตัวเลข', (d, c) => { const v = VAL(d) || '', u = UN(d), ic = ICN(d), H = Z.H, ch = [...v];
    art(c, p => { const wOf = s => /\d/.test(s) ? 116 : /[,.]/.test(s) ? 34 : 92, tot = ch.reduce((a, s) => a + wOf(s) + 12, -12), k = Math.min(1, 900 / tot), y0 = ic ? 40 : 10; let x = -tot * k / 2, nd = 0;
      const digits = ch.filter(s => /\d/.test(s)).length, t0 = tu(.3), lk = i => f3(digits > 1 ? lerp(H - tu(.5), H, i / (digits - 1)) : H);
      ch.forEach(s => { const w = wOf(s) * k, cx = x + w / 2;
        if (/\d/.test(s)) { const i = nd++, t = f3(tu(.06 + .05 * i)), K = fallK(cx, y0 + 85 * k, t, f3(t + tu(.18)), 260), g0 = mvG(CL(p), K), g = i === digits - 1 ? mvG(g0, { px: cx, py: y0, s: bumpK(H, 1.12) }) : g0; R(g, x, y0 - 85 * k, w, 170 * k, 22 * k, F(3.6)); g.line(x + 10 * k, y0, x + w - 10 * k, y0, S(1.2));
          const e = g.text(s, cx, f1(y0 + 46 * k), { size: f1(130 * k), weight: 800, color: ACC1, dur: .01 }), tg = +s, l = lk(i);
          HOOKS.push(tt => { const uu = rel(p, tt); e.textContent = uu < t0 || uu >= l ? s : String((tg + 1 + Math.floor((uu - t0) / tu(.05))) % 10); });
          if (i === digits - 1) ripple(p, cx, y0, 100 * k, H); }
        else txt(atG(p, tu(.3)), s, cx, f1(y0 + 50 * k), { size: 120 * k, weight: 800, color: ACC1 });
        x += w + 12 * k; });
      spinBox(p, c, ic, 0, -230, 110, tu(.22)); pill(p, u, 0, f1(y0 + 85 * k + 80), { t: f3(H + tu(.06)), size: 34, maxW: 520 });
    }); });

  /* 11 ── SPLIT (แบ่งสองฝั่ง): a divider draws from the middle out; the icon box falls on the left and kicks dust; the number counts on the right
     and locks on H, the unit pill under it. No icon → no divider, the number centred. */
  variant('split', 'แบ่งสองฝั่ง', (d, c) => { const v = VAL(d), u = UN(d), ic = ICN(d), H = Z.H;
    art(c, p => { if (ic) { drawAt(p.line(-70, 0, -70, -280, S(2.4)), p, tu(.04), tu(.24)); drawAt(p.line(-70, 0, -70, 280, S(2.4)), p, tu(.04), tu(.24)); }
      dropBox(p, c, ic, -280, 0, 280, tu(.08), tu(.32)); const n = num(p, p, v, ic ? 10 : 0, 50, { size: 190, maxW: ic ? 460 : 860, anchor: ic ? 'start' : 'middle', t0: tu(.34) });
      if (n) { ripple(p, n.cx, n.cy, 130, H); pill(p, u, n.cx, 170, { t: f3(H + tu(.06)), size: 36, maxW: ic ? 440 : 600 }); dirB(p, DIRV(d), Math.min(440, n.x1 + 30), -110, f3(H + tu(.1))); }
    }); });

  /* 12 ── UNDERLINE (เส้นเน้น): the number counts big in the middle; on H a thick underline sweeps under it; the icon box slaps on its upper-left
     corner like a sticker (tilted, squash), the dir badge on the upper right. */
  variant('underline', 'เส้นเน้น', (d, c) => { const v = VAL(d), u = UN(d), ic = ICN(d), H = Z.H;
    art(c, p => { const n = numRow(p, p, v, u, 0, 90, { size: 230, maxW: 860, t0: tu(.2) }); if (!n) return;
      on(p.path(`M ${f1(n.x0)} 140 L ${f1(n.x1)} 140`, { sw: 12, stroke: ACC1 }), p, 0, { draw: [[0, 0], [f3(H - tu(.16)), 0], [H, 1, 'out']] }); ripple(p, n.cx, n.cy, 160, H);
      if (ic) { const x = Math.max(-420, n.x0 + 10), y = -170, K = Object.assign(fallK(x, y + 60, tu(.36), tu(.56), y + 60 + 350), { r: [[0, -30], [tu(.36), -30], [tu(.56), -8, 'out']] }), g = mvG(CL(p), K);
        ibox(p, c, { icon: ic }, x, y, 120, tu(.36), { g, mv: K, punch: tu(.58) }); }
      dirB(p, DIRV(d), Math.min(440, n.x1), -170, f3(H + tu(.1)));
    }); });

  /* 13 ── LINK (เชื่อมสองจุด): the icon box pops at the left, a line draws to the number box on the right; a dot runs along the line and reaches
     the box on H — the box lights and the number locks; the unit pill under the box. No icon → a start dot. */
  variant('link', 'เชื่อมสองจุด', (d, c) => { const v = VAL(d), u = UN(d), ic = ICN(d), H = Z.H;
    art(c, p => { if (ic) ibox(p, c, { icon: ic }, -340, 0, 170, tu(.06), { punch: tu(.3) }); else popAt(p, -340, 0, tu(.06)).circle(-340, 0, 24, SOLID(2));
      const bw = Math.min(480, (v ? tw(p, v, 130) : 100) + 90), bx0 = 470 - bw, lx0 = ic ? -245 : -310;
      drawAt(p.line(lx0, 0, bx0, 0, S(2.6)), p, tu(.2), tu(.3)); const bg = popAt(p, bx0 + bw / 2, 0, tu(.26)); R(bg, bx0, -100, bw, 200, 44, F(4)); R(litOn(bg, f3(H - tu(.02))), bx0, -100, bw, 200, 44, FILL);
      num(p, bg, v, bx0 + bw / 2, 46, { size: 130, maxW: bw - 60, t0: tu(.3), g: bg }); ripple(p, bx0 + bw / 2, 0, 140, H);
      mvG(p, { x: [[0, 0], [tu(.5), 0], [f3(H - tu(.02)), f1(bx0 - lx0), 'io']], o: [[0, 0], [tu(.5), 0], [tu(.54), 1], [f3(H - tu(.02)), 1], [H, 0]] }).circle(lx0, 0, 14, SOLID(2));
      pill(p, u, bx0 + bw / 2, 180, { t: f3(H + tu(.06)), size: 34, maxW: bw + 40 });
    }); });

  /* 14 ── WORD BUBBLE (ฟองคำ): the icon circle pops and pulses ; a bubble inflates out of its tail with the number counting inside,
     locking on H; the unit inline. No icon → the bubble alone, centred. */
  variant('bubble', 'ฟองคำ', (d, c) => { const v = VAL(d), u = UN(d), ic = ICN(d), H = Z.H, x0 = ic ? -300 : -420, x1 = ic ? 450 : 420, cx = (x0 + x1) / 2;
    art(c, p => { if (ic) { const g = popAt(p, -360, 220, tu(.06)); g.circle(-360, 220, 74, F(3.4)); put(p, c, { icon: ic }, -360, 220, 90, null, { t: tu(.08), punch: tu(.26) }); }
      const bt = { px: x0 + 110, py: 110, s: [[0, .1], [tu(.3), .1], [tu(.52), 1.05, 'out'], [tu(.62), 1, 'soft']], o: fadeIn(tu(.3), .04) }, b = mvG(p, bt);
      b.path(`M ${x0 + 70} 40 L ${x0 + 24} 150 L ${x0 + 180} 40 Z`, F(4)); R(b, x0, -190, x1 - x0, 280, 70, F(4));
      const n = numRow(p, b, v, u, cx, -2, { size: 150, maxW: x1 - x0 - 100, t0: tu(.42), g: b }); if (n) ripple(p, n.cx, -50, 120, H);
    }); });

  /* 15 ── TREND LINE (เส้นแนวโน้ม): soft grid lines draw in; the trend line draws point by point (each point pops), rising when up, falling when
     down; a dot rides the line and reaches the end on H — a ring and a ripple; the number counts top-left; the icon box drops top-right. */
  variant('trend', 'เส้นแนวโน้ม', (d, c) => { const v = VAL(d), u = UN(d), ic = ICN(d), H = Z.H, dr = DIRV(d), t0 = tu(.3), t1 = f3(H - tu(.04));
    const ys = dr === 'down' ? [-10, 30, 10, 110, 150, 230] : dr === 'up' ? [240, 190, 210, 110, 60, -20] : [200, 120, 160, 70, 110, 10], L = ys.map((y, k) => [-420 + k * 160, y]), E = L[5];
    art(c, p => { [-40, 80, 200].forEach((y, k) => drawAt(p.line(-440, y, 440, y, { sw: 1.4, stroke: TL_(.18) }), p, tu(.04 + .04 * k), tu(.3))); drawAt(p.line(-440, 290, 440, 290, S(2)), p, tu(.04), tu(.3));
      const K = pathK(L, t0, t1, E, 40, u2 => u2); on(p.path(pathOf(L, false), W(4.4)), p, 0, { draw: [[0, 0], [t0, 0], [t1, 1, 'lin']] });
      L.slice(0, 5).forEach(pt => { const t = K.when(pt); popAt(p, pt[0], pt[1], t).circle(pt[0], pt[1], 11, F(3)); });
      mvG(p, { x: K.x, y: K.y, o: fadeIn(t0, .04) }).circle(E[0], E[1], 14, SOLID(2)); const eg = popAt(p, E[0], E[1], H); eg.circle(E[0], E[1], 30, { sw: 4, stroke: ACC1 }); ripple(p, E[0], E[1], 44, H);
      const n = numRow(p, p, v, u, -420, -170, { size: 150, maxW: ic ? 620 : 860, anchor: 'start', t0: tu(.3) }); dropBox(p, c, ic, 380, -230, 130, tu(.04), tu(.26));
    }); });

  /* 16 ── SEGMENTS (แถบแบ่งช่อง): ten segments pop in a row; they light one by one up to the amount, the last on H with a ripple; the number counts
     above; the icon box drops into the right. */
  variant('segments', 'แถบแบ่งช่อง', (d, c) => { const v = VAL(d), u = UN(d), ic = ICN(d), H = Z.H, fr = frac(d), lit = Math.round(fr * 10), t0 = tu(.36), t1 = f3(H - tu(.04));
    art(c, p => { for (let k = 0; k < 10; k++) { const x = -380 + k * 77, t = tu(.06 + .03 * k); R(inG(p, 'rise', x + 32, 220, t), x, 160, 64, 120, 16, F(3));
        if (k < lit) { const tl = f3(t0 + (t1 - t0) * (lit > 1 ? k / (lit - 1) : 1)), g = mvG(p, { px: x + 32, py: 220, s: bumpK(tl, 1.12), o: fadeIn(tl, .03) }); R(g, x + 8, 168, 48, 104, 10, { fill: TA(.5), sw: 0, stroke: 'none' }); if (k === lit - 1) ripple(p, x + 32, 220, 70, tl); } }
      numRow(p, p, v, u, -380, 60, { size: 170, maxW: ic ? 600 : 760, anchor: 'start', t0: tu(.3) }); dropBox(p, c, ic, 340, -120, 160, tu(.04), tu(.28));
    }); });

  /* 17 ── HIGHLIGHT ROW (แถวรายการ): three rows slide in from alternate sides; the outer two are soft (a dot and grey bars); the middle row holds the
     icon box, the number and the unit — it grows and lights on H. */
  variant('list', 'แถวรายการ', (d, c) => { const v = VAL(d), u = UN(d), ic = ICN(d), H = Z.H;
    art(c, p => { [-210, 210].forEach((y, k) => { const g = mvG(p, { x: glide(k ? 160 : -160, tu(.06 + .12 * k), tu(.32 + .12 * k), k ? -6 : 6), o: fadeIn(tu(.06 + .12 * k), .06) });
        R(g, -400, y - 56, 800, 112, 30, S(2.4)); g.circle(-340, y, 20, S(2)); R(g, -290, y - 13, 360, 26, 13, PH); R(g, 110, y - 13, 160, 26, 13, PH); });
      const gx = glide(-200, tu(.12), tu(.38), 8), g = mvG(p, { x: gx, o: fadeIn(tu(.12), .06) }), gs = mvG(g, { px: 0, py: 0, s: bumpK(H, 1.05) });
      R(gs, -440, -90, 880, 180, 40, F(4.4)); R(litOn(gs, H), -440, -90, 880, 180, 40, { fill: TA(.12), sw: 0, stroke: 'none' });
      if (ic) ibox(p, c, { icon: ic }, -350, 0, 120, tu(.38), { g: popAt(gs, -350, 0, tu(.38)), mv: { px: -350, py: 0, x: gx }, punch: H });
      numRow(p, gs, v, u, ic ? -260 : -390, 44, { size: 120, maxW: ic ? 660 : 790, anchor: 'start', t0: tu(.4), g: gs });
    }); });

  /* 18 ── STACKED CARDS (ซ้อนการ์ด): the front card drops and squashes; the two cards behind fan out from under it; the icon box spins in at its
     corner, the number counts in the middle and locks on H, the unit inline; the dir badge on the top-right corner. */
  variant('stack', 'ซ้อนการ์ด', (d, c) => { const v = VAL(d), u = UN(d), ic = ICN(d), H = Z.H;
    art(c, p => { [[-7, -1], [7, 1]].forEach(([a, k]) => { const g = mvG(p, { px: 0, py: 200, r: [[0, 0], [tu(.32), 0], [tu(.52), a * 1.15, 'out'], [tu(.62), a, 'soft']], y: [[0, 0], [tu(.32), 0], [tu(.52), -20, 'out']], o: fadeIn(tu(.3), .02) });
        R(g, -300, -200, 600, 400, 36, F(3)); });
      const K = fallK(0, 200, tu(.04), tu(.26), 560), f = mvG(CL(p), K); R(f, -300, -200, 600, 400, 36, F(4.4)); dust(p, 0, 200, tu(.26), 1.4);
      spinBox(p, c, ic, -200, -110, 110, tu(.36)); const n = numRow(p, p, v, u, ic ? 30 : 0, ic ? 120 : 60, { size: 140, maxW: 500, t0: tu(.4) }); if (n) ripple(p, n.cx, n.cy, 110, H);
      dirB(p, DIRV(d), 290, -190, f3(H + tu(.1)));
    }); });

  /* 19 ── STEPPER (ปุ่มบวกลบ): a pill control with − and + buttons; the + button (− when the value goes down) is pressed again and again, each press
     a pulse, while the number counts; it locks on H and that button lights; the icon box drops above. */
  variant('stepper', 'ปุ่มบวกลบ', (d, c) => { const v = VAL(d), u = UN(d), ic = ICN(d), H = Z.H, dn = DIRV(d) === 'down', y0 = ic ? 90 : 0;
    art(c, p => { R(inG(p, 'pop', 0, y0, tu(.08)), -440, y0 - 80, 880, 160, 80, F(4.2));
      [-1, 1].forEach(sd => { const x = sd * 360, act = dn ? sd < 0 : sd > 0, K = [[0, 1]]; if (act) { for (let t = tu(.42); t + tu(.12) < H; t += tu(.2)) K.push([f3(t), 1], [f3(t + tu(.04)), .82, 'out'], [f3(t + tu(.12)), 1, 'soft']); K.push([H, 1], [f3(H + tu(.05)), .8, 'out'], [f3(H + tu(.18)), 1, 'soft']); }
        const g = mvG(popAt(p, x, y0, tu(.18 + .06 * (sd + 1))), { px: x, py: y0, s: K }); g.circle(x, y0, 54, F(3.4)); if (act) R(litOn(g, H), x - 54, y0 - 54, 108, 108, 54, FILL);
        g.line(x - 20, y0, x + 20, y0, W(5)); if (sd > 0) g.line(x, y0 - 20, x, y0 + 20, W(5));
      });
      numRow(p, p, v, u, 0, y0 + 42, { size: 120, maxW: 520, t0: tu(.38) }); ripple(p, dn ? -360 : 360, y0, 60, H);
      dropBox(p, c, ic, 0, -200, 130, tu(.04), tu(.26));
    }); });

  /* 20 ── DONUT (โดนัท): the donut track draws, a wide arc fills to the amount with a bright edge riding its end; the icon sits in the hole (it pops,
     then punches on H); the number counts on the right with the unit and locks on H. */
  variant('donut', 'โดนัท', (d, c) => { const v = VAL(d), u = UN(d), ic = ICN(d), H = Z.H, fr = frac(d), cx = ic ? -230 : -250, cy = 0, r = 170, t0 = tu(.3), t1 = f3(H - tu(.04));
    art(c, p => { drawAt(p.circle(cx, cy, r, { sw: 64, stroke: TL_(.12) }), p, tu(.04), tu(.3)); p.circle(cx, cy, r + 34, S(1.6)); p.circle(cx, cy, r - 34, S(1.6));
      if (fr > 0) { on(p.path(arcD(cx, cy, r, fr), { sw: 56, stroke: TA(.55) }), p, 0, { draw: fillK(t0, t1) });
        const a = rad(-90 + 360 * fr), e = mvG(p, { px: cx, py: cy, r: ridK(360 * fr, t0, t1), o: fadeIn(t0, .04) }); e.line(f1(cx + (r - 32) * Math.cos(a)), f1(cy + (r - 32) * Math.sin(a)), f1(cx + (r + 32) * Math.cos(a)), f1(cy + (r + 32) * Math.sin(a)), W(5)); }
      if (ic) { popAt(p, cx, cy, tu(.14)).circle(cx, cy, 90, F(3)); put(p, c, { icon: ic }, cx, cy, 110, null, { t: tu(.16), punch: H }); }
      const n = numRow(p, p, v, u, 20, 50, { size: 150, maxW: 450, anchor: 'start', t0: tu(.3) }); if (n) ripple(p, n.x0 + n.nw / 2, n.cy, 110, H);
      dirB(p, DIRV(d), 420, -150, f3(H + tu(.1)));
    }); });

  /* ================= designs 21–50 (user 2026-11-14 "ออกแบบเพิ่มอีก 30 อัน") — same rules: graphic elements only, icon apart from words,
     the number locks on H, colours from the theme (ACC1 = what lights up, TL_() = faint line tints) ================= */
  /* an icon in a round plate that pops at t (o.g = draw into this group; o.mv = the keys it rides) */
  function icirc(p, c, ic, x, y, r, t, o = {}) { if (!ic) return null; const g = o.g || popAt(p, x, y, t); g.circle(x, y, r, F(3.4)); g.circle(x, y, r - 12, S(1.4));
    put(p, c, { icon: ic }, x, y, r * 1.15, null, { t: f3(t + tu(.04)), mv: o.mv, punch: o.punch }); return g; }
  const rowOf = (p, v, u, s0, maxW) => v ? rowW(p, v, u, s0, maxW) : 0;
  const hexD = (x, y, r) => pathOf([0, 1, 2, 3, 4, 5].map(k => [f1(x + r * Math.cos(rad(-90 + 60 * k))), f1(y + r * Math.sin(rad(-90 + 60 * k)))]));
  /* repeating turn: r keys that spin from t0 to t1 by deg, easing to a stop */
  const spinR = (t0, t1, deg) => [[0, 0], [t0, 0], [t1, deg, 'out']];

  /* 21 ── ICON CHIP (ชิปไอคอน): a chip slides in top-left (dot · icon · a grey line); the number counts big underneath, a rule draws under it and two
     grey text lines grow in a wave; dir badge top-right */
  variant('chipnum', 'ชิปไอคอน', (d, c) => { const v = VAL(d), u = UN(d), ic = ICN(d), H = Z.H;
    art(c, p => { const gx = glide(-90, tu(.06), tu(.3)), g = mvG(p, { x: gx, o: fadeIn(tu(.06)) }), cw = ic ? 270 : 220;
      R(g, -430, -250, cw, 92, 46, F(3)); g.circle(-386, -204, 9, { fill: ACC1, sw: 1, stroke: ACC1 }); if (ic) put(p, c, { icon: ic }, -322, -204, 62, null, { t: tu(.1), mv: { px: -322, py: -204, x: gx } });
      R(g, ic ? -280 : -360, -217, ic ? 100 : 130, 26, 13, PH);
      const n = numRow(p, p, v, u, -430, 80, { size: 210, maxW: 860, anchor: 'start', t0: tu(.3) }); drawAt(p.line(-430, 140, 430, 140, S(2)), p, tu(.34), tu(.3));
      [[-430, 300], [-110, 200]].forEach(([x, w], k) => R(mvG(p, { px: x, py: 200, sx: [[0, 0], [tu(.5 + .08 * k), 0], [tu(.7 + .08 * k), 1, 'out']], o: fadeIn(tu(.5 + .08 * k), .04) }), x, 187, w, 26, 13, PH));
      if (n) ripple(p, n.x0 + n.nw / 2, n.cy, 130, H); dirB(p, DIRV(d), 400, -204, f3(H + tu(.1)));
    }); });

  /* 22 ── HALO RINGS (วงซ้อนรอบตัวเลข): three rings draw round one after another (the middle one dashed and turning); the icon box travels round the
     outer ring and parks at its shoulder; the number counts in the middle, on H the rings pulse outward in a wave */
  variant('halo', 'วงซ้อน', (d, c) => { const v = VAL(d), u = UN(d), ic = ICN(d), H = Z.H, cx = 0, cy = -20;
    art(c, p => { [[150, S(2.4)], [200, { sw: 2.4, stroke: TL_(.45), 'stroke-dasharray': '6 14' }], [250, { sw: 2, stroke: TL_(.28) }]].forEach(([r, o], k) => {
        const pg = mvG(p, { px: cx, py: cy, s: bumpK(f3(H + tu(.04 * k)), 1.05) }), rg = k === 1 ? mvG(pg, { px: cx, py: cy, r: spinR(tu(.1), f3(H + tu(.3)), 160) }) : pg; drawAt(rg.circle(cx, cy, r, o), p, tu(.06 + .08 * k), tu(.3)); });
      const n = num(p, p, v, cx, cy + 40, { size: 120, maxW: 250, t0: tu(.3) }); pill(p, u, cx, cy + 105, { t: f3(H + tu(.06)), size: 26, maxW: 240 }); ripple(p, cx, cy, 150, H);
      if (ic) { const K = { px: cx, py: cy, r: [[0, -200], [tu(.2), -200], [tu(.6), 6, 'out'], [tu(.7), 0, 'soft']] }, g = mvG(p, Object.assign({ o: fadeIn(tu(.2), .04) }, K));
        const a = rad(-45), x = f1(cx + 250 * Math.cos(a)), y = f1(cy + 250 * Math.sin(a)); ibox(p, c, { icon: ic }, x, y, 100, tu(.2), { g, mv: K, punch: tu(.62) }); }
    }); });

  /* 23 ── CORNER LOCK (มุมล็อกกรอบ): four corner brackets fly in from far out and lock round the number (a bump, they light on H); the icon box drops
     onto the frame's top edge */
  variant('corners', 'มุมล็อกกรอบ', (d, c) => { const v = VAL(d), u = UN(d), ic = ICN(d), H = Z.H, cy = 50;
    art(c, p => { const rw = rowOf(p, v, u, 190, 760), hw = Math.max(200, rw / 2 + 70), hh = 140, L = 70;
      [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sy], k) => { const x = sx * hw, y = cy + sy * hh, dd = `M ${x} ${f1(y - sy * L)} L ${x} ${y} L ${f1(x - sx * L)} ${y}`, t = tu(.2 + .04 * k);
        const g = mvG(p, { x: [[0, sx * 160], [t, sx * 160], [f3(t + tu(.3)), -sx * 8, 'out'], [f3(t + tu(.4)), 0, 'soft']], y: [[0, sy * 120], [t, sy * 120], [f3(t + tu(.3)), -sy * 6, 'out'], [f3(t + tu(.4)), 0, 'soft']], o: fadeIn(t, .04) });
        g.path(dd, W(6)); litOn(g, H).path(dd, { sw: 6, stroke: ACC1 }); });
      const n = numRow(p, p, v, u, 0, cy + 64, { size: 190, maxW: 760, t0: tu(.36) }); if (n) ripple(p, n.cx, n.cy, 140, H);
      dropBox(p, c, ic, 0, cy - hh - 70, 120, tu(.3), tu(.52));
    }); });

  /* 24 ── CORNER BADGE (ป้ายมุม): a big rounded square pops; the number counts inside; a round icon badge falls onto its top-right corner and
     squashes, dust; the dir badge on the bottom-left corner */
  variant('badge', 'ป้ายมุม', (d, c) => { const v = VAL(d), u = UN(d), ic = ICN(d), H = Z.H, x0 = -340, y0 = -150, w = 600, h = 360;
    art(c, p => { R(inG(p, 'pop', x0 + w / 2, y0 + h / 2, tu(.04)), x0, y0, w, h, 50, F(4.4)); R(atG(p, tu(.2)), x0 + 22, y0 + 22, w - 44, h - 44, 32, S(1.4));
      const n = numRow(p, p, v, u, x0 + w / 2, y0 + h / 2 + 66, { size: 180, maxW: w - 90, t0: tu(.3) }); if (n) ripple(p, n.cx, n.cy, 130, H);
      if (ic) { const bx = x0 + w, by = y0, K = fallK(bx, by + 80, tu(.36), tu(.56), by + 80 + 350), g = mvG(CL(p), K); icirc(p, c, ic, bx, by, 80, tu(.36), { g, mv: K, punch: tu(.58) }); dust(p, bx, by + 80, tu(.56), .8); }
      dirB(p, DIRV(d), x0, y0 + h, f3(H + tu(.1)), 40);
    }); });

  /* 25 ── VERTICAL BAR (แท่งแนวตั้ง): a tall capsule fills from the bottom to the amount, a level line riding its top, ticks light as it passes; the
     number counts to its right and locks on H; the icon box drops top-right */
  variant('vbar', 'แท่งแนวตั้ง', (d, c) => { const v = VAL(d), u = UN(d), ic = ICN(d), H = Z.H, fr = frac(d), x = -330, y0 = -280, y1 = 280, t0 = tu(.3), t1 = f3(H - tu(.04));
    art(c, p => { R(inG(p, 'rise', x, 0, tu(.04)), x - 60, y0, 120, y1 - y0, 60, F(3.6));
      for (let k = 0; k <= 8; k++) { const y = y1 - 30 - k * (y1 - y0 - 60) / 8, lit = (k / 8) <= fr + 1e-6 && fr > 0; p.line(x + 80, y, x + (k % 4 ? 100 : 116), y, S(1.8)); if (lit) litOn(p, f3(t0 + (t1 - t0) * (k / 8) / Math.max(fr, .01))).line(x + 80, y, x + (k % 4 ? 100 : 116), y, { sw: 3, stroke: ACC1 }); }
      if (fr > 0) { const fh = Math.max(40, (y1 - y0 - 16) * fr); R(mvG(p, { px: x, py: y1 - 8, sy: fillK(t0, t1), o: fadeIn(t0, .04) }), x - 50, y1 - 8 - fh, 100, fh, 50, FILL);
        const ly = y1 - 8 - fh; mvG(p, { y: [[0, f1(fh - 30)], [t0, f1(fh - 30)], [t1, 0, 'io']], o: fadeIn(t0, .04) }).line(x - 74, ly, x + 74, ly, { sw: 5, stroke: ACC1 }); ripple(p, x, ly, 60, H); }
      numRow(p, p, v, u, -170, 70, { size: 190, maxW: 620, anchor: 'start', t0: tu(.3) }); dropBox(p, c, ic, 380, -240, 130, tu(.04), tu(.26)); dirB(p, DIRV(d), ic ? 380 : 420, ic ? 230 : -240, f3(H + tu(.1)));
    }); });

  /* 26 ── STEPS (ขั้นบันได): five blocks rise one after another as steps (going up, or down when dir is down); a dot hops from step to step and lands
     on the last on H with a ripple; the number sits by the last step */
  variant('steps', 'ขั้นบันได', (d, c) => { const v = VAL(d), u = UN(d), ic = ICN(d), H = Z.H, dn = DIRV(d) === 'down', by = 290;
    const hs = [70, 130, 190, 250, 310].map((h, k, a) => dn ? a[4 - k] : h), tops = hs.map((h, k) => [-420 + k * 112 + 50, by - h]);
    art(c, p => { drawAt(p.line(-460, by, 460, by, S(2)), p, tu(.04), tu(.3));
      hs.forEach((h, k) => { const x = -420 + k * 112; R(mvG(p, upK(x + 50, by, tu(.1 + .07 * k))), x, by - h, 100, h, 14, k === 4 ? { fill: LIT, sw: 4, stroke: ACC1 } : F(3.2)); });
      const L = [[tops[0][0], tops[0][1] - 20]]; for (let k = 1; k < 5; k++) { const a = L[L.length - 1], b = [tops[k][0], tops[k][1] - 20]; L.push([(a[0] + b[0]) / 2, Math.min(a[1], b[1]) - 70], b); }
      const K = pathK(L, tu(.5), f3(H - tu(.04)), L[L.length - 1], 40), E = L[L.length - 1]; mvG(p, { x: K.x, y: K.y, o: fadeIn(tu(.5), .04) }).circle(E[0], E[1], 16, { fill: ACC1, sw: 2, stroke: ACC1 }); ripple(p, E[0], E[1], 40, H);
      const ny = dn ? -60 : Math.min(140, tops[4][1] + 90); numRow(p, p, v, u, dn ? 460 : 30, dn ? -150 : -150, { size: 150, maxW: dn ? 560 : 430, anchor: dn ? 'end' : 'start', t0: tu(.4) });
      dropBox(p, c, ic, dn ? 380 : -380, dn ? 120 : -240, 120, tu(.04), tu(.26));
    }); });

  /* 27 ── NINE TILES (ตาราง 9 ช่อง): a 3×3 grid of tiles flips in along the diagonal; tiles light one by one up to the amount; the icon sits in the middle
     tile; the number counts on the right */
  variant('grid9', 'ตาราง 9 ช่อง', (d, c) => { const v = VAL(d), u = UN(d), ic = ICN(d), H = Z.H, fr = frac(d), lit = Math.round(fr * 9), gx = -270, gy = 0, sz = 118, gp = 14, t0 = tu(.4), t1 = f3(H - tu(.04));
    art(c, p => { const ord = [0, 1, 3, 2, 4, 6, 5, 7, 8];
      for (let k = 0; k < 9; k++) { const i = k % 3, j = Math.floor(k / 3), x = gx + (i - 1) * (sz + gp), y = gy + (j - 1) * (sz + gp), t = tu(.06 + .04 * (i + j)), g = mvG(p, spinK(x, y, t)); R(g, x - sz / 2, y - sz / 2, sz, sz, 24, F(3.2));
        const r = ord.indexOf(k); if (r < lit) { const tl = f3(t0 + (t1 - t0) * (lit > 1 ? r / (lit - 1) : 1)); R(mvG(p, { px: x, py: y, s: bumpK(tl, 1.1), o: fadeIn(tl, .03) }), x - sz / 2 + 8, y - sz / 2 + 8, sz - 16, sz - 16, 18, FILL); } }
      if (ic) put(p, c, { icon: ic }, gx, gy, 72, null, { t: tu(.3), punch: H });
      const n = numRow(p, p, v, u, -40, 60, { size: 170, maxW: 500, anchor: 'start', t0: tu(.3) }); if (n) ripple(p, n.x0 + n.nw / 2, n.cy, 120, H); dirB(p, DIRV(d), 420, -230, f3(H + tu(.1)));
    }); });

  /* 28 ── TOGGLE (สวิตช์): a wide switch pops; its knob (the icon riding in it) slides across, the track lights — "on"; then the number counts big
     underneath and locks on H */
  variant('toggle', 'สวิตช์', (d, c) => { const v = VAL(d), u = UN(d), ic = ICN(d), H = Z.H, ty = -160, tx = 0, tw2 = 330, th = 160, ta = tu(.34), tb = tu(.6);
    art(c, p => { R(inG(p, 'pop', tx, ty, tu(.04)), tx - tw2 / 2, ty - th / 2, tw2, th, th / 2, F(4)); R(litOn(p, tb), tx - tw2 / 2 + 8, ty - th / 2 + 8, tw2 - 16, th - 16, th / 2 - 8, FILL);
      const kx = tx + tw2 / 2 - th / 2, K = { px: kx, py: ty, x: [[0, -(tw2 - th)], [ta, -(tw2 - th)], [tb, 8, 'out'], [f3(tb + tu(.1)), 0, 'soft']] }, g = mvG(p, Object.assign({ o: fadeIn(tu(.12), .04) }, K));
      g.circle(kx, ty, th / 2 - 14, F(3.6)); if (ic) put(p, c, { icon: ic }, kx, ty, 82, null, { t: tu(.14), mv: K, punch: tb }); ripple(p, kx, ty, 70, tb);
      const n = numRow(p, p, v, u, 0, 190, { size: 190, maxW: 860, t0: tb }); if (n) ripple(p, n.cx, n.cy, 130, H); dirB(p, DIRV(d), 330, ty, f3(H + tu(.1)));
    }); });

  /* 29 ── TWO RINGS (วงสองชั้น): an outer arc fills to the amount (dot riding its end), an inner dashed ring turns; the icon sits inside at the top,
     the number counts below it; the unit pill under the rings */
  variant('dualring', 'วงสองชั้น', (d, c) => { const v = VAL(d), u = UN(d), ic = ICN(d), H = Z.H, fr = frac(d), cx = 0, cy = -40, r = 220, t0 = tu(.3), t1 = f3(H - tu(.04));
    art(c, p => { drawAt(p.circle(cx, cy, r, { sw: 10, stroke: TL_(.16) }), p, tu(.04), tu(.3));
      drawAt(mvG(p, { px: cx, py: cy, r: spinR(tu(.1), f3(H + tu(.4)), -220) }).circle(cx, cy, 168, { sw: 3, stroke: TL_(.5), 'stroke-dasharray': '4 16' }), p, tu(.1), tu(.3));
      if (fr > 0) { on(p.path(arcD(cx, cy, r, fr), { sw: 10, stroke: ACC1 }), p, 0, { draw: fillK(t0, t1) }); const a = rad(-90 + 360 * fr);
        mvG(p, { px: cx, py: cy, r: ridK(360 * fr, t0, t1), o: fadeIn(t0, .04) }).circle(f1(cx + r * Math.cos(a)), f1(cy + r * Math.sin(a)), 18, { fill: ACC1, sw: 2, stroke: ACC1 }); }
      if (ic) put(p, c, { icon: ic }, cx, cy - 70, 80, null, { t: tu(.2), punch: H }); num(p, p, v, cx, ic ? cy + 70 : cy + 40, { size: ic ? 100 : 130, maxW: 270, t0: tu(.3) });
      ripple(p, cx, cy, 160, H); pill(p, u, cx, 260, { t: f3(H + tu(.06)), size: 32, maxW: 460 });
    }); });

  /* 30 ── WAFFLE (ตารางสี่เหลี่ยม): a 10×10 grid of small squares; they fill row by row from the bottom up to the amount (all when there is no %);
     the number counts on the left with the icon box above it */
  variant('waffle', 'ตารางสี่เหลี่ยม', (d, c) => { const v = VAL(d), u = UN(d), ic = ICN(d), H = Z.H, fr = frac(d), lit = Math.round(fr * 100), t0 = tu(.36), t1 = f3(H - tu(.04)), x0 = 70, y0 = -190, st = 37;
    art(c, p => { for (let k = 0; k < 100; k++) { const i = k % 10, j = 9 - Math.floor(k / 10), x = x0 + i * st, y = y0 + j * st; on(R(p, x, y, 30, 30, 7, S(1.6)), p, 0, { o: fadeIn(tu(.04 + .004 * (i + (9 - j) * 2)), .06) });
        if (k < lit) { const tl = f3(t0 + (t1 - t0) * (lit > 1 ? k / (lit - 1) : 1)); R(litOn(p, tl), x + 4, y + 4, 22, 22, 5, { fill: ACC1, sw: 0, stroke: 'none' }); } }
      numRow(p, p, v, u, -440, 90, { size: 160, maxW: 470, anchor: 'start', t0: tu(.3) }); dropBox(p, c, ic, -380, -170, 130, tu(.04), tu(.26)); if (!ic) dirB(p, DIRV(d), -400, -170, f3(H + tu(.1)));
    }); });

  /* 31 ── TIMELINE (เส้นเวลา): a long line with ticks draws in; a marker card (the number counting inside) glides along it and stops at the amount on H,
     the ticks it passes light up; the icon box drops at the top-left */
  variant('timeline', 'เส้นเวลา', (d, c) => { const v = VAL(d), u = UN(d), ic = ICN(d), H = Z.H, ps = posV(d), ly = 200, x0 = -440, x1 = 440, t0 = tu(.34), t1 = f3(H - tu(.04));
    art(c, p => { drawAt(p.line(x0, ly, x1, ly, W(3.4)), p, tu(.04), tu(.3)); const mx = f1(x0 + 20 + (x1 - x0 - 40) * ps);
      for (let k = 0; k <= 16; k++) { const x = f1(x0 + 20 + k * (x1 - x0 - 40) / 16), h = k % 4 ? 16 : 30; on(p.line(x, ly - h, x, ly + h, S(2)), p, 0, { o: fadeIn(tu(.06 + .015 * k), .04) });
        if (x <= mx + 1 && ps > 0) litOn(p, f3(t0 + (t1 - t0) * (x - x0 - 20) / Math.max(1, mx - x0 - 20))).line(x, ly - h, x, ly + h, { sw: 3.4, stroke: ACC1 }); }
      const bw = Math.min(600, (v ? tw(p, v, 100) : 100) + (u ? tw(p, u, 36, 600) + 20 : 0) + 80), bx = Math.max(-480 + bw / 2, Math.min(480 - bw / 2, mx)), dx = f1(x0 + 20 - mx);
      const g = mvG(p, { x: [[0, dx], [t0, dx], [t1, 0, 'io']], o: fadeIn(tu(.3), .04) }); R(g, bx - bw / 2, -10, bw, 140, 26, F(3.6)); g.path(`M ${mx - 16} 129 L ${mx} ${ly - 24} L ${mx + 16} 129`, F(3.6)); g.line(mx - 14, 128, mx + 14, 128, { sw: 6, stroke: C.fill });
      numRow(p, g, v, u, bx, 96, { size: 100, maxW: bw - 60, t0: tu(.34), g }); g.circle(mx, ly, 12, { fill: ACC1, sw: 2, stroke: ACC1 }); ripple(p, mx, ly, 40, H);
      dropBox(p, c, ic, -400, -230, 120, tu(.04), tu(.26)); dirB(p, DIRV(d), 420, -230, f3(H + tu(.1)));
    }); });

  /* 32 ── TICK SCALE (สเกลขีด): the number counts big at the top; under it a scale of ticks draws in and lights from the left as a pointer slides to
     the amount and settles (overshoot); the icon box drops top-left */
  variant('ticks', 'สเกลขีด', (d, c) => { const v = VAL(d), u = UN(d), ic = ICN(d), H = Z.H, ps = posV(d), sy = 210, t0 = tu(.34), t1 = f3(H - tu(.04)), N = 40;
    art(c, p => { const n = numRow(p, p, v, u, ic ? 60 : 0, 30, { size: 200, maxW: ic ? 740 : 860, t0: tu(.3) }); if (n) ripple(p, n.cx, n.cy, 140, H);
      for (let k = 0; k <= N; k++) { const x = f1(-420 + 840 * k / N), h = k % 5 ? 22 : 44; on(p.line(x, sy, x, sy + h, S(2)), p, 0, { o: fadeIn(tu(.08 + .006 * k), .04) });
        if (k / N <= ps + 1e-6 && ps > 0) litOn(p, f3(t0 + (t1 - t0) * (k / N) / ps)).line(x, sy, x, sy + h, { sw: 3.4, stroke: ACC1 }); }
      const px = f1(-420 + 840 * ps); mvG(p, { x: [[0, f1(-420 - px)], [t0, f1(-420 - px)], [t1, 10, 'out'], [f3(t1 + tu(.1)), 0, 'soft']], o: fadeIn(tu(.3), .04) }).path(`M ${px - 20} ${sy - 40} L ${px + 20} ${sy - 40} L ${px} ${sy - 8} Z`, { fill: ACC1, sw: 3, stroke: ACC1 });
      dropBox(p, c, ic, -400, -230, 110, tu(.04), tu(.26));
    }); });

  /* 33 ── REVEAL CIRCLE (วงกลมเปิด): a soft lit disc grows from the centre with two rings rippling out while the number counts inside; it locks on H;
     the icon box rolls in to sit on the disc's lower right edge; the unit pill under */
  variant('reveal', 'วงกลมเปิด', (d, c) => { const v = VAL(d), u = UN(d), ic = ICN(d), H = Z.H, cx = 0, cy = -30, r = 220;
    art(c, p => { const g = mvG(p, { px: cx, py: cy, s: [[0, 0], [tu(.06), 0], [tu(.4), 1.05, 'out'], [tu(.5), 1, 'soft']], o: fadeIn(tu(.06), .04) }); g.circle(cx, cy, r, F(4)); g.circle(cx, cy, r - 16, { fill: TL_(.05), sw: 0, stroke: 'none' });
      [tu(.5), tu(.8)].forEach(t => ripple(p, cx, cy, r, t)); num(p, p, v, cx, cy + 50, { size: 140, maxW: 340, t0: tu(.3) }); ripple(p, cx, cy, r - 40, H);
      if (ic) { const x = f1(cx + r * Math.cos(rad(40))), y = f1(cy + r * Math.sin(rad(40))), K = { px: x, py: y, x: [[0, 300], [tu(.3), 300], [tu(.6), -6, 'out'], [tu(.7), 0, 'soft']], r: [[0, 200], [tu(.3), 200], [tu(.6), -6, 'out'], [tu(.7), 0, 'soft']] };
        icirc(p, c, ic, x, y, 62, tu(.3), { g: mvG(CL(p), Object.assign({ o: fadeIn(tu(.3), .04) }, K)), mv: K, punch: tu(.62) }); }
      pill(p, u, cx, 270, { t: f3(H + tu(.06)), size: 32, maxW: 460 });
    }); });

  /* 34 ── BIG BRACKETS (วงเล็บใหญ่): two tall square brackets slam in from the sides (dust at their feet) and hold the number between them; on H they
     push out a little as the number punches; the icon box drops above */
  variant('brackets', 'วงเล็บใหญ่', (d, c) => { const v = VAL(d), u = UN(d), ic = ICN(d), H = Z.H, cy = 60;
    art(c, p => { const rw = rowOf(p, v, u, 190, 700), hx = Math.min(470, Math.max(170, rw / 2 + 60)), y0 = cy - 150, y1 = cy + 150;
      [-1, 1].forEach(sd => { const x = sd * hx, t = tu(.2 + .06 * (sd + 1)), g = mvG(CL(p), { x: [[0, sd * 300], [t, sd * 300], [f3(t + tu(.16)), 0, 'in'], [f3(t + tu(.22)), sd * 10, 'out'], [f3(t + tu(.32)), 0, 'soft'], [H, 0], [f3(H + tu(.06)), sd * 12, 'out'], [f3(H + tu(.24)), 0, 'soft']], o: fadeIn(t, .04) });
        g.path(`M ${f1(x - sd * 40)} ${y0} L ${x} ${y0} L ${x} ${y1} L ${f1(x - sd * 40)} ${y1}`, W(7)); dust(p, x, y1, f3(t + tu(.16)), .7); });
      const n = numRow(p, p, v, u, 0, cy + 64, { size: 190, maxW: 2 * hx - 100, t0: tu(.4) }); if (n) ripple(p, n.cx, n.cy, 130, H);
      dropBox(p, c, ic, 0, y0 - 90, 110, tu(.04), tu(.26)); dirB(p, DIRV(d), hx, y0 - 50, f3(H + tu(.1)));
    }); });

  /* 35 ── ORBIT (จุดโคจร): the icon plate pops on the left; three dots orbit it on a dashed path and slow to a stop on H; the number counts on the right
     and locks on H */
  variant('orbit', 'จุดโคจร', (d, c) => { const v = VAL(d), u = UN(d), ic = ICN(d), H = Z.H, cx = ic ? -270 : -300, cy = -10;
    art(c, p => { if (ic) icirc(p, c, ic, cx, cy, 100, tu(.06), { punch: H }); else popAt(p, cx, cy, tu(.06)).circle(cx, cy, 30, { fill: ACC1, sw: 2, stroke: ACC1 });
      drawAt(p.circle(cx, cy, 160, { sw: 2, stroke: TL_(.4), 'stroke-dasharray': '5 12' }), p, tu(.1), tu(.3));
      const og = mvG(p, { px: cx, py: cy, r: [[0, 0], [tu(.3), 0], [f3(H - tu(.04)), 540, 'out']], o: fadeIn(tu(.3), .04) }); [0, 120, 240].forEach((a, k) => og.circle(f1(cx + 160 * Math.cos(rad(a - 90))), f1(cy + 160 * Math.sin(rad(a - 90))), k ? 10 : 15, { fill: ACC1, sw: 2, stroke: ACC1 }));
      const n = numRow(p, p, v, u, -60, 60, { size: 180, maxW: 520, anchor: 'start', t0: tu(.3) }); if (n) ripple(p, n.x0 + n.nw / 2, n.cy, 120, H); dirB(p, DIRV(d), 420, -220, f3(H + tu(.1)));
    }); });

  /* 36 ── COUNTER BOX (กล่องนับ): a long box slides in from the right; the icon box drops on its left end, joined by a short bar; the number counts
     inside and a thin strip along the box's bottom fills to the amount, locking on H */
  variant('counterbox', 'กล่องนับ', (d, c) => { const v = VAL(d), u = UN(d), ic = ICN(d), H = Z.H, fr = frac(d), bx0 = ic ? -200 : -440, bx1 = 440, cy = 0, h = 250, t0 = tu(.36), t1 = f3(H - tu(.04));
    art(c, p => { const g = mvG(p, { x: glide(260, tu(.06), tu(.34), -8), o: fadeIn(tu(.06), .06) }); R(g, bx0, cy - h / 2, bx1 - bx0, h, 40, F(4.2));
      R(g, bx0 + 34, cy + h / 2 - 40, bx1 - bx0 - 68, 14, 7, { fill: TL_(.12), sw: 0, stroke: 'none' });
      if (fr > 0) R(mvG(p, { px: bx0 + 34, py: cy + h / 2 - 33, sx: fillK(t0, t1), o: fadeIn(t0, .04) }), bx0 + 34, cy + h / 2 - 40, Math.max(14, (bx1 - bx0 - 68) * fr), 14, 7, { fill: ACC1, sw: 0, stroke: 'none' });
      if (ic) { drawAt(p.line(-280, cy, bx0, cy, W(4)), p, tu(.3), tu(.12)); dropBox(p, c, ic, -360, cy, 160, tu(.04), tu(.28)); }
      const n = numRow(p, p, v, u, (bx0 + bx1) / 2, cy + 40, { size: 150, maxW: bx1 - bx0 - 90, t0: tu(.36) }); if (n) ripple(p, n.cx, n.cy, 110, H);
    }); });

  /* 37 ── RANKED BARS (แถบเรียงแนวนอน) — redesigned (user 2026-11-14 "Redesign 37" → picked A over callout / area peak; the radial bars are gone): three bars grow from the left one after another; the two soft ones stop short, the lit middle one runs on and
     carries the number at its tip, locking on H; the icon box drops at the lit bar's start */
  variant('hbars', 'แถบเรียงแนวนอน', (d, c) => { const v = VAL(d), u = UN(d), ic = ICN(d), H = Z.H, fr = Math.max(.25, frac(d)), x0 = ic ? -300 : -440, ys = [-150, 0, 150], t0 = tu(.34), t1 = f3(H - tu(.04));
    art(c, p => { const rw = rowOf(p, v, u, 130, 420), room = 440 - rw - 30 - x0, L = Math.max(60, room * fr);
      [[ys[0], .55], [ys[2], .32]].forEach(([y, k], i) => { const t = tu(.1 + .08 * i); R(mvG(p, { px: x0, py: y, sx: [[0, 0], [t, 0], [f3(t + tu(.4)), 1, 'out']], o: fadeIn(t, .04) }), x0, y - 26, Math.max(40, room * k), 52, 26, { fill: TL_(.18), sw: 0, stroke: 'none' }); });
      R(mvG(p, { px: x0, py: ys[1], sx: fillK(t0, t1), o: fadeIn(t0, .04) }), x0, ys[1] - 34, L, 68, 34, { fill: TA(.85), sw: 0, stroke: 'none' });
      const g = mvG(p, { x: [[0, f1(-L)], [t0, f1(-L)], [t1, 0, 'io']], o: fadeIn(t0, .04) }); numRow(p, g, v, u, x0 + L + 30, ys[1] + 46, { size: 130, maxW: 420, anchor: 'start', t0, g });
      ripple(p, x0 + L, ys[1], 60, H); dropBox(p, c, ic, -390, ys[1], 110, tu(.04), tu(.26)); dirB(p, DIRV(d), 420, -260, f3(H + tu(.1)));
    }); });

  /* 38 ── EQUALIZER (อีควอไลเซอร์): nine bars bounce like a level meter while the number counts, then settle into a rising (or falling) line on H, the
     last bar lit; the icon box drops top-right */
  variant('equalizer', 'อีควอไลเซอร์', (d, c) => { const v = VAL(d), u = UN(d), ic = ICN(d), H = Z.H, dr = DIRV(d), by = 290, mh = 240;
    const fin = Array.from({ length: 9 }, (_, k) => dr === 'down' ? 1 - k * .09 : dr === 'up' ? .2 + k * .1 : .35 + .55 * Math.sin(k / 8 * Math.PI) * .9 + (k === 8 ? .3 : 0));
    art(c, p => { drawAt(p.line(-450, by, 360, by, S(2)), p, tu(.04), tu(.3));
      fin.forEach((f, k) => { const x = -430 + k * 86, hh = mh * Math.min(1, f), K = [[0, 0], [tu(.1 + .02 * k), 0]]; let t = tu(.24 + .02 * k), z = 0;
        while (t < H - tu(.16)) { K.push([f3(t), f1(.25 + .75 * Math.abs(Math.sin(k * 2.1 + z * 1.7))), 'io']); t += tu(.12); z++; } K.push([f3(H - tu(.04)), 1.06, 'out'], [f3(H + tu(.08)), 1, 'soft']);
        R(mvG(p, { px: x + 30, py: by, sy: K, o: fadeIn(tu(.1 + .02 * k), .04) }), x, by - hh, 60, hh, 14, k === 8 ? { fill: LIT, sw: 4, stroke: ACC1 } : F(3)); });
      numRow(p, p, v, u, -430, -130, { size: 160, maxW: ic ? 640 : 860, anchor: 'start', t0: tu(.3) }); dropBox(p, c, ic, 390, -220, 120, tu(.04), tu(.26));
    }); });

  /* 39 ── SEGMENT RING (วงแบ่งท่อน): ten arc pieces make a ring; they light one by one round it up to the amount; the icon pops in the middle; the number
     counts on the right */
  variant('segring', 'วงแบ่งท่อน', (d, c) => { const v = VAL(d), u = UN(d), ic = ICN(d), H = Z.H, fr = frac(d), lit = Math.round(fr * 10), cx = -240, cy = 0, r = 170, t0 = tu(.36), t1 = f3(H - tu(.04));
    art(c, p => { for (let k = 0; k < 10; k++) { const a0 = -90 + k * 36 + 3, a1 = a0 + 30, P = a => f1(cx + r * Math.cos(rad(a))) + ' ' + f1(cy + r * Math.sin(rad(a))), dd = `M ${P(a0)} A ${r} ${r} 0 0 1 ${P(a1)}`;
        drawAt(p.path(dd, { sw: 34, stroke: TL_(.16) }), p, tu(.04 + .02 * k), tu(.1)); if (k < lit) { const tl = f3(t0 + (t1 - t0) * (lit > 1 ? k / (lit - 1) : 1)); on(p.path(dd, { sw: 34, stroke: ACC1 }), p, 0, { o: fadeIn(tl, .04) }); } }
      if (ic) icirc(p, c, ic, cx, cy, 86, tu(.14), { punch: H }); const n = numRow(p, p, v, u, 0, 50, { size: 160, maxW: 450, anchor: 'start', t0: tu(.3) }); if (n) ripple(p, n.x0 + n.nw / 2, n.cy, 110, H);
      dirB(p, DIRV(d), 420, -210, f3(H + tu(.1)));
    }); });

  /* 40 ── LINKED PILLS (เม็ดต่อกัน): an icon pill, the number pill and the unit pill slide in one after another and click together (each bump);
     the number counts in its pill and locks on H */
  variant('tagrow', 'เม็ดต่อกัน', (d, c) => { const v = VAL(d), u = UN(d), ic = ICN(d), H = Z.H, cy = 0, gap = 26;
    art(c, p => { let nw = Math.min(560, (v ? tw(p, v, 130) : 100) + 90), uw = u ? Math.min(300, tw(p, u, 44, 600) + 70) : 0; const iw = ic ? 170 : 0, tot = iw + nw + uw + gap * ((ic ? 1 : 0) + (u ? 1 : 0)), k0 = Math.min(1, 940 / tot);
      nw *= k0; uw *= k0; let x = -tot * k0 / 2; const parts = [];
      if (ic) { parts.push(['i', x, iw * k0]); x += iw * k0 + gap; } parts.push(['n', x, nw]); x += nw + gap; if (u) parts.push(['u', x, uw]);
      parts.forEach(([kind, x0, w], k) => { const t = tu(.1 + .14 * k), gx = glide(k ? 220 : -220, t, f3(t + tu(.2)), k ? -10 : 10), g = mvG(CL(p), { x: gx, o: fadeIn(t, .04) }), h = kind === 'n' ? 200 : 150;   /* the first slides in from the left, the others from the right and knock into it */
        R(g, x0, cy - h / 2, w, h, h / 2, kind === 'n' ? F(4.4) : F(3.4)); if (k) dust(p, x0, cy, f3(t + tu(.2)), .5);
        if (kind === 'i') put(p, c, { icon: ic }, x0 + w / 2, cy, 90 * k0, null, { t, mv: { px: x0 + w / 2, py: cy, x: gx }, punch: H });
        if (kind === 'n') { num(p, g, v, x0 + w / 2, cy + 46 * k0, { size: 130 * k0, maxW: w - 50, t0: t, g }); ripple(p, x0 + w / 2, cy, 120, H); }
        if (kind === 'u') txt(g, u, x0 + w / 2, cy + 15, { size: 44 * k0, maxW: w - 40, weight: 600, color: C.soft }); });
      dirB(p, DIRV(d), 400, -200, f3(H + tu(.1)));
    }); });

  /* 41 ── CHIP STACK (ชิปซ้อนชั้น): flat bars drop one at a time onto a base and stack (each squashes); the top one lights on H; the number counts
     beside the stack; the icon box drops above it */
  variant('chipstack', 'ชิปซ้อนชั้น', (d, c) => { const v = VAL(d), u = UN(d), ic = ICN(d), H = Z.H, fr = pctV(d), dr = DIRV(d), N = fr != null ? Math.max(1, Math.round(fr * 8)) : dr === 'up' ? 7 : dr === 'down' ? 3 : 6, by = 280, cx = -290;
    art(c, p => { drawAt(p.line(-450, by, -130, by, S(2)), p, tu(.04), tu(.24)); const span = Math.max(tu(.1), (H - tu(.06)) - tu(.2));
      for (let k = 0; k < N; k++) { const y = by - 6 - k * 42, t1 = f3(tu(.2) + span * (k + 1) / N), K = fallK(cx, y, f3(t1 - tu(.18)), t1, Math.max(80, y + 350)), top = k === N - 1;
        R(mvG(CL(p), K), cx - 130, y - 34, 260, 34, 17, top ? { fill: LIT, sw: 4, stroke: ACC1 } : F(3)); if (top) ripple(p, cx, y - 17, 80, t1); }
      const n = numRow(p, p, v, u, -80, 80, { size: 180, maxW: 540, anchor: 'start', t0: tu(.3) }); dropBox(p, c, ic, ic ? 380 : -290, -230, 120, tu(.04), tu(.26));
      dirB(p, DIRV(d), ic ? 380 : 400, ic ? 230 : -230, f3(H + tu(.1)));
    }); });

  /* 42 ── ARROW (ลูกศรพุ่ง): a thick arrow shoots out of the icon box — up when the value goes up, down when it goes down, right otherwise; its head
     snaps on at the tip with a ripple and the number counts beside it */
  variant('arrow', 'ลูกศรพุ่ง', (d, c) => { const v = VAL(d), u = UN(d), ic = ICN(d), H = Z.H, dr = DIRV(d);
    const A = dr === 'up' ? [[-380, 230], [-110, -170]] : dr === 'down' ? [[-380, -230], [-110, 170]] : [[-380, 0], [-90, 0]], [a, b] = A, an = Math.atan2(b[1] - a[1], b[0] - a[0]);
    art(c, p => { if (ic) dropBox(p, c, ic, a[0], a[1], 130, tu(.04), tu(.26)); else popAt(p, a[0], a[1], tu(.06)).circle(a[0], a[1], 22, { fill: ACC1, sw: 2, stroke: ACC1 });
      const s0 = [f1(a[0] + 80 * Math.cos(an)), f1(a[1] + 80 * Math.sin(an))]; on(p.line(s0[0], s0[1], b[0], b[1], { sw: 12, stroke: ACC1 }), p, 0, { draw: [[0, 0], [tu(.34), 0], [f3(H - tu(.1)), 1, 'in']] });
      const hg = popAt(p, b[0], b[1], f3(H - tu(.1))), h1 = an + rad(150), h2 = an - rad(150); hg.path(`M ${f1(b[0] + 60 * Math.cos(h1))} ${f1(b[1] + 60 * Math.sin(h1))} L ${b[0]} ${b[1]} L ${f1(b[0] + 60 * Math.cos(h2))} ${f1(b[1] + 60 * Math.sin(h2))}`, { sw: 12, stroke: ACC1 });
      ripple(p, b[0], b[1], 50, f3(H - tu(.08))); const n = numRow(p, p, v, u, -20, 60, { size: 190, maxW: 480, anchor: 'start', t0: tu(.3) }); if (n) ripple(p, n.x0 + n.nw / 2, n.cy, 120, H);
    }); });

  /* 43 ── CARD HALVES (การ์ดประกบ): two halves of a card slide in from the sides and lock at the seam (bump + a flash); the icon box pops up on the seam
     above; the number counts across the joined card and locks on H */
  variant('splitcard', 'การ์ดประกบ', (d, c) => { const v = VAL(d), u = UN(d), ic = ICN(d), H = Z.H, cy = 50, w = 400, h = 300, tm = tu(.42);
    art(c, p => { [-1, 1].forEach(sd => { const g = mvG(CL(p), { x: [[0, sd * 520], [tu(.08), sd * 520], [tm, 0, 'in'], [f3(tm + tu(.06)), sd * 10, 'out'], [f3(tm + tu(.16)), 0, 'soft']], o: fadeIn(tu(.08), .04) });
        const e = sd * w, e1 = sd * (w - 40);   /* open at the seam: the fill closes along it, the stroke does not (no line through the number) */
        g.path(`M 0 ${cy - h / 2} L ${e1} ${cy - h / 2} Q ${e} ${cy - h / 2} ${e} ${cy - h / 2 + 40} L ${e} ${cy + h / 2 - 40} Q ${e} ${cy + h / 2} ${e1} ${cy + h / 2} L 0 ${cy + h / 2}`, F(4.2)); });
      const fl = sub(p); on(fl, p, 0, { o: [[0, 0], [tm, 0], [f3(tm + tu(.03)), 1], [f3(tm + tu(.3)), 0]] }); fl.line(0, cy - h / 2 - 40, 0, cy - h / 2 + 6, { sw: 6, stroke: ACC1 }); fl.line(0, cy + h / 2 - 6, 0, cy + h / 2 + 40, { sw: 6, stroke: ACC1 }); dust(p, 0, cy - h / 2, tm, .9);
      const n = numRow(p, p, v, u, 0, cy + 60, { size: 170, maxW: 2 * w - 90, t0: f3(tm + tu(.02)) }); if (n) ripple(p, n.cx, n.cy, 130, H);
      if (ic) ibox(p, c, { icon: ic }, 0, cy - h / 2 - 90, 120, f3(tm + tu(.04)), { punch: H }); dirB(p, DIRV(d), w, cy - h / 2, f3(H + tu(.1)));
    }); });

  /* 44 ── NOTICE CARD (การ์ดแจ้งเตือน): a notice card drops from above and bounces (icon box + two grey lines inside); a count pill pops on its top-right
     corner with the number counting inside, locking on H */
  variant('notice', 'การ์ดแจ้งเตือน', (d, c) => { const v = VAL(d), u = UN(d), ic = ICN(d), H = Z.H, cy = 60, w = 760, h = 220;
    art(c, p => { const K = fallK(0, cy + h / 2, tu(.04), tu(.26), cy + h / 2 + 350), g = mvG(CL(p), K); R(g, -w / 2, cy - h / 2, w, h, 44, F(4.2));
      if (ic) ibox(p, c, { icon: ic }, -w / 2 + 110, cy, 130, tu(.04), { g, mv: K, punch: tu(.28) }); const lx = ic ? -w / 2 + 210 : -w / 2 + 50;
      [[cy - 30, 330], [cy + 30, 220]].forEach(([y, ww], k) => R(mvG(p, { px: lx, py: y, sx: [[0, 0], [tu(.3 + .06 * k), 0], [tu(.5 + .06 * k), 1, 'out']], o: fadeIn(tu(.3 + .06 * k), .04) }), lx, y - 14, ww, 28, 14, PH));
      const pw = Math.min(600, (v ? tw(p, v, 110) : 100) + (u ? tw(p, u, 36, 600) + 20 : 0) + 90), px = Math.min(460 - pw / 2, w / 2 - 40), py = cy - h / 2 - 20, pg = popAt(p, px, py, tu(.4));
      R(pg, px - pw / 2, py - 80, pw, 160, 80, { fill: C.fill, sw: 4.4, stroke: ACC1 }); numRow(p, pg, v, u, px, py + 38, { size: 110, maxW: pw - 70, t0: tu(.42), g: pg }); ripple(p, px, py, 110, H);
    }); });

  /* 45 ── DOT PATH (จุดเชื่อมเส้น): six stops on a line (the first holds the icon); the line fills from the left and each stop it reaches lights, the
     last reached ripples on H; the number counts above */
  variant('dotpath', 'จุดเชื่อมเส้น', (d, c) => { const v = VAL(d), u = UN(d), ic = ICN(d), H = Z.H, ps = frac(d), ly = 170, xs = [-380, -230, -80, 70, 220, 370], t0 = tu(.4), t1 = f3(H - tu(.04));
    art(c, p => { drawAt(p.line(xs[0], ly, xs[5], ly, { sw: 8, stroke: TL_(.2) }), p, tu(.04), tu(.3)); const reach = Math.max(1, Math.round(ps * 5)), ex = xs[reach];
      if (ps > 0) on(p.line(xs[0], ly, ex, ly, { sw: 8, stroke: ACC1 }), p, 0, { draw: [[0, 0], [t0, 0], [t1, 1, 'lin']] });
      xs.forEach((x, k) => { if (k === 0 && ic) { icirc(p, c, ic, x, ly, 62, tu(.06), { punch: t0 }); return; } popAt(p, x, ly, tu(.08 + .04 * k)).circle(x, ly, 26, F(3.4));
        if (k > 0 && k <= reach && ps > 0) { const tl = f3(t0 + (t1 - t0) * k / reach); popAt(p, x, ly, tl).circle(x, ly, 16, { fill: ACC1, sw: 2, stroke: ACC1 }); if (k === reach) ripple(p, x, ly, 40, tl); } });
      const n = numRow(p, p, v, u, 0, -40, { size: 190, maxW: 860, t0: tu(.3) }); if (n) ripple(p, n.cx, n.cy, 130, H); dirB(p, DIRV(d), 420, -230, f3(H + tu(.1)));
    }); });

  /* 46 ── TARGET LOCK (เป้าล็อก): two dashed rings close in from big to fit round the number while they turn; four cross ticks snap in and light on H;
     the icon box drops top-left */
  variant('target', 'เป้าล็อก', (d, c) => { const v = VAL(d), u = UN(d), ic = ICN(d), H = Z.H, cx = 0, cy = -10;
    art(c, p => { const cg = CL(p); [[230, '10 12', 1], [180, '3 10', -1]].forEach(([r, da, sd], k) => { const g = mvG(cg, { px: cx, py: cy, s: [[0, 1.7], [tu(.06), 1.7], [f3(H - tu(.08)), .97, 'out'], [f3(H + tu(.06)), 1, 'soft']], o: fadeIn(tu(.06 + .06 * k), .06) });
        mvG(g, { px: cx, py: cy, r: spinR(tu(.06), f3(H + tu(.2)), sd * 140) }).circle(cx, cy, r, { sw: 3, stroke: k ? TL_(.5) : C.ink, 'stroke-dasharray': da }); });
      [0, 90, 180, 270].forEach(a => { const g = mvG(cg, { px: cx, py: cy, s: [[0, 1.5], [f3(H - tu(.2)), 1.5], [f3(H - tu(.02)), 1, 'in']], o: fadeIn(f3(H - tu(.2)), .04) }); tick(g, cx, cy, a, 240, 290, W(5)); tick(litOn(p, H), cx, cy, a, 240, 290, { sw: 5, stroke: ACC1 }); });
      num(p, p, v, cx, cy + 46, { size: 130, maxW: 300, t0: tu(.3) }); pill(p, u, cx, cy + 110, { t: f3(H + tu(.06)), size: 26, maxW: 260 }); ripple(p, cx, cy, 170, H);
      dropBox(p, c, ic, -400, -250, 100, tu(.04), tu(.26)); dirB(p, DIRV(d), 400, -250, f3(H + tu(.1)));
    }); });

  /* 47 ── HEXAGON (หกเหลี่ยม): a big hexagon spins in edge-on and settles; the icon sits in a small hexagon that drops in and docks to it with a short
     link; the number counts inside the big one; the unit pill under */
  variant('hexnum', 'หกเหลี่ยม', (d, c) => { const v = VAL(d), u = UN(d), ic = ICN(d), H = Z.H, cx = ic ? 80 : 0, cy = -20, r = 230;
    art(c, p => { const g = mvG(p, spinK(cx, cy, tu(.06))); g.path(hexD(cx, cy, r), F(4.4)); g.path(hexD(cx, cy, r - 24), S(1.4));
      const n = num(p, p, v, cx, cy + 46, { size: 130, maxW: 300, t0: tu(.34) }); ripple(p, cx, cy, r - 50, H); pill(p, u, cx, 270, { t: f3(H + tu(.06)), size: 32, maxW: 440 });
      if (ic) { const hx = -330, hy = -170, K = fallK(hx, hy + 80, tu(.3), tu(.5), hy + 80 + 350), hg = mvG(CL(p), K); hg.path(hexD(hx, hy, 80), F(3.6)); put(p, c, { icon: ic }, hx, hy, 80, null, { t: tu(.3), mv: K, punch: tu(.52) });
        drawAt(p.line(hx + 70, hy + 40, f1(cx - r * Math.cos(rad(30))), f1(cy - r * .5 + 30), W(3.4)), p, tu(.54), tu(.14)); dust(p, hx, hy + 80, tu(.5), .6); }
      dirB(p, DIRV(d), cx + r * .87, cy - r * .5, f3(H + tu(.1)));
    }); });

  /* 48 ── TICKER STRIP (แถบเลื่อน): a long strip; the number slides in from the right edge with speed lines trailing, counting as it moves, and stops in
     the middle with an overshoot on H; the icon box drops on the strip's left end */
  variant('ticker', 'แถบเลื่อน', (d, c) => { const v = VAL(d), u = UN(d), ic = ICN(d), H = Z.H, x0 = ic ? -300 : -450, x1 = 450, cy = 40, h = 200;
    art(c, p => { R(inG(p, 'pop', (x0 + x1) / 2, cy, tu(.04)), x0, cy - h / 2, x1 - x0, h, 36, F(4)); const cl = clipG(p, x0 + 6, cy - h / 2 + 6, x1 - x0 - 12, h - 12);
      const mx = (x0 + x1) / 2, dx = x1 - x0, K = [[0, dx], [tu(.3), dx], [f3(H - tu(.04)), -14, 'out'], [f3(H + tu(.1)), 0, 'soft']], g = mvG(cl, { x: K, o: fadeIn(tu(.3), .02) });
      const n = numRow(p, g, v, u, mx, cy + 54, { size: 150, maxW: x1 - x0 - 80, t0: tu(.3), g }), rx = n ? n.x1 : mx;
      const sl = sub(g); on(sl, p, 0, { o: [[0, 0], [tu(.3), 0], [tu(.34), 1], [f3(H - tu(.2)), 1], [f3(H), 0]] }); [[-30, 120], [10, 180], [50, 90]].forEach(([y, w]) => sl.line(f1(rx + 30), cy + y, f1(rx + 30 + w), cy + y, { sw: 4, stroke: TL_(.45) }));
      ripple(p, mx, cy, 120, H); if (ic) dropBox(p, c, ic, -390, cy, 150, tu(.04), tu(.28)); dirB(p, DIRV(d), x1 - 20, cy - h / 2, f3(H + tu(.1)));
    }); });

  /* 49 ── MERGE (วงรวมตัว): small circles float in from around the canvas and run together into the middle; a big circle pops where they meet and the
     number counts inside it, locking on H; the icon plate rides its edge */
  variant('merge', 'วงรวมตัว', (d, c) => { const v = VAL(d), u = UN(d), ic = ICN(d), H = Z.H, cx = 0, cy = -30, r = 200, tm = tu(.56);
    art(c, p => { [[-430, 230], [-380, -260], [-60, -330], [300, -280], [430, 120], [140, 300]].forEach(([x, y], k) => { const L = [[x, y], [(x + cx) / 2 + (k % 2 ? 80 : -80), (y + cy) / 2], [cx, cy]], t0 = tu(.06 + .04 * k), K = pathK(L, t0, tm, [cx, cy]);
        mvG(p, { x: K.x, y: K.y, s: [[0, 1], [f3(tm - tu(.06)), 1], [tm, .3]], o: [[0, 0], [t0, 0], [f3(t0 + tu(.04)), 1], [f3(tm - tu(.02)), 1], [tm, 0]] }).circle(cx, cy, 24 - k * 2, k % 2 ? F(3) : { fill: ACC1, sw: 2, stroke: ACC1 }); });
      const g = mvG(p, { px: cx, py: cy, s: [[0, .2], [tm, .2], [f3(tm + tu(.16)), 1.08, 'out'], [f3(tm + tu(.26)), 1, 'soft']], o: fadeIn(tm, .02) }); g.circle(cx, cy, r, F(4.4)); g.circle(cx, cy, r - 18, S(1.4));
      ripple(p, cx, cy, r, tm); num(p, p, v, cx, cy + 50, { size: 140, maxW: 300, t0: tm }); ripple(p, cx, cy, r - 40, H); pill(p, u, cx, 260, { t: f3(H + tu(.06)), size: 32, maxW: 440 });
      if (ic) icirc(p, c, ic, f1(cx + r * Math.cos(rad(-40))), f1(cy + r * Math.sin(rad(-40))), 62, f3(tm + tu(.14)), { punch: H });
    }); });

  /* 50 ── ECHO (เงาซ้อนตัวเลข): three faint copies of the number start large and offset, and slide in on top of each other until they become one on H —
     the number punches with a ripple; the unit follows; the icon box drops top-left */
  variant('echo', 'เงาซ้อนตัวเลข', (d, c) => { const v = VAL(d), u = UN(d), ic = ICN(d), H = Z.H;
    art(c, p => { const n = numRow(p, p, v, u, 0, 110, { size: 220, maxW: 860, t0: tu(.3) }); if (!n) return;
      [[-90, -110, 1.3, .32], [-60, -72, 1.2, .24], [-30, -36, 1.1, .16]].forEach(([dx, dy, s, a], k) => { const t0 = tu(.12 + .06 * k), eg = mvG(p, { px: n.x0 + n.nw / 2, py: n.cy, x: [[0, dx], [t0, dx], [f3(H - tu(.04)), 0, 'io']], y: [[0, dy], [t0, dy], [f3(H - tu(.04)), 0, 'io']], s: [[0, s], [t0, s], [f3(H - tu(.04)), 1, 'io']], o: [[0, 0], [t0, 0], [f3(t0 + tu(.06)), 1], [f3(H - tu(.1)), 1], [H, 0]] });
        num(p, eg, v, n.x0, 110, { size: n.size, anchor: 'start', t0, still: true, g: eg, color: TL_(a) }); });
      ripple(p, n.cx, n.cy, 150, H); dropBox(p, c, ic, -400, -250, 110, tu(.04), tu(.26)); dirB(p, DIRV(d), 400, -250, f3(H + tu(.1)));
    }); });

  /* ---------- sample data: the same as B01 (A: sentences from unrelated topics · B: stress) ---------- */
  const SAMPLES = [
    { say: 'วิ่งวันละ 5 กิโล', value: '5', unit: 'กิโล', icon: 'person-standing' },
    { say: 'แต่งงานกันมา 12 ปี', value: '12', unit: 'ปี', icon: 'heart' },
    { say: 'ค่าไฟลดลง 30%', value: '30%', icon: 'zap', dir: 'down' },
    { say: 'ความชื้นในดิน 65%', value: '65%', icon: 'droplet' },
    { say: 'นอนให้ได้ 8 ชั่วโมง', value: '8', unit: 'ชั่วโมง', icon: 'bed' },
    { say: 'ดื่มน้ำวันละ 2.5 ลิตร', value: '2.5', unit: 'ลิตร', icon: 'glass-water' },
    { say: 'ต้นไม้สูงขึ้น 120 เซนติเมตร', value: '120', unit: 'เซนติเมตร', icon: 'sprout', dir: 'up' },
    { say: 'ยอดขายเพิ่มเป็น 3 เท่า', value: '3', unit: 'เท่า', icon: 'store', dir: 'up' },
    { say: 'ถ่ายไปแล้ว 1,250 รูป', value: '1,250', unit: 'รูป', icon: 'camera' },
    { say: 'คนดูทะลุ 1 ล้านคน', value: '1', unit: 'ล้านคน', icon: 'users' },
    { say: 'ชนะมาแล้ว 7 ครั้ง', value: '7', unit: 'ครั้ง', icon: 'trophy' },
    { say: 'ปีนี้แม่อายุ 60', value: '60', unit: 'ปี', icon: 'cake' },
    { say: 'เปิดร้านมาครบ 100 วัน', value: '100', unit: 'วัน', icon: 'calendar' },
    { say: 'ส่งของไปแล้ว 3,000 กล่อง', value: '3,000', unit: 'กล่อง', icon: 'package' },
    { say: '90% ของคนทำงานเหนื่อย', value: '90%', unit: 'ของคนทำงาน', icon: 'briefcase' },
    { say: 'ฝุ่นเล็กแค่ 2.5 ไมครอน', value: '2.5', unit: 'ไมครอน', icon: 'cloud', dir: 'down' },
    { say: 'สมาชิกใหม่ 4,800 คน', value: '4,800', unit: 'คน', icon: 'user-plus', dir: 'up' },
    { say: 'ราคาลด 50%', value: '50%', icon: 'tag', dir: 'down' },
    { say: 'เที่ยวมาแล้ว 12 ประเทศ', value: '12', unit: 'ประเทศ', icon: 'plane', dir: 'up' },
    { say: 'ปีนี้อ่านหนังสือ 24 เล่ม', value: '24', unit: 'เล่ม', icon: 'book-open' },
  ];
  const STRESS = [
    { say: 'เก็บเงินได้ 1,250,000 บาท (9 หลัก)', value: '1,250,000', unit: 'บาท' },
    { say: 'ค่า π ประมาณ 3.14 (ไม่มีหน่วย ไม่มีไอคอน)', value: '3.14' },
    { say: 'ได้ผล 99.9%', value: '99.9%', icon: 'shield-check', dir: 'up' },
    { say: 'ran 42 kilometers (English)', value: '42', unit: 'kilometers', icon: 'bike' },
    { say: 'ขาดงาน 0 วัน', value: '0', unit: 'วัน', icon: 'calendar' },
    { say: 'ต้นทุนลดลง 12.5%', value: '12.5%', icon: 'coins', dir: 'down' },
    { say: 'ซ่อมไปแล้ว 1,000,000 ครั้ง', value: '1,000,000', unit: 'ครั้ง', icon: 'wrench' },
    { say: 'น้ำหนักลด 15 กิโลกรัม', value: '15', unit: 'กิโลกรัม', dir: 'down' },
    { say: 'ใช้เวลาแค่ 3 นาที', value: '3', unit: 'นาที', icon: 'timer' },
    { say: 'ผ่านมา 25 ปี', value: '25', unit: 'ปี' },
    { say: 'ใบไม้ร่วง 300,000 ใบ', value: '300,000', unit: 'ใบ', icon: 'leaf', dir: 'down' },
    { say: 'สูง 8,848 เมตร', value: '8,848', unit: 'เมตร', icon: 'mountain' },
    { say: 'ลูกคนที่ 2', value: '2', icon: 'baby' },
    { say: 'ขับมา 120,500 กิโลเมตร', value: '120,500', unit: 'กิโลเมตร', icon: 'car' },
    { say: 'ผ่อนบ้านอีก 30 ปี', value: '30', unit: 'ปี', icon: 'house', dir: 'down' },
    { say: 'ทาน 1 ผลต่อวัน', value: '1', unit: 'ผลต่อวัน', icon: 'apple' },
    { say: 'ยา 2 เม็ด', value: '2', unit: 'เม็ด', icon: 'pill' },
    { say: 'ยกได้ 100 กิโล', value: '100', unit: 'กิโล', icon: 'dumbbell', dir: 'up' },
    { say: 'กาแฟวันละ 4 แก้ว', value: '4', unit: 'แก้ว', icon: 'coffee', dir: 'up' },
    { say: '7.5 ล้านวิว', value: '7.5', unit: 'ล้านวิว', icon: 'music' },
  ];

  G.cats = G.cats || {};
  G.cats.B01T = { variants: V, SAMPLES, STRESS, theme, draw: (i, d, c) => { setZ(c); CUR = V[i].id; tokens(); EMPTY = false; BLUE = false; V[i].build(d || {}, c); }, CLAMPS, timing: c => (setZ(c), Object.assign({}, Z)) };
})();
