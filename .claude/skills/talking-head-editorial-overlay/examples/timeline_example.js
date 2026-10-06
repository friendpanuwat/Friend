/* Example — editorial-overlay: the speaker stays on screen the whole clip; small Jitter-style widgets pop up above the head.
   Thai, 41.9 s + HOLD=1.0. Topic: "ลูกค้าทักแล้วหาย ไม่ใช่เพราะแพง". Widget zone (this clip): y 140–540, head top ≈ y 600.
   Widgets W1…W14 are referenced in references/widget-library.md. */
const N = {color: NAVY}, GRAY = '#8A93A6';

/* ---------- camera: hard punch-ins on key words (editorial) ---------- */
for (const [t, z] of [[0, 1], [1.06, 1.06], [1.86, 1], [3.42, 1.1], [3.64, 1], [4.40, 1.08], [5.12, 1], [6.12, 1.08], [6.84, 1], [7.30, 1.06],
  [8.82, 1], [10.0, 1], [10.2, 1.08], [10.82, 1], [11.8, 1.08], [13.18, 1], [13.54, 1.08], [14.32, 1], [16.0, 1.06], [17.10, 1.1], [17.66, 1],
  [18.36, 1.08], [19.74, 1], [21.6, 1.1], [22.30, 1], [22.75, 1.08], [23.54, 1], [24.50, 1.06], [25.02, 1], [26.0, 1.1], [26.38, 1],
  [28.60, 1.06], [29.76, 1], [30.4, 1.08], [31.30, 1], [33.18, 1.1], [33.86, 1], [35.12, 1.08], [35.74, 1], [36.30, 1.08], [36.82, 1],
  [37.96, 1], [38.27, 1.05], [39.45, 1.1], [40.50, 1], [41.52, 1.1]]) zoom(t, z);

/* ---------- captions: every spoken chunk, one big keyword per block ---------- */
cap({t0: 0.00, t1: 1.84, lines: [[['เวลาลูกค้า', 'l', 0.0], ['ทักมาถาม', 'l', 0.70]], [['รายละเอียด', 'k', 1.06]], [['สินค้า', 'iw', 1.36, {size: 110}]]]}); keyHit(1.06);
cap({t0: 1.86, t1: 2.46, lines: [[['แล้วก็', 'l', 1.86]], [['หายไป', 'i', 1.98]]]}); keyHit(1.98);
cap({t0: 2.48, t1: 3.62, lines: [[['หลายคน', 'l', 2.48], ['ก็อาจจะคิดว่า', 'l', 2.88]], [['เฮ้ย!', 'i', 3.42, {size: 170}]]]}); keyHit(3.42);
cap({t0: 3.64, t1: 5.10, lines: [[['มันเป็นเพราะ', 'l', 3.64]], [['ของเรา', 'kw', 4.10], ['แพง', 'k', 4.40]], [['หรือเปล่า?', 'iw', 4.60, {size: 100}]]]}); keyHit(4.40);
cap({t0: 5.12, t1: 6.82, lines: [[['แต่จริงๆแล้ว', 'l', 5.12], ['ลูกค้า', 'l', 5.35], ['ก็อาจจะ', 'l', 5.60]], [['แค่', 'l', 6.02], ['ลังเล', 'i', 6.12]]]}); keyHit(6.12);
cap({t0: 6.84, t1: 8.80, lines: [[['หรือว่า', 'l', 6.84]], [['ไม่มั่นใจ', 'k', 7.30]], [['ในตัวสินค้า', 'l', 8.12]]]}); keyHit(7.30);
cap({t0: 8.82, t1: 9.98, lines: [[['หรือไม่รู้ว่า', 'l', 8.82]], [['จะซื้อดีหรือเปล่า', 'i', 9.22, {size: 120}]]]}); keyHit(9.22);
cap({t0: 10.00, t1: 10.80, lines: [[['แต่', 'l', 10.0], ['ปัญหา', 'k', 10.2], ['ก็คือ', 'l', 10.5]]]}); keyHit(10.2);
cap({t0: 10.82, t1: 11.40, lines: [[['เจ้าของ', 'l', 10.82]], [['ธุรกิจ', 'i', 11.0]]]});
cap({t0: 11.42, t1: 13.16, lines: [[['พอเห็นลูกค้า', 'l', 11.42]], [['น้อยลง', 'hl', 11.8]], [['หรือเงียบไป', 'l', 12.10]]]}); keyHit(11.8);
cap({t0: 13.18, t1: 14.13, lines: [[['ก็รีบทำ', 'l', 13.18]], [['โปรโมชั่น', 'k', 13.54]]]}); keyHit(13.54);
cap({t0: 14.15, t1: 14.86, lines: [[['รีบ', 'l', 14.15]], [['ลดราคา', 'hl', 14.32]]]}); keyHit(14.32);
cap({t0: 14.88, t1: 16.54, lines: [[['ทั้งที่บางครั้ง', 'l', 14.88]], [['สิ่งที่ลูกค้า', 'l', 15.60], ['ต้องการ', 'k', 16.0]]]}); keyHit(16.0);
{ const b = cap({t0: 16.56, t1: 17.64, lines: [[['อาจจะ', 'l', 16.56], ['ไม่ใช่', 'l', 16.80]], [['ส่วนลด', 'hl', 17.10]]]}); strike(b.querySelectorAll('.ch')[2], 17.32, '#111'); keyHit(17.10); }
cap({t0: 17.66, t1: 19.72, lines: [[['แต่เขาอาจจะ', 'l', 17.66], ['ต้องการ', 'l', 18.08]], [['คำตอบ', 'i', 18.36]], [['ที่เขากังวลอยู่', 'l', 18.70]]]}); keyHit(18.36);
cap({t0: 19.74, t1: 21.02, lines: [[['ต่อให้ลดราคา', 'l', 19.74]], [['เยอะแค่ไหน', 'kw', 20.42, {wipe: true, step: .05}]]]});
cap({t0: 21.04, t1: 22.28, lines: [[['ถ้าลูกค้า', 'l', 21.04], ['ยังมี', 'l', 21.34]], [['คำถามในใจ', 'i', 21.6]]]}); keyHit(21.6);
cap({t0: 22.30, t1: 23.52, lines: [[['เขาก็ไม่กล้า', 'l', 22.32]], [['จ่ายเงิน', 'k', 22.75], ['อยู่ดี', 'l', 23.05]]]}); keyHit(22.75);
cap({t0: 23.54, t1: 25.00, lines: [[['บางคนอาจจะ', 'l', 23.54], ['ไม่มั่นใจ', 'l', 23.95]], [['เรื่อง', 'l', 24.34], ['คุณภาพ', 'hl', 24.50]]]}); keyHit(24.50);
cap({t0: 25.02, t1: 26.36, lines: [[['บางคนกลัวว่า', 'l', 25.02], ['ซื้อไปแล้ว', 'l', 25.62]], [['ไม่คุ้ม', 'k', 26.0]]]}); keyHit(26.0);
cap({t0: 26.38, t1: 27.56, lines: [[['หรือบางคน', 'l', 26.38]], [['ยังไม่เห็น', 'kw', 26.95, {size: 120}], ['ว่า', 'l', 27.3]]]});
cap({t0: 27.58, t1: 29.74, lines: [[['สินค้าของเรา', 'l', 27.58], ['จะช่วย', 'l', 28.32]], [['แก้ปัญหา', 'hl', 28.60]], [['ให้เขาตรงไหน?', 'iw', 29.14, {size: 100}]]]}); keyHit(28.60);
cap({t0: 29.76, t1: 31.28, lines: [[['ถ้าเรา', 'l', 29.76], ['ไม่แก้', 'l', 29.98]], [['ข้อสงสัย', 'i', 30.4]], [['พวกนี้', 'l', 30.85]]]}); keyHit(30.4);
cap({t0: 31.30, t1: 32.54, lines: [[['ต่อให้เรา', 'l', 31.30]], [['ลดราคาเพิ่ม', 'k', 31.62, {size: 132}]]]}); keyHit(31.62);
cap({t0: 32.56, t1: 33.84, lines: [[['ลูกค้าก็อาจจะ', 'l', 32.56]], [['ยังไม่ซื้อ', 'k', 33.18], ['อยู่ดี', 'l', 33.60]]]}); keyHit(33.18);
cap({t0: 33.86, t1: 34.50, lines: [[['เพราะฉะนั้น', 'm', 33.86]]]});
cap({t0: 34.52, t1: 35.72, lines: [[['ถ้าลูกค้าทักมา', 'l', 34.52]], [['แล้วหายไป', 'i', 35.12]]]}); keyHit(35.12);
cap({t0: 35.74, t1: 36.80, lines: [[['สิ่งที่ควรทำ', 'l', 35.74]], [['อย่างแรก', 'k', 36.30]]]}); keyHit(36.30);
{ const b = cap({t0: 36.82, t1: 37.94, lines: [[['ไม่ใช่', 'iw', 36.82, {size: 110}], ['การลดราคา', 'hl', 37.05, {size: 100}]]]}); strike(b.querySelectorAll('.ch')[1], 37.35, '#111'); }
cap({t0: 37.96, t1: 39.30, lines: [[['แต่คือ', 'l', 37.96]], [['การหาว่าจริงๆ', 'kw', 38.27, {size: 112}]]]});
cap({t0: 39.32, t1: 40.48, lines: [[['เขา', 'l', 39.32], ['ติดอะไร', 'i', 39.45]], [['อยู่กันแน่', 'l', 40.0]]]}); keyHit(39.45);
cap({t0: 40.50, t1: 42.90, lines: [[['แล้วก็แก้ปัญหานั้น', 'l', 40.50]], [['ให้', 'l', 41.40], ['ถูกจุด', 'k', 41.52, {size: 180}]]]}); keyHit(41.52, -20); sfx('sub', 41.50, -16);

/* ---------- W1 · chat: customer asks, reads, goes offline (0.05–2.46) ---------- */
{
  const w = widget('left:250px;top:170px;width:580px;height:330px', 0.05, 2.46);
  const av = div('left:30px;top:28px;width:86px;height:86px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:' + NAVY, w, ico('user', 50, '#fff'));
  label(w, 'ลูกค้า', 0.15, 'left:136px;top:28px', {size: 40});
  const on = label(w, '● ออนไลน์', 0.25, 'left:136px;top:78px', {size: 26, color: '#2BB673'});
  A(on, [{opacity: 1}, {opacity: 0}], 1.92, .1, {f: 'forwards'});
  label(w, '● ออฟไลน์', 1.98, 'left:136px;top:78px', {size: 26, color: GRAY});
  const b = bubble(w, 'รายละเอียดสินค้า?', 0.75, 'left:30px;top:150px', {bg: '#EEF1F6', color: NAVY, size: 40});
  label(w, 'อ่านแล้ว ✓✓', 1.45, 'left:34px;top:262px', {size: 26, color: GRAY});
  A(b.inner, [{opacity: 1}, {opacity: .35}], 1.98, .3, {f: 'forwards'});
  tile(w, 'ghost', 1.98, 'left:470px;top:-30px', {size: 96, bg: ACC, color: '#0A0A0A', float: false});
}
/* ---------- W2 · price tag + "?" (3.64–5.10) ---------- */
{
  const w = widget('left:400px;top:200px;width:280px;height:280px', 3.64, 5.10, {card: null, sound: null});
  const tg = tile(w, 'tag', 3.66, 'left:30px;top:30px', {size: 220, bg: '#fff', color: NAVY});
  punch(tg.inner, 4.40, 1.14); ripple(w, 140, 140, 4.40, 3);
  const q = tile(w, 'circle-help', 4.60, 'left:200px;top:-20px', {size: 100, bg: ACC, color: '#0A0A0A', float: false});
  wobble(q.inner, 4.75);
}
/* ---------- W3 · doubts list, rows appear with the words (6.84–9.98) ---------- */
{
  const w = widget('left:240px;top:170px;width:600px;height:340px', 6.84, 9.98);
  label(w, 'ในใจลูกค้า', 6.90, 'left:36px;top:26px', {size: 30, color: GRAY});
  const row = (icon, text, t, y) => {
    const ic = div(`left:36px;top:${y}px;width:96px;height:96px;border-radius:28px;display:flex;align-items:center;justify-content:center;background:${NAVY};opacity:0`, w, ico(icon, 54, '#fff'));
    popIn(ic, t); sfx('pop_lo', t, -27);
    label(w, text, t + .08, `left:156px;top:${y + 16}px`, {size: 46});
  };
  row('package', 'ไม่มั่นใจในสินค้า', 7.30, 90);
  row('shopping-cart', 'ซื้อดีหรือเปล่า?', 9.22, 210);
}
/* ---------- W4 · sales bars drop on "น้อยลง" (10.82–13.16) ---------- */
{
  const w = widget('left:270px;top:160px;width:540px;height:380px', 10.82, 13.16);
  const st = div('left:34px;top:30px;width:70px;height:70px;border-radius:22px;display:flex;align-items:center;justify-content:center;background:' + NAVY + ';opacity:0', w, ico('store', 40, '#fff'));
  popIn(st, 10.90);
  label(w, 'ลูกค้าที่ทักมา', 11.0, 'left:124px;top:40px', {size: 34});
  bars(w, [.55, .7, .62, .85, .95], 11.0, 'left:58px;top:130px', {w: 64, gap: 26, h: 220, to: [.62, .5, .38, .26, .16], tTo: 11.8});
  trend(w, [[8, 20], [140, 80], [280, 150], [410, 230]], 11.86, 'left:58px;top:130px', {w: 424, h: 260, color: '#FF3B30', sw: 12});
}
/* ---------- W5 · promo chip, then discount chip drops (13.18–14.86) ---------- */
{
  const w = widget('left:250px;top:230px;width:580px;height:280px', 13.18, 14.86, {card: null, sound: null});
  chipW(w, 'sparkles', 'โปรโมชั่น', 13.54, 'left:60px;top:40px', {bg: '#fff', color: NAVY, size: 52});
  chipW(w, 'badge-percent', 'ลดราคา', 14.32, 'left:250px;top:150px', {size: 56, drop: true});
}
/* ---------- W6 · "ส่วนลด" chip gets crossed out (15.60–17.64) ---------- */
{
  const w = widget('left:310px;top:250px;width:460px;height:240px', 15.60, 17.64, {card: null, sound: null});
  const c = chipW(w, 'badge-percent', 'ส่วนลด', 16.6, 'left:70px;top:60px', {bg: '#fff', color: NAVY, size: 60});
  cross(w, 17.28, 'left:150px;top:10px', {size: 170, sw: 26});
  wobble(c, 17.45, {a: 6});
}
/* ---------- W7 · question in mind (21.30–22.28) ---------- */
{
  const w = widget('left:440px;top:250px;width:200px;height:200px', 21.30, 22.28, {card: null, sound: null});
  const q = tile(w, 'circle-help', 21.32, 'left:0;top:0', {size: 200, bg: '#fff', color: NAVY, float: false});
  wobble(q.inner, 21.6, {a: 10, d: .6});
}
/* ---------- W8 · checkout: cursor hovers "ชำระเงิน", then backs off (22.30–23.52) ---------- */
{
  const w = widget('left:250px;top:170px;width:580px;height:330px', 22.30, 23.52);
  div('left:36px;top:34px;width:110px;height:110px;border-radius:32px;display:flex;align-items:center;justify-content:center;background:' + NAVY, w, ico('package', 60, '#fff'));
  skel(w, 'left:176px;top:52px;width:360px', [.9, .55], {t: 22.4});
  const btn = div('left:36px;top:190px;width:508px;height:106px;border-radius:32px;display:flex;align-items:center;justify-content:center;gap:16px;background:' + ACC + ';font-family:KeySans;font-size:50px;color:#0A0A0A', w, ico('credit-card', 54, '#0A0A0A') + 'ชำระเงิน');
  punch(btn, 22.78, 1.05);
  cursor(w, [[22.36, 600, 420], [22.74, 300, 230], [22.95, 316, 240], [23.38, 610, 400]], [], {size: 80});
}
/* ---------- W9 · product + 2/5 stars + "?" (23.54–25.00) ---------- */
{
  const w = widget('left:250px;top:180px;width:580px;height:300px', 23.54, 25.00);
  tile(w, 'package', 23.62, 'left:34px;top:34px', {size: 150, bg: NAVY, color: '#fff', sound: null, float: false});
  tile(w, 'circle-help', 23.98, 'left:140px;top:10px', {size: 76, bg: ACC, color: '#0A0A0A', float: false});
  stars(w, 5, 2, 24.30, 'left:212px;top:70px', {size: 58});
  skel(w, 'left:212px;top:170px;width:330px', [1, .6], {t: 24.4});
}
/* ---------- W10 · A ⋯?⋯ B: product ↔ problem not connected (26.95–29.74) ---------- */
{
  const w = widget('left:160px;top:210px;width:760px;height:280px', 26.95, 29.74, {card: null, sound: null});
  tile(w, 'package', 27.58, 'left:0;top:50px', {size: 180, bg: '#fff', color: NAVY});
  const ln = svg(380, 20, `<path d="M0 10 H380" stroke="#fff" stroke-width="8" stroke-linecap="round" stroke-dasharray="2 22"/>`, 'left:190px;top:130px', w);
  A(ln, [{opacity: 0}, {opacity: 1}], 27.9, .3);
  tile(w, 'circle-alert', 28.60, 'left:580px;top:50px', {size: 180, bg: '#fff', color: NAVY});
  const q = tile(w, 'circle-help', 29.14, 'left:325px;top:85px', {size: 110, bg: ACC, color: '#0A0A0A', float: false});
  wobble(q.inner, 29.3);
}
/* ---------- W11 · discount chip drops on the cart, cart still says no (31.30–33.84) ---------- */
{
  const w = widget('left:330px;top:180px;width:420px;height:340px', 31.30, 33.84, {card: null, sound: null});
  const cart = tile(w, 'shopping-cart', 31.32, 'left:100px;top:100px', {size: 220, bg: '#fff', color: NAVY});
  chipW(w, 'badge-percent', 'ลดเพิ่ม', 31.62, 'left:70px;top:20px', {size: 48, drop: true});
  wobble(cart.inner, 33.18);
  tile(w, 'x', 33.22, 'left:300px;top:140px', {size: 96, bg: '#FF3B30', color: '#fff', sound: 'stamp', db: -22, float: false});
}
/* ---------- W12 · step 1: discount crossed out (35.74–37.94) ---------- */
{
  const w = widget('left:290px;top:190px;width:500px;height:320px', 35.74, 37.94, {card: null, sound: null});
  num(w, 1, 35.80, 'left:202px;top:0');
  const c = chipW(w, 'badge-percent', 'การลดราคา', 36.85, 'left:60px;top:150px', {bg: '#fff', color: NAVY, size: 56});
  cross(w, 37.25, 'left:170px;top:110px', {size: 160, sw: 26});
  wobble(c, 37.42, {a: 6});
}
/* ---------- W13 · search: find what's blocking them (38.27–40.48) ---------- */
{
  const w = widget('left:440px;top:240px;width:200px;height:200px', 38.27, 40.48, {card: null, sound: null});
  const s = tile(w, 'search', 38.30, 'left:0;top:0', {size: 200, bg: ACC, color: '#0A0A0A'});
  punch(s.inner, 39.45, 1.12);
}
/* ---------- W14 · bullseye locks on "ถูกจุด" (40.50–end) ---------- */
{
  const w = widget('left:370px;top:215px;width:340px;height:340px', 40.50, 42.90, {card: null, sound: null});
  target(w, 40.55, 41.52, 'left:0;top:0', {size: 340});
}
