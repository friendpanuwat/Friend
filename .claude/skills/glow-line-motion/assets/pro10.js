/* pro10.js — pro icon batch 10: CutPack priority-3 names, first 20 (arrows, math signs, charts, at-sign, bell-off).
   Glyph icons (arrows / math) use the outlined "tube" stroke; overlapping strokes are drawn as one union (all outlines first,
   then all fills) so no outline crosses inside the glyph. Details only where they mean something (style.md §0) — a plain sign stays
   plain and its quality comes from the motion: anticipation, overshoot + settle, follow-through, speed lines.
   Entrance and loop always sit on separate groups. */
(function () {
  const G = window.GL, C = G.C, P = G.parts;
  const sub = (p, attrs) => p.child(attrs || {});
  const on = (q, p, start, spec) => G.kf(q.g || q, p.t0 + start * p.ts, spec);
  const pop = (p, q, at = 0, from = .4) => on(q, p, at, { s: [[0, from], [.42, 1.08, 'out'], [.62, 1]], o: [[0, 0], [.16, 1]] });
  const show = (p, q) => on(q, p, 0, { o: [[0, 0], [.01, 1]] });
  const flash = (a, b) => [[0, 0], [a, 0], [a + .02, 1], [b, 0]];
  const tubes = (q, ds, w = 30) => { ds.forEach(d => q.path(d, { sw: w })); ds.forEach(d => q.path(d, { sw: w - 7, stroke: C.fill })); };
  const f1 = v => +v.toFixed(1), rad = d => d * Math.PI / 180;
  /* an arc (degrees, SVG angles: 0 = right, 90 = down) with an arrow head at its end, pointing along the travel direction */
  const arcArrow = (r, a0, a1, cw) => {
    const A0 = rad(a0), A1 = rad(a1), span = Math.abs(a1 - a0), ex = r * Math.cos(A1), ey = r * Math.sin(A1);
    const t = cw ? [-Math.sin(A1), Math.cos(A1)] : [Math.sin(A1), -Math.cos(A1)], n = [Math.cos(A1), Math.sin(A1)];
    const tip = [ex + t[0] * 12, ey + t[1] * 12], w1 = [tip[0] - t[0] * 46 + n[0] * 42, tip[1] - t[1] * 46 + n[1] * 42], w2 = [tip[0] - t[0] * 46 - n[0] * 42, tip[1] - t[1] * 46 - n[1] * 42];
    return [`M ${f1(r * Math.cos(A0))} ${f1(r * Math.sin(A0))} A ${r} ${r} 0 ${span > 180 ? 1 : 0} ${cw ? 1 : 0} ${f1(ex)} ${f1(ey)}`, `M ${f1(w1[0])} ${f1(w1[1])} L ${f1(tip[0])} ${f1(tip[1])} L ${f1(w2[0])} ${f1(w2[1])}`];
  };
  const R = {}, rig = (name, dur, exit, fn) => { fn.custom = true; fn.dur = dur; fn.exit = exit; R[name] = fn; };
  const slideTo = (dx, dy) => ({ kind: 'slide', dur: .5, x: [[0, 0], [.14, -dx * 14, 'out'], [.5, dx * 250, 'in']], y: [[0, 0], [.14, -dy * 14, 'out'], [.5, dy * 250, 'in']], o: [[0, 1], [.34, 1], [.5, 0]] });

  /* arrow-down-right / arrow-up-right — the diagonal arrow pulls back (anticipation), darts along its line and eases home; speed lines trail */
  const diag = (sx, sy) => p => {
    const intro = sub(p), aO = sub(intro), ar = sub(aO); show(p, intro);
    tubes(ar, [`M ${-sx * 112} ${-sy * 112} L ${sx * 100} ${sy * 100}`, `M ${-sx * 8} ${sy * 112} L ${sx * 112} ${sy * 112} L ${sx * 112} ${-sy * 8}`], 32);
    const sp = sub(intro); [[-34, 22], [0, 36], [34, 22]].forEach(([k, l]) => { const bx = -sx * 150 + sx * k * .7, by = -sy * 150 - sy * k * .7;
      sp.line(f1(bx + sx * (k > 0 ? 12 : 0)), f1(by), f1(bx - sx * l * .7), f1(by - sy * l * .7), { sw: 3, stroke: C.soft }); });
    on(ar, p, .7, { loop: 1.6, x: [[0, 0], [.15, -sx * 8, 'out'], [.4, sx * 20, 'out'], [.9, 0, 'io']], y: [[0, 0], [.15, -sy * 8, 'out'], [.4, sy * 20, 'out'], [.9, 0, 'io']] });
    on(sp, p, .7, { loop: 1.6, x: [[0, 0], [.15, 0], [.5, -sx * 16, 'out']], y: [[0, 0], [.15, 0], [.5, -sy * 16, 'out']], o: flash(.16, .55) });
    on(aO, p, 0, { x: [[0, -sx * 180], [.6, 0, 'back']], y: [[0, -sy * 180], [.6, 0, 'back']], o: [[0, 0], [.15, 1]] });
  };
  rig('arrow-down-right-pro', .7, slideTo(1, 1), diag(1, 1));

  /* arrow-left — pulls back right, darts left, settles; speed lines flick on its tail side */
  rig('arrow-left-pro', .7, 'slideL', p => {
    const intro = sub(p), aO = sub(intro), ar = sub(aO); show(p, intro);
    tubes(ar, ['M 150 0 L -136 0', 'M -56 -86 L -142 0 L -56 86'], 32);
    const sp = sub(intro); [[-44, 30], [44, 30], [0, 20]].forEach(([y, l]) => sp.line(166, y, 166 + l, y, { sw: 3, stroke: C.soft }));
    on(ar, p, .7, { loop: 1.6, x: [[0, 0], [.15, 10, 'out'], [.4, -24, 'out'], [.9, 0, 'io']] });
    on(sp, p, .7, { loop: 1.6, x: [[0, -6], [.15, -6], [.5, 14, 'out']], o: flash(.16, .55) });
    on(aO, p, 0, { x: [[0, 220], [.6, 0, 'back']], o: [[0, 0], [.15, 1]] });
  });
  rig('arrow-up-right-pro', .7, slideTo(1, -1), diag(1, -1));

  /* chart-bar — horizontal bars grow out from the axis one by one; then they stretch and shrink to new values (overshoot + settle) */
  const valueKeys = f => [[0, 1], [.08, f > 1 ? .97 : 1.03, 'out'], [.55, f * (f > 1 ? 1.04 : .96), 'out'], [.75, f, 'soft'], [1.5, f], [1.95, 1, 'io'], [2.1, f > 1 ? .985 : 1.015, 'soft'], [2.3, 1, 'soft']];
  rig('chart-bar-pro', .8, 'squash', p => {
    const intro = sub(p); show(p, intro);
    [-50, 60].forEach(x => { const gl = intro.line(x, -166, x, 152, { sw: 1.6, stroke: C.soft }); on(gl, p, .2, { draw: [[0, 0], [.4, 1, 'out']] }); });
    const ax = intro.path('M -168 -172 L -168 160 L 176 160', { sw: 3.4 }); on(ax, p, 0, { draw: [[0, 0], [.4, 1, 'out']] });
    [-50, 60].forEach(x => { const tk = intro.line(x, 160, x, 174, { sw: 2.6 }); on(tk, p, .3, { draw: [[0, 0], [.2, 1]] }); });
    [[-108, 220, 1.3], [-20, 140, .72], [68, 300, .86]].forEach(([y, L, f], i) => {
      const bO = sub(intro), b = sub(bO), hi = i === 2; b.rect(-168, y - 28, L, 56, { rx: 8, fill: C.fill, sw: hi ? 3.4 : 2.6, stroke: hi ? C.ink : C.soft });
      b.line(-168 + L - 16, y - 14, -168 + L - 16, y + 14, { sw: 2, stroke: C.soft });
      on(b, p, .9 + i * .15, { loop: 3, ox: -168, oy: y, sx: valueKeys(f) });
      on(bO, p, .25 + i * .1, { ox: -168, oy: y, sx: [[0, 0], [.35, 1.06, 'out'], [.5, 1]], o: [[0, 0], [.02, 1]] });
    });
  });

  /* chart-line — axes and grid draw, the line plots point by point; then a bright cursor runs along it and the newest point pings */
  rig('chart-line-pro', .9, 'squash', p => {
    const intro = sub(p); show(p, intro);
    [-90, 20].forEach(y => { const gl = intro.line(-160, y, 172, y, { sw: 1.6, stroke: C.soft }); on(gl, p, .2, { draw: [[0, 0], [.4, 1, 'out']] }); });
    const ax = intro.path('M -168 -172 L -168 160 L 176 160', { sw: 3.4 }); on(ax, p, 0, { draw: [[0, 0], [.4, 1, 'out']] });
    [-90, 20].forEach(y => { const tk = intro.line(-182, y, -168, y, { sw: 2.6 }); on(tk, p, .3, { draw: [[0, 0], [.2, 1]] }); });
    const PTS = [[-130, 100], [-62, 40], [6, 70], [74, -30], [148, -118]];
    const ln = intro.poly(PTS, { sw: 4.6 }); on(ln, p, .3, { draw: [[0, 0], [.6, 1, 'io']] });
    PTS.forEach(([x, y], i) => { const dO = sub(intro), d = sub(dO); d.circle(x, y, 10, { fill: C.fill, sw: 3 });
      on(dO, p, .35 + i * .12, { ox: x, oy: y, s: [[0, 0], [.25, 1.2, 'out'], [.4, 1]], o: [[0, 0], [.02, 1]] });
      if (i === PTS.length - 1) on(d, p, .9, { loop: 2.6, ox: x, oy: y, s: [[0, 1], [1.5, 1], [1.6, 1.5, 'out'], [1.9, 1, 'soft']] }); });
    const rp = sub(intro); rp.circle(148, -118, 14, { sw: 2.4, stroke: C.soft });
    on(rp, p, .9, { loop: 2.6, ox: 148, oy: -118, s: [[0, 1], [1.55, 1], [2.2, 2.6, 'out']], o: [[0, 0], [1.55, 0], [1.57, .9], [2.2, 0]] });
    const L = [0]; for (let i = 1; i < PTS.length; i++) L.push(L[i - 1] + Math.hypot(PTS[i][0] - PTS[i - 1][0], PTS[i][1] - PTS[i - 1][1]));
    const tt = L.map(l => +(l / L[L.length - 1] * 1.4).toFixed(3));
    const cur = sub(intro); cur.circle(0, 0, 7, { fill: C.ink, sw: 1.4 });
    on(cur, p, .9, { loop: 2.6, x: PTS.map(([x], i) => [tt[i] + .1, x, 'lin']), y: PTS.map(([, y], i) => [tt[i] + .1, y, 'lin']), o: [[0, 0], [.1, 0], [.14, 1], [1.5, 1], [1.56, 0]] });
  });

  /* chart-no-axes-combined — columns plus a trend line with points and an arrow; columns breathe to new values, the arrow nudges up-right */
  rig('chart-no-axes-combined-pro', .9, 'squash', p => {
    const intro = sub(p); show(p, intro);
    [[-126, 70, 1.15], [-42, 110, .85], [42, 90, 1.2], [126, 170, .9]].forEach(([x, h, f], i) => {
      const bO = sub(intro), b = sub(bO), hi = i === 3; b.rect(x - 28, 166 - h, 56, h, { rx: 8, fill: C.fill, sw: hi ? 3.4 : 2.6, stroke: hi ? C.ink : C.soft });
      on(b, p, 1 + i * .12, { loop: 3, ox: x, oy: 166, sy: valueKeys(f) });
      on(bO, p, .1 + i * .08, { ox: x, oy: 166, sy: [[0, 0], [.35, 1.06, 'out'], [.5, 1]], o: [[0, 0], [.02, 1]] }); });
    const PTS = [[-126, 46], [-42, 4], [42, 20], [126, -64]];
    const ln = intro.poly([...PTS, [160, -104]], { sw: 4.4 }); on(ln, p, .5, { draw: [[0, 0], [.6, 1, 'io']] });
    PTS.forEach(([x, y], i) => { const dO = sub(intro), d = sub(dO); d.circle(x, y, 10, { fill: C.fill, sw: 3 });
      on(dO, p, .55 + i * .12, { ox: x, oy: y, s: [[0, 0], [.25, 1.2, 'out'], [.4, 1]], o: [[0, 0], [.02, 1]] });
      on(d, p, 1, { loop: 3, ox: x, oy: y, s: [[0, 1], [.2 + i * .15, 1], [.3 + i * .15, 1.3, 'out'], [.5 + i * .15, 1, 'soft']] }); });
    const ao = sub(intro), ai = sub(ao); ai.poly([[132, -110], [166, -110], [166, -76]], { sw: 5 });
    on(ao, p, 1.05, { ox: 166, oy: -110, s: [[0, 0], [.3, 1, 'back']] });
    on(ai, p, 1.4, { loop: 1.6, x: [[0, 0], [.15, -3, 'out'], [.5, 8, 'out'], [1.1, 0, 'soft']], y: [[0, 0], [.15, 3, 'out'], [.5, -8, 'out'], [1.1, 0, 'soft']] });
  });

  /* chart-pie — the pie sweeps in; one slice slides out of the pie with an overshoot, holds, and tucks back in */
  const slice = (r, a1, a2) => `M 0 0 L ${f1(r * Math.cos(rad(a1)))} ${f1(r * Math.sin(rad(a1)))} A ${r} ${r} 0 ${a2 - a1 > 180 ? 1 : 0} 1 ${f1(r * Math.cos(rad(a2)))} ${f1(r * Math.sin(rad(a2)))} Z`;
  rig('chart-pie-pro', .7, 'spin', p => {
    const intro = sub(p), pie = sub(intro);
    pie.path(slice(140, 30, 150), { fill: C.fill, sw: 3.2 }); pie.path(slice(140, 150, 270), { fill: C.fill, sw: 3.2 });
    pie.path(`M ${f1(98 * Math.cos(rad(40)))} ${f1(98 * Math.sin(rad(40)))} A 98 98 0 0 1 ${f1(98 * Math.cos(rad(140)))} ${f1(98 * Math.sin(rad(140)))}`, { sw: 1.8, stroke: C.soft });
    const d = [Math.cos(rad(-30)), Math.sin(rad(-30))], sl = sub(intro); sl.path(slice(140, -90, 30), { fill: C.fill, sw: 3.4 });
    sl.path(`M ${f1(98 * Math.cos(rad(-80)))} ${f1(98 * Math.sin(rad(-80)))} A 98 98 0 0 1 ${f1(98 * Math.cos(rad(20)))} ${f1(98 * Math.sin(rad(20)))}`, { sw: 1.8, stroke: C.soft });
    const k = [[0, 14], [.3, 14], [.6, 44, 'back'], [1.6, 44], [1.9, 8, 'in'], [2, 16, 'out'], [2.15, 14, 'soft'], [2.8, 14]];
    on(sl, p, .7, { loop: 2.8, x: k.map(([t, v, e]) => [t, f1(v * d[0]), e]), y: k.map(([t, v, e]) => [t, f1(v * d[1]), e]) });
    on(pie, p, .7, { loop: 2.8, s: [[0, 1], [1.9, 1], [1.96, .97, 'out'], [2.15, 1, 'soft']] });
    on(intro, p, 0, { s: [[0, .2], [.5, 1.06, 'out'], [.65, 1]], r: [[0, -120], [.6, 0, 'out']], o: [[0, 0], [.15, 1]] });
  });

  /* divide — the two dots hop away from the bar (squash on take-off and landing) and the bar stretches with them */
  rig('divide-pro', .6, 'pop', p => {
    const intro = sub(p), bar = sub(intro); tubes(bar, ['M -132 0 L 132 0'], 34);
    [-1, 1].forEach(sd => { const dt = sub(intro); dt.circle(0, sd * 86, 26, { fill: C.fill, sw: 3.4 });
      on(dt, p, .7, { loop: 1.8, ox: 0, oy: sd * 86, y: [[0, 0], [.1, -sd * 6, 'out'], [.36, sd * 26, 'out'], [.62, 0, 'in'], [.7, -sd * 3], [.78, 0]], sy: [[0, 1], [.1, .84, 'out'], [.2, 1.1], [.36, 1], [.62, 1], [.66, .86, 'out'], [.8, 1, 'soft']] }); });
    on(bar, p, .7, { loop: 1.8, sx: [[0, 1], [.1, .95, 'out'], [.36, 1.06, 'out'], [.62, 1, 'soft']] });
    pop(p, intro);
  });

  /* equal — the two bars slide in from opposite sides and snap level; then they drift apart and snap back into line */
  rig('equal-pro', .7, 'pop', p => {
    const intro = sub(p); show(p, intro);
    [-1, 1].forEach((sd, i) => { const bO = sub(intro), b = sub(bO); tubes(b, [`M -128 ${sd * 48} L 128 ${sd * 48}`], 34);
      on(b, p, .8, { loop: 2.2, x: [[0, 0], [.4 + i * .1, 0], [.7 + i * .1, sd * 22, 'io'], [.95 + i * .1, -sd * 4, 'out'], [1.1 + i * .1, 0, 'soft']] });
      on(bO, p, i * .1, { x: [[0, sd * 220], [.55, 0, 'back']], o: [[0, 0], [.15, 1]] }); });
  });

  /* gauge — the needle dips (anticipation), revs up to the red zone with a jittery overshoot, holds, then sweeps back down */
  rig('gauge-pro', .6, 'pop', p => {
    const intro = sub(p), dial = sub(intro);
    const P0 = [f1(150 * Math.cos(rad(150))), f1(150 * Math.sin(rad(150)))], P1 = [f1(150 * Math.cos(rad(30))), f1(150 * Math.sin(rad(30)))];
    tubes(dial, [`M ${P0[0]} ${P0[1]} A 150 150 0 1 1 ${P1[0]} ${P1[1]}`], 26);
    dial.path(`M ${f1(98 * Math.cos(rad(160)))} ${f1(98 * Math.sin(rad(160)))} A 98 98 0 1 1 ${f1(98 * Math.cos(rad(20)))} ${f1(98 * Math.sin(rad(20)))}`, { sw: 1.8, stroke: C.soft });
    for (let i = 0; i <= 8; i++) { const a = rad(150 + i * 30), r1 = i % 2 ? 112 : 104; dial.line(f1(Math.cos(a) * r1), f1(Math.sin(a) * r1), f1(Math.cos(a) * 124), f1(Math.sin(a) * 124), { sw: i % 2 ? 2.4 : 3.4 }); }
    dial.path(`M ${f1(116 * Math.cos(rad(-15)))} ${f1(116 * Math.sin(rad(-15)))} A 116 116 0 0 1 ${f1(116 * Math.cos(rad(25)))} ${f1(116 * Math.sin(rad(25)))}`, { sw: 7 });
    const nd = sub(intro); nd.path('M -7 0 L 0 -108 L 7 0 Z', { fill: C.ink, sw: 2 });
    on(nd, p, .7, { loop: 2.8, r: [[0, -100], [.2, -108, 'out'], [.85, 98, 'out'], [.95, 88], [1.03, 102], [1.11, 92], [1.19, 99], [1.3, 95, 'soft'], [1.8, 95], [2.45, -100, 'io'], [2.8, -100]] });
    intro.circle(0, 0, 20, { fill: C.fill, sw: 3.2 }); intro.dot(0, 0, 6);
    on(dial, p, .7, { loop: 2.8, r: [[0, 0], [.85, 0], [.9, 1.5, 'lin'], [.95, -1.5, 'lin'], [1, 1, 'lin'], [1.05, 0, 'out']] });
    pop(p, intro);
  });

  /* minus — the bar winds in (squash), then snaps a chunk off its end that flies away; the bar springs back */
  rig('minus-pro', .6, 'pop', p => {
    const intro = sub(p), bar = sub(intro); tubes(bar, ['M -132 0 L 132 0'], 36);
    const ch = sub(intro); ch.rect(-14, -14, 28, 28, { rx: 8, fill: C.fill, sw: 3 });
    on(ch, p, .7, { loop: 1.8, x: [[0, 136], [.3, 136], [.75, 196, 'out']], y: [[0, 0], [.3, 0], [.75, -30, 'out']], r: [[0, 0], [.3, 0], [.75, 80, 'out']], o: [[0, 0], [.3, 0], [.32, 1], [.75, 0]] });
    on(bar, p, .7, { loop: 1.8, sx: [[0, 1], [.22, .86, 'out'], [.34, 1.06, 'out'], [.6, 1, 'soft']] });
    pop(p, intro);
  });

  /* move-right — a long arrow: pulls back, glides right with speed lines, eases home */
  rig('move-right-pro', .7, 'slide', p => {
    const intro = sub(p), aO = sub(intro), ar = sub(aO); show(p, intro);
    tubes(ar, ['M -176 0 L 160 0', 'M 108 -54 L 166 0 L 108 54'], 26);
    const sp = sub(intro); [[-36, 44], [36, 44]].forEach(([y, l]) => sp.line(-130, y, -130 - l, y, { sw: 3, stroke: C.soft }));
    on(ar, p, .7, { loop: 1.8, x: [[0, 0], [.18, -12, 'out'], [.5, 24, 'out'], [1.1, 0, 'io']] });
    on(sp, p, .7, { loop: 1.8, x: [[0, 0], [.18, 0], [.6, -20, 'out']], o: flash(.2, .65) });
    on(aO, p, 0, { x: [[0, -220], [.6, 0, 'back']], o: [[0, 0], [.15, 1]] });
  });

  /* plus — pops in; it pulses and turns a quarter with an overshoot (looks the same after the turn, so the loop is seamless) */
  rig('plus-pro', .6, 'spin', p => {
    const intro = sub(p), pl = sub(intro); tubes(pl, ['M -132 0 L 132 0', 'M 0 -132 L 0 132'], 36);
    on(pl, p, .7, { loop: 2.4, r: [[0, 0], [1.1, 0], [1.22, -10, 'out'], [1.62, 96, 'out'], [1.82, 90, 'soft'], [2.4, 90]], s: [[0, 1], [1.1, 1], [1.22, .9, 'out'], [1.5, 1.08], [1.8, 1, 'soft']] });
    pop(p, intro);
  });

  /* redo-2 / undo-2 — the hooked arrow winds back, then pushes toward its head with an overshoot; a faint echo of the head trails */
  const hook = sd => p => {
    const intro = sub(p), aO = sub(intro), ar = sub(aO);
    const head = `M ${sd * 54} -144 L ${sd * 144} -54 L ${sd * 54} 36`;
    const ec = sub(intro); ec.path(head, { sw: 3, stroke: C.soft });
    on(ec, p, .7, { loop: 2.2, x: [[0, 0], [.15, 0], [.6, sd * 30, 'out']], o: flash(.16, .6) });
    tubes(ar, [`M ${sd * 140} -54 L ${sd * -45} -54 A 99 99 0 0 ${sd > 0 ? 0 : 1} ${sd * -45} 144 L ${sd * 18} 144`, head], 30);
    on(ar, p, .7, { loop: 2.2, ox: sd * -45, oy: 45, x: [[0, 0], [.15, -sd * 8, 'out'], [.45, sd * 16, 'out'], [.95, 0, 'io']], r: [[0, 0], [.15, -sd * 3, 'out'], [.45, sd * 5, 'out'], [.95, 0, 'io']] });
    on(aO, p, 0, { ox: sd * -45, oy: 45, s: [[0, .4], [.45, 1.08, 'out'], [.62, 1]], r: [[0, -sd * 50], [.55, 0, 'out']], o: [[0, 0], [.16, 1]] });
    show(p, intro);
  };
  rig('redo-2-pro', .7, 'pop', hook(1));

  /* refresh-cw — two curved arrows chase each other: a wind-up, one full clockwise turn with overshoot, a pause */
  rig('refresh-cw-pro', .6, 'spin', p => {
    const intro = sub(p), rf = sub(intro), [a1, h1] = arcArrow(138, 190, 330, true), [a2, h2] = arcArrow(138, 10, 150, true);
    tubes(rf, [a1, h1, a2, h2], 28);
    on(rf, p, .7, { loop: 2.4, r: [[0, 0], [.2, -14, 'out'], [1.05, 372, 'io'], [1.25, 360, 'soft'], [2.4, 360]] });
    on(intro, p, 0, { s: [[0, .3], [.5, 1.06, 'out'], [.65, 1]], r: [[0, -180], [.6, 0, 'out']], o: [[0, 0], [.15, 1]] });
  });

  /* rotate-ccw — one counter-clockwise arrow winds the other way first, then spins a full turn back with an overshoot */
  rig('rotate-ccw-pro', .6, 'spin', p => {
    const intro = sub(p), rc = sub(intro), [a, h] = arcArrow(140, 180, -130, false);
    tubes(rc, [a, h], 28);
    on(rc, p, .7, { loop: 2.6, r: [[0, 0], [.2, 14, 'out'], [1.1, -372, 'io'], [1.3, -360, 'soft'], [2.6, -360]] });
    on(intro, p, 0, { s: [[0, .3], [.5, 1.06, 'out'], [.65, 1]], r: [[0, 160], [.6, 0, 'out']], o: [[0, 0], [.15, 1]] });
  });

  /* sigma — numbers (small chips) fly in from the left and are swallowed by the Σ, which bulges with each one */
  rig('sigma-pro', .6, 'pop', p => {
    const intro = sub(p), sg = sub(intro);
    tubes(sg, ['M 128 -118 L 128 -150 L -116 -150 L 22 0 L -116 150 L 128 150 L 128 118'], 30);
    [[-60, 0], [0, .35], [60, .7]].forEach(([y, d]) => { const c = sub(intro); c.rect(-12, y - 12, 24, 24, { rx: 7, fill: C.fill, sw: 2.8 });
      on(c, p, .7, { loop: 2.4, x: [[0, -180], [d, -180], [d + .4, -10, 'in']], y: [[0, 0], [d, 0], [d + .4, -y, 'in']], s: [[0, 1], [d + .3, 1], [d + .4, .3]], o: [[0, 0], [d, 0], [d + .06, 1], [d + .36, 1], [d + .42, 0]] }); });
    on(sg, p, .7, { loop: 2.4, ox: 0, oy: 0, s: [[0, 1], [.4, 1], [.48, 1.05, 'out'], [.6, 1, 'soft'], [.75, 1], [.83, 1.06, 'out'], [.95, 1, 'soft'], [1.1, 1], [1.18, 1.08, 'out'], [1.35, 1, 'soft']] });
    pop(p, intro);
  });
  rig('undo-2-pro', .7, 'pop', hook(-1));

  /* at-sign — the @ winds back, whirls a full turn with an overshoot, settles; the inner ring pulses as it lands */
  rig('at-sign-pro', .6, 'spin', p => {
    const intro = sub(p), at = sub(intro);
    tubes(at, ['M 58 -58 L 58 14 A 44 44 0 0 0 146 14 L 146 0 A 146 146 0 1 0 88 116', 'M 58 0 A 58 58 0 1 0 -58 0 A 58 58 0 1 0 58 0'], 24);
    on(at, p, .7, { loop: 2.6, r: [[0, 0], [.2, -16, 'out'], [1.05, 368, 'io'], [1.25, 360, 'soft'], [2.6, 360]], s: [[0, 1], [1.05, 1], [1.15, 1.06, 'out'], [1.4, 1, 'soft']] });
    on(intro, p, 0, { s: [[0, .3], [.5, 1.06, 'out'], [.65, 1]], r: [[0, -150], [.6, 0, 'out']], o: [[0, 0], [.15, 1]] });
  });

  /* bell-off — a bell under a slash: it tries to ring (a small damped swing, the clapper lagging) but stays silent; the slash never leaves */
  rig('bell-off-pro', .6, 'pop', p => {
    const intro = sub(p), sw = sub(intro), cl = sub(sw);
    cl.line(0, 70, 0, 100, { sw: 3 }); cl.circle(0, 110, 16, { fill: C.fill, sw: 3 });
    sw.circle(0, -128, 11, { fill: C.fill, sw: 3 });
    sw.path('M -16 -112 C -70 -104, -84 -60, -86 -6 C -88 40, -100 58, -122 72 L 122 72 C 100 58, 88 40, 86 -6 C 84 -60, 70 -104, 16 -112 Z', { fill: C.fill, sw: 3.2 });
    sw.path('M -86 22 Q 0 38 86 22', { stroke: C.soft, sw: 1.8 });
    sw.rect(-130, 68, 260, 22, { rx: 11, fill: C.fill, sw: 3 });
    on(sw, p, .7, { loop: 2.8, ox: 0, oy: -128, r: [[0, 0], [1, 0], [1.12, -9, 'out'], [1.3, 6], [1.46, -3], [1.6, 1], [1.72, 0, 'soft']], o: [[0, .6], [1, .6], [1.05, 1], [1.6, 1], [1.9, .6]] });
    on(cl, p, .7, { loop: 2.8, ox: 0, oy: 70, r: [[0, 0], [1.04, 0], [1.18, 12, 'out'], [1.36, -8], [1.52, 4], [1.7, 0, 'soft']] });
    const sl = sub(intro); sl.line(-160, -150, 160, 150, { sw: 22, stroke: C.fill }); sl.line(-160, -150, 160, 150, { sw: 6 });
    on(sl, p, .7, { loop: 2.8, s: [[0, 1], [1.62, 1], [1.72, 1.05, 'out'], [1.95, 1, 'soft']] });
    pop(p, intro);
  });

  Object.assign(G.icons, R);
  const names = ['arrow-down-right', 'arrow-left', 'arrow-up-right', 'chart-bar', 'chart-line', 'chart-no-axes-combined', 'chart-pie', 'divide', 'equal', 'gauge', 'minus',
    'move-right', 'plus', 'redo-2', 'refresh-cw', 'rotate-ccw', 'sigma', 'undo-2', 'at-sign', 'bell-off'];
  const ALIAS = Object.fromEntries(names.map(n => [n, n + '-pro'])); Object.assign(ALIAS, { redo: 'redo-2-pro', undo: 'undo-2-pro', refresh: 'refresh-cw-pro', pie: 'chart-pie-pro', speedometer: 'gauge-pro' });
  for (const [a, pro] of Object.entries(ALIAS)) { if (G.icons[a] && !G.icons[a + '-basic'] && !G.icons[a].custom) G.icons[a + '-basic'] = G.icons[a]; G.icons[a] = R[pro]; }
  G.PRO10 = names.map(n => n + '-pro');
})();
