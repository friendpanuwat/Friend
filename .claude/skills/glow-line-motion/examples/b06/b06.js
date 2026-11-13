/* b06.js — category B06 "คำถาม / ความสงสัย": 20 neutral designs. Stills approved (2026-11-13: "ผ่านทั้งหมด ทำเคลื่อนไหวได้เลย"), now with motion.
   Slots (same as CutPack CATEGORIES.md B06 — references/cutpack-CATEGORIES.md): about THING (who / what is in doubt) ·
   options [THING, THING] (only when the line names two choices) · answer THING (only when the line gives the answer). Any of them may be missing.
   The picture: the thing in doubt + a question mark. With options: two ways, clearly apart (the mechanism hesitates between them, ≤ 2 rounds).
   With an answer: the question mark unfolds into the answer IN THE SAME PLACE, THE SAME SIZE (CutPack rule 7); when the answer is one of the
   options, that option is chosen (the other fades). No answer: the question mark stays, glowing on the keyword.
   Every design is a real object with a mechanism (flip card, metronome, torch, envelope, split-flap, loading ring, thought bubble, magnifier,
   old lift dial, flap, cursor, rocking track, book, picker, binoculars, spinning top, card slots, bulb, folded note, projector).
   GL.cats.B06.draw(i, data, { x, y, s, at, hit, speed }) — canvas 1000 × 700 centred at (0,0); hit = seconds after `at` (default 1.8).
   Motion (CutPack CATEGORIES B06 + pro motion): the object comes in (0–.4) → the "?" and the options appear → the mechanism hesitates:
   it visits the options in turn (A B A, or B A B — ending on the side it will NOT take, so the last move is decisive), each visited option
   nudges; with no options it ponders (sweeps / wobbles round the "?") → ON THE KEYWORD: answer → the "?" turns over and the answer turns in
   at the same spot, same size (the chosen option gets ✓, the other fades); no answer → the "?" pops and stays → hold → exit.
   The last frame equals the approved still. */
(function () {
  const G = window.GL, C = G.C, NS = 'http://www.w3.org/2000/svg';
  const W = (w = 2) => ({ sw: w }), F = (w = 3.2) => ({ fill: C.fill, sw: w }), S = (w = 2) => ({ sw: w, stroke: C.soft });
  const rad = d => d * Math.PI / 180, f1 = v => +v.toFixed(1);
  const GLASS = 'rgba(255,255,255,.07)', DIM = .38;

  /* TIMING (same system as b01–b05): the keyword c.hit comes from the speech and never moves. M = how long each move takes = 1 / speed
     (c.speed, else GL.stage / GL.motion speed) but at most hit / HIT0. tu(x) = x·M · bH(x) / aH(x) = before / after the keyword.
     Because M ≤ hit / 1.8, tu(x) ≤ bH(1.8 − x): the hesitation (visits at tu .7 / 1.0 / 1.3) always ends before the last move (bH .3). */
  const HIT0 = 1.8; let Z = null; const CLAMPS = {}; let CUR = '';
  function setZ(c) { const sp = Math.min(20, Math.max(.05, +(c.speed ?? G.motion().speed ?? 1) || 1)), H = c.hit ?? HIT0, M = Math.max(.4, Math.min(1 / sp, H / HIT0));
    Z = { sp: 1 / M, want: sp, M, H }; }
  const tu = x => x * Z.M, bH = x => Z.H - x * Z.M, aH = x => Z.H + x * Z.M;
  function fixT(spec) { for (const n in spec) { const k = spec[n]; if (!Array.isArray(k)) continue;
    for (let i = 1; i < k.length; i++) if (k[i][0] < k[i - 1][0] - 1e-9) { k[i] = [k[i - 1][0], k[i][1], k[i][2]]; CLAMPS[CUR] = (CLAMPS[CUR] || 0) + 1; } } return spec; }
  const kf = (e, t, spec) => G.kf(e, t, fixT(spec));

  /* ---------- plumbing (same family as b05.js) ---------- */
  const TR = ['x', 'y', 'r', 's', 'sx', 'sy'];
  const sub = (p, a) => { const q = p.child(a || {}); q.H = p.H; q.motion = p.motion; return q; };
  const on = (q, p, t, spec) => { const t0 = p.t0 + t * p.ts, fade = q.og && !TR.some(n => spec[n]); kf(fade ? q.og : (q.g || q), t0, spec); };
  /* a moving group: keys { px, py (pivot), x, y, r, s, sx, sy, o } in canvas units, times = seconds after the design's `at` */
  function mvG(p, m) { const o = sub(p), g = sub(o); g.og = o.g; if (m) { const K = { ox: m.px || 0, oy: m.py || 0 }; TR.concat('o').forEach(n => { if (m[n]) K[n] = m[n]; }); on(g, p, 0, K); } return g; }
  const art = (c, fn) => { const f = p => { p.H = hitOf(c); fn(p); }; f.custom = true; f.dur = .35; f.exit = 'pop';
    const a = G.art(f, { x: c.x, y: c.y, s: c.s, at: c.at || 0, speed: 1 }); a.speed = Z.sp; return a; };
  const over = (c, fn) => art(Object.assign({}, c), fn);
  const hitOf = () => Z.H;
  const atT = (g, p, t) => on(g, p, t, { o: [[0, 0], [tu(.12), 1]] });
  const R = (q, x, y, w, h, rx, o) => q.rect(x, y, w, h, Object.assign({ rx }, o));
  const floor = (p, y = 300, a = -470, b = 470) => { const g = sub(p); g.line(a, y, b, y, S(2)); atT(g, p, 0); return g; };
  let CID = 0;
  /* a group clipped to a rectangle (canvas units) — a card sliding out of an envelope */
  function clipG(p, x, y, w, h) { const svg = p.g.ownerSVGElement, cp = document.createElementNS(NS, 'clipPath'), r = document.createElementNS(NS, 'rect');
    cp.id = 'b06clip' + (++CID); Object.entries({ x, y, width: w, height: h }).forEach(([k, v]) => r.setAttribute(k, v)); cp.appendChild(r);
    (svg.querySelector('defs') || svg).appendChild(cp); return sub(p, { 'clip-path': `url(#${cp.id})` }); }
  function txt(p, str, x, y, { size = 42, maxW = 1e9, weight = 600, anchor = 'middle', color = C.soft } = {}) {
    const e = p.text(String(str), x, y, { size, weight, anchor, color, dur: .01 });
    const w = e.getBBox().width; if (w > maxW) e.setAttribute('font-size', f1(size * maxW / w));
    return e;
  }
  /* an object's entrance at t: pop (grows from px,py with a little overshoot) · rise (from below) · drop (from above, lands with a bounce) */
  function inG(p, kind = 'pop', px = 0, py = 0, t = 0) { const K = { px, py, o: [[0, 0], [t, 0], [t + tu(.1), 1]] };
    if (kind === 'rise') K.y = [[0, 50], [t, 50], [t + tu(.3), -5, 'out'], [t + tu(.4), 0, 'soft']];
    else if (kind === 'drop') K.y = [[0, -80], [t, -80], [t + tu(.24), 0, 'in'], [t + tu(.31), -8, 'out'], [t + tu(.4), 0, 'soft']];
    else K.s = [[0, .82], [t, .82], [t + tu(.24), 1.03, 'out'], [t + tu(.38), 1, 'soft']];
    return mvG(p, K); }

  /* ---------- the hesitation ---------- */
  /* the mechanism visits the options at TV (≤ 2 rounds), ending on the side it does NOT take → the move on the keyword is decisive */
  const TV = () => [tu(.7), tu(1.0), tu(1.3)];
  const vis = S => S.chose && S.ai === 0 ? [1, 0, 1] : [0, 1, 0];
  /* keys of one track: v0 at rest, vals[k] while option k is visited, vF from the keyword on. No options → pondering: o.seq, or v0 ± o.pon.
     o.from = entrance value (moves to v0 by tu .42) · o.ov = overshoot of the last move (0 = none) · o.fall = it falls (accelerates, bounces) */
  function hes(S, vals, v0, vF, o = {}) {
    const H = Z.H, t = TV(), K = o.from != null ? [[0, o.from], [o.t0 ?? tu(.08), o.from], [tu(.42), v0, 'out']] : [[0, v0], [tu(.45), v0]];
    const seq = S.has2 ? vis(S).map(k => vals[k]) : (o.seq || (o.pon ? [v0 + o.pon, v0 - o.pon, v0 + o.pon * .5] : [v0, v0, v0]));
    seq.forEach((v, i) => K.push([t[i], v, 'io']));
    const last = seq[2], dv = vF - last, ov = o.ov ?? .08; K.push([bH(.3), last]);
    if (Math.abs(dv) < 1e-6) K.push([H, vF]);
    else if (o.fall) K.push([H, vF, 'in'], [aH(.08), vF - dv * .06, 'out'], [aH(.18), vF, 'soft']);
    else if (ov) K.push([H, vF + dv * ov, 'io'], [aH(.18), vF, 'soft']);
    else K.push([H, vF, 'io']);
    return K;
  }
  /* a quick rattle at every visit (the thing shakes while in doubt) */
  function rattle(a = 3) { const K = [[0, 0]]; TV().forEach(t => K.push([t - tu(.04), 0], [t, -a, 'out'], [t + tu(.05), a * .8], [t + tu(.1), -a * .5], [t + tu(.15), 0, 'soft'])); return K; }
  /* when option k is visited (it nudges) */
  const nudges = (S, k) => S.has2 ? TV().filter((_, i) => vis(S)[i] === k) : [];

  /* ---------- the data ---------- */
  /* is the answer this option? same icon when both have one (and the same label if both have one); otherwise the same label */
  const same = (a, b) => !!(a && b && (a.icon && b.icon ? a.icon === b.icon && (!a.label || !b.label || a.label === b.label) : a.label && a.label === b.label));
  function st(d) { const opts = (d.options || []).filter(Boolean).slice(0, 2), ans = d.answer || null;
    const ai = ans && opts.length === 2 ? opts.findIndex(o => same(o, ans)) : -1;
    return { about: d.about || null, opts, has2: opts.length === 2, ans, ai, chose: ai >= 0 };
  }
  const picOf = it => it && it.icon && (G.icons[it.icon] || G.icons[it.icon + '-pro']);
  const dimOpt = (S, k) => S.ans ? (S.ai === k ? 1 : DIM) : 1;            // with an answer: the chosen option stays, the other fades
  /* a THING's picture at (cx, cy), width wd; no picture → its label in big type. o.t = when it comes in · o.to = opacity after the keyword ·
     o.punch = pulse on the keyword · o.nudge = [times] small pulses (visited) · o.flipIn = hidden until the keyword, then turns in (the answer) ·
     o.show = [t0, t1] fades in at t0 (the answer on a card that slides out) · o.mv = keys of the part it sits on (canvas units) · o.r static turn */
  function pic(it, cx, cy, wd, c, o = {}) {
    if (!it) return null; const at = c.at || 0, H = hitOf(), X = c.x + cx * c.s, Y = c.y + cy * c.s, fn = picOf(it), t = o.t ?? tu(.12);
    let a;
    if (fn) a = G.art(fn, { x: X, y: Y, w: wd * c.s, at: at + t, speed: Z.sp });
    else { const str = it.label || it.icon; if (!str) return null;
      const f = q => txt(q, str, 0, wd * .13, { size: wd * .36, maxW: wd * 1.15, weight: 700, color: C.ink }); f.custom = true; f.dur = .3; f.exit = 'pop';
      a = G.art(f, { x: X, y: Y, s: c.s, at: at + t, speed: 1 }); a.speed = Z.sp; }
    const K = {};
    if ((o.to ?? 1) < 1) K.o = [[0, 1], [H, 1], [aH(.25), o.to]];
    if (o.flipIn) { K.ox = X; K.oy = Y; K.sx = [[0, 0], [H, 0], [aH(.2), 1, 'back']]; K.o = [[0, 0], [H, 0], [H + tu(.02), 1]]; }
    if (o.show) K.o = [[0, 0], [o.show[0], 0], [o.show[1], 1]];
    if (o.r) { K.r = [[0, o.r[0]]]; K.ox = c.x + o.r[1] * c.s; K.oy = c.y + o.r[2] * c.s; }
    if (o.mv) { const m = o.mv; K.ox = c.x + (m.px || 0) * c.s; K.oy = c.y + (m.py || 0) * c.s;
      ['x', 'y'].forEach(n => { if (m[n]) K[n] = m[n].map(([u, v, e]) => [u, v * c.s, e]); }); ['r', 's', 'sx', 'sy'].forEach(n => { if (m[n]) K[n] = m[n]; });
      if (m.o && !K.o) K.o = m.o; }
    if (Object.keys(K).length) kf(a.wrap, at, K);
    const sK = [[0, 1]]; (o.nudge || []).forEach(tn => sK.push([tn - tu(.05), 1], [tn + tu(.06), 1.1, 'out'], [tn + tu(.22), 1, 'soft']));
    if (o.punch) sK.push([H, 1], [aH(.07), 1.1, 'out'], [aH(.32), 1, 'soft']);
    if (sK.length > 1) kf(a.g, at, { ox: X, oy: Y, s: sK });
    return a;
  }
  /* a THING's label (only when it has a picture — else the label already is the picture) */
  const lab = (q, it, x, y, o = {}) => it && it.label && picOf(it) ? txt(q, it.label, x, y, Object.assign({ maxW: 260 }, o)) : null;
  const labT = (p, it, x, y, t, o) => { const g = sub(p); atT(g, p, t); return lab(g, it, x, y, o); };   // … fading in at t
  const glyph = (q, x, y, sz) => txt(q, '?', x, y + sz * .36, { size: sz, weight: 700, color: C.ink });
  /* the question mark at (x, y), size sz — it comes in (o.t), leans toward the option being weighed (o.lean false = still, 'y' = moves up/down
     instead) and, ON THE KEYWORD: no answer → pops and stays · answer → turns over and the answer turns in AT THE SAME SPOT, SAME SIZE.
     o.into = the pen it is drawn with (it rides that part) · o.noQ = the design shows its own "?" (only the answer is placed) · o.ly = answer label */
  function qSpot(p, c, S, x, y, sz, o = {}) {
    const H = hitOf(), q = o.into || p, g = sub(q); if (sz < 1) return g;      // sz < 1: the design shows the chosen option there instead
    if (S.ans) { pic(S.ans, x, y, sz * 1.05, c, { punch: true, flipIn: true });
      if (S.ans.label && picOf(S.ans) && o.ly != null) { const lg = sub(p); on(lg, p, 0, { o: [[0, 0], [H, 0], [aH(.15), 1]] }); lab(lg, S.ans, x, o.ly, { color: C.ink, weight: 700, maxW: o.maxW || 300 }); } }
    if (o.noQ) return g;
    const t = o.t ?? tu(.36), oK = [[0, 0], [t, 0], [t + tu(.1), 1]], K = { ox: x, oy: y, o: oK, s: [[0, .5], [t, .5], [t + tu(.24), 1, 'back']] };
    if (S.ans) { K.sx = [[0, 1], [bH(.12), 1], [H, 0, 'in']]; oK.push([H, 1], [H + tu(.01), 0]); }
    else K.s.push([H, 1], [aH(.08), 1.14, 'out'], [aH(.34), 1, 'soft']);
    on(g, p, 0, K);
    const g2 = sub(g);
    if (o.lean === 'y') on(g2, p, 0, { y: hes(S, [-26, 26], 0, 0, { pon: 14, ov: 0 }) });
    else if (o.lean !== false) on(g2, p, 0, { ox: x, oy: y + sz * .3, r: hes(S, [-9, 9], 0, 0, { pon: 7 }) });
    glyph(g2, x, y, sz);
    return g;
  }
  /* the thing in doubt: picture + label (o.t = when it comes in) */
  function aboutAt(p, c, S, x, y, w, ly, o = {}) { if (!S.about) return; const t = o.t ?? tu(.12); pic(S.about, x, y, w, c, { t }); if (ly != null) labT(p, S.about, x, ly, t + tu(.06), { maxW: o.maxW || 240 }); }
  /* option k: picture + label (+ frame); comes in one after the other, nudges when visited, fades when the other one is the answer */
  function optAt(p, c, S, k, x, y, w, ly, o = {}) { if (!S.has2) return; const H = hitOf(), it = S.opts[k], v = dimOpt(S, k), g = sub(p), t = o.t ?? tu(.2 + .1 * k);
    on(g, p, 0, { ox: x, oy: y, s: [[0, .8], [t, .8], [t + tu(.22), 1, 'back']], o: [[0, 0], [t, 0], [t + tu(.1), 1]].concat(v < 1 ? [[H, 1], [aH(.25), .5]] : []) });
    if (o.frame) R(g, x - o.frame / 2, y - o.frame / 2, o.frame, o.frame, 18, F(2.8));
    pic(it, x, y, w, c, { t: t + tu(.04), to: v, punch: S.ai === k, nudge: nudges(S, k) }); const LY = o.frame ? y + o.frame / 2 + 42 : ly; if (LY != null) lab(g, it, x, LY, { maxW: o.maxW || 220 });
    return g; }
  /* a chosen-option tick, stamped on the keyword */
  function tick(p, x, y, r = 30) { const g = sub(p), k = r * .42; g.circle(x, y, r, F(3)); g.poly([[x - k, y + 2], [x - k * .2, y + k * .8], [x + k * 1.05, y - k * .75]], W(5));
    on(g, p, aH(.05), { ox: x, oy: y, s: [[0, 1.8], [tu(.14), .9, 'in'], [tu(.26), 1.04], [tu(.38), 1, 'soft']], o: [[0, 0], [tu(.06), 1]] }); }
  /* row layout: [about] [main object] [the two options, stacked] — centres for what is there */
  function cols(S, mw, aw = 230, ow = 230, gap = 30) { const ws = [S.about ? aw : 0, mw, S.has2 ? ow : 0], n = ws.filter(Boolean).length;
    let x = -(ws.reduce((a, b) => a + b, 0) + (n - 1) * gap) / 2; const xs = ws.map(w => { if (!w) return null; const cx = x + w / 2; x += w + gap; return cx; });
    return { ax: xs[0], mx: xs[1], ox: xs[2] }; }
  /* the two options stacked in the right column (row layout) */
  function optCol(p, c, S, ox, w = 120, o = {}) { if (!S.has2) return; [-125, 135].forEach((y, k) => { optAt(p, c, S, k, ox, y - 20, w, y + 78, o); if (S.ai === k) tick(p, ox + 80, y - 80); }); }
  /* a "?" drawn by the design itself (seal, flap, folded note): pops on the keyword when there is no answer */
  function popQ(q, p, x, y, sz) { const g = mvG(q, { px: x, py: y, s: [[0, 1], [hitOf(), 1], [aH(.08), 1.14, 'out'], [aH(.34), 1, 'soft']] }); glyph(g, x, y, sz); return g; }

  const V = [];
  const variant = (id, th, build) => V.push({ id, th, build });

  /* 01 ── FLIP CARD: a desk flip stand shows "?" — the "?" leans toward each option in turn; on the keyword the card turns over (around its
     binder rings) to the answer */
  variant('flipcard', 'การ์ดพลิกตั้งโต๊ะ', (d, c) => {
    const S0 = st(d), L = cols(S0, 340), x = L.mx, H = hitOf();
    const turn = () => S0.ans ? { px: x, sx: [[0, 1], [bH(.12), 1], [H, 0, 'in'], [aH(.2), 1, 'back']] } : null;
    art(c, p => {
      const B = inG(sub(p), 'rise', x, 190);
      B.path(`M ${x - 150} 170 L ${x - 120} -230 M ${x + 150} 170 L ${x + 120} -230`, S(2.4));                         // the stand's back legs
      R(B, x - 175, 170, 350, 22, 8, F(3));
      R(mvG(B, turn()), x - 150, -220, 300, 380, 16, F(3.2)); [-60, 60].forEach(dx => { B.circle(x + dx, -222, 15, W(2.6)); B.line(x + dx, -237, x + dx, -207, S(1.4)); });
      mvG(B, turn()).line(x - 130, -205, x + 130, -205, S(1.4));
      qSpot(p, c, S0, x, -40, 200, { ly: 115 });
      aboutAt(p, c, S0, L.ax, -30, 150, 90);
      optCol(p, c, S0, L.ox, 110, { frame: 150 });
    });
  });

  /* 02 ── METRONOME: the arm ticks from one option to the other (indecision) — on the keyword it stops on the chosen one, or upright on "?" */
  variant('metronome', 'เครื่องเคาะจังหวะ', (d, c) => {
    const S0 = st(d), ang = S0.chose ? (S0.ai === 0 ? -30 : 30) : 0, px = 0, py = 250;
    art(c, p => {
      floor(p, 300);
      const B = inG(sub(p), 'rise', px, 300);
      B.path(`M ${px - 150} 300 L ${px - 70} -80 Q ${px} -110 ${px + 70} -80 L ${px + 150} 300 Z`, F(3.4));                  // body
      B.path(`M ${px - 100} 290 L ${px - 48} -40 L ${px + 48} -40 L ${px + 100} 290 Z`, S(1.6));                             // the open front
      R(B, px - 170, 290, 340, 20, 6, F(3));
      const A = mvG(B, { px, py, r: hes(S0, [-30, 30], 0, ang, { pon: 20 }) });                                                 // arm + sliding weight
      A.line(px, py, px, -150, W(5)); R(A, px - 26, -40, 52, 46, 8, F(3)); A.circle(px, -150, 8, F(2.4));
      B.circle(px, py, 12, F(2.8));
      if (S0.has2) [-1, 1].forEach(s => { const t = sub(B); t.line(px + s * 74, -70, px + s * 92, -90, S(1.6)); });            // end marks
      aboutAt(p, c, S0, px, 175, 90, null, { t: tu(.4) });
      if (S0.about) labT(p, S0.about, px, 345, tu(.46), { maxW: 280, size: 36 });
      qSpot(p, c, S0, 0, -255, 130, { ly: null });
      if (S0.has2) [-1, 1].forEach((s, k) => { optAt(p, c, S0, k, s * 340, -60, 130, 60, { frame: 170 }); if (S0.ai === k) tick(p, s * 340 + 85, -145); });
    });
  });

  /* 03 ── TORCH: the torch clicks on and its beam swings from one option to the other — on the keyword it rests on the chosen one,
     or lights up the "?" (no options: it sweeps, searching) */
  variant('torch', 'ไฟฉายส่องสลับ', (d, c) => {
    const S0 = st(d), tx = 0, ty = 170, aim = ([X, Y]) => Math.atan2(Y - ty, X - tx) * 180 / Math.PI + 90;
    const tgt = S0.chose ? [S0.ai === 0 ? -330 : 330, -110] : [0, -240], ang = aim(tgt);
    art(c, p => {
      floor(p, 300);
      const a = rad(ang - 90), ux = Math.cos(a), uy = Math.sin(a), hx = tx + ux * 80, hy = ty + uy * 80, L = Math.hypot(tgt[0] - hx, tgt[1] - hy) + 40;
      const rK = hes(S0, [aim([-330, -110]), aim([330, -110])], 0, ang, { pon: 22 }), up = [[0, 50], [tu(.32), 0, 'out']];
      /* the beam, drawn pointing up and turned with the torch */
      const bm = mvG(sub(p), { px: tx, py: ty, r: rK, y: up, o: [[0, 0], [tu(.3), 0], [tu(.33), 1], [tu(.36), .35], [tu(.42), 1]] });
      bm.shape([[tx + 50, ty - 80], [tx + 120, ty - 80 - L], [tx - 120, ty - 80 - L], [tx - 50, ty - 80]].map(([x, y]) => [f1(x), f1(y)]), { fill: GLASS, sw: 0, stroke: 'none' });
      const T = mvG(sub(p), { px: tx, py: ty, r: rK, y: up, o: [[0, 0], [tu(.1), 1]] });
      R(T, tx - 34, ty - 20, 68, 170, 16, F(3.2)); T.path(`M ${tx - 34} ${ty - 10} L ${tx - 56} ${ty - 80} L ${tx + 56} ${ty - 80} L ${tx + 34} ${ty - 10} Z`, F(3.2));   // body + head
      T.line(tx - 52, ty - 74, tx + 52, ty - 74, W(2)); R(T, tx - 12, ty + 30, 24, 36, 6, F(2.4)); [ty + 100, ty + 120].forEach(y => T.line(tx - 26, y, tx + 26, y, S(1.4)));
      const B = sub(p); atT(B, p, 0); R(B, tx - 70, 286, 140, 14, 6, F(2.6));
      qSpot(p, c, S0, 0, -240, 140, { ly: -130 });
      if (S0.has2) [-1, 1].forEach((s, k) => { optAt(p, c, S0, k, s * 330, -110, 140, 5); if (S0.ai === k) tick(p, s * 330 + 90, -195); });
      aboutAt(p, c, S0, -330, 200, 120, 290);
    });
  });

  /* 04 ── ENVELOPE: a sealed envelope drops in with a "?" seal and rattles while in doubt — on the keyword the flap opens and the answer card
     slides out of it (no answer: the seal pops) */
  variant('envelope', 'ซองปิดผนึก', (d, c) => {
    const S0 = st(d), L = cols(S0, 400), x = L.mx, open = !!S0.ans, H = hitOf(), up = { y: [[0, 260], [aH(.06), 260], [aH(.42), 0, 'out']] };
    art(c, p => {
      const E = mvG(inG(sub(p), 'drop', x, 210), { px: x, py: 210, r: rattle(2.5) });
      if (open) {
        mvG(E, { px: x, py: -40, sy: [[0, 0], [H, 0], [aH(.14), 1, 'out']], o: [[0, 0], [H, 0], [H + tu(.01), 1]] }).path(`M ${x - 190} -40 L ${x} -200 L ${x + 190} -40`, F(3));   // flap open
        const cd = mvG(clipG(E, x - 260, -470, 520, 680), Object.assign({ o: [[0, 1], [aH(.42), 1], [aH(.43), 0]] }, up));        // the card sliding out (clipped at the bottom)
        R(cd, x - 150, -250, 300, 300, 14, F(3)); lab(cd, S0.ans, x, 25, { color: C.ink, weight: 700, maxW: 300 });
        const fin = sub(E); on(fin, p, 0, { o: [[0, 0], [aH(.42), 0], [aH(.43), 1]] }); R(fin, x - 150, -250, 300, 300, 14, F(3)); lab(fin, S0.ans, x, 25, { color: C.ink, weight: 700, maxW: 300 });
        pic(S0.ans, x, -130, 157.5, c, { mv: up, show: [aH(.24), aH(.34)] });
      }
      R(E, x - 190, -40, 380, 250, 14, F(3.4)); E.path(`M ${x - 190} 200 L ${x - 40} 80 M ${x + 190} 200 L ${x + 40} 80`, S(1.6));
      const fl = open ? mvG(E, { px: x, py: -40, sy: [[0, 1], [bH(.12), 1], [H, 0, 'in']], o: [[0, 1], [H, 1], [H + tu(.01), 0]] }) : E;   // closed flap + seal
      fl.path(`M ${x - 188} -36 L ${x} 90 L ${x + 188} -36`, F(3)); const sl = sub(fl); sl.circle(x, 90, 70, F(3.2));
      if (open) glyph(sl, x, 90, 90); else popQ(sl, p, x, 90, 90);
      aboutAt(p, c, S0, L.ax, -30, 150, 90);
      optCol(p, c, S0, L.ox, 110, { frame: 150 });
    });
  });

  /* 05 ── SPLIT-FLAP: the flaps clatter over (two at every option weighed) — on the keyword the last flap falls and the board shows the
     answer, or "?" */
  variant('splitflap', 'แผ่นพลิกตัวอักษร', (d, c) => {
    const S0 = st(d), L = cols(S0, 360), x = L.mx, H = hitOf();
    art(c, p => {
      const B = inG(sub(p), 'pop', x, -10); R(B, x - 180, -230, 360, 440, 24, F(3.4)); R(B, x - 150, -200, 300, 380, 14, F(2.8));
      B.line(x - 150, -10, x + 150, -10, { sw: 9, stroke: '#040404' }); B.line(x - 150, -10, x + 150, -10, S(1.4)); [-1, 1].forEach(s => R(B, x + s * 160 - 8, -26, 16, 32, 5, F(2.4)));
      qSpot(p, c, S0, x, -20, 230, { ly: 150, lean: false });
      /* the falling flaps: the top leaf folds down onto the hinge, the bottom leaf unfolds from it, then both are gone */
      const dd = tu(.07), ts = []; TV().forEach(t => ts.push(t - 2 * dd, t)); ts.push(bH(.28), bH(.14));
      const U = { ox: x, oy: -10, o: [[0, 0]], sy: [[0, 1]] }, D = { ox: x, oy: -10, o: [[0, 0]], sy: [[0, 0]] };
      ts.forEach(t => { U.o.push([t, 0], [t + .001, 1], [t + dd, 1], [t + dd + .001, 0]); U.sy.push([t, 1], [t + dd, 0, 'in']);
        D.o.push([t + dd, 0], [t + dd + .001, 1], [t + 2 * dd - .002, 1], [t + 2 * dd - .001, 0]); D.sy.push([t + dd, 0], [t + 2 * dd, 1, 'out']); });
      const up = sub(p); on(up, p, 0, U); R(up, x - 150, -200, 300, 190, 12, F(2.8));
      const dn = sub(p); on(dn, p, 0, D); R(dn, x - 150, -10, 300, 190, 12, F(2.8));
      aboutAt(p, c, S0, L.ax, -30, 150, 90);
      optCol(p, c, S0, L.ox, 110, { frame: 150 });
    });
  });

  /* 06 ── LOADING RING: the dots run round the "?" while it waits — on the keyword they stop; with an answer every dot lights, the ring
     closes and the "?" becomes the answer */
  variant('loading', 'ห่วงรอคำตอบ', (d, c) => {
    const S0 = st(d), L = cols(S0, 380), x = L.mx, n = 12, done = !!S0.ans, H = hitOf();
    art(c, p => {
      const B = inG(sub(p), 'pop', x, -20);
      const turns = 360 * Math.max(1, Math.round((H - tu(.3)) / tu(.75)));
      const RG = mvG(B, { px: x, py: -20, r: [[0, 0], [tu(.3), 0], [tu(.5), 40, 'in'], [bH(.2), turns - 50, 'lin'], [H, turns, 'out']] });   // the tail runs round
      for (let i = 0; i < n; i++) { const a = rad(-90 + i * 360 / n), v = .25 + .75 * i / (n - 1); RG.circle(f1(x + Math.cos(a) * 170), f1(-20 + Math.sin(a) * 170), 13, { fill: v > .9 ? C.ink : C.fill, sw: 2.6, stroke: v > .55 ? C.ink : C.soft }); }
      if (done) { const all = sub(B); on(all, p, 0, { o: [[0, 0], [H, 0], [aH(.1), 1]] });
        for (let i = 0; i < n; i++) { const a = rad(-90 + i * 360 / n); all.circle(f1(x + Math.cos(a) * 170), f1(-20 + Math.sin(a) * 170), 13, { fill: C.ink, sw: 2.6, stroke: C.ink }); }
        const rg = sub(B); on(rg.circle(x, -20, 200, S(2)), p, H, { draw: [[0, 0], [tu(.35), 1, 'out']] }); }
      qSpot(p, c, S0, x, -20, 160, { ly: 245 });
      aboutAt(p, c, S0, L.ax, -30, 150, 90);
      optCol(p, c, S0, L.ox, 110, { frame: 150 });
    });
  });

  /* 07 ── THOUGHT BUBBLE: the thing in doubt wonders — little bubbles rise into a cloud that breathes while it thinks; on the keyword the
     cloud shows the answer */
  variant('think', 'ฟองความคิด', (d, c) => {
    const S0 = st(d), cx = S0.has2 ? -60 : 30, cy = -110;
    const cloud = (q, x, y, w, h) => { const k = [[-.42, .1, .3], [-.2, -.28, .34], [.15, -.3, .36], [.4, -.05, .3], [.25, .3, .3], [-.15, .32, .3]];
      q.ellipse(x, y, w * .5, h * .5, F(3.4)); k.forEach(([a, b, r]) => q.circle(f1(x + a * w), f1(y + b * h), f1(r * Math.min(w, h)), F(3.4))); q.ellipse(x, y, w * .48, h * .46, { fill: C.fill, sw: 0, stroke: 'none' }); };
    art(c, p => {
      const B = sub(p), cl = sub(inG(B, 'pop', cx, cy, tu(.26)));
      on(cl, p, tu(.7), { loop: tu(2.4), ox: cx, oy: cy, s: [[0, 1], [tu(1.2), 1.02, 'soft'], [tu(2.4), 1, 'soft']] });             // breathing while it thinks
      cloud(cl, cx, cy, 430, 300);
      [[cx - 150, 120, 26], [cx - 190, 180, 16], [cx - 215, 225, 10]].forEach(([x, y, r], i) => inG(B, 'pop', x, y, tu(.2 - i * .05)).circle(x, y, r, F(2.8)));
      qSpot(p, c, S0, cx, cy - 10, 170, { ly: cy + 115, t: tu(.42) });
      const ab = S0.about || { icon: 'user' }; pic(ab, cx - 250, 255, 130, c, { t: tu(.02) }); if (S0.about) labT(p, S0.about, cx - 100, 270, tu(.1), { anchor: 'start', maxW: 260 });
      if (S0.has2) [-140, 60].forEach((y, k) => { optAt(p, c, S0, k, 360, y, 110, y + 75, { frame: 150 }); if (S0.ai === k) tick(p, 440, y - 75); });
    });
  });

  /* 08 ── MAGNIFIER: the magnifier glides in and hovers from one option to the other — on the keyword it settles on the chosen one;
     alone, it searches round the "?" and holds over it */
  const magnifier = (q, cx, cy, Rr, ang) => { const k = Rr / 170, g = sub(q, { transform: `rotate(${ang} ${cx} ${cy})` }), Ro = Rr + 26 * k;
    g.rect(cx + Ro - 6 * k, cy - 22 * k, 52 * k, 44 * k, Object.assign({ rx: 8 * k }, F(3))); g.line(cx + Ro + 20 * k, cy - 22 * k, cx + Ro + 20 * k, cy + 22 * k, W(1.8));
    g.rect(cx + Ro + 44 * k, cy - 30 * k, 170 * k, 60 * k, Object.assign({ rx: 30 * k }, F(3.4)));
    for (let i = 0; i < 4; i++) { const x = cx + Ro + (84 + i * 26) * k; g.line(x, cy - 15 * k, x, cy + 15 * k, W(2)); }
    const rim = g.path(`M ${cx + Ro} ${cy} A ${Ro} ${Ro} 0 1 0 ${cx - Ro} ${cy} A ${Ro} ${Ro} 0 1 0 ${cx + Ro} ${cy} Z M ${cx + Rr} ${cy} A ${Rr} ${Rr} 0 1 1 ${cx - Rr} ${cy} A ${Rr} ${Rr} 0 1 1 ${cx + Rr} ${cy} Z`, { fill: C.fill, sw: 3.4 });
    rim.setAttribute('fill-rule', 'evenodd'); g.circle(cx, cy, Rr + 13 * k, { sw: 1.6, stroke: C.soft }); };
  variant('magnifier', 'แว่นขยายส่องหา', (d, c) => {
    const S0 = st(d), at = S0.chose ? [S0.ai === 0 ? -320 : 320, -40] : [0, -40], [fx, fy] = at;
    art(c, p => {
      qSpot(p, c, S0, 0, -40, S0.chose ? 120 : 160, { ly: S0.chose ? null : 95 });
      if (S0.has2) [-1, 1].forEach((s, k) => optAt(p, c, S0, k, s * 320, -40, 150, 95));
      aboutAt(p, c, S0, 0, 225, 110, 335, { maxW: 300 });
    });
    over(c, p => {
      const g = mvG(sub(p), { x: hes(S0, [-320 - fx, 320 - fx], -fx, 0, { from: 430 - fx, seq: [75 - fx, -70 - fx, 30 - fx] }),
        y: hes(S0, [-fy - 40, -fy - 40], -40 - fy, 0, { from: 200, seq: [-75 - fy, -20 - fy, -55 - fy] }), o: [[0, 0], [tu(.08), 0], [tu(.2), 1]] });
      magnifier(g, fx, fy, 120, 50); if (S0.chose) tick(p, fx + 105, fy - 125); });
  });

  /* 09 ── OLD LIFT DIAL (user's pick 2026-11-13, replaces the maze): the needle over the lift doors swings between the two options —
     on the keyword the doors slide open on the answer (the "?" on the doors becomes the answer in the same place, the same size) */
  variant('liftdial', 'หน้าปัดลิฟต์เก่า', (d, c) => {
    const S0 = st(d), open = !!S0.ans, ang = S0.chose ? (S0.ai === 0 ? -58 : 58) : 0, dc = [0, -170], H = hitOf();
    art(c, p => {
      const B = inG(sub(p), 'rise', 0, 300);
      R(B, -200, -70, 400, 370, 10, F(3.4)); B.line(-200, 300, 200, 300, W(3));                                                   // door frame
      B.path(`M ${dc[0] - 150} ${dc[1] + 40} A 150 150 0 0 1 ${dc[0] + 150} ${dc[1] + 40} Z`, F(3.2));                                // dial
      [-58, 0, 58].forEach(a => { const u = rad(a - 90); B.line(f1(dc[0] + Math.cos(u) * 120), f1(dc[1] + 40 + Math.sin(u) * 120), f1(dc[0] + Math.cos(u) * 138), f1(dc[1] + 40 + Math.sin(u) * 138), W(a ? 3 : 2)); });
      const N = mvG(B, { px: dc[0], py: dc[1] + 40, r: hes(S0, [-58, 58], 0, ang, { pon: 26 }) }); N.line(dc[0], dc[1] + 40, dc[0], dc[1] - 75, W(5)); B.circle(dc[0], dc[1] + 40, 12, F(2.6));
      if (open) {                                                                                                                    // doors slide open into the frame …
        const cl = clipG(B, -180, -60, 360, 360), done = [[0, 1], [aH(.36), 1], [aH(.37), 0]];
        [-1, 1].forEach(s => R(mvG(cl, { x: [[0, 0], [H, 0], [aH(.36), s * 128, 'io']], o: done }), s < 0 ? -180 : 2, -50, 178, 340, 4, F(2.8)));
        const pn = sub(B); on(pn, p, 0, { o: [[0, 0], [aH(.36), 0], [aH(.37), 1]] }); R(pn, -180, -50, 50, 340, 4, F(2.8)); R(pn, 130, -50, 50, 340, 4, F(2.8));   // … and stand there
        const lt = sub(B); R(lt, -130, -50, 260, 340, 4, { fill: GLASS, sw: 0, stroke: 'none' }); atT(lt, p, hitOf()); }
      else { R(B, -180, -50, 178, 340, 4, F(2.8)); R(B, 2, -50, 178, 340, 4, F(2.8)); }
      qSpot(p, c, S0, 0, 90, 140, { ly: 230 });
      if (S0.has2) [-1, 1].forEach((s, k) => { optAt(p, c, S0, k, s * 330, -230, 110, -140, { maxW: 200 }); if (S0.ai === k) tick(p, s * 330 + 75, -295, 26); });
      aboutAt(p, c, S0, S0.has2 ? -370 : -340, 170, 100, 275, { maxW: 200 });
    });
  });

  /* 10 ── FLAP: a hinged flap with "?" covers the spot — it lifts a little at every option weighed (peeking); on the keyword it swings up
     and the answer is underneath (no answer: the "?" on the flap pops) */
  variant('flap', 'แผ่นพับเปิด', (d, c) => {
    const S0 = st(d), L = cols(S0, 380), x = L.mx, open = !!S0.ans, H = hitOf();
    const peek = [[0, 1]]; TV().forEach(t => peek.push([t - tu(.08), 1], [t, .9, 'out'], [t + tu(.14), 1, 'soft']));
    art(c, p => {
      const B = inG(sub(p), 'pop', x, 0); R(B, x - 190, -200, 380, 400, 18, F(3.4)); R(B, x - 160, -170, 320, 340, 10, S(1.6));
      if (open) { const ob = mvG(B, { px: x, py: -170, sy: [[0, 0], [H, 0], [aH(.16), 1, 'out']], o: [[0, 0], [H, 0], [H + tu(.01), 1]] });   // the flap lifted (seen from below)
        ob.path(`M ${x - 160} -170 L ${x - 175} -300 L ${x + 175} -300 L ${x + 160} -170 Z`, F(3)); ob.line(x - 168, -240, x + 168, -240, S(1.4)); }
      const fl = mvG(B, { px: x, py: -170, sy: open ? peek.concat([[bH(.14), 1], [H, 0, 'in']]) : peek, o: open ? [[0, 1], [H, 1], [H + tu(.01), 0]] : null });
      R(fl, x - 160, -170, 320, 340, 10, F(3.2)); [-120, 120].forEach(dx => fl.circle(x + dx, -150, 9, W(2)));
      if (open) glyph(fl, x, 0, 230); else popQ(fl, p, x, 0, 230);
      if (open) qSpot(p, c, S0, x, -20, 180, { ly: 125, noQ: true });
      aboutAt(p, c, S0, L.ax, -30, 150, 90);
      optCol(p, c, S0, L.ox, 110, { frame: 150 });
    });
  });

  /* 11 ── CURSOR: a dialog asks "?" — the pointer comes in and drifts from one button to the other; on the keyword it clicks the chosen one
     (no options: it hovers round the "?") */
  variant('cursor', 'เคอร์เซอร์ลังเล', (d, c) => {
    const S0 = st(d), cur = S0.chose ? [S0.ai === 0 ? -170 : 170, 170] : [40, 60], [fx, fy] = cur, H = hitOf();
    art(c, p => {
      const B = inG(sub(p), 'pop', 0, 0); R(B, -440, -300, 880, 590, 24, F(3.4)); B.line(-440, -235, 440, -235, W(2.4)); [-400, -370, -340].forEach(x => B.circle(x, -268, 9, W(2)));
      if (S0.has2) [-1, 1].forEach((s, k) => { const g = mvG(B, S0.ai === k ? { px: s * 170, py: 175, s: [[0, 1], [H, 1], [aH(.06), .95, 'in'], [aH(.2), 1, 'out']] } : null);   // the clicked button gives
        R(g, s * 170 - 130, 120, 260, 110, 22, F(3)); if (S0.ai === k) { const lt = sub(g); R(lt, s * 170 - 130, 120, 260, 110, 22, { fill: GLASS, sw: 4.2 }); atT(lt, p, hitOf()); } });
      qSpot(p, c, S0, S0.about ? 140 : 0, -95, 150, { ly: 10 });
      if (S0.about) { pic(S0.about, -190, -100, 130, c); labT(p, S0.about, -190, 5, tu(.18), { maxW: 240 }); }
      if (S0.has2) [-1, 1].forEach((s, k) => { const it = S0.opts[k], t = tu(.24 + .1 * k), v = dimOpt(S0, k); pic(it, s * 170 - 70, 175, 70, c, { t, to: v, nudge: nudges(S0, k) });
        const g = sub(p); on(g, p, 0, { o: [[0, 0], [t, 0], [t + tu(.1), 1]].concat(v < 1 ? [[H, 1], [aH(.25), .5]] : []) });
        if (it.label && picOf(it)) txt(g, it.label, s * 170 - 20, 190, { anchor: 'start', maxW: 140, size: 36 }); });
    });
    over(c, p => {
      const g = mvG(sub(p), { x: hes(S0, [-170 - fx, 170 - fx], 40 - fx, 0, { from: 380 - fx, seq: [130 - fx, -60 - fx, 60 - fx] }),
        y: hes(S0, [170 - fy, 170 - fy], 60 - fy, 0, { from: 330 - fy, seq: [40 - fy, 90 - fy, 30 - fy] }), o: [[0, 0], [tu(.1), 0], [tu(.2), 1]] });
      G.parts.cursor(S0.chose ? mvG(g, { px: fx, py: fy, s: [[0, 1], [bH(.03), 1], [H, .86, 'in'], [aH(.12), 1, 'out']] }) : g, fx, fy, 1.6, 0, .01);
      if (S0.chose) { const k = sub(p); on(k, p, 0, { o: [[0, 0], [aH(.03), 0], [aH(.06), 1]] });                                    // click marks
        const q = k.child({ transform: `translate(${fx} ${fy}) scale(1.6)` }, 1.6); [[-9, -9, -19, -19], [-12, 3, -25, 5], [3, -12, 5, -25]].forEach(([a, b, e, f]) => q.line(a, b, e, f, { sw: 2.6 })); }
    });
  });

  /* 12 ── ROCKING TRACK: the "?" ball rolls back and forth as the rail rocks — on the keyword it drops into the chosen cup (and shows it),
     or rests balanced in the middle */
  variant('track', 'รางลูกบอลโยก', (d, c) => {
    const S0 = st(d), tilt = S0.chose ? (S0.ai === 0 ? -9 : 9) : 0, bx = S0.chose ? (S0.ai === 0 ? -330 : 330) : 0, by = S0.chose ? 20 : -60, H = hitOf();
    const Fy = by - 70, k9 = 150 * Math.sin(rad(9));                                                       // ball centre at rest; how far it dips off-centre
    const bxK = hes(S0, [-150 - bx, 150 - bx], -bx, 0, { pon: 55, ov: S0.chose ? .02 : 0 }), byK = hes(S0, [-130 + k9 - Fy, -130 + k9 - Fy], -130 - Fy, 0, { ov: S0.chose ? .1 : 0 });
    art(c, p => {
      floor(p, 300);
      const B = inG(sub(p), 'rise', 0, 300); B.path('M -70 300 L 0 40 L 70 300 Z', F(3.2)); B.circle(0, 40, 12, W(2.4));
      const T = mvG(B, { px: 0, py: 40, r: hes(S0, [-9, 9], 0, tilt, { pon: 4 }) }); R(T, -420, 22, 840, 22, 10, F(3));                  // rail + end cups
      [-1, 1].forEach(s => { T.path(`M ${s * 420 - 80} 22 L ${s * 420 - 70} 90 L ${s * 420 + 70} 90 L ${s * 420 + 80} 22`, F(3)); });
      const bl = mvG(sub(p), { x: bxK, y: byK, o: [[0, 0], [tu(.12), 0], [tu(.22), 1]] }); bl.circle(bx, Fy, 90, F(3.4));
      const spin = mvG(bl, { px: bx, py: Fy, r: bxK.map(([t, v, e]) => [t, f1((v + bx) * .3 * 180 / (Math.PI * 90)), e]) });      // it rolls (turned less than a real roll, so the "?" stays readable)
      if (S0.chose) { const q = mvG(spin, { o: [[0, 0], [tu(.26), 0], [tu(.36), 1], [bH(.06), 1], [H, 0]] }); glyph(q, bx, Fy, 120); }
      else qSpot(p, c, S0, bx, Fy, 120, { ly: null, into: spin, lean: false });
      if (S0.has2) [-1, 1].forEach((s, k) => { optAt(p, c, S0, k, s * 400, -45, 110, -130, { maxW: 200 }); if (S0.ai === k) tick(p, s * 400 + 80, -110, 26); });
      if (S0.ans && !S0.chose && S0.ans.label && picOf(S0.ans)) { const lg = sub(p); on(lg, p, 0, { o: [[0, 0], [H, 0], [aH(.15), 1]] }); lab(lg, S0.ans, 0, -185, { color: C.ink, weight: 700, maxW: 260 }); }
      aboutAt(p, c, S0, -300, 220, 100, null); if (S0.about) labT(p, S0.about, -230, 235, tu(.18), { anchor: 'start', maxW: 200, size: 36 });
    });
    if (S0.chose) pic(S0.opts[S0.ai], bx, Fy, 110, c, { punch: true, flipIn: true });
  });

  /* 13 ── BOOK: the pages riffle over (one at every option weighed) — on the keyword the last page falls and the book lies open at the
     answer (or at "?") */
  variant('book', 'หนังสือพลิกหน้า', (d, c) => {
    const S0 = st(d), L = cols(S0, 440), x = L.mx;
    const page = `M ${x} -170 Q ${x + 110} -205 ${x + 220} -180 L ${x + 220} 190 Q ${x + 110} 165 ${x} 200 Z`;
    art(c, p => {
      const B = inG(sub(p), 'pop', x, 20);
      B.path(`M ${x} -170 Q ${x - 110} -205 ${x - 220} -180 L ${x - 220} 190 Q ${x - 110} 165 ${x} 200 Z`, F(3.2)); B.path(page, F(3.2));
      B.path(`M ${x - 220} 190 L ${x - 228} 210 Q ${x - 110} 186 ${x} 220 Q ${x + 110} 186 ${x + 228} 210 L ${x + 220} 190`, S(2));
      [-110, -60, -10, 40, 90, 140].forEach(y => B.line(x - 190, y, x - 30, y + 6, S(1.4)));                                                    // lines on the left page
      qSpot(p, c, S0, x + 110, -30, 150, { ly: 110, maxW: 190, lean: false });
      const fd = tu(.24), ts = TV().concat([bH(.4), bH(.24)]);                                                   // quick off the right page, slow down onto the left
      ts.forEach(t => { const lf = sub(p); on(lf, p, 0, { ox: x, oy: 0, sx: [[0, 1], [t, 1], [t + fd, -1, 'out']], o: [[0, 0], [t, 0], [t + .001, 1], [t + fd, 1], [t + fd + .001, 0]] }); lf.path(page, F(2.8)); });
      aboutAt(p, c, S0, L.ax, -30, 150, 90);
      optCol(p, c, S0, L.ox, 110, { frame: 150 });
    });
  });

  /* 14 ── PICKER: the wheel rolls a notch toward each option weighed — on the keyword it clicks round: the chosen option rolls into the
     window (the "?" rolls out), or the "?" stays in the window */
  variant('picker', 'วงล้อเลือก', (d, c) => {
    const S0 = st(d), x = S0.about ? 120 : 0, H = hitOf(), bob = hes(S0, [30, -30], 0, 0, { pon: 16, ov: 0 }), pre = bob.filter(k => k[0] <= bH(.3) + 1e-9);
    art(c, p => {
      const B = inG(sub(p), 'pop', x, 0); R(B, x - 200, -290, 400, 580, 34, F(3.4)); B.path(`M ${x - 200} -70 L ${x + 200} -70 M ${x - 200} 70 L ${x + 200} 70`, W(3));
      const band = sub(B); R(band, x - 196, -70, 392, 140, 4, { fill: GLASS, sw: 0, stroke: 'none' });
      if (S0.chose) { const sy = S0.ai === 0 ? -175 : 175, q = mvG(sub(p), { px: x, py: 0, y: pre.concat([[H, -sy * .6, 'io']]), sy: [[0, 1], [bH(.3), 1], [H, .3, 'in']],
          o: [[0, 0], [tu(.36), 0], [tu(.46), 1], [bH(.15), 1], [H, 0]] }); glyph(q, x, 0, 120); }                                  // the "?" rolls out of the window
      else qSpot(p, c, S0, x, 0, 120, { ly: null, lean: 'y' });
      if (S0.has2) [-1, 1].forEach((s, k) => { const y = s * 175, it = S0.opts[k], t = tu(.2 + .1 * k), rows = { y: bob };
        if (S0.ai === k) {                                                                                                          // the chosen one: from its row into the window
          const mv = { px: x - 60, py: 0, y: pre.map(([u, v, e]) => [u, v + y, e]).concat([[H, -4 * s, 'io'], [aH(.16), 0, 'soft']]), s: [[0, .8], [bH(.3), .8], [H, 1, 'io']] };
          pic(it, x - 60, 0, 100, c, { t, mv: Object.assign({ o: [[0, 0], [t, 0], [t + .001, .5], [bH(.3), .5], [H, 1]] }, mv), punch: true, nudge: nudges(S0, k) });
          if (it.label && picOf(it)) { const g = mvG(sub(p), { y: bob, o: [[0, 0], [t, 0], [t + tu(.1), .5], [bH(.1), .5], [H, 0]] }); txt(g, it.label, x - 10, y + 14, { anchor: 'start', maxW: 170, size: 34 });
            const m = mvG(sub(p), { y: [[0, y * .4], [H, y * .4], [aH(.16), 0, 'out']], o: [[0, 0], [H, 0], [aH(.12), 1]] }); txt(m, it.label, x - 0, 16, { anchor: 'start', maxW: 180, size: 40, color: C.ink, weight: 700 }); }
          tick(p, x + 200, -70); return; }
        pic(it, x - 60, y, 80, c, { t, mv: Object.assign({ o: [[0, 0], [t, 0], [t + .001, .5]] }, rows), nudge: nudges(S0, k) });
        const g = mvG(sub(p), { y: bob, o: [[0, 0], [t, 0], [t + tu(.1), .5]] }); if (it.label && picOf(it)) txt(g, it.label, x - 10, y + 14, { anchor: 'start', maxW: 170, size: 34 }); });
      if (S0.ans && !S0.chose && S0.ans.label && picOf(S0.ans)) { const lg = sub(p); on(lg, p, 0, { o: [[0, 0], [H, 0], [aH(.15), 1]] }); lab(lg, S0.ans, x, 125, { color: C.ink, weight: 700, maxW: 300, size: 36 }); }
      aboutAt(p, c, S0, -260, -30, 150, 90);
    });
  });

  /* 15 ── BINOCULARS: the binoculars on their tripod pan from one option to the other (the view swings with them) — on the keyword the
     view locks on the answer (or "?") */
  variant('binoculars', 'กล้องส่องทางไกล', (d, c) => {
    const S0 = st(d), vy = -175, H = hitOf();
    art(c, p => {
      floor(p, 300);
      const B = inG(sub(p), 'rise', 0, 300);
      const V0 = mvG(B, { x: hes(S0, [-55, 55], 0, 0, { pon: 34, ov: 0 }) }), Vw = mvG(V0, { px: 0, py: vy, s: [[0, 1], [H, 1], [aH(.06), 1.05, 'out'], [aH(.26), 1, 'soft']] });
      [[-1, -110], [1, 110]].forEach(([s, dx]) => Vw.circle(dx * .72, vy, 105, F(3.2)));                                               // the view (two overlapping circles)
      const vw = sub(Vw); vw.path(`M -80 ${vy} A 105 105 0 0 1 80 ${vy} A 105 105 0 0 1 -80 ${vy} Z`, { fill: C.fill, sw: 0, stroke: 'none' });
      const Tp = sub(B), T = mvG(B, { px: 0, py: 140, r: hes(S0, [-9, 9], 0, 0, { pon: 6, ov: 0 }) });
      Tp.line(0, 140, -90, 300, W(4)); Tp.line(0, 140, 90, 300, W(4)); Tp.line(0, 140, 0, 300, W(4));                                    // tripod
      R(T, -100, 40, 85, 100, 22, F(3.2)); R(T, 15, 40, 85, 100, 22, F(3.2)); R(T, -18, 70, 36, 40, 8, F(2.6)); T.ellipse(-57, 40, 36, 10, W(2)); T.ellipse(57, 40, 36, 10, W(2));
      qSpot(p, c, S0, 0, vy, 130, { ly: null, into: Vw, lean: false });
      if (S0.ans && S0.ans.label && picOf(S0.ans)) { const lg = sub(p); on(lg, p, 0, { o: [[0, 0], [H, 0], [aH(.15), 1]] }); lab(lg, S0.ans, 0, vy + 150, { color: C.ink, weight: 700, maxW: 300, size: 36 }); }
      if (S0.has2) [-1, 1].forEach((s, k) => { optAt(p, c, S0, k, s * 360, -10, 120, 85, { maxW: 200 }); if (S0.ai === k) tick(p, s * 360 + 80, -90, 26); });
      aboutAt(p, c, S0, -330, 230, 90, null); if (S0.about) labT(p, S0.about, -270, 245, tu(.18), { anchor: 'start', maxW: 180, size: 34 });
    });
  });

  /* 16 ── SPINNING TOP: the top spins in, wobbling toward one option then the other — on the keyword it tips over toward the chosen one
     (or keeps spinning upright with the "?") */
  variant('top', 'ลูกข่างโยก', (d, c) => {
    const S0 = st(d), lean = S0.chose ? (S0.ai === 0 ? -62 : 62) : 0, gx = 0, gy = 290, H = hitOf();
    art(c, p => {
      floor(p, 300);
      const T0 = inG(sub(p), 'drop', gx, gy), T = mvG(T0, { px: gx, py: gy, r: hes(S0, [-11, 11], 0, lean, { pon: 7, fall: S0.chose }) });
      T.path(`M ${gx} ${gy} L ${gx - 150} ${gy - 170} Q ${gx - 160} ${gy - 230} ${gx - 100} ${gy - 245} L ${gx + 100} ${gy - 245} Q ${gx + 160} ${gy - 230} ${gx + 150} ${gy - 170} Z`, F(3.4));
      T.path(`M ${gx - 142} ${gy - 190} Q ${gx} ${gy - 160} ${gx + 142} ${gy - 190}`, S(1.6)); R(T, gx - 16, gy - 300, 32, 56, 8, F(2.8));
      const ml = sub(p); on(ml, p, 0, { o: [[0, 0], [tu(.4), 0], [tu(.5), 1]].concat(S0.chose ? [[bH(.1), 1], [H, 0]] : []) });         // spin marks
      [-1, 1].forEach(s => ml.path(`M ${gx + s * 190} ${gy - 210} q ${s * 30} 30 0 60`, S(2)));
      if (S0.chose) { const q = mvG(T, { o: [[0, 0], [tu(.36), 0], [tu(.46), 1], [bH(.05), 1], [aH(.06), 0]] }); glyph(q, gx, gy - 190, 120); }
      else qSpot(p, c, S0, gx, gy - 190, 120, { ly: null, into: T, lean: false });
      if (S0.has2) [-1, 1].forEach((s, k) => { optAt(p, c, S0, k, s * 360, 80, 130, 190, { maxW: 200 }); if (S0.ai === k) tick(p, s * 360 + 85, 0, 26); });
      aboutAt(p, c, S0, 0, -245, 110, -150, { maxW: 300 });
    });
  });

  /* 17 ── CARD SLOTS: a card marked "?" hovers over one slot then the other — on the keyword it drops into the chosen one and shows it
     (or comes back to the middle and turns over to the answer) */
  variant('slots', 'การ์ดหย่อนช่อง', (d, c) => {
    const S0 = st(d), cx = S0.chose ? (S0.ai === 0 ? -230 : 230) : 0, cy = S0.chose ? 0 : -170, H = hitOf();
    const Fc = S0.chose ? [cx, -20] : [0, cy];                                                              // the card's centre at the end
    const mvx = hes(S0, [-110 - Fc[0], 110 - Fc[0]], -Fc[0], 0, { pon: 40, ov: 0 }), mvy = hes(S0, [-145 - Fc[1], -145 - Fc[1]], -170 - Fc[1], 0, { from: -320 - Fc[1], ov: 0 });
    art(c, p => {
      const B = sub(p); atT(B, p, 0);
      if (S0.has2) [-1, 1].forEach(s => { R(B, s * 230 - 170, 70, 340, 230, 20, F(3.4)); R(B, s * 230 - 110, 62, 220, 18, 8, { fill: '#040404', sw: 2.4 }); });
      else { R(B, -170, 70, 340, 230, 20, F(3.4)); R(B, -110, 62, 220, 18, 8, { fill: '#040404', sw: 2.4 }); }
      const cd = mvG(sub(p), { x: mvx, y: mvy, o: [[0, 0], [tu(.08), 0], [tu(.18), 1]] }); if (S0.chose) R(cd, cx - 90, -110, 180, 180, 14, F(3)); else R(cd, cx - 110, cy - 140, 220, 280, 18, F(3.2));
      if (S0.chose) { const sl = sub(p); on(sl, p, 0, { o: [[0, 0], [bH(.02), 0], [H, 1]] }); sl.line(cx - 100, 70, cx + 100, 70, { sw: 10, stroke: C.fill });   // the slot swallows the card's edge
        const q = mvG(cd, { o: [[0, 1], [bH(.05), 1], [H, 0]] }); glyph(q, cx, -20, 120); }
      else qSpot(p, c, S0, cx, cy - 15, 150, { ly: cy + 105, into: cd, lean: false });
      if (S0.has2) [-1, 1].forEach((s, k) => { const it = S0.opts[k], t = tu(.2 + .1 * k), v = dimOpt(S0, k); pic(it, s * 230, 175, 100, c, { t, to: v, punch: S0.ai === k, nudge: nudges(S0, k) });
        const g = sub(p); on(g, p, 0, { o: [[0, 0], [t, 0], [t + tu(.1), 1]].concat(v < 1 ? [[H, 1], [aH(.25), .5]] : []) }); if (it.label && picOf(it)) txt(g, it.label, s * 230, 270, { maxW: 280, size: 36 });
        if (S0.ai === k) tick(p, s * 230 + 170, 70); });
      if (S0.chose) pic(S0.opts[S0.ai], cx, -45, 110, c, { flipIn: true });
      aboutAt(p, c, S0, S0.has2 ? -390 : -320, -190, 110, -90, { maxW: 200 });
    });
  });

  /* 18 ── BULB: a "?" sits in a dark bulb that flickers as the options are weighed — on the keyword the bulb lights and the "?" becomes
     the answer (no answer: it stays dark, the "?" pops) */
  variant('bulb', 'หลอดไฟคำตอบ', (d, c) => {
    const S0 = st(d), L = cols(S0, 340), x = L.mx, cy = -70, Rr = 150, b = Rr * .42, yb = cy + Rr * 1.22, H = hitOf();
    const glass = `M ${x - b} ${yb} C ${x - b} ${yb - Rr * .4}, ${x - Rr} ${cy + Rr * .62}, ${x - Rr} ${cy} A ${Rr} ${Rr} 0 1 1 ${x + Rr} ${cy} C ${x + Rr} ${cy + Rr * .62}, ${x + b} ${yb - Rr * .4}, ${x + b} ${yb} Z`;
    art(c, p => {
      const B = inG(sub(p), 'pop', x, yb);
      if (S0.ans) { const lt = mvG(B, { px: x, py: cy, s: [[0, .7], [H, .7], [aH(.2), 1.04, 'out'], [aH(.36), 1, 'soft']], o: [[0, 0], [H, 0], [aH(.1), 1]] }); lt.circle(x, cy, Rr + 50, S(2)); }
      B.path(glass, F(3.2));
      const fk = sub(B), fo = [[0, 0]]; TV().forEach(t => fo.push([t - tu(.02), 0], [t, 1], [t + tu(.04), .2], [t + tu(.07), .9], [t + tu(.13), 0])); on(fk, p, 0, { o: fo });   // flickers
      fk.path(glass, { fill: GLASS, sw: 0, stroke: 'none' });
      if (S0.ans) { const on1 = sub(B); on(on1, p, 0, { o: [[0, 0], [H, 0], [aH(.06), 1]] }); on1.path(glass, { sw: 4.2 }); }
      R(B, x - b, yb, 2 * b, Rr * .45, 8, F(2.8)); [.12, .24, .36].forEach(k => B.line(x - b + 5, yb + Rr * k, x + b - 5, yb + Rr * (k - .06), S(1.6)));
      B.path(`M ${x - b * .5} ${yb + Rr * .45} L ${x - b * .3} ${yb + Rr * .6} L ${x + b * .3} ${yb + Rr * .6} L ${x + b * .5} ${yb + Rr * .45}`, F(2.4));
      qSpot(p, c, S0, x, cy, 160, { ly: 300 });
      aboutAt(p, c, S0, L.ax, -30, 150, 90);
      optCol(p, c, S0, L.ox, 110, { frame: 150 });
    });
  });

  /* 19 ── FOLDED NOTE: a note folded small, marked "?", fidgets while in doubt — on the keyword it unfolds (the folds open out) and the
     answer is written inside (no answer: the "?" pops) */
  variant('note', 'กระดาษพับคลี่', (d, c) => {
    const S0 = st(d), L = cols(S0, 380), x = L.mx, open = !!S0.ans, H = hitOf();
    art(c, p => {
      const B = sub(p), N0 = inG(B, 'drop', x, 160), N = mvG(N0, { px: x, py: 160, r: rattle(3) });
      if (open) { const O = mvG(B, { px: x, sx: [[0, .33], [H, .33], [aH(.3), 1, 'out']], o: [[0, 0], [H, 0], [H + tu(.01), 1]] });   // the sheet opens out
        O.path(`M ${x - 180} -200 L ${x - 60} -190 L ${x + 60} -200 L ${x + 180} -190 L ${x + 180} 200 L ${x + 60} 190 L ${x - 60} 200 L ${x - 180} 190 Z`, F(3.2));
        [x - 60, x + 60].forEach(fx => O.line(fx, -190, fx, 195, S(1.6))); O.line(x - 180, 0, x + 180, 0, { sw: 1.2, stroke: C.rule }); qSpot(p, c, S0, x, -40, 170, { ly: 120, noQ: true }); }
      const fN = open ? mvG(N, { px: x, sx: [[0, 1], [bH(.12), 1], [H, .33, 'in']], o: [[0, 1], [H, 1], [H + tu(.01), 0]] }) : N;       // the folded note
      fN.path(`M ${x - 110} -150 L ${x + 110} -165 L ${x + 120} 150 L ${x - 100} 160 Z`, F(3.2)); fN.path(`M ${x - 100} 160 L ${x - 70} 120 L ${x - 110} 110`, S(1.6)); fN.line(x - 105, -5, x + 115, -10, S(1.4));
      if (open) glyph(sub(fN), x + 5, 0, 190); else popQ(fN, p, x + 5, 0, 190);
      aboutAt(p, c, S0, L.ax, -30, 150, 90);
      optCol(p, c, S0, L.ox, 110, { frame: 150 });
    });
  });

  /* 20 ── PROJECTOR: the screen rolls down, the projector clicks from one slide to the next (the picture flickers at every click) — on the
     keyword it clicks once more and the screen shows the answer (or "?") */
  variant('projector', 'เครื่องฉายสไลด์', (d, c) => {
    const S0 = st(d), sx = S0.has2 ? -90 : 60, sy = -120, H = hitOf(), clicks = TV().concat([bH(.14)]);
    art(c, p => {
      const SC = sub(p); atT(SC, p, 0);
      const scr = mvG(SC, { px: sx, py: sy - 185, sy: [[0, 0], [tu(.06), 0], [tu(.34), 1, 'out']] }); R(scr, sx - 230, sy - 180, 460, 320, 10, F(3.4));   // the screen rolls down
      R(SC, sx - 250, sy - 196, 500, 22, 8, F(3));
      const ST = sub(p); atT(ST, p, tu(.2)); ST.line(sx, sy + 140, sx, sy + 190, W(3)); ST.line(sx - 60, sy + 190, sx + 60, sy + 190, W(3));
      const px = sx + 300, py = 250, P = inG(sub(p), 'rise', px, py, tu(.1));
      R(P, px - 110, py - 60, 190, 100, 18, F(3.2)); P.circle(px - 110, py - 10, 32, F(3)); P.circle(px - 110, py - 10, 14, W(2));        // body, lens
      const rK = [[0, 0]]; clicks.forEach((t, i) => rK.push([t - tu(.06), i * 90], [t, (i + 1) * 90, 'out']));
      const wh = mvG(P, { px: px - 10, py: py - 80, r: rK }); wh.circle(px - 10, py - 80, 34, F(2.8)); wh.line(px - 10, py - 80, px + 10, py - 100, W(2));   // slide wheel
      const bo = [[0, 0], [tu(.4), 0], [tu(.48), 1]]; clicks.forEach(t => bo.push([t - tu(.01), 1], [t + tu(.02), .2], [t + tu(.08), 1]));
      const bm = sub(p); on(bm, p, 0, { o: bo }); bm.shape([[px - 140, py - 30], [px - 140, py + 10], [sx + 200, sy + 120], [sx + 200, sy - 150]], { fill: 'rgba(255,255,255,.04)', sw: 0, stroke: 'none' });
      qSpot(p, c, S0, sx, sy - 25, 170, { ly: sy + 110, t: tu(.48) });
      if (S0.has2) [-120, 130].forEach((y, k) => { optAt(p, c, S0, k, 380, y - 140, 100, y - 70, { frame: 140, maxW: 180 }); if (S0.ai === k) tick(p, 450, y - 210, 26); });
      aboutAt(p, c, S0, -360, 250, 90, null); if (S0.about) labT(p, S0.about, -300, 265, tu(.18), { anchor: 'start', maxW: 260, size: 36 });
    });
  });

  /* samples from unrelated topics (neutrality) + a stress set */
  const I = (icon, label) => label ? { icon, label } : { icon };
  const SAMPLES = [
    { say: 'ทำไมร้านเงียบขนาดนี้', about: I('store', 'ร้านเงียบ') },
    { say: 'จะไปทะเลหรือภูเขาดี', options: [I('ship', 'ทะเล'), I('mountain', 'ภูเขา')] },
    { say: 'ลูกจะโตทันเพื่อนไหม', about: I('baby', 'ลูก') },
    { say: 'มันคุ้มจริงหรือเปล่า', about: I('gem', 'คุ้มไหม') },
    { say: 'ต้นไม้ไม่โตเพราะอะไร คำตอบคือแดด', about: I('sprout', 'ต้นไม้'), answer: I('sun', 'แดด') },
    { say: 'ลูกค้ายังลังเลว่าซื้อหรือไม่ซื้อ', about: I('user', 'ลูกค้า'), options: [I('package', 'ซื้อ'), I('ban', 'ไม่ซื้อ')] },
    { say: 'นั่งรถเมล์หรือรถไฟ สุดท้ายเลือกรถไฟ', options: [I('bus', 'รถเมล์'), I('train-front', 'รถไฟ')], answer: I('train-front', 'รถไฟ') },
    { say: 'ทำไมจำไม่ได้สักที', about: I('brain', 'จำไม่ได้') },
    { say: 'รถสตาร์ทไม่ติดเพราะอะไร แบตหมด', about: I('car', 'รถเสีย'), answer: I('battery-low', 'แบตหมด') },
    { say: 'เช้านี้กาแฟหรือน้ำเปล่าดี', options: [I('coffee', 'กาแฟ'), I('glass-water', 'น้ำเปล่า')] },
    { say: 'ทำไมนอนไม่หลับ', about: I('moon', 'นอนไม่หลับ') },
    { say: 'เขารักหรือไม่รัก', about: I('user', 'เขา'), options: [I('heart', 'รัก'), I('heart-crack', 'ไม่รัก')] },
    { say: 'ทำไมปลาไม่กิน น้ำเย็นไป', about: I('fish', 'ปลาไม่กิน'), answer: I('thermometer', 'น้ำเย็นไป') },
    { say: 'ทำงานต่อหรือไปนอน ไปนอนดีกว่า', options: [I('laptop', 'ทำงานต่อ'), I('bed', 'ไปนอน')], answer: I('bed', 'ไปนอน') },
    { say: 'เงินหายไปไหนหมด', about: I('wallet', 'เงินหายไปไหน') },
    { say: 'เรียนต่อในประเทศหรือต่างประเทศ', about: I('graduation-cap', 'เรียนต่อ'), options: [I('school', 'ในประเทศ'), I('plane', 'ต่างประเทศ')] },
    { say: 'เค้กแฟบเพราะอะไร ตีไข่ไม่พอ', about: I('cake', 'เค้กแฟบ'), answer: I('egg', 'ตีไข่ไม่พอ') },
    { say: 'วิ่งตอนเช้าหรือตอนเย็นดี', options: [I('sun', 'ตอนเช้า'), I('moon', 'ตอนเย็น')] },
    { say: 'ใครโทรมาตอนตีสาม', about: I('phone', 'ใครโทรมา') },
    { say: 'ไปทางเขาหรือทางป่า สุดท้ายไปทางป่า', about: I('map', 'ทางไหนดี'), options: [I('mountain', 'ทางเขา'), I('trees', 'ทางป่า')], answer: I('trees', 'ทางป่า') },
  ];
  const STRESS = [
    { say: 'about ไม่มีป้าย', about: I('store') },
    { say: 'ตัวเลือกไม่มีป้าย', options: [I('sun'), I('moon')] },
    { say: 'ป้ายยาว 12 ตัว', about: I('house', 'บ้านหลังนี้ดีไหม'), options: [I('heart', 'ซื้อเก็บไว้เลย'), I('clock', 'รอดูไปก่อนนะ')] },
    { say: 'ภาษาอังกฤษ', about: I('rocket', 'Launch now?'), options: [I('zap', 'Fast'), I('shield-check', 'Safe')] },
    { say: 'ไม่มีไอคอน (ป้ายแทนภาพ)', about: { label: 'ทำไม' }, answer: { label: 'เพราะรัก' } },
    { say: 'มีแต่คำตอบ', answer: I('lightbulb', 'ลองใหม่') },
    { say: 'ตัวเลือกไอคอนเดียวกัน', options: [I('clock', 'ตอนนี้'), I('clock', 'พรุ่งนี้')], answer: { label: 'พรุ่งนี้' } },
    { say: 'ชื่อไอคอนที่ไม่มี', about: I('no-such-icon', 'อะไรเนี่ย') },
    { say: 'คำตอบไม่อยู่ในตัวเลือก', options: [I('ship', 'ทะเล'), I('mountain', 'ภูเขา')], answer: I('house', 'อยู่บ้าน') },
    { say: 'ครบทุกช่อง', about: I('users', 'ทีมเรา'), options: [I('rocket', 'ไปต่อ'), I('octagon-alert', 'หยุดก่อน')], answer: I('rocket', 'ไปต่อ') },
    { say: 'ตัวเลขเป็นป้าย', options: [I('timer', '5 นาที'), I('timer', '30 นาที')], answer: { label: '30 นาที' } },
    { say: 'about ภาษาอังกฤษยาว', about: I('laptop', 'Why so slow?') },
    { say: 'คำตอบป้ายยาว', about: I('sprout', 'ต้นไม้'), answer: I('droplets', 'รดน้ำน้อยเกินไป') },
    { say: 'ตัวเลือกป้ายยาว', options: [I('coffee', 'กาแฟใส่นมเยอะ'), I('glass-water', 'น้ำเปล่าธรรมดา')] },
    { say: 'คำตอบไม่มีป้าย', about: I('cloud', 'ฝนจะตกไหม'), answer: I('umbrella') },
    { say: 'อังกฤษ + คำตอบ', options: [I('book', 'Read'), I('tv', 'Watch')], answer: I('book', 'Read') },
    { say: 'about กับคำตอบไอคอนเดียวกัน', about: I('heart', 'ใจเขา'), answer: I('heart', 'ยังรักอยู่') },
    { say: 'ไม่มีป้ายเลยทั้งหมด', about: I('gift'), options: [I('cake'), I('cookie')], answer: I('cake') },
    { say: 'about ไม่มีไอคอน + ตัวเลือก', about: { label: 'ไปไหนดี' }, options: [I('house', 'บ้าน'), I('store', 'ร้าน')] },
    { say: 'about คน + ตัวเลือก', about: I('user', 'แม่'), options: [I('salad', 'สลัด'), I('pizza', 'พิซซ่า')] },
  ];

  G.cats = G.cats || {};
  G.cats.B06 = { variants: V, SAMPLES, STRESS, draw: (i, d, c) => { setZ(c); CUR = V[i].id; V[i].build(d, c); }, CLAMPS, timing: c => (setZ(c), Object.assign({}, Z)) };
})();
