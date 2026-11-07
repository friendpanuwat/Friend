/* =====================================================================
   CutPack · uni · MORE PICTURES OF THE SAME 6 MEANINGS (test, Friend 2026-11-07)
   Friend: a "ร่างแยก" is not the same picture arranged another way, it is ANY motion graphic that says the same thing.
   So each meaning below has 3 pictures: the first is the scene of base6.js with the meaning's own id,
   the two here are different pictures (another object, another little story) of the same meaning.
   Like every base scene they name no colour, font, line width or speed.
   ===================================================================== */
MEANING('price-cut', {name: 'ลดราคาแล้วก็ยังไม่ซื้อ', when: 'ลดราคา ลดแลกแจกแถม แล้วคนก็ยังไม่ซื้อ ไม่ได้ผล'});
MEANING('not-worth', {name: 'ไม่คุ้ม', when: 'จ่ายมากกว่าที่ได้ กลัวเสียเงินเปล่า'});
MEANING('undecided', {name: 'ลังเล', when: 'ไม่แน่ใจ ตัดสินใจไม่ได้ จะเอาหรือไม่เอา'});
MEANING('fewer-customers', {name: 'ลูกค้าน้อยลง', when: 'คนน้อยลง เงียบลง ยอดตก'});
MEANING('not-first', {name: 'ข้อแรกไม่ใช่', when: 'สิ่งแรกที่ควรทำไม่ใช่สิ่งที่คนมักทำ'});
MEANING('fix-spot', {name: 'แก้ให้ถูกจุด', when: 'หาให้เจอว่าติดตรงไหน แล้วแก้ตรงนั้น'});
const MEANING_ORDER = ['price-cut', 'not-worth', 'undecided', 'fewer-customers', 'not-first', 'fix-spot'];
const SAY = {
  'price-cut': {lead: {type: 'text', max: 22, sample: 'ต่อให้เราลดราคาเพิ่ม'}, key: {type: 'text', max: 12, sample: 'ยังไม่ซื้อ'}},
  'not-worth': {lead: {type: 'text', max: 22, sample: 'บางคนกลัวว่าซื้อไปแล้ว'}, key: {type: 'text', max: 12, sample: 'ไม่คุ้ม'}},
  'undecided': {lead: {type: 'text', max: 22, sample: 'หรือไม่รู้ว่า'}, key: {type: 'text', max: 12, sample: 'จะซื้อดีไหม'}},
  'fewer-customers': {lead: {type: 'text', max: 22, sample: 'พอเห็นลูกค้า'}, key: {type: 'text', max: 12, sample: 'น้อยลง'}},
  'not-first': {lead: {type: 'text', max: 22, sample: 'สิ่งที่ควรทำอย่างแรก'}, key: {type: 'text', max: 12, sample: 'ไม่ใช่'}},
  'fix-spot': {lead: {type: 'text', max: 22, sample: 'แล้วแก้ปัญหาให้'}, key: {type: 'text', max: 12, sample: 'ถูกจุด'}},
};

/* ---------- ลดราคาแล้วก็ยังไม่ซื้อ ---------- */
SCENE('price-cut.cursor', {meaning: 'price-cut', name: 'ลดแล้วไม่มีใครกด', beats: 4,
  story: 'ป้ายราคาโดนตราลดราคา แต่ลูกศรเมาส์เลื่อนมาที่ปุ่มซื้อแล้วถอยออกไป ไม่กด',
  slots: {...SAY['price-cut'], thing: {type: 'icon', sample: 'shopping-cart'}}},
(K, s, T) => {
  const tag = K.badge(K.stage, 'tag', 500, 150, 200, T.b[0], {tone: 'main'});
  K.badge(K.stage, 'badge-percent', 615, 64, 110, T.b[1], {tone: 'acc'});          // the discount lands on the price
  K.punch(tag.p, T.b[1] + .1);
  const btn = K.button(K.stage, 500, 440, 380, 130, s.thing, T.b[1] + .3, {tone: 'soft'});
  K.cursor(K.stage, [[T.b[2] - .1, 860, 640], [T.hit - .2, 560, 470], [T.hit + .15, 560, 470], [T.after + .4, 880, 640]]);   // comes close … and leaves
  K.shake(btn.p, T.hit);
  K.say(s.lead, s.key);
});
SCENE('price-cut.bars', {meaning: 'price-cut', name: 'ราคาลง ยอดไม่ขยับ', beats: 4,
  story: 'กราฟราคาลดลงเป็นขั้น ๆ แต่กราฟยอดซื้อข้าง ๆ ยังแบนอยู่เท่าเดิม แล้วโดนกากบาท',
  slots: {...SAY['price-cut'], thing: {type: 'icon', sample: 'shopping-cart'}}},
(K, s, T) => {
  const L = K.panel(100, 40, 370, 520, T.b[0]), R = K.panel(510, 40, 370, 520, T.b[0] + .12);
  K.badge(L.p, 'tag', 74, 74, 84, T.b[0] + .2, {tone: 'acc'}); K.skel(L.p, 136, 64, [170], T.b[0] + .25);
  K.badge(R.p, s.thing, 74, 74, 84, T.b[0] + .3, {tone: 'main'}); K.skel(R.p, 136, 64, [170], T.b[0] + .35);
  K.bars(L.p, 46, 170, 278, 300, [.95, .95, .95, .95], T.b[0] + .3).set(T.b[1], [.95, .72, .5, .28]);   // the price steps down
  K.bars(R.p, 46, 170, 278, 300, [.22, .2, .23, .2], T.b[2], {acc: 99});                                // sales stay flat
  K.shake(R.p, T.hit);
  K.mark(K.stage, 'cross', 850, 76, 84, T.hit);
  K.say(s.lead, s.key);
});

/* ---------- ไม่คุ้ม ---------- */
SCENE('not-worth.measure', {meaning: 'not-worth', name: 'จ่ายเยอะ ได้น้อย', beats: 4,
  story: 'แถบเงินที่จ่ายยาวเกือบเต็ม แถบของที่ได้สั้นนิดเดียว แล้วแถบสั้นโดนกากบาท',
  slots: {...SAY['not-worth'], left: {type: 'icon', sample: 'banknote'}, right: {type: 'icon', sample: 'package'}}},
(K, s, T) => {
  const P = K.panel(110, 90, 780, 420, T.b[0]);
  K.measure(P.p, 60, 130, 660, T.b[1], .92, s.left, {tone: 'acc', fill: 'u-bar-on'});        // what you pay
  const m = K.measure(P.p, 60, 290, 660, T.b[2], .3, s.right, {tone: 'main'});             // what you get
  K.shake(m.track.p, T.hit);
  K.mark(P.p, 'cross', m.end + 70, 290, 76, T.hit);
  K.say(s.lead, s.key);
});
SCENE('not-worth.stars', {meaning: 'not-worth', name: 'ราคาแพง ดาวดวงเดียว', beats: 4,
  story: 'การ์ดสินค้าติดป้ายราคาใหญ่ แต่ดาวรีวิวติดแค่ดวงเดียวจากห้าดวง',
  slots: {...SAY['not-worth'], right: {type: 'icon', sample: 'package'}}},
(K, s, T) => {
  const P = K.panel(170, 20, 660, 600, T.b[0]);
  K.badge(P.p, s.right, 330, 150, 180, T.b[0] + .15, {tone: 'main'});
  const tag = K.badge(P.p, 'tag', 500, 84, 116, T.b[1], {tone: 'acc'});                      // a big price on it
  K.skel(P.p, 160, 290, [340, 220], T.b[1] + .1);
  K.stars(P.p, 330, 470, 5, 84, T.b[2]).light(T.hit - .1, 1);                                // … and one star out of five
  K.punch(tag.p, T.after);
  K.say(s.lead, s.key);
});

/* ---------- ลังเล ---------- */
SCENE('undecided.cursor', {meaning: 'undecided', name: 'เมาส์ไปมาระหว่างสองปุ่ม', beats: 4,
  story: 'ปุ่มเอากับปุ่มไม่เอา ลูกศรเมาส์ไปปุ่มหนึ่ง แล้วไปอีกปุ่ม แล้วค้างอยู่ตรงกลาง มีเครื่องหมายคำถาม',
  slots: {...SAY['undecided'], thing: {type: 'icon', sample: 'shopping-cart'}}},
(K, s, T) => {
  K.badge(K.stage, s.thing, 500, 110, 140, T.b[0], {tone: 'main'});
  K.button(K.stage, 300, 360, 300, 130, 'check', T.b[0] + .15, {tone: 'acc'});
  K.button(K.stage, 700, 360, 300, 130, 'x', T.b[0] + .25, {tone: 'soft'});
  K.cursor(K.stage, [[T.b[1] - .2, 520, 640], [T.b[1] + .3, 330, 400], [T.b[2] + .3, 730, 400], [T.hit, 520, 420], [T.t1 - .2, 520, 420]]);
  K.badge(K.stage, 'circle-help', 520, 250, 100, T.hit, {tone: 'acc'});
  K.say(s.lead, s.key);
});
SCENE('undecided.gauge', {meaning: 'undecided', name: 'เข็มแกว่งไปมา', beats: 4,
  story: 'หน้าปัดมีฝั่งเอากับฝั่งไม่เอา เข็มแกว่งไปซ้าย ไปขวา แล้วหยุดตรงกลาง',
  slots: {...SAY['undecided'], thing: {type: 'icon', sample: 'shopping-cart'}}},
(K, s, T) => {
  const G = K.gauge(K.stage, 500, 380, 300, T.b[0]);
  K.badge(K.stage, s.thing, 150, 380, 120, T.b[0] + .2, {tone: 'main'});
  K.badge(K.stage, 'x', 850, 380, 120, T.b[0] + .3, {tone: 'soft'});
  G.swing(T.b[1], -62); G.swing(T.b[2], 58); G.swing(T.hit - .2, 0);
  K.badge(K.stage, 'circle-help', 500, 530, 100, T.hit, {tone: 'acc'});
  K.say(s.lead, s.key);
});

/* ---------- ลูกค้าน้อยลง ---------- */
SCENE('fewer-customers.bars', {meaning: 'fewer-customers', name: 'กราฟลูกค้าลดลง', beats: 4,
  story: 'กราฟแท่งขึ้นทีละแท่ง แต่ละแท่งเตี้ยกว่าแท่งก่อน แล้วขึ้นป้ายลูกศรลง',
  slots: {...SAY['fewer-customers']}},
(K, s, T) => {
  const P = K.panel(130, 30, 740, 560, T.b[0]);
  K.badge(P.p, 'users', 80, 78, 92, T.b[0] + .15, {tone: 'main'}); K.skel(P.p, 150, 64, [260], T.b[0] + .2);
  K.bars(P.p, 70, 170, 600, 330, [.95, .72, .48, .22], T.b[1] - .1, {step: (T.hit - T.b[1]) / 3.4});
  K.badge(P.p, 'trending-down', 640, 210, 100, T.hit, {tone: 'acc'});
  K.say(s.lead, s.key);
});
SCENE('fewer-customers.bell', {meaning: 'fewer-customers', name: 'กระดิ่งร้านเงียบ', beats: 4,
  story: 'กระดิ่งร้านมีลูกค้ารายล้อมและสั่นดัง แล้วลูกค้าหายทีละคน กระดิ่งกลายเป็นกระดิ่งเงียบ',
  slots: {...SAY['fewer-customers']}},
(K, s, T) => {
  const bell = K.badge(K.stage, 'bell', 500, 300, 230, T.b[0], {tone: 'main'});
  const ppl = [[300, 150], [700, 150], [760, 420], [240, 420]].map(([x, y], i) => K.badge(K.stage, 'user', x, y, 100, T.b[0] + .3 + i * .1, {tone: 'acc', shape: 'round'}));
  K.shake(bell.p, T.b[1]);                                                                     // the bell rings
  [3, 2, 1].forEach((k, i) => K.leave(ppl[k].o, [T.b[2], (T.b[2] + T.hit) / 2, T.hit][i]));   // people go away
  const off = K.badge(K.stage, 'bell-off', 500, 300, 230, null, {tone: 'soft'});
  K.fade(off.o, T.hit, 0, 1, {hold: true}); K.fade(bell.o, T.hit, 1, 0);                      // … and it goes quiet
  K.say(s.lead, s.key);
});

/* ---------- ข้อแรกไม่ใช่ ---------- */
SCENE('not-first.sign', {meaning: 'not-first', name: 'ป้ายทางแยก', beats: 4,
  story: 'ป้ายบอกทาง 2 ทาง ทางที่เขียนว่าการลดราคาโดนกากบาทแล้วจาง อีกทางมีเครื่องหมายคำถามเด่นขึ้น',
  slots: {...SAY['not-first'], item: {type: 'text', max: 12, sample: 'การลดราคา'}}},
(K, s, T) => {
  const S = K.signpost(K.stage, 500, 60, T.b[0], {leftText: s.item, rightIcon: 'circle-help'});
  K.mark(K.stage, 'cross', 160, 120, 92, T.hit);
  K.fade(S.L.o, T.hit + .2, 1, .45);
  K.punch(S.R.p, T.after);
  K.say(s.lead, s.key);
});
SCENE('not-first.stack', {meaning: 'not-first', name: 'การ์ดใบบนสุดถูกดึงออก', beats: 4,
  story: 'กองการ์ด ใบบนสุดเขียนว่าการลดราคา โดนกากบาทแล้วปลิวออก เผยใบถัดไป',
  slots: {...SAY['not-first'], item: {type: 'text', max: 12, sample: 'การลดราคา'}}},
(K, s, T) => {
  const cards = [2, 1, 0].map(i => K.panel(210 + i * 30, 90 + i * 36, 540, 380, T.b[0] + (2 - i) * .1));   // back to front
  const top = cards[2];
  K.label(top.p, s.item, 60, 70, {size: 58});
  K.skel(top.p, 60, 200, [380, 260], T.b[1]);
  K.mark(top.p, 'cross', 470, 96, 80, T.hit);
  K.move(top.m, T.after, 'none', 'translate(-560px,60px) rotate(-14deg)');
  K.fade(top.o, T.after + .15, 1, 0);
  K.badge(cards[1].p, 'sparkles', 270, 190, 120, T.after + .25, {tone: 'acc'});
  K.say(s.lead, s.key);
});

/* ---------- แก้ให้ถูกจุด ---------- */
SCENE('fix-spot.target', {meaning: 'fix-spot', name: 'ลูกศรเข้ากลางเป้า', beats: 4,
  story: 'เป้ากลม ลูกศรพุ่งเข้ากลางเป้าพอดี แล้วขึ้นเครื่องหมายถูก',
  slots: {...SAY['fix-spot']}},
(K, s, T) => {
  K.target(K.stage, 500, 330, 250, T.b[0]).hit(T.hit, {angle: -35, dist: 460});
  K.mark(K.stage, 'check', 790, 110, 100, T.after);
  K.say(s.lead, s.key);
});
SCENE('fix-spot.scan', {meaning: 'fix-spot', name: 'เล็งหาเฟืองที่เสีย แล้วซ่อม', beats: 4,
  story: 'เฟือง 3 ตัว ตัวกลางเสีย กรอบเล็งหดเข้าหามัน ประแจมาซ่อม แล้วเฟืองกลับมาดี',
  slots: {...SAY['fix-spot']}},
(K, s, T) => {
  const items = [220, 500, 780].map((x, i) => K.badge(K.stage, 'cog', x, 300, 170, T.b[0] + i * .12, {tone: i === 1 ? 'neg' : 'main'}));
  K.shake(items[1].p, T.b[1]);
  K.brackets(K.stage, 500, 300, 250, T.b[1] + .2, T.b[1] + .3);                    // the focus closes in on the broken one
  const w = K.badge(K.stage, 'wrench', 640, 470, 110, T.b[2], {tone: 'acc'});
  K.shake(w.p, T.hit - .3);
  const ok = K.badge(K.stage, 'cog', 500, 300, 170, null, {tone: 'acc'});
  K.fade(ok.o, T.hit, 0, 1, {hold: true}); K.punch(ok.p, T.hit);
  K.mark(K.stage, 'check', 620, 170, 90, T.after);
  K.say(s.lead, s.key);
});
