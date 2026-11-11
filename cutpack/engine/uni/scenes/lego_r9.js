/* =====================================================================
   CutPack · uni · LEGO round 9 (Friend 2026-11-11: "เริ่มรอบที่ 9 ตามตารางที่เสนอเลยครับ"): two new variants for ten
   categories. Friend felt the library had started to look alike ("motion graphics หน้าตามันเริ่มจะคล้ายๆกันไปแล้วจากรอบที่
   1-8"), so this round follows five look rules on top of the usual ones (DECISIONS, round 9):
     1 one big thing drawn as a real shape, never an icon in a tile      2 words sit ON the thing, no pill labels
     3 things may run past the canvas edge (clipped)                     4 the thing changes shape over time, not just pops in
     5 no person-in-a-circle
   Same slots as before (cat_ai.py), same frame rules (R3.both: one composition on the 600 × 340 small canvas, scaled 1.6×
   full screen; nothing past x 550 below y 200; words only from the slots; cards never overlap at rest).
     B09 เวลา         เทียนไขละลายสั้นลงทีละขั้น (candle) · รถไฟวิ่ง ป้ายสถานีผ่านทีละป้าย (train)
     B13 เคล็ดลับ      ตู้เซฟหมุนรหัส แล้วประตูเปิด (safe) · ~~หอยเปิดเจอไข่มุก (pearl)~~ ลบแล้ว Friend 2026-11-11 "ลบ ไม่ชอบ"
     B16 นิยาม        ตู้หยอดเหรียญ ได้ความหมายออกมา (vending) · ~~ตัวอักษรตกลงมา (letters)~~ ลบแล้ว Friend 2026-11-11 "ลบเลยครับ ผมไม่ชอบ"
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

/* ================= B09 เวลา: points? [3 {icon, label}], at?, result? ================= */
/* 1 · a pillar candle with the moments marked down its side; the flame burns down past them and stops at "at" */
R3.both('B09', 'candle', 'เทียนไขละลายสั้นลงทีละขั้น', (K, s, T, g) => {
  const pts = (s.points ?? []).slice(0, 3), n = pts.length, at = n ? Math.min(s.at ?? n - 1, n - 1) : 2;
  const res = s.result, cx = res ? 186 : 300, W = 190, top = 62, bot = 318, H = bot - top;
  const lv = [48, 110, 172];                                       // the marks, from the candle's top
  const plate = R7.plain(g, cx - 130, bot - 6, 260, 22, 'main', '11px'); K.enter(plate.o, T.b[0], 'pop');
  /* the candle: a drawn wax pillar (light, with its edge) and, wrapped round it, a paper band for each moment */
  const cg = R6.group(g); K.enter(cg, T.b[0] + .05, 'rise');
  const x0 = cx - W / 2, wax = `M${x0} ${top + 14}Q${x0} ${top} ${x0 + 14} ${top}H${x0 + W - 14}Q${x0 + W} ${top} ${x0 + W} ${top + 14}V${bot}H${x0}Z`;
  R8.svg(cg, `<path class="fl" d="${wax}"/><path class="u-fl-edge" d="${wax}"/>`);
  pts.forEach((p, k) => {
    const b = R9.card(cg, x0 + 12, top + lv[k] - 4, W - 24, 48, 10);
    if (p.label) R4.word(K, b.p, p.label, (W - 24) / 2, 4, 30, null, W - 44);
    else if (p.icon) R9.ico(b.p, p.icon, (W - 24) / 2, 24, 30);
    K.enter(b.o, T.b[0] + .25 + k * .08, 'pop');
  });
  if (!n) [0, 1, 2].forEach(k => R8.svg(cg, `<path class="u-fl-edge" d="M${x0 + 16} ${top + lv[k] + 20}H${x0 + W - 16}"/>`));
  /* the burn: the candle loses its top mark by mark (clip), the flame and its wick come down with it */
  const tk = R7.steps(T, 3, at, T.b[1] + .1), dy = k => lv[k] - 14, burn = [[T.b[0] + .5, 0]];
  for (let k = 0; k <= at; k++) burn.push([tk[k], dy(k)]);
  R9.track(cg, 'clipPath', burn, v => `inset(${top + v}px -60px -60px -60px)`);
  /* the wick and the flame ride down with the top */
  const fl = R6.group(g);
  R8.svg(fl, `<path class="ln u-thin" d="M${cx} ${top + 4}V${top - 14}"/>`);
  const fx = div(`left:${cx - 30}px;top:${top - 96}px;width:60px;height:84px`, fl,
    `<svg width="60" height="84"><path class="ac" d="M30 2C40 22 58 38 58 58A28 28 0 0 1 2 58C2 38 20 22 30 2Z"/><path class="fl" d="M30 40C34 48 41 54 41 62A11 11 0 0 1 19 62C19 54 26 48 30 40Z"/></svg>`);
  K.enter(fl, T.b[0] + .3, 'pop');
  fx.firstChild.style.transformOrigin = '50% 100%';
  A(fx.firstChild, [{transform: 'scale(1,1)'}, {transform: 'scale(.9,1.08) skewX(-3deg)'}, {transform: 'scale(1.06,.95) skewX(3deg)'}, {transform: 'scale(1,1)'}],
    T.b[0] + .5, .46, {e: 'ease-in-out', f: 'none', it: 9});
  const glow = div(`left:${cx - 70}px;top:${top - 120}px;width:140px;height:140px;border-radius:50%`, fl); glow.className = 'u-halo u-decor';
  R9.track(fl, 'transform', burn, v => `translateY(${v}px)`);
  /* the moment it stops on lights up on its band */
  if (pts[at]) {
    const hl = R9.acc(cg, x0 + 12, top + lv[at] - 4, W - 24, 48, 10); K.enter(hl.o, T.hit, 'pop');
    if (pts[at].label) R9.accWord(K, hl.p, pts[at].label, (W - 24) / 2, 4, 30, null, W - 44);
    else R9.ico(hl.p, pts[at].icon, (W - 24) / 2, 24, 30, 'u-bubble-text');
  }
  if (res) {
    const r = R9.ico(g, res.icon, 440, 138, 104); K.enter(r, T.hit + .15, 'pop'); R6.burst(K, g, 440, 138, 62, T.hit + .3);
    if (res.label) R4.word(K, g, res.label, 440, 200, 34, T.hit + .3, 200);
  }
});

/* 2 · a train runs; the stations' signs slide past one by one and the train stops under the sign of "at" */
R3.both('B09', 'train', 'รถไฟวิ่ง ป้ายสถานีผ่านทีละป้าย', (K, s, T, g) => {
  const pts = s.points.slice(0, 3), n = pts.length, at = Math.min(s.at ?? n - 1, n - 1);
  const clip = R9.clip(g), stopT = T.hit;
  /* the signs: one for each moment, from the right edge to the left; the one of "at" slows down and stops in the middle */
  const tk = R7.steps(T, n, at, T.b[1]);
  pts.slice(0, at + 1).forEach((p, k) => {
    const sg = R6.group(clip), SW = 214, x = 300 - SW / 2;
    div(`left:0;top:0;width:600px;height:340px`, sg, `<svg width="600" height="340"><path class="ln u-thin" d="M${x + 40} 108V184M${x + SW - 40} 108V184"/></svg>`);
    const c = R9.card(sg, x, 18, SW, 94, 16);
    const band = R9.acc(c.p, 0, 0, SW, 18, '16px 16px 0 0'); band.p.style.boxShadow = 'none';
    if (p.icon) R9.ico(c.p, p.icon, 40, 56, 40);
    if (p.label) R6.wordL(K, c.p, p.label, p.icon ? 70 : 18, 32, 34, null, SW - (p.icon ? 84 : 36));
    if (k < at) A(sg, [{transform: 'translateX(560px)'}, {transform: 'translateX(-560px)'}], tk[k] - .5, 1, {f: 'both'});
    else { const go = at ? Math.max(tk[at - 1] + .3, stopT - 1.1) : stopT - 1.1;
      A(sg, [{transform: 'translateX(540px)'}, {transform: 'none'}], go, stopT - go, {e: 'cubic-bezier(.25,.7,.35,1)', f: 'both'}); }
  });
  /* the rails and the sleepers rushing by until the stop */
  const rail = R8.svg(g, `<path class="ln u-thin" d="M24 316H540"/>`); K.draw(rail.querySelector('path'), T.b[0], .4);
  const sl = div('left:24px;top:300px;width:516px;height:16px;overflow:hidden', g);
  const sk = R8.svg(sl, `<path class="ln u-thin u-dash" d="M-60 8H700"/>`); sk.classList.add('u-decor');
  A(sk, [{transform: 'translateX(0)'}, {transform: 'translateX(-60px)'}], T.b[0], .12, {it: Math.ceil((stopT - T.b[0]) / .12), f: 'none'});
  /* the train: one long car, nose to the right, windows along it; it rocks while it runs and dips once when it stops */
  const tr = R6.group(g); tr.style.transformOrigin = '300px 300px';
  const car = R9.card(tr, 44, 192, 470, 92, '22px 64px 18px 18px'); K.enter(car.o, T.b[0], 'rise');
  const wins = [0, 1, 2, 3].map(i => { const w = div(`left:${24 + i * 96}px;top:16px;width:74px;height:40px;border-radius:10px;background:var(--tr)`, car.p); return w; });
  void wins;
  const st = R9.acc(car.p, 0, 64, 470, 10, 0); st.p.style.boxShadow = 'none';
  [118, 196, 352, 430].forEach((x, i) => {
    const wh = div(`left:${x - 22}px;top:262px;width:44px;height:44px`, tr,
      `<svg width="44" height="44"><circle class="fl" cx="22" cy="22" r="20"/><circle class="u-fl-edge" cx="22" cy="22" r="20"/><path class="u-fl-edge" d="M22 6V38M6 22H38"/></svg>`);
    K.enter(wh, T.b[0] + .1 + i * .04, 'pop');
    A(wh.firstChild, [{transform: 'rotate(0)'}, {transform: 'rotate(1440deg)'}], T.b[0] + .2, stopT - T.b[0] - .2, {e: 'cubic-bezier(.3,.2,.6,1)', f: 'both'});
    wh.firstChild.style.transformOrigin = '22px 22px';
  });
  A(tr, [{transform: 'translateY(0)'}, {transform: 'translateY(-3px)'}, {transform: 'translateY(0)'}], T.b[0] + .3, .26, {it: Math.max(1, Math.floor((stopT - T.b[0] - .3) / .26)), f: 'none'});
  A(tr, [{transform: 'rotate(0)'}, {transform: 'rotate(1.6deg)'}, {transform: 'rotate(-.6deg)'}, {transform: 'rotate(0)'}], stopT, .5, {e: 'ease-out', f: 'none'});
  if (s.result) { const r = R9.ico(car.p, s.result.icon, 24 + 3 * 96 + 37, 36, 34); K.enter(r, stopT + .2, 'pop'); }
}, s => (s.points?.length ?? 0) >= 2);

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
/* 7 · two cliffs; plank by plank a rope bridge grows across from both sides; if the link is over, it snaps in the middle */
R3.both('B20', 'bridge', 'สะพานต่อเชื่อมสองฝั่ง (จบกัน สะพานขาด)', (K, s, T, g) => {
  const a = s.a ?? {icon: 'user'}, b = s.b ?? {icon: 'user'}, cut = !!s.cut, Y = 198, L1 = 168, R0 = 412;
  const cliffs = R8.svg(g, `<path class="sd" d="M24 ${Y}H${L1}L${L1 - 12} ${Y + 52}L${L1 + 6} ${Y + 100}L${L1 - 18} 340H24Z"/>` +
    `<path class="sd" d="M${R0} ${Y}H548V340H${R0 + 20}L${R0 - 6} ${Y + 92}L${R0 + 12} ${Y + 48}Z"/>`);
  K.enter(cliffs, T.b[0], 'rise');
  /* the two sides: who stands there, and their names on plaques set into the rock */
  [[a, 96], [b, 480]].forEach(([p, x], i) => {
    const ic = R9.ico(g, p.icon, x, Y - 42, 76); K.enter(ic, T.b[0] + .15 + i * .08, 'pop');
    if (p.label) { const pl = R9.card(g, x - 62, Y + 54, 124, 46, 10); R4.word(K, pl.p, p.label, 62, 6, 28, null, 110); K.enter(pl.o, T.b[0] + .25 + i * .08, 'pop'); }
  });
  /* the ropes and the deck, each in two halves (a half falls on its own when the bridge breaks) */
  const half = (p0, p1, p2) => { const m = [(p0[0] + 2 * p1[0] + p2[0]) / 4, (p0[1] + 2 * p1[1] + p2[1]) / 4];
    return [`M${p0[0]} ${p0[1]}Q${(p0[0] + p1[0]) / 2} ${(p0[1] + p1[1]) / 2} ${m[0]} ${m[1]}`, `M${p2[0]} ${p2[1]}Q${(p1[0] + p2[0]) / 2} ${(p1[1] + p2[1]) / 2} ${m[0]} ${m[1]}`]; };
  const deck = half([L1, Y], [290, Y + 46], [R0, Y]), rail = half([L1, Y - 46], [290, Y - 8], [R0, Y - 46]);
  const side = [0, 1].map(i => { const h = R6.group(g); h.style.transformOrigin = i ? `${R0}px ${Y}px` : `${L1}px ${Y}px`; return h; });
  [0, 1].forEach(i => {
    const p = div('left:0;top:0;width:600px;height:340px', side[i], `<svg width="600" height="340"><path class="ln u-thin" d="${rail[i]}"/><path class="ln u-thin" d="${deck[i]}"/></svg>`);
    p.querySelectorAll('path').forEach(q => K.draw(q, T.b[1] - .15, .5));
    div('left:0;top:0;width:600px;height:340px', g, `<svg width="600" height="340"><rect class="sd" x="${(i ? R0 : L1) - 8}" y="${Y - 58}" width="16" height="60" rx="4"/></svg>`);
  });
  /* the planks: laid from both ends toward the middle, the middle one (accent) on the key word */
  const tmp = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); tmp.style.cssText = 'position:absolute;width:0;height:0'; g.appendChild(tmp);
  const pts = deck.map(d => { const q = document.createElementNS('http://www.w3.org/2000/svg', 'path'); q.setAttribute('d', d); tmp.appendChild(q); return R8.along(q, 5).slice(1); });
  const done = cut ? T.b[2] + .35 : T.hit, t0 = T.b[1] + .1;
  for (let k = 0; k < 5; k++) [0, 1].forEach(i => {
    if (k === 4 && i === 1) return;                                       // the two halves share the middle plank
    const p = pts[i][k], q = k ? pts[i][k - 1] : {x: i ? R0 : L1, y: Y}, l = Math.hypot(p.x - q.x, p.y - q.y) || 1;
    const ux = (p.x - q.x) / l * 9, uy = (p.y - q.y) / l * 9, mx = (p.x + q.x) / 2, my = (p.y + q.y) / 2, mid = k === 4;
    const t = t0 + (done - t0) * k / 4;
    const pl = R8.svg(side[i], `<path class="ln u-thin" d="M${mx.toFixed(1)} ${my.toFixed(1)}L${mx.toFixed(1)} ${(my - 40 + Math.abs(2 - k) * 2).toFixed(1)}"/>` +
      `<path class="${mid ? 'u-acc-line' : 'ln'}" style="stroke-width:16px" d="M${(mx - ux).toFixed(1)} ${(my - uy).toFixed(1)}L${(mx + ux).toFixed(1)} ${(my + uy).toFixed(1)}"/>`);
    K.enter(pl, t, 'drop');
  });
  /* the name of the link, on a sign hung above the middle */
  const sg = s.label ? R9.acc(g, 214, 44, 156, 56, 14) : null;
  if (sg) { R9.accWord(K, sg.p, s.label, 78, 8, 32, null, 136); K.enter(sg.o, done + .05, 'pop'); }
  if (!cut) { if (sg) R1.ripple(K, sg, LG.arrive('pop', done + .05)); return; }
  /* it snaps: each half swings down from its post, a cross where it broke */
  A(side[0], [{transform: 'rotate(0)'}, {transform: 'rotate(62deg)'}], T.hit, .55, {e: EASE.bounce, f: 'forwards'});
  A(side[1], [{transform: 'rotate(0)'}, {transform: 'rotate(-62deg)'}], T.hit, .55, {e: EASE.bounce, f: 'forwards'});
  K.mark(g, 'cross', 290, Y + 24, 64, T.hit + .1);
  if (sg) K.fade(sg.o, T.hit + .3, 1, .55);
});

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

/* ================= B21 สถานที่: place {icon, label?}, spots? [1-2 {icon?, label}] ================= */
/* 9 · a globe spins and slows down; a pin drops onto the place, its name on a card beside it */
R3.both('B21', 'globe', 'ลูกโลกหมุนแล้วหยุด หมุดปักลง', (K, s, T, g) => {
  const pl = s.place ?? {icon: 'map-pin'}, spots = (s.spots ?? []).slice(0, 2), C = {x: 196, y: 180}, R = 140;
  const gl = R6.group(g); K.enter(gl, T.b[0], 'pop');
  R8.svg(gl, `<circle class="fl" cx="${C.x}" cy="${C.y}" r="${R}"/>`);
  /* the map: meridians and land outlines slide by inside the circle (two copies, so it never runs out), slowing to a stop */
  const win = div(`left:${C.x - R}px;top:${C.y - R}px;width:${2 * R}px;height:${2 * R}px;border-radius:50%;overflow:hidden`, gl);
  const land = ['M30 70C60 40 120 46 140 80C156 108 120 130 96 150C70 168 40 140 30 110Z', 'M190 30C220 20 260 40 250 70C240 96 200 90 186 66Z',
    'M170 150C200 130 250 140 262 176C272 210 236 250 200 240C176 232 160 190 170 150Z', 'M60 200C80 190 110 200 112 222C112 246 80 256 62 240C48 228 48 210 60 200Z'];
  const map = (ox) => land.map(d => `<path class="u-fl-edge" transform="translate(${ox} 0)" d="${d}"/>`).join('') +
    [40, 110, 180, 250].map(x => `<path class="u-fl-edge" style="opacity:.5" transform="translate(${ox} 0)" d="M${x} 0C${x - 30} 90 ${x - 30} 190 ${x} 280"/>`).join('');
  const strip = div(`left:0;top:0;width:${10 * R}px;height:${2 * R}px`, win, `<svg width="${10 * R}" height="${2 * R}" style="overflow:visible">${[0, 1, 2, 3, 4].map(k => map(2 * R * k)).join('')}</svg>`);
  const stop = T.hit - .25;
  A(strip, [{transform: 'translateX(0)'}, {transform: `translateX(${-2 * R * 3 - 70}px)`}], T.b[0] + .1, stop - T.b[0] - .1, {e: 'cubic-bezier(.3,.6,.4,1)', f: 'both'});
  win.firstChild.style.transform = 'none'; strip.classList.add('u-decor');      // the map is drawing on the globe: a style that frames what is drawn must not count the hidden copies
  R8.svg(gl, `<circle class="u-fl-edge" cx="${C.x}" cy="${C.y}" r="${R}"/><path class="u-fl-edge" style="opacity:.5" d="M${C.x - R} ${C.y}Q${C.x} ${C.y + 40} ${C.x + R} ${C.y}"/>`);
  /* the pin drops on the key word */
  const P = {x: C.x + 10, y: C.y - 40}, pin = node(g, P.x - 38, P.y - 96, 76, 76, '');
  const head = div('inset:0;border-radius:50% 50% 50% 0;transform:rotate(-45deg)', pin.p); head.className = 'u-badge u-acc';
  R9.ico(head, pl.icon, 38, 38, 38, 'u-bubble-text').style.transform = 'rotate(45deg)';
  K.fade(pin.o, T.hit - .3, 0, 1, {hold: true}); K.move(pin.m, T.hit - .3, 'translateY(-260px)', 'none', {hold: true, kind: 'drop'});
  const land2 = LG.arrive('drop', T.hit - .3);
  const ring = div(`left:${P.x - 40}px;top:${P.y - 12}px;width:80px;height:24px;border-radius:50%;opacity:0`, g); ring.className = 'u-pulse u-pulse-acc u-decor';
  A(ring, [{opacity: 1, transform: 'scale(.4)'}, {opacity: 0, transform: 'scale(2.2)'}], land2, .7, {e: EASE.smooth, f: 'none'});
  /* the name card, joined to the pin by a short line */
  if (pl.label || spots.length) {
    const H = 66 + 46 * spots.length, cx0 = 366, cy0 = Math.max(20, P.y - 70), c = R9.card(g, cx0, cy0, 178, H, 16);
    R6.line(K, g, `M${P.x + 40} ${P.y - 74}L${cx0} ${cy0 + 33}`, land2, .2);
    K.enter(c.o, land2 + .1, 'pop');
    const hd = R9.acc(c.p, 0, 0, 178, 14, '16px 16px 0 0'); hd.p.style.boxShadow = 'none';
    if (pl.label) R4.word(K, c.p, pl.label, 89, 16, 34, null, 158);
    spots.forEach((sp, k) => {
      if (sp.icon) R9.ico(c.p, sp.icon, 26, 84 + k * 46, 26);
      R6.wordL(K, c.p, sp.label ?? '', sp.icon ? 46 : 16, 66 + k * 46, 28, null, sp.icon ? 120 : 150);
    });
  }
});

/* 10 · a shop front: the awning rolls down, the sign above flickers and lights up with the place's name */
R3.both('B21', 'shop', 'หน้าร้าน กันสาดกางออก ป้ายชื่อไฟติด', (K, s, T, g) => {
  const pl = s.place ?? {icon: 'store'}, spots = (s.spots ?? []).slice(0, 2), X = 92, Y = 14, W = 356, H = 306;
  R6.line(K, g, 'M40 322H540', T.b[0], .4);
  const f = R9.card(g, X, Y, W, H, '18px 18px 6px 6px'); K.enter(f.o, T.b[0] + .05, 'rise');
  /* the sign: dark until the key word, then it flickers on */
  const sw = W - 40, off = div(`left:20px;top:16px;width:${sw}px;height:64px;border-radius:12px;background:var(--tr)`, f.p);
  const offW = R4.word(K, off, pl.label ?? '', sw / 2 + (pl.icon ? 20 : 0), 8, 36, null, sw - 90); offW.style.opacity = .45;
  if (pl.icon) { const i0 = R9.ico(off, pl.icon, 36, 32, 34); i0.style.opacity = .45; }
  const on = R9.acc(f.p, 20, 16, sw, 64, 12);
  R9.accWord(K, on.p, pl.label ?? '', sw / 2 + (pl.icon ? 20 : 0), 8, 36, null, sw - 90);
  if (pl.icon) R9.ico(on.p, pl.icon, 36, 32, 34, 'u-bubble-text');
  on.o.style.opacity = 0;
  A(on.o, [{opacity: 0}, {opacity: 1, offset: .15}, {opacity: .1, offset: .3}, {opacity: 1, offset: .45}, {opacity: .3, offset: .6}, {opacity: 1}], T.hit - .15, .5, {f: 'forwards'});
  /* the awning: stripes, scalloped edge, rolled down from under the sign */
  const aw = 30, n = Math.round((W + 20) / aw), AW = n * aw, ax = (W - AW) / 2, ah = 58;
  let st = '';
  for (let i = 0; i < n; i++) st += `<path class="${i % 2 ? 'fl' : 'ac'}" d="M${ax + i * aw} 0H${ax + (i + 1) * aw}V${ah}A${aw / 2} ${aw / 2 - 4} 0 0 1 ${ax + i * aw} ${ah}Z"/>`;
  const awn = div(`left:0;top:92px;width:${W}px;height:${ah + 20}px;transform-origin:50% 0`, f.p,
    `<svg width="${W}" height="${ah + 20}" style="overflow:visible">${st}<path class="u-fl-edge" d="M${ax} 0H${ax + AW}"/>` +
    [...Array(n)].map((_, i) => `<path class="u-fl-edge" d="M${ax + i * aw} 0V${ah}A${aw / 2} ${aw / 2 - 4} 0 0 0 ${ax + (i + 1) * aw} ${ah}V0"/>`).join('') + '</svg>');
  A(awn, [{transform: 'scaleY(0)'}, {transform: 'scaleY(1.08)', offset: .8}, {transform: 'none'}], T.b[1], .55, {e: EASE.smooth, f: 'both'});
  /* the door and the window; the window shows the spots (or the place's own icon) */
  div(`left:${W - 112}px;top:178px;width:76px;height:${H - 178}px;border-radius:10px 10px 0 0;background:var(--tr)`, f.p);
  div(`left:${W - 50}px;top:${178 + (H - 178) / 2}px;width:8px;height:8px;border-radius:50%;background:var(--sd)`, f.p);
  const wn = div(`left:24px;top:178px;width:${W - 160}px;height:96px;border-radius:12px;background:var(--tr)`, f.p);
  if (spots.length) spots.forEach((sp, k) => {
    const y = spots.length > 1 ? 10 + k * 42 : 28;
    if (sp.icon) R9.ico(wn, sp.icon, 26, y + 20, 28);
    R6.wordL(K, wn, sp.label ?? '', sp.icon ? 48 : 14, y, 30, T.b[2] + k * .12, W - 160 - (sp.icon ? 60 : 28));
  });
  else { const i1 = R9.ico(wn, pl.icon, (W - 160) / 2, 48, 54); K.enter(i1, T.b[2], 'pop'); }
  R1.ripple(K, on, T.hit + .4);
});

/* ================= B01 ตัวเลขเด่น: value, unit?, icon?, dir?, money? ================= */
/* 12 · a thermometer: the column climbs (or falls) to the number, which is read off on a card beside it */
R3.both('B01', 'thermo', 'เทอร์โมมิเตอร์ ปรอทขึ้นไปถึงตัวเลข', (K, s, T, g) => {
  const down = s.dir === 'down', pct = /%/.test(String(s.value)) ? Math.min(.95, Math.max(.08, R2.num(s) / 100)) : null;
  const v1 = pct ?? (down ? .26 : .84), v0 = down ? .92 : .04, X = 172, top = 26, bulbY = 278, colTop = top + 14, colBot = bulbY - 30;
  const yOf = v => colBot - (colBot - colTop) * v;
  const glass = `M${X - 22} ${top + 22}A22 22 0 0 1 ${X + 22} ${top + 22}V${bulbY - 34}A44 44 0 1 1 ${X - 22} ${bulbY - 34}Z`;
  const th = R6.group(g); K.enter(th, T.b[0], 'rise');
  R8.svg(th, `<path class="fl" d="${glass}"/>`);
  /* the column: a solid bar from the bulb, its top moved by a clip */
  const col = div(`left:${X - 12}px;top:${colTop}px;width:24px;height:${colBot - colTop + 30}px;border-radius:12px;background:var(--ac)`, th);
  R9.track(col, 'clipPath', [[T.b[0] + .3, v0], [T.b[1], v0], [T.hit, v1]], v => `inset(${(colBot - colTop) * (1 - v)}px 0 0 0 round 12px)`, 'cubic-bezier(.4,0,.2,1)');
  R8.svg(th, `<circle class="ac" cx="${X}" cy="${bulbY}" r="32"/><path class="u-fl-edge" d="${glass}"/>` +
    [...Array(9)].map((_, i) => { const y = yOf(i / 8); return `<path class="u-fl-edge" d="M${X + 22} ${y}H${X + (i % 2 ? 34 : 42)}"/>`; }).join(''));
  /* heat or cold lines at the top of the glass while it moves (decoration) */
  const wave = R8.svg(g, [0, 1, 2].map(k => `<path class="ln u-thin" d="M${X - 26 + k * 26} ${top - 4}q-8 -10 0 -20q8 -10 0 -20"/>`).join('')); wave.classList.add('u-decor'); wave.style.opacity = 0;
  if (!down) A(wave, [{opacity: 0, transform: 'none'}, {opacity: 1, offset: .3}, {opacity: 0, transform: 'translateY(-16px)'}], T.b[1] + .2, .7, {it: 2, f: 'none'});
  /* the reading: a card at the column's height, joined by a pointer; the number counts to its value */
  const yl = yOf(v1), CW = 268, CH = 126, cy = Math.min(Math.max(8, yl - CH / 2), 196 - CH), c = R9.card(g, 260, cy, CW, CH, 18);
  K.enter(c.o, T.b[1], 'pop');
  R6.line(K, g, `M${X + 46} ${yl}L260 ${cy + CH / 2}`, T.hit, .2);
  if (s.icon) R9.ico(c.p, s.icon, 34, 34, 34);
  const num = R2.num(s), str = String(s.value), dec = (str.split('.')[1] ?? '').replace(/\D/g, '').length;
  const fmt = x => { const t = x.toFixed(dec); const [i, f] = t.split('.'); return str.replace(/[\d,]+(\.\d+)?/, (/,/.test(str) ? i.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : i) + (f ? '.' + f : '')); };
  const N = 8, box = div(`left:0;top:${s.unit ? 6 : 22}px;width:${CW}px;height:84px;display:flex;justify-content:center;align-items:center`, c.p);
  for (let k = 0; k <= N; k++) {
    const e = div(`left:0;top:0;width:${CW}px;height:84px;display:flex;justify-content:center;align-items:center;font-size:${R2.fitSize(str, CW - 70, 76)}px`, box);
    e.className = 'u-num'; e.textContent = k === N ? str : fmt(num * (down ? 1 + (N - k) * .12 : k / N));
    const t = T.b[1] + .1 + (T.hit - T.b[1] - .1) * k / N;
    if (k) R7.show(e, t); if (k < N) R7.hide(e, t + (T.hit - T.b[1] - .1) / N);
  }
  if (s.unit) R4.word(K, c.p, s.unit, CW / 2, 84, 30, null, CW - 40);
  K.punch(c.p, T.hit + .05);
  const bulb = node(g, X - 32, bulbY - 32, 64, 64, ''); bulb.p.style.borderRadius = '50%'; R1.ripple(K, bulb, T.hit, {r: '50%'});
});

/* ================= B02 เพิ่มขึ้น / ลดลง: dir, item {icon}, center? {icon, label?}, n?, keep?, end? ================= */
/* 13 · a glass of water: up = a jug pours and the level climbs step by step, one item rising in each new layer;
        down = a straw sips it down to what is left */
R3.both('B02', 'cup', 'เทน้ำใส่แก้ว ระดับน้ำขึ้นหรือลด', (K, s, T, g) => {
  const up = s.dir !== 'down', n = Math.max(2, Math.min(4, s.n ?? 3)), keep = up ? n : Math.max(0, Math.min(n - 1, s.keep ?? 1)), it = s.item ?? {icon: 'droplet'};
  const cx = 250, tw = 210, bw = 160, top = 36, bot = 318, H = bot - top;
  const xl = y => cx - (bw + (tw - bw) * (bot - y) / H) / 2, glassD = `M${cx - tw / 2} ${top}L${cx - bw / 2} ${bot}H${cx + bw / 2}L${cx + tw / 2} ${top}`;
  const lvl = k => .14 + .74 * k / n, l0 = up ? .1 : lvl(n), l1 = lvl(keep);
  const yOf = v => bot - 10 - (H - 22) * v;
  /* the pour (behind the water) */
  const t0 = T.b[1] - .1, t1 = T.hit;
  if (up) {
    const jug = R6.group(g); jug.style.transformOrigin = '470px 70px';
    R8.svg(jug, `<path class="sd" d="M432 26H508V128Q508 140 496 140H444Q432 140 432 128Z"/><path class="sd" d="M432 30L404 50L432 58Z"/><path class="ln u-thin" d="M508 46Q540 60 508 100"/>`);
    K.enter(jug, T.b[0], 'drop');
    A(jug, [{transform: 'rotate(0)'}, {transform: 'rotate(-38deg)'}], t0 - .25, .3, {e: EASE.smooth, f: 'forwards'});
    A(jug, [{transform: 'rotate(-38deg)'}, {transform: 'rotate(0)'}], t1 + .05, .3, {e: EASE.smooth, f: 'forwards'});
    const st = R8.svg(g, `<path class="u-acc-line" style="stroke-width:12px" d="M392 70Q330 60 ${cx + 20} 120V${bot - 20}"/>`);
    R7.show(st, t0); R7.hide(st, t1 + .08); K.draw(st.querySelector('path'), t0, .25);
  }
  /* the water: an accent body under a moving wave, inside the glass's shape */
  const inside = div(`left:0;top:0;width:600px;height:340px;clip-path:polygon(${xl(top + 4) + 8}px ${top + 4}px,${xl(bot) + 8}px ${bot - 8}px,${2 * cx - xl(bot) - 8}px ${bot - 8}px,${2 * cx - xl(top + 4) - 8}px ${top + 4}px)`, g);
  const wat = div('left:0;top:0;width:600px;height:340px', inside);
  const body = node(wat, 0, 20, 600, 400, 'u-badge u-acc'); body.p.style.cssText += ';border-radius:0;box-shadow:none;border:0';
  const wv = div('left:-60px;top:0;width:720px;height:24px', wat, `<svg width="720" height="24"><path class="ac" style="stroke:none" d="M0 22${[...Array(12)].map((_, i) => `Q${i * 60 + 15} ${i % 2 ? 30 : 4} ${i * 60 + 30} 14T${i * 60 + 60} 14`).join('')}V40H0Z"/></svg>`);
  A(wv, [{transform: 'translateX(0)'}, {transform: 'translateX(60px)'}], T.b[0], .9, {it: 5, f: 'none'});
  const steps = [[T.b[0] + .2, l0]];
  if (up) for (let k = 1; k <= n; k++) steps.push([t0 + (t1 - t0) * k / n, lvl(k)]);
  else for (let k = n - 1; k >= keep; k--) steps.push([t0 + (t1 - t0) * (n - k) / (n - keep), lvl(k)]);
  R9.track(wat, 'transform', steps, v => `translateY(${yOf(v) - 10}px)`, 'cubic-bezier(.3,.1,.3,1)');
  /* the items: one in each layer of water, floating; up = they appear as their layer fills, down = they leave as it drains */
  for (let k = 0; k < n; k++) {
    const y = (yOf(lvl(k)) + yOf(lvl(k + 1))) / 2, x = cx + (k % 2 ? 26 : -26);
    const ic = R9.ico(body.p, it.icon, x, y - 20 - (yOf(0) - 10) + 10 - 20, 46, 'u-bubble-text');
    ic.style.top = `${y - 23 - 20}px`; ic.style.left = `${x - 23}px`; wat.appendChild(ic);
    if (up) { ic.style.opacity = 0; A(ic, [{opacity: 0, transform: 'translateY(24px)'}, {opacity: 1, transform: 'none'}], t0 + (t1 - t0) * (k + .6) / n, .35, {f: 'forwards'}); }
    else if (k >= keep) A(ic, [{opacity: 1}, {opacity: 0, transform: 'translateY(-30px) scale(.5)'}], t0 + (t1 - t0) * (n - k - .5) / (n - keep), .3, {f: 'forwards'});
  }
  /* the glass over it all; the marks of each step on its side */
  R8.svg(g, `<path class="ln" d="${glassD}"/>` + [...Array(n)].map((_, k) => { const y = yOf(lvl(k + 1)); return `<path class="ln u-thin" d="M${2 * cx - xl(y) - 30} ${y}H${2 * cx - xl(y) - 12}"/>`; }).join(''));
  if (!up) {                                                          // the straw, and drops going up it
    R6.line(K, g, `M${cx - 30} ${bot - 30}L${cx + 60} 6L${cx + 112} 6`, T.b[0] + .2, .4);
    for (let k = 0; k < 4; k++) { const d = R7.plain(g, cx - 38, bot - 40, 16, 16, 'acc', '50%'); d.o.classList.add('u-decor'); d.o.style.opacity = 0;
      const t = t0 + k * (t1 - t0) / 4; A(d.o, [{opacity: 0}, {opacity: 1, offset: .1}, {opacity: 1, offset: .8}, {opacity: 0}], t, .5, {f: 'none'});
      A(d.m, [{transform: 'none'}, {transform: `translate(${90}px,${-(bot - 46)}px)`}], t, .5, {f: 'none'}); }
  }
  if (s.center) { const c = R9.card(g, 24, 120, 104, 96, 16); R9.ico(c.p, s.center.icon, 52, s.center.label ? 36 : 48, 44); if (s.center.label) R4.word(K, c.p, s.center.label, 52, 58, 26, null, 90); K.enter(c.o, T.b[0] + .15, 'pop'); }
  if (s.end) { const e = R9.ico(g, s.end.icon, 440, 230, 64); K.enter(e, T.hit + .25, 'pop'); }
  K.punch(wat, T.hit);
});

/* 14 · a lift: the floor lights run (up or down) to the key word, ding, the doors slide open on what is inside */
R3.both('B02', 'lift', 'ลิฟต์ ไฟชั้นวิ่งขึ้นหรือลง ประตูเปิด', (K, s, T, g) => {
  const up = s.dir !== 'down', n = Math.max(2, Math.min(4, s.n ?? 3)), keep = up ? n : Math.max(0, Math.min(n - 1, s.keep ?? 1)), it = s.item ?? {icon: 'user'};
  const X = 104, Y = 6, W = 352, H = 326, f = R9.card(g, X, Y, W, H, '24px 24px 8px 8px'); K.enter(f.o, T.b[0], 'rise');
  /* the floor lights above the door: dots lit one after another, the arrow beside them blinks */
  const fl = div(`left:${W / 2 - 110}px;top:16px;width:220px;height:46px;border-radius:23px;background:var(--tr)`, f.p);
  const dots = [...Array(4)].map((_, k) => div(`left:${26 + k * 36}px;top:13px;width:20px;height:20px;border-radius:50%;background:var(--tr)`, fl));
  const ar = R9.ico(fl, up ? 'arrow-up' : 'arrow-down', 190, 23, 30); A(ar, [{opacity: 1}, {opacity: .25}, {opacity: 1}], T.b[1], .4, {it: 3, f: 'none'});
  const run = R7.steps(T, 4, 3, T.b[1]);
  dots.forEach((d, k) => { const on = R7.plain(fl, 26 + (up ? k : 3 - k) * 36, 13, 20, 20, 'acc', '50%'); on.o.style.opacity = 0; R7.show(on.o, run[k]); if (k < 3) R7.hide(on.o, run[k + 1]); void d; });
  if (s.center) R9.ico(f.p, s.center.icon, 34, 39, 34);
  /* the doorway, the cabin inside (its things show once the doors open), the two doors */
  const D = {x: 40, y: 78, w: W - 120, h: H - 92};
  const cab = div(`left:${D.x}px;top:${D.y}px;width:${D.w}px;height:${D.h}px;border-radius:6px;background:var(--tr);overflow:hidden`, f.p);
  const open = T.hit + .1, ins = div('left:0;top:0;width:100%;height:100%', cab); R7.show(ins, open);
  const pos = [[.3, .36], [.7, .36], [.3, .72], [.7, .72]];
  for (let k = 0; k < n; k++) {
    const [px, py] = pos[k], ic = R9.ico(ins, it.icon, D.w * px, D.h * py, 64);
    if (k >= keep) ic.style.opacity = .22;
    else K.enter(ic, open + .15 + k * .06, 'pop');
  }
  [0, 1].forEach(i => {
    const d = div(`left:${i * D.w / 2}px;top:0;width:${D.w / 2}px;height:${D.h}px;background:var(--col, var(--ink))`, cab);
    div(`left:${i ? 4 : D.w / 2 - 10}px;top:${D.h / 2 - 20}px;width:6px;height:40px;border-radius:3px;background:var(--tr)`, d);
    A(d, [{transform: 'none'}, {transform: `translateX(${(i ? 1 : -1) * (D.w / 2 - 6)}px)`}], open, .5, {e: EASE.inout, f: 'forwards'});
  });
  /* the call buttons beside the door: the one of the direction lights first */
  const bx = W - 52;
  ['arrow-up', 'arrow-down'].forEach((a, k) => {
    const b = div(`left:${bx}px;top:${150 + k * 58}px;width:40px;height:40px;border-radius:50%;background:var(--tr)`, f.p); R9.ico(b, a, 20, 20, 24);
    if ((k === 0) === up) { const on = R9.acc(f.p, bx, 150 + k * 58, 40, 40, '50%'); R9.ico(on.p, a, 20, 20, 24, 'u-bubble-text'); K.enter(on.o, T.b[0] + .35, 'pop'); }
  });
  /* ding */
  const ding = R8.svg(g, `<path class="ln u-thin" d="M${X + W / 2 - 150} 30l-22 -10M${X + W / 2 - 150} 46h-26M${X + W / 2 + 150} 30l22 -10M${X + W / 2 + 150} 46h26"/>`); ding.classList.add('u-decor'); ding.style.opacity = 0;
  A(ding, [{opacity: 0}, {opacity: 1}, {opacity: 0}], T.hit, .5, {f: 'none'});
  if (s.end) { const e = R9.ico(g, s.end.icon, 500, 60, 56); K.enter(e, open + .4, 'pop'); }
});

/* ================= B14 ประโยคเด็ด: idea {icon, label?} ================= */
/* 15 · a small plane flies in from the edge towing a long banner with the line on it; it glides over the middle */
R3.both('B14', 'plane', 'เครื่องบินลากป้ายผ้าผ่านฟ้า', (K, s, T, g) => {
  const it = s.idea ?? {icon: 'sparkles'}, clip = R9.clip(g);
  [[396, 236, .9], [64, 214, .7], [250, 270, .6]].forEach(([x, y, k], i) => {
    const c = R8.svg(clip, `<g transform="translate(${x} ${y}) scale(${k})"><path class="fl" d="${R8.CLOUD}"/><path class="u-fl-edge" d="${R8.CLOUD}"/></g>`); c.classList.add('u-decor');
    A(c, [{transform: 'translateX(-30px)', opacity: 0}, {transform: 'translateX(0)', opacity: 1, offset: .15}, {transform: 'translateX(40px)', opacity: 1}], T.b[0] + i * .1, T.t1 - T.b[0], {f: 'both'});
  });
  const fly = R6.group(clip), bob = R6.group(fly);
  /* the plane (facing left) */
  R8.svg(bob, `<path class="sd" d="M40 96Q40 78 64 76H150Q164 76 168 66L180 50H192L186 80Q190 92 178 96Z"/><path class="sd" d="M92 92L120 126H136L124 92Z"/>` +
    `<path class="sd" d="M100 80L126 52H140L128 80Z"/><circle class="ac" cx="64" cy="86" r="8"/><path class="ln u-thin" d="M40 70V104"/>`);
  /* the rope and the banner behind it */
  R8.svg(bob, `<path class="ln u-thin" d="M192 86L214 74M192 86L214 112"/>`);
  const bw = 290, ban = R9.card(bob, 214, 52, bw, 82, '6px 14px 14px 6px');
  const hem = R9.acc(ban.p, 0, 0, 16, 82, '6px 0 0 6px'); hem.p.style.boxShadow = 'none';
  if (s.idea?.label) { R9.ico(ban.p, it.icon, 52, 41, 38); R6.wordL(K, ban.p, it.label, 82, 18, 38, null, bw - 100); }
  else R9.ico(ban.p, it.icon, bw / 2, 41, 52);
  ban.f.style.transformOrigin = '0 50%';
  A(ban.f, [{transform: 'skewY(0) scaleX(1)'}, {transform: 'skewY(2.4deg) scaleX(.985)'}, {transform: 'skewY(-2deg) scaleX(1)'}, {transform: 'skewY(0) scaleX(1)'}], T.b[0], .7, {it: 6, e: 'ease-in-out', f: 'none'});
  A(fly, [{transform: 'translateX(560px)'}, {transform: 'translateX(0)', offset: .8}, {transform: 'translateX(-24px)'}], T.b[0] - .1, T.hit - T.b[0] + .1 + 1.4, {e: 'cubic-bezier(.2,.7,.3,1)', f: 'both'});
  A(bob, [{transform: 'translateY(0)'}, {transform: 'translateY(-6px)'}, {transform: 'translateY(0)'}], T.b[0], 1.1, {it: 4, e: 'ease-in-out', f: 'none'});
  K.punch(ban.p, T.hit); R1.ripple(K, ban, T.hit + .05);
});

/* 16 · a chalkboard on an easel: the icon is sketched, the line is chalked word by word, then underlined twice */
R3.both('B14', 'chalk', 'ชอล์กเขียนบนกระดานดำ', (K, s, T, g) => {
  const it = s.idea ?? {icon: 'lightbulb'}, X = 104, Y = 18, W = 372, H = 228;
  R6.line(K, g, `M${X + 70} ${Y + 20}L${X + 10} 334M${X + W - 70} ${Y + 20}L${X + W - 10} 334M${X + 30} 300H${X + W - 30}`, T.b[0], .4);
  const b = R9.card(g, X, Y, W, H, 14); b.p.style.border = 'calc(var(--lw) * 1px * .7) solid var(--sd)'; K.enter(b.o, T.b[0] + .05, 'rise');
  const tray = R8.svg(g, `<rect class="sd" x="${X + 10}" y="${Y + H - 2}" width="${W - 20}" height="12" rx="6"/>`); K.enter(tray, T.b[0] + .1, 'rise');
  /* the icon, drawn stroke by stroke like chalk */
  const iy = s.idea?.label ? 70 : H / 2, isz = s.idea?.label ? 74 : 110;
  const ic = R9.ico(b.p, it.icon, W / 2, iy, isz);
  const ps = [...ic.querySelectorAll('path,circle,rect,line,polyline,ellipse')];
  ps.forEach((p, i) => { R7.show(p, T.b[0] + .4); K.draw(p, T.b[0] + .4 + i * .12, .35); });
  /* the line, written left to right as the chalk moves along it */
  const w0 = T.b[1] + .1, w1 = T.hit - .2;
  if (s.idea?.label) { const w = R4.word(K, b.p, it.label, W / 2 - 14, 122, 48, null, W - 70); R7.write(w, w0, w1 - w0); }
  const ch = node(g, X + 70, Y + 150, 46, 14, ''); const cp = div('inset:0;border-radius:4px;background:var(--fl);border:2px solid var(--fl-edge, var(--fl-line, var(--ink)))', ch.p); void cp;
  ch.p.style.transform = 'rotate(-24deg)';
  K.move(ch.m, w0 - .3, `translate(${W / 2}px,${H - 70}px)`, 'none', {hold: true});
  A(ch.f, [{transform: 'none'}, {transform: `translate(${W - 150}px,0)`}], w0, w1 - w0, {f: 'both'});
  A(ch.o, [{transform: 'none'}, {transform: 'translate(0,-6px)'}, {transform: 'none'}], w0, .18, {it: Math.max(1, Math.floor((w1 - w0) / .18)), f: 'none'});
  K.move(ch.m, w1 + .05, 'none', `translate(${-60}px,${H - 66}px)`);
  /* two quick lines under it on the key word */
  if (s.idea?.label) {
    const ul = R8.svg(b.p, `<path class="u-acc-line" style="stroke-width:8px" d="M${W / 2 - 130} 184Q${W / 2} 176 ${W / 2 + 120} 182"/><path class="u-acc-line" style="stroke-width:8px" d="M${W / 2 - 110} 198Q${W / 2} 192 ${W / 2 + 100} 196"/>`);
    R7.show(ul, T.hit); ul.querySelectorAll('path').forEach((p, i) => K.draw(p, T.hit + i * .14, .22));
  }
  const dust = R8.svg(g, [0, 1, 2, 3].map(k => `<circle class="fl" cx="${X + 120 + k * 50}" cy="${Y + H + 24 + (k % 2) * 8}" r="${4 - k % 2}"/>`).join('')); dust.classList.add('u-decor'); dust.style.opacity = 0;
  A(dust, [{opacity: 0}, {opacity: .8}, {opacity: 0, transform: 'translateY(16px)'}], T.hit, .7, {f: 'none'});
});

/* ================= B08 เป้าหมาย: goal {icon, label?}, who? {icon} ================= */
/* 17 · a hoop: the ball bounces, is shot in an arc and drops through the net on the key word; the goal on the backboard lights up */
R3.both('B08', 'hoop', 'ลูกบาสลอยลงห่วง', (K, s, T, g) => {
  const it = s.goal ?? {icon: 'trophy'}, B = {x: 306, y: 12, w: 220, h: 140}, rim = {x: 416, y: 172, w: 112};
  const bd = R9.card(g, B.x, B.y, B.w, B.h, 14); K.enter(bd.o, T.b[0], 'rise');
  const sq = div(`left:${B.w / 2 - 50}px;top:${B.h - 70}px;width:100px;height:58px;border:calc(var(--lw) * .4px) solid var(--ink);border-radius:6px`, bd.p); void sq;
  R9.ico(bd.p, it.icon, it.label ? 40 : B.w / 2, it.label ? 40 : 40, it.label ? 40 : 48);
  if (it.label) R6.wordL(K, bd.p, it.label, 68, 18, 32, null, B.w - 84);
  const lit = R9.acc(bd.p, 0, 0, B.w, B.h, 14); lit.o.style.opacity = 0;
  R9.ico(lit.p, it.icon, it.label ? 40 : B.w / 2, 40, it.label ? 40 : 48, 'u-bubble-text');
  if (it.label) { const w = R6.wordL(K, lit.p, it.label, 68, 18, 32, null, B.w - 84); w.classList.add('u-bubble-text'); }
  const sq2 = div(`left:${B.w / 2 - 50}px;top:${B.h - 70}px;width:100px;height:58px;border:calc(var(--lw) * .4px) solid currentColor;border-radius:6px`, lit.p); sq2.className = 'u-bubble-text';
  /* the ball (made before the net, so the net is in front of it) */
  const ball = node(g, 0, 0, 62, 62, ''); const bb = div('inset:0;border-radius:50%', ball.p); bb.className = 'u-badge u-acc';
  div('inset:0', bb, `<svg width="62" height="62" class="u-bubble-text" style="stroke:currentColor;fill:none;stroke-width:3"><path d="M31 2V60M2 31H60M10 10Q31 31 10 52M52 10Q31 31 52 52"/></svg>`);
  const P0 = [116, 258], P1 = [rim.x - 31, 60], P2 = [rim.x - 31, 236], shot = T.b[2] + .05, drop = T.hit - .12;
  A(ball.m, [{transform: `translate(${P0[0]}px,${P0[1] - 120}px)`}, {transform: `translate(${P0[0]}px,${P0[1]}px)`, offset: .25}, {transform: `translate(${P0[0]}px,${P0[1] - 90}px)`, offset: .5},
    {transform: `translate(${P0[0]}px,${P0[1]}px)`, offset: .75}, {transform: `translate(${P0[0]}px,${P0[1] - 70}px)`}], T.b[0] + .2, shot - T.b[0] - .2, {e: 'ease-in-out', f: 'backwards'});
  K.fade(ball.o, T.b[0] + .2, 0, 1, {hold: true});
  R2.hop(ball.m, shot, drop - shot, [P0[0], P0[1] - 70], P1, 70);
  A(ball.m, [{transform: `translate(${P1[0]}px,${P1[1]}px)`}, {transform: `translate(${P2[0]}px,${P2[1]}px)`}], drop, .4, {e: 'cubic-bezier(.5,0,1,.6)', f: 'forwards'});
  A(bb, [{transform: 'rotate(0)'}, {transform: 'rotate(540deg)'}], shot, drop - shot + .4, {f: 'forwards'});
  if (s.who) { const w = R9.ico(g, s.who.icon, 60, 270, 80); K.enter(w, T.b[0], 'pop'); }
  /* the rim and the net */
  R8.svg(g, `<path class="ln u-thin" d="M${rim.x} ${B.y + B.h}V${rim.y}"/>`);
  const net = R6.group(g); net.style.transformOrigin = `${rim.x}px ${rim.y}px`;
  const nl = rim.w / 2, nb = 26;
  R8.svg(net, [0, 1, 2, 3, 4].map(k => { const xt = rim.x - nl + k * nl / 2, xb = rim.x - nb + k * nb / 2; return `<path class="ln u-thin" d="M${xt} ${rim.y}L${xb} ${rim.y + 62}"/>`; }).join('') +
    [20, 42].map(y => { const w = nl - (nl - nb) * y / 62; return `<path class="ln u-thin" d="M${rim.x - w} ${rim.y + y}H${rim.x + w}"/>`; }).join(''));
  K.enter(net, T.b[0] + .2, 'rise');
  R8.svg(g, `<path class="u-acc-line" style="stroke-width:12px" d="M${rim.x - nl - 4} ${rim.y}H${rim.x + nl + 4}"/>`);
  A(net, [{transform: 'scaleY(1)'}, {transform: 'scaleY(1.3)', offset: .4}, {transform: 'scaleY(1)'}], T.hit, .45, {e: 'ease-out', f: 'none'});
  /* score: the board lights up */
  A(lit.o, [{opacity: 0}, {opacity: 1}], T.hit + .02, .12, {f: 'forwards'});
  K.punch(bd.p, T.hit + .05); R1.ripple(K, bd, T.hit + .1); R6.burst(K, g, rim.x, rim.y + 20, 74, T.hit + .05);
});

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

/* ================= B15 ปิดคลิป: action, label? ================= */
/* 19 · a big bell swings and rings; on the key word a red dot pops on it; the action is on the band round its rim */
R3.both('B15', 'bell', 'กระดิ่งใหญ่แกว่งสั่น ชวนกดติดตาม', (K, s, T, g) => {
  const [icon] = R3.ACT[s.action] ?? R3.ACT.follow, cx = 272, top = 40, lip = 236;
  const bellD = `M${cx} ${top}C${cx + 62} ${top} ${cx + 82} ${top + 60} ${cx + 86} ${top + 120}C${cx + 90} ${lip - 40} ${cx + 116} ${lip - 26} ${cx + 124} ${lip}H${cx - 124}C${cx - 116} ${lip - 26} ${cx - 90} ${lip - 40} ${cx - 86} ${top + 120}C${cx - 82} ${top + 60} ${cx - 62} ${top} ${cx} ${top}Z`;
  const sw = R6.group(g); sw.style.transformOrigin = `${cx}px ${top - 14}px`; K.enter(sw, T.b[0], 'drop');
  const clap = R6.group(sw); clap.style.transformOrigin = `${cx}px ${lip - 30}px`;
  R8.svg(clap, `<path class="ln u-thin" d="M${cx} ${lip - 30}V${lip + 10}"/><circle class="sd" cx="${cx}" cy="${lip + 22}" r="20"/>`);
  R8.svg(sw, `<circle class="sd" cx="${cx}" cy="${top - 12}" r="15"/><path class="fl" d="${bellD}"/><path class="u-fl-edge" d="${bellD}"/>`);
  const band = R9.acc(sw, cx - 128, lip - 52, 256, 58, 16);
  if (s.label) { R9.ico(band.p, icon, 36, 29, 32, 'u-bubble-text'); const w = R6.wordL(K, band.p, s.label, 62, 6, 34, null, 180); w.classList.add('u-bubble-text'); }
  else R9.ico(band.p, icon, 128, 29, 36, 'u-bubble-text');
  K.enter(band.o, T.b[0] + .15, 'pop');
  /* the swing: growing toward the key word, then dying away; the clapper lags behind */
  const ks = [0, 9, -10, 14, -15, 18, -12, 7, -3, 0], t0 = T.b[1] - .1, t1 = T.hit + .9, pk = (T.hit - t0) / (t1 - t0);
  A(sw, ks.map((a, i) => ({transform: `rotate(${a}deg)`, offset: i < 6 ? pk * i / 5 : pk + (1 - pk) * (i - 5) / 4})), t0, t1 - t0, {e: 'ease-in-out', f: 'none'});
  A(clap, ks.map((a, i) => ({transform: `rotate(${-a * .8}deg)`, offset: i < 6 ? pk * i / 5 : pk + (1 - pk) * (i - 5) / 4})), t0 + .06, t1 - t0, {e: 'ease-in-out', f: 'none'});
  const ring = R8.svg(g, [-1, 1].map(d => [0, 1].map(k => `<path class="ln u-thin" d="M${cx + d * (150 + k * 26)} ${top + 60 - k * 10}Q${cx + d * (170 + k * 26)} ${top + 110} ${cx + d * (150 + k * 26)} ${top + 160 + k * 10}"/>`).join('')).join(''));
  ring.classList.add('u-decor'); ring.style.opacity = 0;
  A(ring, [{opacity: 0}, {opacity: 1}, {opacity: 0}], T.hit - .25, .5, {it: 2, f: 'none'});
  /* the red dot */
  const dot = node(g, cx + 58, top - 6, 46, 46, 'u-badge u-neg'); dot.p.style.borderRadius = '50%'; K.enter(dot.o, T.hit, 'pop'); K.punch(dot.p, T.hit + .45);
});

/* 20 · a ticket: the action on it; on the key word its stub is torn off along the dotted line and the icon turns "done" */
R3.both('B15', 'ticket', 'ตั๋วถูกฉีกออก', (K, s, T, g) => {
  const [icon, done] = R3.ACT[s.action] ?? R3.ACT.follow, Y = 72, H = 170, SX = 64, SW = 116, MX = SX + SW + 6, MW = 296;
  const tk = R6.group(g); tk.style.transform = 'rotate(-4deg)'; tk.style.transformOrigin = '300px 160px';
  const mask = parts => ({mask: parts, '-webkit-mask': parts, maskComposite: 'intersect', '-webkit-mask-composite': 'source-in'});
  const hole = (x, y, r) => `radial-gradient(circle ${r}px at ${x} ${y}, transparent ${r - .5}px, #000 ${r}px)`;
  const part = (x, w, holes) => {
    const c = R2.card(node(tk, x, Y, w, H, 'u-panel u-receipt')); c.o.classList.add('u-receipt-wrap'); c.p.style.borderRadius = '12px';
    const m = mask(holes.join(',')); c.p.style.mask = m.mask; c.p.style.webkitMask = m['-webkit-mask']; c.p.style.maskComposite = 'intersect'; c.p.style.webkitMaskComposite = 'source-in';
    return c;
  };
  const stub = part(SX, SW, [hole('0', '50%', 20), hole('100%', '0', 12), hole('100%', '100%', 12)]);
  const main = part(MX, MW, [hole('0', '0', 12), hole('0', '100%', 12), hole('100%', '50%', 20)]);
  K.enter(stub.o, T.b[0], 'rise'); K.enter(main.o, T.b[0] + .06, 'rise');
  R8.svg(tk, `<path class="ln u-thin u-dash" d="M${MX - 3} ${Y + 18}V${Y + H - 18}"/>`);
  /* the stub: the small icon and a few bars; the main part: the big icon and the words, an accent stripe on top */
  R9.ico(stub.p, icon, SW / 2 + 6, 56, 40);
  const bars = R8.svg(stub.p, [0, 1, 2, 3, 4, 5].map(k => `<path class="ln u-thin" d="M${32 + k * 10} 104V${k % 2 ? 140 : 132}"/>`).join('')); bars.classList.add('u-decor');
  const st = R9.acc(main.p, 0, 0, MW, 22, 0); st.p.style.boxShadow = 'none';
  const ix = s.label ? 64 : MW / 2, i0 = R9.ico(main.p, icon, ix, 96, s.label ? 62 : 80);
  const i1 = R9.ico(main.p, done, ix, 96, s.label ? 62 : 80); i1.style.opacity = 0;
  if (s.label) R6.wordL(K, main.p, s.label, 112, 66, 44, T.b[1], MW - 130);
  /* the tear: the stub pulls away, turns and falls out of the frame */
  const tear = T.hit - .05;
  A(stub.m, [{transform: 'none'}, {transform: 'translate(-8px,4px) rotate(-6deg)', offset: .2}, {transform: 'translate(-90px,260px) rotate(-38deg)'}], tear, .7, {e: 'cubic-bezier(.5,0,.8,.6)', f: 'forwards'});
  K.fade(stub.o, tear + .45, 1, 0);
  A(main.m, [{transform: 'none'}, {transform: 'translateX(6px)'}, {transform: 'none'}], tear, .25, {f: 'none'});
  R7.hide(i0, T.hit + .1); R7.show(i1, T.hit + .1); K.punch(main.p, T.hit + .1); R1.ripple(K, main, T.hit + .15, {r: '12px'});
});

/* ================= sentences to try round 9 (not Friend's script; one per variant, plus the other forms) ================= */
SENTENCE('r9.diet', {cat: 'B09', name: 'อาทิตย์แรก เดือนแรก สามเดือน', say: ['ลดน้ำหนักมาครบ', 'สามเดือนแล้ว'],
  points: [{icon: 'calendar', label: 'อาทิตย์แรก'}, {icon: 'calendar-days', label: 'เดือนแรก'}, {icon: 'calendar-check', label: 'สามเดือน'}], at: 2, result: {icon: 'trophy'}});
SENTENCE('r9.wait', {cat: 'B09', name: 'รอมาครึ่งทาง', say: ['ตอนนี้เพิ่งผ่านมา', 'ครึ่งทาง'],
  points: [{icon: 'flag', label: 'เริ่มต้น'}, {icon: 'map-pin', label: 'ครึ่งทาง'}, {icon: 'flag-triangle-right', label: 'เส้นชัย'}], at: 1});
SENTENCE('r9.night', {cat: 'B09', name: 'ทั้งคืนจนเสร็จ', say: ['นั่งทำทั้งคืน', 'จนเสร็จ'], result: {icon: 'circle-check', label: 'เสร็จแล้ว'}});
SENTENCE('r9.price', {cat: 'B13', name: 'เคล็ดลับคือตั้งราคาลงท้ายเก้า', say: ['เคล็ดลับคือ', 'ราคาลงท้ายเก้า'], secret: {icon: 'tag', label: 'ลงท้ายเก้า'}});
SENTENCE('r9.light', {cat: 'B13', name: 'ความลับคือแสงหน้าต่าง', say: ['ความลับของรูปสวยคือ', 'แสงหน้าต่าง'], secret: {icon: 'sun', label: 'แสงหน้าต่าง'}});
SENTENCE('r9.brand', {cat: 'B16', name: 'แบรนด์คือความรู้สึก', say: ['แบรนด์ก็คือ', 'ความรู้สึก'], term: {label: 'แบรนด์'}, means: [{icon: 'heart', label: 'ความรู้สึก'}]});
SENTENCE('r9.cash', {cat: 'B16', name: 'กระแสเงินสดคือเงินเข้าออก', say: ['กระแสเงินสดก็คือ', 'เงินเข้าออก'],
  term: {icon: 'wallet', label: 'กระแสเงินสด'}, means: [{icon: 'arrow-down-left', label: 'เงินเข้า'}, {icon: 'arrow-up-right', label: 'เงินออก'}]});
SENTENCE('r9.friend', {cat: 'B20', name: 'เพื่อนสนิทตั้งแต่ประถม', say: ['เราสองคนเป็น', 'เพื่อนสนิทกัน'], a: {icon: 'user', label: 'ผม'}, b: {icon: 'user', label: 'ต้น'}, label: 'เพื่อนสนิท'});
SENTENCE('r9.ex', {cat: 'B20', name: 'แฟนเก่า เลิกกันแล้ว', say: ['สุดท้ายก็', 'เลิกกันไป'], a: {icon: 'user', label: 'ผม'}, b: {icon: 'user', label: 'เขา'}, label: 'แฟนเก่า', cut: true});
SENTENCE('r9.partner', {cat: 'B20', name: 'ร้านกับซัพพลายเออร์', say: ['ร้านเราคุยกับ', 'ซัพพลายเออร์ทุกวัน'], a: {icon: 'store', label: 'ร้านเรา'}, b: {icon: 'truck', label: 'ซัพพลาย'}});
SENTENCE('r9.japan', {cat: 'B21', name: 'ไปญี่ปุ่น โตเกียว', say: ['ทริปนี้ไป', 'โตเกียว'], place: {icon: 'plane', label: 'โตเกียว'}});
SENTENCE('r9.cafe', {cat: 'B21', name: 'คาเฟ่ชั้นสอง ริมหน้าต่าง', say: ['คาเฟ่นี้อยู่ชั้นสอง', 'ริมหน้าต่าง'], place: {icon: 'coffee', label: 'คาเฟ่บ้านไม้'}, spots: [{icon: 'layers', label: 'ชั้นสอง'}, {icon: 'sun', label: 'ริมหน้าต่าง'}]});
SENTENCE('r9.views', {cat: 'B01', name: 'ยอดวิว 1,200,000', say: ['คลิปนี้ได้ยอดวิว', '1,200,000'], value: '1,200,000', unit: 'วิว', icon: 'eye'});
SENTENCE('r9.temp', {cat: 'B01', name: 'ยอดขายโต 85%', say: ['เดือนนี้ยอดขายโต', '85%'], value: '85%', icon: 'shopping-cart', dir: 'up'});
SENTENCE('r9.cost', {cat: 'B01', name: 'ต้นทุนเหลือ 300 บาท', say: ['ต้นทุนลดลงเหลือ', '300 บาท'], value: '300', unit: 'บาท', dir: 'down', money: true});
SENTENCE('r9.fans', {cat: 'B02', name: 'คนดูไลฟ์เพิ่มขึ้นเรื่อย ๆ', say: ['พอไลฟ์ทุกวัน คนดู', 'เพิ่มขึ้นเรื่อยๆ'], dir: 'up', item: {icon: 'user'}, center: {icon: 'video', label: 'ไลฟ์'}, n: 3});
SENTENCE('r9.cash2', {cat: 'B02', name: 'เงินเก็บหายไปเกือบหมด', say: ['เดือนเดียว เงินเก็บ', 'หายไปเกือบหมด'], dir: 'down', item: {icon: 'coins'}, n: 4, keep: 1, end: {icon: 'circle-alert', tone: 'neg'}});
SENTENCE('r9.slow', {cat: 'B14', name: 'ทำทุกวันชนะทุกอย่าง', say: ['จำไว้นะ', 'ทำทุกวันชนะ'], idea: {icon: 'repeat', label: 'ทำทุกวัน'}});
SENTENCE('r9.learn', {cat: 'B14', name: 'เรียนจากความผิดพลาด', say: ['ความผิดพลาดคือ', 'ครูที่ดีที่สุด'], idea: {icon: 'graduation-cap', label: 'ครูที่ดีที่สุด'}});
SENTENCE('r9.million', {cat: 'B08', name: 'ยอดขายถึงล้าน', say: ['ปีนี้ยอดขาย', 'แตะหลักล้าน'], goal: {icon: 'trophy', label: 'หลักล้าน'}, who: {icon: 'user'}});
SENTENCE('r9.dream', {cat: 'B08', name: 'ได้บ้านหลังแรก', say: ['สุดท้ายก็ได้', 'บ้านหลังแรก'], goal: {icon: 'house', label: 'บ้านหลังแรก'}});
SENTENCE('r9.bell', {cat: 'B15', name: 'กดติดตามไว้', say: ['อย่าลืม', 'กดติดตามนะ'], action: 'follow', label: 'กดติดตาม'});
SENTENCE('r9.save', {cat: 'B15', name: 'กดบันทึกไว้ดูทีหลัง', say: ['ใครยังไม่ว่าง', 'กดบันทึกไว้'], action: 'save', label: 'บันทึกไว้'});
