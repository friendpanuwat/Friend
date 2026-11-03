/* B02 เพิ่มขึ้น / ลดลง — something grows, drops, disappears or shoots up. Down is a negative meaning → red. */
const B02_SLOTS = {
  dir:  {type: 'choice', of: ['up', 'down'], req: true},
  num:  {type: 'text', max: 10},          // the amount as said: "3 เท่า", "ครึ่งหนึ่ง", "5 กิโล" (only if said)
  icon: {type: 'icon', req: true},        // what goes up or down (views, customers, weight …)
  lead: {type: 'text', max: 26},
  key:  {type: 'text', max: 14},
};
const RED = '#FF3B30';
const dirCol = (s, dark) => s.dir === 'down' ? RED : dark ? ACC : NAVY;
const chipAt = (c, text, t, x, y) => { const ch = pill(c, text, t, `left:${x}px;top:${y}px`, {sound: false}); FITS.push(() => { ch.style.left = `${Math.min(1080 - 80 - ch.offsetWidth, Math.max(80, x - ch.offsetWidth / 2))}px`; }); return ch; };

/* v1: five bars — up: they grow into a rising staircase; down: they stand tall, then fall at the key word */
PART('B02', 'v1', {name: 'กราฟแท่ง', bgs: ['glow', 'cream', 'white', 'navy'], slots: B02_SLOTS, dur: [1.4, 3.5],
  hit: 'ขึ้น: แท่งสุดท้ายเด้ง + วงคลื่น · ลง: ทุกแท่งร่วงพร้อมกัน แท่งสุดท้ายเป็นสีแดง'}, (c, s, T) => {
  const o = ON[T.bg], dark = o.ink === '#FFFFFF', up = s.dir === 'up';
  const base = dark ? 'rgba(255,255,255,.26)' : 'rgba(20,33,61,.82)';
  tile(c, s.icon, T.t0 + .05, 'left:205px;top:170px', {size: 150, bg: o.sub === 'glass' ? 'glass' : o.sub, color: o.ink, sound: false});
  const v0 = up ? [.28, .4, .52, .68, .92] : [.92, .86, .8, .76, .72], v1 = [.84, .64, .46, .3, .14];
  const b = bars(c, v0, T.t0 + .1, 'left:205px;top:360px', {w: 110, gap: 30, h: 540, color: base, last: dirCol(s, dark), ...(up ? {} : {to: v1, tTo: T.hit})});
  div(`left:185px;top:906px;width:710px;height:6px;border-radius:3px;background:${o.track}`, c);
  if (up) { mv.punch(b.lastChild, T.hit); ripple(c, 820, 360 + 540 * (1 - .92), T.hit, 3, dirCol(s, dark)); }
  else mv.wobble(b, T.hit + .2);
  snd(up ? 'hit' : 'swipe', T.hit);
  if (s.num) chipAt(c, s.num, T.hit + .1, 820, 230);
  cardText(c, T, s.lead, s.key);
});

/* v2: a line chart draws itself and arrives at the key word; the end point ripples */
PART('B02', 'v2', {name: 'กราฟเส้น', bgs: ['glow', 'white', 'navy'], slots: B02_SLOTS, dur: [1.4, 3.5],
  hit: 'เส้นวิ่งถึงปลายตรงคำ + วงคลื่นที่ปลายเส้น'}, (c, s, T) => {
  const o = ON[T.bg], dark = o.ink === '#FFFFFF', up = s.dir === 'up';
  const grid = [0, 1, 2, 3].map(k => `<line x1="0" x2="800" y1="${40 + k * 150}" y2="${40 + k * 150}" stroke="${o.track}" stroke-width="4"/>`).join('');
  const g = svg(800, 520, grid, 'left:140px;top:340px', c); mv.show(g, T.t0 + .05);
  const pts = up ? [[0, 440], [200, 360], [400, 390], [600, 210], [790, 70]] : [[0, 80], [200, 150], [400, 120], [600, 300], [790, 450]];
  trend(c, pts, T.hit - MOTION.draw.d, 'left:140px;top:340px', {w: 800, h: 520, color: dirCol(s, dark), sw: 16, d: MOTION.draw.d});
  const end = pts.at(-1);
  ripple(c, 140 + end[0], 340 + end[1], T.hit, 3, dirCol(s, dark));
  tile(c, s.icon, T.t0 + .1, 'left:140px;top:170px', {size: 140, bg: o.sub === 'glass' ? 'glass' : o.sub, color: o.ink, sound: false});
  snd('hit', T.hit);
  if (s.num) chipAt(c, s.num, T.hit + .1, 140 + end[0] - 60, up ? 220 : 870);
  cardText(c, T, s.lead, s.key);
});

/* v3: one big arrow tile (accent up / red down) + the amount, the topic icon floats beside it */
PART('B02', 'v3', {name: 'ลูกศรใหญ่คู่ตัวเลข', bgs: ['glow', 'navy', 'cream', 'white'], slots: B02_SLOTS, dur: [1.0, 3.0],
  hit: 'ลูกศรเด้ง + ตัวเลขขึ้นตรงคำ'}, (c, s, T) => {
  const o = ON[T.bg], dark = o.ink === '#FFFFFF', up = s.dir === 'up';
  const arrow = tile(c, up ? 'trending-up' : 'trending-down', T.t0 + .05, 'left:330px;top:300px', {size: 420, bg: up ? (dark ? ACC : NAVY) : RED, color: up ? (dark ? INK : '#fff') : '#fff', icon: .56, sound: false});
  tile(c, s.icon, T.t0 + .2, 'left:150px;top:220px', {size: 170, bg: o.sub === 'glass' ? 'glass' : o.sub, color: o.ink, sound: false});
  mv.punch(arrow.inner, T.hit); snd('hit', T.hit);
  if (s.num) {
    const w = div('left:60px;width:960px;top:800px;display:flex;justify-content:center', c);
    const n = div(`position:relative;font-family:KeySans;font-size:150px;line-height:1.1;letter-spacing:-4px;white-space:nowrap;color:${dirCol(s, dark)};opacity:0`, w, '');
    n.textContent = s.num; fitW(n, 960); mv.key(n, T.hit);
  }
  cardText(c, T, s.lead, s.key, 1260);
});

/* v4: a gauge — the needle swings up or down at the key word */
PART('B02', 'v4', {name: 'มาตรวัดเข็ม', bgs: ['glow', 'white', 'cream', 'navy'], slots: B02_SLOTS, dur: [1.2, 3.5],
  hit: 'เข็มตีขึ้นหรือลงตรงคำ'}, (c, s, T) => {
  const o = ON[T.bg], dark = o.ink === '#FFFFFF', up = s.dir === 'up', R = 330, cx = 540, cy = 880;
  const arc = (a0, a1) => { const p = a => [cx + R * Math.cos(a * Math.PI / 180), cy - R * Math.sin(a * Math.PI / 180)]; const [x0, y0] = p(a0), [x1, y1] = p(a1); return `M${x0} ${y0} A${R} ${R} 0 0 1 ${x1} ${y1}`; };
  const g = svg(1080, 1000, `<path d="${arc(180, 0)}" fill="none" stroke="${o.track}" stroke-width="64" stroke-linecap="round"/>
    <path d="${arc(180, up ? 30 : 150)}" fill="none" stroke="${dirCol(s, dark)}" stroke-width="64" stroke-linecap="round"/>`, 'left:0;top:0', c);
  mv.show(g, T.t0 + .02);
  const fill = g.querySelectorAll('path')[1]; fill.style.opacity = 0; mv.show(fill, T.hit - .3); mv.draw(fill, T.hit - .3, .4);
  const needle = div(`left:${cx - 9}px;top:${cy - 300}px;width:18px;height:300px;border-radius:9px;background:${o.ink};transform-origin:50% 100%`, c);
  mv.pop(needle, T.t0 + .1, 'scaleY(0)');   // entrance first: the swing below is created later, so it wins
  mv.slide(needle, T.hit - .3, 'rotate(0deg)', `rotate(${up ? 60 : -60}deg)`);
  const hub = div(`left:${cx - 90}px;top:${cy - 90}px;width:180px;height:180px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:${dark ? '#fff' : NAVY};box-shadow:0 20px 50px rgba(0,0,0,.3)`, c, ico(s.icon, 96, dark ? INK : '#fff', 2));
  mv.pop(hub, T.t0 + .05);
  ripple(c, cx, cy, T.hit, 3, dirCol(s, dark)); snd('hit', T.hit);
  if (s.num) chipAt(c, s.num, T.hit + .1, 540, 1000);
  cardText(c, T, s.lead, s.key, 1260);
});
