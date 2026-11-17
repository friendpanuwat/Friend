/* b11t.js — template ชุดฐาน category B11 "คำพูด / แชต / คอมเมนต์ / รีวิว" (user 2026-11-17: "ทำ template ชุดฐาน หมวด B11 ได้ ทำ 25 อัน แต่ละอันห้าม
   หน้าตาเหมือนกัน 100% แต่หน้าตาคล้ายกันได้ และที่สำคัญที่สุดห้ามก๊อปหน้าตาของหมวดอื่นมาเด็ดขาด (แต่สามารถคล้ายได้)"): 25 designs, each tells "someone
   says / sends words, and they arrive" with its own mechanism — graphic parts only (speech shapes, cards, stars, typing dots, read ticks, reaction
   circles, people) — no phones, screens or other real things. Header from b10t.js (b09t header + the B10T people / words helpers). Icon slots ≥ 165,
   words ≥ 40; no word chip top-left, no arrow badge top-right, no floor line, no numbers that are not in the data; parts kept together (rule 34).
   GL.cats.B11T.draw(i, data, { x, y, s, at, hit }) — canvas 1000 × 700 centred at (0,0).
   Data = CutPack B11 (cat_ai.py: "what someone says / chat / comment / review"): kind chat | comment | review | message · quote (the words, ≤ 12
   letters as said) · mood good | bad · react (a reaction icon) · gone (no reply — they disappeared). (app = not used: no real app looks.) */
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
    cp.id = 'b11tclip' + (++CID); Object.entries({ x, y, width: w, height: h }).forEach(([k, v]) => r.setAttribute(k, v)); cp.appendChild(r);
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
    if (!ICLIP[k] || !svg.contains(ICLIP[k].cp)) { const cp = document.createElementNS(NS, 'clipPath'), r = document.createElementNS(NS, 'rect'); cp.id = 'b11ticlip' + (++CID);
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



  /* ================= B11T — คำพูด / แชต / คอมเมนต์ / รีวิว (Words said: chat · comment · review · message) as a template ชุดฐาน =================
     Story: the message's frame comes in → typing dots → the words write themselves in (left to right) → on the keyword H the message is
     complete (a soft swell + ripple) → the reaction pops on its corner (react icon, else a smile / frown from mood) — or, when gone, a reply place
     waits with typing dots that stop on H and stay empty. The frame says what kind it is: chat = a speech shape with a tail · comment = a card
     with a person in a round portrait · review = a card with a row of five stars (good: all lit · bad: one) · message = a card with a header band.
     No words → two soft bars in their place. */
  const KINDS = ['chat', 'comment', 'review', 'message'];
  const ORGAN = ['thumbs-up', 'thumbs-down', 'hand', 'ear', 'ear-off', 'handshake', 'hand-heart', 'hand-helping', 'hand-coins', 'hand-metal', 'heart-handshake', 'footprints', 'scan-eye', 'biceps-flexed'];
  function MD(d) { const kind = KINDS.includes(d && d.kind) ? d.kind : 'chat', quote = d && d.quote != null && String(d.quote).trim() ? String(d.quote).trim() : null;
    const mood = d && (d.mood === 'good' || d.mood === 'bad') ? d.mood : null, gone = !!(d && d.gone === true);
    const ri = d && d.react && !ORGAN.includes(d.react) && picOf({ icon: d.react }) ? d.react : null;
    return { kind, quote, mood, gone, rIcon: gone ? null : (ri || (mood === 'good' ? 'smile' : mood === 'bad' ? 'frown' : null)) }; }
  /* timing: tIn = the frame comes in · T0 = the words start writing (a long sentence waits) · H = the words are complete · tR = the reaction */
  function MQ(d) { const D = MD(d), H = Z.H, T0 = f3(Math.max(tu(.55), H - tu(.95)));
    return Object.assign({ H, T0, tIn: tu(.08), tC: i => f3(tu(.08 + .1 * i)), tR: f3(H + tu(.1)) }, D); }
  const hOf = Q => Q.kind === 'review' || Q.kind === 'message' ? 300 : 250;
  const KICON = { chat: 'message-circle', comment: 'messages-square', review: 'star', message: 'mail' };

  /* a speech shape: rounded box + a tail (tail { side: 'b', x } bottom at x · { side: 'l', y } left at y · { side: 'r', y } · null) */
  function bubbleD(l, t, w, h, r, tail) { const b = t + h, rr = l + w; let d = `M ${l + r} ${t} L ${rr - r} ${t} Q ${rr} ${t} ${rr} ${t + r}`;
    if (tail && tail.side === 'r') { const y = tail.y; d += ` L ${rr} ${y - 30} L ${rr + 56} ${y + 6} L ${rr} ${y + 30}`; }
    d += ` L ${rr} ${b - r} Q ${rr} ${b} ${rr - r} ${b}`;
    if (tail && tail.side === 'b') { const x = tail.x, dir = tail.dir ?? -1; d += ` L ${x + 34} ${b} L ${x + dir * 30} ${b + 58} L ${x - 34} ${b}`; }
    d += ` L ${l + r} ${b} Q ${l} ${b} ${l} ${b - r}`;
    if (tail && tail.side === 'l') { const y = tail.y; d += ` L ${l} ${y + 30} L ${l - 56} ${y + 6} L ${l} ${y - 30}`; }
    return d + ` L ${l} ${t + r} Q ${l} ${t} ${l + r} ${t} Z`; }
  /* a group that is uncovered left → right between t0 and t1 (a clip whose rect grows from x0) */
  function revealG(q, p, x0, y0, w, h, t0, t1) { const cg = clipG(q, x0, y0, w, h), rect = q.g.ownerSVGElement.querySelector(`#${cg.g.getAttribute('clip-path').slice(5, -1)} rect`);
    on(rect, p, 0, { ox: x0, oy: y0, sx: [[0, 0], [t0, 0], [t1, 1, 'io']] }); return cg; }
  const star5 = (q, x, y, r, o) => q.path(starD(x, y, r), o);
  /* the person in a round portrait (comment) */
  function portrait(q, x, y, r) { q.circle(x, y, r, F(3.4)); q.circle(x, y, r - 12, S(1.4)); const k = f3(r * 1.62 / 331); hum(q, x, f1(y + r * .8), k); }
  /* the message itself, centred at (x, y), w × h. o.g = draw into this group (it rides it) else it pops in at o.t · o.tail (chat) · o.frameAt = the frame
     draws itself in at that time (words first) · o.noSwell. Returns { g, l, t, r, b } */
  function msg(p, c, Q, x, y, w, h, o = {}) { const t0 = o.t ?? Q.tIn, g0 = o.g || popAt(p, x, y, t0), g = o.noSwell ? g0 : mvG(g0, { px: x, py: y, s: [[0, 1], [Q.H, 1], [f3(Q.H + tu(.18)), 1.04, 'io'], [f3(Q.H + tu(.42)), 1, 'io']] });
    const l = f1(x - w / 2), t = f1(y - h / 2), k = Q.kind; let A;
    const frame = st => k === 'chat' ? g.path(bubbleD(l, t, w, h, 44, o.tail === undefined ? { side: 'b', x: l + 110 } : o.tail), st) : R(g, l, t, w, h, 34, st);
    if (o.pointer) { const P = o.pointer, ex = P.x < x ? l + 2 : l + w - 2, ey = Math.max(t + 50, Math.min(t + h - 50, P.y + (P.dy ?? -40))); g.path(`M ${ex} ${f1(ey - 34)} L ${P.x} ${P.y} L ${ex} ${f1(ey + 34)} Z`, F(4)); }
    if (o.frameAt != null) { frame(BK); const e = frame(F(4)); on(e, p, 0, { draw: [[0, 0], [o.frameAt, 0], [f3(o.frameAt + tu(.4)), 1, 'io']] }); } else frame(F(4));
    const late = o.frameAt != null ? atG(g, f3(o.frameAt + tu(.3))) : g;
    if (k === 'comment') { const r = Math.min(84, h / 2 - 22); portrait(late, l + 30 + r, y, r); R(late, l + 2 * r + 64, t + 34, 160, 18, 9, GREY()); A = [l + 2 * r + 64, t + 62, l + w - 36, t + h - 26]; }
    else if (k === 'review') { const n = Q.mood === 'good' ? 5 : Q.mood === 'bad' ? 1 : 0, gap = 74, sx = f1(l + 60), sy = t + 60;
      for (let i = 0; i < 5; i++) { star5(late, sx + i * gap, sy, 33, { sw: 3, stroke: TL_(.55), fill: C.fill }); if (i < n) star5(litOn(late, f3(lerp(Q.T0, Q.H, (i + 1) / Math.max(n, 1)))), sx + i * gap, sy, 33, { fill: ACC1, sw: 3, stroke: ACC1 }); }
      A = [l + 40, t + 108, l + w - 40, t + h - 22]; }
    else if (k === 'message') { R(late, l + 18, t + 18, w - 36, 64, 22, { fill: TL_(.08), sw: 2, stroke: TL_(.35) }); late.circle(l + 58, t + 50, 11, DOTF()); R(late, l + 86, t + 41, 190, 18, 9, GREY()); A = [l + 40, t + 98, l + w - 40, t + h - 22]; }
    else A = [l + 40, t + 26, l + w - 40, t + h - 26];
    words11(g, p, Q, A, o); return { g, l, t, r: l + w, b: t + h }; }
  /* the words in the box A = [x0, y0, x1, y1]: typing dots first, then the words write in (left → right) T0 → H; no words → two soft bars */
  function words11(g, p, Q, A, o = {}) { const [x0, y0, x1, y1] = A, cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, aw = x1 - x0, tw0 = o.tWrite ?? Q.T0;
    const dots = sub(g); on(dots, p, 0, { o: [[0, 0], [f3(Q.tIn + tu(.2)), 0], [f3(Q.tIn + tu(.3)), 1], [f3(tw0 - tu(.02)), 1], [f3(tw0 + tu(.1)), 0]] });
    [-1, 0, 1].forEach(i => dots.circle(cx + i * 40, cy, 12, { fill: TL_(.5), sw: 0, stroke: 'none' }));
    const rv = revealG(g, p, x0 - 14, y0 - 30, aw + 28, (y1 - y0) + 60, tw0, f3(Q.H - tu(.04)));
    if (Q.quote) txt(rv, Q.quote, cx, cy + (o.size || 74) * .34, { size: o.size || 74, maxW: aw, weight: 800, color: C.ink, wrap: 'mid' });
    else { R(rv, x0, cy - 34, f1(aw * .86), 22, 11, GREY()); R(rv, x0, cy + 12, f1(aw * .55), 22, 11, GREY()); } }
  /* the reaction: a round slot with the react icon (or smile / frown) that pops on its corner just after H */
  function reactC(p, c, Q, x, y, s = 170, t) { if (!Q.rIcon) return; t = t ?? Q.tR; const g = popAt(p, x, y, t); g.circle(x, y, s / 2, F(4)); litOn(g, t).circle(x, y, s / 2, LIT2());
    put(p, c, { icon: Q.rIcon }, x, y, s * .66, null, { t: f3(t + tu(.04)), punch: f3(t + tu(.12)) }); ripple(p, x, y, s * .56, f3(t + tu(.06))); }
  /* gone: a reply place (dashed) whose typing dots stop on H and stay empty; nothing when not gone */
  function goneS(p, Q, x, y, w = 280, h = 96) { if (!Q.gone) return; const t = f3(Math.max(Q.tIn + tu(.3), Q.H - tu(.7))), g = atG(p, t);
    R(g, x - w / 2, y - h / 2, w, h, h / 2, Object.assign({ fill: C.fill }, DASH(.7)));
    [-1, 0, 1].forEach(i => { const dg = sub(g); on(dg, p, 0, { o: [[0, 0], [f3(t + tu(.1 + .08 * (i + 1))), 0], [f3(t + tu(.18 + .08 * (i + 1))), .8], [Q.H, .8], [f3(Q.H + tu(.3)), .12, 'io']] }); dg.circle(x + i * 38, y, 11, { fill: C.soft, sw: 0, stroke: 'none' }); }); }
  /* read ticks (two checks) — the first lights when sent (t1), the second when read (t2) */
  function ticks(p, x, y, t1, t2, k = 1) { [[0, t1], [30, t2]].forEach(([dx, t]) => { const a = `M ${f1(x + (dx - 24) * k)} ${y} L ${f1(x + (dx - 8) * k)} ${f1(y + 16 * k)} L ${f1(x + (dx + 22) * k)} ${f1(y - 16 * k)}`; p.path(a, { sw: f1(5 * Math.sqrt(k)), stroke: TL_(.35) }); const l = litOn(p, t); l.path(a, { sw: f1(6 * Math.sqrt(k)), stroke: ACC1 }); }); }
  /* a soft earlier message (faint, bars only) */
  function oldMsg(q, x, y, w, h, tail) { const l = x - w / 2, t = y - h / 2; q.path(bubbleD(l, t, w, h, 36, tail || null), F(3)); R(q, l + 34, y - 26, f1(w * .62), 18, 9, GREY()); R(q, l + 34, y + 10, f1(w * .38), 18, 9, GREY()); }
  const cornerR = (m, s = 170) => [f1(m.r - 20), f1(m.t + 12)];

  /* 01 BUBBLE (ฟองคำพูด): one big speech shape; typing dots, then the words write in; the reaction lands on its corner */
  variant('bubble', 'ฟองคำพูด', (d, c) => { art(c, p => { const Q = MQ(d), h = hOf(Q) + 50, m = msg(p, c, Q, -20, -50, 820, h, { size: 86 });
    reactC(p, c, Q, ...cornerR(m)); goneS(p, Q, 260, m.b + 110); }); });

  /* 02 THREAD (บทสนทนา): two earlier lines of a conversation sit faint above; the new one comes up from below */
  variant('thread', 'บทสนทนา', (d, c) => { art(c, p => { const Q = MQ(d), h = hOf(Q);
    oldMsg(mvG(popAt(p, -200, -265, Q.tC(0)), { o: [[0, .45]] }), -200, -265, 470, 110, { side: 'b', x: -360 });
    oldMsg(mvG(popAt(p, 195, -120, Q.tC(1)), { o: [[0, .45]] }), 195, -120, 430, 110, { side: 'b', x: 345, dir: 1 });
    const y = f1(-120 + 55 + 40 + h / 2), g = mvG(CL(p), { px: -40, py: y, y: [[0, 300], [Q.tC(2), 300], [f3(Q.tC(2) + tu(.4)), 0, 'out']], o: fadeIn(Q.tC(2), .1) });
    const m = msg(p, c, Q, -40, y, 680, h, { g }); reactC(p, c, Q, ...cornerR(m)); goneS(p, Q, 330, Math.min(300, m.b + 40)); }); });

  /* 03 TYPING (จุดพิมพ์ขยาย): a little typing shape at the bottom left; its dots run up along a trail and the message opens out at the end of it */
  variant('typing', 'จุดพิมพ์ขยาย', (d, c) => { art(c, p => { const Q = MQ(d), h = hOf(Q), X = 95, Y = -80, w = 690, ox = -380, oy = 255;
    const tp = popAt(p, ox, oy, Q.tIn); tp.path(bubbleD(ox - 90, oy - 50, 180, 100, 40, { side: 'b', x: ox - 40 }), F(3.4)); [-1, 0, 1].forEach(i => tp.circle(ox + i * 34, oy, 10, { fill: C.soft, sw: 0, stroke: 'none' }));
    const l = X - w / 2, b = Y + h / 2, n = 5; for (let i = 1; i <= n; i++) { const u = i / (n + 1), x = f1(lerp(ox + 60, l + 40, u)), y = f1(lerp(oy - 60, b + 30, u)); popAt(p, x, y, f3(lerp(Q.tIn + tu(.3), Q.T0, i / n))).circle(x, y, 12, { fill: TL_(.5), sw: 0, stroke: 'none' }); }
    const g = mvG(p, { px: l, py: b, s: [[0, .12], [Q.T0, .12], [f3(Q.T0 + tu(.4)), 1, 'out']], o: fadeIn(Q.T0, .06) });
    const m = msg(p, c, Q, X, Y, w, h, { g, tail: { side: 'b', x: l + 90 }, tWrite: f3(Q.T0 + tu(.3)) }); reactC(p, c, Q, ...cornerR(m)); goneS(p, Q, 300, m.b + 110); }); });

  /* 04 VOICE (เสียงเป็นคำ): a voice wave on the left; the words come out of it into the message on the right */
  variant('voice', 'เสียงเป็นคำ', (d, c) => { art(c, p => { const Q = MQ(d), h = hOf(Q) + 20, X = 130, xs = Array.from({ length: 7 }, (_, i) => -440 + i * 36);
    xs.forEach((x, i) => { const hh = [90, 170, 250, 310, 220, 140, 80][i], g = mvG(popAt(p, x, 0, Q.tC(0)), { px: x, py: 0, sy: [[0, .3], [Q.tIn, .3]].concat(Array.from({ length: 6 }, (_, j) => [f3(lerp(Q.tIn + tu(.1), Q.H, (j + 1) / 6)), [.6, 1, .45, .9, .5, .75][(i + j) % 6], 'io'])) });
      R(g, x - 12, -hh / 2, 24, hh, 12, { fill: ACC1, sw: 0, stroke: 'none' }); });
    const g = mvG(p, { px: X - 320, py: 0, sx: [[0, 0], [Q.T0, 0], [f3(Q.T0 + tu(.35)), 1, 'out']], o: fadeIn(Q.T0, .06) });
    const m = msg(p, c, Q, X, 0, 640, h, { g, tail: { side: 'l', y: 20 }, pointer: Q.kind === 'chat' ? null : { x: -150, y: 0, dy: 0 }, tWrite: f3(Q.T0 + tu(.25)) }); reactC(p, c, Q, ...cornerR(m)); goneS(p, Q, X + 150, m.b + 90); }); });

  /* 05 FEED (ฟีดเลื่อนลง): two older messages slide down; the new one drops into the top place */
  variant('feed', 'ฟีดเลื่อนลง', (d, c) => { art(c, p => { const Q = MQ(d), h = hOf(Q), y = f1(-330 + h / 2 + 10), w = 720;
    [0, 1].forEach(i => { const yy = f1(y + h / 2 + 30 + 90 + i * 200), g = mvG(CL(p), { y: [[0, -285], [Q.T0, -285], [f3(Q.H - tu(.1)), 0, 'io']], o: [[0, 0], [Q.tC(i), 0], [f3(Q.tC(i) + tu(.1)), .45]] });
      R(g, -w / 2, yy - 90, w, 180, 34, F(3)); R(g, -w / 2 + 40, yy - 30, 380, 20, 10, GREY()); R(g, -w / 2 + 40, yy + 12, 230, 20, 10, GREY()); });
    const g = mvG(CL(p), { px: 0, py: y, y: [[0, -560], [Q.T0, -560], [f3(Q.H - tu(.1)), 0, 'io']], o: fadeIn(Q.T0, .04) });
    const m = msg(p, c, Q, 0, y, w, h, { g, tail: null, tWrite: f3(Q.H - tu(.3)) }); reactC(p, c, Q, ...cornerR(m)); goneS(p, Q, 250, m.b + 70); }); });

  /* 06 REACTIONS (ปุ่มปฏิกิริยา): three reaction places under the message; the one that fits lights, the others stay faint */
  variant('reacts', 'ปุ่มปฏิกิริยา', (d, c) => { art(c, p => { const Q = MQ(d), h = hOf(Q), y = f1(-330 + h / 2 + 15), m = msg(p, c, Q, 0, y, 760, h, { tail: null });
    const opts = ['smile', 'heart', 'frown'], mid = Q.rIcon, side = opts.filter(n => n !== mid).slice(0, 2), row = mid ? [side[0], mid, side[1]] : opts, ry = f1(m.b + 60 + 95);
    row.forEach((n, i) => { const x = (i - 1) * 245, me = mid && i === 1;
      if (me) { reactC(p, c, Q, x, ry, 190, Q.H); return; }
      const g = popAt(p, x, ry, Q.tC(i + 1)); g.circle(x, ry, 95, Object.assign({ fill: C.fill }, DASH(.5))); put(p, c, { icon: n }, x, ry, 124, null, { t: f3(Q.tC(i + 1) + tu(.04)), o: [[0, 0], [f3(Q.tC(i + 1) + tu(.04)), 0], [f3(Q.tC(i + 1) + tu(.14)), .32]] }); }); }); });

  /* 07 SEND (ส่งออกไป): from the sender's portrait the message flies along a curve, lands, and the read ticks light */
  variant('send', 'ส่งออกไป', (d, c) => { art(c, p => { const Q = MQ(d), h = hOf(Q), X = 90, Y = -70, sx = -370, sy = 215;
    portrait(popAt(p, sx, sy, Q.tC(0)), sx, sy, 96);
    const L = [[sx + 40, sy - 60], [sx + 120, Y + 40], [X, Y]], K = pathK(L, Q.T0, f3(Q.H - tu(.25)), [X, Y]);
    way(p, `M ${sx + 40} ${sy - 70} Q ${sx + 120} ${Y + 40} ${X - 200} ${Y + 60}`, Q.tC(1), tu(.4), 4, .35);
    const g = mvG(CL(p), { px: X, py: Y, x: K.x, y: K.y, s: [[0, .2], [Q.T0, .2], [f3(Q.H - tu(.25)), 1, 'io']], o: fadeIn(Q.T0, .06) });
    const m = msg(p, c, Q, X, Y, 620, h, { g, tWrite: f3(Q.H - tu(.3)), tail: { side: 'b', x: X - 190 } });
    ticks(p, m.r - 110, m.b + 62, f3(Q.H - tu(.1)), Q.gone ? f3(Q.H + tu(.3)) : Q.H, 1.6); reactC(p, c, Q, ...cornerR(m)); goneS(p, Q, X + 20, m.b + 150); }); });

  /* 08 TWO SIDES (คุยกันสองคน): two people; the words come from the one on the left; the one on the right answers with the reaction (gone: they fade) */
  variant('twoside', 'คุยกันสองคน', (d, c) => { art(c, p => { const Q = MQ(d), h = hOf(Q), fy = 345, k = .9, hx = -370, hy = f1(fy - 300 * k);
    fig(p, hx, fy, k, { g: inF(p, hx, fy, k, Q.tC(0)) }); fig(p, 370, fy, k, { g: inF(p, 370, fy, k, Q.tC(1)), dim: Q.gone ? Q.H : undefined });
    const m = msg(p, c, Q, -20, -195, 620, h, { tail: { side: 'b', x: -230, dir: -1 }, pointer: Q.kind === 'chat' ? null : { x: hx + 40, y: hy - 30, dy: 0 }, t: Q.tC(2) });
    reactC(p, c, Q, 370, -55, 170); goneS(p, Q, 370, -55, 240, 96); }); });

  /* 09 INBOX (รายการข้อความ): a list of messages; the new one slides in on top and pushes the list down */
  variant('inbox', 'รายการข้อความ', (d, c) => { art(c, p => { const Q = MQ(d), h = hOf(Q), w = 760, y = f1(-330 + h / 2 + 6);
    [0, 1].forEach(i => { const yy = f1(y + h / 2 + 40 + 64 + i * 150), g = mvG(CL(p), { y: [[0, -150], [Q.T0, -150], [f3(Q.H - tu(.1)), 0, 'io']], o: [[0, 0], [Q.tC(i), 0], [f3(Q.tC(i) + tu(.1)), .45]] });
      R(g, -w / 2, yy - 64, w, 128, 30, F(3)); g.circle(-w / 2 + 70, yy, 40, F(2.6)); R(g, -w / 2 + 140, yy - 24, 300, 18, 9, GREY()); R(g, -w / 2 + 140, yy + 10, 200, 18, 9, GREY()); });
    const g = mvG(CL(p), { px: 0, py: y, x: [[0, -1050], [Q.T0, -1050], [f3(Q.H - tu(.1)), 0, 'io']], o: fadeIn(Q.T0, .04) });
    const m = msg(p, c, Q, 0, y, w, h, { g, tail: null, tWrite: f3(Q.H - tu(.3)) }); reactC(p, c, Q, ...cornerR(m)); goneS(p, Q, 260, m.b + 64); }); });

  /* 10 ZOOM (เด่นจากหลายข้อความ): many small messages around; one of them grows into the middle */
  variant('zoom', 'เด่นจากหลายข้อความ', (d, c) => { art(c, p => { const Q = MQ(d), h = hOf(Q), P = [[-370, -275], [-110, -295], [390, -260], [-395, 280], [-130, 298], [140, 290], [395, 270]], sx = 150, sy = -280;
    P.forEach(([x, y], i) => { const g = mvG(popAt(p, x, y, Q.tC(i)), { o: [[0, 1], [Q.H, 1], [f3(Q.H + tu(.25)), .4, 'io']] }); oldMsg(g, x, y, 210, 88, null); });
    const g = mvG(p, { px: 0, py: 0, x: [[0, sx], [Q.T0, sx], [f3(Q.H - tu(.15)), 0, 'io']], y: [[0, sy], [Q.T0, sy], [f3(Q.H - tu(.15)), 0, 'io']], s: [[0, .3], [Q.T0, .3], [f3(Q.H - tu(.15)), 1, 'io']], o: fadeIn(Q.tC(7), .1) });
    const m = msg(p, c, Q, 0, -10, 680, h, { g, tWrite: f3(Q.H - tu(.4)) }); reactC(p, c, Q, ...cornerR(m)); goneS(p, Q, 0, 205, 260, 86); }); });

  /* 11 FLIP (พลิกด้านหน้า): the back of the message (a big icon of its kind) stays tilted behind; the front turns over from it and carries the words */
  variant('flip', 'พลิกด้านหน้า', (d, c) => { art(c, p => { const Q = MQ(d), h = hOf(Q), w = 640, bx = -110, by = -95, fx = 90, fy = 60, tA = f3(Q.T0 - tu(.1)), tB = f3(Q.T0 + tu(.14));
    const bk = rot(popAt(p, bx, by, Q.tIn), -6, bx, by), bo = mvG(bk, { o: [[0, 1], [tA, 1], [f3(tB + tu(.2)), .5, 'io']] }); R(bk, bx - w / 2, by - h / 2, w, h, 34, BK); R(bo, bx - w / 2, by - h / 2, w, h, 34, F(4));
    put(p, c, { icon: KICON[Q.kind] }, bx - w / 2 + 120, by - h / 2 + 105, 170, null, { t: f3(Q.tIn + tu(.06)), r: -6, o: [[0, 0], [f3(Q.tIn + tu(.06)), 0], [f3(Q.tIn + tu(.16)), 1], [tA, 1], [f3(tB + tu(.2)), .5, 'io']] });
    const g = mvG(p, { px: fx, py: fy, sx: [[0, .03], [tA, .03], [tB, 1, 'out']], x: [[0, bx - fx], [tA, bx - fx], [tB, 0, 'out']], y: [[0, by - fy], [tA, by - fy], [tB, 0, 'out']], o: [[0, 0], [tA, 0], [f3(tA + tu(.02)), 1]] });
    const m = msg(p, c, Q, fx, fy, w, h, { g, tail: null, tWrite: f3(tB + tu(.1)) }); reactC(p, c, Q, ...cornerR(m)); goneS(p, Q, -260, m.b + 80, 260, 92); }); });

  /* 12 UNFOLD (กางลงจากแถบหัว): a header pill with the kind's icon drops in; the message unrolls downward from under it */
  variant('unfold', 'กางลงจากแถบหัว', (d, c) => { art(c, p => { const Q = MQ(d), h = hOf(Q) + 20, hy = -258, my = f1(hy + 50 + 40 + h / 2);
    const hp = popAt(p, 0, hy, Q.tIn); R(hp, -280, hy - 50, 560, 100, 50, F(4)); R(hp, -110, hy - 10, 300, 20, 10, GREY()); put(p, c, { icon: KICON[Q.kind] }, -200, hy, 96, null, { t: f3(Q.tIn + tu(.06)) });
    way(p, `M -120 ${hy + 50} L -120 ${my - h / 2}`, Q.T0, tu(.15), 4, .5); way(p, `M 120 ${hy + 50} L 120 ${my - h / 2}`, Q.T0, tu(.15), 4, .5);
    const g = mvG(p, { px: 0, py: my - h / 2, sy: [[0, .03], [Q.T0, .03], [f3(Q.T0 + tu(.4)), 1, 'out']], o: fadeIn(Q.T0, .06) });
    const m = msg(p, c, Q, 0, my, 760, h, { g, tail: null, tWrite: f3(Q.T0 + tu(.3)) }); reactC(p, c, Q, f1(m.r - 10), f1(m.b - 10)); goneS(p, Q, -250, Math.min(300, m.b + 70)); }); });

  /* 13 SPEAKER (คนพูด): a big person on the left; the words come out of them into a shape that points at their head; the head nods */
  variant('speaker', 'คนพูด', (d, c) => { art(c, p => { const Q = MQ(d), h = hOf(Q) + 10, X = -320, fy = 345, K = 1.15, hy = f1(fy - 298 * K);
    const J = fig(p, X, fy, K, { g: inF(p, X, fy, K, Q.tC(0)) }); J.on('head', p, 0, { ox: 0, oy: -110, r: [[0, 0], [Q.T0, 0], [f3(Q.T0 + tu(.2)), 5, 'io'], [f3(Q.T0 + tu(.45)), -3, 'io'], [f3(Q.T0 + tu(.7)), 0, 'io']] });
    const m = msg(p, c, Q, 160, -120, 600, h, { tail: null, pointer: { x: X + 60, y: hy - 10, dy: -20 }, t: Q.tC(1) }); reactC(p, c, Q, ...cornerR(m)); goneS(p, Q, 180, m.b + 100); }); });

  /* 14 CROWD (หลายคนพูด): a row of people with small speech dots over their heads; one person's grows into the message */
  variant('crowd', 'หลายคนพูด', (d, c) => { art(c, p => { const Q = MQ(d), h = hOf(Q), xs = xsRow(5, 190), fy = 345, k = .7, ti = 3, tx = xs[ti], hy = f1(fy - 330 * k);
    xs.forEach((x, i) => { const me = i === ti; fig(p, x, fy, k, { g: inF(p, x, fy, k, Q.tC(i)), dim: !me, lit: me });
      if (!me) { const g = mvG(popAt(p, x, hy - 60, Q.tC(i + 1)), { o: [[0, 1], [Q.T0, 1], [f3(Q.T0 + tu(.3)), .35, 'io']] }); g.path(bubbleD(x - 50, hy - 100, 100, 70, 30, { side: 'b', x: x - 10 }), F(3)); [-1, 0, 1].forEach(j => g.circle(x + j * 24, hy - 65, 7, { fill: C.soft, sw: 0, stroke: 'none' })); } });
    const mx = Math.min(tx, 470 - 300), my = f1(hy - 90 - h / 2), g = mvG(p, { px: tx, py: hy - 40, s: [[0, .18], [Q.T0, .18], [f3(Q.T0 + tu(.4)), 1, 'out']], x: [[0, f1(tx - mx)], [Q.T0, f1(tx - mx)], [f3(Q.T0 + tu(.4)), 0, 'out']], o: fadeIn(Q.tC(3), .1) });
    const m = msg(p, c, Q, mx, my, 600, h, { g, tail: { side: 'b', x: tx, dir: 0 }, pointer: Q.kind === 'chat' ? null : { x: tx, y: hy - 20, dy: 0 }, tWrite: f3(Q.T0 + tu(.3)) }); reactC(p, c, Q, f1(m.l + 20), f1(m.t + 12)); goneS(p, Q, -330, my); }); });

  /* 15 REPLY (ตอบกลับ): the message, and a reply line that bends down to the answer under it (the reaction, an empty place when gone, soft bars otherwise) */
  variant('reply', 'ตอบกลับ', (d, c) => { art(c, p => { const Q = MQ(d), h = hOf(Q), m = msg(p, c, Q, -90, f1(-330 + h / 2 + 15), 720, h, { tail: null }), ax = m.l + 70, ry = f1(Math.min(250, m.b + 175)), rx = 200;
    way(p, `M ${ax} ${m.b} L ${ax} ${ry - 30} Q ${ax} ${ry} ${ax + 30} ${ry} L ${rx - 120} ${ry}`, Q.tR, tu(.3), 5, .5);
    if (Q.rIcon) reactC(p, c, Q, rx, ry, 190, f3(Q.tR + tu(.2))); else if (Q.gone) goneS(p, Q, rx + 40, ry, 300, 100);
    else oldMsg(mvG(popAt(p, rx + 60, ry, f3(Q.tR + tu(.2))), { o: [[0, .5]] }), rx + 60, ry, 340, 120, { side: 'l', y: ry }); }); });

  /* 16 TICKS (ส่งแล้ว อ่านแล้ว): big read ticks light under the message — sent, then read on the keyword (gone: read, and the reply place stays empty) */
  variant('ticks', 'ส่งแล้ว อ่านแล้ว', (d, c) => { art(c, p => { const Q = MQ(d), h = hOf(Q) + 20, m = msg(p, c, Q, 0, -70, 760, h, { tail: { side: 'b', x: 300, dir: 1 } });
    const ty = f1(m.b + 140); { const g = popAt(p, 230, ty, Q.tIn); R(g, 70, ty - 62, 320, 124, 62, F(3.4)); } ticks(p, 205, ty, Q.T0, Q.H, 2.4);
    reactC(p, c, Q, ...cornerR(m)); goneS(p, Q, -230, ty, 300, 110); }); });

  /* 17 STACK (ซ้อนแจ้งเตือน): two earlier notes stay stacked behind; the new message slides in from the right in front, a lit dot says "new" */
  variant('stack', 'ซ้อนแจ้งเตือน', (d, c) => { art(c, p => { const Q = MQ(d), h = hOf(Q), X = -20, Y = 50, w = 680;
    [[90, -100, .3], [45, -50, .45]].forEach(([dx, dy, a], i) => { const g = mvG(CL(p), { x: [[0, 800], [Q.tC(i), 800], [f3(Q.tC(i) + tu(.4)), 0, 'out']], o: [[0, 0], [Q.tC(i), 0], [f3(Q.tC(i) + tu(.05)), a]] }); R(g, X + dx - w / 2, Y + dy - h / 2, w, h, 34, BK); R(g, X + dx - w / 2, Y + dy - h / 2, w, h, 34, F(3)); R(g, X + dx - w / 2 + 40, Y + dy - h / 2 + 28, 240, 18, 9, GREY()); });
    const g = mvG(CL(p), { px: X, py: Y, x: [[0, 800], [Q.T0, 800], [f3(Q.T0 + tu(.45)), 0, 'out']], o: fadeIn(Q.T0, .04) });
    const m = msg(p, c, Q, X, Y, w, h, { g, tail: null, tWrite: f3(Q.T0 + tu(.35)) });
    { const dg = mvG(g, { px: m.l + 4, py: m.t + 4, s: [[0, 1], [f3(Q.T0 + tu(.5)), 1], [f3(Q.T0 + tu(.7)), 1.3, 'io'], [f3(Q.T0 + tu(.9)), 1, 'io']] }); dg.circle(m.l + 4, m.t + 4, 24, DOTF()); dg.circle(m.l + 4, m.t + 4, 36, { sw: 2.8, stroke: ACC1 }); }
    reactC(p, c, Q, f1(m.r - 20), f1(m.b - 10)); goneS(p, Q, -200, m.b + 80); }); });

  /* 18 CAROUSEL (เลื่อนมาตรงกลาง): a row of messages slides left until the new one stops in the middle */
  variant('carousel', 'เลื่อนมาตรงกลาง', (d, c) => { art(c, p => { const Q = MQ(d), h = hOf(Q) + 20, w = 620, gapX = 680, cg = mvG(CL(p), { x: [[0, gapX * 2], [Q.T0, gapX * 2], [f3(Q.H - tu(.15)), 0, 'io']], o: fadeIn(Q.tIn, .1) });
    [-1, 1, 2].forEach(i => { const g = mvG(cg, { o: [[0, .4]] }); oldMsg(g, i * gapX, -40, w, h, null); });
    const m = msg(p, c, Q, 0, -40, w, h, { g: cg, tail: null, noSwell: true, tWrite: f3(Q.H - tu(.35)) }); reactC(p, c, Q, ...cornerR(m)); goneS(p, Q, 0, m.b + 100); }); });

  /* 19 ECHO (ส่งต่อกันไป): outlines of the message spread out behind it and stay faint — the words go round */
  variant('echo', 'ส่งต่อกันไป', (d, c) => { art(c, p => { const Q = MQ(d), h = hOf(Q), w = 620, y = -30;
    [1.3, 1.15].forEach((s, i) => { const g = mvG(p, { px: 0, py: y, s: [[0, 1], [f3(Q.T0 + tu(.12 * i)), 1], [f3(Q.H + tu(.1)), s, 'io']], o: [[0, 0], [f3(Q.T0 + tu(.12 * i)), 0], [f3(Q.T0 + tu(.12 * i) + tu(.1)), .7], [f3(Q.H + tu(.1)), .4 + .2 * i]] });
      g.path(Q.kind === 'chat' ? bubbleD(-w / 2, y - h / 2, w, h, 44, { side: 'b', x: -w / 2 + 110 }) : `M ${-w / 2 + 34} ${y - h / 2} L ${w / 2 - 34} ${y - h / 2} Q ${w / 2} ${y - h / 2} ${w / 2} ${y - h / 2 + 34} L ${w / 2} ${y + h / 2 - 34} Q ${w / 2} ${y + h / 2} ${w / 2 - 34} ${y + h / 2} L ${-w / 2 + 34} ${y + h / 2} Q ${-w / 2} ${y + h / 2} ${-w / 2} ${y + h / 2 - 34} L ${-w / 2} ${y - h / 2 + 34} Q ${-w / 2} ${y - h / 2} ${-w / 2 + 34} ${y - h / 2} Z`, { sw: 3.4, stroke: TL_(.7) }); });
    const m = msg(p, c, Q, 0, y, w, h); reactC(p, c, Q, f1(m.r + 60), f1(m.t - 30)); goneS(p, Q, 250, m.b + 140); }); });

  /* 20 HIGHLIGHT (ขีดเน้นคำ): the words are said big; a thick lit stroke runs under them as they are said */
  variant('highlight', 'ขีดเน้นคำ', (d, c) => { art(c, p => { const Q = MQ(d), h = hOf(Q) + 60, w = 820, y = -50, sz = 92;
    const m = msg(p, c, Q, 0, y, w, h, { tail: { side: 'b', x: -230 }, size: sz });
    const cy = Q.kind === 'chat' ? y : Q.kind === 'comment' ? y + 18 : y + 50, lw = Q.quote ? Math.min(tw(p, Q.quote, sz), w - (Q.kind === 'comment' ? 300 : 120)) : w * .5, cx = Q.kind === 'comment' ? f1((m.l + 2 * Math.min(84, h / 2 - 22) + 64 + m.r - 36) / 2) : 0, x0 = f1((Q.quote ? cx : m.l + 40 + lw / 2) - lw / 2);
    const band = mvG(p, { px: x0, py: 0, sx: [[0, 0], [Q.T0, 0], [f3(Q.H - tu(.02)), 1, 'io']], o: fadeIn(Q.T0, .05) }); R(band, x0, f1(cy + 46), f1(lw), 16, 8, { fill: ACC1, sw: 0, stroke: 'none' });
    reactC(p, c, Q, ...cornerR(m)); goneS(p, Q, 250, m.b + 100); }); });

  /* 21 WORDS FIRST (คำมาก่อนกรอบ): the words appear first, very big and alone; then the frame draws itself round them on the keyword */
  variant('wordsfirst', 'คำมาก่อนกรอบ', (d, c) => { art(c, p => { const Q = MQ(d), h = hOf(Q) + 90, tW = f3(Math.max(Q.tIn + tu(.2), Q.T0 - tu(.4)));
    const m = msg(p, c, Q, 0, -30, 900, h, { g: sub(p), size: 112, tWrite: tW, frameAt: f3(Q.H - tu(.42)), tail: { side: 'b', x: 260, dir: 1 } }); reactC(p, c, Q, f1(m.l + 30), f1(m.t + 10)); goneS(p, Q, -240, m.b + 90); }); });

  /* 22 REPLY ARROW (ตอบข้อความก่อนหน้า): a small earlier message at the top left; a curved arrow runs from it to this message */
  variant('replyarrow', 'ตอบข้อความก่อนหน้า', (d, c) => { art(c, p => { const Q = MQ(d), h = hOf(Q);
    oldMsg(mvG(popAt(p, -260, -250, Q.tC(0)), { o: [[0, .5]] }), -260, -250, 400, 120, null);
    const m = msg(p, c, Q, 110, 90, 660, h, { t: Q.tC(2), tail: null }), dd = `M -60 -250 Q 110 -250 110 ${f1(m.t - 34)}`;
    way(p, dd, Q.tC(1), tu(.2), 4, .3); const a = p.path(dd, { sw: 6, stroke: ACC1 }); on(a, p, 0, { draw: [[0, 0], [Q.T0, 0], [f3(Q.H - tu(.1)), 1, 'io']] });
    const ah = litOn(p, f3(Q.H - tu(.1))); ah.path(`M 90 ${f1(m.t - 52)} L 110 ${f1(m.t - 26)} L 130 ${f1(m.t - 52)}`, { sw: 6, stroke: ACC1 });
    reactC(p, c, Q, ...cornerR(m)); goneS(p, Q, -300, m.b - 40, 260, 92); }); });

  /* 23 TWO-WAY (ซ้ายพูด ขวาตอบ): the message on the left, the answer place on the right — the reaction lands there, or it stays empty (gone) */
  variant('twoway', 'ซ้ายพูด ขวาตอบ', (d, c) => { art(c, p => { const Q = MQ(d), h = hOf(Q) + 40, m = msg(p, c, Q, -170, -30, 600, h, { tail: { side: 'b', x: -390 } }), rx = 335, ry = -30;
    const g = popAt(p, rx, ry, Q.tC(1)); g.path(bubbleD(rx - 140, ry - 130, 280, 260, 48, { side: 'b', x: rx + 90, dir: 1 }), Object.assign({ fill: C.fill }, DASH(.5)));
    if (Q.rIcon) reactC(p, c, Q, rx, ry, 190); else if (Q.gone) goneS(p, Q, rx, ry, 210, 92); else { R(g, rx - 95, ry - 22, 180, 18, 9, GREY()); R(g, rx - 95, ry + 12, 120, 18, 9, GREY()); } }); });

  /* 24 PANEL (หน้าต่างข้อความ): a wide panel with a header; the message rises into it */
  variant('panel', 'หน้าต่างข้อความ', (d, c) => { art(c, p => { const Q = MQ(d), h = hOf(Q), pg = panel(p, 920, 640, 44, Q.tIn);
    R(pg, -430, -290, 860, 76, 28, { fill: TL_(.08), sw: 2, stroke: TL_(.35) }); pg.circle(-385, -252, 12, DOTF()); R(pg, -355, -261, 220, 18, 9, GREY());
    const y = f1(-200 + 34 + h / 2), g = mvG(CL(p), { px: 0, py: y, y: [[0, 260], [Q.T0, 260], [f3(Q.T0 + tu(.4)), 0, 'out']], o: fadeIn(Q.T0, .06) });
    const m = msg(p, c, Q, 0, y, 760, h, { g, tail: null, tWrite: f3(Q.T0 + tu(.3)) }); reactC(p, c, Q, f1(m.r - 20), f1(m.b - 10)); goneS(p, Q, -200, Math.min(255, m.b + 80), 280, 92); }); });

  /* 25 BROADCAST (ส่งกระจาย): waves go out from the message to the right; the reaction comes back at the far side */
  variant('broadcast', 'ส่งกระจาย', (d, c) => { art(c, p => { const Q = MQ(d), h = hOf(Q) + 30, m = msg(p, c, Q, -150, -20, 600, h, { tail: { side: 'r', y: 10 }, pointer: Q.kind === 'chat' ? null : { x: 210, y: 10, dy: 0 } }), ax = f1(m.r + 70);
    [0, 1, 2].forEach(i => { const g = sub(p); on(g, p, 0, { o: [[0, 0], [f3(Q.T0 + tu(.18 * i)), 0], [f3(Q.T0 + tu(.18 * i) + tu(.1)), 1], [f3(Q.H + tu(.2)), 1], [f3(Q.H + tu(.5)), .5]] }); arcs(g, ax, 10, 1, 1, 34 + i * 38, 0, 46, { sw: 5, stroke: ACC1 }); });
    reactC(p, c, Q, 385, 10, 180); goneS(p, Q, 385, 10, 200, 92); }); });

  /* samples from unrelated topics (neutrality) + a stress set — the B11 data (b11.js) */
  const SAMPLES = [
    { say: 'มีคนเขียนมาบอกว่าคิดถึง', kind: 'chat', quote: 'คิดถึงนะ', mood: 'good', react: 'heart' },
    { say: 'หัวหน้าส่งข้อความมาว่าเก่งมาก', kind: 'message', quote: 'เก่งมาก', mood: 'good', react: 'star' },
    { say: 'ทักไปแล้วเงียบหาย', kind: 'chat', quote: 'ว่างไหม', gone: true },
    { say: 'เพื่อนส่งมาว่าขอโทษ', kind: 'chat', quote: 'ขอโทษนะ', mood: 'good', react: 'heart' },
    { say: 'คนดูคอมเมนต์ว่าชอบมาก', kind: 'comment', quote: 'ชอบมาก', mood: 'good', react: 'heart' },
    { say: 'แม่โทรมาถามว่ากินข้าวยัง', kind: 'chat', quote: 'กินข้าวยัง', mood: 'good', react: 'smile' },
    { say: 'รีวิวบอกว่าอร่อยมาก', kind: 'review', quote: 'อร่อยมาก', mood: 'good' },
    { say: 'ลูกค้าคอมเมนต์ว่าส่งช้า', kind: 'comment', quote: 'ส่งช้ามาก', mood: 'bad', react: 'frown' },
    { say: 'มีข้อความฝากไว้ตอนดึก', kind: 'message' },
    { say: 'ส่งงานไปแล้วไม่มีใครตอบ', kind: 'message', quote: 'ส่งงานแล้ว', gone: true },
    { say: 'เพื่อนชวนไปเที่ยว', kind: 'chat', quote: 'ไปทะเลกัน', mood: 'good', react: 'sun' },
    { say: 'มีคนถามว่าราคาเท่าไร', kind: 'comment', quote: 'ราคาเท่าไร' },
    { say: 'รีวิวบอกว่าไม่คุ้ม', kind: 'review', quote: 'ไม่คุ้ม', mood: 'bad' },
    { say: 'คนไข้เขียนมาขอบคุณหมอ', kind: 'message', quote: 'ขอบคุณค่ะ', mood: 'good', react: 'heart-pulse' },
    { say: 'ร้านได้รีวิวบอกว่าบริการดี', kind: 'review', quote: 'บริการดี', mood: 'good', react: 'award' },
    { say: 'คนในกลุ่มถามว่าใครว่าง', kind: 'chat', quote: 'ใครว่างบ้าง' },
    { say: 'โพสต์ไปแล้วไม่มีใครคอมเมนต์', kind: 'comment', gone: true },
    { say: 'รีวิวบอกว่าห้องสะอาด', kind: 'review', quote: 'ห้องสะอาด', mood: 'good' },
    { say: 'ทีมตอบมาว่ารับทราบ', kind: 'chat', quote: 'รับทราบ', react: 'check' },
    { say: 'เขาอ่านแล้วไม่ตอบ', kind: 'chat', quote: 'คิดถึงนะ', gone: true },
  ];
  const STRESS = [
    { say: 'ไม่มีคำพูด (แชต)', kind: 'chat' },
    { say: 'ข้อความยาว', kind: 'message', quote: 'ขอบคุณมากสำหรับทุกอย่างเลยนะ', mood: 'good' },
    { say: 'ภาษาอังกฤษ', kind: 'chat', quote: 'See you soon', react: 'heart' },
    { say: 'คอมเมนต์ไม่มีคำพูด', kind: 'comment', mood: 'bad' },
    { say: 'รีวิวไม่มีอารมณ์', kind: 'review', quote: 'ก็โอเค' },
    { say: 'หายไป + อารมณ์ไม่ดี', kind: 'chat', quote: 'ทำไมไม่ตอบ', mood: 'bad', gone: true },
    { say: 'ไอคอนตอบกลับที่ไม่มี', kind: 'comment', quote: 'สวยมาก', react: 'no-such-icon', mood: 'good' },
    { say: 'ไอคอนอวัยวะที่พักไว้', kind: 'review', quote: 'ดีเยี่ยม', react: 'thumbs-up', mood: 'good' },
    { say: 'ตัวเลขในคำพูด', kind: 'chat', quote: 'โอน 500 แล้ว', react: 'check' },
    { say: 'ข้อความไม่มีคำพูด + หายไป', kind: 'message', gone: true },
    { say: 'อังกฤษยาว', kind: 'review', quote: 'Worth every penny', mood: 'good' },
    { say: 'คำสั้นมาก', kind: 'chat', quote: 'โอเค' },
    { say: 'kind ผิด', kind: 'post', quote: 'สวัสดี' },
    { say: 'คอมเมนต์ยาว', kind: 'comment', quote: 'อยากได้สีดำแบบนี้บ้างค่ะ', mood: 'good', react: 'heart' },
    { say: 'รีวิวแย่ + ไอคอน', kind: 'review', quote: 'ช้ามาก', mood: 'bad', react: 'frown' },
    { say: 'แชตอารมณ์ไม่ดี ไม่มีไอคอน', kind: 'chat', quote: 'ไม่พอใจ', mood: 'bad' },
    { say: 'ข้อความอังกฤษ', kind: 'message', quote: 'Thank you', react: 'gift' },
    { say: 'คอมเมนต์หายไป', kind: 'comment', quote: 'มีไซส์ไหม', gone: true },
    { say: 'รีวิวไม่มีคำพูด', kind: 'review', mood: 'good' },
    { say: 'แชตยาว + หายไป', kind: 'chat', quote: 'พรุ่งนี้เจอกันที่เดิมนะ', gone: true },
  ];

  G.cats = G.cats || {};
  G.cats.B11T = { variants: V, SAMPLES, STRESS, theme, draw: (i, d, c) => { setZ(c); CUR = V[i].id; tokens(); EMPTY = false; BLUE = false; V[i].build(d || {}, c); }, CLAMPS, timing: c => (setZ(c), Object.assign({}, Z)) };
})();
