/* =====================================================================
   PACK biz — ธุรกิจและการตลาดออนไลน์ (Friend 2026-11-04 agreed to the four categories; the items wait for his picks)
   Props redraw a base part for this category and keep its slots, so a plan does not change: PART('B01', 'biz1', …).
   Hero parts are new and only this pack has them: PART('BIZ', 'h1', …).
   meta.pack keeps them out of the AI's catalog (plan/catalog.js) until Friend has picked them in the gallery.
   Same rules as every part: motion only through mv.* and the kit, numbers on screen only if said, red only for a
   negative meaning, nothing level with the app's buttons past x 940, no real brand or app logos.
   ===================================================================== */
const BIZ = 'biz';
const bizPanel = bg => bg === 'glow' ? 'glass' : bg === 'white' ? 'navy' : 'white';   // the panel style that reads on each card
const bizLine = (c, text, top, color, size = 76) => { const w = div(`left:80px;width:920px;top:${top}px;display:flex;justify-content:center`, c);
  const e = div(`position:relative;font-family:CardSans;font-size:${size}px;line-height:1.2;white-space:nowrap;color:${color};opacity:0`, w); e.textContent = text; fitW(e, SAFE_W); return e; };
const bizNum = (v, s = {}) => (s.pre ?? '') + fmtNum(v, decOf(v));

/* ---------- props: base parts drawn for business ---------- */

/* P1 → B01: a price tag drops in on its string; the price counts up on it and the tag swings when it lands */
PART('B01', 'biz1', {pack: BIZ, code: 'BIZ-P1', name: 'ป้ายราคาห้อยเชือก', bgs: ['glow', 'cream', 'white'], slots: B01_SLOTS, dur: [1.4, 3.5],
  hit: 'ราคานับถึงค่า ป้ายแกว่งรับ + วงคลื่น'}, (c, s, T) => {
  const o = ON[T.bg], dark = o.ink === '#FFFFFF', tagBg = dark ? '#FFFFFF' : NAVY, tagInk = dark ? INK : '#FFFFFF';
  const hole = T.bg === 'glow' ? '#08080C' : T.bg === 'white' ? '#FFFFFF' : CREAM;
  const hang = div('left:240px;top:0;width:600px;height:840px;transform-origin:300px 0;opacity:0', c,
    `<svg width="600" height="840" viewBox="0 0 600 840" style="overflow:visible;display:block"><line x1="300" y1="0" x2="300" y2="290" stroke="${o.soft}" stroke-width="6"/>
     <path d="M300 230 L560 340 V790 a30 30 0 0 1 -30 30 H70 a30 30 0 0 1 -30 -30 V340 Z" fill="${tagBg}"/>
     <rect x="40" y="340" width="520" height="30" fill="${ACC}"/><circle cx="300" cy="300" r="22" fill="${hole}"/></svg>`);
  const row = div('left:60px;top:440px;width:480px;height:260px;display:flex;flex-direction:column;align-items:center;justify-content:center', hang);
  const n = div(`position:relative;font-family:KeySans;font-size:190px;line-height:1;letter-spacing:-6px;color:${tagInk};white-space:nowrap`, row);
  n.textContent = bizNum(s.num, s) + (tight(s.unit) ? s.unit : '');
  if (s.unit && !tight(s.unit)) div(`position:relative;font-family:CardSans;font-size:72px;line-height:1.2;color:${tagInk};opacity:.75`, row).textContent = s.unit;
  fitW(n, 460);
  mv.fly(hang, T.t0 + .05, 'translate(0,-700px)');
  mv.count(n, Math.max(T.t0 + .3, T.hit - MOTION.count.d), 0, s.num, v => (s.pre ?? '') + fmtNum(v, decOf(s.num)) + (tight(s.unit) ? s.unit : ''));
  mv.wobble(hang, T.hit); ripple(c, 540, 600, T.hit, 4, dark ? ACC : NAVY); snd('hit', T.hit);
  cardText(c, T, s.lead, s.key);
});

/* P2 → B02: a post with its view meter; the meter fills (up) or drains in red (down) and the arrow badge lands on the key word */
PART('B02', 'biz1', {pack: BIZ, code: 'BIZ-P2', name: 'ตัวนับยอดวิวของโพสต์', bgs: ['glow', 'white', 'cream'], slots: B02_SLOTS, dur: [1.4, 3.5],
  hit: 'แถบยอดวิวเติมจนสุด (ขึ้น) หรือไหลลงเป็นสีแดง (ลง) แล้วป้ายลูกศรเด้ง'}, (c, s, T) => {
  const o = ON[T.bg], dark = o.ink === '#FFFFFF', st = bizPanel(T.bg), ink = st === 'white' ? NAVY : '#FFFFFF', col = dirCol(s, st !== 'white');
  const p = panel(c, 'left:150px;top:220px;width:780px;height:620px', T.t0 + .02, {style: st});
  const thumb = div(`left:30px;top:30px;width:720px;height:360px;border-radius:30px;background:${ink === NAVY ? '#EEF0F4' : 'rgba(255,255,255,.1)'};display:flex;align-items:center;justify-content:center`, p, ico('play', 120, ink === NAVY ? 'rgba(20,33,61,.35)' : 'rgba(255,255,255,.45)', 2));
  mv.show(thumb, T.t0 + .15);
  div('left:40px;top:440px;width:90px;height:90px', p, ico(s.icon, 90, ink, 2));
  const track = div(`left:160px;top:465px;width:430px;height:40px;border-radius:20px;background:${ink === NAVY ? 'rgba(20,33,61,.12)' : 'rgba(255,255,255,.14)'};overflow:hidden`, p);
  const fill = div(`left:0;top:0;width:430px;height:40px;border-radius:20px;background:${col};transform-origin:0 50%`, track);
  if (s.dir === 'down') mv.fill(fill, T.hit, .92, .22); else mv.fill(fill, T.hit, .12, 1);
  const badge = div(`left:620px;top:420px;width:130px;height:130px;border-radius:36px;background:${s.dir === 'down' ? RED : ACC};display:flex;align-items:center;justify-content:center;box-shadow:0 18px 40px rgba(0,0,0,.3);opacity:0`, p,
    ico(s.dir === 'down' ? 'trending-down' : 'trending-up', 86, s.dir === 'down' ? '#FFFFFF' : INK, 2.6));
  mv.pop(badge, T.hit); mv.punch(p, T.hit + .05); snd('hit', T.hit);
  if (s.num) chipAt(c, s.num, T.hit + .1, 540, 900);
  cardText(c, T, s.lead, s.key);
});

/* P3 → B08: a receipt prints out with the result written on it; a "ชำระแล้ว" stamp slams down on the key word */
PART('B08', 'biz1', {pack: BIZ, code: 'BIZ-P3', name: 'ใบเสร็จประทับตรา', bgs: ['glow', 'cream', 'white'], slots: B08_SLOTS, dur: [1.2, 3.5],
  hit: 'ตราประทับ "ชำระแล้ว" กระแทกลงบนใบเสร็จ + วงคลื่น'}, (c, s, T) => {
  const o = ON[T.bg], paper = T.bg === 'white' ? '#F4F5F8' : '#FFFFFF';
  const slot = div(`left:200px;top:196px;width:680px;height:28px;border-radius:14px;background:${o.ink === '#FFFFFF' ? 'rgba(255,255,255,.22)' : 'rgba(20,33,61,.22)'};opacity:0`, c);
  mv.show(slot, T.t0 + .02);
  const r = div('left:250px;top:210px;width:580px;height:620px;transform-origin:50% 0;transform:scaleY(0)', c,
    `<svg width="580" height="620" viewBox="0 0 580 620" style="display:block;filter:drop-shadow(0 30px 50px rgba(0,0,0,.35))"><path d="M0 0 H580 V590 ${Array.from({length: 12}, (_, k) => `L${580 - k * 48 - 24} 620 L${580 - (k + 1) * 48} 590`).join(' ')} L0 590 Z" fill="${paper}"/></svg>`);
  mv.grow(r, T.t0 + .05, 1);
  const head = div('left:0;top:40px;width:580px;display:flex;justify-content:center', r, ico(s.icon, 90, NAVY, 2));
  const g = div(`left:40px;top:150px;width:500px;text-align:center;font-family:CardSans;font-size:58px;line-height:1.2;white-space:nowrap;color:${NAVY}`, r); g.textContent = s.goal; fitW(g, 500);
  if (s.num) { const nm = div(`left:40px;top:235px;width:500px;text-align:center;font-family:KeySans;font-size:66px;line-height:1.2;white-space:nowrap;color:${NAVY};opacity:0`, r); nm.textContent = s.num; fitW(nm, 500); mv.lead(nm, T.t0 + .45); }
  skel(r, `left:60px;top:${s.num ? 340 : 260}px;width:460px`, s.num ? [.8] : [.9, .7, .8], {h: 18, gap: 22, t: T.t0 + .35});
  div('left:50px;top:400px;width:480px;height:0;border-top:4px dashed rgba(20,33,61,.25)', r);
  [head, g].forEach((e, k) => { e.style.opacity = 0; mv.show(e, T.t0 + .3 + k * .08); });
  const stamp = div('left:330px;top:640px;width:420px;height:170px;opacity:0', c);
  div(`left:0;top:0;width:420px;height:170px;border-radius:26px;border:10px solid ${INK};background:${ACC};display:flex;align-items:center;justify-content:center;gap:18px;transform:rotate(-12deg);font-family:KeySans;font-size:76px;color:${INK};white-space:nowrap`, stamp,
    ico('check', 70, INK, 3.4) + '<span>ชำระแล้ว</span>');
  mv.pop(stamp, T.hit, 'scale(2.4)'); ripple(c, 540, 725, T.hit, 4, ACC); snd('hit', T.hit);
  cardText(c, T, s.lead, s.key);
});

/* P4 → B10: shoppers; the customer being talked about lights up and a shopping bag pops into their hand */
PART('B10', 'biz1', {pack: BIZ, code: 'BIZ-P4', name: 'คนถือถุงช้อปปิ้ง', bgs: ['glow', 'cream', 'white'], slots: B10_SLOTS, dur: [1.2, 3.5],
  hit: 'คนที่ถูกพูดถึงสว่างเป็นสีเน้น ถุงช้อปปิ้งเด้งขึ้นที่มือ + วงคลื่น'}, (c, s, T) => {
  const o = ON[T.bg], dark = o.ink === '#FFFFFF', dim = dark ? 'rgba(255,255,255,.28)' : 'rgba(20,33,61,.22)', on = dark ? ACC : NAVY, pick = 5;
  // the bag's handle is drawn in `line`: white on the dark card, or it does not show (Friend 2026-11-04)
  const bag = (x, y, sz, fill, line) => div(`left:${x}px;top:${y}px;width:${sz}px;height:${sz}px;opacity:0`, c,
    `<svg width="${sz}" height="${sz}" viewBox="0 0 60 60"><path d="M20 22 V16 a10 10 0 0 1 20 0 V22" fill="none" stroke="${line}" stroke-width="5" stroke-linecap="round"/><rect x="8" y="20" width="44" height="38" rx="7" fill="${fill}" stroke="${line}" stroke-width="3"/></svg>`);
  for (let i = 0; i < 8; i++) {
    const x = 95 + (i % 4) * 235, y = 270 + Math.floor(i / 4) * 280;
    const p = person(c, x, y, 140, dim); p.style.opacity = 0; mv.pop(p, T.t0 + .05 + i * .035, 'scale(.5)');
    if (i % 3 === 1 && i !== pick) { const b = bag(x + 138, y + 112, 62, dim, dim); mv.pop(b, T.t0 + .3 + i * .03, 'scale(.4)'); }
    if (i === pick) {
      const lit = person(c, x, y, 140, on); lit.style.opacity = 0; mv.pop(lit, T.hit, 'scale(1.35)');
      const b = bag(x + 136, y + 92, 84, ACC, dark ? '#FFFFFF' : INK); mv.pop(b, T.hit + .05, 'scale(0) rotate(-20deg)');
      ripple(c, x + 70, y + 88, T.hit, 2.8, on);
    }
  }
  snd('hit', T.hit);
  mv.lead(whoLine(c, s, 900, o.ink), T.t0 + .3);
  cardText(c, T, s.lead, s.key, 1260);
});

/* P5 → B12: A → B with a parcel riding along the arrow; it arrives and B pops on the key word */
PART('B12', 'biz1', {pack: BIZ, code: 'BIZ-P5', name: 'กล่องพัสดุวิ่งตามลูกศร', bgs: ['glow', 'cream', 'white'], slots: B12_SLOTS, dur: [1.2, 3.5],
  hit: 'กล่องพัสดุวิ่งถึงปลายลูกศรตรงคำ "ทำให้ เลย" แล้ว B เด้ง'}, (c, s, T) => {
  const o = ON[T.bg], dark = o.ink === '#FFFFFF', col = dark ? ACC : NAVY;
  tile(c, s.ia, T.t0 + .05, 'left:80px;top:420px', {size: 250, bg: o.sub === 'glass' ? 'glass' : o.sub, color: o.ink, sound: false});
  mv.lead(capt(c, s.a, 25, 710, 360, o.ink), T.t0 + .15);
  const ar = svg(340, 60, `<path d="M6 30 H310" stroke="${col}" stroke-width="12" stroke-linecap="round" stroke-dasharray="2 26"/><path d="M286 6 L320 30 L286 54" fill="none" stroke="${col}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>`, 'left:360px;top:560px', c);
  mv.show(ar, T.t0 + .2);
  const box = div('left:370px;top:430px;width:120px;height:120px;opacity:0', c,
    `<svg width="120" height="120" viewBox="0 0 60 60"><rect x="6" y="14" width="48" height="40" rx="5" fill="${dark ? '#FFFFFF' : NAVY}"/><rect x="26" y="14" width="8" height="40" fill="${ACC}"/><path d="M6 24 H54" stroke="${dark ? 'rgba(5,5,5,.18)' : 'rgba(255,255,255,.25)'}" stroke-width="3"/></svg>`);
  mv.pop(box, T.t0 + .3, 'scale(0)');
  mv.slide(box, T.hit - MOTION.slide.d, 'translateX(0)', 'translateX(200px)');
  tile(c, s.ib, T.hit, 'left:730px;top:420px', {size: 250, bg: ACC, color: INK, sound: false});
  mv.lead(capt(c, s.b, 670, 710, 360, col), T.hit + .05);
  ripple(c, 855, 545, T.hit, 3, col); snd('hit', T.hit);
  cardText(c, T, s.lead, s.key, 1260);
});

/* P6 → B07: a full cart; on the key word it tips over and the goods fall out, a red mark pops */
PART('B07', 'biz1', {pack: BIZ, code: 'BIZ-P6', name: 'ตะกร้าถูกทิ้ง', bgs: ['glow', 'white', 'cream'], slots: B07_SLOTS, dur: [1.2, 3.5],
  hit: 'ตะกร้าเอียง ของหล่นออกจนหมดตรงคำ "หาย ทิ้ง ไม่ซื้อ" ป้ายกากบาทสีแดงเด้ง'}, (c, s, T) => {
  const o = ON[T.bg], dark = o.ink === '#FFFFFF';
  const stage = div('left:0;top:0;width:1080px;height:860px;overflow:hidden', c);
  const cart = div('left:250px;top:250px;width:560px;height:480px;transform-origin:120px 420px;opacity:0', stage,
    `<svg width="560" height="480" viewBox="0 0 560 480" style="overflow:visible;display:block"><path d="M20 60 H110 L170 330 H470 L520 140 H140" fill="none" stroke="${o.ink}" stroke-width="22" stroke-linecap="round" stroke-linejoin="round"/>
     <circle cx="210" cy="410" r="38" fill="none" stroke="${o.ink}" stroke-width="18"/><circle cx="430" cy="410" r="38" fill="none" stroke="${o.ink}" stroke-width="18"/></svg>`);
  mv.pop(cart, T.t0 + .05, 'translateX(-300px)');
  const goods = [[190, 80, 110, o.tile], [300, 55, 130, ACC], [425, 95, 90, o.tile]];
  goods.forEach(([x, y, sz, fill], k) => {
    const g = div(`left:${x}px;top:${y}px;width:${sz}px;height:${sz}px;border-radius:${sz * .2}px;background:${fill};box-shadow:0 14px 30px rgba(0,0,0,.25);opacity:0`, cart);
    mv.pop(g, T.t0 + .25 + k * .08, 'translateY(-200px)');
    mv.slide(g, T.hit - .5 + k * .12 - .24, 'translate(0,0) rotate(0)', `translate(${-140 - k * 40}px,${640 + k * 30}px) rotate(${-50 - k * 25}deg)`);
  });
  mv.slide(cart, T.hit - .65, 'rotate(0)', 'rotate(-14deg)');
  const x = div(`left:780px;top:220px;width:150px;height:150px;border-radius:50%;background:${RED};display:flex;align-items:center;justify-content:center;box-shadow:0 18px 40px rgba(0,0,0,.35);opacity:0`, c, ico('x', 92, '#FFFFFF', 3.4));
  mv.pop(x, T.hit); ripple(c, 855, 295, T.hit, 3, RED); snd('hit', T.hit);
  mv.lead(bizLine(c, s.text, 900, o.ink), T.t0 + .3);
  cardText(c, T, s.lead, s.key, 1260);
});

/* ---------- hero parts: only the business pack has these ---------- */

/* H1: new-order cards pop in one after another; the total counts up and lands on the key word */
PART('BIZ', 'h1', {pack: BIZ, code: 'BIZ-H1', name: 'ออเดอร์เด้งเข้า', bgs: ['glow', 'white', 'cream'],
  slots: {num: {type: 'number'}, unit: {type: 'text', max: 8}, item: {type: 'text', max: 12}, icon: {type: 'icon'},
          lead: {type: 'text', max: 26}, key: {type: 'text', max: 14}}, dur: [1.6, 4.0],
  hit: 'ออเดอร์ใบสุดท้ายเด้งเข้า ยอดรวมหยุดที่ตัวเลขในบท + วงคลื่น'}, (c, s, T) => {
  const o = ON[T.bg], dark = o.ink === '#FFFFFF', st = bizPanel(T.bg), ink = st === 'white' ? NAVY : '#FFFFFF';
  const top = div('left:110px;top:200px;width:860px;height:150px;display:flex;align-items:center;gap:26px', c);
  const t = div(`position:relative;width:130px;height:130px;border-radius:36px;background:${ACC};display:flex;align-items:center;justify-content:center;opacity:0;flex:none`, top, ico(s.icon ?? 'package', 80, INK, 2.2));
  mv.pop(t, T.t0 + .05);
  if (s.num != null) {
    const n = div(`position:relative;font-family:KeySans;font-size:130px;line-height:1;letter-spacing:-4px;white-space:nowrap;color:${o.ink}`, top);
    n.textContent = fmtNum(s.num, decOf(s.num)); fitW(n, 520);
    mv.count(n, T.hit - MOTION.count.d, 0, s.num, v => fmtNum(v, decOf(s.num)));
    if (s.unit) { const u = div(`position:relative;font-family:CardSans;font-size:64px;white-space:nowrap;color:${o.soft}`, top); u.textContent = s.unit; }
    mv.punch(top, T.hit);
  } else skel(top, 'position:relative;width:420px', [.9, .6], {color: dark ? 'rgba(255,255,255,.16)' : 'rgba(20,33,61,.13)', h: 26, t: T.t0 + .1});
  const rows = 4, step = (T.hit - T.t0 - .45) / (rows - 1);
  for (let k = 0; k < rows; k++) {
    const y = 400 + k * 150, tk = T.t0 + .45 + k * step;
    const r = panel(c, `left:160px;top:${y}px;width:760px;height:124px`, tk, {style: st, radius: 34, from: 'scale'});
    div(`left:22px;top:22px;width:80px;height:80px;border-radius:24px;background:${k === rows - 1 ? ACC : (ink === NAVY ? '#EEF0F4' : 'rgba(255,255,255,.12)')};display:flex;align-items:center;justify-content:center`, r,
      ico(s.icon ?? 'package', 48, k === rows - 1 ? INK : ink, 2.2));
    if (s.item) { const it = div(`left:128px;top:30px;width:430px;font-family:CardSans;font-size:50px;line-height:1.2;white-space:nowrap;color:${ink}`, r); it.textContent = s.item; fitW(it, 430); }
    else skel(r, 'left:128px;top:36px;width:400px', [.85, .5], {color: ink === NAVY ? 'rgba(20,33,61,.13)' : 'rgba(255,255,255,.16)', h: 18});
    div(`left:640px;top:28px;width:68px;height:68px;border-radius:50%;background:${ink === NAVY ? NAVY : '#FFFFFF'};display:flex;align-items:center;justify-content:center`, r, ico('check', 44, ink === NAVY ? '#FFFFFF' : INK, 3));
    if (k === rows - 1) mv.punch(r, T.hit + .05);
  }
  ripple(c, 540, 870, T.hit, 4, dark ? ACC : NAVY); snd('hit', T.hit);
  cardText(c, T, s.lead, s.key);
});

/* H2: a funnel of 3–4 stages builds top to bottom; the last stage lights up in the accent on the key word */
PART('BIZ', 'h2', {pack: BIZ, code: 'BIZ-H2', name: 'กรวยลูกค้า', bgs: ['glow', 'white', 'cream'],
  slots: {stages: {type: 'list', max: 4, req: true}, nums: {type: 'list'}, lead: {type: 'text', max: 26}, key: {type: 'text', max: 14}}, dur: [1.8, 4.0],
  hit: 'ชั้นสุดท้ายของกรวยสว่างเป็นสีเน้น ชื่อและตัวเลขของชั้นนั้นขึ้น + วงคลื่น'}, (c, s, T) => {
  const st = s.stages, n = st.length;
  if (n < 3 || n > 4) throw new Error('BIZ.h2 needs 3 or 4 stages');
  if (s.nums && s.nums.length !== n) throw new Error('BIZ.h2: nums must match stages');
  const o = ON[T.bg], dark = o.ink === '#FFFFFF', H = n === 4 ? 150 : 190, gap = 16, y0 = 220;
  const wTop = k => 900 - k * (900 - 380) / n;
  const band = (k, color) => { const a = wTop(k), b = wTop(k + 1), y = y0 + k * (H + gap);
    return div(`left:${540 - a / 2}px;top:${y}px;width:${a}px;height:${H}px;background:${color};clip-path:polygon(0 0,100% 0,${(a + b) / 2 / a * 100}% 100%,${(a - b) / 2 / a * 100}% 100%);opacity:0`, c); };
  const base = dark ? 'rgba(255,255,255,.14)' : T.bg === 'white' ? '#E9ECF2' : '#FFFFFF';
  const step = (T.hit - T.t0 - .5) / n;
  for (let k = 0; k < n; k++) {
    const tk = T.t0 + .05 + k * step, b = band(k, base); mv.pop(b, tk, 'scaleX(.4)');
    const last = k === n - 1, w = wTop(k + 1) - 60, y = y0 + k * (H + gap);
    if (last) { const lit = band(k, ACC); mv.pop(lit, T.hit, 'scaleX(.6)'); ripple(c, 540, y + H / 2, T.hit, 3.6, dark ? ACC : NAVY); }
    // the last stage's label shows only when it lights up (one label per band: the checker counts a covered copy as overlap)
    const ink = last ? INK : o.ink;
    const lab = div(`left:${540 - w / 2}px;top:${y}px;width:${w}px;height:${H}px;display:flex;align-items:center;justify-content:center;gap:.36em;font-size:56px;opacity:0`, c);
    const name = div(`position:relative;font-family:CardSans;font-size:1em;line-height:1.2;white-space:nowrap;color:${ink}`, lab); name.textContent = st[k];
    if (s.nums) { const v = div(`position:relative;font-family:KeySans;font-size:1.18em;line-height:1.2;white-space:nowrap;color:${ink}`, lab); v.textContent = fmtNum(Number(s.nums[k]), decOf(Number(s.nums[k]))); }
    fitW(lab, w); mv.show(lab, last ? T.hit + .05 : tk + .1);
  }
  snd('hit', T.hit);
  cardText(c, T, s.lead, s.key);
});

/* H3: a post with its stats row (views, likes, shares, saves); the one talked about grows and lights up on the key word */
const BIZ_STATS = [['views', 'eye'], ['likes', 'heart'], ['shares', 'send'], ['saves', 'bookmark']];
PART('BIZ', 'h3', {pack: BIZ, code: 'BIZ-H3', name: 'สถิติโพสต์', bgs: ['glow', 'white', 'cream'],
  slots: {views: {type: 'number'}, likes: {type: 'number'}, shares: {type: 'number'}, saves: {type: 'number'},
          focus: {type: 'choice', of: ['views', 'likes', 'shares', 'saves']}, lead: {type: 'text', max: 26}, key: {type: 'text', max: 14}}, dur: [1.4, 3.5],
  hit: 'ค่าที่พูดถึงขยายใหญ่และเป็นสีเน้น + วงคลื่น (ค่าที่ไม่ได้พูดเป็นแถบเทา)'}, (c, s, T) => {
  const said = BIZ_STATS.filter(([k]) => s[k] != null);
  if (!said.length) throw new Error('BIZ.h3 needs at least one number that was said');
  const focus = s.focus ?? said[0][0];
  if (s[focus] == null) throw new Error('BIZ.h3: focus must be a value that was said');
  const o = ON[T.bg], st = bizPanel(T.bg), ink = st === 'white' ? NAVY : '#FFFFFF';
  const p = panel(c, 'left:150px;top:200px;width:780px;height:760px', T.t0 + .02, {style: st});
  div(`left:30px;top:30px;width:720px;height:300px;border-radius:30px;background:${ink === NAVY ? '#EEF0F4' : 'rgba(255,255,255,.1)'};display:flex;align-items:center;justify-content:center`, p, ico('play', 110, ink === NAVY ? 'rgba(20,33,61,.35)' : 'rgba(255,255,255,.45)', 2));
  skel(p, 'left:40px;top:356px;width:500px', [.7], {color: ink === NAVY ? 'rgba(20,33,61,.13)' : 'rgba(255,255,255,.16)', h: 20, t: T.t0 + .2});
  BIZ_STATS.forEach(([k, icon], i) => {
    const x = 20 + i * 185, col = div(`left:${x}px;top:410px;width:185px;height:150px;display:flex;flex-direction:column;align-items:center;gap:10px;opacity:0`, p);
    const on = k === focus;
    div('position:relative;width:70px;height:70px', col, ico(icon, 70, on ? (ink === NAVY ? NAVY : ACC) : ink, on ? 2.6 : 2));
    if (s[k] != null) {
      const v = div(`position:relative;font-family:KeySans;font-size:46px;line-height:1.1;white-space:nowrap;color:${ink}`, col);
      v.textContent = fmtNum(s[k], decOf(s[k])); fitW(v, 175);
      mv.count(v, T.t0 + .35, 0, s[k], z => fmtNum(z, decOf(s[k])));
    } else div(`position:relative;width:110px;height:20px;margin-top:20px;border-radius:10px;background:${ink === NAVY ? 'rgba(20,33,61,.13)' : 'rgba(255,255,255,.16)'}`, col);
    mv.show(col, T.t0 + .25 + i * .06);
    if (on) mv.punch(col, T.hit);
  });
  const fk = BIZ_STATS.find(([k]) => k === focus);
  const big = div('left:40px;top:580px;width:700px;height:150px;display:flex;align-items:center;justify-content:center;opacity:0', p);
  const pillB = div(`position:relative;display:flex;align-items:center;gap:22px;padding:10px 40px 14px;border-radius:32px;background:${ACC};color:${INK};font-family:KeySans;font-size:96px;line-height:1.1;white-space:nowrap`, big,
    ico(fk[1], 78, INK, 2.6) + `<span>${fmtNum(s[focus], decOf(s[focus]))}</span>`);
  fitW(pillB, 680);
  mv.pop(big, T.hit, 'scale(.4)'); ripple(p, 390, 655, T.hit, 3.4, ink === NAVY ? NAVY : ACC);
  snd('hit', T.hit);
  cardText(c, T, s.lead, s.key);
});

/* H4: the selling price as one bar; it splits into its costs, and what is left — the profit — lights up on the key word */
PART('BIZ', 'h4', {pack: BIZ, code: 'BIZ-H4', name: 'ราคาแตกเป็นต้นทุนกับกำไร', bgs: ['glow', 'white', 'cream'],
  slots: {price: {type: 'number', req: true}, unit: {type: 'text', max: 6}, pre: {type: 'text', max: 2},
          parts: {type: 'list', max: 3, req: true}, amounts: {type: 'list'}, profit: {type: 'number'},
          lead: {type: 'text', max: 26}, key: {type: 'text', max: 14}}, dur: [1.8, 4.0],
  hit: 'ส่วนกำไรเผยเป็นสีเน้นพร้อมตัวเลข (ถ้าพูด) + วงคลื่น'}, (c, s, T) => {
  const n = s.parts.length;
  if (s.amounts && s.amounts.length !== n) throw new Error('BIZ.h4: amounts must match parts');
  const o = ON[T.bg], dark = o.ink === '#FFFFFF';
  const money = v => (s.pre ?? '') + fmtNum(Number(v), decOf(Number(v))) + (s.unit ? (tight(s.unit) ? s.unit : ' ' + s.unit) : '');
  const pr = div(`left:80px;width:920px;top:200px;display:flex;justify-content:center`, c);
  const pv = div(`position:relative;font-family:KeySans;font-size:150px;line-height:1.1;letter-spacing:-4px;white-space:nowrap;color:${o.ink};opacity:0`, pr); pv.textContent = money(s.price); fitW(pv, 900);
  mv.key(pv, T.t0 + .05);
  const all = s.amounts && s.profit != null ? [...s.amounts.map(Number), s.profit] : null, sum = all ? all.reduce((a, b) => a + b, 0) : 0;
  const W = 860, gap = 14, wid = k => all ? (W - gap * n) * all[k] / sum : (W - gap * n) / (n + 1);
  const shades = dark ? ['rgba(255,255,255,.34)', 'rgba(255,255,255,.22)', 'rgba(255,255,255,.14)'] : ['#7A869E', '#A9B2C3', '#D3D8E2'];
  const split = T.t0 + .4 + (T.hit - T.t0 - .4) * .3;
  let x = 0;
  const segs = [];
  for (let k = 0; k <= n; k++) {
    const w = Math.max(wid(k), 40), seg = div(`left:${110 + x - k * gap}px;top:430px;width:${w}px;height:150px;border-radius:24px;background:${k < n ? shades[k] : (dark ? 'rgba(255,255,255,.08)' : '#EEF0F4')};transform-origin:0 50%`, c);
    mv.fill(seg, T.t0 + .2 + MOTION.fill.d + k * MOTION.grow.step, 0, 1); segs.push(seg);   // no bounce: an overshoot ran into the next block (Friend 2026-11-04)
    if (k) mv.slide(seg, split + k * .05, 'translateX(0)', `translateX(${k * gap}px)`);
    x += w + gap;
  }
  const lit = div(`left:0;top:0;width:100%;height:100%;border-radius:24px;background:${ACC};opacity:0`, segs[n]);
  mv.pop(lit, T.hit, 'scale(.5)');
  s.parts.forEach((name, k) => {
    const r = div(`left:160px;top:${640 + k * 92}px;width:760px;height:80px;display:flex;align-items:center;gap:.4em;font-size:54px;opacity:0`, c);
    div(`position:relative;width:46px;height:46px;border-radius:12px;background:${shades[k]};flex:none`, r);
    const t = div(`position:relative;font-family:CardSans;font-size:1em;white-space:nowrap;color:${o.ink}`, r); t.textContent = name;
    if (s.amounts) { const a = div(`position:relative;margin-left:auto;font-family:KeySans;font-size:1.04em;white-space:nowrap;color:${o.soft}`, r); a.textContent = money(s.amounts[k]); }
    fitW(r, 760); mv.lead(r, split + .15 + k * MOTION.stagger);
  });
  const pr2 = div(`left:160px;top:${640 + n * 92}px;width:760px;height:90px;display:flex;align-items:center;gap:.36em;font-size:62px;opacity:0`, c);
  div(`position:relative;width:46px;height:46px;border-radius:12px;background:${ACC};flex:none`, pr2);
  const pl = div(`position:relative;font-family:KeySans;font-size:1em;white-space:nowrap;color:${o.ink}`, pr2); pl.textContent = 'กำไร';
  if (s.profit != null) { const pa = div(`position:relative;margin-left:auto;font-family:KeySans;font-size:1.06em;white-space:nowrap;color:${INK};background:${ACC};border-radius:14px;padding:0 .18em .04em`, pr2); pa.textContent = money(s.profit); }
  fitW(pr2, 760); mv.key(pr2, T.hit + .05);
  ripple(c, 110 + W - wid(n) / 2, 505, T.hit, 3, dark ? ACC : NAVY); snd('hit', T.hit);
  cardText(c, T, s.lead, s.key, 1350);
});

/* H5: a shop front — the awning rolls down, and on the key word the door sign flips from ปิด to เปิด and the lights come on */
PART('BIZ', 'h5', {pack: BIZ, code: 'BIZ-H5', name: 'หน้าร้านเปิด', bgs: ['glow', 'cream', 'white'],
  slots: {shop: {type: 'text', max: 14}, icon: {type: 'icon'}, open: {type: 'text', max: 6}, lead: {type: 'text', max: 26}, key: {type: 'text', max: 14}}, dur: [1.4, 3.5],
  hit: 'ป้ายหน้าร้านพลิกเป็น "เปิด" ไฟในร้านติดตรงคำ "เปิด เริ่ม" + วงคลื่น'}, (c, s, T) => {
  const o = ON[T.bg], dark = o.ink === '#FFFFFF', line = o.ink, fillB = dark ? 'rgba(255,255,255,.07)' : '#FFFFFF';
  const shop = div('left:170px;top:250px;width:740px;height:600px;opacity:0', c,
    `<svg width="740" height="600" viewBox="0 0 740 600" style="display:block;overflow:visible"><rect x="30" y="90" width="680" height="500" rx="20" fill="${fillB}" stroke="${line}" stroke-width="10"/>
     <rect x="80" y="180" width="320" height="250" rx="16" fill="${dark ? 'rgba(255,255,255,.06)' : '#EEF0F4'}" stroke="${line}" stroke-width="8"/>
     <rect x="460" y="180" width="200" height="410" rx="14" fill="${dark ? 'rgba(255,255,255,.06)' : '#EEF0F4'}" stroke="${line}" stroke-width="8"/>
     <circle cx="490" cy="400" r="10" fill="${line}"/></svg>`);
  mv.pop(shop, T.t0 + .05, 'translateY(80px) scale(.94)');
  const glow = div(`left:258px;top:438px;width:304px;height:234px;border-radius:12px;background:${ACC};opacity:0`, c);
  div('left:248px;top:428px;width:324px;height:254px;display:flex;align-items:center;justify-content:center', c, ico(s.icon ?? 'store', 130, line, 2));
  const stripes = Array.from({length: 8}, (_, k) => `<path d="M${k * 92.5} 0 H${(k + 1) * 92.5} V110 a46 46 0 0 1 -92.5 0 Z" fill="${k % 2 ? (dark ? '#FFFFFF' : NAVY) : ACC}"/>`).join('');
  const awn = div('left:170px;top:250px;width:740px;height:160px;transform-origin:50% 0;transform:scaleY(0)', c, `<svg width="740" height="160" viewBox="0 0 740 160" style="display:block;overflow:visible">${stripes}</svg>`);
  mv.grow(awn, T.t0 + .3, 1);
  const sign = (text, bg, ink) => div(`left:640px;top:520px;width:180px;height:96px;border-radius:18px;background:${bg};color:${ink};display:flex;align-items:center;justify-content:center;font-family:KeySans;font-size:58px;white-space:nowrap;box-shadow:0 14px 30px rgba(0,0,0,.3);opacity:0`, c, text);
  const closed = sign('ปิด', dark ? '#FFFFFF' : NAVY, dark ? INK : '#FFFFFF'), open = sign(s.open ?? 'เปิด', ACC, INK);
  mv.show(closed, T.t0 + .5); mv.slide(closed, T.hit - MOTION.slide.d, 'rotateY(0)', 'rotateY(90deg)');
  mv.pop(open, T.hit, 'rotateY(-90deg)'); mv.show(glow, T.hit);
  const lit = div('left:248px;top:428px;width:324px;height:254px;display:flex;align-items:center;justify-content:center;opacity:0', c, ico(s.icon ?? 'store', 130, INK, 2)); mv.show(lit, T.hit);
  ripple(c, 730, 568, T.hit, 3, dark ? ACC : NAVY); snd('hit', T.hit);
  if (s.shop) mv.lead(bizLine(c, s.shop, 900, o.ink), T.t0 + .35);
  cardText(c, T, s.lead, s.key, 1290);
});
