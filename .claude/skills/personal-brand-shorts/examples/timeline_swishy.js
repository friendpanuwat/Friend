/* timeline of swishy_v1 (42 s test clip "ลูกค้าทักมาแล้วหายไป").
   build: cat assets/engine_head.html assets/reflook.js assets/ioslook.js assets/swishylook.js examples/timeline_swishy.js assets/engine_tail.html > scene.html */
face(580, 1010);
const G_ = IOS.green, R_ = IOS.red;

/* camera — talking-head-motion zooms on the talking parts (zoom.md): slow 1.05–1.06 on a phrase,
   quick 1.07–1.09 on a key word, back to 1.0 (.35) on a new sentence; never above 1.14 */
zoom(2.02, 1.05, .6);                          // หลายคนก็อาจจะคิดว่า
zoom(3.35, 1.09, .12);                         // เฮ้ย
zoom(3.6, 1.0, .35); zoom(4.0, 1.07, .14);     // ของเรา·แพง
zoom(5.0, 1.0, .35);
zoom(9.57, 1.05, .6); zoom(10.0, 1.08, .12);   // แต่ปัญหาก็คือ · เจ้าของธุรกิจ
zoom(11.0, 1.0, .35);
zoom(15.08, 1.05, .7);                         // สิ่งที่ลูกค้าต้องการ
zoom(18.26, 1.08, .12);                        // คำตอบ
zoom(19.0, 1.0, .35);
zoom(26.0, 1.06, .7); zoom(27.35, 1.0, .35);   // หรือบางคนเนี่ย
zoom(29.89, 1.05, .6);                         // ถ้าเราไม่แก้ข้อสงสัย
zoom(31.0, 1.07, .14);                         // ลดราคาเพิ่ม
zoom(32.0, 1.0, .35); zoom(33.35, 1.06, .5);   // ยังไม่ซื้ออยู่ดี
zoom(33.55, 1.0, .35);
zoom(34.4, 1.05, .6); zoom(35.41, 1.0, .35);   // ถ้าลูกค้าทักมาแล้วหายไป
zoom(41.0, 1.09, .12);                         // ให้ถูกจุด

/* 0–2 the question pops… and dissolves */
bubblePop(0, 2.0, 'สอบถามรายละเอียดสินค้า', {tGone: 1.6});

/* 2–5 face, "แพง?" chips */
rcap(2.02, 3.33, 'หลายคนก็อาจจะคิดว่า');
rcap(3.35, 3.58, 'เฮ้ย', {size: 110});
rcap(3.6, 4.98, 'มันเป็นเพราะของเราแพงหรือเปล่า', {keys: {'แพง': R_}});
chipsNear(2.4, 4.98, [['?', 2.5], ['?', 3.1], ['แพง?', 4.05]]);

/* 5–6 stretch word */
stretchWord(5.0, 5.98, 'แต่จริง ๆ แล้ว');

/* 6–9.5 reasons drop in */
chipDrop(6.0, 9.55, [['ลังเล', 6.0], ['ไม่มั่นใจในตัวสินค้า', 7.0], ['ไม่รู้ว่าจะซื้อดีไหม', 8.46]], {title: 'ลูกค้าอาจจะ…'});

/* 9.5–11 face */
rcap(9.57, 9.98, 'แต่ปัญหาก็คือ');
rcap(10.0, 11.0, 'เจ้าของธุรกิจ');

/* 11–12 fewer customers */
lineDown(11.0, 12.0, {label: 'ลูกค้า'});

/* 12–13.2 silence: the switch goes off */
toggleOff(12.0, 13.16, {tOff: 12.35, label: 'เงียบ'});

/* 13.2–15 click, click */
clickButtons(13.18, 15.06, [['ทำโปรโมชั่น', SW.orange, 13.6], ['ลดราคา', SW.red, 14.15]]);

/* 15–19 discount ✕ / answer ✓ */
rcap(15.08, 15.98, 'สิ่งที่ลูกค้าต้องการ');
markList(16.0, 18.98, [{text: 'อาจจะไม่ใช่ส่วนลด', t: 16.0, keys: {'ส่วนลด': R_}, mark: 'x'}, {text: 'แต่คือคำตอบที่เขากังวล', t: 17.72, keys: {'คำตอบ': G_}, mark: 'check'}]);

/* 19–23 the pay button that never gets pressed */
hoverButton(19.0, 22.98, {label: 'จ่ายเงิน', tq: 21.39});

/* 23–26 doubts drop · 26–27.3 face · 27.35–29.9 one more */
chipDrop(23.0, 25.98, [['ไม่มั่นใจเรื่องคุณภาพ', 23.54], ['กลัวซื้อไปแล้วไม่คุ้ม', 25.39]], {bg: SW.electric, title: 'บางคน…', outline: false});
rcap(26.0, 27.33, 'หรือบางคน');
chipDrop(27.35, 29.87, [['ยังไม่เห็นว่าช่วยแก้ปัญหาตรงไหน', 27.6]], {bg: SW.electric, outline: false});

/* 29.9–33.5 face */
rcap(29.89, 30.98, 'ถ้าเราไม่แก้ข้อสงสัย');
rcap(31.0, 31.98, 'ต่อให้เราลดราคาเพิ่ม');
rcap(32.0, 33.5, 'ลูกค้าก็อาจจะยังไม่ซื้ออยู่ดี');

/* 33.5–34.4 stretch word */
stretchWord(33.55, 34.4, 'เพราะฉะนั้น');

/* 34.4–37.5 */
rcap(34.4, 35.39, 'ถ้าลูกค้าทักมาแล้วหายไป');
bigStrike(35.41, 37.48, {pre: 'สิ่งที่ควรทำอย่างแรก ไม่ใช่การ', word: 'ลดราคา', tStrike: 36.3});

/* 37.5–40.9 the path to the right spot */
timelineSteps(37.5, 40.9, [['ลูกค้าทักมา', 37.7], ['หาว่าเขาติดอะไร', 38.2], ['แก้ให้ถูกจุด', 39.6]]);

/* 40.9–41.9 face + pin */
rcap(40.9, 41.87, 'ให้ถูกจุด', {keys: {'ถูกจุด': G_}});
pinDrop(41.0, 41.87);
