/* PACK fit — overlay widgets (the 11 fitness pieces Friend kept on 2026-11-04). Rules as in packs/biz_w.js. */
WIDGET('B01', 'fit1', {pack: FIT, code: 'FIT-P1', use: 'เฉพาะประโยคเรื่องเดินหรือจำนวนก้าว', name: 'รอยเท้าเดินขึ้น (ใช้กับการเดินเท่านั้น)', slots: B01_SLOTS, dur: [1.2, 3], hit: 'รอยเท้าสว่างทีละก้าว'}, (vis, S, s, T) => {
  const n = 6, z = S * .26, step = (T.hit - T.t0 - .4) / (n - 1);
  for (let i = 0; i < n; i++) { const x = (i % 2) * S * .3 + i * S * .09, y = S - z - i * S * .14;
    div(`left:${x}px;top:${y}px;width:${z}px;height:${z}px`, vis, ico('footprints', z, WG, 2.2));
    mv.pop(div(`left:${x}px;top:${y}px;width:${z}px;height:${z}px;opacity:0`, vis, ico('footprints', z, i === n - 1 ? NAVY : '#46536E', 2.6)), T.t0 + .4 + i * step, 'scale(1.5)'); }
  snd('hit', T.hit);
});
WIDGET('B02', 'fit1', {pack: FIT, code: 'FIT-P2', name: 'ตาชั่งน้ำหนัก', slots: B02_SLOTS, dur: [1.0, 3], hit: 'เข็มตาชั่งหมุนไปทางขึ้นหรือลงแล้วหยุดตรงคำ'}, (vis, S, s, T) => {
  const up = s.dir !== 'down', b = div(`left:0;top:0;width:${S}px;height:${S}px;border-radius:${S * .2}px;background:${NAVY};opacity:0`, vis); mv.pop(b, T.t0 + .05, 'scale(.7)');
  svg(S, S * .6, `<path d="M${S * .15} ${S * .52} A${S * .35} ${S * .35} 0 0 1 ${S * .85} ${S * .52}" fill="none" stroke="rgba(255,255,255,.3)" stroke-width="${S * .06}" stroke-linecap="round"/>`, 'left:0;top:0', b);
  const nd = div(`left:${S / 2 - 3}px;top:${S * .2}px;width:6px;height:${S * .32}px;border-radius:3px;background:${ACC};transform-origin:50% 100%`, b);
  mv.slide(nd, T.hit - MOTION.slide.d, 'rotate(0deg)', `rotate(${up ? 60 : -60}deg)`);
  div(`left:${S * .3}px;top:${S * .64}px;width:${S * .4}px;height:${S * .22}px;border-radius:${S * .06}px;background:${ACC};display:flex;align-items:center;justify-content:center`, b, ico(up ? 'arrow-up' : 'arrow-down', S * .16, INK, 3));
  snd('hit', T.hit);
});
WIDGET('B07', 'fit1', {pack: FIT, code: 'FIT-P3', name: 'เส้นชีพจรกระตุก', slots: B07_SLOTS, dur: [1.0, 3], hit: 'เส้นชีพจรพุ่งเป็นสีแดง หัวใจกระตุก'}, (vis, S, s, T) => {
  const h = div(`left:${S * .3}px;top:0;width:${S * .4}px;height:${S * .4}px;opacity:0`, vis, ico('heart', S * .4, RED, 2.6)); mv.pop(h, T.t0 + .05); mv.punch(h, T.hit);
  const g = svg(S, S * .5, `<path d="M0 ${S * .25} H${S * .3} L${S * .36} ${S * .14} L${S * .42} ${S * .34} L${S * .48} ${S * .25} H${S * .55}" fill="none" stroke="#7A869E" stroke-width="5" stroke-linejoin="round"/><path d="M${S * .55} ${S * .25} L${S * .62} ${S * .02} L${S * .7} ${S * .48} L${S * .78} ${S * .25} H${S}" fill="none" stroke="${RED}" stroke-width="6" stroke-linejoin="round"/>`, `left:0;top:${S * .48}px`, vis);
  const [a, b] = g.querySelectorAll('path'); mv.draw(a, T.t0 + .2, Math.max(.3, T.hit - T.t0 - .6)); mv.draw(b, T.hit - .3, .3); snd('hit', T.hit);
});
WIDGET('B09', 'fit1', {pack: FIT, code: 'FIT-P4', name: 'นาฬิกาจับเวลา', slots: B09_SLOTS, dur: [1.0, 3], hit: 'วงรอบนาฬิกาวิ่งครบ ปุ่มถูกกด'}, (vis, S, s, T) => {
  const btn = div(`left:${S * .42}px;top:0;width:${S * .16}px;height:${S * .12}px;border-radius:4px;background:${NAVY};opacity:0`, vis); mv.pop(btn, T.t0 + .1);
  const g = svg(S, S, `<circle cx="${S / 2}" cy="${S * .56}" r="${S * .38}" fill="#fff" stroke="${WG}" stroke-width="${S * .09}"/><circle cx="${S / 2}" cy="${S * .56}" r="${S * .38}" fill="none" stroke="${NAVY}" stroke-width="${S * .09}" stroke-linecap="round" transform="rotate(-90 ${S / 2} ${S * .56})"/>`, 'left:0;top:0', vis);
  mv.ring(g.querySelectorAll('circle')[1], T.t0 + .2, 1, 0, {d: T.hit - T.t0 - .2, e: 'linear'}); mv.slide(btn, T.hit - .15, 'translateY(0)', `translateY(${S * .04}px)`);
  div(`left:0;top:${S * .18}px;width:${S}px;height:${S * .76}px;display:flex;align-items:center;justify-content:center`, vis, ico(s.icon ?? 'timer', S * .3, NAVY, 2.2)); snd('hit', T.hit);
});
WIDGET('B03', 'fit1', {pack: FIT, code: 'FIT-P5', name: 'ร่างคนก่อนกับหลัง', slots: B03_SLOTS, dur: [1.0, 3], hit: 'ฝั่งที่ชนะยกแขนเป็นสีเน้น'}, (vis, S, s, T) => {
  const z = S * .4;
  [['a', 0], ['b', S - z]].forEach(([k, x], i) => { const win = s.win === k, pose = k === 'a' ? 'slouch' : win ? 'up' : 'stand';
    mv.pop(human(vis, `left:${x}px;top:${S * .06}px;width:${z}px;height:${z * 2.2}px;opacity:0`, WD, pose), T.t0 + .1 + i * .1, 'translateY(20px) scale(.9)');
    if (win) mv.pop(human(vis, `left:${x}px;top:${S * .06}px;width:${z}px;height:${z * 2.2}px;opacity:0`, '#46536E', 'up'), T.hit, 'scale(1.1)'); });
  if (s.win) { const ok = div(`left:${s.win === 'a' ? 0 : S - S * .26}px;top:0;width:${S * .26}px;height:${S * .26}px;border-radius:50%;background:${ACC};display:flex;align-items:center;justify-content:center;opacity:0`, vis, ico('check', S * .17, INK, 3.4)); mv.pop(ok, T.hit + .05); }
  snd('hit', T.hit);
});
WIDGET('B08', 'fit1', {pack: FIT, code: 'FIT-P6', name: 'ดัมเบลยกขึ้น', slots: B08_SLOTS, dur: [1.0, 3], hit: 'ดัมเบลยกถึงเส้นเป้า'}, (vis, S, s, T) => {
  div(`left:0;top:${S * .2}px;width:${S}px;height:0;border-top:4px dashed ${NAVY}`, vis);
  const db = div(`left:0;top:${S * .7}px;width:${S}px;height:${S * .28}px;opacity:0`, vis, `<svg width="100%" height="100%" viewBox="0 0 100 28"><rect x="20" y="11" width="60" height="6" rx="3" fill="${NAVY}"/><rect x="6" y="2" width="12" height="24" rx="4" fill="${NAVY}"/><rect x="82" y="2" width="12" height="24" rx="4" fill="${NAVY}"/><rect x="0" y="7" width="6" height="14" rx="3" fill="${NAVY}"/><rect x="94" y="7" width="6" height="14" rx="3" fill="${NAVY}"/></svg>`);
  mv.pop(db, T.t0 + .05); mv.slide(db, T.hit - MOTION.slide.d, 'translateY(0)', `translateY(${-S * .58}px)`);
  mv.pop(div(`left:${S * .78}px;top:${S * .02}px;width:${S * .22}px;height:${S * .16}px;border-radius:4px;background:${ACC};opacity:0`, vis), T.hit); snd('hit', T.hit);
});
WIDGET('FIT', 'h1', {pack: FIT, code: 'FIT-H1', name: 'จานแบ่งสัดส่วน', slots: PARTS.FIT.h1.meta.slots, dur: [1.2, 3.5], hit: 'ส่วนที่พูดถึงบนจานสว่างเป็นสีเน้น'}, (vis, S, s, T) => {
  const sh = s.shares.map(Number), tot = sh.reduce((a, b) => a + b, 0), focus = s.focus ?? 0, R = S * .23, shades = ['#46536E', '#7A869E', '#A9B2C3', '#D3D8E2'];
  div(`left:0;top:0;width:${S}px;height:${S}px;border-radius:50%;border:${S * .04}px solid ${NAVY};box-sizing:border-box;background:#fff`, vis);
  let a0 = -90; const step = (T.hit - T.t0 - .5) / sh.length;
  sh.forEach((v, k) => { const f = v / tot, on = k === focus;
    mv.ring(svg(S, S, `<circle cx="${S / 2}" cy="${S / 2}" r="${R}" fill="none" stroke="${shades[k]}" stroke-width="${2 * R}" transform="rotate(${a0} ${S / 2} ${S / 2})"/>`, 'left:0;top:0', vis).querySelector('circle'), T.t0 + .2 + k * step, f - .004);
    if (on) mv.ring(svg(S, S, `<circle cx="${S / 2}" cy="${S / 2}" r="${R}" fill="none" stroke="${ACC}" stroke-width="${2 * R}" transform="rotate(${a0} ${S / 2} ${S / 2})"/>`, 'left:0;top:0', vis).querySelector('circle'), T.hit - .3, f - .004);
    a0 += f * 360; });
  snd('hit', T.hit);
});
WIDGET('FIT', 'h2', {pack: FIT, code: 'FIT-H2', name: 'แถบสารอาหาร', slots: PARTS.FIT.h2.meta.slots, dur: [1.2, 3.5], hit: 'แถบที่พูดถึงเป็นสีเน้นและเด้ง'}, (vis, S, s, T) => {
  const it = s.items.slice(0, 3), focus = s.focus ?? 0, max = Math.max(1, ...it.map(x => Number(x.g ?? 0)));
  it.forEach((x, k) => { const on = k === focus, f = x.g != null ? .2 + .8 * Number(x.g) / max : .5 + .15 * (k % 2), y = S * (.08 + k * .32);
    const tr = div(`left:0;top:${y}px;width:${S}px;height:${S * .18}px;border-radius:${S * .09}px;background:${WG};overflow:hidden`, vis);
    mv.fill(div(`left:0;top:0;width:100%;height:100%;border-radius:${S * .09}px;background:${on ? ACC : '#7A869E'};${on ? `box-shadow:inset 0 0 0 2px ${INK}` : ''};transform-origin:0 50%`, tr), on ? T.hit : T.t0 + .8 + k * .15, 0, f); });
  snd('hit', T.hit);
});
WIDGET('FIT', 'h3', {pack: FIT, code: 'FIT-H3', name: 'ร่างกายชี้จุด', slots: PARTS.FIT.h3.meta.slots, dur: [1.0, 3], hit: 'จุดที่พูดถึงบนร่างกายสว่างเป็นวงสีเน้น'}, (vis, S, s, T) => {
  const K = S / 400, X = S / 2 - 100 * K;
  mv.pop(human(vis, `left:${X}px;top:0;width:${200 * K}px;height:${S}px;opacity:0`, 'rgba(20,33,61,.32)'), T.t0 + .05, 'translateY(20px) scale(.94)');
  const [sx, sy] = FIT_SPOTS[s.spot], d = S * .2;
  mv.pop(div(`left:${X + sx * K - d / 2}px;top:${sy * K - d / 2}px;width:${d}px;height:${d}px;border-radius:50%;background:${ACC};border:3px solid ${INK};box-shadow:0 0 0 ${S * .04}px ${ACC}66;opacity:0`, vis), T.hit); snd('hit', T.hit);
});
WIDGET('FIT', 'h4', {pack: FIT, code: 'FIT-H4', name: 'ท่าออกกำลังกายพร้อมตัวนับ', slots: PARTS.FIT.h4.meta.slots, dur: [1.6, 3.5], hit: 'ท่าสุดท้ายกลับขึ้นตรงคำ'}, (vis, S, s, T) => {
  const sc = S / 760, J = jointed(vis, S * .42, S * .98, NAVY, sc);
  div(`left:0;top:${S * .98}px;width:${S}px;height:3px;background:${WG}`, vis); mv.show(J.root, T.t0 + .05);
  const d = MOTION.slide.d, start = T.hit - 4 * d;
  for (let r = 0; r < 2; r++) { poseTo(J, start + r * 2 * d, {}, SQUAT); poseTo(J, start + r * 2 * d + d, SQUAT, {}); }
  snd('hit', T.hit);
});
WIDGET('FIT', 'h5', {pack: FIT, code: 'FIT-H5', name: 'กราฟการนอน', slots: PARTS.FIT.h5.meta.slots, dur: [1.2, 3.5], hit: 'เส้นการนอนวิ่งถึงเช้า พระอาทิตย์ขึ้น'}, (vis, S, s, T) => {
  const lv = [0, 2, 3, 2, 1, 2, 3, 1, 0], dx = S / (lv.length - 1), y = v => S * .32 + v * S * .2;
  const path = `M0 ${y(lv[0])}` + lv.slice(1).map((v, i) => ` H${((i + 1) * dx).toFixed(1)} V${y(v)}`).join('');
  const g = svg(S, S, `<path d="${path}" fill="none" stroke="${NAVY}" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/>`, 'left:0;top:0', vis);
  mv.draw(g.querySelector('path'), T.t0 + .2, T.hit - T.t0 - .2);
  mv.pop(div('left:0;top:0;opacity:0', vis, ico('moon', S * .24, NAVY, 2.2)), T.t0 + .05);
  mv.pop(div(`left:${S * .76}px;top:0;opacity:0`, vis, ico('sun', S * .24, NAVY, 2.6)), T.hit); snd('hit', T.hit);
});
