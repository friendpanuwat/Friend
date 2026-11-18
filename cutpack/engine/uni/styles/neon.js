/* =====================================================================
   STYLE · neon — "นีออนฟ้า" (Friend 2026-11-17: the 4 old styles cancelled for 12 sheets Friend made with AI, "ให้เริ่มจากรูปที่ 2",
   "ตัวอย่างที่ผมส่งไปให้สามารถลอกได้เลย 100%"). Every place and size below is measured on Friend's sheet (2nd image, 12 shots), in the
   1080 × 1920 frame. The pictures are the glow-line template set (glow/bridge.js), in this style's colours.
   The 7-item form:
   1 frame    a shot is one of 12 layouts (NEON.layouts, named after Friend's shots): the speaker full screen with the picture at the
              hands / across the chest / bottom right, or a navy screen with the speaker in a rounded square / a band / a window, the picture
              beside the words, the picture alone, a recap of three. Between pictures the speaker talks with the words low or split.
   2 surface  navy screen with a faint blue grid; the speaker's window, square and band have a thin glowing blue edge
   3 drawing  the glow-line pictures: navy glass bodies, every line glows blue (the first glass look Friend kept)
   4 colours  navy · white · one light neon blue
   5 words    a small white lead (an English word in it is an italic serif, Friend's "skip", "check") + a huge heavy key word,
              white at the top to light blue at the bottom (Friend 2026-11-17: "subtitle จะมีการไล่สีด้วย ... ขาวกับฟ้า"), glowing (Kanit ExtraBold)
   6 motion   soft: the navy screen comes in out of a blur, the key word lights up on its word
   7 sound    whoosh on a screen cut, a soft swish on the key word
   ===================================================================== */
const NEON = {
  /* SAFE ZONE (Friend 2026-11-17: "ที่สำคัญที่สุดอย่าลืมเลี่ยงโซนอันตรายของติ๊กต๊อกและ IG ... อย่าให้ปุ่มพวกนี้มันมาบังเด็ดขาด"): every word, picture
     and framed face stays inside x 60–920 · y 250–1440 (top: the For You / search bar · bottom 480: name, caption, sound · right 160: like,
     comment, share, follow). The speaker's own video may run under the buttons, as in every clip. Above Friend's "copy 100%". */
  /* measured on TikTok's own screen (Friend 2026-11-17 sent its overlay: "เห็นไหมว่าขอบล่างมันไม่จำเป็นต้องเว้นเยอะขนาดนั้น"): the tabs end at
     y 195, the name starts at y 1690, the button column is x 936– from y 754 to 1680. So: y 220–1660, x 60–1020 above y 740 (no buttons
     there), x 60–920 below it. The TOP is Friend's sheet as it is (Friend 2026-11-17: "ขอบบนเอาเท่าเดิมที่ผมส่งรูปตัวอย่างให้ผมให้ดูแค่ขอบล่าง
     เท่านั้น"): no top limit. */
  /* (the numbers live in styles/common.js, CP.safe, for every style) */
  /* FRAMED FACES (Friend 2026-11-18: "กรอบสี่เหลี่ยมหน้าผมมันแทบจะชิดขอบบนของคลิปอยู่แล้วซึ่งมันจะโดนแถบค้นหาของ TikTok บัง" · "อยากให้
     motion graphic กับกรอบสี่เหลี่ยมหน้าผมมันห่างกันนิดนึง"): every frame with the speaker starts at y 220 or lower (the search bar
     ends at y 195), and the picture box starts 40 under it (neonSafeCheck reports both).
     PICTURE BOXES made bigger (Friend 2026-11-17 on the first real clip: "ทำไมโมชั่นกราฟฟิกเล็กจังเลยมันดูโล่งๆอ่ะ" — pictures took 2–17 %
     of the screen): every box as wide as the safe zone lets it (840: x 80–920, the buttons start at x 936) and as tall as the words and the face leave room for.
     boxes [x, y, w, h] · words {x, y (centre), align, maxW}: Friend's sheet (2nd image), each shot moved and squeezed into the safe zone
     (2026-11-17; the sheet put the words at y 1400–1620 and pictures at the right edge, under TikTok's caption and buttons) */
  layouts: {
    talk_low:   {speaker: true, lead: {x: 540, y: 1405}, key: {x: 540, y: 1540}},                                                       // shot 01 (centred: Friend 2026-11-17 "ทำไม subtitle มันชิดซ้ายมันต้องอยู่กึ่งกลางสิ"; the sheet had it on the left)
    hands:      {speaker: true, lead: {x: 540, y: 1045}, key: {x: 540, y: 1120}, stage: [180, 1250, 720, 400]},                           // shot 02
    chest:      {speaker: true, stage: [140, 970, 800, 330], lead: {x: 540, y: 1420}, key: {x: 540, y: 1540}},                           // shot 03
    square:     {screen: true, square: [540, 460, 240, 44], stage: [80, 740, 840, 580], lead: {x: 540, y: 1420}, key: {x: 540, y: 1540}},  // shot 04 (Friend 2026-11-17: the circle → a rounded square, "ขยายใหญ่อีกนิดนึง ย้ำว่าแค่นิดเดียว": 440 → 480)
    band:       {screen: true, lead: {x: 540, y: 220}, key: {x: 540, y: 340}, band: [160, 470, 760, 600, 40], stage: [80, 1110, 840, 530]},   // shot 05 (Friend 2026-11-17: the full-width band → a rounded rectangle the video fills, a little wider than the video was: 704 → 760)
    side:       {screen: true, stage: [60, 520, 520, 880], lead: {x: 735, y: 890, maxW: 330}, key: {x: 735, y: 1010, maxW: 330}},      // shot 06 (tall pictures)
    talk_split: {speaker: true, lead: {x: 540, y: 960}, key: {x: 540, y: 1080}},                                                        // shot 07 (the lead right above the key word, Friend 2026-11-18 final: "Subtitles ตัวเล็กและตัวใหญ่ต้องอยู่ด้วยกัน"; the sheet had it at the top, y 230)
    window:     {screen: true, win: [160, 220, 760, 680, 40], stage: [80, 940, 840, 440], lead: {x: 540, y: 1440}, key: {x: 540, y: 1545}}, // shot 08
    diag:       {speaker: true, lead: {x: 540, y: 140}, key: {x: 540, y: 265}, stage: [480, 1060, 440, 580]},   // shot 09 (words centred, Friend 2026-11-17)
    word:       {screen: true, lead: {x: 540, y: 220}, key: {x: 540, y: 340}, stage: [80, 460, 840, 980]},                              // shot 10 (the lead above the key word at the top, Friend 2026-11-18 final: "ตัวเล็กและตัวใหญ่ต้องอยู่ด้วยกัน"; the sheet had the lead under the picture, y 1380 · the picture runs down into its old place)
    recap:      {screen: true, lead: {x: 540, y: 120}, key: {x: 540, y: 250}, stages: [[260, 430, 680, 300], [220, 870, 700, 290], [340, 1270, 520, 380]],
                 nums: [[100, 620], [100, 1060], [100, 1520]]},                                                                             // shot 11
    cta:        {speaker: true, stage: [240, 950, 640, 400], lead: {x: 540, y: 1410}, key: {x: 540, y: 1540}},                           // shot 12
  },
  /* RANDOM (Friend 2026-11-17: "ต่อให้ user อัพคลิปเดิมลงไปแล้วกดรันอีกรอบนึงผมก็ไม่อยากให้มันออกมาเหมือนกัน", DECISIONS 3): the screen of each
     picture is drawn from the run's seed (RUN.seed, written by tools/clip_plan.py), so a new run gives a new order and the same
     plan always gives the same clip. Rules: a call to action (B15) gets the closing screen, a punchline (B14) the big-word screen;
     every other picture takes one of `pool`, never the one before it; a screen with the picture on the speaker (hands, chest,
     closing, top-left words) only where the speaker's face leaves it room (`neonRoom`). Among those, the SHAPE decides (Friend:
     "ทำไมโมชั่นกราฟฟิกเล็กจังเลย"): each design's width / height is measured once (glow/shapes.json, glow/shapes.js) and only the
     screens whose box shows this picture at least 75 % as big as the best one stay in; then the least used, then at random. */
  pool: ['hands', 'square', 'chest', 'band', 'diag', 'window', 'side', 'word', 'cta'],   // + the call-to-action screen as any screen (Friend 2026-11-18: "ทำตามที่คุณแนะนำ" · the sheets are read for their layout only) ·   // 'word' joined 2026-11-17: its box is the biggest (Friend: "มันดูโล่งๆ")
  byCat: {B15: 'cta', B14: 'word'},
  used: {}, last: null,
};
/* the shared helpers (styles/common.js) under this style's old names */
const neonRand = cpRand, neonFaceBox = cpFaceBox, neonFace = cpFace, neonInset = cpInset;
function neonLine(parent, txt, cls, P, maxW) { return cpLine(parent, txt, cls, P, maxW, 'n-row'); }
function neonSafeCheck() { return cpSafeCheck(NEON.layouts); }
/* can this screen go over this face? (the picture and the words never on the face: a picture under the chin needs the chin above
   its top; the top-left words need the hair below them) */
function neonRoom(name, f) {
  const [, top, , chin] = f, L = NEON.layouts[name];
  if (L.screen) return true;
  if (name === 'diag') return top - 130 > L.key.y + 110 && chin + 30 < L.stage[1];   // the hair (≈ 130 above the forehead) under the words, the chin above the picture
  if (name === 'talk_split') return chin + 20 < L.lead.y - 40;      // the lead sits on the key word now (final 2026-11-18)
  if (L.stage) return chin + 30 < Math.min(L.stage[1], L.lead ? L.lead.y - 40 : 1e9);
  return chin + 20 < L.lead.y - 40;                                 // talk_low
}

STYLE('neon', {
  name: 'นีออนฟ้า',
  layouts: NEON.layouts,
  css: `
@font-face{font-family:"NeonKey";src:url(fonts/Kanit-800-thai.woff);font-weight:800;unicode-range:U+02D7,U+0303,U+0331,U+0E01-0E5B,U+200C-200D,U+25CC}
@font-face{font-family:"NeonKey";src:url(fonts/Kanit-800-latin.woff);font-weight:800;unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+2000-206F}
@font-face{font-family:"NeonSerif";src:url(fonts/InstrumentSerif-Italic-latin.woff);font-style:italic}
.n-root{position:absolute;inset:0;--ink:#F2F7FA;--ac:#7FD6FF;--lw:5;--sd:#EAF6FF;--fl:rgba(14,26,43,.75);--text:#EAF6FF}
.n-screen{background:radial-gradient(ellipse 95% 70% at 50% 42%,#14263d 0%,#0c1828 55%,#070e18 100%)}
.n-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(120,190,255,.075) 1.5px,transparent 1.5px),linear-gradient(90deg,rgba(120,190,255,.075) 1.5px,transparent 1.5px);background-size:54px 54px;background-position:-6px -10px}
.n-vig{position:absolute;inset:0;background:radial-gradient(ellipse 80% 60% at 50% 45%,transparent 55%,rgba(2,6,12,.55) 100%)}
.n-frame{position:absolute;overflow:hidden;border:3px solid #5DB9EC;box-shadow:0 0 10px rgba(80,180,255,.6),0 0 26px rgba(60,160,255,.25)}
.n-band{position:absolute;overflow:hidden;border-top:3px solid #6CC4FF;border-bottom:3px solid #6CC4FF;box-shadow:0 0 16px rgba(80,180,255,.7),0 0 36px rgba(60,160,255,.3)}
.n-text{position:absolute;inset:0}
.n-row{position:absolute;white-space:nowrap}
.n-lead{font-family:"Anu";font-weight:500;font-size:48px;line-height:1.3;color:#EEF3F7;text-shadow:0 0 3px rgba(0,3,10,.95),0 0 8px rgba(0,3,10,.8),0 2px 18px rgba(0,3,10,.6)}
.n-lead i{font-family:"NeonSerif";font-style:italic;font-weight:400;font-size:1.22em;color:#DCEBFF;margin:0 .08em}
.n-key{font-family:"NeonKey";font-weight:800;font-size:150px;line-height:1.12;letter-spacing:-1px;
  color:transparent;background:linear-gradient(180deg,#F7FDFF 0%,#D6F2FF 34%,#86D6FF 68%,#47B4F5 100%);-webkit-background-clip:text;background-clip:text;
  filter:drop-shadow(0 0 2px rgba(205,242,255,.85)) drop-shadow(0 0 10px rgba(60,170,240,.95)) drop-shadow(0 0 26px rgba(40,150,235,.7))}
.n-key i{font-family:"NeonSerif";font-weight:400}
.n-num{position:absolute;font-family:"NeonSerif";font-style:italic;font-size:110px;line-height:1;color:#7CC8FF;translate:0 -50%;
  text-shadow:0 0 10px rgba(80,180,255,.8),0 0 28px rgba(60,160,255,.4)}
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
    BGL.style.background = '#000';
    HOOKS.push(cpInsetHook);
  },

  frame(t0, t1, {index, scene}) {
    const meta = SCENES[scene]?.meta ?? {}, face = neonFaceBox(t0, t1);
    let name = meta.layout, overL = null;
    /* an OVERLAY (Friend 2026-11-17: "ฉากที่เป็นหน้าผมพูดล้วนๆ อยากให้ใส่โอเวอร์เลย์เข้าไปด้วย ... ใส่แค่นิดเดียวพอ", tools/clip_plan.py picks
       which, from the template set only): the speaker talks with the words low, a small picture above the head or under the chin,
       wherever the face leaves more room (at least 160 high, at most 320), never on the face; no room → a full-screen picture */
    if (!name && typeof RUN !== 'undefined' && RUN.overlays?.includes(scene)) {
      const T = NEON.layouts.talk_low, up = [110, face[1] - 150], down = [face[3] + 40, T.lead.y - 75];
      const [y0, y1] = up[1] - up[0] >= down[1] - down[0] ? up : down, h = Math.min(320, y1 - y0);
      if (h >= 160) { name = 'over'; overL = {speaker: true, over: true, lead: T.lead, key: T.key, stage: [170, Math.round(y0 + (y1 - y0 - h) / 2), 740, h]}; }
    }
    if (!name) {
      const want = NEON.byCat[meta.cat];
      if (want && neonRoom(want, face)) name = want;
      else {
        let pool = NEON.pool.filter(n => n !== NEON.last && neonRoom(n, face));
        if (!pool.length) pool = ['square', 'window', 'band'].filter(n => n !== NEON.last);
        const ar = typeof GLOW_SHAPES !== 'undefined' && meta.variant ? GLOW_SHAPES[meta.variant] : null;
        if (ar) {                                                            // how big the picture comes out in each screen's box
          const size = n => { const [, , w, h] = NEON.layouts[n].stage; return ar > w / h ? w * w / ar : h * h * ar; };
          const best = Math.max(...pool.map(size)); pool = pool.filter(n => size(n) >= .75 * best);
        }
        const least = Math.min(...pool.map(n => NEON.used[n] ?? 0)); pool = pool.filter(n => (NEON.used[n] ?? 0) === least);
        name = pool[Math.floor(neonRand('screen' + index) * pool.length)];
      }
    }
    if (name !== 'over') { NEON.used[name] = (NEON.used[name] ?? 0) + 1; NEON.last = name; }
    const L = overL ?? NEON.layouts[name] ?? NEON.layouts.square;
    const root = div('', SC); root.className = 'n-root' + (L.screen ? ' n-screen' : '');
    const box = ([x, y, w, h], parent = root) => div(`left:${x}px;top:${y}px;width:${w}px;height:${h}px`, parent);
    if (L.screen) {
      const grid = div('', root); grid.className = 'n-grid'; div('', root).className = 'n-vig';
      /* the grid drifts very slowly (Friend 2026-11-17: "พื้นหลังที่เป็นตารางอยากให้ขยับได้ด้วยแต่ว่าขยับช้าๆมากๆเลยนะ"): 2 px/s right, 3 px/s
         down, from the clip's own clock, so it carries on from one screen to the next */
      const at = t => `${(-6 + 2 * t).toFixed(1)}px ${(-10 + 3 * t).toFixed(1)}px`;
      A(grid, [{backgroundPosition: at(t0 - .2)}, {backgroundPosition: at(t1 + .2)}], t0 - .2, t1 - t0 + .4, {e: 'linear'});
      if (L.square) { const [cx, cy, r, rad] = L.square, c = box([cx - r, cy - r, 2 * r, 2 * r]); c.className = 'n-frame cp-frame'; c.style.borderRadius = rad + 'px'; neonInset(c, 2 * r - 6, 2 * r - 6, t0, .42, .48);
        A(c, [{opacity: 0, transform: 'scale(.85)'}, {opacity: 1, transform: 'none'}], t0 + .05, .45, {e: EASE.soft}); }
      if (L.band) { const [bx, by, bw, bh, br] = L.band, b = box([bx, by, bw, bh]); b.className = 'n-frame cp-frame'; b.style.borderRadius = br + 'px'; neonInset(b, bw - 6, bh - 6, t0, .42, .46);
        A(b, [{opacity: 0, clipPath: 'inset(50% 0 50% 0)'}, {opacity: 1, clipPath: 'inset(0 0 0 0)'}], t0 + .05, .45, {e: EASE.soft}); }
      if (L.win) { const [x, y, w, h, r] = L.win, b = box([x, y, w, h]); b.className = 'n-frame cp-frame'; b.style.borderRadius = r + 'px'; neonInset(b, w - 6, h - 6, t0, .42, .46);
        A(b, [{opacity: 0, transform: 'translateY(-40px)'}, {opacity: 1, transform: 'none'}], t0 + .05, .5, {e: EASE.soft}); }
      (L.nums ?? []).forEach(([x, y], k) => { const n = div(`left:${x}px;top:${y}px`, root, String(k + 1).padStart(2, '0')); n.className = 'n-num';
        A(n, [{opacity: 0}, {opacity: 1}], t0 + .3 + k * .2, .4, {e: EASE.smooth}); });
      A(root, [{opacity: 0, filter: 'blur(14px)', transform: 'scale(1.03)'}, {opacity: 1, filter: 'blur(0)', transform: 'none'}], t0 - .04, .35, {e: EASE.smooth});
      sfx('whoosh', t0 - .1, -20);
    }
    A(root, [{opacity: 1, filter: 'blur(0)'}, {opacity: 0, filter: 'blur(10px)'}], t1 - .3, .3, {e: EASE.out, f: 'forwards'});
    const stage = L.stage ? box(L.stage) : box([0, 0, 1, 1]);
    if (L.over) A(stage, [{opacity: 0, transform: 'translateY(24px) scale(.94)', filter: 'blur(8px)'}, {opacity: 1, transform: 'none', filter: 'blur(0)'}], t0 + .05, .45, {e: EASE.soft});
    const stages = L.stages ? L.stages.map(s => box(s)) : null;
    return {root, stage, stages, cam: root, L, name, dark: !!L.screen};
  },
  /* between pictures (a real clip): the speaker talks with the words low (shot 01) or split top / middle (shot 07); one of the two
     for each stretch between pictures, at random from the run's seed (two in three low), never over the face */
  speakerFrame(a, b) {
    const gap = CLIPWINS.filter(x => x.t1 <= a + .05).length, face = neonFaceBox(a, b);
    let name = neonRand('talk' + gap) < .67 ? 'talk_low' : 'talk_split';
    if (!neonRoom(name, face)) name = name === 'talk_low' ? 'talk_split' : 'talk_low';
    const root = div('', SC); root.className = 'n-root';
    return {root, cam: root, speaker: true, L: NEON.layouts[name], name};
  },
  /* the lead fades in out of a blur; the key word comes in on its word and lights up */
  text(F, T, lead, key) {
    const L = F.L ?? NEON.layouts.talk_low, el = div('', F.root ?? SC); el.className = 'n-text';
    if (lead && L.lead) { const r = neonLine(el, lead, 'n-lead', L.lead); A(r, [{opacity: 0, filter: 'blur(8px)'}, {opacity: 1, filter: 'blur(0)'}], T.t0 + .15, .35, {e: EASE.smooth}); }
    if (key && L.key) {
      const r = neonLine(el, key, 'n-key', L.key);
      A(r, [{opacity: 0, transform: 'scale(.9)', filter: 'blur(10px) brightness(2)'}, {opacity: 1, transform: 'none', filter: 'blur(0) brightness(1)'}], T.hit - .05, .45, {e: EASE.soft});
      sfx('softswish', T.hit - .05, -21);
    }
    if (F.speaker && T.clip) {                     // a real clip between pictures: cut in and out on the words (core.js clipCaption)
      A(el, [{visibility: 'hidden'}, {visibility: 'visible'}], T.b[0] - .02, .001); A(el, [{visibility: 'visible'}, {visibility: 'hidden'}], T.end - .021, .001, {f: 'forwards'});
      return null;                                  // (null: the core would move a returned block to the subtitle height)
    }
    return el;
  },
});
