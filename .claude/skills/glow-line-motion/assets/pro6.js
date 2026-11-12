/* pro6.js — pro icon batch 6 (CutPack priority-1 names, the last 13 non-body-part icons).
   Standard: main line 3 · dark see-through bodies · only details that carry meaning (no glints, no decorative sparkles);
   every rig has an entrance, a looping part animation, and an exit (3rd argument of rig, see GL.EXIT).
   Note: two GL.kf on the same element → the later one overwrites the transform; keep entrance and loop on separate groups. */
(function () {
  const G = window.GL, C = G.C;
  const sub = (p, attrs) => p.child(attrs || {});
  const on = (q, p, start, spec) => G.kf(q.g || q, p.t0 + start * p.ts, spec);
  const pop = (p, q, at = 0, from = .4) => on(q, p, at, { s: [[0, from], [.42, 1.08, 'out'], [.62, 1]], o: [[0, 0], [.16, 1]] });
  const drop = (p, q, at = 0, dy = -90) => on(q, p, at, { y: [[0, dy], [.55, 0, 'back']], o: [[0, 0], [.2, 1]] });
  const tube = (p, d, w = 18) => { p.path(d, { sw: w }); p.path(d, { sw: w - 7, stroke: C.fill }); };
  const shakeKeys = (n, amp, step = .05) => { const k = [[0, 0]]; for (let i = 1; i <= n; i++) k.push([i * step, i % 2 ? -amp : amp, 'lin']); k.push([(n + 1) * step, 0, 'out']); return k; };
  /* a slash that cuts through an icon: a wide dark gap underneath, the bright line on top */
  const slash = (q, x1, y1, x2, y2) => [q.line(x1, y1, x2, y2, { sw: 22, stroke: C.fill }), q.line(x1, y1, x2, y2, { sw: 6 })];
  /* a short flash: visible from a to b (in loop time) */
  const flash = (a, b) => [[0, 0], [a, 0], [a + .02, 1], [b, 0]];
  const R = {}, rig = (name, dur, exit, fn) => { fn.custom = true; fn.dur = dur; fn.exit = exit; R[name] = fn; };

  /* circle-alert — the disc lands, the tapered "!" jumps up as a warning, the disc rattles (shake marks), a ring pulses out */
  rig('circle-alert-pro', .6, 'rise', p => {
    const intro = sub(p);
    const rp = sub(intro); rp.circle(0, 0, 150, { stroke: C.soft, sw: 2 });
    on(rp, p, .7, { loop: 2.2, s: [[0, 1], [.15, 1], [1, 1.28, 'out']], o: [[0, 0], [.15, 0], [.17, .8], [1, 0]] });
    const mk = sub(intro); [-1, 1].forEach(sd => { [[-135, 166, 192], [-155, 170, 192]].forEach(([a, r1, r2]) => {
      const t = (sd < 0 ? a : -180 - a) * Math.PI / 180; mk.line(Math.cos(t) * r1, Math.sin(t) * r1, Math.cos(t) * r2, Math.sin(t) * r2, { sw: 3.2 }); }); });
    on(mk, p, .7, { loop: 2.2, o: flash(0, .3) });
    const g = sub(intro); g.circle(0, 0, 150, { fill: C.fill, sw: 3.4 });
    const ex = sub(g); ex.shape([[-16, -86], [16, -86], [8, 20], [-8, 20]], { fill: C.ink, sw: 6 }); ex.dot(0, 64, 14);
    on(ex, p, .7, { loop: 2.2, ox: 0, oy: 80, y: [[0, 0], [.1, -18, 'out'], [.24, 0, 'in'], [.32, -6, 'out'], [.4, 0, 'in']],
      sy: [[0, 1], [.06, .88, 'out'], [.16, 1.08], [.24, .94], [.34, 1]] });
    on(g, p, .7, { loop: 2.2, r: shakeKeys(4, 3, .05) });
    drop(p, intro, 0, -100);
  });

  /* lock-open — the shackle sits up and open (notched tip); it gets pushed down, then springs back open with a click */
  rig('lock-open-pro', .7, 'rise', p => {
    const intro = sub(p), sk = sub(intro), bd = sub(intro);
    tube(sk, 'M -70 40 L -70 -86 A 70 70 0 0 1 70 -86 L 70 0', 24); sk.line(60, -14, 80, -14, { sw: 2.6, stroke: C.soft });
    bd.rect(-116, -20, 232, 176, { rx: 28, fill: C.fill, sw: 3.4 });
    bd.rect(-32, 20, 64, 102, { rx: 32, sw: 2, stroke: C.soft });
    bd.circle(0, 50, 17, { fill: C.ink, sw: 2 }); bd.line(0, 60, 0, 100, { sw: 10 });
    const ck = sub(intro); [[96, -62, 118, -74], [100, -36, 124, -36]].forEach(([a, b, c, d]) => ck.line(a, b, c, d, { sw: 3 }));
    on(ck, p, .7, { loop: 2.6, o: flash(1.46, 1.75) });
    on(sk, p, .7, { loop: 2.6, ox: -70, oy: -20, y: [[0, -54], [.9, -54], [1.08, -8, 'in'], [1.3, -8], [1.46, -64, 'out'], [1.62, -54, 'soft']],
      r: [[0, -10], [.9, -10], [1.08, 0, 'in'], [1.3, 0], [1.5, -13, 'out'], [1.7, -10, 'soft']] });
    on(bd, p, .7, { loop: 2.6, ox: 0, oy: 156, sy: [[0, 1], [1.08, 1], [1.14, .95, 'out'], [1.28, 1], [1.46, 1.03, 'out'], [1.6, 1]] });
    drop(p, intro, 0, -100);
  });

  /* eye-off — a narrowed, lashed eye under a slash: it strains to open, the slash presses it shut again (the slash never leaves) */
  rig('eye-off-pro', .6, 'pop', p => {
    const intro = sub(p), e = sub(intro);
    e.path('M -172 0 Q 0 -150 172 0 Q 0 150 -172 0 Z', { fill: C.fill, sw: 3.2 });
    for (let i = 1; i <= 7; i++) { const t = i / 8, x = -172 * (1 - t) * (1 - t) + 172 * t * t, y = -300 * t * (1 - t);   // points on the upper lid
      e.line(x, y - 3, x + (x / 172) * 16, y - 24, { sw: 2.4 }); }
    const ir = sub(e); ir.circle(0, 0, 58, { fill: C.fill, sw: 3 }); ir.circle(0, 0, 40, { sw: 1.6, stroke: C.soft }); ir.circle(0, 0, 22, { fill: C.ink, sw: 1.4 });
    on(e, p, .7, { loop: 2.8, sy: [[0, .6], [.9, .6], [1.3, .86, 'io'], [1.42, .86], [1.52, .42, 'in'], [1.75, .6, 'soft']] });
    on(ir, p, .7, { loop: 2.8, o: [[0, .5], [.9, .5], [1.3, .9], [1.45, .9], [1.55, .5]] });
    const sl = sub(intro); slash(sl, -150, -136, 150, 136);
    on(sl, p, .7, { loop: 2.8, s: [[0, 1], [1.42, 1], [1.52, 1.06, 'out'], [1.8, 1, 'soft']] });
    pop(p, intro);
  });

  /* flag — the pole (on a small stand) plants itself, the flag unfurls from its tie rings and keeps waving */
  rig('flag-pro', .8, 'rise', p => {
    const intro = sub(p);
    const fo = sub(intro), fl = sub(fo);
    fl.path('M -96 -154 C -30 -184, 40 -122, 140 -150 L 140 -10 C 40 18, -30 -46, -96 -16 Z', { fill: C.fill, sw: 3.2 });
    fl.path('M -60 -110 C -10 -128, 50 -84, 108 -100', { sw: 2, stroke: C.soft });
    on(fl, p, .8, { loop: 1.8, ox: -96, oy: -84, ky: [[0, 0], [.45, -5, 'soft'], [.9, 0, 'soft'], [1.35, 5, 'soft'], [1.8, 0, 'soft']],
      sx: [[0, 1], [.45, .95, 'soft'], [.9, 1, 'soft'], [1.35, .97, 'soft'], [1.8, 1, 'soft']] });
    on(fo, p, 0, { ox: -96, oy: -84, sx: [[0, .05], [.3, .05], [.75, 1, 'back']], o: [[0, 0], [.3, 0], [.32, 1]] });
    const pole = sub(intro);
    pole.rect(-122, -150, 24, 318, { rx: 12, fill: C.fill, sw: 3 }); pole.circle(-110, -170, 16, { fill: C.fill, sw: 3 });
    [-144, -26].forEach(y => pole.rect(-126, y - 6, 32, 12, { rx: 6, fill: C.fill, sw: 2.4 }));
    pole.rect(-156, 162, 92, 24, { rx: 8, fill: C.fill, sw: 3 });
    drop(p, intro, 0, -120);
  });

  /* megaphone — it kicks back on each shout while sound waves burst out of the bell (band near the mouth, trigger on the grip) */
  rig('megaphone-pro', .6, 'pop', p => {
    const intro = sub(p), m = intro.child({ transform: 'translate(-14 6) rotate(-10)' }), mg = sub(m);
    const waves = sub(m); [56, 96].forEach((r, i) => { const w = sub(waves), a = .72, cx = 92;
      w.path(`M ${cx + r * Math.cos(a)} ${-r * Math.sin(a)} A ${r} ${r} 0 0 1 ${cx + r * Math.cos(a)} ${r * Math.sin(a)}`, { sw: 3.4 - i * .8, stroke: i ? C.soft : C.ink });
      on(w, p, .7, { loop: 1.4, ox: cx, oy: 0, o: [[0, 0], [.06 + i * .08, 0], [.12 + i * .08, 1], [.7, 0]], s: [[0, .85], [.7, 1.1, 'out']] }); });
    mg.path('M -59 76 C -32 78, -28 98, -51 112', { sw: 3 });
    mg.path('M -112 54 L -94 130 Q -90 146 -74 146 L -60 146 Q -44 146 -48 130 L -62 66', { fill: C.fill, sw: 3 });
    mg.rect(-166, -46, 66, 92, { rx: 14, fill: C.fill, sw: 3.2 });
    mg.path('M -100 -46 L 70 -116 Q 92 -124 92 -100 L 92 100 Q 92 124 70 116 L -100 46 Z', { fill: C.fill, sw: 3.2 });
    mg.line(56, -104, 56, 104, { sw: 2.4, stroke: C.soft });
    on(mg, p, .7, { loop: 1.4, ox: -100, oy: 0, x: [[0, 0], [.07, -12, 'out'], [.4, 0, 'soft']], r: [[0, 0], [.07, -3, 'out'], [.4, 0, 'soft']] });
    pop(p, intro);
  });

  /* trophy — drops onto its base, then hops with a little twist and lands with a squash (rim band, stem knot, blank plaque) */
  const STAR5 = (cx, cy, R, r) => { const a = []; for (let i = 0; i < 10; i++) { const t = -Math.PI / 2 + i * Math.PI / 5, d = i % 2 ? r : R; a.push([+(cx + Math.cos(t) * d).toFixed(1), +(cy + Math.sin(t) * d).toFixed(1)]); } return a; };
  rig('trophy-pro', .7, 'rise', p => {
    const intro = sub(p), tr = sub(intro);
    [1, -1].forEach(sd => { const d = `M ${sd * 92} -130 C ${sd * 170} -130, ${sd * 168} -30, ${sd * 70} -22`; tr.path(d, { sw: 14 }); tr.path(d, { sw: 7, stroke: C.fill }); });
    tr.rect(-18, 20, 36, 76, { fill: C.fill, sw: 3 });
    tr.rect(-28, 46, 56, 16, { rx: 8, fill: C.fill, sw: 2.6 });
    tr.rect(-66, 92, 132, 30, { rx: 8, fill: C.fill, sw: 3 });
    tr.rect(-92, 120, 184, 36, { rx: 10, fill: C.fill, sw: 3.2 });
    tr.rect(-40, 129, 80, 18, { rx: 4, sw: 2, stroke: C.soft });
    tr.path('M -104 -164 L 104 -164 L 104 -84 C 104 -14, 54 30, 0 30 C -54 30, -104 -14, -104 -84 Z', { fill: C.fill, sw: 3.4 });
    tr.line(-102, -142, 102, -142, { sw: 2, stroke: C.soft });
    tr.shape(STAR5(0, -76, 40, 17), { fill: C.fill, sw: 2.6 });
    on(tr, p, .7, { loop: 2.4, ox: 0, oy: 156, y: [[0, 0], [.1, 0], [.36, -40, 'out'], [.6, 0, 'in']], r: [[0, 0], [.1, 0], [.28, -5, 'out'], [.44, 4, 'io'], [.6, 0, 'in']],
      sy: [[0, 1], [.1, .92, 'out'], [.2, 1.05], [.36, 1], [.6, 1], [.66, .92, 'out'], [.82, 1, 'soft']], sx: [[0, 1], [.1, 1.05, 'out'], [.2, .97], [.36, 1], [.6, 1], [.66, 1.05, 'out'], [.82, 1, 'soft']] });
    drop(p, intro, 0, -130);
  });

  /* hourglass — framed glass (two posts + plates). Sand sinks out of the top bulb through the neck as falling grains and piles up
     at the bottom; then the frame flips over (sand fades out during the turn and is back on top when it lands) */
  rig('hourglass-pro', .6, 'spin', p => {
    const intro = sub(p), hg = intro.child({ transform: 'scale(.9)' }, .9), T = 3.6;
    const spin = q => on(q, p, .7, { loop: T, r: [[0, 0], [2.5, 0], [3.1, 180, 'io'], [T, 180]] });
    const gl = sub(hg); spin(gl);
    gl.path('M -84 -148 C -84 -60, -16 -30, -16 0 C -16 30, -84 60, -84 148 L 84 148 C 84 60, 16 30, 16 0 C 16 -30, 84 -60, 84 -148 Z', { fill: C.fill, sw: 3.2 });
    const sand = sub(hg), SAND = { fill: C.mute, stroke: C.soft, sw: 2.2 };
    on(sand, p, .7, { loop: T, o: [[0, 1], [2.4, 1], [2.55, 0], [3.05, 0], [3.3, 1], [T, 1]] });
    const top = sub(sand), bot = sub(sand), fall = sub(sand);
    top.path('M -62 -82 Q 0 -92 62 -82 C 48 -46, 16 -24, 6 -6 L -6 -6 C -16 -24, -48 -46, -62 -82 Z', SAND);
    bot.path('M -80 142 C -64 100, -26 82, 0 80 C 26 82, 64 100, 80 142 Z', SAND);
    on(top, p, .7, { loop: T, ox: 0, oy: -6, sy: [[0, 1], [.1, 1], [2.2, 0, 'lin'], [2.6, 0], [2.61, 1, 'lin'], [T, 1]], sx: [[0, 1], [1.6, .9], [2.2, .4], [2.6, .4], [2.61, 1, 'lin'], [T, 1]] });
    on(bot, p, .7, { loop: T, ox: 0, oy: 142, sy: [[0, 0], [.2, 0], [2.3, 1, 'lin'], [2.6, 1], [2.61, 0, 'lin'], [T, 0]], sx: [[0, .5], [.2, .5], [2.3, 1, 'out'], [2.6, 1], [2.61, .5, 'lin'], [T, .5]] });
    on(fall, p, .7, { loop: T, o: [[0, 0], [.1, 0], [.15, 1], [2.2, 1], [2.3, 0], [T, 0]] });
    fall.line(0, 0, 0, 130, { sw: 1.6, stroke: C.soft });
    [0, 1, 2].forEach(i => { const gr = sub(fall); gr.dot(-3 + i * 3, 0, 3.6, { fill: C.soft, stroke: C.soft });
      on(gr, p, .7 + i * .15, { loop: .45, y: [[0, 0], [.45, 120, 'in']], o: [[0, 1], [.36, 1], [.45, 0]] }); });
    const fr = sub(hg); spin(fr);
    [-1, 1].forEach(sd => fr.rect(sd * 100 - 7, -150, 14, 300, { rx: 7, fill: C.fill, sw: 2.6 }));
    fr.rect(-118, -174, 236, 26, { rx: 9, fill: C.fill, sw: 3.2 }); fr.rect(-118, 148, 236, 26, { rx: 9, fill: C.fill, sw: 3.2 });
    pop(p, intro);
  });

  /* arrow-down-up — the down arrow and the up arrow nudge in turn, like swapping order; speed lines trail behind each */
  rig('arrow-down-up-pro', .7, 'pop', p => {
    const intro = sub(p);
    [[-76, 1], [76, -1]].forEach(([x, sd], i) => {
      const o = sub(intro), ar = sub(o), y0 = -sd * 150;
      tube(ar, `M ${x} ${y0} L ${x} ${sd * 134}`, 30); tube(ar, `M ${x - 56} ${sd * 82} L ${x} ${sd * 144} L ${x + 56} ${sd * 82}`, 30);
      const d = i * .4, tl = sub(ar);
      [[-20, 26], [20, 18]].forEach(([dx, l]) => tl.line(x + dx, y0 - sd * 18, x + dx, y0 - sd * (18 + l), { sw: 3, stroke: C.soft }));
      on(tl, p, .7, { loop: 2, o: flash(d, d + .45) });
      on(ar, p, .7, { loop: 2, y: [[0, 0], [d, 0], [d + .3, sd * 22, 'out'], [d + .7, 0, 'io']] });
      on(o, p, i * .12, { y: [[0, -sd * 160], [.5, 0, 'back']], o: [[0, 0], [.15, 1]] });
    });
    on(intro, p, 0, { o: [[0, 0], [.01, 1]] });
  });

  /* chevrons-left-right — the two chevrons push outward together (expand), echoes trail, the dots between them stretch apart */
  rig('chevrons-left-right-pro', .6, 'pop', p => {
    const intro = sub(p);
    const dots = sub(intro); on(dots, p, .1, { s: [[0, 0], [.4, 1, 'back']], o: [[0, 0], [.1, 1]] });
    [-1, 0, 1].forEach(k => { const dd = sub(dots); dd.dot(k * 24, 0, 7);
      on(dd, p, .7, { loop: 1.8, x: [[0, 0], [.3, k * 12, 'out'], [.6, k * 12], [.95, 0, 'back']] }); });
    [-1, 1].forEach(sd => {
      const ec = sub(intro); ec.path(`M ${sd * 40} -100 L ${sd * 140} 0 L ${sd * 40} 100`, { sw: 3, stroke: C.soft });
      on(ec, p, .7, { loop: 1.8, x: [[0, 0], [.3, sd * 26, 'out'], [.75, sd * 46, 'out']], o: [[0, 0], [.3, 0], [.32, .8], [.75, 0]] });
      const cO = sub(intro), ch = sub(cO); tube(ch, `M ${sd * 40} -100 L ${sd * 140} 0 L ${sd * 40} 100`, 34);
      on(ch, p, .7, { loop: 1.8, x: [[0, 0], [.3, sd * 26, 'out'], [.6, sd * 26], [.95, 0, 'back']] });
      on(cO, p, 0, { x: [[0, -sd * 70], [.5, 0, 'back']], o: [[0, 0], [.15, 1]] });
    });
    on(intro, p, 0, { o: [[0, 0], [.01, 1]] });
  });

  /* phone-off — under a slash the handset tries to ring: it buzzes, faint rings start and get cut off, then it goes dim (slash never leaves) */
  rig('phone-off-pro', .6, 'pop', p => {
    const intro = sub(p), hw = intro.child({ transform: 'scale(.92)' }, .92);
    const waves = sub(hw); [64, 104].forEach((r, i) => { const w = sub(waves); w.path(`M 40 ${-80 - r} A ${r} ${r} 0 0 1 ${40 + r} -80`, { sw: 3.2 - i * .8, stroke: i ? C.soft : C.ink });
      on(w, p, .7, { loop: 2.8, ox: 40, oy: -80, o: [[0, 0], [.9 + i * .12, 0], [.96 + i * .12, .9], [1.3, .9], [1.45, 0]], s: [[0, .9], [.9, .9], [1.3, 1.05, 'out'], [1.45, .8, 'in']] }); });
    const hs = sub(hw);
    hs.path('M -120 -150 Q -150 -150 -150 -110 C -150 40, -40 150, 110 150 Q 150 150 150 120 L 150 80 Q 150 60 130 54 L 76 40 Q 56 36 44 52 L 26 74 C -20 54, -54 20, -74 -26 L -52 -44 Q -36 -56 -40 -76 L -54 -130 Q -60 -150 -80 -150 Z', { fill: C.fill, sw: 3.2 });
    hs.path('M -132 -96 C -128 0, -60 92, 60 128', { sw: 2, stroke: C.soft });
    on(hs, p, .7, { loop: 2.8, o: [[0, .6], [.8, .6], [.9, 1], [1.35, 1], [1.6, .6]], r: [[0, 0], [.85, 0], ...shakeKeys(9, 5, .045).slice(1).map(([t, v, e]) => [.85 + t, v, e])] });
    const sl = sub(intro); slash(sl, 150, -160, -150, 160);
    on(sl, p, .7, { loop: 2.8, s: [[0, 1], [1.3, 1], [1.4, 1.06, 'out'], [1.7, 1, 'soft']] });
    pop(p, intro);
  });

  /* pin — a push pin (cap, banded body, needle hub) drops in tilted and stabs into the board; then it lifts and taps in again */
  rig('pin-pro', .7, 'rise', p => {
    const intro = sub(p), bdl = sub(intro), pO = sub(intro), pn = sub(pO);
    bdl.line(-70, 176, 70, 176, { sw: 2.6, stroke: C.soft });
    pn.line(0, 40, 0, 176, { sw: 6 });
    pn.rect(-12, 38, 24, 16, { rx: 5, fill: C.fill, sw: 2.4 });
    pn.path('M -40 -140 L 40 -140 L 48 -26 Q 108 -8 108 40 L -108 40 Q -108 -8 -48 -26 Z', { fill: C.fill, sw: 3.2 });
    pn.line(-41, -118, 41, -118, { sw: 2, stroke: C.soft }); pn.line(-46, -40, 46, -40, { sw: 2, stroke: C.soft });
    pn.rect(-64, -172, 128, 34, { rx: 14, fill: C.fill, sw: 3.2 });
    const tk = sub(intro); [-1, 1].forEach(sd => tk.line(sd * 22, 168, sd * 50, 156, { sw: 3 }));
    on(pn, p, .7, { loop: 2.2, ox: 0, oy: 176, y: [[0, 0], [.1, 0], [.4, -34, 'out'], [.58, 0, 'in']], r: [[0, 0], [.1, 0], [.4, -8, 'out'], [.58, 0, 'in']],
      sy: [[0, 1], [.58, 1], [.64, .93, 'out'], [.78, 1, 'soft']] });
    on(tk, p, .7, { loop: 2.2, o: flash(.58, .9), s: [[0, .6], [.58, .6], [.8, 1.15, 'out']], ox: 0, oy: 176 });
    on(intro, p, 0, { o: [[0, 0], [.1, 1]] });
    on(bdl, p, 0, { ox: 0, oy: 176, sx: [[0, 0], [.3, 1, 'out']] });
    on(pO, p, 0, { ox: 0, oy: 176, y: [[0, -170], [.4, 0, 'in']], r: [[0, -24], [.4, 0, 'in']], sy: [[.4, .88], [.52, 1.04, 'out'], [.64, 1]] });
  });

  /* rewind — the two triangles dart left one after the other, speed lines trail on the right, and the playhead below runs backwards */
  rig('rewind-pro', .6, 'slideL', p => {
    const intro = sub(p), A = sub(intro), B = sub(intro);
    A.shape([[-6, -112], [-150, 0], [-6, 112]], { fill: C.fill, sw: 3.4 });
    B.shape([[150, -112], [6, 0], [150, 112]], { fill: C.fill, sw: 3.4 });
    on(B, p, .7, { loop: 1.4, x: [[0, 0], [.18, -20, 'out'], [.6, 0, 'io']] });
    on(A, p, .7, { loop: 1.4, x: [[0, 0], [.1, 0], [.28, -20, 'out'], [.7, 0, 'io']] });
    [[-60, 50], [0, 34], [60, 50]].forEach(([y, l], i) => { const s = sub(intro); s.line(166, y, 166 + l * .6, y, { sw: 3, stroke: C.soft });
      on(s, p, .7, { loop: 1.4, x: [[0, -16], [.3, 12, 'out']], o: [[0, 0], [.04 + i * .03, 1], [.42, 0]] }); });
    const bar = sub(intro); bar.line(-150, 166, 150, 166, { sw: 2.4, stroke: C.soft });
    const played = sub(bar); played.line(-150, 166, 80, 166, { sw: 5 });
    const head = sub(bar); head.circle(80, 166, 11, { fill: C.ink, sw: 2 });
    const run = [[0, 0], [2.2, -1, 'lin'], [2.8, -1]], k = q => run.map(([t, v, e]) => [t, q(v), e]);
    on(played, p, .7, { loop: 2.8, ox: -150, oy: 166, sx: k(v => 1 + v * .8), o: [[0, 1], [2.3, 1], [2.5, 0], [2.8, 1]] });
    on(head, p, .7, { loop: 2.8, x: k(v => v * 184), o: [[0, 1], [2.3, 1], [2.5, 0], [2.8, 1]] });
    on(intro, p, 0, { x: [[0, 220], [.55, 0, 'out']], o: [[0, 0], [.15, 1]] });
  });

  /* sliders-horizontal — three tracks draw across (filled part bright, rest dim), then each knob slides to a new setting and back */
  rig('sliders-horizontal-pro', .7, 'pop', p => {
    const intro = sub(p);
    [[-110, -64, 66], [0, 56, -54], [110, -20, 92]].forEach(([y, a, b], i) => {
      const bg = intro.line(-164, y, 164, y, { sw: 2.4, stroke: C.soft });
      const act = sub(intro), al = act.line(-164, y, a, y, { sw: 5 });
      [bg, al].forEach(l => on(l, p, i * .08, { draw: [[0, 0], [.4, 1, 'out']] }));
      const t0 = .8 + i * .25, mv = [[0, 0], [.5, 1, 'io'], [1.5, 1], [2, 0, 'io']];
      on(act, p, t0, { loop: 3, ox: -164, oy: y, sx: mv.map(([t, v, e]) => [t, 1 + v * (b - a) / (a + 164), e]) });
      const kO = sub(intro), kn = sub(kO); kn.rect(a - 15, y - 36, 30, 72, { rx: 15, fill: C.fill, sw: 3.2 }); kn.line(a, y - 16, a, y + 16, { sw: 2, stroke: C.soft });
      on(kn, p, t0, { loop: 3, x: mv.map(([t, v, e]) => [t, v * (b - a), e]) });
      on(kO, p, .2 + i * .08, { ox: a, oy: y, s: [[0, 0], [.3, 1.15, 'out'], [.42, 1]], o: [[0, 0], [.05, 1]] });
    });
    on(intro, p, 0, { o: [[0, 0], [.01, 1]] });
  });

  Object.assign(G.icons, R);
  const ALIAS = { 'circle-alert': 'circle-alert-pro', alert: 'circle-alert-pro', 'lock-open': 'lock-open-pro', unlock: 'lock-open-pro', 'eye-off': 'eye-off-pro',
    flag: 'flag-pro', megaphone: 'megaphone-pro', trophy: 'trophy-pro', hourglass: 'hourglass-pro', 'arrow-down-up': 'arrow-down-up-pro',
    'chevrons-left-right': 'chevrons-left-right-pro', 'phone-off': 'phone-off-pro', pin: 'pin-pro', pushpin: 'pin-pro', rewind: 'rewind-pro', 'sliders-horizontal': 'sliders-horizontal-pro' };
  for (const [a, pro] of Object.entries(ALIAS)) { if (G.icons[a] && !G.icons[a + '-basic'] && !G.icons[a].custom) G.icons[a + '-basic'] = G.icons[a]; G.icons[a] = R[pro]; }
  G.PRO6 = Object.keys(R);
})();
