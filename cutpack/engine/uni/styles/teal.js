/* =====================================================================
   STYLE · teal — "การ์ดเขียวน้ำทะเล" (Teal Cards) (Friend 2026-11-18, the 4th of the new sheets: "ต่อไปทำสไตล์นี้ครับ")
   Every place and size is measured on Friend's sheet (12 shots, 1080 × 1920), then held to the rules every style shares
   (styles/common.js: safe zone, frames below the search bar, centred words, the video filling its frame, seeded random, never over
   the face). The pictures: the glow-line template set first, in the glass look with teal light (glow/bridge.js GLASSY.teal).
   Friend's two answers before the start (2026-11-18): the small spaced labels ("STEP 01 · SHOPPING", "TIP", "MISTAKE") are left out
   ("เอาออกเหมือนหน้าต่างแอป"), and the words in the cards are the spoken words ("ใช้คำพูดจริง"): a card's title is the first subtitle
   of its picture, the next subtitles come in under it one by one as bullets, as they are said. The AI's job does not grow.
   The 7-item form:
   1 frame    one of 12 layouts (TEAL.layouts, named after Friend's shots): the speaker full screen with the picture at the chest and
              three lines of words under it, or a dark teal screen with the speaker in a rounded card on top and a big card under it
              (title + bullets + picture · a big number · title + line + picture), a full card (title, picture, line), the picture in a
              card between a title and a line, a recap of three rows. Between pictures the speaker talks with the three lines.
   2 surface  dark teal screen (#0d1d1a) with a faint grid drifting very slowly; deep teal cards lit from the top, rounded 40
   3 drawing  the glow-line pictures: white lines, the lit part a teal outline (no solid fill), teal light
   4 colours  dark teal · white · one mint teal (#3FCEBA)
   5 words    on the speaker: a small line + a bold line + the key word big in teal (Friend's shots 01, 04, 07, 09, 12); in a card:
              a white title and white bullets with teal dots
   6 motion   cards rise in out of a blur, the speaker's card slides down, bullets come in on their words, the key word lights on its word
   7 sound    whoosh on a screen cut, a soft swish on the key word
   ===================================================================== */
const TEAL = {
  /* (in a card with a picture beside it the title and bullets start at the card's left, as on Friend's sheet: a list, not a
     floating subtitle line; every other line of words is centred, Friend's rule for all styles) */
  /* boxes [x, y, w, h] · face = the speaker's card [x, y, w, h, radius] · card = the big card [x, y, w, h] · pic = the picture box ·
     words {x, y (centre), maxW}: s (small line), b (bold line), k (key word) on the speaker · title, rows (bullets, the y of each),
     line (one quiet line under a card) in the cards. Measured on Friend's sheet, moved where it ran under TikTok's search bar (the
     sheet's speaker cards start at y 153) and buttons (the sheet's cards end at x 1012). */
  layouts: {   // measured on Friend's full-size shots (2026-11-18: "ผมส่งเป็นภาพใหญ่ให้ 12 ภาพเลยครับ ดูรายละเอียดและทำให้เหมือนที่สุด")
    talk:         {speaker: true, s: {x: 540, y: 1373}, b: {x: 540, y: 1473}, k: {x: 540, y: 1576}},                                                         // between pictures
    full_hook:    {speaker: true, pic: [225, 990, 630, 240], s: {x: 540, y: 1373}, b: {x: 540, y: 1473}, k: {x: 540, y: 1576}},                              // shot 01 (chevrons at the chest)
    stack_bullets:{face: [170, 230, 740, 710, 40], card: [65, 700, 950, 960], title: {x: 152, y: 1130, maxW: 470, align: 'left'},
                   rows: [1316, 1426, 1536], rowX: 160, rowW: 470, pic: [640, 1220, 270, 340]},                                       // shot 02
    stack_graphic:{screen: true, card: [65, 160, 950, 1500], title: {x: 540, y: 430, maxW: 820}, pic: [170, 690, 740, 380],
                   line: {x: 540, y: 1485, maxW: 820}},                                                                              // shot 03
    full_top:     {speaker: true, pic: [330, 1000, 420, 290], s: {x: 540, y: 1373}, b: {x: 540, y: 1473}, k: {x: 540, y: 1576}},                             // shot 04 (the cycle)
    design_row:   {screen: true, title: {x: 540, y: 418, maxW: 820}, card: [65, 560, 950, 880], pic: [140, 640, 780, 720],
                   line: {x: 540, y: 1565, maxW: 820}},                                                                              // shot 05
    stack_stat:   {face: [170, 230, 740, 710, 40], card: [65, 700, 950, 960], stat: {x: 540, y: 1218, maxW: 820}, title: {x: 540, y: 1375, maxW: 820},
                   line: {x: 540, y: 1515, maxW: 820}, noPic: true},                                                                  // shot 06 (the big number, no picture: the number is the picture)
    full_lower:   {speaker: true, pic: [330, 995, 420, 310], s: {x: 540, y: 1373}, b: {x: 540, y: 1473}, k: {x: 540, y: 1576}},                              // shot 07
    split_cards:  {face: [80, 230, 840, 670, 40], faceK: .36, faceY: .5, card: [80, 950, 840, 710], title: {x: 140, y: 1150, maxW: 440, align: 'left'},
                   rows: [1265, 1365, 1465], rowX: 140, rowW: 440, rowCls: 't-line', pic: [600, 1145, 310, 350]},   // shot 08 (Friend 2026-11-18 sent it zoomed: "ทำให้การแบ่งจอตรงนี้มันเหมือนกันด้วยนะครับ" — two cards of one width, the speaker's ends at y 900, a 50 gap, the lower card 950–1660; its lines plain)
    full_mistake: {speaker: true, pic: [340, 1000, 400, 305], s: {x: 540, y: 1373}, b: {x: 540, y: 1473}, k: {x: 540, y: 1576}},                             // shot 09 (the picture to the right)
    stack_bullets2:{face: [170, 230, 740, 710, 40], card: [65, 700, 950, 960], title: {x: 152, y: 1135, maxW: 740, align: 'left'},
                   rows: [1316, 1426, 1536], rowX: 160, rowW: 740, noPic: true},                                                      // shot 10 (bullets only, no picture)
    recap:        {screen: true, title: {x: 540, y: 425, maxW: 820}, recap: [[65, 600, 950, 320], [65, 960, 950, 320], [65, 1320, 950, 320]]},   // shot 11
    full_cta:     {speaker: true, pic: [370, 975, 360, 330], s: {x: 540, y: 1373}, b: {x: 540, y: 1473}, k: {x: 540, y: 1576}},                              // shot 12
  },
  /* RANDOM, the same rules as the other styles: a call to action (B15) gets the closing shot, a number (B01) the big-number card, a
     warning (B07) the mistake shot; every other picture takes one of `pool` (never the one before it) where the face leaves room
     (tealFit), among those the screens that show this picture's shape (glow/shapes.json) at least `keep` (75 %) as big as the best (the
     speaker's cards always stay in), then the least used, then at random from the run's seed */
  pool: ['full_hook', 'stack_bullets', 'stack_graphic', 'full_top', 'design_row', 'full_lower', 'split_cards', 'stack_bullets2', 'full_cta', 'full_mistake'],   // + the call-to-action and the mistake screens as any screen (Friend 2026-11-18: "ทำตามที่คุณแนะนำ" · the sheets are read for their layout only)
  byCat: {B15: 'full_cta', B01: 'stack_stat', B07: 'full_mistake'},
  /* a screen stays in when it shows the picture at least this share as big as the best one (as the other styles). The cards
     with the speaker (shots 02, 06, 08, 10) are left out of this: they hold a small picture beside their bullets by design (the
     sheet), and the first real clip, ruled by size, took only the two full-card screens */
  keep: .75,
  /* ...but a speaker's card needs the picture at least this big (px², 3 % of the screen): a flat picture in its narrow box came out
     at 1 % (279 × 64) in the first real clip */
  minFace: 60000,
  gridUp: 12,                                   // px a second the grid moves up (neon and lime drift 2 right, 3 down)
  used: {}, last: null,
};
const tealIn = (c, p) => [p[0] - c[0], p[1] - c[1], p[2], p[3]];          // a box inside a card, in the card's own place

/* fit a speaker screen to this face [x0, top, x1, chin] (as lime and window): the picture at the chest starts under the chin and
   shortens (at least 200 high) above the three lines; when that is too little the lines move down too (the key word's centre at
   most y 1590: its font box reaches 83 under it, 1660); null = no room. Card screens: the speaker is in his card, always fits. */
function tealFit(name, f) {
  const L0 = TEAL.layouts[name]; if (!L0.speaker) return L0;
  const [, , , chin] = f, L = JSON.parse(JSON.stringify(L0)), down = d => { for (const k of ['s', 'b', 'k']) L[k].y += d; };
  if (L.pic) {
    const top = Math.max(L.pic[1], chin + 30); let h = Math.min(L.pic[3], L.s.y - 50 - 30 - top);
    if (h < 200) { const d = Math.min(200 - h, Math.max(0, 1576 - L.k.y)); down(d); h += d; }   // 1576: the key word's foot at y 1660 (1590 let "ถูกจุด" end at 1668 once the speaker screens joined, 2026-11-18)
    if (h < 200) return null;
    L.pic = [L.pic[0], top, L.pic[2], h];
  } else { const d = Math.max(0, chin + 30 - (L.s.y - 50)); if (L.k.y + d > 1576) return null; down(d); }
  return L;
}
/* the words of a spoken chunk on the speaker: up to two lines over the key word, the longer one bold (Friend's sheet: "ทำกับข้าว /
   ครั้งเดียว", "ไก่ 1 อย่าง / ทำได้"). The chunk's phrases come from CAPTIONS (a real clip) or from "|" in a still's lead. */
function tealLines(lead, T) {
  let ph = String(lead ?? '').split('|').map(s => s.trim()).filter(Boolean);
  if (ph.length < 2 && typeof CAPTIONS !== 'undefined' && T?.clip) {
    const c = CAPTIONS.find(c => c.t0 <= T.b[0] + .02 && c.t1 >= T.end - .02);
    if (c) { const n = c.parts.length, l = c.parts.filter(([, , k], i) => (k ?? (i === n - 1 ? 'k' : 'l')) === 'l').map(p => p[0]); if (l.length) ph = l; }
  }
  if (!ph.length) return [];
  if (ph.length === 1) return [[ph[0], 'b']];
  const a = ph.slice(0, -1).join(' '), b = ph[ph.length - 1];
  return a.length > b.length ? [[a, 'b'], [b, 's']] : [[a, 's'], [b, 'b']];
}

STYLE('teal', {
  name: 'การ์ดเขียวน้ำทะเล',
  layouts: TEAL.layouts,
  css: `
@font-face{font-family:"TealKey";src:url(fonts/Kanit-800-thai.woff);font-weight:800;unicode-range:U+02D7,U+0303,U+0331,U+0E01-0E5B,U+200C-200D,U+25CC}
@font-face{font-family:"TealKey";src:url(fonts/Kanit-800-latin.woff);font-weight:800;unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+2000-206F}
.t-root{position:absolute;inset:0;--ink:#F1F6F4;--ac:#2DD4C0;--lw:5;--sd:#F1F6F4;--fl:rgba(16,30,27,.85);--text:#F1F6F4}
.t-screen{background:radial-gradient(ellipse 95% 70% at 50% 40%,#10231f 0%,#0d1c19 60%,#0b1714 100%);overflow:hidden}
.t-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(120,220,200,.05) 1.5px,transparent 1.5px),linear-gradient(90deg,rgba(120,220,200,.05) 1.5px,transparent 1.5px);background-size:54px 54px;background-position:-6px -10px}
.t-card{position:absolute;border-radius:44px;background:linear-gradient(180deg,#243d39 0%,#1b302c 28%,#131f1d 62%,#0c1210 100%);border:1px solid rgba(140,230,210,.08);
  box-shadow:0 24px 60px rgba(0,0,0,.5),inset 0 1px 0 rgba(200,255,240,.08)}
.t-face{position:absolute;overflow:hidden;box-shadow:0 24px 60px rgba(0,0,0,.55)}
.t-row{position:absolute;white-space:nowrap}
.t-text{position:absolute;inset:0}
.t-row i{font-style:normal}
.t-s{font-family:"Anu";font-weight:500;font-size:64px;line-height:1.25;color:#F1F5F3;text-shadow:0 0 3px rgba(0,0,0,.9),0 0 10px rgba(0,0,0,.6),0 3px 18px rgba(0,0,0,.5)}
.t-b{font-family:"Anu";font-weight:700;font-size:84px;line-height:1.2;color:#FFFFFF;text-shadow:0 0 3px rgba(0,0,0,.9),0 0 10px rgba(0,0,0,.6),0 3px 18px rgba(0,0,0,.5)}
.t-k{font-family:"TealKey";font-weight:800;font-size:112px;line-height:1.15;color:#2DD4C0;
  filter:drop-shadow(0 0 2px rgba(160,255,235,.45)) drop-shadow(0 0 14px rgba(63,206,186,.45)) drop-shadow(0 3px 10px rgba(0,0,0,.6))}
.t-title{font-family:"Anu";font-weight:700;font-size:72px;line-height:1.25;color:#F4F8F6}
.t-bul{font-family:"Anu";font-weight:500;font-size:54px;line-height:1.3;color:#E9F1EE}
.t-bul::before{content:"";display:inline-block;width:20px;height:20px;border-radius:50%;background:#2DD4C0;margin-right:34px;vertical-align:.18em;box-shadow:0 0 8px rgba(63,206,186,.7)}
.t-line{font-family:"Anu";font-weight:500;font-size:44px;line-height:1.3;color:#C2C8C6}
.t-stat{font-family:"TealKey";font-weight:800;font-size:140px;line-height:1.1;color:#2DD4C0;filter:drop-shadow(0 0 16px rgba(63,206,186,.45))}
.t-bul.t-plain::before{display:none}
.t-num{position:absolute;font-family:"TealKey";font-weight:800;font-size:80px;line-height:1;color:#2DD4C0;translate:0 -50%}
.t-rtext{font-family:"Anu";font-weight:500;font-size:66px;line-height:1.25;color:#F1F6F4}
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
  fitSize(ar, t0, t1) { const face = cpFaceBox(t0, t1); return cpFitSize(ar, TEAL.pool.filter(n => tealFit(n, face) && !TEAL.layouts[n].noPic), n => tealFit(n, face)?.pic, TEAL.keep, n => !!(TEAL.layouts[n].face || TEAL.layouts[n].speaker)); },
  fitSurface() { const r = div('', SC); r.className = 't-root t-screen'; return r; },

  frame(t0, t1, {index, scene}) {
    const meta = SCENES[scene]?.meta ?? {}, face = cpFaceBox(t0, t1);
    let name = meta.layout;
    if (!name) {
      const want = TEAL.byCat[String(meta.cat ?? '').slice(0, 3)];
      if (want && tealFit(want, face)) name = want;
      else {
        let pool = TEAL.pool.filter(n => n !== TEAL.last && tealFit(n, face));
        if (!pool.length) pool = ['stack_graphic', 'design_row', 'split_cards'].filter(n => n !== TEAL.last);
        const ar = cpShape(meta.variant, t0);   // the picture's shape in this clip (REAL_SHAPES), else the sample's (fit pick, 2026-11-18)
        if (ar) {
          const size = n => { const p = tealFit(n, face).pic; if (!p) return 0; const [, , w, h] = p; return ar > w / h ? w * w / ar : h * h * ar; };
          pool = cpSizeKeep(pool, size, TEAL.keep, n => !!(TEAL.layouts[n].face || TEAL.layouts[n].speaker), n => !!TEAL.layouts[n].noPic);   // the speaker's cards and full screens: a floor (CP.speakerFloor = TEAL.minFace), no race on size (Friend 2026-11-18: "อยากให้ ก ขึ้นบ้าง (ทุกสไตล์เลยนะ)")   // the speaker's cards: only a floor, no race on size; no picture: always in
        }
        pool = cpBalance(pool, n => !!TEAL.layouts[n].speaker, index);   // ก (the speaker full screen) and ข (a graphic screen) as often (Friend 2026-11-18)
        const least = Math.min(...pool.map(n => TEAL.used[n] ?? 0)); pool = pool.filter(n => (TEAL.used[n] ?? 0) === least);
        name = pool[Math.floor(cpRand('screen' + index) * pool.length)];
      }
    }
    TEAL.used[name] = (TEAL.used[name] ?? 0) + 1; TEAL.last = name;
    const L = (meta.layout ? TEAL.layouts[name] : tealFit(name, face)) ?? TEAL.layouts.stack_graphic;
    const screen = !L.speaker, root = div('', SC); root.className = 't-root' + (screen ? ' t-screen' : '');
    const box = ([x, y, w, h], parent = root) => div(`left:${x}px;top:${y}px;width:${w}px;height:${h}px`, parent);
    if (screen) {
      const g = div('', root); g.className = 't-grid';           // the grid moves UP, slowly but so it shows (Friend 2026-11-18: "background ที่เป็นตารางผมอยากให้มันเลื่อนขึ้นช้าๆนะครับแต่ไม่ต้องช้ามากจนไม่รู้สึกว่ามันเลื่อน"):
      const at = t => `-6px ${(-10 - TEAL.gridUp * t).toFixed(1)}px`;   // TEAL.gridUp px a second, a 54 px cell every 4.5 s, on the clip's clock (it carries on from screen to screen)
      A(g, [{backgroundPosition: at(t0 - .2)}, {backgroundPosition: at(t1 + .2)}], t0 - .2, t1 - t0 + .4, {e: 'linear'});
      A(root, [{opacity: 0, filter: 'blur(14px)', transform: 'scale(1.03)'}, {opacity: 1, filter: 'blur(0)', transform: 'none'}], t0 - .04, .35, {e: EASE.smooth});
      sfx('whoosh', t0 - .1, -20);
    }
    A(root, [{opacity: 1, filter: 'blur(0)'}, {opacity: 0, filter: 'blur(10px)'}], t1 - .3, .3, {e: EASE.out, f: 'forwards'});
    const rise = (e, k) => A(e, [{opacity: 0, transform: 'translateY(40px) scale(.95)', filter: 'blur(10px)'}, {opacity: 1, transform: 'none', filter: 'blur(0)'}], t0 + .04 + .12 * k, .45, {e: EASE.soft});
    /* the big card (the picture lives inside it, so the bridge reads the card's dark teal as its ground) */
    let card = null;
    if (L.card) { card = box(L.card); card.className = 't-card'; rise(card, 0); }
    /* the speaker's card on top of it (the video fills it, the face at 42 % of its width) */
    if (L.face) { const [x, y, w, h, r] = L.face, f = box([x, y, w, h]); f.className = 't-face cp-frame'; f.style.borderRadius = r + 'px';
      cpInset(f, w, h, t0, L.faceK ?? .42, L.faceY ?? .42);
      A(f, [{opacity: 0, transform: 'translateY(-30px)'}, {opacity: 1, transform: 'none'}], t0 + .05, .45, {e: EASE.soft}); }
    const inCard = p => card ? box(tealIn(L.card, p), card) : box(p);
    const stage = L.pic ? inCard(L.pic) : box([540, 960, 1, 1]);   // (shots 06 and 10 have no picture on the sheet: noPic)
    if (!L.pic) stage.style.visibility = 'hidden';
    if (L.pic && !card) A(stage, [{opacity: 0, transform: 'translateY(24px) scale(.94)', filter: 'blur(8px)'}, {opacity: 1, transform: 'none', filter: 'blur(0)'}], t0 + .05, .45, {e: EASE.soft});
    /* the recap: three row cards, a teal number, the row's words (a still's meta.rows), a small picture at the right */
    let stages = null;
    if (L.recap) stages = L.recap.map((c, k) => { const e = box(c); e.className = 't-card'; rise(e, k);
      const n = div(`left:74px;top:${c[3] / 2}px`, e, String(k + 1).padStart(2, '0')); n.className = 't-num';
      if (meta.rows?.[k]) cpLine(e, meta.rows[k], 't-rtext', {x: 203, y: c[3] / 2, maxW: 400, align: 'left'}, undefined, 't-row');
      return box([640, 60, 215, 200], e); });
    const F = {root, stage, stages, cam: root, L, name, dark: screen, t1, n: 0, meta};
    /* a still (no CAPTIONS): the sheet's own bullets / line, from meta.rows */
    if ((typeof CAPTIONS === 'undefined' || !CAPTIONS.length) && meta.rows && !L.recap) F.stillRows = meta.rows;
    return F;
  },
  /* between pictures: the three lines at the chest, moved below the chin when the face is low */
  speakerFrame(a, b) {
    const root = div('', SC); root.className = 't-root';
    return {root, cam: root, speaker: true, L: tealFit('talk', cpFaceBox(a, b)) ?? TEAL.layouts.talk, name: 'talk'};
  },
  /* the words. On the speaker: up to two lines (small / bold) and the key word in teal, each chunk in and out with its own words.
     In a card (Friend: "ใช้คำพูดจริง"): the picture's first chunk is the card's title, each next chunk comes in under it as a bullet
     (or as the quiet line, or under the big number) when it is said, and stays until the picture ends. */
  text(F, T, lead, key) {
    const L = F.L ?? TEAL.layouts.talk, el = div('', F.root ?? SC); el.className = 't-text';
    const words = [lead, key].map(s => String(s ?? '').replace(/\|/g, ' ').trim()).filter(Boolean).join(' ');
    const fadeIn = (r, t) => A(r, [{opacity: 0, transform: 'translateY(16px)', filter: 'blur(8px)'}, {opacity: 1, transform: 'none', filter: 'blur(0)'}], t, .4, {e: EASE.soft});
    if (L.speaker || !F.L) {
      const lines = tealLines(lead, T);
      lines.forEach(([s, kind], i) => { const r = cpLine(el, s, 't-' + kind, i === 0 && lines.length > 1 ? L.s : L.b, undefined, 't-row');
        A(r, [{opacity: 0, filter: 'blur(8px)'}, {opacity: 1, filter: 'blur(0)'}], T.t0 + .15 + .08 * i, .35, {e: EASE.smooth}); });
      if (key && L.k) {
        const r = cpLine(el, key, 't-k', L.k, undefined, 't-row');
        A(r, [{opacity: 0, transform: 'scale(.86)', filter: 'blur(10px) brightness(1.8)'}, {opacity: 1, transform: 'none', filter: 'blur(0) brightness(1)'}], T.hit - .05, .45, {e: EASE.soft});
        sfx('softswish', T.hit - .05, -21);
      }
      if (F.speaker && T.clip) {
        A(el, [{visibility: 'hidden'}, {visibility: 'visible'}], T.b[0] - .02, .001); A(el, [{visibility: 'visible'}, {visibility: 'hidden'}], T.end - .021, .001, {f: 'forwards'});
        return null;
      }
      return el;
    }
    /* a card: the n-th chunk of this picture (a call with no words, the scene's own empty sentence in a real clip, takes no place:
       it had taken the title's place, so the first subtitle came in as a bullet) */
    if (!words && !(F.stillRows && T.clip !== true)) return null;
    const n = F.n++, start = T.b[0] - .02, slots = [];
    if (L.stat) slots.push(['t-stat', L.stat, key || words], ['t-title', L.title, lead]);
    else if (L.title) slots.push(['t-title', L.title, words]);
    let put = n === 0 ? slots : [];
    if (n > 0) {
      if (L.rows) { const k = Math.min(n - 1, L.rows.length - 1); put = [[L.rowCls ?? 't-bul', {x: L.rowX, y: L.rows[k], maxW: L.rowW, align: 'left'}, words]]; }
      else if (L.line) put = [['t-line', L.line, words]];
    }
    const swap = F.lastRow && n > 0 && (L.line || (L.rows && n > L.rows.length) || L.stat);   // one quiet line at a time: the old one goes first
    if (swap) A(F.lastRow, [{opacity: 1}, {opacity: 0}], start - .04, .12, {f: 'forwards'});   // (a cross-fade of two lines in one place read as a mess)
    put.forEach(([cls, P, s], i) => { if (!s) return; const r = cpLine(el, s, cls, P, undefined, 't-row'); fadeIn(r, start + .06 * i + (swap ? .1 : 0)); if (n > 0) F.lastRow = r; });
    if (key && n === 0) sfx('softswish', T.hit - .05, -21);
    /* a still: the sheet's bullets or line after the title */
    if (F.stillRows && n === 0) F.stillRows.forEach((s, k) => {
      const P = L.rows ? {x: L.rowX, y: L.rows[k], maxW: L.rowW, align: 'left'} : L.line ?? null;
      if (!P || (!L.rows && k > 0)) return;
      const r = cpLine(el, s, L.rows ? (L.rowCls ?? 't-bul') : 't-line', P, undefined, 't-row'); fadeIn(r, T.b[0] + .3 + .25 * k); });
    if (T.clip) { A(el, [{visibility: 'hidden'}, {visibility: 'visible'}], start, .001); return null; }   // stays until the picture ends (its root fades out)
    return el;
  },
});
