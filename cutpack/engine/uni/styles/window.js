/* =====================================================================
   STYLE · window — "หน้าต่างแอป" (App Window) (Friend 2026-11-18, the 3rd of the new sheets: "สไตล์ต่อไปครับ")
   Every place and size is measured on Friend's sheet (12 shots, 1080 × 1920), then held to the rules every style shares
   (styles/common.js: safe zone, frames below the search bar, centred words, the video filling its frame, seeded random, never over
   the face). The pictures: the glow-line template set first, in the glass look with blue light (glow/bridge.js GLASSY.window).
   The 7-item form:
   1 frame    one of 12 layouts (WIN.layouts, named after Friend's shots): the speaker full screen with an app window at the hands,
              or a deep-blue screen with a big window, the speaker in a rounded frame beside a window, two windows in cascade, a recap
              of four. Between pictures the speaker talks with the words at the chest. (The sheet's chapter bar top left and the small
              spaced label over the words are left out: Friend 2026-11-18, "ลบที่ผมวงกลมสีแดงออกด้วยครับทุกฉากเลย".)
   2 surface  screens: near-black to navy (Friend's background picture, 2026-11-18) with our own turning rings top right and bottom
              left (one glowing line, white app-chips, a running light); the pictures sit in dark app windows (three dots, a skeleton
              title bar)
   3 drawing  the glow-line pictures: white lines, the lit part a blue outline (no solid fill), blue light
   4 colours  deep blue · near-black windows · white · one blue (#2F6FEB)
   5 words    a white lead (Sriracha) + the key word hollow with a blue outline (Kanit 800; over the video a faint dark fill) — final
   6 motion   windows rise in out of a blur, screens fade in, the key word pops on its word
   final 2026-11-18 (style-rules/window.md section 15): the window over the head (full_top), the screens without the face with their
   window in the middle of the screen and the picture in the middle of it, no box round a word alone (GLASSY.window.noPill)
   7 sound    whoosh on a screen cut, a soft swish on the key word
   The words the sheet invents (window titles "เป้าหมายปีนี้", tags "STEP 1/3") are skeleton bars instead (Friend 2026-11-18), so the
   AI has nothing more to write.
   ===================================================================== */
const WIN = {
  /* boxes [x, y, w, h] · words {x, y (centre), maxW, half (half the row's height, for the right edge)}. Moved where the sheet ran
     under TikTok's name / buttons / tabs. */
  layouts: {
    talk:     {speaker: true, lead: {x: 540, y: 1062}, key: {x: 540, y: 1175}},                                                  // shot 01 without its window
    full:     {speaker: true, lead: {x: 540, y: 1062}, key: {x: 540, y: 1175}, win: [80, 1300, 840, 360]},              // shot 01 (sheet to y 1682)
    full_n:   {speaker: true, lead: {x: 540, y: 1117}, key: {x: 540, y: 1226}, win: [210, 1340, 670, 320]},             // shot 02 (narrow window)
    dark:     {screen: true, lead: {x: 540, y: 381}, key: {x: 540, y: 490}, win: [80, 645, 840, 630], decor: 0, ringUp: 230},    // shot 03 · final point 4: the window in the middle of the screen, the words 90 over it (the top ring 230 higher, off the words)
    float:    {screen: true, frame: [62, 258, 470, 740, 30], lead: {x: 770, y: 610, maxW: 470}, key: {x: 770, y: 700, maxW: 470, half: 50},
               win: [300, 1070, 620, 560], decor: 0},                                                                    // shot 04
    full_w:   {speaker: true, lead: {x: 540, y: 1040}, key: {x: 540, y: 1183}, win: [170, 1300, 740, 360]},             // shot 05
    cascade:  {screen: true, win2: [300, 270, 690, 460], lead: {x: 330, y: 887}, key: {x: 330, y: 1023}, win: [60, 1178, 720, 470], decor: 1},   // shot 06 · 1170 → 1178 (final, point 4: 90 under the key word)
    full_d:   {speaker: true, lead: {x: 540, y: 1051}, key: {x: 540, y: 1161}, win: [80, 1300, 840, 360]},             // shot 07
    stats:    {screen: true, frame: [560, 250, 360, 690, 30], lead: {x: 290, y: 653, maxW: 440}, key: {x: 290, y: 756, maxW: 440, half: 50},
               win: [80, 1070, 840, 560], decor: 1},                                                                     // shot 08 (sheet frame to x 1019)
    full_c:   {speaker: true, lead: {x: 540, y: 1073}, key: {x: 540, y: 1172}, win: [80, 1300, 840, 360]},             // shot 09
    dark_b:   {screen: true, lead: {x: 540, y: 385}, key: {x: 540, y: 490}, win: [80, 645, 840, 630], decor: 1, ringUp: 230},    // shot 10 · final point 4: as dark
    recap:    {screen: true, lead: {x: 540, y: 262}, key: {x: 540, y: 365},
               wins: [[80, 520, 400, 420], [500, 520, 420, 420], [80, 980, 400, 420], [500, 980, 420, 420]], decor: 0, ringUp: 230},     // shot 11 · final point 4: the four windows in the middle of the screen, the words 90 over them
    cta:      {speaker: true, lead: {x: 540, y: 1066}, key: {x: 540, y: 1172}, win: [80, 1300, 840, 360]},             // shot 12
    /* final 2026-11-18 (Friend: "พื้นที่ด้านบนหัวยังว่างสามารถเอาโอเวอร์เลย์ไปไว้ตรงนั้นได้นะครับ เพื่อความหลากหลาย"): the window over
       the head, from under the search bar (220) to 140 over the face box (the hair, as lime's top card); its height from the clip's
       face (winFit) · the words at the chest as shot 01 */
    full_top: {speaker: true, top: true, lead: {x: 540, y: 1062}, key: {x: 540, y: 1175}, win: [120, 220, 840, 560]},
  },
  pool: ['full', 'full_n', 'dark', 'float', 'full_w', 'cascade', 'full_d', 'stats', 'full_c', 'dark_b', 'cta', 'full_top'],   // + the call-to-action screen as any screen (Friend 2026-11-18: "ทำตามที่คุณแนะนำ" · the sheets are read for their layout only)
  byCat: {B15: 'cta', B14: 'dark'},
  used: {}, last: null, place: {top: 0, low: 0},   // place: how many speaker screens had the window over the head / under it
  /* the screens' background. The gradient was measured on a picture Friend sent (2026-11-18: "ผมอยากได้ background แบบนี้"): near-black
     at the top to deep navy at the bottom. The rings are our own (Friend: "รูปนี้ผมไปก๊อปเขามาผมก็เลยอยากให้คุณดีไซน์วงแหวนใหม่หน่อย"):
     per corner one glowing blue ring (one line, as before: "อยากให้มันเป็นเส้นเดียวมันอันเก่า") carrying two white app-chips (rounded
     squares, as the windows) and a short running light. Each ring {cx, cy, r, chips: [angles], light: angle, dir}; 0 = top
     right + bottom left, 1 = mirrored (screens whose frame or back window covers the top right; its lower chips sit left of TikTok's
     buttons, x 920, and turn away from them). */
  decor: [
    [{cx: 930, cy: 170, r: 330, chips: [165, 100], light: 132, dir: 1}, {cx: 140, cy: 1760, r: 300, chips: [-80, -10], light: -45, dir: -1}],
    [{cx: 150, cy: 170, r: 330, chips: [15, 80], light: 48, dir: 1}, {cx: 940, cy: 1760, r: 300, chips: [260, 190], light: 225, dir: -1}],
  ],
  ring: 'split',                                // the ring's shape (winRingPath): 'split' (Friend 2026-11-18 chose ค) · 'square' · 'hex'
  spin: 4.5,                                    // degrees a second (Friend: "หมุนให้เร็วกว่านี้อีกนิดนึง" 1.5 → 2.25, then "วงแหวนต้องหมุนเร็วกว่านี้อีก" → 4.5)
};
/* the ring's line, centred at (R, R), from the angle 0 clockwise (as the angles of its chips): a rounded square (as the windows), a
   hexagon, or a circle ("split": the chips sit in gaps of it) */
function winRingPath(shape, R, r) {
  const f = v => v.toFixed(1);
  if (shape === 'square') { const k = r * .45, a = R - r, b = R + r;
    return `M ${f(b)} ${f(R)} L ${f(b)} ${f(b - k)} Q ${f(b)} ${f(b)} ${f(b - k)} ${f(b)} L ${f(a + k)} ${f(b)} Q ${f(a)} ${f(b)} ${f(a)} ${f(b - k)} L ${f(a)} ${f(a + k)} Q ${f(a)} ${f(a)} ${f(a + k)} ${f(a)} L ${f(b - k)} ${f(a)} Q ${f(b)} ${f(a)} ${f(b)} ${f(a + k)} Z`; }
  if (shape === 'hex') return 'M ' + [0, 1, 2, 3, 4, 5].map(i => `${f(R + r * Math.cos(i * Math.PI / 3))} ${f(R + r * Math.sin(i * Math.PI / 3))}`).join(' L ') + ' Z';
  return `M ${f(R + r)} ${f(R)} A ${r} ${r} 0 1 1 ${f(R - r)} ${f(R)} A ${r} ${r} 0 1 1 ${f(R + r)} ${f(R)} Z`;
}
const winInner = ([, , w, h]) => [22, 76, w - 44, h - 98];        // the picture inside a window (under its 64-high title bar)

/* fit a speaker screen to this face [x0, top, x1, chin] (as lime): the words and the window under the face slide below the chin
   (the window shortens to keep its bottom at 1660, at least 260 high); null = no room. Screens always fit. */
function winFit(name, f) {
  const L0 = WIN.layouts[name]; if (L0.screen) return L0;
  const [, top, , chin] = f, L = JSON.parse(JSON.stringify(L0));
  if (L.top) { L.win[3] = Math.min(L0.win[3], top - 140 - L.win[1]); if (L.win[3] < 260) return null; }   // over the head: no room under the search bar? not this screen
  const tops = [L.lead.y - 45, L.key.y - 55].concat(L.win && !L.top ? [L.win[1]] : []), d = Math.max(0, chin + 30 - Math.min(...tops));
  L.lead.y += d; L.key.y += d;
  if (L.win && !L.top) { L.win[1] += d; L.win[3] = Math.min(L.win[3], 1660 - L.win[1]); if (L.win[3] < 260) return null; }
  if (L.key.y + 55 > 1660) return null;
  return L;
}
STYLE('window', {
  name: 'หน้าต่างแอป',
  layouts: WIN.layouts,
  css: `
@font-face{font-family:"WinKey";src:url(fonts/Kanit-800-thai.woff);font-weight:800;unicode-range:U+02D7,U+0303,U+0331,U+0E01-0E5B,U+200C-200D,U+25CC}
@font-face{font-family:"WinKey";src:url(fonts/Kanit-800-latin.woff);font-weight:800;unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+2000-206F}
@font-face{font-family:"WinLead";src:url(fonts/Sriracha-Regular.ttf)}
.w-root{position:absolute;inset:0;--ink:#F2F6FC;--ac:#5B9BFF;--lw:5;--sd:#F2F6FC;--fl:rgba(14,18,28,.88);--text:#F2F6FC}
.w-screen{background:linear-gradient(180deg,#000206 0%,#010c1a 7%,#021022 19%,#03152d 31%,#041b3b 44%,#041f45 56%,#04224b 69%,#05244d 81%,#05224a 100%);overflow:hidden}
.w-arc{position:absolute}
.w-arc svg{position:absolute;inset:0;overflow:visible}
.w-main{filter:drop-shadow(0 0 5px rgba(79,134,196,.75))}
.w-light{filter:drop-shadow(0 0 6px rgba(225,238,255,.95))}
.w-chip{position:absolute;width:54px;height:54px;background:#fff;border-radius:15px;box-shadow:0 0 8px rgba(255,255,255,.9),0 0 26px rgba(150,195,255,.6)}
.w-chip::after{content:"";position:absolute;left:19px;top:19px;width:16px;height:16px;border-radius:5px;background:#2F6FEB}   /* 54 px: Friend "ลูกปัด ... ใหญ่ๆกว่านี้อีกนิดนึง" (was 42) */
.w-win{position:absolute;border-radius:26px;background:rgba(13,17,27,.9);border:1.5px solid rgba(255,255,255,.14);
  box-shadow:0 22px 50px rgba(0,0,0,.5),inset 0 1px 0 rgba(255,255,255,.06);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);overflow:hidden}
.w-bar{position:absolute;left:0;right:0;top:0;height:64px;border-bottom:1px solid rgba(255,255,255,.06)}
.w-dot{position:absolute;top:25px;width:14px;height:14px;border-radius:50%}
.w-skel{position:absolute;left:104px;top:24px;height:16px;border-radius:8px;background:rgba(230,237,248,.22)}
.w-skel.tag{left:auto;right:22px;top:20px;width:64px;height:24px;border-radius:9px;background:rgba(60,120,255,.28)}
.w-frame{position:absolute;overflow:hidden;border:2px solid rgba(130,180,255,.65);box-shadow:0 0 18px rgba(80,140,255,.35)}
.w-text{position:absolute;inset:0}
.w-row{position:absolute;white-space:nowrap}
/* final 2026-11-18 (Friend: "subtitle ภาษาไทยปัจจุบันเป็นเหมือนรูปที่แนบไปรูปที่ 1 แต่ผมอยากให้มันเป็นเหมือนรูปที่แนบไปรูปที่ 2" · "ข"):
   the key word hollow with a blue outline (was white in a blue pill); over the speaker (.w-vid) the hollow letters get a faint dark
   fill so they read over the room · the lead white in Sriracha (Friend: "ส่วนตัวอักษรสีขาวอยากให้ใช้ฟอนต์นี้ครับ", was Kanit 500) */
.w-lead{font-family:"WinLead";font-weight:400;font-size:74px;line-height:1.2;color:#F4F7FC;text-shadow:0 0 3px rgba(0,0,0,.85),0 0 10px rgba(0,0,0,.6),0 3px 18px rgba(0,0,0,.5)}
.w-key{display:inline-block;font-family:"WinKey";font-weight:800;font-size:112px;line-height:1.16;color:transparent;-webkit-text-stroke:3.5px #6FA6FF;
  filter:drop-shadow(0 0 10px rgba(80,140,255,.45))}
.w-vid .w-key{color:rgba(4,12,32,.5);filter:drop-shadow(0 0 3px rgba(0,0,0,.7)) drop-shadow(0 0 12px rgba(60,120,255,.45))}
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
    BGL.style.background = '#000'; HOOKS.push(cpInsetHook);
    /* load this style's fonts at once: the words are fitted to the safe zone on the first frame (hud 2026-11-18: fitted with the fallback font) */
    [['WinKey', 800, 'normal'], ['WinLead', 400, 'normal']].forEach(([f, w, st]) => div(`left:-9999px;top:0;font-family:${f};font-weight:${w};font-style:${st}`, document.body, 'กขคฅ ึ่้ 0123 Ab'));
    /* no chapter bar and no small label (Friend 2026-11-18: "ลบที่ผมวงกลมสีแดงออกด้วยครับทุกฉากเลย") */
  },

  /* FIT PICK (Friend 2026-11-18: "motion graphic ที่ระบบจะสุ่มเลือกมาต้องเหมาะสมกับพื้นที่ว่างที่มีอยู่" → every style: "ข"): the pictures' real shapes
     (tools/real_shapes.js, a second build) and how much of the screen a shape can take here (tools/fit_pick.js), as the neon style */
  realShapes: true,
  fitSize(ar, t0, t1) { const face = cpFaceBox(t0, t1); return cpFitSize(ar, WIN.pool.filter(n => winFit(n, face)), n => { const F = winFit(n, face); return F ? winInner(F.win) : null; }, .75, n => !!WIN.layouts[n].speaker); },
  fitSurface() { const r = div('', SC); r.className = 'w-root w-screen'; return r; },

  frame(t0, t1, {index, scene}) {
    const meta = SCENES[scene]?.meta ?? {}, face = cpFaceBox(t0, t1);
    let name = meta.layout;
    if (!name) {
      const want = WIN.byCat[String(meta.cat ?? '').slice(0, 3)];
      if (want && winFit(want, face)) name = want;
      else {
        let pool = WIN.pool.filter(n => n !== WIN.last && winFit(n, face));
        if (!pool.length) pool = ['dark', 'float', 'cascade'].filter(n => n !== WIN.last);
        const ar = cpShape(meta.variant, t0);   // the picture's shape in this clip (REAL_SHAPES), else the sample's (fit pick, 2026-11-18)
        if (ar) {
          const size = n => { const [, , w, h] = winInner(winFit(n, face).win); return ar > w / h ? w * w / ar : h * h * ar; };
          pool = cpSizeKeep(pool, size, .75, n => !!WIN.layouts[n].speaker);   // the speaker's screens with a picture: a floor, no race on size (Friend 2026-11-18: "อยากให้ ก ขึ้นบ้าง (ทุกสไตล์เลยนะ)")
        }
        pool = cpBalance(pool, n => !!WIN.layouts[n].speaker, index);   // ก (the speaker full screen) and ข (a graphic screen) as often (Friend 2026-11-18)
        /* a speaker screen: the window over the head or under it as often ("เพื่อความหลากหลาย"); the less used place, a tie by the run's seed */
        const tp = pool.filter(n => WIN.layouts[n].top), lw = pool.filter(n => WIN.layouts[n].speaker && !WIN.layouts[n].top);
        if (tp.length && lw.length) { const P = WIN.place, up = P.top !== P.low ? P.top < P.low : cpRand('place' + index) < .5; pool = up ? tp : lw; }
        const least = Math.min(...pool.map(n => WIN.used[n] ?? 0)); pool = pool.filter(n => (WIN.used[n] ?? 0) === least);
        name = pool[Math.floor(cpRand('screen' + index) * pool.length)];
      }
    }
    WIN.used[name] = (WIN.used[name] ?? 0) + 1; WIN.last = name;
    if (WIN.layouts[name].speaker) WIN.place[WIN.layouts[name].top ? 'top' : 'low']++;
    const L = (meta.layout ? WIN.layouts[name] : winFit(name, face)) ?? WIN.layouts.dark;
    const root = div('', SC); root.className = 'w-root' + (L.screen ? ' w-screen' : '');
    const box = ([x, y, w, h], parent = root) => div(`left:${x}px;top:${y}px;width:${w}px;height:${h}px`, parent);
    if (L.screen) {
      const D = WIN.decor[L.decor ?? 0], long = Math.max(1, t1 - t0);
      D.forEach(({cx, cy, r, chips, light, dir}, j) => {
        if (j === 0) cy -= L.ringUp ?? 0;         // the top ring moves up when the words sit high (final point 4)
        const R = r + 20, sz = [cx - R, cy - R, 2 * R, 2 * R], spin = dir * WIN.spin * long, rad = a => a * Math.PI / 180;
        const turn = (el, deg) => A(el, [{transform: 'rotate(0deg)'}, {transform: `rotate(${deg}deg)`}], t0 - .05, long + .4);
        /* one line (Friend: "อยากให้มันเป็นเส้นเดียว"), its running light and its chips; the shape: WIN.ring */
        const g = box(sz); g.className = 'w-arc';
        g.innerHTML = `<svg width="${2 * R}" height="${2 * R}"><path class="w-main" d="${winRingPath(WIN.ring, R, r)}" fill="none" stroke="#4F86C4" stroke-width="3.5" stroke-linejoin="round"/>`
          + `<path class="w-light" d="${winRingPath(WIN.ring, R, r)}" fill="none" stroke="#EAF2FF" stroke-width="4" stroke-linecap="round"/></svg>`;
        const line = g.querySelector('.w-main'), lit = g.querySelector('.w-light'), len = line.getTotalLength(), arc = 64;
        const at = ang => { let best = 0, d = 1e9; for (let k = 0; k < 360; k++) { const p = line.getPointAtLength(len * k / 360);   // where the ray at this angle meets the line
          const e = Math.abs(((Math.atan2(p.y - R, p.x - R) * 180 / Math.PI - ang) % 360 + 540) % 360 - 180); if (e < d) { d = e; best = len * k / 360; } } return best; };
        lit.setAttribute('stroke-dasharray', `${arc} ${len}`); lit.setAttribute('stroke-dashoffset', `${-(at(light) - arc / 2)}`);
        if (WIN.ring === 'split') {               /* the circle broken where its chips sit: the chips join the arcs */
          const gap = 64, cut = chips.map(at).sort((a, b) => a - b);
          const runs = cut.map((c, k) => [c + gap, (k + 1 < cut.length ? cut[k + 1] : cut[0] + len) - gap]);
          line.setAttribute('stroke-dasharray', runs.map(([s0, s1], k) => `${s1 - s0} ${(k + 1 < runs.length ? runs[k + 1][0] : runs[0][0] + len) - s1}`).join(' '));
          line.setAttribute('stroke-dashoffset', `${-runs[0][0]}`); }
        turn(g, spin);
        chips.forEach((ang, k) => { const p = line.getPointAtLength(at(ang)), c = div(`left:${p.x - 27}px;top:${p.y - 27}px`, g); c.className = 'w-chip';
          turn(c, -spin);                                                     // stays upright while its ring turns
          A(c, [{opacity: 1}, {opacity: .6}, {opacity: 1}], t0 + (2 * j + k) * .55, 2.6, {e: 'ease-in-out', it: 4}); });
      });
      A(root, [{opacity: 0, filter: 'blur(14px)', transform: 'scale(1.03)'}, {opacity: 1, filter: 'blur(0)', transform: 'none'}], t0 - .04, .35, {e: EASE.smooth});
      sfx('whoosh', t0 - .1, -20);
    }
    if (L.frame) { const [x, y, w, h, r] = L.frame, f = box([x, y, w, h]); f.className = 'w-frame cp-frame'; f.style.borderRadius = r + 'px';
      cpInset(f, w - 4, h - 4, t0, .42, .4);
      A(f, [{opacity: 0, transform: 'translateY(-30px)'}, {opacity: 1, transform: 'none'}], t0 + .05, .45, {e: EASE.soft}); }
    A(root, [{opacity: 1, filter: 'blur(0)'}, {opacity: 0, filter: 'blur(10px)'}], t1 - .3, .3, {e: EASE.out, f: 'forwards'});
    /* the windows: three dots, then a skeleton title bar (Friend 2026-11-18: "แบบ skeleton ... ไม่มีข้อความแต่มีเหมือนเป็นแบบช่องๆเหลี่ยมๆมนๆ"):
       a faint rounded bar where the title was (its length from the run's seed) and an empty blue pill where the tag was; each picture
       lives inside its window */
    const makeWin = (c, k, tag = true) => { const w = box(c); w.className = 'w-win';
      const bar = div('', w); bar.className = 'w-bar';
      ['#FF5F57', '#FEBC2E', '#28C840'].forEach((col, i) => { const d = div(`left:${26 + i * 24}px;background:${col}`, bar); d.className = 'w-dot'; });
      div(`width:${Math.round(Math.min(c[2] * .34, 110 + 90 * cpRand('bar' + index + k)))}px`, bar).className = 'w-skel';
      if (tag) div('', bar).className = 'w-skel tag';
      A(w, [{opacity: 0, transform: 'translateY(40px) scale(.95)', filter: 'blur(10px)'}, {opacity: 1, transform: 'none', filter: 'blur(0)'}], t0 + .04 + .12 * k, .45, {e: EASE.soft});
      return box(winInner(c), w); };
    const cat = String(meta.cat ?? '').slice(0, 3);
    if (L.win2) { const back = makeWin(L.win2, 0);      // the cascade's back window: a list of three faint rows (one picture per shot)
      [0, 1, 2].forEach(k => { const r = div(`left:30px;top:${40 + k * 92}px;width:${L.win2[2] - 120 - k * 60}px;height:26px;border-radius:13px;background:rgba(255,255,255,${.16 - k * .04})`, back); }); }
    const stage = L.win ? makeWin(L.win, L.win2 ? 1 : 0) : box([0, 0, 1, 1]);
    const stages = L.wins ? L.wins.map((c, k) => makeWin(c, k, false)) : null;
    /* final 2026-11-18 point 4 (Friend: "ฉากไหนที่มี background และ motion graphic แต่ไม่มีหน้าผม motion graphic ต้องอยู่กึ่งกลาง" ·
       "ข. แต่ระวังอย่าให้การ์ดกับซับไตเติ้ลติดกันมากเกินไป"): on a screen without the face the picture's end drawing sits in the middle
       of its window (glow/bridge.js glowFit with a room: the view widens evenly round what is drawn, instead of round the motion, which
       left the drawing at the window's bottom); its motion may use the window's own padding · then (Friend: "ที่ผมต้องการคือให้การ์ดไปอยู่
       ตรงกลางของจอเลยและเอา subtitle ขึ้นไปอีกเว้นระยะห่างระหว่างการ์ดเท่าเดิม"): the window (recap: its four) in the middle of the
       screen (centre y 960), the words 90 px over it (the key word's row ends 65 px under its centre); the cascade keeps its two windows */
    const room = L.screen && !L.frame ? {l: 22, t: 8, r: 22, b: 22} : null;
    return {root, stage, stages, cam: root, L, name, cat, dark: !!L.screen, room};
  },
  /* between pictures: the words at the chest, moved below the chin when the face is low */
  speakerFrame(a, b) {
    const root = div('', SC); root.className = 'w-root';
    return {root, cam: root, speaker: true, L: winFit('talk', cpFaceBox(a, b)) ?? WIN.layouts.talk, name: 'talk'};
  },
  /* the lead fades in out of a blur; the hollow key word pops in on its word */
  text(F, T, lead, key) {
    const L = F.L ?? WIN.layouts.talk, el = div('', F.root ?? SC); el.className = 'w-text' + (F.speaker || L.speaker ? ' w-vid' : '');
    if (lead && L.lead) { const r = cpLine(el, lead, 'w-lead', L.lead, undefined, 'w-row'); A(r, [{opacity: 0, filter: 'blur(8px)'}, {opacity: 1, filter: 'blur(0)'}], T.t0 + .15, .35, {e: EASE.smooth}); }
    if (key && L.key) {
      const r = cpLine(el, key, 'w-key', L.key, undefined, 'w-row');
      A(r, [{opacity: 0, transform: 'scale(.82)'}, {opacity: 1, transform: 'scale(1.04)', offset: .7}, {opacity: 1, transform: 'none'}], T.hit - .05, .4, {e: EASE.soft});
      sfx('softswish', T.hit - .05, -21);
    }
    if (F.speaker && T.clip) {
      A(el, [{visibility: 'hidden'}, {visibility: 'visible'}], T.b[0] - .02, .001); A(el, [{visibility: 'visible'}, {visibility: 'hidden'}], T.end - .021, .001, {f: 'forwards'});
      return null;
    }
    return el;
  },
});
