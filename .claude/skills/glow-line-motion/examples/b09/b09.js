/* b09.js — category B09 "เวลา / ไทม์ไลน์ / เดดไลน์": 20 neutral designs (stills approved, motion added).
   User 2026-11-13 (B08 passed): "ผมชอบการออกแบบประมาณนี้" + the approved B02–B05 videos as the reference → back to that kind of design:
   everyday things with a real mechanism / things that hold or show the content, clean layout, the house level of detail (not B08's
   little physical stories). Twenty different shapes: a line, a video bar, a tape measure, a stopwatch, a wall calendar, a lift dial,
   a split-flap board, a track spotlight, a stamp card, a glass lift, lamp posts, an advent calendar, a pipe with sight glasses,
   milestones, a candle, a tram, a water cascade, a gantry crane, blocks, a tally board.
   Slots (CutPack CATEGORIES.md B09 — references/cutpack-CATEGORIES.md, cat_ai.py): points [THING ×3] (moments as said; icons are often
   the same, labels often missing) · at 0–2 (where the pointer stops, default 2) · result THING (what the time brought). Points, result or both.
   Rules here: the moments are evenly spaced on one line in one direction; what is passed is "on", the pointer rests on `at`, what is not
   reached yet is dim (.45); the result sits at the end — reached (lit) when at = 2, else waiting (dim). No points → blank evenly spaced marks.
   GL.cats.B09.draw(i, data, { x, y, s, at, hit, speed }) — canvas 1000 × 700 centred at (0,0); hit = seconds after `at` (default 1.8).
   Motion (user 2026-11-13 "ทำเคลื่อนไหวได้"): tl() — the line draws out, the moments come in, the pointer walks past them, on the keyword
   it stops on `at` / the result shows up, hold. The last frame = the approved still. */
(function () {
  const G = window.GL, C = G.C, NS = 'http://www.w3.org/2000/svg';
  const W = (w = 2) => ({ sw: w }), F = (w = 3.2) => ({ fill: C.fill, sw: w }), S = (w = 2) => ({ sw: w, stroke: C.soft });
  const rad = d => d * Math.PI / 180, f1 = v => +v.toFixed(1);
  const GLASS = 'rgba(255,255,255,.07)', LIT = 'rgba(255,255,255,.2)', INK = { fill: C.ink, sw: 1.6 };

  /* TIMING (same system as b01–b06): the keyword c.hit comes from the speech and never moves. M = how long each move takes = 1 / speed
     (c.speed, else GL.stage / GL.motion speed) but at most hit / HIT0. tu(x) = x·M · bH(x) / aH(x) = before / after the keyword.
     Because M ≤ hit / 1.8, tu(x) ≤ bH(1.8 − x). */
  const HIT0 = 1.8; let Z = null; const CLAMPS = {}; let CUR = '';
  function setZ(c) { const sp = Math.min(20, Math.max(.05, +(c.speed ?? G.motion().speed ?? 1) || 1)), H = c.hit ?? HIT0, M = Math.max(.4, Math.min(1 / sp, H / HIT0));
    Z = { sp: 1 / M, want: sp, M, H }; }
  const tu = x => x * Z.M, bH = x => Z.H - x * Z.M, aH = x => Z.H + x * Z.M;
  function fixT(spec) { for (const n in spec) { const k = spec[n]; if (!Array.isArray(k)) continue;
    for (let i = 1; i < k.length; i++) if (k[i][0] < k[i - 1][0] - 1e-9) { k[i] = [k[i - 1][0], k[i][1], k[i][2]]; CLAMPS[CUR] = (CLAMPS[CUR] || 0) + 1; } } return spec; }
  const kf = (e, t, spec) => G.kf(e, t, fixT(spec));

  /* ---------- plumbing (same family as b06.js) ---------- */
  const TR = ['x', 'y', 'r', 's', 'sx', 'sy', 'ky'];
  const sub = (p, a) => { const q = p.child(a || {}); q.H = p.H; q.motion = p.motion; return q; };
  /* keyframes on a pen's group; q's own times come from p (any pen of the same rig works as p — they share t0) */
  const on = (q, p, t, spec) => { const t0 = p.t0 + t * p.ts, fade = q.og && !TR.some(n => spec[n]); kf(fade ? q.og : (q.g || q), t0, spec); };
  function mvG(p, m) { const o = sub(p), g = sub(o); g.og = o.g; if (m) { const K = { ox: m.px || 0, oy: m.py || 0 }; TR.concat('o').forEach(n => { if (m[n]) K[n] = m[n]; }); on(g, p, 0, K); } return g; }
  const art = (c, fn) => { const f = p => { p.H = Z.H; fn(p); }; f.custom = true; f.dur = .35; f.exit = 'pop';
    const a = G.art(f, { x: c.x, y: c.y, s: c.s, at: c.at || 0, speed: 1 }); a.speed = Z.sp; return a; };
  const over = (c, fn) => art(Object.assign({}, c), fn);                     // a rig drawn after the icons (on top of them)
  const atT = (g, p, t) => on(g, p, t, { o: [[0, 0], [tu(.12), 1]] });
  const R = (q, x, y, w, h, rx, o) => q.rect(x, y, w, h, Object.assign({ rx }, o));
  const floor = (p, y = 300, a = -470, b = 470) => { const g = sub(p); g.line(a, y, b, y, S(2)); atT(g, p, 0); return g; };
  const rot = (p, a, x, y) => sub(p, { transform: `rotate(${f1(a)} ${f1(x)} ${f1(y)})` });
  /* a label; too wide → smaller, or (wrap) two lines broken between Thai words: 'down' = 2nd line below y, 'up' = 1st line above y, 'mid' = centred on y */
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
  const P2 = pts => pts.map(([x, y]) => [f1(x), f1(y)]);
  /* a closed polygon with rounded corners (r) */
  function rpoly(pts, r) { const n = pts.length; let d = '';
    for (let i = 0; i < n; i++) { const [x0, y0] = pts[(i + n - 1) % n], [x1, y1] = pts[i], [x2, y2] = pts[(i + 1) % n];
      const l1 = Math.hypot(x0 - x1, y0 - y1), l2 = Math.hypot(x2 - x1, y2 - y1), k1 = Math.min(r, l1 / 2) / l1, k2 = Math.min(r, l2 / 2) / l2;
      const a = [x1 + (x0 - x1) * k1, y1 + (y0 - y1) * k1], b = [x1 + (x2 - x1) * k2, y1 + (y2 - y1) * k2];
      d += `${i ? 'L' : 'M'} ${f1(a[0])} ${f1(a[1])} Q ${f1(x1)} ${f1(y1)} ${f1(b[0])} ${f1(b[1])} `; }
    return d + 'Z'; }
  /* a ring (outer R, inner r) as one filled path: outlined both edges, dark between */
  const ringD = (x, y, Ro, Ri) => `M ${x + Ro} ${y} A ${Ro} ${Ro} 0 1 0 ${x - Ro} ${y} A ${Ro} ${Ro} 0 1 0 ${x + Ro} ${y} Z M ${x + Ri} ${y} A ${Ri} ${Ri} 0 1 1 ${x - Ri} ${y} A ${Ri} ${Ri} 0 1 1 ${x + Ri} ${y} Z`;
  function ring(q, x, y, Ro, Ri, o = F(3.2)) { const e = q.path(ringD(x, y, Ro, Ri), o); e.setAttribute('fill-rule', 'evenodd'); return e; }
  /* an object's entrance at t: pop (grows from px,py) · rise (from below) · drop (from above, lands with a bounce) */
  function inG(p, kind = 'pop', px = 0, py = 0, t = 0) { const K = { px, py, o: [[0, 0], [t, 0], [t + tu(.1), 1]] };
    if (kind === 'rise') K.y = [[0, 50], [t, 50], [t + tu(.3), -5, 'out'], [t + tu(.4), 0, 'soft']];
    else if (kind === 'drop') K.y = [[0, -80], [t, -80], [t + tu(.24), 0, 'in'], [t + tu(.31), -8, 'out'], [t + tu(.4), 0, 'soft']];
    else K.s = [[0, .82], [t, .82], [t + tu(.24), 1.03, 'out'], [t + tu(.38), 1, 'soft']];
    return mvG(p, K); }



  /* ---------- the data ---------- */
  const picOf = it => it && it.icon && (G.icons[it.icon] || G.icons[it.icon + '-pro']);
  /* points: 3 moments (THING, or {} when the line gives none) · at: where the pointer stops (0–2, default 2) · result: what the time brought.
     now = the index the pointer ends on: 0–2 a point, 3 = the result (it has one and at = 2). Items after `now` are not reached yet (dim). */
  const N3 = [0, 1, 2];
  function st(d) { const P = Array.isArray(d.points) && d.points.length ? N3.map(i => d.points[i] || {}) : null;
    const at = Math.max(0, Math.min(2, Math.round(d.at ?? 2))), R = d.result && (picOf(d.result) || d.result.label) ? d.result : null;
    return { P, at, R, now: R && at === 2 ? 3 : at }; }
  const ph = (S0, i) => i < S0.now ? 'past' : i === S0.now ? 'now' : 'next';
  const reached = (S0, i) => i <= S0.now;
  const dimK = (S0, i) => i > S0.now ? [[0, 1], [Z.H, 1], [aH(.25), .45]] : null;
  function dimG(q, S0, i) { const g = sub(q), k = dimK(S0, i); if (k) on(g, q, 0, { o: k }); return g; }
  /* x (or y) of the slots: 3 points evenly from a to b, plus the result's slot at b when there is one */
  const lay = (S0, a, b) => { const n = S0.R ? 4 : 3; return [...Array(n)].map((_, i) => f1(a + (b - a) * i / (n - 1))); };
  const itOf = (S0, i) => i === 3 ? S0.R : S0.P && S0.P[i];
  /* a THING's picture at (cx, cy), width wd; no picture → its label in big type. o.t = when it comes in · o.mv = keys of the part it rides ·
     o.o = opacity keys · o.iconOnly = no big-type fallback */
  function pic(it, cx, cy, wd, c, o = {}) {
    if (!it) return null; const at = c.at || 0, X = c.x + cx * c.s, Y = c.y + cy * c.s, fn = picOf(it), t = o.t ?? tu(.12);
    if (!fn && o.iconOnly) return null;
    let a;
    if (fn) a = G.art(fn, { x: X, y: Y, w: wd * c.s, at: at + t, speed: Z.sp });
    else { const str = it.label || it.icon; if (!str) return null;
      const f = q => txt(q, str, 0, wd * .11, { size: wd * .3, maxW: o.bigW || wd * 1.5, weight: 700, color: C.ink, wrap: 'mid' }); f.custom = true; f.dur = .3; f.exit = 'pop';
      a = G.art(f, { x: X, y: Y, s: c.s, at: at + t, speed: 1 }); a.speed = Z.sp; }
    const K = { ox: X, oy: Y }; let any = false;
    if (o.mv) { const m = o.mv; ['x', 'y'].forEach(n => { if (m[n]) K[n] = m[n].map(([u, v, e]) => [u, v * c.s, e]); }); ['s', 'r'].forEach(n => { if (m[n]) K[n] = m[n]; }); any = true; }
    if (o.o) { K.o = o.o; any = true; }
    if (any) kf(a.wrap, at, K);
    if (o.punch) kf(a.g, at, { ox: X, oy: Y, s: [[0, 1], [Z.H, 1], [aH(.07), 1.12, 'out'], [aH(.3), 1, 'soft']] });
    else if (o.pass != null) kf(a.g, at, { ox: X, oy: Y, s: [[0, 1], [o.pass, 1], [o.pass + tu(.07), 1.07, 'out'], [o.pass + tu(.25), 1, 'soft']] });
    return a;
  }
  /* item i (0–2 point, 3 result): its picture (dims when not reached) · its label (under an icon; o.always = also when it has no icon) */
  function itPic(c, S0, i, x, y, w, o = {}) { const it = itOf(S0, i); if (!it) return null; const O = Object.assign({ o: dimK(S0, i), t: tItem(S0, i) }, o);
    if (TT && i < S0.now && i < 3 && O.pass == null) O.pass = TT.tP(i);
    if (i === S0.now) O.punch = true;
    return pic(it, x, y, w, c, O); }
  function itLab(q, S0, i, x, y, o = {}) { const it = itOf(S0, i); if (!it || !it.label || (!o.always && !picOf(it))) return null;
    const a = sub(q); atT(a, q, (o.t ?? tItem(S0, i)) + tu(.1));
    return txt(dimG(a, S0, i), it.label, x, y, Object.assign({ maxW: 220, color: C.ink, weight: 700, size: 34, wrap: 'down' }, o)); }
  const item = (q, c, S0, i, x, y, w, ly, o = {}) => { itPic(c, S0, i, x, y, w, o.pic || {}); if (ly != null) itLab(q, S0, i, x, ly, o.lab || {}); };

  const V = [];
  const variant = (id, th, build) => V.push({ id, th, build });
  const halo = (q, x, y, r) => { q.circle(x, y, r, { fill: 'rgba(255,255,255,.06)', sw: 0, stroke: 'none' }); q.circle(x, y, r, S(1.8)); };
  const pathOf = (pts, close = true) => 'M ' + pts.map(([x, y]) => f1(x) + ' ' + f1(y)).join(' L ') + (close ? ' Z' : '');
  const shape = (q, pts, o) => q.path(pathOf(pts), o);
  let CID = 0;
  function clipG(p, x, y, w, h) { const svg = p.g.ownerSVGElement, cp = document.createElementNS(NS, 'clipPath'), r = document.createElementNS(NS, 'rect');
    cp.id = 'b09clip' + (++CID); Object.entries({ x, y, width: w, height: h }).forEach(([k, v]) => r.setAttribute(k, v)); cp.appendChild(r);
    (svg.querySelector('defs') || svg).appendChild(cp); return sub(p, { 'clip-path': `url(#${cp.id})` }); }
  const lerp = (a, b, k) => a + (b - a) * k;
  const SOLID = (w = 2) => ({ fill: C.ink, sw: w });
  const atG = (q, t) => { const g = sub(q); atT(g, q, t); return g; };

  /* ---------- motion (CutPack B09: the line draws out → the moments come in → the pointer walks past them → on the keyword it stops
     on `at` / the result shows up → hold) ----------
     tl(S0): tI(i) = when item i comes in · T0 = when the pointer sets off (a long sentence: it waits, then goes — B05 lesson) ·
     tP(i) = when the pointer reaches item i (i ≤ now; tP(now) = the keyword H). step = the time between two moments. */
  let TT = null;
  /* smooth: true (user 2026-11-13 "ทำให้อนิเมชั่นมันสมูทกว่านี้" for 01 02 03 08 10 13 15 16 18) — one continuous trip instead of a stop at every
     moment: soft start, steady through the moments, gentle arrival (sm); tP(i) = when it really passes moment i. end = when the trip ends (default H) */
  const SMG = .8, sm = u => .5 - .5 * Math.cos(Math.PI * Math.pow(Math.min(1, Math.max(0, u)), SMG)), smInv = f => Math.pow(Math.acos(1 - 2 * f) / Math.PI, 1 / SMG);
  function tl(S0, o = {}) { const H = Z.H, k = S0.now, tI = i => i === 3 ? tu(.5) : tu(.2 + .1 * i);
    if (o.smooth) { const E = o.end ?? H, T0 = Math.max(tu(.5), E - (k + 1) * tu(.4)), D = E - T0;
      return TT = { H, k, T0, E, D, smooth: true, step: D / (k + 1), tP: i => i <= k ? T0 + D * smInv((i + 1) / (k + 1)) : null, tI }; }
    const T0 = Math.max(tu(.55), H - (k + 1) * tu(.32)), step = (H - T0) / (k + 1);
    return TT = { H, k, T0, E: H, step, tP: i => i <= k ? T0 + step * (i + 1) : null, tI }; }
  /* a travelling value: v0 until T0, then v[i] at tP(i) (eased step to step) — absolute; relK / scK turn it into keys */
  function travA(T, v0, v) { const A = [[0, v0], [T.T0, v0]];
    if (T.smooth) { const P = [v0].concat(v.slice(0, T.k + 1)), N = 10 * (T.k + 1);
      for (let j = 1; j <= N; j++) { const u = j / N, s2 = (T.k + 1) * sm(u), g = Math.min(T.k, Math.floor(s2)); A.push([T.T0 + T.D * u, lerp(P[g], P[g + 1], s2 - g)]); }
      return A; }
    for (let i = 0; i <= T.k; i++) A.push([T.tP(i), v[i], i === T.k ? 'out' : 'io']); return A; }
  const relK = (A, fin, k = 1) => A.map(([t, v, e]) => e ? [t, f1((v - fin) * k), e] : [t, f1((v - fin) * k)]);
  const scK = (A, a, fin) => A.map(([t, v, e]) => { const s = +Math.max(.001, (v - a) / (fin - a)).toFixed(4); return e ? [t, s, e] : [t, s]; });
  /* lit at t (an overlay that turns on) · a halo that blooms on the keyword · strokes that draw themselves */
  const litG = (q, t) => { const g = sub(q); on(g, q, 0, { o: [[0, 0], [t, 0], [t + tu(.08), 1]] }); return g; };
  function haloH(q, x, y, r, t) { t = t ?? Z.H; const g = sub(q); on(g, q, 0, { ox: x, oy: y, s: [[0, .6], [t, .6], [t + tu(.3), 1, 'out']], o: [[0, 0], [t, 0], [t + tu(.1), 1]] }); halo(g, x, y, r); return g; }
  const drawAt = (el, q, t, dur) => on(el, q, t, { draw: [[0, 0], [dur ?? tu(.3), 1, 'out']] });
  /* entrance of a group at t (pop · drop · rise) about (x, y), then its dim on the keyword when not reached */
  const inD = (q, S0, i, kind, x, y, t) => dimG(inG(q, kind, x, y, t), S0, i);
  const tItem = (S0, i) => i === 3 ? (reached(S0, 3) ? Z.H - tu(.12) : TT.tI(3)) : TT.tI(i);

  /* 01 ── LINE: the plain timeline — the line draws out, the moments come in, a glowing dot walks from moment to moment (each one lights as
     it passes) and stops on `at`; the result waits at the end */
  variant('line', 'เส้นเวลา', (d, c) => { const S0 = st(d), T = tl(S0, { smooth: true }), y0 = 40, X = lay(S0, -360, 360);
    art(c, p => {
      const xEnd = S0.R ? X[3] - 102 : 465, xNow = S0.now === 3 ? xEnd : X[S0.now], A = travA(T, -465, [X[0], X[1], X[2], xEnd]);
      drawAt(p.line(-465, y0, xEnd, y0, S(3)), p, 0, tu(.45));
      const br = sub(p); on(br, p, 0, { ox: -465, oy: y0, sx: scK(A, -465, xNow), o: [[0, 0], [T.T0, 0], [T.T0 + tu(.04), 1]] }); br.line(-465, y0, xNow, y0, W(7));
      atG(p, 0).circle(-465, y0, 10, SOLID());
      N3.forEach(i => { const x = X[i], g = inD(p, S0, i, 'pop', x, y0, T.tI(i)); g.circle(x, y0, 20, F(3));
        if (reached(S0, i)) litG(g, T.tP(i)).circle(x, y0, 20, SOLID()); if (ph(S0, i) === 'now') haloH(p, x, y0, 46); });
      if (S0.R) { const x = X[3]; if (S0.now === 3) haloH(p, x, y0, 128); inD(p, S0, 3, 'pop', x, y0, T.tI(3)).circle(x, y0, 100, F(3.4)); item(p, c, S0, 3, x, y0, 125, y0 + 160); }
      const dot = sub(p); on(dot, p, 0, { x: relK(A, xNow), o: [[0, 0], [T.T0 - tu(.1), 0], [T.T0, 1], [T.H, 1], [aH(.2), 0]] }); halo(dot, xNow, y0, 30); dot.circle(xNow, y0, 13, SOLID());
      N3.forEach(i => item(p, c, S0, i, X[i], y0 - 120, 120, y0 + 90));
    }); });

  /* 02 ── SCRUBBER: play is pressed, the chapters' thumbnails pop up, the playhead runs along the bar (it fills behind it) and stops on `at`;
     the end card is the result */
  variant('scrubber', 'แถบเล่นวิดีโอ', (d, c) => { const S0 = st(d), T = tl(S0, { smooth: true }), yb = 175, X = S0.R ? lay(S0, -270, 360) : lay(S0, -250, 330), cw = S0.R ? 170 : 190;
    art(c, p => {
      const pl = inG(p, 'pop', -445, yb, 0); pl.circle(-445, yb, 40, F(3.2)); const tri = sub(pl); on(tri, p, 0, { ox: -445, oy: yb, s: [[0, 1], [T.T0 - tu(.16), 1], [T.T0 - tu(.08), .8, 'in'], [T.T0, 1, 'out']] });
      shape(tri, [[-457, yb - 19], [-425, yb], [-457, yb + 19]], SOLID(1.6));
      const x0 = -385, x1 = 460, xNow = S0.now === 3 ? X[3] : X[S0.now], A = travA(T, x0, X);
      drawAt(R(p, x0, yb - 8, x1 - x0, 16, 8, F(2.4)), p, tu(.05), tu(.35));
      const fl = sub(p); on(fl, p, 0, { ox: x0, oy: yb, sx: scK(A, x0, xNow), o: [[0, 0], [T.T0, 0], [T.T0 + tu(.04), 1]] }); R(fl, x0, yb - 8, xNow - x0, 16, 8, SOLID(1.6));
      X.forEach((x, i) => { const big = i === 3, w = big ? cw + 40 : cw, h = big ? 180 : 140, cy = big ? -50 : -40, g = inD(p, S0, i, 'pop', x, cy, T.tI(i));
        g.line(x, cy + h / 2, x, yb - 22, S(2)); R(g, x - w / 2, cy - h / 2, w, h, 16, big ? F(3.6) : F(3)); });
      N3.forEach(i => { const g = atG(p, T.tI(i)); g.line(X[i], yb - 15, X[i], yb + 15, { sw: 3, stroke: C.soft }); if (reached(S0, i)) litG(p, T.tP(i)).line(X[i], yb - 15, X[i], yb + 15, { sw: 3, stroke: C.fill }); });
      const kn = sub(p); on(kn, p, 0, { x: relK(A, xNow), o: [[0, 0], [tu(.3), 0], [tu(.4), 1]] }); halo(kn, xNow, yb, 40); kn.circle(xNow, yb, 21, SOLID());
      N3.forEach(i => item(p, c, S0, i, X[i], -40, 95, yb + 70, { lab: { maxW: cw, size: 32 } }));
      if (S0.R) item(p, c, S0, 3, X[3], -50, 115, yb + 70, { lab: { maxW: cw + 40, size: 32 } });
    }); });

  /* 03 ── TAPE MEASURE: the tape slides out of its case (lock clicks), its hook passes each moment's mark and stops on `at` (or at the result) */
  variant('tape', 'ตลับเมตรดึงออก', (d, c) => { const S0 = st(d), T = tl(S0, { smooth: true }), fy = 222, X = S0.R ? lay(S0, -200, 380) : lay(S0, -180, 400);
    art(c, p => {
      drawAt(p.line(-480, fy, 480, fy, S(2)), p, 0, tu(.4));
      const xe = S0.now === 3 ? X[3] - 92 : X[S0.now] + 6, A = travA(T, -306, [X[0] + 6, X[1] + 6, X[2] + 6, X[3] - 92]);
      const cl = clipG(p, -330, -350, 830, 700), tg = sub(cl); on(tg, p, 0, { x: relK(A, xe) });
      R(tg, -320 - (xe + 320), fy - 22, (xe + 320) * 2, 20, 3, F(2.6));
      for (let x = -300 - (xe + 320); x < xe - 6; x += 24) tg.line(x, fy - 22, x, fy - 15, S(1.4));
      R(tg, xe, fy - 44, 12, 42, 3, F(2.4));
      N3.forEach(i => { if (X[i] < xe) litG(p, T.tP(i) - tu(.04)).line(X[i], fy - 22, X[i], fy - 6, W(2.6)); });
      const cs = inG(p, 'pop', -397, fy - 82, 0); R(cs, -480, fy - 165, 165, 165, 32, F(3.4)); ring(cs, -397, fy - 82, 44, 16, F(3));
      const lk = sub(cs); on(lk, p, 0, { y: [[0, 0], [T.T0 - tu(.14), 0], [T.T0 - tu(.06), 6, 'in'], [T.T0, 0, 'out']] }); R(lk, -432, fy - 181, 54, 16, 6, F(2.4));
      N3.forEach(i => { const g = inD(p, S0, i, 'pop', X[i], 100, T.tI(i)); g.line(X[i], 82, X[i], fy - 30, S(1.8)); g.line(X[i] - 10, fy + 12, X[i] + 10, fy + 12, S(2.4)); });
      N3.forEach(i => item(p, c, S0, i, X[i], -70, 120, 40));
      if (S0.R) { const x = X[3]; if (S0.now === 3) haloH(p, x, fy - 85, 125); R(inD(p, S0, 3, 'drop', x, fy, T.tI(3)), x - 85, fy - 170, 170, 170, 18, F(3.4)); item(p, c, S0, 3, x, fy - 85, 110, fy - 195); }
    }); });

  /* 04 ── STOPWATCH: the crown is pressed, the hand sweeps round (the swept third of the dial glows as it goes), stops on `at` —
     a full turn = the last moment; the result card pops up beside the watch */
  variant('stopwatch', 'นาฬิกาจับเวลา', (d, c) => { const S0 = st(d), T = tl(S0), cx = S0.R ? -150 : 0, cy = 52, Rw = 245, A = i => 120 * (i + 1);
    const pt = (a, r) => [cx + r * Math.sin(rad(a)), cy - r * Math.cos(rad(a))];
    art(c, p => {
      const B = inG(p, 'pop', cx, cy, 0);
      const cr = sub(B); on(cr, p, 0, { y: [[0, 0], [T.T0 - tu(.16), 0], [T.T0 - tu(.07), 12, 'in'], [T.T0, 0, 'out']] });
      R(cr, cx - 18, cy - Rw - 34, 36, 40, 4, F(2.6)); R(cr, cx - 52, cy - Rw - 66, 104, 36, 12, F(3));
      const sb = rot(B, 45, cx, cy); R(sb, cx - 14, cy - Rw - 26, 28, 34, 6, F(2.6));
      B.circle(cx, cy, Rw, F(3.6));
      const aN = A(Math.min(S0.now, 2)), r0 = Rw - 22;
      for (let i = 0; i <= Math.min(S0.now, 2); i++) { const [ax, ay] = pt(i * 120, r0), [bx, by] = pt(A(i), r0), g = sub(B), t = T.tP(i);
        on(g, p, 0, { o: [[0, 0], [t - T.step * .85, 0], [t, 1]] }); g.path(`M ${cx} ${cy} L ${f1(ax)} ${f1(ay)} A ${r0} ${r0} 0 0 1 ${f1(bx)} ${f1(by)} Z`, { fill: GLASS, sw: 0, stroke: 'none' }); }
      N3.forEach(i => { const [a1, b1] = pt(A(i), Rw - 30), [a2, b2] = pt(A(i), Rw - 8); B.line(a1, b1, a2, b2, W(4.5)); });
      const hd = mvG(B, { px: cx, py: cy, r: relK(travA(T, 0, [A(0), A(1), A(2), A(2)]), aN) });
      const [hx, hy] = pt(aN, 78), [tx, ty] = pt(aN + 180, 26), [lx, ly] = pt(aN - 90, 7), [rx2, ry2] = pt(aN + 90, 7);
      shape(hd, [[tx, ty], [lx, ly], [hx, hy], [rx2, ry2]], SOLID(1.6)); B.circle(cx, cy, 15, SOLID()); B.circle(cx, cy, 5, { fill: C.fill, sw: 0, stroke: 'none' });
      N3.forEach(i => { const [x, y] = pt(A(i), 145); item(p, c, S0, i, x, y - 8, 84, y + 56, { lab: { maxW: 120, size: 28 } }); });
      if (S0.R) { const x = 285; if (S0.now === 3) haloH(p, x, 20, 140); R(inD(p, S0, 3, 'pop', x, 20, tItem(S0, 3)), x - 105, 20 - 105, 210, 210, 22, F(3.4)); item(p, c, S0, 3, x, 20, 130, 175); }
    }); });

  /* 05 ── CALENDAR: the calendar drops onto its nail, the days come in; each day that goes by is struck through, and on the keyword
     the day we stop on (or the result's day) is circled */
  variant('calendar', 'ปฏิทินขีดวัน', (d, c) => { const S0 = st(d), T = tl(S0), n = S0.R ? 4 : 3, x0 = -330, gap = 16, cw = (660 - gap * (n - 1)) / n, y0 = -170, ch = 230;
    art(c, p => {
      atG(p, 0).circle(0, -330, 8, SOLID());
      const P = inG(p, 'drop', 0, -330, 0); P.line(0, -330, -230, -250, S(1.8)); P.line(0, -330, 230, -250, S(1.8));
      R(P, -360, -250, 720, 530, 18, F(3.4)); R(P, -360, -250, 720, 46, 12, F(3));
      [-240, -120, 0, 120, 240].forEach(x => R(P, x - 7, -272, 14, 46, 7, F(2.4)));
      for (let r = 0; r < 2; r++) for (let k = 0; k < 7; k++) R(P, -330 + k * 96, 92 + r * 86, 84, 72, 8, S(1.6));
      for (let i = 0; i < n; i++) { const x = x0 + i * (cw + gap), cxm = x + cw / 2, g = inD(p, S0, i, 'pop', cxm, y0 + ch / 2, i === 3 ? T.tI(3) : T.tI(i)), s = ph(S0, i);
        R(g, x, y0, cw, ch, 12, i === 3 ? F(3.8) : F(3));
        if (s === 'past') drawAt(p.line(x + 14, y0 + 14, x + cw - 14, y0 + ch - 14, W(4)), p, T.tP(i) - T.step * .5, T.step * .45);
        if (s === 'now') { const e = rot(p, -5, cxm, y0 + ch / 2); drawAt(e.ellipse(cxm, y0 + ch / 2, cw / 2 + 14, ch / 2 + 10, W(4.5)), p, bH(.1), tu(.32)); }
        item(p, c, S0, i, cxm, y0 + 92, Math.min(i === 3 ? 125 : 110, cw * .66), y0 + ch - 24, { lab: { maxW: cw - 22, size: 30, wrap: 'up' }, pic: i === 3 ? { t: T.tI(3) } : {} }); }
    }); });

  /* 06 ── LIFT DIAL: the needle swings over from the left, pauses on each moment and stops on `at`; with a result the doors slide open
     on the keyword and the result is inside */
  variant('liftdial', 'หน้าปัดลิฟต์เก่า', (d, c) => { const S0 = st(d), T = tl(S0), oy = -45, A = [150, 90, 30], pt = (a, r) => [r * Math.cos(rad(a)), oy - r * Math.sin(rad(a))];
    art(c, p => {
      drawAt(p.line(-460, 300, 460, 300, S(2)), p, 0, tu(.4));
      const D = inG(p, 'rise', 0, 300, 0), open = !!S0.R;
      R(D, -195, -15, 390, 315, 10, F(3.4)); R(D, -160, 15, 320, 285, 4, { fill: C.fill, sw: 2 });
      if (open) { const gl = sub(D); on(gl, p, 0, { o: [[0, 0], [T.H, 0], [aH(.2), 1]] }); R(gl, -160, 15, 320, 285, 4, { fill: GLASS, sw: 2 });
        const op = clipG(D, -160, 15, 320, 285), sl = dx => mvG(op, { x: [[0, 0], [T.H - tu(.02), 0], [aH(.32), dx, 'io']] });
        R(sl(-126), -160, 15, 160, 285, 3, F(3)); R(sl(126), 0, 15, 160, 285, 3, F(3)); }
      else { R(D, -160, 15, 160, 285, 3, F(3)); R(D, 0, 15, 160, 285, 3, F(3)); }
      const Dl = inG(p, 'pop', 0, oy, tu(.12)); Dl.path(`M -215 ${oy} A 215 215 0 0 1 215 ${oy} Z`, F(3.4));
      N3.forEach(i => { const [a1, b1] = pt(A[i], 178), [a2, b2] = pt(A[i], 202); Dl.line(a1, b1, a2, b2, W(4.5)); });
      const aN = A[Math.min(S0.now, 2)], nd = mvG(Dl, { px: 0, py: oy, r: relK(travA(T, 180, [A[0], A[1], A[2], A[2]]), aN, -1) });
      const [hx, hy] = pt(aN, 86), [lx, ly] = pt(aN + 90, 7), [rx2, ry2] = pt(aN - 90, 7);
      shape(nd, [[lx, ly], [hx, hy], [rx2, ry2]], SOLID(1.6)); Dl.circle(0, oy, 16, SOLID());
      N3.forEach(i => { const [x, y] = pt(A[i], 128), [lx2, ly2] = pt(A[i], 245);
        item(p, c, S0, i, x, y, 72, null); itLab(p, S0, i, i === 1 ? 0 : lx2 + (i === 0 ? 10 : -10), i === 1 ? ly2 - 20 : ly2, { anchor: i === 0 ? 'end' : i === 2 ? 'start' : 'middle', maxW: 190, size: 30 }); });
      if (S0.R) { if (S0.now === 3) haloH(p, 0, 140, 120, aH(.1)); item(p, c, S0, 3, 0, 135, 150, 268, { lab: { maxW: 230, size: 32 }, pic: { t: reached(S0, 3) ? aH(.08) : T.tI(3) } }); }
    }); });

  /* 07 ── FLAP BOARD: the rows flip in one by one, the arrow steps down the rows (each row's lamp comes on as it passes) and stops on `at`;
     the result's row flips in under the line on the keyword */
  variant('flapboard', 'กระดานแผ่นพลิก', (d, c) => { const S0 = st(d), T = tl(S0), ys = S0.R ? [-180, -82, 16, 172] : [-150, -20, 110], rh = S0.R ? 80 : 96;
    art(c, p => {
      [-300, 300].forEach(x => atG(p, 0).line(x, -330, x, -262, W(2.4)));
      R(inG(p, 'pop', 0, 0, 0), -420, -262, 840, 524, 18, F(3.6));
      const row = (y, h, i, big) => { const t = i === 3 ? tItem(S0, 3) : T.tI(i), fg = mvG(p, { px: 74, py: y, sy: [[0, 0], [t, 0], [t + tu(.16), 1.06, 'out'], [t + tu(.26), 1, 'soft']], o: [[0, 0], [t, 0], [t + tu(.04), 1]] });
        const g = dimG(fg, S0, i), it = itOf(S0, i);
        R(g, -232, y - h / 2, 612, h, 10, big ? F(3.2) : F(2.6)); g.line(-230, y, 378, y, { sw: 3, stroke: C.fill });
        if (it && it.label) txt(g, it.label, -210, y + h * .17, { anchor: 'start', size: h * .46, maxW: 568, weight: 700, color: C.ink });
        const lg = atG(p, t); lg.circle(-362, y, 12, F(2.4)); if (reached(S0, i)) litG(p, T.tP(i)).circle(-362, y, 12, SOLID());
        if (ph(S0, i) === 'now') haloH(p, -362, y, 28);
        itPic(c, S0, i, -288, y, h * (big ? .86 : .76), { iconOnly: true, t: t + tu(.08) }); };
      N3.forEach(i => row(ys[i], rh, i, false));
      if (S0.R) { drawAt(p.line(-390, 82, 390, 82, S(2)), p, tu(.4), tu(.3)); row(172, 112, 3, true); }
      const yn = ys[S0.now], ar = sub(p); on(ar, p, 0, { y: relK(travA(T, ys[0], ys), yn), o: [[0, 0], [T.T0 - tu(.1), 0], [T.T0, 1]] });
      shape(ar, [[-410, yn - 12], [-392, yn], [-410, yn + 12]], SOLID(1.6));
    }); });

  /* 08 ── TRACK SPOT: the framed moments drop onto their nails, the spotlight switches on and runs along the ceiling track,
     lighting each frame in turn, and stops on `at` (or on the result) */
  variant('trackspot', 'ไฟรางส่องกรอบรูป', (d, c) => { const S0 = st(d), T = tl(S0, { smooth: true }), X = S0.R ? lay(S0, -330, 340) : lay(S0, -320, 320), fw = 170;
    art(c, p => {
      const rl = atG(p, 0); [-380, 380].forEach(x => rl.line(x, -345, x, -300, W(2.4))); drawAt(R(rl, -470, -300, 940, 16, 8, F(2.6)), p, 0, tu(.35));
      X.forEach((x, i) => { const w = i === 3 ? 210 : fw, top = -20 - w / 2, g = inD(p, S0, i, 'drop', x, top - 52, T.tI(i));
        g.circle(x, top - 52, 6, SOLID()); g.line(x, top - 52, x - w * .32, top, S(1.8)); g.line(x, top - 52, x + w * .32, top, S(1.8));
        R(g, x - w / 2, top, w, w, 6, F(i === 3 ? 4.4 : 4)); });
      const xn = X[S0.now], sp = sub(p); on(sp, p, 0, { x: relK(travA(T, X[0] - 170, X), xn), o: [[0, 0], [tu(.3), 0], [tu(.42), 1]] });
      const bm = sub(sp); on(bm, p, 0, { o: [[0, 0], [T.T0 - tu(.12), 0], [T.T0 - tu(.08), .6], [T.T0 - tu(.05), .1], [T.T0, 1]] });
      bm.path(pathOf([[xn - 36, -190], [xn + 36, -190], [xn + 125, 95], [xn - 125, 95]]), { fill: GLASS, sw: 0, stroke: 'none' });
      R(sp, xn - 26, -284, 52, 18, 6, F(2.4)); sp.line(xn, -266, xn, -240, W(3));
      shape(sp, [[xn - 22, -242], [xn + 22, -242], [xn + 36, -190], [xn - 36, -190]], F(3));
      N3.forEach(i => item(p, c, S0, i, X[i], -20, 110, 112, { lab: { maxW: 200, size: 32 } }));
      if (S0.R) item(p, c, S0, 3, X[3], -20, 140, 130, { lab: { maxW: 230, size: 32 }, pic: { t: T.tI(3) } });
    }); });

  /* 09 ── STAMP CARD: the stamp moves from slot to slot and comes down on each one (its print appears); it rises over the last one
     stamped — the card's last slot is the result */
  variant('stampcard', 'บัตรประทับตรา', (d, c) => { const S0 = st(d), T = tl(S0), X = S0.R ? lay(S0, -290, 300) : lay(S0, -270, 270), cy = -15, DN = 105;
    art(c, p => {
      const cd = inG(p, 'rise', 0, 0, 0); R(cd, -430, -170, 860, 340, 26, F(3.4)); cd.circle(-392, -132, 12, W(2));
      X.forEach((x, i) => { const g = inD(p, S0, i, 'pop', x, cy, i === 3 ? T.tI(3) : T.tI(i));
        if (i === 3) R(g, x - 85, cy - 85, 170, 170, 18, S(2)); else g.circle(x, cy, 70, S(2));
        if (reached(S0, i)) { const t = T.tP(i), pr = sub(p); on(pr, p, 0, { ox: x, oy: cy, s: [[0, 1.15], [t, 1.15], [t + tu(.1), 1, 'out']], o: [[0, 0], [t - tu(.01), 0], [t + tu(.03), 1]] });
          if (i === 3) R(pr, x - 85, cy - 85, 170, 170, 18, W(5)); else rot(pr, i % 2 ? 7 : -7, x, cy).circle(x, cy, 70, W(5)); } });
      const xn = X[S0.now], kx = [[0, X[0] - 150 - xn], [T.T0, X[0] - 150 - xn]], ky = [[0, -40], [T.T0, -40]];
      for (let i = 0; i <= T.k; i++) { const t = T.tP(i), s = T.step; kx.push([t - s * .32, f1(X[i] - xn), 'io'], [t + s * .18, f1(X[i] - xn)]);
        ky.push([t - s * .32, 0, 'io'], [t - s * .08, 0], [t, DN, 'in'], [t + s * .18, 0, 'out']); }
      const sg = sub(p); on(sg, p, 0, { x: kx, y: ky, o: [[0, 0], [T.T0 - tu(.12), 0], [T.T0, 1]] });
      R(sg, xn - 66, -232, 132, 14, 4, F(2.4)); R(sg, xn - 74, -270, 148, 40, 8, F(3)); R(sg, xn - 14, -306, 28, 38, 4, F(2.6)); sg.ellipse(xn, -316, 44, 24, F(3));
      N3.forEach(i => item(p, c, S0, i, X[i], cy, 82, 125, { lab: { maxW: 175, size: 30 } }));
      if (S0.R) item(p, c, S0, 3, X[3], cy, 112, 125, { lab: { maxW: 190, size: 30 }, pic: { t: reached(S0, 3) ? T.H - tu(.02) : T.tI(3) } });
    }); });

  /* 10 ── GLASS LIFT: the floors come in, the glass car rides up floor by floor (a short stop at each) and stops on `at`;
     the result waits on the top floor */
  variant('glasslift', 'ลิฟต์แก้วขึ้นชั้น', (d, c) => { const S0 = st(d), T = tl(S0, { smooth: true }), L = S0.R ? [255, 112, -31, -174] : [240, 60, -120], ch = 118;
    art(c, p => {
      const sh = atG(p, 0); R(sh, -112, -320, 12, 590, 4, F(2.4)); R(sh, 100, -320, 12, 590, 4, F(2.4)); R(sh, -140, -345, 280, 26, 6, F(3));
      L.forEach((y, i) => { const g = inD(p, S0, i, 'pop', 0, y, i === 3 ? T.tI(3) : T.tI(i)); R(g, 112, y, 330, 14, 4, F(2.4)); R(g, -442, y, 330, 14, 4, F(2.4)); });
      const yn = L[S0.now], A = travA(T, L[0], L), cb = sub(p); on(cb, p, 0, { y: relK(A, yn), o: [[0, 0], [tu(.1), 0], [tu(.22), 1]] });
      const cbl = sub(p); on(cbl, p, 0, { ox: 0, oy: -319, sy: scK(A, -319 + ch + 10, yn), o: [[0, 0], [tu(.1), 0], [tu(.22), 1]] }); cbl.line(0, -319, 0, yn - ch - 10, W(2.4));
      R(cb, -96, yn - ch - 10, 192, 12, 4, F(2.6)); R(cb, -88, yn - ch, 176, ch, 8, { fill: GLASS, sw: 3.2 }); cb.line(-80, yn - 50, 80, yn - 50, W(1.8));
      if (S0.now !== 3) haloH(p, 277, yn - 58, 82);
      N3.forEach(i => item(p, c, S0, i, 277, L[i] - 58, 98, null)); N3.forEach(i => itLab(p, S0, i, -277, L[i] - 24, { maxW: 300, size: 34 }));
      if (S0.R) { if (S0.now === 3) haloH(p, 277, L[3] - 62, 90); item(p, c, S0, 3, 277, L[3] - 62, 112, null, { pic: { t: T.tI(3) } }); itLab(p, S0, 3, -277, L[3] - 24, { maxW: 300, size: 34 }); }
    }); });

  /* 11 ── LAMP POSTS: the posts rise one by one; as time goes the lamps come on one after another, and on the keyword the one we stop on
     (or the result's) glows brightest */
  variant('lampposts', 'เสาไฟติดทีละต้น', (d, c) => { const S0 = st(d), T = tl(S0), gy = 292, X = S0.R ? lay(S0, -360, 330) : lay(S0, -330, 330);
    art(c, p => {
      drawAt(p.line(-480, gy, 480, gy, S(2)), p, 0, tu(.4));
      X.forEach((x, i) => { const g = inD(p, S0, i, 'rise', x, gy, i === 3 ? T.tI(3) : T.tI(i)), on2 = reached(S0, i), s = ph(S0, i), big = i === 3, pw = big ? 190 : 160, phh = big ? 210 : 180, pt0 = big ? -125 : -110;
        if (s === 'now') haloH(g, x, -182, 92); else if (on2) halo(litG(g, T.tP(i)), x, -182, 58);
        R(g, x - 8, -160, 16, gy - 10 + 160, 3, F(2.4)); R(g, x - 26, gy - 28, 52, 28, 5, F(2.6));
        const lan = [[x - 28, -206], [x + 28, -206], [x + 20, -156], [x - 20, -156]]; shape(g, lan, { fill: C.fill, sw: 3 });
        if (on2) { const lt = sub(g); on(lt, g, 0, { o: [[0, 0], [T.tP(i), 0], [T.tP(i) + tu(.03), 1], [T.tP(i) + tu(.06), .3], [T.tP(i) + tu(.1), 1]] }); shape(lt, lan, { fill: LIT, sw: 3 }); }
        shape(g, [[x - 38, -206], [x + 38, -206], [x + 18, -228], [x - 18, -228]], F(2.8)); g.circle(x, -236, 7, SOLID());
        R(g, x - pw / 2, pt0, pw, phh, 12, F(3)); });
      N3.forEach(i => item(p, c, S0, i, X[i], -40, 90, 50, { lab: { maxW: 140, size: 28, wrap: 'up' } }));
      if (S0.R) item(p, c, S0, 3, X[3], -45, 118, 63, { lab: { maxW: 170, size: 30, wrap: 'up' }, pic: { t: T.tI(3) } });
    }); });

  /* 12 ── ADVENT: the little doors come in closed; as time goes they swing open one by one, showing each moment, and the big door —
     the result — opens on the keyword */
  variant('advent', 'ปฏิทินช่องเปิด', (d, c) => { const S0 = st(d), T = tl(S0), ds = S0.R ? 160 : 190, X = S0.R ? [-320, -120, 80] : [-280, 0, 280], dy = S0.R ? -40 : -55;
    art(c, p => {
      R(inG(p, 'pop', 0, 0, 0), -440, -250, 880, 475, 22, F(3.4));
      const door = (x, y, w, h, i) => { const g = inD(p, S0, i, 'pop', x, y, i === 3 ? T.tI(3) : T.tI(i)), s = ph(S0, i), x0 = x - w / 2, y0 = y - h / 2;
        if (reached(S0, i)) { const t = T.tP(i), t0 = t - tu(.22);
          R(g, x0, y0, w, h, 6, { fill: C.fill, sw: 2.4 }); if (s === 'now') R(litG(g, t), x0, y0, w, h, 6, { fill: GLASS, sw: 4.2 });
          const lf = mvG(g, { px: x0, py: y, sx: [[0, 0], [t0, 0], [t, 1, 'out']], o: [[0, 0], [t0, 0], [t0 + tu(.02), 1]] });
          shape(lf, [[x0, y0], [x0 - 34, y0 + 18], [x0 - 34, y0 + h - 18], [x0, y0 + h]], F(3)); lf.circle(x0 - 26, y, 5, SOLID());
          const cl = mvG(g, { px: x0, py: y, sx: [[0, 1], [t0, 1], [t, .02, 'in']], o: [[0, 1], [t - tu(.02), 1], [t, 0]] }); R(cl, x0, y0, w, h, 6, F(3.4)); cl.circle(x0 + w - 22, y, 8, F(2.4)); }
        else { R(g, x0, y0, w, h, 6, F(3.4)); g.circle(x0 + w - 22, y, 8, F(2.4)); } };
      N3.forEach(i => door(X[i], dy, ds, ds, i));
      if (S0.R) door(320, -45, 200, 300, 3);
      N3.forEach(i => { if (reached(S0, i)) itPic(c, S0, i, X[i], dy, ds * .6, { t: T.tP(i) - tu(.1) }); itLab(p, S0, i, X[i], dy + ds / 2 + 52, { maxW: ds + 20, size: 30, always: !reached(S0, i) }); });
      if (S0.R) { if (reached(S0, 3)) itPic(c, S0, 3, 320, -45, 135, { t: T.H - tu(.1) }); itLab(p, S0, 3, 320, 160, { maxW: 220, size: 30, always: !reached(S0, 3) }); }
    }); });

  /* 13 ── PIPE: the valve wheel turns, the flow runs down the pipe (each sight glass lights as it arrives) and stops at `at` —
     or runs on and fills the result's tank on the keyword */
  variant('pipe', 'ท่อไหลผ่านช่องกระจก', (d, c) => { const S0 = st(d), T = tl(S0, { smooth: true }), py = 60, X = S0.R ? lay(S0, -260, 330) : lay(S0, -250, 330);
    art(c, p => {
      const xe = S0.R ? X[3] - 90 : 470, xf = S0.now === 3 ? xe : X[S0.now], A = travA(T, -470, [X[0], X[1], X[2], xe]);
      drawAt(R(p, -480, py - 25, xe + 480, 50, S0.R ? 4 : 25, F(3.2)), p, 0, tu(.4));
      const fl = sub(p); on(fl, p, 0, { ox: -470, oy: py, sx: scK(A, -470, xf), o: [[0, 0], [T.T0, 0], [T.T0 + tu(.04), 1]] }); R(fl, -470, py - 14, xf + 470, 28, 12, { fill: LIT, sw: 0, stroke: 'none' });
      const vv = inG(p, 'pop', -425, py, 0); R(vv, -455, py - 42, 60, 84, 10, F(3)); vv.line(-425, py - 42, -425, py - 84, W(3)); vv.circle(-425, py - 108, 30, F(3));
      const wh = mvG(vv, { px: -425, py: py - 108, r: [[0, 0], [T.T0 - tu(.32), 0], [T.T0, -180, 'io']] });
      wh.line(-449, py - 108, -401, py - 108, W(2.2)); wh.line(-425, py - 132, -425, py - 84, W(2.2)); vv.circle(-425, py - 108, 8, SOLID());
      N3.forEach(i => { const x = X[i], g = inG(p, 'pop', x, py, T.tI(i)); g.circle(x, py, 54, F(3.4)); g.circle(x, py, 36, { fill: C.fill, sw: 2.2 });
        if (reached(S0, i)) litG(g, T.tP(i) - tu(.03)).circle(x, py, 36, { fill: LIT, sw: 2.2 }); if (ph(S0, i) === 'now') haloH(p, x, py, 80); });
      if (S0.R) { const x = X[3], full = reached(S0, 3), top = -150, bot = 210, g = inD(p, S0, 3, 'rise', x, bot, T.tI(3));
        if (full) haloH(p, x, -20, 150);
        R(g, x - 92, top, 184, bot - top, 26, F(3.4));
        if (full) { const lq = sub(g); on(lq, p, 0, { ox: x, oy: bot - 10, sy: [[0, .01], [T.H - T.step * .7, .01], [T.H, 1, 'out']], o: [[0, 0], [T.H - T.step * .7, 0], [T.H - T.step * .6, 1]] }); R(lq, x - 82, 40, 164, bot - 50, 18, { fill: LIT, sw: 0, stroke: 'none' }); }
        g.line(x - 60, bot, x - 60, bot + 30, W(3)); g.line(x + 60, bot, x + 60, bot + 30, W(3));
        item(p, c, S0, 3, x, -45, 112, 280); }
      N3.forEach(i => item(p, c, S0, i, X[i], -95, 108, 160, { lab: { maxW: 190, size: 32 } }));
    }); });

  /* 14 ── MILESTONES: the stone posts rise along the road one by one, a glowing traveller walks the road (it lights behind it),
     pauses at each stone and stops on `at`; the signboard at the end is the result */
  variant('milestones', 'หลักบอกระยะริมทาง', (d, c) => { const S0 = st(d), T = tl(S0), ry = 262, X = S0.R ? lay(S0, -350, 320) : lay(S0, -330, 330);
    art(c, p => {
      const xn = S0.now === 3 ? X[3] - 120 : X[S0.now], A = travA(T, -480, [X[0], X[1], X[2], X[3] - 120]);
      drawAt(p.line(-480, ry, 480, ry, S(2.4)), p, 0, tu(.4)); drawAt(p.line(-480, ry + 40, 480, ry + 40, S(2)), p, tu(.05), tu(.4));
      const rd = sub(p); on(rd, p, 0, { ox: -480, oy: ry, sx: scK(A, -480, xn), o: [[0, 0], [T.T0, 0], [T.T0 + tu(.04), 1]] }); rd.line(-480, ry + 20, xn, ry + 20, W(5));
      N3.forEach(i => { const x = X[i], g = inD(p, S0, i, 'rise', x, ry, T.tI(i)), w = 140, top = -10;
        g.path(`M ${x - w / 2} ${ry} L ${x - w / 2} ${top + 70} A ${w / 2} ${w / 2} 0 0 1 ${x + w / 2} ${top + 70} L ${x + w / 2} ${ry} Z`, F(3.4));
        g.line(x - w / 2 + 14, 150, x + w / 2 - 14, 150, W(2)); });
      const dt = sub(p); on(dt, p, 0, { x: relK(A, xn), o: [[0, 0], [T.T0 - tu(.1), 0], [T.T0, 1]] }); halo(dt, xn, ry + 20, 34); dt.circle(xn, ry + 20, 14, SOLID());
      N3.forEach(i => item(p, c, S0, i, X[i], 82, 84, 210, { lab: { maxW: 115, size: 27 } }));
      if (S0.R) { const x = X[3], g = inD(p, S0, 3, 'rise', x, ry, T.tI(3)); if (S0.now === 3) haloH(p, x, -40, 150);
        g.line(x - 70, 60, x - 70, ry, W(3.4)); g.line(x + 70, 60, x + 70, ry, W(3.4)); R(g, x - 110, -150, 220, 210, 14, F(3.6));
        item(p, c, S0, 3, x, -45, 130, 140, { lab: { maxW: 130, size: 28 } }); }
    }); });

  /* 15 ── CANDLE: the candle is lit and burns down mark by mark (each mark vanishes once the flame is below it) and stops on `at`;
     the burnt part stays as a faint outline; the result shows beside it */
  variant('candle', 'เทียนบอกเวลา', (d, c) => { const S0 = st(d), T = tl(S0, { smooth: true }), cx = S0.R ? -20 : 90, ys = [-110, 15, 140], top0 = -200, base = 262;
    art(c, p => {
      const yt = ys[Math.min(S0.now, 2)], A = travA(T, top0, [ys[0], ys[1], ys[2], ys[2]]), Kd = relK(A, yt);
      R(atG(p, 0), cx - 60, top0, 120, base - top0, 10, S(1.6));
      const cl = clipG(p, cx - 90, -400, 180, base + 400), bd = sub(cl); on(bd, p, 0, { y: Kd }); R(bd, cx - 60, yt, 120, base - top0 + 30, 10, F(3.4));
      const fm = sub(p); on(fm, p, 0, { y: Kd });
      fm.path(`M ${cx - 60} ${yt + 10} Q ${cx - 30} ${yt + 26} ${cx - 16} ${yt + 6}`, W(2)); fm.line(cx, yt, cx, yt - 22, W(3));
      const fl = sub(fm); on(fl, p, 0, { ox: cx, oy: yt - 26, s: [[0, 0], [T.T0 - tu(.3), 0], [T.T0 - tu(.15), 1.2, 'out'], [T.T0, 1, 'soft']] });
      halo(fl, cx, yt - 62, 70);
      const fk = sub(fl); on(fk, p, T.T0, { loop: 1.2, ox: cx, oy: yt - 26, sx: [[0, 1], [.3, .92], [.6, 1.05], [.9, .96], [1.2, 1]], sy: [[0, 1], [.3, 1.06], [.6, .95], [.9, 1.03], [1.2, 1]] });
      fk.path(`M ${cx} ${yt - 112} C ${cx + 34} ${yt - 72}, ${cx + 30} ${yt - 30}, ${cx} ${yt - 26} C ${cx - 30} ${yt - 30}, ${cx - 34} ${yt - 72}, ${cx} ${yt - 112} Z`, { fill: LIT, sw: 3 });
      fk.path(`M ${cx} ${yt - 76} C ${cx + 12} ${yt - 58}, ${cx + 10} ${yt - 40}, ${cx} ${yt - 38} C ${cx - 10} ${yt - 40}, ${cx - 12} ${yt - 58}, ${cx} ${yt - 76} Z`, SOLID(1.6));
      const ds = inG(p, 'pop', cx, base, 0); ds.ellipse(cx, base + 10, 150, 22, F(3.2)); R(ds, cx - 80, base - 4, 160, 14, 4, F(2.4));
      N3.forEach(i => { const y = ys[i], g = inD(p, S0, i, 'pop', cx - 85, y, T.tI(i)), live = y >= yt; g.line(cx - 110, y, cx - (live ? 60 : 64), y, S(2));
        let mk = atG(p, T.tI(i)); if (!live) { mk = sub(mk); on(mk, p, 0, { o: [[0, 1], [T.tP(i) + tu(.04), 1], [T.tP(i) + tu(.12), 0]] }); } mk.line(cx - 60, y, cx + 60, y, W(2.6)); });
      N3.forEach(i => { item(p, c, S0, i, cx - 330, ys[i], 88, null); itLab(p, S0, i, cx - 122, ys[i] + 12, { anchor: 'end', maxW: 150, size: 32 }); });
      if (S0.R) { const x = 320; if (S0.now === 3) haloH(p, x, 60, 130); inD(p, S0, 3, 'pop', x, 60, tItem(S0, 3)).circle(x, 60, 105, F(3.4)); item(p, c, S0, 3, x, 60, 130, 215); }
    }); });

  /* 16 ── TRAM: the stops come in, the tram rolls in under its wire, stops at each stop for a moment and halts with its nose at `at`;
     the terminal at the end holds the result */
  variant('tram', 'รถรางผ่านป้าย', (d, c) => { const S0 = st(d), T = tl(S0, { smooth: true }), ty = 150, X = S0.R ? [-170, 10, 190, 370] : [-140, 100, 340];
    art(c, p => {
      drawAt(p.line(-480, -262, 480, -262, W(2)), p, 0, tu(.4)); drawAt(p.line(-480, ty + 18, 480, ty + 18, W(3)), p, 0, tu(.4));
      const sl = atG(p, tu(.1)); for (let x = -470; x < 480; x += 62) R(sl, x, ty + 22, 36, 8, 2, S(1.4));
      N3.forEach(i => { const x = X[i], g = inD(p, S0, i, 'rise', x, ty, T.tI(i)); R(g, x - 4, -100, 8, ty + 18 + 100, 2, F(2)); g.circle(x, -150, 56, F(3.2)); if (ph(S0, i) === 'now') haloH(p, x, -150, 80); });
      if (S0.R) { const x = X[3], g = inD(p, S0, 3, 'rise', x, ty, T.tI(3)); if (S0.now === 3) haloH(p, x, 50, 120);
        shape(g, [[x - 120, -40], [x + 120, -40], [x + 100, -70], [x - 100, -70]], F(3.2)); R(g, x - 104, -40, 12, ty + 58, 3, F(2.4)); R(g, x + 92, -40, 12, ty + 58, 3, F(2.4)); }
      const Lt = 280, front = [X[0] - 8, X[1] - 8, X[2] - 8, S0.R ? X[3] - 125 : 0], xf = front[S0.now], x0 = xf - Lt;
      const tr = sub(clipG(p, -500, -350, 1000, 700)); on(tr, p, 0, { x: relK(travA(T, -515, front), xf) });
      R(tr, x0 + 96, -6, 92, 14, 5, F(2.6));
      tr.poly([[x0 + 112, -6], [x0 + 150, -120], [x0 + 124, -258]], W(3)); tr.line(x0 + 96, -260, x0 + 156, -260, W(3.4));
      [x0 + 34, x0 + Lt - 104].forEach(x => { R(tr, x, 118, 70, 22, 6, F(2.6)); [x + 16, x + 54].forEach(w => { tr.circle(w, ty + 2, 12, F(2.6)); tr.circle(w, ty + 2, 4, SOLID()); }); });
      R(tr, x0, 8, Lt, 120, 30, F(3.6));
      R(tr, x0 + 14, 26, 40, 56, 10, W(2)); R(tr, x0 + Lt - 54, 26, 40, 56, 10, W(2));
      [x0 + 76, x0 + 182].forEach(x => R(tr, x, 30, 46, 40, 7, W(2)));
      R(tr, x0 + 128, 26, 44, 96, 6, W(2)); tr.line(x0 + 150, 26, x0 + 150, 122, W(1.6));
      tr.line(x0 + 8, 96, x0 + 122, 96, W(1.6)); tr.line(x0 + 178, 96, x0 + Lt - 8, 96, W(1.6)); tr.circle(x0 + Lt - 18, 108, 6, SOLID());
      N3.forEach(i => item(p, c, S0, i, X[i], -150, 72, -50, { lab: { maxW: 180, size: 30 } }));
      if (S0.R) item(p, c, S0, 3, X[3], 50, 118, -95, { lab: { maxW: 230, size: 30 } });
    }); });

  /* 17 ── CASCADE: water runs from the spout into the first tray; each tray fills and spills into the next one down; it stops at `at`,
     or runs on into the result's basin on the keyword */
  variant('cascade', 'น้ำล้นทีละชั้น', (d, c) => { const S0 = st(d), T = tl(S0), Tr = S0.R ? [[-300, -150], [-95, -30], [110, 90]] : [[-250, -130], [0, 20], [250, 170]], BW = 200;
    art(c, p => {
      const sx = Tr[0][0] - 60, sp = inG(p, 'pop', sx, -280, 0); R(sp, -490, -292, sx - 20 + 490, 26, 6, F(2.8)); sp.path(`M ${sx - 22} -292 Q ${sx + 6} -292 ${sx + 6} -262 L ${sx + 6} -246 L ${sx - 20} -246 L ${sx - 20} -266 Z`, F(2.8));
      const fillT = i => [T.tP(i) - T.step * .6, T.tP(i)], pour = i => [T.tP(i) - T.step, T.tP(i) - T.step * .62];
      const stream = (x1, y1, x2, y2, [a, b]) => drawAt(p.path(`M ${f1(x1)} ${f1(y1)} Q ${f1(x1 + 30)} ${f1(y1 + 6)} ${f1(x2)} ${f1(y2)}`, { sw: 5, stroke: C.ink, fill: 'none' }), p, a, b - a);
      drawAt(p.line(sx - 7, -246, sx - 7, Tr[0][1] - 26, { sw: 5, stroke: C.ink }), p, pour(0)[0], pour(0)[1] - pour(0)[0]);
      Tr.forEach(([x, y], i) => { const g = inD(p, S0, i, 'pop', x, y, T.tI(i)), full = reached(S0, i);
        if (full) { const [a, b] = fillT(i), w = sub(g); on(w, p, 0, { ox: x, oy: y + 18, sy: [[0, .02], [a, .02], [b, 1, 'out']], o: [[0, 0], [a, 0], [a + tu(.03), 1]] });
          shape(w, [[x - BW / 2 + 8, y - 16], [x + BW / 2 - 8, y - 16], [x + BW / 2 - 26, y + 18], [x - BW / 2 + 26, y + 18]], { fill: LIT, sw: 0, stroke: 'none' }); }
        shape(g, [[x - BW / 2, y - 26], [x + BW / 2, y - 26], [x + BW / 2 - 24, y + 26], [x - BW / 2 + 24, y + 26]], { fill: 'none', sw: 3.4 });
        g.line(x - BW / 2 - 8, y - 26, x + BW / 2 + 8, y - 26, W(3.4));
        if (ph(S0, i) === 'now') haloH(p, x, y - 70, 95);
        const nx = i < 2 ? Tr[i + 1] : S0.R ? [330, 230] : null;
        if (nx && reached(S0, i + 1)) stream(x + BW / 2 + 6, y - 26, nx[0] - (i < 2 ? BW / 2 - 30 : 70), nx[1] - (i < 2 ? 22 : 30), pour(i + 1)); });
      if (S0.R) { const x = 330, y = 255, full = reached(S0, 3), g = inD(p, S0, 3, 'pop', x, y, T.tI(3)); if (full) haloH(p, x, 150, 120);
        if (full) { const [a, b] = fillT(3), w = sub(g); on(w, p, 0, { ox: x, oy: y + 26, sy: [[0, .02], [a, .02], [b, 1, 'out']], o: [[0, 0], [a, 0], [a + tu(.03), 1]] });
          shape(w, [[x - 112, y - 30], [x + 112, y - 30], [x + 84, y + 26], [x - 84, y + 26]], { fill: LIT, sw: 0, stroke: 'none' }); }
        g.path(`M ${x - 130} ${y - 40} L ${x + 130} ${y - 40} Q ${x + 115} ${y + 40} ${x} ${y + 40} Q ${x - 115} ${y + 40} ${x - 130} ${y - 40} Z`, { fill: 'none', sw: 3.6 });
        item(p, c, S0, 3, x, 135, 112, null); itLab(p, S0, 3, x + 150, 110, { anchor: 'start', maxW: 160, size: 30 }); }
      Tr.forEach(([x, y], i) => { item(p, c, S0, i, x, y - 82, 92, null); itLab(p, S0, i, x, y + 66, { maxW: 190, size: 30 }); });
    }); });

  /* 18 ── CRANE: the gantry carries the result along its beam, stopping over each bay; it hangs over `at` — or, at the end,
     lowers the result onto its pad on the keyword */
  variant('crane', 'เครนขนตามราง', (d, c) => { const S0 = st(d), T = tl(S0, { smooth: true, end: S0.now === 3 ? Z.H - tu(.4) : undefined }), fy = 290, X = S0.R ? lay(S0, -330, 330) : lay(S0, -300, 300);
    art(c, p => {
      drawAt(p.line(-480, fy, 480, fy, S(2)), p, 0, tu(.4));
      const G0 = inG(p, 'rise', 0, fy, 0); R(G0, -470, -262, 22, fy + 262, 4, F(2.6)); R(G0, 448, -262, 22, fy + 262, 4, F(2.6)); R(G0, -480, -298, 960, 36, 6, F(3.4));
      X.forEach((x, i) => { const w = i === 3 ? 210 : 170; R(inD(p, S0, i, 'pop', x, fy - 11, i === 3 ? T.tI(3) : T.tI(i)), x - w / 2, fy - 22, w, 22, 4, F(2.8)); });
      const xn = X[S0.now], down = S0.now === 3, by = down ? fy - 22 : 40, hy = by - 140 - 60, up = 40 - 140 - 60, dy = up - hy;
      const A = travA(T, X[0] - 260, X), Hx = T.E;
      const Kx = relK(A, xn), lowK = [[0, dy], [Hx, dy], [T.H, 0, 'io']];
      const tg = sub(clipG(p, -446, -350, 892, 700)), tr = sub(tg); on(tr, p, 0, { x: Kx, o: [[0, 0], [tu(.25), 0], [tu(.35), 1]] });
      R(tr, xn - 46, -262, 92, 30, 6, F(3)); [-24, 24].forEach(dx => tr.circle(xn + dx, -264, 9, F(2.4)));
      const cb = sub(tr); if (down) on(cb, p, 0, { ox: xn, oy: -232, sy: lowK.map(([t, v, e]) => e ? [t, +((hy + v + 232) / (hy + 232)).toFixed(4), e] : [t, +((hy + v + 232) / (hy + 232)).toFixed(4)]) });
      cb.line(xn - 12, -232, xn - 12, hy, W(2.4)); cb.line(xn + 12, -232, xn + 12, hy, W(2.4));
      const hk = sub(tr); if (down) on(hk, p, 0, { y: lowK });
      R(hk, xn - 26, hy, 52, 36, 8, F(3)); hk.path(`M ${xn} ${hy + 36} L ${xn} ${hy + 50} Q ${xn + 16} ${hy + 50} ${xn + 16} ${hy + 64}`, W(3.4));
      if (S0.R) { const top = by - 140, g = dimG(hk, S0, 3); g.line(xn, hy + 56, xn - 80, top, S(2)); g.line(xn, hy + 56, xn + 80, top, S(2));
        if (down) haloH(p, xn, top + 70, 120); R(g, xn - 85, top, 170, 140, 12, F(3.4));
        const mv = { x: Kx }; if (down) mv.y = lowK; item(p, c, S0, 3, xn, top + 70, 100, null, { pic: { t: T.T0 + T.step * .7, mv } }); }
      N3.forEach(i => { item(p, c, S0, i, X[i], fy - 85, 100, null); itLab(p, S0, i, X[i], fy + 45, { maxW: 200, size: 32 }); });
      if (S0.R) itLab(p, S0, 3, X[3], fy + 45, { maxW: 220, size: 32 });
    }); });

  /* 19 ── BLOCKS: the outlines of the blocks are drawn on the floor; as time goes a block drops into each one (with a little bounce)
     and the last one lands on `at`; the big block at the end is the result */
  variant('blocks', 'บล็อกเรียงต่อกัน', (d, c) => { const S0 = st(d), T = tl(S0), fy = 205, X = S0.R ? lay(S0, -350, 300) : lay(S0, -320, 300);
    art(c, p => {
      drawAt(p.line(-480, fy, 480, fy, S(2)), p, 0, tu(.4));
      const cube = (g, x0, y0, w, h, dp, set) => { shape(g, [[x0, y0], [x0 + dp, y0 - dp], [x0 + w + dp, y0 - dp], [x0 + w, y0]], set ? F(2.6) : S(1.6));
        shape(g, [[x0 + w, y0], [x0 + w + dp, y0 - dp], [x0 + w + dp, fy - dp], [x0 + w, fy]], set ? F(2.6) : S(1.6)); R(g, x0, y0, w, h, 6, set ? F(3.2) : S(1.8)); };
      const dropK = t => ({ y: [[0, -230], [t - tu(.22), -230], [t, 0, 'in'], [t + tu(.07), -12, 'out'], [t + tu(.16), 0, 'soft']], o: [[0, 0], [t - tu(.22), 0], [t - tu(.2), 1]] });
      X.forEach((x, i) => { const big = i === 3, w = big ? 210 : 160, h = big ? 200 : 150, dp = 30, x0 = x - w / 2, y0 = fy - h;
        const gh = atG(p, i === 3 ? T.tI(3) : T.tI(i)); cube(dimG(gh, S0, i), x0, y0, w, h, dp, false);
        if (reached(S0, i)) { if (ph(S0, i) === 'now') haloH(p, x, y0 + h / 2, w * .78); const g = sub(p); on(g, p, 0, dropK(T.tP(i))); cube(g, x0, y0, w, h, dp, true); } });
      const mvOf = i => reached(S0, i) ? dropK(T.tP(i)) : null;
      N3.forEach(i => { const m = mvOf(i); itPic(c, S0, i, X[i], fy - 75, 92, m ? { mv: { y: m.y }, t: T.tP(i) - tu(.21) } : {}); itLab(p, S0, i, X[i], fy + 50, { maxW: 190, size: 32 }); });
      if (S0.R) { const m = mvOf(3); itPic(c, S0, 3, X[3], fy - 100, 125, m ? { mv: { y: m.y }, t: T.H - tu(.21) } : {}); itLab(p, S0, 3, X[3], fy + 50, { maxW: 230, size: 32 }); }
    }); });

  /* 20 ── TALLY: a chalkboard — five strokes are chalked up for each moment as it passes (the fifth across), the group we stop on
     is circled on the keyword; the result is boxed at the end */
  variant('tally', 'กระดานนับขีด', (d, c) => { const S0 = st(d), T = tl(S0), X = S0.R ? lay(S0, -300, 300) : lay(S0, -280, 280), gy = 30;
    art(c, p => {
      const B = inG(p, 'pop', 0, 0, 0); R(B, -440, -250, 880, 460, 16, F(3.6)); R(B, -400, 210, 800, 18, 4, F(2.6)); R(B, 250, 196, 70, 14, 4, F(2));
      N3.forEach(i => { const x = X[i], s = ph(S0, i); if (!reached(S0, i)) return; const t1 = T.tP(i), t0 = t1 - T.step * .85, dt = (t1 - t0) / 5;
        [-45, -15, 15, 45].forEach((dx, k) => drawAt(p.line(x + dx, gy - 58 + (k % 2) * 4, x + dx + (k % 2 ? 2 : -2), gy + 58, W(5)), p, t0 + k * dt, dt * .9));
        drawAt(p.line(x - 70, gy + 44, x + 70, gy - 40, W(5)), p, t0 + 4 * dt, dt);
        if (s === 'now') { const e = rot(p, -6, x, gy); drawAt(e.ellipse(x, gy, 96, 84, W(3.6)), p, aH(.02), tu(.3)); } });
      if (S0.R) { const x = X[3]; if (reached(S0, 3)) { haloH(p, x, gy - 20, 120); const e = rot(p, 3, x, gy - 20); drawAt(e.rect(x - 95, gy - 115, 190, 190, { rx: 8, sw: 3.6 }), p, T.H, tu(.3)); }
        item(p, c, S0, 3, x, gy - 20, 120, 160, { lab: { maxW: 200, size: 32 } }); }
      N3.forEach(i => item(p, c, S0, i, X[i], -165, 92, 160, { lab: { maxW: 190, size: 32 } }));
    }); });

  /* samples from unrelated topics (neutrality) + a stress set */
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
  G.cats.B09 = { variants: V, SAMPLES, STRESS, draw: (i, d, c) => { setZ(c); CUR = V[i].id; V[i].build(d, c); }, CLAMPS, timing: c => (setZ(c), Object.assign({}, Z)) };
})();
