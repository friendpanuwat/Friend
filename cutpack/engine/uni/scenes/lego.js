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
      l.className = 'u-label u-text'; l.textContent = it.label; K.enter(l, t + .1, 'lead');
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
  /* the same icon in the accent holder fades in over a thing (it "lights up" / is fixed).
     OLD VARIANTS ONLY: the cross-fade turns the icon the colour of its holder half way in split (Friend 2026-11-08:
     the old ones stay as they are); every NEW variant uses LG.lightUp below */
  light(K, parent, icon, cx, cy, size, t, shape = 'tile') {
    const ok = K.badge(parent, icon, cx, cy, size, null, {tone: 'acc', shape});
    K.fade(ok.o, t, 0, 1, {hold: true}); K.punch(ok.p, t + .05); return ok;
  },
  /* the way a thing lights up in every new variant (Friend 2026-11-08: "อันต่อๆไปที่จะทำในอนาคตก็แก้ปัญหานี้ด้วยนะ"):
     the lit holder appears solid in its middle at once and grows over the old one (the style's snap), so the icon is
     seen the whole time. A cross-fade (LG.light) turns the icon the colour of its holder half way wherever the two
     holders swap light and dark (split). Returns the lit node; .done = when it is full size (start a ripple or a word then) */
  lightUp(K, parent, icon, cx, cy, size, t, shape = 'tile') {
    const ok = K.badge(parent, icon, cx, cy, size, null, {tone: 'acc', shape});
    A(ok.o, [{opacity: 0}, {opacity: 1}], t, .04);
    K.move(ok.m, t, 'scale(.72)', 'none', {hold: true, kind: 'snap'});
    ok.done = LG.arrive('snap', t); K.punch(ok.p, ok.done); return ok;
  },
  /* when a move of this kind that starts at t is in place (most of the style's duration; springs settle after) */
  arrive: (kind, t) => t + (ST.motion[kind]?.d ?? .5) * .85,
  spread: (t0, t1, n) => [...Array(n)].map((_, k) => n < 2 ? t1 : t0 + (t1 - t0) * k / (n - 1)),
};

/* Step 2 (Friend 2026-11-07, quality bar): every frame now has a bigger hero, a soft halo behind it, small floating
   satellite tiles (✓ ? ✦ ↑ ↓), word chips, a faded card behind cards for depth, an idle float after things land,
   and one more beat after the key word (the winner lifts, the loser steps back). Recipes are unchanged. */

/* ---------- A เทียบ B: two things side by side, one wins ---------- */
LAYOUT('versus', {name: 'A เทียบ B'}, (K, r, T) => {
  const {a, b} = r, win = r.win ?? 'b', lose = win === 'a' ? 'b' : 'a';
  if (r.as === 'scale') {
    const q = K.sat(K.stage, 'circle-help', 500, 54, 84, T.b[1] - .1, {tone: 'soft'});      // weighing…
    const B = K.scale(K.stage, 500, 170, T.b[0]);
    const ia = K.badge(B.panL.p, a.icon, B.panL.item.cx, B.panL.item.cy, 150, T.b[1], {tone: a.tone ?? 'acc', kind: 'drop'});
    const ib = K.badge(B.panR.p, b.icon, B.panR.item.cx, B.panR.item.cy, 150, T.b[2], {tone: b.tone ?? 'main', kind: 'drop'});
    K.float(ia, T.b[1] + .6, T.hit - .2, .6); K.float(ib, T.b[2] + .6, T.hit - .2, .6);
    B.tilt(T.hit - .1, win === 'a' ? -11 : 11);                                             // the heavier side goes down
    K.punch((win === 'a' ? ia : ib).p, T.hit);
    K.fade(q.o, T.hit, 1, 0);
    K.sat(K.stage, 'arrow-down', win === 'a' ? 120 : 880, 420, 80, T.after, {tone: 'acc'});
  } else if (r.as === 'measure') {
    K.ghost(K.stage, 120, 100, 800, 440, T.b[0] - .05);
    const P = K.panel(90, 70, 800, 440, T.b[0]);
    const y = {a: 150, b: 330};
    const m = {a: K.measure(P.p, 70, y.a, 660, T.b[1], a.v, a.icon, {tone: a.tone ?? 'main', fill: win === 'a' ? 'u-bar-on' : 'u-bar-main', size: 120}),
               b: K.measure(P.p, 70, y.b, 660, T.b[2], b.v, b.icon, {tone: b.tone ?? 'main', fill: win === 'b' ? 'u-bar-on' : 'u-bar-main', size: 120})};
    if (r.how !== 'check') { K.shake(m[lose].track.p, T.hit); K.mark(P.p, 'cross', m[lose].end + 72, y[lose], 76, T.hit); }
    if (r.how !== 'cross') { K.sat(P.p, 'check', m[win].end + 72, y[win], 76, T.after, {tone: 'ok'}); K.sat(P.p, 'sparkles', 740, 72, 84, T.after + .15, {tone: 'acc'}); }
  } else if (r.as === 'buttons') {                                                          // the pointer cannot choose
    K.halo(K.stage, 500, 120, 150, T.b[0]);
    const top = K.badge(K.stage, r.top ?? 'shopping-cart', 500, 120, 160, T.b[0], {tone: 'main'});
    K.float(top, T.b[0] + .6);
    K.button(K.stage, 290, 400, 330, 140, a.icon, T.b[0] + .15, {tone: a.tone ?? 'acc'});
    K.button(K.stage, 710, 400, 330, 140, b.icon, T.b[0] + .25, {tone: b.tone ?? 'soft'});
    K.cursor(K.stage, [[T.b[1] - .2, 520, 660], [T.b[1] + .3, 320, 440], [T.b[2] + .3, 740, 440], [T.hit, 520, 460], [T.t1 - .2, 520, 460]]);
    K.sat(K.stage, 'circle-help', 640, 230, 96, T.hit, {tone: 'acc'});
    K.sat(K.stage, 'circle-help', 380, 260, 66, T.hit + .2, {tone: 'soft'});
  } else {                                                                                   // two cards
    const X = {a: 70, b: 530}, P = {}, hero = {};
    for (const k of ['a', 'b']) {
      const tk = k === 'a' ? T.b[0] : T.b[1];
      P[k] = K.panel(X[k], 70, 400, 500, tk);
      K.halo(P[k].p, 200, 170, 140, tk + .15);
      hero[k] = K.badge(P[k].p, r[k].icon, 200, 170, 170, tk + .15, {tone: r[k].tone ?? 'main'});
      K.float(hero[k], tk + .8, T.hit - .1, .7);
      if (r[k].label) K.chipC(P[k].p, r[k].label, 200, 330, tk + .3, {size: 44});
      K.skel(P[k].p, 100, r[k].label ? 400 : 330, [200, 130], tk + .35);
    }
    K.sat(K.stage, 'arrow-left-right', 500, 320, 84, T.b[1] + .4, {tone: 'soft', shape: 'round'});
    if (r.how !== 'check') { K.mark(P[lose].p, 'cross', 352, 46, 80, T.hit); K.fade(P[lose].o, T.hit + .15, 1, .45); K.move(P[lose].m, T.after, 'none', 'translateY(20px) scale(.95)'); }
    if (r.how !== 'cross') {
      K.punch(P[win].p, T.hit); K.move(P[win].m, T.after, 'none', 'translateY(-16px) scale(1.04)');
      K.sat(P[win].p, 'check', 352, 46, 80, T.after, {tone: 'ok'}); K.sat(P[win].p, 'sparkles', 52, 460, 84, T.after + .2, {tone: 'acc'});
    }
  }
});

/* ---------- มากขึ้น / น้อยลง: things arrive or leave one by one ---------- */
LAYOUT('count', {name: 'มากขึ้น / น้อยลง'}, (K, r, T) => {
  const n = r.n ?? 4, keep = r.keep ?? 1, up = r.dir === 'up', it = r.item ?? {icon: 'user', shape: 'round'};
  const leaveAt = LG.spread(T.b[2], T.hit, n - keep);                       // last ones go first
  const comeAt = up ? LG.spread(T.b[1], T.hit, n) : [...Array(n)].map((_, i) => T.b[0] + .35 + i * .1);
  const trendIcon = up ? 'trending-up' : 'trending-down';
  let items = [], parent = K.stage, centerNode = null;
  if (r.as === 'bars') {
    K.ghost(K.stage, 160, 50, 740, 560, T.b[0] - .05);
    const P = K.panel(130, 20, 740, 560, T.b[0]);
    K.badge(P.p, r.center?.icon ?? 'chart-column', 84, 82, 100, T.b[0] + .15, {tone: 'main'}); K.skel(P.p, 160, 66, [260, 170], T.b[0] + .2);
    K.bars(P.p, 80, 190, 580, 320, up ? [.22, .45, .7, .95] : [.95, .72, .48, .22], T.b[1] - .1, {step: (T.hit - T.b[1]) / 3.4, trend: true});
    K.halo(P.p, up ? 140 : 610, 230, 90, T.hit);
    K.sat(P.p, trendIcon, up ? 140 : 610, 230, 104, T.hit, {tone: 'acc'});
    return;
  } else if (r.as === 'ring') {
    const pos = [[210, 130], [790, 130], [210, 560], [790, 560]].slice(0, n);
    const lines = div('left:0;top:0;width:1000px;height:700px', K.stage,
      `<svg width="1000" height="700" style="overflow:visible">${pos.map(([x, y]) => `<path class="ln u-thin" d="M500 345L${x} ${y}"/>`).join('')}</svg>`);
    const ls = lines.querySelectorAll('path');
    K.halo(K.stage, 500, 345, 220, T.b[0]);
    centerNode = K.badge(K.stage, r.center.icon, 500, 345, 220, T.b[0], {tone: r.center.tone ?? 'main'});
    items = pos.map(([x, y], i) => { K.draw(ls[i], comeAt[i] - .1); const b = K.badge(K.stage, it.icon, x, y, 136, comeAt[i] + .1, {tone: it.tone ?? 'main', shape: it.shape ?? 'round'}); K.float(b, comeAt[i] + .7, T.t1, .6); return b; });
    if (!up) [...Array(n - keep)].forEach((_, k) => { const i = n - 1 - k; K.leave(items[i].o, leaveAt[k]); K.fade(ls[i], leaveAt[k], 1, 0); });
    K.sat(K.stage, trendIcon, 650, 230, 96, T.hit, {tone: up ? 'acc' : 'soft'});
  } else {                                                                   // a row in a card
    K.ghost(K.stage, 160, 80, 740, 470, T.b[0] - .05);
    const P = K.panel(130, 50, 740, 470, T.b[0]); parent = P.p;
    centerNode = K.badge(P.p, r.center.icon, 104, 104, 128, T.b[0] + .15, {tone: r.center.tone ?? 'main'});
    K.skel(P.p, 200, 76, [330, 210], T.b[0] + .2);
    items = [...Array(n)].map((_, i) => { const b = K.badge(P.p, it.icon, 125 + i * 163, 330, 140, comeAt[i], {tone: it.tone ?? 'main', shape: it.shape ?? 'round'}); K.float(b, comeAt[i] + .6, T.t1, .5); return b; });
    if (!up) [...Array(n - keep)].forEach((_, k) => K.leave(items[n - 1 - k].o, leaveAt[k]));
    if (!r.end) K.sat(P.p, trendIcon, 640, 104, 92, T.hit, {tone: up ? 'acc' : 'soft'});
  }
  if (up) K.punch(items[n - 1].p, T.after);
  if (!up && keep === 0 && !r.end && centerNode) { K.shake(centerNode.p, T.hit); K.fade(centerNode.o, T.hit + .3, 1, .45); }
  if (r.end) { const e = K.badge(parent, r.end.icon, r.as === 'ring' ? 650 : 640, r.as === 'ring' ? 230 : 104, 100, T.hit, {tone: r.end.tone ?? 'neg'}); K.shake(e.p, T.after); }
});

/* ---------- ขั้นตอน: steps in order, one of them is marked ---------- */
LAYOUT('steps', {name: 'ขั้นตอน'}, (K, r, T) => {
  const its = r.items, m = r.mark ?? {at: its.length - 1, how: 'light'};
  if (r.as === 'list') {
    K.ghost(K.stage, 170, 100, 720, 440, T.b[0] - .05);
    const P = K.panel(140, 70, 720, 440, T.b[0]);
    const rows = K.checklist(P.p, 70, 40, 580, its.map(it => it.label ? {text: it.label} : {skel: it.skel ?? .6}), T.b[1]);
    const row = rows[m.at];
    if (m.how === 'cross') { K.mark(P.p, 'cross', row.cx, row.cy, 84, T.hit); if (row.label) K.fade(row.label, T.hit + .1, 1, .38); K.punch(P.p, T.hit); K.sat(K.stage, 'circle-alert', 820, 90, 84, T.after, {tone: 'neg'}); }
    else { K.mark(P.p, 'check', row.cx, row.cy, 84, T.hit); K.sat(K.stage, 'sparkles', 820, 90, 72, T.after, {tone: 'acc'}); }
    return;
  }
  const xs = [185, 500, 815], when = [T.b[0], T.b[1], T.b[2]], cards = [];
  its.forEach((it, i) => {
    const c = K.panel(xs[i] - 135, 80, 270, 320, when[i]);
    if (i === m.at && m.how === 'light') K.halo(c.p, 135, 128, 130, T.hit);
    const b = K.badge(c.p, it.icon, 135, 128, 170, when[i] + .1, {tone: it.tone ?? 'main'});
    K.float(b, when[i] + .7, T.t1, .5);
    if (it.label) K.chipC(c.p, it.label, 135, 270, when[i] + .25, {size: 44}); else K.skel(c.p, 70, 262, [130], when[i] + .25);
    cards.push({c, b});
  });
  for (let i = 0; i < 2; i++) K.sat(K.stage, 'arrow-right', (xs[i] + xs[i + 1]) / 2, 240, 60, when[i + 1] - .2, {tone: 'soft', shape: 'round', k: .6});
  for (let i = 0; i < m.at; i++) if (m.how !== 'cross') K.sat(cards[i].c.p, 'check', 240, 24, 72, when[i + 1] + .2, {tone: 'ok', k: .5});   // steps before are done
  const target = cards[m.at];
  if (m.how === 'cross') { K.mark(target.c.p, 'cross', 240, 24, 84, T.hit); K.fade(target.c.o, T.hit + .15, 1, .45); K.move(target.c.m, T.after, 'none', 'translateY(20px)'); }
  else if (m.how === 'check') K.sat(target.c.p, 'check', 240, 24, 84, T.hit, {tone: 'ok'});
  else { LG.light(K, target.c.p, its[m.at].icon, 135, 128, 170, T.hit); K.move(target.c.m, T.after, 'none', 'translateY(-16px) scale(1.05)'); K.sat(K.stage, 'sparkles', xs[m.at] + 120, 64, 84, T.after, {tone: 'acc'}); }
});

/* ---------- ก่อน → หลัง: one thing changes ---------- */
LAYOUT('change', {name: 'ก่อน → หลัง'}, (K, r, T) => {
  if (r.as === 'swap') {
    const A0 = K.panel(80, 130, 340, 400, T.b[0]);
    K.badge(A0.p, r.from.icon, 170, 170, 170, T.b[0] + .15, {tone: r.from.tone ?? 'soft'});
    if (r.from.label) K.chipC(A0.p, r.from.label, 170, 320, T.b[0] + .3, {size: 40}); else K.skel(A0.p, 80, 310, [180, 120], T.b[0] + .3);
    K.sat(K.stage, 'arrow-right', 500, 330, 96, T.b[1], {tone: 'main', shape: 'round', k: .5});
    const B1 = K.panel(580, 130, 340, 400, T.hit - .05);
    K.halo(B1.p, 170, 170, 150, T.hit);
    const hero = K.badge(B1.p, r.to.icon, 170, 170, 180, T.hit, {tone: r.to.tone ?? 'acc'});
    K.float(hero, T.hit + .6, T.t1, .7);
    if (r.to.label) K.chipC(B1.p, r.to.label, 170, 320, T.hit + .15, {size: 40}); else K.skel(B1.p, 80, 310, [180, 120], T.hit + .15);
    K.fade(A0.o, T.hit, 1, .45); K.move(A0.m, T.hit, 'none', 'translateY(18px) scale(.95)');
    K.sat(K.stage, 'sparkles', 900, 120, 84, T.after, {tone: 'acc'}); K.sat(K.stage, 'sparkles', 600, 560, 72, T.after + .15, {tone: 'acc'});
    return;
  }
  if (r.as === 'meter') {
    K.ghost(K.stage, 140, 90, 760, 270, T.b[0] - .05);
    const P = K.panel(110, 60, 780, 270, T.b[0]);
    const mm = K.measure(P.p, 70, 135, 640, T.b[0] + .15, r.v0, r.icon, {tone: 'acc', fill: 'u-bar-on', size: 120});
    mm.set(T.b[1] + .2, r.v1);
    K.sat(P.p, r.v1 >= r.v0 ? 'trending-up' : 'trending-down', 720, 40, 76, T.b[1] + .6, {tone: 'soft', k: .6});
  } else {                                                                   // a switch turns on (or off), in a settings card
    K.ghost(K.stage, 170, 170, 700, 300, T.b[0] - .05);
    const P = K.panel(140, 140, 700, 300, T.b[0]);
    K.halo(P.p, 130, 150, 110, T.b[0] + .1);
    K.badge(P.p, r.icon, 130, 150, 140, T.b[0] + .1, {tone: 'main'});
    K.skel(P.p, 230, 120, [190, 130], T.b[0] + .2);
    const sw = K.toggle(P.p, 450, 100, 200, T.b[0] + .2);
    if (r.on === false) { sw.set(T.b[1], 1); sw.set(T.hit - .2, 0); } else sw.set(T.hit - .2, 1);
  }
  if (r.then) {
    const [x, y] = r.as === 'meter' ? [500, 520] : [790, 520];
    if (r.as === 'meter') {
      K.halo(K.stage, x, y, 140, T.b[2]);
      const o = K.badge(K.stage, r.then.icon, x, y, 180, T.b[2], {tone: r.then.how === 'cross' ? 'soft' : 'main'});
      if (r.then.how === 'cross') { K.shake(o.p, T.hit); K.mark(K.stage, 'cross', x + 110, y - 95, 84, T.hit); }
      else { K.punch(o.p, T.hit); K.sat(K.stage, 'check', x + 110, y - 95, 84, T.after, {tone: 'ok'}); }
    } else if (r.then.how === 'check') K.sat(K.stage, 'check', 760, 160, 84, T.after, {tone: 'ok'});
    else K.mark(K.stage, 'cross', 760, 160, 84, T.after);
  }
  if (r.as === 'toggle' && r.on !== false) K.sat(K.stage, 'sparkles', 860, 470, 80, T.after + .15, {tone: 'acc'});
});

/* ---------- หาให้เจอ: among several things, find the one (and fix it, pick it or cross it) ---------- */
LAYOUT('aim', {name: 'หาให้เจอ'}, (K, r, T) => {
  if (r.as === 'target') {
    K.halo(K.stage, 500, 330, 320, T.b[0]);
    K.target(K.stage, 500, 330, 260, T.b[0]).hit(T.hit, {angle: -35, dist: 460});
    K.sat(K.stage, 'check', 800, 110, 100, T.after, {tone: 'ok'});
    K.sat(K.stage, 'sparkles', 200, 560, 84, T.after + .2, {tone: 'acc'});
    return;
  }
  const n = r.items.length, xs = n === 3 ? [210, 500, 790] : [160, 385, 615, 840], size = n === 3 ? 180 : 150, shape = r.round ? 'round' : 'tile', y = 320;
  const its = r.items.map((ic, i) => { const b = K.badge(K.stage, ic, xs[i], y, size, T.b[0] + i * .1, {tone: i === r.at && r.bad ? 'neg' : 'main', shape}); K.float(b, T.b[0] + .7 + i * .1, T.b[1] + .2, .5); return b; });
  const x = xs[r.at];
  if (r.bad) K.shake(its[r.at].p, T.b[1]);
  K.halo(K.stage, x, y, size, T.b[1] + .3);
  K.brackets(K.stage, x, y, size + 90, T.b[1] + .2, T.b[1] + .3);                     // the focus closes in
  if (r.how === 'fix') {
    const w = K.sat(K.stage, 'wrench', x > 600 ? x - 150 : x + 150, 500, 112, T.b[2], {tone: 'acc'});
    K.shake(w.p, T.hit - .3);
    LG.light(K, K.stage, r.items[r.at], x, y, size, T.hit, shape);
    K.sat(K.stage, 'check', x + size * .72, y - size * .78, 90, T.after, {tone: 'ok'});
  } else if (r.how === 'cross') {
    K.mark(K.stage, 'cross', x + size * .82, y - size * .82, 90, T.hit);
    its.forEach((b, i) => { if (i !== r.at) K.fade(b.o, T.after, 1, .5); });
  } else {                                                                   // pick: the one lights up, the rest step back
    LG.light(K, K.stage, r.items[r.at], x, y, size, T.hit, shape);
    its.forEach((b, i) => { if (i !== r.at) { K.fade(b.o, T.hit, 1, .4); K.move(b.m, T.hit, 'none', 'translateY(18px) scale(.92)'); } });
    K.sat(K.stage, 'check', x + size * .62, y - size * .72, 90, T.after, {tone: 'ok'});
    K.sat(K.stage, 'sparkles', x - size * .7, y + size * .6, 80, T.after + .2, {tone: 'acc'});
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
