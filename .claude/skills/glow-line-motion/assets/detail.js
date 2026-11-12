/* detail.js — high-detail line drawings (static first; rig them for motion once approved).
   Same glow language, but three line weights (3 main · 1.6 detail · 0.9–1.2 fine), inner contours, facets,
   textures and ornaments. Best shown with filter 'glowS' so fine lines stay crisp. Registered as GL.icons['heart-…-hd']. */
(function () {
  const G = window.GL, C = G.C, P = G.parts, NS = 'http://www.w3.org/2000/svg';
  const BASE = 'M 0 70 C -96 8, -86 -72, -38 -72 C -14 -72, 0 -54, 0 -38 C 0 -54, 14 -72, 38 -72 C 86 -72, 96 8, 0 70 Z';
  /* heart path scaled by s and moved to (X, Y) */
  const H = (s, X = 0, Y = 0, base = BASE) => base.replace(/(-?[\d.]+) (-?[\d.]+)/g, (_, a, b) => `${(+a * s + X).toFixed(1)} ${(+b * s + Y).toFixed(1)}`);
  /* points evenly spaced along any path string */
  function sample(d, n, closed = true) {
    const svg = document.querySelector('svg'), e = document.createElementNS(NS, 'path'); e.setAttribute('d', d); svg.appendChild(e);
    const L = e.getTotalLength(), pts = []; for (let i = 0; i < n; i++) { const q = e.getPointAtLength(L * i / (closed ? n : n - 1)); pts.push([q.x, q.y]); }
    e.remove(); return pts;
  }
  const star4 = (p, x, y, r, o = {}) => p.path(`M ${x} ${y - r} Q ${x + r * .16} ${y - r * .16} ${x + r} ${y} Q ${x + r * .16} ${y + r * .16} ${x} ${y + r} Q ${x - r * .16} ${y + r * .16} ${x - r} ${y} Q ${x - r * .16} ${y - r * .16} ${x} ${y - r} Z`, Object.assign({ fill: C.ink, sw: 1.2 }, o));
  const FINE = { sw: 1, stroke: C.soft }, MID = { sw: 1.7 };
  const D = {}, d = (name, fn) => { D[name] = fn; };

  /* 1 gem — faceted crystal heart */
  d('heart-gem-hd', p => {
    const out = H(2.05), inn = H(1.02, 0, -8), po = sample(out, 24), pi = sample(inn, 12);
    p.path(out, { fill: C.fill, sw: 3.2 });
    po.forEach(([x, y], i) => { const [a, b] = pi[Math.floor(i / 2) % 12]; p.line(x, y, a, b, FINE); });
    pi.forEach(([x, y], i) => { const [a, b] = pi[(i + 1) % 12]; p.line(x, y, a, b, MID); p.line(x, y, 0, -12, { sw: .8, stroke: C.mute }); });
    p.path(H(1.84), { sw: .9, stroke: C.mute });
    p.path('M -128 -40 Q -126 -96 -82 -112', { sw: 4 }); p.path('M -110 -30 Q -110 -66 -84 -84', { sw: 1.4 });
    p.dot(-134, -14, 3.2); star4(p, -100, -140, 15); star4(p, 140, -118, 10); star4(p, 120, 96, 8); p.dot(150, -70, 2.4); p.dot(-150, 70, 2);
  });

  /* 2 contour — topographic rings with a dotted ring and a solid core */
  d('heart-contour-hd', p => {
    for (let i = 0; i < 10; i++) { const sc = 2.1 - i * .19;
      p.path(H(sc, 0, i * 1.6), i === 0 ? { fill: C.fill, sw: 3.2 } : i === 9 ? { fill: C.ink, sw: 1.6 } : i % 2 ? { sw: 2 } : FINE); }
    sample(H(1.43, 0, 4), 46).forEach(([x, y]) => p.dot(x, y, 1.9, { stroke: C.soft, fill: C.soft }));
    const o1 = sample(H(2.24), 64), o2 = sample(H(2.36), 64);
    o1.forEach(([x, y], i) => { if (i % 2 === 0) p.line(x, y, o2[i][0], o2[i][1], { sw: 1.2, stroke: C.soft }); });
    p.path('M -132 -30 Q -132 -92 -86 -112', { sw: 3.6 });
  });

  /* 3 monitor — heart-rate screen with grid, ECG trace and readout */
  d('heart-monitor-hd', p => {
    p.rect(-34, 112, 68, 30, { rx: 6, fill: C.fill, sw: 2.6 }); p.rect(-90, 140, 180, 16, { rx: 8, fill: C.fill, sw: 2.6 });
    p.rect(-186, -138, 372, 254, { rx: 24, fill: C.fill, sw: 3.2 });
    p.rect(-172, -124, 344, 214, { rx: 14, sw: 1.4, stroke: C.soft });
    for (let x = -160; x <= 160; x += 20) p.line(x, -112, x, 78, { sw: x % 80 === 0 ? .9 : .6, stroke: x % 80 === 0 ? C.mute : C.rule });
    for (let y = -112; y <= 78; y += 19) p.line(-160, y, 160, y, { sw: .6, stroke: C.rule });
    const tr = [[-160, 20], [-96, 20], [-84, 8], [-72, 20], [-52, 20], [-40, -76], [-26, 72], [-12, 20], [20, 20], [34, -4], [48, 20], [96, 20], [108, 8], [120, 20], [140, 20]];
    p.poly(tr.map(([x, y]) => [x + 4, y + 4]), { sw: 1.2, stroke: C.mute }); p.poly(tr, { sw: 3.4 });
    p.circle(140, 20, 6, { fill: C.ink, sw: 1.4 }); p.circle(140, 20, 14, FINE); p.circle(140, 20, 22, { sw: .7, stroke: C.mute });
    p.path(H(.3, -142, -94), { fill: C.ink, sw: 1.4 }); p.text('72', -100, -84, { size: 30 }); p.text('BPM', -58, -86, { size: 15, color: C.soft });
    [-150, -130, -110].forEach((x, i) => p.rect(x + 280, -102, 12, 6, { rx: 2, sw: 1, stroke: i ? C.mute : C.ink }));
    [120, 140, 160].forEach(x => p.circle(x, 103, 3.5, { sw: 1.2, stroke: C.soft })); p.line(-150, 103, -90, 103, { sw: 1.2, stroke: C.soft });
  });

  /* 4 calligraphy — one continuous inked stroke with an echo line and flourishes */
  d('heart-script-hd', p => {
    const q = p.child({ transform: 'scale(1.55)' }, 1.55);
    const L = 'M -125 110 C -80 112, -40 100, 0 70 C -96 8, -86 -72, -38 -72 C -14 -72, 0 -54, 0 -38 C 0 -54, 14 -72, 38 -72 C 86 -72, 96 8, 0 70 C 34 92, 70 74, 62 52 C 54 32, 26 48, 40 72 C 56 98, 96 112, 125 110';
    q.child({ transform: 'translate(3.5 3.5)' }).path(L, { sw: .9, stroke: C.soft });
    q.path(L, { sw: 2.6 });
    q.path('M -125 110 C -140 108, -148 98, -138 92 C -130 88, -126 98, -134 102', { sw: 1.4 });
    q.path('M 125 110 C 140 108, 148 98, 138 92 C 130 88, 126 98, 134 102', { sw: 1.4 });
    q.dot(-139, 96, 2.4); q.dot(139, 96, 2.4);
    q.path('M -52 -52 Q -66 -40 -64 -18', { sw: 2.4 }); q.path('M -46 -44 Q -56 -34 -55 -20', { sw: .8, stroke: C.soft });
    star4(q, 66, -78, 9); star4(q, -84, 52, 6); q.dot(84, -50, 1.6); q.dot(-96, 20, 1.4);
  });

  /* 5 post — social post card liked with a double-tap heart */
  d('heart-post-hd', p => {
    p.rect(-164, -194, 328, 388, { rx: 26, fill: C.fill, sw: 3 });
    p.circle(-130, -160, 17, { fill: C.fill, sw: 2 }); P.bust(p, -130, -158, .2, 0, .2); p.circle(-130, -160, 22, { sw: .8, stroke: C.soft });
    p.line(-102, -166, -26, -166, { sw: 2.4 }); p.line(-102, -150, -56, -150, FINE);
    [112, 124, 136].forEach(x => p.dot(x, -160, 2.6));
    p.rect(-146, -132, 292, 206, { rx: 12, sw: 1.6, stroke: C.soft });
    p.poly([[-146, 56], [-84, -14], [-50, 18], [8, -46], [70, 28], [100, 0], [146, 40]], { sw: 1.3, stroke: C.soft });
    p.poly([[-84, -14], [-74, 6], [-90, 4]], { sw: 1, stroke: C.mute }); p.poly([[8, -46], [22, -20], [-2, -26]], { sw: 1, stroke: C.mute });
    p.circle(96, -88, 16, FINE); [0, 1, 2, 3, 4, 5, 6, 7].forEach(i => { const a = i * Math.PI / 4; p.line(96 + Math.cos(a) * 22, -88 + Math.sin(a) * 22, 96 + Math.cos(a) * 28, -88 + Math.sin(a) * 28, { sw: .9, stroke: C.soft }); });
    p.path(H(.92, 0, -30), { fill: C.ink, sw: 2 }); p.path('M -56 -48 Q -56 -72 -36 -78', { stroke: C.fill, sw: 4 });
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([a, b]) => p.line(a * 82, -30 + b * 62, a * 98, -30 + b * 76, { sw: 2.2 }));
    star4(p, -112, -104, 9); star4(p, 118, 40, 7);
    p.path(H(.26, -128, 102), { fill: C.ink, sw: 1.4 }); p.text('1,204', -82, 110, { size: 20, anchor: 'start' });
    P.bubble(p, 22, 101, 34, 24, 0, .1); P.share(p, 78, 102, .2, 0, .1); P.bookmark(p, 130, 102, .16, 0, .1);
    p.line(-146, 138, 96, 138, { sw: 1.4, stroke: C.soft }); p.line(-146, 158, 30, 158, { sw: 1, stroke: C.mute }); p.line(-146, 176, -60, 176, { sw: 1, stroke: C.mute });
  });

  /* 6 mended — broken heart pulled apart and stitched back together */
  d('heart-mended-hd', p => {
    const Z = ' L -8 40 L 8 18 L -10 -4 L 6 -22 Z';
    [-1, 1].forEach(sd => {
      const half = `M 0 -38 C 0 -54, ${sd * 14} -72, ${sd * 38} -72 C ${sd * 86} -72, ${sd * 96} 8, 0 70` + Z;
      const g = p.child({ transform: `translate(${sd * 12} 0) rotate(${sd * 5} 0 133) scale(1.95)` }, 1.95);
      g.path(half, { fill: C.fill, sw: 2.6 });
      g.child({ transform: 'translate(0 -2) scale(.86)' }, .86).path(half, { sw: .9, stroke: C.soft });
      g.path(sd < 0 ? 'M -64 -26 Q -64 -54 -40 -60' : 'M 62 -4 Q 58 22 40 38', { sw: sd < 0 ? 3 : 1.4, stroke: sd < 0 ? C.ink : C.soft });
      g.path(sd < 0 ? 'M -8 40 L -22 34 L -30 44' : 'M 8 18 L 22 12 L 26 2', { sw: .9, stroke: C.soft });
      g.path(sd < 0 ? 'M -10 -4 L -26 -10' : 'M 6 -22 L 20 -30 L 30 -26', { sw: .9, stroke: C.soft });
    });
    [-40, -4, 32, 70].forEach((y, i) => { const w = 34 - i * 4; p.line(-w, y - 8, w, y + 8, { sw: 2.2 }); p.dot(-w, y - 8, 2.4); p.dot(w, y + 8, 2.4); });
    [[-44, 170], [-6, 184], [34, 168]].forEach(([x, y], i) => p.shape([[x, y], [x + 14 - i * 2, y + 6], [x + 3, y + 16]], { fill: C.fill, sw: 1.6 }));
    star4(p, 0, -112, 12); p.dot(-26, -120, 2); p.dot(28, -104, 2);
  });

  /* 7 balloons — glossy heart balloon with a smaller one behind and a curly string */
  d('heart-balloons-hd', p => {
    p.path('M -92 0 C -70 40, -110 90, -76 130 C -50 160, -80 180, -60 200', { sw: 1, stroke: C.soft });
    p.path(H(.78, -100, -78), { fill: C.fill, sw: 2.2 }); p.path(H(.66, -100, -82), { sw: .8, stroke: C.mute }); p.path('M -138 -96 Q -138 -118 -120 -124', { sw: 2.2 });
    p.shape([[-106, -24], [-94, -24], [-100, -34]], { fill: C.fill, sw: 1.4 });
    p.path('M 30 68 C 56 88, 6 100, 26 122 C 46 142, -4 150, 22 170 C 42 186, 6 194, 16 202', { sw: 1.6 });
    p.path(H(1.5, 30, -46), { fill: C.fill, sw: 3 }); p.path(H(1.32, 30, -50), { sw: 1, stroke: C.soft });
    p.path('M -40 -64 Q -42 -112 0 -128', { sw: 4 }); p.ellipse(-30, -38, 5, 9, { sw: 1.6 }); p.path('M 92 -40 Q 96 -10 80 14', { sw: 1, stroke: C.soft });
    p.shape([[22, 76], [38, 76], [30, 62]], { fill: C.fill, sw: 2 }); p.line(22, 70, 38, 70, { sw: 1.2 }); p.line(24, 74, 36, 74, { sw: 1 });
    star4(p, 150, -150, 11); star4(p, 140, 60, 7); star4(p, -150, -150, 6); p.dot(170, -100, 2); p.dot(-170, 40, 1.8);
  });

  /* 8 ornate lock — engraved heart padlock with rivets, scrolls and a key */
  d('heart-padlock-hd', p => {
    const SH = 'M -50 -18 L -50 -92 A 50 50 0 0 1 50 -92 L 50 -18';
    p.path(SH, { sw: 21 }); p.path(SH, { sw: 14, stroke: C.fill });
    for (let i = 0; i <= 8; i++) { const a = Math.PI + i * Math.PI / 8, x = Math.cos(a) * 50, y = -92 + Math.sin(a) * 50; p.line(x * .86, -92 + (y + 92) * .86, x * 1.14, -92 + (y + 92) * 1.14, { sw: 1, stroke: C.soft }); }
    [-1, 1].forEach(sd => [-70, -50, -30].forEach(y => p.line(sd * 43, y, sd * 57, y, { sw: 1, stroke: C.soft })));
    p.path(H(1.7, 0, 46), { fill: C.fill, sw: 3.2 });
    p.path(H(1.5, 0, 40), { sw: 1.6 }); p.path(H(1.4, 0, 38), { sw: .8, stroke: C.soft });
    sample(H(1.6, 0, 43), 22).forEach(([x, y]) => p.circle(x, y, 2.6, { fill: C.fill, sw: 1.2 }));
    [-1, 1].forEach(sd => { p.path(`M ${sd * 24} -6 C ${sd * 40} -18, ${sd * 66} -14, ${sd * 66} 4 C ${sd * 66} 18, ${sd * 48} 20, ${sd * 46} 8 C ${sd * 44} 0, ${sd * 54} -2, ${sd * 56} 6`, { sw: 1.4 });
      p.path(`M ${sd * 30} 92 C ${sd * 44} 96, ${sd * 56} 84, ${sd * 52} 74`, { sw: 1.2, stroke: C.soft }); });
    p.circle(0, 34, 26, { sw: 1.6 }); p.circle(0, 34, 31, { sw: .8, stroke: C.soft });
    p.circle(0, 28, 10, { fill: C.ink, sw: 1.4 }); p.path('M -5 34 L -8 60 L 8 60 L 5 34 Z', { fill: C.ink, sw: 1.4 });
    p.path('M -100 -40 Q -102 -62 -84 -72', { sw: 3.2 });
    p.circle(132, 128, 17, { fill: C.fill, sw: 2.4 }); p.circle(132, 128, 8, { sw: 1.2, stroke: C.soft });
    p.line(149, 128, 192, 128, { sw: 3 }); p.poly([[176, 128], [176, 142], [184, 142]], { sw: 2.2 }); p.poly([[188, 128], [188, 138]], { sw: 2.2 });
  });

  /* 9 pixel — 8-bit heart, every pixel bevelled, pixel sparkles */
  d('heart-8bit-hd', p => {
    const M = ['..XX...XX..', '.XXXX.XXXX.', 'XXXXXXXXXXX', 'XXXXXXXXXXX', 'XXXXXXXXXXX', '.XXXXXXXXX.', '..XXXXXXX..', '...XXXXX...', '....XXX....', '.....X.....'];
    const c = 31, x0 = -c * 5.5, y0 = -c * 5;
    M.forEach((row, r) => [...row].forEach((ch, k) => { if (ch !== 'X') return;
      const x = x0 + k * c, y = y0 + r * c, hot = (r === 1 && (k === 1 || k === 2)) || (r === 2 && k === 1), edge = M[r - 1]?.[k] !== 'X' || M[r + 1]?.[k] !== 'X' || row[k - 1] !== 'X' || row[k + 1] !== 'X';
      p.rect(x + 2, y + 2, c - 4, c - 4, { rx: 4, fill: hot ? C.ink : C.fill, sw: edge ? 2.4 : 1.6, stroke: edge ? C.ink : C.soft });
      if (!hot) { p.rect(x + 7, y + 7, c - 14, c - 14, { rx: 2, sw: .8, stroke: C.mute }); p.line(x + 6, y + 6, x + 12, y + 6, { sw: 1.2 }); } }));
    const px = (cx, cy, s) => [[0, 0], [s, 0], [-s, 0], [0, s], [0, -s]].forEach(([a, b]) => p.rect(cx + a - s / 2, cy + b - s / 2, s, s, { rx: 1.5, fill: C.ink, sw: 1 }));
    px(-170, -160, 9); px(164, -150, 7); px(170, 110, 8); px(-160, 120, 6);
  });

  /* 10 angel — winged heart with layered feathers and a halo */
  const feather = (p, x, y, ang, len, wid, o = {}) => {        // one vane with a rounded tip + shaft, pointing along ang
    const q = p.child({ transform: `translate(${x} ${y}) rotate(${ang})` }), w = wid;
    q.path(`M 0 0 C ${len * .3} ${w * .95}, ${len * .72} ${w * 1.05}, ${len - w * .45} ${w * .55} Q ${len + w * .1} 0 ${len - w * .45} ${-w * .5} C ${len * .72} ${-w * .75}, ${len * .3} ${-w * .6}, 0 0 Z`, Object.assign({ fill: C.fill, sw: 1.8 }, o));
    q.line(4, 0, len * .88, w * .05, { sw: .8, stroke: C.soft });
    [.35, .55, .72].forEach(f => q.line(len * f, w * .04, len * f + w * .5, w * .62, { sw: .6, stroke: C.mute }));
  };
  d('heart-angel-hd', p => {
    [-1, 1].forEach(sd => {
      const w = p.child({ transform: `scale(${sd} 1)` });
      [[-176, 150, 30], [-163, 146, 30], [-150, 138, 29], [-137, 126, 27], [-124, 110, 25]].forEach(([ang, len, wid], i) => feather(w, -58 - i * 3, -10 - i * 5, ang, len, wid, { sw: 2.2 }));
      [[-170, 96, 26], [-155, 90, 25], [-140, 82, 23], [-125, 72, 21]].forEach(([ang, len, wid], i) => feather(w, -60, -8 - i * 6, ang, len, wid));
      [[-162, 52, 20], [-144, 48, 19], [-126, 42, 17]].forEach(([ang, len, wid], i) => feather(w, -62, -12 - i * 7, ang, len, wid, { sw: 1.4 }));
    });
    p.ellipse(0, -118, 62, 15, { sw: 3 }); p.ellipse(0, -118, 50, 10, { sw: .9, stroke: C.soft });
    p.path(H(1.12, 0, 6), { fill: C.fill, sw: 3 }); p.path(H(.96, 0, 2), { sw: 1, stroke: C.soft }); p.path(H(.42, 0, -2), { fill: C.ink, sw: 1.4 });
    p.path('M -66 -24 Q -66 -56 -42 -66', { sw: 3.2 });
    star4(p, -150, -150, 9); star4(p, 156, -140, 7); p.dot(0, -160, 2.4); p.dot(-30, -150, 1.6); p.dot(34, -152, 1.6);
  });

  Object.assign(G.icons, D);
  G.DETAIL = { heart: Object.keys(D) };
})();
