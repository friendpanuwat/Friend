/* =====================================================================
   CutPack · uni · LEGO — pictures put together from parts (test, Friend 2026-11-07)
   Friend: "make parts and snap them together in many ways, like 1,000 lego bricks".
   A picture here is NOT code: it is a short recipe (data) = a story frame + the things in it + what happens.
     story frames (LAYOUT): versus (A เทียบ B) · count (มากขึ้น / น้อยลง) · steps (ขั้นตอน) · change (ก่อน → หลัง) · aim (หาให้เจอ)
     things: any icon (Lucide) in a holder, or a kit part (scale, measure bar, bars, toggle, buttons, target …)
     what happens: cross / check / tilt / leave / light / fix / hover …
   RECIPE(id, recipe) turns one recipe into a scene, so every style draws it like any other base scene.
   In the product the AI could write such a recipe for a sentence (a few words of JSON, no code).
   ===================================================================== */
const LAYOUTS = {};
function LAYOUT(id, meta, build) { LAYOUTS[id] = {meta, build}; }
function RECIPE(id, r) {
  SCENE(id, {meaning: r.meaning, name: r.name, story: r.recipe, beats: 4, lego: r,
    slots: {lead: {type: 'text', max: 22, sample: r.say[0]}, key: {type: 'text', max: 12, sample: r.say[1]}}},
  (K, s, T) => { LAYOUTS[r.layout].build(K, r, T); K.say(s.lead, s.key); });
}
/* small helpers every frame uses */
const LG = {
  /* an icon in its holder, with an optional word under it */
  thing(K, parent, it, cx, cy, size, t, kind = 'pop') {
    const b = K.badge(parent, it.icon, cx, cy, size, t, {tone: it.tone ?? 'main', shape: it.shape ?? 'tile', kind});
    let l = null;
    if (it.label) {
      l = div(`left:${cx - 300}px;top:${cy + size / 2 + 18}px;width:600px;text-align:center;white-space:nowrap;font-size:${it.ls ?? 46}px;line-height:1.25`, parent);
      l.className = 'u-label'; l.textContent = it.label; K.enter(l, t + .1, 'lead');
    }
    return {b, l};
  },
  /* a line with an arrow head, drawn from (x0, y) to (x1, y) */
  arrow(K, parent, x0, x1, y, t) {
    const a = div('left:0;top:0;width:1000px;height:700px', parent,
      `<svg width="1000" height="700" style="overflow:visible"><path class="ln u-thin" d="M${x0} ${y}H${x1}"/><path class="ln u-thin" d="M${x1 - 26} ${y - 22}L${x1} ${y}L${x1 - 26} ${y + 22}"/></svg>`);
    const [p, h] = a.querySelectorAll('path'); K.draw(p, t); K.draw(h, t + .35, .25);
    return a;
  },
  /* the same icon in the accent holder fades in over a thing (it "lights up" / is fixed) */
  light(K, parent, icon, cx, cy, size, t, shape = 'tile') {
    const ok = K.badge(parent, icon, cx, cy, size, null, {tone: 'acc', shape});
    K.fade(ok.o, t, 0, 1, {hold: true}); K.punch(ok.p, t + .05); return ok;
  },
  spread: (t0, t1, n) => [...Array(n)].map((_, k) => n < 2 ? t1 : t0 + (t1 - t0) * k / (n - 1)),
};

/* ---------- A เทียบ B: two things side by side, one wins ---------- */
LAYOUT('versus', {name: 'A เทียบ B'}, (K, r, T) => {
  const {a, b} = r, win = r.win ?? 'b', lose = win === 'a' ? 'b' : 'a';
  if (r.as === 'scale') {
    const B = K.scale(K.stage, 500, 150, T.b[0]);
    const ia = K.badge(B.panL.p, a.icon, B.panL.item.cx, B.panL.item.cy, 132, T.b[1], {tone: a.tone ?? 'acc', kind: 'drop'});
    const ib = K.badge(B.panR.p, b.icon, B.panR.item.cx, B.panR.item.cy, 132, T.b[2], {tone: b.tone ?? 'main', kind: 'drop'});
    B.tilt(T.hit - .1, win === 'a' ? -11 : 11);                  // the heavier side goes down
    K.punch((win === 'a' ? ia : ib).p, T.hit);
  } else if (r.as === 'measure') {
    const P = K.panel(110, 90, 780, 420, T.b[0]);
    const m = {a: K.measure(P.p, 60, 130, 660, T.b[1], a.v, a.icon, {tone: a.tone ?? 'main', fill: win === 'a' ? 'u-bar-on' : 'u-bar-main'}),
               b: K.measure(P.p, 60, 290, 660, T.b[2], b.v, b.icon, {tone: b.tone ?? 'main', fill: win === 'b' ? 'u-bar-on' : 'u-bar-main'})};
    const y = {a: 130, b: 290};
    if (r.how !== 'check') { K.shake(m[lose].track.p, T.hit); K.mark(P.p, 'cross', m[lose].end + 70, y[lose], 76, T.hit); }
    if (r.how !== 'cross') K.mark(P.p, 'check', m[win].end + 70, y[win], 76, T.after);
  } else if (r.as === 'buttons') {                                 // the pointer cannot choose
    K.badge(K.stage, r.top ?? 'shopping-cart', 500, 110, 140, T.b[0], {tone: 'main'});
    K.button(K.stage, 300, 360, 300, 130, a.icon, T.b[0] + .15, {tone: a.tone ?? 'acc'});
    K.button(K.stage, 700, 360, 300, 130, b.icon, T.b[0] + .25, {tone: b.tone ?? 'soft'});
    K.cursor(K.stage, [[T.b[1] - .2, 520, 640], [T.b[1] + .3, 330, 400], [T.b[2] + .3, 730, 400], [T.hit, 520, 420], [T.t1 - .2, 520, 420]]);
    K.badge(K.stage, 'circle-help', 520, 250, 100, T.hit, {tone: 'acc'});
  } else {                                                          // two cards
    const P = {a: K.panel(90, 60, 380, 470, T.b[0]), b: K.panel(530, 60, 380, 470, T.b[1])};
    for (const k of ['a', 'b']) {
      const tk = (k === 'a' ? T.b[0] : T.b[1]) + .15;
      LG.thing(K, P[k].p, r[k], 190, 170, 150, tk);
      if (!r[k].label) K.skel(P[k].p, 90, 300, [200, 140], tk + .1);
    }
    if (r.how !== 'check') { K.mark(P[lose].p, 'cross', 330, 52, 80, T.hit); K.fade(P[lose].o, T.hit + .15, 1, .45); }
    if (r.how !== 'cross') { K.punch(P[win].p, T.hit); K.mark(P[win].p, 'check', 330, 52, 80, T.after); }
  }
});

/* ---------- มากขึ้น / น้อยลง: things arrive or leave one by one ---------- */
LAYOUT('count', {name: 'มากขึ้น / น้อยลง'}, (K, r, T) => {
  const n = r.n ?? 4, keep = r.keep ?? 1, up = r.dir === 'up', it = r.item ?? {icon: 'user', shape: 'round'};
  const leaveAt = LG.spread(T.b[2], T.hit, n - keep);                      // last ones go first
  const comeAt = up ? LG.spread(T.b[1], T.hit, n) : [...Array(n)].map((_, i) => T.b[0] + .35 + i * .1);
  let items = [], endAt = [640, 100], parent = K.stage, centerNode = null;
  if (r.as === 'bars') {
    const P = K.panel(130, 30, 740, 560, T.b[0]);
    K.badge(P.p, r.center?.icon ?? 'chart-column', 80, 78, 92, T.b[0] + .15, {tone: 'main'}); K.skel(P.p, 150, 64, [260], T.b[0] + .2);   // the chart's subject (optional)
    K.bars(P.p, 70, 170, 600, 330, up ? [.22, .45, .7, .95] : [.95, .72, .48, .22], T.b[1] - .1, {step: (T.hit - T.b[1]) / 3.4, acc: up ? -1 : -1});
    K.badge(P.p, up ? 'trending-up' : 'trending-down', up ? 130 : 640, 210, 100, T.hit, {tone: 'acc'});
    return;
  } else if (r.as === 'ring') {
    const pos = [[220, 140], [780, 140], [220, 540], [780, 540]].slice(0, n);
    const lines = div('left:0;top:0;width:1000px;height:700px', K.stage,
      `<svg width="1000" height="700" style="overflow:visible">${pos.map(([x, y]) => `<path class="ln u-thin" d="M500 340L${x} ${y}"/>`).join('')}</svg>`);
    const ls = lines.querySelectorAll('path');
    centerNode = K.badge(K.stage, r.center.icon, 500, 340, 210, T.b[0], {tone: r.center.tone ?? 'main'});
    items = pos.map(([x, y], i) => { K.draw(ls[i], comeAt[i] - .1); return K.badge(K.stage, it.icon, x, y, 128, comeAt[i] + .1, {tone: it.tone ?? 'main', shape: it.shape ?? 'round'}); });
    if (!up) [...Array(n - keep)].forEach((_, k) => { const i = n - 1 - k; K.leave(items[i].o, leaveAt[k]); K.fade(ls[i], leaveAt[k], 1, 0); });
    endAt = [500, 340];
  } else {                                                                  // a row in a card
    const P = K.panel(130, 50, 740, 460, T.b[0]); parent = P.p;
    centerNode = K.badge(P.p, r.center.icon, 100, 100, 120, T.b[0] + .15, {tone: r.center.tone ?? 'main'});
    K.skel(P.p, 190, 72, [330, 210], T.b[0] + .2);
    items = [...Array(n)].map((_, i) => K.badge(P.p, it.icon, 120 + i * 166, 318, 132, comeAt[i], {tone: it.tone ?? 'main', shape: it.shape ?? 'round'}));
    if (!up) [...Array(n - keep)].forEach((_, k) => K.leave(items[n - 1 - k].o, leaveAt[k]));
    endAt = [640, 100];
  }
  if (up) K.punch(items[n - 1].p, T.after);
  if (!up && keep === 0 && !r.end && centerNode) { K.shake(centerNode.p, T.hit); K.fade(centerNode.o, T.hit + .3, 1, .45); }   // all gone: the owner is left empty
  if (r.end) { const e = K.badge(parent, r.end.icon, endAt[0] + (r.as === 'ring' ? 170 : 0), endAt[1] - (r.as === 'ring' ? 170 : 0), 100, T.hit, {tone: r.end.tone ?? 'neg'}); K.shake(e.p, T.after); }
});

/* ---------- ขั้นตอน: steps in order, one of them is marked ---------- */
LAYOUT('steps', {name: 'ขั้นตอน'}, (K, r, T) => {
  const its = r.items, m = r.mark ?? {at: its.length - 1, how: 'light'};
  if (r.as === 'list') {
    const P = K.panel(140, 70, 720, 440, T.b[0]);
    const rows = K.checklist(P.p, 70, 40, 580, its.map(it => it.label ? {text: it.label} : {skel: it.skel ?? .6}), T.b[1]);
    const row = rows[m.at];
    if (m.how === 'cross') { K.mark(P.p, 'cross', row.cx, row.cy, 84, T.hit); if (row.label) K.fade(row.label, T.hit + .1, 1, .38); K.punch(P.p, T.hit); }
    else K.mark(P.p, 'check', row.cx, row.cy, 84, T.hit);
    return;
  }
  const xs = [200, 500, 800], when = [T.b[0], T.b[1], T.b[2]];
  const nodes = its.map((it, i) => LG.thing(K, K.stage, it, xs[i], 270, 170, when[i]));
  for (let i = 0; i < 2; i++) LG.arrow(K, K.stage, xs[i] + 110, xs[i + 1] - 110, 270, when[i + 1] - .25);
  const x = xs[m.at], target = nodes[m.at];
  if (m.how === 'cross') { K.mark(K.stage, 'cross', x + 80, 180, 90, T.hit); K.fade(target.b.o, T.hit + .15, 1, .4); }
  else if (m.how === 'check') K.mark(K.stage, 'check', x + 80, 180, 90, T.hit);
  else LG.light(K, K.stage, its[m.at].icon, x, 270, 170, T.hit);
});

/* ---------- ก่อน → หลัง: one thing changes ---------- */
LAYOUT('change', {name: 'ก่อน → หลัง'}, (K, r, T) => {
  if (r.as === 'swap') {
    const a = K.badge(K.stage, r.from.icon, 250, 300, 210, T.b[0], {tone: r.from.tone ?? 'soft'});
    LG.arrow(K, K.stage, 390, 610, 300, T.b[1]);
    const b = K.badge(K.stage, r.to.icon, 750, 300, 210, T.hit, {tone: r.to.tone ?? 'acc'});
    K.fade(a.o, T.hit, 1, .4); K.punch(b.p, T.after);
    return;
  }
  if (r.as === 'meter') {
    const P = K.panel(110, 60, 780, 260, T.b[0]);
    K.measure(P.p, 60, 130, 660, T.b[0] + .15, r.v0, r.icon, {tone: 'acc', fill: 'u-bar-on'}).set(T.b[1] + .2, r.v1);
  } else {                                                                  // a switch turns on (or off)
    K.badge(K.stage, r.icon, 500, 150, 170, T.b[0], {tone: 'main'});
    const sw = K.toggle(K.stage, 300, 310, 400, T.b[0] + .15);
    if (r.on === false) { sw.set(T.b[1], 1); sw.set(T.hit - .2, 0); } else sw.set(T.hit - .2, 1);
  }
  if (r.then) {
    const [x, y] = r.as === 'meter' ? [500, 500] : [790, 330];
    const o = r.as === 'meter' ? K.badge(K.stage, r.then.icon, x, y, 170, T.b[2], {tone: r.then.how === 'cross' ? 'soft' : 'main'}) : null;
    if (r.then.how === 'cross') { if (o) K.shake(o.p, T.hit); K.mark(K.stage, 'cross', x + 100, y - 90, 84, T.hit); }
    else { if (o) K.punch(o.p, T.hit); K.mark(K.stage, 'check', x + 100, y - 90, 84, T.after); }
  }
});

/* ---------- หาให้เจอ: among several things, find the one (and fix it, pick it or cross it) ---------- */
LAYOUT('aim', {name: 'หาให้เจอ'}, (K, r, T) => {
  if (r.as === 'target') {
    K.target(K.stage, 500, 330, 250, T.b[0]).hit(T.hit, {angle: -35, dist: 460});
    K.mark(K.stage, 'check', 790, 110, 100, T.after);
    return;
  }
  const n = r.items.length, xs = n === 3 ? [220, 500, 780] : [170, 390, 610, 830], size = n === 3 ? 170 : 140, shape = r.round ? 'round' : 'tile';
  const its = r.items.map((ic, i) => K.badge(K.stage, ic, xs[i], 300, size, T.b[0] + i * .1, {tone: i === r.at && r.bad ? 'neg' : 'main', shape}));
  const x = xs[r.at];
  if (r.bad) K.shake(its[r.at].p, T.b[1]);
  K.brackets(K.stage, x, 300, size + 80, T.b[1] + .2, T.b[1] + .3);        // the focus closes in
  if (r.how === 'fix') {
    const w = K.badge(K.stage, 'wrench', x > 600 ? x - 140 : x + 140, 470, 110, T.b[2], {tone: 'acc'});
    K.shake(w.p, T.hit - .3);
    LG.light(K, K.stage, r.items[r.at], x, 300, size, T.hit, shape);
    K.mark(K.stage, 'check', x + size * .7, 300 - size * .75, 90, T.after);
  } else if (r.how === 'cross') {
    K.mark(K.stage, 'cross', x + size * .82, 300 - size * .82, 90, T.hit);
  } else {                                                                  // pick: the one lights up, the rest step back
    LG.light(K, K.stage, r.items[r.at], x, 300, size, T.hit, shape);
    its.forEach((b, i) => { if (i !== r.at) K.fade(b.o, T.hit, 1, .4); });
    K.mark(K.stage, 'check', x + size * .6, 300 - size * .7, 90, T.after);
  }
});

/* ================= the 20 recipes of the test ================= */
/* 6 meanings that already have hand-made pictures (to compare) — id <meaning>.lego keeps their place in the clip */
RECIPE('not-worth.lego', {meaning: 'not-worth', name: 'ไม่คุ้ม', say: ['บางคนกลัวว่าซื้อไปแล้ว', 'ไม่คุ้ม'], layout: 'versus', as: 'scale',
  a: {icon: 'banknote', tone: 'acc'}, b: {icon: 'package'}, win: 'a', recipe: 'A เทียบ B + ตาชั่ง + เงินกับสินค้า + เอียงลงฝั่งเงิน'});
RECIPE('undecided.lego', {meaning: 'undecided', name: 'ลังเล', say: ['หรือไม่รู้ว่า', 'จะซื้อดีไหม'], layout: 'versus', as: 'buttons',
  a: {icon: 'check', tone: 'acc'}, b: {icon: 'x', tone: 'soft'}, recipe: 'A เทียบ B + ปุ่มสองปุ่ม + เมาส์ไปมาแล้วค้างกลาง'});
RECIPE('fewer-customers.lego', {meaning: 'fewer-customers', name: 'ลูกค้าน้อยลง', say: ['พอเห็นลูกค้า', 'น้อยลง'], layout: 'count', as: 'ring',
  center: {icon: 'store'}, item: {icon: 'user', shape: 'round'}, n: 4, keep: 1, recipe: 'น้อยลง + ร้านกับลูกค้า 4 คนล้อมรอบ + หายทีละคนเหลือ 1'});
RECIPE('not-first.lego', {meaning: 'not-first', name: 'ข้อแรกไม่ใช่', say: ['สิ่งที่ควรทำอย่างแรก', 'ไม่ใช่'], layout: 'steps', as: 'list',
  items: [{label: 'การลดราคา'}, {skel: .72}, {skel: .5}], mark: {at: 0, how: 'cross'}, recipe: 'ขั้นตอน + รายการ 3 ข้อ + ข้อแรกโดนกากบาท'});
RECIPE('fix-spot.lego', {meaning: 'fix-spot', name: 'แก้ให้ถูกจุด', say: ['แล้วแก้ปัญหาให้', 'ถูกจุด'], layout: 'aim', as: 'pick',
  items: ['cog', 'cog', 'cog'], at: 1, bad: true, how: 'fix', recipe: 'หาให้เจอ + เฟือง 3 ตัว ตัวกลางเสีย + เล็งแล้วซ่อม'});
RECIPE('price-cut.lego', {meaning: 'price-cut', name: 'ลดราคาแล้วก็ยังไม่ซื้อ', say: ['ต่อให้เราลดราคาเพิ่ม', 'ยังไม่ซื้อ'], layout: 'change', as: 'meter',
  icon: 'tag', v0: .9, v1: .25, then: {icon: 'shopping-cart', how: 'cross'}, recipe: 'ก่อน → หลัง + แถบราคาลดลง + ตะกร้าโดนกากบาท'});
/* 14 new meanings — id lego.<name>@<place in the clip> */
RECIPE('lego.views-sales', {meaning: 'not-x-but-y', name: 'ไม่ใช่ยอดวิว แต่เป็นยอดขาย', say: ['สิ่งที่สำคัญไม่ใช่ยอดวิว', 'แต่เป็นยอดขาย'], layout: 'versus', as: 'cards',
  a: {icon: 'eye', label: 'ยอดวิว'}, b: {icon: 'shopping-cart', label: 'ยอดขาย', tone: 'acc'}, win: 'b', recipe: 'A เทียบ B + การ์ดยอดวิวกับยอดขาย + ยอดวิวโดนกากบาท ยอดขายได้เครื่องหมายถูก'});
RECIPE('lego.value-price', {meaning: 'value-over-price', name: 'คุณค่ามากกว่าราคา', say: ['ลูกค้าดูที่คุณค่า', 'มากกว่าราคา'], layout: 'versus', as: 'measure',
  a: {icon: 'tag', v: .35}, b: {icon: 'gem', v: .9, tone: 'acc'}, win: 'b', how: 'check', recipe: 'A เทียบ B + แถบวัดราคาสั้น แถบคุณค่ายาว + คุณค่าได้เครื่องหมายถูก'});
RECIPE('lego.short-long', {meaning: 'right-path', name: 'เลือกทางยาว', say: ['ระหว่างทางลัดกับทางยาว', 'เลือกทางยาว'], layout: 'versus', as: 'cards',
  a: {icon: 'zap', label: 'ทางลัด'}, b: {icon: 'sprout', label: 'ทางยาว', tone: 'acc'}, win: 'b', recipe: 'A เทียบ B + การ์ดทางลัดกับทางยาว + ทางลัดโดนกากบาท'});
RECIPE('lego.money-gone', {meaning: 'money-gone', name: 'เงินหมด', say: ['ทำไปทำมา', 'เงินหมด'], layout: 'count', as: 'row',
  center: {icon: 'wallet'}, item: {icon: 'coins', tone: 'acc', shape: 'round'}, n: 4, keep: 0, end: {icon: 'circle-alert', tone: 'neg'}, recipe: 'น้อยลง + กระเป๋าเงินกับเหรียญ 4 เหรียญ + หายจนหมด ขึ้นป้ายเตือน'});
RECIPE('lego.viewers-drop', {meaning: 'viewers-drop', name: 'คนดูปัดทิ้ง', say: ['คนดูค่อย ๆ', 'ปัดทิ้ง'], layout: 'count', as: 'bars',
  center: {icon: 'eye'}, recipe: 'น้อยลง + กราฟแท่งคนดูเตี้ยลงทีละแท่ง + ลูกศรลง'});
RECIPE('lego.followers-up', {meaning: 'followers-up', name: 'ผู้ติดตามเพิ่ม', say: ['พอโพสต์ทุกวัน', 'ผู้ติดตามเพิ่ม'], layout: 'count', as: 'bars', dir: 'up',
  center: {icon: 'users'}, recipe: 'มากขึ้น + กราฟแท่งผู้ติดตามสูงขึ้นทีละแท่ง + ลูกศรขึ้น'});
RECIPE('lego.team-grows', {meaning: 'team-grows', name: 'คนเข้ามาร่วมเรื่อย ๆ', say: ['พอเริ่มบอกต่อ คนก็', 'เข้ามาเรื่อย ๆ'], layout: 'count', as: 'ring', dir: 'up',
  center: {icon: 'store'}, item: {icon: 'user', tone: 'acc', shape: 'round'}, n: 4, recipe: 'มากขึ้น + ร้านตรงกลาง + คนโผล่มาล้อมทีละคน'});
RECIPE('lego.three-steps', {meaning: 'simple-steps', name: 'ถ่าย ตัด โพสต์', say: ['แค่ถ่าย ตัด แล้ว', 'โพสต์'], layout: 'steps',
  items: [{icon: 'camera', label: 'ถ่าย'}, {icon: 'scissors', label: 'ตัด'}, {icon: 'send', label: 'โพสต์'}], mark: {at: 2, how: 'light'}, recipe: 'ขั้นตอน + 3 ขั้นมีลูกศรต่อกัน + ขั้นสุดท้ายติดไฟ'});
RECIPE('lego.skip-step', {meaning: 'key-step', name: 'ขั้นที่คนชอบข้าม', say: ['ขั้นที่คนชอบข้ามคือ', 'เขียนบท'], layout: 'steps',
  items: [{icon: 'lightbulb'}, {icon: 'pen-line', label: 'เขียนบท'}, {icon: 'video'}], mark: {at: 1, how: 'light'}, recipe: 'ขั้นตอน + 3 ขั้น + ขั้นกลางติดไฟ'});
RECIPE('lego.happy', {meaning: 'satisfied', name: 'ลูกค้าพอใจ', say: ['พอแก้ตรงนี้ ลูกค้าก็', 'พอใจ'], layout: 'change', as: 'swap',
  from: {icon: 'frown', tone: 'soft'}, to: {icon: 'smile', tone: 'acc'}, recipe: 'ก่อน → หลัง + หน้าบึ้งกลายเป็นหน้ายิ้ม'});
RECIPE('lego.sales-jump', {meaning: 'sales-up', name: 'ยอดพุ่ง', say: ['หลังจากเปลี่ยนวิธีขาย', 'ยอดพุ่ง'], layout: 'change', as: 'meter',
  icon: 'shopping-cart', v0: .2, v1: .92, then: {icon: 'trending-up', how: 'check'}, recipe: 'ก่อน → หลัง + แถบยอดขายจากสั้นเป็นยาว + เครื่องหมายถูก'});
RECIPE('lego.bell-on', {meaning: 'call-to-action', name: 'เปิดแจ้งเตือน', say: ['อย่าลืม', 'เปิดแจ้งเตือน'], layout: 'change', as: 'toggle',
  icon: 'bell', then: {how: 'check'}, recipe: 'ก่อน → หลัง + กระดิ่งกับสวิตช์ + สวิตช์เปิด'});
RECIPE('lego.right-people', {meaning: 'target-audience', name: 'คนที่ใช่', say: ['เลือกขายให้', 'คนที่ใช่'], layout: 'aim', as: 'pick',
  items: ['user', 'user', 'user', 'user'], round: true, at: 2, recipe: 'หาให้เจอ + คน 4 คน + เล็งคนหนึ่ง คนนั้นติดไฟ ที่เหลือจาง'});
RECIPE('lego.weak-spot', {meaning: 'weak-spot', name: 'ปัญหาอยู่ที่ภาพปก', say: ['ปัญหาจริงอยู่ที่', 'ภาพปก'], layout: 'aim', as: 'pick',
  items: ['image', 'type', 'music'], at: 0, bad: true, how: 'cross', recipe: 'หาให้เจอ + ภาพ ตัวหนังสือ เพลง + เล็งภาพที่เสีย โดนกากบาท'});
RECIPE('lego.on-target', {meaning: 'on-target', name: 'ตรงกลุ่ม', say: ['ทำคอนเทนต์ให้', 'ตรงกลุ่ม'], layout: 'aim', as: 'target',
  recipe: 'หาให้เจอ + เป้า + ลูกศรเข้ากลาง'});
