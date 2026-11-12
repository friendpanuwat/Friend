/* Thai talking head, 22.0 s + HOLD 1.0. Topic: money that keeps coming in when you stop working ("รวย").
   Full-screen cards: K1 dark clock→banknote · K2 white hourglass · K3 cream bars drop · K4 dark clock + pills ·
   K5 white red X · K6 dark user + coins · K8 dark sparkles closing. frame F1 cream (speaker shrinks) at 17.15–19.10. */
const N = {color: NAVY}, NS = s => ({color: NAVY, size: s});

cards([[2.15, 4.10], [6.15, 7.10], [7.15, 9.10], [11.15, 13.10], [13.15, 14.10], [16.07, 17.10], [17.15, 19.10], [20.15, 22.90]]);

/* ---------- camera: hard punch-ins on key words only ---------- */
for (const [t, z] of [[0, 1], [0.15, 1.08], [1.07, 1.1], [2.12, 1], [4.15, 1], [5.15, 1.1], [6.12, 1], [9.55, 1.1], [10.12, 1],
  [15.15, 1.1], [16.03, 1], [19.15, 1.1], [20.10, 1]]) zoom(t, z);

/* ---------- A-roll captions (over the chest) ---------- */
cap({t0: 0.15, t1: 1.05, lines: [[['เกษียณคือ', 'i', 0.15]]]});
keyHit(0.15);
cap({t0: 1.07, t1: 2.12, lines: [[['ถ้าวันเนี่ย', 'k', 1.07]]]});
keyHit(1.07);

cap({t0: 4.15, t1: 6.11, lines: [[['หรือเงิน', 'l', 4.15]], [['ที่คุณต้องเสียสละ', 'k', 5.15]]]});
keyHit(5.15);

cap({t0: 9.15, t1: 10.12, lines: [[['คุณอยู่ได้', 'l', 9.15]], [['กี่เดือน', 'k', 9.55]]]});
keyHit(9.55);
cap({t0: 10.15, t1: 11.10, lines: [[['ถ้าวันนี้', 'l', 10.15]], [['คำตอบของคุณคือ', 'l', 10.58]]]});

cap({t0: 14.15, t1: 15.12, lines: [[['แต่ถ้าคุณบอกว่า', 'l', 14.15]]]});
cap({t0: 15.15, t1: 16.05, lines: [[['ถ้าวันนี้', 'k', 15.15]]]});
keyHit(15.15);

cap({t0: 19.15, t1: 20.12, lines: [[['วันตาย', 'k', 19.15]]]});
keyHit(19.15);

/* ---------- K1 dark · Active income = time traded for money (clock → banknote) ---------- */
{
  const c = card(2.15, 4.10);
  mood(c, {seed: 0});
  const clk = tile(c, 'clock', 2.22, 'left:130px;top:520px', {size: 300, bg: '#fff', color: NAVY, sound: null});
  tile(c, 'banknote', 2.80, 'left:600px;top:560px', {size: 260, bg: 'glass', sound: null});
  punch(clk.inner, 3.25, 1.1);
  const t = txt(c, [[['เงิน', 'l', 2.15], ['Active income', 'k', 2.45, {size: 120}], ['คุณ', 'l', 2.95]], [['แปลว่าเงินเดือนคุณ', 'l', 3.15, {size: 62}]]], 'top:1210px');
  t.classList.add('aroll');
}
/* ---------- K2 white · the hours spent earning it (hourglass) ---------- */
{
  const c = card(6.15, 7.10, {bg: 'white'});
  tile(c, 'hourglass', 6.22, 'left:370px;top:330px', {size: 340, bg: NAVY, color: '#fff', sound: null});
  txt(c, [[['เวลา', 'iw', 6.15, NS(170)]], [['ไปหามา', 'l', 6.60, N]]], 'top:1210px');
}
/* ---------- K3 cream poster · income bars drop to nothing on "หยุด" ---------- */
{
  const c = card(7.15, 9.10, {bg: 'cream'});
  curl(c, 7.15);
  const p = panel(c, 'left:170px;top:430px;width:740px;height:986px', 7.15);
  skel(p, 'left:200px;top:72px;width:440px', [.75, .45], {t: 7.40});
  bars(p, [.55, .7, .62, .85, .95], 7.35, 'left:95px;top:300px', {h: 560, to: [.04, .03, .03, .02, .02], tTo: 7.85});
  txt(c, [[['เงินมัน', 'l', 7.15, N]], [['หยุดเข้ามา', 'iw', 7.55, NS(124)]]], 'top:180px');
}
/* ---------- K4 dark · "1 ปี 2 ปี 3 ปี" as three pills under a clock ---------- */
{
  const c = card(11.15, 13.10);
  mood(c, {seed: 3});
  tile(c, 'clock', 11.20, 'left:390px;top:200px', {size: 240, bg: 'glass', sound: null});
  pill(c, '1 ปี', 11.40, 'left:0;right:0;margin:auto;width:fit-content;top:600px');
  pill(c, '2 ปี', 11.75, 'left:0;right:0;margin:auto;width:fit-content;top:770px');
  pill(c, '3 ปี', 12.10, 'left:0;right:0;margin:auto;width:fit-content;top:940px');
  const t = txt(c, [[['อยู่ได้แค่', 'l', 11.15]]], 'top:1210px');
  t.classList.add('aroll');
}
/* ---------- K5 white · "not called rich": red X stamps over the card ---------- */
{
  const c = card(13.15, 14.10, {bg: 'white'});
  tile(c, 'x', 13.30, 'left:370px;top:330px', {size: 340, bg: '#FF3B30', color: '#fff', sound: 'stamp', db: -21, float: false});
  txt(c, [[['เขาไม่เรียกว่า', 'l', 13.15, N]], [['รวย', 'iw', 13.55, NS(200)]]], 'top:1210px');
}
/* ---------- K6 dark · "I don't work at all": idle person, money still coming in ---------- */
{
  const c = card(16.07, 17.10);
  mood(c, {seed: 4});
  tile(c, 'user', 16.12, 'left:230px;top:430px', {size: 320, bg: '#fff', color: NAVY, sound: null});
  tile(c, 'coins', 16.42, 'left:600px;top:420px', {size: 260, bg: 'glass', sound: null});
  const t = txt(c, [[['ผมไม่ทำงาน', 'l', 16.07]], [['เลย', 'hl', 16.50, {size: 116}]]], 'top:1210px');
  t.classList.add('aroll');
}
/* ---------- F1 frame cream · the speaker says "I can live until I die" (speaker shrinks to a card) ---------- */
{
  const c = frame(17.15, 19.10, {bg: 'cream', s: .54, y: 1095});
  txt(c, [[['แต่ผมอยู่ได้', 'l', 17.15, NS(64)]], [['ถึงแบบ', 'iw', 17.90, NS(120)]]], 'top:170px');
}
/* ---------- K8 dark closing · sparkle + "already rich" ---------- */
{
  const c = card(20.15, 22.90, {bg: 'black', sound: 'whoosh_long'});
  mood(c, {seed: 5});
  tile(c, 'sparkles', 20.22, 'left:360px;top:440px', {size: 360, bg: ACC, color: '#0A0A0A', sound: null});
  ripple(c, 540, 620, 20.30, 3.0);
  txt(c, [[['รวยแล้ว', 'iw', 20.15, {size: 170}]]], 'top:150px').classList.add('aroll');
  const t = txt(c, [[['อันเนี่ยเขาเรียกว่า', 'l', 20.88]], [['รวย', 'k', 21.30, {size: 210}]]], 'top:1200px');
  t.classList.add('aroll');
  sfx('sub', 21.30, -16);
}
