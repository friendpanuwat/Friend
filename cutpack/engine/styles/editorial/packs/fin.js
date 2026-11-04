/* =====================================================================
   PACK fin — การเงินและการลงทุน (same rules as packs/biz.js; items wait for Friend's picks in the gallery)
   Coins and cards are generic: no bank names, no real app or brand look.
   ===================================================================== */
const FIN = 'fin';
const finUp = (s, dark) => s.dir === 'down' ? RED : dark ? ACC : NAVY;
const coin = (parent, x, y, sz, fill, ink) => div(`left:${x}px;top:${y}px;width:${sz}px;height:${sz}px;opacity:0`, parent,
  `<svg width="${sz}" height="${sz}" viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="${fill}"/><circle cx="50" cy="50" r="34" fill="none" stroke="${ink}" stroke-width="5" opacity=".5"/>` +
  // the baht mark is drawn, not typed: coins sit on top of each other, and letters there would count as overlapping text
  `<path d="M39 31 H55 a9.5 9.5 0 0 1 0 19 H39 M39 50 H57 a9.5 9.5 0 0 1 0 19 H39 V31 M51 23 V77" fill="none" stroke="${ink}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>`);

/* ---------- props ---------- */

/* P1 → B01: ten coins; the share said (3 ใน 10, 30%) turns gold-accent one by one on the key word */
PART('B01', 'fin1', {pack: FIN, code: 'FIN-P1', name: 'ตารางเหรียญ', bgs: ['glow', 'white', 'cream'], slots: B01_SLOTS, dur: [1.6, 3.5],
  hit: 'เหรียญตามสัดส่วนเปลี่ยนเป็นสีเน้นทีละเหรียญ ป้ายสัดส่วนขึ้น'}, (c, s, T) => {
  const o = ON[T.bg], dark = o.ink === '#FFFFFF', of = shareOf(s);
  if (of == null) throw new Error('FIN.P1 needs `of` (e.g. 3 ใน 10) or unit %');
  const k = Math.round(10 * Math.max(0, Math.min(1, s.num / of)));
  for (let i = 0; i < 10; i++) {
    const x = 100 + (i % 5) * 180, y = 300 + Math.floor(i / 5) * 210;
    const b = coin(c, x, y, 160, dark ? 'rgba(255,255,255,.12)' : 'rgba(20,33,61,.08)', dark ? 'rgba(255,255,255,.45)' : 'rgba(20,33,61,.35)');
    mv.pop(b, T.t0 + .05 + i * .035, 'scale(.4)');
    if (i < k) { const on = coin(c, x, y, 160, ACC, INK); mv.pop(on, T.hit + i * .06, 'scale(1.5) rotate(-30deg)'); }
  }
  const lw = div('left:60px;width:960px;top:800px;display:flex;justify-content:center', c);
  const lab = div(`position:relative;font-family:KeySans;font-size:120px;line-height:1.1;letter-spacing:-3px;white-space:nowrap;color:${dark ? ACC : NAVY};opacity:0`, lw);
  lab.textContent = shareLabel(s); fitW(lab, SAFE_W);
  mv.key(lw, T.hit + .1); mv.show(lab, T.hit + .1); snd('hit', T.hit);
  cardText(c, T, s.lead, s.key);
});

/* P2 → B02: candlesticks; the last candle shoots up (accent) or plunges (red) on the key word */
PART('B02', 'fin1', {pack: FIN, code: 'FIN-P2', name: 'กราฟแท่งเทียน', bgs: ['glow', 'white', 'cream'], slots: B02_SLOTS, dur: [1.4, 3.5],
  hit: 'แท่งเทียนแท่งสุดท้ายพุ่งขึ้น (สีเน้น) หรือดิ่งลง (สีแดง) + ป้ายตัวเลข'}, (c, s, T) => {
  const o = ON[T.bg], dark = o.ink === '#FFFFFF', up = s.dir !== 'down', col = finUp(s, dark), soft = dark ? '#5C6273' : '#A9B2C3';   // solid: the wick must not show through the body (Friend 2026-11-04)
  const base = 800, unit = 54;
  // [open, close] in units above the base line for the first five candles: a gentle drift toward the move
  const prev = up ? [[2, 4], [4, 3], [3, 5], [5, 4], [4, 6]] : [[9, 8], [8, 9], [9, 7], [7, 8], [8, 7]];
  prev.forEach(([a, b], i) => {
    const lo = Math.min(a, b), hi = Math.max(a, b), x = 120 + i * 145;
    const wick = div(`left:${x + 39}px;top:${base - (hi + .8) * unit}px;width:8px;height:${(hi - lo + 1.6) * unit}px;border-radius:4px;background:${soft}`, c);
    const body = div(`left:${x}px;top:${base - hi * unit}px;width:86px;height:${(hi - lo) * unit}px;border-radius:12px;background:${soft}`, c);
    [wick, body].forEach(e => { e.style.transformOrigin = '50% 100%'; mv.grow(e, T.t0 + .05, 1, i); });
  });
  const [a, b] = up ? [6, 13] : [7, 1], lo = Math.min(a, b), hi = Math.max(a, b), x = 120 + 5 * 145;
  const last = div(`left:${x}px;top:${base - hi * unit}px;width:86px;height:${(hi - lo) * unit}px;border-radius:10px;background:${col};transform-origin:50% ${up ? '100%' : '0'}`, c);
  mv.fill(last, T.hit, 0, 1, 'Y');
  div(`left:110px;top:${base + 2}px;width:860px;height:4px;border-radius:2px;background:${o.track}`, c);
  ripple(c, x + 43, base - (up ? hi : lo) * unit, T.hit, 3, col); snd('hit', T.hit);
  if (s.num) chipAt(c, s.num, T.hit + .1, 540, 900);
  cardText(c, T, s.lead, s.key);
});

/* P3 → B12: A → B with coins flowing along the arrow; the last coin lands as B pops on the key word */
PART('B12', 'fin1', {pack: FIN, code: 'FIN-P3', name: 'เหรียญไหลตามลูกศร', bgs: ['glow', 'cream', 'white'], slots: B12_SLOTS, dur: [1.2, 3.5],
  hit: 'เหรียญเหรียญสุดท้ายถึงปลายลูกศรตรงคำ "ทำให้ เลย" แล้ว B เด้ง'}, (c, s, T) => {
  const o = ON[T.bg], dark = o.ink === '#FFFFFF', col = dark ? ACC : NAVY;
  tile(c, s.ia, T.t0 + .05, 'left:80px;top:420px', {size: 250, bg: o.sub === 'glass' ? 'glass' : o.sub, color: o.ink, sound: false});
  mv.lead(capt(c, s.a, 25, 710, 360, o.ink), T.t0 + .15);
  const ar = svg(340, 60, `<path d="M6 30 H310" stroke="${col}" stroke-width="12" stroke-linecap="round" stroke-dasharray="2 26"/><path d="M286 6 L320 30 L286 54" fill="none" stroke="${col}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>`, 'left:360px;top:560px', c);
  mv.show(ar, T.t0 + .2);
  [0, 1, 2].forEach(k => {
    const cn = coin(c, 360, 460, 96, ACC, INK);
    mv.pop(cn, T.t0 + .3 + k * .08, 'scale(0)');
    mv.slide(cn, T.hit - MOTION.slide.d - (2 - k) * .22, 'translateX(0)', `translateX(${240 - k * 4}px)`);
  });
  tile(c, s.ib, T.hit, 'left:730px;top:420px', {size: 250, bg: ACC, color: INK, sound: false});
  mv.lead(capt(c, s.b, 670, 710, 360, col), T.hit + .05);
  ripple(c, 855, 545, T.hit, 3, col); snd('hit', T.hit);
  cardText(c, T, s.lead, s.key, 1260);
});

/* P4 → B07: a plain credit card; a red crack runs across it on the key word and the two halves pull apart */
PART('B07', 'fin1', {pack: FIN, code: 'FIN-P4', name: 'บัตรเครดิตแตกร้าว', bgs: ['glow', 'white', 'cream'], slots: B07_SLOTS, dur: [1.2, 3.5],
  hit: 'รอยร้าวสีแดงวิ่งข้ามบัตรตรงคำ "ระวัง หนี้" บัตรแยกเป็นสองซีก'}, (c, s, T) => {
  const o = ON[T.bg], dark = o.ink === '#FFFFFF', fill = dark ? '#FFFFFF' : NAVY, ink = dark ? NAVY : '#FFFFFF';
  const crack = 'M300 0 L270 90 L330 160 L280 240 L320 330 L290 420';
  const card = div('left:170px;top:280px;width:740px;height:420px;opacity:0', c);
  const mk = (clip) => { const h = div(`left:0;top:0;width:740px;height:420px;clip-path:${clip}`, card,
    `<svg width="740" height="420" viewBox="0 0 740 420"><rect width="740" height="420" rx="40" fill="${fill}"/><rect x="60" y="130" width="120" height="90" rx="16" fill="${ACC}"/>` +
    `<rect x="60" y="290" width="380" height="26" rx="13" fill="${ink}" opacity=".35"/><rect x="60" y="340" width="230" height="22" rx="11" fill="${ink}" opacity=".25"/>` +
    `<circle cx="600" cy="90" r="38" fill="${ink}" opacity=".3"/><circle cx="650" cy="90" r="38" fill="${ink}" opacity=".18"/></svg>`); return h; };
  const L = mk('polygon(0 0,300px 0,270px 90px,330px 160px,280px 240px,320px 330px,290px 420px,0 420px)');
  const R = mk('polygon(300px 0,740px 0,740px 420px,290px 420px,320px 330px,280px 240px,330px 160px,270px 90px)');
  mv.pop(card, T.t0 + .05, 'scale(.7) rotate(-6deg)');
  const line = svg(740, 420, `<path d="${crack}" fill="none" stroke="${RED}" stroke-width="12" stroke-linejoin="round" stroke-linecap="round"/>`, 'left:0;top:0', card);
  mv.draw(line.querySelector('path'), T.hit - .3, .3);
  // Friend 2026-11-04: the crack line is simply gone the moment the halves part — no shrinking (a cut, set again on every seek)
  HOOKS.push(t => { line.style.visibility = t >= T.hit ? 'hidden' : 'visible'; });
  mv.slide(L, T.hit, 'translate(0,0) rotate(0)', 'translate(-30px,14px) rotate(-3deg)');
  mv.slide(R, T.hit, 'translate(0,0) rotate(0)', 'translate(30px,-10px) rotate(3deg)');
  ripple(c, 470, 490, T.hit, 3.4, RED); snd('cross', T.hit - .1); snd('hit', T.hit);
  mv.lead(bizLine(c, s.text, 860, o.ink), T.t0 + .3);
  cardText(c, T, s.lead, s.key, 1260);
});

/* P5 → B08: coins drop one by one into a wallet (Friend 2026-11-04: not a piggy bank); the last one lands on the key word and the bar is full */
PART('B08', 'fin1', {pack: FIN, code: 'FIN-P5', name: 'กระเป๋าสตางค์เต็ม', bgs: ['glow', 'cream', 'white'], slots: B08_SLOTS, dur: [1.4, 3.5],
  hit: 'เหรียญสุดท้ายหล่นลงกระเป๋าสตางค์ แถบใต้กระเป๋าเต็มพอดี + วงคลื่น'}, (c, s, T) => {
  const o = ON[T.bg], dark = o.ink === '#FFFFFF', col = dark ? ACC : NAVY;
  const wf = dark ? '#FFFFFF' : NAVY, wi = dark ? NAVY : '#FFFFFF';
  const pig = div('left:250px;top:380px;width:580px;height:360px;opacity:0', c, `<svg width="580" height="360" viewBox="0 0 580 360" style="display:block;overflow:visible">
    <rect x="20" y="20" width="540" height="320" rx="44" fill="${wf}"/>
    <path d="M20 90 H560" stroke="${wi}" stroke-opacity=".18" stroke-width="10"/>
    <path d="M330 150 H560 V270 H330 a60 60 0 0 1 0 -120 Z" fill="${dark ? '#E9ECF2' : '#2A3A5E'}"/>
    <circle cx="340" cy="210" r="22" fill="${ACC}"/><rect x="180" y="4" width="220" height="30" rx="15" fill="${wi}" stroke="${wf}" stroke-width="8"/></svg>`);
  mv.pop(pig, T.t0 + .05, 'translateY(60px) scale(.9)');
  const step = (T.hit - T.t0 - .6) / 3;
  [0, 1, 2, 3].forEach(k => {
    const cn = coin(c, 487, 230, 106, ACC, INK);
    mv.fly(cn, T.t0 + .5 + k * step - MOTION.fly.d, 'translate(0,-260px)');
    mv.slide(cn, T.t0 + .5 + k * step, 'translateY(0)', 'translateY(120px) scale(.2)');
  });
  const track = div(`left:240px;top:780px;width:600px;height:44px;border-radius:22px;background:${o.track};overflow:hidden`, c);
  const fill = div(`left:0;top:0;width:600px;height:44px;border-radius:22px;background:${col};transform-origin:0 50%`, track);
  mv.fill(fill, T.hit, 0, 1);
  mv.punch(pig, T.hit); ripple(c, 540, 550, T.hit, 4, col); snd('hit', T.hit);
  mv.lead(bizLine(c, s.goal, 870, o.ink), T.t0 + .3);
  if (s.num) chipAt(c, s.num, T.hit + .1, 540, 980);
  cardText(c, T, s.lead, s.key, 1290);
});

/* P6 → B09: a 12-box instalment plan; the boxes tick off one by one and the last one is ticked on the key word */
PART('B09', 'fin1', {pack: FIN, code: 'FIN-P6', name: 'ตารางผ่อนรายเดือน', bgs: ['glow', 'white', 'cream'], slots: B09_SLOTS, dur: [1.6, 4.0],
  hit: 'งวดสุดท้ายถูกติ๊กตรงคำที่บอกเวลา + วงคลื่น'}, (c, s, T) => {
  const o = ON[T.bg], dark = o.ink === '#FFFFFF', col = dark ? ACC : NAVY;
  const step = (T.hit - T.t0 - .5) / 11;
  for (let i = 0; i < 12; i++) {
    const x = 140 + (i % 4) * 205, y = 240 + Math.floor(i / 4) * 175;
    const b = div(`left:${x}px;top:${y}px;width:180px;height:150px;border-radius:26px;background:${dark ? 'rgba(255,255,255,.1)' : '#FFFFFF'};box-shadow:0 14px 30px rgba(0,0,0,.18);opacity:0`, c);
    mv.pop(b, T.t0 + .05 + i * .025, 'scale(.5)');
    const ok = div(`left:${x}px;top:${y}px;width:180px;height:150px;border-radius:26px;background:${i === 11 ? ACC : col};display:flex;align-items:center;justify-content:center;opacity:0`, c,
      ico('check', 76, i === 11 || dark ? INK : '#FFFFFF', 3.2));
    mv.pop(ok, T.t0 + .5 + i * step, 'scale(.3)');
  }
  ripple(c, 140 + 3 * 205 + 90, 240 + 2 * 175 + 75, T.hit, 3, col); snd('hit', T.hit);
  mv.lead(whenLine(c, s, 800, o.ink, 110), T.t0 + .3);
  cardText(c, T, s.lead, s.key, 1290);
});

/* ---------- hero parts ---------- */

/* H1: compound interest — the money line curves up away from the straight line of what was put in; the gap lights up */
PART('FIN', 'h1', {pack: FIN, code: 'FIN-H1', name: 'ดอกเบี้ยทบต้น', bgs: ['glow', 'white', 'cream'],
  slots: {final: {type: 'number'}, years: {type: 'text', max: 10}, unit: {type: 'text', max: 6}, lead: {type: 'text', max: 26}, key: {type: 'text', max: 14}}, dur: [1.6, 4.0],
  hit: 'เส้นเงินทบต้นวิ่งถึงปลาย ช่องห่างจากเงินต้นสว่างเป็นสีเน้น ยอดปลายทางขึ้น (ถ้าพูด)'}, (c, s, T) => {
  const o = ON[T.bg], dark = o.ink === '#FFFFFF', col = dark ? ACC : NAVY, W = 760, H = 480, x0 = 160, y0 = 260;
  const pts = Array.from({length: 21}, (_, i) => [i / 20 * W, H - (Math.pow(1.105, i) - 1) / (Math.pow(1.105, 20) - 1) * (H - 40)]);
  const curve = 'M' + pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(' L');
  const area = curve + ` L${W} ${H - (H - 40) * .3} L0 ${H} Z`;
  const g = svg(W, H, `<path d="M0 ${H} H${W}" stroke="${o.track}" stroke-width="6"/><path d="M0 ${H} V0" stroke="${o.track}" stroke-width="6"/>
    <path d="${area}" fill="${ACC}" opacity="0"/>
    <path d="M0 ${H} L${W} ${H - (H - 40) * .3}" fill="none" stroke="${o.soft}" stroke-width="12" stroke-linecap="round" stroke-dasharray="4 22"/>
    <path d="${curve}" fill="none" stroke="${col}" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>`, `left:${x0}px;top:${y0}px`, c);
  const [, , , straight, money] = g.querySelectorAll('path');
  mv.draw(straight, T.t0 + .2, .6); mv.draw(money, T.hit - .9, .9);
  const glow = svg(W, H, `<path d="${area}" fill="${ACC}" opacity=".28"/>`, `left:${x0}px;top:${y0}px;opacity:0`, c); mv.show(glow, T.hit);
  const dot = div(`left:${x0 + W - 30}px;top:${y0 + 10}px;width:60px;height:60px;border-radius:50%;background:${ACC};border:6px solid ${INK};opacity:0`, c); mv.pop(dot, T.hit);
  if (s.final != null) { const v = (s.pre ?? '') + fmtNum(s.final, decOf(s.final)) + (s.unit ? ' ' + s.unit : ''); chipAt(c, v, T.hit + .1, x0 + W - 140, 170); }
  if (s.years) { const yl = div(`left:${x0 + W - 300}px;top:${y0 + H + 20}px;width:300px;text-align:right;font-family:CardSans;font-size:52px;white-space:nowrap;color:${o.soft};opacity:0`, c); yl.textContent = s.years; fitW(yl, 300); mv.lead(yl, T.t0 + .4); }
  ripple(c, x0 + W, y0 + 40, T.hit, 3, col); snd('hit', T.hit);
  cardText(c, T, s.lead, s.key);
});

/* H2: a donut splits the money into 2–4 parts; the part talked about pulls out of the ring on the key word */
PART('FIN', 'h2', {pack: FIN, code: 'FIN-H2', name: 'แบ่งเงินเป็นก้อน', bgs: ['glow', 'white', 'cream'],
  slots: {names: {type: 'list', max: 4, req: true}, shares: {type: 'list', req: true}, focus: {type: 'number'}, lead: {type: 'text', max: 26}, key: {type: 'text', max: 14}}, dur: [1.8, 4.0],
  hit: 'ก้อนที่พูดถึงดึงออกจากวงและเป็นสีเน้น + วงคลื่น'}, (c, s, T) => {
  const n = s.names.length, sh = s.shares.map(Number), tot = sh.reduce((a, b) => a + b, 0);
  if (n < 2 || n > 4 || sh.length !== n) throw new Error('FIN.h2 needs 2–4 names with a share each');
  const o = ON[T.bg], dark = o.ink === '#FFFFFF', focus = s.focus ?? n - 1, R = 190, cx = 330, cy = 520;
  const shades = dark ? ['rgba(255,255,255,.5)', 'rgba(255,255,255,.3)', 'rgba(255,255,255,.18)', 'rgba(255,255,255,.1)'] : ['#46536E', '#7A869E', '#A9B2C3', '#D3D8E2'];
  let a0 = -90;
  const step = (T.hit - T.t0 - .6) / n;
  sh.forEach((v, k) => {
    const f = v / tot, mid = (a0 + f * 180) * Math.PI / 180, on = k === focus;
    const ring = svg(560, 560, `<circle cx="280" cy="280" r="${R}" fill="none" stroke="${on ? ACC : shades[k]}" stroke-width="110" transform="rotate(${a0} 280 280)"/>`, `left:${cx - 280}px;top:${cy - 280}px`, c);
    const circ = ring.querySelector('circle');
    mv.ring(circ, T.t0 + .2 + k * step, f - .006);
    if (on) mv.slide(ring, T.hit, 'translate(0,0)', `translate(${Math.cos(mid) * 30}px,${Math.sin(mid) * 30}px)`);
    const r = div(`left:600px;top:${330 + k * 110}px;width:380px;height:90px;display:flex;align-items:center;gap:.4em;font-size:52px;opacity:0`, c);
    div(`position:relative;width:44px;height:44px;border-radius:12px;background:${on ? ACC : shades[k]};flex:none`, r);
    const nm = div(`position:relative;font-family:CardSans;font-size:1em;white-space:nowrap;color:${o.ink}`, r); nm.textContent = s.names[k];
    const pc = div(`position:relative;margin-left:auto;font-family:KeySans;font-size:1.1em;white-space:nowrap;${on ? `background:${ACC};color:${INK};border-radius:12px;padding:0 .16em .04em` : `color:${o.ink}`}`, r); pc.textContent = `${fmtNum(v, decOf(v))}%`;
    fitW(r, 340); mv.lead(r, T.t0 + .25 + k * step);
    if (on) { mv.punch(r, T.hit); ripple(c, cx + Math.cos(mid) * R, cy + Math.sin(mid) * R, T.hit, 2.6, dark ? ACC : NAVY); }
    a0 += f * 360;
  });
  snd('hit', T.hit);
  cardText(c, T, s.lead, s.key);
});

/* H3: an account statement — money in and out, line by line (out in red); the balance appears on the key word */
PART('FIN', 'h3', {pack: FIN, code: 'FIN-H3', name: 'รายการรับจ่าย', bgs: ['glow', 'white', 'cream'],
  slots: {rows: {type: 'list', max: 4, req: true}, balance: {type: 'number'}, lead: {type: 'text', max: 26}, key: {type: 'text', max: 14}}, dur: [1.8, 4.0],
  hit: 'ยอดคงเหลือขึ้นท้ายใบ (ถ้าพูด ถ้าไม่พูดเป็นแถบ) + วงคลื่น'}, (c, s, T) => {
  const rows = s.rows;   // [{t: 'เงินเดือน', v: 25000, in: true}, …] — every v was said
  const st = bizPanel(T.bg), ink = st === 'white' ? NAVY : '#FFFFFF', pos = st === 'white' ? NAVY : ACC;
  const p = panel(c, `left:150px;top:220px;width:780px;height:${250 + rows.length * 120}px`, T.t0 + .02, {style: st});
  skel(p, 'left:50px;top:50px;width:300px', [.9], {color: ink === NAVY ? 'rgba(20,33,61,.13)' : 'rgba(255,255,255,.16)', h: 24, t: T.t0 + .1});
  const step = (T.hit - T.t0 - .7) / rows.length;
  rows.forEach((r, k) => {
    const row = div(`left:40px;top:${120 + k * 120}px;width:700px;height:100px;display:flex;align-items:center;gap:.5em;font-size:54px;opacity:0`, p);
    div(`position:relative;width:70px;height:70px;border-radius:50%;flex:none;background:${r.in ? pos : RED};display:flex;align-items:center;justify-content:center`, row, ico(r.in ? 'arrow-down-left' : 'arrow-up-right', 44, r.in && st !== 'white' ? INK : '#FFFFFF', 3));
    const t = div(`position:relative;font-family:CardSans;font-size:1em;white-space:nowrap;color:${ink}`, row); t.textContent = r.t;
    const v = div(`position:relative;margin-left:auto;font-family:KeySans;font-size:1.05em;white-space:nowrap;color:${r.in ? ink : RED}`, row); v.textContent = (r.in ? '+' : '−') + fmtNum(Number(r.v), decOf(Number(r.v)));
    fitW(row, 700); mv.lead(row, T.t0 + .4 + k * step);
  });
  const by = 140 + rows.length * 120;
  div(`left:40px;top:${by - 20}px;width:700px;height:0;border-top:4px dashed ${ink === NAVY ? 'rgba(20,33,61,.2)' : 'rgba(255,255,255,.2)'}`, p);
  if (s.balance != null) {
    const b = div(`left:40px;top:${by}px;width:700px;display:flex;justify-content:flex-end;opacity:0`, p);
    const bv = div(`position:relative;font-family:KeySans;font-size:70px;white-space:nowrap;color:${INK};background:${ACC};border-radius:14px;padding:0 .18em .04em`, b); bv.textContent = fmtNum(s.balance, decOf(s.balance));
    fitW(bv, 700); mv.key(b, T.hit);
  } else skel(p, `left:440px;top:${by + 14}px;width:300px`, [1], {color: ACC, h: 34, t: T.hit - .3});
  ripple(c, 780, 220 + by + 40, T.hit, 3, pos); snd('hit', T.hit);
  cardText(c, T, s.lead, s.key);
});

/* H4: inflation — the same note, while the basket under it gets lighter year by year; the last thing goes on the key word */
PART('FIN', 'h4', {pack: FIN, code: 'FIN-H4', name: 'เงินเฟ้อ', bgs: ['glow', 'cream', 'white'],
  slots: {amount: {type: 'number'}, unit: {type: 'text', max: 6}, span: {type: 'text', max: 12}, lead: {type: 'text', max: 26}, key: {type: 'text', max: 14}}, dur: [1.6, 4.0],
  hit: 'ของชิ้นสุดท้ายในตะกร้าจางหายตรงคำ "แพงขึ้น ได้น้อยลง" ลูกศรแดงชี้ลง'}, (c, s, T) => {
  const o = ON[T.bg], dark = o.ink === '#FFFFFF';
  const note = div(`left:240px;top:200px;width:600px;height:250px;border-radius:30px;background:${dark ? '#FFFFFF' : NAVY};box-shadow:0 26px 60px rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center;gap:24px;opacity:0`, c);
  div(`position:absolute;left:24px;top:24px;right:24px;bottom:24px;border-radius:20px;border:5px solid ${dark ? 'rgba(20,33,61,.25)' : 'rgba(255,255,255,.3)'}`, note);
  const nt = div(`position:relative;font-family:KeySans;font-size:${s.amount != null ? 120 : 150}px;white-space:nowrap;color:${dark ? NAVY : '#FFFFFF'}`, note);
  nt.textContent = s.amount != null ? fmtNum(s.amount, decOf(s.amount)) + (s.unit ? ' ' + s.unit : '') : '฿'; fitW(nt, 520);
  mv.pop(note, T.t0 + .05, 'scale(.6) rotate(-8deg)');
  const basket = svg(640, 300, `<path d="M20 60 H620 L560 290 H80 Z" fill="${dark ? 'rgba(255,255,255,.08)' : '#FFFFFF'}" stroke="${o.ink}" stroke-width="12" stroke-linejoin="round"/>`, 'left:220px;top:560px', c);
  mv.show(basket, T.t0 + .1);
  const icons = ['egg', 'milk', 'apple', 'fish', 'carrot'];
  const step = (T.hit - T.t0 - .7) / (icons.length - 1);
  icons.forEach((nm, k) => {
    const it = div(`left:${265 + k * 112}px;top:650px;width:110px;height:110px;border-radius:28px;background:${k === 2 ? ACC : o.tile};display:flex;align-items:center;justify-content:center;opacity:0`, c, ico(nm, 64, k === 2 ? INK : o.tileInk, 2.2));
    mv.pop(it, T.t0 + .2 + k * .06, 'translateY(-120px)');
    if (k > 0) mv.dim(it, T.t0 + .7 + (icons.length - 1 - k) * step);
  });
  const arrow = div(`left:850px;top:560px;width:130px;height:130px;border-radius:36px;background:${RED};display:flex;align-items:center;justify-content:center;opacity:0`, c, ico('trending-down', 86, '#FFFFFF', 2.8));
  mv.pop(arrow, T.hit); ripple(c, 915, 625, T.hit, 3, RED); snd('hit', T.hit);
  if (s.span) mv.lead(bizLine(c, s.span, 930, o.ink), T.t0 + .3);
  cardText(c, T, s.lead, s.key, 1290);
});

/* H5: a tax sheet — deductions tick off one by one, the tax bar shrinks with each, and lands on the key word */
PART('FIN', 'h5', {pack: FIN, code: 'FIN-H5', name: 'ลดหย่อนภาษี', bgs: ['glow', 'white', 'cream'],
  slots: {items: {type: 'list', max: 4, req: true}, tax: {type: 'number'}, unit: {type: 'text', max: 6}, lead: {type: 'text', max: 26}, key: {type: 'text', max: 14}}, dur: [1.8, 4.0],
  hit: 'รายการลดหย่อนข้อสุดท้ายถูกติ๊ก แถบภาษีหดถึงปลาย ยอดภาษีขึ้น (ถ้าพูด)'}, (c, s, T) => {
  const it = s.items, n = it.length, st = bizPanel(T.bg), ink = st === 'white' ? NAVY : '#FFFFFF', on = st === 'white' ? NAVY : ACC;
  const p = panel(c, `left:150px;top:200px;width:780px;height:${330 + n * 110}px`, T.t0 + .02, {style: st});
  const step = (T.hit - T.t0 - .7) / n;
  it.forEach((t, k) => {
    const y = 50 + k * 110, tk = T.t0 + .5 + k * step;
    div(`left:50px;top:${y}px;width:76px;height:76px;border-radius:20px;border:6px solid ${ink};opacity:.6`, p);
    const ck = div(`left:50px;top:${y}px;width:76px;height:76px;border-radius:20px;background:${on};display:flex;align-items:center;justify-content:center;opacity:0`, p, ico('check', 52, st === 'white' ? '#FFFFFF' : INK, 3.4));
    mv.pop(ck, tk, 'scale(1.6)');
    const l = div(`left:150px;top:${y + 4}px;width:580px;font-family:CardSans;font-size:54px;line-height:1.2;white-space:nowrap;color:${ink};opacity:0`, p); l.textContent = t; fitW(l, 580); mv.lead(l, T.t0 + .2 + k * .08);
  });
  const by = 80 + n * 110;
  const tr = div(`left:50px;top:${by}px;width:680px;height:56px;border-radius:28px;background:${ink === NAVY ? 'rgba(20,33,61,.12)' : 'rgba(255,255,255,.14)'};overflow:hidden`, p);
  const fill = div(`left:0;top:0;width:680px;height:56px;border-radius:28px;background:${RED};transform-origin:0 50%`, tr);
  mv.fill(fill, T.hit, 1, s.tax === 0 ? 0 : .25);
  div(`left:50px;top:${by + 70}px;width:200px;height:60px`, p, ico('landmark', 56, ink, 2));
  if (s.tax != null) {
    const tv = div(`left:300px;top:${by + 70}px;width:430px;display:flex;justify-content:flex-end;opacity:0`, p);
    const v = div(`position:relative;font-family:KeySans;font-size:72px;white-space:nowrap;color:${INK};background:${ACC};border-radius:14px;padding:0 .18em .04em`, tv); v.textContent = fmtNum(s.tax, decOf(s.tax)) + (s.unit ? ' ' + s.unit : ''); fitW(v, 430);
    mv.key(tv, T.hit);
  }
  ripple(c, 540, 200 + by + 28, T.hit, 3.4, on); snd('hit', T.hit);
  cardText(c, T, s.lead, s.key);
});
