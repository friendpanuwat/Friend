/* "รวย = เงินยังไหลเข้าเมื่อหยุดทำงาน" — 21.9 s + HOLD 1.0, MG (no B-roll). */
const N = {color: NAVY}, NS = s => ({color: NAVY, size: s});

cards([[2.15, 4.13], [5.15, 7.13], [7.15, 9.13], [11.15, 13.13], [15.15, 17.13], [19.15, 20.86]]);

for (const [t, z] of [[0, 1], [0.15, 1.08], [1.07, 1], [4.15, 1], [4.45, 1.1], [9.15, 1], [9.6, 1.12], [10.15, 1], [10.6, 1.07],
  [13.15, 1], [13.55, 1.1], [14.15, 1], [17.15, 1], [17.55, 1.1], [20.88, 1], [21.35, 1.12]]) zoom(t, z);

/* ---------- A-roll captions ---------- */
cap({t0: 0.00, t1: 1.05, lines: [[['เกษียณ', 'k', 0.15]], [['คือ', 'l', 0.70]]]});
keyHit(0.15);
cap({t0: 1.07, t1: 2.13, lines: [[['ถ้า', 'l', 1.07]], [['วันหนึ่ง', 'i', 1.30]]]});
keyHit(1.30);
cap({t0: 4.15, t1: 5.13, lines: [[['หรือ', 'l', 4.15]], [['เงิน', 'k', 4.45, {size: 170}]]]});
keyHit(4.45);
cap({t0: 9.15, t1: 10.13, lines: [[['คุณอยู่ได้', 'l', 9.15]], [['กี่เดือน?', 'i', 9.60]]]});
keyHit(9.60);
cap({t0: 10.15, t1: 11.13, lines: [[['ถ้าวันนี้', 'l', 10.15]], [['คำตอบ', 'kw', 10.60, {size: 130}], ['ของคุณคือ', 'l', 10.85]]]});
keyHit(10.60);
{
  const cp = cap({t0: 13.15, t1: 14.13, lines: [[['เขาไม่เรียกว่า', 'l', 13.15]], [['รวย', 'k', 13.55, {size: 170}]]]});
  keyHit(13.55);
}
cap({t0: 14.15, t1: 15.13, lines: [[['แต่ถ้า', 'l', 14.15]], [['คุณบอกว่า', 'i', 14.45]]]});
keyHit(14.45);
cap({t0: 17.15, t1: 19.13, lines: [[['แต่ผม', 'l', 17.15]], [['อยู่ได้', 'i', 17.55]], [['ถึงแบบ', 'l', 18.40]]]});
keyHit(17.55);
cap({t0: 20.88, t1: 22.90, lines: [[['อันนี้', 'l', 20.88], ['เขาเรียกว่า', 'l', 21.05]], [['รวย', 'i', 21.35, {size: 190}]]]});
keyHit(21.35);

/* ---------- 1 navy · "เงิน Active income คุณ แปลว่าเงินเดือนคุณ" ---------- */
{
  const c = card(2.15, 4.13, {bg: 'navy'});
  txt(c, [[['เงิน', 'l', 2.15, {size: 70}]], [['Active', 'kw', 2.40, {wipe: true, step: .04, size: 140}], ['income', 'kw', 2.70, {wipe: true, step: .04, size: 140}]],
          [['แปลว่า', 'l', 3.15, {size: 66}]], [['เงินเดือนคุณ', 'iw', 3.40, {size: 120}]]], 'top:640px');
  keyHit(2.40);
}
/* ---------- 2 white · hourglass + "ที่คุณต้อง เสียสละ เวลาไปหามา" ---------- */
{
  const c = card(5.15, 7.13, {bg: 'white', sound: 'swipe'});
  const hg = tile(c, 'hourglass', 5.20, 'left:410px;top:330px', {size: 260, bg: NAVY, color: '#fff', sound: null});
  const coin = tile(c, 'coins', 6.40, 'left:700px;top:520px', {size: 150, bg: ACC, color: '#0A0A0A', sound: null, float: false});
  wobble(hg.inner, 6.20);
  txt(c, [[['ที่คุณต้อง', 'l', 5.15, NS(70)]], [['เสียสละ', 'hl', 5.45, {size: 120}]], [['เวลาไปหามา', 'iw', 6.20, NS(120)]]], 'top:760px');
  keyHit(5.45);
}
/* ---------- 3 dark · money flowing into wallet, then STOPS ---------- */
{
  const c = card(7.15, 9.13);
  mood(c, {seed: 3});
  const w = tile(c, 'wallet', 7.20, 'left:380px;top:620px', {size: 320, bg: '#fff', color: NAVY});
  const flow = div('left:465px;top:170px;width:150px;height:400px;overflow:hidden', c);
  for (let k = 0; k < 3; k++) {
    const b = div('left:0;top:0;width:150px;height:150px', flow);
    tile(b, 'banknote', 7.20, 'left:0;top:0', {size: 150, bg: 'glass', sound: null, float: false});
    A(b, [{transform: 'translateY(-160px)'}, {transform: 'translateY(400px)'}], 7.20 + k * .2, .6, {e: 'linear', f: 'none'});
  }
  tile(c, 'arrow-down', 7.25, 'left:170px;top:330px', {size: 160, bg: 'glass'});
  cross(c, 7.70, 'left:120px;top:280px', {size: 260});
  wobble(w.inner, 7.75);
  const t = txt(c, [[['เงินมัน', 'l', 7.15, {size: 70}]], [['หยุด', 'k', 7.70, {size: 180}], ['เข้ามา', 'l', 8.10, {size: 70}]]], 'top:1200px');
  t.classList.add('aroll');
  keyHit(7.70);
}
/* ---------- 4 cream poster · savings bar drains: 1 ปี 2 ปี 3 ปี ---------- */
{
  const c = card(11.15, 13.13, {bg: 'cream'});
  curl(c, 11.15);
  const p = panel(c, 'left:170px;top:300px;width:740px;height:880px', 11.15);
  const wl = div('left:56px;top:56px;width:130px;height:130px;border-radius:34px;display:flex;align-items:center;justify-content:center;background:' + NAVY, p, ico('wallet', 70, '#fff'));
  popIn(wl, 11.20);
  skel(p, 'left:220px;top:80px;width:440px', [.7, .45], {t: 11.25});
  const tr = div('left:120px;top:260px;width:500px;height:560px;border-radius:40px;background:rgba(20,33,61,.08)', p);
  const fill = div('left:0;bottom:0;width:500px;height:560px;border-radius:40px;background:' + NAVY + ';transform-origin:50% 100%', tr);
  A(fill, [{transform: 'scaleY(1)'}, {transform: 'scaleY(.68)'}], 11.40, .35, {e: SMOOTH, f: 'forwards'});
  A(fill, [{transform: 'scaleY(.68)'}, {transform: 'scaleY(.36)'}], 12.00, .35, {e: SMOOTH, f: 'forwards'});
  A(fill, [{transform: 'scaleY(.36)'}, {transform: 'scaleY(.06)', background: '#FF3B30'}], 12.60, .35, {e: SMOOTH, f: 'forwards'});
  txt(c, [[['1 ปี', 'iw', 11.30, NS(110)], ['2 ปี', 'iw', 11.95, NS(110)], ['3 ปี', 'hl', 12.55, {size: 110}]]], 'top:1300px');
  keyHit(12.55);
}
/* ---------- 5 frame · "ถ้าวันนี้ ผม ไม่ทำงาน เลย" ---------- */
{
  const f = frame(15.15, 17.13, {bg: 'cream', s: .5, y: 1180});
  txt(f, [[['ถ้าวันนี้', 'l', 15.15, NS(70)], ['ผม', 'l', 16.07, NS(70)]], [['ไม่ทำงาน', 'hl', 16.30, {size: 120}], ['เลย', 'iw', 16.80, NS(100)]]], 'top:150px');
  keyHit(16.30);
}
/* ---------- 6 dark · money keeps flowing to "วันตาย" → "รวยแล้ว" ---------- */
{
  const c = card(19.15, 20.86);
  mood(c, {seed: 5});
  const w = tile(c, 'wallet', 19.20, 'left:380px;top:620px', {size: 320, bg: '#fff', color: NAVY});
  const flow = div('left:465px;top:170px;width:150px;height:400px;overflow:hidden', c);
  for (let k = 0; k < 7; k++) {
    const b = div('left:0;top:0;width:150px;height:150px', flow);
    tile(b, 'coins', 19.20, 'left:0;top:0', {size: 150, bg: 'glass', sound: null, float: false});
    A(b, [{transform: 'translateY(-160px)'}, {transform: 'translateY(400px)'}], 19.20 + k * .24, .55, {e: 'linear', f: 'none'});
  }
  tile(c, 'clock', 19.35, 'left:140px;top:380px', {size: 170, bg: 'glass'});
  const sp = tile(c, 'sparkles', 20.15, 'left:780px;top:440px', {size: 180, bg: ACC, color: '#0A0A0A'});
  punch(w.inner, 20.15, 1.16); ripple(c, 540, 780, 20.15, 3.2);
  const t = txt(c, [[['อยู่ได้ถึง', 'l', 19.15, {size: 66}], ['วันตาย', 'iw', 19.25, {size: 120}]], [['รวยแล้ว', 'k', 20.15, {size: 180}]]], 'top:1180px');
  t.classList.add('aroll');
  keyHit(20.15);
}
