/* =====================================================================
   CutPack · uni · LEGO round 4: B14 ประโยคเด็ด with pictures (Friend 2026-11-08: "ทำ B14 แบบมี motion graphics ในเลโก้เลยครับ").
   B14 was words only; now it has three variants like the other categories, each with its full-screen and its small form
   (R3.both: drawn once on the 600 × 340 small canvas, the full-screen form is the same picture scaled 1.6×).
   Slot (the AI writes only this; every thing in the picture comes from it, so any punchline works):
     B14 ประโยคเด็ด    idea {icon, label?}  — the heart of the line (the thing to remember), label = 1–2 words of it
   The sentence itself is the subtitle, never inside the picture.
   Rules kept (DECISIONS, Friend 2026-11-08): what links two things sits on the straight line between them · a light, a ring
   or a word for a thing that moves starts after it has arrived · a mark between two things sits in the middle of the gap ·
   a word under an icon is centred on it · a ring around a thing is its own shape, from its edge, behind it (R1.ripple) ·
   nothing past x 550 of the small canvas below y 200 (×1.6 = x 940 on screen, where the app's buttons are).
   ===================================================================== */
const R4 = {
  /* a word centred on cx that shrinks (never wraps) to maxW once the fonts are in */
  word(K, parent, txt, cx, y, size, t, maxW) {
    const l = div(`left:${cx - 400}px;top:${y}px;width:800px;text-align:center;white-space:nowrap;line-height:1.25`, parent);
    l.className = 'u-label u-text';
    const s = document.createElement('span'); s.style.fontSize = size + 'px'; s.textContent = txt; l.appendChild(s);
    FITS.push(() => { const w = s.offsetWidth; if (w > maxW) s.style.fontSize = (size * maxW / w).toFixed(1) + 'px'; });
    if (t != null) K.enter(l, t, 'lead');
    return l;
  },
  /* one quotation mark (two strokes, as Lucide draws ”), filled with the accent; open = the opening “ (turned half round) */
  quote(parent, x, y, size, open) {
    const d = ICONS.quote.match(/d="[^"]+"/g).map(a => `<path class="ac" vector-effect="non-scaling-stroke" ${a}/>`).join('');
    return node(parent, x, y, size, size, '',
      `<svg width="${size}" height="${size}" viewBox="0 0 24 24" style="overflow:visible"><g${open ? ' transform="rotate(180 12 12)"' : ''}>${d}</g></svg>`);
  },
};

/* ================= B14 ประโยคเด็ด ================= */
/* 1 · the two quotation marks close in on the idea on the key word (this line is the one to quote) */
R3.both('B14', 'quote', 'เครื่องหมายคำพูดหนีบเข้ามา', (K, s, T, g) => {
  const it = s.idea, C = {x: 300, y: 140}, S = 150, Q = 88, gap = 22, out = 110;
  K.badge(g, it.icon, C.x, C.y, S, T.b[0], {tone: 'main'});
  /* the marks' ink spans 3–22 of Lucide's 24 box: the same gap on both sides of the idea */
  const ink0 = Q * 3 / 24, top = C.y - S / 2 - ink0;
  const L = R4.quote(g, C.x - S / 2 - gap - (Q - ink0), top, Q, true);       // “ : its right ink edge = idea's left edge − gap
  const R = R4.quote(g, C.x + S / 2 + gap - ink0, top, Q, false);            // ” : its left ink edge = idea's right edge + gap
  const go = T.hit - (ST.motion.snap?.d ?? .5) * .85, land = LG.arrive('snap', go);   // the marks land on the key word
  K.fade(L.o, T.b[1], 0, 1, {hold: true}); K.fade(R.o, T.b[1] + .1, 0, 1, {hold: true});
  K.move(L.m, go, `translateX(${-out}px)`, 'none', {hold: true, kind: 'snap'});
  K.move(R.m, go, `translateX(${out}px)`, 'none', {hold: true, kind: 'snap'});
  const lit = LG.lightUp(K, g, it.icon, C.x, C.y, S, land);                    // the idea lights once the marks are in place
  R1.ripple(K, lit, lit.done, {grow: 34});
  if (it.label) R4.word(K, g, it.label, C.x, C.y + S / 2 + 14, 44, lit.done, 360);
});

/* 2 · a lamp turns on and lights the idea standing on a stage */
R3.both('B14', 'spot', 'สปอตไลต์ส่องลงบนแท่น', (K, s, T, g) => {
  const it = s.idea, cx = 300, stageY = 262, PW = 300, PH = 64, S = 136, shadeB = 116, shadeY = 62;
  const beam = div(`left:${cx - PW / 2}px;top:${shadeY}px;width:${PW}px;height:${stageY - shadeY}px;opacity:0;` +
    `clip-path:polygon(${(PW - shadeB) / 2}px 0,${(PW + shadeB) / 2}px 0,100% 100%,0 100%)`, g);
  beam.className = 'u-spot';
  const st = node(g, cx - PW / 2, stageY, PW, PH, 'u-panel'); st.p.style.borderRadius = '18px';
  if (ST.panelTheme) st.p.classList.add(...ST.panelTheme.split(' '));
  K.enter(st.o, T.b[0], 'rise');
  K.badge(g, it.icon, cx, stageY - 6 - S / 2, S, T.b[1], {tone: 'soft', kind: 'drop'});
  /* the lamp hangs on a cord straight above the stage: the beam runs down the same line */
  const lamp = div(`left:${cx - 80}px;top:0;width:160px;height:${shadeY}px`, g,
    `<svg width="160" height="${shadeY}" style="overflow:visible"><path class="ln u-thin" d="M80 0V20"/>` +
    `<path class="sd" d="M${80 - 28} 18H${80 + 28}L${80 + shadeB / 2} ${shadeY}H${80 - shadeB / 2}Z"/></svg>`);
  K.enter(lamp, T.b[2], 'drop');
  const on = Math.max(T.hit - .08, LG.arrive('drop', T.b[2]) + .05, LG.arrive('drop', T.b[1]) + .05);
  A(beam, [{opacity: 0}, {opacity: .9, offset: .25}, {opacity: .25, offset: .45}, {opacity: 1}], on, .35, {f: 'forwards'});
  const lit = LG.lightUp(K, g, it.icon, cx, stageY - 6 - S / 2, S, on + .1);
  R1.ripple(K, lit, lit.done, {grow: 30});
  if (it.label) R4.word(K, st.p, it.label, PW / 2, 9, 38, on + .2, PW - 40);      // the stage's word comes with the light
  else K.skel(st.p, 70, 23, [PW - 140], on + .2);
});

/* 3 · a megaphone sends waves along the straight line to the idea, which lights when they reach it */
R3.both('B14', 'mega', 'โทรโข่งส่งเสียงไปถึงไอคอน', (K, s, T, g) => {
  const it = s.idea, Y = 140, M = {x: 120, s: 130}, I = {x: 450, s: 150};
  const mega = K.badge(g, 'megaphone', M.x, Y, M.s, T.b[0], {tone: 'main'});
  K.badge(g, it.icon, I.x, Y, I.s, T.b[1], {tone: 'soft'});
  /* three waves, each a ")" of growing height on the line y = Y, the group centred in the gap between the two */
  const a = M.x + M.s / 2, b = I.x - I.s / 2, k = 28, step = 50, x0 = (a + b) / 2 - (2 * step + k / 2) / 2;
  const waves = [56, 88, 120].map((h, i) => {
    const x = x0 + i * step;
    return div('left:0;top:0;width:600px;height:340px', g, `<svg width="600" height="340"><path class="ln u-thin" d="M${x} ${Y - h / 2}Q${x + k} ${Y} ${x} ${Y + h / 2}"/></svg>`);
  });
  const sw = (ST.motion.swap?.d ?? .3) * .6, t0 = T.hit - 2 * .14 - sw;    // the last wave is in by the key word
  K.punch(mega.p, t0 - .05);
  waves.forEach((w, i) => K.fade(w, t0 + i * .14, 0, 1, {hold: true}));        // each wave appears whole, one after another
  const reach = t0 + 2 * .14 + sw;                                           // the last wave touches the idea
  const lit = LG.lightUp(K, g, it.icon, I.x, Y, I.s, reach);
  R1.ripple(K, lit, lit.done, {grow: 32});
  if (it.label) R4.word(K, g, it.label, I.x, Y + I.s / 2 + 14, 42, lit.done, 200);
});

/* ================= sample sentences (general, not from Friend's script) ================= */
SENTENCE('r4.daily', {cat: 'B14', name: 'ความสม่ำเสมอชนะทุกอย่าง', say: ['ความสม่ำเสมอ', 'ชนะทุกอย่าง'],
  idea: {icon: 'repeat', label: 'สม่ำเสมอ'}});
SENTENCE('r4.start', {cat: 'B14', name: 'ไม่ต้องเก่งก่อน แค่เริ่มก่อน', say: ['ไม่ต้องเก่งก่อนถึงจะเริ่ม', 'แค่เริ่มก่อน'],
  idea: {icon: 'rocket', label: 'เริ่มก่อน'}});
SENTENCE('r4.trust', {cat: 'B14', name: 'สิ่งที่ขายได้จริงคือความเชื่อใจ', say: ['สิ่งที่ขายได้จริงคือ', 'ความเชื่อใจ'],
  idea: {icon: 'handshake', label: 'ความเชื่อใจ'}});
