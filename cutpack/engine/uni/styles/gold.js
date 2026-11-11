/* =====================================================================
   STYLE · gold — gold-orange on glossy black (Friend 2026-11-11: a new reference, "นี่คือ ref ของสไตล์ใหม่", then "Ok" to
   cutpack/style-rules/gold.md). Every number here comes from gold.md; the AI still writes only the category + slots.
   The 7-item form:
   1 frame    talk between scenes: the speaker full screen, the framing swaps 1.0 / 1.12 each time a scene ends (wide / close);
              a scene hard-cuts to one of two looks, in turn: A = a white page with the speaker as a rounded photo on top and a
              big black card with an orange glowing rim below (the picture in it); B = a dark full screen with soft orange
              light, the picture big in the middle. Long pictures (B04 B09 B17) always get A.
   2 surface  glossy black cards (top-down shine, thin light edge); only the main card glows orange
   3 drawing  everything sits on dark: white lines, silver solids, ONE gold-orange accent, red only for "no";
              icon tiles are dark with an orange edge, a tick is silver
   4 colours  black · gold-orange · silver · white (and the white page of A)
   5 words    every word: a small white lead + a big key word in a gold gradient with an orange glow, blurred in on the word
   6 motion   soft: things come in out of a little blur, settle without a bounce
   7 sound    whoosh on the cut, a soft swish on the key word, a pop on the hit
   ===================================================================== */
const GOLD = Object.freeze({
  faceY: 760,                                     // the test clip's face (a real clip reads faces.json)
  srcH: 960,                                      // the photo of A shows about this much of the clip's height (head to chest)
  zoom: 1.12,                                     // the close framing of talk between scenes
  A: {photo: {x: 300, y: 120, w: 480, h: 480, r: 64}, sub: {x: 70, y: 630, w: 860, h: 150}, card: {x: 64, y: 800, w: 872, h: 760, r: 56}, picS: .82},
  B: {pic: {x: 40, y: 470}, sub: {x: 70, y: 1240, w: 860, h: 0}},
  chest: 1230,                                    // the subtitle on the speaker when there is no faces.json (test clip)
  alwaysA: ['B04', 'B09', 'B17'],
  ease: 'cubic-bezier(.2,.8,.2,1)',
});
const GOLD_GRAD = 'linear-gradient(180deg,#FFE09A 0%,#FFB04A 45%,#FF8A1F 100%)';
STYLE('gold', {
  name: 'ทองส้มบนการ์ดดำ',
  css: `
.gd{--ink:#F2F2F4;--lw:6;--ico-w:2;--tile-r:.28;--box-r:.3;--sd:#E6E6E9;--sd-line:#E6E6E9;--lw-sd:0;
  --fl:#26262B;--fl-line:rgba(255,255,255,.4);--lw-fl:3;--fl-edge:#FFB04A;--ac:#FF9A2E;--ac-line:#FF9A2E;--lw-ac:0;--ac-stroke:#FFB04A;
  --tr:rgba(255,255,255,.12);--neg:#FF5A4E;--slot-line:rgba(255,176,74,.6);--lw-slot:4;--text:#FFFFFF;--num:#FFB04A;--num-font:"Anu";--chip-font:"Anu";
  --halo:rgba(255,140,40,.30);--lw-cross:10;--knob:#FFFFFF;--cursor:#FFFFFF;--cursor-line:#111114;--col:#E6E6E9;--lw-star:3;--spot:#FFB04A;--paper-shadow:0 18px 30px rgba(0,0,0,.5)}
.gd-main{background:linear-gradient(180deg,#2B2B30 0%,#111114 45%,#060608 100%);border:2px solid rgba(255,150,60,.85);
  box-shadow:0 0 36px rgba(255,120,30,.45),inset 0 1px 0 rgba(255,255,255,.22)}
.gd-cut{opacity:0}
.gd-dark{background:#07070A;overflow:hidden}
.gd-glow{position:absolute;border-radius:50%;filter:blur(30px)}
.gd .u-panel{border-radius:36px;background:linear-gradient(180deg,#2B2B30 0%,#111114 45%,#060608 100%);border:1.5px solid rgba(255,255,255,.14);box-shadow:0 20px 50px rgba(0,0,0,.55)}
.gd .u-badge{box-shadow:0 10px 26px rgba(0,0,0,.45)}
.gd .u-main{background:#1E1E22;color:#FFB04A;border:2.5px solid #FF9A2E}
.gd .u-acc{background:linear-gradient(180deg,#FFD27A,#FF8A1F);color:#1A0E00;box-shadow:0 0 30px rgba(255,140,40,.55)}
.gd .u-ok{background:#E6E6E9;color:#111114}
.gd .u-neg{background:#FF5A4E;color:#FFFFFF}
.gd .u-soft{background:#17171A;color:#5E5E66;border:1.5px solid rgba(255,255,255,.12);box-shadow:none}
.gd .u-track{background:rgba(255,255,255,.14)}
.gd .u-track-on{background:linear-gradient(90deg,#FFD27A,#FF8A1F)}
.gd .u-knob{background:#FFFFFF;box-shadow:0 4px 12px rgba(0,0,0,.4)}
.gd .u-knob-ico{color:#111114}
.gd .u-bar{background:rgba(255,255,255,.12)}
.gd .u-bar-on{background:linear-gradient(90deg,#FFD27A,#FF8A1F)}
.gd .u-bar-main{background:#E6E6E9}
.gd .u-box{border:5px solid #E6E6E9}
.gd .u-label{font-family:"Anu";font-weight:600;color:#FFFFFF}
.gd .u-acc .u-label,.gd .u-acc .u-bubble-text{color:#1A0E00}      /* words on a gold thing are dark like its icon (white on gold read 1.4) */
.gd .u-num{font-weight:700;letter-spacing:-1px;text-shadow:0 0 30px rgba(255,140,40,.5)}
.gd .u-chip{font-weight:600;color:#FFFFFF;background:linear-gradient(180deg,#2E2E33,#0E0E11);border:1.5px solid rgba(255,255,255,.18)}
.gd .u-chip.u-acc{color:#1A0E00;background:linear-gradient(180deg,#FFD27A,#FF8A1F);border:0}
.gd .u-btn-text{font-family:"Anu";font-weight:600}
.gd .u-col-acc{background:linear-gradient(180deg,#FFD27A,#FF8A1F)}
.gd .u-dotc{stroke:none}
.gd-shade{position:absolute;opacity:0}
.gd-sub{position:absolute;display:flex;flex-direction:column;row-gap:6px}
.gd-sub>div{position:relative;white-space:nowrap;display:flex;justify-content:center}
.gd-l{font-family:"Anu";font-weight:600;font-size:46px;line-height:1.25;color:#FFFFFF;text-shadow:0 2px 12px rgba(0,0,0,.55)}
.gd-k{font-family:"Anu";font-weight:700;font-size:104px;line-height:1.12;letter-spacing:-1px;background:${GOLD_GRAD};-webkit-background-clip:text;background-clip:text;color:transparent}
.gd-onwhite .gd-l{color:#1C1C1E;text-shadow:none}
`,
  motion: {
    pop:   {kf: [{opacity: 0, transform: 'scale(.9)', filter: 'blur(8px)'}, {opacity: 1, transform: 'none', filter: 'blur(0)'}], d: .4, e: GOLD.ease},
    rise:  {kf: [{opacity: 0, transform: 'translateY(50px)', filter: 'blur(10px)'}, {opacity: 1, transform: 'none', filter: 'blur(0)'}], d: .5, e: GOLD.ease},
    drop:  {kf: [{opacity: 0, transform: 'translateY(-50px)', filter: 'blur(8px)'}, {opacity: 1, transform: 'none', filter: 'blur(0)'}], d: .45, e: GOLD.ease},
    lead:  {kf: [{opacity: 0, transform: 'translateY(10px)'}, {opacity: 1, transform: 'none'}], d: .25, e: GOLD.ease},
    chip:  {kf: [{opacity: 0, transform: 'translateY(10px)'}, {opacity: 1, transform: 'none'}], d: .3, e: GOLD.ease},
    key:   {kf: [{opacity: 0, transform: 'scale(1.08)', filter: 'blur(12px)'}, {opacity: 1, transform: 'none', filter: 'blur(0)'}], d: .3, e: GOLD.ease},
    leave: {kf: [{opacity: 1, filter: 'blur(0)'}, {opacity: 0, filter: 'blur(8px)'}], d: .25, e: GOLD.ease},
    punch: {kf: [{transform: 'scale(1)'}, {transform: 'scale(1.06)', offset: .4}, {transform: 'scale(1)'}], d: .35, e: 'ease-in-out'},
    shake: {kf: [0, -8, 8, -8, 8, -8, 0].map(x => ({transform: `translateX(${x}px)`})), d: .45, e: 'ease-in-out'},
    move:  {d: .5, e: GOLD.ease},
    tilt:  {d: .6, e: GOLD.ease},
    snap:  {d: .45, e: GOLD.ease},
    swap:  {d: .25, e: GOLD.ease},
    draw:  {d: .6, e: 'cubic-bezier(.65,0,.35,1)'},
    stroke: {d: .2},
    stagger: .1,
    fall:  {d: 1.0},
    float: {a: 4, p: 3},
    glow:  {kf: [{opacity: 0}, {opacity: 1}], d: .5, e: GOLD.ease},
  },
  sound: {hit: ['pop', -24], ok: ['pop', -24]},

  setup() {
    BGL.style.background = '#FFFFFF';                // the page of look A (the video covers it everywhere else)
    const sh = div('', BGL); sh.className = 'gd-shade';
    this.wins = [];
    if (typeof CAPTIONS !== 'undefined') FITS.unshift(() => CAPTIONS.forEach(c => this.caption(c)));   // a real clip: every word, once every scene is known
    const P = GOLD.A.photo;
    HOOKS.push(t => {
      const w = this.wins.find(x => t >= x.t0 && t < x.t1);
      sh.style.opacity = 0;
      if (w && w.look === 'A') {                    // the speaker is the rounded photo on the white page, the face in its middle
        const s = Math.max(P.w / 1080, P.h / GOLD.srcH), hw = P.w / 2 / s, hh = P.h / 2 / s;
        V.style.transform = `translate(${P.x + P.w / 2 - w.fx * s}px,${P.y + P.h / 2 - w.fy * s}px) scale(${s})`;
        V.style.clipPath = `inset(${w.fy - hh}px ${1080 - w.fx - hw}px ${1920 - w.fy - hh}px ${w.fx - hw}px round ${P.r / s}px)`;
        Object.assign(sh.style, {left: P.x + 'px', top: P.y + 'px', width: P.w + 'px', height: P.h + 'px', borderRadius: P.r + 'px', boxShadow: '0 24px 60px rgba(0,0,0,.18)', opacity: 1});
        return;
      }
      V.style.clipPath = 'none';
      if (w) { V.style.transform = 'none'; return; }           // look B covers the speaker
      /* talk between scenes: wide before the first scene, then close / wide in turn after each scene (gold.md 6) */
      const k = this.wins.filter(x => x.t1 <= t).length, z = k % 2 ? GOLD.zoom : 1;
      if (z === 1) { V.style.transform = 'none'; return; }
      const [fx, fy] = this.face(t);
      V.style.transform = `translate(${fx * (1 - z)}px,${fy * (1 - z)}px) scale(${z})`;
    });
  },
  /* where the face is around time t (faces.json of a real clip), kept so the zoomed clip never shows past its edge */
  face(t0, t1 = t0 + .5) {
    let fx = 540, fy = GOLD.faceY;
    if (typeof FACES !== 'undefined') {
      let tr = FACES.track.filter(([t]) => t >= t0 - .25 && t <= t1 + .25).map(x => x[1]);
      if (!tr.length) tr = [FACES.track.reduce((a, b) => Math.abs(b[0] - t0) < Math.abs(a[0] - t0) ? b : a)[1]];
      const m = i => tr.reduce((n, b) => n + b[i], 0) / tr.length;
      fx = (m(0) + m(2)) / 2; fy = (m(1) + m(3)) / 2 - .1 * (m(3) - m(1));
    }
    return [fx, fy];
  },
  /* the subtitle's top on the speaker: under the chin even in the close framing (gold.md 5) */
  chest() {
    if (typeof FACES === 'undefined') return GOLD.chest;
    const k = FACES.keepOut, fy = (k[1] + k[3]) / 2;
    return Math.max(FACES.layout?.subtitleTop ?? 0, Math.round(fy + (k[3] - fy) * GOLD.zoom / 1.095 + 40));
  },
  frame(t0, t1, {index, scene}) {
    const meta = SCENES[scene]?.meta ?? {}, look = GOLD.alwaysA.includes(meta.cat) || index % 2 === 0 ? 'A' : 'B';
    let [fx, fy] = this.face(t0, t1);
    const P = GOLD.A.photo, s = Math.max(P.w / 1080, P.h / GOLD.srcH), hw = P.w / 2 / s, hh = P.h / 2 / s;
    fx = Math.min(1080 - hw, Math.max(hw, fx)); fy = Math.min(1920 - hh, Math.max(hh, fy));
    this.wins.push({t0, t1, look, fx, fy});
    const root = div('inset:0', SC); root.className = 'gd gd-cut';
    A(root, [{opacity: 1}, {opacity: 1}], t0, t1 - t0, {f: 'none'});          // hard cut in and out
    sfx('whoosh', t0, -24);
    let stage;
    if (look === 'A') {
      const C = GOLD.A.card, card = div(`left:${C.x}px;top:${C.y}px;width:${C.w}px;height:${C.h}px;border-radius:${C.r}px`, root);
      card.className = 'gd-main';
      const sw = 1000 * GOLD.A.picS, shh = 700 * GOLD.A.picS;
      stage = div(`left:${(C.w - sw) / 2}px;top:${(C.h - shh) / 2}px;width:1000px;height:700px;transform-origin:0 0;transform:scale(${GOLD.A.picS})`, card);
    } else {
      root.classList.add('gd-dark');
      const g1 = div('left:-600px;top:700px;width:900px;height:900px;background:radial-gradient(circle,rgba(255,128,30,.28),transparent 65%)', root);
      const g2 = div('left:200px;top:-500px;width:800px;height:800px;background:radial-gradient(circle,rgba(255,190,90,.16),transparent 65%)', root);
      g1.className = g2.className = 'gd-glow';
      A(g1, [{transform: 'none'}, {transform: 'translate(120px,-80px)'}], t0, t1 - t0);
      A(g2, [{transform: 'none'}, {transform: 'translate(-100px,90px)'}], t0, t1 - t0);
      stage = div(`left:${GOLD.B.pic.x}px;top:${GOLD.B.pic.y}px;width:1000px;height:700px`, root);
    }
    return {root, stage, look, dark: true};
  },
  /* the words of a scene: the small lead, then the big gold key word on the word (gold.md 5) */
  text(F, T, lead, key) {
    const S = F.look === 'A' ? GOLD.A.sub : GOLD.B.sub;
    return this.words(F.root, S, F.look === 'A', [[lead, T.t0 + .15, 'l'], [key, T.hit, 'k']], T.t0, T.t1, true);
  },
  /* one block of words seen from a to b: rows of lead phrases (small) and the key phrase (big gold), each from its own time.
     A block that another one follows straight on is cut, not faded (a fade left a blank moment at every join) */
  words(parent, S, onWhite, parts, a, b, keySound) {
    const el = div(`left:${S.x}px;top:${S.y}px;width:${S.w}px;${S.h ? `height:${S.h}px;justify-content:center;` : ''}align-items:center`, parent);
    el.className = 'gd-sub' + (onWhite ? ' gd-onwhite' : '');
    A(el, [{opacity: 0}, {opacity: 1}], a - .01, .01, {f: 'both'});
    const joined = typeof CAPTIONS !== 'undefined' && CAPTIONS.some(x => Math.abs(x.t0 - b) < .05);
    if (!joined) A(el, [{opacity: 1}, {opacity: 0}], b - .2, .2, {f: 'forwards'}); else A(el, [{opacity: 1}, {opacity: 0}], b - .01, .01, {f: 'forwards'});
    const M = this.motion, rows = {}, glow = onWhite ? 'drop-shadow(0 0 10px rgba(255,130,30,.35))' : 'drop-shadow(0 0 22px rgba(255,130,30,.6))';
    parts.filter(([w]) => w).forEach(([w, t, kind]) => {
      let r = rows[kind];
      if (!r) { r = rows[kind] = document.createElement('div'); r.style.columnGap = kind === 'k' ? '22px' : '12px'; el.appendChild(r); }
      const sp = document.createElement('span'); sp.className = kind === 'k' ? 'gd-k' : 'gd-l'; sp.textContent = w; r.appendChild(sp);
      const tt = Math.max(a, t);
      if (kind === 'k') {                            // blurred in and settling, the glow stays (one animation, so nothing overwrites it)
        sp.style.filter = glow;
        A(sp, [{opacity: 0, transform: 'scale(1.08)', filter: `blur(12px) ${glow}`}, {opacity: 1, transform: 'none', filter: `blur(0px) ${glow}`}], tt, M.key.d, {e: M.key.e});
        if (keySound) sfx('softswish', tt - .04, -22);
      } else A(sp, M.lead.kf, tt, M.lead.d, {e: M.lead.e});
    });
    const fit = () => [...el.children].forEach(r => { const w = r.scrollWidth; if (w > S.w) r.style.transform = `scale(${S.w / w})`; });
    if (window.__fitted) fit(); else FITS.push(fit);
    return el;
  },
  /* every word of a real clip (CAPTIONS = [{t0, t1, parts: [[words, time said], …]}]): the last part is the key word, the ones
     before it the lead; on the speaker at chest height, or in the scene's place (A: on white, B: on dark) */
  caption(c) {
    const w = this.wins.find(x => c.t0 < x.t1 && c.t1 > x.t0);
    let a = c.t0, b = c.t1;
    if (w) { a = Math.max(a, w.t0); b = Math.min(b, w.t1); }
    else this.wins.forEach(x => { if (x.t1 > a && x.t1 <= b && x.t0 < a) a = x.t1; if (x.t0 < b && x.t0 >= a) b = Math.min(b, x.t0); });
    if (b - a < .15) return;
    const S = w ? (w.look === 'A' ? GOLD.A.sub : GOLD.B.sub) : {x: 70, y: this.chest(), w: 860, h: 0};
    const n = c.parts.length, parts = c.parts.map(([txt, t], i) => [txt, t, i === n - 1 ? 'k' : 'l']);
    const el = this.words(SC, S, w?.look === 'A', parts, a, b, false);
    if (w) el.style.zIndex = 2;                    // above the scene's look (it is drawn after it anyway)
  },
});
