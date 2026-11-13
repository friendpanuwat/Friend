/* b14.js — category B14 "ประโยคเด็ด / ใจความสำคัญ": minimal designs (user 2026-11-13: "อยากได้ให้มันออกมาแบบมินิมอลน้อยแต่มาก
   ต้องทำให้ดูสัก 2 รูปก่อนก็ได้") — stills first, two designs, the user decides the direction before the rest.
   CutPack (references/cutpack-CATEGORIES.md v2, cat_ai.py): idea THING = the heart of the line (icon + short label).
   First try (very minimal: quote marks / an open ring) → user: "เอาแบบเดิมดีกว่าครับ … ออกแบบมาเหมือนตั้งแต่ 1 ถึง 13 อยากได้ให้มันคงสไตล์นั้นไว้
   แต่ทำตามไอเดียในไฟล์ที่ผมแนบไป" → the house style of B01–B13 (real things, real structure) from the ideas in references/cutpack-visual-ideas.md:
   "ตัวอักษรบนโปสเตอร์" → 01 poster · "คนถือป้ายข้อความ" → 02 placard (whole person, no detailed hands) … 20 designs; 15 = the ticket dispenser
   (redesigned twice: quotation marks are out — user "ไม่เอาสัญลักษณ์ “ ”").
   No icon → the label is the hero in big type; nothing → a lit four-point star.
   GL.cats.B14.draw(i, data, { x, y, s, at, hit, speed }) — canvas 1000 × 700 centred at (0,0); hit = seconds after `at` (default 1.9). */
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
    cp.id = 'b14clip' + (++CID); Object.entries({ x, y, width: w, height: h }).forEach(([k, v]) => r.setAttribute(k, v)); cp.appendChild(r);
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

    /* ---------- B14 parts ---------- */
  const st = d => has(d && d.idea) ? d.idea : null;
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

  /* 01 ── POSTER: the nail pops, the cord draws, the top rod drops onto it; the poster unrolls down from the rod (the bottom rod rides its
     edge and bounces), the printed border draws; the idea lands on the keyword */
  variant('poster', 'โปสเตอร์แขวนผนัง', (d, c) => { const X = st(d), T = TL(), H = T.H, T0 = T.T0, x0 = -240, x1 = 240, y0 = -244, y1 = 226, uE = H - tu(.18);
    art(c, p => { const nl = popAt(p, 0, -318, tu(.05)); nl.circle(0, -318, 9, F(2.6)); nl.circle(0, -318, 3, SOLID(1));
      drawAt(p.path(`M ${x0 + 24} ${y0 - 8} L 0 -312 L ${x1 - 24} ${y0 - 8}`, W(2.2)), p, tu(.12), tu(.25));
      const roll = { sy: [[0, .02], [T0, .02], [uE, 1.03, 'out'], [uE + tu(.12), 1, 'soft']] }, ty = y0 - 3;
      const sh = mvG(p, Object.assign({ px: 0, py: ty }, roll)); R(sh, x0, y0, x1 - x0, y1 - y0, 4, F(3.4));
      drawAt(R(p, x0 + 24, y0 + 30, x1 - x0 - 48, y1 - y0 - 58, 6, S(1.6)), p, uE, tu(.3));
      const rod = (g, y, h) => { R(g, x0 - 22, y, x1 - x0 + 44, h, h / 2, F(3)); [x0 - 22, x1 + 22].forEach(x => g.circle(x, y + h / 2, h / 2 + 4, F(2.6))); };
      rod(inG(p, 'drop', 0, y0, tu(.18)), y0 - 14, 22);
      const dy = y1 - 6 - (y0 + 8); rod(mvG(p, { o: fadeIn(tu(.24)), y: [[0, -dy], [T0, -dy], [uE, 10, 'out'], [uE + tu(.12), 0, 'soft']] }), y1 - 6, 24);
      const big = X && !picOf(X);
      hero(p, c, X, 0, big ? -14 : -54, 170, 110, { maxW: 400, size: 46, bigSize: 66, bigW: 400 });
      drawAt(p.line(-40, big ? 70 : 150, 40, big ? 70 : 150, S(2.4)), p, H + tu(.2), tu(.2));
    }); });

  /* 02 ── HOLDING UP A SIGN: the person walks in; the sign comes up from below on its stick (the stick slides up through the hand), overshoots and
     settles; the person dips with the effort; the idea lands on the board */
  variant('placard', 'คนชูป้าย', (d, c) => { const X = st(d), T = TL(), H = T.H, T0 = T.T0, px = -120, k = .76, arm = { s: [4, -76], e: [50, -112], h: [88, -152] }, up = 230;
    art(c, p => { floorD(p);
      const hd = pAt(px, 290, k, 88, -152), sx = f1(hd[0] + 2), bx0 = sx - 250, bx1 = sx + 250, by0 = -338, by1 = -74;
      const sg = mvG(clipG(p, -500, -350, 1000, 700), { y: [[0, up], [T0, up], [H - tu(.2), -12, 'out'], [H - tu(.06), 0, 'soft']], o: fadeIn(T0 - tu(.1)) });
      R(sg, sx - 9, by1, 18, hd[1] - by1 + 70, 6, F(2.6)); [hd[1] + 30, hd[1] + 46].forEach(y => sg.line(sx - 9, y, sx + 9, y - 6, S(1.6)));
      const pg = mvG(p, { x: slideX(tu(.04)), o: fadeIn(tu(.04)) }), pd = mvG(pg, { px, py: 290, sy: [[0, 1], [T0, 1], [T0 + tu(.12), .95, 'in'], [T0 + tu(.4), 1.02, 'out'], [T0 + tu(.55), 1, 'soft']] });
      person(pd, px, 290, k, arm, { far: { s: [-4, -74], e: [40, -96], h: [80, -124] } });
      R(sg, sx - 26, by1 - 4, 52, 30, 6, F(2.6)); screw(sg, sx, by1 + 12, 4);
      R(sg, bx0, by0, bx1 - bx0, by1 - by0, 16, F(3.4)); R(sg, bx0 + 18, by0 + 18, bx1 - bx0 - 36, by1 - by0 - 36, 8, S(1.6));
      const big = X && !picOf(X);
      hero(p, c, X, sx, big ? -206 : -250, 120, -124, { maxW: 420, size: 42, bigSize: 60, bigW: 420, bigDy: 18 });
    }); });

  /* 03 ── THE PEDESTAL: the plinths and the shaft rise one after another, the capital drops on, the little plate pops; the idea floats down
     onto the air above it and its halo blooms */
  variant('pedestal', 'เสาแท่นโชว์', (d, c) => { const X = st(d), T = TL(), H = T.H, T0 = T.T0;
    art(c, p => { floorD(p);
      R(inG(p, 'rise', 0, 270, tu(.04)), -170, 252, 340, 38, 6, F(3)); R(inG(p, 'rise', 0, 238, tu(.12)), -146, 222, 292, 32, 6, F(3));
      const sh = mvG(p, { px: 0, py: 224, sy: [[0, 0], [tu(.2), 0], [T0 + tu(.2), 1.03, 'out'], [T0 + tu(.3), 1, 'soft']], o: fadeIn(tu(.2), .04) }); R(sh, -104, -28, 208, 252, 4, F(3.4));
      [-64, -32, 0, 32, 64].forEach((x, i) => drawAt(p.line(x, -6, x, 204, S(1.6)), p, T0 + tu(.3 + .04 * i), tu(.2)));
      const cp = mvG(p, { y: [[0, -120], [T0 + tu(.3), -120], [T0 + tu(.52), 0, 'in'], [T0 + tu(.6), -8, 'out'], [T0 + tu(.7), 0, 'soft']], o: fadeIn(T0 + tu(.3)) });
      R(cp, -136, -60, 272, 34, 8, F(3)); R(cp, -118, -78, 236, 20, 6, F(2.6));
      const pl = popAt(p, 0, 138, T0 + tu(.5)); R(pl, -52, 118, 104, 40, 6, F(2.4)); pl.line(-30, 138, 30, 138, S(1.4));
      hero(p, c, X, 0, -240, 140, -116, { maxW: 420, size: 40, bigSize: 56, bigW: 440, bigDy: 34, halo: 96, mv: { y: [[0, -70], [H - tu(.06), -70], [H + tu(.3), 4, 'out'], [H + tu(.42), 0, 'soft']] } });
    }); });

  /* 04 ── THE FLIP CHART: the legs draw, the pad drops onto the tripod; two used pages flip back over the top bar one after the other,
     the marker rolls on the ledge; the idea lands on the fresh page */
  variant('flipchart', 'กระดานฟลิปชาร์ต', (d, c) => { const X = st(d), T = TL(), H = T.H, T0 = T.T0, by = -276;
    art(c, p => { floorD(p);
      [[-150, -230, -230, 290], [150, -230, 230, 290], [0, -250, 40, 290]].forEach(([a, b, e, f], i) => drawAt(p.line(a, b, e, f, i === 2 ? S(3) : W(5)), p, tu(.04 + .05 * i), tu(.3)));
      const back = litG(p, T0 + tu(.2)); back.path('M -190 -282 Q -110 -340 0 -332 Q 110 -340 190 -282', F(2.6)); back.path('M -170 -282 Q -90 -324 0 -318 Q 90 -324 170 -282', S(1.4));
      const pad = inG(p, 'drop', 0, -60, tu(.18)); R(pad, -200, -270, 400, 420, 6, F(3.4));
      [0, 1].forEach(k => { const t0 = T0 + tu(k * .32), pg = mvG(pad, { px: 0, py: by, sy: [[0, 1], [t0, 1], [t0 + tu(.3), -.12, 'io']], o: [[0, 1], [t0 + tu(.3), 1], [t0 + tu(.31), 0]] });
        R(pg, -196, -266, 392, 412, 4, F(2.6)); lines(pg, -150, -180, 300, 4, 60, S(1.8), [3]); });
      R(pad, -218, -292, 436, 32, 8, F(3)); [-150, 150].forEach(x => screw(pad, x, -276, 5));
      R(pad, -214, 150, 428, 22, 6, F(2.8));
      const mk = mvG(pad, { x: [[0, -140], [T0 + tu(.5), -140], [T0 + tu(.8), 6, 'out'], [T0 + tu(.9), 0, 'soft']] }); R(mk, 60, 128, 110, 22, 10, F(2.4)); R(mk, 150, 132, 26, 14, 4, F(2));
      hero(p, c, X, 0, -116, 150, 34, { maxW: 340, size: 44, bigSize: 58, bigW: 340 });
    }); });

  /* 05 ── THE BANNER: the poles rise, the guy ropes draw down to their pegs; the banner unfurls from the left pole to the right one, its corner
     rings pop and the ties draw; the idea lands on the cloth */
  variant('banner', 'ป้ายผ้าขึงเสา', (d, c) => { const X = st(d), T = TL(), H = T.H, T0 = T.T0, bx0 = -350, bx1 = 350, by0 = -206, by1 = 40, uE = H - tu(.16);
    art(c, p => { floorD(p);
      [-1, 1].forEach((sd, i) => { const x = sd * 420, g = inG(p, 'rise', x, 0, tu(.04 + .08 * i)); R(g, x - 10, -290, 20, 580, 8, F(2.6)); g.circle(x, -300, 14, F(2.4));
        drawAt(p.line(x, -280, x + sd * 70, 290, S(1.6)), p, tu(.4 + .08 * i), tu(.3)); shape(popAt(p, x + sd * 70, 280, tu(.6 + .08 * i)), [[x + sd * 62, 290], [x + sd * 78, 290], [x + sd * 70, 270]], F(1.8)); });
      const bn = mvG(p, { px: bx0, py: 0, sx: [[0, .02], [T0, .02], [uE, 1.02, 'out'], [uE + tu(.1), 1, 'soft']], o: fadeIn(T0, .02) });
      bn.path(`M ${bx0} ${by0} L ${bx1} ${by0} L ${bx1} ${by1} Q 0 ${by1 + 26} ${bx0} ${by1} Z`, F(3.4)); bn.path(`M ${bx0 + 22} ${by0 + 22} L ${bx1 - 22} ${by0 + 22} L ${bx1 - 22} ${by1 - 18} Q 0 ${by1 + 6} ${bx0 + 22} ${by1 - 18} Z`, S(1.4));
      [[bx0, by0], [bx1, by0], [bx0, by1], [bx1, by1]].forEach(([x, y]) => { const ix = x + (x < 0 ? 16 : -16), iy = y + (y < 0 ? 16 : -16), t = x < 0 ? T0 : uE;
        popAt(p, ix, iy, t).circle(ix, iy, 8, F(2)); drawAt(p.line(ix, iy, x < 0 ? -410 : 410, y < 0 ? y - 10 : y + 6, W(2)), p, t + tu(.02), tu(.12)); });
      heroH(p, c, X, -200, -84, 140, -110, -84, { cx: 0, cy: -84, size: 52, maxW: 420, bigSize: 64, bigW: 600 });
    }); });

  /* 06 ── THE HIGHLIGHTED LINE: the book drops in and opens from its spine, the lines of text draw; the highlighter comes in and sweeps along
     one line, the highlight growing behind it, then goes back to rest on the corner; the idea lands in the highlight */
  variant('highlight', 'หนังสือขีดเน้น', (d, c) => { const X = st(d), T = TL(), H = T.H, T0 = T.T0, big = X && !picOf(X), ly = big ? 9 : 63, hS = T0 + tu(.1), hE = H - tu(.12);
    art(c, p => { const bk = inG(p, 'drop', 0, 0, tu(.04));
      [-1, 1].forEach(sd => { const pg = mvG(bk, { px: 0, py: 0, sx: [[0, .05], [tu(.22), .05], [tu(.5), 1.02, 'out'], [tu(.6), 1, 'soft']] });
        pg.path(`M 0 -196 Q ${sd * 190} -238 ${sd * 396} -196 L ${sd * 396} 214 Q ${sd * 190} 176 0 214 Z`, F(3.4)); pg.path(`M ${sd * 10} 222 Q ${sd * 190} 190 ${sd * 404} 228`, S(1.6)); });
      bk.line(0, -196, 0, 214, W(2.4));
      for (let k = 0; k < 7; k++) drawAt(p.line(-360, -150 + k * 50, -40, -150 + k * 50, S(2)), p, tu(.5 + .03 * k), tu(.2));
      [-150, -110, 130].forEach((y, i) => drawAt(p.line(40, y, i === 2 ? 40 + 320 : 360, y, S(2)), p, tu(.6 + .03 * i), tu(.2))); drawAt(p.line(40, 170, 232, 170, S(2)), p, tu(.7), tu(.2));
      const hl = mvG(p, { px: 34, py: 0, sx: [[0, 0], [hS, 0], [hE, 1, 'io']], o: fadeIn(hS, .02) }); R(hl, 34, big ? -46 : 30, 336, big ? 110 : 66, 10, { fill: 'rgba(255,255,255,.16)', sw: 0, stroke: 'none' });
      const dyp = ly - 30 - 260, K = { x: [[0, 260], [tu(.5), 260], [hS - tu(.2), -146, 'out'], [hS, -146], [hE, 190, 'io'], [hE + tu(.36), 0, 'io']], y: [[0, dyp], [hS, dyp], [hE, dyp], [hE + tu(.36), 0, 'io']],
        r: [[0, 0], [hE, 0], [hE + tu(.36), 0]] };
      const hg0 = mvG(p, Object.assign({ o: fadeIn(tu(.5)) }, K)), hg = rot(hg0, -24, 300, 260); R(hg, 190, 236, 210, 46, 12, F(3)); R(hg, 380, 238, 52, 42, 10, F(2.6)); shape(hg, [[190, 244], [190, 274], [162, 266], [162, 252]], F(2.2));
      if (big) txt(popAt(p, 202, 6, H - tu(.06)), X.label, 202, 26, { size: 52, maxW: 320, weight: 800, color: C.ink, wrap: 'mid' });
      else if (X) { put(p, c, X, 202, -36, 100, null, { t: H - tu(.06) }); ripple(p, 202, -36, 60, H - tu(.02)); if (X.label) txt(atG(p, H + tu(.06)), X.label, 202, 76, { size: 40, maxW: 320, weight: 800, color: C.ink }); }
      else star4(popAt(p, 202, 10, H - tu(.06)), 202, 10, 40);
    }); });

  /* 07 ── THE SPEECH STANDEE: the base drops, the pole grows up out of it, the bubble pops out at the top of the pole (from its tail) with a
     little sway; the speaker's line draws; the idea lands in the bubble */
  variant('bubblestand', 'ป้ายฟองคำพูดตั้งพื้น', (d, c) => { const X = st(d), T = TL(), H = T.H, T0 = T.T0;
    art(c, p => { floorD(p); const bs = inG(p, 'drop', 0, 262, tu(.04)); ell(bs, 0, 270, 130, 22, F(3)); R(bs, -40, 238, 80, 30, 8, F(2.6));
      const pl = mvG(p, { px: 0, py: 242, sy: [[0, 0], [tu(.2), 0], [T0, 1, 'out']], o: fadeIn(tu(.2), .04) }); R(pl, -10, 40, 20, 202, 6, F(2.6));
      const bb = mvG(p, { px: -110, py: 100, s: [[0, .1], [T0, .1], [T0 + tu(.3), 1.06, 'out'], [T0 + tu(.44), 1, 'soft']], r: [[0, -8], [T0, -8], [T0 + tu(.3), 3, 'out'], [T0 + tu(.6), -1.5, 'io'], [T0 + tu(.85), 0, 'soft']], o: fadeIn(T0, .04) });
      bb.path('M -260 -300 L 260 -300 Q 300 -300 300 -260 L 300 0 Q 300 40 260 40 L -40 40 L -120 112 L -110 40 L -260 40 Q -300 40 -300 0 L -300 -260 Q -300 -300 -260 -300 Z', F(3.4));
      R(bb, -276, -276, 552, 292, 30, S(1.4)); drawAt(bb.line(-60, 0, 60, 0, S(2)), p, T0 + tu(.5), tu(.2)); bb.circle(-82, 0, 6, S(1.6));
      hero(p, c, X, 0, -164, 140, -40, { maxW: 480, size: 46, bigSize: 64, bigW: 500, bigDy: 10 });
    }); });

  /* 08 ── THE TAG: the nail pops; the tag drops in on its string and swings on the nail (past, back, settle at its tilt); on the keyword the
     little star in its corner flashes and the idea lands */
  variant('tag', 'ป้ายแท็กดาว', (d, c) => { const X = st(d), T = TL(), H = T.H, T0 = T.T0;
    art(c, p => { const nl = popAt(p, 0, -330, tu(.05)); nl.circle(0, -330, 9, F(2.6));
      const sw = mvG(p, { px: 0, py: -330, y: [[0, -260], [tu(.12), -260], [T0 - tu(.1), 10, 'in'], [T0, 0, 'out']], r: [[0, 0], [T0, 0], [T0 + tu(.2), 14, 'out'], [T0 + tu(.5), -7, 'io'], [T0 + tu(.8), 3, 'io'], [H - tu(.1), 0, 'soft']], o: fadeIn(tu(.12)) });
      sw.path('M 0 -322 C -40 -280 -36 -214 -8 -196 M 0 -322 C 40 -280 30 -212 8 -196', W(2.4));
      const g = rot(sw, -6, 0, -190);
      shape(g, [[-200, -120], [-112, -228], [112, -228], [200, -120], [200, 262], [-200, 262]], F(3.4)); shape(g, [[-178, -112], [-100, -206], [100, -206], [178, -112], [178, 240], [-178, 240]], S(1.4));
      ring(g, 0, -176, 26, 12, F(2.6)); g.circle(0, -176, 34, S(1.4));
      const stg = mvG(g, { px: 140, py: 196, s: bumpK(H - tu(.04), 1.5) }); star4(stg, 140, 196, 20, { fill: C.fill, sw: 2.4 }); sparkAt(g, 140, 196, 30, 44, H - tu(.04), 6, 0, []);
      hero(g, c, X, 0, -24, 150, 124, { maxW: 330, size: 44, bigSize: 56, bigW: 330 });
    }); });

  /* 09 ── THE LIGHTBOX: the frame pops onto the wall, the cord draws down; the plug slides into the socket — the face flickers and lights up;
     the idea lands on the lit face */
  variant('lightbox', 'กล่องไฟกรอบหนา', (d, c) => { const X = st(d), T = TL(), H = T.H, T0 = T.T0, tOn = T0 + tu(.2);
    art(c, p => { const fr = inG(p, 'pop', 0, -40, tu(.04)); R(fr, -330, -250, 660, 420, 26, F(3.6)); R(fr, -300, -220, 600, 360, 10, F(2.6));
      const lit = sub(fr); on(lit, p, 0, { o: [[0, 0], [tOn, 0], [tOn + tu(.04), .8], [tOn + tu(.08), .1], [tOn + tu(.14), 1], [tOn + tu(.18), .3], [tOn + tu(.26), 1]] }); R(lit, -284, -204, 568, 328, 6, { fill: 'rgba(255,255,255,.1)', sw: 1.4, stroke: C.soft });
      R(fr, -284, -204, 568, 328, 6, { fill: 'none', sw: 1.4, stroke: C.soft });
      [-300, 300].forEach(x => [-220, 140].forEach(y => screw(fr, x + (x < 0 ? -15 : 15), y + (y < 0 ? -15 : 15), 4)));
      drawAt(p.path('M 260 170 C 260 230 330 210 340 262', W(2.4)), p, tu(.3), tu(.3)); R(popAt(p, 342, 298, tu(.25)), 312, 280, 60, 30, 8, F(2.6));
      const pg = mvG(p, { y: [[0, -40], [tu(.5), -40], [T0, 0, 'in'], [T0 + tu(.05), -3, 'out'], [T0 + tu(.12), 0, 'soft']], o: fadeIn(tu(.5)) }); R(pg, 322, 260, 40, 26, 6, F(2.4)); [330, 354].forEach(x => pg.line(x, 286, x, 296, S(1.4)));
      sparkAt(p, 342, 284, 22, 34, T0 + tu(.02), 5, -90, []);
      hero(p, c, X, 0, -70, 160, 82, { maxW: 480, size: 46, bigSize: 64, bigW: 500 });
    }); });

  /* 10 ── THE ROUND SHOP SIGN: the wall plate and bracket arm draw out from the wall, the rings pop; the sign drops onto its rings and swings
     from them, settling; the idea lands on it */
  variant('roundsign', 'ป้ายกลมแขวนแขนเหล็ก', (d, c) => { const X = st(d), T = TL(), H = T.H, T0 = T.T0, cx = 60, cy = 40, Rr = 206;
    art(c, p => { R(p, -450, -330, 20, 380, 4, S(2)); const wp = inG(p, 'pop', -422, -240, tu(.04)); R(wp, -440, -300, 36, 120, 8, F(2.6)); [-264, -216].forEach(y => screw(wp, -422, y, 4));
      const arm = mvG(p, { px: -404, py: -263, sx: [[0, .02], [tu(.15), .02], [tu(.5), 1, 'out']], o: fadeIn(tu(.15), .04) }); R(arm, -404, -272, 530, 18, 8, F(2.8)); arm.circle(126, -263, 10, F(2.2));
      drawAt(p.path('M -404 -196 Q -300 -200 -200 -262', W(3)), p, tu(.45), tu(.25)); drawAt(p.circle(-300, -230, 22, S(1.8)), p, tu(.55), tu(.2));
      [-80, 80].forEach((dx, i) => popAt(p, cx + dx, -238, tu(.6 + .05 * i)).circle(cx + dx, -238, 12, F(2.2)));
      const sw = mvG(p, { px: cx, py: -238, y: [[0, -200], [T0 - tu(.2), -200], [T0, 6, 'in'], [T0 + tu(.08), 0, 'out']], r: [[0, 0], [T0 + tu(.04), 0], [T0 + tu(.24), 6, 'out'], [T0 + tu(.5), -3.5, 'io'], [T0 + tu(.76), 1.5, 'io'], [H - tu(.1), 0, 'soft']], o: fadeIn(T0 - tu(.2)) });
      [-80, 80].forEach(dx => sw.line(cx + dx, -226, cx + dx * .9, cy - Rr * .94, W(2.4)));
      ring(sw, cx, cy, Rr, Rr - 22, F(3.4)); sw.circle(cx, cy, Rr - 22, F(1)); sw.circle(cx, cy, Rr - 38, S(1.4));
      hero(sw, c, X, cx, cy - 34, 150, cy + 86, { maxW: 300, size: 42, bigSize: 56, bigW: 320 });
    }); });

  /* 11 ── SITTING ON THE IDEA: the block rises; the person drops onto its top and settles (a squash on landing, a little lean back);
     the block thumps and the idea lands on its face */
  variant('sitter', 'คนนั่งบนกล่องใจความ', (d, c) => { const X = st(d), T = TL(), H = T.H, T0 = T.T0, k = .88, hipY = -46, px = -96;
    art(c, p => { floorD(p);
      const bl = mvG(inG(p, 'rise', 0, 140, tu(.04)), { px: 0, py: 290, sy: bumpK(H - tu(.08), .97) });
      shape(bl, [[-200, -20], [190, -20], [236, -70], [-154, -70]], F(3.2)); shape(bl, [[190, -20], [236, -70], [236, 244], [190, 290]], F(3.2));
      R(bl, -200, -20, 390, 310, 6, F(3.4)); R(bl, -176, 4, 342, 262, 4, S(1.6));
      const sit = sd => ({ h: [sd * 6, 8], k: [sd < 0 ? 56 : 62, sd < 0 ? 2 : -6], f: [sd < 0 ? 120 : 130, sd < 0 ? 4 : -10] });
      const pd = mvG(clipG(p, -500, -350, 1000, 700), { px, py: hipY, y: [[0, -200], [T0 - tu(.26), -200], [T0, 0, 'in']], sy: [[0, 1], [T0, 1], [T0 + tu(.06), .9, 'out'], [T0 + tu(.24), 1, 'soft']], o: fadeIn(T0 - tu(.26)) });
      const pl = mvG(pd, { px, py: hipY, r: [[0, 0], [T0 + tu(.2), 0], [T0 + tu(.5), -4, 'io'], [T0 + tu(.8), 0, 'soft']] });
      person(pl, px, hipY + 158 * k, k, { s: [4, -76], e: [-22, -38], h: [-44, 2] }, { leg: sit, lean: -10, far: { s: [-4, -74], e: [-30, -34], h: [-52, 4] } });
      hero(p, c, X, 0, 104, 150, 230, { maxW: 320, size: 42, bigSize: 58, bigW: 320, bigDy: 30 });
    }); });

  /* 12 ── THE ONE-LINE SCROLLER: the legs rise and the panel pops on; its dots twinkle on in a sweep; the idea scrolls in from the right edge
     and stops in place on the keyword */
  variant('scroller', 'ป้ายไฟวิ่งบรรทัดเดียว', (d, c) => { const X = st(d), T = TL(), H = T.H, T0 = T.T0, y0 = -140, y1 = 60, sS = T0, sE = H - tu(.06), dx = 680;
    art(c, p => { floorD(p); [-300, 300].forEach((x, i) => { const g = inG(p, 'rise', x, 180, tu(.04 + .06 * i)); R(g, x - 10, y1, 20, 230, 4, F(2.6)); R(g, x - 50, 276, 100, 14, 6, F(2.4)); });
      const pn = inG(p, 'pop', 0, (y0 + y1) / 2, tu(.2)); R(pn, -440, y0, 880, y1 - y0, 22, F(3.6)); R(pn, -416, y0 + 22, 832, y1 - y0 - 44, 8, F(2));
      for (let x = -398; x < 400; x += 22) { const col = sub(pn); on(col, p, 0, { o: [[0, 0], [tu(.4) + (x + 400) / 800 * tu(.3), 0], [tu(.42) + (x + 400) / 800 * tu(.3), 1]] }); for (let y = y0 + 40; y < y1 - 30; y += 22) col.circle(x, y, 2.2, { fill: 'rgba(255,255,255,.14)', sw: 0, stroke: 'none' }); }
      const led = sub(pn); on(led, p, 0, { o: [[0, .3], [T0, .3], [T0 + tu(.02), 1]] }); led.circle(398, y1 - 12, 5, SOLID(1)); drawAt(p.path(`M 300 ${y1 + 20} Q 360 ${y1 + 80} 340 290`, S(1.8)), p, tu(.3), tu(.3));
      const sk = [[0, dx], [sS, dx], [sE, -6, 'out'], [sE + tu(.1), 0, 'soft']], cl = clipG(p, -416, y0 + 22, 832, y1 - y0 - 44), lg = mvG(cl, { x: sk, o: fadeIn(sS, .02) });
      if (X && picOf(X)) { put(p, c, X, -300, -40, 110, null, { t: sS, mv: { x: sk } }); if (X.label) txt(lg, X.label, -220, -40, { size: 58, maxW: 600, weight: 800, color: C.ink, anchor: 'start', wrap: 'mid' }); }
      else if (X) txt(lg, X.label, 0, -20, { size: 64, maxW: 760, weight: 800, color: C.ink, wrap: 'mid' });
      else star4(lg, 0, -40, 33);
      ripple(p, 0, -40, 90, sE + tu(.02));
    }); });

  /* 13 ── THE HEADLINE: the paper underneath slides in, the front page drops on and settles at its tilt; the masthead and the columns draw;
     the headline box draws and the idea lands in it */
  variant('headline', 'พาดหัวหน้ากระดาษ', (d, c) => { const X = st(d), T = TL(), H = T.H, T0 = T.T0;
    art(c, p => { const b0 = mvG(p, { x: slideX(tu(.04), 90), o: fadeIn(tu(.04)) }), b = rot(b0, 6, 60, 20); R(b, -220, -250, 520, 520, 4, F(3)); lines(b, -190, 180, 460, 2, 26, S(1.6));
      const g0 = mvG(p, { px: -20, py: 0, y: [[0, -90], [tu(.16), -90], [tu(.4), 0, 'in'], [tu(.48), -6, 'out'], [tu(.56), 0, 'soft']], r: [[0, 6], [tu(.16), 6], [tu(.48), -1], [tu(.6), 0, 'soft']], o: fadeIn(tu(.16)) }), g = rot(g0, -4, -20, 0);
      R(g, -300, -280, 540, 560, 4, F(3.4)); drawAt(g.line(-270, -226, 210, -226, W(3.2)), p, tu(.5), tu(.2)); g.line(-270, -214, 210, -214, S(1.4));
      [-240, -150, -60].forEach((x, i) => drawAt(g.line(x, -252, x + 60, -252, S(2.2)), p, tu(.55 + .04 * i), tu(.15)));
      drawAt(R(g, -270, -196, 480, 280, 6, S(1.6)), p, T0, tu(.4));
      [-270, -105, 60].forEach((x, i) => { for (let k = 0; k < 5; k++) drawAt(g.line(x, 108 + k * 30, x + (k === 4 ? 84 : 140), 108 + k * 30, S(1.6)), p, T0 + tu(.2 + .05 * (i * 5 + k) / 3), tu(.15)); });
      drawAt(g.line(-30, 100, -30, 260, S(1.2)), p, T0 + tu(.2), tu(.3));
      hero(g, c, X, -30, -98, 140, 40, { maxW: 440, size: 50, bigSize: 64, bigW: 440 });
    }); });

  /* 14 ── THE YARD SIGN: the grass line and blades draw; the sign comes down and is pushed into the ground on its stake (a thump: squash,
     a few dust ticks); the idea lands on it */
  variant('yardsign', 'ป้ายปักสนาม', (d, c) => { const X = st(d), T = TL(), H = T.H, T0 = T.T0;
    art(c, p => { drawAt(p.line(-480, 270, 480, 270, S(2)), p, 0, tu(.4)); for (let x = -440; x <= 440; x += 46) drawAt(p.path(`M ${x} 270 L ${x + 6} 250 M ${x + 10} 270 L ${x + 18} 244 M ${x + 20} 270 L ${x + 24} 256`, S(1.6)), p, tu(.1 + (x + 440) / 880 * .3), tu(.15));
      const cl = clipG(p, -500, -350, 1000, 620), sg = mvG(cl, { y: [[0, -420], [T0 - tu(.3), -420], [T0, 30, 'in'], [T0 + tu(.06), 22, 'out'], [T0 + tu(.24), 0, 'soft']], o: fadeIn(T0 - tu(.3)) });
      const sq = mvG(sg, { px: 0, py: 90, sy: [[0, 1], [T0, 1], [T0 + tu(.05), .94, 'out'], [T0 + tu(.2), 1, 'soft']] });
      [-150, 150].forEach(x => { sq.line(x, 80, x, 286, W(3)); sq.line(x - 14, 160, x + 14, 160, W(2.4)); });
      R(sq, -270, -250, 540, 340, 14, F(3.4)); R(sq, -246, -226, 492, 292, 8, S(1.6)); [-246, 246].forEach(x => sq.circle(x, 66, 5, S(1.4)));
      [-150, 150].forEach(x => sparkAt(p, x, 268, 18, 34, T0 + tu(.02), 5, -180, [3, 4], false));
      hero(p, c, X, 0, -110, 150, 30, { maxW: 440, size: 46, bigSize: 64, bigW: 460 });
    }); });

  /* 15 ── THE TICKET DISPENSER (user picked B of round 2): the dispenser pops onto the wall; its button is pressed (squash, a click), the display
     ticks, and the long ticket runs out of the slot, torn line and all, swinging a little as it stops; the idea lands on the ticket */
  variant('dispenser', 'เครื่องกดบัตรคิว', (d, c) => { const X = st(d), T = TL(), H = T.H, T0 = T.T0, rE = H - tu(.16);
    art(c, p => {
      const tk0 = mvG(clipG(p, -500, -75, 1000, 430), { y: [[0, -380], [T0 + tu(.1), -380], [rE, 8, 'out'], [rE + tu(.12), 0, 'soft']] }), tk1 = mvG(tk0, { px: 0, py: -75, r: [[0, 0], [rE, 0], [rE + tu(.14), 2.5, 'out'], [rE + tu(.4), -1, 'io'], [H + tu(.3), 0, 'soft']] });
      const g = rot(tk1, -3, 0, -75); R(g, -150, -80, 300, 370, 6, F(3.4)); for (let x = -140; x <= 140; x += 14) g.circle(x, -20, 2.4, SOLID(1)); g.line(-120, -52, 60, -52, S(1.6));
      const bx = inG(p, 'pop', 0, -180, tu(.04)); R(bx, -230, -320, 460, 280, 30, F(3.6)); R(bx, -200, -290, 400, 120, 12, S(1.6));
      [-150, -110, -70].forEach((x, i) => { const dg = sub(bx); on(dg, p, 0, { o: [[0, .3], [T0 + tu(.06 + .05 * i), .3], [T0 + tu(.08 + .05 * i), 1]] }); dg.line(x, -245, x + 30, -245, S(1.6)); });
      const bt = mvG(bx, { px: 150, py: -230, s: [[0, 1], [T0 - tu(.06), 1], [T0, .82, 'in'], [T0 + tu(.14), 1, 'out']] }); bt.circle(150, -230, 22, F(2.6)); bt.circle(150, -230, 12, S(1.4));
      sparkAt(p, 150, -230, 30, 42, T0 + tu(.01), 6, 0, []);
      R(bx, -170, -88, 340, 26, 10, { fill: C.fill, sw: 2.4 }); [-212, 212].forEach(x => [-302, -58].forEach(y => screw(bx, x, y, 4)));
      hero(g, c, X, 0, 90, 126, 210, { maxW: 260, size: 40, bigSize: 50, bigW: 260, bigDy: 50 });
    }); });

  /* 16 ── THE STAGE SIGN: the stage rises, the mic stand pops up; the sign is let down on its wires from above and stops with a small bob;
     the two lamps flicker on and light it; the idea lands on the sign */
  variant('stagesign', 'ป้ายแขวนกลางเวที', (d, c) => { const X = st(d), T = TL(), H = T.H, T0 = T.T0, tL = H - tu(.24);
    art(c, p => { const st0 = inG(p, 'rise', 0, 256, tu(.04)); ell(st0, 0, 236, 380, 50, F(3)); R(st0, -380, 236, 760, 40, 0, { fill: C.fill, sw: 0, stroke: 'none' }); ell(st0, 0, 276, 380, 50, F(3)); R(st0, -378, 234, 756, 44, 0, { fill: C.fill, sw: 0, stroke: 'none' }); ell(st0, 0, 236, 380, 50, F(3)); [-380, 380].forEach(x => st0.line(x, 236, x, 276, W(3)));
      const mc = mvG(p, { px: -180, py: 236, sy: [[0, 0], [tu(.2), 0], [tu(.5), 1.04, 'out'], [tu(.6), 1, 'soft']], o: fadeIn(tu(.2), .04) }); mc.line(-180, 236, -180, 40, W(3)); ell(mc, -180, 236, 40, 8, F(2.4)); mc.line(-180, 40, -160, 14, W(3)); R(mc, -170, -20, 24, 40, 10, F(2.4));
      [-1, 1].forEach(sd => { const lg0 = popAt(p, sd * 420, -300, tu(.3)), lg = rot(lg0, sd * -24, sd * 420, -300); R(lg, sd * 420 - 30, -324, 60, 50, 10, F(2.6));
        const bm = sub(p); on(bm, p, 0, { o: [[0, 0], [tL, 0], [tL + tu(.04), .7], [tL + tu(.08), .1], [tL + tu(.14), 1]] }); shape(bm, [[sd * 390, -280], [sd * 450, -300], [sd * 60, 236], [sd * -120, 236]], { fill: 'rgba(255,255,255,.05)', sw: 0, stroke: 'none' }); });
      const sg = mvG(clipG(p, -500, -350, 1000, 700), { y: [[0, -380], [T0, -380], [tL - tu(.1), 10, 'out'], [tL + tu(.06), -4, 'io'], [tL + tu(.2), 0, 'soft']] });
      [-1, 1].forEach(sd => sg.line(sd * 190, -760, sd * 190, -262, W(2)));
      R(sg, -280, -262, 560, 196, 14, F(3.4)); R(sg, -260, -242, 520, 156, 8, S(1.4));
      heroH(p, c, X, -170, -164, 120, -90, -164, { cx: 0, cy: -164, size: 46, maxW: 330, bigSize: 56, bigW: 500 });
    }); });

  /* 17 ── THE INFO TOTEM: the base and the body rise; the screen boots (a flicker, a scan line runs down) and the grille dots come up;
     the idea lands on the screen */
  variant('totem', 'ตู้ป้ายดิจิทัลตั้งพื้น', (d, c) => { const X = st(d), T = TL(), H = T.H, T0 = T.T0, tB = T0 + tu(.1);
    art(c, p => { floorD(p); R(inG(p, 'rise', 0, 278, tu(.04)), -170, 266, 340, 24, 8, F(2.8));
      const bd = inG(p, 'rise', 0, 0, tu(.12)); R(bd, -150, -310, 300, 578, 34, F(3.6)); R(bd, -122, -276, 244, 380, 12, F(1.8));
      const sc = sub(bd); on(sc, p, 0, { o: [[0, 0], [tB, 0], [tB + tu(.04), .9], [tB + tu(.08), .1], [tB + tu(.16), 1]] }); R(sc, -122, -276, 244, 380, 12, { fill: 'rgba(255,255,255,.08)', sw: 1.8, stroke: C.soft });
      const sl = mvG(clipG(p, -122, -276, 244, 380), { y: [[0, 0], [tB + tu(.16), 0], [tB + tu(.66), 380, 'lin']], o: [[0, 0], [tB + tu(.16), 0], [tB + tu(.17), 1], [tB + tu(.64), 1], [tB + tu(.66), 0]] }); sl.line(-122, -276, 122, -276, W(2));
      for (let r = 0; r < 3; r++) { const row = atG(bd, tu(.5 + .05 * r)); for (let q2 = 0; q2 < 7; q2++) row.circle(-54 + q2 * 18, 150 + r * 18, 3, S(1.2)); } R(bd, -40, 220, 80, 14, 6, S(1.4));
      hero(p, c, X, 0, -150, 140, 10, { maxW: 220, size: 38, bigSize: 48, bigW: 220 });
    }); });

  /* 18 ── THE BILLBOARD: the legs rise, the bracing and the ladder draw, the board drops onto the walkway; the lamps come up on their arms and
     flick on one by one; the idea lands on the board */
  variant('billboard', 'บิลบอร์ด', (d, c) => { const X = st(d), T = TL(), H = T.H, T0 = T.T0, y0 = -270, y1 = 50;
    art(c, p => { floorD(p); [-250, 250].forEach((x, i) => R(inG(p, 'rise', x, 170, tu(.04 + .06 * i)), x - 14, y1, 28, 240, 4, F(2.6)));
      drawAt(p.line(-236, 110, 236, 250, S(2)), p, tu(.3), tu(.25)); drawAt(p.line(236, 110, -236, 250, S(2)), p, tu(.36), tu(.25));
      const wk = inG(p, 'pop', 0, y1, tu(.34)); R(wk, -400, y1 + 18, 800, 12, 4, F(2.2)); for (let x = -390; x <= 390; x += 60) wk.line(x, y1 + 18, x, y1 - 8, S(1.4)); wk.line(-400, y1 - 8, 400, y1 - 8, S(1.6));
      [300, 330].forEach(x => drawAt(p.line(x, y1 + 30, x, 290, W(2.2)), p, tu(.4), tu(.25))); for (let y = y1 + 60, i = 0; y < 290; y += 34, i++) drawAt(p.line(300, y, 330, y, W(2)), p, tu(.5 + .03 * i), tu(.08));
      const bd = inG(p, 'drop', 0, (y0 + y1) / 2, tu(.42)); R(bd, -420, y0, 840, y1 - y0, 10, F(3.6)); R(bd, -396, y0 + 22, 792, y1 - y0 - 44, 4, S(1.6));
      [-260, 0, 260].forEach((x, i) => { const t = T0 + tu(.12 * i), lm = mvG(p, { px: x, py: y0, sy: [[0, 0], [T0 - tu(.3), 0], [T0 - tu(.1), 1, 'out']], o: fadeIn(T0 - tu(.3), .04) });
        lm.line(x, y0, x, y0 - 36, W(2.4)); lm.line(x, y0 - 36, x + 20, y0 - 54, W(2.4)); R(lm, x + 6, y0 - 68, 46, 24, 8, F(2.4));
        const on2 = sub(lm); on(on2, p, 0, { o: [[0, 0], [t, 0], [t + tu(.03), 1], [t + tu(.06), .2], [t + tu(.1), 1]] }); R(on2, x + 10, y0 - 46, 38, 4, 2, { fill: C.ink, sw: 0, stroke: 'none' }); });
      heroH(p, c, X, -230, (y0 + y1) / 2, 160, -120, (y0 + y1) / 2, { cx: 0, cy: (y0 + y1) / 2, size: 56, maxW: 480, bigSize: 66, bigW: 720 });
    }); });

  /* 19 ── THE PAINTED SHEET: the sheet goes up on the wall and the tape strips press on corner by corner; the tray slides in, the roller rises
     from it and paints the sheet in a few strokes (spots fly), then goes back to rest in the tray; the idea is there on the keyword */
  variant('painted', 'แผ่นกระดาษทาสีติดผนัง', (d, c) => { const X = st(d), T = TL(), H = T.H, T0 = T.T0, pS = T0 - tu(.1), pE = H - tu(.14);
    art(c, p => { floorD(p); R(inG(p, 'pop', -40, -55, tu(.04)), -320, -280, 560, 450, 4, F(3.4));
      [[-320, -280, 30], [240, -280, -30], [-320, 170, -30], [240, 170, 30]].forEach(([x, y, a], i) => { const g = rot(popAt(p, x, y, tu(.24 + .06 * i)), a, x, y); R(g, x - 40, y - 12, 80, 24, 3, { fill: 'rgba(255,255,255,.16)', sw: 1.4 }); });
      [-120, 40].forEach((x, i) => popAt(p, x, 112 + i * 16, pS + (pE - pS) * (.4 + .4 * i)).circle(x, 112 + i * 16, 4 + i, { fill: 'rgba(255,255,255,.3)', sw: 0, stroke: 'none' }));
      const tr = mvG(p, { x: slideX(tu(.3), 160), o: fadeIn(tu(.3)) }); shape(tr, [[250, 290], [450, 290], [430, 236], [270, 236]], F(3)); tr.line(280, 254, 420, 254, S(1.4));
      const KX = [[0, 160], [tu(.3), 160], [tu(.48), 0, 'out'], [pS - tu(.2), 0], [pS, -520, 'io']], KY = [[0, 0], [pS - tu(.2), 0], [pS, -330, 'io']], n = 4;
      for (let i = 0; i < n; i++) { const t1 = pS + (pE - pS) * (i + .5) / n, t2 = pS + (pE - pS) * (i + 1) / n; KX.push([t1, -520 + 90 * i + 45], [t2, -520 + 90 * (i + 1)]); KY.push([t1, -10], [t2, -330]); }
      KX.push([pE + tu(.4), 0, 'io']); KY.push([pE + tu(.4), 0, 'io']);
      const rl = mvG(p, { x: KX, y: KY, o: fadeIn(tu(.3)) }); R(rot(rl, -10, 350, 230), 290, 206, 130, 46, 20, F(3)); rl.path('M 416 214 L 456 214 L 470 150', W(3)); R(rl, 456, 60, 30, 96, 12, F(2.6)); [80, 100, 120].forEach(y => rl.line(460, y, 482, y, S(1.4)));
      hero(p, c, X, -40, -100, 160, 60, { maxW: 460, size: 52, bigSize: 66, bigW: 480, t: pE - tu(.02) });
    }); });

  /* 20 ── THE AIRSHIP: the clouds drift; the airship glides in from the left, slows and stops with a nose-down bob, its gondola windows light;
     the idea lands on its side panel; it keeps a gentle float */
  variant('airship', 'เรือเหาะติดป้าย', (d, c) => { const X = st(d), T = TL(), H = T.H, T0 = T.T0, cx = -20, cy = -60, aE = H - tu(.18);
    art(c, p => { const cl = clipG(p, -500, -350, 1000, 700);
      [[-360, 200, 1, 40], [340, -250, .8, -30]].forEach(([x, y, k2, dx]) => { const g = mvG(cl, { x: [[0, dx], [tu(4), -dx, 'lin']], o: fadeIn(0, .3) }); g.path(`M ${x - 80 * k2} ${y} Q ${x - 80 * k2} ${y - 40 * k2} ${x - 30 * k2} ${y - 40 * k2} Q ${x - 10 * k2} ${y - 80 * k2} ${x + 40 * k2} ${y - 60 * k2} Q ${x + 90 * k2} ${y - 60 * k2} ${x + 90 * k2} ${y} Z`, S(1.8)); });
      const am = mvG(cl, { px: cx, py: cy, x: [[0, -900], [tu(.1), -900], [aE, 14, 'out'], [aE + tu(.2), 0, 'soft']], r: [[0, 0], [aE - tu(.1), 0], [aE + tu(.06), 2.5, 'out'], [aE + tu(.3), -1, 'io'], [aE + tu(.5), 0, 'soft']] });
      [[1, -1], [1, 1]].forEach(([a, b]) => shape(am, [[cx + 290, cy + b * 40], [cx + 400, cy + b * 130], [cx + 420, cy + b * 130], [cx + 380, cy + b * 20]], F(3)));
      ell(am, cx, cy, 380, 150, F(3.6)); am.path(`M ${cx - 300} ${cy - 92} Q ${cx} ${cy - 160} ${cx + 300} ${cy - 92}`, S(1.4)); am.path(`M ${cx - 300} ${cy + 92} Q ${cx} ${cy + 160} ${cx + 300} ${cy + 92}`, S(1.4));
      R(am, cx - 90, cy + 150, 180, 52, 18, F(3)); [cx - 60, cx, cx + 60].forEach((x, i) => { R(am, x - 16, cy + 162, 32, 22, 4, S(1.4)); const w2 = sub(am); on(w2, p, 0, { o: [[0, 0], [aE + tu(.04 * i), 0], [aE + tu(.04 * i + .03), 1]] }); R(w2, x - 16, cy + 162, 32, 22, 4, { fill: 'rgba(255,255,255,.2)', sw: 0, stroke: 'none' }); });
      [cx - 60, cx + 60].forEach(x => am.line(x, cy + 140, x, cy + 152, W(2)));
      R(am, cx - 250, cy - 92, 470, 184, 16, F(3)); R(am, cx - 234, cy - 76, 438, 152, 10, S(1.2));
      heroH(p, c, X, cx - 150, cy, 116, cx - 76, cy, { cx: cx - 15, cy, size: 46, maxW: 270, bigSize: 52, bigW: 420 });
    }); });

  /* ---------- sample data (A: key lines from unrelated topics · B: stress) ---------- */
  const I = (icon, label) => label ? { icon, label } : { icon };
  const SAMPLES = [
    { say: 'ทำน้อย แต่ได้มาก', idea: I('sparkles', 'น้อยแต่มาก') },
    { say: 'สุขภาพต้องมาก่อนเสมอ', idea: I('heart-pulse', 'สุขภาพมาก่อน') },
    { say: 'ความรู้คือสิ่งที่ไม่มีใครเอาไปได้', idea: I('book-open', 'ความรู้ติดตัว') },
    { say: 'เวลาคือของมีค่าที่สุด', idea: I('clock', 'เวลามีค่า') },
    { say: 'เริ่มเลย ไม่ต้องรอพร้อม', idea: { label: 'ไม่ต้องรอพร้อม' } },
    { say: 'ทุกคนเริ่มจากศูนย์', idea: I('sprout', 'เริ่มจากศูนย์') },
    { say: 'ฟังให้มากกว่าพูด', idea: I('message-circle', 'ฟังให้มาก') },
    { say: 'เงินเก็บคือความอิสระ', idea: I('piggy-bank', 'เงินเก็บ = อิสระ') },
    { say: 'ทำทุกวัน ดีกว่าทำเยอะวันเดียว', idea: I('repeat', 'ทำทุกวัน') },
    { say: 'บ้านคือที่ที่ใจอยู่', idea: I('house', 'บ้านคือใจ') },
    { say: 'ความสม่ำเสมอชนะพรสวรรค์', idea: I('target', 'สม่ำเสมอ') },
    { say: 'ล้มได้ แต่ต้องลุก', idea: I('trending-up', 'ล้มแล้วลุก') },
    { say: 'ลูกค้าคือหัวใจของร้าน', idea: I('store', 'ลูกค้าคือหัวใจ') },
    { say: 'น้ำคือชีวิต', idea: I('droplets', 'น้ำคือชีวิต') },
    { say: 'ใจเย็น ๆ ทุกอย่างมีทางออก', idea: I('smile', 'ใจเย็น') },
    { say: 'คุณภาพสำคัญกว่าปริมาณ', idea: I('gem', 'คุณภาพก่อน') },
    { say: 'ทีมที่ดีชนะทุกอย่าง', idea: I('users', 'ทีมคือทุกอย่าง') },
    { say: 'เรียบง่ายคือที่สุด', idea: I('leaf', 'เรียบง่าย') },
    { say: 'ความคิดเปลี่ยนชีวิต', idea: I('brain', 'ความคิดเปลี่ยนชีวิต') },
    { say: 'ฝันให้ไกล ไปให้ถึง', idea: I('rocket', 'ฝันให้ไกล') },
  ];
  const STRESS = [
    { say: 'ไอคอนอย่างเดียว', idea: I('target') },
    { say: 'ป้ายยาว', idea: I('book-open', 'ความรู้คือสิ่งเดียวที่ไม่มีใครขโมยไปได้') },
    { say: 'ภาษาอังกฤษ', idea: I('sparkles', 'Less is more') },
    { say: 'ไม่มีไอคอน (ป้ายแทนภาพ)', idea: { label: 'ทำทีละอย่าง' } },
    { say: 'ชื่อไอคอนที่ไม่มี', idea: I('no-such-icon', 'ใจความ') },
    { say: 'ไม่มีอะไรเลย', idea: {} },
    { say: 'ตัวเลขในป้าย', idea: I('clock', '1% ทุกวัน') },
    { say: 'อังกฤษยาว', idea: I('rocket', 'Done is better than perfect') },
    { say: 'ไอคอนอย่างเดียว 2', idea: I('heart') },
    { say: 'ป้ายแทนภาพยาว', idea: { label: 'ไม่มีอะไรสายเกินไปสำหรับการเริ่มต้น' } },
    { say: 'ป้ายสั้นมาก', idea: I('sun', 'สู้') },
    { say: 'ไม่มีป้าย 2', idea: I('leaf') },
    { say: 'ป้ายแทนภาพเป็นตัวเลข', idea: { label: '80/20' } },
    { say: 'ป้ายสั้น', idea: I('smile', 'ยิ้มไว้') },
    { say: 'อังกฤษยาว 2', idea: I('users', 'Together we go further') },
    { say: 'ชื่อไอคอนที่ไม่มี 2', idea: I('no-such', 'ไม่มีไอคอนจริง') },
    { say: 'ป้ายปกติ', idea: I('gem', 'ค่าของคน') },
    { say: 'ป้ายแทนภาพอังกฤษ', idea: { label: 'Keep going' } },
    { say: 'ป้ายยาวมาก', idea: I('brain', 'คิดให้ดีก่อนพูดเสมอแล้วจะไม่ต้องเสียใจทีหลัง') },
    { say: 'ไม่มีอะไรเลย 2', idea: null },
  ];

  G.cats = G.cats || {};
  G.cats.B14 = { variants: V, SAMPLES, STRESS, draw: (i, d, c) => { setZ(c); CUR = V[i].id; V[i].build(d || {}, c); }, CLAMPS, timing: c => (setZ(c), Object.assign({}, Z)) };
})();
