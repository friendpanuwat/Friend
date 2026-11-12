/* =====================================================================
   CutPack · uni · SKETCHES, third set for the round 9 refill (14 drafts). Friend 2026-11-11: "โอเค ทำรูปมาให้ดูใหม่" after
   Claude's summary of Friend's taste (DECISIONS, round 9): everyday things whose meaning is seen at once · a little
   machine that works and ends in a result · the round 1–8 look (rounded cards, the accent, clear words) · modern and a
   little minimal but NOT empty (the main thing fills the frame) · no people, no far metaphors, no pure type tricks.
   Still pictures only (after the key word): NOT in scenes/; load with EXTRA=sketches/r9d.js.
   ===================================================================== */
const S9D = {
  gear(cx, cy, ro, ri, n) {
    const pts = [], st = 2 * Math.PI / n;
    for (let i = 0; i < n; i++) { const a = i * st, c = (r, t) => `${(cx + Math.cos(t) * r).toFixed(1)} ${(cy + Math.sin(t) * r).toFixed(1)}`; pts.push(c(ri, a), c(ro, a + st * .18), c(ro, a + st * .48), c(ri, a + st * .66)); }
    return 'M' + pts.join('L') + 'Z';
  },
  solid: (name, size) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" style="fill:var(--ac);stroke:var(--ac-stroke, var(--ac));stroke-width:2;stroke-linejoin:round">${ICONS[name]}</svg>`,
  onFl: el => { el.style.color = 'var(--fl-edge, var(--fl-line, var(--ink)))'; return el; },
};

/* 1 · B09 เวลา · a stopwatch: its button is pressed, the hand sweeps round and stops; its display shows the moment */
R3.both('B09', 'watch', 'นาฬิกาจับเวลา กดปุ่มแล้วเข็มกวาดไปหยุด', (K, s, T, g) => {
  const pts = (s.points ?? []).slice(0, 3), n = pts.length, at = n ? Math.min(s.at ?? n - 1, n - 1) : 2, C = {x: 300, y: 190}, R = 134;
  const sw = R6.group(g); K.enter(sw, T.b[0], 'pop');
  R8.svg(sw, `<rect class="sd" x="${C.x - 20}" y="${C.y - R - 40}" width="40" height="30" rx="8"/><rect class="sd" x="${C.x + 78}" y="${C.y - R + 8}" width="34" height="22" rx="7" transform="rotate(40 ${C.x + 95} ${C.y - R + 19})"/>` +
    `<circle class="fl" cx="${C.x}" cy="${C.y}" r="${R}"/><circle class="u-fl-edge" cx="${C.x}" cy="${C.y}" r="${R}"/>` +
    [...Array(12)].map((_, i) => { const a = i * Math.PI / 6; return `<path class="u-fl-edge" d="M${(C.x + Math.sin(a) * (R - 14)).toFixed(1)} ${(C.y - Math.cos(a) * (R - 14)).toFixed(1)}L${(C.x + Math.sin(a) * (R - 30)).toFixed(1)} ${(C.y - Math.cos(a) * (R - 30)).toFixed(1)}"/>`; }).join(''));
  const f = (at + 1) / 3, a1 = 2 * Math.PI * f * .92, r = R - 44;
  R8.svg(sw, `<path class="u-acc-line" style="stroke-width:16px;opacity:.9" d="M${C.x} ${C.y - r}A${r} ${r} 0 ${a1 > Math.PI ? 1 : 0} 1 ${(C.x + Math.sin(a1) * r).toFixed(1)} ${(C.y - Math.cos(a1) * r).toFixed(1)}"/>` +
    `<path class="u-fl-edge" style="stroke-width:8px" d="M${C.x} ${C.y}L${(C.x + Math.sin(a1) * (R - 30)).toFixed(1)} ${(C.y - Math.cos(a1) * (R - 30)).toFixed(1)}"/><circle class="ac" cx="${C.x}" cy="${C.y}" r="12"/>`);
  const p = pts[at];
  if (p?.label) { const d = R9.card(sw, C.x - 90, C.y + 34, 180, 52, 12); R4.word(K, d.p, p.label, 90, 7, 30, null, 164); }
});

/* 2 · B13 เคล็ดลับ · a map in an app: the long way is grey; the shortcut lights up and the tip is the suggested route */
R3.both('B13', 'map', 'แผนที่ในแอป ทางยาวสีเทา แล้วทางลัดสว่างขึ้น', (K, s, T, g) => {
  const it = s.secret ?? {icon: 'lightbulb'}, X = 80, Y = 24, W = 440, H = 292;
  const c = R9.card(g, X, Y, W, H, 26); K.enter(c.o, T.b[0], 'rise');
  R8.svg(c.p, `<path style="fill:none;stroke:var(--tr);stroke-width:14;stroke-linecap:round" d="M20 130H${W - 20}M20 230H${W - 20}M110 72V${H - 16}M300 72V${H - 16}M200 72L${W - 30} ${H - 30}"/>`);
  const A0 = {x: 60, y: 252}, B0 = {x: 388, y: 110};
  R8.svg(c.p, `<path class="ln u-thin" style="opacity:.4" d="M${A0.x} ${A0.y}H110V130H300V230H${W - 40}V${B0.y}H${B0.x}"/>`);
  const sc = R8.svg(c.p, `<path class="u-acc-line" style="stroke-width:14px" d="M${A0.x} ${A0.y}L${B0.x} ${B0.y}"/>`); K.draw(sc.querySelector('path'), T.hit - .3, .35);
  R8.svg(c.p, `<circle class="sd" cx="${A0.x}" cy="${A0.y}" r="13"/>`);
  const pin = R9.acc(c.p, B0.x - 22, B0.y - 50, 44, 44, '50% 50% 50% 0'); pin.p.style.transform = 'rotate(-45deg)';
  const bn = R9.acc(c.p, 0, 0, W, 60, '26px 26px 0 0'); bn.p.style.boxShadow = 'none';
  R9.ico(bn.p, it.icon, 38, 30, 30, 'u-bubble-text');
  if (it.label) { const w = R6.wordL(K, bn.p, it.label, 66, 9, 34, null, W - 90); w.classList.add('u-bubble-text'); }
  K.enter(bn.o, T.hit, 'drop');
});

/* 3 · B16 นิยาม · a big word card: the front shows the word, it flips to the back with the meaning */
R3.both('B16', 'flashcard', 'บัตรคำ พลิกจากคำเป็นความหมาย', (K, s, T, g) => {
  const term = s.term ?? {}, means = (s.means ?? []).slice(0, 3), W = 420, H = 250, X = 300 - W / 2, Y = 44;
  const c = R9.card(g, X, Y, W, H, 26); K.enter(c.o, T.b[0], 'rise');
  const hd = R9.acc(c.p, 0, 0, W, 64, '26px 26px 0 0'); hd.p.style.boxShadow = 'none';
  if (term.label) R9.accWord(K, hd.p, term.label, W / 2, 9, 36, null, W - 60);
  const rows = means.length ? means : [{icon: term.icon ?? 'book-open'}], n = rows.length, top = 64 + (H - 64) / 2 - n * 26, step = 52;
  rows.forEach((m, k) => {
    if (m.icon) R9.ico(c.p, m.icon, m.label ? 70 : W / 2, top + 26 + k * step, n > 2 ? 30 : 38);
    if (m.label) R6.wordL(K, c.p, m.label, 106, top + k * step, n > 2 ? 32 : 42, null, W - 130);
  });
});

/* 4 · B20 ความสัมพันธ์ · two big gears mesh and turn together; their names on plates under them (over = apart, stopped) */
R3.both('B20', 'gears', 'เฟืองสองตัวขบกัน หมุนไปด้วยกัน (จบกัน = หลุดออก)', (K, s, T, g) => {
  const a = s.a ?? {icon: 'user'}, b = s.b ?? {icon: 'user'}, cut = !!s.cut, Y = 150, rA = 104, rB = 84, xA = 198, xB = xA + rA + rB - 18 + (cut ? 50 : 0);
  const gA = R8.svg(g, `<path class="sd" d="${S9D.gear(xA, Y, rA, rA - 16, 12)}"/><circle class="fl" cx="${xA}" cy="${Y}" r="46"/>`); K.enter(gA, T.b[0], 'pop');
  const gB = R8.svg(g, `<path class="ac" d="${S9D.gear(xB, Y, rB, rB - 16, 10)}"/><circle class="fl" cx="${xB}" cy="${Y}" r="38"/>`); K.enter(gB, T.b[0] + .1, 'pop');
  if (cut) gB.style.opacity = .45;
  S9D.onFl(R9.ico(g, a.icon, xA, Y, 44, '')); S9D.onFl(R9.ico(g, b.icon, xB, Y, 36, ''));
  [[a, xA], [b, xB]].forEach(([p, x]) => { if (!p.label) return; const pl = R9.card(g, x - 66, 276, 132, 50, 14); R4.word(K, pl.p, p.label, 66, 7, 30, null, 116); K.enter(pl.o, T.b[1], 'pop'); });
  if (s.label) { const sg = cut ? node(g, 300 - 90, 0, 180, 52, 'u-badge u-soft') : R9.acc(g, 300 - 90, 0, 180, 52, 16); sg.p.style.borderRadius = '16px';
    const w = R4.word(K, sg.p, s.label, 90, 6, 32, null, 160); if (!cut) w.classList.add('u-bubble-text'); K.enter(sg.o, T.hit, 'pop'); }
  if (cut) K.mark(g, 'cross', (xA + rA + xB - rB) / 2, Y, 44, T.hit + .1);
});

/* 5 · B21 สถานที่ · a postcard lands: a picture of the place, its name, a stamp pressed on the corner */
R3.both('B21', 'postcard', 'โปสการ์ด ชื่อสถานที่ แสตมป์ปั๊มลงมุม', (K, s, T, g) => {
  const pl = s.place ?? {icon: 'map-pin'}, spots = (s.spots ?? []).slice(0, 2), W = 440, H = 264, X = 300 - W / 2, Y = 40;
  const c = R9.card(g, X, Y, W, H, 16); c.o.style.transform = 'rotate(-3deg)'; K.enter(c.m, T.b[0], 'drop');
  const pic = div(`left:18px;top:18px;width:170px;height:${H - 36}px;border-radius:12px;background:var(--tr)`, c.p); R9.ico(pic, pl.icon, 85, (H - 36) / 2, 72);
  if (pl.label) R6.wordL(K, c.p, pl.label, 208, 92, 44, null, W - 226);
  spots.forEach((sp, k) => { if (sp.icon) R9.ico(c.p, sp.icon, 222, 175 + k * 40, 24); R6.wordL(K, c.p, sp.label ?? '', sp.icon ? 242 : 208, 158 + k * 40, 28, null, W - 262); });
  const st = R9.acc(c.p, W - 84, 16, 66, 66, 6); st.p.style.outline = '3px dashed var(--ac)'; st.p.style.outlineOffset = '-8px';
  R9.ico(st.p, pl.icon, 33, 33, 30, 'u-bubble-text'); K.enter(st.o, T.hit, 'drop');
});

/* 6 · B08 เป้าหมาย · a big half-round meter: the needle sweeps into the goal zone and the zone lights up */
R3.both('B08', 'meter', 'มาตรวัดครึ่งวง เข็มวิ่งเข้าโซนเป้าหมาย', (K, s, T, g) => {
  const it = s.goal ?? {icon: 'trophy'}, C = {x: 300, y: 250}, R = 190, z0 = .78, v = .9;
  const P = f => { const t = Math.PI * (1 - f); return `${(C.x + Math.cos(t) * R).toFixed(1)} ${(C.y - Math.sin(t) * R).toFixed(1)}`; };
  const t = Math.PI * (1 - v);
  const m = R8.svg(g, `<path class="u-ring" style="stroke-width:46px" d="M${P(0)}A${R} ${R} 0 0 1 ${P(z0)}"/><path class="u-ring-on" style="stroke-width:46px" d="M${P(z0 + .01)}A${R} ${R} 0 0 1 ${P(1)}"/>` +
    `<path class="ln u-thick" d="M${C.x} ${C.y}L${(C.x + Math.cos(t) * (R - 50)).toFixed(1)} ${(C.y - Math.sin(t) * (R - 50)).toFixed(1)}"/><circle class="sd" cx="${C.x}" cy="${C.y}" r="20"/>`);
  K.enter(m, T.b[0], 'pop');
  R9.ico(g, it.icon, C.x, C.y - 92, 60);
  if (it.label) R4.word(K, g, it.label, C.x, C.y + 30, 44, T.hit, 320);
});

/* 7 · B01 ตัวเลขเด่น · a big notification slides down; its number counts up and stops on the value (app screen) */
R3.both('B01', 'notify', 'แถบแจ้งเตือน ตัวเลขวิ่งขึ้นแล้วหยุด', (K, s, T, g) => {
  const W = 480, H = 150, X = 300 - W / 2, Y = 84;
  const n = R9.card(g, X, Y, W, H, 32); K.enter(n.m, T.b[0], 'drop');
  const ap = R9.acc(n.p, 24, 24, 102, 102, 26); R9.ico(ap.p, s.icon ?? (R2.money(s) ? 'wallet' : 'bell'), 51, 51, 50, 'u-bubble-text');
  div('left:150px;top:30px;width:150px;height:14px;border-radius:7px;background:var(--tr)', n.p);
  const nb = div('left:148px;top:54px;height:80px;display:flex;align-items:baseline;gap:14px;white-space:nowrap', n.p);
  const v = document.createElement('span'); v.className = 'u-num'; v.style.fontSize = R2.fitSize(s.value, 230, 76) + 'px'; v.textContent = s.value; nb.appendChild(v);
  if (s.unit) { const u = document.createElement('span'); u.className = 'u-label'; u.style.fontSize = '34px'; u.textContent = s.unit; nb.appendChild(u); }
}, null, {ui: true});

/* 8 · B01 ตัวเลขเด่น · a big price tag hangs from a nail and settles (prices only) */
R3.both('B01', 'tag', 'ป้ายราคาแขวน แกว่งแล้วหยุด', (K, s, T, g) => {
  R8.svg(g, `<circle class="sd" cx="300" cy="18" r="10"/><path class="ln u-thin" d="M300 18L300 62"/>`);
  const tg = R9.card(g, 160, 50, 280, 240, 18); tg.o.classList.add('u-receipt-wrap');
  tg.p.style.clipPath = 'polygon(50% 0, 100% 20%, 100% 100%, 0 100%, 0 20%)'; tg.p.style.borderRadius = '0 0 18px 18px';
  div('left:128px;top:22px;width:24px;height:24px;border-radius:50%;background:var(--tr)', tg.p);
  const nb = div(`left:0;top:72px;width:280px;height:100px;display:flex;align-items:center;justify-content:center;font-size:${R2.fitSize(s.value, 240, 92)}px`, tg.p);
  nb.className = 'u-num'; nb.textContent = s.value;
  if (s.unit) R4.word(K, tg.p, s.unit, 140, 172, 36, null, 230);
  tg.o.style.transformOrigin = '50% 0'; tg.o.style.transform = 'rotate(3deg)'; K.enter(tg.m, T.b[0], 'drop');
}, s => R2.money(s));

/* 9 · B02 เพิ่มขึ้น / ลดลง · a big battery: up = the bars fill to full; down = one red bar is left */
R3.both('B02', 'battery', 'แบตเตอรี่ ขีดเติมจนเต็ม (ลดลง = เหลือขีดแดง)', (K, s, T, g) => {
  const up = s.dir !== 'down', n = 5, on = up ? 5 : 1, W = 380, H = 180, X = 290 - W / 2, Y = 104;
  R8.svg(g, `<rect class="sd" x="${X + W + 8}" y="${Y + H / 2 - 36}" width="28" height="72" rx="10"/>`);
  const b = R9.card(g, X, Y, W, H, 34); K.enter(b.o, T.b[0], 'rise');
  for (let i = 0; i < n; i++) {
    const x = 22 + i * ((W - 44) / n), w = (W - 44) / n - 12;
    if (i < on) { const bar = node(b.p, x, 22, w, H - 44, up ? 'u-badge u-acc' : 'u-badge u-neg'); bar.p.style.borderRadius = '12px'; bar.p.style.boxShadow = 'none'; }
    else div(`left:${x}px;top:22px;width:${w}px;height:${H - 44}px;border-radius:12px;background:var(--tr)`, b.p);
  }
  if (s.item) R9.ico(g, s.item.icon, 290, Y - 48, 50);
});

/* 10 · B02 เพิ่มขึ้น / ลดลง · parcels pile up into a pyramid, the last one (accent) on top; down = only two are left */
R3.both('B02', 'boxes', 'กล่องพัสดุซ้อนกันสูงขึ้น (ลดลง = เหลือน้อย)', (K, s, T, g) => {
  const up = s.dir !== 'down', w = 128, h = 86, gp = 10, base = 316, rows = [3, 2, 1], have = up ? 6 : 2;
  let k = 0;
  rows.forEach((cnt, r) => { for (let i = 0; i < cnt; i++, k++) {
    const x = 300 - (cnt * w + (cnt - 1) * gp) / 2 + i * (w + gp), y = base - (r + 1) * (h + gp) + gp;
    if (k < have) { const top = up && k === 5, bx = R7.plain(g, x, y, w, h, top ? 'acc' : 'main', '12px');      // solid boxes: a white card vanished on the white page
      div(`left:${w / 2 - 9}px;top:0;width:18px;height:${h}px;background:var(${top ? '--tr' : '--ac'});opacity:${top ? 1 : .85}`, bx.p);
      if (top && s.item) R9.ico(bx.p, s.item.icon, w / 2, h / 2, 40, 'u-bubble-text');
      K.enter(bx.o, T.b[0] + k * .12, 'drop'); }
    else div(`left:${x}px;top:${y}px;width:${w}px;height:${h}px;border-radius:12px;border:3px dashed var(--tr)`, g);
  } });
  if (!up && s.item) R9.ico(g, s.item.icon, 300, base - h - gp - h / 2 + 10, 46);
});

/* 11 · B14 ประโยคเด็ด · lines of text; the one line to remember is highlighted */
R3.both('B14', 'highlight', 'บรรทัดเทาหลายบรรทัด บรรทัดเดียวถูกไฮไลต์', (K, s, T, g) => {
  const it = s.idea ?? {icon: 'sparkles'}, X = 50, W = 480;
  [[40, 430], [86, 470], [244, 450], [290, 330]].forEach(([y, w], k) => { const l = div(`left:${X}px;top:${y}px;width:${w}px;height:20px;border-radius:10px;background:var(--tr)`, g); K.enter(l, T.b[0] + k * .06, 'lead'); });
  const hl = R9.acc(g, X - 10, 136, W + 10, 84, 12); hl.p.style.boxShadow = 'none';
  if (s.idea?.label) { R9.ico(hl.p, it.icon, 44, 42, 38, 'u-bubble-text'); const w = R6.wordL(K, hl.p, it.label, 80, 12, 50, null, W - 100); w.classList.add('u-bubble-text'); }
  else R9.ico(hl.p, it.icon, W / 2, 42, 50, 'u-bubble-text');
  A(hl.o, [{clipPath: 'inset(0 100% 0 0)'}, {clipPath: 'inset(0 0 0 0)'}], T.hit - .3, .35, {f: 'both'});
});

/* 12 · B14 ประโยคเด็ด · a framed line hung on a nail: it swings in and straightens */
R3.both('B14', 'frame', 'กรอบรูปใส่คำคม แขวนบนผนัง', (K, s, T, g) => {
  const it = s.idea ?? {icon: 'sparkles'}, W = 440, H = 220, X = 300 - W / 2, Y = 92;
  R8.svg(g, `<circle class="sd" cx="300" cy="22" r="10"/><path class="ln u-thin" d="M300 22L${X + 80} ${Y}M300 22L${X + W - 80} ${Y}"/>`);
  const fr = R9.card(g, X, Y, W, H, 8); fr.p.style.border = 'calc(var(--lw) * 1.1px) solid var(--sd)';
  fr.o.style.transformOrigin = '50% -70px'; K.enter(fr.m, T.b[1], 'drop');
  if (s.idea?.label) { R9.ico(fr.p, it.icon, W / 2, 60, 46); R4.word(K, fr.p, it.label, W / 2 - 16, 96, 52, null, W - 80); }
  else R9.ico(fr.p, it.icon, W / 2, H / 2 - 16, 80);
});

/* 13 · B15 ปิดคลิป · one big switch slides to "on" and glows; the action's icon rides on its knob */
R3.both('B15', 'switch', 'สวิตช์ตัวใหญ่เลื่อนไปที่เปิด', (K, s, T, g) => {
  const [icon] = R3.ACT[s.action] ?? R3.ACT.follow, W = 330, H = 156, X = 300 - W / 2, Y = s.label ? 52 : 92;
  const tr = R9.acc(g, X, Y, W, H, H / 2); K.enter(tr.o, T.b[0], 'pop');
  const ks = H - 24, kn = node(g, X + W - H + 12, Y + 12, ks, ks, ''); kn.p.innerHTML = `<svg width="${ks}" height="${ks}"><circle class="fl" cx="${ks / 2}" cy="${ks / 2}" r="${ks / 2}"/></svg>`;
  S9D.onFl(R9.ico(kn.p, icon, ks / 2, ks / 2, 56, ''));
  if (s.label) R4.word(K, g, s.label, 300, Y + H + 26, 46, T.hit, 320);
});

/* 14 · B15 ปิดคลิป · the action's icon, big: it fills with the accent from the bottom (pressed) */
R3.both('B15', 'fill', 'ไอคอนใหญ่ เติมสีจนเต็ม', (K, s, T, g) => {
  const [icon] = R3.ACT[s.action] ?? R3.ACT.follow, S = 220, C = {x: 300, y: s.label ? 126 : 166};
  const ic = node(g, C.x - S / 2, C.y - S / 2, S, S, '', ICO(icon, S)); ic.p.className = 'u-label'; K.enter(ic.o, T.b[0], 'pop');
  const sol = div(`left:${C.x - S / 2}px;top:${C.y - S / 2}px;width:${S}px;height:${S}px`, g, S9D.solid(icon, S));
  A(sol, [{clipPath: 'inset(100% 0 0 0)'}, {clipPath: 'inset(0 0 0 0)'}], T.b[2], T.hit - T.b[2], {f: 'both'});
  if (s.label) R4.word(K, g, s.label, C.x, 262, 46, T.hit, 320);
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
SENTENCE('s9.orders', {cat: 'B02', name: 'ออเดอร์เพิ่มขึ้น', say: ['พอไลฟ์ทุกวัน ออเดอร์', 'เพิ่มขึ้นเรื่อยๆ'], dir: 'up', item: {icon: 'package'}, n: 3});
SENTENCE('s9.save', {cat: 'B02', name: 'เงินเก็บหายเกือบหมด', say: ['เดือนเดียว เงินเก็บ', 'หายไปเกือบหมด'], dir: 'down', item: {icon: 'piggy-bank'}, n: 4, keep: 1});
SENTENCE('s9.daily', {cat: 'B14', name: 'ทำทุกวันชนะ', say: ['จำไว้นะ', 'ทำทุกวันชนะ'], idea: {icon: 'repeat', label: 'ทำทุกวันชนะ'}});
SENTENCE('s9.learn', {cat: 'B14', name: 'ความผิดพลาดคือครู', say: ['ความผิดพลาดคือ', 'ครูที่ดีที่สุด'], idea: {icon: 'graduation-cap', label: 'ครูที่ดีที่สุด'}});
SENTENCE('s9.bell', {cat: 'B15', name: 'กดติดตาม', say: ['อย่าลืม', 'กดติดตามนะ'], action: 'follow', label: 'กดติดตาม'});
SENTENCE('s9.like', {cat: 'B15', name: 'กดถูกใจ', say: ['ชอบคลิปนี้', 'กดถูกใจเลย'], action: 'like', label: 'กดถูกใจ'});
