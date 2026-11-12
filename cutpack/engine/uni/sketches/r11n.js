/* =====================================================================
   CutPack · uni · SKETCHES for round 11, new set (Friend 2026-11-11: "ผมชอบรอบที่ 1-10 มากกว่าอะ ไม่ต้องใช้ skill นี้วาดแล้ว
   กลับไปใช้ลายเส้นแบบเดิม และออกแบบใหม่ทั้งหมด (ไม่เอาคน)" · "ไม่รวม icon"). The rounds 1–10 look: rounded cards, the
   slot's icons, the accent, clear words; everyday things with a mechanism that ends on the result. No drawn people (icons,
   the person icon too, are fine). Two drafts for each of the round's ten categories (DECISIONS round 11).
   Redrawn 2026-11-12 (Friend: "ชอบไอเดียทั้งหมดแล้ว แต่ตอนนี้งานจังดูเป็นงานลวกๆ ช่วยทำให้มันดีกว่านี้หน่อย"): every thing
   drawn with the features that make it read (an envelope's flap and folds, a glass with its drink, a box with its faces and
   tape), no grey placeholder bars standing in for words, parts that meet where they should (the tag's string through its
   hole, the map's roads inside the map), and each picture filling the frame.
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
  /* a right-anchored word that shrinks to maxW (its right end at x on a 600-wide parent) */
  wordR(K, p, txt, x, y, size, maxW) { const l = R6.wordL(K, p, txt, 0, y, size, null, maxW); l.style.left = 'auto'; l.style.right = (600 - x) + 'px'; return l; },
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
  /* drawn shapes (SVG strings), painted only through the style's roles:
     paper = a light thing (fl) with its edge drawn once · accP = an accent thing with the accent's own edge (f × --lw-ac)
     det = a detail line on a light thing · inkL = a line in the ink of where it sits · shade = a darker face */
  paper: (d, w) => `<path class="fl" style="stroke:none" d="${d}"/><path class="u-fl-edge"${w ? ` style="stroke-width:${w}"` : ''} d="${d}"/>`,
  accP: (d, f = .5) => `<path class="ac" style="stroke:var(--ac-line, var(--ink));stroke-width:calc(var(--lw-ac, 0) * ${f})" d="${d}"/>`,
  det: (d, f = .3, op = 1) => `<path style="fill:none;stroke:var(--fl-edge, var(--ink));stroke-width:calc(var(--lw) * ${f});stroke-linecap:round;stroke-linejoin:round;opacity:${op}" d="${d}"/>`,
  inkL: (d, f = .3, op = 1) => `<path style="fill:none;stroke:var(--ink);stroke-width:calc(var(--lw) * ${f});stroke-linecap:round;stroke-linejoin:round;opacity:${op}" d="${d}"/>`,
  shade: (d, a = .14) => `<path style="fill:#000;stroke:none;opacity:${a}" d="${d}"/>`,
  /* a layer over a drawn accent shape that only gives its words and icons the accent's ink (no surface of its own) */
  accInk(g, x, y, w, h) { const n = node(g, x, y, w, h, 'u-badge u-acc'); n.p.style.cssText += ';background:none;border:none;box-shadow:none;display:block'; return n; },
  /* a stamp's perforated edge, as a clip-path */
  zig(w, h, s = 8, d = 5) {
    const p = [], nx = Math.round(w / s), ny = Math.round(h / s), sx = w / nx, sy = h / ny, f = v => v.toFixed(1) + 'px';
    for (let i = 0; i < nx; i++) p.push(`${f(i * sx)} 0px`, `${f((i + .5) * sx)} ${d}px`);
    for (let i = 0; i < ny; i++) p.push(`${w}px ${f(i * sy)}`, `${w - d}px ${f((i + .5) * sy)}`);
    for (let i = nx; i > 0; i--) p.push(`${f(i * sx)} ${h}px`, `${f((i - .5) * sx)} ${h - d}px`);
    for (let i = ny; i > 0; i--) p.push(`0px ${f(i * sy)}`, `${d}px ${f((i - .5) * sy)}`);
    return `polygon(${p.join(',')})`;
  },
  /* a drop of water, round at the bottom (its round part centred on x, y), pointing up */
  drop: (x, y, r) => `M${x} ${y - 1.55 * r}C${x + .3 * r} ${y - 1.05 * r} ${x + r} ${y - .55 * r} ${x + r} ${y}A${r} ${r} 0 1 1 ${x - r} ${y}C${x - r} ${y - .55 * r} ${x - .3 * r} ${y - 1.05 * r} ${x} ${y - 1.55 * r}Z`,
  /* a smooth curve through points (Catmull-Rom as cubic Béziers), to be appended after a point at pts[0] */
  smooth(pts) {
    const f = v => v.toFixed(1); let d = '';
    for (let i = 0; i < pts.length - 1; i++) { const p0 = pts[i - 1] ?? pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] ?? p2;
      d += `C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])} ${f(p2[1])}`; }
    return d;
  },
  /* the effect's card: lit in the accent, or (a bad effect) a plain card ringed in red, as the wrong answer of
     the quiz (a red card with white words reads 2.5 in the split style) */
  effect(K, g, x, y, w, h, r, p, neg, iy, is, ly, ls) {
    const c = neg ? R9.card(g, x, y, w, h, r) : R9.acc(g, x, y, w, h, r);
    if (neg) c.p.style.boxShadow = '0 0 0 5px var(--neg)';
    R9.ico(c.p, p.icon, w / 2, iy, is, neg ? 'u-label' : 'u-bubble-text');
    if (p.label) { const l = R4.word(K, c.p, p.label, w / 2, ly, ls, null, w - 16); if (!neg) l.classList.add('u-bubble-text'); }
    return c;
  },
  /* a thin line across a surface (u-bubble-text on an accent, u-label on a card) at low strength */
  rule(p, x, y, w, op = .3, cls = 'u-label', h = 3) { const e = div(`left:${x}px;top:${y}px;width:${w}px;height:${h}px;border-radius:${h}px;background:currentColor;opacity:${op}`, p); e.className = cls; return e; },
};

/* ================= B10 คน: who? {icon, label?}, label?, tags? [≤2] ================= */
/* 1 · an invitation: the card rises out of its envelope (the flap stands open behind it), and who it is for is on it */
R3.both('B10', 'invite', 'บัตรเชิญเลื่อนออกจากซอง ชื่อกลุ่มที่ใช่อยู่บนบัตร', (K, s, T, g) => {
  const who = s.who ?? {icon: 'user'}, w = s.label ?? who.label, tags = (s.tags ?? []).slice(0, 2);
  const L = 74, R = 526, top = 178, bot = 334, mid = 300, vy = 266;
  /* the inside of the envelope, then the open flap with its paper liner, both behind the card */
  const back = `M${L} ${top}H${R}V${bot - 18}Q${R} ${bot} ${R - 18} ${bot}H${L + 18}Q${L} ${bot} ${L} ${bot - 18}Z`;
  R8.svg(g, S12.paper(back) + S12.shade(back, .1) + S12.paper(`M${L} ${top}L${mid - 18} 66Q${mid} 54 ${mid + 18} 66L${R} ${top}Z`) +
    `<path style="fill:var(--tr);stroke:none" d="M${L + 46} ${top - 6}L${mid} 88L${R - 46} ${top - 6}Z"/>`);
  /* the card: what is still in the pocket is cut away (the pocket is see-through in some styles) */
  const cg = R6.group(g); cg.style.clipPath = `polygon(-100px -100px,700px -100px,700px ${top}px,${R}px ${top}px,${mid}px ${vy}px,${L}px ${top}px,-100px ${top}px)`;
  const c = R9.acc(cg, 170, 8, 260, 300, 22);
  const fr = div('left:12px;top:12px;right:12px;bottom:12px;border:2.5px solid currentColor;border-radius:14px;opacity:.35', c.p); fr.className = 'u-bubble-text';
  const d = S12.disc(c.p, 130, 68, 42, 'main'); S12.inkIco(d.p, who.icon, 42, 42, 46);
  if (w) S12.accWord(K, c.p, w, 130, 118, 40, 216);
  if (tags.length) { S12.rule(c.p, 104, 174, 52, .4, 'u-bubble-text'); S12.accWord(K, c.p, tags.join(' · '), 130, 184, 26, 200); }
  /* the pocket in front: its top cut in a V, the folds of its side flaps */
  const pk = `M${L} ${top}L${mid} ${vy}L${R} ${top}V${bot - 18}Q${R} ${bot} ${R - 18} ${bot}H${L + 18}Q${L} ${bot} ${L} ${bot - 18}Z`;
  R8.svg(g, S12.paper(pk) + S12.det(`M${L + 12} ${bot - 10}L${mid} ${vy + 36}L${R - 12} ${bot - 10}`, .22, .45));
});

/* 2 · a search with a filter: the words typed in (the cursor after them), the filter chip lit, the one result that fits
   ringed and ticked, the others dimmed out under it */
R3.both('B10', 'filter', 'ช่องค้นหากับตัวกรอง เหลือผลลัพธ์ที่ใช่', (K, s, T, g) => {
  const who = s.who ?? {icon: 'user'}, w = s.label ?? who.label ?? '', tags = (s.tags ?? []).slice(0, 2);
  const c = R9.card(g, 60, 4, 480, 332, 30);
  const bar = R7.plain(c.p, 20, 18, 364, 60, 'soft', '30px'); R9.ico(bar.p, 'search', 34, 30, 30, 'u-inherit');
  const typed = R6.wordL(K, bar.p, w, 64, 10, 30, null, 250);
  const caret = div('left:70px;top:14px;width:4px;height:32px;border-radius:2px;background:var(--ink)', bar.p);
  FITS.push(() => { caret.style.left = 64 + typed.firstChild.offsetWidth + 6 + 'px'; });
  const fb = S12.disc(c.p, 422, 48, 30, 'acc'); R9.ico(fb.p, 'sliders-horizontal', 30, 30, 30, 'u-bubble-text');
  const chips = tags.length ? tags : [w];
  chips.forEach((t, k) => { const ch = R9.acc(c.p, 20 + k * 200, 94, 186, 46, 23); R9.ico(ch.p, 'check', 26, 23, 24, 'u-bubble-text');
    const l = R6.wordL(K, ch.p, t, 46, 6, 24, null, 128); l.classList.add('u-bubble-text'); });
  const r = R9.card(c.p, 20, 158, 440, 84, 22); r.p.style.boxShadow = '0 0 0 4px var(--ac-stroke, var(--ac))';
  const d = S12.disc(r.p, 46, 42, 28, 'acc'); R9.ico(d.p, who.icon, 28, 28, 32, 'u-bubble-text');
  R6.wordL(K, r.p, w, 88, tags.length ? 6 : 20, 30, null, 280);
  if (tags.length) { const t2 = R6.wordL(K, r.p, tags.join(' · '), 88, 46, 20, null, 280); t2.style.opacity = .6; }
  R9.ico(r.p, 'circle-check', 406, 42, 34);
  const gh = R9.card(c.p, 20, 258, 440, 60, 20); gh.o.style.opacity = .35;
  S12.disc(gh.p, 40, 30, 19, 'soft'); S12.bar(gh.p, 72, 17, 150, 11, null, 6); S12.bar(gh.p, 72, 35, 96, 9, null, 5);
});

/* ================= B13 เคล็ดลับ: secret {icon, label?} ================= */
/* 3 · a magnifying glass over a printed page: inside the lens the tip shows clearly (a glint on the glass, a collar where
   the handle meets the rim) */
R3.both('B13', 'magnify', 'แว่นขยายส่องกระดาษ เจอเคล็ดลับในเลนส์', (K, s, T, g) => {
  const it = s.secret ?? {icon: 'lightbulb'}, X = 278, Y = 150, R = 100;
  const pg = R9.card(g, 74, 10, 352, 322, 22);
  const h = S12.bar(pg.p, 30, 26, 168, 18, null, 9); h.style.background = 'var(--ink)'; h.style.opacity = .22;
  [[64, 290], [88, 260], [112, 290], [136, 150], [176, 290], [200, 270], [224, 290], [248, 230], [272, 290], [296, 120]]
    .forEach(([y, w]) => S12.bar(pg.p, 30, y, w, 10, null, 5));
  const a = Math.PI / 4, P = r => `${(X + r * Math.cos(a)).toFixed(1)} ${(Y + r * Math.sin(a)).toFixed(1)}`;
  R8.svg(g, `<path style="fill:none;stroke:var(--sd);stroke-width:38px;stroke-linecap:round" d="M${P(146)}L${P(236)}"/>` +
    `<path style="fill:none;stroke:var(--ac-stroke, var(--ac));stroke-width:50px" d="M${P(104)}L${P(150)}"/>`);
  const l = S12.disc(g, X, Y, R); l.p.style.boxShadow = '0 0 0 14px var(--ac-stroke, var(--ac))';
  R8.svg(l.p, `<path style="fill:none;stroke:var(--tr);stroke-width:10px;stroke-linecap:round" d="M${R - 70} ${R - 34}A76 76 0 0 1 ${R - 34} ${R - 70}"/>`);
  S12.iconWord(K, l.p, it, 2 * R, it.label ? 42 : 64, 64, 34);
});

/* 4 · a key turned in a padlock: the shackle has sprung open, and the tip comes up out of it */
R3.both('B13', 'unlock', 'ลูกกุญแจไขแม่กุญแจ แม่กุญแจเด้งเปิด เคล็ดลับลอยออกมา', (K, s, T, g) => {
  const it = s.secret ?? {icon: 'lightbulb'}, bx = 100, by = 150, bw = 236, bh = 178, cx = bx + bw / 2, ky = by + 80;
  R8.svg(g, `<path style="fill:none;stroke:var(--sd);stroke-width:30px;stroke-linecap:round" d="M${cx - 64} ${by + 10}V${by - 50}Q${cx - 64} ${by - 116} ${cx} ${by - 116}Q${cx + 64} ${by - 116} ${cx + 64} ${by - 56}V${by - 34}"/>` +
    S12.inkL(`M${cx + 90} ${by - 40}L${cx + 112} ${by - 50}M${cx + 92} ${by - 18}L${cx + 116} ${by - 16}M${cx + 84} ${by - 62}L${cx + 100} ${by - 80}`, .35));
  const b = R7.plain(g, bx, by, bw, bh, 'main', '30px');
  [20, bh - 24].forEach(y => S12.rule(b.p, 18, y, bw - 36, .18, 'u-inherit', 4));
  const kh = R9.card(b.p, bw / 2 - 22, 58, 44, 78, 0); kh.p.style.boxShadow = 'none';             // the keyhole: one cut-out shape
  kh.p.style.clipPath = "path('M22 0A22 22 0 0 1 30.5 42.3L32 72Q32 78 26 78H18Q12 78 12 72L13.5 42.3A22 22 0 0 1 22 0Z')";
  const key = `M${cx + 4} ${ky}H${cx + 148}M${cx + 72} ${ky}V${ky + 24}M${cx + 100} ${ky}V${ky + 18}`, ring = `M${cx + 206} ${ky}m-32 0a32 32 0 1 0 64 0a32 32 0 1 0 -64 0`;
  R8.svg(g, `<path style="fill:none;stroke:var(--ac-line, var(--ink));stroke-width:26px;stroke-linecap:round" d="${key}${ring}"/>` +
    `<path style="fill:none;stroke:var(--ac-stroke, var(--ac));stroke-width:16px;stroke-linecap:round" d="${key}${ring}"/>`);
  const c = R9.acc(g, 372, 8, 178, 124, 24); S12.iconWord(K, c.p, it, 178, it.label ? 14 : 32, 48, 30, true);
});

/* ================= B20 ความสัมพันธ์: a {icon, label?}, b {icon, label?}, label?, cut? ================= */
/* 5 · two cards with "×" between them, the way a collab is announced (when it is over the × breaks red and they part) */
R3.both('B20', 'cross', 'การ์ดคู่ A × B (จบกัน = การ์ดแยก × สีแดง)', (K, s, T, g) => {
  const a = s.a ?? {icon: 'user'}, b = s.b ?? {icon: 'user'}, cut = !!s.cut;
  [[a, 44, -1], [b, 344, 1]].forEach(([it, x, side]) => {
    const c = R9.card(g, x, 18, 206, 214, 30); if (cut) { c.p.style.transform = `translateX(${side * 14}px) rotate(${side * 6}deg)`; c.o.style.opacity = .8; }
    S12.iconWord(K, c.p, it, 206, it.label ? 34 : 62, 92, 40);
  });
  const x = S12.disc(g, 297, 125, 50, cut ? 'neg' : 'acc'); S12.glyph(x.p, '×', 50, 50, 78, cut ? 'u-inherit' : 'u-bubble-text');
  if (s.label) R4.word(K, g, s.label, 297, 258, 44, null, 360);
});

/* 6 · two glasses clink: each carries one side's icon in its drink, drops jump up where the rims touch (over: apart) */
R3.both('B20', 'cheers', 'แก้วสองใบชนกัน ฟองกระเด็น (จบกัน = แก้วห่างกัน)', (K, s, T, g) => {
  const a = s.a ?? {icon: 'user'}, b = s.b ?? {icon: 'user'}, cut = !!s.cut, y0 = 52, y1 = 262, tw = 78, bw = 60;
  const glass = (it, cx, rot) => {
    const h = R6.group(g); h.style.transformOrigin = `${cx}px ${y1}px`; h.style.transform = `rotate(${rot}deg)`;
    const xl = y => cx - tw + (y - y0) * (tw - bw) / (y1 - y0), xr = y => 2 * cx - xl(y), wy = y0 + 50, i = 9;
    const body = `M${cx - tw} ${y0}H${cx + tw}L${cx + bw + 2} ${y1 - 18}Q${cx + bw} ${y1} ${cx + bw - 18} ${y1}H${cx - bw + 18}Q${cx - bw} ${y1} ${cx - bw - 2} ${y1 - 18}Z`;
    const drink = `M${(xl(wy) + i).toFixed(1)} ${wy}Q${cx - 34} ${wy - 13} ${cx} ${wy}T${(xr(wy) - i).toFixed(1)} ${wy}L${cx + bw - 6} ${y1 - 24}Q${cx + bw - 8} ${y1 - i} ${cx + bw - 26} ${y1 - i}H${cx - bw + 26}Q${cx - bw + 8} ${y1 - i} ${cx - bw + 6} ${y1 - 24}Z`;
    const bub = [[-34, 66, 6], [26, 44, 5], [8, 90, 7], [-14, 28, 4]].map(([dx, dy, r]) => `<circle style="fill:var(--fl);opacity:.7" cx="${cx + dx}" cy="${y1 - dy}" r="${r}"/>`).join('');
    R8.svg(h, `<path class="fl" style="stroke:none" d="${body}"/>` + S12.accP(drink, 0) + bub + `<path class="u-fl-edge" d="${body}"/>` +
      `<path style="fill:none;stroke:#FFFFFF;stroke-width:7px;stroke-linecap:round;opacity:.45" d="M${(xl(wy + 24) + 20).toFixed(1)} ${wy + 24}L${(xl(y1 - 56) + 18).toFixed(1)} ${y1 - 56}"/>`);
    R9.ico(h, it.icon, cx, wy + 66, 50, 'u-bubble-text');
    if (it.label) S12.accWord(K, h, it.label, cx, wy + 98, 28, 104);
  };
  glass(a, cut ? 170 : 180, cut ? -4 : 12); glass(b, cut ? 430 : 420, cut ? 4 : -12);
  const cy = y1 - 189;                                                           // where the rims touch (300, cy)
  if (!cut) R8.svg(g, [[266, cy - 34, 9], [334, cy - 34, 9], [300, cy - 54, 7]].map(([x, y, r]) => S12.accP(S12.drop(x, y, r), .4)).join(''));
  else { const x = S12.disc(g, 300, 150, 30, 'neg'); S12.glyph(x.p, '×', 30, 30, 44, 'u-inherit'); }
  if (s.label) R4.word(K, g, s.label, 300, 290, 34, null, 300);
});

/* ================= B21 สถานที่: place {icon, label?}, spots? [1-2 {icon, label?}] ================= */
/* 7 · a postcard: the place's picture on the left, its name and the spots written on the address lines on the right,
   a perforated stamp and the postmark beside it */
R3.both('B21', 'postcard', 'โปสการ์ด แสตมป์แปะ ตราไปรษณีย์ประทับชื่อสถานที่', (K, s, T, g) => {
  const pl = s.place ?? {icon: 'map-pin'}, sp = (s.spots ?? []).slice(0, 2);
  const c = R9.card(g, 36, 26, 494, 288, 20); c.p.style.transform = 'rotate(-3deg)';
  const pic = R9.acc(c.p, 16, 16, 226, 256, 12);
  const pf = div('left:10px;top:10px;right:10px;bottom:10px;border:2.5px solid currentColor;border-radius:6px;opacity:.3', pic.p); pf.className = 'u-bubble-text';
  R9.ico(pic.p, pl.icon, 113, 128, 104, 'u-bubble-text');
  S12.bar(c.p, 259, 22, 3, 244, null, 2);
  const st = R7.plain(c.p, 398, 16, 78, 94, 'main', '0'); st.p.style.clipPath = S12.zig(78, 94, 9, 5); st.p.style.boxShadow = 'none';
  const sf = div('left:10px;top:10px;right:10px;bottom:10px;border:2px solid currentColor;opacity:.4', st.p);
  S12.inkIco(st.p, pl.icon, 39, 47, 36);
  R8.svg(c.p, `<g style="fill:none;stroke:var(--ink);stroke-width:calc(var(--lw) * .2);opacity:.5"><circle cx="352" cy="62" r="32"/><circle cx="352" cy="62" r="24"/>` +
    `<path d="M314 52q-9 -7 -18 0t-18 0M314 72q-9 -7 -18 0t-18 0"/></g>`);
  if (pl.label) R6.wordL(K, c.p, pl.label, 280, 116, 38, null, 196);
  sp.forEach((p, k) => { const y = 176 + k * 48; R9.ico(c.p, p.icon, 292, y + 18, 24); if (p.label) R6.wordL(K, c.p, p.label, 314, y + 2, 24, null, 160); });
  (sp.length ? sp.map((_, k) => 176 + k * 48 + 40) : [180, 222, 264]).forEach(y => S12.bar(c.p, 280, y, 196, 3, null, 2));
});

/* 8 · a check-in in an app: a little map (its roads inside it) with the pin dropped, the place's name, the button pressed */
R3.both('B21', 'checkin', 'การ์ดเช็กอินในแอป กดปุ่มแล้วหมุดเด้ง ชื่อสถานที่ขึ้น', (K, s, T, g) => {
  const pl = s.place ?? {icon: 'map-pin'}, sp = (s.spots ?? []).slice(0, 2);
  const c = R9.card(g, 110, 4, 380, 332, 30);
  const m = R7.plain(c.p, 16, 16, 348, 142, 'soft', '20px'); m.p.style.overflow = 'hidden';
  const px = 174, py = 58;                                                        // the pin's head on the map
  R8.svg(m.p, `<rect x="236" y="84" width="92" height="48" rx="10" style="fill:var(--ac);opacity:.35"/><rect x="18" y="14" width="70" height="40" rx="8" style="fill:var(--tr)"/>` +
    `<path style="fill:none;stroke:var(--tr);stroke-width:16px" d="M-10 100Q90 66 170 96T360 74M112 -10Q132 70 104 160M252 -10V160"/>` +
    `<ellipse cx="${px}" cy="${py + 64}" rx="34" ry="10" style="fill:none;stroke:var(--ac-stroke, var(--ac));stroke-width:3px;opacity:.6"/>` +
    `<ellipse cx="${px}" cy="${py + 64}" rx="16" ry="5" style="fill:#000;opacity:.18"/>` +
    S12.accP(`M${px} ${py + 62}C${px - 12} ${py + 44} ${px - 34} ${py + 28} ${px - 34} ${py}A34 34 0 1 1 ${px + 34} ${py}C${px + 34} ${py + 28} ${px + 12} ${py + 44} ${px} ${py + 62}Z`, .5));
  const ink = S12.accInk(m.p, px - 34, py - 34, 68, 68); R9.ico(ink.p, pl.icon, 34, 34, 34, 'u-bubble-text');
  R9.ico(c.p, pl.icon, 36, 192, 30); if (pl.label) R6.wordL(K, c.p, pl.label, 62, 170, 36, null, 270);
  sp.forEach((p, k) => { const ch = R7.plain(c.p, 16 + k * 178, 220, 166, 40, 'soft', '20px'); S12.inkIco(ch.p, p.icon, 24, 20, 22); if (p.label) R6.wordL(K, ch.p, p.label, 44, 6, 21, null, 112); });
  const bt = R9.acc(c.p, 16, 272, 348, 46, 23); R9.ico(bt.p, 'map-pin', 152, 23, 26, 'u-bubble-text'); R9.ico(bt.p, 'check', 196, 23, 26, 'u-bubble-text');
});

/* ================= B12 เหตุกับผล: items [3 {icon, label?, tone?}], end? ================= */
/* 9 · three cards joined by arrows: the light has run along each arrow and the last card (the effect) stands lit, bigger,
   in a glow */
R3.both('B12', 'arrows', 'สามการ์ดต่อด้วยลูกศร แสงวิ่งไปตามลูกศร การ์ดผลลัพธ์พลิก', (K, s, T, g) => {
  const it = (s.items ?? []).slice(0, 3), neg = it[2]?.tone === 'neg', W = 124, H = 168, Y = 86, xs = [20, 204], LX = 388, LW = 156, LH = 204, LY = 68, mid = Y + H / 2;
  const halo = div(`left:${LX - 70}px;top:${LY - 60}px;width:${LW + 140}px;height:${LH + 120}px;border-radius:50%`, g); halo.className = 'u-halo';
  div(`left:${LX - 12}px;top:${LY - 12}px;width:${LW + 24}px;height:${LH + 24}px;border-radius:36px;border:3px solid ${neg ? 'var(--neg)' : 'var(--ac-stroke, var(--ac))'};opacity:.5`, g);
  it.forEach((p, k) => {
    if (k < 2) { const c = R9.card(g, xs[k], Y, W, H, 24); S12.iconWord(K, c.p, p, W, 34, 52, 26); return; }
    S12.effect(K, g, LX, LY, LW, LH, 28, p, neg, 74, 62, 118, 30);
  });
  R8.svg(g, [[xs[0] + W + 12, xs[1] - 12], [xs[1] + W + 12, LX - 14]].map(([x1, x2]) =>
    S12.inkL(`M${x1} ${mid}H${x2}M${x2 - 14} ${mid - 14}L${x2} ${mid}L${x2 - 14} ${mid + 14}`, .6)).join(''));
});

/* 10 · drops fall into a tall glass one by one (the causes) until it brims over: the water domes over the rim and spills
   down the outside (all the way into the puddle on one side, a drip on the other), and the effect lights up beside it */
R3.both('B12', 'overflow', 'หยดน้ำลงแก้วจนล้น ผลลัพธ์ขึ้นข้างแก้ว', (K, s, T, g) => {
  const it = (s.items ?? []).slice(0, 3), neg = it[2]?.tone === 'neg', X = 196, top = 118, bot = 306, tw = 74, bw = 58, i = 8, f = v => v.toFixed(1);
  const xw = y => X - tw + (y - top) * (tw - bw) / (bot - top);
  const glass = `M${X - tw} ${top}H${X + tw}L${X + bw + 2} ${bot - 16}Q${X + bw} ${bot} ${X + bw - 16} ${bot}H${X - bw + 16}Q${X - bw} ${bot} ${X - bw - 2} ${bot - 16}Z`;
  const water = `M${X - tw + i} ${top + 2}Q${X} ${top - 30} ${X + tw - i} ${top + 2}L${X + bw - 5} ${bot - 20}Q${X + bw - 7} ${bot - i} ${X + bw - 22} ${bot - i}H${X - bw + 22}Q${X - bw + 7} ${bot - i} ${X - bw + 5} ${bot - 20}Z`;
  const spill = (sd, ys) => { const o = x => X + sd * (x - X);                       // over the rim, then down the outside of one wall
    const out = ys.map(([y, e]) => [o(xw(y) - e), y]), back = ys.slice().reverse().map(([y]) => [o(xw(y) + 1), y]);
    return `M${f(o(X - tw + 14))} ${top - 3}Q${f(o(X - tw - 4))} ${top - 14} ${f(out[0][0])} ${out[0][1]}` + S12.smooth(out) + back.map(p => `L${f(p[0])} ${p[1]}`).join('') + 'Z'; };
  const left = spill(1, [[top + 8, 12], [top + 50, 8], [top + 96, 10], [top + 128, 14], [top + 160, 9], [bot - 4, 14], [bot + 6, 26]]);
  const right = spill(-1, [[top + 8, 11], [top + 44, 8], [top + 80, 10], [top + 100, 5]]);
  R8.svg(g, S12.accP(`M${X - tw - 64} ${bot + 6}Q${X} ${bot - 14} ${X + tw + 64} ${bot + 6}Q${X} ${bot + 26} ${X - tw - 64} ${bot + 6}Z`, .4) +
    `<path class="fl" style="stroke:none" d="${glass}"/>` + S12.accP(water, 0) + `<path class="u-fl-edge" d="${glass}"/>` +
    `<path style="fill:none;stroke:#FFFFFF;stroke-width:7px;stroke-linecap:round;opacity:.45" d="M${f(xw(top + 34) + 20)} ${top + 34}L${f(xw(bot - 50) + 18)} ${bot - 50}"/>` +
    S12.accP(left, .4) + S12.accP(right, .4) + S12.accP(S12.drop(2 * X - xw(top + 128) + 5, top + 128, 7), .4));
  [[0, X - 8, 38, 'L'], [1, X + 46, 74, 'R']].forEach(([k, x, y, side]) => {
    R8.svg(g, S12.accP(S12.drop(x, y, 24), .5));
    const ink = S12.accInk(g, x - 24, y - 24, 48, 48); if (it[k]) R9.ico(ink.p, it[k].icon, 24, 24, 24, 'u-bubble-text');
    if (it[k]?.label) { if (side === 'L') S12.wordR(K, g, it[k].label, x - 34, y - 18, 28, 140); else R6.wordL(K, g, it[k].label, x + 34, y - 18, 28, null, 120); }
  });
  if (it[2]) S12.effect(K, g, 404, 122, 146, 136, 24, it[2], neg, 48, 52, 84, 26);
  R8.svg(g, `<path class="ln u-thin u-dash" d="M${X + tw + 72} ${bot + 4}Q${X + tw + 112} ${bot - 4} 416 266"/>`);
});

/* ================= B05 ถูกกับผิด: wrong {icon, label?}, right {icon, label?} ================= */
/* 11 · a quiz in an app: the progress bar and the question on top, the wrong answer tapped (red edge, ✗), the right one
   lit with ✓ under the pointer */
R3.both('B05', 'quiz', 'ควิซในแอป ตอบผิดขึ้นแดง ตอบถูกขึ้นเขียว ✓', (K, s, T, g) => {
  const w = s.wrong ?? {icon: 'x'}, r = s.right ?? {icon: 'check'};
  const c = R9.card(g, 90, 4, 420, 332, 30);
  S12.bar(c.p, 30, 24, 360, 12, null, 6); R9.acc(c.p, 30, 24, 236, 12, 6).p.style.boxShadow = 'none';
  const q = S12.disc(c.p, 210, 76, 28, 'acc'); S12.glyph(q.p, '?', 28, 28, 40, 'u-bubble-text');
  const a = R9.card(c.p, 24, 120, 372, 86, 22); a.p.style.boxShadow = '0 0 0 4px var(--neg)';
  R9.ico(a.p, w.icon, 46, 43, 38); if (w.label) R6.wordL(K, a.p, w.label, 80, 23, 32, null, 210);
  const x = S12.disc(a.p, 332, 43, 24, 'neg'); R9.ico(x.p, 'x', 24, 24, 28, 'u-inherit');
  const b = R9.acc(c.p, 24, 222, 372, 86, 22);
  R9.ico(b.p, r.icon, 46, 43, 38, 'u-bubble-text'); if (r.label) { const l = R6.wordL(K, b.p, r.label, 80, 23, 32, null, 210); l.classList.add('u-bubble-text'); }
  R9.ico(b.p, 'circle-check', 332, 43, 44, 'u-bubble-text');
  div('left:226px;top:262px;width:58px;height:58px', c.p, `<svg width="58" height="58" viewBox="0 0 24 24" style="overflow:visible"><path d="M4 2l15 9-7 1.5L9 20z" stroke-width="1.3" stroke-linejoin="round"/></svg>`).className = 'u-cursor';
});

/* 12 · two answer sheets marked in pen: a big ✗ on the wrong one, a big ✓ on the right one, over the handwriting (the
   word on top stays clear), a margin line down each sheet */
R3.both('B05', 'grade', 'ครูตรวจกระดาษสองแผ่น ✗ บนแผ่นผิด ✓ บนแผ่นถูก', (K, s, T, g) => {
  const w = s.wrong ?? {icon: 'x'}, r = s.right ?? {icon: 'check'};
  const hand = (y, len) => { let d = `M56 ${y}`; for (let x = 56; x < 56 + len; x += 22) d += `q5.5 -7 11 0t11 0`; return d; };
  [[w, 46, -3], [r, 324, 3]].forEach(([it, x, rot], k) => {
    const c = R9.card(g, x, 16, 230, 304, 14); c.p.style.transform = `rotate(${rot}deg)`;
    div('left:38px;top:0;width:3px;height:304px;background:var(--neg);opacity:.4', c.p);
    S12.iconWord(K, c.p, it, 230, 18, 50, 32);
    R8.svg(c.p, `<path style="fill:none;stroke:var(--ink);stroke-width:3px;stroke-linecap:round;opacity:.3" d="${[[140, 150], [174, 154], [208, 132], [242, 154], [276, 88]].map(([y, l]) => hand(y, l)).join('')}"/>` +
      (k === 0 ? `<path class="u-cross" style="stroke-width:16px" d="M62 136L182 280M182 136L62 280"/>`
               : `<path style="fill:none;stroke:var(--ac-line, var(--ink));stroke-width:28px;stroke-linecap:round;stroke-linejoin:round" d="M58 214L100 262L188 136"/><path class="u-acc-line" style="stroke-width:18px;stroke-linejoin:round" d="M58 214L100 262L188 136"/>`));
  });
});

/* ================= B11 คำพูด: quote, kind, mood, react? ================= */
/* 13 · a chat: who is on the other end (online), the "typing…" dots, then the message itself (what was said) with a
   reaction on its corner */
R3.both('B11', 'typing', 'แชตกำลังพิมพ์ จุดสามจุดเด้ง แล้วข้อความขึ้น', (K, s, T, g) => {
  const q = s.quote ?? '', bad = s.mood === 'bad';
  const c = R9.card(g, 90, 4, 420, 332, 30);
  const av = S12.disc(c.p, 52, 48, 26, 'main'); S12.inkIco(av.p, 'user', 26, 26, 30);
  S12.disc(c.p, 72, 68, 9, 'acc').p.style.boxShadow = 'none';
  [['phone', 318], ['video', 366]].forEach(([ic, x]) => { R9.ico(c.p, ic, x, 48, 30).style.opacity = .55; });
  S12.bar(c.p, 0, 94, 420, 3, null, 1);
  const d = R7.plain(c.p, 28, 116, 124, 54, 'soft', '27px 27px 27px 6px'); [34, 62, 90].forEach(x => S12.disc(d.p, x, 27, 9, 'main').p.style.boxShadow = 'none');
  const m = R9.acc(c.p, 28, 186, 352, 110, '30px 30px 30px 8px');
  if (q) S12.accWord(K, m.p, q, 176, 28, 46, 310);
  if (s.react) { const r = S12.disc(c.p, 376, 292, 24, bad ? 'neg' : 'card'); if (bad) S12.inkIco(r.p, s.react, 24, 24, 26); else R9.ico(r.p, s.react, 24, 24, 26); }
});

/* 14 · an incoming call: the phone is answered, the voice runs as a sound wave and what was said as a subtitle */
R3.both('B11', 'call', 'สายเรียกเข้า กดรับสาย คำพูดขึ้นเป็นซับบนจอ', (K, s, T, g) => {
  const q = s.quote ?? '', bad = s.mood === 'bad';
  const ph = R7.plain(g, 180, 0, 240, 340, 'main', '42px'); const sc = R9.card(ph.p, 12, 12, 216, 316, 32);
  R7.plain(sc.p, 80, 10, 56, 14, 'main', '7px').p.style.boxShadow = 'none';
  [[52, .45], [62, .2]].forEach(([r, op]) => div(`left:${108 - r}px;top:${86 - r}px;width:${2 * r}px;height:${2 * r}px;border-radius:50%;border:3px solid var(--ac-stroke, var(--ac));opacity:${op}`, sc.p));
  const av = S12.disc(sc.p, 108, 86, 38, 'acc'); R9.ico(av.p, 'user', 38, 38, 42, 'u-bubble-text');
  [10, 22, 34, 18, 30, 14, 8].forEach((h, k) => { div(`left:${66 + k * 13}px;top:${158 - h / 2}px;width:7px;height:${h}px;border-radius:4px;background:var(--text);opacity:.6`, sc.p); });
  const sub = R7.plain(sc.p, 14, 184, 188, 70, 'soft', '18px');
  if (q) { const w = R4.word(K, sub.p, q, 94, 14, 32, null, 170); w.classList.add('u-inherit'); }
  const on = S12.disc(sc.p, 66, 282, 24, 'acc'); R9.ico(on.p, 'phone', 24, 24, 24, 'u-bubble-text');
  const off = S12.disc(sc.p, 150, 282, 24, 'neg'); S12.inkIco(off.p, 'phone-off', 24, 24, 24);
  if (s.react) { const r = S12.disc(g, 456, 72, 30, bad ? 'neg' : 'acc'); R9.ico(r.p, s.react, 30, 30, 32, bad ? 'u-inherit' : 'u-bubble-text'); }
});

/* ================= B01 ตัวเลขเด่น: value, unit?, icon?, dir?, money? ================= */
/* 15 · a price tag hanging on its string (threaded through the tag's eyelet), at rest after its swing: the amount on it,
   a stitched edge round it (money only) */
R3.both('B01', 'tag', 'ป้ายราคาแขวน แกว่งแล้วหยุด ตัวเลขนับขึ้น', (K, s, T, g) => {
  const hx = 300, hy = 94;                                                        // the eyelet: the tag turns round it
  const t = R6.group(g); t.style.transformOrigin = `${hx}px ${hy}px`; t.style.transform = 'rotate(-6deg)';
  const tag = 'M300 40L428 98Q440 104 440 117V306Q440 328 418 328H182Q160 328 160 306V117Q160 104 172 98Z';
  const c = R9.acc(t, 160, 40, 280, 288, 0); c.p.style.display = 'block';           // the style's own accent surface, cut to the tag
  c.p.style.clipPath = "path('M140 0L268 58Q280 64 280 77V266Q280 288 258 288H22Q0 288 0 266V77Q0 64 12 58Z')";
  R8.svg(c.p, `<path style="fill:none;stroke:currentColor;stroke-width:2.5px;stroke-dasharray:9 8;opacity:.4" d="M140 20L260 74V260Q260 270 250 270H30Q20 270 20 260V74Z"/>`);
  if (s.icon) R9.ico(c.p, s.icon, 140, 106, 40, 'u-bubble-text');
  const n = S12.num(c.p, s.value, 140, 132, 96, 236); n.firstChild.classList.add('u-bubble-text');
  if (s.unit) S12.accWord(K, c.p, s.unit, 140, 228, 34, 220);
  R8.svg(t, `<path style="fill:none;stroke:var(--ac-line, var(--ink));stroke-width:calc(var(--lw-ac, 0) * .6);stroke-linejoin:round" d="${tag}"/>`);
  S12.disc(t, hx, hy, 15, 'card');
  R8.svg(g, S12.inkL(`M${hx} -24Q${hx - 8} 30 ${hx} ${hy}`, .3));
}, R2.money);

/* 16 · a piggy bank, the pig of Friend's ref shape for shape ("20 WAYS TO SIMPLIFY" #8 FINANCE, Friend 2026-11-11: "วาดหมูตามนี้",
   then "ไม่เหมือน อยากได้แบบเหมือน 100% แต่ไม่เอาเงานะ"). The outline is traced off the ref picture itself (its bright outline
   filled and cut away from the tail, then followed as a contour, in the ref's own pixels: the pig spans x 33–216, y 41–215),
   the eye, the line on its back, the looped tail and the coin with its inner ring sit where they are in the ref. One outline
   round the whole pig, one flat body colour: no shading on the belly or in the ear, no glow. No line under the ear
   (Friend 2026-11-12: "ลบเส้นใต้หูของหมูออกด้วย"). The amount counts up beside it (money only) */
R3.both('B01', 'piggy', 'กระปุกออมสิน เหรียญหยอดทีละเหรียญ ยอดนับขึ้น', (K, s, T, g) => {
  const k = 1.9, ox = 40 - 33 * k, oy = 6 - 41 * k, w = n => `stroke-width:${(n / k).toFixed(2)}px`;   // lines keep their width in the scaled group
  const pig = 'M62.6 84.9 L62.4 86.1 L62.5 88.0 L63.0 90.5 L63.9 93.6 L65.1 97.4 L65.3 100.9 L64.4 104.3 L62.5 107.5 L59.5 110.5 L56.8 113.8 L54.2 117.2 L52.0 121.0 L50.0 125.0 L48.1 128.0 L46.4 130.0 L44.8 131.0 L43.2 131.0 L41.7 131.2 L40.1 131.8 L38.4 132.5 L36.6 133.5 L35.2 134.4 L34.2 135.3 L33.6 136.1 L33.4 136.9 L33.2 138.8 L33.1 141.9 L33.0 146.2 L33.0 151.8 L33.1 156.2 L33.4 159.6 L33.8 161.9 L34.2 163.1 L34.9 164.2 L35.6 165.2 L36.5 166.1 L37.5 166.9 L38.9 167.6 L40.8 168.2 L43.1 168.8 L45.9 169.2 L48.4 170.2 L50.8 171.8 L53.0 173.8 L55.0 176.2 L57.4 178.8 L60.1 181.4 L63.2 184.1 L66.8 186.9 L69.7 190.2 L72.1 194.2 L73.9 198.9 L75.1 204.1 L76.3 208.2 L77.4 211.1 L78.5 212.8 L79.5 213.2 L81.4 213.6 L84.3 213.9 L88.1 214.0 L92.9 214.0 L96.7 213.8 L99.6 213.4 L101.5 212.9 L102.5 212.1 L103.5 210.9 L104.5 209.3 L105.5 207.2 L106.5 204.8 L107.6 202.9 L108.7 201.8 L109.9 201.4 L111.1 201.6 L113.8 201.8 L117.9 201.8 L123.5 201.6 L130.5 201.4 L135.9 201.8 L139.8 202.8 L142.1 204.4 L142.9 206.6 L143.8 208.6 L144.8 210.2 L145.9 211.5 L147.1 212.5 L149.2 213.2 L152.1 213.8 L155.8 214.0 L160.2 214.0 L163.9 213.9 L166.6 213.6 L168.5 213.2 L169.5 212.8 L170.6 211.5 L171.7 209.5 L172.9 206.8 L174.1 203.2 L175.2 199.9 L176.1 196.8 L176.8 193.9 L177.2 191.1 L178.1 188.4 L179.4 185.8 L181.0 183.2 L183.0 180.8 L184.9 178.1 L186.8 175.4 L188.6 172.5 L190.4 169.5 L191.9 166.6 L193.1 163.9 L194.1 161.2 L194.9 158.8 L195.4 156.0 L195.8 153.0 L196.0 149.8 L196.0 146.2 L196.2 143.5 L196.8 141.5 L197.5 140.2 L198.5 139.8 L199.2 139.2 L199.8 138.8 L200.0 138.2 L200.0 137.8 L199.7 137.3 L199.1 136.9 L198.1 136.6 L196.9 136.4 L195.8 135.6 L194.9 134.4 L194.2 132.6 L193.8 130.4 L192.9 127.8 L191.6 124.9 L190.0 121.8 L188.0 118.2 L185.6 114.8 L182.9 111.4 L179.8 108.1 L176.2 104.9 L172.9 102.1 L169.6 99.7 L166.5 97.8 L163.5 96.2 L160.4 94.9 L157.3 93.6 L154.1 92.5 L150.9 91.5 L147.7 90.7 L144.6 90.1 L141.5 89.6 L138.5 89.4 L136.2 89.1 L134.6 88.9 L133.6 88.6 L133.4 88.4 L132.0 88.2 L129.5 88.1 L125.9 88.0 L121.1 88.0 L116.4 88.2 L111.8 88.8 L107.2 89.5 L102.8 90.5 L99.1 91.0 L96.2 91.0 L94.1 90.5 L92.9 89.5 L91.0 88.4 L88.5 87.1 L85.4 85.8 L81.6 84.2 L78.2 83.1 L75.2 82.2 L72.6 81.6 L70.4 81.4 L68.4 81.3 L66.8 81.4 L65.5 81.8 L64.5 82.2 L63.7 82.9 L63.1 83.8Z';
  R8.svg(g, `<g transform="translate(${ox} ${oy}) scale(${k})">` +
    `<path style="fill:none;stroke:var(--ink);${w(6)};stroke-linecap:round;stroke-linejoin:round" d="M193 139Q199 135 201 131C195 127 196 118 204 118C211 118 211 128 205 130Q211 131 214 127L216 118"/>` +
    `<path class="fl" style="stroke:none" d="${pig}"/><path class="u-fl-edge" style="${w(6)};stroke-linejoin:round" d="${pig}"/>` +
    `<path style="fill:none;stroke:var(--fl-edge, var(--ink));${w(6)};stroke-linecap:round" d="M109 101Q129 95 150 101"/>` +
    `<circle style="fill:var(--fl-edge, var(--ink))" cx="68.3" cy="129.4" r="5"/></g>`);
  const cx = ox + 128.3 * k, cy = oy + 62 * k, r = 21.5 * k, c = S12.disc(g, cx, cy, r, 'acc');
  const ring = div(`left:${r - 32}px;top:${r - 32}px;width:64px;height:64px;border-radius:50%;border:2px solid currentColor;box-sizing:border-box`, c.p); ring.className = 'u-bubble-text';
  S12.glyph(c.p, '฿', r, r, 38, 'u-bubble-text');
  const b = R9.card(g, 400, 10, 150, 124, 24);
  S12.num(b.p, s.value, 75, 22, 56, 130); if (s.unit) R4.word(K, b.p, s.unit, 75, 82, 28, null, 130);
}, R2.money);

/* ================= B02 เพิ่ม / ลด: dir, item, center?, n?, keep?, end? ================= */
/* 17 · a battery: the bars fill up one by one (up), or drain until one red bar is left (down); each bar has its shine */
R3.both('B02', 'battery', 'แบตเตอรี่ ขีดเติมขึ้นทีละขีด หรือลดลงจนแดง', (K, s, T, g) => {
  const up = s.dir !== 'down', it = s.item ?? {icon: 'zap'};
  R9.card(g, 490, 146, 32, 78, '0 16px 16px 0');
  const b = R9.card(g, 70, 88, 420, 194, 38);
  [0, 1, 2, 3].forEach(k => {
    const on = up || k === 0, x = 22 + k * 98;
    if (!on) { S12.bar(b.p, x, 22, 82, 150, null, 16); return; }
    const c = up ? R9.acc(b.p, x, 22, 82, 150, 16) : R7.plain(b.p, x, 22, 82, 150, 'neg', '16px');
    div('left:12px;top:12px;width:12px;height:126px;border-radius:6px;background:#FFFFFF;opacity:.35', c.p);
    if (k === 3 || (!up && k === 0)) R9.ico(c.p, it.icon, 41, 75, 40, up ? 'u-bubble-text' : 'u-inherit');
  });
});

/* 18 · cardboard boxes, drawn with their front, side and (on the top one) top, a strip of tape over each: going up they are
   stacked square on one another (the top one lit); going down they were taken off, one is left and dashed outlines show the
   ones that went. Stacked square, so no box's hidden top shows through the one above it in the see-through styles */
R3.both('B02', 'stack', 'กล่องพัสดุซ้อนสูงขึ้น หรือถูกหยิบออกทีละกล่อง', (K, s, T, g) => {
  const up = s.dir !== 'down', it = s.item ?? {icon: 'package'}, W = 212, H = 62, dx = 32, dy = 20, floor = 324, x = 178;
  R7.plain(g, 132, floor, 336, 10, 'main', '5px');
  (up ? [0, 1, 2, 3] : [1, 2, 3, 0]).forEach(k => {                               // the box that is left is drawn over the outlines
    const y = floor - (k + 1) * H, on = up || k === 0, lit = up && k === 3, last = k === 3 || (!up && k === 0);
    const front = `M${x} ${y}H${x + W}V${y + H}H${x}Z`, topF = `M${x} ${y}L${x + dx} ${y - dy}H${x + W + dx}L${x + W} ${y}Z`, side = `M${x + W} ${y}L${x + W + dx} ${y - dy}V${y + H - dy}L${x + W} ${y + H}Z`;
    const faces = front + side + (k === 3 ? topF : '');
    if (!on) { R8.svg(g, `<path class="u-slot" style="fill:none" d="${faces}"/>`); return; }
    const tx = x + W / 2, tape = (k === 3 || last ? `M${tx - 14} ${y}L${tx - 14 + dx} ${y - dy}H${tx + 14 + dx}L${tx + 14} ${y}Z` : '') + `M${tx - 14} ${y}H${tx + 14}V${y + 24}H${tx - 14}Z`;
    const topNow = last ? faces.replace(/$/, k === 3 ? '' : topF) : faces;
    const edge = lit ? `style="fill:none;stroke:var(--ac-line, var(--ink));stroke-width:calc(var(--lw) * .45);stroke-linejoin:round"` : 'class="u-fl-edge"';
    R8.svg(g, (lit ? S12.accP(topNow, 0) : `<path class="fl" style="stroke:none" d="${topNow}"/>`) +
      S12.shade(side, .2) + S12.shade(front, .06) + `<path style="fill:var(--ink);opacity:.14;stroke:none" d="${tape}"/>` +
      `<path ${edge} d="${topNow}"/>`);
    if (lit) { const ink = S12.accInk(g, x, y, W, H); R9.ico(ink.p, it.icon, W / 2, H / 2 + 8, 30, 'u-bubble-text'); }
    else { const e = R9.ico(g, it.icon, tx, y + H / 2 + 8, 30, 'u-on-fl'); e.style.color = 'var(--fl-edge, var(--ink))'; }
  });
});

/* ================= B14 ประโยคเด็ด: idea {icon?, label} ================= */
/* 19 · a page of a book: a highlighter has just run along one line (its stroke ragged at the ends), and that line is the
   punchline; the pen rests with its chisel tip at the end of the stroke */
R3.both('B14', 'marker', 'ปากกาไฮไลต์ลากผ่านบรรทัด ประโยคติดสี', (K, s, T, g) => {
  const it = s.idea ?? {icon: 'quote'};
  const pg = R9.card(g, 40, 14, 424, 312, 18);
  const h = S12.bar(pg.p, 30, 26, 190, 16, null, 8); h.style.background = 'var(--ink)'; h.style.opacity = .22;
  [[64, 364], [88, 300], [204, 364], [228, 340], [252, 364], [276, 210]].forEach(([y, w]) => S12.bar(pg.p, 30, y, w, 10, null, 5));
  const hl = R9.acc(pg.p, 20, 116, 372, 70, 6); hl.p.style.clipPath = 'polygon(1% 10%, 30% 4%, 70% 7%, 99% 0, 100% 52%, 98.5% 100%, 60% 95%, 25% 98%, 0 92%, 1.5% 50%)'; hl.p.style.boxShadow = 'none';
  if (it.label) S12.accWord(K, hl.p, it.label, 186, 10, 40, 340); else R9.ico(hl.p, it.icon, 186, 35, 44, 'u-bubble-text');
  const tx = 40 + 20 + 372 + 4, ty = 14 + 116 + 52;                                // the tip at the stroke's end
  const pen = R6.group(g); pen.style.transformOrigin = `${tx}px ${ty}px`; pen.style.transform = 'rotate(34deg)';
  const tip = R9.acc(pen, tx - 12, ty - 26, 24, 28, '3px'); tip.p.style.clipPath = 'polygon(14% 0, 86% 0, 100% 62%, 0 100%)';
  R7.plain(pen, tx - 18, ty - 46, 36, 22, 'main', '6px');
  const body = R9.acc(pen, tx - 24, ty - 160, 48, 118, '12px');
  [30, 42].forEach(y => S12.rule(body.p, 10, y, 28, .35, 'u-bubble-text', 4));
  R7.plain(pen, tx - 26, ty - 196, 52, 42, 'main', '14px 14px 8px 8px');
});

/* 20 · a banner on its rod (hung from a hook) unrolls downward: the cloth folds over the rod, a stitched edge, and the
   punchline is on the cloth */
R3.both('B14', 'banner', 'ป้ายผ้าคลี่ลงมาจากราว ประโยคอยู่บนผ้า', (K, s, T, g) => {
  const it = s.idea ?? {icon: 'quote'};
  R8.svg(g, S12.inkL('M98 46L300 8L502 46', .2) + `<circle cx="300" cy="8" r="7" style="fill:var(--ink)"/>`);
  R7.plain(g, 84, 38, 432, 18, 'main', '9px'); S12.disc(g, 80, 47, 16, 'main'); S12.disc(g, 520, 47, 16, 'main');
  const c = R9.acc(g, 120, 48, 360, 282, 0); c.p.style.clipPath = 'polygon(0 0, 100% 0, 100% 100%, 50% 86%, 0 100%)';
  div('left:0;top:0;width:360px;height:20px;background:#000;opacity:.14', c.p);
  R8.svg(c.p, `<path class="u-bubble-text" style="fill:none;stroke:currentColor;stroke-width:2.5px;stroke-dasharray:9 8;opacity:.4" d="M16 34H344V258L180 226L16 258Z"/>`);
  if (it.icon) R9.ico(c.p, it.icon, 180, 92, 56, 'u-bubble-text');
  if (it.label) S12.accWord(K, c.p, it.label, 180, 136, 48, 300);
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
