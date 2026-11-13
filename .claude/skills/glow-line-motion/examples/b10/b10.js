/* b10.js — category B10 "คน / กลุ่มเป้าหมาย": 20 neutral designs — STILL DRAFTS (round 1, waiting for the user's pick).
   User 2026-11-13: "B09 ผ่าน เริ่ม B10" + "ไม่ต้อง copy reference นะ ห้ามเลย" → the B02–B05 videos are only a reference for the KIND of design
   (everyday things with a real mechanism, clean layout, the house level of detail); every object here is new — none of the earlier
   categories' objects (no spotlight, magnifier, magnet, claw, door, frames …) is reused.
   Slots (CutPack CATEGORIES.md B10 — references/cutpack-CATEGORIES.md, cat_ai.py): who THING (a person icon, one or a group — any Lucide
   name) · label (the kind of person, as said, ≤ 12 letters) · tags (≤ 2, as said). who or label. The picture: the person in the centre,
   the label attached to them; the crowd around is drawn by the design as plain neutral figures (bust / standing: no face, clothes, age, sex).
   GL.cats.B10.draw(i, data, { x, y, s, at, hit, speed }) — canvas 1000 × 700 centred at (0,0); hit = seconds after `at` (default 1.8).
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
  /* who: THING (a person icon, one or a group — any Lucide name) · label: the kind of person, as said · tags: ≤ 2 small labels, as said.
     The design picks one out of a crowd; the crowd is drawn by the design (plain neutral figures: no face, no clothes, no age or sex). */
  function st(d) { const who = d.who && (picOf(d.who) || d.who.label) ? d.who : null;
    return { who, label: String(d.label || '').trim(), tags: (Array.isArray(d.tags) ? d.tags : []).map(t => String(t).trim()).filter(Boolean).slice(0, 2) }; }
  const V = [];
  const variant = (id, th, build) => V.push({ id, th, build });
  const halo = (q, x, y, r) => { q.circle(x, y, r, { fill: 'rgba(255,255,255,.06)', sw: 0, stroke: 'none' }); q.circle(x, y, r, S(1.8)); };
  const pathOf = (pts, close = true) => 'M ' + pts.map(([x, y]) => f1(x) + ' ' + f1(y)).join(' L ') + (close ? ' Z' : '');
  const shape = (q, pts, o) => q.path(pathOf(pts), o);
  const SOLID = (w = 2) => ({ fill: C.ink, sw: w });
  let CID = 0;
  function clipG(p, x, y, w, h) { const svg = p.g.ownerSVGElement, cp = document.createElementNS(NS, 'clipPath'), r = document.createElementNS(NS, 'rect');
    cp.id = 'b10clip' + (++CID); Object.entries({ x, y, width: w, height: h }).forEach(([k, v]) => r.setAttribute(k, v)); cp.appendChild(r);
    (svg.querySelector('defs') || svg).appendChild(cp); return sub(p, { 'clip-path': `url(#${cp.id})` }); }
  /* the crowd fades back on the keyword (the one picked out stays) */
  const crowdG = q => { const g = sub(q); on(g, q, 0, { o: [[0, 1], [Z.H, 1], [aH(.25), .38]] }); return g; };

  /* ---------- neutral figures (part of the designs — not icons) ---------- */
  /* a bust: round head + rounded shoulders; (x, y) = centre, k = scale (≈ 106k tall, 88k wide) */
  function bust(q, x, y, k = 1, o = F(3)) { q.path(`M ${f1(x - 44 * k)} ${f1(y + 44 * k)} L ${f1(x - 44 * k)} ${f1(y + 22 * k)} Q ${f1(x - 44 * k)} ${f1(y - 8 * k)} ${f1(x)} ${f1(y - 8 * k)} Q ${f1(x + 44 * k)} ${f1(y - 8 * k)} ${f1(x + 44 * k)} ${f1(y + 22 * k)} L ${f1(x + 44 * k)} ${f1(y + 44 * k)} Z`, o);
    q.circle(x, y - 38 * k, 24 * k, o); }
  /* a standing figure: head + one rounded body with the legs' parting line; feet on fy (≈ 202k tall) */
  function stand(q, x, fy, k = 1, o = F(3)) { q.path(`M ${f1(x - 34 * k)} ${f1(fy)} L ${f1(x - 34 * k)} ${f1(fy - 118 * k)} Q ${f1(x - 34 * k)} ${f1(fy - 150 * k)} ${f1(x)} ${f1(fy - 150 * k)} Q ${f1(x + 34 * k)} ${f1(fy - 150 * k)} ${f1(x + 34 * k)} ${f1(fy - 118 * k)} L ${f1(x + 34 * k)} ${f1(fy)} Z`, o);
    q.line(x, fy - 62 * k, x, fy - 2 * k, W(2)); q.circle(x, fy - 176 * k, 24 * k, o); }

  /* ---------- label + tags ---------- */
  /* a pill with a word in it, centred at (0,0) of its own group; strong = the label (bold ring), else a tag (soft ring) */
  function chip(q, str, { size = 36, strong = true, maxW = 420 } = {}) { size *= 1.18; const g = sub(q), t = txt(g, str, 0, size * .35, { size, maxW, weight: 700, color: strong ? C.ink : C.soft });
    const w = t.getBBox().width + size * 1.1, h = size * 1.5, r = g.rect(f1(-w / 2), f1(-h / 2), f1(w), f1(h), Object.assign({ rx: h / 2 }, strong ? F(3) : S(2)));
    g.g.insertBefore(r, t); return { g, w }; }
  /* pills in a row centred on x (kept inside lo…hi) */
  function chipRow(q, list, x, y, { gap = 14, lo = -480, hi = 480 } = {}) { if (!list.length) return;
    const cs = list.map(([s, o]) => chip(q, s, o)), tot = cs.reduce((a, c) => a + c.w, 0) + gap * (cs.length - 1);
    const k = Math.min(1, (hi - lo) / tot), tk = tot * k; let x0 = Math.max(lo, Math.min(hi - tk, x - tk / 2));   // too wide for its place → the row shrinks
    cs.forEach(c => { c.g.g.setAttribute('transform', `translate(${f1(x0 + c.w * k / 2)} ${f1(y)}) scale(${+k.toFixed(3)})`); x0 += (c.w + gap) * k; }); }
  /* the label (big pill) at (x, y) and the tags under it (dy) — or all in one row (o.row) */
  function labTags(q, S0, x, y, o = {}) { const { size = 40, tsize = 28, dy = 60, row = false, lo, hi } = o, L = S0.label ? [[S0.label, { size }]] : [], Tg = S0.tags.map(t => [t, { size: tsize, strong: false }]);
    if (row || !L.length) chipRow(q, L.concat(Tg), x, y, { lo, hi }); else { chipRow(q, L, x, y, { lo, hi }); chipRow(q, Tg, x, y + dy, { lo, hi }); } }
  /* the one picked out: its icon (no icon → its words in big type; no who at all → a neutral bust, bright) */
  function whoAt(c, q, S0, x, y, w, o = {}) {
    if (S0.who) { const at = c.at || 0, X = c.x + x * c.s, Y = c.y + y * c.s, fn = picOf(S0.who);
      if (fn) return G.art(fn, { x: X, y: Y, w: w * c.s, at: at + tu(.12), speed: Z.sp });
      const f = p2 => txt(p2, S0.who.label, 0, w * .11, { size: w * .3, maxW: w * 1.5, weight: 700, color: C.ink, wrap: 'mid' }); f.custom = true; f.dur = .3; f.exit = 'pop';
      const a = G.art(f, { x: X, y: Y, s: c.s, at: at + tu(.12), speed: 1 }); a.speed = Z.sp; return a; }
    bust(q, x, y + w * .08, w / 110, { fill: LIT, sw: 3.4 }); return null; }

  /* 01 ── VIEWFINDER: the back of a camera — a crowd on its screen, the focus brackets lock onto one; the label is tagged above it */
  variant('viewfinder', 'จอกล้องโฟกัส', (d, c) => { const S0 = st(d), cx = -70, cy = 45;
    art(c, p => {
      R(p, -150, -282, 160, 34, 12, F(2.6)); R(p, 120, -272, 90, 24, 8, F(2.4)); R(p, 250, -278, 92, 30, 10, F(2.6));
      R(p, -420, -250, 840, 490, 44, F(3.6)); R(p, -372, -205, 604, 392, 14, { fill: GLASS, sw: 0, stroke: 'none' });
      [[320, -120, 28], [320, -35, 18], [320, 35, 18]].forEach(([x, y, r]) => p.circle(x, y, r, F(2.6))); ring(p, 320, 140, 42, 16, F(2.6));
      const cr = crowdG(p); [-300, -195, 55, 160].forEach(x => bust(cr, x, 105, .85));
      [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sy]) => { const x = cx + sx * 100, y = cy + sy * 95; p.poly([[x, y - sy * 32], [x, y], [x - sx * 32, y]], W(4.5)); });
      whoAt(c, p, S0, cx, cy, 150); labTags(p, S0, cx, -150, { size: 36, tsize: 26, dy: 54, lo: -360, hi: 225 });
    }); });

  /* 02 ── FUNNEL: a crowd above a funnel with a mesh; one comes out of the spout — the kind we mean */
  variant('funnel', 'กรวยกรอง', (d, c) => { const S0 = st(d);
    art(c, p => {
      const cr = crowdG(p); [-240, -145, -50, 45, 140, 235].forEach((x, i) => bust(cr, x, -175 + (i % 2) * 18, .8));
      p.path('M -280 -80 L -60 110 L -60 178 L 60 178 L 60 110 L 280 -80 Z', F(3.4)); p.ellipse(0, -80, 280, 26, F(3));
      for (let x = -150; x <= 150; x += 50) p.line(x, -30, x, 22, S(1.4)); p.line(-205, -30, 205, -30, S(1.8)); p.line(-160, 22, 160, 22, S(1.8));
      halo(p, 0, 252, 92); whoAt(c, p, S0, 0, 252, 118); labTags(p, S0, 270, 215, { size: 34, tsize: 26, dy: 54, lo: 80, hi: 490 });
    }); });

  /* 03 ── LANYARD: a badge on a lanyard — the photo window holds the person, the kind is printed under it, the tags are chips */
  variant('lanyard', 'บัตรคล้องคอ', (d, c) => { const S0 = st(d);
    art(c, p => {
      [[-1], [1]].forEach(([s]) => { p.line(s * 175, -352, s * 28, -196, W(2.6)); p.line(s * 140, -352, s * 6, -196, W(2.6)); });
      R(p, -34, -200, 68, 42, 8, F(2.8)); p.circle(0, -146, 13, W(3));
      R(p, -205, -128, 410, 420, 26, F(3.6)); R(p, -44, -108, 88, 16, 8, W(2));
      R(p, -100, -76, 200, 196, 18, F(2.6));
      whoAt(c, p, S0, 0, 22, 152);
      if (S0.label) txt(p, S0.label, 0, 180, { size: 44, maxW: 360, weight: 700, color: C.ink });
      chipRow(p, S0.tags.map(t => [t, { size: 26, strong: false }]), 0, S0.label ? 238 : 190, { lo: -190, hi: 190 });
    }); });

  /* 04 ── WINDOWS: a block of flats at dusk — one window lights up with the person in it; the label hangs under it */
  variant('windows', 'ตึกไฟติดบานเดียว', (d, c) => { const S0 = st(d), cols = [-225, -75, 75, 225], rows = [-215, -45, 125], wx = 75, wy = -45;
    art(c, p => {
      p.line(-480, 300, 480, 300, S(2)); R(p, -350, -318, 700, 26, 6, F(2.8)); R(p, -330, -292, 660, 592, 6, F(3.4)); R(p, -55, 205, 110, 95, 6, F(2.8));
      const cr = crowdG(p);
      rows.forEach(y => cols.forEach(x => { const lit = x === wx && y === wy; R(lit ? p : cr, x - 55, y - 55, 110, 110, 6, lit ? { fill: LIT, sw: 3.4 } : F(2.6)); (lit ? p : cr).line(x - 66, y + 62, x + 66, y + 62, W(3)); if (!lit) bust(cr, x, y + 22, .66); }));
      whoAt(c, p, S0, wx, wy, 96); labTags(p, S0, wx, 44, { size: 26, tsize: 21, row: true, lo: -320, hi: 320 });
    }); });

  /* 05 ── QUEUE: the "now serving" screen shows the kind; out of the line, that one steps up onto the spot */
  variant('queue', 'จอเรียกคิว', (d, c) => { const S0 = st(d);
    art(c, p => {
      p.line(-150, -350, -150, -300, W(2.4)); p.line(150, -350, 150, -300, W(2.4));
      R(p, -240, -300, 480, 124, 16, F(3.4)); R(p, -218, -284, 436, 92, 8, { fill: GLASS, sw: 2 });
      if (S0.label) txt(p, S0.label, 0, -222, { size: 46, maxW: 400, weight: 700, color: C.ink });
      chipRow(p, S0.tags.map(t => [t, { size: 28, strong: false }]), 0, -130, { lo: -300, hi: 300 });
      p.line(-480, 292, 480, 292, S(2)); p.ellipse(-60, 286, 110, 14, W(2.4));
      const cr = crowdG(p); [160, 255, 350, 445].forEach(x => stand(cr, x, 292, .82));
      halo(p, -60, 150, 115); whoAt(c, p, S0, -60, 150, 175);
    }); });

  /* 06 ── NAMEPLATE: the person at a desk behind a nameplate with the kind on it; the tags stand as small cards on the desk */
  variant('nameplate', 'ป้ายชื่อตั้งโต๊ะ', (d, c) => { const S0 = st(d);
    art(c, p => {
      R(p, -125, -250, 250, 270, 46, F(3)); R(p, -440, 90, 880, 26, 6, F(3.2)); R(p, -405, 116, 24, 184, 4, F(2.6)); R(p, 381, 116, 24, 184, 4, F(2.6));
      whoAt(c, p, S0, 0, -112, 200);
      shape(p, [[-190, 90], [190, 90], [172, -4], [-172, -4]], F(3.2)); p.line(-174, 6, 174, 6, W(1.8));
      if (S0.label) txt(p, S0.label, 0, 64, { size: 44, maxW: 320, weight: 700, color: C.ink });
      S0.tags.forEach((t, i) => { const x = i ? 320 : -320, g = sub(p, { transform: `translate(${x} 58)` }); chip(g, t, { size: 26, strong: false, maxW: 180 }); });
    }); });

  /* 07 ── GROUP PHOTO: a group photo — one face is circled in marker and an arrow points down to the label */
  variant('photo', 'รูปหมู่วงตัว', (d, c) => { const S0 = st(d), wx = 75, wy = 50;
    art(c, p => {
      R(p, -430, -272, 860, 476, 10, F(3.6)); R(p, -402, -244, 804, 388, 4, { fill: GLASS, sw: 0, stroke: 'none' });
      const cr = crowdG(p); [-300, -150, 0, 150, 300].forEach(x => bust(cr, x, -78, .95)); [-375, -225, -75, 225, 375].forEach(x => bust(cr, x, 72, 1));
      whoAt(c, p, S0, wx, wy, 138);
      const e = rot(p, -6, wx, wy - 4); e.ellipse(wx, wy - 4, 104, 98, W(4.5));
      p.path(`M 205 236 Q 168 200 150 140`, W(3)); p.poly([[136, 158], [150, 138], [164, 160]], W(3));
      labTags(p, S0, 205, 256, { size: 34, tsize: 26, row: true, lo: -420, hi: 480 });
    }); });

  /* 08 ── SEATS: an audience seen from behind, rows of seat backs with heads above them — one seat is lit and the person sits in it;
     a callout above names the kind */
  variant('seats', 'ที่นั่งโรงละคร', (d, c) => { const S0 = st(d), rows = [-110, 30, 170], cols = [-375, -225, -75, 75, 225, 375], wx = 75, wy = -110;
    const chair = (q, x, y, o) => q.path(`M ${x - 60} ${y + 48} L ${x - 60} ${y - 26} Q ${x - 60} ${y - 62} ${x - 24} ${y - 62} L ${x + 24} ${y - 62} Q ${x + 60} ${y - 62} ${x + 60} ${y - 26} L ${x + 60} ${y + 48} Z`, o);
    art(c, p => {
      const cr = crowdG(p);
      rows.forEach(y => cols.forEach(x => { const me = x === wx && y === wy; if (!me) cr.circle(x, y - 84, 30, F(3)); chair(me ? p : cr, x, y, me ? { fill: LIT, sw: 3.4 } : F(3)); (me ? p : cr).line(x - 44, y - 30, x + 44, y - 30, W(1.6)); }));
      whoAt(c, p, S0, wx, wy - 38, 122);
      shape(p, [[wx - 14, -224], [wx + 14, -224], [wx, -206]], SOLID(1.6));
      labTags(p, S0, wx, -258, { size: 32, tsize: 24, row: true, lo: -480, hi: 480 });
    }); });

  /* 09 ── PAWNS: game pawns on a board — one is lifted off the board: the person on its base; the label above */
  variant('pawns', 'หมากบนกระดาน', (d, c) => { const S0 = st(d), fy = 168;
    const pawn = (q, x) => { q.ellipse(x, fy, 42, 10, F(2.6)); R(q, x - 42, fy - 22, 84, 22, 8, F(2.8));
      q.path(`M ${x - 34} ${fy - 22} Q ${x - 12} ${fy - 70} ${x - 14} ${fy - 110} L ${x + 14} ${fy - 110} Q ${x + 12} ${fy - 70} ${x + 34} ${fy - 22} Z`, F(2.8));
      q.ellipse(x, fy - 112, 30, 8, F(2.6)); q.circle(x, fy - 146, 30, F(3)); };
    art(c, p => {
      shape(p, [[-440, 190], [440, 190], [400, 150], [-400, 150]], F(2.6)); R(p, -440, 190, 880, 42, 8, F(3.2));
      for (let k = 0; k < 11; k++) if (k % 2) R(p, -440 + k * 80, 196, 80, 30, 2, { fill: GLASS, sw: 0, stroke: 'none' });
      const cr = crowdG(p); [-360, -240, -120, 140, 260, 380].forEach(x => pawn(cr, x));
      p.ellipse(10, fy, 42, 10, S(2));
      halo(p, 10, -40, 130); p.ellipse(10, 40, 72, 16, F(3)); R(p, 10 - 72, 26, 144, 14, 7, F(2.6));
      whoAt(c, p, S0, 10, -50, 160); labTags(p, S0, 10, -235, { size: 34, tsize: 26, row: true, lo: -480, hi: 480 });
    }); });

  /* 10 ── TURNSTILE: people wait on one side of a turnstile; its lamp is on and the one it let through stands on the other side */
  variant('turnstile', 'ประตูหมุน', (d, c) => { const S0 = st(d);
    art(c, p => {
      p.line(-480, 290, 480, 290, S(2));
      const cr = crowdG(p); [-450, -355, -260].forEach(x => stand(cr, x, 290, .9));
      R(p, -190, 70, 120, 220, 16, F(3.4)); p.circle(-130, 104, 17, { fill: LIT, sw: 2.6 }); p.line(-170, 150, -90, 150, W(1.8));
      R(p, -72, 118, 150, 14, 7, F(2.6)); R(p, -84, 140, 14, 90, 7, F(2.4)); p.circle(-70, 125, 20, F(3));
      halo(p, 220, 150, 115); whoAt(c, p, S0, 220, 150, 185); labTags(p, S0, 220, -62, { size: 34, tsize: 26, dy: 56, lo: 0, hi: 490 });
    }); });

  /* 11 ── GUIDE SIGN: a tour guide's sign held up high over a group — the sign carries the kind; the group under it is the person icon */
  variant('guideflag', 'ป้ายไกด์ชูนำกลุ่ม', (d, c) => { const S0 = st(d), sx = 150;
    art(c, p => {
      const cr = crowdG(p); [-400, -300, 330, 430].forEach(x => bust(cr, x, 232, .9));
      R(p, sx - 6, -180, 12, 440, 5, F(2.2));
      if (S0.label) { const g = sub(p, { transform: `translate(${sx} -230)` }), t = txt(g, S0.label, 0, 15, { size: 42, maxW: 520, weight: 700, color: C.ink }), w = Math.max(160, t.getBBox().width + 60);
        g.g.insertBefore(g.rect(f1(-w / 2), -48, f1(w), 96, { rx: 16, fill: C.fill, sw: 3.4 }), t); }
      else R(p, sx - 80, -278, 160, 96, 16, F(3.4));
      chipRow(p, S0.tags.map(t => [t, { size: 26, strong: false }]), sx, -138, { lo: -460, hi: 470 });
      whoAt(c, p, S0, -40, 150, 230);
    }); });

  /* 12 ── INTERCOM: the entry panel of a building — one name slot shows the kind and its button is lit; the camera screen shows who */
  variant('intercom', 'แผงกริ่งหน้าตึก', (d, c) => { const S0 = st(d), rows = [10, 82, 154, 226], me = 1;
    art(c, p => {
      R(p, -235, -318, 470, 636, 26, F(3.6)); R(p, -185, -278, 370, 216, 14, { fill: GLASS, sw: 2.4 });
      [-40, 0, 40].forEach(x => p.line(x - 14, 290, x + 14, 290, W(2.4)));
      const cr = crowdG(p);
      rows.forEach((y, i) => { const q = i === me ? p : cr; R(q, -195, y - 27, 290, 54, 10, F(2.4)); q.circle(152, y, 25, i === me ? { fill: LIT, sw: 3 } : F(2.6)); });
      if (S0.label) txt(p, S0.label, -50, rows[me] + 11, { size: 30, maxW: 260, weight: 700, color: C.ink });
      whoAt(c, p, S0, 0, -192, 116); chipRow(p, S0.tags.map(t => [t, { size: 24, strong: false }]), 0, -96, { lo: -180, hi: 180 });
    }); });

  /* 13 ── RING TOSS: a ring has landed over one of the figures; the missed rings lie on the stand */
  variant('ringtoss', 'ห่วงโยนลงตัว', (d, c) => { const S0 = st(d), wx = 60, ry = 180;
    art(c, p => {
      R(p, -450, 250, 900, 24, 6, F(3));
      const cr = crowdG(p); [-390, -280, -170, 290, 400].forEach(x => stand(cr, x, 250, .85));
      [[-220, 238], [340, 240]].forEach(([x, y]) => { p.ellipse(x, y, 58, 12, { sw: 11 }); p.ellipse(x, y, 58, 12, { sw: 5, stroke: C.fill }); });
      p.path(`M ${wx - 118} ${ry} A 118 28 0 0 1 ${wx + 118} ${ry}`, { sw: 11 }); p.path(`M ${wx - 118} ${ry} A 118 28 0 0 1 ${wx + 118} ${ry}`, { sw: 5, stroke: C.fill });
      halo(p, wx, 120, 120); whoAt(c, p, S0, wx, 118, 180); labTags(p, S0, wx, -78, { size: 34, tsize: 26, dy: 56 });
    });
    over(c, p => { p.path(`M ${wx - 118} ${ry} A 118 28 0 0 0 ${wx + 118} ${ry}`, { sw: 11 }); p.path(`M ${wx - 118} ${ry} A 118 28 0 0 0 ${wx + 118} ${ry}`, { sw: 5, stroke: C.fill }); }); });

  /* 14 ── MIRROR: a standing mirror shows the person — the kind is stuck on the glass, the tags are pinned beside it */
  variant('mirror', 'กระจกส่องตัว', (d, c) => { const S0 = st(d);
    art(c, p => {
      p.line(0, 214, -130, 300, W(3)); p.line(0, 214, 130, 300, W(3)); R(p, -9, 180, 18, 48, 4, F(2.4));
      p.ellipse(0, -50, 205, 255, F(3.6)); p.ellipse(0, -50, 182, 230, { fill: GLASS, sw: 0, stroke: 'none' });
      p.line(-120, -210, -60, -250, W(1.6));
      whoAt(c, p, S0, 0, -88, 220);
      if (S0.label) chipRow(p, [[S0.label, { size: 38 }]], 0, 112, { lo: -175, hi: 175 });
      S0.tags.forEach((t, i) => { const g = sub(p, { transform: `translate(${i ? 345 : -345} -50)` }); chip(g, t, { size: 26, strong: false, maxW: 200 }); });
    }); });

  /* 15 ── CAPSULE TOY: a capsule machine full of capsules — one has dropped out and opened: the person rises out of it */
  variant('gacha', 'ตู้กาชาปอง', (d, c) => { const S0 = st(d);
    art(c, p => {
      p.line(-480, 292, 480, 292, S(2));
      R(p, -205, -296, 90, 26, 8, F(2.6)); p.circle(-160, -112, 162, F(3.4));
      const cr = crowdG(p); [[-245, -40], [-160, -18], [-75, -40], [-205, -125], [-115, -128], [-160, -205], [-250, -190], [-70, -200]].forEach(([x, y]) => { cr.circle(x, y, 38, F(2.6)); cr.line(x - 38, y, x + 38, y, W(1.8)); });
      R(p, -305, 44, 290, 248, 18, F(3.4)); p.circle(-160, 122, 42, F(3)); R(p, -204, 114, 88, 16, 8, F(2.4)); R(p, -212, 198, 104, 64, 12, F(2.8));
      const ld = rot(p, -24, 270, 105); ld.path('M 178 110 A 92 92 0 0 1 362 110 Z', F(3));
      halo(p, 270, 120, 112); p.path('M 176 202 A 94 94 0 0 0 364 202 Z', F(3.2));
      whoAt(c, p, S0, 270, 122, 150); labTags(p, S0, 270, -45, { size: 32, tsize: 24, dy: 52, lo: 30, hi: 490 });
    }); });

  /* 16 ── PAPER CHAIN: a chain of paper dolls holding hands — in the middle of the chain stands the person; the label at their feet */
  variant('paperchain', 'ตุ๊กตากระดาษจูงมือ', (d, c) => { const S0 = st(d), ny = -60;
    const doll = (q, x) => { q.path(rpoly([[-22, 0], [-95, 22], [-95, 50], [-32, 42], [-44, 160], [-12, 160], [0, 96], [12, 160], [44, 160], [32, 42], [95, 50], [95, 22], [22, 0]].map(([a, b]) => [x + a, ny + b]), 8), F(3)); q.circle(x, ny - 36, 34, F(3)); };
    art(c, p => {
      const cr = crowdG(p); [-390, -215, 215, 390].forEach(x => doll(cr, x));
      halo(p, 0, 20, 125); whoAt(c, p, S0, 0, 22, 205); labTags(p, S0, 0, 172, { size: 36, tsize: 26, dy: 56 });
    }); });

  /* 17 ── STICKER SHEET: a sheet of round figure stickers — one has been peeled off and lifted: it is the person; its spot is empty */
  variant('stickers', 'แผ่นสติกเกอร์ลอก', (d, c) => { const S0 = st(d), cols = [-350, -200, -50], rows = [-130, 0, 130];
    art(c, p => {
      R(p, -450, -232, 610, 464, 18, F(3.2));
      const cr = crowdG(p);
      rows.forEach(y => cols.forEach(x => { if (x === -200 && y === 0) { p.circle(x, y, 58, S(2)); return; } cr.circle(x, y, 58, F(2.6)); bust(cr, x, y + 10, .6); }));
      const st2 = rot(p, -8, 320, -60); st2.circle(320, -60, 110, F(3.6)); st2.path('M 228 0 Q 262 -6 270 -40 Q 236 -30 228 0 Z', F(2.4));
      whoAt(c, p, S0, 320, -60, 150); labTags(p, S0, 320, 102, { size: 32, tsize: 24, dy: 52, lo: 160, hi: 492 });
    }); });

  /* 18 ── CONTACTS: a tablet — the kind is typed into the search bar, and one row of the list is picked out: the person + the tags */
  variant('contacts', 'รายชื่อค้นหา', (d, c) => { const S0 = st(d), rows = [-105, 0, 105, 205], me = 1;
    art(c, p => {
      R(p, -380, -300, 760, 600, 38, F(3.6)); R(p, -345, -266, 690, 532, 18, { fill: GLASS, sw: 0, stroke: 'none' });
      R(p, -300, -232, 600, 68, 34, F(2.6)); if (S0.label) txt(p, S0.label, 0, -186, { size: 34, maxW: 520, weight: 700, color: C.ink });
      const cr = crowdG(p);
      rows.forEach((y, i) => { if (i === me) return; cr.circle(-262, y, 34, F(2.4)); bust(cr, -262, y + 8, .42); cr.line(-200, y - 10, 120, y - 10, S(5)); cr.line(-200, y + 18, 20, y + 18, S(4)); });
      R(p, -322, rows[me] - 50, 644, 100, 20, { fill: GLASS, sw: 3.2 });
      whoAt(c, p, S0, -262, rows[me], 84);
      if (S0.tags.length) chipRow(p, S0.tags.map(t => [t, { size: 26, strong: false }]), 40, rows[me], { lo: -200, hi: 310 });
      else p.line(-200, rows[me], 120, rows[me], W(5));
    }); });

  /* 19 ── SPIN THE BOTTLE: people sit in a ring seen from above; the bottle in the middle has stopped pointing at one of them */
  variant('bottle', 'ขวดหมุนชี้', (d, c) => { const S0 = st(d), Rr = 236, A0 = -30, pos = a => [Rr * Math.cos(rad(a)), 10 + Rr * Math.sin(rad(a))];
    art(c, p => {
      p.circle(0, 10, 170, S(1.6));
      const cr = crowdG(p);
      for (let k = 1; k < 8; k++) { const [x, y] = pos(A0 + k * 45); bust(cr, x, y, .78); }
      const b = rot(p, A0, 0, 10); R(b, -96, -26, 150, 72, 32, F(3.2)); R(b, 50, -6, 70, 32, 12, F(2.8)); R(b, 116, -9, 22, 38, 6, F(2.6)); b.line(-70, 10, 30, 10, W(1.6));
      const [wx, wy] = pos(A0); halo(p, wx, wy, 85); whoAt(c, p, S0, wx, wy, 128);
      labTags(p, S0, 300, -298, { size: 32, tsize: 24, dy: 52, lo: 60, hi: 492 });
    }); });

  /* 20 ── SHOP WINDOW: dress forms behind a shop window — in the middle, on a stand, the person; the label hangs above like a sign */
  variant('showcase', 'ตู้โชว์หุ่น', (d, c) => { const S0 = st(d);
    const form = (q, x) => { q.ellipse(x, 252, 40, 8, F(2.4)); q.line(x, 252, x, 120, W(3));
      q.path(`M ${x - 46} -40 Q ${x - 60} 20 ${x - 30} 50 Q ${x - 60} 95 ${x - 52} 120 L ${x + 52} 120 Q ${x + 60} 95 ${x + 30} 50 Q ${x + 60} 20 ${x + 46} -40 Q ${x} -60 ${x - 46} -40 Z`, F(3));
      R(q, x - 9, -66, 18, 22, 4, F(2.4)); q.circle(x, -92, 28, F(3)); };
    art(c, p => {
      R(p, -440, -330, 880, 44, 8, F(3)); R(p, -440, -286, 880, 556, 8, F(3.4)); R(p, -410, -256, 820, 496, 4, { fill: GLASS, sw: 0, stroke: 'none' }); R(p, -460, 270, 920, 30, 6, F(3));
      const cr = crowdG(p); [-310, -165, 165, 310].forEach(x => form(cr, x));
      R(p, -95, 196, 190, 56, 10, F(3)); halo(p, 0, 50, 125); whoAt(c, p, S0, 0, 52, 215);
      labTags(p, S0, 0, -200, { size: 36, tsize: 26, dy: 56, lo: -400, hi: 400 });
    }); });

  /* samples from unrelated topics (neutrality) + a stress set */
  const I = (icon, label) => label ? { icon, label } : { icon };
  const SAMPLES = [
    { say: 'คนที่เพิ่งเป็นแม่', who: I('baby'), label: 'แม่มือใหม่' },
    { say: 'นักเรียนที่อ่านหนังสือไม่ทัน', who: I('graduation-cap'), label: 'นักเรียน', tags: ['อ่านไม่ทัน'] },
    { say: 'สำหรับคนที่ไม่เคยออกกำลังกาย', who: I('dumbbell'), label: 'มือใหม่หัดออกกำลัง', tags: ['ไม่เคยออกกำลัง'] },
    { say: 'เจ้าของร้านเล็ก ๆ', who: I('store'), label: 'เจ้าของร้าน', tags: ['ร้านเล็ก'] },
    { say: 'คนทำงานออฟฟิศที่นั่งทั้งวัน', who: I('briefcase'), label: 'คนทำงานออฟฟิศ', tags: ['นั่งทั้งวัน'] },
    { say: 'ผู้สูงอายุที่อยู่บ้านคนเดียว', who: I('house'), label: 'ผู้สูงอายุ', tags: ['อยู่คนเดียว'] },
    { say: 'ยังมีบางคนใช้', who: I('users'), label: 'บางคน' },
    { say: 'คนที่นอนดึกเป็นประจำ', who: I('moon'), label: 'คนนอนดึก', tags: ['ทุกคืน'] },
    { say: 'นักวิ่งมือใหม่', who: I('person-standing'), label: 'นักวิ่งมือใหม่' },
    { say: 'ฟรีแลนซ์ที่รับงานเอง', who: I('laptop'), label: 'ฟรีแลนซ์', tags: ['รับงานเอง'] },
    { say: 'นักท่องเที่ยวต่างชาติ', who: I('users'), label: 'นักท่องเที่ยว', tags: ['ต่างชาติ'] },
    { say: 'คนที่เพิ่งย้ายมาเมืองใหม่', who: I('map-pin'), label: 'คนย้ายเมือง' },
    { say: 'คนขับรถส่งของ', who: I('truck'), label: 'คนส่งของ' },
    { say: 'คนรักแมว', who: I('heart'), label: 'ทาสแมว' },
    { say: 'ผู้ป่วยเบาหวาน', who: I('heart-pulse'), label: 'ผู้ป่วยเบาหวาน' },
    { say: 'คนที่ชอบทำอาหารกินเอง', who: I('chef-hat'), label: 'สายทำอาหาร', tags: ['ทำกินเอง'] },
    { say: 'เด็กที่ติดจอ', who: I('tv'), label: 'เด็กติดจอ', tags: ['ทุกวัน'] },
    { say: 'นักศึกษาจบใหม่ที่กำลังหางาน', who: I('graduation-cap'), label: 'จบใหม่', tags: ['กำลังหางาน', 'ไม่มีประสบการณ์'] },
    { say: 'คนที่เพิ่งเริ่มลงทุน', who: I('coins'), label: 'นักลงทุนมือใหม่' },
    { say: 'ทีมขายที่ต้องปิดยอดทุกเดือน', who: I('users'), label: 'ทีมขาย', tags: ['ปิดยอดทุกเดือน'] },
  ];
  const STRESS = [
    { say: 'ไม่มีไอคอน มีแต่ป้าย', label: 'คนขี้เกียจ' },
    { say: 'มีแต่ไอคอน ไม่มีป้าย', who: I('user') },
    { say: 'ป้ายยาว 12 ตัว + ป้ายย่อยยาว', who: I('users'), label: 'คนเพิ่งเป็นพ่อ', tags: ['ทำงานกะดึกทุกคืน', 'มีลูกเล็กสองคน'] },
    { say: 'ภาษาอังกฤษ', who: I('laptop'), label: 'Remote workers', tags: ['Night owls', 'Gen Z'] },
    { say: 'ชื่อไอคอนที่ไม่มี', who: I('no-such-icon'), label: 'นักสะสม' },
    { say: 'ไอคอนเป็นป้าย (ไม่มีรูป)', who: { label: 'ครู' }, label: 'ครูประถม' },
    { say: 'ป้ายย่อยอย่างเดียว', who: I('user'), tags: ['มือใหม่', 'งบน้อย'] },
    { say: 'กลุ่มคน + 2 ป้ายย่อย', who: I('users'), label: 'วัยรุ่น', tags: ['ชอบเที่ยว', 'งบจำกัด'] },
    { say: 'ป้ายยาวมาก', who: I('user'), label: 'สำหรับคนที่ไม่เคยออกกำลังกายเลย' },
    { say: 'ไม่มีไอคอน + ป้ายย่อย', label: 'คุณแม่', tags: ['ลูกอ่อน'] },
    { say: 'ตัวเลขในป้าย', who: I('users'), label: 'อายุ 40 ขึ้นไป' },
    { say: 'ป้ายสั้นมาก', who: I('baby'), label: 'เด็ก' },
    { say: 'ไอคอนสิ่งของ', who: I('car'), label: 'คนใช้รถ', tags: ['ขับทุกวัน'] },
    { say: 'ไอคอนคนนั่งวีลแชร์', who: I('accessibility'), label: 'ผู้ใช้วีลแชร์' },
    { say: 'อังกฤษยาว', who: I('user'), label: 'First-time home buyers' },
    { say: 'ไม่มีอะไรเลยนอกจากป้าย', label: 'ทุกคน' },
    { say: 'ไอคอนรูปคนกลม', who: I('user-round'), label: 'ลูกค้าประจำ', tags: ['ซื้อซ้ำ'] },
    { say: 'ป้ายย่อยสองอันสั้น', who: I('users'), label: 'คนโสด', tags: ['20+', 'ในเมือง'] },
    { say: 'กลุ่มคนกลม', who: I('users-round'), label: 'ชุมชน' },
    { say: 'ไอคอนไม่มี + ไม่มีป้าย', who: I('no-such-icon') },
  ];

  G.cats = G.cats || {};
  G.cats.B10 = { variants: V, SAMPLES, STRESS, draw: (i, d, c) => { setZ(c); CUR = V[i].id; V[i].build(d, c); }, CLAMPS, timing: c => (setZ(c), Object.assign({}, Z)) };
})();
