/* Example — 8-slide showcase of the component kit (cover + coin, 01/02/03 steps, phone, check list, switches, chart, orbit, CTA).
   Generic content about making save-worthy posts. Works in every theme. Slide names S1…S8 are referenced in references/layouts.md. */
/* S1 · cover */
slide({tone: 'dark'}, s => {
  tag(s, 'คู่มือคอนเทนต์', .05, 'left:80px;top:150px', {style: 'soft', dot: true});
  title(s, 'ทำโพสต์ให้คน\n[เซฟ] เก็บไว้\nใน 3 ขั้นตอน', .15, 'left:80px;top:250px', {size: 104});
  coin(s, .5, 'left:640px;top:520px', {size: 300, iconName: 'bookmark'});
  icon(s, 'heart', .7, 'left:560px;top:820px', {size: 110});
  body(s, 'ใช้ได้กับ IG, Facebook, TikTok และ LinkedIn', .6, 'left:80px;top:690px', {W: 500});
});
/* S2 · light */
slide({tone: 'light'}, s => {
  num(s, '01', .05, 'left:72px;top:110px', {size: 220});
  title(s, 'เปิดด้วย\n{ปัญหา} ที่เขาเจอ', .2, 'left:80px;top:360px', {size: 88});
  body(s, 'คนหยุดปัดเมื่อเห็นเรื่องของตัวเอง\nไม่ใช่เรื่องของแบรนด์', .45, 'left:80px;top:590px', {W: 520});
  notify(s, 'ยอดขายเดือนนี้ลดลง', 'ทำไงดี?', .6, 'left:520px;top:740px', {icon: 'trending-down'});
  notify(s, 'ลูกค้าทักแล้วหาย', 'อ่านแล้วไม่ตอบ', .8, 'left:160px;top:820px', {icon: 'message-circle'});
});
/* S3 · dark phone */
slide({tone: 'dark'}, s => {
  num(s, '02', .05, 'left:72px;top:110px', {size: 220});
  title(s, 'หนึ่งสไลด์\n((หนึ่งไอเดีย))', .2, 'left:80px;top:360px', {size: 92});
  body(s, 'ตัดทุกอย่างที่ไม่ช่วยเล่าเรื่องนั้นออก', .5, 'left:80px;top:610px', {W: 460});
  const sc = phone(s, 'left:600px;top:160px', .1, {w: 380, h: 760});
  const b = box(sc, 'left:24px;top:90px;width:284px;height:240px', .4, {style: 'accent', radius: 24});
  title(b, 'ไอเดีย\nเดียว', .6, 'left:24px;top:30px', {size: 64, W: 240, color: 'var(--acc-ink)'});
  skel(sc, 'left:28px;top:370px;width:280px', [.9, .7, .8, .5], {t: .6, h: 20});
});
/* S4 · accent list */
slide({tone: 'accent'}, s => {
  title(s, 'เช็กก่อนโพสต์', .05, 'left:80px;top:260px', {size: 92});
  list(s, ['ปกอ่านจบใน 2 วินาที', 'คำสำคัญเด่นที่สุดในสไลด์', 'สไลด์สุดท้ายบอกให้ทำอะไรต่อ'], .3, 'left:80px;top:470px', {mark: 'check', size: 42, gap: 40});
  ornament(s, 'sparkles', .5, 'right:110px;top:250px', {size: 100});
});
/* S5 · dark toggles */
slide({tone: 'dark'}, s => {
  num(s, '03', .05, 'left:72px;top:110px', {size: 220});
  title(s, 'จบด้วย\n[สิ่งที่ทำต่อได้]', .2, 'left:80px;top:360px', {size: 92});
  const b = box(s, 'left:80px;top:620px;width:920px;height:240px', .4);
  [['เซฟไว้อ่านทีหลัง', true], ['ส่งให้เพื่อน', true], ['กดติดตาม', false]].forEach(([t1, on], k) => {
    div(`left:${40 + k * 300}px;top:40px;font-family:Body;font-weight:500;font-size:28px;color:var(--fg)`, b, t1);
    toggle(b, on, .7 + k * .2, `left:${40 + k * 300}px;top:120px`);
  });
});
/* S6 · light chart */
slide({tone: 'light'}, s => {
  tag(s, 'วัดผล', .05, 'left:80px;top:150px');
  title(s, 'ดูที่ [ยอดเซฟ]\n~ยอดไลก์~', .15, 'left:80px;top:240px', {size: 92});
  const b = box(s, 'left:80px;top:520px;width:920px;height:400px', .3);
  bars(b, [.35, .5, .42, .7, .95], .5, 'left:60px;top:50px', {h: 300, w: 90, gap: 40});
  chip(b, 'เซฟ', 1.1, 'left:640px;top:40px', {style: 'accent', icon: 'bookmark'});
  line(b, [[0, 260], [180, 220], [360, 160], [540, 120], [720, 40]], .8, 'left:60px;top:40px', {w: 760, h: 300, area: false, sw: 5});
});
/* S7 · orbit */
slide({tone: 'dark'}, s => {
  title(s, 'ใช้ได้ทุกแพลตฟอร์ม', .05, 'left:80px;top:150px', {size: 76, W: 920, align: 'center'});
  orbit(s, 540, 650, [['camera', 'Instagram'], ['play', 'TikTok'], ['users', 'Facebook'], ['briefcase', 'LinkedIn'], ['send', 'Threads']], .2, {r: [190, 320], center: 'layers', size: 150});
});
/* S8 · CTA */
slide({tone: 'accent'}, s => {
  title(s, 'เซฟโพสต์นี้ไว้\nก่อนทำชิ้นต่อไป', .05, 'left:80px;top:300px', {size: 96});
  cta(s, 'ติดตามเพิ่ม', .5, 'left:80px;top:600px', {style: 'outline'});
  path(s, [[0, 200], [200, 40], [420, 160]], .4, 'left:560px;top:620px', {w: 440, h: 260});
});
