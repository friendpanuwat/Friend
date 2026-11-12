/* Clip I — "เกษียณคือ... รวยคืออะไร": retirement = money that keeps coming in without work. Thai, 22.9 s incl. HOLD. */
const N = {color: NAVY}, NS = s => ({color: NAVY, size: s});

cards([[2.15, 4.10], [7.15, 9.05], [10.58, 13.10], [16.07, 17.12], [20.15, 22.90]]);

/* ---------- camera: hard punch-ins on key words (A-roll only) ---------- */
for (const [t, z] of [[0, 1], [0.15, 1.08], [0.65, 1], [1.5, 1.1], [1.9, 1], [4.5, 1.1], [4.9, 1], [5.8, 1.1], [6.15, 1.08], [6.6, 1],
  [9.7, 1.1], [10.1, 1], [13.85, 1.1], [14.3, 1], [17.6, 1.1], [18.25, 1], [19.15, 1.1], [19.9, 1]]) zoom(t, z);

/* ---------- A-roll captions (over the chest) ---------- */
cap({t0: 0.15, t1: 1.05, lines: [[['เกษียณ', 'k', 0.15], ['คือ', 'l', 0.62]]]});
keyHit(0.15);
cap({t0: 1.07, t1: 2.13, lines: [[['ถ้าวัน', 'l', 1.07]], [['เนี่ย', 'i', 1.5]]]});
keyHit(1.5);
cap({t0: 4.15, t1: 5.13, lines: [[['หรือ', 'l', 4.15]], [['เงิน', 'k', 4.5]]]});
keyHit(4.5);
cap({t0: 5.15, t1: 6.13, lines: [[['ที่คุณต้อง', 'l', 5.15]], [['เสียสละ', 'hl', 5.8]]]});
keyHit(5.8);
cap({t0: 6.15, t1: 7.10, lines: [[['เวลา', 'k', 6.15]], [['ไปหามา', 'l', 6.7]]]});
keyHit(6.15);
cap({t0: 9.15, t1: 10.12, lines: [[['คุณอยู่ได้', 'l', 9.15]], [['กี่เดือน', 'k', 9.7]]]});
keyHit(9.7);
cap({t0: 10.15, t1: 10.56, lines: [[['ถ้าวันนี้', 'l', 10.15]]]});
cap({t0: 13.15, t1: 14.13, lines: [[['เขาไม่เรียกว่า', 'l', 13.15]], [['รวย', 'k', 13.85]]]});
keyHit(13.85);
cap({t0: 14.15, t1: 15.13, lines: [[['แต่ถ้าคุณบอกว่า', 'l', 14.15]]]});
cap({t0: 15.15, t1: 16.05, lines: [[['ถ้าวันนี้', 'l', 15.15]]]});
cap({t0: 17.15, t1: 19.12, lines: [[['แต่ผม', 'l', 17.15]], [['อยู่ได้', 'k', 17.6]], [['ถึงแบบ', 'l', 18.3]]]});
keyHit(17.6);
cap({t0: 19.15, t1: 20.12, lines: [[['วันตาย', 'k', 19.15]]]});
keyHit(19.15);

/* ---------- C1 white · "เงิน Active income / แปลว่าเงินเดือนคุณ" + clock (แลกเวลากับเงิน) ---------- */
{
  const c = card(2.15, 4.10, {bg: 'white', sound: 'swipe'});
  const clk = tile(c, 'clock', 2.45, 'left:300px;top:330px', {size: 420, bg: NAVY, color: '#fff', sound: null});
  punch(clk.inner, 3.15, 1.1);
  txt(c, [[['เงิน', 'l', 2.15, N], ['Active income', 'kw', 2.45, NS(116)]], [['แปลว่าเงินเดือนคุณ', 'l', 3.15, N]]], 'top:1180px');
  keyHit(2.45);
}

/* ---------- C2 dark · banknote struck through as the money stops · "เงินมันหยุดเข้ามา" ---------- */
{
  const c = card(7.15, 9.05);
  mood(c, {seed: 3});
  tile(c, 'banknote', 7.25, 'left:300px;top:340px', {size: 440, bg: '#fff', color: NAVY});
  cross(c, 8.15, 'left:300px;top:340px', {size: 440, color: '#FF3B30'});
  const t = txt(c, [[['เงินมัน', 'l', 7.15]], [['หยุด', 'hl', 7.45], ['เข้ามา', 'kw', 7.9, {size: 120}]]], 'top:1200px');
  t.classList.add('aroll');
  keyHit(7.45);
}

/* ---------- C3 cream poster · "คำตอบของคุณคือ" + pills 1 ปี / 2 ปี / 3 ปี ---------- */
{
  const c = card(10.58, 13.10, {bg: 'cream'});
  curl(c, 10.58);
  txt(c, [[['คำตอบของคุณคือ', 'l', 10.60, N]]], 'top:560px');
  pill(c, '1 ปี', 11.15, 'left:0;right:0;margin:auto;width:fit-content;top:760px');
  pill(c, '2 ปี', 11.80, 'left:0;right:0;margin:auto;width:fit-content;top:960px');
  pill(c, '3 ปี', 12.45, 'left:0;right:0;margin:auto;width:fit-content;top:1160px');
}

/* ---------- C4 white · "ผมไม่ทำงานเลย" — no-work highlight ---------- */
{
  const c = card(16.07, 17.12, {bg: 'white', sound: 'swipe'});
  txt(c, [[['ผมไม่', 'l', 16.07, N]], [['ทำงานเลย', 'hl', 16.45]]], 'top:760px');
  keyHit(16.45);
}

/* ---------- C5 dark · closing: coin tile in accent, "รวยแล้ว อันเนี่ยเขาเรียกว่ารวย" ---------- */
{
  const c = card(20.15, 22.90);
  mood(c, {seed: 4});
  const coin = tile(c, 'coins', 20.20, 'left:300px;top:380px', {size: 440, bg: ACC, color: '#0A0A0A'});
  punch(coin.inner, 21.30, 1.12);
  const t = txt(c, [[['รวยแล้ว', 'kw', 20.15]], [['อันเนี่ยเขาเรียกว่า', 'l', 20.88]], [['รวย', 'i', 21.30]]], 'top:1200px');
  t.classList.add('aroll');
  keyHit(21.30);
}
