/* =====================================================================
   CutPack · uni · SKETCHES for round 11 (Friend 2026-11-11: "เริ่มรอบ 11 ได้ครับ"). Two new drafts for each of ten
   categories: B10 คน · B13 เคล็ดลับ · B20 ความสัมพันธ์ · B21 สถานที่ · B12 เหตุกับผล · B05 ถูกกับผิด · B11 คำพูด ·
   B01 ตัวเลขเด่น · B02 เพิ่ม/ลด · B14 ประโยคเด็ด. Ideas: one main thing + one move on the key word, then it holds
   (talking-head-motion), checked against every draft in all 21 categories and the deleted ones (DECISIONS round 11).

   DRAWN THE WAY FRIEND'S glow-line-motion SKILL IN THE REPO DRAWS, 100% (Friend 2026-11-11: "ข ครับ Skill ใน repo เป็นเวอร์ชั่นปัจจุบัน",
   after "วาดตาม skill 100% แต่ธีมสีและการเรืองแสง ให้ทำตามสไตล์นั้นๆ"; .claude/skills/glow-line-motion/references/style.md + drawing.md):
   flat front (or side) view, an outline + a FLAT body fill (no shading, no gradient in things), round corners, 1–3 details in
   thin soft lines (1.4–1.8), main lines 3, no line thicker than 7; people are the skill's pictograms (parts.person / bust / team:
   round head, capsule arms and legs, no face, no fingers), the hand is the skill's parts.hand, the bulb, bubble and arrows are
   the skill's parts (SK below, same shapes and numbers). Only the colours are each style's own (--lp-* below) and the glow is
   the style's own (glass glows blue on every line, gold glows orange on the accent, card and split do not glow).
   KIT-LIKE (Friend 2026-11-11: "อยากให้ดูชุด kit ของ skill เป็นแบบอย่าง"): ONE main thing in the middle, big enough to fill the
   frame, at most one word under it or on it; no extra cards, chips, floors, ghosts or decoration.
   The ideas are the category's own signs (Friend 2026-11-11, LESSONS 41). The earlier shaded "20 WAYS" drawing of these 20
   drafts is no longer used (DECISIONS round 11).
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
.c-light,.p-light,.g-root{--lp-acc-edge:var(--lp-acc-line)}
.c-dark,.p-dark,.gd{--lp-acc-edge:var(--lp-acc-ink)}
.lp-t{white-space:nowrap;line-height:1.25;color:var(--lp-ink)}
.lp-t.lp-on{color:var(--lp-acc-ink)}
.lp-ico{color:var(--lp-ink)}.lp-ico.lp-on{color:var(--lp-acc-ink)}`;
  document.head.appendChild(st);
})();

const LP = (() => {
  const NS = 'http://www.w3.org/2000/svg'; let LPN = 0;
  const C = {edge: 'var(--lp-acc-edge)', ink: 'var(--lp-ink)', fill: 'var(--lp-fill)', soft: 'var(--lp-soft)', mute: 'var(--lp-soft)', acc: 'var(--lp-acc)', accLine: 'var(--lp-acc-line)', neg: 'var(--lp-neg)'};
  const pts = a => typeof a === 'string' ? a : a.map(q => q.join(',')).join(' ');
  /* tone: undefined (line + body), 'acc' (the accent body with its line), 'neg' (red line), 'soft' (a quiet detail line) */
  class Pen {
    constructor(g, k, grad, defs) { this.g = g; this.k = k; this.grad = grad; this.defs = defs; }
    child(attrs = {}, sc = 1) { const e = document.createElementNS(NS, 'g'); for (const a in attrs) e.setAttribute(a, attrs[a]); this.g.appendChild(e); return new Pen(e, this.k / sc, this.grad, this.defs); }
    _d(tag, a, o = {}) {
      const e = document.createElementNS(NS, tag);
      for (const n in a) e.setAttribute(n, a[n]);
      /* fill: true = the flat body colour (the skill: no shading, no gradient in things) */
      let fill = o.fill === true ? C.fill : o.fill || 'none', stroke = o.stroke || C.ink;
      if (o.tone === 'acc') { fill = !o.fill || o.fill === 'none' ? 'none' : C.acc; stroke = o.stroke || C.accLine; e.classList.add('lp-acc'); }
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
      a.style.strokeWidth = (T + 2 * sw) + 'px'; if (acc) a.classList.add('lp-acc');
      const core = acc ? C.acc : C.fill;
      if (acc) { const u = this._d('path', {d}, Object.assign({}, o, {fill: 'none', tone: undefined, stroke: C.fill})); u.style.strokeWidth = T + 'px'; }
      const b = this._d('path', {d}, Object.assign({}, o, {fill: 'none', tone: undefined, stroke: core}));
      b.style.strokeWidth = T + 'px';
      return b;
    }
    /* a pen whose drawing is hidden along a band: (d, width) a path stroked that wide, only inside the rectangle (x, y, w, h).
       Used where one ring passes in front of the next: the next ring is hidden exactly along the first ring's outline */
    masked(d, width, x, y, w, h) {
      const id = 'lpm' + (++LPN);
      this.defs.insertAdjacentHTML('beforeend', `<clipPath id="${id}c" clipPathUnits="userSpaceOnUse"><rect x="${x}" y="${y}" width="${w}" height="${h}"/></clipPath><mask id="${id}" maskUnits="userSpaceOnUse" x="-2000" y="-2000" width="4600" height="4400"><rect x="-2000" y="-2000" width="4600" height="4400" fill="white"/><path d="${d}" clip-path="url(#${id}c)" style="fill:none;stroke:black;stroke-width:${width}px"/></mask>`);
      return this.child({mask: `url(#${id})`});
    }
    /* a pen whose drawing is cut to a rectangle (for one link passing in front of the next) */
    clipped(x, y, w, h) { const id = 'lpc' + (++LPN); this.defs.insertAdjacentHTML('beforeend', `<clipPath id="${id}" clipPathUnits="userSpaceOnUse"><rect shape-rendering="crispEdges" x="${x}" y="${y}" width="${w}" height="${h}"/></clipPath>`); return this.child({'clip-path': `url(#${id})`}); }
  }
  /* a drawing layer the size of the canvas; small (the overlay widget) is drawn 1:1, the full screen picture 1.6× */
  const layer = (g, small, z) => {
    const id = 'lpg' + (++LPN);
    const d = div(`left:0;top:0;width:600px;height:340px${z != null ? `;z-index:${z}` : ''}`, g, `<svg width="600" height="340" style="overflow:visible"><defs>
</defs><g></g></svg>`);
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

  return {C, Pen, layer, word, wordL, ico, row};
})();
const S11 = {human: icon => /^(user|users|baby|person|contact|smile)/.test(icon ?? 'user')};

/* ================= the skill's parts (glow-line-motion assets/glowline.js), drawn with LP's pen =================
   Same shapes and numbers as the skill; only o.tone added so the one that matters takes the style's accent. */
const SK = (() => {
  const f = v => v.toFixed(1);
  const SK = {
    /* a capsule with a body fill (arms, legs, handles) */
    capsule(p, x1, y1, x2, y2, r, o = {}) {
      const a = Math.atan2(y2 - y1, x2 - x1), nx = -Math.sin(a) * r, ny = Math.cos(a) * r;
      return p.path(`M ${f(x1 + nx)} ${f(y1 + ny)} L ${f(x2 + nx)} ${f(y2 + ny)} A ${r} ${r} 0 0 0 ${f(x2 - nx)} ${f(y2 - ny)} L ${f(x1 - nx)} ${f(y1 - ny)} A ${r} ${r} 0 0 0 ${f(x1 + nx)} ${f(y1 + ny)} Z`, Object.assign({fill: true}, o));
    },
    /* the skill's standing pictogram (parts.person), but (x, y) = the floor point under the feet; h = height.
       pose: stand wave cheer point think (the skill's) + side (new here, same parts: seen from the side, face 1 right / -1 left) */
    person(p, {x, y, h = 200, pose = 'stand', face = 1, tone} = {}) {
      const sc = h / 200, q = p.child({transform: `translate(${x} ${y - 99.5 * sc}) scale(${f(sc * face)} ${f(sc)})`}, sc), o = {fill: true, tone, stroke: tone === 'acc' ? LP.C.edge : undefined};
      if (pose === 'side') {
        SK.capsule(q, -3, 12, -5, 90, 9.5, o); SK.capsule(q, -5, 92, 13, 92, 7.5, o);
        SK.capsule(q, 4, 12, 5, 90, 9.5, o); SK.capsule(q, 4, 92, 22, 92, 7.5, o);
        q.path('M -16 -38 Q -16 -50 -4 -50 L 6 -50 Q 18 -50 18 -38 L 15 12 Q 14 18 8 18 L -9 18 Q -15 18 -15 12 Z', o);
        SK.capsule(q, 2, -40, 9, 20, 8, o);
        q.circle(5, -76, 20, o);
        return q;
      }
      const A = Array.isArray(pose) ? pose : {stand: [10, 10], wave: [10, 155], cheer: [150, 150], point: [10, 88], think: [10, 150]}[pose] || [10, 10];
      SK.capsule(q, -11, 12, -12, 90, 9.5, o); SK.capsule(q, 11, 12, 12, 90, 9.5, o);
      q.path('M -30 -38 Q -30 -50 -18 -50 L 18 -50 Q 30 -50 30 -38 L 24 12 Q 23 18 16 18 L -16 18 Q -23 18 -24 12 Z', o);
      [-1, 1].forEach((side, i) => {
        const th = A[i] * Math.PI / 180, sx = side * 25, sy = -40, L = pose === 'think' && side > 0 ? 40 : 62;
        const ex = sx + side * Math.sin(th) * L, ey = sy + Math.cos(th) * L;
        if (A[i] == null) return;
        if (pose === 'think' && side > 0) { SK.capsule(q, sx, sy, ex + 8, ey + 44, 8, o); SK.capsule(q, ex + 8, ey + 44, 14, -60, 7.5, o); }
        else SK.capsule(q, sx, sy, ex, ey, 8, o);
      });
      q.circle(0, -76, 20, o);
      return q;
    },
    /* the skill's parts.bust: head + shoulders, box ±60 × ±62 around (x, y) */
    bust(p, x, y, sc = 1, {tone, op} = {}) {
      const q = p.child({transform: `translate(${x} ${y}) scale(${sc})`}, sc), o = {fill: true, tone, stroke: tone === 'acc' ? LP.C.edge : undefined};
      if (op != null) q.g.style.opacity = op;
      q.path('M -58 62 C -58 16, -32 6, 0 6 C 32 6, 58 16, 58 62 Z', o); q.circle(0, -28, 28, o);
      return q;
    },
    /* the skill's parts.team: two behind, the middle one in front */
    team(p, x, y, sc = 1, {tone, back} = {}) {
      SK.bust(p, x - 72 * sc, y + 14 * sc, .8 * sc, {op: back}); SK.bust(p, x + 72 * sc, y + 14 * sc, .8 * sc, {op: back});
      SK.bust(p, x, y, sc, {tone});
    },
    /* the skill's parts.hand: a pointing hand, fingertip at (x, y - 64·sc) */
    hand(p, x, y, sc = 1, o = {}) {
      const q = p.child({transform: `translate(${x} ${y}) scale(${sc})`}, sc);
      q.rect(-8, 48, 56, 24, Object.assign({rx: 5, fill: true}, o));
      q.path(`M -10 -10 L -10 -54 A 10 10 0 0 1 10 -54 L 10 -18 A 8 8 0 0 1 26 -18 L 26 -14 A 8 8 0 0 1 42 -14 L 42 -8 A 7.5 7.5 0 0 1 57 -8
        L 57 22 Q 57 46 40 50 L 2 50 Q -20 46 -26 30 L -38 8 A 8 8 0 0 1 -24 0 L -10 14 Z`, Object.assign({fill: true}, o));
      q.line(26, -14, 26, -2, {sw: 2}); q.line(42, -8, 42, 2, {sw: 2});
      return q;
    },
    /* the skill's parts.bulb (rays on): the bulb's middle at (x, y) */
    bulb(p, x, y, sc = 1, {tone} = {}) {
      const q = p.child({transform: `translate(${x} ${y}) scale(${sc})`}, sc);
      q.path('M -22 40 C -22 18, -50 4, -50 -24 A 50 50 0 1 1 50 -24 C 50 4, 22 18, 22 40 Z', {fill: true, tone});
      q.poly([[-12, 40], [-12, 8], [-6, -2], [0, 8], [6, -2], [12, 8], [12, 40]], {sw: 2.2, fill: 'none', stroke: tone === 'acc' ? LP.C.edge : undefined});
      q.line(-20, 50, 20, 50); q.line(-18, 60, 18, 60); q.path('M -10 68 Q 0 76 10 68');
      [-180, -150, -120, -90, -60, -30, 0].forEach(deg => { const a = deg * Math.PI / 180; q.line(Math.cos(a) * 68, -24 + Math.sin(a) * 68, Math.cos(a) * 88, -24 + Math.sin(a) * 88, {sw: 3, tone, fill: 'none'}); });
      return q;
    },
    /* the skill's parts.bubble; tail 'down' (the skill's, under the left or right quarter) or 'left' / 'right' (out of the side,
       low, for a speaker beside the bubble) */
    bubble(p, x, y, w, h, {tail = 'down', flip = false, tone, sw = 2.6} = {}) {
      const l = x - w / 2, t = y - h / 2, r = x + w / 2, b = y + h / 2, rad = Math.min(18, h / 3);
      let d;
      if (tail === 'down') { const tx = flip ? r - w * .25 : l + w * .25, s = flip ? 1 : -1;
        d = `M ${l + rad} ${t} H ${r - rad} Q ${r} ${t} ${r} ${t + rad} V ${b - rad} Q ${r} ${b} ${r - rad} ${b} H ${tx + 10} L ${tx + s * 8} ${b + 18} L ${tx - 6} ${b} H ${l + rad} Q ${l} ${b} ${l} ${b - rad} V ${t + rad} Q ${l} ${t} ${l + rad} ${t} Z`; }
      else if (tail === 'left') { const ty = b - rad - 10;
        d = `M ${l + rad} ${t} H ${r - rad} Q ${r} ${t} ${r} ${t + rad} V ${b - rad} Q ${r} ${b} ${r - rad} ${b} H ${l + rad} Q ${l} ${b} ${l} ${b - rad} V ${ty + 10} L ${l - 24} ${ty + 16} L ${l} ${ty - 10} V ${t + rad} Q ${l} ${t} ${l + rad} ${t} Z`; }
      else { const ty = b - rad - 10;
        d = `M ${l + rad} ${t} H ${r - rad} Q ${r} ${t} ${r} ${t + rad} V ${ty - 10} L ${r + 24} ${ty + 16} L ${r} ${ty + 10} V ${b - rad} Q ${r} ${b} ${r - rad} ${b} H ${l + rad} Q ${l} ${b} ${l} ${b - rad} V ${t + rad} Q ${l} ${t} ${l + rad} ${t} Z`; }
      return p.path(d, {fill: true, sw, tone});
    },
    /* the skill's parts.connect: a curved arrow, the head along the curve's end direction */
    connect(p, x1, y1, x2, y2, {bend = 0, head = 13, sw = 2.6, tone = 'soft'} = {}) {
      const L = Math.hypot(x2 - x1, y2 - y1), mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
      const cx = mx - (y2 - y1) / L * bend * L, cy = my + (x2 - x1) / L * bend * L, a = Math.atan2(y2 - cy, x2 - cx);
      p.path(`M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`, {sw, tone});
      p.poly([[x2 - Math.cos(a - .5) * head, y2 - Math.sin(a - .5) * head], [x2, y2], [x2 - Math.cos(a + .5) * head, y2 - Math.sin(a + .5) * head]], {sw, tone});
    },
    check(p, x, y, s = 1, o = {}) { p.poly([[x - 60 * s, y], [x - 20 * s, y + 42 * s], [x + 66 * s, y - 52 * s]], Object.assign({sw: 6}, o)); },
    cross(p, x, y, s = 1) { p.line(x - 40 * s, y - 40 * s, x + 40 * s, y + 40 * s, {sw: 6, tone: 'neg'}); p.line(x + 40 * s, y - 40 * s, x - 40 * s, y + 40 * s, {sw: 6, tone: 'neg'}); },
  };
  return SK;
})();
const iso = (X, Y, Z) => [(X - Z) * .866, (X + Z) * .5 - Y];

/* ================= B10 คน: who? {icon, label?}, label?, tags? [≤2] ================= */
/* 1 · the one this is for raises a hand (the skill's wave pictogram, in the accent) */
R3.both('B10', 'raise', 'คนที่ใช่ยกมือ', (K, s, T, g, small) => {
  const {p} = LP.layer(g, small);
  SK.person(p, {x: 300, y: 266, h: 250, pose: 'wave', tone: 'acc'});
  const w = s.label ?? s.who?.label; if (w) LP.word(K, g, w, 300, 280, 36, 340);
});

/* 2 · a target sight closes in on one person: the person inside the ring, the four ticks outside it */
R3.both('B10', 'aim', 'วงเล็งเป้าล็อกที่คนหนึ่งคน', (K, s, T, g, small) => {
  const {p} = LP.layer(g, small), X = 300, Y = 136, R = 112;
  p.circle(X, Y, R - 13, {sw: 1.6, tone: 'soft'});
  SK.person(p, {x: X, y: Y + 96, h: 192, tone: 'acc'});
  p.circle(X, Y, R, {sw: 4, tone: 'acc', fill: 'none'});
  [[0, -1], [0, 1], [-1, 0], [1, 0]].forEach(([dx, dy]) => p.line(X + dx * (R + 6), Y + dy * (R + 6), X + dx * (R + 26), Y + dy * (R + 26), {sw: 4, tone: 'acc', fill: 'none'}));
  const w = s.label ?? s.who?.label; if (w) LP.word(K, g, w, 300, 284, 34, 340);
});

/* ================= B13 เคล็ดลับ: secret {icon, label?} ================= */
/* 3 · a secret folder with a padlock on the front: the paper with the tip slides up out of it */
R3.both('B13', 'dossier', 'แฟ้มลับ กระดาษเคล็ดลับเลื่อนออกมา', (K, s, T, g, small) => {
  const it = s.secret ?? {icon: 'lightbulb'}, back = LP.layer(g, small).p;
  back.path('M 84 76 Q 84 62 98 62 L 206 62 Q 214 62 218 68 L 230 84 L 502 84 Q 516 84 516 98 L 516 318 Q 516 332 502 332 L 98 332 Q 84 332 84 318 Z', {fill: true});
  back.rect(136, 16, 328, 250, {rx: 8, fill: true}); back.line(164, 152, 436, 152, {sw: 1.6, tone: 'soft'}); back.line(164, 174, 380, 174, {sw: 1.6, tone: 'soft'});
  LP.ico(g, it.icon, 300, 58, 50); if (it.label) LP.word(K, g, it.label, 300, 88, 40, 290);
  const fr = LP.layer(g, small).p;
  fr.path('M 98 190 L 502 172 Q 516 172 516 186 L 516 318 Q 516 332 502 332 L 98 332 Q 84 332 84 318 L 84 204 Q 84 190 98 190 Z', {fill: true});
  /* the padlock: shackle, body, keyhole */
  fr.path('M 282 250 L 282 236 Q 282 216 300 216 Q 318 216 318 236 L 318 250', {sw: 5});
  fr.rect(266, 246, 68, 54, {rx: 10, fill: true}); fr.circle(300, 266, 6, {sw: 2}); fr.line(300, 272, 300, 284, {sw: 2.6});
});

/* 4 · a light bulb (the skill's) lights up over a person (the skill's bust): the tip beside it */
R3.both('B13', 'idea', 'หลอดไฟติดเหนือหัวคน ได้เคล็ดลับ', (K, s, T, g, small) => {
  const it = s.secret ?? {icon: 'lightbulb'}, {p} = LP.layer(g, small), X = 200;
  SK.bust(p, X, 276, 1.15);
  SK.bulb(p, X, 102, .95, {tone: 'acc'});
  if (it.icon) LP.ico(g, it.icon, 430, it.label ? 104 : 150, 56);
  if (it.label) LP.word(K, g, it.label, 430, 140, 38, 220);
});

/* ================= B20 ความสัมพันธ์: a {icon, label?}, b {icon, label?}, label?, cut? ================= */
/* 5 · two people (pictograms seen from the side) face each other; when it is over they stand back to back */
R3.both('B20', 'face', 'สองคนหันหน้าเข้าหากัน (จบกัน = หันหลังให้กัน)', (K, s, T, g, small) => {
  const a = s.a ?? {icon: 'user'}, b = s.b ?? {icon: 'user'}, cut = !!s.cut, G = 268, {p} = LP.layer(g, small);
  const one = (it, x, face) => { if (S11.human(it.icon)) SK.person(p, {x, y: G, h: 250, pose: 'side', face});
    else { p.rect(x - 72, G - 196, 144, 196, {rx: 14, fill: true}); LP.ico(g, it.icon, x, G - 98, 80); } };
  one(a, 222, cut ? -1 : 1); one(b, 378, cut ? 1 : -1);
  if (cut) SK.cross(p, 300, 140, .32);
  if (s.label) LP.word(K, g, s.label, 300, 282, 34, 320);
});

/* 6 (Friend 2026-11-11 deleted the handshake `shake`: "ลบอันนี้ออก และคิดไอเดียใหม่") — two new ideas to choose from: */
/* 6a · two people (the skill's pictograms) stand side by side, one arm round the other's shoulders. When it is over they stand
   apart, arms down, a cross between them. A brand (not a person): the person rests an arm on its card */
R3.both('B20', 'hug', 'สองคนยืนเคียงกัน โอบไหล่ (จบกัน = ยืนห่างกัน)', (K, s, T, g, small) => {
  const a = s.a ?? {icon: 'user'}, b = s.b ?? {icon: 'user'}, cut = !!s.cut, G = 266, H = 250, sc = H / 200, {p} = LP.layer(g, small);
  const sh = x => [x + 25 * sc, G - 99.5 * sc - 40 * sc];            // a person's right shoulder (front view)
  if (cut) { SK.person(p, {x: 206, y: G, h: H}); SK.person(p, {x: 394, y: G, h: H}); SK.cross(p, 300, 132, .3); }
  else if (!S11.human(b.icon)) {
    p.rect(330, G - 150, 150, 150, {rx: 16, fill: true}); LP.ico(g, b.icon, 405, G - 75, 70);
    SK.person(p, {x: 240, y: G, h: H, pose: [10, null]}); const [x, y] = sh(240); SK.capsule(p, x, y, 352, G - 150, 8 * sc);
  } else {
    SK.person(p, {x: 352, y: G, h: H});
    SK.person(p, {x: 248, y: G, h: H, pose: [10, null]}); const [x, y] = sh(248); SK.capsule(p, x, y, 352 + 14 * sc, y - 6, 8 * sc);
  }
  if (s.label) LP.word(K, g, s.label, 300, 282, 34, 320);
});

/* 6b · two people (the skill's pictograms) raise their hands and high-five above their heads; three short lines spark at the
   touch. When it is over the arms are down and they stand apart. People only */
R3.both('B20', 'hifive', 'สองคนแปะมือกันเหนือหัว (จบกัน = ยืนห่างกัน)', (K, s, T, g, small) => {
  const cut = !!s.cut, G = 266, H = 236, sc = H / 200, {p} = LP.layer(g, small);
  if (cut) { SK.person(p, {x: 206, y: G, h: H}); SK.person(p, {x: 394, y: G, h: H}); SK.cross(p, 300, 132, .3); }
  else {
    const top = G - 99.5 * sc - 40 * sc, hy = 34;
    SK.person(p, {x: 226, y: G, h: H, pose: [10, null]}); SK.capsule(p, 226 + 25 * sc, top, 292, hy, 8 * sc);
    SK.person(p, {x: 374, y: G, h: H, pose: [null, 10]}); SK.capsule(p, 374 - 25 * sc, top, 308, hy, 8 * sc);
    [[-150, 0], [-90, 0], [-30, 0]].forEach(([deg]) => { const r = deg * Math.PI / 180; p.line(300 + Math.cos(r) * 26, hy - 8 + Math.sin(r) * 26, 300 + Math.cos(r) * 42, hy - 8 + Math.sin(r) * 42, {sw: 3, tone: 'acc', fill: 'none'}); });
  }
  if (s.label) LP.word(K, g, s.label, 300, 282, 34, 320);
}, s => S11.human(s.a?.icon ?? 'user') && S11.human(s.b?.icon ?? 'user'));

/* ================= B21 สถานที่: place {icon, label?}, spots? [1-2 {icon, label?}] ================= */
/* 7 (Friend 2026-11-11 sent the road sign `roadsign`: "คิดไอเดียใหม่") — two new ideas to choose from: */
/* a map pin (the same shape as in 8): its round head on (x, y), radius r, the tip 1.54 r under it */
const PIN = (p, x, y, r, o = {}) => p.path(`M ${x} ${y + r * 1.54} C ${x - r * .2} ${y + r * 1.12} ${x - r} ${y + r * .7} ${x - r} ${y} A ${r} ${r} 0 1 1 ${x + r} ${y} C ${x + r} ${y + r * .7} ${x + r * .2} ${y + r * 1.12} ${x} ${y + r * 1.54} Z`, Object.assign({fill: true}, o));
/* 7a · a phone (the skill's) with a map app: two roads, the pin drops on the place, the place's card at the bottom */
R3.both('B21', 'navphone', 'มือถือเปิดแผนที่ หมุดตกลงที่สถานที่ ชื่อขึ้นการ์ดล่าง', (K, s, T, g, small) => {
  const pl = s.place ?? {icon: 'map-pin'}, {p} = LP.layer(g, small), q = p.child({transform: 'translate(300 168) scale(.9)'}, .9);
  q.rect(-98, -182, 196, 364, {rx: 32, fill: true}); q.rect(-86, -170, 172, 340, {rx: 22, sw: 1.6, tone: 'soft'});
  q.line(-18, -158, 18, -158, {sw: 5});
  q.path('M -86 -60 Q -10 -40 86 -96', {sw: 1.6, tone: 'soft'}); q.path('M -40 -170 Q -20 -40 30 92', {sw: 1.6, tone: 'soft'}); q.line(-86, 40, 86, 20, {sw: 1.6, tone: 'soft'});
  q.ellipse(-12, 4, 16, 5, {sw: 1.6, tone: 'soft'}); PIN(q, -12, -64, 40, {tone: 'acc'}); q.circle(-12, -64, 24, {fill: true, sw: 2.2});
  LP.ico(g, pl.icon, 300 - 12 * .9, 168 - 64 * .9, 26);
  q.rect(-74, 92, 148, 66, {rx: 14, fill: true});
  if (pl.label) LP.word(K, g, pl.label, 300, 168 + 104 * .9, 26, 120); else LP.ico(g, pl.icon, 300, 168 + 125 * .9, 30);
});

/* 7b · a person (the skill's pictogram) has arrived: a big pin with the place on it stands beside them, the name under it */
R3.both('B21', 'arrive', 'คนยืนข้างหมุดใหญ่ มาถึงสถานที่แล้ว', (K, s, T, g, small) => {
  const pl = s.place ?? {icon: 'map-pin'}, {p} = LP.layer(g, small), G = 262;
  p.line(110, G, 490, G, {sw: 2, tone: 'soft'});
  p.ellipse(382, G, 30, 8, {sw: 1.6, tone: 'soft'});
  PIN(p, 382, G - 102, 66, {tone: 'acc'}); p.circle(382, G - 102, 42, {fill: true, sw: 2.2}); LP.ico(g, pl.icon, 382, G - 102, 44);
  SK.person(p, {x: 206, y: G, h: 220, pose: 'wave'});
  if (pl.label) LP.word(K, g, pl.label, 300, 280, 34, 360);
});

/* 8 · a map pin stands on a building: here */
R3.both('B21', 'building', 'หมุดปักลงบนตึก', (K, s, T, g, small) => {
  const pl = s.place ?? {icon: 'map-pin'}, {p} = LP.layer(g, small);
  p.line(110, 282, 490, 282, {sw: 2, tone: 'soft'});
  p.rect(196, 136, 208, 146, {rx: 6, fill: true}); p.rect(188, 126, 224, 14, {rx: 5, fill: true});
  [0, 1, 2].forEach(r => [0, 1, 2].forEach(c => { if (r === 2 && c === 1) return; p.rect(218 + c * 62, 154 + r * 40, 40, 24, {rx: 4, sw: 1.8, tone: 'soft'}); }));
  p.rect(282, 234, 36, 48, {rx: 5, fill: true, sw: 2.2}); p.dot(310, 260, 2.6);
  p.path('M 300 124 C 290 104 252 84 252 50 A 48 48 0 1 1 348 50 C 348 84 310 104 300 124 Z', {fill: true, tone: 'acc'});
  p.circle(300, 48, 30, {fill: true, sw: 2.2});
  LP.ico(g, pl.icon, 300, 48, 34);
  if (pl.label) LP.word(K, g, pl.label, 300, 288, 34, 360);
});

/* ================= B12 เหตุกับผล: items [3 {icon, label?, tone?}] ================= */
/* 9 · three things in a row; an arrow (the skill's connect) from each to the next, and the last (the effect) lights up */
R3.both('B12', 'flow', 'สามไอคอน ลูกศรวาดต่อกันจากเหตุไปผล', (K, s, T, g, small) => {
  const it = (s.items ?? []).slice(0, 3), neg = it[2]?.tone === 'neg', {p} = LP.layer(g, small), xs = [104, 300, 496], Y = 128, R = 56;
  [0, 1].forEach(k => SK.connect(p, xs[k] + R + 10, Y - 12, xs[k + 1] - R - 10, Y - 12, {bend: -.32, sw: 2.6}));
  xs.forEach((x, k) => {
    const last = k === 2, on = last && !neg;
    p.circle(x, Y, R, {fill: true, tone: on ? 'acc' : undefined}); p.circle(x, Y, R - 10, {sw: 1.6, tone: on ? 'acc' : 'soft', fill: 'none'});
    if (last && neg) p.circle(x, Y, R, {tone: 'neg', sw: 3.4});
    if (it[k]) LP.ico(g, it[k].icon, x, Y, 46, on);
    if (it[k]?.label) { const w = LP.word(K, g, it[k].label, x, Y + R + 16, 26, 170); if (last && neg) w.style.color = 'var(--lp-neg)'; }
  });
});

/* 10 · a chain of three links; the last link (the effect) is lit. Each link passes in front of the next at the bottom */
R3.both('B12', 'chain', 'โซ่สามข้อ ข้อสุดท้ายติดสี', (K, s, T, g, small) => {
  const it = (s.items ?? []).slice(0, 3), neg = it[2]?.tone === 'neg', {p} = LP.layer(g, small), xs = [146, 300, 454], Y = 140, W = 186, H = 112, T0 = 26;
  const d = x => `M ${x - W / 2 + H / 2} ${Y - H / 2} L ${x + W / 2 - H / 2} ${Y - H / 2} A ${H / 2} ${H / 2} 0 0 1 ${x + W / 2 - H / 2} ${Y + H / 2} L ${x - W / 2 + H / 2} ${Y + H / 2} A ${H / 2} ${H / 2} 0 0 1 ${x - W / 2 + H / 2} ${Y - H / 2} Z`;
  /* each link is drawn whole; the next one goes over it at the top but is hidden along this link's outline at the bottom,
     so the links read as hooked together and nothing is drawn twice (no seam) */
  xs.forEach((x, k) => (k === 0 ? p : p.masked(d(xs[k - 1]), T0 + 6 * p.k, xs[k - 1], Y, W, H)).tube(d(x), T0, {tone: k === 2 && !neg ? 'acc' : undefined}));
  xs.forEach((x, k) => { if (it[k]) { const i = LP.ico(g, it[k].icon, x, Y, 36); if (k === 2) i.style.color = neg ? 'var(--lp-neg)' : 'var(--lp-acc-line)'; }
    if (it[k]?.label) { const w = LP.word(K, g, it[k].label, x, Y + H / 2 + 24, 26, 150); if (k === 2 && neg) w.style.color = 'var(--lp-neg)'; } });
});

/* ================= B05 ถูกกับผิด: wrong {icon, label?}, right {icon, label?} ================= */
/* 11 · a no-entry sign is stamped on the wrong one; the right one gets its tick */
R3.both('B05', 'nosign', 'ป้ายห้ามประทับบนข้อผิด ข้อถูกได้เครื่องหมายถูก', (K, s, T, g, small) => {
  const w = s.wrong ?? {icon: 'x'}, r = s.right ?? {icon: 'check'}, {p} = LP.layer(g, small);
  p.rect(70, 40, 190, 190, {rx: 22, fill: true}); p.rect(84, 54, 162, 162, {rx: 14, sw: 1.6, tone: 'soft'});
  p.rect(340, 40, 190, 190, {rx: 22, fill: true, tone: 'acc'}); p.rect(354, 54, 162, 162, {rx: 14, sw: 1.6, tone: 'acc', fill: 'none', op: .6});
  LP.ico(g, w.icon, 165, 135, 84); LP.ico(g, r.icon, 435, 135, 84, true);
  const ns = LP.layer(g, small).p; ns.circle(165, 135, 80, {sw: 7, tone: 'neg'}); ns.line(108, 78, 222, 192, {sw: 7, tone: 'neg'});
  ns.circle(522, 48, 30, {fill: true, sw: 3}); SK.check(ns, 522, 50, .26, {sw: 5});
  if (w.label) { const e = LP.word(K, g, w.label, 165, 252, 32, 220); e.style.opacity = .7; }
  if (r.label) LP.word(K, g, r.label, 435, 252, 32, 220);
});

/* 12 · a hand (the skill's) points at the right one; the wrong one fades */
R3.both('B05', 'point', 'มือชี้ไปที่ข้อถูก ข้อผิดจางลง', (K, s, T, g, small) => {
  const w = s.wrong ?? {icon: 'x'}, r = s.right ?? {icon: 'check'}, {p} = LP.layer(g, small);
  const wq = p.child(); wq.g.style.opacity = .38;
  wq.rect(56, 30, 176, 150, {rx: 20, fill: true}); LP.ico(g, w.icon, 144, 92, 66).style.opacity = .38;
  if (w.label) LP.word(K, g, w.label, 144, 128, 28, 150).style.opacity = .38;
  p.rect(300, 30, 176, 150, {rx: 20, fill: true, tone: 'acc'}); LP.ico(g, r.icon, 388, 92, 66, true);
  if (r.label) LP.word(K, g, r.label, 388, 128, 28, 150, true);
  SK.hand(LP.layer(g, small).p, 388, 262, 1.12);
});

/* ================= B11 คำพูด: quote, kind, mood, react? ================= */
/* 13 · a person (the skill's bust) speaks; what was said is in a speech bubble whose tail points at the head */
R3.both('B11', 'speak', 'คนพูด ฟองคำพูดเด้งออกมา', (K, s, T, g, small) => {
  const q = s.quote ?? '', bad = s.mood === 'bad', {p} = LP.layer(g, small);
  SK.bust(p, 140, 254, 1.38);
  SK.bubble(p, 404, 112, 280, 150, {tail: 'left', sw: 3});
  if (q) LP.word(K, g, q, 404, 82, 44, 230);
  if (s.react) { p.circle(532, 180, 26, {fill: true, tone: bad ? 'neg' : 'acc', sw: 2.4}); LP.ico(g, s.react, 532, 180, 28, !bad); }
});

/* 14 · a chat: a bubble from one side (dots of text), then the answer (the words said) from the other side */
R3.both('B11', 'chat', 'ฟองแชตสองฝั่งโต้ตอบกัน', (K, s, T, g, small) => {
  const q = s.quote ?? '', bad = s.mood === 'bad', {p} = LP.layer(g, small);
  SK.bust(p, 62, 118, .56); SK.bust(p, 538, 286, .56, {tone: 'acc'});
  SK.bubble(p, 232, 78, 236, 104, {tail: 'left'});
  [62, 84].forEach((y, k) => p.line(140, y, k ? 280 : 316, y, {sw: 2.2, tone: 'soft'})); p.line(140, 106, 220, 106, {sw: 2.2, tone: 'soft'});
  SK.bubble(p, 352, 246, 264, 112, {tail: 'right', tone: 'acc'});
  if (q) LP.word(K, g, q, 352, 220, 42, 230, true);
  if (s.react) { p.circle(222, 294, 24, {fill: true, tone: bad ? 'neg' : undefined, sw: 2.4}); LP.ico(g, s.react, 222, 294, 26); }
});

/* ================= B01 ตัวเลขเด่น: value, unit?, icon?, dir?, money? ================= */
/* 15 · a price tag hangs on its string (threaded through the hole), swings and comes to rest: the amount (money only) */
R3.both('B01', 'pricetag', 'ป้ายราคาแขวน แกว่งแล้วหยุด', (K, s, T, g, small) => {
  const {p} = LP.layer(g, small);
  p.path('M 300 76 C 316 60 318 30 312 -10', {sw: 2.2});                         // the string going back up behind the tag
  const tg = p.child({transform: 'rotate(-6 300 76)'});
  tg.path('M 280 42 Q 300 30 320 42 L 434 106 Q 448 114 448 130 L 448 318 Q 448 334 432 334 L 168 334 Q 152 334 152 318 L 152 130 Q 152 114 166 106 Z', {fill: true});
  tg.path('M 282 56 Q 300 46 318 56 L 426 116 Q 436 122 436 134 L 436 310 Q 436 322 424 322 L 176 322 Q 164 322 164 310 L 164 134 Q 164 122 174 116 Z', {sw: 1.6, tone: 'soft'});
  tg.circle(300, 76, 12, {sw: 2.6});
  p.path('M 290 -10 C 284 24 296 50 300 76', {sw: 2.2});                         // the string coming down into the hole
  const hold = R6.group(g); hold.style.transformOrigin = '300px 76px'; hold.style.transform = 'rotate(-6deg)';
  const n = div('left:152px;top:128px;width:296px;text-align:center', hold, `<span class="u-num lp-t" style="font-size:92px">${s.value}</span>`);
  FITS.push(() => { const sp = n.firstChild; if (sp.offsetWidth > 260) sp.style.fontSize = (92 * 260 / sp.offsetWidth).toFixed(1) + 'px'; });
  if (s.unit) LP.word(K, hold, s.unit, 300, 236, 34, 240);
}, R2.money);

/* 16 · a wallet (the skill's: a rounded body + an inner line) is open and the banknotes stand up out of it: the amount on the top note */
R3.both('B01', 'wallet', 'กระเป๋าสตางค์เปิด ธนบัตรเลื่อนออก มีจำนวนเงิน', (K, s, T, g, small) => {
  const bk = LP.layer(g, small).p;
  const note = (rot, dy, top) => { const q = bk.child({transform: `rotate(${rot} 300 230)`});
    q.rect(128, 14 + dy, 344, 168, {rx: 8, fill: true}); q.rect(140, 26 + dy, 320, 144, {rx: 5, sw: 1.6, tone: 'soft'});
    if (!top) q.circle(158, 46 + dy, 8, {sw: 1.6, tone: 'soft'}); };
  note(-8, 16, false); note(-4, 8, false); note(0, 0, true);
  const n = div('left:128px;top:26px;width:344px;text-align:center', g, `<span class="u-num lp-t" style="font-size:74px">${s.value}</span>`);
  FITS.push(() => { const sp = n.firstChild; if (sp.offsetWidth > 290) sp.style.fontSize = (74 * 290 / sp.offsetWidth).toFixed(1) + 'px'; });
  if (s.unit) LP.word(K, g, s.unit, 300, 106, 28, 260);
  const {p} = LP.layer(g, small);
  p.rect(92, 160, 416, 174, {rx: 22, fill: true}); p.rect(104, 172, 392, 150, {rx: 14, sw: 1.6, tone: 'soft'});
  p.path('M 412 210 L 508 210 Q 534 210 534 248 Q 534 286 508 286 L 412 286 Z', {fill: true});
  p.circle(494, 248, 15, {fill: true, sw: 2.6});
}, R2.money);

/* ================= B02 เพิ่ม / ลด: dir, item, center?, n?, keep?, end? ================= */
/* 17 · a group of people (the skill's team): all three when it goes up (the front one lit), the two behind faded when it
   goes down. People only */
R3.both('B02', 'team', 'กลุ่มคน คนมาเพิ่มหรือหายไป', (K, s, T, g, small) => {
  const up = s.dir !== 'down', {p} = LP.layer(g, small);
  SK.team(p, 300, 196, 2.25, {tone: up ? 'acc' : undefined, back: up ? null : .16});
}, s => S11.human(s.item?.icon));

/* 18 · cardboard boxes (iso, as the skill allows for stacks) stack up (up), or are taken off until one is left (down) */
R3.both('B02', 'boxes', 'กล่องซ้อนสูงขึ้น หรือถูกหยิบออกทีละกล่อง', (K, s, T, g, small) => {
  const up = s.dir !== 'down', it = s.item ?? {icon: 'package'}, {p} = LP.layer(g, small), H = 80, Wd = 112;
  [0, 1, 2].forEach(k => {
    const on = up || k === 0, top = up && k === 2, before = p.g.childNodes.length, y = 290 - k * H;
    const P = (X, Y, Z) => { const [a, b] = iso(X, Y, Z); return [300 + a, y + b]; }, hw = Wd / 2;
    p.shape([P(-hw, 0, hw), P(hw, 0, hw), P(hw, H, hw), P(-hw, H, hw)], {fill: true});
    p.shape([P(hw, 0, hw), P(hw, 0, -hw), P(hw, H, -hw), P(hw, H, hw)], {fill: true});
    p.shape([P(-hw, H, -hw), P(hw, H, -hw), P(hw, H, hw), P(-hw, H, hw)], {fill: true, tone: top ? 'acc' : undefined});
    p.poly([P(0, H, -hw), P(0, H, hw), P(0, H * .62, hw)], {sw: 2.2, fill: 'none', tone: top ? 'acc' : 'soft'});
    if (!on) [...p.g.childNodes].slice(before).forEach(e => { e.style.opacity = .16; e.style.strokeDasharray = '6 7'; });
    else { const c = P(-hw * .5, H * .4, hw); LP.ico(g, it.icon, c[0], c[1], 28); }
  });
});

/* ================= B14 ประโยคเด็ด: idea {icon?, label} ================= */
/* 19 · an open book; a highlighter has just marked one line, and the line it marks is the punchline */
R3.both('B14', 'highlight', 'ปากกาไฮไลต์ขีดประโยคในหนังสือ', (K, s, T, g, small) => {
  const it = s.idea ?? {icon: 'quote'}, {p} = LP.layer(g, small);
  p.path('M 300 44 Q 168 20 40 40 L 40 334 Q 168 314 300 340 Q 432 314 560 334 L 560 40 Q 432 20 300 44 Z', {fill: true});
  p.path('M 300 34 Q 168 10 34 30 L 34 322 Q 168 302 300 328 Z', {fill: true}); p.path('M 300 34 Q 432 10 566 30 L 566 322 Q 432 302 300 328 Z', {fill: true});
  [92, 124, 156, 240, 272].forEach((y, k) => p.line(72, y, k === 4 ? 190 : 262, y, {sw: 1.6, tone: 'soft'}));
  [92, 124, 240, 272].forEach((y, k) => p.line(338, y, k === 3 ? 450 : 528, y, {sw: 1.6, tone: 'soft'}));
  p.rect(322, 152, 210, 64, {rx: 6, fill: 'var(--lp-acc)', stroke: 'none', op: .9});
  LP.row(K, g, it.label ? {label: it.label} : it, 427, 163, 34, 196, true);
  const pen = p.child({transform: 'rotate(38 540 214)'});
  pen.rect(522, 112, 36, 84, {rx: 8, fill: true}); pen.rect(522, 84, 36, 32, {rx: 8, fill: true, tone: 'acc'});
  pen.path('M 526 196 L 554 196 L 548 216 L 532 216 Z', {fill: true}); pen.path('M 534 216 L 546 216 L 543 224 L 537 224 Z', {fill: true, tone: 'acc', sw: 2});
});

/* 20 · a speaker (the skill's point pictogram) points at the screen, and the punchline is up on it */
R3.both('B14', 'slides', 'คนยืนชี้จอสไลด์ ประโยคขึ้นจอ', (K, s, T, g, small) => {
  const it = s.idea ?? {icon: 'quote'}, {p} = LP.layer(g, small), G = 336;
  p.line(410, 204, 410, 300, {sw: 3}); p.line(410, 294, 362, G, {sw: 3}); p.line(410, 294, 458, G, {sw: 3});
  p.rect(256, 10, 308, 196, {rx: 14, fill: true}); p.rect(270, 24, 280, 168, {rx: 8, sw: 1.6, tone: 'soft'});
  if (it.label) LP.word(K, g, it.label, 410, 84, 42, 250); else LP.ico(g, it.icon, 410, 108, 80);
  SK.person(p, {x: 128, y: G, h: 290, pose: 'point'});
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
