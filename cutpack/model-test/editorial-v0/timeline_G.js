/* Clip G — retirement / "rich = money that keeps coming in when you stop working". Thai, 22 s + HOLD 1.0.
   Cards are designed for this clip's sentences (see plan.md). */
const N = {color: NAVY}, NS = s => ({color: NAVY, size: s});

cards([[2.15, 4.10], [7.15, 9.05], [10.58, 13.12], [13.20, 14.10], [16.10, 17.10], [19.12, 20.07], [20.10, 22.90]]);

/* ---------- camera: hard punch-ins on key words ---------- */
for (const [t, z] of [[0, 1], [0.15, 1.08], [2.12, 1], [5.40, 1.10], [7.12, 1], [9.50, 1.12], [10.56, 1], [15.15, 1.10],
  [16.08, 1], [18.10, 1.08], [19.10, 1]]) zoom(t, z);

/* ---------- A-roll captions (over the chest) ---------- */
cap({t0: 0.15, t1: 2.12, lines: [[['เกษียณคือ', 'k', 0.15]], [['ถ้าวันเนี่ย', 'l', 1.07]]]});
keyHit(0.15);
cap({t0: 4.12, t1: 7.12, lines: [[['หรือเงินที่คุณ', 'l', 4.15]], [['ต้อง', 'l', 5.15], ['เสียสละ', 'k', 5.40]], [['เวลาไปหามา', 'l', 6.15]]]});
keyHit(5.40);
cap({t0: 9.10, t1: 10.56, lines: [[['คุณอยู่ได้', 'l', 9.15]], [['กี่เดือน', 'k', 9.50]], [['ถ้าวันนี้', 'l', 10.15]]]});
keyHit(9.50);
cap({t0: 14.12, t1: 16.08, lines: [[['แต่ถ้าคุณบอกว่า', 'l', 14.15]], [['ถ้าวันนี้', 'k', 15.15]]]});
keyHit(15.15);
cap({t0: 17.12, t1: 19.10, lines: [[['แต่ผม', 'l', 17.15], ['อยู่ได้', 'l', 17.45]], [['ถึงแบบ', 'i', 18.10]]]});
keyHit(18.10);

/* ---------- A  white · clock → banknote = time turned into money ---------- */
{
  const c = card(2.15, 4.10, {bg: 'white', sound: 'swipe'});
  tile(c, 'clock', 2.20, 'left:150px;top:330px', {size: 330, bg: NAVY, color: '#fff', sound: null});
  const bn = tile(c, 'banknote', 2.50, 'left:600px;top:380px', {size: 300, bg: ACC, color: '#0A0A0A', sound: null});
  punch(bn.inner, 3.20, 1.08);
  txt(c, [[['เงิน', 'l', 2.15, N]], [['Active income', 'kw', 2.25, NS(118)]], [['แปลว่า', 'l', 3.15, N]], [['เงินเดือนคุณ', 'iw', 3.45, NS(120)]]], 'top:1200px');
}

/* ---------- B  dark glow · money stops: falling red line ---------- */
{
  const c = card(7.15, 9.05, {bg: 'black', sound: 'whoosh'});
  mood(c, {seed: 6});
  tile(c, 'banknote', 7.20, 'left:360px;top:300px', {size: 340, bg: '#fff', color: NAVY, sound: null});
  trend(c, [[40, 40], [300, 110], [560, 230], [900, 420]], 7.45, 'left:60px;top:720px', {w: 960, h: 460, color: '#FF3B30', sw: 16});
  const t = txt(c, [[['เงินมัน', 'l', 7.15]], [['หยุดเข้ามา', 'hl', 7.90, {size: 110}]]], 'top:1240px');
  t.classList.add('aroll');
}

/* ---------- C  cream · answer: pills 1 ปี / 2 ปี / 3 ปี appear one by one ---------- */
{
  const c = card(10.58, 13.12, {bg: 'cream', sound: 'swipe'});
  txt(c, [[['คำตอบของคุณคือ', 'iw', 10.60, NS(104)]]], 'top:260px');
  pill(c, '1 ปี', 11.15, 'left:0;right:0;margin:auto;width:fit-content;top:700px');
  pill(c, '2 ปี', 11.90, 'left:0;right:0;margin:auto;width:fit-content;top:920px');
  pill(c, '3 ปี', 12.60, 'left:0;right:0;margin:auto;width:fit-content;top:1140px');
}

/* ---------- D  dark glow · wallet crossed out: "not called rich" ---------- */
{
  const c = card(13.20, 14.10, {bg: 'black', sound: 'whoosh'});
  mood(c, {seed: 7});
  tile(c, 'wallet', 13.22, 'left:360px;top:500px', {size: 360, bg: '#fff', color: NAVY, sound: null});
  cross(c, 13.45, 'left:300px;top:440px', {size: 480, color: '#FF3B30'});
  const t = txt(c, [[['เขาไม่เรียกว่า', 'l', 13.20]], [['รวย', 'k', 13.50]]], 'top:1240px');
  t.classList.add('aroll');
}

/* ---------- E  white · "ไม่ทำงานเลย": person crossed out ---------- */
{
  const c = card(16.10, 17.10, {bg: 'white', sound: 'swipe'});
  tile(c, 'user', 16.15, 'left:370px;top:430px', {size: 340, bg: NAVY, color: '#fff', sound: null});
  cross(c, 16.55, 'left:320px;top:380px', {size: 440, color: '#FF3B30'});
  txt(c, [[['ผม', 'l', 16.10, N]], [['ไม่ทำงานเลย', 'hl', 16.40, {size: 100}]]], 'top:1240px');
}

/* ---------- F  dark glow · "วันตาย": hourglass (time runs out, income doesn't) ---------- */
{
  const c = card(19.12, 20.07, {bg: 'black', sound: 'whoosh'});
  mood(c, {seed: 8});
  tile(c, 'hourglass', 19.15, 'left:370px;top:420px', {size: 340, bg: 'glass', color: '#fff', sound: null});
  const t = txt(c, [[['วันตาย', 'k', 19.15]]], 'top:1200px');
  t.classList.add('aroll');
}

/* ---------- G  white · closing: coins + banknote pop, "รวย" ---------- */
{
  const c = card(20.10, 22.90, {bg: 'white', sound: 'whoosh_long'});
  tile(c, 'coins', 20.20, 'left:150px;top:300px', {size: 300, bg: NAVY, color: '#fff', sound: null});
  const bn = tile(c, 'banknote', 20.40, 'left:560px;top:380px', {size: 280, bg: ACC, color: '#0A0A0A', sound: null});
  punch(bn.inner, 21.20, 1.08);
  txt(c, [[['รวยแล้ว', 'hl', 20.15, {size: 110}]], [['อันนี้เขาเรียกว่า', 'l', 20.88, N]], [['รวย', 'iw', 21.25, NS(150)]]], 'top:1160px');
}
