/* =====================================================================
   STYLE · glass-overlay (+ glass-overlay-big) — the glass style as small widgets over the speaker
   (Friend's skill talking-head-overlay). Same look as `glass` (styles/glass.js), only these change:
   1 frame    the speaker is NOT blurred or darkened; the picture is a dark see-through card above the head (overlay.js),
              no backdrop blur (the skill says so)
   5 words    inside the card, every letter flips up in 3D, the key word lights up light blue; a slow push-in, never a cut
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
.ov-gsl{font-family:"CardSans";font-size:52px;line-height:1.25;color:#FFFFFF;text-shadow:0 4px 22px rgba(0,0,0,.65)}
.ov-gsk{font-family:"KeySans";font-size:112px;line-height:1.12;letter-spacing:-1px;color:#8FD3FF;text-shadow:0 0 34px rgba(143,211,255,.55),0 6px 24px rgba(0,0,0,.55)}`,
  smallCls: 'g-root',
  /* the subtitle under the chin (small forms), letters flipping up like the full-screen glass style */
  sub(F, T, lead, key) {
    const [l, k] = ovSub(T, [['', 'ov-gsl'], ['', 'ov-gsk']]);
    if (lead) GLASS_FLIP(l, lead, T.t0 + .15, false);
    if (key) { GLASS_FLIP(k, key, T.hit, true); sfx('softswish', T.hit - .05, -21); }
  },
  text(F, T, lead, key) {
    const line = (txt, cls, size, t, big) => GLASS_FLIP(ovLine(F, '', cls, size), txt, t, big);
    if (lead) line(lead, 'ov-glead', F.big ? 38 : 34, T.t0 + .15, false);
    if (key) { line(key, 'ov-gkey', F.big ? 62 : 56, T.hit, true); sfx('softswish', T.hit - .05, -21); }
  },
  /* talking-head-overlay: a slow push to 1.05 in about 1.2 s on a strong line, back in about 1 s (never a cut) */
  camera(T) {
    const z = 1.05, Z = `translate(${540 * (1 - z)}px,${700 * (1 - z)}px) scale(${z})`, D = T.t1 + .9 - (T.hit - .3);
    A(V, [{transform: 'none'}, {transform: Z, offset: 1.2 / D}, {transform: Z, offset: 1 - 1 / D}, {transform: 'none'}], T.hit - .3, D, {e: 'ease-in-out', f: 'none'});
  },
};
OVERLAY('glass-overlay', 'glass', GLASS_OV);
OVERLAY('glass-overlay-big', 'glass', {...GLASS_OV, name: 'กระจก แบบ overlay (ใหญ่ ย่อคนพูด)', size: 'big'});
