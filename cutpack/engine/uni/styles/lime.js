/* =====================================================================
   STYLE · lime — "เขียวมะนาว" (Friend 2026-11-18, the 2nd of the 12 new sheets: "เริ่มทำสไตล์นี้ได้แต่ไม่ต้องทดสอบกับคลิปเดิมของผมนะ").
   Every place and size is measured on Friend's sheet (12 shots, 1080 × 1920), then held to Friend's rules for every style
   (styles/common.js: safe zone, frames below the search bar, centred words, the video filling its frame, seeded random, never over
   the face). The pictures are the glow-line template set first (Friend 2026-11-18: "ใช้ template ชุดฐานเป็นหลักเลยนะครับ").
   The 7-item form:
   1 frame    one of 12 layouts (LIME.layouts, named after Friend's shots): the speaker full screen with a glass card at the hands /
              over the chest / above the head / on the left / on the right, a split screen (graphics on top and the speaker below, or
              the other way), a dark screen with a big card (the four-card recap was taken out 2026-11-19). Between pictures the speaker talks with the words
              at the chest or above the head.
   2 surface  near-black charcoal screens with a faint grid (drifting very slowly, as Friend asked for neon) and a soft lime bloom;
              the pictures sit on dark frosted-glass cards with a light edge and a white grip bar on top (the sheet's "phone sheet")
   3 drawing  the glow-line pictures in the neon glass look (glow/bridge.js GLASSY.lime): grey glass tiles, white lines glowing white,
              the lit part lime
   4 colours  charcoal · white · one lime (#C9F64B)
   5 words    a small white lead whose last phrase is lime (every lead on the sheet) + a big heavy lime key word with a lime glow
   6 motion   cards rise in out of a blur, screens fade in out of a blur, the split line draws across, the key word lights on its word
   7 sound    whoosh on a screen cut, a soft swish on the key word
   ===================================================================== */
const LIME = {
  /* boxes [x, y, w, h]: a card holds its picture 26 in from the sides, 44 from the top (under the grip bar), 26 from the bottom ·
     words {x, y (centre), maxW}. Measured on Friend's sheet; moved where the sheet ran under TikTok's name / buttons / search bar */
  layouts: {
    talk:         {speaker: true, lead: {x: 540, y: 1003}, key: {x: 540, y: 1139}},                                              // shot 01
    hands:        {speaker: true, card: [320, 1180, 440, 480], lead: {x: 540, y: 985}, key: {x: 540, y: 1095}},                // shot 02 (sheet to y 1686)
    big:          {speaker: true, card: [80, 960, 840, 690], lead: {x: 540, y: 280}, key: {x: 540, y: 400}},                   // shot 03 (sheet x 62–1019, to y 1697) · words 153/252 → 280/400 (final 2026-11-18, Friend: "ฉากคนพูดเต็มจอ ให้เอา subtitles ลงมาอีก ตอนนี้มันอยู่สูงจนเกือบติดขอบจอด้านบนแล้ว")
    top:          {speaker: true, card: [160, 220, 760, 230], lead: {x: 540, y: 1023}, key: {x: 540, y: 1117}},                // shot 04 (sheet y 66: under the search bar)
    split_top:    {split: 'top', card: [100, 390, 820, 560], lead: {x: 540, y: 200}, key: {x: 540, y: 310}},                   // shot 05 · words 120/241 → 200/310, the card 310 → 390 (final 2026-11-18: the top words under the search bar, as the speaker screens')
    side_l:       {speaker: true, card: [60, 980, 450, 680], lead: {x: 735, y: 1183, maxW: 330}, key: {x: 735, y: 1281, maxW: 330}},   // shot 06 (sheet words to x 970: under the buttons)
    talk_top:     {speaker: true, lead: {x: 540, y: 280}, key: {x: 540, y: 400}},                                              // shot 07 · 114/241 → 280/400 (final 2026-11-18, Friend: "ให้เอา subtitles ลงมาอีก")
    screen:       {screen: true, card: [80, 790, 840, 580], lead: {x: 540, y: 440}, key: {x: 540, y: 545}, bloom: [540, 760]}, // shot 08
    side_r:       {speaker: true, card: [490, 980, 430, 680], lead: {x: 280, y: 1176, maxW: 400}, key: {x: 280, y: 1270, maxW: 400}},  // shot 09 (sheet card to x 1036)
    split_bottom: {split: 'bottom', card: [100, 1215, 820, 445], lead: {x: 540, y: 1040}, key: {x: 540, y: 1154}},             // shot 10
    // recap (four cards) taken out (Friend 2026-11-19: "ผมว่าตัดฉากที่มีการ์ด 4 ใบออกไปเลยดีกว่า")
    cta:          {speaker: true, card: [320, 1180, 440, 480], lead: {x: 540, y: 979}, key: {x: 540, y: 1084}},                // shot 12
  },
  split: 962,                                                       // the lime line of the split screens
  /* RANDOM, the same rules as neon: a call to action (B15) gets the closing card, a punchline (B14) the big dark screen; every
     other picture takes one of `pool` (never the one before it) where the face leaves room (limeRoom), among those the screens that
     show this picture's shape (glow/shapes.json) at least 75 % as big as the best, then the least used, then at random */
  pool: ['hands', 'big', 'top', 'split_top', 'side_l', 'screen', 'side_r', 'split_bottom', 'cta'],   // + the call-to-action screen as any screen (Friend 2026-11-18: "ทำตามที่คุณแนะนำ" · the sheets are read for their layout only)
  byCat: {B15: 'cta', B14: 'screen'},
  used: {}, last: null,
};
const limeInner = ([x, y, w, h]) => [x + 26, y + 44, w - 52, h - 70];   // the picture inside a card
for (const L of Object.values(LIME.layouts)) { if (L.card) L.stage = limeInner(L.card); if (L.cards) L.stages = L.cards.map(limeInner); }

/* fit a screen to this face [x0, top (forehead), x1, chin] (Friend 2026-11-18: "พยายามทำให้เหมือนต้นแบบที่สุดเท่าที่จะเป็นไปได้" — the
   sheet's face sits higher than most real clips' faces, so the card / words under the face slide down below the chin (a card
   shortens to keep the bottom at 1660, at least 280 high) and the words or card above the head need the hair (≈ 130 over the
   forehead) below them. Returns the moved layout, or null when this face leaves no room. Screens and split screens always fit. */
const LIME_LOW = {talk: ['lead', 'key'], hands: ['lead', 'key', 'card'], cta: ['lead', 'key', 'card'], big: ['card'], top: ['lead', 'key'],
  side_l: ['lead', 'key', 'card'], side_r: ['lead', 'key', 'card'], talk_top: []};
const LIME_HIGH = {talk_top: ['lead', 'key'], big: ['lead', 'key']};
/* CARDS SIZED TO THE PICTURE (final 2026-11-18, Friend on the card above the head, 760 × 230 with a small square picture in it: "เราแค่ย่อการ์ดให้แคบลงแล้ว
   ก็ทำให้การ์ด[สูง]ขึ้น motion graphic มันก็จะได้ดูเต็มการ์ด ... อยากให้แก้ระบบด้วยเลย" · "ทำให้ความกว้างน้อยลงแล้วก็ทำให้ความสูงสูงขึ้น คล้ายๆกับการ์ดแรกที่เปิดคลิป
   ออกมาแต่อาจจะเล็กกว่านั้นนิดนึง" · "ทำกับสไตล์นี้ก่อน"): a layout's card is the ROOM a card may take; the card itself is the biggest box of the
   picture's real shape (REAL_SHAPES, else the sample's) inside it, plus the card's own padding, placed at the room's anchor (the side next to
   the words) and centred left-right. The card above the head takes the room between the search bar and the hair (at most 760 × 600). */
const LIME_ANCHOR = {hands: 'top', cta: 'top', big: 'top', screen: 'top', split_top: 'top', split_bottom: 'top', top: 'bottom', side_l: 'center', side_r: 'center'};
/* THE 6 STANDARD MOTION-GRAPHIC SIZES (Friend 2026-11-19, common.md 4.1 · lime.md 16: "ผมเลยอยากกำหนดมาตรฐานขนาดของ motion graphic" ·
   "เราจะฟิกขนาดของ motion graphic เฉยๆเราไม่ได้จะมาดีไซน์สไตล์ใหม่"): the picture is one of the standard sizes, scaled from the corner between
   65% and 100% to the room this face leaves (the first size of the screen's order that fits); the card IS that size (padding inside), at the
   screen's old anchor; under 65% for every size of the order = the screen does not come up in this clip (limeRoom). The dark screen's card sits
   in the middle of the screen with its words moved up, the key word still 150 over the card (Friend: "ฉากนี้ต้องอยู่กึ่งกลางจอ ตรงกลางเลยนะ ...
   เว้นระยะห่างกับซับไตเติ้ลเหมือนเดิม" → "แบบนี้โอเคครับ"). */
const LIME_STD = {1: [860, 230], 2: [860, 470], 3: [560, 490], 4: [400, 635], 5: [860, 710], 6: [860, 965]};
const LIME_ORDER = {hands: [3, 2, 1], cta: [3, 2, 1], big: [2, 1], top: [2, 3, 1], split_top: [2, 3], side_l: [4], side_r: [4], split_bottom: [2, 1]};
const LIME_MIN = .65;
function limeShape(L, ar, name) {
  /* the CARD is the standard size scaled from the corner (its shape exact), the card's padding inside it, the picture in the padding at its own
     shape (Friend 2026-11-19: "แบบนี้มันไม่ได้ย่อตรงมุมนี่" · "ขนาดของการ์ดอ่ะมันก็คือ motion graphic ในสไตล์ที่ไม่มีการ์ด" · "การ์ดดูโล่งได้
     เพราะเดี๋ยวจะทำภาพชุดใหม่" · "แก้ได้ครับ"); returns null when no size of the screen's order reaches 65% here */
  if (!L.card) return L;
  const size = (k, s) => LIME_STD[k].map(v => Math.round(v * s));
  if (name === 'screen') {                                        // 5 (wide) or 6 (tall) by the picture's shape, in the middle of the screen
    const k = Math.abs(Math.log((ar || 1.21) / 1.21)) <= Math.abs(Math.log((ar || 1.21) / .89)) ? 5 : 6, [W, H] = LIME_STD[k];
    const gap = L.card[1] - (L.key.y + 95), lk = L.key.y - L.lead.y, maxH = 2 * (960 - (220 + 40 + lk + 95 + gap));   // 100%, smaller only when the words would reach the search bar
    const s = Math.min(1, 860 / W, maxH / H); if (s < LIME_MIN) return null;
    const [cw, ch] = size(k, s), ny = Math.round(960 - ch / 2);
    L.card = [Math.round(Math.min(Math.max(540 - cw / 2, 60), 920 - cw)), ny, cw, ch]; L.stage = limeInner(L.card);
    L.key.y = ny - gap - 95; L.lead.y = L.key.y - lk; if (L.bloom) L.bloom = [540, 960]; L.std = [k, s];
    return L;
  }
  const [x, y, w, h] = L.card, a = LIME_ANCHOR[name] ?? 'center';
  let X0 = 60, X1 = 920, Y0 = y, Y1 = 1660;                       // the room: the safe zone, from the screen's anchor to the bottom line
  if (name === 'split_top') Y1 = LIME.split - 12;
  if (name === 'top') { Y0 = 220; Y1 = y + h; }                    // between the search bar and the hair (limeFit)
  if (name === 'side_l') X1 = Math.min(920, L.lead.x - L.lead.maxW / 2 - 20);   // not into the words beside the card
  if (name === 'side_r') X0 = Math.max(60, L.lead.x + L.lead.maxW / 2 + 20);
  for (const k of LIME_ORDER[name] ?? [2]) {
    const [W, H] = LIME_STD[k], s = Math.min(1, (X1 - X0) / W, (Y1 - Y0) / H);
    if (s < LIME_MIN) continue;
    const [cw, ch] = size(k, s), cx = x + w / 2;
    L.card = [Math.round(Math.min(Math.max(cx - cw / 2, X0), X1 - cw)), Math.round(a === 'bottom' ? Y1 - ch : Y0), cw, ch]; L.stage = limeInner(L.card);
    L.std = [k, s];
    return L;
  }
  return null;
}
function limeFit(name, f) {
  const L0 = LIME.layouts[name]; if (L0.screen || L0.split) return L0;
  const [, top, , chin] = f, L = JSON.parse(JSON.stringify(L0));
  if (name === 'top') {                                             // the room above the head: under the search bar (220) to 140 over the forehead
    const h = Math.min(600, top - 140 - 220); if (h < 230) return null;
    L.card = [160, 220, 760, h]; L.stage = limeInner(L.card);
  }
  const topOf = k => k === 'lead' ? L[k].y - 40 : k === 'key' ? L[k].y - 75 : L[k][1];
  const bottomOf = k => k === 'lead' ? L[k].y + 40 : k === 'key' ? L[k].y + 95 : L[k][1] + L[k][3];
  for (const k of LIME_HIGH[name] ?? []) if (top - 130 < bottomOf(k) + 10) return null;   // above the head: under the hair? no room
  const low = LIME_LOW[name] ?? [];
  if (low.length) {
    const d = Math.max(0, chin + 30 - Math.min(...low.map(topOf)));
    for (const k of low) { if (k === 'card') { L.card[1] += d; L.card[3] = Math.min(L.card[3], 1660 - L.card[1]); if (L.card[3] < 280) return null; } else L[k].y += d; }
    if (low.some(k => k !== 'card' && bottomOf(k) > 1660)) return null;
    if (L.card) L.stage = limeInner(L.card);
  }
  return L;
}
const limeRoom = (name, f) => { const L = limeFit(name, f); return !!L && !!limeShape(JSON.parse(JSON.stringify(L)), null, name); };   // a standard size fits here (2026-11-19)
const limeStage = (name, f, ar) => { const L = limeFit(name, f); return L && limeShape(JSON.parse(JSON.stringify(L)), ar, name)?.stage; };   // null: this picture fits no standard size here

STYLE('lime', {
  name: 'เขียวมะนาว',
  layouts: LIME.layouts,
  css: `
@font-face{font-family:"LimeKey";src:url(fonts/Kanit-800-thai.woff);font-weight:800;unicode-range:U+02D7,U+0303,U+0331,U+0E01-0E5B,U+200C-200D,U+25CC}
@font-face{font-family:"LimeKey";src:url(fonts/Kanit-800-latin.woff);font-weight:800;unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+2000-206F}
@font-face{font-family:"LimeHand";src:url(fonts/Sriracha-Regular.ttf)}
@font-face{font-family:"LimeSerif";src:url(fonts/InstrumentSerif-Italic-latin.woff);font-style:italic}
.l-root{position:absolute;inset:0;--ink:#F4F6F2;--ac:#D5FF3D;--lw:5;--sd:#F4F6F2;--fl:rgba(26,28,27,.8);--text:#F4F6F2}
.l-screen{background:radial-gradient(ellipse 95% 70% at 50% 42%,#161917 0%,#0f1110 55%,#070808 100%)}   /* a little darker (final 2026-11-18, Friend: "ทำให้สีของ background เข้มขึ้นนิดนึง"; was #1d201e → #141615 → #0b0c0c) */
.l-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.04) 1.5px,transparent 1.5px),linear-gradient(90deg,rgba(255,255,255,.04) 1.5px,transparent 1.5px);background-size:54px 54px;background-position:-6px -10px}
.l-bloom{position:absolute;width:980px;height:760px;translate:-50% -50%;background:radial-gradient(closest-side,rgba(175,235,60,.34),rgba(175,235,60,.1) 55%,transparent)}
.l-panel{position:absolute;left:0;right:0;overflow:hidden;background:radial-gradient(ellipse 95% 80% at 50% 45%,#161917 0%,#0d0f0e 70%,#070808 100%)}
.l-video{position:absolute;left:0;right:0;overflow:hidden}
.l-card{position:absolute;border-radius:38px;background:rgba(26,28,27,.8);border:2px solid rgba(255,255,255,.24);
  box-shadow:0 22px 50px rgba(0,0,0,.45),inset 0 1px 0 rgba(255,255,255,.1);-webkit-backdrop-filter:blur(16px);backdrop-filter:blur(16px)}   /* back to the solid card (final 2026-11-18, Friend: "กลับไปใช้การ์ดทึบแบบเดิม") */
.l-card.l-on-dark{border:2px solid rgba(201,246,75,.55);box-shadow:0 0 18px rgba(190,245,70,.28),0 22px 50px rgba(0,0,0,.5),inset 0 1px 0 rgba(255,255,255,.1)}   /* final 2026-11-18, Friend: the card blends into the dark screens → "ข" a thin lime glowing edge */
.l-card::before{content:"";position:absolute;top:15px;left:50%;width:64px;height:7px;margin-left:-32px;border-radius:4px;background:rgba(255,255,255,.92)}
.l-text{position:absolute;inset:0}
.l-row{position:absolute;white-space:nowrap}
.l-lead{font-family:"Anu";font-weight:500;font-size:52px;line-height:1.3;color:#F2F4F0;text-shadow:0 0 3px rgba(0,0,0,.9),0 0 8px rgba(0,0,0,.75),0 2px 18px rgba(0,0,0,.6)}
.l-lead .hi{color:#C9F64B;font-weight:600}   /* the lead 46 → 52 px (final 2026-11-18, Friend: "เพิ่มขนาด subtitle ตัวเล็กสีขาวให้ใหญ่ขึ้นอีกนิดนึง") */
.l-lead i{font-family:"LimeSerif";font-style:italic;font-weight:400;font-size:1.22em;margin:0 .06em}
.l-key i{font-family:"LimeSerif";font-style:italic;font-weight:400;letter-spacing:0}
.l-key.l-hand{font-family:"LimeHand";font-weight:400;font-size:150px;line-height:1.25;letter-spacing:0}
.l-key{font-family:"LimeKey";font-weight:800;font-size:136px;line-height:1.12;letter-spacing:-1px;color:#C9F64B;
  filter:drop-shadow(0 0 2px rgba(225,255,150,.6)) drop-shadow(0 0 12px rgba(170,235,50,.55)) drop-shadow(0 3px 10px rgba(0,0,0,.55))}
`,
  motion: {
    pop:   {kf: [{opacity: 0, transform: 'translateY(30px) scale(.8)', filter: 'blur(8px)'}, {opacity: 1, transform: 'none', filter: 'blur(0)'}], d: .5, e: EASE.soft},
    drop:  {kf: [{opacity: 0, transform: 'translateY(-70px)', filter: 'blur(8px)'}, {opacity: 1, transform: 'none', filter: 'blur(0)'}], d: .6, e: EASE.soft},
    rise:  {kf: [{opacity: 0, transform: 'translateY(50px)', filter: 'blur(10px)'}, {opacity: 1, transform: 'none', filter: 'blur(0)'}], d: .6, e: EASE.soft},
    lead:  {kf: [{opacity: 0, filter: 'blur(8px)'}, {opacity: 1, filter: 'blur(0)'}], d: .35, e: EASE.smooth},
    chip:  {kf: [{opacity: 0, transform: 'translateY(24px)', filter: 'blur(8px)'}, {opacity: 1, transform: 'none', filter: 'blur(0)'}], d: .5, e: EASE.soft},
    leave: {kf: [{opacity: 1, filter: 'blur(0)'}, {opacity: 0, filter: 'blur(12px)'}], d: .3, e: EASE.out},
    punch: {kf: [{transform: 'scale(1)', filter: 'brightness(1)'}, {transform: 'scale(1.06)', filter: 'brightness(1.5)', offset: .4}, {transform: 'scale(1)', filter: 'brightness(1)'}], d: .6, e: EASE.calm},
    shake: {kf: [{transform: 'translateX(0)'}, {transform: 'translateX(-12px)'}, {transform: 'translateX(10px)'}, {transform: 'translateX(-6px)'}, {transform: 'translateX(0)'}], d: .5, e: 'ease-in-out'},
    move:  {d: .7, e: EASE.calm}, tilt: {d: .8, e: EASE.calm}, snap: {d: .7, e: EASE.soft}, swap: {d: .45, e: EASE.smooth},
    draw:  {d: .8, e: EASE.inout}, stroke: {d: .25}, stagger: .12, fall: {d: 1.2}, float: {a: 6, p: 3.0},
    glow:  {kf: [{opacity: 0, filter: 'blur(16px)'}, {opacity: 1, filter: 'blur(0)'}], d: .7, e: EASE.soft},
  },
  sound: {hit: ['softswish', -22], cross: ['swipe', -24], key: ['softswish', -21]},
  setup() { BGL.style.background = '#000'; HOOKS.push(cpInsetHook);
    /* load this style's fonts at once: the words are fitted to the safe zone on the first frame (hud 2026-11-18: fitted with the fallback font) */
    [['LimeKey', 800, 'normal'], ['LimeHand', 400, 'normal'], ['LimeSerif', 400, 'italic']].forEach(([f, w, st]) => div(`left:-9999px;top:0;font-family:${f};font-weight:${w};font-style:${st}`, document.body, 'กขคฅ ึ่้ 0123 Ab')); },

  /* FIT PICK (Friend 2026-11-18: "motion graphic ที่ระบบจะสุ่มเลือกมาต้องเหมาะสมกับพื้นที่ว่างที่มีอยู่" → every style: "ข"): the pictures' real shapes
     (tools/real_shapes.js, a second build) and how much of the screen a shape can take here (tools/fit_pick.js), as the neon style */
  realShapes: true,
  fitSize(ar, t0, t1) { const face = cpFaceBox(t0, t1); return cpFitSize(ar, LIME.pool.filter(n => limeRoom(n, face)), n => limeStage(n, face, ar), .75, n => !!LIME.layouts[n].speaker); },
  fitSurface() { const r = div('', SC); r.className = 'l-root l-screen'; return r; },

  frame(t0, t1, {index, scene}) {
    const meta = SCENES[scene]?.meta ?? {}, face = cpFaceBox(t0, t1);
    let name = meta.layout;
    if (!name) {
      const want = LIME.byCat[meta.cat];
      const ar0 = cpShape(meta.variant, t0);
      if (want && limeRoom(want, face) && (!ar0 || limeStage(want, face, ar0))) name = want;
      else {
        let pool = LIME.pool.filter(n => n !== LIME.last && limeRoom(n, face));
        if (!pool.length) pool = ['screen', 'split_top', 'split_bottom'].filter(n => n !== LIME.last);
        const ar = cpShape(meta.variant, t0);   // the picture's shape in this clip (REAL_SHAPES), else the sample's (fit pick, 2026-11-18)
        if (ar) { const ok = pool.filter(n => limeStage(n, face, ar)); if (ok.length) pool = ok; }   // the picture at 65% of a standard size or more (2026-11-19)
        if (ar) {
          const size = n => { const [, , w, h] = limeStage(n, face, ar); return ar > w / h ? w * w / ar : h * h * ar; };
          pool = cpSizeKeep(pool, size, .75, n => !!LIME.layouts[n].speaker);   // the speaker's screens with a picture: a floor, no race on size (Friend 2026-11-18: "อยากให้ ก ขึ้นบ้าง (ทุกสไตล์เลยนะ)")
        }
        pool = cpBalance(pool, n => !!LIME.layouts[n].speaker, index);   // ก (the speaker full screen) and ข (a graphic screen) as often (Friend 2026-11-18)
        const least = Math.min(...pool.map(n => LIME.used[n] ?? 0)); pool = pool.filter(n => (LIME.used[n] ?? 0) === least);
        name = pool[Math.floor(cpRand('screen' + index) * pool.length)];
      }
    }
    LIME.used[name] = (LIME.used[name] ?? 0) + 1; LIME.last = name;
    const L0 = (meta.layout ? LIME.layouts[name] : limeFit(name, face)) ?? LIME.layouts.screen;   // (a test's forced layout stays as on the sheet)
    const L = limeShape(JSON.parse(JSON.stringify(L0)), cpShape(meta.variant, t0), name) ?? JSON.parse(JSON.stringify(L0));   // the standard size (2026-11-19; a test's forced layout keeps its room when none fits)
    const root = div('', SC); root.className = 'l-root' + (L.screen ? ' l-screen' : '');
    const box = ([x, y, w, h], parent = root) => div(`left:${x}px;top:${y}px;width:${w}px;height:${h}px`, parent);
    const grid = host => {
      /* LIME LIGHT IN MOTION (final 2026-11-18, Friend: "background ผมอยากให้มีเอฟเฟคเคลื่อนไหวอะไรบางอย่างของแสงสีเขียวด้วยครับ"): two soft lime glows
         drift slowly under the grid on long loops and breathe, on the clip's clock (they carry on from one screen to the next) */
      [[540, 300, .42, 0, 700, 380, .31, 1, .3], [540, 320, .37, 2.2, 1300, 300, .29, 2.6, .24]].forEach(([cx, ax, fx, px, cy, ay, fy, py, a], k) => {
        const o = div('left:0;top:0;width:1000px;height:1000px;margin:-500px 0 0 -500px;border-radius:50%;' +
          `background:radial-gradient(closest-side,rgba(175,235,60,${a}),rgba(175,235,60,${(a * .35).toFixed(3)}) 55%,transparent);pointer-events:none`, host);
        const kf = []; for (let t = t0 - .2; t <= t1 + .2 + 1e-6; t += .5)
          kf.push({transform: `translate(${(cx + ax * Math.sin(fx * t + px)).toFixed(1)}px,${(cy + ay * Math.sin(fy * t + py)).toFixed(1)}px) scale(${(1 + .12 * Math.sin(.9 * t + k)).toFixed(3)})`,
            opacity: (.75 + .25 * Math.sin(.8 * t + 2 * k)).toFixed(3)});
        A(o, kf, t0 - .2, t1 - t0 + .4, {e: 'linear'}); });
      /* no grid (final 2026-11-18, Friend: "ลบตารางจาก background ออกครับ") */ };
    if (L.screen) {
      grid(root);
      if (L.bloom) { const b = div(`left:${L.bloom[0]}px;top:${L.bloom[1]}px`, root); b.className = 'l-bloom'; }
      A(root, [{opacity: 0, filter: 'blur(14px)', transform: 'scale(1.03)'}, {opacity: 1, filter: 'blur(0)', transform: 'none'}], t0 - .04, .35, {e: EASE.smooth});
      sfx('whoosh', t0 - .1, -20);
    }
    if (L.split) {                                                  // graphics on one half, the speaker on the other, FADING into each other
      /* no lime line between them (final 2026-11-18, Friend: "อยากให้เปลี่ยนจากการแบ่งจอบนล่างโดยมีเส้นแบ่งชัดเจนเป็นการ fade แทน"): the speaker's
         half reaches FADE px into the graphics' half and fades out over them (was: a 4 px glowing lime line at y 962) */
      const y = LIME.split, top = L.split === 'top', FADE = 220;
      const panel = top ? box([0, 0, 1080, y]) : box([0, y, 1080, 1920 - y]); panel.className = 'l-panel'; grid(panel);
      const vid = top ? box([0, y - FADE, 1080, 1920 - y + FADE]) : box([0, 0, 1080, y + FADE]); vid.className = 'l-video';
      const m = top ? `linear-gradient(180deg,transparent,#000 ${FADE}px)` : `linear-gradient(0deg,transparent,#000 ${FADE}px)`;
      Object.assign(vid.style, {webkitMaskImage: m, maskImage: m});
      cpInset(vid, 1080, top ? 1920 - y + FADE : y + FADE, t0, .3, top ? .5 : .46);
      A(panel, [{opacity: 0, transform: `translateY(${top ? -60 : 60}px)`}, {opacity: 1, transform: 'none'}], t0 - .04, .4, {e: EASE.soft});
      A(root, [{opacity: 0}, {opacity: 1}], t0 - .04, .2, {e: EASE.smooth});   // the whole split (its speaker copy too) only from t0
      sfx('whoosh', t0 - .1, -20);
    }
    A(root, [{opacity: 1, filter: 'blur(0)'}, {opacity: 0, filter: 'blur(10px)'}], t1 - .3, .3, {e: EASE.out, f: 'forwards'});
    /* the cards rise in, one after another; each picture lives INSIDE its card (it rises with it, and the bridge reads the card's
       dark glass as the picture's ground: darker tiles, as on the sheet) */
    const inner = ([, , w, h]) => [26, 44, w - 52, h - 70];
    const cards = (L.cards ?? (L.card ? [L.card] : [])).map((c, k) => { const e = box(c); e.className = 'l-card' + (L.screen || L.split ? ' l-on-dark' : ''); if (L.std) e.dataset.std = L.std[0] + ':' + L.std[1].toFixed(3);   // for tools/card_sizes.js   // on the charcoal screens: a lime edge
      A(e, [{opacity: 0, transform: 'translateY(40px) scale(.94)', filter: 'blur(10px)'}, {opacity: 1, transform: 'none', filter: 'blur(0)'}], t0 + .02 + .12 * k, .45, {e: EASE.soft});
      return box(inner(c), e); });
    const stage = L.card ? cards[0] : box([0, 0, 1, 1]);
    const stages = L.cards ? cards : null;
    return {root, stage, stages, cam: root, L, name, dark: !!(L.screen || L.split)};
  },
  /* between pictures (a real clip): the words at the chest (shot 01) or above the head (shot 07), one of the two for each stretch
     between pictures, at random from the run's seed (two in three at the chest), never over the face */
  speakerFrame(a, b) {
    const gap = CLIPWINS.filter(x => x.t1 <= a + .05).length, face = cpFaceBox(a, b);
    let name = cpRand('talk' + gap) < .67 ? 'talk' : 'talk_top';
    if (!limeRoom(name, face)) name = name === 'talk' ? 'talk_top' : 'talk';
    if (!limeRoom(name, face)) name = 'talk';
    const root = div('', SC); root.className = 'l-root';
    return {root, cam: root, speaker: true, L: limeFit(name, face) ?? LIME.layouts.talk_top, name};
  },
  /* the lead fades in out of a blur, its last phrase lime (every lead on Friend's sheet); the key word comes in on its word */
  text(F, T, lead, key) {
    const L = F.L ?? LIME.layouts.talk, el = div('', F.root ?? SC); el.className = 'l-text';
    if (lead && L.lead) {
      /* all white (final 2026-11-18, Friend: "subtitle ตัวเล็กสีขาวไม่ต้องมีสีเขียวปนมาด้วย"; the sheet's leads ended in lime) */
      const r = cpLine(el, lead, 'l-lead', L.lead, undefined, 'l-row');
      A(r, [{opacity: 0, filter: 'blur(8px)'}, {opacity: 1, filter: 'blur(0)'}], T.t0 + .15, .35, {e: EASE.smooth});
    }
    if (key && L.key) {
      /* two faces in turns (final 2026-11-18, Friend: "Subtitles ตัวใหญ่สีเขียว ให้เพิ่มฟอนต์นี้เข้าไปด้วย" Sriracha, "สลับกันทีละก้อนแบบ editorial เก่า" ·
         "เข้าใจถูกแล้วครับ"): core.js gives every block of a real clip a look in turns, k = Kanit, i = the hand (Sriracha) */
      const r = cpLine(el, key, 'l-key' + (T.look === 'i' ? ' l-hand' : ''), L.key, undefined, 'l-row');
      A(r, [{opacity: 0, transform: 'scale(.9)', filter: 'blur(10px) brightness(1.8)'}, {opacity: 1, transform: 'none', filter: 'blur(0) brightness(1)'}], T.hit - .05, .45, {e: EASE.soft});
      sfx('softswish', T.hit - .05, -21);
    }
    if (F.speaker && T.clip) {
      A(el, [{visibility: 'hidden'}, {visibility: 'visible'}], T.b[0] - .02, .001); A(el, [{visibility: 'visible'}, {visibility: 'hidden'}], T.end - .021, .001, {f: 'forwards'});
      return null;
    }
    return el;
  },
});
