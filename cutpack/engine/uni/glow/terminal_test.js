/* the shots of Friend's 9th sheet for the terminal style (2026-11-18) that hold a picture: NODE_PATH=$(npm root -g) node
   glow/stills.js <work> <out> <frame.jpg> glow/terminal_test.js 3.8 "terminal:m02@0 … terminal:m09@4" (tools/style_stills.sh)
   Shots 01 03 06 08 10 12 (no picture) were deleted 2026-11-27 (Friend: "ลบเลยผมไม่กลับไปใช้แล้ว ผมจะใช้ motion graphic ของผมเท่านั้น"),
   then 11 (the recap still with a terminal of subtitles: "ลบ"). Pictures: B04T chevrons 1 (02), rail 3 (04), checklist 7 (05),
   progress 5 (07), ladder 9 (09). */
const MS = i => GL.cats.B04T.SAMPLES[i];
GLOWSCENE('m02', 'B04T', 1, MS(1), ['เช้าแบบ', 'ไม่ต้องพึ่งแรงใจ'], {layout: 'hero_chev'});
GLOWSCENE('m04', 'B04T', 3, MS(3), ['ตั้งแอปจับเวลา', 'ไว้ครั้งเดียว'], {layout: 'win_speaker'});
GLOWSCENE('m05', 'B04T', 7, MS(7), ['งานชิ้นแรก', 'ทำทีละหน้าต่าง'], {layout: 'stack3'});
GLOWSCENE('m07', 'B04T', 5, MS(5), ['บ่ายสองโมง', 'ทบทวนก่อนลุยต่อ'], {layout: 'split_top'});
GLOWSCENE('m09', 'B04T', 9, MS(9), ['6 โมงเย็น', 'ปิดวันให้จบ'], {layout: 'big_win'});
