/* glowline.js — glow line-art motion graphics (white neon line drawings on black)
   ---------------------------------------------------------------------------------
   Scene file (scene.html) loads this script, then:

     GL.run(() => {
       GL.stage();                                   // 1080x1920 default
       const top = GL.title({ kicker: '3 WAYS TO', main: 'SIMPLIFY', sub: 'ตัดให้เหลือแค่สิ่งที่จำเป็น' });
       GL.rows([{ label: '1. INBOX', pair: 'inbox' }, ...], { top });
     });

   Everything is driven by window.setT(seconds) so scripts/render.js can step frame by frame.
   API: references/api.md · style: references/style.md · kit (people, hands, arrows): references/kit.md
   layouts beyond before→after: references/scenes.md · before→after pairs: references/pairs.md            */
(function () {
  const NS = 'http://www.w3.org/2000/svg';
  const HERE = document.currentScript ? document.currentScript.src.replace(/[^/]*$/, '') : '';
  const ALPHA = /[?&]alpha=1/.test(location.search);

  /* palette — monochrome only. ink = the glowing line, fill = dark body that hides lines behind it */
  const C = { ink: '#f2f2f2', fill: '#171717', soft: '#bdbdbd', mute: '#8a8a8a', rule: '#4a4a4a', sub: '#a9a9a9', kicker: '#cfcfcf' };
  const FONT = 'GLLatin, GLThai, sans-serif';

  const css = document.createElement('style');
  css.textContent = `
    @font-face { font-family: GLLatin; src: url("${HERE}fonts/InterDisplay-Bold.otf"); font-weight: 100 900; }
    @font-face { font-family: GLThai;  src: url("${HERE}fonts/Anuphan-VF.ttf");       font-weight: 100 900; }
    html, body { margin: 0; padding: 0; overflow: hidden; background: ${ALPHA ? 'transparent' : '#040404'}; }
    svg { display: block; }`;
  document.head.appendChild(css);

  const items = [];            // stroke draws + pulses
  const tweens = new Map();    // element -> [{start, dur, from, to, ...}]
  let svg, root, cur, W = 1080, H = 1920, lastEnd = 0, uid = 0;
  let seed = 7;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const rr = (a, b) => a + (b - a) * rnd();
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const bump = t => { if (t > lastEnd) lastEnd = t; };
  const easeIO = p => p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
  const easeOut = p => 1 - Math.pow(1 - p, 3);
  const pts = a => typeof a === 'string' ? a : a.map(q => q.join(',')).join(' ');

  function mk(tag, attrs = {}, parent) {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) if (attrs[k] != null) e.setAttribute(k, attrs[k]);
    (parent || cur || document.body).appendChild(e);
    return e;
  }

  /* ---------------- stage ---------------- */
  function stage({ w = 1080, h = 1920, glow = 1, seed: s } = {}) {
    W = w; H = h; if (s) seed = s;
    svg = mk('svg', { width: w, height: h, viewBox: `0 0 ${w} ${h}` }, document.body);
    const defs = mk('defs', {}, svg);
    defs.innerHTML = `
      <radialGradient id="glbg" cx="50%" cy="40%" r="75%"><stop offset="0" stop-color="#121212"/><stop offset="1" stop-color="#020202"/></radialGradient>
      <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="${3 * glow}" result="a"/>
        <feGaussianBlur in="SourceGraphic" stdDeviation="${11 * glow}" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="a"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      <filter id="glowS" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="${2 * glow}" result="a"/>
        <feGaussianBlur in="SourceGraphic" stdDeviation="${6 * glow}" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="a"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      <filter id="bloom" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="${16 * glow}"/></filter>
      <filter id="bloomS" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="${8 * glow}"/></filter>`;
    if (!ALPHA) mk('rect', { width: w, height: h, fill: 'url(#glbg)' }, svg);
    root = cur = mk('g', {}, svg);
    window.STAGE = { w, h };
    return { w, h };
  }

  /* ---------------- Pen: every stroke draws itself ----------------
     p.rect(x, y, w, h, {at, dur, fill, sw, rx, stroke})  — at/dur in seconds, relative to the pen's start.
     Strokes are white (C.ink) 3px by default; give closed shapes fill: GL.C.fill so they hide what is behind. */
  class Pen {
    constructor(g, t0 = 0, k = 1, ts = 1, span) { this.g = g; this.t0 = t0; this.k = k; this.ts = ts; this.span = span || { end: t0 }; }
    child(attrs = {}, sc = 1) { return new Pen(mk('g', attrs, this.g), this.t0, this.k / sc, this.ts, this.span); }
    shift(dt) { return new Pen(this.g, this.t0 + dt * this.ts, this.k, this.ts, this.span); }
    _end(t) { if (t > this.span.end) this.span.end = t; bump(t); }
    _d(tag, a, o = {}) {
      const start = this.t0 + (o.at || 0) * this.ts, dur = Math.max(.01, (o.dur ?? .4) * this.ts);
      const fill = o.fill || 'none';
      const e = mk(tag, Object.assign({
        fill, stroke: o.stroke || C.ink, 'stroke-width': (o.sw ?? 3) * this.k,
        'stroke-linecap': 'round', 'stroke-linejoin': 'round', pathLength: 1, 'stroke-dasharray': '1 1',
      }, a), this.g);
      items.push({ type: 'draw', e, start, dur, hasFill: fill !== 'none' });
      this._end(start + dur);
      return e;
    }
    line(x1, y1, x2, y2, o) { return this._d('line', { x1, y1, x2, y2 }, o); }
    rect(x, y, w, h, o = {}) { return this._d('rect', { x, y, width: w, height: h, rx: o.rx || 0 }, o); }
    box(cx, cy, w, h, o) { return this.rect(cx - w / 2, cy - h / 2, w, h, o); }
    circle(cx, cy, r, o) { return this._d('circle', { cx, cy, r }, o); }
    ellipse(cx, cy, rx, ry, o) { return this._d('ellipse', { cx, cy, rx, ry }, o); }
    poly(p, o) { return this._d('polyline', { points: pts(p) }, o); }
    shape(p, o) { return this._d('polygon', { points: pts(p) }, o); }
    path(d, o) { return this._d('path', { d }, o); }
    dot(cx, cy, r, o = {}) { return this._d('circle', { cx, cy, r }, Object.assign({ fill: C.ink, sw: 1, dur: .15 }, o)); }
    /* tube: a thick limb (arm, leg, finger, pipe) along points or a path — white outline, dark core, round ends.
       Drawn as one stroke that grows from the first point; later tubes cover earlier ones where they overlap. */
    tube(pts_, T, o = {}) {
      const d = typeof pts_ === 'string' ? pts_ : 'M ' + pts_.map(q => q.join(' ')).join(' L ');
      const sw = (o.sw ?? 3) * this.k;
      this._d('path', { d, 'stroke-width': T + sw }, Object.assign({}, o, { fill: 'none' }));
      return this._d('path', { d, 'stroke-width': Math.max(.1, T - sw) }, Object.assign({}, o, { fill: 'none', stroke: o.core || C.fill }));
    }
    text(str, x, y, o = {}) {      // text inside a drawing (fades in)
      const start = this.t0 + (o.at || 0) * this.ts, dur = (o.dur ?? .3) * this.ts;
      const e = mk('text', { x, y, 'text-anchor': o.anchor || 'middle', 'font-size': o.size || 24, 'font-weight': o.weight || 700,
        'letter-spacing': o.ls || 0, fill: o.color || C.ink, 'font-family': FONT }, this.g);
      e.textContent = str;
      tween(e, start, dur, { o: 0 }, { o: 1 });
      this._end(start + dur);
      return e;
    }
  }

  /* ---------------- tweens (opacity / scale / move on a whole group) ---------------- */
  function tween(e, start, dur, from, to, { cx = 0, cy = 0, ease = easeOut } = {}) {
    if (!tweens.has(e)) tweens.set(e, []);
    const list = tweens.get(e);
    list.push({ start, dur: Math.max(.01, dur), from, to, cx, cy, ease });
    list.sort((a, b) => a.start - b.start);
    bump(start + dur);
    return e;
  }
  const fade = (e, at, dur = .45, rise = 20) => tween(e, at, dur, { o: 0, dy: rise }, { o: 1, dy: 0 });

  /* bloom pulse on a finished drawing (needs the drawing's <g> with an id) */
  function pulse(g, start, filter = 'bloom', strength = 1) {
    const u = mk('use', { href: '#' + g.id, filter: `url(#${filter})`, opacity: 0 }, g.parentNode.parentNode);
    items.push({ type: 'pulse', e: u, start, strength });
  }

  /* ---------------- drawing placement ---------------- */
  function strokeK(s) { return s >= 1 ? 1 / Math.sqrt(s) : Math.max(1, .8 / s); }   // keeps lines ~2.4–4px on screen
  function art(fn, { x, y, s = 1, at = 0, ts = 1, filter = 'glow', parent = cur } = {}) {
    const wrap = mk('g', { filter: filter ? `url(#${filter})` : null }, parent);
    const g = mk('g', { transform: `translate(${x} ${y}) scale(${s})`, id: 'gl' + (++uid) }, wrap);
    const p = new Pen(g, at, strokeK(s), ts);
    fn(p);
    return { wrap, g, end: p.span.end };
  }
  function pairOf(it) {
    if (it.messy && it.clean) return it;
    const P = pairs[it.pair];
    if (!P) throw new Error(`GL: unknown pair "${it.pair}". Known: ${Object.keys(pairs).join(', ')}. Define new ones with GL.pair(name, {messy(p){}, clean(p){}}).`);
    return P;
  }
  function single(icon) {
    if (typeof icon === 'function') return icon;
    if (pairs[icon]) return pairs[icon].clean;
    if (icons[icon]) return icons[icon];
    throw new Error(`GL: unknown icon "${icon}". Use a pair name (${Object.keys(pairs).join(', ')}), an icon (${Object.keys(icons).join(', ')}) or a function(p).`);
  }

  /* ---------------- text ---------------- */
  function text(str, { x = W / 2, y, size = 56, at = 0, dur = .45, rise, color = C.ink, weight = 700, anchor = 'middle', ls = 0,
    maxW = W - 80, glow = true, lh = 1.3, parent = cur } = {}) {
    const g = mk('g', { filter: glow ? 'url(#glow)' : null }, parent);
    const t = mk('text', { x, y, 'text-anchor': anchor, 'font-size': size, 'font-weight': weight, 'letter-spacing': ls, fill: color, 'font-family': FONT }, g);
    String(str).split('\n').forEach((ln, i) => { const s = mk('tspan', { x, dy: i ? `${lh}em` : null }, t); s.textContent = ln; });
    const bw = t.getBBox().width;
    if (bw > maxW) t.setAttribute('font-size', (size * maxW / bw).toFixed(1));
    fade(g, at, dur, rise ?? size * .3);
    return g;
  }
  function hline(y, at, { x1 = 40, x2 = W - 40 } = {}) {
    new Pen(cur, at).line(x1, y, x2, y, { stroke: C.rule, sw: 2, dur: .6 });
  }
  function vline(x, y1, y2, at) { new Pen(cur, at).line(x, y1, x, y2, { stroke: C.rule, sw: 2, dur: .6 }); }
  function midArrow(x, y, at, len = 35) {
    const g = mk('g', { filter: 'url(#glow)' }, cur), p = new Pen(g, at);
    p.line(x - len, y, x + len, y, { stroke: C.mute, dur: .25 });
    p.poly([[x + len - 15, y - 13], [x + len + 1, y], [x + len - 15, y + 13]], { stroke: C.mute, at: .18, dur: .15 });
  }

  /* ---------------- layouts ---------------- */
  function title({ kicker, main, sub, top = 40, at = .05, size = 142 } = {}) {
    let y = top;
    if (kicker) { y += 78; text(kicker, { y, size: 50, ls: 10, color: C.kicker, at, rise: 16 }); }
    if (main) { y += size * .9; text(main, { y, size, ls: 4, at: at + .15, rise: 36, maxW: W - 120 }); }
    if (sub) { y += 60; text(sub, { y, size: 34, weight: 500, color: C.sub, glow: false, at: at + .4, rise: 14 }); }
    return y + 34;
  }

  /* rows: one before→after per row (left = messy, right = clean). Best 1–4 rows per 9:16 frame. Returns end time. */
  function rows(list, { top = 340, bottom = H, at = .9, gap = .15, arrow = true, rule = true, labelSize = 56, dim = .42, ts = 1 } = {}) {
    const n = list.length, rh = (bottom - top) / n;
    const lab = Math.min(labelSize, rh * .106), LA = lab * 1.96;
    const s = Math.min(1, (rh - LA - 10) / 420, (W / 2 - 50) / 440);
    let t = at;
    list.forEach((it, i) => {
      const P = pairOf(it), y0 = top + i * rh, cy = y0 + LA + (rh - LA) / 2;
      if (rule) hline(y0, t - .25);
      if (it.label) text(it.label, { y: y0 + lab * 1.57, size: lab, at: t, rise: 18 });
      const m = art(P.messy, { x: W * .264, y: cy, s, at: t + .25, ts });
      if (arrow) midArrow(W / 2, cy, m.end - .15);
      const c = art(P.clean, { x: W * .736, y: cy, s, at: m.end + .05, ts });
      if (dim < 1) tween(m.wrap, m.end + .15, .5, { o: 1 }, { o: dim }, { ease: easeIO });
      pulse(c.g, c.end + .1);
      t = c.end + gap;
    });
    return t;
  }

  /* grid: poster of many before→after cells (like a "20 ways" infographic). Returns end time. */
  function grid(list, { cols = 2, top = 340, bottom = H, at = .9, stagger = .55, labelSize, dim = .6, ts = .8 } = {}) {
    const nr = Math.ceil(list.length / cols), cw = W / cols, ch = (bottom - top) / nr;
    const lab = labelSize || clamp(ch * .12, 22, 56), LA = lab * 1.9;
    const s = Math.min((ch - LA - 12) / 400, (cw / 2 - 16) / 440);
    const small = s < .6;
    for (let r = 0; r < nr; r++) hline(top + r * ch, at - .3 + r * .04, { x1: 0, x2: W });
    for (let c = 1; c < cols; c++) vline(c * cw, top, bottom, at - .3);
    let end = at;
    list.forEach((it, i) => {
      const P = pairOf(it), r = Math.floor(i / cols), c = i % cols, x0 = c * cw, y0 = top + r * ch, t = at + i * stagger;
      const cy = y0 + LA + (ch - LA) / 2;
      if (it.label) text(it.label, { x: x0 + cw / 2, y: y0 + lab * 1.38, size: lab, at: t, maxW: cw - 30, rise: lab * .3 });
      const m = art(P.messy, { x: x0 + cw * .27, y: cy, s, at: t + .15, ts, filter: small ? 'glowS' : 'glow' });
      const k = art(P.clean, { x: x0 + cw * .73, y: cy, s, at: m.end, ts, filter: small ? 'glowS' : 'glow' });
      if (dim < 1) tween(m.wrap, m.end + .1, .4, { o: 1 }, { o: dim }, { ease: easeIO });
      pulse(k.g, k.end + .05, small ? 'bloomS' : 'bloom');
      end = Math.max(end, k.end);
    });
    return end;
  }

  /* hero: one pair full screen — messy draws, dissolves, clean draws in the same place. Good as B-roll. */
  function hero(it, { at = .4, y = H * .5, label = it.label, caption = it.caption, swap = true, scale, ts = 1 } = {}) {
    const P = pairOf(it);
    const s = scale || Math.min((W - 140) / 440, (H * .42) / 400);
    if (label) text(label, { y: y - 205 * s - 70, size: Math.min(96, W * .085), at, rise: 26 });
    const ax = swap ? W / 2 : W * .264, bx = swap ? W / 2 : W * .736, ss = swap ? s : Math.min(s, (W / 2 - 50) / 440);
    const m = art(P.messy, { x: ax, y, s: ss, at: at + .25, ts });
    let t = m.end + .1;
    if (swap) { tween(m.wrap, m.end + .45, .45, { o: 1, s: 1 }, { o: 0, s: .94 }, { cx: W / 2, cy: y, ease: easeIO }); t = m.end + .6; }
    else { midArrow(W / 2, y, m.end - .15); tween(m.wrap, m.end + .15, .5, { o: 1 }, { o: .42 }, { ease: easeIO }); }
    const c = art(P.clean, { x: bx, y, s: ss, at: t, ts });
    if (caption) text(caption, { y: y + 205 * ss + 110, size: 48, weight: 600, color: C.soft, glow: false, at: t + .2, rise: 14 });
    pulse(c.g, c.end + .1);
    return c.end;
  }

  /* steps: icon on the left, label + sub text on the right (habits, tips, checklists). Returns end time. */
  function steps(list, { top = 340, bottom = H, at = .9, gap = .1, rule = true, ts = 1 } = {}) {
    const n = list.length, rh = (bottom - top) / n;
    const s = Math.min(rh * .74 / 400, 280 / 440), ix = 60 + 220 * s, tx = 60 + 440 * s + 50;
    const ls = clamp(rh * .17, 34, 66), ss = ls * .62;
    let t = at;
    list.forEach((it, i) => {
      const y0 = top + i * rh, cy = y0 + rh / 2;
      if (rule) hline(y0, t - .25);
      const a = art(single(it.icon || it.pair), { x: ix, y: cy, s, at: t, ts });
      text(it.label, { x: tx, y: it.sub ? cy - ls * .15 : cy + ls * .35, size: ls, anchor: 'start', maxW: W - tx - 50, at: t + .15, rise: 14 });
      if (it.sub) text(it.sub, { x: tx, y: cy + ls * .95, size: ss, weight: 500, color: C.sub, anchor: 'start', glow: false, maxW: W - tx - 50, at: t + .3, rise: 10 });
      pulse(a.g, a.end + .05);
      t = Math.max(a.end, t + .6) + gap;
    });
    return t;
  }

  /* page: groups a layout so it fades out before the next one (multi-page clips). fn(at) must return its end time. */
  function page(at, fn, { hold = 1.2, out = true } = {}) {
    const prev = cur, g = mk('g', {}, root);
    cur = g;
    const end = fn(at);
    cur = prev;
    if (!out) return end;
    tween(g, end + hold, .45, { o: 1 }, { o: 0 });
    return end + hold + .5;
  }

  /* =====================================================================================
     FREE SCENES — layouts that are not before→after: flow, diagram, showcase, shots (+ place, connect, caption)
     Guide: references/scenes.md
     ===================================================================================== */
  function measure(str, size, weight = 700) {
    const t = mk('text', { 'font-size': size, 'font-weight': weight, 'font-family': FONT }, svg);
    t.textContent = str; const w = t.getBBox().width; t.remove(); return w;
  }
  /* place: put a drawing so its box (default the ±200 × ±185 drawing box = [400, 370]) fits w × h px at (x, y) */
  function place(fn, { x = W / 2, y = H / 2, w = W - 120, h, box = [400, 370], at = 0, ts = 1, filter = 'glow' } = {}) {
    return art(fn, { x, y, s: Math.min(w / box[0], (h ?? w) / box[1]), at, ts, filter });
  }
  /* arrow on the stage (clip time). Returns { end, mid, ang } */
  function arrowS(x1, y1, x2, y2, o = {}) {
    const at = o.at || 0; let r;
    art(p => { r = kit.connect(p, x1, y1, x2, y2, Object.assign({}, o, { at: 0 })); }, { x: 0, y: 0, s: 1, at, filter: o.filter === undefined ? 'glow' : o.filter });
    return { end: at + r.end, mid: r.mid, ang: r.ang };
  }
  const connect = (x1, y1, x2, y2, o) => arrowS(x1, y1, x2, y2, o).end;
  /* caption: grey Thai line under the picture, above TikTok's bottom bar */
  function caption(str, { y = H - 300, at = 0, size = 46 } = {}) {
    return text(str, { y, size, weight: 600, color: C.soft, glow: false, at, rise: 14, maxW: W - 120 });
  }

  /* flow: steps joined by arrows that draw themselves (how-to, process, recipe, funnel).
     item = { icon, label, sub } (icon = icon name · pair name · kit icon · p => {…}).
     dir: 'zigzag' (9:16 default) · 'down' (icons in a column) · 'right' (16:9 / 1:1 default). Returns end time. */
  function flow(list, { top = 340, bottom = H, at = .9, dir, numbers = true, connector, bend, gap = .12, ts = 1, labelSize } = {}) {
    const n = list.length, N = [];
    dir = dir || (W > H ? 'right' : 'zigzag');
    if (dir === 'right') {
      const cw = W / n, area = bottom - top, s = Math.min((cw - 110) / 400, area * .42 / 370), ls = labelSize || clamp(cw * .1, 28, 56), cy = top + area * .42;
      list.forEach((it, i) => N.push({ x: (i + .5) * cw, y: cy, s, ls, anchor: 'middle', tx: (i + .5) * cw, ty: cy + 185 * s + ls * 1.5, maxW: cw - 24 }));
    } else if (dir === 'down') {
      const rh = (bottom - top) / n, s = Math.min(rh * .56 / 370, 250 / 400), ix = 70 + 200 * s, tx = ix + 200 * s + 56, ls = labelSize || clamp(rh * .16, 34, 64);
      list.forEach((it, i) => { const cy = top + (i + .5) * rh; N.push({ x: ix, y: cy, s, ls, anchor: 'start', tx, ty: cy, maxW: W - tx - 50 }); });
    } else {
      const rh = (bottom - top) / n, s = Math.min(rh * .6 / 370, W * .34 / 400), ls = labelSize || clamp(rh * .15, 34, 60);
      list.forEach((it, i) => {
        const L = i % 2 === 0, cy = top + (i + .5) * rh;
        N.push({ x: L ? W * .28 : W * .72, y: cy, s, ls, anchor: L ? 'start' : 'end', tx: L ? W * .52 : W * .48, ty: cy, maxW: W * .48 - 50 });
      });
    }
    const style = connector || (dir === 'zigzag' ? 'curve' : 'straight');
    let t = at;
    list.forEach((it, i) => {
      const P = N[i];
      if (i > 0) {
        const Q = N[i - 1], box = g => (x, y) => Math.abs(x - g.x) < 185 * g.s + 4 && Math.abs(y - g.y) < 172 * g.s + 4;
        t = arrowS(Q.x, Q.y, P.x, P.y, { style, bend: bend ?? (dir === 'zigzag' ? (i % 2 ? .1 : -.1) : undefined), clip1: box(Q), clip2: box(P), gap: 10, at: t - .1, d: .5, stroke: C.soft, hs: 18 }).end;
      }
      const a = art(single(it.icon || it.pair || it.draw), { x: P.x, y: P.y, s: P.s, at: t, ts });
      if (numbers) art(p => kit.badge(p, { r: 28, n: i + 1 }), { x: P.x - 175 * P.s, y: P.y - 165 * P.s, s: Math.max(.8, Math.min(1.2, P.s * 2.2)), at: t + .05 });
      const ls = P.ls, mid = P.anchor === 'middle';
      if (it.label) text(it.label, { x: P.tx, y: mid ? P.ty : (it.sub ? P.ty - ls * .15 : P.ty + ls * .35), size: ls, anchor: P.anchor, maxW: P.maxW, at: t + .15, rise: 14 });
      if (it.sub) text(it.sub, { x: P.tx, y: mid ? P.ty + ls * 1.15 : P.ty + ls * .95, size: ls * .62, weight: 500, color: C.sub, anchor: P.anchor, glow: false, maxW: P.maxW, at: t + .3, rise: 10 });
      pulse(a.g, a.end + .05);
      t = Math.max(a.end, t + .6) + gap;
    });
    return t;
  }

  /* diagram: nodes placed anywhere + arrows between them; the graph grows node by node (how it works, system, org chart, mind map).
     nodes = { key: { x, y, icon | draw | box: 'text' | dot: true, label, scale, size } } — x, y ≤ 1 are fractions of the area, > 1 are px.
     edges = [[from, to, { label, style, bend, dash, both, head, via }]]. Returns end time. */
  function diagram({ nodes, edges = [] }, { top = 340, bottom = H, at = .9, size, gap = .05, ts = 1, boxSize = 40, labelSize = 36, edge: eo = {} } = {}) {
    const keys = Object.keys(nodes), area = bottom - top, base = (size || Math.min(W, area) * .24) / 400, G = {};
    keys.forEach(k => {
      const N = nodes[k], x = N.x <= 1 ? N.x * W : N.x, y = N.y <= 1 ? top + N.y * area : N.y;
      if (N.box != null) {
        const fs = N.size || boxSize, lines = String(N.box).split('\n'), w = Math.max(...lines.map(l => measure(l, fs))) + fs * 1.5;
        const hh = fs * (1.3 * lines.length + .9) / 2;
        G[k] = { x, y, hw: w / 2, hh, l: -w / 2, r: w / 2, t: -hh, b: hh, fs, lines: lines.length };
      } else if (N.dot) G[k] = { x, y, l: -12, r: 12, t: -12, b: 12 };
      else { const s = base * (N.scale || 1); G[k] = { x, y, s, hw: 170 * s, hh: 176 * s, l: -170 * s, r: 170 * s, t: -176 * s, b: 176 * s + (N.label ? labelSize * 1.35 : 0) }; }
    });
    const inside = g => (x, y) => x > g.x + g.l - 4 && x < g.x + g.r + 4 && y > g.y + g.t - 4 && y < g.y + g.b + 4;
    const drawEdge = ([a, b, o = {}], t0) => {
      const A = G[a], B = G[b];
      if (!A || !B) throw new Error(`GL: diagram edge "${a}" → "${b}" names an unknown node. Nodes: ${keys.join(', ')}`);
      const r = arrowS(A.x, A.y, B.x, B.y, Object.assign({ stroke: C.soft, d: .45, hs: 16, gap: 12 }, eo, o, { at: t0, clip1: inside(A), clip2: inside(B) }));
      if (o.label) {
        let nx = -Math.sin(r.ang), ny = Math.cos(r.ang); if (ny > 0) { nx = -nx; ny = -ny; }
        const side = Math.abs(ny) < .35, fs = labelSize * .8;
        text(o.label, { x: r.mid[0] + (side ? 22 : nx * 26), y: r.mid[1] + (side ? fs * .35 : ny * 26), size: fs, weight: 600, color: C.sub, glow: false,
          anchor: side ? 'start' : 'middle', at: r.end - .2, rise: 8, maxW: W * .4 });
      }
      return r.end;
    };
    const drawNode = (k, t0) => {
      const N = nodes[k], g = G[k];
      if (N.box != null) {
        const a = art(p => p.box(0, 0, g.hw * 2, g.hh * 2, { rx: Math.min(24, g.hh * .45), fill: C.fill, sw: N.strong ? 3.6 : 2.6, dur: .4 }), { x: g.x, y: g.y, s: 1, at: t0 });
        text(N.box, { x: g.x, y: g.y + g.fs * .36 - (g.lines - 1) * g.fs * .65, size: g.fs, lh: 1.3, at: t0 + .2, rise: 8, maxW: g.hw * 2 - 16 });
        if (N.strong) pulse(a.g, a.end + .1, 'bloomS');
        return a.end + .1;
      }
      if (N.dot) {
        const a = art(p => p.dot(0, 0, 11, { dur: .2 }), { x: g.x, y: g.y, s: 1, at: t0 });
        if (N.label) text(N.label, { x: g.x + 26, y: g.y + labelSize * .35, size: labelSize, anchor: 'start', at: t0 + .1, rise: 8, maxW: W - g.x - 60 });
        return a.end;
      }
      const a = art(single(N.icon || N.pair || N.draw), { x: g.x, y: g.y, s: g.s, at: t0, ts });
      if (N.label) text(N.label, { x: g.x, y: g.y + g.hh + labelSize * .95, size: labelSize, at: t0 + .25, rise: 10, maxW: Math.max(g.hw * 2.6, 200) });
      pulse(a.g, a.end + .05, g.s < .5 ? 'bloomS' : 'bloom');
      return a.end;
    };
    let t = at; const shown = {};
    keys.forEach(k => {
      const es = edges.filter(e => (e[0] === k && shown[e[1]]) || (e[1] === k && shown[e[0]]));
      if (es.length) t = Math.max(...es.map((e, j) => drawEdge(e, t + j * .12))) - .1;
      t = drawNode(k, t) + gap;
      shown[k] = 1;
    });
    return t;
  }

  /* showcase: one product large in the middle, then callout lines point out its features one by one.
     it = { draw | icon | pair, box: [w, h] of the drawing (default [400, 370]), callouts: [{ x, y, text, sub, side }], caption }
     callout x, y are in the drawing's own coordinates (the same numbers you drew with). Returns end time. */
  function showcase(it, { top = 340, bottom = H - 380, at = .6, scale, stagger = .55, labelSize = 42, ts = 1 } = {}) {
    const bx = it.box || [400, 370], cy = (top + bottom) / 2, cx = W / 2;
    const s = scale || Math.min(W * .44 / bx[0], (bottom - top) * .9 / bx[1]);
    const fn = it.draw || single(it.icon || it.pair);
    const a = art(fn, { x: cx, y: cy, s, at, ts });
    let t = a.end + .2;
    const half = bx[0] / 2 * s, cs = (it.callouts || []).map(c => Object.assign({ px: cx + c.x * s, py: cy + c.y * s }, c));
    ['left', 'right'].forEach(side => {
      const L = cs.filter(c => (c.side || (c.x < 0 ? 'left' : 'right')) === side).sort((p, q) => p.py - q.py), sp = labelSize * 2.8;
      L.forEach((c, i) => { c.ly = clamp(c.py, top + labelSize, bottom); if (i && c.ly < L[i - 1].ly + sp) c.ly = L[i - 1].ly + sp; });
      for (let i = L.length - 1; i >= 0; i--) { const lim = i === L.length - 1 ? bottom : L[i + 1].ly - sp; if (L[i].ly > lim) L[i].ly = lim; }
      L.forEach(c => { c.left = side === 'left'; });
    });
    cs.forEach((c, i) => {
      const t0 = t + i * stagger, ex = c.left ? cx - half - 24 : cx + half + 24, sx = c.left ? 48 : W - 48;
      art(p => { kit.callout(p, { x: c.px, y: c.py, tx: ex, ty: c.ly, shelf: sx - ex }); }, { x: 0, y: 0, s: 1, at: t0 });
      const maxW = Math.abs(ex - sx) + 10;
      text(c.text, { x: sx, y: c.ly - 16, size: labelSize, anchor: c.left ? 'start' : 'end', maxW, at: t0 + .3, rise: 10 });
      if (c.sub) text(c.sub, { x: sx, y: c.ly + labelSize * .95, size: labelSize * .68, weight: 500, color: C.sub, glow: false, anchor: c.left ? 'start' : 'end', maxW, at: t0 + .4, rise: 8 });
    });
    t += cs.length * stagger + .25;
    if (it.caption) caption(it.caption, { y: bottom + 110, at: t - .2 });
    pulse(a.g, t);
    return t + .4;
  }

  /* shots: a story told frame by frame. Each shot draws, holds, then fades before the next one.
     shot = { draw | icon | pair, box: [w, h] (default [400, 370]), kicker, title, caption, hold, more(at, {x, y, s}) → end }.
     Progress dots at the bottom (dots: false to hide). Returns end time. */
  function shots(list, { at = .4, hold = 1.3, top = 200, bottom = H - 330, dots = true, ts = 1, titleSize = 92 } = {}) {
    const n = list.length;
    let t = at, marks = [];
    if (dots && n > 1) {
      const dg = mk('g', { filter: 'url(#glowS)' }, cur), y = bottom + 120;
      for (let i = 0; i < n; i++) {
        const x = W / 2 + (i - (n - 1) / 2) * 34;
        new Pen(dg, at).circle(x, y, 7, { sw: 2, stroke: C.mute, dur: .2 });
        marks.push(mk('circle', { cx: x, cy: y, r: 7, fill: C.ink }, dg));
      }
    }
    list.forEach((sh, i) => {
      const last = i === n - 1, start = t;
      t = page(t, t0 => {
        let y = top, tt = t0;
        if (sh.kicker) { y += 60; text(sh.kicker, { y, size: 40, ls: 8, color: C.kicker, at: tt, rise: 12 }); }
        if (sh.title) { y += titleSize * 1.05; text(sh.title, { y, size: titleSize, at: tt + .1, rise: 24, maxW: W - 100 }); }
        const y0 = (sh.kicker || sh.title) ? y + 70 : top, y1 = sh.caption ? bottom - 110 : bottom;
        const bx = sh.box || [400, 370], s = sh.scale || Math.min((W - 110) / bx[0], (y1 - y0) / bx[1]), cy = sh.y ?? (y0 + y1) / 2;
        const a = art(sh.draw || single(sh.icon || sh.pair), { x: W / 2, y: cy, s, at: tt + .2, ts });
        if (sh.caption) caption(sh.caption, { y: bottom - 20, at: tt + .55 });
        let end = a.end;
        if (sh.more) end = Math.max(end, sh.more(a.end, { x: W / 2, y: cy, s }) || 0);
        if (sh.glow !== false) pulse(a.g, a.end + .05);
        return end;
      }, { hold: sh.hold ?? hold, out: !last });
      if (marks[i]) { tween(marks[i], start, .25, { o: 0 }, { o: 1 }); if (!last) tween(marks[i], t - .5, .3, { o: 1 }, { o: 0 }); }
    });
    return t;
  }

  function finish({ hold = 1.6 } = {}) {
    window.DURATION = Math.round((lastEnd + hold) * 100) / 100;
    window.setT(window.DURATION);
    window.READY = true;
  }

  /* ---------------- time control ---------------- */
  window.setT = t => {
    for (const it of items) {
      if (it.type === 'draw') {
        const p = clamp((t - it.start) / it.dur), q = easeIO(p);
        it.e.setAttribute('stroke-dashoffset', 1 - q);
        it.e.setAttribute('stroke-opacity', p > 0 ? 1 : 0);
        if (it.hasFill) it.e.setAttribute('fill-opacity', clamp(q * 1.6));
      } else if (it.type === 'pulse') {
        const u = t - it.start;
        let o = 0;
        if (u > 0) o = u < .35 ? .9 * easeOut(u / .35) : .35 + .25 * Math.cos((u - .35) * 2.6) + .3 * Math.exp(-(u - .35) * 3);
        it.e.setAttribute('opacity', Math.max(0, o * it.strength));
      }
    }
    for (const [e, list] of tweens) {
      let tw = list[0];
      for (const x of list) if (x.start <= t) tw = x;
      const q = tw.ease(clamp((t - tw.start) / tw.dur));
      const v = (k, d) => { const a = tw.from[k] ?? tw.to[k] ?? d, b = tw.to[k] ?? a; return a + (b - a) * q; };
      const o = v('o', 1), s = v('s', 1), dx = v('dx', 0), dy = v('dy', 0);
      e.setAttribute('opacity', o.toFixed(3));
      e.setAttribute('transform', `translate(${dx + tw.cx} ${dy + tw.cy}) scale(${s}) translate(${-tw.cx} ${-tw.cy})`);
    }
  };

  /* =====================================================================================
     PARTS — reusable line drawings. Coordinates are local; (x, y) = centre unless noted.
     ===================================================================================== */
  const parts = {
    envelope(p, x, y, w, h, rot = 0, at = 0, d = .45) {
      const q = p.child({ transform: `translate(${x} ${y}) rotate(${rot})` });
      q.rect(-w / 2, -h / 2, w, h, { rx: 8, fill: C.fill, at, dur: d });
      q.poly([[-w / 2 + 6, -h / 2 + 6], [0, h * .08], [w / 2 - 6, -h / 2 + 6]], { at: at + d * .5, dur: d * .6 });
    },
    phone(p, x, y, at = 0) {
      const q = p.child({ transform: `translate(${x} ${y})` });
      q.rect(-98, -182, 196, 364, { rx: 32, fill: C.fill, at, dur: .5 });
      q.rect(-86, -170, 172, 340, { rx: 22, sw: 1.6, stroke: C.soft, at: at + .15, dur: .45 });
      q.line(-18, -158, 18, -158, { sw: 5, at: at + .3, dur: .2 });
    },
    appIcon(p, x, y, s, at, d, glyph) {
      p.rect(x - s / 2, y - s / 2, s, s, { rx: s * .26, sw: 2.2, fill: C.fill, at, dur: d });
      const o = { sw: 1.6, at: at + d * .5, dur: d * .5 };
      if (glyph === 0) p.circle(x, y, s * .2, o);
      if (glyph === 1) p.poly([[x - s * .22, y + s * .15], [x - s * .05, y - s * .12], [x + s * .08, y + s * .05], [x + s * .22, y - s * .15]], o);
      if (glyph === 2) p.rect(x - s * .2, y - s * .14, s * .4, s * .28, Object.assign({ rx: 2 }, o));
    },
    target(p, x, y, at = 0, d = .45, k = 1) {
      [100, 70, 42, 14].forEach((r, i) => p.circle(x, y, r * k, { fill: i === 0 ? C.fill : 'none', sw: i === 0 ? 3.2 : 2.6, at: at + i * .08, dur: d }));
    },
    arrow(p, tx, ty, ang, L, at, d, sw = 2.6) {          // archery arrow; tip at (tx, ty), flying along ang
      const dx = Math.cos(ang), dy = Math.sin(ang), ax = tx - dx * L, ay = ty - dy * L;
      const hd = (a, l) => [tx - Math.cos(ang + a) * l, ty - Math.sin(ang + a) * l];
      p.line(ax, ay, tx, ty, { sw, at, dur: d });
      p.poly([hd(.45, 15), [tx, ty], hd(-.45, 15)], { sw, at: at + d * .8, dur: d * .4 });
      for (let k = 0; k < 2; k++) {
        const bx = ax + dx * (8 + k * 11), by = ay + dy * (8 + k * 11);
        const f = s => [bx - Math.cos(ang + s) * 16, by - Math.sin(ang + s) * 16];
        p.poly([f(.6), [bx, by], f(-.6)], { sw: 2, at: at + d * .6, dur: d * .4 });
      }
    },
    link(p, x1, y1, x2, y2, at, d = .3, o = {}) {        // plain arrow line with a head at (x2, y2)
      const a = Math.atan2(y2 - y1, x2 - x1), h = o.head || 11;
      p.line(x1, y1, x2, y2, Object.assign({ sw: 2, at, dur: d }, o));
      p.poly([[x2 - Math.cos(a - .5) * h, y2 - Math.sin(a - .5) * h], [x2, y2], [x2 - Math.cos(a + .5) * h, y2 - Math.sin(a + .5) * h]],
        Object.assign({ sw: 2, at: at + d * .8, dur: d * .4 }, o));
    },
    folder(p, x, y, w, h, at = 0, d = .45, rot = 0) {
      const q = p.child({ transform: `translate(${x} ${y}) rotate(${rot})` }), l = -w / 2, t = -h / 2, r = w / 2, b = h / 2, tb = Math.max(10, h * .14);
      q.path(`M ${l} ${t + tb} L ${l} ${b - 8} Q ${l} ${b} ${l + 8} ${b} L ${r - 8} ${b} Q ${r} ${b} ${r} ${b - 8} L ${r} ${t + tb + 8} Q ${r} ${t + tb} ${r - 8} ${t + tb}
        L ${l + w * .45} ${t + tb} L ${l + w * .38} ${t} L ${l + 8} ${t} Q ${l} ${t} ${l} ${t + 8} Z`, { fill: C.fill, at, dur: d });
      q.line(l + 4, t + tb + h * .14, r - 4, t + tb + h * .14, { sw: 1.6, stroke: C.soft, at: at + d * .6, dur: d * .5 });
    },
    doc(p, x, y, w, h, rot = 0, at = 0, d = .4, lines = 3) {
      const q = p.child({ transform: `translate(${x} ${y}) rotate(${rot})` }), l = -w / 2, t = -h / 2, f = Math.min(w, h) * .22;
      q.shape([[l, t], [w / 2 - f, t], [w / 2, t + f], [w / 2, h / 2], [l, h / 2]], { fill: C.fill, at, dur: d });
      q.poly([[w / 2 - f, t], [w / 2 - f, t + f], [w / 2, t + f]], { sw: 2, at: at + d * .7, dur: d * .3 });
      for (let i = 0; i < lines; i++) { const yy = t + f + 10 + i * (h - f - 20) / Math.max(1, lines); q.line(l + w * .16, yy, w / 2 - w * .16 - (i === lines - 1 ? w * .2 : 0), yy, { sw: 1.6, at: at + d * .6 + i * .05, dur: d * .4 }); }
    },
    scribble(p, x, y, w, h, at, d = .25, o = {}) {        // handwriting squiggle from (x, y) rightwards
      const a = []; for (let i = 0; i <= Math.max(3, Math.round(w / 6)); i++) a.push([x + i * w / Math.max(3, Math.round(w / 6)), y + (i % 2 ? -1 : 1) * h * rr(.2, .5)]);
      p.poly(a, Object.assign({ sw: 1.5, at, dur: d }, o));
    },
    tangle(p, x, y, r, at, d = .9, turns = 6) {          // knotted yarn-ball of thoughts (one continuous line)
      const N = Math.round(120 * turns), f1 = rr(2.2, 2.9), f2 = rr(4.6, 6.1), ph = rr(0, 6.28), a = [];
      for (let i = 0; i <= N; i++) {
        const t = i / N * Math.PI * 2 * turns;
        a.push([+(x + r * (.58 * Math.cos(t) + .32 * Math.cos(f1 * t + ph) + .1 * Math.sin(f2 * t))).toFixed(1),
                +(y + r * .85 * (.58 * Math.sin(t * 1.07) + .32 * Math.sin(f1 * .93 * t + ph) + .1 * Math.cos(f2 * t))).toFixed(1)]);
      }
      p.poly(a, { sw: 1.8, at, dur: d });
    },
    bulb(p, x, y, sc = 1, at = 0, d = .6, rays = true) {
      const q = p.child({ transform: `translate(${x} ${y}) scale(${sc})` }, sc);
      q.path('M -22 40 C -22 18, -50 4, -50 -24 A 50 50 0 1 1 50 -24 C 50 4, 22 18, 22 40 Z', { fill: C.fill, at, dur: d });
      q.poly([[-12, 40], [-12, 8], [-6, -2], [0, 8], [6, -2], [12, 8], [12, 40]], { sw: 2.2, at: at + d * .6, dur: d * .5 });
      q.line(-20, 50, 20, 50, { at: at + d * .7, dur: .15 }); q.line(-18, 60, 18, 60, { at: at + d * .8, dur: .15 });
      q.path('M -10 68 Q 0 76 10 68', { at: at + d * .9, dur: .15 });
      if (rays) [-180, -150, -120, -90, -60, -30, 0].forEach((deg, i) => {
        const a = deg * Math.PI / 180;
        q.line(Math.cos(a) * 68, -24 + Math.sin(a) * 68, Math.cos(a) * 88, -24 + Math.sin(a) * 88, { sw: 3, at: at + d + i * .04, dur: .15 });
      });
    },
    clock(p, x, y, r, at = 0, d = .5, { h = 10, m = 10, fill = C.fill, ticks = true } = {}) {
      p.circle(x, y, r, { fill, at, dur: d });
      if (ticks) for (let i = 0; i < 12; i++) {
        const a = i * Math.PI / 6, big = i % 3 === 0;
        p.line(x + Math.sin(a) * r * (big ? .74 : .82), y - Math.cos(a) * r * (big ? .74 : .82), x + Math.sin(a) * r * .9, y - Math.cos(a) * r * .9,
          { sw: big ? 3 : 1.6, at: at + d * .5 + i * .02, dur: .12 });
      }
      const ha = (h % 12 + m / 60) * Math.PI / 6, ma = m * Math.PI / 30;
      p.line(x, y, x + Math.sin(ha) * r * .48, y - Math.cos(ha) * r * .48, { sw: 4, at: at + d * .9, dur: .2 });
      p.line(x, y, x + Math.sin(ma) * r * .7, y - Math.cos(ma) * r * .7, { sw: 3, at: at + d, dur: .2 });
      p.dot(x, y, Math.max(3, r * .06), { at: at + d * 1.1 });
    },
    check(p, x, y, s = 1, at = 0, d = .3, sw = 6) {
      p.poly([[x - 60 * s, y], [x - 20 * s, y + 42 * s], [x + 66 * s, y - 52 * s]], { sw, at, dur: d });
    },
    checkbox(p, x, y, s, at, d = .2, checked = false) {
      p.rect(x - s / 2, y - s / 2, s, s, { rx: 3, sw: 2, at, dur: d });
      if (checked) p.poly([[x - s * .3, y], [x - s * .05, y + s * .25], [x + s * .35, y - s * .3]], { sw: 2.4, at: at + d, dur: d * .6 });
    },
    star(p, x, y, r, at = 0, d = .4, o = {}) {
      const a = []; for (let i = 0; i < 10; i++) { const ang = -Math.PI / 2 + i * Math.PI / 5, m = i % 2 ? r * .45 : r; a.push([x + Math.cos(ang) * m, y + Math.sin(ang) * m]); }
      p.shape(a, Object.assign({ at, dur: d }, o));
    },
    bubble(p, x, y, w, h, at = 0, d = .35, flip = false) {       // speech bubble, (x, y) centre
      const l = x - w / 2, t = y - h / 2, r = x + w / 2, b = y + h / 2, rad = Math.min(14, h / 3), tx = flip ? r - w * .25 : l + w * .25, s = flip ? 1 : -1;
      p.path(`M ${l + rad} ${t} H ${r - rad} Q ${r} ${t} ${r} ${t + rad} V ${b - rad} Q ${r} ${b} ${r - rad} ${b} H ${tx + 10} L ${tx + s * 8} ${b + 14} L ${tx - 6} ${b}
        H ${l + rad} Q ${l} ${b} ${l} ${b - rad} V ${t + rad} Q ${l} ${t} ${l + rad} ${t} Z`, { fill: C.fill, sw: 2.2, at, dur: d });
    },
    laptop(p, x, y, w = 140, at = 0, d = .45) {          // (x, y) = middle of the base line
      const h = w * .66;
      p.rect(x - w / 2, y - h - 4, w, h, { rx: 6, fill: C.fill, at, dur: d });
      p.rect(x - w / 2 + 8, y - h + 4, w - 16, h - 16, { rx: 3, sw: 1.4, stroke: C.soft, at: at + d * .5, dur: d * .5 });
      p.path(`M ${x - w / 2 - 14} ${y + 8} L ${x - w / 2} ${y - 4} H ${x + w / 2} L ${x + w / 2 + 14} ${y + 8} Z`, { fill: C.fill, at: at + d * .7, dur: d * .5 });
    },
    tablet(p, x, y, w = 170, h = 240, at = 0, d = .5) {
      p.rect(x - w / 2, y - h / 2, w, h, { rx: 18, fill: C.fill, at, dur: d });
      p.rect(x - w / 2 + 12, y - h / 2 + 22, w - 24, h - 44, { rx: 4, sw: 1.6, stroke: C.soft, at: at + d * .5, dur: d * .5 });
      p.circle(x, y - h / 2 + 11, 3, { sw: 2, at: at + d, dur: .1 });
    },
    moon(p, x, y, r, at = 0, d = .4) {
      const q = p.child({ transform: `translate(${x} ${y}) rotate(-25)` });
      q.path(`M 0 ${-r} A ${r} ${r} 0 1 0 0 ${r} A ${r * .62} ${r} 0 0 1 0 ${-r} Z`, { fill: C.fill, at, dur: d });
    },
    zzz(p, x, y, at = 0, d = .45) {
      [[0, 0, 12], [20, -24, 16], [46, -54, 21]].forEach(([dx, dy, s], i) =>
        p.poly([[x + dx, y + dy], [x + dx + s, y + dy], [x + dx, y + dy + s], [x + dx + s, y + dy + s]], { sw: 2.4, at: at + i * d / 3, dur: d / 2 }));
    },
    paperStack(p, x, y, n, w, at = 0, d = .6) {         // isometric stack, (x, y) = bottom sheet centre
      for (let i = 0; i < n; i++) {
        const cx = x + rr(-4, 4), cy = y - i * 6, hw = w / 2, hh = w * .26;
        p.shape([[cx - hw, cy], [cx, cy + hh], [cx + hw, cy], [cx, cy - hh]], { fill: C.fill, sw: 1.8, at: at + i * d / n, dur: .16 });
      }
    },
    calendar(p, x, y, w, h, at = 0, d = .45, { cols = 7, rows = 5 } = {}) {   // returns the grid geometry for filling cells
      const l = x - w / 2, t = y - h / 2, hy = t + h * .2;
      p.rect(l, t, w, h, { rx: 10, fill: C.fill, at, dur: d });
      p.line(l, hy, l + w, hy, { sw: 2.4, at: at + d * .6, dur: .2 });
      const nr = cols > 4 ? 5 : 2, rw = Math.max(5, w * .022);
      for (let i = 0; i < nr; i++) p.rect(l + w * (nr === 5 ? .14 + i * .18 : .28 + i * .44) - rw / 2, t - rw * 1.7, rw, rw * 3.2, { rx: rw / 2, sw: 2, fill: C.fill, at: at + d * .5 + i * .03, dur: .15 });
      const cw = w / cols, ch = (h - h * .2) / rows;
      for (let i = 1; i < cols; i++) p.line(l + i * cw, hy, l + i * cw, t + h, { sw: 1.5, stroke: C.soft, at: at + d * .7 + i * .02, dur: .2 });
      for (let i = 1; i < rows; i++) p.line(l, hy + i * ch, l + w, hy + i * ch, { sw: 1.5, stroke: C.soft, at: at + d * .8 + i * .02, dur: .2 });
      return { l, hy, cw, ch };
    },
    wifi(p, x, y, s = 1, at = 0, d = .35) {
      [12, 24, 36].forEach((r, i) => { r *= s; const a1 = -Math.PI * .75, a2 = -Math.PI * .25;
        p.path(`M ${x + Math.cos(a1) * r} ${y + 14 * s + Math.sin(a1) * r} A ${r} ${r} 0 0 1 ${x + Math.cos(a2) * r} ${y + 14 * s + Math.sin(a2) * r}`, { sw: 3, at: at + i * d / 4, dur: d / 2 }); });
      p.dot(x, y + 14 * s, 3.5 * s, { at: at + d * .8 });
    },
    gamepad(p, x, y, s = 1, at = 0, d = .4) {
      const q = p.child({ transform: `translate(${x} ${y}) scale(${s})` }, s);
      q.path('M -30 -20 H 30 C 46 -20 52 -6 54 8 C 57 26 46 32 38 24 L 28 14 H -28 L -38 24 C -46 32 -57 26 -54 8 C -52 -6 -46 -20 -30 -20 Z', { fill: C.fill, at, dur: d });
      q.line(-34, -3, -18, -3, { sw: 2.4, at: at + d * .7, dur: .1 }); q.line(-26, -11, -26, 5, { sw: 2.4, at: at + d * .75, dur: .1 });
      q.circle(20, -8, 4, { sw: 2, at: at + d * .8, dur: .1 }); q.circle(31, 1, 4, { sw: 2, at: at + d * .85, dur: .1 });
    },
    tv(p, x, y, s = 1, at = 0, d = .4) {
      const q = p.child({ transform: `translate(${x} ${y}) scale(${s})` }, s);
      q.poly([[-14, -38], [0, -24], [14, -38]], { sw: 2.2, at, dur: d * .4 });
      q.rect(-38, -24, 76, 52, { rx: 7, fill: C.fill, at: at + d * .2, dur: d * .6 });
      q.rect(-30, -16, 50, 36, { rx: 3, sw: 1.6, stroke: C.soft, at: at + d * .6, dur: d * .3 });
      q.circle(28, -6, 2.5, { sw: 1.6, at: at + d * .8, dur: .1 }); q.circle(28, 6, 2.5, { sw: 1.6, at: at + d * .85, dur: .1 });
    },
    globe(p, x, y, r = 28, at = 0, d = .4) {
      p.circle(x, y, r, { fill: C.fill, at, dur: d });
      p.ellipse(x, y, r * .42, r, { sw: 2, at: at + d * .5, dur: d * .5 });
      p.line(x - r, y, x + r, y, { sw: 2, at: at + d * .6, dur: d * .3 });
      p.path(`M ${x - r * .86} ${y - r * .5} Q ${x} ${y - r * .3} ${x + r * .86} ${y - r * .5}`, { sw: 1.6, at: at + d * .7, dur: d * .3 });
      p.path(`M ${x - r * .86} ${y + r * .5} Q ${x} ${y + r * .7} ${x + r * .86} ${y + r * .5}`, { sw: 1.6, at: at + d * .75, dur: d * .3 });
    },
    bell(p, x, y, s = 1, at = 0, d = .4) {
      const q = p.child({ transform: `translate(${x} ${y}) scale(${s})` }, s);
      q.path('M -24 16 C -18 10 -19 0 -19 -8 A 19 19 0 0 1 19 -8 C 19 0 18 10 24 16 Z', { fill: C.fill, at, dur: d });
      q.path('M -7 22 Q 0 29 7 22', { sw: 2.4, at: at + d * .8, dur: .12 });
      q.line(0, -27, 0, -31, { sw: 3, at: at + d * .85, dur: .08 });
    },
    wallet(p, x, y, w, h, at = 0, d = .5) {
      p.rect(x - w / 2, y - h / 2, w, h, { rx: 22, fill: C.fill, at, dur: d });
      p.rect(x - w / 2 + 12, y - h / 2 + 12, w - 24, h - 24, { rx: 14, sw: 1.4, stroke: C.mute, at: at + d * .5, dur: d * .5 });
    },
  };

  /* =====================================================================================
     KIT — the hard-to-draw pieces (people, hands, connecting arrows, accents), drawn once and
     tuned by eye so they come out the same every time. Signature: GL.kit.name(p, { options }).
     Catalogue: references/kit.md + kit.jpg
     ===================================================================================== */
  let probe;
  function sample(d, step = 3) {                       // SVG path → dense point list
    if (!probe) probe = mk('path', { fill: 'none', stroke: 'none' }, svg.querySelector('defs'));
    probe.setAttribute('d', d);
    const L = probe.getTotalLength(), n = Math.max(2, Math.ceil(L / step)), a = [];
    for (let i = 0; i <= n; i++) { const q = probe.getPointAtLength(L * i / n); a.push([q.x, q.y]); }
    return a;
  }
  const seglen = (a, i) => Math.hypot(a[i][0] - a[i - 1][0], a[i][1] - a[i - 1][1]);
  const plen = a => { let L = 0; for (let i = 1; i < a.length; i++) L += seglen(a, i); return L; };
  function cutStart(a, g) {
    if (g <= 0) return a.slice();
    let acc = 0;
    for (let i = 1; i < a.length; i++) {
      const sl = seglen(a, i);
      if (acc + sl >= g) { const f = (g - acc) / sl; return [[a[i - 1][0] + (a[i][0] - a[i - 1][0]) * f, a[i - 1][1] + (a[i][1] - a[i - 1][1]) * f], ...a.slice(i)]; }
      acc += sl;
    }
    return a.slice(-2);
  }
  const trim = (a, g1, g2) => cutStart(cutStart(a, g1).reverse(), g2).reverse();
  function roundPath(P, r) {                           // polyline with rounded corners
    let d = `M ${P[0][0]} ${P[0][1]}`;
    for (let i = 1; i < P.length - 1; i++) {
      const [ax, ay] = P[i - 1], [bx, by] = P[i], [cx, cy] = P[i + 1];
      const l1 = Math.hypot(bx - ax, by - ay) || 1, l2 = Math.hypot(cx - bx, cy - by) || 1, q = Math.min(r, l1 / 2, l2 / 2);
      d += ` L ${bx - (bx - ax) / l1 * q} ${by - (by - ay) / l1 * q} Q ${bx} ${by} ${bx + (cx - bx) / l2 * q} ${by + (cy - by) / l2 * q}`;
    }
    const z = P[P.length - 1];
    return d + ` L ${z[0]} ${z[1]}`;
  }
  /* route: point list from (x1,y1) to (x2,y2). style straight | curve | swoosh | elbow | loop.
     bend = how far it bows, as a fraction of its length: + bows to the left of travel (up on a → arrow), − to the right;
     via = elbow route hv | vh | hvh | vhv */
  function route(x1, y1, x2, y2, { style = 'straight', bend, via, r = 26 } = {}) {
    const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy) || 1, ex = dx / L, ey = dy / L, nx = -ey, ny = ex;
    if (style === 'curve') { const b = -(bend ?? .14) * L * 2; return sample(`M ${x1} ${y1} Q ${(x1 + x2) / 2 + nx * b} ${(y1 + y2) / 2 + ny * b} ${x2} ${y2}`); }
    if (style === 'swoosh') { const b = -(bend ?? .16) * L; return sample(`M ${x1} ${y1} C ${x1 + dx * .35 + nx * b} ${y1 + dy * .35 + ny * b} ${x1 + dx * .65 - nx * b} ${y1 + dy * .65 - ny * b} ${x2} ${y2}`); }
    if (style === 'elbow') {
      const rt = via || (Math.abs(dx) >= Math.abs(dy) ? 'hvh' : 'vhv');
      let P;
      if (rt === 'hv') P = [[x1, y1], [x2, y1], [x2, y2]];
      else if (rt === 'vh') P = [[x1, y1], [x1, y2], [x2, y2]];
      else if (rt === 'hvh') { const m = (x1 + x2) / 2; P = [[x1, y1], [m, y1], [m, y2], [x2, y2]]; }
      else { const m = (y1 + y2) / 2; P = [[x1, y1], [x1, m], [x2, m], [x2, y2]]; }
      return sample(roundPath(P, r));
    }
    if (style === 'loop') {                            // a single loop-de-loop in the middle
      const s0 = .36, D = .28, lr = Math.max(L * D / (2 * Math.PI) * 1.75, 12), side = (bend ?? 1) >= 0 ? 1 : -1, a = [];
      for (let i = 0; i <= 260; i++) {
        const s = i / 260; let u = s * L, v = 0;
        if (s > s0 && s < s0 + D) { const th = 2 * Math.PI * (s - s0) / D; u += lr * Math.sin(th); v = -side * lr * (1 - Math.cos(th)); }
        a.push([x1 + ex * u + nx * v, y1 + ey * u + ny * v]);
      }
      return a;
    }
    return sample(`M ${x1} ${y1} L ${x2} ${y2}`, 6);
  }
  function dashes(a, on, off) {
    const out = []; let cur = [a[0]], acc = 0, isOn = true, lim = on;
    for (let i = 1; i < a.length; i++) {
      let [px, py] = a[i - 1]; const [qx, qy] = a[i]; let sl = Math.hypot(qx - px, qy - py);
      while (acc + sl >= lim) {
        const f = (lim - acc) / sl, mx = px + (qx - px) * f, my = py + (qy - py) * f;
        if (isOn) { cur.push([mx, my]); out.push(cur); }
        cur = [[mx, my]]; sl -= lim - acc; px = mx; py = my; acc = 0; isOn = !isOn; lim = isOn ? on : off;
      }
      acc += sl; if (isOn) cur.push([qx, qy]);
    }
    if (isOn && cur.length > 1) out.push(cur);
    return out;
  }
  function arrowHead(p, a, h, kind, o) {               // head on the last point of a
    const tip = a[a.length - 1], bk = cutStart([...a].reverse(), h * .9)[0];
    const ang = Math.atan2(tip[1] - bk[1], tip[0] - bk[0]), w = kind === 'solid' ? .45 : .52;
    const l = [tip[0] - Math.cos(ang - w) * h, tip[1] - Math.sin(ang - w) * h], r = [tip[0] - Math.cos(ang + w) * h, tip[1] - Math.sin(ang + w) * h];
    if (kind === 'solid') p.shape([l, tip, r], Object.assign({}, o, { fill: o.stroke || C.ink }));
    else p.poly([l, tip, r], o);
  }
  const iso = (X, Y, Z) => [(X - Z) * .866, (X + Z) * .5 - Y];   // isometric: X → right-down, Z → left-down, Y → up

  const kit = {
    /* arrow from (x1,y1) to (x2,y2) that draws itself. Returns { end, mid, ang, pts } (end = local seconds).
       gap / gap1 / gap2 = px cut off the ends; clip1 / clip2 = (x, y) => true while inside a shape (the arrow starts/stops at its edge) */
    connect(p, x1, y1, x2, y2, o = {}) {
      const { head = 'open', both = false, gap = 0, dash = false, at = 0, d = .45, sw = 2.6, stroke = C.ink, hs = 16 } = o;
      let a = route(x1, y1, x2, y2, o);
      if (o.clip1) { let i = 0; while (i < a.length - 2 && o.clip1(a[i][0], a[i][1])) i++; a = a.slice(i); }     // start outside shape 1
      if (o.clip2) { let j = a.length - 1; while (j > 1 && o.clip2(a[j][0], a[j][1])) j--; a = a.slice(0, j + 1); } // stop at shape 2
      a = trim(a, o.gap1 ?? gap, o.gap2 ?? gap);
      const so = { sw, stroke };
      if (dash) {
        const on = dash === true ? 14 : dash, ds = dashes(a, on, on * .75);
        ds.forEach((seg, i) => p.poly(seg, Object.assign({ at: at + d * i / ds.length, dur: Math.max(.04, d / ds.length) }, so)));
      } else p.poly(a, Object.assign({ at, dur: d }, so));
      if (head !== 'none') {
        arrowHead(p, a, hs, head, Object.assign({ at: at + d * .88, dur: .16 }, so));
        if (both) arrowHead(p, [...a].reverse(), hs, head, Object.assign({ at, dur: .16 }, so));
      }
      const i = Math.floor(a.length / 2), m = a[i], m2 = a[Math.min(a.length - 1, i + 1)];
      return { end: at + d + .1, mid: m, ang: Math.atan2(m2[1] - m[1], m2[0] - m[0]), pts: a };
    },
    /* ring of n arrows chasing each other (repeat / cycle / loop process) */
    cycle(p, { x = 0, y = 0, r = 110, n = 3, at = 0, d = .9, sw = 3, hs = 18 } = {}) {
      const g = Math.min(.5, 1.6 / n);                 // gap between arrows (radians)
      for (let i = 0; i < n; i++) {
        const a0 = -Math.PI / 2 + i * 2 * Math.PI / n + g / 2, a1 = a0 + 2 * Math.PI / n - g, a = [];
        for (let k = 0; k <= 60; k++) { const t = a0 + (a1 - a0) * k / 60; a.push([x + Math.cos(t) * r, y + Math.sin(t) * r]); }
        const t0 = at + i * d / n * .7;
        p.poly(a, { sw, at: t0, dur: d / n });
        arrowHead(p, a, hs, 'open', { sw, at: t0 + d / n * .85, dur: .15 });
      }
    },
    /* numbered circle for steps (n can be a number or a short string) */
    badge(p, { x = 0, y = 0, r = 30, n = 1, at = 0, d = .3, fill = C.fill } = {}) {
      p.circle(x, y, r, { fill, sw: 2.6, at, dur: d });
      p.text(String(n), x, y + r * .4, { size: r * 1.12, at: at + d * .6, dur: .2 });
    },
    /* mouse pointer, tip at (x, y). click: true adds three tap lines */
    cursor(p, { x = 0, y = 0, size = 64, at = 0, d = .35, click = false } = {}) {
      const s = size / 40, q = p.child({ transform: `translate(${x} ${y}) scale(${s})` }, s);
      q.path('M 0 0 L 0 34 L 8.5 26.5 L 14 39 L 20.5 36 L 15 23.5 L 26 23.5 Z', { fill: C.fill, sw: 2.4, at, dur: d });
      if (click) [[-14, -2, -24, -6], [-4, -12, -8, -23], [6, -10, 12, -20]].forEach(([a, b, c, e], i) => q.line(a, b, c, e, { sw: 2.4, at: at + d + i * .04, dur: .12 }));
    },
    /* four-point sparkle (new / shiny / highlight) */
    sparkle(p, { x = 0, y = 0, r = 30, at = 0, d = .3, fill = C.fill } = {}) {
      const c = r * .16;
      p.path(`M ${x} ${y - r} Q ${x + c} ${y - c} ${x + r} ${y} Q ${x + c} ${y + c} ${x} ${y + r} Q ${x - c} ${y + c} ${x - r} ${y} Q ${x - c} ${y - c} ${x} ${y - r} Z`, { fill, sw: 2.4, at, dur: d });
    },
    /* emphasis rays around a point. from / spread in degrees (0 = right, -90 = up) */
    burst(p, { x = 0, y = 0, r1 = 46, r2 = 74, n = 8, from = -90, spread = 360, at = 0, d = .3, sw = 3 } = {}) {
      const full = spread >= 360;
      for (let i = 0; i < n; i++) {
        const a = (from + (full ? i * 360 / n : (n === 1 ? 0 : -spread / 2 + i * spread / (n - 1)))) * Math.PI / 180;
        p.line(x + Math.cos(a) * r1, y + Math.sin(a) * r1, x + Math.cos(a) * r2, y + Math.sin(a) * r2, { sw, at: at + i * d / n * .6, dur: d * .5 });
      }
    },
    /* rings spreading from a point (tap, signal, sound) */
    ripple(p, { x = 0, y = 0, r = 30, n = 2, at = 0, d = .4, stroke = C.soft } = {}) {
      for (let i = 0; i < n; i++) p.circle(x, y, r * (1 + i * .75), { sw: 2, stroke, at: at + i * d * .35, dur: d * .6 });
    },
    /* callout leader: dot at the feature (x, y) → line out to (tx, ty) → short shelf. Returns where the label goes. */
    callout(p, { x, y, tx, ty, shelf = 0, at = 0, d = .4, stroke = C.soft } = {}) {
      p.dot(x, y, 6, { at });
      const end = [tx + shelf, ty];
      p.poly([[x, y], [tx, ty], end], { sw: 2.2, stroke, at: at + .08, dur: d });
      return { x: end[0], y: ty };
    },
    /* isometric box. (x, y) = centre of its base on the floor. w along X (right-down), dp along Z (left-down), h up */
    isoBox(p, { x = 0, y = 0, w = 160, dp = 160, h = 110, at = 0, d = .5, tape = false } = {}) {
      const P = (X, Y, Z) => { const [a, b] = iso(X, Y, Z); return [x + a, y + b]; }, hw = w / 2, hd = dp / 2;
      p.shape([P(-hw, 0, hd), P(hw, 0, hd), P(hw, h, hd), P(-hw, h, hd)], { fill: C.fill, at, dur: d * .5 });
      p.shape([P(hw, 0, hd), P(hw, 0, -hd), P(hw, h, -hd), P(hw, h, hd)], { fill: C.fill, at: at + d * .2, dur: d * .5 });
      p.shape([P(-hw, h, -hd), P(hw, h, -hd), P(hw, h, hd), P(-hw, h, hd)], { fill: C.fill, at: at + d * .45, dur: d * .5 });
      if (tape) { p.poly([P(0, h, -hd), P(0, h, hd), P(0, h * .55, hd)], { sw: 2, stroke: C.soft, at: at + d * .85, dur: d * .3 }); }
    },
    /* table seen flat from the front. (x, y) = floor point under its centre */
    table(p, { x = 0, y = 0, w = 300, h = 150, at = 0, d = .45 } = {}) {
      p.rect(x - w / 2, y - h - 12, w, 12, { rx: 3, fill: C.fill, at, dur: d });
      p.line(x - w / 2 + 14, y - h, x - w / 2 + 14, y, { at: at + d * .5, dur: d * .5 });
      p.line(x + w / 2 - 14, y - h, x + w / 2 - 14, y, { at: at + d * .6, dur: d * .5 });
    },
  };

  /* ---- people: plain pictogram figures (no face, no clothes) built from tubes ---- */
  const ARM_DOWN = s => [[s * 31, -90], [s * 47, -38], [s * 53, 14]];
  const LEGS = [[[-15, 10], [-17, 90], [-18, 165]], [[15, 10], [17, 90], [18, 165]]];
  const POSES = {
    stand: { legs: LEGS, back: [ARM_DOWN(-1), ARM_DOWN(1)] },
    wave:  { legs: LEGS, back: [ARM_DOWN(-1)], front: [[[31, -90], [78, -98], [92, -154]]] },
    cheer: { legs: LEGS, back: [[[-31, -90], [-64, -128], [-80, -172]], [[31, -90], [64, -128], [80, -172]]] },
    think: { legs: LEGS, back: [ARM_DOWN(-1)], front: [[[31, -90], [58, -40], [14, -106]]] },
    shrug: { legs: LEGS, back: [[[-31, -90], [-52, -44], [-96, -66]], [[31, -90], [52, -44], [96, -66]]] },
    walk:  { side: 1, legs: [[[0, 10], [-20, 88], [-46, 160]], [[0, 10], [22, 86], [30, 165]]], back: [[[0, -90], [-20, -44], [-32, 0]]], front: [[[0, -90], [20, -44], [40, -6]]] },
    run:   { side: 1, lean: 12, legs: [[[0, 10], [-30, 86], [-74, 130]], [[0, 10], [50, 50], [40, 124]]], back: [[[0, -90], [-32, -58], [-58, -82]]], front: [[[0, -90], [28, -50], [58, -72]]] },
    sit:   { side: 1, ground: 113, chair: 1, legs: [[[0, 10], [72, 12], [76, 100]]], back: [], front: [[[0, -90], [16, -36], [66, -42]]] },
  };
  function pointPose(deg) {
    const a = deg * Math.PI / 180, c = Math.cos(a), s = Math.sin(a), e = [31 + c * 48, -90 + s * 48];
    return { legs: LEGS, back: [ARM_DOWN(-1)], front: [[[31, -90], e, [e[0] + c * 50, e[1] + s * 50]]] };
  }
  const TORSO_F = 'M -20 -106 L 20 -106 Q 42 -106 42 -84 L 33 12 Q 32 22 23 22 L -23 22 Q -32 22 -33 12 L -42 -84 Q -42 -106 -20 -106 Z';
  const TORSO_S = 'M -10 -106 L 10 -106 Q 27 -106 27 -88 L 21 12 Q 20 22 11 22 L -11 22 Q -20 22 -21 12 L -27 -88 Q -27 -106 -10 -106 Z';
  /* person: (x, y) = the floor point under the feet; h = height in px; face: 1 right / -1 left (side poses);
     pose: stand wave cheer think shrug point present walk run sit · point/present take dir (degrees, 0 = right, -90 = up) */
  kit.person = function (p, { x = 0, y = 0, h = 300, pose = 'stand', face = 1, at = 0, d = .9, dir } = {}) {
    let P = typeof pose === 'object' ? pose : POSES[pose];
    if (pose === 'point' || pose === 'present') P = pointPose(dir ?? (pose === 'present' ? -38 : -6));
    if (!P) throw new Error(`GL: unknown person pose "${pose}". Use ${Object.keys(POSES).concat('point', 'present').join(', ')}.`);
    const s = h / 350, k = d / .9, gy = P.ground || 178;
    const q = p.child({ transform: `translate(${x} ${y}) scale(${s * face} ${s}) translate(0 ${-gy})` }, s);
    const T = (pen, pts_, w, t, du, o = {}) => pen.tube(pts_, w, Object.assign({ at: at + t * k, dur: du * k }, o));
    if (P.chair) {
      q.rect(-46, -70, 11, 106, { rx: 5, fill: C.fill, at, dur: .3 * k });
      q.line(-38, 36, -38, gy, { at: at + .1 * k, dur: .2 * k }); q.line(62, 36, 62, gy, { at: at + .12 * k, dur: .2 * k });
      q.rect(-40, 26, 110, 11, { rx: 4, fill: C.fill, at: at + .05 * k, dur: .25 * k });
    }
    const dim = P.side ? { stroke: C.soft } : {};
    P.legs.forEach((l, i) => T(q, l, 26, .04 + i * .07, .32, i === 0 && P.legs.length > 1 ? dim : {}));
    const up = P.lean ? q.child({ transform: `rotate(${P.lean} 0 10)` }) : q;
    (P.back || []).forEach((l, i) => T(up, l, 21, .14 + i * .05, .3, dim));
    up.path(P.side ? TORSO_S : TORSO_F, { fill: C.fill, at: at + .22 * k, dur: .36 * k });
    up.circle(P.side ? 5 : 0, -142, 28, { fill: C.fill, at: at + .38 * k, dur: .3 * k });
    (P.front || []).forEach((l, i) => T(up, l, 21, .5 + i * .05, .3));
  };
  /* bust: head + shoulders (avatar, customer, user). (x, y) = centre; size = height */
  kit.bust = function (p, { x = 0, y = 0, size = 200, at = 0, d = .6 } = {}) {
    const s = size / 330, q = p.child({ transform: `translate(${x} ${y}) scale(${s})` }, s);
    q.path('M -142 165 L -142 112 Q -142 22 -46 22 L 46 22 Q 142 22 142 112 L 142 165 Z', { fill: C.fill, at, dur: d * .6 });
    q.circle(0, -88, 74, { fill: C.fill, at: at + d * .35, dur: d * .6 });
  };
  /* team: three busts, two behind (group, customers, community). (x, y) = centre; size = width */
  kit.team = function (p, { x = 0, y = 0, size = 360, at = 0, d = .8 } = {}) {
    const s = size / 420, q = p.child({ transform: `translate(${x} ${y}) scale(${s})` }, s);
    kit.bust(q, { x: -125, y: -26, size: 230, at, d: d * .6 });
    kit.bust(q, { x: 125, y: -26, size: 230, at: at + d * .12, d: d * .6 });
    kit.bust(q, { x: 0, y: 26, size: 300, at: at + d * .3, d: d * .7 });
  };

  /* ---- hands: flat icon hands with a shirt cuff. (x, y) = centre, size = height ---- */
  const HANDS = {
    point(T, q, t) {                                   // index finger up (back of the hand)
      T([[-26, 40], [-26, -122]], 36, 0, .35);
      T([[6, 52], [6, -12]], 32, .12, .2); T([[36, 56], [36, -4]], 30, .16, .2); T([[62, 62], [62, 10]], 26, .2, .2);
      q.rect(-46, 14, 124, 128, { rx: 38, fill: C.fill, at: t(.26), dur: t(.35, 1) });
      T([[-28, 112], [-60, 56]], 30, .48, .22);
      q.rect(-40, 128, 104, 52, { rx: 10, fill: C.fill, at: t(.58), dur: t(.25, 1) });
    },
    thumb(T, q, t) {                                   // thumbs up
      T([[-20, 30], [-26, -108]], 44, 0, .3);
      q.rect(-60, -26, 104, 150, { rx: 32, fill: C.fill, at: t(.2), dur: t(.35, 1) });
      [-8, 26, 60, 94].forEach((yy, i) => T([[-6, yy], [62 - i * 4, yy]], 32, .36 + i * .06, .2));
      q.rect(-62, 116, 92, 64, { rx: 10, fill: C.fill, at: t(.66), dur: t(.25, 1) });
    },
    open(T, q, t) {                                    // open palm: hi / stop / five
      T([[-62, 96], [-94, 42], [-106, -12]], 32, 0, .3);
      T([[-34, 30], [-46, -128]], 30, .06, .3); T([[-8, 20], [-8, -158]], 31, .1, .3);
      T([[18, 22], [24, -142]], 30, .14, .3); T([[42, 36], [58, -98]], 26, .18, .3);
      q.rect(-58, -24, 120, 154, { rx: 42, fill: C.fill, at: t(.36), dur: t(.35, 1) });
      q.path('M -28 76 Q 2 92 32 70', { sw: 1.6, stroke: C.soft, at: t(.6), dur: t(.2, 1) });
      q.rect(-48, 122, 100, 58, { rx: 10, fill: C.fill, at: t(.62), dur: t(.25, 1) });
    },
  };
  kit.hand = function (p, { x = 0, y = 0, size = 240, pose = 'point', rot = 0, flip = false, at = 0, d = .8 } = {}) {
    if (!HANDS[pose]) throw new Error(`GL: unknown hand pose "${pose}". Use ${Object.keys(HANDS).join(', ')} (or kit.tap / kit.holdPhone).`);
    const s = size / 360, k = d / .8, q = p.child({ transform: `translate(${x} ${y}) rotate(${rot}) scale(${flip ? -s : s} ${s})` }, s);
    const t = (v, isDur) => isDur ? v * k : at + v * k;
    HANDS[pose]((pts_, w, a, du) => q.tube(pts_, w, { at: t(a), dur: t(du, 1), sw: 2.6 }), q, t);
  };
  /* tap: pointing hand whose fingertip touches (x, y), with rings */
  kit.tap = function (p, { x = 0, y = 0, size = 240, at = 0, d = .8, rings = true } = {}) {
    const s = size / 360;
    if (rings) kit.ripple(p, { x, y, r: 30 * s / .67, n: 2, at: at + d * .7, d: .4 });
    kit.hand(p, { x: x + 26 * s, y: y + 140 * s, size, pose: 'point', at, d });
  };
  /* phone held in a hand (thumb over the screen, fingertips round the right edge). (x, y) = centre, size = height.
     screen(p, { x, y, w, h, at }) draws the screen content (in the same pen space), under the thumb. */
  kit.holdPhone = function (p, { x = 0, y = 0, size = 360, at = 0, d = 1, screen } = {}) {
    const s = size / 400, k = d, q = p.child({ transform: `translate(${x} ${y}) scale(${s})` }, s), t = v => at + v * k;
    q.rect(-94, 34, 188, 140, { rx: 48, fill: C.fill, at: t(0), dur: .35 * k });
    q.rect(-82, -198, 164, 300, { rx: 26, fill: C.fill, at: t(.12), dur: .45 * k });
    q.rect(-71, -186, 142, 276, { rx: 17, sw: 1.6, stroke: C.soft, at: t(.3), dur: .35 * k });
    q.line(-14, -175, 14, -175, { sw: 4, at: t(.4), dur: .15 * k });
    if (screen) screen(q, { x: -71, y: -186, w: 142, h: 276, at: t(.45) });
    [-34, 2, 38].forEach((yy, i) => q.tube([[122, yy + 6], [70, yy]], 30, { at: t(.55 + i * .06), dur: .2 * k, sw: 2.6 }));
    q.tube('M -66 152 Q -100 92 -60 34', 34, { at: t(.68), dur: .3 * k, sw: 2.6 });
    q.rect(-58, 160, 116, 40, { rx: 8, fill: C.fill, at: t(.8), dur: .2 * k });
  };

  /* simple single icons (for steps / flow / diagram / custom scenes) */
  const icons = {
    check: p => parts.check(p, 0, 0, 1.7, 0, .4, 7),
    star: p => parts.star(p, 0, 0, 120, 0, .5, { fill: C.fill }),
    bulb: p => parts.bulb(p, 0, 20, 1.7, 0, .6),
    clock: p => parts.clock(p, 0, 0, 130, 0, .5),
    moon: p => { parts.moon(p, -10, 10, 110, 0, .5); parts.zzz(p, 90, -90, .4); },
    target: p => { parts.target(p, 0, 0, 0, .45, 1.5); parts.arrow(p, 0, 0, Math.PI * .75, 190, .4, .4, 3.4); },
    phone: p => parts.phone(p, 0, 0, 0),
    laptop: p => parts.laptop(p, 0, 70, 280, 0, .55),
    tablet: p => parts.tablet(p, 0, 0, 200, 290, 0, .55),
    folder: p => parts.folder(p, 0, 0, 300, 220, 0, .5),
    doc: p => parts.doc(p, 0, 0, 220, 290, 0, 0, .5, 4),
    envelope: p => parts.envelope(p, 0, 0, 320, 210, 0, 0, .55),
    calendar: p => parts.calendar(p, 0, 10, 340, 300, 0, .5),
    globe: p => parts.globe(p, 0, 0, 130, 0, .5),
    bell: p => parts.bell(p, 0, 0, 4, 0, .5),
    gamepad: p => parts.gamepad(p, 0, 0, 3.2, 0, .5),
    tv: p => parts.tv(p, 0, 20, 3.4, 0, .55),
    wifi: p => parts.wifi(p, 0, -20, 4, 0, .5),
    bubble: p => { parts.bubble(p, 0, -10, 320, 200, 0, .5); [-50, 0, 50].forEach((yy, i) => p.line(-110, yy - 10, 110 - i * 50, yy - 10, { sw: 3, at: .45 + i * .06, dur: .2 })); },
    wallet: p => parts.wallet(p, 0, 0, 300, 190, 0, .5),
    // kit (people, hands, accents) — sized for the ±200 × ±185 icon box
    person: p => kit.person(p, { y: 175, h: 350 }),
    ...Object.fromEntries(['wave', 'cheer', 'think', 'shrug', 'point', 'present', 'walk', 'run'].map(k => ['person-' + k, p => kit.person(p, { y: 175, h: 350, pose: k })])),
    'person-sit': p => { kit.table(p, { x: 120, y: 170, w: 170, h: 150, at: .1 }); parts.laptop(p, 110, 8, 110, .5, .4); kit.person(p, { x: -60, y: 170, h: 400, pose: 'sit' }); },
    bust: p => kit.bust(p, { size: 340 }),
    team: p => kit.team(p, { size: 400 }),
    'hand-point': p => kit.hand(p, { size: 360 }),
    'hand-thumb': p => kit.hand(p, { size: 360, pose: 'thumb' }),
    'hand-open': p => kit.hand(p, { size: 360, pose: 'open' }),
    'hand-tap': p => { p.rect(-170, -150, 340, 190, { rx: 22, fill: C.fill, dur: .45 }); kit.tap(p, { x: 10, y: -40, size: 260, at: .3 }); },
    'hand-phone': p => kit.holdPhone(p, { size: 370 }),
    package: p => kit.isoBox(p, { y: 78, w: 210, dp: 170, h: 150, tape: true }),
    cursor: p => kit.cursor(p, { x: -50, y: -90, size: 170, click: true }),
    sparkle: p => { kit.sparkle(p, { x: -20, y: 20, r: 120 }); kit.sparkle(p, { x: 110, y: -110, r: 50, at: .3 }); kit.sparkle(p, { x: 120, y: 110, r: 30, at: .4 }); },
    cycle: p => kit.cycle(p, { r: 150, sw: 4, hs: 24 }),
  };

  /* =====================================================================================
     PAIRS — before (messy) → after (clean). Drawn inside a ±200 × ±185 box around (0, 0).
     ===================================================================================== */
  const pairs = {};
  function pair(name, def) { pairs[name] = def; return def; }

  pair('inbox', {
    messy(p) {
      const L = p.child({ transform: 'translate(-5 -95) rotate(-8)' });
      L.rect(-60, -40, 120, 80, { rx: 4, fill: C.fill, sw: 2.2, dur: .35 });
      [-20, -6, 8].forEach((yy, i) => L.line(-42, yy, 42 - i * 14, yy, { sw: 1.6, at: .2 + i * .05, dur: .25 }));
      [[-70, -55, 190, 122, -15], [55, -70, 180, 118, 11], [-15, -5, 200, 128, -4], [80, 40, 175, 114, 17], [-85, 55, 178, 116, -21], [20, 75, 185, 120, 6]]
        .forEach((e, i) => parts.envelope(p, e[0], e[1], e[2], e[3], e[4], .1 + i * .12, .45));
    },
    clean(p) {
      parts.envelope(p, 0, 10, 270, 176, 0, 0, .55);
      p.circle(118, -70, 36, { fill: C.fill, at: .4, dur: .35 });
      p.poly([[101, -70], [113, -58], [136, -83]], { sw: 4, at: .65, dur: .25 });
    },
  });

  pair('phone', {
    messy(p) {
      parts.phone(p, 0, 0, 0);
      let k = 0;
      for (let r = 0; r < 5; r++) for (let c = 0; c < 4; c++) { parts.appIcon(p, -57 + c * 38, -112 + r * 42, 27, .25 + k * .03, .25, k % 3); k++; }
      [[0, 0], [1, 2], [2, 3], [3, 1], [4, 2]].forEach(([r, c], i) => p.dot(-57 + c * 38 + 13, -112 + r * 42 - 13, 6, { at: .8 + i * .04 }));
      p.rect(-76, 112, 152, 48, { rx: 16, sw: 1.6, stroke: C.soft, at: .75, dur: .3 });
      for (let c = 0; c < 4; c++) parts.appIcon(p, -54 + c * 36, 136, 25, .85 + c * .04, .2, c % 3);
    },
    clean(p) {
      parts.phone(p, 0, 0, 0);
      for (let c = 0; c < 3; c++) {
        parts.appIcon(p, -48 + c * 48, -105, 34, .35 + c * .07, .3, c);
        p.line(-60 + c * 48, -74, -36 + c * 48, -74, { sw: 1.6, stroke: C.mute, at: .55 + c * .05, dur: .2 });
      }
      p.rect(-70, 112, 140, 48, { rx: 16, sw: 1.6, stroke: C.soft, at: .55, dur: .3 });
      for (let c = 0; c < 3; c++) parts.appIcon(p, -40 + c * 40, 136, 28, .65 + c * .05, .25, c);
    },
  });

  pair('goals', {
    messy(p) {
      parts.target(p, 0, 0, 0, .45);
      for (let k = 0; k < 9; k++) {
        const th = k * .72 + rnd() * .4, d = 45 + rnd() * 62;
        const tx = Math.cos(th) * d, ty = Math.sin(th) * d * .95, ang = th + Math.PI + (rnd() - .5) * .9;
        parts.arrow(p, tx, ty, ang, 68, .3 + k * .07, .3);
      }
    },
    clean(p) { parts.target(p, 0, 0, 0, .45); parts.arrow(p, 0, 0, Math.PI * .75, 155, .45, .4, 3.4); },
  });

  pair('desk', {
    messy(p) {
      [-196, -172, -149].forEach((x, i) => p.rect(x, -62 + (i === 2 ? 6 : 0), 22, 90 - (i === 2 ? 6 : 0), { rx: 3, fill: C.fill, sw: 2.2, at: .15 + i * .06, dur: .3 }));
      parts.laptop(p, -50, 28, 130, .2, .45);
      [0, 1, 2, 3].forEach(i => p.rect(50 + rr(-6, 6), 18 - i * 8, 110, 8, { rx: 2, sw: 1.8, fill: C.fill, at: .3 + i * .05, dur: .2 }));
      parts.doc(p, 140, -40, 60, 76, 14, .45, .3, 2);
      p.rect(-200, 28, 400, 14, { rx: 3, fill: C.fill, dur: .35 });
      p.line(-188, 42, -188, 182, { dur: .25, at: .2 });
      p.rect(70, 42, 115, 140, { rx: 3, fill: C.fill, at: .25, dur: .35 });
      [88, 135].forEach((yy, i) => p.line(70, yy, 185, yy, { sw: 2, at: .5 + i * .05, dur: .15 }));
      [65, 111, 158].forEach((yy, i) => p.line(116, yy, 140, yy, { sw: 3, at: .6 + i * .04, dur: .1 }));
      p.path('M -40 30 C -10 90, -110 110, -80 150 S -140 175, -170 180', { sw: 1.8, at: .55, dur: .45 });
      p.path('M 10 112 L 52 112 L 46 182 L 16 182 Z', { fill: C.fill, sw: 2.2, at: .6, dur: .3 });
      [24, 31, 38, 45].forEach((xx, i) => p.line(xx, 118, xx - 1, 176, { sw: 1.2, stroke: C.soft, at: .8 + i * .03, dur: .1 }));
      [[-120, 168, 10], [74, 192, 8], [-20, 176, 7]].forEach(([x, y, r], i) => parts.tangle(p, x, y, r, .85 + i * .06, .25, 2));
    },
    clean(p) {
      p.rect(-200, 28, 400, 14, { rx: 3, fill: C.fill, dur: .35 });
      p.line(-186, 42, -186, 182, { at: .2, dur: .25 }); p.line(186, 42, 186, 182, { at: .25, dur: .25 });
      parts.laptop(p, 0, 28, 150, .35, .5);
    },
  });

  pair('calendar', {
    messy(p) {
      const g = parts.calendar(p, 0, 15, 380, 310, 0, .45);
      for (let i = 0; i < 35; i++) {
        if (rnd() < .22) continue;
        const cx = g.l + (i % 7) * g.cw, cy = g.hy + Math.floor(i / 7) * g.ch, at = .55 + i * .018;
        parts.scribble(p, cx + 6, cy + g.ch * .35, g.cw - 14, 9, at, .18, { sw: 1.3 });
        if (rnd() < .6) parts.scribble(p, cx + 6, cy + g.ch * .7, (g.cw - 14) * rr(.5, 1), 8, at + .05, .15, { sw: 1.3 });
        if (rnd() < .12) p.ellipse(cx + g.cw / 2, cy + g.ch / 2, g.cw * .46, g.ch * .44, { sw: 1.6, at: at + .1, dur: .2 });
      }
    },
    clean(p) {
      const g = parts.calendar(p, 0, 15, 380, 310, 0, .45);
      parts.star(p, g.l + 4.5 * g.cw, g.hy + 2.5 * g.ch, 16, .85, .3, { fill: C.ink, sw: 2 });
    },
  });

  pair('files', {
    messy(p) {
      const F = [[-140, -120], [20, -135], [150, -80], [-55, -10], [-150, 95], [50, 105], [160, 60]];
      F.forEach(([x, y], i) => parts.folder(p, x, y, 92, 68, i * .07, .35, rr(-6, 6)));
      [[0, 1], [1, 2], [0, 3], [3, 1], [3, 4], [3, 5], [5, 6], [2, 6], [4, 5]].forEach(([a, b], i) => {
        const [x1, y1] = F[a], [x2, y2] = F[b], ang = Math.atan2(y2 - y1, x2 - x1), m = 52;
        parts.link(p, x1 + Math.cos(ang) * m, y1 + Math.sin(ang) * m, x2 - Math.cos(ang) * m, y2 - Math.sin(ang) * m, .5 + i * .05, .25, { stroke: C.soft });
      });
    },
    clean(p) {
      parts.doc(p, -30, -40, 140, 150, -6, 0, .3, 0);
      parts.doc(p, 30, -50, 140, 150, 5, .1, .3, 0);
      parts.folder(p, 0, 30, 270, 190, .2, .5);
      p.rect(-75, 30, 150, 46, { rx: 6, sw: 2.4, at: .6, dur: .25 });
      p.text('FILES', 0, 62, { size: 26, ls: 3, at: .8 });
    },
  });

  pair('todo', {
    messy(p) {
      p.rect(-120, -165, 240, 345, { rx: 12, fill: C.fill, dur: .4 });
      p.rect(-42, -182, 84, 36, { rx: 9, fill: C.fill, at: .2, dur: .25 });
      p.circle(0, -170, 5, { sw: 2, at: .35, dur: .1 });
      for (let i = 0; i < 8; i++) {
        const y = -112 + i * 36;
        parts.checkbox(p, -84, y, 18, .35 + i * .06, .15, i % 3 === 0);
        parts.scribble(p, -62, y, rr(100, 150), 10, .4 + i * .06, .2);
      }
      p.path('M 120 140 L 120 172 Q 120 180 112 180 L 80 180 Z', { sw: 2, at: .9, dur: .2 });
    },
    clean(p) {
      [-70, 0, 70].forEach((y, i) => { p.dot(-120, y, 10, { at: i * .12 }); p.line(-86, y, 140, y, { sw: 3, at: .1 + i * .12, dur: .35 }); });
    },
  });

  pair('wallet', {
    messy(p) {
      [[-25, -78, -10], [20, -88, 7], [-5, -70, -2]].forEach(([x, y, r], i) => {
        const q = p.child({ transform: `translate(${x} ${y}) rotate(${r})` });
        q.rect(-100, -48, 200, 96, { rx: 4, fill: C.fill, sw: 2.2, at: i * .1, dur: .3 });
        q.rect(-88, -38, 176, 76, { rx: 3, sw: 1.2, stroke: C.mute, at: .15 + i * .1, dur: .25 });
        q.ellipse(0, 0, 20, 26, { sw: 1.6, at: .2 + i * .1, dur: .2 });
      });
      p.rect(-95, -66, 120, 40, { rx: 6, fill: C.fill, sw: 2, at: .3, dur: .2 });
      parts.wallet(p, 0, 35, 290, 170, .35, .45);
      p.line(-130, -32, 130, -32, { sw: 1.6, stroke: C.soft, at: .6, dur: .3 });
      p.rect(80, 5, 80, 58, { rx: 20, fill: C.fill, at: .7, dur: .25 });
      p.circle(118, 34, 10, { sw: 2.4, at: .85, dur: .15 });
    },
    clean(p) {
      p.rect(-95, -100, 160, 96, { rx: 8, fill: C.fill, sw: 2.4, dur: .3 });
      p.rect(-75, -84, 28, 20, { rx: 3, sw: 1.6, at: .2, dur: .15 });
      parts.wallet(p, 0, 10, 270, 160, .2, .45);
      p.path('M -135 -25 Q 0 15 135 -25', { sw: 1.8, stroke: C.soft, at: .55, dur: .3 });
    },
  });

  pair('idea', {
    messy(p) {
      parts.tangle(p, 0, 10, 115, 0, 1, 5);
      [[-140, -125, false], [135, -130, true], [-150, 120, false], [150, 110, true]].forEach(([x, y, f], i) => {
        parts.bubble(p, x, y, 84, 52, .2 + i * .12, .3, f);
        parts.scribble(p, x - 26, y, 52, 8, .4 + i * .12, .15, { sw: 1.2 });
      });
      [[-128, 10], [128, 0]].forEach(([x, y], i) => parts.tangle(p, x, y, 26, .6 + i * .1, .3, 2));
    },
    clean(p) { parts.bulb(p, 0, 10, 1.75, 0, .55); },
  });

  pair('routine', {
    messy(p) {
      parts.clock(p, 0, 0, 88, 0, .45, { h: 10, m: 50 });
      parts.clock(p, -150, -125, 30, .3, .2, { ticks: false, h: 2, m: 10 });
      parts.clock(p, 150, -135, 24, .35, .2, { ticks: false, h: 7, m: 30 });
      parts.calendar(p, -165, 25, 62, 56, .45, .2, { cols: 3, rows: 2 });
      parts.tv(p, 160, 12, .9, .5, .25);
      parts.gamepad(p, -130, 140, .85, .55, .25);
      parts.checkbox(p, 12, 158, 38, .6, .15, true);
      parts.bell(p, 145, 138, 1.25, .65, .25);
      parts.clock(p, 55, -160, 18, .7, .2, { ticks: false, h: 4, m: 0 });
      [[-75, -170], [-195, 90], [198, 75], [-50, 188]].forEach(([x, y], i) => p.dot(x, y, 4, { at: .8 + i * .03 }));
    },
    clean(p) {
      parts.clock(p, -35, 15, 112, 0, .5, { h: 10, m: 10 });
      parts.moon(p, 120, -105, 34, .55, .35);
      parts.zzz(p, 140, -60, .75, .35);
    },
  });

  pair('focus', {
    messy(p) {
      const ic = [['wifi', -150, -70], ['gamepad', -50, -60], ['tv', 50, -70], ['tv', 150, -60], ['globe', -150, 75], ['gamepad', -50, 80], ['tv', 50, 70], ['envelope', 150, 75]];
      ic.forEach(([n, x, y], i) => {
        const at = i * .1;
        if (n === 'wifi') parts.wifi(p, x, y, 1, at, .35);
        if (n === 'gamepad') parts.gamepad(p, x, y, .75, at, .35);
        if (n === 'tv') parts.tv(p, x, y, .8, at, .35);
        if (n === 'globe') parts.globe(p, x, y, 30, at, .35);
        if (n === 'envelope') parts.envelope(p, x, y, 70, 46, 0, at, .3);
      });
      p.dot(-20, -95, 6, { at: .9 }); p.dot(180, 50, 6, { at: .95 }); p.dot(80, -105, 6, { at: 1 });
    },
    clean(p) { parts.check(p, 0, 10, 1.8, 0, .45, 7); },
  });

  pair('paper', {
    messy(p) {
      parts.paperStack(p, -30, -10, 10, 150, 0, .4);
      parts.paperStack(p, -95, 150, 15, 170, .25, .5);
      parts.paperStack(p, 105, 150, 11, 150, .45, .45);
    },
    clean(p) {
      parts.tablet(p, 0, 0, 180, 250, 0, .5);
      [-70, -40, -10].forEach((y, i) => p.line(-55, y, 55 - i * 25, y, { sw: 2, stroke: C.soft, at: .5 + i * .06, dur: .2 }));
    },
  });

  window.GL = { C, stage, run, Pen, art, place, text, caption, title, rows, grid, hero, steps, page, flow, diagram, showcase, shots, connect,
    finish, tween, fade, pulse, hline, vline, midArrow,
    parts, kit, icons, pairs, pair, iso, rnd, rr, get W() { return W; }, get H() { return H; }, get end() { return lastEnd; } };

  async function run(build) {
    try {
      await Promise.all([document.fonts.load('700 40px GLLatin'), document.fonts.load('700 40px GLThai', 'กขไทย'), document.fonts.load('500 40px GLThai', 'กข')]);
      build();
      if (!window.READY) finish();
    } catch (e) { window.GL_ERROR = String(e && e.stack || e); console.error(window.GL_ERROR); }
  }
})();
