/* B11 คำพูด / แชต / รีวิว — what someone else said, wrote or rated. Text comes from the script; no real brand logos. */
const B11_SLOTS = {
  text:  {type: 'text', max: 30, req: true},   // the words said / written
  who:   {type: 'text', max: 12},              // "ลูกค้า", "หัวหน้า" — never a real person's name unless said
  stars: {type: 'number'},                     // v2 only: the rating said (1–5)
  lead:  {type: 'text', max: 26},
  key:   {type: 'text', max: 14},
};
const avatar = (parent, css, bg, fg) => { const a = div(`${css};border-radius:50%;background:${bg};overflow:hidden`, parent); person(a, 18, 22, 64 * (parseInt(/width:(\d+)/.exec(css)[1]) / 100), fg); return a; };

/* v1: a chat — their message arrives, then "อ่านแล้ว" and silence (or a reply if the script has one) */
PART('B11', 'v1', {name: 'กล่องแชตมีสถานะอ่านแล้ว', bgs: ['glow', 'cream', 'white'], slots: B11_SLOTS, dur: [1.4, 3.5],
  hit: 'สถานะ "อ่านแล้ว" ขึ้นใต้ข้อความตรงคำ'}, (c, s, T) => {
  const o = ON[T.bg], light = T.bg !== 'glow';
  const ph = panel(c, 'left:140px;top:300px;width:800px;height:600px', T.t0 + .02, {style: light ? 'white' : 'glass', radius: 70});
  const head = div(`left:0;top:0;width:800px;height:160px;display:flex;align-items:center;gap:24px;padding:0 44px;border-bottom:2px solid ${light ? 'rgba(20,33,61,.08)' : 'rgba(255,255,255,.1)'}`, ph);
  avatar(head, 'position:relative;width:100px;height:100px', ACC, INK);
  const nm = div(`position:relative;font-family:CardSans;font-size:56px;color:${light ? NAVY : '#fff'}`, head); nm.textContent = s.who ?? 'ลูกค้า';
  const b = bubble(ph, s.text, T.t0 + .35, 'left:44px;top:230px', {bg: light ? '#EEF0F4' : '#fff', color: INK, size: 62});
  FITS.push(() => { const i = b.inner; if (i.offsetWidth > 700) { i.style.whiteSpace = 'normal'; i.style.width = '700px'; } });
  const seen = div(`left:50px;top:0;font-family:Lead;font-size:44px;color:${light ? 'rgba(20,33,61,.55)' : 'rgba(255,255,255,.6)'};opacity:0;display:flex;gap:10px;align-items:center`, ph, ico('check-check', 48, light ? NAVY : ACC, 2.4) + '<span>อ่านแล้ว</span>');
  FITS.push(() => { seen.style.top = `${b.offsetTop + b.inner.offsetHeight + 24}px`; });
  mv.lead(seen, T.hit); snd('hit', T.hit);
  cardText(c, T, s.lead, s.key, 1260);
});

/* v2: a review card — avatar, who, the stars said light up one by one, the words under them */
PART('B11', 'v2', {name: 'การ์ดรีวิวมีดาว', bgs: ['glow', 'white', 'cream'], slots: B11_SLOTS, dur: [1.4, 3.5],
  hit: 'ดาวติดครบตามจำนวนที่พูดตรงคำ'}, (c, s, T) => {
  if (!(s.stars >= 1 && s.stars <= 5)) throw new Error('B11.v2 needs stars 1–5 (the rating said)');
  const style = T.bg === 'glow' ? 'glass' : T.bg === 'white' ? 'navy' : 'white', ink = style === 'white' ? NAVY : '#fff';
  const p = panel(c, 'left:110px;top:320px;width:860px;height:560px', T.t0 + .02, {style, radius: 48});
  avatar(p, 'left:50px;top:50px;width:130px;height:130px', ACC, INK);
  const nm = div(`left:210px;top:70px;font-family:CardSans;font-size:56px;color:${ink}`, p); nm.textContent = s.who ?? 'ลูกค้า';
  stars(p, 5, s.stars, T.hit - .3 - .12 * s.stars, 'left:50px;top:230px', {size: 110, off: ink === NAVY ? 'rgba(20,33,61,.15)' : 'rgba(255,255,255,.2)'});
  const tx = div(`left:50px;top:400px;width:760px;font-family:CardSans;font-size:56px;line-height:1.3;color:${ink};opacity:0`, p); tx.textContent = `"${s.text}"`;
  FITS.push(() => { if (tx.offsetHeight > 150) tx.style.fontSize = '44px'; });
  mv.lead(tx, T.t0 + .3); snd('hit', T.hit);
  cardText(c, T, s.lead, s.key, 1260);
});

/* v3 was dropped by Friend on 2026-11-03 (คำพูดในเครื่องหมายคำพูดใหญ่); the code is in git history. */
/* v4: a social comment — avatar, who, the comment, a heart that fills on the key word (no platform logo) */
PART('B11', 'v4', {name: 'คอมเมนต์แบบโซเชียล', bgs: ['glow', 'white', 'cream'], slots: B11_SLOTS, dur: [1.2, 3.5],
  hit: 'หัวใจเต็มสีแล้วเด้งตรงคำ'}, (c, s, T) => {
  const light = T.bg !== 'glow', ink = light ? NAVY : '#fff';
  const p = div(`left:90px;top:400px;width:900px;height:330px;border-radius:44px;opacity:0;` + (light ? 'background:#FFFFFF;box-shadow:0 30px 70px rgba(20,33,61,.2)' : 'background:rgba(255,255,255,.1);border:2px solid rgba(255,255,255,.18)'), c);
  mv.rise(p, T.t0 + .02);
  avatar(p, 'left:40px;top:44px;width:110px;height:110px', ACC, INK);
  const nm = div(`left:180px;top:46px;font-family:KeySans;font-size:56px;color:${ink}`, p); nm.textContent = s.who ?? 'ผู้ชม';
  const tx = div(`left:180px;top:120px;width:570px;font-family:CardSans;font-size:58px;line-height:1.3;color:${ink}`, p); tx.textContent = s.text;
  FITS.push(() => { if (tx.offsetHeight > 150) tx.style.fontSize = '42px'; });
  div('left:780px;top:110px;width:90px;height:90px', p, ico('heart', 90, light ? 'rgba(20,33,61,.4)' : 'rgba(255,255,255,.5)', 2));
  const h1 = div('left:780px;top:110px;width:90px;height:90px;opacity:0', p, `<svg width="90" height="90" viewBox="0 0 24 24"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" fill="${ACC}" stroke="${INK}" stroke-width="1"/></svg>`);   // accent, not red: red is kept for negative meaning
  mv.pop(h1, T.hit, 'scale(1.8)'); ripple(p, 825, 155, T.hit, 2.2, light ? NAVY : ACC); snd('hit', T.hit);
  cardText(c, T, s.lead, s.key, 1260);
});
