/* the 12 shots of Friend's 10th sheet for the pink style (2026-11-18), with the sheet's words: NODE_PATH=$(npm root -g) node
   glow/stills.js <work> <out> <frame.jpg> glow/pink_test.js 3.8 "pink:p01@0 … pink:p12@11"
   A lead "a|b" is two phrases (two lines where the shot has two). The card lines are meta.rows (a real clip takes them from the
   picture's next subtitles; a row is [label, value]). Shots 05 09 10 have no picture on the sheet (cat null), 11 holds four (stills
   only). Pictures: B04T progress 5 (01), checklist 7 (02), rail 3 (03), row 0 (04), wave 8 (06), ladder 9 (07), chevrons 1 (08),
   carousel 6 (12). */
const PS = i => GL.cats.B04T.SAMPLES[i];
const pnkRows = (id, rows) => { SCENES[id].meta.rows = rows; };
GLOWSCENE('p01', 'B04T', 5, PS(5), ['ย้ายคอนโดแรก', 'ใน 7 วัน'], {layout: 'stack_hook'});
pnkRows('p01', ['แผนทั้งสัปดาห์']);
GLOWSCENE('p02', 'B04T', 7, PS(7), ['วันแรก|หาห้อง', 'เทียบ 5 ที่'], {layout: 'side_cards'});
GLOWSCENE('p03', 'B04T', 3, PS(3), ['จองรถขนของ', 'ผ่านแอป'], {layout: 'graphic_card'});
pnkRows('p03', ['จองรถขนของ']);
GLOWSCENE('p04', 'B04T', 0, PS(0), ['แพ็กของ', 'ใส่ถุงมือ'], {layout: 'full_row'});
pnkRows('p04', ['ก่อนยกกล่อง']);
GLOWSCENE('p05', null, 0, null, ['ของเยอะ|กว่าที่คิด', '32 กล่อง'], {layout: 'full_stat'});
pnkRows('p05', ['ขนวันเดียวจบ']);
GLOWSCENE('p06', 'B04T', 8, PS(8), ['ต้นไม้', 'รดน้ำทันที'], {layout: 'stack_wave'});
pnkRows('p06', ['ถึงห้องใหม่']);
GLOWSCENE('p07', 'B04T', 9, PS(9), ['คืนแรก|ล็อกประตู', 'สองชั้น'], {layout: 'asym_ladder'});
pnkRows('p07', ['คืนแรก']);
GLOWSCENE('p08', 'B04T', 1, PS(1), ['เช้าวันแรก', 'วิ่งรอบโครงการ'], {layout: 'full_chevrons'});
pnkRows('p08', ['ทำความรู้จักย่าน']);
GLOWSCENE('p09', null, 0, null, ['ไม่ถึง', '5 พัน'], {layout: 'budget_card'});
pnkRows('p09', ['ค่าย้ายทั้งหมด', ['รถขนของ', '2,500'], ['กล่อง + เทป', '650'], ['ทำความสะอาด', '1,200'], ['รวม', '4,350']]);
GLOWSCENE('p10', null, 0, null, ['ถ้าย้ายอีก', 'จะทำแบบนี้'], {layout: 'stack_tips'});
pnkRows('p10', ['3 อย่างที่ได้เรียน', 'ติดป้ายทุกกล่อง', 'ของใช้คืนแรก แยกกล่อง', 'ถ่ายรูปห้องก่อนเข้า']);
GLOWRECAP('p11', [['B04T', 7, PS(7)], ['B04T', 3, PS(3)], ['B04T', 0, PS(0)], ['B04T', 9, PS(9)]], ['ย้ายคอนโด', '4 ขั้น'], {layout: 'recap_grid'});
pnkRows('p11', ['หาห้อง', 'จองรถ', 'แพ็กของ', 'คืนแรก']);
GLOWSCENE('p12', 'B04T', 6, PS(6), ['อยากได้ลิสต์', 'คอมเมนต์ “ย้าย”'], {layout: 'stack_cta'});
pnkRows('p12', ['ตอนหน้า เที่ยวจากคอนโดใหม่']);
