/* ===================== MINIMAL KIT — building blocks for every non-face scene (user's pick) =====================
   White paper · people and hands as SOLID BLACK PICTOGRAMS · objects, cards and screens as THIN DARK OUTLINES with light-grey
   fills and soft shadows · grey numbers, bold black Thai · ONE red accent. Fewer, longer scenes: one scene can hold several
   beats ("phases") that slide in place instead of cutting back and forth. Every drawing is made for its sentence. */
const NIB = '#111111', G1 = '#8E8E93', G2 = '#D1D1D6', G3 = '#F2F2F7', RED = '#FF3B30', PAPER = '#FFFFFF';
const OUT = `stroke="${NIB}" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round"`;
const SHDEF = `<defs><filter id="sh" x="-20%" y="-20%" width="140%" height="170%"><feDropShadow dx="0" dy="18" stdDeviation="22" flood-color="#000" flood-opacity=".10"/></filter></defs>`;
const EASE = 'cubic-bezier(.2,.8,.2,1)';
const paper = (t0, t1) => safeStage(solid(t0, t1, PAPER));   // scene content squeezed into x 60–900
const svgLayer = (root, inner) => div('left:0;top:0;width:1080px;height:1920px', root, `<svg width="1080" height="1920" style="overflow:visible;display:block">${SHDEF}${inner}</svg>`);
const rise = (el, t, d = .4, y = 26) => A(el, [{opacity: 0, transform: `translateY(${y}px)`}, {opacity: 1, transform: 'none'}], t, d, {e: EASE});
const popIn = (el, t, d = .4) => A(el, [{opacity: 0, transform: 'scale(.6)'}, {opacity: 1, transform: 'none'}], t, d, {e: bounce});
/* one beat inside a scene: slides in from the right, out to the left (first / last skip the slide) */
function phase(root, t0, t1, {first = false, last = false} = {}) {
  const el = div('left:0;top:0;width:1080px;height:1920px', root);
  if (!first) A(el, [{opacity: 0, transform: 'translateX(160px)'}, {opacity: 1, transform: 'none'}], t0, .45, {e: EASE});
  if (!last) A(el, [{opacity: 1, transform: 'none'}, {opacity: 0, transform: 'translateX(-160px)'}], t1 - .3, .3, {e: 'cubic-bezier(.6,0,.9,.4)', f: 'forwards'});
  return el;
}
const label = (root, x, y, {num = '', text = '', red = false, grey = false, size = 80, w = 980} = {}) => div(`left:${x - w / 2}px;top:${y}px;width:${w}px;text-align:center;white-space:nowrap`, root,
  `${num ? `<div style="${BOLD};font-size:42px;color:${G1};letter-spacing:1px;margin-bottom:6px">${num}</div>` : ''}<div style="${BOLD};font-size:${size}px;line-height:1.2;color:${red ? RED : grey ? G1 : NIB}">${text}</div>`);
/* A — solid pictogram person, feet at (x, y) */
const pic = (x, y, s = 1, c = NIB) => `<g transform="translate(${x} ${y}) scale(${s})" fill="${c}">
  <circle cx="0" cy="-392" r="44"/><rect x="-44" y="-334" width="88" height="152" rx="34"/>
  <rect x="-80" y="-326" width="30" height="138" rx="15"/><rect x="50" y="-326" width="30" height="138" rx="15"/>
  <rect x="-40" y="-200" width="36" height="200" rx="18"/><rect x="4" y="-200" width="36" height="200" rx="18"/></g>`;
/* A — solid pointing hand (fingertip at 0,0) */
const HAND = `<path d="M0 0 Q-18 0 -18 22 V150 Q-30 132 -52 136 Q-76 142 -66 170 L-8 286 Q8 316 44 316 H120 Q170 316 176 262 V172 Q176 148 152 146 Q140 146 132 154 Q132 128 108 126 Q94 126 86 136 Q84 112 62 110 Q46 110 40 122 V22 Q40 0 18 0 Z" fill="${NIB}"/>`;
/* B — outline bits */
const card = (x, y, w, h, r = 48) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="#fff" ${OUT} filter="url(#sh)"/>`;
const redQ = (root, x, y, t, r = 50) => { const q = div(`left:${x - r}px;top:${y - r}px;width:${2 * r}px;height:${2 * r}px;border-radius:50%;background:${RED};box-shadow:0 0 ${r * .8}px ${RED}66;${BOLD};font-size:${r * 1.3}px;line-height:${r * 1.86}px;text-align:center;color:#fff`, root, '?'); popIn(q, t); return q; };
const seededDots = (cx, cy, n, seed, red = true) => { let s = seed; const r = () => ((s = s * 16807 % 2147483647) / 2147483647); let o = '';
  for (let i = 0; i < n; i++) { const a = r() * Math.PI * 2, d = 30 + r() * 170; o += `<circle cx="${cx + Math.cos(a) * d * 1.2}" cy="${cy + Math.sin(a) * d * 1.6}" r="${4 + r() * 10}" fill="${red && r() < .3 ? RED : NIB}" opacity="${.25 + r() * .6}"/>`; } return o; };
/* a person that dissolves into dots at tGone (A figure → particles) */
function vanishingPerson(root, x, y, s, t, tGone) {
  const p = svgLayer(root, pic(x, y, s)); rise(p, t, .4, 40);
  A(p, [{opacity: 1, filter: 'blur(0)'}, {opacity: 0, filter: 'blur(10px)'}], tGone, .35, {f: 'forwards'});
  const d = svgLayer(root, seededDots(x, y - 220 * s, 46, 7));
  d.style.transformOrigin = `${x}px ${y - 220 * s}px`;
  A(d, [{opacity: 0, transform: 'scale(.6)'}, {opacity: 1, transform: 'scale(1)', offset: .3}, {opacity: 0, transform: 'scale(1.35)'}], tGone, .9, {e: 'ease-out'});
}
/* count a number up inside el from 0 to `to` between t0 and t1 (prefix/suffix kept), e.g. 50,000 */
function countUp(el, to, t0, t1, {pre = '', suf = ''} = {}) {
  HOOKS.push(t => { const p = clamp((t - t0) / Math.max(.01, t1 - t0)), e = 1 - Math.pow(1 - p, 3); el.textContent = pre + Math.round(to * e).toLocaleString('en-US') + suf; });
}
