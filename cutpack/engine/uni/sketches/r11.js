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
.gd .lp-acc{filter:drop-shadow(0 0 7px rgba(255,140,40,.8))}
.lp-t{white-space:nowrap;line-height:1.25;color:var(--lp-ink)}
.lp-t.lp-on{color:var(--lp-acc-ink)}
.lp-ico{color:var(--lp-ink)}.lp-ico.lp-on{color:var(--lp-acc-ink)}`;
  document.head.appendChild(st);
})();

const LP = (() => {
  const NS = 'http://www.w3.org/2000/svg';
  const C = {ink: 'var(--lp-ink)', fill: 'var(--lp-fill)', soft: 'var(--lp-soft)', mute: 'var(--lp-soft)', acc: 'var(--lp-acc)', accLine: 'var(--lp-acc-line)', neg: 'var(--lp-neg)'};
  const pts = a => typeof a === 'string' ? a : a.map(q => q.join(',')).join(' ');
  /* tone: undefined (line + body), 'acc' (the accent body with its line), 'neg' (red line), 'soft' (a quiet detail line) */
  class Pen {
    constructor(g, k) { this.g = g; this.k = k; }
    child(attrs = {}, sc = 1) { const e = document.createElementNS(NS, 'g'); for (const a in attrs) e.setAttribute(a, attrs[a]); this.g.appendChild(e); return new Pen(e, this.k / sc); }
    _d(tag, a, o = {}) {
      const e = document.createElementNS(NS, tag);
      for (const n in a) e.setAttribute(n, a[n]);
      let fill = o.fill === true ? C.fill : o.fill || 'none', stroke = o.stroke || C.ink;
      if (o.tone === 'acc') { fill = o.fill === 'none' ? 'none' : C.acc; stroke = C.accLine; e.classList.add('lp-acc'); }
      if (o.tone === 'neg') { stroke = C.neg; if (o.fill && o.fill !== 'none') fill = C.neg; }
      if (o.tone === 'soft') stroke = C.soft;
      e.setAttribute('style', `fill:${fill};stroke:${stroke};stroke-width:${((o.sw ?? 3) * this.k).toFixed(3)}px;stroke-linecap:round;stroke-linejoin:round${o.dash ? `;stroke-dasharray:${o.dash.map(v => v * this.k).join(' ')}` : ''}${o.op != null ? `;opacity:${o.op}` : ''}`);
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
    const d = div(`left:0;top:0;width:600px;height:340px${z != null ? `;z-index:${z}` : ''}`, g, `<svg width="600" height="340" style="overflow:visible"><g></g></svg>`);
    return {el: d, p: new Pen(d.querySelector('g'), small ? 1 : 1 / 1.6)};
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
  return {C, Pen, layer, word, wordL, ico, row, person, at, iso, isoBox, parts};
})();
const S11 = {human: icon => /^(user|users|baby|person|contact|smile)/.test(icon ?? 'user')};

/* ================= B10 คน: who? {icon, label?}, label?, tags? [≤2] ================= */
/* 1 · people stand in a row; on the key word the one this is for raises a hand and lights up, and the words show above */
R3.both('B10', 'hands', 'คนยืนเรียงกัน คนที่ใช่ยกมือ', (K, s, T, g, small) => {
  const tags = (s.tags ?? []).slice(0, 2), G = 322, H = 200, xs = [100, 200, 300, 400, 500];
  const {p} = LP.layer(g, small); LP.parts.floor(p, 50, 550, G);
  xs.forEach((x, k) => { if (k !== 2) { const q = LP.person(p, {x, y: G, h: H}); q.g.style.opacity = .42; } });
  LP.person(p, {x: 300, y: G, h: H, pose: 'wave', tone: 'acc'});
  const W = 250, Hc = tags.length ? 96 : 58, y0 = 112 - Hc - 10;
  p.rect(300 - W / 2, y0, W, Hc, {rx: 18, fill: true, sw: 2.6});
  LP.row(K, g, {icon: s.who?.icon ?? 'user', label: s.label ?? s.who?.label}, 300, y0 + 10, 30, W - 30);
  tags.forEach((t, k) => { const w = tags.length === 2 ? 110 : 160, x = tags.length === 2 ? 300 - 114 + k * 118 : 300 - w / 2;
    p.rect(x, y0 + 52, w, 32, {rx: 16, fill: true, tone: 'acc', sw: 2}); LP.word(K, g, t, x + w / 2, y0 + 55, 20, w - 14, true); });
});

/* 2 · a person waiting at arrivals holds up a sign made out to this kind of person */
R3.both('B10', 'sign', 'คนถือป้ายรอรับ บนป้ายคือคนกลุ่มนี้', (K, s, T, g, small) => {
  const tags = (s.tags ?? []).slice(0, 2), G = 330, H = 300, X = 300;
  const {p} = LP.layer(g, small); LP.parts.floor(p, 150, 450, G);
  LP.person(p, {x: X, y: G, h: H, pose: 'hold'});
  const W = 300, Hs = 128, x0 = X - W / 2, y0 = 100;
  p.rect(x0, y0, W, Hs, {rx: 10, fill: true});
  [[-172, -58], [172, -58]].forEach(([px, py]) => { const [hx, hy] = LP.at(X, G, H, px, py); p.circle(hx, hy, 12, {fill: true, sw: 2.6}); });
  p.circle(x0 + 40, y0 + 42, 22, {fill: true, tone: 'acc', sw: 2.2}); LP.ico(g, s.who?.icon ?? 'user', x0 + 40, y0 + 42, 24, true);
  if (s.label) LP.wordL(K, g, s.label, x0 + 72, y0 + 22, 30, W - 100);
  tags.forEach((t, k) => { const w = tags.length === 2 ? 118 : 160, x = x0 + 24 + k * 126;
    p.rect(x, y0 + 80, w, 30, {rx: 15, fill: true, tone: 'acc', sw: 2}); LP.word(K, g, t, x + w / 2, y0 + 82, 19, w - 14, true); });
});

/* ================= B13 เคล็ดลับ: secret {icon, label?} ================= */
/* 3 · a secret file: the cover opens a little and the paper with the tip slides up out of it; a stamp on the cover */
R3.both('B13', 'dossier', 'แฟ้มลับ กระดาษเคล็ดลับเลื่อนออกมา', (K, s, T, g, small) => {
  const it = s.secret ?? {icon: 'lightbulb'};
  const back = LP.layer(g, small).p;
  back.path('M 100 86 Q 100 74 112 74 L 214 74 L 232 94 L 488 94 Q 500 94 500 106 L 500 314 Q 500 326 488 326 L 112 326 Q 100 326 100 314 Z', {fill: true});
  back.rect(150, 30, 300, 240, {rx: 6, fill: true});
  back.line(176, 150, 424, 150, {sw: 1.6, tone: 'soft'});
  LP.ico(g, it.icon, 300, 70, 46); if (it.label) LP.word(K, g, it.label, 300, 98, 32, 260);
  const fr = LP.layer(g, small).p;
  fr.path('M 100 186 L 500 166 L 500 314 Q 500 326 488 326 L 112 326 Q 100 326 100 314 Z', {fill: true});
  fr.line(130, 226, 260, 226, {sw: 1.6, tone: 'soft'}); fr.line(130, 252, 220, 252, {sw: 1.6, tone: 'soft'});
  /* the stamp: a red box with a padlock in it, a little turned */
  const st = fr.child({transform: 'rotate(-8 384 258)'});
  st.rect(318, 224, 132, 68, {rx: 12, tone: 'neg', sw: 3.4});
  st.rect(368, 256, 32, 24, {rx: 4, tone: 'neg', sw: 3}); st.path('M 374 256 L 374 248 Q 374 236 384 236 Q 394 236 394 248 L 394 256', {tone: 'neg', sw: 3});
});

/* 4 · a torch in the dark: the beam sweeps across and stops on the tip, which lights up; the rest stays faint */
R3.both('B13', 'torch', 'ไฟฉายส่องหาในที่มืด เจอเคล็ดลับ', (K, s, T, g, small) => {
  const it = s.secret ?? {icon: 'lightbulb'};
  const {p} = LP.layer(g, small);
  [[52, 36, 150, 70], [226, 250, 130, 62], [60, 150, 96, 58]].forEach(([x, y, w, h]) => p.rect(x, y, w, h, {rx: 14, tone: 'soft', sw: 2, dash: [8, 9]}));
  /* the beam: two lines that spread from the lens to the tip */
  p.path('M 214 216 L 330 26 L 546 26 L 546 192 L 232 240 Z', {fill: 'var(--lp-acc)', stroke: 'none', op: .28});
  p.line(214, 216, 330, 26, {sw: 1.6, tone: 'soft'}); p.line(232, 240, 546, 192, {sw: 1.6, tone: 'soft'});
  p.rect(344, 44, 186, 132, {rx: 20, fill: true, tone: 'acc'});
  LP.ico(g, it.icon, 437, 86, 46, true); if (it.label) LP.word(K, g, it.label, 437, 116, 28, 166, true);
  /* the torch: handle with grip lines, a wider head, the lens; pointing up to the right */
  const tq = p.child({transform: 'rotate(-30 180 262)'});
  tq.rect(36, 242, 120, 42, {rx: 12, fill: true});
  [70, 90, 110].forEach(x => tq.line(x, 250, x, 276, {sw: 1.6, tone: 'soft'}));
  tq.path('M 154 236 L 196 226 Q 204 226 204 234 L 204 292 Q 204 300 196 300 L 154 290 Z', {fill: true});
  tq.line(214, 232, 214, 294, {sw: 5, tone: 'acc'});
});

/* ================= B20 ความสัมพันธ์: a {icon, label?}, b {icon, label?}, label?, cut? ================= */
/* 5 · two people turn to face each other and the link shows between them; when it is over they stand back to back */
R3.both('B20', 'face', 'สองคนหันหน้าเข้าหากัน (จบกัน = หันหลังให้กัน)', (K, s, T, g, small) => {
  const a = s.a ?? {icon: 'user'}, b = s.b ?? {icon: 'user'}, cut = !!s.cut, G = 318, H = 236, xa = 190, xb = 410;
  const {p} = LP.layer(g, small); LP.parts.floor(p, 70, 530, G);
  const one = (it, x, face) => {
    if (S11.human(it.icon)) LP.person(p, {x, y: G, h: H, pose: 'side', face});
    else { p.rect(x - 64, G - 150, 128, 150, {rx: 14, fill: true}); LP.ico(g, it.icon, x, G - 76, 64); }
    if (it.label) LP.word(K, g, it.label, x, 26, 28, 160);
  };
  one(a, xa, cut ? -1 : 1); one(b, xb, cut ? 1 : -1);
  if (s.label) { p.rect(232, 128, 136, 44, {rx: 22, fill: true, tone: cut ? undefined : 'acc', sw: 2.4}); LP.word(K, g, s.label, 300, 135, 24, 120, !cut); }
  if (cut) LP.parts.cross(p, 300, 234, .45);
});

/* 6 · two hands meet in a handshake on the key word; when it is over the hands let go */
R3.both('B20', 'shake', 'มือสองข้างจับมือกัน (จบกัน = ปล่อยมือ)', (K, s, T, g, small) => {
  const a = s.a ?? {icon: 'user'}, b = s.b ?? {icon: 'user'}, cut = !!s.cut, d = cut ? 36 : 0;
  const {p} = LP.layer(g, small);
  /* the left arm: sleeve, cuff, then its hand (palm, thumb over the top) */
  const L = p.child({transform: `translate(${-d} 0)`});
  L.rect(-10, 186, 190, 66, {rx: 12, fill: true}); L.rect(166, 180, 26, 78, {rx: 8, fill: true, tone: 'acc'});
  L.rect(190, 192, 104, 56, {rx: 24, fill: true});
  L.tube([[214, 196], [270, 176], [298, 178]], 22);
  /* the right arm comes from the right; its four fingers wrap over the left hand */
  const R = p.child({transform: `translate(${d} 0)`});
  R.rect(420, 186, 200, 66, {rx: 12, fill: true}); R.rect(408, 180, 26, 78, {rx: 8, fill: true, tone: 'acc'});
  R.rect(312, 188, 104, 62, {rx: 24, fill: true});
  [0, 1, 2, 3].forEach(k => R.tube([[330, 196 + k * 15], [254 + k * 4, 200 + k * 15]], 15));
  const lab = (it, cx) => { if (!it.label && !it.icon) return; p.rect(cx - 90, 36, 180, 46, {rx: 23, fill: true, sw: 2.4}); LP.row(K, g, it, cx, 44, 24, 160); };
  lab(a, 130); lab(b, 470);
  if (s.label) { p.rect(232, 110, 136, 44, {rx: 22, fill: true, tone: cut ? undefined : 'acc', sw: 2.4}); LP.word(K, g, s.label, 300, 117, 24, 120, !cut); }
});

/* ================= B21 สถานที่: place {icon, label?}, spots? [1-2 {icon, label?}] ================= */
/* 7 · a big road sign on two posts slides in as if driving past, and stops: the name of the place */
R3.both('B21', 'roadsign', 'ป้ายริมทางบนเสาสองต้น บอกชื่อที่', (K, s, T, g, small) => {
  const pl = s.place ?? {icon: 'map-pin'}, sp = (s.spots ?? []).slice(0, 2);
  const {p} = LP.layer(g, small); LP.parts.floor(p, 40, 540, 322);
  p.rect(166, 160, 22, 162, {rx: 4, fill: true}); p.rect(412, 160, 22, 162, {rx: 4, fill: true});
  p.rect(84, 26, 432, 146, {rx: 18, fill: true, tone: 'acc'}); p.rect(98, 40, 404, 118, {rx: 10, tone: 'acc', fill: 'none', sw: 2.2});
  LP.ico(g, pl.icon, 156, 99, 60, true);
  if (pl.label) LP.wordL(K, g, pl.label, 206, 70, 48, 286, true);
  sp.forEach((it, k) => { const x = sp.length === 2 ? 92 + k * 216 : 200; p.rect(x, 196, 200, 46, {rx: 10, fill: true, sw: 2.4}); LP.row(K, g, it, x + 100, 204, 24, 180); });
});

/* 8 · a selfie: a person holds the phone up, the flash goes, and behind them is the place */
R3.both('B21', 'selfie', 'คนยกมือถือเซลฟี่ ฉากหลังเป็นสถานที่', (K, s, T, g, small) => {
  const pl = s.place ?? {icon: 'map-pin'}, sp = (s.spots ?? []).slice(0, 2), G = 330, H = 270, X = 190;
  const bk = LP.layer(g, small).p;
  bk.rect(150, 16, 394, 222, {rx: 18, fill: true});
  LP.ico(g, pl.icon, 410, 80, 84); if (pl.label) LP.word(K, g, pl.label, 410, 130, 36, 230);
  sp.forEach((it, k) => { const y = 248 + k * 44; bk.rect(350, y, 190, 38, {rx: 19, fill: true, sw: 2.2}); LP.row(K, g, it, 445, y + 7, 20, 170); });
  const {p} = LP.layer(g, small); LP.parts.floor(p, 90, 300, G);
  LP.person(p, {x: X, y: G, h: H, pose: 'selfie'});
  const [hx, hy] = LP.at(X, G, H, 116, -172);
  p.rect(hx - 20, hy - 46, 40, 70, {rx: 9, fill: true}); p.circle(hx, hy - 32, 5, {sw: 2});
  LP.parts.burst(p, {x: hx, y: hy - 32, r1: 16, r2: 30, n: 5, from: -90, spread: 150, sw: 3, tone: 'acc'});
});

/* ================= B12 เหตุกับผล: items [3 {icon, label?, tone?}], end? ================= */
/* 9 · a stone drops into still water (the first cause); the rings spread out one after the other, the outer one is the effect */
R3.both('B12', 'ripple', 'หินตกน้ำ วงคลื่นกระเพื่อมออกไปทีละวง', (K, s, T, g, small) => {
  const it = (s.items ?? []).slice(0, 3), C = [300, 216], neg = it[2]?.tone === 'neg';
  const {p} = LP.layer(g, small);
  p.ellipse(C[0], C[1], 250, 74, {fill: true});
  p.ellipse(C[0], C[1], 52, 15, {sw: 2.2}); p.ellipse(C[0], C[1], 124, 36, {sw: 2.2, tone: 'soft'});
  p.ellipse(C[0], C[1], 204, 58, {sw: 4, tone: neg ? 'neg' : 'acc', fill: 'none'});
  p.line(C[0], 108, C[0], C[1] - 22, {sw: 1.6, tone: 'soft', dash: [6, 10]});
  p.path('M 262 74 C 258 48 280 32 304 34 C 330 36 346 52 342 74 C 338 94 318 100 300 100 C 280 100 264 94 262 74 Z', {fill: true});
  p.path('M 280 50 Q 292 42 306 44', {sw: 1.6, tone: 'soft'});
  if (it[0]) LP.ico(g, it[0].icon, 302, 70, 32);
  if (it[0]?.label) LP.wordL(K, g, it[0].label, 352, 46, 28, 190);
  if (it[1]) { p.rect(64, 160, 168, 40, {rx: 20, fill: true, sw: 2.2}); LP.row(K, g, it[1], 148, 166, 22, 150); }
  if (it[2]) { p.rect(204, 260, 192, 46, {rx: 23, fill: true, tone: neg ? undefined : 'acc', sw: 2.4}); if (neg) p.rect(204, 260, 192, 46, {rx: 23, tone: 'neg', sw: 3}); LP.row(K, g, it[2], 300, 268, 24, 172, !neg); }
});

/* 10 · a Newton's cradle: the first ball swings in and knocks; the force goes through the middle and the last ball flies out */
R3.both('B12', 'cradle', 'ลูกตุ้มนิวตัน ลูกแรกชน ลูกสุดท้ายดีดออก', (K, s, T, g, small) => {
  const it = (s.items ?? []).slice(0, 3), xs = [180, 240, 300, 360, 420], top = 40, L = 150, R = 29, neg = it[2]?.tone === 'neg';
  const {p} = LP.layer(g, small);
  p.rect(108, 26, 384, 14, {rx: 7, fill: true}); p.line(120, 40, 100, 300, {sw: 3}); p.line(480, 40, 500, 300, {sw: 3});
  p.rect(72, 300, 456, 16, {rx: 8, fill: true});
  const ang = 36 * Math.PI / 180, pos = xs.map((x, k) => k === 4 ? [x + L * Math.sin(ang), top + L * Math.cos(ang)] : [x, top + L]);
  pos.forEach(([x, y], k) => p.line(xs[k], top, x, y - R, {sw: 1.6, tone: 'soft'}));
  pos.forEach(([x, y], k) => {
    const lit = k === 4; p.circle(x, y, R, {fill: true, tone: lit && !neg ? 'acc' : undefined}); if (lit && neg) p.circle(x, y, R, {tone: 'neg', sw: 3.4});
    const i = k === 0 ? it[0] : k === 2 ? it[1] : k === 4 ? it[2] : null; if (i) LP.ico(g, i.icon, x, y, 30, lit && !neg);
  });
  [[0, 180], [1, 300], [2, 420]].forEach(([k, x]) => { if (it[k]?.label) LP.word(K, g, it[k].label, x, 230, 22, 110); });
});

/* ================= B05 ถูกกับผิด: wrong {icon, label?}, right {icon, label?} ================= */
/* 11 · a shape-sorter box: the wrong block will not go in and bounces off; the right block drops into its hole */
R3.both('B05', 'sorter', 'กล่องหยอดรูปทรง รูปผิดใส่ไม่ลง รูปถูกลงพอดี', (K, s, T, g, small) => {
  const w = s.wrong ?? {icon: 'x'}, r = s.right ?? {icon: 'check'};
  const {p} = LP.layer(g, small); LP.parts.floor(p, 30, 540, 322);
  const box = LP.isoBox(p, {x: 360, y: 322, w: 190, dp: 150, h: 120});
  /* the holes on the top face: a square, a circle, a triangle */
  const Pt = (X, Z) => box.P(X, 120, Z);
  p.shape([Pt(-60, 40), Pt(-20, 40), Pt(-20, 0), Pt(-60, 0)], {sw: 2.4});
  const c = Pt(30, -20); p.ellipse(c[0], c[1], 22, 12, {sw: 2.4});
  p.shape([Pt(40, 50), Pt(70, 40), Pt(70, 10)], {sw: 2.4});
  /* the right block, half way into the square hole */
  const h0 = Pt(-40, 20), rb = LP.layer(g, small);
  rb.el.style.clipPath = `inset(0 0 ${340 - h0[1]}px 0)`;
  rb.p.rect(h0[0] - 34, h0[1] - 92, 68, 104, {rx: 10, fill: true, tone: 'acc'});
  LP.ico(g, r.icon, h0[0], h0[1] - 52, 36, true);
  if (r.label) LP.word(K, g, r.label, h0[0], h0[1] - 140, 28, 180);
  /* the wrong block lies on the floor where it bounced off, crossed */
  const wq = p.child({transform: 'rotate(-14 100 270)'});
  wq.path('M 100 214 L 150 312 L 50 312 Z', {fill: true});
  LP.ico(g, w.icon, 100, 284, 30); LP.parts.cross(p, 154, 236, .32);
  if (w.label) LP.word(K, g, w.label, 100, 162, 26, 150);
});

/* 12 · ticket gates: the wrong card is tapped and the gate stays shut (red); the right card is tapped and the gate opens */
R3.both('B05', 'gate', 'ประตูกั้นรถไฟฟ้า บัตรผิดไม่เปิด บัตรถูกเปิด', (K, s, T, g, small) => {
  const w = s.wrong ?? {icon: 'x'}, r = s.right ?? {icon: 'check'};
  const {p} = LP.layer(g, small); LP.parts.floor(p, 30, 540, 322);
  /* the flaps: shut in the left lane (red), folded back in the right lane */
  p.rect(130, 236, 72, 34, {rx: 14, fill: true, tone: 'neg'}); p.rect(198, 236, 72, 34, {rx: 14, fill: true, tone: 'neg'});
  p.rect(330, 236, 34, 34, {rx: 12, fill: true, tone: 'acc'}); p.rect(436, 236, 34, 34, {rx: 12, fill: true, tone: 'acc'});
  [60, 262, 464].forEach(x => { p.path(`M ${x} 322 L ${x} 200 Q ${x} 186 ${x + 14} 186 L ${x + 62} 186 Q ${x + 76} 186 ${x + 76} 200 L ${x + 76} 322`, {fill: true});
    p.rect(x + 16, 196, 44, 14, {rx: 4, sw: 2}); });
  p.line(76, 182, 120, 182, {sw: 5, tone: 'neg'}); p.line(480, 182, 524, 182, {sw: 5, tone: 'acc'});
  const card = (it, x, ok) => {
    p.rect(x, 30, 160, 112, {rx: 14, fill: true, tone: ok ? 'acc' : undefined});
    LP.ico(g, it.icon, x + 80, 66, 38, ok); if (it.label) LP.word(K, g, it.label, x + 80, 92, 26, 140, ok);
    if (ok) LP.parts.check(p, x + 150, 34, .3, {sw: 5}); else LP.parts.cross(p, x + 150, 36, .25);
  };
  card(w, 120, false); card(r, 322, true);
});

/* ================= B11 คำพูด: kind, quote, mood?, react?, gone? ================= */
/* 13 · a home phone rings, the handset is picked up and what was said comes out of it */
R3.both('B11', 'landline', 'โทรศัพท์บ้านดัง ยกหูขึ้น คำพูดลอยออกมา', (K, s, T, g, small) => {
  const q = s.quote ?? '', bad = s.mood === 'bad';
  const {p} = LP.layer(g, small);
  /* the cord first (behind), the phone, then the lifted handset */
  p.path([...Array(8)].map((_, k) => { const y = 262 - k * 16, x = 106 - k * 2; return `${k ? 'C' : 'M'} ${k ? `${x - 26} ${y + 10} ${x - 26} ${y - 8} ` : ''}${x} ${y}`; }).join(' '), {sw: 2.2});
  p.path('M 112 236 L 146 186 Q 150 180 158 180 L 322 180 Q 330 180 334 186 L 368 236 L 368 302 Q 368 316 354 316 L 126 316 Q 112 316 112 302 Z', {fill: true});
  p.rect(150, 168, 34, 16, {rx: 6, fill: true}); p.rect(296, 168, 34, 16, {rx: 6, fill: true});
  [0, 1, 2].forEach(r => [0, 1, 2].forEach(c => p.rect(196 + c * 34, 222 + r * 28, 24, 18, {rx: 5, sw: 1.8, tone: 'soft'})));
  const hs = p.child({transform: 'rotate(-14 230 104)'});
  hs.rect(160, 94, 140, 24, {rx: 12, fill: true});
  hs.path('M 132 96 Q 132 82 146 82 L 184 82 Q 196 82 196 96 L 192 130 Q 190 142 178 142 L 146 142 Q 132 142 132 128 Z', {fill: true});
  hs.path('M 264 96 Q 264 82 278 82 L 316 82 Q 330 82 330 96 L 330 128 Q 330 142 316 142 L 284 142 Q 270 142 268 130 Z', {fill: true});
  LP.parts.burst(p, {x: 238, y: 104, r1: 76, r2: 94, n: 3, from: -160, spread: 40, sw: 2.6, tone: 'soft'});
  LP.parts.bubble(p, 430, 74, 220, 104, false, {sw: 2.6});
  if (q) LP.word(K, g, q, 430, 50, 38, 196);
  if (s.react) { p.circle(530, 128, 24, {fill: true, tone: bad ? 'neg' : 'acc', sw: 2.4}); LP.ico(g, s.react, 530, 128, 26, !bad); }
});

/* 14 · a typewriter types the message onto the paper, which rolls up out of it */
R3.both('B11', 'typewriter', 'เครื่องพิมพ์ดีดพิมพ์ข้อความ กระดาษเลื่อนขึ้น', (K, s, T, g, small) => {
  const q = s.quote ?? '', bad = s.mood === 'bad';
  const {p} = LP.layer(g, small);
  p.rect(176, 14, 248, 186, {rx: 4, fill: true});
  if (q) LP.word(K, g, q, 300, 52, 38, 210);
  p.line(206, 120, 394, 120, {sw: 1.6, tone: 'soft'}); p.line(206, 146, 330, 146, {sw: 1.6, tone: 'soft'});
  p.rect(132, 166, 336, 34, {rx: 17, fill: true}); p.circle(118, 183, 18, {fill: true}); p.circle(482, 183, 18, {fill: true});
  p.path('M 128 214 Q 128 202 140 202 L 460 202 Q 472 202 474 214 L 500 300 Q 504 318 486 318 L 114 318 Q 96 318 100 300 Z', {fill: true});
  [[150, 232, 10], [164, 258, 9], [194, 284, 7]].forEach(([x0, y, n]) => { for (let k = 0; k < n; k++) p.circle(x0 + k * 32 + 9, y, 9, {sw: 1.8}); });
  p.rect(236, 298, 128, 10, {rx: 5, sw: 1.8});
  if (s.react) { p.circle(398, 120, 22, {fill: true, tone: bad ? 'neg' : 'acc', sw: 2.4}); LP.ico(g, s.react, 398, 120, 24, !bad); }
});

/* ================= B01 ตัวเลขเด่น: value, unit?, icon?, dir?, money? ================= */
/* 15 · a price tag hangs on its string, swings and comes to rest: the amount on it (money only) */
R3.both('B01', 'pricetag', 'ป้ายราคาแขวน แกว่งแล้วหยุด', (K, s, T, g, small) => {
  const {p, el} = LP.layer(g, small);
  p.path('M 300 -6 Q 290 40 300 80', {sw: 2.2});
  const tg = p.child({transform: 'rotate(-6 300 80)'});
  tg.path('M 280 62 Q 300 50 320 62 L 422 118 Q 432 124 432 136 L 432 308 Q 432 322 418 322 L 182 322 Q 168 322 168 308 L 168 136 Q 168 124 178 118 Z', {fill: true});
  tg.circle(300, 88, 12, {sw: 2.6});
  tg.line(196, 290, 404, 290, {sw: 1.6, tone: 'soft'});
  const hold = R6.group(g); hold.style.transformOrigin = '300px 80px'; hold.style.transform = 'rotate(-6deg)';
  if (s.icon) LP.ico(hold, s.icon, 300, 136, 36);
  const n = div(`left:168px;top:${s.icon ? 162 : 140}px;width:264px;text-align:center`, hold, `<span class="u-num lp-t" style="font-size:72px">${s.value}</span>`);
  FITS.push(() => { const sp = n.firstChild; if (sp.offsetWidth > 230) sp.style.fontSize = (72 * 230 / sp.offsetWidth).toFixed(1) + 'px'; });
  if (s.unit) LP.word(K, hold, s.unit, 300, s.icon ? 240 : 222, 28, 200);
}, R2.money);

/* 16 · a wallet opens and the banknotes slide up out of it; the amount is on the top note (money only) */
R3.both('B01', 'wallet', 'กระเป๋าสตางค์เปิด ธนบัตรเลื่อนออก มีจำนวนเงิน', (K, s, T, g, small) => {
  const bk = LP.layer(g, small).p;
  const note = (x, y, rot) => { const q = bk.child({transform: `rotate(${rot} ${x + 150} ${y + 75})`});
    q.rect(x, y, 300, 150, {rx: 8, fill: true}); q.rect(x + 12, y + 12, 276, 126, {rx: 5, sw: 1.6, tone: 'soft'});
    q.circle(x + 30, y + 30, 8, {sw: 1.6, tone: 'soft'}); q.circle(x + 270, y + 120, 8, {sw: 1.6, tone: 'soft'}); };
  note(150, 58, -7); note(152, 46, 5); note(150, 28, 0);
  const n = div('left:150px;top:46px;width:300px;text-align:center', g, `<span class="u-num lp-t" style="font-size:64px">${s.value}</span>`);
  FITS.push(() => { const sp = n.firstChild; if (sp.offsetWidth > 240) sp.style.fontSize = (64 * 240 / sp.offsetWidth).toFixed(1) + 'px'; });
  if (s.unit) LP.word(K, g, s.unit, 300, 118, 26, 220);
  const {p} = LP.layer(g, small);
  p.rect(112, 168, 376, 152, {rx: 22, fill: true}); p.rect(124, 180, 352, 128, {rx: 14, sw: 1.4, tone: 'soft'});
  p.rect(388, 214, 120, 64, {rx: 22, fill: true}); p.circle(474, 246, 9, {sw: 2.6, tone: 'acc', fill: true});
  if (s.icon) LP.ico(g, s.icon, 196, 244, 40);
}, R2.money);

/* ================= B02 เพิ่ม / ลด: dir, item, center?, n?, keep?, end? ================= */
/* 17 · a queue at a shop: people join it (up) or walk away until few are left (down). Only when the thing is people */
R3.both('B02', 'queue', 'คิวคนหน้าร้าน ยาวขึ้นหรือสั้นลง', (K, s, T, g, small) => {
  const up = s.dir !== 'down', keep = Math.max(1, Math.min(s.keep ?? 1, 4)), G = 322, H = 156, xs = [376, 306, 236, 166, 96];
  const {p} = LP.layer(g, small); LP.parts.floor(p, 40, 548, G);
  /* the shop: a box, an awning with scallops, the owner's sign, a door */
  p.rect(424, 128, 116, 194, {rx: 6, fill: true});
  p.path('M 412 104 L 552 104 L 552 142 ' + [...Array(5)].map((_, k) => `Q ${545 - k * 28} 160 ${538 - k * 28} 142`).join(' ') + ' L 412 142 Z', {fill: true, tone: 'acc'});
  p.rect(454, 212, 56, 110, {rx: 6, fill: true}); p.dot(500, 268, 3.5);
  LP.ico(g, s.center?.icon ?? 'store', 482, 176, 34);
  xs.forEach((x, k) => {
    const on = up || k < keep, last = up && k === xs.length - 1;
    if (on) LP.person(p, {x, y: G, h: H, pose: last ? 'wave' : 'stand', tone: last ? 'acc' : undefined});
    else { const q = LP.person(p, {x, y: G, h: H}); q.g.style.opacity = .16; }
  });
  LP.parts.link(p, up ? 60 : 96, up ? 92 : 56, up ? 96 : 60, up ? 56 : 92, {sw: 3.4, head: 16, tone: up ? undefined : 'neg'});
}, s => S11.human(s.item?.icon));

/* 18 · boxes pile up one on another (up) or are taken off until few are left (down) */
R3.both('B02', 'boxes', 'กล่องซ้อนสูงขึ้น หรือถูกหยิบออกทีละกล่อง', (K, s, T, g, small) => {
  const up = s.dir !== 'down', keep = Math.max(1, Math.min(s.keep ?? 1, 5)), it = s.item ?? {icon: 'package'};
  const {p} = LP.layer(g, small); LP.parts.floor(p, 60, 540, 322);
  const W = 84, spots = [[-1, 0], [0, 0], [1, 0], [-.5, 1], [.5, 1], [0, 2]];
  spots.forEach(([c, r], k) => {
    const on = up || k < keep, x = 290 + c * W * .87 * 1.15, y = 322 - r * 74 - (r ? 0 : 0);
    const before = p.g.childNodes.length;
    const bx = LP.isoBox(p, {x, y, w: 70, dp: 70, h: 70, tone: up && k === spots.length - 1 ? 'acc' : undefined, tape: true});
    if (!on) [...p.g.childNodes].slice(before).forEach(e => { e.style.opacity = .18; e.style.strokeDasharray = '5 6'; });
    else { const f = bx.front, cx = (f[0][0] + f[1][0]) / 2, cy = (f[0][1] + f[2][1]) / 2; LP.ico(g, it.icon, cx, cy, 26); }
  });
  LP.parts.link(p, 470, up ? 120 : 60, 470, up ? 60 : 120, {sw: 3.4, head: 16, tone: up ? undefined : 'neg'});
});

/* ================= B14 ประโยคเด็ด: idea {icon?, label} ================= */
/* 19 · an open book; a highlighter runs along one line and the line it marks is the punchline */
R3.both('B14', 'highlight', 'ปากกาไฮไลต์ขีดประโยคในหนังสือ', (K, s, T, g, small) => {
  const it = s.idea ?? {icon: 'quote'};
  const {p} = LP.layer(g, small);
  p.path('M 300 50 Q 172 26 46 46 L 46 314 Q 172 296 300 318 Z', {fill: true});
  p.path('M 300 50 Q 428 26 554 46 L 554 314 Q 428 296 300 318 Z', {fill: true});
  [88, 124, 160, 196, 232, 268].forEach((y, k) => p.line(76, y, k === 5 ? 190 : 270, y, {sw: 1.6, tone: 'soft'}));
  [88, 124, 232, 268].forEach((y, k) => p.line(330, y, k === 3 ? 440 : 524, y, {sw: 1.6, tone: 'soft'}));
  p.rect(322, 150, 210, 58, {rx: 6, fill: 'var(--lp-acc)', stroke: 'none'});
  LP.row(K, g, it, 427, 160, 28, 196, true);
  /* the highlighter pen, its chisel tip at the end of the line */
  const pen = p.child({transform: 'rotate(38 538 204)'});
  pen.rect(522, 96, 32, 92, {rx: 8, fill: true}); pen.rect(522, 96, 32, 26, {rx: 8, fill: true, tone: 'acc'});
  pen.path('M 526 188 L 550 188 L 544 206 L 532 206 Z', {fill: true});
});

/* 20 · a speaker on a stage points at the screen, and the punchline is up on it */
R3.both('B14', 'slides', 'คนยืนชี้จอสไลด์ ประโยคขึ้นจอ', (K, s, T, g, small) => {
  const it = s.idea ?? {icon: 'quote'}, G = 326, H = 250, X = 124;
  const {p} = LP.layer(g, small); LP.parts.floor(p, 40, 540, G);
  p.line(386, 200, 386, 296, {sw: 3}); p.line(386, 290, 336, G, {sw: 3}); p.line(386, 290, 436, G, {sw: 3});
  p.rect(222, 20, 328, 184, {rx: 12, fill: true}); p.rect(236, 34, 300, 156, {rx: 6, sw: 1.6, tone: 'soft'});
  LP.ico(g, it.icon, 386, 82, 54); if (it.label) LP.word(K, g, it.label, 386, 118, 38, 280);
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
