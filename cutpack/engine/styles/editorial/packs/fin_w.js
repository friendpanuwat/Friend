/* PACK fin — overlay widgets (the 11 finance pieces Friend kept on 2026-11-04). Rules as in packs/biz_w.js. */
const wcoin = (p, x, y, z, on) => coin(p, x, y, z, on ? ACC : '#EEF0F4', on ? INK : WD);

WIDGET('B01', 'fin1', {pack: FIN, code: 'FIN-P1', name: 'ตารางเหรียญ', slots: B01_SLOTS, dur: [1.2, 3], hit: 'เหรียญตามสัดส่วนเปลี่ยนเป็นสีเน้นทีละเหรียญ'}, (vis, S, s, T) => {
  const of = shareOf(s) ?? 10, k = Math.round(10 * Math.max(0, Math.min(1, s.num / of))), z = S * .19;
  for (let i = 0; i < 10; i++) { const x = (i % 5) * S * .2 + S * .005, y = S * .26 + Math.floor(i / 5) * S * .26;
    mv.pop(wcoin(vis, x, y, z, false), T.t0 + .1 + i * .03, 'scale(.4)'); if (i < k) mv.pop(wcoin(vis, x, y, z, true), T.hit + i * .05, 'scale(1.5)'); }
  snd('hit', T.hit);
});
WIDGET('B02', 'fin1', {pack: FIN, code: 'FIN-P2', name: 'กราฟแท่งเทียน', slots: B02_SLOTS, dur: [1.2, 3], hit: 'แท่งเทียนแท่งสุดท้ายพุ่งขึ้นหรือดิ่งลงเป็นสีแดง'}, (vis, S, s, T) => {
  const up = s.dir !== 'down', u = S / 12, w = S * .16, prev = up ? [[2, 4], [4, 3], [3, 5]] : [[9, 8], [8, 9], [9, 7]];
  prev.forEach(([a, b], i) => { const lo = Math.min(a, b), hi = Math.max(a, b), x = i * S * .24;
    div(`left:${x + w / 2 - 2}px;top:${S - (hi + .6) * u}px;width:4px;height:${(hi - lo + 1.2) * u}px;background:#7A869E`, vis);
    const bd = div(`left:${x}px;top:${S - hi * u}px;width:${w}px;height:${(hi - lo) * u}px;border-radius:4px;background:#A9B2C3;transform-origin:50% 100%`, vis); mv.grow(bd, T.t0 + .1, 1, i); });
  const [a, b] = up ? [5, 11.5] : [7, 1], lo = Math.min(a, b), hi = Math.max(a, b);
  const last = div(`left:${3 * S * .24}px;top:${S - hi * u}px;width:${w}px;height:${(hi - lo) * u}px;border-radius:4px;background:${up ? ACC : RED};border:2px solid ${up ? INK : RED};transform-origin:50% ${up ? '100%' : '0'}`, vis);
  mv.fill(last, T.hit, 0, 1, 'Y'); snd('hit', T.hit);
});
WIDGET('B12', 'fin1', {pack: FIN, code: 'FIN-P3', name: 'เหรียญไหลตามลูกศร', slots: B12_SLOTS, dur: [1.0, 3], hit: 'เหรียญสุดท้ายถึงปลายลูกศร แล้ว B เด้ง'}, (vis, S, s, T) => {
  const z = S * .38; mt(vis, s.ia, T.t0 + .1, 0, S * .5, z, '#EEF0F4', NAVY);
  [0, 1].forEach(k => { const c = wcoin(vis, z - S * .02, S * .3, S * .18, true); mv.pop(c, T.t0 + .3 + k * .1); mv.slide(c, T.hit - MOTION.slide.d - (1 - k) * .25, 'translateX(0)', `translateX(${S - 2 * z}px)`); });
  mt(vis, s.ib, T.hit, S - z, S * .5, z, ACC, INK); snd('hit', T.hit);
});
WIDGET('B07', 'fin1', {pack: FIN, code: 'FIN-P4', name: 'บัตรเครดิตแตกร้าว', slots: B07_SLOTS, dur: [1.0, 3], hit: 'รอยร้าวสีแดงวิ่งข้ามบัตร บัตรแยกเป็นสองซีก เส้นแดงหายไปทันที'}, (vis, S, s, T) => {
  const card = div(`left:0;top:${S * .2}px;width:${S}px;height:${S * .6}px;opacity:0`, vis), W_ = S, H_ = S * .6;
  const half = clip => { const h = div(`left:0;top:0;width:${W_}px;height:${H_}px;clip-path:${clip}`, card); div(`left:0;top:0;width:100%;height:100%;border-radius:${S * .08}px;background:${NAVY}`, h); div(`left:${S * .1}px;top:${S * .2}px;width:${S * .18}px;height:${S * .13}px;border-radius:4px;background:${ACC}`, h); return h; };
  const L = half(`polygon(0 0,${S * .45}px 0,${S * .4}px ${H_ * .3}px,${S * .5}px ${H_ * .6}px,${S * .43}px ${H_}px,0 ${H_}px)`);
  const R = half(`polygon(${S * .45}px 0,100% 0,100% 100%,${S * .43}px ${H_}px,${S * .5}px ${H_ * .6}px,${S * .4}px ${H_ * .3}px)`);
  mv.pop(card, T.t0 + .1, 'scale(.7) rotate(-6deg)');
  const ln = svg(W_, H_, `<path d="M${S * .45} 0 L${S * .4} ${H_ * .3} L${S * .5} ${H_ * .6} L${S * .43} ${H_}" fill="none" stroke="${RED}" stroke-width="5" stroke-linejoin="round"/>`, 'left:0;top:0', card);
  mv.draw(ln.querySelector('path'), T.hit - .3, .3);
  HOOKS.push(t => { ln.style.visibility = t >= T.hit ? 'hidden' : 'visible'; });   // gone at once when the halves part (Friend 2026-11-04)
  mv.slide(L, T.hit, 'translate(0,0) rotate(0)', `translate(${-S * .06}px,3px) rotate(-4deg)`); mv.slide(R, T.hit, 'translate(0,0) rotate(0)', `translate(${S * .06}px,-3px) rotate(4deg)`);
  snd('hit', T.hit);
});
WIDGET('B08', 'fin1', {pack: FIN, code: 'FIN-P5', name: 'กระเป๋าสตางค์เต็ม', slots: B08_SLOTS, dur: [1.0, 3], hit: 'เหรียญสุดท้ายหล่นลงกระเป๋าสตางค์ แถบเต็มพอดี'}, (vis, S, s, T) => {
  const wl = div(`left:0;top:${S * .34}px;width:${S}px;height:${S * .5}px;border-radius:${S * .1}px;background:${NAVY};opacity:0`, vis);
  div(`left:${S * .55}px;top:${S * .14}px;width:${S * .45}px;height:${S * .22}px;border-radius:${S * .11}px 0 0 ${S * .11}px;background:#2A3A5E`, wl); div(`left:${S * .6}px;top:${S * .21}px;width:${S * .08}px;height:${S * .08}px;border-radius:50%;background:${ACC}`, wl);
  mv.pop(wl, T.t0 + .05, 'translateY(20px) scale(.9)');
  const step = (T.hit - T.t0 - .5) / 2;
  [0, 1, 2].forEach(k => { const c = wcoin(vis, S * .36, 0, S * .28, true); mv.fly(c, T.t0 + .5 + k * step - MOTION.fly.d, 'translate(0,-60px)'); mv.slide(c, T.t0 + .5 + k * step, 'translateY(0)', `translateY(${S * .3}px) scale(.2)`); });
  const tr = div(`left:0;top:${S * .9}px;width:${S}px;height:${S * .08}px;border-radius:${S * .04}px;background:${WG};overflow:hidden`, vis);
  mv.fill(div(`left:0;top:0;width:100%;height:100%;background:${ACC};transform-origin:0 50%`, tr), T.hit, 0, 1); snd('hit', T.hit);
});
WIDGET('B09', 'fin1', {pack: FIN, code: 'FIN-P6', name: 'ตารางผ่อนรายเดือน', slots: B09_SLOTS, dur: [1.2, 3.5], hit: 'งวดสุดท้ายถูกติ๊กตรงคำที่บอกเวลา'}, (vis, S, s, T) => {
  const z = S * .22, step = (T.hit - T.t0 - .4) / 11;
  for (let i = 0; i < 12; i++) { const x = (i % 4) * S * .26, y = Math.floor(i / 4) * S * .34 + S * .04;
    div(`left:${x}px;top:${y}px;width:${z}px;height:${z}px;border-radius:${z * .25}px;background:#EEF0F4`, vis);
    mv.pop(div(`left:${x}px;top:${y}px;width:${z}px;height:${z}px;border-radius:${z * .25}px;background:${i === 11 ? ACC : NAVY};display:flex;align-items:center;justify-content:center;opacity:0`, vis, ico('check', z * .7, i === 11 ? INK : '#fff', 3.4)), T.t0 + .4 + i * step, 'scale(.3)'); }
  snd('hit', T.hit);
});
WIDGET('FIN', 'h1', {pack: FIN, code: 'FIN-H1', name: 'ดอกเบี้ยทบต้น', slots: PARTS.FIN.h1.meta.slots, dur: [1.2, 3.5], hit: 'เส้นเงินทบต้นวิ่งถึงปลาย ช่องห่างสว่างเป็นสีเน้น'}, (vis, S, s, T) => {
  const pts = Array.from({length: 13}, (_, i) => `${(i / 12 * S).toFixed(1)} ${(S - (Math.pow(1.17, i) - 1) / (Math.pow(1.17, 12) - 1) * S * .92).toFixed(1)}`);
  const g = svg(S, S, `<path d="M0 ${S} L${S} ${S * .72}" stroke="#A9B2C3" stroke-width="5" stroke-dasharray="3 8" fill="none"/><path d="M${pts.join(' L')}" fill="none" stroke="${NAVY}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>`, 'left:0;top:0', vis);
  const [st, money] = g.querySelectorAll('path'); mv.draw(st, T.t0 + .15, .5); mv.draw(money, T.hit - .8, .8);
  const area = svg(S, S, `<path d="M${pts.join(' L')} L${S} ${S * .72} L0 ${S} Z" fill="${ACC}" opacity=".55"/>`, 'left:0;top:0;opacity:0', vis); vis.insertBefore(area, g); mv.show(area, T.hit);
  mv.pop(div(`left:${S - S * .14}px;top:${-S * .02}px;width:${S * .16}px;height:${S * .16}px;border-radius:50%;background:${ACC};border:3px solid ${INK};opacity:0`, vis), T.hit); snd('hit', T.hit);
});
WIDGET('FIN', 'h2', {pack: FIN, code: 'FIN-H2', name: 'แบ่งเงินเป็นก้อน', slots: PARTS.FIN.h2.meta.slots, dur: [1.2, 3.5], hit: 'ก้อนที่พูดถึงดึงออกจากวงและเป็นสีเน้น'}, (vis, S, s, T) => {
  const sh = s.shares.map(Number), tot = sh.reduce((a, b) => a + b, 0), focus = s.focus ?? sh.length - 1, R = S * .34, shades = ['#46536E', '#7A869E', '#A9B2C3', '#D3D8E2'];
  let a0 = -90; const step = (T.hit - T.t0 - .4) / sh.length;
  sh.forEach((v, k) => { const f = v / tot, on = k === focus, mid = (a0 + f * 180) * Math.PI / 180;
    const r = svg(S, S, `<circle cx="${S / 2}" cy="${S / 2}" r="${R}" fill="none" stroke="${on ? ACC : shades[k]}" stroke-width="${S * .24}" transform="rotate(${a0} ${S / 2} ${S / 2})"/>`, 'left:0;top:0', vis);
    mv.ring(r.querySelector('circle'), T.t0 + .15 + k * step, f - .01);
    if (on) mv.slide(r, T.hit, 'translate(0,0)', `translate(${Math.cos(mid) * S * .06}px,${Math.sin(mid) * S * .06}px)`); a0 += f * 360; });
  snd('hit', T.hit);
});
WIDGET('FIN', 'h3', {pack: FIN, code: 'FIN-H3', name: 'รายการรับจ่าย', slots: PARTS.FIN.h3.meta.slots, dur: [1.2, 3.5], hit: 'แถบยอดคงเหลือขึ้นท้ายรายการ'}, (vis, S, s, T) => {
  const rows = s.rows.slice(0, 3), step = (T.hit - T.t0 - .5) / rows.length;
  rows.forEach((r, k) => { const y = k * S * .25, row = div(`left:0;top:${y}px;width:${S}px;height:${S * .2}px;opacity:0`, vis);
    div(`left:0;top:${S * .02}px;width:${S * .16}px;height:${S * .16}px;border-radius:50%;background:${r.in ? NAVY : RED};display:flex;align-items:center;justify-content:center`, row, ico(r.in ? 'arrow-down-left' : 'arrow-up-right', S * .11, '#fff', 3));
    skel(row, `left:${S * .24}px;top:${S * .07}px;width:${S * .72}px`, [r.in ? .9 : .6], {color: r.in ? 'rgba(20,33,61,.3)' : 'rgba(255,59,48,.45)', h: S * .06});
    mv.lead(row, T.t0 + .3 + k * step); });
  div(`left:0;top:${S * .76}px;width:${S}px;height:0;border-top:3px dashed ${WG}`, vis);
  const bal = div(`left:${S * .3}px;top:${S * .84}px;width:${S * .7}px;height:${S * .14}px;border-radius:${S * .05}px;background:${ACC};transform-origin:100% 50%`, vis); mv.fill(bal, T.hit, 0, 1); snd('hit', T.hit);
});
WIDGET('FIN', 'h4', {pack: FIN, code: 'FIN-H4', name: 'เงินเฟ้อ', slots: PARTS.FIN.h4.meta.slots, dur: [1.2, 3.5], hit: 'ของในตะกร้าจางหายทีละชิ้น ลูกศรแดงชี้ลง'}, (vis, S, s, T) => {
  mv.pop(div(`left:${S * .1}px;top:0;width:${S * .62}px;height:${S * .34}px;border-radius:${S * .06}px;background:${NAVY};display:flex;align-items:center;justify-content:center;font-family:KeySans;font-size:${S * .17}px;color:#fff;opacity:0`, vis, '฿'), T.t0 + .05, 'scale(.6)');
  const icons = ['egg', 'milk', 'apple'], step = (T.hit - T.t0 - .6) / 2;
  icons.forEach((nm, k) => { const it = mt(vis, nm, T.t0 + .15 + k * .05, k * S * .27, S * .5, S * .26, k === 0 ? ACC : '#EEF0F4', NAVY); if (k > 0) mv.dim(it, T.t0 + .6 + (2 - k) * step); });
  mv.pop(div(`left:${S * .76}px;top:${S * .02}px;width:${S * .24}px;height:${S * .24}px;border-radius:${S * .07}px;background:${RED};display:flex;align-items:center;justify-content:center;opacity:0`, vis, ico('trending-down', S * .16, '#fff', 2.8)), T.hit);
  snd('hit', T.hit);
});
WIDGET('FIN', 'h5', {pack: FIN, code: 'FIN-H5', name: 'ลดหย่อนภาษี', slots: PARTS.FIN.h5.meta.slots, dur: [1.2, 3.5], hit: 'ข้อลดหย่อนข้อสุดท้ายถูกติ๊ก แถบภาษีหดลง'}, (vis, S, s, T) => {
  const n = Math.min(3, s.items.length), step = (T.hit - T.t0 - .5) / n, z = S * .2;
  for (let k = 0; k < n; k++) { const y = k * S * .26;
    div(`left:0;top:${y}px;width:${z}px;height:${z}px;border-radius:${z * .25}px;border:3px solid ${NAVY};box-sizing:border-box`, vis);
    mv.pop(div(`left:0;top:${y}px;width:${z}px;height:${z}px;border-radius:${z * .25}px;background:${NAVY};display:flex;align-items:center;justify-content:center;opacity:0`, vis, ico('check', z * .7, '#fff', 3.4)), T.t0 + .4 + k * step, 'scale(1.5)');
    skel(vis, `left:${S * .28}px;top:${y + z * .3}px;width:${S * .7}px`, [.85], {color: WG, h: S * .06}); }
  const tr = div(`left:0;top:${S * .84}px;width:${S}px;height:${S * .12}px;border-radius:${S * .06}px;background:${WG};overflow:hidden`, vis);
  mv.fill(div(`left:0;top:0;width:100%;height:100%;background:${RED};transform-origin:0 50%`, tr), T.hit, 1, s.tax === 0 ? 0 : .25); snd('hit', T.hit);
});
