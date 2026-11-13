/* b10.js — category B10 "คน / กลุ่มเป้าหมาย": 20 neutral designs (stills approved, motion added).
   User 2026-11-13: "B09 ผ่าน เริ่ม B10" + "ไม่ต้อง copy reference นะ ห้ามเลย" → the B02–B05 videos are only a reference for the KIND of design
   (everyday things with a real mechanism, clean layout, the house level of detail); every object here is new — none of the earlier
   categories' objects (no spotlight, magnifier, magnet, claw, door, frames …) is reused.
   Slots (CutPack CATEGORIES.md B10 — references/cutpack-CATEGORIES.md, cat_ai.py): who THING (a person icon, one or a group — any Lucide
   name) · label (the kind of person, as said, ≤ 12 letters) · tags (≤ 2, as said). who or label. The picture: the person in the centre,
   the label attached to them; the crowd around is drawn by the design as plain neutral figures (bust / standing: no face, clothes, age, sex).
   GL.cats.B10.draw(i, data, { x, y, s, at, hit, speed }) — canvas 1000 × 700 centred at (0,0); hit = seconds after `at` (default 1.8).
   Motion (user 2026-11-13 "ทำเคลื่อนไหวได้"): the crowd comes in → the picker sweeps / filters (one smooth trip) → on the keyword it locks onto
   the one (punch + halo, the crowd fades back) → the label and tags pop → hold. The last frame = the approved still. */
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

  /* a whole person (GL.parts.human, front view: head, body, jointed arms and legs — no face, no clothes); feet on fy, scale k.
     User 2026-11-13 (B10 11): "ทำให้คน ฝั่งละ 2 คน เป็นคนที่สมจริง" */
  function person(q, x, fy, k = .75, pose = {}, mode = 'line') { const g = q.child({ transform: `translate(${f1(x)} ${f1(fy - 166 * k)}) scale(${k})` }, k);
    g.H = q.H; g.motion = q.motion; return G.parts.human(g, mode, pose); }
  /* a person in the crowd that fades back: an opaque dark silhouette (not faded) under it, so the glow does not show through the faded
     body as blotches (B05 lesson, duo()) */
  function crowdPerson(back, cr, x, fy, k, pose) { const bk = sub(back); person(bk, x, fy, k, pose, 'solid');
    bk.g.querySelectorAll('*').forEach(e => { if (e.getAttribute('fill') && e.getAttribute('fill') !== 'none') e.setAttribute('fill', C.fill); if (e.getAttribute('stroke')) e.setAttribute('stroke', C.fill); });
    return person(cr, x, fy, k, pose); }
  const RELAX = sd => ({ s: [sd * 36, -82], e: [sd * 48, -16], h: [sd * 44, 42] }), STANCE = sd => ({ h: [sd * 17, 8], k: [sd * 25, 88], f: [sd * 32, 166] });

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
  /* ---------- motion (CutPack B10: the crowd comes in → the picker sweeps / filters → on the keyword it locks onto the one, with the label → hold)
     Times: tC(i) = crowd member i comes in · T0 → H = the sweep (one smooth trip — B09 lesson) · H = lock: the person punches in, a halo blooms,
     the crowd fades back (crowdG) · the label pops right after (aH .02), the tags after it (aH .12). The last frame = the approved still. ---------- */
  const lerp = (a, b, k) => a + (b - a) * k;
  const SMG = .8, sm = u => .5 - .5 * Math.cos(Math.PI * Math.pow(Math.min(1, Math.max(0, u)), SMG));
  const T0f = () => Math.max(tu(.55), Z.H - tu(1.2)), tC = i => tu(.12 + .05 * i);
  /* a smooth trip through the values P between t0 and t1 (holding P[0] before) — keys relative to fin */
  function sweep(t0, t1, P, fin, n = 24) { const K = [[0, f1(P[0] - fin)], [t0, f1(P[0] - fin)]], m = P.length - 1;
    for (let j = 1; j <= n; j++) { const u = j / n, s2 = m * sm(u), g = Math.min(m - 1, Math.floor(s2)); K.push([t0 + (t1 - t0) * u, f1(lerp(P[g], P[g + 1], s2 - g) - fin)]); } return K; }
  /* a group that pops in at t about (x, y) — for the label, the tags, signs */
  const popW = (q, x, y, t) => { const g = sub(q); on(g, q, 0, { ox: x, oy: y, s: [[0, .6], [t, .6], [t + tu(.2), 1.06, 'out'], [t + tu(.32), 1, 'soft']], o: [[0, 0], [t, 0], [t + tu(.06), 1]] }); return g; };
  function haloH(q, x, y, r, t) { t = t ?? Z.H; const g = sub(q); on(g, q, 0, { ox: x, oy: y, s: [[0, .6], [t, .6], [t + tu(.3), 1, 'out']], o: [[0, 0], [t, 0], [t + tu(.1), 1]] }); halo(g, x, y, r); return g; }
  const litG = (q, t) => { const g = sub(q); on(g, q, 0, { o: [[0, 0], [t, 0], [t + tu(.08), 1]] }); return g; };
  const atG = (q, t) => { const g = sub(q); atT(g, q, t); return g; };
  const drawAt = (el, q, t, dur) => on(el, q, t, { draw: [[0, 0], [dur ?? tu(.3), 1, 'out']] });
  /* the label (big pill) at (x, y) and the tags under it (dy) — or all in one row (o.row); they pop in after the lock */
  function labTags(q, S0, x, y, o = {}) { const { size = 40, tsize = 28, dy = 60, row = false, lo, hi, t = aH(.02) } = o, L = S0.label ? [[S0.label, { size }]] : [], Tg = S0.tags.map(t2 => [t2, { size: tsize, strong: false }]);
    if (row || !L.length) chipRow(popW(q, x, y, t), L.concat(Tg), x, y, { lo, hi });
    else { chipRow(popW(q, x, y, t), L, x, y, { lo, hi }); chipRow(popW(q, x, y + dy, t + tu(.1)), Tg, x, y + dy, { lo, hi }); } }
  const tagsAt = (q, S0, x, y, o = {}) => chipRow(popW(q, x, y, o.t ?? aH(.12)), S0.tags.map(t => [t, { size: o.size || 26, strong: false }]), x, y, o);
  /* the one picked out: its icon (no icon → its words in big type; no who → a neutral bust, bright). Comes in at o.t (default: on the lock),
     punches on the keyword; o.mv = keys of the part it rides */
  function whoAt(c, q, S0, x, y, w, o = {}) { const t = o.t ?? Z.H - tu(.12), at = c.at || 0, X = c.x + x * c.s, Y = c.y + y * c.s;
    let a = null;
    if (S0.who) { const fn = picOf(S0.who);
      if (fn) a = G.art(fn, { x: X, y: Y, w: w * c.s, at: at + t, speed: Z.sp });
      else { const f = p2 => txt(p2, S0.who.label, 0, w * .11, { size: w * .3, maxW: w * 1.5, weight: 700, color: C.ink, wrap: 'mid' }); f.custom = true; f.dur = .3; f.exit = 'pop';
        a = G.art(f, { x: X, y: Y, s: c.s, at: at + t, speed: 1 }); a.speed = Z.sp; } }
    if (a) { if (o.mv) { const m = o.mv, K = { ox: X, oy: Y }; ['x', 'y'].forEach(n => { if (m[n]) K[n] = m[n].map(([u, v, e]) => e ? [u, v * c.s, e] : [u, v * c.s]); }); ['s', 'r'].forEach(n => { if (m[n]) K[n] = m[n]; }); kf(a.wrap, at, K); }
      kf(a.g, at, { ox: X, oy: Y, s: [[0, 1], [Z.H, 1], [aH(.07), 1.12, 'out'], [aH(.3), 1, 'soft']] }); return a; }
    let g = sub(q); if (o.mv) { g = mvG(q, Object.assign({ px: x, py: y }, o.mv)); } const b2 = sub(g);
    const sK = t + tu(.26) < Z.H ? [[0, .6], [t, .6], [t + tu(.2), 1.06, 'out'], [Z.H, 1, 'soft'], [aH(.07), 1.12, 'out'], [aH(.3), 1, 'soft']] : [[0, .6], [t, .6], [aH(.07), 1.12, 'out'], [aH(.3), 1, 'soft']];   // comes in on the lock: one pop
    on(b2, q, 0, { ox: x, oy: y, s: sK, o: [[0, 0], [t, 0], [t + tu(.06), 1]] });
    bust(b2, x, y + w * .08, w / 110, { fill: LIT, sw: 3.4 }); return null; }
  /* a crowd member that pops in at tC(i) */
  const inC = (cr, i, x, y, kind = 'pop') => inG(cr, kind, x, y, tC(i));

  /* 01 ── VIEWFINDER: the camera comes up, the crowd fills its screen, the focus brackets sweep across the faces and lock onto one on the
     keyword (they shrink in with a little snap); the label is tagged above it */
  variant('viewfinder', 'จอกล้องโฟกัส', (d, c) => { const S0 = st(d), cx = -70, cy = 45, T0 = T0f();
    art(c, p => {
      const B = inG(p, 'pop', 0, 0, 0);
      R(B, -150, -282, 160, 34, 12, F(2.6)); R(B, 120, -272, 90, 24, 8, F(2.4));
      const sh = sub(B); on(sh, p, 0, { y: [[0, 0], [Z.H - tu(.1), 0], [Z.H - tu(.04), 7, 'in'], [Z.H + tu(.04), 0, 'out']] }); R(sh, 250, -278, 92, 30, 10, F(2.6));
      R(B, -420, -250, 840, 490, 44, F(3.6)); R(B, -372, -205, 604, 392, 14, { fill: GLASS, sw: 0, stroke: 'none' });
      [[320, -120, 28], [320, -35, 18], [320, 35, 18]].forEach(([x, y, r]) => B.circle(x, y, r, F(2.6))); ring(B, 320, 140, 42, 16, F(2.6));
      const cr = crowdG(p); [-300, -195, 55, 160].forEach((x, i) => bust(inC(cr, i + 2, x, 105), x, 105, .85));
      const fb = mvG(p, { px: cx, py: cy, x: sweep(T0, Z.H - tu(.12), [-300, 160, -195, cx], cx), y: sweep(T0, Z.H - tu(.12), [95, 95, 95, cy], cy),
        s: [[0, 1.3], [Z.H - tu(.14), 1.3], [Z.H, .92, 'in'], [aH(.12), 1, 'out']], o: [[0, 0], [T0 - tu(.1), 0], [T0, 1]] });
      [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sy]) => { const x = cx + sx * 100, y = cy + sy * 95; fb.poly([[x, y - sy * 32], [x, y], [x - sx * 32, y]], W(4.5)); });
      whoAt(c, p, S0, cx, cy, 150); labTags(p, S0, cx, -150, { size: 36, tsize: 26, dy: 54, lo: -360, hi: 225 });
    }); });

  /* 02 ── FUNNEL: the crowd drops into the funnel's mouth and jiggles on the mesh (sieving); one drops out of the spout on the keyword */
  variant('funnel', 'กรวยกรอง', (d, c) => { const S0 = st(d), T0 = T0f();
    art(c, p => {
      const cr = crowdG(p), jg = sub(cr); on(jg, p, 0, { x: [[0, 0], [T0, 0], [T0 + tu(.1), -7], [T0 + tu(.2), 6], [T0 + tu(.3), -5], [T0 + tu(.4), 4], [T0 + tu(.5), -2], [T0 + tu(.6), 0]] });
      [-240, -145, -50, 45, 140, 235].forEach((x, i) => { const y = -175 + (i % 2) * 18; bust(inC(jg, i, x, y, 'drop'), x, y, .8); });
      const F0 = inG(p, 'pop', 0, 50, 0);
      F0.path('M -280 -80 L -60 110 L -60 178 L 60 178 L 60 110 L 280 -80 Z', F(3.4)); F0.ellipse(0, -80, 280, 26, F(3));
      for (let x = -150; x <= 150; x += 50) F0.line(x, -30, x, 22, S(1.4)); F0.line(-205, -30, 205, -30, S(1.8)); F0.line(-160, 22, 160, 22, S(1.8));
      haloH(p, 0, 252, 92);
      whoAt(c, p, S0, 0, 252, 118, { t: Z.H - tu(.28), mv: { y: [[0, -110], [Z.H - tu(.28), -110], [Z.H, 0, 'in'], [aH(.08), -10, 'out'], [aH(.18), 0, 'soft']] } });
      labTags(p, S0, 270, 215, { size: 34, tsize: 26, dy: 54, lo: 80, hi: 490 });
    }); });

  /* 03 ── LANYARD: the badge swings down on its lanyard and settles; the photo of the person lands in its window on the keyword,
     then the kind is printed and the tag chips pop */
  variant('lanyard', 'บัตรคล้องคอ', (d, c) => { const S0 = st(d);
    art(c, p => {
      const sw = mvG(p, { px: 0, py: -352, y: [[0, -140], [tu(.05), -140], [tu(.4), 0, 'out']], r: [[0, 0], [tu(.3), 0], [tu(.55), -7, 'out'], [tu(.85), 4, 'io'], [tu(1.15), -1.5, 'io'], [tu(1.4), 0, 'soft']], o: [[0, 0], [tu(.05), 0], [tu(.12), 1]] });
      [[-1], [1]].forEach(([s]) => { sw.line(s * 175, -352, s * 28, -196, W(2.6)); sw.line(s * 140, -352, s * 6, -196, W(2.6)); });
      R(sw, -34, -200, 68, 42, 8, F(2.8)); sw.circle(0, -146, 13, W(3));
      R(sw, -205, -128, 410, 420, 26, F(3.6)); R(sw, -44, -108, 88, 16, 8, W(2));
      R(sw, -100, -76, 200, 196, 18, F(2.6));
      whoAt(c, sw, S0, 0, 22, 152);
      if (S0.label) txt(popW(sw, 0, 165, aH(.04)), S0.label, 0, 180, { size: 44, maxW: 360, weight: 700, color: C.ink });
      tagsAt(sw, S0, 0, S0.label ? 238 : 190, { lo: -190, hi: 190 });
    }); });

  /* 04 ── WINDOWS: the block of flats rises; windows flicker on one after another as the evening comes, and on the keyword the one window
     with the person in it lights up and stays; the label hangs under it */
  variant('windows', 'ตึกไฟติดบานเดียว', (d, c) => { const S0 = st(d), cols = [-225, -75, 75, 225], rows = [-215, -45, 125], wx = 75, wy = -45, T0 = T0f();
    art(c, p => {
      drawAt(p.line(-480, 300, 480, 300, S(2)), p, 0, tu(.4));
      const B = inG(p, 'rise', 0, 300, 0); R(B, -350, -318, 700, 26, 6, F(2.8)); R(B, -330, -292, 660, 592, 6, F(3.4)); R(B, -55, 205, 110, 95, 6, F(2.8));
      const cr = crowdG(p), seq = [[-225, 125], [225, -215], [-75, -215], [225, 125], [-225, -45]];
      rows.forEach((y, ri) => cols.forEach((x, ci) => { const lit = x === wx && y === wy, g = lit ? atG(p, tu(.2)) : atG(cr, tu(.2 + .03 * (ri * 4 + ci)));
        R(g, x - 55, y - 55, 110, 110, 6, F(2.6)); g.line(x - 66, y + 62, x + 66, y + 62, W(3)); if (!lit) bust(g, x, y + 22, .66);
        const k = seq.findIndex(([a, b]) => a === x && b === y);
        if (k >= 0) { const t = T0 + (Z.H - T0) * (k + .3) / (seq.length + .5); const fl = sub(g); on(fl, p, 0, { o: [[0, 0], [t, 0], [t + tu(.05), .9], [t + tu(.25), .9], [t + tu(.35), 0]] }); R(fl, x - 55, y - 55, 110, 110, 6, { fill: LIT, sw: 2.6 }); }
        if (lit) R(litG(p, Z.H - tu(.04)), x - 55, y - 55, 110, 110, 6, { fill: LIT, sw: 3.4 }); }));
      whoAt(c, p, S0, wx, wy, 96); labTags(p, S0, wx, 44, { size: 26, tsize: 21, row: true, lo: -320, hi: 320 });
    }); });

  /* 05 ── QUEUE: the queue shuffles in, the "now serving" screen flips to the kind on the keyword, and that one appears on the spot in front */
  variant('queue', 'จอเรียกคิว', (d, c) => { const S0 = st(d), T0 = T0f();
    art(c, p => {
      const D = inG(p, 'drop', 0, -240, 0);
      D.line(-150, -350, -150, -300, W(2.4)); D.line(150, -350, 150, -300, W(2.4));
      R(D, -240, -300, 480, 124, 16, F(3.4)); R(D, -218, -284, 436, 92, 8, { fill: GLASS, sw: 2 });
      if (S0.label) { const fl = mvG(D, { px: 0, py: -238, sy: [[0, 0], [Z.H - tu(.12), 0], [Z.H, 1.08, 'out'], [aH(.1), 1, 'soft']], o: [[0, 0], [Z.H - tu(.12), 0], [Z.H - tu(.1), 1]] });
        txt(fl, S0.label, 0, -222, { size: 46, maxW: 400, weight: 700, color: C.ink }); }
      tagsAt(p, S0, 0, -130, { size: 28, lo: -300, hi: 300 });
      drawAt(p.line(-480, 292, 480, 292, S(2)), p, 0, tu(.4)); p.ellipse(-60, 286, 110, 14, W(2.4));
      const cr = crowdG(clipG(p, -500, -350, 1000, 700)), sl = sub(cr); on(sl, p, 0, { x: sweep(T0, Z.H, [260, 0], 0) });
      [160, 255, 350, 445].forEach((x, i) => stand(inC(sl, i, x, 292, 'rise'), x, 292, .82));
      haloH(p, -60, 150, 115); whoAt(c, p, S0, -60, 150, 175);
    }); });

  /* 06 ── NAMEPLATE: the desk and chair come in, the nameplate is set down; on the keyword the person takes the chair and the kind
     appears on the plate; the tag cards pop up on the desk */
  variant('nameplate', 'ป้ายชื่อตั้งโต๊ะ', (d, c) => { const S0 = st(d);
    art(c, p => {
      const B = inG(p, 'rise', 0, 300, 0); R(B, -125, -250, 250, 270, 46, F(3)); R(B, -440, 90, 880, 26, 6, F(3.2)); R(B, -405, 116, 24, 184, 4, F(2.6)); R(B, 381, 116, 24, 184, 4, F(2.6));
      whoAt(c, p, S0, 0, -112, 200);
      const pl = inG(p, 'drop', 0, 90, tu(.35)); shape(pl, [[-190, 90], [190, 90], [172, -4], [-172, -4]], F(3.2)); pl.line(-174, 6, 174, 6, W(1.8));
      if (S0.label) { const fl = mvG(pl, { px: 0, py: 50, sx: [[0, 0], [Z.H - tu(.1), 0], [Z.H + tu(.08), 1, 'out']], o: [[0, 0], [Z.H - tu(.1), 0], [Z.H - tu(.08), 1]] }); txt(fl, S0.label, 0, 64, { size: 44, maxW: 320, weight: 700, color: C.ink }); }
      S0.tags.forEach((t, i) => { const x = i ? 320 : -320, g = sub(popW(p, x, 58, aH(.12 + .06 * i)), { transform: `translate(${x} 58)` }); chip(g, t, { size: 26, strong: false, maxW: 180 }); });
    }); });

  /* 07 ── GROUP PHOTO: the photo drops in and settles; on the keyword a marker circles one face, the arrow is drawn down to the label */
  variant('photo', 'รูปหมู่วงตัว', (d, c) => { const S0 = st(d), wx = 75, wy = 50;
    art(c, p => {
      const P = mvG(p, { px: 0, py: -30, y: [[0, -60], [tu(.4), 0, 'out']], r: [[0, -5], [tu(.4), 1.5, 'out'], [tu(.6), 0, 'soft']], o: [[0, 0], [tu(.1), 1]] });
      R(P, -430, -272, 860, 476, 10, F(3.6)); R(P, -402, -244, 804, 388, 4, { fill: GLASS, sw: 0, stroke: 'none' });
      const cr = crowdG(P); [-300, -150, 0, 150, 300].forEach((x, i) => bust(atG(cr, tC(i + 2)), x, -78, .95)); [-375, -225, -75, 225, 375].forEach((x, i) => bust(atG(cr, tC(i + 3)), x, 72, 1));
      whoAt(c, p, S0, wx, wy, 138, { t: tu(.62) });
      const e = rot(p, -6, wx, wy - 4); drawAt(e.ellipse(wx, wy - 4, 104, 98, W(4.5)), p, Z.H - tu(.22), tu(.34));
      drawAt(p.path(`M 205 236 Q 168 200 150 140`, W(3)), p, aH(.08), tu(.2)); drawAt(p.poly([[136, 158], [150, 138], [164, 160]], W(3)), p, aH(.24), tu(.1));
      labTags(p, S0, 205, 256, { size: 34, tsize: 26, row: true, lo: -420, hi: 480, t: aH(.2) });
    }); });

  /* 08 ── SEATS: the rows fill up from the back; a soft light runs along the front row and on the keyword one seat lights up — the person
     sits in it; the callout pops above */
  variant('seats', 'ที่นั่งโรงละคร', (d, c) => { const S0 = st(d), rows = [-110, 30, 170], cols = [-375, -225, -75, 75, 225, 375], wx = 75, wy = -110, T0 = T0f();
    const chair = (q, x, y, o) => q.path(`M ${x - 60} ${y + 48} L ${x - 60} ${y - 26} Q ${x - 60} ${y - 62} ${x - 24} ${y - 62} L ${x + 24} ${y - 62} Q ${x + 60} ${y - 62} ${x + 60} ${y - 26} L ${x + 60} ${y + 48} Z`, o);
    art(c, p => {
      const cr = crowdG(p);
      rows.forEach((y, ri) => cols.forEach((x, ci) => { const me = x === wx && y === wy, g = me ? atG(p, tu(.15)) : inG(cr, 'rise', x, y + 48, tu(.12 + .08 * ri + .02 * ci));
        if (!me) g.circle(x, y - 84, 30, F(3)); chair(g, x, y, F(3)); g.line(x - 44, y - 30, x + 44, y - 30, W(1.6));
        if (ri === 0) { const t = T0 + (Z.H - T0) * (ci + .5) / 7; if (!me) { const fl = sub(g); on(fl, p, 0, { o: [[0, 0], [t, 0], [t + tu(.06), .8], [t + tu(.18), .8], [t + tu(.3), 0]] }); chair(fl, x, y, { fill: LIT, sw: 3 }); } }
        if (me) { chair(litG(g, Z.H - tu(.04)), x, y, { fill: LIT, sw: 3.4 }); g.line(x - 44, y - 30, x + 44, y - 30, W(1.6)); } }));
      whoAt(c, p, S0, wx, wy - 38, 122);
      shape(popW(p, wx, -215, aH(.02)), [[wx - 14, -224], [wx + 14, -224], [wx, -206]], SOLID(1.6));
      labTags(p, S0, wx, -258, { size: 32, tsize: 24, row: true, lo: -480, hi: 480 });
    }); });

  /* 09 ── PAWNS: the pawns drop onto the board one by one; on the keyword one place rises off the board — the person on its base */
  variant('pawns', 'หมากบนกระดาน', (d, c) => { const S0 = st(d), fy = 168;
    const pawn = (q, x) => { q.ellipse(x, fy, 42, 10, F(2.6)); R(q, x - 42, fy - 22, 84, 22, 8, F(2.8));
      q.path(`M ${x - 34} ${fy - 22} Q ${x - 12} ${fy - 70} ${x - 14} ${fy - 110} L ${x + 14} ${fy - 110} Q ${x + 12} ${fy - 70} ${x + 34} ${fy - 22} Z`, F(2.8));
      q.ellipse(x, fy - 112, 30, 8, F(2.6)); q.circle(x, fy - 146, 30, F(3)); };
    art(c, p => {
      const B = inG(p, 'rise', 0, 200, 0);
      shape(B, [[-440, 190], [440, 190], [400, 150], [-400, 150]], F(2.6)); R(B, -440, 190, 880, 42, 8, F(3.2));
      for (let k = 0; k < 11; k++) if (k % 2) R(B, -440 + k * 80, 196, 80, 30, 2, { fill: GLASS, sw: 0, stroke: 'none' });
      const cr = crowdG(p); [-360, -240, -120, 140, 260, 380].forEach((x, i) => pawn(inC(cr, i + 2, x, fy, 'drop'), x));
      atG(p, tu(.3)).ellipse(10, fy, 42, 10, S(2));
      haloH(p, 10, -40, 130);
      const up = { y: [[0, 128], [Z.H - tu(.42), 128], [Z.H, 0, 'out'], [aH(.1), 6, 'io'], [aH(.22), 0, 'soft']] }, bs = mvG(p, Object.assign({ px: 10, py: 40, o: [[0, 0], [Z.H - tu(.44), 0], [Z.H - tu(.4), 1]] }, up));
      bs.ellipse(10, 40, 72, 16, F(3)); R(bs, 10 - 72, 26, 144, 14, 7, F(2.6));
      whoAt(c, p, S0, 10, -50, 160, { t: Z.H - tu(.42), mv: up }); labTags(p, S0, 10, -235, { size: 34, tsize: 26, row: true, lo: -480, hi: 480 });
    }); });

  /* 10 ── TURNSTILE: people wait on one side; the lamp turns on, the arm turns and the person comes through to the other side on the keyword */
  variant('turnstile', 'ประตูหมุน', (d, c) => { const S0 = st(d);
    art(c, p => {
      drawAt(p.line(-480, 290, 480, 290, S(2)), p, 0, tu(.4));
      const cr = crowdG(p); [-450, -355, -260].forEach((x, i) => stand(inC(cr, i, x, 290, 'rise'), x, 290, .9));
      const B = inG(p, 'rise', -130, 290, tu(.1)); R(B, -190, 70, 120, 220, 16, F(3.4)); B.circle(-130, 104, 17, F(2.6)); B.line(-170, 150, -90, 150, W(1.8));
      litG(B, Z.H - tu(.5)).circle(-130, 104, 17, { fill: LIT, sw: 2.6 });
      const arm = mvG(B, { px: -70, py: 125, r: [[0, 0], [Z.H - tu(.34), 0], [Z.H - tu(.04), 75, 'io'], [aH(.18), 0, 'out']] }); R(arm, -72, 118, 150, 14, 7, F(2.6));
      R(B, -84, 140, 14, 90, 7, F(2.4)); B.circle(-70, 125, 20, F(3));
      haloH(p, 220, 150, 115);
      whoAt(c, p, S0, 220, 150, 185, { t: Z.H - tu(.42), mv: { x: [[0, -330], [Z.H - tu(.42), -330], [Z.H, 0, 'out']], o: [[0, 0], [Z.H - tu(.42), 0], [Z.H - tu(.36), 1]] } });
      labTags(p, S0, 220, -62, { size: 34, tsize: 26, dy: 56, lo: 0, hi: 490 });
    }); });

  /* 11 ── GUIDE SIGN: the people come in, the guide's pole rises; on the keyword the sign flips round to show the kind and the group is
     under it; the sign sways a little */
  variant('guideflag', 'ป้ายไกด์ชูนำกลุ่ม', (d, c) => { const S0 = st(d), sx = 150;
    art(c, p => {
      drawAt(p.line(-480, 292, 480, 292, S(2)), p, 0, tu(.4));
      const bk = sub(p), cr = crowdG(p); [[-420, {}], [-300, { arm: RELAX }], [310, { leg: STANCE }], [425, { arm: RELAX }]].forEach(([x, pose], i) => crowdPerson(inC(bk, i, x, 292, 'rise'), inC(cr, i, x, 292, 'rise'), x, 292, .74, pose));
      const PL = mvG(p, { px: sx, py: 260, y: [[0, 300], [tu(.35), 300], [tu(.75), 0, 'out']], o: [[0, 0], [tu(.35), 0], [tu(.4), 1]] });
      const sw2 = mvG(PL, { px: sx, py: 260, r: [[0, 0], [aH(.1), 0], [aH(.35), 2.5, 'io'], [aH(.65), -1.5, 'io'], [aH(.9), 0, 'soft']] });
      R(sw2, sx - 6, -180, 12, 440, 5, F(2.2));
      const fl = mvG(sw2, { px: sx, py: -230, sx: [[0, .06], [Z.H - tu(.14), .06], [Z.H + tu(.06), 1.04, 'out'], [aH(.18), 1, 'soft']] });
      if (S0.label) { const g = sub(fl, { transform: `translate(${sx} -230)` }), t = txt(g, S0.label, 0, 15, { size: 42, maxW: 520, weight: 700, color: C.ink }), w = Math.max(160, t.getBBox().width + 60);
        g.g.insertBefore(g.rect(f1(-w / 2), -48, f1(w), 96, { rx: 16, fill: C.fill, sw: 3.4 }), t); }
      else R(fl, sx - 80, -278, 160, 96, 16, F(3.4));
      tagsAt(p, S0, sx, -138, { lo: -460, hi: 470 });
      whoAt(c, p, S0, -40, 150, 230);
    }); });

  /* 12 ── INTERCOM: the panel comes up; the buttons light one after another down the list (looking), and on the keyword the right one stays
     lit, its slot shows the kind and the camera screen shows the person */
  variant('intercom', 'แผงกริ่งหน้าตึก', (d, c) => { const S0 = st(d), rows = [10, 82, 154, 226], me = 1, T0 = T0f();
    art(c, p => {
      const B = inG(p, 'pop', 0, 0, 0); R(B, -235, -318, 470, 636, 26, F(3.6)); R(B, -185, -278, 370, 216, 14, { fill: GLASS, sw: 2.4 });
      [-40, 0, 40].forEach(x => B.line(x - 14, 290, x + 14, 290, W(2.4)));
      const cr = crowdG(p), seq = [0, 2, 3, 2, 0];
      rows.forEach((y, i) => { const q = i === me ? atG(p, tC(i + 2)) : atG(cr, tC(i + 2)); R(q, -195, y - 27, 290, 54, 10, F(2.4)); q.circle(152, y, 25, F(2.6));
        seq.forEach((r2, k) => { if (r2 !== i) return; const t = T0 + (Z.H - T0) * (k + .3) / (seq.length + .4), fl = sub(q); on(fl, p, 0, { o: [[0, 0], [t, 0], [t + tu(.04), 1], [t + tu(.14), 1], [t + tu(.22), 0]] }); fl.circle(152, y, 25, { fill: LIT, sw: 2.6 }); });
        if (i === me) q.circle(152, y, 25, F(2.6)); });
      litG(p, Z.H - tu(.04)).circle(152, rows[me], 25, { fill: LIT, sw: 3 });
      if (S0.label) txt(popW(p, -50, rows[me], Z.H), S0.label, -50, rows[me] + 11, { size: 30, maxW: 260, weight: 700, color: C.ink });
      whoAt(c, p, S0, 0, -192, 116); tagsAt(p, S0, 0, -96, { size: 24, lo: -180, hi: 180 });
    }); });

  /* 13 ── RING TOSS: the figures stand on the stand, two rings miss and drop; the last ring flies in on an arc and lands over one of them
     on the keyword */
  variant('ringtoss', 'ห่วงโยนลงตัว', (d, c) => { const S0 = st(d), wx = 60, ry = 180, T0 = T0f();
    const t1 = Z.H, t0 = Math.max(T0, Z.H - tu(.6)), N = 14, KX = [[0, -440 - wx], [t0, -440 - wx]], KY = [[0, -170 - ry], [t0, -170 - ry]];
    for (let j = 1; j <= N; j++) { const u = j / N, t = t0 + (t1 - t0) * u, x = lerp(-440, wx, u), y = lerp(-170, ry, u) - 150 * Math.sin(Math.PI * u) * (1 - u * .35); KX.push([t, f1(x - wx)]); KY.push([t, f1(y - ry)]); }
    KY.push([aH(.06), -14, 'out'], [aH(.16), 0, 'in']);
    const ringK = { px: wx, py: ry, x: KX, y: KY, o: [[0, 0], [t0, 0], [t0 + tu(.04), 1]] };
    art(c, p => {
      R(inG(p, 'rise', 0, 262, 0), -450, 250, 900, 24, 6, F(3));
      const cr = crowdG(p); [-390, -280, -170, 290, 400].forEach((x, i) => stand(inC(cr, i, x, 250, 'rise'), x, 250, .85));
      [[-220, 238], [340, 240]].forEach(([x, y], i) => { const g = inG(p, 'drop', x, y, tu(.5 + .2 * i)); g.ellipse(x, y, 58, 12, { sw: 11 }); g.ellipse(x, y, 58, 12, { sw: 5, stroke: C.fill }); });
      const rb = mvG(p, ringK); rb.path(`M ${wx - 118} ${ry} A 118 28 0 0 1 ${wx + 118} ${ry}`, { sw: 11 }); rb.path(`M ${wx - 118} ${ry} A 118 28 0 0 1 ${wx + 118} ${ry}`, { sw: 5, stroke: C.fill });
      haloH(p, wx, 120, 120); whoAt(c, p, S0, wx, 118, 180, { t: tC(2) }); labTags(p, S0, wx, -78, { size: 34, tsize: 26, dy: 56 });
    });
    over(c, p => { const rf = mvG(p, ringK); rf.path(`M ${wx - 118} ${ry} A 118 28 0 0 0 ${wx + 118} ${ry}`, { sw: 11 }); rf.path(`M ${wx - 118} ${ry} A 118 28 0 0 0 ${wx + 118} ${ry}`, { sw: 5, stroke: C.fill }); }); });

  /* 14 ── MIRROR: the mirror swings upright on its stand; on the keyword the person appears in the glass, then the kind is stuck on it
     and the tags are pinned beside it */
  variant('mirror', 'กระจกส่องตัว', (d, c) => { const S0 = st(d);
    art(c, p => {
      const St = inG(p, 'rise', 0, 300, 0); St.line(0, 214, -130, 300, W(3)); St.line(0, 214, 130, 300, W(3)); R(St, -9, 180, 18, 48, 4, F(2.4));
      const M = mvG(p, { px: 0, py: 200, r: [[0, -9], [tu(.15), -9], [tu(.5), 3, 'out'], [tu(.75), -1.2, 'io'], [tu(.95), 0, 'soft']], o: [[0, 0], [tu(.1), 0], [tu(.2), 1]] });
      M.ellipse(0, -50, 205, 255, F(3.6)); M.ellipse(0, -50, 182, 230, { fill: GLASS, sw: 0, stroke: 'none' }); M.line(-120, -210, -60, -250, W(1.6));
      whoAt(c, p, S0, 0, -88, 220);
      if (S0.label) chipRow(popW(p, 0, 112, aH(.04)), [[S0.label, { size: 38 }]], 0, 112, { lo: -175, hi: 175 });
      S0.tags.forEach((t, i) => { const x = i ? 345 : -345, g = sub(popW(p, x, -50, aH(.14 + .06 * i)), { transform: `translate(${x} -50)` }); chip(g, t, { size: 26, strong: false, maxW: 200 }); });
    }); });

  /* 15 ── CAPSULE TOY: the knob turns, the capsules tumble, one capsule rolls out of the chute to the right; on the keyword its lid pops
     open and the person rises out of it */
  variant('gacha', 'ตู้กาชาปอง', (d, c) => { const S0 = st(d), T0 = T0f(), tr0 = Math.max(T0 + tu(.4), Z.H - tu(.55)), tr1 = Z.H - tu(.08);
    art(c, p => {
      drawAt(p.line(-480, 292, 480, 292, S(2)), p, 0, tu(.4));
      const B = inG(p, 'pop', -160, 100, 0); R(B, -205, -296, 90, 26, 8, F(2.6)); B.circle(-160, -112, 162, F(3.4));
      const cr = crowdG(p), tb = mvG(cr, { px: -160, py: -112, r: [[0, 0], [T0, 0], [T0 + tu(.15), 8, 'io'], [T0 + tu(.3), -6, 'io'], [T0 + tu(.45), 4, 'io'], [T0 + tu(.6), 0, 'soft']] });
      [[-245, -40], [-160, -18], [-75, -40], [-205, -125], [-115, -128], [-160, -205], [-250, -190], [-70, -200]].forEach(([x, y], i) => { const g = inC(tb, i, x, y); g.circle(x, y, 38, F(2.6)); g.line(x - 38, y, x + 38, y, W(1.8)); });
      R(B, -305, 44, 290, 248, 18, F(3.4)); B.circle(-160, 122, 42, F(3));
      const kn = mvG(B, { px: -160, py: 122, r: [[0, 0], [T0, 0], [T0 + tu(.4), 180, 'io']] }); R(kn, -204, 114, 88, 16, 8, F(2.4));
      R(B, -212, 198, 104, 64, 12, F(2.8));
      const N = 12, KX = [[0, -430], [tr0, -430]], KR = [[0, -300], [tr0, -300]];
      for (let j = 1; j <= N; j++) { const u = j / N, e = 1 - Math.pow(1 - u, 2.2); KX.push([tr0 + (tr1 - tr0) * u, f1(-430 * (1 - e))]); KR.push([tr0 + (tr1 - tr0) * u, f1(-300 * (1 - e))]); }
      const cap = mvG(p, { px: 270, py: 160, x: KX, o: [[0, 0], [tr0, 0], [tr0 + tu(.03), 1]] }), roll = mvG(cap, { px: 270, py: 160, r: KR });
      const ld = mvG(roll, { px: 270, py: 110, y: [[0, 92], [Z.H - tu(.05), 92], [aH(.12), 0, 'out']], r: [[0, 24], [Z.H - tu(.05), 24], [aH(.12), 0, 'back']] });
      rot(ld, -24, 270, 105).path('M 178 110 A 92 92 0 0 1 362 110 Z', F(3));
      haloH(p, 270, 120, 112); roll.path('M 176 202 A 94 94 0 0 0 364 202 Z', F(3.2));
      whoAt(c, p, S0, 270, 122, 150, { t: Z.H - tu(.02), mv: { y: [[0, 60], [Z.H - tu(.02), 60], [aH(.2), 0, 'out']] } }); labTags(p, S0, 270, -45, { size: 32, tsize: 24, dy: 52, lo: 30, hi: 490, t: aH(.12) });
    }); });

  /* 16 ── PAPER CHAIN: the paper dolls unfold from both ends toward the middle; on the keyword the person appears in the gap, hand in hand */
  variant('paperchain', 'ตุ๊กตากระดาษจูงมือ', (d, c) => { const S0 = st(d), ny = -60, T0 = T0f();
    const doll = (q, x) => { q.path(rpoly([[-22, 0], [-95, 22], [-95, 50], [-32, 42], [-44, 160], [-12, 160], [0, 96], [12, 160], [44, 160], [32, 42], [95, 50], [95, 22], [22, 0]].map(([a, b]) => [x + a, ny + b]), 8), F(3)); q.circle(x, ny - 36, 34, F(3)); };
    art(c, p => {
      const cr = crowdG(p), ord = { '-390': 0, '390': 0, '-215': 1, '215': 1 };
      [-390, -215, 215, 390].forEach(x => { const k = ord[x], t = Math.min(tu(.15) + tu(.4) * k, Z.H - tu(.4)), anc = x < 0 ? x - 95 : x + 95;
        doll(mvG(cr, { px: anc, py: 0, sx: [[0, 0], [t, 0], [t + tu(.28), 1.04, 'out'], [t + tu(.38), 1, 'soft']], o: [[0, 0], [t, 0], [t + tu(.02), 1]] }), x); });
      haloH(p, 0, 20, 125); whoAt(c, p, S0, 0, 22, 205); labTags(p, S0, 0, 172, { size: 36, tsize: 26, dy: 56 });
    }); });

  /* 17 ── STICKER SHEET: the stickers pop onto the sheet; on the keyword one is peeled off and lifted to the side, growing — it is the person;
     its spot is left empty */
  variant('stickers', 'แผ่นสติกเกอร์ลอก', (d, c) => { const S0 = st(d), cols = [-350, -200, -50], rows = [-130, 0, 130], t0 = Z.H - tu(.5);
    const pk = { x: [[0, -520], [t0, -520], [Z.H, 0, 'io']], y: [[0, 60], [t0, 60], [Z.H, 0, 'io']], s: [[0, .53], [t0, .53], [t0 + tu(.12), .6, 'out'], [Z.H, 1, 'io'], [aH(.1), 1.04, 'out'], [aH(.22), 1, 'soft']] };
    art(c, p => {
      R(inG(p, 'pop', -145, 0, 0), -450, -232, 610, 464, 18, F(3.2));
      const cr = crowdG(p);
      rows.forEach((y, ri) => cols.forEach((x, ci) => { if (x === -200 && y === 0) { atG(p, t0).circle(x, y, 58, S(2)); return; } const g = inC(cr, ri * 3 + ci, x, y); g.circle(x, y, 58, F(2.6)); bust(g, x, y + 10, .6); }));
      const mv = mvG(p, Object.assign({ px: 320, py: -60, o: [[0, 0], [tu(.3), 0], [tu(.36), 1]] }, pk)), rr = mvG(mv, { px: 320, py: -60, r: [[0, 8], [t0, 8], [Z.H, 0, 'io']] });
      const st2 = rot(rr, -8, 320, -60); st2.circle(320, -60, 110, F(3.6)); st2.path('M 228 0 Q 262 -6 270 -40 Q 236 -30 228 0 Z', F(2.4));
      whoAt(c, p, S0, 320, -60, 150, { t: tu(.32), mv: { x: pk.x, y: pk.y, s: pk.s } }); labTags(p, S0, 320, 102, { size: 32, tsize: 24, dy: 52, lo: 160, hi: 492 });
    }); });

  /* 18 ── CONTACTS: the tablet comes up, the kind is typed into the search bar, the list settles, and on the keyword one row is picked out —
     the person with the tags */
  variant('contacts', 'รายชื่อค้นหา', (d, c) => { const S0 = st(d), rows = [-105, 0, 105, 205], me = 1, T0 = T0f();
    art(c, p => {
      const B = inG(p, 'pop', 0, 0, 0); R(B, -380, -300, 760, 600, 38, F(3.6)); R(B, -345, -266, 690, 532, 18, { fill: GLASS, sw: 0, stroke: 'none' });
      R(B, -300, -232, 600, 68, 34, F(2.6));
      if (S0.label) { const cl = clipG(p, -290, -232, 580, 68), ty = sub(cl); on(ty, p, 0, { x: [[0, -600], [T0, -600], [T0 + tu(.5), 0, 'out']] }); txt(ty, S0.label, 0, -186, { size: 34, maxW: 520, weight: 700, color: C.ink }); }
      const cr = crowdG(p);
      rows.forEach((y, i) => { if (i === me) return; const g = mvG(cr, { y: [[0, 30], [T0 + tu(.3 + .06 * i), 30], [T0 + tu(.6 + .06 * i), 0, 'out']], o: [[0, 0], [tu(.2), 0], [tu(.3), 1]] });
        g.circle(-262, y, 34, F(2.4)); bust(g, -262, y + 8, .42); g.line(-200, y - 10, 120, y - 10, S(5)); g.line(-200, y + 18, 20, y + 18, S(4)); });
      R(litG(p, Z.H - tu(.06)), -322, rows[me] - 50, 644, 100, 20, { fill: GLASS, sw: 3.2 });
      whoAt(c, p, S0, -262, rows[me], 84);
      if (S0.tags.length) tagsAt(p, S0, 40, rows[me], { t: aH(.06), lo: -200, hi: 310 });
      else drawAt(p.line(-200, rows[me], 120, rows[me], W(5)), p, aH(.04), tu(.25));
    }); });

  /* 19 ── SPIN THE BOTTLE: the people sit down around; the bottle spins, slows down and stops pointing at one of them on the keyword */
  variant('bottle', 'ขวดหมุนชี้', (d, c) => { const S0 = st(d), Rr = 236, A0 = -30, pos = a => [Rr * Math.cos(rad(a)), 10 + Rr * Math.sin(rad(a))], T0 = T0f();
    art(c, p => {
      drawAt(p.circle(0, 10, 170, S(1.6)), p, 0, tu(.5));
      const cr = crowdG(p);
      for (let k = 1; k < 8; k++) { const [x, y] = pos(A0 + k * 45); bust(inC(cr, k, x, y), x, y, .78); }
      const N = 20, KR = [[0, -900], [T0, -900]]; for (let j = 1; j <= N; j++) { const u = j / N; KR.push([T0 + (Z.H - T0) * u, f1(-900 * Math.pow(1 - u, 2.6))]); }
      KR.push([aH(.08), 3, 'out'], [aH(.2), 0, 'soft']);
      const sp = mvG(p, { px: 0, py: 10, r: KR, o: [[0, 0], [tu(.25), 0], [tu(.35), 1]] }), b = rot(sp, A0, 0, 10);
      R(b, -96, -26, 150, 72, 32, F(3.2)); R(b, 50, -6, 70, 32, 12, F(2.8)); R(b, 116, -9, 22, 38, 6, F(2.6)); b.line(-70, 10, 30, 10, W(1.6));
      const [wx, wy] = pos(A0); haloH(p, wx, wy, 85); whoAt(c, p, S0, wx, wy, 128);
      labTags(p, S0, 300, -298, { size: 32, tsize: 24, dy: 52, lo: 60, hi: 492 });
    }); });

  /* 20 ── SHOP WINDOW: the window comes in, the dress forms are set out one by one; on the keyword the person rises onto the stand in the
     middle and the label drops in above like a hanging sign */
  variant('showcase', 'ตู้โชว์หุ่น', (d, c) => { const S0 = st(d);
    const form = (q, x) => { q.ellipse(x, 252, 40, 8, F(2.4)); q.line(x, 252, x, 120, W(3));
      q.path(`M ${x - 46} -40 Q ${x - 60} 20 ${x - 30} 50 Q ${x - 60} 95 ${x - 52} 120 L ${x + 52} 120 Q ${x + 60} 95 ${x + 30} 50 Q ${x + 60} 20 ${x + 46} -40 Q ${x} -60 ${x - 46} -40 Z`, F(3));
      R(q, x - 9, -66, 18, 22, 4, F(2.4)); q.circle(x, -92, 28, F(3)); };
    art(c, p => {
      const B = inG(p, 'pop', 0, 0, 0); R(B, -440, -330, 880, 44, 8, F(3)); R(B, -440, -286, 880, 556, 8, F(3.4)); R(B, -410, -256, 820, 496, 4, { fill: GLASS, sw: 0, stroke: 'none' }); R(B, -460, 270, 920, 30, 6, F(3));
      const cr = crowdG(p); [-310, -165, 165, 310].forEach((x, i) => form(inC(cr, i + 2, x, 252, 'rise'), x));
      R(inG(p, 'pop', 0, 224, tu(.35)), -95, 196, 190, 56, 10, F(3)); haloH(p, 0, 50, 125);
      whoAt(c, p, S0, 0, 52, 215, { t: Z.H - tu(.36), mv: { y: [[0, 120], [Z.H - tu(.36), 120], [Z.H, 0, 'out']], s: [[0, .4], [Z.H - tu(.36), .4], [Z.H, 1, 'out']] } });
      const hg = mvG(p, { px: 0, py: -200, y: [[0, -90], [aH(.02), -90], [aH(.2), 0, 'out'], [aH(.3), -6, 'io'], [aH(.4), 0, 'soft']], o: [[0, 0], [aH(.02), 0], [aH(.06), 1]] });
      labTags(hg, S0, 0, -200, { size: 36, tsize: 26, dy: 56, lo: -400, hi: 400, t: aH(.02) });
    }); });

  /* ---------- redesign options for 14 — round 2 (user 2026-11-13: the mirror "เหมือนลูกโป่ง" → round 1 cheval / vanity / globe not taken,
     "Redesign เลยได้ไหม" → a pop-up box was drawn, "มันมีแบบนี้แล้วนิ" (B08 12 popup, and 15 gacha opens the same way) → dropped →
     three objects not used in any category so far, "วาดมาให้ผมเลือก"). Temporary: the pick moves into V ---------- */
  const ALT = [], altV = (id, th, build) => ALT.push({ id, th, build });
  /* A ── FERRIS WHEEL: people ride in the cabins; the wheel turns, slows and stops with one cabin at the bottom — that one lights up */
  altV('ferris', 'ชิงช้าสวรรค์', (d, c) => { const S0 = st(d), T0 = T0f(), ox = -80, oy = -125, Rw = 205, A = k => 90 + 45 * k, pos = a => [ox + Rw * Math.cos(rad(a)), oy + Rw * Math.sin(rad(a))];
    const D = 225, N = 24, tA = j => T0 + (Z.H - T0) * j / N, dl = j => D * Math.pow(1 - j / N, 2.2);       // degrees still to turn
    const trK = k => { const [fx, fy] = pos(A(k)), KX = [[0, 0], [T0, 0]], KY = [[0, 0], [T0, 0]];
      for (let j = 0; j <= N; j++) { const [x, y] = pos(A(k) - dl(j)); KX.push([tA(j), f1(x - fx)]); KY.push([tA(j), f1(y - fy)]); } return { x: KX, y: KY }; };
    art(c, p => {
      drawAt(p.line(-480, 292, 480, 292, S(2)), p, 0, tu(.4));
      const L = inG(p, 'rise', ox, 292, 0); L.line(ox, oy, ox - 190, 292, W(5)); L.line(ox, oy, ox + 190, 292, W(5));
      const wh = mvG(p, { px: ox, py: oy, r: [[0, -D], [T0, -D]].concat([...Array(N + 1)].map((_, j) => [tA(j), f1(-dl(j))])), o: [[0, 0], [tu(.1), 0], [tu(.2), 1]] });
      wh.circle(ox, oy, Rw, { sw: 3.4 }); wh.circle(ox, oy, Rw - 26, S(1.8)); for (let k = 0; k < 4; k++) { const [x1, y1] = pos(45 * k), [x2, y2] = pos(45 * k + 180); wh.line(x1, y1, x2, y2, W(2)); }
      wh.circle(ox, oy, 22, F(3));
      const cr = crowdG(p);
      for (let k = 0; k < 8; k++) { const [x, y] = pos(A(k)), me = k === 0, g = mvG(me ? p : cr, Object.assign({ o: [[0, 0], [tC(k), 0], [tC(k) + tu(.08), 1]] }, trK(k)));
        const cw = me ? 136 : 104, chh = me ? 110 : 84; g.line(x, y, x, y + 16, W(2.4)); g.circle(x, y, 6, SOLID()); R(g, x - cw / 2, y + 16, cw, chh, 14, F(3)); g.line(x - cw / 2, y + 16 + chh * .36, x + cw / 2, y + 16 + chh * .36, W(1.6));
        if (me) R(litG(g, Z.H - tu(.04)), x - cw / 2, y + 16, cw, chh, 14, { fill: LIT, sw: 3.2 }); else bust(g, x, y + 60, .42); }
      const [cx, cy] = pos(A(0)); haloH(p, cx, cy + 68, 92);
      whoAt(c, p, S0, cx, cy + 68, 112, { t: tC(0), mv: trK(0) });
      labTags(p, S0, 330, 150, { size: 32, tsize: 24, dy: 52, lo: 170, hi: 492 });
    }); });
  /* B ── ESCALATOR: people ride up an escalator; on the keyword the one we mean steps off at the top landing — the label pops under them */
  altV('escalator', 'บันไดเลื่อน', (d, c) => { const S0 = st(d), T0 = T0f(), P0 = [-430, 272], P1 = [170, -150], at2 = u => [lerp(P0[0], P1[0], u), lerp(P0[1], P1[1], u)];
    art(c, p => {
      drawAt(p.line(-480, 292, 480, 292, S(2)), p, 0, tu(.4));
      const E = inG(p, 'rise', 0, 292, 0);
      E.path(`M -470 292 L -400 292 L 200 -130 L 470 -130 L 470 -100 L 230 -100 L -330 292 Z`, F(3));
      E.path(`M ${P0[0] - 40} ${P0[1] - 120} L ${P1[0] - 40} ${P1[1] - 120} L ${P1[0] + 30} ${P1[1] - 120}`, { sw: 9 }); E.path(`M ${P0[0] - 40} ${P0[1] - 120} L ${P1[0] - 40} ${P1[1] - 120} L ${P1[0] + 30} ${P1[1] - 120}`, { sw: 3, stroke: C.fill });
      E.path(`M ${P0[0] - 40} ${P0[1] - 112} L ${P1[0] - 40} ${P1[1] - 112} L ${P1[0] + 20} ${P1[1] - 112} L ${P1[0] + 20} ${P1[1]} L ${P0[0]} ${P0[1]} Z`, { fill: GLASS, sw: 0, stroke: 'none' });
      let st2 = `M ${P0[0]} ${P0[1]}`; for (let k = 1; k <= 12; k++) { const [x, y] = at2(k / 12), [xp, yp] = at2((k - 1) / 12); st2 += ` L ${f1(xp + (x - xp) * .15)} ${f1(y)} L ${f1(x)} ${f1(y)}`; } E.path(st2, W(2.4));
      R(E, 200, -150, 280, 20, 4, F(2.8));
      const cr = crowdG(clipG(p, -500, -350, 1000, 700));
      [.18, .45, .72].forEach((u, i) => { const [fx, fy] = at2(u), du = .16, [sx0, sy0] = at2(u - du), g = mvG(cr, { x: [[0, f1(sx0 - fx)], [T0, f1(sx0 - fx)], [Z.H, 0, 'io']], y: [[0, f1(sy0 - fy)], [T0, f1(sy0 - fy)], [Z.H, 0, 'io']], o: [[0, 0], [tC(i), 0], [tC(i) + tu(.08), 1]] });
        stand(g, fx, fy, .62); });
      haloH(p, 345, -225, 95);
      whoAt(c, p, S0, 345, -225, 150, { t: Z.H - tu(.34), mv: { x: [[0, -150], [Z.H - tu(.34), -150], [Z.H, 0, 'out']], y: [[0, 20], [Z.H - tu(.34), 20], [Z.H - tu(.17), -14, 'out'], [Z.H, 0, 'in']] } });
      labTags(p, S0, 335, -40, { size: 32, tsize: 24, dy: 52, lo: 190, hi: 492 });
    }); });
  /* C ── PHOTO BOOTH: two people wait outside a photo booth; the flash goes off behind the curtain, the curtain is pulled open on the
     keyword — the person is inside — and the photo strip slides out of the side with the label over it */
  altV('photobooth', 'ตู้ถ่ายรูป', (d, c) => { const S0 = st(d);
    art(c, p => {
      drawAt(p.line(-480, 292, 480, 292, S(2)), p, 0, tu(.4));
      const bk = sub(p), cr = crowdG(p); [[-430, {}], [-320, { arm: RELAX }]].forEach(([x, pose], i) => crowdPerson(inC(bk, i, x, 292, 'rise'), inC(cr, i, x, 292, 'rise'), x, 292, .62, pose));
      const B = inG(p, 'rise', 0, 292, 0); R(B, -195, -285, 375, 577, 14, F(3.6)); R(B, -195, -285, 375, 62, 14, F(3)); B.circle(-10, -254, 16, F(2.6));
      R(B, -165, -200, 255, 445, 6, { fill: C.fill, sw: 2.4 }); B.line(-170, -200, 95, -200, W(4));
      const fl = sub(B); on(fl, p, 0, { o: [[0, 0], [Z.H - tu(.45), 0], [Z.H - tu(.42), 1], [Z.H - tu(.3), 0], [Z.H - tu(.24), 1], [Z.H - tu(.12), 0]] }); R(fl, -165, -200, 255, 445, 6, { fill: LIT, sw: 0, stroke: 'none' });
      R(B, -80, 150, 110, 16, 6, F(2.6)); B.line(-25, 166, -25, 245, W(4)); R(B, 150, 92, 12, 50, 3, F(2.4));
      whoAt(c, p, S0, -35, 40, 175);
      const cu = mvG(B, { px: -165, py: 0, sx: [[0, 1], [Z.H - tu(.08), 1], [aH(.2), .17, 'io']] });
      R(cu, -165, -196, 255, 440, 4, F(2.8)); [-115, -65, -15, 35].forEach(x => cu.line(x, -186, x, 234, W(1.6)));
      const sc = clipG(p, 160, -350, 340, 700), sl = mvG(sc, { x: [[0, -320], [aH(.05), -320], [aH(.4), 0, 'out']] });
      R(sl, 160, 70, 320, 94, 6, F(2.8)); [0, 1, 2].forEach(k => { const x = 178 + k * 100; R(sl, x, 82, 84, 70, 4, k === 0 ? { fill: LIT, sw: 2 } : S(1.8)); bust(sl, x + 42, 125, .38, k === 0 ? { fill: LIT, sw: 2.4 } : S(1.6)); });
      labTags(p, S0, 330, -40, { size: 32, tsize: 24, dy: 52, lo: 190, hi: 492, t: aH(.3) });
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
  G.cats.B10 = { variants: V, ALT, drawAlt: (k, d, c) => { setZ(c); CUR = ALT[k].id; ALT[k].build(d, c); }, SAMPLES, STRESS, draw: (i, d, c) => { setZ(c); CUR = V[i].id; V[i].build(d, c); }, CLAMPS, timing: c => (setZ(c), Object.assign({}, Z)) };
})();
