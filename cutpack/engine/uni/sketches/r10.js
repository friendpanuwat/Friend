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
/* 1 · toy bricks: each step drops onto the one before, the tower grows step by step */
R3.both('B04', 'tower', 'ตัวต่อซ้อนเป็นตึก หล่นลงมาทีละชั้น', (K, s, T, g) => {
  const it = (s.items ?? []).slice(0, 3), mk = s.mark, W = 220, H = 90, X = 300 - W / 2, base = 322, dx = [0, 24, -14];
  R7.plain(g, 300 - 160, base, 320, 12, 'main', '6px');
  it.forEach((p, k) => {
    const y = base - (k + 1) * H, x = X + dx[k], lit = mk?.at === k && mk.how === 'light';
    const b = lit ? R9.acc(g, x, y, W, H, 14) : R9.card(g, x, y, W, H, 14);
    if (k === it.length - 1) [40, W - 98].forEach(sx => (lit ? R9.acc : R9.card)(g, x + sx, y - 20, 58, 20, '9px 9px 3px 3px'));
    S10.iconWord(K, b.p, p, W, 8, 34, 28, lit);
    if (mk?.at === k && mk.how !== 'light') K.mark(b.p, mk.how, W - 34, H / 2, 40, T.hit);
    K.enter(b.o, T.b[0] + k * .3, 'drop');
  });
});

/* 2 · a board game: the pawn hops from square to square along the track and stops on the step that matters */
R3.both('B04', 'board', 'เบี้ยเดินบนกระดานเกม กระโดดไปทีละช่อง', (K, s, T, g) => {
  const it = (s.items ?? []).slice(0, 3), mk = s.mark, at = mk ? mk.at : it.length - 1, TW = 140, TH = 104;
  const pos = [[40, 226], [230, 162], [410, 98]], top = k => [pos[k][0] + TW / 2, pos[k][1]];
  let d = '';
  for (let k = 0; k < at; k++) { const [x0, y0] = top(k), [x1, y1] = top(k + 1); d += `M${x0 + 20} ${y0 - 14}Q${(x0 + x1) / 2} ${Math.min(y0, y1) - 96} ${x1 - 20} ${y1 - 14}`; }
  if (d) R8.svg(g, `<path class="ln u-thin u-dash" d="${d}"/>`);
  it.forEach((p, k) => {
    const lit = mk?.at === k && mk.how === 'light', t = (lit ? R9.acc : R9.card)(g, pos[k][0], pos[k][1], TW, TH, 20);
    S10.iconWord(K, t.p, p, TW, 14, 40, 28, lit);
    if (mk?.at === k && mk.how !== 'light') K.mark(g, mk.how, pos[k][0] + TW - 8, pos[k][1] + 8, 42, T.hit);
  });
  /* the pawn: a head on a bell-shaped body, standing on the square it reached */
  const [px, py] = top(at);
  R8.svg(g, `<path class="ac" d="M${px - 30} ${py - 4}Q${px - 30} ${py - 18} ${px - 14} ${py - 22}L${px - 8} ${py - 52}H${px + 8}L${px + 14} ${py - 22}Q${px + 30} ${py - 18} ${px + 30} ${py - 4}Z"/>` +
    `<circle class="ac" cx="${px}" cy="${py - 66}" r="19"/>`);
});

/* ================= B06 คำถาม: about? {icon, label?}, options? [2], answer? ================= */
/* 3 · a poll sticker: the question on top, two choices with bars that fill (no answer = nearly even, still undecided) */
R3.both('B06', 'poll', 'โพลในสตอรี่ สองตัวเลือก แถบคะแนนเติม', (K, s, T, g) => {
  const op = s.options.slice(0, 2), ab = s.about, ans = s.answer, W = 440, H = 266, X = 80, Y = 36;
  const c = R9.card(g, X, Y, W, H, 28); K.enter(c.o, T.b[0], 'rise');
  const q = R9.acc(c.p, 26, 22, 58, 58, '50%'); S10.glyph(q.p, '?', 29, 29, 40, 'u-bubble-text');
  if (ab?.icon) R9.ico(c.p, ab.icon, 120, 51, 34);
  if (ab?.label) R6.wordL(K, c.p, ab.label, ab.icon ? 148 : 100, 30, 34, null, W - 170); else S10.bar(c.p, ab?.icon ? 148 : 100, 44, 150, 14);
  const win = ans ? op.findIndex(o => o.label === ans.label || o.icon === ans.icon) : -1;
  const share = win < 0 ? [.53, .47] : win === 0 ? [.84, .16] : [.16, .84];
  op.forEach((o, k) => {
    const y = 104 + k * 80, tw = W - 52;
    if (o.icon) R9.ico(c.p, o.icon, 44, y + 18, 30);
    if (o.label) R6.wordL(K, c.p, o.label, o.icon ? 70 : 26, y, 30, null, tw - 60);
    if (k === win) K.mark(c.p, 'check', W - 46, y + 18, 34, T.hit);
    S10.bar(c.p, 26, y + 44, tw, 22);
    const f = S10.bar(c.p, 26, y + 44, tw * share[k], 22, 'u-col-acc'); if (win >= 0 && k !== win) f.style.opacity = .45;
    f.style.transformOrigin = '0 50%'; A(f, [{transform: 'scaleX(0)'}, {transform: 'none'}], T.hit, .8, {e: EASE.inout});
  });
}, s => (s.options ?? []).length === 2);

/* 4 · a light bulb with a question mark inside: once the answer comes, it lights up with the answer in it */
R3.both('B06', 'bulb', 'หลอดไฟมีเครื่องหมายคำถาม ได้คำตอบแล้วไฟติด', (K, s, T, g) => {
  const ab = s.about, ans = s.answer, lit = !!ans, X = 110, Y = 12, W = 200, H = 236;
  const gl = (lit ? R9.acc : R9.card)(g, X, Y, W, H, 0);
  gl.p.style.clipPath = `path('M100 0A100 100 0 0 1 172 170Q150 196 146 236H54Q50 196 28 170A100 100 0 0 1 100 0Z')`; gl.p.style.boxShadow = 'none';
  if (!lit) gl.p.style.boxShadow = 'inset 0 0 0 4px var(--tr)';
  [[254 - 4, 92, 24], [284 - 4, 80, 20], [308 - 4, 44, 16]].forEach(([y, w, h], k) => R7.plain(g, X + W / 2 - w / 2, y, w, h, 'main', k === 2 ? '0 0 10px 10px' : '8px'));
  if (lit) { R9.ico(gl.p, ans.icon, W / 2, 100, 86, 'u-bubble-text'); R6.burst(K, g, X + W / 2, Y + 100, 104, T.hit + .2, 8); }
  else S10.glyph(gl.p, '?', W / 2, 100, 120);
  const it = lit ? ans : ab;
  if (it) { const cd = R9.card(g, 372, 70, 176, 130, 22); S10.iconWord(K, cd.p, it, 176, 18, 44, 30); K.enter(cd.o, T.hit, 'pop'); }
});

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

/* 6 · a fishing hook drops in with the risky thing as its bait; a warning sign pops up beside it on the key word */
R3.both('B07', 'hook', 'เหยื่อบนเบ็ดตกปลา ป้ายเตือนเด้งข้าง ๆ', (K, s, T, g) => {
  const it = s.thing ?? {icon: 'tag'}, cx = 250, W = 210, H = 136, Y = 104, B = Y + H + 30;
  const hk = R6.group(g); K.enter(hk, T.b[0], 'drop');
  R8.svg(hk, `<path class="ln u-thin" d="M${cx} -20V${Y + 8}"/><path class="ln" d="M${cx} ${Y + 20}V${B}Q${cx} ${B + 44} ${cx - 40} ${B + 44}Q${cx - 80} ${B + 44} ${cx - 80} ${B + 4}"/>` +
    `<path class="ln u-thin" d="M${cx - 80} ${B + 4}L${cx - 62} ${B + 20}"/>`);
  const c = R9.acc(hk, cx - W / 2, Y, W, H, 22); S10.iconWord(K, c.p, it, W, 18, 52, 32, true);
  const w = S10.disc(g, 442, 118, 46, 'card'); R9.ico(w.p, s.sign ?? (s.how === 'cross' ? 'octagon-x' : 'triangle-alert'), 46, 46, 50); K.enter(w.o, T.hit, 'pop');
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

/* 8 · a tree through time: bare, then in leaf, then bearing fruit (ผล); the moments run along the ground under it */
R3.both('B09', 'tree', 'ต้นไม้เปลี่ยนตามเวลา จนออกผล', (K, s, T, g) => {
  const pts = (s.points ?? []).slice(0, 3), n = pts.length, at = n ? Math.min(s.at ?? n - 1, n - 1) : 2, res = s.result;
  const cx = res ? 260 : 300;
  R7.plain(g, cx - 18, 176, 36, 82, 'main', '6px');
  const cn = R9.card(g, cx - 136, 14, 272, 170, '50%');
  [[70, 70], [130, 46], [196, 74], [104, 118], [176, 124]].slice(0, at === 2 ? 5 : at === 1 ? 2 : 0).forEach(([x, y]) => S10.dot(cn.p, x, y, 16));
  R7.plain(g, 40, 258, 520, 10, 'main', '5px');
  pts.forEach((p, k) => {
    const x = [50, 230, 410][k], lit = k === at, ch = (lit ? R9.acc : R9.card)(g, x, 280, 140, 50, 16);
    if (p.label) { const w = R4.word(K, ch.p, p.label, 70, 8, 28, null, 120); if (lit) w.classList.add('u-bubble-text'); }
    else R9.ico(ch.p, p.icon, 70, 25, 28, lit ? 'u-bubble-text' : 'u-label');
    if (k > at) ch.o.style.opacity = .35;
  });
  if (res) { const r = R9.acc(g, 420, 60, 140, 104, 20); S10.iconWord(K, r.p, res, 140, 12, 40, 28, true); K.enter(r.o, T.hit, 'pop'); }
});

/* ================= B10 คน: who? {icon, label?}, label?, tags? [≤2] ================= */
/* 9 · a chair with a reserved card on the seat: the card flips up, made out to this kind of person */
R3.both('B10', 'seat', 'เก้าอี้มีป้ายจองไว้ให้คนกลุ่มนี้', (K, s, T, g) => {
  const who = s.who ?? {icon: 'user'}, tags = (s.tags ?? []).slice(0, 2);
  R7.plain(g, 140, 26, 36, 214, 'main', '14px'); R7.plain(g, 140, 240, 290, 30, 'main', '12px');
  R7.plain(g, 156, 270, 20, 60, 'main', '4px'); R7.plain(g, 392, 270, 20, 60, 'main', '4px');
  const W = 220, H = 186, c = R9.card(g, 196, 240 - H, W, H, 18);
  const av = S10.disc(c.p, W / 2, 44, 30, 'acc'); R9.ico(av.p, who.icon, 30, 30, 34, 'u-bubble-text');
  if (s.label) R4.word(K, c.p, s.label, W / 2, 84, 32, null, W - 24);
  tags.forEach((t, k) => { const w = tags.length === 2 ? 98 : 150, x = tags.length === 2 ? 10 + k * 104 : (W - w) / 2, ch = R9.acc(c.p, x, 136, w, 36, 18); R9.accWord(K, ch.p, t, w / 2, 3, 22, null, w - 14); });
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
/* 11 · a snowball rolling down the slope: it grows at every cause it rolls past and ends big at the bottom (the effect) */
R3.both('B12', 'snowball', 'ก้อนหิมะกลิ้งลงเนิน ผ่านแต่ละเหตุแล้วใหญ่ขึ้น', (K, s, T, g) => {
  const it = (s.items ?? []).slice(0, 3), y = x => 66 + (x - 20) * .42, on = (px, r) => ({x: px + .387 * r, y: y(px) - .922 * r});
  const ramp = `M20 ${y(20)}L540 ${y(540)}L540 ${y(540) + 34}L20 ${y(20) + 34}Z`;
  R8.svg(g, `<path class="fl" d="${ramp}"/><path class="u-fl-edge" d="${ramp}"/>`);
  /* the size the ball had at each cause it rolled past (faint), with the cause on a card above */
  [[120, 22, 40], [240, 42, 196]].forEach(([px, r, cx], k) => {
    const p = it[k]; if (!p) return; const c = on(px, r); R8.svg(g, `<circle class="ln u-thin u-dash" cx="${c.x.toFixed(1)}" cy="${c.y.toFixed(1)}" r="${r}"/>`);
    const cd = R9.card(g, cx, c.y - r - 62, 140, 52, 16); R9.ico(cd.p, p.icon, 30, 26, 28);
    if (p.label) R6.wordL(K, cd.p, p.label, 52, 7, 26, null, 80); K.enter(cd.o, T.b[k], 'pop');
  });
  const last = it[2] ?? it[it.length - 1] ?? {icon: 'snowflake'}, R = 70, P = on(404, R), neg = last.tone === 'neg';
  const ball = S10.disc(g, P.x, P.y, R, neg ? 'neg' : 'card');
  R9.ico(ball.p, last.icon, R, last.label ? R - 16 : R, 54, neg ? 'u-inherit' : 'u-label');
  if (last.label) { const w = R4.word(K, ball.p, last.label, R, R + 14, 26, null, 2 * R - 24); if (neg) w.style.color = 'inherit'; }
  K.enter(ball.o, T.hit, 'pop');
});

/* 12 · a pool shot: the cue ball hits the second ball, and the second ball drops into the pocket (the effect) */
R3.both('B12', 'pool', 'ลูกพูลชนต่อกัน แล้วลงหลุม', (K, s, T, g) => {
  const it = (s.items ?? []).slice(0, 3), X = 40, Y = 64, W = 500, H = 260;
  const c = R9.card(g, X, Y, W, H, 36); S10.bar(c.p, 22, 22, W - 44, H - 44, null, 22);
  const P = [[34, 34], [250, 26], [W - 34, 34], [34, H - 34], [250, H - 26], [W - 34, H - 34]];
  P.forEach(([x, y], k) => { const h = S10.disc(c.p, x, y, 20, k === 2 ? 'acc' : 'main'); if (k === 2) h.p.style.boxShadow = '0 0 0 6px var(--tr)'; });
  const cb = [150, 178], ob = [W - 86, 78], R = 30;
  div(`left:0;top:0;width:${W}px;height:${H}px`, c.p, `<svg width="${W}" height="${H}" style="overflow:visible"><path class="ln u-thin u-dash" d="M${cb[0] + 34} ${cb[1] - 16}L${ob[0] - 30} ${ob[1] + 14}"/>` +
    `<path class="ln" d="M-60 ${cb[1] + 66}L${cb[0] - 46} ${cb[1] + 20}"/></svg>`);
  const b0 = S10.disc(c.p, cb[0], cb[1], R, 'main'); if (it[0]) S10.inkIco(b0.p, it[0].icon, R, R, 32);
  const b1 = S10.disc(c.p, ob[0], ob[1], R, 'main'); if (it[1]) S10.inkIco(b1.p, it[1].icon, R, R, 32);
  if (it[0]?.label) R4.word(K, c.p, it[0].label, cb[0], cb[1] + 38, 26, null, 170);
  if (it[1]?.label) R4.word(K, c.p, it[1].label, ob[0] - 30, ob[1] + 38, 26, null, 170);
  if (it[2]) { const r = R9.acc(g, 386, 0, 154, 56, 18); R9.ico(r.p, it[2].icon, 30, 28, 30, 'u-bubble-text'); if (it[2].label) { const w = R6.wordL(K, r.p, it[2].label, 54, 10, 26, null, 92); w.classList.add('u-bubble-text'); } K.enter(r.o, T.hit, 'pop'); }
});

/* ================= B16 นิยาม: term {icon?, label}, means [1-3 {icon, label?}] ================= */
/* 13 · word cards on a ring: the card with the word flips over the ring and shows what it means */
R3.both('B16', 'flash', 'บัตรคำศัพท์ร้อยห่วง พลิกจากคำไปหาความหมาย', (K, s, T, g) => {
  const term = s.term ?? {}, means = (s.means ?? []).slice(0, 3), X = 110, Y = 54, W = 380, H = 254;
  [[16, 5], [8, 2.5]].forEach(([o, r]) => { const b = R9.card(g, X + o, Y + o, W, H, 24); b.o.classList.add('u-decor'); b.p.style.transform = `rotate(${r}deg)`; b.p.style.transformOrigin = '60px 20px'; });
  const c = R9.card(g, X, Y, W, H, 24);
  S10.disc(c.p, 60, 24, 11, 'main');
  R8.svg(g, `<circle class="ln u-thin" cx="${X + 60}" cy="${Y + 2}" r="26"/>`);
  if (term.icon) R9.ico(c.p, term.icon, 120, 30, 28);
  if (term.label) R6.wordL(K, c.p, term.label, term.icon ? 144 : 100, 10, 30, null, W - 170);
  S10.bar(c.p, 28, 62, W - 56, 4, null, 2);
  const rows = means.length ? means : [{icon: term.icon ?? 'book-open'}], rh = Math.min(66, 170 / rows.length);
  rows.forEach((m, k) => {
    const y = 84 + k * rh + (170 - rows.length * rh) / 2;
    R9.ico(c.p, m.icon, 56, y + rh / 2, 40);
    if (m.label) R6.wordL(K, c.p, m.label, 92, y + rh / 2 - 27, 44, null, W - 120);
  });
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
/* 15 · a folder on a phone: it opens up and shows the things inside, with the group's name on top */
R3.both('B17', 'folder', 'โฟลเดอร์แอปในมือถือ ขยายออกเห็นของข้างใน', (K, s, T, g) => {
  const it = (s.items ?? []).slice(0, 4), n = it.length;
  if (s.label) R4.word(K, g, s.label, 300, 0, 40, T.b[0], 360); else S10.bar(g, 230, 18, 140, 16);
  const c = R9.card(g, 150, 62, 300, 272, 44); K.enter(c.o, T.b[0], 'pop');
  const cols = n === 2 ? 2 : 2, rows = n > 2 ? 2 : 1, ts = 84, gx = 52, gy = 112, x0 = (300 - (cols * ts + gx)) / 2, y0 = rows === 1 ? 82 : 22;
  it.forEach((p, k) => {
    const x = x0 + (k % cols) * (ts + gx), y = y0 + Math.floor(k / cols) * gy, t = R7.plain(c.p, x, y, ts, ts, k === 0 ? 'acc' : 'main', '24px');
    if (k === 0) R9.ico(t.p, p.icon, ts / 2, ts / 2, 42, 'u-bubble-text'); else S10.inkIco(t.p, p.icon, ts / 2, ts / 2, 42);
    if (p.label) R4.word(K, c.p, p.label, x + ts / 2, y + ts + 2, 22, null, ts + 40);
    K.enter(t.o, T.b[1] + k * .12, 'pop');
  });
});

/* 16 · a cantilever toolbox: the trays swing out to both sides and show what the kit holds; the group's name on the box */
R3.both('B17', 'toolbox', 'กล่องเครื่องมือ ถาดกางออกเป็นชั้น', (K, s, T, g) => {
  const it = (s.items ?? []).slice(0, 4), n = it.length, L = it.slice(0, Math.ceil(n / 2)), Rr = it.slice(Math.ceil(n / 2));
  /* the arms that hold each tray to the box (drawn first, under everything) */
  R8.svg(g, `<path class="ln u-thin" d="M200 232L118 196M250 232L168 196M400 232L482 196M350 232L432 196"/>`);
  const base = R9.card(g, 176, 222, 248, 106, 22);
  R7.plain(g, 260, 204, 80, 18, 'main', '9px 9px 0 0');
  if (s.label) R4.word(K, base.p, s.label, 124, 30, 36, null, 214); else R9.ico(base.p, 'wrench', 124, 53, 44);
  [[L, 48], [Rr, 362]].forEach(([grp, x]) => {
    if (!grp.length) return;
    const W = 190;
    /* the things stand in the tray: drawn first, the tray's front then hides their lower part */
    grp.forEach((p, k) => { const cx = grp.length === 1 ? W / 2 : 50 + k * 90; const ic = R9.ico(g, p.icon, x + cx, 112, 60); K.enter(ic, T.b[1] + .2 + k * .1, 'rise'); });
    const tr = R9.card(g, x, 126, W, 70, 16); K.enter(tr.o, T.b[1], 'rise');
    grp.forEach((p, k) => { const cx = grp.length === 1 ? W / 2 : 50 + k * 90; if (p.label) R4.word(K, tr.p, p.label, cx, 16, 26, null, grp.length === 1 ? 170 : 86); });
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

/* 18 · a video rewinds: the playhead runs back along the bar to the moment it happened */
R3.both('B18', 'rewind', 'วิดีโอย้อนกลับ แถบเวลาวิ่งย้อนไปถึงเหตุการณ์', (K, s, T, g) => {
  const what = s.what ?? {icon: 'sparkles'}, who = s.who, X = 70, Y = 18, W = 460, H = 304;
  const c = R9.card(g, X, Y, W, H, 26); K.enter(c.o, T.b[0], 'rise');
  const sc = S10.bar(c.p, 20, 20, W - 40, 196, null, 16);
  if (who) { R9.ico(sc, who.icon, 32, 30, 26); if (who.label) R6.wordL(K, sc, who.label, 52, 12, 26, null, 200); }
  R9.ico(sc, what.icon, (W - 40) / 2, 82, 74);
  if (what.label) R4.word(K, sc, what.label, (W - 40) / 2, 126, 34, null, W - 80);
  const rw = R9.acc(sc, W - 40 - 66, 12, 54, 54, '50%'); R9.ico(rw.p, 'rewind', 27, 27, 30, 'u-bubble-text');
  const tw = W - 40, fx = .22;
  S10.bar(c.p, 20, 236, tw, 10); S10.bar(c.p, 20, 236, tw * fx, 10, 'u-col-acc');
  S10.disc(c.p, 20 + tw * fx, 241, 15, 'acc');
  if (s.when) R6.wordL(K, c.p, s.when, 20, 260, 28, null, tw);
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

/* 20 · a mood slider (like a story sticker): the face slides along and the bar fills to how strong the feeling is */
R3.both('B19', 'slider', 'แถบเลื่อนอารมณ์ ปุ่มหน้าเลื่อนไปจนสุด', (K, s, T, g) => {
  const f = s.feel ?? {icon: 'smile'}, bad = s.mood === 'bad', X = 80, Y = 64, W = 440, H = 210, v = .8;
  const c = R9.card(g, X, Y, W, H, 32); K.enter(c.o, T.b[0], 'rise');
  if (s.who?.icon) R9.ico(c.p, s.who.icon, 48, 50, 32);
  if (f.label) R6.wordL(K, c.p, f.label, s.who?.icon ? 76 : 32, 26, 38, null, W - 120);
  const tw = W - 64; S10.bar(c.p, 32, 132, tw, 26);
  const fl = S10.bar(c.p, 32, 132, tw * v, 26, bad ? 'u-neg' : 'u-col-acc'); fl.style.transformOrigin = '0 50%';
  A(fl, [{transform: 'scaleX(.1)'}, {transform: 'none'}], T.hit - .2, 1, {e: EASE.inout});
  const hd = S10.disc(c.p, 32 + tw * v, 145, 48, 'main'); S10.inkIco(hd.p, f.icon, 48, 48, 56);
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
