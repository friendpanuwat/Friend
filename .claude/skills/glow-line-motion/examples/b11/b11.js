/* b11.js — category B11 "คำพูด / แชต / คอมเมนต์ / รีวิว": 20 neutral designs — STILL DRAFTS (round 1, waiting for the user's pick).
   Kind of design: everyday things with a real mechanism that carry / show a message, all objects new (none used in an earlier category —
   user: "ไม่ต้อง copy reference นะ ห้ามเลย"; checked against every category's list in HANDOFF, cut rounds included).
   Slots (CutPack CATEGORIES.md B11 — references/cutpack-CATEGORIES.md, cat_ai.py): kind chat | comment | review | message · quote (≤ 12 letters,
   as said, may be missing) · mood good | bad · react icon (optional) · gone (nobody answers). The message is drawn in the neutral form of its
   kind by msg() (bubble · comment card · five-star card · letter in an envelope — no real app look); gone = "seen" ticks + an empty reply box.
   GL.cats.B11.draw(i, data, { x, y, s, at, hit, speed }) — canvas 1000 × 700 centred at (0,0); hit = seconds after `at` (default 1.8).
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
  /* kind: chat | comment | review | message · quote (≤ 12 letters, as said; may be missing) · mood good | bad (optional) ·
     react: a reaction icon (optional; a name with no icon → the mood's face) · gone: nobody answers */
  const KINDS = ['chat', 'comment', 'review', 'message'];
  function st(d) { const kind = KINDS.includes(d.kind) ? d.kind : 'chat', mood = d.mood === 'good' || d.mood === 'bad' ? d.mood : null, gone = d.gone === true;
    const react = !gone && d.react && picOf({ icon: d.react }) ? d.react : !gone && mood ? (mood === 'good' ? 'smile' : 'frown') : null;
    return { kind, quote: String(d.quote || '').trim(), mood, react, gone }; }
  const V = [];
  const variant = (id, th, build) => V.push({ id, th, build });
  const halo = (q, x, y, r) => { q.circle(x, y, r, { fill: 'rgba(255,255,255,.06)', sw: 0, stroke: 'none' }); q.circle(x, y, r, S(1.8)); };
  const pathOf = (pts, close = true) => 'M ' + pts.map(([x, y]) => f1(x) + ' ' + f1(y)).join(' L ') + (close ? ' Z' : '');
  const shape = (q, pts, o) => q.path(pathOf(pts), o);
  const SOLID = (w = 2) => ({ fill: C.ink, sw: w });
  let CID = 0;
  function clipG(p, x, y, w, h) { const svg = p.g.ownerSVGElement, cp = document.createElementNS(NS, 'clipPath'), r = document.createElementNS(NS, 'rect');
    cp.id = 'b11clip' + (++CID); Object.entries({ x, y, width: w, height: h }).forEach(([k, v]) => r.setAttribute(k, v)); cp.appendChild(r);
    (svg.querySelector('defs') || svg).appendChild(cp); return sub(p, { 'clip-path': `url(#${cp.id})` }); }
  function bust(q, x, y, k = 1, o = F(3)) { q.path(`M ${f1(x - 44 * k)} ${f1(y + 44 * k)} L ${f1(x - 44 * k)} ${f1(y + 22 * k)} Q ${f1(x - 44 * k)} ${f1(y - 8 * k)} ${f1(x)} ${f1(y - 8 * k)} Q ${f1(x + 44 * k)} ${f1(y - 8 * k)} ${f1(x + 44 * k)} ${f1(y + 22 * k)} L ${f1(x + 44 * k)} ${f1(y + 44 * k)} Z`, o);
    q.circle(x, y - 38 * k, 24 * k, o); }
  const starD = (x, y, r) => pathOf([...Array(10)].map((_, i) => { const a = rad(-90 + i * 36), rr = i % 2 ? r * .45 : r; return [x + rr * Math.cos(a), y + rr * Math.sin(a)]; }));

  /* ---------- the message, in the form of its kind (neutral forms, no real app) ----------
     chat = a bubble with a tail · comment = a card with a plain avatar and a name line · review = a card with five stars (good 5 · bad 1 ·
     no mood: outlines) · message = a letter in an envelope. The quote is written on it (no quote → two plain lines).
     The reaction (react icon or the mood's face) sits on its corner; gone → no reaction: "seen" ticks and an empty reply box under it. */
  function msgH(kind, w) { return w * (kind === 'chat' ? .4 : kind === 'comment' ? .44 : kind === 'review' ? .5 : .56); }
  function msg(q, c, S0, x, y, w, o = {}) { const k = S0.kind, h = msgH(k, w), x0 = x - w / 2, x1 = x + w / 2, y0 = y - h / 2, y1 = y + h / 2, sz = o.size || w * .11;
    const words = (cx, cy, mw, anchor = 'middle') => { if (S0.quote) txt(q, S0.quote, cx, cy + sz * .35, { size: sz, maxW: mw, weight: 700, color: C.ink, anchor, wrap: 'mid' });
      else { const a = anchor === 'start' ? cx : cx - mw * .4; q.line(a, cy - sz * .3, a + mw * .8, cy - sz * .3, S(5)); q.line(a, cy + sz * .4, a + mw * .5, cy + sz * .4, S(5)); } };
    if (k === 'chat') { const r = h * .32, t0 = x0 + w * .14, t1 = x0 + w * .3, tx = x0 + w * .07, ty = y1 + h * .3;
      q.path(`M ${f1(x0 + r)} ${f1(y0)} L ${f1(x1 - r)} ${f1(y0)} Q ${f1(x1)} ${f1(y0)} ${f1(x1)} ${f1(y0 + r)} L ${f1(x1)} ${f1(y1 - r)} Q ${f1(x1)} ${f1(y1)} ${f1(x1 - r)} ${f1(y1)} L ${f1(t1)} ${f1(y1)} L ${f1(tx)} ${f1(ty)} L ${f1(t0)} ${f1(y1)} L ${f1(x0 + r)} ${f1(y1)} Q ${f1(x0)} ${f1(y1)} ${f1(x0)} ${f1(y1 - r)} L ${f1(x0)} ${f1(y0 + r)} Q ${f1(x0)} ${f1(y0)} ${f1(x0 + r)} ${f1(y0)} Z`, F(3.4));
      words(x, y, w * .82); }
    else if (k === 'comment') { R(q, x0, y0, w, h, 18, F(3.4)); const ax = x0 + h * .34; q.circle(ax, y, h * .24, F(2.6)); bust(q, ax, y + h * .06, h * .24 / 62, F(2.2));
      q.line(ax + h * .36, y - h * .22, ax + h * .36 + w * .22, y - h * .22, S(4)); words(ax + h * .36, y + h * .1, x1 - ax - h * .36 - 24, 'start');
      const ix = x1 - w * .2, iy = y1 - h * .17, u = w * .02;                                                                   // like + reply marks
      q.path(`M ${f1(ix)} ${f1(iy + u)} C ${f1(ix - u * 2.4)} ${f1(iy - u * .6)}, ${f1(ix - u)} ${f1(iy - u * 2)}, ${f1(ix)} ${f1(iy - u * .7)} C ${f1(ix + u)} ${f1(iy - u * 2)}, ${f1(ix + u * 2.4)} ${f1(iy - u * .6)}, ${f1(ix)} ${f1(iy + u)} Z`, S(1.8));
      R(q, ix + u * 3, iy - u * 1.3, u * 3.2, u * 2.2, u * .9, S(1.8)); }
    else if (k === 'review') { R(q, x0, y0, w, h, 18, F(3.4)); const n = S0.mood === 'good' ? 5 : S0.mood === 'bad' ? 1 : 0, sp = w * .135, sy = y0 + h * .3;
      for (let i = 0; i < 5; i++) q.path(starD(x + (i - 2) * sp, sy, w * .05), i < n ? SOLID(2) : F(2.4)); words(x, y0 + h * .7, w * .84); }
    else { R(q, x0, y0, w, h, 10, F(3.2)); R(q, x - w * .4, y0 - h * .36, w * .8, h * .82, 8, F(2.6)); words(x, y0 - h * .02, w * .7);
      q.path(`M ${f1(x0)} ${f1(y0 + h * .3)} L ${f1(x)} ${f1(y0 + h * .66)} L ${f1(x1)} ${f1(y0 + h * .3)} L ${f1(x1)} ${f1(y1)} L ${f1(x0)} ${f1(y1)} Z`, F(3.4));
      q.line(x0 + 10, y1 - 10, x - 30, y0 + h * .78, S(1.6)); q.line(x1 - 10, y1 - 10, x + 30, y0 + h * .78, S(1.6));
      R(q, x1 - w * .17, y1 - h * .3, w * .11, h * .22, 4, F(2)); R(q, x1 - w * .155, y1 - h * .275, w * .08, h * .17, 3, S(1.4)); }
    const bx = x1 - w * .04, by = (k === 'message' ? y0 - h * .36 : y0) + 4, br = w * .1;
    if (S0.react) { halo(q, bx, by, br * 1.5); q.circle(bx, by, br, F(3)); const a = c.at || 0; G.art(picOf({ icon: S0.react }), { x: c.x + bx * c.s, y: c.y + by * c.s, w: br * 1.35 * c.s, at: a + tu(.12), speed: Z.sp }); }
    if (S0.gone) { const sy = (k === 'chat' ? y1 + h * .3 : y1) + 34;
      [0, 18].forEach(dx => q.poly([[x1 - 70 + dx, sy], [x1 - 60 + dx, sy + 10], [x1 - 42 + dx, sy - 10]], S(3)));
      R(q, x1 - w * .45 - 90, sy - 24, w * .34, 48, 24, S(1.8)); }
    return { h, top: k === 'message' ? y0 - h * .36 : y0, bot: k === 'chat' ? y1 + h * .3 : y1 }; }

  /* 01 ── PNEUMATIC TUBE: a capsule shoots down the tube into the station, it opens on the tray and the message comes out of it */
  variant('tube', 'ท่อส่งแคปซูล', (d, c) => { const S0 = st(d), tD = 'M -310 -345 L -310 22';
    art(c, p => {
      p.line(-480, 292, 480, 292, S(2)); p.path(tD, { sw: 48 }); p.path(tD, { sw: 38, stroke: C.fill });
      R(p, -400, 20, 180, 170, 14, F(3.4)); R(p, -372, 48, 124, 72, 8, { fill: GLASS, sw: 2 }); R(p, -430, 190, 240, 18, 6, F(2.8));
      p.line(-390, 208, -390, 292, W(3)); p.line(-230, 208, -230, 292, W(3));
      R(p, -395, 158, 74, 32, 16, F(2.8)); R(p, -312, 158, 74, 32, 16, F(2.8)); p.line(-358, 158, -358, 190, W(1.6)); p.line(-275, 158, -275, 190, W(1.6));
      R(p, -338, -262, 56, 20, 6, F(2.6)); R(p, -338, -92, 56, 20, 6, F(2.6)); p.line(-246, 136, -246, 170, W(3)); p.circle(-238, 36, 6, F(2));
      msg(p, c, S0, 200, 60, 420);
    }); });

  /* 02 ── MAILBOX: a letterbox on a post — the message arrives, the door drops open and it comes out; the flag is up (gone: down) */
  variant('mailbox', 'ตู้จดหมายมีธง', (d, c) => { const S0 = st(d);
    art(c, p => {
      p.line(-480, 292, 480, 292, S(2)); R(p, -223, 58, 28, 234, 4, F(2.8));
      p.path('M -385 60 L -385 -100 A 70 70 0 0 1 -315 -170 L -105 -170 A 70 70 0 0 1 -35 -100 L -35 60 Z', F(3.6)); p.line(-385, -60, -35, -60, S(1.6));
      R(p, -35, 44, 150, 16, 6, F(2.8));
      if (S0.gone) { R(p, -140, -110, 14, 70, 4, F(2.4)); R(p, -140, -54, 92, 14, 4, F(2.4)); }
      else { R(p, -140, -290, 14, 150, 4, F(2.6)); R(p, -140, -290, 92, 52, 6, F(3)); }
      R(p, -247, 280, 76, 12, 4, F(2.4)); p.circle(-35, 52, 6, F(2)); R(p, 100, 26, 12, 20, 3, F(2)); p.circle(-133, S0.gone ? -104 : -148, 6, F(2));
      msg(p, c, S0, 270, -70, 400);
    }); });

  /* 03 ── TIN-CAN PHONE: two cans on a taut string — the message travels along it and arrives above; gone: the string hangs slack */
  variant('tincan', 'โทรศัพท์กระป๋อง', (d, c) => { const S0 = st(d);
    art(c, p => {
      const can = (sd) => { const x = sd * 390; R(p, x - 60, -10, 120, 120, 12, F(3.2)); p.line(x - 60, 20, x + 60, 20, S(1.6)); p.line(x - 60, 80, x + 60, 80, S(1.6)); p.ellipse(x - sd * 60, 50, 18, 60, F(3)); };
      can(-1); can(1);
      if (S0.gone) p.path('M -330 50 Q 0 260 330 50', S(2.4)); else p.line(-330, 50, 330, 50, W(2.4));
      [-1, 1].forEach(sd => { p.ellipse(sd * 450, 50, 14, 60, S(1.8)); p.circle(sd * 330, 50, 6, SOLID()); });
      msg(p, c, S0, 0, -150, 380);
    }); });

  /* 04 ── DRONE: a delivery drone flies the message in and hangs it on its line */
  variant('drone', 'โดรนส่งข้อความ', (d, c) => { const S0 = st(d);
    art(c, p => {
      [-1, 1].forEach(sd => { p.line(sd * 60, -262, sd * 190, -276, W(5)); R(p, sd * 190 - 9, -300, 18, 30, 4, F(2.4)); p.ellipse(sd * 190, -304, 70, 10, F(2.6)); p.line(sd * 40, -232, sd * 64, -208, W(3)); });
      R(p, -80, -284, 160, 52, 18, F(3.4)); p.circle(0, -258, 10, W(2.4)); p.line(-80, -206, 80, -206, W(3));
      const m = st(d); const hh = msgH(m.kind, 420), top = 30 - hh / 2 - (m.kind === 'message' ? hh * .36 : 0);
      p.line(0, -232, 0, top, W(2.4));
      [-1, 1].forEach(sd => { p.circle(sd * 190, -304, 7, SOLID()); p.line(sd * 64 - 14, -208, sd * 64 + 14, -208, W(3)); }); p.path('M -26 -232 A 26 22 0 0 0 26 -232 Z', F(2.4)); p.circle(0, -222, 7, W(1.6)); p.line(-56, -272, -30, -272, S(1.6)); p.line(30, -272, 56, -272, S(1.6));
      msg(p, c, S0, 0, 30, 420);
    }); });

  /* 05 ── MICROPHONE: a microphone on a stand — the words come out of it as the message, with two sound rings */
  variant('mic', 'ไมโครโฟนตั้งพื้น', (d, c) => { const S0 = st(d);
    art(c, p => {
      p.line(-480, 292, 480, 292, S(2)); p.ellipse(-280, 286, 92, 14, F(2.8)); R(p, -288, -40, 16, 326, 4, F(2.6));
      p.line(-280, -40, -200, -130, W(5)); const mh = rot(p, 38, -180, -160); R(mh, -218, -235, 76, 120, 38, F(3.4)); [-205, -185, -165].forEach(y => mh.line(-210, y, -150, y, S(1.6)));
      [70, 110].forEach(r => p.path(`M ${-130 + r * .5} ${-230 - r * .3} A ${r} ${r} 0 0 1 ${-130 + r * .75} ${-150 + r * .2}`, S(2.4)));
      p.circle(-280, -40, 12, F(2.6)); p.circle(-202, -128, 9, F(2.4)); p.path('M -212 -116 Q -250 -60 -262 0 L -262 278', S(1.8)); p.ellipse(-280, 280, 44, 6, S(1.6));
      msg(p, c, S0, 210, -60, 400);
    }); });

  /* 06 ── DESK PHONE: the phone rings, the handset lifts and the message comes through (gone: it rings out, the handset stays down) */
  variant('deskphone', 'โทรศัพท์ตั้งโต๊ะ', (d, c) => { const S0 = st(d), up = !S0.gone;
    art(c, p => {
      R(p, -470, 240, 940, 22, 6, F(3)); p.path('M -390 240 L -350 100 Q -340 80 -310 80 L -150 80 Q -120 80 -110 100 L -70 240 Z', F(3.6));
      for (let r = 0; r < 2; r++) for (let k = 0; k < 3; k++) R(p, -300 + k * 56, 140 + r * 46, 40, 30, 8, F(2.2));
      const hs = up ? rot(p, -24, -230, 10) : sub(p), hy = up ? -40 : 30;
      R(hs, -360, hy, 260, 30, 15, F(3)); R(hs, -400, hy + 10, 82, 42, 16, F(3)); R(hs, -142, hy + 10, 82, 42, 16, F(3));
      p.path(up ? 'M -100 200 C -20 200, -20 120, -60 60 C -90 20, -120 40, -110 0' : 'M -80 200 Q -40 210 -50 240', W(2)); if (!up) [[-420, 60], [-50, 60]].forEach(([x, y], i) => [0, 1, 2].forEach(k => p.line(x + (i ? 1 : -1) * k * 14, y - 20 + k * 20, x + (i ? 1 : -1) * (k * 14 + 22), y - 20 + k * 20, S(2.4))));
      R(p, -326, 66, 20, 16, 4, F(2.2)); R(p, -154, 66, 20, 16, 4, F(2.2)); R(p, -290, 100, 120, 26, 6, { fill: GLASS, sw: 1.8 });
      msg(p, c, S0, 230, -60, 400);
    }); });

  /* 07 ── POSTCARD RACK: a turning rack of cards — one card is pulled out and shown: the message */
  variant('postcards', 'ชั้นหมุนโปสการ์ด', (d, c) => { const S0 = st(d), tiers = [-200, -40, 120];
    art(c, p => {
      p.line(-480, 292, 480, 292, S(2)); R(p, -262, -300, 14, 560, 4, F(2.6)); p.ellipse(-255, 284, 110, 14, F(2.8)); p.circle(-255, -306, 12, F(2.6));
      tiers.forEach((y, ti) => [-1, 1].forEach(sd => { const x = -255 + sd * 85, out = ti === 1 && sd === 1;
        if (!out) R(p, x - 62, y - 60, 124, 110, 6, F(2.4)); R(p, x - 72, y, 144, 64, 6, F(3)); }));
      R(p, -282, -320, 54, 14, 5, F(2.4)); tiers.forEach((y, ti) => { p.circle(-255, y + 30, 9, F(2.2)); [-1, 1].forEach(sd => { const x = -255 + sd * 85; if (!(ti === 1 && sd === 1)) R(p, x - 46, y - 50, 92, 36, 4, S(1.4)); }); });
      msg(p, c, S0, 230, -40, 400);
    }); });

  /* 08 ── SATELLITE DISH: a dish on a pole catches the signal coming down; the message pops up beside it */
  variant('dish', 'จานดาวเทียม', (d, c) => { const S0 = st(d);
    art(c, p => {
      p.line(-480, 292, 480, 292, S(2)); R(p, -308, 60, 16, 232, 4, F(2.6)); p.ellipse(-300, 286, 80, 12, F(2.6));
      const g = rot(p, -35, -300, 40); g.path('M -470 40 Q -300 190 -130 40 Q -300 90 -470 40 Z', F(3.4)); g.line(-300, 100, -300, -60, W(3)); R(g, -318, -86, 36, 30, 6, F(2.6));
      [40, 80, 120].forEach(r => p.path(`M ${-60 - r * .9} ${-250 + r * .15} A ${r} ${r} 0 0 0 ${-60 + r * .2} ${-250 + r * .9}`, S(2.4)));
      g.line(-430, 52, -305, -62, S(1.8)); g.line(-170, 52, -295, -62, S(1.8)); R(p, -322, 40, 44, 28, 6, F(2.4)); p.path('M -294 70 Q -270 180 -290 288', S(1.6));
      msg(p, c, S0, 230, 60, 400);
    }); });

  /* 09 ── ANSWERING MACHINE: its lamp blinks — a new message; play, the reels turn, the message is heard (gone: the lamp stays dark) */
  variant('answering', 'เครื่องตอบรับ', (d, c) => { const S0 = st(d);
    art(c, p => {
      R(p, -470, 240, 940, 22, 6, F(3)); R(p, -440, 40, 330, 200, 20, F(3.6)); R(p, -410, 70, 170, 80, 10, { fill: GLASS, sw: 2.2 }); ring(p, -370, 110, 26, 9, F(2.6)); ring(p, -280, 110, 26, 9, F(2.6));
      [0, 1, 2].forEach(k => R(p, -410 + k * 62, 176, 48, 34, 8, F(2.4))); [0, 1, 2].forEach(k => p.line(-200, 80 + k * 22, -140, 80 + k * 22, S(2)));
      p.circle(-160, 190, 16, S0.gone ? F(2.4) : { fill: LIT, sw: 2.6 }); if (!S0.gone) halo(p, -160, 190, 34);
      [-370, -280].forEach(x => p.line(x - 16, 110, x + 16, 110, S(1.4))); p.line(-370, 136, -280, 136, S(1.6)); p.path('M -110 200 Q -60 214 -40 240', W(2));
      msg(p, c, S0, 200, -60, 420);
    }); });

  /* 10 ── BANNER PLANE: a small plane tows the message across the sky on its line */
  variant('bannerplane', 'เครื่องบินลากป้าย', (d, c) => { const S0 = st(d);
    art(c, p => {
      p.path('M -460 -200 Q -440 -232 -380 -232 L -250 -228 L -200 -268 L -176 -268 L -196 -222 L -176 -218 Q -170 -196 -196 -192 L -390 -184 Q -450 -182 -460 -200 Z', F(3.4));
      p.path('M -360 -206 L -300 -140 L -276 -140 L -300 -206 Z', F(2.8)); R(p, -400, -224, 40, 16, 6, W(1.8));
      p.ellipse(-466, -202, 6, 34, F(2.4)); p.circle(-462, -202, 6, SOLID());
      const m = msgH(S0.kind, 420), top = -40 - m / 2;
      p.path(`M -178 -205 Q -120 -170 ${30 - 210} ${top + 10}`, W(2)); p.line(-180, top + 10, -180, top + m * .5, S(1.6));
      p.line(-330, -186, -330, -162, W(2.4)); p.circle(-330, -152, 10, F(2.4)); p.line(-204, -262, -198, -224, S(1.6));
      msg(p, c, S0, 30, -40, 420);
    }); });

  /* 11 ── ORDER RAIL: cards slide along a rail on clips; the newest card is the message */
  variant('ticketrail', 'ราวหนีบการ์ด', (d, c) => { const S0 = st(d), rail = -262;
    art(c, p => {
      R(p, -470, rail - 10, 940, 20, 8, F(3)); [-420, 420].forEach(x => p.line(x, rail - 10, x, rail - 60, W(3)));
      [-400, -275].forEach(x => { p.circle(x, rail + 18, 12, F(2.6)); R(p, x - 52, rail + 30, 104, 150, 6, F(2.8)); [0, 1, 2].forEach(k => p.line(x - 34, rail + 70 + k * 30, x + 34 - k * 14, rail + 70 + k * 30, S(3))); });
      const m = msgH(S0.kind, 420), top = 10 - m / 2 - (S0.kind === 'message' ? m * .36 : 0); p.circle(190, rail + 18, 14, F(2.8)); p.line(190, rail + 32, 190, top, W(2.4));
      [-470, 470].forEach(x => p.circle(x, rail, 12, F(2.4))); [-400, -275, 190].forEach(x => p.line(x - 7, rail + 12, x + 7, rail + 26, S(1.4)));
      msg(p, c, S0, 190, 10, 420);
    }); });

  /* 12 ── WATCH: a wrist watch laid out with its strap — the message lights up its screen */
  variant('watch', 'นาฬิกาข้อมือแจ้งเตือน', (d, c) => { const S0 = st(d);
    art(c, p => {
      R(p, -150, -350, 300, 140, 30, F(3)); R(p, -150, 210, 300, 140, 30, F(3));
      R(p, -230, -230, 460, 460, 92, F(3.8)); R(p, -200, -200, 400, 400, 70, { fill: GLASS, sw: 0, stroke: 'none' }); R(p, 228, -70, 28, 70, 8, F(2.6));
      R(p, -160, 244, 320, 18, 6, F(2.2)); R(p, -70, 300, 140, 40, 10, F(2.4)); p.line(0, 300, 0, 340, W(2)); R(p, 228, 20, 22, 40, 8, F(2.2));
      msg(p, c, S0, 0, -10, 320, { size: 34 });
    }); });

  /* 13 ── BILLBOARD: a billboard on legs by the road — the message is pasted up on it, the lamps above light it */
  variant('billboard', 'ป้ายโฆษณาริมทาง', (d, c) => { const S0 = st(d);
    art(c, p => {
      p.line(-480, 292, 480, 292, S(2)); R(p, -250, 70, 24, 222, 4, F(2.6)); R(p, 226, 70, 24, 222, 4, F(2.6)); R(p, -440, 62, 880, 16, 4, F(2.6));
      R(p, -420, -300, 840, 362, 10, F(3.6)); [-240, 240].forEach(x => { p.line(x, -300, x, -326, W(2.4)); p.line(x, -326, x + 40, -326, W(2.4)); R(p, x + 30, -334, 34, 16, 6, F(2.4)); });
      p.line(266, 80, 266, 292, S(1.8)); p.line(296, 80, 296, 292, S(1.8)); [120, 170, 220, 270].forEach(y => p.line(266, y, 296, y, S(1.6)));
      msg(p, c, S0, 0, -120, 420);
    }); });

  /* 14 ── MAIL SLOT: the flap of a mail slot in a wall — the message comes through and lands on the mat below */
  variant('mailslot', 'ช่องจดหมายที่ผนัง', (d, c) => { const S0 = st(d);
    art(c, p => {
      p.line(-480, 292, 480, 292, S(2)); R(p, -460, -330, 920, 500, 6, { fill: GLASS, sw: 0, stroke: 'none' }); p.line(-460, 170, 460, 170, W(2.4));
      R(p, -200, -290, 400, 100, 14, F(3.4)); R(p, -160, -260, 320, 34, 6, { fill: C.fill, sw: 2.4 }); shape(p, [[-160, -262], [160, -262], [176, -300], [-144, -300]], F(2.8));
      shape(p, [[-330, 292], [330, 292], [290, 250], [-290, 250]], F(2.8));
      p.circle(-180, -272, 5, F(1.6)); p.circle(180, -208, 5, F(1.6)); R(p, -460, 150, 920, 20, 2, F(2.2)); shape(p, [[-290, 284], [290, 284], [262, 258], [-262, 258]], S(1.6));
      msg(p, c, S0, 0, 40, 420);
    }); });

  /* 15 ── PIGEON: a pigeon flies in with the message on a string from its beak */
  variant('pigeon', 'นกพิราบส่งจดหมาย', (d, c) => { const S0 = st(d);
    art(c, p => {
      p.path('M -390 -196 L -462 -228 Q -470 -196 -462 -164 Z', F(2.8));                                                                  // tail fan
      p.path('M -400 -196 Q -380 -250 -290 -256 Q -210 -260 -186 -222 Q -200 -168 -290 -156 Q -370 -150 -400 -196 Z', F(3.2));          // body
      p.path('M -330 -240 Q -360 -330 -300 -350 Q -290 -318 -262 -320 Q -262 -292 -236 -290 Q -244 -262 -270 -246 Z', F(3));              // raised wing
      p.line(-300, -332, -282, -258, S(1.6)); p.line(-266, -306, -262, -254, S(1.6));
      p.circle(-182, -250, 30, F(3)); p.circle(-174, -256, 5, SOLID()); shape(p, [[-154, -252], [-128, -244], [-154, -236]], F(2.2));
      p.line(-300, -158, -300, -138, W(2.2)); p.line(-270, -158, -266, -138, W(2.2));
      const m = msgH(S0.kind, 400), top = 20 - m / 2 - (S0.kind === 'message' ? m * .36 : 0); p.path(`M -130 -242 Q -60 -160 ${30} ${f1(top)}`, W(2));
      p.circle(-174, -256, 10, S(1.4)); p.line(-394, -196, -456, -214, S(1.4)); p.line(-394, -196, -456, -180, S(1.4)); p.line(-300, -138, -310, -132, W(2)); p.line(-266, -138, -256, -132, W(2));
      msg(p, c, S0, 120, 20, 400);
    }); });

  /* 16 ── COMIC STRIP: three panels of a comic — in the last, big panel someone says the message */
  variant('comic', 'การ์ตูนช่อง', (d, c) => { const S0 = st(d);
    art(c, p => {
      R(p, -470, -300, 280, 285, 8, F(3.2)); R(p, -470, 15, 280, 285, 8, F(3.2)); R(p, -170, -300, 640, 600, 8, F(3.4));
      bust(p, -330, -110, 1.3); bust(p, -330, 210, 1.3); p.line(-380, -250, -280, -250, S(4)); bust(p, -40, 210, 1.9);
      p.line(-460, -54, -200, -54, S(1.6)); p.line(-460, 264, -200, 264, S(1.6)); [[-122, 84, -104, 100], [-100, 62, -92, 84], [-70, 56, -70, 80]].forEach(([a, b, c2, d2]) => p.line(a, b, c2, d2, W(2.4)));
      msg(p, c, S0, 200, -90, 400);
    }); });

  /* 17 ── FEEDBACK KIOSK: a stand with three face buttons — the one for the mood is pressed and the feedback card comes up */
  variant('feedback', 'ตู้กดประเมินหน้ายิ้ม', (d, c) => { const S0 = st(d), pick = S0.mood === 'good' ? 0 : S0.mood === 'bad' ? 2 : 1;
    art(c, p => {
      p.line(-480, 292, 480, 292, S(2)); R(p, -16, 190, 32, 102, 4, F(2.6)); p.ellipse(0, 286, 110, 14, F(2.8));
      shape(p, [[-260, 190], [260, 190], [230, 70], [-230, 70]], F(3.4));
      [-150, 0, 150].forEach((x, i) => { const y = 130, me = i === pick; p.circle(x, y, 44, me ? { fill: LIT, sw: 3.4 } : F(2.8)); if (me) halo(p, x, y, 64);
        p.circle(x - 15, y - 10, 5, SOLID()); p.circle(x + 15, y - 10, 5, SOLID());
        p.path(i === 0 ? `M ${x - 20} ${y + 10} Q ${x} ${y + 28} ${x + 20} ${y + 10}` : i === 2 ? `M ${x - 20} ${y + 22} Q ${x} ${y + 6} ${x + 20} ${y + 22}` : `M ${x - 18} ${y + 16} L ${x + 18} ${y + 16}`, W(3)); });
      p.line(-236, 84, 236, 84, S(1.6)); R(p, -120, 40, 240, 24, 8, F(2.2)); R(p, -24, 188, 48, 14, 4, F(2.2));
      msg(p, c, S0, 0, -115, 380);
    }); });

  /* 18 ── TELEPROMPTER: the prompter's glass on its tripod — the message rolls up on the glass */
  variant('prompter', 'เครื่องอ่านบท', (d, c) => { const S0 = st(d);
    art(c, p => {
      p.line(-480, 292, 480, 292, S(2)); p.line(0, 140, -170, 292, W(3.4)); p.line(0, 140, 170, 292, W(3.4)); p.line(0, 140, 0, 292, W(3.4)); R(p, -40, 112, 80, 30, 8, F(2.8));
      R(p, -300, -300, 600, 420, 18, F(3.6)); R(p, -272, -272, 544, 364, 8, { fill: GLASS, sw: 0, stroke: 'none' }); [-1, 1].forEach(sd => R(p, sd * 300 - (sd > 0 ? 0 : 26), -140, 26, 90, 8, F(2.6)));
      p.line(40, 126, 130, 150, W(3)); p.circle(134, 151, 8, F(2)); p.line(-88, 216, 88, 216, S(1.8)); [-1, 1].forEach(sd => p.circle(sd * 313, -95, 7, F(2)));
      msg(p, c, S0, 0, -100, 400);
    }); });

  /* 19 ── ROBOT: a little robot answers — its screen face, and the message beside it */
  variant('robot', 'หุ่นยนต์ตอบ', (d, c) => { const S0 = st(d);
    art(c, p => {
      p.line(-480, 292, 480, 292, S(2)); p.line(-260, -170, -260, -230, W(3)); p.circle(-260, -240, 12, F(2.6));
      R(p, -370, -170, 220, 160, 30, F(3.6)); R(p, -345, -145, 170, 110, 18, { fill: GLASS, sw: 2 });
      p.circle(-295, -100, 10, SOLID()); p.circle(-225, -100, 10, SOLID()); p.path('M -290 -66 Q -260 -50 -230 -66', W(3));
      R(p, -390, 10, 260, 200, 26, F(3.4)); R(p, -310, 50, 100, 60, 10, F(2.4)); [-1, 1].forEach(sd => R(p, -260 + sd * 150 - 16, 40, 32, 130, 16, F(2.8)));
      R(p, -370, 210, 220, 30, 10, F(2.8)); [-320, -200].forEach(x => p.circle(x, 262, 28, F(3)));
      [-376, -144].forEach(x => p.circle(x, -90, 10, F(2.4))); R(p, -290, -12, 60, 22, 4, F(2.2)); [-200, -168].forEach(x => p.circle(x, 152, 9, F(2))); [-320, -200].forEach(x => p.circle(x, 262, 7, SOLID()));
      msg(p, c, S0, 210, -90, 400);
    }); });

  /* 20 ── TV SET: an old TV switches on — the message is on its screen */
  variant('crt', 'โทรทัศน์จอตู้', (d, c) => { const S0 = st(d);
    art(c, p => {
      p.line(-480, 292, 480, 292, S(2)); p.line(-60, -262, -170, -340, W(2.4)); p.line(-40, -262, 70, -340, W(2.4)); p.ellipse(-50, -262, 40, 12, F(2.6));
      R(p, -360, -262, 640, 460, 34, F(3.6)); R(p, -330, -232, 460, 400, 40, { fill: GLASS, sw: 2.6 });
      ring(p, 205, -150, 34, 12, F(2.6)); ring(p, 205, -50, 26, 9, F(2.6)); [0, 1, 2, 3].forEach(k => p.line(170, 40 + k * 26, 240, 40 + k * 26, S(2)));
      [-1, 1].forEach(sd => p.line(-40 + sd * 250, 198, -40 + sd * 290, 292, W(3.4)));
      R(p, 178, 146, 54, 22, 6, F(2)); p.path('M 280 120 Q 330 180 320 290', W(2)); p.line(-90, 198, 10, 198, S(1.6));
      msg(p, c, S0, -100, -50, 380);
    }); });

  /* samples from unrelated topics (neutrality) + a stress set */
  const SAMPLES = [
    { say: 'ส่งข้อความผ่านท่อถึงฝ่ายบัญชี', kind: 'message', quote: 'บิลเดือนนี้', mood: 'good', react: 'check' },
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
  G.cats.B11 = { variants: V, SAMPLES, STRESS, draw: (i, d, c) => { setZ(c); CUR = V[i].id; V[i].build(d, c); }, CLAMPS, timing: c => (setZ(c), Object.assign({}, Z)) };
})();
