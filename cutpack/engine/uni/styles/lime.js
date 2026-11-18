/* =====================================================================
   STYLE · lime — "เขียวมะนาว" (Friend 2026-11-18, the 2nd of the 12 new sheets: "เริ่มทำสไตล์นี้ได้แต่ไม่ต้องทดสอบกับคลิปเดิมของผมนะ").
   Every place and size is measured on Friend's sheet (12 shots, 1080 × 1920), then held to Friend's rules for every style
   (styles/common.js: safe zone, frames below the search bar, centred words, the video filling its frame, seeded random, never over
   the face). The pictures are the glow-line template set first (Friend 2026-11-18: "ใช้ template ชุดฐานเป็นหลักเลยนะครับ").
   The 7-item form:
   1 frame    one of 12 layouts (LIME.layouts, named after Friend's shots): the speaker full screen with a glass card at the hands /
              over the chest / above the head / on the left / on the right, a split screen (graphics on top and the speaker below, or
              the other way), a dark screen with a big card, a recap of four cards. Between pictures the speaker talks with the words
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
    big:          {speaker: true, card: [80, 960, 840, 690], lead: {x: 540, y: 153}, key: {x: 540, y: 252}},                   // shot 03 (sheet x 62–1019, to y 1697)
    top:          {speaker: true, card: [160, 220, 760, 230], lead: {x: 540, y: 1023}, key: {x: 540, y: 1117}},                // shot 04 (sheet y 66: under the search bar)
    split_top:    {split: 'top', card: [100, 310, 820, 610], lead: {x: 540, y: 120}, key: {x: 540, y: 241}},                   // shot 05
    side_l:       {speaker: true, card: [60, 980, 450, 680], lead: {x: 735, y: 1183, maxW: 330}, key: {x: 735, y: 1281, maxW: 330}},   // shot 06 (sheet words to x 970: under the buttons)
    talk_top:     {speaker: true, lead: {x: 540, y: 114}, key: {x: 540, y: 241}},                                              // shot 07
    screen:       {screen: true, card: [80, 790, 840, 580], lead: {x: 540, y: 440}, key: {x: 540, y: 545}, bloom: [540, 760]}, // shot 08
    side_r:       {speaker: true, card: [490, 980, 430, 680], lead: {x: 280, y: 1176, maxW: 400}, key: {x: 280, y: 1270, maxW: 400}},  // shot 09 (sheet card to x 1036)
    split_bottom: {split: 'bottom', card: [100, 1215, 820, 445], lead: {x: 540, y: 1040}, key: {x: 540, y: 1154}},             // shot 10
    recap:        {screen: true, cards: [[60, 380, 420, 620], [500, 380, 420, 620], [60, 1040, 420, 620], [500, 1040, 420, 620]],
                   lead: {x: 540, y: 120}, key: {x: 540, y: 258}},                                                              // shot 11
    cta:          {speaker: true, card: [320, 1180, 440, 480], lead: {x: 540, y: 979}, key: {x: 540, y: 1084}},                // shot 12
  },
  split: 962,                                                       // the lime line of the split screens
  /* RANDOM, the same rules as neon: a call to action (B15) gets the closing card, a punchline (B14) the big dark screen; every
     other picture takes one of `pool` (never the one before it) where the face leaves room (limeRoom), among those the screens that
     show this picture's shape (glow/shapes.json) at least 75 % as big as the best, then the least used, then at random */
  pool: ['hands', 'big', 'top', 'split_top', 'side_l', 'screen', 'side_r', 'split_bottom'],
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
const LIME_HIGH = {talk_top: ['lead', 'key'], big: ['lead', 'key'], top: ['card']};
function limeFit(name, f) {
  const L0 = LIME.layouts[name]; if (L0.screen || L0.split) return L0;
  const [, top, , chin] = f, L = JSON.parse(JSON.stringify(L0));
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
const limeRoom = (name, f) => !!limeFit(name, f);

STYLE('lime', {
  name: 'เขียวมะนาว',
  layouts: LIME.layouts,
  css: `
@font-face{font-family:"LimeKey";src:url(fonts/Kanit-800-thai.woff);font-weight:800;unicode-range:U+02D7,U+0303,U+0331,U+0E01-0E5B,U+200C-200D,U+25CC}
@font-face{font-family:"LimeKey";src:url(fonts/Kanit-800-latin.woff);font-weight:800;unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+2000-206F}
.l-root{position:absolute;inset:0;--ink:#F4F6F2;--ac:#C9F64B;--lw:5;--sd:#F4F6F2;--fl:rgba(26,28,27,.8);--text:#F4F6F2}
.l-screen{background:radial-gradient(ellipse 95% 70% at 50% 42%,#1d201e 0%,#141615 55%,#0b0c0c 100%)}
.l-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.04) 1.5px,transparent 1.5px),linear-gradient(90deg,rgba(255,255,255,.04) 1.5px,transparent 1.5px);background-size:54px 54px;background-position:-6px -10px}
.l-bloom{position:absolute;width:980px;height:760px;translate:-50% -50%;background:radial-gradient(closest-side,rgba(175,235,60,.34),rgba(175,235,60,.1) 55%,transparent)}
.l-panel{position:absolute;left:0;right:0;overflow:hidden;background:radial-gradient(ellipse 95% 80% at 50% 45%,#1d201e 0%,#121413 70%,#0b0c0c 100%)}
.l-line{position:absolute;left:0;right:0;height:4px;background:#C9F64B;box-shadow:0 0 10px rgba(190,245,70,.85),0 0 26px rgba(170,235,50,.4)}
.l-video{position:absolute;left:0;right:0;overflow:hidden}
.l-card{position:absolute;border-radius:38px;background:rgba(26,28,27,.8);border:2px solid rgba(255,255,255,.24);
  box-shadow:0 22px 50px rgba(0,0,0,.45),inset 0 1px 0 rgba(255,255,255,.1);-webkit-backdrop-filter:blur(16px);backdrop-filter:blur(16px)}
.l-card::before{content:"";position:absolute;top:15px;left:50%;width:64px;height:7px;margin-left:-32px;border-radius:4px;background:rgba(255,255,255,.92)}
.l-text{position:absolute;inset:0}
.l-row{position:absolute;white-space:nowrap}
.l-lead{font-family:"Anu";font-weight:500;font-size:46px;line-height:1.3;color:#F2F4F0;text-shadow:0 0 3px rgba(0,0,0,.9),0 0 8px rgba(0,0,0,.75),0 2px 18px rgba(0,0,0,.6)}
.l-lead .hi{color:#C9F64B;font-weight:600}
.l-lead i{font-style:italic}
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
  setup() { BGL.style.background = '#000'; HOOKS.push(cpInsetHook); },

  frame(t0, t1, {index, scene}) {
    const meta = SCENES[scene]?.meta ?? {}, face = cpFaceBox(t0, t1);
    let name = meta.layout;
    if (!name) {
      const want = LIME.byCat[meta.cat];
      if (want && limeRoom(want, face)) name = want;
      else {
        let pool = LIME.pool.filter(n => n !== LIME.last && limeRoom(n, face));
        if (!pool.length) pool = ['screen', 'split_top', 'split_bottom'].filter(n => n !== LIME.last);
        const ar = typeof GLOW_SHAPES !== 'undefined' && meta.variant ? GLOW_SHAPES[meta.variant] : null;
        if (ar) {
          const size = n => { const [, , w, h] = limeFit(n, face).stage; return ar > w / h ? w * w / ar : h * h * ar; };
          const best = Math.max(...pool.map(size)); pool = pool.filter(n => size(n) >= .75 * best);
        }
        const least = Math.min(...pool.map(n => LIME.used[n] ?? 0)); pool = pool.filter(n => (LIME.used[n] ?? 0) === least);
        name = pool[Math.floor(cpRand('screen' + index) * pool.length)];
      }
    }
    LIME.used[name] = (LIME.used[name] ?? 0) + 1; LIME.last = name;
    const L = (meta.layout ? LIME.layouts[name] : limeFit(name, face)) ?? LIME.layouts.screen;   // (a test's forced layout stays as on the sheet)
    const root = div('', SC); root.className = 'l-root' + (L.screen ? ' l-screen' : '');
    const box = ([x, y, w, h], parent = root) => div(`left:${x}px;top:${y}px;width:${w}px;height:${h}px`, parent);
    const grid = host => { const g = div('', host); g.className = 'l-grid';   // the grid drifts very slowly (as Friend asked for neon), on the clip's clock
      const at = t => `${(-6 + 2 * t).toFixed(1)}px ${(-10 + 3 * t).toFixed(1)}px`;
      A(g, [{backgroundPosition: at(t0 - .2)}, {backgroundPosition: at(t1 + .2)}], t0 - .2, t1 - t0 + .4, {e: 'linear'}); };
    if (L.screen) {
      grid(root);
      if (L.bloom) { const b = div(`left:${L.bloom[0]}px;top:${L.bloom[1]}px`, root); b.className = 'l-bloom'; }
      A(root, [{opacity: 0, filter: 'blur(14px)', transform: 'scale(1.03)'}, {opacity: 1, filter: 'blur(0)', transform: 'none'}], t0 - .04, .35, {e: EASE.smooth});
      sfx('whoosh', t0 - .1, -20);
    }
    if (L.split) {                                                  // graphics on one half, the speaker on the other, a lime line between
      const y = LIME.split, top = L.split === 'top';
      const panel = top ? box([0, 0, 1080, y]) : box([0, y + 4, 1080, 1916 - y]); panel.className = 'l-panel'; grid(panel);
      const vid = top ? box([0, y + 4, 1080, 1916 - y]) : box([0, 0, 1080, y]); vid.className = 'l-video';
      cpInset(vid, 1080, top ? 1916 - y : y, t0, .3, top ? .42 : .52);
      const line = box([0, y, 1080, 4]); line.className = 'l-line';
      A(line, [{clipPath: 'inset(0 50% 0 50%)'}, {clipPath: 'inset(0 0 0 0)'}], t0, .45, {e: EASE.soft});
      A(panel, [{opacity: 0, transform: `translateY(${top ? -60 : 60}px)`}, {opacity: 1, transform: 'none'}], t0 - .04, .4, {e: EASE.soft});
      A(root, [{opacity: 0}, {opacity: 1}], t0 - .04, .2, {e: EASE.smooth});   // the whole split (its speaker copy too) only from t0
      sfx('whoosh', t0 - .1, -20);
    }
    A(root, [{opacity: 1, filter: 'blur(0)'}, {opacity: 0, filter: 'blur(10px)'}], t1 - .3, .3, {e: EASE.out, f: 'forwards'});
    /* the cards rise in, one after another; each picture lives INSIDE its card (it rises with it, and the bridge reads the card's
       dark glass as the picture's ground: darker tiles, as on the sheet) */
    const inner = ([, , w, h]) => [26, 44, w - 52, h - 70];
    const cards = (L.cards ?? (L.card ? [L.card] : [])).map((c, k) => { const e = box(c); e.className = 'l-card';
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
      const parts = String(lead).trim().split(/\s+/), hi = parts.length > 1 ? parts[parts.length - 1] : null;
      const r = cpLine(el, lead, 'l-lead', L.lead, undefined, 'l-row', hi);
      A(r, [{opacity: 0, filter: 'blur(8px)'}, {opacity: 1, filter: 'blur(0)'}], T.t0 + .15, .35, {e: EASE.smooth});
    }
    if (key && L.key) {
      const r = cpLine(el, key, 'l-key', L.key, undefined, 'l-row');
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
