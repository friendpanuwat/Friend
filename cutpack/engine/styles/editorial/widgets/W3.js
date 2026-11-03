/* Overlay widgets B11–B15 */

/* B11 v1: a chat bubble with typing dots, then "read" ticks on the key word */
WIDGET('B11', 'v1', {name: 'แชตอ่านแล้ว', slots: B11_SLOTS, dur: [1.2, 3], hit: 'ขีดอ่านแล้วขึ้นตรงคำ'}, (vis, S, s, T) => {
  const b = div(`left:0;top:${S * .12}px;width:${S}px;height:${S * .56}px;border-radius:${S * .2}px;border-bottom-left-radius:${S * .05}px;background:#EEF0F4;display:flex;align-items:center;justify-content:center;gap:${S * .07}px;opacity:0`, vis);
  [0, 1, 2].forEach(k => { const d = div(`position:relative;width:${S * .12}px;height:${S * .12}px;border-radius:50%;background:${NAVY};opacity:.6`, b); mv.pop(d, T.t0 + .25 + k * .1); });
  mv.chip(b, T.t0 + .1);
  const r = div(`left:${S * .3}px;top:${S * .72}px;width:${S * .7}px;height:${S * .26}px;opacity:0`, vis, ico('check-check', S * .26, NAVY, 2.6)); mv.lead(r, T.hit); snd('hit', T.hit);
});
/* B11 v2: five stars, the rating said lights up one by one (needs stars) */
WIDGET('B11', 'v2', {name: 'ดาวรีวิว', slots: B11_SLOTS, dur: [1.2, 3], hit: 'ดาวติดครบตามจำนวนที่พูด'}, (vis, S, s, T) => {
  if (!(s.stars >= 1 && s.stars <= 5)) throw new Error('B11.v2 widget needs stars 1–5');
  const narrow = T.kind === 'narrow', z = narrow ? S * .3 : S * .18;
  const row = div(`left:0;top:${narrow ? 0 : S * .38}px;width:${S}px;display:flex;flex-wrap:${narrow ? 'wrap' : 'nowrap'};justify-content:center;gap:${S * .01}px`, vis);
  for (let k = 0; k < 5; k++) { const st = div(`position:relative;width:${z}px;height:${z}px`, row, `<svg width="${z}" height="${z}" viewBox="0 0 24 24"><path d="${STAR}" fill="rgba(20,33,61,.15)"/></svg>`);
    if (k < s.stars) { const f = div('inset:0;opacity:0', st, `<svg width="${z}" height="${z}" viewBox="0 0 24 24"><path d="${STAR}" fill="${ACC}" stroke="#0A0A0A" stroke-width=".7"/></svg>`); mv.pop(f, T.hit - .12 * (s.stars - 1 - k), 'scale(1.8)'); } }
  snd('hit', T.hit);
});
/* B12 v1: A → B — a small arrow draws from one tile to the other, B pops */
WIDGET('B12', 'v1', {name: 'A ไป B', slots: B12_SLOTS, dur: [1.2, 3], hit: 'ลูกศรถึง B แล้ว B เด้ง'}, (vis, S, s, T) => {
  const z = S * .38, y = S * .31;
  mt(vis, s.ia, T.t0 + .1, 0, y, z, '#EEF0F4', NAVY);
  const ar = svg(S - 2 * z, 30, `<path d="M4 15 H${S - 2 * z - 6}" stroke="${NAVY}" stroke-width="6" stroke-linecap="round"/><path d="M${S - 2 * z - 18} 5 L${S - 2 * z - 5} 15 L${S - 2 * z - 18} 25" fill="none" stroke="${NAVY}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>`, `left:${z}px;top:${y + z / 2 - 15}px`, vis);
  const [sh, hd] = ar.querySelectorAll('path'); mv.draw(sh, T.hit - .35, .3); hd.style.opacity = 0; mv.show(hd, T.hit - .06);
  mt(vis, s.ib, T.hit, S - z, y, z, ACC, INK); snd('hit', T.hit);
});
/* B12 v4: three dots on a loop, the arcs draw one after another and close on the key word */
WIDGET('B12', 'v4', {name: 'วงจรวน', slots: B12_SLOTS, dur: [1.4, 3.5], hit: 'วงปิดตรงคำ'}, (vis, S, s, T) => {
  const c = S / 2, R = S * .36, P = a => [c + R * Math.cos(a * Math.PI / 180), c + R * Math.sin(a * Math.PI / 180)];
  const arcs = [0, 1, 2].map(i => { const [x0, y0] = P(-90 + i * 120 + 30), [x1, y1] = P(-90 + i * 120 + 90); return `<path d="M${x0} ${y0} A${R} ${R} 0 0 1 ${x1} ${y1}" fill="none" stroke="${NAVY}" stroke-width="${S * .04}" stroke-linecap="round"/>`; }).join('');
  const g = svg(S, S, arcs, 'left:0;top:0', vis), step = (T.hit - T.t0 - .4) / 3;
  g.querySelectorAll('path').forEach((p, i) => mv.draw(p, T.t0 + .3 + i * step, step * .9));
  [s.ia, s.ib, s.ic ?? s.ia].forEach((ic, i) => { const [x, y] = P(-90 + i * 120), z = S * .3; mt(vis, ic, T.t0 + .1 + i * .08, x - z / 2, y - z / 2, z, i === 2 ? ACC : NAVY, i === 2 ? INK : '#fff'); });
  snd('hit', T.hit);
});
/* B13 v1: the bulb switches on in the accent */
WIDGET('B13', 'v1', {name: 'หลอดไฟสว่าง', slots: B13_SLOTS, dur: [1.0, 3], hit: 'หลอดไฟติดตรงคำ'}, (vis, S, s, T) => {
  mt(vis, 'lightbulb', T.t0 + .1, 0, 0, S, '#EEF0F4', 'rgba(20,33,61,.5)'); mt(vis, 'lightbulb', T.hit, 0, 0, S, ACC, INK); snd('hit', T.hit);
});
/* B13 v3: a key slides into the lock, the lock springs open */
WIDGET('B13', 'v3', {name: 'กุญแจไขแม่กุญแจ', slots: B13_SLOTS, dur: [1.2, 3], hit: 'กุญแจเสียบเข้า แม่กุญแจเปิด'}, (vis, S, s, T) => {
  const z = S * .62; mt(vis, 'lock', T.t0 + .1, S - z, S * .19, z, NAVY, '#fff'); mt(vis, 'lock-open', T.hit + .05, S - z, S * .19, z, ACC, INK);
  const k = div(`left:0;top:${S * .3}px;width:${S * .4}px;height:${S * .4}px;opacity:0`, vis, ico('key-round', S * .4, NAVY, 2.2));
  mv.show(k, T.t0 + .2); mv.slide(k, T.hit - MOTION.slide.d, `translateX(${-S * .1}px) rotate(-30deg)`, `translateX(${S * .02}px) rotate(0deg)`); snd('hit', T.hit);
});
/* B14 v1 (text only): the phrases build up, the key word becomes the accent box */
WIDGET('B14', 'v1', {name: 'คำขึ้นทีละคำ ไฮไลต์คำสำคัญ', full: true, slots: B14_SLOTS, dur: [1.2, 3.5], hit: 'คำสำคัญเป็นกล่องสีเน้น'}, (vis, S, s, T, L, w) => {
  checkWords(s); const at = phraseTimes(s, T), short = T.kind === 'short';
  const b = div(`left:22px;top:0;width:${L.W - 44}px;height:${L.H}px;display:flex;flex-wrap:wrap;align-content:center;justify-content:${short ? 'center' : 'flex-start'};column-gap:10px;row-gap:2px`, w);
  s.words.forEach((x, i) => { const el = chunk(b, x, i === s.key ? 'hl' : 'm', at[i], i === s.key ? {size: short ? 56 : 46} : {color: NAVY, size: short ? 46 : 38}); });
  FITS.push(() => { if (b.scrollHeight > L.H - 10) b.style.fontSize = '0.8em'; });
  snd('key', T.hit - .04);
});
/* B14 v3 (text only): the key word in Sriracha with an accent underline drawn at the hit */
WIDGET('B14', 'v3', {name: 'ลายมือคู่ Mitr', full: true, slots: B14_SLOTS, dur: [1.2, 3.5], hit: 'เส้นใต้คำสำคัญวาดตรงคำ'}, (vis, S, s, T, L, w) => {
  checkWords(s); const at = phraseTimes(s, T), short = T.kind === 'short';
  const b = div(`left:22px;top:0;width:${L.W - 44}px;height:${L.H}px;display:flex;flex-wrap:wrap;align-content:center;justify-content:${short ? 'center' : 'flex-start'};column-gap:10px`, w);
  s.words.forEach((x, i) => { const el = chunk(b, x, i === s.key ? 'iw' : 'm', at[i], {color: NAVY, size: i === s.key ? (short ? 70 : 56) : (short ? 44 : 36)});
    if (i === s.key) { const u = svg(400, 40, `<path d="M6 26 Q 100 6 200 20 T 394 14" stroke="${ACC}" stroke-width="16" stroke-linecap="round" fill="none"/>`, 'left:0;bottom:-14px;width:100%;z-index:-1', el);
      u.firstChild.setAttribute('preserveAspectRatio', 'none'); u.firstChild.setAttribute('viewBox', '0 0 400 40'); u.firstChild.style.width = '100%'; mv.draw(u.querySelector('path'), T.hit + .1, .3); } });
  snd('key', T.hit - .04);
});
/* B15 v1: the action button is pressed by a cursor on the key word */
WIDGET('B15', 'v1', {name: 'ปุ่มถูกกด', slots: B15_SLOTS, dur: [1.2, 3], hit: 'เคอร์เซอร์กดปุ่ม ไอคอนเป็นเครื่องหมายถูก'}, (vis, S, s, T) => {
  const [ic] = ACT[s.action], z = S * .8;
  const btn = div(`left:${S * .1}px;top:${S * .1}px;width:${z}px;height:${z}px;border-radius:50%;background:${ACC};display:flex;align-items:center;justify-content:center;box-shadow:0 10px 24px rgba(0,0,0,.25);opacity:0`, vis, ico(ic, z * .5, INK, 2.4));
  const ok = div(`left:${S * .1}px;top:${S * .1}px;width:${z}px;height:${z}px;border-radius:50%;background:${ACC};display:flex;align-items:center;justify-content:center;opacity:0`, vis, ico('check', z * .55, INK, 3));
  mv.chip(btn, T.t0 + .1); mv.pop(ok, T.hit + .02, 'scale(.3)'); mv.punch(btn, T.hit);
  cursor(vis, [[T.hit - .5, S * .95, S * .95], [T.hit - .05, S * .5, S * .5], [T.hit + .5, S * .9, S * .8]], [T.hit], {size: S * .38}); snd('hit', T.hit);
});
/* B15 v3: the action icon fills with the accent on the key word */
WIDGET('B15', 'v3', {name: 'ไอคอนเต็มสี', slots: B15_SLOTS, dur: [1.0, 3], hit: 'ไอคอนเต็มสีเน้นตรงคำ'}, (vis, S, s, T) => {
  const [ic] = ACT[s.action]; mt(vis, ic, T.t0 + .1, 0, 0, S, '#EEF0F4', NAVY); mt(vis, ic, T.hit, 0, 0, S, ACC, INK); snd('hit', T.hit);
});
