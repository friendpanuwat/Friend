/* pro7.js — pro icon batch 7: the emoji faces (smile, frown). Faces that show a feeling are not counted as body parts;
   hands / ears / other body parts stay paused (the user will ask for them later).
   Same standard as pro6: main line 3 · dark see-through bodies · only details that carry meaning (no glints, no buttons, no thin
   decorative lines) · entrance + looping part animation + exit (3rd argument of rig).
   Two GL.kf on one element → the later one overwrites the transform: entrance and loop always sit on separate groups. */
(function () {
  const G = window.GL, C = G.C;
  const sub = (p, attrs) => p.child(attrs || {});
  const on = (q, p, start, spec) => G.kf(q.g || q, p.t0 + start * p.ts, spec);
  const pop = (p, q, at = 0, from = .4) => on(q, p, at, { s: [[0, from], [.42, 1.08, 'out'], [.62, 1]], o: [[0, 0], [.16, 1]] });
  const drop = (p, q, at = 0, dy = -90) => on(q, p, at, { y: [[0, dy], [.55, 0, 'back']], o: [[0, 0], [.2, 1]] });
  const DROP = (x, y, r) => `M ${x} ${y - r * 1.6} C ${x + r * .5} ${y - r * .8}, ${x + r} ${y - r * .2}, ${x + r} ${y + r * .3} A ${r} ${r} 0 0 1 ${x - r} ${y + r * .3} C ${x - r} ${y - r * .2}, ${x - r * .5} ${y - r * .8}, ${x} ${y - r * 1.6} Z`;
  const R = {}, rig = (name, dur, exit, fn) => { fn.custom = true; fn.dur = dur; fn.exit = exit; R[name] = fn; };

  /* emoji faces: one round face, two eyes, a mouth */
  const face = q => { q.circle(0, 0, 150, { fill: C.fill, sw: 3.4 }); };
  const eyes = q => [-52, 52].map(x => { const e = sub(q); e.ellipse(x, -40, 14, 22, { fill: C.ink, sw: 1.4 }); return e; });

  /* smile — the face pops in, gives a happy little hop with a tilt, the smile widens, it blinks */
  rig('smile-pro', .6, 'pop', p => {
    const intro = sub(p), fc = sub(intro);
    face(fc);
    eyes(fc).forEach(e => on(e, p, .7, { loop: 2.6, ox: 0, oy: -40, sy: [[0, 1], [1.9, 1], [1.97, .12, 'in'], [2.06, 1, 'out']] }));
    const m = sub(fc); m.path('M -82 30 Q 0 112 82 30', { sw: 5 });
    on(m, p, .7, { loop: 2.6, ox: 0, oy: 50, sx: [[0, 1], [.1, 1.1, 'out'], [.6, 1.1], [.9, 1, 'soft']], sy: [[0, 1], [.1, 1.18, 'out'], [.6, 1.18], [.9, 1, 'soft']] });
    on(fc, p, .7, { loop: 2.6, ox: 0, oy: 150, y: [[0, 0], [.12, -18, 'out'], [.3, 0, 'in'], [.36, -4], [.44, 0]], r: [[0, 0], [.12, -5, 'out'], [.3, 4, 'io'], [.5, 0, 'soft']] });
    pop(p, intro);
  });

  /* frown — the face drops in, then droops and tilts with a sigh; worried brows; a tear runs down */
  rig('frown-pro', .6, 'rise', p => {
    const intro = sub(p), fc = sub(intro);
    face(fc); eyes(fc);
    [-1, 1].forEach(sd => fc.line(sd * 80, -84, sd * 34, -102, { sw: 4 }));
    const m = sub(fc); m.path('M -72 82 Q 0 22 72 82', { sw: 5 });
    on(m, p, .7, { loop: 3, ox: 0, oy: 60, sy: [[0, 1], [.5, 1.15, 'soft'], [1.6, 1.15], [2.2, 1, 'soft']] });
    const tr = sub(fc); tr.path(DROP(-60, -6, 11), { fill: C.fill, sw: 2.4 });
    on(tr, p, .7, { loop: 3, y: [[0, 0], [.6, 0], [1.6, 70, 'in']], o: [[0, 0], [.55, 0], [.65, 1], [1.4, 1], [1.6, 0]], s: [[0, 1]] });
    on(fc, p, .7, { loop: 3, ox: 0, oy: 150, y: [[0, 0], [.5, 10, 'soft'], [1.6, 10], [2.2, 0, 'soft']], r: [[0, 0], [.5, -4, 'soft'], [1.6, -4], [2.2, 0, 'soft']] });
    drop(p, intro, 0, -110);
  });

  Object.assign(G.icons, R);
  const ALIAS = { smile: 'smile-pro', frown: 'frown-pro' };
  for (const [a, pro] of Object.entries(ALIAS)) { if (G.icons[a] && !G.icons[a + '-basic'] && !G.icons[a].custom) G.icons[a + '-basic'] = G.icons[a]; G.icons[a] = R[pro]; }
  G.PRO7 = Object.keys(R);
})();
