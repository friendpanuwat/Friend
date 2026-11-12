/* pro12.js — pro icon batch 12: CutPack priority-3 names 41–60 (study / work tools, games, art; hand-metal skipped = body part).
   Detail level = pro.js (one soft inner outline, bands, ticks, pips — only what the object really has), style.md §0 rules.
   Motion = anticipation, overshoot + settle, follow-through, secondary motion. Entrance and loop sit on separate groups. */
(function () {
  const G = window.GL, C = G.C, P = G.parts;
  const sub = (p, attrs) => p.child(attrs || {});
  const on = (q, p, start, spec) => G.kf(q.g || q, p.t0 + start * p.ts, spec);
  const pop = (p, q, at = 0, from = .4) => on(q, p, at, { s: [[0, from], [.42, 1.08, 'out'], [.62, 1]], o: [[0, 0], [.16, 1]] });
  const drop = (p, q, at = 0, dy = -90) => on(q, p, at, { y: [[0, dy], [.55, 0, 'back']], o: [[0, 0], [.2, 1]] });
  const thud = (p, q, oy, dy = -220) => on(q, p, 0, { ox: 0, oy, y: [[0, dy], [.42, 0, 'in']], sy: [[.42, .86], [.56, 1.06, 'out'], [.7, 1]], sx: [[.42, 1.1], [.56, .97, 'out'], [.7, 1]], o: [[0, 0], [.1, 1]] });
  const grow = (p, q, at, oy) => on(q, p, at, { ox: 0, oy, sy: [[0, 0], [.45, 1.05, 'out'], [.6, 1]], o: [[0, 0], [.05, 1]] });
  const show = (p, q) => on(q, p, 0, { o: [[0, 0], [.01, 1]] });
  const flash = (a, b) => [[0, 0], [a, 0], [a + .02, 1], [b, 0]];
  const shakeKeys = (n, amp, step = .05) => { const k = [[0, 0]]; for (let i = 1; i <= n; i++) k.push([i * step, i % 2 ? -amp : amp, 'lin']); k.push([(n + 1) * step, 0, 'out']); return k; };
  const at = (keys, t0) => keys.map(([t, v, e]) => [t + t0, v, e]);
  const tubes = (q, ds, w = 30) => { ds.forEach(d => q.path(d, { sw: w })); ds.forEach(d => q.path(d, { sw: w - 7, stroke: C.fill })); };
  const f1 = v => +v.toFixed(1), rad = d => d * Math.PI / 180;
  let clipN = 0;
  const clip = (q, d) => { const NS = 'http://www.w3.org/2000/svg', id = 'gl12clip' + (++clipN), cp = document.createElementNS(NS, 'clipPath'), pt = document.createElementNS(NS, 'path');
    cp.setAttribute('id', id); pt.setAttribute('d', d); cp.appendChild(pt); q.g.appendChild(cp); return `url(#${id})`; };
  const slash = (q, x1, y1, x2, y2) => { q.line(x1, y1, x2, y2, { sw: 22, stroke: C.fill }); q.line(x1, y1, x2, y2, { sw: 6 }); };
  /* follow a drawn path with a tool: returns x/y keyframes (t from t0 over T) sampled along the path's real geometry */
  const follow = (el, t0, T, n = 28) => { const L = el.getTotalLength(), xs = [], ys = []; for (let i = 0; i <= n; i++) { const pt = el.getPointAtLength(L * i / n), t = +(t0 + T * i / n).toFixed(3); xs.push([t, f1(pt.x), 'lin']); ys.push([t, f1(pt.y), 'lin']); } return [xs, ys]; };
  const R = {}, rig = (name, dur, exit, fn) => { fn.custom = true; fn.dur = dur; fn.exit = exit; R[name] = fn; };

  /* laptop — the lid swings open on its hinge (overshoot), a window pops up on the screen and its lines type in, then it clears */
  rig('laptop-pro', .8, 'squash', p => {
    const intro = sub(p); show(p, intro);
    const bO = sub(intro); bO.path('M -184 48 L 184 48 L 170 90 Q 166 100 152 100 L -152 100 Q -166 100 -170 90 Z', { fill: C.fill, sw: 3.4 }); bO.path('M -34 48 L -26 60 L 26 60 L 34 48', { sw: 2.4, stroke: C.soft });
    on(bO, p, 0, { y: [[0, 60], [.4, 0, 'out']], o: [[0, 0], [.1, 1]] });
    const lO = sub(intro), ld = sub(lO);
    ld.rect(-142, -156, 284, 200, { rx: 14, fill: C.fill, sw: 3.4 }); ld.rect(-122, -136, 244, 160, { rx: 6, fill: C.fill, sw: 2.2, stroke: C.soft }); ld.dot(0, -146, 3.2);
    const sc = sub(ld, { 'clip-path': clip(ld, 'M -120 -134 L 120 -134 L 120 22 L -120 22 Z') }), wn = sub(sc);
    wn.rect(-92, -114, 184, 118, { rx: 6, fill: C.fill, sw: 2.6 }); wn.line(-92, -94, 92, -94, { sw: 2.2 }); [-104, -104].forEach((y, i) => wn.dot(-80 + i * 12, y, 3));
    const lines = [[-76, -70, 60], [-76, -46, 76], [-76, -22, 30]].map(([x, y, x2]) => wn.line(x, y, x2, y, { sw: 5, stroke: C.soft }));
    on(wn, p, 1, { loop: 3, ox: 0, oy: -55, s: [[0, .6], [.15, .6], [.35, 1.04, 'out'], [.5, 1], [2.5, 1], [2.7, .9, 'in']], o: [[0, 0], [.15, 0], [.2, 1], [2.55, 1], [2.7, 0]] });
    lines.forEach((l, i) => on(l, p, 1, { loop: 3, draw: [[0, 0], [.55 + i * .3, 0], [.85 + i * .3, 1, 'out'], [3, 1]] }));
    const cu = sub(wn); cu.line(40, -32, 40, -12, { sw: 3 }); on(cu, p, 1, { loop: .6, o: [[0, 1], [.3, 1], [.31, 0], [.6, 0]] });
    on(lO, p, .25, { ox: 0, oy: 44, sy: [[0, .04], [.45, 1.06, 'out'], [.6, .98], [.72, 1, 'soft']], o: [[0, 0], [.02, 1]] });
  });

  /* library — books on a shelf: the middle one is pulled up and pushed back, the leaning one wobbles from the bump */
  rig('library-pro', .8, 'pop', p => {
    const intro = sub(p); show(p, intro);
    const sh = intro.line(-184, 152, 184, 152, { sw: 4 }); on(sh, p, 0, { draw: [[0, 0], [.35, 1, 'out']] });
    const book = (q, x, w, top, band) => { q.rect(x, top, w, 152 - top, { rx: 6, fill: C.fill, sw: 3 }); q.line(x + 6, top + 22, x + w - 6, top + 22, { sw: 2, stroke: C.soft }); q.line(x + 6, 128, x + w - 6, 128, { sw: 2, stroke: C.soft }); if (band) q.rect(x + 8, top + 50, w - 16, 34, { rx: 4, sw: 2, stroke: C.soft }); };
    const B = [[-170, 50, -96, 1], [-114, 60, -150, 1], [-48, 44, -72, 0]];
    B.forEach(([x, w, top, band], i) => { const o = sub(intro), b = sub(o); book(b, x, w, top, band);
      if (i === 1) on(b, p, .9, { loop: 2.8, ox: x + w / 2, oy: 152, y: [[0, 0], [.4, 0], [.5, 4, 'out'], [.85, -54, 'out'], [1.5, -54], [1.8, 0, 'in'], [1.86, 3], [1.94, 0]], r: [[0, 0], [.85, -3, 'out'], [1.5, -3], [1.8, 0, 'in']] });
      on(o, p, .1 + i * .1, { y: [[0, -160], [.45, 0, 'in']], o: [[0, 0], [.05, 1]] }); });
    const lO = sub(intro), lb = sub(lO), q = lb.child({ transform: 'rotate(16 10 152)' }); book(q, 10, 48, -110, 1);
    on(lb, p, .9, { loop: 2.8, ox: 10, oy: 152, r: [[0, 0], [1.8, 0], [1.88, 6, 'out'], [2, -4, 'io'], [2.12, 2], [2.24, 0, 'soft']] });
    on(lO, p, .4, { ox: 10, oy: 152, r: [[0, 40], [.45, 0, 'out'], [.55, 3], [.65, 0, 'soft']], o: [[0, 0], [.05, 1]] });
  });

  /* list-checks — the ticks redraw row by row with a little bounce, each row brightening as it is ticked */
  rig('list-checks-pro', .6, 'pop', p => {
    const intro = sub(p);
    [[-96, 1], [0, 0], [96, 1]].forEach(([y, ck], i) => {
      const ln = intro.line(-40, y, 172, y, { sw: 8, stroke: ck ? C.ink : C.soft });
      if (!ck) { intro.circle(-128, y, 9, { fill: C.soft, stroke: C.soft, sw: 1 }); return; }
      const tO = sub(intro), tk = tO.poly([[-176, y - 4], [-150, y + 22], [-98, y - 30]], { sw: 10 }), t = i ? 1.05 : .4;
      on(tk, p, .7, { loop: 2.8, draw: [[0, 1], [t - .3, 1], [t - .15, 0, 'in'], [t, 0], [t + .25, 1, 'out'], [2.8, 1]] });
      on(tO, p, .7, { loop: 2.8, ox: -137, oy: y, s: [[0, 1], [t + .2, 1], [t + .28, 1.18, 'out'], [t + .45, 1, 'soft']] });
      on(ln, p, .7, { loop: 2.8, o: [[0, 1], [t - .15, 1], [t, .35], [t + .28, 1]] }); });
    pop(p, intro);
  });

  /* list-ordered — the numbered list sorts itself: rows 2 and 3 swap places in arcs (longest first), then swap back */
  rig('list-ordered-pro', .6, 'pop', p => {
    const intro = sub(p);
    [['1', -92], ['2', 4], ['3', 100]].forEach(([n, y]) => intro.text(n, -146, y + 22, { size: 64, weight: 800 }));
    intro.line(-48, -92, 172, -92, { sw: 8 });
    const a = intro.line(-48, 4, 82, 4, { sw: 8, stroke: C.soft }), b = intro.line(-48, 100, 150, 100, { sw: 8, stroke: C.soft });
    const swp = (el, dy, sd) => on(el, p, .7, { loop: 3.2, y: [[0, 0], [.4, 0], [1, dy, 'io'], [2, dy], [2.6, 0, 'io']], x: [[0, 0], [.4, 0], [.7, sd * 30, 'out'], [1, 0, 'in'], [2, 0], [2.3, -sd * 30, 'out'], [2.6, 0, 'in']] });
    swp(a, 96, 1); swp(b, -96, -1);
    pop(p, intro);
  });

  /* list-todo — boxes get ticked one at a time (each box squashes as it is checked, its line dims), then the list resets */
  rig('list-todo-pro', .6, 'pop', p => {
    const intro = sub(p);
    [-96, 0, 96].forEach((y, i) => { const bO = sub(intro), bx = sub(bO); bx.rect(-176, y - 28, 56, 56, { rx: 12, fill: C.fill, sw: 3.2 });
      const ln = intro.line(-82, y, i === 2 ? 110 : 172, y, { sw: 8, stroke: C.soft });
      const tk = bx.poly([[-162, y], [-150, y + 13], [-130, y - 12]], { sw: 7 }), t = i * .5;
      on(tk, p, .7, { loop: 3.2, draw: i ? [[0, 0], [t + .3, 0], [t + .5, 1, 'out'], [2.7, 1], [2.85, 0, 'in']] : [[0, 1]] });
      on(bx, p, .7, { loop: 3.2, ox: -148, oy: y, s: i ? [[0, 1], [t + .3, 1], [t + .36, .86, 'out'], [t + .55, 1.06], [t + .7, 1, 'soft']] : [[0, 1]] });
      on(ln, p, .7, { loop: 3.2, o: i ? [[0, 1], [t + .4, 1], [t + .55, .35], [2.7, .35], [2.85, 1]] : [[0, .35]] }); });
    pop(p, intro);
  });

  /* microscope — the focus knob turns, the tube rises and lowers to focus, the stage light blinks */
  rig('microscope-pro', .6, 'pop', p => {
    const intro = sub(p);
    intro.rect(-150, 150, 300, 24, { rx: 10, fill: C.fill, sw: 3.4 });
    tubes(intro, ['M 70 150 L 70 40 Q 70 -36 6 -62'], 30);
    const lt = sub(intro); lt.circle(-46, 112, 13, { fill: C.soft, stroke: C.soft, sw: 1 }); intro.line(-46, 128, -46, 150, { sw: 3 });
    on(lt, p, .7, { loop: 2.6, o: [[0, .3], [.9, .3], [1, 1], [1.8, 1], [1.9, .3]] });
    intro.rect(-130, 64, 190, 18, { rx: 6, fill: C.fill, sw: 3 }); intro.rect(-80, 54, 70, 10, { rx: 3, sw: 2, stroke: C.soft });
    const tb = sub(intro), q = tb.child({ transform: 'rotate(-28 -44 -40)' });
    q.rect(-66, -176, 44, 26, { rx: 6, fill: C.fill, sw: 3 }); q.rect(-62, -150, 36, 130, { rx: 8, fill: C.fill, sw: 3.2 }); q.line(-56, -120, -32, -120, { sw: 2, stroke: C.soft });
    q.rect(-58, -20, 28, 34, { rx: 5, fill: C.fill, sw: 2.8 });
    on(tb, p, .7, { loop: 2.6, y: [[0, 0], [.3, 0], [.7, -10, 'io'], [1, 4, 'io'], [1.2, 0, 'soft']] });
    const kn = sub(intro); kn.circle(70, 8, 24, { fill: C.fill, sw: 3 }); kn.line(70, 8, 70, -12, { sw: 3 });
    on(kn, p, .7, { loop: 2.6, ox: 70, oy: 8, r: [[0, 0], [.3, 0], [.7, 140, 'io'], [1, 100, 'io'], [1.2, 110, 'soft'], [2.6, 110]] });
    pop(p, intro);
  });

  /* monitor — the screen powers on (flash), two windows pop up and fill with lines, the power light blinks */
  rig('monitor-pro', .7, 'pop', p => {
    const intro = sub(p);
    intro.path('M -26 70 L -38 128 L 38 128 L 26 70', { fill: C.fill, sw: 3 }); intro.rect(-96, 124, 192, 24, { rx: 10, fill: C.fill, sw: 3.2 });
    intro.rect(-178, -152, 356, 226, { rx: 16, fill: C.fill, sw: 3.4 }); intro.rect(-158, -132, 316, 176, { rx: 8, fill: C.fill, sw: 2.2, stroke: C.soft });
    const sc = sub(intro, { 'clip-path': clip(intro, 'M -156 -130 L 156 -130 L 156 42 L -156 42 Z') });
    const fl = sub(sc); fl.rect(-160, -134, 320, 180, { fill: C.soft, stroke: C.soft, sw: 1 }); on(fl, p, .7, { loop: 3.2, o: [[0, 0], [.05, .5], [.25, 0]] });
    [[-136, -112, 150, 120, .3], [-6, -76, 140, 104, .6]].forEach(([x, y, w, h, t], i) => { const wn = sub(sc); wn.rect(x, y, w, h, { rx: 6, fill: C.fill, sw: 2.6 }); wn.line(x, y + 18, x + w, y + 18, { sw: 2 });
      const ls = [36, 56, 76].map((dy, k) => wn.line(x + 14, y + dy + 10, x + w - (k === 2 ? 60 : 16), y + dy + 10, { sw: 4, stroke: C.soft }));
      on(wn, p, .7, { loop: 3.2, ox: x + w / 2, oy: y + h / 2, s: [[0, .5], [t, .5], [t + .2, 1.05, 'out'], [t + .32, 1], [2.8, 1], [2.95, .9, 'in']], o: [[0, 0], [t, 0], [t + .05, 1], [2.85, 1], [2.95, 0]] });
      ls.forEach((l, k) => on(l, p, .7, { loop: 3.2, draw: [[0, 0], [t + .3 + k * .15, 0], [t + .55 + k * .15, 1, 'out'], [3.2, 1]] })); });
    const pl = sub(intro); pl.circle(150, 58, 5, { fill: C.ink, sw: 1 }); on(pl, p, .7, { loop: 1.6, o: [[0, 1], [.8, 1], [.82, .3], [1.6, .3]] });
    pop(p, intro);
  });

  /* notebook — spiral-bound: the cover swings open on its spine to show the ruled pages, then closes */
  rig('notebook-pro', .6, 'pop', p => {
    const intro = sub(p);
    intro.rect(-124, -164, 254, 330, { rx: 12, fill: C.fill, sw: 2.6 });
    for (let y = -116; y <= 132; y += 31) intro.line(-104, y, 116, y, { sw: 2, stroke: C.soft });
    intro.line(-80, -150, -80, 150, { sw: 1.8, stroke: C.soft });
    const cv = sub(intro); cv.rect(-140, -172, 260, 342, { rx: 16, fill: C.fill, sw: 3.4 }); cv.rect(-64, -110, 140, 58, { rx: 8, sw: 2.2, stroke: C.soft }); cv.line(-44, -80, 56, -80, { sw: 2 });
    on(cv, p, .7, { loop: 3, ox: -140, oy: 0, sx: [[0, 1], [.3, 1], [.4, 1.02, 'out'], [.8, .55, 'io'], [1.9, .55], [2.3, 1, 'io'], [2.36, .99], [2.45, 1]] });
    for (let y = -148; y <= 148; y += 49) P.capsule(intro, -158, y, -122, y, 8, { sw: 2.6 });
    pop(p, intro);
  });

  /* notebook-pen — a pen writes a line on the open ruled page (following the stroke), moves to the next line, then the page clears */
  rig('notebook-pen-pro', .6, 'pop', p => {
    const intro = sub(p);
    intro.rect(-150, -150, 250, 316, { rx: 14, fill: C.fill, sw: 3.4 });
    for (let y = -96; y <= 132; y += 38) intro.line(-120, y, 76, y, { sw: 2, stroke: C.soft });
    for (let y = -120; y <= 140; y += 52) P.capsule(intro, -168, y, -134, y, 8, { sw: 2.6 });
    const w1 = intro.path('M -110 -62 C -96 -84, -86 -46, -72 -66 C -60 -84, -50 -48, -36 -66 C -24 -82, -14 -50, 0 -66 C 12 -80, 24 -54, 40 -66', { sw: 4.6 });
    const w2 = intro.path('M -110 -24 C -96 -46, -86 -8, -72 -28 C -60 -46, -50 -10, -36 -28 C -24 -44, -14 -12, 0 -28', { sw: 4.6 });
    const [x1, y1] = follow(w1, .2, 1), [x2, y2] = follow(w2, 1.5, .8);
    on(w1, p, .7, { loop: 3.2, draw: [[0, 0], [.2, 0], [1.2, 1, 'lin'], [2.8, 1]], o: [[0, 0], [.2, 0], [.22, 1], [2.8, 1], [3.1, 0]] });
    on(w2, p, .7, { loop: 3.2, draw: [[0, 0], [1.5, 0], [2.3, 1, 'lin'], [2.8, 1]], o: [[0, 0], [1.5, 0], [1.52, 1], [2.8, 1], [3.1, 0]] });
    const pO = sub(intro), pn = sub(pO), pg = pn.child({ transform: 'rotate(36) scale(.7)' }, .7);
    pg.rect(-20, -240, 40, 180, { rx: 12, fill: C.fill, sw: 3.2 }); pg.line(-20, -186, 20, -186, { sw: 2.4 }); pg.path('M -20 -60 L 0 0 L 20 -60 Z', { fill: C.fill, sw: 3 }); pg.dot(0, -10, 4);
    on(pn, p, .7, { loop: 3.2, x: [[0, x1[0][1] + 10], ...x1, [1.35, x1[x1.length - 1][1] + 8, 'out'], ...x2, [2.5, x2[x2.length - 1][1] + 10, 'out'], [3.2, x1[0][1] + 10, 'io']],
      y: [[0, y1[0][1] - 20], ...y1, [1.35, y1[y1.length - 1][1] - 24, 'out'], ...y2, [2.5, y2[y2.length - 1][1] - 20, 'out'], [3.2, y1[0][1] - 20, 'io']] });
    pop(p, pO, .1); pop(p, intro);
  });

  /* pencil — the pencil scribbles a wavy line along the bottom (its tip really follows the line), lifts, and the line fades */
  rig('pencil-pro', .6, 'slide', p => {
    const intro = sub(p);
    const sq = intro.path('M 0 134 C 20 102, 36 158, 56 128 C 74 100, 90 158, 110 128 C 128 102, 142 152, 160 130', { sw: 5 });
    const [xs, ys] = follow(sq, .2, 1.4);
    on(sq, p, .7, { loop: 2.8, draw: [[0, 0], [.2, 0], [1.6, 1, 'lin'], [2.4, 1]], o: [[0, 0], [.2, 0], [.22, 1], [2.4, 1], [2.7, 0]] });
    const pO = sub(intro), pn = sub(pO), pg = pn.child({ transform: 'rotate(45) scale(.8)' }, .8);
    pg.rect(-332, -24, 50, 48, { rx: 12, fill: C.fill, sw: 3 }); pg.rect(-290, -26, 40, 52, { rx: 4, fill: C.fill, sw: 3 }); [-278, -262].forEach(x => pg.line(x, -24, x, 24, { sw: 2.2, stroke: C.soft }));
    pg.rect(-252, -24, 180, 48, { rx: 3, fill: C.fill, sw: 3.2 }); pg.line(-246, 0, -80, 0, { sw: 2, stroke: C.soft });
    pg.path('M -72 -24 L 0 0 L -72 24 Z', { fill: C.fill, sw: 3 }); pg.path('M -24 -8 L 0 0 L -24 8 Z', { fill: C.ink, sw: 1.6 });
    on(pn, p, .7, { loop: 2.8, x: [[0, xs[0][1] + 10], ...xs, [1.9, xs[xs.length - 1][1] + 12, 'out'], [2.8, xs[0][1] + 10, 'io']], y: [[0, ys[0][1] - 26], ...ys, [1.9, ys[ys.length - 1][1] - 30, 'out'], [2.8, ys[0][1] - 26, 'io']],
      r: [[0, 0], [.2, 0], [.6, -3], [1, 3], [1.4, -2], [1.6, 0]] });
    on(pO, p, 0, { x: [[0, -160], [.55, 0, 'out']], o: [[0, 0], [.15, 1]] });
    show(p, intro);
  });

  /* school — a school house with a clock tower: the flag waves, the clock hands tick round, the bell in the tower swings */
  rig('school-pro', .8, 'squash', p => {
    const intro = sub(p), sO = sub(intro), sc = sub(sO);
    const fl = sub(sc); fl.line(0, -142, 0, -196, { sw: 3 }); const fg = sub(fl); fg.path('M 2 -196 C 22 -204, 34 -188, 54 -194 L 54 -170 C 34 -164, 22 -180, 2 -172 Z', { fill: C.fill, sw: 2.6 });
    on(fg, p, .8, { loop: 1.6, ox: 2, oy: -184, ky: [[0, 0], [.4, -8, 'soft'], [.8, 0, 'soft'], [1.2, 8, 'soft'], [1.6, 0, 'soft']], sx: [[0, 1], [.4, .9, 'soft'], [.8, 1, 'soft'], [1.2, .94, 'soft'], [1.6, 1, 'soft']] });
    [-1, 1].forEach(sd => { sc.rect(sd > 0 ? 58 : -176, -8, 118, 178, { rx: 6, fill: C.fill, sw: 3.2 }); sc.path(`M ${sd * 58} -8 L ${sd * 58} -22 L ${sd * 176} -22 L ${sd * 176} -8`, { sw: 2.6 });
      [[-150, 30], [-104, 30], [-150, 100], [-104, 100]].forEach(([x, y]) => sc.rect(sd > 0 ? x + 234 : x, y, 30, 36, { rx: 4, fill: C.fill, sw: 2.4 })); });
    sc.rect(-62, -78, 124, 248, { rx: 6, fill: C.fill, sw: 3.4 }); sc.path('M -78 -76 L 0 -144 L 78 -76 Z', { fill: C.fill, sw: 3.2 });
    const bl = sub(sc); bl.path('M -14 -96 Q -14 -114 0 -114 Q 14 -114 14 -96 L 18 -88 L -18 -88 Z', { fill: C.fill, sw: 2.4 });
    on(bl, p, .8, { loop: 2.4, ox: 0, oy: -114, r: [[0, 0], [1.2, 0], [1.3, -16, 'out'], [1.45, 12], [1.6, -7], [1.75, 3], [1.9, 0, 'soft']] });
    sc.circle(0, -30, 26, { fill: C.fill, sw: 3 }); const hh = sub(sc); hh.line(0, -30, 0, -46, { sw: 3 }); const mh = sub(sc); mh.line(0, -30, 14, -30, { sw: 2.4 });
    on(mh, p, .8, { loop: 2.4, ox: 0, oy: -30, r: [[0, 0], [2.4, 360, 'lin']] }); on(hh, p, .8, { loop: 2.4, ox: 0, oy: -30, r: [[0, 0], [2.4, 30, 'lin']] });
    sc.path('M -28 170 L -28 116 A 28 28 0 0 1 28 116 L 28 170', { fill: C.fill, sw: 3 }); sc.line(0, 92, 0, 170, { sw: 2, stroke: C.soft });
    const gd = intro.line(-186, 171, 186, 171, { sw: 2.6, stroke: C.soft }); on(gd, p, 0, { draw: [[0, 0], [.35, 1, 'out']] });
    grow(p, sO, .05, 170);
  });

  /* brush — a round paint brush swirls a stroke of paint beside it; the stroke fades and it paints again */
  rig('brush-pro', .6, 'pop', p => {
    const intro = sub(p);
    const st = intro.path('M -170 150 C -140 112, -110 160, -80 132 C -62 116, -50 128, -36 122', { sw: 18, stroke: C.soft });
    const [xs, ys] = follow(st, .2, 1.3);
    on(st, p, .7, { loop: 2.8, draw: [[0, 0], [.2, 0], [1.5, 1, 'lin'], [2.3, 1]], o: [[0, 0], [.2, 0], [.22, 1], [2.3, 1], [2.6, 0]] });
    const bO = sub(intro), br = sub(bO), q = br.child({ transform: 'rotate(-45) scale(.9)' }, .9);
    q.rect(70, -15, 190, 30, { rx: 15, fill: C.fill, sw: 3 }); q.rect(30, -24, 46, 48, { rx: 6, fill: C.fill, sw: 3 }); [44, 60].forEach(x => q.line(x, -22, x, 22, { sw: 2, stroke: C.soft }));
    q.path('M 32 -22 C -10 -30, -40 -18, -60 0 C -40 18, -10 30, 32 22 Z', { fill: C.fill, sw: 3 }); q.line(-40, 0, 20, 0, { sw: 2, stroke: C.soft });
    on(br, p, .7, { loop: 2.8, x: [[0, xs[0][1] + 30], ...xs.map(([t, v]) => [t, v + 38]), [2, xs[xs.length - 1][1] + 44, 'out'], [2.8, xs[0][1] + 30, 'io']],
      y: [[0, ys[0][1] - 56], ...ys.map(([t, v]) => [t, v - 38]), [2, ys[ys.length - 1][1] - 56, 'out'], [2.8, ys[0][1] - 56, 'io']] });
    pop(p, bO, .1); show(p, intro);
  });

  /* camera-off — a camera under a slash: it tries to shoot (button dips, the flash sputters) but stays dim; the slash never leaves */
  rig('camera-off-pro', .6, 'pop', p => {
    const intro = sub(p), bd = sub(intro);
    const bt = sub(bd); bt.rect(-136, -114, 46, 22, { rx: 7, fill: C.fill, sw: 2.8 });
    on(bt, p, .7, { loop: 2.6, y: [[0, 0], [1, 0], [1.1, 8, 'out'], [1.25, 0, 'soft']] });
    bd.path('M -170 -70 Q -170 -96 -144 -96 L -76 -96 L -54 -132 L 54 -132 L 76 -96 L 144 -96 Q 170 -96 170 -70 L 170 112 Q 170 138 144 138 L -144 138 Q -170 138 -170 112 Z', { fill: C.fill, sw: 3.4 });
    bd.rect(108, -82, 40, 22, { rx: 5, fill: C.fill, sw: 2.6 }); bd.circle(0, 22, 84, { fill: C.fill, sw: 3.4 }); bd.circle(0, 22, 66, { sw: 2, stroke: C.soft }); bd.circle(0, 22, 42, { fill: C.fill, sw: 3 });
    on(bd, p, .7, { loop: 2.6, o: [[0, .6], [1.05, .6], [1.1, 1], [1.2, .5], [1.26, .9], [1.4, .6]] });
    const sl = sub(intro); slash(sl, -160, -150, 160, 150);
    on(sl, p, .7, { loop: 2.6, s: [[0, 1], [1.3, 1], [1.4, 1.05, 'out'], [1.6, 1, 'soft']] });
    pop(p, intro);
  });

  /* dice-5 — the die hops, rolls a quarter turn in the air and lands with a squash (five pips look the same after the turn) */
  rig('dice-5-pro', .6, 'spin', p => {
    const intro = sub(p), dO = sub(intro), dc = sub(dO), d = dc.child({ transform: 'scale(.9)' }, .9);
    d.rect(-130, -130, 260, 260, { rx: 42, fill: C.fill, sw: 3.6 }); d.rect(-110, -110, 220, 220, { rx: 30, sw: 1.8, stroke: C.soft });
    [[-66, -66], [66, -66], [0, 0], [-66, 66], [66, 66]].forEach(([x, y]) => d.circle(x, y, 20, { fill: C.ink, sw: 1.6 }));
    on(dc, p, .7, { loop: 2.4, ox: 0, oy: 117, y: [[0, 0], [.15, 0], [.25, 6, 'out'], [.5, -34, 'out'], [.75, 0, 'in']], sy: [[0, 1], [.15, 1], [.25, .9, 'out'], [.4, 1.03], [.75, 1], [.8, .9, 'out'], [.95, 1, 'soft']] });
    const rr = sub(intro); rr.g.appendChild(dO.g);
    on(rr, p, .7, { loop: 2.4, ox: 0, oy: 0, r: [[0, 0], [.3, 0], [.75, 90, 'io'], [.85, 86, 'soft'], [.95, 90, 'soft'], [2.4, 90]] });
    on(dO, p, 0, { s: [[0, .3], [.45, 1.08, 'out'], [.62, 1]], r: [[0, -90], [.55, 0, 'out']], o: [[0, 0], [.15, 1]] });
    show(p, intro);
  });

  /* gamepad-2 — the d-pad and buttons get pressed in turn, then the pad rumbles */
  rig('gamepad-2-pro', .6, 'pop', p => {
    const intro = sub(p), gp = sub(intro);
    gp.path('M -110 -90 L 110 -90 C 168 -90, 190 -24, 190 40 C 190 108, 150 128, 120 108 L 72 72 L -72 72 L -120 108 C -150 128, -190 108, -190 40 C -190 -24, -168 -90, -110 -90 Z', { fill: C.fill, sw: 3.4 });
    gp.path('M -150 -60 Q -110 -76 -60 -76', { sw: 2, stroke: C.soft }); gp.path('M 150 -60 Q 110 -76 60 -76', { sw: 2, stroke: C.soft });
    const dp = sub(gp); dp.path('M -118 -38 L -86 -38 L -86 -16 L -64 -16 L -64 16 L -86 16 L -86 38 L -118 38 L -118 16 L -140 16 L -140 -16 L -118 -16 Z', { fill: C.fill, sw: 3 });
    on(dp, p, .7, { loop: 2.6, ox: -102, oy: 0, r: [[0, 0], [.3, 0], [.36, 6, 'out'], [.5, 0, 'soft'], [.7, 0], [.76, -6, 'out'], [.9, 0, 'soft']] });
    [[84, -24, .9], [124, 14, 1.2], [84, 52, 1.5]].forEach(([x, y, t]) => { const b = sub(gp); b.circle(x, y, 17, { fill: C.fill, sw: 3 });
      on(b, p, .7, { loop: 2.6, ox: x, oy: y, s: [[0, 1], [t, 1], [t + .05, .75, 'out'], [t + .2, 1.05], [t + .3, 1, 'soft']] }); });
    [-1, 1].forEach(sd => P.capsule(gp, sd * 16 - 12, -40, sd * 16 + 12, -40, 7, { sw: 2.4 }));
    on(gp, p, .7, { loop: 2.6, r: [[0, 0], [1.9, 0], ...at(shakeKeys(8, 2.5, .04).slice(1), 1.9)], x: [[0, 0], [1.9, 0], ...at(shakeKeys(8, 3, .04).slice(1), 1.92)] });
    pop(p, intro);
  });

  /* key-round — a round-headed key nudges into the lock along its blade, turns over (teeth swap sides) and back, then pulls out */
  rig('key-round-pro', .7, 'slideL', p => {
    const intro = sub(p), kO = sub(intro), k = sub(kO), g = k.child({ transform: 'rotate(-45)' }), t = sub(g);
    [[-150, 0], [-118, 0]].forEach(([x]) => t.rect(x - 9, 6, 18, 30, { rx: 4, fill: C.fill, sw: 2.8 }));
    t.rect(-176, -16, 216, 32, { rx: 10, fill: C.fill, sw: 3 }); t.line(-160, 0, 20, 0, { sw: 2, stroke: C.soft });
    t.circle(100, 0, 72, { fill: C.fill, sw: 3.4 }); t.circle(100, 0, 54, { sw: 1.8, stroke: C.soft }); t.circle(126, -22, 15, { fill: C.fill, sw: 3 });
    const d = [-Math.SQRT1_2, Math.SQRT1_2];
    on(k, p, .7, { loop: 2.6, x: [[0, 0], [.12, -d[0] * 6, 'out'], [.34, d[0] * 18, 'out'], [.42, d[0] * 16, 'soft'], [1.5, d[0] * 16], [1.8, 0, 'io']], y: [[0, 0], [.12, -d[1] * 6, 'out'], [.34, d[1] * 18, 'out'], [.42, d[1] * 16, 'soft'], [1.5, d[1] * 16], [1.8, 0, 'io']] });
    on(t, p, .7, { loop: 2.6, sy: [[0, 1], [.4, 1], [.7, -1, 'io'], [1.2, -1], [1.5, 1, 'io']] });
    on(kO, p, 0, { x: [[0, 170], [.6, 0, 'out']], y: [[0, -170], [.6, 0, 'out']], o: [[0, 0], [.15, 1]] });
    show(p, intro);
  });

  /* lamp — a desk lamp: the head nods down (anticipation) and up, the light flickers on and the pool of light breathes */
  rig('lamp-pro', .7, 'pop', p => {
    const intro = sub(p);
    const lg = sub(intro); [['M 74 -40 L 20 160', 2.4], ['M 140 -70 L 186 160', 2.4]].forEach(([d, w]) => lg.path(d, { sw: w, stroke: C.soft })); lg.ellipse(104, 162, 82, 12, { sw: 2.4, stroke: C.soft });
    on(lg, p, .7, { loop: 2.8, o: [[0, .9], [.3, .9], [.35, 0], [.6, 0], [.64, .9], [.7, .3], [.76, 1], [1.8, 1], [2.8, .9]] });
    intro.rect(-176, 152, 150, 22, { rx: 10, fill: C.fill, sw: 3.2 });
    P.capsule(intro, -100, 150, -60, 10, 11, { sw: 3 }); intro.circle(-100, 150, 10, { fill: C.fill, sw: 2.6 });
    const up = sub(intro); P.capsule(up, -60, 10, 54, -96, 11, { sw: 3 });
    const hd = sub(up); hd.path('M 46 -118 L 96 -150 Q 110 -156 120 -142 L 168 -60 Q 172 -48 160 -46 L 40 -46 Q 26 -46 30 -60 Z', { fill: C.fill, sw: 3.2 }); hd.line(62 , -104, 140, -104, { sw: 2, stroke: C.soft });
    up.circle(-60, 10, 12, { fill: C.fill, sw: 2.8 }); up.circle(54, -96, 12, { fill: C.fill, sw: 2.8 });
    on(up, p, .7, { loop: 2.8, ox: -60, oy: 10, r: [[0, 0], [.15, 3, 'out'], [.45, -6, 'out'], [.75, 0, 'soft']] });
    on(hd, p, .7, { loop: 2.8, ox: 54, oy: -96, r: [[0, 0], [.1, 0], [.25, 12, 'out'], [.55, -10, 'out'], [.8, 2], [.95, 0, 'soft']] });
    pop(p, intro);
  });

  /* paintbrush — a flat brush sweeps along, laying a wide band of paint; the band fades and it paints again */
  rig('paintbrush-pro', .6, 'pop', p => {
    const intro = sub(p);
    const band = intro.path('M -150 132 L -20 132', { sw: 34, stroke: C.soft }); on(band, p, .7, { loop: 2.8, draw: [[0, 0], [.2, 0], [1.4, 1, 'io'], [2.3, 1]], o: [[0, 0], [.2, 0], [.22, 1], [2.3, 1], [2.6, 0]] });
    const bO = sub(intro), br = sub(bO), q = br.child({ transform: 'rotate(-35) scale(.8)' }, .8);
    P.capsule(q, 24, 0, 176, 0, 15, { sw: 3 });
    q.rect(-44, -34, 64, 68, { rx: 8, fill: C.fill, sw: 3.2 }); [-30, -14].forEach(x => q.line(x, -32, x, 32, { sw: 2, stroke: C.soft }));
    q.path('M -44 -40 L -120 -44 Q -132 0 -120 44 L -44 40 Z', { fill: C.fill, sw: 3.2 }); [-20, 0, 20].forEach(y => q.line(-110, y, -50, y, { sw: 2, stroke: C.soft }));
    const tip = [-125 * .8 * Math.cos(rad(-35)), -125 * .8 * Math.sin(rad(-35))];
    on(br, p, .7, { loop: 2.8, x: [[0, -150 - tip[0]], [.2, -150 - tip[0]], [1.4, -20 - tip[0], 'io'], [2, -10 - tip[0]], [2.8, -150 - tip[0], 'io']], y: [[0, 110 - tip[1]], [.2, 132 - tip[1], 'out'], [1.4, 132 - tip[1]], [1.6, 104 - tip[1], 'out'], [2.6, 110 - tip[1]], [2.8, 110 - tip[1]]],
      r: [[0, 0], [.2, -4, 'out'], [1.4, 4, 'io'], [1.7, 0, 'soft']] });
    pop(p, bO, .1); show(p, intro);
  });

  /* recycle — three chasing arrows around a triangle step a third of a turn with an overshoot (the shape repeats, so the loop is seamless) */
  rig('recycle-pro', .6, 'spin', p => {
    const intro = sub(p), rc = sub(intro), V = [-90, 30, 150].map(a => [150 * Math.cos(rad(a)), 150 * Math.sin(rad(a)) + 14]), ds = [];
    for (let i = 0; i < 3; i++) { const A = V[i], B = V[(i + 1) % 3], s = [A[0] + (B[0] - A[0]) * .2, A[1] + (B[1] - A[1]) * .2], e = [A[0] + (B[0] - A[0]) * .74, A[1] + (B[1] - A[1]) * .74];
      const L = Math.hypot(B[0] - A[0], B[1] - A[1]), d = [(B[0] - A[0]) / L, (B[1] - A[1]) / L], n = [-d[1], d[0]];
      ds.push(`M ${f1(s[0])} ${f1(s[1])} L ${f1(e[0])} ${f1(e[1])}`, `M ${f1(e[0] - d[0] * 40 + n[0] * 34)} ${f1(e[1] - d[1] * 40 + n[1] * 34)} L ${f1(e[0] + d[0] * 6)} ${f1(e[1] + d[1] * 6)} L ${f1(e[0] - d[0] * 40 - n[0] * 34)} ${f1(e[1] - d[1] * 40 - n[1] * 34)}`); }
    tubes(rc, ds, 30);
    on(rc, p, .7, { loop: 2.4, ox: 0, oy: 14, r: [[0, 0], [1, 0], [1.12, -8, 'out'], [1.6, 126, 'out'], [1.8, 120, 'soft'], [2.4, 120]] });
    on(intro, p, 0, { ox: 0, oy: 14, s: [[0, .3], [.5, 1.06, 'out'], [.65, 1]], r: [[0, -120], [.6, 0, 'out']], o: [[0, 0], [.15, 1]] });
  });

  /* ruler — slides in; the marker steps along the scale from tick to tick (each step overshoots and settles) and slides back */
  rig('ruler-pro', .6, 'slide', p => {
    const intro = sub(p), rO = sub(intro), ru = rO.child({ transform: 'rotate(-20)' });
    ru.rect(-182, -42, 364, 84, { rx: 10, fill: C.fill, sw: 3.4 });
    for (let i = 0; i <= 16; i++) { const x = -160 + i * 20, l = i % 4 === 0 ? 34 : i % 2 ? 14 : 22; ru.line(x, -42, x, -42 + l, { sw: i % 4 === 0 ? 3 : 2.2, stroke: i % 4 === 0 ? C.ink : C.soft }); }
    ru.line(-170, 22, 170, 22, { sw: 1.8, stroke: C.soft });
    const mk = sub(ru); mk.shape([[-160, -46], [-172, -66], [-148, -66]], { fill: C.ink, sw: 2 }); mk.line(-160, -42, -160, 30, { sw: 2.2, stroke: C.soft });
    const kx = [[0, 0]]; for (let i = 1; i <= 4; i++) { kx.push([i * .45 - .2, (i - 1) * 80]); kx.push([i * .45, i * 80 + 6, 'out']); kx.push([i * .45 + .1, i * 80, 'soft']); }
    on(mk, p, .7, { loop: 2.8, x: [...kx, [2.3, 320], [2.75, 0, 'io']] });
    on(rO, p, 0, { x: [[0, -200], [.55, 0, 'out']], o: [[0, 0], [.15, 1]] });
    show(p, intro);
  });

  Object.assign(G.icons, R);
  const names = ['laptop', 'library', 'list-checks', 'list-ordered', 'list-todo', 'microscope', 'monitor', 'notebook', 'notebook-pen', 'pencil',
    'school', 'brush', 'camera-off', 'dice-5', 'gamepad-2', 'key-round', 'lamp', 'paintbrush', 'recycle', 'ruler'];
  const ALIAS = Object.fromEntries(names.map(n => [n, n + '-pro'])); Object.assign(ALIAS, { dice: 'dice-5-pro', gamepad: 'gamepad-2-pro' });
  for (const [a, pro] of Object.entries(ALIAS)) { if (G.icons[a] && !G.icons[a + '-basic'] && !G.icons[a].custom) G.icons[a + '-basic'] = G.icons[a]; G.icons[a] = R[pro]; }
  G.PRO12 = names.map(n => n + '-pro');
})();
