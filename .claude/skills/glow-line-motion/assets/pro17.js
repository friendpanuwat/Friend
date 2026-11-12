/* pro17.js — pro icon batch 17: CutPack priority-3 names 142–161 (tools, power & network, money, documents, places).
   Detail level = batch 15/16 (pro.js + small meaningful extras, never cluttered), style.md §0 rules.
   Every inner mark is placed from the real outline and kept INSIDE it. People on cards use GL.parts.bizUser (people.js).
   Motion = anticipation, overshoot + settle, follow-through, secondary motion. Entrance and loop sit on separate groups. */
(function () {
  const G = window.GL, C = G.C;
  const sub = (p, attrs) => p.child(attrs || {});
  const on = (q, p, start, spec) => G.kf(q.g || q, p.t0 + start * p.ts, spec);
  const pop = (p, q, at = 0, from = .4) => on(q, p, at, { s: [[0, from], [.42, 1.08, 'out'], [.62, 1]], o: [[0, 0], [.16, 1]] });
  const drop = (p, q, at = 0, dy = -90) => on(q, p, at, { y: [[0, dy], [.55, 0, 'back']], o: [[0, 0], [.2, 1]] });
  const thud = (p, q, oy, dy = -220) => on(q, p, 0, { ox: 0, oy, y: [[0, dy], [.42, 0, 'in']], sy: [[.42, .86], [.56, 1.06, 'out'], [.7, 1]], sx: [[.42, 1.1], [.56, .97, 'out'], [.7, 1]], o: [[0, 0], [.1, 1]] });
  const grow = (p, q, at, oy, ox = 0) => on(q, p, at, { ox, oy, sy: [[0, 0], [.45, 1.06, 'out'], [.6, .98], [.72, 1, 'soft']], o: [[0, 0], [.05, 1]] });
  const show = (p, q) => on(q, p, 0, { o: [[0, 0], [.01, 1]] });
  const flash = (a, b) => [[0, 0], [a, 0], [a + .02, 1], [b, 0]];
  const shakeKeys = (n, amp, step = .05) => { const k = [[0, 0]]; for (let i = 1; i <= n; i++) k.push([i * step, i % 2 ? -amp : amp, 'lin']); k.push([(n + 1) * step, 0, 'out']); return k; };
  const at = (keys, t0) => keys.map(([t, v, e]) => [t + t0, v, e]);
  const tubes = (q, ds, w = 30) => { ds.forEach(d => q.path(d, { sw: w })); ds.forEach(d => q.path(d, { sw: w - 7, stroke: C.fill })); };
  const ring = (q, x, y, r, w = 22) => { q.circle(x, y, r, { sw: w }); q.circle(x, y, r, { sw: w - 7, stroke: C.fill }); };
  const f1 = v => +v.toFixed(1), rad = d => d * Math.PI / 180;
  const pt = (r, a, cx = 0, cy = 0) => [f1(cx + Math.cos(rad(a)) * r), f1(cy + Math.sin(rad(a)) * r)];
  const SOFT = (w = 2) => ({ sw: w, stroke: C.soft });
  let clipN = 0;
  const clip = (q, d) => { const NS = 'http://www.w3.org/2000/svg', id = 'gl17clip' + (++clipN), cp = document.createElementNS(NS, 'clipPath'), pa = document.createElementNS(NS, 'path');
    cp.setAttribute('id', id); pa.setAttribute('d', d); cp.appendChild(pa); q.g.appendChild(cp); return `url(#${id})`; };
  const slash = (q, x1, y1, x2, y2) => { q.line(x1, y1, x2, y2, { sw: 22, stroke: C.fill }); q.line(x1, y1, x2, y2, { sw: 6 }); };
  const DOLLAR = (q, s = 1, w = 22) => tubes(q, [`M ${40 * s} ${-46 * s} Q ${40 * s} ${-70 * s} 0 ${-70 * s} Q ${-44 * s} ${-70 * s} ${-44 * s} ${-36 * s} Q ${-44 * s} ${-4 * s} 0 0 Q ${44 * s} ${4 * s} ${44 * s} ${36 * s} Q ${44 * s} ${72 * s} 0 ${72 * s} Q ${-42 * s} ${72 * s} ${-44 * s} ${48 * s}`, `M 0 ${-96 * s} L 0 ${96 * s}`], w);
  /* a business bust (people.js) at (x, y), scale s, optionally clipped to a frame; returns its parts */
  const bust = (q, x, y, s, clipD) => { const host = clipD ? sub(q, { 'clip-path': clip(q, clipD) }) : q, g = host.child({ transform: `translate(${x} ${y}) scale(${s})` }, s); return G.parts.bizUser(g, false); };
  const R = {}, rig = (name, dur, exit, fn) => { fn.custom = true; fn.dur = dur; fn.exit = exit; R[name] = fn; };

  /* hammer — winds back (anticipation), swings down and strikes the nail (it sinks a little, impact lines), bounces off and lifts again */
  rig('hammer-pro', .6, 'pop', p => {
    const intro = sub(p);
    intro.line(-60, 172, 196, 172, { sw: 4 });
    const nl = sub(intro); nl.rect(54, 150, 28, 8, { rx: 3, fill: C.fill, sw: 2.8 }); nl.line(68, 158, 68, 172, { sw: 4 });
    on(nl, p, .7, { loop: 2.4, y: [[0, 0], [1.02, 0], [1.06, 6, 'out'], [2.2, 6], [2.4, 0]] });
    const im = sub(intro); [[30, 140, 10, 124], [106, 140, 126, 124], [24, 160, 4, 160], [112, 160, 132, 160]].forEach(([a, b, c, d]) => im.line(a, b, c, d, { sw: 3 }));
    on(im, p, .7, { loop: 2.4, o: flash(1.02, 1.25), ox: 68, oy: 150, s: [[0, .7], [1.02, .7], [1.25, 1.2, 'out']] });
    const hw = sub(intro), hg = hw.child({ transform: 'translate(-160 110)' });
    hg.rect(0, -16, 214, 32, { rx: 14, fill: C.fill, sw: 3.2 }); [20, 40].forEach(x => hg.line(x, -10, x, 10, SOFT(2.2)));
    hg.rect(196, -70, 56, 112, { rx: 10, fill: C.fill, sw: 3.4 }); hg.rect(192, -24, 64, 22, { rx: 6, fill: C.fill, sw: 2.8 });
    hg.line(206, 30, 242, 30, SOFT(2)); hg.path('M 214 -60 L 224 -50 L 234 -60', SOFT(2));
    on(hw, p, .7, { loop: 2.4, ox: -160, oy: 110, r: [[0, -12], [.5, -40, 'io'], [1, 1, 'in'], [1.08, -6, 'out'], [1.2, 0], [1.6, 0], [2.4, -12, 'io']] });
    pop(p, intro);
  });

  /* link-2 — the two halves of the link slide in and lock onto the bar (click marks), hold, then ease apart again */
  rig('link-2-pro', .6, 'pop', p => {
    const intro = sub(p);
    const bar = sub(intro); tubes(bar, ['M -64 0 L 64 0'], 26);
    on(bar, p, .7, { loop: 2.4, o: [[0, .55], [.5, .55], [.55, 1], [1.6, 1], [1.9, .55]] });
    [[-1, 'M -40 -56 L -112 -56 Q -170 -56 -170 0 Q -170 56 -112 56 L -40 56'], [1, 'M 40 -56 L 112 -56 Q 170 -56 170 0 Q 170 56 112 56 L 40 56']].forEach(([sd, d]) => {
      const g = sub(intro); tubes(g, [d], 30);
      on(g, p, .7, { loop: 2.4, x: [[0, sd * 22], [.2, sd * 28, 'io'], [.52, 0, 'in'], [.58, -sd * 4], [.68, 0, 'soft'], [1.6, 0], [2.1, sd * 22, 'io']] }); });
    const ck = sub(intro); [[0, -1], [0, 1]].forEach(([a, b]) => ck.line(0, b * 30, 0, b * 50, { sw: 3 }));
    on(ck, p, .7, { loop: 2.4, o: flash(.52, .8), s: [[0, .7], [.52, .7], [.8, 1.25, 'out']] });
    pop(p, intro);
  });

  /* plug — rises and pushes its prongs into the socket (a small spark), holds, then pulls back out */
  rig('plug-pro', .6, 'pop', p => {
    const intro = sub(p);
    intro.rect(-84, -198, 168, 62, { rx: 16, fill: C.fill, sw: 3.2 }); [-30, 30].forEach(x => intro.rect(x - 6, -182, 12, 28, { rx: 4, fill: C.fill, sw: 2.6, stroke: C.soft }));
    const sp = sub(intro); [[-56, -128, -72, -112], [0, -126, 0, -106], [56, -128, 72, -112]].forEach(([a, b, c, d]) => sp.line(a, b, c, d, { sw: 3 }));
    on(sp, p, .7, { loop: 2.6, o: flash(.6, .85) });
    const pg = sub(intro);
    const cb = sub(pg, { 'clip-path': clip(pg, 'M -200 60 L 200 60 L 200 184 L -200 184 Z') }); cb.path('M 0 76 C 0 120, 60 120, 60 150 C 60 190, 20 220, 20 300', { sw: 6 });
    [-30, 30].forEach(x => pg.rect(x - 6, -92, 12, 52, { rx: 4, fill: C.fill, sw: 2.8 }));
    pg.rect(-62, -44, 124, 112, { rx: 20, fill: C.fill, sw: 3.4 }); pg.line(-40, 30, 40, 30, SOFT(2)); pg.line(-40, 44, 40, 44, SOFT(2));
    pg.rect(-20, 66, 40, 14, { rx: 5, fill: C.fill, sw: 2.6 });
    on(pg, p, .7, { loop: 2.6, y: [[0, 0], [.25, 8, 'io'], [.6, -70, 'out'], [.68, -66], [.8, -70, 'soft'], [1.7, -70], [2.1, 0, 'io']] });
    pop(p, intro);
  });

  /* power — the button is pressed: it squeezes, clicks (a flash), a ring ripples out, it springs back */
  rig('power-pro', .6, 'pop', p => {
    const intro = sub(p);
    const rp = sub(intro); rp.circle(0, 10, 150, { sw: 3 });
    on(rp, p, .7, { loop: 2.2, ox: 0, oy: 10, s: [[0, .9], [.5, .9], [1.1, 1.15, 'out']], o: [[0, 0], [.5, 0], [.52, .9], [1.1, 0]] });
    const bt = sub(intro); tubes(bt, ['M 70 -84 A 118 118 0 1 1 -70 -84', 'M 0 -132 L 0 0'], 30);
    on(bt, p, .7, { loop: 2.2, ox: 0, oy: 10, s: [[0, 1], [.3, .86, 'io'], [.5, 1.08, 'out'], [.7, 1, 'soft']] });
    pop(p, intro);
  });

  /* qr-code — a scanner frame: a bright scan line sweeps down over the code and back, the code flashes when it is read */
  rig('qr-code-pro', .6, 'pop', p => {
    const intro = sub(p);
    [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(([sx, sy]) => intro.poly([[sx * 186, sy * 140], [sx * 186, sy * 186], [sx * 140, sy * 186]], { sw: 5 }));
    const qr = sub(intro);
    [[-150, -150], [80, -150], [-150, 80]].forEach(([x, y]) => { qr.rect(x, y, 70, 70, { rx: 10, fill: C.fill, sw: 3.4 }); qr.rect(x + 20, y + 20, 30, 30, { rx: 5, fill: C.ink, sw: 1.4 }); });
    [[-40, -150], [0, -120], [-20, -80], [-150, -30], [-110, 0], [-60, -30], [10, -30], [50, 10], [90, -30], [130, 20], [10, 60], [-30, 110], [60, 90], [110, 70], [130, 130], [40, 140], [90, 130]]
      .forEach(([x, y], i) => qr.rect(x, y, 24, 24, { rx: 5, fill: i % 3 ? C.ink : C.fill, sw: 2 }));
    on(qr, p, .7, { loop: 2.6, o: [[0, 1], [1.1, 1], [1.14, .4], [1.2, 1], [1.26, .5], [1.32, 1]], s: [[0, 1], [1.1, 1], [1.2, 1.03, 'out'], [1.4, 1, 'soft']] });
    const sc = sub(intro); sc.line(-176, 0, 176, 0, { sw: 5 });
    on(sc, p, .7, { loop: 2.6, y: [[0, -170], [1.1, 170, 'io'], [2.2, -170, 'io']], o: [[0, 0], [.1, 1], [2.1, 1], [2.2, 0]] });
    pop(p, intro);
  });

  /* wifi — the signal goes out: the waves light up from the dot outward one after another, hold, then dim and repeat */
  const WAVES = [['M -52 40 A 74 74 0 0 1 52 40', 26], ['M -104 -8 A 146 146 0 0 1 104 -8', 26], ['M -156 -56 A 220 220 0 0 1 156 -56', 26]];
  rig('wifi-pro', .6, 'pop', p => {
    const intro = sub(p);
    WAVES.forEach(([d, w], i) => { const g = sub(intro); tubes(g, [d], w); const t = .2 + i * .22;
      on(g, p, .7, { loop: 2.2, o: [[0, .3], [t, .3], [t + .06, 1], [1.5, 1], [1.8, .3]], ox: 0, oy: 110, s: [[0, 1], [t, 1], [t + .1, 1.04, 'out'], [t + .3, 1, 'soft']] }); });
    const dt = sub(intro); dt.circle(0, 110, 22, { fill: C.ink, sw: 2 });
    on(dt, p, .7, { loop: 2.2, ox: 0, oy: 110, s: [[0, 1], [.05, 1.2, 'out'], [.25, 1, 'soft']] });
    pop(p, intro);
  });

  /* wifi-off — it tries to connect: the first wave flickers on, the next barely, then they all drop; the slash never lifts */
  rig('wifi-off-pro', .6, 'pop', p => {
    const intro = sub(p);
    WAVES.forEach(([d, w], i) => { const g = sub(intro); tubes(g, [d], w); const t = .3 + i * .2;
      on(g, p, .7, { loop: 2.4, o: [[0, .3], [t, .3], [t + .04, i ? .6 : 1], [t + .1, .3], [t + .14, i ? .45 : .9], [t + .3, .3]] }); });
    intro.circle(0, 110, 22, { fill: C.ink, sw: 2 });
    const sl = sub(intro); slash(sl, -160, -150, 160, 150);
    on(sl, p, .7, { loop: 2.4, s: [[0, 1], [.9, 1], [1, 1.05, 'out'], [1.2, 1, 'soft']] });
    pop(p, intro);
  });

  /* wrench — turns the nut a sixth of a turn in two strokes: each stroke takes the nut with it, then the wrench swings back alone */
  rig('wrench-pro', .6, 'spin', p => {
    const intro = sub(p), N = [91, -91];
    const nt = sub(intro), hx = []; for (let i = 0; i < 6; i++) hx.push(pt(28, i * 60 + 30, N[0], N[1]));
    nt.shape(hx, { fill: C.fill, sw: 3 }); nt.circle(N[0], N[1], 11, { fill: C.fill, sw: 2.2, stroke: C.soft });
    on(nt, p, .7, { loop: 2.4, ox: N[0], oy: N[1], r: [[0, 0], [.2, 0], [.5, 30, 'out'], [1.4, 30], [1.7, 60, 'out'], [2.4, 60]] });
    const ww = sub(intro), wg = ww.child({ transform: 'translate(70 -70) rotate(135)' });
    wg.rect(30, -20, 240, 40, { rx: 20, fill: C.fill, sw: 3.4 }); wg.line(96, 0, 222, 0, SOFT(2.4)); wg.circle(246, 0, 8, { fill: C.fill, sw: 2.6 });
    wg.path(`M ${pt(56, -160)} A 56 56 0 1 1 ${pt(56, 160)} L -14 22 L -14 -22 Z`, { fill: C.fill, sw: 3.4 });
    on(ww, p, .7, { loop: 1.2, ox: N[0], oy: N[1], r: [[0, 0], [.2, -4, 'io'], [.5, 30, 'out'], [.7, 30], [1.05, 0, 'io'], [1.2, 0]] });
    on(intro, p, 0, { ox: 0, oy: 0, s: [[0, .3], [.5, 1.06, 'out'], [.65, 1]], r: [[0, -90], [.6, 0, 'out']], o: [[0, 0], [.15, 1]] });
  });

  /* badge-dollar-sign — the scalloped badge turns one scallop with a pop while the dollar sign stays upright and bounces */
  rig('badge-dollar-sign-pro', .6, 'spin', p => {
    const intro = sub(p), bd = sub(intro), n = 12; let d = '';
    for (let i = 0; i < n; i++) { const a0 = i * 30 - 90, [x0, y0] = pt(136, a0), [cx, cy] = pt(176, a0 + 15), [x1, y1] = pt(136, a0 + 30); d += (i ? '' : `M ${x0} ${y0}`) + ` Q ${cx} ${cy} ${x1} ${y1}`; }
    bd.path(d + ' Z', { fill: C.fill, sw: 3.4 }); bd.circle(0, 0, 114, SOFT(2.2));
    on(bd, p, .7, { loop: 2.4, r: [[0, 0], [.3, -4, 'io'], [.7, 33, 'out'], [.9, 30, 'soft'], [2.4, 30]], s: [[0, 1], [.3, .95, 'io'], [.6, 1.05, 'out'], [.85, 1, 'soft']] });
    const dl = sub(intro); DOLLAR(dl, .82, 22);
    on(dl, p, .7, { loop: 2.4, ox: 0, oy: 80, y: [[0, 0], [.55, 0], [.7, -14, 'out'], [.88, 0, 'in'], [.94, 2], [1, 0]] });
    on(intro, p, 0, { s: [[0, .3], [.5, 1.06, 'out'], [.65, 1]], r: [[0, -90], [.6, 0, 'out']], o: [[0, 0], [.15, 1]] });
  });

  /* calculator — four keys get pressed one after another (each dips and lights), the display flickers as it updates */
  rig('calculator-pro', .7, 'squash', p => {
    const intro = sub(p);
    intro.rect(-130, -172, 260, 344, { rx: 26, fill: C.fill, sw: 3.4 });
    const ds = sub(intro); ds.rect(-104, -146, 208, 74, { rx: 10, fill: C.fill, sw: 2.8 }); ds.text('128', 86, -92, { size: 46, weight: 700, anchor: 'end' });
    on(ds, p, .7, { loop: 2.4, o: [[0, 1], [1.7, 1], [1.73, .3], [1.78, 1], [1.82, .4], [1.86, 1]] });
    const press = { '0,1': .2, '1,2': .5, '2,0': .8, '3,3': 1.1 };
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) { const x = -104 + c * 54, y = -50 + r * 52, k = sub(intro), op = c === 3;
      k.rect(x, y, 46, 44, { rx: 10, fill: C.fill, sw: op ? 2.8 : 2.4, stroke: op ? C.ink : C.soft });
      const t = press[r + ',' + c]; if (t != null) on(k, p, .7, { loop: 2.4, ox: x + 23, oy: y + 22, s: [[0, 1], [t, 1], [t + .06, .84, 'out'], [t + .22, 1, 'soft']], o: [[0, 1], [t, 1], [t + .02, .5], [t + .2, 1]] }); }
    grow(p, intro, 0, 172);
  });

  /* circle-dollar-sign — the coin flips on its axis twice (it narrows to its edge and back), then lands with a little bounce */
  rig('circle-dollar-sign-pro', .6, 'spin', p => {
    const intro = sub(p), cn = sub(intro);
    cn.circle(0, 0, 160, { fill: C.fill, sw: 3.4 }); cn.circle(0, 0, 132, SOFT(2.2)); DOLLAR(cn, .9, 22);
    on(cn, p, .7, { loop: 2.6, sx: [[0, 1], [1.3, 1], [1.5, .08, 'in'], [1.7, 1, 'out'], [1.9, .08, 'in'], [2.1, 1, 'out']], y: [[0, 0], [1.3, 0], [1.7, -30, 'out'], [2.1, 0, 'in'], [2.18, -6], [2.28, 0]] });
    on(intro, p, 0, { s: [[0, .3], [.5, 1.06, 'out'], [.65, 1]], r: [[0, -90], [.6, 0, 'out']], o: [[0, 0], [.15, 1]] });
  });

  /* clipboard-check — the big check draws itself onto the sheet with a pop, the board gives a little bounce; then it clears */
  rig('clipboard-check-pro', .7, 'sink', p => {
    const intro = sub(p), bO = sub(intro), bd = sub(bO);
    bd.rect(-130, -150, 260, 326, { rx: 18, fill: C.fill, sw: 3.4 }); bd.rect(-108, -112, 216, 268, { rx: 8, sw: 1.8, stroke: C.soft });
    [[-80, 110, 80], [-80, 136, 30]].forEach(([x1, y, x2]) => bd.line(x1, y, x2, y, SOFT(3)));
    const ckO = sub(bd), ck = ckO.poly([[-70, 6], [-20, 56], [74, -50]], { sw: 14 });
    on(ck, p, .7, { loop: 2.6, draw: [[0, 0], [.2, 0], [.55, 1, 'out'], [2.2, 1], [2.4, 0, 'in']] });
    on(ckO, p, .7, { loop: 2.6, ox: 0, oy: 0, s: [[0, 1], [.5, 1], [.6, 1.14, 'out'], [.8, 1, 'soft']] });
    const cl = sub(bd); cl.path('M -50 -140 L -50 -160 Q -50 -176 -34 -176 L 34 -176 Q 50 -176 50 -160 L 50 -140 Z', { fill: C.fill, sw: 3.2 }); cl.rect(-62, -146, 124, 30, { rx: 10, fill: C.fill, sw: 3.2 }); cl.circle(0, -162, 7, { fill: C.fill, sw: 2.4 });
    on(bd, p, .7, { loop: 2.6, ox: 0, oy: 176, sy: [[0, 1], [.55, 1], [.62, .97, 'out'], [.76, 1.01], [.88, 1, 'soft']] });
    drop(p, bO, 0, -120);
  });

  /* contact — a contact card on its rings: the person on it nods, the detail lines type in one after another */
  rig('contact-pro', .6, 'pop', p => {
    const intro = sub(p), cd = sub(intro);
    [-80, 80].forEach(x => cd.rect(x - 12, -146, 24, 46, { rx: 8, fill: C.fill, sw: 3 }));
    cd.rect(-182, -120, 364, 252, { rx: 24, fill: C.fill, sw: 3.4 });
    const fr = 'M -156 -82 L -16 -82 L -16 104 L -156 104 Z'; cd.rect(-156, -82, 140, 186, { rx: 12, fill: C.fill, sw: 2.4, stroke: C.soft });
    const b = bust(cd, -86, 18, .4, fr);
    on(b.head, p, .7, { loop: 2.8, ox: 0, oy: 6, r: [[0, 0], [.3, 0], [.45, 6, 'out'], [.7, -3, 'io'], [.9, 0, 'soft']] });
    [[14, -50, 150, 1], [14, -6, 130, 0], [14, 38, 150, 0], [14, 82, 100, 0]].forEach(([x1, y, x2, ink], i) => { const l = cd.line(x1, y, x2, y, ink ? { sw: 5 } : SOFT(3.2));
      on(l, p, .7, { loop: 2.8, draw: [[0, 1], [1.2, 1], [1.24, 0], [1.4 + i * .18, 0], [1.7 + i * .18, 1, 'out'], [2.8, 1]] }); });
    on(cd, p, .7, { loop: 2.8, ox: 0, oy: 132, sy: [[0, 1], [1.2, 1], [1.28, .97, 'out'], [1.42, 1.01], [1.55, 1, 'soft']] });
    pop(p, intro);
  });

  /* credit-card — the card tilts in for a contactless tap: the waves pulse out from it, it eases back */
  rig('credit-card-pro', .6, 'slide', p => {
    const intro = sub(p);
    const cO = sub(intro), cd = sub(cO);
    cd.rect(-182, -112, 364, 232, { rx: 22, fill: C.fill, sw: 3.4 });
    cd.rect(-146, -62, 66, 50, { rx: 9, fill: C.fill, sw: 2.8 }); cd.line(-146, -37, -80, -37, SOFT(1.8)); cd.line(-113, -62, -113, -12, SOFT(1.8));
    [0, 1, 2].forEach(i => { const a = cd.path(`M ${-56 + i * 14} ${-58 - i * 4} Q ${-44 + i * 16} -37 ${-56 + i * 14} ${-16 + i * 4}`, { sw: 3 });
      on(a, p, .7, { loop: 2.4, o: [[0, .35], [.5 + i * .1, .35], [.54 + i * .1, 1], [1 + i * .1, .35]] }); });
    [-146, -72, 2, 76].forEach(x => cd.line(x, 40, x + 54, 40, SOFT(4)));
    cd.line(-146, 82, -40, 82, SOFT(3)); cd.line(110, 82, 146, 82, SOFT(3));
    on(cd, p, .7, { loop: 2.4, ox: 0, oy: 120, r: [[0, 0], [.2, 2, 'io'], [.5, -8, 'out'], [1.2, -8], [1.6, 0, 'io']], y: [[0, 0], [.5, -14, 'out'], [1.2, -14], [1.6, 0, 'io']] });
    on(cO, p, 0, { x: [[0, -300], [.55, 0, 'out']], o: [[0, 0], [.15, 1]] });
  });

  /* file-text — the text lines type in one after another, the page settles with a small bounce and its corner fold flicks */
  rig('file-text-pro', .7, 'sink', p => {
    const intro = sub(p), pO = sub(intro), pg = sub(pO);
    pg.path('M -104 -172 L 60 -172 L 130 -102 L 130 160 Q 130 176 114 176 L -104 176 Q -120 176 -120 160 L -120 -156 Q -120 -172 -104 -172 Z', { fill: C.fill, sw: 3.4 });
    const fd = sub(pg); fd.path('M 60 -172 L 60 -116 Q 60 -102 74 -102 L 130 -102', { fill: C.fill, sw: 3 });
    on(fd, p, .7, { loop: 2.6, ox: 60, oy: -102, s: [[0, 1], [1.9, 1], [2, .8, 'out'], [2.2, 1, 'soft']] });
    [[-84, -108, 20, 1], [-84, -50, 92, 0], [-84, -10, 92, 0], [-84, 30, 92, 0], [-84, 70, 60, 0], [-84, 120, 30, 0]].forEach(([x1, y, x2, ink], i) => { const l = pg.line(x1, y, x2, y, ink ? { sw: 6 } : SOFT(3.4));
      on(l, p, .7, { loop: 2.6, draw: [[0, 0], [.1 + i * .15, 0], [.35 + i * .15, 1, 'out'], [2.6, 1]] }); });
    on(pg, p, .7, { loop: 2.6, ox: 0, oy: 176, sy: [[0, 1], [1.5, 1], [1.58, .97, 'out'], [1.72, 1.01], [1.85, 1, 'soft']] });
    drop(p, pO, 0, -120);
  });

  /* goal — a flag planted on the target: it waves, and rings ripple out across the ground from the pole */
  rig('goal-pro', .7, 'rise', p => {
    const intro = sub(p); show(p, intro);
    [[150, 30, C.soft, 2.4], [96, 19, C.soft, 2.4], [44, 9, C.ink, 3]].forEach(([rx, ry, st, w]) => intro.ellipse(-20, 150, rx, ry, { fill: C.fill, sw: w, stroke: st }));
    const rp = sub(intro); rp.ellipse(-20, 150, 44, 9, { sw: 3 });
    on(rp, p, .7, { loop: 2, ox: -20, oy: 150, s: [[0, 1], [1.4, 3.4, 'out']], o: [[0, 1], [1.4, 0]] });
    const fO = sub(intro), fl = sub(fO);
    fl.line(-20, 150, -20, -170, { sw: 5 }); fl.circle(-20, -176, 8, { fill: C.fill, sw: 3 });
    const fg = sub(fl); fg.path('M -20 -160 Q 40 -176 100 -158 Q 150 -144 170 -150 L 170 -70 Q 150 -64 100 -78 Q 40 -96 -20 -80 Z', { fill: C.fill, sw: 3.2 });
    fg.path('M 6 -142 Q 50 -152 92 -140', SOFT(2)); fg.circle(74, -116, 16, SOFT(2.2));
    on(fg, p, .7, { loop: 1.2, ox: -20, oy: -120, ky: [[0, 0], [.3, 5, 'io'], [.9, -5, 'io'], [1.2, 0, 'io']], sx: [[0, 1], [.3, .94, 'io'], [.6, 1, 'io'], [.9, .95, 'io'], [1.2, 1, 'io']] });
    on(fO, p, 0, { ox: -20, oy: 150, y: [[0, -200], [.4, 0, 'in']], sy: [[.4, .92], [.5, 1.04, 'out'], [.62, 1]], o: [[0, 0], [.1, 1]] });
  });

  /* id-card — hangs from its lanyard and swings (the card lags the clip — follow-through), the person on the photo nods */
  rig('id-card-pro', .7, 'rise', p => {
    const intro = sub(p), sw = sub(intro);
    sw.path('M -10 -118 L -40 -198 M 10 -118 L 40 -198', { sw: 4 }); sw.rect(-16, -124, 32, 30, { rx: 8, fill: C.fill, sw: 3 });
    const cd = sub(sw);
    cd.rect(-182, -98, 364, 232, { rx: 22, fill: C.fill, sw: 3.4 }); cd.rect(-30, -84, 60, 12, { rx: 6, sw: 2.2, stroke: C.soft });
    const fr = 'M -152 -48 L -24 -48 L -24 106 L -152 106 Z'; cd.rect(-152, -48, 128, 154, { rx: 10, fill: C.fill, sw: 2.8 });
    const b = bust(cd, -88, 40, .36, fr);
    on(b.head, p, .7, { loop: 2.6, ox: 0, oy: 6, r: [[0, 0], [.9, 0], [1.05, 6, 'out'], [1.3, -3, 'io'], [1.5, 0, 'soft']] });
    cd.line(4, -30, 150, -30, { sw: 6 }); [[4, 12, 130], [4, 50, 150], [4, 88, 96]].forEach(([a, y, b2]) => cd.line(a, y, b2, y, SOFT(3.2)));
    on(cd, p, .7, { loop: 2.6, ox: 0, oy: -110, r: [[0, 0], [.3, 0], [.8, 3, 'soft'], [1.5, -2.5, 'soft'], [2.1, 1, 'soft'], [2.6, 0, 'soft']] });
    on(sw, p, .7, { loop: 2.6, ox: 0, oy: -198, r: [[0, 0], [.7, 2.5, 'soft'], [1.4, -2, 'soft'], [2, 1, 'soft'], [2.6, 0, 'soft']] });
    on(intro, p, 0, { ox: 0, oy: -198, y: [[0, -150], [.45, 0, 'back']], r: [[0, 0], [.4, 0], [.5, 4, 'out'], [.7, -2, 'io'], [.9, 0, 'soft']], o: [[0, 0], [.15, 1]] });
  });

  /* landmark — the pillared building rises from its steps; the small flag on the roof waves */
  rig('landmark-pro', .8, 'squash', p => {
    const intro = sub(p); show(p, intro);
    const st = sub(intro); st.rect(-186, 150, 372, 24, { rx: 6, fill: C.fill, sw: 3.2 }); st.rect(-166, 128, 332, 24, { rx: 6, fill: C.fill, sw: 3.2 });
    grow(p, st, 0, 174);
    [-120, -40, 40, 120].forEach((x, i) => { const c = sub(intro); c.rect(x - 22, -40, 44, 168, { rx: 4, fill: C.fill, sw: 3.2 }); c.line(x, -26, x, 114, SOFT(2));
      c.rect(x - 28, -46, 56, 14, { rx: 4, fill: C.fill, sw: 2.6 }); c.rect(x - 28, 116, 56, 12, { rx: 4, fill: C.fill, sw: 2.6 }); grow(p, c, .15 + i * .06, 128); });
    const rf = sub(intro); rf.rect(-176, -62, 352, 24, { rx: 6, fill: C.fill, sw: 3.2 }); rf.shape([[-186, -64], [0, -150], [186, -64]], { fill: C.fill, sw: 3.4 }); rf.shape([[-130, -76], [0, -128], [130, -76]], SOFT(2));
    rf.circle(0, -94, 12, { fill: C.fill, sw: 2.4, stroke: C.soft });
    const fl = sub(rf); fl.line(0, -150, 0, -196, { sw: 3.4 }); const fg = sub(fl); fg.shape([[0, -196], [40, -186], [0, -174]], { fill: C.fill, sw: 2.8 });
    on(fg, p, .8, { loop: .9, ox: 0, oy: -185, ky: [[0, 0], [.22, 10, 'io'], [.67, -10, 'io'], [.9, 0, 'io']], sx: [[0, 1], [.22, .88, 'io'], [.45, 1, 'io'], [.67, .9, 'io'], [.9, 1, 'io']] });
    on(rf, p, .4, { y: [[0, -120], [.35, 0, 'in'], [.42, 5], [.55, 0, 'soft']], o: [[0, 0], [.08, 1]] });
  });

  /* percent — the sign squeezes, then spins half a turn (it reads the same upside down) with overshoot and settles */
  rig('percent-pro', .6, 'spin', p => {
    const intro = sub(p), pc = sub(intro);
    tubes(pc, ['M 120 -130 L -120 130'], 30); ring(pc, -84, -90, 48, 26); ring(pc, 84, 90, 48, 26);
    on(pc, p, .7, { loop: 2.4, r: [[0, 0], [.3, -10, 'io'], [.8, 188, 'out'], [1, 180, 'soft'], [2.4, 180]], s: [[0, 1], [.3, .9, 'io'], [.7, 1.08, 'out'], [1, 1, 'soft']] });
    pop(p, intro);
  });

  /* piggy-bank (redrawn 2026-11-12, ref-detail style; idea from the user's reference, not copied) — a plump pig in 3/4 view:
     the coin drops onto the slot and rests half in, wobbles, then sinks in with a clink: the pig squashes, its tail and ear flick, it blinks */
  rig('piggy-bank-pro', .6, 'pop', p => {
    const W = (w = 2) => ({ sw: w }), F = (w = 3.2) => ({ fill: C.fill, sw: w });
    const intro = sub(p), pg = sub(intro);
    /* far side (drawn first, the body covers their roots): far legs, far ear, tail */
    const leg = (x, y0, y1, w0, w1, sw) => pg.path(`M ${x - w0} ${y0} L ${x - w1} ${y1 - 10} Q ${x - w1} ${y1} ${x - w1 + 10} ${y1} L ${x + w1 - 10} ${y1} Q ${x + w1} ${y1} ${x + w1} ${y1 - 10} L ${x + w0} ${y0} Z`, F(sw));
    leg(-114, 96, 150, 19, 16, 3); leg(104, 70, 146, 19, 16, 3);
    pg.path('M 92 -70 Q 108 -104 140 -116 Q 154 -120 152 -104 Q 148 -70 128 -42 Z', F(3));
    pg.path('M 108 -78 Q 120 -96 140 -104', W(1.8));
    const tl = sub(pg);
    tl.path('M -166 10 C -184 6, -196 -10, -186 -22 C -176 -32, -160 -22, -168 -12 C -176 -2, -194 6, -190 24', { sw: 4.2 });
    [[-72, 108, 168], [70, 106, 166]].forEach(([x, y0, y1]) => { leg(x, y0, y1, 24, 21, 3.2); pg.line(x, y1 - 13, x, y1 - 2, W(2)); });
    /* body + belly line (inside the outline) */
    pg.ellipse(-12, 18, 160, 128, F(3.4));
    pg.path('M -128 90 Q -100 126 -40 132', W(1.8));
    /* snout: a short barrel — its root meets the face in a curve, nostrils on the front face */
    pg.path('M 132 -2 L 158 -4 A 26 37 0 0 1 158 70 L 132 68 A 20 35 0 0 1 132 -2 Z', F(3));
    pg.ellipse(158, 33, 26, 37, F(3)); [149, 167].forEach(x => pg.ellipse(x, 33, 4.2, 8.5, W(2.4)));
    /* eyes (blink) */
    const eyes = sub(pg); eyes.dot(90, -12, 7.5); eyes.dot(126, -22, 5.5);
    /* near ear lies on the body and flicks */
    const er = sub(pg);
    er.path('M 26 -84 Q 44 -124 84 -134 Q 98 -136 96 -122 Q 92 -96 74 -76 Q 50 -70 26 -84 Z', F(3));
    er.path('M 44 -88 Q 58 -110 84 -122', W(1.8));
    /* coin slot on the back */
    pg.rect(-78, -98, 88, 14, Object.assign({ rx: 7 }, F(2.8)));
    /* the coin: rim thickness + face + $, clipped at the slot so it really goes in */
    const hole = sub(intro, { 'clip-path': clip(intro, 'M -220 -280 L 220 -280 L 220 -91 L -220 -91 Z') }), cn = sub(hole);
    cn.ellipse(-42, -107, 32, 37, F(3)); cn.ellipse(-34, -107, 32, 37, F(3));
    cn.path('M -25 -119 Q -25 -127 -34 -127 Q -44 -127 -44 -117 Q -44 -109 -34 -107 Q -24 -105 -24 -96 Q -24 -87 -34 -87 Q -42 -87 -44 -94 M -34 -133 L -34 -81', W(2.6));
    on(cn, p, .7, { loop: 2.6, ox: -34, oy: -91,
      y: [[0, -50], [.12, -50], [.42, 0, 'in'], [.5, -7, 'out'], [.58, 0, 'in'], [.95, 0], [1.2, 84, 'in'], [2.6, 84]],
      r: [[0, 0], [.58, 0], [.66, -6, 'out'], [.76, 4, 'io'], [.88, 0, 'soft'], [2.6, 0]],
      o: [[0, 0], [.12, 0], [.2, 1], [1.2, 1], [1.22, 0], [2.6, 0]] });
    /* clink: three short strokes spring from the slot as the coin lands inside */
    const ck = sub(intro); [-150, -90, -30].forEach(a => { const r0 = 46, r1 = 64, c = Math.cos(a * Math.PI / 180), s = Math.sin(a * Math.PI / 180);
      ck.line(-34 + c * r0, -91 + s * r0, -34 + c * r1, -91 + s * r1, { sw: 3.2 }); });
    on(ck, p, .7, { loop: 2.6, ox: -34, oy: -91, o: flash(1.2, 1.5), s: [[0, .7], [1.2, .7], [1.4, 1.1, 'out'], [2.6, 1.1]] });
    on(pg, p, .7, { loop: 2.6, ox: 0, oy: 168, sy: [[0, 1], [1.18, 1], [1.26, .93, 'out'], [1.42, 1.04, 'out'], [1.58, .99], [1.7, 1, 'soft']],
      sx: [[0, 1], [1.18, 1], [1.26, 1.05, 'out'], [1.42, .98, 'out'], [1.58, 1.005], [1.7, 1, 'soft']] });
    on(tl, p, .7, { loop: 2.6, ox: -166, oy: 10, r: [[0, 0], [1.22, 0], [1.32, 18, 'out'], [1.5, -14, 'io'], [1.68, 8, 'io'], [1.86, 0, 'soft']] });
    on(er, p, .7, { loop: 2.6, ox: 50, oy: -80, r: [[0, 0], [1.24, 0], [1.34, -12, 'out'], [1.52, 6, 'io'], [1.7, 0, 'soft']] });
    on(eyes, p, .7, { loop: 2.6, ox: 108, oy: -17, sy: [[0, 1], [2.0, 1], [2.05, .12, 'in'], [2.13, 1, 'out']] });
    pop(p, intro);
  });

  Object.assign(G.icons, R);
  const names = ['hammer', 'link-2', 'plug', 'power', 'qr-code', 'wifi', 'wifi-off', 'wrench', 'badge-dollar-sign', 'calculator',
    'circle-dollar-sign', 'clipboard-check', 'contact', 'credit-card', 'file-text', 'goal', 'id-card', 'landmark', 'percent', 'piggy-bank'];
  const ALIAS = Object.fromEntries(names.map(n => [n, n + '-pro'])); Object.assign(ALIAS, { bank: 'landmark-pro', qr: 'qr-code-pro' });
  for (const [a, pro] of Object.entries(ALIAS)) { if (G.icons[a] && !G.icons[a + '-basic'] && !G.icons[a].custom) G.icons[a + '-basic'] = G.icons[a]; G.icons[a] = R[pro]; }
  G.PRO17 = names.map(n => n + '-pro');
})();
