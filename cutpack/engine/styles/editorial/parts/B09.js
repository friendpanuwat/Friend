/* B09 เวลา / ไทม์ไลน์ / เส้นตาย — a span of time, a deadline, or a sequence in time. `when` is said in the script. */
const B09_SLOTS = {
  when:   {type: 'text', max: 14, req: true},      // "30 วัน", "วันละ 15 นาที", "30 ปี"
  icon:   {type: 'icon'},
  points: {type: 'list', max: 4},                  // v3: 2–4 moments on the line, e.g. ["วันแรก", "สัปดาห์ 2", "เดือนที่ 3"]
  lead:   {type: 'text', max: 26},
  key:    {type: 'text', max: 14},
};
const whenLine = (c, s, top, color, size = 128) => { const w = div(`left:80px;width:920px;top:${top}px;display:flex;justify-content:center`, c); const e = div(`position:relative;font-family:KeySans;font-size:${size}px;line-height:1.15;letter-spacing:-3px;white-space:nowrap;color:${color};opacity:0`, w); e.textContent = s.when; fitW(e, 920); return e; };

/* v1: a clock — the long hand sweeps a full turn and stops on the key word */
PART('B09', 'v1', {name: 'นาฬิกาเข็มหมุน', bgs: ['glow', 'white', 'cream'], slots: B09_SLOTS, dur: [1.2, 3.5],
  hit: 'เข็มยาวหมุนครบรอบแล้วหยุดตรงคำบอกเวลา'}, (c, s, T) => {
  const o = ON[T.bg], dark = o.ink === '#FFFFFF', col = dark ? ACC : NAVY, cx = 540, cy = 560, R = 270;
  const face = div(`left:${cx - R}px;top:${cy - R}px;width:${R * 2}px;height:${R * 2}px;border-radius:50%;opacity:0;` + (dark ? 'background:rgba(255,255,255,.06);border:14px solid rgba(255,255,255,.85)' : `background:#FFFFFF;border:14px solid ${NAVY};box-shadow:0 30px 70px rgba(20,33,61,.2)`), c);
  for (let k = 0; k < 12; k++) div(`left:${R - 7}px;top:22px;width:14px;height:${k % 3 ? 26 : 46}px;border-radius:7px;background:${o.ink};opacity:${k % 3 ? .35 : .9};transform-origin:7px ${R - 22}px;transform:rotate(${k * 30}deg)`, face);
  mv.pop(face, T.t0 + .05, 'scale(.6)');
  const hour = div(`left:${cx - 11}px;top:${cy - 150}px;width:22px;height:150px;border-radius:11px;background:${o.ink};transform-origin:50% 100%;transform:rotate(120deg)`, c);
  const min = div(`left:${cx - 8}px;top:${cy - 220}px;width:16px;height:220px;border-radius:8px;background:${col};transform-origin:50% 100%`, c);
  mv.show(hour, T.t0 + .1); mv.show(min, T.t0 + .1);
  mv.slide(min, T.hit - MOTION.slide.d, 'rotate(0deg)', 'rotate(360deg)');
  const hub = div(`left:${cx - 26}px;top:${cy - 26}px;width:52px;height:52px;border-radius:50%;background:${col};border:6px solid ${dark ? INK : '#fff'}`, c); mv.show(hub, T.t0 + .1);
  mv.key(whenLine(c, s, 880, col), T.hit); snd('hit', T.hit);
  cardText(c, T, s.lead, s.key, 1260);
});

/* v2: a calendar page — days get ticked off, the last one is circled on the key word */
PART('B09', 'v2', {name: 'ปฏิทินขีดวัน', bgs: ['glow', 'cream', 'white'], slots: B09_SLOTS, dur: [1.4, 3.5],
  hit: 'วันสุดท้ายถูกวงกลมสีเน้นตรงคำ'}, (c, s, T) => {
  const style = T.bg === 'glow' ? 'glass' : 'white', ink = style === 'white' ? NAVY : '#fff';
  const p = panel(c, 'left:170px;top:250px;width:740px;height:640px', T.t0 + .02, {style, radius: 44});
  div(`left:0;top:0;width:740px;height:120px;background:${ACC};display:flex;align-items:center;justify-content:center`, p, ico(s.icon ?? 'calendar', 70, INK, 2.4));
  const N = 21, last = N - 1;
  for (let d = 0; d < N; d++) {
    const x = 50 + (d % 7) * 92, y = 160 + Math.floor(d / 7) * 140;
    div(`left:${x}px;top:${y}px;width:80px;height:80px;border-radius:24px;background:${ink === NAVY ? 'rgba(20,33,61,.07)' : 'rgba(255,255,255,.08)'}`, p);
    if (d < last) { const m = div(`left:${x}px;top:${y}px;width:80px;height:80px;display:flex;align-items:center;justify-content:center;opacity:0`, p, ico('x', 50, ink === NAVY ? 'rgba(20,33,61,.45)' : 'rgba(255,255,255,.5)', 2.6)); mv.pop(m, T.t0 + .35 + d * ((T.hit - T.t0 - .6) / last), 'scale(1.5)'); }
    else { const r = div(`left:${x - 10}px;top:${y - 10}px;width:100px;height:100px;border-radius:50%;border:8px solid ${ACC};box-shadow:0 0 0 4px ${INK} inset;opacity:0`, p); mv.pop(r, T.hit, 'scale(1.6)'); }
  }
  snd('hit', T.hit);
  mv.key(whenLine(c, s, 940, ink === NAVY ? NAVY : ACC, 112), T.hit + .05);
  cardText(c, T, s.lead, s.key, 1270);
});

/* v3: a time line — 2–4 moments light up one after another, the last on the key word */
PART('B09', 'v3', {name: 'เส้นเวลามีจุด', bgs: ['glow', 'white', 'cream'], slots: B09_SLOTS, dur: [1.4, 4.0],
  hit: 'จุดสุดท้ายบนเส้นเวลาเด้งตรงคำ'}, (c, s, T) => {
  const o = ON[T.bg], dark = o.ink === '#FFFFFF', col = dark ? ACC : NAVY;
  const pts = s.points?.length >= 2 ? s.points : null; if (!pts) throw new Error('B09.v3 needs 2–4 points');
  const n = pts.length, x0 = 150, x1 = 930, y = 560, at = pts.map((_, i) => T.t0 + .3 + (T.hit - T.t0 - .3) * i / (n - 1));
  const ln = svg(x1 - x0, 20, `<path d="M0 10 H${x1 - x0}" stroke="${o.track}" stroke-width="12" stroke-linecap="round"/><path d="M0 10 H${x1 - x0}" stroke="${col}" stroke-width="12" stroke-linecap="round"/>`, `left:${x0}px;top:${y - 10}px`, c);
  mv.show(ln, T.t0 + .05); mv.draw(ln.querySelectorAll('path')[1], at[0], at[n - 1] - at[0] + .01);
  pts.forEach((t, i) => {
    const x = x0 + (x1 - x0) * i / (n - 1), lastP = i === n - 1;
    const d = div(`left:${x - 42}px;top:${y - 42}px;width:84px;height:84px;border-radius:50%;background:${lastP ? ACC : col};border:8px solid ${dark ? INK : '#fff'};opacity:0`, c); mv.pop(d, at[i]);
    const lb = div(`left:${x - 150}px;top:${i % 2 ? y + 70 : y - 150}px;width:300px;text-align:center;font-family:CardSans;font-size:${lastP ? 60 : 52}px;white-space:nowrap;color:${o.ink};opacity:0`, c); lb.textContent = t; fitW(lb, 300); mv.lead(lb, at[i] + .05);
  });
  ripple(c, x1, y, T.hit, 3, col); snd('hit', T.hit);
  mv.key(whenLine(c, s, 860, col, 112), T.hit + .05);
  cardText(c, T, s.lead, s.key, 1270);
});

/* v4: an hourglass turns over on the key word, the time said under it */
PART('B09', 'v4', {name: 'นาฬิกาทรายพลิก', bgs: ['glow', 'cream', 'white'], slots: B09_SLOTS, dur: [1.0, 3.0],
  hit: 'นาฬิกาทรายพลิกครึ่งรอบตรงคำ'}, (c, s, T) => {
  const o = ON[T.bg], dark = o.ink === '#FFFFFF';
  const w = div('left:330px;top:300px;width:420px;height:420px', c);
  tile(w, 'hourglass', T.t0 + .05, 'left:0;top:0', {size: 420, bg: ACC, color: INK, icon: .58, sound: false, float: false});
  mv.slide(w, T.hit - MOTION.slide.d * .6, 'rotate(0deg)', 'rotate(180deg)');
  if (s.icon) tile(c, s.icon, T.t0 + .2, 'left:120px;top:210px', {size: 150, bg: o.sub === 'glass' ? 'glass' : o.sub, color: o.ink, sound: false});
  snd('swipe', T.hit - .3);
  mv.key(whenLine(c, s, 830, dark ? ACC : NAVY), T.hit);
  cardText(c, T, s.lead, s.key, 1260);
});
