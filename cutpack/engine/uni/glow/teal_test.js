/* the 12 shots of Friend's 4th sheet for the teal style (2026-11-18), with the sheet's words: NODE_PATH=$(npm root -g) node glow/stills.js
   <work> <out> <frame.jpg> glow/teal_test.js 3.8 "teal:t01@0 … teal:t12@11"
   On the speaker "a|b" = the small and the bold line over the key word. In a card the title is the say's words and the sheet's
   bullets / line are meta.rows (a real clip takes them from the next subtitles, Friend: "ใช้คำพูดจริง"). */
const TS = i => GL.cats.B04T.SAMPLES[i];
const tealRows = (id, rows) => { SCENES[id].meta.rows = rows; };
GLOWSCENE('t01', 'B04T', 1, TS(1), ['ทำกับข้าว|ครั้งเดียว', 'กินทั้งสัปดาห์'], {layout: 'full_hook'});
GLOWSCENE('t02', 'B04T', 7, TS(7), ['', 'ของที่ต้องมี'], {layout: 'stack_bullets'});
tealRows('t02', ['กล่องแก้ว 5 ใบ', 'เนื้อสัตว์ 1 อย่าง', 'ผัก 2 อย่าง']);
GLOWSCENE('t03', 'B04T', 5, TS(5), ['', 'วางเมนูก่อนไปตลาด'], {layout: 'stack_graphic'});
tealRows('t03', ['จดเมนู 5 วัน แล้วซื้อตามลิสต์']);
GLOWSCENE('t04', 'B04T', 4, TS(4), ['ไก่ 1 อย่าง|ทำได้', '3 เมนู'], {layout: 'full_top'});
GLOWSCENE('t05', 'B04T', 0, TS(0), ['', 'ก่อนแบ่งใส่กล่อง'], {layout: 'design_row'});
tealRows('t05', ['ล้างมือ ใส่ถุงมือ แล้วค่อยหยิบ']);
GLOWSCENE('t06', 'B01T', 0, GL.cats.B01T.SAMPLES[0], ['ได้ข้าวกล่อง 5 มื้อ', '2 ชม.'], {layout: 'stack_stat'});
tealRows('t06', ['เร็วกว่าสั่งเดลิเวอรี่ทุกวัน']);
GLOWSCENE('t07', 'B04T', 8, TS(8), ['เก็บในตู้เย็น|ได้', '4 วัน'], {layout: 'full_lower'});
GLOWSCENE('t08', 'B04T', 3, TS(3), ['', 'สั่งของออนไลน์'], {layout: 'split_cards'});
tealRows('t08', ['หาสูตร เขียนลิสต์ กดส่ง']);
GLOWSCENE('t09', 'B04T', 2, TS(2), ['อย่าราดซอส|ตอนแบ่งกล่อง', 'ข้าวแฉะ'], {layout: 'full_mistake'});
GLOWSCENE('t10', 'B04T', 6, TS(6), ['', 'เก็บยังไงให้อร่อย'], {layout: 'stack_bullets2'});
tealRows('t10', ['ซอสแยกกล่องเล็ก', 'ผักสดใส่วันที่กิน', 'อุ่นไมโครเวฟ 2 นาที']);
GLOWRECAP('t11', [['B04T', 5, TS(5)], ['B04T', 4, TS(4)], ['B04T', 0, TS(0)]], ['', 'Meal prep ใน 3 ข้อ']);
tealRows('t11', ['วางเมนูก่อน', '2 ชม. 5 กล่อง', 'ซอสแยกกล่อง']);
GLOWSCENE('t12', 'B04T', 3, TS(3), ['อยากได้|คอมเมนต์', '“กล่อง”'], {layout: 'full_cta'});
