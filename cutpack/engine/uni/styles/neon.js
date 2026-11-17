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
   5 words    a small white lead (an English word in it is an italic serif, Friend's "skip", "check") + a huge heavy key word in
              glowing light blue (Kanit ExtraBold)
   6 motion   soft: the navy screen comes in out of a blur, the key word lights up on its word
   7 sound    whoosh on a screen cut, a soft swish on the key word
   ===================================================================== */
const NEON = {
  face: {x: 540, y: 700},                          // the test clip's face centre (a real clip reads faces.json)
  /* SAFE ZONE (Friend 2026-11-17: "ที่สำคัญที่สุดอย่าลืมเลี่ยงโซนอันตรายของติ๊กต๊อกและ IG ... อย่าให้ปุ่มพวกนี้มันมาบังเด็ดขาด"): every word, picture
     and framed face stays inside x 60–920 · y 250–1440 (top: the For You / search bar · bottom 480: name, caption, sound · right 160: like,
     comment, share, follow). The speaker's own video may run under the buttons, as in every clip. Above Friend's "copy 100%". */
  safe: [60, 250, 920, 1440],
  /* boxes [x, y, w, h] · words {x, y (centre), align, maxW}: Friend's sheet (2nd image), each shot moved and squeezed into the safe zone
     (2026-11-17; the sheet put the words at y 1400–1620 and pictures at the right edge, under TikTok's caption and buttons) */
  layouts: {
    talk_low:   {speaker: true, lead: {x: 60, y: 1195, align: 'left'}, key: {x: 60, y: 1325, align: 'left'}},                            // shot 01
    hands:      {speaker: true, lead: {x: 540, y: 905}, key: {x: 540, y: 1005}, stage: [250, 1120, 580, 300]},                            // shot 02
    chest:      {speaker: true, stage: [210, 975, 660, 180], lead: {x: 540, y: 1195}, key: {x: 540, y: 1325}},                           // shot 03
    square:     {screen: true, square: [540, 490, 240, 44], stage: [180, 755, 720, 395], lead: {x: 540, y: 1195}, key: {x: 540, y: 1325}},  // shot 04 (Friend 2026-11-17: the circle → a rounded square, "ขยายใหญ่อีกนิดนึง ย้ำว่าแค่นิดเดียว": 440 → 480)
    band:       {screen: true, lead: {x: 540, y: 290}, key: {x: 540, y: 405}, band: [0, 520, 1080, 565], stage: [270, 1105, 540, 320]},   // shot 05
    side:       {screen: true, stage: [70, 670, 470, 580], lead: {x: 735, y: 890, maxW: 330}, key: {x: 735, y: 1010, maxW: 330}},      // shot 06
    talk_split: {speaker: true, lead: {x: 540, y: 300}, key: {x: 540, y: 1080}},                                                        // shot 07
    window:     {screen: true, win: [160, 250, 760, 590, 40], stage: [240, 865, 600, 290], lead: {x: 540, y: 1195}, key: {x: 540, y: 1325}}, // shot 08
    diag:       {speaker: true, lead: {x: 60, y: 300, align: 'left'}, key: {x: 60, y: 425, align: 'left', maxW: 640}, stage: [500, 1000, 410, 420]},   // shot 09
    word:       {screen: true, key: {x: 540, y: 370}, stage: [110, 500, 800, 660], lead: {x: 540, y: 1250}},                            // shot 10
    recap:      {screen: true, lead: {x: 540, y: 290}, key: {x: 540, y: 405}, stages: [[260, 520, 620, 230], [220, 790, 690, 250], [300, 1080, 560, 340]],
                 nums: [[95, 635], [95, 915], [95, 1250]]},                                                                              // shot 11
    cta:        {speaker: true, lead: {x: 540, y: 300}, stage: [300, 965, 480, 245], key: {x: 540, y: 1325}},                            // shot 12 (the lead moved up over the head: below the chin there was room for a 210-high picture only)
  },
  order: ['hands', 'square', 'chest', 'band', 'diag', 'window', 'side', 'cta', 'word'],   // a real clip's pictures take turns (the recap only when asked)
  talk: ['talk_low', 'talk_low', 'talk_split'],
  insets: [],
  talkN: 0,
};
/* the speaker's face at time t: faces.json of a real clip, else the test clip's */
function neonFace(t) {
  if (typeof FACES === 'undefined' || !FACES.track?.length) return NEON.face;
  const tr = FACES.track.reduce((a, b) => Math.abs(b[0] - t) < Math.abs(a[0] - t) ? b : a)[1];
  return {x: (tr[0] + tr[2]) / 2, y: (tr[1] + tr[3]) / 2};
}
/* the speaker inside a shape: a copy of the speaker's frame (it follows the video on every seek), scaled by s with the face at (cx, cy) */
function neonInset(parent, s, cx, cy, t) {
  const f = neonFace(t), im = document.createElement('img');
  Object.assign(im.style, {position: 'absolute', width: `${1080 * s}px`, height: `${1920 * s}px`, left: `${cx - f.x * s}px`, top: `${cy - f.y * s}px`, maxWidth: 'none'});
  parent.appendChild(im); NEON.insets.push(im); return im;
}
/* one line of words: Latin words in the italic serif (Friend's "skip"), shrunk (never wrapped) to maxW */
function neonLine(parent, txt, cls, P, maxW) {
  const row = div('', parent); row.className = 'n-row';
  const sp = document.createElement('span'); sp.className = cls; row.appendChild(sp);
  for (const part of String(txt).split(/([A-Za-z][A-Za-z'’-]*)/)) {
    if (!part) continue;
    if (/^[A-Za-z]/.test(part)) { const i = document.createElement('i'); i.textContent = part; sp.appendChild(i); } else sp.appendChild(document.createTextNode(part));
  }
  const al = P.align ?? 'center';
  Object.assign(row.style, {left: al === 'left' ? `${P.x}px` : al === 'right' ? 'auto' : `${P.x}px`, top: `${P.y}px`,
    translate: al === 'left' ? '0 -50%' : '-50% -50%', transformOrigin: al === 'left' ? '0 50%' : '50% 50%'});
  const [x0, , x1] = NEON.safe, room = al === 'left' ? x1 - P.x : 2 * Math.min(P.x - x0, x1 - P.x);   // never wider than the safe zone allows here
  FITS.push(() => { const w = sp.offsetWidth, m = Math.min(maxW ?? P.maxW ?? 960, room); if (w > m) row.style.scale = String(m / w); });
  return row;
}

/* what sits outside the safe zone now (tests and stills): words, pictures (what the drawing really shows) and framed faces */
function neonSafeCheck() {
  const [x0, y0, x1, y1] = NEON.safe, k = 1080 / document.documentElement.clientWidth || 1, out = [];
  const test = (what, r) => { if (!r || r.width < 1) return; const b = [r.left * k, r.top * k, r.right * k, r.bottom * k].map(Math.round);
    if (b[0] < x0 - 1 || b[1] < y0 - 1 || b[2] > x1 + 1 || b[3] > y1 + 1) out.push({what, box: b}); };
  document.querySelectorAll('.n-row > span').forEach(e => { if (getComputedStyle(e.parentElement.parentElement).opacity > .05) test('words "' + e.textContent + '"', e.getBoundingClientRect()); });
  document.querySelectorAll('.glow-host svg').forEach(svg => {   // what the picture really shows now (not its hidden parts)
    const seen = e => { for (let x = e; x && x !== svg; x = x.parentElement) { const cs = getComputedStyle(x); if (cs.display === 'none' || +cs.opacity < .05) return false; } return true; };
    let u = null; svg.querySelectorAll('path,line,polyline,polygon,rect,circle,ellipse,text,image').forEach(e => { if (e.closest('clipPath,defs') || !seen(e)) return;
      const r = e.getBoundingClientRect(); if (r.width < .5 && r.height < .5) return;
      u = u ? {left: Math.min(u.left, r.left), top: Math.min(u.top, r.top), right: Math.max(u.right, r.right), bottom: Math.max(u.bottom, r.bottom)} : {left: r.left, top: r.top, right: r.right, bottom: r.bottom}; });
    if (u) test('picture', {...u, width: u.right - u.left}); });
  document.querySelectorAll('.n-frame').forEach(e => test('framed face', e.getBoundingClientRect()));
  return out;
}

STYLE('neon', {
  name: 'นีออนฟ้า',
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
.n-key{font-family:"NeonKey";font-weight:800;font-size:150px;line-height:1.12;color:#7DDAFF;letter-spacing:-1px;
  text-shadow:0 0 2px rgba(205,242,255,.9),0 0 10px rgba(60,170,240,.95),0 0 26px rgba(40,150,235,.75),0 0 56px rgba(30,120,220,.45)}
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
    HOOKS.push(async () => { for (const im of NEON.insets) if (V.src && im.src !== V.src) { im.src = V.src; try { await im.decode(); } catch (e) {} } });
  },

  frame(t0, t1, {index, scene}) {
    const name = SCENES[scene]?.meta.layout ?? NEON.order[index % NEON.order.length], L = NEON.layouts[name] ?? NEON.layouts.hands;
    const root = div('', SC); root.className = 'n-root' + (L.screen ? ' n-screen' : '');
    const box = ([x, y, w, h], parent = root) => div(`left:${x}px;top:${y}px;width:${w}px;height:${h}px`, parent);
    if (L.screen) {
      div('', root).className = 'n-grid'; div('', root).className = 'n-vig';
      if (L.square) { const [cx, cy, r, rad] = L.square, c = box([cx - r, cy - r, 2 * r, 2 * r]); c.className = 'n-frame'; c.style.borderRadius = rad + 'px'; neonInset(c, .76, r, r + 27, t0);
        A(c, [{opacity: 0, transform: 'scale(.85)'}, {opacity: 1, transform: 'none'}], t0 + .05, .45, {e: EASE.soft}); }
      if (L.band) { const b = box(L.band); b.className = 'n-band'; neonInset(b, .65, L.band[2] / 2, 265, t0);
        A(b, [{opacity: 0, clipPath: 'inset(50% 0 50% 0)'}, {opacity: 1, clipPath: 'inset(0 0 0 0)'}], t0 + .05, .45, {e: EASE.soft}); }
      if (L.win) { const [x, y, w, h, r] = L.win, b = box([x, y, w, h]); b.className = 'n-frame'; b.style.borderRadius = r + 'px'; neonInset(b, .62, w / 2, 300, t0);
        A(b, [{opacity: 0, transform: 'translateY(-40px)'}, {opacity: 1, transform: 'none'}], t0 + .05, .5, {e: EASE.soft}); }
      (L.nums ?? []).forEach(([x, y], k) => { const n = div(`left:${x}px;top:${y}px`, root, String(k + 1).padStart(2, '0')); n.className = 'n-num';
        A(n, [{opacity: 0}, {opacity: 1}], t0 + .3 + k * .2, .4, {e: EASE.smooth}); });
      A(root, [{opacity: 0, filter: 'blur(14px)', transform: 'scale(1.03)'}, {opacity: 1, filter: 'blur(0)', transform: 'none'}], t0 - .04, .35, {e: EASE.smooth});
      sfx('whoosh', t0 - .1, -20);
    }
    A(root, [{opacity: 1, filter: 'blur(0)'}, {opacity: 0, filter: 'blur(10px)'}], t1 - .3, .3, {e: EASE.out, f: 'forwards'});
    const stage = L.stage ? box(L.stage) : box([0, 0, 1, 1]);
    const stages = L.stages ? L.stages.map(s => box(s)) : null;
    return {root, stage, stages, cam: root, L, name, dark: !!L.screen};
  },
  /* between pictures (a real clip): the speaker talks, the words low (two times in three) or split top / middle (shot 01, 07) */
  speakerFrame(a, b) {
    const name = NEON.talk[NEON.talkN++ % NEON.talk.length], root = div('', SC); root.className = 'n-root';
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
