/* =====================================================================
   CutPack · uni · LEGO round 9, refill (Friend 2026-11-11: "เริ่มได้" on the fourth set of still sketches,
   engine/uni/sketches/r9e.js). Ideas made the way the talking-head-motion skill designs a scene: one main element (a card,
   a line shape or an app UI) + ONE move that carries the meaning (fill, draw, stack, turn) on the key word, then it holds;
   no decoration; slow and soft (the style's own speeds; the main move about .6–1.2 s and done by the key word; nothing that
   blinks or swings back and forth). Checked against Friend's taste (DECISIONS, round 9): everyday things seen at once,
   the round 1–8 card look, not empty, no people.
     B09 เวลา        ตารางวันในแอป ช่องเติมสีทีละวัน (days)
     B13 เคล็ดลับ     ช่องรหัสผ่าน กดรูปตาแล้วกลายเป็นเคล็ดลับ (password)
     B16 นิยาม       คำขีดเส้นใต้ กล่องความหมายเด้งขึ้นเหนือคำ (tooltip)
     B20 ความสัมพันธ์ สองวงเชื่อมด้วยเส้นวนเลขแปด (loop; cut = the loop breaks)
     B21 สถานที่     เข็มทิศหมุนแล้วชี้ไปที่การ์ดสถานที่ (compass)
     B08 เป้าหมาย    วงแหวนเป้าหมายปิดครบวง (ring)
     B01 ตัวเลขเด่น   การ์ดสถิติ ตัวเลขนับขึ้น (stat) · ล้อตัวเลขหมุนแล้วหยุด (odometer)
     B02 เพิ่ม/ลด     กราฟโดนัท (donut) · การ์ดจุดสว่างเพิ่ม/ดับ (dots)
     B14 ประโยคเด็ด   ข้อความถูกปักหมุด (pinned) · โพสต์คำคม ปุ่มบันทึกถูกกด (post)
     B15 ปิดคลิป      ไอคอนในวงกลม วงแหวนวาดรอบ (circle) · ปุ่มยาวเติมสีแล้วกลายเป็นกดแล้ว (press)
   Loaded after lego_r9.js (R9 helpers) and before lego_v2.js (so no V2 here).
   ===================================================================== */
const R9B = {
  onFl: el => { el.style.color = 'var(--fl-edge, var(--fl-line, var(--ink)))'; return el; },
  skel: (p, x, y, w, h = 14) => div(`left:${x}px;top:${y}px;width:${w}px;height:${h}px;border-radius:${h / 2}px;background:var(--tr)`, p),
  /* the value at a fraction of the way, written like the real value (commas, decimals, % or units around it) */
  part(s, f) {
    const str = String(s.value), num = R2.num(s), dec = (str.split('.')[1] ?? '').replace(/\D/g, '').length, x = (num * f).toFixed(dec);
    const [i, d] = x.split('.'); const body = (/,/.test(str) ? i.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : i) + (d ? '.' + d : '');
    return str.replace(/[\d,]+(\.\d+)?/, body);
  },
  /* a counter: the number shows n in-between values from t0 and lands on the real value at t1 */
  count(K, s, parent, make, t0, t1, n = 8) {
    for (let k = 0; k <= n; k++) {
      const e = make(k === n ? String(s.value) : R9B.part(s, k / n)), t = t0 + (t1 - t0) * k / n;
      if (k) R7.show(e, t); if (k < n) R7.hide(e, t0 + (t1 - t0) * (k + 1) / n);
    }
  },
};

/* 1 · B09 เวลา · a calendar grid in an app: the days fill one by one; the header names the moment it has reached */
R3.both('B09', 'days', 'ตารางวันในแอป ช่องเติมสีทีละวัน', (K, s, T, g) => {
  const pts = (s.points ?? []).slice(0, 3), n = pts.length, at = n ? Math.min(s.at ?? n - 1, n - 1) : 2, W = 430, H = 290, X = 300 - W / 2, Y = 24;
  const c = R9.card(g, X, Y, W, H, 26); K.enter(c.o, T.b[0], 'rise');
  const t0 = T.b[1] - .1, tk = R7.steps(T, 3, at, t0 + .4);
  /* the header: each moment's name in turn, the last one on the key word */
  pts.slice(0, at + 1).forEach((p, k) => {
    const w = R6.wordL(K, c.p, p.label ?? '', 28, 18, 40, null, W - 120);
    if (k) R7.show(w, tk[k]); else K.enter(w, T.b[0] + .3, 'lead');
    if (k < at) R7.hide(w, tk[k + 1]);
    if (k === at && at) K.punch(w, tk[k]);
  });
  if (!n && s.result) R9.ico(c.p, s.result.icon, 52, 44, 40);
  R9.ico(c.p, pts[at]?.icon ?? 'calendar', W - 50, 44, 34);
  const cols = 7, rows = 4, gx = 10, cw = (W - 56 - gx * (cols - 1)) / cols, ch = 38, on = Math.round(cols * rows * (at + 1) / 3);
  for (let i = 0; i < cols * rows; i++) {
    const x = 28 + (i % cols) * (cw + gx), y = 92 + Math.floor(i / cols) * (ch + 10);
    div(`left:${x}px;top:${y}px;width:${cw}px;height:${ch}px;border-radius:10px;background:var(--tr)`, c.p);
    if (i < on) { const d = node(c.p, x, y, cw, ch, 'u-badge u-acc'); d.p.style.borderRadius = '10px'; d.p.style.boxShadow = 'none';
      A(d.o, [{opacity: 0, transform: 'scale(.7)'}, {opacity: 1, transform: 'none'}], t0 + (T.hit - t0 - .4) * i / Math.max(1, on - 1), .4, {e: EASE.smooth}); }
  }
});

/* 2 · B13 เคล็ดลับ · a password field: the eye is tapped and the dots turn into the tip */
R3.both('B13', 'password', 'ช่องรหัส กดรูปตาแล้วกลายเป็นเคล็ดลับ', (K, s, T, g) => {
  const it = s.secret ?? {icon: 'lightbulb'}, W = 440, H = 220, X = 300 - W / 2, Y = 60, open = T.hit - .15;
  const c = R9.card(g, X, Y, W, H, 26); K.enter(c.o, T.b[0], 'rise');
  const lk = R9.ico(c.p, 'lock', 46, 48, 36), ul = R9.ico(c.p, 'lock-open', 46, 48, 36); R7.hide(lk, open); R7.show(ul, open);
  R9B.skel(c.p, 80, 42, 150);
  const f = div(`left:24px;top:96px;width:${W - 48}px;height:96px;border-radius:20px;background:var(--tr)`, c.p);
  const dots = div('left:30px;top:0;height:96px;display:flex;align-items:center;gap:16px', f);
  for (let k = 0; k < 7; k++) { const d = div('position:relative;width:20px;height:20px;border-radius:50%;background:var(--sd)', dots); A(d, [{opacity: 0}, {opacity: 1}], T.b[1] + k * .1, .3, {f: 'both'}); }
  R7.hide(dots, open);
  const rv = div(`left:0;top:0;width:${W - 150}px;height:96px`, f); R9.ico(rv, it.icon, 44, 48, 32);
  if (it.label) R6.wordL(K, rv, it.label, 74, 22, 42, null, W - 200);
  R7.write(rv, open, .6);
  const eye = div(`left:${W - 128}px;top:18px;width:60px;height:60px`, f);      // no box of its own: a second see-through layer on the field made the icon too faint (split) R9.ico(eye, 'eye-off', 30, 30, 32);
  const on = R9.acc(f, W - 128, 18, 60, 60, 16); R9.ico(on.p, 'eye', 30, 30, 32, 'u-bubble-text'); K.enter(on.o, open - .1, 'pop');
});

/* 3 · B16 นิยาม · the word, underlined; a tooltip with its meaning rises above it */
R3.both('B16', 'tooltip', 'คำขีดเส้นใต้ แล้วกล่องความหมายเด้งขึ้นเหนือคำ', (K, s, T, g) => {
  const term = s.term ?? {}, means = (s.means ?? []).slice(0, 3), W = 400, H = 60 + 46 * Math.max(1, means.length), X = 300 - W / 2, Y = 18;
  if (term.label) R4.word(K, g, term.label, 300, Y + H + 40, 62, T.b[0], 500);
  const ul = div(`left:150px;top:${Y + H + 126}px;width:300px;height:12px;border-radius:6px;transform-origin:0 50%`, g); ul.className = 'u-col-acc';
  A(ul, [{transform: 'scaleX(0)'}, {transform: 'none'}], T.b[1], .7, {e: EASE.inout});
  const tip = R6.group(g); tip.style.transformOrigin = `300px ${Y + H + 10}px`;
  const c = R9.card(tip, X, Y, W, H, 22);
  const ar = div(`left:${300 - 16}px;top:${Y + H - 2}px;width:32px;height:18px;clip-path:polygon(0 0,100% 0,50% 100%)`, tip); ar.className = 'u-panel'; R2.card({p: ar});
  (means.length ? means : [{icon: term.icon ?? 'book-open', label: ''}]).forEach((m, k) => {
    if (m.icon) R9.ico(c.p, m.icon, 46, 52 + k * 46, 30);
    if (m.label) R6.wordL(K, c.p, m.label, 78, 30 + k * 46, 34, null, W - 100);
  });
  const up = T.hit - (ST.motion.pop?.d ?? .5) * .8;
  A(tip, [{opacity: 0, transform: 'translateY(30px) scale(.9)'}, {opacity: 1, transform: 'none'}], up, .6, {e: EASE.smooth, f: 'both'});
});

/* 4 · B20 ความสัมพันธ์ · two circles; a figure-eight loop is drawn round both (over = it breaks in the middle) */
R3.both('B20', 'loop', 'สองวงเชื่อมด้วยเส้นวนเลขแปด (จบกัน = เส้นขาด)', (K, s, T, g) => {
  const a = s.a ?? {icon: 'user'}, b = s.b ?? {icon: 'user'}, cut = !!s.cut, Y = 168, xa = 178, xb = 422, r = 70;
  const d = `M300 ${Y}C340 ${Y - 110} ${xb + 110} ${Y - 110} ${xb + 110} ${Y}S340 ${Y + 110} 300 ${Y}S${xa - 110} ${Y - 110} ${xa - 110} ${Y}S260 ${Y + 110} 300 ${Y}`;
  const lp = R8.svg(g, `<path class="u-acc-line" style="stroke-width:12px" d="${d}"/>`); R7.show(lp, T.b[1]);
  K.draw(lp.querySelector('path'), T.b[1], cut ? T.b[2] - T.b[1] + .3 : T.hit - T.b[1]);
  const nodes = [[a, xa], [b, xb]].map(([p, x], i) => {
    const n = R9.card(g, x - r, Y - r, 2 * r, 2 * r, '50%'); K.enter(n.o, T.b[0] + i * .1, 'pop');
    R9.ico(n.p, p.icon, r, p.label ? r - 14 : r, 44); if (p.label) R4.word(K, n.p, p.label, r, r + 14, 26, null, 2 * r - 30);
    return n;
  });
  const lab = (soft, t) => { const sg = soft ? node(g, 210, 0, 180, 52, 'u-badge u-soft') : R9.acc(g, 210, 0, 180, 52, 16); sg.p.style.borderRadius = '16px';
    const w = R4.word(K, sg.p, s.label, 90, 6, 32, null, 160); if (!soft) w.classList.add('u-bubble-text'); K.enter(sg.o, t, 'pop'); return sg; };
  if (!cut) { if (s.label) lab(false, T.hit); R1.ripple(K, nodes[1], T.hit); return; }
  /* it breaks: the loop is opened in the middle, the far circle fades */
  const br = R8.svg(g, `<path class="u-acc-line" style="stroke-width:12px" d="M330 ${Y - 40}C360 ${Y - 110} ${xb + 110} ${Y - 110} ${xb + 110} ${Y}S340 ${Y + 110} 300 ${Y}S${xa - 110} ${Y - 110} ${xa - 110} ${Y}S250 ${Y + 90} 270 ${Y + 40}"/>`);
  br.style.opacity = 0; R7.show(br, T.hit); R7.hide(lp, T.hit);
  if (s.label) { const sg = lab(true, T.b[2]); void sg; }
  K.fade(nodes[1].o, T.hit, 1, .5); K.mark(g, 'cross', 300, Y, 40, T.hit + .1);
});

/* 5 · B21 สถานที่ · a compass: the needle swings round, settles, and points at the card of the place */
R3.both('B21', 'compass', 'เข็มทิศหมุนแล้วชี้ไปที่การ์ดสถานที่', (K, s, T, g) => {
  const pl = s.place ?? {icon: 'map-pin'}, spots = (s.spots ?? []).slice(0, 2), C = {x: 170, y: 190}, R = 122, ang = -28;
  const cp = R8.svg(g, `<circle class="fl" cx="${C.x}" cy="${C.y}" r="${R}"/><circle class="u-fl-edge" cx="${C.x}" cy="${C.y}" r="${R}"/><circle class="u-fl-edge" style="opacity:.4" cx="${C.x}" cy="${C.y}" r="${R - 24}"/>` +
    [0, 90, 180, 270].map(a => `<path class="u-fl-edge" transform="rotate(${a} ${C.x} ${C.y})" d="M${C.x} ${C.y - R + 8}V${C.y - R + 26}"/>`).join(''));
  K.enter(cp, T.b[0], 'pop');
  const nd = div(`left:0;top:0;width:600px;height:340px;transform-origin:${C.x}px ${C.y}px`, g,
    `<svg width="600" height="340"><path class="ac" d="M${C.x} ${C.y - R + 30}L${C.x + 18} ${C.y}L${C.x - 18} ${C.y}Z"/><path class="u-fl-edge" style="fill:var(--tr)" d="M${C.x} ${C.y + R - 30}L${C.x + 18} ${C.y}L${C.x - 18} ${C.y}Z"/><circle class="sd" cx="${C.x}" cy="${C.y}" r="10"/></svg>`);
  K.enter(nd, T.b[0] + .1, 'pop');
  A(nd.firstChild, [{transform: 'rotate(-150deg)'}, {transform: `rotate(${ang + 90 + 8}deg)`, offset: .82}, {transform: `rotate(${ang + 90}deg)`}], T.b[1], T.hit - T.b[1], {e: 'cubic-bezier(.3,.1,.3,1)', f: 'both'});
  nd.firstChild.style.transformOrigin = `${C.x}px ${C.y}px`;
  const H = 70 + 40 * spots.length, c = R9.card(g, 318, 36, 226, H, 20); K.enter(c.o, T.hit, 'pop');
  R9.ico(c.p, pl.icon, 34, 36, 32); if (pl.label) R6.wordL(K, c.p, pl.label, 60, 14, 34, null, 156);
  spots.forEach((sp, k) => R6.wordL(K, c.p, sp.label ?? '', 22, 70 + k * 40, 26, null, 190));
});

/* 6 · B08 เป้าหมาย · an activity ring fills all the way round; the goal sits in the middle and lights up when it closes */
R3.both('B08', 'ring', 'วงแหวนเป้าหมายปิดครบวง', (K, s, T, g) => {
  const it = s.goal ?? {icon: 'trophy'}, C = {x: 300, y: 158}, R = 118;
  const rg = R8.svg(g, `<circle class="u-ring" style="stroke-width:44px" cx="${C.x}" cy="${C.y}" r="${R}"/>`); K.enter(rg, T.b[0], 'pop');
  const on = R8.svg(g, `<circle class="u-ring-on" style="stroke-width:44px" cx="${C.x}" cy="${C.y}" r="${R}" pathLength="100" stroke-dasharray="100 100" stroke-dashoffset="100" transform="rotate(-90 ${C.x} ${C.y})"/>`);
  R7.show(on, T.b[1]); A(on.querySelector('circle'), [{strokeDashoffset: 100}, {strokeDashoffset: 0}], T.b[1], T.hit - T.b[1], {e: 'cubic-bezier(.4,0,.2,1)', f: 'both'});
  const ic = node(g, C.x - 50, C.y - 50, 100, 100, 'u-label', ICO(it.icon, 86)); ic.p.style.display = 'flex'; ic.p.style.alignItems = 'center'; ic.p.style.justifyContent = 'center';
  K.enter(ic.o, T.b[0] + .2, 'pop'); K.punch(ic.p, T.hit);
  if (it.label) R4.word(K, g, it.label, C.x, C.y + R + 30, 42, T.hit, 320);
});

/* 7 · B01 ตัวเลขเด่น · a stats card: the number counts up to the value while a small trend line draws under it */
R3.both('B01', 'stat', 'การ์ดสถิติ ตัวเลขนับขึ้น เส้นกราฟวาดตาม', (K, s, T, g) => {
  const W = 440, H = 250, X = 300 - W / 2, Y = 40, down = s.dir === 'down';
  const c = R9.card(g, X, Y, W, H, 26); K.enter(c.o, T.b[0], 'rise');
  R9.ico(c.p, s.icon ?? (R2.money(s) ? 'wallet' : 'chart-line'), 46, 46, 34); R9B.skel(c.p, 80, 40, 140);
  const size = R2.fitSize(s.value, 300, 92);
  R9B.count(K, s, c.p, txt => { const nb = div('left:28px;top:76px;height:96px;display:flex;align-items:baseline;gap:14px;white-space:nowrap', c.p);
    const v = document.createElement('span'); v.className = 'u-num'; v.style.fontSize = size + 'px'; v.textContent = txt; nb.appendChild(v);
    if (s.unit) { const u = document.createElement('span'); u.className = 'u-label'; u.style.fontSize = '34px'; u.textContent = s.unit; nb.appendChild(u); }
    return nb; }, T.b[1], T.hit);
  const ln = R8.svg(c.p, `<path class="u-acc-line" style="stroke-width:8px" d="${down ? 'M28 190L110 196L180 206L260 214L330 226L410 232' : 'M28 232L110 222L180 226L260 206L330 196L410 178'}"/>`);
  R7.show(ln, T.b[1]); K.draw(ln.querySelector('path'), T.b[1], T.hit - T.b[1]);
});

/* 8 · B01 ตัวเลขเด่น · rolling number wheels: they roll and stop one after another, the last on the key word */
R3.both('B01', 'odometer', 'ล้อตัวเลขหมุนแล้วหยุดทีละหลัก', (K, s, T, g) => {
  const ch = graphemes(String(s.value)).slice(0, 8), isD = c => /\d/.test(c), wk = ch.map(c => isD(c) ? 1 : .42), U = wk.reduce((a, b) => a + b, 0);
  const tw = Math.min(84, (500 - 10 * (ch.length - 1)) / U), th = 150, step = 92, W = U * tw + 10 * (ch.length - 1), Y = s.unit ? 70 : 96, nd = ch.filter(isD).length;
  let x = 300 - W / 2, j = 0;
  ch.forEach((c, i) => {
    const w = tw * wk[i];
    if (isD(c)) {
      const t = R9.card(g, x, Y, w, th, 14); t.p.style.overflow = 'hidden';
      t.p.style.webkitMaskImage = t.p.style.maskImage = 'linear-gradient(transparent 0, #000 32%, #000 68%, transparent 100%)';
      const d = +c, col = div(`left:0;top:0;width:${w}px;height:${th}px`, t.p);
      col.className = 'u-decor';      // the rolling digits hide outside the wheel: a style that frames what is drawn (gold) must not count them
      for (let k = -12; k <= 1; k++) { const e = div(`left:0;top:${th / 2 - 50 + k * step}px;width:${w}px;height:100px;display:flex;align-items:center;justify-content:center;font-size:76px`, col);
        e.className = 'u-num'; e.textContent = String(((d + k) % 10 + 10) % 10); }
      const stop = T.hit - .14 * (nd - 1 - j);
      A(col, [{transform: `translateY(${12 * step}px)`}, {transform: 'none'}], T.b[1], stop - T.b[1], {e: 'cubic-bezier(.2,.6,.3,1)', f: 'both'});
      K.enter(t.o, T.b[0] + i * .05, 'rise'); j++;
    } else { const e = div(`left:${x}px;top:${Y}px;width:${w}px;height:${th}px;display:flex;align-items:center;justify-content:center;font-size:76px`, g); e.className = 'u-num'; e.textContent = c; K.enter(e, T.b[0], 'lead'); }
    x += w + 10;
  });
  if (s.unit) R4.word(K, g, s.unit, 300, Y + th + 16, 40, T.hit, 300);
});

/* 9 · B02 เพิ่มขึ้น / ลดลง · a donut chart: the accent part grows round (down = it shrinks to a red sliver) */
R3.both('B02', 'donut', 'กราฟโดนัท ส่วนสีเน้นขยายหรือหด', (K, s, T, g) => {
  const up = s.dir !== 'down', v0 = up ? 12 : 82, v1 = up ? 78 : 14, C = {x: 300, y: 170}, R = 120;
  const tr = R8.svg(g, `<circle class="u-ring" style="stroke-width:56px" cx="${C.x}" cy="${C.y}" r="${R}"/>`); K.enter(tr, T.b[0], 'pop');
  const arc = cls => R8.svg(g, `<circle class="u-ring-on" style="stroke-width:56px${cls ? ';stroke:var(--neg)' : ''}" cx="${C.x}" cy="${C.y}" r="${R}" pathLength="100" stroke-dasharray="100 100" stroke-dashoffset="${100 - v0}" transform="rotate(-90 ${C.x} ${C.y})"/>`);
  const a = arc(false); K.enter(a, T.b[0] + .1, 'pop');
  A(a.querySelector('circle'), [{strokeDashoffset: 100 - v0}, {strokeDashoffset: 100 - v1}], T.b[1], T.hit - T.b[1], {e: 'cubic-bezier(.4,0,.2,1)', f: 'both'});
  if (!up) { const r = arc(true); r.querySelector('circle').setAttribute('stroke-dashoffset', 100 - v1); r.style.opacity = 0; K.fade(r, T.hit, 0, 1, {hold: true}); }
  const ic = R9.ico(g, s.item?.icon ?? (up ? 'trending-up' : 'trending-down'), C.x, C.y - 6, 70); K.enter(ic, T.b[0] + .2, 'pop');
  const ar = R9.ico(g, up ? 'arrow-up' : 'arrow-down', C.x + 190, C.y - R + 20, 54); K.enter(ar, T.hit, 'pop');
});

/* 10 · B02 เพิ่มขึ้น / ลดลง · a card of dots: more and more light up (down = they go dark until a few red ones are left) */
R3.both('B02', 'dots', 'การ์ดจุด จุดสว่างเพิ่มขึ้นหรือดับลง', (K, s, T, g) => {
  const up = s.dir !== 'down', cols = 8, rows = 4, N = cols * rows, on = up ? 26 : 5, start = up ? 0 : 26, W = 450, H = 280, X = 300 - W / 2, Y = 30;
  const c = R9.card(g, X, Y, W, H, 26); K.enter(c.o, T.b[0], 'rise');
  if (s.item) R9.ico(c.p, s.item.icon, 46, 44, 34); R9B.skel(c.p, 80, 38, 130);
  const tr = R9.ico(c.p, up ? 'trending-up' : 'trending-down', W - 46, 44, 34); K.enter(tr, T.hit, 'pop');
  const d = 34, gx = (W - 56 - cols * d) / (cols - 1), t0 = T.b[1], t1 = T.hit - .3;
  for (let i = 0; i < N; i++) {
    const x = 28 + (i % cols) * (d + gx), y = 90 + Math.floor(i / cols) * (d + 13);
    div(`left:${x}px;top:${y}px;width:${d}px;height:${d}px;border-radius:50%;background:var(--tr)`, c.p);
    const lit = () => { const e = node(c.p, x, y, d, d, 'u-badge u-acc'); e.p.style.borderRadius = '50%'; e.p.style.boxShadow = 'none'; return e; };
    if (up && i < on) { const e = lit(); A(e.o, [{opacity: 0, transform: 'scale(.5)'}, {opacity: 1, transform: 'none'}], t0 + (t1 - t0) * i / (on - 1), .4, {e: EASE.smooth}); }
    if (!up && i < start) { const e = lit(); if (i >= on) A(e.o, [{opacity: 1}, {opacity: 0}], t0 + (t1 - t0) * (start - 1 - i) / (start - on - 1), .4, {f: 'forwards'});
      else { const r = node(c.p, x, y, d, d, 'u-badge u-neg'); r.p.style.borderRadius = '50%'; r.p.style.boxShadow = 'none'; r.o.style.opacity = 0; K.fade(r.o, T.hit, 0, 1, {hold: true}); } }
  }
});

/* 11 · B14 ประโยคเด็ด · a chat of grey messages; the line to remember is pinned on top on the key word */
R3.both('B14', 'pinned', 'ข้อความถูกปักหมุดไว้บนสุด', (K, s, T, g) => {
  const it = s.idea ?? {icon: 'sparkles'}, X = 70, W = 460;
  [[160, 300], [214, 360], [268, 240]].forEach(([y, w], k) => { const b = div(`left:${X + (k % 2 ? W - w : 0)}px;top:${y}px;width:${w}px;height:40px;border-radius:20px;background:var(--tr)`, g); K.enter(b, T.b[0] + k * .15, 'rise'); });
  const pn = R9.card(g, X - 10, 26, W + 20, 108, 22);
  const land = T.hit; A(pn.o, [{opacity: 0, transform: 'translateY(150px) scale(.92)'}, {opacity: 1, transform: 'none'}], land - .7, .7, {e: EASE.smooth, f: 'both'});
  const pb = R9.acc(pn.p, 18, 24, 60, 60, 16); R9.ico(pb.p, 'pin', 30, 30, 32, 'u-bubble-text'); K.punch(pb.p, land + .05);
  if (s.idea?.label) R6.wordL(K, pn.p, it.label, 98, 22, 46, null, W - 100); else R9.ico(pn.p, it.icon, (W + 20) / 2, 54, 50);
});

/* 12 · B14 ประโยคเด็ด · a post with the line on it; on the key word its save button fills */
R3.both('B14', 'post', 'โพสต์คำคม ปุ่มบันทึกถูกกด', (K, s, T, g) => {
  const it = s.idea ?? {icon: 'sparkles'}, W = 440, H = 280, X = 300 - W / 2, Y = 24;
  const c = R9.card(g, X, Y, W, H, 26); K.enter(c.o, T.b[0], 'rise');
  const av = R9.acc(c.p, 24, 22, 52, 52, '50%'); R9.ico(av.p, it.icon, 26, 26, 28, 'u-bubble-text'); R9B.skel(c.p, 92, 40, 140);
  if (s.idea?.label) { const w = R4.word(K, c.p, it.label, W / 2, 108, 50, null, W - 50); R7.write(w, T.b[1], .8); } else R9.ico(c.p, it.icon, W / 2, 140, 70);
  ['heart', 'message-circle', 'send'].forEach((ic, k) => R9.ico(c.p, ic, 44 + k * 56, H - 40, 32));
  const out = R9.ico(c.p, 'bookmark', W - 44, H - 40, 40); R7.hide(out, T.hit);
  const sv = node(c.p, W - 64, H - 60, 40, 40, '', `<svg width="40" height="40" viewBox="0 0 24 24" style="fill:var(--ac);stroke:var(--ac-stroke, var(--ac));stroke-width:2;stroke-linejoin:round">${ICONS.bookmark}</svg>`);
  K.enter(sv.o, T.hit, 'pop');
});

/* 13 · B15 ปิดคลิป · the action's icon in a big circle; a ring is drawn all the way round it, landing on the key word */
R3.both('B15', 'circle', 'ไอคอนในวงกลมใหญ่ วงแหวนวาดรอบจนครบ', (K, s, T, g) => {
  const [icon] = R3.ACT[s.action] ?? R3.ACT.follow, C = {x: 300, y: s.label ? 140 : 170}, R = 96;
  const n = R9.card(g, C.x - R, C.y - R, 2 * R, 2 * R, '50%'); K.enter(n.o, T.b[0], 'pop'); R9.ico(n.p, icon, R, R, 90);
  const rg = R8.svg(g, `<circle class="u-acc-line" style="stroke-width:12px" cx="${C.x}" cy="${C.y}" r="${R + 22}" transform="rotate(-90 ${C.x} ${C.y})"/>`);
  R7.show(rg, T.b[1]); K.draw(rg.querySelector('circle'), T.b[1], T.hit - T.b[1]);
  K.punch(n.p, T.hit);
  if (s.label) R4.word(K, g, s.label, 300, C.y + R + 34, 46, T.hit, 320);
});

/* 14 · B15 ปิดคลิป · a long button fills from left to right; when full its icon turns into "done" */
R3.both('B15', 'press', 'ปุ่มยาวเติมสีจากซ้ายไปขวา แล้วกลายเป็นกดแล้ว', (K, s, T, g) => {
  const [icon, done] = R3.ACT[s.action] ?? R3.ACT.follow, W = 420, H = 120, X = 300 - W / 2, Y = 110, ix = s.label ? 80 : W / 2;
  const bg = node(g, X, Y, W, H, 'u-badge u-soft'); bg.p.style.borderRadius = H / 2 + 'px'; K.enter(bg.o, T.b[0], 'pop');
  R9.ico(bg.p, icon, ix, H / 2, 54); if (s.label) R6.wordL(K, bg.p, s.label, 128, H / 2 - 30, 46, null, W - 160);
  const b = R9.acc(g, X, Y, W, H, H / 2);
  R9.ico(b.p, done, ix, H / 2, 54, 'u-bubble-text');
  if (s.label) { const w = R6.wordL(K, b.p, s.label, 128, H / 2 - 30, 46, null, W - 160); w.classList.add('u-bubble-text'); }
  A(b.o, [{clipPath: `inset(0 100% 0 0 round ${H / 2}px)`}, {clipPath: `inset(0 0 0 0 round ${H / 2}px)`}], T.b[2] - .2, T.hit - T.b[2] + .2, {e: 'cubic-bezier(.4,0,.2,1)', f: 'both'});
  K.punch(b.p, T.hit + .05);
});

/* ================= sentences to try (r9b.*; not Friend's script; one per variant, plus the other forms) ================= */
SENTENCE('r9b.diet', {cat: 'B09', name: 'อาทิตย์แรก เดือนแรก สามเดือน', say: ['ลดน้ำหนักมาครบ', 'สามเดือนแล้ว'],
  points: [{icon: 'calendar', label: 'อาทิตย์แรก'}, {icon: 'calendar-days', label: 'เดือนแรก'}, {icon: 'calendar-check', label: 'สามเดือน'}], at: 2});
SENTENCE('r9b.half', {cat: 'B09', name: 'เพิ่งผ่านครึ่งทาง', say: ['ตอนนี้เพิ่งผ่านมา', 'เดือนแรก'],
  points: [{icon: 'flag', label: 'วันแรก'}, {icon: 'calendar-days', label: 'เดือนแรก'}, {icon: 'trophy', label: 'ปีแรก'}], at: 1});
SENTENCE('r9b.price', {cat: 'B13', name: 'เคล็ดลับคือตั้งราคาลงท้ายเก้า', say: ['เคล็ดลับคือ', 'ราคาลงท้ายเก้า'], secret: {icon: 'tag', label: 'ลงท้ายเก้า'}});
SENTENCE('r9b.cash', {cat: 'B16', name: 'กระแสเงินสดคือเงินเข้าออก', say: ['กระแสเงินสดก็คือ', 'เงินเข้าออก'],
  term: {icon: 'wallet', label: 'กระแสเงินสด'}, means: [{icon: 'arrow-down-left', label: 'เงินเข้า'}, {icon: 'arrow-up-right', label: 'เงินออก'}]});
SENTENCE('r9b.friend', {cat: 'B20', name: 'เพื่อนสนิท', say: ['เราสองคนเป็น', 'เพื่อนสนิทกัน'], a: {icon: 'user', label: 'ผม'}, b: {icon: 'user', label: 'ต้น'}, label: 'เพื่อนสนิท'});
SENTENCE('r9b.ex', {cat: 'B20', name: 'แฟนเก่า เลิกกันแล้ว', say: ['สุดท้ายก็', 'เลิกกันไป'], a: {icon: 'user', label: 'ผม'}, b: {icon: 'user', label: 'เขา'}, label: 'แฟนเก่า', cut: true});
SENTENCE('r9b.cafe', {cat: 'B21', name: 'คาเฟ่ชั้นสอง ริมหน้าต่าง', say: ['คาเฟ่นี้อยู่ชั้นสอง', 'ริมหน้าต่าง'], place: {icon: 'coffee', label: 'คาเฟ่บ้านไม้'}, spots: [{icon: 'layers', label: 'ชั้นสอง'}, {icon: 'sun', label: 'ริมหน้าต่าง'}]});
SENTENCE('r9b.million', {cat: 'B08', name: 'ยอดขายถึงล้าน', say: ['ปีนี้ยอดขาย', 'แตะหลักล้าน'], goal: {icon: 'trophy', label: 'หลักล้าน'}});
SENTENCE('r9b.fans', {cat: 'B01', name: 'ผู้ติดตาม 12,000 คน', say: ['ตอนนี้มีคนติดตาม', '12,000 คน'], value: '12,000', unit: 'คน', icon: 'users'});
SENTENCE('r9b.cost', {cat: 'B01', name: 'ต้นทุนเหลือ 35%', say: ['ต้นทุนลดลงเหลือ', '35%'], value: '35%', dir: 'down', icon: 'coins'});
SENTENCE('r9b.orders', {cat: 'B02', name: 'ออเดอร์เพิ่มขึ้น', say: ['พอไลฟ์ทุกวัน ออเดอร์', 'เพิ่มขึ้นเรื่อยๆ'], dir: 'up', item: {icon: 'package'}, n: 3});
SENTENCE('r9b.save', {cat: 'B02', name: 'เงินเก็บหายเกือบหมด', say: ['เดือนเดียว เงินเก็บ', 'หายไปเกือบหมด'], dir: 'down', item: {icon: 'piggy-bank'}, n: 4, keep: 1});
SENTENCE('r9b.daily', {cat: 'B14', name: 'ทำทุกวันชนะ', say: ['จำไว้นะ', 'ทำทุกวันชนะ'], idea: {icon: 'repeat', label: 'ทำทุกวันชนะ'}});
SENTENCE('r9b.learn', {cat: 'B14', name: 'ความผิดพลาดคือครู', say: ['ความผิดพลาดคือ', 'ครูที่ดีที่สุด'], idea: {icon: 'graduation-cap', label: 'ครูที่ดีที่สุด'}});
SENTENCE('r9b.follow', {cat: 'B15', name: 'กดติดตาม', say: ['อย่าลืม', 'กดติดตามนะ'], action: 'follow', label: 'กดติดตาม'});
SENTENCE('r9b.keep', {cat: 'B15', name: 'กดบันทึก', say: ['ใครยังไม่ว่าง', 'กดบันทึกไว้'], action: 'save', label: 'บันทึกไว้'});
