/* Example — no B-roll from the user → motion graphics cards (Flat × Glow). Thai, 41.9 s talking head + HOLD=1.0.
   Topic: "ลูกค้าทักแล้วหาย ไม่ใช่เพราะแพง". Card names C1…C11 / F1 are referenced in references/card-library.md. */
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

/* ---------- C1 white · "แล้วก็ หายไป" + ghost tile ---------- */
{
  const c = card(1.86, 2.46, {bg: 'white', sound: 'swipe'});
  tile(c, 'ghost', 1.92, 'left:440px;top:470px', {size: 200, bg: NAVY, color: '#fff', sound: null});
  const t = txt(c, [[['แล้วก็', 'l', 1.86, N]], [['หายไป', 'iw', 1.98, NS(170)]]], 'top:740px');
  const gone = t.querySelectorAll('.ch')[1];
  A(gone, [{opacity: 1, filter: 'blur(0)', transform: 'none'}, {opacity: .12, filter: 'blur(14px)', transform: 'translateY(-30px) scale(1.04)'}], 2.24, .22, {f: 'forwards', e: 'ease-in'});
}
/* ---------- C2 dark · price tag + money tiles · "ของเราแพง หรือเปล่า?" ---------- */
{
  const c = card(3.64, 5.10);
  mood(c, {seed: 0});
  const tag = tile(c, 'tag', 3.70, 'left:390px;top:330px', {size: 300, bg: '#fff', color: NAVY});
  tile(c, 'banknote', 3.86, 'left:140px;top:650px', {size: 170, bg: 'glass'});
  tile(c, 'wallet', 3.98, 'left:770px;top:560px', {size: 170, bg: 'glass'});
  punch(tag.inner, 4.40, 1.16); ripple(c, 540, 480, 4.40, 3.4);
  const t = txt(c, [[['มันเป็นเพราะ', 'l', 3.64]], [['ของเรา', 'kw', 4.10], ['แพง', 'k', 4.40]], [['หรือเปล่า?', 'iw', 4.60, {size: 96}]]], 'top:1210px');
  t.classList.add('aroll');
  keyHit(4.40);
}
/* ---------- C3 dark · phone chat + doubt icons · pill list ---------- */
{
  const c = card(6.84, 9.98);
  mood(c, {seed: 1});
  const ph = panel(c, 'left:290px;top:170px;width:500px;height:860px', 6.84, {style: 'glass', radius: 70});
  div('left:190px;top:22px;width:120px;height:30px;border-radius:20px;background:rgba(0,0,0,.55)', ph);
  skel(ph, 'left:40px;top:90px;width:200px', [1], {color: 'rgba(255,255,255,.25)', h: 18});
  bubble(ph, 'รายละเอียดสินค้า?', 7.00, 'left:34px;top:170px', {size: 38});
  skel(ph, 'left:40px;top:300px;width:300px', [.9, .6], {color: 'rgba(255,255,255,.12)', h: 26, t: 7.2});
  tile(c, 'package', 7.30, 'left:80px;top:250px', {size: 170, bg: '#fff', color: NAVY});
  tile(c, 'star', 7.45, 'left:840px;top:220px', {size: 150, bg: 'glass'});
  tile(c, 'circle-help', 9.22, 'left:810px;top:690px', {size: 190, bg: ACC, color: '#0A0A0A'});
  tile(c, 'shopping-cart', 9.36, 'left:100px;top:780px', {size: 160, bg: 'glass'});
  const t = txt(c, [[['หรือว่า', 'l', 6.84]]], 'top:1200px'); t.classList.add('aroll');
  pill(c, 'ไม่มั่นใจในตัวสินค้า', 7.30, 'left:0;right:0;margin:auto;width:fit-content;top:1300px');
  pill(c, 'ไม่รู้จะซื้อดีหรือเปล่า', 9.22, 'left:0;right:0;margin:auto;width:fit-content;top:1430px');
}
/* ---------- C4 cream poster · sales bars dropping · เจ้าของธุรกิจ ---------- */
{
  const c = card(10.82, 13.16, {bg: 'cream'});
  curl(c, 10.82);
  const p = panel(c, 'left:170px;top:430px;width:740px;height:986px', 10.82);
  const st = div('left:56px;top:56px;width:120px;height:120px;border-radius:34px;display:flex;align-items:center;justify-content:center;background:' + NAVY, p, ico('store', 64, '#fff'));
  popIn(st, 10.95);
  skel(p, 'left:200px;top:72px;width:440px', [.75, .45], {t: 11.0});
  bars(p, [.55, .7, .62, .85, .95], 11.0, 'left:95px;top:300px', {h: 560, to: [.62, .5, .38, .26, .16], tTo: 11.8});
  trend(p, [[10, 40], [190, 150], [370, 300], [540, 470]], 11.86, 'left:95px;top:330px', {w: 560, h: 520, color: '#FF3B30', sw: 16});
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
/* ---------- C7 dark · checkout: cursor hovers the pay button, then backs off ---------- */
{
  const c = card(22.30, 23.52);
  mood(c, {seed: 2});
  const p = panel(c, 'left:170px;top:240px;width:740px;height:820px', 22.30);
  const pk = div('left:50px;top:60px;width:150px;height:150px;border-radius:40px;display:flex;align-items:center;justify-content:center;background:' + NAVY, p, ico('package', 80, '#fff'));
  skel(p, 'left:236px;top:84px;width:440px', [.9, .55], {t: 22.4});
  div('left:50px;top:270px;width:640px;height:2px;background:rgba(20,33,61,.1)', p);
  skel(p, 'left:50px;top:320px;width:640px', [.5, .7, .35], {t: 22.45, h: 20});
  const btn = div('left:50px;top:600px;width:640px;height:150px;border-radius:40px;display:flex;align-items:center;justify-content:center;gap:20px;background:' + ACC + ';font-family:KeySans;font-size:66px;color:#0A0A0A', p, ico('credit-card', 70, '#0A0A0A') + 'ชำระเงิน');
  punch(btn, 22.78, 1.05);
  cursor(c, [[22.36, 1000, 1500], [22.74, 600, 900], [22.95, 620, 915], [23.40, 990, 1180]]);
  const t = txt(c, [[['เขาก็ไม่กล้า', 'l', 22.32]], [['จ่ายเงิน', 'k', 22.75], ['อยู่ดี', 'l', 23.05]]], 'top:1260px'); t.classList.add('aroll');
  keyHit(22.75);
}
/* ---------- C8 cream poster · product + 2/5 stars + question · "ไม่มั่นใจ คุณภาพ" ---------- */
{
  const c = card(23.54, 25.00, {bg: 'cream', sound: 'swipe'});
  curl(c, 23.54);
  const p = panel(c, 'left:170px;top:430px;width:740px;height:986px', 23.54);
  tile(p, 'package', 23.62, 'left:190px;top:120px', {size: 360, bg: NAVY, color: '#fff', sound: null});
  tile(p, 'circle-help', 23.98, 'left:480px;top:70px', {size: 150, bg: ACC, color: '#0A0A0A'});
  stars(p, 5, 2, 24.30, 'left:82px;top:600px');
  skel(p, 'left:120px;top:780px;width:500px', [1, .7], {t: 24.4});
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
/* ---------- C9 dark · discount tags drop on the cart, cart still says no ---------- */
{
  const c = card(31.30, 33.84);
  mood(c, {seed: 3});
  const cart = tile(c, 'shopping-cart', 31.35, 'left:350px;top:540px', {size: 380, bg: '#fff', color: NAVY});
  const chip = (txt0, t, css) => {
    const [o, i] = holder(c, css);
    i.style.cssText += `display:flex;align-items:center;gap:16px;padding:16px 34px 20px 26px;border-radius:999px;background:${ACC};font-family:KeySans;font-size:56px;color:#0A0A0A;white-space:nowrap;box-shadow:0 20px 44px rgba(0,0,0,.45);opacity:0`;
    i.innerHTML = ico('tag', 54, '#0A0A0A') + txt0;
    A(i, [{opacity: 0, transform: 'translateY(-520px) rotate(-18deg)'}, {opacity: 1, transform: 'rotate(-6deg)'}], t, .55, {e: BOUNCE});
    sfx('thud', t + .3, -22);
    return o;
  };
  chip('ลดราคา', 31.55, 'left:230px;top:440px');
  chip('ลดเพิ่ม', 32.10, 'left:560px;top:400px');
  wobble(cart.inner, 33.18);
  tile(c, 'x', 33.22, 'left:660px;top:500px', {size: 150, bg: '#FF3B30', color: '#fff', sound: 'stamp', db: -22, float: false});
  const t = txt(c, [[['ต่อให้เราลดราคาเพิ่ม', 'l', 31.30]], [['ลูกค้าก็อาจจะ', 'l', 32.56]], [['ยังไม่ซื้อ', 'k', 33.18], ['อยู่ดี', 'l', 33.60]]], 'top:1290px'); t.classList.add('aroll');
  keyHit(33.18);
}
/* ---------- C10 dark · step 1: discount gets crossed out ---------- */
{
  const c = card(35.74, 37.94);
  mood(c, {seed: 4});
  num(c, 1, 35.80, 'left:492px;top:130px');
  const a = txt(c, [[['สิ่งที่ควรทำ', 'l', 35.74, {size: 64}]], [['อย่างแรก', 'k', 36.30]]], 'top:250px'); a.classList.add('aroll');
  const pc = tile(c, 'badge-percent', 35.95, 'left:360px;top:640px', {size: 360, bg: '#fff', color: NAVY});
  cross(c, 37.20, 'left:410px;top:690px', {size: 260});
  wobble(pc.inner, 37.40);
  const b = txt(c, [[['ไม่ใช่', 'iw', 36.82, {size: 96}], ['การลดราคา', 'hl', 37.05, {size: 90}]]], 'top:1400px'); b.classList.add('aroll');
  strike(b.querySelectorAll('.ch')[1], 37.35, '#111');
  keyHit(36.30);
}
/* ---------- C11 final · bullseye hit on "ถูกจุด" (holds 1 s after speech) ---------- */
{
  const c = card(40.50, 42.90, {sound: 'whoosh_long'});
  mood(c, {seed: 5, o: .26});
  tile(c, 'lightbulb', 40.70, 'left:120px;top:300px', {size: 160, bg: 'glass'});
  tile(c, 'search', 40.85, 'left:820px;top:380px', {size: 140, bg: 'glass'});
  target(c, 40.55, 41.52, 'left:260px;top:420px', {size: 560});
  const t = txt(c, [[['แล้วก็แก้ปัญหานั้น', 'l', 40.50, {size: 64}]], [['ให้', 'l', 41.40, {size: 64}], ['ถูกจุด', 'k', 41.52, {size: 190}]]], 'top:1300px'); t.classList.add('aroll');
  keyHit(41.52, -20);
  sfx('sub', 41.50, -16);
}
