/* =====================================================================
   CutPack · uni · SKETCHES, second set for the round 9 refill (14 drafts), modern and a little minimal.
   Friend 2026-11-11: "ไม่ต้องเปลี่ยนอะไรหรอกเอาแบบเดิมนั่นแหละแต่แค่คิดไอเดียมาให้มันดีกว่าเดิมก็พอ", then
   "ผมอยากได้แนวโมเดิร์นแล้วก็มีความมินิมอลหน่อยนิดนึงไม่ต้องเยอะมาก", then "ทำรูปมาให้ดูก่อนได้ไหม".
   Look: one or two main things, plain shapes, room around them, no decoration (no bursts, sparkles, confetti), one move on
   the key word. No people. Still pictures only (the moment after the key word): NOT in scenes/, so the picker never sees
   them; load with EXTRA=sketches/r9c.js. Words only from the slots; drawn with role classes only.
   ===================================================================== */
const S9C = {
  /* a gear outline with n teeth (outer radius ro, root radius ri) */
  gear(cx, cy, ro, ri, n) {
    const pts = [], st = 2 * Math.PI / n;
    for (let i = 0; i < n; i++) {
      const a = i * st, c = (r, t) => `${(cx + Math.cos(t) * r).toFixed(1)} ${(cy + Math.sin(t) * r).toFixed(1)}`;
      pts.push(c(ri, a), c(ro, a + st * .18), c(ro, a + st * .48), c(ri, a + st * .66));
    }
    return 'M' + pts.join('L') + 'Z';
  },
  solid: (name, size) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" style="fill:var(--ac);stroke:var(--ac-stroke, var(--ac));stroke-width:2;stroke-linejoin:round">${ICONS[name]}</svg>`,
  /* a word in the dark ink of a light (fl) thing, e.g. on a gear or a knob */
  onFl: el => { el.style.color = 'var(--fl-edge, var(--fl-line, var(--ink)))'; return el; },
};

/* 1 · B09 เวลา · one calendar page; it flips page by page to the moment that is said */
R3.both('B09', 'page', 'ปฏิทินหน้าเดียว พลิกทีละหน้า', (K, s, T, g) => {
  const pts = (s.points ?? []).slice(0, 3), n = pts.length, at = n ? Math.min(s.at ?? n - 1, n - 1) : 0, W = 270, H = 236, X = 300 - W / 2, Y = 52;
  const pg = R9.card(g, X, Y, W, H, 20); K.enter(pg.o, T.b[0], 'rise');
  const hd = R9.acc(pg.p, 0, 0, W, 46, '20px 20px 0 0'); hd.p.style.boxShadow = 'none';
  [W * .3, W * .7].forEach(x => div(`left:${x - 7}px;top:-12px;width:14px;height:34px;border-radius:7px;background:var(--sd)`, pg.p));
  const p = pts[at];
  if (p?.label) R4.word(K, pg.p, p.label, W / 2, 98, 52, null, W - 40);
  else if (s.result) R9.ico(pg.p, s.result.icon, W / 2, 138, 90);
  if (n > 1) pts.forEach((_, k) => div(`left:${W / 2 - (n - 1) * 16 + k * 32 - 6}px;top:${H - 36}px;width:12px;height:12px;border-radius:50%;background:var(${k === at ? '--ac' : '--tr'})`, pg.p));
});

/* 2 · B13 เคล็ดลับ · a long winding way and, beside it, a straight shortcut that lights up: the tip is written on it */
R3.both('B13', 'shortcut', 'ทางยาวคดเคี้ยว กับทางลัดเส้นตรงที่สว่างขึ้น', (K, s, T, g) => {
  const it = s.secret ?? {icon: 'lightbulb'}, A0 = {x: 86, y: 262}, B0 = {x: 506, y: 82};
  const way = R8.svg(g, `<path class="ln u-thin" style="opacity:.35" d="M${A0.x} ${A0.y}C${A0.x + 10} 180 140 70 200 90S250 300 300 286S360 120 330 70S470 190 ${B0.x} ${B0.y}"/>`); K.draw(way.querySelector('path'), T.b[0], .8);
  const cut = R8.svg(g, `<path class="u-acc-line" style="stroke-width:14px" d="M${A0.x} ${A0.y}L${B0.x} ${B0.y}"/>`); K.draw(cut.querySelector('path'), T.hit - .3, .3);
  R8.svg(g, `<circle class="sd" cx="${A0.x}" cy="${A0.y}" r="14"/><circle class="sd" cx="${B0.x}" cy="${B0.y}" r="20"/>`);
  const ang = Math.atan2(B0.y - A0.y, B0.x - A0.x) * 180 / Math.PI, mx = (A0.x + B0.x) / 2, my = (A0.y + B0.y) / 2;
  const pl = R9.acc(g, mx - 120, my - 28, 240, 56, 28); pl.o.style.transform = `rotate(${ang}deg)`;
  R9.ico(pl.p, it.icon, 34, 28, 28, 'u-bubble-text');
  if (it.label) { const w = R6.wordL(K, pl.p, it.label, 58, 6, 32, null, 166); w.classList.add('u-bubble-text'); }
  K.enter(pl.o, T.hit, 'pop');
});

/* 3 · B16 นิยาม · one word card: the front shows the word, it flips over to the meaning */
R3.both('B16', 'flashcard', 'บัตรคำ พลิกจากคำเป็นความหมาย', (K, s, T, g) => {
  const term = s.term ?? {}, means = (s.means ?? []).slice(0, 3), W = 320, H = 200, X = 300 - W / 2, Y = 66;
  const c = R9.card(g, X, Y, W, H, 22); K.enter(c.o, T.b[0], 'rise');
  if (term.label) { const t = R4.word(K, c.p, term.label, W / 2, 20, 26, null, W - 60); t.style.opacity = .55; }
  div(`left:30px;top:66px;width:${W - 60}px;height:3px;border-radius:2px;background:var(--tr)`, c.p);
  const rows = means.length ? means : [{icon: term.icon ?? 'book-open'}], top = rows.length > 1 ? 86 : 104, step = rows.length > 2 ? 34 : 44;
  rows.forEach((m, k) => {
    if (m.icon) R9.ico(c.p, m.icon, m.label ? 66 : W / 2, top + 22 + k * step, rows.length > 2 ? 26 : 34);
    if (m.label) R6.wordL(K, c.p, m.label, 96, top + k * step, rows.length > 2 ? 28 : 36, null, W - 120);
  });
});

/* 4 · B20 ความสัมพันธ์ · two gears slide together, mesh and turn as one; over = they come apart and stop */
R3.both('B20', 'gears', 'เฟืองสองตัวขบกัน หมุนไปด้วยกัน (จบกัน = หลุดออก)', (K, s, T, g) => {
  const a = s.a ?? {icon: 'user'}, b = s.b ?? {icon: 'user'}, cut = !!s.cut, Y = 168, A0 = {x: 214, r: 84}, B0 = {x: 214 + 84 + 60 - 14 + (cut ? 54 : 0), r: 66};
  const gA = R8.svg(g, `<path class="sd" d="${S9C.gear(A0.x, Y, A0.r, A0.r - 14, 12)}"/><circle class="fl" cx="${A0.x}" cy="${Y}" r="38"/>`); K.enter(gA, T.b[0], 'pop');
  const gB = R8.svg(g, `<path class="ac" d="${S9C.gear(B0.x, Y, B0.r, B0.r - 14, 10)}"/><circle class="fl" cx="${B0.x}" cy="${Y}" r="30"/>`); K.enter(gB, T.b[0] + .1, 'pop');
  if (cut) gB.style.opacity = .45;
  S9C.onFl(R9.ico(g, a.icon, A0.x, Y, 36, ''));
  S9C.onFl(R9.ico(g, b.icon, B0.x, Y, 30, ''));
  if (a.label) R4.word(K, g, a.label, A0.x, Y + A0.r + 14, 30, T.b[1], 170);
  if (b.label) R4.word(K, g, b.label, B0.x, Y + B0.r + 14, 30, T.b[1], 150);
  if (s.label) { const w = R4.word(K, g, s.label, 300, 18, 38, T.hit, 300); if (cut) w.style.opacity = .55; }
  if (cut) K.mark(g, 'cross', (A0.x + A0.r + B0.x - B0.r) / 2, Y, 44, T.hit + .1);
});

/* 5 · B21 สถานที่ · one postcard: the place's name in big letters, a stamp pressed on its corner */
R3.both('B21', 'postcard', 'โปสการ์ดใบเดียว ชื่อสถานที่ แสตมป์ปั๊มลงมุม', (K, s, T, g) => {
  const pl = s.place ?? {icon: 'map-pin'}, spots = (s.spots ?? []).slice(0, 2), W = 360, H = 220, X = 300 - W / 2, Y = 56;
  const c = R9.card(g, X, Y, W, H, 14); c.o.style.transform = 'rotate(-3deg)'; K.enter(c.m, T.b[0], 'drop');
  const pic = div(`left:16px;top:16px;width:130px;height:${H - 32}px;border-radius:10px;background:var(--tr)`, c.p); R9.ico(pic, pl.icon, 65, (H - 32) / 2, 56);
  if (pl.label) R6.wordL(K, c.p, pl.label, 164, 74, 40, null, W - 180);
  spots.forEach((sp, k) => R6.wordL(K, c.p, sp.label ?? '', 164, 128 + k * 34, 24, null, W - 180));
  const st = R9.acc(c.p, W - 74, 14, 58, 58, 6); st.p.style.outline = '3px dashed var(--ac)'; st.p.style.outlineOffset = '-7px';
  R9.ico(st.p, pl.icon, 29, 29, 26, 'u-bubble-text');
  K.enter(st.o, T.hit, 'drop');
});

/* 6 · B08 เป้าหมาย · a half-round meter: the needle sweeps into the goal zone, and the zone lights up */
R3.both('B08', 'meter', 'มาตรวัดครึ่งวง เข็มวิ่งเข้าโซนเป้าหมาย', (K, s, T, g) => {
  const it = s.goal ?? {icon: 'trophy'}, C = {x: 300, y: 236}, R = 150, z0 = .78, v = .9;
  const P = f => { const t = Math.PI * (1 - f); return `${(C.x + Math.cos(t) * R).toFixed(1)} ${(C.y - Math.sin(t) * R).toFixed(1)}`; };
  const t = Math.PI * (1 - v), nx = C.x + Math.cos(t) * (R - 36), ny = C.y - Math.sin(t) * (R - 36);
  const m = R8.svg(g, `<path class="u-ring" d="M${P(0)}A${R} ${R} 0 0 1 ${P(z0)}"/><path class="u-ring-on" d="M${P(z0 + .01)}A${R} ${R} 0 0 1 ${P(1)}"/>` +
    `<path class="ln u-thick" d="M${C.x} ${C.y}L${nx.toFixed(1)} ${ny.toFixed(1)}"/><circle class="sd" cx="${C.x}" cy="${C.y}" r="16"/>`);
  K.enter(m, T.b[0], 'pop');
  R9.ico(g, it.icon, C.x, C.y - 70, 46);
  if (it.label) R4.word(K, g, it.label, C.x, C.y + 26, 40, T.hit, 300);
});

/* 7 · B01 ตัวเลขเด่น · one notification slides down; the number in it counts up and stops on the real value (app screen) */
R3.both('B01', 'notify', 'แถบแจ้งเตือน ตัวเลขวิ่งขึ้นแล้วหยุด', (K, s, T, g) => {
  const W = 420, H = 118, X = 300 - W / 2, Y = 92;
  const n = R9.card(g, X, Y, W, H, 28); K.enter(n.m, T.b[0], 'drop');
  const ap = R9.acc(n.p, 20, 20, 78, 78, 20); R9.ico(ap.p, s.icon ?? (R2.money(s) ? 'wallet' : 'bell'), 39, 39, 38, 'u-bubble-text');
  div('left:118px;top:24px;width:120px;height:12px;border-radius:6px;background:var(--tr)', n.p);
  const nb = div(`left:116px;top:44px;height:62px;display:flex;align-items:baseline;gap:12px;white-space:nowrap`, n.p);
  const v = document.createElement('span'); v.className = 'u-num'; v.style.fontSize = R2.fitSize(s.value, 200, 58) + 'px'; v.textContent = s.value; nb.appendChild(v);
  if (s.unit) { const u = document.createElement('span'); u.className = 'u-label'; u.style.fontSize = '28px'; u.textContent = s.unit; nb.appendChild(u); }
}, null, {ui: true});

/* 8 · B01 ตัวเลขเด่น · a price tag hangs from a nail, swings a little and stops (prices only) */
R3.both('B01', 'tag', 'ป้ายราคาแขวน แกว่งแล้วหยุด', (K, s, T, g) => {
  R8.svg(g, `<circle class="sd" cx="300" cy="26" r="9"/><path class="ln u-thin" d="M300 26L300 78"/>`);
  const tg = R9.card(g, 180, 68, 240, 180, 16); tg.o.classList.add('u-receipt-wrap');
  tg.p.style.clipPath = 'polygon(50% 0, 100% 22%, 100% 100%, 0 100%, 0 22%)'; tg.p.style.borderRadius = '0 0 16px 16px';
  div('left:110px;top:22px;width:20px;height:20px;border-radius:50%;background:var(--tr)', tg.p);
  const nb = div(`left:0;top:58px;width:240px;height:80px;display:flex;align-items:center;justify-content:center;font-size:${R2.fitSize(s.value, 200, 74)}px`, tg.p);
  nb.className = 'u-num'; nb.textContent = s.value;
  if (s.unit) R4.word(K, tg.p, s.unit, 120, 136, 30, null, 200);
  tg.o.style.transformOrigin = '50% 0'; tg.o.style.transform = 'rotate(3deg)'; K.enter(tg.m, T.b[0], 'drop');
}, s => R2.money(s));

/* 9 · B02 เพิ่มขึ้น / ลดลง · one battery: up = the bars fill to full; down = one red bar is left */
R3.both('B02', 'battery', 'แบตเตอรี่ ขีดเติมจนเต็ม (ลดลง = เหลือขีดแดง)', (K, s, T, g) => {
  const up = s.dir !== 'down', n = 5, on = up ? 5 : 1, W = 300, H = 140, X = 290 - W / 2, Y = 120;
  R8.svg(g, `<rect class="sd" x="${X + W + 6}" y="${Y + H / 2 - 28}" width="22" height="56" rx="8"/>`);
  const b = R9.card(g, X, Y, W, H, 28); K.enter(b.o, T.b[0], 'rise');
  for (let i = 0; i < n; i++) {
    const x = 18 + i * ((W - 36) / n), w = (W - 36) / n - 10;
    if (i < on) { const bar = node(b.p, x, 18, w, H - 36, up ? 'u-badge u-acc' : 'u-badge u-neg'); bar.p.style.borderRadius = '10px'; bar.p.style.boxShadow = 'none'; }
    else div(`left:${x}px;top:18px;width:${w}px;height:${H - 36}px;border-radius:10px;background:var(--tr)`, b.p);
  }
  if (s.item) R9.ico(g, s.item.icon, 290, Y - 44, 44);
});

/* 10 · B02 เพิ่มขึ้น / ลดลง · plain blocks drop onto a pile: up = it grows tall; down = blocks are taken off (their outlines stay) */
R3.both('B02', 'stack', 'สี่เหลี่ยมตกลงมาซ้อนกันสูงขึ้น (ลดลง = ถูกหยิบออก)', (K, s, T, g) => {
  const up = s.dir !== 'down', N = 4, have = up ? N : Math.max(1, Math.min(N - 1, s.keep ?? 1)), w = 120, h = 54, gp = 8, base = 312;
  R6.line(K, g, `M170 ${base}H430`, T.b[0], .3);
  for (let k = 0; k < N; k++) {
    const y = base - (k + 1) * (h + gp) + gp;
    if (k < have) { const bk = R7.plain(g, 300 - w / 2, y, w, h, up && k === N - 1 ? 'acc' : 'main', '10px'); K.enter(bk.o, T.b[0] + k * .15, 'drop'); }
    else div(`left:${300 - w / 2}px;top:${y}px;width:${w}px;height:${h}px;border-radius:10px;border:3px dashed var(--tr)`, g);
  }
  if (s.item) R9.ico(g, s.item.icon, up ? 300 : 300 + w / 2 + 50, up ? base - N * (h + gp) - 22 : base - h / 2, 40);
});

/* 11 · B14 ประโยคเด็ด · grey lines of text; one line is the line to remember, and a highlighter runs over it */
R3.both('B14', 'highlight', 'บรรทัดเทาหลายบรรทัด บรรทัดเดียวถูกไฮไลต์', (K, s, T, g) => {
  const it = s.idea ?? {icon: 'sparkles'};
  [[70, 300], [116, 380], [236, 340], [282, 260]].forEach(([y, w], k) => { const l = div(`left:${300 - 210}px;top:${y}px;width:${w}px;height:16px;border-radius:8px;background:var(--tr)`, g); K.enter(l, T.b[0] + k * .06, 'lead'); });
  const hl = R9.acc(g, 300 - 210, 150, 420, 64, 10); hl.p.style.boxShadow = 'none';
  if (s.idea?.label) { R9.ico(hl.p, it.icon, 34, 32, 30, 'u-bubble-text'); const w = R6.wordL(K, hl.p, it.label, 62, 8, 40, null, 340); w.classList.add('u-bubble-text'); }
  else R9.ico(hl.p, it.icon, 210, 32, 40, 'u-bubble-text');
  A(hl.o, [{clipPath: 'inset(0 100% 0 0)'}, {clipPath: 'inset(0 0 0 0)'}], T.hit - .3, .35, {f: 'both'});
});

/* 12 · B14 ประโยคเด็ด · one sign hangs down on two strings, swings a little and settles */
R3.both('B14', 'sign', 'ป้ายแผ่นเดียวแขวนด้วยเชือกสองเส้น', (K, s, T, g) => {
  const it = s.idea ?? {icon: 'sparkles'}, W = 400, H = 116, X = 300 - W / 2, Y = 96;
  R8.svg(g, `<path class="ln u-thin" d="M${X + 50} 0L${X + 50} ${Y}M${X + W - 50} 0L${X + W - 50} ${Y}"/>`);
  const c = R9.card(g, X, Y, W, H, 18); c.o.style.transformOrigin = '50% -96px'; K.enter(c.m, T.b[1], 'drop');
  if (s.idea?.label) { R9.ico(c.p, it.icon, 48, H / 2, 40); R6.wordL(K, c.p, it.label, 84, H / 2 - 28, 46, null, W - 104); }
  else R9.ico(c.p, it.icon, W / 2, H / 2, 60);
});

/* 13 · B15 ปิดคลิป · one big switch slides to "on" and glows; the action's icon rides on its knob */
R3.both('B15', 'switch', 'สวิตช์ตัวใหญ่เลื่อนไปที่เปิด', (K, s, T, g) => {
  const [icon] = R3.ACT[s.action] ?? R3.ACT.follow, W = 260, H = 120, X = 300 - W / 2, Y = s.label ? 70 : 110;
  const tr = R9.acc(g, X, Y, W, H, H / 2); K.enter(tr.o, T.b[0], 'pop');
  const kn = node(g, X + W - H + 10, Y + 10, H - 20, H - 20, ''); kn.p.innerHTML = `<svg width="${H - 20}" height="${H - 20}"><circle class="fl" cx="${(H - 20) / 2}" cy="${(H - 20) / 2}" r="${(H - 20) / 2}"/></svg>`;
  S9C.onFl(R9.ico(kn.p, icon, (H - 20) / 2, (H - 20) / 2, 44, ''));
  if (s.label) R4.word(K, g, s.label, 300, Y + H + 24, 40, T.hit, 300);
});

/* 14 · B15 ปิดคลิป · the action's icon, big: it fills with the accent from the bottom (pressed) */
R3.both('B15', 'fill', 'ไอคอนใหญ่ เติมสีจนเต็ม', (K, s, T, g) => {
  const [icon] = R3.ACT[s.action] ?? R3.ACT.follow, S = 180, C = {x: 300, y: s.label ? 124 : 160};
  const ic = node(g, C.x - S / 2, C.y - S / 2, S, S, '', ICO(icon, S)); ic.p.className = 'u-label'; K.enter(ic.o, T.b[0], 'pop');
  const sol = div(`left:${C.x - S / 2}px;top:${C.y - S / 2}px;width:${S}px;height:${S}px`, g, S9C.solid(icon, S));
  A(sol, [{clipPath: 'inset(100% 0 0 0)'}, {clipPath: 'inset(0 0 0 0)'}], T.b[2], T.hit - T.b[2], {f: 'both'});
  if (s.label) R4.word(K, g, s.label, C.x, 250, 40, T.hit, 300);
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
SENTENCE('s9.course', {cat: 'B01', name: 'คอร์สราคา 990 บาท', say: ['คอร์สนี้ราคาแค่', '990 บาท'], value: '990', unit: 'บาท', money: true});
SENTENCE('s9.views', {cat: 'B02', name: 'คนดูไลฟ์เพิ่มขึ้น', say: ['พอไลฟ์ทุกวัน คนดู', 'เพิ่มขึ้นเรื่อยๆ'], dir: 'up', item: {icon: 'eye'}, n: 3});
SENTENCE('s9.save', {cat: 'B02', name: 'เงินเก็บหายเกือบหมด', say: ['เดือนเดียว เงินเก็บ', 'หายไปเกือบหมด'], dir: 'down', item: {icon: 'piggy-bank'}, n: 4, keep: 1});
SENTENCE('s9.daily', {cat: 'B14', name: 'ทำทุกวันชนะ', say: ['จำไว้นะ', 'ทำทุกวันชนะ'], idea: {icon: 'repeat', label: 'ทำทุกวันชนะ'}});
SENTENCE('s9.learn', {cat: 'B14', name: 'ความผิดพลาดคือครู', say: ['ความผิดพลาดคือ', 'ครูที่ดีที่สุด'], idea: {icon: 'graduation-cap', label: 'ครูที่ดีที่สุด'}});
SENTENCE('s9.bell', {cat: 'B15', name: 'กดติดตาม', say: ['อย่าลืม', 'กดติดตามนะ'], action: 'follow', label: 'กดติดตาม'});
SENTENCE('s9.like', {cat: 'B15', name: 'กดถูกใจ', say: ['ชอบคลิปนี้', 'กดถูกใจเลย'], action: 'like', label: 'กดถูกใจ'});
