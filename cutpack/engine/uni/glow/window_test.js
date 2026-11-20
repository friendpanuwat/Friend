/* the 12 shots of Friend's 3rd sheet for the window style (2026-11-18), with the sheet's words: NODE_PATH=$(npm root -g) node glow/stills.js
   <work> <out> <frame.jpg> glow/window_test.js 3.8 "window:w01@0 … window:w12@11" */
const WS = i => GL.cats.B04T.SAMPLES[i];
GLOWSCENE('w01', 'B04T', 5, WS(5), ['ปีที่แล้ว', 'อ่านจบ 0 เล่ม'], {layout: 'full'});
GLOWSCENE('w02', 'B04T', 3, WS(3), ['ผมเลยตั้งกติกา', 'วันละ 10 หน้า'], {layout: 'full_n'});
GLOWSCENE('w03', 'B04T', 1, WS(1), ['อ่านตอนไหน', 'ก่อนนอน'], {layout: 'dark'});
GLOWSCENE('w04', 'B04T', 7, WS(7), ['มือถือ', 'ไว้นอกห้อง'], {layout: 'float'});
GLOWSCENE('w05', 'B04T', 9, WS(9), ['อ่านไม่รู้เรื่อง?', 'อ่านซ้ำ'], {layout: 'full_w'});
GLOWSCENE('w06', 'B04T', 7, WS(7), ['ไม่สนุก', 'เปลี่ยนเล่ม'], {layout: 'stack'});
GLOWSCENE('w07', 'B04T', 2, WS(2), ['จดไว้', 'ประโยคเดียว'], {layout: 'full_d'});
GLOWSCENE('w08', 'B04T', 5, WS(5), ['เดือนแรก', 'จบ 1 เล่ม'], {layout: 'stats'});
GLOWSCENE('w09', 'B04T', 4, WS(4), ['ทำซ้ำเป็น', 'วงจร'], {layout: 'full_c'});
GLOWSCENE('w10', 'B04T', 8, WS(8), ['สามเดือนต่อมา', 'จบ 3 เล่ม'], {layout: 'dark_b'});
GLOWSCENE('w12', 'B04T', 0, WS(0), ['เดือนนี้', 'อ่านเล่มไหน?'], {layout: 'cta'});
