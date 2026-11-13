/* b02.js — category B02 "เพิ่ม / ลด" (the amount of something changes: grows, shrinks, arrives, leaves): 20 neutral designs.
   STILL DRAFTS (stage 1, for the user to keep / drop / fix) — motion comes after approval (CutPack rule: enter → work → result on the keyword → hold).
   Slots (same as CutPack CATEGORIES.md B02):
     dir 'up' | 'down' · item { icon, label? } drawn n = 2–4 times · center { icon, label? } the owner things flow into / out of (optional) ·
     keep 0–3 = how many are left after a decrease (0 only when the speaker says "all gone") · end = an icon name for the end symbol (optional).
   The still shows the RESULT moment: up → all n items, the newest arriving (arrow); down → `keep` items left, the gone ones as faint ghosts.
   Every design draws on a 1000 × 700 canvas centred at (0,0): GL.cats.B02.draw(i, data, { x, y, s, at }). */
(function () {
  const G = window.GL, C = G.C;
  const W = (w = 2) => ({ sw: w }), F = (w = 3.2) => ({ fill: C.fill, sw: w });
  const rad = d => d * Math.PI / 180, f1 = v => +v.toFixed(1);
  const sub = (p, a) => p.child(a || {});
  const N = d => Math.max(2, Math.min(4, d.n || 3));
  const K = d => d.dir === 'down' ? Math.max(0, Math.min(N(d) - 1, d.keep ?? 1)) : N(d);
  const gone = (d, i) => d.dir === 'down' && i >= K(d);           // this copy left (ghost)
  const art = (c, fn) => G.art(fn, { x: c.x, y: c.y, s: c.s, at: c.at || 0 });

  function txt(p, str, x, y, { size = 44, maxW = 1e9, weight = 600, anchor = 'middle', color = C.soft } = {}) {
    const e = p.text(String(str), x, y, { size, weight, anchor, color, dur: .01 });
    const w = e.getBBox().width; if (w > maxW) e.setAttribute('font-size', f1(size * maxW / w));
    return e;
  }
  /* an icon at canvas point (cx, cy), box width wd; ghost = faint (the copy that left) */
  function icon(name, cx, cy, wd, c, { ghost = false, delay = .1 } = {}) {
    if (!name) return null;
    const fn = G.icons[name] || G.icons[name + '-pro'];
    if (!fn) { console.warn('B02: no icon', name); return null; }
    const a = G.art(fn, { x: c.x + cx * c.s, y: c.y + cy * c.s, w: wd * c.s, at: (c.at || 0) + delay });
    if (ghost) a.wrap.setAttribute('opacity', .2);
    return a;
  }
  const item = (d, i, x, y, w, c) => icon(d.item.icon, x, y, w, c, { ghost: gone(d, i) });
  const center = (d, x, y, w, c) => d.center && icon(d.center.icon, x, y, w, c);
  function arrowLine(p, x1, y1, x2, y2, w = 4.5, o = {}) {
    const a = Math.atan2(y2 - y1, x2 - x1), h = 18;
    p.line(x1, y1, x2, y2, Object.assign(W(w), o)); p.poly([[x2 - h * Math.cos(a - .5), y2 - h * Math.sin(a - .5)], [x2, y2], [x2 - h * Math.cos(a + .5), y2 - h * Math.sin(a + .5)]], Object.assign(W(w), o));
  }
  function chev(p, x, y, dir, s = 14) { const k = dir === 'right' ? 1 : -1; p.poly([[x - k * s * .5, y - s], [x + k * s * .5, y], [x - k * s * .5, y + s]], W(3)); }
  /* round badge with an up / down arrow (the direction of the change) */
  function dirBadge(p, dir, x, y, r = 34) {
    const q = sub(p, { transform: `translate(${f1(x)} ${f1(y)})` }), s = dir === 'up' ? -1 : 1;
    q.circle(0, 0, r, F(3)); q.line(0, -s * r * .5, 0, s * r * .5, W(4.4)); q.poly([[-r * .32, s * r * .18], [0, s * r * .52], [r * .32, s * r * .18]], W(4.4));
  }
  /* end symbol: a round plate with an icon in it */
  function endSym(p, d, x, y, c, r = 46) {
    if (!d.end) return; p.circle(x, y, r, F(3));
    const k = r * .42;
    if (d.end === 'x') { p.line(x - k, y - k, x + k, y + k, W(5)); p.line(x + k, y - k, x - k, y + k, W(5)); }
    else if (/check/.test(d.end)) p.poly([[x - k, y + 2], [x - k * .2, y + k * .8], [x + k * 1.05, y - k * .75]], W(5));
    else icon(d.end, x, y, r * 1.6, c, { delay: .2 });
  }
  const labels = (p, d, ix, iy, cx, cy, o = {}) => { if (d.item.label) txt(p, d.item.label, ix, iy, o); if (d.center && d.center.label && cx != null) txt(p, d.center.label, cx, cy, { maxW: 240 }); };

  const V = [];
  const variant = (id, th, build) => V.push({ id, th, build });

  /* 01 ── ROW: the copies stand in a row on a line — new ones come in from the right / gone ones stay as ghosts */
  variant('row', 'แถวเรียง', (d, c) => {
    const n = N(d), hc = !!d.center, x0 = hc ? -160 : -330, x1 = 250, st = (x1 - x0) / (n - 1), y = -30, w = Math.min(150, st * .85);
    art(c, p => {
      p.line(x0 - 90, 75, x1 + 90, 75, { sw: 2, stroke: C.soft });
      if (d.dir === 'up') arrowLine(p, 470, y, x1 + 95, y); else arrowLine(p, x1 + 95, y, 470, y);
      labels(p, d, (x0 + x1) / 2, 160, -390, 160, { maxW: 600 });
      endSym(p, d, 420, -190, c);
    });
    for (let i = 0; i < n; i++) item(d, i, x0 + i * st, y, w, c);
    center(d, -390, -30, 180, c);
  });

  /* 02 ── STACK: the copies pile up into a column (or come off its top) */
  variant('stack', 'กองซ้อน', (d, c) => {
    const n = N(d), cx = d.center ? 120 : 0;
    art(c, p => {
      p.rect(cx - 130, 280, 260, 18, Object.assign({ rx: 6 }, F(2.6)));
      if (d.dir === 'up') arrowLine(p, cx + 160, 240, cx + 160, -150, 5); else arrowLine(p, cx + 160, -150, cx + 160, 240, 5);
      labels(p, d, d.center ? cx + 270 : cx - 250, 300, -300, 300, { maxW: 200 });
      endSym(p, d, cx - 200, -200, c);
    });
    for (let i = 0; i < n; i++) item(d, i, cx, 212 - i * 118, 120, c);
    center(d, -300, 120, 190, c);
  });

  /* 03 ── JAR: the copies drop into a glass jar (or are taken out of it) */
  variant('jar', 'โหลแก้ว', (d, c) => {
    const n = N(d), P = [[-85, 190], [85, 190], [-85, 55], [85, 55]];
    art(c, p => {
      p.path('M -120 -150 L -120 -205 L 120 -205 L 120 -150 Q 190 -140 190 -70 L 190 220 Q 190 275 135 275 L -135 275 Q -190 275 -190 220 L -190 -70 Q -190 -140 -120 -150 Z', F(3.4));
      p.rect(-140, -235, 280, 32, Object.assign({ rx: 10 }, F(3))); p.line(-160, -60, -160, 200, W(1.8));
      if (d.dir === 'up') arrowLine(p, 0, -340, 0, -248, 5); else arrowLine(p, 60, -250, 210, -330, 5);
      labels(p, d, 0, 325, 330, 180);
      endSym(p, d, -300, -230, c);
    });
    for (let i = 0; i < n; i++) item(d, i, P[i][0], P[i][1], 128, c);
    center(d, 330, 30, 160, c);
  });

  /* 04 ── FLOW: the copies flow into the owner from all around (or out of it) */
  variant('flow', 'ไหลเข้าศูนย์กลาง', (d, c) => {
    const n = N(d), A = [...Array(n)].map((_, i) => -90 + 45 + i * 360 / n), up = d.dir === 'up';
    art(c, p => {
      p.circle(0, 10, 118, F(3.4));
      A.forEach((a, i) => { const ca = Math.cos(rad(a)), sa = Math.sin(rad(a));
        const r0 = up || gone(d, i) ? 1 : 0, rIn = 150, rOut = 225;
        if (up) arrowLine(p, f1(rOut * 1.25 * ca), f1(10 + rOut * .85 * sa), f1(rIn * ca), f1(10 + rIn * .9 * sa), 4);
        else if (gone(d, i)) arrowLine(p, f1(rIn * ca), f1(10 + rIn * .9 * sa), f1(rOut * 1.25 * ca), f1(10 + rOut * .85 * sa), 4); });
      if (!d.center) dirBadge(p, d.dir, 0, 10, 54);
      labels(p, d, 0, 335, 0, 170, { maxW: 600 });
      endSym(p, d, 380, -250, c);
    });
    A.forEach((a, i) => { const far = up || gone(d, i); const rx = far ? 380 : 300, ry = far ? 240 : 200;
      item(d, i, rx * Math.cos(rad(a)), 10 + ry * Math.sin(rad(a)), 120, c); });
    center(d, 0, 0, 150, c);
  });

  /* 05 ── CONVEYOR: a belt carries the copies into a bin / the owner (or away from it) */
  variant('conveyor', 'สายพาน', (d, c) => {
    const n = N(d), up = d.dir === 'up', xs = [...Array(n)].map((_, i) => 160 - (n - 1 - i) * 150);
    art(c, p => {
      p.rect(-470, 140, 720, 50, Object.assign({ rx: 25 }, F(3.2)));
      [-445, 225].forEach(x => p.circle(x, 165, 15, W(2.2)));
      for (let x = -395; x < 200; x += 70) chev(p, x, 165, up ? 'right' : 'left', 11);
      if (!d.center) { p.rect(290, 30, 170, 200, Object.assign({ rx: 10 }, F(3.2))); p.line(290, 80, 460, 80, W(2)); }
      if (!up) arrowLine(p, -250, -90, -440, -90, 5); else arrowLine(p, -60, -110, 120, -110, 5);
      labels(p, d, -110, 270, 375, 300);
    });
    xs.forEach((x, i) => item(d, up ? i : n - 1 - i, up ? x : x - 120 - 0, 66, 120, c));
    if (d.center) center(d, 375, 110, 180, c);
    if (d.end) art(c, p => endSym(p, d, 375, -150, c));
  });

  /* 06 ── STAIRS: the copies stand on a staircase that climbs (or steps down) */
  variant('stairs', 'บันได', (d, c) => {
    const n = N(d), up = d.dir === 'up', sw = 190, rise = 95, x0 = -420;
    const top = i => up ? 290 - (i + 1) * rise : 290 - (n - i) * rise;
    art(c, p => {
      const pts = [[x0, 290]]; for (let i = 0; i < n; i++) { pts.push([x0 + i * sw, top(i)], [x0 + (i + 1) * sw, top(i)]); } pts.push([x0 + n * sw, 290]);
      p.shape(pts, F(3.2));
      if (up) arrowLine(p, x0 + 40, 120, x0 + n * sw - 40, top(n - 1) - 150, 5); else arrowLine(p, x0 + 40, top(0) - 150, x0 + n * sw - 40, 120, 5);
      labels(p, d, 300, 335, 400, -110);
      endSym(p, d, up ? -380 : 380, -250, c);
    });
    for (let i = 0; i < n; i++) item(d, i, x0 + i * sw + sw / 2, top(i) - 62, 115, c);
    center(d, 400, -220, 120, c);
  });

  /* 07 ── LIFT: a scissor lift raises its platform with the copies (or lowers it); the old height stays as a ghost */
  variant('lift', 'ลิฟต์ยก', (d, c) => {
    const n = N(d), up = d.dir === 'up', py = up ? -20 : 150, gy = up ? 150 : -20, xs = [...Array(n)].map((_, i) => -165 + i * 330 / (n - 1));
    art(c, p => {
      p.rect(-240, gy, 480, 26, { rx: 6, sw: 2, stroke: C.rule });
      p.rect(-210, 280, 420, 26, Object.assign({ rx: 6 }, F(3)));
      p.line(-170, 280, 170, py + 26, W(3)); p.line(170, 280, -170, py + 26, W(3)); p.circle(0, (280 + py + 26) / 2, 8, F(2));
      p.rect(-240, py, 480, 26, Object.assign({ rx: 6 }, F(3.2)));
      if (up) arrowLine(p, 320, 200, 320, -60, 5); else arrowLine(p, 320, -60, 320, 200, 5);
      labels(p, d, 360, 300, -390, 120, { maxW: 220 });
    });
    xs.forEach((x, i) => item(d, i, x, py - 62, 115, c));
    center(d, -390, 10, 150, c);
    if (d.end) art(c, p => endSym(p, d, 390, -250, c));
  });

  /* 08 ── SCALE: the copies pile onto a kitchen scale and its needle swings up (or the copies come off and it drops) */
  variant('scale', 'ตาชั่งหน้าปัด', (d, c) => {
    const n = N(d), up = d.dir === 'up', xs = [...Array(n)].map((_, i) => -165 + i * 330 / (n - 1)), ang = up ? -40 : -150;
    art(c, p => {
      p.path('M -200 140 L 200 140 L 240 300 L -240 300 Z', F(3.4));
      p.circle(0, 222, 64, F(2.8)); p.path('M -48 222 A 48 48 0 0 1 48 222', W(1.8));
      p.line(0, 222, f1(48 * Math.cos(rad(ang))), f1(222 + 48 * Math.sin(rad(ang))), { sw: 5 });
      p.rect(-30, 110, 60, 30, F(2.6)); p.path('M -270 92 Q 0 128 270 92 L 250 110 Q 0 140 -250 110 Z', F(3));
      if (up) arrowLine(p, 0, -320, 0, -190, 5); else arrowLine(p, 120, -170, 280, -300, 5);
      labels(p, d, -360, 300, 390, 120, { maxW: 220 });
    });
    xs.forEach((x, i) => item(d, i, gone(d, i) ? x + 40 : x, gone(d, i) ? -150 : 30, 115, c));
    center(d, 390, -10, 140, c);
    if (d.end) art(c, p => endSym(p, d, -390, -250, c));
  });

  /* 09 ── MAGNET: a horseshoe magnet pulls the copies in (or lets them fall away) */
  variant('magnet', 'แม่เหล็ก', (d, c) => {
    const n = N(d), up = d.dir === 'up', P = [[30, -170], [30, 170], [190, -90], [190, 90]];
    art(c, p => {
      const U = 'M -110 -170 L -260 -170 A 170 170 0 0 0 -260 170 L -110 170';
      p.path(U, { sw: 84 }); p.path(U, { sw: 76, stroke: C.fill });
      [-1, 1].forEach(s => p.line(-150, s * 132, -150, s * 208, W(3)));
      if (up) [[440, -40], [440, 60]].forEach(([x, y]) => arrowLine(p, x, y, 320, y, 4));
      else [[260, -40], [260, 60]].forEach(([x, y]) => arrowLine(p, x, y, 440, y, 4));
      labels(p, d, 160, 320, -280, 0);
    });
    for (let i = 0; i < n; i++) { const [x, y] = P[i], g = gone(d, i); item(d, i, g ? x + 220 : x, g ? y + 40 : y, 115, c); }
    if (d.center) center(d, -285, 0, 110, c);
    if (d.end) art(c, p => endSym(p, d, 420, -250, c));
  });

  /* 10 ── DOOR: the copies walk in through an open door (or out of it); the owner shows inside the doorway */
  variant('door', 'ประตูเข้าออก', (d, c) => {
    const n = N(d), up = d.dir === 'up', xs = [...Array(n)].map((_, i) => -40 + i * (400 / (n - 1)));
    art(c, p => {
      p.line(-470, 262, 470, 262, { sw: 2, stroke: C.soft });
      p.rect(-430, -260, 260, 522, Object.assign({ rx: 6 }, F(3.4)));
      p.path('M -430 -260 L -340 -222 L -340 226 L -430 262 Z', F(3)); p.circle(-356, 10, 8, W(2.2));
      if (up) arrowLine(p, 300, -90, -120, -90, 5); else arrowLine(p, -120, -90, 300, -90, 5);
      labels(p, d, 160, 330, -300, -290);
    });
    xs.forEach((x, i) => item(d, up ? i : i, x, 175, 120, c));
    center(d, -255, 10, 140, c);
    if (d.end) art(c, p => endSym(p, d, 420, -250, c));
  });

  /* 11 ── TRAY: a tray of slots fills up (or empties — the empty slots and lifted ghosts show what left) */
  variant('tray', 'ช่องถาด', (d, c) => {
    const n = N(d), sh = d.center ? 70 : 0, g4 = n === 4;
    const S = g4 ? [[-100, -60], [100, -60], [-100, 110], [100, 110]].map(([x, y]) => [x + sh, y]) : [...Array(n)].map((_, i) => [sh + (i - (n - 1) / 2) * 210, 25]);
    const sz = g4 ? 150 : 180;
    art(c, p => {
      const w = g4 ? 460 : n * 210 + 50, h = g4 ? 360 : 240;
      p.rect(sh - w / 2, 25 - h / 2 + (g4 ? 0 : 0), w, h, Object.assign({ rx: 30 }, F(3.4)));
      S.forEach(([x, y]) => p.rect(x - sz / 2, y - sz / 2, sz, sz, { rx: 22, fill: C.fill, sw: 2, stroke: C.soft }));
      const last = S[n - 1]; if (d.dir === 'up') arrowLine(p, last[0] + 150, last[1] - 230, last[0] + 50, last[1] - 110, 5);
      labels(p, d, sh, 300, -390, 120);
      endSym(p, d, 400, -250, c);
    });
    S.forEach(([x, y], i) => item(d, i, gone(d, i) ? x + 30 : x, gone(d, i) ? y - (g4 ? 90 : 120) - (i % 2) * 20 : y, g4 ? 110 : 130, c));
    center(d, -390, 25, 130, c);
  });

  /* 12 ── TREND: a big tapered arrow sweeps up (or down) in a soft S — thin at its tail, wide at its head; the copies ride along it */
  variant('trend', 'ลูกศรเทรนด์', (d, c) => {
    const n = N(d), up = d.dir === 'up', fy = y => up ? y : -y + 20;
    const P = [[-450, fy(250)], [-140, fy(250)], [60, fy(20)], [390, fy(-215)]];
    const B = t => { const u = 1 - t; return [0, 1].map(k => u * u * u * P[0][k] + 3 * u * u * t * P[1][k] + 3 * u * t * t * P[2][k] + t * t * t * P[3][k]); };
    const D = t => { const u = 1 - t; return [0, 1].map(k => 3 * u * u * (P[1][k] - P[0][k]) + 6 * u * t * (P[2][k] - P[1][k]) + 3 * t * t * (P[3][k] - P[2][k])); };
    art(c, p => {
      const tH = .86, L = [], R = [], M = [];
      for (let k = 0; k <= 40; k++) { const t = tH * k / 40, [x, y] = B(t), [dx, dy] = D(t), l = Math.hypot(dx, dy), nx = -dy / l, ny = dx / l, w = 7 + 25 * (t / tH);
        L.push([f1(x + nx * w), f1(y + ny * w)]); R.push([f1(x - nx * w), f1(y - ny * w)]); if (k > 2 && k < 38) M.push([f1(x), f1(y)]); }
      const [hx, hy] = B(tH), [tx, ty] = D(tH), tl = Math.hypot(tx, ty), ux = tx / tl, uy = ty / tl, nx = -uy, ny = ux, hw = 62, hl = 120;
      const tip = [f1(hx + ux * hl), f1(hy + uy * hl)];
      p.shape([...L, [f1(hx + nx * hw), f1(hy + ny * hw)], tip, [f1(hx - nx * hw), f1(hy - ny * hw)], ...R.reverse()], F(3.2));
      p.poly(M, { sw: 1.6, stroke: C.soft });
      labels(p, d, up ? 250 : -250, 300, up ? -380 : 380, up ? -300 : 330);
      endSym(p, d, up ? 420 : 420, up ? 60 : -60, c);
    });
    for (let i = 0; i < n; i++) { const t = .18 + .58 * i / (n - 1), [x, y] = B(t), [dx, dy] = D(t), l = Math.hypot(dx, dy);
      let nx = -dy / l, ny = dx / l; if (ny > 0) { nx = -nx; ny = -ny; }              // always ride on the upper side of the arrow
      item(d, i, x + nx * 100, y + ny * 100, 100 + (up ? i * 14 : (n - 1 - i) * 14), c); }
    center(d, up ? -380 : 380, up ? -220 : 250, 120, c);
  });

  /* 12 alternatives (user: "Design เส้นเทรนด์ใหม่", 2026-11-13) — kept outside V until the user picks one */
  const ALT12 = [];
  const alt = (id, th, build) => ALT12.push({ id, th, build });
  const cub = (P) => ({ B: t => { const u = 1 - t; return [0, 1].map(k => u * u * u * P[0][k] + 3 * u * u * t * P[1][k] + 3 * u * t * t * P[2][k] + t * t * t * P[3][k]); },
    D: t => { const u = 1 - t; return [0, 1].map(k => 3 * u * u * (P[1][k] - P[0][k]) + 6 * u * t * (P[2][k] - P[1][k]) + 3 * t * t * (P[3][k] - P[2][k])); },
    d: `M ${P[0][0]} ${P[0][1]} C ${P[1][0]} ${P[1][1]}, ${P[2][0]} ${P[2][1]}, ${P[3][0]} ${P[3][1]}` });
  const upSide = (D, t) => { const [dx, dy] = D(t), l = Math.hypot(dx, dy); let nx = -dy / l, ny = dx / l; if (ny > 0) { nx = -nx; ny = -ny; } return [nx, ny]; };

  /* 12a ── NODES: a smooth line with a node under every copy, plain axes (no numbers), a glowing end point */
  alt('nodes', 'เส้นมีจุด', (d, c) => {
    const n = N(d), up = d.dir === 'up', fy = y => up ? y : -y + 10;
    const K3 = cub([[-380, fy(230)], [-120, fy(220)], [80, fy(-20)], [400, fy(-200)]]), ts = [...Array(n)].map((_, i) => .2 + .62 * i / (n - 1));
    art(c, p => {
      p.poly([[-440, -290], [-440, 290], [460, 290]], { sw: 2.2, stroke: C.soft });
      p.path(K3.d, { sw: 7 });
      ts.forEach((t, i) => { const [x, y] = K3.B(t); p.circle(f1(x), f1(y), 15, gone(d, i) ? { fill: C.fill, sw: 2.4, stroke: C.rule } : F(3.4)); });
      const [ex, ey] = K3.B(1); p.circle(ex, ey, 26, F(3.6)); p.circle(ex, ey, 9, { fill: C.ink, sw: 1 });
      labels(p, d, up ? 260 : -260, 335, up ? -330 : 330, up ? -290 : 330);
      endSym(p, d, up ? 410 : 410, up ? 60 : -40, c);
    });
    ts.forEach((t, i) => { const [x, y] = K3.B(t), [nx, ny] = upSide(K3.D, t); item(d, i, x + nx * 95, y + ny * 95, 105, c); });
    center(d, up ? -330 : 330, up ? -210 : 230, 110, c);
  });

  /* 12b ── RIBBON: a wide ribbon sweeps up (or down) and turns over once on the way, ending in an arrow tip */
  alt('ribbon', 'ริบบิ้นพลิ้ว', (d, c) => {
    const n = N(d), up = d.dir === 'up', fy = y => up ? y : -y + 10;
    const K3 = cub([[-450, fy(200)], [-200, fy(280)], [80, fy(-40)], [360, fy(-180)]]), ts = [...Array(n)].map((_, i) => .16 + .6 * i / (n - 1));
    art(c, p => {
      const W0 = 34, L = [], R = [], tw = .45;                        // the ribbon narrows to a twist at t = tw, then widens again
      for (let k = 0; k <= 48; k++) { const t = .9 * k / 48, [x, y] = K3.B(t), [dx, dy] = K3.D(t), l = Math.hypot(dx, dy), w = W0 * Math.max(.08, Math.abs((t - tw) / tw) ** .7);
        L.push([x - dy / l * w, y + dx / l * w]); R.push([x + dy / l * w, y - dx / l * w]); }
      const half = (a, b) => [...L.slice(a, b), ...R.slice(a, b).reverse()].map(([x, y]) => [f1(x), f1(y)]);
      const kt = Math.round(tw / .9 * 48);
      p.shape(half(0, kt + 1), { fill: C.fill, sw: 2.6, stroke: C.soft });
      p.shape(half(kt, 49), F(3.2));
      const [hx, hy] = K3.B(.9), [tx, ty] = K3.D(.9), tl = Math.hypot(tx, ty), ux = tx / tl, uy = ty / tl;
      p.shape([[f1(hx - uy * 64), f1(hy + ux * 64)], [f1(hx + ux * 110), f1(hy + uy * 110)], [f1(hx + uy * 64), f1(hy - ux * 64)]], F(3.4));
      labels(p, d, up ? 260 : -260, 335, up ? -360 : 360, up ? -290 : 330);
      endSym(p, d, 420, up ? 80 : -60, c);
    });
    ts.forEach((t, i) => { const [x, y] = K3.B(t), [nx, ny] = upSide(K3.D, t); item(d, i, x + nx * 105, y + ny * 105, 105, c); });
    center(d, up ? -360 : 360, up ? -210 : 230, 110, c);
  });

  /* 12c ── STEPS LINE: a line climbs (or drops) in clean steps — one step per copy — and ends in an arrow */
  alt('stepline', 'เส้นขั้นบันได', (d, c) => {
    const n = N(d), up = d.dir === 'up', sx = 820 / (n + .6), x0 = -430, yA = up ? 250 : -230, dy = (up ? -1 : 1) * 420 / n;
    art(c, p => {
      const pts = [[x0, yA]];
      for (let i = 0; i < n; i++) { const y = yA + dy * (i + 1); pts.push([x0 + sx * (i + .5), yA + dy * i], [x0 + sx * (i + .5), y]); }
      const last = pts[pts.length - 1], ex = last[0] + sx * .9; pts.push([ex, last[1]]);
      p.poly(pts.map(([x, y]) => [f1(x), f1(y)]), { sw: 8 });
      p.shape([[f1(ex + 40), f1(last[1])], [f1(ex - 6), f1(last[1] - 30)], [f1(ex - 6), f1(last[1] + 30)]], { fill: C.ink, sw: 2 });
      for (let i = 0; i < n; i++) { const x = x0 + sx * (i + .5), y = yA + dy * (i + 1); p.circle(f1(x), f1(y), 13, gone(d, i) ? { fill: C.fill, sw: 2.4, stroke: C.rule } : F(3.4)); }
      labels(p, d, up ? 260 : -260, up ? 335 : 335, up ? -360 : 360, up ? -290 : 330);
      endSym(p, d, 420, up ? 120 : -100, c);
    });
    for (let i = 0; i < n; i++) item(d, i, x0 + sx * (i + 1), yA + dy * (i + 1) - 80, 110, c);
    center(d, up ? -360 : 360, up ? -210 : 230, 110, c);
  });

  /* 13 ── SHELF: copies stand on a wall shelf — a new one is set down (or the gaps show the ones taken) */
  variant('shelf', 'ชั้นวาง', (d, c) => {
    const n = N(d), xs = [...Array(n)].map((_, i) => -300 + i * 600 / (n - 1));
    art(c, p => {
      p.rect(-430, 130, 860, 28, Object.assign({ rx: 6 }, F(3.2)));
      [-330, 330].forEach(x => p.path(`M ${x - 10} 158 L ${x + 10} 158 L ${x + 10} 240 Z`, F(2.6)));
      if (d.dir === 'up') arrowLine(p, xs[n - 1], -250, xs[n - 1], -110, 5); else arrowLine(p, xs[n - 1] - 20, -100, xs[n - 1] + 90, -240, 5);
      labels(p, d, 0, 300, -360, -100);
      endSym(p, d, 400, -260, c);
    });
    xs.forEach((x, i) => item(d, i, x, 50, 150, c));
    center(d, -360, -220, 120, c);
  });

  /* 14 ── LINE: copies hang on a washing line with pegs — empty pegs show the ones taken down */
  variant('line', 'ราวหนีบ', (d, c) => {
    const n = N(d), ry = x => -230 + 110 * (1 - (x / 460) ** 2), xs = [...Array(n)].map((_, i) => -300 + i * 600 / (n - 1));
    art(c, p => {
      [-460, 460].forEach(x => p.line(x, -280, x, 300, W(3)));
      p.path('M -460 -230 Q 0 -10 460 -230', W(2.6));
      xs.forEach(x => p.rect(f1(x - 8), f1(ry(x) - 16), 16, 40, Object.assign({ rx: 4 }, F(2.4))));
      if (d.dir === 'up') arrowLine(p, xs[n - 1], 270, xs[n - 1], 150, 5); else arrowLine(p, xs[n - 1], 150, xs[n - 1], 270, 5);
      labels(p, d, 0, 330, -380, 330);
      endSym(p, d, 380, 220, c);
    });
    xs.forEach((x, i) => item(d, i, x, ry(x) + 105, 140, c));
    center(d, -380, 235, 110, c);
  });

  /* 15 ── PIPE: copies travel along a pipe into the owner / a tank (or flow back out of it) */
  variant('pipe', 'ท่อ', (d, c) => {
    const n = N(d), up = d.dir === 'up', xs = [...Array(n)].map((_, i) => 80 - (n - 1 - i) * 145);
    art(c, p => {
      const D = 'M -440 -20 L 200 -20'; [p.path(D, { sw: 96 }), p.path(D, { sw: 86, stroke: C.fill })].forEach(e => e.setAttribute('stroke-linecap', 'butt'));
      p.rect(-470, -76, 30, 112, Object.assign({ rx: 6 }, F(2.6)));
      p.rect(190, -76, 30, 112, Object.assign({ rx: 6 }, F(2.6)));
      if (!d.center) { p.rect(250, -150, 210, 300, Object.assign({ rx: 24 }, F(3.4))); p.line(270, 40, 440, 40, W(2)); }
      xs.forEach((x, i) => { if (i < n - 1 || !up) chev(p, (up ? x : x - 60) + 72, -20, up ? 'right' : 'left', 12); }); chev(p, xs[0] - 72 - (up ? 0 : 60), -20, up ? 'right' : 'left', 12);
      labels(p, d, -150, 150, 355, 220);
    });
    xs.forEach((x, i) => { const j = up ? i : n - 1 - i; item(d, j, up ? x : x - 60, -20, 100, c); });
    center(d, 355, -20, 190, c);
    if (d.end) art(c, p => endSym(p, d, 355, -250, c));
  });

  /* 16 ── SIZE: the item grows step by step (or shrinks) — earlier sizes stay as ghosts behind */
  variant('size', 'ขยาย / หด', (d, c) => {
    const n = N(d), up = d.dir === 'up', ws = [...Array(n)].map((_, i) => { const k = up ? i : n - 1 - i; return 80 + k * (230 - 80) / (n - 1); });
    let x = -400; const xs = ws.map(w => { const cx = x + w / 2; x += w + 40; return cx; }), off = (400 - (x - 40)) / 2;
    art(c, p => {
      p.line(-460, 230, 460, 230, { sw: 2, stroke: C.soft });
      arrowLine(p, -380, 275, 380, 275, 4);
      labels(p, d, 0, 335, -400, -80);
    });
    xs.forEach((cx, i) => icon(d.item.icon, cx + off, 230 - ws[i] / 2, ws[i], c, { ghost: i < n - 1 }));
    if (d.center) center(d, -400, -170, 120, c);
    if (d.end) art(c, p => endSym(p, d, 420, -250, c));
  });

  /* 17 ── BUBBLES: copies float up in bubbles (or their bubbles pop) */
  variant('bubbles', 'ฟองลอย', (d, c) => {
    const n = N(d), P = [[-240, 190], [-70, 60], [100, -80], [270, -210]].slice(0, n);
    art(c, p => {
      P.forEach(([x, y], i) => {
        if (gone(d, i)) [[-160, -120], [-60, -10], [40, 110], [150, 200]].forEach(([a0, a1]) => p.path(`M ${f1(x + 92 * Math.cos(rad(a0)))} ${f1(y + 92 * Math.sin(rad(a0)))} A 92 92 0 0 1 ${f1(x + 92 * Math.cos(rad(a1)))} ${f1(y + 92 * Math.sin(rad(a1)))}`, { sw: 2.4, stroke: C.rule }));
        else { p.circle(x, y, 82, { sw: 2.6, stroke: C.soft }); p.path(`M ${x - 52} ${y - 30} A 60 60 0 0 1 ${x - 20} ${y - 58}`, { sw: 2.2, stroke: C.soft }); }
      });
      if (!d.center) [[-330, 300, 14], [-290, 270, 9], [-360, 250, 7]].forEach(([x, y, r]) => p.circle(x, y, r, { sw: 2, stroke: C.soft }));
      if (d.dir === 'up') arrowLine(p, 380, 200, 380, -60, 5); else arrowLine(p, 380, -60, 380, 200, 5);
      labels(p, d, 200, 300, -400, 300);
      endSym(p, d, -380, -230, c);
    });
    P.forEach(([x, y], i) => item(d, i, x, y, 100, c));
    center(d, -400, 200, 130, c);
  });

  /* 18 ── LIGHTS: a lamp hangs over each copy — lit for the ones there, dark for the ones gone */
  variant('lights', 'ไฟเหนือหัว', (d, c) => {
    const n = N(d), xs = [...Array(n)].map((_, i) => (d.center ? 60 : 0) + (i - (n - 1) / 2) * (d.center ? 230 : 250));
    art(c, p => {
      p.line(-470, -320, 470, -320, W(2.4)); p.line(-470, 262, 470, 262, { sw: 2, stroke: C.soft });
      xs.forEach((x, i) => { const on = !gone(d, i);
        p.line(x, -320, x, -250, W(2));
        if (on) { p.shape([[x - 40, -200], [x + 40, -200], [x + 105, 255], [x - 105, 255]], { fill: 'rgba(255,255,255,.05)', stroke: 'none', sw: 0 });
          p.line(x - 40, -200, x - 105, 255, { sw: 1.6, stroke: C.soft }); p.line(x + 40, -200, x + 105, 255, { sw: 1.6, stroke: C.soft }); }
        p.path(`M ${x - 30} -250 L ${x + 30} -250 L ${x + 48} -200 L ${x - 48} -200 Z`, on ? F(3) : { fill: C.fill, sw: 2, stroke: C.rule }); });
      labels(p, d, 0, 330, -400, 120);
      if (d.end) endSym(p, d, 410, -160, c);
    });
    xs.forEach((x, i) => item(d, i, x, 160, 125, c));
    center(d, -400, 10, 130, c);
  });

  /* 19 ── PILE: copies heap up on the ground (or come off the top of the heap) */
  variant('pile', 'กองพูน', (d, c) => {
    const n = N(d), P = [[-130, 200], [10, 200], [-60, 80], [80, 80]].slice(0, n), sh = d.center ? 120 : 0;
    art(c, p => {
      p.line(-470, 268, 470, 268, { sw: 2.4, stroke: C.soft });
      const t = P[n - 1];
      if (d.dir === 'up') arrowLine(p, t[0] + sh + 40, -300, t[0] + sh + 10, -60, 5); else arrowLine(p, t[0] + sh + 90, -90, t[0] + sh + 260, -260, 5);
      labels(p, d, sh, 335, -360, 300);
      endSym(p, d, 400, 150, c);
    });
    P.forEach(([x, y], i) => item(d, i, x + sh + (gone(d, i) ? 140 : 0), gone(d, i) ? y - 230 : y, 130, c));
    center(d, -360, 170, 170, c);
  });

  /* 20 ── RAIL: copies sit in beads on a rail — they slide over to the counted end (or back out of it) */
  variant('rail', 'รางเลื่อน', (d, c) => {
    const n = N(d), up = d.dir === 'up', ok = K(d), right = i => 360 - (ok - 1 - i) * 150, left = j => -380 + j * 150;
    const pos = i => !up && i >= ok ? left(i - ok) : right(i);
    art(c, p => {
      p.line(-460, 0, 460, 0, W(3)); [-460, 460].forEach(x => p.rect(x - 9, -110, 18, 220, Object.assign({ rx: 6 }, F(2.6))));
      for (let i = 0; i < n; i++) p.circle(f1(pos(i)), 0, 66, gone(d, i) ? { fill: C.fill, sw: 2, stroke: C.rule } : F(3));
      if (up) arrowLine(p, -150, -150, 150, -150, 5); else arrowLine(p, 150, -150, -150, -150, 5);
      labels(p, d, 0, 200, -390, -280);
      endSym(p, d, 400, -250, c);
    });
    for (let i = 0; i < n; i++) item(d, i, pos(i), 0, 92, c);
    center(d, -390, -220, 100, c);
  });

  /* sample sentences from unrelated topics (neutrality) + a stress set */
  const SAMPLES = [
    { say: 'ลูกค้าเข้าร้านมากขึ้น', dir: 'up', n: 4, item: { icon: 'user' }, center: { icon: 'store', label: 'ร้าน' } },
    { say: 'งานกองสูงขึ้นทุกวัน', dir: 'up', n: 4, item: { icon: 'file-text', label: 'งาน' } },
    { say: 'เก็บเหรียญได้มากขึ้น', dir: 'up', n: 4, item: { icon: 'coins', label: 'เหรียญ' } },
    { say: 'ความรู้เข้าหัวมากขึ้น', dir: 'up', n: 3, item: { icon: 'book-open' }, center: { icon: 'brain' } },
    { say: 'ส่งของออกไปเรื่อย ๆ', dir: 'down', n: 4, keep: 1, item: { icon: 'package' }, center: { icon: 'store', label: 'โกดัง' } },
    { say: 'คะแนนดีขึ้นทุกเทอม', dir: 'up', n: 3, item: { icon: 'star', label: 'คะแนน' } },
    { say: 'ผู้ติดตามเพิ่มขึ้น', dir: 'up', n: 3, item: { icon: 'user-plus', label: 'ผู้ติดตาม' } },
    { say: 'กินขนมน้อยลง', dir: 'down', n: 4, keep: 1, item: { icon: 'cookie', label: 'ขนม' } },
    { say: 'ดึงคนเข้ามาได้มากขึ้น', dir: 'up', n: 4, item: { icon: 'user' } },
    { say: 'เพื่อนค่อย ๆ หายไป', dir: 'down', n: 4, keep: 1, item: { icon: 'user', label: 'เพื่อน' }, center: { icon: 'house' } },
    { say: 'ไข่ในถาดหมดแล้ว', dir: 'down', n: 4, keep: 0, item: { icon: 'egg', label: 'ไข่' }, end: 'x' },
    { say: 'รายได้พุ่งขึ้น', dir: 'up', n: 3, item: { icon: 'banknote', label: 'รายได้' } },
    { say: 'หนังสือบนชั้นเพิ่มขึ้น', dir: 'up', n: 4, item: { icon: 'book', label: 'หนังสือ' } },
    { say: 'ผ้าทยอยเก็บลงจากราว', dir: 'down', n: 4, keep: 2, item: { icon: 'shirt', label: 'ผ้า' } },
    { say: 'น้ำไหลเข้าถังมากขึ้น', dir: 'up', n: 3, item: { icon: 'droplet', label: 'น้ำ' } },
    { say: 'ต้นไม้โตขึ้น', dir: 'up', n: 3, item: { icon: 'sprout', label: 'ต้นไม้' } },
    { say: 'ความเครียดลดลง', dir: 'down', n: 4, keep: 1, item: { icon: 'cloud', label: 'ความเครียด' } },
    { say: 'ไฟในบ้านดับทีละดวง', dir: 'down', n: 4, keep: 1, item: { icon: 'lightbulb' } },
    { say: 'ใบไม้กองพูนขึ้น', dir: 'up', n: 4, item: { icon: 'leaf', label: 'ใบไม้' } },
    { say: 'นัดหมายเพิ่มเข้ามา', dir: 'up', n: 3, item: { icon: 'calendar', label: 'นัด' } },
  ];
  const STRESS = [
    { say: 'ใจรักมากขึ้น (2 ชิ้น ไม่มีป้าย)', dir: 'up', n: 2, item: { icon: 'heart' } },
    { say: 'สมาชิกออกจากกลุ่มจนหมด (+ เจ้าของ + สัญลักษณ์จบ)', dir: 'down', n: 4, keep: 0, item: { icon: 'user', label: 'สมาชิก' }, center: { icon: 'users', label: 'กลุ่ม' }, end: 'x' },
    { say: 'เงินเก็บเข้ากระปุกมากขึ้น (+ เจ้าของ)', dir: 'up', n: 4, item: { icon: 'coins', label: 'เงินเก็บ' }, center: { icon: 'piggy-bank', label: 'กระปุก' } },
    { say: 'ใบไม้ร่วงไป 1 ใบ เหลือ 3', dir: 'down', n: 4, keep: 3, item: { icon: 'leaf' } },
    { say: 'อีเมลเข้ามาเรื่อย ๆ (+ เจ้าของ)', dir: 'up', n: 3, item: { icon: 'mail', label: 'อีเมล' }, center: { icon: 'inbox' } },
    { say: 'ปลาในบ่อลดลง เหลือ 2', dir: 'down', n: 3, keep: 2, item: { icon: 'fish', label: 'ปลา' }, center: { icon: 'droplet', label: 'บ่อ' } },
    { say: 'ดอกไม้บานเพิ่ม 2 ดอก', dir: 'up', n: 2, item: { icon: 'flower', label: 'ดอกไม้' }, end: 'check' },
    { say: 'รถบนถนนน้อยลงจนหมด', dir: 'down', n: 3, keep: 0, item: { icon: 'car', label: 'รถ' }, end: 'circle-check' },
    { say: 'แจ้งเตือนเพิ่มขึ้น (+ เจ้าของ)', dir: 'up', n: 4, item: { icon: 'bell' }, center: { icon: 'user', label: 'ฉัน' } },
    { say: 'แชตเงียบลง เหลือ 1', dir: 'down', n: 4, keep: 1, item: { icon: 'message-circle', label: 'ข้อความ' }, center: { icon: 'user' } },
    { say: 'ของขวัญหายไปจนหมด', dir: 'down', n: 2, keep: 0, item: { icon: 'gift' }, end: 'x' },
    { say: 'ต้นไม้ในสวนเพิ่มขึ้น (+ เจ้าของ)', dir: 'up', n: 3, item: { icon: 'trees', label: 'ต้นไม้' }, center: { icon: 'house', label: 'บ้าน' } },
    { say: 'แอปเปิลบนชั้นลดลง เหลือ 2', dir: 'down', n: 4, keep: 2, item: { icon: 'apple' } },
    { say: 'เสื้อเพิ่มบนราว (2 ตัว)', dir: 'up', n: 2, item: { icon: 'shirt' }, end: 'check' },
    { say: 'พลังงานไหลออกจนเหลือ 1', dir: 'down', n: 3, keep: 1, item: { icon: 'zap', label: 'พลังงาน' } },
    { say: 'ใบไม้หดเล็กลง', dir: 'down', n: 4, keep: 1, item: { icon: 'leaf', label: 'ใบไม้' } },
    { say: 'จักรยานเพิ่มขึ้น (+ เจ้าของ)', dir: 'up', n: 3, item: { icon: 'bike' }, center: { icon: 'store', label: 'ร้านเช่า' } },
    { say: 'ไฟติดเพิ่มทีละดวง', dir: 'up', n: 4, item: { icon: 'lightbulb', label: 'ไฟ' } },
    { say: 'กองงานลดลงจนหมด', dir: 'down', n: 4, keep: 0, item: { icon: 'file-text', label: 'งาน' }, end: 'circle-check' },
    { say: 'นาฬิกาจับเวลาเพิ่ม (+ เจ้าของ)', dir: 'up', n: 4, item: { icon: 'timer' }, center: { icon: 'user', label: 'ทีม' } },
  ];

  G.cats = G.cats || {};
  G.cats.B02 = { variants: V, ALT12, SAMPLES, STRESS, draw: (i, d, c) => V[i].build(d, c) };
})();
