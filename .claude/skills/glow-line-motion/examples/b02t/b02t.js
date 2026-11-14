/* b02t.js — TEST (user 2026-11-14: "เริ่มทำหมวด B02 ได้ ทำ 50 อันแบ่งเป็นรอบละ 25 อัน … อยากให้ช่องใส่ไอคอนมันมีขนาดใหญ่ขึ้นกว่านี้หน่อย"):
   category B02 "เพิ่ม / ลด" in the template ชุดฐาน way — graphic elements only (icon boxes, slots, rows, rings, bars, dots, lines, zones), no
   real-world objects, our white-glow line style, colours from GL.theme. Icons apart from words; icon slots big. Round 1 = designs 1–25 · round 2 = 26–50.
   Not a replacement for the approved B02 (references/approved/b02/). Header + helpers copied from b01t.js (b05t → cards.js → b21).
   GL.cats.B02T.draw(i, data, { x, y, s, at, hit }) — canvas 1000 × 700 centred at (0,0). Data = CutPack B02: dir · item · n · center · keep · end. */
(function () {
  const G = window.GL, C = G.C, NS = 'http://www.w3.org/2000/svg';
  const W = (w = 2) => ({ sw: w }), F = (w = 3.2) => ({ fill: C.fill, sw: w }), S = (w = 2) => ({ sw: w, stroke: C.soft });
  const rad = d => d * Math.PI / 180, f1 = v => +v.toFixed(1);
  let GLASS = 'rgba(255,255,255,.07)', LIT = 'rgba(255,255,255,.2)'; const SOLID = (w = 2) => ({ fill: C.ink, sw: w });

  /* TIMING (same system as b01–b11): the keyword c.hit never moves; M = 1/speed but at most hit / HIT0; tu / bH / aH; kf() keeps keys in order */
  const HIT0 = 1.8; let Z = null; const CLAMPS = {}; let CUR = '';
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
    cp.id = 'b02tclip' + (++CID); Object.entries({ x, y, width: w, height: h }).forEach(([k, v]) => r.setAttribute(k, v)); cp.appendChild(r);
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


  /* ================= B02T — เพิ่ม / ลด (Increase / Decrease) as a template ชุดฐาน =================
     CutPack B02: dir up/down · item THING (icon + label) · n 2–4 (default 4) · center THING (owner / where they go in or out, optional) ·
     keep 0–3 (down only: how many stay; default 1, 0 = all gone) · end ('x' | 'check' | 'circle-check' | an icon name, optional).
     Up: the items arrive one by one, the last on H. Down: they are all there, then leave one by one (the last-placed first) until `keep` stay,
     the last leaving on H. **Icon slots are big** (user 2026-11-14: "อยากให้ช่องใส่ไอคอนมันมีขนาดใหญ่ขึ้นกว่านี้หน่อย … เริ่มจากหมวดที่ 2"):
     item boxes 150–240 on the 1000 × 700 canvas, the center 180–260. Item label = a chip apart from the icons; colours from the theme. */
  const UPD = d => !(d && d.dir === 'down');
  const ITM = d => d && has(d.item) ? d.item : null, CEN = d => d && has(d.center) ? d.center : null;
  const NN = d => Math.max(2, Math.min(4, Math.round(+(d && d.n) || 4)));
  const SZ = n => n >= 4 ? 200 : n === 3 ? 230 : 255;
  const rowX = (n, s, gap, cx = 0) => Array.from({ length: n }, (_, k) => f1(cx + (k - (n - 1) / 2) * (s + gap)));
  function EV(d) { const up = UPD(d), n = NN(d), keep = up ? n : (d.keep == null ? 1 : Math.max(0, Math.min(n - 1, Math.round(+d.keep)))), m = up ? n : n - keep, H = Z.H, T0 = Math.max(tu(.55), H - tu(1.15));
    const ts = Array.from({ length: Math.max(1, m) }, (_, j) => f3(m <= 1 ? H : lerp(T0, H, j / (m - 1))));
    return { up, n, keep, m, ts, H, T0, at: k => up ? ts[k] : k >= keep ? ts[n - 1 - k] : null }; }
  const ORD = E => Array.from({ length: E.n }, (_, k) => k).filter(k => E.at(k) != null).sort((a, b) => E.at(a) - E.at(b));
  const multiBump = (ts, a = 1.08) => { const K = [[0, 1]]; ts.filter(t => t != null).sort((x, y) => x - y).forEach(t => K.push([t, 1], [f3(t + tu(.05)), a, 'out'], [f3(t + tu(.18)), 1, 'soft'])); return K; };
  const DASH = (a = .4) => ({ sw: 2.4, stroke: TL_(a), 'stroke-dasharray': '8 10' });
  /* one item at (x, y), size s. up → it comes in (o.in: drop · fly · slide · rise · flip · pop) and lands at its time; o.vanish = it is absorbed right after.
     down → it is there from the start (pops in at o.t0) and leaves at its time (o.out: lift · fly · slide · flip · sink · shrink) unless kept;
     o.hidden = it is not shown before it leaves (it comes out of something). o.shape 'box' | 'circ'. */
  function item(p, c, X, x, y, s, E, k, o = {}) {
    const t = E.at(k), t0 = o.t0 ?? f3(tu(.08 + .06 * k)), up = E.up, K = { px: x, py: y }, dur = o.dur || .3;
    if (up) { const kind = o.in || 'drop', ts = f3(Math.max(tu(.05), t - tu(dur)));
      if (kind === 'drop') Object.assign(K, fallK(x, y + s / 2, ts, t, o.h ?? Math.max(160, y + s / 2 + 350)));
      else if (kind === 'fly') { const fr = o.from || [x, -460], mid = o.mid || [(fr[0] + x) / 2, Math.min(fr[1], y) - 120], P = pathK(o.path ? o.path.concat([[x, y]]) : [fr, mid, [x, y]], ts, t, [x, y]);
        Object.assign(K, { x: P.x, y: P.y, s: [[0, .7], [ts, .7], [t, 1, 'out'], [f3(t + tu(.06)), 1.12, 'out'], [f3(t + tu(.2)), 1, 'soft']], o: fadeIn(ts, .04) }); }
      else if (kind === 'slide') { const dx = o.dx ?? 320; Object.assign(K, { x: [[0, dx], [ts, dx], [t, -10 * Math.sign(dx), 'out'], [f3(t + tu(.1)), 0, 'soft']], o: fadeIn(ts, .04) }); }
      else if (kind === 'rise') Object.assign(K, { y: [[0, o.dy ?? 160], [ts, o.dy ?? 160], [t, -10, 'out'], [f3(t + tu(.1)), 0, 'soft']], o: fadeIn(ts, .04) });
      else if (kind === 'flip') Object.assign(K, { sx: [[0, 0], [ts, 0], [f3(ts + (t - ts) * .5), -.5], [t, 1.08, 'out'], [f3(t + tu(.1)), 1, 'soft']], o: fadeIn(ts, .04) });
      else Object.assign(K, { s: [[0, .2], [ts, .2], [t, 1.12, 'out'], [f3(t + tu(.14)), 1, 'soft']], o: fadeIn(ts, .04) });
      if (o.vanish) { K.o = fadeIn(ts, .04).concat([[t, 1], [f3(t + tu(.08)), 0]]); K.s = kind === 'fly' ? [[0, .7], [ts, .7], [f3(t - tu(.02)), 1, 'out'], [f3(t + tu(.08)), .4]] : [[0, 1], [t, 1], [f3(t + tu(.08)), .4]]; }
    } else { const S0 = [[0, .3], [t0, .3], [f3(t0 + tu(.22)), 1.06, 'out'], [f3(t0 + tu(.34)), 1, 'soft']], O0 = [[0, 0], [t0, 0], [f3(t0 + tu(.05)), 1]];
      if (t == null) Object.assign(K, { s: S0, o: O0 });
      else { const kind = o.out || 'lift', te = f3(t + tu(dur)), OH = [[0, 0], [t, 0], [f3(t + tu(.03)), 1], [f3(te - tu(.05)), 1], [te, 0]], Of = o.hidden ? OH : O0.concat([[t, 1], [te, 0]]), Sx = o.hidden ? [[0, 1]] : S0;
        if (kind === 'lift') Object.assign(K, { s: Sx, y: [[0, 0], [t, 0], [te, -170, 'in']], o: Of });
        else if (kind === 'fly') { const to = o.to || [x, -460], mid = o.mid || [(x + to[0]) / 2, Math.min(y, to[1]) - 120], P = pathK(o.path ? [[x, y]].concat(o.path) : [[x, y], mid, to], t, te, [x, y]);
          Object.assign(K, { s: (o.hidden ? [[0, .5], [t, .5], [f3(t + tu(.1)), 1, 'out']] : S0.concat([[t, 1]])).concat([[te, .7]]), x: P.x, y: P.y, o: Of }); }
        else if (kind === 'slide') { const dx = o.dx ?? 360; Object.assign(K, { s: Sx, x: [[0, 0], [t, 0], [f3(t + tu(.06)), -12 * Math.sign(dx), 'out'], [te, dx, 'in']], o: Of }); }
        else if (kind === 'flip') Object.assign(K, { s: Sx, sx: [[0, 1], [t, 1], [te, 0, 'in']], o: O0.concat([[te, 1], [f3(te + tu(.01)), 0]]) });
        else if (kind === 'sink') Object.assign(K, { s: Sx, y: [[0, 0], [t, 0], [f3(t + tu(.06)), -12, 'out'], [te, o.sinkY ?? 170, 'in']], o: Of });
        else Object.assign(K, { s: Sx.concat([[t, 1], [f3(t + tu(.06)), 1.12, 'out'], [te, 0, 'in']]), o: O0.concat([[f3(te - tu(.02)), 1], [te, 0]]) });
      } }
    const g = mvG(o.clip === false ? p : CL(p), K), sh = o.shape || 'box', mv = Object.assign({}, K); delete mv.o;
    if (sh === 'circ') { g.circle(x, y, s / 2, F(3.6)); g.circle(x, y, s / 2 - 12, S(1.4)); } else R(g, x - s / 2, y - s / 2, s, s, s * .24, F(4));
    if (X && picOf(X)) put(p, c, { icon: X.icon }, x, y, s * (sh === 'circ' ? .66 : .72), null, { t: up ? f3(Math.max(tu(.05), t - tu(dur))) : (o.hidden ? t : t0), mv, o: o.io || K.o });
    else if (X && X.label) txt(g, X.label, x, y + s * .08, { size: s * .24, maxW: s * .88, weight: 800, color: C.ink, wrap: 'mid' }); else g.circle(x, y, s * .12, { fill: ACC1, sw: 0, stroke: 'none' });
    if (up && (o.in || 'drop') === 'drop' && o.dust !== false) dust(p, x, y + s / 2, t, s / 240);
    if (!up && t != null && o.ghost !== false && !o.hidden) ghost(p, x, y, s, f3(t + tu(dur)), sh);   /* where it was stays as a dashed outline */
    return { t, K, g }; }
  function ghost(p, x, y, s, t, sh = 'box', w) { const g = sub(p); on(g, p, 0, { o: [[0, 0], [f3(t - tu(.12)), 0], [t, 1]] });
    if (sh === 'circ') g.circle(x, y, s / 2, DASH(.4)); else R(g, x - (w || s) / 2, y - s / 2, w || s, s, sh === 'pill' ? s / 2 : s * .24, DASH(.4)); }
  /* the center (owner / where they go): a big box that bumps on every event, its word in a pill (o.ly; o.noLabel) */
  function cbox(p, c, X, x, y, s, ts, o = {}) { if (!X) return null; const t = o.t ?? tu(.1), g0 = popAt(p, x, y, t), K = { px: x, py: y, s: multiBump(ts) }, g = mvG(g0, K);
    if (o.circ) { g.circle(x, y, s / 2, F(4.4)); g.circle(x, y, s / 2 - 16, S(1.4)); } else { R(g, x - s / 2, y - s / 2, s, s, s * .26, F(4.4)); R(g, x - s / 2 + 14, y - s / 2 + 14, s - 28, s - 28, s * .2, S(1.4)); }
    if (picOf(X)) { put(p, c, { icon: X.icon }, x, y, s * .66, null, { t: f3(t + tu(.04)), mv: K }); if (X.label && !o.noLabel) { const ly = o.ly == null ? y + s / 2 + 64 : o.ly > y + 1 ? Math.max(o.ly, y + s / 2 + 64) : o.ly < y - 1 ? Math.min(o.ly, y - s / 2 - 64) : o.ly; pill(p, X.label, o.lx ?? x, ly, { t: tu(.3), size: 54, maxW: o.maxW || 380 }); } }
    else txt(g, X.label, x, y + s * .08, { size: s * .22, maxW: s * .88, weight: 800, color: C.ink, wrap: 'mid' }); return g; }
  /* the item's word as a chip (only when it has an icon — otherwise the word is in the boxes) + the direction badge */
  /* (user 2026-11-14, with a marked-up picture: "ลบขีดเส้นใต้ด้านล่างออกและลบที่ผมวงไว้ออกด้วยทุกอันเลย … โหมดต่อๆไปก็ห้ามทำด้วย") — no word chip
     top-left, no up / down arrow badge top-right, no floor line under the things; base() is kept as a no-op so the designs read the same */
  function base() {}
  /* the end sign after the last change: ✗ / ✓ / an icon */
  function endM(p, c, d, x, y, r = 62) { if (!d.end) return; const t = f3(Z.H + tu(.12)), g = popAt(p, x, y, t); g.circle(x, y, r, F(3.4));
    if (d.end === 'x') XX(g, x, y, r / 30); else if (/check/.test(d.end)) CHK(g, x, y, r / 30); else put(p, c, { icon: d.end }, x, y, r * 1.3, null, { t }); ripple(p, x, y, r + 10, t); }
  const slots = (p, xs, ys, s, r = .28) => xs.forEach((x, k) => on(R(p, x - s / 2 - 10, ys[k] - s / 2 - 10, s + 20, s + 20, s * r, DASH()), p, 0, { o: fadeIn(tu(.04 + .04 * k), .06) }));

  /* 01 ── SLOTS (แถวช่อง): a row of dashed slots; up — the boxes drop into them one by one (dust); down — they lift out and fade, the empty slots stay.
     The center (if any) sits above the row and bumps with every change */
  variant('row', 'แถวช่อง', (d, c) => { const X = ITM(d), E = EV(d), Cn = CEN(d), s = Cn ? Math.min(SZ(E.n), 190) : SZ(E.n), y = Cn ? 165 : 40, xs = rowX(E.n, s, 28);
    art(c, p => { base(p, c, d, E); slots(p, xs, xs.map(() => y), s); xs.forEach((x, k) => item(p, c, X, x, y, s, E, k, { in: 'drop', out: 'lift', ghost: false }));
      cbox(p, c, Cn, 0, -150, 170, E.ts, { ly: -150, lx: 250 }); endM(p, c, d, xs[E.n - 1] + s / 2, y - s / 2);
    }); });

  /* 02 ── STACK (กองซ้อน): boxes pile into a column; up — each drops onto the top and squashes; down — the top ones slide off to the side and fade.
     The center (if any) stands beside it, joined by a dashed line */
  variant('stack', 'กองซ้อน', (d, c) => { const X = ITM(d), E = EV(d), Cn = CEN(d), s = E.n >= 4 ? 166 : E.n === 3 ? 200 : 225, by = 342, x = Cn ? -200 : -40, ys = Array.from({ length: E.n }, (_, k) => f1(by - s / 2 - k * (s + 4)));
    art(c, p => { base(p, c, d, E, { cx: 40, dx: -432 }); 
      ys.forEach((y, k) => item(p, c, X, x, y, s, E, k, { in: 'drop', out: 'slide', dx: 560 }));
      if (Cn) { drawAt(p.path(`M ${x + s / 2 + 20} 60 L 140 60`, DASH(.5)), p, tu(.2), tu(.2)); cbox(p, c, Cn, 280, 60, 240, E.ts); }
      endM(p, c, d, x + s / 2 + 10, ys[E.n - 1] - s / 2);
    }); });

  /* 03 ── INTO THE MIDDLE (ไหลเข้าศูนย์): up — the boxes fly in from the corners and are swallowed by the center, which bumps, and a counter dot
     lights under it; down — they burst out of it to the corners and fade, the dots go dark. No center → a dashed target ring */
  variant('into', 'ไหลเข้าศูนย์', (d, c) => { const X = ITM(d), E = EV(d), Cn = CEN(d), cx = 0, cy = -30, far = [[-470, -330], [470, -330], [-470, 330], [470, 330]];
    art(c, p => { base(p, c, d, E); if (Cn) cbox(p, c, Cn, cx, cy, 250, E.ts, { noLabel: true }); else { drawAt(p.circle(cx, cy, 160, DASH(.5)), p, tu(.06), tu(.3)); const K = { px: cx, py: cy, s: multiBump(E.ts, 1.08) }; ibox(p, c, X, cx, cy, 220, tu(.08), { g: mvG(popAt(p, cx, cy, tu(.08)), K), mv: K }); }
      if (Cn && Cn.label && picOf(Cn)) pill(p, Cn.label, cx, -268, { t: tu(.3), size: 54, maxW: 380 });
      for (let k = 0; k < E.n; k++) { const fr = far[k % 4], mid = [(fr[0] + cx) / 2, (fr[1] + cy) / 2 + (k % 2 ? 60 : -60)];
        item(p, c, X, cx, cy, 185, E, k, E.up ? { in: 'fly', from: fr, mid, vanish: true, dur: .36 } : { out: 'fly', to: fr, mid, hidden: true, dur: .36 });
        const dx = f1(cx + (k - (E.n - 1) / 2) * 76), dy = 215, t = E.at(k); p.circle(dx, dy, 24, S(2.4));
        if (E.up) popAt(p, dx, dy, t).circle(dx, dy, 24, { fill: ACC1, sw: 0, stroke: 'none' });
        else { const g = sub(p); on(g, p, 0, { o: t == null ? fadeIn(tu(.3)) : [[0, 0], [tu(.3), 0], [tu(.34), 1], [t, 1], [f3(t + tu(.06)), 0]] }); g.circle(dx, dy, 24, { fill: ACC1, sw: 0, stroke: 'none' }); } }
      endM(p, c, d, cx + 150, cy - 110);
    }); });

  /* 04 ── LEVEL METER (แถบระดับ): one big item box on the left; beside it a level meter of rising bars; up — the bars light one by one (the box bumps
     each time); down — they go dark from the top. The center (if any) sits small top-right */
  variant('meter', 'แถบระดับ', (d, c) => { const X = ITM(d), E = EV(d), Cn = CEN(d), x0 = 40, w = 70, gp = 26;
    art(c, p => { base(p, c, d, E, { dx: Cn ? 250 : 432 }); const bx = -250, by = 30, bs = 290; ibox(p, c, X, bx, by, bs, tu(.06), { g: mvG(popAt(p, bx, by, tu(.06)), { px: bx, py: by, s: multiBump(E.ts, 1.06) }), mv: { px: bx, py: by, s: multiBump(E.ts, 1.06) } });
      for (let k = 0; k < E.n; k++) { const x = x0 + k * (w + gp), h = lerp(150, 380, E.n > 1 ? k / (E.n - 1) : 1), t = E.at(k), y0 = 250 - h;
        R(mvG(p, upK(x + w / 2, 250, tu(.08 + .05 * k))), x, y0, w, h, 18, F(3)); const lit = sub(p);
        on(lit, p, 0, { o: E.up ? [[0, 0], [t, 0], [f3(t + tu(.04)), 1]] : t == null ? fadeIn(tu(.3)) : [[0, 0], [tu(.3), 0], [tu(.34), 1], [t, 1], [f3(t + tu(.08)), 0]] });
        R(lit, x + 8, y0 + 8, w - 16, h - 16, 12, { fill: TA(.6), sw: 0, stroke: 'none' }); if (t != null) ripple(p, x + w / 2, y0, 50, t); }
      cbox(p, c, Cn, 390, -245, 180, E.ts, { noLabel: true });
      endM(p, c, d, bx + bs / 2, by - bs / 2);
    }); });

  /* 05 ── 2 × 2 GRID (ตาราง 2×2): dashed tiles in a grid; up — the boxes flip in one by one; down — they flip away, the dashed tiles stay. The center
     (if any) stands to the right */
  variant('grid', 'ตาราง 2×2', (d, c) => { const X = ITM(d), E = EV(d), Cn = CEN(d), s = E.n === 2 ? 230 : 200, g = 30, gx = Cn ? -150 : 0, gy = 40, o = (s + g) / 2;
    const P = E.n === 2 ? [[gx - o, gy], [gx + o, gy]] : [[gx - o, gy - o], [gx + o, gy - o], [gx - o, gy + o], [gx + o, gy + o]].slice(0, E.n);
    art(c, p => { base(p, c, d, E); slots(p, P.map(q => q[0]), P.map(q => q[1]), s); P.forEach(([x, y], k) => item(p, c, X, x, y, s, E, k, { in: 'flip', out: 'flip', ghost: false }));
      cbox(p, c, Cn, 320, gy, 220, E.ts); endM(p, c, d, P[E.n - 1][0] + s / 2, P[E.n - 1][1] - s / 2);
    }); });

  /* 06 ── QUEUE LANE (เส้นทางเลื่อน): a lane with moving chevrons; up — the boxes slide in from the left along it and line up against the end (the
     center, if any); down — they slide back out to the left, the last in first */
  variant('lane', 'เส้นทางเลื่อน', (d, c) => { const X = ITM(d), E = EV(d), Cn = CEN(d), s = Cn ? (E.n >= 4 ? 166 : 185) : (E.n >= 4 ? 195 : 215), y = 40, xr = Cn ? 350 - 100 - 30 - s / 2 : 440 - s / 2, xs = Array.from({ length: E.n }, (_, k) => f1(xr - k * (s + 18)));
    art(c, p => { base(p, c, d, E); const ly = y + s / 2 + 34; 
      for (let k = 0; k < 6; k++) { const x = -420 + k * 160, g = mvG(p, { x: [[0, 0], [tu(.1), 0], [f3(Z.H + tu(.6)), 60]], o: fadeIn(tu(.1 + .03 * k), .06) }); g.path(`M ${x} ${ly + 22} L ${x + 18} ${ly + 40} L ${x} ${ly + 58}`, { sw: 3, stroke: TL_(.5) }); }
      xs.forEach((x, k) => item(p, c, X, x, y, s, E, k, { in: 'slide', dx: f1(-540 - x), out: 'slide', dx2: 0, dur: .34, ...(E.up ? {} : { dx: f1(-560 - x) }) }));
      cbox(p, c, Cn, 350, y, 200, E.ts, { ly: y - 150 }); endM(p, c, d, xs[0] + s / 2, y - s / 2);
    }); });

  /* 07 ── BUBBLES (ฟองลอย): round plates; up — they float up from below and settle into a cluster one by one; down — they pop one by one with a little
     burst. The center (if any) is a bigger plate on the left */
  variant('bubbles', 'ฟองลอย', (d, c) => { const X = ITM(d), E = EV(d), Cn = CEN(d), s = E.n >= 4 ? 175 : 200, cx = Cn ? 120 : 0, cy = 10;
    const OF = E.n >= 4 ? [[-150, 70], [0, -70], [150, 70], [0, 210]] : E.n === 3 ? [[-130, 60], [0, -90], [130, 60]] : [[-115, 0], [115, 0]];
    art(c, p => { base(p, c, d, E); OF.forEach(([ox, oy], k) => { const x = cx + ox, y = cy + oy, r = item(p, c, X, x, y, s, E, k, { shape: 'circ', in: 'fly', from: [x + (k % 2 ? 60 : -60), 470], mid: [x, y + 160], out: 'shrink', dur: .34 });
        if (!E.up && r.t != null) sparkAt(p, x, y, s / 2 + 6, s / 2 + 36, f3(r.t + tu(.2)), 8, 22.5); });
      cbox(p, c, Cn, -320, 20, 230, E.ts, { circ: true }); endM(p, c, d, cx + OF[E.n - 1][0] + s / 2, cy + OF[E.n - 1][1] - s / 2);
    }); });

  /* 08 ── BIG ARROW (ลูกศรใหญ่): a thick arrow draws across (rising for up, falling for down); the boxes sit along it — up: they pop on in order toward
     the head; down: they shrink away from the head back. The center (if any) sits at the tail */
  variant('arrow', 'ลูกศรใหญ่', (d, c) => { const X = ITM(d), E = EV(d), Cn = CEN(d), s = E.n >= 4 ? 180 : 205, a = E.up ? [-430, 250] : [-430, -230], b = E.up ? [440, -240] : [440, 260], an = Math.atan2(b[1] - a[1], b[0] - a[0]);
    art(c, p => { base(p, c, d, E, E.up ? { dx: 432, dy: 292 } : { cy: 292, dx: 432, dy: -292 }); on(p.line(a[0], a[1], b[0], b[1], { sw: 16, stroke: TA(.5) }), p, 0, { draw: [[0, 0], [tu(.06), 0], [tu(.5), 1, 'out']] });
      const h1 = an + rad(150), h2 = an - rad(150); popAt(p, b[0], b[1], tu(.5)).path(`M ${f1(b[0] + 70 * Math.cos(h1))} ${f1(b[1] + 70 * Math.sin(h1))} L ${b[0]} ${b[1]} L ${f1(b[0] + 70 * Math.cos(h2))} ${f1(b[1] + 70 * Math.sin(h2))}`, { sw: 16, stroke: TA(.5) });
      for (let k = 0; k < E.n; k++) { const f = (k + 1) / (E.n + 1) * .92 + .04, x = f1(lerp(a[0], b[0], f)), y = f1(lerp(a[1], b[1], f)); item(p, c, X, x, y, s, E, k, { in: 'pop', out: 'shrink' }); }
      cbox(p, c, Cn, a[0] + 30, a[1] + (E.up ? -50 : 50), 185, E.ts, { noLabel: true }); endM(p, c, d, b[0] - 30, b[1] + (E.up ? 90 : -90));
    }); });

  /* 09 ── COUNTER DOTS (จุดนับ): one big item box in the middle; a row of round counters under it — up: they fill one by one (the box bumps each
     time); down: they empty one by one. The center (if any) sits to the right */
  variant('dots', 'จุดนับ', (d, c) => { const X = ITM(d), E = EV(d), Cn = CEN(d), bx = Cn ? -110 : 0, by = -50, bs = 300;
    art(c, p => { base(p, c, d, E); const K = { px: bx, py: by, s: multiBump(E.ts, 1.06) }; ibox(p, c, X, bx, by, bs, tu(.06), { g: mvG(popAt(p, bx, by, tu(.06)), K), mv: K });
      rowX(E.n, 76, 40, bx).forEach((x, k) => { const t = E.at(k), y = 220; popAt(p, x, y, tu(.2 + .05 * k)).circle(x, y, 38, F(3.4)); const g = sub(p);
        on(g, p, 0, { o: E.up ? [[0, 0], [t, 0], [f3(t + tu(.04)), 1]] : t == null ? fadeIn(tu(.4)) : [[0, 0], [tu(.4), 0], [tu(.44), 1], [t, 1], [f3(t + tu(.06)), 0]] });
        g.circle(x, y, 26, { fill: ACC1, sw: 0, stroke: 'none' }); if (t != null) ripple(p, x, y, 44, t); });
      cbox(p, c, Cn, 330, by, 200, E.ts); endM(p, c, d, bx + bs / 2, by - bs / 2);
    }); });

  /* 10 ── FAN OF CARDS (การ์ดพัด): tall cards fan out from a pivot below; up — each card swings out to its place one by one; down — cards lift away
     along their own line and fade. The center (if any) sits top-right */
  variant('fan', 'การ์ดพัด', (d, c) => { const X = ITM(d), E = EV(d), Cn = CEN(d), A = E.n >= 4 ? [-33, -11, 11, 33] : E.n === 3 ? [-24, 0, 24] : [-13, 13], px = 0, py = 440, cw = 190, ch = 250, cy0 = 30;
    art(c, p => { base(p, c, d, E, { dx: Cn ? 432 : 432, dy: Cn ? 290 : -292 }); const cl = CL(p);
      A.forEach((a, k) => { const t = E.at(k), t0 = f3(tu(.08 + .06 * k)), K = { px, py };
        if (E.up) { const ts = f3(t - tu(.32)); Object.assign(K, { r: [[0, 0], [ts, 0], [t, a + Math.sign(a || 1) * 4, 'out'], [f3(t + tu(.1)), a, 'soft']], y: [[0, 140], [ts, 140], [f3(ts + tu(.16)), 0, 'out']], o: fadeIn(ts, .04) }); }
        else { const te = t == null ? null : f3(t + tu(.32)); Object.assign(K, { r: [[0, 0], [t0, 0], [f3(t0 + tu(.3)), a, 'out']], o: t == null ? fadeIn(t0, .04) : [[0, 0], [t0, 0], [f3(t0 + tu(.04)), 1], [t, 1], [te, 0]] });
          if (t != null) K.y = [[0, 0], [t, 0], [te, -260, 'in']]; }
        const g = mvG(cl, K); R(g, px - cw / 2, cy0, cw, ch, 30, F(4)); R(g, px - cw / 2 + 14, cy0 + 14, cw - 28, ch - 28, 22, S(1.4)); const mv = Object.assign({}, K); delete mv.o;
        if (X && picOf(X)) put(p, c, { icon: X.icon }, px, cy0 + ch / 2, 145, null, { t: E.up ? f3(t - tu(.32)) : t0, mv, o: K.o }); else if (X) txt(g, X.label, px, cy0 + ch / 2 + 10, { size: 46, maxW: cw - 24, weight: 800, color: C.ink, wrap: 'mid' }); });
      cbox(p, c, Cn, 350, -210, 190, E.ts, { ly: -210 + 150 }); endM(p, c, d, 0, -60);
    }); });

  /* 11 ── RING AROUND (วงรอบศูนย์): the center in the middle (or a dashed ring); the boxes around it, each tied by a line — up: they pop on one by one
     round it and their lines draw; down: they fly outward and their lines vanish */
  variant('ring', 'วงรอบศูนย์', (d, c) => { const X = ITM(d), E = EV(d), Cn = CEN(d), cx = 0, cy = 20, R0 = E.n === 2 ? 285 : 262, s = E.n >= 4 ? 172 : 190;
    const A = E.n >= 4 ? [-135, -45, 45, 135] : E.n === 3 ? [-90, 30, 150] : [180, 0];
    art(c, p => { base(p, c, d, E); if (Cn) cbox(p, c, Cn, cx, cy, 200, E.ts, { noLabel: true }); else { drawAt(p.circle(cx, cy, 90, DASH(.6)), p, tu(.06), tu(.3)); popAt(p, cx, cy, tu(.1)).circle(cx, cy, 20, { fill: ACC1, sw: 2, stroke: ACC1 }); }
      A.forEach((a, k) => { const x = f1(cx + R0 * Math.cos(rad(a))), y = f1(cy + R0 * Math.sin(rad(a))), t = E.at(k), x1 = f1(cx + 120 * Math.cos(rad(a))), y1 = f1(cy + 120 * Math.sin(rad(a))), x2 = f1(cx + (R0 - s * .6) * Math.cos(rad(a))), y2 = f1(cy + (R0 - s * .6) * Math.sin(rad(a)));
        const ln = p.line(x1, y1, x2, y2, { sw: 3, stroke: ACC1 }); if (E.up) on(ln, p, 0, { draw: [[0, 0], [f3(t - tu(.1)), 0], [t, 1, 'out']] }); else on(ln, p, 0, { o: t == null ? fadeIn(tu(.3)) : [[0, 0], [tu(.3), 0], [tu(.34), 1], [t, 1], [f3(t + tu(.06)), 0]] });
        item(p, c, X, x, y, s, E, k, { in: 'pop', out: 'fly', to: [f1(cx + 700 * Math.cos(rad(a))), f1(cy + 700 * Math.sin(rad(a)))], mid: [f1(cx + 450 * Math.cos(rad(a))), f1(cy + 450 * Math.sin(rad(a)))] }); });
      if (Cn && Cn.label && picOf(Cn)) pill(p, Cn.label, cx, cy + 140, { t: tu(.3), size: 50, maxW: 360 }); endM(p, c, d, cx + 90, cy - 90);
    }); });

  /* 12 ── RISING BARS (แท่งโต): bars stand on a baseline, each with the item box on top — up: each bar grows and its box pops on top; down: bars sink
     back into the baseline one by one, their boxes riding down */
  variant('bars', 'แท่งโต', (d, c) => { const X = ITM(d), E = EV(d), Cn = CEN(d), s = E.n >= 4 ? 170 : 195, by = 316, xs = rowX(E.n, s, 44, Cn ? 70 : 0);
    art(c, p => { base(p, c, d, E, { dx: Cn ? 150 : 432 }); 
      xs.forEach((x, k) => { const h = lerp(90, 250, E.n > 1 ? k / (E.n - 1) : 1), t = E.at(k), bw = 90, top = by - h, iy = f1(top - s / 2 - 12);
        const BK2 = E.up ? { px: x, py: by, sy: [[0, 0], [f3(t - tu(.34)), 0], [f3(t - tu(.06)), 1.06, 'out'], [t, 1, 'soft']], o: fadeIn(f3(t - tu(.34)), .04) }
          : { px: x, py: by, sy: t == null ? [[0, 0], [tu(.1 + .05 * k), 0], [tu(.4 + .05 * k), 1, 'out']] : [[0, 0], [tu(.1 + .05 * k), 0], [tu(.4 + .05 * k), 1, 'out'], [t, 1], [f3(t + tu(.3)), 0, 'in']], o: fadeIn(tu(.1 + .05 * k), .04) };
        R(mvG(p, BK2), x - bw / 2, top, bw, h, 18, { fill: TA(.35), sw: 3.4, stroke: ACC1 });
        item(p, c, X, x, iy, s, E, k, { in: 'pop', out: 'sink', sinkY: h + s / 2, dur: E.up ? .14 : .3, ghost: false });   /* up: the box pops only once its bar has grown */ });
      cbox(p, c, Cn, -360, -170, 170, E.ts); endM(p, c, d, xs[E.n - 1] + s / 2, -260);
    }); });

  /* 13 ── LIST ROWS (แถวรายการ): rows with a big icon box and grey lines — up: each row slides in from the right under the last; down: a line strikes
     the row and it folds away. The center (if any) sits top-right */
  variant('list', 'แถวรายการ', (d, c) => { const X = ITM(d), E = EV(d), Cn = CEN(d), RW = Cn ? 680 : 880, rh = E.n >= 4 ? 168 : 185, gp = 4, y0 = 0 - ((E.n - 1) * (rh + gp)) / 2, bs = rh - 6;
    art(c, p => { base(p, c, d, E, { dx: Cn ? 250 : 432 });
      for (let k = 0; k < E.n; k++) { const y = f1(y0 + k * (rh + gp)), t = E.at(k), K = { px: 0, py: y };
        if (E.up) Object.assign(K, { x: [[0, 560], [f3(t - tu(.3)), 560], [t, -12, 'out'], [f3(t + tu(.1)), 0, 'soft']], o: fadeIn(f3(t - tu(.3)), .04) });
        else { const t0 = tu(.08 + .06 * k); Object.assign(K, { x: [[0, 560], [t0, 560], [f3(t0 + tu(.3)), 0, 'out']], o: fadeIn(t0, .04) }); if (t != null) Object.assign(K, { sy: [[0, 1], [f3(t + tu(.12)), 1], [f3(t + tu(.32)), 0, 'in']], o: fadeIn(t0, .04).concat([[f3(t + tu(.12)), 1], [f3(t + tu(.32)), 0]]) }); }
        const g = mvG(CL(p), K); R(g, -440, y - rh / 2, RW, rh, 34, F(3.6)); R(g, -420, y - bs / 2, bs, bs, bs * .24, F(3.4)); R(g, -420 + bs + 36, y - 30, RW - bs - 160, 24, 12, PH); R(g, -420 + bs + 36, y + 10, (RW - bs - 160) * .62, 24, 12, PH);
        const mv = Object.assign({}, K); delete mv.o; if (X && picOf(X)) put(p, c, { icon: X.icon }, -420 + bs / 2, y, bs * .64, null, { t: E.up ? f3(t - tu(.3)) : tu(.08 + .06 * k), mv, o: K.o }); else if (X) txt(g, X.label, -420 + bs / 2, y + 8, { size: 40, maxW: bs - 12, weight: 800, color: C.ink, wrap: 'mid' });
        if (!E.up && t != null) { const sg = sub(p); on(sg, p, 0, { o: [[0, 0], [t, 0], [f3(t + tu(.02)), 1], [f3(t + tu(.12)), 1], [f3(t + tu(.2)), 0]] }); drawAt(sg.line(-450, y, -430 + RW, y, { sw: 6, stroke: ACC1 }), p, t, tu(.12)); }
        if (E.up) ripple(p, -420 + bs / 2, y, bs * .6, t); }
      cbox(p, c, Cn, 370, 10, 200, E.ts); endM(p, c, d, -440 + RW, f1(y0 + (E.n - 1) * (rh + gp)) - rh / 2);
    }); });

  /* 14 ── MERGE (รวมเป็นหนึ่ง): one item box in the middle that grows a step with each copy that flies into it (up), or shrinks a step as copies split
     off and fly away (down) */
  variant('merge', 'รวมเป็นหนึ่ง', (d, c) => { const X = ITM(d), E = EV(d), Cn = CEN(d), cx = Cn ? -120 : 0, cy = 20, sF = 320, lo = .42, far = [[-470, -320], [470, -320], [-470, 320], [470, 320]];
    art(c, p => { base(p, c, d, E, { dx: Cn ? 250 : 432 }); const sc = j => lo + (1 - lo) * j / E.n, Kk = [[0, E.up ? sc(0) : 1]];
      ORD(E).forEach(k => { const t = E.at(k), v = E.up ? sc(k + 1) : sc(k); Kk.push([t, Kk[Kk.length - 1][1]], [f3(t + tu(.08)), v * 1.06, 'out'], [f3(t + tu(.2)), v, 'soft']); }); const K = { px: cx, py: cy, s: Kk }; ibox(p, c, X, cx, cy, sF, tu(.06), { g: mvG(popAt(p, cx, cy, tu(.06)), K), mv: K });
      for (let k = 0; k < E.n; k++) { if (E.at(k) == null) continue; const fr = far[k % 4]; item(p, c, X, cx, cy, 170, E, k, E.up ? { in: 'fly', from: fr, vanish: true, dur: .36 } : { out: 'fly', to: fr, hidden: true, dur: .36 }); }
      cbox(p, c, Cn, 340, 20, 210, E.ts); endM(p, c, d, cx + 150, cy - 150);
    }); });

  /* 15 ── PILE (กองพูน): boxes pile into a little pyramid — up: bottom row first, each drops and squashes; down: from the top, each flies off up and
     away. The center (if any) stands on the left */
  variant('pile', 'กองพูน', (d, c) => { const X = ITM(d), E = EV(d), Cn = CEN(d), s = E.n >= 4 ? 185 : 205, g = 14, px = Cn ? 130 : 0, by = 290 - s / 2;
    const P = E.n >= 4 ? [[-1, 0], [0, 0], [1, 0], [0, 1]] : E.n === 3 ? [[-.5, 0], [.5, 0], [0, 1]] : [[-.5, 0], [.5, 0]];
    art(c, p => { base(p, c, d, E); 
      P.forEach(([i, j], k) => { const x = f1(px + i * (s + g)), y = f1(by - j * (s + g)); item(p, c, X, x, y, s, E, k, { in: 'drop', out: 'fly', to: [x + 200, -470], mid: [x + 120, y - 140] }); });
      cbox(p, c, Cn, -330, 100, 200, E.ts); const tp = P[E.n - 1]; endM(p, c, d, px + tp[0] * (s + g) + s / 2, by - tp[1] * (s + g) - s / 2);
    }); });

  /* 16 ── ORBIT (โคจรเข้า): a dashed orbit round the center; up — each box sweeps round the orbit and parks at its place; down — each sweeps on round
     and flies off outward */
  variant('orbit', 'โคจรเข้า', (d, c) => { const X = ITM(d), E = EV(d), Cn = CEN(d), cx = 0, cy = 20, R0 = 255, s = E.n >= 4 ? 168 : 188, A = E.n >= 4 ? [-150, -30, 30, 150] : E.n === 3 ? [-90, 30, 150] : [-160, -20];
    art(c, p => { base(p, c, d, E); drawAt(p.circle(cx, cy, R0, DASH(.45)), p, tu(.06), tu(.4)); if (Cn) cbox(p, c, Cn, cx, cy, 210, E.ts, { noLabel: true }); else popAt(p, cx, cy, tu(.1)).circle(cx, cy, 26, { fill: ACC1, sw: 2, stroke: ACC1 });
      A.forEach((a, k) => { const x = f1(cx + R0 * Math.cos(rad(a))), y = f1(cy + R0 * Math.sin(rad(a))), t = E.at(k), K = { px: cx, py: cy }, t0 = f3(tu(.08 + .06 * k));
        if (E.up) { const ts = f3(t - tu(.45)); Object.assign(K, { r: [[0, -160], [ts, -160], [t, 4, 'out'], [f3(t + tu(.1)), 0, 'soft']], o: fadeIn(ts, .04) }); }
        else Object.assign(K, t == null ? { o: fadeIn(t0, .04) } : { r: [[0, 0], [t, 0], [f3(t + tu(.4)), 120, 'in']], s: [[0, 1], [t, 1], [f3(t + tu(.4)), 1.6, 'in']], o: [[0, 0], [t0, 0], [f3(t0 + tu(.04)), 1], [f3(t + tu(.25)), 1], [f3(t + tu(.4)), 0]] });
        if (!E.up && t != null) ghost(p, x, y, s, f3(t + tu(.4))); const g = mvG(CL(p), K); R(g, x - s / 2, y - s / 2, s, s, s * .24, F(4)); const mv = Object.assign({}, K); delete mv.o;
        if (X && picOf(X)) put(p, c, { icon: X.icon }, x, y, s * .72, null, { t: E.up ? f3(t - tu(.45)) : t0, mv, o: K.o }); else if (X) txt(g, X.label, x, y + 8, { size: 42, maxW: s - 16, weight: 800, color: C.ink, wrap: 'mid' }); });
      if (Cn && Cn.label && picOf(Cn)) pill(p, Cn.label, cx, cy + 150, { t: tu(.3), size: 50, maxW: 360 }); endM(p, c, d, cx + 100, cy - 100);
    }); });

  /* 17 ── TALLY (ขีดนับ): a big item box; beside it tally strokes — up: one stroke draws for each arrival (the box bumps); down: the strokes are struck
     through and dim one by one */
  variant('tally', 'ขีดนับ', (d, c) => { const X = ITM(d), E = EV(d), Cn = CEN(d), bx = -250, by = 20, bs = 290;
    art(c, p => { base(p, c, d, E, { dx: Cn ? 250 : 432 }); const K = { px: bx, py: by, s: multiBump(E.ts, 1.06) }; ibox(p, c, X, bx, by, bs, tu(.06), { g: mvG(popAt(p, bx, by, tu(.06)), K), mv: K });
      for (let k = 0; k < E.n; k++) { const x = 40 + k * (Cn ? 76 : 100), t = E.at(k), ln = p.line(x, by - 130, x - 14, by + 130, { sw: 12, stroke: ACC1 });
        if (E.up) { on(ln, p, 0, { draw: [[0, 0], [f3(t - tu(.14)), 0], [t, 1, 'out']] }); dust(p, x - 14, by + 130, t, .6); }
        else { on(ln, p, 0, { draw: [[0, 0], [tu(.2 + .06 * k), 0], [tu(.4 + .06 * k), 1, 'out']], o: t == null ? [[0, 1]] : [[0, 1], [f3(t + tu(.1)), 1], [f3(t + tu(.25)), .25]] });
          if (t != null) drawAt(p.line(x - 50, by + 40, x + 40, by - 40, W(6)), p, t, tu(.12)); } }
      cbox(p, c, Cn, 390, -220, 180, E.ts, { noLabel: true }); endM(p, c, d, bx + bs / 2, by - bs / 2);
    }); });

  /* 18 ── STEP DIAL (หน้าปัดขั้น): a half dial with one notch per item; the needle steps up a notch with each arrival (down: steps back), the notches
     light behind it; the item box sits in the dial's middle */
  variant('stepdial', 'หน้าปัดขั้น', (d, c) => { const X = ITM(d), E = EV(d), Cn = CEN(d), cx = 0, cy = 230, r = 300, ang = j => 180 + 180 * j / E.n;
    art(c, p => { base(p, c, d, E, { dx: Cn ? 250 : 432 }); for (let j = 0; j < E.n; j++) { const a0 = ang(j) + 2, a1 = ang(j + 1) - 2, P = a => f1(cx + r * Math.cos(rad(a))) + ' ' + f1(cy + r * Math.sin(rad(a))), dd = `M ${P(a0)} A ${r} ${r} 0 0 1 ${P(a1)}`;
        drawAt(p.path(dd, { sw: 26, stroke: TL_(.16) }), p, tu(.04 + .04 * j), tu(.14)); const t = E.up ? E.at(j) : E.at(j), g = sub(p);
        on(g, p, 0, { o: E.up ? [[0, 0], [t, 0], [f3(t + tu(.04)), 1]] : t == null ? fadeIn(tu(.3)) : [[0, 0], [tu(.3), 0], [tu(.34), 1], [t, 1], [f3(t + tu(.06)), 0]] }); g.path(dd, { sw: 26, stroke: ACC1 }); }
      const st = E.up ? [0] : [E.n]; const RK = [[0, ang(st[0]) - ang(E.up ? E.n : E.keep)]]; const fin = ang(E.up ? E.n : E.keep);
      ORD(E).forEach(k => { const t = E.at(k), j = E.up ? k + 1 : k, v = ang(j) - fin; RK.push([f3(t - tu(.12)), RK[RK.length - 1][1]], [t, v + (E.up ? 4 : -4), 'out'], [f3(t + tu(.1)), v, 'soft']); }); const nd = mvG(p, { px: cx, py: cy, r: RK, o: fadeIn(tu(.2), .04) }); nd.line(cx, cy, f1(cx + (r - 50) * Math.cos(rad(fin))), f1(cy + (r - 50) * Math.sin(rad(fin))), W(7)); popAt(p, cx, cy, tu(.2)).circle(cx, cy, 24, SOLID(2));
      const K = { px: cx, py: -165, s: multiBump(E.ts, 1.06) }; ibox(p, c, X, cx, -165, 180, tu(.1), { g: mvG(popAt(p, cx, -165, tu(.1)), K), mv: K });
      cbox(p, c, Cn, 390, -200, 180, E.ts, { noLabel: true }); endM(p, c, d, cx + 110, -250);
    }); });

  /* 19 ── PILL TAGS (เม็ดไอคอน): wide pills (big icon + grey line) in two columns — up: each pops in with a bounce; down: each shrinks away. The center
     (if any) sits top-right */
  variant('pills', 'เม็ดไอคอน', (d, c) => { const X = ITM(d), E = EV(d), Cn = CEN(d), pw = 430, ph = 172, P = [[-228, -70], [228, -70], [-228, 130], [228, 130]].slice(0, E.n).map(q => E.n === 2 ? [q[0], 40] : q);
    art(c, p => { base(p, c, d, E, { dx: Cn ? 250 : 432 });
      P.forEach(([x, y], k) => { const t = E.at(k), t0 = f3(tu(.08 + .06 * k)), K = { px: x, py: y };
        if (E.up) Object.assign(K, { s: [[0, .2], [f3(t - tu(.3)), .2], [t, 1.1, 'out'], [f3(t + tu(.14)), 1, 'soft']], o: fadeIn(f3(t - tu(.3)), .04) });
        else Object.assign(K, { s: [[0, .3], [t0, .3], [f3(t0 + tu(.24)), 1.06, 'out'], [f3(t0 + tu(.36)), 1, 'soft']].concat(t == null ? [] : [[t, 1], [f3(t + tu(.06)), 1.08, 'out'], [f3(t + tu(.3)), 0, 'in']]), o: fadeIn(t0, .04).concat(t == null ? [] : [[f3(t + tu(.28)), 1], [f3(t + tu(.3)), 0]]) });
        if (!E.up && t != null) ghost(p, x, y, ph, f3(t + tu(.3)), 'pill', pw); const g = mvG(p, K); R(g, x - pw / 2, y - ph / 2, pw, ph, ph / 2, F(4)); g.circle(x - pw / 2 + ph / 2, y, ph / 2 - 12, S(1.6)); R(g, x - pw / 2 + ph + 10, y - 12, 200, 24, 12, PH);
        const mv = Object.assign({}, K); delete mv.o; if (X && picOf(X)) put(p, c, { icon: X.icon }, x - pw / 2 + ph / 2, y, 124, null, { t: E.up ? f3(t - tu(.3)) : t0, mv, o: K.o }); else if (X) txt(g, X.label, x + 20, y + 14, { size: 46, maxW: pw - 60, weight: 800, color: C.ink }); });
      cbox(p, c, Cn, 0, -262, 170, E.ts, { noLabel: true }); const L = P[E.n - 1]; endM(p, c, d, L[0] + pw / 2, L[1] - ph / 2);
    }); });

  /* 20 ── FILL TANK (ถังเติม): a tall rounded container; up — each box drops in from above and the level inside rises a step; down — each floats up
     out of it and the level drops a step. The center (if any) stands on the right */
  variant('tank', 'ถังเติม', (d, c) => { const X = ITM(d), E = EV(d), Cn = CEN(d), tx = Cn ? -150 : 0, w = 380, h = 470, ty0 = -170, ty1 = ty0 + h;
    art(c, p => { base(p, c, d, E); R(inG(p, 'rise', tx, 60, tu(.04)), tx - w / 2, ty0, w, h, 50, F(4.4)); const lv = j => .9 * j / E.n, LK = [[0, E.up ? 0.001 : lv(E.n)]];
      ORD(E).forEach(k => { const t = E.at(k), v = E.up ? lv(k + 1) : lv(k); LK.push([t, LK[LK.length - 1][1]], [f3(t + tu(.2)), v, 'out']); });
      R(mvG(p, { px: tx, py: ty1 - 10, sy: LK, o: fadeIn(tu(.1), .04) }), tx - w / 2 + 12, ty1 - 10 - (h - 20), w - 24, h - 20, 38, { fill: TA(.28), sw: 0, stroke: 'none' });
      for (let k = 0; k < E.n; k++) item(p, c, X, tx, E.up ? ty1 - 130 : ty0 + 150, 185, E, k, E.up ? { in: 'drop', vanish: true, dust: false, h: 640 } : { out: 'lift', hidden: true, dur: .4 });
      const TK = { px: tx, py: ty0, s: multiBump(E.ts, 1.06) }; ibox(p, c, X, tx, ty0, 170, tu(.2), { g: mvG(popAt(p, tx, ty0, tu(.2)), TK), mv: TK });
      cbox(p, c, Cn, 320, 60, 220, E.ts); endM(p, c, d, tx + w / 2, ty0);
    }); });

  /* 21 ── STOPS ON A PATH (จุดแวะ): a winding path with a stop per item, leading to the center (or an end ring) — up: each box travels in from the
     start along the path to its stop; down: each leaves its stop back along the path and out */
  variant('path', 'จุดแวะ', (d, c) => { const X = ITM(d), E = EV(d), Cn = CEN(d), s = E.n >= 4 ? 170 : 190, L = [[-520, 270], [-350, 230], [-150, 110], [50, 190], [240, 40], [330, -90]], ex = 380, ey = -200;
    art(c, p => { base(p, c, d, E, { cx: -450, cy: -292, dx: -60, dy: -292 }); on(p.path(pathOf(L.concat([[ex - 80, ey + 40]]), false), { sw: 6, stroke: TL_(.4), 'stroke-dasharray': '2 16', 'stroke-linecap': 'round' }), p, 0, { o: fadeIn(tu(.06), .1) });
      if (Cn) cbox(p, c, Cn, ex, ey, 200, E.ts, { lx: ex - 230, ly: ey }); else { drawAt(p.circle(ex, ey, 60, W(4)), p, tu(.1), tu(.2)); popAt(p, ex, ey, tu(.2)).circle(ex, ey, 18, { fill: ACC1, sw: 0, stroke: 'none' }); }
      const stops = [L[1], L[2], L[3], L[4]].slice(4 - E.n).reverse();
      stops.forEach((q, k) => { const P = L.slice(0, L.indexOf(q) + 1); item(p, c, X, q[0], q[1], s, E, k, E.up ? { in: 'fly', from: P[0], mid: P.length > 2 ? P[P.length - 2] : [(P[0][0] + q[0]) / 2, q[1] - 80], dur: .38 } : { out: 'fly', to: [-560, 300], mid: P.length > 2 ? P[P.length - 2] : [-400, 260], dur: .38 }); });
      endM(p, c, d, ex + 90, ey - 90);
    }); });

  /* 22 ── PLUS / MINUS (บวก / ลบ): the boxes on a staircase (rising for up, falling for down); each change shows its sign — up: a box pops in with a +
     badge; down: a − badge pops on a box and it fades away */
  variant('plusminus', 'บวก / ลบ', (d, c) => { const X = ITM(d), E = EV(d), Cn = CEN(d), s = E.n >= 4 ? 180 : 205, xs = rowX(E.n, s, 34, Cn ? 70 : 0);
    art(c, p => { base(p, c, d, E); xs.forEach((x, k) => { const y = f1(E.up ? 200 - k * (E.n > 1 ? 300 / (E.n - 1) : 0) : -100 + k * (E.n > 1 ? 300 / (E.n - 1) : 0)), t = E.at(k);
        item(p, c, X, x, y, s, E, k, { in: 'pop', out: 'shrink', dur: .34 }); if (t == null) return;
        const bx = x + s / 2 - 6, by = y - s / 2 + 6, g = sub(p); on(g, p, 0, { ox: bx, oy: by, s: [[0, .2], [f3(t - tu(.02)), .2], [f3(t + tu(.12)), 1.1, 'out'], [f3(t + tu(.22)), 1, 'soft']], o: E.up ? fadeIn(f3(t - tu(.02)), .03) : [[0, 0], [f3(t - tu(.02)), 0], [f3(t + tu(.01)), 1], [f3(t + tu(.3)), 1], [f3(t + tu(.36)), 0]] });
        g.circle(bx, by, 48, { fill: ACC1, sw: 2, stroke: ACC1 }); g.line(bx - 22, by, bx + 22, by, { sw: 8, stroke: C.fill }); if (E.up) g.line(bx, by - 22, bx, by + 22, { sw: 8, stroke: C.fill }); });
      cbox(p, c, Cn, -380, E.up ? -170 : 170, 185, E.ts, { noLabel: true }); endM(p, c, d, xs[E.n - 1], (E.up ? 200 - 300 : -100 + 300) + (E.up ? -s / 2 - 70 : s / 2 + 70));
    }); });

  /* 23 ── MOVE ACROSS (ย้ายเข้าโซน): two dashed zones — outside on the left, the center's zone on the right; up — each box moves from the left zone into
     the right one; down — each moves out of the right zone to the left one */
  variant('across', 'ย้ายเข้าโซน', (d, c) => { const X = ITM(d), E = EV(d), Cn = CEN(d), s = E.n >= 4 ? 175 : 200, zx = 215, zy = 75, zw = 470, zh = 440, o = (s + 26) / 2;
    const IN = (E.n === 2 ? [[-o, 0], [o, 0]] : [[-o, -o], [o, -o], [-o, o], [o, o]].slice(0, E.n)).map(([a, b]) => [zx + a, zy + b]), OUT = IN.map(([x, y]) => [x - 560, y]);
    art(c, p => { base(p, c, d, E); [[-340, 250], [zx, zw]].forEach(([x, w], k) => on(R(p, x - w / 2, zy - zh / 2, w, zh, 40, k ? { sw: 3.4, stroke: ACC1, 'stroke-dasharray': '10 12' } : DASH(.35)), p, 0, { o: fadeIn(tu(.04 + .06 * k), .08) }));
      drawAt(p.path('M -180 50 L -40 50 M -70 22 L -36 50 L -70 78', W(5)), p, tu(.2), tu(.2)); if (!E.up) p.g.lastChild.setAttribute('transform', 'rotate(180 -110 50)');
      IN.forEach(([x, y], k) => { const fr = OUT[k]; item(p, c, X, x, y, s, E, k, E.up ? { in: 'fly', from: fr, mid: [(fr[0] + x) / 2, y - 140], dur: .36 } : { out: 'fly', to: fr, mid: [(fr[0] + x) / 2, y - 140], dur: .36 }); });
      cbox(p, c, Cn, zx, zy - zh / 2 - 100, 170, E.ts, { noLabel: true }); if (Cn && Cn.label && picOf(Cn)) pill(p, Cn.label, zx, zy + zh / 2 + 4, { t: tu(.3), size: 50, maxW: 380 });
      endM(p, c, d, zx - zw / 2 + 10, zy - zh / 2 + 10);
    }); });

  /* 24 ── FRAME (กรอบรวม): a big rounded frame; up — the boxes land at scattered spots inside, each with a ripple; down — they break into dots and
     vanish one by one. The center (if any) sits on the frame's top edge */
  variant('frame', 'กรอบรวม', (d, c) => { const X = ITM(d), E = EV(d), Cn = CEN(d), s = E.n >= 4 ? 185 : 210, fw = 900, fh = 560, fy = 50, P = [[-250, -30], [40, 110], [250, -40], [-80, -90], [-260, 150]];
    const Q = E.n >= 4 ? [[-270, -20], [-60, 120], [140, -60], [300, 110]] : E.n === 3 ? [[-230, 40], [0, -40], [230, 60]] : [[-150, 30], [150, 30]];
    art(c, p => { base(p, c, d, E); const fg = mvG(p, { px: 0, py: fy, s: [[0, .9], [tu(.04), .9], [tu(.3), 1.02, 'out'], [tu(.4), 1, 'soft']], o: fadeIn(tu(.04), .06) }); R(fg, -fw / 2, fy - fh / 2, fw, fh, 46, S(2.6)); R(fg, -fw / 2 + 18, fy - fh / 2 + 18, fw - 36, fh - 36, 32, { sw: 1.4, stroke: TL_(.25) });
      Q.forEach(([qx, qy], k) => { const x = qx, y = fy + qy, r = item(p, c, X, x, y, s, E, k, { in: 'pop', out: 'shrink', dur: .3 }); if (r.t == null) return;
        if (E.up) ripple(p, x, y, s * .65, r.t); else for (let j = 0; j < 6; j++) { const a = rad(j * 60 + 15), g = mvG(p, { x: [[0, 0], [r.t, 0], [f3(r.t + tu(.4)), f1(110 * Math.cos(a)), 'out']], y: [[0, 0], [r.t, 0], [f3(r.t + tu(.4)), f1(110 * Math.sin(a)), 'out']], o: [[0, 0], [f3(r.t + tu(.1)), 0], [f3(r.t + tu(.14)), 1], [f3(r.t + tu(.4)), 0]] }); g.circle(x, y, 9, { fill: ACC1, sw: 0, stroke: 'none' }); } });
      cbox(p, c, Cn, 0, fy - fh / 2, 175, E.ts, { noLabel: true }); endM(p, c, d, fw / 2 - 20, fy - fh / 2 + 20);
    }); });

  /* 25 ── TWO TIERS (สองชั้น): two long lines like tiers; the boxes stand on them — up: each rises out of its line (overshoot); down: each sinks back
     into its line. The center (if any) stands at the top tier's right end */
  variant('tiers', 'สองชั้น', (d, c) => { const X = ITM(d), E = EV(d), Cn = CEN(d), s = E.n >= 4 ? 165 : 185, Ly = [20, 300], xs2 = rowX(2, s, 70, Cn ? -120 : 0);
    const P = E.n >= 4 ? [[0, 1], [1, 1], [0, 0], [1, 0]] : E.n === 3 ? [[0, 1], [1, 1], [0, 0]] : [[0, 1], [1, 1]];
    art(c, p => { base(p, c, d, E); 
      const cl = [CL(p)]; P.forEach(([i, j], k) => { const x = xs2[i], ly = Ly[j], y = f1(ly - s / 2 - 4), t = E.at(k), t0 = f3(tu(.1 + .06 * k)), K = { px: x, py: ly };
        if (E.up) Object.assign(K, { sy: [[0, 0], [f3(t - tu(.3)), 0], [t, 1.08, 'out'], [f3(t + tu(.12)), 1, 'soft']], o: fadeIn(f3(t - tu(.3)), .03) });
        else Object.assign(K, { sy: [[0, 0], [t0, 0], [f3(t0 + tu(.3)), 1.06, 'out'], [f3(t0 + tu(.4)), 1, 'soft']].concat(t == null ? [] : [[t, 1], [f3(t + tu(.06)), 1.06, 'out'], [f3(t + tu(.32)), 0, 'in']]), o: fadeIn(t0, .03).concat(t == null ? [] : [[f3(t + tu(.3)), 1], [f3(t + tu(.32)), 0]]) });
        if (!E.up && t != null) ghost(p, x, y, s, f3(t + tu(.32))); const g = mvG(cl[0], K); R(g, x - s / 2, y - s / 2, s, s, s * .24, F(4)); const mv = Object.assign({}, K); delete mv.o;
        if (X && picOf(X)) put(p, c, { icon: X.icon }, x, y, s * .72, null, { t: E.up ? f3(t - tu(.3)) : t0, mv, o: K.o }); else if (X) txt(g, X.label, x, y + 10, { size: 44, maxW: s - 18, weight: 800, color: C.ink, wrap: 'mid' });
        if (t != null) rippleE(p, x, ly, s * .7, 16, t); });
      cbox(p, c, Cn, 330, -100, 220, E.ts, { ly: -100 + 150 }); const L = P[E.n - 1]; endM(p, c, d, xs2[L[0]] + s / 2, Ly[L[1]] - s - 4);
    }); });

  /* ================= round 2 — designs 26–50 (user 2026-11-14 "ทำรอบ 2 ต่อได้") — same rules: big icon slots, graphic elements only ================= */

  /* 26 ── COLUMN OF SLOTS (ช่องแนวตั้ง): a column of dashed slots; up — boxes slide in from the right into them, top first; down — they slide back out
     to the right. The center (if any) stands big on the left */
  variant('vslots', 'ช่องแนวตั้ง', (d, c) => { const X = ITM(d), E = EV(d), Cn = CEN(d), s = E.n >= 4 ? 166 : E.n === 3 ? 200 : 230, gx = Cn ? 260 : 60, cy = 0, ys = Array.from({ length: E.n }, (_, k) => f1(cy + (k - (E.n - 1) / 2) * (s + 8)));
    art(c, p => { base(p, c, d, E); slots(p, ys.map(() => gx), ys, s); ys.forEach((y, k) => item(p, c, X, gx, y, s, E, k, { in: 'slide', dx: 420, out: 'slide', ghost: false }));
      cbox(p, c, Cn, -230, cy, 250, E.ts); endM(p, c, d, gx + s / 2, ys[E.n - 1] - s / 2);
    }); });

  /* 27 ── MAGNET (ติดข้าง): the center (or the item's own big box) in the middle; up — boxes slide in from both sides and stick to its sides with a spark;
     down — they come unstuck and slide away */
  variant('magnet', 'ติดข้าง', (d, c) => { const X = ITM(d), E = EV(d), Cn = CEN(d), cs = 200, s = 172, cx = 0, cy = 40, P = [[1, 0], [-1, 0], [1, 1], [-1, 1]];
    art(c, p => { base(p, c, d, E); if (Cn) cbox(p, c, Cn, cx, cy, cs, E.ts, { ly: cy + cs / 2 + 40 }); else { const K = { px: cx, py: cy, s: multiBump(E.ts) }; ibox(p, c, X, cx, cy, cs, tu(.08), { g: mvG(popAt(p, cx, cy, tu(.08)), K), mv: K }); }
      for (let k = 0; k < E.n; k++) { const [sd, j] = P[k], x = f1(cx + sd * (cs / 2 + 10 + s / 2 + j * (s + 12))), r = item(p, c, X, x, cy, s, E, k, { in: 'slide', dx: sd * 520, out: 'slide', dx: sd * 520 });
        if (r.t != null) sparkAt(p, f1(x - sd * (s / 2 + 5)), cy, 12, 30, E.up ? r.t : f3(r.t + tu(.04)), 6, 0); }
      endM(p, c, d, cx, cy - cs / 2 - 70);
    }); });

  /* 28 ── BEACON (คลื่นส่ง): the center (or a dot) on the left sends a wave to the right with each change; up — a box pops where the wave reaches;
     down — a box fades as the wave passes */
  variant('beacon', 'คลื่นส่ง', (d, c) => { const X = ITM(d), E = EV(d), Cn = CEN(d), bx = -330, by = 40, s = E.n >= 4 ? 170 : 195;
    const P = Array.from({ length: E.n }, (_, k) => { const a = rad(lerp(-50, 50, E.n > 1 ? k / (E.n - 1) : .5)); return [f1(bx + 560 * Math.cos(a) - 40), f1(by + 300 * Math.sin(a))]; });
    art(c, p => { base(p, c, d, E); if (Cn) cbox(p, c, Cn, bx, by, 190, E.ts, { ly: by + 140 }); else { popAt(p, bx, by, tu(.08)).circle(bx, by, 30, { fill: ACC1, sw: 2, stroke: ACC1 }); p.circle(bx, by, 54, S(2)); }
      E.ts.forEach(t => arcsAt(p, bx + (Cn ? 100 : 40), by, 1, 3, 40, 40, 44, f3(t - tu(.22)), { sw: 3, stroke: ACC1 }, .05));
      P.forEach(([x, y], k) => item(p, c, X, x, y, s, E, k, { in: 'pop', out: 'shrink' })); endM(p, c, d, P[E.n - 1][0] + s / 2, P[E.n - 1][1] - s / 2);
    }); });

  /* 29 ── CASCADE (ไหลลงขั้น): a staircase of short ledges; up — each box hops down the ledges and lands in the row at the bottom; down — each hops
     back up the ledges and out */
  variant('cascade', 'ไหลลงขั้น', (d, c) => { const X = ITM(d), E = EV(d), Cn = CEN(d), s = E.n >= 4 ? 165 : 190, L = [[-430, -220], [-330, -150], [-230, -80], [-130, -10]], xs = rowX(E.n, s, 20, 100), y = 250;
    art(c, p => { base(p, c, d, E, { dx: 432 }); L.forEach(([x, ly], k) => drawAt(p.line(x - 40, ly, x + 50, ly, W(4)), p, tu(.04 + .04 * k), tu(.16))); 
      const hop = L.flatMap(([x, ly], k) => [[x - 20, ly - 70], [x + 20, ly - s * .3]]);
      xs.forEach((x, k) => item(p, c, X, x, y, s, E, k, E.up ? { in: 'fly', path: [[-500, -320]].concat(hop, [[(x - 130) / 2, 120]]), dur: .5, dust: false } : { out: 'fly', path: [[(x - 130) / 2, 120]].concat(hop.slice().reverse(), [[-500, -330]]), dur: .5 }));
      cbox(p, c, Cn, 330, -150, 170, E.ts); endM(p, c, d, xs[E.n - 1] + s / 2, y - s / 2);
    }); });

  /* 30 ── COUNTER RING (วงนับรอบไอคอน): one big item box ringed by arc pieces, one per item; up — the pieces light one by one round it; down — they go
     dark. The center (if any) sits top-right */
  variant('cring', 'วงนับรอบไอคอน', (d, c) => { const X = ITM(d), E = EV(d), Cn = CEN(d), cx = -20, cy = 30, r = 225, bs = 240;
    art(c, p => { base(p, c, d, E, { dx: Cn ? 250 : 432 }); const K = { px: cx, py: cy, s: multiBump(E.ts, 1.05) }; ibox(p, c, X, cx, cy, bs, tu(.06), { g: mvG(popAt(p, cx, cy, tu(.06)), K), mv: K });
      for (let k = 0; k < E.n; k++) { const a0 = -90 + k * 360 / E.n + 6, a1 = -90 + (k + 1) * 360 / E.n - 6, P = a => f1(cx + r * Math.cos(rad(a))) + ' ' + f1(cy + r * Math.sin(rad(a))), dd = `M ${P(a0)} A ${r} ${r} 0 0 1 ${P(a1)}`, t = E.at(k);
        drawAt(p.path(dd, { sw: 30, stroke: TL_(.16) }), p, tu(.06 + .04 * k), tu(.14)); const g = sub(p);
        on(g, p, 0, { o: E.up ? [[0, 0], [t, 0], [f3(t + tu(.04)), 1]] : t == null ? fadeIn(tu(.3)) : [[0, 0], [tu(.3), 0], [tu(.34), 1], [t, 1], [f3(t + tu(.06)), 0]] }); g.path(dd, { sw: 30, stroke: ACC1 });
        if (t != null) { const am = rad((a0 + a1) / 2); ripple(p, f1(cx + r * Math.cos(am)), f1(cy + r * Math.sin(am)), 30, t); } }
      cbox(p, c, Cn, 385, -215, 185, E.ts, { noLabel: true }); endM(p, c, d, cx + r * .75, cy - r * .75);
    }); });

  /* 31 ── CUP (ภาชนะรูปตัว U): an open U-shaped container; up — boxes drop into it side by side; down — they are lifted out one by one. The center (if
     any) stands above its right rim */
  variant('cup', 'ภาชนะตัว U', (d, c) => { const X = ITM(d), E = EV(d), Cn = CEN(d), s = Cn ? (E.n >= 4 ? 166 : 185) : (E.n >= 4 ? 185 : 210), w = E.n * (s + 18) + 50, x0 = -w / 2 - (Cn ? 70 : 0), y0 = 20, y1 = 300, xs = rowX(E.n, s, 22, x0 + w / 2), y = y1 - 22 - s / 2;
    art(c, p => { base(p, c, d, E); drawAt(p.path(`M ${f1(x0)} ${y0} L ${f1(x0)} ${y1 - 50} Q ${f1(x0)} ${y1} ${f1(x0 + 50)} ${y1} L ${f1(x0 + w - 50)} ${y1} Q ${f1(x0 + w)} ${y1} ${f1(x0 + w)} ${y1 - 50} L ${f1(x0 + w)} ${y0}`, W(5)), p, tu(.04), tu(.4));
      xs.forEach((x, k) => item(p, c, X, x, y, s, E, k, { in: 'drop', out: 'lift' })); cbox(p, c, Cn, Math.min(410, f1(x0 + w + 90)), -60, 170, E.ts, { ly: 75 });
      endM(p, c, d, xs[E.n - 1] + s / 2, y - s / 2);
    }); });

  /* 32 ── CHAIN (ต่อเป็นสาย): boxes joined in a line by links; up — a link reaches out from the last box and the new box pops on its end; down — the
     last link snaps and its box drops away */
  variant('chain', 'ต่อเป็นสาย', (d, c) => { const X = ITM(d), E = EV(d), Cn = CEN(d), x0 = Cn ? -400 : -450, gap = 24, s = Math.min(E.n >= 4 ? 185 : 210, ((475 - (x0 + (Cn ? 85 : 18) + gap)) - (E.n - 1) * gap) / E.n), cy = 40, xs = Array.from({ length: E.n }, (_, k) => f1(x0 + (Cn ? 85 : 18) + gap + s / 2 + k * (s + gap)));
    art(c, p => { base(p, c, d, E); if (Cn) cbox(p, c, Cn, x0, cy, 170, E.ts, { ly: cy + 130 }); else popAt(p, x0, cy, tu(.08)).circle(x0, cy, 18, { fill: ACC1, sw: 2, stroke: ACC1 });
      xs.forEach((x, k) => { const t = E.at(k), a = k ? xs[k - 1] + s / 2 : x0 + (Cn ? 85 : 18), b = x - s / 2, ln = p.line(a, cy, b, cy, { sw: 6, stroke: ACC1 });
        if (E.up) on(ln, p, 0, { draw: [[0, 0], [f3(t - tu(.2)), 0], [f3(t - tu(.04)), 1, 'out']] }); else on(ln, p, 0, { o: t == null ? fadeIn(tu(.3)) : [[0, 0], [tu(.3), 0], [tu(.34), 1], [t, 1], [f3(t + tu(.06)), 0]] });
        if (!E.up && t != null) sparkAt(p, f1((a + b) / 2), cy, 10, 26, t, 6, 0);
        item(p, c, X, x, cy, s, E, k, { in: 'pop', out: 'sink', sinkY: 220 }); });
      endM(p, c, d, xs[E.n - 1] + s / 2, cy - s / 2);
    }); });

  /* 33 ── BRANCHES (แตกกิ่ง): the center (or a node) at the top with elbow branches down to a row; up — a branch draws and its box pops at the end;
     down — the box shrinks away and its branch fades */
  variant('tree', 'แตกกิ่ง', (d, c) => { const X = ITM(d), E = EV(d), Cn = CEN(d), s = E.n >= 4 ? 190 : 210, ty = -190, ry = 185, xs = rowX(E.n, s, 24);
    art(c, p => { base(p, c, d, E); if (Cn) cbox(p, c, Cn, 0, ty, 170, E.ts, { lx: 220, ly: ty }); else { popAt(p, 0, ty, tu(.08)).circle(0, ty, 26, { fill: ACC1, sw: 2, stroke: ACC1 }); }
      const yb = Cn ? ty + 85 : ty + 26; drawAt(p.line(0, yb, 0, 10, W(4)), p, tu(.1), tu(.2));
      xs.forEach((x, k) => { const t = E.at(k), br = p.path(`M 0 10 L ${x} 10 L ${x} ${f1(ry - s / 2)}`, { sw: 4, stroke: ACC1 });
        if (E.up) on(br, p, 0, { draw: [[0, 0], [f3(t - tu(.22)), 0], [f3(t - tu(.04)), 1, 'out']] }); else on(br, p, 0, { o: t == null ? fadeIn(tu(.3)) : [[0, 0], [tu(.3), 0], [tu(.34), 1], [f3(t + tu(.2)), 1], [f3(t + tu(.3)), 0]] });
        item(p, c, X, x, ry, s, E, k, { in: 'pop', out: 'shrink' }); });
      endM(p, c, d, xs[E.n - 1] + s / 2, ry - s / 2);
    }); });

  /* 34 ── SPIRAL (เกลียว): a dashed spiral from the middle; up — each box travels out along it to its place, the next further out; down — each winds back
     in to the middle and vanishes */
  variant('spiral', 'เกลียว', (d, c) => { const X = ITM(d), E = EV(d), Cn = CEN(d), cx = 0, cy = 10, s = E.n >= 4 ? 170 : 190, sp = a => { const r = Math.max(100, 190 + .4 * (a - 120)); return [f1(cx + r * Math.cos(rad(a - 90))), f1(cy + r * .82 * Math.sin(rad(a - 90)))]; };
    const A = Array.from({ length: E.n }, (_, k) => 120 + k * (E.n >= 4 ? 100 : 130)), pts = Array.from({ length: 33 }, (_, j) => sp(15 * j));
    art(c, p => { base(p, c, d, E); on(p.path(pathOf(pts, false), DASH(.35)), p, 0, { o: fadeIn(tu(.06), .1) }); if (Cn) cbox(p, c, Cn, cx, cy, 175, E.ts, { noLabel: true }); else popAt(p, cx, cy, tu(.08)).circle(cx, cy, 18, { fill: ACC1, sw: 2, stroke: ACC1 });
      A.forEach((a, k) => { const [x, y] = sp(a), path = pts.filter((_, j) => 15 * j < a && 15 * j > a - 300); item(p, c, X, x, y, s, E, k, E.up ? { in: 'fly', path: [[cx, cy]].concat(path), dur: .45 } : { out: 'fly', path: path.slice().reverse().concat([[cx, cy]]), dur: .45 }); });
      endM(p, c, d, sp(A[E.n - 1])[0] + s / 2, sp(A[E.n - 1])[1] - s / 2);
    }); });

  /* 35 ── DECK (สำรับซ้อน): big boxes stacked as a deck, each a little up and to the right; up — each slides in from the right onto the top; down —
     the top one is dealt off to the left */
  variant('deck', 'สำรับซ้อน', (d, c) => { const X = ITM(d), E = EV(d), Cn = CEN(d), s = 250, dx = 28, x0 = (Cn ? -150 : -40) - (E.n - 1) * dx / 2, y0 = 70 + (E.n - 1) * dx / 2;
    art(c, p => { base(p, c, d, E); for (let k = 0; k < E.n; k++) { const t = E.at(k), tn = k < E.n - 1 ? E.at(k + 1) : null, ts = () => f3(Math.max(tu(.05), t - tu(.3)));
        /* icons sit on a layer above every card, so a covered card's icon hides while the card on top of it is there */
        const io = E.up ? (k < E.n - 1 ? [[0, 0], [ts(), 0], [f3(ts() + tu(.04)), 1], [f3(tn - tu(.22)), 1], [f3(tn - tu(.16)), 0]] : null)
          : k === E.n - 1 ? null : tn == null ? [[0, 0]] : [[0, 0], [f3(tn + tu(.12)), 0], [f3(tn + tu(.18)), 1]].concat(t == null ? [] : [[t, 1], [f3(t + tu(.3)), 0]]);
        item(p, c, X, f1(x0 + k * dx), f1(y0 - k * dx), s, E, k, { in: 'slide', out: 'slide', dx: E.up ? 560 : -620, ghost: false, io: io || undefined }); }
      cbox(p, c, Cn, 320, 40, 220, E.ts); endM(p, c, d, x0 + (E.n - 1) * dx + s / 2, y0 - (E.n - 1) * dx - s / 2);
    }); });

  /* 36 ── SWEEP (กวาดผ่าน): a hand sweeps round a half circle from a pivot below; up — a box pops as the hand passes its place; down — each box blinks
     out as the hand passes */
  variant('sweep', 'กวาดผ่าน', (d, c) => { const X = ITM(d), E = EV(d), Cn = CEN(d), px = 0, py = 300, R0 = 330, s = E.n >= 4 ? 168 : 190, A = Array.from({ length: E.n }, (_, k) => lerp(200, 340, E.n > 1 ? k / (E.n - 1) : .5));
    art(c, p => { base(p, c, d, E); drawAt(p.path(`M ${px - R0 - 40} ${py} A ${R0 + 40} ${R0 + 40} 0 0 1 ${px + R0 + 40} ${py}`, DASH(.3)), p, tu(.04), tu(.3)); if (Cn) cbox(p, c, Cn, px, py - 80, 175, E.ts, { noLabel: true }); else popAt(p, px, py, tu(.08)).circle(px, py, 22, SOLID(2));
      const a0 = E.up ? 180 : 360, a1 = E.up ? 360 : 180, RK = [[0, a0], [f3(E.T0 - tu(.3)), a0]]; ORD(E).forEach(k => RK.push([E.at(k), A[k]])); RK.push([f3(E.H + tu(.3)), a1, 'io']);
      const hand = mvG(p, { px, py, r: RK.map(([t, v, e]) => [t, f1(v - 360), e]), o: fadeIn(tu(.1), .04) }); hand.line(px, py, px + R0 + 40, py, { sw: 5, stroke: ACC1 });
      A.forEach((a, k) => { const x = f1(px + R0 * Math.cos(rad(a))), y = f1(py + R0 * Math.sin(rad(a))); item(p, c, X, x, y, s, E, k, { in: 'pop', out: 'shrink', dur: .2 }); });
      endM(p, c, d, 420, -200);
    }); });

  /* 37 ── GATHER (รวมกลุ่ม): a dashed area in the middle; up — boxes fly in from scattered spots round the edge into a tight group inside; down — the
     group breaks up and the boxes fly back out to the edges */
  variant('gather', 'รวมกลุ่ม', (d, c) => { const X = ITM(d), E = EV(d), Cn = CEN(d), s = E.n === 2 ? 215 : 185, g = 20, cx = Cn ? 110 : 0, cy = 40, o = (s + g) / 2, far = [[-470, -120], [470, -300], [-420, 330], [470, 300]];
    const P = (E.n === 2 ? [[-o, 0], [o, 0]] : [[-o, -o], [o, -o], [-o, o], [o, o]].slice(0, E.n)).map(([a, b]) => [cx + a, cy + b]);
    art(c, p => { base(p, c, d, E); on(R(p, cx - o * 2 - 30, cy - (E.n === 2 ? o : o * 2) - 30, o * 4 + 60, (E.n === 2 ? o * 2 : o * 4) + 60, 50, DASH(.45)), p, 0, { o: fadeIn(tu(.06), .1) });
      P.forEach(([x, y], k) => item(p, c, X, x, y, s, E, k, E.up ? { in: 'fly', from: far[k], dur: .38 } : { out: 'fly', to: far[k], dur: .38 })); cbox(p, c, Cn, -340, 40, 180, E.ts);
      endM(p, c, d, P[E.n - 1][0] + s / 2, P[E.n - 1][1] - s / 2);
    }); });

  /* 38 ── STRETCHING ROW (แถวยืดได้): a pill-shaped holder that stretches to the right as each box joins (up) or shrinks as each leaves (down) */
  variant('growrow', 'แถวยืดได้', (d, c) => { const X = ITM(d), E = EV(d), Cn = CEN(d), s = Cn ? (E.n >= 4 ? 166 : 180) : (E.n >= 4 ? 182 : 205), g = 14, x0 = Cn ? -300 : -420, cy = 40, xs = Array.from({ length: E.n }, (_, k) => f1(x0 + 30 + s / 2 + k * (s + g))), W0 = 60 + E.n * (s + g) - g;
    art(c, p => { base(p, c, d, E); const wf = j => Math.max(.18, (60 + j * (s + g) - (j ? g : 0)) / W0), SK = [[0, E.up ? wf(0) : 1]];
      ORD(E).forEach(k => { const t = E.at(k), v = E.up ? wf(k + 1) : wf(k); SK.push([f3(t - tu(.12)), SK[SK.length - 1][1]], [t, v * 1.02, 'out'], [f3(t + tu(.1)), v, 'soft']); });
      R(mvG(p, { px: x0, py: cy, sx: SK, o: fadeIn(tu(.04), .06) }), x0, cy - s / 2 - 20, W0, s + 40, (s + 40) / 2, F(4.2));
      xs.forEach((x, k) => item(p, c, X, x, cy, s, E, k, { in: 'slide', dx: 380, out: 'slide', dx: 420, ghost: false })); cbox(p, c, Cn, -410, cy, 170, E.ts, { ly: cy + 140 });
      endM(p, c, d, xs[E.n - 1] + s / 2, cy - s / 2 - 10);
    }); });

  /* 39 ── ROUND HOLDER (วงบรรจุ): a big circle holds the boxes as round plates; up — each drops in from above and bounces into place; down — each floats
     up out of the circle */
  variant('circlepack', 'วงบรรจุ', (d, c) => { const X = ITM(d), E = EV(d), Cn = CEN(d), cx = Cn ? 110 : 0, cy = 30, R0 = 290, s = E.n >= 4 ? 170 : 195, o = s * .58;
    const P = (E.n >= 4 ? [[-o, o * .6], [o, o * .6], [0, -o * .9], [0, o * 1.9]] : E.n === 3 ? [[-o, o * .4], [o, o * .4], [0, -o * .9]] : [[-o * .9, 0], [o * .9, 0]]).map(([a, b]) => [f1(cx + a), f1(cy + b - (E.n >= 4 ? 40 : 0))]);
    art(c, p => { base(p, c, d, E); drawAt(p.circle(cx, cy, R0, W(4)), p, tu(.04), tu(.4)); P.forEach(([x, y], k) => item(p, c, X, x, y, s, E, k, { shape: 'circ', in: 'fly', from: [x, -470], mid: [x, y - 180], out: 'lift', dur: .34 }));
      cbox(p, c, Cn, -380, 30, 170, E.ts, { circ: true }); endM(p, c, d, cx + R0 * .7, cy - R0 * .7);
    }); });

  /* 40 ── STEP LINE (เส้นขั้นบันได): a stepped line climbs (or, for down, its steps are taken back); each step carries a box — up: the line reaches a new
     step and its box pops; down: the top box goes and the line drops back a step */
  variant('stepline', 'เส้นขั้นบันได', (d, c) => { const X = ITM(d), E = EV(d), Cn = CEN(d), x0 = -440, w = 880 / E.n, s = Math.min(E.n >= 4 ? 190 : 210, w - 16), by = 300, hs = Array.from({ length: E.n }, (_, k) => f1(by - 70 - k * (E.n >= 4 ? 90 : 120)));
    art(c, p => { base(p, c, d, E); const pts = [[x0, by]];
      hs.forEach((h, k) => { pts.push([f1(x0 + k * w), h], [f1(x0 + (k + 1) * w), h]); }); const ln = p.path(pathOf(pts, false), { sw: 6, stroke: ACC1 }), cum = [0]; for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])); const seg = k => cum[2 * k + 2] / cum[cum.length - 1];
      const DK = [[0, E.up ? 0 : 1]]; ORD(E).forEach(k => { const t = E.at(k), v = E.up ? seg(k) : (k ? seg(k - 1) : .02); DK.push([f3(t - tu(.2)), DK[DK.length - 1][1]], [t, v, 'out']); }); on(ln, p, 0, { draw: DK });
      hs.forEach((h, k) => item(p, c, X, f1(x0 + (k + .5) * w), f1(h - s / 2 - 10), s, E, k, { in: 'pop', out: 'shrink' })); cbox(p, c, Cn, -360, -210, 185, E.ts, { ly: -210 + 145 });
      endM(p, c, d, f1(x0 + (E.n - .5) * w + s / 2), f1(hs[E.n - 1] - s - 10));
    }); });

  /* 41 ── TWO LANES (สองเลน): a faint upper lane (outside) and a bright lower lane (inside, the center at its end); up — boxes drop from the upper lane
     into the lower one; down — they rise from the lower lane back up and out */
  variant('twolanes', 'สองเลน', (d, c) => { const X = ITM(d), E = EV(d), Cn = CEN(d), s = Cn ? (E.n >= 4 ? 166 : 180) : (E.n >= 4 ? 185 : 205), xs = rowX(E.n, s, 18, Cn ? -135 : 0), ya = -130, yb = 180;
    art(c, p => { base(p, c, d, E); 
      xs.forEach((x, k) => item(p, c, X, x, yb, s, E, k, E.up ? { in: 'fly', from: [x - 60, ya], mid: [x - 20, ya - 60], dur: .36 } : { out: 'fly', to: [x + 80, -460], mid: [x + 40, ya], dur: .4 }));
      if (E.up) xs.forEach((x, k) => { const t = E.at(k), g = sub(p); on(g, p, 0, { o: [[0, 0], [tu(.2), 0], [tu(.24), 1], [f3(t - tu(.36)), 1], [f3(t - tu(.34)), 0]] }); R(g, x - 60 - s / 2, ya - s / 2, s, s, s * .24, DASH(.45)); });
      cbox(p, c, Cn, 390, yb - 20, 170, E.ts, { ly: yb - 150 }); endM(p, c, d, xs[E.n - 1] + s / 2, yb - s / 2);
    }); });

  /* 42 ── PORTAL (ประตูวง): an upright ring on the left; up — the boxes come out of it one by one and slide to their places; down — they slide back into
     it and are gone */
  variant('portal', 'ประตูวง', (d, c) => { const X = ITM(d), E = EV(d), Cn = CEN(d), s = E.n >= 4 ? 172 : 200, px = -380, cy = 40, xs = Array.from({ length: E.n }, (_, k) => f1(px + 80 + s / 2 + k * (s + 16)));
    art(c, p => { base(p, c, d, E); const cl = clipG(p, px, -350, 860, 700); on(ell(p, px, cy, 46, 190, { sw: 6, stroke: ACC1 }), p, 0, { s: [[0, 0], [tu(.06), 0], [tu(.3), 1.05, 'out'], [tu(.4), 1, 'soft']], ox: px, oy: cy, o: fadeIn(tu(.06), .04) });
      xs.forEach((x, k) => { const t = E.at(k), K = { px: x, py: cy }, t0 = f3(tu(.1 + .06 * k)), dx = f1(px - 40 - x - s / 2);
        if (E.up) Object.assign(K, { x: [[0, dx], [f3(t - tu(.36)), dx], [t, 8, 'out'], [f3(t + tu(.1)), 0, 'soft']], o: fadeIn(f3(t - tu(.36)), .02) });
        else Object.assign(K, t == null ? { x: [[0, dx], [t0, dx], [f3(t0 + tu(.3)), 0, 'out']], o: fadeIn(t0, .02) } : { x: [[0, dx], [t0, dx], [f3(t0 + tu(.3)), 0, 'out'], [t, 0], [f3(t + tu(.36)), dx, 'in']], o: fadeIn(t0, .02) });
        if (!E.up && t != null) ghost(p, x, cy, s, f3(t + tu(.36)));
        const g = mvG(cl, K); R(g, x - s / 2, cy - s / 2, s, s, s * .24, F(4)); const mv = Object.assign({}, K); delete mv.o;
        if (X && picOf(X)) put(p, c, { icon: X.icon }, x, cy, s * .72, null, { t: E.up ? f3(t - tu(.2)) : f3(t0 + tu(.16)), mv, o: E.up ? [[0, 0], [f3(t - tu(.2)), 0], [f3(t - tu(.16)), 1]] : (t == null ? [[0, 0], [f3(t0 + tu(.16)), 0], [f3(t0 + tu(.2)), 1]] : [[0, 0], [f3(t0 + tu(.16)), 0], [f3(t0 + tu(.2)), 1], [f3(t + tu(.2)), 1], [f3(t + tu(.24)), 0]]) });
        else if (X) txt(g, X.label, x, cy + 10, { size: 42, maxW: s - 18, weight: 800, color: C.ink, wrap: 'mid' }); });
      cbox(p, c, Cn, 385, 235, 180, E.ts, { noLabel: true }); endM(p, c, d, xs[E.n - 1] + s / 2, cy - s / 2);
    }); });

  /* 43 ── STICKERS (สติกเกอร์แปะ): tilted boxes slapped down overlapping a little — up: each lands from big to its size with a ripple; down: each peels
     off, turning, and flies away */
  variant('stickers', 'สติกเกอร์แปะ', (d, c) => { const X = ITM(d), E = EV(d), Cn = CEN(d), s = E.n >= 4 ? 190 : 215, cx = Cn ? 110 : 0, cy = 50, P = [[-160, -60, -8], [120, -80, 6], [-110, 130, 5], [170, 120, -6]];
    art(c, p => { base(p, c, d, E); P.slice(0, E.n).forEach(([ox, oy, a], k) => { const x = cx + ox * (E.n === 2 ? 1.1 : 1), y = cy + (E.n === 2 ? 0 : oy), t = E.at(k), t0 = f3(tu(.08 + .06 * k)), K = { px: x, py: y };
        if (E.up) Object.assign(K, { s: [[0, 1.5], [f3(t - tu(.2)), 1.5], [t, .94, 'in'], [f3(t + tu(.1)), 1, 'soft']], r: [[0, a * 3], [f3(t - tu(.2)), a * 3], [t, a, 'in']], o: fadeIn(f3(t - tu(.2)), .03) });
        else Object.assign(K, { s: [[0, 1.5], [t0, 1.5], [f3(t0 + tu(.2)), .94, 'in'], [f3(t0 + tu(.3)), 1, 'soft']], r: [[0, a * 3], [t0, a * 3], [f3(t0 + tu(.2)), a, 'in']].concat(t == null ? [] : [[t, a], [f3(t + tu(.34)), a + 40, 'in']]), o: fadeIn(t0, .03).concat(t == null ? [] : [[f3(t + tu(.2)), 1], [f3(t + tu(.34)), 0]]) });
        if (!E.up && t != null) { K.x = [[0, 0], [t, 0], [f3(t + tu(.34)), 260, 'in']]; K.y = [[0, 0], [t, 0], [f3(t + tu(.34)), -300, 'in']]; ghost(p, x, y, s, f3(t + tu(.34))); }
        const g = mvG(CL(p), K); R(g, x - s / 2, y - s / 2, s, s, s * .2, F(4)); const mv = Object.assign({}, K); delete mv.o; if (E.up) ripple(p, x, y, s * .6, t);
        if (X && picOf(X)) put(p, c, { icon: X.icon }, x, y, s * .72, null, { t: E.up ? f3(t - tu(.2)) : t0, mv, o: K.o }); else if (X) txt(g, X.label, x, y + 12, { size: 46, maxW: s - 20, weight: 800, color: C.ink, wrap: 'mid' }); });
      cbox(p, c, Cn, -360, 40, 180, E.ts); const L = P[E.n - 1]; endM(p, c, d, cx + L[0] + s / 2, cy + (E.n === 2 ? 0 : L[1]) - s / 2);
    }); });

  /* 44 ── RIDER (ไอคอนวิ่งบนแถบ): one big item box rides along a bar of segments; up — it hops to the next segment each time and lights it; down — it
     hops back and the segment goes dark. The center (if any) waits at the bar's end */
  variant('rider', 'ไอคอนวิ่งบนแถบ', (d, c) => { const X = ITM(d), E = EV(d), Cn = CEN(d), x0 = -430, x1 = Cn ? 220 : 430, by = 220, sw = (x1 - x0) / E.n, bs = 170;
    art(c, p => { base(p, c, d, E); const cxs = Array.from({ length: E.n }, (_, k) => f1(x0 + (k + .5) * sw));
      cxs.forEach((x, k) => { const t = E.at(k); R(atG(p, tu(.06 + .04 * k)), x - sw / 2 + 6, by - 30, sw - 12, 60, 30, F(3)); const g = sub(p);
        on(g, p, 0, { o: E.up ? [[0, 0], [t, 0], [f3(t + tu(.04)), 1]] : t == null ? fadeIn(tu(.3)) : [[0, 0], [tu(.3), 0], [tu(.34), 1], [t, 1], [f3(t + tu(.06)), 0]] }); R(g, x - sw / 2 + 14, by - 22, sw - 28, 44, 22, { fill: ACC1, sw: 0, stroke: 'none' }); });
      const fin = E.up ? E.n - 1 : Math.max(0, E.keep - 1), ry = by - 30 - bs / 2 - 14, XK = [[0, f1((E.up ? cxs[0] - sw : cxs[E.n - 1]) - cxs[fin])]];
      ORD(E).forEach(k => { const t = E.at(k), j = E.up ? k : Math.max(-1, k - 1), v = f1((j < 0 ? cxs[0] - sw * .6 : cxs[j]) - cxs[fin]); XK.push([f3(t - tu(.24)), XK[XK.length - 1][1]], [t, v, 'out']); });
      const YK = [[0, 0]]; ORD(E).forEach(k => { const t = E.at(k); YK.push([f3(t - tu(.24)), 0], [f3(t - tu(.12)), -60, 'out'], [t, 0, 'in']); });
      const K = { px: cxs[fin], py: ry, x: XK, y: YK, s: multiBump(E.ts, 1.06) }; ibox(p, c, X, cxs[fin], ry, bs, tu(.1), { g: mvG(popAt(p, cxs[fin], ry, tu(.1)), K), mv: K });
      cbox(p, c, Cn, 360, by - 60, 180, E.ts, { ly: by + 70 }); endM(p, c, d, x1, by - 120);
    }); });

  /* 45 ── BOUNCE (เด้งเข้า): up — each box bounces in from the left edge along the floor (two bounces) to its place; down — each bounces off to the right
     and out */
  variant('bounce', 'เด้งเข้า', (d, c) => { const X = ITM(d), E = EV(d), Cn = CEN(d), s = Cn ? (E.n >= 4 ? 165 : 185) : (E.n >= 4 ? 190 : 210), fy = 300, y = fy - s / 2, xs = rowX(E.n, s, 24, Cn ? 110 : 0);
    art(c, p => { base(p, c, d, E); 
      xs.forEach((x, k) => { const L = E.up ? [[-560, y - 220], [lerp(-560, x, .35), y], [lerp(-560, x, .62), y - 130], [lerp(-560, x, .85), y], [lerp(-560, x, .93), y - 40]] : [[lerp(x, 600, .2), y - 140], [lerp(x, 600, .45), y], [lerp(x, 600, .7), y - 90], [600, y - 40]];
        const r = item(p, c, X, x, y, s, E, k, E.up ? { in: 'fly', path: L, dur: .55, dust: false } : { out: 'fly', path: L, dur: .5 }); if (E.up) dust(p, x, fy, r.t, .6); });
      cbox(p, c, Cn, -360, 0, 180, E.ts); endM(p, c, d, xs[E.n - 1] + s / 2, y - s / 2);
    }); });

  /* 46 ── ZOOM OUT (ขยายจากกลาง): up — each box springs out of the middle, growing as it flies to its place in a 2 × 2; down — each shrinks back into the
     middle and is gone */
  variant('zoom', 'ขยายจากกลาง', (d, c) => { const X = ITM(d), E = EV(d), Cn = CEN(d), s = E.n === 2 ? 220 : 190, g = 26, cx = Cn ? 130 : 0, cy = 40, o = (s + g) / 2;
    const P = (E.n === 2 ? [[-o, 0], [o, 0]] : [[-o, -o], [o, -o], [-o, o], [o, o]].slice(0, E.n)).map(([a, b]) => [cx + a, cy + b]);
    art(c, p => { base(p, c, d, E); popAt(p, cx, cy, tu(.1)).circle(cx, cy, 14, { fill: ACC1, sw: 0, stroke: 'none' });
      P.forEach(([x, y], k) => { const t = E.at(k), K = { px: x, py: y }, t0 = f3(tu(.08 + .06 * k)), dx = f1(cx - x), dy = f1(cy - y);
        if (E.up) Object.assign(K, { x: [[0, dx], [f3(t - tu(.3)), dx], [t, 0, 'out']], y: [[0, dy], [f3(t - tu(.3)), dy], [t, 0, 'out']], s: [[0, .1], [f3(t - tu(.3)), .1], [t, 1.06, 'out'], [f3(t + tu(.1)), 1, 'soft']], o: fadeIn(f3(t - tu(.3)), .04) });
        else Object.assign(K, { s: [[0, .3], [t0, .3], [f3(t0 + tu(.22)), 1.06, 'out'], [f3(t0 + tu(.34)), 1, 'soft']].concat(t == null ? [] : [[t, 1], [f3(t + tu(.3)), .1, 'in']]), o: fadeIn(t0, .04).concat(t == null ? [] : [[f3(t + tu(.26)), 1], [f3(t + tu(.3)), 0]]) }, t == null ? {} : { x: [[0, 0], [t, 0], [f3(t + tu(.3)), dx, 'in']], y: [[0, 0], [t, 0], [f3(t + tu(.3)), dy, 'in']] });
        if (!E.up && t != null) ghost(p, x, y, s, f3(t + tu(.3)));
        const gg = mvG(p, K); R(gg, x - s / 2, y - s / 2, s, s, s * .24, F(4)); const mv = Object.assign({}, K); delete mv.o;
        if (X && picOf(X)) put(p, c, { icon: X.icon }, x, y, s * .72, null, { t: E.up ? f3(t - tu(.3)) : t0, mv, o: K.o }); else if (X) txt(gg, X.label, x, y + 12, { size: 46, maxW: s - 20, weight: 800, color: C.ink, wrap: 'mid' }); });
      cbox(p, c, Cn, -340, 40, 180, E.ts); endM(p, c, d, P[E.n - 1][0] + s / 2, P[E.n - 1][1] - s / 2);
    }); });

  /* 47 ── BEADS (ลูกปัดบนเส้น): round plates on a sagging string with a stop at the left end; up — each slides down the string from the right and settles
     against the last; down — the right-most slides off the right end and drops away */
  variant('beads', 'ลูกปัดบนเส้น', (d, c) => { const X = ITM(d), E = EV(d), Cn = CEN(d), s = E.n >= 4 ? 180 : 200, xa = -440, xb = 470, sag = 150, ya = -40, cur = x => { const u = (x - xa) / (xb - xa); return f1(ya + sag * 4 * u * (1 - u) - 60 * u); };
    art(c, p => { base(p, c, d, E); const pts = Array.from({ length: 31 }, (_, j) => { const x = lerp(xa, xb, j / 30); return [f1(x), cur(x)]; }); drawAt(p.path(pathOf(pts, false), W(3.4)), p, tu(.04), tu(.4));
      if (Cn) cbox(p, c, Cn, xa + 60, ya - 140, 180, E.ts, { lx: xa + 270, ly: ya - 140 }); else drawAt(p.line(xa + 10, ya - 60, xa + 10, ya + 60, { sw: 10, stroke: ACC1 }), p, tu(.1), tu(.2));
      for (let k = 0; k < E.n; k++) { const x = f1(xa + 40 + s / 2 + k * (s + 8)), y = f1(cur(x) - s / 2 + 10), path = pts.filter(q => q[0] > x).reverse().map(q => [q[0], f1(q[1] - s / 2 + 10)]);
        item(p, c, X, x, y, s, E, k, E.up ? { shape: 'circ', in: 'fly', path: path.length ? path : [[x + 100, y]], dur: .45 } : { shape: 'circ', out: 'fly', path: path.slice().reverse().concat([[560, 200]]), dur: .45 }); }
      endM(p, c, d, xa + 40 + s / 2 + (E.n - 1) * (s + 8) + s / 2, cur(0) - s);
    }); });

  /* 48 ── SPLIT COPIES (แยกตัว): one box in the middle; up — copies split off it one by one and slide out to their places beside it; down — the copies
     slide back into the middle one and are gone */
  variant('split', 'แยกตัว', (d, c) => { const X = ITM(d), E = EV(d), Cn = CEN(d), s = E.n >= 4 ? 185 : 210, cy = 50, step = s + 24, cx = Cn ? 100 : 0;
    const off = E.n >= 4 ? [-.5, .5, -1.5, 1.5] : E.n === 3 ? [0, 1, -1] : [-.5, .5], xs = off.map(v => f1(cx + v * step)), home = xs[0];
    art(c, p => { base(p, c, d, E); xs.forEach((x, k) => item(p, c, X, x, cy, s, E, k, k === 0 ? { in: 'pop', out: 'shrink' } : E.up ? { in: 'fly', from: [home, cy], mid: [(home + x) / 2, cy - 90], dur: .32 } : { out: 'fly', to: [home, cy], mid: [(home + x) / 2, cy - 90], dur: .32 }));
      cbox(p, c, Cn, -380, cy, 170, E.ts); endM(p, c, d, Math.max(...xs) + s / 2, cy - s / 2);
    }); });

  /* 49 ── RAIN (ตกเป็นสาย): up — boxes fall at a slant one after another and land in a heap row on the floor (dust); down — they lift off the floor and
     drift up and away, leaving dashed places */
  variant('rain', 'ตกเป็นสาย', (d, c) => { const X = ITM(d), E = EV(d), Cn = CEN(d), s = Cn ? (E.n >= 4 ? 165 : 185) : (E.n >= 4 ? 190 : 210), fy = 300, y = fy - s / 2, xs = rowX(E.n, s, 22, Cn ? 110 : 0);
    art(c, p => { base(p, c, d, E); for (let j = 0; j < 7; j++) { const x = -420 + j * 140, g = mvG(p, { y: [[0, -60], [tu(.1), -60], [f3(Z.H + tu(.4)), 80]], o: [[0, 0], [tu(.1 + .03 * j), 0], [tu(.16 + .03 * j), 1], [f3(Z.H + tu(.2)), 1], [f3(Z.H + tu(.4)), 0]] }); g.line(x, -260, x - 30, -170, { sw: 2.4, stroke: TL_(.35) }); }
      xs.forEach((x, k) => item(p, c, X, x, y, s, E, k, E.up ? { in: 'fly', from: [x + 160, -470], mid: [x + 60, y - 220], dur: .32 } : { out: 'fly', to: [x - 140, -470], mid: [x - 40, y - 260], dur: .4 }));
      if (E.up) xs.forEach((x, k) => dust(p, x, fy, E.at(k), .6)); cbox(p, c, Cn, -360, -60, 180, E.ts); endM(p, c, d, xs[E.n - 1] + s / 2, y - s / 2);
    }); });

  /* 50 ── LAYERS (ชั้นซ้อนรอบ): the item's box in the middle; up — a new outline layer grows out around it with each arrival; down — the outer layers peel
     away one by one. The center (if any) sits top-right */
  variant('layers', 'ชั้นซ้อนรอบ', (d, c) => { const X = ITM(d), E = EV(d), Cn = CEN(d), cx = -10, cy = 30, bs = 190;
    art(c, p => { base(p, c, d, E, { dx: Cn ? 250 : 432 }); const K = { px: cx, py: cy, s: multiBump(E.ts, 1.05) }; ibox(p, c, X, cx, cy, bs, tu(.06), { g: mvG(popAt(p, cx, cy, tu(.06)), K), mv: K });
      for (let k = 0; k < E.n; k++) { const sz = bs + 70 * (k + 1), t = E.at(k), o2 = .9 - k * .15, LK = { px: cx, py: cy };
        if (E.up) Object.assign(LK, { s: [[0, .7], [f3(t - tu(.2)), .7], [t, 1.04, 'out'], [f3(t + tu(.1)), 1, 'soft']], o: fadeIn(f3(t - tu(.2)), .04) });
        else Object.assign(LK, { s: [[0, .7], [tu(.2 + .06 * k), .7], [tu(.4 + .06 * k), 1, 'out']].concat(t == null ? [] : [[t, 1], [f3(t + tu(.3)), 1.25, 'in']]), o: fadeIn(tu(.2 + .06 * k), .04).concat(t == null ? [] : [[t, 1], [f3(t + tu(.3)), 0]]) });
        R(mvG(p, LK), cx - sz / 2, cy - sz / 2, sz, sz, sz * .24, { sw: 4, stroke: k === E.n - 1 ? ACC1 : TL_(o2) }); if (t != null && E.up) ripple(p, cx, cy, sz / 2, t); }
      cbox(p, c, Cn, 385, -215, 180, E.ts, { noLabel: true }); endM(p, c, d, cx + (bs + 70 * E.n) / 2, cy - (bs + 70 * E.n) / 2);
    }); });

  /* ---------- sample data: the same as B02 (A: sentences from unrelated topics · B: stress) ---------- */
  const SAMPLES = [
    { say: 'ลูกค้าเข้าร้านมากขึ้น', dir: 'up', n: 4, item: { icon: 'user' }, center: { icon: 'store', label: 'ร้าน' } },
    { say: 'งานกองสูงขึ้นทุกวัน', dir: 'up', n: 4, item: { icon: 'file-text', label: 'งาน' } },
    { say: 'เก็บเหรียญได้มากขึ้น', dir: 'up', n: 4, item: { icon: 'coins', label: 'เหรียญ' } },
    { say: 'ความรู้เข้าหัวมากขึ้น', dir: 'up', n: 3, item: { icon: 'book-open' }, center: { icon: 'brain' } },
    { say: 'ส่งของออกไปเรื่อย ๆ', dir: 'down', n: 4, keep: 1, item: { icon: 'package' }, center: { icon: 'store', label: 'โกดัง' } },
    { say: 'คะแนนดีขึ้นทุกเทอม', dir: 'up', n: 3, item: { icon: 'star', label: 'คะแนน' } },
    { say: 'ผู้ติดตามเพิ่มขึ้น', dir: 'up', n: 3, item: { icon: 'user-plus', label: 'ผู้ติดตาม' } },
    { say: 'กินขนมน้อยลง', dir: 'down', n: 4, keep: 1, item: { icon: 'cookie', label: 'ขนม' } },
    { say: 'ดึงคนเข้ามาได้มากขึ้น', dir: 'up', n: 4, item: { icon: 'user' } },
    { say: 'เพื่อนค่อย ๆ หายไป', dir: 'down', n: 4, keep: 1, item: { icon: 'user', label: 'เพื่อน' }, center: { icon: 'house' } },
    { say: 'ไข่ในถาดหมดแล้ว', dir: 'down', n: 4, keep: 0, item: { icon: 'egg', label: 'ไข่' }, end: 'x' },
    { say: 'รายได้พุ่งขึ้น', dir: 'up', n: 3, item: { icon: 'banknote', label: 'รายได้' } },
    { say: 'หนังสือบนชั้นเพิ่มขึ้น', dir: 'up', n: 4, item: { icon: 'book', label: 'หนังสือ' } },
    { say: 'ผ้าทยอยเก็บลงจากราว', dir: 'down', n: 4, keep: 2, item: { icon: 'shirt', label: 'ผ้า' } },
    { say: 'น้ำไหลเข้าถังมากขึ้น', dir: 'up', n: 3, item: { icon: 'droplet', label: 'น้ำ' } },
    { say: 'ต้นไม้โตขึ้น', dir: 'up', n: 3, item: { icon: 'sprout', label: 'ต้นไม้' } },
    { say: 'ความเครียดลดลง', dir: 'down', n: 4, keep: 1, item: { icon: 'cloud', label: 'ความเครียด' } },
    { say: 'ไฟในบ้านดับทีละดวง', dir: 'down', n: 4, keep: 1, item: { icon: 'lightbulb' } },
    { say: 'ใบไม้กองพูนขึ้น', dir: 'up', n: 4, item: { icon: 'leaf', label: 'ใบไม้' } },
    { say: 'นัดหมายเพิ่มเข้ามา', dir: 'up', n: 3, item: { icon: 'calendar', label: 'นัด' } },
  ];
  const STRESS = [
    { say: 'ใจรักมากขึ้น (2 ชิ้น ไม่มีป้าย)', dir: 'up', n: 2, item: { icon: 'heart' } },
    { say: 'สมาชิกออกจากกลุ่มจนหมด (+ เจ้าของ + สัญลักษณ์จบ)', dir: 'down', n: 4, keep: 0, item: { icon: 'user', label: 'สมาชิก' }, center: { icon: 'users', label: 'กลุ่ม' }, end: 'x' },
    { say: 'เงินเก็บเข้ากระปุกมากขึ้น (+ เจ้าของ)', dir: 'up', n: 4, item: { icon: 'coins', label: 'เงินเก็บ' }, center: { icon: 'piggy-bank', label: 'กระปุก' } },
    { say: 'ใบไม้ร่วงไป 1 ใบ เหลือ 3', dir: 'down', n: 4, keep: 3, item: { icon: 'leaf' } },
    { say: 'อีเมลเข้ามาเรื่อย ๆ (+ เจ้าของ)', dir: 'up', n: 3, item: { icon: 'mail', label: 'อีเมล' }, center: { icon: 'inbox' } },
    { say: 'ปลาในบ่อลดลง เหลือ 2', dir: 'down', n: 3, keep: 2, item: { icon: 'fish', label: 'ปลา' }, center: { icon: 'droplet', label: 'บ่อ' } },
    { say: 'ดอกไม้บานเพิ่ม 2 ดอก', dir: 'up', n: 2, item: { icon: 'flower', label: 'ดอกไม้' }, end: 'check' },
    { say: 'รถบนถนนน้อยลงจนหมด', dir: 'down', n: 3, keep: 0, item: { icon: 'car', label: 'รถ' }, end: 'circle-check' },
    { say: 'แจ้งเตือนเพิ่มขึ้น (+ เจ้าของ)', dir: 'up', n: 4, item: { icon: 'bell' }, center: { icon: 'user', label: 'ฉัน' } },
    { say: 'แชตเงียบลง เหลือ 1', dir: 'down', n: 4, keep: 1, item: { icon: 'message-circle', label: 'ข้อความ' }, center: { icon: 'user' } },
    { say: 'ของขวัญหายไปจนหมด', dir: 'down', n: 2, keep: 0, item: { icon: 'gift' }, end: 'x' },
    { say: 'ต้นไม้ในสวนเพิ่มขึ้น (+ เจ้าของ)', dir: 'up', n: 3, item: { icon: 'trees', label: 'ต้นไม้' }, center: { icon: 'house', label: 'บ้าน' } },
    { say: 'แอปเปิลบนชั้นลดลง เหลือ 2', dir: 'down', n: 4, keep: 2, item: { icon: 'apple' } },
    { say: 'เสื้อเพิ่มบนราว (2 ตัว)', dir: 'up', n: 2, item: { icon: 'shirt' }, end: 'check' },
    { say: 'พลังงานไหลออกจนเหลือ 1', dir: 'down', n: 3, keep: 1, item: { icon: 'zap', label: 'พลังงาน' } },
    { say: 'ใบไม้หดเล็กลง', dir: 'down', n: 4, keep: 1, item: { icon: 'leaf', label: 'ใบไม้' } },
    { say: 'จักรยานเพิ่มขึ้น (+ เจ้าของ)', dir: 'up', n: 3, item: { icon: 'bike' }, center: { icon: 'store', label: 'ร้านเช่า' } },
    { say: 'ไฟติดเพิ่มทีละดวง', dir: 'up', n: 4, item: { icon: 'lightbulb', label: 'ไฟ' } },
    { say: 'กองงานลดลงจนหมด', dir: 'down', n: 4, keep: 0, item: { icon: 'file-text', label: 'งาน' }, end: 'circle-check' },
    { say: 'นาฬิกาจับเวลาเพิ่ม (+ เจ้าของ)', dir: 'up', n: 4, item: { icon: 'timer' }, center: { icon: 'user', label: 'ทีม' } },
  ];

  G.cats = G.cats || {};
  G.cats.B02T = { variants: V, SAMPLES, STRESS, theme, draw: (i, d, c) => { setZ(c); CUR = V[i].id; tokens(); EMPTY = false; BLUE = false; V[i].build(d || {}, c); }, CLAMPS, timing: c => (setZ(c), Object.assign({}, Z)) };
})();
