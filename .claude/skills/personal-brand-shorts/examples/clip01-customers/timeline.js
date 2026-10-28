/* timeline of the 42 s test clip "ลูกค้าทักมาแล้วหายไป" — minimal scenes (examples/graphics_ink.js) + face parts, retention pacing (references/retention.md).
   build: bash scripts/pipeline.sh <project> build (graphics.js + timeline.js in the project) — made before the open-on-the-face rule: its first 2 s is a white scene */
face(580, 1010);
const G_ = IOS.green, R_ = IOS.red;

/* camera — talking-head-motion zooms (zoom.md), only on the real key words */
zoom(3.35, 1.08, .12);                         // เฮ้ย
zoom(4.0, 1.05, .35);                          // แพง
zoom(9.57, 1.0, .35); zoom(10.0, 1.07, .12);   // เจ้าของธุรกิจ
zoom(15.08, 1.03, .6);                         // สิ่งที่ลูกค้าต้องการ
zoom(18.26, 1.08, .12);                        // คำตอบ
zoom(19.0, 1.0, .35); zoom(19.74, 1.05, .14);  // เยอะแค่ไหน
zoom(29.89, 1.03, .6);                         // ถ้าเราไม่แก้ข้อสงสัย
zoom(31.0, 1.07, .14);                         // ลดราคาเพิ่ม
zoom(39.58, 1.0, .35); zoom(41.0, 1.08, .12);  // ให้ถูกจุด

/* 0–2 HOOK */
sceneHook(0, 2.0, {title: 'ลูกค้าทักมา', msg: 'สอบถามรายละเอียดสินค้า', tMsg: .56, gone: 'แล้วก็หายไป', tGone: 1.6});

/* 2–5 face — captions by phrase (~1–1.5 s), "?" chips beside the head */
kcap(2.02, 3.33, 'หลายคนก็อาจจะคิดว่า');
kcap(3.35, 3.98, 'เฮ้ย มันเป็นเพราะ');
kcap(4.00, 4.98, 'ของเราแพงหรือเปล่า', {key: 'แพง', keyColor: R_});
chipsNear(2.4, 4.98, [['?', 2.5], ['?', 3.1], ['แพง?', 4.05]]);

/* 5–9.5 one scene: the turn word, then three reasons build in one card */
sceneReasons(5.0, 9.55, {turn: 'แต่จริง ๆ แล้ว', head: 'ลูกค้าอาจจะ…', rows: [['ลังเล', 6.0, 'hesitate'], ['ไม่มั่นใจในตัวสินค้า', 7.0, 'box'], ['ไม่รู้ว่าจะซื้อดีไหม', 8.46, 'cart']]});

/* 9.5–11 face */
kcap(9.57, 11.0, 'แต่ปัญหาก็คือ เจ้าของธุรกิจ', {key: 'เจ้าของธุรกิจ', keyColor: HILITE});

/* 11–15 one scene: fewer customers → quiet → promotion, discount */
sceneRush(11.0, 15.06, {tQuiet: 12.0, tRush: 13.18, tags: [['ทำโปรโมชั่น', 13.6], ['ลดราคา', 14.15]]});

/* 15–21 face + ✕ / ✓ list */
kcap(15.08, 15.98, 'สิ่งที่ลูกค้าต้องการ');
markList(16.0, 18.98, [{text: 'อาจจะไม่ใช่ส่วนลด', t: 16.0, keys: {'ส่วนลด': R_}, mark: 'x'}, {text: 'แต่คือคำตอบที่เขากังวล', t: 17.72, keys: {'คำตอบ': G_}, mark: 'check'}]);
kcap(19.0, 20.98, 'ต่อให้ลดราคาเยอะแค่ไหน', {key: 'เยอะแค่ไหน', keyColor: HILITE});

/* 21–23 the pay button nobody presses */
scenePay(21.0, 22.98, {button: 'จ่ายเงิน', tq: 21.39});

/* 23–30 one scene: the three doubts 01 → 02 → 03 */
sceneDoubts(23.0, 29.87, {head: 'บางคน…', items: [['01', 'ไม่มั่นใจเรื่องคุณภาพ', 23.54, 'quality'], ['02', 'กลัวซื้อไปแล้วไม่คุ้ม', 25.39, 'scale'], ['03', 'ยังไม่เห็นว่าช่วยแก้ปัญหาตรงไหน', 27.6, 'puzzle']]});

/* 30–33.5 face */
kcap(29.89, 30.98, 'ถ้าเราไม่แก้ข้อสงสัย');
kcap(31.0, 31.98, 'ต่อให้เราลดราคาเพิ่ม');
kcap(32.0, 33.53, 'ลูกค้าก็อาจจะยังไม่ซื้ออยู่ดี', {key: 'ยังไม่ซื้อ', keyColor: R_});

/* 33.5–39.5 one scene: therefore → the vanishing customer → not a discount → the path */
sceneTherefore(33.55, 37.48, {turn: 'เพราะฉะนั้น', recall: 'ถ้าลูกค้าทักมาแล้วหายไป', tRecall: 34.4, pre: 'สิ่งที่ควรทำอย่างแรก ไม่ใช่การ', word: 'ลดราคา', tStrikeIn: 35.41, tStrike: 36.3});
timelineSteps(37.5, 39.56, [['ลูกค้าทักมา', 37.6], ['หาว่าเขาติดอะไร', 38.1]]);

/* 39.5–41.9 face + pin */
kcap(39.58, 40.88, 'แล้วก็แก้ปัญหานั้น');
kcap(40.9, 41.87, 'ให้ถูกจุด', {color: G_});
pinDrop(41.0, 41.87);
