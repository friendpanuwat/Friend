const G12 = {
  E: {out: 'cubic-bezier(.22,1,.36,1)', inout: 'cubic-bezier(.65,0,.35,1)', fall: 'cubic-bezier(.55,0,1,.45)', soft: 'cubic-bezier(.33,1,.68,1)', lin: 'linear'},
  n: 0,
  /* the fade masks of a picture the sheet's crop cuts (the pit): left / right / top fade everything, bottom only the fill */
  fades(t) {
    if (!t.fade) return {defs: '', ml: '', mt: '', mb: ''};
    const n = ++G12.n, F = t.fade, fw = t.fw ?? .22, gr = (gid, hz, a, b) => `<linearGradient id="${gid}" gradientUnits="userSpaceOnUse" ${hz ? `x1="0" x2="${t.w}" y1="0" y2="0"` : `x1="0" x2="0" y1="0" y2="${t.h}"`}>` +
      `<stop offset="0" stop-color="#fff" stop-opacity="${a ? 0 : 1}"/><stop offset="${a ? fw : 0}" stop-color="#fff"/><stop offset="${b ? 1 - fw : 1}" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="${b ? 0 : 1}"/></linearGradient>`;
    const mk = (mid, gid) => `<mask id="${mid}" maskUnits="userSpaceOnUse" x="0" y="0" width="${t.w}" height="${t.h}"><rect width="${t.w}" height="${t.h}" fill="url(#${gid})"/></mask>`;
    return {defs: `<defs>${gr(`lpfh${n}`, 1, F.includes('l'), F.includes('r'))}${gr(`lpft${n}`, 0, F.includes('t'), false)}${gr(`lpfv${n}`, 0, false, F.includes('b'))}` +
      mk(`lpmh${n}`, `lpfh${n}`) + mk(`lpmt${n}`, `lpft${n}`) + mk(`lpmv${n}`, `lpfv${n}`) + `</defs>`, ml: ` mask="url(#lpmh${n})"`, mt: ` mask="url(#lpmt${n})"`, mb: ` mask="url(#lpmv${n})"`};
  },
  /* the traced picture fitted into the box (x, y, w, h) of the 600 × 340 canvas, centred, every part in its own layers:
     o (place: moves), m (turns, scales), c (clips) > base (body, holes) · acc (accent) · ink (lines) · top (accent ink, highlights).
     Parts in canvas px: bb (box), pv (pivot), ab (accent box). The rest is drawn first, the moving parts over it. */
  pic(g, id, x, y, w, h) {
    const t = G12D[id], k = Math.min(w / t.w, h / t.h), ox = x + (w - t.w * k) / 2, oy = y + (h - t.h * k) / 2;
    const tr = `translate(${ox.toFixed(1)} ${oy.toFixed(1)}) scale(${k.toFixed(4)})`, P = {};
    const box = b => b && {x: ox + b[0] * k, y: oy + b[1] * k, w: (b[2] - b[0]) * k, h: (b[3] - b[1]) * k, get cx() { return this.x + this.w / 2; }, get cy() { return this.y + this.h / 2; }};
    for (const q of [...t.parts].sort((a, b) => (b.n === 'rest') - (a.n === 'rest'))) {
      const o = R6.group(g), m = R6.group(o), c = R6.group(m), pv = {x: ox + q.pv[0] * k, y: oy + q.pv[1] * k};
      o.style.transformOrigin = m.style.transformOrigin = `${pv.x.toFixed(1)}px ${pv.y.toFixed(1)}px`;
      const lay = (inner, cls, body) => {
        if (!inner) return null;
        const F = G12.fades(t), e = R8.svg(c, F.defs + `<g transform="${tr}"><g${F.ml}><g${F.mt}>${body ? `<g${F.mb}>${inner}</g>` : inner}</g></g></g>`);
        if (cls) e.className = cls; return e;
      };
      const P_ = P[q.n] = {o, m, c, bb: box(q.bb), ab: box(q.ab), pv,
        base: lay(`<path d="${q.body}" style="fill:var(--lp-fill);stroke:none"/>` + (q.hole ? `<path d="${q.hole}" style="fill:var(--lp-hole);stroke:none;fill-rule:evenodd"/>` : ''), '', true),
        acc: lay(q.acc && `<path class="lp-acc" d="${q.acc}" style="fill:var(--lp-acc);stroke:none;fill-rule:evenodd"/>`, 'lpa'),
        ink: lay(q.lines && `<path d="${q.lines}" style="fill:var(--lp-ink);stroke:none;fill-rule:evenodd"/>`, 'lpg'),
        top: lay((q.hl ? `<path d="${q.hl}" style="fill:var(--lp-hl);stroke:none;fill-rule:evenodd"/>` : '') +
          (q.accl ? `<path d="${q.accl}" style="fill:var(--lp-acc-ink);stroke:none;fill-rule:evenodd"/>` : ''), 'lpg lpa')};
      P_.accs = [P_.acc, P_.top].filter(Boolean);
    }
    return {P, k, ox, oy, w: t.w * k, h: t.h * k, at: (fx, fy) => ({x: ox + fx * t.w * k, y: oy + fy * t.h * k})};
  },
  /* a plate with an icon and a word: on = the accent plate, else a quiet one; it rises in at t */
  plate(K, g, it, cx, y, on = true, maxW = 300, t) {
    if (!it) return;
    const w = Math.min(maxW, 80 + 26 * [...(it.label ?? '')].length * .62 + (it.icon ? 40 : 0)), p = on ? R9.acc(g, cx - w / 2, y, w, 60, 30) : R7.plain(g, cx - w / 2, y, w, 60, 'soft', '30px');
    p.p.style.boxShadow = 'none';
    const cls = on ? 'u-bubble-text' : 'u-inherit';
    if (t != null) A(p.o, [{opacity: 0, transform: 'translateY(16px)'}, {opacity: 1, transform: 'none'}], t, .5, {e: G12.E.out});
    if (!it.label) { R9.ico(p.p, it.icon, w / 2, 30, 34, cls); return p; }
    const l = R6.wordL(K, p.p, it.label, 0, 11, 30, null, w - (it.icon ? 76 : 36)); l.classList.add(cls);
    const ic = it.icon ? R9.ico(p.p, it.icon, 0, 30, 28, cls) : null;
    FITS.push(() => { const tw = (ic ? 38 : 0) + l.firstChild.offsetWidth, x0 = (w - tw) / 2; if (ic) ic.style.left = x0 + 'px'; l.style.left = x0 + (ic ? 38 : 0) + 'px'; });
    return p;
  },
};
/* the moves: one continuous timeline per draft, eased in and out, nothing pops or bounces (Friend 2026-11-12: "การเคลื่อนไหว
   ผมอยากได้แบบมืออาชีพเลยอะ"); every draft is a small mechanism of 3–4 beats that ends in its result on the key word (LESSONS 52) */
const GM = {
  /* one keyframe track: [time, value, easing to the next] … */
  seq(el, prop, pts) {
    const t0 = pts[0][0], t1 = pts[pts.length - 1][0], L = Math.max(t1 - t0, .001);
    return A(el, pts.map(([t, v, e]) => ({[prop]: v, offset: Math.min(1, Math.max(0, (t - t0) / L)), easing: e ?? 'linear'})), t0, L, {f: 'both'});
  },
  show: (el, t, d = .35, e = G12.E.out) => el && A(el, [{opacity: 0}, {opacity: 1}], t, d, {e}),
  hide: (el, t, d = .35, to = 0) => el && A(el, [{opacity: 1}, {opacity: to}], t, d, {e: G12.E.inout}),
  /* from an offset (and turn, scale) to its place */
  enter(el, t, d, {x = 0, y = 0, r = 0, s = 1, e = G12.E.out, fade = true} = {}) {
    A(el, [{transform: `translate(${x}px,${y}px) rotate(${r}deg) scale(${s})`, ...(fade ? {opacity: 0} : {})}, {transform: 'none', ...(fade ? {opacity: 1} : {})}], t, d, {e});
  },
  /* a clip that opens over the part's box: dir r (left → right), l, u (bottom → top), d (top → down); open at the end */
  wipe(el, b, dir, t, d, e = G12.E.inout) {
    const m = 6, x0 = b.x - m, x1 = b.x + b.w + m, y0 = b.y - m, y1 = b.y + b.h + m, W = 600, H = 340;
    const at = f => dir === 'r' ? `inset(0px ${W - (x0 + (x1 - x0) * f)}px 0px 0px)` : dir === 'l' ? `inset(0px 0px 0px ${x1 - (x1 - x0) * f}px)`
      : dir === 'u' ? `inset(${y1 - (y1 - y0) * f}px 0px 0px 0px)` : `inset(0px 0px ${H - (y0 + (y1 - y0) * f)}px 0px)`;
    A(el, [{clipPath: at(0), easing: e}, {clipPath: at(1), offset: .999}, {clipPath: 'inset(-200px -200px -200px -200px)'}], t, d, {});
  },
  /* the same, in steps (the stair): fractions fs reached at times ts */
  wipeSteps(el, b, ts, fs, d) {
    const m = 6, x0 = b.x - m, x1 = b.x + b.w + m, at = f => `inset(0px ${600 - (x0 + (x1 - x0) * f)}px 0px 0px)`;
    const pts = [[ts[0], at(0), G12.E.inout]];
    ts.forEach((t, i) => { pts.push([t + d, at(fs[i]), 'linear']); if (ts[i + 1] != null) pts.push([ts[i + 1], at(fs[i]), G12.E.inout]); });
    pts.push([pts[pts.length - 1][0] + .01, 'inset(-200px -200px -200px -200px)']);
    GM.seq(el, 'clipPath', pts);
  },
  /* a circle that opens from (cx, cy) to radius r */
  radial(el, cx, cy, r, t, d, e = G12.E.out) {
    A(el, [{clipPath: `circle(0px at ${cx}px ${cy}px)`, easing: e}, {clipPath: `circle(${r}px at ${cx}px ${cy}px)`, offset: .999}, {clipPath: 'circle(2000px at 300px 170px)'}], t, d, {});
  },
  /* the accent comes on: fade, or a wipe / circle */
  acc(P, t, how = 'fade', d = .4) {
    P._acc = true;
    for (const el of P.accs) {
      if (how === 'fade') GM.show(el, t, d);
      else if (how === 'radial') { const b = P.ab ?? P.bb; GM.show(el, t, .12); GM.radial(el, b.cx, b.cy, Math.hypot(b.w, b.h) / 2 + 8, t, d); }
      else { GM.show(el, t, .12); GM.wipe(el, P.ab ?? P.bb, how, t, d); }
    }
  },
  /* a stamp: from bigger to its place, quickly, no overshoot */
  stamp(el, t, d = .32, s = 1.45, r = 0) { A(el, [{opacity: 0, transform: `scale(${s}) rotate(${r}deg)`}, {opacity: 1, transform: 'none'}], t, d, {e: G12.E.out}); },
  /* a beat on something already there */
  pulse(el, t, d = .45, s = 1.08) { A(el, [{transform: 'none'}, {transform: `scale(${s})`, offset: .35}, {transform: 'none'}], t, d, {e: 'ease-in-out', f: 'none'}); },
  /* the jolt on an impact */
  jolt(el, t, a = 5) { A(el, [{transform: 'none'}, {transform: `translateY(${a}px)`, offset: .22}, {transform: `translateY(${-a * .4}px)`, offset: .55}, {transform: `translateY(${a * .2}px)`, offset: .8}, {transform: 'none'}], t, .32, {e: 'ease-out', f: 'none'}); },
  shake(el, t, a = 5, d = .36) { A(el, [{transform: 'none'}, {transform: `translateX(${a}px)`, offset: .2}, {transform: `translateX(${-a * .7}px)`, offset: .45}, {transform: `translateX(${a * .35}px)`, offset: .7}, {transform: 'none'}], t, d, {e: 'ease-out', f: 'none'}); },
  /* a slow breath while it waits (up and down, or a sway) from t0 to t1 */
  hover(el, t0, t1, a = 4, per = 1.8, kind = 'y') {
    const n = Math.floor((t1 - t0) / per); if (n < 1) return;
    const v = kind === 'y' ? `translateY(${-a}px)` : `rotate(${a}deg)`, v2 = kind === 'y' ? 'none' : `rotate(${-a}deg)`;
    A(el, [{transform: 'none'}, {transform: v, offset: .25}, {transform: v2, offset: .75}, {transform: 'none'}].filter((f, i) => kind !== 'y' || i !== 2), t0, per, {e: 'ease-in-out', it: n, f: 'none'});
  },
};
/* where the words go, by category: one plate under the picture, or two under its halves (wrong / right, cause / effect) */
const G12W = {
  B04: s => [[(s.items ?? [])[s.mark?.at ?? 2], true]], B06: s => s.options?.length >= 2 ? [[s.options[0], false], [s.options[1], false]] : [[s.answer ?? s.about, !!s.answer]],
  B05: s => [[s.wrong, false], [s.right, true]], B07: s => [[s.thing, true]], B08: s => [[s.goal, true]], B09: s => [[(s.points ?? [])[s.at ?? 2] ?? s.result, true]],
  B12: s => [[(s.items ?? [])[0], false], [s.end ?? (s.items ?? [])[2], true]], B13: s => [[s.secret, true]], B14: s => [[s.idea, true]], B16: s => [[s.term, true]],
};
/* one draft: the picture above its plates; motion(c) gets {K, s, T, g, P (parts), pic, a (start), h (key word), at(f) (a → h),
   post (time scale after the key word), plates}; it returns the plates' entrance times (default: the last on the key word) */
G12.scene = (cat, id, name, motion) => R3.both(cat, 'g' + id, name, (K, s, T, g) => {
  const W = G12W[cat](s).filter(v => v[0]);
  const pic = G12.pic(g, id, 30, 6, 540, W.length ? 248 : 328);
  const a = T.b[0], h = Math.max(T.hit, a + .3), sp = h - a;
  const c = {K, s, T, g, P: pic.P, pic, a, h, sp, at: f => a + sp * f, post: Math.min(1, Math.max(.4, ((T.t1 ?? h + 2) - h) / 1.6)), n: W.length};
  const pt = motion(c) ?? {};
  for (const [n, q] of Object.entries(c.P)) if (q.accs.length && !q._acc && !(pt.accNow ?? []).includes(n)) GM.acc(q, h + .05, 'fade', .35);   // the accent comes on with the key word
  W.forEach(([it, on], i) => {
    const t = (pt.plates ?? [])[i] ?? (W.length === 2 && cat === 'B06' ? h + .1 + i * .12 : W.length === 2 && i === 0 ? c.at(.7) : h + .15);   // two options of a question: together
    if (W.length === 1) G12.plate(K, g, it, 300, 270, on, 360, t); else G12.plate(K, g, it, i ? 450 : 150, 270, on, 250, t);
  });
});

/* ================= B04 ขั้นตอน ================= */
/* the steps go up one by one (each a quarter of the stair, with its number); on the key word the accent climbs them */
G12.scene('B04', 'stair', 'บันไดเลขขั้น ขึ้นทีละขั้น สีไล่ขึ้นตรงคำสำคัญ', c => {
  const S = c.P.rest, ts = [c.at(0), c.at(.27), c.at(.54), c.at(.8)];
  GM.show(S.o, ts[0], .2);
  GM.wipeSteps(S.c, S.bb, ts, [.27, .515, .76, 1], Math.min(.32, c.sp * .2));
  GM.acc(S, c.h - .05, 'r', .55);
});
/* the start pin lands, the road unrolls to the end, the pin on the way drops in as the road reaches it, and on the key word
   the finish flag rises on its pole */
G12.scene('B04', 'roadmap', 'ถนนคดคลี่ไปถึงธง ธงปลายทางชูขึ้นตรงคำสำคัญ', c => {
  const {rest: R, start: S, pin: M, goal: G} = c.P;
  GM.enter(S.o, c.at(0), .45, {y: -26});
  const t0 = c.at(.12), t1 = c.at(.88), b = R.bb;
  GM.show(R.o, t0, .1); GM.wipe(R.c, b, 'r', t0, t1 - t0, G12.E.lin);
  GM.enter(M.o, t0 + (t1 - t0) * Math.max(0, (M.pv.x - b.x) / b.w) - .05, .4, {y: -22});
  G.m.style.transformOrigin = `${G.bb.x}px ${G.bb.y + G.bb.h}px`;
  GM.show(G.o, c.h - .12, .12);
  A(G.m, [{transform: 'scaleY(0)'}, {transform: 'none'}], c.h - .12, .5, {e: G12.E.out});
  GM.acc(G, c.h + .1, 'fade', .3);
});

/* ================= B05 ถูกกับผิด ================= */
/* the winding way draws itself, three crosses land on it, then the straight arrow shoots across on the key word and gets its ✓ */
G12.scene('B05', 'path', 'ทางวกวนโดนกากบาท ทางตรงพุ่งไปตรงคำสำคัญ', c => {
  const {rest: R, x1, x2, x3, arrow: AR, check: CK} = c.P;
  GM.show(R.o, c.at(0), .1); GM.wipe(R.c, R.bb, 'r', c.at(0), c.sp * .45);
  [x2, x1, x3].forEach((x, i) => GM.stamp(x.o, c.at(.45 + i * .12)));
  GM.enter(AR.m, c.h - .08, .4, {x: -30, fade: false}); GM.show(AR.o, c.h - .08, .1); GM.wipe(AR.c, AR.bb, 'r', c.h - .08, .4, G12.E.out);
  GM.show(CK.o, c.h + .26, .1); GM.wipe(CK.c, CK.bb, 'r', c.h + .26, .3, G12.E.out);
  return {plates: [c.at(.78), c.h + .3], accNow: ['arrow']};
});
/* stray arrows fly in and miss (a cross lands), the target turns up, and on the key word one arrow flies into the bullseye: the
   target takes the hit, the arrow quivers, the rings light from the middle out, ✓ */
G12.scene('B05', 'target', 'ลูกศรพลาดเป้า แล้วดอกเดียวปักกลางเป้าตรงคำสำคัญ', c => {
  const P = c.P, arr = Object.keys(P).filter(n => /^arr\d$/.test(n)).map(n => P[n]), R = P.rest, AR = P.arrow;
  arr.forEach((q, i) => GM.enter(q.o, c.at(i * .13), .42, {x: -70, y: (q.pv.y - 150) * .15}));
  GM.stamp(P.x.o, c.at(.58));
  GM.enter(R.m, c.at(.5), .5, {s: .86});
  /* the arrow comes in along its own line, faster and faster (its tip at the pivot) */
  const fx = AR.bb.x + AR.bb.w * .8 - AR.pv.x, fy = AR.bb.y + AR.bb.h * .2 - AR.pv.y, L = Math.hypot(fx, fy), ux = fx / L, uy = fy / L;
  GM.show(AR.o, c.h - .3, .08);
  A(AR.o, [{transform: `translate(${ux * 150}px,${uy * 150}px)`}, {transform: 'none'}], c.h - .3, .3, {e: G12.E.fall});
  A(AR.m, [{transform: 'none'}, {transform: 'rotate(3deg)', offset: .18}, {transform: 'rotate(-2.2deg)', offset: .4}, {transform: 'rotate(1.2deg)', offset: .62}, {transform: 'rotate(-.5deg)', offset: .82}, {transform: 'none'}], c.h, .5, {e: 'linear', f: 'none'});
  GM.pulse(R.m, c.h, .35, 1.035);
  GM.acc(R, c.h + .02, 'radial', .5);
  GM.show(P.check.o, c.h + .3, .1); GM.wipe(P.check.c, P.check.bb, 'r', c.h + .3, .3, G12.E.out);
  return {plates: [c.at(.72), c.h + .3]};
});

/* ================= B06 คำถาม ================= */
/* the answer sheet slides up, the four answers are written in one by one, the question marks come up beside it and keep rocking:
   which one? */
G12.scene('B06', 'choice', 'กระดาษตัวเลือก ตัวเลือกขึ้นทีละข้อ เครื่องหมายคำถามโยก', c => {
  const P = c.P;
  GM.enter(P.rest.o, c.at(0), .55, {y: 26, r: -2});
  ['rowA', 'rowB', 'rowC', 'rowD'].forEach((n, i) => { GM.show(P[n].o, c.at(.22 + i * .14), .05); GM.wipe(P[n].c, P[n].bb, 'r', c.at(.22 + i * .14), .32); });
  [[P.q1, .5, -1], [P.q2, .66, 1]].forEach(([q, f, d]) => { GM.enter(q.o, c.at(f), .45, {s: .6, r: d * -14}); GM.hover(q.m, c.at(f) + .45, c.T.t1 ?? c.h + 2, 7 * d, 1.6, 'r'); });
  return c.n === 2 ? {plates: [c.h + .1, c.h + .22]} : null;
});
/* the question mark comes first, then the maze grows out round it; on the key word the question mark beats */
G12.scene('B06', 'maze', 'เขาวงกตก่อตัวรอบเครื่องหมายคำถาม', c => {
  const {rest: R, q: Q} = c.P, b = R.bb, cx = Q.bb.cx, cy = Q.bb.cy;
  GM.enter(Q.m, c.at(0), .45, {s: .6});
  const t0 = c.at(.15), t1 = c.at(.95), r0 = `inset(${cy - 4}px ${600 - cx - 4}px ${340 - cy - 4}px ${cx - 4}px)`;
  GM.show(R.o, t0, .1);
  A(R.c, [{clipPath: r0, easing: G12.E.inout}, {clipPath: `inset(${b.y - 6}px ${600 - b.x - b.w - 6}px ${340 - b.y - b.h - 6}px ${b.x - 6}px)`, offset: .999}, {clipPath: 'inset(-200px -200px -200px -200px)'}], t0, t1 - t0, {});
  GM.pulse(Q.m, c.h, .5, 1.22);
});
/* the board fills in, the question mark sits in the gap, a piece lifts out of its slot and floats; on the key word it lights */
G12.scene('B06', 'puzzle', 'จิ๊กซอว์ชิ้นหนึ่งยกขึ้นลอย ช่องกลางมีคำถาม', c => {
  const {rest: R, piece: PC, q: Q} = c.P;
  GM.enter(R.o, c.at(0), .5, {y: 20});
  GM.enter(Q.m, c.at(.3), .4, {s: .7});
  GM.show(PC.o, c.at(.4), .1);
  GM.seq(PC.o, 'transform', [[c.at(.4), 'translate(-12px,20px) rotate(-9deg)', G12.E.inout], [c.at(.85), 'none']]);
  GM.hover(PC.m, c.at(.85), c.T.t1 ?? c.h + 2, 4, 1.8);
  GM.acc(PC, c.h, 'fade', .35); GM.pulse(Q.m, c.h, .45, 1.12);
});
/* the scales stand, the beam tips one way and the other (the pans follow, hanging), and settles level on the key word */
G12.scene('B06', 'scales', 'ตาชั่งเอียงไปมา แล้วนิ่งกลางตรงคำสำคัญ', c => {
  const {rest: R, beam: B, panL: L, panR: Rp} = c.P;
  for (const q of [R, B, L, Rp]) GM.enter(q.o, c.at(0), .5, {y: 22});
  const ks = [[c.at(.18), 0], [c.at(.36), -11], [c.at(.56), 8], [c.at(.74), -5], [c.at(.88), 2.5], [c.h, 0]];
  GM.seq(B.m, 'transform', ks.map(([t, d]) => [t, `rotate(${d}deg)`, G12.E.inout]));
  for (const q of [L, Rp]) {
    const dx = q.pv.x - B.pv.x;
    GM.seq(q.m, 'transform', ks.map(([t, d]) => { const r = d * Math.PI / 180; return [t, `translate(${(dx * (Math.cos(r) - 1)).toFixed(1)}px,${(dx * Math.sin(r)).toFixed(1)}px)`, G12.E.inout]; }));
  }
  GM.acc(L, c.h, 'fade', .35); GM.acc(Rp, c.h + .05, 'fade', .35);
});
/* the strands are drawn from left to right into a knot; on the key word the knot with the question lights up from its middle */
G12.scene('B06', 'tangle', 'เส้นพันกันยุ่ง ปมกลางมีคำถามสว่างตรงคำสำคัญ', c => {
  const R = c.P.rest;
  GM.show(R.o, c.at(0), .1); GM.wipe(R.c, R.bb, 'r', c.at(0), c.sp * .85);
  GM.acc(R, c.h, 'radial', .5);
  GM.pulse(R.m, c.h, .5, 1.02);
});
/* the compass comes up, the arrows swing round it, the needle searches one way and the other and comes to rest on the key word */
G12.scene('B06', 'compass', 'เข็มทิศส่ายหาทาง แล้วนิ่งตรงคำสำคัญ', c => {
  const {rest: R, needle: N, arc1, arc2} = c.P;
  GM.enter(R.m, c.at(0), .55, {s: .82});
  GM.enter(N.m, c.at(0), .55, {s: .82});
  for (const [q, f] of [[arc1, .22], [arc2, .3]]) { q.o.style.transformOrigin = `${N.pv.x}px ${N.pv.y}px`; GM.enter(q.o, c.at(f), .7, {r: -70}); }
  GM.seq(N.c, 'transform', [[c.at(.25), 'none', G12.E.inout], [c.at(.45), 'rotate(-58deg)', G12.E.inout], [c.at(.63), 'rotate(44deg)', G12.E.inout], [c.at(.8), 'rotate(-22deg)', G12.E.inout], [c.at(.92), 'rotate(9deg)', G12.E.inout], [c.h, 'none']]);
  N.c.style.transformOrigin = `${N.pv.x}px ${N.pv.y}px`;
  GM.acc(R, c.h, 'radial', .45); GM.acc(N, c.h, 'radial', .45);
});

/* ================= B07 คำเตือน ================= */
/* the sign comes up, STOP is written across it, and on the key word it fills and shakes once */
G12.scene('B07', 'stop', 'ป้ายหยุดขึ้นมา คำว่า STOP เขียนเข้า ติดสีตรงคำสำคัญ', c => {
  const {rest: R, word: Wd} = c.P;
  GM.enter(R.o, c.at(0), .55, {y: 30, r: -5}); GM.enter(Wd.o, c.at(0), .55, {y: 30, r: -5, fade: false});
  GM.show(Wd.c, c.at(.4), .05); GM.wipe(Wd.c, Wd.bb, 'r', c.at(.4), c.sp * .45);
  GM.acc(R, c.h, 'radial', .4); GM.acc(Wd, c.h, 'fade', .2);
  GM.shake(R.m, c.h + .05, 6); GM.shake(Wd.m, c.h + .05, 6);
});
/* the edges of the pit are drawn, the arrow hangs above, lifts a little, and drops into the pit on the key word */
G12.scene('B07', 'pit', 'ลูกศรร่วงลงหลุมพรางตรงคำสำคัญ', c => {
  const {rest: R, arrow: AR} = c.P;
  GM.show(R.o, c.at(0), .1); GM.wipe(R.c, R.bb, 'r', c.at(0), c.sp * .5);
  GM.show(AR.o, c.at(.45), .3);
  GM.seq(AR.m, 'transform', [[c.at(.45), 'translateY(-90px)', G12.E.out], [c.at(.75), 'translateY(-80px)', G12.E.inout], [c.h - .32, 'translateY(-96px)', G12.E.fall], [c.h, 'none']]);
  GM.jolt(R.o, c.h, 5);
  GM.acc(AR, c.h, 'fade', .3);
});

/* ================= B08 เป้าหมาย ================= */
/* the star turns into place, and on the key word it lights from the middle and its rays shine out */
G12.scene('B08', 'star', 'ดาวหมุนเข้าที่ สว่างพร้อมแสงกระจายตรงคำสำคัญ', c => {
  const {rest: Rays, star: St} = c.P;
  GM.enter(St.m, c.at(0), c.sp * .7, {r: -72, s: .4});
  GM.acc(St, c.h, 'radial', .5);
  Rays.m.style.transformOrigin = `${St.pv.x}px ${St.pv.y}px`;
  GM.enter(Rays.m, c.h + .05, .45, {s: .55});
  A(Rays.c, [{opacity: 1}, {opacity: .45}, {opacity: 1}], c.h + .6, 1.2, {e: 'ease-in-out', it: 3, f: 'none'});
});
/* the wall goes up row by row, trembles, and on the key word bursts open: the halves part and the bricks fly out */
G12.scene('B08', 'breakwall', 'กำแพงก่อขึ้น สั่น แล้วแตกทะลุตรงคำสำคัญ', c => {
  const P = c.P, L = P.wallL, R = P.wallR, deb = Object.keys(P).filter(n => /^deb\d+$/.test(n)).map(n => P[n]);
  const gap = R.bb.x - (L.bb.x + L.bb.w), cx = (L.bb.x + L.bb.w + R.bb.x) / 2, cy = (L.bb.y + L.bb.y + L.bb.h) / 2 + L.bb.h * .1;
  for (const [q, s] of [[L, 1], [R, -1]]) {
    GM.show(q.o, c.at(0), .1); GM.wipe(q.c, q.bb, 'u', c.at(0), c.sp * .6);
    GM.seq(q.o, 'transform', [[c.at(0), `translateX(${s * gap / 2}px)`], [c.h, `translateX(${s * gap / 2}px)`, G12.E.out], [c.h + .45, 'none']]);
    A(q.m, [{transform: 'none'}, {transform: 'translateX(1.5px)'}, {transform: 'translateX(-1.5px)'}, {transform: 'none'}], c.at(.72), .12, {it: Math.max(1, Math.floor(c.sp * .28 / .12)), f: 'none'});
  }
  if (P.rest) GM.show(P.rest.o, c.h, .1);
  deb.forEach((q, i) => {
    GM.show(q.o, c.h, .08);
    A(q.o, [{transform: `translate(${cx - q.pv.x}px,${cy - q.pv.y}px) rotate(${i % 2 ? 90 : -90}deg) scale(.4)`}, {transform: 'none'}], c.h, .5 + i * .03, {e: G12.E.out});
  });
});
/* two pieces slide together, the last one floats above and glides down into its place on the key word */
G12.scene('B08', 'jigsaw', 'จิ๊กซอว์ชิ้นสุดท้ายลงล็อกตรงคำสำคัญ', c => {
  const {pA, pB, pC} = c.P;
  GM.enter(pB.o, c.at(0), .55, {x: -40});
  GM.enter(pC.o, c.at(.2), .55, {y: 34});
  GM.show(pA.o, c.at(.42), .35);
  GM.seq(pA.m, 'transform', [[c.at(.42), 'translate(26px,-58px) rotate(10deg)', G12.E.inout], [c.at(.78), 'translate(22px,-50px) rotate(8deg)', G12.E.inout], [c.h, 'none']]);
  GM.acc(pA, c.h, 'fade', .3); GM.pulse(pA.c, c.h + .02, .4, 1.04);
});

/* ================= B09 เวลา ================= */
/* the three tiles come up, 3 and 2 light in turn and dim, and 1 lights for good on the key word */
G12.scene('B09', 'countdown', 'นับถอยหลัง 3 2 1 ช่อง 1 ติดสีตรงคำสำคัญ', c => {
  const {t3, t2, t1} = c.P;
  [t3, t2, t1].forEach((q, i) => GM.enter(q.o, c.at(i * .1), .5, {y: 24}));
  for (const [q, f] of [[t3, .45], [t2, .72]]) { GM.pulse(q.m, c.at(f), .4, 1.1); A(q.c, [{opacity: 1}, {opacity: .4}], c.at(f) + .35, .3, {e: G12.E.inout}); }
  A(t1.c, [{opacity: .55}, {opacity: 1}], c.at(.6), .3, {});
  GM.acc(t1, c.h, 'fade', .25); GM.pulse(t1.m, c.h, .45, 1.12);
});

/* ================= B12 เหตุกับผล ================= */
/* the match comes in, the arrow is drawn, the logs are laid, and on the key word the fire flares up from them and keeps burning */
G12.scene('B12', 'match', 'ไม้ขีดจุด แล้วกองไฟลุกขึ้นตรงคำสำคัญ', c => {
  const {rest: Lg, match: Mt, arrow: AR, flames: F} = c.P;
  GM.enter(Mt.o, c.at(0), .55, {x: -30, y: 24, r: -12});
  GM.show(AR.o, c.at(.42), .05); GM.wipe(AR.c, AR.bb, 'r', c.at(.42), .4);
  GM.enter(Lg.o, c.at(.6), .45, {y: 14});
  F.m.style.transformOrigin = `${F.bb.cx}px ${F.bb.y + F.bb.h}px`;
  GM.show(F.o, c.h - .1, .1);
  A(F.m, [{transform: 'scale(.4,0)'}, {transform: 'none'}], c.h - .1, .5, {e: G12.E.out});
  GM.acc(F, c.h, 'fade', .3);
  A(F.c, [{transform: 'none'}, {transform: 'scale(1.03,1.06)', offset: .4}, {transform: 'scale(.99,.97)', offset: .7}, {transform: 'none'}], c.h + .45, .55, {e: 'ease-in-out', it: 6, f: 'none'});
  F.c.style.transformOrigin = F.m.style.transformOrigin;
  return {plates: [c.at(.45), c.h + .2]};
});

/* ================= B13 เคล็ดลับ ================= */
/* the keyhole opens up, we lean in slowly, and on the key word the light pours through it */
G12.scene('B13', 'keyhole', 'รูกุญแจ ซูมเข้า แสงลอดออกมาตรงคำสำคัญ', c => {
  const R = c.P.rest;
  GM.enter(R.m, c.at(0), .6, {s: .7});
  A(R.o, [{transform: 'none'}, {transform: 'scale(1.07)'}], c.at(.4), c.h - c.at(.4), {e: G12.E.inout});
  GM.acc(R, c.h, 'd', .55);
});
/* the waterline is drawn, the tip comes up out of the water, and on the key word what lies under the water is shown */
G12.scene('B13', 'iceberg', 'ภูเขาน้ำแข็งโผล่ แล้วเห็นส่วนใต้น้ำตรงคำสำคัญ', c => {
  const {rest: U, water: Wt, tip: Tp} = c.P;
  GM.show(Wt.o, c.at(0), .1); GM.wipe(Wt.c, Wt.bb, 'r', c.at(0), c.sp * .35);
  Tp.o.style.clipPath = `inset(-200px -200px ${340 - Wt.bb.cy}px -200px)`;           // under the water it is not seen
  GM.enter(Tp.m, c.at(.3), c.sp * .45, {y: Tp.bb.h * .9, fade: false});
  GM.show(Tp.o, c.at(.3), .1);
  GM.show(U.o, c.h - .05, .1); GM.wipe(U.c, U.bb, 'd', c.h - .05, .6, G12.E.out);
});
/* the map unfolds, the start pin lands, the dotted route runs to the X, and on the key word the X is stamped and the big pin
   drops onto the map */
G12.scene('B13', 'map', 'แผนที่คลี่ออก เส้นทางวิ่งไปถึง X หมุดปักตรงคำสำคัญ', c => {
  const {rest: R, pin: Pn, x: X, start: St, route: Rt} = c.P;
  R.m.style.transformOrigin = `${R.bb.x}px ${R.bb.cy}px`;
  GM.show(R.o, c.at(0), .2); A(R.m, [{transform: 'scaleX(.12)'}, {transform: 'none'}], c.at(0), c.sp * .35, {e: G12.E.out});
  GM.enter(St.o, c.at(.32), .4, {y: -18});
  GM.show(Rt.o, c.at(.4), .05); GM.wipe(Rt.c, Rt.bb, 'r', c.at(.4), c.sp * .5, G12.E.lin);
  GM.stamp(X.o, c.h - .05); GM.acc(X, c.h - .05, 'fade', .2);
  GM.show(Pn.o, c.at(.88), .2);
  A(Pn.o, [{transform: `translateY(${-Math.min(40, Pn.bb.y - 4)}px)`}, {transform: 'none'}], c.at(.88), c.h + .12 - c.at(.88), {e: G12.E.fall});   // stays inside the card
  GM.jolt(R.o, c.h + .12, 3);
  GM.acc(Pn, c.h + .12, 'fade', .25);
});
/* both long ways are drawn, and on the key word the straight arrow shoots across between them */
G12.scene('B13', 'shortcut', 'ทางอ้อมสองทาง แล้วลูกศรตรงพุ่งผ่านตรงคำสำคัญ', c => {
  const {left: L, arrow: AR, right: R} = c.P;
  GM.show(L.o, c.at(0), .05); GM.wipe(L.c, L.bb, 'r', c.at(0), c.sp * .45);
  GM.show(R.o, c.at(.35), .05); GM.wipe(R.c, R.bb, 'r', c.at(.35), c.sp * .45);
  GM.show(AR.o, c.h - .05, .05); GM.wipe(AR.c, AR.bb, 'r', c.h - .05, .35, G12.E.out);
  GM.enter(AR.m, c.h - .05, .4, {x: -28, fade: false});
  return {accNow: ['arrow']};
});
/* the notebook comes up, its lines are written one by one, and on the key word the star is stamped on the page */
G12.scene('B13', 'cheat', 'สมุดโพย เขียนทีละบรรทัด ดาวประทับตรงคำสำคัญ', c => {
  const P = c.P, lines = Object.keys(P).filter(n => /^ln\d$/.test(n)).map(n => P[n]);
  GM.enter(P.rest.o, c.at(0), .55, {y: 26});
  lines.forEach((q, i) => { GM.show(q.o, c.at(.25 + i * .13), .05); GM.wipe(q.c, q.bb, 'r', c.at(.25 + i * .13), .3); });
  GM.stamp(P.star.o, c.h, .34, 1.6, -25); GM.acc(P.star, c.h, 'fade', .2);
});
/* the rough rocks, then the rocks over there, and on the key word the diamond rises between them and sparkles */
G12.scene('B13', 'nugget', 'ก้อนหิน แล้วเพชรผุดขึ้นกลางหินตรงคำสำคัญ', c => {
  const {rocksL: L, diamond: D, rocksR: R, rest: Rays} = c.P;
  GM.enter(L.o, c.at(0), .55, {x: -30});
  GM.enter(R.o, c.at(.35), .5, {y: 18});
  D.m.style.transformOrigin = `${D.bb.cx}px ${D.bb.y + D.bb.h}px`;
  GM.enter(D.m, c.h - .22, .5, {y: 24, s: .3});
  GM.acc(D, c.h, 'fade', .3);
  Rays.m.style.transformOrigin = `${D.bb.cx}px ${D.bb.cy}px`;
  GM.enter(Rays.m, c.h + .1, .45, {s: .5});
  A(Rays.c, [{opacity: 1}, {opacity: .4}, {opacity: 1}], c.h + .6, 1.1, {e: 'ease-in-out', it: 3, f: 'none'});
});

/* ================= B14 ประโยคเด็ด ================= */
/* one glove comes in from the left; the other flies in faster and faster from the right and lands its punch on the key word */
G12.scene('B14', 'knockout', 'นวมสองข้างพุ่งเข้าหากัน ชกโดนตรงคำสำคัญ', c => {
  const {gloveL: GL, gloveR: GR, speedL: SL, speedR: SR} = c.P;
  GM.enter(GL.o, c.at(0), c.sp * .45, {x: -150});
  GM.show(SL.o, c.at(.15), .05); GM.wipe(SL.c, SL.bb, 'l', c.at(.15), c.sp * .4, G12.E.out);
  GM.show(GR.o, c.at(.45), .15);
  A(GR.o, [{transform: 'translateX(170px)'}, {transform: 'none'}], c.at(.45), c.h - c.at(.45), {e: G12.E.fall});
  GM.show(SR.o, c.h - .2, .05); GM.wipe(SR.c, SR.bb, 'r', c.h - .2, .35, G12.E.out);
  A(GL.m, [{transform: 'none'}, {transform: 'translateX(-14px) rotate(-4deg)', offset: .3}, {transform: 'none'}], c.h, .5, {e: G12.E.out, f: 'none'});
  GM.jolt(GR.m, c.h, 4);
  GM.acc(GR, c.h, 'fade', .25);
});
/* the mic glides down and hovers, lifts a little, and falls head first onto the floor on the key word: impact lines, one jolt,
   the handle swings down and it rocks to rest; the head lights (the trial of 2026-11-12, sketches/glow1.js, with the floor
   raised over the plate) */
R3.both('B14', 'gmicdrop', 'ทิ้งไมค์ ไมค์ร่วงกระแทกพื้นตรงคำสำคัญ (ลายเส้นแผ่นไอเดีย)', (K, s, T, g) => {
  const W = G12W.B14(s).filter(v => v[0]), k = 1.18, HX = 164, HY = 42, AX = 44.4, E = G12.E;
  const floor = W.length ? 236 : 300, rest = [410, floor - 33 * k], a = T.b[0], h = Math.max(T.hit, a + .3);
  const shake = R6.group(g);
  const fl = R8.svg(shake, `<path d="M70 ${floor}H530" style="fill:none;stroke:var(--lp-soft);stroke-width:3px;stroke-linecap:round"/>`);
  A(fl.querySelector('path'), [{strokeDasharray: '460 460', strokeDashoffset: 460}, {strokeDasharray: '460 460', strokeDashoffset: 0}], a, .7, {e: E.inout});
  const sh = R8.svg(shake, `<ellipse cx="${rest[0] - 100}" cy="${floor + 3}" rx="145" ry="6" style="fill:var(--lp-ink);opacity:.14"/>`); sh.style.transformOrigin = `${rest[0]}px ${floor}px`;
  A(sh, [{opacity: 0, transform: 'scaleX(.3)'}, {opacity: 1, transform: 'none'}], h, .55, {e: E.out});
  const imp = d => R8.svg(shake, `<g transform="translate(${rest[0] - 132 * k} ${rest[1] - 88 * k}) scale(${k})"><path d="${d}" style="fill:var(--lp-ink);stroke:none"/></g>`);
  const sk = imp(G12MIC.streak), ar = imp(G12MIC.arcs);
  A(sk, [{opacity: 0, clipPath: 'inset(0 0 0 70%)'}, {opacity: 1, clipPath: 'inset(0 0 0 0)', offset: .3}, {opacity: 1, offset: .55}, {opacity: 0, clipPath: 'inset(0 0 0 0)'}], h, .8, {e: E.out});
  ar.style.transformOrigin = `${rest[0]}px ${rest[1]}px`;
  A(ar, [{opacity: 0, transform: 'scale(.65)'}, {opacity: 1, transform: 'scale(1.08)', offset: .4}, {opacity: .9, transform: 'none'}], h + .02, .6, {e: E.out});
  const pos = R6.group(shake); pos.style.transformOrigin = '0 0';
  const hov = div('left:0;top:0;width:0;height:0', pos), turn = div('left:0;top:0;width:0;height:0', hov);
  const m = G12MIC.mic;
  R8.svg(turn, `<g transform="scale(${k}) rotate(${AX}) translate(${-HX} ${-HY})"><path d="${m.body}" style="fill:var(--lp-fill);stroke:none"/>` +
    `<circle class="lp-acc mic-head" cx="${HX}" cy="${HY}" r="31" style="fill:var(--lp-acc);opacity:0"/>` +
    `<path d="${m.lines}" style="fill:var(--lp-ink);stroke:none;fill-rule:evenodd"/></g>`).style.cssText += ';left:0;top:0;width:0;height:0;overflow:visible';
  A(turn.querySelector('.mic-head'), [{opacity: 0}, {opacity: 1}], h + .05, .3, {e: E.out});
  const P = (x, y) => `translate(${x}px,${y}px)`, R = d => `rotate(${d}deg)`;
  const tIn = a + .15, tHold = Math.min(tIn + .9, h - .5), tLift = Math.max(tHold + .05, h - .62), tDrop = Math.max(tLift + .02, h - .36), hy = Math.max(48, floor - 240);
  A(pos, [{opacity: 0}, {opacity: 1}], tIn, .3, {e: E.out});
  GM.seq(pos, 'transform', [[tIn, P(404, hy - 230), E.out], [tHold, P(400, hy)], [tLift, P(400, hy), E.inout], [tDrop, P(395, hy - 16), E.fall], [h, P(rest[0], rest[1])]]);
  GM.seq(turn, 'transform', [[tIn, R(-62), E.out], [tHold, R(-44)], [tLift, R(-44), E.inout], [tDrop, R(-51), 'cubic-bezier(.62,0,1,.38)'], [h, R(27), 'cubic-bezier(.5,0,.9,.5)'],
    [h + .34, R(-6), 'cubic-bezier(.3,0,.2,1)'], [h + .5, R(-8.5), 'ease-in-out'], [h + .66, R(-6)]]);
  A(hov, [{transform: 'none'}, {transform: 'translateY(-6px) rotate(-1.2deg)'}, {transform: 'none'}], tHold, Math.max(.3, tLift - tHold), {e: 'ease-in-out', f: 'none'});
  A(shake, [{transform: 'none'}, {transform: 'translateY(5px)', offset: .22}, {transform: 'translateY(-2px)', offset: .55}, {transform: 'translateY(1px)', offset: .8}, {transform: 'none'}], h, .32, {e: 'ease-out', f: 'none'});
  if (W.length) G12.plate(K, g, W[0][0], 300, 270, W[0][1], 360, h + .16);
});

/* ================= B16 นิยาม ================= */
/* the block appears, its parts come out of it along the dotted arrows, and on the key word the block lights: this is what it is
   made of */
G12.scene('B16', 'anatomy', 'ของแยกชิ้นส่วนออกมาให้เห็นข้างใน', c => {
  const P = c.P, cube = P.cube, ps = ['pTL', 'pTR', 'pBR', 'pBL'].map(n => P[n]);
  GM.enter(cube.m, c.at(0), .5, {s: .8});
  ps.forEach((q, i) => {
    const dx = cube.pv.x - q.pv.x, dy = cube.pv.y - q.pv.y, t = c.at(.3 + i * .05);
    GM.show(q.o, t, .2);
    A(q.o, [{transform: `translate(${dx * .75}px,${dy * .75}px) scale(.6)`}, {transform: 'none'}], t, c.sp * .45, {e: G12.E.out});
  });
  GM.show(P.rest.o, c.at(.42), .1); GM.radial(P.rest.c, cube.pv.x, cube.pv.y, 260, c.at(.42), c.sp * .5, G12.E.inout);
  GM.acc(cube, c.h, 'fade', .3); GM.pulse(cube.m, c.h, .45, 1.06);
});
