/* sets.js — icon sets in the reference line style (the "20 … IDEAS" infographics the user sent):
   medium-weight white outlines, rounded everything, dark see-through bodies, one inner contour + one glint,
   puffy bubble smoke, speed lines, 4-point sparkles, illustrative props. Ten different looks per subject.
   Names: 'heart.pulse' … · 'rocket.launch' … — lists in GL.SETS.heart / GL.SETS.rocket */
(function () {
  const G = window.GL, C = G.C, P = G.parts;
  const BASE = 'M 0 70 C -96 8, -86 -72, -38 -72 C -14 -72, 0 -54, 0 -38 C 0 -54, 14 -72, 38 -72 C 86 -72, 96 8, 0 70 Z';
  const T = (d, s, X = 0, Y = 0) => d.replace(/(-?[\d.]+) (-?[\d.]+)/g, (_, a, b) => `${(+a * s + X).toFixed(1)} ${(+b * s + Y).toFixed(1)}`);
  const fine = { sw: 1.1, stroke: C.soft }, det = { sw: 1.8 };
  const star = (p, x, y, r) => p.path(`M ${x} ${y - r} Q ${x + r * .16} ${y - r * .16} ${x + r} ${y} Q ${x + r * .16} ${y + r * .16} ${x} ${y + r} Q ${x - r * .16} ${y + r * .16} ${x - r} ${y} Q ${x - r * .16} ${y - r * .16} ${x} ${y - r} Z`, { fill: C.ink, sw: 1.2 });
  /* glowing heart body: outline + inner contour + glint */
  const heart = (p, s, X = 0, Y = 0, o = {}) => {
    p.path(T(BASE, s, X, Y), Object.assign({ fill: C.fill, sw: 3 }, o));
    if (!o.plain) { p.path(T(BASE, s * .84, X, Y - 3 * s), fine); p.path(T('M -62 -22 Q -62 -50 -38 -58', s, X, Y), { sw: 3 }); }
  };
  const solidHeart = (p, s, X = 0, Y = 0) => { p.path(T(BASE, s, X, Y), { fill: C.ink, sw: 1.4 }); p.path(T('M -58 -24 Q -58 -48 -38 -54', s, X, Y), { sw: 4 * Math.min(1, s), stroke: C.fill }); };
  const puffs = (p, list) => list.forEach(([x, y, r]) => { p.circle(x, y, r, { fill: C.fill, sw: 2.2 }); p.path(`M ${x - r * .62} ${y - r * .1} A ${r * .64} ${r * .64} 0 0 1 ${x - r * .1} ${y - r * .62}`, fine); });
  /* billowing cloud: one outline with bumps of varying size along the top, flat base, a few inner curls */
  const cloud = (p, x, y, w, h, n = 5) => {
    const l = x - w / 2, step = w / n, top = i => y - h * (.32 + .68 * Math.sin(Math.PI * i / n));
    let d = `M ${l} ${y} L ${l} ${top(0).toFixed(1)}`;
    for (let i = 0; i < n; i++) { const r = step * (.62 + .12 * (i % 2)); d += ` A ${r.toFixed(1)} ${r.toFixed(1)} 0 0 1 ${(l + (i + 1) * step).toFixed(1)} ${top(i + 1).toFixed(1)}`; }
    p.path(d + ` L ${l + w} ${y} Z`, { fill: C.fill, sw: 2.6 });
    for (let i = 1; i < n - 1; i += 2) { const cx = l + (i + .5) * step, cy = top(i + .5) + step * .55; p.path(`M ${cx - step * .3} ${cy} A ${step * .34} ${step * .34} 0 0 1 ${cx + step * .3} ${cy}`, fine); }
  };
  const speed = (p, lines) => lines.forEach(([x1, y1, x2, y2]) => p.line(x1, y1, x2, y2, { sw: 2.2, stroke: C.soft }));

  /* rocket body (points up, ±80 × −150…+166 at s=1); retro = round fins, portholes, antenna */
  function rocket(p, x, y, s = 1, rot = 0, { flame = true, retro = false } = {}) {
    const q = p.child({ transform: `translate(${x} ${y}) rotate(${rot}) scale(${s})` }, s);
    if (flame) { q.path('M -20 96 Q -24 132 0 166 Q 24 132 20 96 Z', { fill: C.fill, sw: 2.6 }); q.path('M -10 96 Q -11 120 0 140 Q 11 120 10 96 Z', { fill: C.ink, sw: 1.2 }); }
    if (retro) {
      [-1, 1].forEach(sd => q.path(`M ${sd * 36} 10 C ${sd * 84} 22, ${sd * 92} 76, ${sd * 74} 104 C ${sd * 64} 90, ${sd * 54} 82, ${sd * 34} 80 Z`, { fill: C.fill, sw: 2.6 }));
      q.line(0, -120, 0, -146, { sw: 2.4 }); q.circle(0, -150, 6, { fill: C.fill, sw: 2 });
      q.path('M 0 -120 C 48 -92, 54 -20, 42 56 Q 38 86 0 88 Q -38 86 -42 56 C -54 -20, -48 -92, 0 -120 Z', { fill: C.fill, sw: 3 });
      [-58, -16, 26].forEach((yy, i) => { q.circle(0, yy, 14 - i, { fill: C.fill, sw: 2.4 }); q.circle(0, yy, 8 - i * .6, fine); });
      q.path('M -32 -62 Q -38 0 -34 52', fine); q.rect(-20, 86, 40, 10, { rx: 3, fill: C.fill, sw: 2.2 });
    } else {
      [-1, 1].forEach(sd => q.path(`M ${sd * 40} 28 L ${sd * 76} 78 Q ${sd * 80} 90 ${sd * 68} 90 L ${sd * 40} 78 Z`, { fill: C.fill, sw: 2.6 }));
      q.path('M 0 -122 C 30 -98, 40 -52, 40 0 L 40 70 Q 40 84 28 86 L -28 86 Q -40 84 -40 70 L -40 0 C -40 -52, -30 -98, 0 -122 Z', { fill: C.fill, sw: 3 });
      q.path('M -27 -80 Q 0 -88 27 -80', fine); q.line(-40, 42, 40, 42, fine);
      q.circle(0, -28, 19, { fill: C.fill, sw: 2.8 }); q.circle(0, -28, 12, fine); q.path('M -10 -36 Q -6 -44 2 -46', { sw: 2 });
      q.path('M -31 -40 Q -35 10 -33 60', fine);
      q.rect(-5, 52, 10, 40, { rx: 4, fill: C.fill, sw: 2 }); q.rect(-24, 86, 48, 11, { rx: 3, fill: C.fill, sw: 2.4 });
    }
  }
  P.rocketBody = rocket; P.puffs = puffs; P.cloud = cloud;

  const S = {}, def = (n, fn) => { S[n] = fn; };

  /* ═════ HEARTS ═════ */
  def('heart.pulse', p => {
    heart(p, 1.95);
    p.poly([[-196, 6], [-90, 6], [-72, -14], [-56, 6], [-34, 6], [-18, -92], [2, 92], [20, 6], [60, 6], [74, -20], [88, 6], [196, 6]], { sw: 3.4 });
    p.dot(-196, 6, 4); p.dot(196, 6, 4); star(p, 150, -128, 11);
  });
  def('heart.like', p => {
    p.path('M -160 -132 Q -160 -150 -142 -150 L 142 -150 Q 160 -150 160 -132 L 160 62 Q 160 80 142 80 L -30 80 L -80 128 L -74 80 L -142 80 Q -160 80 -160 62 Z', { fill: C.fill, sw: 3 });
    p.line(-136, -126, -70, -126, fine);
    solidHeart(p, 1.05, 0, -32);
    p.rect(100, -190, 84, 46, { rx: 23, fill: C.fill, sw: 2.4 }); p.text('+1', 142, -158, { size: 28 });
    star(p, -112, -70, 10); star(p, 110, 20, 8);
  });
  def('heart.cupid', p => {
    p.line(-170, -150, 150, 130, { sw: 3.6 });
    [0, 14, 28].forEach(d => { p.path(`M ${-162 + d} ${-142 + d} l -30 -6 l 12 12 Z`, { fill: C.fill, sw: 1.8 }); p.path(`M ${-162 + d} ${-142 + d} l -6 -30 l 12 12 Z`, { fill: C.fill, sw: 1.8 }); });
    heart(p, 1.7, 0, -6);
    p.line(60, 50, 150, 130, { sw: 3.6 }); p.shape([[150, 130], [124, 122], [142, 104]], { fill: C.ink, sw: 2 });
    star(p, 150, -120, 10); p.dot(-150, 110, 2.6);
  });
  def('heart.lock', p => {
    p.path('M -50 -74 L -50 -100 A 50 50 0 0 1 50 -100 L 50 -74', { sw: 20 }); p.path('M -50 -74 L -50 -100 A 50 50 0 0 1 50 -100 L 50 -74', { sw: 13, stroke: C.fill });
    heart(p, 1.7, 0, 44);
    p.circle(0, 30, 13, { fill: C.ink, sw: 1.4 }); p.path('M -6 38 L -9 66 L 9 66 L 6 38 Z', { fill: C.ink, sw: 1.4 });
    p.circle(140, 120, 18, { fill: C.fill, sw: 2.6 }); p.circle(140, 120, 8, fine); p.line(158, 120, 196, 120, { sw: 3 }); p.poly([[180, 120], [180, 134], [190, 134]], { sw: 2.4 });
  });
  def('heart.balloons', p => {
    p.path('M -86 -16 C -70 30, -36 80, -6 130', fine); p.path('M 46 50 C 40 84, 10 110, -6 130', fine);
    heart(p, .95, -88, -96); p.shape([[-96, -28], [-80, -28], [-88, -40]], { fill: C.fill, sw: 1.8 });
    heart(p, 1.4, 48, -46); p.shape([[40, 54], [56, 54], [48, 40]], { fill: C.fill, sw: 2 });
    p.path('M -6 130 C -30 120, -40 146, -6 140 C 28 146, 18 120, -6 130 Z', { fill: C.fill, sw: 2 }); p.path('M -10 140 L -24 178 M -2 140 L 12 176', { sw: 1.8 });
    star(p, 150, -150, 10); star(p, -160, 70, 7);
  });
  def('heart.broken', p => {
    const Z = ' L -8 40 L 8 18 L -10 -4 L 6 -22 Z';
    [-1, 1].forEach(sd => { const g = p.child({ transform: `translate(${sd * 10} 4) rotate(${sd * 6} 0 133) scale(1.9)` }, 1.9);
      g.path(`M 0 -38 C 0 -54, ${sd * 14} -72, ${sd * 38} -72 C ${sd * 86} -72, ${sd * 96} 8, 0 70` + Z, { fill: C.fill, sw: 3 });
      g.path(sd < 0 ? 'M -62 -22 Q -62 -50 -38 -58' : 'M 58 4 Q 52 26 36 38', { sw: sd < 0 ? 3 : 1.2, stroke: sd < 0 ? C.ink : C.soft });
      g.path(sd < 0 ? 'M -8 40 L -24 34' : 'M 8 18 L 24 10', fine); });
    [[-40, 172], [-4, 186], [30, 170]].forEach(([x, y], i) => p.shape([[x, y], [x + 14 - i * 2, y + 6], [x + 3, y + 16]], { fill: C.fill, sw: 1.8 }));
    [[-18, -120], [20, -128], [0, -150]].forEach(([x, y]) => p.line(x, y, x * 1.4, y - 14, { sw: 2, stroke: C.soft }));
  });
  def('heart.award', p => {
    [-1, 1].forEach(sd => p.path(`M ${sd * 30} 60 L ${sd * 70} 186 L ${sd * 46} 172 L ${sd * 30} 196 L ${sd * 4} 76 Z`, { fill: C.fill, sw: 2.6 }));
    const pts = []; for (let i = 0; i < 24; i++) { const a = i * Math.PI / 12, r = i % 2 ? 110 : 122; pts.push([Math.cos(a) * r, -20 + Math.sin(a) * r]); }
    p.shape(pts, { fill: C.fill, sw: 2.8 }); p.circle(0, -20, 92, { sw: 2 }); p.circle(0, -20, 84, fine);
    solidHeart(p, .95, 0, -16);
    [-1, 1].forEach(sd => [[60, -96], [86, -56]].forEach(([x, y]) => star(p, sd * x, y, 6)));
  });
  def('heart.letter', p => {
    p.rect(-110, -150, 220, 170, { rx: 8, fill: C.fill, sw: 2.6 });
    solidHeart(p, .62, 0, -96); [-30, -10].forEach((y, i) => p.line(-70, y, 70 - i * 30, y, fine));
    p.rect(-160, -60, 320, 210, { rx: 12, fill: C.fill, sw: 3 });
    p.path('M -160 -56 L 0 60 L 160 -56', { sw: 2.6 }); p.line(-152, 142, -30, 52, fine); p.line(152, 142, 30, 52, fine);
    p.circle(0, 60, 24, { fill: C.fill, sw: 2.6 }); solidHeart(p, .26, 0, 61);
    star(p, 150, -120, 10);
  });
  def('heart.health', p => {
    heart(p, 1.95);
    p.path('M -18 -70 Q -18 -78 -10 -78 L 10 -78 Q 18 -78 18 -70 L 18 -38 L 50 -38 Q 58 -38 58 -30 L 58 -10 Q 58 -2 50 -2 L 18 -2 L 18 30 Q 18 38 10 38 L -10 38 Q -18 38 -18 30 L -18 -2 L -50 -2 Q -58 -2 -58 -10 L -58 -30 Q -58 -38 -50 -38 L -18 -38 Z', { fill: C.ink, sw: 1.6 });
    p.poly([[-150, 150], [-60, 150], [-46, 130], [-30, 170], [-16, 150], [150, 150]], { sw: 2.2, stroke: C.soft });
    star(p, 150, -130, 10);
  });
  def('heart.wings', p => {
    [-1, 1].forEach(sd => { const w = p.child({ transform: `scale(${sd} 1)` });
      w.path('M -60 -20 C -100 -70, -160 -90, -196 -70 C -170 -60, -150 -46, -140 -34 C -170 -30, -186 -16, -192 4 C -160 -6, -130 -4, -116 2 C -136 14, -144 30, -146 48 C -110 30, -80 14, -56 6 Z', { fill: C.fill, sw: 2.6 });
      w.path('M -70 -14 C -110 -50, -150 -64, -180 -64', fine); w.path('M -74 0 C -120 -14, -160 -16, -180 -6', fine); w.path('M -70 10 C -100 18, -124 28, -136 40', fine); });
    heart(p, 1.2, 0, 4);
    star(p, -150, -130, 9); star(p, 150, -120, 7);
  });

  /* ═════ ROCKETS ═════ */
  def('rocket.launch', p => {
    rocket(p, 0, -40, 1);
    cloud(p, -110, 176, 150, 62, 4); cloud(p, 110, 176, 150, 62, 4); cloud(p, 0, 176, 190, 92, 5);
    p.line(-196, 176, 196, 176, { sw: 2.4 });
  });
  def('rocket.fly', p => {
    speed(p, [[-190, -40, -120, -110], [-160, 40, -70, -50], [-80, 120, 10, 30]]);
    puffs(p, [[-150, 150, 22], [-116, 118, 26], [-86, 88, 20], [-170, 110, 16]]);
    rocket(p, 30, -20, .95, 45);
    star(p, -140, -150, 10); star(p, 160, 120, 8); p.dot(110, -170, 2.4);
  });
  def('rocket.pad', p => {
    p.line(110, -160, 110, 150, { sw: 2.6 }); p.line(160, -160, 160, 150, { sw: 2.6 }); p.line(104, -160, 166, -160, { sw: 2.6 });
    for (let y = -150; y < 140; y += 40) { p.line(110, y, 160, y + 40, fine); p.line(160, y, 110, y + 40, fine); }
    p.line(60, -60, 110, -60, { sw: 2.4 }); p.line(60, 20, 110, 20, { sw: 2.4 });
    rocket(p, -10, 64, .9, 0, { flame: false });
    p.rect(-120, 150, 240, 22, { rx: 6, fill: C.fill, sw: 2.6 }); [-90, -50, 30, 70].forEach(x => p.line(x, 150, x, 172, fine));
    cloud(p, -96, 150, 70, 34, 3); cloud(p, 76, 150, 70, 34, 3);
  });
  def('rocket.badge', p => {
    p.circle(0, 0, 160, { fill: C.fill, sw: 3 }); p.circle(0, 0, 146, fine);
    p.path('M -150 40 A 156 40 0 0 0 150 -40', { sw: 2 });
    rocket(p, 6, 4, .78, 35);
    star(p, -80, -80, 10); star(p, 90, 80, 8); p.dot(-60, 90, 2.4); p.dot(70, -100, 2);
  });
  def('rocket.orbit', p => {
    p.circle(-80, 80, 76, { fill: C.fill, sw: 3 }); p.path('M -150 66 C -120 50, -60 60, -10 90', fine); p.path('M -140 110 C -110 100, -70 110, -30 130', fine);
    p.ellipse(-80, 80, 124, 30, { sw: 2.4 }); p.path('M -156 80 A 76 76 0 0 1 -4 80', { sw: 3, fill: C.fill });
    p.path('M -60 -10 C -40 -90, 40 -130, 110 -110', { sw: 1.6, stroke: C.soft });
    rocket(p, 128, -106, .55, 70);
    star(p, -160, -140, 9); star(p, 40, 30, 7); p.dot(150, 30, 2.4);
  });
  def('rocket.growth', p => {
    p.line(-170, -150, -170, 160, { sw: 3 }); p.line(-170, 160, 186, 160, { sw: 3 });
    [[-130, 50], [-70, 90], [-10, 70], [50, 130]].forEach(([x, h]) => p.rect(x - 20, 160 - h, 40, h, { rx: 5, fill: C.fill, sw: 2.2, stroke: C.soft }));
    p.poly([[-150, 110], [-70, 60], [-10, 80], [50, 20], [110, -60]], { sw: 3.2 });
    rocket(p, 128, -88, .5, 40);
  });
  def('rocket.laptop', p => {
    p.rect(-150, -30, 300, 180, { rx: 12, fill: C.fill, sw: 3 }); p.rect(-136, -16, 272, 152, { rx: 6, sw: 1.2, stroke: C.soft });
    p.path('M -180 168 L -150 150 L 150 150 L 180 168 Q 182 176 172 176 L -172 176 Q -182 176 -180 168 Z', { fill: C.fill, sw: 2.6 }); p.line(-30, 162, 30, 162, fine);
    rocket(p, 0, -56, .72);
    cloud(p, 0, 136, 220, 70, 5);
    star(p, -150, -140, 10); star(p, 150, -110, 8);
  });
  def('rocket.retro', p => {
    rocket(p, 0, -30, 1.05, 0, { retro: true });
    [-1, 1].forEach(sd => p.line(sd * 54, 86, sd * 80, 150, { sw: 2.6 })); p.line(-96, 150, 96, 150, { sw: 2.4 });
    star(p, -150, -140, 11); star(p, 150, -90, 8); p.dot(-130, 30, 2.4); p.dot(140, 40, 2);
  });
  def('rocket.moon', p => {
    p.path('M 110 -190 A 90 90 0 1 0 190 -40 A 74 74 0 1 1 110 -190 Z', { fill: C.fill, sw: 3 });
    [[100, -60, 12], [70, -110, 8], [134, -40, 7]].forEach(([x, y, r]) => p.circle(x, y, r, fine));
    p.path('M -170 170 C -120 100, -80 80, -30 60', { sw: 1.6, stroke: C.soft });
    rocket(p, -6, 38, .6, 45);
    star(p, -150, -150, 10); star(p, -60, -110, 7); p.dot(30, -160, 2.4); p.dot(-170, -40, 2);
  });
  def('rocket.clouds', p => {
    speed(p, [[-70, -190, -70, -150], [0, -200, 0, -170], [70, -190, 70, -150]]);
    rocket(p, 0, -40, .95);
    cloud(p, -120, 150, 170, 70, 4); cloud(p, 120, 150, 170, 70, 4); cloud(p, 0, 170, 300, 110, 6);
  });

  Object.assign(G.icons, S);
  G.SETS = { heart: Object.keys(S).filter(n => n.startsWith('heart.')), rocket: Object.keys(S).filter(n => n.startsWith('rocket.')) };
})();
