/* people.js — the new "user" bust (our own design, approved by the user 2026-11-12): oval face with ears and a side-parted
   hairstyle, a gap for the neck, suit shoulders with notched lapels, shirt collar points, a knotted tie with one stripe and a
   folded pocket square. It replaces every older bust icon: user, users, user-plus, user-check, user-x, user-round,
   users-round, contact-round (the old versions stay loaded under their files but every name now points here).
   Loaded last (see glowline.js loader). Entrance and loop sit on separate groups. */
(function () {
  const G = window.GL, C = G.C, P = G.parts;
  const sub = (p, attrs) => p.child(attrs || {});
  const on = (q, p, start, spec) => G.kf(q.g || q, p.t0 + start * p.ts, spec);
  const pop = (p, q, at = 0, from = .4) => on(q, p, at, { s: [[0, from], [.42, 1.08, 'out'], [.62, 1]], o: [[0, 0], [.16, 1]] });
  const rise = (p, q, at = 0, dy = 60) => on(q, p, at, { y: [[0, dy], [.55, 0, 'back']], o: [[0, 0], [.2, 1]] });
  const shakeKeys = (n, amp, step = .05) => { const k = [[0, 0]]; for (let i = 1; i <= n; i++) k.push([i * step, i % 2 ? -amp : amp, 'lin']); k.push([(n + 1) * step, 0, 'out']); return k; };
  const at = (keys, t0) => keys.map(([t, v, e]) => [t + t0, v, e]);
  const tubes = (q, ds, w = 30) => { ds.forEach(d => q.path(d, { sw: w })); ds.forEach(d => q.path(d, { sw: w - 7, stroke: C.fill })); };
  let clipN = 0;
  const clip = (q, d) => { const NS = 'http://www.w3.org/2000/svg', id = 'glppl' + (++clipN), cp = document.createElementNS(NS, 'clipPath'), pt = document.createElementNS(NS, 'path');
    cp.setAttribute('id', id); pt.setAttribute('d', d); cp.appendChild(pt); q.g.appendChild(cp); return `url(#${id})`; };
  const circ = (x, y, r) => `M ${x + r} ${y} A ${r} ${r} 0 1 0 ${x - r} ${y} A ${r} ${r} 0 1 0 ${x + r} ${y} Z`;

  /* the bust, drawn in a ±200 box (x ±172, y -186…176). Neck pivot (0, 6), tie pivot (0, 46).
     soft = a person further back (grey outline). Returns { head, body, tie } groups to animate. */
  const biz = (q, soft) => {
    const ln = soft ? C.soft : C.ink, mw = soft ? 2.8 : 3.4, body = sub(q);
    body.path('M -172 176 Q -174 112, -150 82 Q -124 52, -70 38 L -34 28 L 0 70 L 34 28 L 70 38 Q 124 52, 150 82 Q 174 112, 172 176 Z', { fill: C.fill, sw: mw, stroke: ln });
    body.path('M -34 28 L -64 44 L -30 74 L -52 96 L -6 150', { sw: 2.4, stroke: C.soft }); body.path('M 34 28 L 64 44 L 30 74 L 52 96 L 6 150', { sw: 2.4, stroke: C.soft });
    body.path('M -34 28 L 0 112 L 34 28 L 0 70 Z', { fill: C.fill, sw: 2.6, stroke: ln });
    body.path('M -34 28 L -14 60 L -2 44 Z', { fill: C.fill, sw: 2.2, stroke: ln }); body.path('M 34 28 L 14 60 L 2 44 Z', { fill: C.fill, sw: 2.2, stroke: ln });
    const tie = sub(body); tie.path('M -10 46 L 10 46 L 8 60 L -8 60 Z', { fill: C.fill, sw: 2.6, stroke: ln }); tie.path('M -8 60 L -14 106 L 0 122 L 14 106 L 8 60 Z', { fill: C.fill, sw: 2.6, stroke: ln });
    tie.line(-11, 84, 11, 76, { sw: 1.8, stroke: C.soft });
    if (!soft) { body.line(-132, 106, -92, 106, { sw: 2.6, stroke: ln }); body.path('M -126 106 L -114 86 L -100 106', { fill: C.fill, sw: 2.2, stroke: ln }); }
    const head = sub(q);
    [-1, 1].forEach(sd => head.path(`M ${sd * 60} -88 Q ${sd * 84} -90 ${sd * 80} -66 Q ${sd * 76} -46 ${sd * 58} -48 Z`, { fill: C.fill, sw: 2.8, stroke: ln }));
    head.path('M -62 -100 C -62 -150, -32 -170, 0 -170 C 34 -170, 64 -150, 62 -100 L 60 -62 C 56 -18, 32 6, 0 6 C -32 6, -56 -18, -60 -62 Z', { fill: C.fill, sw: mw, stroke: ln });
    head.path('M -66 -92 C -74 -152, -34 -188, 10 -186 C 52 -184, 80 -156, 70 -96 C 66 -112, 58 -126, 40 -132 C 18 -116, -12 -122, -30 -136 C -44 -124, -56 -110, -66 -92 Z', { fill: C.fill, sw: 3.2, stroke: ln });
    head.path('M -30 -136 C -20 -154, -2 -166, 22 -170', { sw: 2.2, stroke: C.soft });
    return { head, body, tie };
  };
  G.parts.bizUser = biz;
  /* a bust placed at (x, y) with scale s, plus its standard idle: a nod (head lags), a tie flick, a slow breath */
  const person = (p, q, x, y, s, soft, t0 = 0, T = 2.8) => {
    const w = q.child({ transform: `translate(${x} ${y}) scale(${s})` }, s), b = biz(w, soft);
    on(b.head, p, .7, { loop: T, ox: 0, oy: 6, r: [[0, 0], [t0, 0], [t0 + .18, -4, 'out'], [t0 + .42, 3, 'io'], [t0 + .7, 0, 'soft']], y: [[0, 0], [t0, 0], [t0 + .18, 5, 'out'], [t0 + .42, -3], [t0 + .7, 0, 'soft']] });
    on(b.tie, p, .7, { loop: T, ox: 0, oy: 46, r: [[0, 0], [t0 + .2, 0], [t0 + .32, 7, 'out'], [t0 + .5, -5, 'io'], [t0 + .66, 2], [t0 + .8, 0, 'soft']] });
    on(b.body, p, .7, { loop: T, ox: 0, oy: 176, sy: [[0, 1], [T / 2, 1.02, 'soft'], [T, 1, 'soft']] });
    return w;
  };
  /* a round badge at the lower right with its own pop-in and a ring pulse */
  const badge = (p, intro, mark, loopMark) => {
    const bO = sub(intro), bg = sub(bO); bg.circle(124, 104, 46, { fill: C.fill, sw: 3.4 }); const mk = sub(bg); mark(mk);
    on(bO, p, .45, { ox: 124, oy: 104, s: [[0, 0], [.4, 1.12, 'out'], [.55, 1]], r: [[0, -90], [.45, 0, 'out']] });
    if (loopMark) loopMark(mk, bg);
    const ring = sub(intro); ring.circle(124, 104, 46, { stroke: C.soft, sw: 2 }); on(ring, p, 1.2, { loop: 2.8, ox: 124, oy: 104, s: [[0, 1], [1, 1.6, 'out']], o: [[0, .8], [1, 0]] });
  };
  const R = {}, rig = (name, dur, exit, fn) => { fn.custom = true; fn.dur = dur; fn.exit = exit; R[name] = fn; };

  /* user — the person rises in; nods, flicks the tie, two soft rings pulse behind */
  rig('user-pro', .7, 'sink', p => {
    const intro = sub(p);
    [0, .5].forEach(d => { const r = sub(intro); r.circle(0, 0, 170, { stroke: C.soft, sw: 1.8 }); on(r, p, .6, { loop: 2.8, s: [[d, .9], [d + 1.2, 1.18, 'out']], o: [[d, 0], [d + .1, .7], [d + 1.2, 0]] }); });
    person(p, intro, 0, 4, .96, false, .3);
    rise(p, intro);
  });

  /* users — a colleague behind (grey), the person in front; they nod in turn */
  rig('users-pro', .8, 'sink', p => {
    const intro = sub(p); person(p, intro, 64, -26, .7, true, 1.4); person(p, intro, -40, 28, .82, false, .2);
    rise(p, intro);
  });

  /* user-plus / user-check / user-x — the person with a round badge: plus pops and turns, check draws, cross shakes "no" */
  rig('user-plus-pro', .9, 'sink', p => {
    const intro = sub(p); person(p, intro, -24, 8, .9, false, .4);
    badge(p, intro, q => { q.line(104, 104, 144, 104, { sw: 7 }); q.line(124, 84, 124, 124, { sw: 7 }); }, mk => on(mk, p, .7, { loop: 2.8, ox: 124, oy: 104, r: [[0, 0], [1.4, 0], [1.6, 96, 'out'], [1.8, 90, 'soft'], [2.8, 90]] }));
    rise(p, intro);
  });
  rig('user-check-pro', .9, 'sink', p => {
    const intro = sub(p); person(p, intro, -24, 8, .9, false, .4);
    badge(p, intro, q => { const tk = q.poly([[104, 104], [118, 120], [146, 88]], { sw: 7 }); on(tk, p, .9, { loop: 2.8, draw: [[0, 0], [.3, 1, 'out'], [2.4, 1], [2.6, 0]] }); });
    rise(p, intro);
  });
  rig('user-x-pro', .9, 'sink', p => {
    const intro = sub(p), w = person(p, intro, -24, 8, .9, false, 1.1);
    badge(p, intro, q => { q.line(108, 88, 140, 120, { sw: 7 }); q.line(140, 88, 108, 120, { sw: 7 }); }, mk => on(mk, p, .7, { loop: 2.8, ox: 124, oy: 104, r: [[0, 0], ...at(shakeKeys(5, 12, .06).slice(1), .9)] }));
    rise(p, intro);
  });

  /* user-round / users-round — the person framed in a round avatar (one, or two overlapping); nod, ring pulse */
  const avatar = (p, q, x, y, r, soft, t0) => { const a = sub(q);
    a.circle(x, y, r, { fill: C.fill, sw: soft ? 2.8 : 3.4, stroke: soft ? C.soft : C.ink });
    const cl = sub(a, { 'clip-path': clip(a, circ(x, y, r - 2)) }); person(p, cl, x, y + r * .3, r / 210, soft, t0);
    a.circle(x, y, r, { sw: soft ? 2.8 : 3.4, stroke: soft ? C.soft : C.ink }); return a; };
  rig('user-round-pro', .6, 'sink', p => {
    const intro = sub(p);
    const rp = sub(intro); rp.circle(0, 0, 168, { sw: 2, stroke: C.soft });
    on(rp, p, .7, { loop: 2.8, s: [[0, 1], [.25, 1], [1.15, 1.16, 'out']], o: [[0, 0], [.25, 0], [.27, .7], [1.15, 0]] });
    avatar(p, intro, 0, 0, 166, false, .3);
    rise(p, intro);
  });
  rig('users-round-pro', .6, 'sink', p => {
    const intro = sub(p); avatar(p, intro, 62, -46, 108, true, 1.4); avatar(p, intro, -48, 46, 128, false, .3);
    rise(p, intro);
  });

  /* contact-round — a contact card with the person on it: the card flips like a rolodex card, the person nods */
  rig('contact-round-pro', .6, 'pop', p => {
    const intro = sub(p), cd = sub(intro);
    cd.rect(-150, -140, 300, 300, { rx: 22, fill: C.fill, sw: 3.4 }); cd.rect(-130, -120, 260, 260, { rx: 14, sw: 1.8, stroke: C.soft });
    const win = sub(cd, { 'clip-path': clip(cd, 'M -128 -118 L 128 -118 L 128 138 L -128 138 Z') }); person(p, win, 0, 40, .62, false, 1.6);
    on(cd, p, .7, { loop: 2.8, ox: 0, oy: 0, sx: [[0, 1], [.5, 1], [.75, .06, 'in'], [1, 1.04, 'out'], [1.15, 1, 'soft']] });
    [-1, 1].forEach(sd => P.capsule(intro, sd * 64, -166, sd * 64, -116, 11, { sw: 2.8 }));
    pop(p, intro);
  });

  /* replace: every icon name (including aliases such as 'user', 'follow', 'user-x') that pointed at an old rig now points here */
  const old = Object.fromEntries(Object.keys(R).map(n => [n, G.icons[n]]));
  for (const k of Object.keys(G.icons)) for (const [n, fn] of Object.entries(old)) if (fn && G.icons[k] === fn) G.icons[k] = R[n];
  Object.assign(G.icons, R);
  G.PEOPLE = Object.keys(R);
})();
