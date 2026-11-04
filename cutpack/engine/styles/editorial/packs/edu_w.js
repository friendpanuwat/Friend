/* PACK edu — overlay widgets (the 11 learning pieces Friend kept on 2026-11-04). Rules as in packs/biz_w.js. */
WIDGET('B04', 'edu1', {pack: EDU, code: 'EDU-P1', name: 'เช็กลิสต์ติ๊กด้วยปากกา', slots: B04_SLOTS, dur: [1.2, 3.5], hit: 'ข้อสุดท้ายถูกติ๊กด้วยปากกา แถบเน้นวิ่งใต้'}, (vis, S, s, T) => {
  const n = Math.min(3, s.items.length), at = itemTimes(s, T), z = S * .22;
  for (let k = 0; k < n; k++) { const y = k * S * .33, last = k === n - 1;
    div(`left:0;top:${y}px;width:${z}px;height:${z}px;border-radius:${z * .25}px;border:3px solid ${NAVY};box-sizing:border-box`, vis);
    mv.draw(svg(z * 1.3, z * 1.2, `<path d="M${z * .1} ${z * .55} L${z * .45} ${z * .95} L${z * 1.25} ${z * .1}" fill="none" stroke="${last ? '#0A0A0A' : NAVY}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>`, `left:0;top:${y - z * .2}px`, vis).querySelector('path'), at[k] - .25, .25);
    skel(vis, `left:${S * .32}px;top:${y + z * .3}px;width:${S * .66}px`, [.9], {color: WG, h: S * .07});
    if (last) mv.fill(div(`left:${S * .32}px;top:${y + z * .85}px;width:${S * .66}px;height:${S * .05}px;border-radius:3px;background:${ACC};transform-origin:0 50%`, vis), at[k], 0, 1); }
  snd('hit', T.hit);
});
WIDGET('B08', 'edu1', {pack: EDU, code: 'EDU-P2', name: 'ใบประกาศ', slots: B08_SLOTS, dur: [1.0, 3], hit: 'ตราติดลงบนใบประกาศ'}, (vis, S, s, T) => {
  const c = div(`left:0;top:${S * .1}px;width:${S}px;height:${S * .7}px;border-radius:${S * .05}px;background:#F4F5F8;border:3px double ${NAVY};box-sizing:border-box;opacity:0`, vis);
  div(`left:0;top:${S * .06}px;width:100%;display:flex;justify-content:center`, c, ico(s.icon ?? 'graduation-cap', S * .2, NAVY, 2.2));
  skel(c, `left:${S * .18}px;top:${S * .34}px;width:${S * .6}px`, [1, .6], {color: WG, h: S * .05, gap: S * .05});
  mv.rise(c, T.t0 + .05, 30);
  const seal = div(`left:${S * .62}px;top:${S * .56}px;width:${S * .36}px;height:${S * .36}px;border-radius:50%;background:${ACC};border:3px solid ${INK};display:flex;align-items:center;justify-content:center;opacity:0`, vis, ico('award', S * .2, INK, 2.4));
  mv.pop(seal, T.hit, 'scale(2) rotate(-40deg)'); snd('hit', T.hit);
});
WIDGET('B13', 'edu1', {pack: EDU, code: 'EDU-P3', name: 'กล่องคำสั่ง AI', slots: B13_SLOTS, dur: [1.0, 3], hit: 'ปุ่มส่งถูกกด ประกายเด้ง'}, (vis, S, s, T) => {
  const box = div(`left:0;top:${S * .4}px;width:${S}px;height:${S * .4}px;border-radius:${S * .14}px;background:#EEF0F4;opacity:0`, vis); mv.rise(box, T.t0 + .05, 30);
  const sk = skel(box, `left:${S * .1}px;top:${S * .12}px;width:${S * .55}px`, [1, .6], {color: 'rgba(20,33,61,.3)', h: S * .05, gap: S * .05, t: T.t0 + .3});
  const send = div(`left:${S * .7}px;top:${S * .08}px;width:${S * .24}px;height:${S * .24}px;border-radius:50%;background:${ACC};display:flex;align-items:center;justify-content:center`, box, ico('arrow-up', S * .15, INK, 3)); mv.punch(send, T.hit);
  mv.pop(div(`left:${S * .3}px;top:0;opacity:0`, vis, ico(s.icon ?? 'sparkles', S * .38, NAVY, 2.2)), T.hit + .05); snd('hit', T.hit);
});
WIDGET('B02', 'edu1', {pack: EDU, code: 'EDU-P4', name: 'กองหนังสือ', slots: B02_SLOTS, dur: [1.2, 3], hit: 'ขึ้น: หนังสือเล่มสุดท้ายวางบนกอง · ลง: หนังสือหลุดออกเป็นสีแดง'}, (vis, S, s, T) => {
  const up = s.dir !== 'down', n = 5, h = S * .17, step = (T.hit - T.t0 - .4) / (n - 1), cols = [NAVY, '#7A869E', NAVY, '#A9B2C3', ACC];
  for (let k = 0; k < n; k++) { const w = S * (.9 - (k % 2) * .1), b = div(`left:${(S - w) / 2}px;top:${S - (k + 1) * (h + 2)}px;width:${w}px;height:${h}px;border-radius:4px;background:${k === n - 1 && !up ? RED : cols[k]};opacity:0`, vis);
    if (up) mv.fly(b, T.t0 + .4 + k * step - MOTION.fly.d, 'translate(0,-60px)');
    else { mv.pop(b, T.t0 + .05 + k * .05, 'translateY(-20px)'); if (k === n - 1) { mv.slide(b, T.hit - 2 * MOTION.slide.d, 'translate(0,0) rotate(0)', `translate(${S * .06}px,0) rotate(6deg)`); mv.slide(b, T.hit - MOTION.slide.d, `translate(${S * .06}px,0) rotate(6deg)`, `translate(${S * .45}px,${S * .1}px) rotate(18deg)`); } } }
  snd('hit', T.hit);
});
WIDGET('B09', 'edu1', {pack: EDU, code: 'EDU-P5', name: 'ตารางเรียนรายสัปดาห์', slots: B09_SLOTS, dur: [1.2, 3.5], hit: 'ช่องวันสุดท้ายเติมสี'}, (vis, S, s, T) => {
  const w = S / 7.6, step = (T.hit - T.t0 - .4) / 6;
  for (let k = 0; k < 7; k++) { const x = k * w * 1.1, hh = S * (.5 + .1 * (k % 3));
    div(`left:${x}px;top:${S * .1}px;width:${w}px;height:${S * .9}px;border-radius:${w * .3}px;background:#EEF0F4`, vis);
    mv.pop(div(`left:${x}px;top:${S - hh}px;width:${w}px;height:${hh}px;border-radius:${w * .3}px;background:${k === 6 ? ACC : NAVY};transform-origin:50% 100%;opacity:0`, vis), T.t0 + .4 + k * step, 'scaleY(0)'); }
  snd('hit', T.hit);
});
WIDGET('B11', 'edu1', {pack: EDU, code: 'EDU-P6', name: 'ฟองคำพูดสองภาษา', slots: B11_SLOTS, dur: [1.0, 3], hit: 'ฟองคำตอบสีเน้นเด้งขึ้น'}, (vis, S, s, T) => {
  const b1 = div(`left:0;top:${S * .06}px;width:${S * .72}px;height:${S * .36}px;border-radius:${S * .14}px ${S * .14}px ${S * .14}px 4px;background:${NAVY};opacity:0`, vis);
  skel(b1, `left:${S * .1}px;top:${S * .11}px;width:${S * .5}px`, [1, .6], {color: 'rgba(255,255,255,.5)', h: S * .05, gap: S * .05}); mv.pop(b1, T.t0 + .1, 'scale(.3)');
  const b2 = div(`left:${S * .28}px;top:${S * .54}px;width:${S * .72}px;height:${S * .36}px;border-radius:${S * .14}px ${S * .14}px 4px ${S * .14}px;background:${ACC};opacity:0`, vis);
  skel(b2, `left:${S * .1}px;top:${S * .11}px;width:${S * .5}px`, [1, .6], {color: 'rgba(5,5,5,.35)', h: S * .05, gap: S * .05}); mv.pop(b2, T.hit, 'scale(.3)'); snd('hit', T.hit);
});
WIDGET('EDU', 'h1', {pack: EDU, code: 'EDU-H1', name: 'บัตรคำศัพท์', slots: PARTS.EDU.h1.meta.slots, dur: [1.0, 3], hit: 'บัตรพลิกตรงคำ ด้านหลังเป็นสีเน้น'}, (vis, S, s, T) => {
  const face = (bg, ink, icon) => div(`left:0;top:${S * .14}px;width:${S}px;height:${S * .72}px;border-radius:${S * .1}px;background:${bg};display:flex;align-items:center;justify-content:center;opacity:0`, vis, ico(icon, S * .36, ink, 2.2));
  const f = face(NAVY, '#fff', 'languages'), b = face(ACC, INK, 'check');
  mv.pop(f, T.t0 + .05, 'rotate(-8deg) scale(.7)'); mv.slide(f, T.hit - MOTION.slide.d, 'rotateY(0)', 'rotateY(90deg)'); mv.pop(b, T.hit, 'rotateY(-90deg)'); snd('hit', T.hit);
});
WIDGET('EDU', 'h2', {pack: EDU, code: 'EDU-H2', name: 'แก้ประโยค', slots: PARTS.EDU.h2.meta.slots, dur: [1.0, 3], hit: 'คำที่ถูกหล่นลงแทนคำที่ผิด'}, (vis, S, s, T) => {
  const row = (top, text, color, deco) => { const r = div(`left:0;top:${top}px;width:${S}px;height:${S * .4}px;display:flex;align-items:center;justify-content:center;opacity:0`, vis);
    const t = div(`position:relative;font-family:KeySans;font-size:${S * .22}px;line-height:1.3;white-space:nowrap;color:${color};${deco}`, r); t.textContent = text; fitW(t, S - 8); return r; };
  mv.lead(row(0, s.wrong, RED, `text-decoration:underline wavy ${RED};text-underline-offset:4px`), T.t0 + .1);
  mv.fly(row(S * .5, s.right, NAVY, `background:${ACC};border-radius:8px;padding:0 .2em`), T.hit - MOTION.fly.d, 'translate(0,-30px)'); snd('hit', T.hit);
});
WIDGET('EDU', 'h3', {pack: EDU, code: 'EDU-H3', name: 'บันไดอาชีพ', slots: PARTS.EDU.h3.meta.slots, dur: [1.2, 3.5], hit: 'คนเดินถึงขั้นบนสุดตรงคำ ขั้นบนสุดเป็นสีเน้น'}, (vis, S, s, T) => {
  const n = 3, W = S / n, H = S * .18;
  for (let k = 0; k < n; k++) mv.grow(div(`left:${k * W}px;top:${S - (k + 1) * H}px;width:${W}px;height:${(k + 1) * H}px;border-radius:4px 4px 0 0;background:${k === n - 1 ? ACC : '#DCE1EA'};transform-origin:50% 100%`, vis), T.t0 + .05, 1, k);
  const mh = S * .42, man = div(`left:${W / 2 - mh / 4}px;top:${S - H - mh}px;width:${mh / 2}px;height:${mh}px;opacity:0`, vis);
  human(man, `left:0;top:0;width:${mh / 2}px;height:${mh}px`, NAVY); mv.pop(man, T.t0 + .25, 'scale(.6)');
  const a = T.t0 + .35, b = T.hit, ease = k => k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;   // one smooth climb, as the card (Friend 2026-11-04)
  const rise = x => { let y = 0; for (let k = 1; k < n; k++) { const u = Math.min(1, Math.max(0, (x - (k - .5) * W) / (.55 * W) + .5)); y += H * u * u * (3 - 2 * u); } return y; };
  HOOKS.push(t => { const x = (n - 1) * W * ease(Math.min(1, Math.max(0, (t - a) / (b - a)))); man.style.translate = `${x}px ${-rise(x)}px`; });
  snd('hit', T.hit);
});
WIDGET('EDU', 'h4', {pack: EDU, code: 'EDU-H4', name: 'สตรีคนิสัย', slots: PARTS.EDU.h4.meta.slots, dur: [1.2, 3.5], hit: 'ช่องวันสุดท้ายติดไฟ'}, (vis, S, s, T) => {
  const N = 14, z = S / 7.6, step = (T.hit - T.t0 - .4) / (N - 1);
  for (let i = 0; i < N; i++) { const x = (i % 7) * z * 1.1, y = S * .3 + Math.floor(i / 7) * z * 1.3;
    div(`left:${x}px;top:${y}px;width:${z}px;height:${z}px;border-radius:${z * .3}px;background:#EEF0F4`, vis);
    mv.pop(div(`left:${x}px;top:${y}px;width:${z}px;height:${z}px;border-radius:${z * .3}px;background:${i === N - 1 ? ACC : NAVY};opacity:0`, vis), T.t0 + .4 + i * step, 'scale(.4)'); }
  mv.pop(div(`left:${S / 2 - S * .14}px;top:0;opacity:0`, vis, ico(s.icon ?? 'flame', S * .28, NAVY, 2.4)), T.t0 + .1); snd('hit', T.hit);
});
WIDGET('EDU', 'h5', {pack: EDU, code: 'EDU-H5', name: 'แผนผังความคิด', slots: PARTS.EDU.h5.meta.slots, dur: [1.2, 3.5], hit: 'กิ่งสุดท้ายงอกออกเป็นสีเน้น'}, (vis, S, s, T) => {
  const n = Math.min(4, s.branches.length), c = S / 2, spots = [[.14, .14], [.86, .14], [.14, .86], [.86, .86]].slice(0, n), step = (T.hit - T.t0 - .5) / (n - 1), z = S * .24;
  spots.forEach(([x, y], k) => { const last = k === n - 1, tk = T.t0 + .5 + k * step;
    mv.draw(svg(S, S, `<path d="M${c} ${c} L${x * S} ${y * S}" stroke="${last ? NAVY : '#A9B2C3'}" stroke-width="5" stroke-linecap="round"/>`, 'left:0;top:0', vis).querySelector('path'), tk - .3, .3);
    mv.pop(div(`left:${x * S - z / 2}px;top:${y * S - z / 2}px;width:${z}px;height:${z}px;border-radius:50%;background:${last ? ACC : '#DCE1EA'};${last ? `border:3px solid ${INK};box-sizing:border-box` : ''};opacity:0`, vis), tk, 'scale(.4)'); });
  mv.pop(div(`left:${c - S * .17}px;top:${c - S * .17}px;width:${S * .34}px;height:${S * .34}px;border-radius:${S * .1}px;background:${NAVY};opacity:0`, vis), T.t0 + .05); snd('hit', T.hit);
});
