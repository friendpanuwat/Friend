/* B05 ถูกกับผิด / "ไม่ใช่ X แต่เป็น Y" — a belief corrected. X is crossed at the hit (ไม่ใช่ / อย่า), Y arrives at `aty` (แต่ …). */
const B05_SLOTS = {
  x:    {type: 'text', max: 14, req: true},     // the wrong thing
  y:    {type: 'text', max: 14, req: true},     // the right thing
  ix:   {type: 'icon'}, iy: {type: 'icon'},     // optional icons for the chips (v2) and the pans (v4)
  aty:  {type: 'number'},                       // when Y is said; default hit + 0.5
  lead: {type: 'text', max: 26},
};
const yTime = (s, T) => s.aty ?? T.hit + .5;
const lineTo = (c, text, css, style, t, o = {}) => { const w = div(`${css};display:flex;justify-content:center`, c); const el = chunk(w, text, style, t, o); fitW(el, 920); return el; };

/* v1: X written large, struck through at the hit and faded; Y rises below in the accent box */
PART('B05', 'v1', {name: 'X โดนขีดฆ่าแล้ว Y ขึ้นแทน', bgs: ['white', 'cream', 'glow'], slots: B05_SLOTS, dur: [1.4, 3.5],
  hit: 'เส้นขีดฆ่าวิ่งผ่าน X ตรงคำ "ไม่ใช่" แล้ว Y เด้งขึ้นตรงคำ "แต่"'}, (c, s, T) => {
  const o = ON[T.bg], dark = o.ink === '#FFFFFF';
  const X = lineTo(c, s.x, 'left:80px;width:920px;top:470px', 'm', T.t0 + .1, {color: o.ink, size: 120});
  strike(X, T.hit, RED); mv.dim(X, T.hit + .2);
  lineTo(c, s.y, 'left:80px;width:920px;top:700px', dark ? 'k' : 'hl', yTime(s, T), {size: dark ? 150 : 128});
  snd('cross', T.hit); snd('key', yTime(s, T) - .04);
  cardText(c, T, s.lead, null, 1240);
});

/* v2: two chips — X gets a red cross, Y gets an accent check */
PART('B05', 'v2', {name: 'ชิป X โดนกากบาท ชิป Y ได้เครื่องหมายถูก', bgs: ['glow', 'cream', 'white'], slots: B05_SLOTS, dur: [1.4, 3.5],
  hit: 'กากบาทแดงวาดทับชิป X แล้วชิป Y ขึ้นพร้อมเครื่องหมายถูก'}, (c, s, T) => {
  const o = ON[T.bg], dark = o.ink === '#FFFFFF';
  const chipRow = (top, text, ic, t, good) => {
    const w = div(`left:80px;width:920px;top:${top}px;display:flex;justify-content:center`, c);
    const ch = div(`position:relative;display:inline-flex;align-items:center;gap:24px;padding:26px 52px 30px 34px;border-radius:999px;white-space:nowrap;font-family:CardSans;font-size:76px;line-height:1.1;opacity:0;` +
      (good ? `background:${ACC};color:${INK};box-shadow:0 24px 60px rgba(0,0,0,.35)` : `background:${dark ? 'rgba(255,255,255,.1)' : '#FFFFFF'};color:${o.ink};border:3px solid ${o.track};box-shadow:0 18px 40px rgba(0,0,0,.18)`), w);
    const icon = div('position:relative;width:110px;height:110px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex:none;' + (good ? `background:${INK}` : `background:${dark ? 'rgba(255,255,255,.12)' : o.sub}`), ch, ico(ic ?? (good ? 'check' : 'x'), 64, good ? ACC : o.ink, 2.6));
    const t2 = div('position:relative', ch); t2.textContent = good ? s.y : s.x;
    FITS.push(() => { if (ch.offsetWidth > 900) t2.style.fontSize = `${76 * (900 - 220) / Math.max(1, t2.offsetWidth)}px`; });
    mv.chip(ch, t); ch.icon = icon; ch.wrap = w; return ch;
  };
  const X = chipRow(380, s.x, s.ix, T.t0 + .1, false);
  const xx = cross(c, T.hit, 'left:0;top:0', {size: 170, sw: 26});   // on the chip's icon, so X's words stay readable
  FITS.push(() => { xx.style.left = `${X.wrap.offsetLeft + X.offsetLeft + X.icon.offsetLeft + 55 - 85}px`; xx.style.top = `${X.wrap.offsetTop + X.offsetTop + X.icon.offsetTop + 55 - 85}px`; });
  mv.dim(X, T.hit + .3);
  const Y = chipRow(720, s.y, s.iy, yTime(s, T), true); mv.punch(Y, yTime(s, T) + .3);
  snd('key', yTime(s, T) - .04);
  cardText(c, T, s.lead, null, 1240);
});

/* v3: a label card turns over — "ความเชื่อ" with X on the front, "ความจริง" with Y on the back */
PART('B05', 'v3', {name: 'ป้ายความเชื่อพลิกเป็นความจริง', bgs: ['glow', 'cream', 'white'], slots: B05_SLOTS, dur: [1.4, 3.5],
  hit: 'การ์ดพลิกตรงคำ "แต่" ด้านหลังเป็นความจริง'}, (c, s, T) => {
  const o = ON[T.bg], t1 = yTime(s, T) - .25;
  const face = (label, text, front) => {
    const f = div('left:140px;top:340px;width:800px;height:560px;opacity:0', c);
    const p = div(`inset:0;border-radius:48px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:34px;` +
      (front ? `background:${T.bg === 'glow' ? '#1A2033' : '#FFFFFF'};border:3px solid ${o.track}` : `background:${ACC}`) + ';box-shadow:0 40px 90px rgba(0,0,0,.35)', f);
    const tag = div(`position:relative;padding:10px 34px 14px;border-radius:999px;font-family:CardSans;font-size:46px;` + (front ? `background:${RED};color:#fff` : `background:${INK};color:${ACC}`), p); tag.textContent = label;
    const tx = div(`position:relative;max-width:700px;text-align:center;font-family:KeySans;font-size:104px;line-height:1.15;letter-spacing:-2px;white-space:nowrap;color:${front ? (T.bg === 'glow' ? '#fff' : NAVY) : INK}`, p); tx.textContent = text; fitW(tx, 700);
    if (front) strike(tx, T.hit, RED);
    return f;
  };
  const F = face('ความเชื่อ', s.x, true), B = face('ความจริง', s.y, false);
  mv.rise(F, T.t0 + .05);
  mv.slide(F, t1, 'perspective(1600px) rotateY(0deg)', 'perspective(1600px) rotateY(90deg)');
  mv.show(B, t1 + MOTION.slide.d * .5); mv.slide(B, t1 + MOTION.slide.d * .5, 'perspective(1600px) rotateY(-90deg)', 'perspective(1600px) rotateY(0deg)');
  snd('cross', T.hit); snd('swipe', t1); snd('hit', t1 + MOTION.slide.d);
  cardText(c, T, s.lead, null, 1240);
});

/* v4: a balance — X on the left pan, Y on the right; the beam tips toward Y */
PART('B05', 'v4', {name: 'ตาชั่งเอียงจาก X ไปทาง Y', bgs: ['glow', 'white', 'cream'], slots: B05_SLOTS, dur: [1.4, 3.5],
  hit: 'คานตาชั่งเอียงไปทาง Y ตรงคำ "แต่"'}, (c, s, T) => {
  const o = ON[T.bg], dark = o.ink === '#FFFFFF', tt = yTime(s, T) - .2, ang = 12;
  const post = div(`left:528px;top:420px;width:24px;height:470px;border-radius:12px;background:${o.ink};opacity:.85`, c);
  const base = div(`left:400px;top:880px;width:280px;height:26px;border-radius:13px;background:${o.ink};opacity:.85`, c);
  mv.show(post, T.t0 + .05); mv.show(base, T.t0 + .05);
  const beam = div('left:140px;top:400px;width:800px;height:40px;transform-origin:50% 50%', c);
  div(`left:0;top:12px;width:800px;height:18px;border-radius:9px;background:${o.ink}`, beam);
  div(`left:384px;top:0;width:40px;height:40px;border-radius:50%;background:${ACC};box-shadow:0 6px 16px rgba(0,0,0,.3)`, beam);
  const pan = (x, text, ic, good) => {
    const h = div(`left:${x - 150}px;top:20px;width:300px;height:330px;transform-origin:50% 0`, beam);   // hang from the beam
    div(`left:148px;top:0;width:4px;height:110px;background:${o.ink};opacity:.6`, h);
    const t = tile(h, ic ?? (good ? 'check' : 'x'), T.t0 + .2 + good * .1, 'left:70px;top:100px', {size: 160, bg: good ? ACC : (o.sub === 'glass' ? 'glass' : o.sub), color: good ? INK : o.ink, sound: false, float: false});
    const lb = div(`left:0;top:280px;width:300px;text-align:center;font-family:CardSans;font-size:56px;white-space:nowrap;color:${good ? (dark ? ACC : NAVY) : o.ink}`, h); lb.textContent = text; fitW(lb, 300);
    return h;
  };
  const L = pan(80, s.x, s.ix, false), R = pan(720, s.y, s.iy, true);
  mv.pop(beam, T.t0 + .1, 'scaleX(.4)');
  mv.slide(beam, tt, 'rotate(0deg)', `rotate(${ang}deg)`);
  for (const h of [L, R]) mv.slide(h, tt, 'rotate(0deg)', `rotate(${-ang}deg)`);   // pans hang straight while the beam tips
  mv.dim(L, T.hit); snd('hit', tt + MOTION.slide.d);
  cardText(c, T, s.lead, null, 1260);
});
