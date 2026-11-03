/* B04 ขั้นตอน / เช็กลิสต์ — a how-to in steps, or several things that must be there. Each item shows when it is said. */
const B04_SLOTS = {
  items: {type: 'list', min: 2, max: 5, req: true},   // short phrases from the script, ≤ 18 graphemes each
  at:    {type: 'list'},                              // when each item is said (seconds); default: spread from t0 to hit
  icons: {type: 'list'},                              // optional icon per item (v4)
  lead:  {type: 'text', max: 26},
  key:   {type: 'text', max: 14},
};
const itemTimes = (s, T) => s.at ?? s.items.map((_, i) => T.t0 + .25 + (T.hit - T.t0 - .25) * (s.items.length === 1 ? 1 : i / (s.items.length - 1)));
const checkItems = s => { if (s.items.length < 2 || s.items.length > 5) throw new Error('B04 needs 2–5 items'); s.items.forEach(x => { if (graphemes(x).length > 18) throw new Error(`B04 item longer than 18: ${x}`); }); };
const rowText = (parent, text, css, color, size, t) => { const r = div(`${css};font-family:CardSans;font-size:${size}px;line-height:1.2;white-space:nowrap;color:${color};opacity:0`, parent); r.textContent = text; fitW(r, parseInt(/width:(\d+)/.exec(css)[1])); mv.lead(r, t); return r; };

/* v1: numbered steps — diamond numbers, one row per step */
PART('B04', 'v1', {name: 'ขั้น 1-2-3 ขึ้นทีละขั้น', bgs: ['glow', 'cream', 'white'],   /* navy out: Friend prefers glow */ slots: B04_SLOTS, dur: [1.6, 4.0],
  hit: 'แต่ละขั้นขึ้นตรงคำของขั้นนั้น ขั้นสุดท้ายเด้ง'}, (c, s, T) => {
  checkItems(s); const o = ON[T.bg], at = itemTimes(s, T), n = s.items.length, gap = n > 4 ? 160 : 200, top = 680 - (n - 1) * gap / 2;
  s.items.forEach((it, i) => {
    num(c, i + 1, at[i], `left:110px;top:${top + i * gap - 48}px`);
    const r = rowText(c, it, `left:250px;top:${top + i * gap - 52}px;width:740px`, o.ink, 92, at[i] + .05);
    if (i === n - 1) mv.punch(r, T.hit + .05);
  });
  snd('hit', T.hit);
  cardText(c, T, s.lead, s.key, 1270);
});

/* v2: a checklist card — empty boxes, each gets ticked when its item is said */
PART('B04', 'v2', {name: 'เช็กลิสต์ติ๊กทีละข้อ', bgs: ['glow', 'cream', 'white', 'navy'], slots: B04_SLOTS, dur: [1.6, 4.0],
  hit: 'ช่องถูกติ๊กทีละข้อตามคำ ข้อสุดท้ายตรงคำสำคัญ'}, (c, s, T) => {
  checkItems(s); const at = itemTimes(s, T), n = s.items.length;
  const style = T.bg === 'glow' ? 'glass' : T.bg === 'white' ? 'navy' : 'white', ink = style === 'white' ? NAVY : '#fff';
  const H = 90 + n * 140, p = panel(c, `left:110px;top:${620 - H / 2}px;width:860px;height:${H}px`, T.t0 + .02, {style});
  s.items.forEach((it, i) => {
    const y = 55 + i * 140;
    const box = div(`left:50px;top:${y + 12}px;width:84px;height:84px;border-radius:22px;border:6px solid ${ink};opacity:.35`, p);
    rowText(p, it, `left:170px;top:${y + 10}px;width:640px`, ink, 64, T.t0 + .2 + i * MOTION.stagger);
    const tick = div(`left:50px;top:${y + 12}px;width:84px;height:84px;border-radius:22px;background:${ACC};display:flex;align-items:center;justify-content:center;opacity:0`, p, ico('check', 60, INK, 3.4));
    mv.pop(tick, at[i], 'scale(1.6)'); snd('tick', at[i]);
  });
  snd('hit', T.hit);
  cardText(c, T, s.lead, s.key, 1270);
});

/* v3: a path with stops — the line draws down, each stop lights up when its item is said */
PART('B04', 'v3', {name: 'เส้นทางมีจุดแวะ', bgs: ['glow', 'navy', 'white', 'cream'], slots: B04_SLOTS, dur: [1.6, 4.0],
  hit: 'จุดแวะสว่างทีละจุด จุดสุดท้ายมีธงตรงคำสำคัญ'}, (c, s, T) => {
  checkItems(s); const o = ON[T.bg], dark = o.ink === '#FFFFFF', at = itemTimes(s, T), n = s.items.length;
  const step = Math.min(200, 760 / (n - 1)), top = 680 - step * (n - 1) / 2, x = 190;
  const line = svg(40, 760, `<path d="M20 0 V${step * (n - 1)}" stroke="${o.track}" stroke-width="12" stroke-linecap="round" fill="none"/>
    <path d="M20 0 V${step * (n - 1)}" stroke="${dark ? ACC : NAVY}" stroke-width="12" stroke-linecap="round" fill="none"/>`, `left:${x - 20}px;top:${top}px`, c);
  mv.show(line, T.t0); mv.draw(line.querySelectorAll('path')[1], at[0], at[n - 1] - at[0] + .01);
  s.items.forEach((it, i) => {
    const y = top + i * step, last = i === n - 1;
    const dot = div(`left:${x - 40}px;top:${y - 40}px;width:80px;height:80px;border-radius:50%;background:${dark ? ACC : NAVY};display:flex;align-items:center;justify-content:center;box-shadow:0 10px 26px rgba(0,0,0,.3);opacity:0`, c, last ? ico('flag', 44, dark ? INK : '#fff', 2.6) : '');
    mv.pop(dot, at[i]);
    rowText(c, it, `left:${x + 80}px;top:${y - 48}px;width:720px`, o.ink, last ? 96 : 80, at[i] + .05);
  });
  ripple(c, x, top + (n - 1) * step, T.hit, 3, dark ? ACC : NAVY); snd('hit', T.hit);
  cardText(c, T, s.lead, s.key, 1290);
});

/* v4: a stack of cards — each new step slides up on top, the earlier ones step back */
PART('B04', 'v4', {name: 'การ์ดซ้อนขึ้นทีละใบ', bgs: ['glow', 'cream', 'navy'], slots: B04_SLOTS, dur: [1.6, 4.0],
  hit: 'การ์ดใบสุดท้ายขึ้นมาบนสุดตรงคำ'}, (c, s, T) => {
  checkItems(s); const at = itemTimes(s, T), n = s.items.length;
  const style = T.bg === 'glow' ? 'glass' : 'white', ink = style === 'white' ? NAVY : '#fff';
  s.items.forEach((it, i) => {
    const w = div('left:150px;top:520px;width:780px;height:300px', c), h = div('inset:0', w);
    const p = panel(h, 'left:0;top:0;width:780px;height:300px', at[i], {style, radius: 40});
    if (style === 'glass') p.style.background = '#1A2033';                      // opaque, so the cards behind do not show through
    const badge = div(`left:44px;top:44px;width:110px;height:110px;border-radius:30px;background:${ACC};display:flex;align-items:center;justify-content:center;font-family:KeySans;font-size:60px;color:${INK}`, p);
    if (s.icons?.[i]) badge.innerHTML = ico(s.icons[i], 66, INK, 2.2); else badge.textContent = i + 1;
    rowText(p, it, 'left:44px;top:180px;width:690px', ink, 72, at[i] + .1);
    for (let j = i + 1; j < n; j++) { const k = j - i; mv.slide(w, at[j], `translateY(${-(k - 1) * 100}px) scale(${Math.pow(.92, k - 1)})`, `translateY(${-k * 100}px) scale(${Math.pow(.92, k)})`); }
    if (i < n - 1) mv.dim(h, at[i + 1]);   // a card that steps back fades, so its text never competes with the top card
  });
  snd('hit', T.hit);
  cardText(c, T, s.lead, s.key, 1270);
});
