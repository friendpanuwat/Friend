/* B01 ตัวเลขเด่น — a number that matters (price, percent, count). The number must be one the speaker said. */
const B01_SLOTS = {
  num:   {type: 'number', req: true},                 // the value said in the script
  of:    {type: 'number'},                            // whole, for "3 ใน 10" / percent (default 100 for v2, 10 for v3)
  unit:  {type: 'text', max: 8},                      // บาท, %, ก้าว, ชิ้น …
  pre:   {type: 'text', max: 2},                      // a sign before the number, e.g. ฿
  icon:  {type: 'icon', req: true},
  lead:  {type: 'text', max: 26},                     // small line under the visual (words from the script)
  key:   {type: 'text', max: 14},                     // the big word at the hit
};
const fmtNum = (v, dec = 0) => v.toLocaleString('en-US', {minimumFractionDigits: dec, maximumFractionDigits: dec});
const decOf = n => (String(n).split('.')[1] || '').length;
const tight = u => u && graphemes(u).length <= 2;                 // %, ฿ … sit right after the number
/* shrink el's font so its natural width fits W (font-size, not transform: entrance animations own transform) */
const fitW = (el, W) => FITS.push(() => { const w = el.scrollWidth; if (w > W) el.style.fontSize = `${parseFloat(getComputedStyle(el).fontSize) * W / w}px`; });
/* the label a fraction gets on screen: only numbers that were said */
const shareLabel = s => s.of != null ? `${fmtNum(s.num, decOf(s.num))} ใน ${fmtNum(s.of, decOf(s.of))}` : s.unit === '%' ? `${fmtNum(s.num, decOf(s.num))}%` : null;
const shareOf = s => s.of ?? (s.unit === '%' ? 100 : null);

/* v1: the number counts up, big, under a small icon tile; lands on the key word with a punch + ripple */
PART('B01', 'v1', {name: 'ตัวเลขนับขึ้นแล้วหยุด', bgs: ['glow', 'navy', 'white', 'cream'], slots: B01_SLOTS, dur: [1.4, 3.5],
  hit: 'ตัวเลขนับถึงค่าแล้วเด้ง + วงคลื่น'}, (c, s, T) => {
  const o = ON[T.bg], dark = o.ink === '#FFFFFF';
  tile(c, s.icon, T.t0 + .05, 'left:440px;top:250px', {size: 200, bg: o.sub === 'glass' ? 'glass' : o.sub, color: o.ink, sound: false});
  const row = div(`left:60px;width:960px;top:500px;display:flex;justify-content:center;opacity:0`, c);
  const inner = div('position:relative;display:inline-flex;align-items:baseline;gap:14px;white-space:nowrap', row);
  if (s.pre) div(`position:relative;font-family:KeySans;font-size:150px;color:${o.ink}`, inner, s.pre);
  const n = div(`position:relative;font-family:KeySans;font-size:300px;line-height:1;letter-spacing:-8px;color:${dark ? ACC : NAVY}`, inner);
  if (s.unit) div(`position:relative;font-family:${tight(s.unit) ? 'KeySans' : 'CardSans'};font-size:${tight(s.unit) ? 170 : 96}px;color:${o.ink}`, inner).textContent = s.unit;
  n.textContent = fmtNum(s.num, decOf(s.num));   // final width, measured by FITS before the count runs
  mv.show(row, T.t0 + .1);
  mv.count(n, T.t0 + .1, 0, s.num, v => fmtNum(v, decOf(s.num)));
  FITS.push(() => { const w = inner.scrollWidth; if (w > 960) { inner.style.transformOrigin = '50% 70%'; inner.style.transform = `scale(${960 / w})`; } });
  mv.punch(row, T.hit); ripple(c, 540, 650, T.hit, 4.2, dark ? ACC : NAVY); snd('hit', T.hit);
  cardText(c, T, s.lead, s.key);
});

/* v2: a progress ring fills to num/of with the number counting in the middle */
PART('B01', 'v2', {name: 'วงแหวนเปอร์เซ็นต์', bgs: ['glow', 'navy', 'white'], slots: B01_SLOTS, dur: [1.6, 3.5],
  hit: 'วงแหวนเติมถึงค่าแล้วเด้ง'}, (c, s, T) => {
  const o = ON[T.bg], dark = o.ink === '#FFFFFF', of = s.of ?? 100, f = Math.max(0, Math.min(1, s.num / of)), R = 230;
  const box = svg(560, 560, `<circle cx="280" cy="280" r="${R}" fill="none" stroke="${o.track}" stroke-width="56"/>
    <circle cx="280" cy="280" r="${R}" fill="none" stroke="${dark ? ACC : NAVY}" stroke-width="56" stroke-linecap="round" transform="rotate(-90 280 280)"/>`, 'left:260px;top:240px', c);
  mv.pop(box, T.t0 + .05, 'scale(.6)');
  mv.ring(box.querySelectorAll('circle')[1], T.hit - MOTION.ring.d, f);
  const mid = div('left:260px;top:240px;width:560px;height:560px;display:flex;flex-direction:column;align-items:center;justify-content:center;opacity:0', c);
  mid.innerHTML = ico(s.icon, 84, o.soft, 2);
  const n = div(`position:relative;font-family:KeySans;font-size:150px;line-height:1.05;letter-spacing:-4px;color:${o.ink};white-space:nowrap`, mid);
  FITS.push(() => { n.textContent = (s.pre ?? '') + fmtNum(s.num, decOf(s.num)) + (s.unit === '%' ? '%' : ''); const w = n.scrollWidth; if (w > 330) n.style.fontSize = `${150 * 330 / w}px`; });
  mv.show(mid, T.t0 + .15);
  mv.count(n, T.hit - MOTION.ring.d, 0, s.num, v => (s.pre ?? '') + fmtNum(v, decOf(s.num)) + (s.unit === '%' ? '%' : ''));
  if (s.unit && s.unit !== '%') div(`position:relative;font-family:CardSans;font-size:56px;color:${o.soft}`, mid).textContent = s.unit;
  mv.punch(box, T.hit); snd('hit', T.hit);
  cardText(c, T, s.lead, s.key);
});

/* v3: ten icons in two rows; the share num/of lights up in the accent at the key word ("3 ใน 10") */
PART('B01', 'v3', {name: 'ตารางไอคอน 10 ช่อง', bgs: ['glow', 'white', 'cream', 'navy'], slots: B01_SLOTS, dur: [1.6, 3.5],
  hit: 'ไอคอนตามสัดส่วนเปลี่ยนเป็นสีเน้นทีละตัว'}, (c, s, T) => {
  const o = ON[T.bg], dark = o.ink === '#FFFFFF', of = shareOf(s);
  if (of == null) throw new Error('B01.v3 needs `of` (e.g. 3 ใน 10) or unit %');
  const k = Math.round(10 * Math.max(0, Math.min(1, s.num / of)));
  for (let i = 0; i < 10; i++) {
    const x = 95 + (i % 5) * 186, y = 330 + Math.floor(i / 5) * 230;
    const base = div(`left:${x}px;top:${y}px;width:150px;height:150px;opacity:0`, c, ico(s.icon, 150, dark ? 'rgba(255,255,255,.28)' : 'rgba(20,33,61,.22)', 2));
    mv.pop(base, T.t0 + .05 + i * .035, 'scale(.4)');
    if (i < k) { const on = div(`left:${x}px;top:${y}px;width:150px;height:150px;opacity:0`, c, ico(s.icon, 150, dark ? ACC : NAVY, 2.4)); mv.pop(on, T.hit + i * .06, 'scale(1.6)'); }
  }
  const lw = div('left:60px;width:960px;top:840px;display:flex;justify-content:center', c);
  const lab = div(`position:relative;font-family:KeySans;font-size:120px;line-height:1.1;letter-spacing:-3px;white-space:nowrap;color:${dark ? ACC : NAVY};opacity:0`, lw);
  lab.textContent = shareLabel(s);
  fitW(lab, 960);
  mv.key(lw, T.hit + .1); mv.show(lab, T.hit + .1); snd('hit', T.hit);
  cardText(c, T, s.lead, s.key, 1260);
});

/* v4: a stat card (dashboard tile): icon on the left, the number counting on the right, a chip rises at the key word */
PART('B01', 'v4', {name: 'การ์ดตัวเลขแบบแดชบอร์ด', bgs: ['glow', 'cream', 'navy', 'white'], slots: B01_SLOTS, dur: [1.4, 3.5],
  hit: 'การ์ดเด้ง + ชิปป้ายขึ้นใต้การ์ด'}, (c, s, T) => {
  const o = ON[T.bg], dark = o.ink === '#FFFFFF';
  const p = panel(c, 'left:110px;top:360px;width:860px;height:440px', T.t0 + .05, {style: T.bg === 'glow' ? 'glass' : T.bg === 'white' ? 'navy' : 'white'});
  const ink = T.bg === 'glow' || T.bg === 'white' ? '#FFFFFF' : NAVY;
  tile(p, s.icon, T.t0 + .2, 'left:60px;top:120px', {size: 200, bg: ACC, color: INK, sound: false, float: false});
  const n = div(`left:300px;top:110px;width:520px;font-family:KeySans;font-size:${s.unit ? 150 : 170}px;line-height:1;letter-spacing:-5px;color:${ink};white-space:nowrap`, p);
  mv.count(n, T.t0 + .25, 0, s.num, v => (s.pre ?? '') + fmtNum(v, decOf(s.num)) + (tight(s.unit) ? s.unit : ''));
  FITS.push(() => { n.textContent = (s.pre ?? '') + fmtNum(s.num, decOf(s.num)) + (tight(s.unit) ? s.unit : ''); if (n.scrollWidth > 520) { n.style.transformOrigin = '0 50%'; n.style.transform = `scale(${520 / n.scrollWidth})`; } });
  if (s.unit && !tight(s.unit)) div(`left:304px;top:285px;font-family:CardSans;font-size:58px;color:${ink};opacity:.7`, p).textContent = s.unit;
  skel(p, 'left:60px;top:370px;width:740px', [.55], {color: ink === NAVY ? 'rgba(20,33,61,.12)' : 'rgba(255,255,255,.16)', h: 18, t: T.t0 + .3});
  mv.punch(p, T.hit); snd('hit', T.hit);
  if (s.key) { const ch = pill(c, s.key, T.hit + .05, 'left:0;top:850px', {sound: false}); FITS.push(() => { ch.style.left = `${540 - ch.offsetWidth / 2}px`; }); }
  cardText(c, T, s.lead, null, 1240);
});
