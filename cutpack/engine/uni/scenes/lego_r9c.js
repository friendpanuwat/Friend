/* =====================================================================
   CutPack · uni · LEGO round 10 (Friend 2026-11-11: "เก็บทั้งหมด เริ่มทำการเคลื่อนไหวได้เลย" on the still sketches in
   engine/uni/sketches/r10.js, all four styles). Two new variants for ten categories, made the way the talking-head-motion
   skill designs a scene: one main thing + ONE move that carries the meaning on the key word, then it holds; no decoration;
   the style's own soft speeds. Drawn so each everyday thing reads at once (LESSONS 45). People are allowed again.
     B04 ขั้นตอน       ตัวต่อซ้อนเป็นตึก (tower) · เบี้ยบนกระดานเกม (board)
     B06 คำถาม        โพลสองตัวเลือก (poll, needs two options) · หลอดไฟมี ? (bulb)
     B07 คำเตือน       ป้ายระวังพื้นลื่น (wetfloor) · เหยื่อบนเบ็ดตกปลา (hook)
     B09 เวลา         นาฬิกาจับเวลา (stopwatch) · ต้นไม้จนออกผล (tree)
     B10 คน           เก้าอี้มีป้ายจอง (seat) · กล่องพัสดุจ่าหน้า (parcel)
     B12 เหตุกับผล      ก๊อกน้ำกับท่อ (pipe) · ลูกพูลชนลงหลุม (pool)
     B16 นิยาม        บัตรคำร้อยห่วง (flash) · เครื่องพิมพ์ฉลาก (labeler)
     B17 ไล่รายการ      โฟลเดอร์ในมือถือ (folder) · กล่องเครื่องมือถาดกาง (toolbox)
     B18 เล่าเหตุการณ์    ม่านเวที (curtain) · วิดีโอย้อนกลับ (rewind)
     B19 ความรู้สึก      ตัวคนเติมสี (fill) · แถบเลื่อนอารมณ์ (slider)
   Removed in the sketch stage, never bring back: B12 snowball, seesaw (DECISIONS, round 10).
   Loaded after lego_r9b.js (R9 helpers) and before lego_v2.js. Same frame rules as R3.both (600 × 340, nothing past
   x 550 below y 200, words only from the slots).
   ===================================================================== */
const R10 = {
  /* a round surface: 'card' | 'acc' | 'main' | 'neg' | 'soft' */
  disc(g, cx, cy, r, kind = 'card') {
    if (kind === 'card') return R9.card(g, cx - r, cy - r, 2 * r, 2 * r, '50%');
    if (kind === 'acc') return R9.acc(g, cx - r, cy - r, 2 * r, 2 * r, '50%');
    return R7.plain(g, cx - r, cy - r, 2 * r, 2 * r, kind, '50%');
  },
  /* an icon that takes the ink of the surface it sits on (u-main / u-neg / u-acc set their own colour; u-label would not) */
  inkIco: (g, icon, cx, cy, size) => R9.ico(g, icon, cx, cy, size, 'u-inherit'),
  /* a big glyph ("?") centred on (cx, cy), in the text ink of where it sits */
  glyph(g, txt, cx, cy, size, cls = 'u-label') {
    const e = div(`left:${cx - size}px;top:${cy - size * .62}px;width:${2 * size}px;text-align:center;font-family:KeySans;font-size:${size}px;line-height:1.25`, g);
    e.className = cls; e.textContent = txt; return e;
  },
  bar(g, x, y, w, h, cls, r = h / 2) { const e = div(`left:${x}px;top:${y}px;width:${w}px;height:${h}px;border-radius:${r}px`, g); if (cls) e.className = cls; else e.style.background = 'var(--tr)'; return e; },
  /* an icon above a centred word, inside a holder of width w (acc = the holder is an accent surface) */
  iconWord(K, p, it, w, y, icon = 38, word = 28, acc = false) {
    if (it?.icon) R9.ico(p, it.icon, w / 2, y + icon / 2, icon, acc ? 'u-bubble-text' : 'u-label');
    if (it?.label) { const l = R4.word(K, p, it.label, w / 2, y + icon + 6, word, null, w - 20); if (acc) l.classList.add('u-bubble-text'); }
  },
  /* a holder the size of the canvas whose moves scale round (ox, oy) */
  group(g, ox, oy) { const e = R6.group(g); e.style.transformOrigin = `${ox}px ${oy}px`; return e; },
  /* light a surface: an accent copy appears over it at t and grows into place (LG.lightUp for a whole tile or card) */
  lit(K, parent, x, y, w, h, r, t) {
    const n = R9.acc(parent, x, y, w, h, r); A(n.o, [{opacity: 0}, {opacity: 1}], t, .04);
    K.move(n.m, t, 'scale(.8)', 'none', {hold: true, kind: 'snap'}); n.done = LG.arrive('snap', t); return n;
  },
};

/* ================= B04 ขั้นตอน: items [3 {icon, label?}], mark? {at, how light|check|cross} ================= */
/* 1 · toy bricks laid like a wall: each step drops onto the one before, a little to the side, so every brick's studs show */
R3.both('B04', 'tower', 'ตัวต่อซ้อนเป็นตึก หล่นลงมาทีละชั้น', (K, s, T, g) => {
  const it = (s.items ?? []).slice(0, 3), mk = s.mark, W = 250, H = 86, base = 322, xs = [130, 220, 130];
  const pl = R7.plain(g, 100, base, 400, 12, 'main', '6px'); K.enter(pl.o, T.b[0], 'rise');
  const when = [T.b[0] + .25, T.b[1] + .1, T.b[2]];
  it.forEach((p, k) => {
    const y = base - (k + 1) * H, x = xs[k], lit = mk?.at === k && mk.how === 'light', kind = lit ? R9.acc : R9.card;
    const gr = R10.group(g, x + W / 2, y + H / 2);
    const b = kind(gr, x, y, W, H, 14);
    /* studs on the part of the top that the next brick leaves open */
    const nx = xs[k + 1], free = k === it.length - 1 ? [x, x + W] : nx > x ? [x, nx] : [nx + W, x + W];
    const room = free[1] - free[0] - 16, ns = Math.floor(room / 70), x0 = free[0] + 16 + (room - ns * 70) / 2 + 2;
    for (let i = 0; i < ns; i++) kind(gr, x0 + i * 70, y - 20, 50, 20, '10px 10px 3px 3px');
    R10.iconWord(K, b.p, p, W, 8, 34, 28, lit);
    K.enter(gr, when[k], 'drop');
    if (mk?.at === k) { if (mk.how === 'light') { K.punch(b.p, T.hit); R1.ripple(K, b, T.hit + .05, {grow: 26}); } else K.mark(b.p, mk.how, W - 34, H / 2, 40, T.hit); }
  });
});

/* 2 · a board game: on the board a track runs from square to square; the pawn hops along it and stops on the step that matters */
R3.both('B04', 'board', 'เบี้ยเดินบนกระดานเกม กระโดดไปทีละช่อง', (K, s, T, g) => {
  const it = (s.items ?? []).slice(0, 3), mk = s.mark, at = mk ? mk.at : it.length - 1, W = 520, H = 318, TS = 84;
  const bd = R9.card(g, 30, 14, W, H, 30); K.enter(bd.o, T.b[0], 'rise');
  const C = [[96, 236], [262, 170], [430, 110]];
  const tk = div(`left:0;top:0;width:${W}px;height:${H}px`, bd.p, `<svg width="${W}" height="${H}"><path d="M28 236C130 236 170 170 262 170S360 110 492 110" style="fill:none;stroke:var(--tr);stroke-width:42px;stroke-linecap:round"/></svg>`);
  tk.classList.add('u-decor'); K.draw(tk.querySelector('path'), T.b[0] + .3, .8);
  /* the hops: each takes .5 s with a little gap, the last one lands just after the key word */
  const hop = k => { const end = T.hit + .1 - (at - 1 - k) * .6; return [end - .5, end]; }, arrive = at ? hop(at - 1)[1] : T.b[1] + .3;
  it.forEach((p, k) => {
    const [cx, cy] = C[k], t = R7.plain(bd.p, cx - TS / 2, cy - TS / 2, TS, TS, 'main', '20px');
    R10.inkIco(t.p, p.icon, TS / 2, TS / 2, 42); K.enter(t.o, T.b[0] + .45 + k * .12, 'pop');
    if (p.label) R4.word(K, bd.p, p.label, cx, cy + TS / 2 + 4, 26, T.b[0] + .55 + k * .12, 150);
    if (mk?.at === k && mk.how === 'light') { const l = R10.lit(K, bd.p, cx - TS / 2, cy - TS / 2, TS, TS, '20px', arrive + .05); R9.ico(l.p, p.icon, TS / 2, TS / 2, 42, 'u-bubble-text'); R1.ripple(K, l, l.done, {grow: 22}); }
    else if (mk?.at === k) K.mark(bd.p, mk.how, cx + TS / 2, cy - TS / 2, 40, arrive + .1);
  });
  /* the pawn: a head on a bell-shaped body, standing on top of a square; it drops onto the first one, then hops */
  const foot = k => [C[k][0], C[k][1] - TS / 2 - 2];   // on the top edge, never over the square (a lit square is the pawn's colour)
  const pw = node(bd.p, foot(0)[0], foot(0)[1], 0, 0, '', `<svg width="1" height="1" style="overflow:visible"><path class="ac" d="M-26 0Q-26 -12 -12 -16L-7 -42H7L12 -16Q26 -12 26 0Z"/><circle class="ac" cx="0" cy="-55" r="16"/></svg>`);
  K.enter(pw.o, T.b[1], 'drop');
  for (let k = 0; k < at; k++) { const [t0, t1] = hop(k), a = foot(k), b = foot(k + 1); R2.hop(pw.m, t0, t1 - t0, [a[0] - foot(0)[0], a[1] - foot(0)[1]], [b[0] - foot(0)[0], b[1] - foot(0)[1]], 70); }
});

/* ================= B06 คำถาม: about? {icon, label?}, options? [2], answer? ================= */
/* 3 · a poll: the question on top, two big choices side by side that fill up from the bottom with their votes
   (no answer = both about half, still undecided; an answer = that choice lights and gets the tick) */
R3.both('B06', 'poll', 'โพลในสตอรี่ สองตัวเลือก แถบคะแนนเติม', (K, s, T, g) => {
  const op = s.options.slice(0, 2), ab = s.about, ans = s.answer;
  const hd = R9.card(g, 70, 2, 460, 76, 24); K.enter(hd.o, T.b[0], 'rise');
  const q = R9.acc(hd.p, 14, 12, 52, 52, '50%'); R10.glyph(q.p, '?', 26, 26, 36, 'u-bubble-text');
  if (ab?.icon) R9.ico(hd.p, ab.icon, 98, 38, 34);
  if (ab?.label) R6.wordL(K, hd.p, ab.label, ab.icon ? 126 : 82, 14, 36, T.b[0] + .2, 310); else R10.bar(hd.p, ab?.icon ? 126 : 82, 32, 180, 14);
  const win = ans ? op.findIndex(o => o.label === ans.label || o.icon === ans.icon) : -1, share = win < 0 ? [.42, .38] : [.5, .5].map((v, k) => k === win ? .86 : .14);
  op.forEach((o, k) => {
    const W = 220, H = 246, x = 70 + k * 240, y = 90, t = R9.card(g, x, y, W, H, 28); t.p.style.overflow = 'hidden';
    K.enter(t.o, T.b[0] + .25 + k * .1, 'rise');
    const lv = div(`left:0;right:0;bottom:0;height:${share[k] * 100}%`, t.p); lv.className = 'u-col-acc'; if (win >= 0 && k !== win) lv.style.opacity = .45;
    A(lv, [{transform: 'translateY(100%)'}, {transform: 'none'}], T.b[2] - .35, .9, {e: EASE.inout});
    R10.iconWord(K, t.p, o, W, 30, 66, 36);
    if (k === win) { const l = R10.lit(K, g, x, y, W, H, 28, T.hit); R10.iconWord(K, l.p, o, W, 30, 66, 36, true); K.mark(l.p, 'check', W / 2, H - 50, 52, l.done); }
  });
}, s => (s.options ?? []).length === 2);

/* 4 · a light bulb with a question mark inside; once the answer comes it lights up with the answer in it */
R3.both('B06', 'bulb', 'หลอดไฟมีเครื่องหมายคำถาม ได้คำตอบแล้วไฟติด', (K, s, T, g) => {
  const ab = s.about, ans = s.answer, X = 110, Y = 12, W = 200, H = 236;
  const clip = `path('M100 0A100 100 0 0 1 172 170Q150 196 146 236H54Q50 196 28 170A100 100 0 0 1 100 0Z')`;
  const gb = R10.group(g, X + W / 2, 300); K.enter(gb, T.b[0], 'rise');
  const gl = R9.card(gb, X, Y, W, H, 0); gl.p.style.clipPath = clip; gl.p.style.boxShadow = 'inset 0 0 0 4px var(--tr)';
  [[250, 92, 24], [280, 80, 20], [304, 44, 16]].forEach(([y, w, h], k) => R7.plain(gb, X + W / 2 - w / 2, y, w, h, 'main', k === 2 ? '0 0 10px 10px' : '8px'));
  const qm = R10.glyph(gl.p, '?', W / 2, 100, 120); K.enter(qm, T.b[1], 'pop');
  /* the glass's outline, so a white bulb still shows on a white page (split) */
  const edge = () => R8.svg(gb, `<path class="ln u-thin" transform="translate(${X} ${Y})" d="M100 0A100 100 0 0 1 172 170Q150 196 146 236H54Q50 196 28 170A100 100 0 0 1 100 0Z"/>`);
  if (ans) {
    const on = R9.acc(gb, X, Y, W, H, 0); on.p.style.clipPath = clip; on.p.style.boxShadow = 'none'; A(on.o, [{opacity: 0}, {opacity: 1}], T.hit, .25);
    const ic = R9.ico(on.p, ans.icon, W / 2, 100, 86, 'u-bubble-text'); K.enter(ic, T.hit + .1, 'pop'); R6.burst(K, g, X + W / 2, Y + 100, 104, T.hit + .3, 8);
  }
  edge();
  const it = ans ?? ab;
  if (it) { const cd = R9.card(g, 372, 70, 176, 130, 22); R10.iconWord(K, cd.p, it, 176, 18, 44, 30); K.enter(cd.o, ans ? T.hit + .35 : T.hit, 'pop'); }
});

/* ================= B07 คำเตือน: thing {icon, label?}, how cross|flag, sign? ================= */
/* 5 · a wet-floor sign: the A-frame opens up and stands; on the key word the warning on it punches (cross = it gets the ✗) */
R3.both('B07', 'wetfloor', 'ป้ายระวังพื้นลื่น กางออกตั้งบนพื้น', (K, s, T, g) => {
  const it = s.thing ?? {icon: 'triangle-alert'}, X = 180, Y = 24, W = 240, H = 292;
  const fl = R7.plain(g, X - 40, Y + H + 2, W + 80, 10, 'main', '5px'); K.enter(fl.o, T.b[0], 'rise');
  const b = R9.acc(g, X, Y, W, H, 0);
  b.p.style.clipPath = `path('M68 0H172Q184 0 187 12L240 278Q242 ${H} 228 ${H}H12Q-2 ${H} 0 278L53 12Q56 0 68 0Z')`;
  A(b.o, [{opacity: 0}, {opacity: 1}], T.b[0] + .1, .25);
  b.m.style.transformOrigin = '50% 100%'; A(b.m, [{transform: 'scaleY(.15)'}, {transform: 'none'}], T.b[0] + .1, .8, {e: EASE.smooth});
  R10.bar(b.p, W / 2 - 34, 18, 68, 18, null, 9);
  const sg = R9.ico(b.p, s.sign ?? 'triangle-alert', W / 2, 92, 84, 'u-bubble-text'); K.enter(sg, T.b[1] + .2, 'pop');
  const ti = R9.ico(b.p, it.icon, W / 2, 186, 58, 'u-bubble-text'); K.enter(ti, T.b[2], 'pop');
  if (it.label) R9.accWord(K, b.p, it.label, W / 2, 222, 36, T.b[2] + .1, W - 70);
  if (s.how === 'cross') K.mark(b.p, 'cross', W / 2, 186, 84, T.hit); else K.punch(b.p, T.hit);
});

/* 6 · a fishing hook comes down with the risky thing as its bait; a warning sign pops up beside it on the key word */
R3.both('B07', 'hook', 'เหยื่อบนเบ็ดตกปลา ป้ายเตือนเด้งข้าง ๆ', (K, s, T, g) => {
  const it = s.thing ?? {icon: 'tag'}, cx = 250, W = 250, H = 160, Y = 64, B = Y + H + 22;
  const hk = R6.group(g);
  A(hk, [{transform: 'translateY(-360px)'}, {transform: 'none'}], T.b[0], 1, {e: EASE.smooth});
  R8.svg(hk, `<path class="ln u-thin" d="M${cx} -380V0"/>`).classList.add('u-decor');   // the line above the canvas: gold must not count it when it frames the picture
  R8.svg(hk, `<path class="ln u-thin" d="M${cx} 0V${Y + 8}"/><path class="ln" d="M${cx} ${Y + 20}V${B}Q${cx} ${B + 66} ${cx - 54} ${B + 66}Q${cx - 106} ${B + 66} ${cx - 106} ${B + 8}"/>` +
    `<path class="ln" d="M${cx - 106} ${B + 8}L${cx - 80} ${B + 32}"/>`);
  const c = R9.acc(hk, cx - W / 2, Y, W, H, 26); R10.iconWord(K, c.p, it, W, 22, 66, 40, true);
  const w = R10.disc(g, 470, 128, 60, 'card'); R9.ico(w.p, s.sign ?? (s.how === 'cross' ? 'octagon-x' : 'triangle-alert'), 60, 60, 66);
  K.enter(w.o, T.hit, 'pop'); R1.ripple(K, w, LG.arrive('pop', T.hit), {grow: 24, tone: 'neg'});
});

/* ================= B09 เวลา: points? [3 {icon, label?}], at?, result? ================= */
/* 7 · a stopwatch: the button is pressed, the ring runs round, and each moment is logged as a lap beside it as it passes */
R3.both('B09', 'stopwatch', 'นาฬิกาจับเวลา กดปุ่มแล้ววงวิ่ง บันทึกแต่ละช่วงข้าง ๆ', (K, s, T, g) => {
  const pts = (s.points ?? []).slice(0, 3), n = pts.length, at = n ? Math.min(s.at ?? n - 1, n - 1) : 2, C = {x: 186, y: 190}, R = 124;
  const sw = R10.group(g, C.x, C.y); K.enter(sw, T.b[0], 'pop');
  const cr = R7.plain(sw, C.x - 22, 28, 44, 26, 'main', '9px'); R7.plain(sw, C.x - 9, 54, 18, 12, 'main', '2px');
  A(cr.m, [{transform: 'none'}, {transform: 'translateY(8px)'}, {transform: 'none'}], T.b[1], .35, {e: EASE.inout, f: 'none'});
  const f = R10.disc(sw, C.x, C.y, R), fr = n ? (at + 1) / 3 : .7, t0 = T.b[1] + .2, d = T.hit - t0;
  const sv = div(`left:0;top:0;width:${2 * R}px;height:${2 * R}px`, f.p, `<svg width="${2 * R}" height="${2 * R}"><circle class="u-ring" style="stroke-width:22px" cx="${R}" cy="${R}" r="${R - 30}"/>` +
    `<circle class="u-ring-on" style="stroke-width:22px" cx="${R}" cy="${R}" r="${R - 30}" pathLength="100" transform="rotate(-90 ${R} ${R})"/></svg>`);
  R7.show(sv.querySelector('.u-ring-on'), t0);   // hidden until it starts: a round cap of length 0 still shows as a dot (LESSONS 36)
  A(sv.querySelector('.u-ring-on'), [{strokeDasharray: '0 100'}, {strokeDasharray: `${(fr * 100).toFixed(1)} 100`}], t0, d, {e: 'cubic-bezier(.3,0,.4,1)'});
  const hd = div(`left:0;top:0;width:${2 * R}px;height:${2 * R}px;transform-origin:${R}px ${R}px`, f.p, `<svg width="${2 * R}" height="${2 * R}"><path class="ln u-thin" d="M${R} ${R}V54"/><circle class="sd" cx="${R}" cy="${R}" r="10"/></svg>`);
  A(hd, [{transform: 'rotate(0)'}, {transform: `rotate(${fr * 360}deg)`}], t0, d, {e: 'cubic-bezier(.3,0,.4,1)'});
  const rows = n ? pts : (s.result ? [s.result] : []);
  rows.forEach((p, k) => {
    const lit = n ? k === at : true, y = 66 + k * 84, r = (lit ? R9.acc : R9.card)(g, 352, y, 188, 66, 18);
    R9.ico(r.p, p.icon, 36, 33, 30, lit ? 'u-bubble-text' : 'u-label');
    if (p.label) { const w = R6.wordL(K, r.p, p.label, 62, 13, 28, null, 116); if (lit) w.classList.add('u-bubble-text'); }
    if (n && k > at) { r.o.style.opacity = .35; K.enter(r.p, T.b[0] + .3, 'pop'); }
    else K.enter(r.o, n ? t0 + d * (k + 1) / (at + 1) - .15 : T.hit, 'pop');
  });
});

/* 8 · a tree through time: a bare trunk, then a crown of leaves, then fruit (ผล); the moments along the ground light in turn */
R3.both('B09', 'tree', 'ต้นไม้เปลี่ยนตามเวลา จนออกผล', (K, s, T, g) => {
  const pts = (s.points ?? []).slice(0, 3), n = pts.length, at = n ? Math.min(s.at ?? n - 1, n - 1) : 2, res = s.result;
  const c = res ? 236 : 300, G = 266, C = {x: c, y: 96}, rx = 140, ry = 80, st = [T.b[1], T.b[2], T.hit];
  const trunk = `M${c - 26} ${G}C${c - 18} ${G - 16} ${c - 13} ${G - 28} ${c - 13} ${G - 48}L${c - 58} ${C.y + 50}L${c - 42} ${C.y + 38}L${c} ${C.y + 66}` +
    `L${c + 42} ${C.y + 38}L${c + 58} ${C.y + 50}L${c + 13} ${G - 48}C${c + 13} ${G - 28} ${c + 18} ${G - 16} ${c + 26} ${G}Z`;
  const nb = 10, P = [...Array(nb)].map((_, i) => { const a = -Math.PI / 2 + i * 2 * Math.PI / nb; return [C.x + rx * Math.cos(a), C.y + ry * Math.sin(a)]; });
  const crown = 'M' + P[0].map(v => v.toFixed(1)).join(' ') + P.map((q, i) => { const r = P[(i + 1) % nb], L = Math.hypot(r[0] - q[0], r[1] - q[1]), Rr = (L * .6).toFixed(1);
    return `A${Rr} ${Rr} 0 0 1 ${r[0].toFixed(1)} ${r[1].toFixed(1)}`; }).join('') + 'Z';
  const gd = R7.plain(g, 40, G, 520, 10, 'main', '5px'); K.enter(gd.o, T.b[0], 'rise');
  const tr = R10.group(g, c, G); R8.svg(tr, `<path class="sd" d="${trunk}"/>`); A(tr, [{transform: 'scaleY(0)'}, {transform: 'none'}], st[0] - .1, .7, {e: EASE.smooth});
  if (at >= 1) { const cr = R10.group(g, c, C.y + 90); R8.svg(cr, `<path class="ac" d="${crown}"/>`); A(cr, [{transform: 'scale(.2)', opacity: 0}, {transform: 'none', opacity: 1}], st[1] - .2, .9, {e: EASE.smooth}); }
  const F = [[-74, -6], [-26, -44], [34, -30], [82, 12], [-40, 34], [26, 32]].slice(0, at === 2 ? 6 : at === 1 ? 2 : 0), ft = at === 2 ? st[2] : st[1] + .7;
  F.forEach(([dx, dy], k) => {
    const x = C.x + dx, y = C.y + dy, fr = R10.group(g, x, y); K.enter(fr, ft + k * .08, 'pop');
    R8.svg(fr, `<path style="fill:none;stroke:var(--ink);stroke-width:4px;stroke-linecap:round" d="M${x} ${y - 14}Q${x} ${y - 22} ${x + 4} ${y - 27}"/>` +
      `<ellipse style="fill:var(--ink)" cx="${x + 11}" cy="${y - 24}" rx="8" ry="4.5" transform="rotate(-28 ${x + 11} ${y - 24})"/>`);
    const f = R10.disc(fr, x, y, 16, 'card'); f.p.style.boxShadow = '0 0 0 3px var(--ink)';
  });
  pts.forEach((p, k) => {
    const x = [50, 230, 410][k], ch = R9.card(g, x, 282, 140, 50, 16); K.enter(ch.o, T.b[0] + .1 + k * .08, 'pop');
    const put = (n, acc) => { if (p.label) { const w = R4.word(K, n.p, p.label, 70, 8, 28, null, 120); if (acc) w.classList.add('u-bubble-text'); } else R9.ico(n.p, p.icon, 70, 25, 28, acc ? 'u-bubble-text' : 'u-label'); };
    put(ch, false); if (k > at) ch.o.style.opacity = .35;
    if (k <= at) { const l = R10.lit(K, g, x, 282, 140, 50, 16, st[k]); put(l, true); if (k < at) R7.hide(l.o, st[k + 1]); }
  });
  if (res) { const r = R9.acc(g, 412, 62, 140, 104, 20); R10.iconWord(K, r.p, res, 140, 12, 40, 28, true); K.enter(r.o, T.hit + .45, 'pop'); }
});

/* ================= B10 คน: who? {icon, label?}, label?, tags? [≤2] ================= */
/* 9 · a cinema seat with a reserved card on it: on the key word the card flips up, made out to this kind of person */
R3.both('B10', 'seat', 'เก้าอี้มีป้ายจองไว้ให้คนกลุ่มนี้', (K, s, T, g) => {
  const who = s.who ?? {icon: 'user'}, tags = (s.tags ?? []).slice(0, 2);
  const ch = R10.group(g, 300, 330); K.enter(ch, T.b[0], 'rise');
  R7.plain(ch, 100, 326, 400, 10, 'main', '5px');
  R7.plain(ch, 178, 6, 244, 188, 'main', '44px 44px 16px 16px');
  R7.plain(ch, 182, 202, 236, 58, 'main', '18px');
  [[128, 150], [422, 150]].forEach(([x, y]) => { R7.plain(ch, x, y, 50, 24, 'main', '12px'); R7.plain(ch, x + 8, y + 30, 34, 326 - y - 30, 'main', '8px 8px 2px 2px'); });
  const W = 214, H = 150, c = R9.card(g, 300 - W / 2, 202 - H, W, H, 18);
  const av = R10.disc(c.p, W / 2, 38, 26, 'acc'); R9.ico(av.p, who.icon, 26, 26, 30, 'u-bubble-text');
  if (s.label) R4.word(K, c.p, s.label, W / 2, 70, 30, null, W - 24);
  tags.forEach((t, k) => { const w = tags.length === 2 ? 96 : 140, x = tags.length === 2 ? 9 + k * 100 : (W - w) / 2, cp = R9.acc(c.p, x, 112, w, 30, 15); R9.accWord(K, cp.p, t, w / 2, 1, 20, null, w - 14); K.enter(cp.o, T.hit + .5 + k * .1, 'pop'); });
  const t0 = T.hit - .3; A(c.o, [{opacity: 0}, {opacity: 1}], t0, .15);
  c.m.style.transformOrigin = '50% 100%'; A(c.m, [{transform: 'perspective(700px) rotateX(84deg)'}, {transform: 'none'}], t0, .75, {e: EASE.smooth});
});

/* 10 · a parcel: on the key word the shipping label made out to this kind of person is slapped on the box */
R3.both('B10', 'parcel', 'กล่องพัสดุ ใบจ่าหน้าถึงคนกลุ่มนี้แปะลงบนกล่อง', (K, s, T, g) => {
  const who = s.who ?? {icon: 'user'}, tags = (s.tags ?? []).slice(0, 2);
  const F = 'M110 128H380V318H110Z', Tp = 'M110 128L172 80H442L380 128Z', Sd = 'M380 128L442 80V270L380 318Z';
  const bx = R10.group(g, 276, 318); K.enter(bx, T.b[0], 'rise');
  R8.svg(bx, `<path class="fl" d="${Tp}"/><path class="u-fl-edge" d="${Tp}"/><path class="fl" d="${Sd}"/><path class="u-fl-edge" d="${Sd}"/><path class="fl" d="${F}"/><path class="u-fl-edge" d="${F}"/>` +
    `<path class="ac" style="stroke:none" d="M226 128L288 80H322L260 128Z"/><rect class="ac" style="stroke:none" x="226" y="128" width="34" height="40"/>`);
  const W = 222, c = R9.card(g, 134, 152, W, 142, 14);
  const av = R10.disc(c.p, 44, 46, 28, 'acc'); R9.ico(av.p, who.icon, 28, 28, 32, 'u-bubble-text');
  if (s.label) R6.wordL(K, c.p, s.label, 82, 24, 32, null, W - 96); else R10.bar(c.p, 82, 40, 110, 14);
  tags.forEach((t, k) => { const cp = R9.acc(c.p, 20 + k * 102, 92, 94, 32, 16); R9.accWord(K, cp.p, t, 47, 2, 20, null, 82); K.enter(cp.o, T.hit + .45 + k * .1, 'pop'); });
  if (!tags.length) [0, 1].forEach(k => R10.bar(c.p, 20, 92 + k * 22, 150 - k * 50, 12));
  K.enter(c.o, T.hit - .15, 'drop'); K.punch(c.p, LG.arrive('drop', T.hit - .15));
});

/* ================= B12 เหตุกับผล: items [3 {icon, label?, tone?}], end? ================= */
/* 11 · a tap: the handle turns, the water runs along the pipe through the valve (the middle cause) and fills the tank (the
   effect; red when it is bad: ท่วม). In place of the snowball (Friend 2026-11-11: "ตัดกระดานหก เก็บก๊อกน้ำ") */
R3.both('B12', 'pipe', 'ก๊อกเปิด น้ำไหลตามท่อไปเติมแท็งก์', (K, s, T, g) => {
  const it = (s.items ?? []).slice(0, 3), neg = it[2]?.tone === 'neg', route = 'M150 84H432Q456 84 456 108V150';
  const pp = R8.svg(g, `<path style="fill:none;stroke:var(--ink);stroke-width:40px;stroke-linejoin:round" d="${route}"/>`); K.enter(pp, T.b[0], 'lead');
  const wt = R8.svg(g, `<path class="u-acc-line" style="stroke-width:14px" d="${route}"/>`); R7.show(wt, T.b[1] + .35); K.draw(wt.querySelector('path'), T.b[1] + .35, .9);
  /* the tap: the wall plate, the tap body and the T handle that is turned (the first cause) */
  const tp = R10.group(g, 80, 90); K.enter(tp, T.b[0], 'pop');
  R7.plain(tp, 14, 36, 30, 100, 'main', '10px'); R7.plain(tp, 44, 62, 110, 44, 'main', '12px'); R7.plain(tp, 88, 34, 20, 30, 'main', '4px');
  const hd = R9.acc(tp, 46, 6, 104, 34, 17); if (it[0]) R9.ico(hd.p, it[0].icon, 52, 17, 26, 'u-bubble-text');
  A(hd.m, [{transform: 'none'}, {transform: 'rotate(-24deg)'}, {transform: 'rotate(-18deg)'}], T.b[1], .45, {e: EASE.inout, f: 'forwards'});
  if (it[0]?.label) { const c = R9.card(g, 24, 146, 160, 50, 16); R4.word(K, c.p, it[0].label, 80, 7, 28, null, 144); K.enter(c.o, T.b[0] + .25, 'pop'); }
  /* the middle cause: a valve wheel on the pipe, which the water turns as it goes through */
  const v = R10.disc(g, 262, 84, 48, 'card'); v.p.style.boxShadow = '0 0 0 5px var(--ink)'; K.enter(v.o, T.b[0] + .2, 'pop');
  if (it[1]) R9.ico(v.p, it[1].icon, 48, 48, 44);
  K.punch(v.p, T.b[1] + .75);
  if (it[1]?.label) R4.word(K, g, it[1].label, 262, 140, 30, T.b[0] + .35, 150);
  /* the tank: the water rises near the brim on the key word */
  const tk = R9.card(g, 346, 150, 204, 182, 24); tk.p.style.overflow = 'hidden'; K.enter(tk.o, T.b[0] + .15, 'rise');
  const lv = div('left:0;right:0;bottom:0;height:66%', tk.p); lv.className = neg ? 'u-neg' : 'u-col-acc';
  A(lv, [{transform: 'translateY(100%)'}, {transform: 'none'}], T.hit - .25, 1, {e: EASE.inout});
  if (it[2]) { R9.ico(tk.p, it[2].icon, 38, 32, 32); if (it[2].label) R6.wordL(K, tk.p, it[2].label, 62, 12, 30, T.b[0] + .4, 130); }
});

/* 12 · a pool shot: the cue hits the first ball, it rolls into the second, and the second rolls to the pocket, where the
   effect lights up */
R3.both('B12', 'pool', 'ลูกพูลชนต่อกัน แล้วลงหลุม', (K, s, T, g) => {
  const it = (s.items ?? []).slice(0, 3), W = 520, H = 292, R = 34;
  const c = R9.card(g, 30, 30, W, H, 38); K.enter(c.o, T.b[0], 'rise'); R10.bar(c.p, 20, 20, W - 40, H - 40, null, 24);
  [[36, 36], [36, H - 36], [W - 36, H - 36]].forEach(([x, y]) => R10.disc(c.p, x, y, 20, 'main'));
  const PK = [W - 52, 52], pk0 = R10.disc(c.p, PK[0], PK[1], 36, 'main');
  /* the path: cue ball from cb0 to where it meets the second ball (cb), the second ball from ob0 to the pocket's lip (ob) */
  const cb0 = [74, 150], ob0 = [270, 150], dir = [ob0[0] - cb0[0], ob0[1] - cb0[1]], dl = Math.hypot(...dir), u = dir.map(v => v / dl);
  const cb = [ob0[0] - u[0] * 2 * R, ob0[1] - u[1] * 2 * R], ob = [PK[0] - 48, PK[1] + 48];   // the cue ball comes straight from the left, so it never runs over a word
  const tS = T.b[1] + .2, tC = T.b[2] - .05, tP = T.hit - .1;
  /* the trails, seen as each ball rolls */
  const trail = (d, a, b) => { const e = div(`left:0;top:0;width:${W}px;height:${H}px`, c.p, `<svg width="${W}" height="${H}" style="overflow:visible"><path class="ln u-thin u-dash" d="${d}"/></svg>`); A(e, [{opacity: 0}, {opacity: 1}], a, b - a); };
  trail(`M${cb0[0] + u[0] * 36} ${cb0[1] + u[1] * 36}L${cb[0] - u[0] * 36} ${cb[1] - u[1] * 36}`, tS, tC);
  trail(`M${ob0[0] + 34} ${ob0[1] - 12}L${ob[0] - 30} ${ob[1] + 10}`, tC, tP);
  const cue = R6.group(c.p); R8.svg(cue, `<path class="ln" d="M-90 ${cb0[1]}L${cb0[0] - 46} ${cb0[1]}"/>`);
  A(cue, [{transform: 'none'}, {transform: `translate(${u[0] * 16}px,${u[1] * 16}px)`}, {transform: `translate(${-u[0] * 10}px,${-u[1] * 10}px)`}], tS - .25, .4, {e: EASE.inout, f: 'forwards'});
  const ball = (p, [x, y], [x1, y1], t0, t1, above) => {
    const b = node(c.p, x - R, y - R, 2 * R, 2 * R, ''); const d = R7.plain(b.p, 0, 0, 2 * R, 2 * R, 'main', '50%'); if (p) R10.inkIco(d.p, p.icon, R, R, 36);
    if (p?.label) R4.word(K, b.p, p.label, R, above ? -40 : 2 * R + 6, 28, null, 170);
    A(b.m, [{transform: 'none'}, {transform: `translate(${x1 - x}px,${y1 - y}px)`}], t0, t1 - t0, {e: 'cubic-bezier(.15,.6,.35,1)', f: 'forwards'});
    K.enter(b.o, T.b[0] + .3, 'pop'); return b;
  };
  ball(it[0], cb0, cb, tS, tC, true); ball(it[1], ob0, ob, tC, tP, false);
  const pk = R10.lit(K, c.p, PK[0] - 36, PK[1] - 36, 72, 72, '50%', tP + .1); pk.p.style.boxShadow = '0 0 0 8px var(--tr)'; void pk0;
  if (it[2]) R9.ico(pk.p, it[2].icon, 36, 36, 40, 'u-bubble-text');
  R1.ripple(K, pk, pk.done, {grow: 22, r: '50%'});
  if (it[2]?.label) R4.word(K, c.p, it[2].label, PK[0] - 116, PK[1] - 24, 28, pk.done, 136);
});

/* ================= B16 นิยาม: term {icon?, label}, means [1-3 {icon, label?}] ================= */
/* 13 · word cards on a ring: the card with the word flips up over the big ring and shows the card with what it means */
R3.both('B16', 'flash', 'บัตรคำศัพท์ร้อยห่วง พลิกจากคำไปหาความหมาย', (K, s, T, g) => {
  const term = s.term ?? {}, means = (s.means ?? []).slice(0, 3), W = 236, H = 262, X = 300 - W / 2, Y = 66;
  const all = R10.group(g, 300, Y); K.enter(all, T.b[0], 'rise');
  [[22, 7], [11, 3.5]].forEach(([o, r]) => { const b = R9.card(all, X + o, Y + o * .4, W, H, 24); b.o.classList.add('u-decor');
    b.p.style.transform = `rotate(${r}deg)`; b.p.style.transformOrigin = `${W / 2}px 26px`; });
  /* the meaning card (seen once the word card has flipped away) */
  const c = R9.card(all, X, Y, W, H, 24); R7.show(c.o, T.hit - .3);   // shown only as the word card flips: a see-through (glass) word card would show it
  R10.disc(c.p, W / 2, 28, 11, 'main');
  if (term.label) R4.word(K, c.p, term.label, W / 2, 50, 28, null, W - 40);
  R10.bar(c.p, 24, 92, W - 48, 4, null, 2);
  const rows = means.length ? means : [{icon: term.icon ?? 'book-open'}], n = rows.length;
  if (n === 1) R10.iconWord(K, c.p, rows[0], W, 112, 62, 40);
  else rows.forEach((m, k) => { const y = 112 + k * (140 / n); R9.ico(c.p, m.icon, 46, y + 22, 34); if (m.label) R6.wordL(K, c.p, m.label, 76, y, 32, null, W - 90); });
  /* the word card on top: the word big; it flips up round the ring and is gone */
  const wc = R9.card(all, X, Y, W, H, 24); R10.disc(wc.p, W / 2, 28, 11, 'main');
  if (term.icon) R9.ico(wc.p, term.icon, W / 2, 112, 56);
  if (term.label) R4.word(K, wc.p, term.label, W / 2, term.icon ? 150 : 104, 44, null, W - 30);
  wc.m.style.transformOrigin = '50% 0';
  A(wc.m, [{transform: 'perspective(900px) rotateX(0)'}, {transform: 'perspective(900px) rotateX(100deg)'}], T.hit - .35, .55, {e: 'cubic-bezier(.5,0,.75,.4)', f: 'forwards'});
  R7.hide(wc.o, T.hit + .2);
  R8.svg(all, `<circle class="ln" cx="${X + W / 2}" cy="${Y - 8}" r="40"/>`);
});

/* 14 · a label maker: the word on its little screen, the button is pressed, and a printed label with the meaning comes out */
R3.both('B16', 'labeler', 'เครื่องพิมพ์ฉลาก พิมพ์ความหมายออกมา', (K, s, T, g) => {
  const term = s.term ?? {}, means = (s.means ?? []).slice(0, 3), X = 50, Y = 30, W = 190, H = 290;
  const dv = R7.plain(g, X, Y, W, H, 'main', '34px'); K.enter(dv.o, T.b[0], 'rise');
  const sc = R9.card(dv.p, 18, 20, W - 36, 96, 14);
  if (term.icon) R9.ico(sc.p, term.icon, (W - 36) / 2, 26, 28);
  if (term.label) R4.word(K, sc.p, term.label, (W - 36) / 2, 44, 30, T.b[1], W - 60);
  const bt = R10.disc(dv.p, W / 2, 196, 46, 'acc'); R9.ico(bt.p, 'printer', 46, 46, 40, 'u-bubble-text');
  A(bt.m, [{transform: 'none'}, {transform: 'scale(.86)'}, {transform: 'none'}], T.b[2] - .1, .35, {e: EASE.inout, f: 'none'});
  const rows = means.length ? means : [{icon: 'tag'}], n = rows.length, th = n === 1 ? 92 : 70, gap = 18, y0 = Y + H / 2 - (n * th + (n - 1) * gap) / 2;
  rows.forEach((m, k) => {
    const t = R9.acc(g, X + W, y0 + k * (th + gap), 300, th, 0);
    t.p.style.clipPath = `polygon(0 0,100% 0,96% 25%,100% 50%,96% 75%,100% 100%,0 100%)`; t.p.style.boxShadow = 'none';
    R9.ico(t.p, m.icon, 42, th / 2, th > 80 ? 44 : 34, 'u-bubble-text');
    if (m.label) { const w = R6.wordL(K, t.p, m.label, 76, th / 2 - (th > 80 ? 26 : 21), th > 80 ? 42 : 34, null, 190); w.classList.add('u-bubble-text'); }
    A(t.o, [{clipPath: 'inset(-10px 100% -10px -10px)'}, {clipPath: 'inset(-10px -10px -10px -10px)'}], T.b[2] + .15 + k * .3, .8, {e: 'cubic-bezier(.3,0,.5,1)'});
  });
});

/* ================= B17 ไล่รายการ: items [2-4 {icon, label?}], label? ================= */
/* 15 · a phone: on its home screen a folder opens up and shows the things inside, with the group's name on top */
R3.both('B17', 'folder', 'โฟลเดอร์แอปในมือถือ ขยายออกเห็นของข้างใน', (K, s, T, g) => {
  const it = (s.items ?? []).slice(0, 4), n = it.length;
  const ph = R7.plain(g, 160, 0, 280, 340, 'main', '46px'); K.enter(ph.o, T.b[0], 'rise');
  const sc = R9.card(ph.p, 12, 12, 256, 328, 36);
  for (let i = 0; i < 24; i++) { const x = 22 + (i % 4) * 58, y = 26 + Math.floor(i / 4) * 52; const a = R10.bar(sc.p, x, y, 40, 40, null, 12); a.classList.add('u-decor'); }
  if (s.label) R4.word(K, sc.p, s.label, 128, 58, 32, T.b[1] + .3, 220); else R10.bar(sc.p, 70, 72, 116, 14);
  const fd = R7.plain(sc.p, 20, 108, 216, n > 2 ? 206 : 120, 'soft', '34px');
  fd.m.style.transformOrigin = '30% 20%'; A(fd.m, [{transform: 'scale(.24)'}, {transform: 'none'}], T.b[1], .7, {e: EASE.smooth}); K.enter(fd.o, T.b[1] - .05, 'lead');
  const ts = 64, gx = 40, x0 = (216 - (2 * ts + gx)) / 2, tt = LG.spread(T.b[2] - .2, T.hit, n);
  it.forEach((p, k) => {
    const x = x0 + (k % 2) * (ts + gx), y = 16 + Math.floor(k / 2) * 98, t = R7.plain(fd.p, x, y, ts, ts, k === 0 ? 'acc' : 'main', '18px');
    if (k === 0) R9.ico(t.p, p.icon, ts / 2, ts / 2, 34, 'u-bubble-text'); else R10.inkIco(t.p, p.icon, ts / 2, ts / 2, 34);
    if (p.label) R4.word(K, fd.p, p.label, x + ts / 2, y + ts + 2, 20, tt[k] + .1, ts + 34);
    K.enter(t.o, tt[k], 'pop');
  });
});

/* 16 · a cantilever toolbox: the trays swing up and out on their arms and show what the kit holds; the group's name on the box */
R3.both('B17', 'toolbox', 'กล่องเครื่องมือ ถาดกางออกเป็นชั้น', (K, s, T, g) => {
  const it = (s.items ?? []).slice(0, 4), n = it.length, L = it.slice(0, Math.ceil(n / 2)), Rr = it.slice(Math.ceil(n / 2)), t0 = T.b[1] + .1, d = .9;
  const arms = [[196, 214, 104, 172], [236, 214, 144, 172], [404, 214, 496, 172], [364, 214, 456, 172]];
  const am = R8.svg(g, arms.map(([x0, y0, x1, y1]) => `<path style="fill:none;stroke:var(--sd);stroke-width:14px;stroke-linecap:round" d="M${x0} ${y0}L${x1} ${y1}"/>`).join('') +
    arms.flatMap(([x0, y0, x1, y1]) => [[x0, y0], [x1, y1]]).map(([x, y]) => `<circle class="fl" cx="${x}" cy="${y}" r="8"/><circle class="u-fl-edge" cx="${x}" cy="${y}" r="8"/>`).join(''));
  A(am, [{opacity: 0}, {opacity: 1}], t0 + .2, .4);
  const bx = R10.group(g, 300, 330); K.enter(bx, T.b[0], 'rise');
  R8.svg(bx, `<path class="ln" d="M256 206V182Q256 170 268 170H332Q344 170 344 182V206"/>`);
  /* the trays: they start shut on top of the box and swing out to the sides */
  [[L, 14], [Rr, 366]].forEach(([grp, x]) => {
    if (!grp.length) return;
    const W = 220, cxs = grp.length === 1 ? [W / 2] : [56, W - 56], tg = R6.group(g);
    grp.forEach((p, k) => R9.ico(tg, p.icon, x + cxs[k], 70, 70));
    R7.plain(tg, x, 88, W, 14, 'main', '7px 7px 0 0');
    const tr = R9.card(tg, x, 102, W, 70, 0); tr.p.style.borderRadius = '0 0 16px 16px';
    grp.forEach((p, k) => { if (p.label) R4.word(K, tr.p, p.label, cxs[k], 16, 28, null, grp.length === 1 ? 196 : 100); });
    A(tg, [{opacity: 0, transform: `translate(${190 - x}px,96px)`}, {opacity: 1, transform: 'none'}], t0, d, {e: EASE.smooth});
  });
  R7.plain(bx, 176, 206, 248, 16, 'main', '8px 8px 0 0');
  const base = R9.card(bx, 176, 222, 248, 110, 0); base.p.style.borderRadius = '0 0 22px 22px';
  if (s.label) R4.word(K, base.p, s.label, 124, 30, 38, T.b[0] + .3, 214); else R9.ico(base.p, 'wrench', 124, 55, 48);
});

/* ================= B18 เล่าเหตุการณ์: what {icon, label?}, who?, when? ================= */
/* 17 · a stage: when it was is on the band above; the curtains part and show what happened */
R3.both('B18', 'curtain', 'ม่านเวทีเปิดออก เห็นเหตุการณ์', (K, s, T, g) => {
  const what = s.what ?? {icon: 'sparkles'}, who = s.who, t0 = T.b[2] - .2;
  const W = 230, H = 200, c = R9.card(g, 300 - W / 2, 98, W, H, 24); K.enter(c.o, t0 + .15, 'pop');
  if (who) { const av = R10.disc(c.p, 40, 36, 22, 'acc'); R9.ico(av.p, who.icon, 22, 22, 26, 'u-bubble-text'); if (who.label) R6.wordL(K, c.p, who.label, 70, 18, 26, null, W - 90); }
  R9.ico(c.p, what.icon, W / 2, who ? 108 : 86, 68);
  if (what.label) R4.word(K, c.p, what.label, W / 2, who ? 146 : 130, 32, null, W - 24);
  /* the curtains: shut across the stage, then drawn back to the sides (the path changes shape, gathered at the edge) */
  const cu = R8.svg(g, `<path class="sd" d="M50 60H300Q300 150 300 316H50Z"/><path class="sd" d="M550 60H300Q300 150 300 316H550Z"/>`); K.enter(cu, T.b[0], 'lead');
  const [l, r] = cu.querySelectorAll('path');
  A(l, [{d: `path('M50 60H300Q300 150 300 316H50Z')`}, {d: `path('M50 60H160Q126 150 152 316H50Z')`}], t0, .9, {e: EASE.inout});
  A(r, [{d: `path('M550 60H300Q300 150 300 316H550Z')`}, {d: `path('M550 60H440Q474 150 448 316H550Z')`}], t0, .9, {e: EASE.inout});
  const fl = R7.plain(g, 50, 316, 500, 14, 'main', '7px'); K.enter(fl.o, T.b[0], 'lead');
  const v = R9.acc(g, 50, 6, 500, 62, 0); K.enter(v.o, T.b[0], 'drop');
  v.p.style.clipPath = `path('M0 0H500V44Q479 62 458 44Q437 62 416 44Q395 62 374 44Q353 62 332 44Q311 62 290 44Q269 62 248 44Q227 62 206 44Q185 62 164 44Q143 62 122 44Q101 62 80 44Q59 62 38 44Q17 62 0 44Z')`;
  if (s.when) R9.accWord(K, v.p, s.when, 250, 2, 32, T.b[1], 400);
});

/* 18 · a video rewinds: the playhead runs back along the bar (a dashed arrow behind it shows how far) to the moment it
   happened; that moment shows on the screen, and when it was rides on the playhead */
R3.both('B18', 'rewind', 'วิดีโอย้อนกลับ แถบเวลาวิ่งย้อนไปถึงเหตุการณ์', (K, s, T, g) => {
  const what = s.what ?? {icon: 'sparkles'}, who = s.who, W = 520, H = 332, t0 = T.b[1] + .2, t1 = T.hit - .1;
  const c = R9.card(g, 40, 4, W, H, 28); K.enter(c.o, T.b[0], 'rise');
  const sc = R10.bar(c.p, 20, 20, W - 40, 186, null, 18);
  const rw = R9.acc(sc, W - 40 - 78, 14, 64, 64, '50%'); R9.ico(rw.p, 'rewind', 32, 32, 36, 'u-bubble-text'); K.enter(rw.o, t0 - .1, 'pop');
  const ev = R10.group(sc, (W - 40) / 2, 100); K.enter(ev, t1, 'pop');
  if (who) { R9.ico(ev, who.icon, 34, 32, 28); if (who.label) R6.wordL(K, ev, who.label, 56, 13, 28, null, 220); }
  R9.ico(ev, what.icon, (W - 40) / 2, 82, 80);
  if (what.label) R4.word(K, ev, what.label, (W - 40) / 2, 128, 38, null, W - 100);
  const tw = W - 40, y = 296, fx = .2, fe = .86, px = 20 + tw * fx;
  R10.bar(c.p, 20, y - 7, tw, 14);
  const fl = R10.bar(c.p, 20, y - 7, tw, 14, 'u-col-acc'); fl.style.transformOrigin = '0 50%';
  A(fl, [{transform: `scaleX(${fe})`}, {transform: `scaleX(${fx})`}], t0, t1 - t0, {e: EASE.inout});
  const ar = div(`left:0;top:0;width:${W}px;height:${H}px`, c.p, `<svg width="${W}" height="${H}" style="overflow:visible"><path class="ln u-thin u-dash" d="M${20 + tw * fe} ${y}H${px + 34}"/>` +
    `<path class="ln u-thin" d="M${px + 48} ${y - 12}L${px + 34} ${y}L${px + 48} ${y + 12}"/></svg>`);
  A(ar, [{clipPath: `inset(0 ${W - 20 - tw * fe}px 0 ${20 + tw * fe}px)`}, {clipPath: `inset(0 ${W - 20 - tw * fe}px 0 ${px}px)`}], t0, t1 - t0, {e: EASE.inout});
  const kn = node(c.p, px - 18, y - 18, 36, 36, 'u-badge u-acc'); kn.p.style.borderRadius = '50%'; K.enter(kn.o, T.b[0] + .3, 'pop');
  A(kn.m, [{transform: `translateX(${tw * (fe - fx)}px)`}, {transform: 'none'}], t0, t1 - t0, {e: EASE.inout});
  if (s.when) { const ch = R9.acc(c.p, Math.max(14, px - 80), 222, 160, 40, 20); R9.accWord(K, ch.p, s.when, 80, 2, 26, null, 146); K.enter(ch.o, T.hit, 'pop'); }
});

/* ================= B19 ความรู้สึก: feel {icon, label?}, who?, mood? ================= */
/* 19 · a person filling up with the feeling, from the feet up to the chest (good = accent, bad = red) */
R3.both('B19', 'fill', 'ตัวคนเติมสีความรู้สึกจากเท้าขึ้นมา', (K, s, T, g) => {
  const f = s.feel ?? {icon: 'smile'}, bad = s.mood === 'bad', X = 176, Y = 14, W = 248, H = 322;
  const P = `M124 0A58 58 0 1 1 123.9 0ZM14 ${H}C14 230 52 166 124 166C196 166 234 230 234 ${H}Z`;
  const pr = R10.group(g, 300, 330); K.enter(pr, T.b[0], 'rise');
  const body = div(`left:${X}px;top:${Y}px;width:${W}px;height:${H}px;clip-path:path('${P}');background:var(--tr)`, pr);
  const lv = div(`left:0;right:0;bottom:0;height:84%`, body); lv.className = bad ? 'u-neg' : 'u-col-acc';
  A(lv, [{transform: 'translateY(100%)'}, {transform: 'none'}], T.hit - .4, 1.1, {e: EASE.inout});
  div(`left:${X}px;top:${Y}px;width:${W}px;height:${H}px`, pr, `<svg width="${W}" height="${H}" style="overflow:visible"><path class="ln u-thin" d="${P}"/></svg>`);
  const c = R9.card(g, 404, 34, 150, 128, 22); R10.iconWord(K, c.p, f, 150, 16, 44, 30); K.enter(c.o, T.hit + .3, 'pop');
  if (s.who?.label) R4.word(K, g, s.who.label, 479, 172, 26, T.hit + .45, 140);
});

/* 20 · a mood slider (like a story sticker): the face slides along and the bar fills to how strong the feeling is */
R3.both('B19', 'slider', 'แถบเลื่อนอารมณ์ ปุ่มหน้าเลื่อนไปจนสุด', (K, s, T, g) => {
  const f = s.feel ?? {icon: 'smile'}, bad = s.mood === 'bad', X = 44, Y = 34, W = 506, H = 272, v = .8;
  const c = R9.card(g, X, Y, W, H, 36); K.enter(c.o, T.b[0], 'rise');
  if (s.who?.icon) R9.ico(c.p, s.who.icon, 58, 64, 40);
  if (f.label) R6.wordL(K, c.p, f.label, s.who?.icon ? 92 : 40, 32, 50, T.b[1], W - 140);
  const tw = W - 120, ty = 178, x0 = 60; R10.bar(c.p, x0, ty - 22, tw, 44);
  const fl = R10.bar(c.p, x0, ty - 22, tw * v, 44, bad ? 'u-neg' : 'u-col-acc'); fl.style.transformOrigin = '0 50%';
  A(fl, [{transform: 'scaleX(.1)'}, {transform: 'none'}], T.hit - .3, 1, {e: EASE.inout});
  const hd = R10.disc(c.p, x0 + tw * v, ty, 64, 'main'); R10.inkIco(hd.p, f.icon, 64, 64, 76); K.enter(hd.o, T.b[1] + .2, 'pop');
  A(hd.m, [{transform: `translateX(${-tw * (v - .1)}px)`}, {transform: 'none'}], T.hit - .3, 1, {e: EASE.inout});
});

/* ================= sentences to try (r10.*; not Friend's script; one per variant, plus other forms of the slots) ================= */
SENTENCE('r10.shop', {cat: 'B04', name: 'สมัคร ลงสินค้า เปิดขาย', say: ['สมัครก่อน ลงสินค้า', 'แล้วเปิดขาย'],
  items: [{icon: 'user-plus', label: 'สมัคร'}, {icon: 'package', label: 'ลงสินค้า'}, {icon: 'store', label: 'เปิดขาย'}], mark: {at: 2, how: 'light'}});
SENTENCE('r10.buy', {cat: 'B06', name: 'ลูกค้าลังเล ซื้อหรือไม่ซื้อ', say: ['ลูกค้ายังลังเลว่า', 'ซื้อหรือไม่ซื้อ'],
  about: {icon: 'user', label: 'ลูกค้า'}, options: [{icon: 'check', label: 'ซื้อ'}, {icon: 'x', label: 'ไม่ซื้อ'}]});
SENTENCE('r10.quiet', {cat: 'B06', name: 'ทำไมร้านเงียบ', say: ['ทำไมร้านเงียบ', 'ขนาดนี้'], about: {icon: 'store', label: 'ร้านเงียบ'}});
SENTENCE('r10.loan', {cat: 'B07', name: 'ระวังก่อนกู้เงิน', say: ['ระวังให้ดี', 'ก่อนกู้เงิน'], thing: {icon: 'landmark', label: 'กู้เงิน'}, how: 'flag', sign: 'triangle-alert'});
SENTENCE('r10.cheap', {cat: 'B07', name: 'อย่าหลงของถูก', say: ['อย่าหลงเชื่อ', 'ของถูกเกินจริง'], thing: {icon: 'tag', label: 'ของถูก'}, how: 'cross'});
SENTENCE('r10.run', {cat: 'B09', name: 'อาทิตย์แรก เดือนแรก สามเดือน', say: ['วิ่งทุกวัน อาทิตย์แรก', 'จนครบสามเดือน'],
  points: [{icon: 'calendar', label: 'อาทิตย์แรก'}, {icon: 'calendar-days', label: 'เดือนแรก'}, {icon: 'calendar-check', label: 'สามเดือน'}], at: 2});
SENTENCE('r10.grow', {cat: 'B09', name: 'ปีแรก ปีที่สอง ปีที่ห้าเห็นผล', say: ['ปีแรก ปีที่สอง', 'ปีที่ห้าเริ่มเห็นผล'],
  points: [{icon: 'sprout', label: 'ปีแรก'}, {icon: 'leaf', label: 'ปีที่สอง'}, {icon: 'trees', label: 'ปีที่ห้า'}], at: 2, result: {icon: 'trending-up', label: 'เห็นผล'}});
SENTENCE('r10.mom', {cat: 'B10', name: 'คุณแม่มือใหม่', say: ['สำหรับคุณแม่มือใหม่', 'ที่ลูกยังเล็ก'], who: {icon: 'user'}, label: 'คุณแม่มือใหม่', tags: ['ลูกยังเล็ก']});
SENTENCE('r10.seller', {cat: 'B10', name: 'แม่ค้าออนไลน์มือใหม่', say: ['คลิปนี้สำหรับแม่ค้าออนไลน์', 'มือใหม่'], who: {icon: 'store'}, label: 'แม่ค้าออนไลน์', tags: ['มือใหม่']});
SENTENCE('r10.debt', {cat: 'B12', name: 'รูดบัตร ดอกเบี้ย หนี้ท่วม', say: ['รูดบัตร ดอกเบี้ยทบ', 'จนหนี้ท่วม'],
  items: [{icon: 'credit-card', label: 'รูดบัตร'}, {icon: 'percent', label: 'ดอกเบี้ย'}, {icon: 'trending-down', label: 'หนี้ท่วม', tone: 'neg'}]});
SENTENCE('r10.share', {cat: 'B12', name: 'พอใจ บอกต่อ ยอดเพิ่ม', say: ['ลูกค้าพอใจ ก็บอกต่อ', 'ยอดเพิ่มเอง'],
  items: [{icon: 'smile', label: 'ลูกค้าพอใจ'}, {icon: 'share-2', label: 'บอกต่อ'}, {icon: 'trending-up', label: 'ยอดเพิ่ม'}]});
SENTENCE('r10.fomo', {cat: 'B16', name: 'FOMO คืออาการกลัวตกขบวน', say: ['FOMO คืออาการ', 'กลัวตกขบวน'], term: {icon: 'zap', label: 'FOMO'}, means: [{icon: 'clock', label: 'กลัวตกขบวน'}]});
SENTENCE('r10.sub', {cat: 'B16', name: 'Subscription คือจ่ายรายเดือน', say: ['Subscription คือ', 'จ่ายรายเดือน'], term: {icon: 'package', label: 'Subscription'}, means: [{icon: 'repeat', label: 'จ่ายรายเดือน'}]});
SENTENCE('r10.costs', {cat: 'B17', name: 'ต้นทุน ค่าเช่า ค่าแรง ค่าไฟ', say: ['ต้นทุนมีทั้ง ค่าเช่า', 'ค่าแรง ค่าไฟ'],
  items: [{icon: 'house', label: 'ค่าเช่า'}, {icon: 'users', label: 'ค่าแรง'}, {icon: 'zap', label: 'ค่าไฟ'}], label: 'ต้นทุน'});
SENTENCE('r10.cafe', {cat: 'B17', name: 'ร้านกาแฟต้องมี เครื่องชง นม แก้ว', say: ['ร้านกาแฟต้องมีเครื่องชง', 'นม แก้ว'],
  items: [{icon: 'coffee', label: 'เครื่องชง'}, {icon: 'milk', label: 'นม'}, {icon: 'cup-soda', label: 'แก้ว'}], label: 'ร้านกาแฟ'});
SENTENCE('r10.dad', {cat: 'B18', name: 'ปี 2010 พ่อเปิดร้านแรก', say: ['ปี 2010 พ่อ', 'เปิดร้านแรก'], what: {icon: 'store', label: 'เปิดร้านแรก'}, who: {icon: 'user', label: 'พ่อ'}, when: 'ปี 2010'});
SENTENCE('r10.quit', {cat: 'B18', name: 'ห้าปีก่อน ผมลาออก', say: ['ห้าปีก่อน ผม', 'ลาออกจากงาน'], what: {icon: 'briefcase', label: 'ลาออก'}, who: {icon: 'user', label: 'ผม'}, when: 'ห้าปีก่อน'});
SENTENCE('r10.proud', {cat: 'B19', name: 'ผมรู้สึกภูมิใจ', say: ['ผมรู้สึก', 'ภูมิใจมาก'], feel: {icon: 'heart', label: 'ภูมิใจ'}, who: {icon: 'user', label: 'ผม'}, mood: 'good'});
SENTENCE('r10.tired', {cat: 'B19', name: 'ช่วงนั้นเหนื่อยมาก', say: ['ช่วงนั้น', 'เหนื่อยมาก'], feel: {icon: 'frown', label: 'เหนื่อย'}, mood: 'bad'});
SENTENCE('r10.check', {cat: 'B04', name: 'ล้างผัก หั่น ผัด เสร็จแล้ว', say: ['ล้างผัก หั่น', 'แล้วก็ผัด'],
  items: [{icon: 'droplet', label: 'ล้างผัก'}, {icon: 'scissors', label: 'หั่น'}, {icon: 'cooking-pot', label: 'ผัด'}], mark: {at: 1, how: 'check'}});
SENTENCE('r10.pick', {cat: 'B06', name: 'ซื้อหรือไม่ซื้อ คำตอบคือซื้อ', say: ['ซื้อหรือไม่ซื้อ', 'ซื้อสิครับ'],
  about: {icon: 'user', label: 'ลูกค้า'}, options: [{icon: 'check', label: 'ซื้อ'}, {icon: 'x', label: 'ไม่ซื้อ'}], answer: {icon: 'check', label: 'ซื้อ'}});
SENTENCE('r10.idea', {cat: 'B06', name: 'เริ่มยังไง เริ่มจากไลฟ์', say: ['ต้องเริ่มยังไง', 'เริ่มจากไลฟ์ก่อน'], about: {icon: 'rocket', label: 'เริ่มยังไง'}, answer: {icon: 'video', label: 'ไลฟ์ก่อน'}});
SENTENCE('r10.scam', {cat: 'B07', name: 'ระวังลิงก์แปลก', say: ['ระวังให้ดี', 'ลิงก์แปลก ๆ'], thing: {icon: 'link', label: 'ลิงก์แปลก'}, how: 'flag', sign: 'shield-alert'});
SENTENCE('r10.half', {cat: 'B09', name: 'ปีที่สองยังไม่เห็นผล', say: ['ตอนนี้เพิ่งผ่าน', 'ปีที่สอง'],
  points: [{icon: 'sprout', label: 'ปีแรก'}, {icon: 'leaf', label: 'ปีที่สอง'}, {icon: 'trees', label: 'ปีที่ห้า'}], at: 1});
SENTENCE('r10.calm', {cat: 'B19', name: 'โล่งใจ', say: ['พอรู้ผลแล้ว', 'โล่งใจมาก'], feel: {icon: 'smile', label: 'โล่งใจ'}, mood: 'good'});
