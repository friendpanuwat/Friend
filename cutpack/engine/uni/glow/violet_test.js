/* the 12 shots of Friend's 5th sheet for the violet style (2026-11-18), with the sheet's words: NODE_PATH=$(npm root -g) node glow/stills.js
   <work> <out> <frame.jpg> glow/violet_test.js 3.8 "violet:v01@0 … violet:v12@11"
   The numbers card's lines (shot 08) and the strip's words (shot 11) are meta.rows (a real clip takes the numbers card's lines
   from the next subtitles: the lead at the left, the key word at the right). Shots 03, 06, 11 hold several pictures: stills only. */
const VS = i => GL.cats.B04T.SAMPLES[i];
const vioRows = (id, rows) => { SCENES[id].meta.rows = rows; };
GLOWSCENE('v01', 'B04T', 1, VS(1), ['เลิกน้ำหวาน', '30 วัน'], {layout: 'banner_tuck'});
GLOWSCENE('v02', 'B04T', 3, VS(3), ['วันแรก', 'ปวดหัวมาก'], {layout: 'full_tower_r'});
GLOWRECAP('v03', [['B04T', 0, VS(0)], ['B04T', 5, VS(5)], ['B04T', 8, VS(8)]], ['แทนด้วย', 'น้ำเปล่า'], {layout: 'neon_stack'});
GLOWSCENE('v04', 'B04T', 7, VS(7), ['ร้านกาแฟ', 'หวาน 0%'], {layout: 'side_card'});
GLOWSCENE('v05', 'B04T', 9, VS(9), ['อยากมาก', 'บ่ายสาม'], {layout: 'full_tower_l'});
GLOWRECAP('v06', [['B04T', 6, VS(6)], ['B04T', 2, VS(2)]], ['หิวหวาน', 'กินผลไม้'], {layout: 'cascade'});
GLOWSCENE('v07', 'B04T', 7, VS(7), ['สัปดาห์ที่ 2', 'หลับดีขึ้น'], {layout: 'full_tower_r2'});
GLOWSCENE('v08', 'B04T', 5, VS(5), ['น้ำหนัก', '-2 กิโล'], {layout: 'twin_towers'});
vioRows('v08', [['น้ำตาล', '-80%'], ['นอน', '7 ชม.'], ['น้ำหนัก', '-2 กก.']]);
GLOWSCENE('v09', 'B04T', 4, VS(4), ['ไม่ใช้แรงใจ', 'ใช้ระบบ'], {layout: 'full_tower_l2'});
GLOWSCENE('v10', 'B04T', 8, VS(8), ['ครบแล้ว', '30 วัน'], {layout: 'banner_tuck_r'});
GLOWRECAP('v11', [['B04T', 3, VS(3)], ['B04T', 7, VS(7)], ['B04T', 9, VS(9)], ['B04T', 4, VS(4)]], ['เลิกหวาน', '4 ข้อ'], {layout: 'strip_recap'});
vioRows('v11', ['น้ำเปล่า', 'กฎบ้าน', 'ผลไม้', 'ใช้ระบบ']);
GLOWSCENE('v12', 'B04T', 2, VS(2), ['ลองด้วยกันไหม', 'เริ่มพรุ่งนี้'], {layout: 'full_tower_r3'});
