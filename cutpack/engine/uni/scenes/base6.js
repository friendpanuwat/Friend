/* =====================================================================
   CutPack · uni · BASE SCENES — first 6 (test, Friend 2026-11-07)
   Written once for every style: each scene says what is on the canvas (1000 × 700), where, and on which beat it
   appears or changes. No colour, font, line width or speed appears here — the style paints and moves it all.
   T.b = beats before the key word, T.hit = the key word, T.after = a beat after it.
   The sample words are the sentences of Friend's reference clips (2026-11-07).
   ===================================================================== */

/* price slider drops, the cart still does not move: "ต่อให้เราลดราคาเพิ่ม … ยังไม่ซื้อ" */
SCENE('price-cut', {name: 'ลดราคาแล้วก็ยังไม่ซื้อ', story: 'แถบราคาเลื่อนลง แต่ตะกร้าไม่ขยับ โดนกากบาท', beats: 4,
  slots: {lead: {type: 'text', max: 22, sample: 'ต่อให้เราลดราคาเพิ่ม'}, key: {type: 'text', max: 12, sample: 'ยังไม่ซื้อ'},
    label: {type: 'text', max: 10, sample: 'ราคา'}, thing: {type: 'icon', sample: 'shopping-cart'}}},
(K, s, T) => {
  const P = K.panel(110, 30, 780, 290, T.b[0]);
  K.badge(P.p, 'tag', 96, 92, 108, T.b[0] + .15, {tone: 'acc'});
  K.skel(P.p, 180, 66, [320, 200], T.b[0] + .2);
  const sl = K.slider(P.p, 76, 212, 628, T.b[0] + .3, .86);
  sl.set(T.b[1], .22);                                  // the price comes down
  const cart = K.badge(K.stage, s.thing, 500, 520, 180, T.b[2], {tone: 'soft'});
  K.shake(cart.p, T.hit);                               // … and the cart does not move
  K.mark(K.stage, 'cross', 618, 418, 90, T.hit);
  K.say(s.lead, s.key);
});

/* a balance: money on one pan, the product on the other, it tips to the money side: "… ไม่คุ้ม" */
SCENE('not-worth', {name: 'ชั่งแล้วไม่คุ้ม', story: 'ตาชั่งวางเงินกับสินค้า แล้วเอียงลงฝั่งเงิน', beats: 4,
  slots: {lead: {type: 'text', max: 22, sample: 'บางคนกลัวว่าซื้อไปแล้ว'}, key: {type: 'text', max: 12, sample: 'ไม่คุ้ม'},
    left: {type: 'icon', sample: 'banknote'}, right: {type: 'icon', sample: 'package'}}},
(K, s, T) => {
  const B = K.scale(K.stage, 500, 150, T.b[0]);
  const a = K.badge(B.panL.p, s.left, B.panL.item.cx, B.panL.item.cy, 132, T.b[1], {tone: 'acc', kind: 'drop'});
  K.badge(B.panR.p, s.right, B.panR.item.cx, B.panR.item.cy, 132, T.b[2], {tone: 'main', kind: 'drop'});
  B.tilt(T.hit - .1, -11);                              // the money side goes down
  K.punch(a.p, T.hit);
  K.say(s.lead, s.key);
});

/* a switch that cannot make up its mind: on → off → stops half way: "หรือไม่รู้ว่า จะซื้อดีไหม" */
SCENE('undecided', {name: 'ลังเล', story: 'สวิตช์เปิด ปิด แล้วค้างครึ่งทาง มีเครื่องหมายคำถาม', beats: 4,
  slots: {lead: {type: 'text', max: 22, sample: 'หรือไม่รู้ว่า'}, key: {type: 'text', max: 12, sample: 'จะซื้อดีไหม'},
    thing: {type: 'icon', sample: 'shopping-cart'}}},
(K, s, T) => {
  K.badge(K.stage, s.thing, 500, 150, 170, T.b[0], {tone: 'main'});
  const sw = K.toggle(K.stage, 300, 310, 400, T.b[0] + .15);
  sw.set(T.b[1], 1);
  sw.set(T.b[2], 0);
  sw.set(T.hit - .15, .5);                               // stuck in the middle
  K.badge(K.stage, 'circle-help', 770, 290, 110, T.hit, {tone: 'acc'});
  K.say(s.lead, s.key);
});

/* a shop card with four customers; they leave one by one: "พอเห็นลูกค้า น้อยลง" */
SCENE('fewer-customers', {name: 'ลูกค้าน้อยลง', story: 'การ์ดร้านมีลูกค้า 4 คน แล้วหายทีละคนจนเหลือคนเดียว', beats: 4,
  slots: {lead: {type: 'text', max: 22, sample: 'พอเห็นลูกค้า'}, key: {type: 'text', max: 12, sample: 'น้อยลง'},
    place: {type: 'icon', sample: 'store'}}},
(K, s, T) => {
  const P = K.panel(130, 50, 740, 460, T.b[0]);
  K.badge(P.p, s.place, 100, 100, 120, T.b[0] + .15, {tone: 'main'});
  K.skel(P.p, 190, 72, [330, 210], T.b[0] + .2);
  const people = [0, 1, 2, 3].map(i => K.avatar(P.p, 120 + i * 166, 318, 132, T.b[1] + i * .1));
  K.leave(people[3].o, T.b[2]);
  K.leave(people[2].o, T.b[2] + (T.hit - T.b[2]) / 2);
  K.leave(people[1].o, T.hit);
  K.punch(people[0].p, T.after);
  K.say(s.lead, s.key);
});

/* a to-do list whose first line is crossed out: "สิ่งที่ควรทำอย่างแรก ไม่ใช่ (การลดราคา)" */
SCENE('not-first', {name: 'ข้อแรกไม่ใช่', story: 'เช็กลิสต์ 3 ข้อ ข้อแรกโดนกากบาท', beats: 4,
  slots: {lead: {type: 'text', max: 22, sample: 'สิ่งที่ควรทำอย่างแรก'}, key: {type: 'text', max: 12, sample: 'ไม่ใช่'},
    item: {type: 'text', max: 12, sample: 'การลดราคา'}}},
(K, s, T) => {
  const P = K.panel(140, 70, 720, 440, T.b[0]);
  const rows = K.checklist(P.p, 70, 40, 580, [{text: s.item}, {skel: .72}, {skel: .5}], T.b[1]);
  K.mark(P.p, 'cross', rows[0].cx, rows[0].cy, 84, T.hit);
  K.fade(rows[0].label, T.hit + .1, 1, .38);
  K.punch(P.p, T.hit);
  K.say(s.lead, s.key);
});

/* the missing jigsaw piece flies in and fits: "แล้วแก้ปัญหาให้ ถูกจุด" */
SCENE('fix-spot', {name: 'แก้ให้ถูกจุด', story: 'จิ๊กซอว์ขาดชิ้นเดียว ชิ้นที่ขาดลอยมาเข้าที่พอดี แล้วขึ้นเครื่องหมายถูก', beats: 4,
  slots: {lead: {type: 'text', max: 22, sample: 'แล้วแก้ปัญหาให้'}, key: {type: 'text', max: 12, sample: 'ถูกจุด'},
    thing: {type: 'icon', sample: 'package'}}},
(K, s, T) => {
  const Z = K.puzzle(K.stage, 290, 110, 210, T.b[0], {icon: s.thing});
  Z.enterLoose(T.b[1]);
  Z.place(T.hit - .35);
  K.punch(Z.board, T.hit);
  K.mark(K.stage, 'check', 780, 100, 100, T.after);
  K.say(s.lead, s.key);
});

const SCENE_ORDER = ['price-cut', 'not-worth', 'undecided', 'fewer-customers', 'not-first', 'fix-spot'];
