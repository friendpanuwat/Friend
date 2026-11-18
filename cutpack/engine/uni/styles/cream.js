/* =====================================================================
   STYLE · cream — "ครีมน้ำเงิน" (Cream Blue) (Friend 2026-11-18, the 11th of the new sheets: "ทำสไตล์นี้", the 12-shot sheet and all
   twelve shots full size). Places, sizes and colours are measured on the full-size shots, then held to the rules every style shares
   (styles/common.js). The second light style: a cream screen (#F8F7F3), black words very bold with a short blue line under them,
   a blue slanted line, a giant black number, thin corner marks, cream bands faded over the speaker, a cream card at the hands,
   split screens (the speaker on one half), the speaker's phone-shaped card. The pictures: the glow-line template set, dark lines on
   the cream screen, the lit part blue (GLASSY.cream).
   Friend's rules for the new styles: the words on the screen are the spoken words (grey ahead, lit when said), no small labels, and
   the sheet is read for its layout only (2026-11-18: "ต่อไปนี้ไม่ต้องสนเนื้อหาในตัวอย่างให้ดูแค่สไตล์การจัดวางองค์ประกอบของภาพก็พอ"):
   every screen is a generic screen. So the sheet's small English lines in a serif italic ("days to save", "rule no.1", "open
   account" …) become the spoken lead in a blue slanted line (Kanit italic; Latin words in Instrument Serif italic); the giant number
   is a number the speaker says (shots 01 04 06 09), the count of the lines on the screen (07 11), or the screen's order (03 08).
   The 7-item form:
   1 frame    one of 12 layouts (CRM.layouts, named after Friend's shots): the speaker full screen with a cream band at the bottom or
              the top; a cream card at the hands (a number, or a progress card); split screens, the speaker on the top or bottom
              half; the cream screen with a picture, a list of rows, a recap list beside the speaker's phone card
   2 surface  cream (#F8F7F3) · cream bands faded over the video (.9) · cream cards rounded 40 with a soft shadow · corner marks
   3 drawing  the glow-line pictures: dark lines, white tiles, the lit part a blue outline, icon and word with a soft blue glow
   4 colours  cream · black ink (#151515) · grey (#5A5853) · one blue (#2F6FED)
   5 words    the lead in blue italic (Kanit 400 italic 54) · the key word black (Kanit 800 106) over a blue line 340 × 12 · the number
              Archivo Black · the next lines Kanit 400 39 grey, rows Kanit 600 56 + values Kanit 700 64 blue
   6 motion   bands and cards rise in out of a blur, the number pops, the blue line grows from its start, lines light from grey
   7 sound    whoosh on a screen cut, a soft swish on the key word, a soft tick on a line
   ===================================================================== */
const CRM = {
  /* boxes [x, y, w, h] · lead / key {x, y (centre), align, maxW, two: the lead's second line y} · num {kind: 'say' (a number in the
     picture's first subtitle) | 'count' (the screen's rows) | 'order' (the picture's place), x, y (centre), size} · bar {x, y, c: centred}
     · band: 'low' (from y down) | 'top' (to y) · card = a cream card · half = the video half of a split screen [x, y, w, h, faceK, faceY]
     · face = the speaker's phone card · pic = the picture box · slots = the lines the next subtitles fill, in order: {k: 'sub' | 'blue'
     | 'white' | 'white2' | 'row' | 'total' | 'item' | 'pill', x, y, vx (a value's right edge), align, maxW} · top / bottom = where a
     speaker screen's words start and end (they move under a low chin) · cc = the corner marks' colour (w white on the video, d dark;
     top-left, top-right, bottom-left, bottom-right) · noPic = no picture on the sheet. Moved where the sheet ran under TikTok's
     search bar (the corners 150 → 220, shot 06's band words 120–280 → 225–385, shot 08's top block +70, shot 07's phone card 200 →
     220) and buttons (the corners 1020 → 920, the rows' values and lines end at 920, shot 11's list moved left 20 and its words shrink
     to 920; the cream cards stay as wide as the sheet, behind the buttons) and the bottom bar (the corners 1680 → 1660, shot 12's
     pill 1572–1668 → 1560–1650). */
  layouts: {
    talk:       {speaker: true, top: 1300, bottom: 1560, leadCls: 'c-tlead', keyCls: 'c-key c-on', cc: 'wwww',
                 lead: {x: 540, y: 1342}, key: {x: 540, y: 1462}, bar: {x: 540, y: 1551, c: true}},                                     // shot 02
    band_num:   {speaker: true, noPic: true, need: 0, band: 'low', bandY: 1060, top: 1150, bottom: 1610, cc: 'wwdd',
                 num: {kind: 'say', x: 96, y: 1262, size: 233}, lead: {x: 560, y: 1206, two: 1280, align: 'left', maxW: 350},
                 key: {x: 84, y: 1436, align: 'left', maxW: 836}, bar: {x: 80, y: 1521},
                 slots: [{k: 'sub', x: 82, y: 1587, align: 'left', maxW: 838}]},                                                        // shot 01
    split_rail: {screen: true, half: [0, 0, 1080, 960, .38, .52], cc: 'wwdd',
                 num: {kind: 'order', x: 82, y: 1145, size: 223}, lead: {x: 80, y: 1302, two: 1372, align: 'left', maxW: 400},
                 pic: [500, 1010, 420, 440], key: {x: 84, y: 1543, align: 'left', maxW: 836}, bar: {x: 80, y: 1621}},                  // shot 03
    card_num:   {speaker: true, noPic: true, need: 0, card: [70, 1080, 940, 570], top: 1080, bottom: 1650, cc: 'wwww',
                 num: {kind: 'say', x: 134, y: 1262, size: 199}, lead: {x: 634, y: 1205, two: 1280, align: 'left', maxW: 286},
                 key: {x: 130, y: 1424, align: 'left', maxW: 790}, bar: {x: 130, y: 1510},
                 slots: [{k: 'sub', x: 132, y: 1576, align: 'left', maxW: 788}]},                                                       // shot 04
    full_wave:  {screen: true, cc: 'dddd', lead: {x: 540, y: 281}, key: {x: 540, y: 401, maxW: 860}, bar: {x: 540, y: 481, c: true},
                 pic: [110, 740, 810, 720], slots: [{k: 'sub', x: 540, y: 548, maxW: 860}, {k: 'blue', x: 540, y: 1587, maxW: 860}]},     // shot 05
    band_top:   {speaker: true, noPic: true, need: 0, band: 'top', bandY: 470, cc: 'ddww', faceMin: 380,
                 num: {kind: 'say', x: 86, y: 294, size: 186}, lead: {x: 222, y: 300, two: 352, align: 'left', maxW: 170},
                 key: {x: 404, y: 338, align: 'left', maxW: 610},
                 slots: [{k: 'white2', x: 540, y: 1360, two: 1450, maxW: 860}]},                                                        // shot 06
    leak_rows:  {screen: true, noPic: true, need: 2, cc: 'dddd', face: [700, 220, 300, 515],
                 num: {kind: 'count', x: 90, y: 408, size: 334}, lead: {x: 330, y: 360, two: 438, align: 'left', maxW: 340},
                 key: {x: 82, y: 619, align: 'left', maxW: 600}, bar: {x: 80, y: 706}, divs: [951, 1151, 1351],
                 slots: [{k: 'row', x: 82, vx: 920, y: 882}, {k: 'row', x: 82, vx: 920, y: 1082}, {k: 'row', x: 82, vx: 920, y: 1282},
                         {k: 'total', x: 82, y: 1500, align: 'left', maxW: 838}]},                                                     // shot 07
    split_pic:  {screen: true, half: [0, 960, 1080, 960, .38, .42], cc: 'ddww',
                 num: {kind: 'order', x: 82, y: 318, size: 246}, lead: {x: 440, y: 290, two: 370, align: 'left', maxW: 480},
                 key: {x: 84, y: 512, align: 'left', maxW: 836}, bar: {x: 80, y: 590}, pic: [200, 640, 680, 300]},                     // shot 08
    card_prog:  {speaker: true, noPic: true, need: 1, card: [70, 1100, 630, 400], top: 1100, bottom: 1630, cc: 'wwww', keyCls: 'c-keyw',
                 num: {kind: 'say', x: 118, y: 1305, size: 147}, lead: {x: 121, y: 1181, align: 'left', maxW: 540}, track: [120, 1380, 530, 24],
                 key: {x: 540, y: 1590, maxW: 860}, slots: [{k: 'sub', x: 120, y: 1446, align: 'left', maxW: 540}]},                    // shot 09
    band_plain: {speaker: true, noPic: true, need: 1, band: 'low', bandY: 1200, top: 1310, bottom: 1640, cc: 'wwdd',
                 lead: {x: 80, y: 1356, align: 'left', maxW: 838}, key: {x: 82, y: 1468, align: 'left', maxW: 836}, bar: {x: 80, y: 1550},
                 slots: [{k: 'sub', x: 82, y: 1617, align: 'left', maxW: 838}]},                                                        // shot 10
    recap_list: {screen: true, noPic: true, need: 2, cc: 'dddd', face: [80, 780, 400, 710],
                 num: {kind: 'count', x: 86, y: 386, size: 329}, lead: {x: 330, y: 342, two: 420, align: 'left', maxW: 560},
                 key: {x: 82, y: 609, align: 'left', maxW: 836}, bar: {x: 80, y: 686},
                 slots: [{k: 'item', x: 520, y: 884}, {k: 'item', x: 520, y: 1053}, {k: 'item', x: 520, y: 1223}, {k: 'item', x: 520, y: 1393}]},   // shot 11
    band_cta:   {speaker: true, noPic: true, need: 1, band: 'low', bandY: 1160, top: 1280, bottom: 1650, cc: 'wwdd',
                 lead: {x: 540, y: 1315, maxW: 860}, key: {x: 540, y: 1440, maxW: 860}, bar: {x: 540, y: 1521, c: true},
                 slots: [{k: 'pill', x: 540, y: 1605, maxW: 820}]},                                                                     // shot 12
  },
  /* RANDOM, as the other styles (every screen generic); a screen without a picture only with the subtitles it needs, not first, and
     (the sheet shows nine of its twelve shots without a picture) not twice in a row; a 'say' number screen only when the picture's
     first subtitle has a number; among those with a picture the ones that show its shape at least 75 % as big as the best; then the
     least used; then at random from the run's seed */
  pool: ['band_num', 'split_rail', 'card_num', 'full_wave', 'band_top', 'leak_rows', 'split_pic', 'card_prog', 'band_plain', 'recap_list', 'band_cta'],
  byCat: {},
  keep: .75, noPicGap: 1, sinceNoPic: 1,
  used: {}, last: null,
};
const crmNum = s => (String(s ?? '').match(/\d+(?:[.,]\d+)*%?/) ?? [null])[0];
function crmChunks(t0, t1) {
  if (typeof CAPTIONS === 'undefined' || !CAPTIONS.length) return null;
  return CAPTIONS.filter(c => Math.min(c.t1, t1) - Math.max(c.t0, t0) >= .15).map(c => { const n = c.parts.length, k = (p, i) => p[2] ?? (i === n - 1 ? 'k' : 'l');
    return {t0: c.t0, t1: c.t1, words: c.parts.map(p => p[0]).join(' '), lead: c.parts.filter((p, i) => k(p, i) === 'l').map(p => p[0]).join(' '), key: c.parts.filter((p, i) => k(p, i) === 'k').map(p => p[0]).join(' ')}; });
}
/* fit a speaker screen to this face [x0, top, x1, chin]: everything moves down so the words start 30 under the chin, the last line
   at 1660 or above; null = no room. The top band: the face must start under its fade. Screens: always fit. */
function crmFit(name, f) {
  const L = JSON.parse(JSON.stringify(CRM.layouts[name])); if (!L.speaker) return L;
  if (L.band === 'top') return f[1] >= (L.faceMin ?? 0) ? L : null;
  const d = Math.max(0, f[3] + 30 - L.top); if (!d) return L;
  if (L.bottom + d > 1660) return null;
  for (const o of [L.lead, L.key, L.num, L.bar, ...(L.slots ?? [])]) if (o) { o.y += d; if (o.two) o.two += d; }
  for (const b of [L.card, L.pic, L.track]) if (b) b[1] += d;
  if (L.bandY) L.bandY += d;
  return L;
}
/* a line of words at (x, y): cpLine (Latin words in <i>, shrunk never wrapped to maxW and the safe zone, checked) */
const crmLine = (parent, txt, cls, P) => cpLine(parent, txt, cls, {align: 'center', ...P}, P.maxW ?? 860);
/* a value right-aligned at x (cpLine has left and centre only): shrunk to maxW, checked as a .cp-row */
function crmRight(parent, txt, cls, x, y, maxW) {
  const row = div('', parent); row.className = 'cp-row'; const sp = document.createElement('span'); sp.className = cls; sp.textContent = txt; row.appendChild(sp);
  Object.assign(row.style, {left: `${x}px`, top: `${y}px`, translate: '-100% -50%', transformOrigin: '100% 50%'});
  FITS.push(() => { const w = sp.offsetWidth; if (w > maxW) row.style.scale = String(maxW / w); });
  return sp;
}

STYLE('cream', {
  name: 'ครีมน้ำเงิน',
  layouts: CRM.layouts,
  css: `
@font-face{font-family:"CrmText";src:url(fonts/Kanit-400-thai.woff);unicode-range:U+02D7,U+0303,U+0331,U+0E01-0E5B,U+200C-200D,U+25CC}
@font-face{font-family:"CrmText";src:url(fonts/Kanit-400-latin.woff);unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+2000-206F}
@font-face{font-family:"CrmMid";src:url(fonts/Kanit-500-thai.woff);unicode-range:U+02D7,U+0303,U+0331,U+0E01-0E5B,U+200C-200D,U+25CC}
@font-face{font-family:"CrmMid";src:url(fonts/Kanit-500-latin.woff);unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+2000-206F}
@font-face{font-family:"CrmSemi";src:url(fonts/Kanit-600-thai.woff);unicode-range:U+02D7,U+0303,U+0331,U+0E01-0E5B,U+200C-200D,U+25CC}
@font-face{font-family:"CrmSemi";src:url(fonts/Kanit-600-latin.woff);unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+2000-206F}
@font-face{font-family:"CrmBold";src:url(fonts/Kanit-700-thai.woff);unicode-range:U+02D7,U+0303,U+0331,U+0E01-0E5B,U+200C-200D,U+25CC}
@font-face{font-family:"CrmBold";src:url(fonts/Kanit-700-latin.woff);unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+2000-206F}
@font-face{font-family:"CrmHead";src:url(fonts/Kanit-800-thai.woff);unicode-range:U+02D7,U+0303,U+0331,U+0E01-0E5B,U+200C-200D,U+25CC}
@font-face{font-family:"CrmHead";src:url(fonts/Kanit-800-latin.woff);unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+2000-206F}
@font-face{font-family:"CrmIt";src:url(fonts/Kanit-400i-thai.woff);font-style:italic;unicode-range:U+02D7,U+0303,U+0331,U+0E01-0E5B,U+200C-200D,U+25CC}
@font-face{font-family:"CrmIt";src:url(fonts/Kanit-400i-latin.woff);font-style:italic;unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+2000-206F}
@font-face{font-family:"CrmSerif";src:url(fonts/InstrumentSerif-Italic-latin.woff);font-style:italic}
@font-face{font-family:"CrmNum";src:url(fonts/ArchivoBlack-latin.woff)}
.c-root{position:absolute;inset:0;--ink:#2A2A2E;--ac:#2F6FED;--lw:5;--sd:#151515;--fl:rgba(255,255,255,.9);--text:#151515}
.c-root i{font-style:normal}
.c-root .cp-row{position:absolute;white-space:nowrap}
.c-screen{background:#F8F7F3;overflow:hidden}
.c-band{position:absolute;left:0;width:1080px}
.c-card{position:absolute;border-radius:40px;background:#F8F7F3;box-shadow:0 24px 54px rgba(0,0,0,.3),0 4px 12px rgba(0,0,0,.1)}
.c-face{position:absolute;overflow:hidden;border-radius:40px;box-shadow:0 26px 54px rgba(0,0,0,.28)}
.c-half{position:absolute;overflow:hidden}
.c-text{position:absolute;inset:0}
.c-lead{font-family:"CrmIt";font-style:italic;font-size:54px;line-height:1.3;color:#2F6FED}
.c-lead i{font-family:"CrmSerif";font-style:italic;font-size:1.3em}
.c-tlead{font-family:"CrmMid";font-size:52px;line-height:1.3;color:#FFFFFF;text-shadow:0 0 3px rgba(0,0,0,.6),0 2px 12px rgba(0,0,0,.5)}
.c-key{display:inline-block;padding:.06em 0;font-family:"CrmHead";font-size:106px;line-height:1.25;color:#151515}
.c-key.c-on{color:#FFFFFF;text-shadow:0 0 3px rgba(0,0,0,.5),0 3px 16px rgba(0,0,0,.45)}
.c-keyw{display:inline-block;font-family:"CrmSemi";font-size:58px;line-height:1.3;color:#FFFFFF;text-shadow:0 0 3px rgba(0,0,0,.6),0 2px 12px rgba(0,0,0,.5)}
.c-num{display:inline-block;font-family:"CrmNum";line-height:1;color:#151515}
.c-bar{position:absolute;width:340px;height:12px;border-radius:6px;background:#2F6FED;translate:0 -50%}
.c-sub{font-family:"CrmText";font-size:39px;line-height:1.3;color:#5A5853}
.c-blue{font-family:"CrmText";font-size:42px;line-height:1.3;color:#2F6FED}
.c-white{font-family:"CrmSemi";font-size:56px;line-height:1.3;color:#FFFFFF;text-shadow:0 0 3px rgba(0,0,0,.6),0 2px 12px rgba(0,0,0,.5)}
.c-cell{font-family:"CrmSemi";font-size:56px;line-height:1.3;color:#151515}
.c-val{font-family:"CrmBold";font-size:64px;line-height:1.3;color:#2F6FED}
.c-total{font-family:"CrmSemi";font-size:54px;line-height:1.3;color:#2F6FED}
.c-inum{font-family:"CrmBold";font-size:50px;line-height:1.3;color:#2F6FED}
.c-item{font-family:"CrmSemi";font-size:55px;line-height:1.3;color:#151515}
.c-pill{display:inline-block;background:#141414;color:#FFFFFF;border-radius:48px;padding:16px 54px 22px;font-family:"CrmBold";font-size:44px;line-height:1.3}
.c-div{position:absolute;left:80px;width:840px;height:3px;background:#DCDAD4}
.c-track{position:absolute;border-radius:12px;background:#DFDED8;overflow:hidden}
.c-fill{position:absolute;left:0;top:0;bottom:0;width:65%;border-radius:12px;background:#2F6FED;transform-origin:0 50%}
.c-corner{position:absolute;width:40px;height:40px;border:0 solid #1A1A1A}
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

  frame(t0, t1, {index, scene}) {
    const meta = SCENES[scene]?.meta ?? {}, face = cpFaceBox(t0, t1), ch = crmChunks(t0, t1);
    const more = ch ? Math.max(0, ch.length - 1) : (meta.rows?.length ?? 0), num = meta.num ?? (ch ? crmNum(ch[0]?.words) : null);
    let name = meta.layout;
    if (!name) {
      const ok = n => { const L = CRM.layouts[n];
        if (L.noPic && (more < (L.need ?? 2) || index === 0 || CRM.sinceNoPic < CRM.noPicGap)) return false;
        if (L.num?.kind === 'say' && !num) return false;
        return !!crmFit(n, face); };
      const want = CRM.byCat[String(meta.cat ?? '').slice(0, 3)];
      if (want && ok(want)) name = want;
      else {
        let pool = CRM.pool.filter(n => n !== CRM.last && ok(n));
        if (!pool.length) pool = ['full_wave', 'split_rail', 'split_pic'].filter(n => n !== CRM.last);
        const ar = typeof GLOW_SHAPES !== 'undefined' && meta.variant ? GLOW_SHAPES[meta.variant] : null;
        if (ar) {
          const size = n => { const p = crmFit(n, face)?.pic; if (!p) return 0; const [, , w, h] = p; return ar > w / h ? w * w / ar : h * h * ar; };
          const best = Math.max(0, ...pool.map(size)); pool = pool.filter(n => CRM.layouts[n].noPic || size(n) >= CRM.keep * best);
        }
        const least = Math.min(...pool.map(n => CRM.used[n] ?? 0)); pool = pool.filter(n => (CRM.used[n] ?? 0) === least);
        name = pool[Math.floor(cpRand('screen' + index) * pool.length)];
      }
    }
    CRM.used[name] = (CRM.used[name] ?? 0) + 1; CRM.last = name; CRM.sinceNoPic = CRM.layouts[name].noPic ? 0 : CRM.sinceNoPic + 1;
    const L = (meta.layout ? JSON.parse(JSON.stringify(CRM.layouts[name])) : crmFit(name, face)) ?? JSON.parse(JSON.stringify(CRM.layouts.full_wave));
    const screen = !L.speaker, root = div('', SC); root.className = 'c-root' + (screen ? ' c-screen' : '');
    const box = ([x, y, w, h], parent = root) => div(`left:${x}px;top:${y}px;width:${w}px;height:${h}px`, parent);
    const rise = (e, k, dy = 40) => A(e, [{opacity: 0, transform: `translateY(${dy}px) scale(.96)`, filter: 'blur(10px)'}, {opacity: 1, transform: 'none', filter: 'blur(0)'}], t0 + .04 + .1 * k, .45, {e: EASE.soft});
    if (screen) {
      A(root, [{opacity: 0, filter: 'blur(14px)', transform: 'scale(1.03)'}, {opacity: 1, filter: 'blur(0)', transform: 'none'}], t0 - .04, .35, {e: EASE.smooth});
      sfx('whoosh', t0 - .1, -20);
    }
    A(root, [{opacity: 1, filter: 'blur(0)'}, {opacity: 0, filter: 'blur(10px)'}], t1 - .3, .3, {e: EASE.out, f: 'forwards'});
    /* the video half of a split screen (it fills its half, the face at faceK of the width, at faceY of the height) */
    if (L.half) { const [x, y, w, h, k, fy] = L.half, f = box([x, y, w, h]); f.className = 'c-half'; cpInset(f, w, h, t0, k, fy);
      A(f, [{opacity: 0, transform: `translateY(${y ? 60 : -60}px)`}, {opacity: 1, transform: 'none'}], t0, .45, {e: EASE.soft}); }
    /* the cream band over the video: from bandY down (faded in over 130 px), or from the top to bandY (faded out over its last 110 px) */
    if (L.band) { const lo = L.band === 'low', b = box(lo ? [0, L.bandY, 1080, 1920 - L.bandY] : [0, 0, 1080, L.bandY]); b.className = 'c-band';
      b.style.background = lo ? 'linear-gradient(180deg,rgba(248,247,243,0) 0,rgba(248,247,243,.9) 130px,rgba(248,247,243,.92) 100%)'
                              : 'linear-gradient(180deg,rgba(248,247,243,.95) 0,rgba(248,247,243,.95) calc(100% - 110px),rgba(248,247,243,0) 100%)';
      A(b, [{opacity: 0, transform: `translateY(${lo ? 60 : -60}px)`}, {opacity: 1, transform: 'none'}], t0 - .02, .45, {e: EASE.soft}); }
    if (L.face) { const [, , w, h] = L.face, f = box(L.face); f.className = 'c-face cp-frame'; cpInset(f, w, h, t0, .42, .42); rise(f, 0, 30); }
    let card = null;
    if (L.card) { card = box(L.card); card.className = 'c-card'; rise(card, 0); }
    for (const y of L.divs ?? []) { const d = div(`top:${y}px`, root); d.className = 'c-div'; A(d, [{transform: 'scaleX(0)', transformOrigin: '0 50%'}, {transform: 'scaleX(1)', transformOrigin: '0 50%'}], t0 + .25, .5, {e: EASE.soft}); }
    if (L.track) { const tr = box(L.track); tr.className = 'c-track'; const fl = div('', tr); fl.className = 'c-fill';
      A(tr, [{opacity: 0}, {opacity: 1}], t0 + .15, .3); A(fl, [{transform: 'scaleX(0)'}, {transform: 'scaleX(1)'}], t0 + .35, 1.1, {e: EASE.soft, f: 'both'}); }
    /* the giant number: one the speaker says, the screen's rows, or the picture's place */
    const filled = (L.slots ?? []).filter((s, k) => (s.k === 'row' || s.k === 'item') && (ch ? ch[k + 1] : meta.rows?.[k])).length;
    if (L.num) { const v = meta.num ?? (L.num.kind === 'say' ? num : L.num.kind === 'count' ? String(filled) : String(index + 1).padStart(2, '0'));
      const r = crmLine(root, v, 'c-num', {x: L.num.x, y: L.num.y, align: 'left', maxW: 620, half: L.num.size * .4}); r.firstChild.style.fontSize = `${L.num.size}px`;
      A(r, [{opacity: 0, transform: 'translateY(30px) scale(.85)', filter: 'blur(10px)'}, {opacity: 1, transform: 'none', filter: 'blur(0)'}], t0 + .12, .5, {e: EASE.soft}); }
    /* the blue line under the key word: it grows from its start (from the centre when the words are centred) */
    if (L.bar) { const b = div(`left:${L.bar.c ? L.bar.x - 170 : L.bar.x}px;top:${L.bar.y}px`, root); b.className = 'c-bar';
      A(b, [{transform: 'scaleX(0)', transformOrigin: L.bar.c ? '50% 50%' : '0 50%'}, {transform: 'scaleX(1)', transformOrigin: L.bar.c ? '50% 50%' : '0 50%'}], t0 + .35, .5, {e: EASE.soft, f: 'both'}); }
    const stage = L.pic ? box(L.pic) : box([540, 960, 1, 1]);
    if (!L.pic) stage.style.visibility = 'hidden';
    else A(stage, [{opacity: 0, transform: 'translateY(24px) scale(.94)', filter: 'blur(8px)'}, {opacity: 1, transform: 'none', filter: 'blur(0)'}], t0 + .1, .45, {e: EASE.soft});
    /* the screen's lines: the picture's next subtitles, grey ahead, lit when said (a still: the sheet's, said). A row: the lead at the
       left, the key word right-aligned blue; an item: its blue order number and the words; the pill: black, white words */
    const slots = [], G = '#C9C7C0', GB = '#B5C8F2', GW = 'rgba(255,255,255,.45)';
    (L.slots ?? []).forEach((s, k) => {
      const c = ch ? ch[k + 1] : null, still = !ch ? meta.rows?.[k] : null; if (!c && !still) return;
      const t = t0 + .3 + .1 * k, el = div('', root); el.className = 'c-text'; const parts = [], fin = [], pre = [];
      const put = (txt, cls, P, a, b) => { parts.push(crmLine(el, txt, cls, P).firstChild); fin.push(a); pre.push(b); };
      if (s.k === 'row') { const lab = c ? (c.lead || c.words) : still[0], val = c ? (c.lead ? c.key : '') : still[1];
        put(lab, 'c-cell', {x: s.x, y: s.y, align: 'left', maxW: 520}, '#151515', G);
        if (val) { parts.push(crmRight(el, val, 'c-val', s.vx, s.y, 300)); fin.push('#2F6FED'); pre.push(GB); } }
      else if (s.k === 'item') { put(String(k + 1).padStart(2, '0'), 'c-inum', {x: s.x, y: s.y, align: 'left'}, '#2F6FED', GB);
        put(c ? c.words : still, 'c-item', {x: s.x + 92, y: s.y, align: 'left', maxW: 920 - s.x - 92}, '#151515', G); }
      else if (s.k === 'white2') { const w0 = String(c ? c.words : still), ph = (w0.includes('|') ? w0.split('|') : w0.split(/\s+/)).map(x => x.trim()).filter(Boolean), m = Math.ceil(ph.length / 2);
        if (ph.length >= 2) { put(ph.slice(0, m).join(' '), 'c-white', s, '#FFFFFF', GW); put(ph.slice(m).join(' '), 'c-white', {...s, y: s.two}, '#FFFFFF', GW); }
        else put(ph.join(' '), 'c-white', {...s, y: (s.y + s.two) / 2}, '#FFFFFF', GW); }
      else if (s.k === 'pill') put(c ? c.words : still, 'c-pill', s, '#141414', '#A7A6A2');
      else { const cls = {sub: 'c-sub', blue: 'c-blue', white: 'c-white', total: 'c-total'}[s.k], blue = s.k === 'blue' || s.k === 'total';
        put(c ? c.words : String(still).replace(/\|/g, ' '), cls, s, blue ? '#2F6FED' : s.k === 'white' ? '#FFFFFF' : '#5A5853', blue ? GB : s.k === 'white' ? GW : G); }
      A(el, [{opacity: 0, transform: 'translateY(14px)'}, {opacity: 1, transform: 'none'}], t, .4, {e: EASE.soft});
      const prop = s.k === 'pill' ? 'background' : 'color';
      if (c) parts.forEach((p, i) => { p.style[prop] = pre[i]; });
      slots.push({s, parts, fin, pre, prop});
    });
    /* the corner marks (white on the video, dark on cream) */
    crmCorners(root, L.cc ?? 'dddd', t0);
    const F = {root, stage, cam: root, L, name, dark: false, t1, n: 0, meta, slots};
    if ((typeof CAPTIONS === 'undefined' || !CAPTIONS.length) && meta.rows) F.stillRows = meta.rows;
    return F;
  },
  /* between pictures: the white lead and the white key word at the chest over a blue line, moved below the chin when the face is low */
  speakerFrame(a, b) {
    const root = div('', SC), L = crmFit('talk', cpFaceBox(a, b)) ?? CRM.layouts.talk; root.className = 'c-root';
    const bar = div(`left:${L.bar.x - 170}px;top:${L.bar.y}px`, root); bar.className = 'c-bar';
    A(bar, [{transform: 'scaleX(0)'}, {transform: 'scaleX(1)'}], a + .35, .5, {e: EASE.soft, f: 'both'});
    crmCorners(root, 'wwww', a, true);   // still: a new root comes with every subtitle
    /* the line and the corners only between the pictures (this root stays on the page over the whole clip) */
    for (const e of root.children) { A(e, [{visibility: 'hidden'}, {visibility: 'visible'}], a - .02, .001, {f: 'both'}); A(e, [{visibility: 'visible'}, {visibility: 'hidden'}], b - .021, .001, {f: 'forwards'}); }
    return {root, cam: root, speaker: true, L, name: 'talk'};
  },
  /* the words: the picture's first subtitle (and every one between pictures) is the blue slanted lead + the black key word; each next
     one lights the screen's next line, or with no line left takes the lead and key word's place */
  text(F, T, lead, key) {
    const L = F.L ?? CRM.layouts.talk, el = div('', F.root ?? SC); el.className = 'c-text';
    const head = (t, swap) => {
      if (swap && F.head) A(F.head, [{opacity: 1}, {opacity: 0}], t - .04, .12, {f: 'forwards'});
      const h = div('', el); h.className = 'c-text'; F.head = h;
      const tIn = swap ? t + .08 : T.t0 + .15, fade = r => A(r, [{opacity: 0, filter: 'blur(8px)'}, {opacity: 1, filter: 'blur(0)'}], tIn, .35, {e: EASE.smooth});
      const lc = L.leadCls ?? 'c-lead';
      if (lead && L.lead) { const ph = (String(lead).includes('|') ? String(lead).split('|') : String(lead).split(/\s+/)).map(x => x.trim()).filter(Boolean);
        if (L.lead.two && ph.length >= 2) { const m = Math.ceil(ph.length / 2);
          fade(crmLine(h, ph.slice(0, m).join(' '), lc, L.lead)); fade(crmLine(h, ph.slice(m).join(' '), lc, {...L.lead, y: L.lead.two})); }
        else fade(crmLine(h, ph.join(' '), lc, L.lead.two ? {...L.lead, y: (L.lead.y + L.lead.two) / 2} : L.lead)); }
      if (key && L.key) { const r = crmLine(h, key, L.keyCls ?? 'c-key', L.key);
        A(r, [{opacity: 0, transform: 'scale(.88)', filter: 'blur(8px)'}, {opacity: 1, transform: 'scale(1.03)', offset: .7}, {opacity: 1, transform: 'none', filter: 'blur(0)'}], T.hit - .05, .42, {e: EASE.soft});
        sfx('softswish', T.hit - .05, -21); } };
    if (F.speaker || !F.L) {
      head(T.t0);
      if (F.speaker && T.clip) {
        A(el, [{visibility: 'hidden'}, {visibility: 'visible'}], T.b[0] - .02, .001); A(el, [{visibility: 'visible'}, {visibility: 'hidden'}], T.end - .021, .001, {f: 'forwards'});
        return null;
      }
      return el;
    }
    const words = [lead, key].map(s => String(s ?? '').trim()).filter(Boolean).join(' ');
    if (!words && !(F.stillRows && T.clip !== true)) return null;
    const n = F.n++, start = T.b[0] - .02, S = F.slots[n - 1];
    if (n === 0) head(T.t0);
    else if (S) { S.parts.forEach((p, i) => A(p, [{[S.prop]: S.pre[i]}, {[S.prop]: S.fin[i]}], start, .25, {f: 'forwards'})); sfx('softswish', start, -26); }
    else head(start, true);
    if (T.clip) { A(el, [{visibility: 'hidden'}, {visibility: 'visible'}], start, .001); return null; }
    return el;
  },
});
/* the four corner marks of the safe zone (60–920 × 220–1660), 40 px arms, 3 px; cc = their colours (w / d) tl tr bl br */
function crmCorners(root, cc, t0, still = false) {
  [[60, 220, 'Top', 'Left'], [880, 220, 'Top', 'Right'], [60, 1620, 'Bottom', 'Left'], [880, 1620, 'Bottom', 'Right']].forEach(([x, y, v, h], k) => {
    const c = div(`left:${x}px;top:${y}px;border-${v.toLowerCase()}-width:3px;border-${h.toLowerCase()}-width:3px;border-color:${cc[k] === 'w' ? 'rgba(255,255,255,.9)' : '#1A1A1A'}`, root); c.className = 'c-corner';
    if (!still) A(c, [{opacity: 0, transform: `translate(${h === 'Left' ? -14 : 14}px,${v === 'Top' ? -14 : 14}px)`}, {opacity: 1, transform: 'none'}], t0 + .05, .45, {e: EASE.soft}); });
}
