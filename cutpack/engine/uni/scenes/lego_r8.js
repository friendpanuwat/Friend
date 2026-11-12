/* =====================================================================
   CutPack · uni · LEGO round 8 (Friend 2026-11-11: "เอาตามนี้ทั้งหมด เริ่มได้เลยครับ"): two new variants for the ten
   categories met most often in the 26 scripts (library/uni-test/gaps/stats.json), every one a different kind of picture
   from the variants the category already has (LESSONS 35). Same slots as before (cat_ai.py), same rules (R3.both: one
   composition on the 600 × 340 small canvas, scaled 1.6× full screen; nothing past x 550 below y 200; words only from
   the slots; cards never overlap at rest, so nothing shows through a see-through card).
     B12 เหตุกับผล   กดสวิตช์ ไฟวิ่งตามสายไปถึงผล (wire) · รดน้ำต้นกล้า แล้วต้นโตออกผล (plant)
     B06 คำถาม       กล่องปริศนาสั่น มีเครื่องหมายคำถามลอยออกมา (box) · ช่องค้นหา พิมพ์คำถามทีละตัว (type, app screen)
     B07 คำเตือน     ไฟจราจรเปลี่ยนเป็นสีแดง (traffic) · ไฟวิ่งตามสายชนวนเข้าหาของ (fuse)
     B03 เปรียบเทียบ  สองลู่วิ่งแข่งกัน (race, side by side) · ภาพก่อนกับหลัง มีแถบเลื่อนตรงกลาง (slider, before → after)
     B05 ถูกกับผิด    ปุ่มเกมโชว์ ข้อผิดไฟแดงกากบาท ข้อถูกไฟสีเน้น (buzzer) · ยางลบลบคำผิด แล้วเขียนคำถูกแทน (eraser)
     B11 คำพูด       คอมเมนต์ไหลขึ้นแบบไลฟ์สด (live) · กระดาษโน้ตแปะบนบอร์ดทีละแผ่น (board)
     B17 ไล่รายการ    ชั้นวางของ ของวางทีละช่อง (shelf) · ไพ่คลี่ออกเป็นรูปพัด (fan)
     B18 เหตุการณ์    หนังสือเปิด หน้ากระดาษพลิกไปถึงเหตุการณ์ (book) · ม้วนฟิล์มเลื่อนทีละเฟรม (film)
     B19 ความรู้สึก    หัวใจเต้นตุบ ๆ หรือร้าวแตก (heart) · ท้องฟ้าเหนือหัวคน แดดออกหรือเมฆฝน (sky)
     B10 คน          ป้ายชื่อแปะที่อกคน (tag) · แม่เหล็กดูดคนกลุ่มที่ใช่เข้ามาหา (magnet)
   The styles have no green: "ไฟเขียว" of the game-show buzzer is the style's accent, as every "right" thing is.
   ===================================================================== */
const R8 = {
  svg: (g, inner, z) => div(`left:0;top:0;width:600px;height:340px${z != null ? `;z-index:${z}` : ''}`, g, `<svg width="600" height="340" style="overflow:visible">${inner}</svg>`),
  /* a wave the shape of a drawn path (a heart, a cloud), from behind it outward (rule 5: the thing's own shape).
     The path is drawn in a box w × h at (x, y); the wave scales from the box's middle */
  wave(K, g, d, x, y, w, h, t, tone = 'acc', grow = 1.35) {
    const e = div(`left:${x}px;top:${y}px;width:${w}px;height:${h}px;opacity:0`, g, `<svg width="${w}" height="${h}" style="overflow:visible"><path class="u-wave${tone === 'neg' ? ' u-wave-neg' : ''}" d="${d}"/></svg>`);
    g.insertBefore(e, g.firstChild);
    A(e, [{opacity: .9, transform: 'scale(1)'}, {opacity: 0, transform: `scale(${grow})`}], t, .7, {e: EASE.smooth, f: 'none'});
    return e;
  },
  /* where a path is at n + 1 evenly spaced points (the path must already be in the page) */
  along(path, n = 30) { const L = path.getTotalLength(); return [...Array(n + 1)].map((_, i) => path.getPointAtLength(L * i / n)); },
  /* a thing travels through points from t over d (translate of its m layer; the node's own place is the first point) */
  travel(el, pts, t, d, e = 'linear') {
    const [x0, y0] = [pts[0].x, pts[0].y];
    A(el, pts.map((p, i) => ({transform: `translate(${(p.x - x0).toFixed(1)}px,${(p.y - y0).toFixed(1)}px)`, offset: i / (pts.length - 1)})), t, d, {e, f: 'both'});
  },
  /* the heart in a 200 × 180 box */
  HEART: 'M100 172C46 128 4 96 4 54C4 24 28 4 56 4C76 4 92 16 100 32C108 16 124 4 144 4C172 4 196 24 196 54C196 96 154 128 100 172Z',
  /* a cloud in a 200 × 96 box */
  CLOUD: 'M44 92C20 92 4 76 4 58C4 40 18 28 36 28C42 12 58 4 76 4C96 4 112 16 118 32C124 26 134 22 144 22C164 22 180 36 182 54C192 58 196 66 196 74C196 84 188 92 176 92Z',
};

/* ================= B12 เหตุกับผล: items [3 {icon, label?}], end? ================= */
/* 1 · the first thing is a button pressed down; light runs along the drooping cable to the next thing, then to the last */
R3.both('B12', 'wire', 'กดสวิตช์ ไฟวิ่งตามสายไปถึงผล', (K, s, T, g) => {
  const its = s.items.slice(0, 3), xs = [96, 300, 494], Y = 108, S = 100, h = S / 2;
  /* the cables droop between the things but stay above the words (lowest point y 156, words from y 170) */
  const seg = (x0, x1) => `M${x0} ${Y}C${x0 + 30} ${Y + 64} ${x1 - 30} ${Y + 64} ${x1} ${Y}`;
  const d = [seg(xs[0] + h, xs[1] - h), seg(xs[1] + h, xs[2] - h)];
  const cab = R8.svg(g, d.map(p => `<path class="ln u-thin" d="${p}"/>`).join(''));
  R7.show(cab, T.b[0] + .2); cab.querySelectorAll('path').forEach((p, i) => K.draw(p, T.b[0] + .2 + i * .15, .4));
  const glow = d.map(p => R8.svg(g, `<path class="u-acc-line" style="stroke-width:7px" d="${p}"/>`));
  const bs = its.map((it, i) => K.badge(g, it.icon, xs[i], Y, S, T.b[0] + i * .1, {tone: it.tone ?? 'main', shape: i ? 'tile' : 'round'}));
  its.forEach((it, i) => { if (it.label) R4.word(K, g, it.label, xs[i], Y + h + 14, 32, T.b[0] + .2 + i * .1, 170); });
  /* the press: the button sinks and comes back, then the light leaves it */
  const press = T.b[1] - .1;
  A(bs[0].p, [{transform: 'scale(1)'}, {transform: 'scale(.84)', offset: .4}, {transform: 'scale(1)'}], press, .3, {e: 'ease-out', f: 'none'});
  const run1 = press + .2, mid = Math.max(run1 + .3, Math.min(T.b[2], T.hit - .55));
  R7.show(glow[0], run1); K.draw(glow[0].querySelector('path'), run1, mid - run1);
  const lit1 = R7.up(K, g, its[1].icon, xs[1], Y, S, mid, 'tile');
  const run2 = mid + .08; R7.show(glow[1], run2); K.draw(glow[1].querySelector('path'), run2, Math.max(.2, T.hit - run2));
  const lit2 = R7.up(K, g, its[2].icon, xs[2], Y, S, T.hit, 'tile');
  K.fade(bs[2].o, lit2.done, 1, 0); K.fade(bs[1].o, lit1.done, 1, 0);
  R1.ripple(K, lit2, lit2.done);
  if (s.end) K.sat(g, s.end.icon, 548, 30, 58, lit2.done + .1, {tone: s.end.tone ?? 'main'});
});

/* 2 · the first thing waters a sprout; the stem grows past the second thing (a leaf) and the last thing ripens on top */
R3.both('B12', 'plant', 'รดน้ำต้นกล้า แล้วต้นโตออกผล', (K, s, T, g) => {
  const its = s.items.slice(0, 3), X = 312, top = 84, soil = 262;
  /* the pot, solid, and the stem that grows out of it (the stem stops under the fruit and the leaf's branch) */
  const pot = R8.svg(g, `<path class="sd" d="M${X - 64} ${soil}H${X + 64}L${X + 48} 330H${X - 48}Z"/>`);
  K.enter(pot, T.b[0], 'rise');
  const grow0 = T.b[1] + .15, grow1 = Math.max(grow0 + .4, T.hit - .35);
  const stem = R6.line(K, g, `M${X} ${soil}V${top + 50}`, grow0, grow1 - grow0);
  /* leaves (decoration) on the stem, then the second thing on its own branch */
  const leaf = (x, y, dir) => `M${x} ${y}C${x + dir * 18} ${y - 26} ${x + dir * 52} ${y - 26} ${x + dir * 64} ${y - 4}C${x + dir * 46} ${y + 14} ${x + dir * 16} ${y + 12} ${x} ${y}Z`;
  const lv = R8.svg(g, `<path class="fl" d="${leaf(X, 232, -1)}"/><path class="u-fl-edge" d="${leaf(X, 232, -1)}"/>`); lv.classList.add('u-decor');
  K.enter(lv, grow0 + .25, 'pop');
  const L = {x: X + 84, y: 182};
  R6.line(K, g, `M${X} ${L.y + 16}L${L.x - 34} ${L.y}`, grow0 + .35, .2);
  const b1 = K.badge(g, its[1].icon, L.x, L.y, 64, grow0 + .5, {tone: its[1].tone ?? 'main', shape: 'round'});
  if (its[1].label) R6.wordL(K, g, its[1].label, L.x + 42, L.y - 20, 30, grow0 + .6, 120);
  /* the watering can: the first thing, tilted, drops falling on the soil */
  const C = {x: 110, y: 96};
  const can = K.badge(g, its[0].icon, C.x, C.y, 92, T.b[0] + .1, {tone: its[0].tone ?? 'main'});
  if (its[0].label) R4.word(K, g, its[0].label, C.x, C.y + 58, 32, T.b[0] + .25, 180);
  K.move(can.m, T.b[1] - .2, 'none', 'rotate(16deg)');
  for (let k = 0; k < 3; k++) {
    const dr = node(g, 0, 0, 16, 22, '', `<svg width="16" height="22"><path class="ac" d="M8 0C12 8 16 12 16 15A8 8 0 0 1 0 15C0 12 4 8 8 0Z"/></svg>`);
    dr.o.classList.add('u-decor'); dr.o.style.opacity = 0;
    const t = T.b[1] + k * .18;
    A(dr.o, [{opacity: 0}, {opacity: 1, offset: .1}, {opacity: 1, offset: .85}, {opacity: 0}], t, .5, {f: 'none'});
    R2.hop(dr.m, t, .5, [C.x + 52, C.y + 10], [X - 20 + k * 14, soil - 18], 30);
  }
  /* the fruit: a bud on the stem's top, then the last thing lights up there on the key word */
  const bud = K.badge(g, its[2].icon, X, top, 96, grow1, {tone: 'soft', shape: 'round'});
  const fruit = R7.up(K, g, its[2].icon, X, top, 96, T.hit, 'round'); K.fade(bud.o, fruit.done, 1, 0);
  R1.ripple(K, fruit, fruit.done);
  if (its[2].label) R6.wordL(K, g, its[2].label, X + 62, top - 22, 38, fruit.done, 170);
  if (s.end) K.sat(g, s.end.icon, 474, 290, 58, fruit.done + .15, {tone: s.end.tone ?? 'main'});
});

/* ================= B06 คำถาม: about? {icon, label?}, options? [2], answer? ================= */
/* 3 · a closed box shakes; on the key word its lid flies off and a question mark (or the answer) rises out of it */
R3.both('B06', 'box', 'กล่องปริศนาสั่น มีเครื่องหมายคำถามลอยออกมา', (K, s, T, g) => {
  const it = s.about ?? {icon: 'package'}, B = {x: 200, y: 150, w: 200, h: 122}, cx = B.x + B.w / 2;
  const box = R6.group(g); box.style.transformOrigin = `${cx}px ${B.y + B.h}px`;
  K.fade(box, T.b[0], 0, 1, {hold: true}); K.move(box, T.b[0], 'translateY(40px)', 'none', {hold: true, kind: 'snap'});
  /* what rises: hidden below the box's top edge (clip), so it never shows through a see-through box */
  const out = div(`left:0;top:0;width:600px;height:340px;clip-path:inset(-400px -400px ${340 - B.y}px -400px)`, g);
  const body = R2.card(node(box, B.x, B.y, B.w, B.h, 'u-panel')); body.p.style.borderRadius = '18px';
  K.badge(body.p, it.icon, B.w / 2, B.h / 2, 74, null, {tone: it.tone ?? 'main'});
  const lid = node(box, B.x - 14, B.y - 24, B.w + 28, 34, '', `<svg width="${B.w + 28}" height="34"><rect class="sd" x="0" y="0" width="${B.w + 28}" height="34" rx="10"/></svg>`);
  lid.m.style.transformOrigin = '20% 100%';
  if (it.label) R4.word(K, g, it.label, cx, B.y + B.h + 10, 34, T.b[0] + .25, 300);
  /* it shakes twice, harder the second time */
  [[T.b[1], 4], [T.b[2], 7]].forEach(([t, a]) => A(box, [0, -a, a, -a, a, 0].map(r => ({transform: `rotate(${r}deg)`})), t, .45, {e: 'ease-in-out', f: 'none'}));
  const open = T.hit - .12;
  K.move(lid.m, open, 'none', 'translate(-40px,-70px) rotate(-24deg)'); K.fade(lid.o, open + .15, 1, 0);
  const ans = s.answer, Q = {x: cx, y: 74}, size = 96;
  const q = K.badge(out, ans ? ans.icon : 'circle-help', Q.x, Q.y, size, null, {tone: 'acc', shape: 'round'});
  R7.show(q.o, open + .05); K.move(q.m, open + .05, `translateY(${B.y + 20 - Q.y + size / 2}px) scale(.6)`, 'none', {hold: true, kind: 'snap'});
  const up = LG.arrive('snap', open + .05);
  R1.ripple(K, q, up);
  if (ans?.label) R6.wordL(K, g, ans.label, Q.x + size / 2 + 18, Q.y - 22, 38, up, 150);
  else if (!ans) { K.sat(g, 'circle-help', 150, 70, 54, up + .1, {tone: 'soft', shape: 'round', k: .6}); K.sat(g, 'circle-help', 456, 104, 44, up + .2, {tone: 'soft', shape: 'round', k: .6}); }
});

/* 4 · a search bar: the question is typed letter by letter, then the answer (or the two choices) drops in below (app screen) */
R3.both('B06', 'type', 'ช่องค้นหา พิมพ์คำถามทีละตัว', (K, s, T, g) => {
  const it = s.about ?? {icon: 'user'}, Bar = {x: 40, y: 22, w: 480, h: 84};
  const bar = R2.card(node(g, Bar.x, Bar.y, Bar.w, Bar.h, 'u-panel')); bar.p.style.borderRadius = '42px'; K.enter(bar.o, T.b[0], 'rise');
  const mg = div(`left:26px;top:${Bar.h / 2 - 20}px;width:40px;height:40px`, bar.p, ICO('search', 40)); mg.className = 'u-label';
  const tx = div(`left:84px;top:0;width:${Bar.w - 120}px;height:${Bar.h}px;display:flex;align-items:center;gap:6px;white-space:nowrap`, bar.p);
  const t0 = T.b[0] + .35, t1 = Math.max(t0 + .5, T.hit - .45);
  if (it.label) {
    const sp = document.createElement('span'); sp.className = 'u-label u-text'; sp.style.fontSize = '38px'; tx.appendChild(sp);
    const gs = graphemes(it.label + '?');
    gs.forEach((c, i) => { const e = document.createElement('span'); e.textContent = c; sp.appendChild(e); R7.show(e, t0 + (t1 - t0) * i / gs.length); });
    FITS.push(() => { const w = sp.offsetWidth, mw = Bar.w - 130; if (w > mw) sp.style.fontSize = (38 * mw / w).toFixed(1) + 'px'; });
    const car = document.createElement('i'); car.className = 'u-col-acc'; car.style.cssText = 'display:block;width:5px;height:42px;border-radius:3px;opacity:0'; tx.appendChild(car);
    A(car, [{opacity: 1}, {opacity: 1, offset: .5}, {opacity: 0, offset: .5}, {opacity: 0}], t1, .5, {it: 6, f: 'none'});   // the caret blinks after the last letter
  } else K.skel(tx, 0, Bar.h / 2 - 9, [250], t0);
  /* below: what the search finds */
  const R = {x: 60, y: 132, w: 400};                                    // the rows end before the question mark on their right
  const rin = Math.max(t1 + .05, T.hit - (ST.motion.rise?.d ?? .5) * .85 - .05);   // the results are in place on the key word, in every style's speed
  if (s.answer) {
    const res = R2.card(node(g, R.x, R.y, R.w, 150, 'u-panel')); res.p.style.borderRadius = '28px';
    K.enter(res.o, rin, 'rise');
    const a = K.badge(res.p, s.answer.icon, 84, 75, 96, null, {tone: 'soft'});
    const lit = R7.up(K, res.p, s.answer.icon, 84, 75, 96, Math.max(T.hit, LG.arrive('rise', rin)));
    K.fade(a.o, lit.done, 1, 0);
    if (s.answer.label) R6.wordL(K, res.p, s.answer.label, 152, 52, 40, lit.done - .2, 270); else K.skel(res.p, 152, 52, [220, 150], lit.done - .2);
    R1.ripple(K, res, lit.done + .05);
  } else {
    const opts = s.options?.length === 2 ? s.options : [null, null];
    opts.forEach((o, i) => {
      const r = R2.card(node(g, R.x, R.y + i * 98, R.w, 82, 'u-panel')); r.p.style.borderRadius = '24px';
      K.enter(r.o, rin + i * .12, 'rise');
      if (o) { K.badge(r.p, o.icon, 50, 41, 56, null, {tone: 'main', shape: 'round'}); if (o.label) R6.wordL(K, r.p, o.label, 96, 18, 32, null, 300); else K.skel(r.p, 96, 32, [200]); }
      else { K.badge(r.p, 'circle-help', 50, 41, 56, null, {tone: 'soft', shape: 'round'}); K.skel(r.p, 96, 32, [i ? 170 : 230], null); }
    });
    const q = K.badge(g, 'circle-help', 508, 158, 64, T.hit, {tone: 'acc', shape: 'round'});
    K.punch(q.p, LG.arrive('pop', T.hit));
  }
}, undefined, {ui: true});

/* ================= B07 คำเตือน: thing {icon, label?}, how ('cross' | 'flag'), sign? ================= */
/* 3 · a traffic light: the lower lamp is on while the thing comes closer, then the top lamp turns red on the key word */
R3.both('B07', 'traffic', 'ไฟจราจรเปลี่ยนเป็นสีแดง', (K, s, T, g) => {
  const it = s.thing, H = {x: 84, y: 16, w: 112, h: 300}, cx = H.x + H.w / 2, ly = [58, 150, 242], r = 36;
  /* the housing is a card, so its lamps read on it in every style: off = the skeleton colour, on = accent / red */
  const box = R2.card(node(g, H.x, H.y, H.w, H.h, 'u-panel')); box.p.style.borderRadius = '30px'; K.enter(box.o, T.b[0], 'rise');
  const dot = (y, cls) => { const e = div(`left:${H.w / 2 - r}px;top:${y - r}px;width:${2 * r}px;height:${2 * r}px;border-radius:50%`, box.p); e.className = cls; return e; };
  ly.forEach(y => dot(y, 'u-skel'));
  const lamp = (y, cls, t0, t1) => { const e = dot(y, cls); R7.show(e, t0); if (t1 != null) R7.hide(e, t1); return e; };
  const red = T.hit - .05;
  lamp(ly[2], 'u-col-acc', T.b[0] + .3, T.b[2]);                           // go
  lamp(ly[1], 'u-col-acc', T.b[2], red);                                    // the middle one: get ready
  const glow = div(`left:${cx - 90}px;top:${H.y + ly[0] - 90}px;width:180px;height:180px;border-radius:50%;opacity:0`, g); glow.className = 'u-flash u-decor';
  g.insertBefore(glow, g.firstChild); R7.show(glow, red);
  lamp(ly[0], 'u-neg', red, null);
  /* the thing comes closer while the light is on, and stops when it turns red */
  const P = {x: 404, y: 132}, S = 140;
  const grp = R6.group(g);
  K.fade(grp, T.b[0] + .2, 0, 1, {hold: true});
  A(grp, [{transform: 'translateX(70px)'}, {transform: 'none'}], T.b[0] + .2, red - T.b[0] - .2, {e: 'cubic-bezier(.3,.6,.4,1)', f: 'both'});
  const hero = K.badge(grp, it.icon, P.x, P.y, S, null, {tone: it.tone ?? 'main'});
  if (it.label) R4.word(K, g, it.label, P.x, P.y + S / 2 + 12, 38, red - .3, 240);   // not moving: it waits where the thing stops
  K.shake(hero.p, red + .08);
  const sign = K.badge(g, s.sign ?? (s.how === 'cross' ? 'octagon-alert' : 'triangle-alert'), P.x + 62, P.y - 66, 70, red + .12, {tone: 'neg', shape: 'round'});
  R1.ripple(K, sign, LG.arrive('pop', red + .12), {tone: 'neg'});
});

/* 4 · a fuse: a spark runs along the cord toward the thing, the cord burns away behind it; a warning on arrival */
R3.both('B07', 'fuse', 'ไฟวิ่งตามสายชนวนเข้าหาของ', (K, s, T, g) => {
  const it = s.thing, P = {x: 430, y: 126}, S = 140;
  const d = `M40 300C110 300 100 220 170 230C240 240 230 290 276 250C306 224 300 ${P.y} ${P.x - S / 2 - 6} ${P.y}`;
  const cord = R8.svg(g, `<path class="ln u-thin" pathLength="100" d="${d}" style="stroke-dasharray:100 100"/>`);
  const path = cord.querySelector('path');
  R7.show(cord, T.b[0]); A(path, [{strokeDashoffset: 100}, {strokeDashoffset: 0}], T.b[0], .5, {e: EASE.smooth, f: 'forwards'});
  const hero = K.badge(g, it.icon, P.x, P.y, S, T.b[0] + .1, {tone: it.tone ?? 'main'});
  if (it.label) R4.word(K, g, it.label, P.x, P.y + S / 2 + 12, 38, T.b[0] + .25, 200);
  /* the spark runs from the cord's start to the thing; the cord behind it is gone */
  const go = T.b[1], arrive = T.hit - .05;
  A(path, [{strokeDashoffset: 0}, {strokeDashoffset: -100}], go, arrive - go, {f: 'forwards'});
  const pts = R8.along(path, 40);
  const sp = node(g, pts[0].x - 18, pts[0].y - 18, 36, 36, 'u-badge u-acc u-round'); sp.p.style.borderRadius = '50%';
  const fl = div('left:-22px;top:-22px;width:80px;height:80px;border-radius:50%', sp.m); fl.className = 'u-flash u-decor'; sp.m.insertBefore(fl, sp.p);
  R7.show(sp.o, go); R8.travel(sp.m, pts, go, arrive - go);
  A(sp.p, [{transform: 'scale(1)'}, {transform: 'scale(.7)'}, {transform: 'scale(1)'}], go, .2, {it: Math.max(1, Math.round((arrive - go) / .2)), f: 'none'});
  K.fade(sp.o, arrive + .05, 1, 0);
  R7.hide(cord, arrive);
  K.shake(hero.p, arrive + .05); R1.ripple(K, hero, arrive + .05, {tone: 'neg'});
  K.badge(g, s.sign ?? (s.how === 'cross' ? 'octagon-alert' : 'triangle-alert'), P.x + 62, P.y - 66, 70, arrive + .1, {tone: 'neg', shape: 'round'});
});

/* ================= B03 เปรียบเทียบ: a, b {icon, label?, v?}, win, how?, mode ================= */
/* 7 · two lanes: a and b run toward the finish line; the winner gets there on the key word, the loser is left behind */
R3.both('B03', 'race', 'สองลู่วิ่งแข่งกัน', (K, s, T, g) => {
  const win = s.win ?? 'b', lose = win === 'a' ? 'b' : 'a', F = 506, lanes = {a: 92, b: 226}, S = 84, x0 = 196, h = 104;
  const tr = R8.svg(g, Object.values(lanes).map(y => `<rect style="fill:var(--tr)" x="160" y="${y - h / 2}" width="${F - 160}" height="${h}" rx="${h / 2}"/>`).join(''));
  tr.classList.add('u-decor'); K.enter(tr, T.b[0], 'rise');
  const fin = R8.svg(g, `<path class="ln u-thin u-dash" d="M${F} ${lanes.a - h / 2 - 10}V${lanes.b + h / 2 + 10}"/>`);
  K.enter(fin, T.b[0] + .15, 'pop');
  const run = {};
  ['a', 'b'].forEach((k, i) => {
    const it = s[k], y = lanes[k];
    if (it.label) R6.wordL(K, g, it.label, 14, y - 22, 34, T.b[0] + .2 + i * .1, 140);
    const r = K.badge(g, it.icon, x0, y, S, T.b[0] + .25 + i * .1, {tone: 'main', shape: 'round'});
    run[k] = r;
  });
  const go = T.b[1], endW = F - S / 2 - 8, endL = x0 + (endW - x0) * .55;
  A(run[win].m, [{transform: 'none'}, {transform: `translateX(${endW - x0}px)`}], go, T.hit - go, {e: 'cubic-bezier(.4,0,.3,1)', f: 'forwards'});
  A(run[lose].m, [{transform: 'none'}, {transform: `translateX(${endL - x0}px)`}], go, T.hit - go + .2, {e: 'cubic-bezier(.4,0,.4,1)', f: 'forwards'});
  const lit = R7.up(K, g, s[win].icon, endW, lanes[win], S, T.hit, 'round'); K.fade(run[win].o, lit.done, 1, 0);
  R1.ripple(K, lit, lit.done);
  K.fade(run[lose].o, T.hit + .3, 1, .45);
  if (s.how === 'cross') K.mark(g, 'cross', endL, lanes[lose], 70, T.hit + .35);
  else K.sat(g, s.how === 'check' ? 'check' : 'flag', F + 10, lanes[win] - h / 2 - 20, 54, lit.done + .1, {tone: 'ok', k: .5});
}, s => s.mode !== 'change');            // lego_v2.js (V2) loads after this file

/* 8 · one picture, before and after: a bar slides across it and what is behind the bar is the after */
R3.both('B03', 'slider', 'ภาพก่อนกับหลัง มีแถบเลื่อนตรงกลาง', (K, s, T, g) => {
  const Fr = {x: 70, y: 16, w: 440, h: 300}, a = s.a, b = s.b;
  const frame = R2.card(node(g, Fr.x, Fr.y, Fr.w, Fr.h, 'u-panel')); frame.p.style.borderRadius = '30px'; K.enter(frame.o, T.b[0], 'rise');
  /* the two sides are the same size and place; each is cut at the bar, so neither shows through the other */
  const side = (it, tone) => {
    const e = div(`left:0;top:0;width:${Fr.w}px;height:${Fr.h}px`, frame.p);
    K.badge(e, it.icon, Fr.w / 2, 124, 150, null, {tone});
    if (it.label) R4.word(K, e, it.label, Fr.w / 2, 214, 44, null, Fr.w - 60);
    return e;
  };
  const before = side(a, 'soft'), after = side(b, 'acc');
  const p0 = .9, p1 = .06, go = T.b[1] + .1, d = T.hit - go, ez = 'cubic-bezier(.55,0,.3,1)';
  const pc = p => `${(p * 100).toFixed(1)}%`;
  A(before, [{clipPath: `inset(-20px ${pc(1 - p0)} -20px -20px)`}, {clipPath: `inset(-20px ${pc(1 - p1)} -20px -20px)`}], go, d, {e: ez});
  A(after, [{clipPath: `inset(-20px -20px -20px ${pc(p0)})`}, {clipPath: `inset(-20px -20px -20px ${pc(p1)})`}], go, d, {e: ez});
  /* the bar with its knob */
  const bar = node(frame.p, -20, 0, 40, Fr.h, '', `<svg width="40" height="${Fr.h}"><path class="ln" d="M20 10V${Fr.h - 10}"/></svg>`);
  const knob = node(bar.p, -14, Fr.h / 2 - 34, 68, 68, 'u-knob', ICO('chevrons-left-right', 34, 'u-ico u-knob-ico')); knob.p.style.borderRadius = '50%';
  K.enter(bar.o, T.b[0] + .3, 'pop');
  A(bar.m, [{transform: `translateX(${Fr.w * p0}px)`}, {transform: `translateX(${Fr.w * p1}px)`}], go, d, {e: ez, f: 'both'});
  K.fade(bar.o, T.hit + .1, 1, 0);
  R1.ripple(K, frame, T.hit + .1);
}, s => s.mode === 'change');

/* ================= B05 ถูกกับผิด: wrong {icon, label?}, right {icon, label?} ================= */
/* 3 · two game-show podiums: the wrong one's buzzer flashes red with a cross, then the right one's lights up */
R3.both('B05', 'buzzer', 'ปุ่มเกมโชว์ ผิดไฟแดง ถูกไฟสว่าง', (K, s, T, g) => {
  const xs = [160, 420], Y = 92, S = 104;
  const podium = (x, it, t) => {
    const st = R8.svg(g, `<path class="sd" d="M${x - 70} 330L${x - 56} 262H${x + 56}L${x + 70} 330Z"/>`); K.enter(st, t, 'rise');
    const dome = node(g, x - 46, 222, 92, 46, '', `<svg width="92" height="46"><path style="fill:var(--tr)" d="M0 46A46 46 0 0 1 92 46Z"/></svg>`);
    K.enter(dome.o, t + .1, 'pop');
    const b = K.badge(g, it.icon, x, Y, S, t + .15, {tone: 'main'});
    if (it.label) R4.word(K, g, it.label, x, Y + S / 2 + 10, 36, t + .25, 230);
    return {dome, b};
  };
  const W = podium(xs[0], s.wrong, T.b[0]), R = podium(xs[1], s.right, T.b[0] + .15);
  const hit = (P, cls, t) => {
    A(P.dome.m, [{transform: 'none'}, {transform: 'translateY(8px) scaleY(.8)', offset: .35}, {transform: 'none'}], t, .3, {e: 'ease-out', f: 'none'});
    const lit = div('left:0;top:0;width:92px;height:46px', P.dome.p, `<svg width="92" height="46"><path class="${cls}" d="M0 46A46 46 0 0 1 92 46Z"/></svg>`); R7.show(lit, t + .05);
    return lit;
  };
  const tw = T.b[2] - .1;
  hit(W, 'u-lamp', tw);
  const fl = div(`left:${xs[0] - 110}px;top:${Y - 110}px;width:220px;height:220px;border-radius:50%;opacity:0`, g); fl.className = 'u-flash u-decor';
  g.insertBefore(fl, g.firstChild); A(fl, [{opacity: 0}, {opacity: 1}, {opacity: 0}], tw + .05, .6, {f: 'none'});
  K.mark(g, 'cross', xs[0], Y, 104, tw + .1); K.shake(W.b.p, tw + .1);
  K.fade(W.b.o, T.hit - .1, 1, .5);
  hit(R, 'ac', T.hit - .12);
  const lit = R7.up(K, g, s.right.icon, xs[1], Y, S, T.hit); K.fade(R.b.o, lit.done, 1, 0);
  R1.ripple(K, lit, lit.done);
  K.mark(g, 'check', xs[1] + 64, Y - 62, 56, lit.done + .1);
});

/* 4 · on a paper: the wrong thing is rubbed out by an eraser, then the right thing is written in its place */
R3.both('B05', 'eraser', 'ยางลบลบคำผิด แล้วเขียนคำถูกแทน', (K, s, T, g) => {
  /* everything on the paper is drawn IN the paper, so it takes the paper's colours (in an overlay the paper is a white
     card on the video: words drawn beside it took the video's white and vanished on it) */
  const Pp = {x: 50, y: 26, w: 480, h: 280}, cy = 124;
  const paper = R2.card(node(g, Pp.x, Pp.y, Pp.w, Pp.h, 'u-panel')); paper.p.style.borderRadius = '22px'; K.enter(paper.o, T.b[0], 'rise');
  const lines = div(`left:0;top:0;width:${Pp.w}px;height:${Pp.h}px`, paper.p, `<svg width="${Pp.w}" height="${Pp.h}">${[70, 184, 226].map(y => `<path class="ln u-thin" d="M36 ${y}H${Pp.w - 36}"/>`).join('')}</svg>`);
  lines.classList.add('u-decor'); A(lines, [{opacity: 0}, {opacity: .35}], T.b[0] + .2, .3);
  const row = (it, tone) => {
    const r = div(`left:0;top:0;width:${Pp.w}px;height:${Pp.h}px`, paper.p);
    K.badge(r, it.icon, 90, cy, 96, null, {tone});
    if (it.label) R6.wordL(K, r, it.label, 156, cy - 32, 50, null, 290); else K.skel(r, 156, cy - 9, [200]);
    return r;
  };
  const wrong = row(s.wrong, 'main'); K.enter(wrong, T.b[0] + .2, 'lead');
  /* the eraser rubs over it left and right; what it has passed is gone */
  const e0 = T.b[1], e1 = Math.max(e0 + .5, T.hit - .4), Y = Pp.y + cy;
  const er = node(g, 0, 0, 132, 62, '', `<svg width="132" height="62"><rect class="fl" x="0" y="0" width="132" height="62" rx="12"/><rect class="u-fl-edge" x="0" y="0" width="132" height="62" rx="12"/><rect class="ac" x="0" y="0" width="44" height="62" rx="12"/></svg>`);
  er.o.style.transform = 'rotate(-14deg)';
  const xs = [96, 300, 150, 400, 220, 430], ys = [Y - 56, Y - 40, Y - 30, Y - 46, Y - 20, Y - 34];
  K.fade(er.o, e0 - .15, 0, 1, {hold: true});
  A(er.m, xs.map((x, i) => ({transform: `translate(${x}px,${ys[i]}px)`, offset: i / (xs.length - 1)})), e0 - .15, e1 - e0 + .15, {e: 'ease-in-out', f: 'both'});
  A(wrong, [{clipPath: 'inset(-40px -40px -40px 0px)'}, {clipPath: 'inset(-40px -40px -40px 0px)', offset: .25}, {clipPath: 'inset(-40px -40px -40px 470px)'}], e0, e1 - e0, {f: 'both'});
  K.move(er.m, e1, `translate(${xs.at(-1)}px,${ys.at(-1)}px)`, `translate(${xs.at(-1) + 40}px,-40px)`); K.fade(er.o, e1 + .05, 1, 0);
  /* the right thing is written where the wrong one was */
  const right = row(s.right, 'acc'); R7.write(right, e1 + .1, Math.max(.3, T.hit - e1));
  K.mark(paper.p, 'check', Pp.w - 44, 40, 56, T.hit + .2);
});

/* ================= B11 คำพูด / แชต / รีวิว: quote?, kind, mood?, react?, gone? ================= */
/* 6 · a live stream: comments keep rising up the screen; the quoted one comes in highlighted and reactions float up */
R3.both('B11', 'live', 'คอมเมนต์ไหลขึ้นแบบไลฟ์สด', (K, s, T, g) => {
  const Sc = {x: 50, y: 8, w: 410, h: 324}, H = 228, rowH = 74, top = 82;
  const scr = R2.card(node(g, Sc.x, Sc.y, Sc.w, Sc.h, 'u-panel')); scr.p.style.borderRadius = '30px'; K.enter(scr.o, T.b[0], 'rise');
  const dot = div('left:30px;top:30px;width:22px;height:22px;border-radius:50%', scr.p); dot.className = 'u-neg';
  A(dot, [{opacity: 1}, {opacity: .25}, {opacity: 1}], T.b[0] + .2, .8, {it: 6, f: 'none'});
  const cam = div('left:66px;top:21px;width:40px;height:40px', scr.p, ICO('video', 40)); cam.className = 'u-label';
  /* the comments: a column below the top bar; each new one comes in at the bottom and pushes the others up */
  const view = div(`left:0;top:${top}px;width:${Sc.w}px;height:${H}px;overflow:hidden`, scr.p);
  const list = div(`left:0;top:0;width:${Sc.w}px;height:${H}px`, view);
  const n = 4, ts = LG.spread(T.b[0] + .3, T.b[2] + .15, n).concat(T.hit - .3);
  ts.forEach((t, k) => {
    const y = H + k * rowH, quoted = k === n;
    const av = K.badge(list, 'user', 40, y + rowH / 2, 46, null, {tone: quoted ? 'acc' : 'soft', shape: 'round'});
    if (quoted) {
      const b = node(list, 76, y + 8, Sc.w - 100, rowH - 16, 'u-badge u-acc'); b.p.style.borderRadius = '22px';
      if (s.quote) R4.word(K, b.p, s.quote, (Sc.w - 100) / 2, 6, 36, null, Sc.w - 140).className = 'u-label u-bubble-text'; else K.skel(b.p, 24, 20, [200], null, {h: 16});
    } else K.skel(list, 76, y + rowH / 2 - 8, [[230, 170, 260, 200][k]], null, {h: 16});
    K.move(list, t, `translateY(${-k * rowH}px)`, `translateY(${-(k + 1) * rowH}px)`);
    void av;
  });
  /* reactions float up beside the screen once the quoted one is in */
  const ic = s.react ?? (s.mood === 'bad' ? 'frown' : 'heart'), t0 = LG.arrive('move', T.hit - .3);
  [0, 1, 2, 3].forEach(i => {
    const x = 508 + [0, -12, 10, -4][i], r = K.badge(g, ic, x, 300, 50, null, {tone: i % 2 ? 'main' : 'acc', shape: 'round'}); r.o.classList.add('u-decor'); r.o.style.opacity = 0;
    A(r.o, [{opacity: 0, transform: 'translateY(0) scale(.6)'}, {opacity: 1, transform: 'translateY(-60px) scale(1)', offset: .2}, {opacity: 1, offset: .7}, {opacity: 0, transform: 'translateY(-250px) scale(.9)'}], t0 + i * .22, 1.3, {e: 'ease-out', f: 'none'});
  });
});

/* 7 · a pin board: plain notes are pinned one by one, then the quoted note is slapped on and pinned on the key word */
R3.both('B11', 'board', 'กระดาษโน้ตแปะบนบอร์ดทีละแผ่น', (K, s, T, g) => {
  const Bd = {x: 30, y: 10, w: 500, h: 320};                              // everything is drawn IN the board (its colours win inside)
  const bd = R2.card(node(g, Bd.x, Bd.y, Bd.w, Bd.h, 'u-panel')); bd.p.style.borderRadius = '22px'; K.enter(bd.o, T.b[0], 'rise');
  const pin = (x, y, t, cls = 'ac') => { const p = node(bd.p, x - 12, y - 12, 24, 24, '', `<svg width="24" height="24"><circle class="${cls}" cx="12" cy="12" r="11"/></svg>`); K.enter(p.o, t, 'pop'); return p; };
  /* plain notes on the left (never under the quoted one) */
  [[34, 12, -4], [50, 176, 3]].forEach(([x, y, r], i) => {
    const t = T.b[1] - .25 + i * .3;
    const nt = node(bd.p, x, y, 150, 130, '', `<svg width="150" height="130"><rect class="fl" x="0" y="0" width="150" height="130" rx="8"/><rect class="u-fl-edge" x="0" y="0" width="150" height="130" rx="8"/></svg>`);
    nt.o.style.transform = `rotate(${r}deg)`; K.enter(nt.p, t, 'pop');
    K.skel(nt.p, 22, 46, [100, 70], t + .1, {h: 12, gap: 16});
    pin(x + 75, y + 10, t + .15);
  });
  /* the quoted note */
  const Q = {x: 232, y: 44, w: 240, h: 200};
  const q = node(bd.p, Q.x, Q.y, Q.w, Q.h, 'u-badge u-acc'); q.p.style.borderRadius = '10px'; q.o.style.transform = 'rotate(-3deg)';
  if (s.quote) R4.word(K, q.p, s.quote, Q.w / 2, Q.h / 2 - 26, 40, null, Q.w - 36).className = 'u-label u-bubble-text'; else K.skel(q.p, 36, 70, [160, 110], null, {h: 16});
  const go = T.hit - (ST.motion.snap?.d ?? .5) * .85, land = LG.arrive('snap', go);
  K.fade(q.o, go, 0, 1, {hold: true}); K.move(q.m, go, 'translate(70px,-60px) scale(1.25)', 'none', {hold: true, kind: 'snap'});
  pin(Q.x + Q.w / 2, Q.y + 8, land, 'sd');
  K.punch(bd.p, land); R1.ripple(K, q, land + .05);
  const ic = s.react ?? (s.mood === 'bad' ? 'frown' : s.mood === 'good' ? 'heart' : null);
  if (ic) K.sat(bd.p, ic, Q.x + Q.w - 6, Q.y + Q.h - 4, 58, land + .2, {tone: 'main', shape: 'round', k: .6});
});

/* ================= B17 ไล่รายการ: items [2–4 {icon, label?}], label? ================= */
/* 5 · a shelf with one cubby per thing: the things drop into their cubbies one by one, the last on the key word */
R3.both('B17', 'shelf', 'ชั้นวางของ ของวางทีละช่อง', (K, s, T, g) => {
  const its = s.items.slice(0, 4), n = its.length, cw = n === 4 ? 120 : 130, x0 = 300 - n * cw / 2, Y0 = 70, Y1 = 250;
  const xs = its.map((_, i) => x0 + cw * (i + .5));
  const inner = [...Array(n - 1)].map((_, i) => `M${x0 + cw * (i + 1)} ${Y0}V${Y1}`).join('');
  const sh = R8.svg(g, `<path class="ln" d="M${x0} ${Y1}V${Y0}H${x0 + n * cw}V${Y1}"/><path class="ln u-thin" d="${inner}"/><rect class="sd" x="${x0 - 14}" y="${Y1}" width="${n * cw + 28}" height="20" rx="6"/>`);
  R7.show(sh, T.b[0]); sh.querySelectorAll('path').forEach((p, i) => K.draw(p, T.b[0] + i * .1, .45));
  if (s.label) K.chipC(g, s.label, 300, 30, T.b[0] + .2, {tone: 'acc', size: 30});
  const ts = LG.spread(T.b[1] - .2, T.hit - (ST.motion.snap?.d ?? .5) * .85, n), S = Math.min(84, cw - 36);
  const bs = its.map((it, i) => {
    /* seen only inside the shelf (it drops in from its top edge) */
    const cub = div(`left:0;top:0;width:600px;height:340px;clip-path:inset(${Y0 + 3}px 0 0 0)`, g);
    const grp = R6.group(cub);
    const b = K.badge(grp, it.icon, xs[i], 142, S, null, {tone: it.tone ?? 'main'});
    if (it.label) R4.word(K, grp, it.label, xs[i], 190, 28, null, cw - 14);
    R7.show(grp, ts[i]); K.move(grp, ts[i], 'translateY(-170px)', 'none', {hold: true, kind: 'snap'});
    return b;
  });
  const land = LG.arrive('snap', ts[n - 1]);
  bs.forEach((b, i) => K.punch(b.p, land + .05 + i * .08));
});

/* 6 · a hand of cards fans open from the left: each card is one thing, the fan is fully open on the key word */
R3.both('B17', 'fan', 'ไพ่คลี่ออกเป็นรูปพัด', (K, s, T, g) => {
  const its = s.items.slice(0, 4), n = its.length, W = 100, H = 150, R = 340, C = {x: 300, y: 152}, step = 19;
  const ang = its.map((_, i) => (i - (n - 1) / 2) * step);
  const open = Math.max(T.b[1], T.hit - .7), d = T.hit - open;
  const cards = its.map((it, i) => {
    const c = R2.card(node(g, C.x - W / 2, C.y - H / 2, W, H, 'u-panel')); c.p.style.borderRadius = '16px';
    c.m.style.transformOrigin = `${W / 2}px ${H / 2 + R}px`;                  // they turn about one point below the hand
    K.badge(c.p, it.icon, W / 2, 56, 62, null, {tone: it.tone ?? 'main'});
    if (it.label) R4.word(K, c.p, it.label, W / 2, 98, 26, null, W - 14);
    /* all closed on the first one's place; only the top card shows until the fan opens */
    if (i === n - 1) K.enter(c.o, T.b[0], 'rise'); else R7.show(c.o, open);
    A(c.m, [{transform: `rotate(${ang[0]}deg)`}, {transform: `rotate(${ang[i]}deg)`}], open, d, {e: 'cubic-bezier(.3,.7,.3,1)', f: 'both'});
    return c;
  });
  if (s.label) K.chipC(g, s.label, 300, 24, T.hit + .05, {tone: 'acc', size: 30});
  cards.forEach((c, i) => K.punch(c.p, T.hit + .05 + i * .07));
});

/* ================= B18 เล่าเหตุการณ์: what {icon, label?}, who? {icon, label?}, when? ================= */
/* 5 · a book opens and its pages turn; the last turn lands on the page of what happened (who and when on the left page) */
R3.both('B18', 'book', 'หนังสือเปิด หน้ากระดาษพลิกไปถึงเหตุการณ์', (K, s, T, g) => {
  const Bk = {x: 70, y: 34, w: 230, h: 268}, mid = Bk.x + Bk.w;
  /* the pages are cards, so what is written on them takes the card's colours (in an overlay a page drawn as a plain
     light shape on the video got the video's white words) */
  const page = (x, origin) => {
    const p = R2.card(node(g, x, Bk.y, Bk.w, Bk.h, 'u-panel')); p.p.style.borderRadius = origin.startsWith('0') ? '4px 14px 14px 4px' : '14px 4px 4px 14px';
    p.m.style.transformOrigin = origin; return p;
  };
  const skel = (parent, k) => K.skel(parent, 34, 60 + (k % 2) * 20, [[150, 110, 160, 90], [130, 160, 100, 140]][k % 2], null, {h: 12, gap: 26});
  /* what each page shows from when (content changes only under a page that is turning) */
  const L = page(Bk.x, '100% 50%'), Rp = page(mid, '0 50%');
  const cover = node(g, mid, Bk.y, Bk.w, Bk.h, '', `<svg width="${Bk.w}" height="${Bk.h}"><rect class="sd" x="0" y="0" width="${Bk.w}" height="${Bk.h}" rx="12"/></svg>`);
  cover.m.style.transformOrigin = '0 50%'; K.enter(cover.o, T.b[0], 'rise');
  const t1 = T.b[1], t2 = T.b[2], t3 = Math.max(T.b[2] + .45, T.hit - .45), half = .2;
  /* opening: the cover turns to the left, the left page unfolds */
  R7.show(Rp.o, t1); A(cover.m, [{transform: 'scaleX(1)'}, {transform: 'scaleX(0)'}], t1, half, {e: 'ease-in', f: 'forwards'});
  R7.show(L.o, t1 + half); A(L.m, [{transform: 'scaleX(0)'}, {transform: 'none'}], t1 + half, half, {e: 'ease-out', f: 'both'});
  const R0 = div('left:0;top:0;width:100%;height:100%', Rp.p); skel(R0, 0); R7.hide(R0, t2);
  const L0 = div('left:0;top:0;width:100%;height:100%', L.p); skel(L0, 1); R7.hide(L0, t2 + half);
  /* a page turns: a copy of the right page folds to the spine, then unfolds on the left */
  const turn = (t, k) => {
    const a = page(mid, '0 50%'); const fa = div('left:0;top:0;width:100%;height:100%', a.p); skel(fa, k);
    R7.show(a.o, t); A(a.m, [{transform: 'scaleX(1)'}, {transform: 'scaleX(0)'}], t, half, {e: 'ease-in', f: 'forwards'});
    const b = page(Bk.x, '100% 50%'); const fb = div('left:0;top:0;width:100%;height:100%', b.p); skel(fb, k + 1);
    R7.show(b.o, t + half); A(b.m, [{transform: 'scaleX(0)'}, {transform: 'none'}], t + half, half, {e: 'ease-out', f: 'both'}); R7.hide(b.o, t + 2 * half);
  };
  turn(t2, 0);
  const R1c = div('left:0;top:0;width:100%;height:100%', Rp.p); skel(R1c, 1); R7.show(R1c, t2); R7.hide(R1c, t3);
  const L1 = div('left:0;top:0;width:100%;height:100%', L.p); skel(L1, 1); R7.show(L1, t2 + 2 * half); R7.hide(L1, t3 + 2 * half);
  turn(t3, 1);
  /* the page of what happened */
  const RF = div('left:0;top:0;width:100%;height:100%', Rp.p); R7.show(RF, t3);
  const w0 = K.badge(RF, s.what.icon, Bk.w / 2, 116, 110, null, {tone: 'soft'});
  if (s.what.label) R4.word(K, RF, s.what.label, Bk.w / 2, 186, 34, null, Bk.w - 30);
  const lit = R7.up(K, RF, s.what.icon, Bk.w / 2, 116, 110, T.hit); K.fade(w0.o, lit.done, 1, 0);
  R1.ripple(K, Rp, lit.done + .05);
  const LF = div('left:0;top:0;width:100%;height:100%', L.p); R7.show(LF, t3 + 2 * half);
  if (s.when) R4.word(K, LF, s.when, Bk.w / 2, 30, 32, null, Bk.w - 30);
  if (s.who) { K.badge(LF, s.who.icon, Bk.w / 2, s.when ? 140 : 116, 92, null, {tone: s.who.tone ?? 'main', shape: 'round'}); if (s.who.label) R4.word(K, LF, s.who.label, Bk.w / 2, s.when ? 198 : 176, 32, null, Bk.w - 30); }
  else if (!s.when) skel(LF, 0);
  else K.skel(LF, 44, 110, [140, 100, 120], null, {h: 12, gap: 26});
  const spine = div(`left:0;top:0;width:10px;height:${Bk.h}px`, Rp.p, `<svg width="10" height="${Bk.h}"><path class="ln u-thin" d="M1 8V${Bk.h - 8}"/></svg>`); spine.classList.add('u-decor');
});

/* 6 · a strip of film moves frame by frame; the frame of what happened stops in the middle on the key word */
R3.both('B18', 'film', 'ม้วนฟิล์มเลื่อนทีละเฟรม', (K, s, T, g) => {
  const V = {x: 30, y: 62, w: 520, h: 206}, cx = V.x + V.w / 2, fw = 150, fh = 112, gap = 34, step = fw + gap;
  const view = div(`left:${V.x}px;top:${V.y}px;width:${V.w}px;height:${V.h}px;overflow:hidden;border-radius:18px`, g);
  K.enter(view, T.b[0], 'rise');
  const N = 5, L = N * step + 400, strip = node(view, 0, 0, L, V.h, '');   // a plain frame before the first one: no bare strip on the left
  const fx = k => 30 + k * step, SH = V.h - 24, fy = (V.h - fh) / 2 - 12;  // a frame's left edge on the strip; frames' top in the strip
  const rr = (x, y, w, h, r) => `M${x + r} ${y}H${x + w - r}Q${x + w} ${y} ${x + w} ${y + r}V${y + h - r}Q${x + w} ${y + h} ${x + w - r} ${y + h}H${x + r}Q${x} ${y + h} ${x} ${y + h - r}V${y + r}Q${x} ${y} ${x + r} ${y}Z`;
  const cut = [...Array(Math.ceil(L / 34))].flatMap((_, i) => [rr(i * 34 + 8, 10, 18, 16, 4), rr(i * 34 + 8, SH - 26, 18, 16, 4)])
    .concat([...Array(N)].map((_, k) => rr(fx(k), fy, fw, fh, 10))).join('');
  div(`left:0;top:12px;width:${L}px;height:${SH}px`, strip.p, `<svg width="${L}" height="${SH}"><path class="sd" fill-rule="evenodd" d="${rr(0, 0, L, SH, 8)}${cut}"/></svg>`);
  const frames = [...Array(N)].map((_, k) => { const f = node(strip.p, fx(k), (V.h - fh) / 2, fw, fh, ''); f.p.style.borderRadius = '10px'; return f; });
  const sk = (k, w) => K.skel(frames[k].p, 30, 34, w, null, {h: 12, gap: 18});
  sk(0, [70, 100]);
  if (s.who) K.badge(frames[1].p, s.who.icon, fw / 2, fh / 2, 78, null, {tone: s.who.tone ?? 'main', shape: 'round'}); else sk(1, [90, 60]);
  sk(2, [80, 100]); sk(4, [100, 70]);
  const w0 = K.badge(frames[3].p, s.what.icon, fw / 2, fh / 2, 84, null, {tone: 'soft'});
  /* frame k in the middle of the window = strip moved so that its centre is at the window's centre */
  const at = k => `translateX(${(V.w / 2 - (fx(k) + fw / 2)).toFixed(1)}px)`;
  const snapD = (ST.motion.snap?.d ?? .5) * .85, m1 = T.b[2] - .2, m2 = T.hit - snapD;
  K.move(strip.m, T.b[0], at(1), at(1), {hold: true});
  K.move(strip.m, m1, at(1), at(2), {kind: 'snap'});
  K.move(strip.m, m2, at(2), at(3), {kind: 'snap'});
  const lit = R7.up(K, frames[3].p, s.what.icon, fw / 2, fh / 2, 84, T.hit); K.fade(w0.o, lit.done, 1, 0);
  R1.ripple(K, frames[3], lit.done, {grow: 18});
  if (s.when) K.chipC(g, s.when, cx, 30, T.b[0] + .2, {tone: 'acc', size: 30});
  if (s.who?.label) { const wl = R4.word(K, g, s.who.label, cx, V.y + V.h + 8, 34, T.b[0] + .3, 360); K.fade(wl, m1, 1, 0); }
  if (s.what.label) R4.word(K, g, s.what.label, cx, V.y + V.h + 8, 38, lit.done, 400);
});

/* ================= B19 ความรู้สึก: feel {icon, label?}, who? {icon, label?}, mood? ================= */
/* 5 · a heart beats (good) or cracks and breaks in two (bad) */
R3.both('B19', 'heart', 'หัวใจเต้นตุบ ๆ หรือร้าวแตก', (K, s, T, g) => {
  const bad = s.mood === 'bad', cx = s.who ? 384 : 300, Hb = {x: cx - 100, y: 26};
  if (s.who) {
    K.badge(g, s.who.icon, 116, 140, 100, T.b[0], {tone: s.who.tone ?? 'main', shape: 'round'});
    if (s.who.label) R4.word(K, g, s.who.label, 116, 200, 32, T.b[0] + .15, 190);
  }
  const hg = div(`left:${Hb.x}px;top:${Hb.y}px;width:200px;height:180px`, g);
  hg.style.transformOrigin = '100px 100px';
  K.enter(hg, T.b[0] + .1, 'pop');
  const half = poly => { const e = div(`left:0;top:0;width:200px;height:180px;clip-path:polygon(${poly})`, hg, `<svg width="200" height="180"><path class="${bad ? 'u-lamp' : 'ac'}" d="${R8.HEART}"/></svg>`); e.style.transformOrigin = '100px 170px'; return e; };
  const zig = [[100, 32], [86, 72], [112, 102], [92, 136], [100, 176]];
  const P = pts => pts.map(([x, y]) => `${x}px ${y}px`).join(',');
  const left = half(P([[-20, -20], [100, -20], ...zig, [100, 200], [-20, 200]]));
  const right = half(P([[100, -20], [220, -20], [220, 200], [100, 200], ...[...zig].reverse()]));
  if (s.feel.label) R4.word(K, g, s.feel.label, cx, Hb.y + 190, 38, T.b[0] + .3, 260);
  const beat = (t, k) => A(hg, [{transform: 'scale(1)'}, {transform: `scale(${1 + .08 * k})`, offset: .2}, {transform: 'scale(1)', offset: .45}, {transform: `scale(${1 + .05 * k})`, offset: .62}, {transform: 'scale(1)'}], t, .6, {e: 'ease-out', f: 'none'});
  if (!bad) {
    beat(T.b[1], 1); beat(T.b[2], 1.3); beat(T.hit - .05, 2.2);
    R8.wave(K, g, R8.HEART, Hb.x, Hb.y, 200, 180, T.hit + .05);
    R8.wave(K, g, R8.HEART, Hb.x, Hb.y, 200, 180, T.hit + .35);
  } else {
    beat(T.b[1], .8);
    const crack = R8.svg(g, `<path class="ln u-thin" d="M${zig.map(([x, y]) => `${Hb.x + x} ${Hb.y + y}`).join('L')}"/>`);
    R7.show(crack, T.b[2]); K.draw(crack.querySelector('path'), T.b[2], .35); R7.hide(crack, T.hit);
    K.shake(hg, T.b[2] + .35);
    K.move(left, T.hit, 'none', 'translate(-18px,8px) rotate(-9deg)'); K.move(right, T.hit, 'none', 'translate(18px,8px) rotate(9deg)');
  }
  const ic = s.feel.icon && !['heart', 'heart-crack'].includes(s.feel.icon) ? s.feel.icon : null;
  if (ic) K.sat(g, ic, cx + 112, 40, 60, T.hit + .3, {tone: 'main', shape: 'round', k: .6});
});

/* 6 · the sky over the person: a cloud drifts off and the sun comes out (good) or the cloud darkens and it rains (bad) */
R3.both('B19', 'sky', 'ท้องฟ้าเหนือหัวคน แดดออกหรือเมฆฝน', (K, s, T, g) => {
  const bad = s.mood === 'bad', P = {x: 196, y: 250}, Cl = {x: 96, y: 52};
  const who = K.badge(g, s.who?.icon ?? 'user', P.x, P.y, 108, T.b[0], {tone: s.who?.tone ?? 'main', shape: 'round'});
  if (s.feel.label) R6.wordL(K, g, s.feel.label, P.x + 78, P.y - 26, 42, T.b[0] + .2, 260);
  else if (s.who?.label) R6.wordL(K, g, s.who.label, P.x + 78, P.y - 22, 34, T.b[0] + .2, 260);
  /* the sun waits behind the cloud */
  const sun = bad ? null : R7.plain(g, Cl.x + 112, Cl.y - 26, 92, 92, 'acc', '50%');
  if (sun) { sun.o.classList.add('u-decor'); K.enter(sun.o, T.b[0] + .2, 'pop'); }
  const cloud = (cls, edge) => { const e = div(`left:${Cl.x}px;top:${Cl.y}px;width:200px;height:96px`, g, `<svg width="200" height="96"><path class="${cls}" d="${R8.CLOUD}"/>${edge ? `<path class="u-fl-edge" d="${R8.CLOUD}"/>` : ''}</svg>`); return e; };
  const c1 = cloud('fl', true); K.enter(c1, T.b[0] + .3, 'pop');
  K.move(c1, T.b[1], 'none', 'translateX(-14px)');
  if (!bad) {
    const go = T.hit - .45;
    A(c1, [{transform: 'translateX(-14px)', opacity: 1}, {transform: 'translateX(-150px)', opacity: 0}], go, .55, {e: 'ease-in-out', f: 'forwards'});
    K.punch(sun.p, T.hit); R1.ripple(K, sun, T.hit + .05);
    R6.burst(K, g, Cl.x + 158, Cl.y + 20, 46, T.hit + .05, 10);
  } else {
    c1.style.transformOrigin = '100px 90px';
    A(c1, [{transform: 'translateX(-14px)'}, {transform: 'translate(0px,10px) scale(1.14)'}], T.b[2], .5, {e: EASE.smooth, f: 'forwards'});   // over the head, heavier
    const xs = [126, 158, 190, 222, 254];
    xs.forEach((x, i) => {
      const r = R8.svg(g, `<path class="u-acc-line" style="stroke-width:6px" d="M${x} ${Cl.y + 100}l-6 22"/>`); r.classList.add('u-decor'); r.style.opacity = 0;
      A(r, [{opacity: 0, transform: 'translateY(0)'}, {opacity: 1, transform: 'translateY(14px)', offset: .3}, {opacity: 0, transform: 'translateY(52px)'}], T.hit - .1 + i * .07, .55, {it: 4, f: 'none'});
    });
    K.shake(who.p, T.hit + .2);
  }
  const ic = s.feel.icon;
  if (ic) K.sat(g, ic, P.x + 52, P.y - 56, 52, T.hit + .35, {tone: bad ? 'main' : 'acc', shape: 'round', k: .6});
});

/* ================= B10 คน / กลุ่มเป้าหมาย: who? {icon}, label?, tags? ================= */
/* 5 · a person; a name sticker flies onto the chest and the group's name is written on it */
R3.both('B10', 'tag', 'ป้ายชื่อแปะที่อกคน', (K, s, T, g) => {
  const head = K.badge(g, s.who?.icon ?? 'user', 300, 86, 104, T.b[0], {tone: 'main', shape: 'round'});
  const body = R8.svg(g, `<path class="sd" d="M150 340C150 232 196 156 300 152C404 156 450 232 450 340Z"/>`); K.enter(body, T.b[0] + .1, 'rise');
  void head;
  const Tg = {x: 196, y: 198, w: 208, h: 110};
  const tag = R2.card(node(g, Tg.x, Tg.y, Tg.w, Tg.h, 'u-panel')); tag.p.style.borderRadius = '14px'; tag.o.style.transform = 'rotate(-3deg)';
  const band = div(`left:0;top:0;width:${Tg.w}px;height:30px;border-radius:14px 14px 0 0`, tag.p); band.className = 'u-col-acc';
  const go = T.hit - (ST.motion.snap?.d ?? .5) * .85, land = LG.arrive('snap', go);
  K.fade(tag.o, go, 0, 1, {hold: true}); K.move(tag.m, go, 'translate(190px,-170px) rotate(26deg)', 'none', {hold: true, kind: 'snap'});
  if (s.label) { const w = R4.word(K, tag.p, s.label, Tg.w / 2, 42, 36, null, Tg.w - 24); R7.write(w, land, .4); }
  else K.skel(tag.p, 34, 52, [140], land, {h: 14});
  K.punch(tag.p, land); R1.ripple(K, tag, land + .05);
  (s.tags ?? []).slice(0, 2).forEach((w, i) => K.chip(g, w, 24, 32 + i * 62, land + .25 + i * .12, {tone: 'acc', size: 28}));
});

/* 6 · a horseshoe magnet pulls the right people out of a crowd; they line up at its mouth and light up */
R3.both('B10', 'magnet', 'แม่เหล็กดูดคนกลุ่มที่ใช่เข้ามาหา', (K, s, T, g) => {
  const icon = s.who?.icon ?? 'user', My = 196, S = 54;
  const mag = R8.svg(g, `<path class="sd" d="M236 ${My - 90}H130A90 90 0 0 0 130 ${My + 90}H236V${My + 42}H130A42 42 0 0 1 130 ${My - 42}H236Z"/>` +
    `<rect class="ac" x="200" y="${My - 90}" width="36" height="48"/><rect class="ac" x="200" y="${My + 42}" width="36" height="48"/>`);
  K.enter(mag, T.b[0], 'pop');
  if (s.label) R4.word(K, g, s.label, 150, My + 98, 32, T.b[0] + .2, 260);
  const crowd = [[338, 62], [436, 50], [516, 104], [364, 156], [470, 160], [338, 252], [438, 250], [510, 206]], pick = [1, 3, 6];
  const ppl = crowd.map(([x, y], i) => K.badge(g, icon, x, y, S, T.b[0] + .15 + i * .04, {tone: 'main', shape: 'round'}));
  /* the field: arcs from the tips, pulsing toward the crowd */
  const arcs = [0, 1, 2].map(k => `M236 ${My - 66}C${290 + k * 40} ${My - 120 - k * 20} ${290 + k * 40} ${My + 120 + k * 20} 236 ${My + 66}`);
  const fld = R8.svg(g, arcs.map(d => `<path class="u-acc-line u-dash" style="stroke-width:4px" d="${d}"/>`).join('')); fld.classList.add('u-decor');
  A(fld, [{opacity: 0}, {opacity: .9}, {opacity: 0}], T.b[1] + .1, .9, {it: 2, f: 'none'});
  const go = T.hit - .45, slots = [[278, My - 58], [278, My], [278, My + 58]];
  pick.forEach((k, j) => {
    const [x, y] = crowd[k], [tx, ty] = slots[j];
    K.move(ppl[k].m, go + j * .04, 'none', `translate(${tx - x}px,${ty - y}px)`);
    const lit = R7.up(K, g, icon, tx, ty, S, LG.arrive('move', go + j * .04), 'round'); K.fade(ppl[k].o, lit.done, 1, 0);
    if (j === 1) R1.ripple(K, lit, lit.done);
  });
  crowd.forEach((_, i) => { if (!pick.includes(i)) K.fade(ppl[i].o, T.hit, 1, .3); });
  (s.tags ?? []).slice(0, 2).forEach((w, i) => K.chip(g, w, 24, 14 + i * 50, T.hit + .3 + i * .12, {tone: 'acc', size: 26}));
});

/* ================= sentences to try round 8 (not Friend's script; one per variant, plus the other mood / answer) ================= */
SENTENCE('r8.light', {cat: 'B12', name: 'เปลี่ยนรูปปก คนกดดูเพิ่ม', say: ['เปลี่ยนรูปปกนิดเดียว', 'ยอดวิวพุ่งเลย'],
  items: [{icon: 'image', label: 'รูปปก'}, {icon: 'mouse-pointer-click', label: 'คนกดดู'}, {icon: 'trending-up', label: 'ยอดวิว'}]});
SENTENCE('r8.habit', {cat: 'B12', name: 'อ่านทุกวัน ความรู้งอกเงย', say: ['อ่านหนังสือวันละหน้า', 'ปีนึงเก่งขึ้นเยอะ'],
  items: [{icon: 'book-open', label: 'อ่านทุกวัน'}, {icon: 'brain', label: 'ความรู้'}, {icon: 'graduation-cap', label: 'เก่งขึ้น'}], end: {icon: 'trophy'}});
SENTENCE('r8.why', {cat: 'B06', name: 'ทำไมลูกค้าไม่กลับมา', say: ['ทำไมลูกค้า', 'ไม่กลับมาซื้อซ้ำ'], about: {icon: 'shopping-bag', label: 'ลูกค้าเก่า'}});
SENTENCE('r8.how', {cat: 'B06', name: 'ขายออนไลน์เริ่มยังไง → เริ่มจากไลฟ์', say: ['ขายออนไลน์เริ่มยังไง', 'เริ่มจากไลฟ์ก่อน'],
  about: {icon: 'store', label: 'ขายออนไลน์'}, answer: {icon: 'video', label: 'ไลฟ์ขาย'}});
SENTENCE('r8.debt', {cat: 'B07', name: 'อย่ากู้มาลงทุน', say: ['หยุดก่อน อย่าเพิ่ง', 'กู้มาลงทุน'], thing: {icon: 'landmark', label: 'กู้มาลงทุน'}, how: 'cross'});
SENTENCE('r8.burn', {cat: 'B07', name: 'ระวังหมดไฟ', say: ['งานล้นมือแบบนี้', 'ระวังหมดไฟ'], thing: {icon: 'briefcase', label: 'งานล้นมือ'}, how: 'flag', sign: 'triangle-alert'});
SENTENCE('r8.walk', {cat: 'B03', name: 'เดินเร็วได้ผลกว่าวิ่งนาน', say: ['เดินเร็วทุกวัน', 'ดีกว่าวิ่งนาน'], mode: 'versus',
  a: {icon: 'footprints', label: 'เดินเร็ว'}, b: {icon: 'timer', label: 'วิ่งนาน'}, win: 'a'});
SENTENCE('r8.room', {cat: 'B03', name: 'จัดห้องใหม่ จากรกเป็นโล่ง', say: ['จัดห้องใหม่', 'จากรกเป็นโล่ง'], mode: 'change',
  a: {icon: 'boxes', label: 'ห้องรก'}, b: {icon: 'sofa', label: 'ห้องโล่ง'}});
SENTENCE('r8.cheap', {cat: 'B05', name: 'ไม่ใช่ถูกสุด แต่คุ้มสุด', say: ['ไม่ใช่ราคาถูกที่สุด', 'แต่คุ้มที่สุด'], wrong: {icon: 'tag', label: 'ถูกสุด'}, right: {icon: 'gem', label: 'คุ้มสุด'}});
SENTENCE('r8.word', {cat: 'B05', name: 'อย่าเขียนขายของ เขียนแก้ปัญหา', say: ['อย่าเขียนว่าขายของ', 'ให้เขียนแก้ปัญหา'],
  wrong: {icon: 'shopping-cart', label: 'ขายของ'}, right: {icon: 'life-buoy', label: 'แก้ปัญหา'}});
SENTENCE('r8.live', {cat: 'B11', name: 'คนในไลฟ์พิมพ์ว่าอยากได้อีก', say: ['คนในไลฟ์พิมพ์มาว่า', 'อยากได้อีก'], kind: 'comment', quote: 'อยากได้อีก!', mood: 'good', react: 'heart'});
SENTENCE('r8.memo', {cat: 'B11', name: 'ทีมแปะโน้ตว่าลูกค้าชอบสีนี้', say: ['ทีมแปะโน้ตไว้ว่า', 'ลูกค้าชอบสีนี้'], kind: 'message', quote: 'ลูกค้าชอบสีนี้', mood: 'good'});
SENTENCE('r8.kit', {cat: 'B17', name: 'กล้อง ไมค์ ไฟ', say: ['ของที่ต้องมีคือ', 'กล้อง ไมค์ ไฟ'], label: 'ของต้องมี',
  items: [{icon: 'camera', label: 'กล้อง'}, {icon: 'mic', label: 'ไมค์'}, {icon: 'lamp', label: 'ไฟ'}]});
SENTENCE('r8.pay', {cat: 'B17', name: 'จ่ายได้ 4 ทาง', say: ['จ่ายได้ทั้งโอน บัตร', 'เงินสด คิวอาร์'], label: 'ช่องทางจ่าย',
  items: [{icon: 'smartphone', label: 'โอน'}, {icon: 'credit-card', label: 'บัตร'}, {icon: 'banknote', label: 'เงินสด'}, {icon: 'qr-code', label: 'คิวอาร์'}]});
SENTENCE('r8.shop', {cat: 'B18', name: 'ปี 2015 แม่เปิดร้านแรก', say: ['ปี 2015 แม่ตัดสินใจ', 'เปิดร้านแรก'], what: {icon: 'store', label: 'เปิดร้าน'}, who: {icon: 'user', label: 'แม่'}, when: 'ปี 2015'});
SENTENCE('r8.viral', {cat: 'B18', name: 'คืนนั้นคลิปไวรัล', say: ['คืนนั้นคลิปของผม', 'กลายเป็นไวรัล'], what: {icon: 'flame', label: 'คลิปไวรัล'}, when: 'คืนนั้น'});
SENTENCE('r8.love', {cat: 'B19', name: 'ตื่นเต้นมาก', say: ['วันแรกที่เปิดร้าน', 'ตื่นเต้นมาก'], feel: {icon: 'smile', label: 'ตื่นเต้น'}, who: {icon: 'user'}, mood: 'good'});
SENTENCE('r8.rain', {cat: 'B19', name: 'เครียดมาก', say: ['ยอดขายตกทั้งเดือน', 'เครียดมาก'], feel: {icon: 'frown', label: 'เครียด'}, mood: 'bad'});
SENTENCE('r8.mom', {cat: 'B10', name: 'แม่ค้าออนไลน์มือใหม่', say: ['คลิปนี้สำหรับแม่ค้าออนไลน์', 'มือใหม่'], who: {icon: 'user'}, label: 'แม่ค้าออนไลน์', tags: ['มือใหม่', 'งบน้อย']});
SENTENCE('r8.fans', {cat: 'B10', name: 'ดึงคนสายสุขภาพ', say: ['ทำคอนเทนต์ตรงจุด', 'ดึงคนสายสุขภาพ'], who: {icon: 'user'}, label: 'สายสุขภาพ'});
