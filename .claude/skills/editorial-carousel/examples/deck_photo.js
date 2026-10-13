/* Example — 6-slide carousel, 1080×1080, using the user's photos + frames grabbed from their talking-head clip.
   img/v_4.jpg, img/v_31.jpg = frames from `pipeline.sh <P> grab input.mp4 4,31`; img/i01.jpg = a screenshot the user sent.
   Same story as deck_mg.js. Slide names P1…P6 are referenced in references/slide-library.md. Times are slide-local seconds. */

/* ---------- P1 cover · full-bleed face + scrim + headline at the bottom ---------- */
slide({bg: 'black', dur: 3.2}, s => {
  photo(s, 'img/v_4.jpg', 0, 'left:0;top:0;width:1080px;height:1080px', {radius: 0, shadow: false, pos: '50% 22%', anim: 'none', drift: .05});   // 'none' → face is there on frame 0 (MP4 thumbnail)
  shade(s, {side: 'bottom', size: .62});
  txt(s, [[['ลูกค้าทักแล้ว', 'm', .40]], [['หายไป', 'i', .75, {size: 180}], ['?', 'kw', .95, {size: 150}]]], 'top:640px');
  keyHit(.75);
});

/* ---------- P2 cream poster · speaker photo in a rounded frame · title on top, hl below ---------- */
slide({bg: 'cream', dur: 3.2}, s => {
  curl(s, 0);
  photo(s, 'img/v_31.jpg', .05, 'left:300px;top:250px;width:480px;height:560px', {pos: '50% 28%'});
  tile(s, 'tag', .45, 'left:700px;top:200px', {size: 150, bg: NAVY, color: '#fff'});
  txt(s, [[['หลายคนคิดว่า', 'l', .15], ['แพง', 'iw', .40, {size: 120}]]], 'top:80px');
  txt(s, [[['เลยรีบ', 'l', .90], ['ลดราคา', 'hl', 1.10, {size: 92}]]], 'top:845px');
  keyHit(1.10);
});

/* ---------- P3 black · screenshot shown whole (contain) + caption ---------- */
slide({bg: 'black', dur: 3.4}, s => {
  pic(s, 'img/i01.jpg', .05, 'left:320px;top:60px;width:440px;height:640px', {anim: 'up'});
  txt(s, [[['ทั้งที่ลูกค้าแค่', 'l', .40]], [['ลังเล', 'i', .70, {size: 140}]]], 'top:715px');
  keyHit(.70);
});

/* ---------- P4 split · photo left, words right ---------- */
slide({bg: 'white', dur: 3.4}, s => {
  photo(s, 'img/v_31.jpg', .05, 'left:70px;top:150px;width:440px;height:680px', {pos: '50% 25%', anim: 'left'});
  tile(s, 'quote', .30, 'left:580px;top:150px', {size: 120, bg: ACC, color: '#0A0A0A', float: false});
  txt(s, [[['สิ่งที่ลูกค้า', 'l', .40]], [['ต้องการ', 'kw', .60, {size: 110}]], [['คือ', 'l', .90]], [['คำตอบ', 'i', 1.10, {size: 150}]]], 'top:310px;left:540px', {W: 480, gap: 6});
  keyHit(1.10);
});

/* ---------- P5 navy · checklist of worries ---------- */
slide({bg: 'navy', dur: 3.6}, s => {
  txt(s, [[['ตอบให้ตรง', 'l', .05]], [['ข้อสงสัย', 'k', .30, {size: 130}]]], 'top:110px');
  rows(s, ['ซื้อไปแล้วจะคุ้มไหม', 'คุณภาพดีจริงหรือเปล่า', 'ช่วยแก้ปัญหาเขาตรงไหน'], .80, 'top:470px', {icon: 'check', size: 52, W: 820});
  keyHit(.30);
});

/* ---------- P6 CTA · cream · round face + "ดูคลิปเต็ม" ---------- */
slide({bg: 'cream', dur: 3}, s => {
  photo(s, 'img/v_4.jpg', .05, 'left:390px;top:170px;width:300px;height:300px', {radius: 150, pos: '50% 20%', anim: 'blur', border: '8px solid #fff'});
  tile(s, 'bookmark', .35, 'left:660px;top:360px', {size: 120, bg: ACC, color: '#0A0A0A', float: false});
  txt(s, [[['เซฟไว้', 'kw', .45, {size: 120}]], [['แล้วไปดู', 'l', .75], ['คลิปเต็ม', 'hl', .95, {size: 80}]]], 'top:550px', {gap: 14});
  keyHit(.95);
});
