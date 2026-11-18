/* =====================================================================
   STYLE · terminal — "เทอร์มินัลแดง" (Red Terminal) (Friend 2026-11-18, the 9th of the new sheets: "สไตล์ต่อไป", the 12 shots full
   size). Every place, size and colour is measured on those 1080 × 1920 shots, then held to the rules every style shares
   (styles/common.js: safe zone, frames below the search bar, centred words, the video filling its frame, seeded random, never over
   the face). The pictures: the glow-line template set first, white lines glowing, the lit part red (GLASSY.terminal).
   Friend's rules for the new styles: no small spaced labels ("ROUTINE 01", "ALARM · 07:00", "CALENDAR · 09:00"), the words in a card
   are the spoken words. Here: the white pill = the picture's first subtitle; each next subtitle fills the next line of the windows
   (the terminal's "> " line and its "[ ]" rows, the notification, the dialog's title and line, the number card), on screen from the
   start in grey and lit when said ("[ ]" → "[x]"), the way the yellow, HUD and horizon styles passed. What is not spoken is drawn as
   a skeleton, as the app-window style's title bar: the menu bar's words and clock, the dialog's button words, the rows' times.
   The 7-item form:
   1 frame    one of 12 layouts (TRM.layouts, named after Friend's shots): a dark desktop with a menu bar, the pill and an app window
              (a terminal of rows, a picture, three windows stacked, the speaker's window over a dialog); the speaker full screen
              with the pill on top and a window at the hands (a picture, a terminal log, a dialog, a number); a notification; the
              screen split by a red line; a recap of three windows (stills only)
   2 surface  near-black with a dim red glow; app windows near-black, rounded 28, a title bar with three dots and a thin line
   3 drawing  the glow-line pictures: thick white glowing lines, dark bodies, the lit part a red outline, icon and word
   4 colours  near-black · white · one red (#EE4444)
   5 words    the pill (white, Kanit 600 48, black words); in the windows Kanit 400 44 white rows, Kanit 600 54 dialog titles,
              Kanit 900 114 numbers; JetBrains Mono for ">" "[ ]" "[x]"
   6 motion   screens fade in out of a blur, windows rise, rows light on their words ("[x]" red), the pill's key word comes in on its word
   7 sound    whoosh on a screen cut, a soft swish on the key word, a soft tick on a row
   ===================================================================== */
const TRM = {
  /* boxes [x, y, w, h] · pill {y (centre)} · wins = app windows [x, y, w, h] (the first is the one with words; back = empty ones
     behind it) · pic = the picture box · face = the speaker's window [x, y, w, h] (its video under a title bar) · half = the video
     half of a split screen · slots = the lines the next subtitles fill, in order: {k: 'cmd' | 'row' | 'notif' | 'title' | 'sub' |
     'label' | 'value', x, y, align, maxW} · rows = {x, y0, step, n} (the "[ ]" rows of a terminal) · btns = the dialog's skeleton
     buttons · bar = the number card's progress bar · notif = a notification card [x, y, w, h] · menu = the menu bar · noPic = no
     picture on the sheet · need = subtitles after the first it needs. Moved where Friend's shots ran under TikTok's search bar (the
     pill at y 194–266 kept from 196; the notification of shot 03 at y 95 → 220; the speaker's windows from 140 → 220) and buttons
     (the words and the bar end at x 920; the windows themselves stay as wide as the sheet, behind the buttons). */
  layouts: {
    talk:       {speaker: true, pill: {y: 1006}},                                                                                          // between pictures (shot 03's pill at the chest)
    term_plan:  {screen: true, noPic: true, need: 2, menu: true, pill: {y: 232}, wins: [[60, 360, 960, 0]], rows: {x: 98, cmdY: 521, y0: 626, step: 114, n: 5},
                 notif: [60, 0, 960, 170]},                                                                                               // shot 01 (the window grows with its rows, the notification under it)
    hero_chev:  {speaker: true, fit: 1150, pill: {y: 232}, wins: [[80, 1190, 920, 430]], pic: [200, 1290, 680, 300]},                     // shot 02
    notif_top:  {speaker: true, noPic: true, need: 1, pill: {y: 1006}, notif: [60, 220, 960, 170], top: true},                         // shot 03
    win_speaker:{screen: true, menu: true, face: [150, 220, 780, 830],   /* (the sheet's 90–990: its video ran to 976, under the buttons) */ pill: {y: 1150}, wins: [[140, 1240, 800, 420]], pic: [280, 1330, 520, 300]},   // shot 04
    stack3:     {screen: true, menu: true, pill: {y: 232}, back: [[60, 300, 800, 1000], [120, 410, 800, 1000]], wins: [[180, 520, 820, 1140]], pic: [230, 650, 690, 920]},   // shot 05
    term_log:   {speaker: true, noPic: true, need: 2, fit: 1080, pill: {y: 232}, wins: [[80, 1120, 920, 530]], rows: {x: 118, cmdY: 1270, y0: 1372, step: 102, n: 3}},   // shot 06
    split_top:  {screen: true, menu: true, pill: {y: 232}, wins: [[60, 310, 960, 570]], pic: [170, 410, 740, 420], half: [0, 962, 1080, 958, .34, .42], line: 958},   // shot 07
    dialog:     {speaker: true, noPic: true, need: 2, fit: 1120, pill: {y: 232}, wins: [[120, 1160, 840, 420]],
                 slots: [{k: 'title', x: 540, y: 1297, maxW: 720}, {k: 'sub', x: 540, y: 1377, maxW: 720}], btns: [[156, 1463, 372, 88], [552, 1463, 368, 88]]},   // shot 08
    big_win:    {screen: true, menu: true, pill: {y: 232}, wins: [[43, 300, 994, 1360]], pic: [130, 470, 790, 1100]},                      // shot 09
    stat:       {speaker: true, noPic: true, need: 1, num: true, fit: 1140, pill: {y: 232}, wins: [[440, 1180, 580, 460]],
                 slots: [{k: 'stat', x: 476, y: 1305, vy: 1425, maxW: 440}], bar: [476, 1571, 444, 18]},                                    // shot 10 (the label = the subtitle's lead, the number = its key word)
    recap3:     {screen: true, still: true, menu: true, pill: {y: 232}, three: [[60, 300, 960, 430], [60, 770, 960, 430], [60, 1250, 960, 410]],
                 pics: [[230, 385, 620, 300], [230, 855, 620, 300]], rows: {x: 98, cmdY: 1385, y0: 1462, step: 78, n: 3}},                 // shot 11 (three windows: stills only)
    cta:        {screen: true, noPic: true, need: 2, menu: true, pill: {y: 232}, face: [190, 290, 700, 760], wins: [[90, 1150, 900, 410]],
                 slots: [{k: 'title', x: 540, y: 1297, maxW: 780}, {k: 'sub', x: 540, y: 1371, maxW: 780}], btns: [[126, 1443, 402, 88], [552, 1443, 368, 88]]},   // shot 12
  },
  /* RANDOM, as the other styles: a call to action (B15) gets shot 12 first (it is in the pool for any picture too), a number (B01) the number card when one is said; every other
     picture takes one of `pool` (never the one before it) where the face leaves room (trmFit), a screen without a picture only with
     the subtitles it needs, not first and not twice within 5 pictures, among those with a picture the ones that show its shape at
     least 75 % as big as the best, then the least used, then at random from the run's seed */
  pool: ['term_plan', 'hero_chev', 'notif_top', 'win_speaker', 'stack3', 'term_log', 'split_top', 'dialog', 'big_win', 'cta'],   // cta too (Friend 2026-11-18: "ฉากนี้มันจะขึ้นตอนไหนก็ได้ไม่จำเป็นต้องเป็นตอนที่กดติดตาม")
  byCat: {B15: 'cta', B01: 'stat'},
  keep: .75, noPicGap: 4, sinceNoPic: 4,
  used: {}, last: null,
};
function trmChunks(t0, t1) {
  if (typeof CAPTIONS === 'undefined' || !CAPTIONS.length) return null;
  return CAPTIONS.filter(c => Math.min(c.t1, t1) - Math.max(c.t0, t0) >= .15).map(c => { const n = c.parts.length, k = (p, i) => p[2] ?? (i === n - 1 ? 'k' : 'l');
    return {t0: c.t0, t1: c.t1, words: c.parts.map(p => p[0]).join(' '), lead: c.parts.filter((p, i) => k(p, i) === 'l').map(p => p[0]).join(' '), key: c.parts.filter((p, i) => k(p, i) === 'k').map(p => p[0]).join(' ')}; });
}
/* fit a speaker screen to this face [x0, top, x1, chin]: the windows at the hands move down so their top is 30 under the chin (at
   most to 1660); the top pill moves under the chin when the forehead is higher than it; null = no room. Screens: always fit. */
function trmFit(name, f) {
  const L = JSON.parse(JSON.stringify(TRM.layouts[name])); if (!L.speaker) return L;
  const [, top, , chin] = f;
  if (L.pill.y < 600 && top < L.pill.y + 60) return null;                    // (the pill on top would sit on the face)
  if (L.top && top < 420) return null;                                       // (the notification on top)
  if (L.wins) { const w = L.wins[0], d = Math.max(0, chin + 30 - w[1]); if (w[1] + d + w[3] > 1660) return null;
    const mv = v => v + d; w[1] = mv(w[1]); if (L.pic) L.pic[1] = mv(L.pic[1]);
    for (const s of L.slots ?? []) { s.y = mv(s.y); if (s.vy) s.vy = mv(s.vy); }
    for (const b of L.btns ?? []) b[1] = mv(b[1]); if (L.bar) L.bar[1] = mv(L.bar[1]);
    if (L.rows) { L.rows.cmdY = mv(L.rows.cmdY); L.rows.y0 = mv(L.rows.y0); } }
  else if (L.pill.y > 600) { const d = Math.max(0, chin + 66 - L.pill.y); if (L.pill.y + d > 1600) return null; L.pill.y += d; }
  return L;
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
const TRM_BELL = '<svg viewBox="0 0 72 72"><path d="M36 18c-8 0-13 6-13 14v9l-4 6h34l-4-6v-9c0-8-5-14-13-14z M31 51a5 5 0 0 0 10 0" fill="none" stroke="#fff" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/></svg>';

STYLE('terminal', {
  name: 'เทอร์มินัลแดง',
  layouts: TRM.layouts,
  css: `
@font-face{font-family:"TrmText";src:url(fonts/Kanit-400-thai.woff);font-weight:400;unicode-range:U+02D7,U+0303,U+0331,U+0E01-0E5B,U+200C-200D,U+25CC}
@font-face{font-family:"TrmText";src:url(fonts/Kanit-400-latin.woff);font-weight:400;unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+2000-206F}
@font-face{font-family:"TrmMid";src:url(fonts/Kanit-500-thai.woff);font-weight:500;unicode-range:U+02D7,U+0303,U+0331,U+0E01-0E5B,U+200C-200D,U+25CC}
@font-face{font-family:"TrmMid";src:url(fonts/Kanit-500-latin.woff);font-weight:500;unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+2000-206F}
@font-face{font-family:"TrmBold";src:url(fonts/Kanit-600-thai.woff);font-weight:600;unicode-range:U+02D7,U+0303,U+0331,U+0E01-0E5B,U+200C-200D,U+25CC}
@font-face{font-family:"TrmBold";src:url(fonts/Kanit-600-latin.woff);font-weight:600;unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+2000-206F}
@font-face{font-family:"TrmBig";src:url(fonts/Kanit-900-thai.woff);font-weight:900;unicode-range:U+02D7,U+0303,U+0331,U+0E01-0E5B,U+200C-200D,U+25CC}
@font-face{font-family:"TrmBig";src:url(fonts/Kanit-900-latin.woff);font-weight:900;unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+2000-206F}
@font-face{font-family:"TrmMono";src:url(fonts/JetBrainsMono-500-latin.woff);font-weight:500}
.m-root{position:absolute;inset:0;--ink:#F6F6F8;--ac:#EE4444;--lw:5;--sd:#F6F6F8;--fl:rgba(16,16,18,.85);--text:#F6F6F8}
.m-screen{background:radial-gradient(ellipse 720px 820px at 540px 1250px,rgba(150,28,40,.24) 0%,rgba(110,22,34,.12) 50%,rgba(0,0,0,0) 100%),
  linear-gradient(180deg,#141014 0%,#161116 40%,#1b1419 100%);background-color:#161116;overflow:hidden}
.m-menu{position:absolute;left:0;top:0;width:1080px;height:52px;background:#1D1C22}
.m-sk{position:absolute;height:12px;border-radius:6px;background:rgba(210,208,220,.32)}
.m-win{position:absolute;border-radius:28px;background:#111113;box-shadow:0 30px 70px rgba(0,0,0,.55),0 0 0 1px rgba(255,255,255,.035)}
.m-win.m-float{background:rgba(16,16,18,.86)}
.m-win.m-back{background:#101012;box-shadow:0 20px 50px rgba(0,0,0,.6),0 0 0 1px rgba(255,255,255,.03)}
.m-sep{position:absolute;left:0;right:0;top:72px;height:1.5px;background:#34343B}
.m-dot{position:absolute;top:23px;width:18px;height:18px;border-radius:50%}
.m-face{position:absolute;overflow:hidden;border-radius:22px}
.m-half{position:absolute;overflow:hidden}
.m-line{position:absolute;left:0;width:1080px;height:4px;background:#EE4444;transform-origin:0 50%}
.m-text{position:absolute;inset:0}
.m-row{position:absolute;white-space:nowrap}
.m-row i{font-style:normal}
.m-pill{display:inline-block;background:#FFFFFF;border-radius:36px;padding:3px 26px 7px;font-family:"TrmBold";font-weight:600;font-size:48px;line-height:1.3;color:#111113;box-shadow:0 6px 24px rgba(0,0,0,.35)}
.m-cmd{font-family:"TrmMono","TrmText";font-weight:500;font-size:46px;line-height:1.3;color:#EE4444}
.m-box{font-family:"TrmMono";font-weight:500;font-size:44px;line-height:1.3;color:#6E6E76}
.m-rt{font-family:"TrmText";font-weight:400;font-size:44px;line-height:1.3;color:#FFFFFF}
.m-ntext{font-family:"TrmMid";font-weight:500;font-size:43px;line-height:1.3;color:#FFFFFF}
.m-notif{position:absolute;border-radius:30px;background:#1C1B21;box-shadow:0 20px 50px rgba(0,0,0,.45)}
.m-icon{position:absolute;left:32px;top:49px;width:72px;height:72px;border-radius:16px;background:#EE4444}
.m-icon svg{position:absolute;inset:0}
.m-title{font-family:"TrmBold";font-weight:600;font-size:54px;line-height:1.3;color:#FFFFFF}
.m-sub{font-family:"TrmText";font-weight:400;font-size:37px;line-height:1.3;color:#A2A2AA}
.m-btn{position:absolute;border-radius:18px}
.m-label{font-family:"TrmText";font-weight:400;font-size:37px;line-height:1.3;color:#A2A2AA}
.m-value{font-family:"TrmBig";font-weight:900;font-size:114px;line-height:1.15;color:#FFFFFF}
.m-bar{position:absolute;border-radius:9px;background:#34343C;overflow:hidden}
.m-bar b{position:absolute;left:0;top:0;bottom:0;border-radius:9px;background:#EE4444}
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
  setup() { BGL.style.background = '#000'; HOOKS.push(cpInsetHook); },

  /* FIT PICK (Friend 2026-11-18: "motion graphic ที่ระบบจะสุ่มเลือกมาต้องเหมาะสมกับพื้นที่ว่างที่มีอยู่" → every style: "ข"): the pictures' real shapes
     (tools/real_shapes.js, a second build) and how much of the screen a shape can take here (tools/fit_pick.js), as the neon style */
  realShapes: true,
  fitSize(ar, t0, t1) { const face = cpFaceBox(t0, t1); return cpFitSize(ar, TRM.pool.filter(n => !TRM.layouts[n].noPic && !TRM.layouts[n].num && trmFit(n, face)), n => trmFit(n, face)?.pic, TRM.keep, n => !!TRM.layouts[n].speaker); },
  fitSurface() { const r = div('', SC); r.className = 'm-root m-screen'; return r; },

  frame(t0, t1, {index, scene}) {
    const meta = SCENES[scene]?.meta ?? {}, face = cpFaceBox(t0, t1), ch = trmChunks(t0, t1);
    const more = ch ? Math.max(0, ch.length - 1) : (meta.rows?.length ?? 0), num = meta.num ?? (ch ? ch.slice(1).some(c => /\d/.test(c.words)) : false);
    let name = meta.layout;
    if (!name) {
      const ok = n => { const L = TRM.layouts[n]; if (L.noPic && (more < (L.need ?? 2) || index === 0 || TRM.sinceNoPic < TRM.noPicGap)) return false;
        if (L.num && !num) return false; return !!trmFit(n, face); };
      const want = TRM.byCat[String(meta.cat ?? '').slice(0, 3)];
      if (want && ok(want)) name = want;
      else {
        let pool = TRM.pool.filter(n => n !== TRM.last && ok(n));
        if (!pool.length) pool = ['big_win', 'stack3', 'split_top'].filter(n => n !== TRM.last);
        const ar = cpShape(meta.variant, t0);   // the picture's shape in this clip (REAL_SHAPES), else the sample's (fit pick, 2026-11-18)
        if (ar) {
          const size = n => { const p = trmFit(n, face)?.pic; if (!p) return 0; const [, , w, h] = p; return ar > w / h ? w * w / ar : h * h * ar; };
          pool = cpSizeKeep(pool, size, TRM.keep, n => !!TRM.layouts[n].speaker, n => !!TRM.layouts[n].noPic);   // the speaker's screens with a picture: a floor, no race on size (Friend 2026-11-18: "อยากให้ ก ขึ้นบ้าง (ทุกสไตล์เลยนะ)")
        }
        const least = Math.min(...pool.map(n => TRM.used[n] ?? 0)); pool = pool.filter(n => (TRM.used[n] ?? 0) === least);
        name = pool[Math.floor(cpRand('screen' + index) * pool.length)];
      }
    }
    TRM.used[name] = (TRM.used[name] ?? 0) + 1; TRM.last = name; TRM.sinceNoPic = TRM.layouts[name].noPic ? 0 : TRM.sinceNoPic + 1;
    const L = (meta.layout ? JSON.parse(JSON.stringify(TRM.layouts[name])) : trmFit(name, face)) ?? JSON.parse(JSON.stringify(TRM.layouts.big_win));
    const screen = !L.speaker, root = div('', SC); root.className = 'm-root' + (screen ? ' m-screen' : '');
    const box = ([x, y, w, h], parent = root) => div(`left:${x}px;top:${y}px;width:${w}px;height:${h}px`, parent);
    const rise = (e, k, dy = 40) => A(e, [{opacity: 0, transform: `translateY(${dy}px) scale(.96)`, filter: 'blur(10px)'}, {opacity: 1, transform: 'none', filter: 'blur(0)'}], t0 + .04 + .1 * k, .45, {e: EASE.soft});
    if (screen) {
      A(root, [{opacity: 0, filter: 'blur(14px)', transform: 'scale(1.03)'}, {opacity: 1, filter: 'blur(0)', transform: 'none'}], t0 - .04, .35, {e: EASE.smooth});
      sfx('whoosh', t0 - .1, -20);
    }
    A(root, [{opacity: 1, filter: 'blur(0)'}, {opacity: 0, filter: 'blur(10px)'}], t1 - .3, .3, {e: EASE.out, f: 'forwards'});
    /* the menu bar: its words and clock as a skeleton (not spoken) */
    if (L.menu) { const m = box([0, 0, 1080, 52]); m.className = 'm-menu';
      [[40, 86], [146, 34], [200, 34], [254, 44], [318, 70], [956, 84]].forEach(([x, w]) => { const s = div(`left:${x}px;top:20px;width:${w}px`, m); s.className = 'm-sk'; }); }
    /* the speaker's half (shot 07) and its red line */
    if (L.half) { const [x, y, w, h, k, fy] = L.half, f = box([x, y, w, h]); f.className = 'm-half'; cpInset(f, w, h, t0, k, fy);
      A(f, [{opacity: 0, transform: 'translateY(60px)'}, {opacity: 1, transform: 'none'}], t0, .45, {e: EASE.soft});
      const ln = div(`top:${L.line}px`, root); ln.className = 'm-line'; A(ln, [{transform: 'scaleX(0)'}, {transform: 'scaleX(1)'}], t0 + .1, .45, {e: EASE.soft}); }
    /* an app window: three dots, a thin line under its title bar (no title: "ROUTINE 01" is a small label) */
    const win = (b, k, cls = '') => { const e = box(b); e.className = 'm-win' + cls; rise(e, k);
      ['#FF5F57', '#FEBC2E', '#28C840'].forEach((c, i) => { const d = div(`left:${27 + 32 * i}px;background:${c}`, e); d.className = 'm-dot'; });
      const s = div('', e); s.className = 'm-sep'; return e; };
    (L.back ?? []).forEach((b, k) => win(b, k, ' m-back'));
    if (L.face) { const [x, y, w, h] = L.face, wn = win(L.face, 0), f = box([14, 86, w - 28, h - 100], wn); f.className = 'm-face cp-frame';
      cpInset(f, w - 28, h - 100, t0, .4, .4); }
    /* the terminal (shots 01, 06, 11): the window grows with its rows; a notification under it (shot 01) */
    const lines = [];                                            // [{kind, parts}] in the order the subtitles fill them
    const words = k => ch ? ch[k + 1]?.words : (Array.isArray(meta.rows?.[k]) ? meta.rows[k].join(' ') : meta.rows?.[k]);
    let k = 0;
    const termIn = (wb, R) => { const n = Math.max(0, Math.min(R.n, (ch ? more : (meta.rows?.length ?? 0)) - 1 - (L.notif && !L.top ? 1 : 0)));
      if (!wb[3]) wb[3] = R.y0 - wb[1] + Math.max(1, n) * R.step + 64;   // (shot 01: the window ends 64 under its last row's step, 360–1260 for 5 rows)
      const e = win(wb, 0);
      const w0 = words(k); if (w0) { const r = trmLine(root, '> ' + w0, 'm-cmd', {x: R.x, y: R.cmdY, align: 'left', maxW: 920 - R.x}); lines.push({kind: 'cmd', parts: [r.firstChild]}); k++; }
      for (let i = 0; i < n; i++) { const w = words(k); if (!w) break; const y = R.y0 + i * R.step;
        const b = trmLine(root, '[ ]', 'm-box', {x: R.x + 5, y, align: 'left', maxW: 140}), r = trmLine(root, w, 'm-rt', {x: R.x + 145, y, align: 'left', maxW: 920 - R.x - 145});
        lines.push({kind: 'row', parts: [r.firstChild], box: b.firstChild}); k++; }
      return e; };
    if (L.rows && !L.three) { const wb = L.wins[0]; termIn(wb, L.rows);
      if (L.notif && !L.top) { L.notif[1] = wb[1] + wb[3] + 120; } }
    else (L.wins ?? []).forEach((b, i) => win(b, i + (L.back?.length ?? 0), L.speaker ? ' m-float' : ''));
    if (L.three) { L.three.forEach((b, i) => { if (i < 2) win(b, i); }); termIn(L.three[2], L.rows); }
    /* the notification (shots 01, 03): a red icon (a bell: the sheet's "A" / "C" belong to the small labels), the spoken words */
    if (L.notif && (L.top || L.notif[1])) { const w = words(k); if (w) { const nb = box(L.notif); nb.className = 'm-notif'; rise(nb, 1, L.top ? -30 : 30);
      const ic = div('', nb, TRM_BELL); ic.className = 'm-icon'; const r = trmLine(root, w, 'm-ntext', {x: L.notif[0] + 134, y: L.notif[1] + L.notif[3] / 2, align: 'left', maxW: 920 - L.notif[0] - 134});
      lines.push({kind: 'notif', parts: [r.firstChild]}); k++; } }
    /* the dialog (shots 08, 12): title and line from the subtitles, skeleton buttons; the number card (shot 10) */
    for (const s of L.slots ?? []) {
      if (s.k === 'stat') { const c = ch ? ch[k + 1] : null, lab = c ? (c.lead || '') : meta.rows?.[k]?.[0], val = c ? (c.lead ? c.key : c.words) : meta.rows?.[k]?.[1]; if (!val) continue;
        const parts = []; if (lab) parts.push(trmLine(root, lab, 'm-label', {x: s.x, y: s.y, align: 'left', maxW: s.maxW}).firstChild);
        parts.push(trmLine(root, val, 'm-value', {x: s.x, y: s.vy, align: 'left', maxW: s.maxW}).firstChild); lines.push({kind: 'stat', parts}); k++; continue; }
      const w = words(k); if (!w) continue; const r = trmLine(root, w, s.k === 'title' ? 'm-title' : 'm-sub', s); lines.push({kind: s.k, parts: [r.firstChild]}); k++; }
    (L.btns ?? []).forEach(([x, y, w, h], i) => { const b = box([x, y, w, h]); b.className = 'm-btn'; b.style.background = i ? '#EE4444' : '#2D2D35'; rise(b, 2 + i);
      const s = div(`left:${w / 2 - w * .17}px;top:${h / 2 - 7}px;width:${w * .34}px;height:14px;border-radius:7px;background:${i ? 'rgba(255,255,255,.88)' : 'rgba(255,255,255,.5)'}`, b); });
    if (L.bar) { const [x, y, w, h] = L.bar, b = box([x, y, w, h]); b.className = 'm-bar'; const f = document.createElement('b'); b.appendChild(f);
      const p = .55 + .3 * cpRand('bar' + index); A(f, [{width: '0px'}, {width: `${Math.round(w * p)}px`}], t0 + .5, .9, {e: EASE.soft, f: 'both'}); }
    /* the picture(s) */
    let stages = null;
    if (L.pics) stages = L.pics.map(b => box(b));
    const stage = L.pic ? box(L.pic) : box([540, 960, 1, 1]);
    if (!L.pic) stage.style.visibility = 'hidden';
    else A(stage, [{opacity: 0, transform: 'translateY(24px) scale(.94)', filter: 'blur(8px)'}, {opacity: 1, transform: 'none', filter: 'blur(0)'}], t0 + .08, .45, {e: EASE.soft});
    /* the lines come in with their windows, grey until said (a still: as the sheet, said) */
    lines.forEach((q, i) => { [q.parts[0].parentElement, q.box?.parentElement].filter(Boolean).forEach(host => A(host, [{opacity: 0, transform: 'translateY(10px)'}, {opacity: 1, transform: 'none'}], t0 + .3 + .08 * i, .35, {e: EASE.soft}));   // (the "[ ]" too: a speaker screen's root does not fade in, it showed before its picture)
      q.parts.forEach(p => { if (q.box) p.style.color = '#FFFFFF'; });
      if (ch) q.parts.forEach(p => { p.style.color = '#7C7C84'; });
      else if (q.box) { q.box.textContent = '[x]'; q.box.style.color = '#EE4444'; } });
    const F = {root, stage, stages, cam: root, L, name, dark: screen, t1, n: 0, meta, lines};
    if ((typeof CAPTIONS === 'undefined' || !CAPTIONS.length) && meta.rows) F.stillRows = meta.rows;
    return F;
  },
  /* between pictures: the pill at the chest, moved below the chin when the face is low */
  speakerFrame(a, b) {
    const root = div('', SC); root.className = 'm-root';
    return {root, cam: root, speaker: true, L: trmFit('talk', cpFaceBox(a, b)) ?? TRM.layouts.talk, name: 'talk'};
  },
  /* the words: the picture's first subtitle (and every one between pictures) is the pill, its key word coming in on its word; each
     next one lights the next line ("[ ]" → "[x]" red, the words white; the terminal's "> " line red; the notification, the dialog,
     the number white) or, with no line left, takes the pill's place */
  text(F, T, lead, key) {
    const L = F.L ?? TRM.layouts.talk, el = div('', F.root ?? SC); el.className = 'm-text';
    const pill = (t, swap) => {
      if (swap && F.head) A(F.head, [{opacity: 1}, {opacity: 0}], t - .04, .12, {f: 'forwards'});
      const txt = [lead, key].map(s => String(s ?? '').trim()).filter(Boolean); if (!txt.length || !L.pill) return;
      const r = trmLine(el, txt.join(' '), 'm-pill', {x: 540, y: L.pill.y, maxW: 860}); F.head = r;
      A(r, [{opacity: 0, transform: 'translateY(12px) scale(.96)'}, {opacity: 1, transform: 'none'}], swap ? t + .06 : T.t0 + .15, .35, {e: EASE.soft});
      if (key && lead) { const sp = r.firstChild, all = sp.textContent, cut = all.lastIndexOf(String(key).trim());
        if (cut > 0) { sp.textContent = all.slice(0, cut); const kk = document.createElement('span'); kk.textContent = all.slice(cut); sp.appendChild(kk);
          A(kk, [{color: '#B4B4BA'}, {color: '#111113'}], T.hit - .05, .25, {e: EASE.soft}); } }   // (light grey until said: an empty space in the pill read as a gap)
      sfx('softswish', T.hit - .05, -21); };
    if (F.speaker || !F.L) {
      pill(T.t0);
      if (F.speaker && T.clip) {
        A(el, [{visibility: 'hidden'}, {visibility: 'visible'}], T.b[0] - .02, .001); A(el, [{visibility: 'visible'}, {visibility: 'hidden'}], T.end - .021, .001, {f: 'forwards'});
        return null;
      }
      return el;
    }
    const words = [lead, key].map(s => String(s ?? '').trim()).filter(Boolean).join(' ');
    if (!words && !(F.stillRows && T.clip !== true)) return null;
    const n = F.n++, start = T.b[0] - .02, q = F.lines[n - 1];
    if (n === 0) pill(T.t0);
    else if (q) {
      const to = q.kind === 'cmd' ? '#EE4444' : q.kind === 'sub' || (q.kind === 'stat' && q.parts.length > 1) ? null : '#FFFFFF';
      q.parts.forEach((p, i) => A(p, [{color: '#7C7C84'}, {color: to ?? (i === 0 ? '#A2A2AA' : '#FFFFFF')}], start, .25, {f: 'forwards'}));
      if (q.box) { A(q.box, [{color: '#6E6E76'}, {color: '#EE4444'}], start, .2, {f: 'forwards'}); const b = q.box; A(b, [{opacity: 1}, {opacity: 1}], start, .001);
        HOOKS.push(t => { b.textContent = t >= start ? '[x]' : '[ ]'; }); }
      sfx('softswish', start, -26); }
    else pill(start, true);
    if (T.clip) { A(el, [{visibility: 'hidden'}, {visibility: 'visible'}], start, .001); return null; }
    return el;
  },
});
