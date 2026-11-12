/* glowline.js — glow line-art motion graphics (white neon line drawings on black)
   ---------------------------------------------------------------------------------
   Scene file (scene.html) loads this script, then:

     GL.run(() => {
       GL.stage();                                   // 1080x1920 default
       const top = GL.title({ kicker: '3 WAYS TO', main: 'SIMPLIFY', sub: 'ตัดให้เหลือแค่สิ่งที่จำเป็น' });
       GL.rows([{ label: '1. INBOX', pair: 'inbox' }, ...], { top });
     });

   Everything is driven by window.setT(seconds) so scripts/render.js can step frame by frame.
   API reference: references/api.md  ·  style: references/style.md · catalogue: references/library.md            */
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
  const easeBack = p => 1 + 2.2 * Math.pow(p - 1, 3) + 1.2 * Math.pow(p - 1, 2);   // gentle overshoot (~6%)
  /* idle motions: kind → defaults (amp in px for moves, degrees for turns, fraction for scale) */
  const LOOP = { bob: { amp: 8, period: 2.6 }, sway: { amp: 6, period: 3 }, swing: { amp: 8, period: 2.2 }, spin: { period: 6 },
    beat: { amp: .12, period: 1.4 }, breathe: { amp: .03, period: 3 }, blink: { period: 3.2 }, buzz: { amp: 5, period: 2.2 },
    hop: { amp: 16, period: 1.2 }, orbit: { amp: 12, period: 3 }, tap: { amp: .08, period: 1.6 }, flap: { amp: 7, period: 1.1 },
    grow: { amp: .22, period: 1.6 }, flash: { period: 1.2 }, rise: { amp: 40, period: 2.2 } };
  /* keyframe tracks for rigged icons: GL.kf(el, start, { loop, ox, oy, x:[[t,v,ease]…], y, r, s, sx, sy, ky, o, draw }) */
  const EASE = { lin: q => q, in: q => q * q * q, out: q => 1 - Math.pow(1 - q, 3), io: q => q < .5 ? 4 * q * q * q : 1 - Math.pow(-2 * q + 2, 3) / 2,
    back: q => 1 + 2.70158 * Math.pow(q - 1, 3) + 1.70158 * Math.pow(q - 1, 2), soft: q => .5 - .5 * Math.cos(Math.PI * q) };
  function kv(keys, u) {
    if (u <= keys[0][0]) return keys[0][1];
    for (let i = 1; i < keys.length; i++) if (u <= keys[i][0]) {
      const [t0, v0] = keys[i - 1], [t1, v1, e] = keys[i], q = (u - t0) / ((t1 - t0) || 1);
      return v0 + (v1 - v0) * (EASE[e] || EASE.io)(q);
    }
    return keys[keys.length - 1][1];
  }
  function kf(e, start, { loop = 0, ox = 0, oy = 0, ...tracks } = {}) {
    items.push({ type: 'kf', e, start, loop, ox, oy, tracks });
    if (!loop) bump(start + Math.max(0, ...Object.values(tracks).map(k => k[k.length - 1][0])));
  }
  let MODE = 'motion';                                   // 'motion': icons pop in complete, then move · 'draw': strokes draw themselves
  const pts = a => typeof a === 'string' ? a : a.map(q => q.join(',')).join(' ');

  function mk(tag, attrs = {}, parent) {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) if (attrs[k] != null) e.setAttribute(k, attrs[k]);
    (parent || cur || document.body).appendChild(e);
    return e;
  }

  /* ---------------- stage ---------------- */
  function stage({ w = 1080, h = 1920, glow = 1, seed: s, icons = 'motion' } = {}) {
    W = w; H = h; if (s) seed = s; MODE = icons === 'draw' ? 'draw' : 'motion';
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
    /* p.loop({ kind, amp, period, ox, oy, phase, delay }, q => { …draw with q… }) — the part drawn with q keeps moving
       after the drawing has appeared (clock hands spin, an arm waves). ox/oy = pivot in this drawing's coordinates. */
    loop(spec, fn) {
      const g = mk('g', {}, this.g), q = new Pen(g, this.t0, this.k, this.ts, this.span);
      items.push(Object.assign({ type: 'loop', e: g, start: null, rel: spec.delay || 0 }, LOOP[spec.kind] || {}, spec));
      fn(q); return q;
    }
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
    if (!g.id) g.id = 'gl' + (++uid);
    const anchor = g.parentNode.hasAttribute('filter') && g.parentNode.dataset.wrap ? g.parentNode : g;
    const u = document.createElementNS(NS, 'use');
    u.setAttribute('href', '#' + g.id); u.setAttribute('filter', `url(#${filter})`); u.setAttribute('opacity', 0);
    anchor.parentNode.insertBefore(u, anchor.nextSibling);
    items.push({ type: 'pulse', e: u, start, strength });
  }

  /* ---------------- drawing placement ---------------- */
  function strokeK(s) { return s >= 1 ? 1 / Math.sqrt(s) : Math.max(1, .8 / s); }   // keeps lines ~2.4–4px on screen
  /* art: place a drawing. Motion mode (default): it pops in already complete, then plays its idle motion
     (fn.motion, or `idle`, or `float`). reveal: 'draw' keeps the self-drawing stroke for this one (lines, connectors). */
  function art(fn, { x, y, s = 1, w, at = 0, ts = 1, filter = 'glow', parent = cur, float, idle, reveal } = {}) {
    if (w) s = w / 400;                                   // w = on-screen width of the ±200 drawing box
    const custom = !!fn.custom, pop = !custom && (reveal ? reveal === 'pop' : MODE === 'motion');
    const wrap = mk('g', { filter: filter ? `url(#${filter})` : null, 'data-wrap': 1 }, parent);
    const en = mk('g', {}, wrap), mo = mk('g', { id: 'gl' + (++uid) }, en);
    const g = mk('g', { transform: `translate(${x} ${y}) scale(${s})`, id: 'gl' + (++uid) }, mo);
    const p = new Pen(g, at, strokeK(s), ts), i0 = items.length;
    fn(p);
    const popDur = .5 * ts, ready = custom ? at + (fn.dur || .8) * ts : pop ? at + popDur : p.span.end;
    for (let i = i0; i < items.length; i++) {
      const it = items[i];
      if ((pop || custom) && it.type === 'draw') it.static = true;
      if (it.type === 'loop' && it.start == null) it.start = ready + it.rel;
    }
    if (pop) tween(en, at, popDur, { o: 0, s: .55 }, { o: 1, s: 1 }, { cx: x, cy: y, ease: easeBack });
    if (filter) {   // a perfectly flat/vertical drawing has a 0-px box → the glow filter would erase it; pad the box
      const bb = g.getBBox(), m = 90 / s;
      if (bb.width < m || bb.height < m) {
        const w = Math.max(bb.width, m), h = Math.max(bb.height, m);
        mk('rect', { x: bb.x + bb.width / 2 - w / 2, y: bb.y + bb.height / 2 - h / 2, width: w, height: h, fill: 'none', stroke: 'none' }, g);
      }
    }
    const spec = idle === false || custom ? null : idle || (float ? Object.assign({ kind: 'bob' }, float === true ? {} : float) : fn.motion);
    if (spec) {
      const sp = Object.assign({}, LOOP[spec.kind] || {}, spec);
      items.push(Object.assign({}, sp, { type: 'loop', e: mo, start: ready + (sp.delay || 0), ox: x + (sp.ox || 0) * s, oy: y + (sp.oy || 0) * s, ps: s }));
    }
    return { wrap, g: mo, end: custom ? ready : pop ? Math.min(p.span.end, ready) : p.span.end };
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


  /* spot: one drawing big in the middle + label above + caption below (statement scene). Returns end time. */
  function spot(it, { at = .4, y = H * .48, w, label = it.label, caption = it.caption, float } = {}) {
    const s = w ? w / 400 : Math.min((W - 220) / 440, H * .36 / 400);
    if (label) text(label, { y: y - 200 * s - 60, size: Math.min(96, W * .085), at, rise: 26 });
    const a = art(single(it.icon || it.pair), { x: W / 2, y, s, at: at + .25, float });
    if (caption) text(caption, { y: y + 200 * s + 100, size: 46, weight: 600, color: C.soft, glow: false, at: a.end - .2, rise: 14, maxW: W - 120 });
    pulse(a.g, a.end + .1);
    return a.end;
  }

  /* flow: process steps joined by dotted connectors — zig-zag on 9:16, a row on 16:9. Returns end time. */
  function flow(list, { top = 340, bottom = H, at = .9, dir = W > H ? 'right' : 'down', dots = true } = {}) {
    const n = list.length, span = bottom - top;
    let pos, s, lab;
    if (dir === 'right') {
      s = Math.min(W / n * .62 / 440, span * .5 / 400); lab = clamp(W / n * .09, 28, 56);
      pos = list.map((_, i) => [W * (i + .5) / n, top + span * .42]);
    } else {
      const rh = span / n; s = Math.min(rh * .6 / 370, W * .3 / 440); lab = clamp(rh * .12, 32, 60);
      pos = list.map((_, i) => [i % 2 ? W * .7 : W * .3, top + rh * i + rh * .4]);
    }
    let t = at;
    list.forEach((it, i) => {
      const [x, y] = pos[i];
      const a = art(single(it.icon || it.pair), { x, y, s, at: t });
      const ly = y + 185 * s + lab * 1.25, mw = dir === 'right' ? W / n - 30 : W * .55;
      if (it.label) text(it.label, { x, y: ly, size: lab, at: t + .2, maxW: mw, rise: 14 });
      if (it.sub) text(it.sub, { x, y: ly + lab * 1.05, size: lab * .66, weight: 500, color: C.sub, glow: false, at: t + .3, maxW: mw, rise: 10 });
      pulse(a.g, a.end + .05, 'bloom', .7);
      t = Math.max(a.end, t + .6);
      if (i < n - 1) {
        const [nx, ny] = pos[i + 1], g = mk('g', { filter: 'url(#glow)' }, cur), pen = new Pen(g, t);
        if (dir === 'right') parts.connect(pen, x + 200 * s + 18, y, nx - 200 * s - 18, ny, 0, .45, { dots });
        else { const sd = Math.sign(nx - x); parts.connect(pen, x + sd * (200 * s + 18), y, nx, ny - 185 * s - 24, 0, .5, { dots, ctrl: [nx, y] }); }
        t = pen.span.end + .05;
      }
    });
    return t;
  }

  /* versus: A vs B side by side with labels; win: 'left' | 'right' dims the loser. Returns end time. */
  function versus({ left, right, vs = 'VS', win } = {}, { top = 340, bottom = H, at = .9 } = {}) {
    const span = bottom - top, s = Math.min((W / 2 - 80) / 440, span * .4 / 400), cy = top + span * .42;
    const lab = clamp(W * .05, 32, 60), ly = cy + 190 * s + lab * 1.3;
    vline(W / 2, top + 40, cy - lab * 1.4, at - .2); vline(W / 2, cy + lab * 1.4, bottom - 60, at - .2);
    const side = (it, x, t) => {
      const a = art(single(it.icon || it.pair), { x, y: cy, s, at: t });
      if (it.label) text(it.label, { x, y: ly, size: lab, at: t + .2, maxW: W / 2 - 50, rise: 14 });
      if (it.sub) text(it.sub, { x, y: ly + lab * 1.1, size: lab * .62, weight: 500, color: C.sub, glow: false, at: t + .3, maxW: W / 2 - 60, rise: 10 });
      return a;
    };
    const A = side(left, W * .25, at);
    text(vs, { y: cy + lab * .35, size: lab * 1.1, at: A.end - .1, color: C.kicker, rise: 10 });
    const B = side(right, W * .75, A.end + .15);
    const end = B.end + .1;
    if (win) {
      const [wn, ls] = win === 'left' ? [A, B] : [B, A];
      tween(ls.wrap, end, .5, { o: 1 }, { o: .42 }, { ease: easeIO });
      pulse(wn.g, end + .1);
    } else { pulse(A.g, end, 'bloom', .6); pulse(B.g, end, 'bloom', .6); }
    return end + .5;
  }

  /* counter: a number that counts up (from → value). Returns { g, end }. */
  function counter(value, { from = 0, prefix = '', suffix = '', decimals = 0, at = 0, dur = 1.4, ...o } = {}) {
    const nf = new Intl.NumberFormat('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
    const fmt = v => prefix + nf.format(v) + suffix;
    const g = text(fmt(value), Object.assign({ at, dur: .3, rise: 0 }, o));
    items.push({ type: 'count', e: g.querySelector('tspan'), start: at, dur, from, to: value, fmt });
    bump(at + dur);
    return { g, end: at + dur };
  }

  /* stat: big glowing number (+ optional icon above, label + sub below). Returns end time. */
  function stat({ value, from = 0, prefix = '', suffix = '', decimals = 0, label, sub, icon } = {}, { at = .4, top = 0, bottom = H, size } = {}) {
    const span = bottom - top, ns = size || Math.min(W * .3, span * .22, 340), lab = clamp(ns * .24, 32, 64), ss = lab * .66;
    const s = icon ? Math.min(span * .26 / 370, W * .45 / 440) : 0;
    const blockH = (icon ? 370 * s + 50 : 0) + ns * .75 + (label ? lab * 2.1 : 0) + (sub ? ss * 1.7 : 0);
    let y = top + (span - blockH) / 2, t = at;
    if (icon) { const a = art(single(icon), { x: W / 2, y: y + 185 * s, s, at: t }); y += 370 * s + 50; t = a.end; pulse(a.g, a.end + 1.4, 'bloom', .6); }
    y += ns * .75;
    const c = counter(value, { from, prefix, suffix, decimals, y, size: ns, at: t, maxW: W - 120 });
    if (label) { y += lab * 2.1; text(label, { y, size: lab, at: t + .3, maxW: W - 120, rise: 14 }); }
    if (sub) { y += ss * 1.7; text(sub, { y, size: ss, weight: 500, color: C.sub, glow: false, at: t + .45, maxW: W - 120, rise: 10 }); }
    pulse(c.g, c.end, 'bloom', .55);
    return c.end;
  }

  /* connect: free arrow / dotted path between two points on the stage. Returns end time. */
  function connect(x1, y1, x2, y2, { at = 0, dur = .5, ...o } = {}) {
    const pen = new Pen(mk('g', { filter: 'url(#glow)' }, cur), at);
    parts.connect(pen, x1, y1, x2, y2, 0, dur, o);
    return pen.span.end;
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

  function finish({ hold = 1.6 } = {}) {
    window.DURATION = Math.round((lastEnd + hold) * 100) / 100;
    window.setT(window.DURATION);
    window.READY = true;
  }

  /* ---------------- time control ---------------- */
  window.setT = t => {
    for (const it of items) {
      if (it.type === 'draw' && it.static) {
        if (!it.done) { it.e.setAttribute('stroke-dashoffset', 0); it.e.setAttribute('stroke-opacity', 1); if (it.hasFill) it.e.setAttribute('fill-opacity', 1); it.done = 1; }
      } else if (it.type === 'draw') {
        const p = clamp((t - it.start) / it.dur), q = easeIO(p);
        it.e.setAttribute('stroke-dashoffset', 1 - q);
        it.e.setAttribute('stroke-opacity', p > 0 ? 1 : 0);
        if (it.hasFill) it.e.setAttribute('fill-opacity', clamp(q * 1.6));
      } else if (it.type === 'kf') {
        let u = t - it.start; u = u < 0 ? 0 : it.loop ? u % it.loop : u;
        const T = it.tracks, v = (k, d) => T[k] ? kv(T[k], u) : d, sc = v('s', 1);
        it.e.setAttribute('transform', `translate(${(it.ox + v('x', 0)).toFixed(2)} ${(it.oy + v('y', 0)).toFixed(2)}) rotate(${v('r', 0).toFixed(2)}) skewY(${v('ky', 0).toFixed(2)}) scale(${(v('sx', 1) * sc).toFixed(4)} ${(v('sy', 1) * sc).toFixed(4)}) translate(${-it.ox} ${-it.oy})`);
        if (T.o) it.e.setAttribute('opacity', clamp(v('o', 1)).toFixed(3));
        if (T.draw) it.e.setAttribute('stroke-dashoffset', (1 - clamp(v('draw', 1))).toFixed(4));
      } else if (it.type === 'loop') {
        const u = t - (it.start ?? 1e9);
        if (u <= 0) { it.e.removeAttribute('transform'); if (it.kind === 'flash' || it.kind === 'rise') it.e.setAttribute('opacity', it.kind === 'rise' ? 0 : 1); continue; }
        const P = it.period || 2, k = clamp(u / .5), w = 2 * Math.PI * u / P + (it.phase || 0), A = (it.amp ?? 0) * k, ph = ((u / P + (it.phase || 0) / (2 * Math.PI)) % 1 + 1) % 1;
        let dx = 0, dy = 0, r = 0, sx = 1, sy = 1, ky = 0, o = null;
        switch (it.kind) {
          case 'bob': dy = -A * Math.sin(w); break;
          case 'sway': dx = A * Math.sin(w); break;
          case 'swing': r = A * Math.sin(w); break;
          case 'spin': r = 360 * u / P * (it.dir || 1); break;
          case 'beat': { const b = ph < .14 ? Math.sin(ph / .14 * Math.PI) : ph < .3 ? .55 * Math.sin((ph - .14) / .16 * Math.PI) : 0; sx = sy = 1 + A * b; break; }
          case 'breathe': sx = sy = 1 + A * Math.sin(w); break;
          case 'blink': sy = ph > .9 ? 1 - .92 * Math.sin((ph - .9) / .1 * Math.PI) : 1; break;
          case 'buzz': r = ph < .22 ? A * Math.sin(u * 2 * Math.PI / .09) : 0; break;
          case 'hop': dy = -A * Math.abs(Math.sin(Math.PI * ph)); break;
          case 'orbit': dx = A * Math.cos(w); dy = A * Math.sin(w); break;
          case 'tap': { const b = ph < .22 ? Math.sin(ph / .22 * Math.PI) : 0; sx = sy = 1 - A * b; dy = A * 60 * b; break; }
          case 'flap': ky = A * Math.sin(w); break;
          case 'grow': sy = 1 - A * (.5 + .5 * Math.sin(w)); break;
          case 'flash': o = .25 + .75 * (.5 + .5 * Math.sin(w)); break;
          case 'rise': dy = -A * ph; o = ph < .2 ? ph / .2 : 1 - (ph - .2) / .8; break;
        }
        const ps = it.ps || 1, ox = it.ox || 0, oy = it.oy || 0;
        it.e.setAttribute('transform', `translate(${(ox + dx * ps).toFixed(2)} ${(oy + dy * ps).toFixed(2)}) rotate(${r.toFixed(2)}) skewY(${ky.toFixed(2)}) scale(${sx.toFixed(4)} ${sy.toFixed(4)}) translate(${-ox} ${-oy})`);
        if (o != null) it.e.setAttribute('opacity', o.toFixed(3));
      } else if (it.type === 'count') {
        const q = easeOut(clamp((t - it.start) / it.dur));
        it.e.textContent = it.fmt(it.from + (it.to - it.from) * q);
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
      const o = v('o', 1), s = v('s', 1), dx = v('dx', 0), dy = v('dy', 0), r = v('r', 0);
      e.setAttribute('opacity', o.toFixed(3));
      e.setAttribute('transform', `translate(${dx + tw.cx} ${dy + tw.cy}) rotate(${r}) scale(${s}) translate(${-tw.cx} ${-tw.cy})`);
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
      if (rays) q.loop({ kind: 'flash', period: 1.4 }, r => [-180, -150, -120, -90, -60, -30, 0].forEach((deg, i) => {
        const a = deg * Math.PI / 180;
        r.line(Math.cos(a) * 68, -24 + Math.sin(a) * 68, Math.cos(a) * 88, -24 + Math.sin(a) * 88, { sw: 3, at: at + d + i * .04, dur: .15 });
      }));
    },
    clock(p, x, y, r, at = 0, d = .5, { h = 10, m = 10, fill = C.fill, ticks = true } = {}) {
      p.circle(x, y, r, { fill, at, dur: d });
      if (ticks) for (let i = 0; i < 12; i++) {
        const a = i * Math.PI / 6, big = i % 3 === 0;
        p.line(x + Math.sin(a) * r * (big ? .74 : .82), y - Math.cos(a) * r * (big ? .74 : .82), x + Math.sin(a) * r * .9, y - Math.cos(a) * r * .9,
          { sw: big ? 3 : 1.6, at: at + d * .5 + i * .02, dur: .12 });
      }
      const ha = (h % 12 + m / 60) * Math.PI / 6, ma = m * Math.PI / 30;
      p.loop({ kind: 'spin', period: 60, ox: x, oy: y }, q => q.line(x, y, x + Math.sin(ha) * r * .48, y - Math.cos(ha) * r * .48, { sw: 4, at: at + d * .9, dur: .2 }));
      p.loop({ kind: 'spin', period: 5, ox: x, oy: y }, q => q.line(x, y, x + Math.sin(ma) * r * .7, y - Math.cos(ma) * r * .7, { sw: 3, at: at + d, dur: .2 }));
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
      [[0, 0, 12], [20, -24, 16], [46, -54, 21]].forEach(([dx, dy, s], i) => p.loop({ kind: 'rise', amp: 26, period: 2.4, delay: i * .8 }, q =>
        q.poly([[x + dx, y + dy], [x + dx + s, y + dy], [x + dx, y + dy + s], [x + dx + s, y + dy + s]], { sw: 2.4, at: at + i * d / 3, dur: d / 2 })));
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
        p.loop({ kind: 'flash', period: 1.5, phase: -i * 1.1 }, q => q.path(`M ${x + Math.cos(a1) * r} ${y + 14 * s + Math.sin(a1) * r} A ${r} ${r} 0 0 1 ${x + Math.cos(a2) * r} ${y + 14 * s + Math.sin(a2) * r}`, { sw: 3, at: at + i * d / 4, dur: d / 2 })); });
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

    /* ---- people, hands, pointers (pictogram style: outlined capsules, dark fill) ---- */
    capsule(p, x1, y1, x2, y2, r, o = {}) {
      const a = Math.atan2(y2 - y1, x2 - x1), nx = -Math.sin(a) * r, ny = Math.cos(a) * r, f = v => v.toFixed(1);
      return p.path(`M ${f(x1 + nx)} ${f(y1 + ny)} L ${f(x2 + nx)} ${f(y2 + ny)} A ${r} ${r} 0 0 0 ${f(x2 - nx)} ${f(y2 - ny)} L ${f(x1 - nx)} ${f(y1 - ny)} A ${r} ${r} 0 0 0 ${f(x1 + nx)} ${f(y1 + ny)} Z`,
        Object.assign({ fill: C.fill }, o));
    },
    person(p, x, y, h = 200, at = 0, d = .6, { pose = 'stand' } = {}) {   // standing pictogram, (x, y) = centre, h = height
      const sc = h / 200, q = p.child({ transform: `translate(${x} ${y}) scale(${sc})` }, sc);
      const A = { stand: [10, 10], wave: [10, 155], cheer: [150, 150], point: [10, 88], think: [10, 150] }[pose] || [10, 10];
      parts.capsule(q, -11, 12, -12, 90, 9.5, { at: at + d * .55, dur: d * .4 });
      parts.capsule(q, 11, 12, 12, 90, 9.5, { at: at + d * .6, dur: d * .4 });
      q.path('M -30 -38 Q -30 -50 -18 -50 L 18 -50 Q 30 -50 30 -38 L 24 12 Q 23 18 16 18 L -16 18 Q -23 18 -24 12 Z', { fill: C.fill, at: at + d * .2, dur: d * .45 });
      [-1, 1].forEach((side, i) => {
        const th = A[i] * Math.PI / 180, sx = side * 25, sy = -40, L = pose === 'think' && side > 0 ? 40 : 62;
        const ex = sx + side * Math.sin(th) * L, ey = sy + Math.cos(th) * L;
        if (pose === 'think' && side > 0) {                 // hand to chin: upper arm out, forearm back to the face
          parts.capsule(q, sx, sy, ex + 8, ey + 44, 8, { at: at + d * .45, dur: d * .3 });
          parts.capsule(q, ex + 8, ey + 44, 14, -60, 7.5, { at: at + d * .65, dur: d * .3 });
        } else if ((pose === 'wave' && side > 0) || pose === 'cheer')
          q.loop({ kind: 'swing', amp: pose === 'wave' ? 18 : 10, period: pose === 'wave' ? 1.1 : 1.3, phase: side > 0 ? 0 : Math.PI, ox: sx, oy: sy }, a => parts.capsule(a, sx, sy, ex, ey, 8, { at: at + d * .45 + i * .05, dur: d * .35 }));
        else parts.capsule(q, sx, sy, ex, ey, 8, { at: at + d * .45 + i * .05, dur: d * .35 });
      });
      q.circle(0, -76, 20, { fill: C.fill, at, dur: d * .35 });
    },
    bust(p, x, y, sc = 1, at = 0, d = .5) {              // avatar: head + shoulders, box ±60 × ±62
      const q = p.child({ transform: `translate(${x} ${y}) scale(${sc})` }, sc);
      q.path('M -58 62 C -58 16, -32 6, 0 6 C 32 6, 58 16, 58 62 Z', { fill: C.fill, at: at + d * .3, dur: d * .6 });
      q.circle(0, -28, 28, { fill: C.fill, at, dur: d * .5 });
    },
    team(p, x, y, sc = 1, at = 0, d = .5) {
      parts.bust(p, x - 72 * sc, y + 14 * sc, .8 * sc, at + .15, d);
      parts.bust(p, x + 72 * sc, y + 14 * sc, .8 * sc, at + .25, d);
      parts.bust(p, x, y, sc, at, d);
    },
    hand(p, x, y, sc = 1, at = 0, d = .55) {             // pointing hand (tap), fingertip at (x, y - 64·sc)
      const q = p.child({ transform: `translate(${x} ${y}) scale(${sc})` }, sc);
      q.rect(-8, 48, 56, 24, { rx: 5, fill: C.fill, at: at + d * .7, dur: d * .3 });
      q.path(`M -10 -10 L -10 -54 A 10 10 0 0 1 10 -54 L 10 -18 A 8 8 0 0 1 26 -18 L 26 -14 A 8 8 0 0 1 42 -14 L 42 -8 A 7.5 7.5 0 0 1 57 -8
        L 57 22 Q 57 46 40 50 L 2 50 Q -20 46 -26 30 L -38 8 A 8 8 0 0 1 -24 0 L -10 14 Z`, { fill: C.fill, at, dur: d });
      q.line(26, -14, 26, -2, { sw: 2, at: at + d * .8, dur: .1 }); q.line(42, -8, 42, 2, { sw: 2, at: at + d * .85, dur: .1 });
    },
    cursor(p, x, y, sc = 1, at = 0, d = .35, { click = false } = {}) {   // arrow pointer, tip at (x, y)
      const q = p.child({ transform: `translate(${x} ${y}) scale(${sc})` }, sc);
      q.path('M 0 0 L 0 46 L 12 35 L 21 54 L 29 50 L 20 32 L 35 32 Z', { fill: C.fill, at, dur: d });
      if (click) [[-9, -9, -19, -19], [-12, 3, -25, 5], [3, -12, 5, -25]].forEach(([a, b, c, e], i) => q.line(a, b, c, e, { sw: 2.6, at: at + d + i * .04, dur: .12 }));
    },
    card(p, x, y, w, h, { text, size, at = 0, dur = .4, rx = 14, color } = {}) {   // rounded label box
      p.rect(x - w / 2, y - h / 2, w, h, { rx, fill: C.fill, at, dur });
      if (text) p.text(text, x, y + (size || h * .36) * .36, { size: size || h * .36, at: at + dur * .8, color });
    },
    connect(p, x1, y1, x2, y2, at = 0, d = .5, { bend = 0, ctrl, dots = false, head = 13, stroke = C.soft, sw = 2.6 } = {}) {
      const L = Math.hypot(x2 - x1, y2 - y1), mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
      const [cx, cy] = ctrl || [mx - (y2 - y1) / L * bend * L, my + (x2 - x1) / L * bend * L];
      const P = t => [(1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * cx + t * t * x2, (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * cy + t * t * y2];
      if (dots) { const n = Math.max(3, Math.round(L / 20)); for (let i = 0; i < n; i++) { const [px, py] = P(i / n); p.dot(px, py, sw * 1.2, { at: at + d * i / n, dur: .06, fill: stroke }); } }
      else p.path(`M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`, { stroke, sw, at, dur: d });
      const a = Math.atan2(y2 - cy, x2 - cx);
      p.poly([[x2 - Math.cos(a - .5) * head, y2 - Math.sin(a - .5) * head], [x2, y2], [x2 - Math.cos(a + .5) * head, y2 - Math.sin(a + .5) * head]], { stroke, sw, at: at + d * .9, dur: .15 });
    },
    /* ---- money, shopping, charts ---- */
    coins(p, x, by, n = 5, r = 40, at = 0, d = .5) {     // coin stack, by = bottom of the lowest coin
      const ry = r * .34, th = r * .26;
      for (let i = 0; i < n; i++) {
        const yy = by - ry - i * th, j = rr(-3, 3) * r / 40, f = v => v.toFixed(1);
        p.path(`M ${f(x - r + j)} ${f(yy)} A ${r} ${ry} 0 0 0 ${f(x + r + j)} ${f(yy)} L ${f(x + r + j)} ${f(yy - th)} A ${r} ${ry} 0 0 1 ${f(x - r + j)} ${f(yy - th)} Z`,
          { fill: C.fill, sw: 2.4, at: at + i * d / n, dur: .18 });
        if (i === n - 1) { p.ellipse(x + j, yy - th, r, ry, { fill: C.fill, sw: 2.4, at: at + d, dur: .2 }); p.ellipse(x + j, yy - th, r * .62, ry * .6, { sw: 1.6, stroke: C.soft, at: at + d + .1, dur: .15 }); }
      }
    },
    bag(p, x, y, sc = 1, at = 0, d = .5) {               // shopping bag, box ±60 × ±90
      const q = p.child({ transform: `translate(${x} ${y}) scale(${sc})` }, sc);
      q.path('M -26 -40 C -26 -92, 26 -92, 26 -40', { sw: 3.4, at, dur: d * .5 });
      q.rect(-62, -44, 124, 134, { rx: 10, fill: C.fill, at: at + d * .3, dur: d * .6 });
      q.circle(-26, -26, 4, { sw: 2, at: at + d * .8, dur: .1 }); q.circle(26, -26, 4, { sw: 2, at: at + d * .85, dur: .1 });
    },
    bars(p, x, y, w, h, values, at = 0, d = .6, { accent } = {}) {   // bar chart in a w × h box centred on (x, y)
      const n = values.length, max = Math.max(...values), slot = w / n, bw = slot * .62, by = y + h / 2, ai = accent ?? n - 1;
      values.forEach((v, i) => {
        const bh = Math.max(4, h * .92 * v / max), hot = i === ai, bx = x - w / 2 + i * slot + slot / 2;
        p.loop({ kind: 'grow', amp: .16, period: 1.8, phase: -i * .9, ox: bx, oy: by }, p => p.rect(x - w / 2 + i * slot + (slot - bw) / 2, by - bh, bw, bh, { rx: Math.min(8, bw * .2), fill: C.fill, sw: hot ? 3.4 : 2.4, stroke: hot ? C.ink : C.soft, at: at + i * d / n, dur: .3 }));
      });
      p.line(x - w / 2 - 12, by, x + w / 2 + 12, by, { sw: 2.4, at, dur: d * .5 });
    },
    lineChart(p, x, y, w, h, values, at = 0, d = .8, { dots = true } = {}) {
      const n = values.length, min = Math.min(...values), max = Math.max(...values), l = x - w / 2, b = y + h / 2;
      const P = values.map((v, i) => [l + w * i / (n - 1), b - h * .1 - h * .8 * (v - min) / ((max - min) || 1)]);
      p.poly([[l, y - h / 2], [l, b], [l + w + 10, b]], { sw: 2, stroke: C.mute, at, dur: d * .4 });
      p.poly(P, { sw: 3.4, at: at + d * .3, dur: d });
      if (dots) P.forEach(([px, py], i) => p.circle(px, py, i === n - 1 ? 9 : 5, { fill: i === n - 1 ? C.ink : C.fill, sw: 2.2, at: at + d * .3 + d * i / (n - 1), dur: .12 }));
    },
  };

  /* simple single icons (for steps / custom scenes) */
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
    person: p => parts.person(p, 0, 0, 360, 0, .7),
    wave: p => parts.person(p, 0, 0, 360, 0, .7, { pose: 'wave' }),
    cheer: p => parts.person(p, 0, 0, 360, 0, .7, { pose: 'cheer' }),
    point: p => parts.person(p, -40, 0, 360, 0, .7, { pose: 'point' }),
    think: p => { parts.person(p, -20, 15, 340, 0, .7, { pose: 'think' }); parts.bubble(p, 120, -140, 120, 74, .6, .3, true); [-28, 0, 28].forEach((dx, i) => p.loop({ kind: 'flash', period: 1.2, phase: -i * 1.2 }, q => q.dot(120 + dx, -140, 5, { at: .85 + i * .06 }))); },
    bust: p => parts.bust(p, 0, 0, 2.6, 0, .55),
    team: p => parts.team(p, 0, 10, 1.55, 0, .5),
    hand: p => parts.hand(p, -20, -10, 2.4, 0, .6),
    cursor: p => parts.cursor(p, -40, -80, 3.2, 0, .45, { click: true }),
    coins: p => { parts.coins(p, -60, 150, 7, 80, 0, .7); parts.coins(p, 100, 150, 4, 70, .3, .5); },
    bag: p => parts.bag(p, 0, 0, 2, 0, .55),
    chart: p => parts.bars(p, 0, 0, 340, 300, [3, 5, 4, 7, 9], 0, .7),
    linechart: p => parts.lineChart(p, 0, 0, 360, 280, [2, 3, 2.5, 4, 3.6, 6], 0, .9),
  };

  /* idle motion of each icon (kind from LOOP; ox/oy = pivot in the icon's ±200 box) */
  const MOTION = {
    check: { kind: 'beat', amp: .08, period: 2 }, star: { kind: 'swing', amp: 10, period: 2.4 }, bulb: { kind: 'breathe', amp: .03 },
    moon: { kind: 'swing', amp: 6, period: 3 }, target: { kind: 'beat', amp: .06, period: 1.8 }, phone: { kind: 'buzz', amp: 4, period: 2.4 },
    laptop: { kind: 'bob', amp: 4 }, tablet: { kind: 'bob', amp: 5 }, folder: { kind: 'bob', amp: 5 }, doc: { kind: 'swing', amp: 3 },
    envelope: { kind: 'bob', amp: 6 }, calendar: { kind: 'swing', amp: 3, oy: -150 }, globe: { kind: 'swing', amp: 8 },
    bell: { kind: 'swing', amp: 14, period: 1.4, oy: -120 }, gamepad: { kind: 'swing', amp: 6 }, tv: { kind: 'bob', amp: 4 },
    bubble: { kind: 'bob', amp: 6 }, wallet: { kind: 'bob', amp: 5 }, person: { kind: 'bob', amp: 4, period: 3 }, cheer: { kind: 'hop', amp: 10, period: 1.3 },
    point: { kind: 'sway', amp: 5 }, think: { kind: 'bob', amp: 3, period: 3.4 }, bust: { kind: 'bob', amp: 4 }, team: { kind: 'bob', amp: 4 },
    hand: { kind: 'tap', amp: .08, period: 1.4 }, cursor: { kind: 'tap', amp: .1, period: 1.6 }, coins: { kind: 'hop', amp: 8, period: 1.6 },
    bag: { kind: 'swing', amp: 6, oy: -170 }, linechart: { kind: 'breathe', amp: .03 },
  };
  for (const n in MOTION) if (icons[n]) icons[n].motion = MOTION[n];

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

  window.GL = { C, stage, run, Pen, art, text, title, rows, grid, hero, steps, spot, flow, versus, stat, counter, connect, page, finish, tween, fade, pulse, hline, vline, midArrow,
    parts, icons, pairs, pair, single, LOOP, MOTION, kf, EASE, easeIO, easeOut, clamp, rnd, rr, get W() { return W; }, get H() { return H; }, get end() { return lastEnd; } };

  /* beats.js (B01–B21 scene templates) loads next to this file */
  const beatsReady = new Promise(res => {
    const load = names => { if (!names.length) return res();
      const sc = document.createElement('script'); sc.src = HERE + names[0];
      sc.onload = () => load(names.slice(1)); sc.onerror = () => { console.error('GL: ' + names[0] + ' not found'); load(names.slice(1)); };
      document.head.appendChild(sc); };
    load(['beats.js', 'pro.js']);
  });

  async function run(build) {
    try {
      await Promise.all([beatsReady, document.fonts.load('700 40px GLLatin'), document.fonts.load('700 40px GLThai', 'กขไทย'), document.fonts.load('500 40px GLThai', 'กข')]);
      build();
      if (!window.READY) finish();
    } catch (e) { window.GL_ERROR = String(e && e.stack || e); console.error(window.GL_ERROR); }
  }
})();
