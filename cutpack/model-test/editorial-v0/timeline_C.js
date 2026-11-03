/* "รวยคือเงินยังเข้า ตอนเราหยุดทำงาน" — Thai, 22.0 s talking head + HOLD 1.0. No B-roll → Flat × Glow MG. */
const N = {color: NAVY}, NS = s => ({color: NAVY, size: s});
const GLASS = 'background:linear-gradient(160deg,rgba(255,255,255,.26),rgba(255,255,255,.09));border:2px solid rgba(255,255,255,.34);backdrop-filter:blur(18px);box-shadow:0 30px 70px rgba(0,0,0,.5),inset 0 1px 0 rgba(255,255,255,.25)';
/* glass banknote that drops from (x,y) by `dist` px into a wallet and vanishes; stopAt → freezes mid-air instead */
const note = (c, t, x, y, {size = 140, dist = 460, d = .62, stopAt} = {}) => {
  const n = div(`left:${x}px;top:${y}px;width:${size}px;height:${size}px;border-radius:${size * .26}px;display:flex;align-items:center;justify-content:center;opacity:0;${GLASS}`, c, ico('banknote', size * .52, '#fff'));
  if (stopAt) A(n, [{opacity: 0, transform: 'translateY(-90px)'}, {opacity: 1, transform: `translateY(${stopAt}px)`}], t, .16, {e: 'ease-in'});
  else A(n, [{opacity: 0, transform: 'translateY(-90px)'}, {opacity: 1, transform: 'translateY(0)', offset: .18},
             {opacity: 1, transform: `translateY(${dist - 60}px) scale(.82)`, offset: .82}, {opacity: 0, transform: `translateY(${dist}px) scale(.55)`}], t, d, {e: 'ease-in'});
  return n;
};

cards([[2.15, 4.13], [6.15, 7.13], [7.15, 9.13], [11.15, 13.13], [17.15, 20.13], [20.88, 23.00]]);

/* ---------- camera: hard punch-ins on key words ---------- */
for (const [t, z] of [[0, 1], [0.15, 1.1], [4.15, 1], [5.55, 1.1], [9.15, 1], [9.62, 1.12], [10.15, 1], [10.58, 1.08],
  [13.15, 1], [13.80, 1.1], [14.15, 1], [16.25, 1.12], [17.15, 1], [20.18, 1.12], [20.88, 1]]) zoom(t, z);

/* ---------- A-roll captions (chest level, chin ≈ y 1090) ---------- */
cap({t0: 0.00, t1: 2.13, lines: [[['เกษียณ', 'i', 0.15, {size: 170}]], [['คือ', 'l', 0.62], ['ถ้าวันเนี่ย', 'l', 1.07]]]});
keyHit(0.15);
cap({t0: 4.15, t1: 6.13, lines: [[['หรือเงิน', 'l', 4.15], ['ที่คุณต้อง', 'l', 5.15]], [['เสียสละ', 'hl', 5.55]]]});
keyHit(5.55);
cap({t0: 9.15, t1: 10.13, lines: [[['คุณอยู่ได้', 'l', 9.15]], [['กี่เดือน?', 'i', 9.62]]]});
keyHit(9.62);
cap({t0: 10.15, t1: 11.13, lines: [[['ถ้าวันนี้', 'l', 10.15]], [['คำตอบ', 'k', 10.58]], [['ของคุณคือ', 'l', 10.85]]]});
keyHit(10.58);
cap({t0: 13.15, t1: 14.13, lines: [[['เขาไม่เรียกว่า', 'l', 13.15]], [['รวย', 'k', 13.80]]]});
keyHit(13.80);
cap({t0: 14.15, t1: 15.13, lines: [[['แต่ถ้าคุณบอกว่า', 'm', 14.15]]]});
cap({t0: 15.15, t1: 17.13, lines: [[['ถ้าวันนี้', 'l', 15.15], ['ผม', 'l', 16.07]], [['ไม่ทำงานเลย', 'i', 16.25]]]});
keyHit(16.25);
cap({t0: 20.15, t1: 20.86, lines: [[['รวยแล้ว', 'k', 20.18, {size: 170}]]]});
keyHit(20.18);

/* ---------- C1 cream poster · "Active income" = you trade work for money, every month ---------- */
{
  const c = card(2.15, 4.13, {bg: 'cream', sound: 'swipe'});
  curl(c, 2.15);
  txt(c, [[['เงิน', 'l', 2.15, NS(70)], ['Active income', 'kw', 2.38, NS(112)]]], 'top:200px');
  const p = panel(c, 'left:170px;top:430px;width:740px;height:986px', 2.15);
  tile(p, 'user', 2.30, 'left:70px;top:100px', {size: 240, bg: NAVY, color: '#fff', sound: null});
  tile(p, 'clock', 2.48, 'left:236px;top:60px', {size: 110, bg: '#fff', color: NAVY});
  const ar = svg(130, 60, `<path d="M8 30 L118 30 M94 8 L120 30 L94 52" fill="none" stroke="${NAVY}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>`, 'left:330px;top:190px', p);
  draw(ar.querySelector('path'), 2.58, .3);
  const money = tile(p, 'banknote', 2.75, 'left:470px;top:100px', {size: 240, bg: ACC, color: '#0A0A0A'});
  div('left:60px;top:410px;width:620px;height:3px;background:rgba(20,33,61,.1)', p);
  skel(p, 'left:70px;top:460px;width:600px', [.85, .55], {t: 2.90});
  for (let k = 0; k < 4; k++) {
    const b = div(`left:${70 + k * 156}px;top:650px;width:130px;height:130px;border-radius:34px;display:flex;align-items:center;justify-content:center;opacity:0;background:rgba(20,33,61,.07)`, p, ico('banknote', 70, NAVY));
    popIn(b, 3.00 + k * .14);
  }
  skel(p, 'left:70px;top:850px;width:600px', [.6], {t: 3.20});
  punch(money.inner, 3.50, 1.16);
  txt(c, [[['แปลว่า', 'l', 3.15, N], ['เงินเดือน', 'hl', 3.50, {size: 100}], ['คุณ', 'l', 3.85, N]]], 'top:1450px');
  keyHit(3.50);
}
/* ---------- C2 white · "เวลา ไปหามา" — hourglass flips (time spent) ---------- */
{
  const c = card(6.15, 7.13, {bg: 'white', sound: 'swipe'});
  const w = div('left:430px;top:400px;width:220px;height:220px', c);
  tile(w, 'hourglass', 6.18, 'left:0;top:0', {size: 220, bg: NAVY, color: '#fff', sound: null});
  A(w, [{transform: 'rotate(0deg)'}, {transform: 'rotate(180deg)'}], 6.60, .42, {e: BOUNCE});
  // time ring around the hourglass empties on "ไปหามา" (the time you spend)
  const ring = svg(360, 360, `<circle cx="180" cy="180" r="166" fill="none" stroke="rgba(20,33,61,.1)" stroke-width="14"/><circle cx="180" cy="180" r="166" fill="none" stroke="${NAVY}" stroke-width="14" stroke-linecap="round" transform="rotate(-90 180 180)"/>`, 'left:360px;top:330px;opacity:0', c);
  A(ring, [{opacity: 0, transform: 'scale(.85)'}, {opacity: 1, transform: 'none'}], 6.20, .3, {e: SMOOTH});
  const arc = ring.querySelectorAll('circle')[1]; arc.setAttribute('pathLength', 1); arc.style.strokeDasharray = 1;
  A(arc, [{strokeDashoffset: 0}, {strokeDashoffset: -1}], 6.60, .48, {e: INOUT});
  txt(c, [[['เวลา', 'iw', 6.18, NS(190)]], [['ไปหามา', 'l', 6.60, NS(68)]]], 'top:740px');
  keyHit(6.18);
}
/* ---------- C3 dark · money drops into the wallet, then stops mid-air on "หยุด" ---------- */
{
  const c = card(7.15, 9.13);
  mood(c, {seed: 1});
  const wal = tile(c, 'wallet', 7.18, 'left:370px;top:650px', {size: 340, bg: '#fff', color: NAVY});
  note(c, 7.18, 470, 170);
  note(c, 7.40, 470, 170);
  const n3 = note(c, 7.54, 470, 170, {stopAt: 150});
  cross(c, 7.72, 'left:410px;top:260px', {size: 260});
  wobble(wal.inner, 7.86);
  const t = txt(c, [[['เงินมัน', 'l', 7.15]], [['หยุด', 'k', 7.70, {size: 190}], ['เข้ามา', 'l', 8.10]]], 'top:1230px'); t.classList.add('aroll');
  keyHit(7.70);
}
/* ---------- C4 navy · "1 ปี 2 ปี 3 ปี" — the money battery drains one step per year ---------- */
{
  const c = card(11.15, 13.13, {bg: 'navy'});
  const wal = tile(c, 'wallet', 11.18, 'left:440px;top:360px', {size: 200, bg: '#fff', color: NAVY});
  const yrs = txt(c, [[['1 ปี', 'kw', 11.20, {size: 150}], ['2 ปี', 'kw', 11.85, {size: 150}], ['3 ปี', 'kw', 12.50, {size: 150}]]], 'top:660px');
  yrs.querySelectorAll('.ch').forEach(ch => ch.style.margin = '0 26px');
  const bat = div('left:126px;top:1040px;width:780px;height:150px;opacity:0', c);
  A(bat, [{opacity: 0, transform: 'scale(.92)'}, {opacity: 1, transform: 'none'}], 11.15, .35, {e: SPRING});
  div('left:0;top:0;width:780px;height:150px;box-sizing:border-box;border-radius:40px;border:6px solid rgba(255,255,255,.85)', bat);
  div('left:784px;top:45px;width:22px;height:60px;border-radius:0 12px 12px 0;background:rgba(255,255,255,.85)', bat);
  const fill = div(`left:16px;top:16px;width:748px;height:118px;border-radius:26px;transform-origin:0 50%;background:${ACC}`, bat);
  for (const x of [265, 515]) div(`left:${x}px;top:16px;width:6px;height:118px;background:#0B1530`, bat);
  const T0 = 11.20, D = 1.62, o = t => (t - T0) / D;
  A(fill, [{transform: 'scaleX(1)', background: ACC}, {transform: 'scaleX(.667)', offset: o(11.50)}, {transform: 'scaleX(.667)', offset: o(11.85)},
           {transform: 'scaleX(.333)', offset: o(12.15)}, {transform: 'scaleX(.333)', background: ACC, offset: o(12.50)},
           {transform: 'scaleX(.06)', background: '#FF3B30'}], T0, D, {e: 'ease-in-out'});
  wobble(wal.inner, 12.72);
  keyHit(12.50);
}
/* ---------- C5 dark · money keeps dropping in; the life line runs all the way to "วันตาย" ---------- */
{
  const c = card(17.15, 20.13);
  mood(c, {seed: 2});
  const wal = tile(c, 'wallet', 17.18, 'left:400px;top:430px', {size: 280, bg: '#fff', color: NAVY});
  for (const t of [17.30, 17.85, 18.40, 18.95, 19.50]) { note(c, t, 475, 150, {size: 130, dist: 300, d: .55}); punch(wal.inner, t + .5, 1.05); }
  div('left:130px;top:866px;width:750px;height:8px;border-radius:4px;background:rgba(255,255,255,.18)', c);
  const line = div(`left:130px;top:866px;width:750px;height:8px;border-radius:4px;transform-origin:0 50%;background:${ACC};box-shadow:0 0 18px ${ACC}88`, c);
  A(line, [{transform: 'scaleX(0)'}, {transform: 'scaleX(1)'}], 17.35, 1.80, {e: 'ease-in-out'});
  const dot = div('left:112px;top:852px;width:36px;height:36px;border-radius:50%;background:#fff;opacity:0', c);
  popIn(dot, 17.30);
  const lab = div('left:50px;top:910px;width:160px;text-align:center;font-family:Lead;font-size:46px;color:#fff;opacity:0', c, 'วันนี้');
  A(lab, [{opacity: 0, transform: 'translateY(16px)'}, {opacity: 1, transform: 'none'}], 17.40, .25, {e: SMOOTH});
  const end = tile(c, 'check', 19.15, 'left:820px;top:810px', {size: 120, bg: ACC, color: '#0A0A0A', float: false});
  ripple(c, 880, 870, 19.15, 3);
  punch(end.inner, 19.62, 1.15);
  const t = txt(c, [[['แต่ผมอยู่ได้ถึง', 'l', 17.15, {size: 64}]], [['วันตาย', 'k', 19.15, {size: 180}]]], 'top:1220px'); t.classList.add('aroll');
  keyHit(19.15);
}
/* ---------- F1 shrink-to-card on cream · "อันเนี่ย เขาเรียกว่า รวย" (holds 1 s after speech) ---------- */
{
  const c = frame(20.88, 23.00, {bg: 'cream', s: .54, y: 1095});
  txt(c, [[['อันเนี่ย', 'l', 20.88, NS(62)], ['เขาเรียกว่า', 'l', 21.15, NS(62)]], [['รวย', 'hl', 21.60, {size: 150}]]], 'top:190px');
  keyHit(21.60);
  sfx('sub', 21.58, -16);
}
