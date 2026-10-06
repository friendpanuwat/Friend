/* Example — same clip, B-roll = still images sent by the user (img/i01.png … img/i11.jpg; B&W 3D figures on pure black).
   Black-background images sit full-width on black cards; others are framed as cream posters. HOLD=1.0. */
const N = {color: NAVY}, NS = s => ({color: NAVY, size: s});

cards([[1.86, 2.46], [3.64, 5.10], [6.84, 9.98], [10.82, 13.16], [14.88, 17.64], [19.74, 21.02], [22.30, 23.52],
       [23.54, 25.00], [27.58, 29.74], [31.30, 33.84], [35.74, 37.94], [40.50, 42.90]]);

/* ---------- camera: hard punch-ins on key words ---------- */
for (const [t, z] of [[0, 1], [1.06, 1.08], [2.48, 1], [3.42, 1.12], [5.12, 1], [6.12, 1.1], [10.0, 1], [10.2, 1.1], [13.18, 1], [13.54, 1.1],
  [14.32, 1], [17.66, 1], [18.36, 1.1], [21.04, 1], [21.6, 1.12], [25.02, 1], [26.0, 1.12], [26.95, 1], [30.4, 1.1], [33.86, 1], [35.12, 1.1],
  [37.96, 1], [38.27, 1.06], [39.45, 1.13]]) zoom(t, z);

/* ---------- A-roll captions (over the chest) ---------- */
cap({t0: 0.00, t1: 1.84, lines: [[['เวลาลูกค้า', 'l', 0.0], ['ทักมาถาม', 'l', 0.70]], [['รายละเอียด', 'k', 1.06]], [['สินค้า', 'iw', 1.36, {size: 110}]]]});
keyHit(1.06);
cap({t0: 2.48, t1: 3.62, lines: [[['หลายคน', 'l', 2.48], ['ก็อาจจะคิดว่า', 'l', 2.88]], [['เฮ้ย!', 'i', 3.42, {size: 170}]]]});
keyHit(3.42);
cap({t0: 5.12, t1: 6.82, lines: [[['แต่จริงๆแล้ว', 'l', 5.12], ['ลูกค้า', 'l', 5.35], ['ก็อาจจะ', 'l', 5.60]], [['แค่', 'l', 6.02], ['ลังเล', 'i', 6.12]]]});
keyHit(6.12);
cap({t0: 10.00, t1: 10.80, lines: [[['แต่', 'l', 10.0], ['ปัญหา', 'k', 10.2], ['ก็คือ', 'l', 10.5]]]});
keyHit(10.2);
cap({t0: 13.18, t1: 14.13, lines: [[['ก็รีบทำ', 'l', 13.18]], [['โปรโมชั่น', 'k', 13.54]]]});
keyHit(13.54);
cap({t0: 14.15, t1: 14.86, lines: [[['รีบ', 'l', 14.15]], [['ลดราคา', 'hl', 14.32]]]});
keyHit(14.32);
cap({t0: 17.66, t1: 19.72, lines: [[['แต่เขาอาจจะ', 'l', 17.66], ['ต้องการ', 'l', 18.08]], [['คำตอบ', 'i', 18.36]], [['ที่เขากังวลอยู่', 'l', 18.70]]]});
keyHit(18.36);
cap({t0: 21.04, t1: 22.28, lines: [[['ถ้าลูกค้า', 'l', 21.04], ['ยังมี', 'l', 21.34]], [['คำถามในใจ', 'i', 21.6]]]});
keyHit(21.6);
cap({t0: 25.02, t1: 26.36, lines: [[['บางคนกลัวว่า', 'l', 25.02], ['ซื้อไปแล้ว', 'l', 25.62]], [['ไม่คุ้ม', 'k', 26.0]]]});
keyHit(26.0);
cap({t0: 26.38, t1: 27.56, lines: [[['หรือบางคน', 'l', 26.38]], [['ยังไม่เห็น', 'kw', 26.95, {size: 120}], ['ว่า', 'l', 27.3]]]});
cap({t0: 29.76, t1: 31.28, lines: [[['ถ้าเรา', 'l', 29.76], ['ไม่แก้', 'l', 29.98]], [['ข้อสงสัย', 'i', 30.4]], [['พวกนี้', 'l', 30.85]]]});
keyHit(30.4);
cap({t0: 33.86, t1: 34.50, lines: [[['เพราะฉะนั้น', 'm', 33.86]]]});
cap({t0: 34.52, t1: 35.72, lines: [[['ถ้าลูกค้าทักมา', 'l', 34.52]], [['แล้วหายไป', 'i', 35.12]]]});
keyHit(35.12);
cap({t0: 37.96, t1: 39.30, lines: [[['แต่คือ', 'l', 37.96]], [['การหาว่าจริงๆ', 'kw', 38.27, {size: 112}]]]});
cap({t0: 39.32, t1: 40.48, lines: [[['เขา', 'l', 39.32], ['ติดอะไร', 'i', 39.45]], [['อยู่กันแน่', 'l', 40.0]]]});
keyHit(39.45);

/* ---------- C1 white · "แล้วก็ หายไป" — the word vanishes like the customer ---------- */
{
  const c = card(1.86, 2.46, {bg: 'white', sound: 'swipe'});
  const t = txt(c, [[['แล้วก็', 'l', 1.86, N]], [['หายไป', 'iw', 1.98, NS(170)]]], 'top:740px');
  const gone = t.querySelectorAll('.ch')[1];
  A(gone, [{opacity: 1, filter: 'blur(0)', transform: 'none'}, {opacity: .12, filter: 'blur(14px)', transform: 'translateY(-30px) scale(1.04)'}], 2.24, .22, {f: 'forwards', e: 'ease-in'});
}
/* ---------- C2 black + wallet/box/chart · "ของเราแพง หรือเปล่า?" ---------- */
{
  const c = card(3.64, 5.10);
  pic(c, 'img/i05.jpg', 3.64, 'left:0;top:60px;width:1080px;height:1440px');
  const t = txt(c, [[['มันเป็นเพราะ', 'l', 3.64]], [['ของเรา', 'kw', 4.10], ['แพง', 'k', 4.40]], [['หรือเปล่า?', 'iw', 4.60, {size: 96}]]], 'top:1210px');
  t.classList.add('aroll');
  keyHit(4.40);
}
/* ---------- C3 black + phone & doubts · pill list ---------- */
{
  const c = card(6.84, 9.98);
  pic(c, 'img/i03.jpg', 6.84, 'left:0;top:40px;width:1080px;height:1440px', {drift: .07});
  const t = txt(c, [[['หรือว่า', 'l', 6.84]]], 'top:1220px'); t.classList.add('aroll');
  pill(c, 'ไม่มั่นใจในตัวสินค้า', 7.30, 'left:0;right:0;margin:auto;width:fit-content;top:1310px');
  pill(c, 'ไม่รู้จะซื้อดีหรือเปล่า', 9.22, 'left:0;right:0;margin:auto;width:fit-content;top:1440px');
}
/* ---------- C4 cream poster · เจ้าของธุรกิจ ---------- */
{
  const c = card(10.82, 13.16, {bg: 'cream'});
  curl(c, 10.82);
  pic(c, 'img/i06.jpg', 10.82, 'left:170px;top:430px;width:740px;height:986px;border-radius:30px;overflow:hidden;box-shadow:0 30px 70px rgba(0,0,0,.35)', {anim: 'up', drift: .05});
  txt(c, [[['เจ้าของธุรกิจ', 'iw', 10.86, NS(124)]]], 'top:200px');
  txt(c, [[['พอเห็นลูกค้า', 'l', 11.42, N], ['น้อยลง', 'hl', 11.8, {size: 96}]], [['หรือเงียบไป', 'iw', 12.10, NS(92)]]], 'top:1440px');
  keyHit(11.8);
}
/* ---------- C5 white · words build: "สิ่งที่ลูกค้าต้องการ อาจจะไม่ใช่ ส่วนลด" ---------- */
{
  const c = card(14.88, 17.64, {bg: 'white', sound: 'swipe'});
  const t = txt(c, [[['ทั้งที่บางครั้ง', 'l', 14.88, N]], [['สิ่งที่ลูกค้าต้องการ', 'kw', 15.60, NS(104)]], [['อาจจะ', 'l', 16.56, N], ['ไม่ใช่', 'iw', 16.80, NS(110)], ['ส่วนลด', 'hl', 17.10, {size: 110}]]], 'top:700px');
  strike(t.querySelectorAll('.ch')[4], 17.32, '#111');
  keyHit(17.10);
}
/* ---------- C6 navy · "ต่อให้ลดราคา เยอะแค่ไหน" — colour wipe ---------- */
{
  const c = card(19.74, 21.02, {bg: 'navy'});
  txt(c, [[['ต่อให้ลดราคา', 'l', 19.74, {size: 66}]], [['เยอะแค่ไหน', 'kw', 20.42, {wipe: true, step: .05}]]], 'top:780px');
}
/* ---------- C7 black + cart vs price · "ไม่กล้าจ่ายเงิน" ---------- */
{
  const c = card(22.30, 23.52);
  pic(c, 'img/i11.jpg', 22.30, 'left:0;top:-40px;width:1080px;height:1440px');
  const t = txt(c, [[['เขาก็ไม่กล้า', 'l', 22.32]], [['จ่ายเงิน', 'k', 22.75], ['อยู่ดี', 'l', 23.05]]], 'top:1260px'); t.classList.add('aroll');
  keyHit(22.75);
}
/* ---------- C8 cream poster + box & thumbs down · "ไม่มั่นใจ คุณภาพ" ---------- */
{
  const c = card(23.54, 25.00, {bg: 'cream', sound: 'swipe'});
  curl(c, 23.54);
  pic(c, 'img/i04.jpg', 23.54, 'left:170px;top:430px;width:740px;height:986px;border-radius:30px;overflow:hidden;box-shadow:0 30px 70px rgba(0,0,0,.35)', {anim: 'right', drift: .05});
  txt(c, [[['บางคนอาจจะ', 'l', 23.54, N]], [['ไม่มั่นใจ', 'iw', 23.95, NS(110)]]], 'top:150px');
  txt(c, [[['เรื่อง', 'l', 24.34, N], ['คุณภาพ', 'hl', 24.50, {size: 100}]]], 'top:1450px');
  keyHit(24.50);
}
/* ---------- F1 shrink-to-card on cream · "สินค้าของเรา จะช่วยแก้ปัญหา ให้เขาตรงไหน?" ---------- */
{
  const c = frame(27.58, 29.74, {bg: 'cream', s: .54, y: 1095});
  txt(c, [[['สินค้าของเรา', 'l', 27.58, NS(60)]], [['จะช่วย', 'l', 28.32, NS(70)], ['แก้ปัญหา', 'hl', 28.60, {size: 104}]], [['ให้เขาตรงไหน?', 'iw', 29.14, NS(100)]]], 'top:170px');
  keyHit(28.60);
}
/* ---------- C9 black + woman unsure · "ยังไม่ซื้ออยู่ดี" ---------- */
{
  const c = card(31.30, 33.84);
  pic(c, 'img/i10.jpg', 31.30, 'left:0;top:-20px;width:1080px;height:1440px', {drift: .07});
  const t = txt(c, [[['ต่อให้เราลดราคาเพิ่ม', 'l', 31.30]], [['ลูกค้าก็อาจจะ', 'l', 32.56]], [['ยังไม่ซื้อ', 'k', 33.18], ['อยู่ดี', 'l', 33.60]]], 'top:1290px'); t.classList.add('aroll');
  keyHit(33.18);
}
/* ---------- C10 black + pointing up · "สิ่งที่ควรทำอย่างแรก ไม่ใช่การลดราคา" ---------- */
{
  const c = card(35.74, 37.94);
  pic(c, 'img/i08.jpg', 35.74, 'left:0;top:300px;width:1080px;height:1440px', {anim: 'up'});
  num(c, 1, 35.80, 'left:492px;top:130px');
  const a = txt(c, [[['สิ่งที่ควรทำ', 'l', 35.74, {size: 64}]], [['อย่างแรก', 'k', 36.30]]], 'top:250px'); a.classList.add('aroll');
  const b = txt(c, [[['ไม่ใช่', 'iw', 36.82, {size: 96}], ['การลดราคา', 'hl', 37.05, {size: 90}]]], 'top:1400px'); b.classList.add('aroll');
  strike(b.querySelectorAll('.ch')[1], 37.35, '#111');
  keyHit(36.30);
}
/* ---------- C11 final · bulb + orbit · "แก้ปัญหานั้น ให้ถูกจุด" (holds 1 s after speech) ---------- */
{
  const c = card(40.50, 42.90, {sound: 'whoosh_long'});
  pic(c, 'img/i01.png', 40.50, 'left:40px;top:120px;width:1000px;height:1333px', {drift: .06});
  const t = txt(c, [[['แล้วก็แก้ปัญหานั้น', 'l', 40.50, {size: 64}]], [['ให้', 'l', 41.40, {size: 64}], ['ถูกจุด', 'k', 41.52, {size: 190}]]], 'top:1300px'); t.classList.add('aroll');
  keyHit(41.52, -20);
  sfx('sub', 41.50, -16);
}
