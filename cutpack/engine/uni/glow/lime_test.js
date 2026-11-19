/* the 12 shots of Friend's sheet for the lime style (2026-11-18), with the sheet's key words and SHORT leads, one phrase as a real clip's (Friend 2026-11-18: "ตัวเล็กในภาพนิ่งยาวไป ส่วนในคลิปจริงสั้นพอแล้ว"): NODE_PATH=$(npm root -g) node glow/stills.js
   <work> <out> <frame.jpg> glow/lime_test.js 3.8 "lime:l01@0 lime:l02@1 … lime:l12@11" */
const LS = i => GL.cats.B04T.SAMPLES[i];
GLOWSCENE('l01', null, 0, null, ['ต้องมี', 'จัดเป็นขั้น'], {layout: 'talk'});
GLOWSCENE('l02', 'B04T', 3, LS(3), ['สมัครแค่', 'เริ่มใช้'], {layout: 'hands'});
GLOWSCENE('l03', 'B04T', 3, LS(3), ['คนชอบลืม', 'ยืนยันอีเมล'], {layout: 'big'});
GLOWSCENE('l04', 'B04T', 1, LS(1), ['ก่อนวิ่ง', 'ยืดเส้น'], {layout: 'top'});
GLOWSCENE('l05', 'B04T', 6, LS(6), ['ตั๋วพร้อม', 'ขึ้นรถไฟ'], {layout: 'split_top'});
GLOWSCENE('l06', 'B04T', 7, LS(7), ['ค้างที่', 'เขียน'], {layout: 'side_l'});
GLOWSCENE('l07', null, 0, null, ['แอปจำให้', 'ทุกขั้น'], {layout: 'talk_top'});
GLOWSCENE('l08', 'B04T', 5, LS(5), ['อย่าลืม', 'ทบทวน'], {layout: 'screen'});
GLOWSCENE('l09', 'B04T', 9, LS(9), ['ก่อนนอน', 'เข้านอน'], {layout: 'side_r'});
GLOWSCENE('l10', 'B04T', 2, LS(2), ['ก่อนปั่น', 'เช็กเบรก'], {layout: 'split_bottom'});
GLOWRECAP('l11', [['B04T', 1, LS(1)], ['B04T', 6, LS(6)], ['B04T', 7, LS(7)], ['B04T', 9, LS(9)]], ['ทั้งวัน', 'ครบทุกขั้น']);
GLOWSCENE('l12', 'B04T', 3, LS(3), ['สมัครฟรี', 'เริ่มเลย'], {layout: 'cta'});
