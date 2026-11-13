/* b11.js — category B11 "คำพูด / แชต / คอมเมนต์ / รีวิว": 20 neutral designs (round 2b stills approved, motion added).
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
  /* ---------- motion (CutPack B11: the message box pops in (or travels in with the thing's mechanism) → its words type in, or a reply is
     waited for → on the keyword the reaction pops, or the silence shows (the typing dots in the reply box go out) → hold) ---------- */
  const SMG = .8, sm = u => .5 - .5 * Math.cos(Math.PI * Math.pow(Math.min(1, Math.max(0, u)), SMG));
  const T0f = () => Math.max(tu(.55), Z.H - tu(1.2));
  /* a smooth trip through the values P between t0 and t1 (holding P[0] before) — keys relative to fin (B09 lesson: one continuous trip) */
  function sweep(t0, t1, P, fin, n = 20) { const lp = (a, b, k) => a + (b - a) * k, K = [[0, f1(P[0] - fin)], [t0, f1(P[0] - fin)]], m = P.length - 1;
    for (let j = 1; j <= n; j++) { const u = j / n, s2 = m * sm(u), g = Math.min(m - 1, Math.floor(s2)); K.push([t0 + (t1 - t0) * u, f1(lp(P[g], P[g + 1], s2 - g) - fin)]); } return K; }
  const atG = (q, t) => { const g = sub(q); atT(g, q, t); return g; };
  const smInv = f => Math.pow(Math.acos(1 - 2 * Math.min(1, Math.max(0, f))) / Math.PI, 1 / SMG);
  /* a buzz (a phone / a can / a walkie): quick side shakes at t */
  const buzzK = (t, a = 6) => [[0, 0], [t, 0], [t + tu(.03), -a], [t + tu(.06), a], [t + tu(.09), -a * .7], [t + tu(.12), a * .5], [t + tu(.16), 0]];
  /* keys that move a part along a polyline L (smooth: one trip, eased) and turn it to face the way it goes (r, relative to the last heading) */
  function pathK(L, t0, t1, fin, n = 28, endHead = null) { const seg = [], cum = [0]; for (let i = 1; i < L.length; i++) { const d = Math.hypot(L[i][0] - L[i - 1][0], L[i][1] - L[i - 1][1]); seg.push(d); cum.push(cum[i - 1] + d); }
    const tot = cum[cum.length - 1], at = dd => { let i = 1; while (i < cum.length - 1 && cum[i] < dd) i++; const u = (dd - cum[i - 1]) / (seg[i - 1] || 1); return [L[i - 1][0] + (L[i][0] - L[i - 1][0]) * u, L[i - 1][1] + (L[i][1] - L[i - 1][1]) * u, i]; };
    const head = i => Math.atan2(L[i][1] - L[i - 1][1], L[i][0] - L[i - 1][0]) * 180 / Math.PI, hEnd = endHead ?? head(L.length - 1), fade = u => endHead == null ? 1 : 1 - sm(Math.max(0, (u - .75) / .25));
    const K = { x: [[0, f1(L[0][0] - fin[0])], [t0, f1(L[0][0] - fin[0])]], y: [[0, f1(L[0][1] - fin[1])], [t0, f1(L[0][1] - fin[1])]], r: [[0, f1(Math.max(-60, Math.min(60, head(1) - hEnd)))], [t0, f1(Math.max(-60, Math.min(60, head(1) - hEnd)))]] };
    for (let j = 1; j <= n; j++) { const u = j / n, [x, y, i] = at(tot * sm(u)), t = t0 + (t1 - t0) * u; K.x.push([t, f1(x - fin[0])]); K.y.push([t, f1(y - fin[1])]); let dh = head(i) - hEnd; while (dh > 180) dh -= 360; while (dh < -180) dh += 360; K.r.push([t, f1(Math.max(-60, Math.min(60, dh)) * fade(u))]); }
    K.when = pt => { let best = 0, bd = 1e9; for (let i = 1; i < L.length; i++) { const d = Math.hypot(L[i][0] - pt[0], L[i][1] - pt[1]); if (d < bd) { bd = d; best = i; } } return t0 + (t1 - t0) * smInv(cum[best] / tot); };
    return K; }
  const drawAt = (el, q, t, dur) => on(el, q, t, { draw: [[0, 0], [dur ?? tu(.3), 1, 'out']] });
  function msgH(kind, w) { return w * (kind === 'chat' ? .4 : kind === 'comment' ? .44 : kind === 'review' ? .5 : .56); }
  /* o.t = when the box comes in (default tu .3) · o.mv = keys of the part it travels with (px / py = pivot, default its centre) */
  function msg(q, c, S0, x, y, w, o = {}) { const k = S0.kind, h = msgH(k, w), x0 = x - w / 2, x1 = x + w / 2, y0 = y - h / 2, y1 = y + h / 2, sz = o.size || w * .11;
    const t0 = o.t ?? tu(.3), tA = Math.max(t0 + tu(.3), T0f() - tu(.1)), tB = Math.max(tA + tu(.2), Z.H - tu(.14));
    const pro = !!o.pro;                                                                  // pro: bubble pop with overshoot, typing dots + caret, landing squash, reaction ripple
    q = o.mv ? mvG(q, Object.assign({ px: x, py: y, o: [[0, 0], [t0, 0], [t0 + tu(.05), 1]] }, o.mv))
      : pro ? mvG(q, { px: x, py: y + h / 2, s: [[0, .4], [t0, .4], [t0 + tu(.2), 1.08, 'out'], [t0 + tu(.32), .97, 'io'], [t0 + tu(.44), 1, 'soft']],
          y: [[0, 26], [t0, 26], [t0 + tu(.24), -5, 'out'], [t0 + tu(.38), 0, 'soft']], o: [[0, 0], [t0, 0], [t0 + tu(.05), 1]] }) : inG(q, 'pop', x, y, t0);
    if (pro && o.land != null) { const L = o.land; q = mvG(q, { px: x, py: y + h / 2, sx: [[0, 1], [L, 1], [L + tu(.06), 1.07, 'out'], [L + tu(.16), .98, 'io'], [L + tu(.26), 1, 'soft']],
      sy: [[0, 1], [L, 1], [L + tu(.06), .91, 'out'], [L + tu(.16), 1.03, 'io'], [L + tu(.26), 1, 'soft']] }); }
    const words = (cx, cy, mw, anchor = 'middle') => { const wg = sub(q);
      if (S0.quote) { txt(wg, S0.quote, cx, cy + sz * .35, { size: sz, maxW: mw, weight: 700, color: C.ink, anchor, wrap: 'mid' });
        const bb = wg.g.getBBox(), cv = sub(q); on(cv, q, 0, { ox: bb.x + bb.width + 6, oy: cy, sx: [[0, 1], [tA, 1], [tB, .001, 'lin']], o: [[0, 1], [tB, 1], [tB + tu(.01), 0]] });
        cv.rect(f1(bb.x - 6), f1(bb.y - 6), f1(bb.width + 12), f1(bb.height + 12), { fill: C.fill, sw: 0, stroke: 'none' });        // the words type in (a cover slides off)
        if (pro) { const xe = bb.x + bb.width + 4, cr = sub(q); on(cr, q, 0, { x: [[0, f1(-bb.width - 8)], [tA, f1(-bb.width - 8)], [tB, 0, 'lin']], o: [[0, 0], [tA, 0], [tA + tu(.01), 1], [tB + tu(.12), 1], [tB + tu(.2), 0], [tB + tu(.32), 1], [tB + tu(.42), 0]] });
          cr.line(f1(xe), f1(bb.y + 2), f1(xe), f1(bb.y + bb.height - 2), W(3));                                                     // caret runs with the typing, blinks, goes
          const dx = anchor === 'start' ? cx + 46 : cx, dg = sub(q); on(dg, q, 0, { o: [[0, 0], [t0 + tu(.16), 0], [t0 + tu(.22), 1], [tA, 1], [tA + tu(.05), 0]] });
          [-1, 0, 1].forEach(i => { const d1 = sub(dg); on(d1, q, t0 + tu(.16) + i * .1, { loop: .6, y: [[0, 0], [.15, -8, 'out'], [.3, 0, 'in'], [.6, 0]] }); d1.circle(dx + i * 22, cy, 6, SOLID()); }); } }
      else { const a = anchor === 'start' ? cx : cx - mw * .4; drawAt(wg.line(a, cy - sz * .3, a + mw * .8, cy - sz * .3, S(5)), q, tA, (tB - tA) * .6); drawAt(wg.line(a, cy + sz * .4, a + mw * .5, cy + sz * .4, S(5)), q, tA + (tB - tA) * .5, (tB - tA) * .5); } };
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
    if (S0.react) { const bg = sub(q); on(bg, q, 0, { ox: bx, oy: by, s: [[0, .3], [Z.H - tu(.04), .3], [aH(.12), 1.15, 'out'], [aH(.26), 1, 'soft']], o: [[0, 0], [Z.H - tu(.04), 0], [Z.H, 1]] });
      halo(bg, bx, by, br * 1.5); bg.circle(bx, by, br, F(3));
      if (pro) { const rp = sub(q); on(rp, q, 0, { ox: bx, oy: by, s: [[0, 1], [Z.H, 1], [aH(.45), 2.1, 'out']], o: [[0, 0], [Z.H, 0], [Z.H + tu(.02), .9], [aH(.45), 0]] }); rp.circle(bx, by, br * 1.1, W(2.2)); }
      const a = c.at || 0, ic = G.art(picOf({ icon: S0.react }), { x: c.x + bx * c.s, y: c.y + by * c.s, w: br * 1.35 * c.s, at: a + Z.H - tu(.02), speed: Z.sp }); }
    if (S0.gone) { const sy = (k === 'chat' ? y1 + h * .3 : y1) + 34, tk = atG(q, Math.min(tB, Z.H - tu(.5))), rb = atG(q, Math.min(tB, Z.H - tu(.5)) + tu(.1)), bx0 = x1 - w * .45 - 90 + w * .17;
      [0, 18].forEach(dx => tk.poly([[x1 - 70 + dx, sy], [x1 - 60 + dx, sy + 10], [x1 - 42 + dx, sy - 10]], S(3)));
      R(rb, x1 - w * .45 - 90, sy - 24, w * .34, 48, 24, S(1.8));
      const dots = sub(rb); on(dots, q, 0, { o: [[0, 1], [Z.H - tu(.06), 1], [Z.H, 0]] });                                         // someone is typing … then nothing
      [-1, 0, 1].forEach(i => { const dg = sub(dots); on(dg, q, Math.min(tB, Z.H - tu(.5)) + tu(.1) + i * .1, { loop: .6, y: [[0, 0], [.15, -6, 'out'], [.3, 0, 'in'], [.6, 0]] }); dg.circle(bx0 + i * 20, sy, 5, SOLID()); }); }
    return { h, top: k === 'message' ? y0 - h * .36 : y0, bot: k === 'chat' ? y1 + h * .3 : y1 }; }

  /* round 2 (user 2026-11-13: "ลองรีดีไซน์ใหม่ได้ไหมมันดูธรรมดาไปนิดนึง" — round 1 was almost all "a thing on the left, the card on the right";
     round 1 kept in scratch only): the message comes out of the thing's own mechanism, and the layouts change from design to design. */
  const botOff = (k, w) => { const h = msgH(k, w); return k === 'chat' ? h / 2 + h * .3 : h / 2; };
  const topOff = (k, w) => { const h = msgH(k, w); return k === 'message' ? h / 2 + h * .36 : h / 2; };
  const puffs = (q, pts, r0 = 10, r1 = 18, o = {}) => pts.forEach(([x, y], i) => (o.t != null ? atG(q, o.t + i * (o.dt ?? tu(.05))) : q).circle(x, y, f1(lerp(r0, r1, i / Math.max(1, pts.length - 1))), S(1.8)));
  const lerp = (a, b, k) => a + (b - a) * k;
  const bez2 = (a, b, c2, t) => [(1 - t) * (1 - t) * a[0] + 2 * (1 - t) * t * b[0] + t * t * c2[0], (1 - t) * (1 - t) * a[1] + 2 * (1 - t) * t * b[1] + t * t * c2[1]];

  /* 01 ── SKYWRITING: a small plane flies in low, sweeps up over the sky writing as it goes (it banks with its path, the smoke puffs come out
     where it passes and the early ones drift away), and the smoke settles into the message */
  variant('skywriting', 'เครื่องบินพ่นควันเขียนฟ้า', (d, c) => { const S0 = st(d), mx = -60, my = 20, w = 460, T0 = T0f();
    art(c, p => {
      const P = [[mx + w / 2 + 10, my - 90], [430, -330], [330, -250]], trail = [...Array(9)].map((_, i) => bez2(P[0], P[1], P[2], i / 8));
      const L = [[-640, 220], [mx - w / 2 - 70, my + 150], [mx - w / 2 + 40, my - 40], [mx, my - 150], [mx + w / 2 - 40, my - 140]].concat(trail).concat([[300, -258]]);
      const t1 = Z.H - tu(.45), K = pathK(L, tu(.05), t1, [300, -258], 28, -18);
      [[mx - w / 2 - 70, my + 150], [mx - w / 2 + 40, my - 40], [mx, my - 150], [mx + w / 2 - 40, my - 140]].forEach((pt, i) => { const t = K.when(pt), g = sub(p);
        on(g, p, 0, { ox: pt[0], oy: pt[1], s: [[0, .3], [t, .3], [t + tu(.2), 1.2, 'out'], [Z.H - tu(.2), 1.6]], o: [[0, 0], [t, 0], [t + tu(.04), .8], [Z.H - tu(.2), 0]] }); g.circle(pt[0], pt[1], 16, S(1.8)); });
      trail.forEach((pt, i) => { const t = K.when(pt), g = sub(p), r = lerp(9, 15, i / 8); on(g, p, 0, { ox: pt[0], oy: pt[1], s: [[0, .3], [t, .3], [t + tu(.25), 1, 'out']], o: [[0, 0], [t, 0], [t + tu(.04), 1]] }); g.circle(pt[0], pt[1], r, S(1.8)); });
      const pf = mvG(clipG(p, -500, -350, 1000, 700), { px: 300, py: -258, x: K.x, y: K.y, r: K.r }), pl = rot(pf, -18, 360, -258);
      pl.path('M 300 -258 Q 310 -280 350 -280 L 430 -276 Q 462 -270 466 -258 Q 462 -246 430 -242 L 350 -238 Q 310 -238 300 -258 Z', F(3.2));
      pl.path('M 370 -262 L 340 -310 L 324 -310 L 344 -262 Z', F(2.6)); pl.path('M 312 -262 L 296 -288 L 286 -288 L 296 -258 Z', F(2.4)); R(pl, 410, -270, 26, 12, 4, W(1.6));
      const pr = sub(pl); on(pr, p, 0, { loop: .12, ox: 470, oy: -258, sy: [[0, 1], [.06, .25], [.12, 1]] }); pr.ellipse(470, -258, 5, 20, F(2));
      const tW = K.when([mx, my - 150]);
      msg(p, c, S0, mx, my, w, { pro: true, t: tW, mv: { s: [[0, .9], [tW, .9], [tW + tu(.55), 1, 'out']], o: [[0, 0], [tW, 0], [tW + tu(.1), .5], [tW + tu(.2), .3], [tW + tu(.4), 1]] } });
      puffs(p, [[mx - w / 2 - 20, my + 40], [mx - w / 2 - 50, my + 70], [mx - w / 2 - 70, my + 110]], 12, 8, { t: K.when([mx - w / 2 - 70, my + 150]), dt: tu(.04) });
    }); });

  /* 02 ── PHONE CHAT: the phone rises and settles, its screen wakes up, the chat loads (header, an earlier message, the typing bar); the new
     message bubbles in with the typing dots, the words type out and the phone buzzes when it lands */
  variant('phonechat', 'แชตในมือถือ', (d, c) => { const S0 = st(d), T0 = T0f(), tm = Math.max(T0 - tu(.1), tu(.8));
    art(c, p => {
      const ph = mvG(p, { px: 0, py: 330, y: [[0, 160], [tu(.05), 160], [tu(.42), -10, 'out'], [tu(.56), 0, 'soft']], x: buzzK(tm + tu(.3), 5), o: [[0, 0], [tu(.05), 0], [tu(.1), 1]] });
      R(ph, -175, -335, 350, 670, 48, F(3.6)); R(atG(ph, tu(.4)), -152, -300, 304, 590, 30, { fill: GLASS, sw: 0, stroke: 'none' }); R(ph, -40, -318, 80, 12, 6, F(2)); R(ph, 175, -200, 10, 70, 4, F(2.2));
      const hd = atG(ph, tu(.5)); hd.circle(-112, -258, 18, F(2.4)); bust(hd, -112, -254, .32, F(1.8)); hd.line(-82, -264, 0, -264, S(4)); hd.line(-82, -246, -30, -246, S(3)); hd.line(-152, -222, 152, -222, S(1.6));
      const eb = mvG(ph, { px: -136, py: -170, s: [[0, .5], [tu(.6), .5], [tu(.76), 1.05, 'out'], [tu(.86), 1, 'soft']], o: [[0, 0], [tu(.6), 0], [tu(.64), 1]] }); R(eb, -136, -196, 150, 52, 22, F(2.4)); eb.line(-116, -170, -6, -170, S(4));
      const ib = atG(ph, tu(.55)); R(ib, -136, 214, 210, 46, 23, F(2.4)); ib.line(-114, 237, -30, 237, S(3));
      const sb = mvG(ib, { px: 112, py: 237, s: [[0, 1], [tm - tu(.14), 1], [tm - tu(.08), .82, 'in'], [tm, 1.06, 'out'], [tm + tu(.1), 1, 'soft']] }); sb.circle(112, 237, 23, F(2.6)); shape(sb, [[102, 226], [126, 237], [102, 248]], SOLID(1.4));
      msg(ph, c, S0, 0, 20, 270, { size: 30, pro: true, t: tm, land: tm + tu(.28) });
    }); });

  /* 03 ── POP-UP CARD: the card is opened out — both halves swing open from the fold, the paper tabs unfold, and the message springs up
     out of the fold (stretch, overshoot, settle) */
  variant('popup', 'การ์ดป๊อปอัพ', (d, c) => { const S0 = st(d), w = 380, my = 120 - botOff(st(d).kind, 380);
    art(c, p => {
      const open = sd => mvG(p, { px: 0, py: 90, sx: [[0, .03], [tu(.1), .03], [tu(.48), 1.04, 'out'], [tu(.6), 1, 'soft']], o: [[0, 0], [tu(.1), 0], [tu(.13), 1]] });
      shape(open(-1), [[-440, 270], [0, 210], [0, -120], [-440, -40]], F(3.2)); shape(open(1), [[0, 210], [440, 270], [440, -40], [0, -120]], F(3.2));
      p.line(0, -120, 0, 210, W(2.4));
      const yb = my + botOff(S0.kind, w) - 4, tt = tu(.5);
      drawAt(p.line(-170, 205, -120, yb, W(2.6)), p, tt, tu(.2)); drawAt(p.line(170, 205, 120, yb, W(2.6)), p, tt, tu(.2)); drawAt(p.line(0, yb + 40, -120, yb, S(1.6)), p, tt + tu(.08), tu(.2)); drawAt(p.line(0, yb + 40, 120, yb, S(1.6)), p, tt + tu(.08), tu(.2));
      const tp = tu(.55);
      msg(p, c, S0, 0, my, w, { pro: true, t: tp, mv: { py: my + botOff(S0.kind, w), sy: [[0, .02], [tp, .02], [tp + tu(.26), 1.12, 'out'], [tp + tu(.4), .95, 'io'], [tp + tu(.52), 1, 'soft']],
        sx: [[0, .7], [tp, .7], [tp + tu(.26), .95, 'out'], [tp + tu(.4), 1.03, 'io'], [tp + tu(.52), 1, 'soft']] } });
    }); });

  /* 04 ── TWO PHONES: the phones drop onto the table one after the other; the sender lights up and buzzes, the message winds up, flies over on
     an arc (tilting with the throw), lands with a squash — and the other phone buzzes and lights up */
  variant('twophones', 'มือถือส่งหากัน', (d, c) => { const S0 = st(d), T0 = T0f(), land = Z.H - tu(.3);
    art(c, p => {
      drawAt(R(p, -470, 270, 940, 20, 6, F(3)), p, 0, tu(.35));
      [[-330, -8, 0], [330, 8, 1]].forEach(([x, a, i]) => { const dr = inG(p, 'drop', x, 270, tu(.08 + .12 * i)), bz = mvG(dr, { px: x, py: 270, x: i ? buzzK(Z.H, 6) : buzzK(T0 - tu(.3), 6) }), g = rot(bz, a, x, 110);
        R(g, x - 85, -40, 170, 310, 26, F(3.4)); R(g, x - 70, -18, 140, 262, 14, { fill: GLASS, sw: 0, stroke: 'none' }); R(g, x - 22, -30, 44, 8, 4, F(1.8));
        [0, 1, 2].forEach(k => R(atG(g, tu(.3 + .06 * k + .12 * i)), x - 56 + (k % 2) * 30, 10 + k * 56, 82, 34, 14, S(1.8)));
        const tl = i ? Z.H - tu(.02) : T0 - tu(.32), lt = sub(g); on(lt, p, 0, { o: [[0, 0], [tl, 0], [tl + tu(.04), 1], [tl + tu(.4), 0]] }); R(lt, x - 70, -18, 140, 262, 14, { fill: LIT, sw: 0, stroke: 'none' }); });
      puffs(p, [[-280, -60], [-250, -110], [-205, -150], [-160, -180]], 4, 7, { t: T0 + tu(.05), dt: (land - T0) / 6 });
      msg(p, c, S0, 40, -175, 380, { pro: true, t: T0 - tu(.12), land, mv: { x: sweep(T0, land, [-370, -200, 0], 0), y: sweep(T0, land, [235, -40, 0], 0),
        s: [[0, .3], [T0 - tu(.12), .3], [T0, .24, 'in'], [land, 1, 'out']], r: [[0, -16], [T0, -16], [land, 0, 'out']] } });
    }); });

  /* 05 ── LAPTOP CHAT: the laptop lands, its lid swings open, the screen wakes, the chat window builds up (contacts one by one, the typing bar);
     the first contact flashes — a new message — and it bubbles in */
  variant('laptop', 'หน้าต่างแชตบนแล็ปท็อป', (d, c) => { const S0 = st(d), T0 = T0f(), tm = Math.max(T0 - tu(.05), tu(.95));
    art(c, p => {
      const B = inG(p, 'rise', 0, 210, 0); shape(B, [[-430, 160], [430, 160], [470, 210], [-470, 210]], F(3.2)); R(B, -90, 166, 180, 14, 6, S(1.6));
      const lid = mvG(p, { px: 0, py: 160, sy: [[0, .05], [tu(.2), .05], [tu(.58), 1.03, 'out'], [tu(.7), 1, 'soft']], o: [[0, 0], [tu(.2), 0], [tu(.23), 1]] });
      R(lid, -360, -310, 720, 470, 24, F(3.6)); R(atG(lid, tu(.62)), -330, -282, 660, 412, 10, { fill: GLASS, sw: 0, stroke: 'none' }); lid.circle(0, -296, 5, F(1.6));
      const tb = atG(lid, tu(.68)); tb.line(-330, -246, 330, -246, S(1.6)); [-310, -288, -266].forEach(x => tb.circle(x, -264, 6, S(1.6))); tb.line(-200, -246, -200, 130, S(1.6));
      [-190, -120, -50].forEach((y, i) => { const g = inG(lid, 'pop', -268, y, tu(.72 + .06 * i)); g.circle(-268, y, 22, F(2.2)); bust(g, -268, y + 4, .38, F(1.6));
        if (i === 0) { const lt = sub(g); on(lt, p, 0, { o: [[0, 0], [tm - tu(.2), 0], [tm - tu(.17), 1], [tm - tu(.1), .2], [tm - tu(.07), 1]] }); lt.circle(-268, y, 22, { fill: LIT, sw: 2.2 }); bust(lt, -268, y + 4, .38, F(1.6)); } });
      const ib = atG(lid, tu(.8)); R(ib, -180, 72, 460, 40, 20, F(2.2)); ib.line(-160, 92, -60, 92, S(3));
      msg(lid, c, S0, 60, -90, 380, { pro: true, t: tm });
    }); });

  /* 06 ── TIN-CAN PHONE: the cans drop in, the string is pulled taut between them; the left can shakes as it speaks, the message rides the
     string with a little bob and the right can wobbles as it arrives; gone: the string goes slack */
  variant('tincan', 'โทรศัพท์กระป๋อง', (d, c) => { const S0 = st(d), T0 = T0f(), land = Z.H - tu(.3), my = 50 - botOff(st(d).kind, 380) - 6;
    art(c, p => {
      const can = (sd, t) => { const x = sd * 390, dr = inG(p, 'drop', x, 110, t), q = mvG(dr, { px: x, py: 110, r: sd < 0 ? [[0, 0], [T0 - tu(.3), 0], [T0 - tu(.24), -5, 'io'], [T0 - tu(.18), 5, 'io'], [T0 - tu(.12), -4, 'io'], [T0 - tu(.06), 0, 'soft']] : [[0, 0], [land, 0], [land + tu(.06), 6, 'io'], [land + tu(.14), -4, 'io'], [land + tu(.24), 0, 'soft']] });
        R(q, x - 60, -10, 120, 120, 12, F(3.2)); q.line(x - 60, 20, x + 60, 20, S(1.6)); q.line(x - 60, 80, x + 60, 80, S(1.6)); q.ellipse(x - sd * 60, 50, 18, 60, F(3)); q.ellipse(sd * 450, 50, 14, 60, S(1.8)); };
      can(-1, tu(.05)); can(1, tu(.15));
      const tg = sub(p), st0 = tg.line(-330, 50, 330, 50, W(2.4)); drawAt(st0, p, tu(.4), tu(.3));
      if (S0.gone) { on(tg, p, 0, { o: [[0, 1], [Z.H - tu(.06), 1], [Z.H + tu(.06), 0]] }); const sl = p.path('M -330 50 Q 0 260 330 50', S(2.4)); on(sl, p, 0, { o: [[0, 0], [Z.H - tu(.06), 0], [Z.H + tu(.06), 1]] }); }
      [-1, 1].forEach(sd => atG(p, tu(.4)).circle(sd * 330, 50, 6, SOLID()));
      const bob = [[0, 0], [T0, 0]]; for (let j = 1; j <= 6; j++) bob.push([T0 + (land - T0) * j / 6, j === 6 ? 0 : (j % 2 ? -10 : 0), 'io']);
      msg(p, c, S0, 0, my, 380, { pro: true, t: T0 - tu(.05), land, mv: { x: sweep(T0, land, [-290, 0], 0), y: bob, s: [[0, .4], [T0, .4], [land, 1, 'out']] } });
    }); });

  /* 07 ── KEYBOARD: the keyboard slides up; the message lifts off it and, while its words type out, the keys are pressed one after another in
     time with the typing; the space bar goes down at the end */
  variant('keyboard', 'คีย์บอร์ดพิมพ์ข้อความ', (d, c) => { const S0 = st(d), T0 = T0f(), tm = T0 - tu(.05), tA = Math.max(tm + tu(.3), T0 - tu(.1)), tB = Math.max(tA + tu(.2), Z.H - tu(.14));
    art(c, p => {
      const K = inG(p, 'rise', 0, 296, 0); shape(K, [[-440, 296], [440, 296], [380, 110], [-380, 110]], F(3.4)); const keys = [];
      for (let r = 0; r < 4; r++) { const y0 = 128 + r * 40, y1 = y0 + 30, t0 = (y0 - 110) / 186, t1 = (y1 - 110) / 186, n = r === 3 ? 3 : 11;
        for (let k = 0; k < n; k++) { const u0 = k / n, u1 = (k + .86) / n, X = (u, t) => lerp(-380 - 60 * t + 18, 380 + 60 * t - 18, r === 3 ? lerp(.22, .78, u) : u);
          const qd = [[X(u0, t0), y0], [X(u1, t0), y0], [X(u1, t1), y1], [X(u0, t1), y1]]; shape(K, qd, S(1.6)); if (r < 3) keys.push(qd); } }
      shape(K, [[-100, 248], [100, 248], [104, 278], [-104, 278]], S(1.6));
      const seq = [14, 3, 20, 8, 25, 11, 17, 5, 28, 22, 9, 15], n2 = seq.length;
      seq.forEach((ki, j) => { const t = tA + (tB - tA) * j / n2, qd = keys[ki % keys.length], g = sub(K); on(g, p, 0, { o: [[0, 0], [t, 0], [t + tu(.02), 1], [t + tu(.1), 0]] }); shape(g, qd, { fill: LIT, sw: 1.8 }); });
      const sp = sub(K); on(sp, p, 0, { o: [[0, 0], [tB, 0], [tB + tu(.02), 1], [tB + tu(.14), 0]] }); shape(sp, [[-100, 248], [100, 248], [104, 278], [-104, 278]], { fill: LIT, sw: 1.8 });
      puffs(p, [[-150, 96], [-118, 62], [-88, 30]], 5, 8, { t: tm, dt: tu(.06) });
      msg(p, c, S0, 0, -130, 420, { pro: true, t: tm, mv: { y: [[0, 170], [tm, 170], [tm + tu(.36), -12, 'out'], [tm + tu(.5), 0, 'soft']], s: [[0, .35], [tm, .35], [tm + tu(.36), 1.04, 'out'], [tm + tu(.5), 1, 'soft']] } });
    }); });

  /* 08 ── SPRAY CAN: the wall comes up brick row by brick row, the can swings in and is shaken, its cap is pressed — mist puffs out and the
     message is sprayed onto the wall from left to right; the fresh paint runs */
  variant('spray', 'สเปรย์พ่นผนัง', (d, c) => { const S0 = st(d), mx = -70, my = -40, w = 440, T0 = T0f(), te = Z.H - tu(.3);
    art(c, p => {
      for (let r = 0; r < 3; r++) { const rg = atG(p, tu(.04 * (2 - r))); for (let k = 0; k < 6; k++) { const x = -470 + k * 160 + (r % 2) * 80, x2 = Math.min(x + 150, 470); if (x2 - x > 40) R(rg, x, 190 + r * 40, x2 - x, 34, 3, S(1.4)); } }
      const x0 = mx - w / 2 - 16, x1 = mx + w / 2 + 40, ya = my - topOff(S0.kind, w) - 60, yb2 = my + botOff(S0.kind, w) + 40;
      const cg = clipG(p, x0, ya, x1 - x0, yb2 - ya), cid = cg.g.getAttribute('clip-path').slice(5, -1), crect = cg.g.ownerSVGElement.querySelector('#' + cid + ' rect');
      on(crect, p, 0, { ox: x0, oy: my, sx: [[0, .001], [T0, .001], [te, 1, 'io']] });                                                     // the paint reveals left → right
      msg(cg, c, S0, mx, my, w, { pro: true, t: T0 - tu(.05), mv: { o: [[0, 0], [T0 - tu(.05), 0], [T0, 1]] } });
      const yb = my + botOff(S0.kind, w); [[mx - 120, 34], [mx + 30, 54], [mx + 150, 26]].forEach(([x, l], i) => { const t = te + i * tu(.06), dg = atG(p, t); drawAt(dg.line(x, yb - 2, x, yb + l, W(3)), p, t, tu(.3)); atG(dg, tu(.3)).circle(x, yb + l + 6, 6, SOLID()); });
      const cin = mvG(p, { px: 370, py: 120, x: [[0, 260], [tu(.15), 260], [tu(.55), 0, 'out']], r: [[0, 30], [tu(.15), 30], [tu(.55), -4, 'out'], [tu(.68), 0, 'soft']] });
      const csh = mvG(cin, { px: 370, py: 120, r: [[0, 0], [T0 - tu(.42), 0], [T0 - tu(.34), 10, 'io'], [T0 - tu(.26), -10, 'io'], [T0 - tu(.18), 7, 'io'], [T0 - tu(.08), 0, 'soft']] }), cn = rot(csh, -28, 370, 120);
      R(cn, 330, 40, 80, 190, 18, F(3.4)); R(cn, 342, 14, 56, 28, 8, F(2.6)); cn.line(334, 100, 406, 100, S(1.6));
      const cap = mvG(cn, { px: 370, py: 8, y: [[0, 0], [T0 - tu(.04), 0], [T0, 6, 'in'], [te, 6], [te + tu(.06), 0, 'out']] }); R(cap, 358, 0, 24, 16, 4, F(2.4));
      [[280, 0], [262, -14], [266, 18], [244, 4], [250, -30], [236, 30]].forEach(([x, y], i) => { const g = mvG(p, { px: x, py: y, s: [[0, .4], [T0 + i * tu(.03), .4], [T0 + i * tu(.03) + tu(.15), 1.6, 'out'], [te, 1.2], [te + tu(.1), 1, 'soft']], o: [[0, 0], [T0 + i * tu(.03), 0], [T0 + i * tu(.03) + tu(.03), 1]] }); g.circle(x, y, 4, S(1.4)); });
    }); });

  /* 09 ── WALKIE-TALKIES: the two sets rise one after the other; the left one's talk button is pressed, the radio waves ring out, the message is
     sent off its antenna on an arc and lands with a squash — the other set shakes as it comes in */
  variant('walkie', 'วิทยุสื่อสาร', (d, c) => { const S0 = st(d), T0 = T0f(), land = Z.H - tu(.3);
    art(c, p => {
      [-1, 1].forEach((sd, i) => { const x = sd * 340, ri = inG(p, 'rise', x, 260, tu(.06 + .12 * i)), bz = mvG(ri, { px: x, py: 260, x: sd > 0 ? buzzK(Z.H, 5) : [[0, 0]] }), g = rot(bz, sd * 6, x, 260);
        R(g, x - 70, 0, 140, 260, 22, F(3.4)); R(g, x + sd * 30 - 8, -110, 16, 116, 6, F(2.6));
        R(g, x - 50, 30, 100, 64, 10, { fill: GLASS, sw: 2 }); [0, 1, 2, 3].forEach(k => g.line(x - 40, 128 + k * 20, x + 40, 128 + k * 20, S(1.8))); g.circle(x - 30, -10, 10, F(2));
        const pt = mvG(g, { px: x - sd * 84, py: 87, x: sd < 0 ? [[0, 0], [T0 - tu(.3), 0], [T0 - tu(.24), 6, 'in'], [land, 6], [land + tu(.08), 0, 'out']] : [[0, 0]] }); R(pt, x - sd * 84 - 6, 60, 12, 54, 5, F(2.2));
        const tl = sd < 0 ? T0 - tu(.24) : Z.H, lt = sub(g); on(lt, p, 0, { o: [[0, 0], [tl, 0], [tl + tu(.03), 1], [tl + tu(.12), .5], [tl + tu(.2), 1], [Math.max(tl + tu(.5), land + tu(.3)), 0]] }); R(lt, x - 50, 30, 100, 64, 10, { fill: LIT, sw: 2 }); });
      [40, 70, 100].forEach((r, i) => { const g = mvG(p, { px: -310, py: -110, s: [[0, .4], [T0 - tu(.2) + i * tu(.08), .4], [T0 + i * tu(.08) + tu(.1), 1.1, 'out'], [T0 + i * tu(.08) + tu(.25), 1, 'soft']], o: [[0, 0], [T0 - tu(.2) + i * tu(.08), 0], [T0 - tu(.16) + i * tu(.08), 1]] });
        g.path(`M ${-310 + r * .8} ${-110 - r * .6} A ${r} ${r} 0 0 1 ${-310 + r * .95} ${-110 + r * .2}`, S(2.2)); });
      msg(p, c, S0, 0, -170, 380, { pro: true, t: T0 - tu(.1), land, mv: { x: sweep(T0, land, [-310, -120, 0], 0), y: sweep(T0, land, [60, -40, 0], 0),
        s: [[0, .3], [T0 - tu(.1), .3], [T0, .24, 'in'], [land, 1, 'out']], r: [[0, -14], [T0, -14], [land, 0, 'out']] } });
    }); });

  /* 10 ── CAFÉ TABLE: the table stands, the two cups are set down and steam a little, the two people sit in; the left one leans in and talks —
     the message comes off them — and the right one nods on the keyword */
  variant('cafe', 'โต๊ะคุยกัน', (d, c) => { const S0 = st(d), T0 = T0f(), land = Z.H - tu(.3);
    art(c, p => {
      const T = inG(p, 'rise', 0, 284, 0); R(T, -250, 150, 500, 18, 8, F(3)); T.line(0, 168, 0, 280, W(4)); T.ellipse(0, 284, 90, 12, F(2.6));
      [-1, 1].forEach((sd, i) => { const x = sd * 90, g = inG(p, 'drop', x, 150, tu(.25 + .1 * i)); R(g, x - 26, 106, 52, 44, 8, F(2.6)); g.path(`M ${x + sd * 26} ${116} Q ${x + sd * 46} ${126} ${x + sd * 26} ${138}`, W(2.4)); g.ellipse(x, 150, 40, 6, F(2));
        const stm = sub(p); on(stm, p, 0, { o: [[0, 0], [tu(.5 + .1 * i), 0], [tu(.6 + .1 * i), .7], [Z.H - tu(.3), .7], [Z.H, 0]] }); const sm2 = sub(stm); on(sm2, p, tu(.5), { loop: 1.2, y: [[0, 8], [1.2, -14]] }); sm2.path(`M ${x - 6} 96 Q ${x + 6} 84 ${x - 4} 70 Q ${x - 14} 58 ${x - 2} 46`, S(1.8)); });
      [[-360, 0, [[0, 0], [T0 - tu(.3), 0], [T0 - tu(.2), 4, 'io'], [T0 - tu(.1), -3, 'io'], [T0, 3, 'io'], [land, 0, 'soft']]], [360, 1, [[0, 0], [Z.H, 0], [aH(.1), 7, 'io'], [aH(.22), 0, 'io'], [aH(.32), 5, 'io'], [aH(.44), 0, 'soft']]]].forEach(([x, i, rk]) => {
        const ri = inG(p, 'rise', x, 160, tu(.4 + .1 * i)), nd = mvG(ri, { px: x, py: 150, r: rk }); bust(nd, x, 110, 2); });
      msg(p, c, S0, -20, -170, 420, { pro: true, t: T0 - tu(.05), land, mv: { x: sweep(T0, land, [-300, -100, 0], 0), y: sweep(T0, land, [180, 20, 0], 0), s: [[0, .3], [T0, .3], [land, 1, 'out']] } });
    }); });

  /* 11 ── PIGEON (from round 1): a pigeon flies in with the message on a string from its beak */
  variant('pigeon', 'นกพิราบส่งจดหมาย', (d, c) => { const S0 = st(d);
    art(c, p0 => { const p = mvG(clipG(p0, -500, -350, 1000, 700), { x: sweep(tu(.05), Z.H - tu(.3), [-760, -260, 0], 0), y: sweep(tu(.05), Z.H - tu(.3), [-80, 30, 0], 0) });
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

  /* 12 ── DRONE SHOW: a swarm of lit drones over the city forms the message in the night sky */
  variant('droneshow', 'โดรนแปรอักษร', (d, c) => { const S0 = st(d), mx = 0, my = -120, w = 460;
    art(c, p0 => { const p = inG(p0, 'pop', 0, 0, 0);
      [[-470, 170, 90], [-370, 120, 70], [-290, 200, 110], [-170, 150, 80], [-80, 100, 70], [0, 180, 120], [130, 130, 70], [210, 210, 90], [310, 140, 100], [420, 190, 80]].forEach(([x, top, wd]) => R(p, x, top, wd, 300 - top, 3, F(2.6)));
      p.line(-480, 300, 480, 300, S(2));
      const h = msgH(S0.kind, w), x0 = mx - w / 2 - 22, x1 = mx + w / 2 + 22, y0 = my - topOff(S0.kind, w) - 22, y1 = my + botOff(S0.kind, w) + 22;
      const T0 = T0f(), drone = (x, y, i) => { const t = tu(.2) + (i % 7) * tu(.06), g = mvG(p, { x: [[0, f1(-x * .4)], [t, f1(-x * .4)], [t + tu(.5), 0, 'out']], y: [[0, 430], [t, 430], [t + tu(.5), 0, 'out']], o: [[0, 0], [t, 0], [t + tu(.05), 1]] }); g.circle(x, y, 5, { fill: LIT, sw: 1.6 }); g.line(x - 9, y - 7, x + 9, y - 7, S(1.4)); }; let di = 0;
      for (let k = 0; k <= 10; k++) { const x = lerp(x0, x1, k / 10); [y0, y1].forEach(y => drone(x, y, di++)); }
      for (let k = 1; k < 4; k++) { const y = lerp(y0, y1, k / 4); [x0, x1].forEach(x => drone(x, y, di++)); }
      msg(p, c, S0, mx, my, w, { t: Math.max(tu(.9), T0 - tu(.1)) });
    }); });

  /* 13 ── LECTERN: someone speaks at a lectern into its microphone — the message rises over the room */
  variant('lectern', 'แท่นพูด', (d, c) => { const S0 = st(d);
    art(c, p0 => { const p = inG(p0, 'pop', 0, 0, 0);
      p.line(-480, 292, 480, 292, S(2)); bust(p, 0, 70, 1.9);
      shape(p, [[-150, 292], [150, 292], [130, 120], [-130, 120]], F(3.4)); shape(p, [[-170, 120], [170, 120], [190, 84], [-190, 84]], F(3)); R(p, -70, 170, 140, 60, 8, S(1.8));
      p.path('M 110 90 Q 120 40 70 14', W(3)); R(p, 50, 0, 34, 22, 10, F(2.4));
      const T0 = T0f(); msg(p, c, S0, 0, -200, 420, { t: T0 - tu(.05), mv: { y: [[0, 170], [T0, 170], [Z.H - tu(.3), 0, 'out']], s: [[0, .3], [T0, .3], [Z.H - tu(.3), 1, 'out']] } });
    }); });

  /* 14 ── FRIDGE DOOR: the message is held on the fridge door by two magnets */
  variant('fridge', 'ประตูตู้เย็น', (d, c) => { const S0 = st(d), w = 380, my = 20;
    art(c, p0 => { const p = inG(p0, 'pop', 0, 0, 0);
      R(p, -230, -330, 460, 640, 30, F(3.6)); p.line(-230, -170, 230, -170, W(2.4)); R(p, 190, -300, 16, 100, 8, F(2.6)); R(p, 190, -130, 16, 160, 8, F(2.6));
      R(p, -200, 300, 40, 22, 4, F(2.4)); R(p, 160, 300, 40, 22, 4, F(2.4));
      const T0 = T0f(); msg(p, c, S0, -10, my, w, { t: T0 - tu(.3), mv: { y: [[0, -70], [T0 - tu(.3), -70], [T0, 0, 'in'], [T0 + tu(.08), -8, 'out'], [T0 + tu(.18), 0, 'soft']] } });
      const ty = my - topOff(S0.kind, w), mg = atG(p, T0); [-1, 1].forEach(sd => { mg.circle(-10 + sd * 120, ty + 6, 20, F(3)); mg.circle(-10 + sd * 120, ty + 6, 8, W(1.6)); });
    }); });

  /* 15 ── GROUP CHAT: a group of people, each with a little bubble — one of them says the message */
  variant('groupchat', 'กลุ่มคนคุยกัน', (d, c) => { const S0 = st(d), xs = [-380, -190, 0, 190, 380], me = 1;
    art(c, p0 => { const p = inG(p0, 'pop', 0, 0, 0);
      xs.forEach((x, i) => { bust(p, x, 230, 1.5); if (i !== me) { const g = sub(p); on(g, p, 0, { o: [[0, .45]] }); R(g, x - 56, 60, 112, 50, 22, F(2.2)); g.line(x - 34, 85, x + 30, 85, S(3)); shape(g, [[x - 20, 110], [x - 4, 110], [x - 22, 126]], F(2)); } });
      msg(p, c, S0, xs[me] + 150, -130, 400);
    }); });

  /* 16 ── POST BOX: a street post box — the message is going into its slot */
  variant('postbox', 'ตู้ไปรษณีย์', (d, c) => { const S0 = st(d);
    art(c, p0 => { const p = inG(p0, 'pop', 0, 0, 0);
      p.line(-480, 292, 480, 292, S(2)); R(p, -330, 270, 200, 22, 6, F(2.8));
      p.path('M -310 270 L -310 -120 Q -310 -200 -230 -200 Q -150 -200 -150 -120 L -150 270 Z', F(3.6)); p.path('M -322 -126 Q -322 -224 -230 -224 Q -138 -224 -138 -126 Z', F(3));
      R(p, -290, -100, 120, 22, 8, { fill: C.fill, sw: 2.4 }); R(p, -280, -40, 100, 60, 8, S(1.8)); p.line(-310, 120, -150, 120, S(1.6)); p.circle(-170, 190, 8, F(2));
      [[-120, -92], [-96, -74], [-108, -112]].forEach(([x, y]) => p.line(x, y, x + 40, y + (y + 92) * .2, S(2)));
      const T0 = T0f(); msg(clipG(p, -500, -350, 1000, 700), c, S0, 150, -110, 380, { t: T0 - tu(.05), mv: { x: sweep(T0, Z.H - tu(.3), [300, 0], 0) } });
    }); });

  /* 17 ── COMIC STRIP (from round 1): three panels of a comic — in the last, big panel someone says the message */
  variant('comic', 'การ์ตูนช่อง', (d, c) => { const S0 = st(d);
    art(c, p0 => { const p = inG(p0, 'pop', 0, 0, 0);
      R(p, -470, -300, 280, 285, 8, F(3.2)); R(p, -470, 15, 280, 285, 8, F(3.2)); R(p, -170, -300, 640, 600, 8, F(3.4));
      bust(p, -330, -110, 1.3); bust(p, -330, 210, 1.3); p.line(-380, -250, -280, -250, S(4)); bust(p, -40, 210, 1.9);
      p.line(-460, -54, -200, -54, S(1.6)); p.line(-460, 264, -200, 264, S(1.6)); [[-122, 84, -104, 100], [-100, 62, -92, 84], [-70, 56, -70, 80]].forEach(([a, b, c2, d2]) => p.line(a, b, c2, d2, W(2.4)));
      msg(p, c, S0, 200, -90, 400);
    }); });

  /* 18 ── HOLOGRAM: the projector rises onto the table, its light ring flickers on, the cone of light shoots up with a scan line running
     through it, and the message materialises in the light (flickers, then holds) */
  variant('hologram', 'โฮโลแกรม', (d, c) => { const S0 = st(d), T0 = T0f(), tc = tu(.45);
    art(c, p => {
      drawAt(R(p, -470, 270, 940, 20, 6, F(3)), p, 0, tu(.35));
      const cone = mvG(p, { px: 0, py: 214, sy: [[0, .02], [tc, .02], [tc + tu(.3), 1.04, 'out'], [tc + tu(.42), 1, 'soft']], o: [[0, 0], [tc, 0], [tc + tu(.04), .8], [tc + tu(.08), .2], [tc + tu(.14), 1]] });
      cone.path(pathOf([[-90, 214], [90, 214], [270, -330], [-270, -330]]), { fill: GLASS, sw: 0, stroke: 'none' }); cone.line(-90, 214, -270, -330, S(1.4)); cone.line(90, 214, 270, -330, S(1.4));
      const sc = sub(cone); on(sc, p, 0, { o: [[0, 0], [tc + tu(.3), 0], [tc + tu(.34), .6], [Z.H, .6], [Z.H + tu(.2), 0]] }); const sl = sub(sc); on(sl, p, tc + tu(.3), { loop: 1.1, y: [[0, 0], [1.1, -520]] }); sl.line(-110, 200, 110, 200, S(1.8));
      const B = inG(p, 'rise', 0, 270, tu(.08)); B.ellipse(0, 250, 170, 30, F(3.2)); R(B, -150, 214, 300, 36, 10, F(3)); B.ellipse(0, 214, 110, 16, F(2.4));
      const rg = sub(B); on(rg, p, 0, { o: [[0, 0], [tu(.3), 0], [tu(.33), 1], [tu(.36), .2], [tu(.4), 1]] }); rg.ellipse(0, 214, 110, 16, { fill: LIT, sw: 2.4 });
      msg(p, c, S0, 0, -70, 400, { pro: true, t: T0 - tu(.05), land: Z.H - tu(.3), mv: { y: [[0, 270], [T0, 270], [Z.H - tu(.3), 0, 'out']], s: [[0, .15], [T0, .15], [Z.H - tu(.3), 1, 'out']],
        o: [[0, 0], [T0 - tu(.05), 0], [T0, .7], [T0 + tu(.05), .15], [T0 + tu(.1), .8], [T0 + tu(.16), .3], [T0 + tu(.26), 1]] } });
    }); });

  /* 19 ── QUILL: a quill dipped in the ink pot writes the message on a sheet of paper */
  variant('quill', 'ขนนกจุ่มหมึก', (d, c) => { const S0 = st(d), mx = -40, my = 30, w = 420;
    art(c, p0 => { const p = inG(p0, 'pop', 0, 0, 0);
      shape(p, [[-420, 280], [360, 280], [320, -230], [-380, -230]], F(3));
      R(p, 330, 170, 120, 100, 18, F(3.2)); R(p, 350, 140, 80, 34, 8, F(2.8)); p.ellipse(390, 140, 40, 8, { fill: C.ink, sw: 1.6 });
      const nib = [mx + w / 2 - 20, my + botOff(S0.kind, w) - 30], T0 = T0f(), qk = [[0, 0], [T0, 0]]; for (let j = 1; j <= 8; j++) qk.push([T0 + (Z.H - T0) * j / 8, j === 8 ? 0 : (j % 2 ? 14 : -10), 'io']); const qp = mvG(p, { x: qk.map(([t, v, e]) => e ? [t, f1(v * 1.6), e] : [t, v]), y: qk });
      qp.path(`M ${nib[0]} ${nib[1]} Q ${nib[0] + 60} ${nib[1] - 140} ${nib[0] + 200} ${nib[1] - 320} Q ${nib[0] + 150} ${nib[1] - 180} ${nib[0] + 20} ${nib[1] - 12} Z`, F(2.8));
      qp.line(nib[0] + 6, nib[1] - 6, nib[0] + 180, nib[1] - 300, S(1.6));
      msg(p, c, S0, mx, my, w);
    }); });

  /* 20 ── RING LIGHT: a ring light on its stand, the kind used to go live — the message shows inside the ring */
  variant('ringlight', 'ไฟวงแหวนไลฟ์สด', (d, c) => { const S0 = st(d);
    art(c, p0 => { const p = inG(p0, 'pop', 0, 0, 0);
      p.line(-480, 292, 480, 292, S(2)); [-150, 0, 150].forEach(x => p.line(0, 200, x, 292, W(3.4))); R(p, -10, 120, 20, 90, 4, F(2.6));
      ring(p, 0, -90, 215, 180, F(3.2)); { const lt = sub(p); on(lt, p, 0, { o: [[0, 0], [tu(.25), 0], [tu(.28), 1], [tu(.33), .2], [tu(.38), 1]] }); ring(lt, 0, -90, 215, 180, { fill: LIT, sw: 3.2 }); } R(p, -24, 118, 48, 20, 6, F(2.6));
      msg(p, c, S0, 0, -90, 300, { size: 32, t: tu(.45) });
    }); });

  /* samples from unrelated topics (neutrality) + a stress set */
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
  G.cats.B11 = { variants: V, SAMPLES, STRESS, draw: (i, d, c) => { setZ(c); CUR = V[i].id; V[i].build(d, c); }, CLAMPS, timing: c => (setZ(c), Object.assign({}, Z)) };
})();
