/* =====================================================================
   CutPack · uni · SKETCHES for round 11 (Friend 2026-11-11: "เริ่มรอบ 11 ได้ครับ"). Two new drafts for each of ten
   categories: B10 คน · B13 เคล็ดลับ · B20 ความสัมพันธ์ · B21 สถานที่ · B12 เหตุกับผล · B05 ถูกกับผิด · B11 คำพูด ·
   B01 ตัวเลขเด่น · B02 เพิ่ม/ลด · B14 ประโยคเด็ด. Ideas: one main thing + one move on the key word, then it holds
   (talking-head-motion), checked against every draft in all 21 categories and the deleted ones (DECISIONS round 11).

   DRAWN THE WAY FRIEND'S glow-line-motion SKILL DRAWS (Friend 2026-11-11: "ก. ครับ" · "เส้นมันหนาไป วาดตาม skill ที่ผมส่งให้สิ"
   · "วาดตาม skill 100% แต่ธีมสีและการเรืองแสง ให้ทำตามสไตล์นั้นๆ"): flat front view, few details (one outline + 1–3 detail
   lines), every line 3 px on screen (details 1.6–2.2), round ends and corners, closed shapes filled with the body colour so
   what is behind is hidden, people / hands / iso boxes from the skill's kit (same joint points and sizes). The pen (LP), the
   parts and the kit below are ported from the skill's assets/glowline.js; only the colours changed: the skill's white line and
   dark fill become each style's own line, body and accent colours (--lp-* below), and the glow is the style's own (glass glows
   blue on every line, gold glows orange on the accent, card and split do not glow).
   KIT-LIKE (Friend 2026-11-11: "ไอเดียที่เสนอมามันดูรกไป อยากให้ดูชุด kit ของ skill เป็นแบบอย่าง" · "โอเคครับ แก้ทั้งหมด"): every
   draft is like a picture in the skill's references/kit.jpg: ONE main thing in the middle, big enough to fill the frame (no empty
   look), at most one word under it or on it; no extra cards, chips, floors, ghosts or decoration.
   DRAWN LIKE FRIEND'S REF ("20 WAYS TO SIMPLIFY", Friend 2026-11-11: "เหมือนงานเด็กมัธยมวาด ให้คุณลองดู ref นี้" · "เอาแนวนี้เลย"
   · "ตั้งใจวาดนะครับ โดยเฉพาะสิ้นส่วนอะไรที่เป็นของมนุษย์"): bodies shaded from the top left (fill 'shade'), thickness (a second
   edge, things layered), small real details (stitching, buttons, rims, highlights) in thin quiet lines, the outer line strong;
   real proportions and small corner radii. People and hands are figures (Pen.figure): one outline round the whole body,
   7½ heads tall, a collar, a belt, shoes, hands with a thumb; LESSONS 48.
   Still pictures only (the end state): NOT in scenes/; load with EXTRA=sketches/r11.js.
   ===================================================================== */
(() => {
  if (document.getElementById('lp-css')) return;
  const st = document.createElement('style'); st.id = 'lp-css';
  st.textContent = `
.c-light{--lp-ink:#14213D;--lp-fill:#FFFFFF;--lp-soft:rgba(20,33,61,.5);--lp-acc:#DDFF45;--lp-acc-line:#14213D;--lp-acc-ink:#14213D;--lp-neg:#E5484D}
.c-dark{--lp-ink:#FFFFFF;--lp-fill:#141924;--lp-soft:rgba(255,255,255,.5);--lp-acc:#DDFF45;--lp-acc-line:#DDFF45;--lp-acc-ink:#0A0A0A;--lp-neg:#FF5A5F}
.g-root{--lp-ink:rgba(235,246,255,.95);--lp-fill:rgba(10,18,34,.82);--lp-soft:rgba(235,246,255,.5);--lp-acc:rgba(143,211,255,.3);--lp-acc-line:#8FD3FF;--lp-acc-ink:#FFFFFF;--lp-neg:#FF7A8A}
.p-light{--lp-ink:#4B3D6E;--lp-fill:#FFFFFF;--lp-soft:rgba(75,61,110,.5);--lp-acc:#9C84D6;--lp-acc-line:#4B3D6E;--lp-acc-ink:#FFFFFF;--lp-neg:#C2667A}
.p-dark{--lp-ink:#F1ECFB;--lp-fill:#6F5F97;--lp-soft:rgba(241,236,251,.55);--lp-acc:#D9CCF6;--lp-acc-line:#F1ECFB;--lp-acc-ink:#4B3D6E;--lp-neg:#F09AA8}
.gd{--lp-ink:#F2F2F4;--lp-fill:#141417;--lp-soft:rgba(242,242,244,.48);--lp-acc:#FF9A2E;--lp-acc-line:#FFB04A;--lp-acc-ink:#1A0E00;--lp-neg:#FF5A4E}
.c-light,.p-light{--lp-shade-a:var(--lp-fill);--lp-shade-b:color-mix(in srgb, var(--lp-ink) 11%, var(--lp-fill))}
.c-dark,.g-root,.p-dark,.gd{--lp-shade-a:color-mix(in srgb, var(--lp-ink) 20%, var(--lp-fill));--lp-shade-b:color-mix(in srgb, var(--lp-ink) 5%, var(--lp-fill))}
.gd .lp-acc{filter:drop-shadow(0 0 7px rgba(255,140,40,.8))}
.lp-t{white-space:nowrap;line-height:1.25;color:var(--lp-ink)}
.lp-t.lp-on{color:var(--lp-acc-ink)}
.lp-ico{color:var(--lp-ink)}.lp-ico.lp-on{color:var(--lp-acc-ink)}`;
  document.head.appendChild(st);
})();

const LP = (() => {
  const NS = 'http://www.w3.org/2000/svg'; let LPN = 0;
  const C = {ink: 'var(--lp-ink)', fill: 'var(--lp-fill)', soft: 'var(--lp-soft)', mute: 'var(--lp-soft)', acc: 'var(--lp-acc)', accLine: 'var(--lp-acc-line)', neg: 'var(--lp-neg)'};
  const pts = a => typeof a === 'string' ? a : a.map(q => q.join(',')).join(' ');
  /* tone: undefined (line + body), 'acc' (the accent body with its line), 'neg' (red line), 'soft' (a quiet detail line) */
  class Pen {
    constructor(g, k, grad, defs) { this.g = g; this.k = k; this.grad = grad; this.defs = defs; }
    child(attrs = {}, sc = 1) { const e = document.createElementNS(NS, 'g'); for (const a in attrs) e.setAttribute(a, attrs[a]); this.g.appendChild(e); return new Pen(e, this.k / sc, this.grad, this.defs); }
    /* a light-to-shadow fill laid across a whole figure (user space of this pen), so all its parts share one light */
    ugrad(x1, y1, x2, y2, acc = false) {
      const id = 'lpu' + (++LPN), a = acc ? 'var(--lp-acc)' : 'var(--lp-shade-a, var(--lp-fill))', b = acc ? 'color-mix(in srgb, var(--lp-acc) 80%, #000)' : 'var(--lp-shade-b, var(--lp-fill))';
      this.defs.insertAdjacentHTML('beforeend', `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"><stop offset="0" style="stop-color:${a}"/><stop offset="1" style="stop-color:${b}"/></linearGradient>`);
      return `url(#${id})`;
    }
    _raw(tag, a, style) { const e = document.createElementNS(NS, tag); for (const n in a) e.setAttribute(n, a[n]); e.setAttribute('style', style); this.g.appendChild(e); return e; }
    /* ONE outlined, shaded shape out of many parts (people, hands): parts = [{d} a closed shape | {d, w} a limb of width w];
       pass 1 paints every part fattened by the line width in the line colour, pass 2 the body over it, so the outline runs
       round the whole figure and there are no seams inside. details = thin lines drawn on top (collar, belt, fingers) */
    figure(parts, {tone, box = [-30, -110, 30, 0], details = [], dsw = 1.5} = {}) {
      const acc = tone === 'acc', line = acc ? C.accLine : C.ink, sw = 3 * this.k, body = this.ugrad(box[0], box[1], box[2], box[3], acc);
      const g = this.child(); if (acc) g.g.classList.add('lp-acc');
      const each = (fn) => parts.forEach(pt => fn(pt));
      each(pt => pt.w ? g._raw('path', {d: pt.d}, `fill:none;stroke:${line};stroke-width:${pt.w + 2 * sw}px;stroke-linecap:round;stroke-linejoin:round`)
                      : g._raw('path', {d: pt.d}, `fill:${line};stroke:${line};stroke-width:${2 * sw}px;stroke-linejoin:round`));
      each(pt => pt.w ? g._raw('path', {d: pt.d}, `fill:none;stroke:var(--lp-fill);stroke-width:${pt.w}px;stroke-linecap:round;stroke-linejoin:round`)
                      : g._raw('path', {d: pt.d}, 'fill:var(--lp-fill);stroke:none'));
      each(pt => pt.w ? g._raw('path', {d: pt.d}, `fill:none;stroke:${body};stroke-width:${pt.w}px;stroke-linecap:round;stroke-linejoin:round`)
                      : g._raw('path', {d: pt.d}, `fill:${body};stroke:none`));
      details.forEach(d => g._raw('path', {d}, `fill:none;stroke:${acc ? 'var(--lp-acc-ink)' : 'var(--lp-soft)'};stroke-width:${dsw * this.k}px;stroke-linecap:round;stroke-linejoin:round${acc ? ';opacity:.4' : ''}`));
      return g;
    }
    _d(tag, a, o = {}) {
      const e = document.createElementNS(NS, tag);
      for (const n in a) e.setAttribute(n, a[n]);
      /* fill: true = the flat body colour, 'shade' = the body lit from the top left (the ref's soft volume) */
      let fill = o.fill === true ? C.fill : o.fill === 'shade' ? `url(#${this.grad})` : o.fill || 'none', stroke = o.stroke || C.ink;
      if (o.tone === 'acc') { fill = o.fill === 'none' ? 'none' : o.fill === 'shade' ? `url(#${this.grad}a)` : C.acc; stroke = C.accLine; e.classList.add('lp-acc'); }
      if (o.tone === 'neg') { stroke = C.neg; if (o.fill && o.fill !== 'none') fill = C.neg; }
      if (o.tone === 'soft') stroke = C.soft;
      e.setAttribute('style', `fill:${fill};stroke:${stroke};stroke-width:${((o.sw ?? 3) * this.k).toFixed(3)}px;stroke-linecap:round;stroke-linejoin:round${o.dash ? `;stroke-dasharray:${o.dash.map(v => v * this.k).join(' ')}` : ''}${o.op != null ? `;opacity:${o.op}` : ''}`);
      /* a see-through accent (glass) must still hide what is behind it: a body-coloured copy goes under it */
      if (o.tone === 'acc' && fill !== 'none') { const u = document.createElementNS(NS, tag); for (const n in a) u.setAttribute(n, a[n]); u.setAttribute('style', 'fill:var(--lp-fill);stroke:none'); this.g.appendChild(u); }
      this.g.appendChild(e); return e;
    }
    line(x1, y1, x2, y2, o) { return this._d('line', {x1, y1, x2, y2}, o); }
    rect(x, y, w, h, o = {}) { return this._d('rect', {x, y, width: w, height: h, rx: o.rx || 0}, o); }
    box(cx, cy, w, h, o) { return this.rect(cx - w / 2, cy - h / 2, w, h, o); }
    circle(cx, cy, r, o) { return this._d('circle', {cx, cy, r}, o); }
    ellipse(cx, cy, rx, ry, o) { return this._d('ellipse', {cx, cy, rx, ry}, o); }
    poly(p, o) { return this._d('polyline', {points: pts(p)}, o); }
    shape(p, o) { return this._d('polygon', {points: pts(p)}, o); }
    path(d, o) { return this._d('path', {d}, o); }
    dot(cx, cy, r, o = {}) { return this._d('circle', {cx, cy, r}, Object.assign({fill: C.ink, sw: 1}, o)); }
    /* a thick limb (arm, leg, finger): line-coloured outline, body-coloured core, round ends */
    tube(p, T, o = {}) {
      const d = typeof p === 'string' ? p : 'M ' + p.map(q => q.join(' ')).join(' L '), sw = (o.sw ?? 3) * this.k, acc = o.tone === 'acc';
      const a = this._d('path', {d}, Object.assign({}, o, {fill: 'none', tone: undefined, stroke: acc ? C.accLine : C.ink}));
      a.style.strokeWidth = (T + sw) + 'px'; if (acc) a.classList.add('lp-acc');
      const b = this._d('path', {d}, Object.assign({}, o, {fill: 'none', tone: undefined, stroke: acc ? C.acc : C.fill}));
      b.style.strokeWidth = Math.max(.1, T - sw) + 'px';
      return b;
    }
  }
  /* a drawing layer the size of the canvas; small (the overlay widget) is drawn 1:1, the full screen picture 1.6× */
  const layer = (g, small, z) => {
    const id = 'lpg' + (++LPN);
    const d = div(`left:0;top:0;width:600px;height:340px${z != null ? `;z-index:${z}` : ''}`, g, `<svg width="600" height="340" style="overflow:visible"><defs>
      <linearGradient id="${id}" x1="0" y1="0" x2=".35" y2="1" gradientUnits="objectBoundingBox"><stop offset="0" style="stop-color:var(--lp-shade-a, var(--lp-fill))"/><stop offset="1" style="stop-color:var(--lp-shade-b, var(--lp-fill))"/></linearGradient>
      <linearGradient id="${id}a" x1="0" y1="0" x2=".35" y2="1" gradientUnits="objectBoundingBox"><stop offset="0" style="stop-color:var(--lp-acc)"/><stop offset="1" style="stop-color:color-mix(in srgb, var(--lp-acc) 80%, #000)"/></linearGradient></defs><g></g></svg>`);
    return {el: d, p: new Pen(d.querySelector('svg > g'), small ? 1 : 1 / 1.6, id, d.querySelector('defs'))};
  };
  /* words in the line colour (or on the accent), from the slots only */
  const word = (K, g, txt, cx, y, size, maxW, on = false) => { const w = R4.word(K, g, txt, cx, y, size, null, maxW); w.classList.add('lp-t'); if (on) w.classList.add('lp-on'); return w; };
  const wordL = (K, g, txt, x, y, size, maxW, on = false) => { const w = R6.wordL(K, g, txt, x, y, size, null, maxW); w.classList.add('lp-t'); if (on) w.classList.add('lp-on'); return w; };
  const ico = (g, icon, cx, cy, size, on = false) => { const e = R9.ico(g, icon, cx, cy, size, 'lp-ico'); if (on) e.classList.add('lp-on'); return e; };
  /* an icon + a word on one line, centred on cx */
  const row = (K, g, it, cx, y, size = 28, maxW = 220, on = false) => {
    if (!it) return;
    if (!it.label) { if (it.icon) ico(g, it.icon, cx, y + size * .65, size * 1.2, on); return; }
    const ic = it.icon ? size + 10 : 0, l = wordL(K, g, it.label, 0, y, size, maxW - ic, on), i = it.icon ? ico(g, it.icon, 0, y + size * .65, size, on) : null;
    FITS.push(() => { const tw = ic + l.firstChild.offsetWidth, x0 = cx - tw / 2; if (i) i.style.left = x0 + 'px'; l.style.left = x0 + ic + 'px'; });
  };

  /* ---- the skill's kit: people (pictograms built from tubes), hands, iso box ---- */
  const AD = s => [[s * 31, -90], [s * 47, -38], [s * 53, 14]], LEGS = [[[-15, 10], [-17, 90], [-18, 165]], [[15, 10], [17, 90], [18, 165]]];
  const POSES = {
    stand: {legs: LEGS, back: [AD(-1), AD(1)]},
    wave: {legs: LEGS, back: [AD(-1)], front: [[[31, -90], [78, -98], [92, -154]]]},
    cheer: {legs: LEGS, back: [[[-31, -90], [-64, -128], [-80, -172]], [[31, -90], [64, -128], [80, -172]]]},
    walk: {side: 1, legs: [[[0, 10], [-20, 88], [-46, 160]], [[0, 10], [22, 86], [30, 165]]], back: [[[0, -90], [-20, -44], [-32, 0]]], front: [[[0, -90], [20, -44], [40, -6]]]},
    /* new here, same joints: standing seen from the side · holding a sign at the chest · a selfie · presenting */
    side: {side: 1, legs: [[[0, 10], [-2, 90], [-3, 165]], [[0, 10], [4, 90], [6, 165]]], back: [], front: [[[0, -90], [8, -40], [10, 12]]]},
    hold: {legs: LEGS, front: [[[-31, -90], [-96, -76], [-172, -58]], [[31, -90], [96, -76], [172, -58]]]},
    selfie: {legs: LEGS, back: [AD(-1)], front: [[[31, -90], [84, -124], [116, -172]]]},
    present: {legs: LEGS, back: [AD(-1)], front: [[[31, -90], [74, -118], [116, -146]]]},
  };
  const TORSO_F = 'M -20 -106 L 20 -106 Q 42 -106 42 -84 L 33 12 Q 32 22 23 22 L -23 22 Q -32 22 -33 12 L -42 -84 Q -42 -106 -20 -106 Z';
  const TORSO_S = 'M -10 -106 L 10 -106 Q 27 -106 27 -88 L 21 12 Q 20 22 11 22 L -11 22 Q -20 22 -21 12 L -27 -88 Q -27 -106 -10 -106 Z';
  /* (x, y) = the floor point under the feet, h = height, face 1 right / -1 left, tone 'acc' = the one that matters */
  const person = (p, {x = 0, y = 0, h = 300, pose = 'stand', face = 1, tone} = {}) => {
    const P = POSES[pose], s = h / 350, gy = 178, q = p.child({transform: `translate(${x} ${y}) scale(${s * face} ${s}) translate(0 ${-gy})`}, s);
    const o = tone ? {tone} : {};
    const far = P.side ? {tone: 'soft'} : o;
    P.legs.forEach((l, i) => q.tube(l, 26, i === 0 && P.legs.length > 1 && P.side ? {} : o));
    (P.back || []).forEach(l => q.tube(l, 21, o));
    q.path(P.side ? TORSO_S : TORSO_F, Object.assign({fill: true}, o));
    q.circle(P.side ? 5 : 0, -142, 28, Object.assign({fill: true}, o));
    (P.front || []).forEach(l => q.tube(l, 21, o));
    return q;
  };
  const at = (x, y, h, px, py, face = 1) => { const s = h / 350; return [x + px * s * face, y + (py - 178) * s]; };
  const iso = (X, Y, Z) => [(X - Z) * .866, (X + Z) * .5 - Y];
  const isoBox = (p, {x = 0, y = 0, w = 160, dp = 160, h = 110, tone, tape = false} = {}) => {
    const P = (X, Y, Z) => { const [a, b] = iso(X, Y, Z); return [x + a, y + b]; }, hw = w / 2, hd = dp / 2, o = {fill: true};
    p.shape([P(-hw, 0, hd), P(hw, 0, hd), P(hw, h, hd), P(-hw, h, hd)], o);
    p.shape([P(hw, 0, hd), P(hw, 0, -hd), P(hw, h, -hd), P(hw, h, hd)], o);
    p.shape([P(-hw, h, -hd), P(hw, h, -hd), P(hw, h, hd), P(-hw, h, hd)], tone ? {fill: true, tone} : o);
    if (tape) p.poly([P(0, h, -hd), P(0, h, hd), P(0, h * .55, hd)], {sw: 2, tone: 'soft'});
    return {front: [P(-hw, 0, hd), P(hw, 0, hd), P(hw, h, hd), P(-hw, h, hd)], P};
  };
  /* the skill's parts used here */
  const parts = {
    bubble(p, x, y, w, h, flip = false, o = {}) {       // speech bubble, (x, y) centre
      const l = x - w / 2, t = y - h / 2, r = x + w / 2, b = y + h / 2, rad = Math.min(14, h / 3), tx = flip ? r - w * .25 : l + w * .25, s = flip ? 1 : -1;
      return p.path(`M ${l + rad} ${t} H ${r - rad} Q ${r} ${t} ${r} ${t + rad} V ${b - rad} Q ${r} ${b} ${r - rad} ${b} H ${tx + 10} L ${tx + s * 8} ${b + 14} L ${tx - 6} ${b} H ${l + rad} Q ${l} ${b} ${l} ${b - rad} V ${t + rad} Q ${l} ${t} ${l + rad} ${t} Z`, Object.assign({fill: true, sw: 2.2}, o));
    },
    burst(p, {x = 0, y = 0, r1 = 46, r2 = 74, n = 8, from = -90, spread = 360, sw = 3, tone} = {}) {
      const full = spread >= 360;
      for (let i = 0; i < n; i++) {
        const a = (from + (full ? i * 360 / n : (n === 1 ? 0 : -spread / 2 + i * spread / (n - 1)))) * Math.PI / 180;
        p.line(x + Math.cos(a) * r1, y + Math.sin(a) * r1, x + Math.cos(a) * r2, y + Math.sin(a) * r2, {sw, tone});
      }
    },
    link(p, x1, y1, x2, y2, o = {}) {                    // plain arrow line with a head at (x2, y2)
      const a = Math.atan2(y2 - y1, x2 - x1), h = o.head || 11;
      p.line(x1, y1, x2, y2, Object.assign({sw: 2}, o));
      p.poly([[x2 - Math.cos(a - .5) * h, y2 - Math.sin(a - .5) * h], [x2, y2], [x2 - Math.cos(a + .5) * h, y2 - Math.sin(a + .5) * h]], Object.assign({sw: 2}, o));
    },
    check(p, x, y, s = 1, o = {}) { p.poly([[x - 60 * s, y], [x - 20 * s, y + 42 * s], [x + 66 * s, y - 52 * s]], Object.assign({sw: 6}, o)); },
    cross(p, x, y, s = 1, o = {}) { p.line(x - 40 * s, y - 40 * s, x + 40 * s, y + 40 * s, Object.assign({sw: 6, tone: 'neg'}, o)); p.line(x + 40 * s, y - 40 * s, x - 40 * s, y + 40 * s, Object.assign({sw: 6, tone: 'neg'}, o)); },
    floor(p, x1, x2, y) { p.line(x1, y, x2, y, {sw: 2.2, tone: 'soft'}); },
  };
  /* the skill's kit.bust / kit.team / kit.holdPhone */
  const bust = (p, {x = 0, y = 0, size = 200, tone, op} = {}) => {
    const s = size / 330, q = p.child({transform: `translate(${x} ${y}) scale(${s})`}, s), o = {fill: true, tone};
    if (op) q.g.style.opacity = op;
    q.path('M -142 165 L -142 112 Q -142 22 -46 22 L 46 22 Q 142 22 142 112 L 142 165 Z', o); q.circle(0, -88, 74, o); return q;
  };
  const team = (p, {x = 0, y = 0, size = 360, tone, back} = {}) => {
    const s = size / 420, q = p.child({transform: `translate(${x} ${y}) scale(${s})`}, s);
    bust(q, {x: -125, y: -26, size: 230, op: back}); bust(q, {x: 125, y: -26, size: 230, op: back}); bust(q, {x: 0, y: 26, size: 300, tone}); return q;
  };
  const holdPhone = (p, {x = 0, y = 0, size = 360} = {}) => {
    const s = size / 400, q = p.child({transform: `translate(${x} ${y}) scale(${s})`}, s);
    q.rect(-94, 34, 188, 140, {rx: 48, fill: true});
    q.rect(-82, -198, 164, 300, {rx: 26, fill: true});
    q.rect(-71, -186, 142, 276, {rx: 17, sw: 1.6, tone: 'soft'});
    q.line(-14, -175, 14, -175, {sw: 4});
    return {q, s, after() {
      [-34, 2, 38].forEach(yy => q.tube([[122, yy + 6], [70, yy]], 30, {sw: 2.6}));
      q.tube('M -66 152 Q -100 92 -60 34', 34, {sw: 2.6});
      q.rect(-58, 160, 116, 40, {rx: 8, fill: true});
    }};
  };
  /* a word struck through in red (the wrong one) */
  const strike = (K, g, txt, cx, y, size, maxW) => {
    const w = word(K, g, txt, cx, y, size, maxW); w.style.opacity = .7;
    const st = div(`left:0;top:${y + size * .68}px;height:4px;border-radius:2px;background:var(--lp-neg)`, g);
    FITS.push(() => { const sp = w.firstChild, ww = sp.offsetWidth + 14; st.style.left = (cx - ww / 2) + 'px'; st.style.width = ww + 'px'; });
    return w;
  };
  return {C, Pen, layer, word, wordL, ico, row, person, at, iso, isoBox, parts, bust, team, holdPhone, strike};
})();
const S11 = {human: icon => /^(user|users|baby|person|contact|smile)/.test(icon ?? 'user')};

/* ================= people and hands (units: a person is 100 tall, feet at 0, up is negative) ================= */
const HU = (() => {
  const E = (cx, cy, rx, ry = rx) => `M ${cx - rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx + rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx - rx} ${cy} Z`;
  const mir = d => d.replace(/(-?\d+\.?\d*) (-?\d+\.?\d*)/g, (m, x, y) => `${-x} ${y}`);
  const F = {
    head: E(0, -91.6, 7.4), neck: 'M -3.4 -85 L 3.4 -85 L 3.7 -78 L -3.7 -78 Z',
    torso: 'M -6 -80.5 L 6 -80.5 Q 13.6 -80 14.6 -73 L 13.4 -58 L 12.3 -45 L -12.3 -45 L -13.4 -58 L -14.6 -73 Q -13.6 -80 -6 -80.5 Z',
    hips: 'M -12.3 -46.5 L 12.3 -46.5 L 12 -39 L -12 -39 Z',
    legL: 'M -12.1 -40.5 L -0.9 -40.5 L -1.8 -5.8 L -10.6 -5.8 Z', shoeL: 'M -12.2 0 L -12.2 -2.8 Q -12.2 -6.4 -8.6 -6.4 L -3 -6.4 Q -1 -6.4 -1 -3.4 L -1 0 Z',
    armDownL: 'M -12.8 -75 Q -15.2 -64 -15.5 -58 L -15.8 -48', handDownL: E(-15.9, -44.6, 3.3, 4.1),
  };
  const front = {head: F.head, neck: F.neck, torso: F.torso, hips: F.hips};
  const legs = [{d: F.legL}, {d: mir(F.legL)}, {d: F.shoeL}, {d: mir(F.shoeL)}];
  const fDet = ['M -3.7 -80.3 L 0 -76.2 L 3.7 -80.3', 'M -12.2 -45.6 L 12.2 -45.6', 'M 0 -45.4 L 0 -40.5', 'M -11.6 -2.7 L -1.6 -2.7', 'M 11.6 -2.7 L 1.6 -2.7'];
  const poses = {
    stand: {arms: [{d: F.armDownL, w: 6.2}, {d: mir(F.armDownL), w: 6.2}], hands: [{d: F.handDownL}, {d: E(15.9, -44.6, 3.3, 4.1)}]},
    /* the right hand up and open (palm to us), its thumb out to the side */
    wave: {arms: [{d: F.armDownL, w: 6.2}, {d: 'M 12.8 -75 L 21.4 -80 L 24.8 -93.5', w: 6.2}],
      hands: [{d: F.handDownL}, {d: E(25.2, -97.6, 3.4, 3.8)}, {d: 'M 22.7 -100 L 22.4 -104.6', w: 1.9}, {d: 'M 24.5 -100.6 L 24.5 -105.8', w: 1.9}, {d: 'M 26.3 -100.6 L 26.6 -105.4', w: 1.9}, {d: 'M 27.9 -99.8 L 28.6 -103.8', w: 1.8}, {d: 'M 22.3 -96.2 L 20 -99.4', w: 2}],
      det: []},
    /* both arms out to the sides of a sign held at the chest; the hands are drawn in front of the sign (handsFront) */
    hold: {arms: [{d: 'M -12.8 -75 L -26 -69 L -38 -64.5', w: 6.2}, {d: 'M 12.8 -75 L 26 -69 L 38 -64.5', w: 6.2}], hands: [],
      front: [{d: 'M -44 -69 Q -44 -71 -42 -71 L -36.4 -71 Q -34.6 -71 -34.6 -69 L -34.6 -58.6 Q -34.6 -56.6 -36.4 -56.6 L -42 -56.6 Q -44 -56.6 -44 -58.6 Z'}, {d: 'M 44 -69 Q 44 -71 42 -71 L 36.4 -71 Q 34.6 -71 34.6 -69 L 34.6 -58.6 Q 34.6 -56.6 36.4 -56.6 L 42 -56.6 Q 44 -56.6 44 -58.6 Z'}],
      frontDet: ['M -43 -67.4 L -35.6 -67.4', 'M -43 -63.8 L -35.6 -63.8', 'M -43 -60.2 L -35.6 -60.2', 'M 43 -67.4 L 35.6 -67.4', 'M 43 -63.8 L 35.6 -63.8', 'M 43 -60.2 L 35.6 -60.2']},
    /* the right arm points up to the right, the index finger out */
    present: {arms: [{d: F.armDownL, w: 6.2}, {d: 'M 12.8 -75 L 22.2 -80 L 31.2 -86', w: 6.2}],
      hands: [{d: F.handDownL}, {d: E(33, -87.4, 3.6, 3.4)}, {d: 'M 35.2 -88.6 L 40.4 -91.4', w: 2.4}, {d: 'M 31.6 -85.2 L 33.4 -84.2', w: 2.2}]},
  };
  const side = {
    parts: [{d: E(0.8, -91.6, 7.4)}, {d: 'M 7.4 -94.4 L 10.4 -90 Q 10.8 -89 9.6 -88.8 L 7.6 -88.6 Z'}, {d: 'M -2.6 -85 L 3.4 -85 L 3.4 -78 L -2.8 -78 Z'},
      {d: 'M -6.8 -80.5 L 3.4 -80.5 Q 8.8 -79.6 8.9 -73 L 7.9 -58 L 7.1 -45 L -7.5 -45 L -8.1 -58 L -9.1 -73 Q -9.3 -80.2 -6.8 -80.5 Z'},
      {d: 'M -7.5 -46.5 L 7.1 -46.5 L 6.9 -39 L -7.3 -39 Z'},
      {d: 'M -7.2 -40.5 L 2.4 -40.5 L 1.6 -5.8 L -6.2 -5.8 Z'}, {d: 'M -2.6 -40.5 L 6.8 -40.5 L 5.4 -5.8 L -2.2 -5.8 Z'},
      {d: 'M -8 0 L -8 -3.4 Q -8 -6.8 -4.6 -6.8 L 3.6 -6.8 Q 9.8 -6.4 11.2 -2.6 L 11.2 0 Z'},
      {d: 'M 0.4 -76 Q 1.6 -66 3.4 -60 L 6.4 -50', w: 6}, {d: E(7.4, -46.6, 3.1, 3.9)}],
    det: ['M -1.4 -80.3 L 3.2 -76.8', 'M -7.4 -45.6 L 7 -45.6', 'M -2.4 -38.5 L -2 -8', 'M -7.6 -2.6 L 11 -2.6', 'M 4.6 -92.6 Q 3 -91 4.4 -89.4'],
  };
  return {
    /* a person: (x, y) = the floor point under the feet, h = height in px; returns {front} for things held in front */
    person(p, {x, y, h, pose = 'stand', face = 1, tone} = {}) {
      const s = h / 100, q = p.child({transform: `translate(${x} ${y}) scale(${(s * face).toFixed(4)} ${s.toFixed(4)})`}, s);
      if (pose === 'side') { q.figure(side.parts, {tone, box: [-20, -100, 20, 0], details: side.det}); return {q}; }
      const P = poses[pose], parts = [...P.arms.filter(a => pose === 'hold'), {d: front.head}, {d: front.neck}, {d: front.torso}, {d: front.hips}, ...legs, ...P.arms.filter(a => pose !== 'hold'), ...P.hands];
      q.figure(parts, {tone, box: [-30, -100, 30, 0], details: [...fDet, ...(P.det ?? [])]});
      return {q, front: () => P.front && q.figure(P.front, {tone, box: [-44, -72, 44, -56], details: P.frontDet, dsw: 1.3})};
    },
    /* head and shoulders (a member of a group): (x, y) = the middle of the shoulders' bottom, size = height */
    bust(p, {x, y, size, tone, op}) {
      const s = size / 130, q = p.child({transform: `translate(${x} ${y}) scale(${s})`}, s); if (op != null) q.g.style.opacity = op;
      q.figure([{d: E(0, -96, 26)}, {d: 'M -11 -74 L 11 -74 L 12 -58 L -12 -58 Z'},
        {d: 'M -60 0 L -60 -22 Q -60 -52 -28 -56 L -10 -61 L 10 -61 L 28 -56 Q 60 -52 60 -22 L 60 0 Z'}],
        {tone, box: [-60, -122, 60, 0], details: ['M -14 -60 L 0 -44 L 14 -60', 'M 0 -44 L 0 -2', 'M -40 -40 Q -44 -24 -44 -4', 'M 40 -40 Q 44 -24 44 -4']});
      return q;
    },
    E,
  };
})();

/* ================= B10 คน: who? {icon, label?}, label?, tags? [≤2] ================= */
/* 1 · the one this is for raises a hand and lights up; the kind of person under it */
R3.both('B10', 'raise', 'คนที่ใช่ยกมือ', (K, s, T, g, small) => {
  const {p} = LP.layer(g, small);
  HU.person(p, {x: 300, y: 272, h: 254, pose: 'wave', tone: 'acc'});
  const w = s.label ?? s.who?.label; if (w) LP.word(K, g, w, 300, 280, 36, 340);
});

/* 2 · a person waiting at arrivals holds up a cardboard sign; on the sign is the kind of person */
R3.both('B10', 'sign', 'คนถือป้ายรอรับ บนป้ายคือคนกลุ่มนี้', (K, s, T, g, small) => {
  const X = 300, G = 338, H = 330, {p} = LP.layer(g, small);
  const man = HU.person(p, {x: X, y: G, h: H, pose: 'hold'});
  p.rect(X - 140, 80, 280, 142, {rx: 4, fill: 'shade'});
  p.line(X - 132, 88, X + 132, 88, {sw: 1.4, tone: 'soft'}); p.line(X - 132, 214, X + 132, 214, {sw: 1.4, tone: 'soft'});
  man.front();
  const w = s.label ?? s.who?.label; if (w) LP.word(K, g, w, X, 124, 44, 236);
});

/* ================= B13 เคล็ดลับ: secret {icon, label?} ================= */
/* 3 · a secret file with a padlock on the cover: the paper with the tip slides up out of it */
R3.both('B13', 'dossier', 'แฟ้มลับ กระดาษเคล็ดลับเลื่อนออกมา', (K, s, T, g, small) => {
  const it = s.secret ?? {icon: 'lightbulb'}, back = LP.layer(g, small).p;
  back.path('M 84 72 Q 84 60 96 60 L 210 60 Q 216 60 220 65 L 234 82 L 504 82 Q 516 82 516 94 L 516 320 Q 516 332 504 332 L 96 332 Q 84 332 84 320 Z', {fill: 'shade'});
  back.rect(136, 14, 328, 250, {rx: 3, fill: true}); back.line(156, 150, 444, 150, {sw: 1.4, tone: 'soft'}); back.line(156, 172, 380, 172, {sw: 1.4, tone: 'soft'});
  back.path('M 168 6 L 168 46 Q 168 54 176 54 Q 184 54 184 46 L 184 14 Q 184 10 180 10 Q 176 10 176 14 L 176 40', {sw: 2});
  LP.ico(g, it.icon, 300, 56, 50); if (it.label) LP.word(K, g, it.label, 300, 86, 40, 290);
  const fr = LP.layer(g, small).p;
  fr.path('M 96 188 L 504 168 Q 516 168 516 180 L 516 320 Q 516 332 504 332 L 96 332 Q 84 332 84 320 L 84 200 Q 84 188 96 188 Z', {fill: 'shade'});
  fr.line(94, 196, 506, 176, {sw: 1.4, tone: 'soft'});
  /* the padlock: a thick shackle, a shaded body, the keyhole */
  fr.path('M 280 252 L 280 236 Q 280 214 300 214 Q 320 214 320 236 L 320 252', {sw: 12}); fr.path('M 280 252 L 280 236 Q 280 214 300 214 Q 320 214 320 236 L 320 252', {sw: 6, stroke: 'var(--lp-fill)'});
  fr.rect(268, 248, 64, 52, {rx: 8, fill: 'shade', sw: 3}); fr.circle(300, 268, 6, {sw: 2}); fr.line(300, 274, 300, 286, {sw: 3});
});

/* 4 · a torch in the dark: the beam sweeps across and stops on the tip, which lights up */
R3.both('B13', 'torch', 'ไฟฉายส่องหาในที่มืด เจอเคล็ดลับ', (K, s, T, g, small) => {
  const it = s.secret ?? {icon: 'lightbulb'}, {p} = LP.layer(g, small);
  p.path('M 246 226 L 340 18 L 548 18 L 548 196 L 268 258 Z', {fill: 'var(--lp-acc)', stroke: 'none', op: .24});
  p.rect(352, 32, 186, 148, {rx: 16, fill: 'shade', tone: 'acc'}); p.rect(362, 42, 166, 128, {rx: 10, tone: 'acc', fill: 'none', sw: 1.4});
  LP.ico(g, it.icon, 445, 78, 50, true); if (it.label) LP.word(K, g, it.label, 445, 108, 30, 160, true);
  const tq = p.child({transform: 'rotate(-32 190 284)'});
  tq.rect(30, 258, 148, 52, {rx: 10, fill: 'shade'}); tq.line(36, 268, 172, 268, {sw: 1.4, tone: 'soft'});
  [64, 82, 100, 118].forEach(x => tq.line(x, 272, x, 302, {sw: 1.6, tone: 'soft'}));
  tq.rect(136, 248, 26, 12, {rx: 4, fill: 'shade', sw: 2.2});
  tq.path('M 176 252 L 230 236 Q 240 234 240 244 L 240 324 Q 240 334 230 332 L 176 316 Z', {fill: 'shade'});
  tq.line(184, 258, 184, 310, {sw: 1.4, tone: 'soft'});
  tq.rect(238, 232, 16, 104, {rx: 6, fill: 'shade', tone: 'acc'});
});

/* ================= B20 ความสัมพันธ์: a {icon, label?}, b {icon, label?}, label?, cut? ================= */
/* 5 · two people turn to face each other; the link under them. When it is over they stand back to back */
R3.both('B20', 'face', 'สองคนหันหน้าเข้าหากัน (จบกัน = หันหลังให้กัน)', (K, s, T, g, small) => {
  const a = s.a ?? {icon: 'user'}, b = s.b ?? {icon: 'user'}, cut = !!s.cut, G = 280, H = 266, {p} = LP.layer(g, small);
  const one = (it, x, face) => { if (S11.human(it.icon)) HU.person(p, {x, y: G, h: H, pose: 'side', face});
    else { p.rect(x - 76, G - 200, 152, 200, {rx: 10, fill: 'shade'}); LP.ico(g, it.icon, x, G - 100, 80); } };
  one(a, 222, cut ? -1 : 1); one(b, 378, cut ? 1 : -1);
  if (cut) LP.parts.cross(p, 300, 150, .36);
  if (s.label) LP.word(K, g, s.label, 300, 286, 34, 320);
});

/* 6 · two hands meet in a handshake on the key word; when it is over they let go */
R3.both('B20', 'shake', 'มือสองข้างจับมือกัน (จบกัน = ปล่อยมือ)', (K, s, T, g, small) => {
  const cut = !!s.cut, d = cut ? 42 : 0, {p} = LP.layer(g, small);
  const q = p.child({transform: 'translate(300 140) scale(1.12)'}, 1.12), box = [-200, -60, 200, 60];
  const L = q.child({transform: `translate(${-d} 0)`}), R = q.child({transform: `translate(${d} 0)`});
  /* the left person's arm: sleeve, cuff, palm (behind the right hand's fingers) */
  L.figure([{d: 'M -300 -40 L -132 -36 L -132 38 L -300 42 Z'}], {box, details: ['M -290 -16 L -150 -14', 'M -250 20 L -160 22']});
  L.figure([{d: 'M -138 -44 L -108 -46 L -108 46 L -138 44 Z'}], {tone: 'acc', box, details: ['M -128 -40 L -128 40']});
  L.figure([{d: 'M -110 -36 Q -70 -42 -30 -36 L -6 -30 Q 8 -24 8 -10 L 6 24 Q 2 38 -16 38 L -110 34 Z'}], {box});
  /* the right person's arm and palm */
  R.figure([{d: 'M 300 -42 L 132 -38 L 132 36 L 300 40 Z'}], {box, details: ['M 290 -18 L 150 -16', 'M 250 18 L 160 20']});
  R.figure([{d: 'M 138 -46 L 108 -44 L 108 44 L 138 46 Z'}], {tone: 'acc', box, details: ['M 128 -40 L 128 40']});
  R.figure([{d: 'M 110 -38 L 40 -36 Q 14 -34 10 -16 L 10 20 Q 14 36 40 38 L 110 36 Z'}], {box});
  /* the right hand's four fingers wrap over the left palm (in front); the left thumb lies over the right hand */
  R.figure([0, 1, 2, 3].map(k => ({d: `M 30 ${-22 + k * 15} L ${-62 + k * 6} ${-20 + k * 15.5}`, w: 14})), {box, details: [0, 1, 2].map(k => `M ${-56 + k * 6} ${-12.5 + k * 15.5} L 22 ${-14.5 + k * 15}`)});
  L.figure([{d: 'M -84 -34 Q -54 -58 -12 -52 L 22 -46', w: 17}], {box, details: ['M 8 -52 Q 16 -50 18 -44']});
  if (s.label) LP.word(K, g, s.label, 300, 280, 36, 320);
});

/* ================= B21 สถานที่: place {icon, label?}, spots? [1-2 {icon, label?}] ================= */
/* 7 · a big road sign on two posts slides in as if driving past, and stops: the name of the place */
R3.both('B21', 'roadsign', 'ป้ายริมทางบนเสาสองต้น บอกชื่อที่', (K, s, T, g, small) => {
  const pl = s.place ?? {icon: 'map-pin'}, {p} = LP.layer(g, small);
  [150, 426].forEach(x => { p.rect(x, 166, 24, 158, {rx: 3, fill: 'shade'}); p.line(x + 7, 176, x + 7, 314, {sw: 1.4, tone: 'soft'}); p.rect(x - 10, 318, 44, 16, {rx: 3, fill: 'shade'}); });
  p.rect(60, 14, 480, 168, {rx: 14, fill: 'shade', tone: 'acc'}); p.rect(74, 28, 452, 140, {rx: 8, tone: 'acc', fill: 'none', sw: 2.4});
  [[86, 40], [514, 40], [86, 156], [514, 156]].forEach(([x, y]) => p.circle(x, y, 4, {tone: 'acc', fill: 'none', sw: 1.6}));
  LP.ico(g, pl.icon, 300, 62, 56, true);
  if (pl.label) LP.word(K, g, pl.label, 300, 94, 48, 420, true);
});

/* 8 · a hand holds up a phone and takes a picture of the place: the place is on the screen */
R3.both('B21', 'snap', 'มือถือมือถือ ถ่ายรูปสถานที่', (K, s, T, g, small) => {
  const pl = s.place ?? {icon: 'map-pin'}, {p} = LP.layer(g, small), box = [150, 0, 450, 340];
  /* the hand behind the phone: the wrist from the lower left, the palm across the back of the phone */
  p.figure([{d: 'M 172 344 L 208 284 Q 224 260 260 251 L 362 236 Q 392 236 396 266 L 392 300 Q 384 330 350 334 L 270 344 Z'}], {box: [160, 220, 400, 344], details: ['M 186 322 L 278 332']});
  /* the phone: shaded case, the screen, the camera, a side button */
  p.rect(210, 10, 182, 300, {rx: 26, fill: 'shade'}); p.rect(392, 70, 6, 40, {rx: 3, fill: 'shade', sw: 2});
  p.rect(222, 22, 158, 276, {rx: 18, fill: true, sw: 1.8}); p.rect(282, 30, 38, 10, {rx: 5, fill: 'shade', sw: 1.6});
  [[238, 52, 1, 1], [364, 52, -1, 1], [238, 238, 1, -1], [364, 238, -1, -1]].forEach(([x, y, dx, dy]) => p.poly([[x, y + 22 * dy], [x, y], [x + 22 * dx, y]], {sw: 3, tone: 'acc', fill: 'none'}));
  p.circle(301, 274, 13, {sw: 2.2}); p.circle(301, 274, 8, {fill: 'var(--lp-acc)', stroke: 'none'});
  LP.ico(g, pl.icon, 301, 112, 66); if (pl.label) LP.word(K, g, pl.label, 301, 156, 30, 134);
  /* fingertips round the right edge, the thumb over the left edge */
  p.figure([0, 1, 2, 3].map(k => ({d: `M 378 ${150 + k * 24} L ${398 - (k === 3 ? 4 : 0)} ${152 + k * 24}`, w: 19})), {box, details: [0, 1, 2, 3].map(k => `M 394 ${145 + k * 24} Q ${401 - (k === 3 ? 4 : 0)} ${149 + k * 24} ${398 - (k === 3 ? 4 : 0)} ${157 + k * 24}`)});
  p.figure([{d: 'M 214 300 Q 210 262 222 238 L 240 208', w: 23}, {d: 'M 206 330 Q 200 300 214 290 L 234 280', w: 30}], {box: [180, 200, 260, 340], details: ['M 232 206 Q 242 208 244 216', 'M 216 262 Q 222 256 228 258']});
});

/* ================= B12 เหตุกับผล: items [3 {icon, label?, tone?}], end? ================= */
/* 9 · a stone drops into still water; the rings spread out, the outer one is the effect */
R3.both('B12', 'ripple', 'หินตกน้ำ วงคลื่นกระเพื่อมออกไปทีละวง', (K, s, T, g, small) => {
  const it = (s.items ?? []).slice(0, 3), neg = it[2]?.tone === 'neg', C = [300, 206], {p} = LP.layer(g, small);
  p.ellipse(C[0], C[1], 250, 72, {fill: 'shade'});
  p.ellipse(C[0], C[1], 54, 15, {sw: 2.6}); p.ellipse(C[0], C[1], 128, 36, {sw: 2, tone: 'soft'});
  p.ellipse(C[0], C[1], 208, 58, {sw: 5, tone: neg ? 'neg' : 'acc', fill: 'none'});
  [[-30, -24, 4], [26, -28, 5], [4, -38, 3.5]].forEach(([dx, dy, r]) => p.ellipse(C[0] + dx, C[1] + dy, r * .8, r, {fill: 'shade', sw: 1.8}));
  p.line(C[0], 104, C[0], C[1] - 46, {sw: 1.8, tone: 'soft', dash: [6, 10]});
  p.path('M 254 62 C 250 30 278 12 304 14 C 336 16 354 36 350 62 C 346 90 320 100 300 100 C 274 100 256 90 254 62 Z', {fill: 'shade'});
  p.path('M 272 36 Q 286 24 306 26', {sw: 2, op: .7}); p.path('M 262 74 Q 280 92 312 90', {sw: 1.4, tone: 'soft'});
  if (it[0]) LP.ico(g, it[0].icon, 302, 58, 36);
  if (it[2]?.label) { const w = LP.word(K, g, it[2].label, 300, 286, 36, 360); if (neg) w.style.color = 'var(--lp-neg)'; }
});

/* 10 · a toaster: the lever goes down (the cause) and the toast pops up (the effect) */
R3.both('B12', 'toaster', 'เครื่องปิ้งขนมปัง กดคันโยก ขนมปังเด้งขึ้น', (K, s, T, g, small) => {
  const it = (s.items ?? []).slice(0, 3), neg = it[2]?.tone === 'neg', {p} = LP.layer(g, small);
  [262, 300, 338].forEach((x, k) => p.path(`M ${x} 36 C ${x - 8} 28 ${x + 8} 20 ${x} ${12 - k * 2}`, {sw: 1.8, tone: 'soft'}));
  const bread = `M 210 170 L 210 86 C 190 82 184 58 198 46 C 214 32 240 38 254 46 C 272 36 328 36 346 46 C 360 38 386 32 402 46 C 416 58 410 82 390 86 L 390 170 Z`;
  p.path(bread, {fill: 'shade', tone: neg ? undefined : 'acc'}); if (neg) p.path(bread, {tone: 'neg', sw: 3.2});
  p.child({transform: 'translate(300 108) scale(.9) translate(-300 -108)'}, .9).path(bread, {sw: 1.6, tone: neg ? 'neg' : 'soft'});
  if (it[2]?.icon) LP.ico(g, it[2].icon, 300, it[2].label ? 62 : 80, 32, !neg);
  if (it[2]?.label) { const w = LP.word(K, g, it[2].label, 300, 76, 24, 150, !neg); if (neg) w.style.color = 'var(--lp-neg)'; }
  p.path('M 128 296 L 128 156 Q 128 116 168 116 L 432 116 Q 472 116 472 156 L 472 296 Z', {fill: 'shade'});
  p.rect(196, 112, 208, 12, {rx: 6, fill: true, sw: 2.2});
  p.path('M 152 150 Q 148 160 148 190 L 148 250', {sw: 2, op: .65}); p.line(164, 160, 164, 220, {sw: 1.4, op: .45});
  p.line(446, 140, 446, 270, {sw: 1.6, tone: 'soft'});
  p.rect(436, 230, 66, 22, {rx: 10, fill: 'shade', sw: 2.4});
  p.circle(300, 214, 32, {fill: 'shade', sw: 2.6});
  for (let k = 0; k < 7; k++) { const a = (-210 + k * 40) * Math.PI / 180; p.line(300 + Math.cos(a) * 40, 214 + Math.sin(a) * 40, 300 + Math.cos(a) * 47, 214 + Math.sin(a) * 47, {sw: 1.6, tone: 'soft'}); }
  p.line(300, 214, 316, 196, {sw: 2.6});
  p.line(170, 270, 430, 270, {sw: 1.4, tone: 'soft'});
  p.rect(116, 292, 368, 22, {rx: 9, fill: 'shade'});
  p.rect(150, 314, 44, 14, {rx: 5, fill: true}); p.rect(406, 314, 44, 14, {rx: 5, fill: true});
});

/* ================= B05 ถูกกับผิด: wrong {icon, label?}, right {icon, label?} ================= */
/* 11 · a USB plug: the wrong way up it will not go in; turned the right way, it goes in */
R3.both('B05', 'usb', 'หัว USB ด้านผิดเสียบไม่เข้า ด้านถูกเสียบได้', (K, s, T, g, small) => {
  const w = s.wrong ?? {icon: 'x'}, r = s.right ?? {icon: 'check'}, {p} = LP.layer(g, small);
  p.rect(-20, 166, 112, 26, {rx: 13, fill: 'shade'}); p.line(-10, 172, 84, 172, {sw: 1.4, op: .5});
  p.rect(84, 158, 26, 42, {rx: 8, fill: 'shade'});
  p.rect(104, 136, 140, 86, {rx: 14, fill: 'shade', tone: 'acc'});
  [0, 1, 2, 3].forEach(k => p.line(122 + k * 9, 150, 122 + k * 9, 208, {sw: 1.6, tone: 'acc', op: .6}));
  p.rect(242, 148, 92, 62, {rx: 3, fill: 'shade'}); p.line(246, 156, 330, 156, {sw: 1.4, tone: 'soft'});
  p.rect(266, 164, 14, 12, {rx: 2, sw: 2}); p.rect(294, 164, 14, 12, {rx: 2, sw: 2});
  /* the port, on the side of a device (in front of the metal tip) */
  p.rect(292, 112, 236, 134, {rx: 16, fill: 'shade'}); p.rect(300, 120, 220, 118, {rx: 11, sw: 1.4, tone: 'soft'});
  p.rect(314, 140, 192, 78, {rx: 6, fill: true, sw: 2.4}); p.rect(332, 160, 156, 20, {rx: 4, fill: 'shade', sw: 1.6});
  LP.ico(g, r.icon, 196, 179, 40, true);
  if (r.label) LP.word(K, g, r.label, 300, 270, 38, 360);
  if (w.label) LP.strike(K, g, w.label, 300, 40, 30, 300);
});

/* 12 · one ticket gate: the right card is tapped and the gate opens (the wrong one, struck, above) */
R3.both('B05', 'gate', 'ประตูกั้นรถไฟฟ้า บัตรถูกแตะแล้วเปิด', (K, s, T, g, small) => {
  const w = s.wrong ?? {icon: 'x'}, r = s.right ?? {icon: 'check'}, {p} = LP.layer(g, small);
  p.path('M 214 176 L 262 172 Q 270 172 270 180 L 270 212 Q 270 220 262 220 L 214 216 Z', {fill: 'shade', tone: 'acc'});
  p.path('M 386 176 L 338 172 Q 330 172 330 180 L 330 212 Q 330 220 338 220 L 386 216 Z', {fill: 'shade', tone: 'acc'});
  [[110, 214], [386, 490]].forEach(([x0, x1], k) => {
    p.path(`M ${x0} 336 L ${x0} 124 Q ${x0} 100 ${x0 + 24} 100 L ${x1 - 24} 100 Q ${x1} 100 ${x1} 124 L ${x1} 336`, {fill: 'shade'});
    p.line(x0 + 10, 132, x1 - 10, 132, {sw: 1.4, tone: 'soft'}); p.line(x0 + 10, 300, x1 - 10, 300, {sw: 1.4, tone: 'soft'});
    p.rect(x0 + 18, 108, x1 - x0 - 36, 16, {rx: 5, fill: true, sw: 2}); });
  /* the reader on the left gate: a pad with the tap sign; the right card lies on it */
  p.rect(124, 140, 76, 46, {rx: 8, fill: true, sw: 2});
  [10, 17, 24].forEach(rr => p.path(`M ${150 + rr * .7} ${163 - rr * .7} A ${rr} ${rr} 0 0 1 ${150 + rr * .7} ${163 + rr * .7}`, {sw: 1.6, tone: 'soft'}));
  const cq = p.child({transform: 'rotate(-8 196 70)'});
  cq.rect(116, 18, 168, 108, {rx: 12, fill: 'shade', tone: 'acc'}); cq.rect(134, 34, 28, 22, {rx: 4, tone: 'acc', fill: 'none', sw: 1.6});
  const hold = R6.group(g); hold.style.transformOrigin = '196px 70px'; hold.style.transform = 'rotate(-8deg)';
  LP.ico(hold, r.icon, 214, 56, 36, true); if (r.label) LP.word(K, hold, r.label, 200, 80, 28, 150, true);
  if (w.label) LP.strike(K, g, w.label, 440, 40, 28, 200);
});

/* ================= B11 คำพูด: kind, quote, mood?, react?, gone? ================= */
/* 13 · a rotary home phone: the handset is picked up and what was said comes out of it */
R3.both('B11', 'phone', 'โทรศัพท์บ้าน ยกหู คำพูดออกมา', (K, s, T, g, small) => {
  const {p} = LP.layer(g, small);
  p.path('M 64 330 C 40 330 36 310 52 300 C 30 296 30 278 48 272 C 28 266 30 248 50 244 C 32 236 38 218 58 218 C 46 206 58 190 76 194', {sw: 2, tone: 'soft'});
  p.path('M 84 322 L 114 214 Q 120 196 140 196 L 308 196 Q 328 196 334 214 L 364 322 Q 368 334 354 334 L 94 334 Q 80 334 84 322 Z', {fill: 'shade'});
  p.line(104, 314, 344, 314, {sw: 1.4, tone: 'soft'});
  p.circle(224, 266, 44, {fill: 'shade', sw: 2.4}); p.circle(224, 266, 16, {fill: true, sw: 1.8});
  for (let k = 0; k < 10; k++) { const a = (-120 + k * 28) * Math.PI / 180; p.circle(224 + Math.cos(a) * 31, 266 + Math.sin(a) * 31, 6, {sw: 1.6, fill: true}); }
  const hs = p.child({transform: 'rotate(-12 224 136)'});
  hs.path('M 112 138 Q 112 110 140 110 L 308 110 Q 336 110 336 138 L 336 150 Q 336 170 316 170 L 290 170 Q 278 170 276 158 L 272 144 L 176 144 L 172 158 Q 170 170 158 170 L 132 170 Q 112 170 112 150 Z', {fill: 'shade'});
  hs.line(150, 122, 300, 122, {sw: 1.4, op: .5});
  [[136, 158], [146, 162], [306, 158], [316, 162]].forEach(([x, y]) => hs.dot(x, y, 2.4, {fill: 'var(--lp-soft)', stroke: 'none'}));
  LP.parts.bubble(p, 440, 80, 216, 110, false, {sw: 2.6}); p.line(350, 40, 520, 40, {sw: 1.4, op: 0});
  if (s.quote) LP.word(K, g, s.quote, 440, 56, 38, 190);
});

/* 14 · a typewriter types the message onto the paper, which rolls up out of it */
R3.both('B11', 'typewriter', 'เครื่องพิมพ์ดีดพิมพ์ข้อความ กระดาษเลื่อนขึ้น', (K, s, T, g, small) => {
  const {p} = LP.layer(g, small);
  p.rect(160, 6, 280, 184, {rx: 3, fill: true}); p.line(184, 130, 416, 130, {sw: 1.4, tone: 'soft'}); p.line(184, 152, 340, 152, {sw: 1.4, tone: 'soft'});
  if (s.quote) LP.word(K, g, s.quote, 300, 52, 44, 240);
  p.rect(108, 158, 384, 40, {rx: 20, fill: 'shade'}); p.line(130, 168, 470, 168, {sw: 1.4, op: .5});
  p.rect(70, 164, 34, 28, {rx: 10, fill: 'shade'}); p.rect(496, 164, 34, 28, {rx: 10, fill: 'shade'});
  p.path('M 100 214 Q 100 200 116 200 L 484 200 Q 500 200 502 214 L 528 312 Q 532 334 510 334 L 90 334 Q 68 334 72 312 Z', {fill: 'shade'});
  p.line(92, 226, 508, 226, {sw: 1.4, tone: 'soft'});
  [[146, 248, 8], [166, 280, 7]].forEach(([x0, y, n]) => { for (let k = 0; k < n; k++) { p.circle(x0 + k * 42 + 12, y, 13, {fill: 'shade', sw: 2.2}); p.circle(x0 + k * 42 + 12, y, 8, {sw: 1.4, tone: 'soft'}); } });
  p.rect(214, 306, 172, 16, {rx: 8, fill: 'shade', sw: 2.2});
});

/* ================= B01 ตัวเลขเด่น: value, unit?, icon?, dir?, money? ================= */
/* 15 · a price tag hangs on its string, swings and comes to rest: the amount on it (money only) */
R3.both('B01', 'pricetag', 'ป้ายราคาแขวน แกว่งแล้วหยุด', (K, s, T, g, small) => {
  const {p} = LP.layer(g, small);
  const tg = p.child({transform: 'rotate(-6 300 74)'});
  tg.path('M 278 44 Q 300 30 322 44 L 436 108 Q 448 116 448 130 L 448 318 Q 448 334 432 334 L 168 334 Q 152 334 152 318 L 152 130 Q 152 116 164 108 Z', {fill: 'shade'});
  tg.path('M 280 56 Q 300 44 320 56 L 428 116 Q 436 122 436 132 L 436 312 Q 436 322 426 322 L 174 322 Q 164 322 164 312 L 164 132 Q 164 122 172 116 Z', {sw: 1.4, tone: 'soft'});
  tg.circle(300, 76, 15, {fill: 'shade', sw: 2.6}); tg.circle(300, 76, 8, {fill: true, sw: 2});
  p.path('M 300 -10 C 290 20 316 46 306 70 C 300 82 290 80 292 72', {sw: 2.4});
  const hold = R6.group(g); hold.style.transformOrigin = '300px 74px'; hold.style.transform = 'rotate(-6deg)';
  const n = div('left:152px;top:128px;width:296px;text-align:center', hold, `<span class="u-num lp-t" style="font-size:92px">${s.value}</span>`);
  FITS.push(() => { const sp = n.firstChild; if (sp.offsetWidth > 260) sp.style.fontSize = (92 * 260 / sp.offsetWidth).toFixed(1) + 'px'; });
  if (s.unit) LP.word(K, hold, s.unit, 300, 236, 34, 240);
}, R2.money);

/* 16 · a wallet opens and the banknotes slide up out of it: the amount is on the top note (money only) */
R3.both('B01', 'wallet', 'กระเป๋าสตางค์เปิด ธนบัตรเลื่อนออก มีจำนวนเงิน', (K, s, T, g, small) => {
  const bk = LP.layer(g, small).p;
  bk.path('M 104 168 L 104 150 Q 104 138 116 138 L 484 138 Q 496 138 496 150 L 496 168', {fill: 'shade'});
  const note = (rot, dy, top) => { const q = bk.child({transform: `rotate(${rot} 300 230)`});
    q.rect(128, 18 + dy, 344, 168, {rx: 6, fill: 'shade'}); q.rect(138, 28 + dy, 324, 148, {rx: 4, sw: 1.4, tone: 'soft'});
    q.circle(156, 46 + dy, 7, {sw: 1.4, tone: 'soft'}); q.circle(444, 158 + dy, 7, {sw: 1.4, tone: 'soft'});
    if (!top) q.line(170, 60 + dy, 260, 60 + dy, {sw: 1.4, tone: 'soft'}); };
  note(-9, 18, false); note(-4, 8, false); note(0, 0, true);
  const n = div('left:128px;top:34px;width:344px;text-align:center', g, `<span class="u-num lp-t" style="font-size:76px">${s.value}</span>`);
  FITS.push(() => { const sp = n.firstChild; if (sp.offsetWidth > 290) sp.style.fontSize = (76 * 290 / sp.offsetWidth).toFixed(1) + 'px'; });
  if (s.unit) LP.word(K, g, s.unit, 300, 118, 30, 260);
  const {p} = LP.layer(g, small);
  p.rect(92, 152, 416, 182, {rx: 18, fill: 'shade'});
  p.line(100, 160, 500, 160, {sw: 1.4, tone: 'soft'});
  p.rect(106, 172, 388, 148, {rx: 10, sw: 1.4, tone: 'soft', dash: [6, 6]});
  p.path('M 110 186 Q 104 196 104 222', {sw: 2, op: .7});
  p.path('M 410 206 L 506 206 Q 534 206 534 246 Q 534 286 506 286 L 410 286 Z', {fill: 'shade'});
  p.path('M 420 216 L 504 216 Q 524 216 524 246 Q 524 276 504 276 L 420 276', {sw: 1.4, tone: 'soft', dash: [6, 6]});
  p.circle(492, 246, 17, {fill: 'shade', sw: 2.6}); p.circle(492, 246, 8, {sw: 1.6, tone: 'soft'}); p.dot(487, 241, 2.5, {op: .8});
}, R2.money);

/* ================= B02 เพิ่ม / ลด: dir, item, center?, n?, keep?, end? ================= */
/* 17 · a group of people: more people join behind the first one (up), or they leave until one is left (down). People only */
R3.both('B02', 'team', 'กลุ่มคน คนมาเพิ่มหรือหายไป', (K, s, T, g, small) => {
  const up = s.dir !== 'down', {p} = LP.layer(g, small);
  HU.bust(p, {x: 176, y: 286, size: 236, op: up ? null : .16}); HU.bust(p, {x: 424, y: 286, size: 236, op: up ? null : .16});
  HU.bust(p, {x: 300, y: 334, size: 300, tone: up ? 'acc' : undefined});
}, s => S11.human(s.item?.icon));

/* 18 · cardboard boxes stack up one on another (up), or are taken off until one is left (down) */
R3.both('B02', 'boxes', 'กล่องซ้อนสูงขึ้น หรือถูกหยิบออกทีละกล่อง', (K, s, T, g, small) => {
  const up = s.dir !== 'down', it = s.item ?? {icon: 'package'}, {p} = LP.layer(g, small), H = 96, Wd = 132;
  [0, 1, 2].forEach(k => {
    const on = up || k === 0, top = up && k === 2, before = p.g.childNodes.length, y = 334 - k * H;
    const P = (X, Y, Z) => { const [a, b] = LP.iso(X, Y, Z); return [300 + a, y + b]; }, hw = Wd / 2;
    p.shape([P(-hw, 0, hw), P(hw, 0, hw), P(hw, H, hw), P(-hw, H, hw)], {fill: 'shade'});
    p.shape([P(hw, 0, hw), P(hw, 0, -hw), P(hw, H, -hw), P(hw, H, hw)], {fill: true});
    p.shape([P(-hw, H, -hw), P(hw, H, -hw), P(hw, H, hw), P(-hw, H, hw)], {fill: 'shade', tone: top ? 'acc' : undefined});
    p.poly([P(0, H, -hw), P(0, H, hw), P(0, H * .6, hw)], {sw: 6, tone: top ? 'acc' : 'soft', op: top ? 1 : .55});
    p.poly([P(-hw, H * .9, hw), P(hw, H * .9, hw)], {sw: 1.2, tone: 'soft'});
    if (!on) [...p.g.childNodes].slice(before).forEach(e => { e.style.opacity = .16; e.style.strokeDasharray = '6 7'; });
    else { const c = P(-hw * .45, H * .42, hw); LP.ico(g, it.icon, c[0], c[1], 30); }
  });
});

/* ================= B14 ประโยคเด็ด: idea {icon?, label} ================= */
/* 19 · an open book; a highlighter runs along one line and the line it marks is the punchline */
R3.both('B14', 'highlight', 'ปากกาไฮไลต์ขีดประโยคในหนังสือ', (K, s, T, g, small) => {
  const it = s.idea ?? {icon: 'quote'}, {p} = LP.layer(g, small);
  p.path('M 300 44 Q 168 18 40 40 L 40 334 Q 168 312 300 340 Q 432 312 560 334 L 560 40 Q 432 18 300 44 Z', {fill: 'shade'});
  [6, 12].forEach(d => { p.path(`M ${40 + d} ${328 - d * .3} Q 168 ${306 - d} 300 ${334 - d}`, {sw: 1.2, tone: 'soft'}); p.path(`M ${560 - d} ${328 - d * .3} Q 432 ${306 - d} 300 ${334 - d}`, {sw: 1.2, tone: 'soft'}); });
  p.path('M 300 34 Q 168 8 34 30 L 34 320 Q 168 298 300 326 Z', {fill: true}); p.path('M 300 34 Q 432 8 566 30 L 566 320 Q 432 298 300 326 Z', {fill: true});
  p.path('M 300 36 L 300 324', {sw: 2}); p.path('M 290 40 Q 296 180 290 320', {sw: 1.4, tone: 'soft'}); p.path('M 310 40 Q 304 180 310 320', {sw: 1.4, tone: 'soft'});
  [92, 124, 156, 240, 272].forEach((y, k) => p.line(70, y, k === 4 ? 190 : 264, y, {sw: 1.6, tone: 'soft'}));
  [92, 124, 240, 272].forEach((y, k) => p.line(336, y, k === 3 ? 450 : 530, y, {sw: 1.6, tone: 'soft'}));
  p.rect(322, 150, 214, 66, {rx: 4, fill: 'var(--lp-acc)', stroke: 'none', op: .9});
  LP.row(K, g, it.label ? {label: it.label} : it, 427, 162, 34, 200, true);
  const pen = p.child({transform: 'rotate(38 540 214)'});
  pen.rect(522, 112, 36, 84, {rx: 6, fill: 'shade'}); pen.line(530, 120, 530, 188, {sw: 1.4, op: .5});
  pen.rect(522, 84, 36, 34, {rx: 8, fill: 'shade', tone: 'acc'}); pen.rect(556, 90, 6, 30, {rx: 3, fill: 'shade', tone: 'acc', sw: 1.6});
  pen.path('M 526 196 L 554 196 L 548 218 L 532 218 Z', {fill: 'shade'}); pen.path('M 533 218 L 547 218 L 544 226 L 536 226 Z', {fill: 'shade', tone: 'acc', sw: 1.6});
});

/* 20 · a speaker points at the screen, and the punchline is up on it */
R3.both('B14', 'slides', 'คนยืนชี้จอสไลด์ ประโยคขึ้นจอ', (K, s, T, g, small) => {
  const it = s.idea ?? {icon: 'quote'}, G = 338, H = 300, X = 112, {p} = LP.layer(g, small);
  p.line(392, 200, 392, 300, {sw: 3}); p.line(392, 294, 340, G, {sw: 3}); p.line(392, 294, 444, G, {sw: 3}); p.line(392, 294, 392, G, {sw: 2, tone: 'soft'});
  p.rect(204, 6, 344, 202, {rx: 8, fill: 'shade'}); p.rect(216, 18, 320, 178, {rx: 4, fill: true, sw: 1.8});
  p.rect(376, 200, 32, 10, {rx: 3, fill: 'shade', sw: 2});
  if (it.label) LP.word(K, g, it.label, 376, 82, 44, 290); else LP.ico(g, it.icon, 376, 106, 80);
  HU.person(p, {x: X, y: G, h: H, pose: 'present'});
});

/* ================= sample sentences (s11.*), general ones (not Friend's script) ================= */
SENTENCE('s11.newbie', {cat: 'B10', name: 'คลิปนี้สำหรับมือใหม่', say: ['คลิปนี้สำหรับมือใหม่ที่', 'อยากขายของ'], who: {icon: 'user'}, label: 'มือใหม่', tags: ['อยากขายของ']});
SENTENCE('s11.mom', {cat: 'B10', name: 'คุณแม่มือใหม่', say: ['สำหรับคุณแม่มือใหม่', 'ที่ลูกยังเล็ก'], who: {icon: 'user'}, label: 'คุณแม่มือใหม่', tags: ['ลูกยังเล็ก']});
SENTENCE('s11.salt', {cat: 'B13', name: 'ความลับคือเกลือหยิบมือ', say: ['ความลับของร้านนี้คือ', 'เกลือหยิบมือ'], secret: {icon: 'cooking-pot', label: 'เกลือหยิบมือ'}});
SENTENCE('s11.light', {cat: 'B13', name: 'เคล็ดลับคือแสงหน้าต่าง', say: ['เคล็ดลับของรูปสวยคือ', 'แสงหน้าต่าง'], secret: {icon: 'sun', label: 'แสงหน้าต่าง'}});
SENTENCE('s11.friend', {cat: 'B20', name: 'เพื่อนสนิท', say: ['เราสองคนเป็น', 'เพื่อนสนิทกัน'], a: {icon: 'user', label: 'ผม'}, b: {icon: 'user', label: 'ต้น'}, label: 'เพื่อนสนิท'});
SENTENCE('s11.ex', {cat: 'B20', name: 'แฟนเก่า เลิกกันแล้ว', say: ['เขาคือแฟนเก่า', 'เลิกกันไปแล้ว'], a: {icon: 'user', label: 'ผม'}, b: {icon: 'user', label: 'เขา'}, label: 'แฟนเก่า', cut: true});
SENTENCE('s11.collab', {cat: 'B20', name: 'คอลแล็บกับแบรนด์', say: ['วันนี้เราได้คอลแล็บกับ', 'แสนสิริ'], a: {icon: 'user', label: 'เรา'}, b: {icon: 'building-2', label: 'แสนสิริ'}, label: 'คอลแล็บ'});
SENTENCE('s11.cafe', {cat: 'B21', name: 'คาเฟ่ชั้นสอง ริมหน้าต่าง', say: ['คาเฟ่นี้อยู่ชั้นสอง', 'ริมหน้าต่าง'], place: {icon: 'coffee', label: 'คาเฟ่บ้านไม้'}, spots: [{icon: 'layers', label: 'ชั้นสอง'}, {icon: 'sun', label: 'ริมหน้าต่าง'}]});
SENTENCE('s11.tokyo', {cat: 'B21', name: 'ไปโตเกียว', say: ['ปีนี้ได้ไป', 'โตเกียว'], place: {icon: 'landmark', label: 'โตเกียว'}});
SENTENCE('s11.debt', {cat: 'B12', name: 'รูดบัตร ดอกเบี้ย หนี้ท่วม', say: ['รูดบัตร ดอกเบี้ยทบ', 'จนหนี้ท่วม'],
  items: [{icon: 'credit-card', label: 'รูดบัตร'}, {icon: 'percent', label: 'ดอกเบี้ยทบ'}, {icon: 'trending-down', label: 'หนี้ท่วม', tone: 'neg'}]});
SENTENCE('s11.share', {cat: 'B12', name: 'พอใจ บอกต่อ ยอดเพิ่ม', say: ['ลูกค้าพอใจ ก็บอกต่อ', 'ยอดเพิ่มเอง'],
  items: [{icon: 'smile', label: 'ลูกค้าพอใจ'}, {icon: 'share-2', label: 'บอกต่อ'}, {icon: 'trending-up', label: 'ยอดเพิ่ม'}]});
SENTENCE('s11.cheap', {cat: 'B05', name: 'ไม่ใช่ถูกสุด แต่คุ้มสุด', say: ['ไม่ใช่ราคาถูกที่สุด', 'แต่คุ้มที่สุด'], wrong: {icon: 'tag', label: 'ถูกสุด'}, right: {icon: 'gem', label: 'คุ้มสุด'}});
SENTENCE('s11.word', {cat: 'B05', name: 'อย่าเขียนขายของ เขียนแก้ปัญหา', say: ['อย่าเขียนขายของ', 'เขียนแก้ปัญหา'], wrong: {icon: 'megaphone', label: 'ขายของ'}, right: {icon: 'lightbulb', label: 'แก้ปัญหา'}});
SENTENCE('s11.call', {cat: 'B11', name: 'ลูกค้าโทรมาบอกว่าอร่อยมาก', say: ['ลูกค้าโทรมาบอกว่า', 'อร่อยมาก'], kind: 'message', quote: 'อร่อยมาก', mood: 'good', react: 'thumbs-up'});
SENTENCE('s11.fast', {cat: 'B11', name: 'คอมเมนต์ว่าส่งไวมาก', say: ['มีคนคอมเมนต์ว่า', 'ส่งไวมาก'], kind: 'comment', quote: 'ส่งไวมาก', mood: 'good', react: 'heart'});
SENTENCE('s11.price', {cat: 'B01', name: 'ราคาแค่ 990 บาท', say: ['เสื้อตัวนี้ราคาแค่', '990 บาท'], value: '990', unit: 'บาท', icon: 'shirt', money: true});
SENTENCE('s11.ads', {cat: 'B01', name: 'ค่าโฆษณาเดือนละ 3,000 บาท', say: ['ค่าโฆษณาเดือนละ', '3,000 บาท'], value: '3,000', unit: 'บาท', icon: 'megaphone', money: true});
SENTENCE('s11.line', {cat: 'B02', name: 'ลูกค้ามาต่อคิวเพิ่มขึ้น', say: ['พอทำคลิป ลูกค้า', 'มาต่อคิวเพิ่มขึ้น'], dir: 'up', item: {icon: 'user'}, center: {icon: 'store'}, n: 4});
SENTENCE('s11.gone', {cat: 'B02', name: 'ลูกค้าหายไปเกือบหมด', say: ['ช่วงนั้นลูกค้า', 'หายไปเกือบหมด'], dir: 'down', item: {icon: 'user'}, center: {icon: 'store'}, n: 4, keep: 1});
SENTENCE('s11.orders', {cat: 'B02', name: 'ออเดอร์เพิ่มขึ้น', say: ['เดือนนี้ออเดอร์', 'เพิ่มขึ้นเยอะ'], dir: 'up', item: {icon: 'package'}, n: 4});
SENTENCE('s11.stock', {cat: 'B02', name: 'ของในสต็อกลดลง', say: ['ของในสต็อก', 'ลดลงเรื่อยๆ'], dir: 'down', item: {icon: 'package'}, n: 4, keep: 2});
SENTENCE('s11.daily', {cat: 'B14', name: 'ความสม่ำเสมอชนะทุกอย่าง', say: ['ความสม่ำเสมอ', 'ชนะทุกอย่าง'], idea: {icon: 'repeat', label: 'สม่ำเสมอ'}});
SENTENCE('s11.start', {cat: 'B14', name: 'ไม่ต้องเก่งก่อน แค่เริ่มก่อน', say: ['ไม่ต้องเก่งก่อน', 'แค่เริ่มก่อน'], idea: {icon: 'rocket', label: 'แค่เริ่มก่อน'}});
