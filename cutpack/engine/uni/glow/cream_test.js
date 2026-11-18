/* the 12 shots of Friend's 11th sheet for the cream style (2026-11-18), with the sheet's words: bash tools/style_stills.sh <out>
   <frame.jpg> cream. A lead "a|b" is two phrases (two lines where the shot has two). The screen's lines are meta.rows (a real clip
   takes them from the picture's next subtitles; a row is [label, value]); meta.num is the giant number (a real clip: a number the
   speaker says, the count of the rows, or the picture's place). The sheet's small English lines stand where a real clip puts the
   spoken lead. Shots 01 02 04 06 07 09 10 11 12 have no picture on the sheet (cat null). Pictures: B04T rail 3 (03), wave 8 (05),
   progress 5 (08). Shot 02 is the screen between pictures (the talk layout, here as a still). */
const CS = i => GL.cats.B04T.SAMPLES[i];
const crmRows = (id, rows, num) => { SCENES[id].meta.rows = rows; if (num) SCENES[id].meta.num = num; };
GLOWSCENE('c01', null, 0, null, ['days|to save', 'เก็บเงินก้อนแรก'], {layout: 'band_num'});
crmRows('c01', ['10,000 บาท จากเงินเดือนธรรมดา'], '100');
GLOWSCENE('c02', null, 0, null, ['เงินเดือนออกปุ๊บ', 'ออมก่อน ค่อยใช้'], {layout: 'talk'});
GLOWSCENE('c03', 'B04T', 3, CS(3), ['open|account', 'เปิดบัญชีแยกไว้ออม'], {layout: 'split_rail'});
crmRows('c03', [], '01');
GLOWSCENE('c04', null, 0, null, ['pay|yourself', 'ออมทันทีที่เงินเข้า'], {layout: 'card_num'});
crmRows('c04', ['ตั้งโอนอัตโนมัติทุกวันที่ 1'], '20%');
GLOWSCENE('c05', 'B04T', 8, CS(8), ['like a plant', 'เงินออมโตเหมือนต้นไม้'], {layout: 'full_wave'});
crmRows('c05', ['รดน้ำทุกเดือน แล้วอย่าขุดขึ้นมาดู', 'ใส่เงิน · ปล่อยให้โต · รอผล']);
GLOWSCENE('c06', null, 0, null, ['days', 'จดทุกบาท'], {layout: 'band_top'});
crmRows('c06', ['ค่ากาแฟวันละ 60|เดือนนึงก็ 1,800 บาทแล้ว'], '7');
GLOWSCENE('c07', null, 0, null, ['leaks|found', 'รูรั่วที่เจอ'], {layout: 'leak_rows'});
crmRows('c07', [['กาแฟทุกวัน', '1,800'], ['สั่งอาหารดึก', '2,400'], ['แอปที่ไม่ได้ใช้', '399'], 'รวมเดือนละ 4,599 บาท'], '3');
GLOWSCENE('c08', 'B04T', 5, CS(5), ['monthly|review', 'ทบทวนทุกสิ้นเดือน'], {layout: 'split_pic'});
crmRows('c08', [], '04');
GLOWSCENE('c09', null, 0, null, ['day 65', 'ครึ่งทางแล้ว ไม่ต้องรีบ'], {layout: 'card_prog'});
crmRows('c09', ['จากเป้า 10,000 บาท'], '6,500');
GLOWSCENE('c10', null, 0, null, ['one mistake', 'อย่าถอนมาใช้ก่อนครบ'], {layout: 'band_plain'});
crmRows('c10', ['ถอนครั้งแรกแล้ว ครั้งต่อไปจะง่ายขึ้น']);
GLOWSCENE('c11', null, 0, null, ['steps|recap', 'สรุปวิธีออม'], {layout: 'recap_list'});
crmRows('c11', ['แยกบัญชี', 'ออม 20% ก่อน', 'จด 7 วัน', 'ทบทวนสิ้นเดือน'], '4');
GLOWSCENE('c12', null, 0, null, ['free sheet', 'อยากได้ตารางจดเงิน'], {layout: 'band_cta'});
crmRows('c12', ['คอมเมนต์คำว่า “ออม”']);
