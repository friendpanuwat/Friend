/* B03 เปรียบเทียบ / ก่อนกับหลัง — two things side by side, or the state before and after. */
const B03_SLOTS = {
  a:    {type: 'text', max: 12, req: true},   // left / before
  b:    {type: 'text', max: 12, req: true},   // right / after
  ia:   {type: 'icon', req: true},
  ib:   {type: 'icon', req: true},
  win:  {type: 'choice', of: ['a', 'b', '']}, // the side the speaker favours ('' = no winner)
  rows: {type: 'list', max: 3},               // v3 only: [{t: 'ค่าใช้จ่าย', a: true, b: false}, …] — t ≤ 12 graphemes
  lead: {type: 'text', max: 26},
  key:  {type: 'text', max: 14},
};
const label = (parent, text, css, color, size = 64) => { const l = div(`${css};display:flex;justify-content:center`, parent); const s = div(`position:relative;font-family:CardSans;font-size:${size}px;line-height:1.2;white-space:nowrap;color:${color}`, l); s.textContent = text; fitW(s, parseInt(/width:(\d+)/.exec(css)[1])); return l; };
/* winner pops, loser dims; with no winner both pop */
function verdict(T, s, A_, B_, lx, ly, dark) {          // lx, ly = tile centre inside each side's box
  if (s.win === 'a' || s.win === 'b') {
    const w = s.win === 'a' ? A_ : B_, l = s.win === 'a' ? B_ : A_;
    mv.dim(l, T.hit); mv.punch(w, T.hit); ripple(w, lx, ly, T.hit, 3.4, dark ? ACC : NAVY);
  } else { mv.punch(A_, T.hit); mv.punch(B_, T.hit + .08); }
  snd('hit', T.hit);
}

/* v1: two columns with a "vs" disc in the middle */
PART('B03', 'v1', {name: 'แบ่งซ้ายขวา + vs', bgs: ['glow', 'white', 'cream'], slots: B03_SLOTS, dur: [1.4, 3.5],
  hit: 'ฝั่งที่ชนะเด้ง + วงคลื่น ฝั่งที่แพ้หรี่ลง'}, (c, s, T) => {
  const o = ON[T.bg], dark = o.ink === '#FFFFFF';
  const col = (x, ic, name, t, main) => { const g = div(`left:${x - 230}px;top:300px;width:460px;height:560px`, c);
    tile(g, ic, t, 'left:100px;top:40px', {size: 260, bg: main ? o.tile : (o.sub === 'glass' ? 'glass' : o.sub), color: main ? o.tileInk : o.ink, sound: false});
    label(g, name, 'left:0;top:360px;width:460px', o.ink); return g; };
  const A_ = col(290, s.ia, s.a, T.t0 + .05, s.win !== 'b'), B_ = col(790, s.ib, s.b, T.t0 + .15, s.win !== 'a');
  const vs = div(`left:465px;top:365px;width:150px;height:150px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:${ACC};font-family:KeySerif;font-size:70px;color:${INK};box-shadow:0 18px 40px rgba(0,0,0,.35)`, c, 'vs');
  mv.pop(vs, T.t0 + .3);
  verdict(T, s, A_, B_, 230, 170, dark);
  cardText(c, T, s.lead, s.key);
});

/* v2: two cards like a hand of cards, tilted; the winner comes forward */
PART('B03', 'v2', {name: 'การ์ดสองใบ ใบที่แพ้หรี่ลง', bgs: ['glow', 'cream'], slots: B03_SLOTS, dur: [1.4, 3.5],
  hit: 'การ์ดที่ชนะเด้ง ใบที่แพ้หรี่และจางสี'}, (c, s, T) => {
  const o = ON[T.bg], dark = o.ink === '#FFFFFF', style = T.bg === 'glow' ? 'glass' : 'white', ink = style === 'glass' ? '#fff' : NAVY;
  const one = (x, rot, ic, name, t, accent) => {
    const r = div(`left:${x}px;top:290px;width:420px;height:600px;transform:rotate(${rot}deg)`, c), h = div('inset:0', r);
    const p = panel(h, 'left:0;top:0;width:420px;height:600px', t, {style, radius: 44});
    tile(p, ic, t + .15, 'left:90px;top:80px', {size: 240, bg: accent ? ACC : (style === 'glass' ? 'glass' : NAVY), color: accent ? INK : '#fff', sound: false, float: false});
    label(p, name, 'left:20px;top:400px;width:380px', ink, 62);
    return h; };
  const A_ = one(110, -6, s.ia, s.a, T.t0 + .05, s.win === 'a'), B_ = one(550, 6, s.ib, s.b, T.t0 + .18, s.win === 'b');
  verdict(T, s, A_, B_, 210, 200, dark);
  cardText(c, T, s.lead, s.key, 1250);
});

/* v3: a two-column table — a check or a cross per row, the winning column lights up */
PART('B03', 'v3', {name: 'ตาราง 2 คอลัมน์ ถูกและผิด', bgs: ['glow', 'white', 'cream'], slots: B03_SLOTS, dur: [1.8, 3.5],
  hit: 'คอลัมน์ที่ชนะมีกรอบสีเน้นขึ้นตรงคำ'}, (c, s, T) => {
  const rows = s.rows ?? []; if (!rows.length) throw new Error('B03.v3 needs rows');
  const o = ON[T.bg], style = T.bg === 'white' ? 'navy' : T.bg === 'glow' ? 'glass' : 'white', ink = style === 'white' ? NAVY : '#fff';
  const H = 250 + rows.length * 150, p = panel(c, `left:90px;top:${600 - H / 2}px;width:900px;height:${H}px`, T.t0 + .05, {style});
  const colX = {a: 470, b: 700};
  if (s.win) { const hl = div(`left:${colX[s.win] - 10}px;top:24px;width:200px;height:${H - 48}px;border-radius:30px;border:6px solid ${ACC};opacity:0`, p); mv.pop(hl, T.hit, 'scale(.9)'); }
  for (const k of ['a', 'b']) {
    const h = div(`left:${colX[k]}px;top:40px;width:180px;display:flex;flex-direction:column;align-items:center;gap:6px;opacity:0`, p, ico(s['i' + k], 100, ink, 2));
    const t = div(`position:relative;font-family:CardSans;font-size:50px;white-space:nowrap;color:${ink}`, h); t.textContent = s[k]; fitW(t, 180);
    mv.pop(h, T.t0 + .2 + (k === 'b') * .08, 'scale(.6)');
  }
  rows.forEach((r, i) => {
    const y = 230 + i * 150, tr = T.t0 + .45 + i * MOTION.stagger * 2;
    div(`left:40px;top:${y - 20}px;width:820px;height:2px;background:${ink};opacity:.14`, p);
    const lb = div(`left:50px;top:${y + 26}px;width:380px;font-family:CardSans;font-size:52px;white-space:nowrap;color:${ink};opacity:0`, p); lb.textContent = r.t; fitW(lb, 380); mv.lead(lb, tr);
    for (const k of ['a', 'b']) { const okk = !!r[k]; const m = div(`left:${colX[k] + 45}px;top:${y + 10}px;width:90px;height:90px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:${okk ? ACC : 'rgba(255,59,48,.16)'};opacity:0`, p, ico(okk ? 'check' : 'x', 56, okk ? INK : RED, 3)); mv.pop(m, tr + .1 + (k === 'b') * .06); }
  });
  snd('hit', T.hit);
  cardText(c, T, s.lead, s.key, 1280);
});

/* v4: before → after — the "after" half is covered, the cover slides away at the key word */
PART('B03', 'v4', {name: 'แถบเลื่อนก่อนไปหลัง', bgs: ['glow', 'cream', 'white'], slots: B03_SLOTS, dur: [1.4, 3.5],
  hit: 'แผ่นปิดเลื่อนออก เผยฝั่ง "หลัง" ตรงคำ'}, (c, s, T) => {
  const o = ON[T.bg], dark = o.ink === '#FFFFFF';
  const fr = div(`left:110px;top:330px;width:860px;height:600px;border-radius:48px;overflow:hidden;box-shadow:0 40px 90px rgba(0,0,0,.35);opacity:0`, c);
  mv.rise(fr, T.t0 + .05);
  const half = (x, bg, ic, icCol, name, nameCol) => { const h = div(`left:${x}px;top:0;width:430px;height:600px;background:${bg}`, fr);
    div('left:115px;top:120px;width:200px;height:200px', h, ico(ic, 200, icCol, 1.8));
    label(h, name, 'left:15px;top:400px;width:400px', nameCol, 60); return h; };
  half(0, dark ? '#1A1F2E' : '#E4E6EC', s.ia, dark ? 'rgba(255,255,255,.7)' : 'rgba(20,33,61,.7)', s.a, dark ? '#fff' : NAVY);
  half(430, ACC, s.ib, INK, s.b, INK);
  const cover = div(`left:430px;top:0;width:430px;height:600px;background:${dark ? '#262C3D' : '#C9CDD6'};display:flex;align-items:center;justify-content:center`, fr, ico('circle-help', 140, dark ? 'rgba(255,255,255,.45)' : 'rgba(20,33,61,.45)', 2));
  const handle = div(`left:422px;top:0;width:16px;height:600px;background:#fff;box-shadow:0 0 24px rgba(0,0,0,.35)`, fr);
  mv.slide(cover, T.hit - .2, 'translateX(0)', 'translateX(480px)'); mv.slide(handle, T.hit - .2, 'translateX(0)', 'translateX(480px)');   // fully out: no sliver at the edge
  const arrow = div('left:490px;top:960px;width:100px;height:100px;opacity:0', c, ico('arrow-right', 100, o.ink, 2.4)); mv.pop(arrow, T.t0 + .3);
  ripple(c, 755, 630, T.hit + .25, 3.4, dark ? ACC : NAVY); snd('swipe', T.hit - .2); snd('hit', T.hit + .25);
  cardText(c, T, s.lead, s.key, 1280);
});
