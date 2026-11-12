/* =====================================================================
   STYLE · glass-overlay (+ glass-overlay-big) — the glass style as small widgets over the speaker
   (Friend's skill talking-head-overlay). Same look as `glass` (styles/glass.js), only these change:
   1 frame    the speaker is NOT blurred or darkened; the picture is a dark see-through card above the head (overlay.js),
              no backdrop blur (the skill says so)
   5 words    inside the card, every letter flips up in 3D, the key word lights up light blue; a slow push-in, never a cut
              (a real clip: the slow camera of core.js); the subtitle in the skill's three sizes (Sriracha / white Mitr / light blue)
   ===================================================================== */
/* every letter flips up in 3D; a big line lights white → light blue */
function GLASS_FLIP(s, txt, t, big) {
  graphemes(txt).forEach((ch, i) => {
    const g = document.createElement('span'); g.className = 'g-g'; g.textContent = ch === ' ' ? '\u00A0' : ch; s.appendChild(g);
    const ti = t + i * (big ? .03 : .016);
    A(g, [{opacity: 0, transform: `translateY(${big ? 50 : 36}%) rotateX(${big ? -85 : -60}deg)`, filter: 'blur(8px)'}, {opacity: 1, transform: 'none', filter: 'blur(0)'}],
      ti, big ? .45 : .34, {e: 'cubic-bezier(.22,1.35,.36,1)'});
    if (big) A(g, [{color: '#FFFFFF'}, {color: '#8FD3FF'}], ti + .16, .35, {e: 'ease-out'});
  });
  return s;
}
const GLASS_OV = {
  name: 'กระจก แบบ overlay',
  card: () => ({cls: 'g-root ov-mini', dark: true}),
  css: `
.ov-mini{background:rgba(10,16,30,.74);border:1.5px solid rgba(255,255,255,.16);box-shadow:0 20px 50px rgba(0,0,0,.45),inset 0 1px 0 rgba(255,255,255,.12)}
.ov-mini .ov-text>div{perspective:700px}
.ov-glead{font-family:"Hand";line-height:1.25;color:#FFFFFF}
.ov-gkey{font-family:"KeySans";line-height:1.12;letter-spacing:-1px;color:#8FD3FF;text-shadow:0 0 26px rgba(143,211,255,.55)}
.ov-sub>div{perspective:900px}
.ov-gsl{font-family:"Hand";font-size:60px;line-height:1.25;color:#FFFFFF;text-shadow:0 4px 22px rgba(0,0,0,.65)}
.ov-gsm{font-family:"CardSans";font-size:90px;line-height:1.16;color:#FFFFFF;text-shadow:0 4px 22px rgba(0,0,0,.65)}
.ov-gsk{font-family:"KeySans";font-size:136px;line-height:1.12;letter-spacing:-1px;color:#8FD3FF;text-shadow:0 0 34px rgba(143,211,255,.55),0 6px 24px rgba(0,0,0,.55)}`,
  smallCls: 'g-root',
  /* the subtitle under the chin (small forms), letters flipping up like the full-screen glass style */
  /* talking-head-overlay's three sizes: the small words in Sriracha (s 60), the big word white Mitr (m 90), and only the 1–2 words
     per sentence that matter most in light blue (k 136, the AI's accent words); a block leaves blurring upwards in 0.16 s */
  sub(F, T, lead, key) {
    const acc = !T.clip || T.acc;
    const [l, k] = ovSub(T, [['', 'ov-gsl'], ['', acc ? 'ov-gsk' : 'ov-gsm']]);
    if (lead) GLASS_FLIP(l, lead, T.t0 + .15, false);
    if (key) { GLASS_FLIP(k, key, T.hit, acc); if (acc) sfx('softswish', T.hit - .05, -21); }
    if (T.cut) A(l.parentNode.parentNode, [{opacity: 1, filter: 'blur(0)', translate: '0 0'}, {opacity: 0, filter: 'blur(16px)', translate: '0 -50px'}],
      T.cut[1] - .18, .16, {e: 'cubic-bezier(.5,0,.9,.5)', f: 'forwards'});
  },
  text(F, T, lead, key) {
    const line = (txt, cls, size, t, big) => GLASS_FLIP(ovLine(F, '', cls, size), txt, t, big);
    if (lead) line(lead, 'ov-glead', F.big ? 38 : 34, T.t0 + .15, false);
    if (key) { line(key, 'ov-gkey', F.big ? 62 : 56, T.hit, true); sfx('softswish', T.hit - .05, -21); }
  },
  /* talking-head-overlay: a slow push to 1.05 in about 1.2 s on a strong line, back in about 1 s (never a cut) */
  camera(T) {
    const z = 1.05, Z = `translate(${540 * (1 - z)}px,${700 * (1 - z)}px) scale(${z})`, D = T.t1 + .9 - (T.hit - .3);
    const oi = Math.min(1.2 / D, .5), oo = Math.max(1 - 1 / D, oi);   // a key word near a short scene's end: in and out meet (the offsets must not cross, a real clip)
    A(V, [{transform: 'none'}, {transform: Z, offset: oi}, {transform: Z, offset: oo}, {transform: 'none'}], T.hit - .3, D, {e: 'ease-in-out', f: 'none'});
  },
};
OVERLAY('glass-overlay', 'glass', GLASS_OV);
OVERLAY('glass-overlay-big', 'glass', {...GLASS_OV, name: 'กระจก แบบ overlay (ใหญ่ ย่อคนพูด)', size: 'big'});
