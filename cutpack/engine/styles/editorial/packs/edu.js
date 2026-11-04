/* =====================================================================
   PACK edu — ความรู้และพัฒนาตัวเอง: learning, languages, work, habits, AI tools
   (same rules as packs/biz.js; items wait for Friend's picks in the gallery; no logo or look of a real AI tool or app)
   ===================================================================== */
const EDU = 'edu';
const eduCol = dark => dark ? ACC : NAVY;
const eduText = (parent, text, css, color, size, font = 'CardSans') => { const e = div(`${css};font-family:${font};font-size:${size}px;line-height:1.25;white-space:nowrap;color:${color}`, parent);
  e.textContent = text; fitW(e, parseInt(/width:(\d+)/.exec(css)[1])); return e; };

/* ---------- props ---------- */

/* P1 → B04: the checklist on a ruled notebook page; each line is ticked in pen as it is said */
// Friend 2026-11-04: no notebook page — keep the skill's own card look; what stays is the hand-drawn pen tick
PART('B04', 'edu1', {pack: EDU, code: 'EDU-P1', name: 'เช็กลิสต์ติ๊กด้วยปากกา', bgs: ['glow', 'cream', 'white'], slots: B04_SLOTS, dur: [1.4, 4.0],
  hit: 'ข้อสุดท้ายถูกติ๊กด้วยปากกาและแถบเน้นวิ่งใต้คำตรงคำ + วงคลื่น'}, (c, s, T) => {
  const o = ON[T.bg], dark = o.ink === '#FFFFFF', n = s.items.length, at = itemTimes(s, T), col = eduCol(dark), y0 = 560 - n * 70;
  for (let k = 0; k < n; k++) {
    const y = y0 + k * 140, last = k === n - 1;
    const box = div(`left:150px;top:${y}px;width:96px;height:96px;border-radius:24px;border:7px solid ${o.ink};opacity:0`, c); mv.pop(box, T.t0 + .05 + k * MOTION.stagger, 'scale(.5)');
    const tick = svg(120, 110, `<path d="M10 56 L42 90 L112 10" fill="none" stroke="${last ? ACC : col}" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>`, `left:146px;top:${y - 18}px`, c);
    mv.draw(tick.querySelector('path'), at[k] - .25, .25);
    if (last) { const hl = div(`left:300px;top:${y + 92}px;width:600px;height:16px;border-radius:8px;background:${ACC};transform-origin:0 50%`, c); mv.fill(hl, at[k], 0, 1); }   // the bar runs under the words, never through them
    rowText(c, s.items[k], `left:300px;top:${y + 8}px;width:600px`, o.ink, 64, T.t0 + .2 + k * .08);
  }
  ripple(c, 198, y0 + (n - 1) * 140 + 48, T.hit, 3, col); snd('hit', T.hit);
  cardText(c, T, s.lead, s.key);
});

/* P2 → B08: a certificate slides up and the seal is pressed on it on the key word */
PART('B08', 'edu1', {pack: EDU, code: 'EDU-P2', name: 'ใบประกาศ', bgs: ['glow', 'cream', 'white'], slots: B08_SLOTS, dur: [1.2, 3.5],
  hit: 'ตราติดลงบนใบประกาศตรงคำ "ผ่าน สำเร็จ" + วงคลื่น'}, (c, s, T) => {
  const o = ON[T.bg], paper = T.bg === 'white' ? '#F4F5F8' : '#FFFFFF';
  const cert = div(`left:140px;top:230px;width:800px;height:560px;border-radius:20px;background:${paper};box-shadow:0 30px 70px rgba(0,0,0,.35);opacity:0`, c);
  div(`left:24px;top:24px;width:752px;height:512px;border-radius:12px;border:6px double ${NAVY}`, cert);
  div('left:0;top:60px;width:800px;display:flex;justify-content:center', cert, ico(s.icon, 100, NAVY, 2));
  eduText(cert, s.goal, 'left:60px;top:200px;width:680px;text-align:center', NAVY, 70, 'KeySans');
  skel(cert, 'left:200px;top:320px;width:400px', [1, .7], {h: 18, gap: 22, t: T.t0 + .35});
  mv.rise(cert, T.t0 + .02);
  const seal = div('left:640px;top:600px;width:220px;height:220px;opacity:0', c, `<svg width="220" height="220" viewBox="0 0 220 220">${Array.from({length: 16}, (_, k) => { const a = k * Math.PI / 8; return `<circle cx="${110 + 92 * Math.cos(a)}" cy="${110 + 92 * Math.sin(a)}" r="22" fill="${ACC}"/>`; }).join('')}<circle cx="110" cy="110" r="92" fill="${ACC}" stroke="${INK}" stroke-width="6"/><circle cx="110" cy="110" r="66" fill="none" stroke="${INK}" stroke-width="4" stroke-dasharray="6 8"/></svg>`);
  div('left:0;top:0;width:220px;height:220px;display:flex;align-items:center;justify-content:center', seal, ico('award', 96, INK, 2.4));
  mv.pop(seal, T.hit, 'scale(2.2) rotate(-40deg)'); ripple(c, 750, 710, T.hit, 3.4, ACC); snd('hit', T.hit);
  if (s.num) chipAt(c, s.num, T.hit + .1, 400, 860);
  cardText(c, T, s.lead, s.key, 1290);
});

/* P3 → B13: a prompt box (no real tool's look) — the tip types itself in and the send button is pressed on the key word */
PART('B13', 'edu1', {pack: EDU, code: 'EDU-P3', name: 'กล่องคำสั่ง AI', bgs: ['glow', 'white', 'cream'], slots: B13_SLOTS, dur: [1.4, 3.5],
  hit: 'ข้อความพิมพ์ครบ ปุ่มส่งถูกกดตรงคำ "เคล็ดลับ วิธี" แล้วประกายเด้ง'}, (c, s, T) => {
  const o = ON[T.bg], st = bizPanel(T.bg), ink = st === 'white' ? NAVY : '#FFFFFF';
  const p = panel(c, 'left:110px;top:380px;width:860px;height:300px', T.t0 + .02, {style: st, radius: 56});
  const tx = div(`left:50px;top:60px;width:620px;height:180px;font-family:CardSans;font-size:58px;line-height:1.3;color:${ink};white-space:normal;word-break:keep-all`, p);
  const g = [...new Intl.Segmenter('th', {granularity: 'grapheme'}).segment(s.tip)].map(x => x.segment);
  const d = Math.min(MOTION.type.step, (T.hit - T.t0 - .8) / Math.max(1, g.length));   // the skill's typewriter pace, faster for long tips
  HOOKS.push(t => { const k = Math.max(0, Math.min(g.length, Math.floor((t - T.t0 - .4) / d))); tx.textContent = g.slice(0, k).join(''); });
  FITS.push(() => { tx.textContent = s.tip; if (tx.scrollHeight > 180) tx.style.fontSize = `${58 * 180 / tx.scrollHeight}px`; });
  const send = div(`left:700px;top:90px;width:120px;height:120px;border-radius:50%;background:${ACC};display:flex;align-items:center;justify-content:center;opacity:0`, p, ico('arrow-up', 70, INK, 3));
  mv.pop(send, T.t0 + .2); mv.punch(send, T.hit);
  const spark = div('left:440px;top:170px;width:200px;height:200px;opacity:0', c, ico(s.icon ?? 'sparkles', 200, eduCol(o.ink === '#FFFFFF'), 2));
  mv.pop(spark, T.hit + .05); ripple(c, 870, 530, T.hit, 3, ACC); snd('hit', T.hit);
  cardText(c, T, s.lead, s.key);
});

/* P4 → B02: books stack up one by one (up) or come off the pile (down); the last one lands on the key word */
PART('B02', 'edu1', {pack: EDU, code: 'EDU-P4', name: 'กองหนังสือ', bgs: ['glow', 'white', 'cream'], slots: B02_SLOTS, dur: [1.4, 3.5],
  hit: 'ขึ้น: หนังสือเล่มสุดท้ายวางลงบนกอง · ลง: หนังสือหลุดออกจากกองเป็นสีแดง'}, (c, s, T) => {
  const o = ON[T.bg], dark = o.ink === '#FFFFFF', up = s.dir !== 'down';
  const cols = dark ? ['#FFFFFF', 'rgba(255,255,255,.55)', '#FFFFFF', 'rgba(255,255,255,.35)', '#FFFFFF', ACC] : [NAVY, '#7A869E', NAVY, '#A9B2C3', NAVY, ACC];
  const n = 6, step = (T.hit - T.t0 - .4) / (n - 1);
  for (let k = 0; k < n; k++) {
    const w = 520 - (k % 3) * 40, x = 540 - w / 2 + ((k * 37) % 50) - 25, y = 820 - (k + 1) * 92;
    const b = div(`left:${x}px;top:${y}px;width:${w}px;height:84px;border-radius:14px;background:${k === n - 1 && !up ? RED : cols[k]};box-shadow:0 10px 24px rgba(0,0,0,.25);opacity:0`, c);
    div(`left:24px;top:0;width:14px;height:84px;background:rgba(0,0,0,.18)`, b);
    if (up) mv.fly(b, T.t0 + .4 + k * step - MOTION.fly.d, 'translate(0,-300px)');
    else { mv.pop(b, T.t0 + .05 + k * .05, 'translateY(-80px)'); if (k >= n - 2) { const t1 = T.hit - MOTION.slide.d - (n - 1 - k) * .45, side = k === n - 1 ? 1 : -1;   // Friend 2026-11-04: fell too fast — tip, then slide off a short way
      mv.slide(b, t1 - MOTION.slide.d, 'translate(0,0) rotate(0)', `translate(${side * 40}px,0) rotate(${side * 6}deg)`);
      mv.slide(b, t1, `translate(${side * 40}px,0) rotate(${side * 6}deg)`, `translate(${side * 230}px,60px) rotate(${side * 16}deg)`); } }
  }
  div(`left:180px;top:820px;width:720px;height:10px;border-radius:5px;background:${o.track}`, c);
  ripple(c, 540, 820 - n * 92 + 40, T.hit, 3, up ? eduCol(dark) : RED); snd('hit', T.hit);
  if (s.num) chipAt(c, s.num, T.hit + .1, 540, 880);
  cardText(c, T, s.lead, s.key);
});

/* P5 → B09: a week planner; study blocks fill day by day and the last one fills on the key word */
PART('B09', 'edu1', {pack: EDU, code: 'EDU-P5', name: 'ตารางเรียนรายสัปดาห์', bgs: ['glow', 'white', 'cream'], slots: B09_SLOTS, dur: [1.4, 4.0],
  hit: 'ช่องวันสุดท้ายเติมสีตรงคำที่บอกเวลา + วงคลื่น'}, (c, s, T) => {
  const o = ON[T.bg], dark = o.ink === '#FFFFFF', col = eduCol(dark), days = ['จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส', 'อา'];
  const step = (T.hit - T.t0 - .5) / 6;
  days.forEach((d, k) => {
    const x = 115 + k * 122;
    const l = div(`left:${x}px;top:260px;width:110px;text-align:center;font-family:CardSans;font-size:52px;color:${o.soft};opacity:0`, c); l.textContent = d; mv.show(l, T.t0 + .05 + k * .03);
    const cell = div(`left:${x}px;top:350px;width:110px;height:380px;border-radius:24px;background:${o.track};opacity:0`, c); mv.show(cell, T.t0 + .05 + k * .03);
    const f = div(`left:${x}px;top:350px;width:110px;height:380px;border-radius:24px;background:${k === 6 ? ACC : col};transform-origin:50% 100%`, c);
    f.style.height = `${380 * (.5 + .08 * (k % 3))}px`; f.style.top = `${730 - 380 * (.5 + .08 * (k % 3))}px`; f.style.opacity = 0;
    mv.pop(f, T.t0 + .5 + k * step, 'scaleY(0)');   // one day at a time, the last on the key word
  });
  ripple(c, 115 + 6 * 122 + 55, 640, T.hit, 3, col); snd('hit', T.hit);
  mv.lead(whenLine(c, s, 790, o.ink, 110), T.t0 + .3);
  cardText(c, T, s.lead, s.key, 1290);
});

/* P6 → B11: a speech bubble with the words said, and the answer bubble (the key words) pops in on the key word */
PART('B11', 'edu1', {pack: EDU, code: 'EDU-P6', name: 'ฟองคำพูดสองภาษา', bgs: ['glow', 'cream', 'white'], slots: B11_SLOTS, dur: [1.2, 3.5],
  hit: 'ฟองคำตอบสีเน้นเด้งขึ้นตรงคำ'}, (c, s, T) => {
  const o = ON[T.bg], dark = o.ink === '#FFFFFF';
  const a = bubble(c, s.text, T.t0 + .1, 'left:110px;top:300px', {bg: dark ? '#FFFFFF' : NAVY, color: dark ? INK : '#FFFFFF', size: 66});
  FITS.push(() => { const w = a.inner.offsetWidth; if (w > 820) a.inner.style.fontSize = `${66 * 820 / w}px`; });
  if (s.who) { const wl = div(`left:120px;top:220px;font-family:CardSans;font-size:46px;white-space:nowrap;color:${o.soft};opacity:0`, c); wl.textContent = s.who; mv.lead(wl, T.t0 + .05); }
  if (s.key) { const b = bubble(c, s.key, T.hit, 'left:0;top:560px', {bg: ACC, color: INK, side: 'right', size: 76}); FITS.push(() => { b.style.left = `${Math.max(110, 930 - b.inner.offsetWidth)}px`; }); }
  ripple(c, 760, 640, T.hit, 3, eduCol(dark)); snd('hit', T.hit);
  cardText(c, T, s.lead, null, 1290);
});

/* ---------- hero parts ---------- */

/* H1: a flash card — the word on the front, it flips on the key word to show the meaning and how to say it */
PART('EDU', 'h1', {pack: EDU, code: 'EDU-H1', name: 'บัตรคำศัพท์', bgs: ['glow', 'white', 'cream'],
  slots: {word: {type: 'text', max: 18, req: true}, meaning: {type: 'text', max: 18}, say: {type: 'text', max: 18}, lead: {type: 'text', max: 26}, key: {type: 'text', max: 14}}, dur: [1.4, 3.5],
  hit: 'บัตรพลิกตรงคำ ด้านหลังเป็นความหมายและคำอ่าน'}, (c, s, T) => {
  const o = ON[T.bg], dark = o.ink === '#FFFFFF';
  const face = (bg, ink) => div(`left:190px;top:300px;width:700px;height:460px;border-radius:40px;background:${bg};box-shadow:0 30px 70px rgba(0,0,0,.35);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:24px;opacity:0`, c);
  const front = face(dark ? '#FFFFFF' : NAVY), back = face(ACC);
  eduText(front, s.word, 'position:relative;width:600px;text-align:center', dark ? INK : '#FFFFFF', 110, 'KeySans');
  if (s.meaning) eduText(back, s.meaning, 'position:relative;width:600px;text-align:center', INK, 96, 'KeySans');
  if (s.say) eduText(back, s.say, 'position:relative;width:600px;text-align:center', INK, 58);
  mv.pop(front, T.t0 + .05, 'rotate(-8deg) scale(.7)');
  mv.slide(front, T.hit - MOTION.slide.d, 'rotateY(0)', 'rotateY(90deg)');
  mv.pop(back, T.hit, 'rotateY(-90deg)');
  ripple(c, 540, 530, T.hit, 4, eduCol(dark)); snd('hit', T.hit);
  cardText(c, T, s.lead, s.key);
});

/* H2: a sentence corrected — the wrong word is underlined in red, then the right word drops in over it on the key word */
PART('EDU', 'h2', {pack: EDU, code: 'EDU-H2', name: 'แก้ประโยค', bgs: ['glow', 'white', 'cream'],
  slots: {before: {type: 'text', max: 14}, wrong: {type: 'text', max: 10, req: true}, right: {type: 'text', max: 10, req: true}, after: {type: 'text', max: 14}, lead: {type: 'text', max: 26}, key: {type: 'text', max: 14}}, dur: [1.4, 3.5],
  hit: 'คำที่ถูกหล่นลงแทนคำที่ผิดตรงคำ "แต่ ที่ถูก" + วงคลื่น'}, (c, s, T) => {
  const o = ON[T.bg], dark = o.ink === '#FFFFFF';
  const line = (top, word, color, deco) => { const r = div(`left:80px;top:${top}px;width:920px;display:flex;justify-content:center;align-items:baseline;gap:.3em;font-family:KeySans;font-size:92px;line-height:1.3;white-space:nowrap;color:${o.ink};opacity:0`, c);
    if (s.before) div('position:relative', r, '').textContent = s.before;
    const w = div(`position:relative;color:${color};${deco}`, r); w.textContent = word;
    if (s.after) div('position:relative', r, '').textContent = s.after; fitW(r, SAFE_W); return [r, w]; };
  const [r1] = line(330, s.wrong, RED, `text-decoration:underline wavy ${RED};text-underline-offset:14px`);
  mv.lead(r1, T.t0 + .1);
  const x = div(`left:880px;top:330px;width:110px;height:110px;border-radius:50%;background:${RED};display:flex;align-items:center;justify-content:center;opacity:0`, c, ico('x', 66, '#FFFFFF', 3.4)); mv.pop(x, T.t0 + .4);
  const [r2] = line(600, s.right, dark ? ACC : NAVY, '');
  mv.fly(r2, T.hit - MOTION.fly.d, 'translate(0,-120px)');
  const ok = div(`left:880px;top:600px;width:110px;height:110px;border-radius:50%;background:${ACC};display:flex;align-items:center;justify-content:center;opacity:0`, c, ico('check', 66, INK, 3.4)); mv.pop(ok, T.hit);
  ripple(c, 540, 670, T.hit, 3.6, eduCol(dark)); snd('hit', T.hit);
  cardText(c, T, s.lead, s.key, 1290);
});

/* H3: career stairs — a figure climbs step by step past the labels said; it reaches the top step on the key word */
PART('EDU', 'h3', {pack: EDU, code: 'EDU-H3', name: 'บันไดอาชีพ', bgs: ['glow', 'white', 'cream'],
  slots: {steps: {type: 'list', max: 4, req: true}, lead: {type: 'text', max: 26}, key: {type: 'text', max: 14}}, dur: [1.6, 4.0],
  hit: 'คนเดินถึงขั้นบนสุดตรงคำ ขั้นบนสุดสว่างเป็นสีเน้น + วงคลื่น'}, (c, s, T) => {
  const st = s.steps, n = st.length;
  if (n < 2 || n > 4) throw new Error('EDU.h3 needs 2–4 steps');
  const o = ON[T.bg], dark = o.ink === '#FFFFFF', col = eduCol(dark), W = 760 / n, H = 120, x0 = 160, y0 = 860;
  for (let k = 0; k < n; k++) {
    const x = x0 + k * W, top = y0 - (k + 1) * H, last = k === n - 1;
    const b = div(`left:${x}px;top:${top}px;width:${W}px;height:${(k + 1) * H}px;border-radius:16px 16px 0 0;background:${last ? ACC : (dark ? 'rgba(255,255,255,.14)' : '#DCE1EA')};transform-origin:50% 100%`, c);
    mv.grow(b, T.t0 + .05, 1, k);
    const lb = eduText(c, st[k], `left:${x + 6}px;top:${top + 20}px;width:${W - 12}px;text-align:center;opacity:0`, last ? INK : o.ink, 44);
    mv.lead(lb, T.t0 + .3 + k * .08);
  }
  // Friend 2026-11-04: a more realistic person; it walks up in one smooth climb (below). `translate` moves it, so the pop-in keeps `transform`
  const man = div(`left:${x0 + W / 2 - 60}px;top:${y0 - H - 250}px;width:120px;height:240px;opacity:0`, c), lift = div('left:0;top:0;width:120px;height:240px', man);
  human(lift, 'left:0;top:0;width:120px;height:240px', o.ink);
  mv.pop(man, T.t0 + .25, 'scale(.6)');   // after the first step has grown under the feet
  // Friend 2026-11-04 (second note): smoother — one continuous walk to the top instead of a stop on every step.
  // Progress eases in and out once over the whole climb (ending on the key word); the height follows the stairs with a
  // smooth rise over each step's edge. Set again on every seek, like mv.count, so any frame renders the same.
  const a = T.t0 + .35, b = T.hit, ease = k => k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
  const rise = x => { let y = 0; for (let k = 1; k < n; k++) { const u = Math.min(1, Math.max(0, (x - (k - .5) * W) / (.55 * W) + .5)); y += H * u * u * (3 - 2 * u); } return y; };
  HOOKS.push(t => { const x = (n - 1) * W * ease(Math.min(1, Math.max(0, (t - a) / (b - a)))); man.style.translate = `${x}px ${-rise(x)}px`; });
  ripple(c, x0 + (n - .5) * W, y0 - n * H, T.hit, 3, col); snd('hit', T.hit);
  cardText(c, T, s.lead, s.key, 1290);
});

/* H4: a habit streak — day boxes light one after another and the streak count lands on the key word */
PART('EDU', 'h4', {pack: EDU, code: 'EDU-H4', name: 'สตรีคนิสัย', bgs: ['glow', 'white', 'cream'],
  slots: {habit: {type: 'text', max: 16}, days: {type: 'number'}, icon: {type: 'icon'}, lead: {type: 'text', max: 26}, key: {type: 'text', max: 14}}, dur: [1.6, 4.0],
  hit: 'ช่องวันสุดท้ายติดไฟ ตัวนับวันต่อเนื่องหยุดตรงคำ + วงคลื่น'}, (c, s, T) => {
  const o = ON[T.bg], dark = o.ink === '#FFFFFF', col = eduCol(dark), N = 21, step = (T.hit - T.t0 - .5) / (N - 1);
  for (let i = 0; i < N; i++) {
    const x = 140 + (i % 7) * 116, y = 400 + Math.floor(i / 7) * 116;
    const b = div(`left:${x}px;top:${y}px;width:96px;height:96px;border-radius:24px;background:${o.track};opacity:0`, c); mv.show(b, T.t0 + .05 + i * .01);
    const on = div(`left:${x}px;top:${y}px;width:96px;height:96px;border-radius:24px;background:${i === N - 1 ? ACC : col};display:flex;align-items:center;justify-content:center;opacity:0`, c, i === N - 1 ? ico(s.icon ?? 'flame', 60, INK, 2.6) : '');
    mv.pop(on, T.t0 + .5 + i * step, 'scale(.4)');
  }
  const top = div('left:80px;width:920px;top:220px;display:flex;justify-content:center;align-items:baseline;gap:24px', c);
  div('position:relative;width:110px;height:110px;align-self:center', top, ico(s.icon ?? 'flame', 110, col, 2.4));
  if (s.days != null) { const d = div(`position:relative;font-family:KeySans;font-size:130px;line-height:1.1;white-space:nowrap;color:${o.ink}`, top); d.textContent = `${s.days} วัน`; mv.count(d, T.hit - MOTION.count.d, 0, s.days, v => `${Math.round(v)} วัน`); }
  else if (s.habit) { const h = div(`position:relative;font-family:KeySans;font-size:90px;line-height:1.2;white-space:nowrap;color:${o.ink}`, top); h.textContent = s.habit; }
  fitW(top, SAFE_W); mv.punch(top, T.hit);
  if (s.habit && s.days != null) mv.lead(bizLine(c, s.habit, 780, o.ink), T.t0 + .3);
  ripple(c, 140 + 6 * 116 + 48, 400 + 2 * 116 + 48, T.hit, 3, col); snd('hit', T.hit);
  cardText(c, T, s.lead, s.key, 1290);
});

/* H5: a mind map — the topic in the middle, 3–4 branches grow out one by one; the last branch lands on the key word */
PART('EDU', 'h5', {pack: EDU, code: 'EDU-H5', name: 'แผนผังความคิด', bgs: ['glow', 'white', 'cream'],
  slots: {topic: {type: 'text', max: 12, req: true}, branches: {type: 'list', max: 4, req: true}, lead: {type: 'text', max: 26}, key: {type: 'text', max: 14}}, dur: [1.6, 4.0],
  hit: 'กิ่งสุดท้ายงอกออกและป้ายสว่างเป็นสีเน้นตรงคำ'}, (c, s, T) => {
  const br = s.branches, n = br.length;
  if (n < 3 || n > 4) throw new Error('EDU.h5 needs 3 or 4 branches');
  const o = ON[T.bg], dark = o.ink === '#FFFFFF', col = eduCol(dark), cx = 540, cy = 560;
  const spots = n === 4 ? [[290, 330], [790, 330], [290, 800], [790, 800]] : [[540, 280], [270, 790], [810, 790]];
  const step = (T.hit - T.t0 - .6) / (n - 1);
  spots.forEach(([x, y], k) => {
    const tk = T.t0 + .5 + k * step, last = k === n - 1;
    const ln = svg(1080, 1100, `<path d="M${cx} ${cy} Q${(cx + x) / 2} ${cy} ${x} ${y}" fill="none" stroke="${last ? col : o.soft}" stroke-width="10" stroke-linecap="round"/>`, 'left:0;top:0', c);
    mv.draw(ln.querySelector('path'), tk - .35, .35);
    const pill = div(`left:${x - 150}px;top:${y - 50}px;width:300px;height:100px;border-radius:50px;background:${last ? ACC : (dark ? '#262C3A' : '#FFFFFF')};box-shadow:0 14px 30px rgba(0,0,0,.2);display:flex;align-items:center;justify-content:center;opacity:0`, c);   // solid: the branch line must not show through (Friend 2026-11-04)
    eduText(pill, br[k], 'position:relative;width:260px;text-align:center', last ? INK : o.ink, 52);
    mv.pop(pill, tk, 'scale(.5)');
  });
  const mid = div(`left:${cx - 190}px;top:${cy - 80}px;width:380px;height:160px;border-radius:40px;background:${dark ? '#FFFFFF' : NAVY};box-shadow:0 20px 50px rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center;opacity:0`, c);
  eduText(mid, s.topic, 'position:relative;width:340px;text-align:center', dark ? INK : '#FFFFFF', 66, 'KeySans');
  mv.pop(mid, T.t0 + .05);
  ripple(c, ...spots[n - 1], T.hit, 3, col); snd('hit', T.hit);
  cardText(c, T, s.lead, s.key, 1290);
});
