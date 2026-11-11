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
    constructor(g, k, grad) { this.g = g; this.k = k; this.grad = grad; }
    child(attrs = {}, sc = 1) { const e = document.createElementNS(NS, 'g'); for (const a in attrs) e.setAttribute(a, attrs[a]); this.g.appendChild(e); return new Pen(e, this.k / sc, this.grad); }
    _d(tag, a, o = {}) {
      const e = document.createElementNS(NS, tag);
      for (const n in a) e.setAttribute(n, a[n]);
      /* fill: true = the flat body colour, 'shade' = the body lit from the top left (the ref's soft volume) */
      let fill = o.fill === true ? C.fill : o.fill === 'shade' ? `url(#${this.grad})` : o.fill || 'none', stroke = o.stroke || C.ink;
      if (o.tone === 'acc') { fill = o.fill === 'none' ? 'none' : C.acc; stroke = C.accLine; e.classList.add('lp-acc'); }
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
      <linearGradient id="${id}" x1="0" y1="0" x2=".35" y2="1" gradientUnits="objectBoundingBox"><stop offset="0" style="stop-color:var(--lp-shade-a, var(--lp-fill))"/><stop offset="1" style="stop-color:var(--lp-shade-b, var(--lp-fill))"/></linearGradient></defs><g></g></svg>`);
    return {el: d, p: new Pen(d.querySelector('svg > g'), small ? 1 : 1 / 1.6, id)};
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

/* ================= B10 คน: who? {icon, label?}, label?, tags? [≤2] ================= */
/* 1 · the one this is for raises a hand and lights up; the kind of person under it */
R3.both('B10', 'raise', 'คนที่ใช่ยกมือ', (K, s, T, g, small) => {
  const {p} = LP.layer(g, small);
  LP.person(p, {x: 300, y: 270, h: 262, pose: 'wave', tone: 'acc'});
  const w = s.label ?? s.who?.label; if (w) LP.word(K, g, w, 300, 280, 36, 340);
});

/* 2 · a person waiting at arrivals holds up a sign; on the sign is the kind of person */
R3.both('B10', 'sign', 'คนถือป้ายรอรับ บนป้ายคือคนกลุ่มนี้', (K, s, T, g, small) => {
  const G = 336, H = 332, X = 300, {p} = LP.layer(g, small);
  LP.person(p, {x: X, y: G, h: H, pose: 'hold'});
  p.rect(X - 172, 98, 344, 136, {rx: 10, fill: true});
  [[-172, -58], [172, -58]].forEach(([px, py]) => { const [hx, hy] = LP.at(X, G, H, px, py); p.circle(hx, hy, 13, {fill: true, sw: 2.6}); });
  const w = s.label ?? s.who?.label; if (w) LP.word(K, g, w, X, 136, 46, 290);
});

/* ================= B13 เคล็ดลับ: secret {icon, label?} ================= */
/* 3 · a secret file with a padlock on the cover: the paper with the tip slides up out of it */
R3.both('B13', 'dossier', 'แฟ้มลับ กระดาษเคล็ดลับเลื่อนออกมา', (K, s, T, g, small) => {
  const it = s.secret ?? {icon: 'lightbulb'}, back = LP.layer(g, small).p;
  back.path('M 84 72 Q 84 58 98 58 L 214 58 L 234 80 L 502 80 Q 516 80 516 94 L 516 318 Q 516 332 502 332 L 98 332 Q 84 332 84 318 Z', {fill: true});
  back.rect(140, 10, 320, 250, {rx: 6, fill: true});
  LP.ico(g, it.icon, 300, 54, 52); if (it.label) LP.word(K, g, it.label, 300, 86, 40, 290);
  const fr = LP.layer(g, small).p;
  fr.path('M 84 190 L 516 170 L 516 318 Q 516 332 502 332 L 98 332 Q 84 332 84 318 Z', {fill: true});
  fr.rect(276, 254, 48, 38, {rx: 6, sw: 3}); fr.path('M 286 254 L 286 242 Q 286 226 300 226 Q 314 226 314 242 L 314 254', {sw: 3});
});

/* 4 · a torch in the dark: the beam sweeps across and stops on the tip, which lights up */
R3.both('B13', 'torch', 'ไฟฉายส่องหาในที่มืด เจอเคล็ดลับ', (K, s, T, g, small) => {
  const it = s.secret ?? {icon: 'lightbulb'}, {p} = LP.layer(g, small);
  p.path('M 236 222 L 340 16 L 548 16 L 548 196 L 258 254 Z', {fill: 'var(--lp-acc)', stroke: 'none', op: .26});
  p.rect(352, 30, 186, 150, {rx: 22, fill: true, tone: 'acc'});
  LP.ico(g, it.icon, 445, 76, 50, true); if (it.label) LP.word(K, g, it.label, 445, 108, 30, 166, true);
  const tq = p.child({transform: 'rotate(-32 190 280)'});
  tq.rect(24, 254, 150, 54, {rx: 14, fill: true});
  [70, 96, 122].forEach(x => tq.line(x, 264, x, 298, {sw: 1.8, tone: 'soft'}));
  tq.path('M 172 246 L 226 232 Q 236 232 236 242 L 236 320 Q 236 330 226 330 L 172 316 Z', {fill: true});
  tq.line(248, 238, 248, 324, {sw: 6, tone: 'acc'});
});

/* ================= B20 ความสัมพันธ์: a {icon, label?}, b {icon, label?}, label?, cut? ================= */
/* 5 · two people turn to face each other; the link under them. When it is over they stand back to back */
R3.both('B20', 'face', 'สองคนหันหน้าเข้าหากัน (จบกัน = หันหลังให้กัน)', (K, s, T, g, small) => {
  const a = s.a ?? {icon: 'user'}, b = s.b ?? {icon: 'user'}, cut = !!s.cut, G = 280, H = 272, {p} = LP.layer(g, small);
  const one = (it, x, face) => { if (S11.human(it.icon)) LP.person(p, {x, y: G, h: H, pose: 'side', face}); else { p.rect(x - 76, G - 200, 152, 200, {rx: 16, fill: true}); LP.ico(g, it.icon, x, G - 100, 80); } };
  one(a, 214, cut ? -1 : 1); one(b, 386, cut ? 1 : -1);
  if (cut) LP.parts.cross(p, 300, 150, .4);
  if (s.label) LP.word(K, g, s.label, 300, 286, 34, 320);
});

/* 6 · two hands meet in a handshake on the key word; when it is over they let go */
R3.both('B20', 'shake', 'มือสองข้างจับมือกัน (จบกัน = ปล่อยมือ)', (K, s, T, g, small) => {
  const cut = !!s.cut, d = cut ? 40 : 0, {p} = LP.layer(g, small);
  const q = p.child({transform: 'translate(300 150) scale(1.3) translate(-300 -218)'}, 1.3);
  const L = q.child({transform: `translate(${-d} 0)`});
  L.rect(40, 186, 140, 66, {rx: 12, fill: true}); L.rect(166, 180, 26, 78, {rx: 8, fill: true, tone: 'acc'});
  L.rect(190, 192, 104, 56, {rx: 24, fill: true}); L.tube([[214, 196], [270, 176], [298, 178]], 22);
  const R = q.child({transform: `translate(${d} 0)`});
  R.rect(420, 186, 140, 66, {rx: 12, fill: true}); R.rect(408, 180, 26, 78, {rx: 8, fill: true, tone: 'acc'});
  R.rect(312, 188, 104, 62, {rx: 24, fill: true});
  [0, 1, 2, 3].forEach(k => R.tube([[330, 196 + k * 15], [254 + k * 4, 200 + k * 15]], 15));
  if (s.label) LP.word(K, g, s.label, 300, 280, 36, 320);
});

/* ================= B21 สถานที่: place {icon, label?}, spots? [1-2 {icon, label?}] ================= */
/* 7 · a big road sign on two posts slides in as if driving past, and stops: the name of the place */
R3.both('B21', 'roadsign', 'ป้ายริมทางบนเสาสองต้น บอกชื่อที่', (K, s, T, g, small) => {
  const pl = s.place ?? {icon: 'map-pin'}, {p} = LP.layer(g, small);
  p.rect(150, 170, 24, 166, {rx: 5, fill: true}); p.rect(426, 170, 24, 166, {rx: 5, fill: true});
  p.rect(60, 14, 480, 168, {rx: 20, fill: true, tone: 'acc'}); p.rect(76, 30, 448, 136, {rx: 12, tone: 'acc', fill: 'none', sw: 2.2});
  LP.ico(g, pl.icon, 300, 64, 58, true);
  if (pl.label) LP.word(K, g, pl.label, 300, 96, 48, 420, true);
});

/* 8 · a hand holds up a phone and takes a picture of the place: the place is on the screen */
R3.both('B21', 'snap', 'มือถือมือถือ ถ่ายรูปสถานที่', (K, s, T, g, small) => {
  const pl = s.place ?? {icon: 'map-pin'}, {p} = LP.layer(g, small);
  const ph = LP.holdPhone(p, {x: 300, y: 178, size: 336}), k = ph.s, sx = v => 300 + v * k, sy = v => 178 + v * k;
  /* the viewfinder corners on the screen */
  [[-56, -170, 1, 1], [56, -170, -1, 1], [-56, 40, 1, -1], [56, 40, -1, -1]].forEach(([x, y, dx, dy]) =>
    ph.q.poly([[x, y + 22 * dy], [x, y], [x + 22 * dx, y]], {sw: 3, tone: 'acc', fill: 'none'}));
  ph.after();
  LP.ico(g, pl.icon, sx(-6), sy(-112), 54); if (pl.label) LP.word(K, g, pl.label, sx(-6), sy(-76), 24, 96);
});

/* ================= B12 เหตุกับผล: items [3 {icon, label?, tone?}], end? ================= */
/* 9 · a stone drops into still water; the rings spread out, the outer one is the effect */
R3.both('B12', 'ripple', 'หินตกน้ำ วงคลื่นกระเพื่อมออกไปทีละวง', (K, s, T, g, small) => {
  const it = (s.items ?? []).slice(0, 3), neg = it[2]?.tone === 'neg', C = [300, 206], {p} = LP.layer(g, small);
  p.ellipse(C[0], C[1], 250, 72, {fill: true});
  p.ellipse(C[0], C[1], 56, 16, {sw: 2.4}); p.ellipse(C[0], C[1], 130, 37, {sw: 2.2, tone: 'soft'});
  p.ellipse(C[0], C[1], 210, 58, {sw: 5, tone: neg ? 'neg' : 'acc', fill: 'none'});
  p.line(C[0], 104, C[0], C[1] - 24, {sw: 1.8, tone: 'soft', dash: [6, 10]});
  p.path('M 256 62 C 252 30 278 12 304 14 C 334 16 352 34 348 62 C 344 88 320 98 300 98 C 276 98 258 88 256 62 Z', {fill: true});
  p.path('M 276 34 Q 290 24 308 26', {sw: 1.8, tone: 'soft'});
  if (it[0]) LP.ico(g, it[0].icon, 302, 58, 36);
  if (it[2]?.label) { const w = LP.word(K, g, it[2].label, 300, 286, 36, 360); if (neg) w.style.color = 'var(--lp-neg)'; }
});

/* 10 · a toaster: the lever goes down (the cause) and the toast pops up (the effect) */
R3.both('B12', 'toaster', 'เครื่องปิ้งขนมปัง กดคันโยก ขนมปังเด้งขึ้น', (K, s, T, g, small) => {
  const it = (s.items ?? []).slice(0, 3), neg = it[2]?.tone === 'neg', {p} = LP.layer(g, small);
  /* the toast first (behind), half out of the slot */
  p.path('M 214 150 L 214 66 Q 196 62 196 42 Q 196 14 230 14 L 370 14 Q 404 14 404 42 Q 404 62 386 66 L 386 150 Z', {fill: true, tone: neg ? undefined : 'acc'});
  if (neg) p.path('M 214 150 L 214 66 Q 196 62 196 42 Q 196 14 230 14 L 370 14 Q 404 14 404 42 Q 404 62 386 66 L 386 150 Z', {tone: 'neg', sw: 3.4});
  if (it[2]?.icon) LP.ico(g, it[2].icon, 300, it[2].label ? 44 : 64, 40, !neg);
  if (it[2]?.label) { const w = LP.word(K, g, it[2].label, 300, 64, 28, 168, !neg); if (neg) w.style.color = 'var(--lp-neg)'; }
  p.path('M 150 128 Q 150 106 172 106 L 428 106 Q 450 106 450 128 L 460 284 Q 462 304 440 304 L 160 304 Q 138 304 140 284 Z', {fill: true});
  p.rect(206, 98, 188, 16, {rx: 8, fill: true});
  p.rect(176, 312, 40, 14, {rx: 6, fill: true}); p.rect(384, 312, 40, 14, {rx: 6, fill: true});
  p.rect(456, 214, 34, 22, {rx: 8, fill: true}); p.line(450, 160, 450, 270, {sw: 1.8, tone: 'soft'});
  p.circle(300, 220, 26, {sw: 2.2}); p.line(300, 220, 314, 206, {sw: 2.2});
});

/* ================= B05 ถูกกับผิด: wrong {icon, label?}, right {icon, label?} ================= */
/* 11 · a USB plug: the wrong way up it will not go in; turned the right way, it goes in */
R3.both('B05', 'usb', 'หัว USB ด้านผิดเสียบไม่เข้า ด้านถูกเสียบได้', (K, s, T, g, small) => {
  const w = s.wrong ?? {icon: 'x'}, r = s.right ?? {icon: 'check'}, {p} = LP.layer(g, small);
  p.path('M -20 172 Q 60 172 92 172', {sw: 3}); p.path('M -20 186 Q 60 186 92 186', {sw: 3});
  p.rect(88, 140, 150, 78, {rx: 16, fill: true, tone: 'acc'});
  p.rect(236, 150, 92, 58, {rx: 4, fill: true});
  p.rect(262, 164, 14, 12, {rx: 2, sw: 2}); p.rect(290, 164, 14, 12, {rx: 2, sw: 2});
  /* the port the plug goes into (in front of the metal tip) */
  p.rect(290, 118, 236, 122, {rx: 18, fill: true}); p.rect(312, 140, 192, 78, {rx: 8, sw: 2.2}); p.rect(330, 160, 156, 20, {rx: 4, sw: 1.8, tone: 'soft'});
  LP.ico(g, r.icon, 163, 179, 40, true);
  if (r.label) LP.word(K, g, r.label, 300, 270, 38, 360);
  if (w.label) LP.strike(K, g, w.label, 300, 42, 30, 300);
});

/* 12 · one ticket gate: the right card is tapped and the gate opens (the wrong one, struck, above) */
R3.both('B05', 'gate', 'ประตูกั้นรถไฟฟ้า บัตรถูกแตะแล้วเปิด', (K, s, T, g, small) => {
  const w = s.wrong ?? {icon: 'x'}, r = s.right ?? {icon: 'check'}, {p} = LP.layer(g, small);
  p.rect(212, 178, 52, 40, {rx: 14, fill: true, tone: 'acc'}); p.rect(336, 178, 52, 40, {rx: 14, fill: true, tone: 'acc'});
  [[110, 212], [388, 490]].forEach(([x0, x1]) => { p.path(`M ${x0} 336 L ${x0} 120 Q ${x0} 102 ${x0 + 18} 102 L ${x1 - 18} 102 Q ${x1} 102 ${x1} 120 L ${x1} 336`, {fill: true});
    p.rect(x0 + 22, 116, x1 - x0 - 44, 18, {rx: 5, sw: 2.2}); });
  p.rect(130, 20, 170, 108, {rx: 14, fill: true, tone: 'acc'});
  LP.ico(g, r.icon, 215, 52, 40, true); if (r.label) LP.word(K, g, r.label, 215, 78, 28, 150, true);
  if (w.label) LP.strike(K, g, w.label, 430, 40, 28, 200);
});

/* ================= B11 คำพูด: kind, quote, mood?, react?, gone? ================= */
/* 13 · a home phone: the handset is picked up and what was said comes out of it */
R3.both('B11', 'phone', 'โทรศัพท์บ้าน ยกหู คำพูดออกมา', (K, s, T, g, small) => {
  const {p} = LP.layer(g, small);
  p.path('M 80 320 L 116 210 Q 120 198 134 198 L 314 198 Q 328 198 332 210 L 368 320 Q 370 334 356 334 L 92 334 Q 78 334 80 320 Z', {fill: true});
  p.circle(224, 268, 36, {sw: 2.2}); p.circle(224, 268, 11, {sw: 1.8, tone: 'soft'});
  const hs = p.child({transform: 'rotate(-12 224 136)'});
  hs.path('M 112 136 Q 112 110 138 110 L 310 110 Q 336 110 336 136 L 336 148 Q 336 168 316 168 L 288 168 Q 276 168 274 156 L 270 142 L 178 142 L 174 156 Q 172 168 160 168 L 132 168 Q 112 168 112 148 Z', {fill: true});
  LP.parts.bubble(p, 438, 80, 216, 110, false, {sw: 2.6});
  if (s.quote) LP.word(K, g, s.quote, 438, 56, 38, 190);
});

/* 14 · a typewriter types the message onto the paper, which rolls up out of it */
R3.both('B11', 'typewriter', 'เครื่องพิมพ์ดีดพิมพ์ข้อความ กระดาษเลื่อนขึ้น', (K, s, T, g, small) => {
  const {p} = LP.layer(g, small);
  p.rect(160, 8, 280, 180, {rx: 4, fill: true});
  if (s.quote) LP.word(K, g, s.quote, 300, 60, 44, 240);
  p.rect(110, 160, 380, 38, {rx: 19, fill: true}); p.circle(94, 179, 20, {fill: true}); p.circle(506, 179, 20, {fill: true});
  p.path('M 104 214 Q 104 200 118 200 L 482 200 Q 496 200 498 214 L 526 312 Q 530 334 508 334 L 92 334 Q 70 334 74 312 Z', {fill: true});
  [[150, 236, 8], [170, 270, 7]].forEach(([x0, y, n]) => { for (let k = 0; k < n; k++) p.circle(x0 + k * 42 + 12, y, 12, {sw: 2}); });
  p.rect(220, 300, 160, 14, {rx: 7, sw: 2});
});

/* ================= B01 ตัวเลขเด่น: value, unit?, icon?, dir?, money? ================= */
/* 15 · a price tag hangs on its string, swings and comes to rest: the amount on it (money only) */
R3.both('B01', 'pricetag', 'ป้ายราคาแขวน แกว่งแล้วหยุด', (K, s, T, g, small) => {
  const {p} = LP.layer(g, small);
  p.path('M 300 -10 Q 288 30 300 62', {sw: 2.4});
  const tg = p.child({transform: 'rotate(-6 300 62)'});
  tg.path('M 278 44 Q 300 30 322 44 L 436 108 Q 448 116 448 130 L 448 318 Q 448 334 432 334 L 168 334 Q 152 334 152 318 L 152 130 Q 152 116 164 108 Z', {fill: true});
  tg.circle(300, 74, 13, {sw: 2.8});
  const hold = R6.group(g); hold.style.transformOrigin = '300px 62px'; hold.style.transform = 'rotate(-6deg)';
  const n = div('left:152px;top:128px;width:296px;text-align:center', hold, `<span class="u-num lp-t" style="font-size:92px">${s.value}</span>`);
  FITS.push(() => { const sp = n.firstChild; if (sp.offsetWidth > 260) sp.style.fontSize = (92 * 260 / sp.offsetWidth).toFixed(1) + 'px'; });
  if (s.unit) LP.word(K, hold, s.unit, 300, 236, 34, 240);
}, R2.money);

/* 16 · a wallet opens and a banknote slides up out of it: the amount is on the note (money only) */
R3.both('B01', 'wallet', 'กระเป๋าสตางค์เปิด ธนบัตรเลื่อนออก มีจำนวนเงิน', (K, s, T, g, small) => {
  const bk = LP.layer(g, small).p;
  bk.rect(128, 10, 344, 176, {rx: 8, fill: true}); bk.rect(142, 24, 316, 148, {rx: 5, sw: 1.8, tone: 'soft'});
  const n = div('left:128px;top:30px;width:344px;text-align:center', g, `<span class="u-num lp-t" style="font-size:76px">${s.value}</span>`);
  FITS.push(() => { const sp = n.firstChild; if (sp.offsetWidth > 290) sp.style.fontSize = (76 * 290 / sp.offsetWidth).toFixed(1) + 'px'; });
  if (s.unit) LP.word(K, g, s.unit, 300, 116, 30, 260);
  const {p} = LP.layer(g, small);
  p.rect(94, 156, 412, 178, {rx: 26, fill: true}); p.rect(108, 170, 384, 150, {rx: 16, sw: 1.6, tone: 'soft'});
  p.rect(398, 210, 126, 74, {rx: 26, fill: true}); p.circle(488, 247, 11, {sw: 2.8, tone: 'acc', fill: true});
}, R2.money);

/* ================= B02 เพิ่ม / ลด: dir, item, center?, n?, keep?, end? ================= */
/* 17 · a group of people: more people join behind the first one (up), or they leave until one is left (down). People only */
R3.both('B02', 'team', 'กลุ่มคน คนมาเพิ่มหรือหายไป', (K, s, T, g, small) => {
  const up = s.dir !== 'down', {p} = LP.layer(g, small);
  if (up) LP.team(p, {x: 300, y: 152, size: 420, tone: 'acc'});
  else { const q = LP.team(p, {x: 300, y: 152, size: 420, back: .16}); }
}, s => S11.human(s.item?.icon));

/* 18 · boxes stack up one on another (up), or are taken off until one is left (down) */
R3.both('B02', 'boxes', 'กล่องซ้อนสูงขึ้น หรือถูกหยิบออกทีละกล่อง', (K, s, T, g, small) => {
  const up = s.dir !== 'down', it = s.item ?? {icon: 'package'}, {p} = LP.layer(g, small), H = 92;
  [0, 1, 2].forEach(k => {
    const on = up || k === 0, before = p.g.childNodes.length;
    const bx = LP.isoBox(p, {x: 300, y: 334 - k * H, w: 120, dp: 120, h: H, tone: up && k === 2 ? 'acc' : undefined, tape: true});
    if (!on) [...p.g.childNodes].slice(before).forEach(e => { e.style.opacity = .2; e.style.strokeDasharray = '6 7'; });
    else { const f = bx.front, cx = (f[0][0] + f[1][0]) / 2, cy = (f[0][1] + f[2][1]) / 2 + 4; LP.ico(g, it.icon, cx, cy, 34); }
  });
});

/* ================= B14 ประโยคเด็ด: idea {icon?, label} ================= */
/* 19 · an open book; a highlighter runs along one line and the line it marks is the punchline */
R3.both('B14', 'highlight', 'ปากกาไฮไลต์ขีดประโยคในหนังสือ', (K, s, T, g, small) => {
  const it = s.idea ?? {icon: 'quote'}, {p} = LP.layer(g, small);
  p.path('M 300 34 Q 168 8 34 30 L 34 324 Q 168 304 300 330 Z', {fill: true});
  p.path('M 300 34 Q 432 8 566 30 L 566 324 Q 432 304 300 330 Z', {fill: true});
  [92, 150, 266].forEach((y, k) => p.line(70, y, k === 2 ? 190 : 266, y, {sw: 1.8, tone: 'soft'}));
  [92, 266].forEach((y, k) => p.line(334, y, k === 1 ? 450 : 530, y, {sw: 1.8, tone: 'soft'}));
  p.rect(320, 154, 214, 68, {rx: 6, fill: 'var(--lp-acc)', stroke: 'none'});
  LP.row(K, g, it.label ? {label: it.label} : it, 427, 166, 34, 200, true);
  /* the highlighter pen, its chisel tip at the end of the line */
  const pen = p.child({transform: 'rotate(38 540 214)'});
  pen.rect(524, 100, 34, 96, {rx: 8, fill: true}); pen.rect(524, 100, 34, 28, {rx: 8, fill: true, tone: 'acc'});
  pen.path('M 528 196 L 554 196 L 548 216 L 534 216 Z', {fill: true});
});

/* 20 · a speaker points at the screen, and the punchline is up on it */
R3.both('B14', 'slides', 'คนยืนชี้จอสไลด์ ประโยคขึ้นจอ', (K, s, T, g, small) => {
  const it = s.idea ?? {icon: 'quote'}, G = 338, H = 300, X = 112, {p} = LP.layer(g, small);
  p.line(392, 204, 392, 300, {sw: 3}); p.line(392, 294, 340, G, {sw: 3}); p.line(392, 294, 444, G, {sw: 3});
  p.rect(206, 8, 340, 200, {rx: 14, fill: true});
  if (it.label) LP.word(K, g, it.label, 376, 84, 44, 300); else LP.ico(g, it.icon, 376, 108, 80);
  LP.person(p, {x: X, y: G, h: H, pose: 'present'});
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
