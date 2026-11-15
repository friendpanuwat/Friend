/* b05t.js — TEST (user 2026-11-14: "ลองออกแบบหมวดที่ 5 มา 20 อัน รอบนี้ไม่ได้จะเอาไปใช้จริงนะครับแค่จะทดสอบเฉยๆ"): category B05 "ถูกกับผิด"
   redone in the template ชุดฐาน way — graphic elements only (chips, pills, icon boxes, rows, marks, toggles, sliders, dials, bars, lines),
   **no real-world objects** (no signs, doors, boards …), our white-glow line style. Icons and words sit apart (no word under an icon).
   CutPack B05: wrong THING · right THING. The wrong side is turned down first (crossed, struck, dimmed) at tN; the right side lands on H.
   GL.cats.B05T.draw(i, data, { x, y, s, at, hit }) — canvas 1000 × 700 centred at (0,0). */
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
    cp.id = 'b05tclip' + (++CID); Object.entries({ x, y, width: w, height: h }).forEach(([k, v]) => r.setAttribute(k, v)); cp.appendChild(r);
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
  const PH = { fill: 'rgba(255,255,255,.05)', sw: 2, stroke: C.soft };
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

  /* 01 ── TWO ROWS (สองแถว): the wrong row comes in, its box is crossed, its words struck and dimmed; the right row slides in under it, ticked,
     its word big and bright on H */
  variant('rows', 'สองแถว', (d, c) => { const A = WR(d), B = RT(d), Q = TL(), K = TT(Q);
    art(c, p => { [[A, -95, 'x', tu(.2)], [B, 95, 'check', K.tR]].forEach(([X, y, m, t], i) => { const g0 = mvG(p, { x: glide(i ? 140 : -140, t, f3(t + tu(.22)), i ? -6 : 6), o: fadeIn(t, .06) }); if (!i) R(g0, -430, y - 72, 860, 144, 30, BK); const g = i ? g0 : dimG(g0, K.tN);
        R(g, -430, y - 72, 860, 144, 30, i ? F(4.2) : F(3.2)); R(g, -400, y - 36, 72, 72, 18, F(3)); (m === 'x' ? XX : CHK)(atG(p, i ? f3(K.H - tu(.04)) : K.tN), -364, y, 1.1);
        if (X && picOf(X)) { put(p, c, { icon: X.icon }, -260, y, 74, null, { t: f3(t + tu(.08)), o: i ? undefined : dimK(K.tN) }); }
        const w = X ? txt(i ? popAt(p, -100, y, K.H) : g, X.label || '', picOf(X) ? -200 : -300, y + (i ? 20 : 14), { size: i ? 62 : 44, maxW: picOf(X) ? 600 : 700, weight: 800, color: C.ink, anchor: 'start' }).getBBox().width : 0;
        if (!i && X) drawAt(p.line(picOf(X) ? -212 : -312, y, (picOf(X) ? -200 : -300) + w + 12, y, W(4)), p, f3(K.tN + tu(.04)), tu(.2)); });
    }); });

  /* 02 ── SWAP THE BOX (กล่องสลับ): the wrong box with its word chip; a slash cuts across it, it dims, a ✗ badge; an arrow runs to the right
     box, which pops, a ✓ badge stamps its corner on H */
  variant('swap', 'สองกล่อง', (d, c) => { const A = WR(d), B = RT(d), Q = TL(), K = TT(Q);
    art(c, p => { ibox(p, c, A, -250, 30, 280, tu(.2), { dim: K.tN }); slash(p, -390, 170, -110, -110, K.tN); mark(p, 'x', -120, -100, 40, f3(K.tN + tu(.06)));
      drawAt(p.path('M -70 30 L 60 30 M 30 0 L 64 30 L 30 60', W(5)), p, f3(K.tN + tu(.14)), tu(.2));
      ibox(p, c, B, 250, 30, 280, K.tR, { punch: K.H }); mark(p, 'check', 380, -100, 44, K.H); ripple(p, 250, 30, 160, K.H);
      pill(p, LBL(A), -250, -200, { t: tu(.3), dim: K.tN, strike: f3(K.tN + tu(.06)) }); pill(p, LBL(B), 250, -200, { t: f3(K.H + tu(.04)), size: 38 });
    }); });

  /* 03 ── THE SWITCH (สวิตช์): a long switch — the wrong thing at one end, the right at the other; the knob ring sits on the wrong end, then
     slides across and locks on the right on H; their words under the ends */
  variant('switch', 'สวิตช์', (d, c) => { const A = WR(d), B = RT(d), Q = TL(), K = TT(Q);
    art(c, p => { R(inG(p, 'pop', 0, -20, tu(.04)), -380, -120, 760, 200, 100, F(4.4));
      [[A, -260, 0], [B, 260, 1]].forEach(([X, x, i]) => { if (X && picOf(X)) put(p, c, { icon: X.icon }, x, -20, 110, null, { t: tu(.2 + .1 * i), o: i ? undefined : dimK(K.tN) }); else if (X) txt(dimG(atG(p, tu(.2 + .1 * i)), i ? 99 : K.tN), X.label, x, -10, { size: 38, maxW: 200, weight: 800, color: C.ink, wrap: 'mid' }); });
      const kn = mvG(p, { x: [[0, -520], [tu(.3), -520], [K.tN, -520], [f3(K.H - tu(.04)), 12, 'io'], [f3(K.H + tu(.06)), 0, 'soft']], o: fadeIn(tu(.3)) }); kn.circle(260, -20, 92, { sw: 6 }); kn.circle(260, -20, 104, S(1.6));
      mark(p, 'x', -260, 160, 30, K.tN); mark(p, 'check', 260, 160, 30, K.H);
      pill(p, LBL(A), -260, 250, { t: tu(.36), dim: K.tN, strike: f3(K.tN + tu(.04)), size: 30 }); pill(p, LBL(B), 260, 250, { t: f3(K.H + tu(.06)), size: 32, lit: true });
    }); });

  /* 04 ── STRIKE AND WRITE (ขีดแล้วเขียนใหม่): the wrong words sit big; a line strikes them, they dim; a caret marks the spot and the right
     words are written above in bright, underlined on H (icons, if any, in small boxes at the line's start) */
  variant('rewrite', 'ขีดแล้วเขียนใหม่', (d, c) => { const A = WR(d), B = RT(d), Q = TL(), K = TT(Q);
    art(c, p => { const la = A ? (A.label || '') : '', lb = B ? (B.label || '') : '', ia = A && picOf(A), ib = B && picOf(B);
      if (ia) ibox(p, c, { icon: A.icon }, -360, 110, 110, tu(.16), { dim: K.tN }); if (ib) ibox(p, c, { icon: B.icon }, -360, -120, 120, K.tR, { punch: K.H });
      const x0 = ia || ib ? -270 : -400, g = dimG(atG(p, tu(.24)), K.tN), ta = la ? txt(g, la, x0, 140, { size: 72, maxW: 760 - (x0 + 400), weight: 800, color: C.ink, anchor: 'start' }) : null, wa = ta ? ta.getBBox().width : 120;
      if (!la) phBar(g, x0, 110, 200, 40, 'start'); drawAt(p.line(x0 - 10, 112, x0 + wa + 10, 112, W(6)), p, K.tN, tu(.22));
      drawAt(p.path(`M ${x0 + wa / 2 - 26} 50 L ${x0 + wa / 2} 18 L ${x0 + wa / 2 + 26} 50`, W(5)), p, f3(K.tN + tu(.16)), tu(.14));
      if (lb) { const tb = txt(popAt(p, x0 + 100, -110, K.H), lb, x0, -90, { size: 80, maxW: 760 - (x0 + 400), weight: 800, color: C.ink, anchor: 'start' }); drawAt(p.line(x0, -60, x0 + tb.getBBox().width, -60, { sw: 6, stroke: C.ink }), p, f3(K.H + tu(.06)), tu(.25)); }
      else if (!ib) star4(popAt(p, x0 + 60, -110, K.H), x0 + 60, -110, 30);
    }); });

  /* 05 ── TWO TABS (แท็บสองช่อง): a two-tab switch over a panel — the wrong tab is on and the panel shows it; the highlight slides to the
     right tab (the wrong one dims) and the panel turns to the right thing on H */
  variant('tabs', 'แท็บสองช่อง', (d, c) => { const A = WR(d), B = RT(d), Q = TL(), K = TT(Q);
    art(c, p => { R(inG(p, 'pop', 0, -250, tu(.04)), -380, -310, 760, 120, 60, F(4)); const hl = mvG(p, { x: [[0, -380], [K.tN, -380], [f3(K.H - tu(.06)), 6, 'io'], [f3(K.H + tu(.04)), 0, 'soft']], o: fadeIn(tu(.2)) }); R(hl, 10, -298, 358, 96, 48, { fill: LIT, sw: 3 });
      txt(dimG(atG(p, tu(.24)), K.tN), A ? (A.label || '✗') : '', -190, -240, { size: 36, maxW: 300, weight: 800, color: C.ink }); txt(atG(p, tu(.28)), B ? (B.label || '✓') : '', 190, -240, { size: 36, maxW: 300, weight: 800, color: C.ink });
      R(inG(p, 'pop', 0, 70, tu(.14)), -380, -150, 760, 440, 40, F(4));
      const sa = mvG(p, { px: 0, py: 70, sx: [[0, 1], [K.tN, 1], [f3(K.tN + tu(.14)), 0, 'in']], o: [[0, 1], [f3(K.tN + tu(.14)), 1], [f3(K.tN + tu(.15)), 0]] }); ibox(p, c, A, 0, 70, 240, tu(.3), { g: sa, mv: { px: 0, py: 70, sx: [[0, 1], [K.tN, 1], [f3(K.tN + tu(.14)), 0, 'in']] } });
      const sb = mvG(p, { px: 0, py: 70, sx: [[0, 0], [f3(K.H - tu(.14)), 0], [K.H, 1.06, 'out'], [f3(K.H + tu(.1)), 1, 'soft']], o: fadeIn(f3(K.H - tu(.14)), .02) }); ibox(p, c, B, 0, 70, 240, f3(K.H - tu(.14)), { g: sb, mv: { px: 0, py: 70, sx: [[0, 0], [f3(K.H - tu(.14)), 0], [K.H, 1.06, 'out'], [f3(K.H + tu(.1)), 1, 'soft']] } });
      mark(p, 'check', 300, -10, 36, f3(K.H + tu(.08)));
    }); });

  /* 06 ── CHIPS DOWN (ชิปบน-ล่าง): the wrong chip on top (its icon box beside), struck and dimmed with a ✗; a short arrow down; the right
     chip below, larger, with a ✓, on H */
  variant('chips', 'ชิปบน-ล่าง', (d, c) => { const A = WR(d), B = RT(d), Q = TL(), K = TT(Q);
    art(c, p => { ibox(p, c, A, -300, -170, 130, tu(.16), { dim: K.tN }); mark(p, 'x', -230, -240, 26, K.tN);
      const wa = pill(p, A ? A.label || '' : '', 60, -170, { t: tu(.24), size: 40, dim: K.tN, strike: f3(K.tN + tu(.04)), maxW: 420 });
      drawAt(p.path('M 0 -70 L 0 40 M -30 10 L 0 44 L 30 10', W(5)), p, f3(K.tN + tu(.14)), tu(.2));
      ibox(p, c, B, -310, 160, 170, K.tR, { punch: K.H }); mark(p, 'check', -220, 70, 32, K.H);
      pill(p, B ? B.label || '' : '', 80, 160, { t: f3(K.H - tu(.04)), size: 54, lit: true, maxW: 460 });
    }); });

  /* 07 ── THE DIAL (หน้าปัดชี้): a half dial — the wrong thing at its left end, the right at its right; the needle starts on the wrong end,
     sweeps over and settles on the right on H; their words under the ends */
  variant('dial', 'หน้าปัด', (d, c) => { const A = WR(d), B = RT(d), Q = TL(), K = TT(Q), cx = 0, cy = 170, r = 280;
    art(c, p => { const P = a => f1(cx + r * Math.cos(rad(a))) + ' ' + f1(cy + r * Math.sin(rad(a)));
      drawAt(p.path(`M ${P(180)} A ${r} ${r} 0 0 1 ${P(360)}`, { sw: 16, stroke: 'rgba(255,255,255,.22)' }), p, tu(.1), tu(.4));
      const lit = p.path(`M ${P(300)} A ${r} ${r} 0 0 1 ${P(360)}`, { sw: 16 }); on(lit, p, 0, { draw: [[0, 0], [f3(K.H - tu(.2)), 0], [K.H, 1, 'out']] });
      const nd = mvG(p, { px: cx, py: cy, r: [[0, -150], [tu(.3), -150], [K.tN, -150], [f3(K.H - tu(.04)), 8, 'out'], [f3(K.H + tu(.08)), -3, 'io'], [f3(K.H + tu(.16)), 0, 'soft']] }); nd.line(cx, cy, f1(cx + (r - 70) * Math.cos(rad(345))), f1(cy + (r - 70) * Math.sin(rad(345))), W(6)); popAt(p, cx, cy, tu(.3)).circle(cx, cy, 24, SOLID(2));
      [[A, -1, 'x', K.tN], [B, 1, 'check', K.H]].forEach(([X, sd, m, t]) => { const x = sd * (r - 40); ibox(p, c, X, x, cy - 150, 120, tu(.2), sd < 0 ? { dim: K.tN } : { punch: K.H }); mark(p, m, x + sd * 60, cy - 214, 24, t);
        pill(p, LBL(X), sd * r, cy + 70, sd < 0 ? { t: tu(.3), dim: K.tN, size: 30 } : { t: f3(K.H + tu(.04)), size: 32, lit: true }); });
    }); });

  /* 08 ── TWO BALLOONS OF WORDS (ฟองคำ): the wrong word-bubble (icon box + words) is crossed and sinks away dim; the right bubble pops in
     bigger, ticked, on H */
  variant('bubbles', 'ฟองคำ', (d, c) => { const A = WR(d), B = RT(d), Q = TL(), K = TT(Q);
    art(c, p => { const fa0 = mvG(popAt(p, -150, -160, tu(.2)), { y: [[0, 0], [K.tN, 0], [f3(K.tN + tu(.3)), 40, 'in']] }); R(fa0, -440, -240, 580, 160, 80, BK); const fa = dimG(fa0, K.tN);
      R(fa, -440, -240, 580, 160, 80, F(3.6)); fa.circle(-380, -50, 16, F(2.4)); fa.circle(-410, -16, 9, F(2));
      if (A && picOf(A)) put(p, c, { icon: A.icon }, -350, -160, 80, null, { t: tu(.26), o: dimK(K.tN), mv: { px: -350, py: -160, y: [[0, 0], [K.tN, 0], [f3(K.tN + tu(.3)), 40, 'in']] } });
      if (A) txt(fa, A.label || '', picOf(A) ? -290 : -380, -146, { size: 40, maxW: picOf(A) ? 400 : 480, weight: 800, color: C.ink, anchor: 'start' }); drawAt(p.line(-420, -100, 120, -220, W(6)), p, K.tN, tu(.2));
      const fb = mvG(p, { px: 120, py: 140, s: [[0, .3], [K.tR, .3], [f3(K.H - tu(.04)), 1.06, 'out'], [f3(K.H + tu(.08)), 1, 'soft']], o: fadeIn(K.tR, .06) }); R(fb, -260, 50, 760, 190, 95, F(4.4)); fb.circle(-150, 270, 18, F(2.6)); fb.circle(-190, 310, 10, F(2.2));
      if (B && picOf(B)) put(p, c, { icon: B.icon }, -150, 145, 100, null, { t: K.tR, mv: { px: 120, py: 140, s: [[0, .3], [K.tR, .3], [f3(K.H - tu(.04)), 1.06, 'out'], [f3(K.H + tu(.08)), 1, 'soft']] } });
      if (B) txt(atG(p, f3(K.H + tu(.02))), B.label || '', picOf(B) ? -80 : -200, 164, { size: 52, maxW: picOf(B) ? 520 : 640, weight: 800, color: C.ink, anchor: 'start' }); mark(p, 'check', 470, 60, 34, f3(K.H + tu(.06)));
    }); });

  /* 09 ── CROSS AND TAKE OVER (กากบาทแล้วแทนที่): the wrong box sits big in the middle; a big ✗ draws over it and it shrinks off to the corner,
     dim; the right box grows into the middle, ringed, on H */
  variant('takeover', 'กากบาทแล้วแทนที่', (d, c) => { const A = WR(d), B = RT(d), Q = TL(), K = TT(Q);
    art(c, p => { const mvA = { px: 0, py: 0, x: [[0, 0], [f3(K.tN + tu(.14)), 0], [f3(K.tN + tu(.4)), -340, 'io']], y: [[0, 0], [f3(K.tN + tu(.14)), 0], [f3(K.tN + tu(.4)), -210, 'io']], s: [[0, 1], [f3(K.tN + tu(.14)), 1], [f3(K.tN + tu(.4)), .42, 'io']] };
      ibox(p, c, A, 0, 0, 300, tu(.2), { g: mvG(popAt(p, 0, 0, tu(.2)), mvA), mv: mvA, dim: K.tN });
      const gx = mvG(p, mvA); drawAt(gx.line(-120, -120, 120, 120, W(8)), p, K.tN, tu(.12)); drawAt(gx.line(-120, 120, 120, -120, W(8)), p, f3(K.tN + tu(.06)), tu(.12));
      const mvB = { px: 60, py: 40, s: [[0, .2], [K.tR, .2], [f3(K.H - tu(.04)), 1.06, 'out'], [f3(K.H + tu(.1)), 1, 'soft']], o: fadeIn(K.tR, .06) }; ibox(p, c, B, 60, 40, 320, K.tR, { g: mvG(p, mvB), mv: mvB, punch: f3(K.H + tu(.1)) });
      drawAt(p.circle(60, 40, 220, W(4)), p, f3(K.H + tu(.02)), tu(.3)); pill(p, LBL(B), 60, 300, { t: f3(K.H + tu(.06)), size: 40, lit: true }); pill(p, LBL(A), -340, -60, { t: f3(K.tN + tu(.4)), size: 26, dim: f3(K.tN + tu(.4)) });
    }); });

  /* 10 ── THE POLL (โพล): two options, each an icon box with a result bar; the bars race — the wrong one stops short, is crossed and dims;
     the right one runs to the end and lights, ticked, on H */
  variant('poll', 'โพล', (d, c) => { const A = WR(d), B = RT(d), Q = TL(), K = TT(Q);
    art(c, p => { [[A, -110, 0], [B, 110, 1]].forEach(([X, y, i]) => { ibox(p, c, X, -360, y, 140, tu(.16 + .1 * i), i ? { punch: K.H } : { dim: K.tN });
        R(atG(p, tu(.3)), -260, y - 32, 680, 64, 32, F(3)); const fw = i ? 680 : 220, g = mvG(p, { px: -260, py: y, sx: [[0, 0], [tu(.5), 0], [i ? f3(K.H - tu(.04)) : K.tN, 1, 'out']], o: i ? fadeIn(tu(.5)) : [[0, 0], [tu(.5), 0], [tu(.52), 1], [K.tN, 1], [f3(K.tN + tu(.2)), .38]] });
        R(g, -260, y - 32, fw, 64, 32, i ? { fill: LIT, sw: 4 } : { fill: 'rgba(255,255,255,.12)', sw: 0, stroke: 'none' }); mark(p, i ? 'check' : 'x', i ? 460 : -260 + fw + 50, y, 30, i ? K.H : K.tN);
        if (LBL(X)) txt(atG(p, tu(.36)), LBL(X), -240, y - 52, { size: 30, maxW: 600, weight: 700, color: C.soft, anchor: 'start' }); });
    }); });

  /* 11 ── FLIP THE TILE (พลิกแผ่น): one tile shows the wrong thing with a ✗ badge; it flips edge-on and comes round showing the right thing
     with a ✓ badge on H; the wrong one is left as a small dim chip above */
  variant('flip', 'พลิกแผ่น', (d, c) => { const A = WR(d), B = RT(d), Q = TL(), K = TT(Q), t1 = f3(K.tN + tu(.18)), t2 = f3(K.H - tu(.04));
    art(c, p => { const fa = { px: 0, py: 40, sx: [[0, 1], [K.tN, 1], [t1, 0, 'in']] }, ga = mvG(p, Object.assign({ o: [[0, 0], [tu(.16), 0], [tu(.2), 1], [t1, 1], [f3(t1 + tu(.01)), 0]] }, fa)); ibox(p, c, A, 0, 40, 320, tu(.2), { g: ga, mv: fa }); mark(ga, 'x', 150, -110, 36, tu(.36));
      const fb = { px: 0, py: 40, sx: [[0, 0], [t1, 0], [t2, 1.06, 'out'], [f3(t2 + tu(.1)), 1, 'soft']] }, gb = mvG(p, Object.assign({ o: [[0, 0], [t1, 0], [f3(t1 + tu(.01)), 1]] }, fb)); ibox(p, c, B, 0, 40, 320, t1, { g: gb, mv: fb, punch: f3(K.H + tu(.1)) }); mark(p, 'check', 150, -110, 40, K.H);
      const gc = dimG(popAt(p, -250, -260, t1), f3(t1 + tu(.02))); if (A) { const w = pill(p, A.label || '', -150, -260, { g: gc, size: 28, maxW: 320 }); XX(gc, -150 - w / 2 - 34, -260, .7); }
      pill(p, LBL(B), 0, 280, { t: f3(K.H + tu(.06)), size: 40, lit: true });
    }); });

  /* 12 ── THE SLIDER (สไลเดอร์): a track from the wrong end to the right end; the knob sits on the wrong end, then slides all the way and the
     track lights behind it on H; icon boxes over the ends, words under */
  variant('slider', 'สไลเดอร์', (d, c) => { const A = WR(d), B = RT(d), Q = TL(), K = TT(Q);
    art(c, p => { R(inG(p, 'pop', 0, 60, tu(.04)), -380, 40, 760, 40, 20, F(3.4));
      R(mvG(p, { px: -380, py: 60, sx: [[0, 0], [K.tN, 0], [f3(K.H - tu(.04)), 1, 'io']], o: fadeIn(K.tN, .04) }), -380, 40, 760, 40, 20, { fill: LIT, sw: 3 });
      const kn = mvG(p, { x: [[0, -760], [tu(.3), -760], [K.tN, -760], [f3(K.H - tu(.04)), 10, 'io'], [f3(K.H + tu(.06)), 0, 'soft']], o: fadeIn(tu(.3)) }); kn.circle(380, 60, 46, F(4.4)); kn.circle(380, 60, 30, S(1.6));
      [[A, -380, 0], [B, 380, 1]].forEach(([X, x, i]) => { ibox(p, c, X, x, -150, 150, tu(.16 + .1 * i), i ? { punch: K.H } : { dim: K.tN }); mark(p, i ? 'check' : 'x', x + 80, -230, 26, i ? K.H : K.tN);
        pill(p, LBL(X), x, 180, i ? { t: f3(K.H + tu(.04)), size: 32, lit: true } : { t: tu(.36), size: 30, dim: K.tN }); });
    }); });

  /* 13 ── THE RADIO PAIR (ตัวเลือกวงกลม): two option rows with round buttons; the wrong one is selected first, then the dot jumps down to the
     right one (the wrong row dims) on H */
  variant('radio', 'ตัวเลือกวงกลม', (d, c) => { const A = WR(d), B = RT(d), Q = TL(), K = TT(Q);
    art(c, p => { [[A, -110, 0], [B, 110, 1]].forEach(([X, y, i]) => { const g0 = popAt(p, 0, y, i ? tu(.24) : tu(.16)); if (!i) R(g0, -420, y - 76, 840, 152, 76, BK); const g = i ? g0 : dimG(g0, K.tN); R(g, -420, y - 76, 840, 152, 76, F(i ? 4.2 : 3.2)); g.circle(-340, y, 34, F(3));
        if (X && picOf(X)) put(p, c, { icon: X.icon }, -230, y, 80, null, { t: tu(.3 + .1 * i), o: i ? undefined : dimK(K.tN) }); if (X) txt(i ? atG(p, tu(.34)) : g, X.label || '', picOf(X) ? -160 : -270, y + 16, { size: i ? 50 : 44, maxW: 560, weight: 800, color: C.ink, anchor: 'start' }); });
      const dt = mvG(p, { y: [[0, 0], [tu(.4), 0], [K.tN, 0], [f3(K.H - tu(.1)), 110, 'in'], [K.H, 220, 'in'], [f3(K.H + tu(.06)), 214, 'out'], [f3(K.H + tu(.12)), 220, 'in']], x: [[0, 0], [K.tN, 0], [K.H, 0]], o: fadeIn(tu(.4), .04) }); dt.circle(-340, -110, 18, SOLID(2));
      ripple(p, -340, 110, 50, K.H);
    }); });

  /* 14 ── TWO BARS (สองแท่ง): two bars rise together; the wrong one tops out, is crossed and sinks back low, dim; the right one keeps rising
     and lights on H; word pills under */
  variant('bars', 'สองแท่ง', (d, c) => { const A = WR(d), B = RT(d), Q = TL(), K = TT(Q);
    art(c, p => { drawAt(p.line(-380, 200, 380, 200, S(2)), p, tu(.1), tu(.3));
      const gaB = mvG(p, { px: -180, py: 200, sy: [[0, 0], [tu(.3), 0], [K.tN, 2.4, 'out'], [f3(K.tN + tu(.3)), 1, 'io']], o: fadeIn(tu(.3)) }); R(gaB, -260, 50, 160, 150, 26, BK); const ga = mvG(dimG(p, K.tN), { px: -180, py: 200, sy: [[0, 0], [tu(.3), 0], [K.tN, 2.4, 'out'], [f3(K.tN + tu(.3)), 1, 'io']], o: fadeIn(tu(.3)) }); R(ga, -260, 50, 160, 150, 26, F(3.6));
      const gb = mvG(p, { px: 180, py: 200, sy: [[0, 0], [tu(.3), 0], [K.tN, .45, 'out'], [f3(K.H - tu(.04)), 1.06, 'out'], [f3(K.H + tu(.1)), 1, 'soft']], o: fadeIn(tu(.3)) }); R(gb, 100, -250, 160, 450, 26, { fill: LIT, sw: 4.4 });
      ibox(p, c, A, -180, -10, 110, f3(K.tN + tu(.3)), { dim: f3(K.tN + tu(.3)) }); mark(p, 'x', -180, 0 - 120, 26, f3(K.tN + tu(.1)));
      ibox(p, c, B, 180, -320, 110, f3(K.H - tu(.06)), { punch: K.H }); mark(p, 'check', 290, -320, 28, K.H);
      pill(p, LBL(A), -180, 260, { t: tu(.4), size: 30, dim: K.tN }); pill(p, LBL(B), 180, 260, { t: f3(K.H + tu(.04)), size: 32, lit: true });
    }); });

  /* 15 ── REROUTE (เปลี่ยนเส้นทาง): a line runs from the start dot toward the wrong box and is blocked (✗); it comes back and a new line bends
     down to the right box; the dot runs along it and reaches it on H */
  variant('reroute', 'เปลี่ยนเส้นทาง', (d, c) => { const A = WR(d), B = RT(d), Q = TL(), K = TT(Q), P1 = 'M -380 0 C -200 0 -100 -170 120 -170', P2 = 'M -380 0 C -200 0 -100 170 120 170';
    art(c, p => { popAt(p, -380, 0, tu(.1)).circle(-380, 0, 20, SOLID(2)); drawAt(dimG(p, K.tN).path(P1, W(4)), p, tu(.3), f3(K.tN - tu(.3)));
      ibox(p, c, A, 270, -170, 200, tu(.2), { dim: K.tN }); mark(p, 'x', 120, -170, 30, K.tN); drawAt(p.path(P2, W(4)), p, K.tR, f3(K.H - K.tR - tu(.1)));
      ibox(p, c, B, 270, 170, 220, K.tR, { punch: K.H }); mark(p, 'check', 400, 50, 30, K.H); ripple(p, 270, 170, 140, K.H);
      const L = Array.from({ length: 21 }, (_, j) => { const u = j / 20, x = (1 - u) ** 3 * -380 + 3 * (1 - u) ** 2 * u * -200 + 3 * (1 - u) * u * u * -100 + u ** 3 * 120, y = 3 * (1 - u) * u * u * 170 + u ** 3 * 170; return [x, y]; }), pk = pathK(L, K.tR, f3(K.H - tu(.04)), [120, 170]);
      mvG(p, { x: pk.x, y: pk.y, o: [[0, 0], [K.tR, 0], [f3(K.tR + tu(.04)), 1], [f3(K.H - tu(.04)), 1], [K.H, 0]] }).circle(120, 170, 14, SOLID(2));
      pill(p, LBL(A), 270, -310, { t: tu(.3), size: 28, dim: K.tN }); pill(p, LBL(B), 270, 320, { t: f3(K.H + tu(.06)), size: 32, lit: true });
    }); });

  /* 16 ── TWO RINGS (วงคะแนน): two round meters with the icons inside; the wrong ring fills a little, stops, is crossed and dims; the right
     ring fills all the way round and lights on H */
  variant('rings', 'วงคะแนน', (d, c) => { const A = WR(d), B = RT(d), Q = TL(), K = TT(Q), r = 160;
    art(c, p => { [[A, -230, 0], [B, 230, 1]].forEach(([X, x, i]) => { const g = i ? p : dimG(p, K.tN); drawAt(g.circle(x, -20, r, { sw: 14, stroke: 'rgba(255,255,255,.18)' }), p, tu(.1), tu(.3));
        const arc = g.path(i ? `M ${x} ${-20 - r} A ${r} ${r} 0 1 1 ${x - .1} ${-20 - r}` : `M ${x} ${-20 - r} A ${r} ${r} 0 0 1 ${f1(x + r * Math.sin(rad(80)))} ${f1(-20 - r * Math.cos(rad(80)))}`, { sw: 14 }); on(arc, p, 0, { draw: [[0, 0], [tu(.4), 0], [i ? f3(K.H - tu(.04)) : K.tN, 1, 'out']] });
        ibox(p, c, X, x, -20, 150, tu(.2 + .08 * i), i ? { punch: K.H } : { dim: K.tN }); mark(p, i ? 'check' : 'x', x + 120, -150, 28, i ? K.H : K.tN);
        pill(p, LBL(X), x, 220, i ? { t: f3(K.H + tu(.04)), size: 32, lit: true } : { t: tu(.36), size: 30, dim: K.tN }); });
    }); });

  /* 17 ── LAID OVER (วางทับ): the wrong box sits there, dims and gets a ✗; the right box slides in over it from the side and covers most of
     it, ✓ on its corner on H */
  variant('cover', 'วางทับ', (d, c) => { const A = WR(d), B = RT(d), Q = TL(), K = TT(Q);
    art(c, p => { ibox(p, c, A, -150, -60, 300, tu(.2), { dim: K.tN }); mark(p, 'x', -280, -190, 30, K.tN); pill(p, LBL(A), -150, -260, { t: tu(.3), size: 28, dim: K.tN, strike: f3(K.tN + tu(.04)) });
      const mvB = { px: 120, py: 70, x: glide(500, K.tR, f3(K.H - tu(.04)), -14), o: fadeIn(K.tR, .04) }; ibox(p, c, B, 120, 70, 340, K.tR, { g: mvG(CL(p), mvB), mv: mvB, punch: f3(K.H + tu(.08)) });
      mark(p, 'check', 280, -90, 40, K.H); pill(p, LBL(B), 120, 300, { t: f3(K.H + tu(.06)), size: 38, lit: true });
    }); });

  /* 18 ── SPELL CHECK (ตรวจคำ): the wrong words with a wavy underline drawing under them, dimmed; the suggestion pill pops below — ✓ the
     right words (and icon) — on H */
  variant('spell', 'ตรวจคำ', (d, c) => { const A = WR(d), B = RT(d), Q = TL(), K = TT(Q);
    art(c, p => { const la = A ? A.label || '' : '', g = dimG(atG(p, tu(.2)), f3(K.tN + tu(.2))); if (A && picOf(A)) ibox(p, c, { icon: A.icon }, -360, -140, 120, tu(.16), { dim: f3(K.tN + tu(.2)) });
      const x0 = A && picOf(A) ? -270 : -380, ta = la ? txt(g, la, x0, -120, { size: 64, maxW: 760, weight: 800, color: C.ink, anchor: 'start' }) : null, w = ta ? ta.getBBox().width : 200;
      let dd = `M ${x0} -80`; for (let x = x0; x < x0 + w; x += 24) dd += ` q 6 -14 12 0 q 6 14 12 0`; drawAt(p.path(dd, W(3.4)), p, K.tN, tu(.3));
      const sg = mvG(p, { px: x0 + 60, py: 40, s: [[0, .3], [K.tR, .3], [f3(K.H - tu(.04)), 1.06, 'out'], [f3(K.H + tu(.08)), 1, 'soft']], o: fadeIn(K.tR, .06) }); drawAt(p.line(x0 + 60, -60, x0 + 60, 0, S(2)), p, f3(K.tR - tu(.1)), tu(.1));
      R(sg, x0, 10, 760 - (x0 + 380), 170, 40, F(4.4)); CHK(sg, x0 + 70, 95, 1.2); if (B && picOf(B)) put(p, c, { icon: B.icon }, x0 + 170, 95, 90, null, { t: K.tR, mv: { px: x0 + 60, py: 40, s: [[0, .3], [K.tR, .3], [f3(K.H - tu(.04)), 1.06, 'out'], [f3(K.H + tu(.08)), 1, 'soft']] } });
      if (B) txt(atG(p, f3(K.H + tu(.02))), B.label || '', B && picOf(B) ? x0 + 240 : x0 + 130, 114, { size: 52, maxW: 760 - (x0 + 380) - (picOf(B) ? 270 : 160), weight: 800, color: C.ink, anchor: 'start' });
    }); });

  /* 19 ── SPLIT IN TWO (แบ่งครึ่ง): a line splits the space; on the left the wrong side (✗ chip, icon, words), on the right the right side
     (✓ chip, icon, words); the left dims, the right washes with light on H */
  variant('split', 'แบ่งครึ่ง', (d, c) => { const A = WR(d), B = RT(d), Q = TL(), K = TT(Q);
    art(c, p => { drawAt(p.line(0, -300, 0, 300, S(2.4)), p, tu(.04), tu(.3)); R(flick(p, f3(K.H - tu(.04))), 20, -300, 460, 600, 30, { fill: 'rgba(255,255,255,.07)', sw: 0, stroke: 'none' });
      [[A, -240, 0], [B, 240, 1]].forEach(([X, x, i]) => { mark(p, i ? 'check' : 'x', x, -230, 32, i ? f3(K.H - tu(.02)) : K.tN); ibox(p, c, X, x, -20, 220, tu(.2 + .1 * i), i ? { punch: K.H } : { dim: K.tN });
        pill(p, LBL(X), x, 190, i ? { t: f3(K.H + tu(.04)), size: 38, lit: true, maxW: 360 } : { t: tu(.36), size: 34, dim: K.tN, strike: f3(K.tN + tu(.04)), maxW: 360 }); });
    }); });

  /* 20 ── MARKING (ตรวจให้คะแนน): two icon boxes side by side; a hand-drawn ✗ scrawls over the wrong one (it dims); a hand-drawn loop circles
     the right one on H — teacher's marks, nothing else */
  variant('marks', 'ตรวจให้คะแนน', (d, c) => { const A = WR(d), B = RT(d), Q = TL(), K = TT(Q);
    art(c, p => { ibox(p, c, A, -230, -20, 260, tu(.2), { dim: K.tN }); ibox(p, c, B, 230, -20, 260, tu(.3), { punch: K.H });
      drawAt(p.path('M -340 -130 Q -230 -20 -110 100', W(7)), p, K.tN, tu(.14)); drawAt(p.path('M -120 -140 Q -240 -10 -350 110', W(7)), p, f3(K.tN + tu(.12)), tu(.14));
      drawAt(p.path('M 230 -190 C 420 -190 420 160 230 160 C 50 160 40 -170 250 -200', W(6)), p, f3(K.H - tu(.2)), tu(.3));
      pill(p, LBL(A), -230, 230, { t: tu(.36), size: 32, dim: K.tN }); pill(p, LBL(B), 230, 230, { t: f3(K.H + tu(.04)), size: 36, lit: true });
    }); });

  /* ---------- sample data (A: corrections from unrelated topics · B: stress) ---------- */
  const I = (icon, label) => label ? (icon ? { icon, label } : { label }) : { icon };
  const D = (say, wrong, right) => ({ say, wrong, right });
  const SAMPLES = [
    D('ไม่ใช่รอให้พร้อม แต่เริ่มเลย', I('clock', 'รอให้พร้อม'), I('rocket', 'เริ่มเลย')),
    D('ไม่ใช่ขายถูก แต่ขายคุณค่า', I('tag', 'ขายถูก'), I('gem', 'ขายคุณค่า')),
    D('ไม่ใช่ทำคนเดียว แต่ทำเป็นทีม', I('user', 'ทำคนเดียว'), I('users', 'ทำเป็นทีม')),
    D('อย่าจำ ให้เข้าใจ', I('book-open', 'ท่องจำ'), I('lightbulb', 'เข้าใจ')),
    D('ไม่ใช่โฆษณา แต่บอกต่อ', I('presentation', 'โฆษณา'), I('users', 'บอกต่อ')),
    D('ไม่ใช่เร็ว แต่สม่ำเสมอ', I('zap', 'เร็ว'), I('repeat', 'สม่ำเสมอ')),
    D('ไม่ใช่ดวง แต่วินัย', I('sparkles', 'ดวง'), I('calendar', 'วินัย')),
    D('ไม่ใช่เงินเดือน แต่ทักษะ', I('wallet', 'เงินเดือน'), I('graduation-cap', 'ทักษะ')),
    D('ไม่ใช่ยอดไลก์ แต่ยอดขาย', I('heart', 'ยอดไลก์'), I('shopping-bag', 'ยอดขาย')),
    D('ไม่ใช่นอนดึก แต่นอนเร็ว', I('tv', 'นอนดึก'), I('bed', 'นอนเร็ว')),
    D('ไม่ใช่กาแฟ แต่น้ำเปล่า', I('coffee', 'กาแฟ'), I('droplets', 'น้ำเปล่า')),
    D('ไม่ใช่หาลูกค้าใหม่ แต่ดูแลลูกค้าเก่า', I('search', 'หาลูกค้าใหม่'), I('heart', 'ดูแลลูกค้าเก่า')),
    D('ไม่ใช่ทางลัด แต่ทางที่ถูก', I('zap', 'ทางลัด'), I('map-pin', 'ทางที่ถูก')),
    D('ไม่ใช่ลดราคา แต่เพิ่มของแถม', I('tag', 'ลดราคา'), I('gift', 'ของแถม')),
    D('ไม่ใช่สะสมของ แต่สะสมประสบการณ์', I('shopping-bag', 'สะสมของ'), I('plane', 'ประสบการณ์')),
    D('ไม่ใช่พูดเก่ง แต่ฟังเก่ง', I('mic', 'พูดเก่ง'), I('users', 'ฟังเก่ง')),
    D('ไม่ใช่ทำทุกอย่าง แต่ทำสิ่งสำคัญ', I('list', 'ทำทุกอย่าง'), I('star', 'สิ่งสำคัญ')),
    D('สะกดว่า ประสพการณ์ ผิด ต้องเป็น ประสบการณ์', I(null, 'ประสพการณ์'), I(null, 'ประสบการณ์')),
    D('ไม่ใช่ซื้อเพราะถูก แต่ซื้อเพราะใช่', I('tag', 'ถูก'), I('heart', 'ใช่')),
    D('ไม่ใช่ความสามารถ แต่ความพยายาม', I('trophy', 'พรสวรรค์'), I('dumbbell', 'ความพยายาม')),
  ];
  const STRESS = [
    D('คำยาว', I('clock', 'รอให้ทุกอย่างพร้อมก่อนแล้วค่อยเริ่ม'), I('rocket', 'เริ่มจากสิ่งเล็ก ๆ ทันที')),
    D('ไม่มีไอคอน', I(null, 'ขายถูก'), I(null, 'ขายคุณค่า')),
    D('ไอคอนอย่างเดียว', I('user'), I('users')),
    D('ภาษาอังกฤษ', I('book-open', 'Memorize'), I('lightbulb', 'Understand')),
    D('ไม่มีฝั่งผิด', null, I('rocket', 'เริ่มเลย')),
    D('ไม่มีฝั่งถูก', I('clock', 'รอให้พร้อม'), null),
    D('ไม่มีอะไรเลย', null, null),
    D('ชื่อไอคอนที่ไม่มี', I('no-such', 'ดวง'), I('no-such-2', 'วินัย')),
    D('สั้นมาก', I('zap', 'เร็ว'), I('repeat', 'ช้า')),
    D('ยาวฝั่งเดียว', I('tv', 'ดู'), I('bed', 'นอนให้พอแปดชั่วโมงทุกคืน')),
    D('คำยาว', I('coffee', 'ดื่มกาแฟวันละหลายแก้ว'), I('droplets', 'ดื่มน้ำเปล่าให้มาก')),
    D('ไม่มีไอคอน', I(null, 'หาลูกค้าใหม่'), I(null, 'ดูแลลูกค้าเก่า')),
    D('อังกฤษ 2', I('zap', 'Shortcut'), I('map-pin', 'The right way')),
    D('ไอคอนอย่างเดียว', I('tag'), I('gift')),
    D('คำยาว', I('shopping-bag', 'ซื้อของมาสะสมไว้เต็มบ้าน'), I('plane', 'เก็บเงินไปเที่ยว')),
    D('ไม่มีฝั่งผิด', null, I('users', 'ฟังเก่ง')),
    D('ไม่มีไอคอน', I(null, 'ทำทุกอย่าง'), I(null, 'ทำสิ่งสำคัญ')),
    D('คำยาวมาก', I(null, 'ประสพการณ์การทำงาน'), I(null, 'ประสบการณ์การทำงาน')),
    D('ไม่มีฝั่งถูก', I('tag', 'ถูก'), null),
    D('ไม่มีอะไรเลย 2', null, null),
  ];

  G.cats = G.cats || {};
  G.cats.B05T = { variants: V, SAMPLES, STRESS, draw: (i, d, c) => { setZ(c); CUR = V[i].id; EMPTY = false; BLUE = false; V[i].build(d || {}, c); }, CLAMPS, timing: c => (setZ(c), Object.assign({}, Z)) };
})();
