/* =====================================================================
   PACK fit — สุขภาพและฟิตเนส (same rules as packs/biz.js; items wait for Friend's picks in the gallery)
   Bodies are plain flat figures, never photos, never a body type held up as worse.
   ===================================================================== */
const FIT = 'fit';
const fitCol = dark => dark ? ACC : NAVY;
const figure = (parent, css, color, sw = 26) => div(css, parent, `<svg width="100%" height="100%" viewBox="0 0 200 400" style="display:block;overflow:visible">
  <circle cx="100" cy="46" r="36" fill="${color}"/><path d="M100 96 V236 M100 120 L44 200 M100 120 L156 200 M100 236 L60 370 M100 236 L140 370" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/></svg>`);

/* ---------- props ---------- */

/* P1 → B01: footprints walk up the card; the ones counted light up and the number lands on the key word */
PART('B01', 'fit1', {pack: FIT, code: 'FIT-P1', name: 'รอยเท้าเดินขึ้น', bgs: ['glow', 'white', 'cream'], slots: B01_SLOTS, dur: [1.6, 3.5],
  hit: 'รอยเท้าสว่างทีละก้าวจนถึงค่า ตัวเลขหยุดตรงคำ'}, (c, s, T) => {
  const o = ON[T.bg], dark = o.ink === '#FFFFFF', of = shareOf(s);
  const k = of == null ? 10 : Math.round(10 * Math.max(0, Math.min(1, s.num / of)));
  const step = (T.hit - T.t0 - .45) / Math.max(1, k - 1);
  for (let i = 0; i < 10; i++) {
    const x = 160 + (i % 2) * 150 + i * 52, y = 840 - i * 48;   // the walk ends below the number (top 220–370), never under it
    const base = div(`left:${x}px;top:${y}px;width:96px;height:96px;opacity:0;transform:rotate(${i % 2 ? 12 : -12}deg)`, c, ico('footprints', 96, dark ? 'rgba(255,255,255,.25)' : 'rgba(20,33,61,.2)', 2.2));
    mv.show(base, T.t0 + .05 + i * .03);
    if (i < k) { const on = div(`left:${x}px;top:${y}px;width:96px;height:96px;opacity:0`, c, ico('footprints', 96, fitCol(dark), 2.6)); mv.pop(on, T.t0 + .4 + i * step, 'scale(1.5)'); }
  }
  const lw = div('left:60px;width:960px;top:220px;display:flex;justify-content:center', c);
  const n = div(`position:relative;font-family:KeySans;font-size:130px;line-height:1.1;letter-spacing:-3px;white-space:nowrap;color:${fitCol(dark)}`, lw);
  const txt = v => of != null && s.of != null ? `${fmtNum(v, decOf(s.num))} ใน ${fmtNum(s.of, decOf(s.of))}` : fmtNum(v, decOf(s.num)) + (s.unit ? (tight(s.unit) ? s.unit : ' ' + s.unit) : '');
  n.textContent = txt(s.num); fitW(n, 560);
  mv.count(n, T.hit - MOTION.count.d, 0, s.num, txt);
  mv.punch(lw, T.hit); snd('hit', T.hit);
  cardText(c, T, s.lead, s.key);
});

/* P2 → B02: a bathroom scale; its needle swings up or down to the key word (weight going down is not a bad thing here, so no red) */
PART('B02', 'fit1', {pack: FIT, code: 'FIT-P2', name: 'ตาชั่งน้ำหนัก', bgs: ['glow', 'white', 'cream'], slots: B02_SLOTS, dur: [1.2, 3.5],
  hit: 'เข็มตาชั่งหมุนไปทางขึ้นหรือลงแล้วหยุดตรงคำ ลูกศรบอกทิศเด้ง'}, (c, s, T) => {
  const o = ON[T.bg], dark = o.ink === '#FFFFFF', up = s.dir !== 'down';
  const body = div(`left:240px;top:240px;width:600px;height:600px;border-radius:120px;background:${dark ? '#FFFFFF' : NAVY};box-shadow:0 40px 90px rgba(0,0,0,.35);opacity:0`, c);
  mv.pop(body, T.t0 + .05, 'scale(.7)');
  const ink = dark ? NAVY : '#FFFFFF';
  const dial = svg(420, 260, `<path d="M30 230 A180 180 0 0 1 390 230" fill="none" stroke="${ink}" stroke-opacity=".25" stroke-width="30" stroke-linecap="round"/>` +
    Array.from({length: 9}, (_, k) => { const a = Math.PI * (1 - k / 8); return `<line x1="${210 + 150 * Math.cos(a)}" y1="${230 - 150 * Math.sin(a)}" x2="${210 + 125 * Math.cos(a)}" y2="${230 - 125 * Math.sin(a)}" stroke="${ink}" stroke-width="6" stroke-linecap="round" opacity=".5"/>`; }).join(''),
    'left:90px;top:80px', body);
  const needle = div(`left:${90 + 210 - 8}px;top:${80 + 230 - 170}px;width:16px;height:170px;border-radius:8px;background:${ACC};border:3px solid ${INK};transform-origin:50% 100%`, body);
  mv.slide(needle, T.hit - MOTION.slide.d, 'rotate(0deg)', `rotate(${up ? 62 : -62}deg)`);
  div(`left:${90 + 210 - 22}px;top:${80 + 230 - 22}px;width:44px;height:44px;border-radius:50%;background:${INK}`, body);
  const arrow = div(`left:${240 + 600 - 110}px;top:${240 + 600 - 110}px;width:150px;height:150px;border-radius:44px;background:${ACC};display:flex;align-items:center;justify-content:center;box-shadow:0 18px 40px rgba(0,0,0,.35);opacity:0`, c, ico(up ? 'arrow-up' : 'arrow-down', 96, INK, 3));
  mv.pop(arrow, T.hit); ripple(c, 540, 470, T.hit, 3.4, fitCol(dark)); snd('hit', T.hit);
  if (s.num) chipAt(c, s.num, T.hit + .1, 540, 900);
  cardText(c, T, s.lead, s.key);
});

/* P3 → B07: a heartbeat line runs across; on the key word it spikes in red and the heart jolts */
PART('B07', 'fit1', {pack: FIT, code: 'FIT-P3', name: 'เส้นชีพจรกระตุก', bgs: ['glow', 'white', 'cream'], slots: B07_SLOTS, dur: [1.2, 3.5],
  hit: 'เส้นชีพจรพุ่งเป็นสีแดงตรงคำ "เสี่ยง อันตราย" หัวใจกระตุก'}, (c, s, T) => {
  const o = ON[T.bg], dark = o.ink === '#FFFFFF';
  const calm = 'M0 200 H120 L150 150 L180 250 L210 200 H330 L360 160 L390 240 L420 200 H520';
  const g = svg(860, 400, `<path d="${calm}" fill="none" stroke="${o.soft}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M520 200 L560 200 L600 20 L650 380 L700 120 L730 200 H860" fill="none" stroke="${RED}" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>`, 'left:110px;top:300px', c);
  const [a, b] = g.querySelectorAll('path');
  mv.draw(a, T.t0 + .1, Math.max(.4, T.hit - T.t0 - .6)); mv.draw(b, T.hit - .35, .35);
  const heart = div(`left:450px;top:180px;width:180px;height:180px;opacity:0`, c, ico('heart', 180, RED, 2.4));
  mv.pop(heart, T.t0 + .05, 'scale(.5)'); mv.punch(heart, T.hit);
  ripple(c, 760, 500, T.hit, 3.2, RED); snd('hit', T.hit);
  mv.lead(bizLine(c, s.text, 860, o.ink), T.t0 + .3);
  cardText(c, T, s.lead, s.key, 1260);
});

/* P4 → B09: a stopwatch; its ring runs round and the button is pressed on the key word */
PART('B09', 'fit1', {pack: FIT, code: 'FIT-P4', name: 'นาฬิกาจับเวลา', bgs: ['glow', 'cream', 'white'], slots: B09_SLOTS, dur: [1.2, 3.5],
  hit: 'วงรอบนาฬิกาวิ่งครบ ปุ่มถูกกดตรงคำที่บอกเวลา + วงคลื่น'}, (c, s, T) => {
  const o = ON[T.bg], dark = o.ink === '#FFFFFF', col = fitCol(dark);
  const btn = div(`left:490px;top:190px;width:100px;height:70px;border-radius:18px;background:${o.ink};opacity:0`, c);
  const face = svg(520, 520, `<circle cx="260" cy="260" r="230" fill="${dark ? 'rgba(255,255,255,.06)' : '#FFFFFF'}" stroke="${o.track}" stroke-width="34"/>
    <circle cx="260" cy="260" r="230" fill="none" stroke="${col}" stroke-width="34" stroke-linecap="round" transform="rotate(-90 260 260)"/>`, 'left:280px;top:250px', c);
  mv.pop(face, T.t0 + .05, 'scale(.7)'); mv.pop(btn, T.t0 + .1, 'translateY(40px)');
  mv.ring(face.querySelectorAll('circle')[1], T.t0 + .2, 1, 0, {d: T.hit - T.t0 - .2, e: 'linear'});
  mv.slide(btn, T.hit - .15, 'translateY(0)', 'translateY(18px)');
  div(`left:280px;top:250px;width:520px;height:520px;display:flex;align-items:center;justify-content:center`, c, ico(s.icon ?? 'timer', 170, o.ink, 2));
  ripple(c, 540, 510, T.hit, 4, col); snd('hit', T.hit);
  mv.lead(whenLine(c, s, 820, o.ink, 110), T.t0 + .3);
  cardText(c, T, s.lead, s.key, 1290);
});

/* P5 → B03: two figures, before and after; the side the speaker favours lights up and gets a check on the key word */
PART('B03', 'fit1', {pack: FIT, code: 'FIT-P5', name: 'ร่างคนก่อนกับหลัง', bgs: ['glow', 'cream', 'white'], slots: B03_SLOTS, dur: [1.2, 3.5],
  hit: 'ร่างฝั่งที่ชนะสว่างเป็นสีเน้น เครื่องหมายถูกเด้ง (ไม่มีฝั่งชนะ: ทั้งสองฝั่งขึ้นพร้อมกัน)'}, (c, s, T) => {
  const o = ON[T.bg], dark = o.ink === '#FFFFFF', dim = dark ? 'rgba(255,255,255,.3)' : 'rgba(20,33,61,.25)';
  [['a', 150], ['b', 630]].forEach(([k, x], i) => {
    const win = s.win === k;
    const f = figure(c, `left:${x}px;top:260px;width:300px;height:520px;opacity:0`, dim); mv.pop(f, T.t0 + .05 + i * .1, 'translateY(60px) scale(.9)');
    if (win) {
      const lit = figure(c, `left:${x}px;top:260px;width:300px;height:520px;opacity:0`, fitCol(dark)); mv.pop(lit, T.hit, 'scale(1.1)');
      const ok = div(`left:${x + 210}px;top:240px;width:110px;height:110px;border-radius:50%;background:${ACC};display:flex;align-items:center;justify-content:center;box-shadow:0 14px 30px rgba(0,0,0,.3);opacity:0`, c, ico('check', 70, INK, 3.4));
      mv.pop(ok, T.hit + .05); ripple(c, x + 150, 520, T.hit, 3, fitCol(dark));
    }
    const l = capt(c, s[k], x - 30, 800, 330, win ? fitCol(dark) : o.ink, 58);   // the right label ends at x 930, left of the app's buttons mv.lead(l, T.t0 + .2 + i * .1);
  });
  div('left:530px;top:330px;width:20px;height:380px', c, `<svg width="20" height="380"><path d="M10 0 V380" stroke="${o.track}" stroke-width="6" stroke-dasharray="14 14"/></svg>`);
  snd('hit', T.hit);
  cardText(c, T, s.lead, s.key, 1290);
});

/* P6 → B08: a dumbbell is lifted up to the line on the key word */
PART('B08', 'fit1', {pack: FIT, code: 'FIT-P6', name: 'ดัมเบลยกขึ้น', bgs: ['glow', 'cream', 'white'], slots: B08_SLOTS, dur: [1.2, 3.5],
  hit: 'ดัมเบลยกถึงเส้นเป้าตรงคำ "สำเร็จ ถึงเป้า" + วงคลื่น'}, (c, s, T) => {
  const o = ON[T.bg], dark = o.ink === '#FFFFFF', col = fitCol(dark);
  div(`left:140px;top:330px;width:800px;height:0;border-top:8px dashed ${col}`, c);
  const flag = div(`left:860px;top:250px;width:90px;height:90px;border-radius:24px;background:${ACC};display:flex;align-items:center;justify-content:center;opacity:0`, c, ico('flag', 56, INK, 2.6));
  mv.pop(flag, T.t0 + .1);
  const db = div('left:240px;top:620px;width:600px;height:180px;opacity:0', c, `<svg width="600" height="180" viewBox="0 0 600 180">
    <rect x="120" y="76" width="360" height="28" rx="14" fill="${o.ink}"/>
    <rect x="40" y="20" width="70" height="140" rx="18" fill="${o.ink}"/><rect x="0" y="45" width="40" height="90" rx="14" fill="${o.ink}"/>
    <rect x="490" y="20" width="70" height="140" rx="18" fill="${o.ink}"/><rect x="560" y="45" width="40" height="90" rx="14" fill="${o.ink}"/></svg>`);
  mv.pop(db, T.t0 + .05, 'translateY(60px)');
  mv.slide(db, T.hit - MOTION.slide.d, 'translateY(0)', 'translateY(-300px)');
  ripple(c, 540, 410, T.hit, 4, col); snd('hit', T.hit);
  mv.lead(bizLine(c, s.goal, 880, o.ink), T.t0 + .3);
  if (s.num) chipAt(c, s.num, T.hit + .1, 540, 990);
  cardText(c, T, s.lead, s.key, 1290);
});

/* ---------- hero parts ---------- */

/* H1: a plate fills section by section (vegetables, protein, carbs …); the one talked about lights up on the key word */
PART('FIT', 'h1', {pack: FIT, code: 'FIT-H1', name: 'จานแบ่งสัดส่วน', bgs: ['glow', 'white', 'cream'],
  slots: {names: {type: 'list', max: 4, req: true}, shares: {type: 'list', req: true}, focus: {type: 'number'}, lead: {type: 'text', max: 26}, key: {type: 'text', max: 14}}, dur: [1.6, 4.0],
  hit: 'ส่วนที่พูดถึงบนจานสว่างเป็นสีเน้น + วงคลื่น (ไม่มีตัวเลขถ้าไม่ได้พูด)'}, (c, s, T) => {
  const n = s.names.length, sh = s.shares.map(Number), tot = sh.reduce((a, b) => a + b, 0);
  if (n < 2 || n > 4 || sh.length !== n) throw new Error('FIT.h1 needs 2–4 names with a share each');
  const o = ON[T.bg], dark = o.ink === '#FFFFFF', focus = s.focus ?? 0, cx = 330, cy = 530, R = 120;
  const shades = dark ? ['rgba(255,255,255,.5)', 'rgba(255,255,255,.32)', 'rgba(255,255,255,.2)', 'rgba(255,255,255,.12)'] : ['#46536E', '#7A869E', '#A9B2C3', '#D3D8E2'];
  const plate = div(`left:${cx - 260}px;top:${cy - 260}px;width:520px;height:520px;border-radius:50%;background:${dark ? 'rgba(255,255,255,.06)' : '#FFFFFF'};border:14px solid ${o.ink};box-shadow:0 30px 70px rgba(0,0,0,.3);opacity:0`, c);
  mv.pop(plate, T.t0 + .05, 'scale(.7)');
  let a0 = -90; const step = (T.hit - T.t0 - .6) / n;
  sh.forEach((v, k) => {
    const f = v / tot, on = k === focus, mid = (a0 + f * 180) * Math.PI / 180;
    const ring = svg(520, 520, `<circle cx="260" cy="260" r="${R}" fill="none" stroke="${shades[k]}" stroke-width="${2 * R}" transform="rotate(${a0} 260 260)"/>`, `left:${cx - 260}px;top:${cy - 260}px`, c);
    mv.ring(ring.querySelector('circle'), T.t0 + .25 + k * step, f - .004);
    if (on) { const lit = svg(520, 520, `<circle cx="260" cy="260" r="${R}" fill="none" stroke="${ACC}" stroke-width="${2 * R}" transform="rotate(${a0} 260 260)"/>`, `left:${cx - 260}px;top:${cy - 260}px`, c);
      mv.ring(lit.querySelector('circle'), T.hit - .3, f - .004); ripple(c, cx + Math.cos(mid) * R, cy + Math.sin(mid) * R, T.hit, 2.6, dark ? ACC : NAVY); }
    const r = div(`left:640px;top:${360 + k * 110}px;width:360px;height:90px;display:flex;align-items:center;gap:.4em;font-size:54px;opacity:0`, c);
    div(`position:relative;width:46px;height:46px;border-radius:12px;background:${on ? ACC : shades[k]};flex:none`, r);
    const nm = div(`position:relative;font-family:${on ? 'KeySans' : 'CardSans'};font-size:1em;white-space:nowrap;color:${o.ink}`, r); nm.textContent = s.names[k];
    fitW(r, 300); mv.lead(r, T.t0 + .25 + k * step);
    a0 += f * 360;
  });
  snd('hit', T.hit);
  cardText(c, T, s.lead, s.key);
});

/* H2: nutrient bars (protein, carbs, fat …) fill with the grams said; the one talked about lights up on the key word */
PART('FIT', 'h2', {pack: FIT, code: 'FIT-H2', name: 'แถบสารอาหาร', bgs: ['glow', 'white', 'cream'],
  slots: {items: {type: 'list', max: 4, req: true}, unit: {type: 'text', max: 6}, focus: {type: 'number'}, icon: {type: 'icon'}, lead: {type: 'text', max: 26}, key: {type: 'text', max: 14}}, dur: [1.6, 4.0],
  hit: 'แถบที่พูดถึงเป็นสีเน้นและเด้ง ตัวเลขกรัมขึ้น (ถ้าพูด)'}, (c, s, T) => {
  const it = s.items;   // [{t: 'โปรตีน', g: 31}, …] — g only if said
  const o = ON[T.bg], dark = o.ink === '#FFFFFF', focus = s.focus ?? 0, max = Math.max(1, ...it.map(x => Number(x.g ?? 0)));
  tile(c, s.icon ?? 'utensils', T.t0 + .05, 'left:440px;top:200px', {size: 200, bg: o.sub === 'glass' ? 'glass' : o.sub, color: o.ink, sound: false});
  const step = (T.hit - T.t0 - .6) / it.length;
  it.forEach((x, k) => {
    const y = 470 + k * 130, on = k === focus, f = x.g != null ? .2 + .8 * Number(x.g) / max : .55 + .15 * ((k + 1) % 2);
    const nm = div(`left:110px;top:${y}px;width:230px;font-family:CardSans;font-size:52px;line-height:1.3;white-space:nowrap;color:${o.ink};opacity:0`, c); nm.textContent = x.t; fitW(nm, 230); mv.lead(nm, T.t0 + .2 + k * .08);
    const tr = div(`left:360px;top:${y + 10}px;width:${x.g != null ? 420 : 560}px;height:54px;border-radius:27px;background:${o.track};overflow:hidden`, c);
    const fl = div(`left:0;top:0;width:100%;height:100%;border-radius:27px;background:${on ? ACC : (dark ? 'rgba(255,255,255,.45)' : '#7A869E')};transform-origin:0 50%`, tr);
    mv.fill(fl, on ? T.hit : T.t0 + .9 + k * step * .5, 0, f);
    if (x.g != null) { const g = div(`left:800px;top:${y}px;width:140px;font-family:KeySans;font-size:54px;line-height:1.3;white-space:nowrap;color:${on ? (dark ? ACC : NAVY) : o.ink};opacity:0`, c); g.textContent = fmtNum(Number(x.g), decOf(Number(x.g))) + (s.unit ?? 'g'); fitW(g, 140); mv.show(g, on ? T.hit : T.t0 + .9 + k * step * .5); }
    if (on) { mv.punch(tr, T.hit + .02); ripple(c, 360 + 420 * f, y + 37, T.hit, 2.6, dark ? ACC : NAVY); }
  });
  snd('hit', T.hit);
  cardText(c, T, s.lead, s.key);
});

/* H3: a figure; the body part talked about glows and gets a label on the key word */
const FIT_SPOTS = {head: [100, 46], shoulder: [70, 125], heart: [112, 150], belly: [100, 205], back: [100, 175], knee: [128, 310], wrist: [56, 192]};
PART('FIT', 'h3', {pack: FIT, code: 'FIT-H3', name: 'ร่างกายชี้จุด', bgs: ['glow', 'white', 'cream'],
  slots: {spot: {type: 'choice', of: Object.keys(FIT_SPOTS), req: true}, label: {type: 'text', max: 12, req: true}, lead: {type: 'text', max: 26}, key: {type: 'text', max: 14}}, dur: [1.2, 3.5],
  hit: 'จุดที่พูดถึงบนร่างกายสว่างเป็นวงสีเน้น ป้ายชื่อขึ้นข้าง ๆ'}, (c, s, T) => {
  const o = ON[T.bg], dark = o.ink === '#FFFFFF', col = fitCol(dark), X = 220, Y = 190, K = 1.7;   // the figure: 200×400 view → 340×680 px
  const f = figure(c, `left:${X}px;top:${Y}px;width:340px;height:680px;opacity:0`, dark ? 'rgba(255,255,255,.4)' : 'rgba(20,33,61,.3)', 30);
  mv.pop(f, T.t0 + .05, 'translateY(60px) scale(.94)');
  const [sx, sy] = FIT_SPOTS[s.spot], px = X + sx * K, py = Y + sy * K;
  const dot = div(`left:${px - 50}px;top:${py - 50}px;width:100px;height:100px;border-radius:50%;background:${ACC};border:6px solid ${INK};box-shadow:0 0 0 18px ${ACC}55;opacity:0`, c);
  mv.pop(dot, T.hit); ripple(c, px, py, T.hit, 3.2, col);
  const ln = svg(220, 10, `<path d="M0 5 H200" stroke="${col}" stroke-width="8" stroke-linecap="round"/>`, `left:${px + 56}px;top:${py - 5}px`, c);
  mv.draw(ln.querySelector('path'), T.hit + .05, .25);
  const lb = div(`left:${Math.min(px + 270, 640)}px;top:${py - 50}px;width:280px;height:100px;display:flex;align-items:center;opacity:0`, c);
  const t = div(`position:relative;padding:8px 26px 14px;border-radius:24px;background:${dark ? '#FFFFFF' : NAVY};color:${dark ? INK : '#FFFFFF'};font-family:KeySans;font-size:54px;white-space:nowrap`, lb); t.textContent = s.label; fitW(t, 270);
  mv.chip(lb, T.hit + .15); snd('hit', T.hit);
  cardText(c, T, s.lead, s.key, 1290);
});

/* H4: a figure doing reps (squat) while the counter climbs; the last rep and the number land on the key word */
PART('FIT', 'h4', {pack: FIT, code: 'FIT-H4', name: 'ท่าออกกำลังกายพร้อมตัวนับ', bgs: ['glow', 'white', 'cream'],
  slots: {n: {type: 'number'}, unit: {type: 'text', max: 6}, move: {type: 'text', max: 12}, lead: {type: 'text', max: 26}, key: {type: 'text', max: 14}}, dur: [1.8, 4.0],
  hit: 'ท่าสุดท้ายกลับขึ้นตรงคำ ตัวนับหยุดที่จำนวนในบท + วงคลื่น'}, (c, s, T) => {
  const o = ON[T.bg], dark = o.ink === '#FFFFFF', col = fitCol(dark);
  div(`left:180px;top:830px;width:420px;height:10px;border-radius:5px;background:${o.track}`, c);
  const f = figure(c, 'left:250px;top:240px;width:290px;height:580px;opacity:0;transform-origin:50% 100%', col, 30);
  mv.show(f, T.t0 + .05);
  const reps = 3, d = MOTION.slide.d, start = T.hit - reps * 2 * d;
  for (let r = 0; r < reps; r++) {
    mv.slide(f, start + r * 2 * d, 'scaleY(1)', 'scaleY(.78)');
    mv.slide(f, start + r * 2 * d + d, 'scaleY(.78)', 'scaleY(1)');
  }
  const box = panel(c, 'left:630px;top:330px;width:330px;height:330px', T.t0 + .1, {style: bizPanel(T.bg)});
  const ink = bizPanel(T.bg) === 'white' ? NAVY : '#FFFFFF';
  const cnt = div(`left:0;top:70px;width:330px;text-align:center;font-family:KeySans;font-size:150px;line-height:1;white-space:nowrap;color:${ink}`, box);
  if (s.n != null) { cnt.textContent = fmtNum(s.n, 0); fitW(cnt, 300); mv.count(cnt, start, 0, s.n); } else cnt.innerHTML = ico('repeat', 130, ink, 2.4);
  const u = div(`left:0;top:230px;width:330px;text-align:center;font-family:CardSans;font-size:50px;white-space:nowrap;color:${ink};opacity:.75`, box); u.textContent = s.unit ?? 'ครั้ง';
  mv.punch(box, T.hit); ripple(c, 795, 495, T.hit, 3, col); snd('hit', T.hit);
  if (s.move) mv.lead(bizLine(c, s.move, 880, o.ink), T.t0 + .3);
  cardText(c, T, s.lead, s.key, 1290);
});

/* H5: a night of sleep — the light and deep sleep line runs across the night; the hours land on the key word */
PART('FIT', 'h5', {pack: FIT, code: 'FIT-H5', name: 'กราฟการนอน', bgs: ['glow', 'white', 'cream'],
  slots: {hours: {type: 'number'}, unit: {type: 'text', max: 8}, lead: {type: 'text', max: 26}, key: {type: 'text', max: 14}}, dur: [1.6, 4.0],
  hit: 'เส้นการนอนวิ่งถึงเช้า ชั่วโมงนอนหยุดที่ตัวเลขในบท (ถ้าพูด) + วงคลื่น'}, (c, s, T) => {
  const o = ON[T.bg], dark = o.ink === '#FFFFFF', col = fitCol(dark), W = 800, H = 360, x0 = 140, y0 = 380;
  const lv = [0, 2, 3, 3, 2, 1, 2, 3, 2, 1, 1, 2, 1, 0], dx = W / (lv.length - 1);
  const yv = v => v * 100 + 30;
  const path = `M0 ${yv(lv[0])}` + lv.slice(1).map((v, i) => ` H${((i + 1) * dx).toFixed(1)} V${yv(v)}`).join('') + ` H${W}`;
  const g = svg(W, H, [1, 2, 3].map(v => `<path d="M0 ${v * 100 + 30} H${W}" stroke="${o.track}" stroke-width="4"/>`).join('') +
    `<path d="${path}" fill="none" stroke="${col}" stroke-width="14" stroke-linejoin="round" stroke-linecap="round"/>`, `left:${x0}px;top:${y0}px`, c);
  mv.draw(g.querySelectorAll('path')[3], T.t0 + .2, T.hit - T.t0 - .2);
  [['moon', x0 - 10], ['sun', x0 + W - 90]].forEach(([nm, x], i) => { const t = div(`left:${x}px;top:250px;width:100px;height:100px;opacity:0`, c, ico(nm, 100, i ? (dark ? ACC : NAVY) : o.ink, 2.2)); mv.pop(t, i ? T.hit : T.t0 + .05); });
  if (s.hours != null) {
    const w = div('left:80px;width:920px;top:200px;display:flex;justify-content:center', c);
    const h = div(`position:relative;font-family:KeySans;font-size:120px;line-height:1.1;white-space:nowrap;color:${o.ink}`, w);
    const fmt = v => fmtNum(v, decOf(s.hours)) + ' ' + (s.unit ?? 'ชั่วโมง'); h.textContent = fmt(s.hours); fitW(h, 560);
    mv.count(h, T.hit - MOTION.count.d, 0, s.hours, fmt); mv.punch(w, T.hit);
  }
  ripple(c, x0 + W - 40, 300, T.hit, 3, col); snd('hit', T.hit);
  cardText(c, T, s.lead, s.key);
});
