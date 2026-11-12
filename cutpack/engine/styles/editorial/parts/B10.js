/* B10 คน / กลุ่มเป้าหมาย — a group of people, a customer type, a team, two people. Flat solid figures, never photos. */
const B10_SLOTS = {
  who:    {type: 'text', max: 16, req: true},     // "ลูกค้าวัย 25–35", "ทีม 5 คน"
  n:      {type: 'number'},                       // only if a head count was said (v4 shows that many, up to 12)
  traits: {type: 'list', max: 3},                 // v2: up to 3 short traits from the script, ≤ 12 graphemes each
  link:   {type: 'icon'},                         // v3: what joins the two people (default heart-handshake)
  lead:   {type: 'text', max: 26},
  key:    {type: 'text', max: 14},
};
/* a flat person: round head + rounded shoulders, one solid colour */
const person = (parent, x, y, size, color) => div(`left:${x}px;top:${y}px;width:${size}px;height:${size * 1.25}px`, parent,
  `<svg width="${size}" height="${size * 1.25}" viewBox="0 0 80 100"><circle cx="40" cy="26" r="20" fill="${color}"/><path d="M6 100 V80 a34 34 0 0 1 68 0 V100 Z" fill="${color}"/></svg>`);
const whoLine = (c, s, top, color, size = 84) => { const w = div(`left:80px;width:920px;top:${top}px;display:flex;justify-content:center`, c); const e = div(`position:relative;font-family:CardSans;font-size:${size}px;line-height:1.2;white-space:nowrap;color:${color};opacity:0`, w); e.textContent = s.who; fitW(e, 920); return e; };

/* v1: a crowd of twelve; the one being talked about lights up in the accent on the key word */
PART('B10', 'v1', {name: 'กลุ่มคน หนึ่งคนถูกไฮไลต์', bgs: ['glow', 'cream', 'white'], slots: B10_SLOTS, dur: [1.2, 3.5],
  hit: 'คนที่ถูกพูดถึงสว่างเป็นสีเน้น + วงคลื่น'}, (c, s, T) => {
  const o = ON[T.bg], dark = o.ink === '#FFFFFF', dim = dark ? 'rgba(255,255,255,.28)' : 'rgba(20,33,61,.22)', pick = 6;
  for (let i = 0; i < 12; i++) {
    const x = 150 + (i % 4) * 200, y = 260 + Math.floor(i / 4) * 200;
    const p = person(c, x, y, 140, dim); p.style.opacity = 0; mv.pop(p, T.t0 + .05 + i * .03, 'scale(.5)');
    if (i === pick) { const on = person(c, x, y, 140, dark ? ACC : NAVY); on.style.opacity = 0; mv.pop(on, T.hit, 'scale(1.4)'); ripple(c, x + 70, y + 90, T.hit, 2.6, dark ? ACC : NAVY); }
  }
  snd('hit', T.hit);
  mv.lead(whoLine(c, s, 900, o.ink), T.t0 + .3);
  cardText(c, T, s.lead, s.key, 1260);
});

/* v2: a profile card — avatar, who, and up to three trait chips rising one by one */
PART('B10', 'v2', {name: 'การ์ดโปรไฟล์ลูกค้า', bgs: ['glow', 'white', 'cream'], slots: B10_SLOTS, dur: [1.4, 3.5],
  hit: 'การ์ดเด้งเมื่อชิปลักษณะครบตรงคำ'}, (c, s, T) => {
  const style = T.bg === 'glow' ? 'glass' : T.bg === 'white' ? 'navy' : 'white', ink = style === 'white' ? NAVY : '#fff';
  const tr = s.traits ?? [], H = 330 + (tr.length > 2 ? 230 : tr.length ? 150 : 0);   // room for a second row of chips
  const p = panel(c, `left:130px;top:300px;width:820px;height:${H}px`, T.t0 + .02, {style, radius: 48});
  const av = div(`left:50px;top:50px;width:200px;height:200px;border-radius:50%;background:${ACC};overflow:hidden`, p); person(av, 30, 40, 140, INK);
  const nm = div(`left:290px;top:80px;width:480px;font-family:KeySans;font-size:72px;line-height:1.2;white-space:nowrap;color:${ink}`, p); nm.textContent = s.who; fitW(nm, 480);
  skel(p, 'left:292px;top:190px;width:440px', [.75], {color: ink === NAVY ? 'rgba(20,33,61,.12)' : 'rgba(255,255,255,.16)', h: 18, t: T.t0 + .2});
  const row = div('left:50px;top:300px;width:720px;display:flex;flex-wrap:wrap;gap:16px', p);
  tr.forEach((t, i) => {
    const ch = div(`position:relative;padding:12px 30px 16px;border-radius:999px;font-family:CardSans;font-size:46px;white-space:nowrap;opacity:0;background:${i === tr.length - 1 ? ACC : (ink === NAVY ? '#EEF0F4' : 'rgba(255,255,255,.12)')};color:${i === tr.length - 1 ? INK : ink}`, row);
    ch.textContent = t; mv.chip(ch, T.t0 + .4 + (T.hit - T.t0 - .4) * (tr.length === 1 ? 1 : i / (tr.length - 1)));
  });
  mv.punch(p, T.hit + .05); snd('hit', T.hit);
  cardText(c, T, s.lead, s.key, 1260);
});

/* v3: two people — a line draws between them on the key word, the link icon pops in the middle */
PART('B10', 'v3', {name: 'คนสองคนมีเส้นเชื่อม', bgs: ['glow', 'cream', 'white'], slots: B10_SLOTS, dur: [1.2, 3.5],
  hit: 'เส้นเชื่อมวาดถึงอีกฝั่ง แล้วไอคอนตรงกลางเด้ง'}, (c, s, T) => {
  const o = ON[T.bg], dark = o.ink === '#FFFFFF', col = dark ? ACC : NAVY;
  const a = div('left:110px;top:360px;width:260px;height:260px;border-radius:50%;opacity:0;background:' + (dark ? 'rgba(255,255,255,.1)' : '#FFFFFF') + ';box-shadow:0 26px 60px rgba(0,0,0,.25);overflow:hidden', c); person(a, 50, 60, 160, o.ink);
  const b = div('left:710px;top:360px;width:260px;height:260px;border-radius:50%;opacity:0;background:' + ACC + ';box-shadow:0 26px 60px rgba(0,0,0,.25);overflow:hidden', c); person(b, 50, 60, 160, INK);
  mv.pop(a, T.t0 + .05); mv.pop(b, T.t0 + .15);
  const ln = svg(340, 30, `<path d="M0 15 H340" stroke="${col}" stroke-width="12" stroke-linecap="round" stroke-dasharray="1"/>`, 'left:370px;top:475px', c);
  mv.draw(ln.querySelector('path'), T.hit - .45, .45);
  const mid = div(`left:470px;top:420px;width:140px;height:140px;border-radius:50%;background:${dark ? '#fff' : NAVY};display:flex;align-items:center;justify-content:center;box-shadow:0 18px 40px rgba(0,0,0,.35);opacity:0`, c, ico(s.link ?? 'heart-handshake', 80, dark ? INK : '#fff', 2.2));
  mv.pop(mid, T.hit); snd('hit', T.hit);
  mv.lead(whoLine(c, s, 760, o.ink), T.t0 + .3);
  cardText(c, T, s.lead, s.key, 1260);
});

/* v4: people join one by one until the count said is reached (only with n) */
PART('B10', 'v4', {name: 'จำนวนคนค่อย ๆ เพิ่มขึ้น', bgs: ['glow', 'white', 'cream'], slots: B10_SLOTS, dur: [1.4, 4.0],
  hit: 'คนสุดท้ายเข้ามาครบจำนวนตรงคำ'}, (c, s, T) => {
  if (!(s.n >= 2 && s.n <= 12)) throw new Error('B10.v4 needs n between 2 and 12 (the head count said)');
  const o = ON[T.bg], dark = o.ink === '#FFFFFF', col = dark ? ACC : NAVY, n = s.n, cols = n <= 4 ? n : n <= 8 ? 4 : 6, rows = Math.ceil(n / cols), sz = cols > 4 ? 120 : 150;
  const gx = sz + 30, gy = sz * 1.25 + 30, x0 = 540 - (cols * gx - 30) / 2, y0 = 640 - (rows * gy - 30) / 2;
  for (let i = 0; i < n; i++) {
    const r = Math.floor(i / cols), inRow = r === rows - 1 ? n - r * cols : cols, xr = 540 - (inRow * gx - 30) / 2;   // last row centred
    const p = person(c, xr + (i % cols) * gx, y0 + r * gy, sz, i === n - 1 ? col : o.ink); p.style.opacity = 0;
    mv.pop(p, T.t0 + .2 + (T.hit - T.t0 - .2) * i / (n - 1), 'translateY(60px) scale(.6)');
  }
  snd('hit', T.hit);
  mv.lead(whoLine(c, s, 960, o.ink), T.t0 + .3);
  cardText(c, T, s.lead, s.key, 1270);
});
