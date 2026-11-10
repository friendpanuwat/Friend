/* =====================================================================
   STYLE · glass — the look of Friend's clip 2 (talking-head-motion): glass over the blurred speaker.
   The 7-item form:
   1 frame    no card: the speaker blurs behind, the picture floats in the lower middle, the words sit on top;
              the whole scene drifts a little in 3D
   2 surface  frosted glass cards with a thin light edge; round glass holders for icons
   3 drawing  thin light lines that glow; solids become glass with a light outline
   4 colours  night ink, white text and lines, ONE light blue (#8FD3FF) that glows, soft red only for "no"
   5 words    every letter flips up in 3D; the key word lights white-hot and settles light blue (Mitr, Sriracha)
   6 motion   unhurried: things rise out of a blur with a soft settle, hits glow brighter instead of bouncing
   7 sound    whoosh on the blur-in, soft swish on the key word (kept in window.SFX; the test clips are silent)
   ===================================================================== */
STYLE('glass', {
  name: 'กระจกบนภาพเบลอ (แบบคลิปที่ 2)',
  blurred: true,
  css: `
.g-root{opacity:0;--ink:rgba(235,246,255,.92);--lw:6;--sd:rgba(143,211,255,.14);--sd-line:rgba(235,246,255,.9);--lw-sd:5;
  --fl:rgba(255,255,255,.08);--fl-line:rgba(235,246,255,.85);--lw-fl:5;--ac:rgba(143,211,255,.30);--ac-line:#8FD3FF;--lw-ac:6;--ac-stroke:#8FD3FF;
  --tr:rgba(255,255,255,.16);--neg:#FF7A8A;--slot-line:rgba(143,211,255,.55);--lw-slot:4;--ico-w:1.8;--tile-r:.5;--box-r:.3;--text:#FFFFFF;--lw-cross:10}
.g-root svg{filter:drop-shadow(0 0 10px rgba(143,211,255,.5))}
.g-root{--halo:rgba(143,211,255,.34);--num:#8FD3FF;--spot:#8FD3FF}
.u-num{text-shadow:0 0 40px rgba(143,211,255,.6)}
.u-chip.u-main{background:rgba(255,255,255,.12);border:1.5px solid rgba(255,255,255,.28);color:#FFFFFF}
.u-panel{border-radius:36px;background:linear-gradient(160deg,rgba(255,255,255,.13),rgba(255,255,255,.04));border:1.5px solid rgba(255,255,255,.2);
  box-shadow:0 40px 90px rgba(0,0,0,.5),inset 0 1px 0 rgba(255,255,255,.2)}
.u-badge{border:1.5px solid rgba(255,255,255,.28);background:linear-gradient(160deg,rgba(255,255,255,.16),rgba(255,255,255,.05));box-shadow:0 20px 50px rgba(0,0,0,.4)}
.u-main{color:#EAF6FF}
.u-acc{color:#8FD3FF;border:2px solid #8FD3FF;background:rgba(143,211,255,.16);box-shadow:0 0 34px rgba(143,211,255,.45),inset 0 0 20px rgba(143,211,255,.2)}
.u-soft{color:rgba(255,255,255,.38);border-color:rgba(255,255,255,.12);background:rgba(255,255,255,.04);box-shadow:none}
.u-ok{color:#05070D;background:#8FD3FF;border-color:#CFEFFF;box-shadow:0 0 34px rgba(143,211,255,.7)}
.u-track{background:rgba(255,255,255,.12);border:1.5px solid rgba(255,255,255,.22)}
.u-track-on{background:linear-gradient(90deg,#4E9BFF,#8FD3FF);box-shadow:0 0 30px rgba(143,211,255,.6)}
.u-knob{background:#FFFFFF;box-shadow:0 0 24px rgba(143,211,255,.8)}
.u-knob-ico{color:#0B1A2E}
.u-bar{background:rgba(255,255,255,.14)}
.u-bar-on{background:linear-gradient(90deg,#4E9BFF,#8FD3FF);box-shadow:0 0 22px rgba(143,211,255,.7)}
.u-box{border:3px solid rgba(235,246,255,.8);background:rgba(255,255,255,.05)}
.u-label{font-family:"CardSans";color:#FFFFFF}
.u-skel{background:rgba(255,255,255,.18)}
.u-dotc{fill:#8FD3FF}
.u-col{background:linear-gradient(180deg,rgba(255,255,255,.34),rgba(255,255,255,.10));border:1.5px solid rgba(255,255,255,.3)}
.u-col-acc{background:linear-gradient(180deg,#8FD3FF,#4E9BFF);border:0;box-shadow:0 0 30px rgba(143,211,255,.55)}
.u-bar-main{background:rgba(235,246,255,.75)}
.u-neg{color:#FF7A8A;border:2px solid #FF7A8A;background:rgba(255,122,138,.14);box-shadow:0 0 30px rgba(255,122,138,.35)}
.g-root{--cursor:#FFFFFF;--cursor-line:#05070D;--lw-star:3}
/* glass on glass (Friend 2026-11-07: cards must not show through each other): only the blurred speaker may show
   through a card. No stacked "ghost" card for depth (two see-through outlines read as a mistake); a card is dark
   enough to hide a card under it; a small piece that sits on a card edge (✓, sign, arrow, tile) is solid. */
.g-root .u-ghost{display:none}
.g-root .u-panel{background:linear-gradient(160deg,rgba(255,255,255,.13),rgba(255,255,255,.04)),rgba(8,13,24,.8)}
.g-root .u-badge{background-color:#0D1526}
.g-root .u-badge.u-acc{background:linear-gradient(rgba(143,211,255,.16),rgba(143,211,255,.16)),#0D1526}
.g-root .u-badge.u-soft{background:linear-gradient(rgba(255,255,255,.04),rgba(255,255,255,.04)),#0D1526}
.g-root .u-badge.u-neg{background:linear-gradient(rgba(255,122,138,.14),rgba(255,122,138,.14)),#0D1526}
.g-root .u-badge.u-ok{background:#8FD3FF}
.g-text{position:absolute;left:60px;width:960px;top:230px;display:flex;flex-direction:column;align-items:center;row-gap:6px}
.g-line{display:flex;justify-content:center;white-space:nowrap;perspective:900px;position:relative}
.g-g{display:inline-block;opacity:0;transform-origin:50% 80%}
.g-s{font-family:"Hand";font-size:62px;line-height:1.25;color:#fff}
.g-s .g-g{text-shadow:0 4px 22px rgba(0,0,0,.65)}
.g-k{font-family:"KeySans";font-size:136px;line-height:1.14;letter-spacing:-1px;color:#8FD3FF}
.g-k .g-g{text-shadow:0 0 34px rgba(143,211,255,.55),0 6px 24px rgba(0,0,0,.55)}
`,
  motion: {
    pop:   {kf: [{opacity: 0, transform: 'translateY(40px) scale(.7)', filter: 'blur(10px)'}, {opacity: 1, transform: 'none', filter: 'blur(0)'}], d: .6, e: EASE.soft},
    drop:  {kf: [{opacity: 0, transform: 'translateY(-90px)', filter: 'blur(8px)'}, {opacity: 1, transform: 'none', filter: 'blur(0)'}], d: .7, e: EASE.soft},
    rise:  {kf: [{opacity: 0, transform: 'translateY(70px) rotateX(12deg) scale(.96)', filter: 'blur(12px)'}, {opacity: 1, transform: 'none', filter: 'blur(0)'}], d: .85, e: EASE.soft},
    lead:  {kf: [{opacity: 0, filter: 'blur(8px)'}, {opacity: 1, filter: 'blur(0)'}], d: .4, e: EASE.smooth},
    chip:  {kf: [{opacity: 0, transform: 'translateY(30px)', filter: 'blur(10px)'}, {opacity: 1, transform: 'none', filter: 'blur(0)'}], d: .6, e: EASE.soft},
    leave: {kf: [{opacity: 1, filter: 'blur(0)', transform: 'none'}, {opacity: 0, filter: 'blur(12px)', transform: 'translateY(-30px) scale(.9)'}], d: .5, e: EASE.out},
    punch: {kf: [{transform: 'scale(1)', filter: 'brightness(1)'}, {transform: 'scale(1.07)', filter: 'brightness(1.6)', offset: .4}, {transform: 'scale(1)', filter: 'brightness(1)'}], d: .7, e: EASE.calm},
    shake: {kf: [{transform: 'translateX(0)'}, {transform: 'translateX(-14px)'}, {transform: 'translateX(12px)'}, {transform: 'translateX(-8px)'}, {transform: 'translateX(0)'}], d: .6, e: 'ease-in-out'},
    move:  {d: .8, e: EASE.calm},
    tilt:  {d: .9, e: EASE.calm},
    snap:  {d: .8, e: EASE.soft},
    swap:  {d: .5, e: EASE.smooth},
    draw:  {d: .9, e: EASE.inout},
    stroke: {d: .28},
    stagger: .14,
    fall:  {d: 1.3},                 // a row of dominoes from the first push to the last one lying flat
    float: {a: 7, p: 3.0},
    glow:  {kf: [{opacity: 0, transform: 'scale(.6)', filter: 'blur(20px)'}, {opacity: 1, transform: 'none', filter: 'blur(0)'}], d: .9, e: EASE.soft},
  },
  sound: {hit: ['softswish', -22], cross: ['swipe', -24], key: ['softswish', -21]},

  frame(t0, t1) {
    const L = t1 - t0 + .04, fi = Math.min(.5, L * .4) / L, fo = Math.min(.4, L * .35) / L;
    A(VB, [{opacity: 0}, {opacity: 1, offset: fi}, {opacity: 1, offset: 1 - fo}, {opacity: 0}], t0 - .04, L, {f: 'none'});   // the speaker blurs
    const root = div('inset:0;overflow:hidden', SC); root.className = 'g-root';
    div('inset:0;background:radial-gradient(ellipse 80% 60% at 50% 45%,rgba(6,10,22,.5),rgba(5,7,13,.78))', root);
    A(root, [{opacity: 0, filter: 'blur(22px)', transform: 'scale(1.05)'}, {opacity: 1, filter: 'blur(0)', transform: 'scale(1)'}], t0 - .04, .6, {e: EASE.smooth});
    A(root, [{opacity: 1, filter: 'blur(0)', transform: 'scale(1)'}, {opacity: 0, filter: 'blur(18px)', transform: 'scale(.97)'}], t1 - .4, .4, {e: EASE.out, f: 'forwards'});
    const stg = div('inset:0;perspective:1600px', root), cam = div('inset:0;transform-style:preserve-3d;transform-origin:50% 50%', stg);
    A(cam, [{transform: 'rotateX(4deg) rotateY(-4deg) translateZ(-60px)'}, {transform: 'rotateX(-1.6deg) rotateY(2deg) translateZ(0)'}], t0, t1 - t0, {e: EASE.inout});
    const stage = div('left:40px;top:600px;width:1000px;height:700px', cam);
    sfx('whoosh', t0 - .1, -19);
    return {root, stage, cam};
  },
  /* every grapheme flips up in 3D with a spring; the key word ignites white → light blue */
  text(F, T, lead, key) {
    const el = div('', F.cam); el.className = 'g-text';
    const line = (txt, cls, t, big) => {
      const L = div('', el); L.className = 'g-line'; L.style.position = 'relative';
      const c = document.createElement('span'); c.className = cls; L.appendChild(c);
      graphemes(txt).forEach((ch, i) => {
        const g = document.createElement('span'); g.className = 'g-g'; g.textContent = ch === ' ' ? '\u00A0' : ch; c.appendChild(g);   // a space in an inline-block collapses, keep it
        const ti = t + i * (big ? .032 : .016);
        A(g, [{opacity: 0, transform: `translateY(${big ? 55 : 40}%) rotateX(${big ? -85 : -60}deg) scale(${big ? 1.15 : 1.05})`, filter: 'blur(10px)'},
          {opacity: 1, transform: 'none', filter: 'blur(0)'}], ti, big ? .48 : .36, {e: 'cubic-bezier(.22,1.35,.36,1)'});
        if (big) A(g, [{color: '#FFFFFF'}, {color: '#8FD3FF'}], ti + .16, .35, {e: 'ease-out'});
      });
      FITS.push(() => { const w = c.offsetWidth; if (w > 900) L.style.transform = `scale(${900 / w})`; });
    };
    if (lead) line(lead, 'g-s', T.t0 + .15, false);
    if (key) { line(key, 'g-k', T.hit, true); sfx('softswish', T.hit - .05, -21); }
    return el;
  },
});
