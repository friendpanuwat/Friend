const N = {color: NAVY}, NS = s => ({color: NAVY, size: s});
cards([[2.40, 4.12], [5.40, 7.13], [7.15, 9.13], [11.15, 13.13], [15.50, 17.13], [19.15, 20.13], [20.15, 22.90]]);
for (const [t, z] of [[0, 1], [0.15, 1.08], [2.40, 1], [4.14, 1], [4.15, 1.0], [9.60, 1.1], [11.14, 1], [13.45, 1.1], [14.15, 1], [17.60, 1.1], [19.14, 1]]) zoom(t, z);

cap({t0: 0.0, t1: 2.38, lines: [[['เกษียณ', 'k', 0.15], ['คือ', 'l', 0.75]], [['ถ้าวัน', 'l', 1.07]]]});
keyHit(0.15);
cap({t0: 4.14, t1: 5.38, lines: [[['หรือเงิน', 'l', 4.15]], [['ที่คุณต้อง', 'l', 5.15]]]});
cap({t0: 9.14, t1: 10.13, lines: [[['คุณอยู่ได้', 'l', 9.15]], [['กี่เดือน', 'i', 9.60]]]});
keyHit(9.60);
cap({t0: 10.14, t1: 11.13, lines: [[['ถ้าวันนี้', 'l', 10.15], ['คำตอบของคุณคือ', 'l', 10.58]]]});
cap({t0: 13.14, t1: 14.13, lines: [[['เขา', 'l', 13.15], ['ไม่เรียกว่า', 'hl', 13.45, {size: 100}]], [['รวย', 'kw', 13.85]]]});
keyHit(13.45);
cap({t0: 14.14, t1: 15.48, lines: [[['แต่ถ้าคุณบอกว่า', 'l', 14.15]]]});
cap({t0: 17.14, t1: 19.13, lines: [[['แต่ผม', 'l', 17.15], ['อยู่ได้', 'i', 17.60]], [['ถึงแบบ', 'l', 18.40]]]});
keyHit(17.60);

/* C1 dark: salary envelope of money flowing in */
{
  const c = card(2.40, 4.12);
  mood(c, {seed: 3});
  const m = tile(c, 'banknote', 2.46, 'left:390px;top:330px', {size: 300, bg: '#fff', color: NAVY});
  const u = tile(c, 'user', 2.62, 'left:130px;top:620px', {size: 170, bg: 'glass'});
  tile(c, 'hand-coins', 2.76, 'left:780px;top:560px', {size: 170, bg: 'glass'});
  tile(c, 'clock', 2.95, 'left:790px;top:230px', {size: 140, bg: 'glass'});
  punch(m.inner, 3.38, 1.16); ripple(c, 540, 480, 3.38, 3.4);
  const t = txt(c, [[['เงิน', 'l', 2.40], ['Active income', 'kw', 2.65, {size: 96}]], [['แปลว่า', 'l', 3.15], ['เงินเดือน', 'k', 3.40]]], 'top:1210px');
  t.classList.add('aroll');
  keyHit(3.40);
}
/* C2 white: time sacrificed — hourglass */
{
  const c = card(5.40, 7.13, {bg: 'white', sound: 'swipe'});
  const h = tile(c, 'hourglass', 5.46, 'left:390px;top:380px', {size: 300, bg: NAVY, color: '#fff', sound: null});
  float(h, 5.46, 7.13);
  tile(c, 'user', 5.70, 'left:150px;top:700px', {size: 160, bg: '#EEF0F5', color: NAVY, sound: null});
  const t = txt(c, [[['ที่คุณต้อง', 'l', 5.40, N], ['เสียสละ', 'iw', 5.65, NS(120)]], [['เวลา', 'hl', 6.18, {size: 120}]]], 'top:1020px');
  punch(h.inner, 6.18, 1.12);
  keyHit(6.18);
}
/* C3 dark: income bars shrink to nothing + cross on wallet */
{
  const c = card(7.15, 9.13);
  mood(c, {seed: 4});
  const w = tile(c, 'wallet', 7.20, 'left:120px;top:330px', {size: 260, bg: '#fff', color: NAVY});
  bars(c, [.9, .8, .7, .6, .5], 7.30, 'left:480px;top:300px', {h: 520, to: [.04, .04, .04, .04, .04], tTo: 8.05});
  tile(c, 'coins', 7.50, 'left:150px;top:720px', {size: 150, bg: 'glass'});
  cross(c, 8.05, 'left:170px;top:310px', {size: 340, color: '#FF3B30'});
  wobble(w.inner, 8.05);
  const t = txt(c, [[['เงินมัน', 'l', 7.15], ['หยุด', 'k', 8.05], ['เข้ามา', 'l', 8.45]]], 'top:1260px');
  t.classList.add('aroll');
  keyHit(8.05);
}
/* C4 cream poster: 1 ปี 2 ปี 3 ปี pills */
{
  const c = card(11.15, 13.13, {bg: 'cream'});
  curl(c, 11.15);
  const p = panel(c, 'left:170px;top:430px;width:740px;height:986px', 11.15);
  tile(p, 'clock', 11.25, 'left:250px;top:90px', {size: 240, bg: NAVY, color: '#fff', sound: null});
  const wd = 'left:0;right:0;margin:auto;width:fit-content;';
  pill(p, '1 ปี', 11.55, wd + 'top:400px');
  pill(p, '2 ปี', 12.05, wd + 'top:560px');
  pill(p, '3 ปี', 12.55, wd + 'top:720px');
  txt(c, [[['คำตอบของคุณ', 'iw', 11.20, NS(100)]]], 'top:200px');
}
/* F1 frame */
{
  const c = frame(15.50, 17.13, {bg: 'cream', s: .54, y: 1095});
  txt(c, [[['ถ้าวันนี้', 'l', 15.50, NS(70)]], [['ผมไม่ทำงาน', 'l', 16.07, NS(80)], ['เลย', 'hl', 16.55, {size: 110}]]], 'top:200px');
  keyHit(16.55);
}
/* C5 white: until death */
{
  const c = card(19.15, 20.13, {bg: 'white', sound: 'swipe'});
  tile(c, 'hourglass', 19.20, 'left:400px;top:430px', {size: 280, bg: NAVY, color: '#fff', sound: null});
  txt(c, [[['ถึง', 'l', 19.15, N]], [['วันตาย', 'iw', 19.30, NS(170)]]], 'top:930px');
}
/* C6 navy: rich */
{
  const c = card(20.15, 22.90, {bg: 'navy'});
  const k = tile(c, 'coins', 20.20, 'left:370px;top:360px', {size: 340, bg: ACC, color: '#0A0A0A'});
  tile(c, 'sparkles', 20.45, 'left:130px;top:300px', {size: 150, bg: 'glass'});
  tile(c, 'shield-check', 20.55, 'left:800px;top:640px', {size: 150, bg: 'glass'});
  punch(k.inner, 20.30, 1.14); ripple(c, 540, 530, 20.30, 3.4);
  txt(c, [[['รวยแล้ว', 'kw', 20.20, {wipe: true, step: .05, size: 170}]], [['เขาเรียกว่า', 'l', 20.88], ['รวย', 'k', 21.40]]], 'top:1100px');
  keyHit(20.20); keyHit(21.40);
}
