/* =====================================================================
   CutPack · uni · LEGO round 11, new set (Friend 2026-11-11: "ผมชอบรอบที่ 1-10 มากกว่าอะ ไม่ต้องใช้ skill นี้วาดแล้ว
   กลับไปใช้ลายเส้นแบบเดิม และออกแบบใหม่ทั้งหมด (ไม่เอาคน)" · "ไม่รวม icon"). The rounds 1–10 look: rounded cards, the
   slot's icons, the accent, clear words; everyday things with a mechanism that ends on the result. No drawn people (icons,
   the person icon too, are fine). Two drafts for each of the round's ten categories (DECISIONS round 11).
   Stills redrawn 2026-11-12 (Friend: "ชอบไอเดียทั้งหมดแล้ว แต่ตอนนี้งานจังดูเป็นงานลวกๆ"): every thing drawn with the
   features that make it read, no grey placeholder bars standing in for words, parts that meet where they should (LESSONS 53).
   Motion (Friend 2026-11-12 "เริ่มได้" twice: the stills, then the sample clips of tag, stack and magnify): every draft is a
   mechanism in 3–4 steps that follow the words and end on the result at the key word (LESSONS 52).
     B10 คน          บัตรเชิญ (invite) · ช่องค้นหากับตัวกรอง (filter)
     B13 เคล็ดลับ      แว่นขยาย (magnify) · กุญแจไขแม่กุญแจ (unlock)
     B20 ความสัมพันธ์  การ์ดคู่ A × B (cross) · ชนแก้ว (cheers)
     B21 สถานที่      โปสการ์ด (postcard) · เช็กอิน (checkin)
     B12 เหตุกับผล     สามการ์ดต่อลูกศร (relay; 'arrows' is lego_v2's) · แก้วน้ำล้น (overflow)
     B05 ถูกกับผิด     ควิซในแอป (quiz) · ครูตรวจกระดาษ (grade)
     B11 คำพูด        แชตกำลังพิมพ์ (typing) · สายเรียกเข้า (call)
     B01 ตัวเลขเด่น    ป้ายราคา (tag) · กระปุกออมสิน (piggy) (money only)
     B02 เพิ่ม/ลด      แบตเตอรี่ (battery) · กล่องพัสดุซ้อน (stack)
     B14 ประโยคเด็ด    ปากกาไฮไลต์ (marker) · ป้ายผ้า (banner)
   The 22 drafts drawn after the glow-line-motion skill for this round were taken out (sketches/archive/r11_skill_scenes.js):
   never bring them back. Loaded after lego_r9c.js (R9 R10 helpers) and before lego_v2.js. Same frame rules as R3.both
   (600 × 340, nothing past x 550 below y 200, words only from the slots).
   ===================================================================== */
const R11 = {
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
  /* draw a line from t, hidden until then (an undrawn path with round caps shows as a dot, LESSONS 36) */
  draw(K, p, t, d) { R7.show(p, t); K.draw(p, t, d); },
  /* a thin line across a surface (u-bubble-text on an accent, u-label on a card) at low strength */
  rule(p, x, y, w, op = .3, cls = 'u-label', h = 3) { const e = div(`left:${x}px;top:${y}px;width:${w}px;height:${h}px;border-radius:${h}px;background:currentColor;opacity:${op}`, p); e.className = cls; return e; },
};

/* ================= B10 คน: who? {icon, label?}, label?, tags? [≤2] ================= */

/* 2 · a search with a filter: the words typed in (the cursor after them), the filter chip lit, the one result that fits
   ringed and ticked, the others dimmed out under it. Motion: the app comes up with two results · the words are typed in ·
   the filter is tapped and its chip pops in · the other result dims and, on the key word, the one that fits is ringed and ticked */
R3.both('B10', 'filter', 'ช่องค้นหากับตัวกรอง เหลือผลลัพธ์ที่ใช่', (K, s, T, g) => {
  const who = s.who ?? {icon: 'user'}, w = s.label ?? who.label ?? '', tags = (s.tags ?? []).slice(0, 2);
  const c = R9.card(g, 60, 4, 480, 332, 30); K.enter(c.o, T.b[0], 'rise');
  const bar = R7.plain(c.p, 20, 18, 364, 60, 'soft', '30px'); R9.ico(bar.p, 'search', 34, 30, 30, 'u-inherit');
  const typed = R6.wordL(K, bar.p, w, 64, 10, 30, null, 250); R7.write(typed, T.b[0] + .4, .55);
  const caret = div('left:70px;top:14px;width:4px;height:32px;border-radius:2px;background:var(--ink)', bar.p);
  FITS.push(() => { caret.style.left = 64 + typed.firstChild.offsetWidth + 6 + 'px'; });
  A(caret, [{transform: 'translateX(-200px)'}, {transform: 'none'}], T.b[0] + .4, .55, {e: 'linear'});
  A(caret, [{opacity: 1}, {opacity: 1, offset: .5}, {opacity: 0, offset: .51}, {opacity: 0}], T.b[0] + 1, .8, {f: 'none', it: 4});
  const fb = R11.disc(c.p, 422, 48, 30, 'acc'); R9.ico(fb.p, 'sliders-horizontal', 30, 30, 30, 'u-bubble-text'); K.punch(fb.p, T.b[2] - .1);
  const chips = tags.length ? tags : [w];
  chips.forEach((t, k) => { const ch = R9.acc(c.p, 20 + k * 200, 94, 186, 46, 23); R9.ico(ch.p, 'check', 26, 23, 24, 'u-bubble-text');
    const l = R6.wordL(K, ch.p, t, 46, 6, 24, null, 128); l.classList.add('u-bubble-text'); K.enter(ch.o, T.b[2] + k * .1, 'pop'); });
  const r = R9.card(c.p, 20, 158, 440, 84, 22); K.enter(r.o, T.b[0] + .2, 'rise');
  const ring = div('left:0;top:0;width:440px;height:84px;border-radius:22px;box-shadow:0 0 0 4px var(--ac-stroke, var(--ac))', r.p); R7.show(ring, T.hit);
  const d = R11.disc(r.p, 46, 42, 28, 'acc'); R9.ico(d.p, who.icon, 28, 28, 32, 'u-bubble-text');
  R6.wordL(K, r.p, w, 88, tags.length ? 6 : 20, 30, null, 280);
  if (tags.length) { const t2 = R6.wordL(K, r.p, tags.join(' · '), 88, 46, 20, null, 280); t2.style.opacity = .6; }
  const ok = R9.ico(r.p, 'circle-check', 406, 42, 34); K.enter(ok, T.hit + .05, 'pop'); K.punch(r.p, T.hit);
  const gh = R9.card(c.p, 20, 258, 440, 60, 20); K.enter(gh.o, T.b[0] + .3, 'rise'); A(gh.m, [{opacity: 1}, {opacity: .35}], T.b[2] + .25, .3, {f: 'forwards'});
  R11.disc(gh.p, 40, 30, 19, 'soft'); R11.bar(gh.p, 72, 17, 150, 11, null, 6); R11.bar(gh.p, 72, 35, 96, 9, null, 5);
});

/* ================= B13 เคล็ดลับ: secret {icon, label?} ================= */
/* 3 · a magnifying glass over a printed page: inside the lens the tip shows clearly (a glint on the glass, a collar where
   the handle meets the rim). Motion (Friend 2026-11-12 "เริ่มได้", a mechanism in steps): the page comes up · the lens comes in
   and searches over the page, this way and that · it darts to the spot and locks (a little overshoot) · on the key word the tip
   pops up inside it and a ring goes out from the rim */
R3.both('B13', 'magnify', 'แว่นขยายส่องกระดาษ เจอเคล็ดลับในเลนส์', (K, s, T, g) => {
  const it = s.secret ?? {icon: 'lightbulb'}, X = 278, Y = 150, R = 100;
  const pg = R9.card(g, 74, 10, 352, 322, 22); K.enter(pg.o, T.b[0], 'rise');
  const h = R11.bar(pg.p, 30, 26, 168, 18, null, 9); h.style.background = 'var(--ink)'; h.style.opacity = .22;
  [[64, 290], [88, 260], [112, 290], [136, 150], [176, 290], [200, 270], [224, 290], [248, 230], [272, 290], [296, 120]]
    .forEach(([y, w]) => R11.bar(pg.p, 30, y, w, 10, null, 5));
  const lg = R6.group(g);                                                           // the lens and its handle move as one
  const a = Math.PI / 4, P = r => `${(X + r * Math.cos(a)).toFixed(1)} ${(Y + r * Math.sin(a)).toFixed(1)}`;
  R8.svg(lg, `<path style="fill:none;stroke:var(--sd);stroke-width:38px;stroke-linecap:round" d="M${P(146)}L${P(236)}"/>` +
    `<path style="fill:none;stroke:var(--ac-stroke, var(--ac));stroke-width:50px" d="M${P(104)}L${P(150)}"/>`);
  const l = R11.disc(lg, X, Y, R); l.p.style.boxShadow = '0 0 0 14px var(--ac-stroke, var(--ac))';
  R8.svg(l.p, `<path style="fill:none;stroke:var(--tr);stroke-width:10px;stroke-linecap:round" d="M${R - 70} ${R - 34}A76 76 0 0 1 ${R - 34} ${R - 70}"/>`);
  const ct = div(`left:0;top:0;width:${2 * R}px;height:${2 * R}px`, l.p);
  R11.iconWord(K, ct, it, 2 * R, it.label ? 42 : 64, 64, 34);
  const t0 = T.b[1] - .15, L = T.hit - t0;
  A(lg, [{opacity: 0}, {opacity: 1}], t0, .15);
  A(lg, [{transform: 'translate(-150px,90px) scale(.86)'}, {transform: 'translate(80px,-46px)', offset: .34, easing: 'ease-in-out'},
    {transform: 'translate(-70px,-30px)', offset: .64, easing: 'ease-in-out'}, {transform: 'translate(16px,8px)', offset: .86, easing: 'ease-in'},
    {transform: 'none'}], t0, L, {e: 'ease-out'});
  K.enter(ct, T.hit, 'pop'); K.punch(l.p, T.hit); R1.ripple(K, l, T.hit + .12, {grow: 30});
});

/* 4 · a key turned in a padlock: the shackle has sprung open, and the tip comes up out of it. Motion: the locked padlock
   comes up · the key slides into the keyhole · it turns (a squeeze) · on the key word the shackle springs open and the tip
   pops out beside it */
R3.both('B13', 'unlock', 'ลูกกุญแจไขแม่กุญแจ แม่กุญแจเด้งเปิด เคล็ดลับลอยออกมา', (K, s, T, g) => {
  const it = s.secret ?? {icon: 'lightbulb'}, bx = 100, by = 150, bw = 236, bh = 178, cx = bx + bw / 2, ky = by + 80;
  const lk = R6.group(g); K.enter(lk, T.b[0], 'rise');
  const sh = R8.svg(lk, `<path style="fill:none;stroke:var(--sd);stroke-width:30px;stroke-linecap:round" d="M${cx - 64} ${by + 10}V${by - 50}Q${cx - 64} ${by - 116} ${cx} ${by - 116}Q${cx + 64} ${by - 116} ${cx + 64} ${by - 56}V${by - 34}"/>`);
  A(sh, [{transform: 'translateY(44px)'}, {transform: 'translateY(-10px)', offset: .55}, {transform: 'none'}], T.hit - .05, .4, {e: 'ease-out'});   // springs up
  const bl = R8.svg(lk, R11.inkL(`M${cx + 90} ${by - 40}L${cx + 112} ${by - 50}M${cx + 92} ${by - 18}L${cx + 116} ${by - 16}M${cx + 84} ${by - 62}L${cx + 100} ${by - 80}`, .35));
  bl.querySelectorAll('path').forEach(p => R11.draw(K, p, T.hit + .1, .2));
  const b = R7.plain(lk, bx, by, bw, bh, 'main', '30px');
  [20, bh - 24].forEach(y => R11.rule(b.p, 18, y, bw - 36, .18, 'u-inherit', 4));
  const kh = R9.card(b.p, bw / 2 - 22, 58, 44, 78, 0); kh.p.style.boxShadow = 'none';             // the keyhole: one cut-out shape
  kh.p.style.clipPath = "path('M22 0A22 22 0 0 1 30.5 42.3L32 72Q32 78 26 78H18Q12 78 12 72L13.5 42.3A22 22 0 0 1 22 0Z')";
  const key = `M${cx + 4} ${ky}H${cx + 148}M${cx + 72} ${ky}V${ky + 24}M${cx + 100} ${ky}V${ky + 18}`, ring = `M${cx + 206} ${ky}m-32 0a32 32 0 1 0 64 0a32 32 0 1 0 -64 0`;
  const ke = R8.svg(lk, `<path style="fill:none;stroke:var(--ac-line, var(--ink));stroke-width:26px;stroke-linecap:round" d="${key}${ring}"/>` +
    `<path style="fill:none;stroke:var(--ac-stroke, var(--ac));stroke-width:16px;stroke-linecap:round" d="${key}${ring}"/>`);
  ke.style.transformOrigin = `${cx}px ${ky}px`;
  A(ke, [{opacity: 0}, {opacity: 1}], T.b[1] - .1, .1);
  A(ke, [{transform: 'translateX(170px)'}, {transform: 'none'}], T.b[1] - .1, .45, {e: 'cubic-bezier(.2,.8,.3,1)'});      // slides in
  A(ke, [{transform: 'none'}, {transform: 'scaleY(.25)', offset: .45}, {transform: 'scaleY(-1)', offset: .55}, {transform: 'none'}], T.b[2], .45, {e: 'ease-in-out', f: 'none'});   // turns
  const c = R9.acc(g, 372, 8, 178, 124, 24); R11.iconWord(K, c.p, it, 178, it.label ? 14 : 32, 48, 30, true); K.enter(c.o, T.hit + .12, 'pop');
});

/* ================= B20 ความสัมพันธ์: a {icon, label?}, b {icon, label?}, label?, cut? ================= */
/* 5 · two cards with "×" between them, the way a collab is announced (when it is over the × breaks red and they part).
   Motion: one card comes in from the left · the other from the right · on the key word the × pops in between with a ring
   (over: they part and the × comes in red) · the word under them */
R3.both('B20', 'cross', 'การ์ดคู่ A × B (จบกัน = การ์ดแยก × สีแดง)', (K, s, T, g) => {
  const a = s.a ?? {icon: 'user'}, b = s.b ?? {icon: 'user'}, cut = !!s.cut;
  [[a, 44, -1, T.b[0]], [b, 344, 1, T.b[1]]].forEach(([it, x, side, t]) => {
    const c = R9.card(g, x, 18, 206, 214, 30);
    A(c.o, [{opacity: 0, transform: `translateX(${side * 160}px)`}, {opacity: 1, transform: 'none'}], t, .5, {e: 'cubic-bezier(.2,.9,.3,1.15)'});
    if (cut) { A(c.m, [{transform: 'none'}, {transform: `translateX(${side * 14}px) rotate(${side * 6}deg)`}], T.hit, .4, {e: EASE.spring, f: 'forwards'}); A(c.o, [{opacity: 1}, {opacity: .8}], T.hit, .4, {f: 'forwards'}); }
    R11.iconWord(K, c.p, it, 206, it.label ? 34 : 62, 92, 40);
  });
  const x = R11.disc(g, 297, 125, 44, cut ? 'neg' : 'acc'); R11.glyph(x.p, '×', 44, 44, 70, cut ? 'u-inherit' : 'u-bubble-text');
  K.enter(x.o, T.hit, 'pop'); if (!cut) R1.ripple(K, x, T.hit + .3, {grow: 26});
  if (s.label) K.enter(R4.word(K, g, s.label, 297, 258, 44, null, 360), T.hit + .25, 'chip');
});

/* ================= B21 สถานที่: place {icon, label?}, spots? [1-2 {icon, label?}] ================= */

/* 8 · a check-in in an app: a little map (its roads inside it) with the pin dropped, the place's name, the button pressed.
   Motion: the app comes up and the roads draw on the map · the pin drops onto the map and bounces, a ring going out under it ·
   the place's name and spots come in · on the key word the check-in button is pressed and lights */
R3.both('B21', 'checkin', 'การ์ดเช็กอินในแอป กดปุ่มแล้วหมุดเด้ง ชื่อสถานที่ขึ้น', (K, s, T, g) => {
  const pl = s.place ?? {icon: 'map-pin'}, sp = (s.spots ?? []).slice(0, 2);
  const c = R9.card(g, 110, 4, 380, 332, 30); K.enter(c.o, T.b[0], 'rise');
  const m = R7.plain(c.p, 16, 16, 348, 142, 'soft', '20px'); m.p.style.overflow = 'hidden';
  const px = 174, py = 58;                                                        // the pin's head on the map
  const mp = R8.svg(m.p, `<rect x="236" y="84" width="92" height="48" rx="10" style="fill:var(--ac);opacity:.35"/><rect x="18" y="14" width="70" height="40" rx="8" style="fill:var(--tr)"/>` +
    `<path style="fill:none;stroke:var(--tr);stroke-width:16px" d="M-10 100Q90 66 170 96T360 74M112 -10Q132 70 104 160M252 -10V160"/>`);
  R11.draw(K, mp.querySelector('path'), T.b[0] + .3, .7);
  const rg = R8.svg(m.p, `<ellipse cx="${px}" cy="${py + 64}" rx="34" ry="10" style="fill:none;stroke:var(--ac-stroke, var(--ac));stroke-width:3px"/>`); rg.style.transformOrigin = `${px}px ${py + 64}px`;
  A(rg, [{opacity: 0, transform: 'scale(.3)'}, {opacity: .9, transform: 'scale(.8)', offset: .3}, {opacity: .6, transform: 'none'}], T.b[1] + .35, .5, {e: 'ease-out'});
  R8.svg(m.p, `<ellipse cx="${px}" cy="${py + 64}" rx="16" ry="5" style="fill:#000;opacity:.18"/>`);
  const pin = R6.group(m.p);
  R8.svg(pin, R11.accP(`M${px} ${py + 62}C${px - 12} ${py + 44} ${px - 34} ${py + 28} ${px - 34} ${py}A34 34 0 1 1 ${px + 34} ${py}C${px + 34} ${py + 28} ${px + 12} ${py + 44} ${px} ${py + 62}Z`, .5));
  const ink = R11.accInk(pin, px - 34, py - 34, 68, 68); R9.ico(ink.p, pl.icon, 34, 34, 34, 'u-bubble-text');
  A(pin, [{opacity: 0, transform: 'translateY(-140px)'}, {opacity: 1, transform: 'translateY(-90px)', offset: .15},
    {transform: 'none', offset: .6, easing: 'ease-out'}, {transform: 'translateY(-16px)', offset: .8, easing: 'ease-in'}, {transform: 'none'}], T.b[1] - .1, .6, {e: 'ease-in'});
  const nm = div('left:0;top:0;width:380px;height:332px', c.p);
  R9.ico(nm, pl.icon, 36, 192, 30); if (pl.label) R6.wordL(K, nm, pl.label, 62, 170, 36, null, 270); K.enter(nm, T.b[2] - .1, 'lead');
  sp.forEach((p, k) => { const ch = R7.plain(c.p, 16 + k * 178, 220, 166, 40, 'soft', '20px'); R11.inkIco(ch.p, p.icon, 24, 20, 22); if (p.label) R6.wordL(K, ch.p, p.label, 44, 6, 21, null, 112); K.enter(ch.o, T.b[2] + .1 + k * .1, 'pop'); });
  const bt = R7.plain(c.p, 16, 272, 348, 46, 'soft', '23px'); R9.ico(bt.p, 'map-pin', 152, 23, 26, 'u-inherit'); K.enter(bt.o, T.b[0] + .3, 'rise');
  const lit = R10.lit(K, c.p, 16, 272, 348, 46, '23px', T.hit); R9.ico(lit.p, 'map-pin', 152, 23, 26, 'u-bubble-text');
  const ck = R9.ico(lit.p, 'check', 196, 23, 26, 'u-bubble-text'); K.enter(ck, T.hit + .15, 'pop'); K.punch(lit.p, lit.done);
});

/* ================= B12 เหตุกับผล: items [3 {icon, label?, tone?}], end? ================= */
/* 9 · three cards joined by arrows: the light has run along each arrow and the last card (the effect) stands lit, bigger,
   in a glow. Motion: the first card pops in · its arrow draws and the second card pops in · the second arrow draws · on the
   key word the effect card flips in, lit, and its glow and ring come up */
R3.both('B12', 'relay', 'สามการ์ดต่อด้วยลูกศร แสงวิ่งไปตามลูกศร การ์ดผลลัพธ์พลิก', (K, s, T, g) => {
  const it = (s.items ?? []).slice(0, 3), neg = it[2]?.tone === 'neg', W = 124, H = 168, Y = 86, xs = [20, 204], LX = 388, LW = 156, LH = 204, LY = 68, mid = Y + H / 2;
  const halo = div(`left:${LX - 70}px;top:${LY - 60}px;width:${LW + 140}px;height:${LH + 120}px;border-radius:50%`, g); halo.className = 'u-halo'; K.enter(halo, T.hit + .15, 'glow');
  const rg = div(`left:${LX - 12}px;top:${LY - 12}px;width:${LW + 24}px;height:${LH + 24}px;border-radius:36px;border:3px solid ${neg ? 'var(--neg)' : 'var(--ac-stroke, var(--ac))'};opacity:.5`, g);
  A(rg, [{opacity: 0, transform: 'scale(.9)'}, {opacity: .5, transform: 'none'}], T.hit + .3, .35, {e: 'ease-out'});
  const when = [T.b[0], T.b[1] + .05];
  it.forEach((p, k) => {
    if (k < 2) { const c = R9.card(g, xs[k], Y, W, H, 24); R11.iconWord(K, c.p, p, W, 34, 52, 26); K.enter(c.o, when[k], 'pop'); return; }
    const c = R11.effect(K, g, LX, LY, LW, LH, 28, p, neg, 74, 62, 118, 30); c.o.style.transformOrigin = '50% 50%';
    A(c.o, [{opacity: 0, transform: 'perspective(800px) rotateY(90deg)'}, {opacity: 1, transform: 'perspective(800px) rotateY(-12deg)', offset: .7}, {opacity: 1, transform: 'none'}], T.hit - .05, .5, {e: 'ease-out'});
  });
  const ar = R8.svg(g, [[xs[0] + W + 12, xs[1] - 12], [xs[1] + W + 12, LX - 14]].map(([x1, x2]) =>
    R11.inkL(`M${x1} ${mid}H${x2}M${x2 - 14} ${mid - 14}L${x2} ${mid}L${x2 - 14} ${mid + 14}`, .6)).join(''));
  ar.querySelectorAll('path').forEach((p, k) => R11.draw(K, p, k ? T.b[2] : T.b[1] - .25, .35));
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
    return `M${f(o(X - tw + 14))} ${top - 3}Q${f(o(X - tw - 4))} ${top - 14} ${f(out[0][0])} ${out[0][1]}` + R11.smooth(out) + back.map(p => `L${f(p[0])} ${p[1]}`).join('') + 'Z'; };
  const left = spill(1, [[top + 8, 12], [top + 50, 8], [top + 96, 10], [top + 128, 14], [top + 160, 9], [bot - 4, 14], [bot + 6, 26]]);
  const right = spill(-1, [[top + 8, 11], [top + 44, 8], [top + 80, 10], [top + 100, 5]]);
  const pud = R8.svg(g, R11.accP(`M${X - tw - 64} ${bot + 6}Q${X} ${bot - 14} ${X + tw + 64} ${bot + 6}Q${X} ${bot + 26} ${X - tw - 64} ${bot + 6}Z`, .4));
  pud.style.transformOrigin = `${X}px ${bot + 6}px`; K.grow(pud, T.hit + .2, 'X', .45);
  const gl = R6.group(g); K.enter(gl, T.b[0], 'rise');
  R8.svg(gl, `<path class="fl" style="stroke:none" d="${glass}"/>`);
  const wt = R8.svg(gl, R11.accP(water, 0));                                       // the water rises a step with each drop, then brims
  R9.track(wt, 'clipPath', [[T.b[0], 236], [T.b[1] + .12, 236], [T.b[1] + .4, 196], [T.b[2] + .12, 196], [T.b[2] + .4, 146], [T.hit - .15, 146], [T.hit + .1, -40]], v => `inset(${v}px -40px -40px -40px)`);
  R8.svg(gl, `<path class="u-fl-edge" d="${glass}"/>` +
    `<path style="fill:none;stroke:#FFFFFF;stroke-width:7px;stroke-linecap:round;opacity:.45" d="M${f(xw(top + 34) + 20)} ${top + 34}L${f(xw(bot - 50) + 18)} ${bot - 50}"/>`);
  const sp = R8.svg(g, R11.accP(left, .4) + R11.accP(right, .4) + R11.accP(R11.drop(2 * X - xw(top + 128) + 5, top + 128, 7), .4));
  A(sp, [{clipPath: 'inset(-40px -40px 100% -40px)'}, {clipPath: 'inset(-40px -40px -40px -40px)'}], T.hit + .05, .5, {e: 'ease-in'});   // it spills down the sides
  [[0, X - 8, 38, 'L', T.b[0] + .3, T.b[1] + .1], [1, X + 46, 74, 'R', T.b[1] + .3, T.b[2] + .1]].forEach(([k, x, y, side, tIn, tFall]) => {
    const dg = R6.group(g); dg.style.transformOrigin = `${x}px ${y}px`; K.enter(dg, tIn, 'pop');
    R8.svg(dg, R11.accP(R11.drop(x, y, 24), .5));
    const ink = R11.accInk(dg, x - 24, y - 24, 48, 48); if (it[k]) R9.ico(ink.p, it[k].icon, 24, 24, 24, 'u-bubble-text');
    if (it[k]?.label) { if (side === 'L') R11.wordR(K, dg, it[k].label, x - 34, y - 18, 28, 140); else R6.wordL(K, dg, it[k].label, x + 34, y - 18, 28, null, 120); }
    const dr = R8.svg(g, R11.accP(R11.drop(x, y + 40, 8), .4)); dr.style.opacity = 0;   // a drip falls from it into the glass (seen only while it falls)
    A(dr, [{opacity: 0, transform: 'none'}, {opacity: 1, transform: 'translateY(6px)', offset: .15}, {opacity: 1, transform: `translateY(${top + 40 - y - 40}px)`, offset: .85}, {opacity: 0, transform: `translateY(${top + 52 - y - 40}px)`}], tFall - .25, .4, {e: 'ease-in', f: 'none'});
  });
  if (it[2]) { const c = R11.effect(K, g, 404, 122, 146, 136, 24, it[2], neg, 48, 52, 84, 26); K.enter(c.o, T.hit + .3, 'pop'); }
  const dl = R8.svg(g, `<path class="ln u-thin u-dash" d="M${X + tw + 72} ${bot + 4}Q${X + tw + 112} ${bot - 4} 416 266"/>`);
  A(dl, [{clipPath: 'inset(0 100% 0 0)'}, {clipPath: 'inset(0 0 0 0)'}], T.hit + .3, .35, {e: 'linear'});
});

/* ================= B05 ถูกกับผิด: wrong {icon, label?}, right {icon, label?} ================= */
/* 11 · a quiz in an app: the progress bar and the question on top, the wrong answer tapped (red edge, ✗), the right one
   lit with ✓ under the pointer. Motion: the app comes up, its bar filling, the question pops · the two answers come in · the
   pointer taps the wrong one: red edge, ✗, a shake · on the key word it taps the right one, which lights with ✓ */
R3.both('B05', 'quiz', 'ควิซในแอป ตอบผิดขึ้นแดง ตอบถูกขึ้นเขียว ✓', (K, s, T, g) => {
  const w = s.wrong ?? {icon: 'x'}, r = s.right ?? {icon: 'check'};
  const c = R9.card(g, 90, 4, 420, 332, 30); K.enter(c.o, T.b[0], 'rise');
  R11.bar(c.p, 30, 24, 360, 12, null, 6); const pb = R9.acc(c.p, 30, 24, 236, 12, 6); pb.p.style.boxShadow = 'none'; pb.o.style.transformOrigin = '0 50%'; K.grow(pb.o, T.b[0] + .3, 'X', .5);
  const q = R11.disc(c.p, 210, 76, 28, 'acc'); R11.glyph(q.p, '?', 28, 28, 40, 'u-bubble-text'); K.enter(q.o, T.b[1] - .2, 'pop');
  const a = R9.card(c.p, 24, 120, 372, 86, 22); K.enter(a.o, T.b[1], 'rise');
  const ar = div('left:0;top:0;width:372px;height:86px;border-radius:22px;box-shadow:0 0 0 4px var(--neg)', a.p); R7.show(ar, T.b[2] + .05);
  R9.ico(a.p, w.icon, 46, 43, 38); if (w.label) R6.wordL(K, a.p, w.label, 80, 23, 32, null, 210);
  const x = R11.disc(a.p, 332, 43, 24, 'neg'); R9.ico(x.p, 'x', 24, 24, 28, 'u-inherit'); K.enter(x.o, T.b[2] + .05, 'pop'); K.shake(a.p, T.b[2] + .1);
  const b = R9.card(c.p, 24, 222, 372, 86, 22); K.enter(b.o, T.b[1] + .12, 'rise');
  R9.ico(b.p, r.icon, 46, 43, 38); if (r.label) R6.wordL(K, b.p, r.label, 80, 23, 32, null, 210);
  const lt = R10.lit(K, c.p, 24, 222, 372, 86, 22, T.hit);
  R9.ico(lt.p, r.icon, 46, 43, 38, 'u-bubble-text'); if (r.label) { const l = R6.wordL(K, lt.p, r.label, 80, 23, 32, null, 210); l.classList.add('u-bubble-text'); }
  const ok = R9.ico(lt.p, 'circle-check', 332, 43, 44, 'u-bubble-text'); K.enter(ok, T.hit + .15, 'pop');
  K.cursor(c.p, [[T.b[1] + .3, 360, 330], [T.b[2] - .05, 270, 150], [T.hit - .3, 270, 150], [T.hit - .05, 226, 262], [T.t1, 226, 262]], {clicks: [T.b[2] - .05, T.hit - .05], size: 58});
});

/* ================= B11 คำพูด: quote, kind, mood, react? ================= */
/* 13 · a chat: who is on the other end (online), the "typing…" dots, then the message itself (what was said) with a
   reaction on its corner. Motion: the chat comes up · the typing bubble pops and its dots bounce · on the key word the
   message pops in under it · the reaction pops onto its corner */
R3.both('B11', 'typing', 'แชตกำลังพิมพ์ จุดสามจุดเด้ง แล้วข้อความขึ้น', (K, s, T, g) => {
  const q = s.quote ?? '', bad = s.mood === 'bad';
  const c = R9.card(g, 90, 4, 420, 332, 30); K.enter(c.o, T.b[0], 'rise');
  const av = R11.disc(c.p, 52, 48, 26, 'main'); R11.inkIco(av.p, 'user', 26, 26, 30);
  const on = R11.disc(c.p, 72, 68, 9, 'acc'); on.p.style.boxShadow = 'none'; K.enter(on.o, T.b[0] + .4, 'pop');
  [['phone', 318], ['video', 366]].forEach(([ic, x]) => { R9.ico(c.p, ic, x, 48, 30).style.opacity = .55; });
  R11.bar(c.p, 0, 94, 420, 3, null, 1);
  const d = R7.plain(c.p, 28, 116, 124, 54, 'soft', '27px 27px 27px 6px'); K.enter(d.o, T.b[1] - .1, 'pop');
  [34, 62, 90].forEach((x, k) => { const dt = R11.disc(d.p, x, 27, 9, 'main'); dt.p.style.boxShadow = 'none';
    A(dt.m, [{transform: 'none'}, {transform: 'translateY(-9px)', offset: .3}, {transform: 'none', offset: .6}, {transform: 'none'}], T.b[1] + .1 + k * .12, .6, {e: 'ease-in-out', f: 'none', it: 3}); });
  const m = R9.acc(c.p, 28, 186, 352, 110, '30px 30px 30px 8px'); m.o.style.transformOrigin = '0 100%'; K.enter(m.o, T.hit, 'pop');
  if (q) R11.accWord(K, m.p, q, 176, 28, 46, 310);
  if (s.react) { const r = R11.disc(c.p, 376, 292, 24, bad ? 'neg' : 'card'); if (bad) R11.inkIco(r.p, s.react, 24, 24, 26); else R9.ico(r.p, s.react, 24, 24, 26); K.enter(r.o, T.hit + .4, 'pop'); }
});

/* 14 · an incoming call: the phone is answered, the voice runs as a sound wave and what was said as a subtitle.
   Motion: the phone comes up ringing (rings go out round the caller, the phone buzzes) · the green button is pressed · the
   sound wave starts moving · on the key word what was said comes up as the subtitle · then the reaction */
R3.both('B11', 'call', 'สายเรียกเข้า กดรับสาย คำพูดขึ้นเป็นซับบนจอ', (K, s, T, g) => {
  const q = s.quote ?? '', bad = s.mood === 'bad';
  const ph = R7.plain(g, 180, 0, 240, 340, 'main', '42px'); K.enter(ph.o, T.b[0], 'rise');
  A(ph.m, [{transform: 'none'}, {transform: 'rotate(-3deg)', offset: .1}, {transform: 'rotate(3deg)', offset: .2}, {transform: 'rotate(-3deg)', offset: .3}, {transform: 'rotate(2deg)', offset: .4}, {transform: 'none', offset: .5}, {transform: 'none'}], T.b[0] + .45, .7, {f: 'none', it: 2});
  const sc = R9.card(ph.p, 12, 12, 216, 316, 32);
  R7.plain(sc.p, 80, 10, 56, 14, 'main', '7px').p.style.boxShadow = 'none';
  [[52, .45], [62, .2]].forEach(([r, op]) => { const e = div(`left:${108 - r}px;top:${86 - r}px;width:${2 * r}px;height:${2 * r}px;border-radius:50%;border:3px solid var(--ac-stroke, var(--ac));opacity:${op}`, sc.p);
    A(e, [{transform: 'scale(.7)', opacity: op * 2}, {transform: 'scale(1.15)', opacity: 0}], T.b[0] + .3, .7, {e: 'ease-out', f: 'none', it: 2}); });
  const av = R11.disc(sc.p, 108, 86, 38, 'acc'); R9.ico(av.p, 'user', 38, 38, 42, 'u-bubble-text');
  [10, 22, 34, 18, 30, 14, 8].forEach((h, k) => { const e = div(`left:${66 + k * 13}px;top:${158 - h / 2}px;width:7px;height:${h}px;border-radius:4px;background:var(--text);opacity:.6`, sc.p);
    A(e, [{transform: 'scaleY(.3)'}, {transform: 'scaleY(1.2)'}, {transform: 'scaleY(.6)'}, {transform: 'none'}], T.b[2] + .1 + k * .05, .5, {e: 'ease-in-out', f: 'both', it: 3}); R7.show(e, T.b[2] + .05); });
  const sub = R7.plain(sc.p, 14, 184, 188, 70, 'soft', '18px'); K.enter(sub.o, T.hit, 'pop');
  if (q) { const w = R4.word(K, sub.p, q, 94, 14, 32, null, 170); w.classList.add('u-inherit'); }
  const on = R11.disc(sc.p, 66, 282, 24, 'acc'); R9.ico(on.p, 'phone', 24, 24, 24, 'u-bubble-text'); K.punch(on.p, T.b[2] - .1); R1.ripple(K, on, T.b[2] - .05, {grow: 16});
  const off = R11.disc(sc.p, 150, 282, 24, 'neg'); R11.inkIco(off.p, 'phone-off', 24, 24, 24);
  if (s.react) { const r = R11.disc(g, 456, 72, 30, bad ? 'neg' : 'acc'); R9.ico(r.p, s.react, 30, 30, 32, bad ? 'u-inherit' : 'u-bubble-text'); K.enter(r.o, T.hit + .4, 'pop'); }
});

/* ================= B02 เพิ่ม / ลด: dir, item, center?, n?, keep?, end? ================= */
/* 17 · a battery: the bars fill up one by one (up), or drain until one red bar is left (down); each bar has its shine.
   Motion: up = the empty battery comes up · the bars fill one by one from the left, the last one (with the icon) on the key
   word, a punch; down = it comes up full · the bars go out one by one from the right · on the key word the last one turns red */
R3.both('B02', 'battery', 'แบตเตอรี่ ขีดเติมขึ้นทีละขีด หรือลดลงจนแดง', (K, s, T, g) => {
  const up = s.dir !== 'down', it = s.item ?? {icon: 'zap'};
  const bt = R6.group(g); bt.style.transformOrigin = '300px 185px'; K.enter(bt, T.b[0], 'rise');
  const b = R9.card(bt, 70, 88, 420, 194, 38);
  /* a clear edge and a solid terminal, so the battery stands off any background (Friend 2026-11-12: "มันกลืนกับพื้นหลังไปหน่อยอะ") */
  R8.svg(bt, `<rect x="70" y="88" width="420" height="194" rx="38" style="fill:none;stroke:var(--ink);stroke-width:calc(var(--lw) * .6)"/>` +
    `<path style="fill:var(--ink);stroke:none" d="M498 146H506Q526 146 526 166V204Q526 224 506 224H498Z"/>`);
  const on = [T.b[0] + .45, T.b[1] + .1, T.b[2], T.hit], off = {3: T.b[1] + .1, 2: T.b[2], 1: T.hit - .2};
  [0, 1, 2, 3].forEach(k => {
    const x = 22 + k * 98; R11.bar(b.p, x, 22, 82, 150, null, 16);
    const c = R9.acc(b.p, x, 22, 82, 150, 16); c.o.style.transformOrigin = '50% 100%';
    div('left:12px;top:12px;width:12px;height:126px;border-radius:6px;background:#FFFFFF;opacity:.35', c.p);
    if (up) { A(c.o, [{opacity: 0, transform: 'scaleY(.2)'}, {opacity: 1, transform: 'none'}], on[k], .3, {e: 'cubic-bezier(.2,.9,.3,1.2)'});
      if (k === 3) R9.ico(c.p, it.icon, 41, 75, 40, 'u-bubble-text'); return; }
    if (k) { A(c.o, [{opacity: 1, transform: 'none'}, {opacity: 0, transform: 'scaleY(.2)'}], off[k], .25, {e: 'ease-in', f: 'forwards'}); return; }
    const red = R7.plain(b.p, x, 22, 82, 150, 'neg', '16px'); R7.show(red.o, T.hit); K.punch(red.p, T.hit);
    div('left:12px;top:12px;width:12px;height:126px;border-radius:6px;background:#FFFFFF;opacity:.35', red.p);
    R9.ico(red.p, it.icon, 41, 75, 40, 'u-inherit');
  });
  if (up) K.punch(bt, T.hit + .3);
});

/* ================= B14 ประโยคเด็ด: idea {icon?, label} ================= */
/* 19 · a page of a book: a highlighter has just run along one line (its stroke ragged at the ends), and that line is the
   punchline; the pen rests with its chisel tip at the end of the stroke. Motion: the page comes up · the highlighter comes in
   at the start of the line · it runs along it, the stroke growing behind its tip · on the key word the punchline shows on the
   stroke (a punch) */
R3.both('B14', 'marker', 'ปากกาไฮไลต์ลากผ่านบรรทัด ประโยคติดสี', (K, s, T, g) => {
  const it = s.idea ?? {icon: 'quote'};
  const pg = R9.card(g, 40, 14, 424, 312, 18); K.enter(pg.o, T.b[0], 'rise');
  const h = R11.bar(pg.p, 30, 26, 190, 16, null, 8); h.style.background = 'var(--ink)'; h.style.opacity = .22;
  [[64, 364], [88, 300], [204, 364], [228, 340], [252, 364], [276, 210]].forEach(([y, w]) => R11.bar(pg.p, 30, y, w, 10, null, 5));
  const run = T.b[2] - .1, end = T.hit - .15;
  const hl = R9.acc(pg.p, 20, 116, 372, 70, 6); hl.p.style.clipPath = 'polygon(1% 10%, 30% 4%, 70% 7%, 99% 0, 100% 52%, 98.5% 100%, 60% 95%, 25% 98%, 0 92%, 1.5% 50%)'; hl.p.style.boxShadow = 'none';
  A(hl.o, [{clipPath: 'inset(-10px 100% -10px -10px)'}, {clipPath: 'inset(-10px -10px -10px -10px)'}], run, end - run, {e: 'ease-in-out'});
  const wd = div('left:0;top:0;width:372px;height:70px', hl.p);
  if (it.label) R11.accWord(K, wd, it.label, 186, 10, 40, 340); else R9.ico(wd, it.icon, 186, 35, 44, 'u-bubble-text');
  K.enter(wd, T.hit, 'pop'); K.punch(hl.p, T.hit + .05);
  const tx = 40 + 20 + 372 + 4, ty = 14 + 116 + 52;                                // the tip at the stroke's end
  const mv = R6.group(g); A(mv, [{transform: 'translate(-372px,0)'}, {transform: 'none'}], run, end - run, {e: 'ease-in-out'});
  A(mv, [{opacity: 0, transform: 'translate(-332px,-90px)'}, {opacity: 1, transform: 'translate(-372px,0)'}], T.b[1], .4, {e: 'ease-out', f: 'backwards'});
  const pen = R6.group(mv); pen.style.transformOrigin = `${tx}px ${ty}px`; pen.style.transform = 'rotate(34deg)';
  const tip = R9.acc(pen, tx - 12, ty - 26, 24, 28, '3px'); tip.p.style.clipPath = 'polygon(14% 0, 86% 0, 100% 62%, 0 100%)';
  R7.plain(pen, tx - 18, ty - 46, 36, 22, 'main', '6px');
  const body = R9.acc(pen, tx - 24, ty - 160, 48, 118, '12px');
  [30, 42].forEach(y => R11.rule(body.p, 10, y, 28, .35, 'u-bubble-text', 4));
  R7.plain(pen, tx - 26, ty - 196, 52, 42, 'main', '14px 14px 8px 8px');
});

/* 20 · a banner on its rod (hung from a hook) unrolls downward: the cloth folds over the rod, a stitched edge, and the
   punchline is on the cloth. Motion: the rod drops in on its strings · the cloth unrolls downward from it · it settles with a
   little sway · on the key word the punchline comes up on it (a punch) */
R3.both('B14', 'banner', 'ป้ายผ้าคลี่ลงมาจากราว ประโยคอยู่บนผ้า', (K, s, T, g) => {
  const it = s.idea ?? {icon: 'quote'};
  const rod = R6.group(g); K.enter(rod, T.b[0], 'drop');
  R8.svg(rod, R11.inkL('M98 46L300 8L502 46', .2) + `<circle cx="300" cy="8" r="7" style="fill:var(--ink)"/>`);
  R7.plain(rod, 84, 38, 432, 18, 'main', '9px'); R11.disc(rod, 80, 47, 16, 'main'); R11.disc(rod, 520, 47, 16, 'main');
  const cw = R6.group(g); cw.style.transformOrigin = '300px 48px';
  A(cw, [{clipPath: 'inset(0 -20px 100% -20px)'}, {clipPath: 'inset(0 -20px -40px -20px)'}], T.b[1] - .1, .7, {e: 'cubic-bezier(.3,.7,.4,1)'});
  A(cw, [{transform: 'none'}, {transform: 'rotate(1.6deg)', offset: .3}, {transform: 'rotate(-1deg)', offset: .65}, {transform: 'none'}], T.b[2] - .05, 1, {e: 'ease-in-out', f: 'none'});
  const c = R9.acc(cw, 120, 48, 360, 282, 0); c.p.style.clipPath = 'polygon(0 0, 100% 0, 100% 100%, 50% 86%, 0 100%)';
  div('left:0;top:0;width:360px;height:20px;background:#000;opacity:.14', c.p);
  R8.svg(c.p, `<path class="u-bubble-text" style="fill:none;stroke:currentColor;stroke-width:2.5px;stroke-dasharray:9 8;opacity:.4" d="M16 34H344V258L180 226L16 258Z"/>`);
  const wd = div('left:0;top:0;width:360px;height:282px', c.p);
  if (it.icon) R9.ico(wd, it.icon, 180, 92, 56, 'u-bubble-text');
  if (it.label) R11.accWord(K, wd, it.label, 180, 136, 48, 300);
  K.enter(wd, T.hit, 'pop'); K.punch(c.p, T.hit + .05);
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
