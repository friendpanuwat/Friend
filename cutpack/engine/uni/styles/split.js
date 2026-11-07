/* =====================================================================
   STYLE · split — the look of Friend's clip 3 (skill not named yet): split screen in soft pastel.
   The 7-item form:
   1 frame    the screen splits: a window with the picture on top, the words under it, the speaker shrinks into
              a rounded frame at the bottom (and grows back after the scene)
   2 surface  a light app window with three dots and a time code; white inner cards with a thin border
   3 drawing  thin dark-purple outlines over flat lavender fills, nothing glows, no shadows on things
   4 colours  misty blue-grey background, lavender / purple / slate; every third window is dark purple;
              muted rose only for "no"
   5 words    two lines under the window (Anuphan), the whole sentence shown pale, each part darkens as it is said
   6 motion   calm: things slide up a little and fade in, no overshoot; hits are a small swell
   7 sound    almost none: a soft pop on the hit (kept in window.SFX; the test clips are silent)
   ===================================================================== */
const SPLIT = Object.freeze({win: {x: 90, y: 230, w: 800, h: 660}, frame: {x: 40, y: 1236, w: 1000, h: 620, r: 44}, faceY: 760, inD: .55, outD: .45});
STYLE('split', {
  name: 'แบ่งจอพาสเทล (แบบคลิปที่ 3)',
  css: `
.p-light{--ink:#4B3D6E;--lw:6;--sd:#CDBFEA;--sd-line:#4B3D6E;--lw-sd:5;--fl:#FFFFFF;--fl-line:#4B3D6E;--lw-fl:5;--ac:#9C84D6;--ac-line:#4B3D6E;--lw-ac:5;
  --tr:#DDD6EB;--neg:#C2667A;--slot-line:#A89CC6;--lw-slot:4;--ico-w:1.7;--tile-r:.24;--box-r:.22;--text:#4B3D6E;--lw-cross:9;--knob:#FFFFFF}
.p-dark{--ink:#F1ECFB;--lw:6;--sd:#8C7BBB;--sd-line:#F1ECFB;--lw-sd:5;--fl:#6F5F97;--fl-line:#F1ECFB;--lw-fl:5;--ac:#D9CCF6;--ac-line:#F1ECFB;--lw-ac:5;
  --tr:rgba(255,255,255,.2);--neg:#F09AA8;--slot-line:rgba(241,236,251,.55);--lw-slot:4;--ico-w:1.7;--tile-r:.24;--box-r:.22;--text:#F1ECFB;--lw-cross:9;--knob:#F1ECFB}
.p-win{border-radius:24px;overflow:hidden;opacity:0}
.p-light.p-win{background:#F2EFF7;border:2px solid rgba(75,61,110,.10);box-shadow:0 34px 70px rgba(40,55,75,.22)}
.p-dark.p-win{background:#5E4F82;border:2px solid rgba(255,255,255,.12);box-shadow:0 34px 70px rgba(40,40,70,.3)}
.p-bar{position:absolute;left:0;top:0;right:0;height:50px}
.p-dots{position:absolute;left:24px;top:20px;display:flex;gap:9px}.p-dots i{width:11px;height:11px;border-radius:50%;background:currentColor;opacity:.35}
.p-tc{position:absolute;right:24px;top:15px;font-family:"Anu";font-weight:500;font-size:18px;letter-spacing:1px;opacity:.45}
.p-light .p-bar{color:#4B3D6E}.p-dark .p-bar{color:#F1ECFB}
.u-panel{border-radius:22px}
.p-light .u-panel{background:#FFFFFF;border:2px solid #E3DDEE}
.p-dark .u-panel{background:rgba(255,255,255,.10);border:2px solid rgba(255,255,255,.16)}
.u-badge{border:3px solid var(--ink)}
.p-light .u-main{background:#E9E3F5;color:#4B3D6E}
.p-dark .u-main{background:#7A6AA6;color:#F1ECFB}
.u-acc{background:#7E66BE;color:#FFFFFF}
.p-dark .u-acc{background:#D9CCF6;color:#4B3D6E}
.u-soft{background:transparent;color:var(--slot-line);border-color:var(--slot-line);border-style:dashed}
.u-ok{background:#5E7F92;color:#FFFFFF;border-color:#5E7F92}
.u-track{background:var(--tr);border:3px solid var(--ink)}
.u-track-on{background:#9C84D6}
.u-knob{background:var(--knob);border:3px solid var(--ink)}
.u-knob-ico{color:#4B3D6E}
.u-bar{background:var(--tr)}
.u-bar-on{background:#7E66BE}
.u-box{border:4px solid var(--ink)}
.u-label{font-family:"Anu";font-weight:600;color:var(--text)}
.u-skel{background:var(--tr)}
.u-dotc{fill:#7E66BE;stroke:var(--ink);stroke-width:4}
.p-frame{position:absolute;border-radius:44px;opacity:0;box-shadow:0 0 0 6px rgba(255,255,255,.55),0 30px 60px rgba(30,45,65,.25)}
.p-text{position:absolute;left:90px;width:800px;top:950px;display:flex;flex-direction:column;align-items:center;row-gap:4px;opacity:0}
.p-text div{position:relative;white-space:nowrap}
.p-text span{font-family:"Anu";font-weight:700;font-size:64px;line-height:1.3;color:#B8AECF}
`,
  motion: {
    pop:   {kf: [{opacity: 0, transform: 'translateY(18px) scale(.94)'}, {opacity: 1, transform: 'none'}], d: .55, e: EASE.gentle},
    drop:  {kf: [{opacity: 0, transform: 'translateY(-40px)'}, {opacity: 1, transform: 'none'}], d: .6, e: EASE.gentle},
    rise:  {kf: [{opacity: 0, transform: 'translateY(36px)'}, {opacity: 1, transform: 'none'}], d: .6, e: EASE.gentle},
    lead:  {kf: [{opacity: 0, transform: 'translateY(10px)'}, {opacity: 1, transform: 'none'}], d: .45, e: EASE.gentle},
    chip:  {kf: [{opacity: 0, transform: 'translateY(16px)'}, {opacity: 1, transform: 'none'}], d: .5, e: EASE.gentle},
    leave: {kf: [{opacity: 1, transform: 'none'}, {opacity: 0, transform: 'translateY(14px)'}], d: .4, e: EASE.gentle},
    punch: {kf: [{transform: 'scale(1)'}, {transform: 'scale(1.05)', offset: .45}, {transform: 'scale(1)'}], d: .6, e: 'ease-in-out'},
    shake: {kf: [{transform: 'translateX(0)'}, {transform: 'translateX(-9px)'}, {transform: 'translateX(8px)'}, {transform: 'translateX(-4px)'}, {transform: 'translateX(0)'}], d: .55, e: 'ease-in-out'},
    move:  {d: .7, e: 'cubic-bezier(.45,0,.25,1)'},
    tilt:  {d: .85, e: 'cubic-bezier(.45,0,.25,1)'},
    snap:  {d: .7, e: EASE.gentle},
    swap:  {d: .45, e: 'ease-in-out'},
    draw:  {d: 1.0, e: EASE.inout},
    stroke: {d: .3},
    stagger: .16,
  },
  sound: {hit: ['pop_lo', -27]},

  setup() {
    BGL.style.background = 'radial-gradient(70% 45% at 75% 16%,rgba(255,255,255,.7),transparent 70%),'
      + 'radial-gradient(60% 40% at 15% 72%,rgba(120,150,175,.35),transparent 70%),linear-gradient(180deg,#E3EAF0 0%,#C3D2DD 50%,#9DB2C2 100%)';
    /* the speaker shrinks into the bottom frame during every scene window (and grows back) */
    const fr = div('', SC); fr.className = 'p-frame';
    Object.assign(fr.style, {left: SPLIT.frame.x + 'px', top: SPLIT.frame.y + 'px', width: SPLIT.frame.w + 'px', height: SPLIT.frame.h + 'px'});
    this.wins = [];
    HOOKS.push(t => {
      const w = this.wins.find(([a, b]) => t >= a && t < b);
      let p = 0;
      if (w) p = Math.min(easeIO(Math.min(1, (t - w[0]) / SPLIT.inD)), easeIO(Math.min(1, Math.max(0, (w[1] - t) / SPLIT.outD))));
      const F = SPLIT.frame, s1 = F.w / 1080, top = SPLIT.faceY - F.h / s1 / 2;      // the face stays in the middle of the frame
      const s = 1 - (1 - s1) * p, tx = F.x * p, ty = (F.y - top * s1) * p;
      V.style.transform = p ? `translate(${tx}px,${ty}px) scale(${s})` : 'none';
      V.style.clipPath = p ? `inset(${top * p}px 0 ${(1920 - top - F.h / s1) * p}px 0 round ${F.r / s1 * p}px)` : 'none';
      fr.style.opacity = p;
    });
  },
  frame(t0, t1, {index}) {
    this.wins.push([t0, t1]);
    const dark = index % 3 === 1, W = SPLIT.win;
    const root = div(`left:${W.x}px;top:${W.y}px;width:${W.w}px;height:${W.h}px`, SC);
    root.className = `p-win ${dark ? 'p-dark' : 'p-light'}`;
    A(root, [{opacity: 0, transform: 'translateY(-30px)'}, {opacity: 1, transform: 'none'}], t0 + .1, .55, {e: EASE.gentle});
    A(root, [{opacity: 1}, {opacity: 0}], t1 - .35, .3, {e: EASE.gentle, f: 'forwards'});
    const tc = `00:00:${String(10 + index * 7).padStart(2, '0')}:00`;
    div('', root, `<div class="p-dots"><i></i><i></i><i></i></div><div class="p-tc">${tc}</div>`).className = 'p-bar';
    const stage = div('left:30px;top:64px;width:1000px;height:700px;transform-origin:0 0;transform:scale(.74)', root);
    return {root, stage, dark};
  },
  /* the sentence waits in pale ink, each part darkens when it is said (karaoke in two tones) */
  text(F, T, lead, key) {
    const el = div('', SC); el.className = `p-text ${F.dark ? 'p-dark' : 'p-light'}`;
    A(el, [{opacity: 0, transform: 'translateY(12px)'}, {opacity: 1, transform: 'none'}], T.t0 + .2, .45, {e: EASE.gentle});
    A(el, [{opacity: 1}, {opacity: 0}], T.t1 - .35, .3, {f: 'forwards'});
    const ink = '#4B3D6E';
    const row = (txt, t) => {
      const r = document.createElement('div'); el.appendChild(r); const s = document.createElement('span'); s.textContent = txt; r.appendChild(s);
      A(s, [{color: '#B8AECF'}, {color: ink}], t, .35, {e: 'ease-out'});
      FITS.push(() => { const w = s.offsetWidth; if (w > 800) r.style.transform = `scale(${800 / w})`; });
    };
    if (lead) row(lead, T.t0 + .35);
    if (key) row(key, T.hit);
    return el;
  },
});
