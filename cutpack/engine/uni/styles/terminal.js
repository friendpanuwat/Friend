/* =====================================================================
   STYLE · terminal — "เทอร์มินัลแดง" (Red Terminal) (Friend 2026-11-18, the 9th of the new sheets: "สไตล์ต่อไป", the 12 shots full
   size). Every place, size and colour is measured on those 1080 × 1920 shots, then held to the rules every style shares
   (styles/common.js: safe zone, frames below the search bar, centred words, the video filling its frame, seeded random, never over
   the face). The pictures: the glow-line template set first, white lines glowing, the lit part red (GLASSY.terminal).
   EVERY SCREEN SHOWS ONE OF FRIEND'S MOTION GRAPHICS (2026-11-27 Friend: "มันไม่ใช่ motion graphic ของเรานิ" → "เอา 6 จอนี้ออกจากรายการที่ระบบสุ่ม ... แก้ตามนี้" · "ลบเลยผมไม่กลับไปใช้แล้ว ผมจะใช้ motion graphic ของผมเท่านั้น"): the 6 screens of the sheet
   without a picture (a terminal of rows 01, a notification 03, a terminal log 06, a dialog 08, a number card 10, the call to action 12)
   are gone, code and all, and the recap of three windows (shot 11, a still with a terminal of subtitles) (2026-11-27 Friend: "ลบ"). The white pill = the subtitles
   (one phrase at a time).
   The 7-item form:
   1 frame    one of 5 screens in clips (TRM.pool, named after Friend's shots): the speaker full screen with a window at the hands (02),
              the speaker's window over a picture's window (04), three windows stacked (05), the speaker's 60 % fading up under a
              picture's window (07), one big window (09); between pictures the speaker with the pill
   2 surface  near-black with a dim red glow; app windows near-black, rounded 28, a title bar with three dots and a thin line
   3 drawing  the glow-line pictures: thick white glowing lines, dark bodies, the lit part a red outline, icon and word
   4 colours  near-black · white · one red (#EE4444)
   5 words    the pill (white, Kanit 600 48, black words)
   6 motion   screens fade in out of a blur, windows rise, the picture rises in its window, each phrase of the pill comes in when said
   7 sound    whoosh on a screen cut, a soft swish on the key word
   ===================================================================== */
const TRM = {
  /* boxes [x, y, w, h] · pill {y (centre)} · wins = app windows [x, y, w, h] (the first is the one with words; back = empty ones
     behind it) · pic = the picture box · face = the speaker's window [x, y, w, h] (its video under a title bar) · half = the video
     half of a split screen · menu = the menu bar (off).
     Moved where Friend's shots ran under TikTok's search bar (the pill at y 194–266 kept from 196; the speaker's windows from 140 → 220)
     and buttons (the windows themselves stay as wide as the sheet, behind the buttons). */
  layouts: {
    talk:       {speaker: true, pill: {y: 1440}},   // (2026-11-26, Friend: "มันอยู่กลางจอมันไม่ค่อยดี อยากให้ลงมาครึ่งของครึ่งข้างล่าง": 1006 → 1440, half of the lower half)                                                                                          // between pictures (shot 03's pill at the chest)
    hero_chev:  {speaker: true, fit: 1150, pill: {y: 232}, wins: [[80, 1190, 920, 430]], pic: [200, 1290, 680, 300]},                     // shot 02
    win_speaker:{screen: true, menu: true, face: [150, 220, 780, 830],   /* (the sheet's 90–990: its video ran to 976, under the buttons) */ pill: {y: 1150}, wins: [[140, 1240, 800, 420]], pic: [280, 1330, 520, 300]},   // shot 04
    stack3:     {screen: true, menu: true, pill: {y: 232}, back: [[60, 300, 800, 1000], [120, 410, 800, 1000]], wins: [[180, 520, 820, 1140]], pic: [230, 650, 690, 920]},   // shot 05
    split_top:  {screen: true, menu: true, pill: {y: 232}, wins: [[60, 310, 960, 570]], pic: [170, 410, 740, 420], half: [0, 768, 1080, 1152, .34, .42], line: 768},   // (2026-11-27 Friend: "ฉากนี้ผมไม่อยากให้แบ่ง 50:50 ผมอยากให้ 40:60 (คลิปคน60)": the speaker's half from y 962 → 768)   // shot 07
    big_win:    {screen: true, menu: true, pill: {y: 232}, wins: [[43, 300, 994, 1360]], pic: [130, 470, 790, 1100]},                      // shot 09
  },
  /* RANDOM, as the other styles: every picture takes one of `pool` (never the one before it) where the face leaves room (trmFit), the
     speaker (ก) and a graphic screen (ข) as often, then the least used, then at random from the run's seed */
  pool: ['hero_chev', 'win_speaker', 'stack3', 'split_top', 'big_win'],   // only screens with a picture (2026-11-27 Friend: "มันไม่ใช่ motion graphic ของเรานิ" → "เอา 6 จอนี้ออกจากรายการที่ระบบสุ่ม ... แก้ตามนี้" · "ลบเลยผมไม่กลับไปใช้แล้ว ผมจะใช้ motion graphic ของผมเท่านั้น")
  used: {}, last: null,
};
/* THE 7 STANDARD SIZES (style-rules/common.md 4.1 · Friend 2026-11-26: "เอาสไตล์เทอร์มินอลแดงมาทำ เริ่มที่ใส่ระบบ hook ใส่ระบบ motion graphic 7 ขนาด
   (เหมือนทั้ง 3 สไตล์ที่ผ่านมา) และใช้ template ชุดฐาน 7 ขนาด"): as the app-window style, the WINDOW that holds the picture (its title bar included)
   is the standard size scaled from the corner, 65–100 %, its shape exact; the picture inside it under its three dots (trmInner). Each picture
   screen has its room and its order of sizes (TRM_ORDER); the first size that reaches 65 % in the room; none = null (a speaker screen: not
   this screen · a dark screen keeps its sheet window). big_win: 5 or 6 at random 60 : 40, as lime's and the window style's big screen. Inside
   60–920 (TikTok's buttons start at 936), as lime and window. Never by the drawing's shape (common.md 4.1 rules 4 and 8). */
const TRM_STD = {1: [860, 230], 2: [860, 470], 3: [560, 490], 4: [400, 635], 5: [860, 710], 6: [860, 965], 7: [400, 500]};
const TRM_MIN = .65;
const TRM_LOW = 1580, TRM_PILL_GAP = 66, TRM_PILL_MAX = 1616;   // TRM_LOW 1440 → 1580 (2026-11-27 Friend on shot 02: "subtitles กับกรอบ motion graphics มันอยู่สูงเกินไป เหลือพื้นที่ด้านล่างเยอะ อยากให้เอาลงมาอีก") · TRM_PILL_MAX: the lowest pill centre (its foot 36 under it, inside the safe zone's 1660) · the low pill of a speaker screen with a window at the hands (0 = the pill on top, as before 2026-11-26) · the window ends this far over the pill's centre
const TRM_ROOM = {l: 20, t: 8, r: 20, b: 20};   // the window's padding round its picture (trmInner) the motion may use: glowFit's room (centre 'end' needs one, as the window style's)
/* TRANSITIONS (2026-11-27 Friend: "ทรานซิชั่นที่เป็นฉากผมอยากทำให้มันดูเป็นมืออาชีพแล้วก็ smooth กว่านี้หน่อยอันนี้มันตัดๆแบบกระตุกๆแบบแปลกๆอ่ะ" → "ค": a plain fade, no blur): every screen comes in as one piece (its windows and its picture with it, no empty window first) over
   TRM_X s ending on its cut, fast then settling; it goes out over the TRM_X s before its end, slow then fast, so two screens in a row
   cross with almost nothing of the video between them; no blur, no scale; the pill changes in TRM_PX s */
const TRM_X = .25, TRM_PX = .12, TRM_IN = 'cubic-bezier(.25,.6,.4,1)', TRM_OUT = 'cubic-bezier(.6,0,.75,.4)';
const TRM_MENU = false;   // the dark screens' menu bar (off since 2026-11-26)
const TRM_FADE = [120, 240];   // split_top's fade: the video starts 120 above its old line, fades in over 240 px
const TRM_ORDER = {hero_chev: [2, 1], win_speaker: [2, 1], split_top: [2, 1], stack3: [6, 5]};
/* NO TITLE BAR (2026-11-27 Friend: "ลบแถบออกเหลือไว้แค่จุด 3 สีก็พอ แค่นี้ก็ได้พื้นที่คืนมาแล้ว"): a window keeps only its three dots (top 23–41); the picture starts TRM_HEAD under the window's top
   (was 84, under a 72-high bar and its line): a size-1 window at 65 % now holds a picture 78 high, not 42 */
const TRM_HEAD = 48;
const trmInner = ([x, y, w, h]) => [x + 24, y + TRM_HEAD, w - 48, h - TRM_HEAD - 24];   // the picture inside a window (under its three dots)
/* where the top of the speaker's head lands in split_top's half (as cpInset places the video with TRM_FADE: the face box's top less a quarter of
   its height for the hair) */
function trmHalfHead(L, t, face) {
  const [, y0, w, h0, k, fy] = L.half, up = TRM_FADE[0], y = y0 - up, h = h0 + up, f = cpFace(t);
  const s = Math.max(w / 1080, h / 1920, k * w / (f.w || 320)), top = Math.min(0, Math.max(h - 1920 * s, h * ((up + h0 * fy) / h) - f.y * s));
  return y + top + (face[1] - .25 * (face[3] - face[1])) * s;
}
function trmShape(L, name, key) {
  if (!L.pic || !L.wins) return L;
  let order = TRM_ORDER[name] ?? [2], X0 = 60, X1 = 920, Y0 = L.wins[0][1], Y1 = 1660, mid = false;
  if (name === 'big_win') { const first = key != null && cpRand(key) >= .6 ? 6 : 5; order = [first, 11 - first]; Y0 = 300; mid = true; }
  if (name === 'split_top') { Y0 = 260; Y1 = L.line - 40; mid = true; }     // over the speaker's 60 %, 40 clear of its line (from 260: the pill goes under the window; with the pill on top, frame() gives a room from 300)
  if (L.room) { [Y0, Y1] = L.room; }                                        // a window at the hands under the low pill (trmFit): on the pill's side
  if (name === 'stack3') X0 = 180;                                          // the front window right of the two behind it
  for (const k of order) {
    const [W, H] = TRM_STD[k], s = Math.min(1, (X1 - X0) / W, (Y1 - Y0) / H); if (s < TRM_MIN) continue;
    const cw = Math.round(W * s), ch = Math.round(H * s);
    const x = name === 'stack3' ? X1 - cw : Math.round(Math.min(Math.max(540 - cw / 2, X0), X1 - cw)), y = mid ? Math.round(Y0 + (Y1 - Y0 - ch) / 2) : L.room ? Y1 - ch : Y0;
    L.wins[0] = [x, y, cw, ch]; L.pic = trmInner(L.wins[0]); L.std = [k, s];
    if (L.back) L.back = [[x - 120, y - 220, cw, ch], [x - 60, y - 110, cw, ch]];   // the two empty windows behind, as the sheet's steps
    return L;
  }
  return null;
}
/* fit a speaker screen to this face [x0, top, x1, chin]: the windows at the hands move down so their top is 30 under the chin (at
   most to 1660); the top pill moves under the chin when the forehead is higher than it; null = no room. Screens: always fit. */
function trmFit(name, f) {
  const L = JSON.parse(JSON.stringify(TRM.layouts[name])); if (!L.speaker) return trmShape(L, name) ?? L;   // (a dark screen always fits: its standard window, big_win at size 5 for estimates)
  const [, top, , chin] = f;
  /* a window at the hands (shots 02 06 08 10): the pill low (TRM_LOW, or 66 under the chin down to TRM_PILL_MAX), as every
     screen of the speaker alone (2026-11-26 Friend: "ถ้าเป็นฉากที่เป็นคลิปคนเต็มๆเลยอ่ะซับก็ควรจะอยู่ครึ่งของครึ่งล่างนะ เสมอเลย แต่ทั้งนี้ทั้งนั้นก็ต้องดูตาม scenario ทั้ง 3 ไป",
     then "ก"): the window between the chin (30 under it) and the pill (TRM_PILL_GAP over it), on the pill's side; a picture's window a
     standard size in that room; no room (a close shot) = null */
  if (TRM_LOW && L.wins && L.pic && L.pill.y < 600) {
    const P = Math.max(TRM_LOW, chin + 66); if (P > TRM_PILL_MAX) return null; L.pill.y = P;
    L.room = [chin + 30, P - TRM_PILL_GAP]; return trmShape(L, name); }
  if (L.pill.y < 600 && top < L.pill.y + 60) return null;                    // (the pill on top would sit on the face)
  if (L.wins) { const w = L.wins[0], d = Math.max(0, chin + 30 - w[1]); if (w[1] + d + w[3] > 1660) return null;
    w[1] += d; if (L.pic) L.pic[1] += d; }
  else if (L.pill.y > 600) { const d = Math.max(0, chin + 66 - L.pill.y); if (L.pill.y + d > TRM_PILL_MAX) return null; L.pill.y += d; }
  return trmShape(L, name);                                                 // a picture's window: a standard size in the room under the chin
}
/* one line of words at (x, y) left / centre, shrunk (never wrapped) to maxW and the safe zone (a .cp-row: checked) */
function trmLine(parent, txt, cls, {x, y, align = 'center', maxW = 820}) {
  const row = div('', parent); row.className = 'm-row cp-row'; const sp = document.createElement('span'); sp.className = cls; row.appendChild(sp);
  for (const part of String(txt).split(/([A-Za-z][A-Za-z.'’-]*)/)) { if (!part) continue; if (/^[A-Za-z]/.test(part)) { const i = document.createElement('i'); i.textContent = part; sp.appendChild(i); } else sp.appendChild(document.createTextNode(part)); }
  Object.assign(row.style, {left: `${x}px`, top: `${y}px`, translate: align === 'left' ? '0 -50%' : '-50% -50%', transformOrigin: align === 'left' ? '0 50%' : '50% 50%'});
  const x1 = y + 50 < CP.safeTop.y ? CP.safeTop.x1 : CP.safe[2], room = align === 'left' ? x1 - x : 2 * Math.min(x - CP.safe[0], x1 - x);
  FITS.push(() => { const w = sp.offsetWidth, m = Math.min(maxW, room); if (w > m) row.style.scale = String(m / w); });
  return row;
}

STYLE('terminal', {
  name: 'เทอร์มินัลแดง',
  layouts: TRM.layouts,
  css: `
@font-face{font-family:"TrmText";src:url(fonts/Kanit-400-thai.woff);font-weight:400;unicode-range:U+02D7,U+0303,U+0331,U+0E01-0E5B,U+200C-200D,U+25CC}
@font-face{font-family:"TrmText";src:url(fonts/Kanit-400-latin.woff);font-weight:400;unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+2000-206F}
@font-face{font-family:"TrmBold";src:url(fonts/Kanit-600-thai.woff);font-weight:600;unicode-range:U+02D7,U+0303,U+0331,U+0E01-0E5B,U+200C-200D,U+25CC}
@font-face{font-family:"TrmBold";src:url(fonts/Kanit-600-latin.woff);font-weight:600;unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+2000-206F}
.m-root{position:absolute;inset:0;--ink:#F6F6F8;--ac:#EE4444;--lw:5;--sd:#F6F6F8;--fl:rgba(16,16,18,.85);--text:#F6F6F8}
.m-screen{background:radial-gradient(ellipse 720px 820px at 540px 1250px,rgba(150,28,40,.24) 0%,rgba(110,22,34,.12) 50%,rgba(0,0,0,0) 100%),
  linear-gradient(180deg,#141014 0%,#161116 40%,#1b1419 100%);background-color:#161116;overflow:hidden}
.m-menu{position:absolute;left:0;top:0;width:1080px;height:52px;background:#1D1C22}
.m-sk{position:absolute;height:12px;border-radius:6px;background:rgba(210,208,220,.32)}
.m-win{position:absolute;border-radius:28px;background:#111113;box-shadow:0 30px 70px rgba(0,0,0,.55),0 0 0 1px rgba(255,255,255,.035)}
.m-win.m-float{background:rgba(16,16,18,.86)}
.m-win.m-back{background:#101012;box-shadow:0 20px 50px rgba(0,0,0,.6),0 0 0 1px rgba(255,255,255,.03)}
.m-dot{position:absolute;top:23px;width:18px;height:18px;border-radius:50%}
.m-face{position:absolute;overflow:hidden;border-radius:22px}
.m-half{position:absolute;overflow:hidden}
.m-text{position:absolute;inset:0}
.m-row{position:absolute;white-space:nowrap}
.m-row i{font-style:normal}
.m-pill{display:inline-block;background:#FFFFFF;border-radius:36px;padding:3px 26px 7px;font-family:"TrmBold";font-weight:600;font-size:48px;line-height:1.3;color:#111113;box-shadow:0 6px 24px rgba(0,0,0,.35)}
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
  setup() { BGL.style.background = '#000'; HOOKS.push(cpInsetHook); CP.speakerFloor = 0; },   // (no floor on the drawing's size: the window's standard size decides, as lime · 2026-11-26)

  /* FIT PICK (Friend 2026-11-18: "motion graphic ที่ระบบจะสุ่มเลือกมาต้องเหมาะสมกับพื้นที่ว่างที่มีอยู่" → every style: "ข"): the pictures' real shapes
     (tools/real_shapes.js, a second build) and how much of the screen a shape can take here (tools/fit_pick.js), as the neon style */
  /* (realShapes and the keep on the drawing's size: gone 2026-11-26, as lime, window and neon · common.md 4.1 rule 8) */
  fitSize(ar, t0, t1) { const face = cpFaceBox(t0, t1); return cpFitSize(ar, TRM.pool.filter(n => trmFit(n, face)), n => trmFit(n, face)?.pic, 0, n => !!TRM.layouts[n].speaker); },
  fitSurface() { const r = div('', SC); r.className = 'm-root m-screen'; return r; },

  frame(t0, t1, {index, scene}) {
    const meta = SCENES[scene]?.meta ?? {}, face = cpFaceBox(t0, t1);
    let name = meta.layout;
    if (!name) {
      const ok = n => !!trmFit(n, face);
      /* THE HOOK (2026-11-26, as lime.md 5 · window.md 5.4 · neon.md 6): the clip's first picture (RUN.hook, tools/clip_plan.py: the speaker
         alone, then the first picture at 1.8–3.2 s) takes the speaker's screen with a picture (hero_chev); when the face leaves it no room (a
         close-up), a dark screen that shows the speaker (win_speaker: the face in a window · split_top: the speaker's half) */
      const hook = index === 0 && typeof RUN !== 'undefined' && RUN.hook, spkPic = n => !!TRM.layouts[n].speaker, shows = n => !!(TRM.layouts[n].face || TRM.layouts[n].half);
      {
        let pool = TRM.pool.filter(n => n !== TRM.last && ok(n));
        if (hook) { const a = pool.filter(spkPic), b = pool.filter(shows); pool = a.length ? a : b.length ? b : pool; }
        if (!pool.length) pool = ['big_win', 'stack3', 'split_top'].filter(n => n !== TRM.last);
        /* no keep on the drawing's size any more (2026-11-26, common.md 4.1 rule 8: "ต่อไปนี้จะเลิกวัดขนาดภาพ ... จะดูขนาดมาตรฐานทั้ง 7 แบบ"):
           a screen comes up where its window reaches a standard size (trmFit → trmShape) */
        pool = cpBalance(pool, n => !!TRM.layouts[n].speaker, index);   // ก (the speaker full screen) and ข (a graphic screen) as often (Friend 2026-11-18)
        const least = Math.min(...pool.map(n => TRM.used[n] ?? 0)); pool = pool.filter(n => (TRM.used[n] ?? 0) === least);
        name = pool[Math.floor(cpRand('screen' + index) * pool.length)];
      }
    }
    TRM.used[name] = (TRM.used[name] ?? 0) + 1; TRM.last = name;
    const copy = o => JSON.parse(JSON.stringify(o)), raw = TRM.layouts[name];
    const L = (raw.speaker && (!meta.layout || TRM_LOW && raw.wins && raw.pill.y < 600) ? trmFit(name, face) ?? (meta.layout ? copy(raw) : null) : trmShape(copy(raw), name, 'size' + index) ?? copy(raw)) ?? trmShape(copy(TRM.layouts.big_win), 'big_win', 'size' + index);   // the standard size (a dark screen from its room · a speaker screen from this face)
    /* the dark screens that show the speaker: the pill under the window, never over them (2026-11-27 Friend: "ไม่อยากให้ซับมันไปอยู่บนหัวอ่ะ ... อยู่ข้างล่างมันอ่านง่ายกว่าอยู่ข้างบน",
       "เฉพาะฉากที่เห็นคน") · split_top: 60 under the picture's window (over the faded top of the speaker's half) */
    if (name === 'split_top' && L.wins && L.half) {   // the pill 30 over the head (its foot), the window 60 over the pill: a smaller standard size when it must; no room (a close shot: the head fills the half) = the pill stays on top, over the dark screen, not on the hair
      const maxY = trmHalfHead(L, t0, face) - 36 - 30, bot = L.wins[0][1] + L.wins[0][3];
      if (bot + 60 <= maxY) L.pill = {y: bot + 60};
      else { const L2 = trmShape(Object.assign(copy(raw), {room: [260, maxY - 60]}), name); if (L2) { Object.assign(L, L2); L.pill = {y: L.wins[0][1] + L.wins[0][3] + 60}; }
        else { const L3 = trmShape(Object.assign(copy(raw), {room: [300, L.line - 40]}), name); if (L3) Object.assign(L, L3); } } }   // (the pill on top at 232: the window from 300)
    if (name === 'big_win' && L.wins) L.pill = {y: Math.max(232, L.wins[0][1] - 62)};   // the pill just over its window, not at the top of the screen (2026-11-27 Friend: "ฉากนี้อยากให้ subtitles ลงมาอยู่ใกล้กรอบ motion graphics หน่อย")
    const screen = !L.speaker, root = div('', SC); root.className = 'm-root' + (screen ? ' m-screen' : '');
    const box = ([x, y, w, h], parent = root) => div(`left:${x}px;top:${y}px;width:${w}px;height:${h}px`, parent);
    const rise = e => { if (!screen) A(e, [{opacity: 0}, {opacity: 1}], t0 - TRM_X, TRM_X, {e: TRM_IN}); };   // (a dark screen's windows come in with it; over the speaker, they fade in on the cut)
    if (screen) {
      A(root, [{opacity: 0}, {opacity: 1}], t0 - TRM_X, TRM_X, {e: TRM_IN});
      sfx('whoosh', t0 - .1, -20);
    }
    A(root, [{opacity: 1}, {opacity: 0}], t1 - TRM_X, TRM_X, {e: TRM_OUT, f: 'forwards'});
    /* the menu bar: none (2026-11-26 Friend: "ฉากที่เป็นจอสีแดงมันจะมีแถบข้างบนอยู่อ่ะผมอยากให้เอาแถบข้างบนออกด้วยครับ"; TRM_MENU = true draws it again) */
    if (L.menu && TRM_MENU) { const m = box([0, 0, 1080, 52]); m.className = 'm-menu';
      [[40, 86], [146, 34], [200, 34], [254, 44], [318, 70], [956, 84]].forEach(([x, w]) => { const s = div(`left:${x}px;top:20px;width:${w}px`, m); s.className = 'm-sk'; }); }
    /* the speaker's half (shot 07) */
    /* (2026-11-26 Friend: "อยากให้เปลี่ยนจากการแบ่งหน้าจอเป็นการเฟดแทนได้ไหม": no red line; the video starts TRM_FADE[0] higher and
       fades in over its top TRM_FADE[1] px, the face stays where it was) */
    if (L.half) { const [x, y0, w, h0, k, fy] = L.half, [up, fade] = TRM_FADE, y = y0 - up, h = h0 + up, f = box([x, y, w, h]); f.className = 'm-half';
      cpInset(f, w, h, t0, k, (up + h0 * fy) / h);
      f.style.webkitMaskImage = f.style.maskImage = `linear-gradient(180deg,rgba(0,0,0,0) 0px,rgba(0,0,0,.55) ${fade * .5}px,#000 ${fade}px)`;
    }   // (it comes in with its screen)
    /* an app window: its three dots only (no title bar, no line: 2026-11-27) */
    const win = (b, k, cls = '') => { const e = box(b); e.className = 'm-win' + cls; rise(e, k);
      ['#FF5F57', '#FEBC2E', '#28C840'].forEach((c, i) => { const d = div(`left:${27 + 32 * i}px;background:${c}`, e); d.className = 'm-dot'; });
      return e; };   // (no title bar and no line under it: the three dots only)
    (L.back ?? []).forEach((b, k) => win(b, k, ' m-back'));
    if (L.face) { const [x, y, w, h] = L.face, wn = win(L.face, 0), f = box([14, TRM_HEAD, w - 28, h - TRM_HEAD - 14], wn); f.className = 'm-face cp-frame';
      cpInset(f, w - 28, h - TRM_HEAD - 14, t0, .4, .4); }
    (L.wins ?? []).forEach((b, i) => { const e = win(b, i + (L.back?.length ?? 0), L.speaker ? ' m-float' : '');
      if (i === 0 && L.std) { e.dataset.std = L.std[0] + ':' + L.std[1].toFixed(3); L.card = e; } });   // the picture's window = its standard size (tools/card_sizes.js)
    /* the picture(s) */
    /* the picture INSIDE its window (2026-11-26, common.md 4.1 rule 9: the motion graphic stays in its card the whole time, as lime and window):
       the window clips it; glow/bridge.js fits the drawing's whole motion into the box (GLOWLOOK.terminal.motionFit) */
    if (L.card && L.pic) L.card.style.overflow = 'hidden';
    const stage = L.card && L.pic ? box([L.pic[0] - L.wins[0][0], L.pic[1] - L.wins[0][1], L.pic[2], L.pic[3]], L.card) : L.pic ? box(L.pic) : box([540, 960, 1, 1]);
    if (!L.pic) stage.style.visibility = 'hidden';
    else if (!L.card) rise(stage);                                  // (in its window: it comes in with the window)
    /* centre 'end': a drawing whose motion leaves its window keeps its END drawing in the middle of the window, the view widening evenly round it
       until all of the motion fits (as the window style's dark screens · 2026-11-27 Friend: "ฉากจอแบ่งอ่ะทำไม motion graphic มันไม่อยู่กึ่งกลางล่ะมันมากองอยู่ข้างล่างทำไม";
       was 'motion': the whole motion centred, so a drawing with motion above it sat low in its window) */
    const F = {root, stage, cam: root, L, name, dark: screen, t1, n: 0, meta, centre: 'end', room: TRM_ROOM, ...(L.card ? {card: L.card} : {})};
    return F;
  },
  /* between pictures: the pill at the chest, moved below the chin when the face is low */
  speakerFrame(a, b) {
    const root = div('', SC); root.className = 'm-root';
    /* no room under the chin (a very close shot: the chin under about y 1550): the pill as low as the safe zone lets it (TRM_PILL_MAX), never
       over the head (2026-11-27 Friend: "ไม่อยากให้ซับมันไปอยู่บนหัวอ่ะมันอ่านยากผมว่าอยู่ข้างล่างมันอ่านง่ายกว่าอยู่ข้างบน", then "เฉพาะฉากที่เห็นคน"); lime, window and neon keep their words on top there (Friend 2026-11-24: "ก") */
    return {root, cam: root, speaker: true, L: trmFit('talk', cpFaceBox(a, b)) ?? {speaker: true, pill: {y: TRM_PILL_MAX}}, name: 'talk'};
  },
  /* the words: every subtitle is the pill (one phrase at a time) */
  text(F, T, lead, key) {
    const L = F.L ?? TRM.layouts.talk, el = div('', F.root ?? SC); el.className = 'm-text';
    const pill = (t, swap) => {
      if (swap && F.head) A(F.head, [{opacity: 1}, {opacity: 0}], t - TRM_PX / 2, TRM_PX, {f: 'forwards'});
      /* SHORT WORDS (2026-11-26, Friend: "ทำให้คำมันสั้นๆได้ไหมไม่ต้องขึ้นทีละประโยคยาว"): a block of two or more phrases shows them one at a time,
         each phrase in its own pill from when it is said to when the next one is (the block's phrases from the subtitle step, T.parts) */
      const P = T.clip ? (T.parts ?? []).filter(p => String(p[0] ?? '').trim()) : [];
      if (P.length > 1 && L.pill) {
        const a = swap ? t : T.b[0], b = T.end ?? T.t1, at = P.map((p, i) => i ? Math.min(Math.max(p[1], a + .25 * i), b - .1) : a);
        P.forEach((p, i) => { if (i && at[i] <= at[i - 1] + .05) return;
          const r = trmLine(el, String(p[0]).trim(), 'm-pill', {x: 540, y: L.pill.y, maxW: 860}), t0 = i ? at[i] : (swap ? t + .06 : T.t0 + .15);
          A(r, [{opacity: 0}, {opacity: 1}], i ? t0 - TRM_PX / 2 : t0, TRM_PX);
          const nx = at.slice(i + 1).find(v => v > at[i] + .05); if (nx != null) A(r, [{opacity: 1}, {opacity: 0}], nx - TRM_PX / 2, TRM_PX, {f: 'forwards'});   // (the next phrase fades in over it)
          F.head = r; });
        sfx('softswish', T.hit - .05, -21); return; }
      const txt = [lead, key].map(s => String(s ?? '').trim()).filter(Boolean); if (!txt.length || !L.pill) return;
      const r = trmLine(el, txt.join(' '), 'm-pill', {x: 540, y: L.pill.y, maxW: 860}); F.head = r;
      A(r, [{opacity: 0}, {opacity: 1}], swap ? t - TRM_PX / 2 : T.t0 + .15, TRM_PX);
      if (key && lead) { const sp = r.firstChild, all = sp.textContent, cut = all.lastIndexOf(String(key).trim());
        if (cut > 0) { sp.textContent = all.slice(0, cut); const kk = document.createElement('span'); kk.textContent = all.slice(cut); sp.appendChild(kk);
          A(kk, [{color: '#B4B4BA'}, {color: '#111113'}], T.hit - .05, .25, {e: EASE.soft}); } }   // (light grey until said: an empty space in the pill read as a gap)
      sfx('softswish', T.hit - .05, -21); };
    if (F.speaker || !F.L) {
      pill(T.t0);
      if (F.speaker && T.clip) {
        A(el, [{opacity: 0}, {opacity: 1}], T.b[0] - .02 - TRM_PX / 2, TRM_PX); A(el, [{opacity: 1}, {opacity: 0}], T.end - TRM_PX / 2, TRM_PX, {f: 'forwards'});
        return null;
      }
      return el;
    }
    const words = [lead, key].map(s => String(s ?? '').trim()).filter(Boolean).join(' ');
    if (!words) return null;
    const n = F.n++, start = T.b[0] - .02;
    if (n === 0) pill(T.t0); else pill(start, true);
    if (T.clip) { A(el, [{opacity: 0}, {opacity: 1}], start - TRM_PX / 2, TRM_PX); return null; }
    return el;
  },
});
