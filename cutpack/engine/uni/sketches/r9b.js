/* =====================================================================
   CutPack · uni · SKETCHES for the round 9 refill (14 drafts), Friend 2026-11-11: "ทำเป็นรูปมาก่อนได้ไหม".
   Still pictures only (the moment after the key word), to show Friend before the drafts are animated. NOT in scenes/,
   so the variant picker never sees them; load with EXTRA=sketches/r9b.js (render_test.sh, tools/stills.sh).
   Rules: no people at all (Friend: "ไม่เอาคนเลย") · the picture says the category plainly (DECISIONS, LESSONS 41) ·
   words only from the slots · drawn in each skill's style (role classes only).
   ===================================================================== */
const S9 = {
  /* a filled copy of a Lucide icon in the accent (a pressed button) */
  solid: (name, size) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" style="fill:var(--ac);stroke:var(--ac-stroke, var(--ac));stroke-width:2;stroke-linejoin:round">${ICONS[name]}</svg>`,
  ground: (K, g, t, x0 = 40, x1 = 540, y = 314) => R6.line(K, g, `M${x0} ${y}H${x1}`, t, .3),
};

/* B09 เวลา · a desk calendar: the page of the moment it stops on, the dots under it say which one of the three */
R3.both('B09', 'cal', 'ปฏิทินตั้งโต๊ะพลิกทีละหน้า', (K, s, T, g) => {
  const pts = (s.points ?? []).slice(0, 3), n = pts.length, at = n ? Math.min(s.at ?? n - 1, n - 1) : 0, X = 150, Y = 34, W = 300, H = 256;
  const base = R8.svg(g, `<path class="sd" d="M${X - 20} ${Y + H}H${X + W + 20}L${X + W} ${Y + H + 22}H${X}Z"/>`); K.enter(base, T.b[0], 'rise');
  const pg = R9.card(g, X, Y, W, H, 18); K.enter(pg.o, T.b[0] + .05, 'rise');
  const hd = R9.acc(pg.p, 0, 0, W, 58, '18px 18px 0 0'); hd.p.style.boxShadow = 'none';
  [W * .3, W * .7].forEach(x => div(`left:${x - 9}px;top:-14px;width:18px;height:40px;border-radius:9px;background:var(--sd)`, pg.p));
  const p = pts[at];
  if (p?.label) { if (p.icon) R9.ico(pg.p, p.icon, W / 2, 104, 50); R4.word(K, pg.p, p.label, W / 2, p.icon ? 140 : 110, 54, null, W - 40); }
  else if (s.result) R9.ico(pg.p, s.result.icon, W / 2, 140, 100);
  if (n > 1) pts.forEach((_, k) => div(`left:${W / 2 - (n - 1) * 18 + k * 36 - 8}px;top:${H - 34}px;width:16px;height:16px;border-radius:50%;background:var(${k === at ? '--ac' : '--tr'})`, pg.p));
  if (s.result && p?.label) { const r = R9.ico(g, s.result.icon, 510, 96, 70); K.enter(r, T.hit + .1, 'pop'); R6.burst(K, g, 510, 96, 44, T.hit + .2); }
});

/* B13 เคล็ดลับ · a lever: the tip is written on the plank; a small weight on one end lifts the big rock on the other */
R3.both('B13', 'lever', 'ไม้งัดยกก้อนหินใหญ่ได้ง่าย ๆ', (K, s, T, g) => {
  const it = s.secret ?? {icon: 'lightbulb'}, F = {x: 300, y: 300}, L = 440, PH = 46, a = 13, r = Math.PI * a / 180;
  const at = (dx, dy) => [F.x - 40 * 0 + dx * Math.cos(r) - dy * Math.sin(r), F.y - 40 + dx * Math.sin(r) + dy * Math.cos(r)];   // a point on the tilted plank (pivot = its bottom middle)
  S9.ground(K, g, T.b[0]);
  const fu = R8.svg(g, `<path class="sd" d="M${F.x - 34} ${F.y + 14}L${F.x} ${F.y - 40}L${F.x + 34} ${F.y + 14}Z"/>`); K.enter(fu, T.b[0], 'rise');
  const pl = R9.acc(g, F.x - L / 2, F.y - 40 - PH, L, PH, 14); pl.m.style.transformOrigin = '50% 100%'; pl.m.style.transform = `rotate(${a}deg)`;
  R9.ico(pl.p, it.icon, 170, PH / 2, 28, 'u-bubble-text');
  if (it.label) { const w = R6.wordL(K, pl.p, it.label, 192, 3, 32, null, 180); w.classList.add('u-bubble-text'); }
  K.enter(pl.o, T.b[0] + .1, 'rise');
  const [lx, ly] = at(-(L / 2 - 76), -PH);
  const rock = R8.svg(g, `<path class="sd" d="M${lx - 70} ${ly + 4}C${lx - 76} ${ly - 50} ${lx - 34} ${ly - 96} ${lx + 8} ${ly - 90}C${lx + 56} ${ly - 84} ${lx + 76} ${ly - 42} ${lx + 66} ${ly + 4}Z"/>`);
  K.enter(rock, T.b[0] + .15, 'rise');
  const [rx, ry] = at(L / 2 - 30, -PH);
  const wt = R8.svg(g, `<rect class="sd" x="${rx - 20}" y="${ry - 36}" width="40" height="36" rx="8" transform="rotate(${a} ${rx} ${ry})"/>`); K.enter(wt, T.hit, 'drop');
  const up = R8.svg(g, `<path class="ln u-thin" d="M${lx - 96} ${ly - 20}V${ly - 70}M${lx + 96} ${ly - 20}V${ly - 70}"/>`); up.classList.add('u-decor'); K.enter(up, T.hit + .2, 'pop');
});

/* B16 นิยาม · a tag tied to a thing: the tag says the word, the thing is what it means */
R3.both('B16', 'tag', 'ป้ายผูกห้อยอยู่ที่ของ ป้ายคือคำ ของคือความหมาย', (K, s, T, g) => {
  const term = s.term ?? {}, means = (s.means ?? []).slice(0, 3), m0 = means[0] ?? {icon: term.icon ?? 'package'};
  const O = {x: 186, y: 150};
  const obj = R9.ico(g, m0.icon, O.x, O.y, 170); K.enter(obj, T.b[0], 'pop');
  const labs = means.map(m => m.label).filter(Boolean);
  if (labs.length) { const pl = R9.acc(g, O.x - 130, 262, 260, 52, 14); R9.accWord(K, pl.p, labs.join(' · '), 130, 7, 32, null, 236); K.enter(pl.o, T.b[2], 'pop'); }
  const tg = R9.card(g, 318, 60, 228, 120, '16px 16px 16px 56px'); tg.o.style.transform = 'rotate(-8deg)';
  div('left:22px;top:50px;width:22px;height:22px;border-radius:50%;background:var(--tr)', tg.p);
  if (term.label) R6.wordL(K, tg.p, term.label, 58, 34, 42, null, 156);
  K.enter(tg.o, T.b[1], 'pop');
  const str = R8.svg(g, `<path class="ln u-thin" d="M${O.x + 62} ${O.y - 62}Q${O.x + 120} ${O.y - 96} 346 ${124}"/>`); K.draw(str.querySelector('path'), T.b[1] - .1, .3);
});

/* B20 ความสัมพันธ์ · two cords end in a plug and a socket; plugged in, the light above turns on (cut: pulled apart, it goes off) */
R3.both('B20', 'plug', 'ปลั๊กเสียบเข้าหากันแล้วไฟติด (จบกัน ถูกดึงหลุด)', (K, s, T, g) => {
  const a = s.a ?? {icon: 'user'}, b = s.b ?? {icon: 'user'}, cut = !!s.cut, Y = 200, J = 300, gap = cut ? 70 : 0;
  const end = (p, x, flip) => { const c = R9.card(g, x, Y - 46, 120, 92, 18); R9.ico(c.p, p.icon, 60, p.label ? 32 : 46, p.label ? 36 : 48); if (p.label) R4.word(K, c.p, p.label, 60, 52, 26, null, 104); K.enter(c.o, T.b[0] + (flip ? .08 : 0), 'rise'); };
  end(a, 30, false); end(b, 420, true);
  const px = J - 46 - gap / 2, sx = J + gap / 2;
  R8.svg(g, `<path class="ln u-thin" d="M150 ${Y}C200 ${Y} 200 ${Y + 40} ${px} ${Y}"/><path class="ln u-thin" d="M420 ${Y}C380 ${Y} 380 ${Y + 40} ${sx + 50} ${Y}"/>` +
    `<rect class="sd" x="${px}" y="${Y - 22}" width="40" height="44" rx="8"/><path class="ln u-thin" d="M${px + 40} ${Y - 10}H${px + 60}M${px + 40} ${Y + 10}H${px + 60}"/>` +
    `<rect class="sd" x="${sx}" y="${Y - 28}" width="50" height="56" rx="10"/>`);
  if (s.label) {
    const pl = cut ? node(g, J - 90, 54, 180, 60, 'u-badge u-soft') : R9.acc(g, J - 90, 54, 180, 60, 16); pl.p.style.borderRadius = '16px';
    const w = R4.word(K, pl.p, s.label, 90, 9, 34, null, 160); if (!cut) w.classList.add('u-bubble-text');
    K.enter(pl.o, T.hit, 'pop'); if (!cut) { R6.burst(K, g, J, 84, 104, T.hit + .1, 10); }
  }
  if (cut) K.mark(g, 'cross', J - 8, Y, 54, T.hit + .1);
});

/* B21 สถานที่ · an arched gate: the place's name on the arch, the doors open on what is inside */
R3.both('B21', 'gate', 'ซุ้มประตูทางเข้า ชื่อสถานที่อยู่บนซุ้ม', (K, s, T, g) => {
  const pl = s.place ?? {icon: 'map-pin'}, spots = (s.spots ?? []).slice(0, 2);
  S9.ground(K, g, T.b[0], 60, 520);
  const pil = R8.svg(g, `<rect class="sd" x="118" y="70" width="40" height="244" rx="6"/><rect class="sd" x="402" y="70" width="40" height="244" rx="6"/>` +
    `<path class="fl" d="M158 112L196 128V300L158 314Z"/><path class="u-fl-edge" d="M158 112L196 128V300L158 314Z"/><path class="fl" d="M402 112L364 128V300L402 314Z"/><path class="u-fl-edge" d="M402 112L364 128V300L402 314Z"/>`);
  K.enter(pil, T.b[0], 'rise');
  const ar = R9.card(g, 96, 26, 368, 72, '36px 36px 10px 10px'); K.enter(ar.o, T.b[1], 'drop');
  if (pl.icon) R9.ico(ar.p, pl.icon, 46, 36, 36);
  if (pl.label) R4.word(K, ar.p, pl.label, pl.icon ? 196 : 184, 12, 42, null, pl.icon ? 280 : 330);
  R8.svg(g, `<path class="ln u-thin" style="opacity:.5" d="M230 314L270 150M330 314L290 150"/>`);
  if (spots.length) {
    const c = R9.card(g, 206, 150, 148, 22 + 40 * spots.length, 14); K.enter(c.o, T.hit + .1, 'pop');
    spots.forEach((sp, k) => { if (sp.icon) R9.ico(c.p, sp.icon, 24, 31 + k * 40, 24); R6.wordL(K, c.p, sp.label ?? '', sp.icon ? 42 : 14, 14 + k * 40, 26, null, sp.icon ? 98 : 120); });
  }
});

/* B08 เป้าหมาย · a winners' podium: the cup comes down on the top step, the goal on that step */
R3.both('B08', 'podium', 'แท่นรางวัล ถ้วยลงมาวางบนขั้นที่ 1', (K, s, T, g) => {
  const it = s.goal ?? {icon: 'trophy'};
  S9.ground(K, g, T.b[0], 70, 530);
  const l = R9.card(g, 128, 236, 112, 78, '14px 14px 0 0'), r = R9.card(g, 360, 258, 112, 56, '14px 14px 0 0');
  K.enter(l.o, T.b[0] + .05, 'rise'); K.enter(r.o, T.b[0] + .1, 'rise');
  const c = R9.acc(g, 244, 176, 112, 138, '14px 14px 0 0'); K.enter(c.o, T.b[0] + .15, 'rise');
  if (it.label) R9.accWord(K, c.p, it.label, 56, 18, 28, null, 100);
  const cup = R9.ico(g, it.icon === 'trophy' || !it.icon ? 'trophy' : it.icon, 300, 112, 104); K.enter(cup, T.hit, 'drop');
  R6.burst(K, g, 300, 112, 66, T.hit + .3, 10);
  [[160, 60], [440, 80], [200, 130], [410, 150], [470, 40]].forEach(([x, y], k) => { const cf = div(`left:${x}px;top:${y}px;width:12px;height:20px;border-radius:3px;background:var(${k % 2 ? '--ac' : '--tr'});transform:rotate(${k * 37}deg)`, g); cf.className = 'u-decor'; R7.show(cf, T.hit + .3); });
});

/* B01 ตัวเลขเด่น · a dial: the needle sweeps up to the number, which is read on the card under it */
R3.both('B01', 'dial', 'หน้าปัดเข็มกวาดไปหยุดที่ตัวเลข', (K, s, T, g) => {
  const pct = /%/.test(String(s.value)) ? Math.min(.97, Math.max(.05, R2.num(s) / 100)) : (s.dir === 'down' ? .22 : .8);
  const C = {x: 300, y: 226}, R = 146, ang = Math.PI * (1 - pct);
  const P = t => `${(C.x + Math.cos(t) * R).toFixed(1)} ${(C.y - Math.sin(t) * R).toFixed(1)}`;
  const ticks = [...Array(11)].map((_, i) => { const t = Math.PI * (1 - i / 10), r0 = R + 30, r1 = R + (i % 5 ? 42 : 50); return `M${(C.x + Math.cos(t) * r0).toFixed(1)} ${(C.y - Math.sin(t) * r0).toFixed(1)}L${(C.x + Math.cos(t) * r1).toFixed(1)} ${(C.y - Math.sin(t) * r1).toFixed(1)}`; }).join('');
  const d = R8.svg(g, `<path class="u-ring" d="M${P(Math.PI)}A${R} ${R} 0 0 1 ${P(0)}"/><path class="u-ring-on" d="M${P(Math.PI)}A${R} ${R} 0 0 1 ${P(ang)}"/><path class="ln u-thin" d="${ticks}"/>` +
    `<path class="ln u-thick" d="M${C.x} ${C.y}L${(C.x + Math.cos(ang) * (R - 34)).toFixed(1)} ${(C.y - Math.sin(ang) * (R - 34)).toFixed(1)}"/><circle class="sd" cx="${C.x}" cy="${C.y}" r="18"/>`);
  K.enter(d, T.b[0], 'pop');
  const c = R9.card(g, C.x - 120, C.y + 32, 240, 86, 18); K.enter(c.o, T.hit, 'pop');
  if (s.icon) R9.ico(c.p, s.icon, 34, 43, 32);
  const nb = div(`left:${s.icon ? 56 : 0}px;top:0;width:${s.icon ? 184 : 240}px;height:${s.unit ? 58 : 86}px;display:flex;align-items:center;justify-content:center;font-size:${R2.fitSize(s.value, s.icon ? 150 : 200, 56)}px`, c.p);
  nb.className = 'u-num'; nb.textContent = s.value;
  if (s.unit) R4.word(K, c.p, s.unit, s.icon ? 148 : 120, 52, 24, null, 160);
});

/* B01 ตัวเลขเด่น · a price tag hangs from a nail and swings to a stop (prices only) */
R3.both('B01', 'pricetag', 'ป้ายราคาแขวน แกว่งแล้วหยุด', (K, s, T, g) => {
  const nail = R8.svg(g, `<circle class="sd" cx="300" cy="22" r="10"/><path class="ln u-thin" d="M300 22L300 74"/>`); K.enter(nail, T.b[0], 'pop');
  const tg = R9.card(g, 176, 64, 248, 180, 16); tg.o.classList.add('u-receipt-wrap');
  tg.p.style.clipPath = 'polygon(50% 0, 100% 22%, 100% 100%, 0 100%, 0 22%)'; tg.p.style.borderRadius = '0 0 16px 16px';
  div('left:114px;top:22px;width:20px;height:20px;border-radius:50%;background:var(--tr)', tg.p);
  const nb = div(`left:0;top:56px;width:248px;height:80px;display:flex;align-items:center;justify-content:center;font-size:${R2.fitSize(s.value, 210, 74)}px`, tg.p);
  nb.className = 'u-num'; nb.textContent = s.value;
  if (s.unit) R4.word(K, tg.p, s.unit, 124, 136, 30, null, 200);
  tg.o.style.transformOrigin = '50% 0'; tg.o.style.transform = 'rotate(4deg)';
  K.enter(tg.m, T.b[0] + .1, 'drop');
}, s => R2.money(s));

/* B02 เพิ่มขึ้น / ลดลง · a pile of bricks: up = the last brick lands on top of a tall pile; down = bricks have fallen off */
R3.both('B02', 'bricks', 'อิฐซ้อนทีละก้อน กองสูงขึ้น (ลดลง = อิฐหลุดออก)', (K, s, T, g) => {
  const up = s.dir !== 'down', rows = up ? 5 : 2, bw = 92, bh = 40, gp = 6, base = 314;
  S9.ground(K, g, T.b[0], 70, 530);
  for (let r = 0; r < rows; r++) {
    const off = r % 2 ? bw / 2 : 0, k = r % 2 ? 2 : 3;
    for (let i = 0; i < k; i++) {
      const top = up && r === rows - 1, x = 300 - (k * bw + (k - 1) * gp) / 2 + i * (bw + gp), y = base - (r + 1) * (bh + gp);
      const b = R7.plain(g, x, y, bw, bh, top ? 'acc' : 'main', '6px'); K.enter(b.o, T.b[0] + r * .12 + i * .04, 'drop'); void off;
    }
  }
  if (up) { const ic = R9.ico(g, s.item?.icon ?? 'arrow-up', 300, base - rows * (bh + gp) - 50, 56); K.enter(ic, T.hit, 'pop'); }
  else [[410, 286, 24], [470, 290, -14], [140, 288, 18]].forEach(([x, y, a], k) => { const b = R7.plain(g, x, y - bh / 2, bw, bh, 'main', '6px'); b.o.style.transform = `rotate(${a}deg)`; b.o.style.opacity = .55; K.enter(b.m, T.hit + k * .08, 'drop'); });
  if (!up && s.item) { const ic = R9.ico(g, s.item.icon, 300, base - 2 * (bh + gp) - 50, 52); K.enter(ic, T.b[0], 'pop'); }
});

/* B02 เพิ่มขึ้น / ลดลง · a battery: up = the bars fill to full; down = only one (red) bar is left */
R3.both('B02', 'battery', 'แบตเตอรี่ ขีดเพิ่มจนเต็ม (ลดลง = ขีดหายจนเหลือน้อย)', (K, s, T, g) => {
  const up = s.dir !== 'down', n = 5, on = up ? 5 : 1, X = 116, Y = 112, W = 320, H = 150;
  const cap = R8.svg(g, `<rect class="sd" x="${X + W + 6}" y="${Y + H / 2 - 30}" width="24" height="60" rx="8"/>`); K.enter(cap, T.b[0], 'rise');
  const b = R9.card(g, X, Y, W, H, 28); K.enter(b.o, T.b[0], 'rise');
  for (let i = 0; i < n; i++) {
    const x = 18 + i * ((W - 36) / n), w = (W - 36) / n - 10;
    if (i < on) { const bar = node(b.p, x, 18, w, H - 36, up ? 'u-badge u-acc' : 'u-badge u-neg'); bar.p.style.borderRadius = '10px'; K.enter(bar.o, T.b[1] + i * .1, 'pop'); }
    else div(`left:${x}px;top:18px;width:${w}px;height:${H - 36}px;border-radius:10px;background:var(--tr)`, b.p);
  }
  const ic = R9.ico(g, s.item?.icon ?? (up ? 'zap' : 'battery-low'), X + W / 2, Y - 50, 54); K.enter(ic, T.hit, 'pop');
});

/* B14 ประโยคเด็ด · a banner stretched between two poles, the line on it */
R3.both('B14', 'banner', 'ป้ายผ้าขึงระหว่างเสาสองต้น', (K, s, T, g) => {
  const it = s.idea ?? {icon: 'sparkles'};
  S9.ground(K, g, T.b[0], 50, 540);
  const poles = R8.svg(g, `<rect class="sd" x="62" y="40" width="16" height="274" rx="6"/><rect class="sd" x="522" y="40" width="16" height="274" rx="6"/><circle class="sd" cx="70" cy="36" r="12"/><circle class="sd" cx="530" cy="36" r="12"/>`);
  K.enter(poles, T.b[0], 'rise');
  R8.svg(g, `<path class="ln u-thin" d="M78 58L96 70M78 170L96 158M522 58L504 70M522 170L504 158"/>`);
  const bn = R9.card(g, 96, 62, 408, 104, 8); K.enter(bn.o, T.b[1], 'drop');
  const hem = R9.acc(bn.p, 0, 0, 408, 12, '8px 8px 0 0'); hem.p.style.boxShadow = 'none';
  if (s.idea?.label) { R9.ico(bn.p, it.icon, 50, 58, 44); R6.wordL(K, bn.p, it.label, 86, 28, 48, null, 300); } else R9.ico(bn.p, it.icon, 204, 58, 64);
  R1.ripple(K, bn, T.hit);
});

/* B14 ประโยคเด็ด · a stone tablet with the line carved into it, chips flying off the last letters */
R3.both('B14', 'stone', 'แผ่นหินสลักประโยค', (K, s, T, g) => {
  const it = s.idea ?? {icon: 'sparkles'}, X = 96, Y = 46, W = 408, H = 230;
  const st = node(g, X, Y, W, H, 'u-badge u-soft'); st.p.style.borderRadius = '10px'; st.p.style.display = 'block';
  st.p.style.clipPath = 'polygon(3% 0, 30% 2%, 58% 0, 88% 1%, 100% 6%, 99% 40%, 100% 78%, 97% 100%, 62% 98%, 30% 100%, 2% 98%, 0 70%, 1% 30%)';
  K.enter(st.o, T.b[0], 'rise');
  R8.svg(st.p, `<path class="ln u-thin" style="opacity:.35" d="M30 40L54 62L48 88M370 30L350 56M380 170L356 190L362 214M24 180L46 196"/>`);
  R9.ico(st.p, it.icon, W / 2, 70, 60);
  if (s.idea?.label) R4.word(K, st.p, it.label, W / 2, 116, 52, null, 350);
  [0, 1, 2].forEach(k => { const c = R8.svg(g, `<path class="sd" d="M${470 + k * 16} ${150 - k * 20}l12 -4l-2 12z"/>`); c.classList.add('u-decor'); K.enter(c, T.hit + k * .05, 'pop'); });
  const ch = R8.svg(g, `<path class="sd" d="M462 176L500 138L508 146L470 184Z"/><path class="ln u-thin" d="M500 138L528 110"/>`); K.enter(ch, T.b[1], 'pop');
});

/* B15 ปิดคลิป · the action's icon, huge: it fills with the accent from the bottom (pressed) */
R3.both('B15', 'fill', 'ไอคอนใหญ่ เติมสีจนเต็ม = กดแล้ว', (K, s, T, g) => {
  const [icon] = R3.ACT[s.action] ?? R3.ACT.follow, S = 190, C = {x: 300, y: s.label ? 128 : 160};
  const ic = node(g, C.x - S / 2, C.y - S / 2, S, S, '', ICO(icon, S)); ic.p.className = 'u-label'; K.enter(ic.o, T.b[0], 'pop');
  const sol = div(`left:${C.x - S / 2}px;top:${C.y - S / 2}px;width:${S}px;height:${S}px`, g, S9.solid(icon, S));
  A(sol, [{clipPath: 'inset(100% 0 0 0)'}, {clipPath: 'inset(0 0 0 0)'}], T.b[2], T.hit - T.b[2], {f: 'both'});
  const ring = node(g, C.x - S / 2 - 20, C.y - S / 2 - 20, S + 40, S + 40, ''); ring.p.style.borderRadius = '50%'; R1.ripple(K, ring, T.hit, {r: '50%'});
  if (s.label) { const pl = R9.acc(g, C.x - 120, 250, 240, 58, 16); R9.accWord(K, pl.p, s.label, 120, 8, 36, null, 210); K.enter(pl.o, T.hit, 'pop'); }
});

/* B15 ปิดคลิป · a phone: the profile's big button turns from the action into "done" (app screen) */
R3.both('B15', 'profile', 'หน้าจอมือถือ ปุ่มติดตามเปลี่ยนเป็นกดแล้ว', (K, s, T, g) => {
  const [icon, done] = R3.ACT[s.action] ?? R3.ACT.follow, X = 196, Y = 8, W = 208, H = 324;
  const ph = R9.card(g, X, Y, W, H, 30); K.enter(ph.o, T.b[0], 'rise');
  div(`left:${W / 2 - 30}px;top:10px;width:60px;height:10px;border-radius:5px;background:var(--sd)`, ph.p);
  const cv = div(`left:14px;top:32px;width:${W - 28}px;height:96px;border-radius:14px;background:var(--tr)`, ph.p); R9.ico(cv, 'image', (W - 28) / 2, 48, 40);
  [[150, 140], [176, 100], [276, 150], [298, 120]].forEach(([y, w]) => div(`left:20px;top:${y}px;width:${w}px;height:12px;border-radius:6px;background:var(--tr)`, ph.p));
  const bt = R9.acc(ph.p, 14, 204, W - 28, 56, 16); K.enter(bt.o, T.hit, 'pop');
  R9.ico(bt.p, done, s.label ? 34 : (W - 28) / 2, 28, 30, 'u-bubble-text');
  if (s.label) { const w = R6.wordL(K, bt.p, s.label, 58, 8, 30, null, W - 100); w.classList.add('u-bubble-text'); }
  void icon;
}, null, {ui: true});

/* ================= sample sentences for the sketches (s9.*) ================= */
SENTENCE('s9.diet', {cat: 'B09', name: 'อาทิตย์แรก เดือนแรก สามเดือน', say: ['ลดน้ำหนักมาครบ', 'สามเดือนแล้ว'],
  points: [{icon: 'calendar', label: 'อาทิตย์แรก'}, {icon: 'calendar-days', label: 'เดือนแรก'}, {icon: 'calendar-check', label: 'สามเดือน'}], at: 2, result: {icon: 'trophy'}});
SENTENCE('s9.price', {cat: 'B13', name: 'เคล็ดลับคือตั้งราคาลงท้ายเก้า', say: ['เคล็ดลับคือ', 'ราคาลงท้ายเก้า'], secret: {icon: 'tag', label: 'ลงท้ายเก้า'}});
SENTENCE('s9.cash', {cat: 'B16', name: 'กระแสเงินสดคือเงินเข้าออก', say: ['กระแสเงินสดก็คือ', 'เงินเข้าออก'],
  term: {icon: 'wallet', label: 'กระแสเงินสด'}, means: [{icon: 'banknote', label: 'เงินเข้า'}, {icon: 'arrow-up-right', label: 'เงินออก'}]});
SENTENCE('s9.friend', {cat: 'B20', name: 'เพื่อนสนิท', say: ['เราสองคนเป็น', 'เพื่อนสนิทกัน'], a: {icon: 'user', label: 'ผม'}, b: {icon: 'user', label: 'ต้น'}, label: 'เพื่อนสนิท'});
SENTENCE('s9.ex', {cat: 'B20', name: 'แฟนเก่า เลิกกันแล้ว', say: ['สุดท้ายก็', 'เลิกกันไป'], a: {icon: 'user', label: 'ผม'}, b: {icon: 'user', label: 'เขา'}, label: 'แฟนเก่า', cut: true});
SENTENCE('s9.cafe', {cat: 'B21', name: 'คาเฟ่ชั้นสอง ริมหน้าต่าง', say: ['คาเฟ่นี้อยู่ชั้นสอง', 'ริมหน้าต่าง'], place: {icon: 'coffee', label: 'คาเฟ่บ้านไม้'}, spots: [{icon: 'layers', label: 'ชั้นสอง'}, {icon: 'sun', label: 'ริมหน้าต่าง'}]});
SENTENCE('s9.million', {cat: 'B08', name: 'ยอดขายถึงล้าน', say: ['ปีนี้ยอดขาย', 'แตะหลักล้าน'], goal: {icon: 'trophy', label: 'หลักล้าน'}});
SENTENCE('s9.temp', {cat: 'B01', name: 'ยอดขายโต 85%', say: ['เดือนนี้ยอดขายโต', '85%'], value: '85%', icon: 'shopping-cart', dir: 'up'});
SENTENCE('s9.course', {cat: 'B01', name: 'คอร์สราคา 990 บาท', say: ['คอร์สนี้ราคาแค่', '990 บาท'], value: '990', unit: 'บาท', money: true});
SENTENCE('s9.fans', {cat: 'B02', name: 'คนดูไลฟ์เพิ่มขึ้น', say: ['พอไลฟ์ทุกวัน คนดู', 'เพิ่มขึ้นเรื่อยๆ'], dir: 'up', item: {icon: 'eye'}, n: 3});
SENTENCE('s9.save', {cat: 'B02', name: 'เงินเก็บหายเกือบหมด', say: ['เดือนเดียว เงินเก็บ', 'หายไปเกือบหมด'], dir: 'down', item: {icon: 'piggy-bank'}, n: 4, keep: 1});
SENTENCE('s9.daily', {cat: 'B14', name: 'ทำทุกวันชนะ', say: ['จำไว้นะ', 'ทำทุกวันชนะ'], idea: {icon: 'repeat', label: 'ทำทุกวันชนะ'}});
SENTENCE('s9.learn', {cat: 'B14', name: 'ความผิดพลาดคือครู', say: ['ความผิดพลาดคือ', 'ครูที่ดีที่สุด'], idea: {icon: 'graduation-cap', label: 'ครูที่ดีที่สุด'}});
SENTENCE('s9.like', {cat: 'B15', name: 'กดถูกใจ', say: ['ชอบคลิปนี้', 'กดถูกใจเลย'], action: 'like', label: 'กดถูกใจ'});
SENTENCE('s9.sub', {cat: 'B15', name: 'กดติดตาม', say: ['อย่าลืม', 'กดติดตามนะ'], action: 'follow', label: 'กดติดตาม'});
