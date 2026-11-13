/* b02.js — category B02 "เพิ่ม / ลด" (the amount of something changes: grows, shrinks, arrives, leaves): 20 neutral designs.
   Stills approved by the user (2026-11-13). Motion follows CutPack's rule (CATEGORIES.md §9) + pro motion
   (anticipation, overshoot + settle, squash on landing, the scene reacts to every arrival / departure):
     enter (0 → .35 s) → work: the copies come in / go out ONE BY ONE → the LAST one lands / leaves on the keyword (c.hit) → hold → exit.
   Slots (same as CutPack B02):
     dir 'up' | 'down' · item { icon, label? } drawn n = 2–4 times · center { icon, label? } the owner (optional) ·
     keep 0–3 = how many are left after a decrease (0 only when the speaker says "all gone") · end = icon name for the end symbol (optional).
   GL.cats.B02.draw(i, data, { x, y, s, at, hit })  — canvas 1000 × 700 centred at (0,0); hit = seconds after `at` (default 1.8:
   a few copies need time to arrive one by one). The last frame equals the approved still. */
(function () {
  const G = window.GL, C = G.C;
  const W = (w = 2) => ({ sw: w }), F = (w = 3.2) => ({ fill: C.fill, sw: w });
  const rad = d => d * Math.PI / 180, f1 = v => +v.toFixed(1);
  const N = d => Math.max(2, Math.min(4, d.n || 3));
  const K = d => d.dir === 'down' ? Math.max(0, Math.min(N(d) - 1, d.keep ?? 1)) : N(d);
  const gone = (d, i) => d.dir === 'down' && i >= K(d);           // this copy leaves (ends as a faint ghost)
  const hitOf = c => c.hit ?? 1.8;

  /* ---------- motion plumbing (same as b01.js) ---------- */
  const sub = (p, a) => { const q = p.child(a || {}); q.H = p.H; q.motion = p.motion; return q; };
  const on = (q, p, t, spec) => G.kf(q.g || q, p.t0 + t * p.ts, spec);
  const appear = (q, p, t, dx = 0, dy = 16) => on(q, p, t, { o: [[0, 0], [.16, 1]], x: [[0, dx], [.28, 0, 'out']], y: [[0, dy], [.28, 0, 'out']] });
  const pop = (q, p, t, ox = 0, oy = 0, from = .5) => on(q, p, t, { ox, oy, s: [[0, from], [.24, 1.06, 'out'], [.38, 1, 'soft']], o: [[0, 0], [.1, 1]] });
  const drawIn = (el, p, t, dur = .4) => on(el, p, t, { draw: [[0, 0], [dur, 1, 'out']] });
  /* every design's own drawing is a rig: parts get their own keyframes; it leaves with a pop */
  const art = (c, fn) => { const f = p => { p.H = hitOf(c); fn(p); }; f.custom = true; f.dur = .35; f.exit = 'pop'; return G.art(f, { x: c.x, y: c.y, s: c.s, at: c.at || 0 }); };

  /* when each copy moves: up → copies arrive in order 0…n-1; down → the leaving copies go from the highest index down; the last move ends at `end` (default the keyword) */
  function plan(d, end) {
    const n = N(d), k = K(d), ord = d.dir === 'up' ? [...Array(n).keys()] : [...Array(n).keys()].filter(i => i >= k).reverse();
    const dur = .42, m = ord.length, gap = m > 1 ? Math.min(.38, (end - .4 - dur) / (m - 1)) : 0, T = {};
    ord.forEach((i, j) => { const e = end - (m - 1 - j) * gap; T[i] = { t0: e - dur, dur, end: e }; });
    return T;
  }
  /* travel keyframes of copy i in canvas units, relative to where it ends up; keys null = it does not move
     o.from: where an arriving copy comes from (up) · o.to: where a leaving copy goes (down) · o.start: where a leaving copy starts (default its spot)
     o.arc: hop height · o.ride { t, dy, dur }: arrived / kept copies ride dy → 0 at time t (a lift) · o.end: the last move ends here instead of the keyword */
  function travel(d, i, x, y, c, o = {}) {
    const H = hitOf(c), T = plan(d, o.end ?? H)[i], up = d.dir === 'up', R = o.ride;
    const fin = up || !gone(d, i) ? [x, y] : (o.to || [x + 50, y - 130]);
    const keys = {}; let t0 = 0;
    if (up) { const [fx, fy] = o.from || [x, y - 170], dx = fx - x, rd = R ? R.dy : 0, dy = fy - y; t0 = T.t0;
      keys.x = [[0, dx], [T.dur, 0, 'back']];
      keys.y = o.arc ? [[0, dy], [T.dur * .45, Math.min(dy, rd) - o.arc, 'out'], [T.dur, rd, 'in']] : [[0, dy], [T.dur, rd, 'back']];
      keys.o = [[0, 0], [.08, 1]]; if (o.dim != null) keys.o.push([o.dim - t0, 1], [o.dim - t0 + .25, .2]); }
    else if (gone(d, i)) { const [sx, sy] = o.start || [x, y], dx = sx - fin[0], dy = sy - fin[1]; t0 = T.t0;
      keys.x = [[0, dx], [.12, dx * 1.08, 'out'], [T.dur, 0, 'in']];
      keys.y = o.arc ? [[0, dy], [.12, dy + 8, 'out'], [T.dur * .5, Math.min(dy, 0) - o.arc, 'out'], [T.dur, 0, 'in']] : [[0, dy], [.12, dy + (dy < 0 ? 10 : -10), 'out'], [T.dur, 0, 'in']];
      keys.o = [[0, 1], [.14, 1], [T.dur, .2]];
      return { fin, T, keys, t0 }; }
    else if (R) { keys.y = [[0, R.dy]]; t0 = 0; }
    else return { fin, T, keys: null, t0: 0 };
    if (R) { const tr = R.t - t0; keys.y.push([tr, R.dy], [tr + (R.dur || .45), 0, 'io']); }
    return { fin, T, keys, t0 };
  }
  const scaleKeys = (keys, s) => { const o = {}; for (const k in keys) o[k] = k === 'o' ? keys[k] : keys[k].map(([t, v, e]) => [t, v * s, e]); return o; };
  /* place copy i (an icon) — x, y = its spot in the still (arriving copies end there; leaving copies start there) */
  function item(d, i, x, y, w, c, o = {}) {
    const fn = G.icons[d.item.icon] || G.icons[d.item.icon + '-pro'];
    if (!fn) { console.warn('B02: no icon', d.item.icon); return null; }
    const tv = travel(d, i, x, y, c, o), at0 = c.at || 0, [fx, fy] = tv.fin, up = d.dir === 'up';
    const a = G.art(fn, { x: c.x + fx * c.s, y: c.y + fy * c.s, w: w * c.s, at: at0 + (up ? Math.max(0, tv.t0 - .05) : .06 + i * .05) });
    if (tv.keys) G.kf(a.wrap, at0 + tv.t0, scaleKeys(tv.keys, c.s));
    const bx = c.x + fx * c.s, by = c.y + (fy + w * .42) * c.s;               // landing squash / kept copies react on the keyword
    if (up) G.kf(a.g, at0 + tv.T.end, { ox: bx, oy: by, sy: [[0, 1], [.06, .86, 'out'], [.18, 1.05], [.32, 1, 'soft']], sx: [[0, 1], [.06, 1.08, 'out'], [.18, .97], [.32, 1, 'soft']] });
    else if (!gone(d, i)) G.kf(a.g, at0 + hitOf(c) + .04, { ox: bx, oy: by, sy: [[0, 1], [.08, .92, 'out'], [.3, 1, 'soft']] });
    return { a, tv };
  }
  /* something drawn in the design (bead, bubble ring…) that travels with copy i */
  function follow(q, p, d, i, x, y, c, o = {}) { const tv = travel(d, i, x, y, c, o); if (tv.keys) on(q, p, tv.t0, tv.keys); return tv; }
  function icon(name, cx, cy, wd, c, delay = .05) {
    if (!name) return null;
    const fn = G.icons[name] || G.icons[name + '-pro'];
    if (!fn) { console.warn('B02: no icon', name); return null; }
    return G.art(fn, { x: c.x + cx * c.s, y: c.y + cy * c.s, w: wd * c.s, at: (c.at || 0) + delay });
  }
  const center = (d, x, y, w, c) => d.center && w > 0 && icon(d.center.icon, x, y, w, c, .05);

  function txt(p, str, x, y, { size = 44, maxW = 1e9, weight = 600, anchor = 'middle', color = C.soft } = {}) {
    const e = p.text(String(str), x, y, { size, weight, anchor, color, dur: .01 });
    const w = e.getBBox().width; if (w > maxW) e.setAttribute('font-size', f1(size * maxW / w));
    return e;
  }
  function arrowLine(p, x1, y1, x2, y2, w = 4.5, o = {}) {
    const a = Math.atan2(y2 - y1, x2 - x1), h = 18;
    p.line(x1, y1, x2, y2, Object.assign(W(w), o)); p.poly([[x2 - h * Math.cos(a - .5), y2 - h * Math.sin(a - .5)], [x2, y2], [x2 - h * Math.cos(a + .5), y2 - h * Math.sin(a + .5)]], Object.assign(W(w), o));
  }
  /* the direction arrow: slides in along its own direction while the copies move */
  function arrow(p, x1, y1, x2, y2, w = 4.5) { const g = sub(p); arrowLine(g, x1, y1, x2, y2, w); const l = Math.hypot(x2 - x1, y2 - y1);
    on(g, p, .3, { o: [[0, 0], [.2, 1]], x: [[0, -(x2 - x1) / l * 40], [.45, 0, 'out']], y: [[0, -(y2 - y1) / l * 40], [.45, 0, 'out']] }); return g; }
  function chev(p, x, y, dir, s = 14) { const k = dir === 'right' ? 1 : -1; p.poly([[x - k * s * .5, y - s], [x + k * s * .5, y], [x - k * s * .5, y + s]], W(3)); }
  function dirBadge(p, dir, x, y, r = 34) {
    const w = sub(p), q = sub(w, { transform: `translate(${f1(x)} ${f1(y)})` }), s = dir === 'up' ? -1 : 1;
    q.circle(0, 0, r, F(3)); q.line(0, -s * r * .5, 0, s * r * .5, W(4.4)); q.poly([[-r * .32, s * r * .18], [0, s * r * .52], [r * .32, s * r * .18]], W(4.4));
    pop(w, p, .2, x, y, .3); return w;
  }
  /* end symbol: a round plate with ✕ / ✓ (or an icon) — pops right after the keyword */
  function endSym(p, d, x, y, c, r = 46) {
    if (!d.end) return; const g = sub(p); pop(g, p, p.H + .12, x, y, .2); g.circle(x, y, r, F(3));
    const k = r * .42;
    if (d.end === 'x') { g.line(x - k, y - k, x + k, y + k, W(5)); g.line(x + k, y - k, x - k, y + k, W(5)); }
    else if (/check/.test(d.end)) g.poly([[x - k, y + 2], [x - k * .2, y + k * .8], [x + k * 1.05, y - k * .75]], W(5));
    else icon(d.end, x, y, r * 1.6, c, p.H + .14);
  }
  const labels = (p, d, ix, iy, cx, cy, o = {}) => { const g = sub(p); appear(g, p, .3, 0, 10);
    if (d.item.label) txt(g, d.item.label, ix, iy, o); if (d.center && d.center.label && cx != null) txt(g, d.center.label, cx, cy, { maxW: 240 }); };
  /* keys for a part that reacts each time a copy lands / leaves: value v0 normally, a quick kick to v1 at every event */
  function reactKeys(d, c, v0, v1, end) { const T = plan(d, end ?? hitOf(c)), ts = Object.values(T).map(t => t.end).sort((a, b) => a - b), k = [[0, v0]];
    ts.forEach(t => k.push([t, v0], [t + .06, v1, 'out'], [t + .24, v0, 'soft'])); return k; }
  let clipN = 0;
  const clipRect = (p, x, y, w, h) => { const NS = 'http://www.w3.org/2000/svg', id = 'b02c' + (++clipN), cp = document.createElementNS(NS, 'clipPath'), r = document.createElementNS(NS, 'rect');
    [['x', x], ['y', y], ['width', w], ['height', h]].forEach(([k, v]) => r.setAttribute(k, v)); cp.setAttribute('id', id); cp.appendChild(r); p.g.appendChild(cp); return sub(p, { 'clip-path': `url(#${id})` }); };

  const V = [];
  const variant = (id, th, build) => V.push({ id, th, build });

  /* 01 ── ROW: copies hop in from the right one by one and line up (or hop away and fade) */
  variant('row', 'แถวเรียง', (d, c) => {
    const n = N(d), hc = !!d.center, x0 = hc ? -160 : -330, x1 = 250, st = (x1 - x0) / (n - 1), y = -30, w = Math.min(150, st * .85);
    art(c, p => {
      drawIn(p.line(x0 - 90, 75, x1 + 90, 75, { sw: 2, stroke: C.soft }), p, 0, .35);
      if (d.dir === 'up') arrow(p, 470, y, x1 + 95, y); else arrow(p, x1 + 95, y, 470, y);
      labels(p, d, (x0 + x1) / 2, 160, -390, 160, { maxW: 600 });
      endSym(p, d, 420, -190, c);
    });
    for (let i = 0; i < n; i++) item(d, i, x0 + i * st, y, w, c, { from: [560, y], to: [x0 + i * st + 60, y - 140], arc: 40 });
    center(d, -390, -30, 180, c);
  });

  /* 02 ── STACK: copies drop onto the column and squash (or lift off the top and drift away) — the base dips with each */
  variant('stack', 'กองซ้อน', (d, c) => {
    const n = N(d), cx = d.center ? 120 : 0;
    art(c, p => {
      const b = sub(p); pop(b, p, 0, cx, 290); const bd = sub(b); on(bd, p, 0, { ox: cx, oy: 298, sy: reactKeys(d, c, 1, .75) });
      bd.rect(cx - 130, 280, 260, 18, Object.assign({ rx: 6 }, F(2.6)));
      labels(p, d, d.center ? cx + 270 : cx - 250, 300, -300, 300, { maxW: 200 });
      endSym(p, d, cx - 200, -200, c);
    });
    for (let i = 0; i < n; i++) item(d, i, cx, 212 - i * 118, 120, c, { from: [cx, -420], to: [cx + 130, 212 - i * 118 - 120] });
    center(d, -300, 120, 190, c);
  });

  /* 03 ── JAR: copies drop through the mouth and settle (or float up out of it); the jar rocks a little with each */
  variant('jar', 'โหลแก้ว', (d, c) => {
    const n = N(d), P = [[-85, 190], [85, 190], [-85, 55], [85, 55]];
    art(c, p => {
      const J = sub(p); pop(J, p, 0, 0, 275, .6); const Jr = sub(J);
      on(Jr, p, 0, { ox: 0, oy: 275, r: reactKeys(d, c, 0, 2.5) });
      Jr.path('M -120 -150 L -120 -205 L 120 -205 L 120 -150 Q 190 -140 190 -70 L 190 220 Q 190 275 135 275 L -135 275 Q -190 275 -190 220 L -190 -70 Q -190 -140 -120 -150 Z', F(3.4));
      Jr.rect(-140, -235, 280, 32, Object.assign({ rx: 10 }, F(3))); Jr.line(-160, -60, -160, 200, W(1.8));
      labels(p, d, 0, 325, 330, 180);
      endSym(p, d, -300, -230, c);
    });
    for (let i = 0; i < n; i++) item(d, i, P[i][0], P[i][1], 128, c, { from: [0, -360], to: [160 + (i - K(d)) * 80, -300] });
    center(d, 330, 30, 160, c);
  });

  /* 04 ── FLOW: copies fly in from outside towards the owner and the hub pulses at each (or they fly out of it) */
  variant('flow', 'ไหลเข้าศูนย์กลาง', (d, c) => {
    const n = N(d), A = [...Array(n)].map((_, i) => -90 + 45 + i * 360 / n), up = d.dir === 'up';
    art(c, p => {
      const hb = sub(p); pop(hb, p, 0, 0, 10); const hp = sub(hb); on(hp, p, 0, { ox: 0, oy: 10, s: reactKeys(d, c, 1, 1.1) });
      hp.circle(0, 10, 118, F(3.4));
      A.forEach((a, i) => { const ca = Math.cos(rad(a)), sa = Math.sin(rad(a)), rIn = 150, rOut = 225;
        if (up) arrow(p, f1(rOut * 1.25 * ca), f1(10 + rOut * .85 * sa), f1(rIn * ca), f1(10 + rIn * .9 * sa), 4);
        else if (gone(d, i)) arrow(p, f1(rIn * ca), f1(10 + rIn * .9 * sa), f1(rOut * 1.25 * ca), f1(10 + rOut * .85 * sa), 4); });
      if (!d.center) dirBadge(hp, d.dir, 0, 10, 54);
      labels(p, d, 0, 335, 0, 170, { maxW: 600 });
      endSym(p, d, 380, -250, c);
    });
    A.forEach((a, i) => { const ca = Math.cos(rad(a)), sa = Math.sin(rad(a));
      const [x, y] = up ? [380 * ca, 10 + 240 * sa] : [300 * ca, 10 + 200 * sa];
      item(d, i, x, y, 120, c, { from: [560 * ca, 10 + 360 * sa], to: [380 * ca, 10 + 240 * sa] }); });
    center(d, 0, 0, 150, c);
  });

  /* 05 ── CONVEYOR: the belt runs (its chevrons scroll), carrying copies to the bin / owner (or away from it) */
  variant('conveyor', 'สายพาน', (d, c) => {
    const n = N(d), up = d.dir === 'up', slot = i => 160 - i * 150, H = hitOf(c);
    art(c, p => {
      const B = sub(p); appear(B, p, 0, -40, 0);
      B.rect(-470, 140, 720, 50, Object.assign({ rx: 25 }, F(3.2)));
      [-445, 225].forEach(x => B.circle(x, 165, 15, W(2.2)));
      const cl = clipRect(B, -425, 145, 630, 40), ch = sub(cl);
      for (let x = -395 - 280; x < 480; x += 70) chev(ch, x, 165, up ? 'right' : 'left', 11);
      on(ch, p, .35, { x: [[0, 0], [H - .35, (up ? 1 : -1) * 280, 'io']] });
      if (!d.center) { const bin = sub(p); pop(bin, p, .05, 375, 230); bin.rect(290, 30, 170, 200, Object.assign({ rx: 10 }, F(3.2))); bin.line(290, 80, 460, 80, W(2)); }
      labels(p, d, -110, 270, 375, 300);
      endSym(p, d, 375, -150, c);
    });
    for (let i = 0; i < n; i++) item(d, i, slot(up ? n - 1 - i : i), 66, 120, c, { from: [-600, 66], to: [slot(i) - 260, 66] });
    if (d.center) center(d, 375, 110, 180, c);
  });

  /* 06 ── STAIRS: each copy hops up onto its step (or hops down off it and fades) */
  variant('stairs', 'บันได', (d, c) => {
    const n = N(d), up = d.dir === 'up', sw = 190, rise = 95, x0 = -420;
    const top = i => up ? 290 - (i + 1) * rise : 290 - (n - i) * rise, X = i => x0 + i * sw + sw / 2;
    art(c, p => {
      const S = sub(p); on(S, p, 0, { ox: x0, oy: 290, sy: [[0, 0], [.32, 1.04, 'out'], [.45, 1, 'soft']], o: [[0, 0], [.05, 1]] });
      const pts = [[x0, 290]]; for (let i = 0; i < n; i++) { pts.push([x0 + i * sw, top(i)], [x0 + (i + 1) * sw, top(i)]); } pts.push([x0 + n * sw, 290]);
      S.shape(pts, F(3.2));
      labels(p, d, 300, 335, 400, -110);
      endSym(p, d, up ? -380 : 380, -250, c);
    });
    for (let i = 0; i < n; i++) item(d, i, X(i), top(i) - 62, 115, c, { from: i ? [X(i - 1), top(i - 1) - 62] : [x0 - 80, 228], to: [X(i) + 110, top(i) + 10], arc: 70 });
    center(d, 400, -220, 120, c);
  });

  /* 07 ── LIFT: copies are loaded onto the low platform one by one, then on the keyword the scissor lift raises them (or the leavers go, then it lowers) */
  variant('lift', 'ลิฟต์ยก', (d, c) => {
    const n = N(d), up = d.dir === 'up', py = up ? -20 : 150, gy = up ? 150 : -20, xs = [...Array(n)].map((_, i) => -165 + i * 330 / (n - 1)), H = hitOf(c);
    const ride = { t: H - .45, dy: gy - py, dur: .45 }, end = H - .5;
    art(c, p => {
      const gh = sub(p); gh.rect(-240, gy, 480, 26, { rx: 6, sw: 2, stroke: C.rule }); on(gh, p, ride.t, { o: [[0, 0], [.3, 1]] });
      const base = sub(p); pop(base, p, 0, 0, 293); base.rect(-210, 280, 420, 26, Object.assign({ rx: 6 }, F(3)));
      const k = (280 - (gy + 26)) / (280 - (py + 26)), sc = sub(p);
      on(sc, p, 0, { ox: 0, oy: 280, sy: [[0, .2], [.3, k, 'out'], [ride.t, k], [ride.t + .45, 1, 'io']], o: [[0, 0], [.05, 1]] });
      sc.line(-170, 280, 170, py + 26, W(3)); sc.line(170, 280, -170, py + 26, W(3)); sc.circle(0, (280 + py + 26) / 2, 8, F(2));
      const pl = sub(p); on(pl, p, 0, { y: [[0, gy - py], [ride.t, gy - py], [ride.t + .45, 0, 'io']], o: [[0, 0], [.2, 1]] });
      pl.rect(-240, py, 480, 26, Object.assign({ rx: 6 }, F(3.2)));
      labels(p, d, 360, 300, -390, 120, { maxW: 220 });
      endSym(p, d, 390, -250, c);
    });
    xs.forEach((x, i) => item(d, i, x, py - 62, 115, c, { from: [x, gy - 300], ride, end, start: [x, gy - 62], to: [x + 40, gy - 190] }));
    center(d, -390, 10, 150, c);
  });

  /* 08 ── SCALE: copies drop onto the pan — the pan dips and the needle steps up with each (or they lift off and it steps down) */
  variant('scale', 'ตาชั่งหน้าปัด', (d, c) => {
    const n = N(d), up = d.dir === 'up', xs = [...Array(n)].map((_, i) => -165 + i * 330 / (n - 1)), aEnd = up ? -40 : -150, aStart = up ? -150 : -40;
    art(c, p => {
      const S = sub(p); pop(S, p, 0, 0, 300, .6);
      S.path('M -200 140 L 200 140 L 240 300 L -240 300 Z', F(3.4));
      S.circle(0, 222, 64, F(2.8)); S.path('M -48 222 A 48 48 0 0 1 48 222', W(1.8));
      const nd = sub(S); nd.line(0, 222, f1(48 * Math.cos(rad(aEnd))), f1(222 + 48 * Math.sin(rad(aEnd))), { sw: 5 });
      const T = plan(d, hitOf(c)), ev = Object.values(T).map(t => t.end).sort((a, b) => a - b), m = ev.length, r = [[0, aStart - aEnd]];
      ev.forEach((t, j) => { const a = (aEnd - aStart) * (j + 1) / m + aStart - aEnd, prev = r[r.length - 1][1]; r.push([t, prev], [t + .12, a + (a - prev) * .25, 'out'], [t + .3, a, 'soft']); });
      on(nd, p, 0, { ox: 0, oy: 222, r });
      const pan = sub(S); on(pan, p, 0, { y: reactKeys(d, c, 0, 10) });
      pan.rect(-30, 110, 60, 30, F(2.6)); pan.path('M -270 92 Q 0 128 270 92 L 250 110 Q 0 140 -250 110 Z', F(3));
      labels(p, d, -360, 300, 390, 120, { maxW: 220 });
      endSym(p, d, -390, -250, c);
    });
    xs.forEach((x, i) => item(d, i, x, 30, 115, c, { from: [x, -380], to: [x + 40, -150] }));
    center(d, 390, -10, 140, c);
  });

  /* 09 ── MAGNET: copies are pulled in from the right and snap onto the magnet — it jolts at every snap (or they break free and drift off) */
  variant('magnet', 'แม่เหล็ก', (d, c) => {
    const n = N(d), up = d.dir === 'up', P = [[30, -170], [30, 170], [190, -90], [190, 90]];
    art(c, p => {
      const M = sub(p); on(M, p, 0, { x: [[0, -140], [.35, 0, 'out']], o: [[0, 0], [.12, 1]] }); const Mj = sub(M);
      on(Mj, p, 0, { x: reactKeys(d, c, 0, 12) });
      const U = 'M -110 -170 L -260 -170 A 170 170 0 0 0 -260 170 L -110 170';
      Mj.path(U, { sw: 84 }); Mj.path(U, { sw: 76, stroke: C.fill });
      [-1, 1].forEach(s => Mj.line(-150, s * 132, -150, s * 208, W(3)));
      if (up) [[440, -40], [440, 60]].forEach(([x, y]) => arrow(p, x, y, 320, y, 4));
      else [[260, -40], [260, 60]].forEach(([x, y]) => arrow(p, x, y, 440, y, 4));
      labels(p, d, 160, 320, -280, 0);
      endSym(p, d, 420, -250, c);
    });
    for (let i = 0; i < n; i++) { const [x, y] = P[i]; item(d, i, x, y, 115, c, { from: [580, y * .4], to: [x + 220, y + 40] }); }
    if (d.center) center(d, -285, 0, 110, c);
  });

  /* 10 ── DOOR: the door swings open, copies walk up to it one by one (or walk out of it and fade) */
  variant('door', 'ประตูเข้าออก', (d, c) => {
    const n = N(d), up = d.dir === 'up', xs = [...Array(n)].map((_, i) => -40 + i * (400 / (n - 1)));
    art(c, p => {
      drawIn(p.line(-470, 262, 470, 262, { sw: 2, stroke: C.soft }), p, 0, .35);
      const fr = sub(p); pop(fr, p, 0, -300, 262, .7); fr.rect(-430, -260, 260, 522, Object.assign({ rx: 6 }, F(3.4)));
      const lf = sub(p); on(lf, p, .15, { ox: -430, oy: 0, sx: [[0, 2.85], [.4, .9, 'out'], [.55, 1, 'soft']], o: [[0, 0], [.04, 1]] });
      lf.path('M -430 -260 L -340 -222 L -340 226 L -430 262 Z', F(3)); lf.circle(-356, 10, 8, W(2.2));
      if (up) arrow(p, 300, -90, -120, -90, 5); else arrow(p, -120, -90, 300, -90, 5);
      labels(p, d, 160, 330, -300, -290);
      endSym(p, d, 420, -250, c);
    });
    xs.forEach((x, i) => item(d, i, x, 175, 120, c, { from: [580, 175], start: [x - 150, 175], to: [x, 175], arc: 30 }));
    center(d, -255, 10, 140, c);
  });

  /* 11 ── TRAY: copies drop into the slots one by one (or are lifted out, leaving empty slots) */
  variant('tray', 'ช่องถาด', (d, c) => {
    const n = N(d), sh = d.center ? 70 : 0, g4 = n === 4;
    const S = g4 ? [[-100, -60], [100, -60], [-100, 110], [100, 110]].map(([x, y]) => [x + sh, y]) : [...Array(n)].map((_, i) => [sh + (i - (n - 1) / 2) * 210, 25]);
    const sz = g4 ? 150 : 180;
    art(c, p => {
      const T = sub(p); pop(T, p, 0, sh, 25, .6);
      const w = g4 ? 460 : n * 210 + 50, h = g4 ? 360 : 240;
      T.rect(sh - w / 2, 25 - h / 2, w, h, Object.assign({ rx: 30 }, F(3.4)));
      S.forEach(([x, y]) => T.rect(x - sz / 2, y - sz / 2, sz, sz, { rx: 22, fill: C.fill, sw: 2, stroke: C.soft }));
      labels(p, d, sh, 300, -390, 120);
      endSym(p, d, 380, 60, c);
    });
    const gx = j => sh + (j - (n - 1) / 2) * (g4 ? 150 : 210), gyT = g4 ? -270 : -220;   // taken-out copies: clear of the tray, in a row above it
    S.forEach(([x, y], i) => item(d, i, x, y, g4 ? 110 : 130, c, { from: [x, y - 300], to: [gx(i), gyT] }));
    center(d, -390, 25, 130, c);
  });

  /* 12 ── TREND (line with nodes): the line draws itself; at each node a copy drops in and the node lights (or the copies drift off and their nodes go dark) */
  const cub = P => ({ B: t => { const u = 1 - t; return [0, 1].map(k => u * u * u * P[0][k] + 3 * u * u * t * P[1][k] + 3 * u * t * t * P[2][k] + t * t * t * P[3][k]); },
    D: t => { const u = 1 - t; return [0, 1].map(k => 3 * u * u * (P[1][k] - P[0][k]) + 6 * u * t * (P[2][k] - P[1][k]) + 3 * t * t * (P[3][k] - P[2][k])); },
    d: `M ${P[0][0]} ${P[0][1]} C ${P[1][0]} ${P[1][1]}, ${P[2][0]} ${P[2][1]}, ${P[3][0]} ${P[3][1]}` });
  const upSide = (D, t) => { const [dx, dy] = D(t), l = Math.hypot(dx, dy); let nx = -dy / l, ny = dx / l; if (ny > 0) { nx = -nx; ny = -ny; } return [nx, ny]; };
  variant('trend', 'เส้นเทรนด์มีจุด', (d, c) => {
    const n = N(d), up = d.dir === 'up', fy = y => up ? y : -y + 10, H = hitOf(c);
    const K3 = cub([[-380, fy(230)], [-120, fy(220)], [80, fy(-20)], [400, fy(-200)]]), ts = [...Array(n)].map((_, i) => .2 + .62 * i / (n - 1)), T = plan(d, H);
    art(c, p => {
      on(p.poly([[-440, -290], [-440, 290], [460, 290]], { sw: 2.2, stroke: C.soft }), p, 0, { draw: [[0, 0], [.35, 1, 'out']] });
      const ln = p.path(K3.d, { sw: 7 }), dk = [[0, 0]];
      if (up) { ts.forEach((t, i) => dk.push([T[i].end - .25, t * .97, 'io'])); dk.push([H + .05, 1, 'out']); } else dk.push([.5, 1, 'out']);
      on(ln, p, .1, { draw: dk.map(([t, v, e]) => [Math.max(0, t - .1), v, e]) });
      ts.forEach((t, i) => { const [x, y] = K3.B(t), g = sub(p), dot = sub(g); dot.circle(f1(x), f1(y), 15, F(3.4));
        if (up) pop(g, p, T[i].end - .05, x, y, .2);
        else { pop(g, p, .2 + t * .4, x, y, .2);
          if (gone(d, i)) { const gh = sub(p); gh.circle(f1(x), f1(y), 15, { fill: C.fill, sw: 2.4, stroke: C.rule }); on(gh, p, T[i].end - .1, { o: [[0, 0], [.12, 1]] }); on(dot, p, T[i].end - .1, { o: [[0, 1], [.12, 0]] }); } } });
      const [ex, ey] = K3.B(1), eg = sub(p); eg.circle(ex, ey, 26, F(3.6)); eg.circle(ex, ey, 9, { fill: C.ink, sw: 1 }); pop(eg, p, up ? H + .05 : .55, ex, ey, .2);
      labels(p, d, up ? 260 : -260, 335, up ? -330 : 330, up ? -290 : 330);
      endSym(p, d, 410, up ? 60 : -40, c);
    });
    ts.forEach((t, i) => { const [x, y] = K3.B(t), [nx, ny] = upSide(K3.D, t); item(d, i, x + nx * 95, y + ny * 95, 105, c, { from: [x + nx * 95, y + ny * 95 - 200], to: [x + nx * 95 + 40, y + ny * 95 - 110] }); });
    center(d, up ? -330 : 330, up ? -210 : 230, 110, c);
  });

  /* 13 ── SHELF: copies are set down on the shelf one by one — it gives a little each time (or they are lifted off) */
  variant('shelf', 'ชั้นวาง', (d, c) => {
    const n = N(d), xs = [...Array(n)].map((_, i) => -300 + i * 600 / (n - 1));
    art(c, p => {
      const Sh = sub(p); appear(Sh, p, 0, 0, 20); const Sd = sub(Sh); on(Sd, p, 0, { y: reactKeys(d, c, 0, 7) });
      Sd.rect(-430, 130, 860, 28, Object.assign({ rx: 6 }, F(3.2)));
      [-330, 330].forEach(x => Sh.path(`M ${x - 10} 158 L ${x + 10} 158 L ${x + 10} 240 Z`, F(2.6)));
      labels(p, d, 0, 300, -360, -100);
      endSym(p, d, 400, -260, c);
    });
    xs.forEach((x, i) => item(d, i, x, 50, 150, c, { from: [x, -330], to: [x + 40, -130] }));
    center(d, -360, -220, 120, c);
  });

  /* 14 ── LINE: copies swing up onto their pegs and sway (or drop off the line and fade) */
  variant('line', 'ราวหนีบ', (d, c) => {
    const n = N(d), ry = x => -230 + 110 * (1 - (x / 460) ** 2), xs = [...Array(n)].map((_, i) => -300 + i * 600 / (n - 1));
    art(c, p => {
      [-460, 460].forEach(x => drawIn(p.line(x, -280, x, 300, W(3)), p, 0, .3));
      drawIn(p.path('M -460 -230 Q 0 -10 460 -230', W(2.6)), p, .15, .35);
      const pg = sub(p); xs.forEach(x => pg.rect(f1(x - 8), f1(ry(x) - 16), 16, 40, Object.assign({ rx: 4 }, F(2.4)))); appear(pg, p, .35, 0, -10);
      labels(p, d, 0, 330, -380, 330);
      endSym(p, d, 380, 220, c);
    });
    xs.forEach((x, i) => { const r = item(d, i, x, ry(x) + 105, 140, c, { from: [x, ry(x) + 330], to: [x, ry(x) + 210] });
      if (r && d.dir === 'up') G.kf(r.a.g, (c.at || 0) + r.tv.T.end + .3, { ox: c.x + x * c.s, oy: c.y + (ry(x) + 4) * c.s, r: [[0, 0], [.1, 9, 'out'], [.3, -6], [.5, 3], [.7, 0, 'soft']] }); });
    center(d, -380, 235, 110, c);
  });

  /* 15 ── PIPE: copies slide along the pipe into the owner / tank (or slide back out of it); the flow chevrons run along */
  variant('pipe', 'ท่อ', (d, c) => {
    const n = N(d), up = d.dir === 'up', slot = i => 80 - i * 145, H = hitOf(c);
    art(c, p => {
      const Pp = sub(p); appear(Pp, p, 0, -40, 0);
      const D = 'M -440 -20 L 200 -20'; [Pp.path(D, { sw: 96 }), Pp.path(D, { sw: 86, stroke: C.fill })].forEach(e => e.setAttribute('stroke-linecap', 'butt'));
      Pp.rect(-470, -76, 30, 112, Object.assign({ rx: 6 }, F(2.6))); Pp.rect(190, -76, 30, 112, Object.assign({ rx: 6 }, F(2.6)));
      if (!d.center) { const tk = sub(p); pop(tk, p, .05, 355, 150); tk.rect(250, -150, 210, 300, Object.assign({ rx: 24 }, F(3.4))); tk.line(270, 40, 440, 40, W(2)); }
      const cl = clipRect(p, -436, -60, 620, 80), ch = sub(cl);
      for (let x = -440 - 290; x < 300; x += 145) chev(ch, x, -20, up ? 'right' : 'left', 12);
      on(ch, p, .35, { x: [[0, 0], [H - .35, (up ? 1 : -1) * 290, 'io']], o: [[0, 0], [.1, .6]] });
      labels(p, d, -150, 150, 355, 220);
      endSym(p, d, 355, -250, c);
    });
    for (let i = 0; i < n; i++) item(d, i, slot(up ? n - 1 - i : i), -20, 100, c, { from: [-560, -20], to: [slot(i) - 260, -20] });
    center(d, 355, -20, 190, c);
  });

  /* 16 ── SIZE: the item pops in again and again, a little bigger each time (or smaller) — each earlier size fades to a ghost */
  variant('size', 'ขยาย / หด', (d, c) => {
    const n = N(d), up = d.dir === 'up', ws = [...Array(n)].map((_, i) => { const k = up ? i : n - 1 - i; return 80 + k * (230 - 80) / (n - 1); });
    let x = -400; const xs = ws.map(w => { const cx = x + w / 2; x += w + 40; return cx; }), off = (400 - (x - 40)) / 2;
    const dd = Object.assign({}, d, { dir: 'up' }), T = plan(dd, hitOf(c));
    art(c, p => {
      drawIn(p.line(-460, 230, 460, 230, { sw: 2, stroke: C.soft }), p, 0, .35);
      labels(p, d, 0, 335, -400, -80);
      endSym(p, d, 420, -250, c);
    });
    xs.forEach((cx, i) => item(dd, i, cx + off, 230 - ws[i] / 2, ws[i], c, { from: [cx + off, 230 - ws[i] / 2 - 120], dim: i < n - 1 ? T[i + 1].end - .1 : null }));
    if (d.center) center(d, -400, -170, 120, c);
  });

  /* 17 ── BUBBLES: copies rise from below inside bubbles that wobble as they settle (or the bubbles pop and the copies fade) */
  variant('bubbles', 'ฟองลอย', (d, c) => {
    const n = N(d), P = [[-240, 190], [-70, 60], [100, -80], [270, -210]].slice(0, n);
    art(c, p => {
      P.forEach(([x, y], i) => {
        const b = sub(p), bw = sub(b); bw.circle(x, y, 82, { sw: 2.6, stroke: C.soft }); bw.path(`M ${x - 52} ${y - 30} A 60 60 0 0 1 ${x - 20} ${y - 58}`, { sw: 2.2, stroke: C.soft });
        const tv = follow(b, p, d, i, x, y, c, { from: [x, y + 420], start: [x, y], to: [x, y - 30] });
        if (d.dir === 'up') on(bw, p, tv.T.end, { ox: x, oy: y, sx: [[0, 1], [.1, 1.08, 'out'], [.25, .95], [.4, 1, 'soft']], sy: [[0, 1], [.1, .92, 'out'], [.25, 1.05], [.4, 1, 'soft']] });
        else if (gone(d, i)) { on(bw, p, 0, { o: [[0, 0], [.06 + i * .05, 0], [.2 + i * .05, 1], [tv.T.t0 + .1, 1], [tv.T.t0 + .13, 0]] });
          const br = sub(p); [[-160, -120], [-60, -10], [40, 110], [150, 200]].forEach(([a0, a1]) => br.path(`M ${f1(x + 92 * Math.cos(rad(a0)))} ${f1(y + 92 * Math.sin(rad(a0)))} A 92 92 0 0 1 ${f1(x + 92 * Math.cos(rad(a1)))} ${f1(y + 92 * Math.sin(rad(a1)))}`, { sw: 2.4, stroke: C.rule }));
          on(br, p, tv.T.t0 + .1, { ox: x, oy: y, s: [[0, .8], [.2, 1.15, 'out']], o: [[0, 0], [.04, 1], [.5, .7]] }); }
        else on(bw, p, .06 + i * .05, { ox: x, oy: y, s: [[0, .5], [.25, 1.05, 'out'], [.4, 1, 'soft']], o: [[0, 0], [.1, 1]] });
      });
      if (!d.center) { const mb = sub(p); [[-330, 300, 14], [-290, 270, 9], [-360, 250, 7]].forEach(([x, y, r]) => mb.circle(x, y, r, { sw: 2, stroke: C.soft }));
        on(mb, p, .1, { y: [[0, 40], [1.5, -10, 'out']], o: [[0, 0], [.2, 1]] }); }
      labels(p, d, 200, 300, -400, 300);
      endSym(p, d, -380, -230, c);
    });
    P.forEach(([x, y], i) => item(d, i, x, y, 100, c, { from: [x, y + 420], to: [x, y - 30] }));
    center(d, -400, 200, 130, c);
  });

  /* 18 ── LIGHTS: each lamp flickers on as its copy appears under it (or flickers out as its copy fades) */
  variant('lights', 'ไฟเหนือหัว', (d, c) => {
    const n = N(d), up = d.dir === 'up', xs = [...Array(n)].map((_, i) => (d.center ? 60 : 0) + (i - (n - 1) / 2) * (d.center ? 230 : 250)), T = plan(d, hitOf(c));
    art(c, p => {
      drawIn(p.line(-470, -320, 470, -320, W(2.4)), p, 0, .3); drawIn(p.line(-470, 262, 470, 262, { sw: 2, stroke: C.soft }), p, 0, .3);
      xs.forEach((x, i) => {
        const L = sub(p); on(L, p, .05 + i * .05, { y: [[0, -60], [.3, 0, 'out']], o: [[0, 0], [.1, 1]] });
        L.line(x, -320, x, -250, W(2)); L.path(`M ${x - 30} -250 L ${x + 30} -250 L ${x + 48} -200 L ${x - 48} -200 Z`, { fill: C.fill, sw: 2, stroke: C.rule });
        const lit = sub(L); lit.path(`M ${x - 30} -250 L ${x + 30} -250 L ${x + 48} -200 L ${x - 48} -200 Z`, F(3));
        const bm = sub(p); bm.shape([[x - 40, -200], [x + 40, -200], [x + 105, 255], [x - 105, 255]], { fill: 'rgba(255,255,255,.05)', stroke: 'none', sw: 0 });
        bm.line(x - 40, -200, x - 105, 255, { sw: 1.6, stroke: C.soft }); bm.line(x + 40, -200, x + 105, 255, { sw: 1.6, stroke: C.soft });
        const flick = [[0, 0], [.05, .9, 'lin'], [.09, .1, 'lin'], [.14, 1, 'lin'], [.19, .3, 'lin'], [.26, 1, 'lin']];
        if (up) { on(bm, p, T[i].t0, { o: flick }); on(lit, p, T[i].t0, { o: flick }); }
        else if (gone(d, i)) { const st = .3 + i * .05, ko = [[0, 0], [st, 0], [st + .1, 1], [T[i].t0, 1], [T[i].t0 + .05, .2, 'lin'], [T[i].t0 + .1, .9, 'lin'], [T[i].t0 + .16, .1, 'lin'], [T[i].t0 + .24, 0, 'lin']];
          on(bm, p, 0, { o: ko }); on(lit, p, 0, { o: ko }); }
        else { on(bm, p, .3 + i * .05, { o: [[0, 0], [.1, 1]] }); on(lit, p, .3 + i * .05, { o: [[0, 0], [.1, 1]] }); }
      });
      labels(p, d, 0, 330, -400, 120);
      endSym(p, d, 410, -160, c);
    });
    xs.forEach((x, i) => item(d, i, x, 160, 125, c, { from: [x, 100], to: [x, 160] }));
    center(d, -400, 10, 130, c);
  });

  /* 19 ── PILE: copies drop onto the heap and settle with a squash (or come off the top and drift away) */
  variant('pile', 'กองพูน', (d, c) => {
    const n = N(d), P = [[-130, 200], [10, 200], [-60, 80], [80, 80]].slice(0, n), sh = d.center ? 120 : 0;
    art(c, p => {
      drawIn(p.line(-470, 268, 470, 268, { sw: 2.4, stroke: C.soft }), p, 0, .35);
      const t = P[n - 1];
      labels(p, d, sh, 335, -360, 300);
      endSym(p, d, 400, 150, c);
    });
    P.forEach(([x, y], i) => item(d, i, x + sh, y, 130, c, { from: [x + sh + 30, -400], to: [x + sh + 140, y - 230] }));
    center(d, -360, 170, 170, c);
  });

  /* 20 ── RAIL: beads carrying the copies slide along the rail to the counted end and click together (or slide back out) */
  variant('rail', 'รางเลื่อน', (d, c) => {
    const n = N(d), up = d.dir === 'up', ok = K(d), right = i => 360 - i * 150, left = j => -380 + j * 150;
    art(c, p => {
      drawIn(p.line(-460, 0, 460, 0, W(3)), p, 0, .35);
      [-460, 460].forEach(x => { const g = sub(p); g.rect(x - 9, -110, 18, 220, Object.assign({ rx: 6 }, F(2.6))); pop(g, p, .05, x, 0, .2); });
      for (let i = 0; i < n; i++) { const b = sub(p), bi = sub(b); bi.circle(right(i), 0, 66, F(3));
        follow(b, p, d, i, right(i), 0, c, { from: [left(n - 1 - i) - 120, 0], to: [left(i - ok), 0] });
        if (d.dir === 'down' && !gone(d, i)) on(bi, p, .06 + i * .05, { ox: right(i), oy: 0, s: [[0, .5], [.25, 1.06, 'out'], [.4, 1, 'soft']], o: [[0, 0], [.1, 1]] });
        if (gone(d, i)) on(bi, p, .06 + i * .05, { ox: right(i), oy: 0, s: [[0, .5], [.25, 1.06, 'out'], [.4, 1, 'soft']], o: [[0, 0], [.1, 1]] }); }
      labels(p, d, 0, 200, -390, -280);
      endSym(p, d, 400, -250, c);
    });
    for (let i = 0; i < n; i++) item(d, i, right(i), 0, 92, c, { from: [left(n - 1 - i) - 120, 0], to: [left(i - ok), 0] });
    center(d, -390, -220, 100, c);
  });

  /* sample sentences from unrelated topics (neutrality) + a stress set */
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
  G.cats.B02 = { variants: V, SAMPLES, STRESS, draw: (i, d, c) => V[i].build(d, c) };
})();
