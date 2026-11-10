/* =====================================================================
   CutPack · uni · LEGO round 6 (Friend 2026-11-10: "เพิ่ม 5 หมวดนี้เลย"): five new categories found by reading 26 other
   people's scripts (round 17, page 19), two variants each, every one with its full-screen and its small (overlay) form.
   R3.both: one composition on the 600 × 340 small canvas, the full-screen form is the same picture scaled 1.6×.
   Slots (cat_ai.py; the AI writes only these, words on screen come only from them):
     B17 ไล่รายการหลายอย่าง   items [{icon, label?}] (2–4), label? (the group's name as said)
     B18 เล่าเหตุการณ์         what {icon, label?}, who? {icon, label?}, when? (words)
     B19 ความรู้สึก           feel {icon, label?}, who? {icon, label?}, mood? ('good' | 'bad')
     B20 ความสัมพันธ์ของคน     a {icon, label?}, b {icon, label?}, label? (the link as said), cut? (true = the link is over)
     B21 สถานที่              place {icon, label?}, spots? [{icon, label?}] (1–2)
   Rules (DECISIONS): things that link two things sit on the line between them · a light, ring or word of a moving thing
   starts after it arrives · marks sit in the middle of a gap · words centred under their icon, one line per row · rings
   are the thing's own shape (R1.ripple) · lighting up = LG.lightUp · a thing replaced by another sits exactly under it ·
   no red sign on a red thing · cards never overlap · nothing past x 550 below y 200 (x 940 on screen) · no sentence inside.
   ===================================================================== */
const R6 = {
  /* centres of n things in a row across the small canvas, kept left of x 550 */
  xs: n => ({1: [300], 2: [190, 410], 3: [130, 300, 470], 4: [100, 225, 350, 475]})[n],
  /* a holder that moves its icon and its word together (a word goes where its icon goes) */
  group: g => div('left:0;top:0;width:600px;height:340px', g),
  /* short lines bursting out of a round thing (cx, cy, radius r), drawn quickly from the inside out */
  burst(K, g, cx, cy, r, t, n = 8) {
    const d = [...Array(n)].map((_, i) => {
      const a = -Math.PI / 2 + i * 2 * Math.PI / n, c = Math.cos(a), s = Math.sin(a);
      return `M${(cx + c * (r + 16)).toFixed(1)} ${(cy + s * (r + 16)).toFixed(1)}L${(cx + c * (r + 44)).toFixed(1)} ${(cy + s * (r + 44)).toFixed(1)}`;
    });
    const e = div('left:0;top:0;width:600px;height:340px', g, `<svg width="600" height="340" style="overflow:visible">${d.map(p => `<path class="ln u-thin" d="${p}"/>`).join('')}</svg>`);
    e.classList.add('u-decor');
    e.querySelectorAll('path').forEach((p, i) => K.draw(p, t + i * .02, .2));
    return e;
  },
  /* a drawn line, hidden until it starts (an undrawn path with round caps showed as a dot) */
  line(K, g, d, t, dur, w = 600, h = 340) {
    const e = div(`left:0;top:0;width:${w}px;height:${h}px`, g, `<svg width="${w}" height="${h}" style="overflow:visible"><path class="ln" d="${d}"/></svg>`);
    A(e, [{opacity: 0}, {opacity: 1}], t, .01, {f: 'both'}); K.draw(e.querySelector('path'), t, dur); return e;
  },
  /* a left-anchored word that shrinks (never wraps) to maxW once the fonts are in */
  wordL(K, parent, txt, x, y, size, t, maxW) {
    const l = div(`left:${x}px;top:${y}px;white-space:nowrap;line-height:1.25`, parent); l.className = 'u-label u-text';
    const sp = document.createElement('span'); sp.style.fontSize = size + 'px'; sp.textContent = txt; l.appendChild(sp);
    FITS.push(() => { const w = sp.offsetWidth; if (w > maxW) sp.style.fontSize = (size * maxW / w).toFixed(1) + 'px'; });
    if (t != null) K.enter(l, t, 'lead');
    return l;
  },
  /* the time a "snap" or "pop" that starts at t is in place */
  at: (kind, t) => LG.arrive(kind, t),
};

/* ================= B17 ไล่รายการหลายอย่าง: items [2–4], label? ================= */
/* 1 · the things pop in one by one in a row; on the key word they bounce in a wave and a brace gathers them under the group's name */
R3.both('B17', 'row', 'แถวของ วงเล็บรวบเป็นกลุ่ม', (K, s, T, g) => {
  const its = s.items.slice(0, 4), n = its.length, xs = R6.xs(n), size = {2: 130, 3: 116, 4: 100}[n], Y = s.label ? 104 : 124;
  const slot = {2: 200, 3: 160, 4: 118}[n], ly = Y + size / 2 + 10, hasL = its.some(it => it.label);
  const when = LG.spread(T.b[0], T.b[2], n), b = [];
  its.forEach((it, i) => {
    b.push(K.badge(g, it.icon, xs[i], Y, size, when[i], {tone: it.tone ?? 'main', shape: it.shape ?? 'tile'}));
    if (it.label) R4.word(K, g, it.label, xs[i], ly, 34, when[i] + .12, slot);
  });
  b.forEach((n_, i) => K.punch(n_.p, T.hit + i * .08));
  /* a horizontal curly brace from the first thing to the last, under the words, pointing down at the group's name */
  const x0 = xs[0] - size / 2 + 6, x1 = xs[n - 1] + size / 2 - 6, cx = (x0 + x1) / 2, yb = (hasL ? ly + 54 : Y + size / 2 + 26);
  R6.line(K, g, `M${x0} ${yb - 16}Q${x0} ${yb} ${x0 + 18} ${yb}H${cx - 22}Q${cx} ${yb} ${cx} ${yb + 16}Q${cx} ${yb} ${cx + 22} ${yb}H${x1 - 18}Q${x1} ${yb} ${x1} ${yb - 16}`, T.hit, .5);
  if (s.label) K.chipC(g, s.label, cx, Math.min(yb + 46, 304), T.hit + .45, {tone: 'acc', size: 36});
});

/* 2 · the things hang from a line like cards on pegs, swinging in one by one; on the key word they all swing in a wave */
R3.both('B17', 'hang', 'ป้ายแขวนบนเชือก', (K, s, T, g) => {
  const its = s.items.slice(0, 4), n = its.length, xs = R6.xs(n), cw = {2: 150, 3: 126, 4: 108}[n], ch = {2: 196, 3: 178, 4: 164}[n];
  const top = s.label ? 92 : 66, sag = 22, ropeY = x => top - 18 + sag * (1 - ((x - 300) / 280) ** 2);   // the line sags in the middle
  R6.line(K, g, `M20 ${top - 18}Q300 ${top - 18 + 2 * sag} 580 ${top - 18}`, T.b[0], .5);
  if (s.label) K.chipC(g, s.label, 300, 34, T.b[0] + .2, {tone: 'acc', size: 36});
  const when = LG.spread(T.b[0] + .3, T.b[2], n);
  its.forEach((it, i) => {
    const y0 = ropeY(xs[i]) + 4, c = R2.card(node(g, xs[i] - cw / 2, y0 + 14, cw, ch, 'u-panel'));
    c.o.style.transformOrigin = '50% -14px';
    A(c.o, [{opacity: 0}, {opacity: 1}], when[i], .15, {f: 'both'});
    A(c.m, [-24, 12, -6, 3, 0].map(d => ({transform: `rotate(${d}deg)`})), when[i], .9, {e: 'ease-out', f: 'both'});
    A(c.m, [0, 7, -5, 2, 0].map(d => ({transform: `rotate(${d}deg)`})), T.hit + i * .1, .8, {e: 'ease-out', f: 'none'});
    const peg = node(c.p, cw / 2 - 9, -26, 18, 34, 'u-badge u-acc'); peg.p.style.borderRadius = '6px';   // the peg holds the card to the line
    K.badge(c.p, it.icon, cw / 2, it.label ? ch * .42 : ch / 2, Math.min(cw - 34, 96), when[i] + .1, {tone: it.tone ?? 'main'});
    if (it.label) R4.word(K, c.p, it.label, cw / 2, ch * .42 + 56, 30, when[i] + .2, cw - 18);
  });
});

/* ================= B18 เล่าเหตุการณ์: what {icon, label?}, who?, when? ================= */
/* 1 · a comic panel: the time in its caption box, the one in the story walks in, and what happened lands on the key word */
R3.both('B18', 'story', 'ช่องการ์ตูนเล่าเรื่อง', (K, s, T, g) => {
  const P = R3.panel(K, g, 40, 24, 500, 292, T.b[0]), who = s.who, W = {x: 130, y: 150}, E = who ? {x: 350, y: 140} : {x: 250, y: 140};
  if (s.when) K.chip(P.p, s.when, 20, 18, T.b[0] + .2, {tone: 'acc', size: 32});
  else K.skel(P.p, 24, 30, [140], T.b[0] + .2);
  const ly = 222;                                                           // both words on one line
  if (who) {
    const gw = R6.group(P.p);
    const w = K.badge(gw, who.icon, W.x, W.y, 110, null, {tone: who.tone ?? 'main', shape: who.shape ?? 'round'});
    K.fade(w.o, T.b[1] - .1, 0, 1, {hold: true}); K.move(w.m, T.b[1] - .1, 'translateX(-70px)', 'none', {hold: true});   // it walks in inside the panel, never across its edge
    if (who.label) R4.word(K, gw, who.label, W.x, ly, 34, LG.arrive('move', T.b[1] - .1), 180);
    /* three action dashes on the straight line from the person to where the event lands */
    const yAt = x => W.y + (E.y - W.y) * (x - W.x) / (E.x - W.x);
    [0, 1, 2].forEach(i => { const x = 205 + i * 26; R6.line(K, P.p, `M${x} ${yAt(x).toFixed(1)}L${x + 14} ${yAt(x + 14).toFixed(1)}`, T.b[2] + i * .08, .12, 500, 292); });
  }
  let ph = null;
  if (!who) {
    ph = node(P.p, E.x - 75, E.y - 75, 150, 150, '', `<svg width="150" height="150" style="overflow:visible"><rect class="ln u-thin u-dash" x="4" y="4" width="142" height="142" rx="30"/></svg>`);
    K.enter(ph.o, T.b[1], 'pop'); K.shake(ph.p, T.b[2]);
  }
  const ev = K.badge(P.p, s.what.icon, E.x, E.y, 150, null, {tone: s.what.tone ?? 'acc'});
  K.fade(ev.o, T.hit - .05, 0, 1, {hold: true}); K.move(ev.m, T.hit - .05, 'scale(.3)', 'none', {hold: true, kind: 'snap'});
  const land = R6.at('snap', T.hit - .05);
  R1.ripple(K, ev, land);
  if (ph) K.fade(ph.o, land, 1, 0);
  if (s.what.label) R4.word(K, P.p, s.what.label, E.x, ly, 38, land, 240);
  K.punch(ev.p, land + .05);
});

/* 2 · a photo drops in blank and develops on the key word: who and what appear, the time is written under it */
R3.both('B18', 'photo', 'รูปถ่ายค่อย ๆ ชัด', (K, s, T, g) => {
  const P = R2.card(node(g, 155, 14, 290, 312, 'u-panel')), who = s.who;
  K.enter(P.o, T.b[0], 'drop');
  P.m.style.transformOrigin = '50% 50%';
  A(P.m, [{transform: 'rotate(-5deg)'}, {transform: 'rotate(-5deg)'}], 0, .01, {f: 'both'});
  K.move(P.m, T.hit, 'rotate(-5deg)', 'none', {kind: 'snap'});              // it straightens as it develops
  const ph = node(P.p, 20, 20, 250, 206, 'u-track'); ph.p.style.borderRadius = '12px'; K.enter(ph.o, T.b[0] + .1, 'pop');
  const pics = who ? [[who, 80, 116, 'round'], [s.what, 172, 112, 'tile']] : [[s.what, 125, 132, 'tile']];
  const nodes = pics.map(([it, x, size, shape]) => K.badge(ph.p, it.icon, x, 103, size, null, {tone: it === s.what ? (it.tone ?? 'acc') : (it.tone ?? 'main'), shape: it.shape ?? shape}));
  nodes.forEach(n_ => { A(n_.o, [{opacity: 0}, {opacity: .14}], T.b[1], .4, {f: 'both'}); A(n_.o, [{opacity: .14}, {opacity: 1}], T.hit, .5, {f: 'forwards'}); });
  const done = T.hit + .5;
  R1.ripple(K, nodes[nodes.length - 1], done);
  const cap = s.when ?? s.what.label;                                       // the caption: the time, else what happened
  if (cap) R4.word(K, P.p, cap, 145, 240, 40, done, 250);
  else K.skel(P.p, 70, 260, [150], T.b[2]);
});

/* ================= B19 ความรู้สึก: feel {icon, label?}, who?, mood? ================= */
/* 1 · the feeling face lights up on the key word and bursts; good feelings bounce, bad ones shake */
R3.both('B19', 'face', 'หน้าอารมณ์เด้ง', (K, s, T, g) => {
  const who = s.who, F = who ? {x: 380, y: 140} : {x: 300, y: 140}, R = 82, bad = s.mood === 'bad';
  if (who) {
    K.badge(g, who.icon, 130, 172, 116, T.b[0], {tone: who.tone ?? 'main', shape: who.shape ?? 'round'});
    if (who.label) R4.word(K, g, who.label, 130, 240, 34, T.b[0] + .15, 180);
    R6.line(K, g, `M196 ${172 - 30}L${F.x - R - 14} ${F.y + 10}`, T.b[1], .3);   // from the person to the feeling, a straight line
  }
  const base = K.badge(g, s.feel.icon, F.x, F.y, 2 * R, T.b[1] + .2, {tone: 'soft', shape: 'round'});
  const lit = LG.lightUp(K, g, s.feel.icon, F.x, F.y, 2 * R, T.hit, 'round');
  K.fade(base.o, lit.done, 1, 0);
  R6.burst(K, g, F.x, F.y, R, lit.done);
  R1.ripple(K, lit, lit.done);
  if (bad) K.shake(lit.p, lit.done + .15);
  if (s.feel.label) R4.word(K, g, s.feel.label, F.x, F.y + R + 50, 40, lit.done, 260);
});

/* 2 · the feeling floats up from the one who feels it, like live reactions, and a big one pops on the key word */
R3.both('B19', 'float', 'อารมณ์ลอยขึ้นจากคน', (K, s, T, g) => {
  const who = s.who ?? {icon: 'user'}, C = {x: 180, y: 232}, BIG = {x: 410, y: 128};
  const w = K.badge(g, who.icon, C.x, C.y, 150, T.b[0], {tone: who.tone ?? 'main', shape: who.shape ?? 'round'});
  if (s.who?.label) R4.word(K, g, s.who.label, C.x, C.y + 83, 34, T.b[0] + .15, 200);
  /* small ones rise from the top of the person in a column, swaying, never as far as the big one on the right */
  const runs = [[-1, T.b[1]], [1, T.b[1] + .55], [-1, T.b[2] + .3], [1, T.after + .1]];   // one or two in the air at a time, apart
  runs.forEach(([side, t], i) => {
    if (t > T.t1 - 1.1) return;
    const r = K.badge(g, s.feel.icon, C.x + side * 46, C.y - 112, 64, null, {tone: i % 2 ? 'main' : 'acc', shape: 'round'});
    r.o.classList.add('u-decor'); r.o.style.opacity = '0';               // seen only while it rises (it sat still before and after)
    A(r.o, [{opacity: 0}, {opacity: 1, offset: .15}, {opacity: 1, offset: .6}, {opacity: 0}], t, 1.1, {f: 'none'});
    A(r.m, [{transform: 'translate(0,0) scale(.7)'}, {transform: `translate(${side * 16}px,-55px) scale(1)`, offset: .5}, {transform: 'translate(0px,-110px) scale(.85)'}], t, 1.1, {e: 'ease-out', f: 'none'});
  });
  const big = K.badge(g, s.feel.icon, BIG.x, BIG.y, 160, T.hit, {tone: 'acc', shape: 'round'});
  const land = R6.at('pop', T.hit);
  R1.ripple(K, big, land); K.punch(w.p, land);
  if (s.mood === 'bad') K.shake(big.p, land + .1);
  if (s.feel.label) R4.word(K, g, s.feel.label, BIG.x, BIG.y + 88, 40, land, 220);
});

/* ================= B20 ความสัมพันธ์ของคน: a, b, label?, cut? ================= */
/* 1 · two people and the line between them; the link's name sits on the line, or the line breaks when the link is over */
R3.both('B20', 'link', 'สองคนกับเส้นเชื่อม', (K, s, T, g) => {
  const A_ = {x: 120, y: 132}, B_ = {x: 470, y: 132}, S = 128, ly = A_.y + S / 2 + 12, cut = s.cut === true;
  const ga = R6.group(g), gb = R6.group(g);
  const one = (grp, it, P, t) => {
    const n_ = K.badge(grp, it.icon, P.x, P.y, S, t, {tone: it.tone ?? 'main', shape: it.shape ?? 'round'});
    if (it.label) R4.word(K, grp, it.label, P.x, ly, 36, t + .15, 150);
    return n_;
  };
  const na = one(ga, s.a, A_, T.b[0]), nb = one(gb, s.b, B_, T.b[1]);
  const x0 = A_.x + S / 2 + 10, x1 = B_.x - S / 2 - 10, cx = (x0 + x1) / 2;
  if (!cut) {
    R6.line(K, g, `M${x0} ${A_.y}H${x1}`, T.b[2], .45);
    const mid = K.badge(g, 'link', cx, A_.y, 70, T.hit, {tone: 'acc', shape: 'round'});
    const land = R6.at('pop', T.hit);
    R1.ripple(K, na, land); R1.ripple(K, nb, land + .08); K.punch(mid.p, land);
    if (s.label) K.chipC(g, s.label, cx, 260, land, {tone: 'acc', size: 36});
  } else {
    /* the line is two halves that meet in the middle; on the key word they pull apart and the gap gets a cross */
    const la = R6.line(K, g, `M${x0} ${A_.y}H${cx - 4}`, T.b[2], .3), lb = R6.line(K, g, `M${cx + 4} ${A_.y}H${x1}`, T.b[2] + .15, .3);
    if (s.label) K.chipC(g, s.label, cx, 64, T.b[2] + .3, {tone: 'main', size: 36});
    [[ga, la, -1], [gb, lb, 1]].forEach(([grp, ln, k]) => { K.move(grp, T.hit, 'none', `translateX(${k * 18}px)`); K.move(ln, T.hit, 'none', `translateX(${k * 30}px)`); K.fade(ln, T.hit + .2, 1, .35); });
    K.mark(g, 'cross', cx, A_.y, 64, R6.at('move', T.hit));
  }
});

/* 2 · two circles, one around each; they slide together and overlap on the key word (or slide apart when it is over) */
R3.both('B20', 'rings', 'วงกลมสองวงซ้อนกัน', (K, s, T, g) => {
  const cut = s.cut === true, R = 104, Y = 162, far = [170, 430], near = [228, 372];   // room above for the link's name
  const [p0, p1] = cut ? [near, far] : [far, near];                        // where they start and where they end
  const ring = (it, x0, x1, t) => {
    const n_ = node(g, x0 - R, Y - R, 2 * R, 2 * R, '', `<svg width="${2 * R}" height="${2 * R}" style="overflow:visible"><circle class="ln" cx="${R}" cy="${R}" r="${R - 4}"/></svg>`);
    n_.p.style.borderRadius = '50%';
    K.enter(n_.o, t, 'pop');
    K.badge(n_.p, it.icon, R, R, 96, t + .12, {tone: it.tone ?? 'main', shape: it.shape ?? 'round'});
    K.move(n_.m, T.hit - .1, 'none', `translateX(${x1 - x0}px)`, {kind: 'snap'});
    return n_;
  };
  const a = ring(s.a, p0[0], p1[0], T.b[0]), b = ring(s.b, p0[1], p1[1], T.b[1]);
  const land = R6.at('snap', T.hit - .1);
  /* the words stay under where each circle ends up, on one line */
  if (s.a.label) R4.word(K, g, s.a.label, p1[0] - (cut ? 0 : 40), Y + R + 4, 34, land, 160);
  if (s.b.label) R4.word(K, g, s.b.label, p1[1] + (cut ? 0 : 40), Y + R + 4, 34, land, 160);
  if (!cut) { R1.ripple(K, a, land); R1.ripple(K, b, land); }
  else K.mark(g, 'cross', 300, Y, 62, land);
  if (s.label) K.chipC(g, s.label, 300, 28, land + .1, {tone: cut ? 'main' : 'acc', size: 36});
});

/* ================= B21 สถานที่: place {icon, label?}, spots? [1–2] ================= */
/* 1 · a map card: the place sits on the streets, a pin drops onto it on the key word, then the spots are named beside it */
R3.both('B21', 'pin', 'หมุดปักลงแผนที่', (K, s, T, g) => {
  const P = R3.panel(K, g, 40, 24, 500, 292, T.b[0]), spots = (s.spots ?? []).slice(0, 2);
  /* streets: two soft bands along the left and the bottom of the card, clear of the place and the words */
  [[0, 244, 500, 30], [92, 0, 30, 292], ...(spots.length ? [] : [[392, 0, 30, 292]])].forEach(([x, y, w, h], i) => {
    const r = div(`left:${x}px;top:${y}px;width:${w}px;height:${h}px;border-radius:${Math.min(w, h) / 2}px;transform-origin:0 0`, P.p);
    r.className = 'u-track u-decor'; K.grow(r, T.b[0] + .15 + i * .1, w > h ? 'X' : 'Y');
  });
  const X = spots.length ? 236 : 250, Y = 132, S = 104;               // the pin on top stays inside the card
  const place = K.badge(P.p, s.place.icon, X, Y, S, T.b[1], {tone: s.place.tone ?? 'main', shape: s.place.shape ?? 'tile'});
  if (s.place.label) R4.word(K, P.p, s.place.label, X, Y + S / 2 + 6, 34, T.b[1] + .15, 200);
  const pin = K.badge(P.p, 'map-pin', X, Y - S / 2 - 34, 72, null, {tone: 'acc', shape: 'round'});
  K.fade(pin.o, T.hit - .1, 0, 1, {hold: true}); K.move(pin.m, T.hit - .1, 'translateY(-70px)', 'none', {hold: true, kind: 'snap'});
  const land = R6.at('snap', T.hit - .1);
  R1.ripple(K, place, land); K.punch(place.p, land);
  spots.forEach((it, i) => {
    const y = spots.length === 1 ? 132 : 86 + i * 92, t = land + .1 + i * .15;
    K.badge(P.p, it.icon, 336, y, 60, t, {tone: it.tone ?? 'main', shape: it.shape ?? 'round'});
    if (it.label) R6.wordL(K, P.p, it.label, 374, y - 22, 34, t + .05, 112);   // ends inside the card
  });
});

/* 2 · a floor plan: walls draw in, the place's name is its title; someone walks in through the door to the spot on the key word */
R3.both('B21', 'plan', 'ผังห้อง เดินเข้าไปถึงจุด', (K, s, T, g) => {
  const spots = (s.spots ?? []).slice(0, 2), two = spots.length === 2;
  const walls = div('left:0;top:0;width:600px;height:340px', g, `<svg width="600" height="340" style="overflow:visible">` +
    `<path class="ln" d="M268 300H70V60H530V300H332"/>` + (two ? `<path class="ln" d="M300 60V170"/>` : '') + '</svg>');
  A(walls, [{opacity: 0}, {opacity: 1}], T.b[0], .01, {f: 'both'});
  walls.querySelectorAll('path').forEach((p, i) => K.draw(p, T.b[0] + i * .2, .6));
  if (s.place.label) K.chipC(g, s.place.label, 300, 60, T.b[0] + .3, {tone: 'main', size: 36});
  else K.badge(g, s.place.icon, 300, 60, 64, T.b[0] + .3, {tone: 'main'});
  /* what is in the rooms: the spots, or the place itself in one room */
  const its = spots.length ? spots : [s.place], P = two ? [{x: 185, y: 140}, {x: 415, y: 140}] : [{x: 300, y: 146}];
  const S = 92, ly = P[0].y + S / 2 + 6;
  const tiles = its.map((it, i) => {
    const b = K.badge(g, it.icon, P[i].x, P[i].y, S, T.b[1] + i * .2, {tone: it.tone ?? 'main', shape: it.shape ?? 'tile'});
    if (it.label && it !== s.place) R4.word(K, g, it.label, P[i].x, ly, 32, T.b[1] + i * .2 + .1, 200);
    return b;
  });
  /* the walker comes in through the door (bottom middle) and stops under the last room's tile and its word */
  const end = P[its.length - 1], wk = K.badge(g, 'footprints', 300, 300, 50, null, {tone: 'acc', shape: 'round'});
  const path = [[0, 40], [0, -32], [end.x - 300, -32]];
  A(wk.o, [{opacity: 0}, {opacity: 1}], T.b[2], .2, {f: 'both'});
  A(wk.m, path.map(([x, y], i) => ({transform: `translate(${x}px,${y}px)`, offset: i / (path.length - 1)})), T.b[2], T.hit - T.b[2], {e: 'ease-in-out', f: 'both'});
  const last = its.length - 1, lit = LG.lightUp(K, g, its[last].icon, end.x, end.y, S, T.hit, its[last].shape ?? 'tile');
  K.fade(tiles[last].o, lit.done, 1, 0); R1.ripple(K, lit, lit.done);
}, s => (s.spots ?? []).length > 0);

/* ================= sample sentences (from the 26 scripts Friend sent, round 17; not Friend's own) ================= */
SENTENCE('r6.layers', {cat: 'B17', name: '3 เลเยอร์ของชุดนักเรียน', say: ['เสื้อชั้นใน เสื้อกล้ามทับ', 'ชุดนักเรียน'],
  items: [{icon: 'shirt', label: 'เสื้อชั้นใน'}, {icon: 'shirt', label: 'เสื้อกล้าม'}, {icon: 'shirt', label: 'ชุดนักเรียน'}], label: '3 เลเยอร์'});
SENTENCE('r6.gpu', {cat: 'B17', name: 'กู้ซื้อ GPU ได้แค่ 4 เจ้า', say: ['มีแค่ Microsoft, Meta', 'แล้วก็ SpaceX'],
  items: [{icon: 'building-2', label: 'Microsoft'}, {icon: 'building-2', label: 'Meta'}, {icon: 'building-2', label: 'Google'}, {icon: 'rocket', label: 'SpaceX'}]});
SENTENCE('r6.arrest', {cat: 'B18', name: 'ปี 2022 ถูกจับ', say: ['ปี 2022 เติร์กก็', 'ถูกจับในคดีใหญ่'],
  what: {icon: 'siren', label: 'ถูกจับ'}, who: {icon: 'mic', label: 'เติร์ก'}, when: 'ปี 2022'});
SENTENCE('r6.closed', {cat: 'B18', name: 'สาขาแรกเจ๊ง', say: ['ขยายสาขาแรก', 'เจ๊ง'], what: {icon: 'store', label: 'สาขาแรก'}});
SENTENCE('r6.relief', {cat: 'B19', name: 'รู้สึกสบายใจขึ้น', say: ['ผมก็รู้สึก', 'สบายใจขึ้นเยอะ'],
  feel: {icon: 'smile', label: 'สบายใจ'}, who: {icon: 'user', label: 'ผม'}, mood: 'good'});
SENTENCE('r6.angry', {cat: 'B19', name: 'จำความรู้สึกโกรธแค้นได้', say: ['ผมยังจำความรู้สึก', 'โกรธแค้นได้เลย'],
  feel: {icon: 'angry', label: 'โกรธแค้น'}, mood: 'bad'});
SENTENCE('r6.ex', {cat: 'B20', name: 'ร้านของแฟนเก่า', say: ['เป็นร้านของ', 'แฟนเก่าพี่เอง'],
  a: {icon: 'user', label: 'พี่'}, b: {icon: 'store', label: 'ร้าน'}, label: 'แฟนเก่า', cut: true});
SENTENCE('r6.collab', {cat: 'B20', name: 'คอลแล็บกับแสนสิริ', say: ['วันนี้เราได้มาคอลแล็บ', 'กับแสนสิริ'],
  a: {icon: 'users', label: 'เรา'}, b: {icon: 'building-2', label: 'แสนสิริ'}, label: 'คอลแล็บ'});
SENTENCE('r6.mall', {cat: 'B21', name: 'ชั้น G หน้า KFC', say: ['มันอยู่ตรงชั้น G', 'ตรงหน้า KFC'],
  place: {icon: 'building-2', label: 'มิตรทาวน์'}, spots: [{icon: 'building', label: 'ชั้น G'}, {icon: 'utensils', label: 'หน้า KFC'}]});
SENTENCE('r6.canada', {cat: 'B21', name: 'ย้ายมาแคนาดา', say: ['ใครที่อยากย้ายมา', 'แคนาดา'], place: {icon: 'flag', label: 'แคนาดา'}});
