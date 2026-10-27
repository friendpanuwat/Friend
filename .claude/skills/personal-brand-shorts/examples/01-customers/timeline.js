/* example timeline — the 42 s test clip ("ลูกค้าทักมาแล้วหายไป"): overlay graphics above the head + under the chin.
   Times come from chunks.json. face() band measured on the clip's contact sheet. */
face(580, 1010);
const G_ = OV.green, R_ = OV.red;

/* camera — same as v1 */
push(0, 2.0, 1.16, 1.22);
push(2.0, 3.35, 1.22, 1.30); push(3.35, 3.6, 1.42, 1.44); push(3.6, 5.0, 1.28, 1.36);
push(5.0, 6.0, 1.40, 1.42);
push(6.0, 9.57, 1.20, 1.30);
push(9.57, 10.0, 1.26, 1.28); push(10.0, 11.43, 1.36, 1.42);
push(11.43, 13.18, 1.22, 1.30);
push(13.18, 15.06, 1.30, 1.36);
push(15.06, 16.0, 1.22, 1.27); push(16.0, 19.0, 1.30, 1.40);
push(19.0, 21.0, 1.22, 1.28); push(21.0, 23.0, 1.32, 1.38);
push(23.0, 29.87, 1.18, 1.32);
push(29.87, 31.0, 1.24, 1.28); push(31.0, 33.55, 1.34, 1.42);
push(33.55, 34.4, 1.42, 1.44);
push(34.4, 35.41, 1.24, 1.30); push(35.41, 37.5, 1.30, 1.36);
push(37.5, 40.9, 1.20, 1.28); push(40.9, 41.9, 1.34, 1.40);

/* 0–2 TOP: customer's question arrives, is read… and breaks apart */
tChat(0.1, 2.0, {text: 'สอบถามรายละเอียดสินค้า', read: 1.0, gone: 1.75});
ocap(0.0, 0.98, 'เวลาลูกค้าทักมาถาม');
ocap(1.0, 2.0, 'รายละเอียดสินค้า แล้วก็หายไป');

/* 2–5 TOP: ? chips, then the price tag swings */
ocap(2.02, 3.33, 'หลายคนก็อาจจะคิดว่า');
ocap(3.35, 3.58, 'เฮ้ย', {size: 110});
ocap(3.6, 4.98, 'มันเป็นเพราะของเราแพงหรือเปล่า', {keys: {'แพง': R_}});
qChips(2.4, 3.9, [[230, 250, 2.5], [640, 230, 3.0]]);
tTag(3.95, 4.98, {label: 'แพง?'});

/* 5–6 turn word */
uStretch(5.0, 5.98, 'แต่จริง ๆ แล้ว');

/* 6–9.5 reasons: TOP icons light up with the pills under the chin */
tIcons(6.0, 9.55, [['scale', OV.orange, 6.0], ['shield', OV.blue, 7.0], ['cart', OV.red, 8.46]], {label: 'ลูกค้าอาจจะ…'});
uChips(6.0, 9.55, [['ลังเล', 6.0], ['ไม่มั่นใจในตัวสินค้า', 7.0], ['ไม่รู้ว่าจะซื้อดีไหม', 8.46]]);

/* 9.5–11.4 TOP: the shop */
ocap(9.57, 9.98, 'แต่ปัญหาก็คือ');
ocap(10.0, 11.41, 'เจ้าของธุรกิจ');
tShop(10.0, 11.41);

/* 11.4–13.2 TOP: fewer customers · quiet */
ocap(11.43, 12.0, 'พอเห็นลูกค้าน้อยลง');
tPeople(11.43, 12.0, {n: 5, fade: 3});
ocap(12.0, 13.16, 'หรือเงียบไป');
tToggle(12.0, 13.16, {tOff: 12.35, label: 'เงียบ'});

/* 13.2–15 UNDER: click promotion, discount */
uButtons(13.18, 15.06, [['ทำโปรโมชั่น', OV.orange, 13.6], ['ลดราคา', OV.red, 14.15]]);

/* 15–19 TOP: ? turns into ✓ on "คำตอบ" · UNDER: ✕ / ✓ */
tAnswer(15.08, 18.98, {tCheck: 18.26});
ocap(15.08, 15.98, 'สิ่งที่ลูกค้าต้องการ');
olist(16.0, 18.98, [{text: 'อาจจะไม่ใช่ส่วนลด', t: 16.0, keys: {'ส่วนลด': R_}, mark: 'x'}, {text: 'แต่คือคำตอบที่เขากังวล', t: 17.72, keys: {'คำตอบ': G_}, mark: 'check'}]);

/* 19–21 TOP: price keeps dropping */
ocap(19.0, 20.98, 'ต่อให้ลดราคาเยอะแค่ไหน');
tDown(19.0, 20.98);

/* 21–23 TOP: questions in mind · UNDER: pay button never clicked */
qChips(21.39, 22.98, [[250, 240, 21.39], [470, 210, 21.6], [690, 250, 21.8]]);
uPay(21.0, 22.98, {label: 'จ่ายเงิน'});

/* 23–29.9 TOP: a ? over each person as each doubt is spoken · UNDER: the doubts */
tDoubts(23.0, 29.87, [23.54, 25.39, 27.6], {label: 'บางคน…'});
uChips(23.0, 29.87, [['ไม่มั่นใจเรื่องคุณภาพ', 23.54], ['กลัวซื้อไปแล้วไม่คุ้ม', 25.39], ['ไม่เห็นว่าช่วยแก้ปัญหาตรงไหน', 27.6]], {style: 'outline'});

/* 29.9–33.5 TOP: we offer a bigger discount → read, no reply */
ocap(29.89, 30.98, 'ถ้าเราไม่แก้ข้อสงสัย');
ocap(31.0, 31.98, 'ต่อให้เราลดราคาเพิ่ม');
ocap(32.0, 33.5, 'ลูกค้าก็อาจจะยังไม่ซื้ออยู่ดี');
tChat(31.0, 33.5, {text: 'ลดราคาเพิ่มให้ครับ', from: 'me', read: 31.7});

/* 33.5–34.4 turn word */
uStretch(33.55, 34.4, 'เพราะฉะนั้น');

/* 34.4–35.4 TOP: the customer's message fades away */
ocap(34.4, 35.39, 'ถ้าลูกค้าทักมาแล้วหายไป');
tChat(34.4, 35.39, {text: 'สอบถามรายละเอียดสินค้า', gone: 35.0});

/* 35.4–37.5 UNDER: not a discount */
uStrike(35.41, 37.48, {pre: 'สิ่งที่ควรทำอย่างแรก ไม่ใช่การ', word: 'ลดราคา', tStrike: 36.3});

/* 37.5–40.9 UNDER: the path */
uSteps(37.5, 40.9, [['ลูกค้าทักมา', 37.6], ['หาว่าเขาติดอะไร', 38.2], ['แก้ให้ถูกจุด', 39.6]]);

/* 40.9–41.9 TOP: pin on the spot */
ocap(40.9, 41.87, 'ให้ถูกจุด', {keys: {'ถูกจุด': G_}});
tPin(41.0, 41.87);
