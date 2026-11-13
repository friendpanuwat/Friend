/* b09.js — category B09 "เวลา / ไทม์ไลน์ / เดดไลน์": 20 neutral designs — STILL DRAFTS (round 1, waiting for the user's pick).
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
   This round places the parts in their final pose; motion comes after the pick. */
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
    return a;
  }
  /* item i (0–2 point, 3 result): its picture (dims when not reached) · its label (under an icon; o.always = also when it has no icon) */
  function itPic(c, S0, i, x, y, w, o = {}) { const it = itOf(S0, i); return it ? pic(it, x, y, w, c, Object.assign({ o: dimK(S0, i) }, o)) : null; }
  function itLab(q, S0, i, x, y, o = {}) { const it = itOf(S0, i); if (!it || !it.label || (!o.always && !picOf(it))) return null;
    return txt(dimG(q, S0, i), it.label, x, y, Object.assign({ maxW: 220, color: C.ink, weight: 700, size: 34, wrap: 'down' }, o)); }
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

  /* 01 ── LINE: the plain timeline — moments on one line, the part already passed is bright, the pointer rests on `at`, the result waits at the end */
  variant('line', 'เส้นเวลา', (d, c) => { const S0 = st(d), y0 = 40, X = lay(S0, -360, 360);
    art(c, p => {
      const xEnd = S0.R ? X[3] - 102 : 465, xNow = S0.now === 3 ? xEnd : X[S0.now];
      p.line(-465, y0, xEnd, y0, S(3)); p.line(-465, y0, xNow, y0, W(7)); p.circle(-465, y0, 10, SOLID());
      N3.forEach(i => { const x = X[i], s = ph(S0, i); if (s === 'now') halo(p, x, y0, 46); p.circle(x, y0, 20, s === 'next' ? F(3) : SOLID()); });
      if (S0.R) { const x = X[3]; if (S0.now === 3) halo(p, x, y0, 128); dimG(p, S0, 3).circle(x, y0, 100, F(3.4)); item(p, c, S0, 3, x, y0, 125, y0 + 160); }
      N3.forEach(i => item(p, c, S0, i, X[i], y0 - 120, 120, y0 + 90));
    }); });

  /* 02 ── SCRUBBER: a video player's bar — each moment is a chapter with its thumbnail, the bar fills up to the playhead, the result is the end card */
  variant('scrubber', 'แถบเล่นวิดีโอ', (d, c) => { const S0 = st(d), yb = 175, X = S0.R ? lay(S0, -270, 360) : lay(S0, -250, 330), cw = S0.R ? 170 : 190;
    art(c, p => {
      p.circle(-445, yb, 40, F(3.2)); shape(p, [[-457, yb - 19], [-425, yb], [-457, yb + 19]], SOLID(1.6));                 // play (paused)
      const x0 = -385, x1 = 460, xNow = S0.now === 3 ? X[3] : X[S0.now];
      R(p, x0, yb - 8, x1 - x0, 16, 8, F(2.4)); R(p, x0, yb - 8, xNow - x0, 16, 8, SOLID(1.6));
      [0, 1, 2, 3].slice(0, X.length).forEach(i => { const x = X[i], g = dimG(p, S0, i), big = i === 3, w = big ? cw + 40 : cw, h = big ? 180 : 140, cy = big ? -50 : -40;
        g.line(x, cy + h / 2, x, yb - 22, S(2)); R(g, x - w / 2, cy - h / 2, w, h, 16, big ? F(3.6) : F(3)); });
      N3.forEach(i => p.line(X[i], yb - 15, X[i], yb + 15, { sw: 3, stroke: reached(S0, i) ? C.fill : C.soft }));
      halo(p, xNow, yb, 40); p.circle(xNow, yb, 21, SOLID());
      N3.forEach(i => item(p, c, S0, i, X[i], -40, 95, yb + 70, { lab: { maxW: cw, size: 32 } }));
      if (S0.R) item(p, c, S0, 3, X[3], -50, 115, yb + 70, { lab: { maxW: cw + 40, size: 32 } });
    }); });

  /* 03 ── TAPE MEASURE: the tape pulls out of its case along the floor, past each moment's mark, and its hook stops at `at` (or at the result) */
  variant('tape', 'ตลับเมตรดึงออก', (d, c) => { const S0 = st(d), fy = 222, X = S0.R ? lay(S0, -200, 380) : lay(S0, -180, 400);
    art(c, p => {
      p.line(-480, fy, 480, fy, S(2));
      const xe = S0.now === 3 ? X[3] - 92 : X[S0.now] + 6;
      R(p, -320, fy - 22, xe - (-320), 20, 3, F(2.6));                                                                     // the tape
      for (let x = -300; x < xe - 6; x += 24) p.line(x, fy - 22, x, fy - 15, S(1.4));
      N3.forEach(i => { if (X[i] < xe) p.line(X[i], fy - 22, X[i], fy - 6, W(2.6)); });
      R(p, xe, fy - 44, 12, 42, 3, F(2.4));                                                                                 // hook
      R(p, -480, fy - 165, 165, 165, 32, F(3.4)); ring(p, -397, fy - 82, 44, 16, F(3)); R(p, -432, fy - 181, 54, 16, 6, F(2.4));   // case, hub, lock
      N3.forEach(i => { const g = dimG(p, S0, i); g.line(X[i], 82, X[i], fy - 30, S(1.8)); g.line(X[i] - 10, fy + 12, X[i] + 10, fy + 12, S(2.4)); });
      N3.forEach(i => item(p, c, S0, i, X[i], -70, 120, 40));
      if (S0.R) { const x = X[3], g = dimG(p, S0, 3); if (S0.now === 3) halo(p, x, fy - 85, 125); R(g, x - 85, fy - 170, 170, 170, 18, F(3.4)); item(p, c, S0, 3, x, fy - 85, 110, fy - 195); }
    }); });

  /* 04 ── STOPWATCH: the moments sit at the thirds of the dial; the hand sweeps round (the swept part glows) and stops at `at` —
     a full turn = the last moment; the result shows beside the watch */
  variant('stopwatch', 'นาฬิกาจับเวลา', (d, c) => { const S0 = st(d), cx = S0.R ? -150 : 0, cy = 52, Rw = 245, A = i => 120 * (i + 1);
    const pt = (a, r) => [cx + r * Math.sin(rad(a)), cy - r * Math.cos(rad(a))];
    art(c, p => {
      R(p, cx - 18, cy - Rw - 34, 36, 40, 4, F(2.6)); R(p, cx - 52, cy - Rw - 66, 104, 36, 12, F(3));                    // crown
      const sb = rot(p, 45, cx, cy); R(sb, cx - 14, cy - Rw - 26, 28, 34, 6, F(2.6));                                   // side button
      p.circle(cx, cy, Rw, F(3.6));
      const aN = A(Math.min(S0.now, 2));
      if (aN >= 360) p.circle(cx, cy, Rw - 22, { fill: GLASS, sw: 0, stroke: 'none' });
      else { const [ex, ey] = pt(aN, Rw - 22); p.path(`M ${cx} ${cy} L ${cx} ${f1(cy - Rw + 22)} A ${Rw - 22} ${Rw - 22} 0 ${aN > 180 ? 1 : 0} 1 ${f1(ex)} ${f1(ey)} Z`, { fill: GLASS, sw: 0, stroke: 'none' }); }
      N3.forEach(i => { const [a1, b1] = pt(A(i), Rw - 30), [a2, b2] = pt(A(i), Rw - 8); p.line(a1, b1, a2, b2, W(4.5)); });
      const [hx, hy] = pt(aN, 78), [tx, ty] = pt(aN + 180, 26), [lx, ly] = pt(aN - 90, 7), [rx2, ry2] = pt(aN + 90, 7);
      shape(p, [[tx, ty], [lx, ly], [hx, hy], [rx2, ry2]], SOLID(1.6)); p.circle(cx, cy, 15, SOLID()); p.circle(cx, cy, 5, { fill: C.fill, sw: 0, stroke: 'none' });
      N3.forEach(i => { const [x, y] = pt(A(i), 145); item(p, c, S0, i, x, y - 8, 84, y + 56, { lab: { maxW: 120, size: 28 } }); });
      if (S0.R) { const x = 285, g = dimG(p, S0, 3); if (S0.now === 3) halo(p, x, 20, 140); R(g, x - 105, 20 - 105, 210, 210, 22, F(3.4)); item(p, c, S0, 3, x, 20, 130, 175); }
    }); });

  /* 05 ── CALENDAR: a wall calendar — the days already gone are struck through, the day we stop on is circled (or the result's day) */
  variant('calendar', 'ปฏิทินขีดวัน', (d, c) => { const S0 = st(d), n = S0.R ? 4 : 3, x0 = -330, gap = 16, cw = (660 - gap * (n - 1)) / n, y0 = -170, ch = 230;
    art(c, p => {
      p.circle(0, -330, 8, SOLID()); p.line(0, -330, -230, -250, S(1.8)); p.line(0, -330, 230, -250, S(1.8));
      R(p, -360, -250, 720, 530, 18, F(3.4)); R(p, -360, -250, 720, 46, 12, F(3));
      [-240, -120, 0, 120, 240].forEach(x => R(p, x - 7, -272, 14, 46, 7, F(2.4)));
      for (let r = 0; r < 2; r++) for (let k = 0; k < 7; k++) R(p, -330 + k * 96, 92 + r * 86, 84, 72, 8, S(1.6));
      for (let i = 0; i < n; i++) { const x = x0 + i * (cw + gap), cxm = x + cw / 2, g = dimG(p, S0, i), s = ph(S0, i);
        R(g, x, y0, cw, ch, 12, i === 3 ? F(3.8) : F(3));
        if (s === 'past') g.line(x + 14, y0 + 14, x + cw - 14, y0 + ch - 14, W(4));
        if (s === 'now') { const e = rot(p, -5, cxm, y0 + ch / 2); e.ellipse(cxm, y0 + ch / 2, cw / 2 + 14, ch / 2 + 10, W(4.5)); }
        item(p, c, S0, i, cxm, y0 + 92, Math.min(i === 3 ? 125 : 110, cw * .66), y0 + ch - 24, { lab: { maxW: cw - 22, size: 30, wrap: 'up' } }); }
    }); });

  /* 06 ── LIFT DIAL: the old floor dial over a lift — the needle swings from moment to moment; with a result the doors open on it */
  variant('liftdial', 'หน้าปัดลิฟต์เก่า', (d, c) => { const S0 = st(d), oy = -45, A = [150, 90, 30], pt = (a, r) => [r * Math.cos(rad(a)), oy - r * Math.sin(rad(a))];
    art(c, p => {
      p.line(-460, 300, 460, 300, S(2));
      R(p, -195, -15, 390, 315, 10, F(3.4));
      const open = !!S0.R;
      R(p, -160, 15, 320, 285, 4, { fill: open ? GLASS : C.fill, sw: 2 });
      if (open) { R(p, -160, 15, 34, 285, 3, F(3)); R(p, 126, 15, 34, 285, 3, F(3)); }
      else { R(p, -160, 15, 160, 285, 3, F(3)); R(p, 0, 15, 160, 285, 3, F(3)); }
      p.path(`M -215 ${oy} A 215 215 0 0 1 215 ${oy} Z`, F(3.4));
      N3.forEach(i => { const [a1, b1] = pt(A[i], 178), [a2, b2] = pt(A[i], 202); p.line(a1, b1, a2, b2, W(4.5)); });
      const aN = A[Math.min(S0.now, 2)], [hx, hy] = pt(aN, 86), [lx, ly] = pt(aN + 90, 7), [rx2, ry2] = pt(aN - 90, 7);
      shape(p, [[lx, ly], [hx, hy], [rx2, ry2]], SOLID(1.6)); p.circle(0, oy, 16, SOLID());
      N3.forEach(i => { const [x, y] = pt(A[i], 128), [lx2, ly2] = pt(A[i], 245);
        item(p, c, S0, i, x, y, 72, null); itLab(p, S0, i, i === 1 ? 0 : lx2 + (i === 0 ? 10 : -10), i === 1 ? ly2 - 20 : ly2, { anchor: i === 0 ? 'end' : i === 2 ? 'start' : 'middle', maxW: 190, size: 30 }); });
      if (S0.R) { if (S0.now === 3) halo(p, 0, 140, 120); item(p, c, S0, 3, 0, 135, 150, 268, { lab: { maxW: 230, size: 32 } }); }
    }); });

  /* 07 ── FLAP BOARD: a split-flap board, one row per moment — the lamp of each row that is passed is on, the arrow rests on `at`;
     the result has its own row under the line */
  variant('flapboard', 'กระดานแผ่นพลิก', (d, c) => { const S0 = st(d), ys = S0.R ? [-180, -82, 16] : [-150, -20, 110], rh = S0.R ? 80 : 96;
    art(c, p => {
      [-300, 300].forEach(x => p.line(x, -330, x, -262, W(2.4)));
      R(p, -420, -262, 840, 524, 18, F(3.6));
      const row = (y, h, i, big) => { const g = dimG(p, S0, i), it = itOf(S0, i), s = ph(S0, i);
        R(g, -232, y - h / 2, 612, h, 10, big ? F(3.2) : F(2.6));
        g.line(-230, y, 378, y, { sw: 3, stroke: C.fill });
        if (it && it.label) txt(g, it.label, -210, y + h * .17, { anchor: 'start', size: h * .46, maxW: 568, weight: 700, color: C.ink });
        if (s === 'now') halo(p, -362, y, 28);
        p.circle(-362, y, 12, reached(S0, i) ? SOLID() : F(2.4));
        if (s === 'now') shape(p, [[-410, y - 12], [-392, y], [-410, y + 12]], SOLID(1.6));
        itPic(c, S0, i, -288, y, h * (big ? .86 : .76), { iconOnly: true }); };
      N3.forEach(i => row(ys[i], rh, i, false));
      if (S0.R) { p.line(-390, 82, 390, 82, S(2)); row(172, 112, 3, true); }
    }); });

  /* 08 ── TRACK SPOT: framed moments hang along a wall; a spotlight runs on the ceiling track and lights the one we stop on (or the result) */
  variant('trackspot', 'ไฟรางส่องกรอบรูป', (d, c) => { const S0 = st(d), X = S0.R ? lay(S0, -330, 340) : lay(S0, -320, 320), fw = 170;
    art(c, p => {
      [-380, 380].forEach(x => p.line(x, -345, x, -300, W(2.4))); R(p, -470, -300, 940, 16, 8, F(2.6));
      X.forEach((x, i) => { const g = dimG(p, S0, i), w = i === 3 ? 210 : fw, top = -20 - w / 2;
        g.circle(x, top - 52, 6, SOLID()); g.line(x, top - 52, x - w * .32, top, S(1.8)); g.line(x, top - 52, x + w * .32, top, S(1.8));
        R(g, x - w / 2, top, w, w, 6, F(i === 3 ? 4.4 : 4)); });
      const xn = X[S0.now];
      p.path(pathOf([[xn - 36, -190], [xn + 36, -190], [xn + 125, 95], [xn - 125, 95]]), { fill: GLASS, sw: 0, stroke: 'none' });
      R(p, xn - 26, -284, 52, 18, 6, F(2.4)); p.line(xn, -266, xn, -240, W(3));
      shape(p, [[xn - 22, -242], [xn + 22, -242], [xn + 36, -190], [xn - 36, -190]], F(3));
      N3.forEach(i => item(p, c, S0, i, X[i], -20, 110, 112, { lab: { maxW: 200, size: 32 } }));
      if (S0.R) item(p, c, S0, 3, X[3], -20, 140, 130, { lab: { maxW: 230, size: 32 } });
    }); });

  /* 09 ── STAMP CARD: a card with a slot per moment — each slot gets its stamp in turn; the stamp hangs over the last one stamped;
     the last slot of the card is the result */
  variant('stampcard', 'บัตรประทับตรา', (d, c) => { const S0 = st(d), X = S0.R ? lay(S0, -290, 300) : lay(S0, -270, 270), cy = -15;
    art(c, p => {
      R(p, -430, -170, 860, 340, 26, F(3.4)); p.circle(-392, -132, 12, W(2));
      X.forEach((x, i) => { const g = dimG(p, S0, i), done = reached(S0, i);
        if (i === 3) { R(g, x - 85, cy - 85, 170, 170, 18, done ? W(5) : S(2)); }
        else if (done) { const e = rot(g, i % 2 ? 7 : -7, x, cy); e.circle(x, cy, 70, W(5)); } else g.circle(x, cy, 70, S(2)); });
      const xn = X[S0.now];
      R(p, xn - 66, -232, 132, 14, 4, F(2.4)); R(p, xn - 74, -270, 148, 40, 8, F(3)); R(p, xn - 14, -306, 28, 38, 4, F(2.6)); p.ellipse(xn, -316, 44, 24, F(3));
      N3.forEach(i => item(p, c, S0, i, X[i], cy, 82, 125, { lab: { maxW: 175, size: 30 } }));
      if (S0.R) item(p, c, S0, 3, X[3], cy, 112, 125, { lab: { maxW: 190, size: 30 } });
    }); });

  /* 10 ── GLASS LIFT: one floor per moment (bottom → top), the glass car rides up and stops on `at`; the result waits on the top floor */
  variant('glasslift', 'ลิฟต์แก้วขึ้นชั้น', (d, c) => { const S0 = st(d), L = S0.R ? [255, 112, -31, -174] : [240, 60, -120];
    art(c, p => {
      R(p, -112, -320, 12, 590, 4, F(2.4)); R(p, 100, -320, 12, 590, 4, F(2.4)); R(p, -140, -345, 280, 26, 6, F(3));
      L.forEach((y, i) => { const g = dimG(p, S0, i); R(g, 112, y, 330, 14, 4, F(2.4)); R(g, -442, y, 330, 14, 4, F(2.4)); });
      const yn = L[S0.now], ch = 118;
      p.line(0, -319, 0, yn - ch - 10, W(2.4));
      R(p, -96, yn - ch - 10, 192, 12, 4, F(2.6)); R(p, -88, yn - ch, 176, ch, 8, { fill: GLASS, sw: 3.2 }); p.line(-80, yn - 50, 80, yn - 50, W(1.8));
      if (S0.now !== 3) halo(p, 277, yn - 58, 82);
      N3.forEach(i => item(p, c, S0, i, 277, L[i] - 58, 98, null)); N3.forEach(i => itLab(p, S0, i, -277, L[i] - 24, { maxW: 300, size: 34 }));
      if (S0.R) { if (S0.now === 3) halo(p, 277, L[3] - 62, 90); item(p, c, S0, 3, 277, L[3] - 62, 112, null); itLab(p, S0, 3, -277, L[3] - 24, { maxW: 300, size: 34 }); }
    }); });

  /* 11 ── LAMP POSTS: a lamp post per moment — the lamps come on one after another as time goes; the one we stop on shines brightest */
  variant('lampposts', 'เสาไฟติดทีละต้น', (d, c) => { const S0 = st(d), gy = 292, X = S0.R ? lay(S0, -360, 330) : lay(S0, -330, 330);
    art(c, p => {
      p.line(-480, gy, 480, gy, S(2));
      X.forEach((x, i) => { const g = dimG(p, S0, i), on2 = reached(S0, i), s = ph(S0, i), big = i === 3, pw = big ? 190 : 160, phh = big ? 210 : 180, pt0 = big ? -125 : -110;
        if (s === 'now') halo(g, x, -182, 92); else if (on2) halo(g, x, -182, 58);
        R(g, x - 8, -160, 16, gy - 10 + 160, 3, F(2.4)); R(g, x - 26, gy - 28, 52, 28, 5, F(2.6));
        shape(g, [[x - 28, -206], [x + 28, -206], [x + 20, -156], [x - 20, -156]], { fill: on2 ? LIT : C.fill, sw: 3 });
        shape(g, [[x - 38, -206], [x + 38, -206], [x + 18, -228], [x - 18, -228]], F(2.8)); g.circle(x, -236, 7, SOLID());
        R(g, x - pw / 2, pt0, pw, phh, 12, F(3)); });
      N3.forEach(i => item(p, c, S0, i, X[i], -40, 90, 50, { lab: { maxW: 140, size: 28, wrap: 'up' } }));
      if (S0.R) item(p, c, S0, 3, X[3], -45, 118, 63, { lab: { maxW: 170, size: 30, wrap: 'up' } });
    }); });

  /* 12 ── ADVENT: a little door per moment — the doors open one by one (the one we stop on is the last opened); the big door is the result */
  variant('advent', 'ปฏิทินช่องเปิด', (d, c) => { const S0 = st(d), ds = S0.R ? 160 : 190, X = S0.R ? [-320, -120, 80] : [-280, 0, 280], dy = S0.R ? -40 : -55;
    art(c, p => {
      R(p, -440, -250, 880, 475, 22, F(3.4));
      const door = (x, y, w, h, i) => { const g = dimG(p, S0, i), s = ph(S0, i), x0 = x - w / 2, y0 = y - h / 2;
        if (reached(S0, i)) { R(g, x0, y0, w, h, 6, { fill: s === 'now' ? GLASS : C.fill, sw: s === 'now' ? 4.2 : 2.4 });
          shape(g, [[x0, y0], [x0 - 34, y0 + 18], [x0 - 34, y0 + h - 18], [x0, y0 + h]], F(3)); g.circle(x0 - 26, y, 5, SOLID()); }
        else { R(g, x0, y0, w, h, 6, F(3.4)); g.circle(x0 + w - 22, y, 8, F(2.4)); } };
      N3.forEach(i => door(X[i], dy, ds, ds, i));
      if (S0.R) door(320, -45, 200, 300, 3);
      N3.forEach(i => { if (reached(S0, i)) itPic(c, S0, i, X[i], dy, ds * .6); itLab(p, S0, i, X[i], dy + ds / 2 + 52, { maxW: ds + 20, size: 30, always: !reached(S0, i) }); });
      if (S0.R) { if (reached(S0, 3)) itPic(c, S0, 3, 320, -45, 135); itLab(p, S0, 3, 320, 160, { maxW: 220, size: 30, always: !reached(S0, 3) }); }
    }); });

  /* 13 ── PIPE: time flows down a pipe past a sight-glass per moment; the flow has reached `at` — or filled the result's tank at the end */
  variant('pipe', 'ท่อไหลผ่านช่องกระจก', (d, c) => { const S0 = st(d), py = 60, X = S0.R ? lay(S0, -260, 330) : lay(S0, -250, 330);
    art(c, p => {
      const xe = S0.R ? X[3] - 90 : 470, xf = S0.now === 3 ? xe : X[S0.now];
      R(p, -480, py - 25, xe + 480, 50, S0.R ? 4 : 25, F(3.2));
      R(p, -470, py - 14, xf + 470, 28, 12, { fill: LIT, sw: 0, stroke: 'none' });
      R(p, -455, py - 42, 60, 84, 10, F(3)); p.line(-425, py - 42, -425, py - 84, W(3)); p.circle(-425, py - 108, 30, F(3));
      p.line(-449, py - 108, -401, py - 108, W(2.2)); p.line(-425, py - 132, -425, py - 84, W(2.2)); p.circle(-425, py - 108, 8, SOLID());
      N3.forEach(i => { const x = X[i]; p.circle(x, py, 54, F(3.4)); p.circle(x, py, 36, { fill: reached(S0, i) ? LIT : C.fill, sw: 2.2 }); if (ph(S0, i) === 'now') halo(p, x, py, 80); });
      if (S0.R) { const x = X[3], g = dimG(p, S0, 3), full = reached(S0, 3), top = -150, bot = 210;
        if (full) halo(p, x, -20, 150);
        R(g, x - 92, top, 184, bot - top, 26, F(3.4));
        if (full) R(g, x - 82, 40, 164, bot - 50, 18, { fill: LIT, sw: 0, stroke: 'none' });
        g.line(x - 60, bot, x - 60, bot + 30, W(3)); g.line(x + 60, bot, x + 60, bot + 30, W(3));
        item(p, c, S0, 3, x, -45, 112, 280); }
      N3.forEach(i => item(p, c, S0, i, X[i], -95, 108, 160, { lab: { maxW: 190, size: 32 } }));
    }); });

  /* 14 ── MILESTONES: a stone post per moment along the road — the road is lit up to where we stopped; the signboard at the end is the result */
  variant('milestones', 'หลักบอกระยะริมทาง', (d, c) => { const S0 = st(d), ry = 262, X = S0.R ? lay(S0, -350, 320) : lay(S0, -330, 330);
    art(c, p => {
      const xn = S0.now === 3 ? X[3] - 120 : X[S0.now];
      p.line(-480, ry, 480, ry, S(2.4)); p.line(-480, ry + 40, 480, ry + 40, S(2)); p.line(-480, ry + 20, xn, ry + 20, W(5));
      N3.forEach(i => { const x = X[i], g = dimG(p, S0, i), w = 140, top = -10;
        g.path(`M ${x - w / 2} ${ry} L ${x - w / 2} ${top + 70} A ${w / 2} ${w / 2} 0 0 1 ${x + w / 2} ${top + 70} L ${x + w / 2} ${ry} Z`, F(3.4));
        g.line(x - w / 2 + 14, 150, x + w / 2 - 14, 150, W(2)); });
      halo(p, xn, ry + 20, 34); p.circle(xn, ry + 20, 14, SOLID());
      N3.forEach(i => item(p, c, S0, i, X[i], 82, 84, 210, { lab: { maxW: 115, size: 27 } }));
      if (S0.R) { const x = X[3], g = dimG(p, S0, 3); if (S0.now === 3) halo(p, x, -40, 150);
        g.line(x - 70, 60, x - 70, ry, W(3.4)); g.line(x + 70, 60, x + 70, ry, W(3.4)); R(g, x - 110, -150, 220, 210, 14, F(3.6));
        item(p, c, S0, 3, x, -45, 130, 140, { lab: { maxW: 130, size: 28 } }); }
    }); });

  /* 15 ── CANDLE: a candle marked at each moment burns down — it is burnt to the mark we stop on (the burnt part is a faint outline);
     the result shows beside it */
  variant('candle', 'เทียนบอกเวลา', (d, c) => { const S0 = st(d), cx = S0.R ? -20 : 90, ys = [-110, 15, 140], top0 = -200, base = 262;
    art(c, p => {
      const yt = ys[Math.min(S0.now, 2)];
      R(p, cx - 60, top0, 120, yt - top0, 10, S(1.6));
      R(p, cx - 60, yt, 120, base - yt, 10, F(3.4));
      p.path(`M ${cx - 60} ${yt + 10} Q ${cx - 30} ${yt + 26} ${cx - 16} ${yt + 6}`, W(2));
      p.line(cx, yt, cx, yt - 22, W(3));
      halo(p, cx, yt - 62, 70);
      p.path(`M ${cx} ${yt - 112} C ${cx + 34} ${yt - 72}, ${cx + 30} ${yt - 30}, ${cx} ${yt - 26} C ${cx - 30} ${yt - 30}, ${cx - 34} ${yt - 72}, ${cx} ${yt - 112} Z`, { fill: LIT, sw: 3 });
      p.path(`M ${cx} ${yt - 76} C ${cx + 12} ${yt - 58}, ${cx + 10} ${yt - 40}, ${cx} ${yt - 38} C ${cx - 10} ${yt - 40}, ${cx - 12} ${yt - 58}, ${cx} ${yt - 76} Z`, SOLID(1.6));
      p.ellipse(cx, base + 10, 150, 22, F(3.2)); R(p, cx - 80, base - 4, 160, 14, 4, F(2.4));
      N3.forEach(i => { const y = ys[i], g = dimG(p, S0, i), live = y >= yt; g.line(cx - 110, y, cx - (live ? 60 : 64), y, S(2)); if (live) p.line(cx - 60, y, cx + 60, y, W(2.6)); });
      N3.forEach(i => { item(p, c, S0, i, cx - 330, ys[i], 88, null); itLab(p, S0, i, cx - 122, ys[i] + 12, { anchor: 'end', maxW: 150, size: 32 }); });
      if (S0.R) { const x = 320; if (S0.now === 3) halo(p, x, 60, 130); dimG(p, S0, 3).circle(x, 60, 105, F(3.4)); item(p, c, S0, 3, x, 60, 130, 215); }
    }); });

  /* 16 ── TRAM: a tram runs under its wire past a stop per moment and halts with its nose at `at`; the terminal at the end holds the result */
  variant('tram', 'รถรางผ่านป้าย', (d, c) => { const S0 = st(d), ty = 150, X = S0.R ? [-170, 10, 190, 370] : [-140, 100, 340];
    art(c, p => {
      p.line(-480, -262, 480, -262, W(2)); p.line(-480, ty + 18, 480, ty + 18, W(3));
      for (let x = -470; x < 480; x += 62) R(p, x, ty + 22, 36, 8, 2, S(1.4));
      N3.forEach(i => { const x = X[i], g = dimG(p, S0, i); R(g, x - 4, -100, 8, ty + 18 + 100, 2, F(2)); g.circle(x, -150, 56, F(3.2)); if (ph(S0, i) === 'now') halo(p, x, -150, 80); });
      if (S0.R) { const x = X[3], g = dimG(p, S0, 3); if (S0.now === 3) halo(p, x, 50, 120);
        shape(g, [[x - 120, -40], [x + 120, -40], [x + 100, -70], [x - 100, -70]], F(3.2)); R(g, x - 104, -40, 12, ty + 58, 3, F(2.4)); R(g, x + 92, -40, 12, ty + 58, 3, F(2.4)); }
      const Lt = 280, xf = S0.now === 3 ? X[3] - 125 : X[S0.now] - 8, x0 = xf - Lt;
      R(p, x0 + 96, -6, 92, 14, 5, F(2.6));                                                                                   // pantograph
      p.poly([[x0 + 112, -6], [x0 + 150, -120], [x0 + 124, -258]], W(3)); p.line(x0 + 96, -260, x0 + 156, -260, W(3.4));
      [x0 + 34, x0 + Lt - 104].forEach(x => { R(p, x, 118, 70, 22, 6, F(2.6)); [x + 16, x + 54].forEach(w => { p.circle(w, ty + 2, 12, F(2.6)); p.circle(w, ty + 2, 4, SOLID()); }); });
      R(p, x0, 8, Lt, 120, 30, F(3.6));                                                                                        // body
      R(p, x0 + 14, 26, 40, 56, 10, W(2)); R(p, x0 + Lt - 54, 26, 40, 56, 10, W(2));                                           // cab windows (both ends)
      [x0 + 76, x0 + 182].forEach(x => R(p, x, 30, 46, 40, 7, W(2)));                                                          // side windows
      R(p, x0 + 128, 26, 44, 96, 6, W(2)); p.line(x0 + 150, 26, x0 + 150, 122, W(1.6));                                         // double door
      p.line(x0 + 8, 96, x0 + 122, 96, W(1.6)); p.line(x0 + 178, 96, x0 + Lt - 8, 96, W(1.6)); p.circle(x0 + Lt - 18, 108, 6, SOLID());
      N3.forEach(i => item(p, c, S0, i, X[i], -150, 72, -50, { lab: { maxW: 180, size: 30 } }));
      if (S0.R) item(p, c, S0, 3, X[3], 50, 118, -95, { lab: { maxW: 230, size: 30 } });
    }); });

  /* 17 ── CASCADE: water runs from a spout into a tray per moment, each brim spills into the next one down; it stops at `at`,
     or reaches the result's basin at the bottom */
  variant('cascade', 'น้ำล้นทีละชั้น', (d, c) => { const S0 = st(d), T = S0.R ? [[-300, -150], [-95, -30], [110, 90]] : [[-250, -130], [0, 20], [250, 170]], BW = 200;
    art(c, p => {
      const sx = T[0][0] - 60; R(p, -490, -292, sx - 20 + 490, 26, 6, F(2.8)); p.path(`M ${sx - 22} -292 Q ${sx + 6} -292 ${sx + 6} -262 L ${sx + 6} -246 L ${sx - 20} -246 L ${sx - 20} -266 Z`, F(2.8));
      const stream = (x1, y1, x2, y2) => p.path(`M ${f1(x1)} ${f1(y1)} Q ${f1(x1 + 30)} ${f1(y1 + 6)} ${f1(x2)} ${f1(y2)}`, { sw: 5, stroke: C.ink, fill: 'none' });
      p.line(sx - 7, -246, sx - 7, T[0][1] - 26, { sw: 5, stroke: C.ink });
      T.forEach(([x, y], i) => { const g = dimG(p, S0, i), full = reached(S0, i);
        if (full) shape(g, [[x - BW / 2 + 8, y - 16], [x + BW / 2 - 8, y - 16], [x + BW / 2 - 26, y + 18], [x - BW / 2 + 26, y + 18]], { fill: LIT, sw: 0, stroke: 'none' });
        shape(g, [[x - BW / 2, y - 26], [x + BW / 2, y - 26], [x + BW / 2 - 24, y + 26], [x - BW / 2 + 24, y + 26]], { fill: 'none', sw: 3.4 });
        g.line(x - BW / 2 - 8, y - 26, x + BW / 2 + 8, y - 26, W(3.4));
        if (ph(S0, i) === 'now') halo(p, x, y - 70, 95);
        const nx = i < 2 ? T[i + 1] : S0.R ? [330, 230] : null;
        if (nx && reached(S0, i + 1)) stream(x + BW / 2 + 6, y - 26, nx[0] - (i < 2 ? BW / 2 - 30 : 70), nx[1] - (i < 2 ? 22 : 30)); });
      if (S0.R) { const x = 330, y = 255, g = dimG(p, S0, 3), full = reached(S0, 3); if (full) halo(p, x, 150, 120);
        if (full) shape(g, [[x - 112, y - 30], [x + 112, y - 30], [x + 84, y + 26], [x - 84, y + 26]], { fill: LIT, sw: 0, stroke: 'none' });
        g.path(`M ${x - 130} ${y - 40} L ${x + 130} ${y - 40} Q ${x + 115} ${y + 40} ${x} ${y + 40} Q ${x - 115} ${y + 40} ${x - 130} ${y - 40} Z`, { fill: 'none', sw: 3.6 });
        item(p, c, S0, 3, x, 135, 112, null); itLab(p, S0, 3, x + 150, 110, { anchor: 'start', maxW: 0 + 160, size: 30 }); }
      T.forEach(([x, y], i) => { item(p, c, S0, i, x, y - 82, 92, null); itLab(p, S0, i, x, y + 66, { maxW: 190, size: 30 }); });
    }); });

  /* 18 ── CRANE: a gantry crane carries the result along its beam over a bay per moment; it hangs over `at`, or sets the result down at the end */
  variant('crane', 'เครนขนตามราง', (d, c) => { const S0 = st(d), fy = 290, X = S0.R ? lay(S0, -330, 330) : lay(S0, -300, 300);
    art(c, p => {
      p.line(-480, fy, 480, fy, S(2));
      R(p, -470, -262, 22, fy + 262, 4, F(2.6)); R(p, 448, -262, 22, fy + 262, 4, F(2.6)); R(p, -480, -298, 960, 36, 6, F(3.4));
      X.forEach((x, i) => { const g = dimG(p, S0, i), w = i === 3 ? 210 : 170; R(g, x - w / 2, fy - 22, w, 22, 4, F(2.8)); });
      const xn = X[S0.now], down = S0.now === 3, by = down ? fy - 22 : 40, hy = by - 140 - 60;
      R(p, xn - 46, -262, 92, 30, 6, F(3)); [-24, 24].forEach(dx => p.circle(xn + dx, -264, 9, F(2.4)));
      p.line(xn - 12, -232, xn - 12, hy, W(2.4)); p.line(xn + 12, -232, xn + 12, hy, W(2.4));
      R(p, xn - 26, hy, 52, 36, 8, F(3)); p.path(`M ${xn} ${hy + 36} L ${xn} ${hy + 50} Q ${xn + 16} ${hy + 50} ${xn + 16} ${hy + 64}`, W(3.4));
      if (S0.R) { const top = by - 140, g = dimG(p, S0, 3); p.line(xn, hy + 56, xn - 80, top, S(2)); p.line(xn, hy + 56, xn + 80, top, S(2));
        if (down) halo(p, xn, top + 70, 120); R(g, xn - 85, top, 170, 140, 12, F(3.4)); item(p, c, S0, 3, xn, top + 70, 100, null); }
      N3.forEach(i => { item(p, c, S0, i, X[i], fy - 85, 100, null); itLab(p, S0, i, X[i], fy + 45, { maxW: 200, size: 32 }); });
      if (S0.R) itLab(p, S0, 3, X[3], fy + 45, { maxW: 220, size: 32 });
    }); });

  /* 19 ── BLOCKS: a block per moment set down in a row — the blocks not reached yet are only outlines; the big block at the end is the result */
  variant('blocks', 'บล็อกเรียงต่อกัน', (d, c) => { const S0 = st(d), fy = 205, X = S0.R ? lay(S0, -350, 300) : lay(S0, -320, 300);
    art(c, p => {
      p.line(-480, fy, 480, fy, S(2));
      X.forEach((x, i) => { const g = dimG(p, S0, i), big = i === 3, w = big ? 210 : 160, h = big ? 200 : 150, dp = 30, x0 = x - w / 2, y0 = fy - h, set = reached(S0, i), o = set ? F(3.2) : S(1.8);
        if (ph(S0, i) === 'now') halo(p, x, y0 + h / 2, w * .78);
        shape(g, [[x0, y0], [x0 + dp, y0 - dp], [x0 + w + dp, y0 - dp], [x0 + w, y0]], set ? F(2.6) : S(1.6));
        shape(g, [[x0 + w, y0], [x0 + w + dp, y0 - dp], [x0 + w + dp, fy - dp], [x0 + w, fy]], set ? F(2.6) : S(1.6));
        R(g, x0, y0, w, h, 6, o); });
      N3.forEach(i => item(p, c, S0, i, X[i], fy - 75, 92, fy + 50, { lab: { maxW: 190, size: 32 } }));
      if (S0.R) item(p, c, S0, 3, X[3], fy - 100, 125, fy + 50, { lab: { maxW: 230, size: 32 } });
    }); });

  /* 20 ── TALLY: a chalkboard — a group of five strokes is chalked up for each moment that has passed, the group we stop on is circled;
     the result is boxed at the end */
  variant('tally', 'กระดานนับขีด', (d, c) => { const S0 = st(d), X = S0.R ? lay(S0, -300, 300) : lay(S0, -280, 280), gy = 30;
    art(c, p => {
      R(p, -440, -250, 880, 460, 16, F(3.6)); R(p, -400, 210, 800, 18, 4, F(2.6)); R(p, 250, 196, 70, 14, 4, F(2));
      N3.forEach(i => { const x = X[i], s = ph(S0, i); if (!reached(S0, i)) return;
        [-45, -15, 15, 45].forEach((dx, k) => p.line(x + dx, gy - 58 + (k % 2) * 4, x + dx + (k % 2 ? 2 : -2), gy + 58, W(5)));
        p.line(x - 70, gy + 44, x + 70, gy - 40, W(5));
        if (s === 'now') { const e = rot(p, -6, x, gy); e.ellipse(x, gy, 96, 84, W(3.6)); } });
      if (S0.R) { const x = X[3], g = dimG(p, S0, 3); if (reached(S0, 3)) { halo(p, x, gy - 20, 120); const e = rot(g, 3, x, gy - 20); e.rect(x - 95, gy - 115, 190, 190, { rx: 8, sw: 3.6 }); }
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
