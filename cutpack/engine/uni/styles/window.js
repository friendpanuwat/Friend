/* =====================================================================
   STYLE · window — "หน้าต่างแอป" (App Window) (Friend 2026-11-18, the 3rd of the new sheets: "สไตล์ต่อไปครับ")
   Every place and size is measured on Friend's sheet (12 shots, 1080 × 1920), then held to the rules every style shares
   (styles/common.js: safe zone, frames below the search bar, centred words, the video filling its frame, seeded random, never over
   the face). The pictures: the glow-line template set first, in the glass look with blue light (glow/bridge.js GLASSY.window).
   The 7-item form:
   1 frame    one of 12 layouts (WIN.layouts, named after Friend's shots): the speaker full screen with an app window at the hands,
              or a deep-blue screen with a big window, the speaker in a rounded frame beside a window or under one (stack). (The four-window
              recap went out 2026-11-19, the two windows in cascade 2026-11-20.) Between pictures the speaker talks with the words at the chest. (The sheet's chapter bar top left and the small
              spaced label over the words are left out: Friend 2026-11-18, "ลบที่ผมวงกลมสีแดงออกด้วยครับทุกฉากเลย".)
   2 surface  screens: near-black to navy (Friend's background picture, 2026-11-18) with our own turning rings top right and bottom
              left (one glowing line, white app-chips, a running light); the pictures sit in dark app windows (three dots, a skeleton
              title bar)
   3 drawing  the glow-line pictures: white lines, the lit part a blue outline (no solid fill), blue light
   4 colours  deep blue · near-black windows · white · one blue (#2F6FEB)
   5 words    a white lead (Sriracha) + the key word hollow with a blue outline (Kanit 800; over the video a faint dark fill) — final
   6 motion   windows rise in out of a blur, screens fade in, the key word pops on its word
   final 2026-11-18 (style-rules/window.md section 15): the window over the head (full_top), the screens without the face with their
   window in the middle of the screen and the picture in the middle of it, no box round a word alone (GLASSY.window.noPill)
   7 sound    whoosh on a screen cut, a soft swish on the key word
   The words the sheet invents (window titles "เป้าหมายปีนี้", tags "STEP 1/3") are skeleton bars instead (Friend 2026-11-18), so the
   AI has nothing more to write.
   ===================================================================== */
const WIN = {
  /* boxes [x, y, w, h] · words {x, y (centre), maxW, half (half the row's height, for the right edge)}. Moved where the sheet ran
     under TikTok's name / buttons / tabs. */
  layouts: {
    talk:     {speaker: true, lead: {x: 540, y: 1062}, key: {x: 540, y: 1175}},                                                  // shot 01 without its window
    full:     {speaker: true, lead: {x: 540, y: 1062}, key: {x: 540, y: 1175}, win: [80, 1300, 840, 360]},              // shot 01 (sheet to y 1682)
    full_n:   {speaker: true, lead: {x: 540, y: 1117}, key: {x: 540, y: 1226}, win: [210, 1340, 670, 320]},             // shot 02 (narrow window)
    dark:     {screen: true, lead: {x: 540, y: 381}, key: {x: 540, y: 490}, win: [80, 645, 840, 630]},    // shot 03 · final point 4: the window in the middle of the screen, the words 90 over it (the top ring 230 higher, off the words)
    float:    {screen: true, frame: [62, 258, 470, 740, 30], lead: {x: 770, y: 610, maxW: 470}, key: {x: 770, y: 700, maxW: 470, half: 50},
               win: [300, 1070, 620, 560]},                                                                    // shot 04
    full_w:   {speaker: true, lead: {x: 540, y: 1040}, key: {x: 540, y: 1183}, win: [170, 1300, 740, 360]},             // shot 05
    /* STACK (Friend 2026-11-20, in place of the cascade: "ลบฉากนี้ออกจากสไตล์ได้เลยครับเพราะว่ามันดูแปลกๆคือมันมี 2 การ์ดแต่มันมี motion graphic
       อยู่แค่การ์ดเดียว" · "ผมอยากให้ลองทำเป็นฉากนี้แทน[รูปการ์ดบน คำกลาง หน้าในกรอบล่าง] แต่ยังคงสไตล์หน้าต่างแอปเหมือนเดิม"): one window at
       the top (its room 220–690), the words under it, the speaker in a rounded frame at the bottom (its own video, as float / stats) */
    stack:    {screen: true, lead: {x: 540, y: 885}, key: {x: 540, y: 995}, win: [60, 220, 860, 470],
               frame: [60, 1190, 860, 470, 30], inset: [.3, .5]},   // the frame is the same box as the window (winShape) · inset: the face takes 30 % of this wide frame, in its middle
    full_d:   {speaker: true, lead: {x: 540, y: 1051}, key: {x: 540, y: 1161}, win: [80, 1300, 840, 360]},             // shot 07
    stats:    {screen: true, frame: [560, 250, 360, 690, 30], lead: {x: 290, y: 653, maxW: 440}, key: {x: 290, y: 756, maxW: 440, half: 50},
               win: [80, 1070, 840, 560]},                                                                     // shot 08 (sheet frame to x 1019)
    full_c:   {speaker: true, lead: {x: 540, y: 1073}, key: {x: 540, y: 1172}, win: [80, 1300, 840, 360]},             // shot 09
    dark_b:   {screen: true, lead: {x: 540, y: 385}, key: {x: 540, y: 490}, win: [80, 645, 840, 630]},    // shot 10 · final point 4: as dark
    // recap (four windows) taken out (Friend 2026-11-19: "เอาฉากนี้ออก")
    cta:      {speaker: true, lead: {x: 540, y: 1066}, key: {x: 540, y: 1172}, win: [80, 1300, 840, 360]},             // shot 12
    /* final 2026-11-18 (Friend: "พื้นที่ด้านบนหัวยังว่างสามารถเอาโอเวอร์เลย์ไปไว้ตรงนั้นได้นะครับ เพื่อความหลากหลาย"): the window over
       the head, from under the search bar (220) to 140 over the face box (the hair, as lime's top card); its height from the clip's
       face (winFit) · the words at the chest as shot 01 */
    full_top: {speaker: true, top: true, lead: {x: 540, y: 1062}, key: {x: 540, y: 1175}, win: [120, 220, 840, 560]},
  },
  pool: ['full', 'full_n', 'dark', 'float', 'full_w', 'stack', 'full_d', 'stats', 'full_c', 'dark_b', 'cta', 'full_top'],   // + the call-to-action screen as any screen (Friend 2026-11-18: "ทำตามที่คุณแนะนำ" · the sheets are read for their layout only)
  byCat: {B15: 'cta', B14: 'dark'},
  used: {}, last: null, place: {top: 0, low: 0},   // place: how many speaker screens had the window over the head / under it
  /* the screens' background. The gradient was measured on a picture Friend sent (2026-11-18: "ผมอยากได้ background แบบนี้"): near-black
     at the top to deep navy at the bottom. The rings are our own (Friend: "รูปนี้ผมไปก๊อปเขามาผมก็เลยอยากให้คุณดีไซน์วงแหวนใหม่หน่อย"):
     per corner one glowing blue ring (one line, as before: "อยากให้มันเป็นเส้นเดียวมันอันเก่า") carrying two white app-chips (rounded
     squares, as the windows) and a short running light. Each ring {cx, cy, r, chips: [angles], light: angle, dir}; 0 = top
     right + bottom left, 1 = mirrored (screens whose frame or back window covers the top right; its lower chips sit left of TikTok's
     buttons, x 920, and turn away from them). */
  /* ONE PAIR OF RINGS, ALWAYS IN THE SAME PLACE, TURNING ON THE CLIP'S OWN CLOCK (Friend 2026-11-20: "เวลามันมีฉากแบบนี้ต่อกัน การหมุนและ
     ตำแหน่งของวงแหวน มันไม่ต่อเนื่องอะครับ ผมอยากให้มันอยู่ตำแหน่งเดิมตลอด และหมุนต่อเนื่อง"): top right + bottom left, the top one high
     enough to stay off the words of every screen (it used to be mirrored per screen and raised only where the words sit high) */
  /* 6 chips a ring, 60° apart all the way round (Friend 2026-11-20: "ให้เพิ่มแบบให้มันเท่าๆกันทั้งวงอ่ะ ไม่ใช่ว่ามีอยู่ตรงส่วนเดียวแล้วที่อื่นไม่มี
     อาจจะใส่มา 6 ลูกก็ได้ แต่ต้องอยู่ในระยะห่างที่มันเท่าๆกันทั้งวง · ตอนหมุนมันจะได้เห็นลูกปัดโผล่มาอยู่ตลอด" · was 2, then 4 bunched on one arc) */
  decor: [{cx: 930, cy: 120, r: 330, chips: [30, 90, 150, 210, 270, 330], light: 120, dir: 1}, {cx: 140, cy: 1760, r: 300, chips: [0, 60, 120, 180, 240, 300], light: -60, dir: -1}],
  ring: 'split',                                // the ring's shape (winRingPath): 'split' (Friend 2026-11-18 chose ค) · 'square' · 'hex'
  speakerShare: .6,                             // ก's share where both kinds fit (winBalance · Friend 2026-11-20: "E ครับ")
  spin: 4.5,                                    // degrees a second (Friend: "หมุนให้เร็วกว่านี้อีกนิดนึง" 1.5 → 2.25, then "วงแหวนต้องหมุนเร็วกว่านี้อีก" → 4.5)
};
/* the ring's line, centred at (R, R), from the angle 0 clockwise (as the angles of its chips): a rounded square (as the windows), a
   hexagon, or a circle ("split": the chips sit in gaps of it) */
function winRingPath(shape, R, r) {
  const f = v => v.toFixed(1);
  if (shape === 'square') { const k = r * .45, a = R - r, b = R + r;
    return `M ${f(b)} ${f(R)} L ${f(b)} ${f(b - k)} Q ${f(b)} ${f(b)} ${f(b - k)} ${f(b)} L ${f(a + k)} ${f(b)} Q ${f(a)} ${f(b)} ${f(a)} ${f(b - k)} L ${f(a)} ${f(a + k)} Q ${f(a)} ${f(a)} ${f(a + k)} ${f(a)} L ${f(b - k)} ${f(a)} Q ${f(b)} ${f(a)} ${f(b)} ${f(a + k)} Z`; }
  if (shape === 'hex') return 'M ' + [0, 1, 2, 3, 4, 5].map(i => `${f(R + r * Math.cos(i * Math.PI / 3))} ${f(R + r * Math.sin(i * Math.PI / 3))}`).join(' L ') + ' Z';
  return `M ${f(R + r)} ${f(R)} A ${r} ${r} 0 1 1 ${f(R - r)} ${f(R)} A ${r} ${r} 0 1 1 ${f(R + r)} ${f(R)} Z`;
}
const winInner = ([, , w, h]) => [22, 76, w - 44, h - 98];        // the picture inside a window (under its 64-high title bar)

/* fit a speaker screen to this face [x0, top, x1, chin] (as lime): the words and the window under the face slide below the chin
   (the window shortens to keep its bottom at 1660, at least 260 high); null = no room. Screens always fit. */
function winFit(name, f) {
  const L0 = WIN.layouts[name]; if (L0.screen) return winShape(JSON.parse(JSON.stringify(L0)), name) ?? L0;   // (no key: dark = size 5, for the size estimates)
  const [, top, , chin] = f, L = JSON.parse(JSON.stringify(L0)), lk = L.key.y - L.lead.y, low = !!L.win && !L.top;
  /* 1. the words at the chest, slid below the chin when the face is low (rows: the lead's top = y − 45, the key word's bottom = y + 55) */
  const tops = [L.lead.y - 45, L.key.y - 55].concat(low ? [L.win[1]] : []), d = Math.max(0, chin + 30 - Math.min(...tops));
  if (L.key.y + d + 55 <= 1660) {
    L.lead.y += d; L.key.y += d;
    if (low) { L.win[1] += d; L.win[3] = 1660 - L.win[1]; return winShape(L, name); }   // the room under the words, to the bottom line
    if (L.top) { L.win[3] = top - 140 - L.win[1]; return winShape(L, name); }   // over the head: the search bar (220) to 140 over the face
    return L;
  }
  /* 2. WORDS OVER THE HEAD, only when the chin leaves no room under it (Friend 2026-11-20: "2. เอาตามที่คุณแนะนำครับ" · "subtitle จะไปอยู่ตรงนั้น
     เป็นตำแหน่งใหม่ถาวรเลยหรือว่าใช้เฉพาะคลิปที่มันมีปัญหาแบบนี้" → only then): the key word's bottom 140 over the face box (the hair, as
     the window over the head), the lead's top under the search bar (220) · the window over the head (full_top) from 220, the words 90
     under it · a window under the face: no room (null) · no room over the head either: null */
  if (low) return null;
  const keyBottom = top - 140;
  if (L.top) {
    L.win[3] = keyBottom - (lk + 45 + 55) - 90 - L.win[1];
    const S = winShape(L, name); if (!S) return null;
    S.lead.y = S.win[1] + S.win[3] + 90 + 45; S.key.y = S.lead.y + lk; S.above = true; return S;
  }
  L.key.y = keyBottom - 55; L.lead.y = L.key.y - lk;
  if (L.lead.y - 45 < 220) return null;
  L.above = true; return L;
}
/* THE SEVEN SIZES (style-rules/common.md 4.1 · Friend 2026-11-19: "ใส่ระบบ ขนาด 7 ขนาดด้วย"): the WINDOW (its title bar included) is the
   standard size scaled from the corner, its shape exact, 65–100 %; the picture inside it as before (winInner). Each screen: its room and
   its order of sizes (WIN_ORDER, style-rules/window.md 4.1); the first size that reaches 65 % in the room; none = null (a speaker screen:
   not this screen · a blue screen keeps its sheet window). dark / dark_b: 5 or 6 at random 60 : 40 (as lime), in the middle of the screen,
   the words 90 over it, moved up with it but not into the search bar. No sizes 4 and 7 (no screen beside the body). */
const WIN_STD = {1: [860, 230], 2: [860, 470], 3: [560, 490], 4: [400, 635], 5: [860, 710], 6: [860, 965], 7: [400, 500]};
const WIN_ORDER = {full: [2, 1], full_d: [2, 1], full_c: [2, 1], cta: [2, 1], full_n: [3, 2], full_w: [1, 2], full_top: [2, 3, 1],
  float: [3, 5], stats: [5, 2], stack: [5, 2, 3]};   // stack: the tallest size the screen allows, as the sheet Friend sent
const WIN_MIN = .65;
/* a screen that shows the speaker: the speaker's own screens (ก) and the blue screens with the face in a frame (float, stats, stack) —
   for the hook (Friend 2026-11-18 on the opening: "เปิดคลิปด้วยหน้าในกรอบเล็กนับด้วยครับ" · bug found 2026-11-20, fixed 2026-11-24: a close-up
   clip had no ก that fits, so the hook was dropped and the first picture came at 20 s) */
const winShows = n => !!WIN.layouts[n].speaker || !!WIN.layouts[n].frame;
function winShape(L, name, key) {
  if (!L.win) return L;
  const size = (k, s) => WIN_STD[k].map(v => Math.round(v * s));
  if (name === 'dark' || name === 'dark_b') {
    const gap = L.win[1] - (L.key.y + 65), lk = L.key.y - L.lead.y, maxH = 2 * (960 - (220 + 45 + lk + 65 + gap));   // the lead's row stays under the search bar (220)
    const sOf = k => Math.min(1, 760 / WIN_STD[k][0], maxH / WIN_STD[k][1]);   // at most 760 wide: in the very middle (540) inside 60–920 (Friend 2026-11-20: "4. ข")
    const first = key != null && cpRand(key) >= .6 ? 6 : 5, k = sOf(first) >= WIN_MIN ? first : 11 - first, s = sOf(k);
    if (s < WIN_MIN) return null;
    const [w, h] = size(k, s), y = Math.round(960 - h / 2);
    L.win = [Math.round(Math.min(Math.max(540 - w / 2, 60), 920 - w)), y, w, h]; L.key.y = y - gap - 65; L.lead.y = L.key.y - lk;   // in the middle, kept in 60–920 (TikTok's buttons, as lime: 860 wide = 60–920)
    L.std = [k, s]; return L;
  }
  if (name === 'stack') {
    /* STACK (Friend 2026-11-20: "ใช้การ์ดใหญ่แล้วทำให้มันเหมือน ref ไม่ได้หรอ"): the window and the speaker's frame are the SAME standard
       size, as big as the screen allows — the window hangs from 220, the frame sits on 1660, and the words fill the gap between them
       (60 px clear of each). 220 → 1660 is 1440 px, so each box may be (1440 − gap) / 2 high. */
    const lk = L.key.y - L.lead.y, gap = lk + 100 + 120, maxH = (1440 - gap) / 2;
    for (const k of WIN_ORDER.stack) {
      const [W, H] = WIN_STD[k], s = Math.min(1, 860 / W, maxH / H); if (s < WIN_MIN) continue;
      const cw = Math.round(W * s), ch = Math.round(H * s), x0 = Math.round(540 - cw / 2);
      L.win = [x0, 220, cw, ch]; L.frame = [x0, 1660 - ch, cw, ch, 30];
      L.lead.y = Math.round(940 - (lk + 100) / 2 + 45); L.key.y = Math.round(L.lead.y + lk);
      L.std = [k, s]; return L;
    }
    return null;
  }
  const [x, y, w, h] = L.win;
  let X0 = 60, X1 = 920, Y0 = y, Y1 = y + h;                      // speaker screens: winFit gave the room (under the words to 1660, or over the head)
  if (name === 'float') { X0 = x; Y1 = 1660; }                    // right of the face frame's column, as on the sheet
  if (name === 'stats') {                                         /* the window's right edge on the face frame's, in the middle of the screen (Friend
     2026-11-19: "อยากให้เส้นสีแดงกับเส้นสีเหลืองที่ผมขีดไว้ตรงกัน แต่การ์ดต้องอยู่กึ่งกลางจอนะ" · "ทำแค่ฉากนี้ฉากเดียว"): as wide as
     2 × (frame right − 540), its bottom on 1660, its top up to 90 under the frame */
    const fr = L.frame[0] + L.frame[2], fb = L.frame[1] + L.frame[3]; X0 = 1080 - fr; X1 = fr; Y0 = fb + 90; Y1 = 1660; }
  for (const k of WIN_ORDER[name] ?? [2]) {
    const [W, H] = WIN_STD[k], s = Math.min(1, (X1 - X0) / W, (Y1 - Y0) / H); if (s < WIN_MIN) continue;
    const [cw, ch] = size(k, s), cx = name === 'stats' || L.speaker ? 540 : x + w / 2;   // speaker screens in the middle (Friend 2026-11-20: "3. ย้ายไปกลางจอ")
    L.win = [Math.round(Math.min(Math.max(cx - cw / 2, X0), X1 - cw)), L.top || name === 'stats' ? Y1 - ch : Y0, cw, ch];   // over the head and stats: down to the room's bottom   // over the head: down to the hair (as lime's top card) · else under the words
    L.std = [k, s]; return L;
  }
  return null;
}
/* ก : ข = 60 : 40 (Friend 2026-11-20: "สไตล์นี้ผมอยากให้ลดฉากสีน้ำเงินลงนิดนึงแล้วก็เพิ่มฉากโอเวอร์เลย์มากขึ้นหน่อย" → "E ครับ"): as cpBalance
   (common.js), where both kinds fit the kind this clip is furthest behind its share on (taken / share), a tie at random from the run's seed
   weighted by the share; only one kind fits: that one */
function winBalance(pool, isSpk, key, share) {
  const a = pool.filter(isSpk), b = pool.filter(n => !isSpk(n)), k = CP.kinds, ua = k.spk / share, ub = k.scr / (1 - share);
  const pick = a.length && b.length ? (ua === ub ? (cpRand('kind' + key) < share ? 'spk' : 'scr') : ua < ub ? 'spk' : 'scr') : a.length ? 'spk' : 'scr';
  k[pick]++;
  (CP.log ??= []).push({key, spk: a, scr: b, pick});   // (tests: what each picture could take)
  return pick === 'spk' ? a : b;
}
STYLE('window', {
  name: 'หน้าต่างแอป',
  layouts: WIN.layouts,
  css: `
@font-face{font-family:"WinKey";src:url(fonts/Kanit-800-thai.woff);font-weight:800;unicode-range:U+02D7,U+0303,U+0331,U+0E01-0E5B,U+200C-200D,U+25CC}
@font-face{font-family:"WinKey";src:url(fonts/Kanit-800-latin.woff);font-weight:800;unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+2000-206F}
@font-face{font-family:"WinLead";src:url(fonts/Sriracha-Regular.ttf)}
.w-root{position:absolute;inset:0;--ink:#F2F6FC;--ac:#5B9BFF;--lw:5;--sd:#F2F6FC;--fl:rgba(14,18,28,.88);--text:#F2F6FC}
.w-screen{background:linear-gradient(180deg,#000206 0%,#010c1a 7%,#021022 19%,#03152d 31%,#041b3b 44%,#041f45 56%,#04224b 69%,#05244d 81%,#05224a 100%);overflow:hidden}
.w-arc{position:absolute}
.w-arc svg{position:absolute;inset:0;overflow:visible}
.w-main{filter:drop-shadow(0 0 5px rgba(79,134,196,.75))}
.w-light{filter:drop-shadow(0 0 6px rgba(225,238,255,.95))}
.w-chip{position:absolute;width:54px;height:54px;background:#fff;border-radius:15px;box-shadow:0 0 8px rgba(255,255,255,.9),0 0 26px rgba(150,195,255,.6)}
.w-chip::after{content:"";position:absolute;left:19px;top:19px;width:16px;height:16px;border-radius:5px;background:#2F6FEB}   /* 54 px: Friend "ลูกปัด ... ใหญ่ๆกว่านี้อีกนิดนึง" (was 42) */
.w-win{position:absolute;border-radius:26px;background:rgba(13,17,27,.9);border:1.5px solid rgba(255,255,255,.14);
  box-shadow:0 22px 50px rgba(0,0,0,.5),inset 0 1px 0 rgba(255,255,255,.06);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);overflow:hidden}
.w-bar{position:absolute;left:0;right:0;top:0;height:64px;border-bottom:1px solid rgba(255,255,255,.06)}
.w-dot{position:absolute;top:25px;width:14px;height:14px;border-radius:50%}
.w-skel{position:absolute;left:104px;top:24px;height:16px;border-radius:8px;background:rgba(230,237,248,.22)}
.w-skel.tag{left:auto;right:22px;top:20px;width:64px;height:24px;border-radius:9px;background:rgba(60,120,255,.28)}
.w-frame{position:absolute;overflow:hidden;border:2px solid rgba(130,180,255,.65);box-shadow:0 0 18px rgba(80,140,255,.35)}
.w-text{position:absolute;inset:0}
.w-row{position:absolute;white-space:nowrap}
/* final 2026-11-18 (Friend: "subtitle ภาษาไทยปัจจุบันเป็นเหมือนรูปที่แนบไปรูปที่ 1 แต่ผมอยากให้มันเป็นเหมือนรูปที่แนบไปรูปที่ 2" · "ข"):
   the key word hollow with a blue outline (was white in a blue pill); over the speaker (.w-vid) the hollow letters get a faint dark
   fill so they read over the room · the lead white in Sriracha (Friend: "ส่วนตัวอักษรสีขาวอยากให้ใช้ฟอนต์นี้ครับ", was Kanit 500) */
.w-lead{font-family:"WinLead";font-weight:400;font-size:74px;line-height:1.2;color:#F4F7FC;text-shadow:0 0 3px rgba(0,0,0,.85),0 0 10px rgba(0,0,0,.6),0 3px 18px rgba(0,0,0,.5)}
.w-key{display:inline-block;font-family:"WinKey";font-weight:800;font-size:112px;line-height:1.16;color:transparent;-webkit-text-stroke:3.5px #6FA6FF;
  filter:drop-shadow(0 0 10px rgba(80,140,255,.45))}
.w-vid .w-key{color:rgba(4,12,32,.5);filter:drop-shadow(0 0 3px rgba(0,0,0,.7)) drop-shadow(0 0 12px rgba(60,120,255,.45))}
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
  setup() {
    /* NO FLOOR ON THE DRAWING (Friend 2026-11-20: "E ครับ" · "คุณลืมไปแล้วหรอว่าผมจะทำ motion graphic ใหม่ตามขนาดทั้ง 7" · LESSONS 76 ·
       common.md 4.1 rule 8): a screen fits when its window reaches 65 % of a standard size (winShape), whatever the old drawing inside
       fills. The floor that measured the drawing is off on this style's pages (cpFitSize still reads it) */
    CP.speakerFloor = 0;
    BGL.style.background = '#000'; HOOKS.push(cpInsetHook);
    /* load this style's fonts at once: the words are fitted to the safe zone on the first frame (hud 2026-11-18: fitted with the fallback font) */
    [['WinKey', 800, 'normal'], ['WinLead', 400, 'normal']].forEach(([f, w, st]) => div(`left:-9999px;top:0;font-family:${f};font-weight:${w};font-style:${st}`, document.body, 'กขคฅ ึ่้ 0123 Ab'));
    /* no chapter bar and no small label (Friend 2026-11-18: "ลบที่ผมวงกลมสีแดงออกด้วยครับทุกฉากเลย") */
  },

  /* FIT PICK (Friend 2026-11-18: "motion graphic ที่ระบบจะสุ่มเลือกมาต้องเหมาะสมกับพื้นที่ว่างที่มีอยู่" → every style: "ข"): the pictures' real shapes
     (tools/real_shapes.js, a second build) and how much of the screen a shape can take here (tools/fit_pick.js), as the neon style */
  realShapes: true,
  /* how much of the screen a drawing of shape `ar` takes here, to CHOOSE THE DRAWING (tools/fit_pick.js) — never to choose a screen:
     the mean over every screen this face leaves room for (keep 0 · no floor, 2026-11-20) */
  fitSize(ar, t0, t1) { const face = cpFaceBox(t0, t1); return cpFitSize(ar, WIN.pool.filter(n => winFit(n, face)), n => { const F = winFit(n, face); return F ? winInner(F.win) : null; }, 0, n => !!WIN.layouts[n].speaker); },
  /* THE HOOK CHECK (tools/fit_pick.js · Friend 2026-11-20: "1. ก"): is there a screen that shows the speaker (winShows: ก, or a blue screen
     with the face in a frame) whose window reaches a standard size for this face? The drawing inside is not measured (rule 8), nor its
     shape `ar`. false → the plan is made again without the hook (clip_plan.py) */
  hookOK(ar, t0, t1) { const face = cpFaceBox(t0, t1);
    return WIN.pool.some(n => winShows(n) && !!winFit(n, face)); },
  fitSurface() { const r = div('', SC); r.className = 'w-root w-screen'; return r; },

  frame(t0, t1, {index, scene}) {
    const meta = SCENES[scene]?.meta ?? {}, face = cpFaceBox(t0, t1);
    let name = meta.layout;
    if (!name) {
      const want = WIN.byCat[String(meta.cat ?? '').slice(0, 3)];
      /* THE HOOK (Friend 2026-11-19: "ใส่ระบบ hook ให้สไตล์นี้" · as lime: "ต้องไม่ใช่ฉากเต็มจอ ต้องเป็นฉากหน้าคนพูด"): the plan's first picture at
         1.8–3.2 s (RUN.hook, tools/clip_plan.py) takes a speaker screen (ก); no ก fits this face (a close-up clip) → a blue screen with the
         face in a frame (winShows); neither → the usual pool. A clip where a ก fits keeps exactly the old choice. */
      const hook = index === 0 && typeof RUN !== 'undefined' && RUN.hook, spk = n => !!WIN.layouts[n].speaker;
      if (want && (!hook || spk(want)) && winFit(want, face)) name = want;
      else {
        let pool = WIN.pool.filter(n => n !== WIN.last && winFit(n, face));
        if (hook) { const a = pool.filter(spk), b = pool.filter(winShows); if (a.length) pool = a; else if (b.length) pool = b; }
        if (!pool.length) pool = ['dark', 'float', 'stack'].filter(n => n !== WIN.last);
        /* NO SCREEN IS CHOSEN BY THE SIZE OF THE DRAWING INSIDE IT (common.md 4.1 rule 8 · Friend 2026-11-20: "เรายังคัดจากขนาดภาพข้างในอยู่
           อีกหรอ" · "ต่อไปนี้จะเลิกวัดขนาดภาพ ... จะดูขนาดมาตรฐานทั้ง 7 แบบที่เรากำหนดไว้แทน" · LESSONS 76): a screen is kept when its WINDOW
           reaches 65 % of a standard size here (winFit → winShape, above) — nothing else. Until 2026-11-20 the pool was also narrowed by how
           big the old drawing came out in each window (cpSizeKeep .75), which kept the screens with the face in a frame (float, stats) off. */
        pool = winBalance(pool, n => !!WIN.layouts[n].speaker, index, WIN.speakerShare);   // ก (the speaker) 60 : ข (a graphic screen) 40 (Friend 2026-11-20: "E ครับ")
        /* a speaker screen: the window over the head or under it as often ("เพื่อความหลากหลาย"); the less used place, a tie by the run's seed */
        const tp = pool.filter(n => WIN.layouts[n].top), lw = pool.filter(n => WIN.layouts[n].speaker && !WIN.layouts[n].top);
        if (tp.length && lw.length) { const P = WIN.place, up = P.top !== P.low ? P.top < P.low : cpRand('place' + index) < .5; pool = up ? tp : lw; }
        const least = Math.min(...pool.map(n => WIN.used[n] ?? 0)); pool = pool.filter(n => (WIN.used[n] ?? 0) === least);
        name = pool[Math.floor(cpRand('screen' + index) * pool.length)];
      }
    }
    WIN.used[name] = (WIN.used[name] ?? 0) + 1; WIN.last = name;
    if (WIN.layouts[name].speaker) WIN.place[WIN.layouts[name].top ? 'top' : 'low']++;
    /* the standard size: a blue screen from its sheet room (dark: 5 or 6 by the run's seed) · a speaker screen from this face (winFit) · a
       test's forced speaker screen from its sheet room · no size reaches 65 % → the sheet's window */
    const raw = WIN.layouts[name], copy = o => JSON.parse(JSON.stringify(o));
    const L = raw.screen ? winShape(copy(raw), name, 'size' + index) ?? copy(raw)
      : meta.layout ? winShape(copy(raw), name) ?? copy(raw)
      : winFit(name, face) ?? winShape(copy(WIN.layouts.dark), 'dark', 'size' + index);
    const root = div('', SC); root.className = 'w-root' + (L.screen ? ' w-screen' : '');
    const box = ([x, y, w, h], parent = root) => div(`left:${x}px;top:${y}px;width:${w}px;height:${h}px`, parent);
    if (L.screen) {
      const D = WIN.decor, long = Math.max(1, t1 - t0);
      D.forEach(({cx, cy, r, chips, light, dir}, j) => {
        const R = r + 20, sz = [cx - R, cy - R, 2 * R, 2 * R], spin = dir * WIN.spin * (long + .4), rad = a => a * Math.PI / 180;   // over the whole animation, so the rate is exactly WIN.spin a second
        /* the angle is read off the clip's clock (dir × spin × t), so two screens in a row carry one unbroken turn */
        const a0 = dir * WIN.spin * (t0 - .05);
        const turn = (el, deg, from = a0) => A(el, [{transform: `rotate(${from}deg)`}, {transform: `rotate(${from + deg}deg)`}], t0 - .05, long + .4);
        /* one line (Friend: "อยากให้มันเป็นเส้นเดียว"), its running light and its chips; the shape: WIN.ring */
        const g = box(sz); g.className = 'w-arc';
        g.innerHTML = `<svg width="${2 * R}" height="${2 * R}"><path class="w-main" d="${winRingPath(WIN.ring, R, r)}" fill="none" stroke="#4F86C4" stroke-width="3.5" stroke-linejoin="round"/>`
          + `<path class="w-light" d="${winRingPath(WIN.ring, R, r)}" fill="none" stroke="#EAF2FF" stroke-width="4" stroke-linecap="round"/></svg>`;
        const line = g.querySelector('.w-main'), lit = g.querySelector('.w-light'), len = line.getTotalLength(), arc = 64;
        const at = ang => { let best = 0, d = 1e9; for (let k = 0; k < 360; k++) { const p = line.getPointAtLength(len * k / 360);   // where the ray at this angle meets the line
          const e = Math.abs(((Math.atan2(p.y - R, p.x - R) * 180 / Math.PI - ang) % 360 + 540) % 360 - 180); if (e < d) { d = e; best = len * k / 360; } } return best; };
        lit.setAttribute('stroke-dasharray', `${arc} ${len}`); lit.setAttribute('stroke-dashoffset', `${-(at(light) - arc / 2)}`);
        if (WIN.ring === 'split') {               /* the circle broken where its chips sit: the chips join the arcs */
          const gap = 64, cut = chips.map(at).sort((a, b) => a - b);
          const runs = cut.map((c, k) => [c + gap, (k + 1 < cut.length ? cut[k + 1] : cut[0] + len) - gap]);
          line.setAttribute('stroke-dasharray', runs.map(([s0, s1], k) => `${s1 - s0} ${(k + 1 < runs.length ? runs[k + 1][0] : runs[0][0] + len) - s1}`).join(' '));
          line.setAttribute('stroke-dashoffset', `${-runs[0][0]}`); }
        turn(g, spin);
        chips.forEach((ang, k) => { const p = line.getPointAtLength(at(ang)), c = div(`left:${p.x - 27}px;top:${p.y - 27}px`, g); c.className = 'w-chip';
          turn(c, -spin, -a0);                                                // stays upright while its ring turns
          A(c, [{opacity: 1}, {opacity: .6}, {opacity: 1}], t0 + (2 * j + k) * .55, 2.6, {e: 'ease-in-out', it: 4}); });
      });
      A(root, [{opacity: 0, filter: 'blur(14px)', transform: 'scale(1.03)'}, {opacity: 1, filter: 'blur(0)', transform: 'none'}], t0 - .04, .35, {e: EASE.smooth});
      /* SCREEN TO SCREEN (Friend 2026-11-20, clip 2 at 56–57 s: "จังหวะเปลี่ยนฉากมันสลับมาเป็นหน้าผมประมาณเสี้ยววินาทีนึงอะ"): when the
         picture before was a blue screen ending right here, it stays fully on under this one until this one is in (its own fade-out
         ran from its end − .3 s and let the speaker's video show between the two); after that its fade-out's end state (hidden) holds */
      const prev = CLIPWINS[CLIPWINS.length - 1];
      if (prev && prev.F.L?.screen && prev.F.root && Math.abs(prev.t1 - t0) < .05)
        A(prev.F.root, [{opacity: 1, filter: 'blur(0)'}, {opacity: 1, filter: 'blur(0)'}], prev.t1 - .3, t0 + .4 - (prev.t1 - .3), {f: 'none'});
      sfx('whoosh', t0 - .1, -20);
    }
    if (L.frame) { const [x, y, w, h, r] = L.frame, f = box([x, y, w, h]); f.className = 'w-frame cp-frame'; f.style.borderRadius = r + 'px';
      cpInset(f, w - 4, h - 4, t0, ...(L.inset ?? [.42, .4]));   // stack: its own face size in a wide frame
      A(f, [{opacity: 0, transform: 'translateY(-30px)'}, {opacity: 1, transform: 'none'}], t0 + .05, .45, {e: EASE.soft}); }
    A(root, [{opacity: 1, filter: 'blur(0)'}, {opacity: 0, filter: 'blur(10px)'}], t1 - .3, .3, {e: EASE.out, f: 'forwards'});
    /* the windows: three dots, then a skeleton title bar (Friend 2026-11-18: "แบบ skeleton ... ไม่มีข้อความแต่มีเหมือนเป็นแบบช่องๆเหลี่ยมๆมนๆ"):
       a faint rounded bar where the title was (its length from the run's seed) and an empty blue pill where the tag was; each picture
       lives inside its window */
    const makeWin = (c, k, tag = true) => { const w = box(c); w.className = 'w-win'; if (L.std && c === L.win) w.dataset.std = L.std[0] + ':' + L.std[1].toFixed(3);   // tools/card_sizes.js
      const bar = div('', w); bar.className = 'w-bar';
      ['#FF5F57', '#FEBC2E', '#28C840'].forEach((col, i) => { const d = div(`left:${26 + i * 24}px;background:${col}`, bar); d.className = 'w-dot'; });
      div(`width:${Math.round(Math.min(c[2] * .34, 110 + 90 * cpRand('bar' + index + k)))}px`, bar).className = 'w-skel';
      if (tag) div('', bar).className = 'w-skel tag';
      A(w, [{opacity: 0, transform: 'translateY(40px) scale(.95)', filter: 'blur(10px)'}, {opacity: 1, transform: 'none', filter: 'blur(0)'}], t0 + .04 + .12 * k, .45, {e: EASE.soft});
      return box(winInner(c), w); };
    const cat = String(meta.cat ?? '').slice(0, 3);
    const stage = L.win ? makeWin(L.win, 0) : box([0, 0, 1, 1]);
    const stages = L.wins ? L.wins.map((c, k) => makeWin(c, k, false)) : null;
    /* final 2026-11-18 point 4 (Friend: "ฉากไหนที่มี background และ motion graphic แต่ไม่มีหน้าผม motion graphic ต้องอยู่กึ่งกลาง" ·
       "ข. แต่ระวังอย่าให้การ์ดกับซับไตเติ้ลติดกันมากเกินไป"): on a screen without the face the picture's end drawing sits in the middle
       of its window (glow/bridge.js glowFit with a room: the view widens evenly round what is drawn, instead of round the motion, which
       left the drawing at the window's bottom); its motion may use the window's own padding · then (Friend: "ที่ผมต้องการคือให้การ์ดไปอยู่
       ตรงกลางของจอเลยและเอา subtitle ขึ้นไปอีกเว้นระยะห่างระหว่างการ์ดเท่าเดิม"): the window (recap: its four) in the middle of the
       screen (centre y 960), the words 90 px over it (the key word's row ends 65 px under its centre) */
    const room = L.screen && !L.frame ? {l: 22, t: 8, r: 22, b: 22} : null;
    return {root, stage, stages, cam: root, L, name, cat, dark: !!L.screen, room};
  },
  /* between pictures: the words at the chest, moved below the chin when the face is low */
  speakerFrame(a, b) {
    const root = div('', SC); root.className = 'w-root';
    return {root, cam: root, speaker: true, L: winFit('talk', cpFaceBox(a, b)) ?? WIN.layouts.talk, name: 'talk'};
  },
  /* the lead fades in out of a blur; the hollow key word pops in on its word */
  text(F, T, lead, key) {
    const L = F.L ?? WIN.layouts.talk, el = div('', F.root ?? SC); el.className = 'w-text' + (F.speaker || L.speaker ? ' w-vid' : '');
    if (lead && L.lead) { const r = cpLine(el, lead, 'w-lead', L.lead, undefined, 'w-row'); A(r, [{opacity: 0, filter: 'blur(8px)'}, {opacity: 1, filter: 'blur(0)'}], T.t0 + .15, .35, {e: EASE.smooth}); }
    if (key && L.key) {
      const r = cpLine(el, key, 'w-key', L.key, undefined, 'w-row');
      A(r, [{opacity: 0, transform: 'scale(.82)'}, {opacity: 1, transform: 'scale(1.04)', offset: .7}, {opacity: 1, transform: 'none'}], T.hit - .05, .4, {e: EASE.soft});
      sfx('softswish', T.hit - .05, -21);
    }
    if (F.speaker && T.clip) {
      A(el, [{visibility: 'hidden'}, {visibility: 'visible'}], T.b[0] - .02, .001); A(el, [{visibility: 'visible'}, {visibility: 'hidden'}], T.end - .021, .001, {f: 'forwards'});
      return null;
    }
    return el;
  },
});
