/* pro11.js — pro icon batch 11: CutPack priority-3 names 21–40 (media, office, files).
   Detail level = pro.js (one soft inner outline, bands, grilles, holes — only what the object really has), style.md §0 rules.
   Motion = anticipation, overshoot + settle, follow-through, secondary motion. Entrance and loop sit on separate groups. */
(function () {
  const G = window.GL, C = G.C, P = G.parts;
  const sub = (p, attrs) => p.child(attrs || {});
  const on = (q, p, start, spec) => G.kf(q.g || q, p.t0 + start * p.ts, spec);
  const pop = (p, q, at = 0, from = .4) => on(q, p, at, { s: [[0, from], [.42, 1.08, 'out'], [.62, 1]], o: [[0, 0], [.16, 1]] });
  const drop = (p, q, at = 0, dy = -90) => on(q, p, at, { y: [[0, dy], [.55, 0, 'back']], o: [[0, 0], [.2, 1]] });
  const thud = (p, q, oy, dy = -220) => on(q, p, 0, { ox: 0, oy, y: [[0, dy], [.42, 0, 'in']], sy: [[.42, .86], [.56, 1.06, 'out'], [.7, 1]], sx: [[.42, 1.1], [.56, .97, 'out'], [.7, 1]], o: [[0, 0], [.1, 1]] });
  const show = (p, q) => on(q, p, 0, { o: [[0, 0], [.01, 1]] });
  const flash = (a, b) => [[0, 0], [a, 0], [a + .02, 1], [b, 0]];
  const shakeKeys = (n, amp, step = .05) => { const k = [[0, 0]]; for (let i = 1; i <= n; i++) k.push([i * step, i % 2 ? -amp : amp, 'lin']); k.push([(n + 1) * step, 0, 'out']); return k; };
  const at = (keys, t0) => keys.map(([t, v, e]) => [t + t0, v, e]);
  const f1 = v => +v.toFixed(1), rad = d => d * Math.PI / 180;
  const arc = (cx, cy, r, a0, a1) => `M ${f1(cx + r * Math.cos(rad(a0)))} ${f1(cy + r * Math.sin(rad(a0)))} A ${r} ${r} 0 ${Math.abs(a1 - a0) > 180 ? 1 : 0} ${a1 > a0 ? 1 : 0} ${f1(cx + r * Math.cos(rad(a1)))} ${f1(cy + r * Math.sin(rad(a1)))}`;
  let clipN = 0;
  const clip = (q, d) => { const NS = 'http://www.w3.org/2000/svg', id = 'gl11clip' + (++clipN), cp = document.createElementNS(NS, 'clipPath'), pt = document.createElementNS(NS, 'path');
    cp.setAttribute('id', id); pt.setAttribute('d', d); cp.appendChild(pt); q.g.appendChild(cp); return `url(#${id})`; };
  const slash = (q, x1, y1, x2, y2) => { q.line(x1, y1, x2, y2, { sw: 22, stroke: C.fill }); q.line(x1, y1, x2, y2, { sw: 6 }); };
  const R = {}, rig = (name, dur, exit, fn) => { fn.custom = true; fn.dur = dur; fn.exit = exit; R[name] = fn; };

  const BELL = 'M -16 -112 C -70 -104, -84 -60, -86 -6 C -88 40, -100 58, -122 72 L 122 72 C 100 58, 88 40, 86 -6 C 84 -60, 70 -104, 16 -112 Z';
  /* bell-ring — the bell rings hard: a big damped swing from the top, the clapper lags, ring marks flash at both shoulders */
  rig('bell-ring-pro', .6, 'pop', p => {
    const intro = sub(p), sw = sub(intro), cl = sub(sw);
    [-1, 1].forEach((sd, i) => { const rg = sub(intro); rg.path(`M ${sd * 112} -84 Q ${sd * 146} -112 ${sd * 138} -150`, { sw: 4 }); rg.path(`M ${sd * 140} -64 Q ${sd * 186} -104 ${sd * 172} -160`, { sw: 3, stroke: C.soft });
      on(rg, p, .7, { loop: 2.4, o: [[0, 0], [.1 + i * .18, 0], [.14 + i * .18, 1], [.5 + i * .18, 0], [.62 + i * .18, 0], [.66 + i * .18, 1], [.95 + i * .18, 0]] }); });
    cl.line(0, 70, 0, 100, { sw: 3 }); cl.circle(0, 110, 16, { fill: C.fill, sw: 3 });
    sw.circle(0, -128, 11, { fill: C.fill, sw: 3 }); sw.path(BELL, { fill: C.fill, sw: 3.2 });
    sw.path('M -86 22 Q 0 38 86 22', { stroke: C.soft, sw: 1.8 }); sw.rect(-130, 68, 260, 22, { rx: 11, fill: C.fill, sw: 3 });
    on(sw, p, .7, { loop: 2.4, ox: 0, oy: -128, r: [[0, 0], [.12, -18, 'out'], [.32, 15], [.5, -11], [.66, 7], [.8, -3.5], [.94, 1.5], [1.05, 0, 'soft']] });
    on(cl, p, .7, { loop: 2.4, ox: 0, oy: 70, r: [[0, 0], [.16, 16, 'out'], [.36, -14], [.54, 10], [.7, -5], [.86, 2], [1, 0, 'soft']] });
    drop(p, intro, 0, -100);
  });

  /* camera — press the shutter: the button dips (anticipation), the lens aperture snaps shut and open, the flash bursts, the body recoils */
  rig('camera-pro', .6, 'pop', p => {
    const intro = sub(p), bd = sub(intro);
    const bt = sub(bd); bt.rect(-136, -114, 46, 22, { rx: 7, fill: C.fill, sw: 2.8 });
    on(bt, p, .7, { loop: 2.4, y: [[0, 0], [.2, 0], [.3, 8, 'out'], [.45, 0, 'soft']] });
    bd.path('M -170 -70 Q -170 -96 -144 -96 L -76 -96 L -54 -132 L 54 -132 L 76 -96 L 144 -96 Q 170 -96 170 -70 L 170 112 Q 170 138 144 138 L -144 138 Q -170 138 -170 112 Z', { fill: C.fill, sw: 3.4 });
    bd.line(-170, -50, -86, -50, { sw: 2, stroke: C.soft }); bd.line(86, -50, 170, -50, { sw: 2, stroke: C.soft });
    bd.rect(108, -82, 40, 22, { rx: 5, fill: C.fill, sw: 2.6 });
    bd.circle(0, 22, 84, { fill: C.fill, sw: 3.4 }); bd.circle(0, 22, 66, { sw: 2, stroke: C.soft });
    const ap = sub(bd); ap.circle(0, 22, 42, { fill: C.fill, sw: 3 }); ap.circle(0, 22, 18, { fill: C.ink, sw: 1.6 });
    on(ap, p, .7, { loop: 2.4, ox: 0, oy: 22, s: [[0, 1], [.3, 1], [.36, .35, 'in'], [.5, 1.08, 'out'], [.66, 1, 'soft']] });
    const fl = sub(intro); [[0, -1], [.7, -.7], [1, 0], [-.7, -.7]].forEach(([dx, dy]) => fl.line(f1(128 + dx * 24), f1(-71 + dy * 24), f1(128 + dx * 46), f1(-71 + dy * 46), { sw: 3.4 }));
    on(fl, p, .7, { loop: 2.4, o: flash(.32, .6), ox: 128, oy: -71, s: [[0, .6], [.32, .6], [.5, 1.15, 'out']] });
    on(bd, p, .7, { loop: 2.4, s: [[0, 1], [.32, 1], [.36, .97, 'out'], [.55, 1, 'soft']] });
    pop(p, intro);
  });

  /* clapperboard — the striped clapper lifts open (slow), snaps shut (fast) with a bump and clap marks */
  const stripes = (q, y0, h, dir) => { for (let i = 0; i < 4; i++) { const x0 = -136 + i * 72; q.shape(dir > 0 ? [[x0, y0 + h], [x0 + 26, y0], [x0 + 56, y0], [x0 + 30, y0 + h]] : [[x0, y0], [x0 + 26, y0 + h], [x0 + 56, y0 + h], [x0 + 30, y0]], { fill: C.soft, stroke: C.soft, sw: 1 }); } };
  rig('clapperboard-pro', .6, 'pop', p => {
    const intro = sub(p), g = intro.child({ transform: 'translate(0 18)' }), bd = sub(g);
    bd.rect(-160, -14, 320, 166, { rx: 12, fill: C.fill, sw: 3.4 });
    bd.line(-160, 40, 160, 40, { sw: 2, stroke: C.soft }); bd.line(-160, 96, 160, 96, { sw: 2, stroke: C.soft }); bd.line(0, 40, 0, 152, { sw: 2, stroke: C.soft });
    bd.rect(-160, -46, 320, 32, { rx: 6, fill: C.fill, sw: 3 }); stripes(bd, -44, 28, 1);
    const arm = sub(g); arm.rect(-160, -84, 320, 34, { rx: 6, fill: C.fill, sw: 3.2 }); stripes(arm, -82, 30, -1);
    arm.circle(-148, -48, 7, { fill: C.fill, sw: 2.4 });
    on(arm, p, .7, { loop: 2.2, ox: -160, oy: -48, r: [[0, 0], [.5, -22, 'out'], [1, -22], [1.1, 0, 'in'], [1.16, -3], [1.24, 0, 'soft']] });
    on(bd, p, .7, { loop: 2.2, ox: 0, oy: 152, sy: [[0, 1], [1.1, 1], [1.14, .96, 'out'], [1.3, 1, 'soft']] });
    const cm = sub(g); [[176, -84, 196, -104], [182, -62, 198, -62], [160, -100, 166, -124]].forEach(([a, b, c, d]) => cm.line(a, b, c, d, { sw: 3 }));
    on(cm, p, .7, { loop: 2.2, o: flash(1.1, 1.4) });
    pop(p, intro);
  });

  /* film — a film strip: frames and sprocket holes scroll through the gate endlessly */
  rig('film-pro', .6, 'pop', p => {
    const intro = sub(p);
    intro.rect(-112, -172, 224, 344, { rx: 16, fill: C.fill, sw: 3.4 });
    const win = sub(intro, { 'clip-path': clip(intro, 'M -108 -168 L 108 -168 L 108 168 L -108 168 Z') }), st = sub(win);
    for (let y = -320; y <= 320; y += 40) [-88, 88].forEach(x => st.rect(x - 8, y - 11, 16, 22, { rx: 4, fill: C.fill, sw: 2.2 }));
    for (let y = -300; y <= 300; y += 120) { st.rect(-56, y - 46, 112, 92, { rx: 6, fill: C.fill, sw: 2.6 }); st.path(`M -44 ${y + 30} L -10 ${y - 8} L 12 ${y + 14} L 26 ${y} L 44 ${y + 30}`, { sw: 2, stroke: C.soft }); }
    [-70, 70].forEach(x => intro.line(x, -172, x, 172, { sw: 2.4 }));
    on(st, p, .6, { loop: 1.6, y: [[0, 0], [1.6, 120, 'lin']] });
    pop(p, intro);
  });

  /* messages-square — two square bubbles talk: the back one pulses, the front one answers with typing dots and a pop */
  rig('messages-square-pro', .9, 'pop', p => {
    const intro = sub(p);
    const bO = sub(intro), bk = sub(bO);
    bk.path('M -150 -170 L 20 -170 Q 40 -170 40 -150 L 40 -50 Q 40 -30 20 -30 L -90 -30 L -140 10 L -128 -30 L -150 -30 Q -170 -30 -170 -50 L -170 -150 Q -170 -170 -150 -170 Z', { fill: C.fill, sw: 3, stroke: C.soft });
    [-130, -96].forEach((y, i) => bk.line(-140, y, i ? -40 : 4, y, { sw: 5, stroke: C.soft }));
    const fO = sub(intro), fr = sub(fO);
    fr.path('M -20 -60 L 150 -60 Q 170 -60 170 -40 L 170 90 Q 170 110 150 110 L 140 110 L 150 160 L 90 110 L -20 110 Q -40 110 -40 90 L -40 -40 Q -40 -60 -20 -60 Z', { fill: C.fill, sw: 3.4 });
    [26, 66, 106].forEach((x, i) => { const d = sub(fr); d.circle(x, 25, 13, { fill: C.ink, sw: 1.4 });
      on(d, p, .9 + i * .14, { loop: 1.3, y: [[0, 0], [.18, -16, 'out'], [.4, 0, 'in']], o: [[0, .5], [.18, 1], [.5, .5]] }); });
    on(bk, p, .9, { loop: 2.6, ox: -140, oy: 10, s: [[0, 1], [.1, 1.05, 'out'], [.3, 1, 'soft']] });
    on(fr, p, .9, { loop: 2.6, ox: 150, oy: 160, s: [[0, 1], [1.3, 1], [1.4, .95, 'out'], [1.55, 1.05, 'out'], [1.75, 1, 'soft']] });
    on(bO, p, 0, { ox: -140, oy: 10, s: [[0, .3], [.3, 1.1, 'out'], [.45, 1]], o: [[0, 0], [.1, 1]] });
    on(fO, p, .3, { ox: 150, oy: 160, s: [[0, .3], [.3, 1.1, 'out'], [.45, 1]], o: [[0, 0], [.1, 1]] });
  });

  /* microphone (shared by mic / mic-off) */
  const micBody = q => {
    q.rect(-56, -172, 112, 192, { rx: 56, fill: C.fill, sw: 3.4 });
    [-128, -100, -72, -44].forEach(y => q.line(-38, y, 38, y, { sw: 2, stroke: C.soft }));
    q.path('M -98 -46 L -98 -14 A 98 98 0 0 0 98 -14 L 98 -46', { sw: 5 });
    q.line(0, 84, 0, 140, { sw: 5 }); q.rect(-62, 138, 124, 22, { rx: 8, fill: C.fill, sw: 3 });
  };
  /* mic — sound waves pulse out on both sides while the mic gives a small bob on each beat */
  rig('mic-pro', .6, 'pop', p => {
    const intro = sub(p);
    [-1, 1].forEach(sd => [126, 160].forEach((r, i) => { const w = sub(intro); w.path(arc(0, -76, r, sd > 0 ? -32 : 212, sd > 0 ? 32 : 148), { sw: 4 - i, stroke: i ? C.soft : C.ink });
      on(w, p, .7, { loop: .9, ox: 0, oy: -76, o: [[0, 0], [.06 + i * .1, 0], [.1 + i * .1, 1], [.6, 0]], s: [[0, .92], [.6, 1.06, 'out']] }); }));
    const mc = sub(intro); micBody(mc);
    on(mc, p, .7, { loop: .9, ox: 0, oy: 160, y: [[0, 0], [.08, 4, 'out'], [.35, 0, 'soft']] });
    pop(p, intro);
  });
  /* mic-off — the mic under a slash: it tries to pick up sound, short waves start and get cut off, it stays dim (slash never leaves) */
  rig('mic-off-pro', .6, 'pop', p => {
    const intro = sub(p);
    [-1, 1].forEach(sd => { const w = sub(intro); w.path(arc(0, -76, 126, sd > 0 ? -30 : 210, sd > 0 ? 30 : 150), { sw: 3.4, stroke: C.soft });
      on(w, p, .7, { loop: 2.4, ox: 0, oy: -76, o: [[0, 0], [1, 0], [1.05, .8], [1.3, .8], [1.4, 0]], s: [[0, .9], [1, .9], [1.3, 1.04, 'out'], [1.4, .85, 'in']] }); });
    const mc = sub(intro); micBody(mc);
    on(mc, p, .7, { loop: 2.4, o: [[0, .6], [.95, .6], [1.05, 1], [1.35, 1], [1.6, .6]], r: [[0, 0], [1, 0], ...at(shakeKeys(5, 2, .05).slice(1), 1)] });
    const sl = sub(intro); slash(sl, -150, -160, 150, 150);
    on(sl, p, .7, { loop: 2.4, s: [[0, 1], [1.35, 1], [1.45, 1.06, 'out'], [1.7, 1, 'soft']] });
    pop(p, intro);
  });

  /* music — beamed eighth notes bounce on the beat and rock side to side; little single notes drift up and fade */
  rig('music-pro', .6, 'pop', p => {
    const intro = sub(p);
    [[-150, 0], [158, .8]].forEach(([x, d]) => { const n = sub(intro); n.path(`M ${x} 40 L ${x} -14 Q ${x + 18} -4 ${x + 24} 16`, { sw: 3.4, stroke: C.soft }); n.ellipse(x - 10, 42, 13, 9, { fill: C.soft, stroke: C.soft, sw: 1 });
      on(n, p, .7 + d, { loop: 1.6, y: [[0, 30], [1.6, -90, 'out']], x: [[0, 0], [.8, 10, 'soft'], [1.6, -6, 'soft']], o: [[0, 0], [.2, 1], [1.2, 1], [1.6, 0]] }); });
    const mu = sub(intro);
    mu.line(-58, 104, -58, -104, { sw: 5 }); mu.line(118, 76, 118, -134, { sw: 5 });
    mu.shape([[-58, -104], [118, -134], [118, -96], [-58, -66]], { fill: C.fill, sw: 3.4 });
    mu.line(-58, -50, 118, -80, { sw: 2.4, stroke: C.soft });
    [[-88, 110], [88, 82]].forEach(([x, y]) => mu.child({ transform: `rotate(-20 ${x} ${y})` }).ellipse(x, y, 36, 26, { fill: C.fill, sw: 3.4 }));
    on(mu, p, .7, { loop: 1.6, ox: 0, oy: 130, y: [[0, 0], [.1, -16, 'out'], [.4, 0, 'in'], [.8, 0], [.9, -16, 'out'], [1.2, 0, 'in']], r: [[0, 0], [.4, 5, 'soft'], [.8, 0, 'soft'], [1.2, -5, 'soft'], [1.6, 0, 'soft']] });
    pop(p, intro);
  });

  /* newspaper — tossed in with a spin; the headline and columns print line by line, hold, and refresh */
  rig('newspaper-pro', .7, 'pop', p => {
    const intro = sub(p);
    intro.path('M -120 -100 L -152 -100 Q -170 -100 -170 -82 L -170 130 Q -170 150 -150 150 L -120 150', { fill: C.fill, sw: 3 }); intro.line(-146, -70, -146, 120, { sw: 2, stroke: C.soft });
    intro.rect(-120, -152, 270, 302, { rx: 12, fill: C.fill, sw: 3.4 });
    const hl = intro.line(-90, -114, 120, -114, { sw: 11 });
    intro.rect(-90, -84, 96, 86, { rx: 5, fill: C.fill, sw: 2.6 }); intro.path('M -78 -12 L -50 -50 L -30 -26 L -16 -40 L -4 -12', { sw: 2, stroke: C.soft });
    const lines = [[26, -74, 120], [26, -48, 120], [26, -22, 96], [-90, 32, 120], [-90, 62, 120], [-90, 92, 120], [-90, 122, 40]].map(([x, y, x2]) => intro.line(x, y, x2, y, { sw: 5, stroke: C.soft }));
    on(hl, p, .7, { loop: 3.2, draw: [[0, 1], [2.4, 1], [2.5, 0, 'in'], [2.6, 0], [2.85, 1, 'out']] });
    lines.forEach((l, i) => on(l, p, .7, { loop: 3.2, draw: [[0, 1], [2.4, 1], [2.5, 0, 'in'], [2.75 + i * .06, 0], [2.9 + i * .04, 1, 'out'], [3.2, 1]] }));
    on(intro, p, 0, { s: [[0, .4], [.45, 1.06, 'out'], [.62, 1]], r: [[0, -36], [.5, 3, 'out'], [.65, 0, 'soft']], x: [[0, -120], [.5, 0, 'out']], o: [[0, 0], [.15, 1]] });
  });

  /* pause — two bars squeeze together (anticipation) and spring apart, then breathe in turn */
  rig('pause-pro', .6, 'pop', p => {
    const intro = sub(p);
    [-1, 1].forEach((sd, i) => { const b = sub(intro); b.rect(sd > 0 ? 26 : -86, -122, 60, 244, { rx: 18, fill: C.fill, sw: 3.4 });
      on(b, p, .7, { loop: 2, ox: sd * 56, oy: 0, x: [[0, 0], [.15, -sd * 10, 'out'], [.35, sd * 6, 'out'], [.55, 0, 'soft']], sy: [[0, 1], [.15, .94, 'out'], [.35, 1.04], [.55, 1, 'soft'], [1 + i * .3, 1], [1.2 + i * .3, 1.05, 'soft'], [1.45 + i * .3, 1, 'soft']] }); });
    pop(p, intro);
  });

  /* play — the triangle presses in (squash), pushes forward with an echo, settles */
  const TRI = 'M -70 -122 Q -70 -150 -46 -136 L 122 -20 Q 144 0 122 20 L -46 136 Q -70 150 -70 122 Z';
  rig('play-pro', .6, 'pop', p => {
    const intro = sub(p);
    const ec = sub(intro); ec.path(TRI, { sw: 2.4, stroke: C.soft });
    on(ec, p, .7, { loop: 1.8, ox: 20, oy: 0, s: [[0, 1], [.3, 1], [.9, 1.35, 'out']], o: [[0, 0], [.3, 0], [.32, .8], [.9, 0]] });
    const tr = sub(intro); tr.path(TRI, { fill: C.fill, sw: 3.6 });
    on(tr, p, .7, { loop: 1.8, ox: 20, oy: 0, x: [[0, 0], [.15, -8, 'out'], [.35, 12, 'out'], [.7, 0, 'soft']], s: [[0, 1], [.15, .92, 'out'], [.35, 1.05], [.7, 1, 'soft']] });
    pop(p, intro);
  });

  /* radio — a broadcast point: the centre pulses and the waves light up ring by ring, outward */
  rig('radio-pro', .6, 'pop', p => {
    const intro = sub(p);
    [[70, 0], [118, 1], [166, 2]].forEach(([r, i]) => [-1, 1].forEach(sd => { const w = sub(intro); w.path(arc(0, 0, r, sd > 0 ? -38 : 218, sd > 0 ? 38 : 142), { sw: 8 - i * 1.5 });
      on(w, p, .7, { loop: 1.6, o: [[0, .35], [.1 + i * .15, .35], [.16 + i * .15, 1], [.6 + i * .15, .35]], ox: 0, oy: 0, s: [[0, 1], [.1 + i * .15, 1], [.2 + i * .15, 1.05, 'out'], [.5 + i * .15, 1, 'soft']] }); }));
    const c = sub(intro); c.circle(0, 0, 24, { fill: C.ink, sw: 2 });
    on(c, p, .7, { loop: 1.6, s: [[0, 1], [.08, 1.3, 'out'], [.3, 1, 'soft']] });
    pop(p, intro);
  });

  /* tv — antennas wobble (follow-through), the knob turns, the screen flashes static, a scan line rolls down the picture */
  rig('tv-pro', .6, 'pop', p => {
    const intro = sub(p);
    const an = sub(intro); [[-1, -64], [1, 64]].forEach(([sd, x]) => { an.line(0, -112, x, -172, { sw: 3.4 }); an.circle(x, -176, 7, { fill: C.fill, sw: 2.6 }); });
    on(an, p, .7, { loop: 2.6, ox: 0, oy: -112, r: [[0, 0], [1, 0], [1.1, -9, 'out'], [1.25, 7], [1.4, -4], [1.55, 2], [1.7, 0, 'soft']] });
    const bd = sub(intro); bd.rect(-172, -112, 344, 234, { rx: 20, fill: C.fill, sw: 3.4 });
    [-1, 1].forEach(sd => bd.line(sd * 110, 122, sd * 130, 152, { sw: 5 }));
    bd.rect(-150, -90, 238, 190, { rx: 14, fill: C.fill, sw: 3 });
    const sc = sub(bd, { 'clip-path': clip(bd, 'M -146 -86 L 84 -86 L 84 96 L -146 96 Z') });
    const st = sub(sc); st.rect(-150, -90, 238, 190, { fill: C.soft, stroke: C.soft, sw: 1 });
    on(st, p, .7, { loop: 2.6, o: [[0, 0], [1, 0], [1.02, .7], [1.06, .2], [1.1, .6], [1.16, 0]] });
    const sl = sub(sc); sl.line(-150, -96, 88, -96, { sw: 3, stroke: C.soft });
    on(sl, p, .7, { loop: 1.3, y: [[0, 0], [1.3, 200, 'lin']], o: [[0, 0], [.1, .8], [1.2, .8], [1.3, 0]] });
    const kn = sub(bd); kn.circle(128, -46, 16, { fill: C.fill, sw: 2.8 }); kn.line(128, -46, 128, -60, { sw: 3 });
    on(kn, p, .7, { loop: 2.6, ox: 128, oy: -46, r: [[0, 0], [.85, 0], [1, 100, 'out'], [1.1, 90, 'soft'], [2.6, 90]] });
    bd.circle(128, 0, 10, { fill: C.fill, sw: 2.4 }); [40, 58, 76].forEach(y => bd.line(112, y, 144, y, { sw: 2, stroke: C.soft }));
    pop(p, intro);
  });

  /* archive — the lid lifts (hinged), a document drops into the box, the lid slams shut with a squash */
  rig('archive-pro', .7, 'squash', p => {
    const intro = sub(p), aO = sub(intro), ar = sub(aO);
    const dc = sub(ar); dc.rect(-58, -150, 116, 130, { rx: 6, fill: C.fill, sw: 2.8 }); [-118, -90, -62].forEach((y, i) => dc.line(-38, y, i === 2 ? 10 : 38, y, { sw: 3, stroke: C.soft }));
    on(dc, p, .7, { loop: 2.8, y: [[0, -60], [.45, -60], [.85, 60, 'in'], [2.6, 60], [2.61, -60, 'lin']], o: [[0, 0], [.42, 0], [.48, 1], [1.2, 1], [1.25, 0], [2.8, 0]] });
    const bx = sub(ar); bx.path('M -152 -72 L 152 -72 L 152 140 Q 152 160 132 160 L -132 160 Q -152 160 -152 140 Z', { fill: C.fill, sw: 3.4 });
    bx.rect(-42, -34, 84, 24, { rx: 12, fill: C.fill, sw: 3 }); bx.line(-152, 112, 152, 112, { sw: 2, stroke: C.soft });
    const ld = sub(ar); ld.rect(-172, -132, 344, 62, { rx: 10, fill: C.fill, sw: 3.4 });
    on(ld, p, .7, { loop: 2.8, ox: -172, oy: -70, r: [[0, 0], [.15, 0], [.25, 2, 'out'], [.5, -24, 'out'], [.95, -24], [1.12, 0, 'in'], [1.18, -2], [1.26, 0, 'soft']] });
    on(bx, p, .7, { loop: 2.8, ox: 0, oy: 160, sy: [[0, 1], [1.12, 1], [1.17, .95, 'out'], [1.32, 1, 'soft']] });
    thud(p, aO, 160);
  });

  /* file-question — a page with a folded corner; the "?" tilts back and forth as if wondering, its dot bounces a beat later */
  rig('file-question-pro', .6, 'pop', p => {
    const intro = sub(p), dc = sub(intro);
    dc.path('M -120 -172 L 62 -172 L 142 -92 L 142 152 Q 142 172 122 172 L -120 172 Q -140 172 -140 152 L -140 -152 Q -140 -172 -120 -172 Z', { fill: C.fill, sw: 3.4 });
    dc.path('M 62 -172 L 62 -112 Q 62 -92 82 -92 L 142 -92', { sw: 3 });
    const qm = sub(dc); qm.path('M -46 -26 C -46 -84, 48 -84, 48 -30 C 48 4, 0 8, 0 44', { sw: 11 });
    const dt = sub(dc); dt.circle(0, 90, 11, { fill: C.ink, sw: 2 });
    on(qm, p, .7, { loop: 2.6, ox: 0, oy: 44, r: [[0, 0], [.4, -12, 'io'], [1, 10, 'io'], [1.5, 0, 'io']], y: [[0, 0], [1.6, 0], [1.75, -10, 'out'], [1.95, 0, 'in']] });
    on(dt, p, .7, { loop: 2.6, ox: 0, oy: 101, y: [[0, 0], [1.7, 0], [1.85, -16, 'out'], [2.05, 0, 'in'], [2.12, -4], [2.2, 0]], sy: [[0, 1], [2.05, 1], [2.09, .8, 'out'], [2.2, 1]] });
    on(dc, p, .7, { loop: 2.6, ox: 0, oy: 172, r: [[0, 0], [1.6, 0], [1.7, -1.2, 'out'], [1.9, 1], [2.1, 0, 'soft']] });
    pop(p, intro);
  });

  /* folder — the front flap tips open, the papers inside rise to peek out, then it closes with a small bump */
  const FOLDER_BACK = 'M -170 -112 Q -170 -132 -150 -132 L -62 -132 L -38 -106 L 150 -106 Q 170 -106 170 -86 L 170 130 Q 170 150 150 150 L -150 150 Q -170 150 -170 130 Z';
  rig('folder-pro', .7, 'squash', p => {
    const intro = sub(p), fO = sub(intro), f = sub(fO);
    f.path(FOLDER_BACK, { fill: C.fill, sw: 3.4 });
    const pp = sub(f); pp.rect(-132, -116, 250, 160, { rx: 6, fill: C.fill, sw: 2.6, stroke: C.soft }); [-92, -66].forEach((y, i) => pp.line(-110, y, i ? 40 : 90, y, { sw: 3, stroke: C.soft }));
    on(pp, p, .7, { loop: 2.6, y: [[0, 20], [.45, 20], [.8, -22, 'out'], [1.4, -22], [1.62, 20, 'in']] });
    const fr = sub(f); fr.rect(-170, -64, 340, 214, { rx: 18, fill: C.fill, sw: 3.4 }); fr.line(-150, -40, 150, -40, { sw: 2, stroke: C.soft });
    on(fr, p, .7, { loop: 2.6, ox: 0, oy: 150, sy: [[0, 1], [.4, 1], [.65, .8, 'out'], [1.4, .8], [1.62, 1, 'in'], [1.68, .97], [1.78, 1, 'soft']] });
    thud(p, fO, 150);
  });

  /* folder-open — an open folder: the papers poking out flutter up and settle, the front panel bounces */
  rig('folder-open-pro', .7, 'squash', p => {
    const intro = sub(p), fO = sub(intro), f = sub(fO);
    f.path('M -170 -112 Q -170 -132 -150 -132 L -62 -132 L -38 -106 L 130 -106 Q 150 -106 150 -86 L 150 -20 L -170 -20 Z', { fill: C.fill, sw: 3.4 });
    [[-100, -150, -4, 0], [-50, -164, 5, .12]].forEach(([x, y, a, d]) => { const s = sub(f), q = s.child({ transform: `rotate(${a} ${x + 100} 0)` }); q.rect(x, y, 200, 170, { rx: 6, fill: C.fill, sw: 2.6, stroke: C.soft }); [y + 30, y + 56].forEach((yy, i) => q.line(x + 22, yy, x + (i ? 120 : 170), yy, { sw: 3, stroke: C.soft }));
      on(s, p, .7 + d, { loop: 2.4, ox: x + 100, oy: 0, y: [[0, 0], [.2, 0], [.45, -24, 'out'], [.75, 0, 'in'], [.85, -5], [.95, 0]], r: [[0, 0], [.45, d ? 4 : -4, 'out'], [.95, 0, 'soft']] }); });
    const fr = sub(f); fr.path('M -146 -20 L 172 -20 Q 192 -20 188 0 L 160 136 Q 156 152 136 152 L -170 152 Q -190 152 -186 132 L -164 -4 Q -160 -20 -146 -20 Z', { fill: C.fill, sw: 3.4 });
    on(fr, p, .7, { loop: 2.4, ox: 0, oy: 152, sy: [[0, 1], [.2, 1], [.3, .95, 'out'], [.45, 1.03], [.6, 1, 'soft']] });
    thud(p, fO, 152);
  });

  /* inbox — an envelope drops into the tray, the tray dips under it, a count badge pops */
  rig('inbox-pro', .7, 'squash', p => {
    const intro = sub(p), iO = sub(intro), ib = sub(iO);
    const ev = sub(ib); ev.rect(-74, -168, 148, 96, { rx: 8, fill: C.fill, sw: 3 }); ev.path('M -70 -164 L 0 -112 L 70 -164', { sw: 2.6 });
    on(ev, p, .7, { loop: 2.6, y: [[0, -40], [.2, -40], [.55, 90, 'in'], [2.4, 90], [2.41, -40, 'lin']], o: [[0, 0], [.2, 0], [.26, 1], [.5, 1], [.58, 0], [2.6, 0]] });
    const tr = sub(ib);
    tr.path('M -122 -120 L 122 -120 L 170 18 L 170 130 Q 170 150 150 150 L -150 150 Q -170 150 -170 130 L -170 18 Z', { fill: C.fill, sw: 3.4 });
    tr.path('M -170 18 L -72 18 L -42 62 L 42 62 L 72 18 L 170 18', { sw: 3.2 }); tr.line(-150, 120, 150, 120, { sw: 2, stroke: C.soft });
    on(tr, p, .7, { loop: 2.6, ox: 0, oy: 150, y: [[0, 0], [.55, 0], [.62, 8, 'out'], [.8, 0, 'soft']], sy: [[0, 1], [.55, 1], [.62, .95, 'out'], [.8, 1, 'soft']] });
    const bO = sub(ib), bg = sub(bO); bg.circle(146, -112, 28, { fill: C.fill, sw: 3.2 }); bg.text('1', 146, -101, { size: 32, at: 0, dur: .01 });
    on(bg, p, .7, { loop: 2.6, ox: 146, oy: -112, s: [[0, 1], [.6, 1], [.68, 1.25, 'out'], [.9, 1, 'soft']] });
    on(bO, p, .5, { ox: 146, oy: -112, s: [[0, 0], [.3, 1, 'back']] });
    thud(p, iO, 150);
  });

  /* kanban — a card is picked up from the first column (lift + grow), carried across in an arc and dropped into the last one */
  rig('kanban-pro', .6, 'pop', p => {
    const intro = sub(p);
    intro.rect(-172, -152, 344, 304, { rx: 18, fill: C.fill, sw: 3.4 }); intro.line(-172, -108, 172, -108, { sw: 2.4 });
    [-57, 57].forEach(x => intro.line(x, -108, x, 152, { sw: 2, stroke: C.soft }));
    [-114, 0, 114].forEach(x => intro.dot(x, -130, 6));
    const card = (q, x, y) => { q.rect(x - 42, y - 22, 84, 44, { rx: 7, fill: C.fill, sw: 2.6 }); q.line(x - 28, y - 4, x + 20, y - 4, { sw: 2.4, stroke: C.soft }); q.line(x - 28, y + 8, x + 6, y + 8, { sw: 2.4, stroke: C.soft }); };
    [[-114, -74], [-114, -22], [0, -74], [0, -22], [0, 30], [114, -74]].forEach(([x, y]) => card(intro, x, y));
    const mv = sub(intro); card(mv, -114, 30);
    on(mv, p, .7, { loop: 3, ox: -114, oy: 30, x: [[0, 0], [.3, 0], [1.2, 228, 'io'], [2.6, 228], [2.61, 0, 'lin']], y: [[0, 0], [.3, 0], [.45, -14, 'out'], [.75, -84, 'io'], [1.2, -52, 'io'], [2.6, -52], [2.61, 0, 'lin']],
      s: [[0, 1], [.3, 1], [.45, 1.12, 'out'], [1.1, 1.12], [1.24, .94, 'out'], [1.4, 1, 'soft']], r: [[0, 0], [.3, 0], [.6, -6, 'out'], [1.1, 4, 'io'], [1.3, 0, 'soft']], o: [[0, 1], [2.3, 1], [2.5, 0], [2.65, 0], [2.85, 1]] });
    pop(p, intro);
  });

  /* keyboard — keys get typed in a quick rhythm: each pressed key dips and lights; the cable sways */
  rig('keyboard-pro', .6, 'pop', p => {
    const intro = sub(p);
    const cb = sub(intro); cb.path('M 0 -88 C 0 -130, 70 -126, 70 -176', { sw: 4.4 });
    on(cb, p, .7, { loop: 3, ox: 0, oy: -88, r: [[0, 0], [1.5, 4, 'soft'], [3, 0, 'soft']] });
    intro.rect(-182, -92, 364, 196, { rx: 18, fill: C.fill, sw: 3.4 });
    const keys = [];
    [[-66, 0], [-30, 16], [6, 0]].forEach(([y, off]) => { for (let i = 0; i < 9; i++) { const x = -160 + off + i * 36; if (x + 28 > 162) continue; const k = sub(intro); k.rect(x, y, 28, 26, { rx: 5, fill: C.fill, sw: 2.2 });
      const lt = sub(k); lt.rect(x + 5, y + 5, 18, 16, { rx: 3, fill: C.soft, stroke: C.soft, sw: 1 }); keys.push([k, lt, x + 14, y + 13]); } });
    const sp = sub(intro); sp.rect(-92, 44, 184, 30, { rx: 8, fill: C.fill, sw: 2.6 }); keys.push([sp, null, 0, 59]);
    const seq = [3, 12, 7, 20, 15, 26, 1, 10, 26, 18], hits = new Map();
    seq.forEach((ki, j) => { const k = ki % keys.length; if (!hits.has(k)) hits.set(k, []); hits.get(k).push(.15 + j * .22); });
    hits.forEach((ts, ki) => { const [k, lt, x, y] = keys[ki], sk = [[0, 1]], ok = [[0, 0]];
      ts.forEach(t => { sk.push([t, 1], [t + .04, .86, 'out'], [t + .16, 1, 'soft']); ok.push([t, 0], [t + .02, 1], [t + .3, 0]); });
      on(k, p, .7, { loop: 3, ox: x, oy: y, s: sk }); if (lt) on(lt, p, .7, { loop: 3, o: ok }); });
    keys.forEach(([k, lt], ki) => { if (lt && !hits.has(ki)) on(lt, p, 0, { o: [[0, 0]] }); });
    pop(p, intro);
  });

  Object.assign(G.icons, R);
  const names = ['bell-ring', 'camera', 'clapperboard', 'film', 'messages-square', 'mic', 'mic-off', 'music', 'newspaper', 'pause',
    'play', 'radio', 'tv', 'archive', 'file-question', 'folder', 'folder-open', 'inbox', 'kanban', 'keyboard'];
  const ALIAS = Object.fromEntries(names.map(n => [n, n + '-pro'])); Object.assign(ALIAS, { microphone: 'mic-pro', broadcast: 'radio-pro' });
  for (const [a, pro] of Object.entries(ALIAS)) { if (G.icons[a] && !G.icons[a + '-basic'] && !G.icons[a].custom) G.icons[a + '-basic'] = G.icons[a]; G.icons[a] = R[pro]; }
  G.PRO11 = names.map(n => n + '-pro');
})();
