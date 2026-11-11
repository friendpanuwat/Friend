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
  /* transitions, from the reference frame by frame (Friend 2026-11-11: "เขาไม่ได้ตัดไปเฉยๆ การย่อการขยายของรูป มันมีทรานซิชั่นของมัน"):
     A in: the full-screen video shrinks into the photo (.3 s) while the black card slides up from below the screen (.5 s);
     A out: the card slides back down while the photo grows back to full screen (.3 s);
     B in: the scene comes in out of a blur, a little big (1.08 → 1, .45 s), then pushes in slowly (1 → 1.04); B out: a cut */
  shrinkD: .3, growD: .3, cardD: .5, cardOutD: .3, blurD: .45,
  ease: 'cubic-bezier(.2,.8,.2,1)',
});
const GOLD_GRAD = 'linear-gradient(180deg,#FFE09A 0%,#FFB04A 45%,#FF8A1F 100%)';
/* the moving grid behind a scene (Friend 2026-11-11: "ทำให้มันแตกต่างจาก ref หน่อย … พื้นหลังตารางเคลื่อนไหว เลื่อนขึ้น"):
   hand-drawn-looking lines that wave a little, drawn here (not an image). The pattern repeats every 3 rows, so sliding it up
   by 3 rows loops without a seam; every column waves its own way */
const GRID = Object.freeze({cell: 135, rows: 3, speed: 40, amp: 7, width: 3});
function goldGrid(parent, t0, t1, light) {
  const c = GRID.cell, L = c * GRID.rows, H = 1920 + L + c, n = Math.ceil(1080 / c) + 1, seed = k => (hashOf('grid' + k) % 1000) / 1000;
  let d = '';
  for (let i = 0; i <= n; i++) {                       // columns: a wave whose length is the loop (3 rows), so it joins itself
    const x0 = i * c - 20, a = GRID.amp * (.5 + seed(i)), ph = seed(i + 50) * 6.28;
    for (let y = -c; y <= H; y += 20) d += `${y === -c ? 'M' : 'L'}${(x0 + a * Math.sin(2 * Math.PI * y / L + ph)).toFixed(1)} ${y}`;
  }
  for (let j = -1; j * c <= H; j++) {                  // rows: three shapes taking turns
    const r = ((j % GRID.rows) + GRID.rows) % GRID.rows, a = GRID.amp * (.5 + seed(100 + r)), ph = seed(200 + r) * 6.28, y0 = j * c + 30;
    for (let x = -40; x <= 1120; x += 20) d += `${x === -40 ? 'M' : 'L'}${x} ${(y0 + a * Math.sin(2 * Math.PI * x / 900 + ph)).toFixed(1)}`;
  }
  const g = div(`left:0;top:0;width:1080px;height:${H}px`, parent,
    `<svg width="1080" height="${H}" style="overflow:visible"><path d="${d}" fill="none" stroke="${light ? '#A3A3A8' : 'rgba(255,255,255,.38)'}" stroke-width="${GRID.width}" stroke-linecap="round" stroke-linejoin="round"/></svg>`);
  const per = L / GRID.speed;
  A(g, [{transform: 'translateY(0)'}, {transform: `translateY(${-L}px)`}], t0, per, {it: Math.max(1, Math.ceil((t1 - t0) / per)), f: 'none'});
  return g;
}
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
.gd-dark{background:#0B0B0E;overflow:hidden}
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
.gd-onwhite .gd-k{background:linear-gradient(180deg,#FF9A2E 0%,#E56A0A 55%,#B84C00 100%);-webkit-background-clip:text;background-clip:text}   /* the light gold faded on the light grid page (rule 10) */
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
    const ease = p => 1 - Math.pow(1 - Math.min(1, Math.max(0, p)), 3);
    /* the video's framing on the full screen: zoom z around the face (talk between scenes swaps wide / close) */
    const full = (t, z) => { const [fx, fy] = this.face(t); return {s: z, tx: fx * (1 - z), ty: fy * (1 - z), l: 0, r: 0, tp: 0, bt: 0, rad: 0}; };
    const photo = w => { const s = Math.max(P.w / 1080, P.h / GOLD.srcH), hw = P.w / 2 / s, hh = P.h / 2 / s;
      return {s, tx: P.x + P.w / 2 - w.fx * s, ty: P.y + P.h / 2 - w.fy * s, l: w.fx - hw, r: 1080 - w.fx - hw, tp: w.fy - hh, bt: 1920 - w.fy - hh, rad: P.r / s}; };
    const mix = (a, b, p) => Object.fromEntries(Object.keys(a).map(k => [k, a[k] + (b[k] - a[k]) * p]));
    const zoomAt = t => this.wins.filter(x => x.t1 <= t).length % 2 ? GOLD.zoom : 1;
    HOOKS.push(t => {
      const w = this.wins.find(x => t >= x.t0 && t < x.t1);
      sh.style.opacity = 0;
      let c;
      if (w && w.look === 'A') {                    // shrink into the photo, hold, grow back (the face stays in the middle)
        const i = this.wins.indexOf(w), pv = this.wins[i - 1], nx = this.wins[i + 1], held = x => x && x.look === 'A' && Math.abs(x.t0 - w.t1) < .3 || false;
        const fromA = pv && pv.look === 'A' && w.t0 - pv.t1 < .3, toA = held(nx);       // A right after A: the photo stays put
        const pin = fromA ? 1 : ease((t - w.t0) / GOLD.shrinkD), pout = toA ? 0 : ease((t - (w.t1 - GOLD.growD)) / GOLD.growD);
        c = mix(full(w.t0, zoomAt(w.t0)), photo(w), pin);
        if (pout > 0) c = mix(c, full(w.t1, zoomAt(w.t1 + .01)), pout);
        const rad = c.rad;
        Object.assign(sh.style, {left: c.tx + c.s * c.l + 'px', top: c.ty + c.s * c.tp + 'px', width: c.s * (1080 - c.l - c.r) + 'px', height: c.s * (1920 - c.tp - c.bt) + 'px',
          borderRadius: rad * c.s + 'px', boxShadow: '0 24px 60px rgba(0,0,0,.18)', opacity: Math.min(pin, 1 - pout)});
        if (fromA) c = mix(photo(pv), photo(w), ease((t - w.t0) / GOLD.shrinkD));       // the face may sit a little elsewhere in the next scene
      } else if (w) c = full(t, 1);                 // look B covers the speaker
      else c = full(t, zoomAt(t));
      V.style.transform = c.s === 1 && !c.tx && !c.ty ? 'none' : `translate(${c.tx}px,${c.ty}px) scale(${c.s})`;
      V.style.clipPath = c.l || c.r || c.tp || c.bt ? `inset(${c.tp}px ${c.r}px ${c.bt}px ${c.l}px round ${c.rad}px)` : 'none';
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
    if (look === 'A') {                              // the page: a light moving grid under the video (BG layer), seen in this scene only
      const page = div('inset:0;overflow:hidden;opacity:0;background:radial-gradient(ellipse 80% 60% at 50% 45%,#F1F1F4 0%,#DEDEE3 70%,#CFCFD5 100%)', BGL);
      A(page, [{opacity: 1}, {opacity: 1}], t0, t1 - t0, {f: 'none'});
      goldGrid(page, t0, t1, true);
      const C = GOLD.A.card, card = div(`left:${C.x}px;top:${C.y}px;width:${C.w}px;height:${C.h}px;border-radius:${C.r}px`, root);
      card.className = 'gd-main';
      const pv = this.wins.at(-2), fromA = pv && pv.look === 'A' && t0 - pv.t1 < .3;
      if (!fromA) A(card, [{transform: 'translateY(1150px)'}, {transform: 'none'}], t0 + .05, GOLD.cardD, {e: 'cubic-bezier(.16,1,.3,1)'});   // up from below the screen
      else { const k = ANIMS.indexOf(pv.cardOut); if (k >= 0) { ANIMS[k].cancel(); ANIMS.splice(k, 1); } }   // A after A: the card stays (the one before is cut, not dropped)
      /* out: the card drops away fast and fades before the photo has grown much (it is above the video, so it must not linger on the speaker) */
      this.wins.at(-1).cardOut = A(card, [{transform: 'none', opacity: 1}, {transform: 'translateY(700px)', opacity: 0}], t1 - GOLD.growD - .05, GOLD.cardOutD, {e: 'cubic-bezier(.3,0,.6,1)', f: 'forwards'});
      const sw = 1000 * GOLD.A.picS, shh = 700 * GOLD.A.picS;
      stage = div(`left:${(C.w - sw) / 2}px;top:${(C.h - shh) / 2}px;width:1000px;height:700px;transform-origin:0 0;transform:scale(${GOLD.A.picS})`, card);
    } else {
      root.classList.add('gd-dark');                 // a dark moving grid, darker at the edges, a soft orange light behind the picture
      const lens = div('inset:0', root);              // the whole scene comes into focus, then the camera pushes in slowly
      A(lens, [{filter: 'blur(16px)', transform: 'scale(1.08)'}, {filter: 'blur(0px)', transform: 'none'}], t0, GOLD.blurD, {e: GOLD.ease});
      const push = div('inset:0', lens);
      A(push, [{transform: 'none'}, {transform: 'scale(1.04)'}], t0 + GOLD.blurD, Math.max(.1, t1 - t0 - GOLD.blurD), {e: 'linear', f: 'none'});
      goldGrid(push, t0, t1, false);
      div('inset:0;background:radial-gradient(ellipse 75% 55% at 50% 45%,transparent 30%,rgba(0,0,0,.75) 100%)', push);
      const g1 = div('left:90px;top:370px;width:900px;height:900px;background:radial-gradient(circle,rgba(255,128,30,.22),transparent 62%)', push);
      g1.className = 'gd-glow';
      stage = div(`left:${GOLD.B.pic.x}px;top:${GOLD.B.pic.y}px;width:1000px;height:700px`, push);
    }
    return {root, stage, look, dark: true};
  },
  /* the words of a scene: the small lead, then the big gold key word on the word (gold.md 5) */
  text(F, T, lead, key) {
    const S = F.look === 'A' ? GOLD.A.sub : GOLD.B.sub;
    const a = F.look === 'A' ? T.t0 + GOLD.shrinkD : T.t0, b = F.look === 'A' ? T.t1 - GOLD.growD : T.t1;   // A: after the shrink, gone before the grow
    return this.words(F.root, S, F.look === 'A', [[lead, a + .05, 'l'], [key, Math.max(T.hit, a + .1), 'k']], a, b, true);
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
  /* every word of a real clip (CAPTIONS = [{t0, t1, parts: [[words, time said, 'k' | 'l'], …]}]): 'k' = the key word (big gold),
     'l' = lead (small); without a mark the last part is the key word; on the speaker at chest height, or in the scene's place (A: on white, B: on dark) */
  caption(c) {
    const w = this.wins.find(x => c.t0 < x.t1 && c.t1 > x.t0);
    let a = c.t0, b = c.t1;
    if (w) { a = Math.max(a, w.t0 + (w.look === 'A' ? GOLD.shrinkD : 0)); b = Math.min(b, w.t1 - (w.look === 'A' ? GOLD.growD : 0)); }
    else this.wins.forEach(x => { if (x.t1 > a && x.t1 <= b && x.t0 < a) a = x.t1; if (x.t0 < b && x.t0 >= a) b = Math.min(b, x.t0); });
    if (b - a < .15) return;
    const S = w ? (w.look === 'A' ? GOLD.A.sub : GOLD.B.sub) : {x: 70, y: this.chest(), w: 860, h: 0};
    const n = c.parts.length, parts = c.parts.map(([txt, t, kind], i) => [txt, t, kind ?? (i === n - 1 ? 'k' : 'l')]);   // a part may say which it is (the caption step picks the key word)
    const el = this.words(SC, S, w?.look === 'A', parts, a, b, false);
    if (w) el.style.zIndex = 2;                    // above the scene's look (it is drawn after it anyway)
  },
});
