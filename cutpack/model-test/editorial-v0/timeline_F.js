const N = {color: NAVY}, NS = s => ({color: NAVY, size: s});

cards([[2.15, 4.13], [7.15, 9.13], [11.15, 13.13], [16.07, 17.13], [17.15, 19.13], [20.15, 22.90]]);

for (const [t, z] of [[0, 1], [0.15, 1.08], [1.07, 1], [4.15, 1], [5.6, 1.1], [6.15, 1], [6.3, 1.1], [7.13, 1], [9.6, 1.1], [10.15, 1],
  [13.15, 1], [13.7, 1.1], [14.15, 1], [16.05, 1], [19.2, 1.12], [19.7, 1]]) zoom(t, z);

/* A-roll */
cap({t0: 0, t1: 1.05, lines: [[['เกษียณ', 'k', 0.15]], [['คือ', 'l', 0.7]]]}); keyHit(0.15);
cap({t0: 1.07, t1: 2.13, lines: [[['ถ้าวันนี้', 'm', 1.07]]]});
cap({t0: 4.15, t1: 6.13, lines: [[['หรือเงิน', 'l', 4.15], ['ที่คุณต้อง', 'l', 5.15]], [['เสียสละ', 'i', 5.6]]]}); keyHit(5.6);
cap({t0: 6.15, t1: 7.13, lines: [[['เวลา', 'k', 6.3]], [['ไปหามา', 'l', 6.62]]]}); keyHit(6.3);
cap({t0: 9.15, t1: 10.13, lines: [[['คุณอยู่ได้', 'l', 9.15]], [['กี่เดือน', 'i', 9.6]]]}); keyHit(9.6);
cap({t0: 10.15, t1: 11.13, lines: [[['ถ้าวันนี้', 'l', 10.15]], [['คำตอบของคุณคือ', 'l', 10.62]]]});
cap({t0: 13.15, t1: 14.13, lines: [[['เขาไม่เรียกว่า', 'l', 13.15]], [['รวย', 'i', 13.7]]]}); keyHit(13.7);
cap({t0: 14.15, t1: 16.05, lines: [[['แต่ถ้าคุณบอกว่า', 'l', 14.15]], [['ถ้าวันนี้', 'm', 15.2]]]});
cap({t0: 19.15, t1: 20.13, lines: [[['วันตาย', 'k', 19.2, {size: 190}]]]}); keyHit(19.2);

/* CARD1 · payslip tied to a person + clock: "เงินเดือน" */
{
  const c = card(2.15, 4.13);
  mood(c, {seed: 0});
  const p = panel(c, 'left:230px;top:300px;width:620px;height:640px', 2.2, {style: 'white'});
  tile(p, 'banknote', 2.3, 'left:50px;top:50px', {size: 170, bg: NAVY, color: '#fff'});
  skel(p, 'left:250px;top:80px;width:320px', [.9, .55], {t: 2.4});
  skel(p, 'left:50px;top:300px;width:520px', [.8, .6, .7, .4], {t: 2.5, h: 22});
  const pay = tile(c, 'user', 2.45, 'left:90px;top:200px', {size: 170, bg: 'glass'});
  tile(c, 'clock', 2.6, 'left:800px;top:760px', {size: 170, bg: 'glass'});
  punch(pay.inner, 3.5, 1.16); ripple(c, 540, 620, 3.5, 3.4);
  const t = txt(c, [[['เงิน', 'l', 2.15], ['Active income', 'kw', 2.5, {size: 104}]], [['แปลว่า', 'l', 3.2], ['เงินเดือน', 'k', 3.5]]], 'top:1210px'); t.classList.add('aroll');
  keyHit(3.5);
}
/* CARD2 · banknotes fall into wallet, then stop */
{
  const c = card(7.15, 9.13);
  mood(c, {seed: 2});
  const w = tile(c, 'wallet', 7.2, 'left:350px;top:640px', {size: 380, bg: '#fff', color: NAVY});
  [[7.25, 420], [7.5, 600], [7.7, 510]].forEach(([t, x], i) => {
    const d = div(`left:${x - 80}px;top:260px;width:160px;height:160px;opacity:0`, c);
    tile(d, 'banknote', t, 'left:0;top:0', {size: 160, bg: 'glass', sound: null, float: false});
    A(d, [{opacity: 0, transform: 'translateY(-300px)'}, {opacity: 1, transform: 'translateY(0)', offset: .35}, {opacity: 1, transform: 'translateY(330px)'}, ], t, .5, {e: 'ease-in', f: 'forwards'});
    A(d, [{opacity: 1}, {opacity: 0}], t + .45, .08, {f: 'forwards'});
  });
  wobble(w.inner, 7.95);
  tile(c, 'x', 8.0, 'left:690px;top:520px', {size: 150, bg: '#FF3B30', color: '#fff', sound: 'stamp', db: -22, float: false});
  const t = txt(c, [[['เงินมัน', 'l', 7.15]], [['หยุด', 'k', 7.95], ['เข้ามา', 'l', 8.4]]], 'top:1280px'); t.classList.add('aroll');
  keyHit(7.95);
}
/* CARD3 · hourglass + 1/2/3 year tags */
{
  const c = card(11.15, 13.13, {bg: 'navy'});
  const h = tile(c, 'hourglass', 11.2, 'left:390px;top:230px', {size: 300, bg: '#fff', color: NAVY});
  pill(c, '1 ปี', 11.5, 'left:0;right:0;margin:auto;width:fit-content;top:760px');
  pill(c, '2 ปี', 12.05, 'left:0;right:0;margin:auto;width:fit-content;top:930px');
  pill(c, '3 ปี', 12.6, 'left:0;right:0;margin:auto;width:fit-content;top:1100px');
  punch(h.inner, 12.62, 1.1);
}
/* FRAME · speaker shrunk: "ผมไม่ทำงานเลย" */
{
  const c = frame(16.07, 17.13, {bg: 'cream', s: .54, y: 1095});
  txt(c, [[['ผม', 'l', 16.07, NS(70)], ['ไม่ทำงาน', 'hl', 16.5, {size: 108}]], [['เลย', 'iw', 16.95, NS(100)]]], 'top:200px');
  keyHit(16.5);
}
/* CARD4 · income keeps flowing */
{
  const c = card(17.15, 19.13);
  mood(c, {seed: 4});
  const hc = tile(c, 'hand-coins', 17.2, 'left:350px;top:420px', {size: 380, bg: '#fff', color: NAVY});
  tile(c, 'coins', 17.4, 'left:110px;top:300px', {size: 160, bg: 'glass'});
  tile(c, 'banknote', 17.6, 'left:820px;top:330px', {size: 160, bg: 'glass'});
  trend(c, [[0, 330], [150, 230], [300, 250], [470, 90], [620, 20]], 18.1, 'left:230px;top:820px', {w: 620, h: 340, color: ACC, sw: 18});
  punch(hc.inner, 18.55, 1.1);
  const t = txt(c, [[['แต่ผมอยู่ได้', 'l', 17.15]], [['ถึงแบบ', 'kw', 18.5]]], 'top:1280px'); t.classList.add('aroll');
  keyHit(18.5);
}
/* CARD5 · final: rich */
{
  const c = card(20.15, 22.90, {sound: 'whoosh_long'});
  mood(c, {seed: 5, o: .26});
  const co = tile(c, 'coins', 20.2, 'left:340px;top:330px', {size: 400, bg: ACC, color: '#0A0A0A'});
  tile(c, 'shield-check', 20.4, 'left:110px;top:640px', {size: 170, bg: 'glass'});
  tile(c, 'sparkles', 20.55, 'left:800px;top:250px', {size: 160, bg: 'glass'});
  punch(co.inner, 20.3, 1.14); ripple(c, 540, 530, 20.3, 3.4);
  const t = txt(c, [[['รวยแล้ว', 'k', 20.3, {size: 190}]], [['อันเนี่ยเขาเรียกว่า', 'l', 20.9], ['รวย', 'hl', 21.55, {size: 110}]]], 'top:1230px'); t.classList.add('aroll');
  keyHit(20.3); keyHit(21.55, -20);
  sfx('sub', 21.55, -16);
}
