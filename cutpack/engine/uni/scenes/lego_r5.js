/* =====================================================================
   CutPack · uni · LEGO round 5 (Friend 2026-11-08: "เริ่มงานถัดไปตามที่คุณแนะนำ"): two more variants for each of the
   five categories that the category test (round 15, page 16) showed short of variants: B06 คำถาม (all 8 questions could
   use one variant), B07 คำเตือน, B05 ถูกกับผิด, B12 เหตุกับผล, B08 เป้าหมาย.
   R3.both: one composition on the 600 × 340 small canvas, the full-screen form is the same picture scaled 1.6×.
   Slots are the categories' own (see cat_ai.py), nothing in a picture comes from anywhere else.
   Rules (DECISIONS): things that link two things sit on the line between them · a light, ring or word of a moving thing
   starts after it arrives · marks sit in the middle of a gap · words centred under their icon · rings are the thing's own
   shape (R1.ripple) · lighting up = LG.lightUp · a thing replaced by another sits exactly under it and moves with it ·
   no red sign on a red thing (calm() in cats.js) · nothing past x 550 below y 200 (x 940 on screen) · no sentence inside.
   ===================================================================== */
const R5 = {
  /* a gear outline (n teeth) centred in a node of size 2R; the icon badge sits in it and does not turn */
  gear(K, g, cx, cy, R, t, n = 10) {
    const r = R * .82, st = 2 * Math.PI / n, P = (a, rr) => `${(R + rr * Math.cos(a)).toFixed(1)} ${(R + rr * Math.sin(a)).toFixed(1)}`;
    let d = '';
    for (let i = 0; i < n; i++) { const a = i * st; d += `${i ? 'L' : 'M'}${P(a - .32 * st, r)}L${P(a - .17 * st, R)}L${P(a + .17 * st, R)}L${P(a + .32 * st, r)}`; }
    const n_ = node(g, cx - R, cy - R, 2 * R, 2 * R, '', `<svg width="${2 * R}" height="${2 * R}" style="overflow:visible"><path class="ln u-thin" d="${d}Z"/></svg>`);
    n_.m.style.transformOrigin = '50% 50%'; K.enter(n_.o, t, 'pop'); return n_;
  },
  /* an arrow-shaped board (dir -1 = points left, 1 = right) in the style's main holder */
  board(K, g, x, y, w, h, dir, t) {
    const b = node(g, x, y, w, h, 'u-badge u-main'); const k = h / 2;
    b.p.style.borderRadius = '10px';
    b.p.style.clipPath = dir < 0 ? `polygon(${k}px 0,100% 0,100% 100%,${k}px 100%,0 50%)` : `polygon(0 0,calc(100% - ${k}px) 0,100% 50%,calc(100% - ${k}px) 100%,0 100%)`;
    K.enter(b.o, t, 'pop'); return b;
  },
};

/* ================= B06 คำถาม: about {icon, label?}, options? [2], answer? ================= */
/* 1 · a magnifier searches over the one in doubt and stops on it: a ? (or the answer) once it has stopped */
R3.both('B06', 'search', 'แว่นขยายส่องหา', (K, s, T, g) => {
  const it = s.about ?? {icon: 'user'}, C = {x: 240, y: 150}, S = 120, LR = 104, HL = 110;   // the ring stays clear of the tile's corners
  const who = K.badge(g, it.icon, C.x, C.y, S, T.b[0], {tone: it.tone ?? 'main'});
  const LY = C.y + LR + 2;                                                   // words under the lens ring, centred on the icon
  const lab = it.label ? R4.word(K, g, it.label, C.x, LY, 40, T.b[0] + .2, 260) : null;
  /* the lens is centred on its node's (LR, LR); the handle points right along the lens's own middle line */
  const W = 2 * LR + HL + 20, mg = node(g, C.x - LR, C.y - LR, W, 2 * LR, '',
    `<svg width="${W}" height="${2 * LR}" style="overflow:visible">` +
    `<circle class="ln" cx="${LR}" cy="${LR}" r="${LR - 6}"/><path class="ln u-thick" d="M${2 * LR} ${LR}H${2 * LR + HL}"/></svg>`);
  const path = [[-90, -20], [70, -30], [-30, 20], [0, 0]];                  // where the lens goes (offsets from its stop)
  A(mg.m, path.map(([x, y], i) => ({transform: `translate(${x}px,${y}px)`, offset: i / (path.length - 1)})), T.b[1], T.hit - T.b[1], {e: EASE.inout, f: 'both'});
  A(mg.o, [{opacity: 0}, {opacity: 1}], T.b[1] - .1, .25, {f: 'both'});
  if (s.answer) {
    const ans = LG.lightUp(K, g, s.answer.icon, C.x, C.y, S, T.hit + .05, it.shape ?? 'tile');
    K.fade(who.o, ans.done, 1, 0); R1.ripple(K, ans, ans.done);
    if (s.answer.label) { if (lab) K.fade(lab, ans.done - .1, 1, 0); R4.word(K, g, s.answer.label, C.x, LY, 40, ans.done, 260); }
  } else {
    const q = K.badge(g, 'circle-help', 440, 58, 84, T.hit + .05, {tone: 'acc', shape: 'round'});
    K.shake(who.p, T.hit + .1); R1.ripple(K, q, LG.arrive('pop', T.hit + .05));
  }
});

/* 2 · a signpost with two ways; the one in doubt stands at its foot and looks both ways */
R3.both('B06', 'signpost', 'ป้ายทางแยกสองทาง', (K, s, T, g) => {
  const it = s.about ?? {icon: 'user'}, X = 300, opts = s.options?.length === 2 ? s.options : null;
  const post = node(g, X - 10, 92, 20, 220, 'u-col'); post.p.style.borderRadius = '8px'; K.enter(post.o, T.b[0], 'rise');
  const B = [R5.board(K, g, X - 200, 100, 200, 66, -1, T.b[0] + .25), R5.board(K, g, X, 176, 200, 66, 1, T.b[0] + .4)];
  B.forEach((b, i) => {
    const o = opts?.[i];
    if (o) {
      SM.ico(K, b.p, o.icon, i ? 52 : 148, 33, 40, T.b[0] + .5 + i * .1);
      if (o.label) R4.word(K, b.p, o.label, i ? 128 : 72, 12, 30, T.b[0] + .55 + i * .1, 80);
    }
  });
  const who = K.badge(g, it.icon, X, 290, 88, T.b[0] + .15, {tone: it.tone ?? 'main', shape: 'round'});
  /* it looks one way, then the other, then back (small turns of the head, not a walk) */
  A(who.m, [0, -14, 14, -10, 0].map(x => ({transform: `translateX(${x}px)`})), T.b[1], T.hit - T.b[1], {e: 'ease-in-out', f: 'none'});
  B.forEach((b, i) => K.shake(b.p, T.hit + i * .08));
  if (s.answer) { const a = K.badge(g, s.answer.icon, X, 48, 84, T.hit + .1, {tone: 'acc', shape: 'round'}); R1.ripple(K, a, LG.arrive('pop', T.hit + .1)); }
  else { const q = K.badge(g, 'circle-help', X, 48, 84, T.hit + .1, {tone: 'acc', shape: 'round'}); R1.ripple(K, q, LG.arrive('pop', T.hit + .1)); }
});

/* ================= B07 คำเตือน: thing {icon, label?}, how ('cross' | 'flag'), sign? ================= */
/* 1 · caution tape: two tapes cross over the thing (don't) or one stretches in front of it (careful) */
R3.both('B07', 'tape', 'เทปกั้นคาด', (K, s, T, g) => {
  const it = s.thing, P = R3.panel(K, g, 140, 22, 320, 296, T.b[0]);
  const hero = K.badge(P.p, it.icon, 160, 118, 140, T.b[0] + .15, {tone: it.tone ?? 'main'});
  if (it.label) K.chipC(P.p, it.label, 160, 238, T.b[0] + .3, {size: 38}); else K.skel(P.p, 70, 230, [180], T.b[0] + .3);
  const tape = (cx, cy, len, deg, t) => {
    const w = div(`left:${cx - len / 2}px;top:${cy - 22}px;width:${len}px;height:44px;transform:rotate(${deg}deg)`, g);
    const band = div('inset:0;transform-origin:0 50%', w); band.className = 'u-tape';
    A(band, [{transform: 'scaleX(0)'}, {transform: 'none'}], t, .22, {e: 'cubic-bezier(.2,.8,.3,1)'});
    return w;
  };
  if (s.how === 'cross') {
    tape(300, 150, 440, -18, T.hit - .12); tape(300, 150, 440, 18, T.hit + .06);
    K.shake(P.p, T.hit + .3); K.fade(hero.o, T.after, 1, .5);
  } else {
    tape(300, 296, 460, -4, T.hit - .05);
    K.shake(P.p, T.hit + .2);
  }
  K.sat(g, s.sign ?? 'triangle-alert', 470, 36, 76, T.b[1], {tone: 'neg'});
});

/* 2 · a stop hand comes in front of the thing and pushes it back (only for "do not") */
R3.both('B07', 'hand', 'มือห้ามดันกลับ', (K, s, T, g) => {
  const it = s.thing, C = {x: 200, y: 150}, S = 150;
  const hero = K.badge(g, it.icon, C.x, C.y, S, T.b[0], {tone: it.tone ?? 'main'});
  if (it.label) R4.word(K, g, it.label, C.x, C.y + S / 2 + 12, 40, T.b[0] + .2, 260);
  const go = T.hit - (ST.motion.snap?.d ?? .5) * .85, land = LG.arrive('snap', go);
  const hand = K.badge(g, 'hand', 420, C.y, 150, null, {tone: 'neg', shape: 'round'});
  K.fade(hand.o, go, 0, 1, {hold: true}); K.move(hand.m, go, 'translateX(150px)', 'none', {hold: true, kind: 'snap'});
  K.move(hero.m, land, 'none', 'translateX(-26px) scale(.94)');            // pushed back once the hand is there
  K.fade(hero.o, land + .1, 1, .5); R1.ripple(K, hand, land, {tone: 'neg'});
}, s => s.how === 'cross');

/* ================= B05 ถูกกับผิด: wrong {icon, label?}, right {icon, label?} ================= */
/* 1 · the wrong one is crossed and drops into the bin, then the right one lights up */
R3.both('B05', 'bin', 'ข้อผิดลงถังขยะ', (K, s, T, g) => {
  const X = 140, R = {x: 410, y: 150};
  const bin = K.badge(g, 'trash-2', X, 256, 120, T.b[0], {tone: 'soft'});
  const w = K.badge(g, s.wrong.icon, X, 80, 110, T.b[0] + .15, {tone: 'main'});
  const wl = s.wrong.label ? R4.word(K, g, s.wrong.label, X, 140, 34, T.b[0] + .3, 230) : null;
  K.badge(g, s.right.icon, R.x, R.y, 150, T.b[1], {tone: 'soft'});
  K.mark(w.p, 'cross', 55, 55, 90, T.b[2]);
  const go = T.hit - (ST.motion.snap?.d ?? .5) * .85, land = LG.arrive('snap', go);
  if (wl) K.fade(wl, go - .2, 1, 0);
  K.move(w.m, go, 'none', 'translateY(176px) scale(.45)', {kind: 'snap'}); K.fade(w.o, land - .08, 1, 0);   // straight down into the bin
  K.punch(bin.p, land);
  const lit = LG.lightUp(K, g, s.right.icon, R.x, R.y, 150, land);
  R1.ripple(K, lit, lit.done);
  if (s.right.label) R4.word(K, g, s.right.label, R.x, R.y + 87, 40, lit.done, 240);
  K.sat(g, 'check', 500, 62, 70, lit.done + .1, {tone: 'ok', k: .5});
});

/* 2 · thumbs: a thumbs-down under the wrong one, a thumbs-up under the right one; the wrong one steps back */
R3.both('B05', 'thumbs', 'นิ้วโป้งลงกับนิ้วโป้งขึ้น', (K, s, T, g) => {
  const col = (x, it, t) => {
    const c = node(g, x - 120, 0, 240, 340, '');
    const b = K.badge(c.p, it.icon, 120, 110, 130, t, {tone: 'main'});
    if (it.label) R4.word(K, c.p, it.label, 120, 184, 38, t + .15, 220);
    return {c, b};
  };
  const W = col(160, s.wrong, T.b[0]), R = col(440, s.right, T.b[1]);
  const down = K.badge(W.c.p, 'thumbs-down', 120, 296, 70, T.hit - .15, {tone: 'neg', shape: 'round'});
  const up = K.badge(R.c.p, 'thumbs-up', 120, 296, 70, T.hit, {tone: 'acc', shape: 'round'});
  const after = LG.arrive('pop', T.hit);
  K.shake(down.p, LG.arrive('pop', T.hit - .15));
  K.fade(W.c.o, after, 1, .45); K.move(W.c.m, after, 'none', 'translateY(14px)');
  const lit = LG.lightUp(K, R.c.p, s.right.icon, 120, 110, 130, after);      // inside the column: it moves with it
  K.move(R.c.m, lit.done, 'none', 'translateY(-10px)');
  R1.ripple(K, up, after); R1.ripple(K, lit, lit.done);
});

/* ================= B12 เหตุกับผล: items [3 {icon, label?}], end? ================= */
/* 1 · three gears turn each other; the last one's thing lights up */
R3.both('B12', 'gears', 'เฟืองสามตัวหมุนต่อกัน', (K, s, T, g) => {
  const xs = [140, 300, 460], Y = 150, R = 86, its = s.items.slice(0, 3);
  const gs = xs.map((x, i) => R5.gear(K, g, x, Y, R, T.b[0] + i * .12));
  gs[1].f.style.transform = 'rotate(18deg)';                                // half a tooth: the teeth sit in each other's gaps
  const bs = its.map((it, i) => K.badge(g, it.icon, xs[i], Y, 92, T.b[0] + .2 + i * .12, {tone: it.tone ?? 'main', shape: 'round'}));
  its.forEach((it, i) => { if (it.label) R4.word(K, g, it.label, xs[i], Y + R + 8, 32, T.b[0] + .35 + i * .12, 150); });
  gs.forEach((n, i) => A(n.m, [{transform: 'rotate(0deg)'}, {transform: `rotate(${i % 2 ? -180 : 180}deg)`}], T.b[1], T.hit - T.b[1], {e: EASE.inout, f: 'forwards'}));
  const lit = LG.lightUp(K, g, its[2].icon, xs[2], Y, 92, T.hit, 'round');
  R1.ripple(K, lit, lit.done);
  if (s.end) K.sat(g, s.end.icon, 544, 36, 66, lit.done, {tone: s.end.tone ?? 'main'});
});

/* 2 · a ball bounces from the first thing to the next; the last one lights up when the ball lands on it */
R3.both('B12', 'bounce', 'ลูกบอลกระเด้งส่งต่อ', (K, s, T, g) => {
  const xs = [120, 300, 480], Y = 196, S = 120, D = 36, its = s.items.slice(0, 3);
  const floor = div('left:0;top:0;width:600px;height:340px', g, `<svg width="600" height="340"><path class="ln u-thin" d="M40 ${Y + S / 2 + 4}H540"/></svg>`);
  K.draw(floor.querySelector('path'), T.b[0]);
  const ts = its.map((it, i) => K.badge(g, it.icon, xs[i], Y, S, T.b[0] + .1 + i * .1, {tone: it.tone ?? 'main'}));
  its.forEach((it, i) => { if (it.label) R4.word(K, g, it.label, xs[i], Y + S / 2 + 12, 32, T.b[0] + .25 + i * .1, 160); });
  const ball = node(g, 0, 0, D, D, 'u-badge u-main');   // not the accent: it ends on the lit (accent) tile ball.p.style.borderRadius = '50%';
  const top = i => [xs[i] - D / 2, Y - S / 2 - D], start = [8, 0];
  const hops = [[T.b[0] + .4, start, top(0)], [T.b[1] + .2, top(0), top(1)], [T.hit - .42, top(1), top(2)]];
  K.enter(ball.o, hops[0][0], 'pop');
  hops.forEach(([t, a, b], i) => {
    R2.hop(ball.m, t, .42, a, b, i ? 90 : 40);
    if (i < 2) A(ts[i].m, [{transform: 'translateY(0)'}, {transform: 'translateY(10px)'}, {transform: 'translateY(0)'}], t + .42, .3, {e: 'ease-out', f: 'none'});
  });
  const lit = LG.lightUp(K, g, its[2].icon, xs[2], Y, S, T.hit);           // the ball has landed on it (hop ends at the key word)
  R1.ripple(K, lit, lit.done);
  if (s.end) K.sat(g, s.end.icon, 544, 50, 66, lit.done, {tone: s.end.tone ?? 'main'});
});

/* ================= B08 เป้าหมาย: goal {icon, label?}, who? ================= */
/* 1 · the one runs to the finish line; the ribbon breaks as it gets there and the goal lights up */
R3.both('B08', 'finish', 'วิ่งเข้าเส้นชัย', (K, s, T, g) => {
  const G = {x: 450, y: 70}, P = [390, 510], RY = 214, FY = 306;
  const floor = div('left:0;top:0;width:600px;height:340px', g, `<svg width="600" height="340"><path class="ln u-thin" d="M40 ${FY}H540"/></svg>`);
  K.draw(floor.querySelector('path'), T.b[0]);
  P.forEach((x, i) => { const p = node(g, x - 6, 178, 12, FY - 178, 'u-col'); p.p.style.borderRadius = '6px'; K.enter(p.o, T.b[0] + .1 + i * .08, 'rise'); });
  const half = (x0, x1, origin, t) => {
    const h = node(g, x0, RY - 5, x1 - x0, 10, 'u-badge u-acc'); h.p.style.borderRadius = '5px'; h.m.style.transformOrigin = origin;
    K.enter(h.o, t, 'lead'); return h;
  };
  const L = half(P[0], (P[0] + P[1]) / 2, '0% 50%', T.b[0] + .3), Rr = half((P[0] + P[1]) / 2, P[1], '100% 50%', T.b[0] + .3);
  K.badge(g, s.goal.icon, G.x, G.y, 96, T.b[0] + .2, {tone: 'soft'});
  if (s.goal.label) R4.word(K, g, s.goal.label, G.x, G.y + 54, 34, T.b[0] + .35, 170);
  const runner = K.badge(g, s.who ?? 'user', G.x, FY - 50, 96, T.b[1] - .25, {tone: 'main', shape: 'round'});
  A(runner.m, [{transform: 'translateX(-340px)'}, {transform: 'none'}], T.b[1], T.hit - T.b[1], {e: 'cubic-bezier(.3,0,.25,1)', f: 'both'});
  /* the ribbon breaks where the runner reaches it (its middle, on the key word) */
  K.move(L.m, T.hit, 'none', 'rotate(70deg)', {kind: 'tilt'}); K.move(Rr.m, T.hit, 'none', 'rotate(-70deg)', {kind: 'tilt'});
  const lit = LG.lightUp(K, g, s.goal.icon, G.x, G.y, 96, T.hit + .05);
  R1.ripple(K, lit, lit.done); K.punch(runner.p, T.hit);
});

/* 2 · a padlock opens on the key word and the goal lights up inside it */
R3.both('B08', 'unlock', 'กุญแจปลดล็อก', (K, s, T, g) => {
  const C = {x: 300, y: 196}, S = 150;
  const sh = div('left:0;top:0;width:600px;height:340px', g,
    `<svg width="600" height="340"><path class="ln u-thick" d="M${C.x - 52} ${C.y - S / 2 + 10}V${C.y - 112}a52 52 0 0 1 104 0V${C.y - S / 2 + 10}"/></svg>`);
  const shm = div('inset:0', sh); shm.appendChild(sh.firstChild); shm.style.transformOrigin = `${C.x + 52}px ${C.y - S / 2 + 10}px`;
  K.enter(sh, T.b[0], 'drop');
  const body = K.badge(g, 'lock', C.x, C.y, S, T.b[0] + .1, {tone: 'main'});  // drawn after the shackle: its legs go behind
  if (s.who) { const w = K.badge(g, s.who, 110, 210, 84, T.b[1], {tone: 'main', shape: 'round'}); K.punch(w.p, T.hit + .4); }
  K.shake(body.p, T.b[2]);
  A(shm, [{transform: 'none'}, {transform: 'translateY(-26px)', offset: .45}, {transform: 'translateY(-26px) rotate(-38deg)'}], T.hit - .2, .45, {e: 'ease-out', f: 'forwards'});
  const lit = LG.lightUp(K, g, s.goal.icon, C.x, C.y, S, T.hit + .25);     // once the shackle is up
  R1.ripple(K, lit, lit.done);
  if (s.goal.label) R4.word(K, g, s.goal.label, C.x, C.y + S / 2 + 10, 38, lit.done, 280);
});

/* ================= sample sentences (general, not from Friend's script) ================= */
SENTENCE('r5.start', {cat: 'B06', name: 'มือใหม่สงสัยว่าต้องเริ่มยังไง', say: ['มือใหม่หลายคนสงสัยว่า', 'ต้องเริ่มยังไง'], about: {icon: 'user', label: 'มือใหม่'}});
SENTENCE('r5.ads', {cat: 'B07', name: 'อย่ายิงแอดตอนยังไม่มีรีวิว', say: ['ยังไม่มีรีวิว อย่าเพิ่ง', 'ยิงแอด'], thing: {icon: 'megaphone', label: 'ยิงแอด'}, how: 'cross'});
SENTENCE('r5.post', {cat: 'B05', name: 'ไม่ใช่โพสต์เยอะ แต่โพสต์สม่ำเสมอ', say: ['ไม่ต้องโพสต์เยอะ', 'แค่สม่ำเสมอ'],
  wrong: {icon: 'layers', label: 'โพสต์เยอะ'}, right: {icon: 'calendar-check', label: 'สม่ำเสมอ'}});
SENTENCE('r5.sleep', {cat: 'B12', name: 'นอนน้อย เหนื่อย ทำงานพลาด', say: ['นอนน้อย ก็เหนื่อย', 'งานก็พลาด'],
  items: [{icon: 'moon', label: 'นอนน้อย'}, {icon: 'battery-low', label: 'เหนื่อย'}, {icon: 'circle-x', label: 'พลาด'}]});
SENTENCE('r5.first', {cat: 'B08', name: 'ขายได้ชิ้นแรก', say: ['ในที่สุดก็', 'ขายได้ชิ้นแรก'], goal: {icon: 'shopping-bag', label: 'ชิ้นแรก'}, who: 'user'});
