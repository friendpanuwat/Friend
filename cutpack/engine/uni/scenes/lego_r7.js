/* =====================================================================
   CutPack · uni · LEGO round 7 (Friend 2026-11-10: "ก. เพิ่มร่างทุกหมวดให้ถึง 20" then "เอาตามนี้ทั้งหมด เริ่มได้เลยครับ"):
   two new variants for each of the ten categories with the fewest, every one a different kind of picture
   (Friend: "อยากได้ความหลากหลาย", LESSONS 35). Same slots as before (cat_ai.py), same rules (R3.both: one composition on
   the 600 × 340 small canvas, scaled 1.6× full screen; nothing past x 550 below y 200; words only from the slots).
     B01 ป้ายตัวเลขพลิกแบบสนามบิน (flip) · เครื่องคิดเลข (calc)
     B02 กราฟเส้นพุ่งขึ้นหรือดิ่งลง (line) · ลูกโป่งพองขึ้นหรือแฟบลง (balloon)
     B04 สายพาน ของเลื่อนผ่านทีละจุด (belt) · กองการ์ด หยิบออกทีละใบ (deck)
     B09 นาฬิกาทราย (sand) · พระอาทิตย์เคลื่อนข้ามฟ้า (sun)
     B10 คนที่ใช่เดินเข้าประตู (door) · หน้าโปรไฟล์ (profile)
     B11 ซองจดหมาย (letter) · ไมค์สัมภาษณ์ (mic)
     B13 บัตรขูด (scratch) · กระซิบ (whisper)
     B14 ตราประทับ (stamp) · ป้ายไฟนีออน (neon)
     B15 ม่านปิดฉาก (curtain) · ลูกศรวาดด้วยมือ (arrow)
     B16 กระดานเขียนคำ (board) · เครื่องเอกซเรย์ (xray)
   ===================================================================== */
const R7 = {
  /* a thing seen from t on (hidden before) / gone from t on */
  show(el, t) { A(el, [{opacity: 0}, {opacity: 1}], t, .01, {f: 'both'}); },
  hide(el, t) { A(el, [{opacity: 1}, {opacity: 0}], t, .01, {f: 'forwards'}); },
  /* LG.lightUp with any tone: the new holder appears solid in its middle and grows over the old one (the icon never fades) */
  up(K, parent, icon, cx, cy, size, t, shape = 'tile', tone = 'acc') {
    const ok = K.badge(parent, icon, cx, cy, size, null, {tone, shape});
    A(ok.o, [{opacity: 0}, {opacity: 1}], t, .04);
    K.move(ok.m, t, 'scale(.72)', 'none', {hold: true, kind: 'snap'});
    ok.done = LG.arrive('snap', t); K.punch(ok.p, ok.done); return ok;
  },
  /* a word written left to right (revealed, not faded) from t */
  write(el, t, d = .45) { A(el, [{clipPath: 'inset(-12px 100% -12px -12px)'}, {clipPath: 'inset(-12px -12px -12px -12px)'}], t, d, {e: 'linear', f: 'both'}); },
  /* time when step k of n lands, so that step `at` lands on the key word (later steps follow it) */
  steps(T, n, at, t0) {
    return [...Array(n)].map((_, k) => k <= at ? (at === 0 ? T.hit : t0 + (T.hit - t0) * k / at) : T.hit + .5 * (k - at));
  },
  /* a plain holder without an icon (a key, a coin, a box) */
  plain(parent, x, y, w, h, tone, r) { const n = node(parent, x, y, w, h, `u-badge u-${tone}`); n.p.style.borderRadius = r; return n; },
  rnd: (seed, k) => hashOf(seed + ':' + k) % 10,
};

/* ================= B01 ตัวเลขเด่น: value, unit?, icon?, dir?, money? ================= */
/* 5 · a split-flap board: every digit flips through numbers and stops one after another on the key word */
R3.both('B01', 'flip', 'ป้ายตัวเลขพลิกแบบสนามบิน', (K, s, T, g) => {
  const ch = [...String(s.value)].slice(0, 8), isD = c => /\d/.test(c), n = ch.length, gap = 8;
  const wk = ch.map(c => /[\d%A-Za-z]/.test(c) ? 1 : .45), units = wk.reduce((a, b) => a + b, 0);
  const tw = Math.min(86, (480 - gap * (n - 1)) / units), th = Math.round(Math.min(120, tw * 1.42));
  const W = units * tw + gap * (n - 1), x0 = 300 - W / 2, Y = s.icon ? 168 : 146;
  if (s.icon) K.badge(g, s.icon, 300, 46, 66, T.b[0], {tone: 'main'});
  const row = node(g, x0 - 10, Y - th / 2 - 10, W + 20, th + 20, '');
  const stop = ch.map((_, i) => T.hit - .1 * (n - 1 - i) - .02);
  let x = 10;
  ch.forEach((c, i) => {
    const w = tw * wk[i], tile = R2.card(node(row.p, x, 10, w, th, 'u-panel')); tile.p.style.borderRadius = '12px';
    K.enter(tile.o, T.b[0] + .1 + i * .05, 'pop');
    const glyph = (txt, t0, t1) => {
      const e = div(`left:0;top:0;width:${w}px;height:${th}px;display:flex;align-items:center;justify-content:center;font-size:${Math.round(th * .74)}px`, tile.p);
      e.className = 'u-num'; e.textContent = txt;
      if (t0 != null) R7.show(e, t0); if (t1 != null) R7.hide(e, t1);
    };
    if (!isD(c)) glyph(c, null, null);
    else {
      const flips = []; for (let t = T.b[1]; t < stop[i] - .06; t += .11) flips.push(t);
      glyph(String(R7.rnd(s.value, i)), null, flips[0] ?? stop[i]);                        // a digit before it starts
      flips.forEach((t, j) => {
        glyph(String(R7.rnd(s.value, i * 31 + j + 1)), t, flips[j + 1] ?? stop[i]);
        A(tile.m, [{transform: 'scaleY(1)'}, {transform: 'scaleY(.55)', offset: .5}, {transform: 'scaleY(1)'}], t - .05, .1, {f: 'none'});
      });
      glyph(c, stop[i], null);
    }
    const seam = div(`left:0;top:${th / 2 - 1.5}px;width:${w}px;height:3px`, tile.p); seam.className = 'u-skel u-decor';
    x += w + gap;
  });
  K.punch(row.p, T.hit); R1.ripple(K, row, T.hit + .05, {r: 18});
  if (s.unit) R4.word(K, g, s.unit, 300, Y + th / 2 + 14, 40, T.hit + .12, 420);
  if (s.dir) { const d = K.badge(g, s.dir === 'down' ? 'trending-down' : 'trending-up', Math.min(x0 + W + 30, 560), Y - th / 2 - 22, 60, T.hit + .2, {tone: 'acc', shape: 'round'}); K.punch(d.p, T.hit + .5); }
});

/* 6 · a calculator: keys are pressed one by one, the number grows on the screen, "=" lands it on the key word */
R3.both('B01', 'calc', 'เครื่องคิดเลข กดแล้วตัวเลขขึ้นจอ', (K, s, T, g) => {
  const C = {x: 116, y: 12, w: 250, h: 316}, v = String(s.value);
  const body = R2.card(node(g, C.x, C.y, C.w, C.h, 'u-panel')); body.p.style.borderRadius = '30px'; K.enter(body.o, T.b[0], 'rise');
  const scr = node(body.p, 20, 20, C.w - 40, 88, 'u-track'); scr.p.style.borderRadius = '16px'; K.enter(scr.o, T.b[0] + .1, 'pop');
  const kw = 62, kh = 48, keys = [];
  for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) {
    const last = r === 2 && c === 2, k = R7.plain(body.p, 20 + c * (kw + 12), 126 + r * (kh + 12), kw, kh, last ? 'acc' : 'soft', '14px');
    if (last) k.p.innerHTML = ICO('equal', 28);
    k.o.classList.add('u-decor'); K.enter(k.o, T.b[0] + .2 + (r * 3 + c) * .03, 'pop'); keys.push(k);
  }
  /* what the screen shows: 0, then the number growing digit by digit */
  const digits = [...v].reduce((a, c, i) => /\d/.test(c) ? a.concat(i) : a, []).slice(0, 6);
  const shown = ['0'].concat(digits.map((d, k) => k === digits.length - 1 ? v : v.slice(0, d + 1)));
  const press = LG.spread(T.b[1], T.hit - .32, Math.max(1, digits.length)), at = [T.b[0] + .2].concat(press);
  const fs = R2.fitSize(v, 180, 62);
  shown.forEach((txt, k) => {
    const e = div(`left:0;top:0;width:${C.w - 64}px;height:88px;display:flex;align-items:center;justify-content:flex-end;font-size:${fs}px`, scr.p);
    e.className = 'u-num'; e.textContent = txt; R7.show(e, at[k]); if (k < shown.length - 1) R7.hide(e, at[k + 1]);
  });
  press.forEach((t, k) => { const key = keys[R7.rnd(v, k) % 8]; K.punch(key.p, t - .05);
    const lit = R7.plain(key.p, 0, 0, kw, kh, 'acc', '14px'); lit.o.style.opacity = 0; A(lit.o, [{opacity: 0}, {opacity: 1, offset: .15}, {opacity: 1, offset: .6}, {opacity: 0}], t - .05, .3, {f: 'none'}); });
  K.punch(keys[8].p, T.hit - .12);
  K.punch(scr.p, T.hit); R1.ripple(K, scr, T.hit + .05);
  const iy = s.unit ? 96 : 130;
  if (s.icon) K.badge(g, s.icon, 466, iy, 104, T.b[0] + .3, {tone: 'acc'});
  if (s.unit) R4.word(K, g, s.unit, 466, s.icon ? 158 : 110, 42, T.hit + .12, 150);
});

/* ================= B02 เพิ่มขึ้น / ลดลง: dir, item {icon}, center? {icon}, end? {icon} ================= */
/* 4 · a line chart draws itself up (or down); the thing pops out at its tip on the key word */
R3.both('B02', 'line', 'กราฟเส้นพุ่งขึ้นหรือดิ่งลง', (K, s, T, g) => {
  const up = s.dir !== 'down', PW = 470, PH = 308, P = R3.panel(K, g, 50, 16, PW, PH, T.b[0]);
  [76, 152, 228].forEach((y, i) => { const l = div(`left:36px;top:${y}px;width:398px;height:3px;border-radius:2px;transform-origin:0 50%`, P.p); l.className = 'u-skel u-decor'; K.grow(l, T.b[0] + .15 + i * .05); });
  const xs = [40, 118, 190, 268, 340, 420], ys = up ? [252, 204, 224, 152, 172, 78] : [78, 126, 106, 184, 164, 248];
  const ln = R6.line(K, P.p, 'M' + xs.map((x, i) => `${x} ${ys[i]}`).join('L'), T.b[1], T.hit - T.b[1], PW, PH);
  const path = ln.querySelector('path'); path.classList.add('u-thick');
  const pts = R6B.along(path, 40), dot = R7.plain(P.p, -13, -13, 26, 26, 'acc', '50%');
  A(dot.m, pts.map(p => ({transform: `translate(${p.x.toFixed(1)}px,${p.y.toFixed(1)}px)`})), T.b[1], T.hit - T.b[1], {e: ST.motion.draw.e, f: 'both'});
  R7.show(dot.o, T.b[1]); R7.hide(dot.o, T.hit + .05);
  const tip = K.badge(P.p, s.item.icon, xs[5], ys[5], 88, T.hit, {tone: 'acc', shape: s.item.shape ?? 'round'});
  const land = R6.at('pop', T.hit);
  R1.ripple(K, tip, land);
  if (s.center) K.badge(P.p, s.center.icon, 60, up ? 52 : 256, 58, T.b[0] + .2, {tone: 'main'});
  if (s.end) K.sat(P.p, s.end.icon, 268, up ? 262 : 48, 64, T.after, {tone: s.end.tone ?? 'main', shape: 'round', k: .5});
});

/* 5 · a balloon with the thing on it blows up step by step (or goes flat and shakes) */
R3.both('B02', 'balloon', 'ลูกโป่งพองขึ้นหรือแฟบลง', (K, s, T, g) => {
  const up = s.dir !== 'down', S = 190, bot = 214, ends = s.center ? 266 : 326;
  R6.line(K, g, `M300 230C286 248 314 ${(230 + ends) / 2 + 10} 300 ${ends}`, T.b[0] + .1, .4).querySelector('path').classList.add('u-thin');
  const knot = div('left:0;top:0;width:600px;height:340px', g, `<svg width="600" height="340"><path class="${up ? 'ac' : 'sd'}" d="M300 212L289 232H311Z"/></svg>`);
  K.enter(knot, T.b[0], 'pop');
  const b = K.badge(g, s.item.icon, 300, bot - S / 2, S, T.b[0], {tone: up ? 'acc' : 'main', shape: 'round'});
  b.m.style.transformOrigin = '50% 100%';
  const k = up ? [.5, .67, .83, 1] : [1, .84, .68, .52], at = [T.b[1], T.b[2], T.hit];
  K.move(b.m, T.b[0] - .01, `scale(${k[0]})`, `scale(${k[0]})`, {hold: true});
  at.forEach((t, i) => K.move(b.m, t, `scale(${k[i]})`, `scale(${k[i + 1]})`, {kind: 'snap'}));
  const land = R6.at('snap', T.hit);
  if (up) { R1.ripple(K, b, land); K.float(b, land + .3); } else K.shake(b.p, land);
  if (s.center) K.badge(g, s.center.icon, 300, 298, 64, T.b[0] + .2, {tone: 'main'});
  if (s.end) K.sat(g, s.end.icon, 440, 92, 70, T.after, {tone: s.end.tone ?? 'main', shape: 'round', k: .5});
});

/* ================= B04 ขั้นตอน: items [{icon, label?}] (3), mark? {at, how} ================= */
/* 3 · a conveyor belt: a box rides under each step in turn; the marked step lights up (or gets ✓ / ✗) as the box reaches it */
R3.both('B04', 'belt', 'สายพาน ของเลื่อนผ่านทีละจุด', (K, s, T, g) => {
  const its = s.items.slice(0, 3), n = its.length, xs = {1: [300], 2: [190, 410], 3: [130, 300, 470]}[n];
  const SY = 74, SS = 84, BY = 258, mk = s.mark ?? {at: n - 1, how: 'light'}, at = Math.min(mk.at ?? n - 1, n - 1);
  const belt = node(g, 50, BY - 22, 480, 44, 'u-track'); belt.p.style.borderRadius = '22px'; K.enter(belt.o, T.b[0], 'rise');
  const dash = div('left:0;top:0;width:600px;height:340px', g, `<svg width="600" height="340"><path class="ln u-thin u-dash" d="M86 ${BY}H494"/>` +
    `<circle class="ln u-thin" cx="74" cy="${BY}" r="12"/><circle class="ln u-thin" cx="506" cy="${BY}" r="12"/></svg>`);
  dash.classList.add('u-decor'); K.enter(dash, T.b[0] + .1, 'pop');
  A(dash.querySelector('.u-dash'), [{strokeDashoffset: 0}, {strokeDashoffset: -240}], T.b[1], T.t1 - T.b[1], {e: 'linear'});
  const st = its.map((it, i) => {
    const b = K.badge(g, it.icon, xs[i], SY, SS, T.b[0] + .1 + i * .1, {tone: it.tone ?? 'main', shape: it.shape ?? 'tile'});
    if (it.label) R4.word(K, g, it.label, xs[i], SY + SS / 2 + 8, 30, T.b[0] + .2 + i * .1, 150);
    return b;
  });
  /* the box: arrives under step k at arr[k], so the marked step is reached on the key word */
  const arr = R7.steps(T, n, at, T.b[1] + .45), box = R7.plain(g, -28, BY - 22 - 58, 56, 56, 'acc', '12px');
  const kf = [{t: T.b[1] - .1, x: 82}];
  arr.forEach((t, k) => { kf.push({t: Math.max(kf.at(-1).t + .05, t - .42), x: kf.at(-1).x}); kf.push({t, x: xs[k]}); });
  const t0 = kf[0].t, t1 = kf.at(-1).t;
  A(box.m, kf.map(p => ({transform: `translateX(${p.x}px)`, offset: (p.t - t0) / (t1 - t0), easing: 'cubic-bezier(.45,0,.3,1)'})), t0, t1 - t0, {f: 'both'});
  K.enter(box.o, t0 - .15, 'pop');
  arr.forEach((t, k) => {
    K.punch(box.p, t);
    if (k !== at) { K.punch(st[k].p, t); return; }
    const it = its[k];
    if (mk.how === 'check') { K.punch(st[k].p, t); K.mark(g, 'check', xs[k] + SS / 2 - 2, SY - SS / 2 + 2, 46, t); }
    else if (mk.how === 'cross') K.mark(g, 'cross', xs[k], SY, 72, t);
    else { const L = R7.up(K, g, it.icon, xs[k], SY, SS, t, it.shape ?? 'tile'); R1.ripple(K, L, L.done); }
  });
});

/* 4 · a deck of cards: the top card shows a step, then flies to the done pile and the next one shows */
R3.both('B04', 'deck', 'กองการ์ด หยิบออกทีละใบ', (K, s, T, g) => {
  const its = s.items.slice(0, 3), n = its.length, mk = s.mark ?? {at: n - 1, how: 'light'}, at = Math.min(mk.at ?? n - 1, n - 1);
  const D = {x: 262, y: 20, w: 236, h: 248};
  /* card k is on top from show[k]; card `at` is on top on the key word */
  const show = [...Array(n)].map((_, k) => k <= at ? LG.spread(T.b[0], T.hit - .25, at + 1)[k] : T.hit + .55 * (k - at));
  /* the cards still under the top one, as edges below it (only the top card is a card: no card shows through another) */
  for (let j = 0; j < n - 1; j++) {
    const e = div(`left:${D.x + 14 + j * 10}px;top:${D.y + D.h + 4 + j * 9}px;width:${D.w - 28 - j * 20}px;height:7px;border-radius:4px`, g);
    e.className = 'u-skel u-decor'; K.enter(e, T.b[0] + .1, 'pop'); R7.hide(e, show[n - 1 - j]);
  }
  const cards = [];
  its.forEach((it, k) => {
    const c = R2.card(node(g, D.x, D.y, D.w, D.h, 'u-panel')); c.p.style.borderRadius = '26px';
    if (k === 0) K.enter(c.o, show[0], 'rise');
    else { R7.show(c.o, show[k]); K.move(c.m, show[k], 'translateY(16px)', 'none', {hold: true, kind: 'snap'}); }
    K.chip(c.p, String(k + 1), 18, 16, null, {tone: 'acc', size: 30});
    const b = K.badge(c.p, it.icon, D.w / 2, 112, 112, null, {tone: it.tone ?? 'main', shape: it.shape ?? 'tile'});
    if (it.label) R4.word(K, c.p, it.label, D.w / 2, 182, 34, null, D.w - 30);
    if (k < n - 1) {                                       // to the done pile on the left (the one before it leaves the pile)
      const go = show[k + 1] - .34;                         // it is clear of the deck before the next card shows (glass: no card through another)
      K.move(c.m, go, 'none', 'translate(-218px,46px) scale(.48) rotate(-8deg)');
      if (k > 0) K.fade(cards[k - 1].o, go + .15, 1, 0);   // the old one leaves the pile before this one lands on it
    }
    cards.push({c, b, o: c.o});
  });
  const top = cards[at], it = its[at];
  if (mk.how === 'check') { K.punch(top.c.p, T.hit); K.mark(top.c.p, 'check', D.w - 36, 36, 50, T.hit); }
  else if (mk.how === 'cross') K.mark(top.c.p, 'cross', D.w / 2, 112, 84, T.hit);
  else { const L = R7.up(K, top.c.p, it.icon, D.w / 2, 112, 112, T.hit, it.shape ?? 'tile'); R1.ripple(K, L, L.done); }
});

/* ================= B09 เวลา: points [{icon, label?}] (3), at?, result? {icon, tone?} ================= */
/* 3 · an hourglass: the sand runs down while the times are reached one by one; what the time brought lands in the bottom */
R3.both('B09', 'sand', 'นาฬิกาทราย ทรายไหลลง', (K, s, T, g) => {
  const pts = s.points.slice(0, 3), n = pts.length, at = Math.min(s.at ?? n - 1, n - 1), cx = 170, top = 34, mid = 172, bot = 310;
  const hg = R6.group(g); hg.style.transformOrigin = `${cx}px ${mid}px`;
  const frame = div('left:0;top:0;width:600px;height:340px', hg, `<svg width="600" height="340">` +
    `<path class="ln" d="M${cx - 92} ${top + 10}L${cx - 9} ${mid}L${cx - 92} ${bot - 10}M${cx + 92} ${top + 10}L${cx + 9} ${mid}L${cx + 92} ${bot - 10}"/></svg>`);
  frame.querySelectorAll('path').forEach(p => K.draw(p, T.b[0] + .1, .5));
  [top - 6, bot - 14].forEach((y, i) => { const b = R7.plain(hg, cx - 116, y, 232, 22, 'main', '11px'); K.enter(b.o, T.b[0] + i * .08, 'pop'); });
  /* the sand: a solid fill in each bulb, the top one sinks while the bottom one grows */
  const flow0 = T.b[0] + .35, flow1 = T.hit;
  const bulb = (y, h, poly, from, to) => {
    const c = div(`left:${cx - 80}px;top:${y}px;width:160px;height:${h}px;clip-path:polygon(${poly})`, hg);
    const f = div(`left:0;top:0;width:160px;height:${h}px;background:var(--ac);transform-origin:50% 100%`, c);
    A(f, [{transform: `scaleY(${from})`}, {transform: `scaleY(${to})`}], flow0, flow1 - flow0, {e: 'linear', f: 'both'});
    K.enter(c, T.b[0] + .2, 'pop');
  };
  bulb(top + 26, mid - top - 34, '0 0,100% 0,54% 100%,46% 100%', .8, 0);
  bulb(mid + 8, bot - mid - 34, '46% 0,54% 0,100% 100%,0 100%', 0, .7);
  const stream = div(`left:${cx - 3}px;top:${mid - 8}px;width:6px;height:${bot - mid - 18}px;border-radius:3px;background:var(--ac)`, hg);
  R7.show(stream, flow0); R7.hide(stream, flow1);
  /* the times, reached one by one (the one that matters lights up on the key word) */
  const ys = {1: [172], 2: [110, 236], 3: [70, 172, 274]}[n], reach = R7.steps(T, n, at, T.b[1]);
  pts.forEach((p, k) => {
    K.badge(g, p.icon, 368, ys[k], 70, T.b[0] + .15 + k * .08, {tone: 'soft', shape: p.shape ?? 'round'});
    if (p.label) R6.wordL(K, g, p.label, 414, ys[k] - 22, 34, T.b[0] + .25 + k * .08, 136);
    const L = R7.up(K, g, p.icon, 368, ys[k], 70, reach[k], p.shape ?? 'round', k === at ? 'acc' : 'main');
    if (k === at) R1.ripple(K, L, L.done);
  });
  K.punch(hg, T.hit);
  if (s.result) {
    const r = K.badge(g, s.result.icon, cx, bot - 62, 86, T.hit + .1, {tone: s.result.tone ?? 'acc', shape: 'round'});
    R1.ripple(K, r, R6.at('pop', T.hit + .1));
  }
});

/* 4 · the sun crosses the sky over the times; the one that matters lights up when the sun is over it */
R3.both('B09', 'sun', 'พระอาทิตย์เคลื่อนข้ามฟ้า', (K, s, T, g) => {
  const pts = s.points.slice(0, 3), n = pts.length, at = Math.min(s.at ?? n - 1, n - 1), C = {x: 300, y: 300}, R = 190, Rs = 264;
  const ang = {1: [90], 2: [140, 40], 3: [152, 90, 32]}[n], rad = a => a * Math.PI / 180;
  const pos = (a, r) => ({x: C.x + r * Math.cos(rad(a)), y: C.y - r * Math.sin(rad(a))});
  R6.line(K, g, `M40 ${C.y}H${C.x + R + 30}`, T.b[0], .4).classList.add('u-decor');
  const sky = R6.line(K, g, `M${C.x - R} ${C.y}A${R} ${R} 0 0 1 ${C.x + R} ${C.y}`, T.b[0] + .1, .6);
  sky.querySelector('path').classList.add('u-thin', 'u-dash'); sky.classList.add('u-decor');
  const reach = R7.steps(T, n, at, T.b[1] + .3);
  pts.forEach((p, k) => {
    const q = pos(ang[k], R);
    K.badge(g, p.icon, q.x, q.y, 64, T.b[0] + .2 + k * .08, {tone: 'soft', shape: p.shape ?? 'round'});
    const dx = C.x - q.x, dy = C.y - q.y, L0 = Math.hypot(dx, dy) || 1;   // the word inside the sky, clear of the dashed arc
    if (p.label) R4.word(K, g, p.label, q.x + 80 * dx / L0, q.y + 80 * dy / L0 - 17, 28, T.b[0] + .3 + k * .08, 100);
    const L = R7.up(K, g, p.icon, q.x, q.y, 64, reach[k], p.shape ?? 'round', k === at ? 'acc' : 'main');
    if (k === at) R1.ripple(K, L, L.done);
  });
  /* the sun: rises at the left and stops over each time when it is reached */
  const key = [{t: T.b[0] + .2, a: 172}].concat(reach.map((t, k) => ({t, a: ang[k]})));
  const t0 = key[0].t, t1 = key.at(-1).t, kf = [];
  for (let i = 0; i <= 48; i++) {
    const t = t0 + (t1 - t0) * i / 48, j = Math.max(0, key.findIndex((q, k) => k > 0 && t <= q.t) - 1), a0 = key[j], a1 = key[j + 1];
    const u = (t - a0.t) / Math.max(.001, a1.t - a0.t), e = u < .5 ? 2 * u * u : 1 - 2 * (1 - u) * (1 - u), q = pos(a0.a + (a1.a - a0.a) * e, Rs);
    kf.push({transform: `translate(${q.x.toFixed(1)}px,${q.y.toFixed(1)}px)`});
  }
  const sun = K.badge(g, 'sun', 0, 0, 62, null, {tone: 'acc', shape: 'round'}); sun.o.classList.add('u-decor');
  A(sun.m, kf, t0, t1 - t0, {e: 'linear', f: 'both'}); K.enter(sun.o, t0, 'pop');
  if (s.result) {
    const r = K.badge(g, s.result.icon, C.x, 266, 60, T.hit + .3, {tone: s.result.tone ?? 'acc', shape: 'round'});
    R1.ripple(K, r, R6.at('pop', T.hit + .3));
  }
});

/* ================= B10 คน / กลุ่มเป้าหมาย: who? {icon}, label?, tags? [word, word] ================= */
/* 3 · people walk up to a door with the group's name on it; the door opens and the right one walks in */
R3.both('B10', 'door', 'คนที่ใช่เดินเข้าประตู', (K, s, T, g) => {
  const icon = s.who?.icon ?? 'user', D = {x: 392, y: 70, w: 128, h: 230}, cx = D.x + D.w / 2, Y = 244, S = 76;
  const frame = div('left:0;top:0;width:600px;height:340px', g, `<svg width="600" height="340"><path class="ln" d="M${D.x} ${D.y + D.h}V${D.y}H${D.x + D.w}V${D.y + D.h}"/>` +
    `<path class="ln u-thin" d="M30 ${D.y + D.h}H${D.x - 12}M${D.x + D.w + 12} ${D.y + D.h}H544"/></svg>`);
  A(frame, [{opacity: 0}, {opacity: 1}], T.b[0], .01); frame.querySelectorAll('path').forEach((p, i) => K.draw(p, T.b[0] + i * .1, .5));
  const inside = node(g, D.x + 10, D.y + 10, D.w - 20, D.h - 10, 'u-track'); inside.p.style.borderRadius = '6px'; K.enter(inside.o, T.b[0] + .2, 'pop');
  const leaf = R7.plain(g, D.x + 10, D.y + 10, D.w - 20, D.h - 10, 'main', '6px'); leaf.m.style.transformOrigin = '0 50%'; K.enter(leaf.o, T.b[0] + .25, 'pop');
  const knob = R7.plain(leaf.p, D.w - 46, D.h / 2 - 10, 18, 18, 'acc', '50%'); knob.o.classList.add('u-decor');
  K.move(leaf.m, T.b[2], 'none', 'scaleX(.16)');
  if (s.label) K.chipC(g, s.label, cx, D.y - 34, T.b[0] + .3, {tone: 'main', size: 32});
  /* four people walk in from the left; the nearest one goes through the door */
  const xs = [64, 146, 228, 310], ppl = xs.map((x, i) => {
    const p = K.badge(g, icon, x, Y, S, null, {tone: 'main', shape: 'round'});
    K.fade(p.o, T.b[0], 0, 1, {hold: true}); K.move(p.m, T.b[0], 'translateX(-140px)', 'none', {hold: true});   // they walk in together, never over each other
    return p;
  });
  const go = T.hit - .45; K.move(ppl[3].m, go, 'none', `translateX(${cx - xs[3]}px)`);
  const lit = R7.up(K, g, icon, cx, Y, S, LG.arrive('move', go), 'round'); K.fade(ppl[3].o, lit.done, 1, 0);
  R1.ripple(K, lit, lit.done);
  ppl.slice(0, 3).forEach(p => K.fade(p.o, T.hit, 1, .3));
  (s.tags ?? []).slice(0, 2).forEach((w, i) => K.chip(g, w, 36, 40 + i * 62, LG.arrive('move', go) + .25 + i * .12, {tone: 'acc', size: 30}));
});

/* 4 · a profile page: the cover, the person and the name come in, the tags pop under the name on the key word */
R3.both('B10', 'profile', 'หน้าโปรไฟล์ แล้วป้ายคำเด้งขึ้น', (K, s, T, g) => {
  const P = R3.panel(K, g, 170, 8, 260, 324, T.b[0]); P.p.style.borderRadius = '34px';
  const cover = node(P.p, 12, 12, 236, 86, 'u-track'); cover.p.style.borderRadius = '24px'; K.enter(cover.o, T.b[0] + .1, 'pop');
  const av = K.badge(P.p, s.who?.icon ?? 'user', 130, 98, 104, T.b[0] + .2, {tone: 'main', shape: 'round'});
  if (s.label) R4.word(K, P.p, s.label, 130, 156, 36, T.b[1], 224); else K.skel(P.p, 70, 172, [120], T.b[1]);
  const tags = (s.tags ?? []).slice(0, 2);
  if (tags.length) tags.forEach((w, i) => K.chipC(P.p, w, 130, 234 + i * 54, T.hit + i * .15, {tone: 'acc', size: 30}));
  else K.skel(P.p, 50, 222, [160, 110], T.hit);
  K.punch(av.p, T.hit); R1.ripple(K, P, T.hit + .1);   // from the page's edge, behind it: a ring from the face ran over the name
});

/* ================= B11 คำพูด / แชต / รีวิว: quote?, kind, mood?, react?, gone?, app? ================= */
/* 4 · an envelope flies in, its flap opens and the letter with the words comes out on the key word */
R3.both('B11', 'letter', 'ซองจดหมายเปิดออกเป็นข้อความ', (K, s, T, g) => {
  const bad = s.mood === 'bad', E = {x: 140, y: 152, w: 320, h: 166}, cx = E.x + E.w / 2;
  const env = R6.group(g);
  K.fade(env, T.b[0], 0, 1, {hold: true}); K.move(env, T.b[0], 'translate(-200px,-70px) rotate(-12deg)', 'none', {hold: true, kind: 'snap'});
  const svg = (inner, z) => { const e = div(`left:0;top:0;width:600px;height:340px;z-index:${z}`, env, `<svg width="600" height="340">${inner}</svg>`); return e; };
  const box = `x="${E.x}" y="${E.y}" width="${E.w}" height="${E.h}" rx="14"`;
  svg(`<rect class="fl" style="stroke:none" ${box}/><rect class="u-fl-edge" ${box}/>`, 0);
  /* the letter: inside until the flap is open, then it rises on the key word */
  /* seen only above the pocket's edge: in a see-through style it showed through the pocket, in the overlay below the envelope */
  const slot = div(`left:0;top:0;width:600px;height:340px;z-index:2;clip-path:polygon(0 -200px,600px -200px,600px ${E.y + 44}px,${E.x + E.w}px ${E.y + 44}px,${cx}px ${E.y + 106}px,${E.x}px ${E.y + 44}px,0 ${E.y + 44}px)`, env);
  const paper = R2.card(node(slot, E.x + 26, 22, E.w - 52, 150, 'u-panel')); paper.p.style.borderRadius = '16px';
  if (s.quote) R4.word(K, paper.p, s.quote, (E.w - 52) / 2, 44, 42, null, E.w - 96);
  else K.skel(paper.p, 34, 46, [190, 130], T.hit);
  const open = T.b[2], rise = T.hit - .15;
  R7.show(paper.o, open + .2); K.move(paper.m, open + .19, 'translateY(180px)', 'translateY(180px)', {hold: true});
  K.move(paper.m, rise, 'translateY(180px)', 'none', {kind: 'snap'});
  const v = `M${E.x} ${E.y + 44}L${cx} ${E.y + 106}L${E.x + E.w} ${E.y + 44}`;
  svg(`<path class="fl" style="stroke:none" d="${v}V${E.y + E.h - 14}Q${E.x + E.w} ${E.y + E.h} ${E.x + E.w - 14} ${E.y + E.h}H${E.x + 14}Q${E.x} ${E.y + E.h} ${E.x} ${E.y + E.h - 14}Z"/><path class="u-fl-edge" d="${v}"/>`, 3);
  const flap = svg(`<path class="fl" d="M${E.x + 6} ${E.y + 4}L${cx} ${E.y + 92}L${E.x + E.w - 6} ${E.y + 4}Z" style="stroke:none"/><path class="u-fl-edge" d="M${E.x + 6} ${E.y + 4}L${cx} ${E.y + 92}L${E.x + E.w - 6} ${E.y + 4}"/>`, 4);
  flap.style.transformOrigin = `${cx}px ${E.y + 4}px`;
  A(flap, [{transform: 'scaleY(1)'}, {transform: 'scaleY(-1)'}], open, .35, {e: 'ease-in-out', f: 'forwards'});
  A(flap, [{zIndex: 4}, {zIndex: 1}], open + .17, .01, {f: 'forwards'});
  K.fade(flap, rise, 1, 0);                              // the open flap goes before the letter rises over it (a see-through letter showed its lines)
  const stamp = K.badge(env, s.app ?? 'mail', E.x + E.w - 42, E.y + E.h - 38, 50, T.b[0] + .35, {tone: 'acc'}); stamp.o.style.zIndex = 5;
  const land = R6.at('snap', rise);
  K.punch(paper.p, land);
  if (s.react || s.mood) { const r = K.badge(env, s.react ?? (bad ? 'thumbs-down' : 'heart'), E.x + E.w - 14, 34, 62, land + .1, {tone: bad ? 'neg' : 'acc', shape: 'round'}); r.o.style.zIndex = 6; R1.ripple(K, r, R6.at('pop', land + .1), {tone: bad ? 'neg' : 'acc'}); }
  if (s.gone) K.fade(env, T.after + .2, 1, .35);
});

/* 5 · an interview: a microphone reaches in to the person, and what they said pops up above them */
R3.both('B11', 'mic', 'ไมค์สัมภาษณ์ยื่นเข้ามา', (K, s, T, g) => {
  const bad = s.mood === 'bad', who = K.badge(g, s.who ?? 'user', 442, 228, 128, T.b[0], {tone: 'main', shape: 'round'});
  const mic = R6.group(g), tilt = div('left:0;top:0;width:600px;height:340px;transform-origin:300px 238px;transform:rotate(40deg)', mic);
  const handle = R7.plain(tilt, 284, 262, 32, 112, 'main', '16px');
  const head = K.badge(tilt, 'audio-lines', 300, 238, 76, null, {tone: 'acc', shape: 'round'});
  K.fade(mic, T.b[1], 0, 1, {hold: true}); K.move(mic, T.b[1], 'translate(-200px,160px)', 'none', {hold: true, kind: 'snap'});
  const near = R6.at('snap', T.b[1]);
  K.punch(head.p, T.hit - .1);
  const bub = R2.card(node(g, 150, 18, 360, 118, 'u-panel u-bubble')); bub.p.style.borderRadius = '30px 30px 8px 30px';
  K.enter(bub.o, T.hit, 'pop');
  if (s.quote) R4.word(K, bub.p, s.quote, 180, 30, 44, null, 316); else K.skel(bub.p, 34, 40, [260, 170], T.hit + .1);
  const land = R6.at('pop', T.hit);
  R1.ripple(K, bub, land);
  if (s.react || s.mood) K.sat(g, s.react ?? (bad ? 'thumbs-down' : 'heart'), 548, 40, 62, land + .15, {tone: bad ? 'neg' : 'acc', shape: 'round', k: .5});
  if (s.gone) { K.fade(bub.o, T.after + .2, 1, .3); K.fade(who.o, T.after + .2, 1, .3); }
  void near; void handle;
});

/* ================= B13 เคล็ดลับ / ความลับ: secret {icon, label?} ================= */
/* 3 · a scratch card: a coin scratches the cover off line by line, the secret is under it */
R3.both('B13', 'scratch', 'บัตรขูด ขูดแล้วเห็นเคล็ดลับ', (K, s, T, g) => {
  const it = s.secret, C = R3.panel(K, g, 104, 38, 392, 258, T.b[0]), A0 = {x: 30, y: 30, w: 332, h: 198}, rows = 4, h = A0.h / rows;
  const ts = LG.spread(T.b[1], T.hit - .26, rows), d = Math.min(.26, ts[1] - ts[0] - .1);
  /* the secret, drawn once per stripe and shown only where the cover is gone (so nothing shows through a see-through cover) */
  for (let i = 0; i < rows; i++) {
    const c = div(`left:${A0.x}px;top:${A0.y}px;width:${A0.w}px;height:${A0.h}px`, C.p);
    K.badge(c, it.icon, it.label ? 82 : A0.w / 2, A0.h / 2, 112, null, {tone: 'acc'});
    if (it.label) R6.wordL(K, c, it.label, 156, A0.h / 2 - 28, 42, null, 170);
    const top = (i * h).toFixed(1), bot = (A0.h - (i + 1) * h).toFixed(1);
    A(c, [{clipPath: `inset(${top}px 100% ${bot}px 0)`}, {clipPath: `inset(${top}px 0 ${bot}px 0)`}], ts[i], d, {e: 'linear', f: 'both'});
    const cv = div(`left:${A0.x}px;top:${A0.y + i * h}px;width:${A0.w}px;height:${h + (i < rows - 1 ? 1 : 0)}px`, C.p);
    cv.className = 'u-badge u-soft'; cv.style.borderRadius = i === 0 ? '18px 18px 0 0' : i === rows - 1 ? '0 0 18px 18px' : '0';
    K.enter(cv, T.b[0] + .15, 'pop');
    A(cv, [{clipPath: 'inset(0 0 0 0)'}, {clipPath: 'inset(0 0 0 100%)'}], ts[i], d, {e: 'linear', f: 'both'});
  }
  const q = K.badge(C.p, 'sparkles', A0.x + A0.w / 2, A0.y + A0.h / 2, 72, T.b[0] + .25, {tone: 'soft', shape: 'round'}); R7.hide(q.o, ts[1]);
  /* the coin goes along each stripe and back to the start of the next */
  const coin = R7.plain(C.p, -27, -27, 54, 54, 'acc', '50%'), kf = [], t0 = ts[0] - .15, t1 = ts[rows - 1] + d;
  ts.forEach((t, i) => { const y = A0.y + (i + .5) * h; kf.push({t: t - .05, x: A0.x + 10, y}, {t: t + d, x: A0.x + A0.w - 10, y}); });
  A(coin.m, kf.map(p => ({transform: `translate(${p.x}px,${p.y}px)`, offset: Math.max(0, (p.t - t0) / (t1 - t0))})), t0, t1 - t0, {f: 'both'});
  R7.show(coin.o, t0 + .1); R7.hide(coin.o, t1 + .05);
  K.punch(C.p, T.hit); R1.ripple(K, C, T.hit + .05);
});

/* 4 · a whisper: one person cups a hand, the secret travels along the line into the other one's ear, who lights up */
R3.both('B13', 'whisper', 'มือป้องปากกระซิบ', (K, s, T, g) => {
  const it = s.secret, Ax = 100, Bx = 466, Y = 146, S = 120;
  K.badge(g, 'user', Ax, Y, S, T.b[0], {tone: 'main', shape: 'round'});
  K.badge(g, 'user', Bx, Y, S, T.b[0] + .1, {tone: 'main', shape: 'round'});
  const hand = {x: Ax + 92, y: Y + 24}, ear = {x: Bx - 90, y: Y - 4};
  K.badge(g, 'hand', hand.x, hand.y, 66, T.b[1], {tone: 'soft', shape: 'round'});
  K.badge(g, 'ear', ear.x, ear.y, 62, T.b[1] + .1, {tone: 'soft', shape: 'round'});
  const dots = R6.line(K, g, `M${hand.x + 40} ${hand.y - 3}L${ear.x - 38} ${ear.y + 1}`, T.b[2] - .2, .35);
  dots.querySelector('path').classList.add('u-thin', 'u-dash'); dots.classList.add('u-decor');
  /* the secret rides the line from the hand to the ear */
  const sec = K.badge(g, it.icon, 0, 0, 84, null, {tone: 'acc'}), go = T.b[2], arrive = T.hit - .08;
  A(sec.m, [{transform: `translate(${hand.x + 40}px,${hand.y - 50}px) scale(.4)`}, {transform: `translate(${(hand.x + ear.x) / 2}px,${(hand.y + ear.y) / 2 - 58}px) scale(1)`, offset: .5},
    {transform: `translate(${ear.x - 30}px,${ear.y - 46}px) scale(.35)`}], go, arrive - go, {e: 'ease-in-out', f: 'both'});
  R7.show(sec.o, go); R7.hide(sec.o, arrive);
  const lit = R7.up(K, g, 'user', Bx, Y, S, arrive, 'round');
  R1.ripple(K, lit, lit.done);
  K.badge(g, it.icon, Bx, Y - S / 2 - 30, 64, arrive + .2, {tone: 'acc'});
  if (it.label) R4.word(K, g, it.label, Bx, Y + S / 2 + 12, 38, arrive + .25, 160);
});

/* ================= B14 ประโยคเด็ด: idea {icon, label?} ================= */
/* 4 · a rubber stamp comes down on a paper on the key word and leaves the idea printed on it */
R3.both('B14', 'stamp', 'ตราประทับปั๊มลงกระดาษ', (K, s, T, g) => {
  const it = s.idea, P = R3.panel(K, g, 100, 70, 400, 250, T.b[0]);
  K.skel(P.p, 40, 30, [250, 170], T.b[0] + .15, {h: 14, gap: 18});
  K.skel(P.p, 40, 206, [320], T.b[0] + .2, {h: 14});
  const MW = it.label ? 300 : 150, MH = 104, mark = node(P.p, 200 - MW / 2, 128 - MH / 2, MW, MH, 'u-badge u-acc');
  mark.p.style.borderRadius = '18px'; mark.o.style.transform = 'rotate(-6deg)'; mark.p.style.gap = '16px';   // turned on the outer layer, so its ring turns too
  mark.p.innerHTML = ICO(it.icon, 62) + (it.label ? `<span class="u-btn-text" style="font-size:44px">${it.label}</span>` : '');
  if (it.label) { const sp = mark.p.querySelector('span'); FITS.push(() => { const w = sp.offsetWidth, room = MW - 110; if (w > room) sp.style.fontSize = (44 * room / w).toFixed(1) + 'px'; }); }
  R7.show(mark.o, T.hit);
  /* the stamp: knob, neck and a face as big as the print; it hovers, comes down over the place, lifts away and shows the print */
  /* in the accent, like the print it leaves (a plain one was white on the white paper in the overlay); turned like the print */
  const tool = R6.group(g), rot = div('left:0;top:0;width:600px;height:340px;transform-origin:300px 198px;transform:rotate(-6deg)', tool);
  const BW = MW + 28, BH = MH + 14, by = 198 - BH / 2;
  R7.plain(rot, 288, by - 66, 24, 70, 'acc', '8px'); R7.plain(rot, 268, by - 112, 64, 64, 'acc', '50%');
  R7.plain(rot, 300 - BW / 2, by, BW, BH, 'acc', '20px');
  A(tool, [{opacity: 0}, {opacity: 1}], T.b[1], .2, {f: 'both'});
  A(tool, [{transform: 'translateY(-360px)'}, {transform: 'translateY(-200px)'}], T.b[1], .5, {e: EASE.smooth, f: 'both'});   // hovers clear of the paper
  A(tool, [{transform: 'translateY(-200px)'}, {transform: 'translateY(0)'}], T.hit - .16, .16, {e: 'ease-in', f: 'forwards'});
  A(tool, [{transform: 'translateY(0)'}, {transform: 'translateY(-340px)'}], T.hit + .2, .4, {e: 'ease-in', f: 'forwards'});
  A(tool, [{opacity: 1}, {opacity: 0}], T.hit + .38, .2, {f: 'forwards'});
  K.shake(P.p, T.hit);
  R1.ripple(K, mark, T.hit + .45);                         // once the stamp is off it, from its edge (a round ring ran over the words)
});

/* 5 · a sign hangs on two chains; on the key word it flickers on like a neon light */
R3.both('B14', 'neon', 'ป้ายไฟนีออนติดสว่าง', (K, s, T, g) => {
  const it = s.idea, P = R2.card(node(g, 90, 84, 420, 196, 'u-panel')); P.p.style.borderRadius = '26px';
  P.m.style.transformOrigin = '50% -84px';
  K.enter(P.o, T.b[0], 'drop');
  A(P.m, [0, 5, -3.5, 2, -1, 0].map((d, i, a) => ({transform: `rotate(${d}deg)`, offset: i / (a.length - 1)})), T.b[0] + .3, 1.4, {e: 'ease-out', f: 'none'});
  const chains = div('left:0;top:0;width:420px;height:196px', P.p, `<svg width="420" height="196"><path class="ln u-thin" d="M80 -84V0M340 -84V0"/></svg>`);
  chains.classList.add('u-decor');
  const ix = it.label ? 96 : 210, iS = it.label ? 120 : 140;
  K.badge(P.p, it.icon, ix, 98, iS, T.b[0] + .2, {tone: 'soft'});
  const on = K.badge(P.p, it.icon, ix, 98, iS, null, {tone: 'acc'});
  const flick = [[0, 0], [.18, 0], [.19, 1], [.32, 1], [.33, 0], [.5, 0], [.51, 1], [1, 1]], t0 = T.hit - .3;
  A(on.o, flick.map(([o, v]) => ({opacity: v, offset: o})), t0, .5, {f: 'both'});
  if (it.label) {
    const w = R6.wordL(K, P.p, it.label, 176, 68, 50, T.b[0] + .3, 210);
    A(w.firstChild, flick.map(([o, v]) => ({opacity: .3 + .7 * v, offset: o})), t0, .5, {f: 'both'});
  }
  K.halo(g, 300, 182, 300, T.hit + .2);
  R1.ripple(K, P, T.hit + .25);
});

/* ================= B15 ปิดคลิป / ชวนทำต่อ: action, label? ================= */
/* 3 · the stage curtains close, and the thing to do pops out in front of them */
R3.both('B15', 'curtain', 'ม่านปิดฉาก', (K, s, T, g) => {
  const [i0] = R3.ACT[s.action] ?? R3.ACT.follow;
  const side = (x, origin) => {
    const o = div(`left:${x}px;top:44px;width:232px;height:272px`, g), c = div(`left:0;top:0;width:232px;height:272px;transform-origin:${origin}`, o);
    for (let i = 0; i < 4; i++) { const st = R7.plain(c, i * 59, 0, 54, 272, 'main', '0 0 20px 20px'); st.o.classList.add('u-decor'); }
    K.enter(o, T.b[0] + .1, 'rise');
    K.move(c, T.b[1], 'scaleX(.22)', 'none', {hold: true});
    return c;
  };
  side(66, '0 0'); side(302, '100% 0');
  const top = R7.plain(g, 54, 18, 492, 36, 'main', '14px'); K.enter(top.o, T.b[0], 'drop');
  const act = K.badge(g, i0, 300, 158, 132, T.hit, {tone: 'acc', shape: 'round'});
  const land = R6.at('pop', T.hit);
  R1.ripple(K, act, land);
  if (s.label) K.chipC(g, s.label, 300, 266, land, {tone: 'acc', size: 38});
});

/* 4 · a hand-drawn arrow loops across and points at the thing to do, which lights up */
R3.both('B15', 'arrow', 'ลูกศรวาดด้วยมือชี้ไปที่ไอคอน', (K, s, T, g) => {
  const [i0, i1] = R3.ACT[s.action] ?? R3.ACT.follow, X = 432, Y = 112, S = 140, ex = X - S / 2 - 20, ey = Y + 10;
  K.badge(g, i0, X, Y, S, T.b[0], {tone: 'main', shape: 'round'});
  const d = `M70 300C40 214 146 162 190 222C228 274 118 292 138 222C158 156 262 128 ${ex} ${ey}`;
  const a = R6.line(K, g, d, T.b[1], T.hit - .15 - T.b[1]); a.querySelector('path').classList.add('u-thick');
  const dir = Math.atan2(ey - 128, ex - 262), hd = k => `${(ex - 30 * Math.cos(dir + k)).toFixed(1)} ${(ey - 30 * Math.sin(dir + k)).toFixed(1)}`;
  R6.line(K, g, `M${hd(.55)}L${ex} ${ey}L${hd(-.55)}`, T.hit - .15, .15).querySelector('path').classList.add('u-thick');
  const lit = R7.up(K, g, i1, X, Y, S, T.hit, 'round');
  R1.ripple(K, lit, lit.done);
  if (s.label) R4.word(K, g, s.label, X, Y + S / 2 + 14, 40, lit.done, 200);
});

/* ================= B16 นิยาม: term {icon, label}, means [{icon, label?}] (1–3) ================= */
/* 3 · a board: the word is written and underlined, then what it means is written under it on the key word */
R3.both('B16', 'board', 'กระดาน เขียนคำแล้วเขียนความหมายต่อ', (K, s, T, g) => {
  const P = R3.panel(K, g, 50, 14, 490, 258, T.b[0]), m = s.means.slice(0, 3), n = m.length;
  const ledge = R7.plain(g, 78, 278, 434, 16, 'main', '8px'); K.enter(ledge.o, T.b[0] + .1, 'pop');
  const pen = R7.plain(g, 404, 262, 74, 16, 'acc', '8px'); pen.o.classList.add('u-decor'); K.enter(pen.o, T.b[0] + .2, 'pop');
  K.badge(P.p, s.term.icon, 74, 72, 72, T.b[0] + .2, {tone: 'main'});
  const w = R6.wordL(K, P.p, s.term.label, 126, 40, 52, null, 330); R7.write(w, T.b[1]);
  const ul = div('left:126px;top:110px;width:10px;height:8px;border-radius:4px;transform-origin:0 50%;background:var(--ink)', P.p);
  FITS.push(() => { ul.style.width = w.firstChild.offsetWidth + 'px'; });
  A(ul, [{transform: 'scaleX(0)'}, {transform: 'none'}], T.b[2], .3, {e: 'ease-out'});
  const Y = n === 1 ? 190 : 176, xs = {1: [74], 2: [130, 330], 3: [90, 245, 400]}[n], when = n < 2 ? [T.hit] : LG.spread(T.hit, T.hit + .3, n);
  m.forEach((it, i) => {
    const b = K.badge(P.p, it.icon, xs[i], Y, n === 1 ? 72 : 64, when[i], {tone: 'acc', shape: it.shape ?? 'tile'});
    if (i === 0) R1.ripple(K, b, R6.at('pop', when[i]));
    if (!it.label) return;
    const l = n === 1 ? R6.wordL(K, P.p, it.label, 126, Y - 30, 46, null, 330) : R4.word(K, P.p, it.label, xs[i], Y + 38, 28, null, 140);
    R7.write(l, when[i] + .05, .35);
  });
});

/* 4 · an x-ray scanner slides over the word; inside its window you see what it means, then the whole thing turns into it */
R3.both('B16', 'xray', 'เครื่องเอกซเรย์ส่องคำ เห็นความหมายข้างใน', (K, s, T, g) => {
  const B = {x: 180, y: 22, w: 240, h: 190}, m = s.means.slice(0, 3), n = m.length, Wn = 120;
  const outer = R7.plain(g, B.x, B.y, B.w, B.h, 'main', '28px'); outer.p.innerHTML = ICO(s.term.icon, 104);
  const inner = R7.plain(g, B.x, B.y, B.w, B.h, 'acc', '28px'); inner.p.style.gap = '14px';
  inner.p.innerHTML = m.map(it => ICO(it.icon, {1: 104, 2: 78, 3: 58}[n])).join('');
  K.enter(outer.o, T.b[0], 'pop'); K.enter(inner.o, T.b[0], 'pop');
  /* the window [a, b] across the box: off to the left, then over the middle, then the whole box */
  const win = [[T.b[1], 0, 0], [T.b[1] + .35, 0, Wn], [T.b[2] + .2, (B.w - Wn) / 2, (B.w + Wn) / 2], [T.hit, (B.w - Wn) / 2, (B.w + Wn) / 2], [T.hit + .3, 0, B.w]];
  const t0 = win[0][0], t1 = win.at(-1)[0], off = t => (t - t0) / (t1 - t0), W = B.w, H = B.h;
  A(inner.p, win.map(([t, a, b]) => ({clipPath: `inset(0 ${W - b}px 0 ${a}px)`, offset: off(t)})), t0, t1 - t0, {e: 'ease-in-out', f: 'both'});
  A(outer.p, win.map(([t, a, b]) => ({clipPath: `polygon(evenodd,0 0,${W}px 0,${W}px ${H}px,0 ${H}px,0 0,${a}px 0,${a}px ${H}px,${b}px ${H}px,${b}px 0,${a}px 0)`, offset: off(t)})), t0, t1 - t0, {e: 'ease-in-out', f: 'both'});
  /* the scanner's frame, around the window while it moves */
  const fr = div(`left:${B.x - 10 - Wn}px;top:${B.y - 14}px;width:${Wn + 20}px;height:${B.h + 28}px`, g,
    `<svg width="${Wn + 20}" height="${B.h + 28}"><rect class="ln u-thin" x="0" y="0" width="${Wn + 20}" height="${B.h + 28}" rx="18"/><path class="u-acc-line" style="stroke-width:6px" d="M${(Wn + 20) / 2} 10V${B.h + 18}"/></svg>`);
  A(fr, [{transform: 'translateX(0)', offset: 0}, {transform: `translateX(${Wn}px)`, offset: off(win[1][0])}, {transform: `translateX(${Wn + (B.w - Wn) / 2}px)`, offset: off(win[2][0])},
    {transform: `translateX(${Wn + (B.w - Wn) / 2}px)`, offset: 1}], t0, t1 - t0, {e: 'ease-in-out', f: 'both'});
  R7.show(fr, t0); A(fr, [{opacity: 1}, {opacity: 0}], T.hit, .2, {f: 'forwards'});
  const ly = B.y + B.h + 14;
  if (s.term.label) { const a = R4.word(K, g, s.term.label, 300, ly, 40, T.b[0] + .2, 380); K.fade(a, T.hit + .1, 1, 0); }
  const said = m.map(it => it.label).filter(Boolean).join(' · ');
  if (said) R4.word(K, g, said, 300, ly, 40, T.hit + .45, 420);   // after the word it replaces has gone (no two words on one spot)
  R1.ripple(K, inner, T.hit + .35);
});

/* ================= sample sentences (general topics, not Friend's own script) ================= */
SENTENCE('r7.price', {cat: 'B01', name: 'ราคาแค่ 990 บาท', say: ['คอร์สนี้ราคาแค่', '990 บาท'], value: '990', unit: 'บาท', icon: 'tag', money: true});
SENTENCE('r7.fans', {cat: 'B01', name: 'ผู้ติดตาม 12,000 คน', say: ['ตอนนี้มีคนติดตาม', '12,000 คน'], value: '12,000', unit: 'คน', icon: 'users', dir: 'up'});
SENTENCE('r7.sales', {cat: 'B02', name: 'ยอดขายพุ่ง', say: ['พอเปลี่ยนรูปสินค้า', 'ยอดขายพุ่ง'], dir: 'up', item: {icon: 'shopping-cart'}, center: {icon: 'store'}});
SENTENCE('r7.stress', {cat: 'B02', name: 'ความเครียดลดลง', say: ['พอนอนครบ ความเครียด', 'ลดลง'], dir: 'down', item: {icon: 'flame'}});
SENTENCE('r7.cook', {cat: 'B04', name: 'ซื้อของ ทำอาหาร ถ่ายรูป', say: ['ซื้อของ ทำอาหาร', 'แล้วถ่ายรูป'],
  items: [{icon: 'shopping-basket', label: 'ซื้อของ'}, {icon: 'cooking-pot', label: 'ทำอาหาร'}, {icon: 'camera', label: 'ถ่ายรูป'}], mark: {at: 1, how: 'check'}});
SENTENCE('r7.job', {cat: 'B04', name: 'ส่งเรซูเม่ สัมภาษณ์ เริ่มงาน', say: ['ส่งเรซูเม่ สัมภาษณ์', 'แล้วก็เริ่มงาน'],
  items: [{icon: 'file-text', label: 'ส่งเรซูเม่'}, {icon: 'messages-square', label: 'สัมภาษณ์'}, {icon: 'briefcase', label: 'เริ่มงาน'}]});
SENTENCE('r7.gym', {cat: 'B09', name: 'สัปดาห์แรก เดือนที่ 2 เดือนที่ 6', say: ['สัปดาห์แรกยังไม่เห็นผล แต่', 'เดือนที่ 6'],
  points: [{icon: 'dumbbell', label: 'สัปดาห์แรก'}, {icon: 'activity', label: 'เดือนที่ 2'}, {icon: 'trophy', label: 'เดือนที่ 6'}], result: {icon: 'trophy', tone: 'acc'}});
SENTENCE('r7.save', {cat: 'B09', name: 'เก็บเงินห้าปี ได้บ้าน', say: ['เก็บเงินมาห้าปี', 'ได้บ้านหลังแรก'],
  points: [{icon: 'piggy-bank', label: 'ปีแรก'}, {icon: 'coins', label: 'ปีที่ 3'}, {icon: 'house', label: 'ปีที่ 5'}], result: {icon: 'house', tone: 'acc'}});
SENTENCE('r7.newbie', {cat: 'B10', name: 'คลิปนี้สำหรับมือใหม่', say: ['คลิปนี้สำหรับมือใหม่ที่', 'อยากขายของ'], who: {icon: 'user'}, label: 'มือใหม่', tags: ['อยากขายของ']});
SENTENCE('r7.parents', {cat: 'B10', name: 'พ่อแม่ที่ทำงานประจำ', say: ['ใครเป็นพ่อแม่', 'ที่ทำงานประจำ'], who: {icon: 'baby'}, label: 'พ่อแม่มือใหม่', tags: ['ทำงานประจำ', 'ลูกเล็ก']});
SENTENCE('r7.thanks', {cat: 'B11', name: 'ลูกค้าส่งข้อความมาขอบคุณ', say: ['ลูกค้าส่งข้อความมาว่า', 'ขอบคุณมากนะ'], kind: 'message', quote: 'ขอบคุณมากนะ', mood: 'good', react: 'heart', app: 'mail'});
SENTENCE('r7.tasty', {cat: 'B11', name: 'ลูกค้าบอกว่าอร่อยมาก', say: ['ถามลูกค้าแล้ว เขาบอกว่า', 'อร่อยมาก'], kind: 'review', quote: 'อร่อยมาก', mood: 'good', react: 'thumbs-up'});
SENTENCE('r7.wake', {cat: 'B13', name: 'เคล็ดลับคือตื่นตีห้า', say: ['เคล็ดลับของเขาคือ', 'ตื่นตีห้า'], secret: {icon: 'alarm-clock', label: 'ตื่นตีห้า'}});
SENTENCE('r7.salt', {cat: 'B13', name: 'ความลับคือเกลือหยิบมือ', say: ['ความลับของร้านนี้คือ', 'เกลือหยิบมือ'], secret: {icon: 'cooking-pot', label: 'เกลือหยิบมือ'}});
SENTENCE('r7.slow', {cat: 'B14', name: 'ช้าแต่ชัวร์', say: ['จำไว้เลย', 'ช้าแต่ชัวร์'], idea: {icon: 'turtle', label: 'ช้าแต่ชัวร์'}});
SENTENCE('r7.health', {cat: 'B14', name: 'สุขภาพมาก่อนเสมอ', say: ['ไม่ว่ายังไง', 'สุขภาพมาก่อน'], idea: {icon: 'heart-pulse', label: 'สุขภาพมาก่อน'}});
SENTENCE('r7.share', {cat: 'B15', name: 'แชร์ให้เพื่อน', say: ['ถ้ามีประโยชน์', 'แชร์ให้เพื่อนด้วย'], action: 'share', label: 'แชร์'});
SENTENCE('r7.comment', {cat: 'B15', name: 'คอมเมนต์บอกกันหน่อย', say: ['คิดยังไงก็', 'คอมเมนต์บอก'], action: 'comment', label: 'คอมเมนต์'});
SENTENCE('r7.passive', {cat: 'B16', name: 'รายได้แฝงคือนอนก็ได้เงิน', say: ['รายได้แฝงก็คือ', 'นอนอยู่ก็ได้เงิน'], term: {icon: 'wallet', label: 'รายได้แฝง'}, means: [{icon: 'moon', label: 'นอนก็ได้เงิน'}]});
SENTENCE('r7.roi', {cat: 'B16', name: 'ROI คือกำไรเทียบเงินลงทุน', say: ['ROI ก็คือ กำไรเทียบกับ', 'เงินลงทุน'], term: {icon: 'percent', label: 'ROI'}, means: [{icon: 'coins', label: 'กำไร'}, {icon: 'banknote', label: 'เงินลงทุน'}]});
