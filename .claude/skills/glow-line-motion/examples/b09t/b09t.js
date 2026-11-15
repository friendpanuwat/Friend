/* b09t.js — template ชุดฐาน category B09 "เวลา / ไทม์ไลน์ / เดดไลน์" (user 2026-11-14: "ผ่านครับ เริ่มหมวดถัดไปได้ อยากให้คงความเป็นการ์ดเอาไว้แต่ไม่ได้
   หมายความว่าทุกอันต้องเหมือนกันไปหมด ไม่อยากให้ซ้ำจำเจ อยากให้สร้างสรรค์ แต่ก็อยากให้คงความเป็นการ์ดเอาไว้"): 50 designs, every one built on CARDS
   (rounded panels — wide, tall, round, ticket, tabbed, stacked, fanned, torn, hanging, sliding …) with its own time mechanism inside; each drawn by
   hand (no shared layout builder). Graphic elements only, our white-glow line style, colours from GL.theme; icon slots ≥ 165, words ≥ 40; no word
   chip top-left, no arrow badge top-right, no floor line, no numbers that are not in the data. Header from b08t.js (calm smooth motion, 'user' → a
   whole-body person). GL.cats.B09T.draw(i, data, { x, y, s, at, hit }) — canvas 1000 × 700 centred at (0,0).
   Data = CutPack B09 (cat_ai.py: "time passing, moments in order, how long something takes"): points [THING ×3] (moments, in order) · at 0–2 (where
   time stops; default 2) · result THING (what the time brought) — points, or result, or both. */
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
    cp.id = 'b09tclip' + (++CID); Object.entries({ x, y, width: w, height: h }).forEach(([k, v]) => r.setAttribute(k, v)); cp.appendChild(r);
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
    if (!ICLIP[k] || !svg.contains(ICLIP[k].cp)) { const cp = document.createElementNS(NS, 'clipPath'), r = document.createElementNS(NS, 'rect'); cp.id = 'b09ticlip' + (++CID);
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


  /* ================= B09T — เวลา / ไทม์ไลน์ (Time / Timeline / Deadline) as a template ชุดฐาน — cards =================
     Story: the card comes in, the moments come in, time runs through them in order — each passed moment lights — and on the keyword H time stops at
     `at` (that moment lit, the ones after stay faint); if the result is reached (at = the last moment, or no moments) it lands lit on H, else it
     waits faint at the end. */
  const TD = d => { const P = (d && Array.isArray(d.points) ? d.points.filter(has) : []).slice(0, 3), R0 = d && has(d.result) ? d.result : null, n = P.length;
    const at = n ? Math.max(0, Math.min(n - 1, d.at == null ? n - 1 : Math.round(+d.at))) : -1, reach = !!R0 && (n === 0 || at === n - 1);
    return { P, R0, n, at, reach }; };
  const TQ = d => { const D = TD(d), H = Z.H, tA = tu(.06), tI = i => f3(tu(.24 + .14 * i)), tP0 = f3(Math.max(tu(.24 + .14 * D.n + .2), H - tu(.95)));
    const steps = []; for (let i = 0; i <= D.at; i++) steps.push(i); if (D.reach) steps.push('r');
    const at = k => steps.length <= 1 ? H : f3(lerp(tP0, H, k / (steps.length - 1)));
    const tPass = i => { const k = steps.indexOf(i); return k < 0 ? null : at(k); };
    return Object.assign({ H, tA, tI, tP0, steps, tPass, tR: D.reach ? H : null }, D); };
  const FAINT = .4;
  /* a card: rounded panel (o.r radius) that comes in by o.in (rise | drop | left | right | pop | flip) at o.t; o.kind: 'plain' | 'header' (a band on
     top) | 'ticket' (side notches) | 'tab' (a folder tab) | 'torn' (zigzag bottom) | 'perf' (dashed tear line at o.perf) — returns its group */
  function crd(p, x, y, w, h, o = {}) { const t = o.t ?? tu(.04), r = o.r ?? 34, l = x - w / 2, tp = y - h / 2, K = o.keys || ent(o.in || 'rise', x, y, Math.max(w, h), t), g = mvG(o.clip === false ? p : CL(p), K);
    let D; if (o.kind === 'ticket') { const nr = o.nr || 28, ny = o.ny ?? y; D = `M ${l + r} ${tp} L ${l + w - r} ${tp} Q ${l + w} ${tp} ${l + w} ${tp + r} L ${l + w} ${ny - nr} A ${nr} ${nr} 0 0 0 ${l + w} ${ny + nr} L ${l + w} ${tp + h - r} Q ${l + w} ${tp + h} ${l + w - r} ${tp + h} L ${l + r} ${tp + h} Q ${l} ${tp + h} ${l} ${tp + h - r} L ${l} ${ny + nr} A ${nr} ${nr} 0 0 0 ${l} ${ny - nr} L ${l} ${tp + r} Q ${l} ${tp} ${l + r} ${tp} Z`; }
    else if (o.kind === 'tab') { const tw2 = o.tw || 200, th = o.th || 50; D = `M ${l + r} ${tp} L ${l + tw2} ${tp} L ${l + tw2 + th} ${tp + th} L ${l + w - r} ${tp + th} Q ${l + w} ${tp + th} ${l + w} ${tp + th + r} L ${l + w} ${tp + h - r} Q ${l + w} ${tp + h} ${l + w - r} ${tp + h} L ${l + r} ${tp + h} Q ${l} ${tp + h} ${l} ${tp + h - r} L ${l} ${tp + r} Q ${l} ${tp} ${l + r} ${tp} Z`; }
    else if (o.kind === 'torn') { const n = 14, zz = Array.from({ length: n + 1 }, (_, k) => [f1(l + w - k * w / n), f1(tp + h - (k % 2 ? 16 : 0))]); D = `M ${l + r} ${tp} L ${l + w - r} ${tp} Q ${l + w} ${tp} ${l + w} ${tp + r} L ${zz.map(q => q.join(' ')).join(' L ')} L ${l} ${tp + r} Q ${l} ${tp} ${l + r} ${tp} Z`; }
    if (D) g.path(D, o.style || F(4)); else R(g, l, tp, w, h, r, o.style || F(4));
    if (o.kind === 'header') { R(g, l + 16, tp + 16, w - 32, o.hh || 70, Math.max(10, r - 16), { fill: TL_(.08), sw: 2, stroke: TL_(.35) }); }
    if (o.perf != null) g.line(l + 20, o.perf, l + w - 20, o.perf, DASH(.5));
    return g; }
  const tmDim = (T, s) => [[0, 1], [T.H, 1], [f3(T.H + tu(.3)), FAINT, 'io']];
  /* moment i (or 'r' = the result) in a slot: box | circ | hex | o.draw; passed → lights at its pass time (soft lit edge) · stop moment → lit + ripple on H ·
     after the stop → dims on H · result: reached → lands lit on H, else waits faint. o.g = it rides that group (o.mv its keys) */
  function mom(p, c, d, i, x, y, sz, o = {}) { const T = TQ(d), X = i === 'r' ? T.R0 : T.P[i]; if (!X) return null; const sh = o.shape || 'box', draw = o.draw || ((q, st) => shp(q, sh, x, y, sz, st));
    const tp = T.tPass(i), stop = i === 'r' ? T.reach : (i === T.at && !T.reach), fut = tp == null, t = o.t ?? (i === 'r' ? f3(T.tI(T.n) ) : T.tI(i));
    const g0 = o.g || popAt(p, x, y, t); if (fut) draw(g0, BK); const g1 = fut ? mvG(g0, { o: i === 'r' ? [[0, FAINT]] : tmDim(T) }) : g0, g = stop ? mvG(g1, { px: x, py: y, s: [[0, 1], [T.H, 1], [f3(T.H + tu(.2)), 1.05, 'io'], [f3(T.H + tu(.45)), 1, 'io']] }) : g1;
    draw(g, F(4)); if (sh === 'circ' && !o.draw) g.circle(x, y, sz / 2 - 13, SL(1.4));
    if (tp != null) { draw(litOn(g, tp), stop ? LIT2() : { sw: 4, stroke: TA(.7) }); if (o.rip !== false) ripple(p, o.ix ?? x, o.iy ?? y, sz * (stop ? .6 : .5), f3(tp + tu(.04))); }
    const iw = o.iw || sz * (sh === 'box' ? .72 : .66), io = o.io ? o.io : fut ? (i === 'r' ? [[0, 0], [t, 0], [f3(t + tu(.1)), FAINT]] : tmDim(T).map((k, j) => j ? k : [0, 1])) : undefined;
    if (picOf(X)) put(p, c, { icon: X.icon }, o.ix ?? x, o.iy ?? y, iw, null, { t: f3(t + tu(.04)), mv: o.mv, o: io, punch: stop ? T.H : undefined });
    else txt(g, X.label, o.ix ?? x, (o.iy ?? y) + 16, { size: Math.max(40, Math.min(54, iw * .3)), maxW: o.lw || iw * 1.2, weight: 800, color: C.ink, wrap: 'mid' });
    return g; }
  /* moment i's words (only when it has an icon) — o.pill */
  function mword(p, d, i, x, y, o = {}) { const T = TQ(d), X = i === 'r' ? T.R0 : T.P[i], str = LBL(X); if (!str) return null; const fut = T.tPass(i) == null, t = o.t ?? f3((i === 'r' ? T.tI(T.n) : T.tI(i)) + tu(.14)), sz = o.size || 44;
    const g1 = popAt(o.g || p, x, y - sz * .35, t), g = fut ? mvG(g1, { o: i === 'r' ? [[0, FAINT + .1]] : [[0, 1], [T.H, 1], [f3(T.H + tu(.3)), .5, 'io']] }) : g1;
    if (o.pill) { const mw = o.maxW || 300, w = Math.min(mw, tw(p, str, sz)) + 60, cx = o.anchor === 'start' ? x + w / 2 : o.anchor === 'end' ? x - w / 2 : x; pill(g, str, cx, y, { t: 0, size: sz, maxW: mw }); return null; }
    return txt(g, str, x, y, { size: sz, maxW: o.maxW || 300, weight: 800, color: C.ink, anchor: o.anchor || 'middle', wrap: o.wrap === undefined ? 'down' : o.wrap }); }
  /* the list of things shown, in order: moments then the result — [[i, x, y] …] made by a placer f(k, count) */
  const items = T => T.P.map((_, i) => i).concat(T.R0 ? ['r'] : []);
  /* a lit pointer/token that runs the pass times through the given positions (pos(i) → [x, y]); stops on the stop position at H */
  function runner(p, T, pos, o = {}) { if (!T.steps.length) return null; const pts = T.steps.map(pos), times = T.steps.map(i => T.tPass(i)), fin = pts[pts.length - 1];
    const X = [[0, f1(pts[0][0] - fin[0])], [f3(times[0] - tu(.2)), f1(pts[0][0] - fin[0])]], Y = [[0, f1(pts[0][1] - fin[1])], [f3(times[0] - tu(.2)), f1(pts[0][1] - fin[1])]];
    for (let k = 1; k < pts.length; k++) { X.push([f3(times[k - 1] + tu(.04)), f1(pts[k - 1][0] - fin[0])], [times[k], f1(pts[k][0] - fin[0]), 'io']); Y.push([f3(times[k - 1] + tu(.04)), f1(pts[k - 1][1] - fin[1])], [times[k], f1(pts[k][1] - fin[1]), 'io']); }
    const g = mvG(p, { px: fin[0], py: fin[1], x: X, y: Y, o: [[0, 0], [f3(times[0] - tu(.2)), 0], [f3(times[0] - tu(.06)), 1]] }); if (o.draw) o.draw(g, ...fin); else { g.circle(...fin, o.r || 18, DOTF()); g.circle(...fin, (o.r || 18) + 9, { sw: 2.6, stroke: ACC1 }); } return g; }
  const way = (p, dd, t, dur, w = 5, a = .45) => drawAt(p.path(dd, { sw: w, stroke: TL_(a) }), p, t, dur);
  const smK = (t0, t1, v0, v1, n = 16) => [[0, v0], [t0, v0]].concat(Array.from({ length: n }, (_, k) => [f3(lerp(t0, t1, (k + 1) / n)), f3(lerp(v0, v1, sm((k + 1) / n))), 'lin']));
  const Pc = (cx, cy, r, a) => [f1(cx + r * Math.cos(rad(a))), f1(cy + r * Math.sin(rad(a)))];
  const rowPos = (k, cx, y, s, gap) => rowXs(k, s, gap, cx).map(x => [x, y]);

  /* 01 TRACK CARD (การ์ดเส้นเวลา): a wide card; a line runs along its foot with a node under each slot; a lit dot runs the nodes */
  variant('track', 'การ์ดเส้นเวลา', (d, c) => { art(c, p => { const T = TQ(d), L = items(T), k = L.length, s = k >= 4 ? 178 : 200, P = rowPos(k, 0, -30, s, k >= 4 ? 44 : 90);
    crd(p, 0, 20, 960, 600); way(p, `M ${P[0][0]} 200 L ${P[k - 1][0]} 200`, T.tA, tu(.4), 4, .4);
    L.forEach((i, j) => { const [x, y] = P[j]; mom(p, c, d, i, x, y, s); popAt(p, x, 200, T.tI(j)).circle(x, 200, 14, F(3)); mword(p, d, i, x, 262, { size: 42, maxW: s + 30 }); });
    runner(p, T, i => [P[L.indexOf(i)][0], 200]); }); });

  /* 02 TICK CARD (การ์ดช่องติ๊ก): a card with a header band; one tile per moment; a passed tile gets a lit tick */
  variant('ticks', 'การ์ดช่องติ๊กผ่าน', (d, c) => { art(c, p => { const T = TQ(d), L = items(T), k = L.length, s = k >= 4 ? 176 : 198, P = rowPos(k, 0, 0, s, k >= 4 ? 40 : 70);
    crd(p, 0, 20, 940, 560, { kind: 'header', hh: 70 });
    L.forEach((i, j) => { const [x, y] = P[j]; mom(p, c, d, i, x, y, s); mword(p, d, i, x, y + s / 2 + 56, { size: 42, maxW: s + 36 }); const tp = T.tPass(i); if (tp != null && i !== 'r') { const ck = p.path(`M ${x + s / 2 - 50} ${y + s / 2 - 30} L ${x + s / 2 - 30} ${y + s / 2 - 12} L ${x + s / 2 - 6} ${y + s / 2 - 48}`, { sw: 7, stroke: ACC1 }); on(ck, p, 0, { draw: [[0, 0], [tp, 0], [f3(tp + tu(.2)), 1, 'out']] }); } }); }); });

  /* 03 DIAL CARD (การ์ดหน้าปัด): a square card with a big ring; the moments sit round it; a lit arc sweeps from the top through them */
  variant('dialcard', 'การ์ดหน้าปัด', (d, c) => { art(c, p => { const T = TQ(d), L = items(T), k = L.length, CX = 0, CY = 10, RR = 220, AN = L.map((_, j) => -90 + 360 * (j + .5) / k);
    crd(p, CX, CY, 640, 640, { r: 60 }); p.circle(CX, CY, RR, { sw: 14, stroke: TL_(.12) });
    if (T.steps.length) { const last = L.indexOf(T.steps[T.steps.length - 1]), arcs = T.steps.map(i => (L.indexOf(i) + .5) / k); const a = p.path(arcD(CX, CY, RR, 1), { sw: 14, stroke: ACC1 }); on(a, p, 0, { draw: [[0, 0], [f3(T.tPass(T.steps[0]) - tu(.3)), 0]].concat(T.steps.map((i, j) => [T.tPass(i), f3(arcs[j]), 'io'])) }); }
    L.forEach((i, j) => { const [x, y] = Pc(CX, CY, RR, AN[j]); mom(p, c, d, i, x, y, k >= 4 ? 166 : 176, { shape: 'circ' }); });
    const seq = T.steps.length ? T.steps : []; seq.forEach((i, j) => { const t0 = T.tPass(i), t1 = j < seq.length - 1 ? T.tPass(seq[j + 1]) : null, g = sub(p); on(g, p, 0, { o: [[0, 0], [f3(t0 - tu(.1)), 0], [t0, 1, 'io']].concat(t1 != null ? [[f3(t1 - tu(.1)), 1], [t1, 0, 'io']] : []) }); mword(p, d, i, CX, CY + 16, { g, size: 50, maxW: 250, t: 0, wrap: 'mid' }); }); }); });

  /* 04 TALL TIMELINE CARD (การ์ดไทม์ไลน์ตั้ง): a tall card; a vertical line on its left with a node per row; each row: slot + words */
  variant('vertical', 'การ์ดไทม์ไลน์ตั้ง', (d, c) => { art(c, p => { const T = TQ(d), L = items(T), k = L.length, rh = k >= 4 ? 170 : k === 3 ? 200 : 230, s = k >= 4 ? 175 : rh - 20, ys = rowXs(k, rh, 0, 10);
    crd(p, 0, 10, 760, k >= 4 ? 696 : 660); const LX = -310; way(p, `M ${LX} ${ys[0]} L ${LX} ${ys[k - 1]}`, T.tA, tu(.4), 4, .4);
    L.forEach((i, j) => { const y = ys[j]; popAt(p, LX, y, T.tI(j)).circle(LX, y, 16, F(3)); const X = i === 'r' ? T.R0 : T.P[i], sz = Math.max(165, s - 10); if (picOf(X)) mom(p, c, d, i, -150, y, sz); else mom(p, c, d, i, 30, y, sz, { lw: 440, draw: (q, st) => R(q, -240, y - sz / 2, 540, sz, sz * .24, st) }); mword(p, d, i, f1(-150 + sz / 2 + 34), y + 16, { anchor: 'start', size: 50, maxW: 360, wrap: null }); });
    runner(p, T, i => [LX, ys[L.indexOf(i)]], { r: 14 }); }); });

  /* 05 TABBED CARD (การ์ดแท็บ): a card with one tab per moment along its top; the page shows the moment where time is (big), the tabs light in turn */
  variant('folder', 'การ์ดแท็บเวลา', (d, c) => { art(c, p => { const T = TQ(d), L = items(T), k = L.length, TW = f1(840 / k), txs = rowXs(k, TW, 0);
    crd(p, 0, 50, 880, 520, { r: 30 }); const fin = T.steps.length ? T.steps[T.steps.length - 1] : L[0];
    txs.forEach((x, j) => { const i = L[j], g = popAt(p, x, -255, T.tI(j)); R(g, x - TW / 2 + 8, -290, TW - 16, 72, 20, F(3.4)); const tp = T.tPass(i); if (tp != null) R(litOn(g, tp), x - TW / 2 + 16, -282, TW - 32, 56, 14, { fill: TA(.25), sw: 0, stroke: 'none' }); const X = i === 'r' ? T.R0 : T.P[i]; if (X && X.label) txt(g, X.label, x, -242, { size: 40, maxW: TW - 40, weight: 800, color: C.ink }); });
    L.forEach((i, j) => { const tp = T.tPass(i), next = T.steps[T.steps.indexOf(i) + 1], tn = next != null ? T.tPass(next) : null, ok = nowO(T, i), show = sub(p); on(show, p, 0, { o: ok });
      mom(p, c, d, i, -200, 60, 280, { g: show, io: ok }); mword(p, d, i, -20, 76, { anchor: 'start', size: 58, maxW: 420, wrap: null, g: show }); }); }); });

  /* 06 RISING LINE (เส้นเฉียงขึ้น): the moments climb a slanted line, each a step higher than the last; the line lights up behind a lit dot */
  variant('rise', 'เส้นเฉียงขึ้น', (d, c) => { art(c, p => { const T = TQ(d), L = items(T), k = L.length, s = k >= 4 ? 172 : 196, xs = rowXs(k, s, k >= 4 ? 52 : 96), P = xs.map((x, j) => [x, k === 1 ? 120 : f1(210 - 270 * j / (k - 1))]);
    const A = [P[0][0] - 120, P[0][1] + 60], B = [P[k - 1][0] + 120, P[k - 1][1] - 60], pts = [A].concat(P, [B]), at = byLen(pts), Lt = pts.slice(1).reduce((a, q, m) => a + Math.hypot(q[0] - pts[m][0], q[1] - pts[m][1]), 0);
    let acc = 0; const F0 = [0]; for (let m = 1; m < pts.length; m++) { acc += Math.hypot(pts[m][0] - pts[m - 1][0], pts[m][1] - pts[m - 1][1]); F0.push(acc / Lt); } const fr = i => F0[L.indexOf(i) + 1];
    way(p, pathOf(pts, false), T.tA, tu(.5), 5, .4); litPath(p, pathOf(pts, false), frK(T, fr, 0), 7); curveRunner(p, T, at, fr, { r: 16 });
    L.forEach((i, j) => { const [x, y] = P[j]; mom(p, c, d, i, x, f1(y - s / 2 - 26), s); mword(p, d, i, x, f1(y + 92), { size: 42, maxW: s + 40 }); }); }); });

  /* 07 SEGMENT BAR (แถบแบ่งช่อง): a card; one bar cut into a part per moment along its foot fills part by part; the moments stand over their parts */
  variant('segbar', 'แถบแบ่งช่องเวลา', (d, c) => { art(c, p => { const T = TQ(d), L = items(T), k = L.length, BW = 840, cw = BW / k, xs = rowXs(k, cw, 0), s = Math.min(196, cw - 30);
    crd(p, 0, 20, 940, 600); R(p, -BW / 2, 200, BW, 64, 32, { sw: 3, stroke: TL_(.45) });
    L.forEach((i, j) => { const x = xs[j], tp = T.tPass(i); mom(p, c, d, i, x, -30, s); mword(p, d, i, x, -200, { wrap: 'up', size: 42, maxW: cw - 20 }); if (tp != null) R(mvG(p, { px: x - cw / 2 + 8, py: 232, sx: [[0, 0], [f3(tp - tu(.24)), 0], [tp, 1, 'io']] }), x - cw / 2 + 8, 210, cw - 16, 44, 22, DOTF()); }); }); });

  /* 08 FAN (การ์ดพัด): one tall card per moment fanned out; they straighten one by one as time passes; the stop card rises */
  variant('fan', 'การ์ดพัด', (d, c) => { art(c, p => { const T = TQ(d), L = items(T), k = L.length, AN = L.map((_, j) => (j - (k - 1) / 2) * (k >= 4 ? 14 : 18)), PV = [0, 820], RF = 760, cw = 230, ch = 330;
    L.forEach((i, j) => { const a = AN[j], cx = f1(PV[0] + RF * Math.sin(rad(a))), cy = f1(PV[1] - RF * Math.cos(rad(a))), tp = T.tPass(i), K = { px: cx, py: cy, r: [[0, a]], y: [[0, 500], [T.tI(j), 500], [f3(T.tI(j) + tu(.34)), 0, 'out']].concat(tp != null ? [[tp, 0], [f3(tp + tu(.24)), -26, 'io']] : []), o: fadeIn(T.tI(j), .1) };
      const g = mvG(CL(p), K); R(g, cx - cw / 2, cy - ch / 2, cw, ch, 28, F(4)); mom(p, c, d, i, cx, f1(cy - 40), 170, { g, mv: K, t: T.tI(j) }); mword(p, d, i, cx, f1(cy + 110), { g, size: 40, maxW: cw - 30, wrap: 'mid' }); }); }); });

  /* 09 FLIP CARD (การ์ดพลิกเลข): one big card that flips over moment after moment, stopping on the stop moment; small dots below mark the moments */
  variant('flipcard', 'การ์ดพลิกทีละช่วง', (d, c) => { art(c, p => { const T = TQ(d), L = items(T), k = L.length, CX = 0, CY = -40;
    crd(p, CX, CY, 420, 500, { r: 40 }); const seq = T.steps.length ? T.steps : [L[0]];
    seq.forEach((i, j) => { const t0 = T.tPass(i) ?? T.tI(0), t1 = j < seq.length - 1 ? T.tPass(seq[j + 1]) : null, ok = T.steps.length ? nowO(T, i) : fadeIn(tu(.3), .14), sx = ok.map(q => q.slice());
      const g = sub(p); on(g, p, 0, { ox: CX, oy: CY, sx, o: ok }); mom(p, c, d, i, CX, CY - 30, 250, { g, io: ok, mv: { px: CX, py: CY, sx } }); mword(p, d, i, CX, CY + 170, { g, size: 52, maxW: 360 }); });
    rowXs(k, 44, 30, 0).forEach((x, j) => { const i = L[j], tp = T.tPass(i); popAt(p, x, 280, T.tI(j)).circle(x, 280, 22, F(3)); if (tp != null) popAt(p, x, 280, tp).circle(x, 280, 12, DOTF()); }); }); });

  /* 10 BUBBLES (การ์ดข้อความตามเวลา): a chat card; one message bubble per moment pops in down the card as time passes; the stop bubble lights */
  variant('chat', 'การ์ดข้อความตามเวลา', (d, c) => { art(c, p => { const T = TQ(d), L = items(T), k = L.length, rh = k >= 4 ? 128 : k === 3 ? 165 : 200, ys = rowXs(k, rh, 0, 44), s = 178;
    crd(p, 0, 10, 820, 660, { kind: 'header', hh: 60 });
    L.forEach((i, j) => { const y = ys[j], left = j % 2 === 0, bx = left ? -205 : 205, tp = T.tPass(i), ta = T.steps.indexOf(i) === 0 ? f3(T.tI(0) + tu(.1)) : tp != null ? f3(tp - tu(.06)) : f3(T.H + tu(.1)), bg = popAt(p, bx, y, ta); R(bg, bx - 200, y - s / 2, 400, s, s / 2, { fill: TL_(.06), sw: 3, stroke: TL_(.5) });
      mom(p, c, d, i, left ? bx - 200 + s / 2 + 2 : bx + 200 - s / 2 - 2, y, s - 10, { shape: 'circ', t: f3(ta + tu(.02)) }); mword(p, d, i, left ? bx - 200 + s + 16 : bx + 200 - s - 16, y + 15, { anchor: left ? 'start' : 'end', size: 42, maxW: 400 - s - 36, wrap: null, t: f3(ta + tu(.08)) }); }); }); });

  /* ---- more B09 helpers: a value that steps with time (eases with sm between pass times, sampled 'lin' so things that travel together stay
     together) · the window while time is on moment i · a token that rides a curve at(f) (f from fr(i)) with the same timing · a polyline sampled by length */
  const frK = (T, fr, v0) => { const S = T.steps; if (!S.length) return [[0, v0 ?? 0]]; const t0 = T.tPass(S[0]), K = v0 == null ? [[0, fr(S[0])]] : [[0, v0], [f3(t0 - tu(.3)), v0], [t0, fr(S[0]), 'io']];
    for (let k = 1; k < S.length; k++) { const a = fr(S[k - 1]), b = fr(S[k]), ta = f3(T.tPass(S[k - 1]) + tu(.04)), tb = T.tPass(S[k]); K.push([ta, a]); for (let m = 1; m <= 12; m++) K.push([f3(lerp(ta, tb, m / 12)), f3(lerp(a, b, sm(m / 12))), 'lin']); } return K; };
  const winO = (T, i) => { const j = T.steps.indexOf(i); if (j < 0) return [[0, 0]]; const t0 = T.tPass(i), t1 = j < T.steps.length - 1 ? T.tPass(T.steps[j + 1]) : null;
    return [[0, 0], [f3(t0 - tu(.12)), 0], [t0, 1, 'io']].concat(t1 != null ? [[f3(t1 - tu(.12)), 1], [t1, 0, 'io']] : []); };
  function curveRunner(p, T, at, fr, o = {}) { const S = T.steps; if (!S.length) return null; const fin = at(fr(S[S.length - 1])), X = [], Y = [];
    const add = (t, f, e) => { const q = at(f); X.push(e ? [t, f1(q[0] - fin[0]), e] : [t, f1(q[0] - fin[0])]); Y.push(e ? [t, f1(q[1] - fin[1]), e] : [t, f1(q[1] - fin[1])]); };
    add(0, fr(S[0])); for (let k = 1; k < S.length; k++) { const a = fr(S[k - 1]), b = fr(S[k]), ta = f3(T.tPass(S[k - 1]) + tu(.04)), tb = T.tPass(S[k]); add(ta, a); for (let m = 1; m <= 12; m++) add(f3(lerp(ta, tb, m / 12)), lerp(a, b, sm(m / 12)), 'lin'); }
    const t0 = T.tPass(S[0]), g = mvG(p, { px: fin[0], py: fin[1], x: X, y: Y, o: [[0, 0], [f3(t0 - tu(.2)), 0], [f3(t0 - tu(.06)), 1]] });
    if (o.draw) o.draw(g, ...fin); else { g.circle(...fin, o.r || 18, DOTF()); g.circle(...fin, (o.r || 18) + 9, { sw: 2.6, stroke: ACC1 }); } return g; }
  const byLen = pts => { const cum = [0]; for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])); const Lt = cum[cum.length - 1];
    return f => { const dd = Math.max(0, Math.min(1, f)) * Lt; let i = 1; while (i < cum.length - 1 && cum[i] < dd) i++; const u = (dd - cum[i - 1]) / ((cum[i] - cum[i - 1]) || 1); return [f1(lerp(pts[i - 1][0], pts[i][0], u)), f1(lerp(pts[i - 1][1], pts[i][1], u))]; }; };
  const litPath = (p, dd, K, w = 8) => { const l = p.path(dd, { sw: w, stroke: ACC1 }); on(l, p, 0, { draw: K }); return l; };
  const noMv = K => Object.assign({}, K, { o: undefined });

  /* 11 DECK (สำรับการ์ด): the moments are a stack of cards; when time moves on, the top card slides away and the next one comes forward */
  variant('deck', 'สำรับการ์ดเวลา', (d, c) => { art(c, p => { const T = TQ(d), L = items(T), k = L.length, S = T.steps, last = S.length ? L.indexOf(S[S.length - 1]) : 0, CX = -40, CY = 40, cw = 440, ch = 520, OF = 30;
    for (let j = k - 1; j >= 0; j--) { const i = L[j], ti = T.tI(k - 1 - j), tl = j < last ? T.tPass(L[j + 1]) : null, dep = frK(T, q => Math.max(0, j - L.indexOf(q)) * OF);
      const cut = A => tl == null ? A : A.filter(q => q[0] < tl - tu(.36)).concat([[f3(tl - tu(.36)), 0]]);
      const K = { px: CX, py: CY, x: cut(dep).concat(tl != null ? [[tl, -900, 'io']] : []), y: cut(dep.map(q => q.length > 2 ? [q[0], -q[1], q[2]] : [q[0], -q[1]])).concat(tl != null ? [[tl, -60, 'io']] : []), o: fadeIn(ti, .12).concat(tl != null ? [[f3(tl - tu(.14)), 1], [tl, 0, 'io']] : []) };
      const tt = j === 0 ? ti : T.tPass(i), io = j > last ? [[0, 0]] : (j === 0 ? fadeIn(ti, .12) : [[0, 0], [f3(tt - tu(.3)), 0], [f3(tt - tu(.1)), 1, 'io']]).concat(tl != null ? [[f3(tl - tu(.3)), 1], [f3(tl - tu(.16)), 0, 'io']] : []);
      const g = mvG(CL(p), K); R(g, CX - cw / 2, CY - ch / 2, cw, ch, 40, F(4));
      mom(p, c, d, i, CX, CY - 50, 240, { g, mv: noMv(K), io, t: ti }); mword(p, d, i, CX, CY + 165, { g, size: 52, maxW: cw - 60, t: ti }); } }); });

  /* 12 STEPPER (จุดเชื่อมเวลา): round stops in a row joined by short links; each link fills with light as time crosses it */
  variant('stepper', 'จุดเชื่อมเวลา', (d, c) => { art(c, p => { const T = TQ(d), L = items(T), k = L.length, s = k >= 4 ? 192 : 210, P = rowPos(k, 0, -40, s, k >= 4 ? 40 : 100);
    for (let j = 0; j < k - 1; j++) { const x0 = P[j][0] + s / 2 + 8, x1 = P[j + 1][0] - s / 2 - 8, y = -40, tp = T.tPass(L[j + 1]); way(p, `M ${x0} ${y} L ${x1} ${y}`, T.tI(j + 1), tu(.2), 6, .35); if (tp != null) litPath(p, `M ${x0} ${y} L ${x1} ${y}`, [[0, 0], [f3(tp - tu(.26)), 0], [tp, 1, 'io']], 9); }
    L.forEach((i, j) => { mom(p, c, d, i, ...P[j], s, { shape: 'circ' }); mword(p, d, i, P[j][0], f1(-40 + s / 2 + 62), { size: 44, maxW: s + 40 }); }); }); });

  /* 13 ZIGZAG (ทางซิกแซก): a path zigzags up and down across; the moments sit on its corners; a lit dot walks it */
  variant('zigzag', 'ทางซิกแซก', (d, c) => { art(c, p => { const T = TQ(d), L = items(T), k = L.length, s = k >= 4 ? 170 : 190, xs = rowXs(k, s, k >= 4 ? 64 : 110), P = xs.map((x, j) => [x, j % 2 ? 120 : -100]);
    if (k > 1) way(p, pathOf(P, false), T.tA, tu(.5), 5, .4); runner(p, T, i => P[L.indexOf(i)]);
    L.forEach((i, j) => { mom(p, c, d, i, ...P[j], s); const up = j % 2 === 0; mword(p, d, i, P[j][0], up ? f1(P[j][1] - s / 2 - 46) : f1(P[j][1] + s / 2 + 60), { size: 42, maxW: s + 60, wrap: up ? 'up' : 'down' }); }); }); });

  /* 14 HOPS (กระโดดข้ามช่วง): the moments in a row; a lit dot hops from one to the next over an arc, leaving the arc lit */
  variant('hops', 'กระโดดข้ามช่วง', (d, c) => { art(c, p => { const T = TQ(d), L = items(T), k = L.length, s = k >= 4 ? 176 : 196, P = rowPos(k, 0, 80, s, k >= 4 ? 50 : 100), top = 80 - s / 2 - 10, AH = 150;
    const pts = []; P.forEach(([x], j) => { if (j === 0) { pts.push([x, top]); return; } const x0 = P[j - 1][0]; for (let m = 1; m <= 16; m++) { const u = m / 16; pts.push([f1(lerp(x0, x, u)), f1(top - AH * 4 * u * (1 - u))]); } });
    const at = byLen(pts), fr = i => k > 1 ? L.indexOf(i) / (k - 1) : 0;
    if (k > 1) { p.path(pathOf(pts, false), DASH(.45)); litPath(p, pathOf(pts, false), frK(T, fr, 0), 6); }
    curveRunner(p, T, at, fr, { r: 18 });
    L.forEach((i, j) => { mom(p, c, d, i, ...P[j], s); mword(p, d, i, P[j][0], f1(80 + s / 2 + 60), { size: 44, maxW: s + 40 }); }); }); });

  /* 15 BARS (แท่งเวลาโตขึ้น): one bar per moment, each taller than the last (more time); a bar fills with light as time reaches it; the moment rides on top */
  variant('bars', 'แท่งเวลาโตขึ้น', (d, c) => { art(c, p => { const T = TQ(d), L = items(T), k = L.length, bw = k >= 4 ? 190 : 210, xs = rowXs(k, bw, k >= 4 ? 40 : 80), B = 330, s = 172;
    L.forEach((i, j) => { const x = xs[j], h = k === 1 ? 300 : f1(150 + (330 - 150) * j / (k - 1)), tp = T.tPass(i), tI = T.tI(j);
      const og = mvG(p, { px: x, py: B, sy: [[0, 0], [tI, 0], [f3(tI + tu(.36)), 1, 'out']] }); R(og, x - bw / 2, B - h, bw, h, 24, { fill: C.fill, sw: 3.4, stroke: TL_(.6) });
      if (tp != null) R(mvG(p, { px: x, py: B, sy: [[0, 0], [f3(tp - tu(.3)), 0], [tp, 1, 'io']] }), x - bw / 2 + 10, B - h + 10, bw - 20, h - 20, 16, { fill: TA(.28), sw: 0, stroke: 'none' });
      mom(p, c, d, i, x, f1(B - h - s / 2 - 16), s, { t: f3(tI + tu(.22)) }); mword(p, d, i, x, B - 44, { wrap: 'up', size: 42, maxW: bw - 24, t: f3(tI + tu(.3)) }); }); }); });

  /* 16 PIN LINE (เส้นหมุดเวลา): a line across the top; the moments hang below it on dashed pins; a lit marker slides along the line from pin to pin */
  variant('pins', 'เส้นหมุดเวลา', (d, c) => { art(c, p => { const T = TQ(d), L = items(T), k = L.length, RY = -110, s = k >= 4 ? 180 : 200, xs = rowXs(k, s, k >= 4 ? 46 : 90), SY = 140;
    way(p, `M -460 ${RY} L 460 ${RY}`, T.tA, tu(.5), 5, .45); xs.forEach((x, j) => popAt(p, x, RY, T.tI(j)).circle(x, RY, 14, F(3.4)));
    L.forEach((i, j) => { const x = xs[j], tp = T.tPass(i), pin = sub(p); on(pin, p, 0, { draw: [[0, 0], [T.tI(j), 0], [f3(T.tI(j) + tu(.2)), 1, 'out']] }); pin.line(x, RY + 16, x, SY - s / 2, DASH(.55));
      if (tp != null) litOn(p, tp).line(x, RY + 16, x, SY - s / 2, { sw: 4, stroke: ACC1 }); mom(p, c, d, i, x, SY, s); mword(p, d, i, x, RY - 70, { wrap: 'up', size: 44, maxW: s + 40 }); });
    runner(p, T, i => [xs[L.indexOf(i)], RY], { draw: (g, x, y) => { g.path(`M ${x - 22} ${y - 40} L ${x + 22} ${y - 40} L ${x} ${y - 6} Z`, DOTF()); g.circle(x, y, 10, DOTF()); } }); }); });

  /* 17 SPAN BRACKET (วงเล็บช่วงเวลา): the moments in a row; a lit bracket under them stretches from the first moment to where time is */
  variant('span', 'วงเล็บช่วงเวลา', (d, c) => { art(c, p => { const T = TQ(d), L = items(T), k = L.length, s = k >= 4 ? 180 : 204, GP = k >= 4 ? 44 : 84, xs = rowXs(k, s, GP), Y = -60, BY = 150, x0 = xs[0] - s / 2;
    const ex = i => f1(xs[L.indexOf(i)] + s / 2), W0 = f1(xs[k - 1] + s / 2 - x0);
    const base = sub(p); on(base, p, 0, { draw: [[0, 0], [T.tA, 0], [f3(T.tA + tu(.5)), 1, 'out']] }); base.path(`M ${x0} ${BY - 30} L ${x0} ${BY} L ${f1(x0 + W0)} ${BY} L ${f1(x0 + W0)} ${BY - 30}`, DASH(.5));
    if (T.steps.length) { const sx = frK(T, i => f3((ex(i) - x0) / W0), .02), g = mvG(p, { px: x0, py: BY, sx, o: fadeIn(f3(T.tPass(T.steps[0]) - tu(.4)), .1) }); g.line(x0, BY, x0 + W0, BY, { sw: 9, stroke: ACC1 }); g.line(x0, BY - 34, x0, BY, { sw: 9, stroke: ACC1 });
      const e = mvG(p, { px: 0, py: BY, x: frK(T, ex, x0), o: fadeIn(f3(T.tPass(T.steps[0]) - tu(.4)), .1) }); e.line(0, BY - 34, 0, BY, { sw: 9, stroke: ACC1 }); e.circle(0, BY, 14, DOTF()); }
    L.forEach((i, j) => { mom(p, c, d, i, xs[j], Y, s); mword(p, d, i, xs[j], f1(BY + 80), { size: 44, maxW: s + GP - 10 }); }); }); });

  /* 18 SPOTLIGHT ROW (การ์ดเด่นทีละใบ): a row of cards; the card where time is grows forward, the rest step back */
  variant('spot', 'การ์ดเด่นทีละใบ', (d, c) => { art(c, p => { const T = TQ(d), L = items(T), k = L.length, cw = k >= 4 ? 196 : k === 3 ? 240 : 280, ch = 380, xs = rowXs(k, cw, k >= 4 ? 34 : 56), Y = 0;
    L.forEach((i, j) => { const x = xs[j], t = T.tI(j), K = { px: x, py: Y, s: frK(T, q => L.indexOf(q) === j ? 1.12 : .9, k > 1 ? .9 : 1), y: frK(T, q => L.indexOf(q) === j ? -24 : 10, 0), o: fadeIn(t, .12) }, g = mvG(p, K);
      R(g, x - cw / 2, Y - ch / 2, cw, ch, 32, F(4)); mom(p, c, d, i, x, Y - 50, Math.min(176, cw - 20), { g, mv: noMv(K), t }); mword(p, d, i, x, Y + 116, { g, size: 42, maxW: cw - 28, t }); }); }); });

  /* 19 DROP-IN (การ์ดหล่นลงช่อง): a row of dashed places; when time reaches a moment its card drops into its place; the moments time has not reached wait faint */
  variant('droprow', 'การ์ดหล่นลงช่อง', (d, c) => { art(c, p => { const T = TQ(d), L = items(T), k = L.length, cw = k >= 4 ? 200 : 236, ch = 340, xs = rowXs(k, cw, k >= 4 ? 34 : 64), Y = 60;
    L.forEach((i, j) => { const x = xs[j], tp = T.tPass(i), t = T.tI(j); popAt(p, x, Y, t).path(`M ${x - cw / 2 + 28} ${Y - ch / 2} L ${x + cw / 2 - 28} ${Y - ch / 2} Q ${x + cw / 2} ${Y - ch / 2} ${x + cw / 2} ${Y - ch / 2 + 28} L ${x + cw / 2} ${Y + ch / 2 - 28} Q ${x + cw / 2} ${Y + ch / 2} ${x + cw / 2 - 28} ${Y + ch / 2} L ${x - cw / 2 + 28} ${Y + ch / 2} Q ${x - cw / 2} ${Y + ch / 2} ${x - cw / 2} ${Y + ch / 2 - 28} L ${x - cw / 2} ${Y - ch / 2 + 28} Q ${x - cw / 2} ${Y - ch / 2} ${x - cw / 2 + 28} ${Y - ch / 2} Z`, DASH(.5));
      if (tp == null) { mom(p, c, d, i, x, Y - 50, 170, { t }); mword(p, d, i, x, Y + 100, { size: 40, maxW: cw - 30, t }); return; }
      const t0 = f3(tp - tu(.36)), K = { px: x, py: Y, y: [[0, -560], [t0, -560], [tp, 0, 'io']], o: [[0, 0], [t0, 0], [f3(t0 + tu(.04)), 1]] }, g = mvG(CL(p), K);
      R(g, x - cw / 2, Y - ch / 2, cw, ch, 28, F(4)); mom(p, c, d, i, x, Y - 50, 170, { g, mv: noMv(K), t: t0 }); mword(p, d, i, x, Y + 100, { g, size: 40, maxW: cw - 30, t: t0 }); }); }); });

  /* 20 SLIDING ROW (แถวช่องเลื่อนผ่านกรอบ): a row of frames slides through a fixed lit frame so the moment where time is sits in it */
  variant('strip', 'แถวช่องเลื่อนผ่านกรอบ', (d, c) => { art(c, p => { const T = TQ(d), L = items(T), k = L.length, PF = 290, FS = 240, Y = -40;
    const K = { px: 0, py: Y, x: [[0, 760], [T.tA, 760], [f3(T.tA + tu(.5)), 0, 'out']].concat(frK(T, q => -L.indexOf(q) * PF).slice(1)) }, g = mvG(CL(p), K);
    if (k > 1) g.line(0, Y, (k - 1) * PF, Y, DASH(.45));
    L.forEach((i, j) => { const x = j * PF; R(g, x - FS / 2, Y - FS / 2, FS, FS, 22, F(3)); mom(p, c, d, i, x, Y, 186, { g, mv: noMv(K), t: f3(T.tA + tu(.2)) }); });
    const w = sub(p); on(w, p, 0, { o: fadeIn(f3(T.tA + tu(.4)), .14) }); [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(([a, b]) => w.path(`M ${a * 150} ${f1(Y + b * 110)} L ${a * 150} ${f1(Y + b * 150)} L ${a * 110} ${f1(Y + b * 150)}`, { sw: 8, stroke: ACC1 }));
    L.forEach(i => { const g2 = sub(p); on(g2, p, 0, { o: winO(T, i) }); mword(p, d, i, 0, Y + 270, { g: g2, size: 54, maxW: 640, t: 0 }); }); }); });

  /* 21 LANES (แถบโหลดทีละแถว): one row per moment — its slot, its words, and a long bar that fills with light over that moment's stretch of time */
  variant('lanes', 'แถบโหลดทีละแถว', (d, c) => { art(c, p => { const T = TQ(d), L = items(T), k = L.length, rh = k >= 4 ? 168 : k === 3 ? 210 : 240, ys = rowXs(k, rh, 0, 0), SX = -370, BX = -255, BW = 715;
    L.forEach((i, j) => { const y = ys[j], tp = T.tPass(i), t = T.tI(j), si = T.steps.indexOf(i), ts = si > 0 ? f3(T.tPass(T.steps[si - 1]) + tu(.04)) : f3((tp ?? 0) - tu(.3));
      mom(p, c, d, i, SX, y, 165, { t }); const bg = popAt(p, BX + BW / 2, y + 34, t); R(bg, BX, y + 12, BW, 46, 23, { sw: 3, stroke: TL_(.45) });
      if (tp != null) R(mvG(p, { px: BX, py: y + 35, sx: [[0, 0], [ts, 0], [tp, 1, 'io']] }), BX + 7, y + 19, BW - 14, 32, 16, DOTF());
      const X = i === 'r' ? T.R0 : T.P[i]; if (X && X.label) { const g = popAt(p, BX, y - 30, f3(t + tu(.1))), w2 = T.tPass(i) == null ? mvG(g, { o: i === 'r' ? [[0, FAINT + .1]] : [[0, 1], [T.H, 1], [f3(T.H + tu(.3)), .5, 'io']] }) : g; txt(w2, X.label, BX, y - 14, { size: 46, maxW: BW, weight: 800, color: C.ink, anchor: 'start' }); } }); }); });

  /* 22 TILE GRID (การ์ดสี่ช่อง): the moments on tiles in a 2 × 2 grid, read left to right, top to bottom; each tile lights its edge as time passes it */
  variant('grid', 'การ์ดสี่ช่อง', (d, c) => { art(c, p => { const T = TQ(d), L = items(T), k = L.length, tw2 = k <= 2 ? 420 : 410, th = k <= 2 ? 460 : 310;
    const P = k === 1 ? [[0, 0]] : k === 2 ? [[-230, 0], [230, 0]] : k === 3 ? [[-225, -168], [225, -168], [0, 168]] : [[-225, -168], [225, -168], [-225, 168], [225, 168]];
    L.forEach((i, j) => { const [x, y] = P[j], t = T.tI(j), tp = T.tPass(i), g = popAt(p, x, y, t); R(g, x - tw2 / 2, y - th / 2, tw2, th, 30, F(4)); if (tp != null) R(litOn(g, tp), x - tw2 / 2, y - th / 2, tw2, th, 30, { sw: 5, stroke: TA(.8) });
      mom(p, c, d, i, x, f1(y - (th > 400 ? 50 : 36)), k <= 2 ? 210 : 172, { t: f3(t + tu(.06)) }); mword(p, d, i, x, f1(y + th / 2 - 44), { size: 42, maxW: tw2 - 40, wrap: 'up' }); }); }); });

  /* 23 HALF RING (ครึ่งวงเวลา): a thick half ring; the moments stand round it; a lit dot runs along the ring and the ring behind it fills with light; the moment where time is shows inside */
  variant('halfring', 'ครึ่งวงเวลา', (d, c) => { art(c, p => { const T = TQ(d), L = items(T), k = L.length, CX = 0, CY = 210, RM = 315, RB = 200, AN = L.map((_, j) => k === 1 ? 270 : 190 + 160 * j / (k - 1)), ang = i => AN[L.indexOf(i)];
    const band = `M ${CX - RB} ${CY} A ${RB} ${RB} 0 0 1 ${CX + RB} ${CY}`; way(p, band, T.tA, tu(.4), 22, .14); litPath(p, band, frK(T, i => f3((ang(i) - 180) / 180), 0), 22);
    L.forEach((i, j) => { const [x, y] = Pc(CX, CY, RM, AN[j]); mom(p, c, d, i, x, y, 170, { shape: 'circ' }); });
    curveRunner(p, T, f => Pc(CX, CY, RB, 180 + 180 * f), i => f3((ang(i) - 180) / 180), { r: 20 });
    L.forEach(i => { const g = sub(p); on(g, p, 0, { o: winO(T, i) }); mword(p, d, i, CX, CY - 20, { g, size: 50, maxW: 300, t: 0, wrap: 'mid' }); }); }); });

  /* 24 CHEVRONS (ลูกศรต่อขบวน): a band of arrow segments, one per moment, with the moment standing over its segment; a segment fills as time passes through */
  variant('chevron', 'ลูกศรต่อขบวน', (d, c) => { art(c, p => { const T = TQ(d), L = items(T), k = L.length, GP = 14, w = f1((940 - (k - 1) * GP) / k), xs = rowXs(k, w, GP), Y = 200, h = 130, a = 36;
    const chev = x => { const l = x - w / 2, r = x + w / 2; return pathOf([[l, Y - h / 2], [r - a, Y - h / 2], [r, Y], [r - a, Y + h / 2], [l, Y + h / 2], [l + a, Y]]); };
    L.forEach((i, j) => { const x = xs[j], tp = T.tPass(i), t = T.tI(j), g = popAt(p, x, Y, t); g.path(chev(x), Object.assign(F(3.6), { 'stroke-linejoin': 'round' })); if (tp != null) litOn(g, tp).path(chev(x), { fill: TA(.3), sw: 4, stroke: ACC1, 'stroke-linejoin': 'round' });
      mom(p, c, d, i, x, -70, Math.min(196, w - 20), { t: f3(t + tu(.08)) }); mword(p, d, i, f1(x + 6), Y + 15, { size: 42, maxW: w - 90, wrap: 'mid' }); }); }); });

  /* 25 SPINE (แกนกลางขึ้นบน): an upright line in the middle; the moments sit on alternate sides from the bottom up; a lit dot climbs it, the line lit behind */
  variant('spine', 'แกนกลางขึ้นบน', (d, c) => { art(c, p => { const T = TQ(d), L = items(T), k = L.length, st = k >= 4 ? 150 : k === 3 ? 200 : 260, Ys = L.map((_, j) => f1((k - 1) / 2 * st - j * st + 10)), SX = 215;
    way(p, `M 0 ${f1(Ys[0] + 90)} L 0 ${f1(Ys[k - 1] - 90)}`, T.tA, tu(.5), 5, .45); Ys.forEach((y, j) => popAt(p, 0, y, T.tI(j)).circle(0, y, 16, F(3.4))); if (k > 1) litPath(p, `M 0 ${Ys[0]} L 0 ${Ys[k - 1]}`, frK(T, i => k > 1 ? L.indexOf(i) / (k - 1) : 0, 0), 7);
    L.forEach((i, j) => { const y = Ys[j], sd = j % 2 ? 1 : -1, x = sd * SX, t = T.tI(j); popAt(p, sd * 70, y, t).line(sd * 28, y, sd * (SX - 92), y, DASH(.6)); mom(p, c, d, i, x, y, 172, { t });
      mword(p, d, i, sd * (SX + 108), y + 15, { size: 42, maxW: 170, anchor: sd < 0 ? 'end' : 'start' }); });
    curveRunner(p, T, f => [0, f1(lerp(Ys[0], Ys[k - 1], f))], i => k > 1 ? L.indexOf(i) / (k - 1) : 0, { r: 20 }); }); });

  /* 26 ORBIT (วงโคจรเวลา): the moments on a wide loop; a lit dot travels round it, the loop behind it lit; the moment where time is shows in the middle */
  variant('orbit', 'วงโคจรเวลา', (d, c) => { art(c, p => { const T = TQ(d), L = items(T), k = L.length, CX = 0, CY = 30, RX = 390, RY = 222, E = Array.from({ length: 121 }, (_, m) => [f1(CX + RX * Math.cos(rad(-90 + 3 * m))), f1(CY + RY * Math.sin(rad(-90 + 3 * m)))]);
    const at = byLen(E), fr = i => L.indexOf(i) / k; p.path(pathOf(E, false), DASH(.5)); litPath(p, pathOf(E, false), frK(T, fr, 0), 6); curveRunner(p, T, at, fr, { r: 16 });
    L.forEach((i, j) => mom(p, c, d, i, ...at(j / k), 172, { shape: 'circ' }));
    L.forEach(i => { const g = sub(p); on(g, p, 0, { o: winO(T, i) }); mword(p, d, i, CX, CY + 16, { g, size: 56, maxW: 420, t: 0, wrap: 'mid' }); }); }); });

  /* 27 GROWING DOTS (จุดโตตามเวลา): the moments start as small rounds on a thread; each grows to full size when time reaches it */
  variant('grow', 'จุดโตตามเวลา', (d, c) => { art(c, p => { const T = TQ(d), L = items(T), k = L.length, s = k >= 4 ? 196 : 220, P = rowPos(k, 0, -20, s, k >= 4 ? 34 : 70);
    if (k > 1) way(p, `M ${P[0][0]} -20 L ${P[k - 1][0]} -20`, T.tA, tu(.4), 3, .4);
    L.forEach((i, j) => { const [x, y] = P[j], tp = T.tPass(i), t = T.tI(j), K = { px: x, py: y, s: tp == null ? [[0, .6]] : [[0, .6], [f3(tp - tu(.32)), .6], [tp, 1, 'io']] }, g = mvG(popAt(p, x, y, t), K);
      mom(p, c, d, i, x, y, s, { shape: 'circ', g, mv: noMv(K), t }); mword(p, d, i, x, f1(y + s / 2 + 60), { size: 44, maxW: s + 30 }); }); }); });

  /* 28 DAY DOTS (การ์ดจุดนับวัน): a card; under each moment a block of little day-dots fills dot by dot through that moment's stretch of time */
  variant('days', 'การ์ดจุดนับวัน', (d, c) => { art(c, p => { const T = TQ(d), L = items(T), k = L.length, bw = 840 / k, xs = rowXs(k, bw, 0);
    crd(p, 0, 10, 930, 640);
    L.forEach((i, j) => { const x = xs[j], tp = T.tPass(i), t = T.tI(j), si = T.steps.indexOf(i), ts = si > 0 ? f3(T.tPass(T.steps[si - 1]) + tu(.04)) : f3((tp ?? 0) - tu(.3)), nc = Math.max(2, Math.min(6, Math.floor((bw - 30) / 40))), D = [];
      for (let a = 0; a < nc; a++) for (let b = 0; b < 3; b++) D.push([f1(x + (a - (nc - 1) / 2) * 40), 130 + b * 52]);
      const dg = popAt(p, x, 180, f3(t + tu(.1))); D.forEach(([dx, dy]) => dg.circle(dx, dy, 12, { sw: 2.4, stroke: TL_(.5) }));
      if (tp != null) D.forEach(([dx, dy], m) => { const u = f3(lerp(ts, tp, (m + 1) / D.length)), g = sub(p); on(g, p, 0, { o: [[0, 0], [f3(u - tu(.05)), 0], [u, 1]] }); g.circle(dx, dy, 12, DOTF()); });
      mom(p, c, d, i, x, -170, 172, { t }); mword(p, d, i, x, 0, { size: 42, maxW: bw - 30 }); }); }); });

  /* 29 NOW LINE (เส้นตอนนี้): a card with the moments in a row; a lit upright "now" line sweeps across it, the time already gone shaded behind it */
  variant('nowline', 'เส้นตอนนี้', (d, c) => { art(c, p => { const T = TQ(d), L = items(T), k = L.length, s = k >= 4 ? 170 : 196, GP = k >= 4 ? 40 : 76, xs = rowXs(k, s, GP), CL0 = -450, CW = 900, Y = -10;
    crd(p, 0, 20, 940, 600); const nx = i => { const j = L.indexOf(i); return j === k - 1 ? f1(Math.min(430, xs[j] + s / 2 + GP / 2)) : f1(xs[j] + s / 2 + GP / 2); };
    R(mvG(p, { px: CL0, py: 20, sx: frK(T, i => f3((nx(i) - CL0) / CW), .005), o: fadeIn(T.tA + tu(.3), .1) }), CL0, -260, CW, 560, 24, { fill: TA(.1), sw: 0, stroke: 'none' });
    L.forEach((i, j) => { mom(p, c, d, i, xs[j], Y, s); mword(p, d, i, xs[j], f1(Y + s / 2 + 60), { size: 42, maxW: s + GP - 10 }); });
    const ln = mvG(p, { px: 0, py: 20, x: frK(T, nx, CL0), o: fadeIn(T.tA + tu(.3), .1) }); ln.line(0, -250, 0, 290, { sw: 6, stroke: ACC1 }); ln.circle(0, -250, 14, DOTF()); }); });

  /* 30 FLOATING CARD (การ์ดลอยตามเวลา): a line of stops along the bottom; a small card with a pointer floats over the stop where time is, showing that moment */
  variant('floatcard', 'การ์ดลอยตามเวลา', (d, c) => { art(c, p => { const T = TQ(d), L = items(T), k = L.length, S = T.steps, xs = rowXs(k, 200, k >= 4 ? 30 : 90), LY = 225, CY = -80, cw = 300, ch = 300;
    if (k > 1) way(p, `M ${xs[0] - 60} ${LY} L ${xs[k - 1] + 60} ${LY}`, T.tA, tu(.4), 4, .45);
    L.forEach((i, j) => { const x = xs[j], tp = T.tPass(i); popAt(p, x, LY, T.tI(j)).circle(x, LY, 18, F(3.4)); if (tp != null) litOn(p, tp).circle(x, LY, 11, DOTF());
      const X = i === 'r' ? T.R0 : T.P[i], str = X && X.label; if (str) { const g = popAt(p, x, LY + 60, f3(T.tI(j) + tu(.1))), w2 = tp == null ? mvG(g, { o: i === 'r' ? [[0, FAINT + .1]] : [[0, 1], [T.H, 1], [f3(T.H + tu(.3)), .5, 'io']] }) : g; txt(w2, str, x, LY + 76, { size: 42, maxW: 220, weight: 800, color: C.ink, wrap: 'mid' }); } });
    if (!S.length) return; const t0 = T.tPass(S[0]), K = { px: 0, py: CY, x: frK(T, i => xs[L.indexOf(i)]), o: fadeIn(tu(.3), .14) }, g = mvG(p, K);
    g.path(`M ${-cw / 2 + 30} ${CY - ch / 2} L ${cw / 2 - 30} ${CY - ch / 2} Q ${cw / 2} ${CY - ch / 2} ${cw / 2} ${CY - ch / 2 + 30} L ${cw / 2} ${CY + ch / 2 - 30} Q ${cw / 2} ${CY + ch / 2} ${cw / 2 - 30} ${CY + ch / 2} L 26 ${CY + ch / 2} L 0 ${CY + ch / 2 + 34} L -26 ${CY + ch / 2} L ${-cw / 2 + 30} ${CY + ch / 2} Q ${-cw / 2} ${CY + ch / 2} ${-cw / 2} ${CY + ch / 2 - 30} L ${-cw / 2} ${CY - ch / 2 + 30} Q ${-cw / 2} ${CY - ch / 2} ${-cw / 2 + 30} ${CY - ch / 2} Z`, F(4));
    const mid = k2 => k2 <= 0 ? tu(.36) : f3((T.tPass(S[k2 - 1]) + tu(.04) + T.tPass(S[k2])) / 2);
    S.forEach((i, k2) => { const a = mid(k2), b = k2 < S.length - 1 ? mid(k2 + 1) : null, io = [[0, 0], [f3(a - tu(.06)), 0], [f3(a + tu(.06)), 1, 'io']].concat(b != null ? [[f3(b - tu(.06)), 1], [f3(b + tu(.06)), 0, 'io']] : []), gi = sub(g); on(gi, p, 0, { o: io });
      mom(p, c, d, i, 0, CY, 210, { g: gi, mv: noMv(K), io, rip: false, t: tu(.3) }); }); }); });

  let CPN = 0;
  function clipPathG(p, dd) { const svg = p.g.ownerSVGElement, cp = document.createElementNS(NS, 'clipPath'), e = document.createElementNS(NS, 'path'); cp.id = 'b09tcp' + (++CPN); e.setAttribute('d', dd); cp.appendChild(e); (svg.querySelector('defs') || svg).appendChild(cp); return sub(p, { 'clip-path': `url(#${cp.id})` }); }
  /* the moment where time is, shown big in one place: the first one from the start, then each from its pass time (cross-fade) */
  const nowO = (T, i) => { const S = T.steps, k2 = S.indexOf(i); if (k2 < 0) return [[0, 0]]; if (k2 > 0) return winO(T, i); return [[0, 0], [tu(.3), 0], [tu(.46), 1, 'io']].concat(S.length > 1 ? [[f3(T.tPass(S[1]) - tu(.12)), 1], [T.tPass(S[1]), 0, 'io']] : []); };
  function nowShow(p, c, d, T, x, y, sz, o = {}) { T.steps.forEach(i => { const io = nowO(T, i), g = sub(p); on(g, p, 0, { o: io }); mom(p, c, d, i, x, y, sz, { g, io, t: tu(.3), shape: o.shape }); if (o.wy != null) mword(p, d, i, o.wx ?? x, o.wy, { g, size: o.ws || 50, maxW: o.wm || 400, t: 0, anchor: o.anchor, wrap: o.anchor ? null : undefined }); }); }

  /* 31 COUNTDOWN RING (วงนับถอยหลัง): a ring cut into one lit part per moment; when time moves on, the part it leaves goes dark — what stays lit is the time left; the moment where time is shows in the middle */
  variant('countdown', 'วงนับถอยหลัง', (d, c) => { art(c, p => { const T = TQ(d), L = items(T), k = L.length, S = T.steps, CX = 0, CY = -10, RR = 280, GA = k > 1 ? 4 : 0;
    const seg = (a0, a1) => { const [x0, y0] = Pc(CX, CY, RR, a0), [x1, y1] = Pc(CX, CY, RR, a1); return `M ${x0} ${y0} A ${RR} ${RR} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1} ${y1}`; };
    L.forEach((i, j) => { const dd = seg(-90 + 360 * j / k + GA, -90 + 360 * (j + 1) / k - GA - (k === 1 ? .5 : 0)), t = T.tI(j), si = S.indexOf(i), tl = si >= 0 && si < S.length - 1 ? T.tPass(S[si + 1]) : null;
      popAt(p, CX, CY, t).path(dd, { sw: 30, stroke: TL_(.14) }); const l = sub(p); on(l, p, 0, { o: [[0, 0], [t, 0], [f3(t + tu(.16)), 1]].concat(tl != null ? [[f3(tl - tu(.24)), 1], [tl, .1, 'io']] : []) }); l.path(dd, { sw: 20, stroke: ACC1 }); });
    nowShow(p, c, d, T, CX, CY - 40, 230, { wy: CY + 140, ws: 48, wm: 380 }); }); });

  /* 32 STACKING BLOCKS (กองเวลาซ้อนขึ้น): a column of places, bottom up; each moment's block drops in when time reaches it; the moment where time is stands big beside the pile */
  variant('blocks', 'กองเวลาซ้อนขึ้น', (d, c) => { art(c, p => { const T = TQ(d), L = items(T), k = L.length, BX = -230, BW = 400, GP = 14, bh = f1(Math.min(130, (600 - (k - 1) * GP) / k)), B = 300;
    L.forEach((i, j) => { const y = f1(B - bh / 2 - j * (bh + GP)), tp = T.tPass(i), t = T.tI(j), X = i === 'r' ? T.R0 : T.P[i], str = X && X.label;
      R(popAt(p, BX, y, t), BX - BW / 2, y - bh / 2, BW, bh, 22, DASH(.5));
      if (tp == null) { if (str) txt(mvG(popAt(p, BX, y, t), { o: [[0, .45]] }), str, BX, y + 15, { size: 42, maxW: BW - 40, weight: 800, color: C.ink }); return; }
      const t0 = f3(tp - tu(.36)), g = mvG(CL(p), { px: BX, py: y, y: [[0, -720], [t0, -720], [tp, 0, 'io']], o: [[0, 0], [t0, 0], [f3(t0 + tu(.03)), 1]] });
      R(g, BX - BW / 2, y - bh / 2, BW, bh, 22, F(4)); R(litOn(g, tp), BX - BW / 2 + 8, y - bh / 2 + 8, BW - 16, bh - 16, 16, { fill: TA(.2), sw: 0, stroke: 'none' }); if (str) txt(g, str, BX, y + 15, { size: 42, maxW: BW - 40, weight: 800, color: C.ink }); });
    nowShow(p, c, d, T, 250, 0, 280); }); });

  /* 33 BIG ARROW (ลูกศรใหญ่เดินหน้า): one wide arrow holds the moments; it fills with light from its tail as time moves forward */
  variant('arrow', 'ลูกศรใหญ่เดินหน้า', (d, c) => { art(c, p => { const T = TQ(d), L = items(T), k = L.length, s = 170, xs = rowXs(k, s, k >= 4 ? 18 : 56, -90), Y = 20;
    const AD = pathOf([[-480, -110], [300, -110], [300, -190], [480, 20], [300, 230], [300, 150], [-480, 150]]); mvG(CL(p), ent('left', 0, Y, 960, T.tA)).path(AD, Object.assign(F(4), { 'stroke-linejoin': 'round' }));
    const cg = clipPathG(p, AD); R(mvG(cg, { px: -480, py: Y, sx: frK(T, i => { const j = L.indexOf(i); return f3(j === k - 1 ? 1 : (xs[j] + s / 2 + 9 + 480) / 960); }, .005) }), -480, -200, 960, 440, 0, { fill: TA(.22), sw: 0, stroke: 'none' });
    L.forEach((i, j) => { mom(p, c, d, i, xs[j], Y, s, { t: f3(T.tI(j) + tu(.2)) }); mword(p, d, i, xs[j], -168, { wrap: 'up', size: 42, maxW: s + 16 }); }); }); });

  /* 34 WAITING DOTS (จุดรอเวลา): the moments in a row with three little dots between each; the dots light one by one as time moves on to the next moment */
  variant('ellipsis', 'จุดรอเวลา', (d, c) => { art(c, p => { const T = TQ(d), L = items(T), k = L.length, s = k >= 4 ? 172 : 200, GP = k >= 4 ? 72 : 120, P = rowPos(k, 0, -30, s, GP);
    for (let j = 0; j < k - 1; j++) { const mx = f1((P[j][0] + P[j + 1][0]) / 2), tp = T.tPass(L[j + 1]), si = T.steps.indexOf(L[j + 1]), ts = si > 0 ? f3(T.tPass(T.steps[si - 1]) + tu(.04)) : null;
      [-20, 0, 20].forEach((dx, m) => { popAt(p, mx + dx, -30, T.tI(j + 1)).circle(mx + dx, -30, 7, { fill: TL_(.35), sw: 0, stroke: 'none' }); if (tp != null && ts != null) { const u = f3(lerp(ts, tp, (m + 1) / 3)), g = sub(p); on(g, p, 0, { o: [[0, 0], [f3(u - tu(.06)), 0], [u, 1]] }); g.circle(mx + dx, -30, 9, DOTF()); } }); }
    L.forEach((i, j) => { mom(p, c, d, i, ...P[j], s); mword(p, d, i, P[j][0], f1(-30 + s / 2 + 62), { size: 44, maxW: s + GP - 10 }); }); }); });

  /* 35 ELBOW STEPS (ทางหักศอกลงเฉียง): the moments step down from top-left to bottom-right, joined by right-angle links that light as time passes along */
  variant('elbow', 'ทางหักศอกลงเฉียง', (d, c) => { art(c, p => { const T = TQ(d), L = items(T), k = L.length, s = k === 1 ? 230 : 186, xs = rowXs(k, s, k >= 4 ? 34 : 80), st = k >= 4 ? 140 : k === 3 ? 165 : 190, ys = rowXs(k, st, 0, -20);
    for (let j = 0; j < k - 1; j++) { const x = xs[j], y = ys[j], xn = xs[j + 1], yn = ys[j + 1], dd = `M ${x + s / 2 + 4} ${y} L ${xn} ${y} L ${xn} ${f1(yn - s / 2 - 4)}`, tp = T.tPass(L[j + 1]);
      way(p, dd, T.tI(j + 1), tu(.3), 5, .45); if (tp != null) litPath(p, dd, [[0, 0], [f3(tp - tu(.3)), 0], [tp, 1, 'io']], 7); }
    L.forEach((i, j) => { mom(p, c, d, i, xs[j], ys[j], s); mword(p, d, i, xs[j], f1(ys[j] + s / 2 + 42), { size: 40, maxW: 210, wrap: null }); }); }); });

  /* 36 SECTIONED CARD (การ์ดแบ่งตอน): one wide card cut into a section per moment; a section fills with a soft light as time passes it */
  variant('sections', 'การ์ดแบ่งตอน', (d, c) => { art(c, p => { const T = TQ(d), L = items(T), k = L.length, CW = 940, sw = CW / k, xs = rowXs(k, sw, 0), s = Math.min(200, sw - 40);
    crd(p, 0, 10, CW, 560); for (let m = 1; m < k; m++) { const x = f1(-CW / 2 + m * sw), g = sub(p); on(g, p, 0, { o: fadeIn(T.tI(m), .1) }); g.line(x, -240, x, 260, DASH(.5)); }
    L.forEach((i, j) => { const x = xs[j], tp = T.tPass(i); if (tp != null) { const g = sub(p); on(g, p, 0, { o: [[0, 0], [f3(tp - tu(.24)), 0], [tp, 1, 'io']] }); R(g, x - sw / 2 + 14, -246, sw - 28, 512, 20, { fill: TA(.12), sw: 0, stroke: 'none' }); }
      mom(p, c, d, i, x, -40, s); mword(p, d, i, x, 150, { size: 44, maxW: sw - 30 }); }); }); });

  /* 37 GATHER (รวมลงที่ปลายทาง): the earlier moments in a row on top; lines from each run down into the last one, big at the bottom; each line lights as time passes its moment */
  variant('funnel', 'รวมลงที่ปลายทาง', (d, c) => { art(c, p => { const T = TQ(d), L = items(T), k = L.length, top = L.slice(0, -1), m = top.length, s = 172, xs = rowXs(m, s, m >= 3 ? 70 : 140), BY = k === 1 ? 0 : 150, BS = 230;
    top.forEach((i, j) => { const x = xs[j], dd = `M ${x} ${-180 + s / 2 + 6} Q ${x} ${BY - 60} ${f1(x * .25)} ${BY - BS / 2 - 8}`, tp = T.tPass(i); way(p, dd, T.tI(j + 1), tu(.3), 4, .4); if (tp != null) litPath(p, dd, [[0, 0], [f3(tp - tu(.3)), 0], [tp, 1, 'io']], 6);
      mom(p, c, d, i, x, -180, s); mword(p, d, i, x, -300, { wrap: 'up', size: 42, maxW: s + 50 }); });
    const lst = L[k - 1]; mom(p, c, d, lst, 0, BY, BS, { t: T.tI(m) }); mword(p, d, lst, BS / 2 + 30, BY + 18, { anchor: 'start', size: 50, maxW: 330, wrap: null, t: f3(T.tI(m) + tu(.12)) }); }); });

  /* 38 HONEYCOMB (หกเหลี่ยมต่อกัน): the moments in hexagons stepping up and down along a line that lights as time passes */
  variant('hexes', 'หกเหลี่ยมต่อกัน', (d, c) => { art(c, p => { const T = TQ(d), L = items(T), k = L.length, s = k >= 4 ? 210 : 230, xs = rowXs(k, s * .86, k >= 4 ? 20 : 60), P = xs.map((x, j) => [x, j % 2 ? 60 : -60]);
    if (k > 1) { way(p, pathOf(P, false), T.tA, tu(.4), 5, .35); litPath(p, pathOf(P, false), frK(T, i => L.indexOf(i) / (k - 1), 0), 8); }
    L.forEach((i, j) => { mom(p, c, d, i, ...P[j], s, { shape: 'hex', iw: s * .62 }); const up = j % 2 === 0; mword(p, d, i, P[j][0], up ? f1(P[j][1] - s / 2 - 36) : f1(P[j][1] + s / 2 + 56), { size: 42, maxW: s, wrap: up ? 'up' : 'down' }); }); }); });

  /* 39 RUNNING EDGE (ขอบการ์ดวิ่ง): a card whose edge lights up all the way round as time goes — a lit dot leads it; the moments inside light as it passes them */
  variant('border', 'ขอบการ์ดวิ่ง', (d, c) => { art(c, p => { const T = TQ(d), L = items(T), k = L.length, x0 = -450, y0 = -250, W2 = 900, H2 = 540, r = 50, s = k >= 4 ? 180 : 200, P = rowPos(k, 0, -20, s, k >= 4 ? 40 : 80);
    const pts = [[x0 + r, y0]], arc = (cx, cy, a0) => { for (let m = 1; m <= 8; m++) pts.push(Pc(cx, cy, r, a0 + 90 * m / 8)); };
    pts.push([x0 + W2 - r, y0]); arc(x0 + W2 - r, y0 + r, -90); pts.push([x0 + W2, y0 + H2 - r]); arc(x0 + W2 - r, y0 + H2 - r, 0); pts.push([x0 + r, y0 + H2]); arc(x0 + r, y0 + H2 - r, 90); pts.push([x0, y0 + r]); arc(x0 + r, y0 + r, 180);
    const dd = pathOf(pts, false), fr = i => f3((L.indexOf(i) + 1) / k); p.path(dd, F(4)); litPath(p, dd, frK(T, fr, 0), 8); curveRunner(p, T, byLen(pts), fr, { r: 16 });
    L.forEach((i, j) => { mom(p, c, d, i, ...P[j], s); mword(p, d, i, P[j][0], f1(-20 + s / 2 + 62), { size: 44, maxW: s + 30 }); }); }); });

  /* 40 FALL INTO LINE (เรียงเข้าแถว): the moments float loose and tilted above a line; when time reaches one it settles into its place on the line, in order */
  variant('settle', 'เรียงเข้าแถว', (d, c) => { art(c, p => { const T = TQ(d), L = items(T), k = L.length, cw = k >= 4 ? 200 : 230, ch = 270, xs = rowXs(k, cw, k >= 4 ? 30 : 70), FY = 105, LY = FY + ch / 2 + 22;
    way(p, `M ${xs[0] - cw / 2} ${LY} L ${xs[k - 1] + cw / 2} ${LY}`, T.tA, tu(.4), 5, .45);
    L.forEach((i, j) => { const x = xs[j], tp = T.tPass(i), t = T.tI(j), dx = [30, -26, 22, -30][j], dy = [-250, -205, -240, -215][j], a = [-10, 8, -7, 10][j];
      const K = { px: x, py: FY, x: tp == null ? [[0, dx]] : [[0, dx], [f3(tp - tu(.36)), dx], [tp, 0, 'io']], y: tp == null ? [[0, dy]] : [[0, dy], [f3(tp - tu(.36)), dy], [tp, 0, 'io']], r: tp == null ? [[0, a]] : [[0, a], [f3(tp - tu(.36)), a], [tp, 0, 'io']], o: fadeIn(t, .12) }, g = mvG(p, K);
      R(g, x - cw / 2, FY - ch / 2, cw, ch, 28, F(4)); mom(p, c, d, i, x, FY - 38, 165, { g, mv: noMv(K), t }); mword(p, d, i, x, FY + 88, { g, size: 40, maxW: cw - 30, t }); }); }); });

  /* 41 LIFT ONE BY ONE (ยกขึ้นทีละใบ): a row of cards; each lifts up and lights its edge when time reaches it — the ones still to come stay down */
  variant('lift', 'การ์ดยกขึ้นทีละใบ', (d, c) => { art(c, p => { const T = TQ(d), L = items(T), k = L.length, cw = k >= 4 ? 205 : 240, ch = 330, xs = rowXs(k, cw, k >= 4 ? 28 : 60), Y = 50;
    L.forEach((i, j) => { const x = xs[j], tp = T.tPass(i), t = T.tI(j), E = ent('rise', x, Y, ch, t), K = { px: x, py: Y, y: E.y.concat(tp != null ? [[f3(tp - tu(.3)), 0], [tp, -64, 'io']] : []), o: E.o }, g = mvG(CL(p), K);
      R(g, x - cw / 2, Y - ch / 2, cw, ch, 30, F(4)); if (tp != null) R(litOn(g, tp), x - cw / 2, Y - ch / 2, cw, ch, 30, { sw: 5, stroke: TA(.8) });
      mom(p, c, d, i, x, Y - 45, 170, { g, mv: noMv(K), t }); mword(p, d, i, x, Y + 105, { g, size: 42, maxW: cw - 30, t }); }); }); });

  /* 42 SPOKES (แฉกจากศูนย์กลาง): the moments around a centre, each on a spoke; the spokes light in turn, clockwise, as time passes */
  variant('spokes', 'แฉกจากศูนย์กลาง', (d, c) => { art(c, p => { const T = TQ(d), L = items(T), k = L.length, CX = 0, CY = 10, RX = 340, RY = 215, s = 172, AN = [[-90], [180, 0], [-150, -30, 90], [-145, -35, 35, 145]][k - 1];
    const P = AN.map(a => [f1(CX + RX * Math.cos(rad(a))), f1(CY + RY * Math.sin(rad(a)))]);
    L.forEach((i, j) => { const [x, y] = P[j], dx = x - CX, dy = y - CY, len = Math.hypot(dx, dy), ux = dx / len, uy = dy / len, a0 = [f1(CX + ux * 62), f1(CY + uy * 62)], a1 = [f1(x - ux * (s * .62)), f1(y - uy * (s * .62))], dd = `M ${a0[0]} ${a0[1]} L ${a1[0]} ${a1[1]}`, tp = T.tPass(i);
      way(p, dd, T.tI(j), tu(.3), 5, .45); if (tp != null) litPath(p, dd, [[0, 0], [f3(tp - tu(.3)), 0], [tp, 1, 'io']], 8);
      mom(p, c, d, i, x, y, s); const up = y < CY - 20; mword(p, d, i, x, up ? f1(y - s / 2 - 36) : f1(y + s / 2 + 52), { size: 42, maxW: 260, wrap: up ? 'up' : 'down' }); });
    const h = popAt(p, CX, CY, T.tA); h.circle(CX, CY, 52, F(4)); if (T.steps.length) litOn(p, T.tPass(T.steps[0])).circle(CX, CY, 24, DOTF()); }); });

  /* 43 TWO LANES (ย้ายแถวเมื่อถึงเวลา): every moment waits in the lower lane; when time reaches one it moves up into the upper lane, lit */
  variant('shift', 'ย้ายแถวเมื่อถึงเวลา', (d, c) => { art(c, p => { const T = TQ(d), L = items(T), k = L.length, xs = rowXs(k, 210, k >= 4 ? 26 : 60), TY = -160, DY = 315;
    crd(p, 0, TY, 960, 290, { r: 36 }); R(popAt(p, 0, TY + DY, T.tA), -480, TY + DY - 145, 960, 290, 36, DASH(.5));
    L.forEach((i, j) => { const x = xs[j], tp = T.tPass(i), t = T.tI(j), K = { px: x, py: TY, y: tp == null ? [[0, DY]] : [[0, DY], [f3(tp - tu(.36)), DY], [tp, 0, 'io']], o: fadeIn(t, .12) }, g = mvG(p, K);
      mom(p, c, d, i, x, TY - 30, 170, { g, mv: noMv(K), t }); mword(p, d, i, x, TY + 100, { g, size: 42, maxW: 220, t, wrap: 'mid' }); }); }); });

  /* 44 ABOVE & BELOW (สลับบนล่างเส้นเวลา): a straight line across the middle; the moments hang above and below it in turn on short stems; a lit dot runs the line */
  variant('abovebelow', 'สลับบนล่างเส้นเวลา', (d, c) => { art(c, p => { const T = TQ(d), L = items(T), k = L.length, s = 172, xs = rowXs(k, s, k >= 4 ? 60 : 110);
    way(p, `M -470 0 L 470 0`, T.tA, tu(.4), 5, .45);
    L.forEach((i, j) => { const x = xs[j], up = j % 2 === 0, y = up ? -170 : 170, tp = T.tPass(i), g = popAt(p, x, 0, T.tI(j)); g.circle(x, 0, 14, F(3.4)); g.line(x, up ? -16 : 16, x, up ? y + s / 2 + 4 : y - s / 2 - 4, DASH(.6));
      if (tp != null) litOn(p, tp).line(x, up ? -16 : 16, x, up ? y + s / 2 + 4 : y - s / 2 - 4, { sw: 4, stroke: ACC1 });
      mom(p, c, d, i, x, y, s); mword(p, d, i, x, up ? f1(y - s / 2 - 34) : f1(y + s / 2 + 52), { size: 42, maxW: 240, wrap: up ? 'up' : 'down' }); });
    runner(p, T, i => [xs[L.indexOf(i)], 0], { r: 16 }); }); });

  /* 45 RING EACH (วงโหลดรอบช่อง): every moment has its own ring; a ring fills round with light over that moment's stretch of time */
  variant('ringeach', 'วงโหลดรอบช่อง', (d, c) => { art(c, p => { const T = TQ(d), L = items(T), k = L.length, s = 176, rr = s / 2 + 22, P = rowPos(k, 0, -30, 2 * rr, k >= 4 ? 18 : 60);
    L.forEach((i, j) => { const [x, y] = P[j], tp = T.tPass(i), si = T.steps.indexOf(i), ts = si > 0 ? f3(T.tPass(T.steps[si - 1]) + tu(.04)) : f3((tp ?? 0) - tu(.34));
      popAt(p, x, y, T.tI(j)).circle(x, y, rr, DASH(.45)); if (tp != null) litPath(p, arcD(x, y, rr, 1), [[0, 0], [ts, 0], [tp, 1, 'io']], 7);
      mom(p, c, d, i, x, y, s, { shape: 'circ' }); mword(p, d, i, x, f1(y + rr + 52), { size: 44, maxW: 2 * rr }); }); }); });

  /* 46 ZOOM OUT (ซูมออกทีละช่วง): it starts close on the first moment; as time moves on the view pulls back, moment by moment, until the whole row shows */
  variant('zoomout', 'ซูมออกทีละช่วง', (d, c) => { art(c, p => { const T = TQ(d), L = items(T), k = L.length, s = 190, P = rowPos(k, 0, -10, s, k >= 4 ? 50 : 90), u = i => k > 1 ? L.indexOf(i) / (k - 1) : 1, z = i => f3(lerp(1.45, 1, u(i))), cx = i => lerp(P[0][0], 0, u(i));
    const K = { px: 0, py: -10, s: frK(T, z), x: frK(T, i => f1(-z(i) * cx(i))) }; if (!T.steps.length) { K.s = [[0, 1]]; K.x = [[0, 0]]; } const g = mvG(CL(p), K);
    const lastP = T.steps.length ? L.indexOf(T.steps[T.steps.length - 1]) : k - 1; if (lastP > 0) g.line(P[0][0], -10, P[lastP][0], -10, DASH(.45));
    L.forEach((i, j) => { if (T.tPass(i) == null && T.steps.length) return; const gi = popAt(g, ...P[j], T.tI(j)); mom(p, c, d, i, ...P[j], s, { g: gi, mv: noMv(K), t: T.tI(j), rip: false }); mword(p, d, i, P[j][0], f1(-10 + s / 2 + 58), { g, size: 44, maxW: s + 40 }); }); }); });

  /* 47 DEAL (แจกการ์ดทีละใบ): the moments wait face-down in a pile; when time reaches one it is dealt out, face up, to its place in the row */
  variant('deal', 'แจกการ์ดทีละใบ', (d, c) => { art(c, p => { const T = TQ(d), L = items(T), k = L.length, cw = k >= 4 ? 200 : 230, ch = 280, xs = rowXs(k, cw, k >= 4 ? 30 : 60), RY = -125, DX = 0, DY = 205;
    L.forEach((i, j) => { const tp = T.tPass(i), t0 = tp != null ? f3(tp - tu(.36)) : null, bx = DX + j * 7, by = DY - j * 7, b = sub(p); on(b, p, 0, { o: fadeIn(T.tI(k - 1 - j), .1).concat(t0 != null ? [[t0, 1], [f3(t0 + tu(.02)), 0]] : []) });
      R(b, bx - cw / 2, by - ch / 2, cw, ch, 28, F(4)); R(b, bx - cw / 2 + 22, by - ch / 2 + 22, cw - 44, ch - 44, 18, DASH(.4)); });
    L.forEach((i, j) => { const x = xs[j], tp = T.tPass(i); if (tp == null) return; const t0 = f3(tp - tu(.36)), dx = f1(DX + j * 7 - x), dy = f1(DY - j * 7 - RY), K = { px: x, py: RY, x: [[0, dx], [t0, dx], [tp, 0, 'io']], y: [[0, dy], [t0, dy], [tp, 0, 'io']], r: [[0, 8], [t0, 8], [tp, 0, 'io']], o: [[0, 0], [t0, 0], [f3(t0 + tu(.02)), 1]] }, g = mvG(p, K);
      R(g, x - cw / 2, RY - ch / 2, cw, ch, 28, F(4)); mom(p, c, d, i, x, RY - 42, 170, { g, mv: noMv(K), io: K.o, t: t0 }); mword(p, d, i, x, RY + 92, { g, size: 40, maxW: cw - 30, t: t0 }); }); }); });

  /* 48 NOW & NEXT (การ์ดตอนนี้กับถัดไป): a big "now" card and a smaller faint "next" card beside it; when time moves on, next slides into now and the one after comes in */
  variant('nownext', 'การ์ดตอนนี้กับถัดไป', (d, c) => { art(c, p => { const T = TQ(d), L = items(T), k = L.length, NX = -170, XX = 290, cw = 380, ch = 460;
    const val = (m, cur, f) => { const dd = m - cur; return dd === 0 ? f[0] : dd === 1 ? f[1] : dd > 1 ? f[2] : f[3]; }, XS = [NX, XX, 760, -800], SS = [1, .74, .74, 1], OS = [1, .5, 0, 0];
    const chev = mvG(popAt(p, 70, 0, T.tA), { o: T.steps.length ? frK(T, q => L.indexOf(q) < k - 1 ? 1 : 0) : [[0, 1]] }); if (k > 1) chev.path('M 52 -34 L 86 0 L 52 34', { sw: 7, stroke: TL_(.6) });
    for (let m = k - 1; m >= 0; m--) { const i = L[m], cur = q => L.indexOf(q), t = T.tI(Math.min(m, 1)), O = T.steps.length ? frK(T, q => val(m, cur(q), OS)) : [[0, val(m, 0, OS)]];
      O.splice(0, 1, [0, 0], [t, 0], [f3(t + tu(.16)), O[0][1]]); const K = { px: NX, py: 0, x: T.steps.length ? frK(T, q => f1(val(m, cur(q), XS) - NX)) : [[0, f1(val(m, 0, XS) - NX)]], s: T.steps.length ? frK(T, q => val(m, cur(q), SS)) : [[0, val(m, 0, SS)]], o: O }, g = mvG(CL(p), K);
      R(g, NX - cw / 2, -ch / 2, cw, ch, 40, F(4)); mom(p, c, d, i, NX, -55, 240, { g, mv: noMv(K), io: O, t }); mword(p, d, i, NX, 150, { g, size: 52, maxW: cw - 50, t }); } }); });

  /* 49 UNCOVER (เปิดทีละช่อง): a row of panels under striped covers — the moments show faintly through; when time reaches a panel its cover lifts away */
  variant('uncover', 'เปิดทีละช่อง', (d, c) => { art(c, p => { const T = TQ(d), L = items(T), k = L.length, pw = k >= 4 ? 210 : 240, ph = 400, xs = rowXs(k, pw, k >= 4 ? 26 : 56), Y = 20;
    L.forEach((i, j) => { const x = xs[j], tp = T.tPass(i), t = T.tI(j), io = tp == null ? [[0, 0], [t, 0], [f3(t + tu(.12)), .3]] : [[0, 0], [t, 0], [f3(t + tu(.12)), .3], [f3(tp - tu(.2)), .3], [tp, 1, 'io']], g = mvG(popAt(p, x, Y, t), { o: [[0, 1]] });
      R(g, x - pw / 2, Y - ph / 2, pw, ph, 30, F(4)); const ct = sub(g); on(ct, p, 0, { o: tp == null ? [[0, .3]] : [[0, .3], [f3(tp - tu(.2)), .3], [tp, 1, 'io']] });
      mom(p, c, d, i, x, Y - 60, 170, { g: ct, io, t }); mword(p, d, i, x, Y + 115, { g: ct, size: 42, maxW: pw - 30, t: 0 });
      const cv = mvG(p, { px: x, py: Y, y: tp == null ? [[0, 0]] : [[0, 0], [f3(tp - tu(.32)), 0], [tp, -90, 'io']], o: [[0, 0], [t, 0], [f3(t + tu(.12)), 1]].concat(tp != null ? [[f3(tp - tu(.32)), 1], [tp, 0, 'io']] : []) }), sg = clipG(cv, x - pw / 2 + 10, Y - ph / 2 + 10, pw - 20, ph - 20);
      for (let u = -ph; u < pw; u += 34) sg.line(f1(x - pw / 2 + u), Y + ph / 2, f1(x - pw / 2 + u + ph), Y - ph / 2, { sw: 3, stroke: TL_(.22) }); R(cv, x - pw / 2 + 10, Y - ph / 2 + 10, pw - 20, ph - 20, 22, DASH(.55)); }); }); });

  /* 50 DIAMONDS TURN (เพชรหมุนตั้ง): the moments sit in diamonds on a line; when time reaches one, its diamond turns upright into a square and lights */
  variant('diamonds', 'เพชรหมุนตั้งตามเวลา', (d, c) => { art(c, p => { const T = TQ(d), L = items(T), k = L.length, s = 168, dw = f1(s * 1.414), xs = rowXs(k, dw, k >= 4 ? 4 : 50), Y = -20;
    if (k > 1) { way(p, `M ${xs[0]} ${Y} L ${xs[k - 1]} ${Y}`, T.tA, tu(.4), 4, .4); litPath(p, `M ${xs[0]} ${Y} L ${xs[k - 1]} ${Y}`, frK(T, i => L.indexOf(i) / (k - 1), 0), 7); }
    L.forEach((i, j) => { const x = xs[j], tp = T.tPass(i), g = mvG(popAt(p, x, Y, T.tI(j)), { px: x, py: Y, r: tp == null ? [[0, 45]] : [[0, 45], [f3(tp - tu(.32)), 45], [tp, 0, 'io']] });
      mom(p, c, d, i, x, Y, s, { g, t: T.tI(j) }); mword(p, d, i, x, f1(Y + dw / 2 + 56), { size: 42, maxW: dw - 10 }); }); }); });

  /* ---------- sample data: B09's sentences (A) + stress (B) ---------- */
  const I = (icon, label) => label ? { icon, label } : { icon };
  const SAMPLES = [
    { say: 'สัปดาห์แรก เดือนแรก จนครบปี', points: [I('sprout', 'สัปดาห์แรก'), I('leaf', 'เดือนแรก'), I('trees', 'ครบปี')], at: 2 },
    { say: 'เช้า สาย บ่าย ร้านเต็มตลอด', points: [I('sunrise', 'เช้า'), I('sun', 'สาย'), I('sunset', 'บ่าย')], at: 2, result: I('store', 'ร้านเต็ม') },
    { say: 'เดือนแรกขาดทุน เดือนที่สามเริ่มมีกำไร', points: [I('trending-down', 'เดือนแรก'), I('minus', 'เดือนสอง'), I('trending-up', 'เดือนสาม')], at: 2, result: I('coins', 'มีกำไร') },
    { say: 'ใช้เวลาสามปีกว่าจะหาย', result: I('heart-pulse', 'หายดี') },
    { say: 'ยังเหลืออีกสองวันก่อนเดดไลน์', points: [I('calendar', 'วันนี้'), I('calendar', 'พรุ่งนี้'), I('calendar', 'มะรืน')], at: 0, result: I('flag', 'เดดไลน์') },
    { say: 'อนุบาล ประถม มัธยม', points: [I('baby', 'อนุบาล'), I('school', 'ประถม'), I('graduation-cap', 'มัธยม')], at: 1 },
    { say: 'ตั้งแต่ตีห้าจนเที่ยงคืน', points: [I('alarm-clock', 'ตีห้า'), I('briefcase', 'เที่ยง'), I('bed', 'เที่ยงคืน')], at: 2 },
    { say: 'ส่งของถึงภายในสามวัน', points: [I('package', 'วันที่ 1'), I('truck', 'วันที่ 2'), I('house', 'วันที่ 3')], at: 2 },
    { say: 'ฝึกทุกวันจนได้ลงแข่ง', points: [I('dumbbell', 'วันที่ 1'), I('dumbbell', 'วันที่ 30'), I('dumbbell', 'วันที่ 90')], at: 2, result: I('medal', 'ได้ลงแข่ง') },
    { say: 'ภายในสิบปีเมืองนี้จะเปลี่ยนไป', result: I('building-2', 'เมืองใหม่') },
    { say: 'เหลือเวลาอีกแค่คืนเดียว', points: [I('sun', 'วันนี้'), I('moon', 'คืนนี้'), I('sunrise', 'พรุ่งนี้')], at: 1 },
    { say: 'ออมเดือนละนิด ครบปีได้ทริป', points: [{ label: 'ม.ค.' }, { label: 'มิ.ย.' }, { label: 'ธ.ค.' }], at: 2, result: I('plane', 'ทริปแรก') },
    { say: 'แชตไม่ตอบ หนึ่งชั่วโมง สองชั่วโมง ทั้งวัน', points: [I('message-circle', '1 ชม.'), I('message-circle', '2 ชม.'), I('message-circle', 'ทั้งวัน')], at: 2 },
    { say: 'ปลูกวันนี้ อีกสามเดือนได้กิน', points: [I('sprout', 'วันนี้'), I('leaf', 'เดือนที่ 2'), I('apple', 'เดือนที่ 3')], at: 2, result: I('salad', 'ได้กิน') },
    { say: 'เรียนภาษาหกเดือนจนคุยได้', result: I('languages', 'คุยได้') },
    { say: 'หมักไว้สิบนาที หนึ่งชั่วโมง หรือข้ามคืน', points: [I('timer', '10 นาที'), I('clock', '1 ชั่วโมง'), I('moon', 'ข้ามคืน')], at: 1 },
    { say: 'ชาร์จครึ่งชั่วโมงใช้ได้ทั้งวัน', points: [I('battery-low', '10 นาที'), I('battery-charging', '20 นาที'), I('battery-full', '30 นาที')], at: 2, result: I('zap', 'ใช้ทั้งวัน') },
    { say: 'หนึ่งปี สองปี สามปี เขาก็ไม่เปลี่ยน', points: [I('calendar', '1 ปี'), I('calendar', '2 ปี'), I('calendar', '3 ปี')], at: 2, result: I('frown', 'ไม่เปลี่ยน') },
    { say: 'สามเดือนแรกหลังคลอดสำคัญที่สุด', points: [I('baby', 'เดือน 1'), I('baby', 'เดือน 2'), I('baby', 'เดือน 3')], at: 2 },
    { say: 'ความรักต้องใช้เวลา', result: I('heart', 'รักมั่นคง') },
  ];
  const STRESS = [
    { say: 'ไม่มีป้ายเลย', points: [I('calendar'), I('calendar-days'), I('history')], at: 2, result: I('infinity') },
    { say: 'ป้ายยาว', points: [I('briefcase', 'สัปดาห์แรกของการเริ่มงาน'), I('users', 'เดือนแรกที่เข้าทีม'), I('award', 'ครบหนึ่งปีเต็ม')], at: 2, result: I('rocket', 'ได้เลื่อนตำแหน่ง') },
    { say: 'ภาษาอังกฤษ', points: [I('code', 'Day 1'), I('bug', 'Week 1'), I('rocket', 'Month 1')], at: 2, result: I('party-popper', 'Launch') },
    { say: 'ไม่มีไอคอน (ป้ายแทนภาพ)', points: [{ label: 'เช้า' }, { label: 'บ่าย' }, { label: 'เย็น' }], at: 2, result: { label: 'เสร็จ' } },
    { say: 'หยุดที่จุดแรก + ผลลัพธ์', points: [I('sprout', 'ปีแรก'), I('leaf', 'ปีที่สอง'), I('trees', 'ปีที่สาม')], at: 0, result: I('apple', 'ออกผล') },
    { say: 'ผลลัพธ์อย่างเดียว ไม่มีป้าย', result: I('eye') },
    { say: 'ผลลัพธ์เป็นป้ายอย่างเดียว', result: { label: 'อิสรภาพ' } },
    { say: 'ชื่อไอคอนที่ไม่มี', points: [I('no-such-icon', 'ตอนแรก'), I('no-such-icon', 'ตอนกลาง'), I('no-such-icon', 'ตอนท้าย')], at: 1 },
    { say: 'ไอคอนซ้ำ ไม่มีป้าย', points: [I('clock'), I('clock'), I('clock')], at: 2 },
    { say: 'หยุดกลางทาง + ผลลัพธ์', points: [I('book-open', 'บทที่ 1'), I('book-open', 'บทที่ 5'), I('book-open', 'บทที่ 10')], at: 1, result: I('graduation-cap', 'สอบผ่าน') },
    { say: 'ตัวเลขในป้าย', points: [I('timer', '00:05'), I('timer', '00:10'), I('timer', '00:15')], at: 2, result: I('zap', '00:20') },
    { say: 'อังกฤษยาว', points: [I('sunrise', 'Early morning'), I('sun', 'Late afternoon'), I('moon', 'After midnight')], at: 2 },
    { say: 'ป้ายสั้นมาก', points: [I('sun', 'ก่อน'), I('sun', 'ระหว่าง'), I('sun', 'หลัง')], at: 2, result: I('check', 'จบ') },
    { say: 'สิบปี (ปี ค.ศ.)', points: [I('house', '2025'), I('house', '2030'), I('house', '2035')], at: 2, result: I('building', 'ตึกใหม่') },
    { say: 'ผลลัพธ์ป้ายยาว', points: [I('piggy-bank', 'ปีที่ 1'), I('piggy-bank', 'ปีที่ 5'), I('piggy-bank', 'ปีที่ 10')], at: 2, result: I('house', 'ได้บ้านหลังแรกของครอบครัว') },
    { say: 'ไม่มีป้าย + หยุดจุดแรก', points: [I('moon'), I('sun'), I('moon')], at: 0 },
    { say: 'วินาที', points: [I('timer', '1 วิ'), I('timer', '2 วิ'), I('timer', '3 วิ')], at: 2, result: I('rocket', 'ออกตัว') },
    { say: 'ไม่มีไอคอน + หยุดกลางทาง', points: [{ label: 'ปีแรก' }, { label: 'ปีที่สอง' }, { label: 'ปีที่สาม' }], at: 1 },
    { say: 'ป้ายแทนภาพยาว', points: [{ label: 'ตอนเรียนจบใหม่' }, { label: 'ตอนมีครอบครัว' }, { label: 'ตอนเกษียณ' }], at: 2 },
    { say: 'ผลลัพธ์อย่างเดียว ไอคอนไม่มีจริง', result: I('no-such-icon', 'ฝันเป็นจริง') },
  ];

  G.cats = G.cats || {};
  G.cats.B09T = { variants: V, SAMPLES, STRESS, theme, draw: (i, d, c) => { setZ(c); CUR = V[i].id; tokens(); EMPTY = false; BLUE = false; V[i].build(d || {}, c); }, CLAMPS, timing: c => (setZ(c), Object.assign({}, Z)) };
})();
