/* the 12 shots of Friend's sheet for the lime style (2026-11-18), with the sheet's words: NODE_PATH=$(npm root -g) node glow/stills.js
   <work> <out> <frame.jpg> glow/lime_test.js 3.8 "lime:l01@0 lime:l02@1 … lime:l12@11" */
const LS = i => GL.cats.B04T.SAMPLES[i];
GLOWSCENE('l01', null, 0, null, ['วันวุ่น ๆ แบบนี้ ต้องมีระบบ', 'จัดเป็นขั้น'], {layout: 'talk'});
GLOWSCENE('l02', 'B04T', 3, LS(3), ['สมัครง่าย 3 ขั้น', 'เริ่มใช้'], {layout: 'hands'});
GLOWSCENE('l03', 'B04T', 3, LS(3), ['ขั้นที่คนชอบลืม', 'ยืนยันอีเมล'], {layout: 'big'});
GLOWSCENE('l04', 'B04T', 1, LS(1), ['ตื่นมา แอปเตือนให้ ก่อนวิ่ง', 'ยืดเส้น'], {layout: 'top'});
GLOWSCENE('l05', 'B04T', 6, LS(6), ['ออกจากบ้าน ตั๋วพร้อม', 'ขึ้นรถไฟ'], {layout: 'split_top'});
GLOWSCENE('l06', 'B04T', 7, LS(7), ['งานค้างที่ขั้นเดียว', 'เขียน'], {layout: 'side_l'});
GLOWSCENE('l07', null, 0, null, ['ไม่ต้องจำเอง แอปจำให้', 'ทุกขั้น'], {layout: 'talk_top'});
GLOWSCENE('l08', 'B04T', 5, LS(5), ['เย็นนี้ อย่าลืม', 'ทบทวน'], {layout: 'screen'});
GLOWSCENE('l09', 'B04T', 9, LS(9), ['ก่อนนอน 3 อย่าง', 'เข้านอน'], {layout: 'side_r'});
GLOWSCENE('l10', 'B04T', 2, LS(2), ['วันหยุดจะปั่น เช็ก 3 จุด', 'เช็กเบรก'], {layout: 'split_bottom'});
GLOWRECAP('l11', [['B04T', 1, LS(1)], ['B04T', 6, LS(6)], ['B04T', 7, LS(7)], ['B04T', 9, LS(9)]], ['ทั้งวัน ไม่หลุดสักขั้น', 'ครบทุกขั้น']);
GLOWSCENE('l12', 'B04T', 3, LS(3), ['สมัครฟรี ลิงก์ในไบโอ', 'เริ่มเลย'], {layout: 'cta'});
