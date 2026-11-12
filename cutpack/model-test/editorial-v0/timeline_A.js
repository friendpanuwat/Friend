/* "เกษียณ / รวย คืออะไร" — Thai, 22.0 s talking head + HOLD 1.0 → 23.0 s. No B-roll → motion graphics (Flat × Glow).
   Story of the cards: work → salary (C1) · work stops → income bars fall to zero (C3) · savings gauge runs out in 1/2/3 years (C4)
   · "not rich" struck out (C5) · lives until the end without working (F1) · money keeps dropping into the piggy bank while on the sofa (C6). */
const N = {color: NAVY}, NS = s => ({color: NAVY, size: s});
ICONS['briefcase'] = '<path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/>';
ICONS['sofa'] = '<path d="M20 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3"/><path d="M2 16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v1.5a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5V11a2 2 0 0 0-4 0z"/><path d="M4 18v2"/><path d="M20 18v2"/><path d="M12 4v9"/>';
ICONS['infinity'] = '<path d="M12 12c-2-2.67-4-4-6-4a4 4 0 1 0 0 8c2 0 4-1.33 6-4Zm0 0c2 2.67 4 4 6 4a4 4 0 0 0 0-8c-2 0-4 1.33-6 4Z"/>';
ICONS['piggy-bank'] = '<path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.7-1 2-2h2v-4h-2c0-1-.5-1.5-1-2V5z"/><path d="M2 9v1c0 1.1.9 2 2 2h1"/><path d="M16 11h.01"/>';

cards([[2.15, 4.15], [7.15, 9.15], [11.15, 13.15], [13.15, 14.15], [17.15, 19.15], [20.15, 23.0]]);

/* ---------- camera: hard punch-ins on key words ---------- */
for (const [t, z] of [[0, 1.08], [1.07, 1], [4.15, 1], [5.55, 1.1], [6.15, 1], [9.15, 1], [9.55, 1.1], [10.15, 1], [10.58, 1.12],
  [14.15, 1], [15.15, 1], [16.30, 1.12], [17.13, 1], [19.15, 1.14], [20.13, 1]]) zoom(t, z);

/* ---------- A-roll captions (chest level; chin ≈ y 1100) ---------- */
const TOP = 1180;
cap({t0: 0.00, t1: 2.13, top: TOP, lines: [[['เกษียณ', 'i', 0.0, {size: 170}]], [['คือ', 'l', 0.60], ['ถ้าวันเนี่ย', 'l', 1.07]]]});
keyHit(0.04);
cap({t0: 4.15, t1: 6.13, top: TOP, lines: [[['หรือเงิน', 'l', 4.15], ['ที่คุณต้อง', 'l', 5.15]], [['เสียสละ', 'hl', 5.55]]]});
keyHit(5.55);
cap({t0: 6.15, t1: 7.13, top: TOP, lines: [[['เวลา', 'i', 6.15]], [['ไปหามา', 'l', 6.60]]]});
keyHit(6.15);
cap({t0: 9.15, t1: 10.13, top: TOP, lines: [[['คุณอยู่ได้', 'l', 9.15]], [['กี่เดือน?', 'i', 9.55]]]});
keyHit(9.55);
cap({t0: 10.15, t1: 11.13, top: TOP, lines: [[['ถ้าวันนี้', 'l', 10.15]], [['คำตอบ', 'k', 10.58]], [['ของคุณคือ', 'l', 10.85]]]});
keyHit(10.58);
cap({t0: 14.15, t1: 15.13, top: TOP, lines: [[['แต่ถ้าคุณ', 'l', 14.15]], [['บอกว่า', 'm', 14.55]]]});
cap({t0: 15.15, t1: 17.13, top: TOP, lines: [[['ถ้าวันนี้', 'l', 15.15], ['ผม', 'l', 16.07]], [['ไม่ทำงาน', 'hl', 16.30]], [['เลย', 'l', 16.85]]]});
keyHit(16.30);
cap({t0: 19.15, t1: 20.13, top: TOP, lines: [[['วันตาย', 'i', 19.15, {size: 180}]]]});
keyHit(19.15);

/* ---------- C1 dark · work → salary: a banknote travels from the briefcase into the wallet on "เงินเดือน" ---------- */
{
  const c = card(2.15, 4.15);
  mood(c, {seed: 0});
  tile(c, 'briefcase', 2.22, 'left:110px;top:560px', {size: 280, bg: '#fff', color: NAVY});
  tile(c, 'clock', 2.40, 'left:70px;top:350px', {size: 150, bg: 'glass'});
  const wal = tile(c, 'wallet', 2.32, 'left:690px;top:560px', {size: 280, bg: '#fff', color: NAVY});
  const ln = svg(240, 20, '<path d="M0 10 H240" stroke="rgba(255,255,255,.45)" stroke-width="8" stroke-linecap="round" stroke-dasharray="4 24"/>', 'left:420px;top:690px', c);
  A(ln, [{opacity: 0}, {opacity: 1}], 2.55, .3);
  const [o, chip] = holder(c, 'left:300px;top:640px');
  chip.style.cssText += `display:flex;align-items:center;justify-content:center;width:170px;height:110px;border-radius:30px;background:${ACC};box-shadow:0 20px 44px rgba(0,0,0,.45);opacity:0`;
  chip.innerHTML = ico('banknote', 76, '#0A0A0A');
  A(chip, [{opacity: 0, transform: 'translateX(0) scale(.5)'}, {opacity: 1, transform: 'translateX(40px) scale(1)', offset: .3},
           {opacity: 1, transform: 'translateX(450px) scale(1) rotate(8deg)', offset: .85}, {opacity: 0, transform: 'translateX(520px) scale(.4)'}], 3.12, .5, {e: 'ease-in-out'});
  punch(wal.inner, 3.52, 1.16); ripple(c, 830, 700, 3.52, 3.2);
  const t = txt(c, [[['เงิน', 'l', 2.15, {size: 64}], ['Active income', 'kw', 2.40, {size: 112}]], [['แปลว่า', 'l', 3.15, {size: 64}], ['เงินเดือน', 'hl', 3.48, {size: 110}]]], 'top:1220px');
  t.classList.add('aroll');
  keyHit(3.48);
}
/* ---------- C3 cream poster · income app: next months' bars drop to zero on "หยุด" ---------- */
{
  const c = card(7.15, 9.15, {bg: 'cream', sound: 'swipe'});
  curl(c, 7.15);
  const p = panel(c, 'left:170px;top:400px;width:740px;height:960px', 7.15);
  const bc = div('left:56px;top:56px;width:120px;height:120px;border-radius:34px;display:flex;align-items:center;justify-content:center;background:' + NAVY, p, ico('briefcase', 64, '#fff'));
  popIn(bc, 7.25);
  skel(p, 'left:200px;top:72px;width:440px', [.7, .45], {t: 7.3});
  bars(p, [.72, .75, .7, .74, .73], 7.25, 'left:95px;top:300px', {h: 560, to: [.72, .75, .7, .015, .015], tTo: 7.72});
  const x = tile(p, 'x', 7.98, 'left:470px;top:470px', {size: 150, bg: '#FF3B30', color: '#fff', sound: 'stamp', db: -22, float: false});
  txt(c, [[['เงินมัน', 'iw', 7.15, NS(124)]]], 'top:170px');
  txt(c, [[['หยุด', 'hl', 7.70, {size: 110}], ['เข้ามา', 'l', 8.10, NS(70)]]], 'top:1430px');
  keyHit(7.70);
}
/* ---------- C4 dark · "1 ปี 2 ปี 3 ปี" — the money gauge shrinks with every year, runs out at 3 ---------- */
{
  const c = card(11.15, 13.15);
  mood(c, {seed: 2});
  const wal = tile(c, 'wallet', 11.20, 'left:360px;top:360px', {size: 360, bg: '#fff', color: NAVY});
  tile(c, 'hourglass', 11.40, 'left:800px;top:300px', {size: 150, bg: 'glass'});
  const track = div('left:190px;top:900px;width:700px;height:80px;border-radius:40px;background:rgba(255,255,255,.12);border:1.5px solid rgba(255,255,255,.22);overflow:hidden;opacity:0', c);
  A(track, [{opacity: 0, transform: 'translateY(40px)'}, {opacity: 1, transform: 'none'}], 11.30, .4, {e: SPRING});
  const fill = div(`left:0;top:0;width:700px;height:80px;border-radius:40px;background:${ACC};transform-origin:0 50%`, track);
  const yrs = [11.20, 11.85, 12.50];
  A(fill, [{transform: 'scaleX(1)'}, {transform: 'scaleX(.66)'}], yrs[0] + .1, .35, {f: 'forwards'});
  A(fill, [{transform: 'scaleX(.66)'}, {transform: 'scaleX(.33)'}], yrs[1] + .1, .35, {f: 'forwards'});
  A(fill, [{transform: 'scaleX(.33)'}, {transform: 'scaleX(.02)'}], yrs[2] + .1, .35, {f: 'forwards'});
  A(fill, [{background: ACC}, {background: '#FF3B30'}], yrs[2] + .1, .2, {f: 'forwards'});
  wobble(wal.inner, yrs[2] + .3);
  ['1 ปี', '2 ปี', '3 ปี'].forEach((s, k) => pill(c, s, yrs[k], `left:${200 + k * 250}px;top:1240px`));
  keyHit(yrs[2]);
}
/* ---------- C5 white · "เขาไม่เรียกว่า รวย" — the word gets struck out ---------- */
{
  const c = card(13.15, 14.15, {bg: 'white', sound: 'swipe'});
  const t = txt(c, [[['เขาไม่เรียกว่า', 'l', 13.15, NS(70)]], [['รวย', 'iw', 13.50, NS(220)]]], 'top:700px');
  strike(t.querySelectorAll('.ch')[1], 13.74, '#111');
  keyHit(13.50);
}
/* ---------- F1 frame · "แต่ผมอยู่ได้ถึง…" ---------- */
{
  const c = frame(17.15, 19.15, {bg: 'cream', s: .54, y: 1095});
  txt(c, [[['แต่ผม', 'l', 17.15, NS(70)], ['อยู่ได้', 'hl', 17.60, {size: 110}]], [['ถึง…', 'iw', 18.30, NS(110)]]], 'top:170px');
  keyHit(17.60);
}
/* ---------- C6 final dark · sofa + piggy bank that keeps filling; "รวยแล้ว" → "อันเนี่ยเขาเรียกว่า รวย" (holds 1 s) ---------- */
{
  const c = card(20.15, 23.0, {sound: 'whoosh_long'});
  mood(c, {seed: 4, o: .26});
  tile(c, 'sofa', 20.30, 'left:90px;top:250px', {size: 170, bg: 'glass'});
  tile(c, 'infinity', 20.45, 'left:800px;top:330px', {size: 150, bg: 'glass'});
  const pig = tile(c, 'piggy-bank', 20.20, 'left:350px;top:560px', {size: 380, bg: '#fff', color: NAVY});
  [20.35, 20.80, 21.25, 21.70, 22.15, 22.55].forEach((t, k) => {
    const coin = div(`left:${485 + (k % 2) * 30}px;top:200px;width:110px;height:110px;border-radius:50%;background:${ACC};border:8px solid #B9D92E;box-shadow:0 14px 30px rgba(0,0,0,.4);opacity:0;display:flex;align-items:center;justify-content:center`, c,
      `<div style="position:relative;width:40px;height:12px;border-radius:6px;background:#0A0A0A;opacity:.75"></div>`);
    A(coin, [{opacity: 0, transform: 'translateY(-80px) rotate(0)'}, {opacity: 1, transform: 'translateY(0) rotate(40deg)', offset: .2},
             {opacity: 1, transform: 'translateY(380px) rotate(160deg)', offset: .85}, {opacity: 0, transform: 'translateY(420px) rotate(180deg) scale(.6)'}], t, .55, {e: 'ease-in'});
  });
  punch(pig.inner, 21.58, 1.14); ripple(c, 540, 750, 21.58, 3.6);
  const a = txt(c, [[['รวยแล้ว', 'k', 20.15, {size: 190}]]], 'top:1240px'); a.classList.add('aroll');
  a.style.opacity = 0; visible(a, 20.15, 20.87);
  const b = txt(c, [[['อันเนี่ยเขาเรียกว่า', 'l', 20.88, {size: 66}]], [['รวย', 'k', 21.55, {size: 200}]]], 'top:1220px'); b.classList.add('aroll');
  b.style.opacity = 0; visible(b, 20.88, 23.0);
  keyHit(20.15); keyHit(21.55, -20);
  sfx('sub', 21.55, -16);
}
