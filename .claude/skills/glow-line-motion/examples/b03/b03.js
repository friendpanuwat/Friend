/* b03.js — category B03 "เปรียบเทียบ / ก่อน → หลัง": 20 neutral designs.
   STILL DRAFTS (stage 1, for the user to keep / drop / fix) — motion comes after approval
   (CutPack rule: a enters → b enters (or a starts to change) → the verdict / the change completes on the keyword → hold).
   Slots (same as CutPack CATEGORIES.md B03):
     mode 'versus' (side by side) | 'change' (a before → b after) · a, b { icon, label? } ·
     win 'a' | 'b' (optional — the better side; change mode → b) · how 'x' (cross the loser) | 'check' (tick the winner) (optional) ·
     v { a, b } amounts 0.1–1 when the point is "more / less" (optional) · switch true (on) | false (off) for the after state (optional).
   The still shows the RESULT: winner normal + strong, loser / "before" faint; v shows as size or length; change shows the a → b direction.
   Arrows only where the picture cannot show the direction itself (user's rule from B02).
   Canvas 1000 × 700 centred at (0,0): GL.cats.B03.draw(i, data, { x, y, s, at }). fits(d) false → the design does not take that data. */
(function () {
  const G = window.GL, C = G.C;
  const W = (w = 2) => ({ sw: w }), F = (w = 3.2) => ({ fill: C.fill, sw: w });
  const rad = d => d * Math.PI / 180, f1 = v => +v.toFixed(1);
  const sub = (p, a) => p.child(a || {});
  const art = (c, fn) => G.art(fn, { x: c.x, y: c.y, s: c.s, at: c.at || 0 });

  /* the verdict of the data */
  function st(d) {
    const change = d.mode === 'change', win = d.win || (change ? 'b' : null), lose = win ? (win === 'a' ? 'b' : 'a') : null;
    const hasV = !!d.v, va = hasV ? (d.v.a ?? .5) : null, vb = hasV ? (d.v.b ?? .5) : null;
    const amt = s => hasV ? (s === 'a' ? va : vb) : win ? (s === win ? .85 : .35) : .6;   // a length / size for side s
    return { change, win, lose, hasV, va, vb, amt, dim: s => s === lose ? .3 : 1, off: d.switch === false };
  }
  function txt(p, str, x, y, { size = 44, maxW = 1e9, weight = 600, anchor = 'middle', color = C.soft } = {}) {
    const e = p.text(String(str), x, y, { size, weight, anchor, color, dur: .01 });
    const w = e.getBBox().width; if (w > maxW) e.setAttribute('font-size', f1(size * maxW / w));
    return e;
  }
  function icon(name, cx, cy, wd, c, op = 1) {
    if (!name || wd <= 0) return null;
    const fn = G.icons[name] || G.icons[name + '-pro'];
    if (!fn) { console.warn('B03: no icon', name); return null; }
    const a = G.art(fn, { x: c.x + cx * c.s, y: c.y + cy * c.s, w: wd * c.s, at: (c.at || 0) + .05 });
    if (op < 1) a.wrap.setAttribute('opacity', op);
    return a;
  }
  /* side s of the data: icon at (x, y) width w, label under it (ly = label y, or null for none) */
  function thing(d, s, x, y, w, c, ly, o = {}) {
    const T = st(d), op = o.op ?? T.dim(s);
    icon(d[s].icon, x, y, w, c, op);
    if (d[s].label && ly != null) art(c, p => { const e = txt(p, d[s].label, o.lx ?? x, ly, { maxW: o.maxW || 300, anchor: o.anchor || 'middle', color: op < 1 ? C.mute : C.soft }); });
  }
  /* verdict marks: ✕ on the loser / ✓ on the winner (how), at the given spots */
  function badge(p, kind, x, y, r = 38) {
    const g = sub(p); g.circle(x, y, r, F(3)); const k = r * .42;
    if (kind === 'x') { g.line(x - k, y - k, x + k, y + k, W(5)); g.line(x + k, y - k, x - k, y + k, W(5)); }
    else g.poly([[x - k, y + 2], [x - k * .2, y + k * .8], [x + k * 1.05, y - k * .75]], W(5));
  }
  function marks(p, d, at) { const T = st(d); if (!d.how || !T.win) return;
    const s = d.how === 'x' ? T.lose : T.win; if (at[s]) badge(p, d.how === 'x' ? 'x' : 'check', at[s][0], at[s][1]); }
  function arrowLine(p, x1, y1, x2, y2, w = 5) {
    const a = Math.atan2(y2 - y1, x2 - x1), h = 20;
    p.line(x1, y1, x2, y2, W(w)); p.poly([[x2 - h * Math.cos(a - .5), y2 - h * Math.sin(a - .5)], [x2, y2], [x2 - h * Math.cos(a + .5), y2 - h * Math.sin(a + .5)]], W(w));
  }
  const vsMark = (p, x, y, r = 46) => { p.circle(x, y, r, F(3)); txt(p, 'VS', x, y + 14, { size: 38, weight: 700, color: C.ink }); };

  const V = [];
  const variant = (id, th, build, fits) => V.push({ id, th, build, fits: fits || (() => true) });

  /* 01 ── SPLIT: the screen splits down the middle — VS (versus) or an arrow (change) on the seam */
  variant('split', 'แบ่งครึ่งจอ', (d, c) => {
    const T = st(d);
    art(c, p => {
      p.line(0, -300, 0, 300, { sw: 2.4, stroke: C.soft });
      if (T.change) { p.circle(0, -20, 46, F(3)); arrowLine(p, -20, -20, 22, -20, 5); } else vsMark(p, 0, -20);
      marks(p, d, { a: [-150, -150], b: [350, -150] });
    });
    thing(d, 'a', -250, -20, 230, c, 170); thing(d, 'b', 250, -20, 230, c, 170);
  });

  /* 02 ── SCALE: a balance scale — it tips to the heavier (or the winning) side */
  variant('scale', 'ตาชั่งสองแขน', (d, c) => {
    const T = st(d), tilt = T.hasV ? Math.max(-14, Math.min(14, (T.vb - T.va) * 22)) : T.win ? (T.win === 'b' ? 10 : -10) : 0;
    const by = -150, L = 300, end = s => { const k = s === 'a' ? -1 : 1; return [k * L * Math.cos(rad(tilt)), by + k * L * Math.sin(rad(tilt))]; };
    art(c, p => {
      p.path('M -120 290 L 120 290 L 70 250 L -70 250 Z', F(3)); p.line(0, 250, 0, by, W(6)); p.circle(0, by - 18, 18, F(3));
      p.line(f1(end('a')[0]), f1(end('a')[1]), f1(end('b')[0]), f1(end('b')[1]), { sw: 8 });
      ['a', 'b'].forEach(s => { const [ex, ey] = end(s), py = ey + 170;
        p.line(f1(ex), f1(ey), f1(ex - 110), f1(py), W(2)); p.line(f1(ex), f1(ey), f1(ex + 110), f1(py), W(2));
        p.path(`M ${f1(ex - 125)} ${f1(py)} Q ${f1(ex)} ${f1(py + 70)} ${f1(ex + 125)} ${f1(py)} Z`, F(3)); });
      marks(p, d, { a: [end('a')[0] - 130, end('a')[1] + 20], b: [end('b')[0] + 130, end('b')[1] + 20] });
    });
    ['a', 'b'].forEach(s => { const [ex, ey] = end(s); thing(d, s, ex, ey + 100, 130, c, ey + 280, { maxW: 240 }); });
  });

  /* 03 ── PODIUM: two blocks — the taller one is the winner (or the bigger amount) */
  variant('podium', 'แท่นสูงต่ำ', (d, c) => {
    const T = st(d), H = s => 110 + T.amt(s) * 260, X = { a: -200, b: 200 };
    art(c, p => {
      p.line(-460, 270, 460, 270, { sw: 2.2, stroke: C.soft });
      ['a', 'b'].forEach(s => { const h = H(s); p.rect(X[s] - 140, 270 - h, 280, h, Object.assign({ rx: 10 }, s === T.lose ? { fill: C.fill, sw: 2.4, stroke: C.rule } : F(3.4)));
        if (d[s].label) txt(p, d[s].label, X[s], 270 - h + 66, { maxW: 240, color: s === T.lose ? C.mute : C.soft }); });
      if (T.change) arrowLine(p, X.a + 60, 270 - H('a') - 170, X.b - 90, 270 - H('b') - 120, 4);
      marks(p, d, { a: [X.a + 130, 270 - H('a') - 140], b: [X.b + 130, 270 - H('b') - 140] });
    });
    ['a', 'b'].forEach(s => icon(d[s].icon, X[s], 270 - H(s) - 80, 150, c, T.dim(s)));
  });

  /* 04 ── TUBES: two tubes, each filled to its amount; the things stand above them */
  variant('tubes', 'หลอดเติม', (d, c) => {
    const T = st(d), X = { a: -170, b: 170 }, top = -170, bot = 240;
    art(c, p => {
      ['a', 'b'].forEach(s => { const x = X[s], f = T.amt(s), y = bot - 24 - (bot - top - 48) * f;
        p.rect(x - 62, top, 124, bot - top, Object.assign({ rx: 40 }, F(3.2)));
        p.rect(x - 40, f1(y), 80, f1(bot - 22 - y), Object.assign({ rx: 26 }, s === T.lose ? { fill: C.fill, sw: 3, stroke: C.soft } : { fill: C.ink, sw: 2 }));
        for (let k = 1; k < 4; k++) p.line(x + 62, top + k * 100, x + 82, top + k * 100, W(2)); });
      if (T.change) arrowLine(p, -70, -280, 70, -280, 4);
      marks(p, d, { a: [X.a - 120, top + 30], b: [X.b + 120, top + 30] });
    });
    ['a', 'b'].forEach(s => thing(d, s, X[s], -270, 110, c, 300));
  });

  /* 05 ── CARDS: two cards side by side — the loser leans back and dims, the winner stands forward */
  variant('cards', 'การ์ดคู่', (d, c) => {
    const T = st(d), X = { a: -230, b: 230 };
    art(c, p => {
      ['a', 'b'].forEach(s => { const lose = s === T.lose, g = sub(p, { transform: lose ? `rotate(${s === 'a' ? -6 : 6} ${X[s]} 200) translate(0 20)` : '' });
        g.rect(X[s] - 165, -210, 330, 420, Object.assign({ rx: 30 }, lose ? { fill: C.fill, sw: 2.4, stroke: C.rule } : F(s === T.win ? 4 : 3.4)));
        if (d[s].label) txt(g, d[s].label, X[s], 160, { maxW: 270, color: lose ? C.mute : C.soft }); });
      if (T.change) arrowLine(p, -50, 0, 50, 0, 5);
      marks(p, d, { a: [X.a + 150, -200], b: [X.b + 150, -200] });
    });
    ['a', 'b'].forEach(s => icon(d[s].icon, X[s] + (s === T.lose ? (s === 'a' ? -10 : 10) : 0), -20 + (s === T.lose ? 20 : 0), 180, c, T.dim(s)));
  });

  /* 06 ── STACK: two cards on top of each other — the winner (or the "after") in front, the other peeks out behind */
  variant('stack', 'การ์ดซ้อนหน้า-หลัง', (d, c) => {
    const T = st(d), front = T.win || 'b', back = front === 'a' ? 'b' : 'a';
    art(c, p => {
      const bk = sub(p, { transform: 'rotate(-8 -110 -40)' }); bk.rect(-310, -260, 380, 440, Object.assign({ rx: 30 }, { fill: C.fill, sw: 2.4, stroke: T.win ? C.rule : C.soft }));
      if (d[back].label) txt(bk, d[back].label, -120, -200, { maxW: 300, color: T.win ? C.mute : C.soft });
      p.rect(-110, -170, 400, 450, Object.assign({ rx: 32 }, F(3.6)));
      if (d[front].label) txt(p, d[front].label, 90, 230, { maxW: 340 });
      if (T.change) p.path('M -340 -330 Q -40 -395 135 -220', W(4)), p.poly([[112, -244], [137, -218], [104, -208]], W(4));
      marks(p, d, { [front]: [270, -150], [back]: [-290, -240] });
    });
    icon(d[back].icon, -210, -110, 120, c, T.win ? .3 : 1); icon(d[front].icon, 90, 40, 220, c);
  });

  /* 07 ── TOGGLE: a big switch between the two — its knob sits on the winner (or the "after"; in the middle when undecided) */
  variant('toggle', 'สวิตช์', (d, c) => {
    const T = st(d), side = T.win, kx = side === 'a' ? -150 : side === 'b' ? 150 : 0, lit = !T.off;
    art(c, p => {
      p.rect(-230, -15, 460, 150, Object.assign({ rx: 75 }, F(3.6)));
      if (side) p.rect(side === 'a' ? -210 : 0, 5, 210, 110, Object.assign({ rx: 55 }, lit ? { fill: C.ink, sw: 2, stroke: C.ink, 'fill-opacity': .14 } : { fill: C.fill, sw: 2, stroke: C.rule }));
      p.circle(kx, 60, 62, F(3.4)); p.circle(kx, 60, 22, W(2));
      marks(p, d, { a: [-390, -120], b: [390, -120] });
    });
    thing(d, 'a', -390, 30, 150, c, 180); thing(d, 'b', 390, 30, 150, c, 180, { op: T.off && T.win === 'b' ? .3 : st(d).dim('b') });
  });

  /* 08 ── SIZES: each side in a circle sized by its amount (equal when there is no amount) */
  variant('sizes', 'วงกลมขนาด', (d, c) => {
    const T = st(d), R = s => 110 + T.amt(s) * 120, X = { a: -230, b: 220 };
    art(c, p => {
      ['a', 'b'].forEach(s => p.circle(X[s], 0, f1(R(s)), s === T.lose ? { fill: C.fill, sw: 2.4, stroke: C.rule } : F(3.4)));
      if (T.change) arrowLine(p, X.a + R('a') + 14, 0, X.b - R('b') - 14, 0, 4);
      marks(p, d, { a: [X.a + R('a') * .72, -R('a') * .72], b: [X.b + R('b') * .72, -R('b') * .72] });
    });
    ['a', 'b'].forEach(s => thing(d, s, X[s], -10, R(s) * 1.05, c, Math.max(R('a'), R('b')) + 70));
  });

  /* 09 ── TUG: a rope between the two — its marker is pulled toward the winner */
  variant('tug', 'ชักเย่อ', (d, c) => {
    const T = st(d), mx = T.win === 'a' ? -170 : T.win === 'b' ? 170 : 0;
    art(c, p => {
      p.path('M -330 40 Q -160 70 0 60 Q 160 50 330 40', { sw: 9 });
      p.line(0, -40, 0, 170, { sw: 2.2, stroke: C.soft }); [-40, 0, 40, 80, 120, 160].forEach(y => p.line(-10, y, 10, y, { sw: 1.6, stroke: C.soft }));
      p.path(`M ${mx} 58 L ${mx - 26} 120 L ${mx + 26} 120 Z`, F(3)); p.line(mx, 40, mx, 60, W(3));
      marks(p, d, { a: [-390, -150], b: [390, -150] });
    });
    thing(d, 'a', -390, 30, 160, c, 190); thing(d, 'b', 390, 30, 160, c, 190);
  });

  /* 10 ── LENS: a magnifier sits over the winner (or hovers between them when undecided) */
  variant('lens', 'แว่นขยาย', (d, c) => {
    const T = st(d), X = { a: -240, b: 240 }, lx = T.win ? X[T.win] : 0, ly = T.win ? -10 : -120;
    art(c, p => {
      if (T.win) { p.line(lx + 125, ly + 125, lx + 240, ly + 240, { sw: 46 }); p.line(lx + 125, ly + 125, lx + 240, ly + 240, { sw: 37, stroke: C.fill });
        p.circle(lx, ly, 170, F(4)); p.circle(lx, ly, 150, { sw: 1.6, stroke: C.soft }); }
      else { p.line(0, -30, 0, 150, { sw: 46 }); p.line(0, -30, 0, 150, { sw: 37, stroke: C.fill });   // undecided: the lens waits between them
        p.circle(0, -160, 130, F(4)); p.circle(0, -160, 112, { sw: 1.6, stroke: C.soft }); }
      if (T.change) arrowLine(p, -90, 230, 90, 230, 4);
      marks(p, d, { a: [X.a + 140, -170], b: [X.b + 140, -170] });
    });
    ['a', 'b'].forEach(s => thing(d, s, X[s], -10, s === T.win ? 200 : 150, c, s === T.win ? 270 : 220));
  });

  /* 11 ── SPOTLIGHTS: a lamp over each side — lit for the winner (both lit when undecided), dark for the loser */
  variant('spots', 'ไฟส่องคู่', (d, c) => {
    const T = st(d), X = { a: -240, b: 240 };
    art(c, p => {
      p.line(-470, 250, 470, 250, { sw: 2, stroke: C.soft });
      ['a', 'b'].forEach(s => { const x = X[s], on = s !== T.lose && !(T.off && s === T.win);
        p.line(x, -340, x, -290, W(2));
        if (on) { p.shape([[x - 50, -240], [x + 50, -240], [x + 170, 250], [x - 170, 250]], { fill: 'rgba(255,255,255,.05)', stroke: 'none', sw: 0 });
          p.line(x - 50, -240, x - 170, 250, { sw: 1.6, stroke: C.soft }); p.line(x + 50, -240, x + 170, 250, { sw: 1.6, stroke: C.soft }); }
        p.path(`M ${x - 36} -290 L ${x + 36} -290 L ${x + 56} -240 L ${x - 56} -240 Z`, on ? F(3) : { fill: C.fill, sw: 2, stroke: C.rule }); });
      if (T.change) arrowLine(p, -70, 0, 70, 0, 4);
      marks(p, d, { a: [X.a + 140, -130], b: [X.b + 140, -130] });
    });
    thing(d, 'a', X.a, 120, 160, c, 310); thing(d, 'b', X.b, 120, 160, c, 310, { op: T.off ? .3 : T.dim('b') });
  });

  /* 12 ── DIALS: two half dials — each needle points to its amount */
  variant('dials', 'หน้าปัดคู่', (d, c) => {
    const T = st(d), X = { a: -240, b: 240 }, cy = 0, R = 190;
    art(c, p => {
      ['a', 'b'].forEach(s => { const x = X[s], f = T.amt(s), ang = 180 + 180 * f, lose = s === T.lose;
        p.path(`M ${x - R} ${cy} A ${R} ${R} 0 0 1 ${x + R} ${cy} Z`, lose ? { fill: C.fill, sw: 2.4, stroke: C.rule } : F(3.4));
        p.path(`M ${x - 150} ${cy} A 150 150 0 0 1 ${x + 150} ${cy}`, { sw: 10, stroke: C.rule });
        p.path(`M ${x - 150} ${cy} A 150 150 0 0 1 ${f1(x + 150 * Math.cos(rad(ang)))} ${f1(cy + 150 * Math.sin(rad(ang)))}`, { sw: 10, stroke: lose ? C.soft : C.ink });
        p.line(x, cy, f1(x + 125 * Math.cos(rad(ang))), f1(cy + 125 * Math.sin(rad(ang))), { sw: 6, stroke: lose ? C.soft : C.ink }); p.circle(x, cy, 16, F(3)); });
      if (T.change) arrowLine(p, -40, -60, 40, -60, 4);
      marks(p, d, { a: [X.a + 170, -170], b: [X.b + 170, -170] });
    });
    ['a', 'b'].forEach(s => thing(d, s, X[s], 120, 120, c, 250));
  });

  /* 13 ── SLIDER: one track from a to b — the handle sits toward the winner (by the amounts when given) */
  variant('slider', 'แถบเลื่อน', (d, c) => {
    const T = st(d), q = T.hasV ? T.vb / (T.va + T.vb) : T.win === 'a' ? .15 : T.win === 'b' ? .85 : .5, hx = -300 + 600 * q;
    art(c, p => {
      p.rect(-320, 130, 640, 40, Object.assign({ rx: 20 }, F(3)));
      if (T.win || (T.hasV && Math.abs(q - .5) > .01)) p.line(T.win === 'a' || (T.hasV && q < .5) ? -300 : hx, 150, T.win === 'a' || (T.hasV && q < .5) ? hx : 300, 150, { sw: 18 });
      for (let k = 0; k <= 4; k++) p.line(-300 + k * 150, 190, -300 + k * 150, 206, W(2));
      p.circle(f1(hx), 150, 42, F(3.6)); p.circle(f1(hx), 150, 12, W(2));
      marks(p, d, { a: [-280, -180], b: [500 - 120, -180] });
    });
    thing(d, 'a', -390, -80, 150, c, 50); thing(d, 'b', 390, -80, 150, c, 50);
  });

  /* 14 ── DOORS: two doors — the winner's is open (both open when undecided), the loser's stays shut */
  variant('doors', 'ประตูคู่', (d, c) => {
    const T = st(d), X = { a: -230, b: 230 };
    art(c, p => {
      p.line(-470, 250, 470, 250, { sw: 2, stroke: C.soft });
      ['a', 'b'].forEach(s => { const x = X[s], open = s !== T.lose;
        p.rect(x - 120, -210, 240, 460, Object.assign({ rx: 6 }, F(3.4)));
        if (open) { p.shape([[x - 100, -190], [x + 100, -190], [x + 100, 250], [x - 100, 250]], { fill: 'rgba(255,255,255,.05)', stroke: 'none', sw: 0 });
          p.path(`M ${x - 120} -210 L ${x - 60} -180 L ${x - 60} 222 L ${x - 120} 250 Z`, F(3)); }
        else { p.rect(x - 100, -190, 200, 440, { fill: C.fill, sw: 2.4, stroke: C.rule }); p.circle(x + 70, 30, 9, { sw: 2, stroke: C.rule }); }
        if (d[s].label) txt(p, d[s].label, x, 310, { maxW: 280, color: open ? C.soft : C.mute }); });
      if (T.change) arrowLine(p, -80, -260, 80, -260, 4);
      marks(p, d, { a: [X.a + 120, -230], b: [X.b + 120, -230] });
    });
    ['a', 'b'].forEach(s => icon(d[s].icon, X[s] + (s === T.lose ? 0 : 20), 40, 150, c, T.dim(s)));
  });

  /* 15 ── PUSH: the winner (or the "after") pushes the other off the platform */
  variant('push', 'ดันแทนที่', (d, c) => {
    const T = st(d), w = T.win || 'b', l = w === 'a' ? 'b' : 'a';
    art(c, p => {
      p.rect(-380, 200, 640, 30, Object.assign({ rx: 8 }, F(3.2)));
      if (T.win) { [-40, 0, 40].forEach(y => p.line(-330, 60 + y, -230, 60 + y, { sw: 3, stroke: C.soft })); }
      marks(p, d, { [w]: [80, -150], [l]: [460, -30] });
    });
    if (T.win) { thing(d, w, -50, 70, 230, c, null); thing(d, l, 380, 230, 150, c, null);
      art(c, p => { if (d[w].label) txt(p, d[w].label, -50, 290, { maxW: 300 }); if (d[l].label) txt(p, d[l].label, 380, 360, { maxW: 220, color: C.mute }); }); }
    else { thing(d, 'a', -170, 80, 210, c, 290); thing(d, 'b', 120, 80, 210, c, 290); }
  });

  /* 16 ── HOURGLASS: "before" in the top bulb, "after" in the bottom — the sand has run through (change only) */
  variant('hourglass', 'นาฬิกาทราย', (d, c) => {
    art(c, p => {
      p.rect(-210, -310, 420, 30, Object.assign({ rx: 10 }, F(3.2))); p.rect(-210, 280, 420, 30, Object.assign({ rx: 10 }, F(3.2)));
      p.path('M -170 -280 L 170 -280 C 170 -140, 30 -60, 30 0 C 30 60, 170 140, 170 280 L -170 280 C -170 140, -30 60, -30 0 C -30 -60, -170 -140, -170 -280 Z', F(3.4));
      p.path('M -120 -110 Q 0 -60 120 -110', { sw: 2, stroke: C.soft }); p.line(0, -10, 0, 190, { sw: 2.4, stroke: C.soft, 'stroke-dasharray': '6 10' });
      p.path('M -140 270 Q 0 170 140 270 Z', { fill: C.ink, sw: 2, 'fill-opacity': .18 });
      if (d.a.label) txt(p, d.a.label, -260, -150, { anchor: 'end', maxW: 220, color: C.mute }); if (d.b.label) txt(p, d.b.label, 260, 170, { anchor: 'start', maxW: 220 });
    });
    icon(d.a.icon, 0, -190, 120, c, .35); icon(d.b.icon, 0, 140, 140, c);
  }, d => d.mode === 'change');

  /* 17 ── BALLOT: two rows with a box each — the winner ticked, the loser crossed (or the "before" struck out) */
  variant('ballot', 'ช่องติ๊ก', (d, c) => {
    const T = st(d), Y = { a: -120, b: 120 };
    art(c, p => {
      p.rect(-430, -260, 860, 520, Object.assign({ rx: 30 }, F(3.2))); p.line(-390, 0, 390, 0, { sw: 1.6, stroke: C.rule });
      ['a', 'b'].forEach(s => { const y = Y[s], k = 22;
        p.rect(-380, y - 45, 90, 90, Object.assign({ rx: 14 }, F(3)));
        if (s === T.win) p.poly([[-358, y + 2], [-340, y + 22], [-308, y - 22]], W(6));
        if (s === T.lose && (d.how === 'x' || T.change)) { p.line(-335 - k, y - k, -335 + k, y + k, W(5)); p.line(-335 + k, y - k, -335 - k, y + k, W(5)); }
        if (d[s].label) { const e = txt(p, d[s].label, -50, y + 16, { anchor: 'start', maxW: 420, size: 52, color: s === T.lose ? C.mute : C.ink, weight: 700 });
          if (T.change && s === 'a') { const bb = e.getBBox(); p.line(bb.x - 6, y - 2, bb.x + bb.width + 6, y - 2, { sw: 4, stroke: C.soft }); } } });
    });
    ['a', 'b'].forEach(s => icon(d[s].icon, -165, Y[s], 120, c, T.dim(s)));
  });

  /* 18 ── FORK: a road splits — the winner's branch is solid and bright, the loser's dashed and faint; change: one path from a to b */
  variant('fork', 'ทางแยก', (d, c) => {
    const T = st(d);
    art(c, p => {
      if (T.change) { p.path('M -330 150 C -150 150, 60 -120, 190 -125', { sw: 8 }); p.poly([[160, -152], [200, -125], [162, -98]], W(8)); p.circle(-330, 150, 14, F(3)); }
      else ['a', 'b'].forEach(s => { const k = s === 'a' ? -1 : 1, lose = s === T.lose;
        p.path(`M 0 290 L 0 150 C 0 50, ${k * 300} 80, ${k * 300} -30`, lose ? { sw: 5, stroke: C.rule, 'stroke-dasharray': '18 16' } : { sw: 8 }); });
      if (!T.change) p.circle(0, 290, 14, F(3));
      marks(p, d, T.change ? { b: [400, -260] } : { a: [-180, -290], b: [420, -290] });
    });
    if (T.change) { thing(d, 'a', -330, 40, 150, c, 260); thing(d, 'b', 340, -200, 170, c, -50); }
    else { thing(d, 'a', -300, -240, 150, c, -95); thing(d, 'b', 300, -240, 150, c, -95); }
  });

  /* 19 ── FRAMES: two pictures on the wall — the winner hangs straight, the loser hangs crooked and faint */
  variant('frames', 'กรอบรูปติดผนัง', (d, c) => {
    const T = st(d), X = { a: -230, b: 230 };
    art(c, p => {
      ['a', 'b'].forEach(s => { const x = X[s], lose = s === T.lose, g = sub(p, { transform: lose ? `rotate(${s === 'a' ? -9 : 9} ${x} -250)` : '' });
        g.line(x, -250, x - 120, -170, W(2)); g.line(x, -250, x + 120, -170, W(2));
        g.rect(x - 170, -170, 340, 340, Object.assign({ rx: 8 }, lose ? { fill: C.fill, sw: 2.6, stroke: C.rule } : F(3.6)));
        g.rect(x - 140, -140, 280, 280, { rx: 4, sw: 1.6, stroke: lose ? C.rule : C.soft });
        p.circle(x, -254, 9, F(2.4));
        if (d[s].label) txt(p, d[s].label, x, 250, { maxW: 300, color: lose ? C.mute : C.soft }); });
      if (T.change) arrowLine(p, -40, 0, 40, 0, 4);
      marks(p, d, { a: [X.a + 160, -170], b: [X.b + 160, -170] });
    });
    ['a', 'b'].forEach(s => icon(d[s].icon, X[s], 0, 170, c, T.dim(s)));
  });

  /* 20 ── SPLIT CIRCLE: one circle shared by both — the seam moves to show the amounts; the loser's half is faint */
  variant('share', 'วงกลมแบ่งส่วน', (d, c) => {
    const T = st(d), R = 260, q = T.hasV ? T.va / (T.va + T.vb) : .5, sx = -R + 2 * R * q, sy = Math.sqrt(R * R - sx * sx);
    art(c, p => {
      p.circle(0, 0, R, F(3.4));
      if (T.lose) { const L = T.lose === 'a'; p.path(L ? `M ${f1(sx)} ${f1(-sy)} A ${R} ${R} 0 ${q > .5 ? 1 : 0} 0 ${f1(sx)} ${f1(sy)} Z` : `M ${f1(sx)} ${f1(-sy)} A ${R} ${R} 0 ${q < .5 ? 1 : 0} 1 ${f1(sx)} ${f1(sy)} Z`, { fill: '#0a0a0a', sw: 0, stroke: 'none' }); }
      p.line(f1(sx), f1(-sy), f1(sx), f1(sy), W(4));
      if (T.win) { const k = T.win === 'a' ? -1 : 1, R2 = R + 30, y2 = Math.sqrt(R2 * R2 - sx * sx), big = k < 0 ? (q > .5 ? 1 : 0) : (q < .5 ? 1 : 0);
        p.path(`M ${f1(sx)} ${f1(-y2)} A ${R2} ${R2} 0 ${big} ${k < 0 ? 0 : 1} ${f1(sx)} ${f1(y2)}`, { sw: 5 }); }
      if (T.change) { p.path(`M -170 -310 Q 0 -360 170 -310`, W(4)); p.poly([[146, -330], [172, -310], [142, -292]], W(4)); }
      marks(p, d, { a: [-300, -230], b: [300, -230] });
    });
    const ca = (-R + sx) / 2, cb = (R + sx) / 2;
    thing(d, 'a', ca, 0, Math.min(170, (sx + R) * .7), c, 15, { lx: -330, anchor: 'end', maxW: 160 });
    thing(d, 'b', cb, 0, Math.min(170, (R - sx) * .7), c, 15, { lx: 330, anchor: 'start', maxW: 160 });
  });

  /* samples from unrelated topics (neutrality) + a stress set (both kept to what each design fits) */
  const SAMPLES = [
    { say: 'กาแฟร้อนกับกาแฟเย็น', mode: 'versus', a: { icon: 'coffee', label: 'ร้อน' }, b: { icon: 'glass-water', label: 'เย็น' } },
    { say: 'ยกเวทเผาผลาญมากกว่าปั่นจักรยาน', mode: 'versus', a: { icon: 'bike', label: 'ปั่นจักรยาน' }, b: { icon: 'dumbbell', label: 'ยกเวท' }, win: 'b', v: { a: .35, b: .8 } },
    { say: 'รถไฟเร็วกว่ารถบัส', mode: 'versus', a: { icon: 'train-front', label: 'รถไฟ' }, b: { icon: 'bus', label: 'รถบัส' }, win: 'a' },
    { say: 'นอนพอ 8 ชั่วโมง กับนอนแค่ 4', mode: 'versus', a: { icon: 'bed', label: 'นอนพอ' }, b: { icon: 'bed', label: 'นอนน้อย' }, v: { a: .9, b: .4 } },
    { say: 'ข้าวกล่องดีกว่าอาหารขยะ', mode: 'versus', a: { icon: 'salad', label: 'ข้าวกล่อง' }, b: { icon: 'pizza', label: 'อาหารขยะ' }, win: 'a', how: 'check' },
    { say: 'จากบ้านเช่า กลายเป็นบ้านของตัวเอง', mode: 'change', a: { icon: 'key', label: 'บ้านเช่า' }, b: { icon: 'house', label: 'บ้านตัวเอง' } },
    { say: 'ปิดแจ้งเตือนแล้วโฟกัสได้', mode: 'change', a: { icon: 'bell', label: 'แจ้งเตือน' }, b: { icon: 'bell-off', label: 'เงียบ' } },
    { say: 'ต้นกล้าโตเป็นต้นไม้ใหญ่', mode: 'change', a: { icon: 'sprout', label: 'ต้นกล้า' }, b: { icon: 'trees', label: 'ต้นไม้ใหญ่' }, v: { a: .25, b: 1 } },
    { say: 'ทีมเราชนะทีมเขา', mode: 'versus', a: { icon: 'users', label: 'ทีมเรา' }, b: { icon: 'users', label: 'ทีมเขา' }, win: 'a' },
    { say: 'ข้อความสั้นอ่านง่ายกว่าข้อความยาว', mode: 'versus', a: { icon: 'message-circle', label: 'สั้น' }, b: { icon: 'file-text', label: 'ยาว' }, win: 'a' },
    { say: 'จากมืดกลายเป็นสว่าง', mode: 'change', a: { icon: 'moon', label: 'มืด' }, b: { icon: 'sun', label: 'สว่าง' } },
    { say: 'แบตเหลือน้อยกว่าที่คิด', mode: 'versus', a: { icon: 'battery-low', label: 'เหลือจริง' }, b: { icon: 'battery-full', label: 'ที่คิด' }, v: { a: .25, b: .8 } },
    { say: 'ยืนทำงานดีกว่านั่งนาน ๆ', mode: 'versus', a: { icon: 'sofa', label: 'นั่งนาน' }, b: { icon: 'person-standing', label: 'ยืนทำงาน' }, win: 'b' },
    { say: 'ร้านใหม่ดีกว่าร้านเก่า', mode: 'versus', a: { icon: 'store', label: 'ร้านเก่า' }, b: { icon: 'store', label: 'ร้านใหม่' }, win: 'b' },
    { say: 'เครื่องใหม่มาแทนเครื่องเก่า', mode: 'change', a: { icon: 'laptop', label: 'เครื่องเก่า' }, b: { icon: 'laptop', label: 'เครื่องใหม่' } },
    { say: 'แป้งกลายเป็นเค้ก', mode: 'change', a: { icon: 'wheat', label: 'แป้ง' }, b: { icon: 'cake', label: 'เค้ก' } },
    { say: 'เดินดีกว่าขับรถในระยะใกล้', mode: 'versus', a: { icon: 'car', label: 'ขับรถ' }, b: { icon: 'person-standing', label: 'เดิน' }, win: 'b', how: 'x' },
    { say: 'ไปภูเขาหรือทะเลดี', mode: 'versus', a: { icon: 'mountain', label: 'ภูเขา' }, b: { icon: 'ship', label: 'ทะเล' } },
    { say: 'หัวใจที่เคยแตกกลับมาดีอีกครั้ง', mode: 'change', a: { icon: 'heart-crack', label: 'เคยเจ็บ' }, b: { icon: 'heart', label: 'หายดี' } },
    { say: 'เวลางานกินเวลาพักผ่อน', mode: 'versus', a: { icon: 'briefcase', label: 'ทำงาน' }, b: { icon: 'bed', label: 'พักผ่อน' }, v: { a: .75, b: .25 } },
  ];
  const STRESS = [
    { say: 'ไม่มีป้ายทั้งสองฝั่ง + ติ๊กฝั่ง b', mode: 'versus', a: { icon: 'apple' }, b: { icon: 'cookie' }, win: 'a', how: 'x' },
    { say: 'ป้ายยาว 12 ตัวอักษร + v', mode: 'versus', a: { icon: 'plane', label: 'เครื่องบินภายใน' }, b: { icon: 'train-front', label: 'รถไฟความเร็วสูง' }, win: 'b', v: { a: .3, b: .9 } },
    { say: 'ของชนิดเดียวกัน ต่างสภาพ (change)', mode: 'change', a: { icon: 'battery-low', label: 'แบตหมด' }, b: { icon: 'battery-full', label: 'ชาร์จเต็ม' } },
    { say: 'v ห่างกันมาก', mode: 'versus', a: { icon: 'smartphone', label: 'จอ' }, b: { icon: 'book', label: 'หนังสือ' }, v: { a: 1, b: .1 }, win: 'a' },
    { say: 'ภาษาอังกฤษ + ✕ ฝั่งแพ้', mode: 'versus', a: { icon: 'tv', label: 'TV' }, b: { icon: 'book-open', label: 'Reading' }, win: 'b', how: 'x' },
    { say: 'change + ✓', mode: 'change', a: { icon: 'lock', label: 'ล็อก' }, b: { icon: 'lock-open', label: 'ปลดล็อก' }, how: 'check' },
    { say: 'switch ปิด (change)', mode: 'change', a: { icon: 'wifi', label: 'ออนไลน์' }, b: { icon: 'wifi-off', label: 'ออฟไลน์' }, switch: false },
    { say: 'change + v ลดลง', mode: 'change', a: { icon: 'trees', label: 'ป่าเดิม' }, b: { icon: 'sprout', label: 'เหลือน้อย' }, v: { a: 1, b: .2 } },
    { say: 'win a ไม่มีป้าย', mode: 'versus', a: { icon: 'sun' }, b: { icon: 'cloud' }, win: 'a' },
    { say: 'ไม่ตัดสิน ไม่มี v', mode: 'versus', a: { icon: 'smile', label: 'ดีใจ' }, b: { icon: 'frown', label: 'เสียใจ' } },
    { say: 'change ป้ายยาว', mode: 'change', a: { icon: 'cloud', label: 'ฝนตกทั้งวัน' }, b: { icon: 'sun', label: 'ฟ้าใสทั้งวัน' } },
    { say: 'win a + ✓', mode: 'versus', a: { icon: 'bike', label: 'จักรยาน' }, b: { icon: 'car', label: 'รถยนต์' }, win: 'a', how: 'check' },
    { say: 'v เท่ากัน', mode: 'versus', a: { icon: 'coffee', label: 'กาแฟ' }, b: { icon: 'glass-water', label: 'น้ำเปล่า' }, v: { a: .5, b: .5 } },
    { say: 'win a + ✕', mode: 'versus', a: { icon: 'umbrella', label: 'พกร่ม' }, b: { icon: 'cloud', label: 'ตากฝน' }, win: 'a', how: 'x' },
    { say: 'change ของต่างชนิด', mode: 'change', a: { icon: 'egg', label: 'ไข่' }, b: { icon: 'cake', label: 'เค้ก' } },
    { say: 'change ไม่มีป้าย', mode: 'change', a: { icon: 'sprout' }, b: { icon: 'flower' } },
    { say: 'win a v', mode: 'versus', a: { icon: 'heart', label: 'ใจ' }, b: { icon: 'banknote', label: 'เงิน' }, win: 'a', v: { a: .8, b: .4 } },
    { say: 'change win a? (ย้อนกลับ)', mode: 'change', a: { icon: 'house', label: 'บ้านเกิด' }, b: { icon: 'plane', label: 'ต่างประเทศ' } },
    { say: 'v กลับด้าน', mode: 'versus', a: { icon: 'smartphone', label: 'หน้าจอ' }, b: { icon: 'trees', label: 'ธรรมชาติ' }, v: { a: .85, b: .15 } },
    { say: 'win b + v (แบ่งส่วน)', mode: 'versus', a: { icon: 'pizza', label: 'ของมัน' }, b: { icon: 'salad', label: 'ผัก' }, win: 'b', v: { a: .3, b: .7 } },
  ];

  G.cats = G.cats || {};
  G.cats.B03 = { variants: V, SAMPLES, STRESS, draw: (i, d, c) => V[i].build(d, c) };
})();
