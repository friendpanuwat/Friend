/* B12 เหตุกับผล — A leads to B (ทำให้ / เลย / จึง), sometimes on to C. */
const B12_SLOTS = {
  a:  {type: 'text', max: 12, req: true}, ia: {type: 'icon', req: true},
  b:  {type: 'text', max: 12, req: true}, ib: {type: 'icon', req: true},
  c:  {type: 'text', max: 12},            ic: {type: 'icon'},              // v4 needs the third step
  lead: {type: 'text', max: 26},
  key:  {type: 'text', max: 14},
};
const capt = (parent, text, x, y, w, color, size = 56) => { const l = div(`left:${x}px;top:${y}px;width:${w}px;text-align:center;font-family:CardSans;font-size:${size}px;line-height:1.2;white-space:nowrap;color:${color};opacity:0`, parent); l.textContent = text; fitW(l, w); return l; };

/* v1: A → arrow draws → B pops on the key word */
PART('B12', 'v1', {name: 'ไอคอน A ลูกศรไปไอคอน B', bgs: ['glow', 'cream', 'white'], slots: B12_SLOTS, dur: [1.2, 3.5],
  hit: 'ลูกศรวิ่งถึง B ตรงคำ "ทำให้" แล้ว B เด้ง'}, (c, s, T) => {
  const o = ON[T.bg], dark = o.ink === '#FFFFFF', col = dark ? ACC : NAVY;
  tile(c, s.ia, T.t0 + .05, 'left:90px;top:400px', {size: 260, bg: o.sub === 'glass' ? 'glass' : o.sub, color: o.ink, sound: false});
  mv.lead(capt(c, s.a, 40, 700, 360, o.ink), T.t0 + .15);
  const ar = svg(300, 80, `<path d="M10 40 H270" stroke="${col}" stroke-width="16" stroke-linecap="round"/><path d="M230 8 L278 40 L230 72" fill="none" stroke="${col}" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>`, 'left:390px;top:490px', c);
  const [shaft, head] = ar.querySelectorAll('path'); mv.draw(shaft, T.hit - .4, .35); head.style.opacity = 0; mv.show(head, T.hit - .06);
  const B = tile(c, s.ib, T.hit, 'left:730px;top:400px', {size: 260, bg: ACC, color: INK, sound: false});
  mv.lead(capt(c, s.b, 680, 700, 360, col), T.hit + .05);
  snd('hit', T.hit);
  cardText(c, T, s.lead, s.key, 1260);
});

/* v2: dominoes fall one into the next; the first is A, the last is B, it lands on the key word */
PART('B12', 'v2', {name: 'โดมิโนล้มต่อกัน', bgs: ['glow', 'white', 'cream'], slots: B12_SLOTS, dur: [1.4, 3.5],
  hit: 'โดมิโนตัวสุดท้าย (B) ล้มตรงคำ'}, (c, s, T) => {
  const o = ON[T.bg], dark = o.ink === '#FFFFFF', N = 5, gap = 120, x0 = 70, base = 830, H = 300;   // the last one falls short of the app's right-hand strip
  const at = k => T.hit - MOTION.slide.d - (N - 1 - k) * .14;
  for (let k = 0; k < N; k++) {
    const first = k === 0, last = k === N - 1;
    const d = div(`left:${x0 + k * gap}px;top:${base - H}px;width:80px;height:${H}px;border-radius:22px;transform-origin:100% 100%;display:flex;align-items:flex-start;justify-content:center;padding-top:26px;` +
      `background:${last ? ACC : first ? (dark ? '#fff' : NAVY) : (dark ? 'rgba(255,255,255,.22)' : 'rgba(20,33,61,.18)')};box-shadow:0 18px 40px rgba(0,0,0,.25)`, c,
      first ? ico(s.ia, 60, dark ? INK : '#fff', 2.2) : last ? ico(s.ib, 60, INK, 2.2) : '');
    mv.rise(d, T.t0 + .05 + k * .05, 60);
    mv.slide(d, at(k), 'rotate(0deg)', `rotate(${last ? 60 : 30}deg)`);
  }
  div(`left:50px;top:${base}px;width:880px;height:10px;border-radius:5px;background:${o.track}`, c);
  mv.lead(capt(c, s.a, 0, base + 40, 300, o.ink, 54), T.t0 + .2);
  mv.lead(capt(c, s.b, 480, base + 40, 400, dark ? ACC : NAVY, 60), T.hit);
  snd('hit', T.hit);
  cardText(c, T, s.lead, s.key, 1260);
});

/* v3: two gears — A drives B; both turn a step at the start and again on the key word, B lights up */
PART('B12', 'v3', {name: 'เฟืองหมุนส่งต่อกัน', bgs: ['glow', 'cream', 'white'], slots: B12_SLOTS, dur: [1.2, 3.5],
  hit: 'เฟืองหมุนส่งแรงถึง B ตรงคำ แล้ว B เป็นสีเน้น'}, (c, s, T) => {
  const o = ON[T.bg], dark = o.ink === '#FFFFFF';
  const gear = (x, y, size, col, ic, icCol) => { const g = div(`left:${x}px;top:${y}px;width:${size}px;height:${size}px`, c);
    const r = div('inset:0', g, ico('cog', size, col, 1.6)); div(`left:${size * .3}px;top:${size * .3}px;width:${size * .4}px;height:${size * .4}px;display:flex;align-items:center;justify-content:center`, g, ico(ic, size * .26, icCol, 2.2)); return [g, r]; };
  const [ga, ra] = gear(130, 330, 400, o.ink, s.ia, o.ink), [gb, rb] = gear(500, 520, 360, dark ? 'rgba(255,255,255,.35)' : 'rgba(20,33,61,.3)', s.ib, o.soft);
  const [gb2, rb2] = gear(500, 520, 360, dark ? ACC : NAVY, s.ib, dark ? ACC : NAVY); gb2.style.opacity = 0;
  mv.pop(ga, T.t0 + .05); mv.pop(gb, T.t0 + .15);
  for (const [r, dir] of [[ra, 1], [rb, -1], [rb2, -1]]) { mv.slide(r, T.t0 + .3, 'rotate(0deg)', `rotate(${dir * 30}deg)`); mv.slide(r, T.hit - MOTION.slide.d, `rotate(${dir * 30}deg)`, `rotate(${dir * 90}deg)`); }
  mv.show(gb2, T.hit); snd('hit', T.hit);
  mv.lead(capt(c, s.a, 80, 250, 500, o.ink, 58), T.t0 + .2);
  mv.lead(capt(c, s.b, 480, 900, 400, dark ? ACC : NAVY, 60), T.hit);
  cardText(c, T, s.lead, s.key, 1270);
});

/* v4: a loop — A → B → C → back to A, the arrows draw one after another and close on the key word */
PART('B12', 'v4', {name: 'วงจรวน A ไป B ไป C', bgs: ['glow', 'white', 'cream'], slots: B12_SLOTS, dur: [1.6, 4.0],
  hit: 'ลูกศรเส้นสุดท้ายปิดวงตรงคำ'}, (c, s, T) => {
  if (!s.c || !s.ic) throw new Error('B12.v4 needs c and ic (three steps)');
  const o = ON[T.bg], dark = o.ink === '#FFFFFF', col = dark ? ACC : NAVY, cx = 540, cy = 600, R = 300;
  const pos = [-90, 30, 150].map(a => [cx + R * Math.cos(a * Math.PI / 180), cy + R * Math.sin(a * Math.PI / 180)]);
  const arcs = [0, 1, 2].map(i => { const a0 = -90 + i * 120 + 24, a1 = a0 + 72, p = a => [cx + R * Math.cos(a * Math.PI / 180), cy + R * Math.sin(a * Math.PI / 180)]; const [x0, y0] = p(a0), [x1, y1] = p(a1); return `M${x0} ${y0} A${R} ${R} 0 0 1 ${x1} ${y1}`; });
  const g = svg(1080, 1200, arcs.map(d => `<path d="${d}" fill="none" stroke="${col}" stroke-width="14" stroke-linecap="round"/>`).join(''), 'left:0;top:0', c);
  const step = (T.hit - T.t0 - .5) / 3;
  g.querySelectorAll('path').forEach((p, i) => mv.draw(p, T.t0 + .35 + i * step, step * .9));
  [[s.a, s.ia], [s.b, s.ib], [s.c, s.ic]].forEach(([t, ic], i) => {
    const [x, y] = pos[i];
    tile(c, ic, T.t0 + .05 + i * .1, `left:${x - 85}px;top:${y - 85}px`, {size: 170, bg: i === 2 ? ACC : o.tile, color: i === 2 ? INK : o.tileInk, sound: false, float: false});
    const lb = capt(c, t, x - 170, y + (i === 0 ? -150 : 95), 340, o.ink, 50); mv.lead(lb, T.t0 + .2 + i * .1);
  });
  ripple(c, cx, cy, T.hit, 4, col); snd('hit', T.hit);
  cardText(c, T, s.lead, s.key, 1290);
});
