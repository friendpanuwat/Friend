/* ===================== CUTOUT KIT — the look (references/style.md) =====================
   Cinematic cut-out collage: near-black stages with a warm glow, or loud yellow stages · the speaker cut out of their own frame
   in black-and-white with a glowing yellow disc behind the head · objects as shaded "photo sticker" cut-outs with a soft
   drop shadow · one gold / yellow accent · gold serif titles, heavy sans punch words, italic serif mixed into sans.
   Every scene is drawn for its own sentence — these are parts, not templates. */
const GOLD = '#FFC93C', YEL = '#FFD21F', AMBER = '#F5A300', INK = '#0B0A09', CREAM = '#FFF6DF', EMBER = '#FF6A13', HOT = '#FFF3B0';
const SANS = w => `font-family:Sans;font-weight:${w}`, SERIF = (w, it) => `font-family:Title;font-weight:${w};${it ? 'font-style:italic;' : ''}`;
const DROP = 'drop-shadow(0 26px 34px rgba(0,0,0,.45)) drop-shadow(0 6px 10px rgba(0,0,0,.3))';
const EDGE = 'drop-shadow(3px 0 0 #fff) drop-shadow(-3px 0 0 #fff) drop-shadow(0 3px 0 #fff) drop-shadow(0 -3px 0 #fff)';   // white sticker edge
const GRID = c => `linear-gradient(${c} 2px,transparent 2px) 0 0/90px 90px,linear-gradient(90deg,${c} 2px,transparent 2px) 0 0/90px 90px`;

/* ---------- backgrounds (full bleed, drawn on a scene's root) ---------- */
const LOOK = {
  dark: r => { r.style.background = `radial-gradient(ellipse 80% 55% at 50% 48%,#2A2118 0%,#14110D 55%,${INK} 100%)`;
    div(`inset:0;background:${GRID('rgba(255,255,255,.035)')};-webkit-mask-image:radial-gradient(ellipse at 50% 45%,#000 30%,transparent 80%)`, r); },
  yellow: r => { r.style.background = `radial-gradient(ellipse 75% 60% at 50% 45%,#FFF58A 0%,${YEL} 45%,#F2B400 85%,#E39E00 100%)`;
    div(`inset:0;background:${GRID('rgba(255,255,255,.18)')};-webkit-mask-image:linear-gradient(transparent 35%,#000 100%)`, r); },
  white: r => { r.style.background = 'radial-gradient(ellipse 85% 70% at 50% 45%,#FFFFFF 55%,#E9E7E2 100%)'; },
  orange: r => { r.style.background = `radial-gradient(ellipse 80% 60% at 40% 40%,#FF7A2E 0%,#F2500F 55%,#C93A06 100%)`; },
};

/* ---------- titles ---------- */
/* split a string into animated grapheme spans */
function letters(parent, s, t, {st = .03, css = '', kf} = {}) {
  graphemes(s).forEach((ch, i) => { const g = document.createElement('span'); g.textContent = ch === ' ' ? ' ' : ch;
    g.style.cssText = `display:inline-block;${css}`; parent.appendChild(g);
    A(g, kf ?? [{opacity: 0, transform: 'translateY(40%) scale(1.15)', filter: 'blur(12px)'}, {opacity: 1, transform: 'none', filter: 'blur(0)'}], t + i * st, .42, {e: SMOOTH}); });
  return parent;
}
const block = (c, x, y, w, css = '') => div(`left:${x - w / 2}px;top:${y}px;width:${w}px;text-align:center;white-space:nowrap;z-index:5;${css}`, c);   // titles above stickers
/* fit a title block to its width once fonts are loaded */
const fitW = (el, w) => FITS.push(() => { const s = Math.min(1, w / el.scrollWidth); if (s < 1) { el.style.transformOrigin = '50% 0'; el.style.transform = `scale(${s})`; } });
/* gold serif title with a warm glow (dark stages) — letters rise out of a blur one by one */
function gold(c, y, s, t, {size = 240, x = 540, w = 960, glow = true} = {}) {
  const el = block(c, x, y, w, `${SERIF(900)};font-size:${size}px;line-height:1.15;${glow ? `filter:drop-shadow(0 0 22px rgba(255,160,20,.75)) drop-shadow(0 0 70px rgba(255,120,0,.35))` : ''}`);
  letters(el, s, t, {css: `background:linear-gradient(180deg,${HOT} 0%,${GOLD} 42%,#E58E00 72%,#B86200 100%);-webkit-background-clip:text;background-clip:text;color:transparent;padding:0 .02em`});
  fitW(el, w); return el;
}
/* heavy sans punch words, stacked lines that slam in: lines = [[text, t, {color, size}], ...] */
function punch(c, y, lines, {size = 220, color = '#fff', x = 540, w = 960, shadow = 'dark', lh = 1.02} = {}) {
  const el = block(c, x, y, w, `${SANS(900)};line-height:${lh}`);
  const sh = shadow === 'dark' ? '0 8px 0 rgba(0,0,0,.16),0 22px 44px rgba(0,0,0,.38)' : shadow === 'glow' ? `0 0 30px ${YEL}AA,0 0 80px ${AMBER}66,0 8px 26px rgba(0,0,0,.6)` : 'none';
  for (const [s, t, o = {}] of lines) {
    const ln = div(`position:relative;font-size:${o.size ?? size}px;color:${o.color ?? color};text-shadow:${sh}`, el, s);
    A(ln, [{opacity: 0, transform: 'scale(1.55)', filter: 'blur(14px)'}, {opacity: 1, transform: 'none', filter: 'blur(0)'}], t, .26, {e: 'cubic-bezier(.2,1.2,.4,1)'});
  }
  fitW(el, w); return el;
}
/* sans and italic serif mixed in one phrase: parts = [[text, 'sans'|'serif', t, {color, size}], ...] — words fade up in place */
function mix(c, y, parts, {size = 160, color = '#fff', x = 540, w = 960, shadow = true} = {}) {
  const el = block(c, x, y, w, `line-height:1.08;white-space:normal`);
  for (const [s, kind, t, o = {}] of parts) {
    if (s === '\n') { el.appendChild(document.createElement('br')); continue; }
    const sp = div(`position:relative;display:inline-block;margin:0 .12em;white-space:nowrap;${kind === 'serif' ? SERIF(700, true) : SANS(900)};font-size:${(o.size ?? size) * (kind === 'serif' ? 1.08 : 1)}px;color:${o.color ?? color};${shadow ? 'text-shadow:0 10px 30px rgba(0,0,0,.28)' : ''}`, el, s);
    A(sp, [{opacity: 0, transform: 'translateY(30px)', filter: 'blur(8px)'}, {opacity: 1, transform: 'none', filter: 'blur(0)'}], t, .32);
  }
  return el;
}
/* neon sign word (red / yellow glow) that flickers on */
function neon(c, y, s, t, {size = 170, color = '#FF3B30', x = 540, w = 960} = {}) {
  const el = block(c, x, y, w, `${SANS(900)};font-size:${size}px;line-height:1.1;color:#FFF5F0;text-shadow:0 0 6px #fff,0 0 18px ${color},0 0 44px ${color},0 0 90px ${color}`);
  el.textContent = s;
  A(el, [{opacity: 0}, {opacity: 1, offset: .15}, {opacity: .25, offset: .3}, {opacity: 1, offset: .45}, {opacity: .5, offset: .6}, {opacity: 1}], t, .5, {e: 'linear'});
  fitW(el, w); return el;
}
/* small plain word on a stage (labels, the second voice of a title) */
const word = (c, x, y, s, t, {size = 80, color = '#fff', font = SANS(800), w = 900, align = 'center'} = {}) => {
  const el = div(`left:${align === 'center' ? x - w / 2 : x}px;top:${y}px;width:${w}px;text-align:${align};white-space:nowrap;${font};font-size:${size}px;line-height:1.2;color:${color}`, c, s);
  A(el, [{opacity: 0, transform: 'translateY(24px)'}, {opacity: 1, transform: 'none'}], t, .3); return el;
};

/* ---------- glow disc ---------- */
function disc(c, x, y, r, t, {color = YEL, pulse = true, t1} = {}) {
  const d = div(`left:${x - r}px;top:${y - r}px;width:${2 * r}px;height:${2 * r}px;border-radius:50%;
    background:radial-gradient(circle at 45% 40%,#FFF7B8 0%,${color} 38%,${AMBER} 100%);
    box-shadow:0 0 ${r * .5}px ${r * .18}px ${color}BB,0 0 ${r * 1.4}px ${r * .5}px ${AMBER}66`, c);
  A(d, [{opacity: 0, transform: 'scale(.2)'}, {opacity: 1, transform: 'none'}], t, .45, {e: SPRING});
  if (pulse && t1) A(d, [{scale: '1'}, {scale: '1.05'}], t + .45, .9, {e: 'ease-in-out', it: Math.max(1, Math.floor((t1 - t - .45) / .9)), dir: 'alternate', f: 'none'});
  return d;
}

/* ---------- the speaker, cut out of their own frame ---------- */
/* cut(c, time, {x, y, r, ...}) — cutouts/c_<time>.png (scripts/cutout.py stills) placed by the head: head centre at (x, y),
   head radius r. bw: black-and-white like the reference (a graphic, the video itself is never recoloured) · disc: glowing
   yellow disc behind the head · fade: share of the body that fades out at the bottom · from: entrance direction. */
function cut(c, time, t, {x = 540, y = 820, r = 150, bw = true, disc: dsc = true, discR = 1.75, discColor = YEL, fade = .3, from = 'bottom', edge = false, push = true, t1} = {}) {
  const k = (+time).toFixed(2), info = (typeof CUTS !== 'undefined' && CUTS[k]) || null;
  if (!info) { console.error(`CUT: cutouts/c_${k}.png missing — run: pipeline.sh $P cut ${k}`); return null; }
  const [hx, hy, hr] = info.head, s = r / hr, [, , , by1] = info.box;
  const holder = div(`left:0;top:0;width:1080px;height:1920px`, c);
  if (dsc) disc(holder, x, y - r * .1, r * discR, t + .12, {color: discColor, t1});
  const wrap = div(`left:0;top:0;width:1080px;height:1920px;transform-origin:0 0;transform:translate(${x - hx * s}px,${y - hy * s}px) scale(${s})`, holder);
  const img = document.createElement('img'); img.src = `cutouts/c_${k}.png`;
  const f0 = (by1 - (by1 - info.box[1]) * fade) / 19.2, f1 = by1 / 19.2;
  img.style.cssText = `position:absolute;left:0;top:0;width:1080px;height:1920px;filter:${bw ? 'grayscale(1) contrast(1.18) brightness(1.06) ' : ''}${edge ? EDGE + ' ' : ''}${DROP};
    -webkit-mask-image:linear-gradient(#000 ${f0}%,transparent ${f1}%);mask-image:linear-gradient(#000 ${f0}%,transparent ${f1}%)`;
  wrap.appendChild(img);
  const off = {bottom: 'translateY(260px)', left: 'translateX(-420px)', right: 'translateX(420px)', none: 'none'}[from];
  A(holder, [{opacity: 0, transform: off}, {opacity: 1, transform: 'none'}], t, .45, {e: SMOOTH});
  if (push && t1) { holder.style.transformOrigin = `${x}px ${y}px`; A(holder, [{scale: '1'}, {scale: '1.05'}], t, t1 - t, {e: 'linear'}); }   // slow push-in
  return holder;
}

/* ---------- objects as shaded photo-sticker cut-outs ---------- */
/* sticker(c, html, {x, y, w, h, rot, t, float, edge}) — any svg / html drawn for this sentence, given the cut-out look
   (drop shadow, optional white sticker edge), springs in, drifts slowly */
function sticker(c, html, {x = 540, y = 960, w = 400, h = 400, rot = 0, t = 0, t1, float = true, edge = false, from = 'pop', blur = 0} = {}) {
  const el = div(`left:${x - w / 2}px;top:${y - h / 2}px;width:${w}px;height:${h}px;filter:${edge ? EDGE + ' ' : ''}${DROP}${blur ? ` blur(${blur}px)` : ''}`, c, html);
  const kIn = from === 'drop' ? [{opacity: 0, transform: `translateY(-700px) rotate(${rot - 25}deg)`}, {opacity: 1, transform: `rotate(${rot}deg)`}]
    : from === 'left' ? [{opacity: 0, transform: `translateX(-600px) rotate(${rot - 15}deg)`}, {opacity: 1, transform: `rotate(${rot}deg)`}]
    : from === 'right' ? [{opacity: 0, transform: `translateX(600px) rotate(${rot + 15}deg)`}, {opacity: 1, transform: `rotate(${rot}deg)`}]
    : [{opacity: 0, transform: `scale(.3) rotate(${rot - 20}deg)`}, {opacity: 1, transform: `rotate(${rot}deg)`}];
  A(el, kIn, t, from === 'pop' ? .4 : .5, {e: from === 'drop' ? 'cubic-bezier(.3,1.25,.5,1)' : SPRING});
  if (float && t1) A(el, [{translate: '0 0'}, {translate: '0 -18px'}], t + .5, 1.3, {e: 'ease-in-out', it: Math.max(1, Math.floor((t1 - t - .5) / 1.3)), dir: 'alternate', f: 'none'});
  return el;
}
const svg = (w, h, inner, vb = `0 0 ${w} ${h}`) => `<svg width="100%" height="100%" viewBox="${vb}" style="overflow:visible;display:block">${inner}</svg>`;
let _gid = 0; const gid = p => `${p}${++_gid}`;
/* drawn parts — shaded like small photographs. Compose them into objects for the sentence; draw new ones in graphics.js
   in the same manner (gradient body · light edge on top · darker underside · drop shadow from sticker()). */
const D = {
  phone: (screen = '') => { const g = gid('ph'); return svg(300, 600, `<defs><linearGradient id="${g}" x1="0" x2="1"><stop offset="0" stop-color="#3A3A3E"/><stop offset=".5" stop-color="#121214"/><stop offset="1" stop-color="#2A2A2E"/></linearGradient></defs>
    <rect x="4" y="4" width="292" height="592" rx="46" fill="url(#${g})"/><rect x="18" y="20" width="264" height="560" rx="34" fill="#F4F4F6"/>
    <rect x="112" y="30" width="76" height="20" rx="10" fill="#121214"/><g transform="translate(18 20)">${screen}</g>
    <path d="M30 40 Q150 10 270 40" stroke="#fff" stroke-opacity=".25" stroke-width="6" fill="none"/>`); },
  coin: (mark = '฿') => { const g = gid('co'); return svg(200, 200, `<defs><radialGradient id="${g}" cx=".38" cy=".32" r=".75"><stop offset="0" stop-color="#FFF4B0"/><stop offset=".45" stop-color="${GOLD}"/><stop offset="1" stop-color="#B86A00"/></radialGradient></defs>
    <circle cx="100" cy="104" r="92" fill="#8A4F00"/><circle cx="100" cy="96" r="92" fill="url(#${g})"/><circle cx="100" cy="96" r="70" fill="none" stroke="#B86A00" stroke-width="6" opacity=".7"/>
    <text x="100" y="128" text-anchor="middle" font-family="Sans" font-weight="900" font-size="92" fill="#A65E00">${mark}</text>`); },
  bills: (n = 5) => { const g = gid('bi'); let o = `<defs><linearGradient id="${g}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#CFE6C4"/><stop offset=".5" stop-color="#9CC48B"/><stop offset="1" stop-color="#6E9B5E"/></linearGradient></defs>`;
    for (let i = 0; i < n; i++) o += `<g transform="translate(0 ${(n - 1 - i) * 14})"><rect x="10" y="40" width="380" height="180" rx="10" fill="url(#${g})" stroke="#4E7442" stroke-width="3"/>
      <rect x="30" y="58" width="340" height="144" rx="6" fill="none" stroke="#4E7442" stroke-width="2" opacity=".6"/><circle cx="200" cy="130" r="48" fill="#B9D9AA" stroke="#4E7442" stroke-width="3" opacity=".9"/></g>`;
    return svg(400, 240 + n * 14, o); },
  /* tag: never a white tag behind white type — it disappears */
  tag: (txt = '', color = YEL, ink = INK) => { const g = gid('tg'); return svg(460, 260, `<defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF" stop-opacity=".35"/><stop offset="1" stop-color="#000" stop-opacity=".18"/></linearGradient></defs>
    <path d="M110 20 H430 Q450 20 450 40 V220 Q450 240 430 240 H110 L10 130 Z" fill="${color}"/><path d="M110 20 H430 Q450 20 450 40 V220 Q450 240 430 240 H110 L10 130 Z" fill="url(#${g})"/>
    <circle cx="92" cy="130" r="20" fill="#fff" stroke="#00000033" stroke-width="4"/>
    <text x="280" y="160" text-anchor="middle" font-family="Sans" font-weight="900" font-size="96" fill="${ink}">${txt}</text>`); },
  q: (color = YEL) => { const g = gid('qq'); return svg(220, 320, `<defs><linearGradient id="${g}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFF6B0"/><stop offset=".5" stop-color="${color}"/><stop offset="1" stop-color="${AMBER}"/></linearGradient></defs>
    <text x="116" y="268" text-anchor="middle" font-family="Sans" font-weight="900" font-size="320" fill="#00000055">?</text><text x="110" y="258" text-anchor="middle" font-family="Sans" font-weight="900" font-size="320" fill="url(#${g})">?</text>`); },
  mark: (ok = false) => { const c1 = ok ? '#3DDC84' : '#FF3B30', c2 = ok ? '#0E9F57' : '#B3140C', g = gid('mk'); return svg(240, 240, `<defs><radialGradient id="${g}" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset=".25" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></radialGradient></defs>
    <circle cx="120" cy="126" r="108" fill="#00000040"/><circle cx="120" cy="116" r="108" fill="url(#${g})"/>
    <path d="${ok ? 'M70 120 L105 155 L172 85' : 'M80 76 L160 156 M160 76 L80 156'}" stroke="#fff" stroke-width="26" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`); },
  bubble: (txt = '', {me = false, size = 52} = {}) => `<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:26px 44px;border-radius:56px;${me ? 'border-bottom-right-radius:12px' : 'border-bottom-left-radius:12px'};
    background:${me ? `linear-gradient(180deg,#FFE46B,${YEL} 60%,${AMBER})` : 'linear-gradient(180deg,#FFFFFF,#ECEAE4)'};${SANS(700)};font-size:${size}px;line-height:1.25;color:${INK};text-align:center;box-shadow:inset 0 -6px 0 rgba(0,0,0,.08)">${txt}</div>`,
  bag: (color = YEL) => { const g = gid('bg'); return svg(300, 340, `<defs><linearGradient id="${g}" x1="0" x2="1"><stop offset="0" stop-color="${color}"/><stop offset=".7" stop-color="${AMBER}"/><stop offset="1" stop-color="#C77F00"/></linearGradient></defs>
    <path d="M95 110 V80 Q95 25 150 25 Q205 25 205 80 V110" stroke="#5A3A00" stroke-width="14" fill="none" stroke-linecap="round"/>
    <path d="M30 100 H270 L290 330 H10 Z" fill="url(#${g})"/><path d="M30 100 H270 L274 140 H26 Z" fill="#fff" opacity=".25"/>`); },
  box: () => svg(320, 300, `<path d="M20 90 L160 30 L300 90 L160 150 Z" fill="#E7C08A"/><path d="M20 90 L160 150 V290 L20 230 Z" fill="#C99C5E"/><path d="M300 90 L160 150 V290 L300 230 Z" fill="#B0844A"/>
    <path d="M90 60 L230 120 V160 L200 148 V112 L60 52 Z" fill="#F4DDB5" opacity=".8"/>`),
  arrow: (dir = 'down', color = YEL) => { const rot = {down: 0, up: 180, left: 90, right: -90}[dir], g = gid('ar'); return svg(240, 300, `<defs><linearGradient id="${g}" x1="0" x2="1"><stop offset="0" stop-color="#FFF6B0"/><stop offset=".5" stop-color="${color}"/><stop offset="1" stop-color="${AMBER}"/></linearGradient></defs>
    <g transform="rotate(${rot} 120 150)"><path d="M80 20 H160 V170 H220 L120 290 L20 170 H80 Z" fill="url(#${g})" stroke="#00000022" stroke-width="4"/></g>`); },
};

/* ---------- particles & light ---------- */
/* rain(c, i => html, {n, t0, t1, seed, mode, area, size}) — many small stickers: 'fall' (drop and spin, looping),
   'float' (drift up slowly), 'burst' (thrown out from the centre). Big ones are blurred like a shallow depth of field. */
function rain(c, make, {n = 10, t0, t1, seed = 3, mode = 'fall', area = [60, 0, 1020, 1920], size = [180, 380], blurBig = true} = {}) {
  const r = rnd(seed), [x0, y0, x1, y1] = area, box = div('left:0;top:0;width:1080px;height:1920px;z-index:0', c);   // own layer: always under the titles
  for (let i = 0; i < n; i++) {
    const s = lerp(size[0], size[1], r() ** 1.6), x = lerp(x0, x1, r()), rot = mode === 'float' ? (r() - .5) * 50 : r() * 360, big = s > lerp(size[0], size[1], .72);
    const el = div(`left:${x - s / 2}px;top:0;width:${s}px;height:${s}px;filter:${DROP}${blurBig && big ? ' blur(5px)' : ''};opacity:${big ? .9 : 1}`, box, make(i));
    if (mode === 'fall') { const per = lerp(1.6, 2.6, r()), off = r() * per;
      A(el, [{transform: `translateY(${y0 - s - 100}px) rotate(${rot}deg)`}, {transform: `translateY(${y1 + 100}px) rotate(${rot + 200 * (r() > .5 ? 1 : -1)}deg)`}], t0 - off, per, {e: 'linear', it: Math.ceil((t1 - t0 + off) / per) + 1, f: 'none'}); }
    else if (mode === 'float') { const y = lerp(y0, y1, r());
      A(el, [{opacity: 0, transform: `translateY(${y + 60}px) rotate(${rot}deg) scale(.6)`}, {opacity: 1, transform: `translateY(${y}px) rotate(${rot}deg)`, offset: .2}, {opacity: 1, transform: `translateY(${y - 160}px) rotate(${-rot}deg)`}], t0 + r() * .4, t1 - t0, {e: 'linear'}); }
    else { const a = r() * Math.PI * 2, d = lerp(300, 700, r()), cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
      el.style.left = cx - s / 2 + 'px';
      A(el, [{opacity: 0, transform: `translate(0,${cy}px) scale(.2) rotate(0deg)`}, {opacity: 1, transform: `translate(${Math.cos(a) * d}px,${cy + Math.sin(a) * d}px) scale(1) rotate(${rot}deg)`, offset: .35}, {opacity: 1, transform: `translate(${Math.cos(a) * d * 1.25}px,${cy + Math.sin(a) * d * 1.25 + 260}px) scale(1) rotate(${rot + 90}deg)`}], t0 + r() * .12, Math.max(.8, t1 - t0), {e: 'cubic-bezier(.15,.8,.4,1)'}); }
  }
}
/* soft warm bokeh drifting on dark stages */
function bokeh(c, {n = 10, t0, t1, seed = 5, color = GOLD} = {}) {
  const r = rnd(seed);
  for (let i = 0; i < n; i++) { const s = lerp(40, 160, r()), x = lerp(40, 1040, r()), y = lerp(200, 1800, r());
    const b = div(`left:${x}px;top:${y}px;width:${s}px;height:${s}px;border-radius:50%;background:radial-gradient(circle,${color}${['55', '33', '22'][i % 3]},transparent 70%);filter:blur(${2 + r() * 6}px)`, c);
    A(b, [{transform: 'translate(0,0)'}, {transform: `translate(${(r() - .5) * 120}px,${-60 - r() * 120}px)`}], t0, t1 - t0, {e: 'linear'}); }
}
/* light beams from above onto a point (a stage, a winner) */
function beams(c, x, y, t, {n = 3, color = '#FFF2C4', spread = 520} = {}) {
  for (let i = 0; i < n; i++) { const a = (i - (n - 1) / 2) * 16;
    const b = div(`left:${x - spread / 2}px;top:${y - 1900}px;width:${spread}px;height:1900px;transform-origin:50% 100%;transform:rotate(${a}deg);
      background:linear-gradient(180deg,transparent 0%,${color}22 40%,${color}88 100%);clip-path:polygon(44% 0,56% 0,100% 100%,0 100%);filter:blur(8px)`, c);
    A(b, [{opacity: 0}, {opacity: 1}], t + i * .08, .5); }
  const pool = div(`left:${x - 360}px;top:${y - 70}px;width:720px;height:140px;border-radius:50%;background:radial-gradient(${color}AA,transparent 70%);filter:blur(10px)`, c);
  A(pool, [{opacity: 0}, {opacity: 1}], t, .5);
}
