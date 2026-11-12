/* beats.js — 21 neutral scene templates (B01–B21) on top of glowline.js.
   Loaded automatically by glowline.js. Each beat takes only words, numbers and icon names, so it works
   for any topic. An icon may be a library name (GL.icons / GL.pairs), a drawing function p => {…},
   or ANY other word — unknown words become a glowing keyword badge, so nothing ever fails.
   Usage:  GL.beat('B05', { wrong: {...}, right: {...} })   — or GL.B05(...) / GL.beats.wrongRight(...)
   Reference: references/beats.md */
(function () {
  const G = window.GL, C = G.C, P = G.parts, NS = 'http://www.w3.org/2000/svg';
  const K = () => Math.min(G.W, G.H) / 1080 * 1.25;   // beats read from a phone: 25% larger than layouts
  const tall = () => G.H > G.W * 1.2;
  const FONT = 'GLLatin, GLThai, sans-serif';

  /* ---------------- helpers ---------------- */
  function measure(str, size, weight = 700) {
    const svg = document.querySelector('svg'), t = document.createElementNS(NS, 'text');
    t.setAttribute('font-size', size); t.setAttribute('font-weight', weight); t.setAttribute('font-family', FONT);
    t.textContent = str; svg.appendChild(t); const w = t.getComputedTextLength(); t.remove(); return w;
  }
  const seg = new Intl.Segmenter('th', { granularity: 'word' });
  function wrap(str, size, maxW, weight = 700) {             // Thai-aware word wrap → '\n'
    str = String(str ?? '');
    if (str.includes('\n') || measure(str, size, weight) <= maxW) return str;
    const lines = []; let cur = '';
    // break at the writer's own spaces first; only cut inside a phrase (Thai word segmenter) when one phrase is too long
    const toks = str.split(/(\s+)/).flatMap(tk => tk.trim() && measure(tk, size, weight) > maxW ? [...seg.segment(tk)].map(x => x.segment) : [tk]);
    for (const w of toks) {
      const t = cur + w;
      const glue = /^\s*[ๆ.,!?%)\]]/.test(w) || !w.trim();
      if (!glue && cur.trim() && measure(t.trim(), size, weight) > maxW) { lines.push(cur.trim()); cur = w; } else cur = t;
    }
    if (cur.trim()) lines.push(cur.trim());
    return lines.join('\n');
  }
  const nLines = s => String(s).split('\n').length;
  /* centred (vertically) text block; returns { g, h } */
  function ctext(str, { x = G.W / 2, cy, size = 56, maxW = G.W - 120, weight = 700, lh = 1.3, ...o } = {}) {
    const w = wrap(str, size, maxW, weight), n = nLines(w);
    const y = cy - (n - 1) * lh * size / 2 + size * .35;
    const g = G.text(w, Object.assign({ x, y, size, maxW, weight, lh }, o));
    return { g, h: n * lh * size };
  }
  const textH = (str, size, maxW, weight = 700) => nLines(wrap(str, size, maxW, weight)) * 1.3 * size;
  /* pill / card with text inside; returns { wrap, g, text, w, h, end } */
  function chip(str, x, cy, { size = 40 * K(), at = 0, pad = 30 * K(), maxW = G.W - 140, glow = false, color, stroke = C.soft, sw = 2.4, weight = 700, rx, minW = 0 } = {}) {
    const t = ctext(str, { x, cy: cy + size * .02, size, maxW: maxW - pad * 2, weight, color, glow, at: at + .18, rise: 8 });
    const bb = t.g.getBBox(), w = Math.max(minW, bb.width + pad * 2), h = t.h + size * .55;
    const a = G.art(p => p.rect(-w / 2, -h / 2, w, h, { rx: rx ?? Math.min(h / 2, 34 * K()), fill: C.fill, sw, stroke, dur: .35 }), { x, y: cy, at });
    t.g.parentNode.appendChild(t.g);
    return { wrap: a.wrap, g: a.g, text: t.g, w, h, end: Math.max(a.end, at + .63) };
  }
  function keyword(word) {                                    // fallback drawing for any word
    const n = [...new Intl.Segmenter('th', { granularity: 'grapheme' }).segment(String(word))].length;
    const size = Math.min(78, 560 / Math.max(3, n));
    return p => { p.rect(-185, -88, 370, 176, { rx: 40, fill: C.fill, dur: .45 }); p.text(String(word), 0, size * .36, { size, at: .3 }); };
  }
  function ic(x) {
    if (!x) return null;
    if (typeof x === 'function') return x;
    if (G.icons[x]) return G.icons[x];
    if (G.pairs[x]) return G.pairs[x].clean;
    return keyword(x);
  }
  const draw = (x, o) => G.art(ic(x), o);
  const dimTo = (e, at, to = .4) => G.tween(e, at, .5, { o: 1 }, { o: to }, { ease: G.easeIO });
  function area(o = {}) {
    const top = o.top ?? G.H * (tall() ? .1 : .08), bottom = o.bottom ?? G.H * (tall() ? .88 : .92);
    return { top, bottom, span: bottom - top, cy: (top + bottom) / 2, at: o.at ?? .3, k: K() };
  }
  const itemOf = v => typeof v === 'string' ? { label: v } : (v || {});

  /* ---------------- new parts ---------------- */
  Object.assign(P, {
    cross(p, x, y, s = 1, at = 0, d = .3, sw = 7) {
      p.line(x - 60 * s, y - 60 * s, x + 60 * s, y + 60 * s, { sw, at, dur: d * .55 });
      p.line(x + 60 * s, y - 60 * s, x - 60 * s, y + 60 * s, { sw, at: at + d * .5, dur: d * .55 });
    },
    warn(p, x, y, s = 1, at = 0, d = .5) {
      const q = p.child({ transform: `translate(${x} ${y}) scale(${s})` }, s);
      q.path('M 0 -86 Q 8 -86 12 -79 L 94 66 Q 98 77 87 78 L -87 78 Q -98 77 -94 66 L -12 -79 Q -8 -86 0 -86 Z', { fill: C.fill, at, dur: d });
      q.line(0, -32, 0, 20, { sw: 9, at: at + d * .8, dur: .18 });
      q.dot(0, 48, 6.5, { at: at + d + .1 });
    },
    qmark(p, x, y, s = 1, at = 0, d = .45) {
      const q = p.child({ transform: `translate(${x} ${y}) scale(${s})` }, s);
      q.path('M -34 -38 C -34 -84, 38 -84, 38 -40 C 38 -12, 0 -10, 0 22', { sw: 10, at, dur: d });
      q.dot(0, 54, 7.5, { at: at + d });
    },
    trend(p, x, y, s = 1, at = 0, d = .45, dir = 'up') {
      const k = dir === 'down' ? -1 : 1;
      p.shape([[0, -90], [72, -8], [30, -8], [30, 90], [-30, 90], [-30, -8], [-72, -8]].map(([a, b]) => [x + a * s, y + b * s * k]), { fill: C.fill, at, dur: d, sw: 3.2 });
    },
    store(p, x, y, s = 1, at = 0, d = .6) {
      const q = p.child({ transform: `translate(${x} ${y}) scale(${s})` }, s);
      q.rect(-150, -40, 300, 190, { rx: 8, fill: C.fill, at: at + d * .25, dur: d * .6 });
      let a = 'M -170 -40 L -150 -112 L 150 -112 L 170 -40';
      for (let i = 1; i <= 5; i++) a += ` A 34 24 0 0 1 ${170 - 68 * i} -40`;
      q.path(a + ' Z', { fill: C.fill, at, dur: d * .6 });
      [-90, -30, 30, 90].forEach((xx, i) => q.line(xx * 1.05, -110, xx * 1.13, -42, { sw: 1.6, stroke: C.soft, at: at + d * .5 + i * .03, dur: .15 }));
      q.rect(-40, 50, 80, 100, { rx: 6, fill: C.fill, sw: 2.4, at: at + d * .75, dur: .25 });
      [[-130, 10], [60, 10]].forEach(([xx, yy], i) => q.rect(xx, yy, 70, 58, { rx: 6, sw: 2, stroke: C.soft, at: at + d * .8 + i * .05, dur: .2 }));
    },
    house(p, x, y, s = 1, at = 0, d = .6) {
      const q = p.child({ transform: `translate(${x} ${y}) scale(${s})` }, s);
      q.rect(70, -120, 34, 70, { rx: 4, fill: C.fill, sw: 2.4, at, dur: .2 });
      q.rect(-120, -20, 240, 170, { rx: 8, fill: C.fill, at: at + d * .2, dur: d * .5 });
      q.shape([[-160, -10], [0, -140], [160, -10]], { fill: C.fill, at: at + d * .1, dur: d * .5 });
      q.rect(-32, 60, 64, 90, { rx: 6, sw: 2.4, at: at + d * .7, dur: .2 });
      q.rect(50, 20, 50, 46, { rx: 5, sw: 2, stroke: C.soft, at: at + d * .8, dur: .15 });
    },
    building(p, x, y, w, h, floors = 4, at = 0, d = .6, { names } = {}) {   // returns floor centre y's (bottom floor first)
      const l = x - w / 2, t = y - h / 2, fh = h / floors, ys = [];
      p.rect(l, t, w, h, { rx: 8, fill: C.fill, at, dur: d * .6 });
      for (let i = 0; i < floors; i++) {
        const fy = t + h - (i + .5) * fh; ys.push(fy);
        if (i < floors - 1) p.line(l, t + h - (i + 1) * fh, l + w, t + h - (i + 1) * fh, { sw: 2, stroke: C.soft, at: at + d * .5 + i * .04, dur: .2 });
        const ww = Math.min(w * .16, fh * .45), n = Math.max(2, Math.floor(w / (ww * 1.9)));
        for (let j = 0; j < n; j++) p.rect(l + (j + .5) * w / n - ww / 2, fy - ww * .45, ww, ww * .9, { rx: 4, sw: 1.6, stroke: C.soft, at: at + d * .6 + i * .04 + j * .02, dur: .15 });
        if (names && names[i] != null) p.text(String(names[i]), l - 40, fy + 14, { size: 40, at: at + d * .7 + i * .05, color: C.soft });
      }
      p.line(l - 30, t + h, l + w + 30, t + h, { sw: 3, at: at + d * .3, dur: .3 });
      return ys;
    },
    pin(p, x, y, s = 1, at = 0, d = .4) {                         // tip at (x, y)
      const q = p.child({ transform: `translate(${x} ${y - 40 * s}) scale(${s})` }, s);
      q.path('M 0 40 C -10 20, -34 4, -34 -16 A 34 34 0 1 1 34 -16 C 34 4, 10 20, 0 40 Z', { fill: C.fill, at, dur: d });
      q.circle(0, -16, 12, { sw: 2.6, at: at + d * .7, dur: .15 });
    },
    face(p, x, y, r = 100, mood = 'neutral', at = 0, d = .5) {
      const q = p.child({ transform: `translate(${x} ${y}) scale(${r / 100})` }, r / 100), f = at + d * .7, o = (dt = 0, du = .2) => ({ sw: 6, at: f + dt, dur: du });
      q.circle(0, 0, 100, { fill: C.fill, at, dur: d });
      const dots = () => { q.dot(-35, -18, 9, { at: f }); q.dot(35, -18, 9, { at: f + .05 }); };
      const M = {
        happy() { q.path('M -52 -16 Q -36 -40 -20 -16', o()); q.path('M 20 -16 Q 36 -40 52 -16', o(.05)); q.path('M -50 24 Q 0 82 50 24', o(.15, .3)); },
        sad() { dots(); q.line(-56, -42, -20, -54, o()); q.line(56, -42, 20, -54, o(.05)); q.path('M -40 54 Q 0 18 40 54', o(.15, .3)); },
        angry() { dots(); q.line(-58, -56, -16, -36, o()); q.line(58, -56, 16, -36, o(.05)); q.path('M -36 48 Q 0 30 36 48', o(.15, .3)); },
        fear() { q.circle(-35, -14, 15, o()); q.circle(35, -14, 15, o(.05)); q.dot(-35, -12, 5, { at: f + .1 }); q.dot(35, -12, 5, { at: f + .12 });
          q.line(-56, -42, -18, -56, o()); q.line(56, -42, 18, -56, o(.05)); q.path('M -36 48 q 9 -10 18 0 q 9 10 18 0 q 9 -10 18 0 q 9 10 18 0', o(.15, .3)); },
        relief() { q.path('M -52 -18 Q -36 -2 -20 -18', o()); q.path('M 20 -18 Q 36 -2 52 -18', o(.05)); q.path('M -30 34 Q 0 56 30 34', o(.15, .3)); },
        love() { [-36, 36].forEach((cx, i) => q.path(`M ${cx} -2 C ${cx - 26} -16, ${cx - 22} -40, ${cx - 9} -40 C ${cx - 3} -40, ${cx} -34, ${cx} -30 C ${cx} -34, ${cx + 3} -40, ${cx + 9} -40 C ${cx + 22} -40, ${cx + 26} -16, ${cx} -2 Z`, { fill: C.ink, sw: 2, at: f + i * .05, dur: .2 }));
          q.path('M -46 26 Q 0 78 46 26', o(.15, .3)); },
        doubt() { dots(); q.line(-56, -46, -18, -46, o()); q.path('M 18 -54 Q 38 -70 58 -56', o(.05)); q.path('M -34 46 Q -10 34 10 44 T 36 36', o(.15, .3)); },
        surprise() { q.circle(-35, -16, 13, o()); q.circle(35, -16, 13, o(.05)); q.path('M -56 -48 Q -36 -66 -16 -50', o(.08)); q.path('M 16 -50 Q 36 -66 56 -48', o(.1)); q.ellipse(0, 44, 16, 22, o(.15, .25)); },
        tired() { q.line(-52, -14, -20, -14, o()); q.line(20, -14, 52, -14, o(.05)); q.path('M -28 44 Q 0 36 28 44', o(.15, .25)); },
        neutral() { dots(); q.line(-30, 40, 30, 40, o(.15, .25)); },
      };
      (M[mood] || M.neutral)();
    },
    heart(p, x, y, s = 1, at = 0, d = .45, o = {}) {
      const q = p.child({ transform: `translate(${x} ${y}) scale(${s})` }, s);
      q.path('M 0 70 C -96 8, -86 -72, -38 -72 C -14 -72, 0 -54, 0 -38 C 0 -54, 14 -72, 38 -72 C 86 -72, 96 8, 0 70 Z', Object.assign({ fill: C.fill, at, dur: d }, o));
    },
    bookmark(p, x, y, s = 1, at = 0, d = .4, o = {}) {
      const q = p.child({ transform: `translate(${x} ${y}) scale(${s})` }, s);
      q.path('M -46 -84 Q -46 -92 -38 -92 L 38 -92 Q 46 -92 46 -84 L 46 88 L 0 52 L -46 88 Z', Object.assign({ fill: C.fill, at, dur: d }, o));
    },
    share(p, x, y, s = 1, at = 0, d = .45) {
      const q = p.child({ transform: `translate(${x} ${y}) scale(${s})` }, s);
      q.line(-44, 0, 44, -56, { sw: 3.4, at, dur: d * .4 }); q.line(-44, 0, 44, 56, { sw: 3.4, at: at + d * .1, dur: d * .4 });
      [[44, -56], [-44, 0], [44, 56]].forEach(([a, b], i) => q.circle(a, b, 24, { fill: C.fill, at: at + d * .3 + i * .08, dur: .25 }));
    },
    flag(p, x, y, s = 1, at = 0, d = .5) {                        // (x, y) = foot of the pole
      const q = p.child({ transform: `translate(${x} ${y}) scale(${s})` }, s);
      q.line(0, 0, 0, -240, { sw: 4, at, dur: d * .5 });
      q.path('M 0 -236 Q 40 -256 80 -236 T 160 -232 L 160 -164 Q 120 -184 80 -168 T 0 -172 Z', { fill: C.fill, at: at + d * .45, dur: d * .55 });
      q.rect(-40, -6, 80, 12, { rx: 6, fill: C.fill, sw: 2.4, at: at + d * .2, dur: .2 });
    },
    chest(p, x, y, s = 1, at = 0, d = .5) {                       // box body only; lid = chestLid
      const q = p.child({ transform: `translate(${x} ${y}) scale(${s})` }, s);
      q.rect(-130, -20, 260, 140, { rx: 12, fill: C.fill, at, dur: d });
      q.line(-130, 30, 130, 30, { sw: 2, stroke: C.soft, at: at + d * .6, dur: .2 });
      q.rect(-22, 12, 44, 40, { rx: 6, fill: C.fill, sw: 2.6, at: at + d * .8, dur: .2 });
    },
    chestLid(p, x, y, s = 1, at = 0, d = .4) {                    // lid sits on top of chest(x, y)
      const q = p.child({ transform: `translate(${x} ${y}) scale(${s})` }, s);
      q.path('M -138 -20 L -138 -60 Q -138 -96 -100 -96 L 100 -96 Q 138 -96 138 -60 L 138 -20 Z', { fill: C.fill, at, dur: d });
    },
    magnifier(p, x, y, s = 1, at = 0, d = .45) {
      const q = p.child({ transform: `translate(${x} ${y}) scale(${s})` }, s);
      P.capsule(q, 30, 30, 92, 92, 14, { at: at + d * .6, dur: d * .4 });
      q.circle(-10, -10, 64, { fill: C.fill, sw: 4, at, dur: d * .7 });
      q.path('M -48 -22 A 40 40 0 0 1 -22 -48', { sw: 2.4, stroke: C.soft, at: at + d * .8, dur: .15 });
    },
    eye(p, x, y, s = 1, at = 0, d = .45) {
      const q = p.child({ transform: `translate(${x} ${y}) scale(${s})` }, s);
      q.path('M -110 0 Q 0 -92 110 0 Q 0 92 -110 0 Z', { fill: C.fill, at, dur: d });
      q.circle(0, 0, 36, { sw: 3, at: at + d * .6, dur: .2 }); q.dot(0, 0, 13, { at: at + d * .8 });
    },
    mapPlan(p, x, y, w, h, at = 0, d = .6) {                      // city blocks map; returns nothing
      p.rect(x - w / 2, y - h / 2, w, h, { rx: 18, fill: C.fill, at, dur: d * .5 });
      const cols = 3, rows = 3, g = 26, bw = (w - g * (cols + 1)) / cols, bh = (h - g * (rows + 1)) / rows;
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++)
        p.rect(x - w / 2 + g + c * (bw + g), y - h / 2 + g + r * (bh + g), bw, bh, { rx: 8, sw: 1.8, stroke: C.soft, at: at + d * .4 + (r * cols + c) * .03, dur: .2 });
    },
    button(p, x, y, r, kind, at = 0, d = .4) {                    // round action button with an icon
      p.circle(x, y, r, { fill: C.fill, at, dur: d });
      const s = r / 100, t = at + d * .6;
      if (kind === 'like') P.heart(p, x, y + 4 * s, .55 * s, t, .3);
      else if (kind === 'save') P.bookmark(p, x, y, .5 * s, t, .3);
      else if (kind === 'share') P.share(p, x - 2 * s, y, .6 * s, t, .3);
      else if (kind === 'comment') { P.bubble(p, x, y - 6 * s, 96 * s, 66 * s, t, .3); [-22, 0, 22].forEach((dx, i) => p.dot(x + dx * s, y - 6 * s, 5 * s, { at: t + .2 + i * .04 })); }
      else if (kind === 'follow') { p.line(x - 34 * s, y, x + 34 * s, y, { sw: 6, at: t, dur: .15 }); p.line(x, y - 34 * s, x, y + 34 * s, { sw: 6, at: t + .1, dur: .15 }); }
      else if (kind === 'notify') P.bell(p, x, y, 1.6 * s, t, .3);
      else P.check(p, x, y, .55 * s, t, .3, 6);
    },
  });

  /* ---------------- new icons ---------------- */
  const moods = ['happy', 'sad', 'angry', 'fear', 'relief', 'love', 'doubt', 'surprise', 'tired', 'neutral'];
  Object.assign(G.icons, {
    cross: p => P.cross(p, 0, 0, 1.6, 0, .35, 9),
    warn: p => P.warn(p, 0, 10, 1.9, 0, .55),
    question: p => P.qmark(p, 0, -10, 2.2, 0, .5),
    up: p => P.trend(p, 0, 0, 1.8, 0, .5, 'up'),
    down: p => P.trend(p, 0, 0, 1.8, 0, .5, 'down'),
    store: p => P.store(p, 0, 0, 1.1, 0, .6),
    house: p => P.house(p, 0, 10, 1.15, 0, .6),
    building: p => P.building(p, 0, 0, 240, 340, 4, 0, .6),
    pin: p => P.pin(p, 0, 150, 3.6, 0, .5),
    map: p => P.mapPlan(p, 0, 0, 380, 330, 0, .6),
    heart: p => P.heart(p, 0, 0, 2.2, 0, .5),
    bookmark: p => P.bookmark(p, 0, 0, 1.9, 0, .45),
    share: p => P.share(p, 0, 0, 2.4, 0, .5),
    flag: p => P.flag(p, -70, 170, 1.4, 0, .55),
    chest: p => { P.chest(p, 0, 50, 1.3, 0, .5); P.chestLid(p, 0, 50, 1.3, .3, .35); },
    magnifier: p => P.magnifier(p, -20, -20, 1.9, 0, .5),
    eye: p => P.eye(p, 0, 0, 1.7, 0, .5),
    follow: p => { P.bust(p, -30, 10, 2.2, 0, .5); p.circle(120, 90, 44, { fill: C.fill, at: .45, dur: .25 }); p.line(96, 90, 144, 90, { sw: 6, at: .65, dur: .12 }); p.line(120, 66, 120, 114, { sw: 6, at: .72, dur: .12 }); },
  });
  moods.forEach(m => { G.icons['face-' + m] = p => P.face(p, 0, 0, 170, m, 0, .55); });

  /* ======================================================================================
     BEATS — each returns its end time. Common options (o): { at, top, bottom }.
     ====================================================================================== */
  const B = {};

  /* B01 ตัวเลขเด่น */
  B.number = function ({ value = 0, from = 0, prefix = '', suffix = '', decimals = 0, label, sub, trend, icon } = {}, o = {}) {
    const a = area(o), k = a.k, ns = o.size || Math.min(G.W * .3, a.span * .2, 330 * k), th = trend && !icon ? ns * .9 : 0;
    const lab = 56 * k, ss = 38 * k, ih = icon ? Math.min(a.span * .2, 300 * k) : 0, mw = G.W - 120;
    const lh = label ? textH(label, lab, mw) : 0, sh = sub ? textH(sub, ss, mw, 500) : 0;
    let y = a.cy - (ih + th + (icon ? 60 * k : 0) + ns * .74 + (label ? 75 * k + lh : 0) + (sub ? 20 * k + sh : 0)) / 2, t = a.at;
    if (icon) { const d = draw(icon, { x: G.W / 2, y: y + ih / 2, w: ih * 400 / 370, at: t }); t = d.end - .15; y += ih + 60 * k; }
    const ty = y + th / 2; y += th + ns * .74;
    const c = G.counter(value, { from, prefix, suffix, decimals, x: G.W / 2, y, size: ns, at: t, maxW: G.W - 120 });
    const bb = c.g.getBBox();
    G.art(p => p.line(-bb.width * .32, 0, bb.width * .32, 0, { sw: 4, dur: .5 }), { x: bb.x + bb.width / 2, y: y + ns * .15, at: c.end - .5 });
    if (trend) {
      const ar = G.art(p => P.trend(p, 0, 0, 1, 0, .45, trend), icon ? { x: Math.min(G.W - 100 * k, G.W / 2 + ih * .75), y: ty + ih / 2 - ih * .1 - th / 2 - 60 * k - ns * .0, s: ns / 300, at: t + .35, float: { amp: 7, period: 2.4 } }
            : { x: G.W / 2, y: ty, s: th / 210, at: t + .1, float: { amp: 7, period: 2.4 } });
      G.pulse(ar.g, c.end);
    }
    if (label) { y += 75 * k; ctext(label, { cy: y + lh / 2 - lab * .1, size: lab, at: t + .35, maxW: mw }); y += lh; }
    if (sub) { y += 20 * k; ctext(sub, { cy: y + sh / 2, size: ss, weight: 500, color: C.sub, glow: false, at: t + .5, maxW: mw }); }
    G.pulse(c.g, c.end, 'bloom', .5);
    return c.end + .3;
  };

  /* B02 เพิ่ม / ลด */
  B.change = function ({ dir = 'up', item = 'star', count = 5, owner, label, value } = {}, o = {}) {
    const a = area(o), k = a.k, up = dir === 'up' || dir === 'in', n = Math.max(2, Math.min(8, count));
    const ly = a.top + 60 * k, oy = owner ? a.top + a.span * .74 : 0, iw = Math.min(200 * k, G.W * .72 / Math.min(n, 4));
    let t = a.at;
    if (label) { ctext(label, { cy: ly, size: 62 * k, at: t }); t += .2; }
    if (owner) { const ow = draw(owner, { x: G.W / 2, y: oy, w: 380 * k, at: t }); t = ow.end - .2; }
    const pos = [];
    if (owner) {                                             // arc above the owner
      const R = Math.min(G.W * .36, a.span * .33), cy = oy - 40 * k;
      for (let i = 0; i < n; i++) { const th = Math.PI * (1.12 + .76 * i / (n - 1)); pos.push([G.W / 2 + Math.cos(th) * R, cy + Math.sin(th) * R]); }
    } else {
      const cols = Math.min(n, 4), rows = Math.ceil(n / cols), gy = a.cy + 40 * k;
      for (let i = 0; i < n; i++) { const r = Math.floor(i / cols), c = i % cols, inRow = Math.min(cols, n - r * cols);
        pos.push([G.W / 2 + (c - (inRow - 1) / 2) * iw * 1.25, gy + (r - (rows - 1) / 2) * iw * 1.25]); }
    }
    const els = pos.map(([x, y], i) => draw(item, { x, y, w: iw, at: up ? t + i * .32 : t + i * .06, filter: 'glowS' }));
    const end0 = els[els.length - 1].end;
    if (up) els.forEach((e, i) => G.pulse(e.g, e.end, 'bloomS', .7));
    else els.slice().reverse().forEach((e, i) => G.tween(e.wrap, end0 + .2 + i * .3, .5, { o: 1, dy: 0 }, { o: .12, dy: 50 * k }));
    const tEnd = up ? end0 : end0 + .2 + n * .3 + .3;
    const ax = owner ? G.W * .84 : G.W * .86, ay = owner ? oy - 10 * k : a.top + a.span * .2;
    const ar = G.art(p => P.trend(p, 0, 0, 1, 0, .45, up ? 'up' : 'down'), { x: ax, y: ay, s: .62 * k, at: up ? t + .2 : end0 + .1, float: { amp: 6, period: 2.4 } });
    if (value != null) G.text(String(value), { x: ax, y: ay + 110 * k * (up ? 1 : -1) + 18 * k, size: 46 * k, at: ar.end });
    G.pulse(ar.g, tEnd);
    return tEnd + .2;
  };

  /* B03 เปรียบเทียบ / ก่อน→หลัง */
  B.compare = function ({ left = {}, right = {}, mode = 'vs', win, pair } = {}, o = {}) {
    const a = area(o);
    if (pair) return G.hero({ pair, label: left.label || o.label, caption: right.label || o.caption }, { at: a.at });
    const L = itemOf(left), R = itemOf(right);
    const it = x => ({ icon: ic(x.icon || x.label), label: x.label, sub: x.sub });
    return G.versus({ left: it(L), right: it(R), vs: mode === 'change' ? '→' : (o.vs || 'VS'), win: win ?? (mode === 'change' ? 'right' : undefined) },
      { top: a.top + a.span * .08, bottom: a.bottom, at: a.at });
  };

  /* B04 ขั้นตอน / เช็กลิสต์ */
  B.steps = function ({ items = [], mode = 'steps', mark, title } = {}, o = {}) {
    const a = area(o), k = a.k, L = items.map(itemOf), n = L.length;
    let top = a.top, t = a.at;
    if (title) { ctext(title, { cy: top + 50 * k, size: 60 * k, at: t }); top += 150 * k; t += .3; }
    const rh = Math.min(260 * k, (a.bottom - top) / n), y0 = top + ((a.bottom - top) - rh * n) / 2 + rh / 2;
    const mx = G.W * .17, lx = G.W * .3, r = 46 * k, lab = 54 * k, rows = [];
    L.forEach((it, i) => {
      const y = y0 + i * rh;
      const m = G.art(p => {
        if (mode === 'check') { p.rect(-r * .8, -r * .8, r * 1.6, r * 1.6, { rx: 12 * k, fill: C.fill, sw: 3, dur: .3 }); P.check(p, 0, 0, r / 95, .55, .3, 6); }
        else { p.circle(0, 0, r, { fill: C.fill, dur: .35 }); p.text(String(i + 1), 0, r * .36, { size: r, at: .25 }); }
      }, { x: mx, y, at: t });
      if (mode !== 'check' && i < n - 1) G.art(p => p.line(0, r + 10 * k, 0, rh - r - 10 * k, { sw: 2.4, stroke: C.soft, dur: .3 }), { x: mx, y, at: m.end });
      const lg = ctext(it.label, { x: lx, cy: y, size: lab, anchor: 'start', maxW: G.W - lx - (it.icon ? 240 * k : 70), at: t + .2 });
      let ig; if (it.icon) ig = draw(it.icon, { x: G.W * .86, y, w: 150 * k, at: t + .2, filter: 'glowS' });
      rows.push([m, lg.g, ig]);
      t = m.end + .15;
    });
    if (mark != null && rows[mark]) {
      const y = y0 + mark * rh;
      rows.forEach(([m, g, ig], i) => { if (i !== mark) { dimTo(m.wrap, t); dimTo(g, t); if (ig) dimTo(ig.wrap, t); } });
      const lb = rows[mark][1].getBBox(), px = Math.min(G.W - 70 * k, lb.x + lb.width + 90 * k);
      const ptr = G.art(p => p.shape([[-62, 0], [-10, -40], [-10, -16], [56, -16], [56, 16], [-10, 16], [-10, 40]], { fill: C.fill, dur: .35 }), { x: px, y, s: .9 * k, at: t });
      G.tween(ptr.wrap, t, .6, { dx: 80 * k, o: 0 }, { dx: 0, o: 1 });
      G.pulse(rows[mark][0].g, t + .5); t += .8;
    }
    return t;
  };

  /* B05 ถูกกับผิด */
  B.wrongRight = function ({ wrong = {}, right = {}, tags = ['ไม่ใช่', 'แต่คือ'] } = {}, o = {}) {
    const a = area(o), k = a.k, Wr = itemOf(wrong), Rt = itemOf(right), side = !tall();
    const blocks = side ? [[G.W * .27, a.cy], [G.W * .73, a.cy]] : [[G.W * .3, a.top + a.span * .27], [G.W * .3, a.top + a.span * .73]];
    const iw = side ? Math.min(G.W * .3, a.span * .5) : Math.min(G.W * .36, a.span * .3);
    let t = a.at; const res = [];
    [[Wr, tags[0]], [Rt, tags[1]]].forEach(([it, tag], i) => {
      const [x, y] = blocks[i];
      const d = draw(it.icon || it.label, { x, y, w: iw, at: t });
      const tx = side ? x : G.W * .58, ty = side ? y + iw * .62 : y, an = side ? 'middle' : 'start';
      const tg = G.text(tag, { x: tx, y: side ? ty + 10 * k : ty - 70 * k, size: 42 * k, weight: 600, color: C.kicker, anchor: an, glow: false, at: t + .1, rise: 8 });
      const lg = ctext(it.label || '', { x: tx, cy: side ? ty + 80 * k : ty + 20 * k, size: 58 * k, anchor: an, maxW: side ? G.W * .42 : G.W * .4, at: t + .2 });
      res.push({ d, tg, lg: lg.g, x, y });
      t = d.end + .2;
      if (i === 0) {
        const X = G.art(p => P.cross(p, 0, 0, iw / 220, 0, .35, 9), { x, y, at: t });
        dimTo(d.wrap, X.end, .35); dimTo(lg.g, X.end, .45); dimTo(tg, X.end, .45);
        t = X.end + .25;
      }
    });
    const r1 = res[1];
    const badge = G.art(p => { p.circle(0, 0, 44, { fill: C.fill, sw: 3.4, dur: .3 }); P.check(p, 0, 2, .42, .25, .25, 6); }, { x: r1.x + iw * .42, y: r1.y - iw * .38, s: k, at: t - .1 });
    G.pulse(r1.d.g, badge.end); G.pulse(badge.g, badge.end);
    return badge.end + .4;
  };

  /* B06 คำถาม / ความสงสัย */
  B.question = function ({ question, who = 'think', options = [], answer } = {}, o = {}) {
    const a = area(o), k = a.k; let t = a.at;
    if (question) { const q = ctext(question, { cy: a.top + 80 * k, size: 64 * k, at: t, maxW: G.W - 140 }); t += .3; }
    const hasOpt = options.length > 0, px = hasOpt ? G.W * .28 : G.W / 2, py = a.top + a.span * (question ? .58 : .52);
    const person = draw(who, { x: px, y: py, w: (hasOpt ? 380 : 470) * k, at: t, float: { amp: 5, period: 3 } });
    const qs = hasOpt ? [[px + 150 * k, py - 280 * k, .9]] : [[G.W * .72, py - 300 * k, 1.1], [G.W * .2, py - 330 * k, .7], [G.W * .84, py - 120 * k, .55]];
    qs.forEach(([x, y, s], i) => { const m = G.art(p => P.qmark(p, 0, 0, 1, 0, .45), { x, y, s: s * k, at: person.end - .2 + i * .15, float: { amp: 6 + i * 2, period: 2.4 + i * .5 } }); G.pulse(m.g, m.end + .1, 'bloom', .7); });
    t = person.end + .2;
    if (!hasOpt) return t + .6;
    const ox = G.W * .7, oh = 120 * k, oy0 = py - (options.length - 1) * oh * .75;
    const chips = options.map((s, i) => chip(s, ox, oy0 + i * oh * 1.5, { size: 46 * k, at: t + i * .15, maxW: G.W * .5, minW: G.W * .36 }));
    t = chips[chips.length - 1].end;
    const cur = G.art(p => P.cursor(p, 0, 0, 1.4, 0, .3), { x: ox + G.W * .1, y: oy0 + 30 * k, s: k, at: t });
    let tt = t + .3;
    const visit = (i, dur = .5) => { const from = cur._at || [0, 0], to = [0, (i) * oh * 1.5]; G.tween(cur.wrap, tt, dur, { dx: from[0], dy: from[1] }, { dx: to[0], dy: to[1] }); cur._at = to; tt += dur + .25; };
    if (answer == null) { visit(Math.min(1, options.length - 1)); visit(0); visit(Math.min(1, options.length - 1)); }
    else {
      options.forEach((_, i) => { if (i !== answer) visit(i, .45); }); visit(answer, .45);
      chips.forEach((c, i) => { if (i !== answer) { dimTo(c.wrap, tt); dimTo(c.text, tt); } });
      const cA = chips[answer];
      G.art(p => { p.circle(0, 0, 34, { fill: C.fill, sw: 3, dur: .25 }); P.check(p, 0, 2, .32, .2, .2, 5); }, { x: ox + cA.w / 2, y: oy0 + answer * oh * 1.5 - cA.h / 2, s: k, at: tt });
      G.pulse(cA.g, tt + .3); tt += .6;
    }
    return tt;
  };

  /* B07 คำเตือน / ปัญหา */
  B.warning = function ({ icon, label, sign = 'ระวัง', cross = false } = {}, o = {}) {
    const a = area(o), k = a.k; let t = a.at;
    const wy = a.top + a.span * .17;
    const w = G.art(p => P.warn(p, 0, 0, 1, 0, .5), { x: G.W / 2, y: wy, s: 1.05 * k, at: t });
    const sc = chip(sign, G.W / 2, wy + 150 * k, { size: 40 * k, at: w.end - .2, stroke: C.ink, sw: 3 });
    t = sc.end;
    let iy = a.top + a.span * .57, iw = Math.min(G.W * .5, a.span * .32);
    if (icon || !label) {
      const d = draw(icon || 'warn', { x: G.W / 2, y: iy, w: iw, at: t });
      t = d.end;
      if (cross) { const X = G.art(p => P.cross(p, 0, 0, iw / 230, 0, .35, 9), { x: G.W / 2, y: iy, at: t }); dimTo(d.wrap, X.end, .4); t = X.end; }
    } else iy = a.top + a.span * .45, iw = 0;
    if (label) ctext(label, { cy: iy + iw * .55 + 90 * k, size: 64 * k, at: t - .1 });
    G.pulse(w.g, t + .1); G.pulse(w.g, t + 1.0, 'bloom', .8);
    return t + .9;
  };

  /* B08 เป้าหมาย / ผลลัพธ์ / ความสำเร็จ */
  B.goal = function ({ icon = 'flag', label, sub, start } = {}, o = {}) {
    const a = area(o), k = a.k; let t = a.at;
    const gx = G.W * .64, gy = a.top + a.span * .36, sx = G.W * .16, sy = a.top + a.span * .8;
    if (start) draw(start, { x: sx, y: sy - 60 * k, w: 170 * k, at: t, filter: 'glowS' });
    const goal = draw(icon, { x: gx, y: gy, w: Math.min(G.W * .46, a.span * .3), at: t });
    const ctrl = [sx + (gx - sx) * .1, gy + (sy - gy) * .2];
    const gw = Math.min(G.W * .46, a.span * .3), ex = gx - gw * .42, ey = gy + gw * .38;
    const te = G.connect(sx, sy, ex, ey, { at: goal.end - .3, dur: .8, dots: true, ctrl, stroke: C.soft });
    const dot = G.art(p => p.dot(0, 0, 13), { x: sx, y: sy, s: k, at: goal.end - .3 });
    const Q = u => [(1 - u) * (1 - u) * sx + 2 * (1 - u) * u * ctrl[0] + u * u * ex, (1 - u) * (1 - u) * sy + 2 * (1 - u) * u * ctrl[1] + u * u * ey];
    for (let i = 0; i < 8; i++) { const [x1, y1] = Q(i / 8), [x2, y2] = Q((i + 1) / 8); G.tween(dot.wrap, goal.end - .3 + i * .1, .1, { dx: x1 - sx, dy: y1 - sy }, { dx: x2 - sx, dy: y2 - sy }, { ease: u => u }); }
    t = te + .1;
    const badge = G.art(p => { p.circle(0, 0, 52, { fill: C.fill, sw: 3.4, dur: .3 }); P.check(p, 0, 2, .5, .25, .25, 7); }, { x: gx + gw * .45, y: gy - gw * .42, s: k, at: t });
    G.pulse(goal.g, badge.end); G.pulse(badge.g, badge.end);
    if (label) ctext(label, { cy: a.top + a.span * .68, x: G.W * .56, size: 62 * k, at: t, maxW: G.W * .75 });
    if (sub) ctext(sub, { cy: a.top + a.span * .68 + 90 * k, x: G.W * .56, size: 40 * k, weight: 500, color: C.sub, glow: false, at: t + .15, maxW: G.W * .75 });
    return badge.end + .5;
  };

  /* B09 เวลา / ไทม์ไลน์ / เดดไลน์ */
  B.timeline = function ({ points = [], title, icon } = {}, o = {}) {
    const a = area(o), k = a.k, L = points.map(itemOf), n = Math.max(2, L.length); let t = a.at;
    if (title) { ctext(title, { cy: a.top + 60 * k, size: 60 * k, at: t }); t += .3; }
    if (icon) { const c = draw(icon, { x: G.W / 2, y: a.top + a.span * .2, w: 220 * k, at: t, filter: 'glowS' }); t = c.end - .2; }
    const ly = a.top + a.span * .6, x0 = G.W * .14, x1 = G.W * .86, xs = L.map((_, i) => x0 + (x1 - x0) * i / (n - 1));
    G.art(p => p.line(x0 - 40 * k, 0, x1 + 40 * k, 0, { sw: 3, stroke: C.soft, dur: .6 }), { x: 0, y: ly, at: t });
    const mk = G.art(p => { p.circle(0, 0, 20, { fill: C.ink, sw: 2, dur: .2 }); }, { x: xs[0], y: ly, s: k, at: t + .3 });
    t += .5;
    L.forEach((it, i) => {
      if (i > 0) { G.tween(mk.wrap, t, .7, { dx: xs[i - 1] - xs[0] }, { dx: xs[i] - xs[0] }, { ease: G.easeIO }); t += .7; }
      const d = G.art(p => p.circle(0, 0, 14, { fill: C.fill, sw: 3, dur: .2 }), { x: xs[i], y: ly, s: k, at: t - .1 });
      ctext(it.label || '', { x: xs[i], cy: ly + 80 * k, size: 44 * k, at: t, maxW: (x1 - x0) / (n - 1) * .95 });
      if (it.sub) ctext(it.sub, { x: xs[i], cy: ly + 140 * k, size: 32 * k, weight: 500, color: C.sub, glow: false, at: t + .1, maxW: (x1 - x0) / (n - 1) * .95 });
      if (it.icon) { const ig = draw(it.icon, { x: xs[i], y: ly - 150 * k, w: Math.min(220 * k, (x1 - x0) / (n - 1) * .8), at: t, filter: 'glowS' }); G.pulse(ig.g, ig.end, 'bloomS', .8); t = Math.max(t + .4, ig.end - .2); }
      else t += .4;
    });
    G.pulse(mk.g, t);
    return t + .4;
  };

  /* B10 คน / กลุ่มเป้าหมาย */
  B.audience = function ({ icon = 'person', label, tags = [] } = {}, o = {}) {
    const a = area(o), k = a.k; let t = a.at;
    const py = a.top + a.span * .4, pw = Math.min(G.W * .44, a.span * .34);
    G.art(p => p.circle(0, 0, 230, { sw: 2, stroke: C.rule, dur: .7 }), { x: G.W / 2, y: py, s: pw / 400, at: t });
    const per = draw(icon, { x: G.W / 2, y: py, w: pw, at: t + .1 });
    t = per.end;
    tags.slice(0, 2).forEach((s, i) => {
      const sx = i ? G.W * .8 : G.W * .2, sy = py - pw * .35 + i * pw * .5;
      const c = chip(s, sx, sy, { size: 36 * k, at: t + i * .2, maxW: G.W * .34 });
      G.connect(G.W / 2 + (i ? 1 : -1) * pw * .32, py - pw * .1 + i * pw * .2, sx + (i ? -1 : 1) * (c.w / 2 + 10 * k), sy, { at: t + i * .2 + .1, dur: .35, dots: true, head: 0, sw: 2 });
    });
    if (label) { const c = chip(label, G.W / 2, a.top + a.span * .8, { size: 56 * k, at: t + .2, glow: true, stroke: C.ink, sw: 3.2, maxW: G.W - 120 }); G.pulse(c.g, c.end + .2, 'bloom', .6); t = c.end; }
    G.pulse(per.g, t + .2);
    return t + .6;
  };

  /* B11 คำพูด / แชต / คอมเมนต์ / รีวิว */
  B.chat = function ({ messages = [], kind = 'chat', ghost = false, mood, name, stars } = {}, o = {}) {
    const a = area(o), k = a.k; let t = a.at;
    const pw = Math.min(G.W * .84, a.span * .6), ph = kind === 'review' ? Math.min(a.span * .9, pw * 1.25) : Math.max(pw * .8, Math.min(a.span * .85, (330 + messages.length * 190 + (ghost ? 200 : 60)) * k)), cx = G.W / 2, cy = a.cy, top = cy - ph / 2;
    if (kind === 'review') {
      const card = G.art(p => p.rect(-pw / 2, -ph * .22, pw, ph * .44, { rx: 30, fill: C.fill, dur: .45 }), { x: cx, y: cy, at: t });
      const av = G.art(p => P.bust(p, 0, 0, .7, 0, .35), { x: cx - pw / 2 + 90 * k, y: cy - ph * .12, s: k, at: t + .2 });
      if (name) G.text(name, { x: cx - pw / 2 + 160 * k, y: cy - ph * .12 + 14 * k, size: 40 * k, anchor: 'start', at: t + .3, glow: false });
      const ns = stars ?? (mood === 'bad' ? 1 : 5);
      for (let i = 0; i < 5; i++) G.art(p => P.star(p, 0, 0, 30, 0, .25, { fill: i < ns ? C.ink : C.fill, sw: 2.4 }), { x: cx - pw / 2 + 90 * k + i * 74 * k, y: cy - ph * .01, s: k, at: t + .5 + i * .1 });
      const m = itemOf(messages[0]), mt = m.text || m.label;
      if (mt) ctext(mt, { x: cx - pw / 2 + 60 * k, cy: cy + ph * .11, size: 40 * k, anchor: 'start', weight: 500, color: C.soft, glow: false, maxW: pw - 120 * k, at: t + 1.1 });
      G.pulse(card.g, t + 1.4, 'bloom', .5);
      return t + 1.8;
    }
    // chat window (also used for comments)
    G.art(p => { p.rect(-pw / 2, -ph / 2, pw, ph, { rx: 46, fill: C.fill, dur: .5 }); p.line(-pw / 2, -ph / 2 + 130 * k, pw / 2, -ph / 2 + 130 * k, { sw: 2, stroke: C.soft, at: .3, dur: .3 }); }, { x: cx, y: cy, at: t });
    const av = G.art(p => P.bust(p, 0, 0, .55, 0, .3), { x: cx - pw / 2 + 70 * k, y: top + 65 * k, s: k, at: t + .3 });
    G.text(name || (kind === 'comment' ? 'COMMENTS' : 'CHAT'), { x: cx - pw / 2 + 130 * k, y: top + 78 * k, size: 38 * k, anchor: 'start', at: t + .35, glow: false });
    t += .7;
    let y = top + 170 * k; const size = 36 * k, bmax = pw * .74;
    const typing = (x, yy, at, gone) => {
      const g = G.art(p => { P.bubble(p, 0, 0, 120, 60, 0, .25); [-28, 0, 28].forEach((dx, i) => p.dot(dx, 0, 7, { at: .2 + i * .1 })); }, { x, y: yy, s: k, at, float: { amp: 3, period: 1 } });
      if (gone) G.tween(g.wrap, gone, .4, { o: 1 }, { o: 0 });
      return g;
    };
    let last;
    messages.map(itemOf).forEach((m, i) => {
      const me = m.from === 'me', txt = wrap(m.text || m.label || '', size, bmax - 50 * k, 500), n = nLines(txt);
      const bh = n * size * 1.3 + 36 * k;
      if (!me && kind === 'chat') { typing(cx - pw / 2 + 110 * k, y + 30 * k, t, t + .7); t += .75; }
      const tx = me ? cx + pw / 2 - 50 * k : cx - pw / 2 + 50 * k;
      const tg = G.text(txt, { x: tx, y: y + 18 * k + size, size, weight: 500, anchor: me ? 'end' : 'start', glow: false, color: me ? C.ink : C.soft, at: t + .2, rise: 6 });
      const bw = tg.getBBox().width + 50 * k;
      const bx = me ? cx + pw / 2 - 25 * k - bw / 2 : cx - pw / 2 + 25 * k + bw / 2;
      const b = G.art(p => P.bubble(p, 0, 0, bw / k, bh / k, 0, .3, me), { x: bx, y: y + bh / 2, s: k, at: t });
      tg.parentNode.appendChild(tg);
      if (mood && i === messages.length - 1 && kind === 'comment') G.art(p => mood === 'bad' ? P.face(p, 0, 0, 30, 'angry', 0, .3) : P.heart(p, 0, 0, .3, 0, .3), { x: bx + bw / 2 - 6 * k, y: y + bh, s: k, at: t + .5 });
      last = { b, me, y, bh, bx, bw };
      y += bh + 46 * k; t += .75;
    });
    if (mood && kind === 'chat' && last) G.art(p => mood === 'bad' ? P.face(p, 0, 0, 32, 'sad', 0, .3) : P.heart(p, 0, 0, .32, 0, .3), { x: last.bx + (last.me ? -1 : 1) * (last.bw / 2), y: last.y + last.bh, s: k, at: t });
    if (ghost && last) {
      G.text('อ่านแล้ว', { x: cx + pw / 2 - 50 * k, y: last.y + last.bh + 40 * k, size: 28 * k, weight: 500, anchor: 'end', color: C.mute, glow: false, at: t });
      typing(cx - pw / 2 + 110 * k, y + 30 * k, t + .5, t + 1.6); typing(cx - pw / 2 + 110 * k, y + 30 * k, t + 2.1, t + 2.6);
      dimTo(av.wrap, t + 2.6, .2);
      const z = G.art(p => P.zzz(p, 0, 0, 0, .45), { x: cx + pw / 2 - 130 * k, y: top + 90 * k, s: k, at: t + 2.8 });
      t += 3.4;
    } else t += .3;
    return t;
  };

  /* B12 เหตุ → ผล */
  B.cause = function ({ chain = [], links = [] } = {}, o = {}) {
    const a = area(o), k = a.k, L = chain.map(itemOf), n = L.length, side = !tall(); let t = a.at;
    const pos = L.map((_, i) => side ? [G.W * (i + .5) / n, a.cy - 40 * k] : [G.W * .32, a.top + a.span * (i + .5) / n]);
    const iw = side ? Math.min(G.W / n * .5, a.span * .4) : Math.min(a.span / n * .62, G.W * .3);
    L.forEach((it, i) => {
      const [x, y] = pos[i];
      const d = draw(it.icon || it.label, { x, y, w: iw, at: t });
      if (it.label) side ? ctext(it.label, { x, cy: y + iw * .62 + 40 * k, size: 44 * k, maxW: G.W / n * .9, at: t + .2 })
                         : ctext(it.label, { x: G.W * .55, cy: y, size: 50 * k, anchor: 'start', maxW: G.W * .4, at: t + .2 });
      if (i > 0) G.pulse(d.g, d.end, 'bloom', .8);
      t = d.end + .1;
      if (i < n - 1) {
        const [nx, ny] = pos[i + 1];
        const e = side ? G.connect(x + iw * .55, y, nx - iw * .55, ny, { at: t, dur: .4, stroke: C.ink, sw: 3.2, head: 16 })
                       : G.connect(x, y + iw * .5, nx, ny - iw * .5, { at: t, dur: .4, stroke: C.ink, sw: 3.2, head: 16 });
        if (links[i]) G.text(links[i], side ? { x: (x + nx) / 2, y: y - 30 * k, size: 32 * k, color: C.kicker, glow: false, at: t }
                                         : { x: x + 40 * k, y: (y + ny) / 2 + 12 * k, size: 32 * k, anchor: 'start', color: C.kicker, glow: false, at: t });
        t = e + .05;
      }
    });
    return t + .4;
  };

  /* B13 เคล็ดลับ / ความลับ */
  B.secret = function ({ label, icon = 'bulb', tag = 'เคล็ดลับ' } = {}, o = {}) {
    const a = area(o), k = a.k; let t = a.at;
    if (tag) { chip(tag, G.W / 2, a.top + 50 * k, { size: 40 * k, at: t, stroke: C.ink }); t += .3; }
    const by = a.top + a.span * .62, s = Math.min(1.5, G.W / 560) * k;
    const box = G.art(p => P.chest(p, 0, 0, 1, 0, .5), { x: G.W / 2, y: by, s, at: t });
    const lid = G.art(p => P.chestLid(p, 0, 0, 1, 0, .35), { x: G.W / 2, y: by, s, at: t + .3 });
    t = lid.end + .3;
    G.tween(lid.wrap, t, .7, { r: 0 }, { r: -100 }, { cx: G.W / 2 - 138 * s, cy: by - 20 * s, ease: G.easeIO });
    const rays = G.art(p => [-60, -35, -12, 12, 35, 60].forEach((d, i) => { const r = d * Math.PI / 180; p.line(Math.sin(r) * 150, -Math.cos(r) * 150, Math.sin(r) * 230, -Math.cos(r) * 230, { sw: 3, at: i * .04, dur: .2 }); }),
      { x: G.W / 2 + 30 * s, y: by - 40 * s, s, at: t + .4 });
    const iw = Math.min(G.W * .3, a.span * .2, 230 * s), iy = by - 110 * s - iw * .55;
    const it = draw(icon, { x: G.W / 2 + 30 * s, y: iy, w: iw, at: t + .35 });
    G.tween(it.wrap, t + .35, .8, { dy: 140 * s, o: 0 }, { dy: 0, o: 1 });
    G.pulse(it.g, it.end + .1);
    if (label) ctext(label, { cy: by + 160 * s, size: 58 * k, at: it.end - .1, maxW: G.W - 120 });
    return it.end + .6;
  };

  /* B14 ประโยคเด็ด */
  B.quote = function ({ text = '', by, highlight } = {}, o = {}) {
    const a = area(o), k = a.k; let t = a.at;
    const size = o.size || Math.min(84 * k, G.W * .08), lines = wrap(text, size, G.W - 200 * k).split('\n');
    const lh = size * 1.42, y0 = a.cy - (lines.length - 1) * lh / 2;
    G.art(p => [0, 64].forEach((dx, i) => { p.circle(dx, 0, 22, { fill: C.ink, sw: 2, at: i * .1, dur: .2 }); p.path(`M ${dx + 20} 4 Q ${dx + 22} 44 ${dx - 12} 62`, { sw: 7, at: .1 + i * .1, dur: .2 }); }),
      { x: G.W * .12, y: y0 - size * 2.2, s: k, at: t });
    t += .4;
    const hi = highlight ?? lines.length - 1;
    lines.forEach((ln, i) => {
      const g = G.text(ln, { y: y0 + i * lh + size * .35, size, at: t, rise: 14, maxW: G.W - 140 });
      if (i === hi) { const bb = g.getBBox(); G.art(p => p.line(-bb.width / 2, 0, bb.width / 2, 0, { sw: 4.5, dur: .5 }), { x: G.W / 2, y: y0 + i * lh + size * .58, at: t + .4 }); }
      t += .35;
    });
    if (by) G.text('— ' + by, { y: y0 + (lines.length - 1) * lh + size * 1.6, size: 38 * k, weight: 500, color: C.sub, glow: false, at: t + .2 });
    return t + .9;
  };

  /* B15 ชวนทำ / ปิดคลิป */
  const ACT = { follow: 'ติดตาม', like: 'ถูกใจ', comment: 'คอมเมนต์', save: 'บันทึก', share: 'แชร์', notify: 'แจ้งเตือน' };
  B.cta = function ({ actions = ['follow'], label, tap = 0, names = {} } = {}, o = {}) {
    const a = area(o), k = a.k, n = actions.length; let t = a.at;
    if (label) { ctext(label, { cy: a.top + a.span * .26, size: 66 * k, at: t, maxW: G.W - 140 }); t += .3; }
    const r = Math.min(110 * k, G.W / n * .3), y = a.top + a.span * .58, xs = actions.map((_, i) => G.W / 2 + (i - (n - 1) / 2) * Math.min(G.W / n, r * 3.2));
    const bs = actions.map((kind, i) => {
      const b = G.art(p => P.button(p, 0, 0, 100, kind, 0, .4), { x: xs[i], y, s: r / 100, at: t + i * .12 });
      G.text(names[kind] || ACT[kind] || kind, { x: xs[i], y: y + r + 56 * k, size: 36 * k, weight: 600, color: C.soft, glow: false, at: t + .3 + i * .12 });
      return b;
    });
    t = bs[n - 1].end + .2;
    const tx = xs[tap], kind = actions[tap];
    const cur = G.art(p => P.hand(p, 0, 64, 1, 0, .4), { x: tx + r * .7, y: y + r * .35, s: 1.25 * k, at: t });
    G.tween(cur.wrap, t, .8, { dx: 140 * k, dy: 220 * k, o: 0 }, { dx: 0, dy: 0, o: 1 });
    t += .9;
    G.tween(cur.wrap, t, .15, { dx: 0, dy: 0, s: 1 }, { dx: 0, dy: 0, s: .9 }, { cx: tx + r * .7, cy: y + r * .35 });
    G.tween(cur.wrap, t + .15, .2, { s: .9 }, { s: 1 }, { cx: tx + r * .7, cy: y + r * .35 });
    const on = G.art(p => {                                    // pressed state: icon turns solid / becomes a check
      p.circle(0, 0, 100, { fill: C.fill, sw: 4, dur: .2 });
      if (kind === 'like') P.heart(p, 0, 4, .55, .05, .2, { fill: C.ink });
      else if (kind === 'save') P.bookmark(p, 0, 0, .5, .05, .2, { fill: C.ink });
      else P.check(p, 0, 0, .55, .05, .25, 7);
    }, { x: tx, y, s: r / 100, at: t + .05 });
    [0, 1, 2, 3, 4, 5].forEach(i => { const an = i * Math.PI / 3; G.art(p => p.line(Math.cos(an) * 120, Math.sin(an) * 120, Math.cos(an) * 160, Math.sin(an) * 160, { sw: 4, dur: .15 }), { x: tx, y, s: r / 100, at: t + .15 }); });
    G.pulse(on.g, t + .3);
    return t + 1.1;
  };

  /* B16 นิยาม */
  B.define = function ({ term = '', meanings = [], icon } = {}, o = {}) {
    const a = area(o), k = a.k; let t = a.at;
    const nM = Math.max(1, meanings.length), blk = 92 * k * 1.9 + 140 * k + nM * Math.min(260 * k, a.span * .5 / nM);
    const ty = Math.max(a.top + 90 * k, a.cy - blk / 2 + 90 * k);
    const c = chip(term, G.W / 2, ty, { size: 92 * k, glow: true, stroke: C.ink, sw: 3.4, pad: 50 * k, at: t, rx: 24 * k });
    G.pulse(c.g, c.end + .1, 'bloom', .6);
    G.text('คือ', { y: ty + c.h / 2 + 80 * k, size: 40 * k, color: C.kicker, glow: false, at: c.end });
    if (icon) draw(icon, { x: G.W / 2 + c.w / 2 + 110 * k > G.W - 100 * k ? G.W - 110 * k : G.W / 2 + c.w / 2 + 110 * k, y: ty, w: 150 * k, at: c.end - .2, filter: 'glowS' });
    t = c.end + .2;
    const M = meanings.map(itemOf), n = M.length, sy0 = ty + c.h / 2 + 140 * k, mh = Math.min(260 * k, a.span * .5 / Math.max(1, n));
    const bx = G.W * .14;
    G.art(p => p.line(0, 0, 0, (n - .5) * mh, { sw: 2.4, stroke: C.soft, dur: .4 }), { x: bx, y: sy0, at: t });
    M.forEach((m, i) => {
      const y = sy0 + (i + .5) * mh;
      G.art(p => { p.line(0, 0, 40, 0, { sw: 2.4, stroke: C.soft, dur: .15 }); p.dot(54, 0, 8, { at: .12 }); }, { x: bx, y, s: k, at: t + .2 });
      ctext(m.label || '', { x: bx + 100 * k, cy: y, size: 58 * k, anchor: 'start', maxW: G.W - bx - 160 * k, at: t + .3 });
      t += .45;
    });
    return t + .6;
  };

  /* B17 รายการ */
  B.list = function ({ title, items = [] } = {}, o = {}) {
    const a = area(o), k = a.k, L = items.map(itemOf), n = Math.min(4, L.length); let t = a.at;
    let top = a.top;
    if (title) { const c = chip(title, G.W / 2, top + 60 * k, { size: 52 * k, at: t, stroke: C.ink, sw: 3, glow: true }); top += c.h + 110 * k; t = c.end; }
    const cols = n === 4 ? 2 : n, rows = Math.ceil(n / cols), cw = (G.W - 80) / cols, ch = Math.min((a.bottom - top) / rows, cw * 1.3);
    const y0 = top + ((a.bottom - top) - ch * rows) / 2;
    if (title) { const by = top - 50 * k; G.art(p => { p.line(G.W * .12, by, G.W * .88, by, { sw: 2.4, stroke: C.soft, dur: .4 }); for (let c = 0; c < cols; c++) p.line(40 + (c + .5) * cw, by, 40 + (c + .5) * cw, by + 34 * k, { sw: 2.4, stroke: C.soft, at: .3, dur: .15 }); }, { x: 0, y: 0, at: t - .2 }); }
    const ds = L.slice(0, n).map((it, i) => {
      const r = Math.floor(i / cols), c = i % cols, x = 40 + (c + .5) * cw, y = y0 + r * ch + ch * .42;
      const iw = Math.min(cw * .62, ch * .55);
      const d = draw(it.icon || it.label, { x, y, w: iw, at: t + i * .25, filter: iw < 250 ? 'glowS' : 'glow' });
      if (it.icon && it.label) ctext(it.label, { x, cy: y + iw * .55 + 46 * k, size: 44 * k, maxW: cw * .9, at: t + i * .25 + .25 });
      return d;
    });
    const end = ds[ds.length - 1].end;
    ds.forEach(d => G.pulse(d.g, end + .1, 'bloom', .6));
    return end + .6;
  };

  /* B18 เหตุการณ์ */
  B.event = function ({ when, who = 'person', whoLabel, what = {}, } = {}, o = {}) {
    const a = area(o), k = a.k, Wt = itemOf(what); let t = a.at;
    if (when) {
      const cy = a.top + 70 * k;
      const cal = G.art(p => P.calendar(p, 0, 0, 90, 80, 0, .3, { cols: 3, rows: 2 }), { x: G.W / 2 - 20 * k, y: cy, s: k, at: t });
      const c = chip(when, G.W / 2, cy, { size: 46 * k, at: t + .2, pad: 36 * k });
      G.tween(cal.wrap, t, .01, { dx: -c.w / 2 - 70 * k }, { dx: -c.w / 2 - 70 * k });
      t = c.end;
    }
    const fy0 = a.top + a.span * .2, fy1 = a.top + a.span * .76, fx0 = G.W * .08, fx1 = G.W * .92, L = 60 * k;
    G.art(p => [[fx0, fy0, 1, 1], [fx1, fy0, -1, 1], [fx0, fy1, 1, -1], [fx1, fy1, -1, -1]].forEach(([x, y, sx, sy], i) =>
      p.poly([[x + sx * L, y], [x, y], [x, y + sy * L]], { sw: 3, stroke: C.soft, at: i * .06, dur: .25 })), { x: 0, y: 0, at: t });
    const sy = (fy0 + fy1) / 2;
    const P1 = draw(who, { x: G.W * .3, y: sy, w: G.W * .3, at: t + .1 });
    if (whoLabel) ctext(whoLabel, { x: G.W * .3, cy: sy + G.W * .2, size: 40 * k, color: C.soft, glow: false, weight: 600, at: P1.end - .2 });
    const P2 = draw(Wt.icon || Wt.label, { x: G.W * .7, y: sy, w: G.W * .34, at: P1.end - .1 });
    G.connect(G.W * .45, sy - 40 * k, G.W * .52, sy - 40 * k, { at: P1.end, dur: .3, dots: true });
    if (Wt.icon && Wt.label) ctext(Wt.label, { cy: fy1 + 100 * k, size: 60 * k, at: P2.end - .2 });
    G.pulse(P2.g, P2.end + .1);
    return P2.end + .6;
  };

  /* B19 ความรู้สึก */
  B.feeling = function ({ mood = 'neutral', who, label } = {}, o = {}) {
    const a = area(o), k = a.k; let t = a.at;
    const fy = a.top + a.span * .48, r = Math.min(G.W * .26, a.span * .2);
    if (who) { const c = chip(who, G.W / 2, a.top + 60 * k, { size: 44 * k, at: t }); G.connect(G.W / 2, a.top + 60 * k + c.h / 2 + 10 * k, G.W / 2, fy - r - 40 * k, { at: c.end - .2, dur: .3, dots: true, head: 0, sw: 2 }); t = c.end - .1; }
    const f = G.art(p => P.face(p, 0, 0, 100, mood, 0, .55), { x: G.W / 2, y: fy, s: r / 100, at: t, float: { amp: 5, period: 3 } });
    t = f.end;
    const fx = (fn, x, y, s = 1, opt = {}) => G.art(fn, Object.assign({ x, y, s: s * k, at: t }, opt));
    const cx = G.W / 2;
    if (mood === 'happy' || mood === 'relief') [[-1.25, -.9], [1.3, -.7], [-1.4, .4], [1.25, .6]].forEach(([u, v], i) => { const s = fx(p => P.star(p, 0, 0, 22, 0, .25, { fill: C.ink, sw: 2 }), cx + u * r, fy + v * r, 1, { at: t + i * .12, float: { amp: 4, period: 1.8 + i * .3 } }); G.pulse(s.g, s.end); });
    if (mood === 'love') [[-1.2, -.8], [1.25, -.9], [1.05, .1]].forEach(([u, v], i) => { const h = fx(p => P.heart(p, 0, 0, .32, 0, .3, { fill: C.ink }), cx + u * r, fy + v * r, 1, { at: t + i * .15 }); G.tween(h.wrap, t + i * .15, 1.6, { dy: 40 * k }, { dy: -60 * k }, { ease: u => u }); });
    if (mood === 'sad') { const d = fx(p => p.path('M 0 -22 C 10 -6 14 4 14 10 A 14 14 0 1 1 -14 10 C -14 4 -10 -6 0 -22 Z', { fill: C.ink, sw: 2, dur: .25 }), cx - r * .35, fy + r * .05, 1.2); G.tween(d.wrap, t + .3, 1.1, { dy: 0, o: 1 }, { dy: r * .55, o: 0 }, { ease: G.easeIO }); }
    if (mood === 'fear' || mood === 'tired') fx(p => p.path('M 0 -22 C 10 -6 14 4 14 10 A 14 14 0 1 1 -14 10 C -14 4 -10 -6 0 -22 Z', { fill: C.fill, sw: 3, dur: .25 }), cx + r * .78, fy - r * .55, 1.2);
    if (mood === 'fear') [-1, 1].forEach(sd => fx(p => [0, 1, 2].forEach(i => p.line(0, -30 + i * 30, sd * 26, -30 + i * 30, { sw: 3, at: i * .06, dur: .1 })), cx + sd * r * 1.2, fy, 1));
    if (mood === 'angry') [-1, 1].forEach((sd, i) => { const s = fx(p => p.path('M 0 0 q -14 -18 0 -36 q 14 -18 0 -36', { sw: 4, dur: .3 }), cx + sd * r * .8, fy - r * .95, 1.2); G.tween(s.wrap, t + .2, 1.4, { dy: 0, o: 1 }, { dy: -50 * k, o: .2 }); });
    if (mood === 'doubt') [[1.25, -.8, 1], [-1.3, -.5, .7]].forEach(([u, v, s], i) => fx(p => P.qmark(p, 0, 0, 1, 0, .4), cx + u * r, fy + v * r, s * .7, { at: t + i * .15, float: { amp: 6, period: 2.2 } }));
    if (mood === 'surprise') [-1, 0, 1].forEach((sd, i) => fx(p => p.line(0, 0, sd * 26, -60, { sw: 5, dur: .15 }), cx + sd * r * .45, fy - r * 1.12, 1, { at: t + i * .05 }));
    if (label) ctext(label, { cy: fy + r + 130 * k, size: 66 * k, at: t - .1 });
    G.pulse(f.g, t + .3, 'bloom', .7);
    return t + 1.4;
  };

  /* B20 ความสัมพันธ์ */
  B.relation = function ({ a: A = {}, b: Bp = {}, relation, broken = false, power } = {}, o = {}) {
    const ar = area(o), k = ar.k, IA = itemOf(A), IB = itemOf(Bp); let t = ar.at;
    const cy = ar.top + ar.span * .48, dy = power ? 150 * k : 0;
    const pa = [G.W * .22, cy - (power === 'a' ? dy : power === 'b' ? -dy * .5 : 0)], pb = [G.W * .78, cy - (power === 'b' ? dy : power === 'a' ? -dy * .5 : 0)];
    const sa = power === 'a' ? 1.25 : power === 'b' ? .85 : 1, sb = power === 'b' ? 1.25 : power === 'a' ? .85 : 1, iw = Math.min(G.W * .3, ar.span * .26);
    const dA = draw(IA.icon || 'bust', { x: pa[0], y: pa[1], w: iw * sa, at: t });
    const dB = draw(IB.icon || 'bust', { x: pb[0], y: pb[1], w: iw * sb, at: t + .2 });
    if (IA.label) ctext(IA.label, { x: pa[0], cy: pa[1] + iw * sa * .55 + 50 * k, size: 46 * k, maxW: G.W * .4, at: t + .3 });
    if (IB.label) ctext(IB.label, { x: pb[0], cy: pb[1] + iw * sb * .55 + 50 * k, size: 46 * k, maxW: G.W * .4, at: t + .5 });
    t = dB.end;
    const x1 = pa[0] + iw * sa * .55, x2 = pb[0] - iw * sb * .55, mx = (x1 + x2) / 2, my = (pa[1] + pb[1]) / 2;
    const half = (xa, ya, xb, yb, at) => G.art(p => p.line(xa, ya, xb, yb, { sw: 3.4, dur: .35 }), { x: 0, y: 0, at });
    const h1 = half(x1, pa[1], mx, my, t), h2 = half(mx, my, x2, pb[1], t + .25);
    if (power) G.art(p => { const an = Math.atan2(pb[1] - pa[1], x2 - x1) + (power === 'b' ? Math.PI : 0), tx = power === 'b' ? x1 : x2, ty = power === 'b' ? pa[1] : pb[1];
      p.poly([[tx - Math.cos(an - .5) * 20, ty - Math.sin(an - .5) * 20], [tx, ty], [tx - Math.cos(an + .5) * 20, ty - Math.sin(an + .5) * 20]], { sw: 3.4, dur: .15 }); }, { x: 0, y: 0, at: t + .55 });
    t += .65;
    let rc; if (relation) { rc = chip(relation, mx, my - 100 * k, { size: 40 * k, at: t, stroke: C.ink }); t = rc.end; }
    if (broken) {
      t += .3;
      G.tween(h1.wrap, t, .6, { dx: 0, r: 0 }, { dx: -30 * k, r: 0, o: .5 }); G.tween(h2.wrap, t, .6, { dx: 0 }, { dx: 30 * k, o: .5 });
      G.tween(dA.wrap, t, .7, { dx: 0 }, { dx: -40 * k }); G.tween(dB.wrap, t, .7, { dx: 0 }, { dx: 40 * k });
      G.art(p => P.cross(p, 0, 0, .45, 0, .3, 6), { x: mx, y: my, s: k, at: t + .2 });
      if (rc) { dimTo(rc.wrap, t + .3, .4); dimTo(rc.text, t + .3, .4); }
      t += .9;
    } else { G.pulse(h1.g, t, 'bloom', .7); G.pulse(h2.g, t, 'bloom', .7); }
    return t + .5;
  };

  /* B21 สถานที่ */
  B.place = function ({ kind = 'building', name, floors, spots = [] } = {}, o = {}) {
    const a = area(o), k = a.k, S = spots.map(itemOf); let t = a.at;
    const py = a.top + a.span * .52, pw = Math.min(G.W * .62, a.span * .5), ph = pw * 1.05, pts = [];
    if (name) { chip(name, G.W / 2, a.top + 60 * k, { size: 50 * k, at: t, stroke: C.ink, sw: 3, glow: true }); t += .3; }
    if (kind === 'building') {
      const names = floors || ['G', '1', '2', '3'].slice(0, Math.max(3, ...S.map(s => (s.floor ?? 0) + 1)));
      let ys; const d = G.art(p => { ys = P.building(p, 0, 0, pw, ph, names.length, 0, .6, { names }); }, { x: G.W / 2 + 20 * k, y: py, at: t });
      S.forEach((s, i) => { const same = S.filter((z, j) => j < i && (z.floor ?? 0) === (s.floor ?? 0)).length;
        pts.push([G.W / 2 + 20 * k + pw * (-.22 + same * .44), py + ys[Math.min(ys.length - 1, s.floor ?? 0)] + 30 * k]); });
      t = d.end;
    } else {
      const fn = kind === 'map' ? p => P.mapPlan(p, 0, 0, 400, 380, 0, .6) : ic(kind);
      const d = G.art(fn, { x: G.W / 2, y: py, w: pw, at: t });
      const auto = [[-.25, .15], [.25, .2], [0, -.25]];
      S.forEach((s, i) => { const [u, v] = s.at || auto[i % 3]; pts.push([G.W / 2 + u * pw, py + v * pw]); });
      t = d.end;
    }
    S.forEach((s, i) => {
      const [x, y] = pts[i];
      const pn = G.art(p => P.pin(p, 0, 0, 1, 0, .35), { x, y, s: 1.15 * k, at: t + i * .4 });
      G.tween(pn.wrap, t + i * .4, .5, { dy: -90 * k, o: 0 }, { dy: 0, o: 1 });
      if (s.label) { const lx = x < G.W / 2 ? Math.max(G.W * .16, x - 40 * k) : Math.min(G.W * .84, x + 40 * k);
        chip(s.label, lx, y - 150 * k - (i % 2) * 0, { size: 38 * k, at: t + i * .4 + .4, maxW: G.W * .4 }); }
      G.pulse(pn.g, t + i * .4 + .6);
    });
    return t + S.length * .4 + .8;
  };

  /* ---------------- registry ---------------- */
  const CODES = { B01: 'number', B02: 'change', B03: 'compare', B04: 'steps', B05: 'wrongRight', B06: 'question', B07: 'warning', B08: 'goal', B09: 'timeline', B10: 'audience', B11: 'chat',
    B12: 'cause', B13: 'secret', B14: 'quote', B15: 'cta', B16: 'define', B17: 'list', B18: 'event', B19: 'feeling', B20: 'relation', B21: 'place' };
  G.beats = B; G.BEAT_CODES = CODES; G.moods = moods; G.wrap = wrap; G.chip = chip; G.ic = ic;
  G.beat = (code, data, o) => { const f = B[CODES[code] || code]; if (!f) throw new Error(`GL.beat: unknown "${code}". Use ${Object.keys(CODES).join(' ')}`); return f(data || {}, o || {}); };
  Object.keys(CODES).forEach(c => { G[c] = (d, o) => G.beat(c, d, o); });
})();
