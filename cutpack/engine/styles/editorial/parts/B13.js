/* B13 ไอเดีย / เคล็ดลับ / ความลับ — the trick revealed. tip = the tip, in the speaker's words. */
const B13_SLOTS = {
  tip:  {type: 'text', max: 18, req: true},
  icon: {type: 'icon'},                       // what the tip is about (v2: what comes out of the box)
  lead: {type: 'text', max: 26},
  key:  {type: 'text', max: 14},
};
const tipLine = (c, s, top, color, size = 84) => { const w = div(`left:80px;width:920px;top:${top}px;display:flex;justify-content:center`, c); const e = div(`position:relative;font-family:CardSans;font-size:${size}px;line-height:1.2;white-space:nowrap;color:${color};opacity:0`, w); e.textContent = s.tip; fitW(e, 920); return e; };

/* v1: a light bulb switches on in the accent on the key word, sparkles around it */
PART('B13', 'v1', {name: 'หลอดไฟสว่าง', bgs: ['glow', 'cream', 'white'], slots: B13_SLOTS, dur: [1.0, 3.0],
  hit: 'หลอดไฟติดเป็นสีเน้น + ประกายรอบ ๆ ตรงคำ "เคล็ดลับ"'}, (c, s, T) => {
  const o = ON[T.bg], dark = o.ink === '#FFFFFF';
  tile(c, 'lightbulb', T.t0 + .05, 'left:330px;top:300px', {size: 420, bg: o.sub === 'glass' ? 'glass' : o.sub, color: o.soft, icon: .58, sound: false, float: false});
  const on = tile(c, 'lightbulb', T.hit, 'left:330px;top:300px', {size: 420, bg: ACC, color: INK, icon: .58, sound: false, float: false});
  [[250, 280], [790, 300], [230, 660], [800, 640]].forEach(([x, y], k) => { const sp = div(`left:${x}px;top:${y}px;width:90px;height:90px;opacity:0`, c, ico('sparkle', 90, dark ? ACC : NAVY, 2)); mv.pop(sp, T.hit + .08 + k * .05); });
  ripple(c, 540, 510, T.hit, 4, dark ? ACC : NAVY); snd('hit', T.hit);
  mv.lead(tipLine(c, s, 820, o.ink), T.t0 + .3);
  cardText(c, T, s.lead, s.key, 1260);
});

/* v2 was dropped by Friend on 2026-11-03 (กล่องเปิดเผยของข้างใน); the code is in git history. */
/* v3: a key slides into a padlock on the key word, the lock springs open */
PART('B13', 'v3', {name: 'กุญแจไขแม่กุญแจ', bgs: ['glow', 'cream', 'white'], slots: B13_SLOTS, dur: [1.2, 3.5],
  hit: 'กุญแจเสียบเข้าตรงคำ แม่กุญแจเปิด'}, (c, s, T) => {
  const o = ON[T.bg], dark = o.ink === '#FFFFFF';
  tile(c, 'lock', T.t0 + .05, 'left:470px;top:330px', {size: 380, bg: o.tile, color: o.tileInk, icon: .56, sound: false, float: false});
  const open = tile(c, 'lock-open', T.hit + .05, 'left:470px;top:330px', {size: 380, bg: ACC, color: INK, icon: .56, sound: false, float: false});
  const key = div('left:80px;top:420px;width:220px;height:220px;opacity:0', c, ico('key-round', 220, dark ? ACC : NAVY, 1.8));
  mv.show(key, T.t0 + .2); mv.slide(key, T.hit - MOTION.slide.d, 'translateX(-120px) rotate(-30deg)', 'translateX(150px) rotate(0deg)');
  ripple(c, 660, 520, T.hit + .05, 4, dark ? ACC : NAVY); snd('hit', T.hit);
  mv.lead(tipLine(c, s, 820, o.ink), T.t0 + .3);
  cardText(c, T, s.lead, s.key, 1260);
});

/* v4: a tip card with a folded corner; a highlighter sweeps under the tip on the key word */
PART('B13', 'v4', {name: 'การ์ดเคล็ดลับพับมุม', bgs: ['glow', 'white', 'cream'], slots: B13_SLOTS, dur: [1.2, 3.5],
  hit: 'แถบไฮไลต์วิ่งใต้ข้อความเคล็ดลับตรงคำ'}, (c, s, T) => {
  const light = T.bg !== 'glow', paper = light ? (T.bg === 'white' ? '#F4F5F8' : '#FFFFFF') : '#FFFFFF';
  const card = div(`left:120px;top:330px;width:840px;height:520px;border-radius:40px 0 40px 40px;background:${paper};box-shadow:0 40px 90px rgba(0,0,0,.35);opacity:0`, c);
  div(`right:0;top:0;width:130px;height:130px;background:linear-gradient(225deg, ${T.bg === 'glow' ? INK : ON[T.bg].sub === '#FFFFFF' ? '#F2EDE2' : '#FFFFFF'} 50%, #D8DCE5 50%);border-radius:0 0 0 30px`, card);
  mv.rise(card, T.t0 + .05);
  const badge = div(`left:56px;top:56px;width:120px;height:120px;border-radius:34px;background:${ACC};display:flex;align-items:center;justify-content:center`, card, ico(s.icon ?? 'lightbulb', 70, INK, 2.2));
  const wrap = div('left:56px;top:240px;width:730px', card);
  const hl = div(`left:-10px;top:58px;width:0;height:56px;border-radius:12px;background:${ACC};transform-origin:0 50%`, wrap);
  const tx = div(`position:relative;font-family:KeySans;font-size:92px;line-height:1.25;letter-spacing:-1px;white-space:nowrap;color:${NAVY}`, wrap); tx.textContent = s.tip; fitW(tx, 730);
  FITS.push(() => { hl.style.width = `${Math.min(750, tx.scrollWidth + 20)}px`; hl.style.top = '-6px'; hl.style.height = `${tx.offsetHeight + 12}px`; });   // covers the whole text (Friend 2026-11-03)
  mv.growX(hl, T.hit - .25, 1); snd('swipe', T.hit - .25);
  cardText(c, T, s.lead, s.key, 1260);
});
