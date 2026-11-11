/* =====================================================================
   CutPack · uni · LEGO round 11 (Friend 2026-11-11: "ทั้ง 2 แบบครับ แล้วก็อันอื่นผ่านแล้วเริ่มทำขั้นตอนต่อไปได้" on the stills of
   engine/uni/sketches/r11.js, all four styles). 22 variants for ten categories:
     B10 คน          คนยกมือ (raise) · วงเล็งล็อกที่คน (aim)
     B13 เคล็ดลับ      แฟ้มลับ กระดาษเลื่อนออก (dossier) · หลอดไฟเหนือหัว (idea)
     B20 ความสัมพันธ์   สองคนหันหน้าเข้าหากัน (face) · โอบไหล่ (hug) · แปะมือ (hifive, คนเท่านั้น)
     B21 สถานที่       มือถือแผนที่ (navphone) · คนข้างหมุดใหญ่ (arrive) · หมุดบนตึก (building)
     B12 เหตุกับผล     สามวงต่อด้วยลูกศร (flow) · โซ่สามข้อ (chain)
     B05 ถูกกับผิด      ป้ายห้ามบนข้อผิด (nosign) · มือชี้ข้อถูก (point)
     B11 คำพูด        คนพูด ฟองคำพูด (speak) · ฟองแชตสองฝั่ง (chat)
     B01 ตัวเลขเด่น     ป้ายราคาแขวน (pricetag) · กระเป๋าสตางค์ ธนบัตร (wallet) (เงินเท่านั้น)
     B02 เพิ่ม/ลด      กลุ่มคน (team, คนเท่านั้น) · กล่องซ้อน (boxes)
     B14 ประโยคเด็ด     ปากกาไฮไลต์ในหนังสือ (highlight) · คนชี้จอสไลด์ (slides)
   Removed, never bring back: B20 shake (handshake, "ลบอันนี้ออก") · B21 roadsign (road sign, "คิดไอเดียใหม่") · and the round's
   earlier ideas listed in DECISIONS (toaster, usb, gate, typewriter, landline …).
   DRAWN the way Friend's glow-line-motion skill in the repo draws (Friend: "ข ครับ Skill ใน repo เป็นเวอร์ชั่นปัจจุบัน"): flat front
   view, an outline + a flat body fill, round corners, 1–3 thin soft details, no line past 7; people are the skill's pictograms;
   the hand, bulb, bubble and arrow are the skill's parts (SK). Colours and glow are each style's own (--lp-*).
   MOVES the lego way, like rounds 1–10 (Friend 2026-11-11: "ไม่ต้องทำแบบ skill ก็ได้ ทำแบบเลโก้เหมือนเดิมนั่นแหละ"): every drawing
   is cut into pieces (LP.piece: the kit's o/f/m/p layers with an SVG layer in p) that come in with the style's own verbs
   (K.enter rise/pop/drop/chip/key, K.move snap, K.punch, K.float); the one move that carries the meaning happens on the key
   word (T.hit) and holds; the accent lights on the key word (LP.light: the --lp-on switch, then a punch).
   Loaded after lego_r9c.js and before lego_v2.js; sentences (r11.*) after every variant. Same frame rules as R3.both.
   ===================================================================== */
(() => {
  if (typeof document === 'undefined' || document.getElementById('lp-css')) return;   // (no page in test_picker.js)
  try { CSS.registerProperty({name: '--lp-on', syntax: '<number>', inherits: true, initialValue: '1'}); } catch (e) {}
  const st = document.createElement('style'); st.id = 'lp-css';
  st.textContent = `
.c-light{--lp-ink:#14213D;--lp-fill:#FFFFFF;--lp-soft:rgba(20,33,61,.5);--lp-acc:#DDFF45;--lp-acc-line:#14213D;--lp-acc-ink:#14213D;--lp-neg:#E5484D}
.c-dark{--lp-ink:#FFFFFF;--lp-fill:#141924;--lp-soft:rgba(255,255,255,.5);--lp-acc:#DDFF45;--lp-acc-line:#DDFF45;--lp-acc-ink:#0A0A0A;--lp-neg:#FF5A5F}
.g-root{--lp-ink:rgba(235,246,255,.95);--lp-fill:rgba(10,18,34,.82);--lp-soft:rgba(235,246,255,.5);--lp-acc:rgba(143,211,255,.3);--lp-acc-line:#8FD3FF;--lp-acc-ink:#FFFFFF;--lp-neg:#FF7A8A}
.p-light{--lp-ink:#4B3D6E;--lp-fill:#FFFFFF;--lp-soft:rgba(75,61,110,.5);--lp-acc:#9C84D6;--lp-acc-line:#4B3D6E;--lp-acc-ink:#FFFFFF;--lp-neg:#C2667A}
.p-dark{--lp-ink:#F1ECFB;--lp-fill:#6F5F97;--lp-soft:rgba(241,236,251,.55);--lp-acc:#D9CCF6;--lp-acc-line:#F1ECFB;--lp-acc-ink:#4B3D6E;--lp-neg:#F09AA8}
.gd{--lp-ink:#F2F2F4;--lp-fill:#141417;--lp-soft:rgba(242,242,244,.48);--lp-acc:#FF9A2E;--lp-acc-line:#FFB04A;--lp-acc-ink:#1A0E00;--lp-neg:#FF5A4E}
.gd .lp-acc{filter:drop-shadow(0 0 7px rgba(255,140,40,calc(.8 * var(--lp-on, 1))))}
.c-light,.p-light,.g-root{--lp-acc-edge:var(--lp-acc-line)}
.c-dark,.p-dark,.gd{--lp-acc-edge:var(--lp-acc-ink)}
.lp-t{white-space:nowrap;line-height:1.25;color:var(--lp-ink)}
.lp-t.lp-on{color:color-mix(in srgb, var(--lp-acc-ink) calc(var(--lp-on, 1) * 100%), var(--lp-ink))}
.lp-ico{color:var(--lp-ink)}.lp-ico.lp-on{color:color-mix(in srgb, var(--lp-acc-ink) calc(var(--lp-on, 1) * 100%), var(--lp-ink))}`;
  document.head.appendChild(st);
})();

const LP = (() => {
  const NS = 'http://www.w3.org/2000/svg'; let LPN = 0;
  /* the accent colours mix with the plain ones by --lp-on (1 = lit; a piece holds it at 0 until the key word, LP.light) */
  const on = (a, b) => `color-mix(in srgb, ${a} calc(var(--lp-on, 1) * 100%), ${b})`;
  const C = {edge: on('var(--lp-acc-edge)', 'var(--lp-ink)'), ink: 'var(--lp-ink)', fill: 'var(--lp-fill)', soft: 'var(--lp-soft)', mute: 'var(--lp-soft)',
    acc: on('var(--lp-acc)', 'var(--lp-fill)'), accLine: on('var(--lp-acc-line)', 'var(--lp-ink)'), neg: 'var(--lp-neg)'};
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
  const word = (K, g, txt, cx, y, size, maxW, on = false, t = null) => { const w = R4.word(K, g, txt, cx, y, size, t, maxW); w.classList.add('lp-t'); if (on) w.classList.add('lp-on'); return w; };
  const wordL = (K, g, txt, x, y, size, maxW, on = false, t = null) => { const w = R6.wordL(K, g, txt, x, y, size, t, maxW); w.classList.add('lp-t'); if (on) w.classList.add('lp-on'); return w; };
  const ico = (g, icon, cx, cy, size, on = false) => { const e = R9.ico(g, icon, cx, cy, size, 'lp-ico'); if (on) e.classList.add('lp-on'); return e; };
  /* an icon + a word on one line, centred on cx */
  const row = (K, g, it, cx, y, size = 28, maxW = 220, on = false) => {
    if (!it) return;
    if (!it.label) { if (it.icon) ico(g, it.icon, cx, y + size * .65, size * 1.2, on); return; }
    const ic = it.icon ? size + 10 : 0, l = wordL(K, g, it.label, 0, y, size, maxW - ic, on), i = it.icon ? ico(g, it.icon, 0, y + size * .65, size, on) : null;
    FITS.push(() => { const tw = ic + l.firstChild.offsetWidth, x0 = cx - tw / 2; if (i) i.style.left = x0 + 'px'; l.style.left = x0 + ic + 'px'; });
  };

  /* a piece of a drawing that moves on its own: the kit's four layers (o enter · f float · m moves · p punch) the size of the
     canvas, turning and scaling round (ox, oy), with a drawing layer in p (n.pen). Words and icons of the piece go in n.p */
  const piece = (g, small, ox = 300, oy = 170) => {
    const n = node(g, 0, 0, 600, 340); [n.o, n.f, n.m, n.p].forEach(e => { e.style.transformOrigin = `${ox}px ${oy}px`; });
    n.pen = layer(n.p, small).p; return n;
  };
  /* the accent of a piece lights on t: --lp-on goes 0 → 1 at once (no cross-fade, LESSONS 32), and the piece punches */
  const light = (K, n, t, punch = true) => { A(n.o, [{'--lp-on': 0}, {'--lp-on': 1}], t, .001); if (punch) K.punch(n.p, t); };
  /* a piece comes in by a move of its own: from `from` to place, and it shows from t */
  const slide = (K, n, t, from, kind = 'snap') => { A(n.o, [{opacity: 0}, {opacity: 1}], t, .12); K.move(n.m, t, from, 'none', {hold: true, kind}); };
  return {C, Pen, layer, word, wordL, ico, row, piece, light, slide};
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
/* the one this is for raises a hand: the person rises in, lights on the key word */
R3.both('B10', 'raise', 'คนที่ใช่ยกมือ', (K, s, T, g, small) => {
  const P = LP.piece(g, small, 300, 266);
  SK.person(P.pen, {x: 300, y: 266, h: 250, pose: 'wave', tone: 'acc'});
  K.enter(P.o, T.b[0], 'rise'); LP.light(K, P, T.hit); K.float(P, T.hit + .5);
  const w = s.label ?? s.who?.label; if (w) LP.word(K, g, w, 300, 280, 36, 340, false, T.b[1]);
});

/* a target sight closes in on one person and locks (lights) on the key word */
R3.both('B10', 'aim', 'วงเล็งเป้าล็อกที่คนหนึ่งคน', (K, s, T, g, small) => {
  const X = 300, Y = 136, R = 112, P = LP.piece(g, small, X, Y + 96), Q = LP.piece(g, small, X, Y);
  Q.pen.circle(X, Y, R - 13, {sw: 1.6, tone: 'soft'});
  SK.person(P.pen, {x: X, y: Y + 96, h: 192, tone: 'acc'});
  const q = LP.piece(g, small, X, Y);
  q.pen.circle(X, Y, R, {sw: 4, tone: 'acc', fill: 'none'});
  [[0, -1], [0, 1], [-1, 0], [1, 0]].forEach(([dx, dy]) => q.pen.line(X + dx * (R + 6), Y + dy * (R + 6), X + dx * (R + 26), Y + dy * (R + 26), {sw: 4, tone: 'acc', fill: 'none'}));
  K.enter(P.o, T.b[0], 'rise'); K.enter(Q.o, T.b[1], 'glow');
  LP.slide(K, q, T.b[2], 'scale(1.7)');                                   // the sight closes in round the person
  LP.light(K, q, T.hit); LP.light(K, P, T.hit, false);
  const w = s.label ?? s.who?.label; if (w) LP.word(K, g, w, 300, 284, 34, 340, false, T.b[1] + .1);
});

/* ================= B13 เคล็ดลับ: secret {icon, label?} ================= */
/* a secret folder with a padlock: on the key word the paper with the tip slides up out of it */
R3.both('B13', 'dossier', 'แฟ้มลับ กระดาษเคล็ดลับเลื่อนออกมา', (K, s, T, g, small) => {
  const it = s.secret ?? {icon: 'lightbulb'}, B = LP.piece(g, small, 300, 200), P = LP.piece(g, small, 300, 140), F = LP.piece(g, small, 300, 250);
  B.pen.path('M 84 76 Q 84 62 98 62 L 206 62 Q 214 62 218 68 L 230 84 L 502 84 Q 516 84 516 98 L 516 318 Q 516 332 502 332 L 98 332 Q 84 332 84 318 Z', {fill: true});
  P.pen.rect(136, 16, 328, 250, {rx: 8, fill: true}); P.pen.line(164, 152, 436, 152, {sw: 1.6, tone: 'soft'}); P.pen.line(164, 174, 380, 174, {sw: 1.6, tone: 'soft'});
  LP.ico(P.p, it.icon, 300, 58, 50); if (it.label) LP.word(K, P.p, it.label, 300, 88, 40, 290);
  F.pen.path('M 98 190 L 502 172 Q 516 172 516 186 L 516 318 Q 516 332 502 332 L 98 332 Q 84 332 84 318 L 84 204 Q 84 190 98 190 Z', {fill: true});
  F.pen.path('M 282 250 L 282 236 Q 282 216 300 216 Q 318 216 318 236 L 318 250', {sw: 5});
  F.pen.rect(266, 246, 68, 54, {rx: 10, fill: true}); F.pen.circle(300, 266, 6, {sw: 2}); F.pen.line(300, 272, 300, 284, {sw: 2.6});
  K.enter(B.o, T.b[0], 'rise'); K.enter(F.o, T.b[0] + .1, 'rise');
  LP.slide(K, P, T.hit - .15, 'translateY(150px)');                       // the paper comes up out of the folder
  K.float(P, T.hit + .5, T.t1, .5);
});

/* a light bulb (the skill's) pops up over a person (the skill's bust) and lights on the key word; the tip beside it */
R3.both('B13', 'idea', 'หลอดไฟติดเหนือหัวคน ได้เคล็ดลับ', (K, s, T, g, small) => {
  const it = s.secret ?? {icon: 'lightbulb'}, X = 200, H = LP.piece(g, small, X, 300), L = LP.piece(g, small, X, 100), W = LP.piece(g, small, 430, 140);
  SK.bust(H.pen, X, 276, 1.15);
  SK.bulb(L.pen, X, 102, .95, {tone: 'acc'});
  if (it.icon) LP.ico(W.p, it.icon, 430, it.label ? 104 : 150, 56);
  if (it.label) LP.word(K, W.p, it.label, 430, 140, 38, 220);
  K.enter(H.o, T.b[0], 'rise'); K.enter(L.o, T.b[1], 'pop'); LP.light(K, L, T.hit); K.float(L, T.hit + .5);
  K.enter(W.o, T.hit + .15, 'chip');
});

/* ================= B20 ความสัมพันธ์: a {icon, label?}, b {icon, label?}, label?, cut? ================= */
/* two people (side view) come in from both sides and face each other; when it is over they turn their backs */
R3.both('B20', 'face', 'สองคนหันหน้าเข้าหากัน (จบกัน = หันหลังให้กัน)', (K, s, T, g, small) => {
  const a = s.a ?? {icon: 'user'}, b = s.b ?? {icon: 'user'}, cut = !!s.cut, G = 268;
  const one = (it, x, face) => { const n = LP.piece(g, small, x, G);
    if (S11.human(it.icon)) SK.person(n.pen, {x, y: G, h: 250, pose: 'side', face});
    else { n.pen.rect(x - 72, G - 196, 144, 196, {rx: 14, fill: true}); LP.ico(n.p, it.icon, x, G - 98, 80); }
    return n; };
  const A1 = one(a, 222, cut ? -1 : 1), B1 = one(b, 378, cut ? 1 : -1);
  LP.slide(K, A1, T.b[0], 'translateX(-90px)'); LP.slide(K, B1, T.b[1], 'translateX(90px)');
  if (cut) { const X = LP.piece(g, small, 300, 140); SK.cross(X.pen, 300, 140, .32); K.enter(X.o, T.hit, 'pop'); }
  else { K.punch(A1.p, T.hit); K.punch(B1.p, T.hit + .08); }
  if (s.label) LP.word(K, g, s.label, 300, 282, 34, 320, false, T.hit + .1);
});

/* two people stand side by side; on the key word one puts an arm round the other's shoulders (a brand: the arm goes on its
   card). When it is over they step apart and a cross comes between them */
R3.both('B20', 'hug', 'สองคนยืนเคียงกัน โอบไหล่ (จบกัน = ยืนห่างกัน)', (K, s, T, g, small) => {
  const b = s.b ?? {icon: 'user'}, cut = !!s.cut, G = 266, H = 250, sc = H / 200;
  const sh = x => [x + 25 * sc, G - 99.5 * sc - 40 * sc];
  if (cut) {
    const P1 = LP.piece(g, small, 206, G), P2 = LP.piece(g, small, 394, G), X = LP.piece(g, small, 300, 132);
    SK.person(P1.pen, {x: 206, y: G, h: H}); SK.person(P2.pen, {x: 394, y: G, h: H}); SK.cross(X.pen, 300, 132, .3);
    K.enter(P1.o, T.b[0], 'rise'); K.enter(P2.o, T.b[0] + .12, 'rise');
    K.move(P1.m, T.hit - .1, 'translateX(44px)', 'none', {hold: true, kind: 'snap'}); K.move(P2.m, T.hit - .1, 'translateX(-44px)', 'none', {hold: true, kind: 'snap'});   // they stood together, they step apart
    K.enter(X.o, T.hit + .1, 'pop');
  } else {
    const brand = !S11.human(b.icon), xa = brand ? 240 : 248, [x, y] = sh(xa);
    const P2 = LP.piece(g, small, brand ? 405 : 352, G), P1 = LP.piece(g, small, xa, G), Arm = LP.piece(g, small, x, y);
    if (brand) { P2.pen.rect(330, G - 150, 150, 150, {rx: 16, fill: true}); LP.ico(P2.p, b.icon, 405, G - 75, 70); }
    else SK.person(P2.pen, {x: 352, y: G, h: H});
    SK.person(P1.pen, {x: xa, y: G, h: H, pose: [10, null]});
    if (brand) SK.capsule(Arm.pen, x, y, 352, G - 150, 8 * sc); else SK.capsule(Arm.pen, x, y, 352 + 14 * sc, y - 6, 8 * sc);
    K.enter(P1.o, T.b[0], 'rise'); K.enter(P2.o, T.b[1], brand ? 'pop' : 'rise');
    A(Arm.o, [{opacity: 0}, {opacity: 1}], T.hit - .2, .08); K.move(Arm.m, T.hit - .2, 'rotate(70deg)', 'none', {hold: true, kind: 'snap'});   // the arm swings up over the shoulders
    K.punch(P2.p, T.hit + .2);
  }
  if (s.label) LP.word(K, g, s.label, 300, 282, 34, 320, false, T.b[2]);
});

/* two people raise their hands and high-five on the key word; short lines spark at the touch. People only */
R3.both('B20', 'hifive', 'สองคนแปะมือกันเหนือหัว (จบกัน = ยืนห่างกัน)', (K, s, T, g, small) => {
  const cut = !!s.cut, G = 266, H = 236, sc = H / 200;
  if (cut) {
    const P1 = LP.piece(g, small, 206, G), P2 = LP.piece(g, small, 394, G), X = LP.piece(g, small, 300, 132);
    SK.person(P1.pen, {x: 206, y: G, h: H}); SK.person(P2.pen, {x: 394, y: G, h: H}); SK.cross(X.pen, 300, 132, .3);
    K.enter(P1.o, T.b[0], 'rise'); K.enter(P2.o, T.b[0] + .12, 'rise');
    K.move(P1.m, T.hit - .1, 'translateX(44px)', 'none', {hold: true, kind: 'snap'}); K.move(P2.m, T.hit - .1, 'translateX(-44px)', 'none', {hold: true, kind: 'snap'});   // they stood together, they step apart
    K.enter(X.o, T.hit + .1, 'pop');
  } else {
    const top = G - 99.5 * sc - 40 * sc, hy = 34, xa = 226 + 25 * sc, xb = 374 - 25 * sc;
    const P1 = LP.piece(g, small, 226, G), P2 = LP.piece(g, small, 374, G), A1 = LP.piece(g, small, xa, top), A2 = LP.piece(g, small, xb, top), Z = LP.piece(g, small, 300, 26);
    SK.person(P1.pen, {x: 226, y: G, h: H, pose: [10, null]}); SK.person(P2.pen, {x: 374, y: G, h: H, pose: [null, 10]});
    SK.capsule(A1.pen, xa, top, 292, hy, 8 * sc); SK.capsule(A2.pen, xb, top, 308, hy, 8 * sc);
    [-150, -90, -30].forEach(deg => { const r = deg * Math.PI / 180; Z.pen.line(300 + Math.cos(r) * 26, hy - 8 + Math.sin(r) * 26, 300 + Math.cos(r) * 42, hy - 8 + Math.sin(r) * 42, {sw: 3, tone: 'acc', fill: 'none'}); });
    K.enter(P1.o, T.b[0], 'rise'); K.enter(P2.o, T.b[0] + .12, 'rise'); K.enter(A1.o, T.b[0], 'rise'); K.enter(A2.o, T.b[0] + .12, 'rise');
    K.move(A1.m, T.hit - .35, 'rotate(140deg)', 'none', {hold: true, kind: 'snap'}); K.move(A2.m, T.hit - .35, 'rotate(-140deg)', 'none', {hold: true, kind: 'snap'});   // the arms come up and meet on the key word
    K.punch(A1.p, T.hit); K.punch(A2.p, T.hit); K.enter(Z.o, T.hit + .05, 'pop');
  }
  if (s.label) LP.word(K, g, s.label, 300, 282, 34, 320, false, T.b[2]);
}, s => S11.human(s.a?.icon ?? 'user') && S11.human(s.b?.icon ?? 'user'));

/* ================= B21 สถานที่: place {icon, label?}, spots? [1-2 {icon, label?}] ================= */
/* a map pin (the same shape everywhere): its round head on (x, y), radius r, the tip 1.54 r under it */
const PIN = (p, x, y, r, o = {}) => p.path(`M ${x} ${y + r * 1.54} C ${x - r * .2} ${y + r * 1.12} ${x - r} ${y + r * .7} ${x - r} ${y} A ${r} ${r} 0 1 1 ${x + r} ${y} C ${x + r} ${y + r * .7} ${x + r * .2} ${y + r * 1.12} ${x} ${y + r * 1.54} Z`, Object.assign({fill: true}, o));

/* a phone (the skill's) with a map app: on the key word the pin drops on the place and lights; the place's card comes up */
R3.both('B21', 'navphone', 'มือถือเปิดแผนที่ หมุดตกลงที่สถานที่ ชื่อขึ้นการ์ดล่าง', (K, s, T, g, small) => {
  const pl = s.place ?? {icon: 'map-pin'}, X = 300, Y = 168, k = .9, at = (x, y) => [X + x * k, Y + y * k];
  const Ph = LP.piece(g, small, X, Y), Pn = LP.piece(g, small, ...at(-12, 4)), Cd = LP.piece(g, small, ...at(0, 125));
  const q = Ph.pen.child({transform: `translate(${X} ${Y}) scale(${k})`}, k);
  q.rect(-98, -182, 196, 364, {rx: 32, fill: true}); q.rect(-86, -170, 172, 340, {rx: 22, sw: 1.6, tone: 'soft'});
  q.line(-18, -158, 18, -158, {sw: 5});
  q.path('M -86 -60 Q -10 -40 86 -96', {sw: 1.6, tone: 'soft'}); q.path('M -40 -170 Q -20 -40 30 92', {sw: 1.6, tone: 'soft'}); q.line(-86, 40, 86, 20, {sw: 1.6, tone: 'soft'});
  q.ellipse(-12, 4, 16, 5, {sw: 1.6, tone: 'soft'});
  const pq = Pn.pen.child({transform: `translate(${X} ${Y}) scale(${k})`}, k);
  PIN(pq, -12, -64, 40, {tone: 'acc'}); pq.circle(-12, -64, 24, {fill: true, sw: 2.2}); LP.ico(Pn.p, pl.icon, ...at(-12, -64), 26);
  const cq = Cd.pen.child({transform: `translate(${X} ${Y}) scale(${k})`}, k); cq.rect(-74, 92, 148, 66, {rx: 14, fill: true});
  if (pl.label) LP.word(K, Cd.p, pl.label, X, Y + 104 * k, 26, 120); else LP.ico(Cd.p, pl.icon, X, Y + 125 * k, 30);
  K.enter(Ph.o, T.b[0], 'rise'); K.enter(Pn.o, T.hit - .2, 'drop'); LP.light(K, Pn, T.hit + .2); K.enter(Cd.o, T.hit + .3, 'chip');
});

/* a person stands on the ground; on the key word a big pin with the place on it drops beside them and lights */
R3.both('B21', 'arrive', 'คนยืนข้างหมุดใหญ่ มาถึงสถานที่แล้ว', (K, s, T, g, small) => {
  const pl = s.place ?? {icon: 'map-pin'}, G = 262, P = LP.piece(g, small, 206, G), Pn = LP.piece(g, small, 382, G);
  P.pen.line(110, G, 490, G, {sw: 2, tone: 'soft'}); P.pen.ellipse(382, G, 30, 8, {sw: 1.6, tone: 'soft'});
  SK.person(P.pen, {x: 206, y: G, h: 220, pose: 'wave'});
  PIN(Pn.pen, 382, G - 102, 66, {tone: 'acc'}); Pn.pen.circle(382, G - 102, 42, {fill: true, sw: 2.2}); LP.ico(Pn.p, pl.icon, 382, G - 102, 44);
  K.enter(P.o, T.b[0], 'rise'); K.enter(Pn.o, T.hit - .2, 'drop'); LP.light(K, Pn, T.hit + .2);
  if (pl.label) LP.word(K, g, pl.label, 300, 280, 34, 360, false, T.hit + .3);
});

/* a building; on the key word a pin drops onto its roof and lights */
R3.both('B21', 'building', 'หมุดปักลงบนตึก', (K, s, T, g, small) => {
  const pl = s.place ?? {icon: 'map-pin'}, B = LP.piece(g, small, 300, 282), Pn = LP.piece(g, small, 300, 124);
  const p = B.pen;
  p.line(110, 282, 490, 282, {sw: 2, tone: 'soft'});
  p.rect(196, 136, 208, 146, {rx: 6, fill: true}); p.rect(188, 126, 224, 14, {rx: 5, fill: true});
  [0, 1, 2].forEach(r => [0, 1, 2].forEach(c => { if (r === 2 && c === 1) return; p.rect(218 + c * 62, 154 + r * 40, 40, 24, {rx: 4, sw: 1.8, tone: 'soft'}); }));
  p.rect(282, 234, 36, 48, {rx: 5, fill: true, sw: 2.2}); p.dot(310, 260, 2.6);
  PIN(Pn.pen, 300, 50, 48, {tone: 'acc'}); Pn.pen.circle(300, 48, 30, {fill: true, sw: 2.2}); LP.ico(Pn.p, pl.icon, 300, 48, 34);
  K.enter(B.o, T.b[0], 'rise'); K.enter(Pn.o, T.hit - .2, 'drop'); LP.light(K, Pn, T.hit + .2);
  if (pl.label) LP.word(K, g, pl.label, 300, 288, 34, 360, false, T.b[1]);
});

/* ================= B12 เหตุกับผล: items [3 {icon, label?, tone?}] ================= */
/* three circles pop in one by one, an arrow (the skill's connect) drawing between them; the last one (the effect) lights */
R3.both('B12', 'flow', 'สามไอคอน ลูกศรวาดต่อกันจากเหตุไปผล', (K, s, T, g, small) => {
  const it = (s.items ?? []).slice(0, 3), neg = it[2]?.tone === 'neg', xs = [104, 300, 496], Y = 128, R = 56, when = [T.b[0], T.b[1], T.b[2]];
  xs.forEach((x, k) => {
    const last = k === 2, lit = last && !neg, n = LP.piece(g, small, x, Y);
    n.pen.circle(x, Y, R, {fill: true, tone: lit ? 'acc' : undefined}); n.pen.circle(x, Y, R - 10, {sw: 1.6, tone: lit ? 'acc' : 'soft', fill: 'none'});
    if (last && neg) n.pen.circle(x, Y, R, {tone: 'neg', sw: 3.4});
    if (it[k]) LP.ico(n.p, it[k].icon, x, Y, 46, lit);
    if (it[k]?.label) { const w = LP.word(K, n.p, it[k].label, x, Y + R + 16, 26, 170); if (last && neg) w.style.color = 'var(--lp-neg)'; }
    K.enter(n.o, when[k], 'pop');
    if (k < 2) { const a = LP.piece(g, small, x + 98, Y - 30); SK.connect(a.pen, x + R + 10, Y - 12, xs[k + 1] - R - 10, Y - 12, {bend: -.32, sw: 2.6});
      a.p.querySelectorAll('path,polyline').forEach(e => K.draw(e, when[k] + .3, (when[k + 1] - when[k]) * .6)); }
    if (lit) { LP.light(K, n, T.hit); K.float(n, T.hit + .5); }
    else if (last) K.shake(n.p, T.hit);
  });
});

/* a chain of three links popping in one after another; the last link (the effect) lights. Each link goes over the one before at
   the top and is hidden along its outline at the bottom (Pen.masked), so they read as hooked together */
R3.both('B12', 'chain', 'โซ่สามข้อ ข้อสุดท้ายติดสี', (K, s, T, g, small) => {
  const it = (s.items ?? []).slice(0, 3), neg = it[2]?.tone === 'neg', xs = [146, 300, 454], Y = 140, W = 186, H = 112, T0 = 26, when = [T.b[0], T.b[1], T.b[2]];
  const d = x => `M ${x - W / 2 + H / 2} ${Y - H / 2} L ${x + W / 2 - H / 2} ${Y - H / 2} A ${H / 2} ${H / 2} 0 0 1 ${x + W / 2 - H / 2} ${Y + H / 2} L ${x - W / 2 + H / 2} ${Y + H / 2} A ${H / 2} ${H / 2} 0 0 1 ${x - W / 2 + H / 2} ${Y - H / 2} Z`;
  xs.forEach((x, k) => {
    const n = LP.piece(g, small, x, Y), lit = k === 2 && !neg;
    (k === 0 ? n.pen : n.pen.masked(d(xs[k - 1]), T0 + 6 * n.pen.k, xs[k - 1], Y, W, H)).tube(d(x), T0, {tone: lit ? 'acc' : undefined});
    if (it[k]) { const i = LP.ico(n.p, it[k].icon, x, Y, 36); if (k === 2) i.style.color = neg ? 'var(--lp-neg)' : 'var(--lp-acc-line)'; }
    if (it[k]?.label) { const w = LP.word(K, n.p, it[k].label, x, Y + H / 2 + 24, 26, 150); if (k === 2 && neg) w.style.color = 'var(--lp-neg)'; }
    K.enter(n.o, when[k], 'pop');
    if (lit) { LP.light(K, n, T.hit); K.float(n, T.hit + .5); } else if (k === 2) K.shake(n.p, T.hit);
  });
});

/* ================= B05 ถูกกับผิด: wrong {icon, label?}, right {icon, label?} ================= */
/* two cards come in; on the key word a no-entry sign stamps down on the wrong one, the right one lights and gets its tick */
R3.both('B05', 'nosign', 'ป้ายห้ามประทับบนข้อผิด ข้อถูกได้เครื่องหมายถูก', (K, s, T, g, small) => {
  const w = s.wrong ?? {icon: 'x'}, r = s.right ?? {icon: 'check'};
  const Wc = LP.piece(g, small, 165, 135), Rc = LP.piece(g, small, 435, 135), Ns = LP.piece(g, small, 165, 135), Ck = LP.piece(g, small, 522, 48);
  Wc.pen.rect(70, 40, 190, 190, {rx: 22, fill: true}); Wc.pen.rect(84, 54, 162, 162, {rx: 14, sw: 1.6, tone: 'soft'}); LP.ico(Wc.p, w.icon, 165, 135, 84);
  Rc.pen.rect(340, 40, 190, 190, {rx: 22, fill: true, tone: 'acc'}); Rc.pen.rect(354, 54, 162, 162, {rx: 14, sw: 1.6, tone: 'acc', fill: 'none', op: .6}); LP.ico(Rc.p, r.icon, 435, 135, 84, true);
  Ns.pen.circle(165, 135, 80, {sw: 7, tone: 'neg'}); Ns.pen.line(108, 78, 222, 192, {sw: 7, tone: 'neg'});
  Ck.pen.circle(522, 48, 30, {fill: true, sw: 3}); SK.check(Ck.pen, 522, 50, .26, {sw: 5});
  if (w.label) LP.word(K, Wc.p, w.label, 165, 252, 32, 220).style.opacity = .7;
  if (r.label) LP.word(K, Rc.p, r.label, 435, 252, 32, 220);
  K.enter(Wc.o, T.b[0], 'rise'); K.enter(Rc.o, T.b[1], 'rise');
  LP.slide(K, Ns, T.hit - .1, 'scale(1.6)'); K.shake(Wc.p, T.hit + .25);           // the sign stamps down on the wrong one
  LP.light(K, Rc, T.hit + .1); K.enter(Ck.o, T.hit + .35, 'pop');
});

/* two cards come in; on the key word a hand (the skill's) comes up and points at the right one, which lights; the wrong one fades */
R3.both('B05', 'point', 'มือชี้ไปที่ข้อถูก ข้อผิดจางลง', (K, s, T, g, small) => {
  const w = s.wrong ?? {icon: 'x'}, r = s.right ?? {icon: 'check'};
  const Wc = LP.piece(g, small, 144, 105), Rc = LP.piece(g, small, 388, 105), Hd = LP.piece(g, small, 388, 300);
  Wc.pen.rect(56, 30, 176, 150, {rx: 20, fill: true}); LP.ico(Wc.p, w.icon, 144, 92, 66);
  if (w.label) LP.word(K, Wc.p, w.label, 144, 128, 28, 150);
  Rc.pen.rect(300, 30, 176, 150, {rx: 20, fill: true, tone: 'acc'}); LP.ico(Rc.p, r.icon, 388, 92, 66, true);
  if (r.label) LP.word(K, Rc.p, r.label, 388, 128, 28, 150, true);
  SK.hand(Hd.pen, 388, 262, 1.12);
  K.enter(Wc.o, T.b[0], 'rise'); K.enter(Rc.o, T.b[1], 'rise');
  LP.slide(K, Hd, T.hit - .25, 'translateY(150px)');                       // the hand comes up to point
  LP.light(K, Rc, T.hit); K.fade(Wc.m, T.hit + .1, 1, .38);
});

/* ================= B11 คำพูด: quote, kind, mood, react? ================= */
/* a person (the skill's bust) comes in; what was said pops out in a speech bubble pointing at the head; the reaction lands on it */
R3.both('B11', 'speak', 'คนพูด ฟองคำพูดเด้งออกมา', (K, s, T, g, small) => {
  const q = s.quote ?? '', bad = s.mood === 'bad', P = LP.piece(g, small, 140, 300), Bb = LP.piece(g, small, 240, 175), Rx = LP.piece(g, small, 532, 180);
  SK.bust(P.pen, 140, 254, 1.38);
  SK.bubble(Bb.pen, 404, 112, 280, 150, {tail: 'left', sw: 3});
  if (q) LP.word(K, Bb.p, q, 404, 82, 44, 230);
  if (s.react) { Rx.pen.circle(532, 180, 26, {fill: true, tone: bad ? 'neg' : 'acc', sw: 2.4}); LP.ico(Rx.p, s.react, 532, 180, 28, !bad); }
  K.enter(P.o, T.b[0], 'rise'); K.enter(Bb.o, T.b[1], 'pop'); K.float(Bb, T.b[1] + .6);
  if (s.react) K.enter(Rx.o, T.hit, 'pop');
});

/* a chat: a bubble from one side, then on the key word the answer (the words said) pops from the other side and lights */
R3.both('B11', 'chat', 'ฟองแชตสองฝั่งโต้ตอบกัน', (K, s, T, g, small) => {
  const q = s.quote ?? '', bad = s.mood === 'bad';
  const L = LP.piece(g, small, 114, 130), Rb = LP.piece(g, small, 538, 286), Rq = LP.piece(g, small, 484, 290), Rx = LP.piece(g, small, 222, 294);
  SK.bust(L.pen, 62, 118, .56); SK.bubble(L.pen, 232, 78, 236, 104, {tail: 'left'});
  [62, 84].forEach((y, k) => L.pen.line(140, y, k ? 280 : 316, y, {sw: 2.2, tone: 'soft'})); L.pen.line(140, 106, 220, 106, {sw: 2.2, tone: 'soft'});
  SK.bust(Rb.pen, 538, 286, .56, {tone: 'acc'});
  SK.bubble(Rq.pen, 352, 246, 264, 112, {tail: 'right', tone: 'acc'});
  if (q) LP.word(K, Rq.p, q, 352, 220, 42, 230, true);
  if (s.react) { Rx.pen.circle(222, 294, 24, {fill: true, tone: bad ? 'neg' : undefined, sw: 2.4}); LP.ico(Rx.p, s.react, 222, 294, 26); }
  K.enter(L.o, T.b[0], 'rise'); K.enter(Rb.o, T.b[1], 'rise');
  K.enter(Rq.o, T.hit - .1, 'pop'); LP.light(K, Rq, T.hit + .15); LP.light(K, Rb, T.hit + .15, false);
  if (s.react) K.enter(Rx.o, T.hit + .4, 'pop');
});

/* ================= B01 ตัวเลขเด่น: value, unit?, icon?, dir?, money? ================= */
/* a price tag drops in on its string, swings and comes to rest; the amount comes up on it on the key word (money only) */
R3.both('B01', 'pricetag', 'ป้ายราคาแขวน แกว่งแล้วหยุด', (K, s, T, g, small) => {
  const Tg = LP.piece(g, small, 300, -10), p = Tg.pen;
  p.path('M 300 76 C 316 60 318 30 312 -10', {sw: 2.2});
  const tg = p.child({transform: 'rotate(-6 300 76)'});
  tg.path('M 280 42 Q 300 30 320 42 L 434 106 Q 448 114 448 130 L 448 318 Q 448 334 432 334 L 168 334 Q 152 334 152 318 L 152 130 Q 152 114 166 106 Z', {fill: true});
  tg.path('M 282 56 Q 300 46 318 56 L 426 116 Q 436 122 436 134 L 436 310 Q 436 322 424 322 L 176 322 Q 164 322 164 310 L 164 134 Q 164 122 174 116 Z', {sw: 1.6, tone: 'soft'});
  tg.circle(300, 76, 12, {sw: 2.6});
  p.path('M 290 -10 C 284 24 296 50 300 76', {sw: 2.2});
  const hold = R6.group(Tg.p); hold.style.transformOrigin = '300px 76px'; hold.style.transform = 'rotate(-6deg)';
  const nb = div('left:0;top:0;width:600px;height:340px', hold);
  const n = div('left:152px;top:128px;width:296px;text-align:center', nb, `<span class="u-num lp-t" style="font-size:92px">${s.value}</span>`);
  FITS.push(() => { const sp = n.firstChild; if (sp.offsetWidth > 260) sp.style.fontSize = (92 * 260 / sp.offsetWidth).toFixed(1) + 'px'; });
  if (s.unit) LP.word(K, nb, s.unit, 300, 236, 34, 240);
  nb.style.transformOrigin = '300px 190px';
  K.enter(Tg.o, T.b[0], 'drop');
  A(Tg.m, [{transform: 'rotate(9deg)'}, {transform: 'rotate(-5deg)'}, {transform: 'rotate(2.5deg)'}, {transform: 'rotate(-1deg)'}, {transform: 'none'}], T.b[0] + .3, Math.max(.8, T.hit - T.b[0] - .3), {e: 'ease-out'});
  K.enter(nb, T.hit, 'pop'); K.float(Tg, T.hit + .5, T.t1, .5);
}, R2.money);

/* a wallet comes in; on the key word the banknotes slide up out of it, the amount on the top note (money only) */
R3.both('B01', 'wallet', 'กระเป๋าสตางค์เปิด ธนบัตรเลื่อนออก มีจำนวนเงิน', (K, s, T, g, small) => {
  const Nt = LP.piece(g, small, 300, 120), Wl = LP.piece(g, small, 300, 250), bk = Nt.pen;
  const note = (rot, dy, top) => { const q = bk.child({transform: `rotate(${rot} 300 230)`});
    q.rect(128, 14 + dy, 344, 168, {rx: 8, fill: true}); q.rect(140, 26 + dy, 320, 144, {rx: 5, sw: 1.6, tone: 'soft'});
    if (!top) q.circle(158, 46 + dy, 8, {sw: 1.6, tone: 'soft'}); };
  note(-8, 16, false); note(-4, 8, false); note(0, 0, true);
  const n = div('left:128px;top:26px;width:344px;text-align:center', Nt.p, `<span class="u-num lp-t" style="font-size:74px">${s.value}</span>`);
  FITS.push(() => { const sp = n.firstChild; if (sp.offsetWidth > 290) sp.style.fontSize = (74 * 290 / sp.offsetWidth).toFixed(1) + 'px'; });
  if (s.unit) LP.word(K, Nt.p, s.unit, 300, 106, 28, 260);
  const p = Wl.pen;
  p.rect(92, 160, 416, 174, {rx: 22, fill: true}); p.rect(104, 172, 392, 150, {rx: 14, sw: 1.6, tone: 'soft'});
  p.path('M 412 210 L 508 210 Q 534 210 534 248 Q 534 286 508 286 L 412 286 Z', {fill: true});
  p.circle(494, 248, 15, {fill: true, sw: 2.6});
  K.enter(Wl.o, T.b[0], 'rise');
  LP.slide(K, Nt, T.hit - .2, 'translateY(170px)');                       // the notes come up out of the wallet
  K.float(Nt, T.hit + .5, T.t1, .5);
}, R2.money);

/* ================= B02 เพิ่ม / ลด: dir, item, center?, n?, keep?, end? ================= */
/* a group of people (the skill's team): going up, the two behind join the first one and it lights; going down, the two behind
   fade away on the key word. People only */
R3.both('B02', 'team', 'กลุ่มคน คนมาเพิ่มหรือหายไป', (K, s, T, g, small) => {
  const up = s.dir !== 'down', X = 300, Y = 196, sc = 2.25;
  const Lb = LP.piece(g, small, X - 72 * sc, 300), Rb = LP.piece(g, small, X + 72 * sc, 300), F = LP.piece(g, small, X, 300);
  SK.bust(Lb.pen, X - 72 * sc, Y + 14 * sc, .8 * sc); SK.bust(Rb.pen, X + 72 * sc, Y + 14 * sc, .8 * sc); SK.bust(F.pen, X, Y, sc, {tone: up ? 'acc' : undefined});
  K.enter(F.o, T.b[0], 'rise');
  if (up) { K.enter(Lb.o, T.b[2], 'pop'); K.enter(Rb.o, T.hit - .15, 'pop'); LP.light(K, F, T.hit + .1); }
  else { K.enter(Lb.o, T.b[0] + .1, 'rise'); K.enter(Rb.o, T.b[0] + .2, 'rise'); K.fade(Lb.m, T.hit, 1, .16); K.fade(Rb.m, T.hit + .12, 1, .16); }
}, s => S11.human(s.item?.icon));

/* cardboard boxes (iso): going up they drop onto the stack one by one and the top one lights; going down the top ones are lifted
   off and fade on the key word */
R3.both('B02', 'boxes', 'กล่องซ้อนสูงขึ้น หรือถูกหยิบออกทีละกล่อง', (K, s, T, g, small) => {
  const up = s.dir !== 'down', it = s.item ?? {icon: 'package'}, H = 80, Wd = 112;
  [0, 1, 2].forEach(k => {
    const y = 290 - k * H, n = LP.piece(g, small, 300, y), p = n.pen, top = up && k === 2;
    const P = (X, Y, Z) => { const [a, b] = iso(X, Y, Z); return [300 + a, y + b]; }, hw = Wd / 2;
    p.shape([P(-hw, 0, hw), P(hw, 0, hw), P(hw, H, hw), P(-hw, H, hw)], {fill: true});
    p.shape([P(hw, 0, hw), P(hw, 0, -hw), P(hw, H, -hw), P(hw, H, hw)], {fill: true});
    p.shape([P(-hw, H, -hw), P(hw, H, -hw), P(hw, H, hw), P(-hw, H, hw)], {fill: true, tone: top ? 'acc' : undefined});
    p.poly([P(0, H, -hw), P(0, H, hw), P(0, H * .62, hw)], {sw: 2.2, fill: 'none', tone: top ? 'acc' : 'soft'});
    const c = P(-hw * .5, H * .4, hw); LP.ico(n.p, it.icon, c[0], c[1], 28);
    if (up) { K.enter(n.o, [T.b[0], T.b[2] - .1, T.hit - .2][k], k ? 'drop' : 'rise'); if (top) LP.light(K, n, T.hit + .15); }
    else { K.enter(n.o, T.b[0] + k * .12, 'rise');
      if (k) { const t = T.hit + (2 - k) * .15; K.move(n.m, t, 'none', 'translateY(-50px)'); K.fade(n.m, t, 1, .14); } }
  });
});

/* ================= B14 ประโยคเด็ด: idea {icon?, label} ================= */
/* an open book; on the key word a highlighter runs along one line and the line it marks is the punchline */
R3.both('B14', 'highlight', 'ปากกาไฮไลต์ขีดประโยคในหนังสือ', (K, s, T, g, small) => {
  const it = s.idea ?? {icon: 'quote'}, Bk = LP.piece(g, small, 300, 190), Br = LP.piece(g, small, 322, 184), Wd = LP.piece(g, small, 427, 184), Pn = LP.piece(g, small, 540, 214);
  const p = Bk.pen;
  p.path('M 300 44 Q 168 20 40 40 L 40 334 Q 168 314 300 340 Q 432 314 560 334 L 560 40 Q 432 20 300 44 Z', {fill: true});
  p.path('M 300 34 Q 168 10 34 30 L 34 322 Q 168 302 300 328 Z', {fill: true}); p.path('M 300 34 Q 432 10 566 30 L 566 322 Q 432 302 300 328 Z', {fill: true});
  [92, 124, 156, 240, 272].forEach((y, k) => p.line(72, y, k === 4 ? 190 : 262, y, {sw: 1.6, tone: 'soft'}));
  [92, 124, 240, 272].forEach((y, k) => p.line(338, y, k === 3 ? 450 : 528, y, {sw: 1.6, tone: 'soft'}));
  Br.pen.rect(322, 152, 210, 64, {rx: 6, fill: 'var(--lp-acc)', stroke: 'none', op: .9});
  LP.row(K, Wd.p, it.label ? {label: it.label} : it, 427, 163, 34, 196, true);
  const pen = Pn.pen.child({transform: 'rotate(38 540 214)'});
  pen.rect(522, 112, 36, 84, {rx: 8, fill: true}); pen.rect(522, 84, 36, 32, {rx: 8, fill: true, tone: 'acc'});
  pen.path('M 526 196 L 554 196 L 548 216 L 532 216 Z', {fill: true}); pen.path('M 534 216 L 546 216 L 543 224 L 537 224 Z', {fill: true, tone: 'acc', sw: 2});
  K.enter(Bk.o, T.b[0], 'rise');
  K.enter(Pn.o, T.b[2], 'rise'); K.move(Pn.m, T.hit - .25, 'translateX(-206px)', 'none', {hold: true, kind: 'move'});   // the pen runs along the line
  K.grow(Br.p, T.hit - .25, 'X', ST.motion.move.d); Br.p.style.transformOrigin = '322px 184px'; A(Br.o, [{opacity: 0}, {opacity: 1}], T.hit - .25, .05);
  K.enter(Wd.o, T.hit + .2, 'pop');
});

/* a screen on a stand and a speaker (the skill's point pictogram) come in; the punchline comes up on the screen on the key word */
R3.both('B14', 'slides', 'คนยืนชี้จอสไลด์ ประโยคขึ้นจอ', (K, s, T, g, small) => {
  const it = s.idea ?? {icon: 'quote'}, G = 336, Sc = LP.piece(g, small, 410, 200), Pp = LP.piece(g, small, 128, G), Wd = LP.piece(g, small, 410, 100);
  const p = Sc.pen;
  p.line(410, 204, 410, 300, {sw: 3}); p.line(410, 294, 362, G, {sw: 3}); p.line(410, 294, 458, G, {sw: 3});
  p.rect(256, 10, 308, 196, {rx: 14, fill: true}); p.rect(270, 24, 280, 168, {rx: 8, sw: 1.6, tone: 'soft'});
  if (it.label) LP.word(K, Wd.p, it.label, 410, 84, 42, 250); else LP.ico(Wd.p, it.icon, 410, 108, 80);
  SK.person(Pp.pen, {x: 128, y: G, h: 290, pose: 'point'});
  K.enter(Sc.o, T.b[0], 'rise'); LP.slide(K, Pp, T.b[1], 'translateX(-120px)');
  K.enter(Wd.o, T.hit, 'pop');
});

/* ================= sample sentences (r11.*), general ones (not Friend's script) ================= */
SENTENCE('r11.newbie', {cat: 'B10', name: 'คลิปนี้สำหรับมือใหม่', say: ['คลิปนี้สำหรับมือใหม่ที่', 'อยากขายของ'], who: {icon: 'user'}, label: 'มือใหม่', tags: ['อยากขายของ']});
SENTENCE('r11.mom', {cat: 'B10', name: 'คุณแม่มือใหม่', say: ['สำหรับคุณแม่มือใหม่', 'ที่ลูกยังเล็ก'], who: {icon: 'user'}, label: 'คุณแม่มือใหม่', tags: ['ลูกยังเล็ก']});
SENTENCE('r11.salt', {cat: 'B13', name: 'ความลับคือเกลือหยิบมือ', say: ['ความลับของร้านนี้คือ', 'เกลือหยิบมือ'], secret: {icon: 'cooking-pot', label: 'เกลือหยิบมือ'}});
SENTENCE('r11.light', {cat: 'B13', name: 'เคล็ดลับคือแสงหน้าต่าง', say: ['เคล็ดลับของรูปสวยคือ', 'แสงหน้าต่าง'], secret: {icon: 'sun', label: 'แสงหน้าต่าง'}});
SENTENCE('r11.friend', {cat: 'B20', name: 'เพื่อนสนิท', say: ['เราสองคนเป็น', 'เพื่อนสนิทกัน'], a: {icon: 'user', label: 'ผม'}, b: {icon: 'user', label: 'ต้น'}, label: 'เพื่อนสนิท'});
SENTENCE('r11.ex', {cat: 'B20', name: 'แฟนเก่า เลิกกันแล้ว', say: ['เขาคือแฟนเก่า', 'เลิกกันไปแล้ว'], a: {icon: 'user', label: 'ผม'}, b: {icon: 'user', label: 'เขา'}, label: 'แฟนเก่า', cut: true});
SENTENCE('r11.collab', {cat: 'B20', name: 'คอลแล็บกับแบรนด์', say: ['วันนี้เราได้คอลแล็บกับ', 'แสนสิริ'], a: {icon: 'user', label: 'เรา'}, b: {icon: 'building-2', label: 'แสนสิริ'}, label: 'คอลแล็บ'});
SENTENCE('r11.cafe', {cat: 'B21', name: 'คาเฟ่ชั้นสอง ริมหน้าต่าง', say: ['คาเฟ่นี้อยู่ชั้นสอง', 'ริมหน้าต่าง'], place: {icon: 'coffee', label: 'คาเฟ่บ้านไม้'}, spots: [{icon: 'layers', label: 'ชั้นสอง'}, {icon: 'sun', label: 'ริมหน้าต่าง'}]});
SENTENCE('r11.tokyo', {cat: 'B21', name: 'ไปโตเกียว', say: ['ปีนี้ได้ไป', 'โตเกียว'], place: {icon: 'landmark', label: 'โตเกียว'}});
SENTENCE('r11.debt', {cat: 'B12', name: 'รูดบัตร ดอกเบี้ย หนี้ท่วม', say: ['รูดบัตร ดอกเบี้ยทบ', 'จนหนี้ท่วม'],
  items: [{icon: 'credit-card', label: 'รูดบัตร'}, {icon: 'percent', label: 'ดอกเบี้ยทบ'}, {icon: 'trending-down', label: 'หนี้ท่วม', tone: 'neg'}]});
SENTENCE('r11.share', {cat: 'B12', name: 'พอใจ บอกต่อ ยอดเพิ่ม', say: ['ลูกค้าพอใจ ก็บอกต่อ', 'ยอดเพิ่มเอง'],
  items: [{icon: 'smile', label: 'ลูกค้าพอใจ'}, {icon: 'share-2', label: 'บอกต่อ'}, {icon: 'trending-up', label: 'ยอดเพิ่ม'}]});
SENTENCE('r11.cheap', {cat: 'B05', name: 'ไม่ใช่ถูกสุด แต่คุ้มสุด', say: ['ไม่ใช่ราคาถูกที่สุด', 'แต่คุ้มที่สุด'], wrong: {icon: 'tag', label: 'ถูกสุด'}, right: {icon: 'gem', label: 'คุ้มสุด'}});
SENTENCE('r11.word', {cat: 'B05', name: 'อย่าเขียนขายของ เขียนแก้ปัญหา', say: ['อย่าเขียนขายของ', 'เขียนแก้ปัญหา'], wrong: {icon: 'megaphone', label: 'ขายของ'}, right: {icon: 'lightbulb', label: 'แก้ปัญหา'}});
SENTENCE('r11.call', {cat: 'B11', name: 'ลูกค้าโทรมาบอกว่าอร่อยมาก', say: ['ลูกค้าโทรมาบอกว่า', 'อร่อยมาก'], kind: 'message', quote: 'อร่อยมาก', mood: 'good', react: 'thumbs-up'});
SENTENCE('r11.fast', {cat: 'B11', name: 'คอมเมนต์ว่าส่งไวมาก', say: ['มีคนคอมเมนต์ว่า', 'ส่งไวมาก'], kind: 'comment', quote: 'ส่งไวมาก', mood: 'good', react: 'heart'});
SENTENCE('r11.price', {cat: 'B01', name: 'ราคาแค่ 990 บาท', say: ['เสื้อตัวนี้ราคาแค่', '990 บาท'], value: '990', unit: 'บาท', icon: 'shirt', money: true});
SENTENCE('r11.ads', {cat: 'B01', name: 'ค่าโฆษณาเดือนละ 3,000 บาท', say: ['ค่าโฆษณาเดือนละ', '3,000 บาท'], value: '3,000', unit: 'บาท', icon: 'megaphone', money: true});
SENTENCE('r11.line', {cat: 'B02', name: 'ลูกค้ามาต่อคิวเพิ่มขึ้น', say: ['พอทำคลิป ลูกค้า', 'มาต่อคิวเพิ่มขึ้น'], dir: 'up', item: {icon: 'user'}, center: {icon: 'store'}, n: 4});
SENTENCE('r11.gone', {cat: 'B02', name: 'ลูกค้าหายไปเกือบหมด', say: ['ช่วงนั้นลูกค้า', 'หายไปเกือบหมด'], dir: 'down', item: {icon: 'user'}, center: {icon: 'store'}, n: 4, keep: 1});
SENTENCE('r11.orders', {cat: 'B02', name: 'ออเดอร์เพิ่มขึ้น', say: ['เดือนนี้ออเดอร์', 'เพิ่มขึ้นเยอะ'], dir: 'up', item: {icon: 'package'}, n: 4});
SENTENCE('r11.stock', {cat: 'B02', name: 'ของในสต็อกลดลง', say: ['ของในสต็อก', 'ลดลงเรื่อยๆ'], dir: 'down', item: {icon: 'package'}, n: 4, keep: 2});
SENTENCE('r11.daily', {cat: 'B14', name: 'ความสม่ำเสมอชนะทุกอย่าง', say: ['ความสม่ำเสมอ', 'ชนะทุกอย่าง'], idea: {icon: 'repeat', label: 'สม่ำเสมอ'}});
SENTENCE('r11.start', {cat: 'B14', name: 'ไม่ต้องเก่งก่อน แค่เริ่มก่อน', say: ['ไม่ต้องเก่งก่อน', 'แค่เริ่มก่อน'], idea: {icon: 'rocket', label: 'แค่เริ่มก่อน'}});
