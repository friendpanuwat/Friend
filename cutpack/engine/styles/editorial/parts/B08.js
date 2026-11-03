/* B08 เป้าหมาย / ผลลัพธ์ / สำเร็จ — the result reached, the goal hit. */
const B08_SLOTS = {
  goal: {type: 'text', max: 16, req: true},   // the goal or result, in the speaker's words
  icon: {type: 'icon', req: true},
  num:  {type: 'text', max: 10},             // only if said: "10 กิโล", "ครั้งเดียว"
  lead: {type: 'text', max: 26},
  key:  {type: 'text', max: 14},
};
const goalLine = (c, s, top, color, style = 'CardSans', size = 84) => { const w = div(`left:80px;width:920px;top:${top}px;display:flex;justify-content:center`, c); const g = div(`position:relative;font-family:${style};font-size:${size}px;line-height:1.2;white-space:nowrap;color:${color};opacity:0`, w); g.textContent = s.goal; fitW(g, 920); return g; };

/* v1: a bullseye — the arrow flies in and lands in the centre on the key word (skill C11 / W14) */
PART('B08', 'v1', {name: 'เป้าพร้อมลูกศรเข้ากลาง', bgs: ['glow', 'cream', 'white'], slots: B08_SLOTS, dur: [1.2, 3.5],
  hit: 'ลูกศรปักกลางเป้าตรงคำ "สำเร็จ ได้ ถึง"'}, (c, s, T) => {
  const o = ON[T.bg];
  target(c, T.t0 + .05, T.hit, 'left:270px;top:270px', {size: 540});
  tile(c, s.icon, T.t0 + .25, 'left:110px;top:200px', {size: 150, bg: o.sub === 'glass' ? 'glass' : o.sub, color: o.ink, sound: false});
  mv.lead(goalLine(c, s, 880, o.ink), T.t0 + .3);
  if (s.num) { const ch = pill(c, s.num, T.hit + .1, 'left:0;top:1000px', {sound: false}); FITS.push(() => { ch.style.left = `${540 - ch.offsetWidth / 2}px`; }); }   // under the goal, clear of the target
  cardText(c, T, s.lead, s.key, 1260);
});

/* v2: a progress bar fills to the end exactly on the key word, a check pops at its end (no percent: none was said) */
PART('B08', 'v2', {name: 'แถบความคืบหน้าเต็ม', bgs: ['glow', 'white', 'cream'], slots: B08_SLOTS, dur: [1.2, 3.5],
  hit: 'แถบเต็มพอดีตรงคำ แล้วเครื่องหมายถูกเด้งที่ปลายแถบ'}, (c, s, T) => {
  const o = ON[T.bg], dark = o.ink === '#FFFFFF', W = 760;
  tile(c, s.icon, T.t0 + .05, 'left:440px;top:240px', {size: 200, bg: o.tile, color: o.tileInk, sound: false});
  const track = div(`left:160px;top:560px;width:${W}px;height:80px;border-radius:40px;background:${o.track};overflow:hidden`, c);
  const fill = div(`left:0;top:0;width:${W}px;height:80px;border-radius:40px;background:${dark ? ACC : NAVY};transform-origin:0 50%`, track);
  mv.growX(fill, T.t0 + .2, .35); mv.fallTo(fill, T.hit - MOTION.fall.d, .35, 1, 0, 'X');
  const ok = div(`left:${160 + W - 70}px;top:530px;width:140px;height:140px;border-radius:50%;background:${ACC};display:flex;align-items:center;justify-content:center;box-shadow:0 18px 40px rgba(0,0,0,.35);opacity:0`, c, ico('check', 84, INK, 3.4));
  mv.pop(ok, T.hit); ripple(c, 160 + W, 600, T.hit, 3, dark ? ACC : NAVY); snd('hit', T.hit);
  mv.lead(goalLine(c, s, 760, o.ink), T.t0 + .3);
  if (s.num) { const ch = pill(c, s.num, T.hit + .1, 'left:0;top:900px', {sound: false}); FITS.push(() => { ch.style.left = `${540 - ch.offsetWidth / 2}px`; }); }
  cardText(c, T, s.lead, s.key, 1260);
});

/* v3: a mountain drawn in one line, the flag planted on the summit at the key word */
PART('B08', 'v3', {name: 'ธงปักบนยอด', bgs: ['glow', 'cream', 'white'], slots: B08_SLOTS, dur: [1.2, 3.5],
  hit: 'ธงปักบนยอดเขาตรงคำ + วงคลื่น'}, (c, s, T) => {
  const o = ON[T.bg], dark = o.ink === '#FFFFFF';
  const m = svg(860, 520, `<path d="M0 500 L250 230 L360 330 L520 90 L860 500" fill="none" stroke="${dark ? 'rgba(255,255,255,.3)' : 'rgba(20,33,61,.25)'}" stroke-width="16" stroke-linejoin="round" stroke-linecap="round"/>
    <path d="M0 500 L250 230 L360 330 L520 90" fill="none" stroke="${dark ? ACC : NAVY}" stroke-width="16" stroke-linejoin="round" stroke-linecap="round"/>`, 'left:110px;top:300px', c);
  const [hill, climb] = m.querySelectorAll('path');
  mv.draw(hill, T.t0 + .05, .6); mv.draw(climb, T.hit - .65, .6);   // the climb reaches the summit on the key word
  const flag = div('left:600px;top:200px;width:160px;height:200px;transform-origin:30px 200px;opacity:0', c, `<svg width="160" height="200" viewBox="0 0 160 200"><rect x="22" y="0" width="14" height="200" rx="7" fill="${o.ink}"/><path d="M36 8 L150 44 L36 82 Z" fill="${ACC}" stroke="${INK}" stroke-width="3"/></svg>`);
  mv.pop(flag, T.hit, 'scaleY(0)'); ripple(c, 630, 390, T.hit, 3, dark ? ACC : NAVY); snd('hit', T.hit);
  tile(c, s.icon, T.t0 + .2, 'left:110px;top:200px', {size: 150, bg: o.sub === 'glass' ? 'glass' : o.sub, color: o.ink, sound: false});
  mv.lead(goalLine(c, s, 880, o.ink), T.t0 + .3);
  cardText(c, T, s.lead, s.key, 1260);
});

/* v4: a circle draws itself, the big check is drawn inside it on the key word */
PART('B08', 'v4', {name: 'เครื่องหมายถูกใหญ่', bgs: ['glow', 'white', 'cream'], slots: B08_SLOTS, dur: [1.0, 3.0],
  hit: 'เครื่องหมายถูกวาดเสร็จตรงคำ + วงคลื่น'}, (c, s, T) => {
  const o = ON[T.bg], dark = o.ink === '#FFFFFF', col = dark ? ACC : NAVY;
  const g = svg(500, 500, `<circle cx="250" cy="250" r="220" fill="none" stroke="${o.track}" stroke-width="30"/>
    <circle cx="250" cy="250" r="220" fill="none" stroke="${col}" stroke-width="30" stroke-linecap="round" transform="rotate(-90 250 250)"/>
    <path d="M140 260 L220 340 L370 170" fill="none" stroke="${col}" stroke-width="44" stroke-linecap="round" stroke-linejoin="round"/>`, 'left:290px;top:270px', c);
  const [, ring, check] = g.querySelectorAll('circle, path');
  mv.show(g, T.t0 + .02); mv.ring(ring, T.t0 + .05, 1); mv.draw(check, T.hit - .3, .3);
  ripple(c, 540, 520, T.hit, 4, col); snd('hit', T.hit);
  mv.lead(goalLine(c, s, 860, o.ink), T.t0 + .3);
  cardText(c, T, s.lead, s.key, 1260);
});
