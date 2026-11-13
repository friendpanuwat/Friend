/* b01.js — category B01 "ตัวเลขเด่น" (a number is the point of the sentence): 20 neutral designs, glow-line style.
   Stills approved by the user (2026-11-13). Motion follows CutPack's rule (CATEGORIES.md §9):
     enter (0 → .35 s, quick) → work (counting, sweeping, rolling…) → RESULT on the keyword (c.hit) → hold (soft breathing) → exit (pop).
   Slots (same as CutPack B01): value (string as spoken: "1,250", "2.5", "30%") · unit · icon (Lucide name → GL.icons) · dir ('up' | 'down').
   Every design draws on a 1000 × 700 canvas centred at (0,0):
     GL.cats.B01.draw(i, data, { x, y, s, at, hit })   hit = seconds after `at` when the keyword is spoken (default 1.2)
   Neutral rules: the number is the biggest thing; it always stops on the spoken value, no other number stays on screen;
   no topic-specific objects; proportion (ring / bar / gauge / ruler) is real only for "%" — otherwise dir picks high / low. */
(function () {
  const G = window.GL, C = G.C;
  const W = (w = 2) => ({ sw: w }), F = (w = 3.2) => ({ fill: C.fill, sw: w });
  const rad = d => d * Math.PI / 180, f1 = v => +v.toFixed(1), clamp01 = v => Math.max(0, Math.min(1, v));
  const eOut = q => 1 - Math.pow(1 - q, 3);
  const pct = d => /%\s*$/.test(d.value) ? Math.max(0, Math.min(1, parseFloat(String(d.value).replace(/,/g, '')) / 100)) : null;
  const zero = d => parseFloat(String(d.value).replace(/,/g, '')) === 0;
  const frac = d => zero(d) ? 0 : pct(d) ?? (d.dir === 'up' ? .82 : d.dir === 'down' ? .28 : 1);
  const pos = d => zero(d) ? 0 : pct(d) ?? (d.dir === 'up' ? .78 : d.dir === 'down' ? .26 : .62);   // where a pointer sits (never 'full' unless 100%)

  /* ---------- motion plumbing ---------- */
  const HOOKS = []; { const base = window.setT; window.setT = t => { base(t); for (const h of HOOKS) h(t); }; }
  const sub = (p, a) => { const q = p.child(a || {}); q.H = p.H; q.motion = p.motion; return q; };   // sub-pens keep the keyword time + clock
  const on = (q, p, t, spec) => G.kf(q.g || q, p.t0 + t * p.ts, spec);
  const layers = (p, n) => { const a = [sub(p)]; for (let i = 1; i < n; i++) a.push(sub(a[i - 1])); return a; };
  /* seconds since this design started, on its own clock (follows the motion controls: speed / still) */
  const rel = (p, t) => p.motion && p.motion.still ? 99 : ((p.motion ? p.motion.time(t) : t) - p.t0) / p.ts;
  const appear = (q, p, t, dy = 18) => on(q, p, t, { o: [[0, 0], [.16, 1]], y: [[0, dy], [.28, 0, 'out']] });
  const pop = (q, p, t, ox = 0, oy = 0, from = .5) => on(q, p, t, { ox, oy, s: [[0, from], [.24, 1.06, 'out'], [.38, 1, 'soft']], o: [[0, 0], [.1, 1]] });
  const punch = (q, p, t, ox, oy, k = 1.1) => on(q, p, t, { ox, oy, s: [[0, 1], [.07, k, 'out'], [.3, 1, 'soft']] });
  const breathe = (q, p, t, ox, oy) => on(q, p, t, { loop: 2.4, ox, oy, s: [[0, 1], [1.2, 1.012, 'soft'], [2.4, 1, 'soft']] });
  /* the spoken value with the same format at fraction q (commas, decimals, % kept); q = 1 → exactly the spoken string */
  function fmtVal(str, q) {
    const m = String(str).match(/^([^\d]*)([\d,]*\.?\d*)(.*)$/); if (!m || q >= 1) return str;
    const [, pre, num, post] = m, n = parseFloat(num.replace(/,/g, '')), dec = (num.split('.')[1] || '').length;
    let s = (n * q).toFixed(dec);
    if (num.includes(',')) { const [i, f] = s.split('.'); s = i.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (f ? '.' + f : ''); }
    return pre + s + post;
  }
  const count = (p, el, value, t0, t1) => HOOKS.push(t => { const u = rel(p, t); el.textContent = u >= t1 ? value : fmtVal(value, eOut(clamp01((u - t0) / (t1 - t0)))); });

  /* ---------- drawing helpers ---------- */
  function txt(p, str, x, y, { size = 100, maxW = 1e9, weight = 700, anchor = 'middle', color = C.ink, ls = 0 } = {}) {
    const e = p.text(String(str), x, y, { size, weight, anchor, color, ls, dur: .01 });
    const w = e.getBBox().width; if (w > maxW) { size *= maxW / w; e.setAttribute('font-size', f1(size)); }
    return { e, size, bb: e.getBBox() };
  }
  /* the hero number: enters at t0, counts to the spoken value on the keyword, punches, then breathes */
  function number(p, d, x, y, o, t0) {
    const [O, I, P] = layers(p, 3), t = txt(P, d.value, x, y, o), H = p.H;
    const ox = o.anchor === 'start' ? x + t.bb.width / 2 : x, oy = y - t.size * .36;
    appear(O, p, t0); count(p, t.e, d.value, t0, H); punch(P, p, H, ox, oy); breathe(I, p, H + .45, ox, oy);
    return t;
  }
  const unitAt = (p, d, x, y, o) => { if (!d.unit) return; const g = sub(p); txt(g, d.unit, x, y, Object.assign({ weight: 600, color: C.soft }, o)); appear(g, p, p.H + .05, 10); };
  /* number + unit on one baseline, centred (or anchored) at x, shrunk together to maxW; the unit shows on the keyword */
  function numUnit(p, d, x, base, { size = 200, maxW = 800, usize, gap, ucolor = C.soft, anchor = 'middle', t0 = .2 } = {}) {
    usize = usize || size * .3; gap = gap ?? size * .1;
    const [O, I, P] = layers(p, 3), n = P.text(d.value, 0, base, { size, anchor: 'start', dur: .01 });
    const u = d.unit ? p.text(d.unit, 0, base, { size: usize, anchor: 'start', weight: 600, color: ucolor, dur: .01 }) : null;
    const meas = () => n.getBBox().width + (u ? gap + u.getBBox().width : 0);
    let tw = meas();
    if (tw > maxW) {                              // shrink the number first; the unit never goes below 40
      const nw = n.getBBox().width, uw = u ? u.getBBox().width : 0, uk = u ? Math.max(maxW / tw, Math.min(1, 40 / usize)) : 1;
      const k = (maxW - uw * uk) / (nw + (u ? gap : 0)); size *= k; gap *= k; usize *= uk;
      n.setAttribute('font-size', f1(size)); if (u) u.setAttribute('font-size', f1(usize)); tw = meas(); }
    const x0 = anchor === 'middle' ? x - tw / 2 : anchor === 'end' ? x - tw : x, nw = n.getBBox().width;
    n.setAttribute('x', f1(x0)); if (u) u.setAttribute('x', f1(x0 + nw + gap));
    const ox = x0 + nw / 2, oy = base - size * .36;
    appear(O, p, t0); count(p, n, d.value, t0, p.H); punch(P, p, p.H, ox, oy); breathe(I, p, p.H + .45, ox, oy);
    if (u) on(u, p, p.H + .05, { o: [[0, 0], [.18, 1]] });
    return { left: x0, right: x0 + tw, size, n, u, O };
  }
  /* arrow up / down inside a small round badge — pops on the keyword (t = null: no entrance of its own) */
  function dirBadge(p, dir, x, y, r = 34, t) {
    if (!dir) return;
    const w = sub(p), q = sub(w, { transform: `translate(${f1(x)} ${f1(y)})` }), s = dir === 'up' ? -1 : 1;
    q.circle(0, 0, r, F(3)); q.line(0, -s * r * .5, 0, s * r * .5, W(4.4)); q.poly([[-r * .32, s * r * .18], [0, s * r * .52], [r * .32, s * r * .18]], W(4.4));
    if (t !== null) pop(w, p, t ?? p.H + .08, x, y, .2);
    return w;
  }
  function arrowLine(p, x1, y1, x2, y2, w = 4) {
    const a = Math.atan2(y2 - y1, x2 - x1), h = 16;
    p.line(x1, y1, x2, y2, W(w)); p.poly([[x2 - h * Math.cos(a - .5), y2 - h * Math.sin(a - .5)], [x2, y2], [x2 - h * Math.cos(a + .5), y2 - h * Math.sin(a + .5)]], W(w));
  }
  /* an icon from the -pro library at canvas point (cx, cy), box width wd (canvas units); it enters `delay` s after the design */
  function icon(d, cx, cy, wd, c, delay = .1) {
    if (!d.icon) return;
    const fn = G.icons[d.icon] || G.icons[d.icon + '-pro'];
    if (!fn) { console.warn('B01: no icon', d.icon); return; }
    G.art(fn, { x: c.x + cx * c.s, y: c.y + cy * c.s, w: wd * c.s, at: (c.at || 0) + delay });
  }
  const hitOf = c => c.hit ?? 1.2;
  /* every design is a rig: nothing pops by itself, each part has its own keyframes; it leaves with a pop */
  const art = (c, fn, exit = 'pop') => { const f = p => { p.H = hitOf(c); fn(p); }; f.custom = true; f.dur = .35; f.exit = exit; return G.art(f, { x: c.x, y: c.y, s: c.s, at: c.at || 0 }); };
  let clipN = 0;
  const clipTo = (p, make) => { const NS = 'http://www.w3.org/2000/svg', id = 'b01c' + (++clipN), cp = document.createElementNS(NS, 'clipPath');
    cp.setAttribute('id', id); cp.appendChild(make(NS)); p.g.appendChild(cp); return sub(p, { 'clip-path': `url(#${id})` }); };
  const rectEl = (x, y, w, h) => NS => { const r = document.createElementNS(NS, 'rect'); r.setAttribute('x', x); r.setAttribute('y', y); r.setAttribute('width', w); r.setAttribute('height', h); return r; };

  const V = [];
  const variant = (id, th, build) => V.push({ id, th, build });

  /* 01 ── HERO: the rule draws out, the number counts up and lands, the unit comes under it */
  variant('hero', 'ตัวเลขเดี่ยว', (d, c) => {
    const base = d.icon ? 95 : 70, ry = base + 42;
    art(c, p => {
      on(p.line(-300, ry, 300, ry, W(2.2)), p, .05, { draw: [[0, 0], [.35, 1, 'out']] });
      const dl = sub(p); dl.dot(-300, ry, 6); if (!d.dir) dl.dot(300, ry, 6); on(dl, p, .3, { o: [[0, 0], [.1, 1]] });
      number(p, d, 0, base, { size: 250, maxW: 820 }, .1);
      unitAt(p, d, 0, ry + 84, { size: 64, maxW: 700 });
      dirBadge(p, d.dir, 300, ry, 30);
    });
    icon(d, 0, -232, 150, c);
  });

  /* 02 ── DRUM: the digit drums roll and stop one after another, left to right — the last one on the keyword */
  variant('drum', 'ตัวนับหมุน', (d, c) => {
    const chars = [...String(d.value)], nd = chars.filter(ch => /\d/.test(ch)).length, ns = chars.length - nd;
    const cw = Math.min(130, (840 - ns * 44) / Math.max(1, nd)), ch = Math.min(190, cw * 1.4), cy = d.icon ? 10 : -20;
    const total = nd * cw + Math.max(0, nd - 1) * 10 + ns * 44, x0 = -total / 2;
    art(c, p => {
      const H = p.H, [O, P] = layers(p, 2); pop(O, p, 0, 0, cy); punch(P, p, H, 0, cy, 1.05);
      P.rect(x0 - 24, cy - ch / 2 - 22, total + 48, ch + 44, Object.assign({ rx: 26 }, F(3.4)));
      let x = x0, k = 0;
      chars.forEach(chr => {
        if (/\d/.test(chr)) {
          P.rect(x, cy - ch / 2, cw, ch, Object.assign({ rx: 14 }, F(2.4)));
          const cl = clipTo(P, rectEl(x, cy - ch / 2, cw, ch)), base = cy + ch * .25, size = ch * .7;
          const cur = txt(cl, chr, x + cw / 2, base, { size }).e, nxt = txt(cl, '', x + cw / 2, base - ch, { size }).e;
          const N = 10 + 3 * k, tgt = +chr, stop = .35 + (H - .35) * (k + 1) / nd, dg = i => ((tgt - N + i) % 10 + 10) % 10;
          HOOKS.push(t => { const u = rel(p, t);
            if (u >= stop) { cur.textContent = chr; cur.setAttribute('y', f1(base)); nxt.textContent = ''; return; }
            const ph = N * eOut(clamp01((u - .2) / (stop - .2))), i = Math.floor(ph), fr = ph - i;
            cur.textContent = dg(i); cur.setAttribute('y', f1(base + fr * ch)); nxt.textContent = dg(i + 1); nxt.setAttribute('y', f1(base + fr * ch - ch)); });
          P.path(`M ${f1(x + 12)} ${f1(cy - ch / 2 + 22)} Q ${f1(x + cw / 2)} ${f1(cy - ch / 2 + 8)} ${f1(x + cw - 12)} ${f1(cy - ch / 2 + 22)}`, W(1.6));
          P.path(`M ${f1(x + 12)} ${f1(cy + ch / 2 - 22)} Q ${f1(x + cw / 2)} ${f1(cy + ch / 2 - 8)} ${f1(x + cw - 12)} ${f1(cy + ch / 2 - 22)}`, W(1.6));
          x += cw + 10; k++;
        } else { const g = sub(P); txt(g, chr, x + 12, cy + ch * .25, { size: ch * (chr === '%' ? .5 : .6) }); on(g, p, H, { o: [[0, 0], [.12, 1]] }); x += 44; }
      });
      unitAt(p, d, 0, cy + ch / 2 + 110, { size: 60, maxW: 760 });
      dirBadge(p, d.dir, x0 + total + 24, cy - ch / 2 - 22, 32);
    });
    icon(d, 0, -248, 130, c);
  });

  /* 03 ── LCD: the screen wakes up, the segments scramble, each digit locks — the last one on the keyword */
  const SEG = { 0: 'abcdef', 1: 'bc', 2: 'abged', 3: 'abgcd', 4: 'fgbc', 5: 'afgcd', 6: 'afgedc', 7: 'abc', 8: 'abcdefg', 9: 'abcdfg' };
  function sevenAll(p, x, y, w, h, t) {          // all 7 segments of a digit cell; (x, y) = top-left; returns { a: el, … }
    const hz = (x1, x2, yy) => [[x1, yy], [x1 + t / 2, yy - t / 2], [x2 - t / 2, yy - t / 2], [x2, yy], [x2 - t / 2, yy + t / 2], [x1 + t / 2, yy + t / 2]];
    const vt = (xx, y1, y2) => [[xx, y1], [xx + t / 2, y1 + t / 2], [xx + t / 2, y2 - t / 2], [xx, y2], [xx - t / 2, y2 - t / 2], [xx - t / 2, y1 + t / 2]];
    const g = 3, P = { a: hz(x + g, x + w - g, y), g: hz(x + g, x + w - g, y + h / 2), d: hz(x + g, x + w - g, y + h),
      f: vt(x, y + g, y + h / 2 - g), b: vt(x + w, y + g, y + h / 2 - g), e: vt(x, y + h / 2 + g, y + h - g), c: vt(x + w, y + h / 2 + g, y + h - g) };
    const E = {}; for (const s in P) E[s] = p.shape(P[s].map(([a, b]) => [f1(a), f1(b)]), { fill: C.ink, sw: 1.2 }); return E;
  }
  variant('lcd', 'จอตัวเลข', (d, c) => {
    const py = d.icon ? 40 : 0, chars = [...String(d.value)];
    const nd = chars.filter(ch => /\d/.test(ch)).length, ns = chars.length - nd;
    let dw = 104, dh = 190, gap = 30, sp = 34;
    const need = nd * dw + (nd - 1) * gap + ns * sp + (chars.includes('%') ? 70 : 0), k = Math.min(1, 700 / need);
    dw *= k; dh *= k; gap *= k; sp *= k; const t = Math.max(10, 20 * k);
    art(c, p => {
      const H = p.H, [O, P] = layers(p, 2); pop(O, p, 0, 0, py);
      P.rect(-440, py - 190, 880, 380, Object.assign({ rx: 34 }, F(3.4)));
      P.rect(-400, py - 150, 800, 300, { rx: 16, fill: C.fill, sw: 2, stroke: C.soft });
      const tot = need * k, top = py - dh / 2 - (d.unit ? 22 : 0);
      const dg = sub(P, { transform: `skewX(-6)` }), sym = sub(dg); let x = -tot / 2, pi = 0;
      chars.forEach(ch => {
        if (/\d/.test(ch)) { const E = sevenAll(dg, x, top, dw, dh, t), tgt = +ch, my = pi++, lock = .35 + (H - .35) * (my + 1) / nd;
          HOOKS.push(tt => { const u = rel(p, tt), v = u < .3 ? -1 : u >= lock ? tgt : (tgt + Math.floor((u - .3) / .07) * 7 + my * 3) % 10;
            for (const s in E) E[s].setAttribute('opacity', v >= 0 && SEG[v].includes(s) ? 1 : 0); });
          x += dw + gap; }
        else if (ch === '%') { txt(sym, '%', x + 34 * k, top + dh, { size: dh * .62, anchor: 'start' }); x += 70 * k; }
        else if (ch === '.') { sym.rect(f1(x - gap / 2 - 2), f1(top + dh - t * .9), f1(t), f1(t), { rx: 2, fill: C.ink, sw: 1.2 }); x += sp; }
        else { sym.shape([[x - gap / 2 + 4, top + dh - 6], [x - gap / 2 + 14, top + dh - 6], [x - gap / 2 + 8, top + dh + 14], [x - gap / 2 - 2, top + dh + 14]], { fill: C.ink, sw: 1.2 }); x += sp; }
      });
      on(sym, p, H, { o: [[0, 0], [.08, 1]] }); punch(P, p, H, 0, py, 1.04);
      unitAt(P, d, 370, py + 128, { size: 42, anchor: 'end', maxW: 560 });
      if (d.dir) { const up = d.dir === 'up', ind = sub(P);
        ind.shape([[-372, py - 40], [-352, py - 72], [-332, py - 40]], up ? { fill: C.ink, sw: 1.4 } : { fill: C.fill, sw: 1.6, stroke: C.rule });
        ind.shape([[-372, py + 40], [-352, py + 72], [-332, py + 40]], up ? { fill: C.fill, sw: 1.6, stroke: C.rule } : { fill: C.ink, sw: 1.4 });
        on(ind, p, H, { o: [[0, 0], [.06, 1, 'lin'], [.12, .2, 'lin'], [.18, 1, 'lin']] }); }
    });
    icon(d, 0, -265, 110, c);
  });

  /* 04 ── GAUGE: the needle sweeps up from zero with the arc, overshoots a little and settles on the keyword */
  variant('gauge', 'หน้าปัด', (d, c) => {
    const cy = 60, R = 300, f = pct(d) != null ? frac(d) : pos(d), ang = 180 + 180 * f;
    art(c, p => {
      const H = p.H, O = sub(p); pop(O, p, 0, 0, cy);
      O.path(`M ${-R} ${cy} A ${R} ${R} 0 0 1 ${R} ${cy} Z`, F(3.4));
      O.path(`M -250 ${cy} A 250 250 0 0 1 250 ${cy}`, { sw: 14, stroke: C.rule });
      const ex = f1(250 * Math.cos(rad(ang))), ey = f1(cy + 250 * Math.sin(rad(ang)));
      if (f > 0) on(O.path(`M -250 ${cy} A 250 250 0 0 1 ${ex} ${ey}`, { sw: 14 }), p, .3, { draw: [[0, 0], [H - .3, 1, 'out']] });
      for (let i = 0; i <= 10; i++) { const a = rad(180 + i * 18), r0 = i % 5 ? 212 : 200; O.line(f1(r0 * Math.cos(a)), f1(cy + r0 * Math.sin(a)), f1(224 * Math.cos(a)), f1(cy + 224 * Math.sin(a)), W(i % 5 ? 1.8 : 3)); }
      const ndl = sub(O); ndl.line(f1(70 * Math.cos(rad(ang))), f1(cy + 70 * Math.sin(rad(ang))), f1(205 * Math.cos(rad(ang))), f1(cy + 205 * Math.sin(rad(ang))), { sw: 7 });
      on(ndl, p, .3, { ox: 0, oy: cy, r: [[0, 180 - ang], [H - .3, 3, 'out'], [H - .15, -1.5], [H, 0, 'soft']] });
      O.circle(0, cy, 64, F(3));
      const nu = numUnit(p, d, 0, cy + 200, { size: 150, maxW: 760, t0: .25 });
      dirBadge(p, d.dir, nu.right + 50, cy + 150, 30);
    });
    icon(d, 0, 60, 92, c, .15);
  });

  /* 05 ── RING: the ring fills while the number counts; on the keyword the ring pulses */
  variant('ring', 'วงแหวน', (d, c) => {
    const cy = -10, R = 250, f = frac(d);
    art(c, p => {
      const H = p.H, [O, P] = layers(p, 2); pop(O, p, 0, 0, cy); punch(P, p, H, 0, cy, 1.04);
      P.circle(0, cy, R, { sw: 16, stroke: C.rule });
      let arc = null;                               // the full ring starts at 12 o'clock: rotate its parent, not the circle (keyframes own the circle's transform)
      if (f >= .999) arc = sub(P, { transform: `rotate(-90 0 ${cy})` }).circle(0, cy, R, { sw: 16 });
      else if (f > 0) { const a = rad(-90 + 360 * f); arc = P.path(`M 0 ${cy - R} A ${R} ${R} 0 ${f > .5 ? 1 : 0} 1 ${f1(R * Math.cos(a))} ${f1(cy + R * Math.sin(a))}`, { sw: 16 }); }
      if (arc) on(arc, p, .3, { draw: [[0, 0], [H - .3, 1, 'out']] });
      P.circle(0, cy, 226, { fill: C.fill, sw: 2, stroke: C.soft });
      number(P, d, 0, cy + (d.icon ? 90 : 62), { size: 185, maxW: 370 }, .25);
      unitAt(P, d, 0, cy + (d.icon ? 160 : 140), { size: 46, maxW: 300 });
      dirBadge(p, d.dir, 177, cy - 177, 34);
    });
    icon(d, 0, cy - 118, 88, c, .15);
  });

  /* 06 ── BAR: the bar fills, its handle slides along and stops on the keyword */
  variant('bar', 'แถบเติม', (d, c) => {
    const f = frac(d), bx0 = d.icon ? -330 : -440, bx1 = 440, by = 160, x = bx0 + 18 + (bx1 - bx0 - 36) * f;
    art(c, p => {
      const H = p.H;
      numUnit(p, d, 0, 30, { size: 210, maxW: 860, t0: .15 });
      const B = sub(p); appear(B, p, .05, 30);
      B.rect(bx0, by - 30, bx1 - bx0, 60, Object.assign({ rx: 30 }, F(3.2)));
      if (f > 0) on(B.line(bx0 + 18, by, x, by, { sw: 22 }), p, .3, { draw: [[0, 0], [H - .3, 1, 'out']] });
      for (let i = 0; i <= 4; i++) { const tx = bx0 + 18 + (bx1 - bx0 - 36) * i / 4; B.line(f1(tx), by + 46, f1(tx), by + 64, W(2)); }
      if (d.icon) B.circle(-420, by, 66, F(3));
      const [hM, hP] = layers(B, 2); on(hM, p, .3, { x: [[0, bx0 + 18 - x], [H - .3, 0, 'out']] }); punch(hP, p, H, x, by, 1.2);
      if (d.dir) dirBadge(hP, d.dir, x, by, 36, null); else hP.circle(x, by, 22, F(3));
    });
    icon(d, -420, by, 96, c, .1);
  });

  /* 07 ── RULER: the ruler slides in, the pointer drops at zero and slides to its mark, stopping on the keyword */
  variant('ruler', 'ไม้บรรทัด', (d, c) => {
    const px = -440 + 880 * pos(d);
    art(c, p => {
      const H = p.H, Rl = sub(p); on(Rl, p, 0, { x: [[0, -160], [.35, 0, 'out']], o: [[0, 0], [.12, 1]] });
      Rl.rect(-460, 160, 920, 96, Object.assign({ rx: 12 }, F(3.2)));
      for (let i = 0; i <= 40; i++) { const x = -440 + i * 22; Rl.line(x, 160, x, 160 + (i % 5 ? 20 : 40), W(i % 5 ? 1.6 : 2.4)); }
      const [pO, pM, pP] = layers(p, 3);
      on(pO, p, .2, { y: [[0, -90], [.2, 0, 'in']], o: [[0, 0], [.06, 1]] });
      on(pM, p, .45, { x: [[0, -440 - px], [H - .45, 0, 'out']] }); punch(pP, p, H, px, 150, 1.15);
      pP.path(`M ${f1(px)} 150 C ${f1(px - 8)} 130, ${f1(px - 34)} 112, ${f1(px - 34)} 82 A 34 34 0 1 1 ${f1(px + 34)} 82 C ${f1(px + 34)} 112, ${f1(px + 8)} 130, ${f1(px)} 150 Z`, F(3.2));
      pP.circle(px, 82, 11, W(2.4));
      const ar = sub(p); if (d.dir === 'up') arrowLine(ar, px - 190, 128, px - 70, 128); if (d.dir === 'down') arrowLine(ar, px + 190, 128, px + 70, 128); appear(ar, p, H + .05, 0);
      const ng = sub(p), tmp = numUnit(ng, d, 0, -20, { size: 190, maxW: d.icon ? 700 : 900, t0: .2 }), half = (tmp.right - tmp.left) / 2;
      const lo = (d.icon ? -330 : -470) + half, cx = Math.max(lo, Math.min(470 - half, px));
      [...ng.g.querySelectorAll('text')].forEach(e => e.setAttribute('x', f1(+e.getAttribute('x') + cx)));
    });
    icon(d, -400, -230, 110, c);
  });

  /* 08 ── COLUMN: blocks drop and stack (up) — or two blocks lift away and leave ghosts (down); the last move lands on the keyword */
  variant('column', 'แท่งซ้อน', (d, c) => {
    const n = d.dir ? 4 : 3, solid = d.dir === 'down' ? 2 : n, cx = -250, bw = 190, bh = 74;
    art(c, p => {
      const H = p.H;
      on(p.line(-440, 306, 40, 306, W(2.4)), p, 0, { draw: [[0, 0], [.3, 1, 'out']] });
      for (let i = 0; i < n; i++) {
        const y = 300 - (i + 1) * (bh + 10), ti = .1 + (H - .4) * i / (n - 1), land = ti + .3;
        if (i >= solid) { const gh = sub(p); gh.rect(cx - bw / 2, y, bw, bh, { rx: 10, sw: 2.2, stroke: C.rule }); on(gh, p, H, { o: [[0, 0], [.2, 1]] }); }
        const [bO, bS] = layers(p, 2);
        const keys = { y: [[0, -260], [.3, 0, 'in']], o: [[0, 0], [.05, 1]] };
        if (i >= solid) { keys.y.push([H - ti, 0], [H - ti + .35, -140, 'in']); keys.o.push([H - ti, 1], [H - ti + .35, 0]); }
        on(bO, p, ti, keys);
        on(bS, p, ti, { ox: cx, oy: y + bh, sy: [[0, 1], [.3, 1], [.36, .86, 'out'], [.48, 1.04], [.6, 1, 'soft']] });
        bS.rect(cx - bw / 2, y, bw, bh, Object.assign({ rx: 10 }, F(i === n - 1 && d.dir === 'up' ? 4 : 3))); bS.line(cx - bw / 2 + 18, y + 18, cx - bw / 2 + 60, y + 18, W(2));
      }
      const ar = sub(p); if (d.dir === 'up') arrowLine(ar, cx + bw / 2 + 50, 120, cx + bw / 2 + 50, -60, 5);
      if (d.dir === 'down') arrowLine(ar, cx + bw / 2 + 50, -60, cx + bw / 2 + 50, 120, 5); appear(ar, p, H + .05, d.dir === 'down' ? -20 : 20);
      number(p, d, 190, 70, { size: 210, maxW: 470 }, .15);
      unitAt(p, d, 190, 160, { size: 60, maxW: 450 });
    });
    icon(d, cx, 300 - (d.dir === 'down' ? 2 : n) * (bh + 10) - 72, 130, c, hitOf(c) + .05);
  });

  /* 09 ── FRAME: the viewfinder corners close in from wide and lock on the number on the keyword */
  variant('frame', 'กรอบเล็ง', (d, c) => {
    art(c, p => {
      const H = p.H, Cn = sub(p);
      on(Cn, p, 0, { s: [[0, 1.35], [H, .97, 'out'], [H + .12, 1, 'soft']], o: [[0, 0], [.15, 1]] });
      [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sy]) => Cn.poly([[sx * 400, sy * 180], [sx * 400, sy * 260], [sx * 320, sy * 260]], { sw: 8 }));
      const tk = sub(p); [[0, -260, 0, -236], [0, 260, 0, 236], [-400, 0, -376, 0], [400, 0, 376, 0]].forEach(([a, b, e, f]) => tk.line(a, b, e, f, W(3)));
      on(tk, p, H, { o: [[0, 0], [.04, 1, 'lin'], [.1, .3, 'lin'], [.16, 1, 'lin']] });
      number(p, d, 0, 75, { size: 230, maxW: 640 }, .2);
      unitAt(p, d, 370, 228, { size: 52, anchor: 'end', maxW: 560 });
      dirBadge(p, d.dir, 330, -190, 34);
    });
    icon(d, -315, -175, 100, c);
  });

  /* 10 ── SPOTLIGHT: the lamp drops in and flickers on, the number counts up in its light */
  variant('spotlight', 'ไฟส่อง', (d, c) => {
    art(c, p => {
      const H = p.H, bm = sub(p);
      on(bm, p, .3, { o: [[0, 0], [.05, .9, 'lin'], [.09, .15, 'lin'], [.14, 1, 'lin'], [.19, .35, 'lin'], [.26, 1, 'lin']] });
      bm.shape([[-90, -234], [90, -234], [360, 250], [-360, 250]], { fill: 'rgba(255,255,255,.05)', stroke: 'none', sw: 0 });
      bm.line(-90, -234, -360, 250, { sw: 1.8, stroke: C.soft }); bm.line(90, -234, 360, 250, { sw: 1.8, stroke: C.soft });
      bm.ellipse(0, 250, 360, 44, { sw: 2.2, stroke: C.soft });
      const lp = sub(p); on(lp, p, 0, { y: [[0, -120], [.3, 0, 'out']], o: [[0, 0], [.1, 1]] });
      lp.line(0, -334, 0, -314, W(3)); lp.path('M -62 -318 L 62 -318 L 96 -234 L -96 -234 Z', F(3.2)); lp.line(-70, -246, 70, -246, W(2));
      const t = number(p, d, 0, d.unit ? 105 : 140, { size: 200, maxW: 500 }, .45);
      unitAt(p, d, 0, 182, { size: 54, maxW: 520 });
      dirBadge(p, d.dir, Math.min(300, t.bb.x + t.bb.width + 50), d.unit ? 40 : 75, 30);
    });
    icon(d, 0, -118, 112, c, .45);
  });

  /* 11 ── HEX: the plate spins in, the number counts, the plate thumps on the keyword */
  variant('hex', 'แผ่นหกเหลี่ยม', (d, c) => {
    const hx = r => [0, 1, 2, 3, 4, 5].map(i => [f1(r * Math.cos(rad(60 * i))), f1(r * .86 * Math.sin(rad(60 * i)))]);
    art(c, p => {
      const H = p.H, [O, T] = layers(p, 2);
      on(O, p, 0, { r: [[0, -60], [.38, 0, 'out']], s: [[0, .5], [.28, 1.05, 'out'], [.42, 1, 'soft']], o: [[0, 0], [.1, 1]] });
      on(T, p, H, { s: [[0, 1], [.06, .95], [.2, 1.04, 'out'], [.4, 1, 'soft']] });
      T.shape(hx(320), F(3.6)); T.shape(hx(282), { sw: 1.8, stroke: C.soft });
      number(T, d, 0, d.icon ? 90 : 65, { size: 190, maxW: 400 }, .25);
      unitAt(T, d, 0, d.icon ? 170 : 145, { size: 48, maxW: 380 });
      dirBadge(p, d.dir, 320, 0, 36);
    });
    icon(d, 0, -128, 100, c, .2);
  });

  /* 12 ── SIGN: the board swings down from its nail and settles while the number counts */
  variant('sign', 'ป้ายแขวน', (d, c) => {
    art(c, p => {
      const sw = sub(p); on(sw, p, 0, { ox: 0, oy: -322, r: [[0, -35], [.45, 12, 'out'], [.75, -6], [1.0, 3], [1.2, 0, 'soft']], o: [[0, 0], [.1, 1]] });
      sw.line(0, -318, -230, -150, W(2.4)); sw.line(0, -318, 230, -150, W(2.4));
      sw.rect(-340, -170, 680, 380, Object.assign({ rx: 26 }, F(3.4)));
      [-230, 230].forEach(x => sw.circle(x, -138, 10, W(2.4)));
      number(sw, d, 0, d.icon ? 112 : 80, { size: d.icon ? 175 : 200, maxW: 580 }, .35);
      unitAt(sw, d, 0, d.icon ? 182 : 165, { size: 46, maxW: 560 });
      dirBadge(sw, d.dir, 340, -170, 32);
      const nl = sub(p); nl.circle(0, -322, 12, F(2.6)); on(nl, p, 0, { o: [[0, 0], [.08, 1]] });
    });
    icon(d, 0, -78, 88, c, .5);
  });

  /* 13 ── LABEL MAKER: the tape feeds out of the slot with the number printed on it; it stops with a jolt on the keyword */
  variant('labelmaker', 'เครื่องพิมพ์ฉลาก', (d, c) => {
    art(c, p => {
      const H = p.H, cl = clipTo(p, rectEl(-192, -300, 760, 600)), tp = sub(cl);
      on(tp, p, .3, { x: [[0, -650], [H - .3, 0, 'out'], [H - .22, 7], [H - .1, 0, 'soft']] });
      tp.rect(-200, -78, 650, 156, Object.assign({ rx: 6 }, F(3)));
      const nb = sub(tp); txt(nb, d.value, 125, 46, { size: 130, maxW: 560 }); punch(nb, p, H, 125, 0, 1.06);
      const dv = sub(p); pop(dv, p, 0, -330, 0);
      dv.rect(-470, -190, 280, 390, Object.assign({ rx: 44 }, F(3.4)));
      dv.rect(-436, -150, 212, 80, Object.assign({ rx: 12 }, { fill: C.fill, sw: 2, stroke: C.soft }));
      for (let r = 0; r < 3; r++) for (let k = 0; k < 5 - (r === 2 ? 1 : 0); k++) dv.rect(-434 + k * 42 + (r === 2 ? 21 : 0), -36 + r * 44, 32, 30, Object.assign({ rx: 7 }, F(1.8)));
      dv.rect(-404, 100, 152, 30, Object.assign({ rx: 9 }, F(1.8)));
      dv.rect(-196, -26, 12, 52, Object.assign({ rx: 4 }, F(2)));
      unitAt(p, d, 125, 160, { size: 52, maxW: 600 });
      dirBadge(p, d.dir, 450, -78, 30);
    });
    icon(d, 125, -190, 110, c, hitOf(c) + .05);
  });

  /* 14 ── SHUTTER: the roller shutter rolls up into its box and uncovers the number on the keyword */
  variant('shutter', 'บานม้วน', (d, c) => {
    art(c, p => {
      const H = p.H, O = sub(p); pop(O, p, 0, 0, 0, .7);
      O.rect(-370, -250, 740, 510, Object.assign({ rx: 14 }, F(3.4)));
      O.rect(-330, -150, 660, 370, F(2.2));
      number(O, d, 0, d.unit ? 110 : 130, { size: 200, maxW: 580 }, 0);
      unitAt(O, d, 0, 190, { size: 50, maxW: 560 });
      const cu = sub(O); on(cu, p, 0, { ox: 0, oy: -150, sy: [[0, 1], [.35, 1], [H, .03, 'io']], o: [[0, 1], [H - .02, 1], [H, 0]] });
      cu.rect(-330, -150, 660, 370, F(2.4)); for (let y = -116; y < 210; y += 34) cu.line(-330, y, 330, y, W(1.6));
      cu.rect(-330, 196, 660, 24, F(2.6)); cu.rect(-40, 172, 80, 12, Object.assign({ rx: 6 }, F(2)));
      O.rect(-370, -250, 740, 104, Object.assign({ rx: 14 }, F(3.2))); [-218, -196, -174].forEach(y => O.line(-330, y, 330, y, W(1.6)));
      const bar = sub(O); bar.rect(-330, -150, 660, 24, F(2.6)); bar.rect(-40, -126, 80, 12, Object.assign({ rx: 6 }, F(2))); on(bar, p, H - .02, { o: [[0, 0], [.02, 1]] });
      dirBadge(O, d.dir, 330, -98, 30);
    });
    icon(d, -420, -300, 84, c);
  });

  /* 15 ── BLOCK: the floor draws, the number slab drops from above and lands with a squash on the keyword */
  variant('block', 'ตัวเลขนูน', (d, c) => {
    const base = d.icon ? 130 : 100;
    art(c, p => {
      const H = p.H;
      on(p.line(-430, base + 40, 430, base + 40, { sw: 2, stroke: C.soft }), p, 0, { draw: [[0, 0], [.35, 1, 'out']] });
      const [sO, sS, sI] = layers(p, 3);
      on(sO, p, 0, { y: [[0, -300], [H - .36, -300], [H, 0, 'in']], o: [[0, 0], [H - .36, 0], [H - .3, 1]] });
      on(sS, p, H, { ox: 0, oy: base + 40, sy: [[0, 1], [.07, .84, 'out'], [.2, 1.05], [.34, 1, 'soft']], sx: [[0, 1], [.07, 1.08, 'out'], [.2, .98], [.34, 1, 'soft']] });
      breathe(sI, p, H + .45, 0, base - 90);
      const back = txt(sI, d.value, 18, base + 18, { size: 270, maxW: 760, color: C.fill });
      back.e.setAttribute('stroke', C.soft); back.e.setAttribute('stroke-width', 3); back.e.setAttribute('stroke-linejoin', 'round');
      const fr = txt(sI, d.value, 0, base, { size: back.size, color: C.fill });
      fr.e.setAttribute('stroke', C.ink); fr.e.setAttribute('stroke-width', 5); fr.e.setAttribute('stroke-linejoin', 'round');
      unitAt(p, d, 0, base + 125, { size: 58, maxW: 760 });
      dirBadge(p, d.dir, Math.min(440, fr.bb.x + fr.bb.width + 56), base - 160, 32, H + .15);
    });
    icon(d, 0, -235, 120, c);
  });

  /* 16 ── LENS: the magnifier glides in over the number, the number counts inside it, the lens zooms on the keyword */
  variant('lens', 'แว่นขยาย', (d, c) => {
    art(c, p => {
      const H = p.H, [O, Z] = layers(p, 2);
      on(O, p, 0, { ox: -40, oy: -40, x: [[0, 260], [.42, 0, 'out']], y: [[0, 200], [.42, 0, 'out']], r: [[0, -20], [.42, 0, 'out']], o: [[0, 0], [.12, 1]] });
      punch(Z, p, H, -40, -40, 1.07);
      Z.line(118, 118, 270, 270, { sw: 50 }); Z.line(118, 118, 270, 270, { sw: 41, stroke: C.fill }); Z.line(150, 150, 168, 168, W(2));
      Z.circle(-40, -40, 222, F(4.2)); Z.circle(-40, -40, 198, { sw: 1.6, stroke: C.soft });
      const q = clipTo(Z, NS => { const e = document.createElementNS(NS, 'circle'); e.setAttribute('cx', -40); e.setAttribute('cy', -40); e.setAttribute('r', 196); return e; });
      const t = txt(q, d.value, -40, 40, { size: 230, maxW: 360 }); count(p, t.e, d.value, .25, H);
      unitAt(p, d, -40, 268, { size: 54, maxW: 300 });
      dirBadge(p, d.dir, 116, -196, 32);
    });
    icon(d, -380, -255, 96, c, .3);
  });

  /* 17 ── CARD: the card slides up, the title and icon settle, the number counts and the direction chip pops on the keyword */
  variant('card', 'การ์ดสถิติ', (d, c) => {
    art(c, p => {
      const H = p.H, O = sub(p); on(O, p, 0, { y: [[0, 90], [.35, 0, 'out']], o: [[0, 0], [.12, 1]] });
      O.rect(-430, -260, 860, 520, Object.assign({ rx: 40 }, F(3.4)));
      if (d.icon) { const ib = sub(O); ib.rect(-375, -210, 124, 124, Object.assign({ rx: 26 }, F(2.6))); pop(ib, p, .2, -313, -148); }
      if (d.unit) { const ug = sub(O); txt(ug, d.unit, d.icon ? -222 : -375, -132, { size: 52, weight: 600, color: C.soft, anchor: 'start', maxW: d.dir ? 400 : 560 }); appear(ug, p, .3, 10); }
      number(O, d, -375, 165, { size: 290, anchor: 'start', maxW: 750 }, .3);
      on(O.line(-375, 200, 375, 200, { sw: 2, stroke: C.rule }), p, .3, { draw: [[0, 0], [H - .3, 1, 'out']] });
      if (d.dir) { const up = d.dir === 'up', chip = sub(O); chip.rect(230, -210, 150, 84, Object.assign({ rx: 42 }, F(2.8)));
        const ar = sub(chip); arrowLine(ar, 305, up ? -142 : -194, 305, up ? -194 : -142, 5.5);
        pop(chip, p, H, 305, -168, .3); on(ar, p, H + .2, { y: [[0, 0], [.12, up ? -8 : 8, 'out'], [.3, 0, 'soft']] }); }
    });
    icon(d, -313, -148, 92, c, .3);
  });

  /* 18 ── NOTE: the pin drops, the note swings in from it and settles, the number is written; the pin presses on the keyword */
  variant('note', 'กระดาษโน้ตปักหมุด', (d, c) => {
    art(c, p => {
      const H = p.H, S = sub(p); on(S, p, .15, { ox: 0, oy: -250, r: [[0, -28], [.4, 9, 'out'], [.7, -4], [.95, 2], [1.15, 0, 'soft']], o: [[0, 0], [.08, 1]] });
      const q = sub(S, { transform: 'rotate(-3 0 20)' });
      q.path('M -270 -230 L 270 -230 L 270 190 L 200 260 L -270 260 Z', F(3.4));
      q.path('M 270 190 L 210 196 L 200 260', F(2.6));
      number(q, d, 0, d.unit ? 85 : 100, { size: 210, maxW: 450 }, .4);
      unitAt(q, d, 0, 170, { size: 50, maxW: 420 });
      dirBadge(q, d.dir, 205, -165, 32);
      const [pO, pP] = layers(p, 2); on(pO, p, 0, { y: [[0, -160], [.22, 0, 'in']], o: [[0, 0], [.06, 1]] });
      on(pP, p, H, { ox: 0, oy: -236, sy: [[0, 1], [.07, .8, 'out'], [.25, 1, 'soft']] });
      pP.line(0, -236, 0, -206, W(3)); pP.circle(0, -258, 30, F(3)); pP.circle(-8, -266, 8, W(2));
    });
    icon(d, -175, -150, 82, c, .5);
  });

  /* 19 ── FLIP: the top half flaps down again and again while the number counts, stopping on the spoken value on the keyword */
  variant('flip', 'แผ่นพลิก', (d, c) => {
    art(c, p => {
      const H = p.H, [O, P] = layers(p, 2); pop(O, p, 0); punch(P, p, H, 0, 0, 1.04);
      P.rect(-380, -200, 760, 400, Object.assign({ rx: 26 }, F(3.4)));
      const probe = txt(P, d.value, 0, 0, { size: 240, maxW: 660 }), size = probe.size, y = f1(size * .36); probe.e.remove();
      const top = clipTo(P, rectEl(-380, -200, 760, 200)), bot = clipTo(P, rectEl(-380, 0, 760, 200)), tf = sub(top);
      const a = txt(tf, d.value, 0, y, { size }).e, b = txt(bot, d.value, 0, y, { size }).e, K = 9, t0 = .3;
      HOOKS.push(t => { const u = rel(p, t);
        if (u >= H) { a.textContent = b.textContent = d.value; tf.g.removeAttribute('transform'); return; }
        const ph = clamp01((u - t0) / (H - t0)) * K, k = Math.floor(ph), fr = ph - k, v = fmtVal(d.value, k / K);
        a.textContent = b.textContent = v; tf.g.setAttribute('transform', `scale(1 ${u < t0 ? 1 : (1 - .92 * Math.sin(Math.PI * fr)).toFixed(3)})`); });
      P.line(-380, 0, 380, 0, { sw: 9, stroke: C.fill }); P.line(-380, 0, 380, 0, W(2));
      [-1, 1].forEach(sd => P.rect(sd * 392 - 10, -22, 20, 44, Object.assign({ rx: 6 }, F(2.6))));
      unitAt(p, d, 0, 290, { size: 56, maxW: 740 });
      dirBadge(p, d.dir, 380, -200, 32);
    });
    icon(d, 0, -278, 110, c, .15);
  });

  /* 20 ── STACK: the front card lands, the two back cards fan out behind it, the number counts; the front card thumps on the keyword */
  variant('stack', 'การ์ดซ้อน', (d, c) => {
    art(c, p => {
      const H = p.H;
      [[-12, -30, 10, 300, 200, { fill: C.fill, sw: 2.4, stroke: C.soft }], [7, 26, 4, 310, 210, F(2.8)]].forEach(([r, x, y, hw, hh, st]) => {
        const g = sub(p); g.rect(-hw, -hh, hw * 2, hh * 2, Object.assign({ rx: 28 }, st));
        on(g, p, .25, { ox: 0, oy: 60, r: [[0, 0], [.35, r, 'out']], x: [[0, 0], [.35, x, 'out']], y: [[0, 0], [.35, y, 'out']], o: [[0, 0], [.04, 1]] }); });
      const [O, P] = layers(p, 2); on(O, p, 0, { y: [[0, 70], [.3, 0, 'out']], o: [[0, 0], [.1, 1]] }); punch(P, p, H, 0, 0, 1.04);
      P.rect(-320, -220, 640, 440, Object.assign({ rx: 30 }, F(3.4)));
      number(P, d, 0, d.unit ? 70 : 90, { size: 200, maxW: 540 }, .3);
      unitAt(P, d, 0, 158, { size: 50, maxW: 540 });
      dirBadge(p, d.dir, 250, -150, 34);
    });
    icon(d, -238, -140, 92, c, .25);
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
