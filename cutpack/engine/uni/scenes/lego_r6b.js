/* =====================================================================
   CutPack · uni · LEGO round 6, second half (Friend 2026-11-10: "เก็บร่างเดิมไว้ แล้วทำ 10 ไอเดียใหม่เพิ่มเลย"):
   ten more variants for B17–B21, each a different kind of picture, not icons in a row (Friend: "อยากได้ความหลากหลาย").
   Same slots as lego_r6.js, same rules (R3.both: one composition on the 600 × 340 small canvas, scaled 1.6× full screen).
     B17 กระดาษโน้ตเขียนทีละบรรทัด (note) · ของหล่นลงตะกร้า (basket)
     B18 หนังสือพิมพ์หมุนเข้ามา (news) · ปฏิทินฉีกถึงวันที่เกิดเรื่อง (calendar)
     B19 หน้าปัดวัดอารมณ์ (gauge) · หน้าคนเปลี่ยนสีหน้า (portrait)
     B20 รูปคู่ในกรอบรูป ฉีกเมื่อเลิกกัน (frame) · จิ๊กซอว์สองชิ้นต่อกัน (puzzle)
     B21 เส้นทางบนแผนที่ไปถึงหมุด (route) · ตึกผ่าครึ่ง ไฟชั้นที่พูดถึง (tower)
   The sample sentences of round 6 are at the end of this file, so every variant of both files gets its test scene.
   ===================================================================== */
const R6B = {
  /* points along an SVG path (for a thing that travels along it); the path must be in the page */
  along(path, n = 24) { const L = path.getTotalLength(); return [...Array(n + 1)].map((_, i) => path.getPointAtLength(L * i / n)); },
  /* a feeling as a face: which expression the AI's icon (or the mood) means */
  face(s) {
    const i = s.feel.icon;
    if (/angry|annoyed/.test(i)) return 'angry';
    if (/frown|crack|meh|cloud-rain|thumbs-down/.test(i) || (s.mood === 'bad' && !/smile|laugh|heart|party/.test(i))) return 'sad';
    return 'happy';
  },
  /* brows and mouth in the icon's 24-unit space; every expression has the same commands so they morph into each other */
  FACES: {
    neutral: ['M6.5 7.2L10.2 7.2', 'M13.8 7.2L17.5 7.2', 'M8.5 15.6Q12 15.6 15.5 15.6'],
    happy:   ['M6.5 6.6L10.2 5.9', 'M13.8 5.9L17.5 6.6', 'M8 14.4Q12 18.6 16 14.4'],
    sad:     ['M6.5 7.8L10.2 6.3', 'M13.8 6.3L17.5 7.8', 'M8.5 17.2Q12 13.8 15.5 17.2'],
    angry:   ['M6.5 6L10.2 8.1', 'M13.8 8.1L17.5 6', 'M8.5 16.8Q12 14.6 15.5 16.8'],
  },
};

/* ================= B17 ไล่รายการหลายอย่าง: items [2–4], label? ================= */
/* 3 · a notepad: each thing is written on its own line, then the pen circles them all on the key word */
R3.both('B17', 'note', 'กระดาษโน้ตเขียนทีละบรรทัด', (K, s, T, g) => {
  const its = s.items.slice(0, 4), n = its.length, PX = 150, PY = 14, PW = 300, PH = 314;
  const P = R2.card(node(g, PX, PY, PW, PH, 'u-panel')); K.enter(P.o, T.b[0], 'rise');
  [70, 150, 230].forEach((x, i) => {                                     // the rings that bind the pad
    const r = node(P.p, x - 10, -14, 20, 34, 'u-badge u-main'); r.p.style.borderRadius = '10px'; r.o.classList.add('u-decor'); K.enter(r.o, T.b[0] + .15 + i * .05, 'pop');
  });
  if (s.label) R4.word(K, P.p, s.label, PW / 2, 28, 40, T.b[0] + .25, PW - 40);
  const top = s.label ? 92 : 40, gap = (PH - 20 - top) / n, ico = Math.min(54, gap - 12);
  const when = LG.spread(T.b[0] + .35, T.b[2] + .15, n);
  const ys = its.map((it, i) => {
    const y = top + gap * i + gap / 2;
    K.badge(P.p, it.icon, 44, y, ico, when[i], {tone: it.tone ?? 'main', shape: it.shape ?? 'round'});
    if (it.label) {
      const w = R6.wordL(K, P.p, it.label, 84, y - 21, 34, null, 190);
      A(w, [{clipPath: 'inset(-10px 100% -10px 0)'}, {clipPath: 'inset(-10px -10px -10px 0)'}], when[i] + .1, .45, {e: 'linear', f: 'both'});   // written left to right
    } else K.skel(P.p, 84, y - 9, [150], when[i] + .1);
    return y;
  });
  /* the pen goes from line to line as they are written, then leaves */
  const pen = K.badge(g, 'pen-line', 0, 0, 52, null, {tone: 'acc', shape: 'round'});
  const pts = ys.map(y => ({x: PX + 250, y: PY + y - 6})), t0 = when[0] + .1, t1 = when[n - 1] + .55;
  A(pen.o, [{opacity: 0}, {opacity: 1, offset: .08}, {opacity: 1, offset: .9}, {opacity: 0}], t0, t1 - t0 + .3, {f: 'both'});
  A(pen.m, pts.map((p, i) => ({transform: `translate(${p.x}px,${p.y}px)`, offset: n < 2 ? i : (when[i] + .1 - t0) / (t1 - t0)})).concat(n < 2 ? [] : [{transform: `translate(${pts[n - 1].x}px,${pts[n - 1].y}px)`, offset: 1}]), t0, t1 - t0, {e: 'ease-in-out', f: 'both'});
  /* the loop round every line on the key word */
  /* drawn on the paper itself, so it takes the paper's ink (on the video a white line vanished on a white pad) */
  const cy = (top + PH - 20) / 2, ry = (PH - 20 - top) / 2 + 6, cx = PW / 2, rx = PW / 2 - 8;
  /* in the accent colour, like a highlighter (Friend 2026-11-10: "ใช้วงสีเขียวก็ได้นะ"), no edge: a dark edge made it heavy
     (Friend: "แล้วจะใส่ขอบให้วงเพื่อ?"); glass's accent is see-through, so it gives a solid --ac-stroke */
  const d = `M${cx - rx} ${cy}A${rx} ${ry} 0 1 1 ${cx + rx} ${cy}A${rx} ${ry} 0 1 1 ${cx - rx + 4} ${cy - 22}`, w = 9;   // thinner (Friend 2026-11-10: "ลดความหนาลงด้วยนิดนึง")
  const loop = div(`left:0;top:0;width:${PW}px;height:${PH}px`, P.p, `<svg width="${PW}" height="${PH}" style="overflow:visible">` +
    `<path class="u-acc-line" d="${d}" style="stroke-width:${w}px"/></svg>`);
  A(loop, [{opacity: 0}, {opacity: 1}], T.hit, .01, {f: 'both'});
  K.draw(loop.querySelector('path'), T.hit, .5);
  K.punch(P.p, T.hit + .5);
});

/* 4 · the things drop into a basket one by one; on the key word the basket bounces and its tag gets the group's name */
R3.both('B17', 'basket', 'ของหล่นลงตะกร้า', (K, s, T, g) => {
  const its = s.items.slice(0, 4), n = its.length, S = n === 4 ? 88 : 100, rim = 206;
  const xs = {2: [248, 352], 3: [214, 300, 386], 4: [196, 265, 335, 404]}[n];
  const grp = div('left:0;top:0;width:600px;height:340px;transform-origin:300px 322px', g);
  const back = div('left:0;top:0;width:600px;height:340px', grp, `<svg width="600" height="340"><path class="sd" d="M156 ${rim}H444L432 ${rim + 14}H168Z"/></svg>`);
  K.enter(back, T.b[0], 'rise');
  const when = LG.spread(T.b[0] + .35, T.b[2] + .1, n);
  const items = its.map((it, i) => {
    const b = K.badge(grp, it.icon, xs[i], rim - 34, S, null, {tone: it.tone ?? 'acc', shape: it.shape ?? 'tile'});   // the accent: a plain tile was the basket's own colour (Friend 2026-11-10: "สีไอคอนกับตะกร้ามันกลืนกัน")
    K.fade(b.o, when[i], 0, 1, {hold: true});
    K.move(b.m, when[i], `translateY(-220px) rotate(${i % 2 ? 14 : -14}deg)`, 'none', {hold: true, kind: 'snap'});
    return b;
  });
  /* the front of the basket covers the lower half of the things: solid bands with gaps between them, so the weave is the
     background showing through and reads the same in every style (Friend 2026-11-10: in the card style light stripes on the
     basket vanished, "ทำไมตะกร้ามันไม่เหมือนอีก 2 สไตล์") */
  const xl = y => 148 + (y - rim) * 28 / 116, xr = y => 452 - (y - rim) * 28 / 116;
  const band = (a, b) => `M${xl(rim + a).toFixed(1)} ${rim + a}H${xr(rim + a).toFixed(1)}L${xr(rim + b).toFixed(1)} ${rim + b}H${xl(rim + b).toFixed(1)}Z`;
  /* an edge round the whole body and a rim on top (Friend 2026-11-10: "ทำให้มันมีขอบด้วย ตอนนี้มันไม่สวย"): the bands alone
     looked like three loose slabs; with the edge the gaps read as slots in one basket */
  /* every line drawn once (Friend 2026-11-10, glass: "ดูเรื่องเส้นด้วย"): the bands have no edge of their own; one edge round
     the body; each slot gets one line only in styles that edge their solids (class sd, no fill), so in the card style the
     gaps stay plain; the rim is one solid bar */
  const body = `M${xl(rim)} ${rim}H${xr(rim)}L${xr(rim + 116)} ${rim + 116}H${xl(rim + 116)}Z`, rimBar = `x="${xl(rim) - 12}" y="${rim - 10}" width="${xr(rim) - xl(rim) + 24}" height="24" rx="12"`;
  const front = div('left:0;top:0;width:600px;height:340px', grp, `<svg width="600" height="340" style="overflow:visible">` +
    `<path class="sd" style="stroke:none" d="${band(0, 58)}${band(66, 90)}${band(98, 116)}"/>` +
    `<path class="sd" style="fill:none" d="${[62, 94].map(y => `M${xl(rim + y).toFixed(1)} ${rim + y}H${xr(rim + y).toFixed(1)}`).join('')}"/>` +
    `<path class="ln u-thin" d="${body}"/><rect class="sd" ${rimBar}/></svg>`);
  K.enter(front, T.b[0], 'rise');
  K.punch(grp, T.hit);
  items.forEach((b, i) => A(b.p, [{transform: 'none'}, {transform: 'translateY(-36px)', offset: .4}, {transform: 'none'}], T.hit + i * .06, .5, {e: 'ease-out', f: 'none'}));
  if (s.label) K.chipC(g, s.label, 300, rim + 32, T.hit + .3, {tone: 'acc', size: 36});   // on the plain top band, clear of the slot lines
});

/* ================= B18 เล่าเหตุการณ์: what, who?, when? ================= */
/* 3 · a newspaper spins in: the event in the photo, the time in the corner, the headline lands on the key word */
R3.both('B18', 'news', 'หนังสือพิมพ์หมุนเข้ามา', (K, s, T, g) => {
  const P = R2.card(node(g, 90, 20, 420, 300, 'u-panel')), who = s.who;
  P.m.style.transformOrigin = '50% 50%';
  A(P.o, [{opacity: 0}, {opacity: 1}], T.b[0], .2, {f: 'both'});
  A(P.m, [{transform: 'rotate(-700deg) scale(.15)'}, {transform: 'rotate(-3deg) scale(1)'}], T.b[0], .8, {e: 'cubic-bezier(.2,.8,.3,1)', f: 'both'});
  const mast = div('left:24px;top:22px;width:230px;height:24px;border-radius:12px;transform-origin:0 50%', P.p); mast.className = 'u-skel u-decor'; K.grow(mast, T.b[0] + .5);
  const rule = div('left:24px;top:60px;width:372px;height:5px;border-radius:3px;transform-origin:0 50%', P.p); rule.className = 'u-skel u-decor'; K.grow(rule, T.b[0] + .6);
  if (s.when) K.chip(P.p, s.when, 272, 12, T.b[1], {tone: 'acc', size: 28});
  const ph = node(P.p, 24, 134, 176, 142, 'u-track'); ph.p.style.borderRadius = '12px'; K.enter(ph.o, T.b[1] + .1, 'pop');
  const ev = K.badge(ph.p, s.what.icon, who ? 76 : 88, 71, 96, T.b[1] + .25, {tone: s.what.tone ?? 'acc'});
  if (who) K.badge(ph.p, who.icon, 140, 104, 56, T.b[1] + .35, {tone: who.tone ?? 'main', shape: who.shape ?? 'round'});
  K.skel(P.p, 220, 140, [176, 150, 176, 110], T.b[2], {h: 14, gap: 22});
  /* the headline: what happened, as said (or bars when it has no words) */
  if (s.what.label) R4.word(K, P.p, s.what.label, 210, 68, 50, T.hit, 372);
  else K.skel(P.p, 24, 80, [320, 220], T.hit, {h: 20, gap: 12});
  K.punch(ph.p, T.hit + .2); R1.ripple(K, ev, T.hit + .25);
});

/* 4 · a tear-off calendar: pages fly off until the day it happened (the time said), then the event pops out of it */
R3.both('B18', 'calendar', 'ปฏิทินฉีกถึงวันที่เกิดเรื่อง', (K, s, T, g) => {
  const C = {x: 70, y: 46, w: 230, h: 262}, who = s.who;
  const body = R2.card(node(g, C.x, C.y, C.w, C.h, 'u-panel')); K.enter(body.o, T.b[0], 'rise');
  const band = node(body.p, 0, 0, C.w, 56, 'u-badge u-acc'); band.p.style.borderRadius = '18px 18px 6px 6px'; K.enter(band.o, T.b[0] + .1, 'pop');
  [64, 166].forEach(x => { const r = node(body.p, x - 10, -16, 20, 40, 'u-badge u-main'); r.p.style.borderRadius = '10px'; r.o.classList.add('u-decor'); K.enter(r.o, T.b[0] + .2, 'pop'); });
  const tears = [T.b[1], (T.b[1] + T.hit) / 2 - .05, T.hit - .3], reveal = tears[2] + .15;
  /* the page under the last one: the time as said, else who it is about, else what happened */
  if (s.when) R4.word(K, body.p, s.when, C.w / 2, 110, 58, reveal, C.w - 30);
  else K.badge(body.p, (who ?? s.what).icon, C.w / 2, 158, 110, reveal, {tone: 'main', shape: who ? (who.shape ?? 'round') : 'tile'});
  if (s.when && who) K.badge(body.p, who.icon, C.w / 2, 214, 64, reveal + .1, {tone: who.tone ?? 'main', shape: who.shape ?? 'round'});
  /* three plain pages on top, torn off one after another from the top left corner */
  tears.forEach((t, k) => {
    const pg = R2.card(node(body.p, 12, 66, C.w - 24, C.h - 78, 'u-panel')); pg.p.style.borderRadius = '10px';
    pg.o.style.zIndex = String(10 - k); pg.m.style.transformOrigin = '0 0';
    K.enter(pg.o, T.b[0] + .15, 'pop');
    K.skel(pg.p, 30, 60, [130, 90], T.b[0] + .3);
    A(pg.m, [{transform: 'none'}, {transform: 'translate(90px,-70px) rotate(28deg)'}], t, .45, {e: 'ease-in', f: 'forwards'});
    A(pg.o, [{opacity: 1}, {opacity: 0}], t + .2, .25, {f: 'forwards'});
  });
  /* what happened jumps out of the calendar to its right */
  const ev = K.badge(g, s.what.icon, 445, 150, 136, null, {tone: s.what.tone ?? 'acc'});
  K.fade(ev.o, T.hit - .05, 0, 1, {hold: true}); K.move(ev.m, T.hit - .05, 'translate(-260px,20px) scale(.3)', 'none', {hold: true, kind: 'snap'});
  const land = R6.at('snap', T.hit - .05);
  R1.ripple(K, ev, land);
  if (s.what.label) R4.word(K, g, s.what.label, 445, 226, 38, land, 190);
});

/* ================= B19 ความรู้สึก: feel, who?, mood? ================= */
/* 3 · a mood dial from bad to good: the needle swings and stops on the feeling, which pops out at its tip */
R3.both('B19', 'gauge', 'หน้าปัดวัดอารมณ์', (K, s, T, g) => {
  const bad = R6B.face(s) !== 'happy', C = {x: 300, y: 228}, R = 158, w = 30, deg = bad ? -60 : 60, rad = deg * Math.PI / 180;
  const at = (a, r) => ({x: C.x + r * Math.sin(a), y: C.y - r * Math.cos(a)});
  const e = at(rad, R);
  const dial = div('left:0;top:0;width:600px;height:340px', g, `<svg width="600" height="340">` +
    `<path class="u-ring" style="stroke-width:${w}px;stroke-linecap:round" d="M${C.x - R} ${C.y}A${R} ${R} 0 0 1 ${C.x + R} ${C.y}"/>` +
    ['u-ring-edge', 'u-ring-on'].map(c => `<path class="${c}" style="stroke-width:${c === 'u-ring-on' ? w + 'px' : `calc(${w}px + 2px * var(--lw-ac, 0))`}" pathLength="100" stroke-dasharray="100 100" stroke-dashoffset="100" d="M${C.x} ${C.y - R}A${R} ${R} 0 0 ${deg > 0 ? 1 : 0} ${e.x.toFixed(1)} ${e.y.toFixed(1)}"/>`).join('') + '</svg>');
  K.enter(dial, T.b[0], 'pop');
  K.badge(g, 'frown', C.x - R, C.y + 50, 56, T.b[0] + .2, {tone: 'soft', shape: 'round'});      // the dial's two ends: bad and good
  K.badge(g, 'smile', C.x + R, C.y + 50, 56, T.b[0] + .25, {tone: 'soft', shape: 'round'});
  const L = 128, nd = div(`left:${C.x - L}px;top:${C.y - L}px;width:${2 * L}px;height:${2 * L}px`, g, `<svg width="${2 * L}" height="${2 * L}" style="overflow:visible"><path class="ln u-thick" d="M${L} ${L}V18"/></svg>`);
  K.enter(nd, T.b[0] + .3, 'pop');
  A(nd, [0, -50, 42, -26, 18, deg].map((d, i, a) => ({transform: `rotate(${d}deg)`, offset: i / (a.length - 1)})), T.b[1], T.hit - T.b[1], {e: 'ease-in-out', f: 'both'});
  const cap = s.who ? K.badge(g, s.who.icon, C.x, C.y, 76, T.b[0] + .35, {tone: s.who.tone ?? 'main', shape: 'round'})
                    : (() => { const c = node(g, C.x - 24, C.y - 24, 48, 48, 'u-badge u-main'); c.p.style.borderRadius = '50%'; K.enter(c.o, T.b[0] + .35, 'pop'); return c; })();
  dial.querySelectorAll('.u-ring-edge,.u-ring-on').forEach(a => { A(a, [{opacity: 0}, {opacity: 1}], T.hit, .05); A(a, [{strokeDashoffset: 100}, {strokeDashoffset: 0}], T.hit, .35, {e: 'ease-out'}); });
  const tip = at(rad, R + 72), f = K.badge(g, s.feel.icon, tip.x, tip.y, 100, T.hit + .3, {tone: 'acc', shape: 'round'});
  const land = R6.at('pop', T.hit + .3);
  R1.ripple(K, f, land); K.punch(cap.p, land);
  if (s.feel.label) R4.word(K, g, s.feel.label, C.x, C.y + 44, 38, land, 200);
});

/* 4 · a big face whose expression changes on the key word (brows and mouth move), the feeling's icon pops beside it */
R3.both('B19', 'portrait', 'หน้าคนเปลี่ยนสีหน้า', (K, s, T, g) => {
  const C = {x: 300, y: 142}, D = 220, to = R6B.FACES[R6B.face(s)], from = R6B.FACES.neutral;
  const face = node(g, C.x - D / 2, C.y - D / 2, D, D, 'u-badge u-main u-round'); face.p.style.borderRadius = '50%';
  face.p.innerHTML = `<svg class="u-ico" width="${D * .62}" height="${D * .62}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">` +
    `<circle cx="8.6" cy="10.6" r="1.15" fill="currentColor" stroke="none"/><circle cx="15.4" cy="10.6" r="1.15" fill="currentColor" stroke="none"/>` +
    from.map(d => `<path d="${d}"/>`).join('') + '</svg>';
  K.enter(face.o, T.b[0], 'pop');
  const eyes = face.p.querySelectorAll('circle'), parts = face.p.querySelectorAll('path');
  eyes.forEach(c => { c.style.transformOrigin = `${c.getAttribute('cx')}px ${c.getAttribute('cy')}px`; c.style.transformBox = 'view-box';
    A(c, [{transform: 'scaleY(1)'}, {transform: 'scaleY(.1)', offset: .5}, {transform: 'scaleY(1)'}], T.b[2] - .2, .22, {f: 'none'}); });   // a blink while it waits
  parts.forEach((p, i) => A(p, [{d: `path("${from[i]}")`}, {d: `path("${to[i]}")`}], T.hit, .35, {e: 'cubic-bezier(.3,1.4,.5,1)', f: 'both'}));
  const done = T.hit + .35;
  if (R6B.face(s) === 'happy') R1.ripple(K, face, done); else K.shake(face.p, done);
  const f = K.badge(g, s.feel.icon, C.x + D / 2 + 40, C.y - D / 2 + 30, 80, done, {tone: 'acc', shape: 'round'});
  R1.ripple(K, f, R6.at('pop', done));
  if (s.feel.label) R4.word(K, g, s.feel.label, C.x, C.y + D / 2 + 10, 40, done, 260);
});

/* ================= B20 ความสัมพันธ์ของคน: a, b, label?, cut? ================= */
/* 3 · the two in one photo frame; when the link is over, the photo tears in two and the halves fall apart */
R3.both('B20', 'frame', 'รูปคู่ในกรอบรูป', (K, s, T, g) => {
  const cut = s.cut === true;
  const draw = (parent, only) => {
    const P = R2.card(node(parent, 130, 22, 340, 236, 'u-panel')); P.p.style.borderRadius = '20px'; K.enter(P.o, T.b[0], 'rise');
    const ph = node(P.p, 18, 18, 304, 200, 'u-track'); ph.p.style.borderRadius = '12px'; K.enter(ph.o, T.b[0] + .1, 'pop');
    const ab = [[s.a, 90, T.b[1], 'a'], [s.b, 214, T.b[1] + .2, 'b']].filter(([, , , k]) => !only || only === k).map(([it, x, t]) => {
      const gp = R6.group(ph.p);
      K.badge(gp, it.icon, x, 92, 108, t, {tone: it.tone ?? 'main', shape: it.shape ?? 'round'});
      if (it.label) R4.word(K, gp, it.label, x, 152, 30, t + .15, 120);
      return gp;
    });
    return {P, ab};
  };
  if (!cut) {
    const {P, ab} = draw(g);
    K.move(ab[0], T.hit, 'none', 'translateX(10px)'); K.move(ab[1], T.hit, 'none', 'translateX(-10px)');   // they lean together
    const land = LG.arrive('move', T.hit);
    K.punch(P.p, land); R1.ripple(K, P, land);
    if (s.label) K.chipC(g, s.label, 300, 298, land, {tone: 'acc', size: 36});
    return;
  }
  /* the same photo twice, each half cut out along one jagged line; a crack shows first, then the halves part */
  const zz = [[300, -40], [300, 20], [312, 52], [290, 92], [314, 132], [288, 172], [312, 212], [294, 252], [300, 300], [300, 380]];
  const halves = [-1, 1].map(k => {
    const h = div('left:0;top:0;width:600px;height:340px', g);
    const edge = (k < 0 ? zz : [...zz].reverse()).map(([x, y]) => `${x}px ${y}px`).join(',');
    h.style.clipPath = k < 0 ? `polygon(-60px -60px,${edge},-60px 400px)` : `polygon(660px 400px,${edge},660px -60px)`;
    h.style.transformOrigin = k < 0 ? '300px 340px' : '300px 340px';
    draw(h, k < 0 ? 'a' : 'b'); return h;   // each half only its own person: the other one's edge showed white at the tear (Friend 2026-11-10)
  });
  if (s.label) K.chipC(g, s.label, 300, 298, T.b[2], {tone: 'main', size: 36});
  const crack = R6.line(K, g, 'M' + zz.slice(1, 9).map(([x, y]) => `${x} ${Math.min(Math.max(y, 28), 252)}`).join('L'), T.hit - .3, .25);
  crack.classList.add('u-decor');
  A(crack, [{opacity: 1}, {opacity: 0}], T.hit, .1, {f: 'forwards'});
  halves.forEach((h, i) => K.move(h, T.hit, 'none', `translate(${i ? 34 : -34}px,10px) rotate(${i ? 8 : -8}deg)`, {kind: 'snap'}));
});

/* 4 · two jigsaw pieces, one each, slide together and click (or come apart when the link is over) */
R3.both('B20', 'puzzle', 'จิ๊กซอว์สองชิ้นต่อกัน', (K, s, T, g) => {
  const cut = s.cut === true, S = 156, Y = 34, ly = Y + S + 12;
  const piece = (it, ox, edges, cx, t, fill, tone) => {
    const gp = R6.group(g); gp.style.transformOrigin = `${cx}px ${Y + S / 2}px`;
    const sh = div('left:0;top:0;width:600px;height:340px', gp, `<svg width="600" height="340" style="overflow:visible"><path class="${fill}" d="${jigsawPath(S, edges, ox, Y)}"/></svg>`);
    K.enter(sh, t, 'pop');
    K.badge(gp, it.icon, cx, Y + S / 2, 92, t + .12, {tone, shape: it.shape ?? 'round'});
    if (it.label) R4.word(K, gp, it.label, cx, ly, 34, t + .2, 170);
    return gp;
  };
  const L = piece(s.a, 300 - S, [0, 1, 0, 0], 300 - S / 2, T.b[0], 'sd', 'acc'), Rt = piece(s.b, 300, [0, 0, 0, -1], 300 + S / 2 + 10, T.b[1], 'ac', 'main');
  const go = T.hit - .1, land = R6.at('snap', go);
  if (!cut) {
    K.move(L, T.b[0] - .01, 'translateX(-80px)', 'translateX(-80px)', {hold: true}); K.move(Rt, T.b[0] - .01, 'translateX(80px)', 'translateX(80px)', {hold: true});
    K.move(L, go, 'translateX(-80px)', 'none', {kind: 'snap'}); K.move(Rt, go, 'translateX(80px)', 'none', {kind: 'snap'});
    K.punch(L, land); K.punch(Rt, land);
    K.sat(g, 'sparkles', 300, Y - 6, 56, land, {tone: 'acc'});
    if (s.label) K.chipC(g, s.label, 300, 292, land + .05, {tone: 'acc', size: 36});
  } else {
    K.move(L, go, 'none', 'translateX(-84px) rotate(-8deg)', {kind: 'snap'}); K.move(Rt, go, 'none', 'translateX(84px) rotate(8deg)', {kind: 'snap'});
    K.mark(g, 'cross', 300, Y + S / 2, 64, land);
    if (s.label) K.chipC(g, s.label, 300, 292, T.b[2], {tone: 'main', size: 36});
  }
});

/* ================= B21 สถานที่: place, spots? ================= */
/* 3 · a map: a route draws itself from the start to the place, the walker follows it, a pin drops on arrival */
R3.both('B21', 'route', 'เส้นทางบนแผนที่ไปถึงหมุด', (K, s, T, g) => {
  const P = R3.panel(K, g, 40, 24, 500, 292, T.b[0]), X = 400, Y = 124, S = 100;
  R6.roads(K, P.p, 500, 292, 'M0 250H500M228 0V292', T.b[0] + .15);
  const place = K.badge(P.p, s.place.icon, X, Y, S, T.b[0] + .3, {tone: s.place.tone ?? 'main', shape: s.place.shape ?? 'tile'});
  if (s.place.label) R4.word(K, P.p, s.place.label, X, Y + S / 2 + 6, 34, T.b[0] + .45, 180);
  const d = `M46 252C130 266 118 166 196 176S286 240 318 174S334 ${Y + 4} ${X - S / 2 - 10} ${Y}`;
  const start = node(P.p, 46 - 16, 252 - 16, 32, 32, 'u-badge u-main'); start.p.style.borderRadius = '50%'; K.enter(start.o, T.b[1] - .1, 'pop');
  const rt = R6.line(K, P.p, d, T.b[1], T.hit - T.b[1], 500, 292);
  rt.querySelector('path').classList.add('u-thick');
  const pts = R6B.along(rt.querySelector('path'));
  const wk = K.badge(P.p, 'footprints', 0, 0, 46, null, {tone: 'acc', shape: 'round'});
  A(wk.o, [{opacity: 0}, {opacity: 1}], T.b[1], .15, {f: 'both'});
  A(wk.m, pts.map(p => ({transform: `translate(${p.x.toFixed(1)}px,${p.y.toFixed(1)}px)`})), T.b[1], T.hit - T.b[1], {e: 'linear', f: 'both'});
  const pin = K.badge(P.p, 'map-pin', X, Y - S / 2 - 34, 64, null, {tone: 'acc', shape: 'round'});
  K.fade(pin.o, T.hit, 0, 1, {hold: true}); K.move(pin.m, T.hit, 'translateY(-60px)', 'none', {hold: true, kind: 'snap'});
  const land = R6.at('snap', T.hit);
  R1.ripple(K, place, land); K.punch(place.p, land); K.fade(wk.o, land, 1, 0);
});

/* 4 · a building cut open floor by floor: a lift goes to the floor that is talked about, which lights up with what is there */
R3.both('B21', 'tower', 'ตึกผ่าครึ่ง ไฟชั้นที่พูดถึง', (K, s, T, g) => {
  const spots = s.spots.slice(0, 2), X0 = 206, X1 = 394, Ytop = 74, H = 80, floors = 3;
  const said = spots.map(it => it.label ?? '').join(' ');
  const num = said.match(/ชั้น\s*(\d+)/), at = /(^|\s)G(\s|$)|ชั้นล่าง|ใต้ดิน|ชั้น\s*1(\D|$)/.test(said) ? 0 : num ? Math.min(+num[1] - 1, floors - 1) : 1;   // floor 0 = ground
  const fy = k => Ytop + (floors - 1 - k) * H;                                       // top of floor k
  const walls = div('left:0;top:0;width:600px;height:340px', g, `<svg width="600" height="340"><path class="ln" d="M${X0} ${Ytop + floors * H}V${Ytop}H${X1}V${Ytop + floors * H}H${X0 - 24}"/>` +
    [1, 2].map(k => `<path class="ln u-thin" d="M${X0} ${Ytop + k * H}H${X1}"/>`).join('') + '</svg>');
  A(walls, [{opacity: 0}, {opacity: 1}], T.b[0], .01, {f: 'both'});
  walls.querySelectorAll('path').forEach((p, i) => K.draw(p, T.b[0] + i * .12, .5));
  if (s.place.label) K.chipC(g, s.place.label, 300, Ytop - 30, T.b[0] + .3, {tone: 'main', size: 34});
  else K.badge(g, s.place.icon, 300, Ytop - 30, 56, T.b[0] + .3, {tone: 'main'});
  /* windows on every floor (they go where the floor lights up) */
  const win = [...Array(floors)].map((_, k) => [0, 1, 2].map(j => {
    const w = div(`left:${X0 + 20 + j * 48}px;top:${fy(k) + 22}px;width:36px;height:36px;border-radius:8px`, g); w.className = 'u-skel u-decor';   // clear of the lift's shaft
    K.enter(w, T.b[0] + .4 + k * .08 + j * .04, 'pop'); return w;
  }));
  /* the lift: a small car in a shaft on the right side, going down (or up) to the floor */
  const lift = K.badge(g, 'arrow-down-up', X1 - 21, fy(floors - 1) + H / 2, 36, T.b[1], {tone: 'acc', shape: 'round'});
  K.move(lift.m, T.b[2] - .2, 'none', `translateY(${fy(at) - fy(floors - 1)}px)`);
  const on = node(g, X0 + 6, fy(at) + 6, X1 - X0 - 12, H - 12, 'u-badge u-acc'); on.p.style.borderRadius = '10px';
  A(on.o, [{opacity: 0}, {opacity: 1}], T.hit, .04, {f: 'both'}); K.move(on.m, T.hit, 'scaleX(.2)', 'none', {hold: true, kind: 'snap'});
  const done = R6.at('snap', T.hit);
  win[at].forEach(w => K.fade(w, T.hit, 1, 0));
  K.fade(lift.o, T.hit, 1, 0);
  spots.forEach((it, i) => {
    const x = spots.length === 1 ? 300 : 262 + i * 76;
    K.badge(on.p, it.icon, x - X0 - 6, (H - 12) / 2, 52, done + i * .1, {tone: it.tone ?? 'main', shape: it.shape ?? 'round'});
  });
  R1.ripple(K, on, done);
  const labs = spots.map(it => it.label).filter(Boolean);
  labs.forEach((w, i) => R6.wordL(K, g, w, X1 + 16, fy(at) + H / 2 - 20 + (i - (labs.length - 1) / 2) * 40, 32, done + .1 + i * .1, 140));
}, s => (s.spots ?? []).length > 0);

/* ================= sample sentences (from the 26 scripts Friend sent, round 17; not Friend's own) ================= */
SENTENCE('r6.layers', {cat: 'B17', name: '3 เลเยอร์ของชุดนักเรียน', say: ['เสื้อชั้นใน เสื้อกล้ามทับ', 'ชุดนักเรียน'],
  items: [{icon: 'shirt', label: 'เสื้อชั้นใน'}, {icon: 'shirt', label: 'เสื้อกล้าม'}, {icon: 'shirt', label: 'ชุดนักเรียน'}], label: '3 เลเยอร์'});
SENTENCE('r6.gpu', {cat: 'B17', name: 'กู้ซื้อ GPU ได้แค่ 4 เจ้า', say: ['มีแค่ Microsoft, Meta', 'แล้วก็ SpaceX'],
  items: [{icon: 'building-2', label: 'Microsoft'}, {icon: 'building-2', label: 'Meta'}, {icon: 'building-2', label: 'Google'}, {icon: 'rocket', label: 'SpaceX'}]});
SENTENCE('r6.arrest', {cat: 'B18', name: 'ปี 2022 ถูกจับ', say: ['ปี 2022 เติร์กก็', 'ถูกจับในคดีใหญ่'],
  what: {icon: 'siren', label: 'ถูกจับ'}, who: {icon: 'mic', label: 'เติร์ก'}, when: 'ปี 2022'});
SENTENCE('r6.closed', {cat: 'B18', name: 'สาขาแรกเจ๊ง', say: ['ขยายสาขาแรก', 'เจ๊ง'], what: {icon: 'store', label: 'สาขาแรก'}});
SENTENCE('r6.relief', {cat: 'B19', name: 'รู้สึกสบายใจขึ้น', say: ['ผมก็รู้สึก', 'สบายใจขึ้นเยอะ'],
  feel: {icon: 'smile', label: 'สบายใจ'}, who: {icon: 'user', label: 'ผม'}, mood: 'good'});
SENTENCE('r6.angry', {cat: 'B19', name: 'จำความรู้สึกโกรธแค้นได้', say: ['ผมยังจำความรู้สึก', 'โกรธแค้นได้เลย'],
  feel: {icon: 'angry', label: 'โกรธแค้น'}, mood: 'bad'});
SENTENCE('r6.ex', {cat: 'B20', name: 'ร้านของแฟนเก่า', say: ['เป็นร้านของ', 'แฟนเก่าพี่เอง'],
  a: {icon: 'user', label: 'พี่'}, b: {icon: 'store', label: 'ร้าน'}, label: 'แฟนเก่า', cut: true});
SENTENCE('r6.collab', {cat: 'B20', name: 'คอลแล็บกับแสนสิริ', say: ['วันนี้เราได้มาคอลแล็บ', 'กับแสนสิริ'],
  a: {icon: 'users', label: 'เรา'}, b: {icon: 'building-2', label: 'แสนสิริ'}, label: 'คอลแล็บ'});
SENTENCE('r6.mall', {cat: 'B21', name: 'ชั้น G หน้า KFC', say: ['มันอยู่ตรงชั้น G', 'ตรงหน้า KFC'],
  place: {icon: 'building-2', label: 'มิตรทาวน์'}, spots: [{icon: 'building', label: 'ชั้น G'}, {icon: 'utensils', label: 'หน้า KFC'}]});
SENTENCE('r6.canada', {cat: 'B21', name: 'ย้ายมาแคนาดา', say: ['ใครที่อยากย้ายมา', 'แคนาดา'], place: {icon: 'flag', label: 'แคนาดา'}});
