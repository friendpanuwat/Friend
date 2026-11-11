/* =====================================================================
   STYLE · ios — an app-screen look (Friend 2026-11-11: reference clip "iOS style skill", "แกะสไตล์ไม่ใช่ให้ลอกเขามาเหมือนเป๊ะ").
   Every number here comes from cutpack/style-rules/ios.md (the code decides everything; the AI writes only the category + slots).
   The 7-item form:
   1 frame    a white app page; the speaker is a rounded "video card" that moves between 4 places (ios.md 1):
              L0 full screen (talk between scenes) · L1 card on top, picture below · L2 small photo top left, picture below ·
              L3 card at the bottom, picture on top. The code picks the place from the category, never twice in a row.
   2 surface  white cards with a hairline edge and a soft shadow, app-icon tiles, a grab handle on big cards
   3 drawing  thin dark lines (7), light grey tiles, ONE blue accent (#0A84FF); green only for done / on, red only for "no"
   4 colours  one light palette for every scene (variety comes from the four places, not from backgrounds)
   5 words    Anuphan only: the whole sentence waits light grey and turns dark as it is said (no box, no bigger key word)
   6 motion   app-like: fast start, soft stop, no turn, almost no overshoot — cubic-bezier(.32,.72,0,1)
   7 sound    a soft pop on the key word and on a tick, nothing else (no whoosh when the video moves)
   ===================================================================== */
const IOS = Object.freeze({
  faceY: 760,                                     // the test clip's face (a real clip reads faces.json, like split)
  srcH: 960,                                      // a video card shows about this much of the clip's height (head to chest), the same in every place
  near: 1.0,                                      // a scene that starts less than this after the last one moves there straight, no full screen between
  inD: .55, outD: .45,                            // the video card moving in / back to full screen (ios.md 1)
  showAt: .33, hideBefore: .6,                    // the picture and words: in at t0 + .33 (60 % of the move), gone at t1 − .45 − .15
  curve: [.32, .72, 0, 1],
  /* the four places (ios.md 1). pic = where the 600 × 340 picture sits (×1.373 = 824 × 467); sub = the words */
  L: {
    L0: {x: 0, y: 0, w: 1080, h: 1920, r: 0},
    L1: {x: 64, y: 140, w: 872, h: 780, r: 48, pic: {x: 88, y: 1130}, sub: {x: 70, y: 950, w: 860, h: 140, size: 60, align: 'center'}},
    L2: {x: 64, y: 150, w: 300, h: 400, r: 36, pic: {x: 88, y: 640}, sub: {x: 400, y: 170, w: 536, h: 0, size: 56, align: 'left'}},
    L3: {x: 64, y: 860, w: 872, h: 860, r: 48, pic: {x: 88, y: 150}, sub: {x: 70, y: 650, w: 860, h: 150, size: 60, align: 'center'}},
  },
  picW: 824, picH: 467, picS: 1.373,
  first: {B04: 'L2', B17: 'L2', B09: 'L2', B11: 'L3', B15: 'L3'},   // every other category starts at L1
  order: ['L1', 'L3', 'L2'],                                        // the next place when the first one repeats the scene before
  grey: '#C7C7CC', ink: '#1C1C1E',
});
const IOS_EASE = `cubic-bezier(${IOS.curve.join(',')})`;
/* the same curve for the video card (moved by a hook every frame, not by an animation) */
const iosEase = (() => {
  const [x1, y1, x2, y2] = IOS.curve, B = (a, b, t) => 3 * a * t * (1 - t) ** 2 + 3 * b * t * t * (1 - t) + t ** 3;
  return p => {
    if (p <= 0) return 0; if (p >= 1) return 1;
    let lo = 0, hi = 1; for (let i = 0; i < 30; i++) { const m = (lo + hi) / 2; if (B(x1, x2, m) < p) lo = m; else hi = m; }
    return B(y1, y2, (lo + hi) / 2);
  };
})();
/* the place of a scene: the category's first place; if the scene before had it, the next one in L1 → L3 → L2 */
function iosPlace(cat, prev) {
  const want = IOS.first[cat] ?? 'L1';
  if (want !== prev) return want;
  const o = IOS.order; return o[(o.indexOf(want) + 1) % o.length];
}
STYLE('ios', {
  name: 'หน้าจอแอป (iOS style)',
  page: '#FFFFFF',                                // what is behind a thing that has no card (check_contrast.js)
  prefer: 'ui',                                   // pick a variant that looks like an app screen when the category has one (ios.md 8)
  useSmall: true,                                 // the picture is a variant's 600 × 340 form, scaled 1.373 (ios.md 1)
  css: `
.i-app{--ink:#1C1C1E;--lw:7;--ico-w:2;--tile-r:.26;--box-r:.3;--sd:#1C1C1E;--sd-line:#1C1C1E;--lw-sd:0;
  --fl:#FFFFFF;--fl-line:#D1D1D6;--lw-fl:3;--fl-edge:#AEAEB2;--ac:#0A84FF;--ac-line:#0A84FF;--lw-ac:0;--ac-stroke:#0A84FF;
  --tr:rgba(60,60,67,.10);--neg:#FF3B30;--slot-line:#AEAEB2;--lw-slot:4;--text:#1C1C1E;--num:#1C1C1E;--num-font:"Anu";--chip-font:"Anu";
  --halo:rgba(10,132,255,.10);--lw-cross:10;--knob:#FFFFFF;--cursor:#FFFFFF;--cursor-line:#1C1C1E;--col:#8E8E93;--lw-star:4;--tape:#FFFFFF}
.i-pic{opacity:0}
.i-app .u-panel{background:#FFFFFF;border-radius:28px;border:1.5px solid rgba(17,24,39,.07);box-shadow:0 14px 40px rgba(17,24,39,.08),0 2px 6px rgba(17,24,39,.05)}
.i-app .u-panel.u-bubble{background:#E9E9EB;border:0;box-shadow:none}
.i-handle{position:absolute;width:64px;height:8px;border-radius:4px;background:#D1D1D6;top:14px}
.i-app .u-badge{box-shadow:0 6px 16px rgba(17,24,39,.10)}
.i-app .u-main{background:#D1D1D6;color:#1C1C1E}
.i-app .u-acc{background:#0A84FF;color:#FFFFFF}
.i-app .u-ok{background:#28A745;color:#FFFFFF}
.i-app .u-neg{background:#FF3B30;color:#FFFFFF}
.i-app .u-soft{background:#F7F7FA;color:#AEAEB2;box-shadow:none}
.i-app .u-track{background:#E9E9EB}
.i-app .u-track .u-main{background:#AEAEB2}            /* a grey tile on a grey track (a photo) blended: rule 14 */
.i-app .u-track-on{background:#28A745}
.i-app .u-knob{background:#FFFFFF;box-shadow:0 3px 8px rgba(0,0,0,.18)}
.i-app .u-knob-ico{color:#1C1C1E}
.i-app .u-bar{background:#E9E9EB}
.i-app .u-bar-on{background:#0A84FF}
.i-app .u-box{border:5px solid #8E8E93}
.i-app .u-label{font-family:"Anu";font-weight:600;color:var(--text)}
.i-app .u-num{font-weight:700;letter-spacing:-1px}
.i-app .u-chip{font-weight:600}
.i-app .u-chip.u-main{background:#F2F2F7;color:#1C1C1E}
.i-app .u-chip.u-acc{background:#0A84FF;color:#FFFFFF}
.i-app .u-btn-text{font-family:"Anu";font-weight:600}
.i-app .u-pulse{border-width:5px}
.i-app .u-dotc{stroke:none}
.i-shade{position:absolute;opacity:0}
.i-sub{position:absolute;display:flex;opacity:0}
.i-sub>div{position:relative;white-space:nowrap}
.i-sub span{font-family:"Anu";font-weight:700;line-height:1.25;color:${IOS.grey}}
`,
  motion: {
    pop:   {kf: [{opacity: 0, transform: 'scale(.92)'}, {opacity: 1, transform: 'none'}], d: .45, e: IOS_EASE},
    rise:  {kf: [{opacity: 0, transform: 'translateY(40px)'}, {opacity: 1, transform: 'none'}], d: .5, e: IOS_EASE},
    drop:  {kf: [{opacity: 0, transform: 'translateY(-40px)'}, {opacity: 1, transform: 'none'}], d: .45, e: IOS_EASE},
    lead:  {kf: [{opacity: 0, transform: 'translateY(12px)'}, {opacity: 1, transform: 'none'}], d: .3, e: IOS_EASE},
    chip:  {kf: [{opacity: 0, transform: 'translateY(12px)'}, {opacity: 1, transform: 'none'}], d: .3, e: IOS_EASE},
    key:   {kf: [{opacity: 0}, {opacity: 1}], d: .25, e: IOS_EASE},
    leave: {kf: [{opacity: 1, transform: 'none'}, {opacity: 0, transform: 'scale(.96)'}], d: .25, e: IOS_EASE},
    punch: {kf: [{transform: 'scale(1)'}, {transform: 'scale(1.04)', offset: .4}, {transform: 'scale(1)'}], d: .35, e: 'ease-in-out'},
    shake: {kf: [0, -10, 10, -10, 10, -10, 0].map(x => ({transform: `translateX(${x}px)`})), d: .45, e: 'ease-in-out'},   // a wrong passcode
    move:  {d: .5, e: IOS_EASE},
    tilt:  {d: .6, e: IOS_EASE},
    snap:  {d: .45, e: IOS_EASE},
    swap:  {d: .25, e: IOS_EASE},
    draw:  {d: .6, e: IOS_EASE},
    stroke: {d: .2},
    stagger: .08,
    fall:  {d: 1.0},                 // a row of dominoes from the first push to the last one lying flat
    float: {a: 3, p: 3},
    glow:  {kf: [{opacity: 0}, {opacity: 1}], d: .5, e: IOS_EASE},
  },
  sound: {hit: ['pop', -24], ok: ['pop', -24]},

  setup() {
    BGL.style.background = '#FFFFFF';
    /* the video card's shadow sits under the video (a clip-path would cut a shadow on the video itself) */
    const sh = div('', BGL); sh.className = 'i-shade';
    this.wins = [];
    const L = IOS.L, lerp = (a, b, p) => a + (b - a) * p;
    const look = (A0, B0, p) => {                  // the card between two places; the speaker's face stays in the middle of it
      const a = L[A0], b = L[B0], k = n => n === 'L0' ? {s: 1, fy: 960} : {s: Math.max(L[n].w / 1080, L[n].h / IOS.srcH), fy: IOS.faceY};
      const ka = k(A0), kb = k(B0);
      return {x: lerp(a.x, b.x, p), y: lerp(a.y, b.y, p), w: lerp(a.w, b.w, p), h: lerp(a.h, b.h, p), r: lerp(a.r, b.r, p),
        s: lerp(ka.s, kb.s, p), fy: lerp(ka.fy, kb.fy, p), shade: A0 === 'L0' ? (B0 === 'L0' ? 0 : p) : (B0 === 'L0' ? 1 - p : 1)};
    };
    this.at = t => {                               // where the card is at time t
      const W = this.wins; let k = -1;
      W.forEach((w, i) => { if (w.t0 <= t) k = i; });
      if (k < 0) return look('L0', 'L0', 0);
      const w = W[k], prev = W[k - 1], next = W[k + 1];
      const fromPrev = prev && w.t0 - prev.t1 < IOS.near, toNext = next && next.t0 - w.t1 < IOS.near;
      if (t >= w.t1 && !toNext) return look('L0', 'L0', 0);
      const pin = iosEase(Math.min(1, (t - w.t0) / IOS.inD));
      if (!toNext && t > w.t1 - IOS.outD) {                       // going back to full screen
        const pout = iosEase(Math.min(1, (t - (w.t1 - IOS.outD)) / IOS.outD));
        return pin < 1 ? look(fromPrev ? prev.L : 'L0', w.L, pin * (1 - pout)) : look(w.L, 'L0', pout);
      }
      return look(fromPrev ? prev.L : 'L0', w.L, pin);
    };
    HOOKS.push(t => {
      const c = this.at(t), full = c.shade === 0 && c.w === 1080;
      if (full) { V.style.transform = 'none'; V.style.clipPath = 'none'; sh.style.opacity = 0; return; }
      const half = [c.w / 2 / c.s, c.h / 2 / c.s];
      const l = Math.max(0, 540 - half[0]), r = Math.max(0, 1080 - 540 - half[0]), tp = Math.max(0, c.fy - half[1]), bt = Math.max(0, 1920 - c.fy - half[1]);
      V.style.transform = `translate(${c.x + c.w / 2 - 540 * c.s}px,${c.y + c.h / 2 - c.fy * c.s}px) scale(${c.s})`;
      V.style.clipPath = `inset(${tp}px ${r}px ${bt}px ${l}px round ${c.r / c.s}px)`;
      Object.assign(sh.style, {left: c.x + 'px', top: c.y + 'px', width: c.w + 'px', height: c.h + 'px', borderRadius: c.r + 'px',
        boxShadow: '0 24px 60px rgba(17,24,39,.18)', opacity: c.shade});
    });
  },
  frame(t0, t1, {scene}) {
    const meta = SCENES[scene]?.meta ?? {}, prev = this.wins.at(-1);
    const P = iosPlace(meta.cat, prev?.L ?? null), L = IOS.L[P];
    this.wins.push({t0, t1, L: P});
    const small = !!(SMALLS[scene] || meta.small);
    const root = div(`left:${L.pic.x}px;top:${L.pic.y}px;width:${IOS.picW}px;height:${IOS.picH}px`, SC); root.className = 'i-app i-pic';
    A(root, [{opacity: 0}, {opacity: 1}], t0 + IOS.showAt, .25, {e: IOS_EASE});
    A(root, [{opacity: 1}, {opacity: 0}], t1 - IOS.hideBefore, .2, {e: IOS_EASE, f: 'forwards'});
    /* a variant's small form (600 × 340) at 1.373; a scene without one draws its 1000 × 700 form, fitted */
    const fs = Math.min(IOS.picW / 1000, IOS.picH / 700);
    const stage = small ? div(`left:0;top:0;width:600px;height:340px;transform-origin:0 0;transform:scale(${IOS.picS})`, root)
                        : div(`left:${(IOS.picW - 1000 * fs) / 2}px;top:0;width:1000px;height:700px;transform-origin:0 0;transform:scale(${fs})`, root);
    /* a grab handle on every big card (more than half the canvas's area): the look of a sheet pulled up (ios.md 2).
       Not on things that are cards of their own kind (phone, receipt, notification, bubble) or a card that has its handle */
    FITS.push(() => stage.querySelectorAll('.u-panel').forEach(p => {
      if (p.matches('.u-phone,.u-receipt,.u-note,.u-bubble,.u-ghost') || p.querySelector('.u-handle,.i-handle')
          || p.offsetWidth * p.offsetHeight < stage.offsetWidth * stage.offsetHeight / 2) return;
      const h = div(`left:${p.offsetWidth / 2 - 32}px`, p); h.className = 'i-handle u-decor';
    }));
    return {root, stage, place: P, small, dark: false};
  },
  /* the sentence waits light grey, the lead turns dark when it is said, the key word on the key word (ios.md 5) */
  text(F, T, lead, key) {
    const S = IOS.L[F.place].sub, el = div(`left:${S.x}px;top:${S.y}px;width:${S.w}px;${S.h ? `height:${S.h}px;` : ''}`, SC);
    el.className = 'i-sub';
    Object.assign(el.style, {flexDirection: 'row', flexWrap: 'nowrap', alignItems: S.h ? 'center' : 'flex-start',
      justifyContent: S.align === 'center' ? 'center' : 'flex-start', columnGap: S.size * .28 + 'px'});
    A(el, [{opacity: 0, transform: 'translateY(12px)'}, {opacity: 1, transform: 'none'}], T.t0 + IOS.showAt, .3, {e: IOS_EASE});
    A(el, [{opacity: 1}, {opacity: 0}], T.t1 - IOS.hideBefore, .2, {f: 'forwards'});
    const rows = [[lead, T.t0 + .4], [key, T.hit]].filter(([w]) => w).map(([w, t]) => {
      const r = document.createElement('div'); el.appendChild(r);
      const s = document.createElement('span'); s.textContent = w; s.style.fontSize = S.size + 'px'; r.appendChild(s);
      A(s, [{color: IOS.grey}, {color: IOS.ink}], t, .3, {e: 'ease-out'});
      return {r, s};
    });
    FITS.push(() => {                              // one line when both fit, else lead / key on two lines, each shrunk (never cut) to fit
      const gap = rows.length > 1 ? parseFloat(getComputedStyle(el).columnGap) : 0;
      if (rows.reduce((n, x) => n + x.s.offsetWidth, 0) + gap <= S.w) return;
      Object.assign(el.style, {flexDirection: 'column', alignItems: S.align === 'center' ? 'center' : 'flex-start', justifyContent: S.h ? 'center' : 'flex-start', rowGap: '10px'});
      rows.forEach(({r, s}) => { const w = s.offsetWidth; if (w > S.w) { r.style.transform = `scale(${S.w / w})`; r.style.transformOrigin = S.align === 'center' ? '50% 50%' : '0 50%'; } });
    });
    return el;
  },
});
