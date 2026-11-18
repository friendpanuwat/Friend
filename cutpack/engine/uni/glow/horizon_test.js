/* the 12 shots of Friend's 8th sheet for the horizon style (2026-11-18), with the sheet's words: NODE_PATH=$(npm root -g) node
   glow/stills.js <work> <out> <frame.jpg> glow/horizon_test.js 3.8 "horizon:o01@0 … horizon:o12@11"
   A lead "a|b" is two phrases (both sides, or two lines). The card lines are meta.rows (a real clip takes them from the picture's
   next subtitles). Shots 06 08 have no picture on the sheet (cat null), 11 holds four (stills only). Pictures: B04T progress 5 (01),
   rail 3 (02 12), checklist 7 (03), row 0 (04), ladder 9 (05), diagonal 2 (07), cycle 4 (09), wave 8 (10). */
const OS = i => GL.cats.B04T.SAMPLES[i];
const horRows = (id, rows) => { SCENES[id].meta.rows = rows; };
GLOWSCENE('o01', 'B04T', 5, OS(5), ['ร้านแรกของผม|ขายของทำมือ', 'สบู่ทำมือ'], {layout: 'full_hook'});
GLOWSCENE('o02', 'B04T', 3, OS(3), ['เริ่มจาก|เปิดร้านออนไลน์', 'ฟรี'], {layout: 'full_stack_rail'});
GLOWSCENE('o03', 'B04T', 7, OS(7), ['ถ่ายรูปสินค้า', 'แสงธรรมชาติ'], {layout: 'full_float_card'});
horRows('o03', ['แคปชั่น 3 บรรทัด', 'หาข้อมูล · เขียน · ส่ง']);
GLOWSCENE('o04', 'B04T', 0, OS(0), ['ก่อนแพ็กทุกครั้ง', 'ใส่ถุงมือ'], {layout: 'dark_graphic'});
horRows('o04', ['ล้างมือ · ใส่ถุงมือ · หยิบของ']);
GLOWSCENE('o05', 'B04T', 9, OS(9), ['ออเดอร์แรก|มาตอน', 'ตีหนึ่ง'], {layout: 'full_side_ladder'});
GLOWSCENE('o06', null, 0, null, ['รีวิวแรก', '5 ดาว'], {layout: 'inset_review'});
horRows('o06', ['หอมมาก ผิวไม่แห้ง', 'รูปจริง ไม่แต่ง', 'ส่งภายใน 24 ชม.', 'แถมการ์ดขอบคุณ']);
GLOWSCENE('o07', 'B04T', 2, OS(2), ['บทเรียน|ราคาแพง', 'เช็ก 3 รอบ'], {layout: 'full_side_diagonal'});
GLOWSCENE('o08', null, 0, null, ['', '42 ชิ้น'], {layout: 'float_cards'});
horRows('o08', [['ยอดขาย', '4,200'], ['ต้นทุน', '1,900'], ['กำไร', '2,300']]);
GLOWSCENE('o09', 'B04T', 4, OS(4), ['สูตรสบู่|ทำเหมือนขนม', 'การผสม'], {layout: 'full_side_cycle'});
GLOWSCENE('o10', 'B04T', 8, OS(8), ['ร้านเล็ก ๆ|จะโตได้', 'ต้องรอ'], {layout: 'full_stack_wave'});
GLOWRECAP('o11', [['B04T', 3, OS(3)], ['B04T', 7, OS(7)], ['B04T', 0, OS(0)], ['B04T', 2, OS(2)]], ['เปิดร้านออนไลน์', '4 ขั้น'], {layout: 'recap_grid'});
horRows('o11', ['เปิดร้าน', 'ถ่ายรูป', 'แพ็กของ', 'เช็ก 3 รอบ']);
GLOWSCENE('o12', 'B04T', 3, OS(3), ['อยากเปิดร้าน|บ้างไหม', 'คอมเมนต์ “ร้าน”'], {layout: 'full_cta'});
