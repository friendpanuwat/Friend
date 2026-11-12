/* b01.js — category B01 "ตัวเลขเด่น" (a number is the point of the sentence): 20 neutral designs, glow-line style.
   STILL DRAFTS (stage 1, for the user to keep / drop / fix) — motion comes after approval.
   Slots (same as CutPack CATEGORIES.md B01): value (string as spoken: "1,250", "2.5", "30%") · unit (optional) ·
   icon (optional Lucide name → GL.icons) · dir ('up' | 'down', optional).
   Every design draws on a 1000 × 700 canvas centred at (0,0); place with GL.cats.B01.draw(i, data, { x, y, s, at }).
   Neutral rules: the number is the biggest thing; no other numbers on screen; no topic-specific objects;
   proportion (ring / bar / gauge / ruler) is real only for "%" — otherwise dir picks high / low, or the measure is full. */
(function () {
  const G = window.GL, C = G.C;
  const W = (w = 2) => ({ sw: w }), F = (w = 3.2) => ({ fill: C.fill, sw: w });
  const rad = d => d * Math.PI / 180, f1 = v => +v.toFixed(1);
  const pct = d => /%\s*$/.test(d.value) ? Math.max(0, Math.min(1, parseFloat(String(d.value).replace(/,/g, '')) / 100)) : null;
  const zero = d => parseFloat(String(d.value).replace(/,/g, '')) === 0;
  const frac = d => zero(d) ? 0 : pct(d) ?? (d.dir === 'up' ? .82 : d.dir === 'down' ? .28 : 1);
  const pos = d => zero(d) ? 0 : pct(d) ?? (d.dir === 'up' ? .78 : d.dir === 'down' ? .26 : .62);   // where a pointer sits (never 'full' unless 100%)

  /* text: Pen text, shrunk to maxW */
  function txt(p, str, x, y, { size = 100, maxW = 1e9, weight = 700, anchor = 'middle', color = C.ink, ls = 0 } = {}) {
    const e = p.text(String(str), x, y, { size, weight, anchor, color, ls, dur: .01 });
    const w = e.getBBox().width; if (w > maxW) { size *= maxW / w; e.setAttribute('font-size', f1(size)); }
    return { e, size, bb: e.getBBox() };
  }
  /* number + unit on one baseline, centred (or anchored) at x, shrunk together to maxW */
  function numUnit(p, d, x, base, { size = 200, maxW = 800, usize, gap, ucolor = C.soft, anchor = 'middle' } = {}) {
    usize = usize || size * .3; gap = gap ?? size * .1;
    const n = p.text(d.value, 0, base, { size, anchor: 'start', dur: .01 });
    const u = d.unit ? p.text(d.unit, 0, base, { size: usize, anchor: 'start', weight: 600, color: ucolor, dur: .01 }) : null;
    const meas = () => n.getBBox().width + (u ? gap + u.getBBox().width : 0);
    let tw = meas();
    if (tw > maxW) {                              // shrink the number first; the unit never goes below 40
      const nw = n.getBBox().width, uw = u ? u.getBBox().width : 0, uk = u ? Math.max(maxW / tw, Math.min(1, 40 / usize)) : 1;
      const k = (maxW - uw * uk) / (nw + (u ? gap : 0)); size *= k; gap *= k; usize *= uk;
      n.setAttribute('font-size', f1(size)); if (u) u.setAttribute('font-size', f1(usize)); tw = meas(); }
    const x0 = anchor === 'middle' ? x - tw / 2 : anchor === 'end' ? x - tw : x;
    n.setAttribute('x', f1(x0)); if (u) u.setAttribute('x', f1(x0 + n.getBBox().width + gap));
    return { left: x0, right: x0 + tw, size, top: base - size * .72, nRight: x0 + n.getBBox().width };
  }
  /* arrow up / down inside a small round badge */
  function dirBadge(p, dir, x, y, r = 34) {
    if (!dir) return;
    const q = p.child({ transform: `translate(${f1(x)} ${f1(y)})` }), s = dir === 'up' ? -1 : 1;
    q.circle(0, 0, r, F(3)); q.line(0, -s * r * .5, 0, s * r * .5, W(4.4)); q.poly([[-r * .32, s * r * .18], [0, s * r * .52], [r * .32, s * r * .18]], W(4.4));
  }
  function arrowLine(p, x1, y1, x2, y2, w = 4) {
    const a = Math.atan2(y2 - y1, x2 - x1), h = 16;
    p.line(x1, y1, x2, y2, W(w)); p.poly([[x2 - h * Math.cos(a - .5), y2 - h * Math.sin(a - .5)], [x2, y2], [x2 - h * Math.cos(a + .5), y2 - h * Math.sin(a + .5)]], W(w));
  }
  /* an icon from the -pro library at canvas point (cx, cy), box width wd (canvas units) */
  function icon(d, cx, cy, wd, c) {
    if (!d.icon) return;
    const fn = G.icons[d.icon] || G.icons[d.icon + '-pro'];
    if (!fn) { console.warn('B01: no icon', d.icon); return; }
    G.art(fn, { x: c.x + cx * c.s, y: c.y + cy * c.s, w: wd * c.s, at: (c.at || 0) + .15 });
  }
  const art = (c, fn) => G.art(fn, { x: c.x, y: c.y, s: c.s, at: c.at || 0 });

  const V = [];
  const variant = (id, th, build) => V.push({ id, th, build });

  /* 01 ── HERO: the number alone, a rule with end dots, unit under it */
  variant('hero', 'ตัวเลขเดี่ยว', (d, c) => {
    const base = d.icon ? 95 : 70;
    art(c, p => {
      txt(p, d.value, 0, base, { size: 250, maxW: 820 });
      const ry = base + 42; p.line(-300, ry, 300, ry, W(2.2)); p.dot(-300, ry, 6);
      if (d.dir) dirBadge(p, d.dir, 300, ry, 30); else p.dot(300, ry, 6);
      if (d.unit) txt(p, d.unit, 0, ry + 84, { size: 64, weight: 600, color: C.soft, maxW: 700 });
    });
    icon(d, 0, -232, 150, c);
  });

  /* 02 ── DRUM: each digit sits in its own drum of a counter housing */
  variant('drum', 'ตัวนับหมุน', (d, c) => {
    const chars = [...String(d.value)], nd = chars.filter(ch => /\d/.test(ch)).length, ns = chars.length - nd;
    const cw = Math.min(130, (840 - ns * 44) / Math.max(1, nd)), ch = Math.min(190, cw * 1.4), cy = d.icon ? 10 : -20;
    const total = nd * cw + Math.max(0, nd - 1) * 10 + ns * 44, x0 = -total / 2;
    art(c, p => {
      p.rect(x0 - 24, cy - ch / 2 - 22, total + 48, ch + 44, Object.assign({ rx: 26 }, F(3.4)));
      let x = x0;
      chars.forEach(chr => {
        if (/\d/.test(chr)) {
          p.rect(x, cy - ch / 2, cw, ch, Object.assign({ rx: 14 }, F(2.4)));
          p.path(`M ${f1(x + 12)} ${f1(cy - ch / 2 + 22)} Q ${f1(x + cw / 2)} ${f1(cy - ch / 2 + 8)} ${f1(x + cw - 12)} ${f1(cy - ch / 2 + 22)}`, W(1.6));
          p.path(`M ${f1(x + 12)} ${f1(cy + ch / 2 - 22)} Q ${f1(x + cw / 2)} ${f1(cy + ch / 2 - 8)} ${f1(x + cw - 12)} ${f1(cy + ch / 2 - 22)}`, W(1.6));
          txt(p, chr, x + cw / 2, cy + ch * .25, { size: ch * .7 });
          x += cw + 10;
        } else { txt(p, chr, x + 12, cy + ch * .25, { size: ch * (chr === '%' ? .5 : .6) }); x += 44; }
      });
      if (d.unit) txt(p, d.unit, 0, cy + ch / 2 + 110, { size: 60, weight: 600, color: C.soft, maxW: 760 });
      dirBadge(p, d.dir, x0 + total + 24, cy - ch / 2 - 22, 32);
    });
    icon(d, 0, -248, 130, c);
  });

  /* 03 ── LCD: a display panel with seven-segment digits (only lit segments — no ghost 8s) */
  const SEG = { 0: 'abcdef', 1: 'bc', 2: 'abged', 3: 'abgcd', 4: 'fgbc', 5: 'afgcd', 6: 'afgedc', 7: 'abc', 8: 'abcdefg', 9: 'abcdfg' };
  function seven(p, ch, x, y, w, h, t) {          // (x, y) = top-left of the digit cell
    const hz = (x1, x2, yy) => [[x1, yy], [x1 + t / 2, yy - t / 2], [x2 - t / 2, yy - t / 2], [x2, yy], [x2 - t / 2, yy + t / 2], [x1 + t / 2, yy + t / 2]];
    const vt = (xx, y1, y2) => [[xx, y1], [xx + t / 2, y1 + t / 2], [xx + t / 2, y2 - t / 2], [xx, y2], [xx - t / 2, y2 - t / 2], [xx - t / 2, y1 + t / 2]];
    const g = 3, P = { a: hz(x + g, x + w - g, y), g: hz(x + g, x + w - g, y + h / 2), d: hz(x + g, x + w - g, y + h),
      f: vt(x, y + g, y + h / 2 - g), b: vt(x + w, y + g, y + h / 2 - g), e: vt(x, y + h / 2 + g, y + h - g), c: vt(x + w, y + h / 2 + g, y + h - g) };
    for (const s of SEG[ch] || '') p.shape(P[s].map(([a, b]) => [f1(a), f1(b)]), { fill: C.ink, sw: 1.2 });
  }
  variant('lcd', 'จอตัวเลข', (d, c) => {
    const py = d.icon ? 40 : 0, chars = [...String(d.value)];
    const nd = chars.filter(ch => /\d/.test(ch)).length, ns = chars.length - nd;
    let dw = 104, dh = 190, gap = 30, sp = 34;
    const need = nd * dw + (nd - 1) * gap + ns * sp + (chars.includes('%') ? 70 : 0), k = Math.min(1, 700 / need);
    dw *= k; dh *= k; gap *= k; sp *= k; const t = Math.max(10, 20 * k);
    art(c, p => {
      p.rect(-440, py - 190, 880, 380, Object.assign({ rx: 34 }, F(3.4)));
      p.rect(-400, py - 150, 800, 300, { rx: 16, fill: C.fill, sw: 2, stroke: C.soft });
      const tot = need * k, top = py - dh / 2 - (d.unit ? 22 : 0);
      const dg = p.child({ transform: `skewX(-6)` }); let x = -tot / 2;
      chars.forEach(ch => {
        if (/\d/.test(ch)) { seven(dg, ch, x, top, dw, dh, t); x += dw + gap; }
        else if (ch === '%') { txt(dg, '%', x + 34 * k, top + dh, { size: dh * .62, anchor: 'start' }); x += 70 * k; }
        else if (ch === '.') { dg.rect(f1(x - gap / 2 - 2), f1(top + dh - t * .9), f1(t), f1(t), { rx: 2, fill: C.ink, sw: 1.2 }); x += sp; }
        else { dg.shape([[x - gap / 2 + 4, top + dh - 6], [x - gap / 2 + 14, top + dh - 6], [x - gap / 2 + 8, top + dh + 14], [x - gap / 2 - 2, top + dh + 14]], { fill: C.ink, sw: 1.2 }); x += sp; }
      });
      if (d.unit) txt(p, d.unit, 370, py + 128, { size: 42, weight: 600, color: C.soft, anchor: 'end', maxW: 560 });
      if (d.dir) { const up = d.dir === 'up';
        p.shape([[-372, py - 40], [-352, py - 72], [-332, py - 40]], up ? { fill: C.ink, sw: 1.4 } : { fill: C.fill, sw: 1.6, stroke: C.rule });
        p.shape([[-372, py + 40], [-352, py + 72], [-332, py + 40]], up ? { fill: C.fill, sw: 1.6, stroke: C.rule } : { fill: C.ink, sw: 1.4 }); }
    });
    icon(d, 0, -265, 110, c);
  });

  /* 04 ── GAUGE: a half dial, the needle comes out of a hub that holds the icon */
  variant('gauge', 'หน้าปัด', (d, c) => {
    const cy = 60, R = 300, f = pct(d) != null ? frac(d) : pos(d), ang = 180 + 180 * f;
    art(c, p => {
      p.path(`M ${-R} ${cy} A ${R} ${R} 0 0 1 ${R} ${cy} Z`, F(3.4));
      p.path(`M -250 ${cy} A 250 250 0 0 1 250 ${cy}`, { sw: 14, stroke: C.rule });
      const ex = f1(250 * Math.cos(rad(ang))), ey = f1(cy + 250 * Math.sin(rad(ang)));
      p.path(`M -250 ${cy} A 250 250 0 0 1 ${ex} ${ey}`, { sw: 14 });
      for (let i = 0; i <= 10; i++) { const a = rad(180 + i * 18), r0 = i % 5 ? 212 : 200; p.line(f1(r0 * Math.cos(a)), f1(cy + r0 * Math.sin(a)), f1(224 * Math.cos(a)), f1(cy + 224 * Math.sin(a)), W(i % 5 ? 1.8 : 3)); }
      const ndl = p.child(); ndl.line(f1(70 * Math.cos(rad(ang))), f1(cy + 70 * Math.sin(rad(ang))), f1(205 * Math.cos(rad(ang))), f1(cy + 205 * Math.sin(rad(ang))), { sw: 7 });
      p.circle(0, cy, 64, F(3));
      const nu = numUnit(p, d, 0, cy + 200, { size: 150, maxW: 760 });
      dirBadge(p, d.dir, nu.right + 50, cy + 150, 30);
    });
    icon(d, 0, 60, 92, c);
  });

  /* 05 ── RING: a progress ring around the number */
  variant('ring', 'วงแหวน', (d, c) => {
    const cy = -10, R = 250, f = frac(d);
    art(c, p => {
      p.circle(0, cy, R, { sw: 16, stroke: C.rule });
      if (f >= .999) p.circle(0, cy, R, { sw: 16 });
      else { const a = rad(-90 + 360 * f); p.path(`M 0 ${cy - R} A ${R} ${R} 0 ${f > .5 ? 1 : 0} 1 ${f1(R * Math.cos(a))} ${f1(cy + R * Math.sin(a))}`, { sw: 16 }); }
      p.circle(0, cy, 226, { fill: C.fill, sw: 2, stroke: C.soft });
      txt(p, d.value, 0, cy + (d.icon ? 90 : 62), { size: 185, maxW: 370 });
      if (d.unit) txt(p, d.unit, 0, cy + (d.icon ? 160 : 140), { size: 46, weight: 600, color: C.soft, maxW: 300 });
      dirBadge(p, d.dir, 177, cy - 177, 34);
    });
    icon(d, 0, cy - 118, 88, c);
  });

  /* 06 ── BAR: a slider bar fills up to its handle; the icon is the bar's start knob */
  variant('bar', 'แถบเติม', (d, c) => {
    const f = frac(d), bx0 = d.icon ? -330 : -440, bx1 = 440, by = 160, x = bx0 + 18 + (bx1 - bx0 - 36) * f;
    art(c, p => {
      numUnit(p, d, 0, 30, { size: 210, maxW: 860 });
      p.rect(bx0, by - 30, bx1 - bx0, 60, Object.assign({ rx: 30 }, F(3.2)));
      p.line(bx0 + 18, by, x, by, { sw: 22 });
      for (let i = 0; i <= 4; i++) { const tx = bx0 + 18 + (bx1 - bx0 - 36) * i / 4; p.line(f1(tx), by + 46, f1(tx), by + 64, W(2)); }
      if (d.dir) dirBadge(p, d.dir, x, by, 36); else p.circle(x, by, 22, F(3));
      if (d.icon) p.circle(-420, by, 66, F(3));
    });
    icon(d, -420, by, 96, c);
  });

  /* 07 ── RULER: a pointer stands on a ruler, the number rides on the pointer */
  variant('ruler', 'ไม้บรรทัด', (d, c) => {
    const px = -440 + 880 * pos(d);
    art(c, p => {
      p.rect(-460, 160, 920, 96, Object.assign({ rx: 12 }, F(3.2)));
      for (let i = 0; i <= 40; i++) { const x = -440 + i * 22; p.line(x, 160, x, 160 + (i % 5 ? 20 : 40), W(i % 5 ? 1.6 : 2.4)); }
      p.path(`M ${f1(px)} 150 C ${f1(px - 8)} 130, ${f1(px - 34)} 112, ${f1(px - 34)} 82 A 34 34 0 1 1 ${f1(px + 34)} 82 C ${f1(px + 34)} 112, ${f1(px + 8)} 130, ${f1(px)} 150 Z`, F(3.2));
      p.circle(px, 82, 11, W(2.4));
      if (d.dir === 'up') arrowLine(p, px - 190, 128, px - 70, 128); if (d.dir === 'down') arrowLine(p, px + 190, 128, px + 70, 128);
      const tmp = numUnit(p, d, 0, -20, { size: 190, maxW: d.icon ? 700 : 900 }), half = (tmp.right - tmp.left) / 2;
      const lo = (d.icon ? -330 : -470) + half, cx = Math.max(lo, Math.min(470 - half, px));
      [...p.g.querySelectorAll('text')].slice(-(d.unit ? 2 : 1)).forEach(e => e.setAttribute('x', f1(+e.getAttribute('x') + cx)));
    });
    icon(d, -400, -230, 110, c);
  });

  /* 08 ── COLUMN: a column of blocks (grows for up, loses blocks for down), the number beside it */
  variant('column', 'แท่งซ้อน', (d, c) => {
    const n = d.dir === 'up' ? 4 : d.dir === 'down' ? 4 : 3, solid = d.dir === 'down' ? 2 : n, cx = -250, bw = 190, bh = 74;
    art(c, p => {
      p.line(-440, 306, 40, 306, W(2.4));
      for (let i = 0; i < n; i++) { const y = 300 - (i + 1) * (bh + 10);
        if (i < solid) { p.rect(cx - bw / 2, y, bw, bh, Object.assign({ rx: 10 }, F(i === solid - 1 && d.dir === 'up' ? 4 : 3))); p.line(cx - bw / 2 + 18, y + 18, cx - bw / 2 + 60, y + 18, W(2)); }
        else p.rect(cx - bw / 2, y, bw, bh, { rx: 10, sw: 2.2, stroke: C.rule }); }
      if (d.dir === 'up') arrowLine(p, cx + bw / 2 + 50, 120, cx + bw / 2 + 50, -60, 5);
      if (d.dir === 'down') arrowLine(p, cx + bw / 2 + 50, -60, cx + bw / 2 + 50, 120, 5);
      txt(p, d.value, 190, 70, { size: 210, maxW: 470 });
      if (d.unit) txt(p, d.unit, 190, 160, { size: 60, weight: 600, color: C.soft, maxW: 450 });
    });
    const topY = 300 - Math.max(n, 1) * (bh + 10);
    icon(d, cx, topY - 72, 130, c);
  });

  /* 09 ── FRAME: viewfinder corners lock on the number */
  variant('frame', 'กรอบเล็ง', (d, c) => {
    art(c, p => {
      [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sy]) => p.poly([[sx * 400, sy * 180], [sx * 400, sy * 260], [sx * 320, sy * 260]], { sw: 8 }));
      [[0, -260, 0, -236], [0, 260, 0, 236], [-400, 0, -376, 0], [400, 0, 376, 0]].forEach(([a, b, e, f]) => p.line(a, b, e, f, W(3)));
      txt(p, d.value, 0, 75, { size: 230, maxW: 640 });
      if (d.unit) txt(p, d.unit, 370, 228, { size: 52, weight: 600, color: C.soft, anchor: 'end', maxW: 560 });
      dirBadge(p, d.dir, 330, -190, 34);
    });
    icon(d, -315, -175, 100, c);
  });

  /* 10 ── SPOTLIGHT: a lamp lights the number standing on the floor */
  variant('spotlight', 'ไฟส่อง', (d, c) => {
    art(c, p => {
      p.line(0, -334, 0, -314, W(3));
      p.shape([[-90, -234], [90, -234], [360, 250], [-360, 250]], { fill: 'rgba(255,255,255,.05)', stroke: 'none', sw: 0 });
      p.line(-90, -234, -360, 250, { sw: 1.8, stroke: C.soft }); p.line(90, -234, 360, 250, { sw: 1.8, stroke: C.soft });
      p.ellipse(0, 250, 360, 44, { sw: 2.2, stroke: C.soft });
      p.path('M -62 -318 L 62 -318 L 96 -234 L -96 -234 Z', F(3.2)); p.line(-70, -246, 70, -246, W(2));
      const t = txt(p, d.value, 0, d.unit ? 105 : 140, { size: 200, maxW: 500 });
      if (d.unit) txt(p, d.unit, 0, 182, { size: 54, weight: 600, color: C.soft, maxW: 520 });
      dirBadge(p, d.dir, Math.min(300, t.bb.x + t.bb.width + 50), d.unit ? 40 : 75, 30);
    });
    icon(d, 0, -118, 112, c);
  });

  /* 11 ── HEX: a hexagon plate, number stamped on it */
  variant('hex', 'แผ่นหกเหลี่ยม', (d, c) => {
    const hx = r => [0, 1, 2, 3, 4, 5].map(i => [f1(r * Math.cos(rad(60 * i))), f1(r * .86 * Math.sin(rad(60 * i)))]);
    art(c, p => {
      p.shape(hx(320), F(3.6)); p.shape(hx(282), { sw: 1.8, stroke: C.soft });
      txt(p, d.value, 0, d.icon ? 90 : 65, { size: 190, maxW: 400 });
      if (d.unit) txt(p, d.unit, 0, d.icon ? 170 : 145, { size: 48, weight: 600, color: C.soft, maxW: 380 });
      dirBadge(p, d.dir, 320, 0, 36);
    });
    icon(d, 0, -128, 100, c);
  });

  /* 12 ── SIGN: a board hangs from a nail on two strings */
  variant('sign', 'ป้ายแขวน', (d, c) => {
    art(c, p => {
      p.line(0, -318, -230, -150, W(2.4)); p.line(0, -318, 230, -150, W(2.4));
      p.rect(-340, -170, 680, 380, Object.assign({ rx: 26 }, F(3.4)));
      [-230, 230].forEach(x => p.circle(x, -138, 10, W(2.4))); p.circle(0, -322, 12, F(2.6));
      txt(p, d.value, 0, d.icon ? 112 : 80, { size: d.icon ? 175 : 200, maxW: 580 });
      if (d.unit) txt(p, d.unit, 0, d.icon ? 182 : 165, { size: 46, weight: 600, color: C.soft, maxW: 560 });
      dirBadge(p, d.dir, 340, -170, 32);
    });
    icon(d, 0, -78, 88, c);
  });

  /* 13 ── RIBBON: a banner with folded tails, unit under it, icon above */
  variant('ribbon', 'แถบริบบิ้น', (d, c) => {
    art(c, p => {
      [-1, 1].forEach(s => { p.shape([[s * 470, -30], [s * 330, -30], [s * 330, 150], [s * 470, 150], [s * 425, 60]], F(3));
        p.shape([[s * 380, 90], [s * 330, 150], [s * 330, 90]], F(2.6)); });
      p.rect(-380, -90, 760, 180, Object.assign({ rx: 6 }, F(3.4)));
      p.line(-350, -66, 350, -66, W(1.6)); p.line(-350, 66, 350, 66, W(1.6));
      txt(p, d.value, 0, 52, { size: 150, maxW: 640 });
      if (d.unit) txt(p, d.unit, 0, 245, { size: 58, weight: 600, color: C.soft, maxW: 720 });
      dirBadge(p, d.dir, 380, -90, 32);
    });
    icon(d, 0, -222, 140, c);
  });

  /* 14 ── SHUTTER: a roller shutter has rolled up into its box, the number stands in the opening (user picked it over CUBE, 2026-11-12) */
  variant('shutter', 'บานม้วน', (d, c) => {
    art(c, p => {
      p.rect(-370, -250, 740, 510, Object.assign({ rx: 14 }, F(3.4)));
      p.rect(-330, -150, 660, 370, F(2.2));
      p.rect(-370, -250, 740, 104, Object.assign({ rx: 14 }, F(3.2))); [-218, -196, -174].forEach(y => p.line(-330, y, 330, y, W(1.6)));
      p.rect(-330, -150, 660, 24, F(2.6)); p.rect(-40, -126, 80, 12, Object.assign({ rx: 6 }, F(2)));
      txt(p, d.value, 0, d.unit ? 110 : 130, { size: 200, maxW: 580 });
      if (d.unit) txt(p, d.unit, 0, 190, { size: 50, weight: 600, color: C.soft, maxW: 560 });
      dirBadge(p, d.dir, 330, -98, 30);
    });
    icon(d, -420, -300, 84, c);
  });

  /* 15 ── BLOCK: the number itself as a thick 3D slab on a floor line */
  variant('block', 'ตัวเลขนูน', (d, c) => {
    const base = d.icon ? 130 : 100;
    art(c, p => {
      const back = txt(p, d.value, 18, base + 18, { size: 270, maxW: 760, color: C.fill });
      back.e.setAttribute('stroke', C.soft); back.e.setAttribute('stroke-width', 3); back.e.setAttribute('stroke-linejoin', 'round');
      const fr = txt(p, d.value, 0, base, { size: back.size, color: C.fill });
      fr.e.setAttribute('stroke', C.ink); fr.e.setAttribute('stroke-width', 5); fr.e.setAttribute('stroke-linejoin', 'round');
      p.line(-430, base + 40, 430, base + 40, { sw: 2, stroke: C.soft });
      if (d.unit) txt(p, d.unit, 0, base + 125, { size: 58, weight: 600, color: C.soft, maxW: 760 });
      dirBadge(p, d.dir, Math.min(440, fr.bb.x + fr.bb.width + 56), base - 160, 32);
    });
    icon(d, 0, -235, 120, c);
  });

  /* 16 ── LENS: a magnifying glass, the number big inside the lens */
  let lensN = 0;
  variant('lens', 'แว่นขยาย', (d, c) => {
    art(c, p => {
      const id = 'b01lens' + (++lensN), NS = 'http://www.w3.org/2000/svg', cp = document.createElementNS(NS, 'clipPath'), ci = document.createElementNS(NS, 'circle');
      cp.setAttribute('id', id); ci.setAttribute('cx', -40); ci.setAttribute('cy', -40); ci.setAttribute('r', 196); cp.appendChild(ci); p.g.appendChild(cp);
      p.line(118, 118, 270, 270, { sw: 50 }); p.line(118, 118, 270, 270, { sw: 41, stroke: C.fill }); p.line(150, 150, 168, 168, W(2));
      p.circle(-40, -40, 222, F(4.2)); p.circle(-40, -40, 198, { sw: 1.6, stroke: C.soft });
      const q = p.child({ 'clip-path': `url(#${id})` }); txt(q, d.value, -40, 40, { size: 230, maxW: 360 });
      if (d.unit) txt(p, d.unit, -40, 268, { size: 54, weight: 600, color: C.soft, maxW: 300 });
      dirBadge(p, d.dir, 116, -196, 32);
    });
    icon(d, -380, -255, 96, c);
  });

  /* 17 ── CARD: a stat card — icon badge + unit as the title, the number big, a direction chip */
  variant('card', 'การ์ดสถิติ', (d, c) => {
    art(c, p => {
      p.rect(-430, -260, 860, 520, Object.assign({ rx: 40 }, F(3.4)));
      if (d.icon) p.rect(-375, -210, 124, 124, Object.assign({ rx: 26 }, F(2.6)));
      if (d.unit) txt(p, d.unit, d.icon ? -222 : -375, -132, { size: 52, weight: 600, color: C.soft, anchor: 'start', maxW: d.dir ? 400 : 560 });
      txt(p, d.value, -375, 165, { size: 290, anchor: 'start', maxW: 750 });
      p.line(-375, 200, 375, 200, { sw: 2, stroke: C.rule });
      if (d.dir) { const up = d.dir === 'up'; p.rect(230, -210, 150, 84, Object.assign({ rx: 42 }, F(2.8)));
        arrowLine(p, 305, up ? -142 : -194, 305, up ? -194 : -142, 5.5); }
    });
    icon(d, -313, -148, 92, c);
  });

  /* 18 ── NOTE: a paper note pinned to the wall, slightly turned, corner folded (user picked it over BURST, 2026-11-12) */
  variant('note', 'กระดาษโน้ตปักหมุด', (d, c) => {
    art(c, p => {
      const q = p.child({ transform: 'rotate(-3 0 20)' });
      q.path('M -270 -230 L 270 -230 L 270 190 L 200 260 L -270 260 Z', F(3.4));
      q.path('M 270 190 L 210 196 L 200 260', F(2.6));
      txt(q, d.value, 0, d.unit ? 85 : 100, { size: 210, maxW: 450 });
      if (d.unit) txt(q, d.unit, 0, 170, { size: 50, weight: 600, color: C.soft, maxW: 420 });
      p.line(0, -236, 0, -206, W(3)); p.circle(0, -258, 30, F(3)); p.circle(-8, -266, 8, W(2));
      dirBadge(q, d.dir, 205, -165, 32);
    });
    icon(d, -175, -150, 82, c);
  });

  /* 19 ── ORBIT: two orbits circle the number; the icon rides one of them */
  variant('orbit', 'วงโคจร', (d, c) => {
    const on = (rx, ry, rot, a) => { const x = rx * Math.cos(rad(a)), y = ry * Math.sin(rad(a)), r = rad(rot); return [x * Math.cos(r) - y * Math.sin(r), x * Math.sin(r) + y * Math.cos(r)]; };
    const ip = on(420, 130, -14, 200), dp = on(420, 130, 14, 330);
    art(c, p => {
      p.child({ transform: 'rotate(-14)' }).ellipse(0, 0, 420, 130, { sw: 2.2, stroke: C.soft });
      p.child({ transform: 'rotate(14)' }).ellipse(0, 0, 420, 130, { sw: 2.2, stroke: C.soft });
      p.ellipse(0, 10, 285, 160, { fill: C.fill, stroke: 'none', sw: 0 });
      txt(p, d.value, 0, d.unit ? 50 : 70, { size: 190, maxW: 480 });
      if (d.unit) txt(p, d.unit, 0, 128, { size: 48, weight: 600, color: C.soft, maxW: 400 });
      const pp = on(420, 130, -14, 20); p.circle(f1(pp[0]), f1(pp[1]), 14, F(3));
      if (d.icon) p.circle(f1(ip[0]), f1(ip[1]), 62, F(3));
      if (d.dir) dirBadge(p, d.dir, dp[0], dp[1], 32); else p.circle(f1(dp[0]), f1(dp[1]), 10, F(3));
    });
    icon(d, ip[0], ip[1], 90, c);
  });

  /* 20 ── STACK: a fan of three cards, the number on the front one */
  variant('stack', 'การ์ดซ้อน', (d, c) => {
    art(c, p => {
      p.child({ transform: 'rotate(-12 0 60) translate(-30 10)' }).rect(-300, -200, 600, 400, Object.assign({ rx: 28 }, { fill: C.fill, sw: 2.4, stroke: C.soft }));
      p.child({ transform: 'rotate(7 0 60) translate(26 4)' }).rect(-310, -210, 620, 420, Object.assign({ rx: 28 }, F(2.8)));
      p.rect(-320, -220, 640, 440, Object.assign({ rx: 30 }, F(3.4)));
      txt(p, d.value, 0, d.unit ? 70 : 90, { size: 200, maxW: 540 });
      if (d.unit) txt(p, d.unit, 0, 158, { size: 50, weight: 600, color: C.soft, maxW: 540 });
      dirBadge(p, d.dir, 250, -150, 34);
    });
    icon(d, -238, -140, 92, c);
  });

  /* sample sentences from unrelated topics (neutrality) + a stress set (long / bare / English values) */
  const SAMPLES = [
    { say: 'วิ่งวันละ 5 กิโล', value: '5', unit: 'กิโล', icon: 'person-standing' },
    { say: 'แต่งงานกันมา 12 ปี', value: '12', unit: 'ปี', icon: 'heart' },
    { say: 'ค่าไฟลดลง 30%', value: '30%', icon: 'zap', dir: 'down' },
    { say: 'ความชื้นในดิน 65%', value: '65%', icon: 'droplet' },
    { say: 'นอนให้ได้ 8 ชั่วโมง', value: '8', unit: 'ชั่วโมง', icon: 'bed' },
    { say: 'ดื่มน้ำวันละ 2.5 ลิตร', value: '2.5', unit: 'ลิตร', icon: 'glass-water' },
    { say: 'ต้นไม้สูงขึ้น 120 เซนติเมตร', value: '120', unit: 'เซนติเมตร', icon: 'sprout', dir: 'up' },
    { say: 'ยอดขายเพิ่มเป็น 3 เท่า', value: '3', unit: 'เท่า', icon: 'store', dir: 'up' },
    { say: 'ถ่ายไปแล้ว 1,250 รูป', value: '1,250', unit: 'รูป', icon: 'camera' },
    { say: 'คนดูทะลุ 1 ล้านคน', value: '1', unit: 'ล้านคน', icon: 'users' },
    { say: 'ชนะมาแล้ว 7 ครั้ง', value: '7', unit: 'ครั้ง', icon: 'trophy' },
    { say: 'ปีนี้แม่อายุ 60', value: '60', unit: 'ปี', icon: 'cake' },
    { say: 'เปิดร้านมาครบ 100 วัน', value: '100', unit: 'วัน', icon: 'calendar' },
    { say: 'ส่งของไปแล้ว 3,000 กล่อง', value: '3,000', unit: 'กล่อง', icon: 'package' },
    { say: '90% ของคนทำงานเหนื่อย', value: '90%', unit: 'ของคนทำงาน', icon: 'briefcase' },
    { say: 'ฝุ่นเล็กแค่ 2.5 ไมครอน', value: '2.5', unit: 'ไมครอน', icon: 'cloud' },
    { say: 'สมาชิกใหม่ 4,800 คน', value: '4,800', unit: 'คน', icon: 'user-plus', dir: 'up' },
    { say: 'ราคาลด 50%', value: '50%', icon: 'tag', dir: 'down' },
    { say: 'เที่ยวมาแล้ว 12 ประเทศ', value: '12', unit: 'ประเทศ', icon: 'plane' },
    { say: 'ปีนี้อ่านหนังสือ 24 เล่ม', value: '24', unit: 'เล่ม', icon: 'book-open' },
  ];
  const STRESS = [
    { say: 'เก็บเงินได้ 1,250,000 บาท (9 หลัก)', value: '1,250,000', unit: 'บาท' },
    { say: 'ค่า π ประมาณ 3.14 (ไม่มีหน่วย ไม่มีไอคอน)', value: '3.14' },
    { say: 'ได้ผล 99.9%', value: '99.9%', icon: 'shield-check', dir: 'up' },
    { say: 'ran 42 kilometers (English)', value: '42', unit: 'kilometers', icon: 'bike' },
    { say: 'ขาดงาน 0 วัน', value: '0', unit: 'วัน', icon: 'calendar' },
    { say: 'ต้นทุนลดลง 12.5%', value: '12.5%', icon: 'coins', dir: 'down' },
    { say: 'ซ่อมไปแล้ว 1,000,000 ครั้ง', value: '1,000,000', unit: 'ครั้ง', icon: 'wrench' },
    { say: 'น้ำหนักลด 15 กิโลกรัม', value: '15', unit: 'กิโลกรัม', dir: 'down' },
    { say: 'ใช้เวลาแค่ 3 นาที', value: '3', unit: 'นาที', icon: 'timer' },
    { say: 'ผ่านมา 25 ปี', value: '25', unit: 'ปี' },
    { say: 'ใบไม้ร่วง 300,000 ใบ', value: '300,000', unit: 'ใบ', icon: 'leaf', dir: 'down' },
    { say: 'สูง 8,848 เมตร', value: '8,848', unit: 'เมตร', icon: 'mountain' },
    { say: 'ลูกคนที่ 2', value: '2', icon: 'baby' },
    { say: 'ขับมา 120,500 กิโลเมตร', value: '120,500', unit: 'กิโลเมตร', icon: 'car' },
    { say: 'ผ่อนบ้านอีก 30 ปี', value: '30', unit: 'ปี', icon: 'house', dir: 'down' },
    { say: 'ทาน 1 ผลต่อวัน', value: '1', unit: 'ผลต่อวัน', icon: 'apple' },
    { say: 'ยา 2 เม็ด', value: '2', unit: 'เม็ด', icon: 'pill' },
    { say: 'ยกได้ 100 กิโล', value: '100', unit: 'กิโล', icon: 'dumbbell', dir: 'up' },
    { say: 'กาแฟวันละ 4 แก้ว', value: '4', unit: 'แก้ว', icon: 'coffee', dir: 'up' },
    { say: '7.5 ล้านวิว', value: '7.5', unit: 'ล้านวิว', icon: 'music' },
  ];

  G.cats = G.cats || {};          // GL.B01 is taken by the older beats.js template
  G.cats.B01 = { variants: V, SAMPLES, STRESS, draw: (i, d, c) => V[i].build(d, c) };
})();
