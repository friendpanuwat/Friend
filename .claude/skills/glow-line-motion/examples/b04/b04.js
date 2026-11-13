/* b04.js — category B04 "ขั้นตอน / เช็กลิสต์": 20 neutral designs.
   Stills approved by the user (2026-11-13). Motion follows CutPack's rule (CATEGORIES.md §9) + pro motion:
     the frame enters → steps 1, 2, 3 come in one by one (in reading order) → a quick pulse runs through them in order (the "pointer") →
     on the keyword (c.hit) the marked step lights (halo, the others fade) / gets a tick / gets a cross — with no mark the last step lands → hold → exit.
   Slots (same as CutPack CATEGORIES.md B04): items [{ icon, label? } × 3 (2–4 ok)] in order · mark { at 0–2, how 'light' | 'check' | 'x' } (optional).
   Arrows only where the picture cannot show the direction itself (user's rule).
   GL.cats.B04.draw(i, data, { x, y, s, at, hit })  — canvas 1000 × 700 centred at (0,0); hit = seconds after `at` (default 1.8).
   The last frame equals the approved still. */
(function () {
  const G = window.GL, C = G.C;
  /* TIMING (same system as b05.js, 2026-11-13: user "ย้าย B01–B04 มาใช้ระบบเวลาใหม่"): the keyword c.hit comes from the speech and never
     moves. M = how long each move takes = 1 / speed (c.speed, else the clip's GL.stage / GL.motion speed), but at most hit / HIT0 —
     a sentence shorter than the designed 1.8 s squeezes the whole design evenly, so nothing overlaps. Every time constant is u(x) = x·M;
     times before / after the keyword are bH(x) = hit − x·M / aH(x) = hit + x·M. Defaults (speed 1, hit 1.8) = the approved timing exactly.
     setZ(c) runs at the start of every draw(); kf() keeps every key in time order (CLAMPS counts any fix, for the checker). */
  const HIT0 = 1.8; let Z = null; const CLAMPS = {}; let CUR = '';
  function setZ(c) { const sp = Math.min(20, Math.max(.05, +(c.speed ?? G.motion().speed ?? 1) || 1)), H = c.hit ?? HIT0, M = Math.max(.4, Math.min(1 / sp, H / HIT0));
    Z = { sp: 1 / M, want: sp, M, H }; }
  const tu = x => x * Z.M, bH = x => Z.H - x * Z.M, aH = x => Z.H + x * Z.M;
  function fixT(spec) { for (const n in spec) { const k = spec[n]; if (!Array.isArray(k)) continue;
    for (let i = 1; i < k.length; i++) if (k[i][0] < k[i - 1][0] - 1e-9) { k[i] = [k[i - 1][0], k[i][1], k[i][2]]; CLAMPS[CUR] = (CLAMPS[CUR] || 0) + 1; } } return spec; }
  const kf = (e, t, spec) => G.kf(e, t, fixT(spec));

  const W = (w = 2) => ({ sw: w }), F = (w = 3.2) => ({ fill: C.fill, sw: w });
  const rad = d => d * Math.PI / 180, f1 = v => +v.toFixed(1);
  const hitOf = () => Z.H;
  const n = d => Math.max(2, Math.min(4, d.items.length));
  const spread = (k, a, b) => [...Array(k)].map((_, i) => k === 1 ? (a + b) / 2 : a + (b - a) * i / (k - 1));
  const GLASS = 'rgba(255,255,255,.07)';            // translucent fill (Pen forces fill-opacity to 1, so the colour carries the alpha)

  /* ---------- motion plumbing (same family as b01–b03) ---------- */
  const sub = (p, a) => { const q = p.child(a || {}); q.H = p.H; q.T = p.T; q.motion = p.motion; return q; };
  const on = (q, p, t, spec) => kf(q.g || q, p.t0 + t * p.ts, spec);
  const pop = (q, p, t, ox = 0, oy = 0, from = .5) => on(q, p, t, { ox, oy, s: [[0, from], [tu(.24), 1.06, 'out'], [tu(.38), 1, 'soft']], o: [[0, 0], [tu(.1), 1]] });
  const drawIn = (el, p, t, dur = tu(.4)) => on(el, p, t, { draw: [[0, 0], [dur, 1, 'out']] });
  /* timing of a design: steps enter at tI(i), the pulse passes step i at tP(i), the verdict lands on H on step `mk` (marked, or the last) */
  function timing(d, c) {
    const k = n(d), H = hitOf(c), gap = Math.min(tu(.3), (bH(.8)) / k), tI = i => tu(.15) + i * gap, tA = tI(k - 1) + tu(.35);
    return { k, H, tI, tP: i => tA + (bH(.15) - tA) * i / k, mk: d.mark ? d.mark.at : k - 1 };
  }
  const art = (c, d, fn) => { const f = p => { p.H = hitOf(c); p.T = timing(d, c); fn(p); }; f.custom = true; f.dur = tu(.35); f.exit = 'pop'; const a = G.art(f, { x: c.x, y: c.y, s: c.s, at: c.at || 0, speed: 1 }); a.speed = Z.sp; return a; };

  /* how strongly step i shows at the end: light → others fade to .5; x → the crossed step fades to .55 */
  function op(d, i) { const m = d.mark; if (!m) return 1; if (m.how === 'light') return i === m.at ? 1 : .5; if (m.how === 'x' && i === m.at) return .55; return 1; }
  const isM = (d, i) => d.mark && d.mark.at === i;
  /* scale keys for step i: a small pulse when the pointer passes, a bigger one on the keyword for the landing step */
  function pulseKeys(T, i) { const s = [[0, 1]];
    if (i !== T.mk) s.push([T.tP(i), 1], [T.tP(i) + tu(.07), 1.05, 'out'], [T.tP(i) + tu(.25), 1, 'soft']);
    else s.push([T.H, 1], [aH(.07), 1.1, 'out'], [aH(.3), 1, 'soft']);
    return s; }
  const ENTRY = {
    pop:   t => ({ s: [[0, .5], [t, .5], [t + tu(.24), 1.06, 'out'], [t + tu(.38), 1, 'soft']] }),
    drop:  t => ({ y: [[0, -90], [t, -90], [t + tu(.3), 0, 'in'], [t + tu(.38), -8, 'out'], [t + tu(.48), 0, 'soft']] }),
    rise:  t => ({ y: [[0, 60], [t, 60], [t + tu(.32), 0, 'out']] }),
    slide: t => ({ x: [[0, 80], [t, 80], [t + tu(.32), 0, 'out']] }),
    flip:  t => ({ sx: [[0, 0], [t, 0], [t + tu(.24), 1.06, 'out'], [t + tu(.36), 1, 'soft']] }),
  };
  /* a step group: enters at tI(i) (kind), fades to op() on the keyword, pulses with the pointer. lift = [dx, dy] it moves to on the keyword
     when it is the marked step (cards rise, tabs pull up …). Draw the step's own parts into the returned pen. */
  function stepG(p, d, i, ox, oy, kind = 'pop', lift) {
    const T = p.T, t = T.tI(i), o = op(d, i), out = sub(p);
    on(out, p, 0, Object.assign({ ox, oy, o: o < 1 ? [[0, 0], [t, 0], [t + tu(.12), 1], [T.H, 1], [aH(.25), o]] : [[0, 0], [t, 0], [t + tu(.12), 1]] }, ENTRY[kind](t)));
    let mv = out; if (lift && isM(d, i)) { mv = sub(out); on(mv, p, 0, { x: [[0, 0], [T.H, 0], [aH(.3), lift[0], 'back']], y: [[0, 0], [T.H, 0], [aH(.3), lift[1], 'back']] }); }
    const inn = sub(mv); on(inn, p, 0, { ox, oy, s: pulseKeys(T, i) });
    return inn;
  }
  function txt(p, str, x, y, { size = 42, maxW = 1e9, weight = 600, anchor = 'middle', color = C.soft } = {}) {
    const e = p.text(String(str), x, y, { size, weight, anchor, color, dur: .01 });
    const w = e.getBBox().width; if (w > maxW) e.setAttribute('font-size', f1(size * maxW / w));
    return e;
  }
  /* step i's icon: enters with its step, follows the pulse, fades with op(); o.lift / o.rot like its step */
  function icon(d, i, cx, cy, wd, c, o = {}) {
    const name = d.items[i].icon; if (!name || wd <= 0) return null;
    const fn = G.icons[name] || G.icons[name + '-pro'];
    if (!fn) { console.warn('B04: no icon', name); return null; }
    const at = c.at || 0, T = timing(d, c), X = c.x + cx * c.s, Y = c.y + cy * c.s, t = T.tI(i) + (o.delay ?? tu(.08));
    const a = G.art(fn, { x: X, y: Y, w: wd * c.s, at: at + t, speed: Z.sp });
    const K = {}, v = op(d, i);
    if (v < 1) K.o = [[0, 1], [T.H, 1], [aH(.25), v]];
    if (o.rot) { K.r = [[0, o.rot[0]]]; K.ox = c.x + o.rot[1] * c.s; K.oy = c.y + o.rot[2] * c.s; }
    if (o.lift && isM(d, i)) { K.x = [[0, 0], [T.H, 0], [aH(.3), o.lift[0] * c.s, 'back']]; K.y = [[0, 0], [T.H, 0], [aH(.3), o.lift[1] * c.s, 'back']]; }
    if (o.keys) Object.assign(K, o.keys(c.s));
    if (Object.keys(K).length) kf(a.wrap, at, K);
    kf(a.g, at, { ox: X, oy: Y, s: pulseKeys(T, i) });
    return a;
  }
  /* step number plate — the marked step's plate turns solid on the keyword */
  function num(p, d, i, x, y, r = 30) {
    p.circle(x, y, r, F(2.8)); txt(p, i + 1, x, y + r * .36, { size: r * 1.05, weight: 700, color: C.ink });
    if (isM(d, i)) { const g = sub(p); g.circle(x, y, r, { fill: C.ink, sw: 2 }); txt(g, i + 1, x, y + r * .36, { size: r * 1.05, weight: 700, color: C.fill }); on(g, p, p.H, { o: [[0, 0], [tu(.12), 1]] }); }
  }
  /* light mark: a halo that blooms on the keyword */
  function mark(p, d, x, y, hr = 110) {
    if (!d.mark || d.mark.how !== 'light') return; const g = sub(p);
    g.circle(x, y, hr, { fill: GLASS, sw: 0, stroke: 'none' }); g.circle(x, y, hr, { sw: 2.4, stroke: C.soft });
    on(g, p, p.H, { ox: x, oy: y, s: [[0, .6], [tu(.2), 1.08, 'out'], [tu(.4), 1, 'soft']], o: [[0, 0], [tu(.12), 1]] });
  }
  /* check / x badge: stamped in right after the keyword */
  function badge(p, d, x, y, r = 36) {
    if (!d.mark || d.mark.how === 'light') return; const g = sub(p), k = r * .42; g.circle(x, y, r, F(3));
    if (d.mark.how === 'x') { g.line(x - k, y - k, x + k, y + k, W(5)); g.line(x + k, y - k, x - k, y + k, W(5)); }
    else g.poly([[x - k, y + 2], [x - k * .2, y + k * .8], [x + k * 1.05, y - k * .75]], W(5));
    on(g, p, aH(.04), { ox: x, oy: y, s: [[0, 1.8], [tu(.14), .9, 'in'], [tu(.26), 1.04], [tu(.38), 1, 'soft']], o: [[0, 0], [tu(.06), 1]] });
  }
  /* something that appears on the keyword (a filled bar, a highlight row, a check stroke) */
  const atHit = (g, p, keys) => on(g, p, p.H, keys || { o: [[0, 0], [tu(.15), 1]] });
  const lbl = (p, d, i, x, y, o = {}) => d.items[i].label && txt(p, d.items[i].label, x, y, Object.assign({ maxW: 260 }, o));
  function chev(p, x, y, s = 18, w = 4) { p.poly([[x - s * .5, y - s], [x + s * .5, y], [x - s * .5, y + s]], W(w)); }

  const V = [];
  const variant = (id, th, build) => V.push({ id, th, build });

  /* 01 ── NODES: the line draws out, each node pops with its step above it, the pointer runs along the nodes */
  variant('nodes', 'เส้นจุดลำดับ', (d, c) => {
    const k = n(d), xs = spread(k, -330, 330);
    art(c, d, p => {
      drawIn(p.line(-430, 60, 430, 60, { sw: 3, stroke: C.soft }), p, 0, .5);
      xs.forEach((x, i) => { mark(p, d, x, -100, 115); const S = stepG(p, d, i, x, 60); num(S, d, i, x, 60, 34); lbl(S, d, i, x, 165); });
      xs.forEach((x, i) => isM(d, i) && badge(p, d, x + 85, -190));
    });
    xs.forEach((x, i) => icon(d, i, x, -100, 150, c));
  });

  /* 02 ── STAIRS: the staircase rises, then each item drops onto its step in turn */
  variant('stairs', 'บันไดขั้น', (d, c) => {
    const k = n(d), sw = 820 / k, rise = 120, x0 = -410, top = i => 280 - (i + 1) * rise, cx = i => x0 + i * sw + sw / 2;
    art(c, d, p => {
      const st = sub(p); on(st, p, 0, { ox: x0, oy: 280, sy: [[0, 0], [tu(.35), 1.04, 'out'], [tu(.48), 1, 'soft']], o: [[0, 0], [tu(.05), 1]] });
      const pts = [[x0, 280]]; for (let i = 0; i < k; i++) pts.push([x0 + i * sw, top(i)], [x0 + (i + 1) * sw, top(i)]); pts.push([x0 + k * sw, 280]);
      st.shape(pts.map(([x, y]) => [f1(x), f1(y)]), F(3.2));
      for (let i = 0; i < k; i++) { const S = stepG(p, d, i, cx(i), top(i) + 55); num(S, d, i, cx(i), top(i) + 55, 28); lbl(S, d, i, cx(i), 320, { maxW: sw - 20 }); }
      for (let i = 0; i < k; i++) if (isM(d, i)) { mark(p, d, cx(i), top(i) - 85, 100); badge(p, d, cx(i) + 80, top(i) - 170); }
    });
    for (let i = 0; i < k; i++) icon(d, i, cx(i), top(i) - 80, 130, c, { keys: s => ({ y: [[0, -120 * s], [timing(d, c).tI(i) + tu(.08), -120 * s], [timing(d, c).tI(i) + tu(.36), 0, 'in']] }) });
  });

  /* 03 ── CLIPBOARD: the clipboard slides up, rows appear one by one — on the keyword the box is ticked / crossed / the row lights */
  variant('clipboard', 'คลิปบอร์ดเช็กลิสต์', (d, c) => {
    const k = n(d), ys = spread(k, -130, 200);
    art(c, d, p => {
      const B = sub(p); on(B, p, 0, { y: [[0, 90], [tu(.35), 0, 'out']], o: [[0, 0], [tu(.12), 1]] });
      B.rect(-330, -260, 660, 560, Object.assign({ rx: 26 }, F(3.4)));
      B.rect(-90, -300, 180, 70, Object.assign({ rx: 16 }, F(3.2))); B.circle(0, -265, 12, W(2.4));
      ys.forEach((y, i) => { if (i) B.line(-280, y - (ys[1] - ys[0]) / 2, 280, y - (ys[1] - ys[0]) / 2, { sw: 1.4, stroke: C.rule });
        const m = isM(d, i);
        if (m && d.mark.how === 'light') atHit(B.rect(-300, y - 62, 600, 124, { rx: 18, fill: GLASS, sw: 2, stroke: C.soft }), p);
        const S = stepG(p, d, i, -60, y, 'slide');
        S.rect(-275, y - 32, 64, 64, Object.assign({ rx: 12 }, F(3)));
        if (m && d.mark.how === 'check') on(S.poly([[-259, y + 2], [-246, y + 16], [-224, y - 16]], W(6)), p, p.H, { draw: [[0, 0], [tu(.22), 1, 'out']] });
        if (m && d.mark.how === 'x') { on(S.line(-262, y - 18, -226, y + 18, W(5)), p, p.H, { draw: [[0, 0], [tu(.12), 1, 'out']] }); on(S.line(-226, y - 18, -262, y + 18, W(5)), p, aH(.1), { draw: [[0, 0], [tu(.12), 1, 'out']] }); }
        lbl(S, d, i, -60, y + 15, { anchor: 'start', maxW: 320, size: 46, weight: 700, color: C.ink }); });
    });
    ys.forEach((y, i) => icon(d, i, -130, y, 96, c));
  });

  /* 04 ── CARDS: the cards flip in one by one, chevrons pop between them — the marked card rises on the keyword */
  variant('cards', 'การ์ดเลขข้อ', (d, c) => {
    const k = n(d), xs = spread(k, -320, 320), cw = Math.min(240, 760 / k - 30), lift = d.mark && d.mark.how === 'light' ? [0, -18] : null;
    art(c, d, p => {
      xs.forEach((x, i) => { const S = stepG(p, d, i, x, 0, 'flip', lift);
        S.rect(x - cw / 2, -170, cw, 340, Object.assign({ rx: 26 }, F(3.2))); num(S, d, i, x, -170, 34); lbl(S, d, i, x, 125, { maxW: cw - 30 });
        if (isM(d, i)) { if (lift) atHit(S.rect(x - cw / 2, -170, cw, 340, Object.assign({ rx: 26 }, { sw: 4.2 })), p); badge(p, d, x + cw / 2 - 6, -150); } });
      for (let i = 0; i < k - 1; i++) { const g = sub(p), x = (xs[i] + xs[i + 1]) / 2; chev(g, x, 0, 18, 4); on(g, p, p.T.tI(i + 1) - tu(.05), { x: [[0, -20], [tu(.25), 0, 'out']], o: [[0, 0], [tu(.12), 1]] }); }
    });
    xs.forEach((x, i) => icon(d, i, x, -10, cw * .6, c, { lift }));
  });

  /* 05 ── TRAIN (redrawn with real parts at the user's request): a locomotive — boiler, chimney with steam, dome, cab, cow-catcher, big wheels
     with a coupling rod — pulls in from the right; the cars (roof, chassis, wheel pairs, couplers) couple on one by one, step 1 right behind it */
  variant('train', 'ขบวนรถไฟ', (d, c) => {
    const k = n(d), cw = Math.min(200, 690 / k - 22), gap = 22, xs = [...Array(k)].map((_, i) => -205 + gap + cw / 2 + i * (cw + gap));
    art(c, d, p => {
      const R = sub(p); on(R, p, 0, { o: [[0, 0], [tu(.2), 1]] });
      R.line(-480, 198, 480, 198, W(4)); for (let x = -460; x < 480; x += 56) R.rect(x - 16, 204, 32, 12, Object.assign({ rx: 3 }, { sw: 1.8, stroke: C.soft }));
      const E = sub(p); on(E, p, 0, { x: [[0, 560], [tu(.5), 0, 'out'], [tu(.6), -10], [tu(.75), 0, 'soft']], o: [[0, 0], [tu(.1), 1]] });
      const st = sub(E); [[-410, -95, 18], [-378, -128, 24], [-334, -150, 17]].forEach(([x, y, r]) => st.circle(x, y, r, { fill: C.fill, sw: 2.2, stroke: C.soft }));
      on(st, p, tu(.5), { loop: tu(1.6), y: [[0, 8], [tu(1.6), -14, 'out']], o: [[0, .4], [tu(.4), 1], [tu(1.6), .4]] });
      E.path('M -432 -58 L -388 -58 L -396 -40 L -424 -40 Z', F(2.6)); E.rect(-424, -40, 28, 64, F(2.8));       // chimney
      E.rect(-300, -66, 82, 186, Object.assign({ rx: 6 }, F(3.2))); E.rect(-312, -82, 106, 20, Object.assign({ rx: 6 }, F(3)));   // cab + roof
      E.rect(-286, -44, 52, 48, Object.assign({ rx: 6 }, W(2.2)));
      E.rect(-448, 16, 156, 98, Object.assign({ rx: 40 }, F(3.4))); [-400, -345].forEach(x => E.line(x, 22, x, 108, W(1.8)));   // boiler + bands
      E.path('M -380 18 A 20 20 0 0 1 -340 18 Z', F(2.6)); E.circle(-448, 56, 10, F(2.4));                       // dome, lamp
      E.rect(-456, 114, 238, 22, Object.assign({ rx: 6 }, F(3))); E.path('M -456 136 L -476 186 L -436 186 L -436 136 Z', F(2.6));   // frame, cow-catcher
      [-398, -318].forEach(x => { E.circle(x, 160, 32, F(3)); E.circle(x, 160, 9, W(2.2)); }); E.line(-398, 168, -318, 168, W(4)); E.circle(-262, 172, 18, F(2.6));
      xs.forEach((x, i) => { const S = stepG(p, d, i, x, 40, 'slide'), xl = x - cw / 2;
        S.line(xl - gap, 128, xl, 128, W(4)); S.rect(xl - gap / 2 - 7, 121, 14, 14, Object.assign({ rx: 3 }, F(2)));          // coupler
        S.rect(xl - 10, -76, cw + 20, 20, Object.assign({ rx: 6 }, F(3)));                                                       // roof
        S.rect(xl, -56, cw, 176, Object.assign({ rx: 10 }, F(3.2)));                                                              // body
        if (isM(d, i) && d.mark.how === 'light') atHit(S.rect(xl, -56, cw, 176, Object.assign({ rx: 10 }, { fill: GLASS, sw: 4.4 })), p);
        S.rect(xl - 4, 120, cw + 8, 16, Object.assign({ rx: 4 }, F(2.6)));                                                       // chassis
        [xl + cw * .24, xl + cw * .76].forEach(wx => { S.circle(wx, 168, 22, F(3)); S.circle(wx, 168, 6, W(2)); });
        num(S, d, i, x, -66, 26); lbl(S, d, i, x, 285, { maxW: cw + 14 });
        if (isM(d, i)) badge(p, d, x + cw / 2, -60); });
    });
    xs.forEach((x, i) => icon(d, i, x, 32, cw * .52, c));
  });

  /* 06 ── STEPPER: the spine draws down, each numbered step slides in beside it — the marked row lights on the keyword */
  variant('stepper', 'ลำดับแนวตั้ง', (d, c) => {
    const k = n(d), ys = spread(k, -220, 220);
    art(c, d, p => {
      drawIn(p.line(-300, ys[0], -300, ys[k - 1], { sw: 4, stroke: C.soft }), p, tu(.1), p.T.tI(k - 1));
      ys.forEach((y, i) => { if (isM(d, i) && d.mark.how === 'light') atHit(p.rect(-360, y - 80, 780, 160, { rx: 30, fill: GLASS, sw: 2.2, stroke: C.soft }), p);
        const S = stepG(p, d, i, -300, y, 'slide'); num(S, d, i, -300, y, 46); lbl(S, d, i, -60, y + 16, { anchor: 'start', maxW: 380, size: 48, weight: 700, color: C.ink });
        if (isM(d, i)) badge(p, d, 360, y); });
    });
    ys.forEach((y, i) => icon(d, i, -150, y, 110, c));
  });

  /* 07 ── ROAD: the road draws on, each marker post springs up beside it with its step above */
  variant('road', 'ถนนหลักบอกทาง', (d, c) => {
    const k = n(d), xs = spread(k, -300, 300), ry = x => 150 - .27 * x;
    art(c, d, p => {
      const D = 'M -470 277 C -250 245, -150 170, 0 150 S 250 70, 470 23';
      [p.path(D, { sw: 56 }), p.path(D, { sw: 46, stroke: C.fill }), p.path(D, { sw: 3, stroke: C.soft })].forEach(e => drawIn(e, p, 0, .55));
      xs.forEach((x, i) => { const b = ry(x) - 30, S = stepG(p, d, i, x, b, 'rise');
        S.line(x, b, x, b - 80, W(5)); S.rect(x - 38, b - 150, 76, 70, Object.assign({ rx: 10 }, F(3))); txt(S, i + 1, x, b - 100, { size: 42, weight: 700, color: C.ink });
        if (isM(d, i)) { const g = sub(S); g.rect(x - 38, b - 150, 76, 70, Object.assign({ rx: 10 }, { fill: C.ink, sw: 2 })); txt(g, i + 1, x, b - 100, { size: 42, weight: 700, color: C.fill }); atHit(g, p);
          mark(p, d, x, b - 230, 85); badge(p, d, x + 70, b - 290, 30); }
        lbl(S, d, i, x, b - 320, { maxW: 240 }); });
    });
    xs.forEach((x, i) => icon(d, i, x, ry(x) - 260, 115, c));
  });

  /* 08 ── LADDER: the rails draw up, the rungs follow, each step pops beside its rung from the bottom up */
  variant('ladder', 'บันไดลิง', (d, c) => {
    const k = n(d), ys = spread(k, 200, -200);
    art(c, d, p => {
      [-70, 70].forEach(x => on(p.line(x, 300, x, -300, { sw: 10 }), p, 0, { draw: [[0, 0], [tu(.45), 1, 'out']] }));
      let r = 0; for (let y = 260; y > -300; y -= 70) drawIn(p.line(-70, y, 70, y, W(4)), p, .1 + (r++) * .04, .15);
      ys.forEach((y, i) => { const s = i % 2 ? 1 : -1, S = stepG(p, d, i, s * 230, y);
        num(S, d, i, 0, y, 30); S.line(s * 70, y, s * 130, y, { sw: 2, stroke: C.soft });
        lbl(S, d, i, s * 350, y + 14, { anchor: s > 0 ? 'start' : 'end', maxW: 140 });
        if (isM(d, i)) { mark(p, d, s * 230, y, 95); badge(p, d, s * 320, y - 70); } });
    });
    ys.forEach((y, i) => icon(d, i, (i % 2 ? 1 : -1) * 230, y, 120, c));
  });

  /* 09 ── NOTEBOOK: the page comes up, each line is written in turn — the marked line is highlighted on the keyword */
  variant('notebook', 'สมุดจด', (d, c) => {
    const k = n(d), ys = spread(k, -120, 190);
    art(c, d, p => {
      const B = sub(p); on(B, p, 0, { y: [[0, 90], [tu(.35), 0, 'out']], o: [[0, 0], [tu(.12), 1]] });
      B.rect(-360, -270, 720, 560, Object.assign({ rx: 18 }, F(3.4)));
      for (let x = -300; x <= 300; x += 60) { B.circle(x, -270, 12, F(2.4)); B.line(x, -282, x, -250, W(2.4)); }
      B.line(-250, -220, -250, 270, { sw: 1.6, stroke: C.soft });
      ys.forEach((y, i) => { B.line(-330, y + 50, 330, y + 50, { sw: 1.2, stroke: C.rule });
        if (isM(d, i) && d.mark.how === 'light') on(B.path(`M -240 ${y + 32} L 300 ${y + 32}`, { sw: 34, stroke: 'rgba(255,255,255,.1)' }), p, p.H, { draw: [[0, 0], [tu(.3), 1, 'out']] });
        const S = stepG(p, d, i, -60, y, 'slide');
        txt(S, (i + 1) + '.', -300, y + 18, { size: 50, weight: 700, color: C.ink }); lbl(S, d, i, -90, y + 18, { anchor: 'start', maxW: 360, size: 46, weight: 700, color: C.ink });
        if (isM(d, i)) badge(p, d, 300, y); });
    });
    ys.forEach((y, i) => icon(d, i, -165, y, 90, c));
  });

  /* 10 ── STONES: ripples on the water, the stones surface one after another and each step hops onto its stone */
  variant('stones', 'หินข้ามน้ำ', (d, c) => {
    const k = n(d), P = spread(k, 0, 1).map(t => [-330 + 660 * t, 150 - 230 * t]);
    art(c, d, p => {
      [[-470, 300, -200], [-300, 230, 100], [100, 280, 470], [-470, 60, -380], [300, 120, 470]].forEach(([x1, y, x2], j) => {
        let D = `M ${x1} ${y}`; for (let x = x1; x < x2; x += 60) D += ` q 15 -12 30 0 t 30 0`; const w = sub(p); w.path(D, { sw: 2, stroke: C.rule });
        on(w, p, 0, { x: [[0, -20], [tu(2.4), 20, 'soft']], o: [[0, 0], [tu(.2 + j * .05), 1]] }); });
      P.forEach(([x, y], i) => { const S = stepG(p, d, i, x, y + 70, 'rise');
        S.ellipse(x, y + 70, 150, 50, F(3.2)); S.path(`M ${x - 110} ${y + 75} Q ${x} ${y + 95} ${x + 110} ${y + 75}`, { sw: 1.6, stroke: C.soft });
        num(S, d, i, x + 120, y + 80, 26); lbl(S, d, i, x, y + 160, { maxW: 240 });
        if (isM(d, i)) { mark(p, d, x, y - 20, 105); badge(p, d, x + 90, y - 110); } });
    });
    P.forEach(([x, y], i) => icon(d, i, x, y - 20, 125, c, { keys: s => { const t = timing(d, c).tI(i) + tu(.08); return { y: [[0, -110 * s], [t, -110 * s], [t + tu(.28), 0, 'in']] }; } }));
  });

  /* 11 ── TABS: the folders slide up into the row one by one — the marked folder pulls up on the keyword */
  variant('tabs', 'แฟ้มแท็บ', (d, c) => {
    const k = n(d), xs = spread(k, -300, 300), w = Math.min(290, 840 / k), lift = [0, -50];
    art(c, d, p => {
      drawIn(p.line(-470, 260, 470, 260, { sw: 2, stroke: C.soft }), p, 0, .35);
      xs.forEach((x, i) => { const S = stepG(p, d, i, x, 50, 'rise', lift);
        S.path(`M ${x - w / 2} 250 L ${x - w / 2} -150 L ${x - w / 2 + 20} -150 L ${x - w / 2 + 30} -195 L ${x - w / 2 + 110} -195 L ${x - w / 2 + 120} -150 L ${x + w / 2} -150 L ${x + w / 2} 250 Z`, F(3.3));
        txt(S, i + 1, x - w / 2 + 70, -160, { size: 38, weight: 700, color: C.ink }); lbl(S, d, i, x, 200, { maxW: w - 30 });
        if (isM(d, i)) badge(p, d, x + w / 2 - 20, -180); });
    });
    xs.forEach((x, i) => icon(d, i, x, 30, w * .55, c, { lift }));
  });

  /* 12 ── CHEVRONS: the chevron segments slide in one after another — the marked segment lights on the keyword */
  variant('chevrons', 'ลูกศรต่อกัน', (d, c) => {
    const k = n(d), W0 = 900 / k, h = 150, x0 = -450;
    art(c, d, p => {
      for (let i = 0; i < k; i++) { const xa = x0 + i * W0, xb = xa + W0 - 12, t = 50, S = stepG(p, d, i, xa + W0 / 2, 0, 'slide');
        const sh = [[xa, -h], [xb, -h], [xb + t, 0], [xb, h], [xa, h], [xa + (i ? t : 0), 0]].map(([x, y]) => [f1(x), f1(y)]);
        S.shape(sh, F(3.2)); if (isM(d, i) && d.mark.how === 'light') atHit(S.shape(sh, { fill: GLASS, sw: 4, stroke: C.ink }), p);
        txt(S, i + 1, xa + 40 + (i ? 30 : 0), -h + 50, { size: 36, weight: 700, color: C.ink }); lbl(S, d, i, xa + W0 / 2 + 10, h + 70, { maxW: W0 - 20 });
        if (isM(d, i)) badge(p, d, xb - 10, -h, 32); }
    });
    for (let i = 0; i < k; i++) icon(d, i, x0 + i * W0 + W0 / 2 + 15, 10, Math.min(150, W0 * .5), c);
  });

  /* 13 ── PROGRESS: the segments appear in turn — on the keyword the marked segment fills */
  variant('progress', 'แถบความคืบหน้า', (d, c) => {
    const k = n(d), W0 = 860 / k, x0 = -430;
    art(c, d, p => {
      for (let i = 0; i < k; i++) { const xa = x0 + i * W0 + 8, cx = xa + (W0 - 16) / 2, S = stepG(p, d, i, cx, 135);
        S.rect(xa, 100, W0 - 16, 70, Object.assign({ rx: 35 }, F(3))); txt(S, i + 1, cx, 148, { size: 40, weight: 700, color: C.ink });
        if (isM(d, i)) { const g = sub(S); g.rect(xa, 100, W0 - 16, 70, Object.assign({ rx: 35 }, { fill: C.ink, sw: 2 })); txt(g, i + 1, cx, 148, { size: 40, weight: 700, color: C.fill });
          on(g, p, bH(.2), { ox: xa, oy: 135, sx: [[0, 0], [tu(.25), 1, 'out']], o: [[0, 0], [tu(.05), 1]] }); mark(p, d, cx, -80, 115); badge(p, d, xa + W0 - 40, -170); }
        lbl(S, d, i, cx, 250, { maxW: W0 - 20 }); }
    });
    for (let i = 0; i < k; i++) icon(d, i, x0 + i * W0 + W0 / 2, -80, Math.min(160, W0 * .55), c);
  });

  /* 14 ── TOWER: blocks drop on one by one, 1 at the bottom — the marked block slides out on the keyword */
  variant('tower', 'บล็อกต่อชั้น', (d, c) => {
    const k = n(d), bh = Math.min(170, 560 / k), y0 = 280, lift = d.mark && d.mark.how === 'light' ? [40, 0] : null;
    art(c, d, p => {
      drawIn(p.line(-470, y0, 470, y0, { sw: 2, stroke: C.soft }), p, 0, .35);
      for (let i = 0; i < k; i++) { const y = y0 - (i + 1) * bh, S = stepG(p, d, i, 0, y + bh / 2, 'drop', lift);
        S.rect(-250, y + 6, 500, bh - 8, Object.assign({ rx: 14 }, F(3.2))); num(S, d, i, -200, y + bh / 2, 30);
        lbl(S, d, i, -20, y + bh / 2 + 15, { anchor: 'start', maxW: 250, size: 44, weight: 700, color: C.ink });
        if (isM(d, i)) { atHit(S.rect(-250, y + 6, 500, bh - 8, Object.assign({ rx: 14 }, { sw: 4.2 })), p); badge(p, d, 250 + (lift ? 40 : 0), y + 20); } }
    });
    for (let i = 0; i < k; i++) icon(d, i, -100, y0 - (i + .5) * bh, bh * .6, c, { lift, keys: s => { const t = timing(d, c).tI(i) + tu(.08); return { y: [[0, -90 * s], [t, -90 * s], [t + tu(.3), 0, 'in']] }; } });
  });

  /* 15 ── PINNED NOTES: each note is pinned up in turn, the thread runs on from pin to pin */
  variant('pins', 'โน้ตโยงด้าย', (d, c) => {
    const k = n(d), P = spread(k, 0, 1).map((t, i) => [-320 + 640 * t, i % 2 ? -60 : 60]);
    art(c, d, p => {
      for (let i = 0; i < k - 1; i++) on(p.path(`M ${P[i][0]} ${P[i][1] - 120} Q ${(P[i][0] + P[i + 1][0]) / 2} ${(P[i][1] + P[i + 1][1]) / 2 - 60} ${P[i + 1][0]} ${P[i + 1][1] - 120}`, { sw: 2.4, stroke: C.soft }), p, p.T.tI(i + 1), { draw: [[0, 0], [tu(.3), 1, 'out']] });
      P.forEach(([x, y], i) => { const r = i % 2 ? 4 : -4, S = stepG(p, d, i, x, y - 120, 'drop'), g = sub(S, { transform: `rotate(${r} ${x} ${y})` });
        g.rect(x - 120, y - 120, 240, 260, Object.assign({ rx: 10 }, F(3.2))); if (isM(d, i) && d.mark.how === 'light') atHit(g.rect(x - 120, y - 120, 240, 260, Object.assign({ rx: 10 }, { sw: 4.2 })), p);
        lbl(g, d, i, x, y + 105, { maxW: 200 }); txt(g, i + 1, x - 85, y - 70, { size: 38, weight: 700, color: C.ink });
        S.circle(x, y - 120, 18, F(3)); if (isM(d, i)) { const pn = sub(S); pn.circle(x, y - 120, 18, { fill: C.ink, sw: 2 }); atHit(pn, p); badge(p, d, x + 110, y - 110, 32); } });
    });
    P.forEach(([x, y], i) => icon(d, i, x, y - 5, 120, c, { rot: [i % 2 ? 4 : -4, x, y], keys: s => { const t = timing(d, c).tI(i) + tu(.08); return { y: [[0, -90 * s], [t, -90 * s], [t + tu(.3), 0, 'in']] }; } }));
  });

  /* 16 ── ROUTE: the route draws from pin to pin, each pin drops onto the map in turn */
  variant('route', 'เส้นทางแผนที่', (d, c) => {
    const k = n(d), P = [[-320, 70], [-30, -150], [270, -30], [380, -200]].slice(0, k);
    art(c, d, p => {
      const fr = sub(p); fr.rect(-460, -280, 920, 590, { rx: 22, sw: 2, stroke: C.rule }); on(fr, p, 0, { o: [[0, 0], [tu(.2), 1]] });
      let D = `M -440 260`; P.forEach(([x, y]) => D += ` L ${x} ${y + 50}`); D += ` L 440 ${P[k - 1][1] - 40}`;
      on(p.path(D, { sw: 4, stroke: C.soft }), p, tu(.1), { draw: [[0, 0], [p.T.tI(k - 1) + tu(.3), 1, 'io']] });
      P.forEach(([x, y], i) => { const S = stepG(p, d, i, x, y + 50, 'drop'), PIN = `M ${x} ${y + 50} C ${x - 10} ${y + 30}, ${x - 46} ${y + 2}, ${x - 46} ${y - 34} A 46 46 0 1 1 ${x + 46} ${y - 34} C ${x + 46} ${y + 2}, ${x + 10} ${y + 30}, ${x} ${y + 50} Z`;
        S.path(PIN, F(3.2)); txt(S, i + 1, x, y - 20, { size: 40, weight: 700, color: C.ink });
        if (isM(d, i)) { const g = sub(S); g.path(PIN, { fill: C.ink, sw: 2 }); txt(g, i + 1, x, y - 20, { size: 40, weight: 700, color: C.fill }); atHit(g, p); badge(p, d, x - 50, y - 80, 28); }
        lbl(S, d, i, x + 120, y + 30, { anchor: 'start', maxW: 170 }); });
    });
    P.forEach(([x, y], i) => icon(d, i, x + 85, y - 40, 80, c, { delay: tu(.25) }));
  });

  /* 17 ── FILM STRIP: the strip slides in, each frame lights up in turn like a projector — the marked frame stays lit */
  variant('film', 'แผ่นฟิล์ม', (d, c) => {
    const k = n(d), W0 = 840 / k, x0 = -420;
    art(c, d, p => {
      const B = sub(p); on(B, p, 0, { x: [[0, 300], [tu(.4), 0, 'out']], o: [[0, 0], [tu(.12), 1]] });
      B.rect(-460, -190, 920, 380, Object.assign({ rx: 14 }, F(3.4)));
      for (let x = -440; x < 450; x += 45) { B.rect(x, -175, 24, 22, Object.assign({ rx: 5 }, W(1.8))); B.rect(x, 153, 24, 22, Object.assign({ rx: 5 }, W(1.8))); }
      for (let i = 0; i < k; i++) { const xa = x0 + i * W0 + 10, S = stepG(p, d, i, xa + (W0 - 20) / 2, 0);
        S.rect(xa, -135, W0 - 20, 270, Object.assign({ rx: 8 }, F(2.6))); if (isM(d, i) && d.mark.how === 'light') atHit(S.rect(xa, -135, W0 - 20, 270, Object.assign({ rx: 8 }, { fill: GLASS, sw: 3.6, stroke: C.ink })), p);
        txt(S, i + 1, xa + 26, -100, { size: 32, weight: 700, color: C.ink }); lbl(S, d, i, xa + (W0 - 20) / 2, 260, { maxW: W0 - 20 });
        if (isM(d, i)) badge(p, d, xa + W0 - 40, -120, 30); }
    });
    for (let i = 0; i < k; i++) icon(d, i, x0 + i * W0 + W0 / 2, 5, Math.min(170, W0 * .55), c);
  });

  /* 18 ── SWITCHES: the panel comes up, then the switches click on in order up to the marked one */
  variant('switches', 'แผงสวิตช์', (d, c) => {
    const k = n(d), xs = spread(k, -280, 280), upto = d.mark ? d.mark.at : k - 1;
    art(c, d, p => {
      const B = sub(p); on(B, p, 0, { y: [[0, 80], [tu(.35), 0, 'out']], o: [[0, 0], [tu(.12), 1]] }); B.rect(-430, -20, 860, 260, Object.assign({ rx: 26 }, F(3.4)));
      xs.forEach((x, i) => { const onS = i <= upto && !(d.mark && d.mark.how === 'x' && i === d.mark.at), S = stepG(p, d, i, x, 110), T = p.T, tt = i === T.mk ? bH(.1) : T.tP(i) - tu(.1);
        S.rect(x - 50, 20, 100, 180, Object.assign({ rx: 50 }, F(3)));
        const kn = sub(S); kn.circle(x, 150, 38, F(3));
        if (onS) { const lit = sub(S); lit.circle(x, 70, 38, { fill: C.ink, sw: 2 }); on(lit, p, tt, { y: [[0, 80], [tu(.15), 0, 'out']], o: [[0, 0], [tu(.02), 1]] }); on(kn, p, tt, { o: [[0, 1], [tu(.02), 0]] }); }
        num(S, d, i, x - 110, 60, 24); lbl(S, d, i, x, 300, { maxW: 240 });
        if (isM(d, i)) { badge(p, d, x + 75, 10, 30); mark(p, d, x, -170, 100); } });
    });
    xs.forEach((x, i) => icon(d, i, x, -170, 130, c));
  });

  /* 19 ── TRAYS (redrawn at the user's request): a stacking letter-tray rack — two side posts on feet, each tray a front panel with a finger
     notch and sheets peeking over it, step 1 at the top. The trays slide in one by one; the marked tray is pulled out on the keyword */
  variant('trays', 'ถาดเอกสาร', (d, c) => {
    const k = n(d), th = Math.min(170, 560 / k), y0 = -265, lift = d.mark && d.mark.how === 'light' ? [46, 0] : null;
    const front = (y) => { const t = y + 30, b = y + th - 12, L = -300, R = 300, nx = 200, nr = 34;
      return `M ${L + 14} ${t} L ${nx - nr} ${t} A ${nr} ${nr * .7} 0 0 0 ${nx + nr} ${t} L ${R - 14} ${t} Q ${R} ${t} ${R} ${t + 14} L ${R - 10} ${b - 12} Q ${R - 12} ${b} ${R - 24} ${b} L ${L + 24} ${b} Q ${L + 12} ${b} ${L + 10} ${b - 12} L ${L} ${t + 14} Q ${L} ${t} ${L + 14} ${t} Z`; };
    art(c, d, p => {
      const R = sub(p); on(R, p, 0, { o: [[0, 0], [tu(.2), 1]] });
      [-322, 322].forEach(x => { R.rect(x - 10, y0 - 10, 20, 306 - (y0 - 10), Object.assign({ rx: 8 }, F(2.8)));                                   // side post down to its foot
        R.rect(x - 34, 296, 68, 14, Object.assign({ rx: 6 }, F(2.6))); });
      for (let i = 0; i < k; i++) { const y = y0 + i * th, S = stepG(p, d, i, 0, y + th / 2, 'slide', lift);
        S.rect(-262, y + 6, 470, 40, Object.assign({ rx: 4 }, { fill: C.fill, sw: 2, stroke: C.soft })); S.line(-246, y + 16, 190, y + 16, { sw: 1.6, stroke: C.soft });   // sheets
        const F0 = front(y); S.path(F0, F(3.2)); if (isM(d, i) && lift) atHit(S.path(F0, { fill: GLASS, sw: 4.4 }), p);
        num(S, d, i, -248, y + th / 2 + 12, 26);
        lbl(S, d, i, -60, y + th / 2 + 26, { anchor: 'start', maxW: 230, size: 42, weight: 700, color: C.ink });
        if (isM(d, i)) badge(p, d, 318 + (lift ? 46 : 0), y + 34, 30); }
    });
    for (let i = 0; i < k; i++) icon(d, i, -150, y0 + i * th + th / 2 + 12, th * .46, c, { lift });
  });

  /* 20 ── BINDERS: the binders are slid onto the shelf one by one — the marked binder is pulled up on the keyword */
  variant('binders', 'แฟ้มสันเลข', (d, c) => {
    const k = n(d), xs = spread(k, -260, 260), bw = Math.min(180, 700 / k), lift = d.mark && d.mark.how === 'light' ? [0, -40] : null;
    art(c, d, p => {
      const sh = sub(p); sh.rect(-460, 220, 920, 26, Object.assign({ rx: 6 }, F(3))); on(sh, p, 0, { o: [[0, 0], [tu(.15), 1]] });
      xs.forEach((x, i) => { const S = stepG(p, d, i, x, 0, 'rise', lift);
        S.rect(x - bw / 2, -260, bw, 480, Object.assign({ rx: 12 }, F(3.2))); if (isM(d, i) && lift) atHit(S.rect(x - bw / 2, -260, bw, 480, Object.assign({ rx: 12 }, { sw: 4.2 })), p);
        S.rect(x - bw / 2 + 24, -180, bw - 48, 70, Object.assign({ rx: 10 }, W(2))); txt(S, i + 1, x, -128, { size: 46, weight: 700, color: C.ink }); S.circle(x, 150, 18, W(2.4));
        if (isM(d, i)) badge(p, d, x + bw / 2, -250 + (lift ? -40 : 0), 30);
        const L = sub(p); lbl(L, d, i, x, 300, { maxW: bw + 40 }); on(L, p, 0, { o: [[0, 0], [p.T.tI(i) + tu(.1), 0], [p.T.tI(i) + tu(.25), 1], [p.H, 1], [aH(.25), op(d, i)]] }); });
    });
    xs.forEach((x, i) => icon(d, i, x, 20, bw * .62, c, { lift }));
  });

  /* samples from unrelated topics (neutrality) + a stress set */
  const I = (icon, label) => label ? { icon, label } : { icon };
  const SAMPLES = [
    { say: 'ล้างมือ ใส่ถุงมือ แล้วค่อยหยิบ', items: [I('droplet', 'ล้างมือ'), I('shield-check', 'ใส่ถุงมือ'), I('package', 'หยิบของ')] },
    { say: 'ตื่น ยืดเส้น แล้วออกไปวิ่ง', items: [I('bed', 'ตื่น'), I('dumbbell', 'ยืดเส้น'), I('person-standing', 'ออกไปวิ่ง')], mark: { at: 2, how: 'light' } },
    { say: 'เช็กลม เช็กเบรก เช็กไฟ', items: [I('gauge', 'เช็กลม'), I('octagon-alert', 'เช็กเบรก'), I('lightbulb', 'เช็กไฟ')], mark: { at: 1, how: 'check' } },
    { say: 'สมัคร ยืนยันอีเมล แล้วเริ่มใช้', items: [I('user-plus', 'สมัคร'), I('mail', 'ยืนยันอีเมล'), I('rocket', 'เริ่มใช้')], mark: { at: 1, how: 'light' } },
    { say: 'ตวงแป้ง ผสม แล้วอบ', items: [I('wheat', 'ตวงแป้ง'), I('cooking-pot', 'ผสม'), I('cake', 'อบ')] },
    { say: 'วางแผน ลงมือ ทบทวน', items: [I('clipboard-list', 'วางแผน'), I('hammer', 'ลงมือ'), I('search', 'ทบทวน')], mark: { at: 2, how: 'light' } },
    { say: 'ซื้อตั๋ว ขึ้นรถไฟ ถึงปลายทาง', items: [I('ticket', 'ซื้อตั๋ว'), I('train-front', 'ขึ้นรถไฟ'), I('map-pin', 'ถึงปลายทาง')], mark: { at: 0, how: 'check' } },
    { say: 'หาข้อมูล เขียน แล้วส่ง', items: [I('book-open', 'หาข้อมูล'), I('pen-line', 'เขียน'), I('send', 'ส่ง')], mark: { at: 1, how: 'x' } },
    { say: 'รดน้ำ ใส่ปุ๋ย รอออกดอก', items: [I('droplet', 'รดน้ำ'), I('sprout', 'ใส่ปุ๋ย'), I('flower', 'รอออกดอก')], mark: { at: 1, how: 'light' } },
    { say: 'ปิดไฟ ล็อกประตู แล้วเข้านอน', items: [I('lightbulb-off', 'ปิดไฟ'), I('lock', 'ล็อกประตู'), I('moon', 'เข้านอน')], mark: { at: 1, how: 'check' } },
    { say: 'ถ่ายรูป แต่งรูป แล้วโพสต์', items: [I('camera', 'ถ่ายรูป'), I('brush', 'แต่งรูป'), I('send', 'โพสต์')] },
    { say: 'จดไอเดีย คัดเลือก ลงมือทำ', items: [I('notebook-pen', 'จดไอเดีย'), I('filter', 'คัดเลือก'), I('rocket', 'ลงมือทำ')], mark: { at: 1, how: 'light' } },
    { say: 'ชาร์จแบต เปิดเครื่อง ต่อไวไฟ', items: [I('battery-charging', 'ชาร์จแบต'), I('power', 'เปิดเครื่อง'), I('wifi', 'ต่อไวไฟ')], mark: { at: 0, how: 'x' } },
    { say: 'วัดที่ ก่อผนัง มุงหลังคา', items: [I('ruler', 'วัดที่'), I('building', 'ก่อผนัง'), I('house', 'มุงหลังคา')], mark: { at: 0, how: 'light' } },
    { say: 'ทักทาย ฟัง แล้วค่อยตอบ', items: [I('smile', 'ทักทาย'), I('headphones', 'ฟัง'), I('message-circle', 'ตอบ')], mark: { at: 1, how: 'light' } },
    { say: 'ออกจากบ้าน แวะร้าน กลับบ้าน', items: [I('house', 'ออกจากบ้าน'), I('store', 'แวะร้าน'), I('house', 'กลับบ้าน')] },
    { say: 'ถ่าย ตัดต่อ แล้วฉาย', items: [I('camera', 'ถ่าย'), I('scissors', 'ตัดต่อ'), I('tv', 'ฉาย')], mark: { at: 1, how: 'light' } },
    { say: 'เปิดเตา ใส่น้ำมัน ตอกไข่', items: [I('cooking-pot', 'เปิดเตา'), I('droplet', 'ใส่น้ำมัน'), I('egg', 'ตอกไข่')], mark: { at: 1, how: 'check' } },
    { say: 'จัดเอกสาร เซ็นชื่อ แล้วยื่น', items: [I('file-text', 'จัดเอกสาร'), I('signature', 'เซ็นชื่อ'), I('inbox', 'ยื่น')], mark: { at: 1, how: 'light' } },
    { say: 'เก็บของ ปิดกล่อง แล้วส่ง', items: [I('package-open', 'เก็บของ'), I('package', 'ปิดกล่อง'), I('truck', 'ส่ง')], mark: { at: 2, how: 'check' } },
  ];
  const STRESS = [
    { say: 'ไม่มีป้ายเลย', items: [I('coffee'), I('book-open'), I('bed')] },
    { say: 'ป้ายยาว 12 ตัว + ✓ ข้อ 3', items: [I('mail', 'เปิดอีเมลก่อนเลย'), I('pen-line', 'ตอบให้ครบทุกฉบับ'), I('send', 'กดส่งอย่างระวัง')], mark: { at: 2, how: 'check' } },
    { say: '✕ ข้อแรก', items: [I('key', 'หากุญแจ'), I('lock', 'ไขล็อก'), I('house', 'เข้าบ้าน')], mark: { at: 0, how: 'x' } },
    { say: 'ภาษาอังกฤษ + ติดไฟข้อ 1', items: [I('search', 'Research'), I('pen-line', 'Write'), I('send', 'Publish')], mark: { at: 0, how: 'light' } },
    { say: 'ไอคอนซ้ำกัน', items: [I('star', 'ดาวที่ 1'), I('star', 'ดาวที่ 2'), I('star', 'ดาวที่ 3')], mark: { at: 2, how: 'light' } },
    { say: '✓ ข้อแรก ไม่มีป้าย', items: [I('bell'), I('smile'), I('heart')], mark: { at: 0, how: 'check' } },
    { say: 'ติดไฟข้อสุดท้าย', items: [I('shirt', 'ซัก'), I('sun', 'ตาก'), I('shirt', 'พับ')], mark: { at: 2, how: 'light' } },
    { say: '✕ ข้อสุดท้าย', items: [I('coffee', 'ชง'), I('glass-water', 'เติมน้ำ'), I('cake', 'กินของหวาน')], mark: { at: 2, how: 'x' } },
    { say: 'ไม่มี mark ป้ายยาว', items: [I('map-pin', 'ปักหมุดที่หมาย'), I('car', 'ขับไปตามทาง'), I('house', 'ถึงบ้านปลอดภัย')] },
    { say: '✓ ข้อกลาง', items: [I('apple', 'ล้าง'), I('scissors', 'หั่น'), I('salad', 'จัดจาน')], mark: { at: 1, how: 'check' } },
    { say: 'ติดไฟข้อกลาง ไม่มีป้าย', items: [I('cloud'), I('droplet'), I('sprout')], mark: { at: 1, how: 'light' } },
    { say: '✕ ข้อกลาง', items: [I('phone', 'โทรหา'), I('message-circle', 'ทักแชต'), I('mail', 'ส่งเมล')], mark: { at: 1, how: 'x' } },
    { say: 'ติดไฟข้อแรก', items: [I('ruler', 'วัด'), I('scissors', 'ตัด'), I('hammer', 'ประกอบ')], mark: { at: 0, how: 'light' } },
    { say: '✓ ข้อสุดท้าย', items: [I('book', 'อ่าน'), I('notebook-pen', 'จด'), I('brain', 'จำได้')], mark: { at: 2, how: 'check' } },
    { say: 'ไม่มี mark', items: [I('sun', 'เช้า'), I('coffee', 'กาแฟ'), I('laptop', 'เริ่มงาน')] },
    { say: '✕ ข้อแรก ป้ายยาว', items: [I('cookie', 'กินขนมก่อนนอน'), I('tv', 'ดูจอจนดึกดื่น'), I('bed', 'นอนไม่หลับทั้งคืน')], mark: { at: 0, how: 'x' } },
    { say: 'ติดไฟข้อ 2 (ภาษาอังกฤษ)', items: [I('camera', 'Shoot'), I('scissors', 'Edit'), I('tv', 'Show')], mark: { at: 1, how: 'light' } },
    { say: '✓ ข้อกลาง ไม่มีป้าย', items: [I('wheat'), I('cooking-pot'), I('cake')], mark: { at: 1, how: 'check' } },
    { say: 'ติดไฟข้อ 3 ป้ายยาว', items: [I('file-text', 'กรอกแบบฟอร์ม'), I('signature', 'เซ็นกำกับทุกหน้า'), I('inbox', 'ยื่นที่เคาน์เตอร์')], mark: { at: 2, how: 'light' } },
    { say: '✕ ข้อกลาง ป้ายยาว', items: [I('package-open', 'ใส่ของให้ครบ'), I('package', 'ปิดกล่องให้แน่น'), I('truck', 'ส่งตามรอบเวลา')], mark: { at: 1, how: 'x' } },
  ];

  G.cats = G.cats || {};
  G.cats.B04 = { variants: V, SAMPLES, STRESS, draw: (i, d, c) => { setZ(c); CUR = V[i].id; V[i].build(d, c); }, CLAMPS, timing: c => (setZ(c), Object.assign({}, Z)) };
})();
