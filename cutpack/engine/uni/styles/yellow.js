/* =====================================================================
   STYLE · yellow — "ขั้นตอนเหลือง" (Yellow Steps) (Friend 2026-11-18, the 6th of the new sheets, 12 shots full size:
   "พยายามทำให้เหมือนต้นแบบที่สุดเท่าที่จะเป็นไปได้"). Every place, size and colour is measured on those 1080 × 1920 shots, then held
   to the rules every style shares (styles/common.js: safe zone, frames below the search bar, centred words, the video filling its
   frame, seeded random, never over the face). The pictures: the glow-line template set first, in the glass look with yellow light
   (GLASSY.yellow: near-black bodies, white lines, the lit part a yellow outline and icon).
   Friend's rules for the new styles (2026-11-18, again at the start of this chat): no small spaced labels on cards, and the words in a
   card are the spoken words. Here the cards are the yellow STEP CHIPS ("1 ตื่น 2 ยืดเส้น 3 ออกไปวิ่ง"): the picture's first subtitle is
   its headline (lead + key word), each next subtitle comes in as the next chip when it is said; the number in the chip's dark square
   is the chip's place (1, 2, 3), not a label. The big yellow tile ("1", "3") and the giant number ("21") show a number the speaker says.
   The 7-item form:
   1 frame    one of 12 layouts (YEL.layouts, named after Friend's shots): the speaker full screen with the words and the chips at the
              chest (a row, a list, or the picture at the hands); a dark screen with a big number tile, the words, a picture and the
              chips; the screen split by a yellow line, the speaker on one half; the speaker in a yellow-edged card beside a picture
              and a chip list; a giant number; a recap of big chips under the picture.
   2 surface  near-black grey screen, a faint 60 px grid moving up slowly, a warm yellow glow in the middle
   3 drawing  the glow-line pictures: white lines glowing white, the lit part a yellow outline with a yellow icon, near-black bodies
   4 colours  near-black · white · one yellow (#FFD600)
   5 words    a white lead (Kanit 600 52) + the key word in yellow (Kanit 900 100); chips: yellow, a dark square with the yellow number,
              dark words (Kanit 700) · a chip that is not the current step: dark, yellow edge, a yellow square, white words
   6 motion   screens fade in out of a blur, chips rise in one by one on their words (the newest lights up on the step screens),
              the tile and the giant number pop in, the split video slides in under a yellow line drawn from the left
   7 sound    whoosh on a screen cut, a soft swish on the key word, a soft tick on each chip
   ===================================================================== */
const YEL = {
  /* boxes [x, y, w, h] · lead / key {x, y (centre), maxW, align} · pic = the picture box · chips: h = a row of chips (y, h: three
     fill x 60–920, the sheet's rows ran 60–1020 under the buttons; one or two are centred at 540), v = a list (x, w, y, h, gap) ·
     mode 'all' = every chip yellow, 'now' = only the newest (shots 04, 05) · tile = the big number tile · giant = the giant number's centre · face = the
     speaker's yellow-edged card [x, y, w, h, radius] · half = the video half of a split screen [x, y, w, h, faceK, faceY] + line (the
     yellow divider's y) · noPic = no picture on the sheet (the chips are the picture) · num = needs a spoken number.
     Moved where Friend's shots ran under TikTok's buttons (everything below y 740 kept left of x 920; the sheet's chips to 1037)
     and name (the chips of shot 04 ended at y 1680 → 1660). A picture box is about 13 % bigger than the sheet's picture: the template
     drawings carry some room of their own (shots 02 04 08 11 came out 88 % of the sheet's size in the box measured on it). */
  layouts: {
    talk:         {speaker: true, lead: {x: 540, y: 1016}, key: {x: 540, y: 1135}},                                                   // between pictures
    full_chips:   {speaker: true, noPic: true, lead: {x: 540, y: 1016}, key: {x: 540, y: 1135}, chips: {h: [1290, 81]}, mode: 'all'},     // shot 01
    full_steps:   {speaker: true, lead: {x: 540, y: 1035}, key: {x: 540, y: 1123}, pic: [150, 1217, 770, 300], chips: {h: [1566, 71]}, mode: 'all'},   // shot 02
    tile_ladder:  {screen: true, num: 'head', tile: [60, 170, 300, 300], lead: {x: 402, y: 277, align: 'left', maxW: 510}, key: {x: 402, y: 363, align: 'left', maxW: 510},
                   pic: [100, 855, 420, 525], chips: {v: [545, 375, 876, 131, 39]}, mode: 'all'},                                     // shot 03
    split_top:    {screen: true, half: [0, 0, 1080, 1000, .3, .6], line: 998, lead: {x: 540, y: 1099}, key: {x: 540, y: 1186},
                   pic: [218, 1286, 644, 249], chips: {h: [1575, 85]}, mode: 'now'},                                                  // shot 04
    tile_steps:   {screen: true, num: 'head', tile: [390, 160, 300, 300], lead: {x: 540, y: 581}, key: {x: 540, y: 680},
                   pic: [60, 935, 860, 340], chips: {h: [1463, 116]}, mode: 'now'},                                                   // shot 05
    full_list:    {speaker: true, noPic: true, lead: {x: 540, y: 1011}, key: {x: 540, y: 1123}, chips: {v: [483, 437, 1270, 101, 29]}, mode: 'all'},   // shot 06
    card_rail:    {screen: true, lead: {x: 540, y: 160}, key: {x: 540, y: 258}, face: [60, 372, 480, 922, 28], pic: [600, 400, 420, 340],
                   chips: {v: [560, 360, 917, 101, 29]}, mode: 'all'},                                                                // shot 07
    split_bottom: {screen: true, lead: {x: 540, y: 135}, key: {x: 540, y: 235}, pic: [143, 352, 797, 376], chips: {h: [810, 91]}, mode: 'all',
                   half: [0, 1000, 1080, 920, .34, .37], line: 998},                                                                  // shot 08
    full_pair:    {speaker: true, chips: {h: [968, 81], max: 2}, pic: [300, 1126, 500, 286], lead: {x: 540, y: 1490}, key: {x: 540, y: 1585}, mode: 'all'},   // shot 09 (the key word's box reaches 75 under its centre: 1660)
    giant:        {screen: true, noPic: true, num: 'any', giant: {x: 540, y: 534}, lead: {x: 540, y: 1025}, key: {x: 540, y: 1111}, chips: {h: [1290, 131]}, mode: 'all'},   // shot 10
    recap:        {screen: true, lead: {x: 540, y: 133}, key: {x: 540, y: 257}, pic: [100, 375, 885, 338], chips: {v: [140, 780, 885, 201, 60]}, mode: 'all'},   // shot 11
    full_cta:     {speaker: true, noPic: true, lead: {x: 540, y: 1018}, key: {x: 540, y: 1131}, chips: {v: [290, 501, 1280, 101, 29]}, mode: 'all'},   // shot 12
  },
  /* RANDOM, as the other styles: a call to action (B15) gets shot 12, a number (B01) the giant number when one is said; a headline
     with a number may take a tile screen; every other picture takes one of `pool` (never the one before it) where the face leaves
     room (yelFit), the screens without a picture only when at least 2 more subtitles come for the chips (and noPicGap), among those with a picture
     the screens that show this picture's shape at least 75 % as big as the best, then the least used, then at random from the seed */
  pool: ['full_chips', 'full_steps', 'split_top', 'full_list', 'card_rail', 'split_bottom', 'full_pair', 'recap'],
  numPool: ['tile_ladder', 'tile_steps'],
  byCat: {B15: 'full_cta', B01: 'giant'},
  keep: .75,
  /* a screen without a picture (01 06 10 12) at most once in every 5 pictures, never the first: the first real clip, with no cap,
     took 4 of its 10 pictures there and its pictures averaged 5 % of the screen (Friend 2026-11-17 on small pictures: "ดูโล่งๆ") */
  noPicGap: 4, sinceNoPic: 4,
  gridUp: 12,                                  // px a second the grid moves up (as teal: Friend asked for a grid that moves so it shows)
  used: {}, last: null,
};
/* the subtitles said inside [t0, t1] (a real clip): [{t0, t1, words}] · a number in some words */
function yelChunks(t0, t1) {
  if (typeof CAPTIONS === 'undefined' || !CAPTIONS.length) return null;
  return CAPTIONS.filter(c => Math.min(c.t1, t1) - Math.max(c.t0, t0) >= .15).map(c => ({t0: c.t0, t1: c.t1, words: c.parts.map(p => p[0]).join(' ')}));
}
const yelNum = s => (String(s ?? '').match(/\d+(?:[.,]\d+)?/) ?? [null])[0];
/* the chip boxes of a layout for n chips [x, y, w, h] (a row of three: x 60–920, each 276 wide, 16 apart; two: centred at 540 in
   160–920, 372 wide (343 on shot 09's row of two); one: 500 wide in the middle, so a spoken chunk has room; a list: one under another) */
function yelChipBoxes(L, n) {
  const C = L.chips; if (!C || !n) return [];
  if (C.h) { const [y, h] = C.h, g = 16, w = n === 3 ? (860 - 2 * g) / 3 : C.max === 2 ? 343 : n === 2 ? (760 - g) / 2 : 500, tot = n * w + (n - 1) * g, x0 = n === 3 ? 60 : 540 - tot / 2;
    return [...Array(n)].map((_, k) => [x0 + k * (w + g), y, w, h]); }   // three: x 60–920 as the sheet's left edge (its right edge, 1020, is under the buttons)
  const [x, w, y, h, g] = C.v; return [...Array(n)].map((_, k) => [x, y + k * (h + g), w, h]);
}
/* fit a speaker screen to this face [x0, top, x1, chin] for n chips: everything moves down so its top is 30 under the chin; when
   it then runs under y 1660 the picture gets shorter (at least 160) and what is under it moves up; null = no room. Screens: the
   speaker is in his own card or half, always fits. */
function yelFit(name, f, n = 3) {
  const L = JSON.parse(JSON.stringify(YEL.layouts[name])), [, , , chin] = f;
  L.n = n = Math.min(n, L.chips?.max ?? 3); if (!L.speaker) return L;
  const cb = () => yelChipBoxes(L, n), top = Math.min(L.lead.y - 35, L.key.y - 60, ...(L.pic ? [L.pic[1]] : []), ...cb().map(b => b[1]));
  const bottom = () => Math.max(L.key.y + 75, ...(L.pic ? [L.pic[1] + L.pic[3]] : []), ...cb().map(b => b[1] + b[3]));
  const move = (d, from = -1e9) => { for (const k of ['lead', 'key']) if (L[k].y >= from) L[k].y += d;
    if (L.pic && L.pic[1] >= from) L.pic[1] += d;
    if (L.chips?.h && L.chips.h[0] >= from) L.chips.h[0] += d; if (L.chips?.v && L.chips.v[2] >= from) L.chips.v[2] += d; };
  move(Math.max(0, chin + 30 - top));
  let over = bottom() - 1660;
  if (over > 0 && L.pic) { const below = L.pic[1] + L.pic[3]; const cut = Math.min(over, L.pic[3] - 160); L.pic[3] -= cut; move(-cut, below); over -= cut; }
  if (over > 0) return null;
  return L;
}

STYLE('yellow', {
  name: 'ขั้นตอนเหลือง',
  layouts: YEL.layouts,
  css: `
@font-face{font-family:"YelLead";src:url(fonts/Kanit-600-thai.woff);font-weight:600;unicode-range:U+02D7,U+0303,U+0331,U+0E01-0E5B,U+200C-200D,U+25CC}
@font-face{font-family:"YelLead";src:url(fonts/Kanit-600-latin.woff);font-weight:600;unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+2000-206F}
@font-face{font-family:"YelChip";src:url(fonts/Kanit-700-thai.woff);font-weight:700;unicode-range:U+02D7,U+0303,U+0331,U+0E01-0E5B,U+200C-200D,U+25CC}
@font-face{font-family:"YelChip";src:url(fonts/Kanit-700-latin.woff);font-weight:700;unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+2000-206F}
@font-face{font-family:"YelKey";src:url(fonts/Kanit-900-thai.woff);font-weight:900;unicode-range:U+02D7,U+0303,U+0331,U+0E01-0E5B,U+200C-200D,U+25CC}
@font-face{font-family:"YelKey";src:url(fonts/Kanit-900-latin.woff);font-weight:900;unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+2000-206F}
.y-root{position:absolute;inset:0;--ink:#F5F5F2;--ac:#FFD600;--lw:5;--sd:#F5F5F2;--fl:rgba(14,14,14,.85);--text:#F5F5F2}
.y-screen{background:radial-gradient(ellipse 560px 900px at 540px 1050px,rgba(255,214,0,.115) 0%,rgba(255,214,0,.06) 45%,rgba(255,214,0,0) 100%),
  linear-gradient(180deg,#0e0e10 0%,#131313 12%,#151514 22%,#171716 40%,#171716 60%,#181818 85%,#18181a 100%);background-color:#161615;overflow:hidden}   /* (the colour: the pictures read it as their ground) */
.y-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.04) 1px,transparent 1px);background-size:60px 60px}
.y-half{position:absolute;overflow:hidden}
.y-line{position:absolute;left:0;width:1080px;height:5px;background:#FFD600;transform-origin:0 50%}
.y-face{position:absolute;overflow:hidden;border:4px solid #FFD600;box-sizing:border-box}
.y-text{position:absolute;inset:0}
.y-row{position:absolute;white-space:nowrap}
.y-row i{font-style:normal}
.y-lead{font-family:"YelLead";font-weight:600;font-size:52px;line-height:1.3;color:#FFFFFF;text-shadow:0 0 3px rgba(0,0,0,.8),0 2px 10px rgba(0,0,0,.55)}
.y-key{font-family:"YelKey";font-weight:900;font-size:100px;line-height:1.2;color:#FFD600;text-shadow:0 0 3px rgba(0,0,0,.55),0 3px 14px rgba(0,0,0,.5)}
.y-chip{position:absolute;box-sizing:border-box;border:3px solid #FFD600;background:#FFD600}
.y-sq{position:absolute;background:#121214}
.y-dig{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:"YelKey";font-weight:900;color:#FFD600;line-height:1}
.y-ct{font-family:"YelChip";font-weight:700;line-height:1.25;color:#121214}
.y-tile{position:absolute;background:#FFD600;border-radius:46px;display:flex;align-items:center;justify-content:center}
.y-tdig{font-family:"YelKey";font-weight:900;font-size:186px;line-height:1;color:#121214;translate:0 -4px}
.y-giant{font-family:"YelKey";font-weight:900;font-size:650px;line-height:.6;color:#FFD600;display:inline-block;transform:scaleX(1.12);text-shadow:0 0 24px rgba(255,214,0,.22)}   /* the sheet's "21": 419 high, 743 wide (Kanit's digits are narrower: widened 1.12) */
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
    const meta = SCENES[scene]?.meta ?? {}, face = cpFaceBox(t0, t1), ch = yelChunks(t0, t1);
    const more = ch ? Math.max(0, ch.length - 1) : (meta.rows?.length ?? 0);        // the subtitles that become chips
    const num = meta.num ?? (ch ? yelNum(ch[0]?.words) : null), numAny = meta.num ?? (ch ? ch.map(c => yelNum(c.words)).find(Boolean) : null);
    let name = meta.layout;
    if (!name) {
      const ok = n => { const L = YEL.layouts[n]; if (L.num === 'head' && !num) return false; if (L.num === 'any' && !numAny) return false;
        if (L.noPic && (more < 2 || index === 0 || YEL.sinceNoPic < YEL.noPicGap)) return false; return !!yelFit(n, face, more); };
      const want = YEL.byCat[String(meta.cat ?? '').slice(0, 3)];
      if (want && ok(want)) name = want;
      else {
        let pool = YEL.pool.concat(num ? YEL.numPool : []).filter(n => n !== YEL.last && ok(n));
        if (!pool.length) pool = ['split_top', 'split_bottom', 'card_rail', 'recap'].filter(n => n !== YEL.last);
        const ar = typeof GLOW_SHAPES !== 'undefined' && meta.variant ? GLOW_SHAPES[meta.variant] : null;
        if (ar) {
          const size = n => { const p = yelFit(n, face, more)?.pic; if (!p) return 0; const [, , w, h] = p; return ar > w / h ? w * w / ar : h * h * ar; };
          const best = Math.max(0, ...pool.map(size)); pool = pool.filter(n => YEL.layouts[n].noPic || size(n) >= YEL.keep * best);   // no picture: the chips are the picture
        }
        const least = Math.min(...pool.map(n => YEL.used[n] ?? 0)); pool = pool.filter(n => (YEL.used[n] ?? 0) === least);
        name = pool[Math.floor(cpRand('screen' + index) * pool.length)];
      }
    }
    YEL.used[name] = (YEL.used[name] ?? 0) + 1; YEL.last = name; YEL.sinceNoPic = YEL.layouts[name].noPic ? 0 : YEL.sinceNoPic + 1;
    const L = yelFit(name, meta.layout ? [0, 0, 0, -1e4] : face, more) ?? yelFit('split_top', face, more);   // a still: the sheet's places as they are
    const screen = !L.speaker, root = div('', SC); root.className = 'y-root' + (screen ? ' y-screen' : '');
    const box = ([x, y, w, h], parent = root) => div(`left:${x}px;top:${y}px;width:${w}px;height:${h}px`, parent);
    if (screen) {
      const g = div('', root); g.className = 'y-grid';
      const at = t => `0px ${(-YEL.gridUp * t).toFixed(1)}px`;     // up YEL.gridUp px a second on the clip's clock (one 60 px cell every 5 s)
      A(g, [{backgroundPosition: at(t0 - .2)}, {backgroundPosition: at(t1 + .2)}], t0 - .2, t1 - t0 + .4, {e: 'linear'});
      A(root, [{opacity: 0, filter: 'blur(14px)', transform: 'scale(1.03)'}, {opacity: 1, filter: 'blur(0)', transform: 'none'}], t0 - .04, .35, {e: EASE.smooth});
      sfx('whoosh', t0 - .1, -20);
    }
    A(root, [{opacity: 1, filter: 'blur(0)'}, {opacity: 0, filter: 'blur(10px)'}], t1 - .3, .3, {e: EASE.out, f: 'forwards'});
    const rise = (e, k, dy = 40) => A(e, [{opacity: 0, transform: `translateY(${dy}px) scale(.95)`, filter: 'blur(10px)'}, {opacity: 1, transform: 'none', filter: 'blur(0)'}], t0 + .04 + .12 * k, .45, {e: EASE.soft});
    /* the video half of a split screen (it fills its half, the face at faceK of the width, at faceY of the height) and the yellow line */
    if (L.half) { const [x, y, w, h, k, fy] = L.half, f = box([x, y, w, h]); f.className = 'y-half'; cpInset(f, w, h, t0, k, fy);
      A(f, [{opacity: 0, transform: `translateY(${y ? 60 : -60}px)`}, {opacity: 1, transform: 'none'}], t0, .45, {e: EASE.soft});
      const ln = div(`top:${L.line}px`, root); ln.className = 'y-line'; A(ln, [{transform: 'scaleX(0)'}, {transform: 'scaleX(1)'}], t0 + .1, .45, {e: EASE.soft}); }
    /* the speaker's yellow-edged card */
    if (L.face) { const [x, y, w, h, r] = L.face, f = box([x, y, w, h]); f.className = 'y-face cp-frame'; f.style.borderRadius = r + 'px';
      cpInset(f, w - 8, h - 8, t0, .42, .42); rise(f, 0, 30); }
    /* the big number tile, the giant number (a number the speaker says: the headline's for the tile, any of the picture's for the giant) */
    if (L.tile) { const t = box(L.tile); t.className = 'y-tile'; const d = div('', t, num ?? '1'); d.className = 'y-tdig';
      A(t, [{opacity: 0, transform: 'scale(.7)', filter: 'blur(8px)'}, {opacity: 1, transform: 'scale(1.04)', offset: .7}, {opacity: 1, transform: 'none', filter: 'blur(0)'}], t0 + .05, .5, {e: EASE.soft}); }
    if (L.giant) { const r = cpLine(root, numAny ?? '', 'y-giant', {x: L.giant.x, y: L.giant.y, maxW: 960, half: 200}, undefined, 'y-row'), sp = r.firstChild;
      const str = sp.textContent; sp.textContent = ''; [...str].forEach((c, k) => { const e = document.createElement('span'); e.textContent = c; if (k) e.style.marginLeft = '78px'; sp.appendChild(e); });   // the digits 93 apart (sheet)
      A(r, [{opacity: 0, transform: 'scale(.85)', filter: 'blur(14px)'}, {opacity: 1, transform: 'none', filter: 'blur(0)'}], t0 + .05, .55, {e: EASE.soft}); }
    const stage = L.pic ? box(L.pic) : box([540, 960, 1, 1]);
    if (!L.pic) stage.style.visibility = 'hidden';                     // shots 01, 06, 10, 12: no picture on the sheet
    else A(stage, [{opacity: 0, transform: 'translateY(24px) scale(.94)', filter: 'blur(8px)'}, {opacity: 1, transform: 'none', filter: 'blur(0)'}], t0 + .05, .45, {e: EASE.soft});
    const F = {root, stage, cam: root, L, name, dark: screen, t1, n: 0, meta, chips: [], boxes: yelChipBoxes(L, L.n)};
    if ((typeof CAPTIONS === 'undefined' || !CAPTIONS.length) && meta.rows) F.stillRows = meta.rows;
    return F;
  },
  /* between pictures: the words at the chest, moved below the chin when the face is low */
  speakerFrame(a, b) {
    const root = div('', SC); root.className = 'y-root';
    return {root, cam: root, speaker: true, L: yelFit('talk', cpFaceBox(a, b), 0) ?? YEL.layouts.talk, name: 'talk'};
  },
  /* the words: a white lead + the yellow key word. A picture's first subtitle is its headline; each next one comes in as the next
     chip when it is said (Friend: the words in a card are the spoken words) and stays until the picture ends; when the chips are all
     used, a next subtitle takes the headline's place */
  text(F, T, lead, key) {
    const L = F.L ?? YEL.layouts.talk, el = div('', F.root ?? SC); el.className = 'y-text';
    const head = (t, swap) => {
      if (swap && F.head) A(F.head, [{opacity: 1}, {opacity: 0}], t - .04, .12, {f: 'forwards'});
      const h = div('', el); h.className = 'y-text'; F.head = h;
      if (lead && L.lead) { const r = cpLine(h, lead, 'y-lead', L.lead, undefined, 'y-row'); A(r, [{opacity: 0, filter: 'blur(8px)'}, {opacity: 1, filter: 'blur(0)'}], (swap ? t + .08 : T.t0 + .15), .35, {e: EASE.smooth}); }
      if (key && L.key) { const r = cpLine(h, key, 'y-key', L.key, undefined, 'y-row');
        A(r, [{opacity: 0, transform: 'scale(.86)', filter: 'blur(8px)'}, {opacity: 1, transform: 'scale(1.03)', offset: .7}, {opacity: 1, transform: 'none', filter: 'blur(0)'}], T.hit - .05, .4, {e: EASE.soft});
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
    if (!words && !(F.stillRows && T.clip !== true)) return null;      // the scene's own empty sentence takes no place
    const n = F.n++, start = T.b[0] - .02;
    if (n === 0) head(T.t0);
    else if (n - 1 < F.boxes.length) yelChip(F, el, n - 1, n, words, start);
    else head(start, true);
    if (F.stillRows && n === 0) F.stillRows.forEach((r, k) => { const [num, s, st] = Array.isArray(r) ? r : [k + 1, r, 'on'];
      if (k < F.boxes.length) yelChip(F, el, k, num, s, T.b[0] + .3 + .25 * k, st); });
    if (T.clip) { A(el, [{visibility: 'hidden'}, {visibility: 'visible'}], start, .001); return null; }   // stays until the picture ends
    return el;
  },
});
/* one chip k (its box from yelChipBoxes): yellow, a dark square with the yellow number, dark words. On a step screen (mode 'now')
     the newest chip is the yellow one, the ones before turn dark with a yellow edge, a yellow square and white words (shots 04, 05).
     Measured: corner .2 h · square .78 h at .11 h in, its corner .18 of it · number .46 h · words .45 h, .19 h after the square, two lines at .34 h (broken at a space) when a chunk of several phrases would shrink under 74 % */
function yelChip(F, el, k, num, words, t, state = 'on') {
    const [x, y, w, h] = F.boxes[k], c = div(`left:${x}px;top:${y}px;width:${w}px;height:${h}px;border-radius:${(.2 * h).toFixed(1)}px`, el); c.className = 'y-chip';
    const i = .11 * h, s = .78 * h, sq = div(`left:${i - 3}px;top:${i - 3}px;width:${s}px;height:${s}px;border-radius:${(.18 * s).toFixed(1)}px`, c); sq.className = 'y-sq';
    const dg = div(`font-size:${(.46 * h).toFixed(1)}px`, sq, String(num)); dg.className = 'y-dig';
    const tx = i + s + .19 * h - 3, r = cpLine(c, words, 'y-ct', {x: tx, y: h / 2 - 3, align: 'left', maxW: w - tx - .1 * h}, undefined, 'y-row');
    r.firstChild.style.fontSize = (.45 * h).toFixed(1) + 'px';
    /* a spoken chunk is longer than the sheet's one word (up to 16 letters): when one line would shrink under 74 %, it breaks into two
       lines at .34 h (the first real clip: "ถาม รายละเอียด" in a 276 chip read at 48 %) */
    const room = w - tx - .1 * h;
    FITS.push(() => { const sp = r.firstChild; if (sp.offsetWidth <= room / .74 || !/\s/.test(String(words).trim())) return;   // one phrase stays on one line (the sheet's "ออกไปวิ่ง")
      r.style.scale = ''; Object.assign(sp.style, {whiteSpace: 'normal', display: 'inline-block', width: room + 'px', fontSize: (.34 * h).toFixed(1) + 'px', lineHeight: '1.06'});
      const ph = sp.textContent.trim().split(/\s+/); sp.textContent = '';   // each phrase unbreakable: the lines break at the spaces between phrases only
      ph.forEach((w, i) => { if (i) sp.appendChild(document.createTextNode(' ')); const e = document.createElement('span'); e.style.whiteSpace = 'nowrap'; e.textContent = w; sp.appendChild(e); });
      const k = Math.min(1, .9 * h / sp.offsetHeight, room / sp.scrollWidth); if (k < 1) r.style.scale = String(k); });
    const off = () => [[c, 'backgroundColor', '#0F1011'], [sq, 'backgroundColor', '#FFD600'], [dg, 'color', '#121214'], [r.firstChild, 'color', '#FFFFFF']];
    if (state === 'off') off().forEach(([e, p, v]) => { e.style[p] = v; });
    A(c, [{opacity: 0, transform: 'translateY(24px) scale(.96)', filter: 'blur(8px)'}, {opacity: 1, transform: 'none', filter: 'blur(0)'}], t, .4, {e: EASE.soft});
    sfx('softswish', t, -26);
    if (F.L.mode === 'now' && !F.stillRows) { const prev = F.chips[F.chips.length - 1];   // a real clip (a still sets each chip from the sheet)
      if (prev) prev.forEach(([e, p, v]) => A(e, [{[p]: getComputedStyle(e)[p]}, {[p]: v}], t, .25, {f: 'forwards'})); }
    F.chips.push(off());
    return c;
}
