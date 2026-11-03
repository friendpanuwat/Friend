/* Overlay widgets B01–B05. Each draws its main visual into an S×S box (S ≈ 150 short, 180 narrow) on a white card. */
const mt = (p, icon, t, x, y, size, bg, color) => tile(p, icon, t, `left:${x}px;top:${y}px`, {size, bg, color, sound: false, float: false});
const wnum = (p, text, S, color, t) => { const w = div(`left:0;top:0;width:${S}px;height:${S}px;display:flex;align-items:center;justify-content:center`, p);
  const n = div(`position:relative;font-family:KeySans;font-size:${S * .42}px;line-height:1;letter-spacing:-2px;white-space:nowrap;color:${color}`, w); n.textContent = text; fitW(n, S - 6); return n; };

/* B01 v1: the number counts up and lands with a punch */
WIDGET('B01', 'v1', {name: 'ตัวเลขนับขึ้น', slots: B01_SLOTS, dur: [1.2, 3], hit: 'ตัวเลขนับถึงค่าแล้วเด้ง'}, (vis, S, s, T) => {
  const n = wnum(vis, (s.pre ?? '') + fmtNum(s.num, decOf(s.num)) + (tight(s.unit) ? s.unit : ''), S, NAVY);
  mv.count(n, T.hit - MOTION.count.d, 0, s.num, v => (s.pre ?? '') + fmtNum(v, decOf(s.num)) + (tight(s.unit) ? s.unit : ''));
  mv.punch(n.parentElement, T.hit); snd('hit', T.hit);
});
/* B01 v2: a ring fills to num/of with the number inside */
WIDGET('B01', 'v2', {name: 'วงแหวนเปอร์เซ็นต์', slots: B01_SLOTS, dur: [1.2, 3], hit: 'วงแหวนเติมถึงค่า'}, (vis, S, s, T) => {
  const f = Math.max(0, Math.min(1, s.num / (s.of ?? 100))), r = S / 2 - 12;
  const g = svg(S, S, `<circle cx="${S / 2}" cy="${S / 2}" r="${r}" fill="none" stroke="rgba(20,33,61,.1)" stroke-width="18"/><circle cx="${S / 2}" cy="${S / 2}" r="${r}" fill="none" stroke="${NAVY}" stroke-width="18" stroke-linecap="round" transform="rotate(-90 ${S / 2} ${S / 2})"/>`, 'left:0;top:0', vis);
  mv.ring(g.querySelectorAll('circle')[1], T.hit - MOTION.ring.d, f);
  const n = div(`left:0;top:0;width:${S}px;height:${S}px;display:flex;align-items:center;justify-content:center`, vis);
  const t = div(`position:relative;font-family:KeySans;font-size:${S * .24}px;white-space:nowrap;color:${NAVY}`, n); t.textContent = fmtNum(s.num, decOf(s.num)) + (s.unit === '%' ? '%' : ''); fitW(t, S * .58);   /* clear of the ring at every width */
  mv.punch(g, T.hit); snd('hit', T.hit);
});
/* B02 v1: four bars — rising, or standing then falling at the key word (red) */
WIDGET('B02', 'v1', {name: 'กราฟแท่ง', slots: B02_SLOTS, dur: [1.2, 3], hit: 'ขึ้น: แท่งสุดท้ายเด้ง · ลง: แท่งร่วง'}, (vis, S, s, T) => {
  const up = s.dir === 'up', v0 = up ? [.3, .48, .66, .92] : [.92, .84, .78, .72], v1 = [.8, .56, .36, .16];
  const b = bars(vis, v0, T.t0 + .15, `left:${S * .08}px;top:${S * .06}px`, {w: S * .17, gap: S * .07, h: S * .82, color: 'rgba(20,33,61,.8)', last: up ? ACC : RED, radius: 8, ...(up ? {} : {to: v1, tTo: T.hit})});
  if (up) mv.punch(b.lastChild, T.hit); snd(up ? 'hit' : 'swipe', T.hit);
});
/* B02 v3: one arrow tile, accent up / red down */
WIDGET('B02', 'v3', {name: 'ลูกศรใหญ่', slots: B02_SLOTS, dur: [1.0, 3], hit: 'ลูกศรเด้งตรงคำ'}, (vis, S, s, T) => {
  const up = s.dir === 'up', a = mt(vis, up ? 'trending-up' : 'trending-down', T.t0 + .1, 0, 0, S, up ? ACC : RED, up ? INK : '#fff');
  mv.punch(a.inner, T.hit); snd('hit', T.hit);
});
/* B03 v1: two small tiles with a vs between; the winner pops, the loser fades */
WIDGET('B03', 'v1', {name: 'แบ่งซ้ายขวา + vs', slots: B03_SLOTS, dur: [1.2, 3], hit: 'ฝั่งที่ชนะเด้ง ฝั่งที่แพ้จาง'}, (vis, S, s, T) => {
  const z = S * .44, A_ = mt(vis, s.ia, T.t0 + .1, 0, S * .28, z, s.win === 'a' ? ACC : NAVY, s.win === 'a' ? INK : '#fff'), B_ = mt(vis, s.ib, T.t0 + .2, S - z, S * .28, z, s.win === 'b' ? ACC : NAVY, s.win === 'b' ? INK : '#fff');
  const vs = div(`left:${S / 2 - S * .13}px;top:${S / 2 - S * .13}px;width:${S * .26}px;height:${S * .26}px;border-radius:50%;background:${ACC};display:flex;align-items:center;justify-content:center;font-family:KeySerif;font-size:${S * .13}px;color:${INK};box-shadow:0 6px 14px rgba(0,0,0,.25);opacity:0`, vis, 'vs');
  mv.pop(vs, T.t0 + .3);
  if (s.win === 'a' || s.win === 'b') { mv.dim(s.win === 'a' ? B_ : A_, T.hit); mv.punch((s.win === 'a' ? A_ : B_).inner, T.hit); }
  snd('hit', T.hit);
});
/* B03 v4: before | after — the cover over "after" slides away at the key word */
WIDGET('B03', 'v4', {name: 'ก่อนไปหลัง', slots: B03_SLOTS, dur: [1.2, 3], hit: 'แผ่นปิดเลื่อนออก เผยฝั่งหลัง'}, (vis, S, s, T) => {
  const fr = div(`left:0;top:${S * .1}px;width:${S}px;height:${S * .8}px;border-radius:20px;overflow:hidden`, vis);
  div(`left:0;top:0;width:${S / 2}px;height:${S * .8}px;background:#E4E6EC;display:flex;align-items:center;justify-content:center`, fr, ico(s.ia, S * .3, 'rgba(20,33,61,.7)', 2));
  div(`left:${S / 2}px;top:0;width:${S / 2}px;height:${S * .8}px;background:${ACC};display:flex;align-items:center;justify-content:center`, fr, ico(s.ib, S * .3, INK, 2.2));
  const cover = div(`left:${S / 2}px;top:0;width:${S / 2 + 4}px;height:${S * .8}px;background:#C9CDD6;border-left:5px solid #fff`, fr);
  mv.slide(cover, T.hit - .2, 'translateX(0)', `translateX(${S / 2 + 20}px)`); snd('swipe', T.hit - .2);
});
/* B04 v1: numbered diamonds light up one after another */
WIDGET('B04', 'v1', {name: 'ขั้น 1-2-3', slots: B04_SLOTS, dur: [1.4, 3.5], hit: 'แต่ละขั้นขึ้นตรงคำ'}, (vis, S, s, T) => {
  const n = Math.min(3, s.items.length), at = itemTimes(s, T);
  for (let i = 0; i < n; i++) { const y = S * (.04 + i * .33); const z = S * .26, d = div(`left:${S * .02}px;top:${y}px;width:${z}px;height:${z}px;display:flex;align-items:center;justify-content:center;opacity:0`, vis);
    div(`left:${z * .12}px;top:${z * .12}px;width:${z * .76}px;height:${z * .76}px;border-radius:${z * .14}px;background:${ACC};transform:rotate(45deg)`, d);
    div(`position:relative;font-family:KeySans;font-size:${z * .5}px;line-height:1;color:${INK}`, d, String(i + 1)); mv.pop(d, at[i], 'scale(.4) rotate(-30deg)');
    const ln = div(`left:${S * .36}px;top:${y + S * .1}px;width:${S * .6}px;height:${S * .1}px;border-radius:${S * .05}px;background:${i === n - 1 ? ACC : 'rgba(20,33,61,.15)'};transform-origin:0 50%`, vis); mv.growX(ln, at[i], 1); }
});
/* B04 v2: three boxes get ticked one by one */
WIDGET('B04', 'v2', {name: 'เช็กลิสต์ติ๊ก', slots: B04_SLOTS, dur: [1.4, 3.5], hit: 'ติ๊กทีละข้อ'}, (vis, S, s, T) => {
  const n = Math.min(3, s.items.length), at = itemTimes(s, T), z = S * .24;
  for (let i = 0; i < n; i++) { const y = S * (.05 + i * .33);
    div(`left:0;top:${y}px;width:${z}px;height:${z}px;border-radius:${z * .26}px;border:${S * .025}px solid rgba(20,33,61,.35)`, vis);
    div(`left:${z + S * .08}px;top:${y + z * .35}px;width:${S * .6}px;height:${z * .3}px;border-radius:${z}px;background:rgba(20,33,61,.13)`, vis);
    const tk = div(`left:0;top:${y}px;width:${z}px;height:${z}px;border-radius:${z * .26}px;background:${ACC};display:flex;align-items:center;justify-content:center;opacity:0`, vis, ico('check', z * .7, INK, 3.2)); mv.pop(tk, at[i], 'scale(1.6)'); }
  snd('hit', T.hit);
});
/* B05 v1: the wrong word, struck through in red at the key word (the right word is the big text) */
WIDGET('B05', 'v1', {name: 'X โดนขีดฆ่า', slots: B05_SLOTS, dur: [1.2, 3], hit: 'เส้นแดงขีดฆ่า X'}, (vis, S, s, T) => {
  const w = div(`left:0;top:0;width:${S}px;height:${S}px;display:flex;align-items:center;justify-content:center`, vis);
  const x = div(`position:relative;font-family:CardSans;font-size:${S * .26}px;white-space:nowrap;color:rgba(20,33,61,.75)`, w); x.textContent = s.x; fitW(x, S - 4);
  strike(x, T.hit, RED); snd('cross', T.hit);
});
/* B05 v2: a crossed chip over a checked chip */
WIDGET('B05', 'v2', {name: 'ชิป X กากบาท ชิป Y ถูก', slots: B05_SLOTS, dur: [1.2, 3], hit: 'X โดนกากบาท Y ได้ถูก'}, (vis, S, s, T) => {
  const row = (y, good, t) => { const r = div(`left:0;top:${y}px;width:${S}px;height:${S * .4}px;border-radius:${S * .2}px;display:flex;align-items:center;justify-content:center;opacity:0;background:${good ? ACC : '#EEF0F4'}`, vis, ico(good ? 'check' : 'x', S * .26, good ? INK : RED, 3)); mv.chip(r, t); return r; };
  const X = row(S * .04, false, T.t0 + .1); mv.dim(X, T.hit); row(S * .56, true, yTime(s, T)); snd('cross', T.hit);
});
