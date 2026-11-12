/* =====================================================================
   CutPack · uni · SKETCHES for round 11, new set (Friend 2026-11-11: "ผมชอบรอบที่ 1-10 มากกว่าอะ ไม่ต้องใช้ skill นี้วาดแล้ว
   กลับไปใช้ลายเส้นแบบเดิม และออกแบบใหม่ทั้งหมด (ไม่เอาคน)" · "ไม่รวม icon"). The rounds 1–10 look: rounded cards, the
   slot's icons, the accent, clear words; everyday things with a mechanism that ends on the result. No drawn people (icons,
   the person icon too, are fine). Two drafts for each of the round's ten categories (DECISIONS round 11).
   Still pictures only (the end state): NOT in scenes/; load with EXTRA=sketches/r11n.js.
   ===================================================================== */
const S12 = {
  disc(g, cx, cy, r, kind = 'card') {
    if (kind === 'card') return R9.card(g, cx - r, cy - r, 2 * r, 2 * r, '50%');
    if (kind === 'acc') return R9.acc(g, cx - r, cy - r, 2 * r, 2 * r, '50%');
    return R7.plain(g, cx - r, cy - r, 2 * r, 2 * r, kind, '50%');
  },
  inkIco: (g, icon, cx, cy, size) => R9.ico(g, icon, cx, cy, size, 'u-inherit'),
  glyph(g, txt, cx, cy, size, cls = 'u-label') {
    const e = div(`left:${cx - size}px;top:${cy - size * .62}px;width:${2 * size}px;text-align:center;font-family:KeySans;font-size:${size}px;line-height:1.25`, g);
    e.className = cls; e.textContent = txt; return e;
  },
  bar: (g, x, y, w, h, cls, r = h / 2) => { const e = div(`left:${x}px;top:${y}px;width:${w}px;height:${h}px;border-radius:${r}px`, g); if (cls) e.className = cls; else e.style.background = 'var(--tr)'; return e; },
  /* a word that takes the ink of an accent surface */
  accWord(K, p, txt, cx, y, size, maxW) { const w = R4.word(K, p, txt, cx, y, size, null, maxW); w.classList.add('u-bubble-text'); return w; },
  /* an icon above a centred word inside a holder of width w (acc = on an accent surface) */
  iconWord(K, p, it, w, y, icon = 38, word = 28, acc = false) {
    if (it?.icon) R9.ico(p, it.icon, w / 2, y + icon / 2, icon, acc ? 'u-bubble-text' : 'u-label');
    if (it?.label) { const l = R4.word(K, p, it.label, w / 2, y + icon + 6, word, null, w - 20); if (acc) l.classList.add('u-bubble-text'); }
  },
  /* a big number (and its unit) centred on cx */
  num(p, txt, cx, y, size, maxW) {
    const n = div(`left:${cx - 300}px;top:${y}px;width:600px;text-align:center`, p, `<span class="u-num" style="font-size:${size}px">${txt}</span>`);
    FITS.push(() => { const sp = n.firstChild; if (sp.offsetWidth > maxW) sp.style.fontSize = (size * maxW / sp.offsetWidth).toFixed(1) + 'px'; });
    return n;
  },
};

/* ================= B10 คน: who? {icon, label?}, label?, tags? [≤2] ================= */
/* 1 · an invitation: the card rises out of its envelope, and who it is for is on it */
R3.both('B10', 'invite', 'บัตรเชิญเลื่อนออกจากซอง ชื่อกลุ่มที่ใช่อยู่บนบัตร', (K, s, T, g) => {
  const who = s.who ?? {icon: 'user'}, w = s.label ?? who.label, tags = (s.tags ?? []).slice(0, 2);
  R7.plain(g, 110, 150, 380, 180, 'main', '22px');                                          // the back of the envelope
  const c = R9.card(g, 150, 4, 300, 286, 20);
  const d = S12.disc(c.p, 150, 66, 46, 'acc'); R9.ico(d.p, who.icon, 46, 46, 50, 'u-bubble-text');
  if (w) R4.word(K, c.p, w, 150, 122, 40, null, 260);
  if (tags.length) R4.word(K, c.p, tags.join(' · '), 150, 176, 26, null, 260);
  const f = R7.plain(g, 110, 196, 380, 134, 'main', '0 0 22px 22px');                         // the pocket, its flap cut in a V
  f.p.style.clipPath = 'polygon(0 0, 50% 46%, 100% 0, 100% 100%, 0 100%)';
  R8.svg(g, `<path class="u-fl-edge" d="M112 198L300 258L488 198"/>`);
});

/* 2 · a search with a filter: the words typed in, the filter chip lit, and one result left that fits */
R3.both('B10', 'filter', 'ช่องค้นหากับตัวกรอง เหลือผลลัพธ์ที่ใช่', (K, s, T, g) => {
  const who = s.who ?? {icon: 'user'}, w = s.label ?? who.label ?? '', tags = (s.tags ?? []).slice(0, 2);
  const c = R9.card(g, 70, 4, 460, 332, 30);
  const bar = R7.plain(c.p, 20, 18, 420, 60, 'soft', '30px'); R9.ico(bar.p, 'search', 34, 30, 30, 'u-inherit');
  R6.wordL(K, bar.p, w, 64, 10, 30, null, 330);
  const chips = tags.length ? tags : [w];
  chips.forEach((t, k) => { const ch = R9.acc(c.p, 20 + k * 200, 94, 186, 46, 23); R9.ico(ch.p, 'check', 26, 23, 24, 'u-bubble-text');
    const l = R6.wordL(K, ch.p, t, 46, 6, 24, null, 128); l.classList.add('u-bubble-text'); });
  const r = R9.card(c.p, 20, 160, 420, 78, 20); r.p.style.boxShadow = '0 0 0 4px var(--ac-stroke, var(--ac))';
  const d = S12.disc(r.p, 44, 39, 26, 'acc'); R9.ico(d.p, who.icon, 26, 26, 30, 'u-bubble-text');
  R6.wordL(K, r.p, w, 84, 18, 30, null, 300);
  [252, 290].forEach(y => { const e = S12.bar(c.p, 20, y, 420, 26, null, 13); e.style.opacity = .5; });
});

/* ================= B13 เคล็ดลับ: secret {icon, label?} ================= */
/* 3 · a magnifying glass over a page of faint lines: inside the lens the tip shows clearly */
R3.both('B13', 'magnify', 'แว่นขยายส่องกระดาษ เจอเคล็ดลับในเลนส์', (K, s, T, g) => {
  const it = s.secret ?? {icon: 'lightbulb'}, X = 260, Y = 150, R = 104;
  const pg = R9.card(g, 50, 10, 360, 320, 22);
  for (let k = 0; k < 8; k++) S12.bar(pg.p, 30, 26 + k * 36, k % 3 === 2 ? 200 : 300, 14, null, 7);
  R8.svg(g, `<path style="fill:none;stroke:var(--sd);stroke-width:34px;stroke-linecap:round" d="M${X + 80} ${Y + 80}L${X + 160} ${Y + 160}"/>`);
  const l = S12.disc(g, X, Y, R); l.p.style.boxShadow = '0 0 0 14px var(--ac-stroke, var(--ac))';
  S12.iconWord(K, l.p, it, 2 * R, it.label ? 44 : 64, 64, 34);
});

/* 4 · a key turned in a padlock: the shackle has sprung open, and the tip comes up out of it */
R3.both('B13', 'unlock', 'ลูกกุญแจไขแม่กุญแจ แม่กุญแจเด้งเปิด เคล็ดลับลอยออกมา', (K, s, T, g) => {
  const it = s.secret ?? {icon: 'lightbulb'};
  R8.svg(g, `<path style="fill:none;stroke:var(--sd);stroke-width:28px;stroke-linecap:round" d="M214 160V108Q214 52 268 52Q322 52 322 104V122"/>`);
  const b = R7.plain(g, 160, 150, 230, 172, 'main', '30px');
  S12.disc(b.p, 115, 74, 22, 'card'); R7.plain(b.p, 107, 82, 16, 44, 'card', '8px');
  R8.svg(g, `<path style="fill:none;stroke:var(--ac-stroke, var(--ac));stroke-width:16px;stroke-linecap:round" d="M300 232H392M352 232V252M372 232V248"/><circle style="fill:none;stroke:var(--ac-stroke, var(--ac));stroke-width:16px" cx="424" cy="232" r="30"/>`);
  const c = R9.acc(g, 340, 4, 200, 120, 24); S12.iconWord(K, c.p, it, 200, it.label ? 14 : 30, 48, 30, true);
});

/* ================= B20 ความสัมพันธ์: a {icon, label?}, b {icon, label?}, label?, cut? ================= */
/* 5 · two cards with "×" between them, the way a collab is announced (when it is over the × breaks red and they part) */
R3.both('B20', 'cross', 'การ์ดคู่ A × B (จบกัน = การ์ดแยก × สีแดง)', (K, s, T, g) => {
  const a = s.a ?? {icon: 'user'}, b = s.b ?? {icon: 'user'}, cut = !!s.cut;
  [[a, 46, -1], [b, 354, 1]].forEach(([it, x, side]) => {
    const c = R9.card(g, x - 16, 16, 232, 222, 30); if (cut) { c.p.style.transform = `translateX(${side * 16}px) rotate(${side * 6}deg)`; c.o.style.opacity = .8; }
    S12.iconWord(K, c.p, it, 232, it.label ? 36 : 64, 92, 40);
  });
  const x = S12.disc(g, 300, 127, 52, cut ? 'neg' : 'acc'); S12.glyph(x.p, '×', 52, 52, 80, cut ? 'u-inherit' : 'u-bubble-text');
  if (s.label) R4.word(K, g, s.label, 300, 262, 42, null, 360);
});

/* 6 · two glasses clink: each carries one side's icon, a splash jumps up where they touch (over: they stand apart) */
R3.both('B20', 'cheers', 'แก้วสองใบชนกัน ฟองกระเด็น (จบกัน = แก้วห่างกัน)', (K, s, T, g) => {
  const a = s.a ?? {icon: 'user'}, b = s.b ?? {icon: 'user'}, cut = !!s.cut;
  const glass = (it, cx, rot) => {
    const h = R6.group(g); h.style.transformOrigin = `${cx}px 300px`; h.style.transform = `rotate(${rot}deg)`;
    const W = 150, Hh = 200, x = cx - W / 2, y = 56;
    R8.svg(h, `<path class="ac" d="M${x + 14} ${y + 70}H${x + W - 14}L${x + W - 26} ${y + Hh - 16}Q${x + W - 28} ${y + Hh} ${x + W - 44} ${y + Hh}H${x + 44}Q${x + 28} ${y + Hh} ${x + 26} ${y + Hh - 16}Z"/>` +
      `<path class="u-fl-edge" style="stroke-width:6px" d="M${x} ${y}H${x + W}L${x + W - 26} ${y + Hh - 16}Q${x + W - 28} ${y + Hh} ${x + W - 44} ${y + Hh}H${x + 44}Q${x + 28} ${y + Hh} ${x + 26} ${y + Hh - 16}Z"/>`);
    R9.ico(h, it.icon, cx, y + 120, 54, 'u-bubble-text');
    if (it.label) S12.accWord(K, h, it.label, cx, y + 156, 26, 100);
  };
  glass(a, cut ? 176 : 222, cut ? -4 : 12); glass(b, cut ? 424 : 378, cut ? 4 : -12);
  if (!cut) R8.svg(g, [[300, 40, 9], [270, 20, 6], [332, 22, 7], [296, 4, 5]].map(([x, y, r]) => `<circle class="ac" cx="${x}" cy="${y}" r="${r}"/>`).join('') +
    `<path class="ln u-thin" d="M248 52L232 34M352 52L368 34M300 62V48"/>`);
  else { const x = S12.disc(g, 300, 150, 30, 'neg'); S12.glyph(x.p, '×', 30, 30, 44, 'u-inherit'); }
  if (s.label) R4.word(K, g, s.label, 300, 286, 36, null, 300);
});

/* ================= B21 สถานที่: place {icon, label?}, spots? [1-2 {icon, label?}] ================= */
/* 7 · a postcard: the place's picture on the left, its name on the right, a stamp and the postmark that stamps it */
R3.both('B21', 'postcard', 'โปสการ์ด แสตมป์แปะ ตราไปรษณีย์ประทับชื่อสถานที่', (K, s, T, g) => {
  const pl = s.place ?? {icon: 'map-pin'}, sp = (s.spots ?? []).slice(0, 2);
  const c = R9.card(g, 40, 24, 490, 296, 20); c.p.style.transform = 'rotate(-3deg)';
  const pic = R7.plain(c.p, 18, 18, 230, 260, 'soft', '14px'); S12.inkIco(pic.p, pl.icon, 115, 130, 110);
  S12.bar(c.p, 266, 30, 3, 236, null, 2);
  const st = R9.acc(c.p, 392, 18, 80, 96, 6); st.p.style.clipPath = 'polygon(0 4%,8% 0,16% 4%,24% 0,32% 4%,40% 0,48% 4%,56% 0,64% 4%,72% 0,80% 4%,88% 0,96% 4%,100% 0,100% 100%,0 100%)';
  R9.ico(st.p, pl.icon, 40, 52, 40, 'u-bubble-text');
  R8.svg(c.p, `<circle class="ln u-thin" cx="380" cy="104" r="40"/><circle class="ln u-thin" cx="380" cy="104" r="30"/><path class="ln u-thin" d="M418 92Q434 84 450 92T482 92M418 112Q434 104 450 112T482 112"/>`);
  if (pl.label) R6.wordL(K, c.p, pl.label, 286, 150, 36, null, 190);
  sp.forEach((p, k) => { R9.ico(c.p, p.icon, 300, 222 + k * 36, 24); if (p.label) R6.wordL(K, c.p, p.label, 320, 208 + k * 36, 22, null, 150); });
  if (!sp.length) [214, 246].forEach(y => S12.bar(c.p, 286, y, 180, 10, null, 5));
});

/* 8 · a check-in in an app: a little map with the pin, the place's name, and the check-in button pressed (lit) */
R3.both('B21', 'checkin', 'การ์ดเช็กอินในแอป กดปุ่มแล้วหมุดเด้ง ชื่อสถานที่ขึ้น', (K, s, T, g) => {
  const pl = s.place ?? {icon: 'map-pin'}, sp = (s.spots ?? []).slice(0, 2);
  const c = R9.card(g, 120, 4, 360, 332, 30);
  const m = R7.plain(c.p, 16, 16, 328, 136, 'soft', '20px');
  R8.svg(m.p, `<path style="fill:none;stroke:var(--tr);stroke-width:14px;stroke-linecap:round" d="M-10 96Q90 60 160 92T340 70M110 -10Q130 70 100 150M250 -10V150"/>`);
  const pin = S12.disc(m.p, 164, 62, 40, 'acc'); R9.ico(pin.p, pl.icon, 40, 40, 42, 'u-bubble-text');
  R8.svg(m.p, `<path class="ac" d="M150 98L164 122L178 98Z"/>`);
  R9.ico(c.p, pl.icon, 36, 186, 30); if (pl.label) R6.wordL(K, c.p, pl.label, 62, 164, 36, null, 270);
  sp.forEach((p, k) => { const ch = R7.plain(c.p, 16 + k * 168, 214, 156, 38, 'soft', '19px'); S12.inkIco(ch.p, p.icon, 22, 19, 20); if (p.label) R6.wordL(K, ch.p, p.label, 40, 5, 20, null, 108); });
  const bt = R9.acc(c.p, 16, 266, 328, 52, 26); R9.ico(bt.p, 'map-pin', 140, 26, 28, 'u-bubble-text'); R9.ico(bt.p, 'check', 186, 26, 28, 'u-bubble-text');
});

/* ================= B12 เหตุกับผล: items [3 {icon, label?, tone?}], end? ================= */
/* 9 · three cards joined by arrows: the light has run along each arrow and the last card (the effect) has turned over, lit */
R3.both('B12', 'arrows', 'สามการ์ดต่อด้วยลูกศร แสงวิ่งไปตามลูกศร การ์ดผลลัพธ์พลิก', (K, s, T, g) => {
  const it = (s.items ?? []).slice(0, 3), neg = it[2]?.tone === 'neg', xs = [36, 233, 420], W = 132, H = 170, Y = 60;
  it.forEach((p, k) => {
    const last = k === 2, c = last ? (neg ? R7.plain(g, xs[k], Y, W, H, 'neg', '24px') : R9.acc(g, xs[k], Y, W, H, 24)) : R9.card(g, xs[k], Y, W, H, 24);
    if (last) { R9.ico(c.p, p.icon, W / 2, 56, 56, neg ? 'u-inherit' : 'u-bubble-text'); if (p.label) { const w = R4.word(K, c.p, p.label, W / 2, 98, 26, null, W - 16); w.classList.add(neg ? 'u-inherit' : 'u-bubble-text'); } }
    else S12.iconWord(K, c.p, p, W, 30, 56, 26);
  });
  R8.svg(g, [0, 1].map(k => { const x1 = xs[k] + W + 10, x2 = xs[k + 1] - 12, y = Y + H / 2;
    return `<path class="u-acc-line" style="stroke-width:9px" d="M${x1} ${y}H${x2}M${x2 - 16} ${y - 16}L${x2} ${y}L${x2 - 16} ${y + 16}"/>`; }).join(''));
});

/* 10 · drops fall into a glass one by one (the causes) until it brims over: the water runs down its sides into a puddle,
   and the effect lights up beside it */
R3.both('B12', 'overflow', 'หยดน้ำลงแก้วจนล้น ผลลัพธ์ขึ้นข้างแก้ว', (K, s, T, g) => {
  const it = (s.items ?? []).slice(0, 3), neg = it[2]?.tone === 'neg', X = 200, top = 132, W = 180, Hh = 180, l = X - W / 2, r = X + W / 2;
  R8.svg(g, `<path class="ac" d="M${l - 46} ${top + Hh + 4}Q${X} ${top + Hh - 16} ${r + 46} ${top + Hh + 4}Q${X} ${top + Hh + 22} ${l - 46} ${top + Hh + 4}Z"/>` +
    `<path class="ac" d="M${l + 4} ${top + 4}H${r - 4}L${r - 22} ${top + Hh - 10}Q${r - 24} ${top + Hh} ${r - 38} ${top + Hh}H${l + 38}Q${l + 24} ${top + Hh} ${l + 22} ${top + Hh - 10}Z"/>` +
    `<path class="ac" d="M${l - 6} ${top + 2}Q${X} ${top - 34} ${r + 6} ${top + 2}Q${r + 16} ${top + 30} ${r + 6} ${top + 80}Q${r + 2} ${top + 96} ${r - 6} ${top + 80}L${r - 4} ${top + 8}H${l + 4}L${l + 2} ${top + 60}Q${l - 6} ${top + 76} ${l - 12} ${top + 58}Q${l - 18} ${top + 24} ${l - 6} ${top + 2}Z"/>` +
    `<path class="u-fl-edge" style="stroke-width:6px" d="M${l} ${top}L${l + 20} ${top + Hh - 10}Q${l + 22} ${top + Hh} ${l + 36} ${top + Hh}H${r - 36}Q${r - 22} ${top + Hh} ${r - 20} ${top + Hh - 10}L${r} ${top}"/>`);
  [[0, X - 46, 28], [1, X + 30, 74]].forEach(([k, x, y]) => {
    const d = R9.acc(g, x - 28, y - 30, 56, 68, 0); d.p.style.clipPath = 'polygon(50% 0, 96% 56%, 90% 80%, 70% 97%, 30% 97%, 10% 80%, 4% 56%)';
    if (it[k]) R9.ico(d.p, it[k].icon, 28, 42, 26, 'u-bubble-text');
    if (it[k]?.label) R6.wordL(K, g, it[k].label, x + 36, y - 8, 26, null, 140);
  });
  if (it[2]) { const c = neg ? R7.plain(g, 400, 120, 150, 140, 'neg', '24px') : R9.acc(g, 400, 120, 150, 140, 24);
    R9.ico(c.p, it[2].icon, 75, 50, 52, neg ? 'u-inherit' : 'u-bubble-text');
    if (it[2].label) { const w = R4.word(K, c.p, it[2].label, 75, 86, 26, null, 136); w.classList.add(neg ? 'u-inherit' : 'u-bubble-text'); } }
  R8.svg(g, `<path class="ln u-thin u-dash" d="M${r + 52} ${top + Hh - 6}Q${r + 90} ${top + Hh - 20} 396 ${top + 120}"/>`);
});

/* ================= B05 ถูกกับผิด: wrong {icon, label?}, right {icon, label?} ================= */
/* 11 · a quiz in an app: the wrong answer was tapped (red edge, ✗), the right one lights with ✓ */
R3.both('B05', 'quiz', 'ควิซในแอป ตอบผิดขึ้นแดง ตอบถูกขึ้นเขียว ✓', (K, s, T, g) => {
  const w = s.wrong ?? {icon: 'x'}, r = s.right ?? {icon: 'check'};
  const c = R9.card(g, 90, 4, 420, 332, 30);
  const q = S12.disc(c.p, 210, 50, 32, 'acc'); S12.glyph(q.p, '?', 32, 32, 44, 'u-bubble-text');
  const a = R9.card(c.p, 24, 100, 372, 96, 22); a.p.style.boxShadow = '0 0 0 4px var(--neg)';
  R9.ico(a.p, w.icon, 46, 48, 38); if (w.label) R6.wordL(K, a.p, w.label, 80, 28, 32, null, 210);
  const x = S12.disc(a.p, 330, 48, 24, 'neg'); R9.ico(x.p, 'x', 24, 24, 28, 'u-inherit');
  const b = R9.acc(c.p, 24, 214, 372, 96, 22);
  R9.ico(b.p, r.icon, 46, 48, 38, 'u-bubble-text'); if (r.label) { const l = R6.wordL(K, b.p, r.label, 80, 28, 32, null, 210); l.classList.add('u-bubble-text'); }
  R9.ico(b.p, 'circle-check', 330, 48, 44, 'u-bubble-text');
});

/* 12 · two answer sheets marked in red pen: a big ✗ on the wrong one, a big ✓ on the right one */
R3.both('B05', 'grade', 'ครูตรวจกระดาษสองแผ่น ✗ บนแผ่นผิด ✓ บนแผ่นถูก', (K, s, T, g) => {
  const w = s.wrong ?? {icon: 'x'}, r = s.right ?? {icon: 'check'};
  [[w, 50, -3], [r, 320, 3]].forEach(([it, x, rot], k) => {
    const c = R9.card(g, x, 20, 230, 290, 14); c.p.style.transform = `rotate(${rot}deg)`;
    S12.iconWord(K, c.p, it, 230, 24, 56, 32);
    [150, 184, 218, 252].forEach((y, j) => S12.bar(c.p, 30, y, j === 3 ? 110 : 170, 12, null, 6));
    if (k === 0) R8.svg(c.p, `<path class="u-cross" style="stroke-width:16px" d="M40 120L190 260M190 120L40 260"/>`);
    else R8.svg(c.p, `<path class="u-acc-line" style="stroke-width:18px" d="M40 190L96 248L196 110"/>`);
  });
});

/* ================= B11 คำพูด: quote, kind, mood, react? ================= */
/* 13 · a chat: the "typing…" dots, then the message itself pops in (what was said); a reaction on its corner */
R3.both('B11', 'typing', 'แชตกำลังพิมพ์ จุดสามจุดเด้ง แล้วข้อความขึ้น', (K, s, T, g) => {
  const q = s.quote ?? '', bad = s.mood === 'bad';
  const c = R9.card(g, 90, 4, 420, 332, 30);
  const av = S12.disc(c.p, 52, 50, 26, 'main'); S12.inkIco(av.p, 'user', 26, 26, 30); S12.bar(c.p, 92, 40, 140, 18, null, 9);
  S12.bar(c.p, 0, 94, 420, 3, null, 1);
  const d = R7.plain(c.p, 28, 118, 124, 54, 'soft', '27px 27px 27px 6px'); [34, 62, 90].forEach(x => S12.disc(d.p, x, 27, 9, 'main'));
  const m = R9.acc(c.p, 28, 188, 360, 112, '30px 30px 30px 8px');
  if (q) S12.accWord(K, m.p, q, 180, 30, 46, 320);
  if (s.react) { const r = S12.disc(c.p, 380, 290, 26, bad ? 'neg' : 'card'); if (bad) S12.inkIco(r.p, s.react, 26, 26, 28); else R9.ico(r.p, s.react, 26, 26, 28); }
});

/* 14 · an incoming call: the phone is answered, the call is on, and what was said runs as a subtitle on the screen */
R3.both('B11', 'call', 'สายเรียกเข้า กดรับสาย คำพูดขึ้นเป็นซับบนจอ', (K, s, T, g) => {
  const q = s.quote ?? '', bad = s.mood === 'bad';
  const ph = R7.plain(g, 180, 0, 240, 340, 'main', '40px'); const sc = R9.card(ph.p, 12, 12, 216, 316, 30);
  const av = S12.disc(sc.p, 108, 66, 40, 'acc'); R9.ico(av.p, 'user', 40, 40, 44, 'u-bubble-text');
  [[64, 126, 88]].forEach(([x, y, w]) => S12.bar(sc.p, x, y, w, 14, null, 7));
  const sub = R7.plain(sc.p, 14, 156, 188, 84, 'soft', '18px');
  if (q) { const w = R4.word(K, sub.p, q, 94, 20, 34, null, 170); w.classList.add('u-inherit'); }
  const on = S12.disc(sc.p, 66, 278, 26, 'acc'); R9.ico(on.p, 'phone', 26, 26, 26, 'u-bubble-text');
  const off = S12.disc(sc.p, 150, 278, 26, 'neg'); S12.inkIco(off.p, 'phone-off', 26, 26, 26);
  if (s.react) { const r = S12.disc(g, 452, 70, 30, bad ? 'neg' : 'acc'); R9.ico(r.p, s.react, 30, 30, 32, bad ? 'u-inherit' : 'u-bubble-text'); }
});

/* ================= B01 ตัวเลขเด่น: value, unit?, icon?, dir?, money? ================= */
/* 15 · a price tag hanging on its string, at rest after its swing: the amount on it (money only) */
R3.both('B01', 'tag', 'ป้ายราคาแขวน แกว่งแล้วหยุด ตัวเลขนับขึ้น', (K, s, T, g) => {
  R8.svg(g, `<path class="ln u-thin" d="M300 -20Q290 20 300 54"/>`);
  const t = R9.acc(g, 150, 40, 300, 290, 26); t.p.style.clipPath = 'polygon(50% 0, 100% 24%, 100% 100%, 0 100%, 0 24%)'; t.p.style.transform = 'rotate(-5deg)'; t.p.style.transformOrigin = '150px 0';
  const h = S12.disc(t.p, 150, 54, 14, 'card');
  if (s.icon) R9.ico(t.p, s.icon, 150, 106, 40, 'u-bubble-text');
  const n = S12.num(t.p, s.value, 150, 138, 96, 250); n.firstChild.classList.add('u-bubble-text');
  if (s.unit) S12.accWord(K, t.p, s.unit, 150, 232, 34, 220);
}, R2.money);

/* 16 · a piggy bank, the pig of Friend's ref shape for shape ("20 WAYS TO SIMPLIFY" #8 FINANCE, Friend 2026-11-11: "วาดหมูตามนี้",
   then "ไม่เหมือน อยากได้แบบเหมือน 100% แต่ไม่เอาเงานะ"). The outline is traced off the ref picture itself (its bright outline
   filled and cut away from the tail, then followed as a contour, in the ref's own pixels: the pig spans x 33–216, y 41–215),
   the edge under the ear (the ref shows it by its shading), the eye, the line on its back, the looped tail and the coin with its inner ring sit where they are in the ref. One outline
   round the whole pig, one flat body colour: no shading on the belly or in the ear, no glow. The amount counts up beside it
   (money only) */
R3.both('B01', 'piggy', 'กระปุกออมสิน เหรียญหยอดทีละเหรียญ ยอดนับขึ้น', (K, s, T, g) => {
  const k = 1.9, ox = 40 - 33 * k, oy = 6 - 41 * k, w = n => `stroke-width:${(n / k).toFixed(2)}px`;   // lines keep their width in the scaled group
  const pig = 'M62.6 84.9 L62.4 86.1 L62.5 88.0 L63.0 90.5 L63.9 93.6 L65.1 97.4 L65.3 100.9 L64.4 104.3 L62.5 107.5 L59.5 110.5 L56.8 113.8 L54.2 117.2 L52.0 121.0 L50.0 125.0 L48.1 128.0 L46.4 130.0 L44.8 131.0 L43.2 131.0 L41.7 131.2 L40.1 131.8 L38.4 132.5 L36.6 133.5 L35.2 134.4 L34.2 135.3 L33.6 136.1 L33.4 136.9 L33.2 138.8 L33.1 141.9 L33.0 146.2 L33.0 151.8 L33.1 156.2 L33.4 159.6 L33.8 161.9 L34.2 163.1 L34.9 164.2 L35.6 165.2 L36.5 166.1 L37.5 166.9 L38.9 167.6 L40.8 168.2 L43.1 168.8 L45.9 169.2 L48.4 170.2 L50.8 171.8 L53.0 173.8 L55.0 176.2 L57.4 178.8 L60.1 181.4 L63.2 184.1 L66.8 186.9 L69.7 190.2 L72.1 194.2 L73.9 198.9 L75.1 204.1 L76.3 208.2 L77.4 211.1 L78.5 212.8 L79.5 213.2 L81.4 213.6 L84.3 213.9 L88.1 214.0 L92.9 214.0 L96.7 213.8 L99.6 213.4 L101.5 212.9 L102.5 212.1 L103.5 210.9 L104.5 209.3 L105.5 207.2 L106.5 204.8 L107.6 202.9 L108.7 201.8 L109.9 201.4 L111.1 201.6 L113.8 201.8 L117.9 201.8 L123.5 201.6 L130.5 201.4 L135.9 201.8 L139.8 202.8 L142.1 204.4 L142.9 206.6 L143.8 208.6 L144.8 210.2 L145.9 211.5 L147.1 212.5 L149.2 213.2 L152.1 213.8 L155.8 214.0 L160.2 214.0 L163.9 213.9 L166.6 213.6 L168.5 213.2 L169.5 212.8 L170.6 211.5 L171.7 209.5 L172.9 206.8 L174.1 203.2 L175.2 199.9 L176.1 196.8 L176.8 193.9 L177.2 191.1 L178.1 188.4 L179.4 185.8 L181.0 183.2 L183.0 180.8 L184.9 178.1 L186.8 175.4 L188.6 172.5 L190.4 169.5 L191.9 166.6 L193.1 163.9 L194.1 161.2 L194.9 158.8 L195.4 156.0 L195.8 153.0 L196.0 149.8 L196.0 146.2 L196.2 143.5 L196.8 141.5 L197.5 140.2 L198.5 139.8 L199.2 139.2 L199.8 138.8 L200.0 138.2 L200.0 137.8 L199.7 137.3 L199.1 136.9 L198.1 136.6 L196.9 136.4 L195.8 135.6 L194.9 134.4 L194.2 132.6 L193.8 130.4 L192.9 127.8 L191.6 124.9 L190.0 121.8 L188.0 118.2 L185.6 114.8 L182.9 111.4 L179.8 108.1 L176.2 104.9 L172.9 102.1 L169.6 99.7 L166.5 97.8 L163.5 96.2 L160.4 94.9 L157.3 93.6 L154.1 92.5 L150.9 91.5 L147.7 90.7 L144.6 90.1 L141.5 89.6 L138.5 89.4 L136.2 89.1 L134.6 88.9 L133.6 88.6 L133.4 88.4 L132.0 88.2 L129.5 88.1 L125.9 88.0 L121.1 88.0 L116.4 88.2 L111.8 88.8 L107.2 89.5 L102.8 90.5 L99.1 91.0 L96.2 91.0 L94.1 90.5 L92.9 89.5 L91.0 88.4 L88.5 87.1 L85.4 85.8 L81.6 84.2 L78.2 83.1 L75.2 82.2 L72.6 81.6 L70.4 81.4 L68.4 81.3 L66.8 81.4 L65.5 81.8 L64.5 82.2 L63.7 82.9 L63.1 83.8Z';
  R8.svg(g, `<g transform="translate(${ox} ${oy}) scale(${k})">` +
    `<path style="fill:none;stroke:var(--ink);${w(6)};stroke-linecap:round;stroke-linejoin:round" d="M193 139Q199 135 201 131C195 127 196 118 204 118C211 118 211 128 205 130Q211 131 214 127L216 118"/>` +
    `<path class="fl" style="stroke:none" d="${pig}"/><path class="u-fl-edge" style="${w(6)};stroke-linejoin:round" d="${pig}"/>` +
    `<path style="fill:none;stroke:var(--fl-edge, var(--ink));${w(5)};stroke-linecap:round" d="M64 103Q78 99 92 90"/>` +
    `<path style="fill:none;stroke:var(--fl-edge, var(--ink));${w(6)};stroke-linecap:round" d="M109 101Q129 95 150 101"/>` +
    `<circle style="fill:var(--fl-edge, var(--ink))" cx="68.3" cy="129.4" r="5"/></g>`);
  const cx = ox + 128.3 * k, cy = oy + 62 * k, r = 21.5 * k, c = S12.disc(g, cx, cy, r, 'acc');
  const ring = div(`left:${r - 32}px;top:${r - 32}px;width:64px;height:64px;border-radius:50%;border:2px solid currentColor;box-sizing:border-box`, c.p); ring.className = 'u-bubble-text';
  S12.glyph(c.p, '฿', r, r, 38, 'u-bubble-text');
  const b = R9.card(g, 400, 10, 150, 124, 24);
  S12.num(b.p, s.value, 75, 22, 56, 130); if (s.unit) R4.word(K, b.p, s.unit, 75, 82, 28, null, 130);
}, R2.money);

/* ================= B02 เพิ่ม / ลด: dir, item, center?, n?, keep?, end? ================= */
/* 17 · a battery: the bars fill up one by one (up), or drain until one red bar is left (down) */
R3.both('B02', 'battery', 'แบตเตอรี่ ขีดเติมขึ้นทีละขีด หรือลดลงจนแดง', (K, s, T, g) => {
  const up = s.dir !== 'down', it = s.item ?? {icon: 'zap'};
  const b = R9.card(g, 70, 90, 420, 190, 36); R7.plain(g, 490, 148, 30, 74, 'main', '0 14px 14px 0');
  [0, 1, 2, 3].forEach(k => {
    const on = up || k === 0, x = 22 + k * 98;
    if (on) { const c = up ? R9.acc(b.p, x, 22, 82, 146, 16) : R7.plain(b.p, x, 22, 82, 146, 'neg', '16px'); if (k === 3 || (!up && k === 0)) R9.ico(c.p, it.icon, 41, 73, 40, up ? 'u-bubble-text' : 'u-inherit'); }
    else S12.bar(b.p, x, 22, 82, 146, null, 16);
  });
});

/* 18 · cardboard boxes: going up they are stacked one on another (the top one lit); going down they were taken off,
   one is left and the dashed outlines show the ones that went */
R3.both('B02', 'stack', 'กล่องพัสดุซ้อนสูงขึ้น หรือถูกหยิบออกทีละกล่อง', (K, s, T, g) => {
  const up = s.dir !== 'down', it = s.item ?? {icon: 'package'}, W = 236, H = 66;
  R7.plain(g, 140, 326, 320, 10, 'main', '5px');
  [0, 1, 2, 3].forEach(k => {
    const y = 326 - (k + 1) * H - k * 4, x = 182 + (k % 2 ? 10 : -10), on = up || k === 0, top = up && k === 3;
    if (!on) { const e = S12.bar(g, x, y, W, H, null, 10); e.style.background = 'none'; e.style.border = '4px dashed var(--tr)'; return; }
    const c = top ? R9.acc(g, x, y, W, H, 10) : R9.card(g, x, y, W, H, 10);
    const tp = R7.plain(c.p, W / 2 - 20, 0, 40, 20, top ? 'main' : 'soft', '0 0 6px 6px'); tp.p.style.boxShadow = 'none';
    R9.ico(c.p, it.icon, W / 2, H / 2 + 8, 30, top ? 'u-bubble-text' : 'u-label');
  });
});

/* ================= B14 ประโยคเด็ด: idea {icon?, label} ================= */
/* 19 · a page of a book: a highlighter has just run along one line, and that line is the punchline */
R3.both('B14', 'marker', 'ปากกาไฮไลต์ลากผ่านบรรทัด ประโยคติดสี', (K, s, T, g) => {
  const it = s.idea ?? {icon: 'quote'};
  const pg = R9.card(g, 50, 14, 420, 312, 18);
  [30, 66, 196, 232, 268].forEach((y, k) => S12.bar(pg.p, 30, y, k === 4 ? 200 : 360, 14, null, 7));
  const hl = R9.acc(pg.p, 20, 106, 380, 70, 8);
  if (it.label) S12.accWord(K, hl.p, it.label, 190, 10, 40, 340); else R9.ico(hl.p, it.icon, 190, 35, 44, 'u-bubble-text');
  const pen = R6.group(g); pen.style.transformOrigin = '470px 160px'; pen.style.transform = 'rotate(32deg)';
  R7.plain(pen, 448, 40, 46, 120, 'main', '12px'); R9.acc(pen, 448, 20, 46, 30, 10); R9.acc(pen, 458, 158, 26, 26, '4px 4px 10px 10px');
});

/* 20 · a banner on its rod unrolls downward, and the punchline is on the cloth */
R3.both('B14', 'banner', 'ป้ายผ้าคลี่ลงมาจากราว ประโยคอยู่บนผ้า', (K, s, T, g) => {
  const it = s.idea ?? {icon: 'quote'};
  R7.plain(g, 70, 10, 460, 22, 'main', '11px'); S12.disc(g, 70, 21, 18, 'main'); S12.disc(g, 530, 21, 18, 'main');
  const c = R9.acc(g, 110, 30, 380, 296, 0); c.p.style.clipPath = 'polygon(0 0, 100% 0, 100% 100%, 50% 86%, 0 100%)';
  if (it.icon) R9.ico(c.p, it.icon, 190, 70, 56, 'u-bubble-text');
  if (it.label) S12.accWord(K, c.p, it.label, 190, 116, 48, 320);
});

/* ================= sample sentences (n11.*), general ones (not Friend's script) ================= */
SENTENCE('n11.newbie', {cat: 'B10', name: 'คลิปนี้สำหรับมือใหม่', say: ['คลิปนี้สำหรับมือใหม่ที่', 'อยากขายของ'], who: {icon: 'user'}, label: 'มือใหม่', tags: ['อยากขายของ']});
SENTENCE('n11.mom', {cat: 'B10', name: 'คุณแม่มือใหม่', say: ['สำหรับคุณแม่มือใหม่', 'ที่ลูกยังเล็ก'], who: {icon: 'baby'}, label: 'คุณแม่มือใหม่', tags: ['ลูกยังเล็ก']});
SENTENCE('n11.salt', {cat: 'B13', name: 'ความลับคือเกลือหยิบมือ', say: ['ความลับของร้านนี้คือ', 'เกลือหยิบมือ'], secret: {icon: 'cooking-pot', label: 'เกลือหยิบมือ'}});
SENTENCE('n11.light', {cat: 'B13', name: 'เคล็ดลับคือแสงหน้าต่าง', say: ['เคล็ดลับของรูปสวยคือ', 'แสงหน้าต่าง'], secret: {icon: 'sun', label: 'แสงหน้าต่าง'}});
SENTENCE('n11.friend', {cat: 'B20', name: 'เพื่อนสนิท', say: ['เราสองคนเป็น', 'เพื่อนสนิทกัน'], a: {icon: 'user', label: 'ผม'}, b: {icon: 'user', label: 'ต้น'}, label: 'เพื่อนสนิท'});
SENTENCE('n11.ex', {cat: 'B20', name: 'แฟนเก่า เลิกกันแล้ว', say: ['เขาคือแฟนเก่า', 'เลิกกันไปแล้ว'], a: {icon: 'user', label: 'ผม'}, b: {icon: 'user', label: 'เขา'}, label: 'แฟนเก่า', cut: true});
SENTENCE('n11.collab', {cat: 'B20', name: 'คอลแล็บกับแบรนด์', say: ['วันนี้เราได้คอลแล็บกับ', 'แสนสิริ'], a: {icon: 'user', label: 'เรา'}, b: {icon: 'building-2', label: 'แสนสิริ'}, label: 'คอลแล็บ'});
SENTENCE('n11.cafe', {cat: 'B21', name: 'คาเฟ่ชั้นสอง ริมหน้าต่าง', say: ['คาเฟ่นี้อยู่ชั้นสอง', 'ริมหน้าต่าง'], place: {icon: 'coffee', label: 'คาเฟ่บ้านไม้'}, spots: [{icon: 'layers', label: 'ชั้นสอง'}, {icon: 'sun', label: 'ริมหน้าต่าง'}]});
SENTENCE('n11.tokyo', {cat: 'B21', name: 'ไปโตเกียว', say: ['ปีนี้ได้ไป', 'โตเกียว'], place: {icon: 'landmark', label: 'โตเกียว'}});
SENTENCE('n11.debt', {cat: 'B12', name: 'รูดบัตร ดอกเบี้ย หนี้ท่วม', say: ['รูดบัตร ดอกเบี้ยทบ', 'จนหนี้ท่วม'],
  items: [{icon: 'credit-card', label: 'รูดบัตร'}, {icon: 'percent', label: 'ดอกเบี้ยทบ'}, {icon: 'trending-down', label: 'หนี้ท่วม', tone: 'neg'}]});
SENTENCE('n11.share', {cat: 'B12', name: 'พอใจ บอกต่อ ยอดเพิ่ม', say: ['ลูกค้าพอใจ ก็บอกต่อ', 'ยอดเพิ่มเอง'],
  items: [{icon: 'smile', label: 'ลูกค้าพอใจ'}, {icon: 'share-2', label: 'บอกต่อ'}, {icon: 'trending-up', label: 'ยอดเพิ่ม'}]});
SENTENCE('n11.cheap', {cat: 'B05', name: 'ไม่ใช่ถูกสุด แต่คุ้มสุด', say: ['ไม่ใช่ราคาถูกที่สุด', 'แต่คุ้มที่สุด'], wrong: {icon: 'tag', label: 'ถูกสุด'}, right: {icon: 'gem', label: 'คุ้มสุด'}});
SENTENCE('n11.word', {cat: 'B05', name: 'อย่าเขียนขายของ เขียนแก้ปัญหา', say: ['อย่าเขียนขายของ', 'เขียนแก้ปัญหา'], wrong: {icon: 'megaphone', label: 'ขายของ'}, right: {icon: 'lightbulb', label: 'แก้ปัญหา'}});
SENTENCE('n11.call', {cat: 'B11', name: 'ลูกค้าโทรมาบอกว่าอร่อยมาก', say: ['ลูกค้าโทรมาบอกว่า', 'อร่อยมาก'], kind: 'message', quote: 'อร่อยมาก', mood: 'good', react: 'thumbs-up'});
SENTENCE('n11.fast', {cat: 'B11', name: 'คอมเมนต์ว่าส่งไวมาก', say: ['มีคนคอมเมนต์ว่า', 'ส่งไวมาก'], kind: 'comment', quote: 'ส่งไวมาก', mood: 'good', react: 'heart'});
SENTENCE('n11.price', {cat: 'B01', name: 'ราคาแค่ 990 บาท', say: ['เสื้อตัวนี้ราคาแค่', '990 บาท'], value: '990', unit: 'บาท', icon: 'shirt', money: true});
SENTENCE('n11.save', {cat: 'B01', name: 'เก็บเงินได้ 3,000 บาท', say: ['เดือนนี้เก็บเงินได้', '3,000 บาท'], value: '3,000', unit: 'บาท', icon: 'piggy-bank', money: true});
SENTENCE('n11.orders', {cat: 'B02', name: 'ออเดอร์เพิ่มขึ้น', say: ['เดือนนี้ออเดอร์', 'เพิ่มขึ้นเยอะ'], dir: 'up', item: {icon: 'package'}, n: 4});
SENTENCE('n11.stock', {cat: 'B02', name: 'ของในสต็อกลดลง', say: ['ของในสต็อก', 'ลดลงเรื่อยๆ'], dir: 'down', item: {icon: 'package'}, n: 4, keep: 1});
SENTENCE('n11.energy', {cat: 'B02', name: 'พลังเพิ่มขึ้น', say: ['พอนอนพอ', 'พลังก็เพิ่มขึ้น'], dir: 'up', item: {icon: 'zap'}, n: 4});
SENTENCE('n11.tired', {cat: 'B02', name: 'พลังลดลง', say: ['ทำงานหนักจน', 'พลังหมด'], dir: 'down', item: {icon: 'zap'}, n: 4, keep: 1});
SENTENCE('n11.daily', {cat: 'B14', name: 'ความสม่ำเสมอชนะทุกอย่าง', say: ['ความสม่ำเสมอ', 'ชนะทุกอย่าง'], idea: {icon: 'repeat', label: 'สม่ำเสมอ'}});
SENTENCE('n11.start', {cat: 'B14', name: 'ไม่ต้องเก่งก่อน แค่เริ่มก่อน', say: ['ไม่ต้องเก่งก่อน', 'แค่เริ่มก่อน'], idea: {icon: 'rocket', label: 'แค่เริ่มก่อน'}});
