/* =====================================================================
   CutPack · uni · the old frames join the category system, each variant with its small form
   (Friend 2026-11-08: "ไปทำของระบบเลโก้เลย" … "ทำต่อ"). The full-screen pictures are the old LAYOUTs (lego.js, lego_r1.js);
   only the slots are unified per category, so the AI writes the same few fields for every variant of a category.
   Slots:
     B03 เปรียบเทียบ / ก่อนกับหลัง  a {icon, label?, v?}, b {icon, label?, v?}, win ('a'|'b'), how? ('cross'|'check'),
                                   mode ('versus' = side by side | 'change' = before → after), switch? (it is switched on / off)
     B02 เพิ่มขึ้น / ลดลง          dir ('up'|'down'), item {icon}, center? {icon}, n? (4), keep? (1), end? {icon}
     B04 ขั้นตอน                  items [{icon, label?}] (3), mark? {at, how: 'light'|'check'|'cross'}
     B09 เวลา                     points [{icon, label?}] (3), at?, result? {icon, tone?} (what the time brought)
     B12 เหตุกับผล                items [{icon, label?}] (3), end? {icon}
   Small forms follow the rules from Friend's overlay clips (see small.js): no sentence inside, 1–3 big things,
   words only from the slots, one event on the key word, a card or nothing behind it; 600 × 340 canvas.
   ===================================================================== */
const V2 = {
  versus: s => s.mode !== 'change', change: s => s.mode === 'change',
  vals: s => s.a?.v != null && s.b?.v != null,
  lose: s => (s.win ?? 'b') === 'a' ? 'b' : 'a',
};

/* ================= B03 เปรียบเทียบ / ก่อนกับหลัง ================= */
VARIANT('B03', 'cards', {name: 'การ์ดสองใบ คนแพ้ถอย', fits: V2.versus, build: (K, s, T) => LAYOUTS.versus.build(K, {...s, as: 'cards'}, T)});
VARIANT('B03', 'scale', {name: 'ตาชั่ง', fits: V2.versus, build: (K, s, T) => LAYOUTS.versus.build(K, {...s, as: 'scale'}, T)});
VARIANT('B03', 'measure', {name: 'แถบวัดสองแถบ', fits: s => V2.versus(s) && V2.vals(s), build: (K, s, T) => LAYOUTS.versus.build(K, {...s, as: 'measure'}, T)});
VARIANT('B03', 'swap', {name: 'ก่อน → หลัง', fits: V2.change, build: (K, s, T) => LAYOUTS.change.build(K, {as: 'swap', from: s.a, to: s.b}, T)});
VARIANT('B03', 'meter', {name: 'แถบวัดเปลี่ยน', fits: s => V2.change(s) && V2.vals(s),
  build: (K, s, T) => LAYOUTS.change.build(K, {as: 'meter', icon: s.b.icon, v0: s.a.v, v1: s.b.v}, T)});
VARIANT('B03', 'toggle', {name: 'สวิตช์เปิด / ปิด', fits: s => V2.change(s) && s.switch != null,
  build: (K, s, T) => LAYOUTS.change.build(K, {as: 'toggle', icon: s.b.icon, on: s.switch !== false}, T)});

SMALLV('B03', 'cards', (K, s, T) => {
  const win = s.win ?? 'b', lose = V2.lose(s), X = {a: 40, b: 320}, C = {};
  for (const k of ['a', 'b']) {
    const tk = k === 'a' ? T.b[0] : T.b[1];
    C[k] = K.panel(X[k], 40, 240, 260, tk);
    K.badge(C[k].p, s[k].icon, 120, 104, 128, tk + .12, {tone: s[k].tone ?? 'main'});
    if (s[k].label) SM.word(K, C[k].p, s[k].label, 120, 184, 42, tk + .25, 'center');
  }
  if (s.how !== 'check') { K.mark(C[lose].p, 'cross', 200, 40, 70, T.hit); K.fade(C[lose].o, T.hit + .15, 1, .45); K.move(C[lose].m, T.after, 'none', 'translateY(16px) scale(.95)'); }
  if (s.how !== 'cross') { K.punch(C[win].p, T.hit); K.move(C[win].m, T.after, 'none', 'translateY(-12px) scale(1.04)'); K.mark(C[win].p, 'check', 200, 40, 70, T.after); }
});
SMALLV('B03', 'scale', (K, s, T) => {                // the same floating scale as the one made from Friend's script, from the slots
  const win = s.win ?? 'b', g = node(K.stage, 0, 0, 600, 340, ''); g.m.style.transformOrigin = '300px 226px';
  const beam = div('left:0;top:0;width:600px;height:340px', g.p, '<svg width="600" height="340"><path class="ln" d="M70 226H530"/></svg>');
  K.draw(beam.querySelector('path'), T.b[0]);
  K.enter(div('left:0;top:0;width:600px;height:340px', K.stage, '<svg width="600" height="340"><path class="sd" d="M300 232L248 312H352Z"/></svg>'), T.b[0] + .1, 'rise');
  const A_ = K.badge(g.p, s.a.icon, 150, 150, 142, T.b[1], {tone: s.a.tone ?? 'acc', kind: 'drop'});
  const B_ = K.badge(g.p, s.b.icon, 450, 150, 142, T.b[1] + .18, {tone: s.b.tone ?? 'main', kind: 'drop'});
  K.move(g.m, T.hit - .15, 'rotate(0deg)', `rotate(${win === 'a' ? -9 : 9}deg)`, {kind: 'tilt'});   // the side that matters goes down
  K.punch((win === 'a' ? A_ : B_).p, T.hit + .2);
});
SMALLV('B03', 'measure', (K, s, T) => {
  const win = s.win ?? 'b', lose = V2.lose(s), P = K.panel(40, 40, 520, 260, T.b[0]), y = {a: 82, b: 186};
  const m = {a: K.measure(P.p, 34, y.a, 420, T.b[1], s.a.v, s.a.icon, {tone: s.a.tone ?? 'main', fill: win === 'a' ? 'u-bar-on' : 'u-bar-main', size: 88}),
             b: K.measure(P.p, 34, y.b, 420, T.b[2], s.b.v, s.b.icon, {tone: s.b.tone ?? 'main', fill: win === 'b' ? 'u-bar-on' : 'u-bar-main', size: 88})};
  if (s.how !== 'check') { K.shake(m[lose].track.p, T.hit); K.mark(P.p, 'cross', Math.min(470, m[lose].end + 46), y[lose], 58, T.hit); }
  if (s.how !== 'cross') K.mark(P.p, 'check', Math.min(470, m[win].end + 46), y[win], 58, T.after);
});
SMALLV('B03', 'swap', (K, s, T) => {
  const from = K.badge(K.stage, s.a.icon, 130, 150, 132, T.b[0], {tone: s.a.tone ?? 'soft'});
  if (s.a.label) SM.word(K, K.stage, s.a.label, 130, 236, 40, T.b[0] + .2, 'center');
  const ar = div('left:0;top:0;width:600px;height:340px', K.stage, '<svg width="600" height="340"><path class="ln" d="M232 150H366"/><path class="ln" d="M340 124L368 150L340 176"/></svg>');
  ar.querySelectorAll('path').forEach((p, i) => K.draw(p, T.b[1] + i * .3, .3));
  const to = K.badge(K.stage, s.b.icon, 470, 150, 150, T.hit - .05, {tone: s.b.tone ?? 'acc'});
  if (s.b.label) SM.word(K, K.stage, s.b.label, 470, 244, 44, T.hit + .1, 'center');
  K.fade(from.o, T.hit, 1, .45); R1.pulse(K, K.stage, 470, 150, 110, T.hit, 1, 'acc');
});
SMALLV('B03', 'meter', (K, s, T) => {
  const P = K.panel(40, 90, 520, 170, T.b[0]);
  const mm = K.measure(P.p, 34, 85, 400, T.b[0] + .15, s.a.v, s.b.icon, {tone: 'acc', fill: 'u-bar-on', size: 92});
  mm.set(T.b[1] + .2, s.b.v);
  K.badge(P.p, s.b.v >= s.a.v ? 'trending-up' : 'trending-down', 476, 85, 64, T.hit, {tone: s.b.v >= s.a.v ? 'acc' : 'neg', shape: 'round'});
  if (s.b.label) SM.word(K, K.stage, s.b.label, 300, 30, 42, T.hit, 'center');
});
SMALLV('B03', 'toggle', (K, s, T) => {
  const P = K.panel(40, 70, 520, 200, T.b[0]);
  K.badge(P.p, s.b.icon, 98, 100, 120, T.b[0] + .1, {tone: 'main'});
  if (s.b.label) SM.word(K, P.p, s.b.label, 178, 72, 42, T.b[0] + .2);
  const sw = K.toggle(P.p, 300, 50, 196, T.b[0] + .2);
  if (s.switch === false) { sw.set(T.b[1], 1); sw.set(T.hit - .2, 0); } else sw.set(T.hit - .2, 1);
  K.punch(P.p, T.hit);
});

/* ================= B02 เพิ่มขึ้น / ลดลง ================= */
VARIANT('B02', 'row', {name: 'แถวของที่ค่อย ๆ ลด / เพิ่ม', fits: s => !!s.center, build: (K, s, T) => LAYOUTS.count.build(K, {...s, as: 'row'}, T)});
VARIANT('B02', 'ring', {name: 'ของรอบตัวกลาง', fits: s => !!s.center, build: (K, s, T) => LAYOUTS.count.build(K, {...s, as: 'ring'}, T)});
VARIANT('B02', 'bars', {name: 'กราฟแท่ง', build: (K, s, T) => LAYOUTS.count.build(K, {...s, as: 'bars'}, T)});

const V2count = (s, T) => {                          // who comes or goes when, shared by the small forms
  const n = s.n ?? 4, keep = s.keep ?? 1, up = s.dir === 'up';
  return {n, keep, up, it: s.item ?? {icon: 'user', shape: 'round'}, leaveAt: LG.spread(T.b[2], T.hit, n - keep),
    comeAt: up ? LG.spread(T.b[1], T.hit, n) : [...Array(n)].map((_, i) => T.b[0] + .3 + i * .1)};
};
SMALLV('B02', 'row', (K, s, T) => {
  const c = V2count(s, T), P = K.panel(40, 50, 520, 240, T.b[0]);
  K.badge(P.p, s.center.icon, 84, 82, 100, T.b[0] + .12, {tone: s.center.tone ?? 'main'});
  const items = [...Array(c.n)].map((_, i) => K.badge(P.p, c.it.icon, 76 + i * 122, 178, 92, c.comeAt[i], {tone: c.it.tone ?? 'main', shape: c.it.shape ?? 'round'}));
  if (!c.up) [...Array(c.n - c.keep)].forEach((_, k) => K.leave(items[c.n - 1 - k].o, c.leaveAt[k]));
  else K.punch(items[c.n - 1].p, T.after);
  K.badge(P.p, c.up ? 'trending-up' : 'trending-down', 440, 82, 76, T.hit, {tone: c.up ? 'acc' : 'neg', shape: 'round'});
});
SMALLV('B02', 'ring', (K, s, T) => {
  const c = V2count(s, T), cx = 300, cy = 170, pos = [[110, 70], [490, 70], [110, 270], [490, 270]].slice(0, c.n);
  const lines = div('left:0;top:0;width:600px;height:340px', K.stage, `<svg width="600" height="340">${pos.map(([x, y]) => `<path class="ln u-thin" d="M${cx} ${cy}L${x} ${y}"/>`).join('')}</svg>`);
  const ls = lines.querySelectorAll('path');
  const center = K.badge(K.stage, s.center.icon, cx, cy, 140, T.b[0], {tone: s.center.tone ?? 'main'});
  const items = pos.map(([x, y], i) => { K.draw(ls[i], c.comeAt[i] - .1); return K.badge(K.stage, c.it.icon, x, y, 90, c.comeAt[i] + .1, {tone: c.it.tone ?? 'main', shape: c.it.shape ?? 'round'}); });
  if (!c.up) [...Array(c.n - c.keep)].forEach((_, k) => { const i = c.n - 1 - k; K.leave(items[i].o, c.leaveAt[k]); K.fade(ls[i], c.leaveAt[k], 1, 0); });
  if (!c.up && c.keep === 0) K.shake(center.p, T.hit); else K.punch(center.p, T.hit);
});
SMALLV('B02', 'bars', (K, s, T) => {
  const up = s.dir === 'up', P = K.panel(60, 20, 480, 300, T.b[0]);
  if (s.center) K.badge(P.p, s.center.icon, 66, 64, 80, T.b[0] + .12, {tone: 'main'});
  K.bars(P.p, 40, 112, 400, 160, up ? [.22, .45, .7, .95] : [.95, .72, .48, .22], T.b[1] - .1, {step: (T.hit - T.b[1]) / 3.4, trend: true});
  K.badge(P.p, up ? 'trending-up' : 'trending-down', 410, 64, 72, T.hit, {tone: up ? 'acc' : 'neg', shape: 'round'});
});

/* ================= B04 ขั้นตอน ================= */
VARIANT('B04', 'row', {name: 'การ์ด 3 ขั้นมีลูกศร', fits: s => s.items.length <= 3, build: (K, s, T) => LAYOUTS.steps.build(K, {...s, as: 'row'}, T)});
VARIANT('B04', 'list', {name: 'รายการติ๊ก', build: (K, s, T) => LAYOUTS.steps.build(K, {...s, as: 'list'}, T)});

SMALLV('B04', 'row', (K, s, T) => {
  const its = s.items, m = s.mark ?? {at: its.length - 1, how: 'light'}, xs = [100, 300, 500], when = [T.b[0], T.b[1], T.b[2]];
  const tiles = its.map((it, i) => {
    const b = K.badge(K.stage, it.icon, xs[i], 136, 118, when[i], {tone: it.tone ?? 'main'});
    if (it.label) SM.word(K, K.stage, it.label, xs[i], 214, 40, when[i] + .15, 'center');
    return b;
  });
  for (let i = 0; i < its.length - 1; i++) {
    const a = div('left:0;top:0;width:600px;height:340px', K.stage, `<svg width="600" height="340"><path class="ln u-thin" d="M${xs[i] + 74} 136H${xs[i + 1] - 74}"/></svg>`);
    K.draw(a.querySelector('path'), when[i + 1] - .2, .25);
  }
  const t = tiles[m.at];
  if (m.how === 'cross') { K.mark(K.stage, 'cross', xs[m.at], 136, 120, T.hit); K.fade(t.o, T.hit + .1, 1, .45); }
  else { LG.light(K, K.stage, its[m.at].icon, xs[m.at], 136, 118, T.hit); for (let i = 0; i < m.at; i++) K.mark(K.stage, 'check', xs[i] + 48, 82, 46, T.hit + .1 + i * .08); }
});
SMALLV('B04', 'list', (K, s, T) => {
  const its = s.items, m = s.mark ?? {at: its.length - 1, how: 'check'}, P = K.panel(60, 20, 480, 300, T.b[0]);
  const rows = K.checklist(P.p, 34, 26, 420, its.map(it => it.label ? {text: it.label} : {skel: .6}), T.b[1], {rowH: 88, box: 60});
  const row = rows[m.at];
  if (m.how === 'cross') { K.mark(P.p, 'cross', row.cx, row.cy, 64, T.hit); if (row.label) K.fade(row.label, T.hit + .1, 1, .38); K.punch(P.p, T.hit); }
  else K.mark(P.p, 'check', row.cx, row.cy, 64, T.hit);
});

/* ================= B09 เวลา ================= */
VARIANT('B09', 'line', {name: 'เส้นเวลา 3 จุด', fits: s => (s.points?.length ?? 0) >= 3, build: (K, s, T) => LAYOUTS.time.build(K, {...s, as: 'line'}, T)});
VARIANT('B09', 'clock', {name: 'นาฬิกาหมุนแล้วเห็นผล', fits: s => !!s.result, build: (K, s, T) => LAYOUTS.time.build(K, {as: 'clock', icon: s.result.icon, tone: s.result.tone, turns: s.turns}, T)});

SMALLV('B09', 'line', (K, s, T) => {
  const pts = s.points, xs = [100, 300, 500], y = 236, at = s.at ?? 2;
  const line = div('left:0;top:0;width:600px;height:340px', K.stage, `<svg width="600" height="340"><path class="ln" d="M50 ${y}H550"/></svg>`);
  K.draw(line.querySelector('path'), T.b[0]);
  const stops = pts.map((p, i) => {
    const b = K.badge(K.stage, p.icon, xs[i], y - 104, 108, T.b[0] + .2 + i * .15, {tone: p.tone ?? 'main'});
    K.enter(div(`left:${xs[i] - 14}px;top:${y - 14}px;width:28px;height:28px`, K.stage, '<svg width="28" height="28"><circle class="sd" cx="14" cy="14" r="11"/></svg>'), T.b[0] + .2 + i * .15, 'pop');
    if (p.label) SM.word(K, K.stage, p.label, xs[i], y + 26, 36, T.b[0] + .35 + i * .15, 'center');
    return b;
  });
  const mk = node(K.stage, xs[0] - 24, y - 24, 48, 48, '', '<svg width="48" height="48"><circle class="ac" cx="24" cy="24" r="19"/></svg>');
  K.enter(mk.o, T.b[1] - .2, 'pop');
  K.move(mk.m, T.b[1], 'translateX(0px)', `translateX(${xs[1] - xs[0]}px)`);
  K.move(mk.m, T.b[2] + .2, `translateX(${xs[1] - xs[0]}px)`, `translateX(${xs[at] - xs[0]}px)`);
  LG.light(K, K.stage, pts[at].icon, xs[at], y - 104, 108, T.hit);
  stops.forEach((b, i) => { if (i < at) K.fade(b.o, T.hit, 1, .5); });
});
SMALLV('B09', 'clock', (K, s, T) => {
  const cx = 170, cy = 170, R = 128, turns = s.turns ?? 3;
  const face = node(K.stage, cx - R, cy - R, 2 * R, 2 * R, '', `<svg width="${2 * R}" height="${2 * R}"><circle class="u-tgt" cx="${R}" cy="${R}" r="${R}"/>` +
    [...Array(12)].map((_, i) => { const a = i * Math.PI / 6, r0 = R * .78, r1 = R * .9; return `<path class="ln u-thin" d="M${(R + r0 * Math.sin(a)).toFixed(1)} ${(R - r0 * Math.cos(a)).toFixed(1)}L${(R + r1 * Math.sin(a)).toFixed(1)} ${(R - r1 * Math.cos(a)).toFixed(1)}"/>`; }).join('') + '</svg>');
  K.enter(face.o, T.b[0], 'pop');
  const hand = (len, w, cls) => { const n = node(K.stage, cx - w / 2, cy - len, w, len, '', `<svg width="${w}" height="${len}"><path class="${cls}" d="M${w / 2} ${len}V0"/></svg>`); n.m.style.transformOrigin = `${w / 2}px ${len}px`; K.enter(n.o, T.b[0] + .2, 'pop'); return n; };
  const hh = hand(R * .5, 18, 'ln'), mh = hand(R * .76, 18, 'ln u-thin');
  A(mh.m, [{transform: 'rotate(0deg)'}, {transform: `rotate(${360 * turns}deg)`}], T.b[1], T.hit - T.b[1], {e: EASE.inout, f: 'forwards'});
  A(hh.m, [{transform: 'rotate(0deg)'}, {transform: `rotate(${30 * turns}deg)`}], T.b[1], T.hit - T.b[1], {e: EASE.inout, f: 'forwards'});
  const r = K.badge(K.stage, s.result.icon, 450, 170, 150, T.hit, {tone: s.result.tone ?? 'acc'});
  R1.pulse(K, K.stage, 450, 170, 110, T.hit, 1, s.result.tone === 'neg' ? 'neg' : 'acc');
  if (s.result.label) SM.word(K, K.stage, s.result.label, 450, 262, 40, T.hit + .1, 'center');
});

/* ================= B12 เหตุกับผล ================= */
VARIANT('B12', 'domino', {name: 'โดมิโนล้มต่อกัน', build: (K, s, T) => LAYOUTS.chain.build(K, {...s, as: 'domino'}, T)});
VARIANT('B12', 'arrows', {name: 'การ์ด 3 ใบส่งแรงต่อกัน', build: (K, s, T) => LAYOUTS.chain.build(K, {...s, as: 'arrows'}, T)});

SMALLV('B12', 'domino', (K, s, T) => {
  const its = s.items, w = 76, h = 170, base = 300, X = [180, 310, 440].slice(0, its.length);   // the last one lies flat up to x 610
  const ds = its.map((it, i) => R1.domino(K, K.stage, X[i] - w / 2, base, w, h, {...it, tone: it.tone ?? (i === its.length - 1 ? 'acc' : 'main')}, T.b[0] + i * .12));
  const floor = div('left:0;top:0;width:600px;height:340px', K.stage, `<svg width="600" height="340"><path class="ln u-thin" d="M40 ${base + 2}H600"/></svg>`);
  K.draw(floor.querySelector('path'), T.b[0]);
  const ready = T.b[0] + (its.length - 1) * .12 + .6, tA = Math.max(ready, T.hit - (ST.motion.fall?.d ?? 1.2)), tL = Math.max(tA + .6, T.hit);
  R1.topple(ds, X, base, w, h, tA, tL);
  R1.pulse(K, K.stage, X[X.length - 1] + h / 2, base - w / 2, 90, tL);
});
SMALLV('B12', 'arrows', (K, s, T) => {
  const its = s.items, xs = [100, 300, 500], when = [T.b[0], T.b[1], T.b[2]];
  const tiles = its.map((it, i) => {
    const b = K.badge(K.stage, it.icon, xs[i], 140, 120, when[i], {tone: it.tone ?? (i === its.length - 1 ? 'acc' : 'main')});
    if (it.label) SM.word(K, K.stage, it.label, xs[i], 222, 40, when[i] + .15, 'center');
    if (i) {
      const a = div('left:0;top:0;width:600px;height:340px', K.stage, `<svg width="600" height="340"><path class="ln u-thin" d="M${xs[i - 1] + 74} 140H${xs[i] - 76}"/><path class="ln u-thin" d="M${xs[i] - 96} 124L${xs[i] - 76} 140L${xs[i] - 96} 156"/></svg>`);
      a.querySelectorAll('path').forEach((p, k) => K.draw(p, when[i] - .25 + k * .2, .2));
      R1.pulse(K, K.stage, xs[i], 140, 90, when[i] + .2, 1, 'acc');
    }
    return b;
  });
  K.punch(tiles[its.length - 1].p, T.hit); K.move(tiles[its.length - 1].m, T.after, 'none', 'translateY(-10px) scale(1.06)');
});

/* ================= sample sentences (general, not from Friend's script) ================= */
SENTENCE('c2.vs', {cat: 'B03', mode: 'versus', name: 'ไม่ได้ซื้อของถูก แต่ซื้อของคุ้ม', say: ['ลูกค้าไม่ได้ซื้อของถูก', 'แต่ซื้อของคุ้ม'],
  a: {icon: 'tag', label: 'ถูก', v: .35}, b: {icon: 'gem', label: 'คุ้ม', v: .9}, win: 'b'});
SENTENCE('c2.change', {cat: 'B03', mode: 'change', name: 'จากทำคนเดียว ตอนนี้มีทีม', say: ['จากเมื่อก่อนทำคนเดียว', 'ตอนนี้มีทีม'],
  a: {icon: 'user', label: 'คนเดียว', v: .25}, b: {icon: 'users', label: 'มีทีม', v: .85}, win: 'b', switch: true});
SENTENCE('c2.down', {cat: 'B02', name: 'คลิปยาวไป คนดูน้อยลง', say: ['ถ้าคลิปยาวเกินไป', 'คนดูน้อยลง'],
  dir: 'down', item: {icon: 'user', shape: 'round'}, center: {icon: 'video'}, n: 4, keep: 1});
SENTENCE('c2.steps', {cat: 'B04', name: 'ถ่าย ตัด โพสต์', say: ['แค่ถ่าย ตัด แล้วก็', 'โพสต์'],
  items: [{icon: 'camera', label: 'ถ่าย'}, {icon: 'scissors', label: 'ตัด'}, {icon: 'send', label: 'โพสต์'}], mark: {at: 2, how: 'light'}});
SENTENCE('c2.time', {cat: 'B09', name: 'วันแรก เดือนแรก ปีแรก', say: ['วันแรก เดือนแรก', 'ปีแรก'],
  points: [{icon: 'sprout', label: 'วันแรก'}, {icon: 'users', label: 'เดือนแรก'}, {icon: 'store', label: 'ปีแรก'}], result: {icon: 'store', tone: 'acc'}});
SENTENCE('c2.chain', {cat: 'B12', name: 'พอใจ บอกต่อ ยอดเพิ่ม', say: ['ลูกค้าพอใจ ก็บอกต่อ', 'ยอดเพิ่มเอง'],
  items: [{icon: 'smile', label: 'พอใจ'}, {icon: 'megaphone', label: 'บอกต่อ'}, {icon: 'trending-up', label: 'ยอดเพิ่ม'}]});
