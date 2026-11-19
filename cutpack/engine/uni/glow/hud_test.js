/* the 12 shots of Friend's 7th sheet for the HUD style (2026-11-18, measured on the 12-shot sheet), with the sheet's words:
   NODE_PATH=$(npm root -g) node glow/stills.js <work> <out> <frame.jpg> glow/hud_test.js 3.8 "hud:h01@0 … hud:h12@11"
   The callout notes are meta.rows (a real clip takes them from the picture's next subtitles). Shots 01 06 10 12 have no picture (04 since the final: the two-card screen, B04T 4)
   on the sheet (cat null). Pictures: B04T row 0 (02), diagonal 2 (03), carousel 6 (05), progress 5 (07), rail 3 (08), chevrons 1 (09),
   shot 11 three at once (diagonal, chevrons, row: stills only). */
const HS = i => GL.cats.B04T.SAMPLES[i];
const hudRows = (id, rows) => { SCENES[id].meta.rows = rows; };
GLOWSCENE('h01', null, 0, null, ['ทริปปั่นจักรยานครั้งแรก', 'เตรียมยังไงดี'], {layout: 'hud_open'});
hudRows('h01', ['มือใหม่ · 0 ทริป']);
GLOWSCENE('h02', 'B04T', 0, HS(0), ['3 ขั้นก่อน', 'หยิบของ'], {layout: 'hud_row'});
hudRows('h02', ['ล้างมือ → ใส่ถุงมือ → หยิบ']);
GLOWSCENE('h03', 'B04T', 2, HS(2), ['ก่อนออกจากบ้าน', 'เช็ก 3 จุด'], {layout: 'hud_diag'});
hudRows('h03', ['ไฟหน้า-ท้าย ชาร์จเต็ม', 'ลมยาง ดูตัวเลขข้างยาง', 'บีบแล้วต้องหน่วงทันที']);
GLOWSCENE('h04', 'B04T', 4, HS(4), ['แต่งตัวให้ปั่นสบาย', 'ใส่ถุงมือ'], {layout: 'hud_card'});   // (final 2026-11-18: the two-card screen has a picture)
hudRows('h04', ['ถุงมือ กันมือลื่น', 'เสื้อแขนยาว กันแดด']);
GLOWSCENE('h05', 'B04T', 6, HS(6), ['พาจักรยานขึ้นรถไฟ', 'ซื้อตั๋วไว้ก่อน'], {layout: 'hud_time'});
hudRows('h05', ['ออกบ้าน', 'ขึ้นรถไฟ', 'ถึงจุดปั่น']);
GLOWSCENE('h06', null, 0, null, ['ถึงจุดปั่นแล้ว', 'อย่าเพิ่งรีบ'], {layout: 'hud_path'});
hudRows('h06', ['ยืดเส้น 5 นาที', 'จิบน้ำ', 'เช็กรถอีกรอบ', 'ออกตัวช้า ๆ']);
GLOWSCENE('h07', 'B04T', 5, HS(5), ['ระหว่างทาง แวะพักทุก 20 กม.', 'ทบทวนแผน'], {layout: 'hud_split'});
GLOWSCENE('h08', 'B04T', 3, HS(3), ['ระหว่างปั่น จับเส้นทาง', 'เปิดแอป'], {layout: 'hud_rail'});
GLOWSCENE('h09', 'B04T', 1, HS(1), ['ก่อนกลับ อย่าลืม', 'คูลดาวน์'], {layout: 'hud_measure'});
hudRows('h09', ['≈ 10 นาที']);
GLOWSCENE('h10', null, 0, null, ['ทริปแรกสอนผมว่า', 'อย่าปั่นเกินแรง'], {layout: 'hud_word'});
hudRows('h10', ['บทเรียนทริปแรก']);
GLOWRECAP('h11', [['B04T', 2, HS(2)], ['B04T', 1, HS(1)], ['B04T', 0, HS(0)]], ['สรุปทริปแรก', 'เช็ก · ยืด · ใส่'], {layout: 'hud_recap'});
GLOWSCENE('h12', null, 0, null, ['ทริปหน้า ไปไกลกว่านี้', 'กดติดตามไว้'], {layout: 'hud_cta'});
hudRows('h12', ['ตอนต่อไป →']);
