/* B06 คำถาม / ความสงสัย — a question, often the hook. q = the question shortened from the script. */
const B06_SLOTS = {
  q:    {type: 'text', max: 22, req: true},
  icon: {type: 'icon', req: true},          // what the question is about
  lead: {type: 'text', max: 26},
  key:  {type: 'text', max: 14},
};
const qLine = (c, s, top, color, size = 84) => { const w = div(`left:80px;width:920px;top:${top}px;display:flex;justify-content:center`, c); const q = div(`position:relative;font-family:CardSans;font-size:${size}px;line-height:1.2;white-space:nowrap;color:${color};opacity:0`, w); q.textContent = s.q; fitW(q, 920); return q; };

/* v1: one big question mark tile that wobbles at the end of the question, the topic icon beside it */
PART('B06', 'v1', {name: 'เครื่องหมาย ? ใหญ่ส่าย', bgs: ['glow', 'white', 'cream'], slots: B06_SLOTS, dur: [1.0, 3.0],
  hit: 'เครื่องหมาย ? ส่ายตรงคำท้ายคำถาม'}, (c, s, T) => {
  const o = ON[T.bg], dark = o.ink === '#FFFFFF';
  const q = tile(c, 'circle-help', T.t0 + .05, 'left:330px;top:290px', {size: 420, bg: ACC, color: INK, icon: .6, sound: false});
  tile(c, s.icon, T.t0 + .2, 'left:120px;top:210px', {size: 160, bg: o.sub === 'glass' ? 'glass' : o.sub, color: o.ink, sound: false});
  mv.wobble(q.inner, T.hit); snd('hit', T.hit);
  mv.lead(qLine(c, s, 820, o.ink), T.t0 + .3);
  cardText(c, T, s.lead, s.key, 1260);
});

/* v2: a question typed into a message box, letter by letter; a ? badge pops at the end */
PART('B06', 'v2', {name: 'กล่องคำถามพิมพ์ทีละตัว', bgs: ['glow', 'cream', 'white'], slots: B06_SLOTS, dur: [1.4, 3.5],
  hit: 'พิมพ์จบตรงคำท้ายคำถาม แล้วป้าย ? เด้ง'}, (c, s, T) => {
  const style = T.bg === 'glow' ? 'glass' : T.bg === 'white' ? 'navy' : 'white', ink = style === 'white' ? NAVY : '#fff';
  const p = panel(c, 'left:100px;top:380px;width:880px;height:420px', T.t0 + .02, {style});
  tile(p, s.icon, T.t0 + .15, 'left:50px;top:50px', {size: 130, bg: ACC, color: INK, sound: false, float: false});
  skel(p, 'left:210px;top:78px;width:300px', [.9, .6], {color: style === 'white' ? 'rgba(20,33,61,.12)' : 'rgba(255,255,255,.16)', h: 20, t: T.t0 + .2});
  const box = div(`left:50px;top:220px;width:780px;height:150px;border-radius:30px;background:${style === 'white' ? '#F1F3F7' : 'rgba(255,255,255,.08)'};display:flex;align-items:center;padding:0 34px;overflow:hidden`, p);
  const n = graphemes(s.q).length, step = Math.min(MOTION.type.step, Math.max(.02, (T.hit - T.t0 - .45) / n));
  const typed = chunk(box, s.q, 'm', T.t0 + .4, {type: true, step, color: ink, size: 64});
  fitW(typed, 700);
  const badge = div(`left:820px;top:330px;width:120px;height:120px;border-radius:50%;background:${ACC};display:flex;align-items:center;justify-content:center;font-family:KeySans;font-size:84px;color:${INK};box-shadow:0 18px 40px rgba(0,0,0,.35);opacity:0`, c, '?');
  mv.pop(badge, T.hit); snd('hit', T.hit);
  cardText(c, T, s.lead, s.key, 1250);
});

/* v3: the topic icon in the middle, small question marks pop up around it, a big one lands at the hit */
PART('B06', 'v3', {name: 'ไอคอนเรื่องมี ? ลอยรอบ', bgs: ['glow', 'cream', 'white'], slots: B06_SLOTS, dur: [1.2, 3.5],
  hit: 'เครื่องหมาย ? ตัวใหญ่เด้งตรงคำถาม'}, (c, s, T) => {
  const o = ON[T.bg], dark = o.ink === '#FFFFFF';
  const main = tile(c, s.icon, T.t0 + .05, 'left:380px;top:400px', {size: 320, bg: o.tile, color: o.tileInk, sound: false});
  [[220, 300, 90, -12], [800, 330, 80, 14], [180, 760, 70, 10], [830, 740, 96, -8]].forEach(([x, y, z, r], k) => {
    const m = div(`left:${x}px;top:${y}px;width:${z}px;height:${z}px;display:flex;align-items:center;justify-content:center;font-family:KeySans;font-size:${z}px;line-height:1;color:${dark ? 'rgba(255,255,255,.55)' : 'rgba(20,33,61,.4)'};transform:rotate(${r}deg);opacity:0`, c, '?');
    mv.pop(m, T.t0 + .3 + k * MOTION.stagger);
  });
  const big = div(`left:640px;top:300px;width:170px;height:170px;border-radius:50%;background:${ACC};display:flex;align-items:center;justify-content:center;font-family:KeySans;font-size:120px;color:${INK};box-shadow:0 20px 50px rgba(0,0,0,.35);opacity:0`, c, '?');
  mv.pop(big, T.hit); mv.punch(main.inner, T.hit); snd('hit', T.hit);
  mv.lead(qLine(c, s, 900, o.ink, 76), T.t0 + .3);
  cardText(c, T, s.lead, s.key, 1260);
});

/* v4: a search bar — the question types itself in, results load under it at the hit */
PART('B06', 'v4', {name: 'ช่องค้นหาพิมพ์คำถามเอง', bgs: ['glow', 'white', 'cream'], slots: B06_SLOTS, dur: [1.4, 3.5],
  hit: 'พิมพ์จบแล้วผลค้นหาโหลดขึ้นตรงคำ'}, (c, s, T) => {
  const o = ON[T.bg], light = T.bg !== 'glow';
  const bar = div(`left:90px;top:420px;width:900px;height:150px;border-radius:999px;display:flex;align-items:center;gap:26px;padding:0 44px;overflow:hidden;opacity:0;` +
    (light ? 'background:#FFFFFF;box-shadow:0 26px 60px rgba(20,33,61,.18)' : 'background:rgba(255,255,255,.1);border:2px solid rgba(255,255,255,.2)'), c, ico('search', 70, light ? NAVY : '#fff', 2.4));
  mv.rise(bar, T.t0 + .05);
  const n = graphemes(s.q).length, step = Math.min(MOTION.type.step, Math.max(.02, (T.hit - T.t0 - .45) / n));
  const typed = chunk(bar, s.q, 'm', T.t0 + .4, {type: true, step, color: light ? NAVY : '#fff', size: 62});
  fitW(typed, 720);
  const res = div('left:90px;top:620px;width:900px;height:360px', c);
  [0, 1, 2].forEach(k => {
    const r = div(`left:0;top:${k * 120}px;width:900px;height:100px;border-radius:28px;display:flex;align-items:center;gap:26px;padding:0 30px;opacity:0;background:${light ? '#FFFFFF' : 'rgba(255,255,255,.06)'}`, res);
    div(`position:relative;width:60px;height:60px;border-radius:18px;flex:none;background:${k ? o.track : ACC}`, r);
    skel(r, 'position:relative;width:600px', [k ? .7 : .9, .45], {color: light ? 'rgba(20,33,61,.12)' : 'rgba(255,255,255,.16)', h: 16, gap: 14});
    mv.rise(r, T.hit + k * MOTION.stagger, 40);
  });
  snd('hit', T.hit);
  cardText(c, T, s.lead, s.key, 1260);
});
