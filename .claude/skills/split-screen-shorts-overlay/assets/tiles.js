/* ===================== TILES — rounded motion-graphic tiles =====================
   Rounded tiles in solid colour with one huge heavy word, dark dashboards with a
   glowing planet edge and a line that climbs or falls, dot fields, a soft orb, tiles in a 3D coverflow or a gallery grid.
   Words come from the transcript; numbers only when they were said. Colours change from tile to tile. */
const TC = {red: '#F2481C', orange: '#FF7A1A', black: '#0B0B0E', cream: '#F4F1EA', blue: '#2F5BFF', lime: '#C8F24A', pink: '#FF5C9A', violet: '#6E4BFF', yellow: '#FFC21A', green: '#16B97A', white: '#FFFFFF', sky: '#DCEBFF'};
const SH = '0 34px 80px rgba(10,12,20,.22),0 4px 12px rgba(10,12,20,.10)';
/* tile(s, x, y, w, h, t, {bg, r}) — the base: a rounded tile that springs in. Returns the tile (tile px). */
function tile(s, x, y, w, h, t, {bg = TC.red, r = 30, from = 'pop', d = .6} = {}) {
  const el = div(`left:${x}px;top:${y}px;width:${w}px;height:${h}px;border-radius:${r}px;overflow:hidden;background:${bg};box-shadow:${SH}`, s);
  const k = from === 'left' ? 'translateX(-120px)' : from === 'right' ? 'translateX(120px)' : from === 'up' ? 'translateY(90px)' : 'scale(.82)';
  A(el, [{opacity: 0, transform: k}, {opacity: 1, transform: 'none'}], t, d, {e: OUTX}); return el;
}
/* big(el, word, t, {color, sub, subColor, fit, motion}) — one huge heavy word that fills the tile; motion: 'slam' | 'stretch' | 'rise' | 'type' */
function big(el, word, t, {color = '#111', sub = '', subColor, size, motion = 'slam', pad = .1} = {}) {
  const w = parseFloat(el.style.width), h = parseFloat(el.style.height);
  const box = div(`left:0;top:0;width:${w}px;height:${h}px;display:flex;flex-direction:column;align-items:center;justify-content:center`, el);
  const tx = div(`position:relative;font-family:Display;font-weight:900;font-size:${size ?? h * .42}px;line-height:1;letter-spacing:-.02em;color:${color};white-space:nowrap`, box, word);
  if (sub) div(`position:relative;margin-top:${h * .04}px;font-family:Accent;font-style:italic;font-weight:600;font-size:${h * .085}px;color:${subColor ?? color};opacity:.85;white-space:nowrap`, box, sub);
  FITS.push(() => { const k = Math.min(1, w * (1 - 2 * pad) / tx.scrollWidth); if (k < 1) tx.style.fontSize = parseFloat(tx.style.fontSize) * k + 'px'; });
  if (motion === 'slam') A(tx, [{opacity: 0, transform: 'scale(1.6)', filter: 'blur(12px)'}, {opacity: 1, transform: 'none', filter: 'blur(0)'}], t, .35, {e: 'cubic-bezier(.2,1.2,.4,1)'});
  if (motion === 'stretch') A(tx, [{opacity: 0, transform: 'scaleX(.2) scaleY(1.6)'}, {opacity: 1, transform: 'none'}], t, .5, {e: 'cubic-bezier(.2,1.4,.4,1)'});
  if (motion === 'rise') A(tx, [{opacity: 0, transform: 'translateY(60%)'}, {opacity: 1, transform: 'none'}], t, .6, {e: OUTX});
  if (motion === 'type') { const gs = graphemes(word); HOOKS.push(tt => { tx.textContent = gs.slice(0, clamp(Math.ceil((tt - t) / .06), 0, gs.length)).join('') || ' '; }); }
  return tx;
}
/* dash(el, t, {label, word, dir, color, planet}) — a black launch dashboard: a small label, a big word (or a number that was said),
   a glowing line that climbs or falls, the curved edge of a glowing planet at the bottom */
function dash(el, t, {label = '', word = '', dir = 'up', color = TC.orange, planet = true, line = true} = {}) {
  const w = parseFloat(el.style.width), h = parseFloat(el.style.height);
  if (planet) { const p = div(`left:${-w * .25}px;top:${h * .62}px;width:${w * 1.5}px;height:${w * 1.5}px;border-radius:50%;
      background:radial-gradient(circle at 50% 0%,${color}55 0%,transparent 35%);box-shadow:0 -6px 40px ${color}AA,inset 0 10px 30px ${color}66;border-top:3px solid ${color}`, el);
    A(p, [{transform: 'translateY(60px)', opacity: 0}, {transform: 'none', opacity: 1}], t + .1, 1.0, {e: OUTX});
    const dots = div(`left:0;top:${h * .58}px;width:${w}px;height:${h * .42}px;background:radial-gradient(${color}88 1.4px,transparent 2px) 0 0/22px 22px;-webkit-mask-image:radial-gradient(ellipse 60% 70% at 50% 100%,#000,transparent 70%)`, el);
    A(dots, [{opacity: 0}, {opacity: 1}], t + .4, .8); }
  if (label) { const lb = div(`left:0;top:${h * .1}px;width:${w}px;text-align:center;font-family:Sans;font-weight:600;font-size:${h * .07}px;color:#9A9AA6;letter-spacing:.04em`, el, label); A(lb, [{opacity: 0}, {opacity: 1}], t + .2, .4); }
  if (word) { const wd = div(`left:0;top:${h * .2}px;width:${w}px;text-align:center;font-family:Display;font-weight:800;font-size:${h * .2}px;color:#fff;letter-spacing:-.01em;white-space:nowrap`, el, word);
    A(wd, [{opacity: 0, transform: 'translateY(30px)'}, {opacity: 1, transform: 'none'}], t + .25, .6, {e: OUTX}); }
  if (line) { const W = w * .8, H = h * .3, ys = dir === 'down' ? [.15, .25, .2, .45, .4, .62, .75, .92] : [.92, .8, .84, .6, .66, .4, .3, .08];
    const d = 'M' + ys.map((v, i) => `${(i / (ys.length - 1) * W).toFixed(1)} ${(v * H).toFixed(1)}`).join(' L');
    const sv = div(`left:${w * .1}px;top:${h * .46}px;width:${W}px;height:${H}px`, el, `<svg width="${W}" height="${H}" style="overflow:visible"><path d="${d}" fill="none" stroke="${color}" stroke-width="${h * .012}" stroke-linecap="round" stroke-linejoin="round" pathLength="1" stroke-dasharray="1 1" style="filter:drop-shadow(0 0 8px ${color})"/></svg>`);
    A(sv.firstChild.firstChild, [{strokeDashoffset: 1}, {strokeDashoffset: 0}], t + .4, 1.1, {e: OUTQ}); }
}
/* counter(el, from, to, t0, t1, {...}) — a number that ticks (ONLY numbers the speaker said) */
function counter(node, to, t0, t1, {pre = '', suf = ''} = {}) { HOOKS.push(t => { const p = clamp((t - t0) / Math.max(.01, t1 - t0)), e = 1 - Math.pow(1 - p, 3); node.textContent = pre + Math.round(to * e).toLocaleString('en-US') + suf; }); }
/* dots(el, t, {color}) — a field of dots that breathes in a wave */
function dotfield(el, t, {color = '#fff', step = 34, rad = 5} = {}) {
  const w = parseFloat(el.style.width), h = parseFloat(el.style.height), f = div(`inset:0`, el);
  for (let y = step; y < h; y += step) for (let x = step; x < w; x += step) { const d = div(`left:${x}px;top:${y}px;width:${rad * 2}px;height:${rad * 2}px;border-radius:50%;background:${color}`, f);
    A(d, [{transform: 'scale(.2)', opacity: .25}, {transform: 'scale(1)', opacity: 1}, {transform: 'scale(.2)', opacity: .25}], t + (x + y) / (w + h) * .9, 1.4, {it: 3, f: 'none', e: 'ease-in-out'}); }
}
/* orb(el, t, {color}) — a soft glowing sphere that drifts and breathes */
function orb(el, t, {color = TC.blue, size} = {}) {
  const w = parseFloat(el.style.width), h = parseFloat(el.style.height), r = size ?? Math.min(w, h) * .32;
  const o = div(`left:${w / 2 - r}px;top:${h / 2 - r}px;width:${2 * r}px;height:${2 * r}px;border-radius:50%;background:radial-gradient(circle at 38% 34%,#fff 0%,${color} 30%,${color} 60%,${color}00 72%);filter:blur(1px)`, el);
  A(o, [{transform: 'scale(.4)', opacity: 0}, {transform: 'scale(1)', opacity: 1}], t, .8, {e: OUTX});
  A(o, [{translate: '0 0'}, {translate: '0 -14px'}], t + .8, 1.2, {it: 4, dir: 'alternate', f: 'none', e: 'ease-in-out'}); return o;
}
/* coverflow(s, tiles, t0, step, {x, y, w, h}) — tiles in a 3D row: one centred, the next ones turned away at the sides;
   every `step` seconds the row slides one along. tiles: [(tileEl) => draw(tileEl, tShow), ...] each gets its own tile. */
function coverflow(s, makers, t0, step, {cx = 540, y = 40, w = 620, h = 420, gap = .78, bgs = []} = {}) {
  const stage = div(`left:0;top:${y}px;width:1080px;height:${h + 40}px;perspective:1600px`, s);
  return makers.map((mk, i) => {
    const el = div(`left:${cx - w / 2}px;top:0;width:${w}px;height:${h}px;border-radius:30px;overflow:hidden;background:${bgs[i] ?? TC.red};box-shadow:${SH}`, stage);
    const kf = []; const n = makers.length;
    for (let k = 0; k < n; k++) { const pos = i - k, x = pos * w * gap, ry = clamp(pos, -1, 1) * -38, sc = pos === 0 ? 1 : .8, op = Math.abs(pos) > 1 ? 0 : 1;
      kf.push({transform: `translateX(${x}px) rotateY(${ry}deg) scale(${sc})`, opacity: op, zIndex: 10 - Math.abs(pos)}); }
    // hold each position for most of the step, glide between (one keyframe pair per step)
    const m = n - 1, frames = []; kf.forEach((f, k) => { frames.push({...f, offset: k / Math.max(1, m)}); if (k < m) frames.push({...f, offset: (k + .7) / m}); });
    A(el, frames, t0, step * m, {e: 'cubic-bezier(.45,0,.55,1)', f: 'both'});
    el.style.zIndex = 10 - Math.abs(i);
    mk(el, t0 + i * step);
    return el;
  });
}
