face(160, 880);
band('chest');   // the head reaches the top edge — band graphics go under the chin, captions below them
const R_ = OV.red;

/* camera — gentle: the head sits high, a 1.3× crop would cut it */
push(0, 0.9, 1.12, 1.16);
push(0.9, 2.0, 1.06, 1.10);
push(2.0, 7.0, 1.06, 1.14);
push(7.0, 9.0, 1.16, 1.20);
push(9.0, 11.0, 1.08, 1.12);
push(11.0, 13.0, 1.10, 1.16);
push(13.0, 14.0, 1.18, 1.20);
push(14.0, 15.0, 1.22, 1.24);   // "แต่ถ้า" punch
push(15.0, 17.0, 1.08, 1.14);
push(17.0, 20.0, 1.10, 1.18);
push(20.0, 21.41, 1.20, 1.24);  // "รวยแล้ว" punch

/* 0–2 retire: the work sign flips */
doorSign(0.0, 1.98, {front: 'ทำงาน', back: 'เกษียณ', tFlip: 0.15});
ocap(0.9, 1.98, 'ถ้าวันนี้');

/* 2–4 active income = salary */
paySlip(2.0, 3.98, {head: 'เงินเดือน', stamp: 'Active income', tStamp: 2.35});
ocap(2.0, 2.98, 'เงิน Active income ของคุณ', {keys: {'Active income': OV.orange}});
ocap(3.0, 3.98, 'แปลว่าเงินเดือนคุณ');

/* 4–7 time runs out as money */
hourglass(4.0, 6.98, {top: 'เวลา', bottom: 'เงิน'});
ocap(4.0, 4.98, 'หรือเงิน');
ocap(5.0, 6.98, 'ที่คุณต้องเสียสละเวลาไปหามา', {keys: {'เวลา': '#F5C26B'}});

/* 7–9 the money tap closes */
moneyTap(7.0, 8.98, {tOff: 7.85});
ocap(7.0, 8.98, 'เงินมันหยุดเข้ามา', {keys: {'หยุด': R_}});

/* 9–11 how many months */
monthsBattery(9.0, 10.98, {label: 'เดือน', tQ: 9.6});
ocap(9.0, 9.98, 'คุณอยู่ได้กี่เดือน');
ocap(10.0, 10.98, 'ถ้าวันนี้ คำตอบของคุณคือ');

/* 11–13 the years flip */
flipCounter(11.0, 12.98, [['1', 11.0], ['2', 11.6], ['3', 12.2]], {unit: 'ปี'});

/* 13–14 not rich */
crownBreak(13.0, 13.98, {tBreak: 13.5});
ocap(13.0, 13.98, 'เขาไม่เรียกว่ารวย', {keys: {'ไม่': R_}});

/* 14–15 turn */
clash(14.0, 14.98, {a: 'แต่', b: 'ถ้า', sub: 'คุณบอกว่า'});

/* 15–17 stop working */
laptopClose(15.0, 16.98, {tClose: 15.85});
ocap(15.0, 16.98, 'ถ้าวันนี้ ผมไม่ทำงานเลย');

/* 17–20 to the end on a full tank */
roadTrip(17.0, 19.98, {tEnd: 19.0, from: 'วันนี้', to: 'วันตาย', money: 'เงิน'});
ocap(17.0, 18.98, 'แต่ผมอยู่ได้ถึง');
ocap(19.0, 19.98, 'วันตาย');

/* 20–21.4 payoff */
richBurst(20.0, 21.4, {word: 'รวยแล้ว', sub: 'อันนี้เขาเรียกว่ารวย', tSub: 20.3});
