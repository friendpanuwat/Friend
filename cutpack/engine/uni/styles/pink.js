/* =====================================================================
   STYLE · pink — "การ์ดชมพู" (Pink Cards) (Friend 2026-11-18, the 10th of the new sheets: "นี่คือสไตล์ต่อไป", the 12-shot sheet and
   seven shots full size: 01 02 03 04 07 09 11). Places, sizes and colours are measured on the full-size shots, the other five on the
   sheet (each 300 × 533, × 3.6, about ±4 px), then held to the rules every style shares (styles/common.js). The first light style:
   a lavender screen, white cards with a soft shadow, tilted cards behind (dark navy and pink), one pink accent. The pictures: the
   glow-line template set first, dark lines on the white cards, the lit part pink (GLASSY.pink).
   Friend's rules for the new styles: no small spaced labels ("WEEK 1", "DAY 1", "DAY 2 · BOOK A MOVER", "APP", "DAY 3", "MOVING DAY",
   "BUDGET", "LESSON", "RECAP · 7 DAYS", "NEXT"), the words in a card are the spoken words (grey ahead, dark when said), and the
   sheet is read for its layout only (2026-11-18: "ต่อไปนี้ไม่ต้องสนเนื้อหาในตัวอย่างให้ดูแค่สไตล์การจัดวางองค์ประกอบของภาพก็พอ"):
   every screen is a generic screen. The numbers 01–04 on the recap cards are their order, kept.
   The 7-item form:
   1 frame    one of 12 layouts (PNK.layouts, named after Friend's shots): the speaker's big card over a white card (a title and a
              picture, or bullets); the speaker's card beside a white card; a white card under the words; the speaker full screen
              with a white card at the hands (or a pink pill); a budget card over the words and the speaker's small card; a recap of
              four cards (stills only)
   2 surface  a lavender screen (#F1F0F8 → #E2E0EE); white cards rounded 40 with a soft shadow; tilted cards behind (navy, pink)
   3 drawing  the glow-line pictures: dark lines, white bodies, the lit part a pink outline, icon and word with a soft pink glow
   4 colours  lavender · white · dark ink (#22212B) · one pink (#E8469A)
   5 words    a lead (Kanit 400 60: dark on the screen, white on the video) + the key word pink (Kanit 600 102); card titles Kanit
              500 40, rows Kanit 400 44, values Kanit 600 52
   6 motion   cards rise in out of a blur, the tilted cards swing in behind them, lines light from grey on their words
   7 sound    whoosh on a screen cut, a soft swish on the key word, a soft tick on a line
   ===================================================================== */
const PNK = {
  /* boxes [x, y, w, h] · lead / key {x, y (centre), align, maxW, two: the lead on two lines (y, y2)} · face = the speaker's card
     [x, y, w, h] · card = a white card · backs = the tilted cards behind a card: [box index ('face' | 'card'), colour, angle, dx, dy] ·
     pic = the picture box · slots = the lines the next subtitles fill, in order: {k: 'title' | 'row' | 'total' | 'bullet' | 'pill',
     x, y, vx (a value's right edge), align, maxW} · onVideo = the lead is white · noPic = no picture on the sheet. Moved where the
     sheet ran under TikTok's search bar (the speaker's cards from y 140–170 → 220), buttons (the speaker's cards end at x 920: the big
     one 110–970 → 150–920, shot 07's 90–990 → 100–920, shot 09's small one 660–1000 → 580–920; the pictures and words to 920; the
     white cards stay as wide as the sheet, behind the buttons). */
  layouts: {
    talk:        {speaker: true, onVideo: true, lead: {x: 540, y: 1012}, key: {x: 540, y: 1140}},
    stack_hook:  {screen: true, face: [150, 220, 770, 910], backs: [['face', '#1E1E2A', -5, -26, 34], ['face', '#D63E8A', 5, 26, 34]], onVideo: true,
                  lead: {x: 535, y: 874}, key: {x: 540, y: 1000}, card: [90, 1130, 900, 520], pic: [200, 1300, 680, 310],
                  slots: [{k: 'title', x: 144, y: 1241, align: 'left', maxW: 600}]},                                                   // shot 01
    side_cards:  {screen: true, face: [60, 220, 460, 775], backs: [['face', '#C0397C', -4, -14, 14]], card: [560, 220, 460, 770], pic: [600, 380, 310, 470],
                  lead: {x: 540, y: 1125, two: 1205}, key: {x: 540, y: 1333}},                                                         // shot 02
    graphic_card:{screen: true, lead: {x: 540, y: 543}, key: {x: 540, y: 672}, card: [90, 800, 900, 840], backs: [['card', '#1E1E2A', -5, -10, 40], ['card', '#D63E8A', 5, 10, 40]],
                  pic: [200, 975, 700, 580], slots: [{k: 'title', x: 152, y: 878, align: 'left', maxW: 600}]},                         // shot 03
    full_row:    {speaker: true, onVideo: true, lead: {x: 540, y: 1015}, key: {x: 540, y: 1161}, card: [90, 1300, 900, 340], pic: [300, 1395, 480, 225],
                  slots: [{k: 'title', x: 142, y: 1352, align: 'left', maxW: 600}]},                                                   // shot 04
    full_stat:   {speaker: true, noPic: true, need: 1, onVideo: true, lead: {x: 540, y: 1012, two: 1098}, key: {x: 540, y: 1246, big: true},
                  slots: [{k: 'pill', x: 540, y: 1498, maxW: 600}]},                                                                   // shot 05 (the pink pill: the next subtitle)
    stack_wave:  {screen: true, face: [150, 220, 770, 910], backs: [['face', '#1E1E2A', -5, -26, 34], ['face', '#D63E8A', 5, 26, 34]], onVideo: true,
                  lead: {x: 535, y: 875}, key: {x: 535, y: 1004}, card: [90, 1130, 900, 520], pic: [300, 1290, 480, 330],
                  slots: [{k: 'title', x: 144, y: 1241, align: 'left', maxW: 600}]},                                                   // shot 06
    asym_ladder: {screen: true, face: [100, 220, 820, 840], card: [510, 990, 500, 650], backs: [['card', '#C0397C', 4, 14, 14]], pic: [580, 1200, 330, 380],
                  lead: {x: 62, y: 1225, two: 1312, align: 'left', maxW: 430}, key: {x: 62, y: 1436, align: 'left', maxW: 430},
                  slots: [{k: 'title', x: 563, y: 1123, align: 'left', maxW: 340}]},                                                   // shot 07
    full_chevrons:{speaker: true, onVideo: true, lead: {x: 540, y: 1012}, key: {x: 540, y: 1138}, card: [90, 1300, 900, 338], pic: [300, 1395, 480, 225],
                  slots: [{k: 'title', x: 140, y: 1354, align: 'left', maxW: 600}]},                                                   // shot 08
    budget_card: {screen: true, noPic: true, need: 2, card: [90, 220, 900, 760], face: [580, 1020, 340, 605],
                  lead: {x: 60, y: 1125, align: 'left', maxW: 480}, key: {x: 62, y: 1262, align: 'left', maxW: 480},
                  slots: [{k: 'title', x: 153, y: 290, align: 'left', maxW: 600}, {k: 'row', x: 153, vx: 920, y: 427}, {k: 'row', x: 153, vx: 920, y: 567},
                          {k: 'row', x: 153, vx: 920, y: 707}, {k: 'total', x: 153, vx: 920, y: 847}], divider: 784},                   // shot 09
    stack_tips:  {screen: true, noPic: true, need: 2, face: [150, 220, 770, 910], backs: [['face', '#1E1E2A', -5, -26, 34], ['face', '#D63E8A', 5, 26, 34]], onVideo: true,
                  lead: {x: 540, y: 875}, key: {x: 540, y: 1004}, card: [90, 1130, 900, 520],
                  slots: [{k: 'title', x: 140, y: 1242, align: 'left', maxW: 640}, {k: 'bullet', x: 182, y: 1354, align: 'left', maxW: 700},
                          {k: 'bullet', x: 182, y: 1454, align: 'left', maxW: 700}, {k: 'bullet', x: 182, y: 1552, align: 'left', maxW: 700}]},   // shot 10
    recap_grid:  {screen: true, still: true, lead: {x: 540, y: 395}, key: {x: 540, y: 515},
                  four: [[90, 620, 430, 490], [555, 620, 435, 490], [90, 1150, 430, 490], [555, 1150, 435, 490]]},                       // shot 11 (four pictures: stills only)
    stack_cta:   {screen: true, face: [150, 220, 770, 910], backs: [['face', '#1E1E2A', -5, -26, 34], ['face', '#D63E8A', 5, 26, 34]], onVideo: true,
                  lead: {x: 535, y: 875}, key: {x: 535, y: 1004}, card: [90, 1130, 900, 520], pic: [200, 1285, 680, 345],
                  slots: [{k: 'title', x: 140, y: 1242, align: 'left', maxW: 640}]},                                                   // shot 12 (a generic screen)
  },
  /* RANDOM, as the other styles (every screen generic: Friend's sheet is read for its layout only); a screen without a picture only
     with the subtitles it needs, not first and not twice within 5 pictures; among those with a picture the ones that show its shape
     at least 75 % as big as the best; then the least used; then at random from the run's seed */
  pool: ['stack_hook', 'side_cards', 'graphic_card', 'full_row', 'full_stat', 'stack_wave', 'asym_ladder', 'full_chevrons', 'budget_card', 'stack_tips', 'stack_cta'],
  byCat: {},
  keep: .75, noPicGap: 4, sinceNoPic: 4,
  used: {}, last: null,
};
function pnkChunks(t0, t1) {
  if (typeof CAPTIONS === 'undefined' || !CAPTIONS.length) return null;
  return CAPTIONS.filter(c => Math.min(c.t1, t1) - Math.max(c.t0, t0) >= .15).map(c => { const n = c.parts.length, k = (p, i) => p[2] ?? (i === n - 1 ? 'k' : 'l');
    return {t0: c.t0, t1: c.t1, words: c.parts.map(p => p[0]).join(' '), lead: c.parts.filter((p, i) => k(p, i) === 'l').map(p => p[0]).join(' '), key: c.parts.filter((p, i) => k(p, i) === 'k').map(p => p[0]).join(' ')}; });
}
/* fit a speaker screen to this face [x0, top, x1, chin]: the words and the card move down so the words start 30 under the chin; the
   card keeps its bottom at 1660 or less (the picture shortens, at least 160); null = no room. Screens: always fit. */
function pnkFit(name, f) {
  const L = JSON.parse(JSON.stringify(PNK.layouts[name])); if (!L.speaker) return L;
  const [, , , chin] = f, d = Math.max(0, chin + 30 - (L.lead.y - 40)); if (!d) return L;
  L.lead.y += d; if (L.lead.two) L.lead.two += d; L.key.y += d;
  for (const s of L.slots ?? []) s.y += d;
  if (L.card) { L.card[1] += d; const over = L.card[1] + L.card[3] - 1660; if (over > 0) { L.card[3] -= over; if (L.card[3] < 200) return null; } }
  if (L.pic) { L.pic[1] += d; const lim = (L.card ? L.card[1] + L.card[3] - 20 : 1660) - L.pic[1]; L.pic[3] = Math.min(L.pic[3], lim); if (L.pic[3] < 160) return null; }
  if (L.key.y + (L.key.big ? 80 : 70) > 1660) return null;
  for (const s of L.slots ?? []) if (s.y + 30 > 1660 || (L.card && s.y > L.card[1] + L.card[3] - 20)) return null;
  return L;
}
/* a line of words at (x, y), left / centre / right, shrunk (never wrapped) to maxW and the safe zone (a .cp-row: checked) */
function pnkLine(parent, txt, cls, {x, y, align = 'center', maxW = 820}) {
  const row = div('', parent); row.className = 'p-row cp-row'; const sp = document.createElement('span'); sp.className = cls; sp.textContent = txt; row.appendChild(sp);
  const tx = align === 'right' ? '-100%' : align === 'left' ? '0' : '-50%';
  Object.assign(row.style, {left: `${x}px`, top: `${y}px`, translate: `${tx} -50%`, transformOrigin: align === 'right' ? '100% 50%' : align === 'left' ? '0 50%' : '50% 50%'});
  const x1 = y + 60 < CP.safeTop.y ? CP.safeTop.x1 : CP.safe[2], x0 = CP.safe[0];
  const room = align === 'right' ? x - x0 : align === 'left' ? x1 - x : 2 * Math.min(x - x0, x1 - x);
  FITS.push(() => { const w = sp.offsetWidth, m = Math.min(maxW, room); if (w > m) row.style.scale = String(m / w); });
  return row;
}

STYLE('pink', {
  name: 'การ์ดชมพู',
  layouts: PNK.layouts,
  css: `
@font-face{font-family:"PnkText";src:url(fonts/Kanit-400-thai.woff);font-weight:400;unicode-range:U+02D7,U+0303,U+0331,U+0E01-0E5B,U+200C-200D,U+25CC}
@font-face{font-family:"PnkText";src:url(fonts/Kanit-400-latin.woff);font-weight:400;unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+2000-206F}
@font-face{font-family:"PnkMid";src:url(fonts/Kanit-500-thai.woff);font-weight:500;unicode-range:U+02D7,U+0303,U+0331,U+0E01-0E5B,U+200C-200D,U+25CC}
@font-face{font-family:"PnkMid";src:url(fonts/Kanit-500-latin.woff);font-weight:500;unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+2000-206F}
@font-face{font-family:"PnkBold";src:url(fonts/Kanit-600-thai.woff);font-weight:600;unicode-range:U+02D7,U+0303,U+0331,U+0E01-0E5B,U+200C-200D,U+25CC}
@font-face{font-family:"PnkBold";src:url(fonts/Kanit-600-latin.woff);font-weight:600;unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+2000-206F}
.p-root{position:absolute;inset:0;--ink:#22212B;--ac:#E8469A;--lw:5;--sd:#22212B;--fl:rgba(255,255,255,.9);--text:#22212B}
.p-screen{background:linear-gradient(180deg,#F1F0F8 0%,#ECEBF5 40%,#E6E4F0 75%,#E2E0EE 100%);background-color:#EAE9F4;overflow:hidden}
.p-card{position:absolute;border-radius:40px;background:#FFFFFF;box-shadow:0 24px 50px rgba(60,55,100,.22),0 4px 12px rgba(60,55,100,.08)}
.p-back{position:absolute;border-radius:40px;transform-origin:50% 100%}
.p-face{position:absolute;overflow:hidden;border-radius:40px;box-shadow:0 24px 50px rgba(30,25,60,.3)}
.p-text{position:absolute;inset:0}
.p-row{position:absolute;white-space:nowrap}
.p-lead{font-family:"PnkText";font-weight:400;font-size:60px;line-height:1.3;color:#22212B}
.p-lead.p-on{color:#FFFFFF;text-shadow:0 0 3px rgba(0,0,0,.7),0 2px 12px rgba(0,0,0,.5)}
.p-key{display:inline-block;padding:.08em 0;font-family:"PnkBold";font-weight:600;font-size:102px;line-height:1.2;color:#E8469A}
.p-key.p-on{text-shadow:0 0 3px rgba(0,0,0,.35),0 3px 14px rgba(0,0,0,.35)}
.p-key.p-big{font-size:110px}
.p-title{font-family:"PnkMid";font-weight:500;font-size:40px;line-height:1.3;color:#22212B}
.p-cell{font-family:"PnkText";font-weight:400;font-size:44px;line-height:1.3;color:#22212B}
.p-val{font-family:"PnkBold";font-weight:600;font-size:52px;line-height:1.3;color:#22212B}
.p-bul{font-family:"PnkText";font-weight:400;font-size:40px;line-height:1.3;color:#22212B}
.p-dot{position:absolute;width:16px;height:16px;border-radius:50%;background:#E8469A;translate:-50% -50%}
.p-pill{display:inline-block;background:#E8469A;color:#FFFFFF;border-radius:30px;padding:4px 34px 8px;font-family:"PnkBold";font-weight:600;font-size:36px;line-height:1.3;box-shadow:0 0 22px rgba(232,70,154,.5)}
.p-div{position:absolute;height:2px;background:#DEDDE3}
.p-num{position:absolute;font-family:"PnkBold";font-weight:600;font-size:26px;letter-spacing:8px;color:#E8469A}
.p-cap{font-family:"PnkMid";font-weight:500;font-size:43px;line-height:1.3;color:#22212B}
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
  fitSize(ar, t0, t1) { const face = cpFaceBox(t0, t1); return cpFitSize(ar, PNK.pool.filter(n => !PNK.layouts[n].noPic && pnkFit(n, face)), n => pnkFit(n, face)?.pic, PNK.keep, n => !!PNK.layouts[n].speaker); },
  fitSurface() { const r = div('', SC); r.className = 'p-root p-screen'; return r; },

  frame(t0, t1, {index, scene}) {
    const meta = SCENES[scene]?.meta ?? {}, face = cpFaceBox(t0, t1), ch = pnkChunks(t0, t1);
    const more = ch ? Math.max(0, ch.length - 1) : (meta.rows?.length ?? 0);
    let name = meta.layout;
    if (!name) {
      const ok = n => { const L = PNK.layouts[n]; if (L.noPic && (more < (L.need ?? 2) || index === 0 || PNK.sinceNoPic < PNK.noPicGap)) return false; return !!pnkFit(n, face); };
      const want = PNK.byCat[String(meta.cat ?? '').slice(0, 3)];
      if (want && ok(want)) name = want;
      else {
        let pool = PNK.pool.filter(n => n !== PNK.last && ok(n));
        if (!pool.length) pool = ['graphic_card', 'stack_hook'].filter(n => n !== PNK.last);
        const ar = cpShape(meta.variant, t0);   // the picture's shape in this clip (REAL_SHAPES), else the sample's (fit pick, 2026-11-18)
        if (ar) {
          const size = n => { const p = pnkFit(n, face)?.pic; if (!p) return 0; const [, , w, h] = p; return ar > w / h ? w * w / ar : h * h * ar; };
          pool = cpSizeKeep(pool, size, PNK.keep, n => !!PNK.layouts[n].speaker, n => !!PNK.layouts[n].noPic);   // the speaker's screens with a picture: a floor, no race on size (Friend 2026-11-18: "อยากให้ ก ขึ้นบ้าง (ทุกสไตล์เลยนะ)")
        }
        const least = Math.min(...pool.map(n => PNK.used[n] ?? 0)); pool = pool.filter(n => (PNK.used[n] ?? 0) === least);
        name = pool[Math.floor(cpRand('screen' + index) * pool.length)];
      }
    }
    PNK.used[name] = (PNK.used[name] ?? 0) + 1; PNK.last = name; PNK.sinceNoPic = PNK.layouts[name].noPic ? 0 : PNK.sinceNoPic + 1;
    const L = (meta.layout ? JSON.parse(JSON.stringify(PNK.layouts[name])) : pnkFit(name, face)) ?? JSON.parse(JSON.stringify(PNK.layouts.graphic_card));
    const screen = !L.speaker, root = div('', SC); root.className = 'p-root' + (screen ? ' p-screen' : '');
    const box = ([x, y, w, h], parent = root) => div(`left:${x}px;top:${y}px;width:${w}px;height:${h}px`, parent);
    const rise = (e, k, dy = 40) => A(e, [{opacity: 0, transform: `translateY(${dy}px) scale(.96)`, filter: 'blur(10px)'}, {opacity: 1, transform: 'none', filter: 'blur(0)'}], t0 + .04 + .1 * k, .45, {e: EASE.soft});
    if (screen) {
      A(root, [{opacity: 0, filter: 'blur(14px)', transform: 'scale(1.03)'}, {opacity: 1, filter: 'blur(0)', transform: 'none'}], t0 - .04, .35, {e: EASE.smooth});
      sfx('whoosh', t0 - .1, -20);
    }
    A(root, [{opacity: 1, filter: 'blur(0)'}, {opacity: 0, filter: 'blur(10px)'}], t1 - .3, .3, {e: EASE.out, f: 'forwards'});
    /* the tilted cards behind (they swing in to their angle) */
    for (const [of, col, ang, dx, dy] of L.backs ?? []) { const [x, y, w, h] = of === 'face' ? L.face : L.card, b = box([x + dx, y + dy, w, h - dy]); b.className = 'p-back'; b.style.background = col;
      A(b, [{opacity: 0, transform: 'rotate(0deg)'}, {opacity: 1, transform: `rotate(${ang}deg)`}], t0 + .1, .55, {e: EASE.soft, f: 'both'}); }
    if (L.face) { const [x, y, w, h] = L.face, f = box(L.face); f.className = 'p-face cp-frame'; cpInset(f, w, h, t0, w > 600 ? .3 : .42, .4); rise(f, 0, 30); }
    let card = null;
    if (L.card) { card = box(L.card); card.className = 'p-card'; rise(card, 1); }
    if (L.divider && card) { const d = div(`left:${153 - L.card[0]}px;top:${L.divider - L.card[1]}px;width:${920 - 153}px`, card); d.className = 'p-div'; }
    /* the recap: four cards, their order number, the words under the picture (a still's meta.rows) */
    let stages = null;
    if (L.four) stages = L.four.map((c, k) => { const e = box(c); e.className = 'p-card'; rise(e, k);
      const n = div('left:40px;top:38px', e, String(k + 1).padStart(2, '0')); n.className = 'p-num';
      if (meta.rows?.[k]) pnkLine(root, meta.rows[k], 'p-cap', {x: c[0] + c[2] / 2, y: c[1] + 425, maxW: Math.min(c[2] - 60, 920 - c[0] - 20) * 2});
      return box([40, 95, Math.min(c[2] - 80, 900 - c[0] - 40), 270], e); });
    const inCard = p => card && p[0] >= L.card[0] && p[1] >= L.card[1] && p[0] + p[2] <= L.card[0] + L.card[2] + 1;   // the picture in its card: the bridge reads the white card as its ground
    const stage = L.pic ? (inCard(L.pic) ? box([L.pic[0] - L.card[0], L.pic[1] - L.card[1], L.pic[2], L.pic[3]], card) : box(L.pic)) : box([540, 960, 1, 1]);
    if (!L.pic) stage.style.visibility = 'hidden';
    else A(stage, [{opacity: 0, transform: 'translateY(24px) scale(.94)', filter: 'blur(8px)'}, {opacity: 1, transform: 'none', filter: 'blur(0)'}], t0 + .1, .45, {e: EASE.soft});
    /* the card's lines: the picture's next subtitles, grey ahead, dark when said (a still: the sheet's, said). A row: the lead at the
       left, the key word right-aligned (the total's in pink); a bullet: a pink dot; the pill: pink, white words */
    const slots = [];
    (L.slots ?? []).forEach((s, k) => {
      const c = ch ? ch[k + 1] : null, still = !ch ? meta.rows?.[k] : null; if (!c && !still) return;
      const t = t0 + .3 + .1 * k, el = div('', root); el.className = 'p-text'; const parts = [];
      if (s.k === 'row' || s.k === 'total') { const lab = c ? (c.lead || c.words) : still[0], val = c ? (c.lead ? c.key : '') : still[1];
        parts.push(pnkLine(el, lab, 'p-cell', {x: s.x, y: s.y, align: 'left', maxW: 470}).firstChild); if (val) parts.push(pnkLine(el, val, 'p-val', {x: s.vx, y: s.y, align: 'right', maxW: 330}).firstChild); }
      else if (s.k === 'pill') parts.push(pnkLine(el, c ? c.words : still, 'p-pill', s).firstChild);
      else { parts.push(pnkLine(el, c ? c.words : still, s.k === 'bullet' ? 'p-bul' : 'p-title', s).firstChild);
        if (s.k === 'bullet') { const d = div(`left:${s.x - 32}px;top:${s.y}px`, el); d.className = 'p-dot'; } }
      A(el, [{opacity: 0, transform: 'translateY(14px)'}, {opacity: 1, transform: 'none'}], t, .4, {e: EASE.soft});
      const final = parts.map((p, i) => s.k === 'total' && i === 1 ? '#E8469A' : s.k === 'pill' ? '#FFFFFF' : '#22212B');
      if (c && s.k !== 'pill') parts.forEach(p => { p.style.color = '#A9A7B5'; });
      if (c && s.k === 'pill') parts[0].style.background = '#E7A9C9';
      if (!c && s.k === 'total' && parts[1]) parts[1].style.color = '#E8469A';
      slots.push({s, parts, final});
    });
    const F = {root, stage, stages, cam: root, L, name, dark: false, t1, n: 0, meta, slots};
    if ((typeof CAPTIONS === 'undefined' || !CAPTIONS.length) && meta.rows) F.stillRows = meta.rows;
    return F;
  },
  /* between pictures: the white lead and the pink key word at the chest, moved below the chin when the face is low */
  speakerFrame(a, b) {
    const root = div('', SC); root.className = 'p-root';
    return {root, cam: root, speaker: true, L: pnkFit('talk', cpFaceBox(a, b)) ?? PNK.layouts.talk, name: 'talk'};
  },
  /* the words: the picture's first subtitle (and every one between pictures) is the lead + the pink key word; each next one lights
     the card's next line, or with no line left takes the lead and key word's place */
  text(F, T, lead, key) {
    const L = F.L ?? PNK.layouts.talk, el = div('', F.root ?? SC); el.className = 'p-text';
    const on = L.onVideo ? ' p-on' : '';
    const head = (t, swap) => {
      if (swap && F.head) A(F.head, [{opacity: 1}, {opacity: 0}], t - .04, .12, {f: 'forwards'});
      const h = div('', el); h.className = 'p-text'; F.head = h;
      const tIn = swap ? t + .08 : T.t0 + .15, fade = r => A(r, [{opacity: 0, filter: 'blur(8px)'}, {opacity: 1, filter: 'blur(0)'}], tIn, .35, {e: EASE.smooth});
      if (lead && L.lead) { const ph = String(lead).split(/\s*\|\s*|\s+/).filter(Boolean);
        if (L.lead.two && ph.length >= 2) { const m = Math.ceil(ph.length / 2);
          fade(pnkLine(h, ph.slice(0, m).join(' '), 'p-lead' + on, L.lead)); fade(pnkLine(h, ph.slice(m).join(' '), 'p-lead' + on, {...L.lead, y: L.lead.two})); }
        else fade(pnkLine(h, ph.join(' '), 'p-lead' + on, L.lead.two ? {...L.lead, y: (L.lead.y + L.lead.two) / 2} : L.lead)); }
      if (key && L.key) { const r = pnkLine(h, key, 'p-key' + on + (L.key.big ? ' p-big' : ''), L.key);
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
    else if (S) {
      if (S.s.k === 'pill') A(S.parts[0], [{background: '#E7A9C9'}, {background: '#E8469A'}], start, .25, {f: 'forwards'});
      else S.parts.forEach((p, i) => A(p, [{color: '#A9A7B5'}, {color: S.final[i]}], start, .25, {f: 'forwards'}));
      sfx('softswish', start, -26); }
    else head(start, true);
    if (T.clip) { A(el, [{visibility: 'hidden'}, {visibility: 'visible'}], start, .001); return null; }
    return el;
  },
});
