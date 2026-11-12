/* =====================================================================
   CutPack · uni · ICON ANIMATION TRIAL (Friend 2026-11-12: "อยากจะลองให้คุณทำ motion graphic โดยใช้แค่ icon animation" ·
   "เริ่มได้" · "ชิ้นในไอคอนขยับเอง เช่น กระดิ่งแกว่ง เข็มนาฬิกาหมุน ลูกศรพุ่ง กุญแจไข หัวใจเต้น ซึ่งเป็นแนวเดียวกับ Lucide Animated
   ที่เคยพูดถึง ผมชอบไอเดียนี้"). Five drafts made of Lucide icons only (ISC licence, engine/icons/lucide.json): each icon is
   split into its own shapes and the shapes move on their own (the bell swings and its clapper lags, the clock's hands spin,
   the arrow flies into the target, the key turns in the lock, the heart beats), in 3–4 beats that end on the key word.
   Under the icon: the sentence's word on its plate (G12.plate of scenes/lego_r9e.js). Colours: the style's own (--lp-*).
   Still a sketch: load with EXTRA=sketches/ia1.js.
   ===================================================================== */
const IA = {
  E: {out: 'cubic-bezier(.22,1,.36,1)', inout: 'cubic-bezier(.65,0,.35,1)', fall: 'cubic-bezier(.55,0,1,.45)', io: 'ease-in-out'},
  /* an icon (or several, in one drawing space vb = [x, y, w, h] in Lucide's 24-unit grid) centred on (cx, cy), size = px per
     24 units. parts: [{d: '<path …/>' (one or more shapes), o: [x, y] turn/scale origin, fill: true (an accent fill under it),
     at: 'translate(…)' (where the part sits in the space)}]. Every part is a <g> (move it with CSS transforms in grid units);
     its accent fill sits inside it, under its lines. The whole drawing is IA.root (one more <g>, origin og). */
  icon(g, parts, cx, cy, size, {vb = [0, 0, 24, 24], sw = 1.6, og = [12, 12]} = {}) {
    const k = size / 24, W = vb[2] * k, H = vb[3] * k;
    const host = div(`left:${cx - W / 2}px;top:${cy - H / 2}px;width:${W}px;height:${H}px`, g);
    host.className = 'lpg';
    const ink = `fill:none;stroke:var(--lp-ink);stroke-width:${sw};stroke-linecap:round;stroke-linejoin:round`;
    const fill = 'fill:var(--lp-acc);stroke:none;opacity:0';
    host.innerHTML = `<svg width="${W}" height="${H}" viewBox="${vb.join(' ')}" style="overflow:visible"><g class="ia-root">` +
      parts.map((p, i) => `<g class="ia-p" data-i="${i}"${p.at ? ` transform="${p.at}"` : ''}><g class="ia-m">` +
        (p.fill ? `<g class="ia-f" style="${fill}">${p.d}</g>` : '') + `<g class="ia-s" style="${ink}">${p.d}</g>` +
        (p.ai ? `<g class="ia-a" style="${ink.replace('var(--lp-ink)', 'var(--lp-acc-ink)')};opacity:0">${p.d}</g>` : '') + '</g></g>').join('') + '</g></svg>';
    const og_ = (el, o) => { el.style.transformBox = 'view-box'; el.style.transformOrigin = `${o[0]}px ${o[1]}px`; };
    const root = host.querySelector('.ia-root'); og_(root, og);
    const P = [...host.querySelectorAll('.ia-p')].map((e, i) => {
      const m = e.querySelector('.ia-m'); og_(m, parts[i].o ?? og);
      return {m, f: e.querySelector('.ia-f'), s: e.querySelector('.ia-s'), a: e.querySelector('.ia-a'), shapes: [...e.querySelector('.ia-s').children]};
    });
    return {host, root, P, k, at: (x, y) => ({x: cx - W / 2 + (x - vb[0]) * k, y: cy - H / 2 + (y - vb[1]) * k})};
  },
  /* lines that draw themselves (hidden until then: no round-cap dot before the start) */
  draw(shapes, t, d, e = IA.E.inout) {
    for (const el of shapes) {
      el.setAttribute('pathLength', '1');
      A(el, [{strokeDasharray: '1 1', strokeDashoffset: 1, opacity: 0}, {opacity: 1, offset: .02}, {strokeDasharray: '1 1', strokeDashoffset: 0, opacity: 1}], t, d, {e});
    }
  },
  show: (el, t, d = .3) => A(el, [{opacity: 0}, {opacity: 1}], t, d, {e: IA.E.out}),
  /* lines that lie on the accent fill take the accent's own ink when it comes on (ai: true parts) */
  accInk: (parts, t, d = .3) => parts.forEach(p => p.a && A(p.a, [{opacity: 0}, {opacity: 1}], t, d, {e: IA.E.out})),
  /* one keyframe track: [time, value, easing to the next] … */
  seq(el, prop, pts) {
    const t0 = pts[0][0], L = Math.max(pts[pts.length - 1][0] - t0, .001);
    A(el, pts.map(([t, v, e]) => ({[prop]: v, offset: Math.min(1, Math.max(0, (t - t0) / L)), easing: e ?? 'linear'})), t0, L, {f: 'both'});
  },
  /* a damped swing / shake: angles (or any value maker) at even steps from t */
  swing(el, t, vals, step, make = v => `rotate(${v}deg)`) { IA.seq(el, 'transform', vals.map((v, i) => [t + i * step, make(v), IA.E.io])); },
  /* the words: one plate under the icon (the category's own word), rising in at t */
  plate(K, g, s, cat, t) {
    const W = (cat === 'B19' ? [[s.feel, s.mood !== 'bad']] : G12W[cat](s)).filter(v => v[0]);
    if (W.length) G12.plate(K, g, W[0][0], 300, 270, W[0][1], 360, t);
    return W.length;
  },
  /* the place of the icon: above the plate, or alone in the middle */
  box: (s, cat) => ((cat === 'B19' ? s.feel : G12W[cat](s).find(v => v[0])) ? {cx: 300, cy: 124, size: 200} : {cx: 300, cy: 168, size: 270}),
  time(T) { const a = T.b[0], h = Math.max(T.hit, a + .3); return {a, h, sp: h - a, at: f => a + (h - a) * f, end: T.t1 ?? h + 2}; },
};
const IC = name => ICONS[name];
IA.shapes = name => ICONS[name].match(/<[^>]+\/>/g);              // a Lucide icon's shapes, one by one

/* ================= B07 คำเตือน: the bell ================= */
/* the bell draws itself, gives a small nudge, and on the key word swings hard (the clapper lagging behind), the ring lines
   flash out on both sides with each swing; it settles and lights up */
R3.both('B07', 'ibell', 'กระดิ่งแกว่ง ลิ้นกระดิ่งแกว่งตาม เส้นเสียงดังออกสองข้าง (ไอคอนขยับ)', (K, s, T, g) => {
  const {a, h, sp, at} = IA.time(T), B = IA.box(s, 'B07'), [body, clap, arcL, arcR] = IA.shapes('bell-ring');
  const I = IA.icon(g, [{d: body, o: [12, 1.6], fill: true}, {d: clap, o: [12, 1.6]}, {d: arcL, o: [12, 8]}, {d: arcR, o: [12, 8]}], B.cx, B.cy, B.size);
  const [Pb, Pc, Pl, Pr] = I.P;
  IA.draw(Pb.shapes, a, sp * .45); IA.draw(Pc.shapes, a + sp * .35, .3);
  for (const p of [Pl, Pr]) p.s.style.opacity = 0;
  /* a small nudge (something is coming) */
  IA.swing(Pb.m, at(.62), [0, -5, 4, -2, 0], .1);
  IA.swing(Pc.m, at(.62) + .04, [0, -6, 5, -2.5, 0], .1);
  /* the ring on the key word: a damped swing; the clapper follows a beat later, a little further */
  const sw = [0, 20, -16, 12, -8, 5, -2, 0];
  IA.swing(Pb.m, h, sw, .13); IA.swing(Pc.m, h + .05, sw.map(v => v * 1.25), .13);
  /* the sound lines flash out on the side the bell swings to */
  [[Pr, 0], [Pl, 1], [Pr, 2], [Pl, 3]].forEach(([p, i]) => {
    const t = h + .06 + i * .13;
    A(p.s, [{opacity: 0, transform: 'scale(.8)'}, {opacity: 1, transform: 'scale(1.06)', offset: .35}, {opacity: i < 3 ? 0 : 1, transform: 'none'}], t, .32, {e: IA.E.out, f: i < 3 ? 'none' : 'forwards'});
    p.s.style.transformBox = 'view-box'; p.s.style.transformOrigin = '12px 8px';
  });
  A(Pl.s, [{opacity: 0}, {opacity: 1}], h + .55, .3, {e: IA.E.out});
  A(Pb.f, [{opacity: 0}, {opacity: 1}], h + .02, .3, {e: IA.E.out});
  IA.plate(K, g, s, 'B07', h + .2);
});

/* ================= B09 เวลา: the alarm clock ================= */
/* the face draws, the hands race round (the long one many times, the short one a little), and on the key word they stop and
   the clock rings: it rattles on its feet, the bells hop, the face lights */
R3.both('B09', 'ialarm', 'นาฬิกาปลุก เข็มหมุนเร็ว หยุดแล้วสั่นดังตรงคำสำคัญ (ไอคอนขยับ)', (K, s, T, g) => {
  const {a, h, sp, at} = IA.time(T), B = IA.box(s, 'B09');
  const I = IA.icon(g, [{d: '<circle cx="12" cy="13" r="8"/>', o: [12, 13], fill: true}, {d: '<path d="M12 13V9.4"/>', o: [12, 13], ai: true}, {d: '<path d="M12 13l2.4 2.4"/>', o: [12, 13], ai: true},
    {d: '<path d="M5 3 2 6"/>', o: [3.5, 4.5]}, {d: '<path d="m22 6-3-3"/>', o: [20.5, 4.5]}, {d: '<path d="M6.38 18.7 4 21"/><path d="M17.64 18.67 20 21"/>'}],
    B.cx, B.cy, B.size, {og: [12, 21]});
  const [F, Hh, Hm, BL, BR, Legs] = I.P;
  IA.draw(F.shapes, a, sp * .4); IA.draw([...Legs.shapes, ...BL.shapes, ...BR.shapes], a + sp * .25, .4);
  IA.draw([...Hh.shapes, ...Hm.shapes], a + sp * .3, .25);
  /* the hands race: the long one three turns, the short one a quarter, slowing into the key word */
  IA.seq(Hm.m, 'transform', [[at(.45), 'rotate(0deg)', IA.E.inout], [h - .02, 'rotate(1080deg)']]);
  IA.seq(Hh.m, 'transform', [[at(.45), 'rotate(0deg)', IA.E.inout], [h - .02, 'rotate(90deg)']]);
  /* it rings: the whole clock rattles on its feet, the bells hop in turn */
  IA.swing(I.root, h, [0, 7, -7, 6, -6, 5, -5, 3, -3, 0], .07);
  IA.swing(BL.m, h, [0, -1.4, 0, -1.4, 0, -1.2, 0, -.8, 0], .08, v => `translateY(${v}px)`);
  IA.swing(BR.m, h + .04, [0, -1.4, 0, -1.4, 0, -1.2, 0, -.8, 0], .08, v => `translateY(${v}px)`);
  A(F.f, [{opacity: 0}, {opacity: 1}], h + .02, .3, {e: IA.E.out}); IA.accInk([Hh, Hm], h + .02);
  IA.plate(K, g, s, 'B09', h + .2);
});

/* ================= B08 เป้าหมาย: the target and the arrow ================= */
/* the rings draw from the outside in; the arrow comes in from far away, faster and faster, and sticks in the middle on the key
   word: it quivers, the rings ripple out, the middle lights */
R3.both('B08', 'itarget', 'ลูกศรพุ่งปักกลางเป้า เป้ากระเพื่อม (ไอคอนขยับ)', (K, s, T, g) => {
  const {a, h, sp, at} = IA.time(T), B = IA.box(s, 'B08');
  const I = IA.icon(g, [{d: '<circle cx="12" cy="12" r="10"/>', o: [12, 12]}, {d: '<circle cx="12" cy="12" r="6"/>', o: [12, 12], fill: true}, {d: '<circle cx="12" cy="12" r="2"/>', o: [12, 12], ai: true},
    {d: '<path d="M7 7h10v10"/><path d="M7 17 17 7"/>', o: [17, 7], at: 'translate(-2.6 7.4) scale(.86)'}], B.cx, B.cy, B.size);
  const [R1, R2, R3_, Ar] = I.P;
  IA.draw(R1.shapes, a, sp * .4); IA.draw(R2.shapes, a + sp * .15, sp * .35); IA.draw(R3_.shapes, a + sp * .3, sp * .3);
  /* the arrow (its tip at the middle): far down-left, then in along its own line, faster and faster */
  IA.show(Ar.m, h - .42, .12);
  A(Ar.m, [{transform: 'translate(-22px,22px)'}, {transform: 'none'}], h - .42, .42, {e: IA.E.fall});
  IA.swing(Ar.m, h, [0, 6, -4.5, 3, -1.6, .6, 0], .07);
  /* the rings ripple out from the middle */
  [R3_, R2, R1].forEach((r, i) => A(r.m, [{transform: 'none'}, {transform: 'scale(1.1)', offset: .4}, {transform: 'none'}], h + .02 + i * .07, .36, {e: IA.E.io, f: 'none'}));
  A(R2.f, [{opacity: 0}, {opacity: 1}], h + .04, .3, {e: IA.E.out}); IA.accInk([R3_], h + .04);
  const ns = 'http://www.w3.org/2000/svg', cid = 'iaclip' + (IA.n = (IA.n ?? 0) + 1), svg = I.host.querySelector('svg');
  const wrap = document.createElementNS(ns, 'g');
  wrap.innerHTML = `<clipPath id="${cid}"><circle cx="12" cy="12" r="5.6"/></clipPath><g clip-path="url(#${cid})"><g transform="translate(-2.6 7.4) scale(.86)" ` +
    `style="fill:none;stroke:var(--lp-acc-ink);stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></g></g>`;
  I.root.appendChild(wrap); A(wrap, [{opacity: 0}, {opacity: 1}], h + .44, .2, {e: IA.E.out});
  IA.plate(K, g, s, 'B08', h + .2);
});

/* ================= B13 เคล็ดลับ: the lock and the key ================= */
/* the lock draws; the key glides in from the side into the keyhole, turns over, and on the key word the shackle springs open
   and the lock lights; the key comes back out */
R3.both('B13', 'ilock', 'กุญแจเสียบ หมุน แม่กุญแจเด้งเปิดตรงคำสำคัญ (ไอคอนขยับ)', (K, s, T, g) => {
  const {a, h, sp, at} = IA.time(T), B = IA.box(s, 'B13');
  const key = IC('key-round');
  /* the key (Lucide's key-round, bow round (15.6, 8.4)) turned so its blade points left, its tip at the keyhole (12, 16) */
  const I = IA.icon(g, [{d: '<rect x="3" y="10" width="18" height="12" rx="2"/>', fill: true}, {d: '<circle cx="12" cy="16" r="1"/>', ai: true},
    {d: '<path d="M7 10V7a5 5 0 0 1 10 0v3"/>', o: [7, 10]},
    {d: key, o: [25.4, 16], at: 'translate(25.4 16) scale(.56) rotate(45) translate(-15.6 -8.4)'}], B.cx - B.size * .14, B.cy, B.size, {vb: [0, 0, 32, 24]});
  const [Bd, Kh, Sh, Ky] = I.P;
  IA.draw([...Bd.shapes, ...Kh.shapes], a, sp * .4); IA.draw(Sh.shapes, a + sp * .2, sp * .35);
  /* the key glides in from the right, turns over (as seen from the side: it flattens and flips) */
  A(Ky.s, [{opacity: 0}, {opacity: 1}], at(.38), .25, {e: IA.E.out});
  IA.seq(Ky.m, 'transform', [[at(.38), 'translateX(9px)', IA.E.inout], [at(.7), 'none', IA.E.inout], [at(.78), 'none', IA.E.inout], [h - .08, 'scaleY(-1)', IA.E.inout],
    [h + .3, 'scaleY(-1)', IA.E.inout], [h + .75, 'translateX(9px) scaleY(-1)']]);
  A(Ky.m, [{opacity: 1}, {opacity: 0}], h + .5, .3, {e: IA.E.inout});   // the key comes back out and goes: the open lock stays
  /* the shackle springs up and swings open on its left leg */
  IA.seq(Sh.m, 'transform', [[h - .02, 'none', IA.E.out], [h + .16, 'translateY(-2.6px)', IA.E.inout], [h + .5, 'translateY(-2.6px) rotate(-24deg)', IA.E.io], [h + .62, 'translateY(-2.6px) rotate(-20deg)']]);
  A(Bd.f, [{opacity: 0}, {opacity: 1}], h + .08, .3, {e: IA.E.out}); IA.accInk([Kh], h + .08);
  IA.plate(K, g, s, 'B13', h + .25);
});

/* ================= B19 ความรู้สึก: the heart ================= */
/* the heart draws itself, beats softly (lub-dub, twice), and on the key word gives a big beat: it fills, an echo of it rings out,
   and it goes on beating gently */
R3.both('B19', 'iheart', 'หัวใจเต้นตุบ ๆ เต้นแรงตรงคำสำคัญ (ไอคอนขยับ)', (K, s, T, g) => {
  const {a, h, sp, at, end} = IA.time(T), B = IA.box(s, 'B19'), heart = IC('heart');
  const I = IA.icon(g, [{d: heart, o: [12, 12], fill: true}, {d: heart, o: [12, 12]}], B.cx, B.cy, B.size);
  const [Hh, Echo] = I.P;
  IA.draw(Hh.shapes, a, sp * .45);
  Echo.s.style.opacity = 0;
  const beat = (t, s1 = 1.07, s2 = 1.04) => A(Hh.m, [{transform: 'none'}, {transform: `scale(${s1})`, offset: .15}, {transform: 'none', offset: .32}, {transform: `scale(${s2})`, offset: .47}, {transform: 'none', offset: .7}, {transform: 'none'}],
    t, .8, {e: IA.E.io, f: 'none'});
  const b1 = at(.5); beat(b1); if (b1 + 1.75 < h) beat(b1 + .9);             // a second soft beat when there is time for it
  /* the big beat */
  A(Hh.m, [{transform: 'none'}, {transform: 'scale(1.2)', offset: .25}, {transform: 'scale(.98)', offset: .55}, {transform: 'none'}], h, .55, {e: IA.E.io, f: 'none'});
  A(Hh.f, [{opacity: 0}, {opacity: 1}], h + .02, .25, {e: IA.E.out});
  A(Echo.s, [{opacity: .9, transform: 'scale(1)'}, {opacity: 0, transform: 'scale(1.55)'}], h + .05, .7, {e: IA.E.out, f: 'none'});
  Echo.s.style.transformBox = 'view-box'; Echo.s.style.transformOrigin = '12px 12px';
  /* then a gentle beat, on and on */
  const n = Math.floor((end - h - .7) / 1); if (n > 0) A(Hh.m, [{transform: 'none'}, {transform: 'scale(1.05)', offset: .15}, {transform: 'none', offset: .32}, {transform: 'scale(1.03)', offset: .47}, {transform: 'none', offset: .7}, {transform: 'none'}], h + .7, 1, {e: IA.E.io, it: n, f: 'none'});
  IA.plate(K, g, s, 'B19', h + .2);
});

SENTENCE('ia.bell', {cat: 'B07', name: 'ระวังลิงก์แปลก', say: ['ระวังนะ อย่ากด', 'ลิงก์แปลก'], thing: {icon: 'link', label: 'ลิงก์แปลก'}, how: 'flag'});
SENTENCE('ia.alarm', {cat: 'B09', name: 'อีกสามวันเปิดร้าน', say: ['อีกแค่สามวัน', 'ก็ถึงวันเปิดร้าน'], points: [{icon: 'calendar', label: 'วันนี้'}, {icon: 'calendar', label: 'พรุ่งนี้'}, {icon: 'store', label: 'เปิดร้าน'}], at: 2});
SENTENCE('ia.target', {cat: 'B08', name: 'เป้าคือยอดล้านแรก', say: ['เป้าหมายปีนี้คือ', 'ยอดขายล้านแรก'], goal: {icon: 'trophy', label: 'ล้านแรก'}});
SENTENCE('ia.lock', {cat: 'B13', name: 'เคล็ดลับคือตื่นเช้า', say: ['เคล็ดลับของผมคือ', 'ตื่นเช้า'], secret: {icon: 'sunrise', label: 'ตื่นเช้า'}});
SENTENCE('ia.heart', {cat: 'B19', name: 'ลูกค้ารีวิวแล้วดีใจ', say: ['ทุกครั้งที่ลูกค้ารีวิว', 'ผมดีใจมาก'], feel: {icon: 'smile', label: 'ดีใจ'}, who: {icon: 'user', label: 'ผม'}, mood: 'good'});
