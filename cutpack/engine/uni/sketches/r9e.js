/* =====================================================================
   CutPack · uni · SKETCHES, fourth set for the round 9 refill (14 drafts): new ideas made the way the talking-head-motion
   skill designs a scene (SKILL.md, references/scene-library.md): one main element (a card, a line shape or an app UI)
   + one move that carries the meaning (fill, draw, stack, turn) on the key word, no decoration, "ถ้าปิดเสียง ยังสื่อไหม".
   Friend 2026-11-11: "คิดไอเดียใหม่เลยได้ไหมแล้วทำรูปมาให้ดูก่อนด้วย". Checked against Friend's taste (DECISIONS, round 9).
   Still pictures only (after the key word): NOT in scenes/; load with EXTRA=sketches/r9e.js.
   ===================================================================== */
const S9E = {
  onFl: el => { el.style.color = 'var(--fl-edge, var(--fl-line, var(--ink)))'; return el; },
  skel: (p, x, y, w, h = 14) => div(`left:${x}px;top:${y}px;width:${w}px;height:${h}px;border-radius:${h / 2}px;background:var(--tr)`, p),
  num(p, txt, x, y, w, h, size, align = 'center') {
    const e = div(`left:${x}px;top:${y}px;width:${w}px;height:${h}px;display:flex;align-items:center;justify-content:${align};font-size:${size}px`, p); e.className = 'u-num'; e.textContent = txt; return e;
  },
};

/* 1 · B09 เวลา · a calendar grid in an app: the days fill one by one up to the moment that is said */
R3.both('B09', 'days', 'ตารางวันในแอป ช่องเติมสีทีละวัน', (K, s, T, g) => {
  const pts = (s.points ?? []).slice(0, 3), n = pts.length, at = n ? Math.min(s.at ?? n - 1, n - 1) : 2, W = 430, H = 290, X = 300 - W / 2, Y = 24;
  const c = R9.card(g, X, Y, W, H, 26); K.enter(c.o, T.b[0], 'rise');
  const p = pts[at];
  if (p?.label) R6.wordL(K, c.p, p.label, 28, 18, 40, null, W - 120); else if (s.result) R9.ico(c.p, s.result.icon, 52, 44, 40);
  R9.ico(c.p, p?.icon ?? 'calendar', W - 50, 44, 34);
  const cols = 7, rows = 4, gx = 10, cw = (W - 56 - gx * (cols - 1)) / cols, ch = 38, on = Math.round(cols * rows * (at + 1) / 3);
  for (let i = 0; i < cols * rows; i++) {
    const x = 28 + (i % cols) * (cw + gx), y = 92 + Math.floor(i / cols) * (ch + 10);
    if (i < on) { const d = node(c.p, x, y, cw, ch, 'u-badge u-acc'); d.p.style.borderRadius = '10px'; d.p.style.boxShadow = 'none'; }
    else div(`left:${x}px;top:${y}px;width:${cw}px;height:${ch}px;border-radius:10px;background:var(--tr)`, c.p);
  }
});

/* 2 · B13 เคล็ดลับ · a password field: the dots turn into the tip when the eye is tapped */
R3.both('B13', 'password', 'ช่องรหัส ••••• กดรูปตา กลายเป็นเคล็ดลับ', (K, s, T, g) => {
  const it = s.secret ?? {icon: 'lightbulb'}, W = 440, H = 220, X = 300 - W / 2, Y = 60;
  const c = R9.card(g, X, Y, W, H, 26); K.enter(c.o, T.b[0], 'rise');
  R9.ico(c.p, 'lock-open', 46, 48, 36); S9E.skel(c.p, 80, 42, 150, 14);
  const f = div(`left:24px;top:96px;width:${W - 48}px;height:96px;border-radius:20px;background:var(--tr)`, c.p);
  R9.ico(f, it.icon, 44, 48, 32);
  if (it.label) R6.wordL(K, f, it.label, 74, 22, 42, null, W - 200);
  const eye = R9.acc(f, W - 48 - 80, 18, 60, 60, 16); R9.ico(eye.p, 'eye', 30, 30, 32, 'u-bubble-text'); K.enter(eye.o, T.hit, 'pop');
});

/* 3 · B16 นิยาม · the word, underlined; a tooltip with its meaning pops up above it */
R3.both('B16', 'tooltip', 'คำถูกขีดเส้นใต้ แล้วกล่องความหมายเด้งขึ้นเหนือคำ', (K, s, T, g) => {
  const term = s.term ?? {}, means = (s.means ?? []).slice(0, 3), W = 400, H = 60 + 46 * Math.max(1, means.length), X = 300 - W / 2, Y = 18;
  const tip = R9.card(g, X, Y, W, H, 22); K.enter(tip.o, T.hit, 'pop');
  const ar = div(`left:${300 - 16}px;top:${Y + H - 2}px;width:32px;height:18px;clip-path:polygon(0 0,100% 0,50% 100%)`, g); ar.className = 'u-panel'; R2.card({p: ar});
  (means.length ? means : [{icon: term.icon ?? 'book-open', label: ''}]).forEach((m, k) => {
    if (m.icon) R9.ico(tip.p, m.icon, 46, 52 + k * 46, 30);
    if (m.label) R6.wordL(K, tip.p, m.label, 78, 30 + k * 46, 34, null, W - 100);
  });
  if (term.label) { const w = R4.word(K, g, term.label, 300, Y + H + 40, 62, T.b[0], 500); }
  const ul = div(`left:150px;top:${Y + H + 126}px;width:300px;height:12px;border-radius:6px;transform-origin:0 50%`, g); ul.className = 'u-col-acc';
  A(ul, [{transform: 'scaleX(0)'}, {transform: 'none'}], T.b[2], .6, {e: EASE.inout});
});

/* 4 · B20 ความสัมพันธ์ · two circles joined by an infinity loop; light runs round it (over = the loop breaks) */
R3.both('B20', 'loop', 'สองวงเชื่อมด้วยเส้นวนไม่รู้จบ (จบกัน = เส้นขาด)', (K, s, T, g) => {
  const a = s.a ?? {icon: 'user'}, b = s.b ?? {icon: 'user'}, cut = !!s.cut, Y = 168, xa = 178, xb = 422, r = 70;
  const d = `M300 ${Y}C340 ${Y - 110} ${xb + 110} ${Y - 110} ${xb + 110} ${Y}S340 ${Y + 110} 300 ${Y}S${xa - 110} ${Y - 110} ${xa - 110} ${Y}S260 ${Y + 110} 300 ${Y}`;
  const lp = R8.svg(g, `<path class="u-acc-line" style="stroke-width:12px${cut ? ';stroke-dasharray:420 60 2000' : ''}" d="${d}"/>`); K.draw(lp.querySelector('path'), T.b[1], .9);
  [[a, xa], [b, xb]].forEach(([p, x], i) => {
    const n = R9.card(g, x - r, Y - r, 2 * r, 2 * r, '50%'); K.enter(n.o, T.b[0] + i * .1, 'pop');
    R9.ico(n.p, p.icon, r, p.label ? r - 14 : r, 44); if (p.label) R4.word(K, n.p, p.label, r, r + 14, 26, null, 2 * r - 30);
    if (cut && i) n.o.style.opacity = .5;
  });
  if (s.label) { const sg = cut ? node(g, 210, 0, 180, 52, 'u-badge u-soft') : R9.acc(g, 210, 0, 180, 52, 16); sg.p.style.borderRadius = '16px';
    const w = R4.word(K, sg.p, s.label, 90, 6, 32, null, 160); if (!cut) w.classList.add('u-bubble-text'); K.enter(sg.o, T.hit, 'pop'); }
  if (cut) K.mark(g, 'cross', 300, Y, 40, T.hit + .1);
});

/* 5 · B21 สถานที่ · a compass: the needle swings round and points at the place's card */
R3.both('B21', 'compass', 'เข็มทิศหมุนแล้วชี้ไปที่การ์ดสถานที่', (K, s, T, g) => {
  const pl = s.place ?? {icon: 'map-pin'}, spots = (s.spots ?? []).slice(0, 2), C = {x: 170, y: 190}, R = 122, ang = -28;
  R8.svg(g, `<circle class="fl" cx="${C.x}" cy="${C.y}" r="${R}"/><circle class="u-fl-edge" cx="${C.x}" cy="${C.y}" r="${R}"/><circle class="u-fl-edge" style="opacity:.4" cx="${C.x}" cy="${C.y}" r="${R - 24}"/>` +
    [0, 90, 180, 270].map(a => `<path class="u-fl-edge" transform="rotate(${a} ${C.x} ${C.y})" d="M${C.x} ${C.y - R + 8}V${C.y - R + 26}"/>`).join('') +
    `<g transform="rotate(${ang + 90} ${C.x} ${C.y})"><path class="ac" d="M${C.x} ${C.y - R + 30}L${C.x + 18} ${C.y}L${C.x - 18} ${C.y}Z"/><path class="u-fl-edge" style="fill:var(--tr)" d="M${C.x} ${C.y + R - 30}L${C.x + 18} ${C.y}L${C.x - 18} ${C.y}Z"/></g><circle class="sd" cx="${C.x}" cy="${C.y}" r="10"/>`);
  const H = 70 + 40 * spots.length, c = R9.card(g, 318, 36, 226, H, 20); K.enter(c.o, T.hit, 'pop');
  R9.ico(c.p, pl.icon, 34, 36, 32); if (pl.label) R6.wordL(K, c.p, pl.label, 60, 14, 34, null, 156);
  spots.forEach((sp, k) => R6.wordL(K, c.p, sp.label ?? '', 22, 70 + k * 40, 26, null, 190));
});

/* 6 · B08 เป้าหมาย · an activity ring closes all the way round; the goal sits in the middle */
R3.both('B08', 'ring', 'วงแหวนเป้าหมายปิดครบวง', (K, s, T, g) => {
  const it = s.goal ?? {icon: 'trophy'}, C = {x: 300, y: 158}, R = 118;
  R8.svg(g, `<circle class="u-ring" style="stroke-width:44px" cx="${C.x}" cy="${C.y}" r="${R}"/><circle class="u-ring-on" style="stroke-width:44px" cx="${C.x}" cy="${C.y}" r="${R}" pathLength="100" stroke-dasharray="100 100" transform="rotate(-90 ${C.x} ${C.y})"/>`);
  R9.ico(g, it.icon, C.x, C.y, 86);
  if (it.label) R4.word(K, g, it.label, C.x, C.y + R + 30, 42, T.hit, 320);
});

/* 7 · B01 ตัวเลขเด่น · a stats card: the number counts up, a small trend line draws under it */
R3.both('B01', 'stat', 'การ์ดสถิติ ตัวเลขนับขึ้น เส้นกราฟเล็กวาดใต้ตัวเลข', (K, s, T, g) => {
  const W = 440, H = 250, X = 300 - W / 2, Y = 40, down = s.dir === 'down';
  const c = R9.card(g, X, Y, W, H, 26); K.enter(c.o, T.b[0], 'rise');
  R9.ico(c.p, s.icon ?? (R2.money(s) ? 'wallet' : 'chart-line'), 46, 46, 34); S9E.skel(c.p, 80, 40, 140);
  const nb = div('left:28px;top:76px;height:96px;display:flex;align-items:baseline;gap:14px;white-space:nowrap', c.p);
  const v = document.createElement('span'); v.className = 'u-num'; v.style.fontSize = R2.fitSize(s.value, 300, 92) + 'px'; v.textContent = s.value; nb.appendChild(v);
  if (s.unit) { const u = document.createElement('span'); u.className = 'u-label'; u.style.fontSize = '34px'; u.textContent = s.unit; nb.appendChild(u); }
  R8.svg(c.p, `<path class="u-acc-line" style="stroke-width:8px" d="${down ? 'M28 190L110 196L180 206L260 214L330 226L410 232' : 'M28 232L110 222L180 226L260 206L330 196L410 178'}"/>`);
});

/* 8 · B01 ตัวเลขเด่น · a row of rolling number wheels (odometer) that roll and stop on each digit */
R3.both('B01', 'odometer', 'ล้อตัวเลขหมุนแล้วหยุดทีละหลัก', (K, s, T, g) => {
  const ch = graphemes(String(s.value)).slice(0, 8), isD = c => /\d/.test(c), wk = ch.map(c => isD(c) ? 1 : .42), U = wk.reduce((a, b) => a + b, 0);
  const tw = Math.min(84, (500 - 10 * (ch.length - 1)) / U), th = 150, W = U * tw + 10 * (ch.length - 1), Y = s.unit ? 70 : 96;
  let x = 300 - W / 2;
  ch.forEach((c, i) => {
    const w = tw * wk[i];
    if (isD(c)) { const t = R9.card(g, x, Y, w, th, 14); t.p.style.overflow = 'hidden';
      const d = +c, nb = k => S9E.num(t.p, String((d + k + 10) % 10), 0, th / 2 - 50 + k * 92, w, 100, 76);
      nb(-1).style.opacity = .2; nb(0); nb(1).style.opacity = .2; K.enter(t.o, T.b[0] + i * .06, 'rise'); }
    else S9E.num(g, c, x, Y, w, th, 76);
    x += w + 10;
  });
  if (s.unit) R4.word(K, g, s.unit, 300, Y + th + 16, 40, T.hit, 300);
});

/* 9 · B02 เพิ่มขึ้น / ลดลง · a donut chart: the accent part grows round (down = it shrinks to a sliver) */
R3.both('B02', 'donut', 'กราฟโดนัท ส่วนสีเน้นขยายหรือหด', (K, s, T, g) => {
  const up = s.dir !== 'down', v = up ? 78 : 14, C = {x: 300, y: 170}, R = 120;
  R8.svg(g, `<circle class="u-ring" style="stroke-width:56px" cx="${C.x}" cy="${C.y}" r="${R}"/><circle class="${up ? 'u-ring-on' : 'u-ring-on'}" style="stroke-width:56px${up ? '' : ';stroke:var(--neg)'}" cx="${C.x}" cy="${C.y}" r="${R}" pathLength="100" stroke-dasharray="${v} 100" transform="rotate(-90 ${C.x} ${C.y})"/>`);
  R9.ico(g, s.item?.icon ?? (up ? 'trending-up' : 'trending-down'), C.x, C.y - 6, 70);
  R9.ico(g, up ? 'arrow-up' : 'arrow-down', C.x + 150 + 40, C.y - R + 20, 54);
});

/* 10 · B02 เพิ่มขึ้น / ลดลง · a card full of dots: more and more of them light up (down = most go dark) */
R3.both('B02', 'dots', 'การ์ดจุด จุดสว่างเพิ่มขึ้นหรือดับลง', (K, s, T, g) => {
  const up = s.dir !== 'down', cols = 8, rows = 4, on = up ? 26 : 5, W = 450, H = 280, X = 300 - W / 2, Y = 30;
  const c = R9.card(g, X, Y, W, H, 26); K.enter(c.o, T.b[0], 'rise');
  if (s.item) R9.ico(c.p, s.item.icon, 46, 44, 34); S9E.skel(c.p, 80, 38, 130);
  R9.ico(c.p, up ? 'trending-up' : 'trending-down', W - 46, 44, 34);
  const d = 34, gx = (W - 56 - cols * d) / (cols - 1);
  for (let i = 0; i < cols * rows; i++) {
    const x = 28 + (i % cols) * (d + gx), y = 90 + Math.floor(i / cols) * (d + 13);
    if (i < on) { const e = node(c.p, x, y, d, d, up ? 'u-badge u-acc' : 'u-badge u-neg'); e.p.style.borderRadius = '50%'; e.p.style.boxShadow = 'none'; }
    else div(`left:${x}px;top:${y}px;width:${d}px;height:${d}px;border-radius:50%;background:var(--tr)`, c.p);
  }
});

/* 11 · B14 ประโยคเด็ด · a chat of grey messages; the line to remember gets pinned on top */
R3.both('B14', 'pinned', 'ข้อความถูกปักหมุดไว้บนสุด', (K, s, T, g) => {
  const it = s.idea ?? {icon: 'sparkles'}, X = 70, W = 460;
  [[160, 300], [214, 360], [268, 240]].forEach(([y, w], k) => { const b = div(`left:${X + (k % 2 ? W - w : 0)}px;top:${y}px;width:${w}px;height:40px;border-radius:20px;background:var(--tr)`, g); K.enter(b, T.b[0] + k * .1, 'lead'); });
  const pn = R9.card(g, X - 10, 26, W + 20, 108, 22); K.enter(pn.o, T.hit, 'drop');
  const pb = R9.acc(pn.p, 18, 24, 60, 60, 16); R9.ico(pb.p, 'pin', 30, 30, 32, 'u-bubble-text');
  if (s.idea?.label) R6.wordL(K, pn.p, it.label, 98, 22, 46, null, W - 100); else R9.ico(pn.p, it.icon, (W + 20) / 2, 54, 50);
});

/* 12 · B14 ประโยคเด็ด · a post with the line on it; the save button fills (a line worth keeping) */
R3.both('B14', 'post', 'โพสต์คำคม ปุ่มบันทึกถูกกด', (K, s, T, g) => {
  const it = s.idea ?? {icon: 'sparkles'}, W = 440, H = 280, X = 300 - W / 2, Y = 24;
  const c = R9.card(g, X, Y, W, H, 26); K.enter(c.o, T.b[0], 'rise');
  const av = R9.acc(c.p, 24, 22, 52, 52, '50%'); R9.ico(av.p, it.icon, 26, 26, 28, 'u-bubble-text'); S9E.skel(c.p, 92, 40, 140);
  if (s.idea?.label) R4.word(K, c.p, it.label, W / 2, 108, 50, null, W - 50); else R9.ico(c.p, it.icon, W / 2, 140, 70);
  ['heart', 'message-circle', 'send'].forEach((ic, k) => R9.ico(c.p, ic, 44 + k * 56, H - 40, 32));
  const sv = div(`left:${W - 64}px;top:${H - 60}px;width:40px;height:40px`, c.p, `<svg width="40" height="40" viewBox="0 0 24 24" style="fill:var(--ac);stroke:var(--ac-stroke, var(--ac));stroke-width:2;stroke-linejoin:round">${ICONS.bookmark}</svg>`);
  K.enter(sv, T.hit, 'pop');
});

/* 13 · B15 ปิดคลิป · the action's icon in a big circle; a ring draws all the way round it (the closing scene) */
R3.both('B15', 'circle', 'ไอคอนในวงกลมใหญ่ วงแหวนวาดรอบจนครบ', (K, s, T, g) => {
  const [icon] = R3.ACT[s.action] ?? R3.ACT.follow, C = {x: 300, y: s.label ? 140 : 170}, R = 96;
  const n = R9.card(g, C.x - R, C.y - R, 2 * R, 2 * R, '50%'); K.enter(n.o, T.b[0], 'pop'); R9.ico(n.p, icon, R, R, 90);
  R8.svg(g, `<circle class="u-acc-line" style="stroke-width:12px" cx="${C.x}" cy="${C.y}" r="${R + 22}"/>`);
  if (s.label) R4.word(K, g, s.label, 300, C.y + R + 34, 46, T.hit, 320);
});

/* 14 · B15 ปิดคลิป · a long button fills from left to right, then its icon turns into "done" */
R3.both('B15', 'press', 'ปุ่มยาวเติมสีจากซ้ายไปขวา แล้วกลายเป็นกดแล้ว', (K, s, T, g) => {
  const [, done] = R3.ACT[s.action] ?? R3.ACT.follow, W = 420, H = 120, X = 300 - W / 2, Y = 110;
  const b = R9.acc(g, X, Y, W, H, H / 2); K.enter(b.o, T.b[0], 'pop');
  R9.ico(b.p, done, s.label ? 80 : W / 2, H / 2, 54, 'u-bubble-text');
  if (s.label) { const w = R6.wordL(K, b.p, s.label, 128, H / 2 - 30, 46, null, W - 160); w.classList.add('u-bubble-text'); }
});

/* ================= sample sentences (s9.*) ================= */
SENTENCE('s9.diet', {cat: 'B09', name: 'อาทิตย์แรก เดือนแรก สามเดือน', say: ['ลดน้ำหนักมาครบ', 'สามเดือนแล้ว'],
  points: [{icon: 'calendar', label: 'อาทิตย์แรก'}, {icon: 'calendar-days', label: 'เดือนแรก'}, {icon: 'calendar-check', label: 'สามเดือน'}], at: 2});
SENTENCE('s9.price', {cat: 'B13', name: 'เคล็ดลับคือตั้งราคาลงท้ายเก้า', say: ['เคล็ดลับคือ', 'ราคาลงท้ายเก้า'], secret: {icon: 'tag', label: 'ลงท้ายเก้า'}});
SENTENCE('s9.cash', {cat: 'B16', name: 'กระแสเงินสดคือเงินเข้าออก', say: ['กระแสเงินสดก็คือ', 'เงินเข้าออก'],
  term: {icon: 'wallet', label: 'กระแสเงินสด'}, means: [{icon: 'arrow-down-left', label: 'เงินเข้า'}, {icon: 'arrow-up-right', label: 'เงินออก'}]});
SENTENCE('s9.friend', {cat: 'B20', name: 'เพื่อนสนิท', say: ['เราสองคนเป็น', 'เพื่อนสนิทกัน'], a: {icon: 'user', label: 'ผม'}, b: {icon: 'user', label: 'ต้น'}, label: 'เพื่อนสนิท'});
SENTENCE('s9.ex', {cat: 'B20', name: 'แฟนเก่า เลิกกันแล้ว', say: ['สุดท้ายก็', 'เลิกกันไป'], a: {icon: 'user', label: 'ผม'}, b: {icon: 'user', label: 'เขา'}, label: 'แฟนเก่า', cut: true});
SENTENCE('s9.cafe', {cat: 'B21', name: 'คาเฟ่ชั้นสอง ริมหน้าต่าง', say: ['คาเฟ่นี้อยู่ชั้นสอง', 'ริมหน้าต่าง'], place: {icon: 'coffee', label: 'คาเฟ่บ้านไม้'}, spots: [{icon: 'layers', label: 'ชั้นสอง'}, {icon: 'sun', label: 'ริมหน้าต่าง'}]});
SENTENCE('s9.million', {cat: 'B08', name: 'ยอดขายถึงล้าน', say: ['ปีนี้ยอดขาย', 'แตะหลักล้าน'], goal: {icon: 'trophy', label: 'หลักล้าน'}});
SENTENCE('s9.fans', {cat: 'B01', name: 'ผู้ติดตาม 12,000 คน', say: ['ตอนนี้มีคนติดตาม', '12,000 คน'], value: '12,000', unit: 'คน', icon: 'users'});
SENTENCE('s9.orders', {cat: 'B02', name: 'ออเดอร์เพิ่มขึ้น', say: ['พอไลฟ์ทุกวัน ออเดอร์', 'เพิ่มขึ้นเรื่อยๆ'], dir: 'up', item: {icon: 'package'}, n: 3});
SENTENCE('s9.save', {cat: 'B02', name: 'เงินเก็บหายเกือบหมด', say: ['เดือนเดียว เงินเก็บ', 'หายไปเกือบหมด'], dir: 'down', item: {icon: 'piggy-bank'}, n: 4, keep: 1});
SENTENCE('s9.daily', {cat: 'B14', name: 'ทำทุกวันชนะ', say: ['จำไว้นะ', 'ทำทุกวันชนะ'], idea: {icon: 'repeat', label: 'ทำทุกวันชนะ'}});
SENTENCE('s9.learn', {cat: 'B14', name: 'ความผิดพลาดคือครู', say: ['ความผิดพลาดคือ', 'ครูที่ดีที่สุด'], idea: {icon: 'graduation-cap', label: 'ครูที่ดีที่สุด'}});
SENTENCE('s9.bell', {cat: 'B15', name: 'กดติดตาม', say: ['อย่าลืม', 'กดติดตามนะ'], action: 'follow', label: 'กดติดตาม'});
SENTENCE('s9.like', {cat: 'B15', name: 'กดบันทึก', say: ['ใครยังไม่ว่าง', 'กดบันทึกไว้'], action: 'save', label: 'บันทึกไว้'});
