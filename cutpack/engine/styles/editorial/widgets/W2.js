/* Overlay widgets B06–B10 */

/* B06 v1: a big question tile that wobbles at the end of the question */
WIDGET('B06', 'v1', {name: '? ใหญ่ส่าย', slots: B06_SLOTS, dur: [1.0, 3], hit: '? ส่ายตรงคำท้ายคำถาม'}, (vis, S, s, T) => {
  const q = mt(vis, 'circle-help', T.t0 + .1, 0, 0, S, ACC, INK); mv.wobble(q.inner, T.hit); snd('hit', T.hit);
});
/* B06 v4: a search tile sweeps over result lines, they light up at the key word */
WIDGET('B06', 'v4', {name: 'ค้นหา', slots: B06_SLOTS, dur: [1.2, 3], hit: 'แว่นขยายเลื่อนผ่าน แล้วผลค้นหาขึ้น'}, (vis, S, s, T) => {
  [0, 1, 2].forEach(k => { const r = div(`left:${S * .05}px;top:${S * (.1 + k * .3)}px;width:${S * .9}px;height:${S * .18}px;border-radius:${S * .09}px;background:${k === 1 ? ACC : 'rgba(20,33,61,.12)'};transform-origin:0 50%`, vis); mv.growX(r, T.hit + k * MOTION.stagger, 1); });
  const g = div(`left:0;top:${S * .2}px;width:${S * .5}px;height:${S * .5}px`, vis, ico('search', S * .5, NAVY, 2.6));
  mv.slide(g, T.t0 + .2, 'translateX(0)', `translateX(${S * .5}px)`); mv.punch(g, T.hit); snd('hit', T.hit);
});
/* B07 v1: a red warning tile, punch at the key word */
WIDGET('B07', 'v1', {name: 'ป้ายเตือน', slots: B07_SLOTS, dur: [1.0, 3], hit: 'ป้ายเตือนเด้งตรงคำ'}, (vis, S, s, T) => {
  const w = mt(vis, 'triangle-alert', T.t0 + .1, 0, 0, S, RED, '#fff'); mv.punch(w.inner, T.hit); snd('hit', T.hit);
});
/* B07 v3: a notification — the topic icon on a tile, a red badge pops on its corner */
WIDGET('B07', 'v3', {name: 'แจ้งเตือน', slots: B07_SLOTS, dur: [1.0, 3], hit: 'จุดแดงแจ้งเตือนเด้งตรงคำ'}, (vis, S, s, T) => {
  const t = mt(vis, s.icon, T.t0 + .1, S * .06, S * .1, S * .84, NAVY, '#fff');
  const b = div(`left:${S * .66}px;top:0;width:${S * .34}px;height:${S * .34}px;border-radius:50%;background:${RED};border:${S * .03}px solid #fff;display:flex;align-items:center;justify-content:center;opacity:0`, vis, ico('bell', S * .18, '#fff', 2.6));
  mv.pop(b, T.hit); mv.punch(t.inner, T.hit); snd('hit', T.hit);
});
/* B08 v1: a small bullseye, the arrow lands in the centre (head drawn so nothing pokes past the tip) */
WIDGET('B08', 'v1', {name: 'เป้าลูกศรเข้ากลาง', slots: B08_SLOTS, dur: [1.0, 3], hit: 'ลูกศรปักกลางเป้า'}, (vis, S, s, T) => {
  [['#14213D', 0], ['#FFFFFF', 1], [NAVY, 2], [ACC, 3]].forEach(([col, k]) => { const r = S * (1 - k * .23); const e = div(`left:${(S - r) / 2}px;top:${(S - r) / 2}px;width:${r}px;height:${r}px;border-radius:50%;background:${col}`, vis); mv.pop(e, T.t0 + .1 + k * .05, 'scale(0)'); });
  const a = div(`left:${S / 2}px;top:${S / 2 - S * .55}px;width:${S}px;height:${S * 1.1}px;opacity:0`, vis,
    `<svg width="${S}" height="${S * 1.1}" viewBox="0 0 520 600"><g transform="translate(0 300) rotate(-38)"><line x1="40" y1="0" x2="420" y2="0" stroke="#0A0A0A" stroke-width="22" stroke-linecap="round"/><line x1="40" y1="0" x2="420" y2="0" stroke="#fff" stroke-width="11" stroke-linecap="round"/><path d="M0 0 L60 -30 L60 30 Z" fill="#fff" stroke="#0A0A0A" stroke-width="6" stroke-linejoin="round"/></g></svg>`);
  mv.fly(a, T.hit - MOTION.fly.d, `translate(${S}px,${-S * .8}px)`); snd('hit', T.hit);
});
/* B08 v4: a ring draws itself, the check is drawn inside on the key word */
WIDGET('B08', 'v4', {name: 'เครื่องหมายถูกใหญ่', slots: B08_SLOTS, dur: [1.0, 3], hit: 'เครื่องหมายถูกวาดเสร็จตรงคำ'}, (vis, S, s, T) => {
  const k = S / 500, g = svg(S, S, `<g transform="scale(${k})"><circle cx="250" cy="250" r="215" fill="${ACC}"/><path d="M140 260 L220 340 L370 170" fill="none" stroke="${INK}" stroke-width="48" stroke-linecap="round" stroke-linejoin="round"/></g>`, 'left:0;top:0', vis);
  mv.pop(g, T.t0 + .1, 'scale(0)');
  mv.draw(g.querySelector('path'), T.hit - .3, .3); snd('hit', T.hit);
});
/* B09 v1: a small clock, the long hand sweeps a full turn to the key word */
WIDGET('B09', 'v1', {name: 'นาฬิกาเข็มหมุน', slots: B09_SLOTS, dur: [1.2, 3], hit: 'เข็มหมุนครบรอบตรงคำ'}, (vis, S, s, T) => {
  const R = S / 2, face = div(`left:0;top:0;width:${S}px;height:${S}px;border-radius:50%;border:${S * .06}px solid ${NAVY};background:#fff`, vis); mv.pop(face, T.t0 + .1, 'scale(.6)');
  const hr = div(`left:${R - S * .03}px;top:${R - S * .26}px;width:${S * .06}px;height:${S * .26}px;border-radius:${S * .03}px;background:${NAVY};transform-origin:50% 100%;transform:rotate(120deg)`, vis); mv.show(hr, T.t0 + .15);
  const mn = div(`left:${R - S * .022}px;top:${R - S * .36}px;width:${S * .044}px;height:${S * .36}px;border-radius:${S * .022}px;background:${NAVY};transform-origin:50% 100%`, vis);
  mv.show(mn, T.t0 + .15); mv.slide(mn, T.hit - MOTION.slide.d, 'rotate(0deg)', 'rotate(360deg)');
  const hub = div(`left:${R - S * .07}px;top:${R - S * .07}px;width:${S * .14}px;height:${S * .14}px;border-radius:50%;background:${ACC};border:${S * .02}px solid ${NAVY}`, vis); mv.show(hub, T.t0 + .15);
  snd('hit', T.hit);
});
/* B09 v4: an hourglass tile turns over on the key word */
WIDGET('B09', 'v4', {name: 'นาฬิกาทรายพลิก', slots: B09_SLOTS, dur: [1.0, 3], hit: 'นาฬิกาทรายพลิกตรงคำ'}, (vis, S, s, T) => {
  const w = div(`left:0;top:0;width:${S}px;height:${S}px`, vis); mt(w, 'hourglass', T.t0 + .1, 0, 0, S, ACC, INK);
  mv.slide(w, T.hit - MOTION.slide.d * .6, 'rotate(0deg)', 'rotate(180deg)'); snd('swipe', T.hit - .3);
});
/* B10 v1: six people, the one meant lights up in the accent */
WIDGET('B10', 'v1', {name: 'กลุ่มคน หนึ่งคนถูกไฮไลต์', slots: B10_SLOTS, dur: [1.2, 3], hit: 'คนที่ถูกพูดถึงเป็นสีเน้น'}, (vis, S, s, T) => {
  const z = S * .3;
  for (let i = 0; i < 6; i++) { const x = (i % 3) * S * .35, y = Math.floor(i / 3) * S * .5 + S * .04;
    const p = person(vis, x, y, z, 'rgba(20,33,61,.25)'); p.style.opacity = 0; mv.pop(p, T.t0 + .1 + i * .03, 'scale(.5)');
    if (i === 4) { const on = person(vis, x, y, z, NAVY); on.style.opacity = 0; mv.pop(on, T.hit, 'scale(1.4)'); const dot = div(`left:${x + z * .3}px;top:${y + z * 1.3}px;width:${z * .4}px;height:${z * .12}px;border-radius:${z}px;background:${ACC};opacity:0`, vis); mv.pop(dot, T.hit + .05); } }
  snd('hit', T.hit);
});
/* B10 v3: two people, a line joins them and the link icon pops in the middle */
WIDGET('B10', 'v3', {name: 'สองคนมีเส้นเชื่อม', slots: B10_SLOTS, dur: [1.2, 3], hit: 'เส้นเชื่อมวาดถึงอีกคน'}, (vis, S, s, T) => {
  const z = S * .36, y = S * .32;
  const a = div(`left:0;top:${y}px;width:${z}px;height:${z}px;border-radius:50%;background:#EEF0F4;overflow:hidden`, vis); person(a, z * .18, z * .22, z * .64, NAVY); mv.pop(a, T.t0 + .1);
  const b = div(`left:${S - z}px;top:${y}px;width:${z}px;height:${z}px;border-radius:50%;background:${ACC};overflow:hidden`, vis); person(b, z * .18, z * .22, z * .64, INK); mv.pop(b, T.t0 + .2);
  const ln = svg(S - 2 * z, 10, `<path d="M0 5 H${S - 2 * z}" stroke="${NAVY}" stroke-width="6" stroke-linecap="round"/>`, `left:${z}px;top:${y + z / 2 - 5}px`, vis); mv.draw(ln.querySelector('path'), T.hit - .35, .35);
  const m = div(`left:${S / 2 - S * .13}px;top:${y + z / 2 - S * .13}px;width:${S * .26}px;height:${S * .26}px;border-radius:50%;background:${NAVY};display:flex;align-items:center;justify-content:center;opacity:0`, vis, ico(s.link ?? 'heart-handshake', S * .16, '#fff', 2.2));
  mv.pop(m, T.hit); snd('hit', T.hit);
});
