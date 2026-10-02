/* "กล้าก่อน แล้วค่อยเก่งทีหลัง" (Thai, 93.7 s) — talking-head-overlay style.
   Speaker on screen the whole clip; captions in the lower zone; small widgets in the free space above the head.
   Widget zone: 0–55 s & 64–79 s → y 125–455 · 56–63 s → y 125–390 · 79.5 s → end (speaker close to camera) → y 130–250 chips only. */

/* extra line icons (viewBox 100, stroke) */
Object.assign(IC, {
  lock:  'M32 46V34a18 18 0 0 1 36 0v12M22 46H78V86H22ZM50 60v12',
  play:  'M36 22L80 50L36 78Z',
  book:  'M50 28C40 20 24 20 14 24V80C24 76 40 76 50 84C60 76 76 76 86 80V24C76 20 60 20 50 28ZM50 28V84',
  cap:   'M8 40L50 22L92 40L50 58ZM26 48V68C38 78 62 78 74 68V48M88 42V64',
  shirt: 'M36 14L14 26L6 46L24 52V88H76V52L94 46L86 26L64 14C60 22 40 22 36 14Z',
  clock: 'M50 14a36 36 0 1 1 0 72a36 36 0 1 1 0-72',
  clock2:'M50 14a36 36 0 1 1 0 72a36 36 0 1 1 0-72M50 30V50L64 60',
  bolt:  'M56 8L22 56H48L42 92L78 42H52Z',
  coin:  'M50 16a34 34 0 1 1 0 68a34 34 0 1 1 0-68M60 38C56 32 40 32 40 42C40 52 60 48 60 58C60 68 44 68 40 62M50 26V32M50 68V74',
  work:  'M14 36H86V82H14ZM36 36V24H64V36M14 54H86',
});

/* ===================== CAPTIONS (lower zone) ===================== */
block({t0: 0, t1: .98, lines: [[['ผมคิดว่า', 's', .03], ['มีหลายคน', 'm', .29]], [['มากเลยนะ', 's', .57]]]});
zoom(.29, 1.04, .6);
block({t0: 1.0, t1: 1.98, lines: [[['ที่แบบ', 's', 1.0]], [['ติดกับดัก', 'k', 1.3]]]});
keyHit(1.3); zoom(1.3, 1.08, .12);
block({t0: 2.0, t1: 4.28, lines: [[['รวมถึงตัวผม', 'm', 2.0]], [['เมื่อก่อนด้วย', 's', 3.0]]]});
zoom(2.0, 1.0, .4);
block({t0: 4.3, t1: 6.25, lines: [[['ซึ่งก็คือการที่แบบ', 's', 4.3]], [['เราอยาก', 's', 5.0], ['เริ่ม', 'k', 5.35]], [['ทำอะไร', 'm', 6.0]]]});
keyHit(5.35, -22); zoom(5.35, 1.05, .6);
block({t0: 6.27, t1: 7.93, lines: [[['แล้วเราคิดว่าแบบ', 's', 6.27]], [['ขอเรียนรู้ก่อน', 'k', 7.06]]]});
zoom(6.27, 1.0, .4); keyHit(7.06, -22); zoom(7.06, 1.06, .6);
block({t0: 7.95, t1: 9.98, lines: [[['ขอ', 's', 7.95]], [['หาข้อมูลก่อน', 'k', 8.1]]]});
zoom(7.95, 1.0, .4); keyHit(8.1, -23); zoom(8.1, 1.05, .7);
block({t0: 10.0, t1: 12.98, lines: [[['ขอไปเรียน', 'm', 10.0]], [['ไปดูคลิป', 'k', 12.29]]]});
zoom(10.0, 1.0, .4); keyHit(12.29, -22); zoom(12.29, 1.06, .5);
block({t0: 13.0, t1: 14.73, lines: [[['ไปดูโน่นดูนี่', 'm', 13.0]], [['เอาให้', 's', 14.0], ['พร้อมก่อน', 'k', 14.25]]]});
zoom(13.0, 1.0, .4); keyHit(14.25); zoom(14.25, 1.07, .14);
block({t0: 14.75, t1: 15.98, lines: [[['อะไรอย่างงี้', 's', 14.75]], [['แล้วค่อยเริ่ม', 'k', 15.48]]]});
zoom(14.75, 1.0, .4); keyHit(15.48, -22);
block({t0: 16.0, t1: 19.48, lines: [[['ซึ่งโดยปกติแล้ว', 's', 16.0]], [['แม่งจะ', 's', 18.0], ['ไม่ได้เริ่ม', 'k', 18.3]], [['สักที', 'm', 19.0]]]});
keyHit(18.3, -19); zoom(18.3, 1.09, .12); bloom(18.3, .28); sfx('swell', 17.7, -24); sfx('sub', 18.3, -14);

block({t0: 19.5, t1: 20.98, lines: [[['คือผมเล่า', 's', 19.5]], [['เคสหนึ่งให้ฟัง', 'm', 20.0]]]});
zoom(19.5, 1.0, .5);
block({t0: 21.0, t1: 23.37, lines: [[['ตอนช่วงกำลัง', 's', 21.0]], [['จะเปิด', 's', 22.85], ['ปีหนึ่ง', 'k', 23.05]]]});
keyHit(23.05, -22); zoom(23.05, 1.05, .5);
block({t0: 23.39, t1: 24.98, lines: [[['หรือปีหนึ่งเนี่ยแหละ', 'm', 23.39]], [['ถ้าจำไม่ผิด', 's', 24.0]]]});
zoom(23.39, 1.0, .4);
block({t0: 25.0, t1: 27.53, lines: [[['ผมอยากทำ', 's', 25.0]], [['แบรนด์เสื้อผ้า', 'k', 25.55]], [['แบรนด์หนึ่ง', 's', 27.0]]]});
keyHit(25.55); zoom(25.55, 1.07, .14);
block({t0: 27.55, t1: 29.56, lines: [[['แล้วที่เนี้ย', 's', 27.55], ['คือทุกอย่าง', 'm', 28.0]], [['มันพร้อมแล้ว', 'k', 28.92]]]});
zoom(27.55, 1.0, .4); keyHit(28.92, -22); zoom(28.92, 1.06, .5);
block({t0: 29.58, t1: 30.98, lines: [[['แบบแม่ผมเขาก็', 's', 29.58]], [['มี', 's', 30.0], ['ทุน', 'k', 30.15], ['ให้ตอนนั้น', 's', 30.45]]]});
zoom(29.58, 1.0, .4); keyHit(30.15, -22);
block({t0: 31.0, t1: 32.98, lines: [[['แล้วก็ผมก็มี', 's', 31.0]], [['เวลา', 'k', 31.75], ['ด้วย', 's', 32.2]]]});
keyHit(31.75, -22); zoom(31.75, 1.05, .5);
block({t0: 33.0, t1: 33.98, lines: [[['เพราะผมเพิ่งเข้า', 's', 33.0]], [['ปีหนึ่งใช่มั้ย', 'm', 33.45]]]});
zoom(33.0, 1.0, .4);
block({t0: 34.0, t1: 37.78, lines: [[['ผมไม่ได้ทำงาน', 'm', 34.0]], [['ไม่ได้อะไรมาก', 's', 35.0]], [['แค่เรียน', 'k', 37.25]]]});
keyHit(37.25, -22); zoom(37.25, 1.06, .4);

block({t0: 37.8, t1: 39.98, lines: [[['สิ่งที่ผมตัดสินใจ', 's', 37.8]], [['พลาดที่สุด', 'k', 39.0]], [['เกี่ยวกับเรื่องเนี้ย', 's', 39.55]]]});
zoom(37.8, 1.0, .4); keyHit(39.0, -19); zoom(39.0, 1.08, .12);
block({t0: 40.0, t1: 43.12, lines: [[['ก็คือผมคิดว่า', 's', 40.0]], [['เฮ้ย! เดี๋ยวเรา', 's', 41.0]], [['เรียนก่อน', 'k', 41.85]]]});
zoom(40.0, 1.0, .4); keyHit(41.85); zoom(41.85, 1.06, .5);
block({t0: 43.14, t1: 43.98, lines: [[['เราเรียน', 's', 43.14]], [['มหาวิทยาลัยก่อน', 'k', 43.35]]]});
zoom(43.14, 1.0, .3); keyHit(43.35, -23);
block({t0: 44.0, t1: 45.98, lines: [[['ผมเรียนคณะ', 's', 44.0]], [['บริหารธุรกิจ', 'm', 45.0], ['ใช่ป่ะ', 's', 45.35]], [['ผมก็คิดว่าแบบ', 's', 45.58]]]});
block({t0: 46.0, t1: 48.98, lines: [[['เดี๋ยวเรา', 's', 46.0], ['เรียนจบก่อน', 'm', 46.3]], [['เรียน 4 ปีจบมา', 's', 47.0]], [['ค่อยทำ', 'k', 48.15]]]});
keyHit(48.15); zoom(48.15, 1.07, .14);
block({t0: 49.0, t1: 50.98, lines: [[['เนี่ยคือแบบ', 's', 49.0]], [['เสียดายมาก', 'k', 49.6, 150]]]});
zoom(49.0, 1.0, .4); keyHit(49.6, -19); zoom(49.6, 1.09, .12); bloom(49.6, .3); sfx('swell', 49.0, -24); sfx('sub', 49.6, -14);
block({t0: 51.0, t1: 51.98, lines: [[['แล้ว', 's', 51.0], ['พลาดมาก', 'k', 51.2], ['นะ', 's', 51.7]]]});
zoom(51.0, 1.0, .3); keyHit(51.2, -22);
block({t0: 52.0, t1: 52.98, lines: [[['สุดท้ายผมก็', 's', 52.0]], [['ไม่ได้ทำ', 'k', 52.4]]]});
keyHit(52.4, -22); zoom(52.4, 1.07, .14);

block({t0: 53.0, t1: 54.98, lines: [[['จะบอกว่า', 's', 53.0]], [['เวลาเรามี', 's', 53.65], ['ไอเดีย', 'k', 54.1], ['อะไร', 's', 54.55]]]});
zoom(53.0, 1.0, .4); keyHit(54.1, -22);
block({t0: 55.0, t1: 56.98, lines: [[['หรืออยากจะ', 's', 55.0], ['ทำอะไร', 'm', 55.4]], [['โอเคแหละ', 's', 56.0]]]});
block({t0: 57.0, t1: 57.98, lines: [[['การหาความรู้', 'm', 57.0]], [['มันก็เป็นเรื่องที่ดี', 's', 57.38]]]});
block({t0: 58.0, t1: 60.18, lines: [[['แต่ว่าหาแค่', 's', 58.0]], [['พอประมาณ', 'k', 58.75]], [['ก็พอ', 'm', 60.0]]]});
keyHit(58.75); zoom(58.75, 1.06, .5);
block({t0: 60.2, t1: 63.34, lines: [[['แล้วก็ไปเรียนรู้', 's', 60.2]], [['จากการ', 's', 61.0], ['ลงมือทำ', 'k', 61.35], ['แทน', 's', 62.1]], [['นึกออกมั้ย', 's', 63.0]]]});
zoom(60.2, 1.0, .4); keyHit(61.35, -19); zoom(61.35, 1.08, .12);
block({t0: 63.36, t1: 66.6, lines: [[['ไม่ต้องหาข้อมูลแบบ', 's', 63.36]], [['โอ้โห', 'm', 64.0], ['เรียนรู้ทุกอย่าง', 'm', 64.55]], [['เก่งทุกอย่าง', 'k', 65.65]]]});
zoom(63.36, 1.0, .4); keyHit(65.65, -22); zoom(65.65, 1.05, .5);
block({t0: 66.62, t1: 69.31, lines: [[['คือ', 's', 66.62], ['กล้าก่อน', 'k', 66.8, 150]], [['แล้วค่อย', 's', 67.6], ['เก่งทีหลัง', 'k', 67.95, 150]]]});
zoom(66.62, 1.0, .3); keyHit(66.8, -19); zoom(66.8, 1.08, .12); bloom(66.8, .32); sfx('swell', 66.2, -24); sfx('sub', 66.8, -14);
keyHit(67.95, -20); zoom(67.95, 1.1, .12); sfx('sub', 67.95, -16);
block({t0: 69.33, t1: 70.34, lines: [[['ถ้าเรามี', 's', 69.33], ['ความกล้า', 'k', 69.6]], [['ที่จะเริ่มทำ', 'm', 70.0]]]});
zoom(69.33, 1.0, .4); keyHit(69.6, -22);
block({t0: 70.36, t1: 72.07, lines: [[['แต่เราเรียนรู้ไปเรื่อย ๆ', 'm', 70.36]], [['เดี๋ยวมัน', 's', 71.0], ['เก่งเอง', 'k', 71.35]]]});
keyHit(71.35); zoom(71.35, 1.07, .14);
block({t0: 72.09, t1: 74.98, lines: [[['เพราะว่าถ้าเรามัวแต่', 's', 72.09]], [['รอเวลา', 'k', 73.1]], [['มันก็ไม่ได้เริ่มสักที', 'm', 73.76]]]});
zoom(72.09, 1.0, .4); keyHit(73.1, -21); zoom(73.1, 1.05, .6);
block({t0: 75.0, t1: 75.98, lines: [[['นึกออกมั้ย', 's', 75.0]], [['สุดท้ายแล้วผมก็', 's', 75.4]]]});
zoom(75.0, 1.0, .4);
block({t0: 76.0, t1: 77.98, lines: [[['ไม่ได้ทำ', 'k', 76.0]], [['แบรนด์เสื้อผ้า', 'm', 76.5]], [['ที่ผมอยากจะทำ', 's', 77.13]]]});
keyHit(76.0, -21); zoom(76.0, 1.06, .5);
block({t0: 78.0, t1: 79.28, lines: [[['ตอนนั้นนะครับ', 'm', 78.0]]]});
zoom(78.0, 1.0, .5);

block({t0: 79.3, t1: 80.95, lines: [[['ก็นั่นแหละทุกคน', 's', 79.3]], [['ถ้าอยากทำอะไร', 'm', 80.2]], [['ก็ทำเลย', 'k', 80.7]]]});
keyHit(80.7, -19); zoom(80.7, 1.06, .5);
block({t0: 80.97, t1: 82.98, lines: [[['เราเริ่มอะไรได้', 'm', 80.97]], [['แล้วก็', 's', 82.0], ['เริ่มก่อน', 'k', 82.25]]]});
zoom(80.97, 1.0, .4); keyHit(82.25, -21); zoom(82.25, 1.05, .5);
block({t0: 83.0, t1: 84.81, lines: [[['ไม่ต้องรอ', 's', 83.0], ['ใคร', 'k', 83.45]]]});
zoom(83.0, 1.0, .4); keyHit(83.45, -22);
block({t0: 84.83, t1: 86.98, lines: [[['ไม่ต้องรอ', 's', 84.83]], [['ให้มัน', 's', 86.0], ['เพอร์เฟกต์', 'k', 86.25]]]});
keyHit(86.25, -22); zoom(86.25, 1.05, .5);
block({t0: 87.0, t1: 87.98, lines: [[['ไม่ต้องรอแบบ', 's', 87.0]], [['รู้เยอะ', 'k', 87.35]]]});
zoom(87.0, 1.0, .3); keyHit(87.35, -22);
block({t0: 88.0, t1: 89.98, lines: [[['เราเรียนรู้', 'm', 88.0]], [['ไปพร้อมกับ', 's', 89.0], ['ทำ', 'k', 89.4], ['ดีกว่า', 'm', 89.6]]]});
keyHit(89.4, -20); zoom(89.4, 1.07, .14);
block({t0: 90.0, t1: 95, lines: [[['อันนี้ก็เป็นสิ่งที่', 's', 90.0]], [['ผมอยากเอามา', 's', 91.0], ['แชร์', 'k', 91.4]], [['ให้ทุกคนฟังนะครับ', 'm', 92.0]]]});
zoom(90.0, 1.0, .5); keyHit(91.4, -23);

/* ===================== MINI MOTION GRAPHICS (above the head) ===================== */

/* small helpers for this clip */
const roundIcon = (name, x, y, size, t0, t1, {color = '#fff', sw = 5, wobble = false} = {}) => {
  const w = widget(`left:${x}px;top:${y}px;width:${size}px;height:${size}px;display:flex;align-items:center;justify-content:center`, t0, t1, {round: true});
  w.innerHTML = ICON(name, size * .55, color, sw);
  draw(w.querySelector('path'), t0 + .08, .5);
  if (wobble) A(w.firstChild, [{transform: 'rotate(-8deg)'}, {transform: 'rotate(8deg)'}], t0 + .6, .32, {it: 5, dir: 'alternate', f: 'none', e: 'ease-in-out'});
  return w;
};
const chipHTML = (label, size = 30, extra = '') => `<span class="minichip" style="font-size:${size}px;${extra}">${label}</span>`;

/* 1 · "ติดกับดัก" — a lock snaps shut + "ตัวผมเมื่อก่อน" (1.15–4.28) */
{
  const w = widget('left:270px;top:170px;width:540px;height:230px;padding:30px 36px;display:flex;align-items:center;gap:34px', 1.15, 4.28);
  w.innerHTML = `<div class="lk" style="position:relative;width:150px;height:150px;flex:none">${ICON('M22 46H78V86H22ZM50 60v12', 150, '#fff', 5)}
      <div class="sh" style="position:absolute;left:0;top:0">${ICON('M32 46V34a18 18 0 0 1 36 0v12', 150, BLUE, 6)}</div></div>
    <div style="position:relative;display:flex;flex-direction:column;gap:18px"><div class="ttl"></div></div>`;
  draw(w.querySelectorAll('path')[0], 1.2, .45);
  const sh = w.querySelector('.sh');
  A(sh, [{transform: 'translateY(-26px)'}, {transform: 'translateY(-26px)', offset: .6}, {transform: 'translateY(0)'}], 1.2, .55, {e: 'cubic-bezier(.5,0,.9,.6)'});
  A(w.querySelector('.lk'), [{transform: 'scale(1)'}, {transform: 'scale(1.08)'}, {transform: 'scale(1)'}], 1.75, .25, {f: 'none'});
  sfx('thud', 1.75, -24);
  const k = kinetic(w.querySelector('.ttl'), 'กับดัก', 'k', 1.35); k.style.fontSize = '64px';
  const c = div('position:relative;opacity:0', w.lastElementChild, chipHTML('<span class="dot"></span>ตัวผมเมื่อก่อน', 28));
  popIn(c, 2.05);
}

/* 2 · "อยากเริ่ม" — play button (5.0–6.25) */
{
  const w = roundIcon('play', 440, 210, 200, 5.0, 6.25, {color: BLUE, sw: 6});
  A(w, [{boxShadow: '0 0 0 rgba(143,211,255,0)'}, {boxShadow: '0 0 50px rgba(143,211,255,.55)'}], 5.4, .45, {it: 2, dir: 'alternate', f: 'none'});
}

/* 3 · "ขอ...ก่อน" — list that keeps growing (7.0–11.98) */
{
  const w = widget('left:240px;top:125px;width:600px;height:330px;padding:24px 30px', 7.0, 11.98);
  w.innerHTML = chipHTML('<span class="dot"></span>ขอ...ก่อน');
  [['book', 'เรียนรู้', 7.06], ['search', 'หาข้อมูล', 8.1], ['cap', 'ไปเรียน', 10.05]].forEach(([ic, word, t], i) => {
    const row = div(`left:30px;right:30px;top:${88 + i * 78}px;height:66px;border-radius:20px;background:rgba(255,255,255,.05);border:1.5px solid rgba(255,255,255,.08);display:flex;align-items:center;gap:22px;padding:0 20px;opacity:0`, w,
      `${ICON(ic, 46, BLUE, 7)}<div class="lb"></div>`);
    A(row, [{opacity: 0, transform: 'translateX(50px)'}, {opacity: 1, transform: 'none'}], t - .12, .4, {e: SPRING});
    const k = kinetic(row.querySelector('.lb'), word, 'k', t); k.style.fontSize = '44px';
    draw(row.querySelector('path'), t, .4);
    if (i) sfx('softswish', t - .05, -25, 1 + i * .08);
  });
}

/* 4 · "ไปดูคลิป ไปดูโน่นดูนี่" — video windows pile up (12.2–13.98) */
{
  const holder = widget('left:0;top:150px;width:1080px;height:300px', 12.2, 13.98, {card: false, sound: false});
  [[260, 205, -7, 12.25], [430, 165, 0, 12.95], [600, 205, 7, 13.3]].forEach(([x, y, r, t]) => {
    const v = div(`left:${x}px;top:${y - 150}px;width:220px;height:150px;transform:rotate(${r}deg);opacity:0`, holder);
    const card = div('left:0;top:0;width:220px;height:150px;display:flex;align-items:center;justify-content:center', v, ICON('play', 54, '#fff', 7));
    card.className = 'mini'; card.style.borderRadius = '22px';
    div('left:18px;right:18px;bottom:16px;height:6px;border-radius:3px;background:rgba(255,255,255,.15);overflow:hidden', card,
      `<div class="pg" style="height:100%;width:100%;background:${BLUE};transform-origin:left;transform:scaleX(0)"></div>`);
    A(v, [{opacity: 0, transform: `rotate(${r}deg) translateY(40px) scale(.7)`, filter: 'blur(10px)'}, {opacity: 1, transform: `rotate(${r}deg)`, filter: 'blur(0)'}], t, .45, {e: SPRING});
    A(card.querySelector('.pg'), [{transform: 'scaleX(0)'}, {transform: 'scaleX(1)'}], t + .2, 1.6, {e: 'linear'});
    sfx('softswish', t - .03, -25, 1.1 + (r + 7) * .01);
  });
}

/* 5 · "เอาให้พร้อมก่อน" — readiness bar crawls and stalls (14.0–15.98) */
{
  const w = widget('left:270px;top:220px;width:540px;height:190px;padding:24px 30px', 14.0, 15.98);
  w.innerHTML = chipHTML('<span class="dot"></span>ความพร้อม') +
    `<div style="margin-top:34px;height:40px;border-radius:20px;background:rgba(255,255,255,.07);overflow:hidden"><div class="p" style="height:100%;width:100%;border-radius:20px;background:linear-gradient(90deg,#4E9BFF,${BLUE});transform-origin:left;transform:scaleX(0)"></div></div>`;
  const wait = div('right:30px;top:26px;opacity:0', w, chipHTML('ยังไม่พร้อม...', 26, 'background:rgba(255,255,255,.06)'));
  A(w.querySelector('.p'), [{transform: 'scaleX(0)'}, {transform: 'scaleX(.6)', offset: .4}, {transform: 'scaleX(.82)', offset: .75}, {transform: 'scaleX(.9)'}], 14.15, 1.25, {e: 'ease-out'});
  A(w.querySelector('.p'), [{opacity: 1}, {opacity: .45}], 15.4, .25, {it: 2, dir: 'alternate', f: 'none'});
  popIn(wait, 15.45);
}

/* 6 · "ไม่ได้เริ่ม" — start chip crossed out (17.7–19.48) */
strikeChip('เริ่ม', 17.7, 19.48, 18.4, {top: 260, size: 56, icon: 'play'});

/* 7 · "ปีหนึ่ง" (22.75–24.98) */
{
  const w = widget('left:400px;top:160px;width:280px;height:270px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px', 22.75, 24.98);
  w.innerHTML = ICON('cap', 130, '#fff', 5) + chipHTML('<span class="dot"></span>ปี 1', 32);
  draw(w.querySelector('path'), 22.85, .5);
}

/* 8 · "แบรนด์เสื้อผ้า" (25.35–27.53) */
{
  const w = widget('left:370px;top:150px;width:340px;height:290px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px', 25.35, 27.53);
  w.innerHTML = ICON('shirt', 140, '#fff', 4.5) + chipHTML('<span class="dot"></span>แบรนด์เสื้อผ้า', 30);
  draw(w.querySelector('path'), 25.45, .7);
  A(w.querySelector('svg'), [{filter: 'drop-shadow(0 0 0 rgba(143,211,255,0))'}, {filter: `drop-shadow(0 0 14px ${BLUE})`}], 26.1, .5, {f: 'forwards'});
}

/* 9 · "ทุกอย่างพร้อมแล้ว" — ทุน ✓ / เวลา ✓ (29.4–33.98) */
{
  const w = widget('left:260px;top:140px;width:560px;height:262px;padding:24px 30px', 29.4, 33.98);
  w.innerHTML = chipHTML('<span class="dot"></span>ทุกอย่างพร้อม');
  [['coin', 'ทุน', 30.15], ['clock2', 'เวลา', 31.75]].forEach(([ic, word, t], i) => {
    const row = div(`left:30px;right:30px;top:${96 + i * 88}px;height:72px;border-radius:20px;background:rgba(255,255,255,.05);border:1.5px solid rgba(255,255,255,.08);display:flex;align-items:center;gap:22px;padding:0 22px;opacity:0`, w,
      `${ICON(ic, 48, '#fff', 6)}<div class="lb" style="flex:1"></div><div class="ok" style="width:52px;height:52px;border-radius:50%;border:2.5px solid ${BLUE};display:flex;align-items:center;justify-content:center;opacity:0">${ICON('check', 34, BLUE, 11)}</div>`);
    A(row, [{opacity: 0, transform: 'translateX(50px)'}, {opacity: 1, transform: 'none'}], t - .15, .4, {e: SPRING});
    const k = kinetic(row.querySelector('.lb'), word, 'k', t); k.style.fontSize = '48px';
    draw(row.querySelector('path'), t - .05, .45);
    const ok = row.querySelector('.ok');
    A(ok, [{opacity: 0, transform: 'scale(.5)'}, {opacity: 1, transform: 'none'}], t + .35, .35, {e: SPRING});
    draw(ok.querySelector('path'), t + .4, .3);
    A(row, [{borderColor: 'rgba(255,255,255,.08)'}, {borderColor: 'rgba(143,211,255,.5)'}], t + .4, .3, {f: 'forwards'});
    sfx('softswish', t - .05, -25, 1 + i * .08);
  });
}

/* 10 · "ไม่ได้ทำงาน · แค่เรียน" — two icon chips (34.05–38.6) */
{
  const row = div('left:0;width:1080px;top:290px;display:flex;justify-content:center;gap:26px', G);
  const c1 = iconChip('work', 'ไม่ได้ทำงาน', 34.05, row, {size: 38});
  const cut = svg(70, 70, `<path d="M8 8L62 62" stroke="#fff" stroke-width="7" stroke-linecap="round"/>`, 'left:34px;top:4px', c1);
  draw(cut.querySelector('path'), 34.6, .25);
  const c2 = iconChip('book', 'แค่เรียน', 37.2, row, {size: 38});
  fadeOut(c1, 38.42); fadeOut(c2, 38.42);
}

/* 11 · "พลาดที่สุด" — warning (38.85–40.98) */
{
  const w = roundIcon('alert', 430, 190, 220, 38.85, 40.98, {color: '#fff', sw: 5.5, wobble: true});
  A(w, [{borderColor: 'rgba(255,255,255,.16)'}, {borderColor: BLUE}], 39.0, .3, {f: 'forwards'});
}

/* 12 · "เรียนก่อน" — university → BBA (41.4–45.98) */
{
  const w = widget('left:250px;top:150px;width:580px;height:290px;padding:28px 34px', 41.4, 45.98);
  w.innerHTML = `<div style="display:flex;align-items:center;gap:28px">${ICON('cap', 110, '#fff', 5)}<div class="ttl"></div></div>
    <div class="chips" style="position:relative;display:flex;gap:16px;margin-top:26px"></div>`;
  draw(w.querySelector('path'), 41.5, .5);
  const k = kinetic(w.querySelector('.ttl'), 'เรียนก่อน', 'k', 41.85); k.style.fontSize = '56px';
  const chips = w.querySelector('.chips');
  [['มหาวิทยาลัย', 43.35], ['บริหารธุรกิจ', 45.0]].forEach(([l, t]) => {
    const c = div('position:relative;opacity:0', chips, chipHTML(`<span class="dot"></span>${l}`, 30));
    popIn(c, t); sfx('softswish', t - .03, -26, 1.15);
  });
}

/* 13 · "เรียน 4 ปีจบมา ค่อยทำ" — 4 year blocks fill, then the plan (46.0–48.98) */
{
  const w = widget('left:220px;top:170px;width:640px;height:240px;padding:24px 30px', 46.0, 48.98);
  w.innerHTML = chipHTML('<span class="dot"></span>เรียนจบก่อน');
  const bar = div('left:30px;top:110px;display:flex;gap:10px', w);
  [0, 1, 2, 3].forEach(i => {
    const s = div('position:relative;width:96px;height:70px;border-radius:16px;background:rgba(255,255,255,.07);overflow:hidden', bar,
      `<div class="f" style="position:absolute;inset:0;background:linear-gradient(90deg,#4E9BFF,${BLUE});transform-origin:left;transform:scaleX(0)"></div>
       <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:BodyFont;font-size:28px;color:#fff">ปี ${i + 1}</div>`);
    A(s.querySelector('.f'), [{transform: 'scaleX(0)'}, {transform: 'scaleX(1)'}], 47.0 + i * .28, .26, {e: 'ease-out'});
    sfx('tick', 47.05 + i * .28, -30, 1 + i * .1);
  });
  const arr = div('left:452px;top:120px;opacity:0', w, ICON('M8 50H80M58 28L82 50L58 72', 50, BLUE, 9));
  const end = div('left:500px;top:118px;opacity:0', w, chipHTML('ค่อยทำ', 30, `border-color:${BLUE}`));
  A(arr, [{opacity: 0, transform: 'translateX(-14px)'}, {opacity: 1, transform: 'none'}], 48.05, .3);
  popIn(end, 48.15);
}

/* 14 · "สุดท้ายผมก็ไม่ได้ทำ" — the brand gets crossed out (51.95–53.0) */
strikeChip('แบรนด์เสื้อผ้า', 51.95, 53.0, 52.42, {top: 270, size: 46, icon: 'shirt'});

/* 15 · "ไอเดีย" — bulb (53.65–56.98) */
{
  const w = roundIcon('bulb', 430, 180, 220, 53.65, 56.98);
  A(w.querySelector('svg'), [{filter: 'drop-shadow(0 0 0 rgba(143,211,255,0))'}, {filter: `drop-shadow(0 0 18px ${BLUE})`}], 54.1, .4, {f: 'forwards'});
  A(w.querySelector('path'), [{stroke: '#fff'}, {stroke: BLUE}], 54.1, .4, {f: 'forwards'});
}

/* 16 · "หาแค่พอประมาณก็พอ" — knowledge bar stops halfway ✓ (57.0–60.18) — zone ≤ y 390 here */
{
  const w = widget('left:270px;top:140px;width:540px;height:210px;padding:24px 30px', 57.0, 60.18);
  w.innerHTML = chipHTML('<span class="dot"></span>ความรู้') +
    `<div style="position:relative;margin-top:40px;height:40px;border-radius:20px;background:rgba(255,255,255,.07)"><div class="p" style="height:100%;width:100%;border-radius:20px;background:linear-gradient(90deg,#4E9BFF,${BLUE});transform-origin:left;transform:scaleX(0)"></div>
       <div class="mk" style="position:absolute;left:50%;top:-12px;width:4px;height:64px;border-radius:2px;background:#fff;opacity:0"></div></div>`;
  const lab = div('left:220px;top:22px;opacity:0', w, chipHTML('พอประมาณ', 26, 'background:rgba(255,255,255,.06)'));
  const ok = div(`right:30px;top:20px;width:56px;height:56px;border-radius:50%;border:2.5px solid ${BLUE};display:flex;align-items:center;justify-content:center;opacity:0`, w, ICON('check', 36, BLUE, 11));
  A(w.querySelector('.p'), [{transform: 'scaleX(0)'}, {transform: 'scaleX(.5)'}], 58.3, .9, {e: SMOOTH});
  A(w.querySelector('.mk'), [{opacity: 0}, {opacity: 1}], 58.6, .2);
  popIn(lab, 58.75);
  A(ok, [{opacity: 0, transform: 'scale(.5)'}, {opacity: 1, transform: 'none'}], 59.95, .3, {e: SPRING});
  draw(ok.querySelector('path'), 60.0, .25);
}

/* 17 · "เรียนรู้จากการลงมือทำ" — answer chip (60.95–63.34) */
{
  const a = widget('left:0;width:1080px;top:230px;text-align:center', 60.95, 63.34, {card: false});
  a.innerHTML = `<span class="minichip" style="font-size:54px;padding:14px 40px 18px;background:rgba(8,12,22,.75);border-color:rgba(143,211,255,.7);box-shadow:0 0 40px rgba(143,211,255,.35)">${ICON('check', 52, BLUE, 11)}ลงมือทำ</span>`;
  draw(a.querySelector('path'), 61.35, .35);
}

/* 18 · "ไม่ต้องรู้ทุกอย่าง" (64.4–66.6) */
strikeChip('รู้ทุกอย่าง', 64.4, 66.6, 66.0, {top: 270, size: 48, icon: 'book'});

/* 19 · "กล้าก่อน → เก่งทีหลัง" (66.62–69.31) */
{
  const mk = (x, ic, label, t) => {
    const cd = widget(`left:${x}px;top:160px;width:240px;height:260px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px`, t, 69.31, {sound: false});
    cd.innerHTML = `${ICON(ic, 104, '#fff', 5)}${chipHTML(label, 28, `border-color:${BLUE}`)}`;
    draw(cd.querySelector('path'), t + .08, .45);
    A(cd.querySelector('svg'), [{filter: 'drop-shadow(0 0 0 rgba(143,211,255,0))'}, {filter: `drop-shadow(0 0 14px ${BLUE})`}], t + .45, .4, {f: 'forwards'});
    sfx('softswish', t - .03, -24, 1.15);
    return cd;
  };
  mk(210, 'bolt', 'กล้าก่อน', 66.7);
  mk(630, 'up', 'เก่งทีหลัง', 67.85);
  const ar = svg(150, 40, `<path d="M8 20H130M108 4L134 20L108 36" stroke="${BLUE}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" fill="none" style="filter:drop-shadow(0 0 8px ${BLUE})"/>`, 'left:465px;top:270px', G);
  draw(ar.querySelector('path'), 67.45, .4);
  fadeOut(ar, 69.13);
}

/* 20 · "เรียนรู้ไปเรื่อย ๆ เดี๋ยวมันเก่งเอง" — rising line (69.9–72.07) */
{
  const w = widget('left:250px;top:150px;width:580px;height:290px;padding:24px 30px', 69.9, 72.07);
  w.innerHTML = chipHTML('<span class="dot"></span>เรียนรู้ไปเรื่อย ๆ');
  const ch = svg(520, 170, `<path d="M0 166H520" stroke="rgba(255,255,255,.15)" stroke-width="2"/>
     <path class="ln" d="M10 156 C 90 150, 130 128, 200 118 S 320 86, 380 58 S 470 20, 505 14" fill="none" stroke="${BLUE}" stroke-width="7" stroke-linecap="round" style="filter:drop-shadow(0 0 8px ${BLUE})"/>
     <circle class="end" cx="505" cy="14" r="11" fill="#fff" opacity="0"/>`, 'left:30px;top:100px', w);
  draw(ch.querySelector('.ln'), 70.36, .95);
  A(ch.querySelector('.end'), [{opacity: 0}, {opacity: 1}], 71.3, .2);
  const c = div('right:30px;top:22px;opacity:0', w, chipHTML(ICON('up', 28, BLUE, 10) + 'เก่งเอง', 28, `border-color:${BLUE}`));
  popIn(c, 71.35);
}

/* 21 · "มัวแต่รอเวลา" — clock spinning (72.6–74.98) */
{
  const w = roundIcon('clock', 430, 190, 220, 72.6, 74.98);
  const hands = svg(220, 220, `<path d="M110 110V62" stroke="${BLUE}" stroke-width="7" stroke-linecap="round"/><path d="M110 110L140 128" stroke="#fff" stroke-width="6" stroke-linecap="round"/><circle cx="110" cy="110" r="7" fill="#fff"/>`, 'left:0;top:0', w);
  A(hands.querySelector('path'), [{transform: 'rotate(0deg)'}, {transform: 'rotate(1080deg)'}], 72.7, 2.3, {e: 'linear', f: 'none'});
  hands.querySelector('path').style.transformOrigin = '110px 110px';
}

/* ---- from ~79.5 s the speaker is close to camera: only slim chips at y 130–250 ---- */

/* 22 · "ก็ทำเลย" (80.55–82.98) */
{
  const a = widget('left:0;width:1080px;top:140px;text-align:center', 80.55, 82.98, {card: false});
  a.innerHTML = `<span class="minichip" style="font-size:48px;padding:12px 36px 16px;background:rgba(8,12,22,.75);border-color:rgba(143,211,255,.7);box-shadow:0 0 36px rgba(143,211,255,.35)">${ICON('play', 46, BLUE, 9)}ทำเลย</span>`;
  draw(a.querySelector('path'), 80.65, .35);
}

/* 23 · "ไม่ต้องรอ ใคร / เพอร์เฟกต์ / รู้เยอะ" — chips crossed out one by one (83.3–87.98) */
{
  const row = div('left:0;width:1080px;top:150px;display:flex;justify-content:center;gap:22px', G);
  [['รอใคร', 83.3, 83.85], ['เพอร์เฟกต์', 86.1, 86.6], ['รู้เยอะ', 87.2, 87.6]].forEach(([l, t, tc]) => {
    const c = div('position:relative;opacity:0', row, `<span class="minichip" style="font-size:38px;padding:10px 28px 13px;position:relative;background:rgba(8,12,22,.75)">${l}
      <svg viewBox="0 0 100 20" preserveAspectRatio="none" style="position:absolute;left:6%;top:40%;width:88%;height:18px;overflow:visible"><path class="cut" d="M0 16L100 4" stroke="${BLUE}" stroke-width="6" vector-effect="non-scaling-stroke" stroke-linecap="round" fill="none" style="filter:drop-shadow(0 0 8px ${BLUE})"/></svg></span>`);
    A(c, [{opacity: 0, transform: 'translateY(30px) scale(.7)', filter: 'blur(10px)'}, {opacity: 1, transform: 'none', filter: 'blur(0)'}], t, .45, {e: SPRING});
    sfx('softswish', t - .03, -25, 1.2);
    draw(c.querySelector('.cut'), tc, .2);
    A(c.firstChild, [{opacity: 1}, {opacity: .5}], tc + .12, .25, {f: 'forwards'});
    sfx('stamp', tc + .02, -23);
    fadeOut(c, 87.8);
  });
}

/* 24 · "เรียนรู้ + ทำ" (88.0–89.98) */
{
  const row = div('left:0;width:1080px;top:150px;display:flex;justify-content:center;align-items:center;gap:20px', G);
  const c1 = iconChip('book', 'เรียนรู้', 88.0, row, {size: 38});
  const plus = div('position:relative;opacity:0;font-family:KeyFont;font-size:54px;color:' + BLUE, row, '+');
  const c2 = iconChip('play', 'ทำ', 89.3, row, {size: 38});
  A(plus, [{opacity: 0, transform: 'scale(.4)'}, {opacity: 1, transform: 'none'}], 89.1, .3, {e: SPRING});
  [c1, plus, c2].forEach(e => fadeOut(e, 89.8));
}
