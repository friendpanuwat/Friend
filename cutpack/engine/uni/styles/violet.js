/* =====================================================================
   STYLE · violet — "ม่วงคลื่นเสียง" (Violet Wave) (Friend 2026-11-18, the 5th of the new sheets: "ทำสไตล์นี้ต่อ", then the 12 shots
   full size: "ส่งให้ดูทั้ง 12 ภาพครับ"). Every place, size and colour is measured on those 1080 × 1920 shots, then held to the rules
   every style shares (styles/common.js: safe zone, frames below the search bar, centred words, the video filling its frame, seeded
   random, never over the face). The pictures: the glow-line template set first, in the glass look with violet light (GLASSY.violet).
   As for the two styles before (Friend's answers there): no small spaced labels ("DAY 1", "HOUSE RULES", "STEP 1 · SWAP"), and the
   words in a card are the spoken words. No chevrons (Friend 2026-11-18: "ลบสัญลักษณ์ที่ผมวงกลมสีแดงไว้ออกด้วยนะครับ ไม่ให้มีในสไตล์นี้เลย").
   The 7-item form:
   1 frame    one of 12 layouts (VIO.layouts, named after Friend's shots): the speaker full screen with a tall glass card at one side
              and the words at the other; a dark violet screen with a picture card on top, the words, the speaker's card under them;
              the speaker's card beside the words with a picture card under; a picture card, the words, the speaker's card beside a
              numbers card; three stacked cards, two cards in cascade, a strip of four (these three: stills only, one picture each).
   2 surface  violet-black screen, soft diagonal light bands drifting slowly, a row of violet sound-wave bars at the bottom that move
   3 drawing  the glow-line pictures: white lines, the lit part a violet outline, violet light
   4 colours  violet-black · white · one violet (#8B5CF6)
   5 words    a white lead (Anuphan 600) + the key word white in a violet pill (Anuphan 700)
   6 motion   cards rise in out of a blur, the speaker's card slides in, the pill pops on its word, the wave bars move
   7 sound    whoosh on a screen cut, a soft swish on the key word
   ===================================================================== */
const VIO = {
  /* boxes [x, y, w, h] · face = the speaker's card [x, y, w, h, radius] · cards = [x, y, w, h] each, the first holds the picture
     (pic: the picture box) · tower = the tall glass card on the speaker [x, y, w, h] · words {x, y (centre), maxW}: lead, key (in its
     pill) · rows: the numbers card's lines (y of each, label x, value right edge). Moved where Friend's shots ran under TikTok's
     search bar (the speaker's card of shot 04 starts at y 170), buttons (cards to x 1032: their pictures and words kept to 920; the
     towers to 1032 → 920) and name (cards to y 1680 → 1660). */
  layouts: {
    talk:          {speaker: true, lead: {x: 540, y: 1062}, key: {x: 540, y: 1165}},                                                    // between pictures
    banner_tuck:   {screen: true, cards: [[48, 170, 852, 480]], pic: [110, 230, 728, 380], lead: {x: 540, y: 780}, key: {x: 540, y: 880},
                    face: [180, 1010, 740, 650, 40]},                                                                                   // shot 01
    full_tower_r:  {speaker: true, tower: [600, 1000, 320, 660], pic: [620, 1170, 280, 380], lead: {x: 320, y: 1062, maxW: 500}, key: {x: 320, y: 1162, maxW: 500}},   // shot 02
    neon_stack:    {screen: true, still: true, lead: {x: 540, y: 445}, key: {x: 540, y: 557},
                    stack: [[48, 700, 984, 290], [48, 1020, 984, 300], [48, 1350, 984, 300]]},                                           // shot 03 (three pictures: stills only)
    side_card:     {screen: true, face: [60, 220, 540, 700, 40], lead: {x: 810, y: 570, maxW: 400, half: 50}, key: {x: 810, y: 663, maxW: 400, half: 60},
                    cards: [[300, 1000, 732, 660]], pic: [340, 1090, 560, 520]},                                                       // shot 04
    full_tower_l:  {speaker: true, tower: [60, 1000, 380, 660], pic: [80, 1170, 340, 380], lead: {x: 690, y: 1050, maxW: 440}, key: {x: 690, y: 1152, maxW: 440}},     // shot 05
    cascade:       {screen: true, still: true, lead: {x: 600, y: 815}, key: {x: 600, y: 922}, two: [[48, 190, 712, 510], [320, 1070, 712, 580]]},   // shot 06 (two pictures: stills only)
    full_tower_r2: {speaker: true, tower: [600, 1000, 320, 660], pic: [620, 1170, 280, 380], lead: {x: 300, y: 1052, maxW: 470}, key: {x: 300, y: 1172, maxW: 470}},   // shot 07
    twin_towers:   {screen: true, cards: [[48, 170, 984, 350]], pic: [250, 220, 580, 270], lead: {x: 540, y: 640}, key: {x: 540, y: 745},
                    face: [60, 870, 380, 790, 40], numbers: [480, 870, 552, 790], rows: [1070, 1200, 1330, 1460], rowX: 540, rowR: 910},  // shot 08
    full_tower_l2: {speaker: true, tower: [60, 1000, 380, 660], pic: [80, 1170, 340, 380], lead: {x: 690, y: 1060, maxW: 440}, key: {x: 690, y: 1162, maxW: 440}},     // shot 09
    banner_tuck_r: {screen: true, cards: [[180, 170, 852, 480]], pic: [230, 230, 740, 380], lead: {x: 540, y: 775}, key: {x: 540, y: 872},
                    face: [60, 1010, 840, 650, 40]},                                                                                    // shot 10
    strip_recap:   {screen: true, still: true, lead: {x: 540, y: 488}, key: {x: 540, y: 592},
                    strip: [[60, 820, 200, 480], [280, 820, 200, 480], [500, 820, 200, 480], [720, 820, 200, 480]]},                   // shot 11 (four pictures: stills only)
    full_tower_r3: {speaker: true, tower: [600, 1000, 320, 660], pic: [620, 1170, 280, 380], lead: {x: 320, y: 1052, maxW: 500}, key: {x: 320, y: 1162, maxW: 500}},   // shot 12
  },
  /* RANDOM, as the other styles: a call to action (B15) gets shot 12, a number (B01) the numbers screen; every other picture takes
     one of `pool` (never the one before it) where the face leaves room (vioFit), among those the screens that show this picture's
     shape at least 75 % as big as the best, then the least used, then at random from the run's seed */
  pool: ['banner_tuck', 'full_tower_r', 'side_card', 'full_tower_l', 'full_tower_r2', 'twin_towers', 'full_tower_l2', 'banner_tuck_r'],
  byCat: {B15: 'full_tower_r3', B01: 'twin_towers'},
  keep: .75,
  used: {}, last: null,
};
const vioIn = (c, p) => [p[0] - c[0], p[1] - c[1], p[2], p[3]];

/* fit a speaker screen to this face [x0, top, x1, chin]: the tower and the words start under the chin (they slide down; the tower
   shortens to keep its bottom at 1660, at least 420 high); null = no room. Screens: the speaker is in his card, always fits. */
function vioFit(name, f) {
  const L0 = VIO.layouts[name]; if (!L0.speaker) return L0;
  const [, , , chin] = f, L = JSON.parse(JSON.stringify(L0));
  const tops = [L.lead.y - 45, L.key.y - 60].concat(L.tower ? [L.tower[1]] : []), d = Math.max(0, chin + 30 - Math.min(...tops));
  L.lead.y += d; L.key.y += d;
  if (L.key.y + 70 > 1660) return null;
  if (L.tower) { L.tower[1] += d; L.tower[3] = Math.min(L.tower[3], 1660 - L.tower[1]); if (L.tower[3] < 420) return null;
    L.pic[1] += d; L.pic[3] = Math.min(L.pic[3], L.tower[1] + L.tower[3] - 30 - L.pic[1]); if (L.pic[3] < 200) return null; }
  return L;
}

STYLE('violet', {
  name: 'ม่วงคลื่นเสียง',
  layouts: VIO.layouts,
  css: `
.v-root{position:absolute;inset:0;--ink:#F3F0FB;--ac:#8B5CF6;--lw:5;--sd:#F3F0FB;--fl:rgba(17,9,33,.85);--text:#F3F0FB}
.v-screen{background:linear-gradient(180deg,#180d2f 0%,#170d2f 20%,#100922 47%,#0d081c 88%,#0c0819 100%);overflow:hidden}
.v-bands{position:absolute;inset:-200px;background:repeating-linear-gradient(200deg,transparent 0 70px,rgba(150,110,255,.045) 95px,rgba(170,130,255,.07) 105px,rgba(150,110,255,.045) 115px,transparent 140px 230px);filter:blur(6px)}
.v-wave{position:absolute;left:0;right:0;top:1740px;height:150px}
.v-bar{position:absolute;bottom:0;width:13px;border-radius:7px;background:linear-gradient(180deg,rgba(150,115,245,.32),rgba(110,80,210,.22));box-shadow:0 0 10px rgba(130,95,240,.25);transform-origin:50% 100%}
.v-card{position:absolute;border-radius:44px;background:rgba(17,9,33,.92);border:2px solid #8D5EF8;box-shadow:0 0 18px rgba(139,92,246,.18),inset 0 0 40px rgba(60,30,120,.18)}
.v-tower{position:absolute;border-radius:40px;background:rgba(80,45,170,.24);border:2px solid #8E5DF8;box-shadow:0 0 18px rgba(139,92,246,.25)}
.v-face{position:absolute;overflow:hidden;border:2px solid #8D5EF8;box-shadow:0 0 16px rgba(139,92,246,.22)}
.v-text{position:absolute;inset:0}
.v-row{position:absolute;white-space:nowrap}
.v-row i{font-style:normal}
.v-lead{font-family:"Anu";font-weight:600;font-size:76px;line-height:1.2;color:#FFFFFF;text-shadow:0 0 3px rgba(0,0,0,.85),0 0 10px rgba(0,0,0,.6),0 3px 18px rgba(0,0,0,.5)}
.v-key{display:inline-block;font-family:"Anu";font-weight:700;font-size:84px;line-height:1.18;color:#fff;background:#8B5CF6;border-radius:22px;padding:2px 36px 8px;
  box-shadow:0 0 0 1px rgba(190,160,255,.35),0 0 30px rgba(139,92,246,.55),0 8px 22px rgba(0,0,0,.35)}
.v-num{font-family:"Anu";font-weight:500;font-size:46px;line-height:1.3;color:#FFFFFF}
.v-val{font-family:"Anu";font-weight:600;font-size:46px;line-height:1.3;color:#FFFFFF}
.v-div{position:absolute;height:2px;background:#272136}
.v-cap{font-family:"Anu";font-weight:500;font-size:44px;line-height:1.3;color:#F3F0FB}
.v-lbl{position:absolute;font-family:"Anu";font-weight:500;font-size:28px;letter-spacing:9px;color:#C9B8FF;translate:-50% -50%}
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
      const want = VIO.byCat[String(meta.cat ?? '').slice(0, 3)];
      if (want && vioFit(want, face)) name = want;
      else {
        let pool = VIO.pool.filter(n => n !== VIO.last && vioFit(n, face));
        if (!pool.length) pool = ['banner_tuck', 'side_card', 'banner_tuck_r'].filter(n => n !== VIO.last);
        const ar = typeof GLOW_SHAPES !== 'undefined' && meta.variant ? GLOW_SHAPES[meta.variant] : null;
        if (ar) {
          const size = n => { const [, , w, h] = vioFit(n, face).pic; return ar > w / h ? w * w / ar : h * h * ar; };
          const best = Math.max(...pool.map(size)); pool = pool.filter(n => size(n) >= VIO.keep * best);
        }
        const least = Math.min(...pool.map(n => VIO.used[n] ?? 0)); pool = pool.filter(n => (VIO.used[n] ?? 0) === least);
        name = pool[Math.floor(cpRand('screen' + index) * pool.length)];
      }
    }
    VIO.used[name] = (VIO.used[name] ?? 0) + 1; VIO.last = name;
    const L = (meta.layout ? VIO.layouts[name] : vioFit(name, face)) ?? VIO.layouts.banner_tuck;
    const root = div('', SC); root.className = 'v-root' + (L.screen ? ' v-screen' : '');
    const box = ([x, y, w, h], parent = root) => div(`left:${x}px;top:${y}px;width:${w}px;height:${h}px`, parent);
    const rise = (e, k) => A(e, [{opacity: 0, transform: 'translateY(40px) scale(.96)', filter: 'blur(10px)'}, {opacity: 1, transform: 'none', filter: 'blur(0)'}], t0 + .04 + .12 * k, .45, {e: EASE.soft});
    if (L.screen) {
      /* the light bands drift slowly down-left; the wave bars at the bottom move (heights from the run's seed) */
      const bands = div('', root); bands.className = 'v-bands';
      A(bands, [{transform: 'translate(0,0)'}, {transform: `translate(${-14 * (t1 - t0 + .4)}px,${8 * (t1 - t0 + .4)}px)`}], t0 - .2, t1 - t0 + .4, {e: 'linear'});
      const wave = div('', root); wave.className = 'v-wave';
      for (let k = 0; k < 26; k++) { const x = 70 + k * 36.4, h = 14 + Math.round(96 * Math.pow(cpRand('bar' + k), 1.6)), b = div(`left:${x}px;height:${h}px`, wave); b.className = 'v-bar';
        A(b, [{transform: 'scaleY(1)'}, {transform: `scaleY(${(.35 + .5 * cpRand('beat' + k)).toFixed(2)})`}, {transform: 'scaleY(1)'}], t0 - .2 + .13 * (k % 7), .9 + .5 * cpRand('per' + k), {e: 'ease-in-out', it: 40}); }
      A(root, [{opacity: 0, filter: 'blur(14px)', transform: 'scale(1.03)'}, {opacity: 1, filter: 'blur(0)', transform: 'none'}], t0 - .04, .35, {e: EASE.smooth});
      sfx('whoosh', t0 - .1, -20);
    }
    A(root, [{opacity: 1, filter: 'blur(0)'}, {opacity: 0, filter: 'blur(10px)'}], t1 - .3, .3, {e: EASE.out, f: 'forwards'});
    /* the cards (each picture lives inside its card) */
    const card = (c, k) => { const e = box(c); e.className = 'v-card'; rise(e, k); return e; };
    let stage = box([540, 960, 1, 1]), stages = null;
    if (L.cards) { const c = card(L.cards[0], 0); stage = box(vioIn(L.cards[0], L.pic), c); }
    if (L.tower) { const t = box(L.tower); t.className = 'v-tower'; rise(t, 0); stage = box(vioIn(L.tower, L.pic), t); }
    if (L.stack) stages = L.stack.map((c, k) => box([c[2] / 2 - 220, 80, 440, c[3] - 110], card(c, k)));
    if (L.two) stages = L.two.map((c, k) => box([40, 40, Math.min(c[2] - 80, 920 - c[0] - 40), c[3] - 80], card(c, k)));   // (a picture stays left of x 920)
    if (L.strip) stages = L.strip.map((c, k) => { const e = card(c, k), n = div(`left:${c[2] / 2}px;top:52px`, e, String(k + 1).padStart(2, '0')); n.className = 'v-lbl';
      if (meta.rows?.[k]) cpLine(root, meta.rows[k], 'v-cap', {x: c[0] + c[2] / 2, y: 1375, maxW: 210}, undefined, 'v-row');
      return box([12, 170, c[2] - 24, 240], e); });
    if (L.numbers) { const nc = card(L.numbers, 1); L.rows.slice(0, -1).forEach((y, k) => { const d = div(`left:${L.rowX - L.numbers[0]}px;top:${y + 63 - L.numbers[1]}px;width:${L.rowR - L.rowX}px`, nc); d.className = 'v-div'; }); }
    /* the speaker's card */
    if (L.face) { const [x, y, w, h, r] = L.face, f = box([x, y, w, h]); f.className = 'v-face cp-frame'; f.style.borderRadius = r + 'px';
      cpInset(f, w - 4, h - 4, t0, .42, .45);
      A(f, [{opacity: 0, transform: 'translateY(30px)'}, {opacity: 1, transform: 'none'}], t0 + .05, .45, {e: EASE.soft}); }
    const F = {root, stage, stages, cam: root, L, name, dark: !!L.screen, t1, n: 0, meta};
    if ((typeof CAPTIONS === 'undefined' || !CAPTIONS.length) && meta.rows && L.numbers) F.stillRows = meta.rows;
    return F;
  },
  /* between pictures: the words at the chest, moved below the chin when the face is low */
  speakerFrame(a, b) {
    const root = div('', SC); root.className = 'v-root';
    return {root, cam: root, speaker: true, L: vioFit('talk', cpFaceBox(a, b)) ?? VIO.layouts.talk, name: 'talk'};
  },
  /* the words: a white lead + the key word in its violet pill, each chunk in and out with its own words. The numbers screen: its
     first chunk is the headline, each next chunk a line of the numbers card (the lead at the left, the key word at the right,
     violet while it is the newest, as the sheet's last line), staying until the picture ends (Friend: the words in a card are the
     spoken words) */
  text(F, T, lead, key) {
    const L = F.L ?? VIO.layouts.talk, el = div('', F.root ?? SC); el.className = 'v-text';
    const head = () => {
      if (lead && L.lead) { const r = cpLine(el, lead, 'v-lead', L.lead, undefined, 'v-row'); A(r, [{opacity: 0, filter: 'blur(8px)'}, {opacity: 1, filter: 'blur(0)'}], T.t0 + .15, .35, {e: EASE.smooth}); }
      if (key && L.key) { const r = cpLine(el, key, 'v-key', L.key, undefined, 'v-row');
        A(r, [{opacity: 0, transform: 'scale(.82)'}, {opacity: 1, transform: 'scale(1.04)', offset: .7}, {opacity: 1, transform: 'none'}], T.hit - .05, .4, {e: EASE.soft});
        sfx('softswish', T.hit - .05, -21); } };
    if (!L.numbers) {
      head();
      if (F.speaker && T.clip) {
        A(el, [{visibility: 'hidden'}, {visibility: 'visible'}], T.b[0] - .02, .001); A(el, [{visibility: 'visible'}, {visibility: 'hidden'}], T.end - .021, .001, {f: 'forwards'});
        return null;
      }
      return el;
    }
    /* the numbers screen */
    if (!lead && !key && !F.stillRows) return null;               // the scene's own empty sentence takes no place
    const n = F.n++, start = T.b[0] - .02;
    const row = (k, l, v, t) => { if (k >= L.rows.length) return; const y = L.rows[k];
      const a = l ? cpLine(el, l, 'v-num', {x: L.rowX, y, maxW: 230, align: 'left'}, undefined, 'v-row') : null;
      let b = null;                                             // the value: right-aligned at the card's right edge (x 910)
      if (v) { b = div(`right:${1080 - L.rowR}px;top:${y}px;translate:0 -50%`, el); b.className = 'v-row cp-row'; const sp = document.createElement('span'); sp.className = 'v-val'; sp.textContent = v; b.appendChild(sp); }
      [a, b].forEach(r => r && A(r, [{opacity: 0, transform: 'translateY(14px)', filter: 'blur(8px)'}, {opacity: 1, transform: 'none', filter: 'blur(0)'}], t, .4, {e: EASE.soft}));
      if (b) { b.querySelector('span').style.color = '#8A5CF5'; if (F.lastVal) A(F.lastVal, [{color: '#8A5CF5'}, {color: '#FFFFFF'}], t, .3, {f: 'forwards'}); F.lastVal = b.querySelector('span'); } };
    if (n === 0) head(); else row(n - 1, lead, key, start);
    if (F.stillRows && n === 0) F.stillRows.forEach(([l, v], k) => row(k, l, v, T.b[0] + .3 + .25 * k));
    if (T.clip) { A(el, [{visibility: 'hidden'}, {visibility: 'visible'}], start, .001); return null; }
    return el;
  },
});
