/* clip 04 — "เกษียณ / รวย" (21 s) · the head reaches the top edge: gentle zooms, captions under the chin */
face(160, 880);

zoom(7.0, 1.06, .14); zoom(9.0, 1.0, .35);
zoom(13.0, 1.04, .14); zoom(14.0, 1.0, .35);
zoom(15.82, 1.06, .14); zoom(17.0, 1.0, .35);
zoom(20.0, 1.08, .12);

/* 0–2 opens on his face: the hook caption is there at frame 0 */
kcap(-.2, .88, 'เกษียณคือ…', {key: 'เกษียณ', keyColor: HILITE, size: 130});
kcap(.9, 1.98, 'ถ้าวันนี้');

/* 2–7 active income = salary = time traded for money */
sceneIncome(2.0, 6.98, {tSalary: 3.0, tTime: 4.0, tSacrifice: 5.0});

/* 7–9 face */
kcap(7.0, 8.98, 'เงินมันหยุดเข้ามา', {key: 'หยุด', keyColor: RED});

/* 9–13 how many months · 1, 2, 3 years */
sceneHowLong(9.0, 12.98, {tYears: [['1 ปี', 11.0], ['2 ปี', 11.6], ['3 ปี', 12.2]]});

/* 13–17 face */
kcap(13.0, 13.98, 'เขาไม่เรียกว่ารวย', {key: 'ไม่', keyColor: RED});
kcap(14.0, 14.98, 'แต่ถ้าคุณบอกว่า');
kcap(15.0, 16.98, 'ถ้าวันนี้ ผมไม่ทำงานเลย', {key: 'ไม่ทำงาน', keyColor: HILITE});

/* 17–20 today → the end, money still full */
sceneLifeline(17.0, 19.98, {tEnd: 19.0});

/* 20–21.4 face */
kcap(20.0, 20.7, 'รวยแล้ว', {color: HILITE, size: 130});
kcap(20.72, 21.4, 'อันนี้เขาเรียกว่ารวย', {key: 'รวย', keyColor: HILITE});
