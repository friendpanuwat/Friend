/* =====================================================================
   CutPack · uni · LEGO round 2 (Friend 2026-11-07: "กลับไปเติมของรอบที่ 1", target 20 variants per category)
   The four categories that had one look get two more, and all of them now go through the variant picker (cats.js).
   Slots per category (the same for every variant of it; this is all the AI will write):
     B01 ตัวเลขเด่น      value ('3,000', '30%', '4'), unit?, icon?, dir? ('up'|'down'), money? (else read from value/unit)
     B07 คำเตือน         thing {icon, label?}, how ('cross' = do not | 'flag' = watch out), sign? (icon)
     B11 คำพูด / รีวิว    quote? (the words that were said, ≤ 12), kind ('chat'|'comment'|'review'|'message'),
                         mood? ('good'|'bad'), react? (icon), gone? (no reply / disappeared), app? (icon)
     B08 เป้าหมาย        goal {icon, label?}, who? (icon that climbs)
   New parts here: ring gauge, receipt printer, warning beacon, stamp, review card, notification stack,
   stairs with a climber, progress bar to a trophy. Same rule as every base scene: no colour, font or speed here.
   ===================================================================== */
const R2 = {
  money: s => s.money ?? /฿|บาท|\$|ดอลลาร์|ราคา|ค่า|เงิน|ทุน|ยอดขาย/.test(`${s.value} ${s.unit ?? ''} ${s.say.join(' ')}`),
  num: (s, d = 1) => parseFloat(String(s.value).replace(/[^\d.]/g, '')) || 0,
  /* a number box whose size fits a width (KeySans digits are about .58 em wide) */
  fitSize: (value, w, max) => Math.min(max, Math.round(w / (.6 * Math.max(1, String(value).length)))),
  /* a hop from (x0, y0) to (x1, y1) over an arc (translate only, on the m layer) */
  hop(el, t, d, [x0, y0], [x1, y1], lift = 80) {
    const top = Math.min(y0, y1) - lift;
    A(el, [{transform: `translate(${x0}px,${y0}px)`, easing: 'cubic-bezier(.2,.7,.4,1)'}, {transform: `translate(${(x0 + x1) / 2}px,${top}px)`, offset: .45, easing: 'cubic-bezier(.6,0,.8,.4)'},
      {transform: `translate(${x1}px,${y1}px)`}], t, d, {f: 'forwards'});
  },
};

/* ================= B01 ตัวเลขเด่น ================= */
VARIANT('B01', 'big', {name: 'ตัวเลขใหญ่บนการ์ด', build: (K, s, T) => LAYOUTS.number.build(K, s, T)});

VARIANT('B01', 'ring', {name: 'วงแหวนวิ่งถึงตัวเลข', build(K, s, T) {
  const cx = 500, cy = 330, R = 225, w = 40, pct = /%/.test(s.value) ? Math.min(1, R2.num(s) / 100) : 1, d = T.hit - T.b[1];
  K.halo(K.stage, cx, cy, 330, T.b[0]);
  const S = R + w, c = `cx="${S}" cy="${S}" r="${R}"`, arc = cls => `<circle class="${cls}" ${c} pathLength="100" stroke-dasharray="100 100" stroke-dashoffset="100" transform="rotate(-90 ${S} ${S})"/>`;
  const g = node(K.stage, cx - S, cy - S, 2 * S, 2 * S, '', `<svg width="${2 * S}" height="${2 * S}"><circle class="u-ring" ${c}/>${arc('u-ring-edge')}${arc('u-ring-on')}</svg>`);
  K.enter(g.o, T.b[0], 'pop');
  g.p.querySelectorAll('.u-ring-edge,.u-ring-on').forEach(a => {
    A(a, [{opacity: 0}, {opacity: 1}], T.b[1], .12);
    A(a, [{strokeDashoffset: 100}, {strokeDashoffset: 100 - 100 * pct}], T.b[1], d, {e: 'cubic-bezier(.33,1,.68,1)'});   // in step with the counter
  });
  const size = R2.fitSize(s.value, 360, 150);
  R1.counter(K, K.stage, cx, cy - (s.unit ? 28 : 0), size, T.b[1], s.value, d);
  if (s.unit) K.chipC(K.stage, s.unit, cx, cy + 92, T.hit - .2, {size: 44, tone: 'acc'});
  K.punch(g.p, T.hit); R1.ripple(K, g, T.hit + .1, {r: '50%', grow: 50});
  if (s.icon) K.sat(K.stage, s.icon, 150, 110, 110, T.b[0] + .2, {tone: 'main'});
  if (s.dir) K.sat(K.stage, s.dir === 'down' ? 'trending-down' : 'trending-up', 850, 130, 100, T.hit, {tone: s.dir === 'down' ? 'soft' : 'acc'});
  K.sat(K.stage, 'sparkles', 840, 560, 72, T.after, {tone: 'acc'});
}});

VARIANT('B01', 'receipt', {name: 'ใบเสร็จพิมพ์ตัวเลขออกมา', fits: R2.money, build(K, s, T) {
  const W = 420, H = 470, x = 290, top = 170;
  K.halo(K.stage, 500, 400, 330, T.b[1]);
  const box = div(`left:${x - 30}px;top:${top}px;width:${W + 60}px;height:${H + 50}px;overflow:hidden`, K.stage);   // the paper only shows below the slot
  const rc = node(box, 30, 0, W, H, 'u-panel u-receipt'); rc.o.classList.add('u-receipt-wrap');
  const teeth = 14, tw = W / teeth, zig = [...Array(teeth)].map((_, i) => `${(i * tw).toFixed(1)}px ${H}px, ${((i + .5) * tw).toFixed(1)}px ${H - 18}px`).join(', ');
  rc.p.style.borderRadius = '0'; rc.p.style.clipPath = `polygon(0 0, 100% 0, 100% ${H}px, ${zig}, 0 ${H}px)`;
  A(rc.m, [{transform: `translateY(${-H}px)`}, {transform: `translateY(${-H * .55}px)`, offset: .4}, {transform: `translateY(${-H * .55}px)`, offset: .52}, {transform: 'translateY(0)'}],
    T.b[0] + .35, T.b[2] - T.b[0], {e: 'linear', f: 'both'});                                              // printing, with a short pause
  [50, 100, 150].forEach((y, i) => { K.skel(rc.p, 40, y, [190], T.b[0] + .4 + i * .05); K.skel(rc.p, W - 130, y, [90], T.b[0] + .45 + i * .05); });
  const cut = div('left:0;top:0;width:100%;height:100%', rc.p, `<svg width="${W}" height="${H}"><path class="ln u-thin u-dash" d="M34 212H${W - 34}"/></svg>`);
  K.enter(cut, T.b[0] + .5, 'lead');
  const nb = R1.counter(K, rc.p, W / 2, 300, R2.fitSize(s.value, W - 80, 120), T.b[1], s.value, T.hit - T.b[1]);
  if (s.unit) K.chipC(rc.p, s.unit, W / 2, 400, T.hit - .2, {size: 40, tone: 'acc'});
  K.punch(nb, T.hit + .05);
  const pr = K.panel(210, 60, 580, 110, T.b[0]);                                                            // the printer, drawn last (on top)
  const slot = div('left:0;top:0;width:100%;height:100%', pr.p, '<svg width="580" height="110"><path class="ln" d="M70 66H510"/></svg>'); K.enter(slot, T.b[0] + .15, 'lead');
  K.sat(K.stage, s.icon ?? 'receipt', 120, 115, 100, T.b[0] + .25, {tone: 'main'});
  if (s.dir) K.sat(K.stage, s.dir === 'down' ? 'trending-down' : 'trending-up', 140, 380, 96, T.hit, {tone: s.dir === 'down' ? 'soft' : 'acc'});
  K.sat(K.stage, 'sparkles', 820, 520, 72, T.after, {tone: 'acc'});
}});

/* ================= B07 คำเตือน ================= */
VARIANT('B07', 'sign', {name: 'ป้ายเตือนเด้งลงบนการ์ด', build: (K, s, T) => LAYOUTS.warn.build(K, s, T)});

VARIANT('B07', 'beacon', {name: 'ไฟเตือนหมุนกะพริบ', build(K, s, T) {
  const it = s.thing, lx = 500, ly = 205;
  const beam = div(`left:${lx - 380}px;top:${ly - 380}px;width:760px;height:760px;border-radius:50%;opacity:0`, K.stage); beam.className = 'u-beam';
  A(beam, [{opacity: 0}, {opacity: 1}], T.b[1], .3, {f: 'forwards'});
  A(beam, [{transform: 'rotate(0deg)'}, {transform: 'rotate(720deg)'}], T.b[1], T.t1 - T.b[1], {e: 'linear', f: 'both'});
  const P = K.panel(290, 300, 420, 320, T.b[0]);
  const hero = K.badge(P.p, it.icon, 210, 130, 160, T.b[0] + .15, {tone: it.tone ?? 'main'});
  if (it.label) K.chipC(P.p, it.label, 210, 262, T.b[0] + .3, {size: 42}); else K.skel(P.p, 110, 252, [200], T.b[0] + .3);
  const base = node(K.stage, lx - 95, ly + 12, 190, 52, 'u-badge u-main'); base.p.style.borderRadius = '16px'; K.enter(base.o, T.b[0] + .2, 'pop');
  /* the shine follows the dome's curve 20 px inside its edge (Friend 2026-11-11 "เส้นที่มันเลยออกมานิดนึงอะ": the old one poked out over the top) */
  const lamp = node(K.stage, lx - 80, ly - 80, 160, 100, '', '<svg width="160" height="100"><path class="u-lamp" d="M8 96A72 72 0 0 1 152 96Z"/><path class="ln u-thin" d="M46.6 56.2A52 52 0 0 1 75.5 44.2"/></svg>');
  K.enter(lamp.o, T.b[0] + .25, 'drop');
  const flash = div(`left:${lx - 150}px;top:${ly - 160}px;width:300px;height:300px;border-radius:50%;opacity:0`, K.stage); flash.className = 'u-flash';
  A(flash, [{opacity: 0}, {opacity: 1, offset: .3}, {opacity: 0}], T.b[1], .55, {e: 'ease-out', f: 'none', it: Math.ceil((T.t1 - T.b[1]) / .55)});
  K.shake(lamp.p, T.b[2]); R1.pulse(K, K.stage, lx, ly - 20, 150, T.hit, 3);
  K.shake(P.p, T.hit);
  if (s.how === 'cross') { K.mark(P.p, 'cross', 350, 70, 84, T.hit); K.fade(hero.o, T.hit + .1, 1, .45); }
}});

VARIANT('B07', 'stamp', {name: 'ตราห้ามประทับลงบนของ', build(K, s, T) {
  const it = s.thing, cx = 500, cy = 280, Z = 330;                          // the stamp lands on the icon, the word under it stays readable
  K.halo(K.stage, cx, cy, 340, T.b[0]);
  const P = K.panel(230, 90, 540, 470, T.b[0]);
  const hero = K.badge(P.p, it.icon, 270, 190, 200, T.b[0] + .15, {tone: it.tone ?? 'main'});
  K.float(hero, T.b[0] + .8, T.hit - .3);
  if (it.label) K.chipC(P.p, it.label, 270, 365, T.b[0] + .3, {size: 46}); else K.skel(P.p, 160, 352, [220, 150], T.b[0] + .3);
  const mark = s.how === 'cross'
    ? '<circle class="u-stamp" cx="165" cy="165" r="140"/><path class="u-stamp" d="M66 66L264 264"/>'
    : '<path class="u-stamp" d="M165 34L300 280H30Z"/><path class="u-stamp" d="M165 120V196"/><circle class="u-stamp-dot" cx="165" cy="238" r="13"/>';
  const st = node(K.stage, cx - Z / 2, cy - Z / 2, Z, Z, '', `<svg width="${Z}" height="${Z}">${mark}</svg>`);
  A(st.o, [{opacity: 0, transform: 'scale(1.9) rotate(-26deg)'}, {opacity: 1, transform: 'scale(1) rotate(-12deg)'}], T.hit - .22, .22, {e: 'cubic-bezier(.55,0,1,.45)'});
  K.punch(P.p, T.hit); R1.pulse(K, K.stage, cx, cy, 190, T.hit, 1);
  if (s.how === 'cross') K.fade(hero.o, T.after, 1, .5);
  K.sat(K.stage, s.sign ?? 'triangle-alert', 840, 120, 100, T.b[1], {tone: 'neg'});
}});

/* ================= B11 คำพูด / แชต / รีวิว ================= */
const R2chat = s => {                                  // the same slots read as a chat
  const q = {side: s.from === 'me' ? 'right' : 'left', label: s.quote};
  return {bubbles: [{side: q.side === 'left' ? 'left' : 'right'}, {side: q.side === 'left' ? 'right' : 'left'}, q], react: s.react, seen: s.gone};
};
VARIANT('B11', 'phone', {name: 'แชตในมือถือ', ui: true, build: (K, s, T) => LAYOUTS.chat.build(K, R2chat(s), T)});

VARIANT('B11', 'review', {name: 'การ์ดรีวิวมีดาว', fits: s => ['comment', 'review'].includes(s.kind) || !!s.mood, build(K, s, T) {
  const bad = s.mood === 'bad';
  K.halo(K.stage, 500, 300, 380, T.b[0]);
  const P = K.panel(170, 70, 660, 480, T.b[0]);
  K.badge(P.p, s.who ?? 'user', 110, 110, 120, T.b[0] + .15, {tone: 'main', shape: 'round'});
  K.skel(P.p, 200, 84, [230, 140], T.b[0] + .25);
  const st = K.stars(P.p, 330, 255, 5, 78, T.b[0] + .35);
  st.light(T.b[1], bad ? 1 : s.mood === 'good' ? 5 : 4);
  const q = s.quote ? K.chipC(P.p, s.quote, 330, 390, T.b[2], {size: 50, tone: bad ? 'main' : 'acc'}) : null;
  if (!q) K.skel(P.p, 120, 370, [420, 300], T.b[2]);
  if (q) K.punch(q, T.hit + .05);
  const r = K.sat(P.p, s.react ?? (bad ? 'thumbs-down' : 'heart'), 570, 110, 96, T.after, {tone: bad ? 'neg' : 'acc', shape: 'round'});
  R1.ripple(K, r, T.after + .2, {tone: bad ? 'neg' : 'acc', grow: 30});
}});

VARIANT('B11', 'notify', {name: 'แจ้งเตือนเด้งซ้อนกัน', ui: true, build(K, s, T) {
  const n = 3, when = LG.spread(T.b[0] + .3, T.hit - .15, n), X = 180, Y = 110, Wd = 640, Hd = 128, gap = 150;
  const bell = K.sat(K.stage, 'bell', 885, 70, 92, T.b[0], {tone: 'acc', shape: 'round'});
  const cards = [];
  for (let k = 0; k < n; k++) {
    const last = k === n - 1, c = node(K.stage, X, Y, Wd, Hd, 'u-panel u-note');
    c.p.style.borderRadius = '30px';
    K.enter(c.o, when[k], 'drop');
    K.badge(c.p, s.app ?? 'message-circle', 70, Hd / 2, 82, when[k] + .08, {tone: last ? 'acc' : 'main'});
    if (last && s.quote) K.label(c.p, s.quote, 130, Hd / 2 - 30, {size: 46});
    else K.skel(c.p, 132, 40, [last ? 320 : 360, 220], when[k] + .12, {h: 16, gap: 20});
    K.shake(bell.p, when[k]);
    cards.forEach((o, i) => { const from = (k - 1 - i) * gap, to = (k - i) * gap; K.move(o.m, when[k] - .4, `translateY(${from}px)`, `translateY(${to}px)`); if (k - i === 2) K.fade(o.o, when[k], 1, .55); });   // make room first, so cards never cross
    cards.push(c);
  }
  K.punch(cards[n - 1].p, T.hit);
  if (s.react) K.sat(K.stage, s.react, 885, 300, 92, T.after, {tone: s.mood === 'bad' ? 'neg' : 'acc', shape: 'round'});
}});

/* ================= B08 เป้าหมาย / ผลลัพธ์ ================= */
VARIANT('B08', 'target', {name: 'ลูกศรเข้าเป้า', build(K, s, T) {
  LAYOUTS.aim.build(K, {as: 'target'}, T);
  /* the goal itself, once the arrow is in (round 15: the target never showed what the sentence's goal was) */
  const gl = K.badge(K.stage, s.goal?.icon ?? 'flag', 190, 140, 140, T.after, {tone: 'acc'}); R1.ripple(K, gl, LG.arrive('pop', T.after));
  if (s.goal?.label) K.chipC(K.stage, s.goal.label, 190, 262, T.after + .15, {size: 40});
}});

VARIANT('B08', 'stairs', {name: 'ไต่บันไดถึงธง', build(K, s, T) {
  const xs = [150, 320, 490, 660], hs = [100, 190, 280, 370], bottom = 620, sw = 160, M = 92;
  hs.forEach((h, i) => { const b = node(K.stage, xs[i], bottom - h, sw, h, 'u-col u-step'); b.p.style.borderRadius = '18px 18px 6px 6px'; K.enter(b.o, T.b[0] + i * .08, 'rise'); });
  const top = bottom - hs[3], flagX = 788;
  const pole = div('left:0;top:0;width:1000px;height:700px', K.stage, `<svg width="1000" height="700"><path class="ln u-thin" d="M${flagX - 40} ${top}V${top - 150}"/></svg>`);
  K.enter(pole, T.b[0] + .35, 'lead');
  const flag = K.badge(K.stage, s.goal?.icon ?? 'flag', flagX, top - 150, 96, T.b[0] + .4, {tone: 'main'});
  flag.m.style.transformOrigin = '0% 50%';
  if (s.goal?.label) K.chipC(K.stage, s.goal.label, flagX - 40, top - 240, T.b[0] + .5, {size: 40});
  const at = i => [xs[i] + sw / 2 - M / 2 - (i === 3 ? 40 : 0), bottom - hs[i] - M - 4];
  const who = K.badge(K.stage, s.who ?? 'user', at(0)[0] + M / 2, at(0)[1] + M / 2, M, T.b[0] + .45, {tone: 'acc', shape: 'round'});
  const hopT = LG.spread(T.b[1], T.hit - .4, 3), rel = i => [at(i)[0] - at(0)[0], at(i)[1] - at(0)[1]];
  hopT.forEach((t, i) => R2.hop(who.m, t, .4, rel(i), rel(i + 1)));
  A(flag.m, [{transform: 'rotate(0deg)'}, {transform: 'rotate(-10deg)'}, {transform: 'rotate(6deg)'}, {transform: 'rotate(-3deg)'}, {transform: 'rotate(0deg)'}], T.hit, .9, {e: 'ease-in-out', f: 'none'});
  K.halo(K.stage, flagX - 60, top - 90, 200, T.hit);
  K.sat(K.stage, 'sparkles', 560, 150, 76, T.after, {tone: 'acc'});
  K.mark(K.stage, 'check', 900 - 40, 330, 80, T.after + .15);
}});

VARIANT('B08', 'trophy', {name: 'แถบความคืบหน้าเต็ม ได้ถ้วยรางวัล', build(K, s, T) {
  const P = K.panel(150, 400, 700, 180, T.b[0]);                          // only the bar now (the made-up "100%" is gone)
  const bar = K.measure(P.p, 50, 90, 600, T.b[0] + .15, 0, s.goal?.icon ?? 'target', {fill: 'u-bar-on'});
  const fillAt = Math.max(T.b[1], T.hit - 1.2);
  bar.set(fillAt, 1);
  K.halo(K.stage, 500, 150, 240, T.hit);
  const cup = K.badge(K.stage, 'trophy', 500, 150, 180, T.hit - .05, {tone: 'acc'});
  K.punch(cup.p, T.hit + .3); K.float(cup, T.hit + .9, T.t1);
  if (s.goal?.label) K.chipC(K.stage, s.goal.label, 500, 272, T.hit + .15, {size: 40});
  K.sat(K.stage, 'sparkles', 300, 140, 76, T.after, {tone: 'acc'});
  K.sat(K.stage, 'star', 710, 110, 66, T.after + .15, {tone: 'acc', shape: 'round'});
}});

/* ================= SMALL FORMS (Friend 2026-11-08: "ไปทำของระบบเลโก้เลย") =================
   The overlay widget of every variant above, drawn 1:1 on the 600 × 340 canvas (overlay.js), from the same slots.
   Rules from Friend's overlay sample clips: no sentence inside (it is the subtitle), 1–3 big things (icons ~100–150 px),
   at most 1–2 words that come from the slots, one clear event on the key word, a card or nothing behind it. */
R2.card = n => { if (ST.panelTheme) n.p.classList.add(...ST.panelTheme.split(' ')); return n; };   // a card made with node() looks like K.panel
R2.ring = (K, cx, cy, R, w, t) => {                  // a ring track with the accent arc (both arcs start empty)
  const S = R + w, c = `cx="${S}" cy="${S}" r="${R}"`, arc = cls => `<circle class="${cls}" ${c} pathLength="100" stroke-dasharray="100 100" stroke-dashoffset="100" transform="rotate(-90 ${S} ${S})"/>`;
  const g = node(K.stage, cx - S, cy - S, 2 * S, 2 * S, '', `<svg width="${2 * S}" height="${2 * S}"><circle class="u-ring" ${c} style="stroke-width:${w}px"/>${arc('u-ring-edge')}${arc('u-ring-on')}</svg>`);
  g.p.querySelectorAll('.u-ring-on').forEach(a => a.style.strokeWidth = w + 'px');
  g.p.querySelectorAll('.u-ring-edge').forEach(a => a.style.strokeWidth = `calc(${w}px + 2px * var(--lw-ac, 0))`);
  K.enter(g.o, t, 'pop'); return g;
};

/* B01 ตัวเลขเด่น */
SMALLV('B01', 'big', (K, s, T) => {
  const P = K.panel(50, 50, 500, 240, T.b[0]);
  K.badge(P.p, s.icon ?? 'hash', 104, 120, 124, T.b[0] + .15, {tone: 'main'});
  const nb = R1.counter(K, P.p, 330, s.unit ? 98 : 120, R2.fitSize(s.value, 260, 132), T.b[1], s.value, T.hit - T.b[1]);
  if (s.unit) SM.word(K, P.p, s.unit, 330, 160, 46, T.hit - .2, 'center');
  if (s.dir) K.badge(P.p, s.dir === 'down' ? 'trending-down' : 'trending-up', 450, 196, 62, T.hit, {tone: s.dir === 'down' ? 'neg' : 'acc', shape: 'round'});
  K.punch(nb, T.hit + .05);
});
SMALLV('B01', 'ring', (K, s, T) => {
  const cx = 300, cy = 170, R = 128, w = 26, pct = /%/.test(s.value) ? Math.min(1, R2.num(s) / 100) : 1, d = T.hit - T.b[1];
  const g = R2.ring(K, cx, cy, R, w, T.b[0]);
  g.p.querySelectorAll('.u-ring-edge,.u-ring-on').forEach(a => {
    A(a, [{opacity: 0}, {opacity: 1}], T.b[1], .12);
    A(a, [{strokeDashoffset: 100}, {strokeDashoffset: 100 - 100 * pct}], T.b[1], d, {e: 'cubic-bezier(.33,1,.68,1)'});
  });
  R1.counter(K, K.stage, cx, cy - (s.unit ? 20 : 0), R2.fitSize(s.value, 180, 104), T.b[1], s.value, d);
  if (s.unit) SM.word(K, K.stage, s.unit, cx, cy + 30, 36, T.hit - .2, 'center');
  if (s.icon) K.badge(K.stage, s.icon, 90, 96, 104, T.b[0] + .2, {tone: 'main'});
  if (s.dir) K.badge(K.stage, s.dir === 'down' ? 'trending-down' : 'trending-up', 510, 96, 88, T.hit, {tone: s.dir === 'down' ? 'neg' : 'acc', shape: 'round'});
  K.punch(g.p, T.hit); R1.ripple(K, g, T.hit + .1, {r: '50%', grow: 34});
});
SMALLV('B01', 'receipt', (K, s, T) => {
  const W = 300, H = 250, x = 150, top = 80;
  const box = div(`left:${x - 30}px;top:${top}px;width:${W + 60}px;height:${H + 30}px;overflow:hidden`, K.stage);
  const rc = R2.card(node(box, 30, 0, W, H, 'u-panel u-receipt')); rc.o.classList.add('u-receipt-wrap');
  const teeth = 12, tw = W / teeth, zig = [...Array(teeth)].map((_, i) => `${(i * tw).toFixed(1)}px ${H}px, ${((i + .5) * tw).toFixed(1)}px ${H - 14}px`).join(', ');
  rc.p.style.borderRadius = '0'; rc.p.style.clipPath = `polygon(0 0, 100% 0, 100% ${H}px, ${zig}, 0 ${H}px)`;
  A(rc.m, [{transform: `translateY(${-H}px)`}, {transform: `translateY(${-H * .5}px)`, offset: .4}, {transform: `translateY(${-H * .5}px)`, offset: .52}, {transform: 'translateY(0)'}],
    T.b[0] + .3, T.b[2] - T.b[0], {e: 'linear', f: 'both'});
  [34, 70].forEach((y, i) => { K.skel(rc.p, 30, y, [150], T.b[0] + .35 + i * .05); K.skel(rc.p, W - 100, y, [70], T.b[0] + .4 + i * .05); });
  const cut = div('left:0;top:0;width:100%;height:100%', rc.p, `<svg width="${W}" height="${H}"><path class="ln u-thin u-dash" d="M26 112H${W - 26}"/></svg>`); K.enter(cut, T.b[0] + .45, 'lead');
  const nb = R1.counter(K, rc.p, W / 2, 162, R2.fitSize(s.value, W - 50, 92), T.b[1], s.value, T.hit - T.b[1]);
  if (s.unit) SM.word(K, rc.p, s.unit, W / 2, 196, 34, T.hit - .2, 'center');
  K.punch(nb, T.hit + .05);
  const pr = K.panel(100, 20, 400, 64, T.b[0]);
  const slot = div('left:0;top:0;width:100%;height:100%', pr.p, '<svg width="400" height="64"><path class="ln" d="M60 40H340"/></svg>'); K.enter(slot, T.b[0] + .15, 'lead');
});

/* B07 คำเตือน */
SMALLV('B07', 'sign', (K, s, T) => {
  const it = s.thing;
  const hero = K.badge(K.stage, it.icon, 240, 160, 170, T.b[0], {tone: it.tone ?? 'main'});
  K.float(hero, T.b[0] + .7, T.b[2], .6);
  if (it.label) SM.word(K, K.stage, it.label, 240, 258, 42, T.b[0] + .3, 'center');
  const sign = K.badge(K.stage, s.sign ?? 'triangle-alert', 410, 92, 124, T.b[1], {tone: 'neg'});
  R1.ripple(K, sign, T.b[1] + .3, {times: 2, tone: 'neg', grow: 34});
  K.shake(sign.p, T.b[2]);
  if (s.how === 'cross') { K.mark(K.stage, 'cross', 240, 160, 150, T.hit); K.fade(hero.o, T.hit + .1, 1, .45); }
  else { K.shake(hero.p, T.hit); R1.ripple(K, hero, T.hit, {times: 2, tone: 'neg', grow: 36}); }
});
SMALLV('B07', 'beacon', (K, s, T) => {
  const it = s.thing, lx = 300, ly = 98;
  const beam = div(`left:${lx - 280}px;top:${ly - 280}px;width:560px;height:560px;border-radius:50%;opacity:0`, K.stage); beam.className = 'u-beam';
  A(beam, [{opacity: 0}, {opacity: 1}], T.b[1], .3, {f: 'forwards'});
  A(beam, [{transform: 'rotate(0deg)'}, {transform: 'rotate(720deg)'}], T.b[1], T.t1 - T.b[1], {e: 'linear', f: 'both'});
  const base = node(K.stage, lx - 76, ly + 8, 152, 40, 'u-badge u-main'); base.p.style.borderRadius = '14px'; K.enter(base.o, T.b[0] + .15, 'pop');
  const lamp = node(K.stage, lx - 64, ly - 64, 128, 80, '', '<svg width="128" height="80"><path class="u-lamp" d="M6 76A58 58 0 0 1 122 76Z"/></svg>');
  K.enter(lamp.o, T.b[0] + .2, 'drop');
  const flash = div(`left:${lx - 120}px;top:${ly - 130}px;width:240px;height:240px;border-radius:50%;opacity:0`, K.stage); flash.className = 'u-flash';
  A(flash, [{opacity: 0}, {opacity: 1, offset: .3}, {opacity: 0}], T.b[1], .55, {e: 'ease-out', f: 'none', it: Math.ceil((T.t1 - T.b[1]) / .55)});
  const hero = K.badge(K.stage, it.icon, lx, 248, 150, T.b[0] + .1, {tone: it.tone ?? 'main'});
  if (it.label) SM.word(K, K.stage, it.label, lx + 96, 222, 42, T.b[0] + .3);
  K.shake(lamp.p, T.b[2]); R1.pulse(K, K.stage, lx, ly - 10, 120, T.hit, 3);
  K.shake(hero.p, T.hit);
  if (s.how === 'cross') { K.mark(K.stage, 'cross', lx, 248, 130, T.hit); K.fade(hero.o, T.hit + .1, 1, .45); }
});
SMALLV('B07', 'stamp', (K, s, T) => {
  const it = s.thing, Z = 250;
  const P = K.panel(140, 14, 320, 312, T.b[0]);
  const hero = K.badge(P.p, it.icon, 160, 130, 160, T.b[0] + .15, {tone: it.tone ?? 'main'});
  if (it.label) SM.word(K, P.p, it.label, 160, 232, 42, T.b[0] + .3, 'center');
  const mark = s.how === 'cross'
    ? '<circle class="u-stamp" cx="125" cy="125" r="104"/><path class="u-stamp" d="M52 52L198 198"/>'
    : '<path class="u-stamp" d="M125 26L226 210H24Z"/><path class="u-stamp" d="M125 90V148"/><circle class="u-stamp-dot" cx="125" cy="180" r="11"/>';
  const st = node(K.stage, 300 - Z / 2, 144 - Z / 2, Z, Z, '', `<svg width="${Z}" height="${Z}">${mark}</svg>`);
  A(st.o, [{opacity: 0, transform: 'scale(1.9) rotate(-26deg)'}, {opacity: 1, transform: 'scale(1) rotate(-12deg)'}], T.hit - .22, .22, {e: 'cubic-bezier(.55,0,1,.45)'});
  K.punch(P.p, T.hit); R1.pulse(K, K.stage, 300, 144, 150, T.hit, 1);
  if (s.how === 'cross') K.fade(hero.o, T.after, 1, .5);
});

/* B11 คำพูด / แชต / รีวิว */
SMALLV('B11', 'phone', (K, s, T) => {                // the person and what they said; if they are gone, both fade away
  const who = K.badge(K.stage, s.who ?? 'user', 110, 196, 140, T.b[0], {tone: 'main'});
  K.float(who, T.b[0] + .6, T.hit, .5);
  const b = s.quote ? R1.bubble(K, K.stage, 210, 74, Math.min(400, 120 + graphemes(s.quote).length * 22), 'left', T.b[1], s.quote)
                    : R1.bubble(K, K.stage, 210, 84, 300, 'left', T.b[1]);
  K.punch(b.p, T.b[2]);
  if (s.gone) {
    K.fade(b.o, T.hit, 1, .15); K.fade(who.o, T.hit + .12, 1, .22);
    K.move(who.m, T.hit + .12, 'none', 'translateY(16px) scale(.94)');
    K.sat(K.stage, 'eye-off', 520, 220, 72, T.hit + .3, {tone: 'soft', shape: 'round', k: .6});
  } else if (s.react) {
    const r = K.sat(K.stage, s.react, 470, 236, 84, T.hit, {tone: s.mood === 'bad' ? 'neg' : 'acc', shape: 'round', k: .6});
    R1.ripple(K, r, T.hit + .2, {tone: s.mood === 'bad' ? 'neg' : 'acc', grow: 26});
  }
});
SMALLV('B11', 'review', (K, s, T) => {
  const bad = s.mood === 'bad';
  const P = K.panel(50, 30, 500, 280, T.b[0]);
  K.badge(P.p, s.who ?? 'user', 84, 82, 96, T.b[0] + .15, {tone: 'main', shape: 'round'});
  K.skel(P.p, 152, 66, [170], T.b[0] + .25);
  const st = K.stars(P.p, 250, 166, 5, 64, T.b[0] + .35); st.light(T.b[1], bad ? 1 : s.mood === 'good' ? 5 : 4);
  if (s.quote) { const q = K.chipC(P.p, s.quote, 250, 238, T.b[2], {size: 44, tone: bad ? 'main' : 'acc'}); K.punch(q, T.hit + .05); }
  K.sat(P.p, s.react ?? (bad ? 'thumbs-down' : 'heart'), 430, 82, 80, T.after, {tone: bad ? 'neg' : 'acc', shape: 'round', k: .6});
});
SMALLV('B11', 'notify', (K, s, T) => {
  const n = 2, when = LG.spread(T.b[0] + .3, T.hit - .15, n), X = 50, Y = 60, Wd = 470, Hd = 116, gap = 136;
  const bell = K.sat(K.stage, 'bell', 560, 50, 80, T.b[0], {tone: 'acc', shape: 'round', k: .5});
  const cards = [];
  for (let k = 0; k < n; k++) {
    const last = k === n - 1, c = R2.card(node(K.stage, X, Y, Wd, Hd, 'u-panel u-note'));
    c.p.style.borderRadius = '30px'; K.enter(c.o, when[k], 'drop');
    K.badge(c.p, s.app ?? 'message-circle', 64, Hd / 2, 80, when[k] + .08, {tone: last ? 'acc' : 'main'});
    if (last && s.quote) SM.word(K, c.p, s.quote, 124, Hd / 2 - 28, 44, when[k] + .15);
    else K.skel(c.p, 126, 38, [280, 180], when[k] + .12, {h: 16, gap: 20});
    K.shake(bell.p, when[k]);
    cards.forEach((o, i) => K.move(o.m, when[k] - .4, `translateY(${(k - 1 - i) * gap}px)`, `translateY(${(k - i) * gap}px)`));
    cards.push(c);
  }
  K.punch(cards[n - 1].p, T.hit);
});

/* B08 เป้าหมาย / ผลลัพธ์ */
SMALLV('B08', 'target', (K, s, T) => {
  K.target(K.stage, 300, 178, 138, T.b[0]).hit(T.hit, {angle: -35, dist: 300});
  const gl = K.badge(K.stage, s.goal?.icon ?? 'flag', 92, 74, 96, T.after, {tone: 'acc'}); R1.ripple(K, gl, LG.arrive('pop', T.after));   // the goal, once the arrow is in
  if (s.goal?.label) R4.word(K, K.stage, s.goal.label, 92, 128, 32, T.after + .15, 170);
});
SMALLV('B08', 'stairs', (K, s, T) => {
  const xs = [80, 190, 300, 410], hs = [56, 112, 168, 224], bottom = 326, sw = 104, M = 72;
  hs.forEach((h, i) => { const b = node(K.stage, xs[i], bottom - h, sw, h, 'u-col u-step'); b.p.style.borderRadius = '16px 16px 6px 6px'; K.enter(b.o, T.b[0] + i * .08, 'rise'); });
  const top = bottom - hs[3], flagX = 500;
  const pole = div('left:0;top:0;width:600px;height:340px', K.stage, `<svg width="600" height="340"><path class="ln u-thin" d="M${flagX - 30} ${top}V${top - 92}"/></svg>`);
  K.enter(pole, T.b[0] + .35, 'lead');
  const flag = K.badge(K.stage, s.goal?.icon ?? 'flag', flagX, top - 92, 76, T.b[0] + .4, {tone: 'main'});
  flag.m.style.transformOrigin = '0% 50%';
  const at = i => [xs[i] + sw / 2 - M / 2 - (i === 3 ? 26 : 0), bottom - hs[i] - M - 4];
  const who = K.badge(K.stage, s.who ?? 'user', at(0)[0] + M / 2, at(0)[1] + M / 2, M, T.b[0] + .45, {tone: 'acc', shape: 'round'});
  const rel = i => [at(i)[0] - at(0)[0], at(i)[1] - at(0)[1]];
  LG.spread(T.b[1], T.hit - .4, 3).forEach((t, i) => R2.hop(who.m, t, .4, rel(i), rel(i + 1), 56));
  A(flag.m, [{transform: 'rotate(0deg)'}, {transform: 'rotate(-12deg)'}, {transform: 'rotate(7deg)'}, {transform: 'rotate(-3deg)'}, {transform: 'rotate(0deg)'}], T.hit, .9, {e: 'ease-in-out', f: 'none'});
  K.mark(K.stage, 'check', 560, 196, 70, T.after);
});
SMALLV('B08', 'trophy', (K, s, T) => {
  const P = K.panel(40, 186, 520, 140, T.b[0]);
  const bar = K.measure(P.p, 26, 70, 470, T.b[0] + .15, 0, s.goal?.icon ?? 'target', {fill: 'u-bar-on', size: 84});
  const fillAt = Math.max(T.b[1], T.hit - 1.2);
  bar.set(fillAt, 1);
  if (s.goal?.label) R4.word(K, K.stage, s.goal.label, 450, 74, 40, T.hit, 200);   // no made-up "100%" (round 15): the goal's own words
  const cup = K.badge(K.stage, 'trophy', 240, 92, 150, T.hit - .05, {tone: 'acc'});
  K.punch(cup.p, T.hit + .3); R1.ripple(K, cup, T.hit + .25);
});

/* ================= sample sentences of round 2 (one per category, shown in every variant) ================= */
SENTENCE('r2.money', {cat: 'B01', name: 'ค่าโฆษณาเดือนละ 3,000 บาท', say: ['ค่าโฆษณาเดือนละ', '3,000 บาท'], value: '3,000', unit: 'บาท', icon: 'megaphone'});
SENTENCE('r2.years', {cat: 'B01', name: 'ทำคลิปมา 4 ปี', say: ['ผมทำคลิปมา', '4 ปี'], value: '4', unit: 'ปี', icon: 'video'});
SENTENCE('r2.loan', {cat: 'B07', name: 'อย่ากู้มาลงทุน', say: ['อย่ากู้เงิน', 'มาลงทุน'], thing: {icon: 'landmark', label: 'กู้เงิน'}, how: 'cross', sign: 'octagon-alert'});
SENTENCE('r2.review', {cat: 'B11', name: 'คอมเมนต์ว่าได้ผลจริง', say: ['คอมเมนต์ว่า ลองแล้ว', 'ได้ผลจริง'], kind: 'comment', quote: 'ได้ผลจริง', mood: 'good', react: 'heart'});
SENTENCE('r2.goal', {cat: 'B08', name: 'ทำต่อเนื่องจนถึงเป้า', say: ['ทำต่อเนื่องทุกวัน จนถึง', 'เป้าหมาย'], goal: {icon: 'flag'}});
