/* Example — clip "ลูกค้าทักมาแล้วหายไป" (Thai, 41.9 s), overlay style.
   Speaker on screen the whole time; captions in the lower zone; 11 mini widgets above the head (y ≈ 130–540).
   Helpers (widget, popIn, ICON, QMARK, strikeChip, iconChip, .mini, .minichip) come from assets/overlay_kit.js. */

/* ===================== CAPTIONS (lower zone) ===================== */
block({t0: 0, t1: .98, lines: [[['เวลาลูกค้า', 's', .03]], [['ทักมาถาม', 'k', .5]]]});
keyHit(.5, -19); zoom(.5, 1.05, .5);
block({t0: 1.0, t1: 2.30, lines: [[['รายละเอียดสินค้า', 'm', 1.0]], [['แล้วก็', 's', 1.77], ['หายไป', 'k', 1.86]]]});
keyHit(1.86, -22);
block({t0: 2.32, t1: 3.33, lines: [[['หลายคน', 'm', 2.32]], [['ก็อาจจะคิดว่า', 's', 2.7]]]});
zoom(2.32, 1.0, .4);
block({t0: 3.35, t1: 4.98, lines: [[['เฮ้ย!', 'm', 3.35, 120]], [['มันเป็นเพราะ', 's', 3.6], ['ของเราแพง', 'k', 4.0]], [['หรือเปล่า?', 's', 4.5]]]});
zoom(3.35, 1.05, .12); keyHit(4.0); zoom(4.0, 1.09, .12);

block({t0: 5.0, t1: 6.98, lines: [[['แต่จริง ๆ แล้ว', 's', 5.0]], [['ลูกค้าก็อาจจะ', 'm', 5.71]], [['ลังเล', 'k', 6.3]]]});
zoom(5.0, 1.0, .5); keyHit(6.3, -22); zoom(6.3, 1.05, .5);
block({t0: 7.0, t1: 8.44, lines: [[['หรือว่า', 's', 7.0], ['ไม่มั่นใจ', 'k', 7.3]], [['ในตัวสินค้า', 'm', 8.0]]]});
keyHit(7.3, -22);
block({t0: 8.46, t1: 9.55, lines: [[['หรือไม่รู้ว่า', 's', 8.46]], [['จะซื้อดีหรือเปล่า', 'm', 9.0]]]});
zoom(8.46, 1.0, .5);

block({t0: 9.57, t1: 11.41, lines: [[['แต่ปัญหาก็คือ', 's', 9.57]], [['เจ้าของธุรกิจ', 'k', 10.0]]]});
keyHit(10.0); zoom(10.0, 1.06, .7);
block({t0: 11.43, t1: 13.16, lines: [[['พอเห็นลูกค้าน้อยลง', 'm', 11.43]], [['หรือ', 's', 12.0], ['เงียบไป', 'k', 12.15]]]});
zoom(11.43, 1.0, .4); keyHit(12.15, -23); zoom(12.15, 1.07, .14);
block({t0: 13.18, t1: 15.06, lines: [[['ก็รีบทำ', 's', 13.18], ['โปรโมชั่น', 'm', 13.4]], [['รีบลดราคา', 'k', 14.0]], [['ทั้งที่บางครั้ง...', 's', 14.31]]]});
zoom(13.18, 1.0, .4); keyHit(14.0); zoom(14.0, 1.08, .12);

block({t0: 15.08, t1: 16.98, lines: [[['สิ่งที่ลูกค้าต้องการ', 'm', 15.08]], [['อาจจะไม่ใช่', 's', 16.0], ['ส่วนลด', 'k', 16.4]]]});
zoom(15.08, 1.0, .4); keyHit(16.4); zoom(16.4, 1.07, .14);
block({t0: 17.0, t1: 18.98, lines: [[['แต่เขาอาจจะ', 's', 17.0], ['ต้องการ', 'm', 17.72]], [['คำตอบ', 'k', 18.26]], [['ที่เขากังวลอยู่', 's', 18.55]]]});
zoom(17.0, 1.0, .35); keyHit(18.26); zoom(18.26, 1.08, .12);

block({t0: 19.0, t1: 20.98, lines: [[['คือต่อให้', 's', 19.0], ['ลดราคา', 'm', 19.3]], [['เยอะแค่ไหน', 'k', 19.74]]]});
zoom(19.0, 1.0, .4); keyHit(19.74); zoom(19.74, 1.06, .5);
block({t0: 21.0, t1: 22.98, lines: [[['ถ้าลูกค้ายังมี', 's', 21.0]], [['คำถามในใจ', 'k', 21.39]], [['เขาก็ไม่กล้าจ่ายเงินอยู่ดี', 'm', 22.19, 72]]]});
zoom(21.0, 1.0, .4); keyHit(21.39); zoom(21.39, 1.07, .14);

block({t0: 23.0, t1: 24.98, lines: [[['บางคนอาจจะ', 's', 23.0], ['ไม่มั่นใจ', 'm', 23.54]], [['เรื่องคุณภาพ', 'k', 24.0]]]});
zoom(23.0, 1.0, .4); keyHit(24.0); zoom(24.0, 1.05, .6);
block({t0: 25.0, t1: 25.98, lines: [[['บางคนกลัวว่า', 's', 25.0]], [['ซื้อไปแล้ว', 'm', 25.39], ['ไม่คุ้ม', 'k', 25.7]]]});
zoom(25.0, 1.0, .3); keyHit(25.7); zoom(25.7, 1.08, .12);
block({t0: 26.0, t1: 27.98, lines: [[['หรือบางคน', 's', 26.0]], [['ยังไม่เห็นว่า', 's', 27.35], ['สินค้าของเรา', 'm', 27.6]]]});
zoom(26.0, 1.0, .4);
block({t0: 28.0, t1: 29.87, lines: [[['จะช่วยแก้ปัญหา', 'k', 28.0]], [['ให้เขาตรงไหน?', 's', 29.0]]]});
keyHit(28.0); zoom(28.0, 1.06, .6);

block({t0: 29.89, t1: 30.98, lines: [[['ถ้าเรา', 's', 29.89], ['ไม่แก้', 'm', 30.14]], [['ข้อสงสัย', 'k', 30.4], ['พวกนี้', 's', 30.75]]]});
zoom(29.89, 1.0, .4); keyHit(30.4); zoom(30.4, 1.06, .6);
block({t0: 31.0, t1: 34.05, lines: [[['ต่อให้เรา', 's', 31.0], ['ลดราคาเพิ่ม', 'm', 31.3]], [['ลูกค้าก็อาจจะ', 's', 32.0]], [['ยังไม่ซื้ออยู่ดี', 'k', 32.9]]]});
zoom(31.0, 1.0, .4); keyHit(32.9); zoom(32.9, 1.08, .14);
block({t0: 34.07, t1: 35.39, lines: [[['เพราะฉะนั้น', 's', 34.07]], [['ถ้าลูกค้าทักมา', 'm', 34.55]], [['แล้วหายไป', 'm', 35.0]]]});
zoom(34.07, 1.0, .4);
block({t0: 35.41, t1: 37.48, lines: [[['สิ่งที่ควรทำอย่างแรก', 's', 35.41]], [['ไม่ใช่', 'm', 35.9], ['การลดราคา', 'k', 36.15]], [['นะ!', 's', 37.0]]]});
keyHit(36.15, -19); zoom(36.15, 1.09, .12); bloom(36.1, .3); sfx('swell', 35.5, -24); sfx('sub', 36.15, -14);
block({t0: 37.5, t1: 39.56, lines: [[['แต่คือ', 's', 37.5], ['การหาว่า', 'm', 38.06]], [['จริง ๆ แล้ว', 's', 38.5]], [['เขาติดอะไรอยู่', 'k', 39.0]]]});
zoom(37.5, 1.0, .4); keyHit(39.0); zoom(39.0, 1.08, .12);
block({t0: 39.58, t1: 42.5, lines: [[['แล้วก็แก้ปัญหานั้น', 'm', 39.58]], [['ให้ถูกจุด', 'k', 41.0, 170]]]});
zoom(39.58, 1.0, .5); zoom(41.0, 1.1, .12); bloom(41.0, .35); sfx('swell', 40.4, -24); sfx('thud', 41.0, -22); sfx('sub', 41.0, -14);

badge('search', 37.55, 39.56);

/* ===================== MINI MOTION GRAPHICS (above the head, y ≈ 150–540) ===================== */

/* 1 · chat that goes silent (0.5–2.3) */
{
  const w = widget('left:250px;top:170px;width:580px;height:350px;padding:26px 32px', .5, 2.3);
  w.innerHTML = `<div style="display:flex;align-items:center;gap:16px;padding-bottom:18px;border-bottom:1.5px solid rgba(255,255,255,.1)">
      <div style="width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,rgba(143,211,255,.55),rgba(78,155,255,.2))"></div>
      <div><div style="font-family:BodyFont;font-size:30px;color:#fff;line-height:1.2">ลูกค้า</div>
      <div class="st" style="font-family:BodyFont;font-size:22px;color:${BLUE}">ออนไลน์</div></div></div>`;
  const q = div('left:32px;top:120px;padding:12px 26px 16px;border-radius:30px 30px 30px 8px;background:rgba(255,255,255,.13);opacity:0', w);
  const qk = kinetic(q, 'รายละเอียดสินค้า?', 'm', 1.02); qk.style.fontSize = '42px';
  popIn(q, 1.0);
  const a = div('right:32px;top:210px;width:260px;padding:20px 26px;border-radius:30px 30px 8px 30px;background:rgba(143,211,255,.18);border:1.5px solid rgba(143,211,255,.4);opacity:0', w,
    [90, 66].map((x, i) => `<div style="height:12px;border-radius:6px;background:rgba(255,255,255,.55);width:${x}%;margin-top:${i ? 16 : 0}px"></div>`).join(''));
  popIn(a, 1.35);
  const seen = div('right:36px;top:300px;font-family:BodyFont;font-size:22px;color:rgba(255,255,255,.5);opacity:0', w, 'อ่านแล้ว ✓✓');
  A(seen, [{opacity: 0}, {opacity: 1}], 1.6, .2);
  A(q, [{opacity: 1}, {opacity: .3}], 1.8, .3, {f: 'forwards'});
  const st = w.querySelector('.st');
  HOOKS.push(t => { st.textContent = t >= 1.78 ? 'ออฟไลน์' : 'ออนไลน์'; st.style.color = t >= 1.78 ? 'rgba(255,255,255,.4)' : BLUE; });
}

/* 2 · "ของเราแพง?" — price tag with a wobbling question (3.9–4.98) */
{
  const w = widget('left:430px;top:250px;width:220px;height:220px;border-radius:50%;display:flex;align-items:center;justify-content:center', 3.9, 4.98);
  w.style.borderRadius = '50%';
  w.innerHTML = ICON('tag', 120, '#fff', 5);
  draw(w.querySelector('path'), 3.95, .5);
  const q = div(`right:-10px;top:-10px;width:84px;height:84px;border-radius:50%;background:rgba(8,12,22,.9);border:3px solid ${BLUE};display:flex;align-items:center;justify-content:center;opacity:0;box-shadow:0 0 24px rgba(143,211,255,.45)`, w, ICON(QMARK, 54, '#fff', 9));
  popIn(q, 4.05);
  A(q.firstChild, [{transform: 'rotate(-10deg)'}, {transform: 'rotate(10deg)'}], 4.3, .3, {it: 3, dir: 'alternate', f: 'none', e: 'ease-in-out'});
}

/* 3 · "ในใจลูกค้า" — hesitation list (5.7–9.55) */
{
  const w = widget('left:240px;top:130px;width:600px;height:420px;padding:26px 30px', 5.7, 9.55);
  w.innerHTML = `<span class="minichip"><span class="dot"></span>ในใจลูกค้า</span>`;
  [['ลังเล', 6.3], ['ไม่มั่นใจ', 7.3], ['ซื้อดีไหม?', 8.95]].forEach(([word, t], i) => {
    const row = div(`left:30px;right:30px;top:${110 + i * 96}px;height:80px;border-radius:22px;background:rgba(255,255,255,.05);border:1.5px solid rgba(255,255,255,.08);display:flex;align-items:center;gap:22px;padding:0 22px;opacity:0`, w,
      `<div style="width:52px;height:52px;border-radius:50%;border:2.5px solid rgba(255,255,255,.4);display:flex;align-items:center;justify-content:center;flex:none">${ICON(QMARK, 34, BLUE, 10)}</div><div class="lb"></div>`);
    A(row, [{opacity: 0, transform: 'translateX(50px)'}, {opacity: 1, transform: 'none'}], t - .15, .4, {e: SPRING});
    const k = kinetic(row.querySelector('.lb'), word, 'k', t); k.style.fontSize = '52px';
    draw(row.querySelector('path'), t, .4);
    A(row, [{borderColor: 'rgba(255,255,255,.08)'}, {borderColor: 'rgba(143,211,255,.5)'}], t + .25, .3, {f: 'forwards'});
    sfx('softswish', t - .05, -25, 1 + i * .08);
  });
}

/* 4 · customers dropping off (10.4–13.16) */
{
  const w = widget('left:250px;top:170px;width:580px;height:340px;padding:26px 30px', 10.4, 13.16);
  w.innerHTML = `<span class="minichip"><span class="dot"></span>ลูกค้าที่ทักมา</span>`;
  const ch = svg(520, 200, `<path d="M0 190H520" stroke="rgba(255,255,255,.15)" stroke-width="2"/>
     <path class="ln" d="M10 30 C 120 34, 170 60, 240 90 S 380 170, 500 176" fill="none" stroke="${BLUE}" stroke-width="7" stroke-linecap="round" style="filter:drop-shadow(0 0 8px ${BLUE})"/>
     <circle class="end" cx="500" cy="176" r="10" fill="#fff" opacity="0"/>`, 'left:30px;top:110px', w);
  draw(ch.querySelector('.ln'), 11.45, 1.0);
  A(ch.querySelector('.end'), [{opacity: 0}, {opacity: 1}], 12.4, .2);
  const c = div('right:30px;top:96px;opacity:0', w, `<span class="minichip" style="background:rgba(255,255,255,.06)">เงียบ...</span>`);
  popIn(c, 12.15);
}

/* 5 · SALE tag gets slashed (13.3–15.06) */
{
  const tw = div('left:390px;top:130px;width:300px;height:400px;opacity:0;transform-origin:50% 0', G);
  svg(4, 60, `<path d="M2 0V60" stroke="rgba(255,255,255,.5)" stroke-width="3"/>`, 'left:148px;top:0', tw);
  const tag = div('left:0;top:56px;width:300px;height:300px;padding:84px 34px 0', tw); tag.className = 'mini';
  tag.innerHTML = `<div style="position:absolute;left:128px;top:26px;width:44px;height:44px;border-radius:50%;border:3px solid rgba(255,255,255,.5)"></div>
    <span class="minichip"><span class="dot"></span>SALE</span>
    <div class="old" style="position:relative;margin-top:34px;height:22px;width:220px;border-radius:11px;background:rgba(255,255,255,.4)">
      <svg width="250" height="40" viewBox="0 0 250 40" style="position:absolute;left:-15px;top:-9px;overflow:visible"><path class="cut" d="M0 36L250 4" stroke="${BLUE}" stroke-width="8" stroke-linecap="round" fill="none" style="filter:drop-shadow(0 0 8px ${BLUE})"/></svg></div>
    <div style="margin-top:30px;height:30px;width:220px;border-radius:15px;background:rgba(255,255,255,.08);overflow:hidden"><div class="new" style="height:100%;width:100%;border-radius:15px;background:linear-gradient(90deg,#4E9BFF,${BLUE});transform-origin:left;transform:scaleX(0)"></div></div>`;
  A(tw, [{opacity: 0, transform: 'translateY(-140px) rotate(-14deg)', filter: 'blur(10px)'}, {opacity: 1, transform: 'rotate(6deg)', filter: 'blur(0)', offset: .55}, {opacity: 1, transform: 'rotate(-3deg)', offset: .8}, {opacity: 1, transform: 'rotate(0deg)'}], 13.3, .9, {e: SMOOTH});
  draw(tag.querySelector('.cut'), 14.0, .22);
  A(tag.querySelector('.old'), [{opacity: 1}, {opacity: .45}], 14.15, .2, {f: 'forwards'});
  A(tag.querySelector('.new'), [{transform: 'scaleX(0)'}, {transform: 'scaleX(.55)'}], 14.2, .4, {e: SPRING});
  A(tw, [{transform: 'rotate(0deg) scale(1)'}, {transform: 'rotate(-5deg) scale(1.05)'}, {transform: 'rotate(0deg) scale(1)'}], 14.0, .3, {f: 'none', c: 'add'});
  fadeOut(tw, 14.88);
  sfx('softswish', 13.3, -25, 1.2); sfx('stamp', 14.02, -21);
}

/* 6 · discount ✕ → answer ✓ (16.0–18.98) */
{
  const d = widget('left:0;width:1080px;top:300px;text-align:center', 16.0, 18.1, {card: false});
  d.innerHTML = `<span class="minichip" style="font-size:46px;padding:12px 34px 16px;position:relative">% ส่วนลด
    <svg width="300" height="40" viewBox="0 0 300 40" style="position:absolute;left:-10px;top:24px;overflow:visible"><path class="cut" d="M0 30L300 8" stroke="#fff" stroke-width="7" stroke-linecap="round" fill="none" style="filter:drop-shadow(0 0 8px ${BLUE})"/></svg></span>`;
  draw(d.querySelector('.cut'), 16.55, .22);
  A(d.firstChild, [{opacity: 1}, {opacity: .45}], 16.7, .25, {f: 'forwards'});
  sfx('stamp', 16.58, -22);
  const a = widget('left:0;width:1080px;top:290px;text-align:center', 18.2, 18.98, {card: false});
  a.innerHTML = `<span class="minichip" style="font-size:54px;padding:14px 40px 18px;border-color:rgba(143,211,255,.7);box-shadow:0 0 40px rgba(143,211,255,.35)">${ICON('check', 52, BLUE, 11)}คำตอบ</span>`;
  draw(a.querySelector('path'), 18.3, .35);
}

/* 7 · price keeps dropping → the question remains (19.0–22.98) */
{
  const w = widget('left:290px;top:200px;width:500px;height:240px;padding:26px 30px', 19.0, 21.0);
  w.innerHTML = `<span class="minichip"><span class="dot"></span>ราคา</span>
    <div style="margin-top:46px;height:44px;border-radius:22px;background:rgba(255,255,255,.07);overflow:hidden"><div class="p" style="height:100%;width:100%;border-radius:22px;background:linear-gradient(90deg,#4E9BFF,${BLUE});transform-origin:left"></div></div>
    <div class="ar" style="position:absolute;right:30px;top:22px">${ICON('down', 64, BLUE, 10)}</div>`;
  A(w.querySelector('.p'), [{transform: 'scaleX(1)'}, {transform: 'scaleX(.72)', offset: .25}, {transform: 'scaleX(.72)', offset: .4}, {transform: 'scaleX(.45)', offset: .6}, {transform: 'scaleX(.45)', offset: .75}, {transform: 'scaleX(.2)'}], 19.4, 1.4, {e: INOUT});
  A(w.querySelector('.ar'), [{transform: 'translateY(-8px)'}, {transform: 'translateY(10px)'}], 19.4, .35, {it: 4, dir: 'alternate', f: 'none', e: 'ease-in-out'});
  const q = widget('left:420px;top:200px;width:240px;height:240px;display:flex;align-items:center;justify-content:center', 21.0, 22.98);
  q.style.borderRadius = '50%';
  q.innerHTML = ICON(QMARK, 150, BLUE, 7);
  draw(q.querySelector('path'), 21.1, .5);
  A(q.firstChild, [{transform: 'rotate(-7deg)'}, {transform: 'rotate(7deg)'}], 21.6, .55, {it: 3, dir: 'alternate', f: 'none', e: 'ease-in-out'});
}

/* 8 · quality? / worth it? — two icon chips side by side (23.95–25.98) */
{
  const row = div('left:0;width:1080px;top:300px;display:flex;justify-content:center;gap:28px', G);
  const c1 = iconChip('shield', 'คุณภาพ?', 23.95, row), c2 = iconChip('scale', 'คุ้มไหม?', 25.6, row);
  fadeOut(c1, 25.8); fadeOut(c2, 25.8);
}

/* 9 · product ⋯?⋯ problem (26.2–29.87) */
{
  const mk = (x, d, label, t) => {
    const cd = widget(`left:${x}px;top:200px;width:220px;height:240px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px`, t, 29.87, {sound: false});
    cd.innerHTML = `${ICON(d, 100, '#fff', 5)}<span class="minichip" style="font-size:24px;padding:6px 16px 9px">${label}</span>`;
    draw(cd.querySelector('path'), t + .1, .5);
  };
  mk(220, 'box', 'สินค้าของเรา', 26.2);
  mk(640, 'alert', 'ปัญหาของเขา', 26.4);
  sfx('softswish', 26.17, -25, 1.2);
  const link = svg(200, 20, `<path class="l1" d="M0 10H64" stroke="${BLUE}" stroke-width="5" stroke-linecap="round" stroke-dasharray="2 13"/><path class="l2" d="M200 10H136" stroke="${BLUE}" stroke-width="5" stroke-linecap="round" stroke-dasharray="2 13"/>`, 'left:440px;top:310px;opacity:0', G);
  A(link, [{opacity: 0}, {opacity: 1}], 27.6, .3); fadeOut(link, 29.69);
  const q = div(`left:500px;top:280px;width:80px;height:80px;border-radius:50%;display:flex;align-items:center;justify-content:center;opacity:0;background:rgba(8,12,22,.85);border:3px solid ${BLUE};box-shadow:0 0 26px rgba(143,211,255,.45)`, G, ICON(QMARK, 50, '#fff', 9));
  A(q, [{opacity: 0, transform: 'scale(.4)'}, {opacity: 1, transform: 'none'}], 28.0, .4, {e: SPRING});
  A(q, [{transform: 'scale(1)'}, {transform: 'scale(1.12)'}], 28.5, .5, {it: 2, dir: 'alternate', f: 'none', c: 'add', e: 'ease-in-out'});
  fadeOut(q, 29.69);
}

/* 10 · "ลดราคา" crossed out (35.85–37.48) */
strikeChip('ลดราคา', 35.85, 37.48, 36.75, {top: 300, size: 50, icon: 'tag'});

/* 11 · ending — target locks on (39.6–end) */
{
  const tg = widget('left:360px;top:150px;width:360px;height:360px', 39.6, 43, {card: false});
  tg.innerHTML = `<svg width="360" height="360" viewBox="0 0 360 360" style="overflow:visible">` +
    [160, 110, 60].map((r, i) => `<circle class="r${i}" cx="180" cy="180" r="${r}" fill="${i ? 'none' : 'rgba(8,12,22,.55)'}" stroke="${i === 2 ? BLUE : 'rgba(255,255,255,.5)'}" stroke-width="${i === 2 ? 5 : 3}"/>`).join('') +
    `<path class="x" d="M180 0V70M180 290V360M0 180H70M290 180H360" stroke="rgba(255,255,255,.55)" stroke-width="3" stroke-linecap="round"/></svg>`;
  [0, 1, 2].forEach(i => draw(tg.querySelector('.r' + i), 39.65 + i * .1, .5));
  draw(tg.querySelector('.x'), 39.85, .45);
  const dot = div('left:0;top:0;width:36px;height:36px;margin:-18px 0 0 -18px;border-radius:50%;background:#fff;box-shadow:0 0 28px 8px rgba(143,211,255,.8);opacity:0', G);
  A(dot, [{opacity: 0, transform: 'translate(430px,250px)'}, {opacity: 1, transform: 'translate(470px,400px)', offset: .2}, {opacity: 1, transform: 'translate(640px,250px)', offset: .5},
          {opacity: 1, transform: 'translate(500px,420px)', offset: .78}, {opacity: 1, transform: 'translate(540px,330px)'}], 40.0, 1.0, {e: INOUT});
  ripple(G, 540, 330, 41.0, 2.4); ripple(G, 540, 330, 41.15, 3.2);
  A(tg, [{transform: 'scale(1)'}, {transform: 'scale(1.08)'}, {transform: 'scale(1)'}], 41.0, .35, {f: 'none', c: 'add'});
}
