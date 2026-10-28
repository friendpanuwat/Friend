/* ===================== SPLIT — the split-screen layout, the grainy page, the headline (the subtitle) =====================
   Top: the graphics. Under them: the two-line headline whose words light up as they are said. Bottom: the speaker in a
   rounded panel, the head breaking out over its top edge. Between panel stretches the speaker is full screen — a straight cut. */
const THEMES = {
  beige: {page: '#F1EADF', dots: 'rgba(60,45,30,.10)', ink: '#1C1814', muted: '#8A7D6C', accent: '#A9824F', onAccent: '#FFFFFF', card: '#FFFDF9', line: 'rgba(28,24,20,.10)', soft: '#E9DFCF'},
  white: {page: '#F6F7F9', dots: 'rgba(20,30,50,.08)', ink: '#0F1115', muted: '#7C8390', accent: '#1F8FFF', onAccent: '#FFFFFF', card: '#FFFFFF', line: 'rgba(15,17,21,.09)', soft: '#EEF1F5'},
};
let THEME = THEMES.white; const SPLIT_THEME = () => THEME;
const theme = name => { THEME = THEMES[name]; document.documentElement.style.background = THEME.page; document.body.style.background = 'transparent'; };   // body clear, so PAGE (z -1) shows
const SPLIT = {x: 40, y: 1310, w: 1000, h: 570, r: 44, k: 1.0, capY: 990, top: 975, uiTop: 245, uiH: 700, ui: 1.0, pop: 190};   // graphics on top (big), the headline under them, just above the head   // the face stays above SAFE.b; the panel runs on down behind the app's caption   // pop: how far the head may rise above the panel
const SPLITS = [];
/* split(t0, t1) — the split-screen layout from t0 to t1 (the video glides into the panel and back out) */
const split = (t0, t1) => { SPLITS.push([t0, t1]); MATTES.push([t0 - .3, t1 + .3]); };   // mattes: the head breaks out over the panel's top edge
function splitAt(t) { return SPLITS.some(([a, b]) => t >= a - .001 && t < b) ? 1 : 0; }   // a straight cut, no glide
const inSplit = t => SPLITS.some(([a, b]) => t >= a && t < b);
/* exit(el, t1) — fade out, except on a cut between full screen and the panel: the cut takes everything off at once */
const exit = (el, t1, d = .2) => FITS.push(() => { if (!(MODE === 'split' && inSplit(t1 - .01) !== inSplit(t1 + .01))) fadeOut(el, t1, d); });

/* the video sits in wrappers so the panel can clip it in screen coordinates */
const VW = div('inset:0;overflow:hidden', document.body), PW = div('inset:0;overflow:hidden;pointer-events:none', document.body);
{ const ed = document.getElementById('ed'), v = document.getElementById('v'), pm = document.getElementById('pm');
  document.body.insertBefore(VW, ed); VW.appendChild(ed); VW.appendChild(v); document.body.insertBefore(PW, pm); PW.appendChild(pm); }
/* the page behind the panel: a soft mesh of light and shade with fine film grain, drifting slowly.
   MESH colours are stock tones; scripts/recolor.py swaps them for tones pulled from the clip */
const MESH = {deep: '#4E6E8E', mid: '#8FA8C2', light: '#DDE8F2'};
const PAGE = div('inset:0;z-index:-1;overflow:hidden', document.body);
const noise = (rgb, lo) => `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="260" height="260"><filter id="n" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="3" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 ${rgb[0]} 0 0 0 0 ${rgb[1]} 0 0 0 0 ${rgb[2]} ${lo ? -3.2 : 3.2} 0 0 0 ${lo ? 1.25 : -1.95}"/></filter><rect width="260" height="260" filter="url(#n)"/></svg>`)}")`;
const hexRGB = h => [1, 3, 5].map(i => (parseInt(h.slice(i, i + 2), 16) / 255).toFixed(3));
const GRAIN = div(`inset:0;opacity:.5;background:${noise(hexRGB('#DDE8F2'), false)},${noise(hexRGB('#4E6E8E'), true)}`, PAGE);   // film grain: light and deep speckles, both theme colours
HOOKS.push(t => {
  const L = splitAt(t), v = document.getElementById('v'), pm = document.getElementById('pm'), ed = document.getElementById('ed');
  { const w = (a, b, k) => a + Math.sin(t * k + b) * 6;   // blob centres wander a few percent
    PAGE.style.background = `radial-gradient(60% 42% at ${w(12, 0, .21)}% ${w(28, 1, .17)}%,${MESH.deep} 0%,transparent 72%),
      radial-gradient(50% 30% at ${w(88, 2, .19)}% ${w(6, 3, .23)}%,${MESH.deep} 0%,transparent 70%),
      radial-gradient(80% 55% at ${w(74, 4, .15)}% ${w(50, 5, .2)}%,${MESH.light} 0%,transparent 75%),
      radial-gradient(75% 45% at ${w(34, 6, .18)}% ${w(78, 7, .16)}%,${MESH.light} 0%,transparent 72%),
      radial-gradient(45% 30% at ${w(96, 8, .22)}% ${w(98, 9, .14)}%,${MESH.deep} 0%,transparent 70%),${MESH.mid}`; }
  if (L <= 0) { VW.style.clipPath = PW.style.clipPath = ''; ed.style.opacity = 1; return; }
  const h = headAt(t) ?? {x: 540, y: 800, r: 150}, cam = camAt(t), [dx, dy] = driftAt(t);
  const fs = cam, ftx = h.x * (1 - cam) + dx, fty = h.y * (1 - cam) + dy;                       // full-screen framing
  const ss = SPLIT.k * cam;   // big enough to cover the panel; head centred in it as far as the frame allows
  const stx = clamp(SPLIT.x + SPLIT.w / 2 - h.x * ss, SPLIT.x + SPLIT.w - 1080 * ss, SPLIT.x), sty = Math.max(SPLIT.y - 100 - (h.y - 1.25 * h.r) * ss, SPLIT.y + SPLIT.h - 1920 * ss);   // the top of the head sits just above the panel
  const s = lerp(fs, ss, L), tx = lerp(ftx, stx, L), ty = lerp(fty, sty, L);
  for (const el of [v, pm]) { el.style.transformOrigin = '0 0'; el.style.transform = `translate(${tx}px,${ty}px) scale(${s})`; }
  ed.style.opacity = 1 - L;
  const ins = `inset(${SPLIT.y * L}px ${(1080 - SPLIT.x - SPLIT.w) * L}px ${(1920 - SPLIT.y - SPLIT.h) * L}px ${SPLIT.x * L}px round ${SPLIT.r * L}px)`;
  VW.style.clipPath = ins;
  PW.style.clipPath = `inset(${(SPLIT.y - SPLIT.pop) * L}px ${(1080 - SPLIT.x - SPLIT.w) * L}px ${(1920 - SPLIT.y - SPLIT.h) * L}px ${SPLIT.x * L}px round ${SPLIT.r * L}px)`;   // the cut-out speaker may rise above the panel: the head breaks the frame
});

/* ---------- headline: line 1 ink, line 2 in the accent box; words dim until they are said ---------- */
/* headline(t0, t1, line1, line2) — lines are [[word, t, {accent}], ...]; accent: the slanted face */
function headline(t0, t1, l1, l2, {size = 66, onVideo = false} = {}) {   // onVideo: over the footage (overlay) — white + a soft shadow
  const el = div(`left:${SAFE.l}px;top:${SPLIT.top}px;width:${SAFE.w}px;text-align:center`, G); window_(el, t0, t1);
  const sh = `text-shadow:${SUB_SHADOW}`;
  const word = (parent, [w, t], color) => { const s = div(`position:relative;display:inline-block;margin:0 .12em;white-space:nowrap;font-family:Sans;font-weight:700;color:${color};${sh}`, parent, w);
    A(s, [{opacity: .22}, {opacity: 1}], t - .1, .08, {e: 'linear'}); return s; };   // each word snaps clear just as it is said
  const a = div(`position:relative;font-size:${size}px;line-height:1.2;white-space:nowrap`, el); l1.forEach(w => word(a, w, onVideo ? TXT.video : TXT.page));
  const b = div(`position:relative;margin-top:4px;font-size:${size * 1.1}px;line-height:1.2;white-space:nowrap`, el); l2.forEach(w => word(b, w, onVideo ? TXT.videoKey : TXT.pageKey));
  A(el, [{opacity: 0, transform: 'translateY(-16px)'}, {opacity: 1, transform: 'none'}], t0, .35, {e: OUTX});
  exit(el, t1);
  FITS.push(() => { const k = Math.min(1, SAFE.w / el.scrollWidth); if (k < 1) { el.style.transformOrigin = '50% 0'; el.style.transform = `scale(${k})`; } });
  guard(el, t0 + .4, t1, 'headline', {face: false});
  return el;
}

/* ---------- the UI area: a surface in design px (x 60–1020 → safe area; y 0–870 → screen 470–1230) ---------- */
function ui(t0, t1) {
  const s = div(`left:0;top:${SPLIT.uiTop}px;width:1080px;height:${SPLIT.uiH}px;transform-origin:540px 0;transform:translateX(-60px) scale(${SPLIT.ui})`, Q);   // keep content in design x 120–960 (→ safe x 81–879)
  window_(s, t0, t1); exit(s, t1); return s;
}
/* a UI card: white, rounded, soft shadow, rises in */
function uicard(s, x, y, w, h, t, {r = 30, fill} = {}) {
  const el = div(`left:${x}px;top:${y}px;width:${w}px;height:${h}px;border-radius:${r}px;background:${fill ?? THEME.card};box-shadow:0 18px 50px rgba(20,15,10,.10),0 2px 6px rgba(20,15,10,.06);border:1px solid ${THEME.line}`, s);
  A(el, [{opacity: 0, transform: 'translateY(40px) scale(.97)'}, {opacity: 1, transform: 'none'}], t, .6, {e: OUTX}); return el;
}
/* text inside UI */
const uitext = (p, x, y, s, t, {size = 40, weight = 600, color, w} = {}) => { const el = div(`left:${x}px;top:${y}px;${w ? `width:${w}px;` : ''}white-space:nowrap;font-family:Sans;font-weight:${weight};font-size:${size}px;line-height:1.3;color:${color ?? THEME.ink}`, p, s);
  A(el, [{opacity: 0, transform: 'translateY(12px)'}, {opacity: 1, transform: 'none'}], t, .35, {e: OUTX}); return el; };
/* a chat bubble (text only from what was said) */
function bubble(p, x, y, s, t, {me = false, size = 40, w} = {}) {
  const el = div(`left:${x}px;top:${y}px;${w ? `width:${w}px;` : ''}padding:18px 28px 22px;border-radius:30px;${me ? 'border-bottom-right-radius:8px' : 'border-bottom-left-radius:8px'};background:${me ? THEME.accent : THEME.soft};color:${me ? THEME.onAccent : THEME.ink};font-family:Sans;font-weight:500;font-size:${size}px;line-height:1.3;white-space:nowrap`, p, s);
  A(el, [{opacity: 0, transform: 'translateY(16px) scale(.9)'}, {opacity: 1, transform: 'none'}], t, .4, {e: OUTX}); el.style.transformOrigin = me ? '100% 100%' : '0 100%'; return el;
}
/* a pointer that glides through points [[x, y, t], ...] and taps at the times in `taps` */
function pointer(p, pts, taps = []) {
  const el = div('left:0;top:0;width:60px;height:60px;filter:drop-shadow(0 6px 10px rgba(0,0,0,.25))', p,
    `<svg viewBox="0 0 24 24" width="60" height="60"><path d="M5 3 L19 12 L12.5 13.5 L16 20.5 L13.2 21.8 L9.8 14.8 L5 19 Z" fill="${THEME.ink}" stroke="#fff" stroke-width="1.4" stroke-linejoin="round"/></svg>`);
  const kf = pts.map(([x, y, t]) => ({transform: `translate(${x}px,${y}px)`, offset: (t - pts[0][2]) / (pts[pts.length - 1][2] - pts[0][2])}));
  A(el, kf, pts[0][2], pts[pts.length - 1][2] - pts[0][2], {e: 'cubic-bezier(.45,0,.2,1)'});
  A(el, [{opacity: 0}, {opacity: 1}], pts[0][2], .2);
  for (const t of taps) A(el.firstChild, [{transform: 'scale(1)'}, {transform: 'scale(.82)'}, {transform: 'scale(1)'}], t, .25, {e: 'ease-out', f: 'none'});
  return el;
}
/* a check row: a box that ticks when tapped, a line of text */
function checkrow(p, x, y, w, s, t, tTick, {size = 52, color} = {}) {
  const row = uicard(p, x, y, w, 130, t, {r: 24});
  const bx = div(`left:30px;top:38px;width:54px;height:54px;border-radius:12px;border:3px solid ${THEME.line}`, row);
  A(bx, [{background: 'transparent', borderColor: THEME.muted}, {background: color ?? THEME.accent, borderColor: color ?? THEME.accent}], tTick, .2, {e: 'linear'});
  icon(bx, 'check', 21, 21, 30, tTick + .05, {color: '#fff', width: 12, dur: .3});
  uitext(row, 112, 30, s, t + .1, {size});
  return row;
}

/* ---------- full-screen face moments ---------- */
/* bigWord(t0, t1, word, {behind, size}) — one slanted word over the chest (or behind the head) when the speaker is full screen */
function bigWord(t0, t1, w, {behind = false, size = 170, color = '#FFFFFF'} = {}) {
  const f = faceAt(t0, t1)[0], h = hd(t0);
  const top = behind ? h.y - h.r * 1.25 - size * .7 : SAFE.b - OVER.sub - 40;   // in front: down by the hands, where the subtitles sit
  const el = div(`left:${SAFE.l}px;top:${top}px;width:${SAFE.w}px;text-align:center;white-space:nowrap;font-family:Accent;font-style:italic;font-weight:700;font-size:${size}px;line-height:1.1;color:${color};text-shadow:${SUB_SHADOW}`, behind ? B : G, w);
  window_(el, t0, t1);
  A(el, [{opacity: 0, transform: 'translateY(30px) scale(.96)', filter: 'blur(8px)'}, {opacity: 1, transform: 'none', filter: 'blur(0)'}], t0, .25, {e: OUTX});
  exit(el, t1);
  if (behind) MATTES.push([t0, t1]); else guard(el, t0, t1, 'bigWord');
  capOff(t0, t1); return el;
}
