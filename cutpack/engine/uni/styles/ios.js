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
  --halo:rgba(10,132,255,.10);--lw-cross:10;--knob:#FFFFFF;--cursor:#FFFFFF;--cursor-line:#1C1C1E;--col:#8E8E93;--lw-star:4}
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
.i-cap span{text-shadow:0 2px 14px rgba(0,0,0,.5)}
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
    /* the full-screen subtitle's dark band (ios.md 5): from see-through at y 1000 to .55 at the bottom; only on the full screen */
    this.dim = div('left:0;top:1000px;width:1080px;height:920px;opacity:0;background:linear-gradient(180deg,rgba(0,0,0,0),rgba(0,0,0,.55))', SC);
    this.wins = [];
    if (typeof CAPTIONS !== 'undefined') FITS.unshift(() => CAPTIONS.forEach(c => this.caption(c)));   // a real clip: every word, after every scene is known
    const L = IOS.L, lerp = (a, b, p) => a + (b - a) * p;
    /* the card between two places (wa, wb: the scene windows, for where the face is); the face stays in the middle of the card */
    const look = (wa, wb, p) => {
      const A0 = wa?.L ?? 'L0', B0 = wb?.L ?? 'L0', a = L[A0], b = L[B0];
      const k = (n, w) => n === 'L0' ? {s: 1, fx: 540, fy: 960} : {s: Math.max(L[n].w / 1080, L[n].h / IOS.srcH), fx: w.fx, fy: w.fy};
      const ka = k(A0, wa), kb = k(B0, wb);
      return {x: lerp(a.x, b.x, p), y: lerp(a.y, b.y, p), w: lerp(a.w, b.w, p), h: lerp(a.h, b.h, p), r: lerp(a.r, b.r, p),
        s: lerp(ka.s, kb.s, p), fx: lerp(ka.fx, kb.fx, p), fy: lerp(ka.fy, kb.fy, p), shade: A0 === 'L0' ? (B0 === 'L0' ? 0 : p) : (B0 === 'L0' ? 1 - p : 1)};
    };
    this.at = t => {                               // where the card is at time t
      const W = this.wins; let k = -1;
      W.forEach((w, i) => { if (w.t0 <= t) k = i; });
      if (k < 0) return look(null, null, 0);
      const w = W[k], prev = W[k - 1], next = W[k + 1];
      const fromPrev = prev && w.t0 - prev.t1 < IOS.near, toNext = next && next.t0 - w.t1 < IOS.near;
      if (t >= w.t1 && !toNext) return look(null, null, 0);
      const pin = iosEase(Math.min(1, (t - w.t0) / IOS.inD));
      if (!toNext && t > w.t1 - IOS.outD) {                       // going back to full screen
        const pout = iosEase(Math.min(1, (t - (w.t1 - IOS.outD)) / IOS.outD));
        return pin < 1 ? look(fromPrev ? prev : null, w, pin * (1 - pout)) : look(w, null, pout);
      }
      return look(fromPrev ? prev : null, w, pin);
    };
    HOOKS.push(t => {
      const c = this.at(t), full = c.shade === 0 && c.w === 1080;
      this.dim.style.opacity = 1 - c.shade;                       // the dark band under the full-screen subtitle goes with the full screen
      if (full) { V.style.transform = 'none'; V.style.clipPath = 'none'; sh.style.opacity = 0; return; }
      const half = [c.w / 2 / c.s, c.h / 2 / c.s];
      const l = Math.max(0, c.fx - half[0]), r = Math.max(0, 1080 - c.fx - half[0]), tp = Math.max(0, c.fy - half[1]), bt = Math.max(0, 1920 - c.fy - half[1]);
      V.style.transform = `translate(${c.x + c.w / 2 - c.fx * c.s}px,${c.y + c.h / 2 - c.fy * c.s}px) scale(${c.s})`;
      V.style.clipPath = `inset(${tp}px ${r}px ${bt}px ${l}px round ${c.r / c.s}px)`;
      Object.assign(sh.style, {left: c.x + 'px', top: c.y + 'px', width: c.w + 'px', height: c.h + 'px', borderRadius: c.r + 'px',
        boxShadow: '0 24px 60px rgba(17,24,39,.18)', opacity: c.shade});
    });
  },
  frame(t0, t1, {scene}) {
    const meta = SCENES[scene]?.meta ?? {}, prev = this.wins.at(-1);
    const P = iosPlace(meta.cat, prev?.L ?? null), L = IOS.L[P], L0 = IOS.L[P];
    /* where the face is in this scene (faces.json of a real clip: the mean of its boxes, a little above the middle to keep the
       hair); the test clip has none, so the fixed faceY. Kept so the card never shows past the clip's edge */
    let fx = 540, fy = IOS.faceY;
    const tr = typeof FACES !== 'undefined' ? FACES.track.filter(([t]) => t >= t0 && t <= t1).map(x => x[1]) : [];
    if (tr.length) { const m = i => tr.reduce((n, b) => n + b[i], 0) / tr.length; fx = (m(0) + m(2)) / 2; fy = (m(1) + m(3)) / 2 - .1 * (m(3) - m(1)); }
    const s = Math.max(L0.w / 1080, L0.h / IOS.srcH), hw = L0.w / 2 / s, hh = L0.h / 2 / s;
    fx = Math.min(1080 - hw, Math.max(hw, fx)); fy = Math.min(1920 - hh, Math.max(hh, fy));
    this.wins.push({t0, t1, L: P, fx, fy});
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
  /* every word of a real clip (CAPTIONS = [{t0, t1, parts: [[words, time said], …]}]): on the full screen white under the chin,
     words not said yet white .45 (ios.md 5); inside a scene the same place and look as the scene's words (grey → dark).
     A line is hidden while the video card moves (nothing over the face, and white words would vanish on the white page) */
  caption(c) {
    const W = this.wins, w = W.find(x => c.t0 < x.t1 && c.t1 > x.t0);
    let a = c.t0, b = c.t1, S;
    if (w) {                                         // the card stays put to the end when the next scene follows straight on
      const nx = W[W.indexOf(w) + 1], held = nx && nx.t0 - w.t1 < IOS.near;
      a = Math.max(a, w.t0 + IOS.showAt); b = Math.min(b, held ? w.t1 : w.t1 - IOS.hideBefore + .2); S = IOS.L[w.L].sub;
    }
    else {
      W.forEach(x => { if (x.t1 > a - IOS.outD && x.t1 <= a) a = Math.max(a, x.t1); if (x.t0 < b + .05 && x.t0 >= a) b = Math.min(b, x.t0); });
    }
    if (b - a < .15) return;
    const app = !!w, top = typeof FACES !== 'undefined' ? Math.max(1180, FACES.layout?.subtitleTop ?? 1180) : 1180;
    const box = app ? {x: S.x, y: S.y, w: S.w, h: S.h || 0, size: S.size, align: S.align} : {x: 90, y: top, w: 900, h: 0, size: 64, align: 'center'};
    const el = div(`left:${box.x}px;top:${box.y}px;width:${box.w}px;${box.h ? `height:${box.h}px;` : ''}`, SC);
    el.className = 'i-sub ' + (app ? '' : 'i-cap');
    Object.assign(el.style, {flexDirection: 'column', alignItems: box.align === 'center' ? 'center' : 'flex-start', justifyContent: box.h ? 'center' : 'flex-start', rowGap: '6px'});
    /* a line that follows straight on from another swaps at once (a fade out then in left a blank moment at every join) */
    const joinIn = CAPTIONS.some(x => Math.abs(x.t1 - a) < .05), joinOut = CAPTIONS.some(x => Math.abs(x.t0 - b) < .05);
    const din = joinIn ? .12 : .25, dout = joinOut ? 0 : .2;
    A(el, [{opacity: 0, transform: `translateY(${joinIn ? 6 : 12}px)`}, {opacity: 1, transform: 'none'}], a, din, {e: IOS_EASE, f: 'none'});
    A(el, [{opacity: 1}, {opacity: 1}], a + din, Math.max(.01, b - a - din - dout), {f: 'none'});
    if (dout) A(el, [{opacity: 1}, {opacity: 0}], b - dout, dout, {f: 'none'});
    const from = app ? IOS.grey : 'rgba(255,255,255,.45)', to = app ? IOS.ink : '#FFFFFF';
    /* lines: parts side by side while they fit the width, then a new line; a line wider than the box shrinks (never cut) */
    const row = () => { const r = document.createElement('div'); r.style.cssText = 'position:relative;white-space:nowrap;display:flex;column-gap:' + box.size * .28 + 'px'; el.appendChild(r); return r; };
    const spans = c.parts.map(([txt, t]) => {
      const sp = document.createElement('span'); sp.textContent = txt; sp.style.fontSize = box.size + 'px'; sp.style.color = from;
      A(sp, [{color: from}, {color: to}], Math.max(a, t), .3, {e: 'ease-out'}); return sp;
    });
    /* this already runs inside FITS (the fonts are in), so the lines are measured now: a FITS added here would never run */
    let r = row();
    spans.forEach(sp => { r.appendChild(sp); if (r.offsetWidth > box.w && r.children.length > 1) { r.removeChild(sp); r = row(); r.appendChild(sp); } });
    [...el.children].forEach(x => { if (x.offsetWidth > box.w) { x.style.transform = `scale(${box.w / x.offsetWidth})`; x.style.transformOrigin = box.align === 'center' ? '50% 50%' : '0 50%'; } });
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
