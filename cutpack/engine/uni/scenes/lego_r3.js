/* =====================================================================
   CutPack · uni · LEGO round 3 (Friend 2026-11-08: "เริ่มรอบที่ 3 ได้ครับ"): the six categories that had no picture,
   two variants each, every one with its full-screen and its small (overlay) form.
   One composition per variant, drawn for the 600 × 340 small canvas; the full-screen form is the same composition
   scaled 1.6× in the middle of the 1000 × 700 canvas, so both always say the same thing the same way.
   Slots (the AI writes only these; words on screen come only from them):
     B05 ถูกกับผิด          wrong {icon, label?}, right {icon, label?}
     B06 คำถาม / ลังเล       about? {icon, label?}, options? [{icon, label?}, {icon, label?}], answer? {icon, label?}
     B10 คน / กลุ่มเป้าหมาย   who? {icon}, label?, tags? [word, word]
     B13 เคล็ดลับ / ความลับ   secret {icon, label?}
     B15 ปิดคลิป / ชวนทำต่อ   action ('follow'|'comment'|'save'|'share'|'like'), label?
     B16 นิยาม              term {icon, label}, means [{icon, label?}] (1–3)
   ===================================================================== */
const R3 = {
  /* one variant, two sizes */
  both(cat, id, name, draw, fits) {
    VARIANT(cat, id, {name, fits,
      build(K, s, T) { const g = div('left:20px;top:78px;width:600px;height:340px;transform-origin:0 0;transform:scale(1.6)', K.stage); draw(K, s, T, g, false); },
      small: (K, s, T) => draw(K, s, T, K.stage, true)});
  },
  panel: (K, g, x, y, w, h, t) => K.panel(x, y, w, h, t, {parent: g}),
  line(K, g, d, t, dur) { const e = div('left:0;top:0;width:600px;height:340px', g, `<svg width="600" height="340"><path class="ln" d="${d}"/></svg>`); K.draw(e.querySelector('path'), t, dur); return e; },
  /* a strike line through a word, as long as the word (measured once the fonts are in) */
  strike(K, parent, word, x, y, t) {
    const st = div(`left:${x}px;top:${y}px;height:8px;border-radius:4px;transform-origin:0 50%;background:var(--neg)`, parent);
    FITS.push(() => { st.style.width = word.offsetWidth + 12 + 'px'; });
    A(st, [{transform: 'scaleX(0)'}, {transform: 'none'}], t, .3, {e: 'ease-out'});
    return st;
  },
  ACT: {follow: ['user-plus', 'user-check'], comment: ['message-circle', 'message-circle-heart'], save: ['bookmark', 'bookmark-check'],
        share: ['share-2', 'check'], like: ['heart', 'heart']},
};

/* ================= B05 ถูกกับผิด ================= */
R3.both('B05', 'strike', 'ข้อผิดโดนขีดฆ่า ข้อถูกได้ ✓', (K, s, T, g) => {
  const P = R3.panel(K, g, 40, 24, 520, 292, T.b[0]);
  const row = (it, cy, t) => {
    const box = node(P.p, 34, cy - 40, 80, 80, 'u-box'); box.p.style.borderRadius = '18px'; K.enter(box.o, t, 'pop');
    K.badge(P.p, it.icon, 170, cy, 84, t + .08, {tone: 'main'});
    const w = it.label ? SM.word(K, P.p, it.label, 232, cy - 30, 48, t + .15) : null;
    return {box, w};
  };
  const a = row(s.wrong, 88, T.b[1] - .1), b = row(s.right, 204, T.b[2]);
  K.badge(P.p, 'x', 74, 88, 80, T.hit - .1, {tone: 'neg'});
  if (a.w) { R3.strike(K, P.p, a.w, 226, 84, T.hit); K.fade(a.w, T.hit + .2, 1, .5); }
  K.mark(P.p, 'check', 74, 204, 80, T.hit + .25);
  if (b.w) K.punch(b.w, T.hit + .3);
});
R3.both('B05', 'flip', 'การ์ดพลิกจากผิดเป็นถูก', (K, s, T, g) => {
  const face = (it, tone) => {
    const c = R2.card(node(g, 150, 22, 300, 296, 'u-panel')); c.p.style.borderRadius = '32px';
    K.badge(c.p, it.icon, 150, 116, 136, null, {tone});
    if (it.label) SM.word(K, c.p, it.label, 150, 204, 46, null, 'center');
    return c;
  };
  const front = face(s.wrong, 'soft');
  K.enter(front.o, T.b[0], 'pop');
  K.mark(front.p, 'cross', 252, 48, 72, T.b[2]);
  A(front.m, [{transform: 'scaleX(1)'}, {transform: 'scaleX(0)'}], T.hit - .24, .24, {e: 'ease-in', f: 'forwards'});
  const back = face(s.right, 'acc');
  A(back.m, [{transform: 'scaleX(0)'}, {transform: 'scaleX(1)'}], T.hit, .28, {e: 'cubic-bezier(.2,.9,.3,1.2)'});
  K.mark(back.p, 'check', 252, 48, 72, T.hit + .3);
  R1.ripple(K, back, T.hit + .26, {grow: 44});
});

/* ================= B06 คำถาม / ลังเล ================= */
R3.both('B06', 'switch', 'สวิตช์ค้างกลางระหว่างสองทาง', (K, s, T, g) => {
  const [o1, o2] = s.options;
  const P = R3.panel(K, g, 40, 34, 520, 252, T.b[0]);
  const tr = node(P.p, 44, 36, 432, 136, 'u-track'); tr.p.style.borderRadius = '68px'; K.enter(tr.o, T.b[0] + .1, 'pop');
  SM.ico(K, tr.p, o1.icon, 74, 68, 62, T.b[0] + .25); SM.ico(K, tr.p, o2.icon, 358, 68, 62, T.b[0] + .3);
  const kn = node(tr.p, 156, 8, 120, 120, 'u-badge u-acc'); kn.p.style.borderRadius = '50%'; K.enter(kn.o, T.b[0] + .35, 'pop');
  A(kn.m, [0, -92, 76, -54, 36, 0].map(x => ({transform: `translateX(${x}px)`})), T.b[1], T.hit - T.b[1] + .3, {e: 'ease-in-out', f: 'none'});
  if (o1.label) SM.word(K, P.p, o1.label, 118, 182, 40, T.b[0] + .4, 'center');
  if (o2.label) SM.word(K, P.p, o2.label, 402, 182, 40, T.b[0] + .45, 'center');
  const q = SM.ico(K, kn.p, 'circle-help', 60, 60, 64, null); K.fade(q, T.hit + .25, 0, 1, {hold: true});
  K.punch(kn.p, T.hit + .3);
}, s => s.options?.length === 2);
R3.both('B06', 'think', 'คนกับฟองคำถาม', (K, s, T, g) => {
  const it = s.about ?? {icon: 'user'}, P = {x: 150, y: 232, r: 75}, Q = {x: 440, y: 92, r: 75};
  const who = K.badge(g, it.icon, P.x, P.y, 2 * P.r, T.b[0], {tone: it.tone ?? 'main'});
  if (it.label) SM.word(K, g, it.label, P.x, P.y + P.r + 8, 38, T.b[0] + .2, 'center');
  /* the thought dots sit on the straight line from the person's top corner to the edge of the bubble
     (Friend 2026-11-08: "ไอคอนมันต้องตรงกับจุดสิ"), evenly spaced, growing toward the bubble */
  const a = {x: P.x + P.r * .9, y: P.y - P.r * .9}, dx = a.x - Q.x, dy = a.y - Q.y, L = Math.hypot(dx, dy);
  const b = {x: Q.x + dx / L * (Q.r + 6), y: Q.y + dy / L * (Q.r + 6)};
  [[.2, 20], [.5, 28], [.8, 36]].forEach(([k, d], i) => {
    const x = a.x + (b.x - a.x) * k, y = a.y + (b.y - a.y) * k;
    const dot = node(g, x - d / 2, y - d / 2, d, d, 'u-badge u-soft'); dot.p.style.borderRadius = '50%'; K.enter(dot.o, T.b[1] + i * .12, 'pop');
  });
  const q = K.badge(g, 'circle-help', Q.x, Q.y, 2 * Q.r, T.b[2], {tone: 'main', shape: 'round'});
  if (s.answer) {                                     // the question gets its answer on the key word
    const ans = LG.light(K, g, s.answer.icon, 438, 104, 150, T.hit, 'round'); R1.ripple(K, ans, T.hit + .15);
    if (s.answer.label) SM.word(K, g, s.answer.label, 438, 196, 40, T.hit + .1, 'center');
  } else { K.shake(q.p, T.hit); K.punch(who.p, T.hit + .1); }
});

/* ================= B10 คน / กลุ่มเป้าหมาย ================= */
R3.both('B10', 'crowd', 'ฝูงคน กรอบเล็งเลือกกลุ่มที่ใช่', (K, s, T, g) => {
  const icon = s.who?.icon ?? 'user', xs = [90, 210, 330, 450], ys = [110, 236], pick = [5, 6];
  const ppl = [];
  ys.forEach((y, r) => xs.forEach((x, c) => ppl.push(K.badge(g, icon, x + (r ? 60 : 0), y, 92, T.b[0] + (r * 4 + c) * .06, {tone: 'main', shape: 'round'}))));
  const cx = (xs[1] + xs[2]) / 2 + 60, cy = ys[1];
  K.brackets(g, cx, cy, 250, T.b[2], T.b[2] + .15);
  pick.forEach(i => { const p = ppl[i], x = xs[i % 4] + 60, y = ys[1]; LG.light(K, g, icon, x, y, 92, T.hit, 'round'); });
  ppl.forEach((p, i) => { if (!pick.includes(i)) K.fade(p.o, T.hit + .1, 1, .3); });
  if (s.label) SM.word(K, g, s.label, 300, 10, 42, T.hit + .1, 'center');
});
R3.both('B10', 'persona', 'การ์ดตัวตนกับป้ายคำ', (K, s, T, g) => {
  const P = R3.panel(K, g, 40, 26, 520, 288, T.b[0]);
  const av = K.badge(P.p, s.who?.icon ?? 'user', 126, 144, 160, T.b[0] + .12, {tone: 'main', shape: 'round'});
  if (s.label) SM.word(K, P.p, s.label, 236, 54, 48, T.b[1]);
  const tags = (s.tags ?? []).slice(0, 2);
  tags.forEach((w, i) => K.chip(P.p, w, 236, 140 + i * 70, T.b[2] + i * .15, {tone: 'acc', size: 36}));
  if (!tags.length) K.skel(P.p, 238, 150, [220, 150], T.b[2]);
  K.punch(av.p, T.hit); K.sat(P.p, 'target', 450, 230, 76, T.hit, {tone: 'acc', shape: 'round', k: .5});
});

/* ================= B13 เคล็ดลับ / ความลับ ================= */
R3.both('B13', 'reveal', 'กล่องเปิด ของลอยขึ้นมา', (K, s, T, g) => {
  const it = s.secret, sec = K.badge(g, it.icon, 300, 96, 140, null, {tone: 'acc'});
  K.fade(sec.o, T.hit - .05, 0, 1, {hold: true});
  K.move(sec.m, T.hit - .05, 'translateY(110px) scale(.5)', 'none', {hold: true, kind: 'snap'});
  const body = node(g, 196, 182, 208, 132, 'u-badge u-main'); body.p.style.borderRadius = '22px'; K.enter(body.o, T.b[0], 'rise');
  SM.ico(K, body.p, 'sparkles', 104, 66, 56, T.b[0] + .2);
  const lid = node(g, 182, 150, 236, 44, 'u-badge u-main'); lid.p.style.borderRadius = '16px'; lid.m.style.transformOrigin = '0% 100%';
  K.enter(lid.o, T.b[0] + .1, 'drop');
  K.shake(body.p, T.b[2]); K.shake(lid.p, T.b[2]);
  K.move(lid.m, T.hit - .2, 'none', 'rotate(-100deg)', {kind: 'snap'});              // the lid swings up on its left hinge, out of the way
  /* the ring and the word wait until the secret has risen into place (Friend 2026-11-08: the ring came before the icon) */
  const arrive = T.hit - .05 + (ST.motion.snap?.d ?? .7) * .85;
  R1.ripple(K, sec, arrive);
  if (it.label) SM.word(K, g, it.label, 404, 66, 44, arrive);
  K.sat(g, 'sparkles', 190, 70, 64, Math.max(T.after, arrive + .1), {tone: 'acc', k: .5});
});
R3.both('B13', 'bulb', 'คำถาม → หลอดไฟติด', (K, s, T, g) => {
  const it = s.secret;
  K.badge(g, 'circle-help', 120, 150, 128, T.b[0], {tone: 'main'});
  R3.line(K, g, 'M196 150H384', T.b[1], .5);
  K.badge(g, 'lightbulb', 470, 150, 150, T.b[1] + .3, {tone: 'soft', shape: 'round'});
  const lit = LG.light(K, g, it.icon ?? 'lightbulb', 470, 150, 150, T.hit, 'round');
  R1.ripple(K, lit, T.hit + .15, {times: 2});
  if (it.label) SM.word(K, g, it.label, 470, 240, 42, T.hit + .15, 'center');
});

/* ================= B15 ปิดคลิป / ชวนทำต่อ ================= */
R3.both('B15', 'button', 'ปุ่มที่เมาส์มากด', (K, s, T, g) => {
  const [i0, i1] = R3.ACT[s.action] ?? R3.ACT.follow;
  const pill = (tone, icon, t) => {
    const b = node(g, 110, 96, 380, 128, `u-badge u-${tone}`); b.p.style.borderRadius = '64px';
    b.p.style.gap = '20px';
    b.p.innerHTML = ICO(icon, 60) + (s.label ? `<span class="u-btn-text" style="font-size:52px">${s.label}</span>` : '');
    if (t != null) K.enter(b.o, t, 'pop');
    return b;
  };
  pill('main', i0, T.b[0]);
  const on = pill('acc', i1, null); K.fade(on.o, T.hit - .05, 0, 1, {hold: true}); K.punch(on.p, T.hit);
  K.cursor(g, [[T.b[1], 520, 330], [T.hit - .3, 330, 176], [T.t1 - .2, 330, 176]], {clicks: [T.hit - .15], size: 84});
  R1.ripple(K, on, T.hit + .1, {grow: 36});
});
R3.both('B15', 'icons', 'แถวไอคอน ไอคอนที่ชวนเด้งขึ้น', (K, s, T, g) => {
  const acts = ['like', 'comment', 'save', 'share'], xs = [120, 240, 360, 480], k = Math.max(0, acts.indexOf(s.action ?? 'follow'));
  const follow = s.action === 'follow', y = follow ? 256 : 170;      // "follow" is not in the row: it comes in above it
  const its = acts.map((a, i) => K.badge(g, R3.ACT[a][0], xs[i], y, follow ? 84 : 104, T.b[0] + i * .1, {tone: 'main', shape: 'round'}));
  if (follow) {
    its.forEach(b => K.fade(b.o, T.hit, 1, .35));
    const f = K.badge(g, 'user-plus', 300, 104, 140, T.hit - .05, {tone: 'acc', shape: 'round'}); K.punch(f.p, T.hit + .2);
    R1.ripple(K, f, T.hit + .15);
    if (s.label) SM.word(K, g, s.label, 390, 76, 44, T.hit + .1);
    return;
  } else {
    its.forEach((b, i) => { if (i !== k) K.fade(b.o, T.hit, 1, .35); });
    const lit = LG.light(K, g, R3.ACT[acts[k]][1], xs[k], 170, 104, T.hit, 'round'); K.move(its[k].m, T.hit, 'none', 'scale(1.25)'); K.move(lit.m, T.hit, 'none', 'scale(1.25)');
    R1.ripple(K, lit, T.hit + .2, {grow: 30});
  }
  if (s.label) SM.word(K, g, s.label, 300, 34, 44, T.hit + .1, 'center');
});

/* ================= B16 นิยาม / อธิบายว่าคืออะไร ================= */
R3.both('B16', 'equals', 'คำนี้ = ความหมาย', (K, s, T, g) => {
  const m = s.means.slice(0, 3), n = m.length, Y = 132;
  const tx = n === 1 ? 150 : n === 2 ? 110 : 100, ts = n === 1 ? 140 : 120;                 // the term on the left
  const xs = n === 1 ? [450] : n === 2 ? [380, 510] : [330, 440, 550], size = n === 1 ? 140 : n === 2 ? 110 : 92;
  const ly = Y + Math.max(ts, size) / 2 + 14;                                               // every word on one line
  K.badge(g, s.term.icon, tx, Y, ts, T.b[0], {tone: 'main'});
  if (s.term.label) SM.word(K, g, s.term.label, tx, ly, 42, T.b[0] + .15, 'center');
  /* "=" in the middle of the gap between the term and the meanings (Friend 2026-11-08: it was not in the middle) */
  const ex = ((tx + ts / 2) + (xs[0] - size / 2)) / 2;
  R3.line(K, g, `M${ex - 28} ${Y - 16}H${ex + 28}`, T.b[1], .25); R3.line(K, g, `M${ex - 28} ${Y + 16}H${ex + 28}`, T.b[1] + .1, .25);
  m.forEach((it, i) => {
    K.badge(g, it.icon, xs[i], Y, size, T.b[2] + i * .15, {tone: 'soft'});
    if (it.label) SM.word(K, g, it.label, xs[i], ly, n === 3 ? 30 : 42, T.b[2] + i * .15 + .1, 'center');
  });
  m.forEach((it, i) => LG.light(K, g, it.icon, xs[i], Y, size, T.hit + i * .1));
});
R3.both('B16', 'card', 'การ์ดพจนานุกรม', (K, s, T, g) => {
  const P = R3.panel(K, g, 40, 24, 520, 292, T.b[0]);
  SM.ico(K, P.p, 'book-open', 66, 66, 52, T.b[0] + .1);
  const hl = div('left:104px;top:42px;height:62px;border-radius:12px;transform-origin:0 50%;background:var(--ac);opacity:.55', P.p);
  const w = SM.word(K, P.p, s.term.label, 112, 34, 56, T.b[0] + .2);
  FITS.push(() => { hl.style.width = w.offsetWidth + 18 + 'px'; });
  A(hl, [{transform: 'scaleX(0)'}, {transform: 'none'}], T.hit, .4, {e: 'ease-out'});
  K.skel(P.p, 40, 132, [300, 220], T.b[1]);
  const m = s.means.slice(0, 3);
  m.forEach((it, i) => {
    K.badge(P.p, it.icon, 74 + i * 110, 236, 78, T.b[2] + i * .12, {tone: i === 0 ? 'acc' : 'main'});
  });
  if (m[0]?.label) SM.word(K, P.p, m[0].label, 74 + m.length * 110 - 30, 210, 42, T.b[2] + .2);
});

/* ================= sample sentences (general, not from Friend's script) ================= */
SENTENCE('r3.wrong', {cat: 'B05', name: 'ไม่ใช่ยอดวิว แต่เป็นยอดขาย', say: ['สิ่งที่ต้องดูไม่ใช่ยอดวิว', 'แต่เป็นยอดขาย'],
  wrong: {icon: 'eye', label: 'ยอดวิว'}, right: {icon: 'shopping-cart', label: 'ยอดขาย'}});
SENTENCE('r3.ask', {cat: 'B06', name: 'ลูกค้ายังลังเล ซื้อหรือไม่ซื้อ', say: ['ลูกค้ายังลังเลว่า', 'ซื้อหรือไม่ซื้อ'],
  about: {icon: 'user'}, options: [{icon: 'check', label: 'ซื้อ'}, {icon: 'x', label: 'ไม่ซื้อ'}]});
SENTENCE('r3.who', {cat: 'B10', name: 'คลิปนี้สำหรับเจ้าของร้าน', say: ['คลิปนี้สำหรับเจ้าของร้าน', 'ที่ขายออนไลน์'],
  who: {icon: 'user'}, label: 'เจ้าของร้าน', tags: ['ขายออนไลน์']});
SENTENCE('r3.tip', {cat: 'B13', name: 'เคล็ดลับคือโพสต์ตอนเย็น', say: ['เคล็ดลับที่คนไม่ค่อยรู้คือ', 'โพสต์ตอนเย็น'],
  secret: {icon: 'clock', label: 'ตอนเย็น'}});
SENTENCE('r3.follow', {cat: 'B15', name: 'กดติดตามไว้', say: ['ถ้าชอบคลิปแบบนี้', 'กดติดตามไว้'], action: 'follow', label: 'ติดตาม'});
SENTENCE('r3.define', {cat: 'B16', name: 'แบรนด์คือคำสัญญา', say: ['แบรนด์คืออะไร แบรนด์คือ', 'คำสัญญา'],
  term: {icon: 'badge-check', label: 'แบรนด์'}, means: [{icon: 'handshake', label: 'คำสัญญา'}]});
