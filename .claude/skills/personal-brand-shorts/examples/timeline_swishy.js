/* timeline of the 42 s test clip "ลูกค้าทักมาแล้วหายไป" — swishy look on the face, minimal ink scenes (examples/graphics_ink.js), retention edit (references/retention.md).
   build: cat assets/engine_head.html assets/reflook.js assets/ioslook.js assets/swishylook.js examples/graphics_ink.js examples/timeline_swishy.js assets/engine_tail.html > scene.html */
face(580, 1010);
const G_ = IOS.green, R_ = IOS.red;
progressBar(41.87);

/* camera — talking-head-motion zooms (zoom.md), changed on every sentence or key word so the face parts never sit still */
zoom(2.02, 1.05, .6);                          // หลายคน
zoom(3.35, 1.09, .12);                         // เฮ้ย
zoom(3.6, 1.0, .35); zoom(4.0, 1.07, .14);     // มันเป็นเพราะ · ของเราแพง
zoom(4.5, 1.03, .35);
zoom(5.0, 1.0, .35);
zoom(7.0, 1.06, .12);                          // หรือว่าไม่มั่นใจ
zoom(8.0, 1.02, .35);                          // ในตัวสินค้า
zoom(9.57, 1.05, .6); zoom(10.0, 1.08, .12);   // แต่ปัญหาก็คือ · เจ้าของธุรกิจ
zoom(11.0, 1.0, .35);
zoom(15.08, 1.05, .7);                         // สิ่งที่ลูกค้าต้องการ
zoom(16.0, 1.0, .35);                          // อาจจะไม่ใช่ส่วนลด
zoom(17.0, 1.05, .6);                          // แต่เขาอาจจะ
zoom(18.26, 1.09, .12);                        // คำตอบ
zoom(19.0, 1.0, .35); zoom(19.74, 1.07, .14);  // ต่อให้ลดราคา · เยอะแค่ไหน
zoom(21.0, 1.0, .35);
zoom(23.0, 1.04, .5); zoom(23.54, 1.08, .12);  // บางคนอาจจะ · ไม่มั่นใจ
zoom(24.0, 1.0, .35);
zoom(26.0, 1.06, .6);                          // หรือบางคนเนี่ย
zoom(27.35, 1.0, .35);
zoom(29.0, 1.06, .12);                         // ให้เขาตรงไหน
zoom(29.89, 1.0, .35); zoom(30.14, 1.05, .6);  // ถ้าเรา · ไม่แก้ข้อสงสัย
zoom(31.0, 1.08, .12);                         // ลดราคาเพิ่ม
zoom(32.0, 1.02, .35); zoom(33.35, 1.07, .14); // ลูกค้าก็อาจจะ · ยังไม่ซื้ออยู่ดี
zoom(33.55, 1.0, .35);
zoom(34.4, 1.05, .5); zoom(35.0, 1.08, .12);   // ถ้าลูกค้าทักมา · แล้วหายไป
zoom(35.41, 1.0, .35);
zoom(39.0, 1.05, .5);                          // เขาติดอะไรอยู่กันแน่
zoom(40.9, 1.0, .2); zoom(41.0, 1.09, .12);    // ให้ถูกจุด

/* 0–2 HOOK: "ลูกค้าทักมา" on screen at frame 0; a person walks in, asks… and vanishes */
inkHook(0, 2.0, {title: 'ลูกค้าทักมา', msg: 'สอบถามรายละเอียดสินค้า', tMsg: .56, gone: 'แล้วก็หายไป', tGone: 1.6});
sfx('pop', .56, -14); sfx('whoosh', 1.48, -18); sfx('impact', 1.6, -12);

/* 2–5 face: one short caption per spoken chunk, "?" chips beside the head */
kcap(2.02, 2.30, 'หลายคน');
kcap(2.32, 3.33, 'ก็อาจจะคิดว่า');
kcap(3.35, 3.58, 'เฮ้ย', {color: '#fff'}); sfx('pop', 3.35, -18);
kcap(3.60, 3.98, 'มันเป็นเพราะ');
kcap(4.00, 4.48, 'ของเราแพง', {color: R_});
kcap(4.50, 4.98, 'หรือเปล่า');
chipsNear(2.4, 4.98, [['?', 2.5], ['?', 3.1], ['แพง?', 4.05]]);
sfx('pop', 2.5, -22); sfx('pop', 3.1, -22, 1.15); sfx('pop', 4.05, -18, .9);

/* 5–6 turn word */
inkTurn(5.0, 5.98, 'แต่จริง ๆ แล้ว'); sfx('impact', 5.0, -14);

/* 6–9.5 reasons: scene · face · scene (no scene longer than ~1.5 s) */
inkHesitate(6.0, 6.98, {head: 'ลูกค้าอาจจะ…', word: 'ลังเล'}); sfx('swipe', 6.0, -18); sfx('thud', 6.35, -16);
kcap(7.0, 7.98, 'หรือว่าไม่มั่นใจ');
kcap(8.0, 8.44, 'ในตัวสินค้า');
inkFork(8.46, 9.55, {text: 'ไม่รู้ว่าจะซื้อดีไหม'}); sfx('swipe', 8.46, -18); sfx('thud', 8.75, -16);

/* 9.5–11 face */
kcap(9.57, 9.98, 'แต่ปัญหาก็คือ');
kcap(10.0, 11.0, 'เจ้าของธุรกิจ', {color: HILITE});

/* 11–15 fewer customers · silence · click, click */
inkFewer(11.0, 12.0, {label: 'ลูกค้า'}); sfx('swipe', 11.0, -18); sfx('womp', 11.15, -18);
inkSilent(12.0, 13.16, {word: 'เงียบ', tFlat: 12.35}); sfx('swipe', 12.0, -20); sfx('tick', 12.35, -12);
inkTags(13.18, 15.06, [['ทำโปรโมชั่น', 13.6], ['ลดราคา', 14.15]]); sfx('swipe', 13.18, -20); sfx('tick', 13.6, -12); sfx('tick', 14.15, -12);

/* 15–19 face + ✕ / ✓ list */
kcap(15.08, 15.98, 'สิ่งที่ลูกค้าต้องการ');
markList(16.0, 18.98, [{text: 'อาจจะไม่ใช่ส่วนลด', t: 16.0, keys: {'ส่วนลด': R_}, mark: 'x'}, {text: 'แต่คือคำตอบที่เขากังวล', t: 17.72, keys: {'คำตอบ': G_}, mark: 'check'}]);
sfx('pop', 16.0, -18); sfx('pop', 17.72, -16, 1.2); sfx('sparkle', 18.26, -20);

/* 19–23 face · the pay button that never gets pressed */
kcap(19.0, 19.72, 'คือต่อให้ลดราคา');
kcap(19.74, 20.98, 'เยอะแค่ไหน', {color: HILITE});
inkPay(21.0, 22.98, {label: 'จ่ายเงิน', tq: 21.39}); sfx('swipe', 21.0, -18); sfx('pop', 21.39, -18);

/* 23–29.9 the doubts: face · scene · face · scene · face */
kcap(23.0, 23.52, 'บางคนอาจจะ');
kcap(23.54, 23.98, 'ไม่มั่นใจ', {color: R_});
inkQuality(24.0, 24.98, {num: '01', text: 'ไม่มั่นใจเรื่องคุณภาพ', tq: 24.4}); sfx('swipe', 24.0, -18); sfx('thud', 24.25, -16);
inkScale(25.0, 25.98, {num: '02', text: 'กลัวซื้อไปแล้วไม่คุ้ม', tTip: 25.39}); sfx('swipe', 25.0, -20); sfx('thud', 25.6, -16);
kcap(26.0, 27.33, 'หรือบางคนเนี่ย');
inkPuzzle(27.35, 28.98, {num: '03', text: 'ยังไม่เห็นว่าช่วยแก้ปัญหาตรงไหน', tMiss: 27.9}); sfx('swipe', 27.35, -18); sfx('thud', 27.8, -16);
kcap(29.0, 29.87, 'ให้เขาตรงไหน');

/* 29.9–33.5 face, a new caption every chunk */
kcap(29.89, 30.12, 'ถ้าเรา');
kcap(30.14, 30.98, 'ไม่แก้ข้อสงสัย');
kcap(31.0, 31.98, 'ต่อให้เราลดราคาเพิ่ม');
kcap(32.0, 33.33, 'ลูกค้าก็อาจจะ');
kcap(33.35, 33.53, 'ยังไม่ซื้อ', {color: R_});

/* 33.5–34.4 turn word */
inkTurn(33.55, 34.4, 'เพราะฉะนั้น', {arrow: true}); sfx('impact', 33.55, -14);

/* 34.4–37.5 */
kcap(34.4, 34.98, 'ถ้าลูกค้าทักมา');
kcap(35.0, 35.39, 'แล้วหายไป', {color: R_});
inkStrike(35.41, 37.48, {pre: 'สิ่งที่ควรทำอย่างแรก ไม่ใช่การ', word: 'ลดราคา', tStrike: 36.3}); sfx('swipe', 35.41, -18); sfx('swipe', 36.3, -12, 1.3);

/* 37.5–40.9 the path · face */
timelineSteps(37.5, 38.98, [['ลูกค้าทักมา', 37.6], ['หาว่าเขาติดอะไร', 38.1]]); sfx('swipe', 37.5, -20); sfx('pop', 37.6, -20); sfx('pop', 38.1, -18, 1.1);
kcap(39.0, 39.56, 'เขาติดอะไรอยู่กันแน่');
kcap(39.58, 40.88, 'แล้วก็แก้ปัญหานั้น');

/* 40.9–41.9 face + pin */
kcap(40.9, 41.87, 'ให้ถูกจุด', {color: G_});
pinDrop(41.0, 41.87); sfx('thud', 41.25, -14); sfx('ding', 41.3, -20);
