/* =====================================================================
   STYLE · horizon — "ขอบฟ้าส้ม" (Orange Horizon) (Friend 2026-11-18, the 8th of the new sheets: "สไตล์ต่อไป", the 12-shot sheet
   and four shots full size: 04, 06, 08, 11). Places, sizes and colours are measured on the full-size shots; the other eight (the
   speaker full screen) on the sheet (each 300 × 533, × 3.6, about ±4 px). Then held to the rules every style shares
   (styles/common.js: safe zone, frames below the search bar, centred words, the video filling its frame, seeded random, never over
   the face). The pictures: the glow-line template set first, in a warm glass look with orange light (GLASSY.horizon).
   Friend's rules for the new styles: no small spaced labels ("STEP 3 · PACKING", "FIRST REVIEW", "WHAT WORKED", "MONTH 1 · SALES",
   "RECAP"), the words in a card are the spoken words: the picture's first subtitle is the lead + key word, each next one fills the
   card's next line (a title, a quote, a row with an orange tick, a row with a number), on screen from the start in grey and white
   when said (the way the yellow and HUD styles passed). The numbers 01–04 on the recap cards are their order, kept.
   The 7-item form:
   1 frame    one of 12 layouts (HOR.layouts, named after Friend's shots): the speaker full screen with the lead at both sides over
              the key word and a picture at the hands (or a dark card of words at the chest); a dark screen with the words, a picture
              and a line under it; the speaker's orange-edged card beside a review card, or over a card of numbers; a recap of four
              cards (stills only)
   2 surface  dark brown screen, a planet's orange rim rising from the bottom with its glow (no stars: Friend 2026-11-18 "ลบดาวที่
              background ออกด้วยนะครับ")
   3 drawing  the glow-line pictures: thick warm-white lines glowing, the lit part an orange outline and icon, dark warm bodies
   4 colours  dark brown · warm white · one orange (#FB7A1A)
   5 words    a white lead (Kanit 400 60; two phrases go to both sides, small: 38) + the key word orange (Kanit 900 130) glowing; cards: Kanit 400
   6 motion   screens fade in out of a blur, cards rise, lines light from grey on their words, ticks pop
   7 sound    whoosh on a screen cut, a soft swish on the key word, a soft tick on a line
   ===================================================================== */
const HOR = {
  /* boxes [x, y, w, h] · lead / key {x, y (centre), maxW, align} · lead.mode: 'sides' (two phrases left and right, one in the middle),
     'stack' (phrases on two lines) · pic = the picture box · face = the speaker's card [x, y, w, h, radius] · card = a dark card ·
     slots = the card's lines in the order the next subtitles fill them: {k: 'title' | 'sub' | 'quote' | 'row' | 'num' | 'line', x, y,
     align, maxW} (row: a tick at tickX; num: the label at x, the value right-aligned at vx) · noPic = no picture on the sheet ·
     fitFrom = on the speaker, what is at or below it moves under the chin. Moved where the sheet ran under TikTok's buttons (the
     cards' words and ticks to x 920, the right side lead's end 1030 → 920) and search bar (the speaker's cards from y 170 → 220). */
  layouts: {
    talk:         {speaker: true, fitFrom: 1000, lead: {x: 540, y: 1040, mode: 'sides'}, key: {x: 540, y: 1162}},
    full_hook:    {speaker: true, fitFrom: 1000, lead: {x: 540, y: 1040, mode: 'sides'}, key: {x: 540, y: 1162}, pic: [210, 1290, 660, 340]},   // shot 01
    full_stack_rail: {speaker: true, fitFrom: 1000, lead: {x: 540, y: 1040, mode: 'stack'}, key: {x: 540, y: 1222}, pic: [360, 1320, 460, 330]},   // shot 02
    full_float_card: {speaker: true, fitFrom: 1000, lead: {x: 540, y: 1040}, key: {x: 540, y: 1155}, card: [90, 1268, 900, 392], pic: [650, 1290, 270, 350],
                  slots: [{k: 'title', x: 150, y: 1400, align: 'left', maxW: 470}, {k: 'sub', x: 150, y: 1470, align: 'left', maxW: 470}]},   // shot 03
    dark_graphic: {screen: true, lead: {x: 540, y: 600}, key: {x: 540, y: 733}, pic: [140, 930, 780, 430],   /* (the sheet's 140–940: the box ends at 920) */ slots: [{k: 'line', x: 540, y: 1518, maxW: 820}]},   // shot 04
    full_side_ladder: {speaker: true, fitFrom: 1000, lead: {x: 540, y: 1040, mode: 'sides'}, key: {x: 540, y: 1150}, pic: [330, 1300, 420, 360]},   // shot 05
    inset_review: {screen: true, noPic: true, face: [60, 220, 500, 840, 36], lead: {x: 612, y: 537, align: 'left', maxW: 308}, key: {x: 612, y: 678, align: 'left', maxW: 308},
                  card: [60, 1110, 960, 530],
                  slots: [{k: 'quote', x: 612, y: 878, align: 'left', maxW: 300}, {k: 'row', x: 112, y: 1278, align: 'left', maxW: 700, tickX: 886},
                          {k: 'row', x: 112, y: 1388, align: 'left', maxW: 700, tickX: 886}, {k: 'row', x: 112, y: 1498, align: 'left', maxW: 700, tickX: 886}]},   // shot 06
    full_side_diagonal: {speaker: true, fitFrom: 1000, lead: {x: 540, y: 1040, mode: 'sides'}, key: {x: 540, y: 1160}, pic: [280, 1290, 520, 360]},   // shot 07
    float_cards:  {screen: true, noPic: true, face: [200, 220, 680, 760, 36], card: [60, 1030, 960, 610], lead: {x: 112, y: 1100, align: 'left', maxW: 800, small: true},
                  key: {x: 110, y: 1195, align: 'left', maxW: 800, stat: true},
                  slots: [{k: 'num', x: 112, vx: 910, y: 1366}, {k: 'num', x: 112, vx: 910, y: 1461}, {k: 'num', x: 112, vx: 910, y: 1556}]},   // shot 08
    full_side_cycle: {speaker: true, fitFrom: 1000, lead: {x: 540, y: 1040, mode: 'sides'}, key: {x: 540, y: 1160}, pic: [290, 1290, 520, 350]},   // shot 09
    full_stack_wave: {speaker: true, fitFrom: 1000, lead: {x: 540, y: 1035, mode: 'stack'}, key: {x: 540, y: 1222}, pic: [290, 1320, 500, 330]},   // shot 10
    recap_grid:   {screen: true, still: true, lead: {x: 540, y: 408}, key: {x: 540, y: 522, size: 117},
                  four: [[60, 680, 465, 470], [555, 680, 465, 470], [60, 1180, 465, 470], [555, 1180, 465, 470]]},   // shot 11 (four pictures: stills only)
    full_cta:     {speaker: true, fitFrom: 1000, lead: {x: 540, y: 1040, mode: 'sides'}, key: {x: 540, y: 1165}, pic: [590, 1320, 330, 330]},   // shot 12
  },
  /* RANDOM, as the other styles: a call to action (B15) gets shot 12, a number (B01) the numbers card (when a number is said); every
     other picture takes one of `pool` (never the one before it) where the face leaves room (horFit), a screen without a picture only
     with at least 2 more subtitles for its lines, not first and not twice within 5 pictures, among those with a picture the ones that
     show its shape at least 75 % as big as the best, then the least used, then at random from the run's seed */
  pool: ['full_hook', 'full_stack_rail', 'full_float_card', 'dark_graphic', 'full_side_ladder', 'inset_review', 'full_side_diagonal', 'full_side_cycle', 'full_stack_wave', 'full_cta'],   // + the call-to-action screen as any screen (Friend 2026-11-18: "ทำตามที่คุณแนะนำ" · the sheets are read for their layout only)
  byCat: {B15: 'full_cta', B01: 'float_cards'},
  keep: .75, noPicGap: 4, sinceNoPic: 4,
  planet: {cx: 540, cy: 1950, r: 632},          // the rim: top at y 1318 (shot 04), the frame's edges at about 1590
  used: {}, last: null,
};
function horChunks(t0, t1) {
  if (typeof CAPTIONS === 'undefined' || !CAPTIONS.length) return null;
  return CAPTIONS.filter(c => Math.min(c.t1, t1) - Math.max(c.t0, t0) >= .15).map(c => ({t0: c.t0, t1: c.t1, words: c.parts.map(p => p[0]).join(' '),
    lead: c.parts.filter((p, i) => (p[2] ?? (i === c.parts.length - 1 ? 'k' : 'l')) === 'l').map(p => p[0]).join(' '), key: c.parts.filter((p, i) => (p[2] ?? (i === c.parts.length - 1 ? 'k' : 'l')) === 'k').map(p => p[0]).join(' ')}));
}
const horNum = s => /\d/.test(String(s ?? ''));
/* fit a speaker screen to this face [x0, top, x1, chin]: what is at or below fitFrom moves down so its top is 30 under the chin; when
   it then runs under y 1660 the picture (or the card) gets shorter, at least 200; null = no room. Screens: always fit. */
function horFit(name, f) {
  const L = JSON.parse(JSON.stringify(HOR.layouts[name])); if (!L.speaker) return L;
  const [, , , chin] = f, top = Math.min(L.lead.y - 40 - (L.lead.mode === 'stack' ? 34 : 0), L.key.y - 80);
  const d = Math.max(0, chin + 30 - top); if (!d) return L;
  L.lead.y += d; L.key.y += d;
  for (const b of [L.pic, L.card]) if (b) b[1] += d;
  for (const s of L.slots ?? []) s.y += d;
  if (L.key.y + 80 > 1660) return null;
  const box = L.card ?? L.pic; if (box) { const over = box[1] + box[3] - 1660; if (over > 0) { box[3] -= over; if (box[3] < 200) return null;
    if (L.card && L.pic) L.pic[3] = Math.min(L.pic[3], L.card[1] + L.card[3] - 20 - L.pic[1]);
    for (const s of L.slots ?? []) if (s.y > box[1] + box[3] - 30) return null; } }
  return L;
}
/* a line of words at (x, y) left / right / centre, shrunk (never wrapped) to maxW and the safe zone (a .cp-row: checked) */
function horLine(parent, txt, cls, {x, y, align = 'center', maxW = 820}) {
  const row = div('', parent); row.className = 'o-row cp-row'; const sp = document.createElement('span'); sp.className = cls; sp.textContent = txt; row.appendChild(sp);
  const tx = align === 'right' ? '-100%' : align === 'left' ? '0' : '-50%';
  Object.assign(row.style, {left: `${x}px`, top: `${y}px`, translate: `${tx} -50%`, transformOrigin: align === 'right' ? '100% 50%' : align === 'left' ? '0 50%' : '50% 50%'});
  const x1 = y + 60 < CP.safeTop.y ? CP.safeTop.x1 : CP.safe[2], x0 = CP.safe[0];
  const room = align === 'right' ? x - x0 : align === 'left' ? x1 - x : 2 * Math.min(x - x0, x1 - x);
  FITS.push(() => { const w = sp.offsetWidth, m = Math.min(maxW, room); if (w > m) row.style.scale = String(m / w); });
  return row;
}

STYLE('horizon', {
  name: 'ขอบฟ้าส้ม',
  layouts: HOR.layouts,
  css: `
@font-face{font-family:"HorLead";src:url(fonts/Kanit-400-thai.woff);font-weight:400;unicode-range:U+02D7,U+0303,U+0331,U+0E01-0E5B,U+200C-200D,U+25CC}
@font-face{font-family:"HorLead";src:url(fonts/Kanit-400-latin.woff);font-weight:400;unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+2000-206F}
@font-face{font-family:"HorMid";src:url(fonts/Kanit-600-thai.woff);font-weight:600;unicode-range:U+02D7,U+0303,U+0331,U+0E01-0E5B,U+200C-200D,U+25CC}
@font-face{font-family:"HorMid";src:url(fonts/Kanit-600-latin.woff);font-weight:600;unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+2000-206F}
@font-face{font-family:"HorKey";src:url(fonts/Kanit-900-thai.woff);font-weight:900;unicode-range:U+02D7,U+0303,U+0331,U+0E01-0E5B,U+200C-200D,U+25CC}
@font-face{font-family:"HorKey";src:url(fonts/Kanit-900-latin.woff);font-weight:900;unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+2000-206F}
.o-root{position:absolute;inset:0;--ink:#FFF1E4;--ac:#FB7A1A;--lw:5;--sd:#FFF1E4;--fl:rgba(20,12,9,.85);--text:#FFF1E4}
.o-screen{background:linear-gradient(180deg,#090504 0%,#0d0906 20%,#140c08 45%,#180f0a 60%,#1a0f09 100%);background-color:#150d09;overflow:hidden}
.o-planet{position:absolute;border-radius:50%;background:radial-gradient(circle at 50% 8%,rgba(170,74,16,.62) 0%,rgba(105,44,10,.55) 22%,rgba(66,28,8,.55) 48%,rgba(52,24,8,.6) 100%);
  border-top:2px solid rgba(255,196,150,.6);box-shadow:0 0 70px 14px rgba(240,110,30,.32),inset 0 26px 60px rgba(255,140,50,.22)}
.o-face{position:absolute;overflow:hidden;border:3px solid #FB7F25;box-sizing:border-box}
.o-card{position:absolute;border-radius:36px;background:rgba(20,12,9,.92);border:2px solid rgba(110,58,24,.55);box-shadow:0 20px 50px rgba(0,0,0,.45)}
.o-card.o-float{background:rgba(22,14,10,.82);backdrop-filter:blur(2px)}
.o-text{position:absolute;inset:0}
.o-row{position:absolute;white-space:nowrap}
.o-lead{font-family:"HorLead";font-weight:400;font-size:60px;line-height:1.3;color:#FFFFFF;text-shadow:0 0 3px rgba(0,0,0,.85),0 2px 12px rgba(0,0,0,.6)}
.o-lead.o-small{font-size:44px}
.o-lead.o-side{font-size:38px}
.o-key{display:inline-block;padding:.08em 0;font-family:"HorKey";font-weight:900;font-size:130px;line-height:1.15;color:#FB7A1A;
  text-shadow:0 0 2px rgba(255,170,100,.7),0 0 18px rgba(251,122,26,.55),0 0 40px rgba(251,110,20,.3)}
.o-key.o-stat{font-size:108px}
.o-title{font-family:"HorMid";font-weight:600;font-size:50px;line-height:1.3;color:#FFFFFF}
.o-sub{font-family:"HorLead";font-weight:400;font-size:40px;line-height:1.3;color:#E9DED6}
.o-quote{font-family:"HorLead";font-weight:400;font-size:46px;line-height:1.3;color:#FFFFFF}
.o-cell{font-family:"HorLead";font-weight:400;font-size:46px;line-height:1.3;color:#FFFFFF}
.o-val{font-family:"HorMid";font-weight:600;font-size:50px;line-height:1.3;color:#FFFFFF}
.o-line{font-family:"HorLead";font-weight:400;font-size:43px;line-height:1.3;color:#FFFFFF}
.o-tick{position:absolute;width:44px;height:44px;border-radius:50%;background:#F58A3A;translate:-50% -50%;box-shadow:0 0 10px rgba(245,138,58,.55)}
.o-tick svg{position:absolute;inset:0}
.o-num{position:absolute;font-family:"HorMid";font-weight:600;font-size:26px;letter-spacing:8px;color:#F07A2A}
.o-cap{font-family:"HorLead",sans-serif;font-weight:500;font-size:43px;line-height:1.3;color:#FFFFFF}
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
  fitSize(ar, t0, t1) { const face = cpFaceBox(t0, t1); return cpFitSize(ar, HOR.pool.filter(n => !HOR.layouts[n].noPic && n !== 'float_cards' && horFit(n, face)), n => horFit(n, face)?.pic); },
  fitSurface() { const r = div('', SC); r.className = 'o-root o-screen'; return r; },

  frame(t0, t1, {index, scene}) {
    const meta = SCENES[scene]?.meta ?? {}, face = cpFaceBox(t0, t1), ch = horChunks(t0, t1);
    const more = ch ? Math.max(0, ch.length - 1) : (meta.rows?.length ?? 0), num = meta.num ?? (ch ? ch.slice(1).some(c => horNum(c.words)) : false);
    let name = meta.layout;
    if (!name) {
      const ok = n => { const L = HOR.layouts[n]; if (L.noPic && (more < 2 || index === 0 || HOR.sinceNoPic < HOR.noPicGap)) return false;
        if (n === 'float_cards' && !num) return false; return !!horFit(n, face); };
      const want = HOR.byCat[String(meta.cat ?? '').slice(0, 3)];
      if (want && ok(want)) name = want;
      else {
        let pool = HOR.pool.filter(n => n !== HOR.last && ok(n));
        if (!pool.length) pool = ['dark_graphic'];
        const ar = cpShape(meta.variant, t0);   // the picture's shape in this clip (REAL_SHAPES), else the sample's (fit pick, 2026-11-18)
        if (ar) {
          const size = n => { const p = horFit(n, face)?.pic; if (!p) return 0; const [, , w, h] = p; return ar > w / h ? w * w / ar : h * h * ar; };
          const best = Math.max(0, ...pool.map(size)); pool = pool.filter(n => HOR.layouts[n].noPic || size(n) >= HOR.keep * best);
        }
        const least = Math.min(...pool.map(n => HOR.used[n] ?? 0)); pool = pool.filter(n => (HOR.used[n] ?? 0) === least);
        name = pool[Math.floor(cpRand('screen' + index) * pool.length)];
      }
    }
    HOR.used[name] = (HOR.used[name] ?? 0) + 1; HOR.last = name; HOR.sinceNoPic = HOR.layouts[name].noPic ? 0 : HOR.sinceNoPic + 1;
    const L = (meta.layout ? JSON.parse(JSON.stringify(HOR.layouts[name])) : horFit(name, face)) ?? JSON.parse(JSON.stringify(HOR.layouts.dark_graphic));
    const screen = !L.speaker, root = div('', SC); root.className = 'o-root' + (screen ? ' o-screen' : '');
    const box = ([x, y, w, h], parent = root) => div(`left:${x}px;top:${y}px;width:${w}px;height:${h}px`, parent);
    const rise = (e, k, dy = 40) => A(e, [{opacity: 0, transform: `translateY(${dy}px) scale(.96)`, filter: 'blur(10px)'}, {opacity: 1, transform: 'none', filter: 'blur(0)'}], t0 + .04 + .12 * k, .45, {e: EASE.soft});
    if (screen) {
      /* the planet rising from the bottom (its rim and glow); the sheet's stars are left out (Friend: "ลบดาวที่ background ออกด้วยนะครับ") */
      const {cx, cy, r} = HOR.planet, p = box([cx - r, cy - r, 2 * r, 2 * r]); p.className = 'o-planet';
      A(p, [{transform: 'translateY(60px)', opacity: .4}, {transform: 'none', opacity: 1}], t0 - .05, .8, {e: EASE.soft});
      A(root, [{opacity: 0, filter: 'blur(14px)', transform: 'scale(1.03)'}, {opacity: 1, filter: 'blur(0)', transform: 'none'}], t0 - .04, .35, {e: EASE.smooth});
      sfx('whoosh', t0 - .1, -20);
    }
    A(root, [{opacity: 1, filter: 'blur(0)'}, {opacity: 0, filter: 'blur(10px)'}], t1 - .3, .3, {e: EASE.out, f: 'forwards'});
    if (L.face) { const [x, y, w, h, rr] = L.face, f = box([x, y, w, h]); f.className = 'o-face cp-frame'; f.style.borderRadius = rr + 'px';
      cpInset(f, w - 6, h - 6, t0, .4, .42); rise(f, 0, 30); }
    let card = null;
    if (L.card) { card = box(L.card); card.className = 'o-card' + (L.speaker ? ' o-float' : ''); rise(card, 1); }
    /* the recap: four cards, the order number, the words under the picture (a still's meta.rows) */
    let stages = null;
    if (L.four) stages = L.four.map((c, k) => { const e = box(c); e.className = 'o-card'; rise(e, k);
      const n = div('left:40px;top:34px', e, String(k + 1).padStart(2, '0')); n.className = 'o-num';
      if (meta.rows?.[k]) horLine(root, meta.rows[k], 'o-cap', {x: c[0] + c[2] / 2, y: c[1] + 408, maxW: Math.min(c[2] - 60, 920 - c[0] - 30) * 2});
      return box([30, 90, Math.min(c[2] - 60, 920 - c[0] - 30), 250], e); });
    const stage = L.pic ? box(L.pic) : box([540, 960, 1, 1]);
    if (!L.pic) stage.style.visibility = 'hidden';
    else A(stage, [{opacity: 0, transform: 'translateY(24px) scale(.94)', filter: 'blur(8px)'}, {opacity: 1, transform: 'none', filter: 'blur(0)'}], t0 + .05, .45, {e: EASE.soft});
    const F = {root, stage, stages, cam: root, L, name, dark: screen, t1, n: 0, meta, slots: []};
    /* the card's lines: the picture's next subtitles, grey from the start, white when said (a still: the sheet's, all said). A 'line'
       slot (shot 04) shows the newest said subtitle only. */
    (L.slots ?? []).forEach((s, k) => {
      if (s.k === 'line') { F.slots.push({s}); return; }
      const c = ch ? ch[k + 1] : null, still = !ch ? meta.rows?.[k] : null; if (!c && !still) { F.slots.push(null); return; }
      const t = t0 + .3 + .1 * k, el = div('', root); el.className = 'o-text';
      let words = c ? c.words : (Array.isArray(still) ? still.join(' ') : still), r, v = null, tick = null;
      if (s.k === 'num') { const lab = c ? (c.lead || c.words) : still[0], val = c ? (c.lead ? c.key : '') : still[1];
        r = horLine(el, lab, 'o-cell', {x: s.x, y: s.y, align: 'left', maxW: 470}); if (val) v = horLine(el, val, 'o-val', {x: s.vx, y: s.y, align: 'right', maxW: 340}); }
      else if (s.k === 'quote') { r = horLine(el, '“' + words + '”', 'o-quote', s); const sp = r.firstChild;   // two lines, broken at a space (the sheet: "หอมมาก / ผิวไม่แห้ง")
        FITS.unshift(() => { if (sp.offsetWidth <= s.maxW || !/\s/.test(words)) return; const ph = sp.textContent.split(/\s+/); sp.textContent = '';
          ph.forEach((q, i) => { if (i) sp.appendChild(document.createTextNode(' ')); const e = document.createElement('span'); e.style.whiteSpace = 'nowrap'; e.textContent = q; sp.appendChild(e); });
          Object.assign(sp.style, {whiteSpace: 'normal', display: 'inline-block', width: s.maxW + 'px', lineHeight: '1.5'}); r.style.translate = '0 -25%'; }); }
      else r = horLine(el, words, {title: 'o-title', sub: 'o-sub', row: 'o-cell'}[s.k], s);
      if (s.k === 'row') { tick = div(`left:${s.tickX}px;top:${s.y}px`, el); tick.className = 'o-tick';
        tick.innerHTML = '<svg viewBox="0 0 44 44"><path d="M13 22.5 L19.5 29 L31 16" fill="none" stroke="#fff" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'; }
      A(el, [{opacity: 0, transform: 'translateY(14px)'}, {opacity: 1, transform: 'none'}], t, .4, {e: EASE.soft});
      const parts = [r, v].filter(Boolean).map(x => x.firstChild);
      if (c) { parts.forEach(p => { p.style.color = '#8E847E'; }); if (tick) { tick.style.background = '#4A3A30'; tick.style.boxShadow = 'none'; } }
      F.slots.push({s, parts, tick, last: k === L.slots.length - 1});
    });
    if ((typeof CAPTIONS === 'undefined' || !CAPTIONS.length) && meta.rows) F.stillRows = meta.rows;
    if (F.stillRows && L.slots?.[0]?.k === 'line') { const el = div('', root); el.className = 'o-text'; horLine(el, F.stillRows[0], 'o-line', L.slots[0]); }
    if (F.stillRows && L.slots?.some(s => s.k === 'num')) F.slots.forEach(q => { if (q?.last && q.parts?.[1]) q.parts[1].style.color = '#FB7A1A'; });
    return F;
  },
  /* between pictures: the lead at both sides (or the middle) over the orange key word, moved below the chin when the face is low */
  speakerFrame(a, b) {
    const root = div('', SC); root.className = 'o-root';
    return {root, cam: root, speaker: true, L: horFit('talk', cpFaceBox(a, b)) ?? HOR.layouts.talk, name: 'talk'};
  },
  /* the words: the picture's first subtitle is the lead + key word; each next one lights the card's next line (white, its tick
     orange, the last number orange) or, with no line left, takes the lead and key word's place */
  text(F, T, lead, key) {
    const L = F.L ?? HOR.layouts.talk, el = div('', F.root ?? SC); el.className = 'o-text';
    const head = (t, swap) => {
      if (swap && F.head) A(F.head, [{opacity: 1}, {opacity: 0}], t - .04, .12, {f: 'forwards'});
      const h = div('', el); h.className = 'o-text'; F.head = h;
      const tIn = swap ? t + .08 : T.t0 + .15, fade = r => A(r, [{opacity: 0, filter: 'blur(8px)'}, {opacity: 1, filter: 'blur(0)'}], tIn, .35, {e: EASE.smooth});
      if (lead && L.lead) {
        const ph = String(lead).split(/\s*\|\s*|\s+/).filter(Boolean), cls = 'o-lead' + (L.lead.small ? ' o-small' : '');
        if (L.lead.mode === 'sides' && ph.length >= 2) { const m = Math.ceil(ph.length / 2);
          fade(horLine(h, ph.slice(0, m).join(' '), cls + ' o-side', {x: 160, y: L.lead.y - 14, align: 'left', maxW: 360})); fade(horLine(h, ph.slice(m).join(' '), cls + ' o-side', {x: 920, y: L.lead.y - 14, align: 'right', maxW: 360})); }   // (the sheet's 253–485 and 803–1011, small: 38 px)
        else if (L.lead.mode === 'stack' && ph.length >= 2) { const m = Math.ceil(ph.length / 2);
          fade(horLine(h, ph.slice(0, m).join(' '), cls, {x: L.lead.x, y: L.lead.y})); fade(horLine(h, ph.slice(m).join(' '), cls, {x: L.lead.x, y: L.lead.y + 68})); }
        else fade(horLine(h, ph.join(' '), cls, L.lead.mode === 'stack' ? {...L.lead, y: L.lead.y + 34} : L.lead));
      }
      if (key && L.key) { const r = horLine(h, key, 'o-key' + (L.key.stat ? ' o-stat' : ''), L.key); if (L.key.size) r.firstChild.style.fontSize = L.key.size + 'px';
        A(r, [{opacity: 0, transform: 'scale(.86)', filter: 'blur(10px) brightness(1.6)'}, {opacity: 1, transform: 'none', filter: 'blur(0) brightness(1)'}], T.hit - .05, .45, {e: EASE.soft});
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
    else if (S?.s.k === 'line') {                     // shot 04: one quiet line, the newest subtitle
      if (F.lastLine) A(F.lastLine, [{opacity: 1}, {opacity: 0}], start - .04, .12, {f: 'forwards'});
      const r = horLine(el, words, 'o-line', S.s); A(r, [{opacity: 0, transform: 'translateY(10px)'}, {opacity: 1, transform: 'none'}], start + .06, .35, {e: EASE.soft}); F.lastLine = r;
      F.slots.push(S); }                              // (it stays the next slot too)
    else if (S) {
      S.parts.forEach((p, i) => A(p, [{color: '#8E847E'}, {color: S.s.k === 'num' && i === 1 && S.last ? '#FB7A1A' : S.s.k === 'sub' ? '#E9DED6' : '#FFFFFF'}], start, .25, {f: 'forwards'}));
      if (S.tick) { A(S.tick, [{background: '#4A3A30'}, {background: '#F58A3A'}], start, .2, {f: 'forwards'});
        A(S.tick, [{transform: 'scale(1)'}, {transform: 'scale(1.3)', offset: .4}, {transform: 'scale(1)'}], start, .35, {e: EASE.soft}); }
      sfx('softswish', start, -26); }
    else head(start, true);
    if (T.clip) { A(el, [{visibility: 'hidden'}, {visibility: 'visible'}], start, .001); return null; }
    return el;
  },
});
