/* =====================================================================
   CutPack · uni · SKETCHES for round 12 (Friend 2026-11-12: "ทำ 20 ร่างเลย ทำรอบละ 20", then "เริ่มได้" on the idea table).
   Two drafts for ten categories: the four with the fewest (B04 B08 B09 B15) and six that come up most in the 26 scripts
   (B06 B07 B03 B17 B18 B19). The rounds 1–10 look as in round 11 (lego_r9d.js, whose R11 helpers these use): everyday
   things drawn with the features that make them read, no grey bars standing in for words, parts that meet, no drawn people.
   Still pictures only (the end state): NOT in scenes/; load with EXTRA=sketches/r12.js.
   ===================================================================== */
const R12 = {
  /* a delivery truck facing right, standing with its wheels on y (x = its middle): an accent box with a package mark on
     it, a light cab with its window and headlight, two wheels with hubs */
  truck(g, x, y, s = 1) {
    const X = v => (x + v * s).toFixed(1), Y = v => (y + v * s).toFixed(1), w = n => `calc(var(--lw) * ${n})`;
    const box = `M${X(-52)} ${Y(-70)}H${X(14)}V${Y(-18)}H${X(-52)}Z`, cab = `M${X(16)} ${Y(-50)}H${X(36)}Q${X(44)} ${Y(-50)} ${X(48)} ${Y(-42)}L${X(56)} ${Y(-30)}V${Y(-18)}H${X(16)}Z`;
    return R8.svg(g, R11.accP(box, .5) + `<path style="fill:none;stroke:var(--ac-line, var(--ink));stroke-width:${w(.18)};opacity:.5" d="M${X(-32)} ${Y(-70)}V${Y(-50)}H${X(-6)}V${Y(-70)}"/>` +
      R11.paper(cab) + `<path style="fill:var(--ink);opacity:.22;stroke:none" d="M${X(24)} ${Y(-44)}H${X(36)}L${X(44)} ${Y(-32)}H${X(24)}Z"/>` +
      `<circle cx="${X(53)}" cy="${Y(-24)}" r="${(3 * s).toFixed(1)}" style="fill:var(--ac-stroke, var(--ac))"/>` +
      [-34, 34].map(cx => `<circle cx="${X(cx)}" cy="${Y(-11)}" r="${(11 * s).toFixed(1)}" style="fill:var(--ink)"/><circle cx="${X(cx)}" cy="${Y(-11)}" r="${(4.5 * s).toFixed(1)}" style="fill:var(--fl)"/>`).join(''));
  },
  /* a footprint (a left foot when side < 0) pointing along angle a (radians, 0 = up), centred on (x, y): the sole wide at
     the ball and narrow at the arch, a round heel, five toes */
  foot(x, y, a, side, k = 1) {
    const m = side < 0 ? -1 : 1, deg = (a * 180 / Math.PI).toFixed(1);
    const sole = `M0 -14C8 -14 11 -6 9 2C8 6 6 9 5 13C4 18 1 21 -3 21C-7 21 -9 17 -8 12C-7 6 -9 2 -9 -4C-9 -10 -6 -14 0 -14Z`;
    const toes = [[-7, -19, 3.4], [-1.5, -21, 2.8], [3.5, -20.5, 2.5], [7.5, -18.5, 2.2], [10.5, -15, 2]].map(([tx, ty, r]) => `<circle cx="${tx}" cy="${ty}" r="${r}"/>`).join('');
    return `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${deg}) scale(${(m * k).toFixed(2)} ${k})"><path d="${sole}"/>${toes}</g>`;
  },
  /* a word in the ink of where it sits (on a dark plate: the plate's own ink), left-anchored, that shrinks to maxW */
  ink: w => { w.style.color = 'inherit'; return w; },
  /* a 4-point sparkle */
  spark: (x, y, r) => `M${x} ${y - r}Q${x + r * .18} ${y - r * .18} ${x + r} ${y}Q${x + r * .18} ${y + r * .18} ${x} ${y + r}Q${x - r * .18} ${y + r * .18} ${x - r} ${y}Q${x - r * .18} ${y - r * .18} ${x} ${y - r}Z`,
  word: (K, p, txt, x, y, size, maxW, cls) => { const w = R6.wordL(K, p, txt, x, y, size, null, maxW); if (cls === 'u-inherit') w.style.color = 'inherit'; else if (cls) w.classList.add(cls); return w; },
};

/* ================= B04 ขั้นตอน: items [3 {icon, label?}], mark? {at, how} ================= */
/* 1 · a parcel tracker in an app: the steps are stops on a line; the truck has driven up to the step that matters and the
   line behind it is lit; a segmented bar on top shows how far it has come */
R3.both('B04', 'track', 'ติดตามพัสดุในแอป รถวิ่งไปทีละจุด', (K, s, T, g) => {
  const it = (s.items ?? []).slice(0, 3), at = s.mark?.at ?? it.length - 1, xs = [96, 266, 436], ly = 200;
  const c = R9.card(g, 44, 8, 512, 316, 28);
  const hd = R11.disc(c.p, 50, 50, 28, 'acc'); R9.ico(hd.p, 'package', 28, 28, 30, 'u-bubble-text');
  const ok = R11.disc(c.p, 112, 50, 16, 'acc'); ok.p.style.boxShadow = 'none'; R9.ico(ok.p, 'check', 16, 16, 20, 'u-bubble-text');
  if (it[at]?.label) R12.word(K, c.p, it[at].label, 138, 30, 32, 340); else R9.ico(c.p, it[at]?.icon ?? 'check', 160, 50, 32);
  R11.bar(c.p, 0, 96, 512, 2, null, 1);
  R8.svg(c.p, `<path style="fill:none;stroke:var(--tr);stroke-width:12px;stroke-linecap:round" d="M${xs[0]} ${ly}H${xs[2]}"/>` +
    (at ? `<path style="fill:none;stroke:var(--ac-line, var(--ink));stroke-width:16px;stroke-linecap:round" d="M${xs[0]} ${ly}H${xs[at]}"/><path class="u-acc-line" style="stroke-width:10px" d="M${xs[0]} ${ly}H${xs[at]}"/>` : ''));
  R12.truck(c.p, at ? xs[at] - 96 : xs[0] + 96, ly + 2, .9);
  it.forEach((p, k) => {
    const on = k <= at, d = on ? R11.disc(c.p, xs[k], ly, 30, 'acc') : R11.disc(c.p, xs[k], ly, 30, 'soft');
    R9.ico(d.p, p.icon, 30, 30, 30, on ? 'u-bubble-text' : 'u-inherit');
    if (p.label) { const w = R4.word(K, c.p, p.label, xs[k], ly + 42, 24, null, 150); if (!on) w.style.opacity = .55; }
  });
});

/* 2 · footprints: the steps are signs along a path going up to the right, and footprints walk from one to the next; the
   step that matters is lit */
R3.both('B04', 'steps', 'รอยเท้าเดินทีละก้าวไปถึงป้ายทีละขั้น', (K, s, T, g) => {
  const it = (s.items ?? []).slice(0, 3), mk = s.mark, lit = mk ? (mk.how === 'light' ? mk.at : -1) : it.length - 1;
  const C = [[20, 196], [222, 112], [420, 28]], W = 130, H = 112;
  let prints = '';
  [[C[0][0] + W + 18, C[0][1] + 66, C[1][0] - 20, C[1][1] + 86, 3], [C[1][0] + W + 18, C[1][1] + 66, C[2][0] - 20, C[2][1] + 86, 3]]
    .forEach(([x0, y0, x1, y1, n]) => { const a = Math.atan2(x1 - x0, -(y1 - y0)); for (let i = 0; i < n; i++) { const t = (i + .5) / n; const off = (i % 2 ? 1 : -1) * 9; prints += R12.foot(x0 + (x1 - x0) * t + off * Math.cos(a), y0 + (y1 - y0) * t + off * Math.sin(a), a, i % 2 ? 1 : -1, 1.15); } });
  R8.svg(g, `<g style="fill:var(--ink);opacity:.45">${prints}</g>`);
  it.forEach((p, k) => {
    const [x, y] = C[k], on = k === lit, c = on ? R9.acc(g, x, y, W, H, 22) : R9.card(g, x, y, W, H, 22);
    R11.iconWord(K, c.p, p, W, p.label ? 14 : 32, 44, 26, on);
    if (mk?.at === k && mk.how !== 'light') K.mark(c.p, mk.how, W - 20, 20, 40, 0);
  });
});

/* ================= B08 เป้าหมาย: goal {icon, label?}, who? icon ================= */
/* 3 · a mountain: a winding trail climbs it, and the goal's flag is planted on the peak */
R3.both('B08', 'summit', 'เส้นทางขึ้นเขา ธงปักบนยอด', (K, s, T, g) => {
  const it = s.goal ?? {icon: 'flag'}, px = 262, py = 96;
  const back = 'M377 208L414 150Q426 134 438 150L548 330H500Z', main = `M40 330L${px - 14} ${py + 12}Q${px} ${py - 6} ${px + 14} ${py + 12}L500 330Z`;
  R8.svg(g, R11.paper(back) + R11.shade(back, .12) + R11.paper(main) +
    `<path style="fill:var(--tr);stroke:none" d="M${px - 14} ${py + 12}Q${px} ${py - 6} ${px + 14} ${py + 12}L${px + 52} ${py + 66}Q${px + 40} ${py + 60} ${px + 26} ${py + 52}Q${px + 16} ${py + 72} ${px + 4} ${py + 72}Q${px - 6} ${py + 56} ${px - 18} ${py + 54}Q${px - 34} ${py + 70} ${px - 50} ${py + 70}Z"/>` +
    R11.det(`M150 322C210 300 300 300 330 268S250 226 230 196S330 170 296 140S${px} ${py + 30} ${px} ${py + 8}`, .22, .55).replace('stroke-linejoin:round', 'stroke-linejoin:round;stroke-dasharray:10 12'));
  R8.svg(g, R11.inkL(`M${px} ${py + 8}V${py - 92}`, .35));
  const f = R9.acc(g, px + 4, py - 90, 166, 70, '4px 14px 14px 4px'); f.p.style.clipPath = 'polygon(0 0, 100% 0, 88% 50%, 100% 100%, 0 100%)';
  if (it.label) { R9.ico(f.p, it.icon, 30, 35, 32, 'u-bubble-text'); R12.word(K, f.p, it.label, 54, 16, 28, 86, 'u-bubble-text'); } else R9.ico(f.p, it.icon, 72, 35, 40, 'u-bubble-text');
  if (s.who) { const w = R11.disc(g, 124, 300, 24, 'main'); R11.inkIco(w.p, s.who, 24, 24, 26); }
});

/* 4 · a medal on its ribbon: the goal is on the medal, sparkles round it, the goal's name on a plate under it */
R3.both('B08', 'medal', 'เหรียญรางวัลห้อยริบบิ้น เป็นประกาย', (K, s, T, g) => {
  const it = s.goal ?? {icon: 'trophy'}, cx = 300, cy = 178, r = 74;
  R8.svg(g, R11.paper('M214 -6H270L300 92H268Z') + `<path style="fill:var(--ac-stroke, var(--ac));stroke:none" d="M235 -6H249L284 92H279Z"/>` +
    R11.accP('M386 -6H330L300 92H332Z', .5) + `<path style="fill:var(--fl);stroke:none;opacity:.9" d="M365 -6H351L316 92H321Z"/>` +
    `<rect x="${cx - 34}" y="${cy - r - 16}" width="68" height="26" rx="8" class="fl" style="stroke:none"/><rect x="${cx - 34}" y="${cy - r - 16}" width="68" height="26" rx="8" class="u-fl-edge"/>`);
  const m = R11.disc(g, cx, cy, r, 'acc');
  const ring = div(`left:12px;top:12px;width:${2 * r - 24}px;height:${2 * r - 24}px;border-radius:50%;border:3px solid currentColor;opacity:.4`, m.p); ring.className = 'u-bubble-text';
  R9.ico(m.p, it.icon, r, r, 64, 'u-bubble-text');
  R8.svg(g, [[184, 124, 18], [420, 150, 22], [402, 72, 13], [200, 214, 11]].map(([x, y, rr]) => R11.accP(R12.spark(x, y, rr), .5)).join(''));
  if (it.label) R4.word(K, g, it.label, cx, cy + r + 16, 36, null, 340);
});

/* ================= B09 เวลา: points? [3 {icon, label}], at?, result? ================= */
/* 5 · an alarm clock: its hands have reached the time, it rings (the hammer between its bells, the lines round it); the
   moments are listed beside it and the one it has reached is lit */
R3.both('B09', 'alarm', 'นาฬิกาปลุก เข็มเดินถึงเวลา สั่นดัง', (K, s, T, g) => {
  const pts = (s.points ?? []).slice(0, 3), n = pts.length, at = n ? Math.min(s.at ?? n - 1, n - 1) : 0, cx = n ? 186 : 300, cy = 186, R = 112;
  R8.svg(g, R11.accP(`M${cx - 104} ${cy - 66}A44 44 0 0 1 ${cx - 52} ${cy - 118}Z`, .5) + R11.accP(`M${cx + 104} ${cy - 66}A44 44 0 0 0 ${cx + 52} ${cy - 118}Z`, .5) +
    R11.inkL(`M${cx - 70} ${cy + 96}L${cx - 92} ${cy + 136}M${cx + 70} ${cy + 96}L${cx + 92} ${cy + 136}M${cx} ${cy - R}V${cy - R - 22}M${cx - 18} ${cy - R - 22}H${cx + 18}`, .4) +
    R11.inkL(`M${cx - 150} ${cy - 96}L${cx - 132} ${cy - 84}M${cx - 160} ${cy - 50}L${cx - 138} ${cy - 46}M${cx + 150} ${cy - 96}L${cx + 132} ${cy - 84}M${cx + 160} ${cy - 50}L${cx + 138} ${cy - 46}`, .28));
  const b = R11.disc(g, cx, cy, R); b.p.style.boxShadow = '0 0 0 9px var(--ink), 0 20px 40px rgba(0,0,0,.25)';
  const ticks = [...Array(12)].map((_, i) => { const a = i * Math.PI / 6, r0 = i % 3 ? 86 : 80, r1 = 96; return `M${(R + r0 * Math.sin(a)).toFixed(1)} ${(R - r0 * Math.cos(a)).toFixed(1)}L${(R + r1 * Math.sin(a)).toFixed(1)} ${(R - r1 * Math.cos(a)).toFixed(1)}`; }).join('');
  R8.svg(b.p, `<path style="fill:none;stroke:var(--ink);stroke-width:5px;stroke-linecap:round" d="${ticks}"/>` +
    `<path style="fill:none;stroke:var(--ink);stroke-width:10px;stroke-linecap:round" d="M${R} ${R}L${R - 34} ${R + 40}"/>` +
    `<path style="fill:none;stroke:var(--ac-stroke, var(--ac));stroke-width:7px;stroke-linecap:round" d="M${R} ${R}L${R + 4} ${R - 76}"/><circle cx="${R}" cy="${R}" r="9" style="fill:var(--ink)"/>`);
  if (!n && s.result) { const c = R9.acc(g, 400, 120, 150, 120, 24); R9.ico(c.p, s.result.icon, 75, 60, 56, 'u-bubble-text'); return; }
  pts.forEach((p, k) => {
    const y = 34 + k * 74, on = k === at, c = on ? R9.acc(g, 360, y, 186, 60, 30) : R9.card(g, 360, y, 186, 60, 30);
    R9.ico(c.p, p.icon, 32, 30, 28, on ? 'u-bubble-text' : 'u-label'); if (p.label) R12.word(K, c.p, p.label, 56, 13, 26, 118, on ? 'u-bubble-text' : null);
    if (k > at) c.o.style.opacity = .5;
  });
});

/* 6 · tally marks on a board: one bundle of five for each moment (four strokes and one across), the moment's name under
   it; the bundle it has reached is struck in the accent */
R3.both('B09', 'tally', 'ขีดนับวันบนกระดาน ขีดที่ห้าขีดทับ', (K, s, T, g) => {
  const pts = (s.points ?? []).slice(0, 3), n = pts.length || 3, at = pts.length ? Math.min(s.at ?? n - 1, n - 1) : 2;
  const b = R9.card(g, 40, 14, 512, 312, 22);
  const fr = div('left:12px;top:12px;right:12px;bottom:12px;border-radius:12px;border:3px solid var(--ink);opacity:.2', b.p);
  const xs = n === 3 ? [118, 256, 394] : [190, 322], st = R8.svg(b.p, '');
  let d = '';
  xs.slice(0, n).forEach((x, k) => {
    if (k > at) return;
    for (let i = 0; i < 4; i++) { const x0 = x - 33 + i * 22; d += `M${x0} ${70 + (i % 2) * 4}Q${x0 + 3} ${120} ${x0 - 1} ${172 - (i % 2) * 3}`; }
  });
  st.innerHTML = `<svg width="600" height="340" style="overflow:visible"><path style="fill:none;stroke:var(--ink);stroke-width:9px;stroke-linecap:round" d="${d}"/>` +
    xs.slice(0, n).map((x, k) => k > at ? '' : k === at ? `<path style="fill:none;stroke:var(--ac-line, var(--ink));stroke-width:18px;stroke-linecap:round" d="M${x - 56} ${156}L${x + 52} ${86}"/><path class="u-acc-line" style="stroke-width:12px" d="M${x - 56} ${156}L${x + 52} ${86}"/>`
      : `<path style="fill:none;stroke:var(--ink);stroke-width:9px;stroke-linecap:round" d="M${x - 56} ${156}L${x + 52} ${86}"/>`).join('') + '</svg>';
  pts.forEach((p, k) => { const w = R4.word(K, b.p, p.label ?? '', xs[k], 210, 28, null, 128); if (k > at) w.style.opacity = .4; R9.ico(b.p, p.icon, xs[k], 274, 30).style.opacity = k > at ? .4 : 1; });
});

/* ================= B15 ปิดคลิป: action, label? ================= */
/* 7 · a notification bell: it rings (it swings, lines go out), a red dot on it; what to do is on a button under it */
R3.both('B15', 'bell', 'กระดิ่งแจ้งเตือนสั่น จุดแดงเด้ง', (K, s, T, g) => {
  const ic = (R3.ACT[s.action] ?? ['bell', 'bell-ring'])[1], cx = 300;
  const bl = R6.group(g); bl.style.transformOrigin = `${cx}px 24px`; bl.style.transform = 'rotate(-10deg)';
  const bell = `M${cx} 28Q${cx + 14} 28 ${cx + 16} 44Q${cx + 76} 58 ${cx + 80} 136Q${cx + 82} 186 ${cx + 106} 210Q${cx + 112} 218 ${cx + 104} 222H${cx - 104}Q${cx - 112} 218 ${cx - 106} 210Q${cx - 82} 186 ${cx - 80} 136Q${cx - 76} 58 ${cx - 16} 44Q${cx - 14} 28 ${cx} 28Z`;
  R8.svg(bl, `<path d="M${cx - 22} 222A22 22 0 0 0 ${cx + 22} 222Z" style="fill:var(--ink)"/>` + R11.accP(bell, .5) +
    `<path style="fill:none;stroke:#FFFFFF;stroke-width:9px;stroke-linecap:round;opacity:.45" d="M${cx - 48} 110Q${cx - 50} 76 ${cx - 26} 64"/>`);
  R8.svg(g, R11.inkL(`M${cx - 140} 70Q${cx - 160} 110 ${cx - 140} 150M${cx - 170} 50Q${cx - 196} 110 ${cx - 170} 170M${cx + 140} 70Q${cx + 160} 110 ${cx + 140} 150M${cx + 170} 50Q${cx + 196} 110 ${cx + 170} 170`, .3));
  const dot = R11.disc(g, cx + 70, 58, 24, 'neg'); dot.p.style.boxShadow = '0 0 0 5px var(--bg-dot, rgba(255,255,255,.9))';
  const bt = R9.acc(g, cx - 110, 270, 220, 60, 30); R9.ico(bt.p, ic, s.label ? 46 : 110, 30, 30, 'u-bubble-text');
  if (s.label) R12.word(K, bt.p, s.label, 72, 13, 28, 132, 'u-bubble-text');
});

/* 8 · a profile page: the channel's picture and its posts, the button pressed (the pointer on it) and turned to "done" */
R3.both('B15', 'profile', 'การ์ดโปรไฟล์ เมาส์กดปุ่ม ปุ่มเปลี่ยนเป็นกดแล้ว', (K, s, T, g) => {
  const ic = (R3.ACT[s.action] ?? ['user-plus', 'user-check'])[1];
  const c = R9.card(g, 110, 4, 380, 332, 30);
  const av = R11.disc(c.p, 190, 70, 50, 'main'); R11.inkIco(av.p, 'user', 50, 50, 54);
  const ring = div('left:136px;top:16px;width:108px;height:108px;border-radius:50%;border:4px solid var(--ac-stroke, var(--ac))', c.p);
  const bt = R9.acc(c.p, 70, 140, 240, 58, 29); R9.ico(bt.p, ic, s.label ? 52 : 120, 29, 30, 'u-bubble-text');
  if (s.label) R12.word(K, bt.p, s.label, 78, 12, 28, 140, 'u-bubble-text');
  [0, 1, 2].forEach(k => { const t = R7.plain(c.p, 24 + k * 114, 222, 104, 90, 'soft', '14px'); R11.inkIco(t.p, ['image', 'play', 'image'][k], 52, 45, 32); });
  div('left:250px;top:172px;width:56px;height:56px', c.p, `<svg width="56" height="56" viewBox="0 0 24 24" style="overflow:visible"><path d="M4 2l15 9-7 1.5L9 20z" stroke-width="1.3" stroke-linejoin="round"/></svg>`).className = 'u-cursor';
});

/* ================= B06 คำถาม: about {icon, label?}, options? [2], answer? ================= */
/* 9 · a coin toss between the two options: the coin has landed showing the answer's side; the option it chose is lit */
R3.both('B06', 'coin', 'โยนเหรียญระหว่างสองทาง ตกลงหน้าคำตอบ', (K, s, T, g) => {
  const op = (s.options ?? []).slice(0, 2), pick = s.answer ? Math.max(0, op.findIndex(o => o.icon === s.answer.icon || o.label === s.answer.label)) : 0;
  R8.svg(g, R11.inkL('M196 214Q196 60 300 50Q404 60 404 214', .22, .45).replace('stroke-linejoin:round', 'stroke-linejoin:round;stroke-dasharray:4 14'));
  const cx = 300, cy = 170, rx = 92, ry = 60;
  R8.svg(g, R11.accP(`M${cx - rx} ${cy}A${rx} ${ry} 0 0 0 ${cx + rx} ${cy}V${cy + 22}A${rx} ${ry} 0 0 1 ${cx - rx} ${cy + 22}Z`, .5) + R11.shade(`M${cx - rx} ${cy}A${rx} ${ry} 0 0 0 ${cx + rx} ${cy}V${cy + 22}A${rx} ${ry} 0 0 1 ${cx - rx} ${cy + 22}Z`, .2) +
    R11.accP(`M${cx - rx} ${cy}A${rx} ${ry} 0 1 1 ${cx + rx} ${cy}A${rx} ${ry} 0 1 1 ${cx - rx} ${cy}Z`, .5));
  const face = R11.accInk(g, cx - rx, cy - ry, 2 * rx, 2 * ry);
  const rg = div(`left:14px;top:10px;width:${2 * rx - 28}px;height:${2 * ry - 20}px;border-radius:50%;border:3px solid currentColor;opacity:.35`, face.p); rg.className = 'u-bubble-text';
  R9.ico(face.p, (op[pick] ?? s.answer ?? {icon: 'circle-help'}).icon, rx, ry, 52, 'u-bubble-text');
  op.forEach((o, k) => {
    const on = k === pick, x = k ? 410 : 34, c = on ? R9.acc(g, x, 238, 156, 92, 22) : R9.card(g, x, 238, 156, 92, 22);
    const ct = div('left:0;top:0;width:156px;height:92px', c.p); R11.iconWord(K, ct, o, 156, o.label ? 8 : 24, 40, 26, on); if (!on) ct.style.opacity = .5;
  });
}, s => (s.options?.length ?? 0) >= 2);

/* 10 · a question sticker in a story: who asks on top, the question typed in its box (the cursor after it), the send
   button; when the line gives the answer, it comes back in a bubble */
R3.both('B06', 'askbox', 'สติกเกอร์ถามคำถามในสตอรี่ พิมพ์คำถามทีละตัว', (K, s, T, g) => {
  const ab = s.about ?? {icon: 'user'}, ans = s.answer;
  const c = R9.card(g, 100, 6, 400, ans ? 236 : 300, 30);
  const top = R9.acc(c.p, 0, 0, 400, 92, '30px 30px 0 0'); top.p.style.boxShadow = 'none';
  const av = R11.disc(top.p, 200, 46, 30, 'main'); R11.inkIco(av.p, ab.icon, 30, 30, 32);
 
  const f = R7.plain(c.p, 24, 112, 352, ans ? 64 : 116, 'soft', '20px');
  const q = R4.word(K, f.p, (ab.label ?? '') + ' ?', 176, ans ? 14 : 36, 34, null, 320);
  const caret = div('left:0;top:0;width:4px;height:36px;border-radius:2px;background:var(--ink)', f.p);
  FITS.push(() => { caret.style.left = 176 + q.offsetWidth / 2 + 6 + 'px'; caret.style.top = (ans ? 18 : 40) + 'px'; });
  if (!ans) { const sd = R11.disc(c.p, 200, 260, 22, 'acc'); R9.ico(sd.p, 'send', 22, 22, 22, 'u-bubble-text'); }
  else { const r = R9.acc(g, 180, 254, 300, 76, '30px 30px 8px 30px'); R9.ico(r.p, ans.icon, 44, 38, 34, 'u-bubble-text'); if (ans.label) R12.word(K, r.p, ans.label, 76, 18, 30, 200, 'u-bubble-text'); }
});

/* ================= B07 คำเตือน: thing {icon, label?}, how cross|flag, sign? ================= */
/* 11 · a warning window pops up over the screen: the big warning sign, the risky thing in it, the buttons under it */
R3.both('B07', 'alert', 'หน้าต่างเตือนเด้งขึ้นกลางจอ', (K, s, T, g) => {
  const it = s.thing ?? {icon: 'triangle-alert'}, sign = s.sign ?? (s.how === 'cross' ? 'octagon-alert' : 'triangle-alert');
  /* the screen behind it, dimmed the way a pop-up dims it (drawn, not a card: cards never overlap) */
  R8.svg(g, `<rect x="40" y="6" width="420" height="260" rx="24" style="fill:var(--ink);opacity:.07"/><rect x="40" y="6" width="420" height="260" rx="24" style="fill:none;stroke:var(--ink);stroke-width:3px;opacity:.18"/>` +
    [0, 1, 2].map(k => `<circle cx="${68 + k * 22}" cy="30" r="7" style="fill:var(--ink);opacity:.2"/>`).join(''));
  const w = R9.card(g, 120, 50, 400, 286, 26); w.p.style.boxShadow = '0 0 0 4px var(--neg), 0 30px 60px rgba(0,0,0,.3)';
  const bar = R7.plain(w.p, 0, 0, 400, 48, 'neg', '26px 26px 0 0'); bar.p.style.boxShadow = 'none';
  R11.inkIco(bar.p, sign, 30, 24, 26); [0, 1].forEach(k => R11.disc(bar.p, 344 + k * 26, 24, 8, 'card').p.style.boxShadow = 'none');
  const sg = R11.disc(w.p, 92, 132, 46, 'neg'); R11.inkIco(sg.p, sign, 46, 46, 54);
  R9.ico(w.p, it.icon, 186, 112, 40); if (it.label) R12.word(K, w.p, it.label, 162, 136, 34, 220);
  const b1 = R7.plain(w.p, 30, 212, 160, 52, 'soft', '26px'); R11.inkIco(b1.p, 'x', 80, 26, 26);
  const b2 = R7.plain(w.p, 210, 212, 160, 52, 'neg', '26px'); R11.inkIco(b2.p, s.how === 'cross' ? 'ban' : 'triangle-alert', 80, 26, 26);
});

/* 12 · a car's dashboard: the dial's needle has swung into the red; beside it the warning lights, the risky thing's light
   and the warning sign lit red, the others off; the risky thing named under them */
R3.both('B07', 'dash', 'หน้าปัดรถ เข็มเข้าโซนแดง ไฟเตือนติด', (K, s, T, g) => {
  const it = s.thing ?? {icon: 'triangle-alert'}, sign = s.sign ?? 'triangle-alert';
  const p = R7.plain(g, 40, 30, 512, 280, 'main', '140px 140px 40px 40px');
  const cx = 176, cy = 200, R = 132, arc = (a0, a1, r) => { const P = a => `${(cx + r * Math.cos(a)).toFixed(1)} ${(cy + r * Math.sin(a)).toFixed(1)}`; return `M${P(a0)}A${r} ${r} 0 0 1 ${P(a1)}`; };
  const A0 = Math.PI * 1.1, A1 = Math.PI * 1.9, red = Math.PI * 1.68, na = Math.PI * 1.8;
  const ticks = [...Array(11)].map((_, i) => { const a = A0 + (A1 - A0) * i / 10, r0 = i % 5 ? 104 : 94; return `M${(cx + r0 * Math.cos(a)).toFixed(1)} ${(cy + r0 * Math.sin(a)).toFixed(1)}L${(cx + 116 * Math.cos(a)).toFixed(1)} ${(cy + 116 * Math.sin(a)).toFixed(1)}`; }).join('');
  const d = R8.svg(p.p, `<path style="fill:none;stroke:currentColor;stroke-width:6px;stroke-linecap:round;opacity:.45" d="${arc(A0, red, R - 10)}"/>` +
    `<path style="fill:none;stroke:var(--neg);stroke-width:16px;stroke-linecap:round" d="${arc(red, A1, R - 10)}"/>` +
    `<path style="fill:none;stroke:currentColor;stroke-width:4px;stroke-linecap:round" d="${ticks}"/>` +
    `<path style="fill:none;stroke:var(--neg);stroke-width:9px;stroke-linecap:round" d="M${cx} ${cy}L${(cx + 104 * Math.cos(na)).toFixed(1)} ${(cy + 104 * Math.sin(na)).toFixed(1)}"/><circle cx="${cx}" cy="${cy}" r="14" style="fill:currentColor"/>`);
  d.className = 'u-inherit';
  R11.bar(p.p, 330, 50, 3, 210, null, 2).style.opacity = .5;
  [[it.icon, 1, 0, 0], [sign, 1, 1, 0], ['fuel', 0, 0, 1], ['thermometer', 0, 1, 1]].forEach(([ic, on, i, j]) => {
    const x = 382 + i * 74, y = 80 + j * 74, dd = on ? R11.disc(p.p, x, y, 28, 'neg') : R11.disc(p.p, x, y, 24, 'soft');
    dd.p.style.boxShadow = on ? '0 0 24px var(--neg)' : 'none'; R11.inkIco(dd.p, ic, on ? 28 : 24, on ? 28 : 24, on ? 30 : 24); });
  if (it.label) R4.word(K, p.p, it.label, 419, 196, 30, null, 150).style.color = 'inherit';
});

/* ================= B03 เปรียบเทียบ: mode versus|change, a, b, win?, how? ================= */
/* 13 · two glass jars filled to different levels (the better one fuller and lit, a tick on its lid), each with its label
   stuck on its shoulder */
R3.both('B03', 'jars', 'โหลสองใบ ของเติมไม่เท่ากัน โหลที่ชนะติดสี', (K, s, T, g) => {
  const a = s.a ?? {icon: 'circle'}, b = s.b ?? {icon: 'circle'}, win = s.win ?? 'a';
  const lv = it => it.v != null ? Math.max(.12, Math.min(1, it.v)) : null;
  [[a, 160, 'a'], [b, 420, 'b']].forEach(([it, cx, k]) => {
    const on = k === win, v = lv(it) ?? (on ? .82 : .3), W = 184, top = 66, bot = 326, l = cx - W / 2, r = cx + W / 2;
    const jar = `M${l + 24} ${top}H${r - 24}V${top + 18}Q${r} ${top + 24} ${r} ${top + 54}V${bot - 22}Q${r} ${bot} ${r - 22} ${bot}H${l + 22}Q${l} ${bot} ${l} ${bot - 22}V${top + 54}Q${l} ${top + 24} ${l + 24} ${top + 18}Z`;
    const fy = bot - 12 - (bot - top - 80) * v;
    const fill = `M${l + 10} ${fy}Q${cx} ${fy - 12} ${r - 10} ${fy}V${bot - 26}Q${r - 10} ${bot - 10} ${r - 26} ${bot - 10}H${l + 26}Q${l + 10} ${bot - 10} ${l + 10} ${bot - 26}Z`;
    R8.svg(g, `<path class="fl" style="stroke:none" d="${jar}"/>` + (on ? R11.accP(fill, 0) : `<path style="fill:var(--fl-edge, var(--ink));opacity:.28;stroke:none" d="${fill}"/>`) + `<path class="u-fl-edge" d="${jar}"/>` +
      `<rect x="${l + 14}" y="${top - 30}" width="${W - 28}" height="32" rx="10" style="fill:var(--ink)"/>` + R11.inkL(`M${l + 30} ${top - 14}H${r - 30}`, .12, .3).replace('var(--ink)', 'var(--fl)') +
      `<path style="fill:none;stroke:#FFFFFF;stroke-width:8px;stroke-linecap:round;opacity:.5" d="M${l + 22} ${top + 70}V${bot - 50}"/>`);
    const lb = R9.card(g, cx - 64, top + 40, 128, 80, 12); R11.iconWord(K, lb.p, it, 128, it.label ? 6 : 20, 36, 24);
    if (!on && s.how === 'cross') K.mark(lb.p, 'cross', 110, 14, 32, 0);
    if (on) { const m = R11.disc(g, r - 12, top - 22, 24, 'acc'); R9.ico(m.p, 'check', 24, 24, 26, 'u-bubble-text'); }
  });
}, V2.versus);

/* 14 · an app update: the old thing (faded, on the left) has turned into the new one, inside the refresh arrow that has
   gone round it; an "updated" badge on the new one */
R3.both('B03', 'update', 'อัปเดตแอป ของเดิมหมุนโหลดแล้วกลายเป็นของใหม่', (K, s, T, g) => {
  const a = s.a ?? {icon: 'circle'}, b = s.b ?? {icon: 'circle'};
  const old = R9.card(g, 34, 112, 128, 128, 30); old.o.style.opacity = .45; R11.iconWord(K, old.p, a, 128, a.label ? 16 : 36, 52, 24);
  R8.svg(g, R11.inkL('M178 176H218M204 162L220 176L204 190', .35, .45));
  const cx = 370, cy = 168, r = 136, A = d => [cx + r * Math.cos(d * Math.PI / 180), cy + r * Math.sin(d * Math.PI / 180)].map(v => v.toFixed(1)).join(' ');
  /* the refresh arrow: an arc that leaves a gap at the top, with a solid arrowhead on its end pointing along it */
  const [ex, ey] = A(-70).split(' ').map(Number), th = -70 * Math.PI / 180, dx = Math.sin(th), dy = -Math.cos(th), px = -dy, py = dx;
  const ring = `M${A(-110)}A${r} ${r} 0 1 0 ${A(-70)}`, f = v => v.toFixed(1);
  const head = `M${f(ex + dx * 30)} ${f(ey + dy * 30)}L${f(ex + px * 22 - dx * 6)} ${f(ey + py * 22 - dy * 6)}L${f(ex - px * 22 - dx * 6)} ${f(ey - py * 22 - dy * 6)}Z`;
  R8.svg(g, `<path style="fill:none;stroke:var(--ac-line, var(--ink));stroke-width:20px;stroke-linecap:round" d="${ring}"/><path class="u-acc-line" style="stroke-width:13px" d="${ring}"/>` +
    `<path style="fill:var(--ac-stroke, var(--ac));stroke:var(--ac-line, var(--ink));stroke-width:3.5px;stroke-linejoin:round" d="${head}"/>`);
  const t = R9.acc(g, cx - 92, cy - 92, 184, 184, 44); R11.iconWord(K, t.p, b, 184, b.label ? 34 : 56, 72, 32, true);
  const nb = R11.disc(g, cx + 92, cy - 92, 24, 'main'); R11.inkIco(nb.p, 'check', 24, 24, 26);
});

/* ================= B17 ไล่รายการ: items [2-4 {icon, label?}], label? ================= */
/* 15 · an open suitcase: the things have been packed into it standing side by side (their names clear above its front),
   straps across it, the group's name on the luggage tag hanging from its side */
R3.both('B17', 'suitcase', 'กระเป๋าเดินทางเปิด ของลงไปทีละชิ้น', (K, s, T, g) => {
  const it = (s.items ?? []).slice(0, 4), n = it.length, L = 60, R = 470, mid = (L + R) / 2, lid = `M${L + 10} 150V44Q${L + 10} 20 ${L + 34} 20H${R - 34}Q${R - 10} 20 ${R - 10} 44V150Z`;
  R8.svg(g, R11.paper(lid) + R11.shade(lid, .1) + R11.det(`M${L + 40} 44V136M${R - 40} 44V136`, .2, .4) + R11.det(`M${mid - 50} 20V8H${mid + 50}V20`, .35, .8));
  const iw = Math.min(104, (R - L - 50) / Math.max(n, 1));
  const inside = R6.group(g); inside.style.clipPath = 'polygon(-100px -100px, 700px -100px, 700px 184px, -100px 184px)';
  it.forEach((p, k) => { const x = mid + (k - (n - 1) / 2) * (iw + 8), c = R9.card(inside, x - iw / 2, 70 + (k % 2) * 10, iw, 130, 18);
    R11.iconWord(K, c.p, p, iw, 12, 38, 22); c.p.style.transform = `rotate(${(k % 2 ? 1 : -1) * 3}deg)`; });
  const base = `M${L} 184H${R}V306Q${R} 330 ${R - 24} 330H${L + 24}Q${L} 330 ${L} 306Z`;
  R8.svg(g, R11.accP(base, .5) + `<path style="fill:none;stroke:var(--ac-line, var(--ink));stroke-width:4px;opacity:.45" d="M${L} 200H${R}"/>` +
    `<rect x="${mid - 120}" y="184" width="26" height="146" style="fill:#000;opacity:.12"/><rect x="${mid + 94}" y="184" width="26" height="146" style="fill:#000;opacity:.12"/>` +
    R11.accP(`M${mid - 18} 176H${mid + 18}V198H${mid - 18}Z`, .5));
  if (s.label) {
    R8.svg(g, `<circle cx="${R + 2}" cy="214" r="8" style="fill:none;stroke:var(--ink);stroke-width:4px"/>` + R11.inkL(`M${R + 8} 220Q${R + 22} 240 ${R + 24} 252`, .22));
    const tg = R7.plain(g, R - 34, 252, 118, 66, 'main', '10px'); tg.p.style.clipPath = 'polygon(0 18%, 18% 0, 100% 0, 100% 100%, 0 100%)';
    R11.disc(tg.p, 20, 22, 6, 'card').p.style.boxShadow = 'none';
    R12.word(K, tg.p, s.label, 10, 30, 22, 100, 'u-inherit');
  }
});

/* 16 · a menu board: the group's name as its title, then one line for each thing with its icon and a dotted leader */
R3.both('B17', 'menu', 'กระดานเมนู ของขึ้นทีละบรรทัด', (K, s, T, g) => {
  const it = (s.items ?? []).slice(0, 4), n = it.length;
  R8.svg(g, R11.inkL('M200 24L300 2L400 24', .2) + `<circle cx="300" cy="4" r="6" style="fill:var(--ink)"/>`);
  const b = R7.plain(g, 120, 22, 360, 312, 'main', '20px');
  div('left:12px;top:12px;right:12px;bottom:12px;border-radius:10px;border:2.5px dashed currentColor;opacity:.3', b.p).className = 'u-inherit';
  const top = s.label ? 84 : 40, rh = Math.min(64, (290 - top) / Math.max(n, 1));
  if (s.label) { const t = R4.word(K, b.p, s.label, 180, 26, 34, null, 300); t.style.color = 'inherit'; R11.rule(b.p, 120, 72, 120, .5, 'u-inherit', 3); }
  it.forEach((p, k) => { const y = top + k * rh;
    R9.ico(b.p, p.icon, 52, y + rh / 2, 28, 'u-inherit');
    const w = R12.word(K, b.p, p.label ?? '', 80, y + rh / 2 - 18, 28, 170, 'u-inherit');
    const ld = div(`left:250px;top:${y + rh / 2 + 6}px;width:70px;height:0;border-top:4px dotted currentColor;opacity:.4`, b.p); ld.className = 'u-inherit';
    FITS.push(() => { const e = 80 + w.offsetWidth + 10; ld.style.left = e + 'px'; ld.style.width = Math.max(0, 300 - e) + 'px'; });
    const dt = R11.disc(b.p, 322, y + rh / 2, 9, 'acc'); dt.p.style.boxShadow = 'none'; });
});

/* ================= B18 เล่าเหตุการณ์: what {icon, label?}, who? {icon, label?}, when? ================= */
/* 17 · a security camera's screen: the camera on its wall bracket above it, the red dot recording, the time stamp (when),
   and the thing that happened in the middle of the picture inside the viewfinder corners */
R3.both('B18', 'cctv', 'จอกล้องวงจรปิด จุดบันทึกกะพริบ เหตุการณ์ขึ้น', (K, s, T, g) => {
  const w = s.what ?? {icon: 'circle-alert'};
  const cam = 'M92 22H176Q190 22 192 36L196 58Q198 70 186 70H96Q84 70 84 58V34Q84 22 92 22Z';
  R8.svg(g, `<rect x="44" y="4" width="18" height="44" rx="6" class="fl" style="stroke:none"/><rect x="44" y="4" width="18" height="44" rx="6" class="u-fl-edge"/>` +
    R11.inkL('M62 26H86', .35) + `<g transform="translate(0 -6) rotate(8 140 46)">${R11.paper(cam)}<circle cx="190" cy="46" r="13" style="fill:var(--ink)"/><circle cx="190" cy="46" r="6" style="fill:var(--ac-stroke, var(--ac))"/><circle cx="106" cy="36" r="5" style="fill:var(--neg)"/></g>`);
  const m = R7.plain(g, 120, 62, 430, 270, 'main', '24px');
  const sc = R9.card(m.p, 16, 16, 398, 238, 12);
  R8.svg(sc.p, `<path style="fill:none;stroke:var(--ink);stroke-width:5px;stroke-linecap:round;opacity:.6" d="M30 64V30H64M334 30H368V64M368 174V208H334M64 208H30V174"/>`);
  const rec = R11.disc(sc.p, 46, 46, 9, 'neg'); rec.p.style.boxShadow = '0 0 12px var(--neg)';
  if (s.when) R12.word(K, sc.p, s.when, 64, 30, 24, 220);
  const ev = R9.acc(sc.p, 124, 64, 150, 130, 22); R11.iconWord(K, ev.p, w, 150, w.label ? 14 : 34, 56, 26, true);
  if (s.who) { const d = R11.disc(sc.p, 322, 168, 26, 'main'); R11.inkIco(d.p, s.who.icon, 26, 26, 28); }
  R8.svg(sc.p, `<path style="fill:none;stroke:var(--tr);stroke-width:2px" d="${[...Array(10)].map((_, i) => `M0 ${12 + i * 24}H398`).join('')}"/>`);
});

/* 18 · a memory post coming back ("on this day"): who posted it and when on top, the picture of what happened, the
   reactions under it */
R3.both('B18', 'memory', 'โพสต์ย้อนความทรงจำ รูปเหตุการณ์ค่อย ๆ ชัด', (K, s, T, g) => {
  const w = s.what ?? {icon: 'image'}, who = s.who ?? {icon: 'user'};
  const c = R9.card(g, 130, 4, 340, 332, 26);
  const av = R11.disc(c.p, 42, 40, 22, 'main'); R11.inkIco(av.p, who.icon, 22, 22, 24);
  if (who.label) R12.word(K, c.p, who.label, 76, 12, 26, 160);
  R9.ico(c.p, 'history', who.label ? 92 : 84, 54, 20).style.opacity = .6; if (s.when) R12.word(K, c.p, s.when, who.label ? 106 : 98, 41, 20, 150).style.opacity = .75;
  const hb = R11.disc(c.p, 300, 40, 20, 'acc'); R9.ico(hb.p, 'history', 20, 20, 22, 'u-bubble-text');
  const pic = R9.acc(c.p, 16, 76, 308, 196, 14); R11.iconWord(K, pic.p, w, 308, w.label ? 40 : 62, 76, 32, true);
  [['heart', 30], ['message-circle', 74], ['share-2', 118]].forEach(([ic, x]) => R9.ico(c.p, ic, x, 300, 28));
  R9.ico(c.p, 'bookmark', 304, 300, 28);
});

/* ================= B19 ความรู้สึก: feel {icon, label?}, who?, mood ================= */
/* 19 · the reaction bar of a post: five reactions in a row, the one that is felt has jumped up big over it with its word */
R3.both('B19', 'react', 'แถบอีโมจิบนโพสต์ อีโมจิที่ใช่ขยายใหญ่', (K, s, T, g) => {
  const f = s.feel ?? {icon: 'smile'}, bad = s.mood === 'bad';
  const set = bad ? ['thumbs-up', 'heart', 'frown', 'angry', 'meh'] : ['thumbs-up', 'heart', 'laugh', 'smile', 'party-popper'];
  if (!set.includes(f.icon)) set[2] = f.icon;
  const pick = set.indexOf(f.icon), xs = [0, 1, 2, 3, 4].map(k => 120 + k * 90);
  const bar = R9.card(g, 70, 222, 460, 96, 48);
  set.forEach((ic, k) => { if (k === pick) return; const d = R11.disc(g, xs[k], 270, 32, 'soft'); R11.inkIco(d.p, ic, 32, 32, 36); });
  const big = R11.disc(g, xs[pick], 138, 66, bad ? 'neg' : 'acc'); if (bad) R11.inkIco(big.p, f.icon, 66, 66, 78); else R9.ico(big.p, f.icon, 66, 66, 78, 'u-bubble-text');
  R8.svg(g, R11.inkL(`M${xs[pick]} 214V246`, .2, .35));
  if (f.label) { const lb = R7.plain(g, xs[pick] - 90, 18, 180, 48, 'main', '24px'); R4.word(K, lb.p, f.label, 90, 6, 28, null, 160).style.color = 'inherit'; }
});

/* 20 · a heart monitor: the pulse line runs across the screen and jumps high at the end (calm and even when good, wild
   when bad); the heart and the feeling's word beside it */
R3.both('B19', 'pulse', 'จอวัดชีพจร เส้นกระโดดสูงตรงคำสำคัญ', (K, s, T, g) => {
  const f = s.feel ?? {icon: 'heart'}, bad = s.mood === 'bad';
  const m = R7.plain(g, 40, 20, 512, 300, 'main', '28px');
  const sc = div('left:16px;top:16px;width:480px;height:268px;border-radius:16px;overflow:hidden', m.p);
  R8.svg(sc, `<path style="fill:none;stroke:currentColor;stroke-width:1.5px;opacity:.18" d="${[...Array(9)].map((_, i) => `M0 ${i * 32}H480`).join('')}${[...Array(16)].map((_, i) => `M${i * 32} 0V268`).join('')}"/>`).className = 'u-inherit';
  const beat = (x, h) => `L${x} 168L${x + 8} 176L${x + 16} ${168 - h}L${x + 26} ${196 + h * .2}L${x + 34} 168`;
  const d = 'M0 168' + (bad ? beat(40, 40) + beat(110, 70) + beat(170, 50) + beat(230, 90) + beat(290, 120) : beat(50, 40) + beat(150, 44) + beat(250, 52)) + 'L330 168';
  R8.svg(sc, `<path style="fill:none;stroke:${bad ? 'var(--neg)' : 'var(--ac-stroke, var(--ac))'};stroke-width:7px;stroke-linecap:round;stroke-linejoin:round" d="${d}"/><circle cx="330" cy="168" r="9" style="fill:${bad ? 'var(--neg)' : 'var(--ac-stroke, var(--ac))'}"/>`);
  const ht = R11.disc(m.p, 430, 96, 44, bad ? 'neg' : 'acc'); if (bad) R11.inkIco(ht.p, f.icon, 44, 44, 50); else R9.ico(ht.p, f.icon, 44, 44, 50, 'u-bubble-text');
  if (f.label) { const w = R4.word(K, m.p, f.label, 430, 160, 30, null, 130); w.style.color = 'inherit'; }
  if (s.who) { const d2 = R11.disc(m.p, 430, 236, 22, 'soft'); R11.inkIco(d2.p, s.who.icon, 22, 22, 24); }
});

/* ================= sample sentences (n12.*), general ones (not Friend's script) ================= */
SENTENCE('n12.order', {cat: 'B04', name: 'สั่ง แพ็ก ส่ง', say: ['สั่งปุ๊บ แพ็กปั๊บ', 'ส่งถึงบ้าน'], items: [{icon: 'shopping-cart', label: 'สั่ง'}, {icon: 'package', label: 'แพ็ก'}, {icon: 'house', label: 'ส่งถึงบ้าน'}], mark: {at: 2, how: 'light'}});
SENTENCE('n12.plan', {cat: 'B04', name: 'ตั้งเป้า ลงมือ ทบทวน', say: ['ตั้งเป้า ลงมือทำ', 'แล้วทบทวน'], items: [{icon: 'target', label: 'ตั้งเป้า'}, {icon: 'hammer', label: 'ลงมือทำ'}, {icon: 'repeat', label: 'ทบทวน'}], mark: {at: 2, how: 'light'}});
SENTENCE('n12.top', {cat: 'B08', name: 'ยอดขายถึงล้าน', say: ['ปีนี้ยอดขายทะลุ', 'หนึ่งล้าน'], goal: {icon: 'trophy', label: 'หนึ่งล้าน'}, who: 'user'});
SENTENCE('n12.win', {cat: 'B08', name: 'ได้ที่หนึ่ง', say: ['ส่งประกวดครั้งแรก', 'ได้ที่หนึ่ง'], goal: {icon: 'award', label: 'ที่หนึ่ง'}});
SENTENCE('n12.due', {cat: 'B09', name: 'ส่งงานพรุ่งนี้เช้า', say: ['เหลือเวลาอีกนิดเดียว', 'ส่งพรุ่งนี้เช้า'], points: [{icon: 'sunset', label: 'เย็นนี้'}, {icon: 'moon', label: 'เที่ยงคืน'}, {icon: 'sunrise', label: 'พรุ่งนี้เช้า'}], at: 2});
SENTENCE('n12.days', {cat: 'B09', name: 'ทำมา 3 สัปดาห์', say: ['ทำต่อเนื่องมา', 'สามสัปดาห์แล้ว'], points: [{icon: 'calendar', label: 'สัปดาห์ 1'}, {icon: 'calendar', label: 'สัปดาห์ 2'}, {icon: 'calendar-check', label: 'สัปดาห์ 3'}], at: 2});
SENTENCE('n12.follow', {cat: 'B15', name: 'กดติดตาม', say: ['อย่าลืม', 'กดติดตามนะ'], action: 'follow', label: 'ติดตาม'});
SENTENCE('n12.save', {cat: 'B15', name: 'เซฟเก็บไว้', say: ['คลิปนี้มีประโยชน์', 'เซฟเก็บไว้เลย'], action: 'save', label: 'เซฟ'});
SENTENCE('n12.pick', {cat: 'B06', name: 'ขายเองหรือฝากขาย', say: ['ลังเลว่าจะขายเอง', 'หรือฝากขายดี'], about: {icon: 'user'}, options: [{icon: 'store', label: 'ขายเอง'}, {icon: 'handshake', label: 'ฝากขาย'}]});
SENTENCE('n12.start', {cat: 'B06', name: 'มือใหม่ถามว่าเริ่มยังไง', say: ['มือใหม่ชอบถามว่า', 'ต้องเริ่มยังไง'], about: {icon: 'user', label: 'เริ่มยังไง'}});
SENTENCE('n12.ask', {cat: 'B06', name: 'ถามว่าเริ่มยังไง ตอบว่าเริ่มจากไลฟ์', say: ['ถามว่าเริ่มยังไง', 'เริ่มจากไลฟ์ก่อน'], about: {icon: 'user', label: 'เริ่มยังไง'}, answer: {icon: 'video', label: 'ไลฟ์ขาย'}});
SENTENCE('n12.loan', {cat: 'B07', name: 'อย่ากู้มาลงทุน', say: ['หยุดก่อน อย่า', 'กู้มาลงทุน'], thing: {icon: 'landmark', label: 'กู้มาลงทุน'}, how: 'cross', sign: 'octagon-alert'});
SENTENCE('n12.burn', {cat: 'B07', name: 'ระวังหมดไฟ', say: ['ทำงานหนักแบบนี้', 'ระวังหมดไฟ'], thing: {icon: 'flame', label: 'หมดไฟ'}, how: 'flag', sign: 'triangle-alert'});
SENTENCE('n12.walk', {cat: 'B03', name: 'เดินเร็วดีกว่าวิ่งนาน', say: ['เดินเร็วทุกวัน', 'ได้ผลกว่าวิ่งนาน'], mode: 'versus', a: {icon: 'footprints', label: 'เดินเร็ว'}, b: {icon: 'timer', label: 'วิ่งนาน'}, win: 'a'});
SENTENCE('n12.new', {cat: 'B03', name: 'จากร้านเล็กเป็นแบรนด์', say: ['จากร้านเล็ก ๆ', 'กลายเป็นแบรนด์'], mode: 'change', a: {icon: 'store', label: 'ร้านเล็ก'}, b: {icon: 'building-2', label: 'แบรนด์'}});
SENTENCE('n12.trip', {cat: 'B17', name: 'ของที่ต้องพกไปเที่ยว', say: ['ไปเที่ยวต้องพก กล้อง', 'ยา พาสปอร์ต'], label: 'ของต้องพก', items: [{icon: 'camera', label: 'กล้อง'}, {icon: 'pill', label: 'ยา'}, {icon: 'book-open', label: 'พาสปอร์ต'}]});
SENTENCE('n12.drinks', {cat: 'B17', name: 'เมนูมีกาแฟ ชา โกโก้', say: ['ร้านเรามีกาแฟ ชา โกโก้', 'แล้วก็น้ำผลไม้'], label: 'เมนูเครื่องดื่ม', items: [{icon: 'coffee', label: 'กาแฟ'}, {icon: 'cup-soda', label: 'ชา'}, {icon: 'milk', label: 'โกโก้'}, {icon: 'citrus', label: 'น้ำผลไม้'}]});
SENTENCE('n12.thief', {cat: 'B18', name: 'ตีสามมีคนงัดร้าน', say: ['ตีสามคืนนั้น', 'มีคนงัดร้าน'], what: {icon: 'lock-open', label: 'งัดร้าน'}, who: {icon: 'user'}, when: 'ตีสาม'});
SENTENCE('n12.open', {cat: 'B18', name: 'ปี 2019 เปิดร้านแรก', say: ['ปี 2019 ผมตัดสินใจ', 'เปิดร้านแรก'], what: {icon: 'store', label: 'เปิดร้านแรก'}, who: {icon: 'user', label: 'ผม'}, when: 'ปี 2019'});
SENTENCE('n12.happy', {cat: 'B19', name: 'ดีใจมาก', say: ['ได้ยินแบบนั้นแล้ว', 'ดีใจมาก'], feel: {icon: 'laugh', label: 'ดีใจมาก'}, mood: 'good'});
SENTENCE('n12.scared', {cat: 'B19', name: 'ตื่นเต้นจนใจสั่น', say: ['ขึ้นเวทีครั้งแรก', 'ตื่นเต้นจนใจสั่น'], feel: {icon: 'heart', label: 'ใจสั่น'}, who: {icon: 'user'}, mood: 'bad'});
