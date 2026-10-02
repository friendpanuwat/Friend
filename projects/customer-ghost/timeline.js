/* Clip: "ลูกค้าทักมาแล้วหายไป" (41.9 s) */
scenes([[1.0, 2.30], [5.0, 9.55], [13.18, 15.06], [19.0, 22.98], [26.0, 29.87], [35.41, 37.48], [39.58, 43]]);

/* v2: scene background = the source footage, blurred + darkened (no aurora / dot grid / particles) */
aurora = () => {};
const _scene = scene;
scene = function (t0, t1, o = {}) {
  const cam = _scene(t0, t1, o), root = cam.parentElement.parentElement;
  const cv = document.createElement('canvas'); cv.width = 270; cv.height = 480;
  cv.style.cssText = 'position:absolute;left:-60px;top:-100px;width:1200px;height:2120px';
  root.insertBefore(cv, root.firstChild);
  const tint = div('inset:0;background:linear-gradient(180deg,rgba(5,7,13,.45),rgba(5,7,13,.25) 45%,rgba(5,7,13,.55))', root);
  root.insertBefore(tint, cv.nextSibling);
  const ctx = cv.getContext('2d');
  HOOKS.push(t => {
    if (t < t0 - .1 || t > t1 + .05) return;
    ctx.filter = 'blur(6px) brightness(.6) saturate(.85)';
    ctx.drawImage(document.getElementById('v'), 0, 0, 270, 480);
  });
  return cam;
};

IC.search ='M68 42a26 26 0 1 1-52 0a26 26 0 1 1 52 0M61 61L84 84';
const QMARK = 'M36 36c0-10 6-17 14-17s14 6 14 15c0 12-14 13-14 26v4M50 80v1';

/* ===================== A-ROLL TEXT ===================== */
block({t0: 0, t1: .98, lines: [[['เวลาลูกค้า', 's', .03]], [['ทักมาถาม', 'k', .5]]]});
keyHit(.5, -19); zoom(.5, 1.05, .5);

block({t0: 2.32, t1: 3.33, lines: [[['หลายคน', 'm', 2.32]], [['ก็อาจจะคิดว่า', 's', 2.7]]]});
zoom(2.32, 1.0, .01);
block({t0: 3.35, t1: 4.98, lines: [[['เฮ้ย!', 'm', 3.35, 120]], [['มันเป็นเพราะ', 's', 3.6], ['ของเราแพง', 'k', 4.0]], [['หรือเปล่า?', 's', 4.5]]]});
zoom(3.35, 1.05, .12); keyHit(4.0); zoom(4.0, 1.09, .12); zoom(5.0, 1.0, .01);

block({t0: 9.57, t1: 11.41, lines: [[['แต่ปัญหาก็คือ', 's', 9.57]], [['เจ้าของธุรกิจ', 'k', 10.0]]]});
keyHit(10.0); zoom(10.0, 1.06, .7);
block({t0: 11.43, t1: 13.16, lines: [[['พอเห็นลูกค้าน้อยลง', 'm', 11.43]], [['หรือ', 's', 12.0], ['เงียบไป', 'k', 12.15]]]});
zoom(11.43, 1.0, .4); keyHit(12.15, -23); zoom(12.15, 1.07, .14); zoom(13.2, 1.0, .01);

block({t0: 15.08, t1: 16.98, lines: [[['สิ่งที่ลูกค้าต้องการ', 'm', 15.08]], [['อาจจะไม่ใช่', 's', 16.0], ['ส่วนลด', 'k', 16.4]]]});
keyHit(16.4); zoom(16.4, 1.07, .14);
block({t0: 17.0, t1: 18.98, lines: [[['แต่เขาอาจจะ', 's', 17.0], ['ต้องการ', 'm', 17.72]], [['คำตอบ', 'k', 18.26]], [['ที่เขากังวลอยู่', 's', 18.55]]]});
zoom(17.0, 1.0, .35); keyHit(18.26); zoom(18.26, 1.08, .12); zoom(19.0, 1.0, .01);

block({t0: 23.0, t1: 24.98, lines: [[['บางคนอาจจะ', 's', 23.0], ['ไม่มั่นใจ', 'm', 23.54]], [['เรื่องคุณภาพ', 'k', 24.0]]]});
keyHit(24.0); zoom(24.0, 1.05, .6);
block({t0: 25.0, t1: 25.98, lines: [[['บางคนกลัวว่า', 's', 25.0]], [['ซื้อไปแล้ว', 'm', 25.39], ['ไม่คุ้ม', 'k', 25.7]]]});
zoom(25.0, 1.0, .3); keyHit(25.7); zoom(25.7, 1.08, .12); zoom(26.0, 1.0, .01);

block({t0: 29.89, t1: 30.98, lines: [[['ถ้าเรา', 's', 29.89], ['ไม่แก้', 'm', 30.14]], [['ข้อสงสัย', 'k', 30.4], ['พวกนี้', 's', 30.75]]]});
keyHit(30.4); zoom(30.4, 1.06, .6);
block({t0: 31.0, t1: 34.05, lines: [[['ต่อให้เรา', 's', 31.0], ['ลดราคาเพิ่ม', 'm', 31.3]], [['ลูกค้าก็อาจจะ', 's', 32.0]], [['ยังไม่ซื้ออยู่ดี', 'k', 32.9]]]});
zoom(31.0, 1.0, .4); keyHit(32.9); zoom(32.9, 1.08, .14);
block({t0: 34.07, t1: 35.39, lines: [[['เพราะฉะนั้น', 's', 34.07]], [['ถ้าลูกค้าทักมา', 'm', 34.55]], [['แล้วหายไป', 'm', 35.0]]]});
zoom(34.07, 1.0, .4);

block({t0: 37.5, t1: 39.56, lines: [[['แต่คือ', 's', 37.5], ['การหาว่า', 'm', 38.06]], [['จริง ๆ แล้ว', 's', 38.5]], [['เขาติดอะไรอยู่', 'k', 39.0]]]});
keyHit(39.0); zoom(39.0, 1.08, .12);
badge('search', 37.55, 39.56);

/* ===================== FULL-SCREEN SCENES ===================== */

/* 1 · ทักมาถามรายละเอียดสินค้า แล้วก็หายไป — chat that goes silent (1.0–2.30) */
{
  const c = scene(1.0, 2.30, {seed: 1, tilt: 4});
  const card = div('left:110px;top:330px;width:860px;height:760px;padding:48px 52px', c); card.className = 'glass';
  card.innerHTML = `<div style="display:flex;align-items:center;gap:22px;padding-bottom:30px;border-bottom:1.5px solid rgba(255,255,255,.1)">
      <div style="width:84px;height:84px;border-radius:50%;background:linear-gradient(135deg,rgba(143,211,255,.5),rgba(78,155,255,.2))"></div>
      <div><div style="font-family:BodyFont;font-size:42px;color:#fff">ลูกค้า</div>
      <div class="st" style="font-family:BodyFont;font-size:30px;color:${BLUE}">ออนไลน์</div></div></div>`;
  rise(card, 1.0, .45, 80);
  const q = div('left:52px;top:200px;max-width:640px;padding:26px 40px 32px;border-radius:44px 44px 44px 12px;background:rgba(255,255,255,.12);opacity:0', card);
  const qk = kinetic(q, 'รายละเอียดสินค้า?', 'm', 1.08); qk.style.fontSize = '64px';
  A(q, [{opacity: 0, transform: 'translateY(40px) scale(.9)'}, {opacity: 1, transform: 'none'}], 1.05, .35, {e: SPRING});
  const a = div('right:52px;top:380px;width:520px;padding:30px 40px;border-radius:44px 44px 12px 44px;background:rgba(143,211,255,.18);border:1.5px solid rgba(143,211,255,.4);opacity:0', card,
    [92, 70, 82].map((w, i) => `<div style="height:16px;border-radius:8px;background:rgba(255,255,255,.55);width:${w}%;margin-top:${i ? 22 : 0}px"></div>`).join(''));
  A(a, [{opacity: 0, transform: 'translateY(40px) scale(.9)'}, {opacity: 1, transform: 'none'}], 1.4, .35, {e: SPRING});
  const seen = div('right:60px;top:560px;font-family:BodyFont;font-size:30px;color:rgba(255,255,255,.5);opacity:0', card, 'อ่านแล้ว ✓✓');
  A(seen, [{opacity: 0}, {opacity: 1}], 1.62, .2);
  A(q, [{opacity: 1}, {opacity: .25}], 1.8, .3, {f: 'forwards'});
  const st = card.querySelector('.st');
  HOOKS.push(t => { st.textContent = t >= 1.78 ? 'ออฟไลน์' : 'ออนไลน์'; st.style.color = t >= 1.78 ? 'rgba(255,255,255,.4)' : BLUE; });
  sfx('softswish', 1.05, -24, 1.1); sfx('softswish', 1.4, -25, 1.3);
  text(c, 'แล้วก็', 's', 1.77, 'top:1200px');
  text(c, 'หายไป', 'k', 1.86, 'top:1270px', {size: 170});
  sfx('swell', 1.5, -26);
}

/* 2 · ลูกค้าลังเล / ไม่มั่นใจ / ไม่รู้จะซื้อดีไหม — "in the customer's head" card (5.0–9.55) */
{
  const c = scene(5.0, 9.55, {seed: 2, tilt: 4});
  text(c, 'แต่จริง ๆ แล้ว', 's', 5.0, 'top:160px');
  text(c, 'ลูกค้า', 'm', 5.71, 'top:230px', {size: 100});
  const card = div('left:110px;top:430px;width:860px;height:880px;padding:56px', c); card.className = 'glass';
  card.innerHTML = `<span class="chip"><span class="dot"></span>ในใจลูกค้า</span>`;
  rise(card, 5.75, .55);
  [['ก็อาจจะ', 'ลังเล', 6.3, [.3, .65, .4, .55]], ['ในตัวสินค้า', 'ไม่มั่นใจ', 7.25, [.2, .5, .25, .35]], ['ไม่รู้ว่า', 'ซื้อดีไหม?', 8.95, [.5, .2, .6, .45]]].forEach(([s, w, t, bar], i) => {
    const row = div(`left:56px;right:56px;top:${170 + i * 225}px;height:190px;border-radius:28px;background:rgba(255,255,255,.04);border:1.5px solid rgba(255,255,255,.08);display:flex;align-items:center;gap:34px;padding:0 34px`, card,
      `<div style="width:100px;height:100px;border-radius:50%;border:3px solid rgba(255,255,255,.4);flex:none;display:flex;align-items:center;justify-content:center"><svg width="70" height="70" viewBox="0 0 100 100"><path d="${QMARK}" stroke="${BLUE}" stroke-width="9" stroke-linecap="round" fill="none"/></svg></div>
       <div style="flex:1"><div class="lbl" style="font-family:SmallFont;font-size:42px;color:rgba(255,255,255,.65)">${s}</div>
       <div style="height:12px;border-radius:6px;background:rgba(255,255,255,.08);margin-top:14px;overflow:hidden"><div class="bar" style="height:100%;width:100%;border-radius:6px;background:linear-gradient(90deg,#4E9BFF,${BLUE});transform-origin:left;transform:scaleX(0)"></div></div></div>`);
    A(row, [{opacity: 0, transform: 'translateX(60px)'}, {opacity: 1, transform: 'none'}], t - .2, .45, {e: SPRING});
    const k = kinetic(row.querySelector('.lbl'), ' ' + w, 'k', t); k.style.fontSize = '80px'; k.style.marginLeft = '8px';
    // a meter that can't make up its mind
    A(row.querySelector('.bar'), [{transform: 'scaleX(0)'}, ...bar.map((v, j) => ({transform: `scaleX(${v})`, offset: (j + 1) / bar.length}))], t, 1.2, {e: INOUT});
    draw(row.querySelector('path'), t + .1, .45);
    A(row, [{borderColor: 'rgba(255,255,255,.08)'}, {borderColor: 'rgba(143,211,255,.5)'}], t + .3, .3, {f: 'forwards'});
    sfx('softswish', t - .05, -22, 1 + i * .08);
  });
}

/* 3 · ก็รีบทำโปรโมชั่น รีบลดราคา — price tag gets slashed (13.18–15.06) */
{
  const c = scene(13.18, 15.06, {seed: 3, tilt: 4});
  text(c, 'ก็รีบทำ', 's', 13.18, 'top:170px');
  text(c, 'โปรโมชั่น', 'm', 13.45, 'top:240px', {size: 110});
  const tagW = div('left:240px;top:470px;width:600px;height:560px;opacity:0;transform-origin:50% 0', c);
  const tag = div('left:0;top:60px;width:600px;height:500px;padding:120px 60px 0', tagW); tag.className = 'glass';
  tag.innerHTML = `<div style="position:absolute;left:270px;top:40px;width:60px;height:60px;border-radius:50%;border:3px solid rgba(255,255,255,.5)"></div>
    <span class="chip"><span class="dot"></span>SALE</span>
    <div class="old" style="position:relative;margin-top:50px;height:30px;width:430px;border-radius:15px;background:rgba(255,255,255,.35)">
      <svg width="470" height="60" viewBox="0 0 470 60" style="position:absolute;left:-20px;top:-15px;overflow:visible"><path class="cut" d="M0 52L470 8" stroke="${BLUE}" stroke-width="10" stroke-linecap="round" fill="none" style="filter:drop-shadow(0 0 10px ${BLUE})"/></svg></div>
    <div style="margin-top:44px;height:44px;width:430px;border-radius:22px;background:rgba(255,255,255,.06);overflow:hidden"><div class="new" style="height:100%;width:100%;border-radius:22px;background:linear-gradient(90deg,#4E9BFF,${BLUE});transform-origin:left;transform:scaleX(0)"></div></div>`;
  const line = svg(4, 70, `<path d="M2 0V70" stroke="rgba(255,255,255,.4)" stroke-width="3"/>`, 'left:298px;top:0', tagW);
  A(tagW, [{opacity: 0, transform: 'translateY(-200px) rotate(-14deg)', filter: 'blur(12px)'}, {opacity: 1, transform: 'rotate(5deg)', filter: 'blur(0)', offset: .55}, {opacity: 1, transform: 'rotate(-3deg)', offset: .8}, {opacity: 1, transform: 'rotate(0deg)'}], 13.2, .9, {e: SMOOTH});
  draw(tag.querySelector('.cut'), 14.0, .22);
  A(tag.querySelector('.old'), [{opacity: 1}, {opacity: .45}], 14.15, .2, {f: 'forwards'});
  A(tag.querySelector('.new'), [{transform: 'scaleX(0)'}, {transform: 'scaleX(.55)'}], 14.2, .4, {e: SPRING});
  A(tagW, [{transform: 'rotate(0deg) scale(1)'}, {transform: 'rotate(-4deg) scale(1.04)'}, {transform: 'rotate(0deg) scale(1)'}], 14.0, .3, {f: 'none', c: 'add'});
  sfx('stamp', 14.02, -20);
  text(c, 'รีบลดราคา', 'k', 14.0, 'top:1120px', {size: 160});
  text(c, 'ทั้งที่บางครั้ง...', 's', 14.31, 'top:1340px');
}

/* 4 · ต่อให้ลดราคาเยอะแค่ไหน ถ้ายังมีคำถามในใจ ก็ไม่กล้าจ่าย (19.0–22.98) */
{
  const c = scene(19.0, 22.98, {seed: 4, tilt: 3});
  const a1 = text(c, 'ต่อให้ลดราคา', 'm', 19.0, 'top:220px');
  const a2 = text(c, 'เยอะแค่ไหน', 'k', 19.74, 'top:330px', {size: 160});
  const card = div('left:170px;top:640px;width:740px;height:400px;padding:52px 56px', c); card.className = 'glass';
  card.innerHTML = `<span class="chip"><span class="dot"></span>ราคา</span>
    <div style="margin-top:70px;height:56px;border-radius:28px;background:rgba(255,255,255,.06);overflow:hidden"><div class="p" style="height:100%;width:100%;border-radius:28px;background:linear-gradient(90deg,#4E9BFF,${BLUE});transform-origin:left"></div></div>
    <svg class="ar" width="90" height="90" viewBox="0 0 100 100" style="position:absolute;right:56px;top:40px"><path d="M50 14V82M24 58L50 84L76 58" stroke="${BLUE}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`;
  rise(card, 19.05, .5);
  const p = card.querySelector('.p');
  A(p, [{transform: 'scaleX(1)'}, {transform: 'scaleX(.72)', offset: .25}, {transform: 'scaleX(.72)', offset: .4}, {transform: 'scaleX(.45)', offset: .6}, {transform: 'scaleX(.45)', offset: .75}, {transform: 'scaleX(.2)'}], 19.4, 1.4, {e: INOUT});
  A(card.querySelector('.ar'), [{transform: 'translateY(-10px)'}, {transform: 'translateY(14px)'}], 19.4, .35, {it: 4, dir: 'alternate', f: 'none', e: 'ease-in-out'});
  [19.5, 19.95, 20.45].forEach((t, i) => sfx('softswish', t, -25, 1 - i * .08));
  [a1, a2, card].forEach(el => fadeOut(el, 20.85));
  // the question that discounts can't answer
  const b = div('left:340px;top:420px;width:400px;height:400px;border-radius:50%;display:flex;align-items:center;justify-content:center;opacity:0', c,
    `<svg width="240" height="240" viewBox="0 0 100 100"><path d="${QMARK}" fill="none" stroke="${BLUE}" stroke-width="7" stroke-linecap="round" style="filter:drop-shadow(0 0 10px ${BLUE})"/></svg>`);
  b.className = 'glass'; b.style.borderRadius = '50%';
  rise(b, 21.0, .55, 80); draw(b.querySelector('path'), 21.15, .6);
  A(b.firstChild, [{transform: 'rotate(-6deg)'}, {transform: 'rotate(6deg)'}], 21.7, .6, {it: 3, dir: 'alternate', f: 'none', e: 'ease-in-out'});
  text(c, 'ถ้าลูกค้ายังมี', 's', 21.0, 'top:900px');
  text(c, 'คำถามในใจ', 'k', 21.39, 'top:970px', {size: 160});
  text(c, 'เขาก็ไม่กล้าจ่ายเงินอยู่ดี', 'm', 22.19, 'top:1190px', {size: 76});
  bloom(20.95, .3); sfx('swell', 20.4, -24);
}

/* 5 · ยังไม่เห็นว่าสินค้าของเราจะช่วยแก้ปัญหาให้เขาตรงไหน — product ⋯?⋯ problem (26.0–29.87) */
{
  const c = scene(26.0, 29.87, {seed: 5, tilt: 5});
  text(c, 'หรือบางคน', 's', 26.0, 'top:180px');
  text(c, 'ยังไม่เห็นว่า', 'm', 27.35, 'top:250px', {size: 100});
  const mk = (x, icon, label, t) => {
    const cd = div(`left:${x}px;top:520px;width:340px;height:400px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:30px;opacity:0`, c,
      `<svg width="150" height="150" viewBox="0 0 100 100"><path d="${icon}" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>
       <span class="chip" style="font-size:36px">${label}</span>`);
    cd.className = 'glass'; rise(cd, t, .55); draw(cd.querySelector('path'), t + .1, .6);
    return cd;
  };
  mk(80, 'M50 14L84 30V70L50 86L16 70V30ZM16 30L50 46L84 30M50 46V86', 'สินค้าของเรา', 26.1);
  mk(660, 'M50 16a34 34 0 1 1 0 68a34 34 0 1 1 0-68M50 34v22M50 66v1', 'ปัญหาของเขา', 26.3);
  const link = svg(240, 40, `<path class="l1" d="M0 20H80" stroke="${BLUE}" stroke-width="6" stroke-linecap="round" stroke-dasharray="2 16"/><path class="l2" d="M240 20H160" stroke="${BLUE}" stroke-width="6" stroke-linecap="round" stroke-dasharray="2 16"/>`, 'left:420px;top:700px', c);
  [['.l1', 27.6], ['.l2', 27.75]].forEach(([s, t]) => A(link.querySelector(s), [{opacity: 0}, {opacity: 1}], t, .3));
  const q = div('left:490px;top:670px;width:100px;height:100px;border-radius:50%;display:flex;align-items:center;justify-content:center;opacity:0;border:3px solid ' + BLUE + ';box-shadow:0 0 30px rgba(143,211,255,.4)', c,
    `<svg width="64" height="64" viewBox="0 0 100 100"><path d="${QMARK}" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round"/></svg>`);
  A(q, [{opacity: 0, transform: 'scale(.4)'}, {opacity: 1, transform: 'none'}], 28.0, .45, {e: SPRING});
  A(q, [{transform: 'scale(1)'}, {transform: 'scale(1.1)'}], 28.5, .5, {it: 3, dir: 'alternate', f: 'none', c: 'add', e: 'ease-in-out'});
  text(c, 'สินค้าของเรา', 'm', 27.6, 'top:1060px', {size: 84});
  text(c, 'จะช่วยแก้ปัญหา', 'k', 28.0, 'top:1170px', {size: 140});
  text(c, 'ให้เขาตรงไหน?', 's', 29.0, 'top:1360px');
  sfx('softswish', 28.0, -22);
}

/* 6 · สิ่งที่ควรทำอย่างแรก ไม่ใช่การลดราคา — statement with strike (35.41–37.48) */
{
  const c = scene(35.41, 37.48, {seed: 6, tilt: 2});
  text(c, 'สิ่งที่ควรทำอย่างแรก', 's', 35.41, 'top:620px');
  text(c, 'ไม่ใช่', 'm', 35.9, 'top:710px', {size: 120});
  text(c, 'การลดราคา', 'k', 36.15, 'top:860px', {size: 190});
  const st = svg(860, 60, `<path class="s" d="M0 40L860 20" stroke="#fff" stroke-width="12" stroke-linecap="round" fill="none" style="filter:drop-shadow(0 0 14px ${BLUE})"/>`, 'left:110px;top:950px', c);
  draw(st.querySelector('.s'), 36.75, .25);
  text(c, 'นะ!', 's', 37.0, 'top:1150px', {size: 80});
  bloom(35.36, .5); sfx('swell', 34.8, -22); sfx('sub', 35.41, -12); sfx('stamp', 36.78, -20);
}

/* 7 · ending — แก้ปัญหานั้นให้ถูกจุด: target locks on (39.58–end) */
{
  const c = scene(39.58, 43, {seed: 7, tilt: 3});
  const tg = svg(640, 640, [270, 190, 110].map((r, i) => `<circle class="r${i}" cx="320" cy="320" r="${r}" fill="none" stroke="${i === 2 ? BLUE : 'rgba(255,255,255,.35)'}" stroke-width="${i === 2 ? 6 : 4}"/>`).join('') +
    `<path class="x" d="M320 20V140M320 500V620M20 320H140M500 320H620" stroke="rgba(255,255,255,.45)" stroke-width="4" stroke-linecap="round"/>`, 'left:220px;top:300px', c);
  [0, 1, 2].forEach(i => draw(tg.querySelector('.r' + i), 39.65 + i * .12, .6));
  draw(tg.querySelector('.x'), 39.9, .5);
  const dot = div('left:0;top:0;width:56px;height:56px;margin:-28px 0 0 -28px;border-radius:50%;background:#fff;box-shadow:0 0 40px 10px rgba(143,211,255,.8);opacity:0', c);
  A(dot, [{opacity: 0, transform: 'translate(300px,520px)'}, {opacity: 1, transform: 'translate(360px,700px)', offset: .2}, {opacity: 1, transform: 'translate(700px,500px)', offset: .5},
          {opacity: 1, transform: 'translate(480px,760px)', offset: .78}, {opacity: 1, transform: 'translate(540px,620px)'}], 40.0, 1.0, {e: INOUT});
  ripple(c, 540, 620, 41.0, 3.2); ripple(c, 540, 620, 41.15, 4.4);
  A(tg, [{transform: 'scale(1)'}, {transform: 'scale(1.06)'}, {transform: 'scale(1)'}], 41.0, .35, {f: 'none'});
  text(c, 'แล้วก็แก้ปัญหานั้น', 'm', 39.6, 'top:1050px');
  text(c, 'ให้ถูกจุด', 'k', 41.0, 'top:1170px', {size: 210});
  bloom(41.0, .4); sfx('swell', 40.4, -23); sfx('thud', 41.0, -22); sfx('sub', 41.0, -13);
}
