/* the 12 shots of Friend's 9th sheet for the terminal style (2026-11-18), with the sheet's words: NODE_PATH=$(npm root -g) node
   glow/stills.js <work> <out> <frame.jpg> glow/terminal_test.js 3.8 "terminal:m01@0 … terminal:m12@11"
   The lines of the windows are meta.rows (a real clip takes them from the picture's next subtitles); the number card's row is
   [label, number]. Shots 01 03 06 08 10 12 have no picture on the sheet (cat null), 11 holds two (stills only). Pictures: B04T
   chevrons 1 (02), rail 3 (04), checklist 7 (05), progress 5 (07), ladder 9 (09). */
const MS = i => GL.cats.B04T.SAMPLES[i];
const trmRows = (id, rows) => { SCENES[id].meta.rows = rows; };
GLOWSCENE('m01', null, 0, null, ['วันทำงานที่บ้าน', 'แบบไม่หลุดโฟกัส'], {layout: 'term_plan'});
trmRows('m01', ['today.plan', 'ตื่น ยืดเส้น ออกไปเดิน', 'งานชิ้นแรก 90 นาที', 'พักกินข้าว ไม่แตะจอ', 'ทบทวนงานช่วงเช้า', 'ปิดเครื่อง ปิดวัน', 'ปลุกครั้งเดียว ไม่กดเลื่อน']);
GLOWSCENE('m02', 'B04T', 1, MS(1), ['เช้าแบบ', 'ไม่ต้องพึ่งแรงใจ'], {layout: 'hero_chev'});
GLOWSCENE('m03', null, 0, null, ['แจ้งเตือนเดียว', 'ที่ยอมให้เด้ง'], {layout: 'notif_top'});
trmRows('m03', ['เริ่มงานชิ้นแรก ปิดแชตก่อน']);
GLOWSCENE('m04', 'B04T', 3, MS(3), ['ตั้งแอปจับเวลา', 'ไว้ครั้งเดียว'], {layout: 'win_speaker'});
GLOWSCENE('m05', 'B04T', 7, MS(7), ['งานชิ้นแรก', 'ทำทีละหน้าต่าง'], {layout: 'stack3'});
GLOWSCENE('m06', null, 0, null, ['โฟกัสทีละ', '25 นาที'], {layout: 'term_log'});
trmRows('m06', ['focus.log', 'หาข้อมูล 25 นาที', 'เขียนร่างแรก', 'ส่งให้หัวหน้า']);
GLOWSCENE('m07', 'B04T', 5, MS(5), ['บ่ายสองโมง', 'ทบทวนก่อนลุยต่อ'], {layout: 'split_top'});
GLOWSCENE('m08', null, 0, null, ['ช่วงบ่าย', 'ช่วงที่หลุดง่ายสุด'], {layout: 'dialog'});
trmRows('m08', ['ปิดแชตทั้งหมด 1 ชั่วโมง?', 'เปิดได้อีกทีตอน 16:00']);
GLOWSCENE('m09', 'B04T', 9, MS(9), ['6 โมงเย็น', 'ปิดวันให้จบ'], {layout: 'big_win'});
GLOWSCENE('m10', null, 0, null, ['ไม่ได้ทำเยอะขึ้น', 'แค่หลุดน้อยลง'], {layout: 'stat'});
trmRows('m10', [['โฟกัสวันนี้', '4:12 ชม.']]);
GLOWRECAP('m11', [['B04T', 1, MS(1)], ['B04T', 5, MS(5)]], ['สรุปวันทำงาน', 'ที่บ้าน'], {layout: 'recap3'});
trmRows('m11', ['shutdown', 'ปิดไฟ', 'ล็อกประตู', 'เข้านอน']);
GLOWSCENE('m12', null, 0, null, ['พรุ่งนี้ลอง', 'ใช้รูทีนนี้ดู'], {layout: 'cta'});
trmRows('m12', ['บันทึกรูทีนนี้ไว้ไหม?', 'ตอนหน้า: จัดโต๊ะให้โฟกัสง่ายขึ้น']);
