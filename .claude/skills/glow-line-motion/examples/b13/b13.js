/* b13.js — category B13 "เคล็ดลับ / ความลับ": 20 neutral designs (stills first — the user picks, then motion).
   CutPack (references/cutpack-CATEGORIES.md v2, cat_ai.py): secret THING = the tip itself (a thing, an action or an idea).
   The categories guide v2 sets no picture / rhythm on purpose (user: "ตั้งใจให้มันไม่มีครับเพื่อที่จะให้คุณออกแบบได้อย่างอิสระ").
   Round 1 = the user's 20 ideas (references/cutpack-visual-ideas.md, "เอามาทั้ง 20 เลย"), each with its own mechanism; the two that needed
   body parts (whisper into an ear, finger on the lips) are redesigned (user: "อย่าเพิ่งวาดอวัยวะคน") → 19 scratch card · 20 three cups.
   Still = the moment after the keyword: whatever hid the secret is open and the secret is lit (halo). No icon → its label in big type;
   no icon and no label → a lit four-point star in its place.
   GL.cats.B13.draw(i, data, { x, y, s, at, hit, speed }) — canvas 1000 × 700 centred at (0,0); hit = seconds after `at` (default 1.9). */
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
    cp.id = 'b13clip' + (++CID); Object.entries({ x, y, width: w, height: h }).forEach(([k, v]) => r.setAttribute(k, v)); cp.appendChild(r);
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

  /* ---------- B13 parts ---------- */
  const st = d => has(d && d.secret) ? d.secret : null;
  const star4 = (q, x, y, r, o) => q.path(`M ${x} ${y - r} Q ${f1(x + r * .16)} ${f1(y - r * .16)} ${x + r} ${y} Q ${f1(x + r * .16)} ${f1(y + r * .16)} ${x} ${y + r} Q ${f1(x - r * .16)} ${f1(y + r * .16)} ${x - r} ${y} Q ${f1(x - r * .16)} ${f1(y - r * .16)} ${x} ${y - r} Z`, o || { fill: C.ink, sw: 1.2 });
  const ell = (q, x, y, rx, ry, o) => q.path(`M ${x - rx} ${y} A ${rx} ${ry} 0 1 0 ${x + rx} ${y} A ${rx} ${ry} 0 1 0 ${x - rx} ${y} Z`, o);
  /* the secret at (x, y), width w: halo (o.halo = its radius, false = none) + the picture (no picture → the label in big type;
     nothing at all → a lit star) + its label at (lx, ly). o.r = tilt with its holder · o.spark = little stars around it */
  function secret(q, c, X, x, y, w, ly, o = {}) {
    if (o.halo !== false) halo(q, x, y, o.halo || w * .78);
    if (o.spark) o.spark.forEach(([a, b, r]) => star4(q, x + a, y + b, r));
    if (!X) { star4(q, x, y, w * .34); return; }
    put(q, c, X, x, y, w, ly, Object.assign({ maxW: 240, size: 32 }, o, { t: tu(.3) }));
  }
  /* a plain key lying flat (bow at x, y; shaft along angle a) */
  function key(q, x, y, a = 0, k = 1) { const g = rot(q, a, x, y), L = 120 * k, bw = 30 * k;
    ring(g, x, y, bw, bw * .45); R(g, x + bw - 4, y - 7 * k, L, 14 * k, 4 * k, F(2.6));
    shape(g, [[x + bw + L - 40 * k, y + 7 * k], [x + bw + L - 4, y + 7 * k], [x + bw + L - 4, y + 26 * k], [x + bw + L - 16 * k, y + 26 * k], [x + bw + L - 16 * k, y + 18 * k], [x + bw + L - 28 * k, y + 18 * k], [x + bw + L - 28 * k, y + 26 * k], [x + bw + L - 40 * k, y + 26 * k]], F(2.4)); return g; }
  const keyhole = (q, x, y, k = 1) => { q.circle(x, y, 10 * k, SOLID(1)); shape(q, [[x - 5 * k, y + 4 * k], [x + 5 * k, y + 4 * k], [x + 8 * k, y + 26 * k], [x - 8 * k, y + 26 * k]], SOLID(1)); };
  const screw = (q, x, y, r = 5) => { q.circle(x, y, r, S(1.4)); q.line(x - r * .6, y - r * .6, x + r * .6, y + r * .6, S(1.2)); };
  const lines = (q, x, y, w, n, gap, o = S(2), short = []) => { for (let k = 0; k < n; k++) q.line(x, y + k * gap, x + (short.includes(k) ? w * .6 : w), y + k * gap, o); };

  const V = [];
  const variant = (id, th, build) => V.push({ id, th, build });

  /* 01 ── KEY + CLOSED BOX: the key in the lock has turned, the hasp has dropped and the lid stands open; the secret rises out of the box */
  variant('keybox', 'กุญแจไขกล่อง', (d, c) => { const X = st(d);
    art(c, p => { floor(p, 290);
      shape(p, [[-270, 30], [150, 30], [180, -60], [-300, -60]], F(3.2)); shape(p, [[-252, 22], [134, 22], [158, -48], [-278, -48]], S(1.6));
      R(p, -270, 30, 420, 260, 16, F(3.4)); p.line(-270, 64, 150, 64, S(2)); R(p, -246, 88, 372, 180, 10, S(1.6));
      [-246, 126].forEach(x => [[x + 10, 98], [x + 10, 258]].forEach(([a, b]) => screw(p, a, b, 4)));
      R(p, -104, 92, 88, 116, 14, F(3)); keyhole(p, -60, 132); R(p, -98, 30, 76, 40, 10, F(2.6)); p.circle(-60, 50, 7, S(1.6));
      key(p, 236, 268, -8, .9);
      secret(p, c, X, -60, -170, 140, null, { spark: [[-118, -40, 12], [112, -70, 9], [96, 40, 7]] });
      if (X && X.label && picOf(X)) txt(p, X.label, 60, -160, { anchor: 'start', maxW: 300, color: C.ink, weight: 700, size: 34, wrap: 'down' });
    }); });

  /* 02 ── A PERSON HOLDING A KEY: they have just unlocked the little door of a cupboard; the door swings open and the secret glows inside */
  variant('keyholder', 'คนถือกุญแจไขตู้', (d, c) => { const X = st(d), px = -380, k = .85, arm = { s: [4, -76], e: [56, -70], h: [108, -60] };
    art(c, p => { floor(p, 290);
      person(p, px, 290, k, arm); const hd = pAt(px, 290, k, 108, -60); key(p, hd[0] - 6, hd[1], 0, .7);
      R(p, -140, -230, 420, 520, 18, F(3.4)); R(p, -158, -250, 456, 34, 10, F(3)); [-110, 250].forEach(x => R(p, x - 14, 290 - 6, 28, 6, 2, F(2)));
      R(p, -100, -150, 240, 260, 12, { fill: 'rgba(255,255,255,.05)', sw: 3 }); R(p, -82, -132, 204, 224, 8, S(1.4));
      halo(p, 20, -24, 104);
      shape(p, [[-100, -150], [-100, 110], [-176, 140], [-176, -176]], F(3.2)); shape(p, [[-110, -132], [-110, 94], [-166, 116], [-166, -154]], S(1.4)); p.circle(-160, -18, 6, S(1.8));
      [-130, 74].forEach(y => R(p, -106, y, 12, 26, 3, F(2)));
      R(p, -100, 150, 240, 110, 10, S(1.6)); R(p, 0, 196, 40, 10, 4, S(1.6)); R(p, 180, -150, 70, 410, 10, S(1.4));
      secret(p, c, X, 20, -30, 140, 160, { halo: false, maxW: 220 });
    }); });

  /* 03 ── THE LOCK SEAL: a round seal with a keyhole has split in two and the halves have parted; the secret is lit in the gap */
  variant('lockseal', 'ตรากุญแจแยกออก', (d, c) => { const X = st(d), cy = -30, Ro = 205, Ri = 166, gap = 150;
    art(c, p => { [-1, 1].forEach(sd => { const cx = sd * gap, g = sub(p);
        g.path(`M ${cx} ${cy - Ro} A ${Ro} ${Ro} 0 0 ${sd > 0 ? 1 : 0} ${cx} ${cy + Ro} Z`, F(3.4));
        g.path(`M ${cx + sd * 14} ${cy - Ri} A ${Ri} ${Ri} 0 0 ${sd > 0 ? 1 : 0} ${cx + sd * 14} ${cy + Ri}`, S(1.8));
        for (let k = -2; k <= 2; k++) { const y = cy + k * 64; if (k % 2) R(g, cx - (sd > 0 ? 18 : 0), y - 14, 18, 28, 4, F(2.4)); }
        g.path(`M ${cx} ${cy - 46} A 24 24 0 0 ${sd > 0 ? 1 : 0} ${cx} ${cy - 2} L ${cx + sd * 10} ${cy + 46} L ${cx} ${cy + 46} Z`, SOLID(1));
        for (let a = -60; a <= 60; a += 30) { const u = rad(a), x0 = cx + sd * Math.cos(u) * (Ri - 30), y0 = cy + Math.sin(u) * (Ri - 30); g.circle(f1(x0 + sd * 40), f1(y0), 5, S(1.4)); } });
      sparkAt(p, 0, cy, 92, 112, 0, 8, 22, [], true);
      secret(p, c, X, 0, cy, 130, cy + 140, { halo: 82, maxW: 260 });
    }); });

  /* 04 ── THE SECRET DRAWER: a plain box hides a thin drawer in its base; the drawer has slid out and the secret sits in it */
  variant('drawer', 'กล่องมีลิ้นชักลับ', (d, c) => { const X = st(d);
    art(c, p => { floor(p, 290);
      R(p, -400, -20, 430, 290, 14, F(3.4)); shape(p, [[-416, -20], [46, -20], [30, -96], [-400, -96]], F(3.2)); p.line(-406, -60, 38, -60, S(1.6));
      [-300, -70].forEach(x => R(p, x - 14, -96, 28, 292, 4, S(1.6))); p.line(-400, 196, 30, 196, S(2));
      [[-400, -20, 1], [30, -20, -1]].forEach(([x, y, sd]) => shape(p, [[x, y], [x + sd * 54, y], [x, y + 54]], S(1.8))); R(p, -142, 30, 34, 50, 8, F(2.4)); keyhole(p, -125, 46, .6);
      [-380, 10].forEach(x => R(p, x - 16, 270, 32, 20, 4, F(2.4)));
      R(p, -400, 206, 430, 56, 6, { fill: C.fill, sw: 2 });
      R(p, -20, 206, 380, 56, 8, F(3.2)); R(p, -2, 216, 344, 30, 4, S(1.4)); R(p, 360, 216, 22, 36, 8, F(2.6));
      shape(p, [[-20, 206], [342, 206], [324, 170], [-2, 170]], { fill: 'rgba(255,255,255,.05)', sw: 2 });
      secret(p, c, X, 170, 110, 130, null, { halo: 96 });
      if (X && X.label && picOf(X)) txt(p, X.label, 170, -40, { maxW: 280, color: C.ink, weight: 700, size: 34, wrap: 'up' });
    }); });

  /* 05 ── THE STAR BOX: a box with a star on its lid; the lid has slid along its grooves and the secret comes up out of the opening */
  variant('starbox', 'กล่องดาวฝาเลื่อน', (d, c) => { const X = st(d), lx = 250;
    art(c, p => { floor(p, 290);
      shape(p, [[170, -10], [240, -80], [240, 210], [170, 290]], F(3.2)); R(p, -170, -10, 340, 300, 8, F(3.4)); R(p, -146, 14, 292, 252, 6, S(1.6));
      shape(p, [[-170, -10], [170, -10], [240, -80], [-100, -80]], F(3)); shape(p, [[-140, -22], [150, -22], [206, -68], [-84, -68]], { fill: C.fill, sw: 2.2 });
      secret(p, c, X, 30, -220, 140, null, { halo: 108 });
      const lid = sub(p); shape(lid, [[-170 + lx, -14], [170 + lx, -14], [240 + lx, -84], [-100 + lx, -84]], F(3.2)); shape(lid, [[-158 + lx, -18], [162 + lx, -18], [226 + lx, -80], [-94 + lx, -80]], S(1.2));
      star4(lid, 40 + lx, -49, 26, { fill: C.ink, sw: 1.4 }); halo(lid, 40 + lx, -49, 40);
      if (X && X.label && picOf(X)) txt(p, X.label, -260, -205, { maxW: 250, color: C.ink, weight: 700, size: 34, wrap: 'down' });
    }); });

  /* 06 ── THE "?" CUBE: a cube on a turntable has turned — the "?" face has gone round to the side and the face with the secret looks at us */
  variant('qcube', 'กล่องคำถามหมุนตัว', (d, c) => { const X = st(d), x0 = -150, x1 = 110, y0 = -190, y1 = 70, dx = 90, dy = -70;
    art(c, p => { floor(p, 290);
      ell(p, -10, 210, 230, 40, F(3)); R(p, -230, 210, 440, 30, 0, { fill: C.fill, sw: 0, stroke: 'none' }); ell(p, -10, 240, 230, 40, F(3)); R(p, -228, 208, 436, 34, 0, { fill: C.fill, sw: 0, stroke: 'none' });
      ell(p, -10, 210, 230, 40, F(3)); p.line(-240, 210, -240, 240, W(3)); p.line(220, 210, 220, 240, W(3)); R(p, -40, 112, 60, 86, 8, F(2.6));
      shape(p, [[x1, y0], [x1 + dx, y0 + dy], [x1 + dx, y1 + dy], [x1, y1]], F(3.2)); shape(p, [[x0, y0], [x1, y0], [x1 + dx, y0 + dy], [x0 + dx, y0 + dy]], F(3.2));
      { const g = sub(p, { transform: `matrix(1 ${f1(dy / dx)} 0 1 ${x1 + dx / 2} ${f1((y0 + y1) / 2 + dy / 2 + 50)})` }); g.text('?', 0, 0, { size: 150, weight: 800, anchor: 'middle', color: C.soft, dur: .01 }); }
      R(p, x0, y0, x1 - x0, y1 - y0, 10, F(3.4)); R(p, x0 + 16, y0 + 16, x1 - x0 - 32, y1 - y0 - 32, 6, { fill: 'rgba(255,255,255,.05)', sw: 1.6, stroke: C.soft });
      secret(p, c, X, (x0 + x1) / 2, (y0 + y1) / 2, 140, null, { halo: false });
      haloH(p, (x0 + x1) / 2, (y0 + y1) / 2, 180, 0);
      if (X && X.label && picOf(X)) txt(p, X.label, 360, -40, { maxW: 240, color: C.ink, weight: 700, size: 34, wrap: 'down' });
    }); });

  /* 07 ── THE SEALED ENVELOPE: the wax seal has cracked in two, the flap is up and the card with the secret slides out to the side */
  variant('sealed', 'ซองผนึกครั่ง', (d, c) => { const X = st(d), ex = -110;
    art(c, p => { const cg = rot(p, 14, 170, -90); R(cg, 30, -210, 290, 230, 16, F(3.4)); R(cg, 48, -192, 254, 194, 10, S(1.4));
      secret(cg, c, X, 190, -110, 118, null, { halo: 80, r: 14 });
      shape(p, [[ex - 260, -60], [ex + 260, -60], [ex, -250]], F(3.2)); shape(p, [[ex - 222, -72], [ex + 222, -72], [ex, -232]], S(1.4));
      R(p, ex - 260, -60, 520, 330, 12, F(3.4)); p.path(`M ${ex - 260} 270 L ${ex} 90 L ${ex + 260} 270`, S(2)); p.path(`M ${ex - 260} -60 L ${ex} 110 L ${ex + 260} -60`, S(1.6));
      const seal = (sx, sy, a, sd) => { const g = rot(p, a, sx, sy); g.path(`M ${sx} ${sy - 34} L ${sx + sd * 8} ${sy - 18} L ${sx - sd * 4} ${sy - 4} L ${sx + sd * 8} ${sy + 12} L ${sx} ${sy + 34} A 34 34 0 0 ${sd > 0 ? 0 : 1} ${sx} ${sy - 34} Z`, F(3)); g.circle(sx - sd * 16, sy, 9, S(1.4)); };
      seal(ex - 28, -228, -18, 1); seal(ex + 34, -214, 22, -1);
      if (X && X.label && picOf(X)) txt(p, X.label, ex, 190, { maxW: 300, color: C.ink, weight: 700, size: 34, wrap: 'up' });
    }); });

  /* 08 ── THE SECRET FILE: a document wallet tied with string and buttons lies open (string loose); the document is out, with the secret on it */
  variant('dossier', 'แฟ้มซองผูกเชือก', (d, c) => { const X = st(d);
    art(c, p => { const fg = rot(p, -8, -260, 40); R(fg, -420, -170, 300, 400, 12, F(3.4)); shape(fg, [[-420, -170], [-120, -170], [-150, -230], [-390, -230]], F(3));
      fg.circle(-270, -120, 18, F(2.6)); fg.circle(-270, -120, 6, S(1.2)); fg.circle(-270, 10, 18, F(2.6)); fg.circle(-270, 10, 6, S(1.2));
      fg.path('M -270 -120 C -230 -90 -320 -60 -280 -30 C -250 -10 -300 20 -270 10 C -230 40 -200 90 -240 140 C -260 170 -210 190 -220 220', W(2.2));
      R(fg, -400, 160, 120, 46, 6, S(1.6));
      const dg = rot(p, 4, 160, 30); R(dg, -10, -280, 340, 450, 10, F(3.4)); lines(dg, 20, -240, 160, 2, 24, S(2.2)); dg.line(20, 120, 300, 120, S(1.6)); lines(dg, 20, 140, 280, 1, 20, S(1.6));
      ring(dg, 270, -230, 34, 26, { fill: 'none', sw: 2, stroke: C.soft }); star4(dg, 270, -230, 12, { fill: C.soft, sw: 1 });
      secret(dg, c, X, 160, -40, 140, 90, { halo: 104, r: 4, maxW: 280 });
    }); });

  /* 09 ── THE DOG-EARED PAGE: a corner of the top page is turned back, and the secret is on the page underneath */
  variant('dogear', 'มุมกระดาษพับ', (d, c) => { const X = st(d);
    art(c, p => { R(p, -364, -272, 724, 556, 10, F(3)); halo(p, 272, 190, 80);
      shape(p, [[-380, -290], [360, -290], [360, 0], [80, 280], [-380, 280]], F(3.4));
      for (let k = 0; k < 9; k++) { const y = -236 + k * 54, xe = Math.min(320, 330 - y); p.line(-330, y, k % 3 === 2 ? Math.min(xe, 0) : xe, y, S(2.2)); }
      shape(p, [[80, 280], [360, 0], [80, 0]], F(3)); p.line(112, 40, 112, 200, S(1.2)); p.line(112, 40, 290, 40, S(1.2));
      secret(p, c, X, 274, 186, 110, null, { halo: false });
      if (X && X.label && picOf(X)) txt(p, X.label, 262, 266, { maxW: 200, color: C.ink, weight: 700, size: 30 });
    }); });

  /* 10 ── THE TRI-FOLD: a sheet folded in three has opened out; its middle panel — the inside — carries the secret */
  variant('trifold', 'กระดาษพับสามทบคลี่', (d, c) => { const X = st(d), w = 150;
    art(c, p => { [-1, 1].forEach(sd => { shape(p, [[sd * w, -230], [sd * w, 230], [sd * (w + 190), 190], [sd * (w + 190), -190]], F(3.2));
        for (let k = 0; k < 6; k++) { const u = k / 5, y0 = -150 + u * 280; p.line(sd * (w + 30), f1(y0 * .97 - 2), sd * (w + 160), f1(y0 * .86 - 2), S(1.8)); } });
      R(p, -w, -230, 2 * w, 460, 6, F(3.4)); R(p, -w + 18, -212, 2 * w - 36, 424, 4, { fill: 'rgba(255,255,255,.05)', sw: 1.4, stroke: C.soft });
      [-w, w].forEach(x => p.line(x, -230, x, 230, W(3.4)));
      secret(p, c, X, 0, -40, 140, 130, { halo: 102, maxW: 250 });
    }); });

  /* 11 ── THE TURNING SIGN: a sign on a post turns on its pivots from its blank side to the side with the secret */
  variant('turnsign', 'ป้ายหมุนบนเสา', (d, c) => { const X = st(d);
    art(c, p => { floor(p, 290); shape(p, [[-90, 290], [90, 290], [60, 250], [-60, 250]], F(3)); R(p, -10, -280, 20, 535, 6, F(2.6));
      R(p, -250, -230, 500, 330, 18, F(3.4)); R(p, -228, -208, 456, 286, 12, S(1.6));
      [-246, 112].forEach(y => { R(p, -22, y, 44, 24, 8, F(2.6)); p.circle(0, y + 12, 5, S(1.2)); });
      [[-232, -212], [232, -212], [-232, 84], [232, 84]].forEach(([a, b]) => screw(p, a, b, 4));
      [[268, -150, 300, -170], [268, -60, 312, -60], [268, 30, 300, 50]].forEach(([a, b, e, f]) => p.line(a, b, e, f, S(2)));
      secret(p, c, X, 0, -90, 140, 50, { halo: 96, maxW: 380 });
    }); });

  /* 12 ── THE SLIDING COVER: a plaque on two rails; its cover has slid along to the end and the secret is uncovered */
  variant('slidecover', 'ป้ายฝาเลื่อน', (d, c) => { const X = st(d);
    art(c, p => { [-176, 156].forEach(y => { R(p, -390, y, 860, 20, 8, F(2.6)); [-372, 452].forEach(x => screw(p, x, y + 10, 5)); });
      R(p, -370, -156, 500, 312, 14, F(3.4)); R(p, -350, -136, 460, 272, 8, { fill: 'rgba(255,255,255,.05)', sw: 1.6, stroke: C.soft });
      secret(p, c, X, -120, -24, 140, 100, { halo: 100, maxW: 380 });
      R(p, 150, -160, 300, 320, 12, F(3.4)); R(p, 172, -138, 256, 276, 8, S(1.4)); [0, 1, 2].forEach(k => p.line(176 + k * 14, -60, 176 + k * 14, 60, S(2.2)));
      [-160, 140].forEach(y => R(p, 166, y, 268, 20, 4, F(2)));
    }); });

  /* 13 ── ONE TOKEN AMONG MANY: a tray of plain tokens; one has lifted out and turned over — the secret is on its face, with sparkles above it */
  variant('tokens', 'เหรียญพิเศษในถาด', (d, c) => { const X = st(d), xs = [-330, -165, 0, 165, 330];
    art(c, p => { R(p, -430, 196, 860, 78, 34, F(3.4)); p.line(-400, 218, 400, 218, S(1.6));
      xs.forEach((x, i) => { if (i === 2) { ell(p, x, 186, 62, 16, { fill: C.fill, sw: 2, stroke: C.soft }); return; }
        R(p, x - 62, 150, 124, 40, 20, F(3)); ell(p, x, 150, 62, 18, F(3)); ell(p, x, 150, 40, 10, S(1.4)); });
      p.circle(0, -60, 118, F(3.6)); p.circle(0, -60, 100, S(1.6));
      secret(p, c, X, 0, -60, 130, null, { halo: 150, spark: [[-170, -110, 16], [160, -140, 12], [176, 30, 9], [-150, 70, 8]] });
      if (X && X.label && picOf(X)) txt(p, X.label, 0, -232, { maxW: 340, color: C.ink, weight: 700, size: 34 });
    }); });

  /* 14 ── THE LITTLE STAR FRAME: a standing desk frame with a small star at its corner; the star is lit and the secret fills the frame */
  variant('starframe', 'กรอบตั้งโต๊ะติดดาว', (d, c) => { const X = st(d);
    art(c, p => { floor(p, 290); shape(p, [[170, -40], [300, 290], [268, 290], [150, -10]], F(2.6));
      R(p, -220, -250, 440, 520, 18, F(3.6)); R(p, -186, -216, 372, 452, 8, F(2.4)); R(p, -170, -200, 340, 420, 4, { fill: 'rgba(255,255,255,.05)', sw: 1.2, stroke: C.soft });
      halo(p, 220, -250, 44); star4(p, 220, -250, 26, { fill: C.ink, sw: 1.4 }); [[262, -294, 4], [266, -222, 3], [184, -296, 3]].forEach(([a, b, r]) => p.dot ? p.dot(a, b, r) : p.circle(a, b, r, SOLID(1)));
      secret(p, c, X, 0, -40, 150, 140, { halo: 110, maxW: 300 });
    }); });

  /* 15 ── THE MAGNIFIER: a page of fine print; the magnifier rests over one spot and the secret shows big inside the lens */
  variant('finesprint', 'แว่นขยายส่องตัวเล็ก', (d, c) => { const X = st(d), cx = 30, cy = -40, Rl = 168, ang = 45;
    art(c, p => { R(p, -400, -290, 640, 580, 10, F(3.2));
      for (let k = 0; k < 18; k++) { const y = -260 + k * 30; let x = -370; while (x < 200) { const w = 18 + (Math.abs(k * 7 + Math.round(x / 10)) % 5) * 12; if (Math.hypot(Math.min(Math.max(cx, x), x + w) - cx, y - cy) > Rl + 10) p.line(x, y, Math.min(x + w, 210), y, S(1.6)); x += w + 12; } }
      const u = rad(ang), hx = cx + Math.cos(u) * Rl, hy = cy + Math.sin(u) * Rl;
      const hg = rot(p, ang, hx, hy); R(hg, hx + 4, hy - 20, 44, 40, 8, F(2.6)); R(hg, hx + 46, hy - 26, 200, 52, 26, F(3.2)); [0, 1, 2, 3].forEach(k => hg.line(hx + 92 + k * 26, hy - 14, hx + 92 + k * 26, hy + 14, S(1.6)));
      p.circle(cx, cy, Rl - 8, { fill: C.fill, sw: 0, stroke: 'none' }); ring(p, cx, cy, Rl + 8, Rl - 10, F(3.2)); p.circle(cx, cy, Rl - 22, S(1.2));
      halo(p, cx, cy - 20, 96);
      secret(p, c, X, cx, cy - 26, 140, cy + 96, { halo: false, maxW: 250 });
    }); });

  /* 16 ── THE CURTAIN: a window with its curtain drawn half back and tied; the secret shows in the uncovered part */
  variant('curtain', 'ม่านหน้าต่างรูดเปิด', (d, c) => { const X = st(d);
    art(c, p => { R(p, -270, -240, 540, 470, 10, F(3.4)); R(p, -248, -218, 496, 426, 4, { fill: 'rgba(255,255,255,.04)', sw: 1.6, stroke: C.soft });
      R(p, -320, 230, 640, 30, 8, F(3)); R(p, -340, -290, 680, 16, 8, F(2.6)); [-340, 340].forEach(x => p.circle(x, -282, 14, F(2.6)));
      secret(p, c, X, -40, -30, 150, 140, { halo: 110, maxW: 280 });
      p.path('M 90 -274 L 290 -274 L 292 200 Q 250 214 216 200 Q 180 214 146 200 Q 112 214 90 200 Z', F(3.2)); [140, 190, 240].forEach(x => p.path(`M ${x} -260 Q ${x - 8} -40 ${x + 4} 190`, S(1.6)));
      p.path('M -300 -274 L -200 -274 Q -190 -150 -232 -40 Q -200 60 -230 200 L -300 200 Z', F(3.2)); [-270, -244].forEach(x => p.path(`M ${x} -260 Q ${x + 10} -150 ${x} -50 Q ${x + 6} 60 ${x - 2} 190`, S(1.6)));
      R(p, -310, -58, 98, 32, 12, F(2.6));
      for (let k = 0; k < 9; k++) p.circle(-290 + k * 48, -274, 8, F(2)); for (let k = 0; k < 5; k++) p.circle(100 + k * 46, -274, 8, F(2));
    }); });

  /* 17 ── POINTING AT A SMALL SPOT: a person points at a board of small dots; one dot is ringed and the call-out shows the secret big */
  variant('pointer', 'คนชี้จุดเล็ก', (d, c) => { const X = st(d), px = -410, k = .85, tx = -40, ty = 30, ox = 250, oy = -90, Rc = 128;
    art(c, p => { floor(p, 290); person(p, px, 290, k, { s: [4, -76], e: [52, -104], h: [100, -128] });
      R(p, -250, -270, 680, 420, 14, F(3.4)); [-210, 390].forEach(x => R(p, x - 8, 150, 16, 140, 4, F(2.4)));
      for (let r = 0; r < 5; r++) for (let q2 = 0; q2 < 7; q2++) { const x = -200 + q2 * 92, y = -220 + r * 82; if (Math.hypot(x - ox, y - oy) < Rc + 30 || (x === tx && y === ty)) continue; p.circle(x, y, 7, S(1.8)); }
      p.circle(tx, ty, 9, SOLID(1)); p.circle(tx, ty, 30, W(2.8));
      const a = Math.atan2(oy - ty, ox - tx); p.line(f1(tx + Math.cos(a) * 30), f1(ty + Math.sin(a) * 30), f1(ox - Math.cos(a) * Rc), f1(oy - Math.sin(a) * Rc), W(2.4));
      p.circle(ox, oy, Rc, F(3.4)); halo(p, ox, oy, Rc + 22);
      secret(p, c, X, ox, oy - 14, 130, null, { halo: false });
      if (X && X.label && picOf(X)) txt(p, X.label, ox, oy + 72, { maxW: 200, color: C.ink, weight: 700, size: 28 });
    }); });

  /* 18 ── A BULB ABOVE THE HEAD: a person stands still; a bulb lights above their head and the secret is inside the glass */
  variant('bulbhead', 'หลอดไฟเหนือศีรษะ', (d, c) => { const X = st(d), px = -120, k = .8, bx = -112, by = -190, Rb = 105;
    art(c, p => { floor(p, 290); person(p, px, 290, k, { s: [4, -76], e: [12, -30], h: [18, 12] });
      halo(p, bx, by - 20, Rb + 34);
      p.path(`M ${bx - 54} ${by + 112} Q ${bx - Rb - 10} ${by + 40} ${bx - Rb} ${by - 20} A ${Rb} ${Rb} 0 1 1 ${bx + Rb} ${by - 20} Q ${bx + Rb + 10} ${by + 40} ${bx + 54} ${by + 112} Z`, F(3.4));
      R(p, bx - 52, by + 112, 104, 22, 6, F(2.6)); R(p, bx - 46, by + 134, 92, 20, 6, F(2.6)); R(p, bx - 30, by + 154, 60, 14, 6, F(2.4));
      burst(p, bx, by - 20, Rb + 18, Rb + 40, 9, -90 - 60, [3, 4, 5]);
      secret(p, c, X, bx, by - 18, 140, null, { halo: false });
      if (X && X.label && picOf(X)) txt(p, X.label, 250, -170, { maxW: 280, color: C.ink, weight: 700, size: 34, wrap: 'down' });
    }); });

  /* 19 ── THE SCRATCH CARD (replaces "a whisper in the ear"): the coating has been scratched off and the secret is underneath; the scraper rests on the card */
  variant('scratch', 'บัตรขูด', (d, c) => { const X = st(d), x0 = -210, y0 = -150, w = 360, h = 230;
    art(c, p => { R(p, -320, -250, 600, 420, 22, F(3.4)); lines(p, -284, -212, 150, 2, 22, S(2.2)); p.circle(240, -206, 18, S(1.6));
      R(p, x0, y0, w, h, 12, { fill: 'rgba(255,255,255,.05)', sw: 2, stroke: C.soft });
      [[[x0, y0], [x0 + 90, y0], [x0 + 60, y0 + 26], [x0 + 14, y0 + 40], [x0, y0 + 70]], [[x0 + w, y0 + h], [x0 + w - 120, y0 + h], [x0 + w - 70, y0 + h - 30], [x0 + w - 20, y0 + h - 44], [x0 + w, y0 + h - 90]], [[x0 + w - 70, y0], [x0 + w, y0], [x0 + w, y0 + 30], [x0 + w - 36, y0 + 18]], [[x0, y0 + h - 40], [x0 + 30, y0 + h - 20], [x0 + 60, y0 + h], [x0, y0 + h]]]
        .forEach(pts => shape(p, pts, { fill: 'rgba(255,255,255,.22)', sw: 1.6 }));
      secret(p, c, X, x0 + w / 2, y0 + h / 2 - 6, 130, null, { halo: 84 });
      if (X && X.label && picOf(X)) txt(p, X.label, -20, 140, { maxW: 360, color: C.ink, weight: 700, size: 32 });
      [[-170, 200, 4], [-130, 214, 3], [-60, 206, 5], [10, 222, 3], [90, 204, 4], [150, 218, 3]].forEach(([a, b, r]) => p.circle(a, b, r, { fill: 'rgba(255,255,255,.4)', sw: 1 }));
      const sg = rot(p, -28, 330, 160); R(sg, 250, 130, 200, 60, 16, F(3.2)); R(sg, 250, 130, 46, 60, 12, F(2.6)); [0, 1, 2].forEach(k2 => sg.line(320 + k2 * 30, 146, 320 + k2 * 30, 174, S(1.6)));
    }); });

  /* 20 ── THREE CUPS (replaces "a finger on the lips"): three upturned cups on a table; one is lifted and tipped, and the secret was under it */
  variant('cups', 'ถ้วยคว่ำสามใบ', (d, c) => { const X = st(d), ty = 250, xs = [-300, 0, 300], up = 1;
    const cup = (q, x, y) => { shape(q, [[x - 105, y], [x + 105, y], [x + 68, y - 190], [x - 68, y - 190]], F(3.4)); R(q, x - 112, y - 22, 224, 22, 8, F(2.8)); ell(q, x, y - 190, 68, 12, F(2.6)); q.line(x - 88, y - 100, x + 88, y - 100, S(1.4)); };
    art(c, p => { R(p, -460, ty, 920, 26, 8, F(3)); [-420, 420].forEach(x => R(p, x - 10, ty + 26, 20, 60, 4, F(2.4)));
      xs.forEach((x, i) => { if (i !== up) cup(p, x, ty); });
      ell(p, xs[up], ty - 4, 104, 14, { fill: 'rgba(255,255,255,.05)', sw: 1.4, stroke: C.soft });
      secret(p, c, X, xs[up], ty - 80, 130, null, { halo: 96 });
      cup(rot(p, 16, xs[up], -80), xs[up] + 40, -60);
      if (X && X.label && picOf(X)) txt(p, X.label, xs[up], 320, { maxW: 360, color: C.ink, weight: 700, size: 32 });
    }); });

  /* ---------- sample data (A: tips from unrelated topics · B: stress) ---------- */
  const I = (icon, label) => label ? { icon, label } : { icon };
  const SAMPLES = [
    { say: 'เคล็ดลับคือใส่เกลือนิดเดียว', secret: I('cooking-pot', 'เกลือนิดเดียว') },
    { say: 'จุดที่คนมองข้ามคือการหายใจ', secret: I('heart-pulse', 'การหายใจ') },
    { say: 'ความลับคือขันน็อตตัวนี้ก่อน', secret: I('wrench', 'ขันน็อตก่อน') },
    { say: 'ทริกคือถ่ายตอนแดดอ่อน', secret: I('camera', 'แดดอ่อน') },
    { say: 'วิธีลัดคือกด Ctrl+Z', secret: I('keyboard', 'Ctrl+Z') },
    { say: 'เคล็ดลับนอนหลับคือปิดจอก่อนนอน', secret: I('moon', 'ปิดจอ') },
    { say: 'ความลับของคนเก็บเงินได้คือจ่ายตัวเองก่อน', secret: I('piggy-bank', 'จ่ายตัวเองก่อน') },
    { say: 'สิ่งที่ไม่มีใครบอกคือดื่มน้ำก่อนกินข้าว', secret: I('glass-water', 'ดื่มน้ำก่อน') },
    { say: 'เทคนิคจำศัพท์คือพูดออกเสียง', secret: I('mic', 'พูดออกเสียง') },
    { say: 'ความลับของร้านนี้คือซอสสูตรพิเศษ', secret: I('soup', 'ซอสพิเศษ') },
    { say: 'ทริกคุยงานคือฟังให้จบก่อน', secret: I('message-circle', 'ฟังให้จบ') },
    { say: 'เคล็ดลับต้นไม้งามคือรดน้ำตอนเช้า', secret: I('sprout', 'รดตอนเช้า') },
    { say: 'จุดที่คนพลาดคืออ่านสัญญาไม่ละเอียด', secret: I('file-text', 'อ่านสัญญา') },
    { say: 'ความลับของนักวิ่งคือวอร์มอัพ', secret: I('timer', 'วอร์มอัพ') },
    { say: 'ทริกเย็บผ้าคือรีดก่อนตัด', secret: I('scissors', 'รีดก่อนตัด') },
    { say: 'เคล็ดลับหน้าใสคือนอนให้พอ', secret: I('bed', 'นอนให้พอ') },
    { say: 'ความลับของคลิปปังคือสามวินาทีแรก', secret: I('clapperboard', '3 วิแรก') },
    { say: 'วิธีลัดคือถามคนที่ทำเป็น', secret: I('users', 'ถามคนเป็น') },
    { say: 'เคล็ดลับเพลงติดหูคือท่อนซ้ำ', secret: I('music', 'ท่อนซ้ำ') },
    { say: 'ความลับของกาแฟอร่อยคือน้ำต้องไม่เดือด', secret: I('coffee', 'น้ำไม่เดือด') },
  ];
  const STRESS = [
    { say: 'ไม่มีป้าย', secret: I('sparkles') },
    { say: 'ป้ายยาว', secret: I('book-open', 'อ่านหนังสือวันละสิบนาทีทุกวัน') },
    { say: 'ภาษาอังกฤษ', secret: I('lightbulb', 'Batch your tasks') },
    { say: 'ไม่มีไอคอน (ป้ายแทนภาพ)', secret: { label: 'ทำทีละอย่าง' } },
    { say: 'ชื่อไอคอนที่ไม่มี', secret: I('no-such-icon', 'เคล็ดลับ') },
    { say: 'ไม่มีอะไรเลย', secret: {} },
    { say: 'ตัวเลขในป้าย', secret: I('clock', '5 นาที') },
    { say: 'อังกฤษยาว', secret: I('code', 'Keyboard shortcuts first') },
    { say: 'ไอคอนอย่างเดียว', secret: I('gem') },
    { say: 'ป้ายแทนภาพยาว', secret: { label: 'ถามก่อนตัดสินใจเสมอ' } },
    { say: 'ป้ายสั้นมาก', secret: I('target', 'จุด') },
    { say: 'ไม่มีป้าย 2', secret: I('eye') },
    { say: 'ป้ายแทนภาพเป็นตัวเลข', secret: { label: '80/20' } },
    { say: 'ป้ายสั้น', secret: I('heart', 'ใจเย็น') },
    { say: 'อังกฤษยาว 2', secret: I('wallet', 'Pay yourself first') },
    { say: 'ชื่อไอคอนที่ไม่มี 2', secret: I('no-such', 'ไม่มีไอคอนจริง') },
    { say: 'ป้ายปกติ', secret: I('sun', 'ตื่นเช้า') },
    { say: 'ป้ายแทนภาพอังกฤษ', secret: { label: 'Less is more' } },
    { say: 'ป้ายยาวมาก', secret: I('search', 'ดูให้ละเอียดทุกจุดก่อนเริ่มงาน') },
    { say: 'ไม่มีอะไรเลย 2', secret: null },
  ];

  G.cats = G.cats || {};
  G.cats.B13 = { variants: V, SAMPLES, STRESS, draw: (i, d, c) => { setZ(c); CUR = V[i].id; V[i].build(d || {}, c); }, CLAMPS, timing: c => (setZ(c), Object.assign({}, Z)) };
})();
