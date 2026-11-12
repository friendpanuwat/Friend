/* =====================================================================
   STYLE · card — the look of Friend's clip 1 (talking-head-editorial): hard cut to a full-screen card.
   The 7-item form:
   1 frame    hard cut to a full-screen card; the picture sits in the upper middle, words below (top 1350)
   2 surface  white rounded cards with soft shadow (dark gradient cards on the glow background); icon tiles
   3 drawing  thick solid lines, solid fills, nothing glows
   4 colours  backgrounds glow / cream / white in turn, navy ink, ONE lime accent, red only for "no"
   5 words    small lead line (Mitr) + big key word: lime on dark, lime box on light
   6 motion   springy: things pop in with a little overshoot and a turn, panels rise, hits punch
   7 sound    whoosh on the cut, pop, thud on the hit (kept in window.SFX; the test clips are silent)
   ===================================================================== */
STYLE('card', {
  name: 'การ์ดเต็มจอ (แบบคลิปที่ 1)',
  css: `
.c-card{opacity:0}
.c-light{--ink:#14213D;--lw:15;--sd:#14213D;--fl:#FFFFFF;--fl-line:#14213D;--lw-fl:12;--ac:#DDFF45;--ac-line:#14213D;--lw-ac:12;
  --tr:rgba(20,33,61,.12);--neg:#E5484D;--slot-line:rgba(20,33,61,.35);--ico-w:2.2;--tile-r:.28;--box-r:.26;--text:#14213D}
.c-dark{--ink:#FFFFFF;--lw:15;--sd:#FFFFFF;--fl:#FFFFFF;--fl-line:#FFFFFF;--lw-fl:0;--fl-edge:#14213D;--ac:#DDFF45;--ac-line:#DDFF45;--lw-ac:0;
  --tr:rgba(255,255,255,.14);--neg:#FF5A5F;--slot-line:rgba(255,255,255,.4);--ico-w:2.2;--tile-r:.28;--box-r:.26;--text:#FFFFFF}
.c-light{--halo:rgba(20,33,61,.09);--num:#14213D}.c-dark .u-num{color:#DDFF45}.c-dark{--halo:rgba(221,255,69,.42)}
.c-dark .u-chip.u-main{background:#FFFFFF;color:#050505}.c-light .u-chip.u-main{background:#14213D;color:#FFFFFF}
.c-cream{background:#F2EDE2}.c-white{background:#FFFFFF}.c-glow{background:#050505}
.u-panel{border-radius:40px}
.c-light .u-panel{background:#FFFFFF;box-shadow:0 26px 60px rgba(20,33,61,.16),0 2px 0 rgba(20,33,61,.04)}
.c-dark .u-panel{background:linear-gradient(160deg,#1E2433,#0D111B);border:1.5px solid rgba(255,255,255,.08);box-shadow:0 30px 70px rgba(0,0,0,.5)}
.u-badge{box-shadow:0 16px 34px rgba(0,0,0,.18)}
.c-light .u-main{background:#14213D;color:#FFFFFF}
.c-dark .u-main{background:#FFFFFF;color:#050505}
.u-acc{background:#DDFF45;color:#0A0A0A}
.c-light .u-soft{background:#E6E8EE;color:#7C8597;box-shadow:none}
.c-dark .u-soft{background:#262B38;color:#8A93A6;box-shadow:none}
.u-ok{background:#FFFFFF;color:#14213D}
.c-light .u-ok{background:#14213D;color:#FFFFFF}
.u-track{background:var(--tr)}
.u-track-on{background:#DDFF45}
.u-knob{background:#FFFFFF;box-shadow:0 8px 20px rgba(0,0,0,.22)}
.u-knob-ico{color:#14213D}
.u-bar{background:var(--tr)}
.u-bar-on{background:#DDFF45}
.c-light .u-box{border:6px solid #14213D}
.c-dark .u-box{border:6px solid rgba(255,255,255,.85)}
.u-label{font-family:"CardSans";color:var(--text)}
.c-light .u-dotc{stroke:#14213D;stroke-width:6}
.c-text{position:absolute;left:140px;width:800px;top:1350px;display:flex;flex-direction:column;align-items:center;row-gap:26px}
.c-text span{display:inline-block;white-space:nowrap}
.c-speaker{text-shadow:0 3px 18px rgba(0,0,0,.75)}
.c-lead{font-family:"Lead";font-size:54px;line-height:1.2}
.c-key{font-family:"KeySans";font-size:146px;line-height:1.12;letter-spacing:-2px;color:#DDFF45}
.c-hl{font-family:"KeySans";font-size:116px;line-height:1.1;letter-spacing:-2px;color:#0A0A0A;background:#DDFF45;padding:0 .16em .04em;border-radius:12px}
`,
  motion: {
    pop:   {kf: [{opacity: 0, transform: 'scale(0) rotate(-14deg)'}, {opacity: 1, transform: 'none'}], d: .5, e: EASE.bounce},
    drop:  {kf: [{opacity: 0, transform: 'translateY(-120px) scale(.8)'}, {opacity: 1, transform: 'none'}], d: .45, e: EASE.bounce},
    rise:  {kf: [{opacity: 0, transform: 'translateY(140px) scale(.96)', filter: 'blur(10px)'}, {opacity: 1, transform: 'none', filter: 'blur(0)'}], d: .55, e: EASE.spring},
    lead:  {kf: [{opacity: 0, transform: 'translateY(16px)', filter: 'blur(7px)'}, {opacity: 1, transform: 'none', filter: 'blur(0)'}], d: .2, e: EASE.smooth},
    key:   {kf: [{opacity: 0, transform: 'scale(1.16)', filter: 'blur(14px)'}, {opacity: 1, transform: 'scale(1)', filter: 'blur(0)'}], d: .26, e: EASE.smooth},
    chip:  {kf: [{opacity: 0, transform: 'translateY(40px) scale(.92)', filter: 'blur(8px)'}, {opacity: 1, transform: 'none', filter: 'blur(0)'}], d: .32, e: EASE.spring},
    leave: {kf: [{opacity: 1, transform: 'none'}, {opacity: 0, transform: 'scale(.4) rotate(10deg)'}], d: .3, e: EASE.smooth},
    punch: {kf: [{transform: 'scale(1)'}, {transform: 'scale(1.14)', offset: .35}, {transform: 'scale(1)'}], d: .42, e: EASE.smooth},
    shake: {kf: [{transform: 'rotate(0)'}, {transform: 'rotate(-9deg)'}, {transform: 'rotate(9deg)'}, {transform: 'rotate(-6deg)'}, {transform: 'rotate(4deg)'}, {transform: 'rotate(0)'}], d: .55, e: 'ease-in-out'},
    move:  {d: .5, e: EASE.inout},
    tilt:  {d: .6, e: EASE.spring},
    snap:  {d: .45, e: EASE.spring},
    swap:  {d: .3, e: EASE.smooth},
    draw:  {d: .7, e: EASE.inout},
    stroke: {d: .18},
    stagger: .12,
    fall:  {d: 1.0},                 // a row of dominoes from the first push to the last one lying flat
    float: {a: 8, p: 2.4},
    glow:  {kf: [{opacity: 0, transform: 'scale(.5)'}, {opacity: 1, transform: 'none'}], d: .7, e: EASE.smooth},
  },
  sound: {cut: ['whoosh', -24], pop: ['pop', -25], drop: ['pop', -25], chip: ['pop_lo', -27], hit: ['thud', -16], cross: ['stamp', -21], ok: ['pop', -24], key: ['softswish', -22]},

  /* backgrounds take turns (dark cards are always the glow kind, Friend 2026-11-03) */
  frame(t0, t1, {index}) {
    const bg = ['glow', 'cream', 'white'][index % 3], dark = bg === 'glow';
    const root = div('inset:0;overflow:hidden', SC); root.className = `c-card c-${bg} ${dark ? 'c-dark' : 'c-light'}`;
    A(root, [{opacity: 1}, {opacity: 1}], t0, t1 - t0, {f: 'none'});          // hard cut in and out
    if (dark) {
      const g1 = div('left:-260px;top:-160px;width:1100px;height:1100px;border-radius:50%;background:radial-gradient(circle,#2F6BFF55,transparent 62%);filter:blur(40px)', root);
      const g2 = div('left:240px;top:1000px;width:1000px;height:1000px;border-radius:50%;background:radial-gradient(circle,#7A5CFF33,transparent 60%);filter:blur(50px)', root);
      A(g1, [{transform: 'translate(0,0)'}, {transform: 'translate(180px,200px)'}], t0, t1 - t0);
      A(g2, [{transform: 'translate(0,0)'}, {transform: 'translate(-160px,-240px)'}], t0, t1 - t0);
      div('inset:0;background-image:radial-gradient(rgba(255,255,255,.09) 1.6px,transparent 1.8px);background-size:54px 54px;-webkit-mask-image:radial-gradient(ellipse 70% 55% at 50% 40%,#000,transparent 85%)', root);
    }
    const box = div('left:40px;top:450px;width:1000px;height:700px;transform-origin:50% 50%', root);
    A(box, [{transform: 'scale(1.035)'}, {transform: 'none'}], t0, .45, {e: EASE.smooth});   // the card settles after the cut
    const stage = div('left:0;top:0;width:1000px;height:700px', box);
    sfx('whoosh', t0, -24);
    return {root, stage, dark};
  },
  /* a real clip, between scenes: the subtitle on the speaker in the dark card's words (core.js clipCaption) */
  speakerFrame() { const root = div('inset:0', SC); root.className = 'c-dark c-speaker'; return {root, dark: true}; },
  text(F, T, lead, key) {
    const el = div('', F.root); el.className = 'c-text';
    const row = (txt, cls, m, t) => {                    // row = fit-to-width box, span = the moving word
      const r = document.createElement('div'); r.style.position = 'relative'; el.appendChild(r);
      const s = document.createElement('span'); s.className = cls; s.textContent = txt; r.appendChild(s);
      A(s, m.kf, t, m.d, {e: m.e});
      FITS.push(() => { const w = s.offsetWidth; if (w > 800) r.style.transform = `scale(${800 / w})`; });
      return s;
    };
    if (lead) row(lead, 'c-lead', this.motion.lead, T.t0 + .15).style.color = 'var(--text)';
    if (key) { row(key, F.dark ? 'c-key' : 'c-hl', this.motion.key, T.hit); sfx('softswish', T.hit - .04, -22); }
    return el;
  },
});
