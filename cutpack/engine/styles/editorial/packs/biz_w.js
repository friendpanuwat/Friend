/* =====================================================================
   PACK biz — overlay widgets (editorial-overlay form of the 11 business pieces Friend kept on 2026-11-04).
   Same rules as the base widgets (widgets/W1–W3.js): white card, main visual drawn into an S×S box (S ≈ 154 short,
   180 narrow), the kit adds 1–3 words (wlead / wkey, else lead / key). Same ids and slots as the cards.
   ===================================================================== */
const WG = 'rgba(20,33,61,.14)', WD = 'rgba(20,33,61,.32)';   // track grey and dim figure on the white widget card
const wbox_ = (p, css) => div(css, p);

WIDGET('B01', 'biz1', {pack: BIZ, code: 'BIZ-P1', name: 'ป้ายราคาห้อยเชือก', slots: B01_SLOTS, dur: [1.2, 3], hit: 'ราคานับถึงค่า ป้ายแกว่งรับ'}, (vis, S, s, T) => {
  const tag = div(`left:${S * .12}px;top:0;width:${S * .76}px;height:${S}px;transform-origin:50% 0;opacity:0`, vis,
    `<svg width="100%" height="100%" viewBox="0 0 100 130"><line x1="50" y1="0" x2="50" y2="22" stroke="${WD}" stroke-width="3"/><path d="M50 14 L96 36 V122 a6 6 0 0 1 -6 6 H10 a6 6 0 0 1 -6 -6 V36 Z" fill="${NAVY}"/><rect x="4" y="36" width="92" height="9" fill="${ACC}"/><circle cx="50" cy="28" r="5" fill="#fff"/></svg>`);
  const n = wnum(tag, '', S * .76, '#FFFFFF'); n.parentElement.style.top = `${S * .25}px`;
  const txt = v => (s.pre ?? '') + fmtNum(v, decOf(s.num)) + (tight(s.unit) ? s.unit : ''); n.textContent = txt(s.num);
  fitW(n, S * .76 * .74);   // inside the tag's body with a margin: 1,490 touched the tag's edges (Friend 2026-11-05)
  mv.fly(tag, T.t0 + .05, 'translate(0,-120px)'); mv.count(n, T.hit - MOTION.count.d, 0, s.num, txt);
  mv.wobble(tag, T.hit); snd('hit', T.hit);
});
WIDGET('B02', 'biz1', {pack: BIZ, code: 'BIZ-P2', name: 'ตัวนับยอดวิวของโพสต์', slots: B02_SLOTS, dur: [1.2, 3], hit: 'แถบยอดวิวเติมจนสุดหรือไหลลงเป็นสีแดง'}, (vis, S, s, T) => {
  const up = s.dir !== 'down';
  const th = div(`left:0;top:0;width:${S}px;height:${S * .56}px;border-radius:${S * .12}px;background:#EEF0F4;display:flex;align-items:center;justify-content:center;opacity:0`, vis, ico('play', S * .26, WD, 2.2)); mv.show(th, T.t0 + .1);
  div(`left:0;top:${S * .66}px;width:${S * .22}px;height:${S * .22}px`, vis, ico(s.icon ?? 'eye', S * .22, NAVY, 2.2));
  const tr = div(`left:${S * .28}px;top:${S * .71}px;width:${S * .72}px;height:${S * .12}px;border-radius:${S * .06}px;background:${WG};overflow:hidden`, vis);
  const f = div(`left:0;top:0;width:100%;height:100%;border-radius:${S * .06}px;background:${up ? ACC : RED};transform-origin:0 50%`, tr);
  mv.fill(f, T.hit, up ? .15 : .9, up ? 1 : .2); snd(up ? 'hit' : 'swipe', T.hit);
});
WIDGET('B08', 'biz1', {pack: BIZ, code: 'BIZ-P3', name: 'ใบเสร็จประทับตรา', slots: B08_SLOTS, dur: [1.0, 3], hit: 'ตราประทับกระแทกลงบนใบเสร็จ'}, (vis, S, s, T) => {
  const r = div(`left:${S * .14}px;top:0;width:${S * .72}px;height:${S}px;transform-origin:50% 0;transform:scaleY(0)`, vis,
    `<svg width="100%" height="100%" viewBox="0 0 72 100" preserveAspectRatio="none"><path d="M0 0 H72 V94 L66 100 L60 94 L54 100 L48 94 L42 100 L36 94 L30 100 L24 94 L18 100 L12 94 L6 100 L0 94 Z" fill="#F1F2F6" stroke="${WG}" stroke-width="1.5"/></svg>`);
  mv.grow(r, T.t0 + .05, 1);
  skel(r, `left:${S * .1}px;top:${S * .12}px;width:${S * .52}px`, [.9, .6, .8], {h: S * .06, gap: S * .07, t: T.t0 + .3});
  const st = div(`left:${S * .18}px;top:${S * .52}px;width:${S * .64}px;height:${S * .3}px;opacity:0`, vis);
  div(`left:0;top:0;width:100%;height:100%;border-radius:${S * .06}px;border:${S * .03}px solid ${INK};background:${ACC};display:flex;align-items:center;justify-content:center;transform:rotate(-12deg)`, st, ico('check', S * .2, INK, 3.4));
  mv.pop(st, T.hit, 'scale(2.2)'); snd('hit', T.hit);
});
WIDGET('B10', 'biz1', {pack: BIZ, code: 'BIZ-P4', name: 'คนถือถุงช้อปปิ้ง', slots: B10_SLOTS, dur: [1.0, 3], hit: 'คนที่ถูกพูดถึงสว่าง ถุงช้อปปิ้งเด้งขึ้นที่มือ'}, (vis, S, s, T) => {
  const z = S * .3;
  [0, 1, 2].forEach(i => { const p = human(vis, `left:${i * S * .34}px;top:${S * .1}px;width:${z}px;height:${z * 2}px;opacity:0`, i === 1 ? NAVY : WD); mv.pop(p, i === 1 ? T.hit : T.t0 + .1 + i * .05, i === 1 ? 'scale(1.3)' : 'scale(.5)');
    if (i !== 1) return; const b = div(`left:${S * .34 + z * .78}px;top:${S * .1 + z * .95}px;width:${z * .55}px;height:${z * .55}px;opacity:0`, vis, `<svg width="100%" height="100%" viewBox="0 0 60 60"><path d="M20 22 V16 a10 10 0 0 1 20 0 V22" fill="none" stroke="${INK}" stroke-width="6"/><rect x="8" y="20" width="44" height="38" rx="7" fill="${ACC}" stroke="${INK}" stroke-width="3"/></svg>`); mv.pop(b, T.hit + .05, 'scale(0)'); });
  snd('hit', T.hit);
});
WIDGET('B12', 'biz1', {pack: BIZ, code: 'BIZ-P5', name: 'กล่องพัสดุวิ่งตามลูกศร', slots: B12_SLOTS, dur: [1.0, 3], hit: 'กล่องพัสดุถึงปลายลูกศร แล้ว B เด้ง', wide: 2.2}, (vis, S, s, T, L) => {
  wflow(vis, S, L.VW, s, T, (x, y, b) => { const box = div(`left:${x}px;top:${y}px;width:${b}px;height:${b}px;border-radius:${b * .2}px;background:${NAVY};opacity:0`, vis); div(`left:${b * .42}px;top:0;width:${b * .16}px;height:100%;background:${ACC}`, box); return box; });
});
WIDGET('B07', 'biz1', {pack: BIZ, code: 'BIZ-P6', name: 'ตะกร้าถูกทิ้ง', slots: B07_SLOTS, dur: [1.0, 3], hit: 'ตะกร้าเอียงของหล่นออก ป้ายกากบาทแดงเด้ง'}, (vis, S, s, T) => {
  const cart = div(`left:${S * .04}px;top:${S * .18}px;width:${S * .78}px;height:${S * .78}px;transform-origin:30% 90%;opacity:0`, vis, ico('shopping-cart', S * .78, NAVY, 2.2));
  mv.pop(cart, T.t0 + .05); mv.slide(cart, T.hit - MOTION.slide.d, 'rotate(0)', 'rotate(-16deg)');
  const x = div(`left:${S * .66}px;top:0;width:${S * .34}px;height:${S * .34}px;border-radius:50%;background:${RED};display:flex;align-items:center;justify-content:center;opacity:0`, vis, ico('x', S * .22, '#fff', 3.4));
  mv.pop(x, T.hit); snd('hit', T.hit);
});
WIDGET('BIZ', 'h1', {pack: BIZ, code: 'BIZ-H1', name: 'ออเดอร์เด้งเข้า', slots: PARTS.BIZ.h1.meta.slots, dur: [1.2, 3.5], hit: 'ออเดอร์ใบสุดท้ายเด้งเข้าเป็นสีเน้น'}, (vis, S, s, T) => {
  const step = (T.hit - T.t0 - .3) / 2;
  [0, 1, 2].forEach(k => { const r = div(`left:0;top:${k * S * .34}px;width:${S}px;height:${S * .28}px;border-radius:${S * .08}px;background:${k === 2 ? ACC : '#EEF0F4'};opacity:0`, vis);
    div(`left:${S * .06}px;top:${S * .04}px;width:${S * .2}px;height:${S * .2}px`, r, ico(s.icon ?? 'package', S * .2, k === 2 ? INK : NAVY, 2.2));
    skel(r, `left:${S * .34}px;top:${S * .09}px;width:${S * .55}px`, [.9], {color: k === 2 ? 'rgba(5,5,5,.25)' : WG, h: S * .07});
    mv.pop(r, T.t0 + .3 + k * step, 'translateY(30px) scale(.8)'); });
  snd('hit', T.hit);
});
WIDGET('BIZ', 'h2', {pack: BIZ, code: 'BIZ-H2', name: 'กรวยลูกค้า', slots: PARTS.BIZ.h2.meta.slots, dur: [1.2, 3.5], hit: 'ชั้นสุดท้ายของกรวยสว่างเป็นสีเน้น'}, (vis, S, s, T) => {
  const n = 3, h = S * .3, g = S * .05, w = k => S * (1 - k * .28);
  for (let k = 0; k < n; k++) { const a = w(k), b = w(k + 1), y = k * (h + g);
    const band = div(`left:${(S - a) / 2}px;top:${y}px;width:${a}px;height:${h}px;background:${k === n - 1 ? ACC : k ? '#C9CEDA' : NAVY};clip-path:polygon(0 0,100% 0,${(a + b) / 2 / a * 100}% 100%,${(a - b) / 2 / a * 100}% 100%);opacity:0`, vis);
    mv.pop(band, k === n - 1 ? T.hit : T.t0 + .1 + k * .25, 'scaleX(.4)'); }
  snd('hit', T.hit);
});
WIDGET('BIZ', 'h3', {pack: BIZ, code: 'BIZ-H3', name: 'สถิติโพสต์', slots: PARTS.BIZ.h3.meta.slots, dur: [1.0, 3], hit: 'ค่าที่พูดถึงสว่างเป็นสีเน้นและเด้ง'}, (vis, S, s, T) => {
  const focus = s.focus ?? BIZ_STATS.find(([k]) => s[k] != null)?.[0], z = S * .46;
  BIZ_STATS.forEach(([k, icon], i) => { const on = k === focus, x = (i % 2) * (S - z), y = Math.floor(i / 2) * (S - z);
    const t = mt(vis, icon, T.t0 + .1 + i * .05, x, y, z, '#EEF0F4', NAVY); if (on) { const l = mt(vis, icon, T.hit, x, y, z, ACC, INK); mv.punch(l.inner, T.hit + .3); } });
  snd('hit', T.hit);
});
WIDGET('BIZ', 'h4', {pack: BIZ, code: 'BIZ-H4', name: 'ราคาแตกเป็นต้นทุนกับกำไร', slots: PARTS.BIZ.h4.meta.slots, dur: [1.2, 3.5], hit: 'ส่วนกำไรเผยเป็นสีเน้น'}, (vis, S, s, T) => {
  const n = s.parts.length, g = S * .04, w = (S - g * n) / (n + 1), shades = ['#46536E', '#7A869E', '#A9B2C3'];
  for (let k = 0; k <= n; k++) { const seg = div(`left:${k * (w + g)}px;top:${S * .3}px;width:${w}px;height:${S * .4}px;border-radius:${S * .06}px;background:${k < n ? shades[k] : '#EEF0F4'};transform-origin:0 50%`, vis);
    mv.fill(seg, T.t0 + .2 + MOTION.fill.d * .5 + k * MOTION.grow.step, 0, 1); }
  const lit = div(`left:${n * (w + g)}px;top:${S * .3}px;width:${w}px;height:${S * .4}px;border-radius:${S * .06}px;background:${ACC};opacity:0`, vis); mv.pop(lit, T.hit, 'scale(.4)');
  snd('hit', T.hit);
});
WIDGET('BIZ', 'h5', {pack: BIZ, code: 'BIZ-H5', name: 'หน้าร้านเปิด', slots: PARTS.BIZ.h5.meta.slots, dur: [1.0, 3], hit: 'ป้ายหน้าร้านพลิกเป็น "เปิด" ไฟในร้านติด'}, (vis, S, s, T) => {
  div(`left:${S * .04}px;top:${S * .26}px;width:${S * .92}px;height:${S * .74}px;border-radius:${S * .06}px;border:${S * .03}px solid ${NAVY};background:#fff`, vis);
  const glow = div(`left:${S * .14}px;top:${S * .42}px;width:${S * .38}px;height:${S * .32}px;border-radius:${S * .04}px;background:#EEF0F4`, vis);
  const lit = div(`left:${S * .14}px;top:${S * .42}px;width:${S * .38}px;height:${S * .32}px;border-radius:${S * .04}px;background:${ACC};opacity:0`, vis); mv.show(lit, T.hit);
  const awn = div(`left:0;top:${S * .14}px;width:${S}px;height:${S * .2}px;transform-origin:50% 0;transform:scaleY(0);background:repeating-linear-gradient(90deg,${ACC} 0 ${S * .125}px,${NAVY} ${S * .125}px ${S * .25}px);border-radius:0 0 ${S * .06}px ${S * .06}px`, vis);
  mv.grow(awn, T.t0 + .1, 1);
  const sign = (bg, ink, txt) => div(`left:${S * .58}px;top:${S * .46}px;width:${S * .32}px;height:${S * .18}px;border-radius:${S * .04}px;background:${bg};color:${ink};display:flex;align-items:center;justify-content:center;font-family:KeySans;font-size:${S * .11}px;white-space:nowrap;opacity:0`, vis, txt);
  const cl = sign(NAVY, '#fff', 'ปิด'), op = sign(ACC, INK, s.open ?? 'เปิด');
  mv.show(cl, T.t0 + .3); mv.slide(cl, T.hit - MOTION.slide.d, 'rotateY(0)', 'rotateY(90deg)'); mv.pop(op, T.hit, 'rotateY(-90deg)');
  snd('hit', T.hit);
});
