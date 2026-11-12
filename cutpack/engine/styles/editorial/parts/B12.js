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

/* v2 was dropped by Friend on 2026-11-03 (โดมิโนล้มต่อกัน); the code is in git history. */
/* v3 'เฟืองหมุนส่งต่อกัน' was dropped by Friend on 2026-11-03 (after the overlap fix); the code is in git history. */
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
    tile(c, ic, T.t0 + .05 + i * .1, `left:${x - 70}px;top:${y - 70}px`, {size: 140, bg: i === 2 ? ACC : o.tile, color: i === 2 ? INK : o.tileInk, sound: false, float: false});
    // label inside the loop, toward the centre: clear of every arc and tile (Friend 2026-11-03)
    const lx = x + (cx - x) * .35, ly = i === 0 ? y + 130 : y - 130;   // under the top point, above the lower ones
    const lb = capt(c, t, lx - 110, ly - 30, 220, o.ink, 44); mv.lead(lb, T.t0 + .2 + i * .1);
  });
  ripple(c, cx, cy, T.hit, 4, col); snd('hit', T.hit);
  cardText(c, T, s.lead, s.key, 1290);
});
