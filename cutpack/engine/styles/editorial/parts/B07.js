/* B07 ปัญหา / คำเตือน — a risk, mistake or warning. Red is allowed here: it is the negative meaning. */
const B07_SLOTS = {
  text:  {type: 'text', max: 18, req: true},                   // the problem, in the speaker's words
  icon:  {type: 'icon', req: true},                            // what is at risk
  level: {type: 'choice', of: ['mid', 'high']},                // v4 only; default high
  lead:  {type: 'text', max: 26},
  key:   {type: 'text', max: 14},
};
const label07 = (c, text, top, color, size = 80) => { const w = div(`left:80px;width:920px;top:${top}px;display:flex;justify-content:center`, c); const t = div(`position:relative;font-family:CardSans;font-size:${size}px;line-height:1.2;white-space:nowrap;color:${color};opacity:0`, w); t.textContent = text; fitW(t, 920); return t; };

/* v1: a red warning triangle pops, ripples red at the key word; the problem written under it */
PART('B07', 'v1', {name: 'ป้ายเตือนสามเหลี่ยม', bgs: ['glow', 'white', 'cream'], slots: B07_SLOTS, dur: [1.0, 3.0],
  hit: 'ป้ายเตือนเด้ง + วงคลื่นสีแดงตรงคำ "ระวัง เสี่ยง"'}, (c, s, T) => {
  const o = ON[T.bg];
  const w = tile(c, 'triangle-alert', T.t0 + .05, 'left:340px;top:300px', {size: 400, bg: RED, color: '#fff', icon: .58, sound: false});
  tile(c, s.icon, T.t0 + .2, 'left:120px;top:210px', {size: 160, bg: o.sub === 'glass' ? 'glass' : o.sub, color: o.ink, sound: false});
  mv.punch(w.inner, T.hit); ripple(c, 540, 500, T.hit, 4, RED); snd('hit', T.hit);
  mv.lead(label07(c, s.text, 800, o.ink), T.t0 + .3);
  cardText(c, T, s.lead, s.key, 1260);
});

/* v2: the topic icon on a tile; a crack draws across it at the key word and the tile tilts */
PART('B07', 'v2', {name: 'ไอคอนเรื่องแตกร้าว', bgs: ['glow', 'cream', 'white'], slots: B07_SLOTS, dur: [1.2, 3.0],
  hit: 'รอยร้าวสีแดงวิ่งผ่านไอคอน แล้วกล่องเอียงลง'}, (c, s, T) => {
  const o = ON[T.bg];
  const w = div('left:330px;top:300px;width:420px;height:420px', c);
  const t = tile(w, s.icon, T.t0 + .05, 'left:0;top:0', {size: 420, bg: o.tile, color: o.tileInk, icon: .55, sound: false, float: false});
  const crack = svg(420, 420, `<path d="M120 0 L170 120 L130 190 L230 270 L200 340 L260 420" fill="none" stroke="${RED}" stroke-width="16" stroke-linejoin="round" stroke-linecap="round"/>`, 'left:0;top:0', w);
  mv.draw(crack.querySelector('path'), T.hit - .1, .3);
  mv.slide(w, T.hit + .15, 'rotate(0deg) translateY(0)', 'rotate(6deg) translateY(24px)');
  snd('cross', T.hit);
  mv.lead(label07(c, s.text, 820, o.ink), T.t0 + .3);
  cardText(c, T, s.lead, s.key, 1260);
});

/* v3: a phone-style alert slides down from the top: red bell, the problem as its title */
PART('B07', 'v3', {name: 'การ์ดแจ้งเตือนแบบหน้าจอมือถือ', bgs: ['glow', 'white', 'cream'], slots: B07_SLOTS, dur: [1.2, 3.5],
  hit: 'แจ้งเตือนเด้ง + จุดแดงขึ้นตรงคำ'}, (c, s, T) => {
  const light = T.bg !== 'glow', ink = light ? NAVY : '#fff';
  const p = div(`left:90px;top:420px;width:900px;height:260px;border-radius:52px;opacity:0;` + (light ? 'background:#FFFFFF;box-shadow:0 30px 70px rgba(20,33,61,.22)' : 'background:rgba(255,255,255,.12);border:2px solid rgba(255,255,255,.2);box-shadow:0 30px 70px rgba(0,0,0,.5)'), c);
  mv.rise(p, T.t0 + .05, -200);
  const b = div(`left:44px;top:60px;width:140px;height:140px;border-radius:36px;background:${RED};display:flex;align-items:center;justify-content:center`, p, ico('bell', 80, '#fff', 2.2));
  const tt = div(`left:220px;top:58px;width:620px;font-family:KeySans;font-size:66px;line-height:1.2;white-space:nowrap;color:${ink}`, p); tt.textContent = s.text; fitW(tt, 620);
  skel(p, 'left:222px;top:160px;width:600px', [.7], {color: light ? 'rgba(20,33,61,.12)' : 'rgba(255,255,255,.18)', h: 18, t: T.t0 + .3});
  const dot = div(`left:160px;top:42px;width:44px;height:44px;border-radius:50%;background:${RED};border:5px solid ${light ? '#fff' : INK};opacity:0`, p);
  mv.pop(dot, T.hit); mv.punch(p, T.hit); snd('hit', T.hit);
  tile(c, s.icon, T.t0 + .35, 'left:450px;top:760px', {size: 180, bg: light ? ON[T.bg].sub : 'glass', color: light ? NAVY : '#fff', sound: false});
  cardText(c, T, s.lead, s.key, 1260);
});

/* v4: a risk bar from low to high — the fill runs up to the level and turns red at the key word */
PART('B07', 'v4', {name: 'แถบความเสี่ยงจากต่ำไปสูง', bgs: ['glow', 'cream', 'white'], slots: B07_SLOTS, dur: [1.2, 3.5],
  hit: 'แถบวิ่งขึ้นถึงระดับเสี่ยงและเป็นสีแดงตรงคำ'}, (c, s, T) => {
  const o = ON[T.bg], f = s.level === 'mid' ? .6 : .9, W = 760;
  tile(c, s.icon, T.t0 + .05, 'left:440px;top:260px', {size: 200, bg: o.tile, color: o.tileInk, sound: false});
  const track = div(`left:160px;top:580px;width:${W}px;height:70px;border-radius:35px;background:${o.track};overflow:hidden`, c);
  const fill = div(`left:0;top:0;width:${W}px;height:70px;border-radius:35px;background:${ACC};transform-origin:0 50%`, track);
  mv.growX(fill, T.t0 + .2, .3); mv.fallTo(fill, T.hit - .3, .3, f, 0, 'X');
  const red = div(`left:0;top:0;width:${W}px;height:70px;border-radius:35px;background:${RED};transform-origin:0 50%;opacity:0`, track);
  mv.fallTo(red, T.hit - .3, .3, f, 0, 'X'); mv.show(red, T.hit);   // same run as the fill, so the red never leads it
  div('left:80px;top:575px;width:80px;height:80px', c, ico('shield-check', 70, o.soft, 2));
  div('left:930px;top:575px;width:80px;height:80px', c, ico('triangle-alert', 70, RED, 2.2));
  const mark = div(`left:${160 + W * f - 22}px;top:520px;width:44px;height:44px;opacity:0`, c, `<svg width="44" height="44" viewBox="0 0 24 24"><path d="M2 4h20L12 20z" fill="${o.ink}"/></svg>`);
  mv.pop(mark, T.hit); snd('hit', T.hit);
  mv.lead(label07(c, s.text, 760, o.ink), T.t0 + .3);
  cardText(c, T, s.lead, s.key, 1260);
});
