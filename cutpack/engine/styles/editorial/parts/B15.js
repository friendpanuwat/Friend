/* B15 ปิดคลิป / ชวนทำต่อ — the closing ask: follow, comment, save or share. Plain UI words, no platform logos,
   and nothing in the right-hand strip where the app's own buttons sit (x > 940). */
const B15_SLOTS = {
  action: {type: 'choice', of: ['follow', 'comment', 'save', 'share'], req: true},
  text:   {type: 'text', max: 22, req: true},   // the ask in the speaker's words
  points: {type: 'list', max: 3},              // v4: up to three short words that sum up the clip
  lead:   {type: 'text', max: 26},
  key:    {type: 'text', max: 14},
};
const ACT = {follow: ['user-plus', 'ติดตาม'], comment: ['message-circle', 'คอมเมนต์'], save: ['bookmark', 'บันทึก'], share: ['send', 'แชร์']};
const askLine = (c, s, top, color, size = 80) => { const w = div(`left:80px;width:860px;top:${top}px;display:flex;justify-content:center`, c); const e = div(`position:relative;font-family:CardSans;font-size:${size}px;line-height:1.2;white-space:nowrap;color:${color};opacity:0`, w); e.textContent = s.text; fitW(e, 860); return e; };

/* v1: a big action button; a cursor glides in and presses it on the key word, the icon turns into a check */
PART('B15', 'v1', {name: 'ปุ่มถูกกด', bgs: ['glow', 'cream', 'white'], slots: B15_SLOTS, dur: [1.4, 3.5],
  hit: 'เคอร์เซอร์กดปุ่มตรงคำ "กด ติดตาม" แล้วไอคอนเปลี่ยนเป็นเครื่องหมายถูก'}, (c, s, T) => {
  const o = ON[T.bg], [ic, word] = ACT[s.action];
  const btn = div(`left:200px;top:470px;width:640px;height:190px;border-radius:999px;background:${ACC};display:flex;align-items:center;justify-content:center;gap:30px;box-shadow:0 30px 70px rgba(0,0,0,.35);opacity:0`, c);
  const icw = div('position:relative;width:110px;height:110px', btn);
  const i0 = div('left:0;top:0;width:110px;height:110px', icw, ico(ic, 110, INK, 2.4));
  const i1 = div(`left:-10px;top:-10px;width:130px;height:130px;display:flex;align-items:center;justify-content:center;background:${ACC};opacity:0`, icw, ico('check', 110, INK, 3));   // covers the old icon, no overlap
  const w = div('position:relative;font-family:KeySans;font-size:96px;color:' + INK, btn); w.textContent = word;
  mv.chip(btn, T.t0 + .05);
  cursor(c, [[T.hit - .6, 880, 900], [T.hit - .05, 600, 560], [T.hit + .55, 880, 560]], [T.hit]);   // leaves the button to the right, clear of the text under it
  mv.dim(i0, T.hit); mv.pop(i1, T.hit + .02, 'scale(.3)'); mv.punch(btn, T.hit);
  snd('hit', T.hit);
  mv.lead(askLine(c, s, 820, o.ink), T.t0 + .3);
  cardText(c, T, s.lead, s.key, 1260);
});

/* v2: a comment box — the ask types itself in, the send button lights up on the key word */
PART('B15', 'v2', {name: 'กล่องคอมเมนต์พิมพ์เอง', bgs: ['glow', 'white', 'cream'], slots: B15_SLOTS, dur: [1.4, 3.5],
  hit: 'พิมพ์จบแล้วปุ่มส่งสว่างตรงคำ'}, (c, s, T) => {
  const light = T.bg !== 'glow';
  const bar = div(`left:90px;top:480px;width:840px;height:160px;border-radius:999px;display:flex;align-items:center;gap:24px;padding:0 30px 0 50px;overflow:hidden;opacity:0;` +
    (light ? 'background:#FFFFFF;box-shadow:0 26px 60px rgba(20,33,61,.18)' : 'background:rgba(255,255,255,.1);border:2px solid rgba(255,255,255,.2)'), c);
  mv.rise(bar, T.t0 + .05);
  const box = div('position:relative;flex:1;min-width:0;overflow:hidden', bar);
  const n = graphemes(s.text).length, step = Math.min(MOTION.type.step, Math.max(.02, (T.hit - T.t0 - .45) / n));
  const typed = chunk(box, s.text, 'm', T.t0 + .4, {type: true, step, color: light ? NAVY : '#fff', size: 58}); fitW(typed, 600);
  const send = div(`position:relative;flex:none;width:110px;height:110px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:${light ? '#E4E7EE' : 'rgba(255,255,255,.14)'}`, bar, ico('send', 58, light ? NAVY : '#fff', 2.4));
  const lit = div(`left:0;top:0;width:110px;height:110px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:${ACC};opacity:0`, send, ico('send', 58, INK, 2.4));
  mv.pop(lit, T.hit, 'scale(.4)'); snd('hit', T.hit);
  tile(c, ACT[s.action][0], T.t0 + .2, 'left:440px;top:240px', {size: 180, bg: light ? ON[T.bg].tile : 'glass', color: light ? '#fff' : '#fff', sound: false});
  cardText(c, T, s.lead, s.key, 1260);
});

/* v3: the action's icon alone, outlined; it fills with the accent on the key word */
PART('B15', 'v3', {name: 'ไอคอนการกระทำโดนกด', bgs: ['glow', 'cream', 'white'], slots: B15_SLOTS, dur: [1.0, 3.0],
  hit: 'ไอคอนเต็มสีเน้นแล้วเด้ง + วงคลื่นตรงคำ'}, (c, s, T) => {
  const o = ON[T.bg], dark = o.ink === '#FFFFFF', ic = ACT[s.action][0];
  const off = tile(c, ic, T.t0 + .05, 'left:340px;top:300px', {size: 400, bg: o.sub === 'glass' ? 'glass' : o.sub, color: o.ink, icon: .55, sound: false, float: false});
  const on = tile(c, ic, T.hit, 'left:340px;top:300px', {size: 400, bg: ACC, color: INK, icon: .55, sound: false, float: false});
  ripple(c, 540, 500, T.hit, 4, dark ? ACC : NAVY); snd('hit', T.hit);
  mv.lead(askLine(c, s, 800, o.ink), T.t0 + .3);
  cardText(c, T, s.lead, s.key, 1260);
});

/* v4: the clip summed up in up to three words, then the closing action tile on the key word */
PART('B15', 'v4', {name: 'สรุป 3 คำแล้วการ์ดปิด', bgs: ['glow', 'white', 'cream'], slots: B15_SLOTS, dur: [1.6, 4.0],
  hit: 'คำสรุปขึ้นทีละคำ แล้วปุ่มการกระทำเด้งตรงคำ'}, (c, s, T) => {
  const pts = s.points ?? []; if (pts.length < 2) throw new Error('B15.v4 needs 2–3 points');
  const o = ON[T.bg], dark = o.ink === '#FFFFFF', [ic, word] = ACT[s.action];
  pts.forEach((p, i) => {
    const w = div(`left:80px;width:860px;top:${260 + i * 150}px;display:flex;justify-content:center`, c);
    const e = div(`position:relative;font-family:KeySans;font-size:104px;line-height:1.15;letter-spacing:-2px;white-space:nowrap;color:${i === pts.length - 1 ? (dark ? ACC : NAVY) : o.ink};opacity:0`, w); e.textContent = p; fitW(e, 860);
    mv.key(e, T.t0 + .15 + (T.hit - T.t0 - .6) * i / Math.max(1, pts.length - 1));
  });
  const btn = div(`left:270px;top:${300 + pts.length * 150}px;width:500px;height:150px;border-radius:999px;background:${ACC};display:flex;align-items:center;justify-content:center;gap:24px;box-shadow:0 26px 60px rgba(0,0,0,.35);opacity:0`, c, ico(ic, 80, INK, 2.4));
  const bw = div('position:relative;font-family:KeySans;font-size:76px;color:' + INK, btn); bw.textContent = word;
  mv.chip(btn, T.hit); mv.punch(btn, T.hit + .3); snd('hit', T.hit);
  cardText(c, T, s.lead, s.key, 1290);
});
