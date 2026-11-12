/* Clip: "รวยคืออะไร" — เงินที่ยังเข้ามาตอนหยุดทำงาน. Cards designed for this clip's own sentences. */
const N = {color: NAVY}, NS = s => ({color: NAVY, size: s});

cards([[2.15, 3.14], [5.15, 7.13], [7.15, 9.13], [11.15, 13.13], [13.15, 14.13], [15.15, 17.13], [20.88, 22.90]]);

/* ---------- camera: hard punch-ins on key words ---------- */
for (const [t, z] of [[0, 1], [0.08, 1.08], [1.07, 1], [3.16, 1], [3.50, 1.1], [4.15, 1], [4.50, 1.08], [9.15, 1], [9.55, 1.1],
  [10.15, 1], [10.58, 1.1], [14.15, 1], [14.60, 1.08], [17.15, 1], [17.60, 1.1], [19.15, 1.12], [20.15, 1.1]]) zoom(t, z);

/* ---------- A-roll captions (over the chest) ---------- */
cap({t0: 0.00, t1: 1.05, lines: [[['เกษียณ', 'k', 0.08], ['คือ', 'l', 0.70]]]});
keyHit(0.08);
cap({t0: 1.07, t1: 2.13, lines: [[['ถ้าวันนี้', 'm', 1.07]]]});
cap({t0: 3.16, t1: 4.13, lines: [[['แปลว่า', 'l', 3.16]], [['เงินเดือน', 'i', 3.50]]]});
keyHit(3.50);
cap({t0: 4.15, t1: 5.13, lines: [[['หรือ', 'l', 4.15], ['เงิน', 'k', 4.50]]]});
keyHit(4.50);
cap({t0: 9.15, t1: 10.13, lines: [[['คุณอยู่ได้', 'l', 9.15]], [['กี่เดือน', 'i', 9.55, {size: 170}]]]});
keyHit(9.55);
cap({t0: 10.15, t1: 11.13, lines: [[['ถ้าวันนี้', 'l', 10.15]], [['คำตอบ', 'k', 10.58], ['ของคุณคือ', 'l', 10.90]]]});
keyHit(10.58);
cap({t0: 14.15, t1: 15.13, lines: [[['แต่ถ้า', 'l', 14.15], ['คุณ', 'l', 14.40]], [['บอกว่า', 'i', 14.60]]]});
keyHit(14.60);
cap({t0: 17.15, t1: 19.13, lines: [[['แต่ผม', 'l', 17.15]], [['อยู่ได้', 'k', 17.60], ['ถึง', 'l', 18.45]]]});
keyHit(17.60);
cap({t0: 19.15, t1: 20.13, lines: [[['วันตาย', 'i', 19.15, {size: 190}]]]});
keyHit(19.15);
cap({t0: 20.15, t1: 20.86, lines: [[['รวยแล้ว', 'hl', 20.15, {size: 130}]]]});
keyHit(20.15);

/* ---------- C1 dark · a person at work, coin appears only as the work happens ("Active income") ---------- */
{
  const c = card(2.15, 3.14);
  mood(c, {seed: 0});
  tile(c, 'user', 2.20, 'left:130px;top:430px', {size: 330, bg: '#fff', color: NAVY, sound: null});
  tile(c, 'clock', 2.30, 'left:640px;top:250px', {size: 160, bg: 'glass'});
  const coin = tile(c, 'coins', 2.45, 'left:640px;top:600px', {size: 240, bg: ACC, color: '#0A0A0A'});
  punch(coin.inner, 2.80, 1.14); ripple(c, 760, 720, 2.45, 3.2);
  const t = txt(c, [[['เงิน', 'l', 2.15], ['Active income', 'k', 2.45]]], 'top:1200px'); t.classList.add('aroll');
  keyHit(2.45);
}
/* ---------- C2 white · time (hourglass) is traded for money, hourglass flips on "เวลา" ---------- */
{
  const c = card(5.15, 7.13, {bg: 'white', sound: 'swipe'});
  const hg = tile(c, 'hourglass', 5.25, 'left:110px;top:430px', {size: 330, bg: NAVY, color: '#fff', sound: null, float: false});
  const ar = svg(190, 70, `<path d="M6 35 H170" stroke="${NAVY}" stroke-width="16" stroke-linecap="round" fill="none"/><path d="M136 8 L174 35 L136 62" stroke="${NAVY}" stroke-width="16" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`, 'left:445px;top:560px', c);
  const ps = ar.querySelectorAll('path'); draw(ps[0], 5.85, .35); A(ps[1], [{opacity: 0}, {opacity: 1}], 6.15, .1);
  const bn = tile(c, 'banknote', 6.15, 'left:640px;top:430px', {size: 330, bg: NAVY, color: '#fff', sound: null, float: false});
  A(hg.inner.firstChild, [{transform: 'rotate(0deg)'}, {transform: 'rotate(180deg)'}], 6.15, .6, {e: SPRING, f: 'forwards'});
  punch(bn.inner, 6.40, 1.12);
  txt(c, [[['ที่คุณต้อง', 'l', 5.15, N], ['เสียสละ', 'iw', 5.55, NS(130)]], [['เวลาไปหามา', 'l', 6.15, NS(70)]]], 'top:1060px');
}
/* ---------- C3 dark · bills fall into the wallet, then one stops mid-air on "หยุด" ---------- */
{
  const c = card(7.15, 9.13);
  mood(c, {seed: 1});
  const w = tile(c, 'wallet', 7.20, 'left:370px;top:600px', {size: 340, bg: '#fff', color: NAVY, sound: null});
  const bill = (t, to, fade, left) => {
    const b = tile(c, 'banknote', t, `left:${left}px;top:240px`, {size: 220, bg: 'glass', float: false, sound: null});
    A(b, [{transform: 'translateY(-300px)', opacity: 1}, {transform: `translateY(${to}px)`, opacity: fade ? 0 : 1}], t, fade ? .6 : .5, {e: fade ? 'ease-in' : 'ease-out', f: fade ? 'both' : 'forwards'});
    return b;
  };
  bill(7.35, 380, true, 430); bill(7.62, 380, true, 430);
  bill(7.85, 120, false, 430);
  cross(c, 8.02, 'left:400px;top:690px', {size: 280});
  wobble(w.inner, 8.05);
  const t = txt(c, [[['เงินมัน', 'l', 7.15]], [['หยุด', 'k', 8.00], ['เข้ามา', 'l', 8.45]]], 'top:1210px'); t.classList.add('aroll');
  keyHit(8.00);
}
/* ---------- C4 cream poster · three bars rise on "1 ปี / 2 ปี / 3 ปี" ---------- */
{
  const c = card(11.15, 13.13, {bg: 'cream'});
  curl(c, 11.15);
  const p = panel(c, 'left:170px;top:430px;width:740px;height:986px', 11.15);
  const lab = (s, t, x) => { const d = div(`left:${x}px;top:760px;width:160px;text-align:center;font-family:KeySans;font-size:76px;color:${NAVY};opacity:0;white-space:nowrap`, p, s); A(d, [{opacity: 0, transform: 'translateY(30px)'}, {opacity: 1, transform: 'none'}], t, .3, {e: SPRING}); };
  div('left:60px;top:735px;width:620px;height:4px;border-radius:4px;background:rgba(20,33,61,.18)', p);
  bars(p, [.35], 11.25, 'left:80px;top:150px', {w: 160, h: 560, last: NAVY}); lab('1 ปี', 11.40, 80);
  bars(p, [.62], 11.90, 'left:290px;top:150px', {w: 160, h: 560, last: NAVY}); lab('2 ปี', 12.05, 290);
  bars(p, [.9], 12.50, 'left:500px;top:150px', {w: 160, h: 560, last: NAVY}); lab('3 ปี', 12.65, 500);
  txt(c, [[['อยู่ได้กี่เดือน', 'iw', 11.20, NS(112)]], [['คำตอบคือ', 'l', 11.20, NS(60)]]], 'top:170px');
}
/* ---------- C5 navy · a coin tile gets crossed out on "รวย" ---------- */
{
  const c = card(13.15, 14.13, {bg: 'navy', sound: 'swipe'});
  const co = tile(c, 'coins', 13.20, 'left:400px;top:360px', {size: 280, bg: 'glass'});
  cross(c, 13.80, 'left:390px;top:350px', {size: 300});
  wobble(co.inner, 13.85);
  const t = txt(c, [[['เขาไม่เรียกว่า', 'l', 13.15, {size: 70}]], [['รวย', 'kw', 13.80, {wipe: true, size: 200}]]], 'top:1100px');
}
/* ---------- F1 frame · "ถ้าวันนี้ ผมไม่ทำงานเลย" ---------- */
{
  const c = frame(15.15, 17.13, {bg: 'cream', s: .54, y: 1095});
  txt(c, [[['ถ้าวันนี้', 'l', 15.15, NS(70)]], [['ผม', 'l', 16.07, NS(70)], ['ไม่ทำงาน', 'hl', 16.35, {size: 110}]], [['เลย', 'iw', 16.90, NS(100)]]], 'top:160px');
  keyHit(16.35);
}
/* ---------- C6 dark closing · shield-check lands, "รวย" (holds through HOLD) ---------- */
{
  const c = card(20.88, 22.90, {sound: 'whoosh_long'});
  mood(c, {seed: 5, o: .26});
  tile(c, 'coins', 21.00, 'left:100px;top:420px', {size: 170, bg: 'glass'});
  tile(c, 'clock', 21.12, 'left:810px;top:330px', {size: 150, bg: 'glass'});
  tile(c, 'sparkles', 21.60, 'left:830px;top:760px', {size: 150, bg: 'glass'});
  const sh = tile(c, 'shield-check', 20.95, 'left:340px;top:360px', {size: 400, bg: '#fff', color: NAVY, sound: null});
  const ok = tile(c, 'check', 21.50, 'left:640px;top:330px', {size: 190, bg: ACC, color: '#0A0A0A', float: false});
  punch(sh.inner, 21.50, 1.1); ripple(c, 540, 560, 21.50, 4);
  const t = txt(c, [[['อันนี้', 'l', 20.88], ['เขาเรียกว่า', 'l', 21.15]], [['รวย', 'k', 21.50, {size: 200}]]], 'top:1130px'); t.classList.add('aroll');
  keyHit(21.50, -20);
  sfx('sub', 21.55, -16);
}
