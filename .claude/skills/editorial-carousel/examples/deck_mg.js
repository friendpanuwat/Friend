/* Example — 8-slide carousel, 1080×1080, no photos → motion-graphics slides (Jitter × Swishy).
   Source: the transcript of talking-head-editorial's example clip ("ลูกค้าทักแล้วหาย ไม่ใช่เพราะแพง") condensed into slides.
   Slide names S1…S8 are referenced in references/slide-library.md. Times are slide-local seconds. */

/* ---------- S1 cover · dark · hook + ghost ---------- */
slide({bg: 'black', dur: 3.2}, s => {
  mood(s, {seed: 0, o: .24});
  tile(s, 'message-circle', .10, 'left:200px;top:150px', {size: 150, bg: 'glass'});
  tile(s, 'ghost', .30, 'left:440px;top:130px', {size: 200, bg: '#fff', color: NAVY});
  tile(s, 'eye-off', .50, 'left:730px;top:190px', {size: 140, bg: 'glass'});
  txt(s, [[['ลูกค้าทักแล้ว', 'm', .45]], [['หายไป', 'i', .80, {size: 190}]], [['ไม่ใช่เพราะ', 'l', 1.25], ['แพง', 'hl', 1.45, {size: 96}]]], 'top:420px');
  keyHit(.80);
});

/* ---------- S2 white · "หลายคนคิดว่า ของเราแพง?" ---------- */
slide({bg: 'white', dur: 3}, s => {
  tile(s, 'tag', .15, 'left:390px;top:110px', {size: 300, bg: NAVY, color: '#fff'});
  tile(s, 'banknote', .35, 'left:170px;top:300px', {size: 150, bg: ACC, color: '#0A0A0A'});
  txt(s, [[['หลายคนคิดว่า', 'l', .30]], [['ของเรา', 'kw', .55], ['แพง?', 'i', .85, {size: 170}]]], 'top:500px');
  keyHit(.85);
});

/* ---------- S3 dark · phone chat + pills · "จริง ๆ ลูกค้าแค่ลังเล" ---------- */
slide({bg: 'black', dur: 3.6}, s => {
  mood(s, {seed: 1});
  const ph = panel(s, 'left:90px;top:120px;width:400px;height:560px', .05, {style: 'glass', radius: 60});
  div('left:140px;top:20px;width:120px;height:28px;border-radius:20px;background:rgba(0,0,0,.55)', ph);
  bubble(ph, 'รายละเอียดสินค้า?', .30, 'left:26px;top:110px', {size: 34});
  skel(ph, 'left:34px;top:230px;width:300px', [.9, .6, .75], {color: 'rgba(255,255,255,.14)', h: 22, t: .45});
  tile(s, 'circle-help', .60, 'left:400px;top:520px', {size: 150, bg: ACC, color: '#0A0A0A'});
  txt(s, [[['แต่จริง ๆ', 'l', .40]], [['ลูกค้าแค่', 'l', .60]], [['ลังเล', 'i', .90, {size: 170}]]], 'top:170px;left:520px', {W: 500});
  pill(s, 'ไม่มั่นใจในตัวสินค้า', 1.30, 'left:0;right:0;margin:auto;width:fit-content;top:700px');
  pill(s, 'ไม่รู้จะซื้อดีหรือเปล่า', 1.55, 'left:0;right:0;margin:auto;width:fit-content;top:820px');
  keyHit(.90);
});

/* ---------- S4 cream poster · sales bars dropping · "เลยรีบลดราคา" ---------- */
slide({bg: 'cream', dur: 3.4}, s => {
  curl(s, 0);
  const p = panel(s, 'left:200px;top:270px;width:680px;height:540px', .05);
  const st = div('left:44px;top:40px;width:100px;height:100px;border-radius:30px;display:flex;align-items:center;justify-content:center;background:' + NAVY, p, ico('store', 56, '#fff'));
  popIn(st, .15);
  skel(p, 'left:170px;top:52px;width:440px', [.75, .45], {t: .2});
  bars(p, [.55, .7, .62, .85, .95], .25, 'left:90px;top:180px', {h: 330, to: [.62, .5, .38, .26, .16], tTo: 1.0});
  trend(p, [[10, 30], [180, 110], [340, 210], [500, 300]], 1.05, 'left:90px;top:190px', {w: 520, h: 330, color: '#FF3B30', sw: 14});
  txt(s, [[['พอลูกค้า', 'l', .20], ['เงียบ', 'iw', .40, {size: 110}]]], 'top:120px');
  txt(s, [[['ก็รีบ', 'l', 1.30], ['ลดราคา', 'hl', 1.50, {size: 90}]]], 'top:845px');
  keyHit(1.50);
});

/* ---------- S5 white · words build + strike · "อาจจะไม่ใช่ส่วนลด" ---------- */
slide({bg: 'white', dur: 3.2}, s => {
  const t = txt(s, [[['ทั้งที่บางครั้ง', 'l', .10]], [['สิ่งที่ลูกค้าต้องการ', 'kw', .45, {size: 104}]], [['อาจจะ', 'l', 1.00], ['ไม่ใช่', 'iw', 1.15, {size: 110}], ['ส่วนลด', 'hl', 1.40, {size: 110}]]], 'top:300px', {gap: 22});
  strike(t.querySelectorAll('.ch')[4], 1.70, '#111');
  keyHit(1.40);
});

/* ---------- S6 navy · list of real worries ---------- */
slide({bg: 'navy', dur: 3.6}, s => {
  txt(s, [[['แต่คือ', 'l', .05]], [['คำตอบ', 'k', .30, {size: 130}], ['ที่เขากังวล', 'l', .55]]], 'top:110px');
  rows(s, ['ซื้อไปแล้วจะคุ้มไหม', 'คุณภาพดีจริงหรือเปล่า', 'ช่วยแก้ปัญหาเขาตรงไหน'], .90, 'top:470px', {size: 52, W: 820});
  keyHit(.30);
});

/* ---------- S7 dark · bullseye · "แก้ให้ถูกจุด" ---------- */
slide({bg: 'black', dur: 3.4}, s => {
  mood(s, {seed: 5, o: .26});
  tile(s, 'lightbulb', .20, 'left:110px;top:170px', {size: 140, bg: 'glass'});
  tile(s, 'search', .35, 'left:840px;top:230px', {size: 120, bg: 'glass'});
  target(s, .05, 1.0, 'left:330px;top:90px', {size: 420});
  txt(s, [[['หาว่าเขาติดอะไร', 'l', .10, {size: 60}]], [['แล้วแก้ให้', 'l', .70, {size: 60}], ['ถูกจุด', 'k', 1.00, {size: 170}]]], 'top:600px');
  keyHit(1.00, -20); sfx('sub', 1.0, -16);
});

/* ---------- S8 CTA · accent · save / share ---------- */
slide({bg: 'accent', dur: 3}, s => {
  tile(s, 'bookmark', .10, 'left:300px;top:150px', {size: 180, bg: NAVY, color: '#fff'});
  tile(s, 'send', .25, 'left:600px;top:150px', {size: 180, bg: '#fff', color: NAVY});
  txt(s, [[['เซฟไว้', 'kw', .40, {size: 130}]], [['ก่อนตอบแชตลูกค้าครั้งหน้า', 'l', .70]], [['ส่งให้เพื่อนที่ขายของออนไลน์', 'l', .95, {size: 46}]]], 'top:430px');
});
