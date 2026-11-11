/* =====================================================================
   CutPack · uni · APP-SCREEN variants (Friend 2026-11-11: the iOS style, "OK ครับ"; cutpack/style-rules/ios.md 8 and 10).
   Variants of the shared base set that look like an app screen. They are drawn for every style like any other variant
   (Friend: the base set "ต้องสามารถใช้ได้กับเกือบทุกสไตล์"); the ios style picks them first (ui: true, prefer: 'ui').
   Same slots as before (cat_ai.py), same rules (R3.both: one composition on the 600 × 340 small canvas, scaled 1.6× full
   screen; nothing past x 550 below y 200; words only from the slots).
     B04 sheet     a sheet of steps: one row per step, a thin loading bar runs under each name, then its number turns into a tick
     B05 settings  a settings card in two parts: the wrong row is struck out with a red cross, the right row's switch turns on
     B15 compose   a text field: the word is typed letter by letter, the send button is pressed on the key word, a bubble goes up
   This file loads after every other variant file (scenes/*.js in name order), so its sample sentences get a scene for
   every variant of their category (<id>.<variant>).
   ===================================================================== */
const UI = {
  /* a round holder with a step number (the number takes the holder's icon colour) */
  num(K, parent, k, cx, cy, size, t) {
    const n = node(parent, cx - size / 2, cy - size / 2, size, size, 'u-badge u-soft u-round'); n.p.style.borderRadius = '50%';
    const s = document.createElement('span'); s.className = 'u-btn-text'; s.style.fontSize = Math.round(size * .5) + 'px'; s.textContent = String(k); n.p.appendChild(s);
    if (t != null) K.enter(n.o, t, 'pop'); return n;
  },
  /* a thin loading bar that fills to v of its length between t and t + d */
  load(K, parent, x, cy, w, tIn, t, d, v = 1) {
    const tr = node(parent, x, cy - 4, w, 8, 'u-bar'); tr.p.style.borderRadius = '4px';
    const f = div(`left:0;top:0;width:${w}px;height:8px;border-radius:4px;transform-origin:0 50%;transform:scaleX(0)`, tr.p); f.className = 'u-bar-on';
    K.enter(tr.o, tIn, 'lead');
    A(f, [{transform: 'scaleX(0)'}, {transform: `scaleX(${v})`}], t, d, {e: 'ease-in-out', f: 'both'});
    return tr;
  },
  /* the grab handle of a sheet (decoration: an overlay that drops decoration leaves it out) */
  handle(parent, cx, y) { const h = div(`left:${cx - 32}px;top:${y}px;width:64px;height:8px;border-radius:4px`, parent); h.className = 'u-skel u-decor u-handle'; return h; },
  /* a hairline that parts two rows (iOS lists start it after the icon) */
  hair(K, parent, x, y, w, t) { const l = div(`left:${x}px;top:${y}px;width:${w}px;height:2px;border-radius:1px`, parent); l.className = 'u-skel u-decor'; K.enter(l, t, 'lead'); return l; },
};

/* ================= B04 ขั้นตอน: items [THING ×3], mark? {at, how: light | check | cross} ================= */
/* a sheet of steps. Each step is reached when its loading bar is full: its number turns into a green tick.
   The step that matters (mark.at) is reached on the key word: light = its icon lights up, check = it is ticked and
   bounces, cross = its bar stops half way, a red cross comes on its number, the row fades and no step after it is reached */
R3.both('B04', 'sheet', 'แผ่นการ์ดขั้นตอน แถบโหลดวิ่งทีละขั้น', (K, s, T, g) => {
  const its = s.items.slice(0, 3), n = its.length, mk = s.mark ?? {at: n - 1, how: 'light'}, at = Math.min(mk.at ?? n - 1, n - 1);
  const rowH = 96, H = 34 + n * rowH + 10, P = K.panel(40, 170 - H / 2, 510, H, T.b[0], {parent: g});
  UI.handle(P.p, 255, 12);
  const land = R7.steps(T, n, at, T.b[1] + .15);               // step `at` is reached on the key word
  its.forEach((it, k) => {
    const top = 34 + k * rowH, cy = rowH / 2, tIn = T.b[0] + .12 + k * ST.motion.stagger;
    const row = div(`left:0;top:${top}px;width:510px;height:${rowH}px`, P.p);
    if (k) UI.hair(K, P.p, 160, top - 1, 320, tIn);
    const num = UI.num(K, row, k + 1, 44, cy, 48, tIn);
    const tile = K.badge(row, it.icon, 112, cy, 64, tIn + .05, {tone: it.tone ?? 'main', shape: it.shape ?? 'tile'});
    if (it.label) R6.wordL(K, row, it.label, 160, cy - 40, 38, tIn + .1, 300); else K.skel(row, 160, cy - 26, [170], tIn + .1, {h: 16});
    const bad = mk.how === 'cross' && k === at, after = mk.how === 'cross' && k > at;
    if (after) { UI.load(K, row, 160, cy + 24, 300, tIn + .1, T.t1, .01, 0); return; }   // never reached
    const t1 = land[k], t0 = k === at ? Math.min(t1 - .45, k ? land[k - 1] : T.b[1]) : t1 - .45;
    UI.load(K, row, 160, cy + 24, 300, tIn + .1, t0, t1 - t0, bad ? .55 : 1);
    if (bad) { K.fade(num.o, T.hit, 1, 0); K.mark(row, 'cross', 44, cy, 48, T.hit); K.fade(row, T.hit + .3, 1, .45); return; }   // the cross takes the number's place
    R7.up(K, row, 'check', 44, cy, 48, t1, 'round', 'ok');      // the number turns into a tick, in its place and size
    if (k !== at) return;
    if (mk.how === 'light') { const L = R7.up(K, row, it.icon, 112, cy, 64, T.hit, it.shape ?? 'tile'); R1.ripple(K, L, L.done, {grow: 10}); }   // a small wave: it must not run over the tick or the name (rule 5)
    else K.punch(tile.p, T.hit + .1);
  });
}, undefined, {ui: true});

/* ================= B05 ถูกกับผิด: wrong {icon, label?}, right {icon, label?} ================= */
/* a settings card in two parts (a small grey bar heads each part, not a word): the wrong row is struck out in red with a
   red cross at its end as the lead is said; on the key word the right row's switch turns on and the wrong part steps back */
R3.both('B05', 'settings', 'การ์ดตั้งค่า ข้อผิดโดนขีดฆ่า ข้อถูกเปิดสวิตช์', (K, s, T, g) => {
  const part = (it, y, t, wordW) => {
    const hd = div(`left:62px;top:${y}px;width:120px;height:12px;border-radius:6px;transform-origin:0 50%`, g); hd.className = 'u-skel u-decor'; K.grow(hd, t);
    const P = K.panel(40, y + 24, 510, 108, t + .05, {parent: g});
    K.badge(P.p, it.icon, 64, 54, 68, t + .15, {tone: it.tone ?? 'main', shape: it.shape ?? 'tile'});
    const w = it.label ? R6.wordL(K, P.p, it.label, 118, 54 - 30, 40, t + .22, wordW) : null;
    if (!w) K.skel(P.p, 118, 54 - 9, [180], t + .22, {h: 18});
    return {hd, P, w};
  };
  const a = part(s.wrong, 10, T.b[0], 280), b = part(s.right, 176, T.b[1], 236);
  if (a.w) R3.strike(K, a.P.p, a.w, 112, 50, T.b[2]);
  K.mark(a.P.p, 'cross', 456, 54, 50, T.b[2] + .12);
  const sw = K.toggle(b.P.p, 378, 29, 100, T.b[1] + .3);        // 100 × 50, in the middle of the row
  sw.set(T.hit, 1);
  K.fade(a.hd, T.hit + .1, 1, .5); K.fade(a.P.o, T.hit + .1, 1, .5);
}, undefined, {ui: true});

/* ================= B15 ปิดคลิป / ชวนทำต่อ: action, label? ================= */
/* a text field: the app row on top (what to do + its name); the label is typed letter by letter in the field below with
   a blinking caret, the round send button is pressed on the key word and the words go up as a bubble on the right.
   No label: a grey bar is "typed" instead of a word, and the bubble holds grey bars */
R3.both('B15', 'compose', 'ช่องพิมพ์ข้อความ กดส่งแล้วลอยขึ้นเป็นฟอง', (K, s, T, g) => {
  const [i0] = R3.ACT[s.action] ?? R3.ACT.follow, M = ST.motion;
  K.badge(g, i0, 84, 62, 76, T.b[0], {tone: 'main'});
  if (s.label) R6.wordL(K, g, s.label, 140, 62 - 30, 44, T.b[0] + .1, 380); else K.skel(g, 140, 62 - 10, [200], T.b[0] + .1, {h: 20});
  UI.hair(K, g, 40, 118, 510, T.b[0] + .15);
  const F = K.panel(40, 240, 432, 80, T.b[0] + .2, {parent: g}); F.p.style.borderRadius = '40px';
  const send = K.badge(g, 'arrow-up', 512, 280, 68, T.b[0] + .3, {tone: 'acc', shape: 'round'});
  const tA = T.b[1], tB = T.hit - .35, X = 34, room = 432 - X - 30;
  /* the typed words: one span per letter, each seen from its own moment; gone when sent */
  const box = div(`left:${X}px;top:15px;white-space:nowrap;font-size:40px;line-height:1.25`, F.p); box.className = s.label ? 'u-label u-text' : '';
  const caret = node(F.p, X - 2, 18, 4, 44, 'u-bar-on'); caret.p.style.borderRadius = '2px';
  K.enter(caret.o, T.b[0] + .3, 'lead');
  const blink = (t, until) => { const it = Math.floor((until - t) / .9); if (it > 0) A(caret.p, [{opacity: 1}, {opacity: 1, offset: .5}, {opacity: 0, offset: .5}, {opacity: 0}], t, .9, {it, f: 'none'}); };
  blink(T.b[0] + .6, tA);
  if (s.label) {
    const gs = graphemes(s.label), dt = (tB - tA) / gs.length;
    const spans = gs.map((c, i) => { const e = document.createElement('span'); e.textContent = c; box.appendChild(e); R7.show(e, tA + (i + 1) * dt); return e; });
    FITS.push(() => {                                      // shrink to the field, then walk the caret to the end of each letter as it is typed
      const w = box.offsetWidth; if (w > room) box.style.fontSize = (40 * room / w).toFixed(1) + 'px';
      const xs = spans.map(e => e.offsetLeft + e.offsetWidth);
      A(caret.m, [{transform: 'translateX(0px)'}, ...xs.map((x, i) => ({transform: `translateX(${x}px)`, offset: (i + 1) / xs.length}))], tA + dt * .999, tB - tA, {e: `steps(${xs.length}, start)`, f: 'none'});
      A(caret.m, [{transform: `translateX(${xs.at(-1)}px)`}, {transform: `translateX(${xs.at(-1)}px)`}], tB, T.hit - tB, {f: 'none'});
    });
  } else {
    const bar = div(`left:0;top:16px;width:200px;height:18px;border-radius:9px;transform-origin:0 50%`, box); bar.className = 'u-skel';
    A(bar, [{transform: 'scaleX(0)'}, {transform: 'none'}], tA, tB - tA, {f: 'both'});
    A(caret.m, [{transform: 'translateX(0px)'}, {transform: 'translateX(204px)'}], tA, tB - tA, {f: 'none'});
    A(caret.m, [{transform: 'translateX(204px)'}, {transform: 'translateX(204px)'}], tB, T.hit - tB, {f: 'none'});
  }
  R7.hide(box, T.hit);
  blink(T.hit + .2, T.t1);
  K.punch(send.p, T.hit - .1);
  /* the bubble goes up out of the field, its right edge on the field's (a bubble on the send button's edge crossed the button) */
  const BR = 472, BW = 300, B = node(g, BR - BW, 132, BW, 96, 'u-badge u-acc u-bubble'); B.p.style.borderRadius = '34px 34px 10px 34px';
  B.o.style.transformOrigin = '100% 100%';
  if (s.label) {
    const bt = div('left:0;top:0;width:100%;height:100%;display:flex;align-items:center;justify-content:center;white-space:nowrap', B.p);
    const sp = document.createElement('span'); sp.className = 'u-label u-bubble-text'; sp.style.fontSize = '40px'; sp.textContent = s.label; bt.appendChild(sp);
    FITS.push(() => {                                      // the bubble as wide as its words (a long one shrinks to 380)
      let w = sp.offsetWidth; if (w > 316) { sp.style.fontSize = (40 * 316 / w).toFixed(1) + 'px'; w = 316; }
      const bw = Math.max(150, w + 64); B.o.style.left = BR - bw + 'px'; B.o.style.width = bw + 'px';
    });
  } else K.skel(B.p, 34, 28, [BW - 110, (BW - 110) * .6], T.hit + .1, {h: 14, gap: 14})
    .forEach(l => Object.assign(l.style, {background: 'currentColor', opacity: .45}));   // the bubble's own text colour: a grey bar vanished on the lime bubble (rule 10)
  R7.show(B.o, T.hit);
  K.move(B.m, T.hit, 'translateY(118px) scale(.9)', 'none', {hold: true, kind: 'snap'});
}, undefined, {ui: true});

/* ================= sample sentences (general topics, not Friend's own script) ================= */
SENTENCE('ui.trade', {cat: 'B04', name: 'เปิดบัญชี ยืนยันตัวตน เริ่มเทรด', say: ['เปิดบัญชี ยืนยันตัวตน', 'แล้วเริ่มเทรด'],
  items: [{icon: 'file-text', label: 'เปิดบัญชี'}, {icon: 'id-card', label: 'ยืนยันตัวตน'}, {icon: 'chart-line', label: 'เริ่มเทรด'}], mark: {at: 2, how: 'light'}});
SENTENCE('ui.diet', {cat: 'B04', name: 'ลดแป้ง ออกกำลังกาย แต่อย่าอดนอน', say: ['ลดแป้ง ออกกำลังกาย', 'แต่อย่าอดนอน'],
  items: [{icon: 'salad', label: 'ลดแป้ง'}, {icon: 'dumbbell', label: 'ออกกำลังกาย'}, {icon: 'moon', label: 'อดนอน'}], mark: {at: 2, how: 'cross'}});
SENTENCE('ui.buy', {cat: 'B04', name: 'ค้นหาแล้วกดสั่งซื้อ', say: ['แค่ค้นหาแล้วก็', 'กดสั่งซื้อ'],
  items: [{icon: 'search'}, {icon: 'shopping-cart'}], mark: {at: 1, how: 'check'}});
SENTENCE('ui.ads', {cat: 'B05', name: 'อย่าเพิ่งยิงแอด สร้างฐานลูกค้าก่อน', say: ['อย่าเพิ่งยิงแอด ไปก่อน', 'สร้างฐานลูกค้า'],
  wrong: {icon: 'megaphone', label: 'ยิงแอด'}, right: {icon: 'users', label: 'สร้างฐานลูกค้า'}});
SENTENCE('ui.gift', {cat: 'B05', name: 'ไม่ต้องลดราคา ให้ของแถม', say: ['ไม่ต้องลดราคา', 'ให้ของแถมแทน'],
  wrong: {icon: 'badge-percent'}, right: {icon: 'gift'}});
SENTENCE('ui.save', {cat: 'B15', name: 'กดบันทึกไว้ดูทีหลัง', say: ['มีประโยชน์ก็', 'กดบันทึกไว้'], action: 'save', label: 'บันทึก'});
SENTENCE('ui.like', {cat: 'B15', name: 'ชอบก็กดหัวใจ', say: ['ชอบคลิปนี้ก็', 'กดหัวใจให้หน่อย'], action: 'like'});
