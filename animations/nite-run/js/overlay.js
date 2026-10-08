// Hand-drawn text on an SVG layer above the WebGL canvas.
// "Boil": the displacement seed changes every 3 frames, like hand-redrawn animation on 2s/3s.
import { clamp, backOut, rng } from './util.js';

const meas = document.createElement('canvas').getContext('2d');
let items = [];
export function clear() { items = []; }

/**
 * add text: {txt, x, y, size, rot, fill, stroke, sw, font, p (0..1 reveal), stagger, out (0..1 exit), anchor}
 * Letters appear one by one with a pop.
 */
export function text(o) { items.push({ kind: 'text', ...o }); }
export function scribble(o) { items.push({ kind: 'scribble', ...o }); }
export function rect(o) { items.push({ kind: 'rect', ...o }); }

export function draw(svg, frame) {
  const seed = Math.floor(frame / 3) % 50 + 1;
  let out = `<defs>
    <filter id="boil" x="-10%" y="-20%" width="120%" height="140%">
      <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="${seed}" result="n"/>
      <feDisplacementMap in="SourceGraphic" in2="n" scale="7" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
    <filter id="rough" x="-10%" y="-20%" width="120%" height="140%">
      <feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves="1" seed="${seed + 7}" result="n"/>
      <feDisplacementMap in="SourceGraphic" in2="n" scale="4" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
  </defs>`;
  const jr = rng(seed * 31);
  for (const it of items) {
    if (it.kind === 'rect') { out += `<rect x="0" y="0" width="1080" height="1920" fill="${it.fill}" opacity="${it.opacity}"/>`; continue; }
    if (it.kind === 'scribble') {
      // hand-drawn underline / circle path revealed by dash offset
      const len = it.len ?? 1200, p = clamp(it.p ?? 1);
      out += `<path d="${it.d}" fill="none" stroke="${it.stroke ?? '#e8222a'}" stroke-width="${it.sw ?? 12}" stroke-linecap="round" stroke-linejoin="round"
        stroke-dasharray="${len}" stroke-dashoffset="${len * (1 - p)}" filter="url(#boil)" opacity="${1 - clamp(it.out ?? 0)}"/>`;
      continue;
    }
    const font = it.font ?? 'Permanent Marker', size = it.size ?? 120;
    meas.font = `${size}px "${font}"`;
    const letters = [...it.txt];
    const widths = letters.map((ch) => meas.measureText(ch).width * (it.track ?? 1.0));
    const total = widths.reduce((a, b) => a + b, 0);
    let x = it.anchor === 'start' ? 0 : -total / 2;
    const stagger = it.stagger ?? 0.06, p = it.p ?? 1, o = clamp(it.out ?? 0);
    let g = `<g transform="translate(${it.x},${it.y}) rotate(${it.rot ?? 0})" filter="url(#${it.filter ?? 'boil'})" opacity="${1 - o}">`;
    letters.forEach((ch, i) => {
      const lp = clamp((p * (1 + stagger * letters.length) - i * stagger) / 1);
      if (lp <= 0 || ch === ' ') { x += widths[i]; return; }
      const s = backOut(clamp(lp * 2.2), 2.6);
      const jx = (jr() - .5) * (it.jitter ?? 4), jy = (jr() - .5) * (it.jitter ?? 4), jrot = (jr() - .5) * (it.jrot ?? 6) + (i % 2 ? 3 : -3) * (it.wobble ?? 1);
      const cx = x + widths[i] / 2;
      g += `<g transform="translate(${cx + jx},${jy}) rotate(${jrot}) scale(${s})">
        <text x="0" y="0" text-anchor="middle" font-family="${font}" font-size="${size}"
          fill="${it.fill ?? '#e8222a'}" stroke="${it.stroke ?? '#0b0b0c'}" stroke-width="${it.sw ?? size * 0.12}"
          paint-order="stroke" stroke-linejoin="round">${ch.replace('&', '&amp;').replace('<', '&lt;')}</text></g>`;
      x += widths[i];
    });
    g += '</g>';
    out += g;
  }
  svg.innerHTML = out;
}
