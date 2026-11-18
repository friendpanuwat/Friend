/* the 12 shots of Friend's 6th sheet for the yellow style (2026-11-18), with the sheet's words: NODE_PATH=$(npm root -g) node glow/stills.js
   <work> <out> <frame.jpg> glow/yellow_test.js 3.8 "yellow:y01@0 … yellow:y12@11"
   The chips are meta.rows ([number, words, 'on' yellow | 'off' dark], as the sheet shows them; a real clip takes them from the next
   subtitles), the tile's and the giant's number meta.num (a real clip: a number the speaker says). Shots 01, 06, 10, 12 have no
   picture on the sheet (cat null). Pictures: B04T chevrons 1 (shots 02 04 05 11), ladder 9 (03), rail 3 (07), progress 5 (08),
   carousel 6 (09), as on the sheet. */
const YS = i => GL.cats.B04T.SAMPLES[i];
const yelRows = (id, rows, num) => { SCENES[id].meta.rows = rows.map((r, k) => Array.isArray(r) ? r : [k + 1, r, 'on']); if (num) SCENES[id].meta.num = num; };
const STEPS = ['ตื่น', 'ยืดเส้น', 'ออกไปวิ่ง'];
GLOWSCENE('y01', null, 0, null, ['อยากวิ่งทุกเช้า แต่ไม่เคยรอด?', 'ใช้แค่ 3 ขั้น'], {layout: 'full_chips'});
yelRows('y01', STEPS);
GLOWSCENE('y02', 'B04T', 1, YS(1), ['3 ขั้นทำให้วิ่งเป็นนิสัย', 'ไม่ต้องรอใจพร้อม'], {layout: 'full_steps'});
yelRows('y02', STEPS);
GLOWSCENE('y03', 'B04T', 9, YS(9), ['ขั้นที่ 1 เริ่มตั้งแต่คืนก่อน', 'นอนให้ทัน'], {layout: 'tile_ladder'});
yelRows('y03', [[3, 'เข้านอน', 'on'], [2, 'ล็อกประตู', 'on'], [1, 'ปิดไฟ', 'on']], '1');
GLOWSCENE('y04', 'B04T', 1, YS(1), ['ขั้นที่ 2 ใช้แค่ 5 นาที', 'ยืดเส้นก่อน'], {layout: 'split_top'});
yelRows('y04', [[1, 'ตื่น', 'off'], [2, 'ยืดเส้น', 'on'], [3, 'ออกไปวิ่ง', 'off']]);
GLOWSCENE('y05', 'B04T', 1, YS(1), ['ขั้นสุดท้าย ไม่ต้องไกล', 'แค่ออกจากบ้าน'], {layout: 'tile_steps'});
yelRows('y05', [[1, 'ตื่น', 'off'], [2, 'ยืดเส้น', 'off'], [3, 'ออกไปวิ่ง', 'on']], '3');
GLOWSCENE('y06', null, 0, null, ['3 วันแรกผ่านไป', 'ทำได้แล้ว 2 ขั้น'], {layout: 'full_list'});
yelRows('y06', [[1, 'ตื่น', 'on'], [2, 'ยืดเส้น', 'on'], [3, 'ออกไปวิ่ง', 'off']]);
GLOWSCENE('y07', 'B04T', 3, YS(3), ['อยากวิ่งต่อเนื่อง ต้องมีเป้า', 'สมัครงานวิ่ง 5K'], {layout: 'card_rail'});
yelRows('y07', ['สมัคร', 'ยืนยันอีเมล', 'เริ่มใช้']);
GLOWSCENE('y08', 'B04T', 5, YS(5), ['ทุกอาทิตย์ทำแบบนี้', 'ซ้อมแบบมีแผน'], {layout: 'split_bottom'});
yelRows('y08', ['วางแผน', 'ลงมือ', 'ทบทวน']);
GLOWSCENE('y09', 'B04T', 6, YS(6), ['วันแข่งไม่ต้องรีบ', 'จองตั๋วไว้ก่อน'], {layout: 'full_pair'});
yelRows('y09', ['ซื้อตั๋ว', 'ขึ้นรถไฟ']);
GLOWSCENE('y10', null, 0, null, ['วิ่งต่อกันให้ครบ 21 วัน', 'แล้วจะไม่ต้องฝืน'], {layout: 'giant'});
yelRows('y10', ['เริ่ม', 'ชิน', 'ติดแล้ว'], '21');
GLOWSCENE('y11', 'B04T', 1, YS(1), ['สรุปสั้น ๆ', '3 ขั้นเท่านั้น'], {layout: 'recap'});
yelRows('y11', STEPS);
GLOWSCENE('y12', null, 0, null, ['เริ่มพรุ่งนี้เช้า', 'ไปวิ่งด้วยกัน'], {layout: 'full_cta'});
yelRows('y12', ['เซฟไว้', 'แชร์ให้เพื่อน', 'กดติดตาม']);
