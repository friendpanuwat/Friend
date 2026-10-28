/* ===================== KIT — motion basics =====================
   Easing curves, the drawn-on line icons (icon / stroke), paper texture and other small helpers every other file uses.
   (Colours written here are stock tones: scripts/recolor.py paints the whole scene in the theme.json colours.) */
const PAPER = '#F3ECE0', BEIGE = '#E7DBC7', SAND = '#D6C3A3', INK = '#1C1814', MUTED = '#857867', TAN = '#A9824F', LINE = 'rgba(28,24,20,.16)';
const OUTX = 'cubic-bezier(.16,1,.3,1)', IOX = 'cubic-bezier(.83,0,.17,1)', OUTQ = 'cubic-bezier(.25,1,.5,1)', ANTIC = 'cubic-bezier(.6,-.28,.74,.05)';
const PAPER_TEX = `url("data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="320" height="320"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".75" numOctaves="3" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 .35 0 0 0 0 .28 0 0 0 0 .2 0 0 0 .07 0"/></filter><rect width="320" height="320" filter="url(#n)"/></svg>')}")`;
const fadeOut = (el, t1, d = .25) => A(el, [{opacity: 1}, {opacity: 0}], t1 - d, d, {e: EXIT, f: 'forwards'});
const mblur = (el, a, b, axis = 'x') => HOOKS.push(t => { el.style.filter = t >= a && t < b ? `url(#mb${axis})` : ''; });

/* ---------- type ---------- */
/* reveal(c, x, y, text, t, o) — words rise out of masks one after another while their tracking closes in (the AE classic).
   o: size, weight, color, align ('left' | 'center' | 'right'), w (box width), stagger, track, lh */
function reveal(c, x, y, s, t, {size = 120, weight = 600, color = INK, align = 'left', w = 960, stagger = .07, track = -.015, lh = 1.12, d = .9} = {}) {
  const box = div(`left:${align === 'center' ? x - w / 2 : align === 'right' ? x - w : x}px;top:${y}px;width:${w}px;text-align:${align};white-space:nowrap;font-family:Sans;font-weight:${weight};font-size:${size}px;line-height:${lh};color:${color}`, c);
  s.split(' ').forEach((wd, i) => {
    const m = div(`position:relative;display:inline-block;overflow:hidden;vertical-align:top;padding:.2em .03em .16em;margin:-.2em 0 -.16em${i ? ';margin-left:.22em' : ''}`, box);
    const k = div(`position:relative;display:inline-block;letter-spacing:${track}em`, m, wd);
    A(k, [{transform: 'translateY(125%)', opacity: 0, letterSpacing: `${track + .08}em`}, {transform: 'translateY(55%)', opacity: 1, offset: .2}, {transform: 'none', opacity: 1, letterSpacing: `${track}em`}], t + i * stagger, d, {e: OUTX});
  });
  FITS.push(() => { const k = Math.min(1, w / box.scrollWidth); if (k < 1) { box.style.transformOrigin = align === 'right' ? '100% 0' : align === 'center' ? '50% 0' : '0 0'; box.style.transform = `scale(${k})`; } });
  return box;
}
/* mark(el, t) — a caramel bar wipes in behind a word (a highlighter that is a shape, not a glow) */
function mark(c, x, y, w, h, t, {color = TAN, d = .5} = {}) {
  const el = div(`left:${x}px;top:${y}px;width:${w}px;height:${h}px;background:${color};transform-origin:left`, c);
  A(el, [{transform: 'scaleX(0)'}, {transform: 'none'}], t, d, {e: OUTX}); return el;
}
/* label — a short accent line draws, then a small label slides out of it */
function label(c, x, y, s, t, {color = MUTED, size = 40, line = TAN} = {}) {
  const el = div(`left:${x}px;top:${y}px;display:flex;align-items:center;gap:22px;white-space:nowrap;font-family:Sans;font-weight:500;font-size:${size}px;letter-spacing:.06em;color:${color}`, c);
  const ln = div(`position:relative;width:60px;height:4px;background:${line};transform-origin:left`, el);
  A(ln, [{transform: 'scaleX(0)'}, {transform: 'none'}], t, .55, {e: OUTX});
  const m = div('position:relative;overflow:hidden;padding:.2em 0;margin:-.2em 0', el), tx = div('position:relative', m, s);
  A(tx, [{transform: 'translateX(-105%)'}, {transform: 'none'}], t + .15, .6, {e: OUTX});
  return el;
}
function rule(c, x, y, w, t, {color = LINE, h = 2, d = .8} = {}) {
  const el = div(`left:${x}px;top:${y}px;width:${w}px;height:${h}px;background:${color};transform-origin:left`, c);
  A(el, [{transform: 'scaleX(0)'}, {transform: 'none'}], t, d, {e: OUTX}); return el;
}
const dim = (el, t, to = .28) => A(el, [{opacity: 1}, {opacity: to}], t, .45, {e: OUTQ, f: 'forwards'});

/* ---------- strokes that draw on ---------- */
const ICON = {
  tag: 'M54 14 H84 a4 4 0 0 1 4 4 V48 L48 88 a4 4 0 0 1 -6 0 L12 58 a4 4 0 0 1 0 -6 Z M70 32 m-5 0 a5 5 0 1 0 10 0 a5 5 0 1 0 -10 0',
  chat: 'M16 22 H84 a6 6 0 0 1 6 6 V62 a6 6 0 0 1 -6 6 H44 L26 82 V68 H16 a6 6 0 0 1 -6 -6 V28 a6 6 0 0 1 6 -6 Z',
  box: 'M50 12 L86 30 V70 L50 88 L14 70 V30 Z M14 30 L50 48 L86 30 M50 48 V88',
  balance: 'M50 14 V84 M30 84 H70 M18 30 H82 M18 30 L8 56 H28 Z M82 30 L72 56 H92 Z',
  cursor: 'M24 14 L78 52 L54 56 L66 82 L56 86 L44 60 L26 74 Z',
  check: 'M18 52 L40 74 L84 28', cross: 'M24 24 L76 76 M76 24 L24 76',
  down: 'M50 14 V84 M24 60 L50 86 L76 60', up: 'M50 86 V16 M24 40 L50 14 L76 40',
};
function stroke(c, d, x, y, w, h, t, {color = INK, width = 5, dur = .9, vb = '0 0 100 100'} = {}) {
  const el = div(`left:${x}px;top:${y}px;width:${w}px;height:${h}px`, c, `<svg viewBox="${vb}" width="${w}" height="${h}" style="overflow:visible"><path d="${ICON[d] ?? d}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" pathLength="1" stroke-dasharray="1 1"/></svg>`);
  A(el.querySelector('path'), [{strokeDashoffset: 1}, {strokeDashoffset: 0}], t, dur, {e: OUTQ}); return el;
}
const icon = (c, name, x, y, size, t, o = {}) => stroke(c, name, x - size / 2, y - size / 2, size, size, t, o);
/* arcs(c, x, y, r, t) — concentric arcs that draw round a point (behind a head: a quiet halo of lines) */
function arcs(c, x, y, r, t, {n = 3, gap = 46, color = PAPER, width = 4, dur = 1.2} = {}) {
  const R = r + gap * (n - 1) + 10, el = div(`left:${x - R}px;top:${y - R}px;width:${2 * R}px;height:${2 * R}px`, c,
    `<svg width="${2 * R}" height="${2 * R}" style="overflow:visible">${Array.from({length: n}, (_, i) => `<circle cx="${R}" cy="${R}" r="${r + i * gap}" fill="none" stroke="${color}" stroke-opacity="${.85 - i * .22}" stroke-width="${width}" pathLength="1" stroke-dasharray="1 1" transform="rotate(${-90 - i * 25} ${R} ${R})"/>`).join('')}</svg>`);
  el.querySelectorAll('circle').forEach((ci, i) => A(ci, [{strokeDashoffset: 1}, {strokeDashoffset: 0}], t + i * .12, dur, {e: OUTQ}));
  return el;
}

/* ---------- panels ---------- */
/* panel(c, x, y, w, h, t, o) — a paper panel that wipes open from its left edge (a mask, not a fade) */
function panel(c, x, y, w, h, t, {r = 34, fill = PAPER, shadow = true, from = 'left'} = {}) {
  const el = div(`left:${x}px;top:${y}px;width:${w}px;height:${h}px;border-radius:${r}px;background:${fill};${shadow ? 'box-shadow:0 30px 60px rgba(28,24,20,.22),0 4px 10px rgba(28,24,20,.08)' : ''}`, c);
  const k = from === 'left' ? 'inset(0 100% 0 0 round ' : from === 'up' ? 'inset(100% 0 0 0 round ' : 'inset(0 0 100% 0 round ';
  A(el, [{clipPath: k + r + 'px)', transform: 'translateY(30px)'}, {clipPath: `inset(0 0 0 0 round ${r}px)`, transform: 'none'}], t, .75, {e: OUTX});
  return el;
}
/* bars(p, rows) — abstract message rows inside a panel (no invented words) */
function bars(p, rows, {x = 36, y = 36, h = 60, gap = 22, W} = {}) {
  W = W ?? parseFloat(p.style.width) - 2 * x;
  return rows.map(([from, w, t], i) => { const me = from === 'me';
    const b = div(`left:${me ? x + W - w : x}px;top:${y + i * (h + gap)}px;width:${w}px;height:${h}px;border-radius:${h / 2}px;background:${me ? TAN : BEIGE};transform-origin:${me ? 'right' : 'left'}`, p);
    A(b, [{transform: 'scaleX(0)', opacity: 0}, {transform: 'none', opacity: 1}], t, .55, {e: OUTX}); return b; });
}
