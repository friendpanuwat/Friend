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
  K.punch(g.p, T.hit); R1.pulse(K, K.stage, cx, cy, R + 40, T.hit, 1, 'acc');
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
  const lamp = node(K.stage, lx - 80, ly - 80, 160, 100, '', '<svg width="160" height="100"><path class="u-lamp" d="M8 96A72 72 0 0 1 152 96Z"/><path class="ln u-thin" d="M58 44A30 30 0 0 1 86 26"/></svg>');
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
VARIANT('B11', 'phone', {name: 'แชตในมือถือ', build: (K, s, T) => LAYOUTS.chat.build(K, R2chat(s), T)});

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
  R1.pulse(K, P.p, 570, 110, 80, T.after, 1, bad ? 'neg' : 'acc');
}});

VARIANT('B11', 'notify', {name: 'แจ้งเตือนเด้งซ้อนกัน', build(K, s, T) {
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
VARIANT('B08', 'target', {name: 'ลูกศรเข้าเป้า', build: (K, s, T) => LAYOUTS.aim.build(K, {as: 'target'}, T)});

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
  const P = K.panel(150, 320, 700, 280, T.b[0]);
  const bar = K.measure(P.p, 50, 185, 600, T.b[0] + .15, 0, s.goal?.icon ?? 'target', {fill: 'u-bar-on'});
  const fillAt = Math.max(T.b[1], T.hit - 1.2);
  bar.set(fillAt, 1);
  R1.counter(K, P.p, 350, 78, 92, fillAt, '100%', T.hit - fillAt);
  K.halo(K.stage, 500, 150, 240, T.hit);
  const cup = K.badge(K.stage, 'trophy', 500, 150, 180, T.hit - .05, {tone: 'acc'});
  K.punch(cup.p, T.hit + .3); K.float(cup, T.hit + .9, T.t1);
  if (s.goal?.label) K.chipC(K.stage, s.goal.label, 500, 272, T.hit + .15, {size: 40});
  K.sat(K.stage, 'sparkles', 300, 140, 76, T.after, {tone: 'acc'});
  K.sat(K.stage, 'star', 710, 110, 66, T.after + .15, {tone: 'acc', shape: 'round'});
}});

/* ================= sample sentences of round 2 (one per category, shown in every variant) ================= */
SENTENCE('r2.money', {cat: 'B01', name: 'ค่าโฆษณาเดือนละ 3,000 บาท', say: ['ค่าโฆษณาเดือนละ', '3,000 บาท'], value: '3,000', unit: 'บาท', icon: 'megaphone'});
SENTENCE('r2.years', {cat: 'B01', name: 'ทำคลิปมา 4 ปี', say: ['ผมทำคลิปมา', '4 ปี'], value: '4', unit: 'ปี', icon: 'video'});
SENTENCE('r2.loan', {cat: 'B07', name: 'อย่ากู้มาลงทุน', say: ['อย่ากู้เงิน', 'มาลงทุน'], thing: {icon: 'landmark', label: 'กู้เงิน'}, how: 'cross', sign: 'octagon-alert'});
SENTENCE('r2.review', {cat: 'B11', name: 'คอมเมนต์ว่าได้ผลจริง', say: ['คอมเมนต์ว่า ลองแล้ว', 'ได้ผลจริง'], kind: 'comment', quote: 'ได้ผลจริง', mood: 'good', react: 'heart'});
SENTENCE('r2.goal', {cat: 'B08', name: 'ทำต่อเนื่องจนถึงเป้า', say: ['ทำต่อเนื่องทุกวัน จนถึง', 'เป้าหมาย'], goal: {icon: 'flag'}});
