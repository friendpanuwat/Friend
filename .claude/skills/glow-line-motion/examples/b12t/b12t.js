/* b12t.js — template ชุดฐาน category B12 "เหตุ → ผล" (user 2026-11-17: "ทำ template ชุดฐาน หมวด B12 ได้ ทำ 25 อัน แต่ละอันห้ามหน้าตาเหมือนกัน 100%
   แต่หน้าตาคล้ายกันได้ และที่สำคัญที่สุดห้ามก๊อปหน้าตาของหมวดอื่นมาเด็ดขาด (แต่สามารถคล้ายได้)"): 25 designs; in every one the first thing CAUSES the
   next — it hits, pushes, lights, pulls, fills, sparks, presses the next one, which then does the same — and on the keyword the last one (the effect)
   happens; the end sign stamps after. Not steps someone takes (B04) and not time passing (B09): the force goes from one to the next.
   Graphic parts only (icon slots, wires, rings, beams, discs, columns, vessels, people) — no real things. Header = b10t.js header (b09t header + the
   B10T people / words helpers). Icon slots ≥ 165, words ≥ 40, parts kept together (rule 34), colours from the theme.
   GL.cats.B12T.draw(i, data, { x, y, s, at, hit }) — canvas 1000 × 700 centred at (0,0).
   Data = CutPack B12 (cat_ai.py: "cause → effect — one thing leads to the next, step by step"): items [THING ×3] (the links in order; 1–4 taken,
   like B12) · end THING (the sign of the result, optional). No items → two unnamed dashed links before the end. */
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
    cp.id = 'b12tclip' + (++CID); Object.entries({ x, y, width: w, height: h }).forEach(([k, v]) => r.setAttribute(k, v)); cp.appendChild(r);
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
    if (!ICLIP[k] || !svg.contains(ICLIP[k].cp)) { const cp = document.createElementNS(NS, 'clipPath'), r = document.createElementNS(NS, 'rect'); cp.id = 'b12ticlip' + (++CID);
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
    dr(g, ph ? DASHB() : F(4)); if (o.lit !== false) dr(litOn(g, tf), LITS());
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

  /* 01 KNOCK (ชนต่อกัน): the first box slides in and knocks the next, which slides on and knocks the next … */
  variant('knock', 'ชนต่อกัน', (d, c) => { art(c, p => { const Q = CQ(d), n = Q.n, s = f1(SZn(n) * (n <= 3 ? 1.1 : 1)), D = n >= 5 ? 26 : 40, xs = xsRow(n, s + D), y = -30;
    xs.forEach((x, i) => { const tA = i ? Q.tF(i - 1) : f3(Q.T0 - tu(.34)), tB = Q.tF(i), d0 = i ? -D : -D - 80;
      const K = { px: x, py: y, x: [[0, d0], [tA, d0], [tB, 0, i ? 'out' : 'in']] }, g = mvG(CL(p), Object.assign({ o: fadeIn(Q.tI(i), .1) }, K));
      node(p, c, Q, i, x, y, s, { g, mv: K, it: f3(Q.tI(i) + tu(.04)) }); labAt(p, Q, i, x, y, s, 'below', { maxW: Math.min(330, s + D - 12) }); }); }); });

  /* 02 OVERFLOW (ล้นไปต่อ): boxes step down; the top one fills up and spills into the next, which fills and spills on … */
  variant('overflow', 'ล้นไปต่อ', (d, c) => { art(c, p => { const Q = CQ(d), n = Q.n, s = SZn(n), W = [0, 0, 520, 640, 720, 760][n], y0 = -330 + s / 2 + 8, y1 = 222 - s / 2;
    const P = Array.from({ length: n }, (_, i) => [lin(-W / 2, W / 2, n, i), lin(y0, y1, n, i)]), dx = n > 1 ? P[1][0] - P[0][0] : 600, mw = Math.min(340, 2 * (dx - s / 2 - 14));
    for (let i = 0; i < n - 1; i++) { const [x, y] = P[i], [x2, y2] = P[i + 1], a = [f1(x + s / 2 - 2), f1(y - s / 2 + 30)], b = [x2, f1(y2 - s / 2 - 8)], dd = `M ${a[0]} ${a[1]} Q ${f1(x2 - 4)} ${a[1]} ${b[0]} ${b[1]}`;
      way(p, dd, Q.tI(i + 1), tu(.3), 3, .35); litP(p, dd, Q.tF(i), f3(Q.tF(i) + tu(.2)), 6, 'out'); }
    P.forEach(([x, y], i) => { const g = node(p, c, Q, i, x, y, s), ta = i ? f3(Q.tF(i - 1) + tu(.16)) : f3(Q.T0 - tu(.42)), m = 12;
      const fg = mvG(clipG(g, x - s / 2 + m, y - s / 2 + m, s - 2 * m, s - 2 * m), { px: x, py: y + s / 2 - m, sy: [[0, 0], [ta, 0], [Q.tF(i), 1, 'io']] });
      R(fg, x - s / 2 + m, y - s / 2 + m, s - 2 * m, s - 2 * m, f1(s * .24 - m), { fill: TA(.26), sw: 0, stroke: 'none' }); labAt(p, Q, i, x, y, s, 'below', { maxW: mw }); }); }); });

  /* 03 PRESS (กดต่อกัน): each box stands raised on its base; pressed down, it sends the press along to the next base */
  variant('press', 'กดต่อกัน', (d, c) => { art(c, p => { const Q = CQ(d), n = Q.n, s = SZn(n), xs = spanX(n, s), y = -40, lip = 24, dp = 18, yw = f1(y + s / 2 + lip / 2);
    for (let i = 0; i < n - 1; i++) { const dd = polyD([[f1(xs[i] + s / 2), yw], [f1(xs[i + 1] - s / 2), yw]]); way(p, dd, Q.tI(i + 1), tu(.2), 4, .4); litP(p, dd, f3(Q.tF(i) + tu(.04)), Q.tF(i + 1), 5); }
    xs.forEach((x, i) => { R(popAt(p, x, y + lip, Q.tI(i)), x - s / 2, y + lip - s / 2, s, s, f1(s * .24), F(3));
      const K = { px: x, py: y, y: [[0, -dp], [f3(Q.tF(i) - tu(.1)), -dp], [Q.tF(i), 0, 'in']] }, g = mvG(CL(p), Object.assign({ o: fadeIn(Q.tI(i), .1) }, K));
      node(p, c, Q, i, x, y, s, { g, mv: K, it: f3(Q.tI(i) + tu(.04)) }); labAt(p, Q, i, x, y + lip, s, 'below', { maxW: lwRow(xs) }); }); }); });

  /* 04 SNAP (เสียบต่อกัน): each box has a knob and a notch; the next one slides in and clicks onto it, and on … */
  const snapD = (x, y, s, nub, notch) => { const l = f1(x - s / 2), t = f1(y - s / 2), r = f1(s * .2), Rr = f1(x + s / 2), b = f1(y + s / 2), k = f1(s * .15);
    let dd = `M ${f1(l + r)} ${t} L ${f1(Rr - r)} ${t} Q ${Rr} ${t} ${Rr} ${f1(t + r)}`; if (nub) dd += ` L ${Rr} ${f1(y - k)} A ${k} ${k} 0 0 1 ${Rr} ${f1(y + k)}`;
    dd += ` L ${Rr} ${f1(b - r)} Q ${Rr} ${b} ${f1(Rr - r)} ${b} L ${f1(l + r)} ${b} Q ${l} ${b} ${l} ${f1(b - r)}`; if (notch) dd += ` L ${l} ${f1(y + k)} A ${k} ${k} 0 0 0 ${l} ${f1(y - k)}`;
    return dd + ` L ${l} ${f1(t + r)} Q ${l} ${t} ${f1(l + r)} ${t} Z`; };
  variant('snap', 'เสียบต่อกัน', (d, c) => { art(c, p => { const Q = CQ(d), n = Q.n, s = SZn(n), xs = xsRow(n, s), y = -10, D = n >= 4 ? 44 : 60;
    xs.forEach((x, i) => { const K = i ? { px: x, py: y, x: [[0, D * i], [Q.tF(i - 1), D * i], [Q.tF(i), 0, 'in']] } : null, g = K ? mvG(CL(p), Object.assign({ o: fadeIn(Q.tI(i), .1) }, K)) : null;
      node(p, c, Q, i, x, y, s, Object.assign({ draw: (q, st) => q.path(snapD(x, y, s, i < n - 1, i > 0), st) }, K ? { g, mv: K, it: f3(Q.tI(i) + tu(.04)) } : {}));
      labAt(p, Q, i, x, y, s, i % 2 ? 'above' : 'below', { maxW: lwAlt(xs) }); }); }); });

  /* 05 ROLL (กลิ้งต่อ): a ball drops on the first box, rolls across its top and jumps on to the next, lighting each box it rolls over */
  variant('roll', 'กลิ้งต่อ', (d, c) => { art(c, p => { const Q = CQ(d), n = Q.n, s = SZn(n), xs = spanX(n, s), y = 70, r = 20, top = f1(y - s / 2 - r - 2), e = f1(s * .3);
    const S = [{ pts: Array.from({ length: 9 }, (_, k) => [f1(xs[0] - e), f1(top - 300 * (1 - (k / 8) * (k / 8)))]), t0: f3(Q.T0 - tu(.3)), t1: Q.T0 }];
    for (let i = 0; i < n - 1; i++) { const t0 = Q.tF(i), t1 = Q.tF(i + 1), tm = f3(lerp(t0, t1, .45)), a = [f1(xs[i] + e), top], b = [f1(xs[i + 1] - e), top];
      S.push({ pts: [[f1(xs[i] - e), top], a], t0, t1: tm }, { pts: qP(a, [f1((a[0] + b[0]) / 2), f1(top - 110)], b, 12), t0: tm, t1 }); }
    S.push({ pts: [[f1(xs[n - 1] - e), top], [xs[n - 1], top]], t0: Q.H, t1: f3(Q.H + tu(.3)) });
    const fin = [xs[n - 1], top]; orb(p, [fin], S[0].t0, f3(Q.H + tu(.3)), r, { K: trackK(S, fin), clip: true, keep: true, in: S[0].t0 });
    xs.forEach((x, i) => { node(p, c, Q, i, x, y, s); labAt(p, Q, i, x, y, s, 'below', { maxW: lwRow(xs) }); }); }); });

  /* 06 PRESENTER (คนชี้แผนผัง): a person stands by a board and points at it; on the board the arrows light from one box to the next */
  variant('presenter', 'คนชี้แผนผัง', (d, c) => { art(c, p => { const Q = CQ(d), n = Q.n, px = -378, fy = 330, k = .95;
    const bg = mvG(CL(p), rK(110, 0, tu(.04), 60)); R(bg, -262, -318, 744, 636, 40, F(4));
    let P, s, sides; if (n <= 3) { s = n === 3 ? 188 : 210; const st = n === 3 ? 236 : 320; P = xsRow(n, st, 110).map(x => [x, -40]); sides = P.map(() => 'below'); }
    else if (n === 4) { s = 175; P = [[-20, -125], [240, -125], [240, 125], [-20, 125]]; sides = ['above', 'above', 'below', 'below']; }
    else { s = 168; P = [[-110, -125], [110, -125], [330, -125], [330, 125], [110, 125]]; sides = ['above', 'above', 'above', 'below', 'below']; }
    for (let i = 0; i < n - 1; i++) { const [x, y] = P[i], [x2, y2] = P[i + 1], hz = y === y2, sg = hz ? Math.sign(x2 - x) : Math.sign(y2 - y), a = hz ? [f1(x + sg * (s / 2 + 10)), y] : [x, f1(y + sg * (s / 2 + 10))], b = hz ? [f1(x2 - sg * (s / 2 + 22)), y] : [x, f1(y2 - sg * (s / 2 + 22))];
      way(p, polyD([a, b]), Q.tI(i + 1), tu(.25), 4, .4); litP(p, polyD([a, b]), Q.tF(i), f3(Q.tF(i + 1) - tu(.04)), 5); arrowHead(litOn(p, f3(Q.tF(i + 1) - tu(.06))), b[0], b[1], hz ? (sg > 0 ? 0 : 180) : (sg > 0 ? 90 : -90), .55); }
    P.forEach(([x, y], i) => { node(p, c, Q, i, x, y, s); labAt(p, Q, i, x, y, s, sides[i], { maxW: n <= 3 ? 220 : 230 }); });
    const J = fig(p, px, fy, k, { g: inF(p, px, fy, k, tu(.1)), pose: { arms: { 1: UPV(1) } } }); armKeys(J, p, 1, UPV(1), FARM(1), toFin(f3(Q.T0 - tu(.4)), f3(Q.T0 - tu(.05)))); }); });

  /* 07 NUDGE (ขยับต่อกัน): each box, when reached, is shoved a step on — the dashed place it left stays behind it */
  variant('nudge', 'ขยับต่อกัน', (d, c) => { art(c, p => { const Q = CQ(d), n = Q.n, s = SZn(n), xs = spanX(n, s), y = -20, D = n >= 5 ? 26 : 40;
    xs.forEach((x, i) => { const tf = Q.tF(i); R(atG(p, f3(tf + tu(.02))), f1(x - D - s / 2), f1(y - s / 2), s, s, f1(s * .24), Object.assign({ fill: 'none' }, DASH(.5), { sw: 3 }));
      const K = { px: x, py: y, x: [[0, -D], [tf, -D], [f3(tf + tu(.16)), 0, 'out']] }, g = mvG(CL(p), Object.assign({ o: fadeIn(Q.tI(i), .1) }, K));
      node(p, c, Q, i, x, y, s, { g, mv: K, it: f3(Q.tI(i) + tu(.04)) }); labAt(p, Q, i, x, y, s, 'below', { maxW: lwRow(xs) }); }); }); });

  /* 08 SWING (แกว่งชนต่อ): boxes hang touching side by side, like a row of pendulums. The first is held out, let go — it falls in on a real pendulum
     curve (θ = A·cos) and knocks the row; the knock runs through the still boxes (each lights, a tiny shiver) and the last one flies out, swings back,
     knocks the row again, the first flies out less … each round smaller until all hang still. User: "ทำให้ 08 สมูทกว่านี้" → "ทำให้ดีๆกว่านี้มันยังไม่สมจริงอะ":
     angles are sampled from the pendulum curve every frame (no eased in/out keys), the hit moments line up, the swings die down. */
  const pendK = (a0, segs) => { const K = [[0, a0]]; segs.forEach(([t0, t1, f]) => { const m = Math.max(4, Math.round((t1 - t0) * 40)); for (let j = 1; j <= m; j++) K.push([f3(lerp(t0, t1, j / m)), f1(f(j / m))]); }); return K; };
  variant('swing', 'แกว่งชนต่อ', (d, c) => { art(c, p => { const Q = CQ(d), n = Q.n, s = SZn(n), xs = xsRow(n, s + 4), yp = -318, Ls = 250, y = f1(yp + Ls + s / 2), H = Q.H, q = tu(.3), Ti = f3(H - tu(.12)), A = 30;
    const tl = i => f3(lerp(Ti, H, i / Q.L)), hits = [Ti, f3(H + 2 * q), f3(H + 4 * q), f3(H + 6 * q)], amp = [24, 10, 4];
    const out = (t0, a) => [t0, f3(t0 + 2 * q), u => a * Math.sin(Math.PI * u)];   /* out and back: half a swing */
    const rK = i => { if (!i) return pendK(A, [[f3(Ti - q - tu(.02)), f3(Ti - q), () => A], [f3(Ti - q), Ti, u => A * Math.cos(Math.PI / 2 * u)], [Ti, hits[1], () => 0], out(hits[1], amp[1])]);
      if (i === Q.L) return pendK(0, [[f3(H - tu(.02)), H, () => 0], out(H, -amp[0]), [hits[1], hits[2], () => 0], out(hits[2], -amp[2])]);
      const K = [[0, 0]]; hits.slice(0, 3).forEach((t, k) => { const tt = k ? t : tl(i), a = [.9, .5, .25][k]; K.push([tt, 0], [f3(tt + tu(.05)), -a, 'out'], [f3(tt + tu(.16)), a * .4, 'io'], [f3(tt + tu(.26)), 0, 'io']); }); return K; };
    xs.forEach((x, i) => { atG(p, Q.tI(i)).circle(x, yp, 9, { fill: C.soft, sw: 0, stroke: 'none' });
      const K = { px: x, py: yp, r: rK(i) }, g = mvG(CL(p), Object.assign({ o: fadeIn(Q.tI(i), .1) }, K)); g.line(x, yp, x, f1(y - s / 2), { sw: 3, stroke: TL_(.55) });
      node(p, c, Q, i, x, y, s, { g, mv: K, tf: i === Q.L ? H : tl(i), it: f3(Q.tI(i) + tu(.04)), rip: false }); labAt(p, Q, i, x, y, s, 'below', { maxW: Math.min(330, s + 4) }); }); }); });

  /* 09 GROW (ใหญ่ขึ้นทีละทอด): each box stands in front of the one before and is bigger; reached, it grows out of the last one's size */
  variant('grow', 'ใหญ่ขึ้นทีละทอด', (d, c) => { art(c, p => { const Q = CQ(d), n = Q.n, mx = [0, 0, 300, 285, 240, 225][n], mn = [0, 0, 220, 190, 165, 165][n], ss = Array.from({ length: n }, (_, i) => lin(mn, mx, n, i)), ov = 30, yb = 150;
    let x0 = -(ss.reduce((a, v) => a + v, 0) - ov * (n - 1)) / 2; const P = ss.map(s => { const x = f1(x0 + s / 2); x0 += s - ov; return x; });
    P.forEach((x, i) => { const s = ss[i], y = f1(yb - s / 2), k0 = i ? f3(ss[i - 1] / s) : 1, K = { px: x, py: yb, s: [[0, k0], [f3(Q.tF(i) - tu(.22)), k0], [Q.tF(i), 1, 'out']] };
      const g = mvG(popAt(p, x, y, Q.tI(i)), K); node(p, c, Q, i, x, y, s, { g, mv: i ? K : undefined }); labAt(p, Q, i, x, y, s, i % 2 ? 'above' : 'below', { maxW: Math.min(330, 2 * s - 60) }); }); }); });

  /* 10 SWITCH (สับสวิตช์ต่อ): under each box a wire runs to the next through a switch; the switch closes, the current reaches the next box */
  variant('switch', 'สับสวิตช์ต่อ', (d, c) => { art(c, p => { const Q = CQ(d), n = Q.n, s = SZn(n), xs = spanX(n, s), y = -60, yb = f1(y + s / 2), yt = f1(yb + 110);
    for (let i = 0; i < n - 1; i++) { const a = f1(xs[i] + s * .24), b = f1(xs[i + 1] - s * .24), m = f1((a + b) / 2), l = f1(m - 24), r = f1(m + 24), t0 = Q.tF(i), t1 = Q.tF(i + 1), u = k => f3(lerp(t0, t1, k));
      const A = polyD([[a, yb], [a, yt], [l, yt]]), B = polyD([[r, yt], [b, yt], [b, yb]]), w = atG(p, Q.tI(i + 1)); w.path(A, { sw: 4, stroke: TL_(.45) }); w.path(B, { sw: 4, stroke: TL_(.45) });
      [l, r].forEach(x => w.circle(x, yt, 8, { fill: C.fill, sw: 3, stroke: C.soft }));
      litP(p, A, t0, u(.35), 5, 'lin'); const bl = mvG(p, { px: l, py: yt, r: [[0, -38], [u(.35), -38], [u(.5), 0, 'in']] }); atG(bl, Q.tI(i + 1)).line(l, yt, r, yt, { sw: 5, stroke: C.ink }); litOn(bl, u(.5)).line(l, yt, r, yt, { sw: 5, stroke: ACC1 });
      litP(p, B, u(.5), t1, 5, 'lin'); }
    xs.forEach((x, i) => { node(p, c, Q, i, x, y, s); labAt(p, Q, i, x, y, s, 'above', { maxW: lwRow(xs) }); }); }); });

  /* 11 LINKS (ห่วงโซ่): chain links hold each box to the next; the light runs ring by ring along the chain */
  variant('links', 'ห่วงโซ่', (d, c) => { art(c, p => { const Q = CQ(d), n = Q.n, s = SZn(n), xs = spanX(n, s), y = -20;
    const chain = []; for (let i = 0; i < n - 1; i++) { const a = xs[i] + s / 2 - 26, b = xs[i + 1] - s / 2 + 26, tot = b - a, k = Math.max(1, Math.round((tot - 110) / 74) + 1), stp = k > 1 ? (tot - 110) / (k - 1) : 0;
      for (let j = 0; j < k; j++) chain.push({ i, j, k, x: f1(k > 1 ? a + 55 + j * stp : (a + b) / 2) }); }
    xs.forEach((x, i) => node(p, c, Q, i, x, y, s));
    chain.forEach(({ i, j, k, x }) => { const t = Q.tI(i + 1), tl = f3(lerp(Q.tF(i), Q.tF(i + 1), (j + 1) / (k + 1))), g = popAt(p, x, y, t), flat = j % 2 === 0;
      const dr = (q, st) => flat ? R(q, x - 55, y - 26, 110, 52, 26, st) : R(q, x - 55, y - 8, 110, 16, 8, st);
      dr(g, flat ? { fill: 'none', sw: 15, stroke: C.fill } : BK); dr(g, flat ? { fill: 'none', sw: 9, stroke: TL_(.55) } : { fill: TL_(.55), sw: 0, stroke: 'none' }); dr(litOn(g, tl), flat ? { fill: 'none', sw: 9, stroke: ACC1 } : { fill: ACC1, sw: 0, stroke: 'none' }); });
    xs.forEach((x, i) => labAt(p, Q, i, x, y, s, 'below', { maxW: lwRow(xs) })); }); });

  /* 12 TUBE (ส่งผ่านท่อ): the boxes sit in a tube; a push runs through it from the back, and at the mouth the effect is shot out */
  variant('tube', 'ส่งผ่านท่อ', (d, c) => { art(c, p => { const Q = CQ(d), n = Q.n, m = n - 1, s = m <= 2 ? 220 : Math.min(SZn(n), 190), se = m <= 2 ? 205 : 172, gp = m >= 4 ? 14 : 24, th = s + 34, y = -30;
    const tW = m * (s + gp) - gp + 40, gE = n <= 3 ? 150 : 34, tot = tW + gE + se, x0 = f1(-tot / 2), xs = Array.from({ length: m }, (_, i) => f1(x0 + 20 + s / 2 + i * (s + gp))), ex = f1(x0 + tW + gE + se / 2), xe = f1(x0 + tW);
    const tg = mvG(CL(p), rK(0, y, tu(.04), 50)); R(tg, x0, y - th / 2, tW, th, th / 2, F(4));
    { const cg = clipG(tg, x0 + 6, y - th / 2 + 6, tW - 12, th - 12), K = [[0, f1(x0 - 40)], [f3(Q.T0 - tu(.2)), f1(x0 - 40)]].concat(xs.map((x, i) => [Q.tF(i), x, i ? 'lin' : 'in']), [[f3(Q.tF(m - 1) + tu(.16)), f1(xe + 30), 'lin']]);
      R(mvG(cg, { x: K, o: [[0, 0], [f3(Q.T0 - tu(.2)), 0], [f3(Q.T0 - tu(.1)), 1]] }), -24, y - th / 2 + 8, 48, th - 16, 20, { fill: TA(.35), sw: 0, stroke: 'none' }); }
    xs.forEach((x, i) => { node(p, c, Q, i, x, y, s); const up = i % 2 === 0; labAt(p, Q, i, x, f1(up ? y - th / 2 + s / 2 - 14 : y + th / 2 - s / 2 + 14), s, up ? 'above' : 'below', { maxW: m > 1 ? Math.min(330, 2 * (s + gp) - 30) : 330 }); });
    const tf0 = Q.tF(m - 1), K = { px: ex, py: y, x: [[0, f1(xe - ex)], [tf0, f1(xe - ex)], [Q.H, 0, 'out']], s: [[0, .5], [tf0, .5], [Q.H, 1, 'out']] }, eg = mvG(CL(p), Object.assign({ o: fadeIn(tf0, .06) }, K));
    node(p, c, Q, m, ex, y, se, { g: eg, mv: K, it: tf0 }); { const g = atG(p, Q.H); [-34, 0, 34].forEach(dy => g.line(f1(ex - se / 2 - 18), f1(y + dy), f1(ex - se / 2 - 18 - (dy ? 30 : 50)), f1(y + dy), { sw: 4, stroke: TL_(.6) })); }
    labAt(p, Q, m, ex, y, se, 'below', { maxW: 300 }); }); });

  /* 13 CARD ROW (การ์ดดันขึ้น): the cards wait low and pale; each one, when the one before it rises, is pushed up full and lit */
  variant('cardrow', 'การ์ดดันขึ้น', (d, c) => { art(c, p => { const Q = CQ(d), n = Q.n, gp = 24, w = f1(Math.min(250, (940 - gp * (n - 1)) / n)), h = n >= 4 ? 340 : 380, y = -10, xs = xsRow(n, w + gp), D = 80;
    xs.forEach((x, i) => { const tR = i ? Q.tF(i - 1) : f3(Q.T0 - tu(.3)), tB = Q.tF(i), yk = [[0, D], [tR, D], [tB, 0, 'out']], ok = [[0, 0], [Q.tI(i), 0], [f3(Q.tI(i) + tu(.1)), .42], [tR, .42], [f3(tR + tu(.12)), 1]];
      const K = { px: x, py: y, y: yk }, g0 = mvG(CL(p), Object.assign({ o: ok }, K)), g = mvG(g0, { px: x, py: y, s: bumpK(tB, 1.04) }), X = Q.N[i], ph = !has(X), l = x - w / 2, t = y - h / 2;
      R(g, l, t, w, h, 30, ph ? DASHB() : F(4)); R(litOn(g, tB), l, t, w, h, 30, LITS());
      const str = Q.LB(i), iy = str ? f1(y - h * .16) : y; if (ph) { if (i === Q.L) star4(litOn(g, tB), x, y, 40, DOTF()); else g.circle(x, y, 14, { fill: C.soft, sw: 0, stroke: 'none' }); }
      else put(p, c, X, x, iy, f1(picOf(X) ? Math.min(150, w * .64) : w * .9), null, { t: f3(Q.tI(i) + tu(.04)), mv: K, o: ok, punch: tB, bigW: f1(w * .8) });
      if (str) txt(g, str, x, f1(y + h * .28), { size: 44, maxW: w - 34, weight: 800, color: i === Q.L ? ACC1 : C.ink, wrap: 'mid' });
      if (i < n - 1) arrowHead(litOn(p, Q.tF(i)), f1(x + w / 2 + gp / 2), y, 0, .4); }); }); });

  /* 14 BIG EFFECT (ผลใหญ่ข้างล่าง): the causes run along the top; the last one sends it round and down into a big card — the effect */
  variant('bigeffect', 'ผลใหญ่ข้างล่าง', (d, c) => { art(c, p => { const Q = CQ(d), n = Q.n, m = n - 1, s = m >= 4 ? 165 : m === 3 ? 180 : 190, y = -205, st = m > 1 ? Math.min(s + 170, (800 - s) / (m - 1)) : 0, xs = xsRow(m, st, -70);
    for (let i = 0; i < m - 1; i++) { const dd = polyD([[f1(xs[i] + s / 2 + 6), y], [f1(xs[i + 1] - s / 2 - 6), y]]); way(p, dd, Q.tI(i + 1), tu(.2), 4, .4); litP(p, dd, Q.tF(i), Q.tF(i + 1), 5); }
    const ex0 = f1(xs[m - 1] + s / 2 + 6), bend = 430, cy0 = 40, ch = 280, eL = [[ex0, y], [bend - 30, y], [bend, y + 30], [bend, cy0 - 26]];
    way(p, polyD(eL), Q.tI(m), tu(.3), 4, .4); litP(p, polyD(eL), Q.tF(m - 1), f3(Q.H - tu(.04)), 5); arrowHead(litOn(p, f3(Q.H - tu(.06))), bend, cy0 - 26, 90, .65);
    xs.forEach((x, i) => { node(p, c, Q, i, x, y, s); labAt(p, Q, i, x, y, s, 'below', { maxW: m > 1 ? Math.min(330, st - 14) : 330 }); });
    const cg = mvG(CL(p), rK(0, cy0 + ch / 2, Q.tI(m), 60)); R(cg, -446, cy0, 892, ch, 40, F(4)); R(litOn(cg, Q.H), -446, cy0, 892, ch, 40, LITS());
    const str = Q.LB(m), se = 200, sx = str ? -280 : 0, sy = f1(cy0 + ch / 2); node(p, c, Q, m, sx, sy, se, { t: Q.tI(m), rip: false });
    if (str) { const L = wsz(p, str, 60, 560); nlab(p, Q, m, f1(sx + se / 2 + 40 + L.w / 2), sy, { size: 60, maxW: 560 }); } }); });

  /* 15 CONE (แสงส่องต่อ): each box, when reached, shines a beam of light onto the next one, which lights and shines on */
  variant('cone', 'แสงส่องต่อ', (d, c) => { art(c, p => { const Q = CQ(d), n = Q.n, s = SZn(n), xs = spanX(n, s), y = -10, cg = CL(p);
    xs.forEach((x, i) => node(p, c, Q, i, x, y, s));
    for (let i = 0; i < n - 1; i++) { const a = f1(xs[i] + s * .36), b = f1(xs[i + 1] + s * .55), hw = f1(s * .6), K = { px: a, py: y, sx: [[0, 0], [Q.tF(i), 0], [f3(Q.tF(i + 1) - tu(.04)), 1, 'out']], o: fadeIn(Q.tF(i), .06) };
      shape(mvG(cg, K), [[a, y - 20], [b, y - hw], [b, y + hw], [a, y + 20]], { fill: TA(.14), sw: 0, stroke: 'none' }); }
    xs.forEach((x, i) => labAt(p, Q, i, x, y, s, i % 2 ? 'above' : 'below', { maxW: lwAlt(xs), g: 48 })); }); });

  /* 16 TURN (หมุนส่งต่อ): wheels touch each other; the first starts to turn and turns the next, which turns the next … */
  variant('turn', 'หมุนส่งต่อ', (d, c) => { art(c, p => { const Q = CQ(d), n = Q.n, s = SZn(n), Rr = s / 2 + 18, dy = n >= 4 ? 76 : 62, dx = f1(Math.sqrt(Math.pow(2 * Rr + 6, 2) - 4 * dy * dy)), xs = xsRow(n, dx), P = xs.map((x, i) => [x, i % 2 ? dy : -dy]);
    P.forEach(([x, y], i) => { const g = popAt(p, x, y, Q.tI(i)), sg = i % 2 ? -1 : 1; g.circle(x, y, Rr, F(3.4));
      const rg = mvG(g, { px: x, py: y, r: [[0, 0], [Q.tF(i), 0], [f3(Q.tF(i) + 4), sg * 480, 'lin']] }); rg.circle(x, f1(y - Rr + 9), 7, { fill: C.soft, sw: 0, stroke: 'none' }); litOn(rg, Q.tF(i)).circle(x, f1(y - Rr + 9), 8, DOTF());
      node(p, c, Q, i, x, y, s, { shape: 'circ', t: f3(Q.tI(i) + tu(.04)) }); labAt(p, Q, i, x, y, s + 36, i % 2 ? 'below' : 'above', { maxW: Math.min(330, 2 * dx - 24) }); }); }); });

  /* 17 ZAP (ไฟช็อตต่อ): a spark jumps from each box to the next, up and over, and makes it light */
  variant('zap', 'ไฟช็อตต่อ', (d, c) => { art(c, p => { const Q = CQ(d), n = Q.n, s = SZn(n), xs = spanX(n, s), P = xs.map((x, i) => { const u = n > 1 ? i / (n - 1) : .5; return [x, n === 2 ? (i ? -40 : 40) : f1(110 - 240 * (1 - Math.abs(2 * u - 1)))]; });
    for (let i = 0; i < n - 1; i++) { const [x, y] = P[i], [x2, y2] = P[i + 1], L = Math.hypot(x2 - x, y2 - y), ux = (x2 - x) / L, uy = (y2 - y) / L, a0 = s / 2 + 6, a1 = L - s / 2 - 6, k = 6;
      const pts = Array.from({ length: k + 1 }, (_, j) => { const u = lerp(a0, a1, j / k), o = j && j < k ? (j % 2 ? 1 : -1) * 20 : 0; return [f1(x + ux * u - uy * o), f1(y + uy * u + ux * o)]; }), dd = polyD(pts);
      way(p, dd, Q.tI(i + 1), tu(.2), 3, .25); const t0 = Q.tF(i), t1 = f3(Q.tF(i) + tu(.12)); litP(mvG(p, { o: [[0, 0], [t0, 0], [f3(t0 + tu(.03)), 1], [f3(t0 + tu(.07)), .35], [t1, 1]] }), dd, t0, t1, 5, 'lin'); }
    P.forEach(([x, y], i) => { node(p, c, Q, i, x, y, s); labAt(p, Q, i, x, y, s, 'below', { maxW: lwRow(xs) }); }); }); });

  /* 18 MORPH (กลายเป็นอันถัดไป): a lit frame moves from box to box; each box it leaves turns into a dashed outline — it became the next one */
  variant('morph', 'กลายเป็นอันถัดไป', (d, c) => { art(c, p => { const Q = CQ(d), n = Q.n, s = SZn(n), xs = spanX(n, s), y = -20;
    xs.forEach((x, i) => { const g0 = popAt(p, x, y, Q.tI(i)); R(g0, x - s / 2, y - s / 2, s, s, f1(s * .24), DASHB());
      if (i === Q.L) { node(p, c, Q, i, x, y, s, { g: g0 }); labAt(p, Q, i, x, y, s, 'below', { maxW: lwRow(xs) }); return; }
      const tL = f3(Q.tF(i + 1) - tu(.02)), it = f3(Q.tI(i) + tu(.04)), fade = [[0, 1], [tL, 1], [f3(tL + tu(.2)), .38]];
      node(p, c, Q, i, x, y, s, { g: mvG(g0, { o: [[0, 1], [tL, 1], [f3(tL + tu(.2)), 0]] }), lit: false, io: [[0, 0], [it, 0], [f3(it + tu(.1)), 1], [tL, 1], [f3(tL + tu(.2)), .38]] });
      labAt(p, Q, i, x, y, s, 'below', { maxW: lwRow(xs), gg: mvG(p, { o: fade }) }); });
    const K = [[0, 0], [Q.T0, 0]]; for (let i = 1; i < n; i++) K.push([f3(Q.tF(i - 1) + tu(.06)), f1(xs[i - 1] - xs[0])], [Q.tF(i), f1(xs[i] - xs[0]), 'io']);
    R(mvG(p, { x: K, o: [[0, 0], [f3(Q.T0 - tu(.06)), 0], [Q.T0, 1]] }), xs[0] - s / 2, y - s / 2, s, s, f1(s * .24), LITS()); }); });

  /* 19 LIFT (ยกขึ้นทีละขั้น): a wave runs under the boxes, getting bigger; each box is lifted by it a step higher than the one before */
  variant('lift', 'ยกขึ้นทีละขั้น', (d, c) => { art(c, p => { const Q = CQ(d), n = Q.n, s = SZn(n), xs = spanX(n, s), dy = n >= 4 ? 52 : 70, y0 = f1(30 + dy * (n - 1) / 2), P = xs.map((x, i) => [x, f1(y0 - dy * i)]);
    const wy = x => { const u = (x + 480) / 960, base = lerp(y0 + s / 2 + 46, y0 - dy * (n - 1) + s / 2 + 46, u); return f1(base + (12 + 22 * u) * Math.sin(u * Math.PI * 2 * (n + .5))); };
    const dd = polyD(Array.from({ length: 97 }, (_, k) => { const x = -480 + k * 10; return [x, wy(x)]; })); way(p, dd, tu(.06), tu(.5), 3, .32); litP(p, dd, f3(Q.T0 - tu(.3)), Q.H, 5, 'lin');
    P.forEach(([x, y], i) => { const tA = f3(Q.tF(i) - tu(.22)), K = { px: x, py: y, y: [[0, 46], [tA, 46], [Q.tF(i), 0, 'out']] }, g = mvG(CL(p), Object.assign({ o: fadeIn(Q.tI(i), .1) }, K));
      node(p, c, Q, i, x, y, s, { g, mv: K, it: f3(Q.tI(i) + tu(.04)) }); labAt(p, Q, i, x, y, s, 'above', { maxW: lwRow(xs) }); }); }); });

  /* 20 PAINT (ระบายต่อ): a wide stroke of colour is brushed along behind the boxes, from the first to the last, lighting each as it passes */
  variant('paint', 'ระบายต่อ', (d, c) => { art(c, p => { const Q = CQ(d), n = Q.n, s = SZn(n), xs = spanX(n, s), y = -10, bh = f1(s * .56), x0 = f1(xs[0] - s / 2 - 26), x1 = f1(xs[n - 1] + s / 2 + 26), W = x1 - x0;
    R(atG(p, tu(.06)), x0, y - bh / 2, W, bh, bh / 2, { fill: 'none', sw: 2.5, stroke: TL_(.3) });
    const cg = clipG(p, x0, y - bh / 2 - 4, W, bh + 8), sk = [[0, 0], [f3(Q.T0 - tu(.2)), 0]].concat(xs.map((x, i) => [Q.tF(i), f3((x - x0) / W), 'io']), [[f3(Q.H + tu(.2)), 1, 'out']]);
    R(mvG(cg, { px: x0, py: y, sx: sk }), x0, y - bh / 2, W, bh, bh / 2, { fill: TA(.24), sw: 0, stroke: 'none' });
    xs.forEach((x, i) => { node(p, c, Q, i, x, y, s); labAt(p, Q, i, x, y, s, i % 2 ? 'above' : 'below', { maxW: lwAlt(xs) }); }); }); });

  /* 21 SHUTTER (เปิดต่อกัน): every box starts shut; the first opens, and its opening opens the next … — the shutters fold away to thin bars */
  variant('shutter', 'เปิดต่อกัน', (d, c) => { art(c, p => { const Q = CQ(d), n = Q.n, s = SZn(n), xs = spanX(n, s), y = -20, pw = s - 8;
    for (let i = 0; i < n - 1; i++) { const dd = polyD([[f1(xs[i] + s / 2 + 4), y], [f1(xs[i + 1] - s / 2 - 4), y]]); litP(p, dd, Q.tF(i), Q.tF(i + 1), 4); }
    xs.forEach((x, i) => { const tf = Q.tF(i); node(p, c, Q, i, x, y, s, { it: tf });
      [-1, 1].forEach(sd => { const ey = f1(y + sd * s / 2), g = mvG(popAt(p, x, y, Q.tI(i)), { px: x, py: ey, sy: [[0, 1], [tf, 1], [f3(tf + tu(.26)), .16, 'io']], y: [[0, 0], [tf, 0], [f3(tf + tu(.26)), sd * 24, 'io']] });
        R(g, f1(x - pw / 2), sd < 0 ? ey : f1(ey - s / 2), pw, f1(s / 2), 18, F(3.4)); });
      labAt(p, Q, i, x, y, s, 'below', { maxW: lwRow(xs), g: 48 }); }); }); });

  /* 22 COLUMN (เรียงลงมาแล้วออกผล): the causes are stacked in one column; the push runs down it and out across to the effect */
  variant('column', 'เรียงลงมาแล้วออกผล', (d, c) => { art(c, p => { const Q = CQ(d), n = Q.n, m = n - 1, s = m >= 3 ? 165 : 200, gy = m >= 4 ? 0 : 18, xc = -120, se = 220, ex = 285;
    const ys = Array.from({ length: m }, (_, i) => f1((i - (m - 1) / 2) * (s + gy))), yl = ys[m - 1], ey = m > 1 ? f1(Math.min(yl, 0)) : 0;
    const eL = [[f1(xc + s / 2 + 6), yl], [f1(ex - 30), yl], [ex, f1(yl - 30)], [ex, f1(ey + se / 2 + 22)]], hz = m <= 2;
    const path = hz ? [[f1(xc + s / 2 + 6), yl], [f1(ex - se / 2 - 24), yl]] : eL; way(p, polyD(path), Q.tI(m), tu(.3), 4, .4); litP(p, polyD(path), Q.tF(m - 1), f3(Q.H - tu(.04)), 5);
    arrowHead(litOn(p, f3(Q.H - tu(.06))), ...path[path.length - 1], hz ? 0 : -90, .6);
    ys.forEach((y, i) => { node(p, c, Q, i, xc, y, s); labAt(p, Q, i, xc, y, s, 'left', { maxW: f1(500 + xc - s / 2 - 36) }); });
    node(p, c, Q, m, ex, hz ? yl : ey, se); labAt(p, Q, m, ex, hz ? yl : ey, se, hz ? 'below' : 'above', { maxW: 330 }); }); });

  /* 23 FUSE (ชนวนลาม): a coiled fuse loops from each box to the next; the spark burns along it and lights the next */
  variant('fuse', 'ชนวนลาม', (d, c) => { art(c, p => { const Q = CQ(d), n = Q.n, s = SZn(n), xs = spanX(n, s), y = 70, top = f1(y - s / 2 + 2);
    for (let i = 0; i < n - 1; i++) { const a = [f1(xs[i] + s * .2), top], b = [f1(xs[i + 1] - s * .2), top], h = 230, c1 = [f1(b[0] + 170), f1(top - h)], c2 = [f1(a[0] - 170), f1(top - h)];
      const dd = `M ${a[0]} ${a[1]} C ${c1[0]} ${c1[1]} ${c2[0]} ${c2[1]} ${b[0]} ${b[1]}`; drawAt(p.path(dd, { sw: 3, stroke: TL_(.45) }), p, Q.tI(i + 1), tu(.35));
      litP(p, dd, Q.tF(i), Q.tF(i + 1), 5, 'lin'); orb(p, cP(a, c1, c2, b), Q.tF(i), Q.tF(i + 1), 11, { lin: true }); }
    xs.forEach((x, i) => { node(p, c, Q, i, x, y, s); labAt(p, Q, i, x, y, s, 'below', { maxW: lwRow(xs) }); }); }); });

  /* 24 PULL (ดึงตามกันมา): lines reach out from each box and pull the next one in to its place */
  variant('pull', 'ดึงตามกันมา', (d, c) => { art(c, p => { const Q = CQ(d), n = Q.n, s = SZn(n), xs = spanX(n, s), y = 40, r = s / 2, D = n >= 5 ? 26 : 60;
    xs.forEach((x, i) => { const K = i ? { px: x, py: y, x: [[0, D], [Q.tF(i - 1), D], [Q.tF(i), 0, 'io']] } : null, g = K ? mvG(CL(p), Object.assign({ o: fadeIn(Q.tI(i), .1) }, K)) : null;
      if (i) [-1, 1].forEach(sd => { const a = [f1(xs[i - 1] + r), f1(y + sd * r * .45)], b = [f1(x - r), a[1]], dd = `M ${a[0]} ${a[1]} Q ${f1((a[0] + b[0]) / 2)} ${f1(a[1] + sd * 34)} ${b[0]} ${b[1]}`;
        drawAt(p.path(dd, { sw: 3, stroke: TL_(.4) }), p, Q.tI(i), tu(.25)); litP(p, dd, Q.tF(i - 1), f3(Q.tF(i) - tu(.02)), 5); });
      node(p, c, Q, i, x, y, s, K ? { g, mv: K, it: f3(Q.tI(i) + tu(.04)) } : {}); labAt(p, Q, i, x, y, s, 'above', { maxW: lwRow(xs) }); }); }); });

  /* 25 BRACKET (รวบเป็นผล): the causes in a row, one after another; a bracket under them gathers it all and points down to the effect */
  variant('bracket', 'รวบเป็นผล', (d, c) => { art(c, p => { const Q = CQ(d), n = Q.n, m = n - 1, s = m >= 4 ? 165 : m === 3 ? 185 : 200, st = m > 1 ? Math.min(s + 120, (900 - s) / (m - 1)) : 0, xs = xsRow(m, st), y = -205;
    const lh = Math.max(0, ...xs.map((x, i) => Q.LB(i) ? wsz(p, Q.LB(i), 46, m > 1 ? Math.min(330, st - 14) : 330).h : 0)), yb = f1(y + s / 2 + (lh ? lh + 30 : 20)), xl = f1(xs[0] - s / 2), xr = f1(xs[m - 1] + s / 2), se = 190, ey = f1(Math.max(yb + 70 + se / 2, 140));
    const B = [[xl, f1(yb - 22)], [xl, yb], [-28, yb], [0, f1(yb + 26)], [28, yb], [xr, yb], [xr, f1(yb - 22)]], A = [[0, f1(yb + 26)], [0, f1(ey - se / 2 - 18)]];
    way(p, polyD(B), Q.tI(1), tu(.35), 4, .45); litP(p, polyD(B.slice(0, 4)), Q.tF(m - 1), f3(lerp(Q.tF(m - 1), Q.H, .5)), 5); litP(p, polyD(B.slice(3).reverse()), Q.tF(m - 1), f3(lerp(Q.tF(m - 1), Q.H, .5)), 5);
    way(p, polyD(A), Q.tI(m), tu(.2), 4, .45); litP(p, polyD(A), f3(lerp(Q.tF(m - 1), Q.H, .5)), f3(Q.H - tu(.04)), 5); arrowHead(litOn(p, f3(Q.H - tu(.06))), ...A[1], 90, .55);
    xs.forEach((x, i) => { node(p, c, Q, i, x, y, s); labAt(p, Q, i, x, y, s, 'below', { maxW: m > 1 ? Math.min(330, st - 14) : 330 }); });
    node(p, c, Q, m, 0, ey, se); labAt(p, Q, m, 0, ey, se, 'right', { maxW: 300 }); }); });

  /* ---------- sample data (A: sentences from unrelated topics, 1–4 links · B: stress) — the same as B12 ---------- */
  const I = (icon, label) => label ? { icon, label } : { icon };
  const SAMPLES = [
    { say: 'นอนดึก ตื่นสาย เลยตกรถ', items: [I('moon', 'นอนดึก'), I('alarm-clock', 'ตื่นสาย'), I('bus', 'ตกรถ')], end: I('x') },
    { say: 'กดสวิตช์ ไฟก็ติด', items: [I('power', 'กดสวิตช์'), I('lamp', 'ไฟติด')] },
    { say: 'ใส่ใจรายละเอียด งานเลยออกมาดี', items: [I('search', 'ใส่ใจ')], end: I('award', 'งานดี') },
    { say: 'ฝนตก ถนนลื่น รถชนกัน', items: [I('droplets', 'ฝนตก'), I('triangle-alert', 'ถนนลื่น'), I('car', 'รถชน')] },
    { say: 'โพสต์ดี คนแชร์ ยอดวิวพุ่ง ได้งานใหม่', items: [I('video', 'คลิปดี'), I('share-2', 'คนแชร์'), I('eye', 'ยอดวิว'), I('briefcase', 'งานใหม่')] },
    { say: 'ลูกค้าพอใจ บอกต่อ ยอดเพิ่ม', items: [I('smile', 'พอใจ'), I('megaphone', 'บอกต่อ')], end: I('trending-up', 'ยอดเพิ่ม') },
    { say: 'ดื่มน้ำน้อย เลยปวดหัว', items: [I('glass-water', 'ดื่มน้อย'), I('frown', 'ปวดหัว')] },
    { say: 'เก็บเงินได้ ลงทุนต่อ ดอกผลงอกเงย', items: [I('piggy-bank', 'เก็บเงิน'), I('chart-line', 'ลงทุน'), I('coins', 'งอกเงย')], end: I('trending-up') },
    { say: 'ชาร์จครึ่งชั่วโมง ใช้ได้ทั้งวัน', items: [I('plug', 'ชาร์จ'), I('battery-charging', 'ครึ่งชม.')], end: I('zap', 'ทั้งวัน') },
    { say: 'เครียดสะสม ระเบิดออกมา', items: [I('cloud', 'เครียด'), I('triangle-alert', 'สะสม')], end: I('angry', 'ระเบิด') },
    { say: 'พูดดังเกินไป เพื่อนบ้านตกใจ', items: [I('megaphone', 'พูดดัง')], end: I('frown', 'ตกใจ') },
    { say: 'ฝึกทุกวัน มั่นใจขึ้น ได้งาน', items: [I('repeat', 'ฝึกทุกวัน'), I('sparkles', 'มั่นใจ')], end: I('briefcase', 'ได้งาน') },
    { say: 'ลดราคา คนแห่มา ของหมด', items: [I('badge-percent', 'ลดราคา'), I('users', 'คนแห่มา'), I('package-open', 'ของหมด')], end: I('check') },
    { say: 'ทักไปก่อน เขาเลยยอมเปิดใจ', items: [I('message-circle', 'ทักก่อน')], end: I('heart', 'เปิดใจ') },
    { say: 'ตามกระแส ทำตามทุกอย่าง จนไม่เป็นตัวเอง', items: [I('trending-up', 'กระแส'), I('repeat', 'ทำตาม')], end: I('user-x', 'ไม่ใช่ตัวเอง') },
    { say: 'อ่านทุกวัน ความรู้เพิ่ม เขียนได้ สอบผ่าน', items: [I('book-open', 'อ่าน'), I('brain', 'ความรู้'), I('pen-line', 'เขียนได้'), I('graduation-cap', 'สอบผ่าน')] },
    { say: 'ตั้งใจทีละขั้น ผ่านทีละด่าน ถึงเป้า', items: [I('target', 'ตั้งใจ'), I('flag', 'ผ่านด่าน')], end: I('trophy', 'ถึงเป้า') },
    { say: 'เล็ก ๆ ทำทุกวัน กลายเป็นเรื่องใหญ่', items: [I('sprout', 'เล็ก ๆ'), I('leaf', 'ทุกวัน'), I('trees', 'เรื่องใหญ่')] },
    { say: 'ราคาน้ำมันขึ้น ค่าส่งแพง ของแพงตาม', items: [I('droplet', 'น้ำมัน'), I('truck', 'ค่าส่ง'), I('shopping-cart', 'ของแพง')] },
    { say: 'ประกาศออกไป ทุกคนรู้ทันที', items: [I('megaphone', 'ประกาศ')], end: I('users', 'ทุกคนรู้') },
  ];
  const STRESS = [
    { say: 'ไม่มีป้ายเลย', items: [I('zap'), I('cog'), I('house')], end: I('x') },
    { say: 'ป้ายยาว', items: [I('moon', 'นอนดึกทุกคืนเป็นเดือน'), I('battery-low', 'ร่างกายอ่อนเพลียมาก')], end: I('triangle-alert', 'ต้องเข้าโรงพยาบาล') },
    { say: 'ภาษาอังกฤษ', items: [I('code', 'Bug'), I('database', 'Crash'), I('users', 'Users leave')], end: I('trending-down', 'Churn') },
    { say: 'ไม่มีไอคอน (ป้ายแทนภาพ)', items: [{ label: 'เหตุ' }, { label: 'ต่อ' }], end: { label: 'ผล' } },
    { say: 'ทอดเดียว ไม่มี end', items: [I('sprout', 'ปลูก')] },
    { say: 'ชื่อไอคอนที่ไม่มี', items: [I('no-such-icon', 'ตอนแรก'), I('no-such-icon', 'ตอนท้าย')], end: I('no-such-icon') },
    { say: 'ไอคอนซ้ำ ไม่มีป้าย 4 ทอด', items: [I('coins'), I('coins'), I('coins'), I('coins')] },
    { say: 'end มีป้าย', items: [I('dumbbell', 'ออกกำลัง'), I('heart-pulse', 'หัวใจดี'), I('smile', 'อารมณ์ดี')], end: I('check', 'สุขภาพดี') },
    { say: 'สองทอดพอดี', items: [I('cloud', 'ฝน'), I('car', 'รถติด')] },
    { say: 'อังกฤษยาว', items: [I('megaphone', 'Word of mouth'), I('users', 'More customers')], end: I('store', 'Second branch') },
    { say: 'ป้ายสั้นมาก', items: [I('cloud', 'ฝน'), I('droplets', 'ท่วม'), I('car', 'ติด')] },
    { say: 'ตัวเลขในป้าย', items: [I('coins', '100'), I('coins', '1,000'), I('coins', '10,000'), I('coins', '100,000')] },
    { say: 'ป้ายแทนภาพยาว', items: [{ label: 'เปลี่ยนรูปปก' }, { label: 'คนกดดูเพิ่ม' }], end: { label: 'ยอดวิวพุ่ง' } },
    { say: 'end ป้ายอย่างเดียว', items: [I('book-open', 'อ่าน')], end: { label: 'เก่งขึ้น' } },
    { say: 'ไม่มีป้าย ไม่มี end', items: [I('sun'), I('cloud'), I('droplets')] },
    { say: 'ผลร้าย 4 ทอด', items: [I('cigarette-off', 'สูบบุหรี่'), I('heart-crack', 'ปอดพัง'), I('hospital', 'โรงพยาบาล')], end: I('x') },
    { say: 'ทอดเป็นการกระทำ', items: [I('send', 'ส่ง'), I('mail', 'ถึง')], end: I('message-circle', 'ตอบ') },
    { say: 'ทอดเป็นสภาพ', items: [I('thermometer', 'ร้อน'), I('droplets', 'เหงื่อออก'), I('battery-low', 'เพลีย')] },
    { say: 'ไม่มีทอดเลย มีแต่ end', items: [], end: I('check') },
    { say: 'ป้ายผสมไทยอังกฤษ', items: [I('wifi', 'เน็ตล่ม'), I('laptop', 'Zoom หลุด')], end: I('frown', 'ประชุมพัง') },
  ];

  G.cats = G.cats || {};
  G.cats.B12T = { variants: V, SAMPLES, STRESS, theme, draw: (i, d, c) => { setZ(c); CUR = V[i].id; tokens(); EMPTY = false; BLUE = false; V[i].build(d || {}, c); }, CLAMPS, timing: c => (setZ(c), Object.assign({}, Z)) };
})();
