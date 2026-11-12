/* =====================================================================
   CutPack · uni · LEGO round 9 (Friend 2026-11-11: "เริ่มรอบที่ 9 ตามตารางที่เสนอเลยครับ"): two new variants for ten
   categories. Friend felt the library had started to look alike ("motion graphics หน้าตามันเริ่มจะคล้ายๆกันไปแล้วจากรอบที่
   1-8"), so this round follows five look rules on top of the usual ones (DECISIONS, round 9):
     1 one big thing drawn as a real shape, never an icon in a tile      2 words sit ON the thing, no pill labels
     3 things may run past the canvas edge (clipped)                     4 the thing changes shape over time, not just pops in
     5 no person-in-a-circle
   Same slots as before (cat_ai.py), same frame rules (R3.both: one composition on the 600 × 340 small canvas, scaled 1.6×
   full screen; nothing past x 550 below y 200; words only from the slots; cards never overlap at rest).
     B09 เวลา         เทียนไขละลายสั้นลงทีละขั้น (candle)
     B13 เคล็ดลับ      ตู้เซฟหมุนรหัส แล้วประตูเปิด (safe)
     B16 นิยาม        ตู้หยอดเหรียญ ได้ความหมายออกมา (vending)
     B20 ความสัมพันธ์  โทรศัพท์กระป๋อง เสียงวิ่งตามเชือก (cans)
     B21 สถานที่      หน้าร้าน กันสาดกางออก ป้ายชื่อไฟติด (shop)
     B08 เป้าหมาย     จรวดพุ่งขึ้นไปถึงดาว (rocket)
   Friend kept only these six after seeing page 23 ("เก็บไว้แค่นี้ ที่เหลือผมไม่ชอบลบทิ้งได้เลย"); the other 14 written this round
   were removed (DECISIONS, round 9). Never bring them back.
   ===================================================================== */
const R9 = {
  /* a window the size of the canvas: things that enter from outside are cut at its edge (look rule 3) */
  clip: g => div('left:0;top:0;width:600px;height:340px;overflow:hidden', g),
  /* a card (the thing itself, or a part of it); r = a CSS border radius */
  card(g, x, y, w, h, r = 18) { const c = R2.card(node(g, x, y, w, h, 'u-panel')); c.p.style.borderRadius = typeof r === 'number' ? r + 'px' : r; return c; },
  /* an accent surface (a band, a flag, a plate); words and icons on it take its own ink (u-bubble-text) */
  acc(g, x, y, w, h, r = 12) { const n = node(g, x, y, w, h, 'u-badge u-acc'); n.p.style.borderRadius = typeof r === 'number' ? r + 'px' : r; return n; },
  /* a bare icon (no holder), centred on (cx, cy); cls u-label = the text ink of where it sits, u-bubble-text = on an accent */
  ico(g, icon, cx, cy, size, cls = 'u-label') {
    const e = div(`left:${cx - size / 2}px;top:${cy - size / 2}px;width:${size}px;height:${size}px`, g, ICO(icon, size)); e.className = cls; return e;
  },
  /* a centred word that shrinks to maxW (R4.word) in the ink of an accent surface */
  accWord(K, parent, txt, cx, y, size, t, maxW) { const w = R4.word(K, parent, txt, cx, y, size, t, maxW); w.classList.add('u-bubble-text'); return w; },
  /* keyframes for a value that steps through [time, value] pairs (holds between them), on one property */
  track(el, prop, pts, fmt, e = 'cubic-bezier(.45,0,.25,1)') {
    const t0 = pts[0][0], t1 = pts[pts.length - 1][0], L = Math.max(.01, t1 - t0);
    A(el, pts.map(([t, v]) => ({[prop]: fmt(v), offset: (t - t0) / L, easing: e})), t0, L, {f: 'both'});
  },
};

/* ================= B13 เคล็ดลับ: secret {icon, label?} ================= */
/* 3 · a safe: the dial turns one way, the other way, back; the handle turns and the door swings open on the secret */
R3.both('B13', 'safe', 'ตู้เซฟหมุนรหัส แล้วประตูเปิด', (K, s, T, g) => {
  const it = s.secret ?? {icon: 'key-round'}, X = 156, Y = 16, W = 288, H = 286, b = 22;
  const box = R8.svg(g, `<path class="sd" fill-rule="evenodd" d="M${X + 18} ${Y}H${X + W - 18}Q${X + W} ${Y} ${X + W} ${Y + 18}V${Y + H - 18}Q${X + W} ${Y + H} ${X + W - 18} ${Y + H}H${X + 18}Q${X} ${Y + H} ${X} ${Y + H - 18}V${Y + 18}Q${X} ${Y} ${X + 18} ${Y}Z` +
    `M${X + b} ${Y + b}V${Y + H - b}H${X + W - b}V${Y + b}Z"/><rect class="sd" x="${X + 26}" y="${Y + H}" width="40" height="16" rx="5"/><rect class="sd" x="${X + W - 66}" y="${Y + H}" width="40" height="16" rx="5"/>`);
  K.enter(box, T.b[0], 'rise');
  /* inside: the secret on a glowing plate, seen only once the door is open */
  const open = T.hit - .1, inn = R6.group(g); R7.show(inn, open + .05);
  const pl = R9.acc(inn, X + b + 22, Y + 92, W - 2 * b - 44, 112, 18);
  R9.ico(pl.p, it.icon, (W - 2 * b - 44) / 2, it.label ? 40 : 56, it.label ? 50 : 70, 'u-bubble-text');
  if (it.label) R9.accWord(K, pl.p, it.label, (W - 2 * b - 44) / 2, 64, 32, null, W - 2 * b - 64);
  K.enter(pl.o, open + .15, 'pop'); R6.burst(K, g, X + W / 2, Y + 148, 84, open + .3, 10);
  /* the door: one card in the opening, hinged on the left, with the dial and the handle */
  const DW = W - 2 * b, DH = H - 2 * b, door = R9.card(g, X + b, Y + b, DW, DH, 10);
  K.enter(door.o, T.b[0] + .1, 'rise');
  door.m.style.transformOrigin = '0 50%';
  const D = {x: DW / 2 - 18, y: DH / 2}, R = 64;
  const ticks = [...Array(24)].map((_, i) => { const a = i * Math.PI / 12, r0 = i % 6 ? R - 10 : R - 18; return `M${(D.x + Math.cos(a) * r0).toFixed(1)} ${(D.y + Math.sin(a) * r0).toFixed(1)}L${(D.x + Math.cos(a) * (R - 2)).toFixed(1)} ${(D.y + Math.sin(a) * (R - 2)).toFixed(1)}`; });
  div('left:0;top:0;width:300px;height:300px', door.p, `<svg width="${DW}" height="${DH}"><circle class="ln u-thin" cx="${D.x}" cy="${D.y}" r="${R + 10}"/></svg>`);
  const dial = div(`left:0;top:0;width:${DW}px;height:${DH}px;transform-origin:${D.x}px ${D.y}px`, door.p,
    `<svg width="${DW}" height="${DH}"><circle class="fl" cx="${D.x}" cy="${D.y}" r="${R}"/><circle class="u-fl-edge" cx="${D.x}" cy="${D.y}" r="${R}"/>${ticks.map(d => `<path class="u-fl-edge" d="${d}"/>`).join('')}` +
    `<circle class="ac" cx="${D.x}" cy="${D.y - R + 26}" r="7"/><circle class="u-fl-edge" cx="${D.x}" cy="${D.y}" r="14"/></svg>`);
  const turns = [[T.b[1] - .1, 0], [T.b[1] + .3, 150], [T.b[2] - .15, 150], [T.b[2] + .2, -110], [Math.max(T.b[2] + .25, open - .35), -110], [Math.max(T.b[2] + .4, open - .12), 20]];
  R9.track(dial, 'transform', turns, v => `rotate(${v}deg)`, 'cubic-bezier(.5,0,.3,1)');
  /* the handle: three spokes on the right of the door */
  const hx = DW - 50, hy = DH / 2;
  const hd = div(`left:0;top:0;width:${DW}px;height:${DH}px;transform-origin:${hx}px ${hy}px`, door.p,
    `<svg width="${DW}" height="${DH}"><path class="ln u-thin" d="M${hx} ${hy}L${hx} ${hy - 30}M${hx} ${hy}L${hx + 26} ${hy + 15}M${hx} ${hy}L${hx - 26} ${hy + 15}"/><circle class="sd" cx="${hx}" cy="${hy}" r="9"/></svg>`);
  A(hd, [{transform: 'rotate(0)'}, {transform: 'rotate(90deg)'}], open - .2, .22, {e: EASE.inout, f: 'both'});
  [.18, .82].forEach(f => div(`left:-6px;top:${DH * f - 16}px;width:12px;height:32px;border-radius:4px;background:var(--sd)`, door.p));
  /* the door swings open toward the viewer and to the left */
  A(door.m, [{transform: 'perspective(900px) rotateY(0)'}, {transform: 'perspective(900px) rotateY(-112deg)'}], open, .6, {e: EASE.smooth, f: 'both'});
});

/* ================= B16 นิยาม: term {icon?, label}, means [1-3 {icon, label?}] ================= */
/* 6 · a vending machine: the word on its sign, the meanings on its shelves; a coin drops in, it shakes, and the meaning comes out */
R3.both('B16', 'vending', 'ตู้หยอดเหรียญ ใส่คำเข้าไป ได้ความหมายออกมา', (K, s, T, g) => {
  const term = s.term ?? {}, means = (s.means ?? []).slice(0, 3), X = 64, Y = 8, W = 240, H = 324;
  const mc = R6.group(g); mc.style.transformOrigin = `${X + W / 2}px ${Y + H}px`;
  const box = R9.card(mc, X, Y, W, H, 26); K.enter(box.o, T.b[0], 'rise');
  /* the sign on top: the word */
  const sg = R9.acc(box.p, 14, 14, W - 28, 58, 14); sg.p.style.boxShadow = 'none';
  if (term.icon) R9.ico(sg.p, term.icon, 30, 29, 30, 'u-bubble-text');
  if (term.label) { const w = R6.wordL(K, sg.p, term.label, term.icon ? 52 : 16, 8, 34, null, W - 28 - (term.icon ? 66 : 32)); w.classList.add('u-bubble-text'); }
  /* the window with two shelves of goods (the meanings' icons) */
  const win = div(`left:14px;top:84px;width:150px;height:152px;border-radius:12px;background:var(--tr)`, box.p);
  void win;
  div('left:14px;top:84px;width:150px;height:152px', box.p, `<svg width="150" height="152"><path class="ln u-thin" d="M8 70H142M8 140H142"/></svg>`);
  const goods = means.length ? means : [{icon: term.icon ?? 'package'}];
  [0, 1, 2, 3].forEach(k => { const m = goods[k % goods.length]; R9.ico(box.p, m.icon, 14 + 40 + (k % 2) * 70, 84 + 38 + Math.floor(k / 2) * 70, 44); });
  /* the coin slot and the buttons, the tray at the bottom */
  div('left:180px;top:96px;width:12px;height:44px;border-radius:6px;background:var(--sd)', box.p);
  [0, 1, 2].forEach(k => div(`left:${175 + 0}px;top:${158 + k * 28}px;width:22px;height:18px;border-radius:6px;background:var(--tr)`, box.p));
  div(`left:28px;top:256px;width:${W - 56}px;height:44px;border-radius:12px;background:var(--sd)`, box.p);
  /* the coin flies in from the right and drops into the slot */
  const coin = R7.plain(g, X + 166, Y + 92, 44, 44, 'acc', '50%');
  K.fade(coin.o, T.b[1] - .25, 0, 1, {hold: true});
  A(coin.m, [{transform: 'translate(240px,-60px)'}, {transform: 'translate(0,0)', offset: .7}, {transform: 'translate(0,0) scaleX(.2)'}], T.b[1] - .25, .6, {e: EASE.inout, f: 'both'});
  K.fade(coin.o, T.b[1] + .35, 1, 0);
  /* it thinks: a shake */
  A(mc, [0, -2, 2, -2, 2, -1, 0].map(r => ({transform: `rotate(${r}deg)`})), T.b[2], .5, {e: 'ease-in-out', f: 'none'});
  /* the meaning: a card pushed out of the tray, then up to its place on the right */
  const MW = 236, MH = 54 + 50 * Math.max(1, means.length), mx = 312, my = Math.min(150, 316 - MH);
  const out = R9.card(g, mx, my, MW, MH, 18);
  K.fade(out.o, T.hit - .1, 0, 1, {hold: true});
  A(out.m, [{transform: `translate(${X + 40 - mx}px,${Y + 250 - my}px) scale(.3)`}, {transform: 'none'}], T.hit - .1, .5, {e: EASE.spring, f: 'both'});
  const land = T.hit + .35;
  K.punch(out.p, land);
  const hd = R9.acc(out.p, 0, 0, MW, 16, '18px 18px 0 0'); hd.p.style.boxShadow = 'none';
  (means.length ? means : [{icon: term.icon ?? 'package', label: term.label}]).forEach((m, k) => {
    R9.ico(out.p, m.icon, 34, 50 + k * 50, 34);
    if (m.label) R6.wordL(K, out.p, m.label, 62, 30 + k * 50, 32, null, MW - 76);
  });
  R1.ripple(K, out, land + .05);
});

/* ================= B20 ความสัมพันธ์: a {icon, label?}, b {icon, label?}, label?, cut? ================= */
/* 8 · two tin cans and a string: it pulls tight, a sound runs along it from one to the other; if it is over, the string snaps */
R3.both('B20', 'cans', 'โทรศัพท์กระป๋อง เสียงวิ่งตามเชือก', (K, s, T, g) => {
  const a = s.a ?? {icon: 'user'}, b = s.b ?? {icon: 'user'}, cut = !!s.cut, Y = 174, CW = 148, CH = 112;
  const can = (p, x, flip, t) => {
    const c = R9.card(g, x, Y - CH / 2, CW, CH, 26); K.enter(c.o, t, 'rise');
    div(`left:${flip ? CW - 30 : 22}px;top:8px;width:8px;height:${CH - 16}px;border-radius:4px;background:var(--tr)`, c.p);
    const m = div(`left:${flip ? -16 : CW - 16}px;top:${CH / 2 - 44}px;width:32px;height:88px`, c.p,
      `<svg width="32" height="88"><ellipse class="sd" cx="16" cy="44" rx="13" ry="42"/></svg>`);
    void m;
    const cx = flip ? CW / 2 + 12 : CW / 2 - 12;
    R9.ico(c.p, p.icon, cx, p.label ? 38 : CH / 2, p.label ? 44 : 56);
    if (p.label) R4.word(K, c.p, p.label, cx, 64, 28, null, CW - 50);
    return c;
  };
  const A1 = can(a, 34, false, T.b[0]), B1 = can(b, 396, true, T.b[0] + .1);
  const x0 = 34 + CW + 10, x1 = 396 - 10, mx = (x0 + x1) / 2;
  const slack = `path("M${x0} ${Y}Q${mx} ${Y + 70} ${x1} ${Y}")`, taut = `path("M${x0} ${Y}Q${mx} ${Y + 2} ${x1} ${Y}")`;
  const str = R8.svg(g, `<path class="ln u-thin" d="M${x0} ${Y}Q${mx} ${Y + 70} ${x1} ${Y}"/>`), sp = str.querySelector('path');
  K.draw(sp, T.b[0] + .25, .4);
  A(sp, [{d: slack}, {d: taut}], T.b[1], .35, {e: EASE.spring, f: 'both'});
  A(A1.m, [{transform: 'none'}, {transform: 'translateX(-14px)'}], T.b[1], .35, {e: EASE.spring, f: 'forwards'});
  A(B1.m, [{transform: 'none'}, {transform: 'translateX(14px)'}], T.b[1], .35, {e: EASE.spring, f: 'forwards'});
  /* the sound: arcs at the speaking can, then pulses run along the string to the other one */
  const arcs = R8.svg(g, [0, 1, 2].map(k => `<path class="ln u-thin" d="M${x0 + 6 + k * 14} ${Y - 30 - k * 8}Q${x0 + 20 + k * 14} ${Y} ${x0 + 6 + k * 14} ${Y + 30 + k * 8}"/>`).join(''));
  arcs.classList.add('u-decor'); arcs.style.opacity = 0;
  A(arcs, [{opacity: 0}, {opacity: 1}, {opacity: 0}], T.b[1] + .3, .5, {it: 2, f: 'none'});
  const go = T.b[1] + .4, arrive = cut ? T.b[2] + .35 : T.hit - .05;
  [0, 1, 2].forEach(k => {
    const d = R7.plain(g, x0 - 9, Y - 9, 18, 18, 'acc', '50%'); d.o.classList.add('u-decor'); d.o.style.opacity = 0;
    const t = go + k * (arrive - go - .5) / 2;
    A(d.o, [{opacity: 0}, {opacity: 1, offset: .1}, {opacity: 1, offset: .9}, {opacity: 0}], t, .5, {f: 'none'});
    A(d.m, [{transform: 'translateX(0)'}, {transform: `translateX(${x1 - x0}px)`}], t, .5, {e: 'linear', f: 'none'});
  });
  if (!cut) {
    K.punch(B1.p, arrive + .05); R1.ripple(K, B1, arrive + .1);
    if (s.label) { const sg = R9.acc(g, mx - 80, 46, 160, 56, 14); R9.accWord(K, sg.p, s.label, 80, 8, 32, null, 140); K.enter(sg.o, T.hit + .05, 'pop'); }
    return;
  }
  if (s.label) { const sg = R9.acc(g, mx - 80, 46, 160, 56, 14); R9.accWord(K, sg.p, s.label, 80, 8, 32, null, 140); K.enter(sg.o, T.b[2], 'pop'); K.fade(sg.o, T.hit + .3, 1, .55); }
  /* it snaps in the middle: two loose ends hang down from the cans */
  R7.hide(str, T.hit);
  const ends = R8.svg(g, `<path class="ln u-thin" d="M${x0} ${Y}Q${x0 + 40} ${Y} ${mx - 6} ${Y}"/><path class="ln u-thin" d="M${x1} ${Y}Q${x1 - 40} ${Y} ${mx + 6} ${Y}"/>`);
  R7.show(ends, T.hit);
  const [e1, e2] = ends.querySelectorAll('path');
  A(e1, [{d: `path("M${x0} ${Y}Q${x0 + 40} ${Y} ${mx - 6} ${Y}")`}, {d: `path("M${x0} ${Y}Q${x0 + 24} ${Y + 60} ${x0 + 30} ${Y + 120}")`}], T.hit, .5, {e: EASE.bounce, f: 'forwards'});
  A(e2, [{d: `path("M${x1} ${Y}Q${x1 - 40} ${Y} ${mx + 6} ${Y}")`}, {d: `path("M${x1} ${Y}Q${x1 - 24} ${Y + 60} ${x1 - 30} ${Y + 120}")`}], T.hit, .5, {e: EASE.bounce, f: 'forwards'});
  K.mark(g, 'cross', mx, Y, 60, T.hit + .1);
  K.fade(B1.o, T.hit + .35, 1, .5);
});

/* ================= B08 เป้าหมาย: goal {icon, label?}, who? {icon} ================= */
/* 18 · a rocket takes off from the corner and flies up its trail to a big star (the goal); a flag with the goal pops up */
R3.both('B08', 'rocket', 'จรวดพุ่งขึ้นไปถึงดาว', (K, s, T, g) => {
  const it = s.goal ?? {icon: 'trophy'}, S = {x: 462, y: 82, r: 70};
  const starPts = [...Array(10)].map((_, i) => { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 46 : 100; return `${(50 + Math.cos(a) * r / 2).toFixed(1)}% ${(50 + Math.sin(a) * r / 2).toFixed(1)}%`; }).join(',');
  [[340, 40], [540, 200], [250, 110], [420, 230]].forEach(([x, y], k) => {
    const tw = R8.svg(g, `<path class="ln u-thin" d="M${x - 8} ${y}H${x + 8}M${x} ${y - 8}V${y + 8}"/>`); tw.classList.add('u-decor');
    A(tw, [{opacity: .2, transform: 'scale(.6)'}, {opacity: 1, transform: 'none'}, {opacity: .2, transform: 'scale(.6)'}], T.b[0] + k * .2, .8, {it: 4, f: 'none'});
    tw.style.transformOrigin = `${x}px ${y}px`;
  });
  const star = node(g, S.x - S.r, S.y - S.r, 2 * S.r, 2 * S.r, '');
  const sp = div(`inset:0;clip-path:polygon(${starPts})`, star.p); sp.className = 'u-badge u-acc'; sp.style.borderRadius = '0';
  R9.ico(sp, it.icon, S.r, S.r + 6, 46, 'u-bubble-text');
  K.enter(star.o, T.b[0] + .1, 'pop');
  A(star.f, [{transform: 'rotate(0)'}, {transform: 'rotate(8deg)'}, {transform: 'rotate(0)'}], T.b[0] + .6, 1.4, {it: 2, e: 'ease-in-out', f: 'none'});
  /* the trail, drawn as the rocket climbs */
  const path = `M90 300C150 250 220 250 270 206S330 150 ${S.x - 100} ${S.y + 46}`, go = T.b[1] - .1, hit = T.hit;
  const tr = R8.svg(g, `<path class="ln u-thin u-dash" d="${path}"/>`); K.draw(tr.querySelector('path'), go, hit - go);
  /* the rocket: a body, a window, two fins, a flickering flame; it leans along the way it flies */
  const rk = node(g, 0, 0, 0, 0, ''), body = div('left:-22px;top:-58px;width:44px;height:116px;transform:scale(1.3)', rk.p,
    `<svg width="44" height="140" style="overflow:visible"><path class="ac" d="M10 96Q22 140 34 96Z"/><path class="sd" d="M2 92L-14 112L4 104ZM42 92L58 112L40 104Z"/>` +
    `<path class="fl" d="M22 0C40 18 44 52 40 98H4C0 52 4 18 22 0Z"/><path class="u-fl-edge" d="M22 0C40 18 44 52 40 98H4C0 52 4 18 22 0Z"/><circle class="u-fl-edge" cx="22" cy="44" r="9"/></svg>`);
  body.firstChild.querySelector('.ac').style.transformOrigin = '22px 96px';
  A(body.firstChild.querySelector('.ac'), [{transform: 'scaleY(1)'}, {transform: 'scaleY(1.5)'}, {transform: 'scaleY(.9)'}], T.b[0], .18, {it: 20, f: 'none'});
  K.enter(rk.o, T.b[0], 'rise');
  const tmp = R8.svg(g, `<path d="${path}" style="fill:none;stroke:none"/>`), pts = R8.along(tmp.querySelector('path'), 24);
  const ang = pts.map((p, i) => { const q = pts[Math.min(pts.length - 1, i + 1)], o = pts[Math.max(0, i - 1)]; return Math.atan2(q.y - o.y, q.x - o.x) * 180 / Math.PI + 90; });
  A(rk.m, pts.map((p, i) => ({transform: `translate(${p.x.toFixed(1)}px,${p.y.toFixed(1)}px) rotate(${ang[i].toFixed(1)}deg)`, offset: i / (pts.length - 1)})), go, hit - go, {e: 'cubic-bezier(.5,0,.6,1)', f: 'both'});
  A(rk.p, [{transform: 'none'}, {transform: 'translate(2px,1px)'}, {transform: 'translate(-2px,-1px)'}, {transform: 'none'}], T.b[0] + .2, .12, {it: Math.max(1, Math.floor((go - T.b[0] - .2) / .12)), f: 'none'});
  /* smoke at the start (decoration) */
  [[70, 330], [118, 334], [92, 344]].forEach(([x, y], k) => {
    const p = div(`left:${x - 18}px;top:${y - 18}px;width:36px;height:36px;border-radius:50%;background:var(--tr);opacity:0`, g); p.className = 'u-decor';
    A(p, [{opacity: 1, transform: 'scale(.4)'}, {opacity: 0, transform: `translate(${(k - 1) * 30}px,-10px) scale(1.8)`}], go + k * .05, .7, {f: 'none'});
  });
  /* arrival: the star flashes, the goal's flag pops beside it */
  K.punch(star.p, hit + .02); R6.burst(K, g, S.x, S.y, S.r - 6, hit + .05, 10);
  if (it.label) { const fg = R9.card(g, S.x - 236, 10, 176, 56, 14); R4.word(K, fg.p, it.label, 88, 8, 32, null, 158); K.enter(fg.o, hit + .15, 'pop'); }
});

/* ================= sentences to try round 9 (not Friend's script; one per variant, plus the other forms) ================= */
SENTENCE('r9.diet', {cat: 'B09', name: 'อาทิตย์แรก เดือนแรก สามเดือน', say: ['ลดน้ำหนักมาครบ', 'สามเดือนแล้ว'],
  points: [{icon: 'calendar', label: 'อาทิตย์แรก'}, {icon: 'calendar-days', label: 'เดือนแรก'}, {icon: 'calendar-check', label: 'สามเดือน'}], at: 2, result: {icon: 'trophy'}});
SENTENCE('r9.wait', {cat: 'B09', name: 'รอมาครึ่งทาง', say: ['ตอนนี้เพิ่งผ่านมา', 'ครึ่งทาง'],
  points: [{icon: 'flag', label: 'เริ่มต้น'}, {icon: 'map-pin', label: 'ครึ่งทาง'}, {icon: 'flag-triangle-right', label: 'เส้นชัย'}], at: 1});
SENTENCE('r9.price', {cat: 'B13', name: 'เคล็ดลับคือตั้งราคาลงท้ายเก้า', say: ['เคล็ดลับคือ', 'ราคาลงท้ายเก้า'], secret: {icon: 'tag', label: 'ลงท้ายเก้า'}});
SENTENCE('r9.cash', {cat: 'B16', name: 'กระแสเงินสดคือเงินเข้าออก', say: ['กระแสเงินสดก็คือ', 'เงินเข้าออก'],
  term: {icon: 'wallet', label: 'กระแสเงินสด'}, means: [{icon: 'arrow-down-left', label: 'เงินเข้า'}, {icon: 'arrow-up-right', label: 'เงินออก'}]});
SENTENCE('r9.friend', {cat: 'B20', name: 'เพื่อนสนิทตั้งแต่ประถม', say: ['เราสองคนเป็น', 'เพื่อนสนิทกัน'], a: {icon: 'user', label: 'ผม'}, b: {icon: 'user', label: 'ต้น'}, label: 'เพื่อนสนิท'});
SENTENCE('r9.ex', {cat: 'B20', name: 'แฟนเก่า เลิกกันแล้ว', say: ['สุดท้ายก็', 'เลิกกันไป'], a: {icon: 'user', label: 'ผม'}, b: {icon: 'user', label: 'เขา'}, label: 'แฟนเก่า', cut: true});
SENTENCE('r9.partner', {cat: 'B20', name: 'ร้านกับซัพพลายเออร์', say: ['ร้านเราคุยกับ', 'ซัพพลายเออร์ทุกวัน'], a: {icon: 'store', label: 'ร้านเรา'}, b: {icon: 'truck', label: 'ซัพพลาย'}});
SENTENCE('r9.japan', {cat: 'B21', name: 'ไปญี่ปุ่น โตเกียว', say: ['ทริปนี้ไป', 'โตเกียว'], place: {icon: 'plane', label: 'โตเกียว'}});
SENTENCE('r9.cafe', {cat: 'B21', name: 'คาเฟ่ชั้นสอง ริมหน้าต่าง', say: ['คาเฟ่นี้อยู่ชั้นสอง', 'ริมหน้าต่าง'], place: {icon: 'coffee', label: 'คาเฟ่บ้านไม้'}, spots: [{icon: 'layers', label: 'ชั้นสอง'}, {icon: 'sun', label: 'ริมหน้าต่าง'}]});
SENTENCE('r9.dream', {cat: 'B08', name: 'ได้บ้านหลังแรก', say: ['สุดท้ายก็ได้', 'บ้านหลังแรก'], goal: {icon: 'house', label: 'บ้านหลังแรก'}});