/* b04.js — category B04 "ขั้นตอน / เช็กลิสต์": 20 neutral designs.
   STILL DRAFTS (stage 1, for the user to keep / drop / fix) — motion comes after approval
   (CutPack rule: steps 1, 2, 3 come in → a pointer / path runs through them → the marked step lights / ticks / crosses on the keyword → hold).
   Slots (same as CutPack CATEGORIES.md B04): items [{ icon, label? } × 3] in order · mark { at 0–2, how 'light' | 'check' | 'x' } (optional).
   The order must read clearly (left → right, bottom → top or top → bottom) with a connector or step numbers; the marked step stands out:
   light → a halo, the others fade a little · check → a tick badge · x → a cross badge and the step fades a little.
   Arrows only where the picture cannot show the direction itself (user's rule).
   Canvas 1000 × 700 centred at (0,0): GL.cats.B04.draw(i, data, { x, y, s, at }). */
(function () {
  const G = window.GL, C = G.C;
  const W = (w = 2) => ({ sw: w }), F = (w = 3.2) => ({ fill: C.fill, sw: w });
  const rad = d => d * Math.PI / 180, f1 = v => +v.toFixed(1);
  const sub = (p, a) => p.child(a || {});
  const art = (c, fn) => G.art(fn, { x: c.x, y: c.y, s: c.s, at: c.at || 0 });
  const n = d => Math.max(2, Math.min(4, d.items.length));
  const spread = (k, a, b) => [...Array(k)].map((_, i) => k === 1 ? (a + b) / 2 : a + (b - a) * i / (k - 1));

  /* how strongly step i shows: light → others fade to .5; x → the crossed step fades to .55 */
  function op(d, i) { const m = d.mark; if (!m) return 1; if (m.how === 'light') return i === m.at ? 1 : .5; if (m.how === 'x' && i === m.at) return .55; return 1; }
  const isM = (d, i) => d.mark && d.mark.at === i;
  function txt(p, str, x, y, { size = 42, maxW = 1e9, weight = 600, anchor = 'middle', color = C.soft } = {}) {
    const e = p.text(String(str), x, y, { size, weight, anchor, color, dur: .01 });
    const w = e.getBBox().width; if (w > maxW) e.setAttribute('font-size', f1(size * maxW / w));
    return e;
  }
  function icon(name, cx, cy, wd, c, o = 1, rot) {
    if (!name || wd <= 0) return null;
    const fn = G.icons[name] || G.icons[name + '-pro'];
    if (!fn) { console.warn('B04: no icon', name); return null; }
    const a = G.art(fn, { x: c.x + cx * c.s, y: c.y + cy * c.s, w: wd * c.s, at: (c.at || 0) + .05 });
    if (o < 1) a.wrap.setAttribute('opacity', o);
    if (rot) G.kf(a.wrap, c.at || 0, { ox: c.x + rot[1] * c.s, oy: c.y + rot[2] * c.s, r: [[0, rot[0]]] });
    return a;
  }
  /* step i's icon (faded by op) and its label */
  function step(p, d, i, x, y, w, c, ly, o = {}) {
    const it = d.items[i]; icon(it.icon, x, y, w, c, op(d, i), o.rot);
    if (it.label && ly != null) txt(p, it.label, o.lx ?? x, ly, { maxW: o.maxW || 260, anchor: o.anchor || 'middle', color: op(d, i) < 1 ? C.mute : C.soft, size: o.size || 42 });
  }
  /* step number in a small round plate (the marked step's plate is solid) */
  function num(p, d, i, x, y, r = 30) { const m = isM(d, i);
    p.circle(x, y, r, m ? { fill: C.ink, sw: 2 } : F(2.8)); txt(p, i + 1, x, y + r * .36, { size: r * 1.05, weight: 700, color: m ? C.fill : C.ink }); }
  /* the mark on step i at (x, y) — halo radius hr for light, a badge otherwise */
  function mark(p, d, x, y, hr = 110) {
    if (!d.mark) return; const h = d.mark.how;
    if (h === 'light') { p.circle(x, y, hr, { fill: 'rgba(255,255,255,.07)', sw: 0, stroke: 'none' }); p.circle(x, y, hr, { sw: 2.4, stroke: C.soft }); return; }
  }
  function badge(p, d, x, y, r = 36) {
    if (!d.mark || d.mark.how === 'light') return; const g = sub(p), k = r * .42; g.circle(x, y, r, F(3));
    if (d.mark.how === 'x') { g.line(x - k, y - k, x + k, y + k, W(5)); g.line(x + k, y - k, x - k, y + k, W(5)); }
    else g.poly([[x - k, y + 2], [x - k * .2, y + k * .8], [x + k * 1.05, y - k * .75]], W(5));
  }
  function chev(p, x, y, s = 18, w = 4) { p.poly([[x - s * .5, y - s], [x + s * .5, y], [x - s * .5, y + s]], W(w)); }

  const V = [];
  const variant = (id, th, build) => V.push({ id, th, build });

  /* 01 ── NODES: a line with a numbered node per step, the steps standing above it */
  variant('nodes', 'เส้นจุดลำดับ', (d, c) => {
    const k = n(d), xs = spread(k, -330, 330);
    art(c, p => {
      p.line(-430, 60, 430, 60, { sw: 3, stroke: C.soft });
      xs.forEach((x, i) => { mark(p, d, x, -100, 115); num(p, d, i, x, 60, 34); badge(p, d, isM(d, i) ? x + 85 : -9999, -190); });
      xs.forEach((x, i) => step(p, d, i, x, -100, 150, c, 165));
    });
  });

  /* 02 ── STAIRS: one step per item, climbing left to right — the item stands on its step, the number on the riser */
  variant('stairs', 'บันไดขั้น', (d, c) => {
    const k = n(d), sw = 820 / k, rise = 120, x0 = -410, top = i => 280 - (i + 1) * rise;
    art(c, p => {
      const pts = [[x0, 280]]; for (let i = 0; i < k; i++) pts.push([x0 + i * sw, top(i)], [x0 + (i + 1) * sw, top(i)]); pts.push([x0 + k * sw, 280]);
      p.shape(pts.map(([x, y]) => [f1(x), f1(y)]), F(3.2));
      for (let i = 0; i < k; i++) { const cx = x0 + i * sw + sw / 2; num(p, d, i, cx, top(i) + 55, 28); mark(p, d, isM(d, i) ? cx : -9999, top(i) - 85, 100); badge(p, d, isM(d, i) ? cx + 80 : -9999, top(i) - 170); }
    });
    for (let i = 0; i < k; i++) { const cx = x0 + i * sw + sw / 2; step(null, d, i, cx, top(i) - 80, 130, c, null); }
    art(c, p => d.items.forEach((it, i) => it.label && txt(p, it.label, x0 + i * sw + sw / 2, 320, { maxW: sw - 20, color: op(d, i) < 1 ? C.mute : C.soft })));
  });

  /* 03 ── CLIPBOARD: a checklist on a clipboard — one row per step with its box */
  variant('clipboard', 'คลิปบอร์ดเช็กลิสต์', (d, c) => {
    const k = n(d), ys = spread(k, -130, 200);
    art(c, p => {
      p.rect(-330, -260, 660, 560, Object.assign({ rx: 26 }, F(3.4)));
      p.rect(-90, -300, 180, 70, Object.assign({ rx: 16 }, F(3.2))); p.circle(0, -265, 12, W(2.4));
      ys.forEach((y, i) => { const m = isM(d, i); if (i) p.line(-280, y - (ys[1] - ys[0]) / 2, 280, y - (ys[1] - ys[0]) / 2, { sw: 1.4, stroke: C.rule });
        if (m && d.mark.how === 'light') p.rect(-300, y - 62, 600, 124, { rx: 18, fill: 'rgba(255,255,255,.07)', sw: 2, stroke: C.soft });
        p.rect(-275, y - 32, 64, 64, Object.assign({ rx: 12 }, F(3)));
        if (m && d.mark.how === 'check') p.poly([[-259, y + 2], [-246, y + 16], [-224, y - 16]], W(6));
        if (m && d.mark.how === 'x') { p.line(-262, y - 18, -226, y + 18, W(5)); p.line(-226, y - 18, -262, y + 18, W(5)); }
        const it = d.items[i]; if (it.label) txt(p, it.label, -60, y + 15, { anchor: 'start', maxW: 320, size: 46, weight: 700, color: op(d, i) < 1 ? C.mute : C.ink }); });
    });
    ys.forEach((y, i) => icon(d.items[i].icon, -130, y, 96, c, op(d, i)));
  });

  /* 04 ── CARDS: numbered cards in a row with chevrons between them */
  variant('cards', 'การ์ดเลขข้อ', (d, c) => {
    const k = n(d), xs = spread(k, -320, 320), cw = Math.min(240, 760 / k - 30);
    art(c, p => {
      xs.forEach((x, i) => { const m = isM(d, i) && d.mark.how === 'light', g = sub(p, m ? { transform: `translate(0 -18)` } : {});
        g.rect(x - cw / 2, -170, cw, 340, Object.assign({ rx: 26 }, m ? F(4.2) : F(3.2)));
        num(g, d, i, x, -170, 34);
        if (d.items[i].label) txt(g, d.items[i].label, x, 125, { maxW: cw - 30, color: op(d, i) < 1 ? C.mute : C.soft });
        badge(g, d, isM(d, i) ? x + cw / 2 - 6 : -9999, -150); });
      for (let i = 0; i < k - 1; i++) chev(p, (xs[i] + xs[i + 1]) / 2, 0, 18, 4);
    });
    xs.forEach((x, i) => icon(d.items[i].icon, x, -10 - (isM(d, i) && d.mark.how === 'light' ? 18 : 0), cw * .6, c, op(d, i)));
  });

  /* 05 ── TRAIN: an engine pulls the steps as cars — car 1 right behind the engine (the train runs to the left) */
  variant('train', 'ขบวนรถไฟ', (d, c) => {
    const k = n(d), cw = Math.min(210, 700 / k - 20), xs = [...Array(k)].map((_, i) => -200 + cw / 2 + 20 + i * (cw + 20));
    art(c, p => {
      p.line(-470, 210, 470, 210, W(3)); for (let x = -450; x < 470; x += 60) p.line(x, 210, x - 14, 230, { sw: 2, stroke: C.soft });
      p.path('M -440 160 L -440 20 Q -440 -20 -400 -20 L -300 -20 L -300 -90 L -230 -90 L -230 160 Z', F(3.4)); p.rect(-390, 10, 70, 60, Object.assign({ rx: 8 }, W(2)));
      p.rect(-430, -70, 40, 50, Object.assign({ rx: 6 }, F(2.6))); [-400, -280].forEach(x => p.circle(x, 175, 30, F(3)));
      xs.forEach((x, i) => { p.line(x - cw / 2 - 20, 130, x - cw / 2, 130, W(4));
        p.rect(x - cw / 2, -60, cw, 200, Object.assign({ rx: 14 }, F(3.2))); [x - cw / 4, x + cw / 4].forEach(wx => p.circle(wx, 175, 26, F(3)));
        num(p, d, i, x, -60, 28); mark(p, d, isM(d, i) ? x : -9999, 40, cw * .62); badge(p, d, isM(d, i) ? x + cw / 2 : -9999, -55); });
      d.items.forEach((it, i) => it.label && txt(p, it.label, xs[i], 285, { maxW: cw + 10, color: op(d, i) < 1 ? C.mute : C.soft }));
    });
    xs.forEach((x, i) => icon(d.items[i].icon, x, 40, cw * .55, c, op(d, i)));
  });

  /* 06 ── STEPPER: numbered circles down a vertical line, each step to the right of its number */
  variant('stepper', 'ลำดับแนวตั้ง', (d, c) => {
    const k = n(d), ys = spread(k, -220, 220);
    art(c, p => {
      p.line(-300, ys[0], -300, ys[k - 1], { sw: 4, stroke: C.soft });
      ys.forEach((y, i) => { num(p, d, i, -300, y, 46); if (isM(d, i) && d.mark.how === 'light') p.rect(-360, y - 80, 780, 160, { rx: 30, fill: 'rgba(255,255,255,.07)', sw: 2.2, stroke: C.soft });
        badge(p, d, isM(d, i) ? 360 : -9999, y);
        if (d.items[i].label) txt(p, d.items[i].label, -60, y + 16, { anchor: 'start', maxW: 380, size: 48, weight: 700, color: op(d, i) < 1 ? C.mute : C.ink }); });
    });
    ys.forEach((y, i) => icon(d.items[i].icon, -150, y, 110, c, op(d, i)));
  });

  /* 07 ── ROAD: a road climbing gently left to right with a numbered marker post at each step; each step above its post */
  variant('road', 'ถนนหลักบอกทาง', (d, c) => {
    const k = n(d), xs = spread(k, -300, 300), ry = x => 150 - .27 * x;
    art(c, p => {
      const D = 'M -470 277 C -250 245, -150 170, 0 150 S 250 70, 470 23';
      p.path(D, { sw: 56 }); p.path(D, { sw: 46, stroke: C.fill }); p.path(D, { sw: 3, stroke: C.soft, 'stroke-dasharray': '18 16' });
      xs.forEach((x, i) => { const b = ry(x) - 30, m = isM(d, i);
        p.line(x, b, x, b - 80, W(5)); p.rect(x - 38, b - 150, 76, 70, Object.assign({ rx: 10 }, m ? { fill: C.ink, sw: 2 } : F(3)));
        txt(p, i + 1, x, b - 100, { size: 42, weight: 700, color: m ? C.fill : C.ink });
        mark(p, d, m ? x : -9999, b - 230, 85); badge(p, d, m ? x + 70 : -9999, b - 290, 30);
        if (d.items[i].label) txt(p, d.items[i].label, x, b - 320, { maxW: 240, color: op(d, i) < 1 ? C.mute : C.soft }); });
    });
    xs.forEach((x, i) => icon(d.items[i].icon, x, ry(x) - 30 - 230, 115, c, op(d, i)));
  });

  /* 08 ── LADDER: one rung per step, climbing bottom to top; each step beside its rung */
  variant('ladder', 'บันไดลิง', (d, c) => {
    const k = n(d), ys = spread(k, 200, -200);
    art(c, p => {
      [-70, 70].forEach(x => p.line(x, 300, x, -300, { sw: 10 }));
      for (let y = 260; y > -300; y -= 70) p.line(-70, y, 70, y, W(4));
      ys.forEach((y, i) => { const s = i % 2 ? 1 : -1; num(p, d, i, 0, y, 30); p.line(s * 70, y, s * 130, y, { sw: 2, stroke: C.soft });
        mark(p, d, isM(d, i) ? s * 230 : -9999, y, 95); badge(p, d, isM(d, i) ? s * 320 : -9999, y - 70);
        if (d.items[i].label) txt(p, d.items[i].label, s * 350, y + 14, { anchor: s > 0 ? 'start' : 'end', maxW: 140, color: op(d, i) < 1 ? C.mute : C.soft }); });
    });
    ys.forEach((y, i) => icon(d.items[i].icon, (i % 2 ? 1 : -1) * 230, y, 120, c, op(d, i)));
  });

  /* 09 ── NOTEBOOK: a spiral notebook page with the steps written 1, 2, 3 */
  variant('notebook', 'สมุดจด', (d, c) => {
    const k = n(d), ys = spread(k, -120, 190);
    art(c, p => {
      p.rect(-360, -270, 720, 560, Object.assign({ rx: 18 }, F(3.4)));
      for (let x = -300; x <= 300; x += 60) { p.circle(x, -270, 12, F(2.4)); p.line(x, -282, x, -250, W(2.4)); }
      p.line(-250, -220, -250, 270, { sw: 1.6, stroke: C.soft });
      ys.forEach((y, i) => { p.line(-330, y + 50, 330, y + 50, { sw: 1.2, stroke: C.rule });
        if (isM(d, i) && d.mark.how === 'light') p.path(`M -240 ${y + 32} L 300 ${y + 32}`, { sw: 34, stroke: 'rgba(255,255,255,.1)' });
        txt(p, (i + 1) + '.', -300, y + 18, { size: 50, weight: 700, color: C.ink });
        if (d.items[i].label) txt(p, d.items[i].label, -90, y + 18, { anchor: 'start', maxW: 360, size: 46, weight: 700, color: op(d, i) < 1 ? C.mute : C.ink });
        badge(p, d, isM(d, i) ? 300 : -9999, y); });
    });
    ys.forEach((y, i) => icon(d.items[i].icon, -165, y, 90, c, op(d, i)));
  });

  /* 10 ── STONES: stepping stones across water, one per step */
  variant('stones', 'หินข้ามน้ำ', (d, c) => {
    const k = n(d), P = spread(k, 0, 1).map(t => [-330 + 660 * t, 150 - 230 * t]);
    art(c, p => {
      [[-470, 300, -200], [-300, 230, 100], [100, 280, 470], [-470, 60, -380], [300, 120, 470]].forEach(([x1, y, x2]) => {
        let D = `M ${x1} ${y}`; for (let x = x1; x < x2; x += 60) D += ` q 15 -12 30 0 t 30 0`; p.path(D, { sw: 2, stroke: C.rule }); });
      P.forEach(([x, y], i) => { p.ellipse(x, y + 70, 150, 50, F(3.2)); p.path(`M ${x - 110} ${y + 75} Q ${x} ${y + 95} ${x + 110} ${y + 75}`, { sw: 1.6, stroke: C.soft });
        num(p, d, i, x + 120, y + 80, 26); mark(p, d, isM(d, i) ? x : -9999, y - 20, 105); badge(p, d, isM(d, i) ? x + 90 : -9999, y - 110); });
      P.forEach(([x, y], i) => d.items[i].label && txt(p, d.items[i].label, x, y + 160, { maxW: 240, color: op(d, i) < 1 ? C.mute : C.soft }));
    });
    P.forEach(([x, y], i) => icon(d.items[i].icon, x, y - 20, 125, c, op(d, i)));
  });

  /* 11 ── TABS: file folders in a row, each tab numbered — the marked folder is pulled up */
  variant('tabs', 'แฟ้มแท็บ', (d, c) => {
    const k = n(d), xs = spread(k, -300, 300), w = Math.min(290, 840 / k);
    art(c, p => {
      p.line(-470, 260, 470, 260, { sw: 2, stroke: C.soft });
      xs.forEach((x, i) => { const up = isM(d, i) ? -50 : 0, g = sub(p, { transform: `translate(0 ${up})` });
        g.path(`M ${x - w / 2} 250 L ${x - w / 2} -150 L ${x - w / 2 + 20} -150 L ${x - w / 2 + 30} -195 L ${x - w / 2 + 110} -195 L ${x - w / 2 + 120} -150 L ${x + w / 2} -150 L ${x + w / 2} 250 Z`, F(3.3));
        txt(g, i + 1, x - w / 2 + 70, -160, { size: 38, weight: 700, color: C.ink });
        if (d.items[i].label) txt(g, d.items[i].label, x, 200, { maxW: w - 30, color: op(d, i) < 1 ? C.mute : C.soft });
        badge(g, d, isM(d, i) ? x + w / 2 - 20 : -9999, -130); });
    });
    xs.forEach((x, i) => icon(d.items[i].icon, x, 30 - (isM(d, i) ? 50 : 0), w * .55, c, op(d, i)));
  });

  /* 12 ── CHEVRONS: a banner of chevron segments pointing onward, one per step */
  variant('chevrons', 'ลูกศรต่อกัน', (d, c) => {
    const k = n(d), W0 = 900 / k, h = 150, x0 = -450;
    art(c, p => {
      for (let i = 0; i < k; i++) { const xa = x0 + i * W0, xb = xa + W0 - 12, t = 50, m = isM(d, i) && d.mark.how === 'light';
        p.shape([[xa, -h], [xb, -h], [xb + t, 0], [xb, h], [xa, h], [xa + (i ? t : 0), 0]].map(([x, y]) => [f1(x), f1(y)]), m ? { fill: 'rgba(255,255,255,.07)', sw: 4, stroke: C.ink } : F(3.2));
        txt(p, i + 1, xa + 40 + (i ? 30 : 0), -h + 50, { size: 36, weight: 700, color: C.ink });
        badge(p, d, isM(d, i) ? xb - 10 : -9999, -h, 32);
        if (d.items[i].label) txt(p, d.items[i].label, xa + W0 / 2 + 10, h + 70, { maxW: W0 - 20, color: op(d, i) < 1 ? C.mute : C.soft }); }
    });
    for (let i = 0; i < k; i++) icon(d.items[i].icon, x0 + i * W0 + W0 / 2 + 15, 10, Math.min(150, W0 * .5), c, op(d, i));
  });

  /* 13 ── PROGRESS: a segmented progress bar, one segment per step — the marked segment fills */
  variant('progress', 'แถบความคืบหน้า', (d, c) => {
    const k = n(d), W0 = 860 / k, x0 = -430;
    art(c, p => {
      for (let i = 0; i < k; i++) { const xa = x0 + i * W0 + 8, m = isM(d, i);
        p.rect(xa, 100, W0 - 16, 70, Object.assign({ rx: 35 }, m ? { fill: C.ink, sw: 2 } : F(3)));
        txt(p, i + 1, xa + (W0 - 16) / 2, 148, { size: 40, weight: 700, color: m ? C.fill : C.ink });
        mark(p, d, m ? xa + (W0 - 16) / 2 : -9999, -80, 115); badge(p, d, m ? xa + W0 - 40 : -9999, -170);
        if (d.items[i].label) txt(p, d.items[i].label, xa + (W0 - 16) / 2, 250, { maxW: W0 - 20, color: op(d, i) < 1 ? C.mute : C.soft }); }
    });
    for (let i = 0; i < k; i++) icon(d.items[i].icon, x0 + i * W0 + W0 / 2, -80, Math.min(160, W0 * .55), c, op(d, i));
  });

  /* 14 ── TOWER: blocks stacked from step 1 at the bottom to the last at the top */
  variant('tower', 'บล็อกต่อชั้น', (d, c) => {
    const k = n(d), bh = Math.min(170, 560 / k), y0 = 280;
    art(c, p => {
      p.line(-470, y0, 470, y0, { sw: 2, stroke: C.soft });
      for (let i = 0; i < k; i++) { const y = y0 - (i + 1) * bh, m = isM(d, i), sh = m && d.mark.how === 'light' ? 40 : 0;
        p.rect(-250 + sh, y + 6, 500, bh - 8, Object.assign({ rx: 14 }, m ? F(4.2) : F(3.2)));
        num(p, d, i, -200 + sh, y + bh / 2, 30); badge(p, d, m ? 250 + sh : -9999, y + 20);
        if (d.items[i].label) txt(p, d.items[i].label, -20 + sh, y + bh / 2 + 15, { anchor: 'start', maxW: 250, size: 44, weight: 700, color: op(d, i) < 1 ? C.mute : C.ink }); }
    });
    for (let i = 0; i < k; i++) { const sh = isM(d, i) && d.mark.how === 'light' ? 40 : 0; icon(d.items[i].icon, -100 + sh, y0 - (i + .5) * bh, bh * .6, c, op(d, i)); }
  });

  /* 15 ── PINNED NOTES: notes pinned in a zigzag, a thread running from pin to pin in order */
  variant('pins', 'โน้ตโยงด้าย', (d, c) => {
    const k = n(d), P = spread(k, 0, 1).map((t, i) => [-320 + 640 * t, i % 2 ? -60 : 60]);
    art(c, p => {
      for (let i = 0; i < k - 1; i++) p.path(`M ${P[i][0]} ${P[i][1] - 120} Q ${(P[i][0] + P[i + 1][0]) / 2} ${(P[i][1] + P[i + 1][1]) / 2 - 60} ${P[i + 1][0]} ${P[i + 1][1] - 120}`, { sw: 2.4, stroke: C.soft });
      P.forEach(([x, y], i) => { const r = i % 2 ? 4 : -4, g = sub(p, { transform: `rotate(${r} ${x} ${y})` }), m = isM(d, i);
        g.rect(x - 120, y - 120, 240, 260, Object.assign({ rx: 10 }, m && d.mark.how === 'light' ? F(4.2) : F(3.2)));
        if (d.items[i].label) txt(g, d.items[i].label, x, y + 105, { maxW: 200, color: op(d, i) < 1 ? C.mute : C.soft });
        txt(g, i + 1, x - 85, y - 70, { size: 38, weight: 700, color: C.ink });
        p.circle(x, y - 120, 18, m ? { fill: C.ink, sw: 2 } : F(3)); badge(p, d, m ? x + 110 : -9999, y - 110, 32); });
    });
    P.forEach(([x, y], i) => icon(d.items[i].icon, x, y - 5, 120, c, op(d, i), [i % 2 ? 4 : -4, x, y]));
  });

  /* 16 ── ROUTE: a dotted route on a map with a numbered pin at each step and a flag at the end */
  variant('route', 'เส้นทางแผนที่', (d, c) => {
    const k = n(d), P = [[-320, 70], [-30, -150], [270, -30], [380, -200]].slice(0, k);
    art(c, p => {
      p.rect(-460, -280, 920, 590, { rx: 22, sw: 2, stroke: C.rule });
      let D = `M -440 260`; P.forEach(([x, y]) => D += ` L ${x} ${y + 50}`); D += ` L 440 ${P[k - 1][1] - 40}`;
      p.path(D, { sw: 4, stroke: C.soft, 'stroke-dasharray': '4 16' });
      P.forEach(([x, y], i) => { const m = isM(d, i);
        p.path(`M ${x} ${y + 50} C ${x - 10} ${y + 30}, ${x - 46} ${y + 2}, ${x - 46} ${y - 34} A 46 46 0 1 1 ${x + 46} ${y - 34} C ${x + 46} ${y + 2}, ${x + 10} ${y + 30}, ${x} ${y + 50} Z`, m ? { fill: C.ink, sw: 2 } : F(3.2));
        txt(p, i + 1, x, y - 20, { size: 40, weight: 700, color: m ? C.fill : C.ink }); badge(p, d, m ? x - 50 : -9999, y - 80, 28);
        if (d.items[i].label) txt(p, d.items[i].label, x + 120, y + 30, { anchor: 'start', maxW: 170, color: op(d, i) < 1 ? C.mute : C.soft }); });
    });
    P.forEach(([x, y], i) => icon(d.items[i].icon, x + 85, y - 40, 80, c, op(d, i)));
  });

  /* 17 ── FILM STRIP: a strip of film, one frame per step, frame numbers on the edge */
  variant('film', 'แผ่นฟิล์ม', (d, c) => {
    const k = n(d), W0 = 840 / k, x0 = -420;
    art(c, p => {
      p.rect(-460, -190, 920, 380, Object.assign({ rx: 14 }, F(3.4)));
      for (let x = -440; x < 450; x += 45) { p.rect(x, -175, 24, 22, Object.assign({ rx: 5 }, W(1.8))); p.rect(x, 153, 24, 22, Object.assign({ rx: 5 }, W(1.8))); }
      for (let i = 0; i < k; i++) { const xa = x0 + i * W0 + 10, m = isM(d, i);
        p.rect(xa, -135, W0 - 20, 270, Object.assign({ rx: 8 }, m && d.mark.how === 'light' ? { fill: 'rgba(255,255,255,.07)', sw: 3.6, stroke: C.ink } : F(2.6)));
        txt(p, i + 1, xa + 26, -100, { size: 32, weight: 700, color: C.ink }); badge(p, d, m ? xa + W0 - 40 : -9999, -120, 30);
        if (d.items[i].label) txt(p, d.items[i].label, xa + (W0 - 20) / 2, 260, { maxW: W0 - 20, color: op(d, i) < 1 ? C.mute : C.soft }); }
    });
    for (let i = 0; i < k; i++) icon(d.items[i].icon, x0 + i * W0 + W0 / 2, 5, Math.min(170, W0 * .55), c, op(d, i));
  });

  /* 18 ── SWITCHES: a panel of switches, one per step in order — up to the marked step they are on */
  variant('switches', 'แผงสวิตช์', (d, c) => {
    const k = n(d), xs = spread(k, -280, 280), upto = d.mark ? d.mark.at : k - 1;
    art(c, p => {
      p.rect(-430, -20, 860, 260, Object.assign({ rx: 26 }, F(3.4)));
      xs.forEach((x, i) => { const on = i <= upto && !(d.mark && d.mark.how === 'x' && i === d.mark.at);
        p.rect(x - 50, 20, 100, 180, Object.assign({ rx: 50 }, F(3)));
        p.circle(x, on ? 70 : 150, 38, on ? { fill: C.ink, sw: 2 } : F(3));
        num(p, d, i, x - 110, 60, 24); badge(p, d, isM(d, i) ? x + 75 : -9999, 10, 30);
        if (d.items[i].label) txt(p, d.items[i].label, x, 300, { maxW: 240, color: op(d, i) < 1 ? C.mute : C.soft }); });
      xs.forEach((x, i) => mark(p, d, isM(d, i) ? x : -9999, -170, 100));
    });
    xs.forEach((x, i) => icon(d.items[i].icon, x, -170, 130, c, op(d, i)));
  });

  /* 19 ── TRAYS: stacked document trays, step 1 on top — each tray's front holds its step */
  variant('trays', 'ถาดเอกสาร', (d, c) => {
    const k = n(d), th = Math.min(180, 580 / k), y0 = -280;
    art(c, p => {
      for (let i = 0; i < k; i++) { const y = y0 + i * th, m = isM(d, i) && d.mark.how === 'light', sx = m ? 40 : 0;
        p.path(`M ${-330 + sx} ${y + 20} L ${330 + sx} ${y + 20} L ${300 + sx} ${y + th - 10} L ${-300 + sx} ${y + th - 10} Z`, m ? F(4.2) : F(3.2));
        p.line(-320 + sx, y + 20, -300 + sx, y + 6, W(2)); p.line(320 + sx, y + 20, 300 + sx, y + 6, W(2));
        num(p, d, i, -250 + sx, y + th / 2 + 5, 28); badge(p, d, isM(d, i) ? 340 + sx : -9999, y + 20, 30);
        if (d.items[i].label) txt(p, d.items[i].label, -40 + sx, y + th / 2 + 20, { anchor: 'start', maxW: 300, size: 44, weight: 700, color: op(d, i) < 1 ? C.mute : C.ink }); }
      p.line(-300, y0 + k * th - 10, -300, 300, W(4)); p.line(300, y0 + k * th - 10, 300, 300, W(4));
    });
    for (let i = 0; i < k; i++) { const sx = isM(d, i) && d.mark.how === 'light' ? 40 : 0; icon(d.items[i].icon, -130 + sx, y0 + i * th + th / 2 + 5, th * .5, c, op(d, i)); }
  });

  /* 20 ── BINDERS: binders standing on a shelf in order, numbers on their spines — the marked one is pulled forward */
  variant('binders', 'แฟ้มสันเลข', (d, c) => {
    const k = n(d), xs = spread(k, -260, 260), bw = Math.min(180, 700 / k);
    art(c, p => {
      p.rect(-460, 220, 920, 26, Object.assign({ rx: 6 }, F(3)));
      xs.forEach((x, i) => { const m = isM(d, i) && d.mark.how === 'light', up = m ? -40 : 0, g = sub(p, { transform: `translate(0 ${up})` });
        g.rect(x - bw / 2, -260 - up, bw, 480 + up, Object.assign({ rx: 12 }, m ? F(4.2) : F(3.2)));
        g.rect(x - bw / 2 + 24, -180, bw - 48, 70, Object.assign({ rx: 10 }, W(2)));
        txt(g, i + 1, x, -128, { size: 46, weight: 700, color: C.ink }); g.circle(x, 150, 18, W(2.4));
        badge(g, d, isM(d, i) ? x + bw / 2 : -9999, -250, 30); });
      xs.forEach((x, i) => d.items[i].label && txt(p, d.items[i].label, x, 300, { maxW: bw + 40, color: op(d, i) < 1 ? C.mute : C.soft }));
    });
    xs.forEach((x, i) => icon(d.items[i].icon, x, 20 - (isM(d, i) && d.mark.how === 'light' ? 40 : 0), bw * .62, c, op(d, i)));
  });

  /* samples from unrelated topics (neutrality) + a stress set */
  const I = (icon, label) => label ? { icon, label } : { icon };
  const SAMPLES = [
    { say: 'ล้างมือ ใส่ถุงมือ แล้วค่อยหยิบ', items: [I('droplet', 'ล้างมือ'), I('shield-check', 'ใส่ถุงมือ'), I('package', 'หยิบของ')] },
    { say: 'ตื่น ยืดเส้น แล้วออกไปวิ่ง', items: [I('bed', 'ตื่น'), I('dumbbell', 'ยืดเส้น'), I('person-standing', 'ออกไปวิ่ง')], mark: { at: 2, how: 'light' } },
    { say: 'เช็กลม เช็กเบรก เช็กไฟ', items: [I('gauge', 'เช็กลม'), I('octagon-alert', 'เช็กเบรก'), I('lightbulb', 'เช็กไฟ')], mark: { at: 1, how: 'check' } },
    { say: 'สมัคร ยืนยันอีเมล แล้วเริ่มใช้', items: [I('user-plus', 'สมัคร'), I('mail', 'ยืนยันอีเมล'), I('rocket', 'เริ่มใช้')], mark: { at: 1, how: 'light' } },
    { say: 'ตวงแป้ง ผสม แล้วอบ', items: [I('wheat', 'ตวงแป้ง'), I('cooking-pot', 'ผสม'), I('cake', 'อบ')] },
    { say: 'วางแผน ลงมือ ทบทวน', items: [I('clipboard-list', 'วางแผน'), I('hammer', 'ลงมือ'), I('search', 'ทบทวน')], mark: { at: 2, how: 'light' } },
    { say: 'ซื้อตั๋ว ขึ้นรถไฟ ถึงปลายทาง', items: [I('ticket', 'ซื้อตั๋ว'), I('train-front', 'ขึ้นรถไฟ'), I('map-pin', 'ถึงปลายทาง')], mark: { at: 0, how: 'check' } },
    { say: 'หาข้อมูล เขียน แล้วส่ง', items: [I('book-open', 'หาข้อมูล'), I('pen-line', 'เขียน'), I('send', 'ส่ง')], mark: { at: 1, how: 'x' } },
    { say: 'รดน้ำ ใส่ปุ๋ย รอออกดอก', items: [I('droplet', 'รดน้ำ'), I('sprout', 'ใส่ปุ๋ย'), I('flower', 'รอออกดอก')], mark: { at: 1, how: 'light' } },
    { say: 'ปิดไฟ ล็อกประตู แล้วเข้านอน', items: [I('lightbulb-off', 'ปิดไฟ'), I('lock', 'ล็อกประตู'), I('moon', 'เข้านอน')], mark: { at: 1, how: 'check' } },
    { say: 'ถ่ายรูป แต่งรูป แล้วโพสต์', items: [I('camera', 'ถ่ายรูป'), I('brush', 'แต่งรูป'), I('send', 'โพสต์')] },
    { say: 'จดไอเดีย คัดเลือก ลงมือทำ', items: [I('notebook-pen', 'จดไอเดีย'), I('filter', 'คัดเลือก'), I('rocket', 'ลงมือทำ')], mark: { at: 1, how: 'light' } },
    { say: 'ชาร์จแบต เปิดเครื่อง ต่อไวไฟ', items: [I('battery-charging', 'ชาร์จแบต'), I('power', 'เปิดเครื่อง'), I('wifi', 'ต่อไวไฟ')], mark: { at: 0, how: 'x' } },
    { say: 'วัดที่ ก่อผนัง มุงหลังคา', items: [I('ruler', 'วัดที่'), I('building', 'ก่อผนัง'), I('house', 'มุงหลังคา')], mark: { at: 0, how: 'light' } },
    { say: 'ทักทาย ฟัง แล้วค่อยตอบ', items: [I('smile', 'ทักทาย'), I('headphones', 'ฟัง'), I('message-circle', 'ตอบ')], mark: { at: 1, how: 'light' } },
    { say: 'ออกจากบ้าน แวะร้าน กลับบ้าน', items: [I('house', 'ออกจากบ้าน'), I('store', 'แวะร้าน'), I('house', 'กลับบ้าน')] },
    { say: 'ถ่าย ตัดต่อ แล้วฉาย', items: [I('camera', 'ถ่าย'), I('scissors', 'ตัดต่อ'), I('tv', 'ฉาย')], mark: { at: 1, how: 'light' } },
    { say: 'เปิดเตา ใส่น้ำมัน ตอกไข่', items: [I('cooking-pot', 'เปิดเตา'), I('droplet', 'ใส่น้ำมัน'), I('egg', 'ตอกไข่')], mark: { at: 1, how: 'check' } },
    { say: 'จัดเอกสาร เซ็นชื่อ แล้วยื่น', items: [I('file-text', 'จัดเอกสาร'), I('signature', 'เซ็นชื่อ'), I('inbox', 'ยื่น')], mark: { at: 1, how: 'light' } },
    { say: 'เก็บของ ปิดกล่อง แล้วส่ง', items: [I('package-open', 'เก็บของ'), I('package', 'ปิดกล่อง'), I('truck', 'ส่ง')], mark: { at: 2, how: 'check' } },
  ];
  const STRESS = [
    { say: 'ไม่มีป้ายเลย', items: [I('coffee'), I('book-open'), I('bed')] },
    { say: 'ป้ายยาว 12 ตัว + ✓ ข้อ 3', items: [I('mail', 'เปิดอีเมลก่อนเลย'), I('pen-line', 'ตอบให้ครบทุกฉบับ'), I('send', 'กดส่งอย่างระวัง')], mark: { at: 2, how: 'check' } },
    { say: '✕ ข้อแรก', items: [I('key', 'หากุญแจ'), I('lock', 'ไขล็อก'), I('house', 'เข้าบ้าน')], mark: { at: 0, how: 'x' } },
    { say: 'ภาษาอังกฤษ + ติดไฟข้อ 1', items: [I('search', 'Research'), I('pen-line', 'Write'), I('send', 'Publish')], mark: { at: 0, how: 'light' } },
    { say: 'ไอคอนซ้ำกัน', items: [I('star', 'ดาวที่ 1'), I('star', 'ดาวที่ 2'), I('star', 'ดาวที่ 3')], mark: { at: 2, how: 'light' } },
    { say: '✓ ข้อแรก ไม่มีป้าย', items: [I('bell'), I('smile'), I('heart')], mark: { at: 0, how: 'check' } },
    { say: 'ติดไฟข้อสุดท้าย', items: [I('shirt', 'ซัก'), I('sun', 'ตาก'), I('shirt', 'พับ')], mark: { at: 2, how: 'light' } },
    { say: '✕ ข้อสุดท้าย', items: [I('coffee', 'ชง'), I('glass-water', 'เติมน้ำ'), I('cake', 'กินของหวาน')], mark: { at: 2, how: 'x' } },
    { say: 'ไม่มี mark ป้ายยาว', items: [I('map-pin', 'ปักหมุดที่หมาย'), I('car', 'ขับไปตามทาง'), I('house', 'ถึงบ้านปลอดภัย')] },
    { say: '✓ ข้อกลาง', items: [I('apple', 'ล้าง'), I('scissors', 'หั่น'), I('salad', 'จัดจาน')], mark: { at: 1, how: 'check' } },
    { say: 'ติดไฟข้อกลาง ไม่มีป้าย', items: [I('cloud'), I('droplet'), I('sprout')], mark: { at: 1, how: 'light' } },
    { say: '✕ ข้อกลาง', items: [I('phone', 'โทรหา'), I('message-circle', 'ทักแชต'), I('mail', 'ส่งเมล')], mark: { at: 1, how: 'x' } },
    { say: 'ติดไฟข้อแรก', items: [I('ruler', 'วัด'), I('scissors', 'ตัด'), I('hammer', 'ประกอบ')], mark: { at: 0, how: 'light' } },
    { say: '✓ ข้อสุดท้าย', items: [I('book', 'อ่าน'), I('notebook-pen', 'จด'), I('brain', 'จำได้')], mark: { at: 2, how: 'check' } },
    { say: 'ไม่มี mark', items: [I('sun', 'เช้า'), I('coffee', 'กาแฟ'), I('laptop', 'เริ่มงาน')] },
    { say: '✕ ข้อแรก ป้ายยาว', items: [I('cookie', 'กินขนมก่อนนอน'), I('tv', 'ดูจอจนดึกดื่น'), I('bed', 'นอนไม่หลับทั้งคืน')], mark: { at: 0, how: 'x' } },
    { say: 'ติดไฟข้อ 2 (ภาษาอังกฤษ)', items: [I('camera', 'Shoot'), I('scissors', 'Edit'), I('tv', 'Show')], mark: { at: 1, how: 'light' } },
    { say: '✓ ข้อกลาง ไม่มีป้าย', items: [I('wheat'), I('cooking-pot'), I('cake')], mark: { at: 1, how: 'check' } },
    { say: 'ติดไฟข้อ 3 ป้ายยาว', items: [I('file-text', 'กรอกแบบฟอร์ม'), I('signature', 'เซ็นกำกับทุกหน้า'), I('inbox', 'ยื่นที่เคาน์เตอร์')], mark: { at: 2, how: 'light' } },
    { say: '✕ ข้อกลาง ป้ายยาว', items: [I('package-open', 'ใส่ของให้ครบ'), I('package', 'ปิดกล่องให้แน่น'), I('truck', 'ส่งตามรอบเวลา')], mark: { at: 1, how: 'x' } },
  ];

  G.cats = G.cats || {};
  G.cats.B04 = { variants: V, SAMPLES, STRESS, draw: (i, d, c) => V[i].build(d, c) };
})();
