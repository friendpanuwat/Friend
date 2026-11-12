/* pro6.js — pro icon batch 6 (CutPack priority-1 names, the last 13 non-body-part icons).
   Standard: main line 3 · dark see-through bodies · only details that carry meaning (no glints, no decorative sparkles);
   every rig has an entrance, a looping part animation, and an exit (3rd argument of rig, see GL.EXIT). */
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
  const R = {}, rig = (name, dur, exit, fn) => { fn.custom = true; fn.dur = dur; fn.exit = exit; R[name] = fn; };

  /* circle-alert — the disc lands, the "!" jumps up as a warning, a ring pulses out */
  rig('circle-alert-pro', .6, 'rise', p => {
    const intro = sub(p);
    const rp = sub(intro); rp.circle(0, 0, 150, { stroke: C.soft, sw: 2 });
    on(rp, p, .7, { loop: 2.2, s: [[0, 1], [.15, 1], [1, 1.28, 'out']], o: [[0, 0], [.15, 0], [.17, .8], [1, 0]] });
    const g = sub(intro); g.circle(0, 0, 150, { fill: C.fill, sw: 3.4 });
    const ex = sub(g); ex.line(0, -80, 0, 18, { sw: 20 }); ex.dot(0, 66, 13);
    on(ex, p, .7, { loop: 2.2, ox: 0, oy: 80, y: [[0, 0], [.1, -18, 'out'], [.24, 0, 'in'], [.32, -6, 'out'], [.4, 0, 'in']],
      sy: [[0, 1], [.06, .88, 'out'], [.16, 1.08], [.24, .94], [.34, 1]] });
    on(g, p, .7, { loop: 2.2, r: shakeKeys(4, 3, .05) });
    drop(p, intro, 0, -100);
  });

  /* lock-open — the shackle sits up and open; it gets pushed down, then springs back open with a bump */
  rig('lock-open-pro', .7, 'rise', p => {
    const intro = sub(p), sk = sub(intro), bd = sub(intro);
    tube(sk, 'M -70 40 L -70 -86 A 70 70 0 0 1 70 -86 L 70 0', 24);
    bd.rect(-116, -20, 232, 176, { rx: 28, fill: C.fill, sw: 3.4 });
    bd.circle(0, 50, 17, { fill: C.ink, sw: 2 }); bd.line(0, 60, 0, 100, { sw: 10 });
    on(sk, p, .7, { loop: 2.6, ox: -70, oy: -20, y: [[0, -54], [.9, -54], [1.08, -8, 'in'], [1.3, -8], [1.46, -64, 'out'], [1.62, -54, 'soft']],
      r: [[0, -10], [.9, -10], [1.08, 0, 'in'], [1.3, 0], [1.5, -13, 'out'], [1.7, -10, 'soft']] });
    on(bd, p, .7, { loop: 2.6, ox: 0, oy: 156, sy: [[0, 1], [1.08, 1], [1.14, .95, 'out'], [1.28, 1], [1.46, 1.03, 'out'], [1.6, 1]] });
    drop(p, intro, 0, -100);
  });

  /* eye-off — a narrowed eye under a slash: it strains to open, the slash presses it shut again (the slash never leaves) */
  rig('eye-off-pro', .6, 'pop', p => {
    const intro = sub(p), e = sub(intro);
    e.path('M -172 0 Q 0 -150 172 0 Q 0 150 -172 0 Z', { fill: C.fill, sw: 3.2 });
    const ir = sub(e); ir.circle(0, 0, 58, { fill: C.fill, sw: 3 }); ir.circle(0, 0, 24, { fill: C.ink, sw: 1.4 });
    on(e, p, .7, { loop: 2.8, sy: [[0, .6], [.9, .6], [1.3, .86, 'io'], [1.42, .86], [1.52, .42, 'in'], [1.75, .6, 'soft']] });
    on(ir, p, .7, { loop: 2.8, o: [[0, .5], [.9, .5], [1.3, .9], [1.45, .9], [1.55, .5]] });
    const sl = sub(intro); slash(sl, -150, -136, 150, 136);
    on(sl, p, .7, { loop: 2.8, s: [[0, 1], [1.42, 1], [1.52, 1.06, 'out'], [1.8, 1, 'soft']] });
    pop(p, intro);
  });

  /* flag — the pole plants itself, the flag unfurls from it and keeps waving */
  rig('flag-pro', .8, 'rise', p => {
    const intro = sub(p), pole = sub(intro);
    P_pole(pole);
    const fo = sub(intro), fl = sub(fo);
    fl.path('M -96 -154 C -30 -184, 40 -122, 140 -150 L 140 -10 C 40 18, -30 -46, -96 -16 Z', { fill: C.fill, sw: 3.2 });
    on(fl, p, .8, { loop: 1.8, ox: -96, oy: -84, ky: [[0, 0], [.45, -5, 'soft'], [.9, 0, 'soft'], [1.35, 5, 'soft'], [1.8, 0, 'soft']],
      sx: [[0, 1], [.45, .95, 'soft'], [.9, 1, 'soft'], [1.35, .97, 'soft'], [1.8, 1, 'soft']] });
    on(fo, p, 0, { ox: -96, oy: -84, sx: [[0, .05], [.3, .05], [.75, 1, 'back']], o: [[0, 0], [.3, 0], [.32, 1]] });
    drop(p, intro, 0, -120);
    function P_pole(q) { P_capsule(q, -110, -150, -110, 184, 12); q.circle(-110, -170, 16, { fill: C.fill, sw: 3 }); }
    function P_capsule(q, x1, y1, x2, y2, r) { q.rect(x1 - r, y1, r * 2, y2 - y1, { rx: r, fill: C.fill, sw: 3 }); }
  });

  /* megaphone — it kicks back on each shout while sound waves burst out of the bell */
  rig('megaphone-pro', .6, 'pop', p => {
    const intro = sub(p), m = intro.child({ transform: 'translate(-14 6) rotate(-10)' }), mg = sub(m);
    const waves = sub(m); [56, 96].forEach((r, i) => { const w = sub(waves), a = .72, cx = 92;
      w.path(`M ${cx + r * Math.cos(a)} ${-r * Math.sin(a)} A ${r} ${r} 0 0 1 ${cx + r * Math.cos(a)} ${r * Math.sin(a)}`, { sw: 3.4 - i * .8, stroke: i ? C.soft : C.ink });
      on(w, p, .7, { loop: 1.4, ox: cx, oy: 0, o: [[0, 0], [.06 + i * .08, 0], [.12 + i * .08, 1], [.7, 0]], s: [[0, .85], [.7, 1.1, 'out']] }); });
    mg.path('M -112 54 L -94 130 Q -90 146 -74 146 L -60 146 Q -44 146 -48 130 L -62 66', { fill: C.fill, sw: 3 });
    mg.rect(-166, -46, 66, 92, { rx: 14, fill: C.fill, sw: 3.2 });
    mg.path('M -100 -46 L 70 -116 Q 92 -124 92 -100 L 92 100 Q 92 124 70 116 L -100 46 Z', { fill: C.fill, sw: 3.2 });
    on(mg, p, .7, { loop: 1.4, ox: -100, oy: 0, x: [[0, 0], [.07, -12, 'out'], [.4, 0, 'soft']], r: [[0, 0], [.07, -3, 'out'], [.4, 0, 'soft']] });
    pop(p, intro);
  });

  /* trophy — drops onto its base, then hops with a little twist and lands with a squash */
  const STAR5 = (cx, cy, R, r) => { const a = []; for (let i = 0; i < 10; i++) { const t = -Math.PI / 2 + i * Math.PI / 5, d = i % 2 ? r : R; a.push([+(cx + Math.cos(t) * d).toFixed(1), +(cy + Math.sin(t) * d).toFixed(1)]); } return a; };
  rig('trophy-pro', .7, 'rise', p => {
    const intro = sub(p), tr = sub(intro);
    tr.path('M -92 -130 C -170 -130, -168 -30, -70 -22', { sw: 14 }); tr.path('M -92 -130 C -170 -130, -168 -30, -70 -22', { sw: 7, stroke: C.fill });
    tr.path('M 92 -130 C 170 -130, 168 -30, 70 -22', { sw: 14 }); tr.path('M 92 -130 C 170 -130, 168 -30, 70 -22', { sw: 7, stroke: C.fill });
    tr.rect(-18, 20, 36, 76, { fill: C.fill, sw: 3 });
    tr.rect(-66, 92, 132, 30, { rx: 8, fill: C.fill, sw: 3 });
    tr.rect(-92, 120, 184, 36, { rx: 10, fill: C.fill, sw: 3.2 });
    tr.path('M -104 -164 L 104 -164 L 104 -84 C 104 -14, 54 30, 0 30 C -54 30, -104 -14, -104 -84 Z', { fill: C.fill, sw: 3.4 });
    tr.shape(STAR5(0, -80, 40, 17), { fill: C.fill, sw: 2.6 });
    on(tr, p, .7, { loop: 2.4, ox: 0, oy: 156, y: [[0, 0], [.1, 0], [.36, -40, 'out'], [.6, 0, 'in']], r: [[0, 0], [.1, 0], [.28, -5, 'out'], [.44, 4, 'io'], [.6, 0, 'in']],
      sy: [[0, 1], [.1, .92, 'out'], [.2, 1.05], [.36, 1], [.6, 1], [.66, .92, 'out'], [.82, 1, 'soft']], sx: [[0, 1], [.1, 1.05, 'out'], [.2, .97], [.36, 1], [.6, 1], [.66, 1.05, 'out'], [.82, 1, 'soft']] });
    drop(p, intro, 0, -130);
  });

  /* hourglass — sand pours from the top bulb into the bottom one, then the glass flips over and starts again */
  rig('hourglass-pro', .6, 'spin', p => {
    const intro = sub(p), hg = intro.child({ transform: 'scale(.92)' }, .92), fl = sub(hg);
    fl.path('M -84 -148 C -84 -60, -16 -30, -16 0 C -16 30, -84 60, -84 148 L 84 148 C 84 60, 16 30, 16 0 C 16 -30, 84 -60, 84 -148 Z', { fill: C.fill, sw: 3.2 });
    const top = sub(fl), bot = sub(fl), st = fl.line(0, 4, 0, 138, { sw: 3, stroke: C.soft });
    top.path('M -74 -140 C -60 -100, -20 -82, 0 -80 C 20 -82, 60 -100, 74 -140 Z', { fill: C.soft, stroke: C.soft, sw: 1.6 });
    bot.path('M -74 140 C -60 100, -20 82, 0 80 C 20 82, 60 100, 74 140 Z', { fill: C.soft, stroke: C.soft, sw: 1.6 });
    fl.rect(-108, -172, 216, 26, { rx: 9, fill: C.fill, sw: 3.2 }); fl.rect(-108, 146, 216, 26, { rx: 9, fill: C.fill, sw: 3.2 });
    const T = 3.4;
    on(top, p, .7, { loop: T, ox: 0, oy: -140, sy: [[0, 1], [.1, 1], [2.2, 0, 'lin'], [T, 0]], o: [[0, 1], [2.1, 1], [2.2, 0], [T, 0]] });
    on(bot, p, .7, { loop: T, ox: 0, oy: 140, sy: [[0, 0], [.2, 0], [2.3, 1, 'lin'], [T, 1]], o: [[0, 0], [.2, 0], [.3, 1], [T, 1]] });
    on(st, p, .7, { loop: T, o: [[0, 0], [.1, 0], [.14, 1], [2.2, 1], [2.26, 0], [T, 0]] });
    on(fl, p, .7, { loop: T, r: [[0, 0], [2.6, 0], [3.2, 180, 'io'], [T, 180]] });
    pop(p, intro);
  });

  /* arrow-down-up — the down arrow and the up arrow nudge in turn, like swapping order */
  rig('arrow-down-up-pro', .7, 'pop', p => {
    const intro = sub(p), dO = sub(intro), uO = sub(intro), dn = sub(dO), up = sub(uO);
    tube(dn, 'M -76 -150 L -76 134', 30); tube(dn, 'M -132 82 L -76 144 L -20 82', 30);
    tube(up, 'M 76 150 L 76 -134', 30); tube(up, 'M 20 -82 L 76 -144 L 132 -82', 30);
    on(dn, p, .7, { loop: 2, y: [[0, 0], [.3, 22, 'out'], [.7, 0, 'io']] });
    on(up, p, .7, { loop: 2, y: [[0, 0], [.4, 0], [.7, -22, 'out'], [1.1, 0, 'io']] });
    on(dO, p, 0, { y: [[0, -160], [.5, 0, 'back']], o: [[0, 0], [.15, 1]] }); on(uO, p, .12, { y: [[0, 160], [.5, 0, 'back']], o: [[0, 0], [.15, 1]] });
  });

  /* chevrons-left-right — the two chevrons push outward together (expand), echoes trail, then they snap back */
  rig('chevrons-left-right-pro', .6, 'pop', p => {
    const intro = sub(p);
    [-1, 1].forEach(sd => {
      const ec = sub(intro); ec.path(`M ${sd * 40} -100 L ${sd * 140} 0 L ${sd * 40} 100`, { sw: 3, stroke: C.soft });
      on(ec, p, .7, { loop: 1.8, x: [[0, 0], [.3, sd * 26, 'out'], [.75, sd * 46, 'out']], o: [[0, 0], [.3, 0], [.32, .8], [.75, 0]] });
      const cO = sub(intro), ch = sub(cO); tube(ch, `M ${sd * 40} -100 L ${sd * 140} 0 L ${sd * 40} 100`, 34);
      on(ch, p, .7, { loop: 1.8, x: [[0, 0], [.3, sd * 26, 'out'], [.6, sd * 26], [.95, 0, 'back']] });
      on(cO, p, 0, { x: [[0, -sd * 70], [.5, 0, 'back']], o: [[0, 0], [.15, 1]] });
    });
    on(intro, p, 0, { o: [[0, 0], [.01, 1]] });
  });

  /* phone-off — under a slash the handset tries to ring, buzzes weakly, then goes dim again (the slash never leaves) */
  rig('phone-off-pro', .6, 'pop', p => {
    const intro = sub(p), hw = intro.child({ transform: 'scale(.92)' }, .92), hs = sub(hw);
    hs.path('M -120 -150 Q -150 -150 -150 -110 C -150 40, -40 150, 110 150 Q 150 150 150 120 L 150 80 Q 150 60 130 54 L 76 40 Q 56 36 44 52 L 26 74 C -20 54, -54 20, -74 -26 L -52 -44 Q -36 -56 -40 -76 L -54 -130 Q -60 -150 -80 -150 Z', { fill: C.fill, sw: 3.2 });
    on(hs, p, .7, { loop: 2.8, o: [[0, .6], [.8, .6], [.9, 1], [1.35, 1], [1.6, .6]], r: [[0, 0], [.85, 0], ...shakeKeys(9, 5, .045).slice(1).map(([t, v, e]) => [.85 + t, v, e])] });
    const sl = sub(intro); slash(sl, 150, -160, -150, 160);
    on(sl, p, .7, { loop: 2.8, s: [[0, 1], [1.3, 1], [1.4, 1.06, 'out'], [1.7, 1, 'soft']] });
    pop(p, intro);
  });

  /* pin — a push pin: it drops in tilted and stabs down; then it lifts and taps in again, the board ticks */
  rig('pin-pro', .7, 'rise', p => {
    const intro = sub(p), pO = sub(intro), pn = sub(pO);
    pn.line(0, 40, 0, 176, { sw: 6 });
    pn.path('M -40 -140 L 40 -140 L 48 -26 Q 108 -8 108 40 L -108 40 Q -108 -8 -48 -26 Z', { fill: C.fill, sw: 3.2 });
    pn.rect(-64, -172, 128, 34, { rx: 14, fill: C.fill, sw: 3.2 });
    const tk = sub(intro); [[-1, 0], [1, 0]].forEach(([sd]) => tk.line(sd * 22, 182, sd * 50, 170, { sw: 3, stroke: C.soft }));
    on(pn, p, .7, { loop: 2.2, ox: 0, oy: 176, y: [[0, 0], [.1, 0], [.4, -34, 'out'], [.58, 0, 'in']], r: [[0, 0], [.1, 0], [.4, -8, 'out'], [.58, 0, 'in']],
      sy: [[0, 1], [.58, 1], [.64, .93, 'out'], [.78, 1, 'soft']] });
    on(tk, p, .7, { loop: 2.2, o: [[0, 0], [.58, 0], [.6, 1], [.9, 0]], s: [[0, .6], [.58, .6], [.8, 1.15, 'out']], ox: 0, oy: 176 });
    on(intro, p, 0, { ox: 0, oy: 176, y: [[0, -170], [.4, 0, 'in']], r: [[0, -24], [.4, 0, 'in']], o: [[0, 0], [.1, 1]] });
    on(pO, p, 0, { ox: 0, oy: 176, sy: [[.4, .88], [.52, 1.04, 'out'], [.64, 1]] });
  });

  /* rewind — the two triangles dart left one after the other, speed lines trail on the right */
  rig('rewind-pro', .6, 'slideL', p => {
    const intro = sub(p), A = sub(intro), B = sub(intro);
    A.shape([[-6, -112], [-150, 0], [-6, 112]], { fill: C.fill, sw: 3.4 });
    B.shape([[150, -112], [6, 0], [150, 112]], { fill: C.fill, sw: 3.4 });
    on(B, p, .7, { loop: 1.4, x: [[0, 0], [.18, -20, 'out'], [.6, 0, 'io']] });
    on(A, p, .7, { loop: 1.4, x: [[0, 0], [.1, 0], [.28, -20, 'out'], [.7, 0, 'io']] });
    [[-60, 50], [0, 34], [60, 50]].forEach(([y, l], i) => { const s = sub(intro); s.line(166, y, 166 + l * .6, y, { sw: 3, stroke: C.soft });
      on(s, p, .7, { loop: 1.4, x: [[0, -16], [.3, 12, 'out']], o: [[0, 0], [.04 + i * .03, 1], [.42, 0]] }); });
    on(intro, p, 0, { x: [[0, 220], [.55, 0, 'out']], o: [[0, 0], [.15, 1]] });
  });

  /* sliders-horizontal — three tracks draw across, then each knob slides to a new setting and back */
  rig('sliders-horizontal-pro', .7, 'pop', p => {
    const intro = sub(p);
    [[-110, -64, 66], [0, 56, -54], [110, -20, 92]].forEach(([y, a, b], i) => {
      const tr = intro.line(-164, y, 164, y, { sw: 4 });
      on(tr, p, i * .08, { draw: [[0, 0], [.4, 1, 'out']] });
      const kO = sub(intro), kn = sub(kO); kn.rect(a - 15, y - 36, 30, 72, { rx: 15, fill: C.fill, sw: 3.2 });
      on(kn, p, .8 + i * .25, { loop: 3, x: [[0, 0], [.5, b - a, 'io'], [1.5, b - a], [2, 0, 'io']] });
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
