/* b13.js — category B13 "เคล็ดลับ / ความลับ": 20 neutral designs (stills first — the user picks, then motion).
   CutPack (references/cutpack-CATEGORIES.md v2, cat_ai.py): secret THING = the tip itself (a thing, an action or an idea).
   The categories guide v2 sets no picture / rhythm on purpose (user: "ตั้งใจให้มันไม่มีครับเพื่อที่จะให้คุณออกแบบได้อย่างอิสระ").
   Round 1 = the user's 20 ideas (references/cutpack-visual-ideas.md, "เอามาทั้ง 20 เลย"), each with its own mechanism; the two that needed
   body parts (whisper into an ear, finger on the lips) are redesigned (user: "อย่าเพิ่งวาดอวัยวะคน") → 19 scratch card · 20 three cups.
   Motion: every part comes in on its own → the hiding thing works → on the keyword (c.hit) the secret pops in, lit → hold.
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

  /* ---------- motion (user 2026-11-13 "ผ่านครับ ทำเคลื่อนไหวได้เลย"): every part comes in on its own → what hides the secret really works
     (key, lid, flap, cover, curtain, coating …) → on the keyword the secret pops in, lit (halo + ripple + sparkles) → hold.
     T0 = when the reveal starts (a long sentence waits, then goes) · H = the keyword. Last frame = the approved still. ---------- */
  /* the secret revealed at o.t (default the keyword): halo blooms, ripple, sparkles pop, the picture comes in (o.mv = rides a moving part) */
  function reveal(q, c, X, x, y, w, ly, o = {}) { const t = o.t ?? Z.H - tu(.06), hr = o.halo || w * .78;
    if (o.halo !== false) { haloH(q, x, y, hr, t + tu(.02)); ripple(q, x, y, hr * .8, t + tu(.06)); }
    if (o.spark) o.spark.forEach(([a, b, r], i) => star4(popAt(q, x + a, y + b, t + tu(.08 + .05 * i)), x + a, y + b, r));
    if (!X) { star4(popAt(q, x, y, t), x, y, w * .34); return; }
    put(q, c, X, x, y, w, ly, Object.assign({ maxW: 240, size: 32 }, o, { t, lt: o.lt ?? t + tu(.12) })); }
  const labAt = (q, X, x, y, o) => { if (X && X.label && picOf(X)) txt(atG(q, Z.H + tu(.12)), X.label, x, y, Object.assign({ maxW: 260, color: C.ink, weight: 700, size: 34 }, o)); };
  const fadeIn = (t, d = .1) => [[0, 0], [t, 0], [t + tu(d), 1]];
  const slideX = (t, dx = -70) => [[0, dx], [t, dx], [t + tu(.32), 4, 'out'], [t + tu(.42), 0, 'soft']];
  const floorD = (p, y = 290) => drawAt(p.line(-480, y, 480, y, S(2)), p, 0, tu(.4));

  const V = [];
  const variant = (id, th, build) => V.push({ id, th, build });

  /* 01 ── KEY + CLOSED BOX: the key slides in and hops up to the lock, wiggles (click), hops back down; the hasp drops, the lid swings open,
     the secret rises out of the box */
  variant('keybox', 'กุญแจไขกล่อง', (d, c) => { const X = st(d), T = TL(), H = T.H, T0 = T.T0;
    art(c, p => { floorD(p);
      const bx = inG(p, 'rise', -60, 160, tu(.04));
      const lid = mvG(bx, { px: -60, py: 30, sy: [[0, .1], [T0 + tu(.32), .1], [H - tu(.12), 1.06, 'out'], [H, 1, 'soft']] });
      shape(lid, [[-270, 30], [150, 30], [180, -60], [-300, -60]], F(3.2)); shape(lid, [[-252, 22], [134, 22], [158, -48], [-278, -48]], S(1.6));
      R(bx, -270, 30, 420, 260, 16, F(3.4)); bx.line(-270, 64, 150, 64, S(2)); R(bx, -246, 88, 372, 180, 10, S(1.6));
      [-246, 126].forEach(x => [[x + 10, 98], [x + 10, 258]].forEach(([a, b]) => screw(bx, a, b, 4)));
      R(bx, -104, 92, 88, 116, 14, F(3)); keyhole(bx, -60, 132);
      const hg = mvG(bx, { y: [[0, -30], [T0 + tu(.12), -30], [T0 + tu(.24), 4, 'in'], [T0 + tu(.32), 0, 'soft']] }); R(hg, -98, 30, 76, 40, 10, F(2.6)); hg.circle(-60, 50, 7, S(1.6));
      sparkAt(p, -60, 140, 34, 50, T0, 6, 0, []);
      const kx = -446, ky = -118, kg = mvG(p, { px: 236, py: 268, o: fadeIn(tu(.12)),
        x: [[0, 300], [tu(.12), 300], [tu(.34), -6, 'out'], [tu(.4), 0, 'soft'], [T0 - tu(.38), 0], [T0 - tu(.08), kx, 'io'], [T0 + tu(.1), kx], [T0 + tu(.4), 0, 'io']],
        y: [[0, 0], [T0 - tu(.38), 0], [T0 - tu(.22), -210, 'out'], [T0 - tu(.08), ky, 'in'], [T0 + tu(.1), ky], [T0 + tu(.24), -210, 'out'], [T0 + tu(.4), 0, 'in'], [T0 + tu(.46), -10, 'out'], [T0 + tu(.54), 0, 'soft']],
        r: [[0, 0], [T0 - tu(.38), 0], [T0 - tu(.08), 8], [T0 - tu(.02), -14], [T0 + tu(.04), 10], [T0 + tu(.1), 8], [T0 + tu(.4), 0]] });
      key(kg, 236, 268, -8, .9);
      reveal(p, c, X, -60, -170, 140, null, { mv: { y: [[0, 60], [H - tu(.06), 60], [H + tu(.2), -6, 'out'], [H + tu(.3), 0, 'soft']] }, spark: [[-118, -40, 12], [112, -70, 9], [96, 40, 7]] });
      labAt(p, X, 60, -160, { anchor: 'start', maxW: 300, wrap: 'down' });
    }); });

  /* 02 ── A PERSON HOLDING A KEY: the person walks in holding out the key, pushes it into the lock and turns it; the little door folds open
     on its hinges and the secret glows inside */
  variant('keyholder', 'คนถือกุญแจไขตู้', (d, c) => { const X = st(d), T = TL(), H = T.H, T0 = T.T0, px = -380, k = .85, arm = { s: [4, -76], e: [56, -70], h: [108, -60] };
    art(c, p => { floorD(p);
      const cb = inG(p, 'rise', 70, 30, tu(.1));
      R(cb, -140, -230, 420, 520, 18, F(3.4)); R(cb, -158, -250, 456, 34, 10, F(3)); [-110, 250].forEach(x => R(cb, x - 14, 290 - 6, 28, 6, 2, F(2)));
      R(cb, -100, -150, 240, 260, 12, { fill: 'rgba(255,255,255,.05)', sw: 3 }); R(cb, -82, -132, 204, 224, 8, S(1.4));
      haloH(cb, 20, -24, 104, H);
      const dc = mvG(cb, { px: -100, py: 0, sx: [[0, 1], [T0 + tu(.22), 1], [T0 + tu(.38), .03, 'in']], o: [[0, 1], [T0 + tu(.38), 1], [T0 + tu(.385), 0]] });
      R(dc, -100, -150, 240, 260, 12, F(3.2)); R(dc, -84, -134, 208, 228, 8, S(1.4)); dc.circle(112, -20, 8, S(1.8)); keyhole(dc, 112, -22, .5);
      const dop = mvG(cb, { px: -100, py: -20, sx: [[0, .03], [T0 + tu(.38), .03], [T0 + tu(.56), 1.08, 'out'], [T0 + tu(.68), 1, 'soft']], o: [[0, 0], [T0 + tu(.38), 0], [T0 + tu(.385), 1]] });
      shape(dop, [[-100, -150], [-100, 110], [-176, 140], [-176, -176]], F(3.2)); shape(dop, [[-110, -132], [-110, 94], [-166, 116], [-166, -154]], S(1.4)); dop.circle(-160, -18, 6, S(1.8));
      [-130, 74].forEach(y => R(cb, -106, y, 12, 26, 3, F(2)));
      R(cb, -100, 150, 240, 110, 10, S(1.6)); R(cb, 0, 196, 40, 10, 4, S(1.6)); R(cb, 180, -150, 70, 410, 10, S(1.4));
      const pg = mvG(p, { x: slideX(tu(.04)), o: fadeIn(tu(.04)) }); person(pg, px, 290, k, arm);
      const hd = pAt(px, 290, k, 108, -60), kg = mvG(p, { px: hd[0], py: hd[1], x: slideX(tu(.04)).concat([[T0 - tu(.22), 0], [T0 - tu(.06), -22, 'io'], [T0 + tu(.04), 8, 'in'], [T0 + tu(.14), 0, 'soft']]),
        r: [[0, 0], [T0 + tu(.04), 0], [T0 + tu(.1), -16], [T0 + tu(.18), 12], [T0 + tu(.26), 0, 'soft']], o: fadeIn(tu(.04)) });
      key(kg, hd[0] - 6, hd[1], 0, .7); sparkAt(p, hd[0] + 104, hd[1], 18, 30, T0 + tu(.06), 5, -90);
      reveal(cb, c, X, 20, -30, 140, 160, { halo: false, maxW: 220 }); ripple(cb, 20, -30, 80, H);
    }); });

  /* 03 ── THE LOCK SEAL: the round seal drops in whole; it shakes, the keyhole flashes, and the two halves slide apart — the secret is lit in the gap */
  variant('lockseal', 'ตรากุญแจแยกออก', (d, c) => { const X = st(d), T = TL(), H = T.H, T0 = T.T0, cy = -30, Ro = 205, Ri = 166, gap = 150;
    art(c, p => { const all = mvG(inG(p, 'pop', 0, cy, tu(.05)), { px: 0, py: cy, r: buzzK(T0, 3) });
      [-1, 1].forEach(sd => { const cx = sd * gap, g = mvG(all, { x: [[0, -sd * gap], [T0 + tu(.3), -sd * gap], [T0 + tu(.36), -sd * (gap + 8), 'out'], [H - tu(.14), sd * 12, 'io'], [H - tu(.02), 0, 'soft']] });
        g.path(`M ${cx} ${cy - Ro} A ${Ro} ${Ro} 0 0 ${sd > 0 ? 1 : 0} ${cx} ${cy + Ro} Z`, F(3.4));
        g.path(`M ${cx + sd * 14} ${cy - Ri} A ${Ri} ${Ri} 0 0 ${sd > 0 ? 1 : 0} ${cx + sd * 14} ${cy + Ri}`, S(1.8));
        for (let k = -2; k <= 2; k++) { const y = cy + k * 64; if (k % 2) R(g, cx - (sd > 0 ? 18 : 0), y - 14, 18, 28, 4, F(2.4)); }
        g.path(`M ${cx} ${cy - 46} A 24 24 0 0 ${sd > 0 ? 1 : 0} ${cx} ${cy - 2} L ${cx + sd * 10} ${cy + 46} L ${cx} ${cy + 46} Z`, SOLID(1));
        for (let a = -60; a <= 60; a += 30) { const u = rad(a), x0 = cx + sd * Math.cos(u) * (Ri - 30), y0 = cy + Math.sin(u) * (Ri - 30); g.circle(f1(x0 + sd * 40), f1(y0), 5, S(1.4)); } });
      sparkAt(p, 0, cy, 60, 80, T0 + tu(.02), 6, 0, []);
      sparkAt(p, 0, cy, 92, 112, H, 8, 22, [], true);
      reveal(p, c, X, 0, cy, 130, cy + 140, { halo: 82, maxW: 260 });
    }); });

  /* 04 ── THE SECRET DRAWER: the chest rises; its little lock clicks, the chest jolts, and a thin drawer slides out of its base with the secret */
  variant('drawer', 'กล่องมีลิ้นชักลับ', (d, c) => { const X = st(d), T = TL(), H = T.H, T0 = T.T0;
    art(c, p => { floorD(p);
      const ch = mvG(inG(p, 'rise', -185, 150, tu(.04)), { x: buzzK(T0 + tu(.08), 4) });
      R(ch, -400, -20, 430, 290, 14, F(3.4)); shape(ch, [[-416, -20], [46, -20], [30, -96], [-400, -96]], F(3.2)); ch.line(-406, -60, 38, -60, S(1.6));
      [-300, -70].forEach(x => R(ch, x - 14, -96, 28, 292, 4, S(1.6))); ch.line(-400, 196, 30, 196, S(2));
      [[-400, -20, 1], [30, -20, -1]].forEach(([x, y, sd]) => shape(ch, [[x, y], [x + sd * 54, y], [x, y + 54]], S(1.8))); R(ch, -142, 30, 34, 50, 8, F(2.4)); keyhole(ch, -125, 46, .6);
      [-380, 10].forEach(x => R(ch, x - 16, 270, 32, 20, 4, F(2.4)));
      R(ch, -400, 206, 430, 56, 6, { fill: C.fill, sw: 2 });
      sparkAt(p, -125, 54, 30, 44, T0, 6, 0, []);
      const dg = mvG(clipG(p, -20, -350, 520, 700), { x: [[0, -390], [T0 + tu(.2), -390], [T0 + tu(.26), -398, 'out'], [H - tu(.14), 10, 'io'], [H - tu(.04), 0, 'soft']] });
      R(dg, -20, 206, 380, 56, 8, F(3.2)); R(dg, -2, 216, 344, 30, 4, S(1.4)); R(dg, 360, 216, 22, 36, 8, F(2.6));
      shape(dg, [[-20, 206], [342, 206], [324, 170], [-2, 170]], { fill: 'rgba(255,255,255,.05)', sw: 2 });
      reveal(p, c, X, 170, 110, 130, null, { halo: 96, mv: { y: [[0, 40], [H - tu(.06), 40], [H + tu(.2), -4, 'out'], [H + tu(.3), 0, 'soft']] } });
      labAt(p, X, 170, -40, { maxW: 280, wrap: 'up' });
    }); });

  /* 05 ── THE STAR BOX: the box rises with its lid on; the star on the lid flares, the lid draws back a touch and slides along its grooves;
     the secret comes up out of the opening */
  variant('starbox', 'กล่องดาวฝาเลื่อน', (d, c) => { const X = st(d), T = TL(), H = T.H, T0 = T.T0, lx = 250;
    art(c, p => { floorD(p);
      const bx = inG(p, 'rise', 0, 140, tu(.04));
      shape(bx, [[170, -10], [240, -80], [240, 210], [170, 290]], F(3.2)); R(bx, -170, -10, 340, 300, 8, F(3.4)); R(bx, -146, 14, 292, 252, 6, S(1.6));
      shape(bx, [[-170, -10], [170, -10], [240, -80], [-100, -80]], F(3)); shape(bx, [[-140, -22], [150, -22], [206, -68], [-84, -68]], { fill: C.fill, sw: 2.2 });
      reveal(p, c, X, 30, -220, 140, null, { halo: 108, mv: { y: [[0, 110], [H - tu(.06), 110], [H + tu(.22), -6, 'out'], [H + tu(.32), 0, 'soft']] } });
      const lid = mvG(bx, { x: [[0, -lx], [T0 + tu(.16), -lx], [T0 + tu(.26), -lx - 12, 'out'], [H - tu(.14), 8, 'io'], [H - tu(.04), 0, 'soft']] });
      shape(lid, [[-170 + lx, -14], [170 + lx, -14], [240 + lx, -84], [-100 + lx, -84]], F(3.2)); shape(lid, [[-158 + lx, -18], [162 + lx, -18], [226 + lx, -80], [-94 + lx, -80]], S(1.2));
      const sg = mvG(lid, { px: 40 + lx, py: -49, s: [[0, 1], [T0, 1], [T0 + tu(.08), 1.4, 'out'], [T0 + tu(.3), 1, 'soft']], r: [[0, 0], [T0, 0], [T0 + tu(.3), 90, 'out']] });
      star4(sg, 40 + lx, -49, 26, { fill: C.ink, sw: 1.4 }); halo(lid, 40 + lx, -49, 40); ripple(lid, 40 + lx, -49, 30, T0);
      labAt(p, X, -260, -205, { maxW: 250, wrap: 'down' });
    }); });

  /* 06 ── THE "?" CUBE: the cube drops onto its turntable showing a big "?"; it turns (squeezes to its edge and back) and now the "?" is on the
     side and the face with the secret looks at us */
  variant('qcube', 'กล่องคำถามหมุนตัว', (d, c) => { const X = st(d), T = TL(), H = T.H, T0 = T.T0, x0 = -150, x1 = 110, y0 = -190, y1 = 70, dx = 90, dy = -70, mx = (x0 + x1) / 2, my = (y0 + y1) / 2;
    art(c, p => { floorD(p);
      const tt = inG(p, 'pop', -10, 220, tu(.04)); const disk = (y) => ell(tt, -10, y, 230, 40, F(3));
      disk(210); R(tt, -230, 210, 440, 30, 0, { fill: C.fill, sw: 0, stroke: 'none' }); disk(240); R(tt, -228, 208, 436, 34, 0, { fill: C.fill, sw: 0, stroke: 'none' });
      disk(210); tt.line(-240, 210, -240, 240, W(3)); tt.line(220, 210, 220, 240, W(3)); R(tt, -40, 112, 60, 86, 8, F(2.6));
      const cg = mvG(inG(p, 'drop', mx, my, tu(.16)), { px: mx + dx / 2, py: my, sx: [[0, 1], [T0 + tu(.12), 1], [T0 + tu(.32), .04, 'in'], [T0 + tu(.52), 1.06, 'out'], [T0 + tu(.64), 1, 'soft']] });
      shape(cg, [[x1, y0], [x1 + dx, y0 + dy], [x1 + dx, y1 + dy], [x1, y1]], F(3.2)); shape(cg, [[x0, y0], [x1, y0], [x1 + dx, y0 + dy], [x0 + dx, y0 + dy]], F(3.2));
      R(cg, x0, y0, x1 - x0, y1 - y0, 10, F(3.4));
      const A = outG(cg, T0 + tu(.32), .01); A.text('?', mx, my + 52, { size: 170, weight: 800, anchor: 'middle', color: C.ink, dur: .01 });
      const B = litG(cg, T0 + tu(.32), .01);
      { const g = sub(B, { transform: `matrix(1 ${f1(dy / dx)} 0 1 ${x1 + dx / 2} ${f1(my + dy / 2 + 50)})` }); g.text('?', 0, 0, { size: 150, weight: 800, anchor: 'middle', color: C.soft, dur: .01 }); }
      R(B, x0 + 16, y0 + 16, x1 - x0 - 32, y1 - y0 - 32, 6, { fill: 'rgba(255,255,255,.05)', sw: 1.6, stroke: C.soft });
      reveal(p, c, X, mx, my, 140, null, { halo: false }); haloH(p, mx, my, 180, H); ripple(p, mx, my, 130, H + tu(.04));
      labAt(p, X, 360, -40, { maxW: 240, wrap: 'down' });
    }); });

  /* 07 ── THE SEALED ENVELOPE: the envelope rises with its flap down and the seal on it; the seal shakes and cracks, the flap flips up
     (the seal now broken in two), and the card slides out to the side with the secret */
  variant('sealed', 'ซองผนึกครั่ง', (d, c) => { const X = st(d), T = TL(), H = T.H, T0 = T.T0, ex = -110;
    const cx0 = -230, cy0 = 90, cK = { x: [[0, cx0], [T0 + tu(.46), cx0], [H - tu(.14), 8, 'out'], [H - tu(.04), 0, 'soft']], y: [[0, cy0], [T0 + tu(.46), cy0], [H - tu(.14), -4, 'out'], [H - tu(.04), 0, 'soft']] };
    art(c, p => { const cm = mvG(p, Object.assign({ o: [[0, 0], [T0 + tu(.45), 0], [T0 + tu(.46), 1]] }, cK)), cg = rot(cm, 14, 170, -90);
      R(cg, 30, -210, 290, 230, 16, F(3.4)); R(cg, 48, -192, 254, 194, 10, S(1.4));
      const env = inG(p, 'rise', ex, 100, tu(.04));
      const fu = mvG(env, { px: ex, py: -60, sy: [[0, .03], [T0 + tu(.36), .03], [T0 + tu(.52), 1.06, 'out'], [T0 + tu(.62), 1, 'soft']], o: [[0, 0], [T0 + tu(.36), 0], [T0 + tu(.365), 1]] });
      shape(fu, [[ex - 260, -60], [ex + 260, -60], [ex, -250]], F(3.2)); shape(fu, [[ex - 222, -72], [ex + 222, -72], [ex, -232]], S(1.4));
      const seal = (q, sx, sy, a, sd) => { const g = rot(q, a, sx, sy); g.path(`M ${sx} ${sy - 34} L ${sx + sd * 8} ${sy - 18} L ${sx - sd * 4} ${sy - 4} L ${sx + sd * 8} ${sy + 12} L ${sx} ${sy + 34} A 34 34 0 0 ${sd > 0 ? 0 : 1} ${sx} ${sy - 34} Z`, F(3)); g.circle(sx - sd * 16, sy, 9, S(1.4)); };
      seal(fu, ex - 28, -228, -18, 1); seal(fu, ex + 34, -214, 22, -1);
      R(env, ex - 260, -60, 520, 330, 12, F(3.4)); env.path(`M ${ex - 260} 270 L ${ex} 90 L ${ex + 260} 270`, S(2)); env.path(`M ${ex - 260} -60 L ${ex} 110 L ${ex + 260} -60`, S(1.6));
      const fd = mvG(env, { px: ex, py: -60, sy: [[0, 1], [T0 + tu(.2), 1], [T0 + tu(.36), .03, 'in']], o: [[0, 1], [T0 + tu(.36), 1], [T0 + tu(.365), 0]] });
      shape(fd, [[ex - 260, -60], [ex + 260, -60], [ex, 110]], F(3.2)); shape(fd, [[ex - 222, -48], [ex + 222, -48], [ex, 90]], S(1.4));
      const sl = mvG(fd, { px: ex, py: 96, r: buzzK(T0, 8) }); sl.circle(ex, 96, 34, F(3)); sl.circle(ex, 96, 22, S(1.4));
      sparkAt(p, ex, 96, 44, 60, T0 + tu(.16), 6, 0, []);
      reveal(cg, c, X, 190, -110, 118, null, { halo: 80, mv: { x: cK.x, y: cK.y, r: [[0, 14]] } });
      labAt(p, X, ex, 190, { maxW: 300, wrap: 'up' });
    }); });

  /* 08 ── THE SECRET FILE: the wallet drops in with its string wound tight round the buttons; the string unwinds and falls loose, the flap
     lifts, the document slides out from behind and lands to the right; the stamp on it thumps down after the keyword */
  variant('dossier', 'แฟ้มซองผูกเชือก', (d, c) => { const X = st(d), T = TL(), H = T.H, T0 = T.T0;
    art(c, p => { const dm = mvG(p, { px: 160, py: 30, o: [[0, 0], [T0 + tu(.39), 0], [T0 + tu(.4), 1]],
        x: [[0, -420], [T0 + tu(.4), -420], [H - tu(.2), 10, 'out'], [H - tu(.08), 0, 'soft']], y: [[0, 10], [T0 + tu(.4), 10], [T0 + tu(.6), -60, 'out'], [H - tu(.2), 4, 'io'], [H - tu(.08), 0, 'soft']],
        r: [[0, -12], [T0 + tu(.4), -12], [H - tu(.2), 2, 'out'], [H - tu(.08), 0, 'soft']] }), dg = rot(dm, 4, 160, 30);
      R(dg, -10, -280, 340, 450, 10, F(3.4)); lines(dg, 20, -240, 160, 2, 24, S(2.2)); dg.line(20, 120, 300, 120, S(1.6)); lines(dg, 20, 140, 280, 1, 20, S(1.6));
      const stp = mvG(dg, { px: 270, py: -230, s: [[0, 1.7], [H + tu(.12), 1.7], [H + tu(.22), .92, 'in'], [H + tu(.32), 1, 'soft']], o: [[0, 0], [H + tu(.12), 0], [H + tu(.14), 1]] });
      ring(stp, 270, -230, 34, 26, { fill: 'none', sw: 2, stroke: C.soft }); star4(stp, 270, -230, 12, { fill: C.soft, sw: 1 });
      const fg = rot(inG(p, 'drop', -260, 40, tu(.05)), -8, -260, 40); R(fg, -420, -170, 300, 400, 12, F(3.4));
      const fl = mvG(fg, { px: -270, py: -170, sy: [[0, 1], [T0 + tu(.3), 1], [T0 + tu(.38), 1.3, 'out'], [T0 + tu(.56), 1, 'soft']] }); shape(fl, [[-420, -170], [-120, -170], [-150, -230], [-390, -230]], F(3));
      [-120, 10].forEach(y => { const b = mvG(fg, { px: -270, py: y, r: [[0, 0], [T0, 0], [T0 + tu(.3), y < 0 ? -200 : 200, 'out']] }); b.circle(-270, y, 18, F(2.6)); b.circle(-270, y, 6, S(1.2)); b.line(-270, y - 12, -270, y - 4, S(1.2)); });
      const tight = outG(fg, T0 + tu(.2), .06); tight.path('M -270 -120 C -230 -100 -230 -10 -270 10 C -310 30 -310 -140 -270 -120 C -236 -96 -236 -14 -270 10 C -304 26 -304 -136 -270 -120', W(2.2));
      const loose = fg.path('M -270 -120 C -230 -90 -320 -60 -280 -30 C -250 -10 -300 20 -270 10 C -230 40 -200 90 -240 140 C -260 170 -210 190 -220 220', W(2.2)); on(loose, p, 0, { draw: [[0, 0], [T0 + tu(.18), 0], [T0 + tu(.5), 1, 'out']] });
      R(fg, -400, 160, 120, 46, 6, S(1.6));
      reveal(dg, c, X, 160, -40, 140, 90, { halo: 104, r: 4, maxW: 280 });
    }); });

  /* 09 ── THE DOG-EARED PAGE: the pages drop in flat; the corner of the top page lifts, folds back, and the secret is on the page underneath */
  variant('dogear', 'มุมกระดาษพับ', (d, c) => { const X = st(d), T = TL(), H = T.H, T0 = T.T0;
    art(c, p => { const pg = inG(p, 'drop', 0, 0, tu(.05));
      R(pg, -364, -272, 724, 556, 10, F(3)); haloH(pg, 272, 190, 80, H);
      shape(pg, [[-380, -290], [360, -290], [360, 0], [80, 280], [-380, 280]], F(3.4));
      for (let k = 0; k < 9; k++) { const y = -236 + k * 54, xe = Math.min(320, 330 - y); drawAt(pg.line(-330, y, k % 3 === 2 ? Math.min(xe, 0) : xe, y, S(2.2)), p, tu(.2 + .03 * k), tu(.25)); }
      const cp = mvG(pg, { px: 220, py: 140, s: [[0, 1], [T0 + tu(.24), 1], [T0 + tu(.4), .2, 'in']], o: [[0, 1], [T0 + tu(.4), 1], [T0 + tu(.405), 0]] });
      shape(cp, [[80, 280], [360, 280], [360, 0]], { fill: C.fill, sw: 0, stroke: 'none' }); cp.path('M 360 0 L 360 280 L 80 280', W(3.4));
      for (let k = 0; k < 9; k++) { const y = -236 + k * 54, x0 = 372 - y; if (y > 0 && x0 < 320 && k % 3 !== 2) cp.line(x0, y, 320, y, S(2.2)); }
      const fl = mvG(pg, { px: 220, py: 140, s: [[0, .2], [T0 + tu(.4), .2], [T0 + tu(.56), 1.05, 'out'], [T0 + tu(.66), 1, 'soft']], o: [[0, 0], [T0 + tu(.4), 0], [T0 + tu(.405), 1]] });
      shape(fl, [[80, 280], [360, 0], [80, 0]], F(3)); fl.line(112, 40, 112, 200, S(1.2)); fl.line(112, 40, 290, 40, S(1.2));
      reveal(p, c, X, 274, 186, 110, null, { halo: false }); ripple(p, 274, 186, 64, H);
      if (X && X.label && picOf(X)) txt(atG(p, H + tu(.12)), X.label, 262, 266, { maxW: 200, color: C.ink, weight: 700, size: 30 });
    }); });

  /* 10 ── THE TRI-FOLD: the folded sheet pops in closed; the top flap opens out on its crease, then the other — the middle panel carries the secret */
  variant('trifold', 'กระดาษพับสามทบคลี่', (d, c) => { const X = st(d), T = TL(), H = T.H, T0 = T.T0, w = 150;
    art(c, p => { const mid = inG(p, 'pop', 0, 0, tu(.05));
      R(mid, -w, -230, 2 * w, 460, 6, F(3.4)); R(mid, -w + 18, -212, 2 * w - 36, 424, 4, { fill: 'rgba(255,255,255,.05)', sw: 1.4, stroke: C.soft });
      [1, -1].forEach(sd => { const ts = T0 + tu(sd < 0 ? 0 : .3), pn = mvG(mid, { px: sd * w, py: 0, sx: [[0, -1], [ts, -1], [ts + tu(.34), 1.05, 'io'], [ts + tu(.44), 1, 'soft']] });
        shape(pn, [[sd * w, -230], [sd * w, 230], [sd * (w + 190), 190], [sd * (w + 190), -190]], F(3.2));
        for (let k = 0; k < 6; k++) { const u = k / 5, y0 = -150 + u * 280; pn.line(sd * (w + 30), f1(y0 * .97 - 2), sd * (w + 160), f1(y0 * .86 - 2), S(1.8)); } });
      [-w, w].forEach(x => mid.line(x, -230, x, 230, W(3.4)));
      reveal(p, c, X, 0, -40, 140, 130, { halo: 102, maxW: 250 });
    }); });

  /* 11 ── THE TURNING SIGN: the post rises, the sign drops onto its pivots showing its blank back; it turns half round on the pivots
     (overshoot, settle) and the face with the secret comes round */
  variant('turnsign', 'ป้ายหมุนบนเสา', (d, c) => { const X = st(d), T = TL(), H = T.H, T0 = T.T0;
    art(c, p => { floorD(p); const po = inG(p, 'rise', 0, 0, tu(.04)); shape(po, [[-90, 290], [90, 290], [60, 250], [-60, 250]], F(3)); R(po, -10, -280, 20, 535, 6, F(2.6));
      const sp = mvG(inG(p, 'drop', 0, -65, tu(.16)), { px: 0, py: -65, sx: [[0, 1], [T0 + tu(.1), 1], [T0 + tu(.3), .03, 'in'], [T0 + tu(.5), 1.06, 'out'], [T0 + tu(.62), 1, 'soft']] });
      R(sp, -250, -230, 500, 330, 18, F(3.4)); R(sp, -228, -208, 456, 286, 12, S(1.6));
      [[-232, -212], [232, -212], [-232, 84], [232, 84]].forEach(([a, b]) => screw(sp, a, b, 4));
      const bk = outG(sp, T0 + tu(.3), .01); [-60, 0, 60].forEach(y => bk.line(-120, y - 70, 120, y - 70, S(1.4)));
      const hb = inG(p, 'rise', 0, 0, tu(.04)); [-246, 112].forEach(y => { R(hb, -22, y, 44, 24, 8, F(2.6)); hb.circle(0, y + 12, 5, S(1.2)); });
      const wl = sub(p); on(wl, p, 0, { o: [[0, 0], [T0 + tu(.3), 0], [T0 + tu(.34), 1]] }); [[268, -150, 300, -170], [268, -60, 312, -60], [268, 30, 300, 50]].forEach(([a, b, e, f]) => drawAt(wl.line(a, b, e, f, S(2)), p, T0 + tu(.3), tu(.2)));
      reveal(p, c, X, 0, -90, 140, 50, { halo: 96, maxW: 380 });
    }); });

  /* 12 ── THE SLIDING COVER: the rails draw, the plaque comes in covered; the cover draws back a touch, then slides all the way along the rails */
  variant('slidecover', 'ป้ายฝาเลื่อน', (d, c) => { const X = st(d), T = TL(), H = T.H, T0 = T.T0;
    art(c, p => { [-176, 156].forEach(y => { drawAt(R(p, -390, y, 860, 20, 8, F(2.6)), p, 0, tu(.35)); [-372, 452].forEach(x => screw(atG(p, tu(.3)), x, y + 10, 5)); });
      const pl = inG(p, 'pop', -120, 0, tu(.12)); R(pl, -370, -156, 500, 312, 14, F(3.4)); R(pl, -350, -136, 460, 272, 8, { fill: 'rgba(255,255,255,.05)', sw: 1.6, stroke: C.soft });
      reveal(p, c, X, -120, -24, 140, 100, { halo: 100, maxW: 380 });
      const cv = mvG(p, { o: fadeIn(tu(.2)), x: [[0, -470], [T0 + tu(.14), -470], [T0 + tu(.24), -484, 'out'], [H - tu(.14), 8, 'io'], [H - tu(.03), 0, 'soft']] });
      R(cv, 150, -160, 300, 320, 12, F(3.4)); R(cv, 172, -138, 256, 276, 8, S(1.4)); [0, 1, 2].forEach(k => cv.line(176 + k * 14, -60, 176 + k * 14, 60, S(2.2)));
      [-160, 140].forEach(y => R(cv, 166, y, 268, 20, 4, F(2)));
    }); });

  /* 13 ── ONE TOKEN AMONG MANY: the tray rises and the tokens drop into it one by one; they jiggle, then one lifts out of its slot, turns over
     as it rises and grows — the secret is on its face, sparkles above */
  variant('tokens', 'เหรียญพิเศษในถาด', (d, c) => { const X = st(d), T = TL(), H = T.H, T0 = T.T0, xs = [-330, -165, 0, 165, 330];
    art(c, p => { const tr = inG(p, 'rise', 0, 230, tu(.04)); R(tr, -430, 196, 860, 78, 34, F(3.4)); tr.line(-400, 218, 400, 218, S(1.6));
      ell(tr, 0, 186, 62, 16, { fill: C.fill, sw: 2, stroke: C.soft });
      const tok = (q, x) => { R(q, x - 62, 150, 124, 40, 20, F(3)); ell(q, x, 150, 62, 18, F(3)); ell(q, x, 150, 40, 10, S(1.4)); };
      xs.forEach((x, i) => { const g = mvG(inG(p, 'drop', x, 170, tu(.16 + .06 * i)), { y: [[0, 0], [T0 - tu(.1) + tu(.04 * i), 0], [T0 - tu(.05) + tu(.04 * i), -12, 'out'], [T0 + tu(.08) + tu(.04 * i), 0, 'soft']] });
        if (i === 2) { const f = mvG(g, { y: [[0, 0], [T0 + tu(.16), 0], [T0 + tu(.3), -90, 'out']], o: [[0, 1], [T0 + tu(.22), 1], [T0 + tu(.3), 0]] }); tok(f, x); } else tok(g, x); });
      const up = mvG(p, { px: 0, py: -60, y: [[0, 210], [T0 + tu(.22), 210], [T0 + tu(.52), -8, 'out'], [T0 + tu(.62), 0, 'soft']], s: [[0, .5], [T0 + tu(.22), .5], [T0 + tu(.52), 1.04, 'out'], [T0 + tu(.62), 1, 'soft']], o: [[0, 0], [T0 + tu(.22), 0], [T0 + tu(.26), 1]] });
      const fl = mvG(up, { px: 0, py: -60, sy: [[0, .2], [T0 + tu(.22), .2], [T0 + tu(.34), -1], [T0 + tu(.46), .3], [T0 + tu(.6), 1, 'out']] });
      fl.circle(0, -60, 118, F(3.6)); fl.circle(0, -60, 100, S(1.6));
      reveal(p, c, X, 0, -60, 130, null, { halo: 150, spark: [[-170, -110, 16], [160, -140, 12], [176, 30, 9], [-150, 70, 8]] });
      labAt(p, X, 0, -232, { maxW: 340 });
    }); });

  /* 14 ── THE LITTLE STAR FRAME: the frame drops onto its strut, empty and dark; the little star at its corner twinkles, flares and lights —
     the frame fills with a flash and the secret is in it */
  variant('starframe', 'กรอบตั้งโต๊ะติดดาว', (d, c) => { const X = st(d), T = TL(), H = T.H, T0 = T.T0;
    art(c, p => { floorD(p); drawAt(shape(p, [[170, -40], [300, 290], [268, 290], [150, -10]], F(2.6)), p, tu(.3), tu(.2));
      const fr = inG(p, 'drop', 0, 0, tu(.06)); R(fr, -220, -250, 440, 520, 18, F(3.6)); R(fr, -186, -216, 372, 452, 8, F(2.4)); R(fr, -170, -200, 340, 420, 4, { fill: 'rgba(255,255,255,.05)', sw: 1.2, stroke: C.soft });
      const fl = sub(fr); on(fl, p, 0, { o: [[0, 0], [H - tu(.1), 0], [H - tu(.06), 1], [H + tu(.3), 0]] }); R(fl, -170, -200, 340, 420, 4, { fill: LIT, sw: 0, stroke: 'none' });
      haloH(p, 220, -250, 44, T0 + tu(.3)); const sp = popAt(p, 220, -250, tu(.4));
      const sg = mvG(sp, { px: 220, py: -250, s: [[0, 1], [T0, 1], [T0 + tu(.06), .7], [T0 + tu(.12), 1.2, 'out'], [T0 + tu(.3), 1.45, 'out'], [T0 + tu(.5), 1, 'soft']], r: [[0, 0], [T0, 0], [T0 + tu(.5), 180, 'out']] });
      star4(sg, 220, -250, 26, { fill: C.ink, sw: 1.4 });
      [[262, -294, 4], [266, -222, 3], [184, -296, 3]].forEach(([a, b, r], i) => { const g = popAt(p, a, b, T0 + tu(.3 + .05 * i)); g.circle(a, b, r, SOLID(1)); });
      reveal(p, c, X, 0, -40, 150, 140, { halo: 110, maxW: 300 });
    }); });

  /* 15 ── THE MAGNIFIER: the page of fine print appears line by line; the magnifier glides over it searching, slows and settles on one
     spot — the secret shows big inside the lens */
  variant('finesprint', 'แว่นขยายส่องตัวเล็ก', (d, c) => { const X = st(d), T = TL(), H = T.H, T0 = T.T0, cx = 30, cy = -40, Rl = 168, ang = 45;
    art(c, p => { const pg = inG(p, 'pop', -80, 0, tu(.04)); R(pg, -400, -290, 640, 580, 10, F(3.2));
      for (let k = 0; k < 18; k++) { const y = -260 + k * 30, row = atG(pg, tu(.12 + .015 * k)); let x = -370; while (x < 200) { const w = 18 + (Math.abs(k * 7 + Math.round(x / 10)) % 5) * 12; if (Math.hypot(Math.min(Math.max(cx, x), x + w) - cx, y - cy) > Rl + 10) row.line(x, y, Math.min(x + w, 210), y, S(1.6)); x += w + 12; } }
      const L = [[cx + 300, cy + 250], [cx - 220, cy + 150], [cx - 200, cy - 150], [cx + 90, cy - 60], [cx, cy]], K = pathK(L, tu(.4), H - tu(.16), [cx, cy], 36);
      const ln = mvG(clipG(p, -500, -350, 1000, 700), { x: K.x, y: K.y, o: fadeIn(tu(.36)) });
      const u = rad(ang), hx = cx + Math.cos(u) * Rl, hy = cy + Math.sin(u) * Rl;
      const hg = rot(ln, ang, hx, hy); R(hg, hx + 4, hy - 20, 44, 40, 8, F(2.6)); R(hg, hx + 46, hy - 26, 200, 52, 26, F(3.2)); [0, 1, 2, 3].forEach(k => hg.line(hx + 92 + k * 26, hy - 14, hx + 92 + k * 26, hy + 14, S(1.6)));
      ln.circle(cx, cy, Rl - 8, { fill: C.fill, sw: 0, stroke: 'none' }); ring(ln, cx, cy, Rl + 8, Rl - 10, F(3.2)); ln.circle(cx, cy, Rl - 22, S(1.2));
      haloH(p, cx, cy - 20, 96, H);
      reveal(p, c, X, cx, cy - 26, 140, cy + 96, { halo: false, maxW: 250 }); ripple(p, cx, cy - 20, 80, H + tu(.04));
    }); });

  /* 16 ── THE CURTAIN: the window comes in with its curtains drawn; the left curtain is pulled back along the rod (the right one sways),
     gathers and is tied — the secret shows in the uncovered part */
  variant('curtain', 'ม่านหน้าต่างรูดเปิด', (d, c) => { const X = st(d), T = TL(), H = T.H, T0 = T.T0, tG = H - tu(.16);
    art(c, p => { const wn = inG(p, 'pop', 0, -10, tu(.04)); R(wn, -270, -240, 540, 470, 10, F(3.4)); R(wn, -248, -218, 496, 426, 4, { fill: 'rgba(255,255,255,.04)', sw: 1.6, stroke: C.soft });
      R(wn, -320, 230, 640, 30, 8, F(3));
      drawAt(R(p, -340, -290, 680, 16, 8, F(2.6)), p, tu(.1), tu(.3)); [-340, 340].forEach(x => atG(p, tu(.3)).circle(x, -282, 14, F(2.6)));
      reveal(p, c, X, -40, -30, 150, 140, { halo: 110, maxW: 280 });
      const rc = mvG(p, { px: 190, py: -274, o: fadeIn(tu(.2)), r: [[0, 0], [T0 + tu(.2), 0], [T0 + tu(.4), -1.6, 'out'], [T0 + tu(.75), .9, 'io'], [H, 0, 'soft']] });
      rc.path('M 90 -274 L 290 -274 L 292 200 Q 250 214 216 200 Q 180 214 146 200 Q 112 214 90 200 Z', F(3.2)); [140, 190, 240].forEach(x => rc.path(`M ${x} -260 Q ${x - 8} -40 ${x + 4} 190`, S(1.6)));
      const ld = mvG(p, { px: -300, py: 0, sx: [[0, 1], [T0 + tu(.08), 1], [T0 + tu(.14), 1.02, 'out'], [tG, .27, 'io']], o: [[0, 0], [tu(.2), 0], [tu(.3), 1], [tG, 1], [tG + tu(.005), 0]] });
      ld.path('M -300 -274 L 92 -274 L 90 200 Q 50 214 12 200 Q -26 214 -64 200 Q -102 214 -140 200 Q -178 214 -216 200 Q -254 214 -300 200 Z', F(3.2));
      [-240, -160, -80, 10].forEach(x => ld.path(`M ${x} -260 Q ${x + 10} -40 ${x - 4} 190`, S(1.6)));
      const lf = litG(p, tG, .005); lf.path('M -300 -274 L -200 -274 Q -190 -150 -232 -40 Q -200 60 -230 200 L -300 200 Z', F(3.2)); [-270, -244].forEach(x => lf.path(`M ${x} -260 Q ${x + 10} -150 ${x} -50 Q ${x + 6} 60 ${x - 2} 190`, S(1.6)));
      const tie = popAt(p, -261, -42, tG + tu(.02)); R(tie, -310, -58, 98, 32, 12, F(2.6));
      const rg = atG(p, tu(.32)); for (let k = 0; k < 9; k++) rg.circle(-290 + k * 48, -274, 8, F(2)); for (let k = 0; k < 5; k++) rg.circle(100 + k * 46, -274, 8, F(2));
    }); });

  /* 17 ── POINTING AT A SMALL SPOT: the person walks in, the board rises and its dots come up row by row; the person jabs a point, a ring
     draws round one dot, a line runs out, and the call-out pops up with the secret */
  variant('pointer', 'คนชี้จุดเล็ก', (d, c) => { const X = st(d), T = TL(), H = T.H, T0 = T.T0, px = -410, k = .85, tx = -40, ty = 30, ox = 250, oy = -90, Rc = 128;
    art(c, p => { floorD(p);
      const bd = inG(p, 'rise', 90, 0, tu(.08)); R(bd, -250, -270, 680, 420, 14, F(3.4)); [-210, 390].forEach(x => R(bd, x - 8, 150, 16, 140, 4, F(2.4)));
      for (let r = 0; r < 5; r++) { const row = atG(bd, tu(.3 + .05 * r)); for (let q2 = 0; q2 < 7; q2++) { const x = -200 + q2 * 92, y = -220 + r * 82; if (Math.hypot(x - ox, y - oy) < Rc + 30 || (x === tx && y === ty)) continue; row.circle(x, y, 7, S(1.8)); } }
      const tg = popAt(p, tx, ty, tu(.4)); tg.circle(tx, ty, 9, SOLID(1)); const tb = mvG(tg, { px: tx, py: ty, s: bumpK(T0 + tu(.1), 1.6) }); tb.circle(tx, ty, 9, SOLID(1));
      drawAt(p.circle(tx, ty, 30, W(2.8)), p, T0 + tu(.12), tu(.24));
      const a = Math.atan2(oy - ty, ox - tx); drawAt(p.line(f1(tx + Math.cos(a) * 30), f1(ty + Math.sin(a) * 30), f1(ox - Math.cos(a) * Rc), f1(oy - Math.sin(a) * Rc), W(2.4)), p, T0 + tu(.4), tu(.25));
      const co = popAt(p, ox, oy, H - tu(.26)); co.circle(ox, oy, Rc, F(3.4)); haloH(p, ox, oy, Rc + 22, H);
      const pg = mvG(p, { x: slideX(tu(.02)), o: fadeIn(tu(.02)) }), pj = mvG(pg, { px: px, py: 290, r: [[0, 0], [T0 - tu(.1), 0], [T0 + tu(.02), 4, 'out'], [T0 + tu(.24), 0, 'soft']] });
      person(pj, px, 290, k, { s: [4, -76], e: [52, -104], h: [100, -128] });
      reveal(p, c, X, ox, oy - 14, 130, null, { halo: false }); ripple(p, ox, oy, Rc - 10, H + tu(.04));
      if (X && X.label && picOf(X)) txt(atG(p, H + tu(.12)), X.label, ox, oy + 72, { maxW: 200, color: C.ink, weight: 700, size: 28 });
    }); });

  /* 18 ── A BULB ABOVE THE HEAD: the person walks in and stands; a dim bulb pops up above their head, flickers, and on the keyword it lights
     (rays, halo) with the secret inside — the person gives a little start */
  variant('bulbhead', 'หลอดไฟเหนือศีรษะ', (d, c) => { const X = st(d), T = TL(), H = T.H, T0 = T.T0, px = -120, k = .8, bx = -112, by = -190, Rb = 105;
    art(c, p => { floorD(p);
      const pg = mvG(p, { x: slideX(tu(.02)), o: fadeIn(tu(.02)) }), pj = mvG(pg, { px: px, py: 290, sy: [[0, 1], [H - tu(.12), 1], [H - tu(.04), .94, 'in'], [H + tu(.1), 1.04, 'out'], [H + tu(.24), 1, 'soft']] });
      person(pj, px, 290, k, { s: [4, -76], e: [12, -30], h: [18, 12] });
      const hl = sub(p); on(hl, p, 0, { ox: bx, oy: by - 20, s: [[0, .7], [H - tu(.06), .7], [H + tu(.2), 1, 'out']], o: [[0, 0], [T0 + tu(.3), 0], [T0 + tu(.33), .5], [T0 + tu(.37), 0], [T0 + tu(.5), .6], [T0 + tu(.54), 0], [H - tu(.06), 0], [H - tu(.02), 1]] }); halo(hl, bx, by - 20, Rb + 34);
      const bg = mvG(inG(p, 'pop', bx, by + 120, tu(.4)), { px: bx, py: by + 160, y: [[0, 0], [T0, 0], [T0 + tu(.4), -6, 'io'], [H - tu(.06), 0, 'io']] });
      bg.path(`M ${bx - 54} ${by + 112} Q ${bx - Rb - 10} ${by + 40} ${bx - Rb} ${by - 20} A ${Rb} ${Rb} 0 1 1 ${bx + Rb} ${by - 20} Q ${bx + Rb + 10} ${by + 40} ${bx + 54} ${by + 112} Z`, F(3.4));
      R(bg, bx - 52, by + 112, 104, 22, 6, F(2.6)); R(bg, bx - 46, by + 134, 92, 20, 6, F(2.6)); R(bg, bx - 30, by + 154, 60, 14, 6, F(2.4));
      sparkAt(p, bx, by - 20, Rb + 18, Rb + 40, H - tu(.02), 9, -150, [3, 4, 5], true);
      reveal(p, c, X, bx, by - 18, 140, null, { halo: false }); ripple(p, bx, by - 20, Rb, H);
      labAt(p, X, 250, -170, { maxW: 280, wrap: 'down' });
    }); });

  /* 19 ── THE SCRATCH CARD (replaces "a whisper in the ear"): the card rises fully coated; the scraper comes in and scrapes stroke by stroke,
     the coating going strip by strip (shavings fall), and the secret is uncovered; the scraper goes back to rest */
  variant('scratch', 'บัตรขูด', (d, c) => { const X = st(d), T = TL(), H = T.H, T0 = T.T0, x0 = -210, y0 = -150, w = 360, h = 230, n = 8, tE = H - tu(.12), tS = T0 - tu(.1), tk = i => tS + (tE - tS) * (i + 1) / n;
    art(c, p => { const cd = inG(p, 'rise', -20, -40, tu(.04)); R(cd, -320, -250, 600, 420, 22, F(3.4)); lines(cd, -284, -212, 150, 2, 22, S(2.2)); cd.circle(240, -206, 18, S(1.6));
      R(cd, x0, y0, w, h, 12, { fill: 'rgba(255,255,255,.05)', sw: 2, stroke: C.soft });
      reveal(p, c, X, x0 + w / 2, y0 + h / 2 - 6, 130, null, { halo: 84 });
      const cl = clipG(cd, x0, y0, w, h); for (let i = 0; i < n; i++) { const g = sub(cl); on(g, p, 0, { o: [[0, 1], [tk(i) - tu(.04), 1], [tk(i), 0]] }); R(g, x0 + i * w / n - 1, y0, w / n + 2, h, 0, { fill: 'rgba(255,255,255,.22)', sw: 0, stroke: 'none' }); }
      const strip = px2 => Math.max(0, Math.min(n - 1, Math.floor((px2 - x0) / (w / n))));
      [[[x0, y0], [x0 + 90, y0], [x0 + 60, y0 + 26], [x0 + 14, y0 + 40], [x0, y0 + 70]], [[x0 + w, y0 + h], [x0 + w - 120, y0 + h], [x0 + w - 70, y0 + h - 30], [x0 + w - 20, y0 + h - 44], [x0 + w, y0 + h - 90]], [[x0 + w - 70, y0], [x0 + w, y0], [x0 + w, y0 + 30], [x0 + w - 36, y0 + 18]], [[x0, y0 + h - 40], [x0 + 30, y0 + h - 20], [x0 + 60, y0 + h], [x0, y0 + h]]]
        .forEach(pts => { const g = sub(cd); on(g, p, 0, { o: [[0, 0], [tk(strip(Math.min(...pts.map(q => q[0])))) - tu(.04), 0], [tk(strip(Math.min(...pts.map(q => q[0])))) - tu(.035), 1]] }); shape(g, pts, { fill: 'rgba(255,255,255,.22)', sw: 1.6 }); });
      labAt(p, X, -20, 140, { maxW: 360, size: 32 });
      [[-170, 200, 4], [-130, 214, 3], [-60, 206, 5], [10, 222, 3], [90, 204, 4], [150, 218, 3]].forEach(([a, b, r], i) => { const g = popAt(cd, a, b, tk(Math.min(n - 1, i + 1))); g.circle(a, b, r, { fill: 'rgba(255,255,255,.4)', sw: 1 }); });
      const KX = [[0, 260], [tu(.15), 260], [tu(.4), -6, 'out'], [tu(.5), 0, 'soft'], [tS - tu(.2), 0], [tS, -440, 'io']], KY = [[0, 0], [tS - tu(.2), 0], [tS, -200, 'io']];
      for (let i = 0; i < n; i++) { const t = tk(i); KX.push([t, -440 + (i + 1) * (w / n) - 20]); KY.push([t - (tE - tS) / n / 2, i % 2 ? -260 : -120], [t, i % 2 ? -120 : -260]); }
      KX.push([tE + tu(.3), 0, 'io']); KY.push([tE + tu(.3), 0, 'io']);
      const sg = mvG(p, { px: 330, py: 160, x: KX, y: KY, o: fadeIn(tu(.15)), r: [[0, 0], [tS - tu(.2), 0], [tS, 12, 'io'], [tE, 12], [tE + tu(.3), 0, 'io']] }), sr = rot(sg, -28, 330, 160);
      R(sr, 250, 130, 200, 60, 16, F(3.2)); R(sr, 250, 130, 46, 60, 12, F(2.6)); [0, 1, 2].forEach(k2 => sr.line(320 + k2 * 30, 146, 320 + k2 * 30, 174, S(1.6)));
    }); });

  /* 20 ── THREE CUPS (replaces "a finger on the lips"): the table rises and the cups come down on it; they shuffle side to side, then the
     middle one is lifted and tipped back — the secret was under it */
  variant('cups', 'ถ้วยคว่ำสามใบ', (d, c) => { const X = st(d), T = TL(), H = T.H, T0 = T.T0, ty = 250, xs = [-300, 0, 300], up = 1;
    const cup = (q, x, y) => { shape(q, [[x - 105, y], [x + 105, y], [x + 68, y - 190], [x - 68, y - 190]], F(3.4)); R(q, x - 112, y - 22, 224, 22, 8, F(2.8)); ell(q, x, y - 190, 68, 12, F(2.6)); q.line(x - 88, y - 100, x + 88, y - 100, S(1.4)); };
    art(c, p => { const tb = inG(p, 'rise', 0, ty, tu(.02)); R(tb, -460, ty, 920, 26, 8, F(3)); [-420, 420].forEach(x => R(tb, x - 10, ty + 26, 20, 60, 4, F(2.4)));
      ell(tb, xs[up], ty - 4, 104, 14, { fill: 'rgba(255,255,255,.05)', sw: 1.4, stroke: C.soft });
      const sh = (sd, i) => [[0, 0], [T0 - tu(.5), 0], [T0 - tu(.34), sd * 34, 'io'], [T0 - tu(.18), -sd * 22, 'io'], [T0 - tu(.04), 0, 'io']];
      xs.forEach((x, i) => { if (i === up) return; cup(mvG(inG(p, 'drop', x, ty - 100, tu(.16 + .08 * i)), { x: sh(i ? -1 : 1, i) }), x, ty); });
      reveal(p, c, X, xs[up], ty - 80, 130, null, { halo: 96 });
      const lift = mvG(p, { px: xs[up], py: -80, o: fadeIn(tu(.12)),
        x: [[0, -40], [T0 + tu(.12), -40], [H - tu(.14), 4, 'out'], [H - tu(.02), 0, 'soft']],
        y: [[0, 230], [tu(.12), 230], [tu(.3), 310, 'in'], [tu(.36), 302, 'out'], [tu(.42), 310, 'soft'], [T0 - tu(.3), 310], [T0 - tu(.2), 300, 'out'], [T0 - tu(.1), 310, 'in'], [T0 + tu(.12), 310], [T0 + tu(.2), 316, 'in'], [H - tu(.14), -8, 'out'], [H - tu(.02), 0, 'soft']],
        r: [[0, -16], [T0 + tu(.2), -16], [H - tu(.14), 3, 'out'], [H - tu(.02), 0, 'soft']] });
      cup(rot(lift, 16, xs[up], -80), xs[up] + 40, -60);
      labAt(p, X, xs[up], 320, { maxW: 360, size: 32 });
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
