/* =====================================================================
   CutPack · uni · SMALL FORMS for overlay widgets (Friend 2026-11-07: "ตกลงตามแนวทางนี้")
   Rules taken from Friend's overlay sample clips (same script in 3 styles):
     no sentence in the widget (it is the subtitle under the chin) · 1–3 big things, icons about 100–150 px ·
     at most 1–2 words of label, taken from what is said · one clear event on the key word · a card, or nothing behind it
   Drawn 1:1 on a 600 × 340 canvas (overlay.js puts it above the head). Same rule as every scene: no colour, font or speed.
   Test sentences: the six base meanings, which come from Friend's script ("ทักมาแล้วหายไป", clip01-customers).
   ===================================================================== */
const SM = {
  /* an icon drawn straight on the card or the video (no holder), in the ink colour */
  ico(K, parent, icon, cx, cy, size, t, kind = 'pop') {
    const e = div(`left:${cx - size / 2}px;top:${cy - size / 2}px;width:${size}px;height:${size}px`, parent, ICO(icon, size)); e.className = 'ov-ico';
    if (t != null) K.enter(e, t, kind); return e;
  },
  word(K, parent, txt, x, y, size, t, anchor = 'left') {
    const l = K.label(parent, txt, x, y, {size, anchor}); if (t != null) K.enter(l, t, 'lead'); return l;
  },
};

/* ---------- คำพูด / แชต: the B11 'phone' variant has its small form in lego_r2.js (SMALLV) ---------- */
SENTENCE('ov.ask', {cat: 'B11', name: 'ลูกค้าทักมาถามรายละเอียดสินค้า แล้วหายไป', say: ['ทักมาถามรายละเอียดสินค้า', 'แล้วหายไป'],
  kind: 'chat', quote: 'รายละเอียดสินค้า?', gone: true});

/* ---------- ลังเล: the switch between buy and not-buy cannot settle ---------- */
SMALL('undecided', (K, s, T) => {
  const P = K.panel(40, 34, 520, 252, T.b[0]);
  const tr = node(P.p, 44, 36, 432, 136, 'u-track'); tr.p.style.borderRadius = '68px'; K.enter(tr.o, T.b[0] + .1, 'pop');
  SM.ico(K, tr.p, 'check', 74, 68, 62, T.b[0] + .25);
  SM.ico(K, tr.p, 'x', 358, 68, 62, T.b[0] + .3);
  const kn = node(tr.p, 216 - 60, 8, 120, 120, 'u-badge u-acc'); kn.p.style.borderRadius = '50%'; K.enter(kn.o, T.b[0] + .35, 'pop');
  A(kn.m, [0, -92, 76, -54, 36, 0].map(x => ({transform: `translateX(${x}px)`})), T.b[1], T.hit - T.b[1] + .3, {e: 'ease-in-out', f: 'none'});   // it cannot decide
  SM.word(K, P.p, 'ซื้อ', 118, 182, 40, T.b[0] + .4, 'center'); SM.word(K, P.p, 'ไม่ซื้อ', 402, 182, 40, T.b[0] + .45, 'center');
  const q = SM.ico(K, kn.p, 'circle-help', 60, 60, 64, null); K.fade(q, T.hit + .25, 0, 1, {hold: true});
  K.punch(kn.p, T.hit + .3);
  K.say(s.lead, s.key);
});

/* ---------- ไม่คุ้ม: a floating scale, the money side goes down ---------- */
SMALL('not-worth', (K, s, T) => {
  const g = node(K.stage, 0, 0, 600, 340, ''); g.m.style.transformOrigin = '300px 226px';
  const beam = div('left:0;top:0;width:600px;height:340px', g.p, '<svg width="600" height="340"><path class="ln" d="M70 226H530"/></svg>');
  K.draw(beam.querySelector('path'), T.b[0]);
  const base = div('left:0;top:0;width:600px;height:340px', K.stage, '<svg width="600" height="340"><path class="sd" d="M300 232L248 312H352Z"/></svg>');
  K.enter(base, T.b[0] + .1, 'rise');
  K.badge(g.p, 'banknote', 150, 150, 142, T.b[1], {tone: 'acc', kind: 'drop'});
  K.badge(g.p, 'package', 450, 150, 142, T.b[1] + .18, {tone: 'main', kind: 'drop'});
  K.move(g.m, T.hit - .15, 'rotate(0deg)', 'rotate(-9deg)', {kind: 'tilt'});         // what you pay outweighs what you get
  K.say(s.lead, s.key);
});

/* ---------- ลดราคาแล้วก็ยังไม่ซื้อ: the price slides down, the cart still does not move ---------- */
SMALL('price-cut', (K, s, T) => {
  const P = K.panel(40, 30, 520, 270, T.b[0]);
  SM.ico(K, P.p, 'tag', 68, 68, 52, T.b[0] + .15); SM.word(K, P.p, 'ราคา', 108, 40, 44, T.b[0] + .2);
  const sl = K.slider(P.p, 60, 150, 400, T.b[0] + .25, 1, {knobIcon: 'tag', k: 84});
  sl.set(T.b[1], .58); sl.set(T.b[2], .2);
  const cart = K.badge(P.p, 'shopping-cart', 96, 222, 84, T.b[1] + .15, {tone: 'soft'});
  K.shake(cart.p, T.hit);
  K.badge(P.p, 'x', 136, 184, 42, T.hit + .05, {tone: 'neg', shape: 'round'});
  K.say(s.lead, s.key);
});

/* ---------- ข้อแรกไม่ใช่: the to-do list, "lower the price" gets crossed out ---------- */
SMALL('not-first', (K, s, T) => {
  const P = K.panel(40, 40, 520, 250, T.b[0]);
  SM.ico(K, P.p, 'list-checks', 68, 66, 52, T.b[0] + .15); SM.word(K, P.p, 'สิ่งที่ควรทำ', 108, 38, 44, T.b[0] + .2);
  const box = node(P.p, 38, 132, 82, 82, 'u-box'); box.p.style.borderRadius = '18px'; K.enter(box.o, T.b[0] + .35, 'pop');
  const w = SM.word(K, P.p, 'ลดราคา', 150, 136, 56, T.b[1]);
  K.badge(P.p, 'x', 79, 173, 82, T.hit, {tone: 'neg'});
  const strike = div('left:144px;top:171px;height:8px;border-radius:4px;transform-origin:0 50%;background:var(--neg)', P.p);
  FITS.push(() => { strike.style.width = w.offsetWidth + 14 + 'px'; });
  A(strike, [{transform: 'scaleX(0)'}, {transform: 'none'}], T.hit + .08, .3, {e: 'ease-out'});
  K.fade(w, T.hit + .2, 1, .5);
  K.say(s.lead, s.key);
});

/* ---------- แก้ให้ถูกจุด: the frame closes in, the right piece lights up ---------- */
SMALL('fix-spot', (K, s, T) => {
  const cx = 300, cy = 170;
  K.badge(K.stage, 'puzzle', cx, cy, 128, T.b[0], {tone: 'soft'});
  K.brackets(K.stage, cx, cy, 240, T.b[1], T.b[1] + .15);
  const ok = K.badge(K.stage, 'check', cx, cy, 128, null, {tone: 'acc'});
  K.fade(ok.o, T.hit, 0, 1, {hold: true}); K.punch(ok.p, T.hit + .05);
  R1.pulse(K, K.stage, cx, cy, 140, T.hit, 1, 'acc');
  K.say(s.lead, s.key);
});
