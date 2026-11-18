/* =====================================================================
   STYLE · window — "หน้าต่างแอป" (App Window) (Friend 2026-11-18, the 3rd of the new sheets: "สไตล์ต่อไปครับ")
   Every place and size is measured on Friend's sheet (12 shots, 1080 × 1920), then held to the rules every style shares
   (styles/common.js: safe zone, frames below the search bar, centred words, the video filling its frame, seeded random, never over
   the face). The pictures: the glow-line template set first, in the glass look with blue light (glow/bridge.js GLASSY.window).
   The 7-item form:
   1 frame    one of 12 layouts (WIN.layouts, named after Friend's shots): the speaker full screen with an app window at the hands,
              or a deep-blue screen with a big window, the speaker in a rounded frame beside a window, two windows in cascade, a recap
              of four. Between pictures the speaker talks with the words at the chest. A chapter bar sits top left on every shot.
   2 surface  screens: near-black to navy, two blue arcs each carrying two big glowing white diamonds (Friend's background picture,
              2026-11-18); the pictures sit in dark app windows (three dots, a title, a blue tag)
   3 drawing  the glow-line pictures: white lines, the lit part a blue outline (no solid fill), blue light
   4 colours  deep blue · near-black windows · white · one blue (#2F6FEB)
   5 words    a white lead (Kanit 500) + the key word white in a blue pill (Kanit 800); on screens a small spaced label above
              (STEP 3 · STEPS)
   6 motion   windows rise in out of a blur, screens fade in, the pill pops on its word
   7 sound    whoosh on a screen cut, a soft swish on the key word
   The words the sheet invents (window titles "เป้าหมายปีนี้", tags "STEP 1/3", chapter names "ตั้งเป้า · อ่าน · สรุป") come from the
   code, so the AI's job does not grow: a window's title = its category's short name, its tag = the picture's number, the chapter bar
   = the categories of the first picture in each third of the clip (Friend 2026-11-18: "AI จะได้คิดน้อยๆที่สุด").
   ===================================================================== */
const WIN = {
  /* boxes [x, y, w, h] · words {x, y (centre), maxW, half (half the row's height, for the right edge)}. nav = which chapter the
     sheet underlines (stills); a real clip underlines by time. Moved where the sheet ran under TikTok's name / buttons / tabs. */
  layouts: {
    talk:     {speaker: true, lead: {x: 540, y: 1062}, key: {x: 540, y: 1175}},                                                  // shot 01 without its window
    full:     {speaker: true, lead: {x: 540, y: 1062}, key: {x: 540, y: 1175}, win: [80, 1300, 840, 360], nav: 0},              // shot 01 (sheet to y 1682)
    full_n:   {speaker: true, lead: {x: 540, y: 1117}, key: {x: 540, y: 1226}, win: [210, 1340, 670, 320], nav: 0},             // shot 02 (narrow window)
    dark:     {screen: true, label: {x: 540, y: 460}, lead: {x: 540, y: 668}, key: {x: 540, y: 777}, win: [80, 1000, 840, 630], nav: 1, decor: 0},   // shot 03
    float:    {screen: true, frame: [62, 258, 470, 740, 30], lead: {x: 770, y: 610, maxW: 470}, key: {x: 770, y: 700, maxW: 470, half: 50},
               win: [300, 1070, 620, 560], nav: 1, decor: 0},                                                                    // shot 04
    full_w:   {speaker: true, lead: {x: 540, y: 1040}, key: {x: 540, y: 1183}, win: [170, 1300, 740, 360], nav: 1},             // shot 05
    cascade:  {screen: true, win2: [300, 270, 690, 460], lead: {x: 330, y: 887}, key: {x: 330, y: 1023}, win: [60, 1170, 720, 470], nav: 1, decor: 1},   // shot 06
    full_d:   {speaker: true, lead: {x: 540, y: 1051}, key: {x: 540, y: 1161}, win: [80, 1300, 840, 360], nav: 1},             // shot 07
    stats:    {screen: true, frame: [560, 250, 360, 690, 30], lead: {x: 290, y: 653, maxW: 440}, key: {x: 290, y: 756, maxW: 440, half: 50},
               win: [80, 1070, 840, 560], nav: 2, decor: 1},                                                                     // shot 08 (sheet frame to x 1019)
    full_c:   {speaker: true, lead: {x: 540, y: 1073}, key: {x: 540, y: 1172}, win: [80, 1300, 840, 360], nav: 2},             // shot 09
    dark_b:   {screen: true, label: {x: 540, y: 460}, lead: {x: 540, y: 672}, key: {x: 540, y: 777}, win: [80, 1000, 840, 630], nav: 2, decor: 1},   // shot 10
    recap:    {screen: true, label: {x: 540, y: 289}, lead: {x: 540, y: 493}, key: {x: 540, y: 596},
               wins: [[80, 770, 400, 420], [500, 770, 420, 420], [80, 1230, 400, 420], [500, 1230, 420, 420]], decor: 0},     // shot 11
    cta:      {speaker: true, lead: {x: 540, y: 1066}, key: {x: 540, y: 1172}, win: [80, 1300, 840, 360], nav: 2},             // shot 12
  },
  pool: ['full', 'full_n', 'dark', 'float', 'full_w', 'cascade', 'full_d', 'stats', 'full_c', 'dark_b'],
  byCat: {B15: 'cta', B14: 'dark'},
  used: {}, last: null,
  /* the code's own words (no AI): a window's title per category, the small spaced label of a screen */
  title: {B01: 'ตัวเลข', B02: 'เพิ่ม / ลด', B03: 'เปรียบเทียบ', B04: 'ขั้นตอน', B05: 'ถูก / ผิด', B06: 'คำถาม', B07: 'ข้อควรระวัง', B08: 'เป้าหมาย',
    B09: 'ไทม์ไลน์', B10: 'กลุ่มคน', B11: 'ข้อความ', B12: 'เหตุและผล', B13: 'เคล็ดลับ', B14: 'จำไว้', B15: 'ชวนทำต่อ', B16: 'ความหมาย',
    B17: 'รายการ', B18: 'เรื่องเล่า', B19: 'ความรู้สึก', B20: 'ความสัมพันธ์', B21: 'สถานที่'},
  en: {B01: 'NUMBER', B02: 'CHANGE', B03: 'COMPARE', B04: 'STEPS', B05: 'RIGHT WAY', B06: 'QUESTION', B07: 'WARNING', B08: 'GOAL',
    B09: 'TIMELINE', B10: 'PEOPLE', B11: 'MESSAGE', B12: 'CAUSE', B13: 'TIP', B14: 'REMEMBER', B15: 'YOUR TURN', B16: 'MEANING',
    B17: 'LIST', B18: 'STORY', B19: 'FEELING', B20: 'TOGETHER', B21: 'PLACE'},
  /* the screens' background (Friend 2026-11-18, a picture of it: "ผมอยากได้ background แบบนี้"), measured on that picture (1080 × 1920):
     near-black at the top to deep navy at the bottom, two thin blue arcs, each with two big white glowing diamonds sitting ON it.
     Each arc [cx, cy, r, [angles of its diamonds, degrees]]; 0 = the picture as sent, 1 = the same mirrored (for screens whose frame
     or back window covers the top right; its lower diamonds sit further along their arc, out of TikTok's buttons column). The arcs
     turn very slowly, so the diamonds slide along them (the lower arc turns back, away from the buttons). */
  decor: [
    [[966, 129, 368, [176.2, 89.5]], [82, 1736, 349, [-93.8, 5.8]]],
    [[114, 129, 368, [3.8, 90.5]], [998, 1736, 349, [238, 184]]],      // (its lower diamonds moved along the arc, left of the buttons: x 920)
  ],
};
const winInner = ([, , w, h]) => [22, 76, w - 44, h - 98];        // the picture inside a window (under its 64-high title bar)

/* fit a speaker screen to this face [x0, top, x1, chin] (as lime): the words and the window under the face slide below the chin
   (the window shortens to keep its bottom at 1660, at least 260 high); null = no room. Screens always fit. */
function winFit(name, f) {
  const L0 = WIN.layouts[name]; if (L0.screen) return L0;
  const [, , , chin] = f, L = JSON.parse(JSON.stringify(L0));
  const tops = [L.lead.y - 45, L.key.y - 55].concat(L.win ? [L.win[1]] : []), d = Math.max(0, chin + 30 - Math.min(...tops));
  L.lead.y += d; L.key.y += d;
  if (L.win) { L.win[1] += d; L.win[3] = Math.min(L.win[3], 1660 - L.win[1]); if (L.win[3] < 260) return null; }
  if (L.key.y + 55 > 1660) return null;
  return L;
}
/* the chapter bar (top left, every shot): three names, the current one underlined. Below TikTok's tabs (the sheet had it at y 153,
   under "Following | For You"). Real clip: the names are the categories of the first picture in each third, underlined by time;
   a still: Friend's sheet's words and the layout's nav. */
function winNav(names, at) {
  const bar = div('left:80px;top:236px', TX); bar.className = 'w-nav cp-row';
  const els = names.map((n, k) => { if (k) { const s = div('', bar, '·'); s.className = 'w-sep'; s.style.position = 'relative'; }
    const e = div('', bar, n); e.className = 'w-ch'; e.style.position = 'relative'; return e; });
  return {bar, els};
}

STYLE('window', {
  name: 'หน้าต่างแอป',
  layouts: WIN.layouts,
  css: `
@font-face{font-family:"WinKey";src:url(fonts/Kanit-800-thai.woff);font-weight:800;unicode-range:U+02D7,U+0303,U+0331,U+0E01-0E5B,U+200C-200D,U+25CC}
@font-face{font-family:"WinKey";src:url(fonts/Kanit-800-latin.woff);font-weight:800;unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+2000-206F}
@font-face{font-family:"WinLead";src:url(fonts/Kanit-500-thai.woff);font-weight:500;unicode-range:U+02D7,U+0303,U+0331,U+0E01-0E5B,U+200C-200D,U+25CC}
@font-face{font-family:"WinLead";src:url(fonts/Kanit-500-latin.woff);font-weight:500;unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+2000-206F}
.w-root{position:absolute;inset:0;--ink:#F2F6FC;--ac:#5B9BFF;--lw:5;--sd:#F2F6FC;--fl:rgba(14,18,28,.88);--text:#F2F6FC}
.w-screen{background:linear-gradient(180deg,#000206 0%,#010c1a 7%,#021022 19%,#03152d 31%,#041b3b 44%,#041f45 56%,#04224b 69%,#05244d 81%,#05224a 100%);overflow:hidden}
.w-arc{position:absolute}
.w-ring{position:absolute;inset:0;border-radius:50%;border:4px solid #4F86C4;box-shadow:0 0 6px rgba(79,134,196,.55),inset 0 0 6px rgba(79,134,196,.45)}
.w-dia{position:absolute;width:68px;height:68px;rotate:45deg;background:#fff;border-radius:4px;box-shadow:0 0 8px rgba(255,255,255,.95),0 0 24px rgba(215,232,255,.55)}
.w-win{position:absolute;border-radius:26px;background:rgba(13,17,27,.9);border:1.5px solid rgba(255,255,255,.14);
  box-shadow:0 22px 50px rgba(0,0,0,.5),inset 0 1px 0 rgba(255,255,255,.06);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);overflow:hidden}
.w-bar{position:absolute;left:0;right:0;top:0;height:64px;border-bottom:1px solid rgba(255,255,255,.06)}
.w-dot{position:absolute;top:25px;width:14px;height:14px;border-radius:50%}
.w-title{position:absolute;left:104px;top:13px;font-family:"Anu";font-weight:600;font-size:28px;line-height:38px;color:#E6EDF8;white-space:nowrap}
.w-tag{position:absolute;right:22px;top:17px;font-family:"WinLead";font-weight:500;font-size:20px;line-height:30px;letter-spacing:1px;color:#7FB0FF;background:rgba(60,120,255,.18);border-radius:9px;padding:0 12px}
.w-frame{position:absolute;overflow:hidden;border:2px solid rgba(130,180,255,.65);box-shadow:0 0 18px rgba(80,140,255,.35)}
.w-text{position:absolute;inset:0}
.w-row{position:absolute;white-space:nowrap}
.w-lead{font-family:"WinLead";font-weight:500;font-size:80px;line-height:1.2;color:#F4F7FC;text-shadow:0 0 3px rgba(0,0,0,.85),0 0 10px rgba(0,0,0,.6),0 3px 18px rgba(0,0,0,.5)}
.w-key{display:inline-block;font-family:"WinKey";font-weight:800;font-size:96px;line-height:1.16;color:#fff;background:#2F6FEB;border-radius:24px;padding:0 32px 8px;
  box-shadow:0 0 0 1.5px rgba(150,190,255,.35),0 0 26px rgba(47,111,235,.6),0 8px 22px rgba(0,0,0,.35)}
.w-label{font-family:"WinLead";font-weight:500;font-size:22px;letter-spacing:5px;color:#6FA8FF}
.w-nav{position:absolute;display:flex;gap:16px;align-items:center;font-family:"Anu";font-weight:500;font-size:32px;color:rgba(235,242,252,.82);text-shadow:0 0 6px rgba(0,0,0,.7)}
.w-ch{position:relative;padding-bottom:10px}
.w-ch.on{color:#fff}
.w-ch.on::after{content:"";position:absolute;left:0;right:0;bottom:0;height:3px;border-radius:2px;background:#5B9BFF;box-shadow:0 0 8px rgba(91,155,255,.8)}
.w-sep{opacity:.6}
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
    /* the chapter bar, once the clip is built: a real clip (CAPTIONS) by thirds; a still: the sheet's names, the layout's nav */
    FITS.push(() => {
      const wins = CLIPWINS.filter(x => x.F?.L && !x.F.speaker), real = typeof CAPTIONS !== 'undefined' && CAPTIONS.length;
      if (!real) { const L = wins[0]?.F.L; if (!L || L.nav == null) return; const {els} = winNav(['ตั้งเป้า', 'อ่าน', 'สรุป']); els[L.nav].classList.add('on'); return; }
      const end = CAPTIONS[CAPTIONS.length - 1].t1, third = k => wins.find(x => x.t0 >= end * k / 3 && x.t0 < end * (k + 1) / 3);
      const names = [0, 1, 2].map(k => WIN.title[third(k)?.F.cat] ?? null);
      if (names.some(n => !n) || new Set(names).size < 3) return;   // fewer than three different chapters: no bar
      const {bar, els} = winNav(names);
      els.forEach((e, k) => { const u = div('', e); u.className = 'w-ch on'; Object.assign(u.style, {position: 'absolute', inset: '0', color: 'transparent'}); u.textContent = names[k];
        A(u, [{opacity: 0}, {opacity: 1}], end * k / 3, .2); if (k < 2) A(u, [{opacity: 1}, {opacity: 0}], end * (k + 1) / 3, .2, {f: 'forwards'}); });
      A(bar, [{opacity: 0}, {opacity: 1}], .1, .4, {e: EASE.smooth});
    });
  },

  frame(t0, t1, {index, scene}) {
    const meta = SCENES[scene]?.meta ?? {}, face = cpFaceBox(t0, t1);
    let name = meta.layout;
    if (!name) {
      const want = WIN.byCat[String(meta.cat ?? '').slice(0, 3)];
      if (want && winFit(want, face)) name = want;
      else {
        let pool = WIN.pool.filter(n => n !== WIN.last && winFit(n, face));
        if (!pool.length) pool = ['dark', 'float', 'cascade'].filter(n => n !== WIN.last);
        const ar = typeof GLOW_SHAPES !== 'undefined' && meta.variant ? GLOW_SHAPES[meta.variant] : null;
        if (ar) {
          const size = n => { const [, , w, h] = winInner(winFit(n, face).win); return ar > w / h ? w * w / ar : h * h * ar; };
          const best = Math.max(...pool.map(size)); pool = pool.filter(n => size(n) >= .75 * best);
        }
        const least = Math.min(...pool.map(n => WIN.used[n] ?? 0)); pool = pool.filter(n => (WIN.used[n] ?? 0) === least);
        name = pool[Math.floor(cpRand('screen' + index) * pool.length)];
      }
    }
    WIN.used[name] = (WIN.used[name] ?? 0) + 1; WIN.last = name;
    const L = (meta.layout ? WIN.layouts[name] : winFit(name, face)) ?? WIN.layouts.dark;
    const root = div('', SC); root.className = 'w-root' + (L.screen ? ' w-screen' : '');
    const box = ([x, y, w, h], parent = root) => div(`left:${x}px;top:${y}px;width:${w}px;height:${h}px`, parent);
    if (L.screen) {
      const D = WIN.decor[L.decor ?? 0], long = Math.max(1, t1 - t0);
      D.forEach(([cx, cy, r, angs], j) => {
        const g = box([cx - r, cy - r, 2 * r, 2 * r]); g.className = 'w-arc'; div('', g).className = 'w-ring';
        const spin = (j ? -1 : 1) * 1.5 * long;              // 1.5 degrees a second: the diamonds slide ~10 px a second along the arc
        A(g, [{transform: 'rotate(0deg)'}, {transform: `rotate(${spin}deg)`}], t0 - .05, long + .4);
        angs.forEach((ang, k) => { const q = ang * Math.PI / 180, d = div(`left:${r + (r - 2) * Math.cos(q) - 34}px;top:${r + (r - 2) * Math.sin(q) - 34}px`, g);
          d.className = 'w-dia';
          A(d, [{transform: 'rotate(0deg)'}, {transform: `rotate(${-spin}deg)`}], t0 - .05, long + .4);    // stays a diamond while its arc turns
          A(d, [{opacity: 1}, {opacity: .62}, {opacity: 1}], t0 + (2 * j + k) * .55, 2.6, {e: 'ease-in-out', it: 4}); });   // the picture: two lit, two dimmer
      });
      A(root, [{opacity: 0, filter: 'blur(14px)', transform: 'scale(1.03)'}, {opacity: 1, filter: 'blur(0)', transform: 'none'}], t0 - .04, .35, {e: EASE.smooth});
      sfx('whoosh', t0 - .1, -20);
    }
    if (L.frame) { const [x, y, w, h, r] = L.frame, f = box([x, y, w, h]); f.className = 'w-frame cp-frame'; f.style.borderRadius = r + 'px';
      cpInset(f, w - 4, h - 4, t0, .42, .4);
      A(f, [{opacity: 0, transform: 'translateY(-30px)'}, {opacity: 1, transform: 'none'}], t0 + .05, .45, {e: EASE.soft}); }
    A(root, [{opacity: 1, filter: 'blur(0)'}, {opacity: 0, filter: 'blur(10px)'}], t1 - .3, .3, {e: EASE.out, f: 'forwards'});
    /* the windows: three dots, the category's title, the picture's number as the tag; each picture lives inside its window */
    const num = String((index ?? 0) + 1).padStart(2, '0');
    const makeWin = (c, k, title, tag) => { const w = box(c); w.className = 'w-win';
      const bar = div('', w); bar.className = 'w-bar';
      ['#FF5F57', '#FEBC2E', '#28C840'].forEach((col, i) => { const d = div(`left:${26 + i * 24}px;background:${col}`, bar); d.className = 'w-dot'; });
      div('', bar, title).className = 'w-title'; if (tag) div('', bar, tag).className = 'w-tag';
      A(w, [{opacity: 0, transform: 'translateY(40px) scale(.95)', filter: 'blur(10px)'}, {opacity: 1, transform: 'none', filter: 'blur(0)'}], t0 + .04 + .12 * k, .45, {e: EASE.soft});
      return box(winInner(c), w); };
    const cat = String(meta.cat ?? '').slice(0, 3), title = WIN.title[cat] ?? 'โน้ต';
    if (L.win2) { const back = makeWin(L.win2, 0, 'ถัดไป', 'NEXT');      // the cascade's back window: a list of three faint rows (one picture per shot)
      [0, 1, 2].forEach(k => { const r = div(`left:30px;top:${40 + k * 92}px;width:${L.win2[2] - 120 - k * 60}px;height:26px;border-radius:13px;background:rgba(255,255,255,${.16 - k * .04})`, back); }); }
    const stage = L.win ? makeWin(L.win, L.win2 ? 1 : 0, title, `STEP ${num}`) : box([0, 0, 1, 1]);
    const stages = L.wins ? L.wins.map((c, k) => makeWin(c, k, ['ตั้งเป้า', 'วันละ 10 หน้า', 'ก่อนนอน', 'จดสั้น ๆ'][k] ?? '', null)) : null;
    if (L.label) { const lab = cpLine(div('', root), L.wins ? 'RECAP' : `STEP ${num} · ${WIN.en[cat] ?? 'NOTE'}`, 'w-label', L.label, undefined, 'w-row');
      A(lab, [{opacity: 0}, {opacity: 1}], t0 + .1, .4, {e: EASE.smooth}); }
    return {root, stage, stages, cam: root, L, name, cat, dark: !!L.screen};
  },
  /* between pictures: the words at the chest, moved below the chin when the face is low */
  speakerFrame(a, b) {
    const root = div('', SC); root.className = 'w-root';
    return {root, cam: root, speaker: true, L: winFit('talk', cpFaceBox(a, b)) ?? WIN.layouts.talk, name: 'talk'};
  },
  /* the lead fades in out of a blur; the key word pops in its blue pill on its word */
  text(F, T, lead, key) {
    const L = F.L ?? WIN.layouts.talk, el = div('', F.root ?? SC); el.className = 'w-text';
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
