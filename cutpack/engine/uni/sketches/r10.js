/* =====================================================================
   CutPack · uni · SKETCHES for round 10 (Friend 2026-11-11: "เริ่มรอบ 10 เลย ทำรูปออกมาให้ดูก่อนนะอยากเห็นของทุกสไตล์เลยอ่ะทั้ง 4 สไตล์").
   Two new drafts for each of ten categories, thought up the way the talking-head-motion skill designs a scene
   (SKILL.md "หลักที่ทำให้งานออกมาโปร", references/scene-library.md "ออกแบบฉากใหม่"): one main thing + one move that carries the
   meaning on the key word, then it holds still; no decoration; "ปิดเสียงดู 1 วินาที ยังสื่อไหม". Checked against Friend's taste
   (DECISIONS round 9): everyday things, a mechanism that ends on the result, big main thing, no far metaphors.
   People are allowed again (Friend 2026-11-11: "ไม่เอาคน" was only for the round 9 refill ideas).
   Still pictures only (the end state): NOT in scenes/; load with EXTRA=sketches/r10.js.
   ===================================================================== */
const S10 = {
  /* a round surface: 'card' | 'acc' | 'main' | 'neg' | 'soft' */
  disc(g, cx, cy, r, kind = 'card') {
    if (kind === 'card') return R9.card(g, cx - r, cy - r, 2 * r, 2 * r, '50%');
    if (kind === 'acc') return R9.acc(g, cx - r, cy - r, 2 * r, 2 * r, '50%');
    return R7.plain(g, cx - r, cy - r, 2 * r, 2 * r, kind, '50%');
  },
  /* an icon that takes the ink of the surface it sits on (u-main / u-neg / u-acc set their own colour) */
  inkIco: (g, icon, cx, cy, size) => R9.ico(g, icon, cx, cy, size, 'u-inherit'),
  /* a big glyph ("?") in the CardSans font, centred on (cx, cy), in the text ink of where it sits */
  glyph(g, txt, cx, cy, size, cls = 'u-label') {
    const e = div(`left:${cx - size}px;top:${cy - size * .62}px;width:${2 * size}px;text-align:center;font-family:KeySans;font-size:${size}px;line-height:1.25`, g);
    e.className = cls; e.textContent = txt; return e;
  },
  /* a fruit / a dot: an accent disc with an ink rim, so it shows on a light card too */
  dot(g, cx, cy, r) { const d = S10.disc(g, cx, cy, r, 'acc'); d.p.style.boxShadow = '0 0 0 3px var(--fl-edge, var(--fl-line, var(--ink)))'; return d; },
  bar: (g, x, y, w, h, cls, r = h / 2) => { const e = div(`left:${x}px;top:${y}px;width:${w}px;height:${h}px;border-radius:${r}px`, g); if (cls) e.className = cls; else e.style.background = 'var(--tr)'; return e; },
  /* an icon above a centred word, inside a holder of width w */
  iconWord(K, p, it, w, y, icon = 38, word = 28, acc = false) {
    if (it?.icon) R9.ico(p, it.icon, w / 2, y + icon / 2, icon, acc ? 'u-bubble-text' : 'u-label');
    if (it?.label) { const l = R4.word(K, p, it.label, w / 2, y + icon + 6, word, null, w - 20); if (acc) l.classList.add('u-bubble-text'); }
  },
};

/* ================= B04 ขั้นตอน: items [3 {icon, label?}], mark? {at, how light|check|cross} ================= */
/* 1 · toy bricks laid like a wall: each step drops onto the one before, a little to the side, so the studs of every
   brick show (Friend 2026-11-11 "แก้เลย": the studs were only on the top brick, the others read as plain cards) */
R3.both('B04', 'tower', 'ตัวต่อซ้อนเป็นตึก หล่นลงมาทีละชั้น', (K, s, T, g) => {
  const it = (s.items ?? []).slice(0, 3), mk = s.mark, W = 250, H = 86, base = 322, xs = [130, 220, 130];
  R7.plain(g, 100, base, 400, 12, 'main', '6px');
  it.forEach((p, k) => {
    const y = base - (k + 1) * H, x = xs[k], lit = mk?.at === k && mk.how === 'light', kind = lit ? R9.acc : R9.card;
    const b = kind(g, x, y, W, H, 14); K.enter(b.o, T.b[0] + k * .3, 'drop');
    /* studs on the part of the top that the next brick leaves open */
    const nx = xs[k + 1], free = k === it.length - 1 ? [x, x + W] : nx > x ? [x, nx] : [nx + W, x + W];
    const room = free[1] - free[0] - 16, ns = Math.floor(room / 70), x0 = free[0] + 16 + (room - ns * 70) / 2 + 2;
    for (let i = 0; i < ns; i++) kind(g, x0 + i * 70, y - 20, 50, 20, '10px 10px 3px 3px');
    S10.iconWord(K, b.p, p, W, 8, 34, 28, lit);
    if (mk?.at === k && mk.how !== 'light') K.mark(b.p, mk.how, W - 34, H / 2, 40, T.hit);
  });
});

/* 2 · a board game: on the board a track runs from square to square; the pawn hops along it and stops on the step
   that matters (Friend 2026-11-11 "แก้เลย": the squares floated with no board) */
R3.both('B04', 'board', 'เบี้ยเดินบนกระดานเกม กระโดดไปทีละช่อง', (K, s, T, g) => {
  const it = (s.items ?? []).slice(0, 3), mk = s.mark, at = mk ? mk.at : it.length - 1, W = 520, H = 318, TS = 84;
  const bd = R9.card(g, 30, 14, W, H, 30); K.enter(bd.o, T.b[0], 'rise');
  const C = [[96, 222], [262, 156], [430, 96]];
  const tk = div(`left:0;top:0;width:${W}px;height:${H}px`, bd.p, `<svg width="${W}" height="${H}"><path d="M28 222C130 222 170 156 262 156S360 96 492 96" style="fill:none;stroke:var(--tr);stroke-width:42px;stroke-linecap:round"/></svg>`);
  tk.classList.add('u-decor');
  it.forEach((p, k) => {
    const [cx, cy] = C[k], lit = mk?.at === k && mk.how === 'light', t = R7.plain(bd.p, cx - TS / 2, cy - TS / 2, TS, TS, lit ? 'acc' : 'main', '20px');
    if (lit) R9.ico(t.p, p.icon, TS / 2, TS / 2, 42, 'u-bubble-text'); else S10.inkIco(t.p, p.icon, TS / 2, TS / 2, 42);
    if (p.label) R4.word(K, bd.p, p.label, cx, cy + TS / 2 + 4, 26, null, 150);
    if (mk?.at === k && mk.how !== 'light') K.mark(bd.p, mk.how, cx + TS / 2, cy - TS / 2, 40, T.hit);
  });
  /* the pawn: a head on a bell-shaped body, standing on the top edge of the square it reached */
  const [px, cy] = C[at], py = cy - TS / 2 + 14;
  div(`left:0;top:0;width:${W}px;height:${H}px`, bd.p, `<svg width="${W}" height="${H}" style="overflow:visible"><path class="ac" d="M${px - 26} ${py}Q${px - 26} ${py - 12} ${px - 12} ${py - 16}L${px - 7} ${py - 42}H${px + 7}L${px + 12} ${py - 16}Q${px + 26} ${py - 12} ${px + 26} ${py}Z"/>` +
    `<circle class="ac" cx="${px}" cy="${py - 55}" r="16"/></svg>`);
});

/* ================= B06 คำถาม: about? {icon, label?}, options? [2], answer? ================= */
/* 3 · a poll: the question on top, two big choices side by side; each fills up from the bottom with its votes
   (no answer = both about half, still undecided; the answer = it fills right up and lights). Made big (Friend 2026-11-11 "แก้เลย") */
R3.both('B06', 'poll', 'โพลในสตอรี่ สองตัวเลือก แถบคะแนนเติม', (K, s, T, g) => {
  const op = s.options.slice(0, 2), ab = s.about, ans = s.answer;
  const hd = R9.card(g, 70, 2, 460, 76, 24); K.enter(hd.o, T.b[0], 'rise');
  const q = R9.acc(hd.p, 14, 12, 52, 52, '50%'); S10.glyph(q.p, '?', 26, 26, 36, 'u-bubble-text');
  if (ab?.icon) R9.ico(hd.p, ab.icon, 98, 38, 34);
  if (ab?.label) R6.wordL(K, hd.p, ab.label, ab.icon ? 126 : 82, 14, 36, null, 310); else S10.bar(hd.p, ab?.icon ? 126 : 82, 32, 180, 14);
  const win = ans ? op.findIndex(o => o.label === ans.label || o.icon === ans.icon) : -1, share = win < 0 ? [.42, .38] : [.14, .14];
  op.forEach((o, k) => {
    const W = 220, H = 246, lit = k === win, t = (lit ? R9.acc : R9.card)(g, 70 + k * 240, 90, W, H, 28); t.p.style.overflow = 'hidden';
    if (!lit) { const lv = div(`left:0;right:0;bottom:0;height:${share[k] * 100}%`, t.p); lv.className = 'u-col-acc'; if (win >= 0) lv.style.opacity = .45;
      A(lv, [{transform: 'translateY(100%)'}, {transform: 'none'}], T.hit, .9, {e: EASE.inout}); }
    S10.iconWord(K, t.p, o, W, 30, 66, 36, lit);
    if (lit) K.mark(t.p, 'check', W / 2, H - 50, 52, T.hit + .3);
    K.enter(t.o, T.b[0] + .2 + k * .1, 'rise');
  });
}, s => (s.options ?? []).length === 2);

/* ================= B07 คำเตือน: thing {icon, label?}, how cross|flag, sign? ================= */
/* 5 · a wet-floor sign: the A-frame opens and stands, the warning and the risky thing on its board */
R3.both('B07', 'wetfloor', 'ป้ายระวังพื้นลื่น กางออกตั้งบนพื้น', (K, s, T, g) => {
  const it = s.thing ?? {icon: 'triangle-alert'}, X = 180, Y = 24, W = 240, H = 292;
  R7.plain(g, X - 40, Y + H + 2, W + 80, 10, 'main', '5px');
  const b = R9.acc(g, X, Y, W, H, 0);
  b.p.style.clipPath = `path('M68 0H172Q184 0 187 12L240 278Q242 ${H} 228 ${H}H12Q-2 ${H} 0 278L53 12Q56 0 68 0Z')`;
  S10.bar(b.p, W / 2 - 34, 18, 68, 18, null, 9);
  R9.ico(b.p, s.sign ?? 'triangle-alert', W / 2, 92, 84, 'u-bubble-text');
  R9.ico(b.p, it.icon, W / 2, 186, 58, 'u-bubble-text');
  if (it.label) R9.accWord(K, b.p, it.label, W / 2, 222, 36, null, W - 70);
  if (s.how === 'cross') K.mark(b.p, 'cross', W / 2, 186, 84, T.hit);
  b.m.style.transformOrigin = '50% 100%'; A(b.m, [{transform: 'scaleY(.2)'}, {transform: 'none'}], T.b[0], .7, {e: EASE.smooth});
});

/* 6 · a fishing hook drops in with the risky thing as its bait; a warning sign pops up beside it on the key word.
   Made big (Friend 2026-11-11 "แก้เลย"): a large bait, a thick hook with its point and barb, a big sign */
R3.both('B07', 'hook', 'เหยื่อบนเบ็ดตกปลา ป้ายเตือนเด้งข้าง ๆ', (K, s, T, g) => {
  const it = s.thing ?? {icon: 'tag'}, cx = 250, W = 250, H = 160, Y = 64, B = Y + H + 22;
  const hk = R6.group(g); K.enter(hk, T.b[0], 'drop');
  R8.svg(hk, `<path class="ln u-thin" d="M${cx} -20V${Y + 8}"/><path class="ln" d="M${cx} ${Y + 20}V${B}Q${cx} ${B + 66} ${cx - 54} ${B + 66}Q${cx - 106} ${B + 66} ${cx - 106} ${B + 8}"/>` +
    `<path class="ln" d="M${cx - 106} ${B + 8}L${cx - 80} ${B + 32}"/>`);
  const c = R9.acc(hk, cx - W / 2, Y, W, H, 26); S10.iconWord(K, c.p, it, W, 22, 66, 40, true);
  const w = S10.disc(g, 470, 128, 60, 'card'); R9.ico(w.p, s.sign ?? (s.how === 'cross' ? 'octagon-x' : 'triangle-alert'), 60, 60, 66); K.enter(w.o, T.hit, 'pop');
});

/* ================= B09 เวลา: points? [3 {icon, label?}], at?, result? ================= */
/* 7 · a stopwatch: the start button is pressed, the ring runs round, and each moment is logged as a lap beside it */
R3.both('B09', 'stopwatch', 'นาฬิกาจับเวลา กดปุ่มแล้ววงวิ่ง บันทึกแต่ละช่วงข้าง ๆ', (K, s, T, g) => {
  const pts = (s.points ?? []).slice(0, 3), n = pts.length, at = n ? Math.min(s.at ?? n - 1, n - 1) : 2, C = {x: 186, y: 190}, R = 124;
  R7.plain(g, C.x - 22, 28, 44, 26, 'main', '9px'); R7.plain(g, C.x - 9, 54, 18, 12, 'main', '2px');
  const f = S10.disc(g, C.x, C.y, R), fr = n ? (at + 1) / 3 : .7, a = fr * 2 * Math.PI;
  div(`left:0;top:0;width:${2 * R}px;height:${2 * R}px`, f.p, `<svg width="${2 * R}" height="${2 * R}"><circle class="u-ring" style="stroke-width:22px" cx="${R}" cy="${R}" r="${R - 30}"/>` +
    `<circle class="u-ring-on" style="stroke-width:22px" cx="${R}" cy="${R}" r="${R - 30}" pathLength="100" stroke-dasharray="${(fr * 100).toFixed(1)} 100" transform="rotate(-90 ${R} ${R})"/>` +
    `<path class="ln u-thin" d="M${R} ${R}L${(R + Math.sin(a) * (R - 54)).toFixed(1)} ${(R - Math.cos(a) * (R - 54)).toFixed(1)}"/><circle class="sd" cx="${R}" cy="${R}" r="10"/></svg>`);
  const rows = n ? pts : (s.result ? [s.result] : []);
  rows.forEach((p, k) => {
    const lit = n ? k === at : true, y = 66 + k * 84, r = (lit ? R9.acc : R9.card)(g, 352, y, 188, 66, 18);
    R9.ico(r.p, p.icon, 36, 33, 30, lit ? 'u-bubble-text' : 'u-label');
    if (p.label) { const w = R6.wordL(K, r.p, p.label, 62, 13, 28, null, 116); if (lit) w.classList.add('u-bubble-text'); }
    if (n && k > at) r.o.style.opacity = .35;
    K.enter(r.o, T.b[0] + .3 + k * .35, 'pop');
  });
});

/* 8 · a tree through time: bare, then in leaf, then bearing fruit (ผล); the moments run along the ground under it.
   Drawn as a real tree (Friend 2026-11-11: "ต้นไม้มันไม่เหมือนต้นไม้เลย ตั้งใจทำหน่อย"): a bumpy crown of leaves, a trunk that
   narrows and forks into branches under the crown, round fruit on the leaves */
R3.both('B09', 'tree', 'ต้นไม้เปลี่ยนตามเวลา จนออกผล', (K, s, T, g) => {
  const pts = (s.points ?? []).slice(0, 3), n = pts.length, at = n ? Math.min(s.at ?? n - 1, n - 1) : 2, res = s.result;
  const c = res ? 236 : 300, G = 266, C = {x: c, y: 96}, rx = 140, ry = 80;
  /* the trunk: wide at the ground, narrowing, forking into two branches that go up into the crown */
  const trunk = `M${c - 26} ${G}C${c - 18} ${G - 16} ${c - 13} ${G - 28} ${c - 13} ${G - 48}L${c - 58} ${C.y + 50}L${c - 42} ${C.y + 38}L${c} ${C.y + 66}` +
    `L${c + 42} ${C.y + 38}L${c + 58} ${C.y + 50}L${c + 13} ${G - 48}C${c + 13} ${G - 28} ${c + 18} ${G - 16} ${c + 26} ${G}Z`;
  /* the crown: a ring of round bumps (arcs bulging out between points round an ellipse), one closed shape */
  const nb = 10, P = [...Array(nb)].map((_, i) => { const a = -Math.PI / 2 + i * 2 * Math.PI / nb; return [C.x + rx * Math.cos(a), C.y + ry * Math.sin(a)]; });
  const crown = 'M' + P[0].map(v => v.toFixed(1)).join(' ') + P.map((q, i) => { const r = P[(i + 1) % nb], L = Math.hypot(r[0] - q[0], r[1] - q[1]), R = (L * .6).toFixed(1);
    return `A${R} ${R} 0 0 1 ${r[0].toFixed(1)} ${r[1].toFixed(1)}`; }).join('') + 'Z';
  R7.plain(g, 40, G, 520, 10, 'main', '5px');
  R8.svg(g, `<path class="sd" d="${trunk}"/>`);
  const cr = R6.group(g); R8.svg(cr, `<path class="ac" d="${crown}"/>`);
  cr.style.transformOrigin = `${c}px ${C.y + 90}px`; A(cr, [{transform: 'scale(.2)', opacity: 0}, {transform: 'none', opacity: 1}], T.b[1], .9, {e: EASE.smooth});
  /* the fruit (ผล): round, each with an ink rim so it shows on the leaves in every style; how many = how far the time got */
  const F = [[-74, -6], [-26, -44], [34, -30], [82, 12], [-40, 34], [26, 32]].slice(0, at === 2 ? 6 : at === 1 ? 2 : 0);
  F.forEach(([dx, dy], k) => {
    const x = C.x + dx, y = C.y + dy, fr = R6.group(g); fr.style.transformOrigin = `${x}px ${y}px`; K.enter(fr, T.hit + k * .08, 'pop');
    R8.svg(fr, `<path style="fill:none;stroke:var(--ink);stroke-width:4px;stroke-linecap:round" d="M${x} ${y - 14}Q${x} ${y - 22} ${x + 4} ${y - 27}"/>` +
      `<ellipse style="fill:var(--ink)" cx="${x + 11}" cy="${y - 24}" rx="8" ry="4.5" transform="rotate(-28 ${x + 11} ${y - 24})"/>`);
    const f = S10.disc(fr, x, y, 16, 'card'); f.p.style.boxShadow = '0 0 0 3px var(--ink)';
  });
  pts.forEach((p, k) => {
    const x = [50, 230, 410][k], lit = k === at, ch = (lit ? R9.acc : R9.card)(g, x, 282, 140, 50, 16);
    if (p.label) { const w = R4.word(K, ch.p, p.label, 70, 8, 28, null, 120); if (lit) w.classList.add('u-bubble-text'); }
    else R9.ico(ch.p, p.icon, 70, 25, 28, lit ? 'u-bubble-text' : 'u-label');
    if (k > at) ch.o.style.opacity = .35;
  });
  if (res) { const r = R9.acc(g, 412, 62, 140, 104, 20); S10.iconWord(K, r.p, res, 140, 12, 40, 28, true); K.enter(r.o, T.hit + .4, 'pop'); }
});

/* ================= B10 คน: who? {icon, label?}, label?, tags? [≤2] ================= */
/* 9 · a cinema seat (from the front) with a reserved card on it: the card flips up, made out to this kind of person.
   Drawn so it reads as a seat at once (LESSONS 45): tall rounded back, a cushion, armrests down to the floor */
R3.both('B10', 'seat', 'เก้าอี้มีป้ายจองไว้ให้คนกลุ่มนี้', (K, s, T, g) => {
  const who = s.who ?? {icon: 'user'}, tags = (s.tags ?? []).slice(0, 2);
  R7.plain(g, 100, 326, 400, 10, 'main', '5px');
  R7.plain(g, 178, 6, 244, 188, 'main', '44px 44px 16px 16px');
  R7.plain(g, 182, 202, 236, 58, 'main', '18px');
  [[128, 150], [422, 150]].forEach(([x, y]) => { R7.plain(g, x, y, 50, 24, 'main', '12px'); R7.plain(g, x + 8, y + 30, 34, 326 - y - 30, 'main', '8px 8px 2px 2px'); });
  const W = 214, H = 150, c = R9.card(g, 300 - W / 2, 202 - H, W, H, 18);
  const av = S10.disc(c.p, W / 2, 38, 26, 'acc'); R9.ico(av.p, who.icon, 26, 26, 30, 'u-bubble-text');
  if (s.label) R4.word(K, c.p, s.label, W / 2, 70, 30, null, W - 24);
  tags.forEach((t, k) => { const w = tags.length === 2 ? 96 : 140, x = tags.length === 2 ? 9 + k * 100 : (W - w) / 2, ch = R9.acc(c.p, x, 112, w, 30, 15); R9.accWord(K, ch.p, t, w / 2, 1, 20, null, w - 14); });
  c.m.style.transformOrigin = '50% 100%'; A(c.m, [{transform: 'perspective(700px) rotateX(80deg)'}, {transform: 'none'}], T.hit, .7, {e: EASE.smooth});
});

/* 10 · a parcel: the shipping label made out to this kind of person is slapped on the box */
R3.both('B10', 'parcel', 'กล่องพัสดุ ใบจ่าหน้าถึงคนกลุ่มนี้แปะลงบนกล่อง', (K, s, T, g) => {
  const who = s.who ?? {icon: 'user'}, tags = (s.tags ?? []).slice(0, 2);
  const F = 'M110 128H380V318H110Z', Tp = 'M110 128L172 80H442L380 128Z', Sd = 'M380 128L442 80V270L380 318Z';
  R8.svg(g, `<path class="fl" d="${Tp}"/><path class="u-fl-edge" d="${Tp}"/><path class="fl" d="${Sd}"/><path class="u-fl-edge" d="${Sd}"/><path class="fl" d="${F}"/><path class="u-fl-edge" d="${F}"/>` +
    `<path class="ac" style="stroke:none" d="M226 128L288 80H322L260 128Z"/><rect class="ac" style="stroke:none" x="226" y="128" width="34" height="40"/>`);
  const W = 222, c = R9.card(g, 134, 152, W, 142, 14);
  const av = S10.disc(c.p, 44, 46, 28, 'acc'); R9.ico(av.p, who.icon, 28, 28, 32, 'u-bubble-text');
  if (s.label) R6.wordL(K, c.p, s.label, 82, 24, 32, null, W - 96); else S10.bar(c.p, 82, 40, 110, 14);
  tags.forEach((t, k) => { const ch = R9.acc(c.p, 20 + k * 102, 92, 94, 32, 16); R9.accWord(K, ch.p, t, 47, 2, 20, null, 82); });
  if (!tags.length) [0, 1].forEach(k => S10.bar(c.p, 20, 92 + k * 22, 150 - k * 50, 12));
  K.enter(c.o, T.hit, 'drop');
});

/* ================= B12 เหตุกับผล: items [3 {icon, label?}], end? ================= */
/* 11 · a snowball rolling down a snowy hill: it is small at the first cause, bigger at the second, and big at the
   bottom (the effect). Redrawn so the hill and the snow read at once (Friend 2026-11-11 "แก้เลย") */
R3.both('B12', 'snowball', 'ก้อนหิมะกลิ้งลงเนิน ผ่านแต่ละเหตุแล้วใหญ่ขึ้น', (K, s, T, g) => {
  const it = (s.items ?? []).slice(0, 3), Bz = [[80, 110], [220, 110], [360, 200], [550, 310]];
  const bz = t => { const u = 1 - t; return [0, 1].map(i => u * u * u * Bz[0][i] + 3 * u * u * t * Bz[1][i] + 3 * u * t * t * Bz[2][i] + t * t * t * Bz[3][i]); };
  const on = (x, r) => { let a = 0, z = 1; for (let i = 0; i < 30; i++) { const m = (a + z) / 2; if (bz(m)[0] < x) a = m; else z = m; }
    const t = (a + z) / 2, p = bz(t), q = bz(Math.min(1, t + .01)), d = Math.hypot(q[0] - p[0], q[1] - p[1]);
    return {x: p[0] + r * (q[1] - p[1]) / d, y: p[1] - r * (q[0] - p[0]) / d}; };
  /* the hill: rises from the ground on the left, then the long slope down to the right (one shape, edged along its top) */
  const crv = `M8 332C8 196 30 110 ${Bz[0]}C${Bz[1]} ${Bz[2]} ${Bz[3]}`;
  R8.svg(g, `<path class="fl" style="stroke:none" d="${crv}V332Z"/><path class="u-fl-edge" d="${crv}"/>`);
  R7.plain(g, 0, 330, 550, 8, 'main', '4px');
  const ball = (p, x, r, last) => {
    const c = on(x, r), neg = p?.tone === 'neg' && last, b = S10.disc(g, c.x, c.y, r, neg ? 'neg' : 'card');
    b.p.style.boxShadow = '0 0 0 3px var(--ink)'; if (!last) b.o.style.opacity = .7;
    if (p?.icon) R9.ico(b.p, p.icon, r, last && p.label ? r - 18 : r, last ? 56 : r * 1.05, neg ? 'u-inherit' : 'u-label');
    return {b, c};
  };
  [[136, 26, 0], [276, 44, 1]].forEach(([x, r, k]) => {
    const p = it[k]; if (!p) return; const {c} = ball(p, x, r, false);
    if (p.label) { const cd = R9.card(g, c.x - 70, c.y - r - 62, 140, 50, 16); R4.word(K, cd.p, p.label, 70, 7, 26, null, 124); K.enter(cd.o, T.b[k], 'pop'); }
  });
  const last = it[2] ?? it[it.length - 1] ?? {icon: 'snowflake'}, R = 76, {b} = ball(last, 432, R, true);
  if (last.label) { const w = R4.word(K, b.p, last.label, R, R + 14, 28, null, 2 * R - 24); if (last.tone === 'neg') w.style.color = 'inherit'; }
  K.enter(b.o, T.hit, 'pop');
});

/* 12 · a pool shot: the cue hits the first ball, it hits the second, and the second goes into the pocket, where the
   effect lights up. Fewer things on the table (Friend 2026-11-11 "แก้เลย") */
R3.both('B12', 'pool', 'ลูกพูลชนต่อกัน แล้วลงหลุม', (K, s, T, g) => {
  const it = (s.items ?? []).slice(0, 3), W = 520, H = 292, R = 34;
  const c = R9.card(g, 30, 30, W, H, 38); S10.bar(c.p, 20, 20, W - 40, H - 40, null, 24);
  [[36, 36], [36, H - 36], [W - 36, H - 36]].forEach(([x, y]) => S10.disc(c.p, x, y, 20, 'main'));
  const pk = S10.disc(c.p, W - 52, 52, 36, 'acc'); pk.p.style.boxShadow = '0 0 0 8px var(--tr)';
  if (it[2]) R9.ico(pk.p, it[2].icon, 36, 36, 40, 'u-bubble-text');
  if (it[2]?.label) R4.word(K, c.p, it[2].label, W - 80, 102, 28, null, 150);
  const cb = [124, 206], ob = [300, 132];
  div(`left:0;top:0;width:${W}px;height:${H}px`, c.p, `<svg width="${W}" height="${H}" style="overflow:visible">` +
    `<path class="ln u-thin u-dash" d="M${cb[0] + 34} ${cb[1] - 16}L${ob[0] - 34} ${ob[1] + 14}M${ob[0] + 34} ${ob[1] - 14}L${W - 92} ${70}"/>` +
    `<path class="ln" d="M-70 ${cb[1] + 78}L${cb[0] - 50} ${cb[1] + 22}"/></svg>`);
  [[cb, it[0]], [ob, it[1]]].forEach(([[x, y], p]) => {
    const b = S10.disc(c.p, x, y, R, 'main'); if (p) S10.inkIco(b.p, p.icon, R, R, 36);
    if (p?.label) R4.word(K, c.p, p.label, x, y + R + 6, 28, null, 170);
  });
  K.enter(pk.o, T.hit, 'pop');
});

/* ================= B16 นิยาม: term {icon?, label}, means [1-3 {icon, label?}] ================= */
/* 13 · word cards on a ring: the card with the word flips over the big ring and shows what it means. Upright cards,
   a thick ring and the stack behind it, so it reads as study cards (Friend 2026-11-11 "แก้เลย") */
R3.both('B16', 'flash', 'บัตรคำศัพท์ร้อยห่วง พลิกจากคำไปหาความหมาย', (K, s, T, g) => {
  const term = s.term ?? {}, means = (s.means ?? []).slice(0, 3), W = 236, H = 262, X = 300 - W / 2, Y = 66;
  [[22, 7], [11, 3.5]].forEach(([o, r]) => { const b = R9.card(g, X + o, Y + o * .4, W, H, 24); b.o.classList.add('u-decor');
    b.p.style.transform = `rotate(${r}deg)`; b.p.style.transformOrigin = `${W / 2}px 26px`; });
  const c = R9.card(g, X, Y, W, H, 24);
  S10.disc(c.p, W / 2, 28, 11, 'main');
  R8.svg(g, `<circle class="ln" cx="${X + W / 2}" cy="${Y - 8}" r="40"/>`);
  if (term.label) R4.word(K, c.p, term.label, W / 2, 50, 28, null, W - 40);
  S10.bar(c.p, 24, 92, W - 48, 4, null, 2);
  const rows = means.length ? means : [{icon: term.icon ?? 'book-open'}], n = rows.length;
  if (n === 1) S10.iconWord(K, c.p, rows[0], W, 112, 62, 40);
  else rows.forEach((m, k) => { const y = 112 + k * (140 / n); R9.ico(c.p, m.icon, 46, y + 22, 34); if (m.label) R6.wordL(K, c.p, m.label, 76, y, 32, null, W - 90); });
  c.m.style.transformOrigin = '50% 0'; A(c.m, [{transform: 'perspective(900px) rotateX(-90deg)'}, {transform: 'none'}], T.hit, .7, {e: EASE.smooth});
});

/* 14 · a label maker: the word on its little screen, and out of its side comes a printed label with the meaning */
R3.both('B16', 'labeler', 'เครื่องพิมพ์ฉลาก พิมพ์ความหมายออกมา', (K, s, T, g) => {
  const term = s.term ?? {}, means = (s.means ?? []).slice(0, 3), X = 50, Y = 30, W = 190, H = 290;
  const dv = R7.plain(g, X, Y, W, H, 'main', '34px');
  const sc = R9.card(dv.p, 18, 20, W - 36, 96, 14);
  if (term.icon) R9.ico(sc.p, term.icon, (W - 36) / 2, 26, 28);
  if (term.label) R4.word(K, sc.p, term.label, (W - 36) / 2, 44, 30, null, W - 60);
  const bt = S10.disc(dv.p, W / 2, 196, 46, 'acc'); R9.ico(bt.p, 'printer', 46, 46, 40, 'u-bubble-text');
  const rows = means.length ? means : [{icon: 'tag'}], n = rows.length, th = n === 1 ? 92 : 70, gap = 18, y0 = Y + H / 2 - (n * th + (n - 1) * gap) / 2;
  rows.forEach((m, k) => {
    const t = R9.acc(g, X + W, y0 + k * (th + gap), 300, th, 0);
    t.p.style.clipPath = `polygon(0 0,100% 0,96% 25%,100% 50%,96% 75%,100% 100%,0 100%)`; t.p.style.boxShadow = 'none';
    R9.ico(t.p, m.icon, 42, th / 2, th > 80 ? 44 : 34, 'u-bubble-text');
    if (m.label) { const w = R6.wordL(K, t.p, m.label, 76, th / 2 - (th > 80 ? 26 : 21), th > 80 ? 42 : 34, null, 190); w.classList.add('u-bubble-text'); }
    t.m.style.transformOrigin = '0 50%'; A(t.m, [{clipPath: 'inset(0 100% 0 0)'}, {clipPath: 'inset(0 0 0 0)'}], T.hit + k * .3, .8, {e: 'linear'});
  });
});

/* ================= B17 ไล่รายการ: items [2-4 {icon, label?}], label? ================= */
/* 15 · a phone: on its home screen a folder has opened and shows the things inside, with the group's name on top
   (Friend 2026-11-11 "แก้เลย": the folder alone read as a row of icons in a box) */
R3.both('B17', 'folder', 'โฟลเดอร์แอปในมือถือ ขยายออกเห็นของข้างใน', (K, s, T, g) => {
  const it = (s.items ?? []).slice(0, 4), n = it.length;
  const ph = R7.plain(g, 160, 0, 280, 340, 'main', '46px'); K.enter(ph.o, T.b[0], 'rise');
  const sc = R9.card(ph.p, 12, 12, 256, 328, 36);
  for (let i = 0; i < 24; i++) { const x = 22 + (i % 4) * 58, y = 26 + Math.floor(i / 4) * 52; const a = S10.bar(sc.p, x, y, 40, 40, null, 12); a.classList.add('u-decor'); }
  if (s.label) R4.word(K, sc.p, s.label, 128, 58, 32, T.b[1], 220); else S10.bar(sc.p, 70, 72, 116, 14);
  const fd = R7.plain(sc.p, 20, 108, 216, n > 2 ? 206 : 120, 'soft', '34px'); K.enter(fd.o, T.b[1], 'pop');
  const ts = 64, gx = 40, x0 = (216 - (2 * ts + gx)) / 2;
  it.forEach((p, k) => {
    const x = x0 + (k % 2) * (ts + gx), y = 16 + Math.floor(k / 2) * 98, t = R7.plain(fd.p, x, y, ts, ts, k === 0 ? 'acc' : 'main', '18px');
    if (k === 0) R9.ico(t.p, p.icon, ts / 2, ts / 2, 34, 'u-bubble-text'); else S10.inkIco(t.p, p.icon, ts / 2, ts / 2, 34);
    if (p.label) R4.word(K, fd.p, p.label, x + ts / 2, y + ts + 2, 20, null, ts + 34);
    K.enter(t.o, T.b[1] + .2 + k * .1, 'pop');
  });
});

/* 16 · a cantilever toolbox: the trays swing up and out on their arms and show what the kit holds; the group's name on
   the box. Made big, with the box's rim and the trays' rims (Friend 2026-11-11 "แก้เลย") */
R3.both('B17', 'toolbox', 'กล่องเครื่องมือ ถาดกางออกเป็นชั้น', (K, s, T, g) => {
  const it = (s.items ?? []).slice(0, 4), n = it.length, L = it.slice(0, Math.ceil(n / 2)), Rr = it.slice(Math.ceil(n / 2));
  const arms = [[196, 214, 104, 172], [236, 214, 144, 172], [404, 214, 496, 172], [364, 214, 456, 172]];
  R8.svg(g, arms.map(([x0, y0, x1, y1]) => `<path style="fill:none;stroke:var(--sd);stroke-width:14px;stroke-linecap:round" d="M${x0} ${y0}L${x1} ${y1}"/>`).join('') +
    arms.flatMap(([x0, y0, x1, y1]) => [[x0, y0], [x1, y1]]).map(([x, y]) => `<circle class="fl" cx="${x}" cy="${y}" r="8"/><circle class="u-fl-edge" cx="${x}" cy="${y}" r="8"/>`).join('') +
    `<path class="ln" d="M256 206V182Q256 170 268 170H332Q344 170 344 182V206"/>`);
  R7.plain(g, 176, 206, 248, 16, 'main', '8px 8px 0 0');
  const base = R9.card(g, 176, 222, 248, 110, 0); base.p.style.borderRadius = '0 0 22px 22px';
  if (s.label) R4.word(K, base.p, s.label, 124, 30, 38, null, 214); else R9.ico(base.p, 'wrench', 124, 55, 48);
  [[L, 14], [Rr, 366]].forEach(([grp, x]) => {
    if (!grp.length) return;
    const W = 220, cxs = grp.length === 1 ? [W / 2] : [56, W - 56];
    /* the things stand in the tray: drawn first, the tray's rim and front then hide their lower part */
    grp.forEach((p, k) => { const ic = R9.ico(g, p.icon, x + cxs[k], 70, 70); K.enter(ic, T.b[1] + .2 + k * .1, 'rise'); });
    R7.plain(g, x, 88, W, 14, 'main', '7px 7px 0 0');
    const tr = R9.card(g, x, 102, W, 70, 0); tr.p.style.borderRadius = '0 0 16px 16px'; K.enter(tr.o, T.b[1], 'rise');
    grp.forEach((p, k) => { if (p.label) R4.word(K, tr.p, p.label, cxs[k], 16, 28, null, grp.length === 1 ? 196 : 100); });
  });
});

/* ================= B18 เล่าเหตุการณ์: what {icon, label?}, who?, when? ================= */
/* 17 · a stage: the curtains part and show what happened; when it was is on the band above */
R3.both('B18', 'curtain', 'ม่านเวทีเปิดออก เห็นเหตุการณ์', (K, s, T, g) => {
  const what = s.what ?? {icon: 'sparkles'}, who = s.who;
  R8.svg(g, `<path class="sd" d="M50 60H160Q126 150 152 316H50Z"/><path class="sd" d="M550 60H440Q474 150 448 316H550Z"/>`);
  R7.plain(g, 50, 316, 500, 14, 'main', '7px');
  const v = R9.acc(g, 50, 6, 500, 62, 0);
  v.p.style.clipPath = `path('M0 0H500V44Q479 62 458 44Q437 62 416 44Q395 62 374 44Q353 62 332 44Q311 62 290 44Q269 62 248 44Q227 62 206 44Q185 62 164 44Q143 62 122 44Q101 62 80 44Q59 62 38 44Q17 62 0 44Z')`;
  if (s.when) R9.accWord(K, v.p, s.when, 250, 2, 32, null, 400);
  const W = 230, H = 200, c = R9.card(g, 300 - W / 2, 98, W, H, 24); K.enter(c.o, T.hit, 'pop');
  if (who) { const av = S10.disc(c.p, 40, 36, 22, 'acc'); R9.ico(av.p, who.icon, 22, 22, 26, 'u-bubble-text'); if (who.label) R6.wordL(K, c.p, who.label, 70, 18, 26, null, W - 90); }
  R9.ico(c.p, what.icon, W / 2, who ? 108 : 86, 68);
  if (what.label) R4.word(K, c.p, what.label, W / 2, who ? 146 : 130, 32, null, W - 24);
});

/* 18 · a video rewinds: the playhead has run back along the bar (the dashed arrow shows how far) to the moment it
   happened, and when it was rides on the playhead. Made big (Friend 2026-11-11 "แก้เลย") */
R3.both('B18', 'rewind', 'วิดีโอย้อนกลับ แถบเวลาวิ่งย้อนไปถึงเหตุการณ์', (K, s, T, g) => {
  const what = s.what ?? {icon: 'sparkles'}, who = s.who, W = 520, H = 332;
  const c = R9.card(g, 40, 4, W, H, 28); K.enter(c.o, T.b[0], 'rise');
  const sc = S10.bar(c.p, 20, 20, W - 40, 186, null, 18);
  if (who) { R9.ico(sc, who.icon, 34, 32, 28); if (who.label) R6.wordL(K, sc, who.label, 56, 13, 28, null, 220); }
  R9.ico(sc, what.icon, (W - 40) / 2, 82, 80);
  if (what.label) R4.word(K, sc, what.label, (W - 40) / 2, 128, 38, null, W - 100);
  const rw = R9.acc(sc, W - 40 - 78, 14, 64, 64, '50%'); R9.ico(rw.p, 'rewind', 32, 32, 36, 'u-bubble-text');
  const tw = W - 40, y = 296, fx = .2, px = 20 + tw * fx;
  S10.bar(c.p, 20, y - 7, tw, 14); S10.bar(c.p, 20, y - 7, tw * fx, 14, 'u-col-acc');
  div(`left:0;top:0;width:${W}px;height:${H}px`, c.p, `<svg width="${W}" height="${H}" style="overflow:visible"><path class="ln u-thin u-dash" d="M${20 + tw * .86} ${y}H${px + 34}"/>` +
    `<path class="ln u-thin" d="M${px + 48} ${y - 12}L${px + 34} ${y}L${px + 48} ${y + 12}"/></svg>`);
  S10.disc(c.p, px, y, 18, 'acc');
  if (s.when) { const ch = R9.acc(c.p, Math.max(14, px - 80), 222, 160, 40, 20); R9.accWord(K, ch.p, s.when, 80, 2, 26, null, 146); K.enter(ch.o, T.hit, 'pop'); }
});

/* ================= B19 ความรู้สึก: feel {icon, label?}, who?, mood? ================= */
/* 19 · a person filling up with the feeling, from the feet up to the chest (good = accent, bad = red) */
R3.both('B19', 'fill', 'ตัวคนเติมสีความรู้สึกจากเท้าขึ้นมา', (K, s, T, g) => {
  const f = s.feel ?? {icon: 'smile'}, bad = s.mood === 'bad', X = 176, Y = 14, W = 248, H = 322;
  const P = `M124 0A58 58 0 1 1 123.9 0ZM14 ${H}C14 230 52 166 124 166C196 166 234 230 234 ${H}Z`;
  const body = div(`left:${X}px;top:${Y}px;width:${W}px;height:${H}px;clip-path:path('${P}');background:var(--tr)`, g);
  const lv = div(`left:0;right:0;bottom:0;height:84%`, body); lv.className = bad ? 'u-neg' : 'u-col-acc';
  A(lv, [{transform: 'translateY(100%)'}, {transform: 'none'}], T.hit - .3, 1, {e: EASE.inout});
  div(`left:${X}px;top:${Y}px;width:${W}px;height:${H}px`, g, `<svg width="${W}" height="${H}" style="overflow:visible"><path class="ln u-thin" d="${P}"/></svg>`);
  const c = R9.card(g, 404, 34, 150, 128, 22); S10.iconWord(K, c.p, f, 150, 16, 44, 30); K.enter(c.o, T.hit + .3, 'pop');
  if (s.who?.label) R4.word(K, g, s.who.label, 479, 172, 26, null, 140);
});

/* 20 · a mood slider (like a story sticker): the face slides along and the bar fills to how strong the feeling is.
   Made big (Friend 2026-11-11 "แก้เลย") */
R3.both('B19', 'slider', 'แถบเลื่อนอารมณ์ ปุ่มหน้าเลื่อนไปจนสุด', (K, s, T, g) => {
  const f = s.feel ?? {icon: 'smile'}, bad = s.mood === 'bad', X = 44, Y = 34, W = 506, H = 272, v = .8;
  const c = R9.card(g, X, Y, W, H, 36); K.enter(c.o, T.b[0], 'rise');
  if (s.who?.icon) R9.ico(c.p, s.who.icon, 58, 64, 40);
  if (f.label) R6.wordL(K, c.p, f.label, s.who?.icon ? 92 : 40, 32, 50, null, W - 140);
  const tw = W - 120, ty = 178, x0 = 60; S10.bar(c.p, x0, ty - 22, tw, 44);
  const fl = S10.bar(c.p, x0, ty - 22, tw * v, 44, bad ? 'u-neg' : 'u-col-acc'); fl.style.transformOrigin = '0 50%';
  A(fl, [{transform: 'scaleX(.1)'}, {transform: 'none'}], T.hit - .2, 1, {e: EASE.inout});
  const hd = S10.disc(c.p, x0 + tw * v, ty, 64, 'main'); S10.inkIco(hd.p, f.icon, 64, 64, 76);
  A(hd.m, [{transform: `translateX(${-tw * (v - .1)}px)`}, {transform: 'none'}], T.hit - .2, 1, {e: EASE.inout});
});

/* ================= sample sentences (s10.*), general ones (not Friend's script) ================= */
SENTENCE('s10.shop', {cat: 'B04', name: 'สมัคร ลงสินค้า เปิดขาย', say: ['สมัครก่อน ลงสินค้า', 'แล้วเปิดขาย'],
  items: [{icon: 'user-plus', label: 'สมัคร'}, {icon: 'package', label: 'ลงสินค้า'}, {icon: 'store', label: 'เปิดขาย'}], mark: {at: 2, how: 'light'}});
SENTENCE('s10.buy', {cat: 'B06', name: 'ลูกค้าลังเล ซื้อหรือไม่ซื้อ', say: ['ลูกค้ายังลังเลว่า', 'ซื้อหรือไม่ซื้อ'],
  about: {icon: 'user', label: 'ลูกค้า'}, options: [{icon: 'check', label: 'ซื้อ'}, {icon: 'x', label: 'ไม่ซื้อ'}]});
SENTENCE('s10.quiet', {cat: 'B06', name: 'ทำไมร้านเงียบ', say: ['ทำไมร้านเงียบ', 'ขนาดนี้'], about: {icon: 'store', label: 'ร้านเงียบ'}});
SENTENCE('s10.loan', {cat: 'B07', name: 'ระวังก่อนกู้เงิน', say: ['ระวังให้ดี', 'ก่อนกู้เงิน'], thing: {icon: 'landmark', label: 'กู้เงิน'}, how: 'flag', sign: 'triangle-alert'});
SENTENCE('s10.cheap', {cat: 'B07', name: 'อย่าหลงของถูก', say: ['อย่าหลงเชื่อ', 'ของถูกเกินจริง'], thing: {icon: 'tag', label: 'ของถูก'}, how: 'cross'});
SENTENCE('s10.run', {cat: 'B09', name: 'อาทิตย์แรก เดือนแรก สามเดือน', say: ['วิ่งทุกวัน อาทิตย์แรก', 'จนครบสามเดือน'],
  points: [{icon: 'calendar', label: 'อาทิตย์แรก'}, {icon: 'calendar-days', label: 'เดือนแรก'}, {icon: 'calendar-check', label: 'สามเดือน'}], at: 2});
SENTENCE('s10.grow', {cat: 'B09', name: 'ปีแรก ปีที่สอง ปีที่ห้าเห็นผล', say: ['ปีแรก ปีที่สอง', 'ปีที่ห้าเริ่มเห็นผล'],
  points: [{icon: 'sprout', label: 'ปีแรก'}, {icon: 'leaf', label: 'ปีที่สอง'}, {icon: 'trees', label: 'ปีที่ห้า'}], at: 2, result: {icon: 'trending-up', label: 'เห็นผล'}});
SENTENCE('s10.mom', {cat: 'B10', name: 'คุณแม่มือใหม่', say: ['สำหรับคุณแม่มือใหม่', 'ที่ลูกยังเล็ก'], who: {icon: 'user'}, label: 'คุณแม่มือใหม่', tags: ['ลูกยังเล็ก']});
SENTENCE('s10.seller', {cat: 'B10', name: 'แม่ค้าออนไลน์มือใหม่', say: ['คลิปนี้สำหรับแม่ค้าออนไลน์', 'มือใหม่'], who: {icon: 'store'}, label: 'แม่ค้าออนไลน์', tags: ['มือใหม่']});
SENTENCE('s10.debt', {cat: 'B12', name: 'รูดบัตร ดอกเบี้ย หนี้ท่วม', say: ['รูดบัตร ดอกเบี้ยทบ', 'จนหนี้ท่วม'],
  items: [{icon: 'credit-card', label: 'รูดบัตร'}, {icon: 'percent', label: 'ดอกเบี้ย'}, {icon: 'trending-down', label: 'หนี้ท่วม', tone: 'neg'}]});
SENTENCE('s10.share', {cat: 'B12', name: 'พอใจ บอกต่อ ยอดเพิ่ม', say: ['ลูกค้าพอใจ ก็บอกต่อ', 'ยอดเพิ่มเอง'],
  items: [{icon: 'smile', label: 'ลูกค้าพอใจ'}, {icon: 'share-2', label: 'บอกต่อ'}, {icon: 'trending-up', label: 'ยอดเพิ่ม'}]});
SENTENCE('s10.fomo', {cat: 'B16', name: 'FOMO คืออาการกลัวตกขบวน', say: ['FOMO คืออาการ', 'กลัวตกขบวน'], term: {icon: 'zap', label: 'FOMO'}, means: [{icon: 'clock', label: 'กลัวตกขบวน'}]});
SENTENCE('s10.sub', {cat: 'B16', name: 'Subscription คือจ่ายรายเดือน', say: ['Subscription คือ', 'จ่ายรายเดือน'], term: {icon: 'package', label: 'Subscription'}, means: [{icon: 'repeat', label: 'จ่ายรายเดือน'}]});
SENTENCE('s10.costs', {cat: 'B17', name: 'ต้นทุน ค่าเช่า ค่าแรง ค่าไฟ', say: ['ต้นทุนมีทั้ง ค่าเช่า', 'ค่าแรง ค่าไฟ'],
  items: [{icon: 'house', label: 'ค่าเช่า'}, {icon: 'users', label: 'ค่าแรง'}, {icon: 'zap', label: 'ค่าไฟ'}], label: 'ต้นทุน'});
SENTENCE('s10.cafe', {cat: 'B17', name: 'ร้านกาแฟต้องมี เครื่องชง นม แก้ว', say: ['ร้านกาแฟต้องมีเครื่องชง', 'นม แก้ว'],
  items: [{icon: 'coffee', label: 'เครื่องชง'}, {icon: 'milk', label: 'นม'}, {icon: 'cup-soda', label: 'แก้ว'}], label: 'ร้านกาแฟ'});
SENTENCE('s10.dad', {cat: 'B18', name: 'ปี 2010 พ่อเปิดร้านแรก', say: ['ปี 2010 พ่อ', 'เปิดร้านแรก'], what: {icon: 'store', label: 'เปิดร้านแรก'}, who: {icon: 'user', label: 'พ่อ'}, when: 'ปี 2010'});
SENTENCE('s10.quit', {cat: 'B18', name: 'ห้าปีก่อน ผมลาออก', say: ['ห้าปีก่อน ผม', 'ลาออกจากงาน'], what: {icon: 'briefcase', label: 'ลาออก'}, who: {icon: 'user', label: 'ผม'}, when: 'ห้าปีก่อน'});
SENTENCE('s10.proud', {cat: 'B19', name: 'ผมรู้สึกภูมิใจ', say: ['ผมรู้สึก', 'ภูมิใจมาก'], feel: {icon: 'heart', label: 'ภูมิใจ'}, who: {icon: 'user', label: 'ผม'}, mood: 'good'});
SENTENCE('s10.tired', {cat: 'B19', name: 'ช่วงนั้นเหนื่อยมาก', say: ['ช่วงนั้น', 'เหนื่อยมาก'], feel: {icon: 'frown', label: 'เหนื่อย'}, mood: 'bad'});
