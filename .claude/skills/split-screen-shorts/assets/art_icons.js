/* ===================== ART ICONS — pictures instead of words on the tiles =====================
   Bold flat illustrations: thick white / ink shapes on a solid tile, each with one motion that
   tells the line (a bubble that dissolves, a tag that swings, a scale that tips, people that fade, a dart that lands). */
const svgIn = (el, inner, {vb = '0 0 100 100', pad = .12} = {}) => { const w = parseFloat(el.style.width), h = parseFloat(el.style.height), [, , vw, vh] = vb.split(' ').map(Number);
  const k = Math.min(w * (1 - 2 * pad) / vw, h * (1 - 2 * pad) / vh), sw = vw * k, sh = vh * k;   // fit the drawing's own shape into the tile
  return div(`left:${(w - sw) / 2}px;top:${(h - sh) / 2}px;width:${sw}px;height:${sh}px`, el, `<svg viewBox="${vb}" width="${sw}" height="${sh}" style="overflow:visible">${inner}</svg>`); };
const at = (box, sel) => box.querySelector(sel);
const fb = el => { el.style.transformBox = 'fill-box'; el.style.transformOrigin = 'center'; return el; };

/* a chat bubble with typing dots that bursts into a cloud of dots and is gone (asked, then vanished) */
function artVanish(el, tIn, tGone, {ink = '#fff'} = {}) {
  const b = svgIn(el, `<g class="b"><path d="M14 22 H86 a8 8 0 0 1 8 8 V62 a8 8 0 0 1 -8 8 H44 L26 84 V70 H14 a8 8 0 0 1 -8 -8 V30 a8 8 0 0 1 8 -8 Z" fill="${ink}"/>
    ${[34, 50, 66].map((x, i) => `<circle class="d${i}" cx="${x}" cy="46" r="5.5" fill="${TC.red}"/>`).join('')}</g>
    <g class="p">${Array.from({length: 26}, (_, i) => { const a = i * 2.4, r = 6 + (i * 37 % 30); return `<circle cx="${50 + Math.cos(a) * r}" cy="${48 + Math.sin(a) * r * .7}" r="${1.6 + i % 3}" fill="${ink}"/>`; }).join('')}</g>`);
  A(fb(at(b, '.b')), [{transform: 'scale(.3)', opacity: 0}, {transform: 'scale(1)', opacity: 1}], tIn, .5, {e: 'cubic-bezier(.3,1.5,.5,1)'});
  [0, 1, 2].forEach(i => A(fb(at(b, `.d${i}`)), [{transform: 'translateY(0)'}, {transform: 'translateY(-5px)'}, {transform: 'translateY(0)'}], tIn + .4 + i * .12, .45, {it: 4, f: 'none'}));
  A(at(b, '.b'), [{opacity: 1, filter: 'blur(0)'}, {opacity: 0, filter: 'blur(6px)'}], tGone, .25, {f: 'forwards'});
  const p = fb(at(b, '.p')); p.style.opacity = 0;
  A(p, [{opacity: 0, transform: 'scale(.6)'}, {opacity: 1, transform: 'scale(1.1)', offset: .25}, {opacity: 0, transform: 'scale(1.9)'}], tGone, 1.0, {e: 'ease-out', f: 'forwards'});
}
/* a price tag that drops in and swings, with a shine sweeping across it */
function artTag(el, t, {ink = '#fff', hole = TC.red} = {}) {
  const b = svgIn(el, `<g class="t" style="transform-origin:72px 14px"><path d="M58 14 H86 a4 4 0 0 1 4 4 V46 L48 88 a5 5 0 0 1 -7 0 L12 59 a5 5 0 0 1 0 -7 Z" fill="${ink}"/>
    <circle cx="74" cy="30" r="6" fill="${hole}"/><path d="M74 4 V24" stroke="${ink}" stroke-width="3"/>
    <rect class="s" x="-10" y="0" width="14" height="110" fill="${hole}" opacity=".25" transform="rotate(35 50 50)"/></g>`);
  const tg = at(b, '.t');
  A(tg, [{transform: 'translateY(-60px) rotate(-30deg)', opacity: 0}, {transform: 'rotate(12deg)', opacity: 1, offset: .45}, {transform: 'rotate(-7deg)', offset: .7}, {transform: 'rotate(0)', opacity: 1}], t, 1.0, {e: 'ease-out'});
  A(at(b, '.s'), [{transform: 'rotate(35deg) translateX(-40px)'}, {transform: 'rotate(35deg) translateX(110px)'}], t + .9, .6, {e: 'ease-in-out'});
}
/* a balance that cannot settle (hesitation): it rocks one way, the other, and back */
function artScale(el, t, {ink = '#fff'} = {}) {
  const b = svgIn(el, `<path d="M50 20 V82 M32 84 H68" stroke="${ink}" stroke-width="6" stroke-linecap="round"/><circle cx="50" cy="18" r="5" fill="${ink}"/>
    <g class="beam" style="transform-origin:50px 26px"><path d="M16 26 H84" stroke="${ink}" stroke-width="6" stroke-linecap="round"/>
      <g class="l"><path d="M16 26 L6 54 H26 Z" fill="${ink}"/></g><g class="r"><path d="M84 26 L74 54 H94 Z" fill="${ink}"/></g></g>`);
  A(at(b, '.beam'), [{transform: 'rotate(0)'}, {transform: 'rotate(-14deg)'}, {transform: 'rotate(11deg)'}, {transform: 'rotate(-7deg)'}, {transform: 'rotate(4deg)'}], t, 2.4, {e: 'ease-in-out', f: 'both'});
}
/* a closed box with question marks orbiting it (not sure about the product) */
function artBoxQ(el, t, {ink = TC.black, q = TC.violet} = {}) {
  const b = svgIn(el, `<path d="M50 30 L76 43 V71 L50 84 L24 71 V43 Z" fill="${ink}"/><path d="M24 43 L50 56 L76 43 M50 56 V84" stroke="#fff" stroke-width="2.5" fill="none" opacity=".5"/>
    <g class="o" style="transform-origin:50px 56px">${[0, 120, 240].map(a => `<text x="${50 + Math.cos(a * Math.PI / 180) * 40}" y="${60 + Math.sin(a * Math.PI / 180) * 30}" text-anchor="middle" font-family="Display" font-weight="900" font-size="20" fill="${q}">?</text>`).join('')}</g>`);
  A(b, [{transform: 'scale(.5)', opacity: 0}, {transform: 'none', opacity: 1}], t, .5, {e: 'cubic-bezier(.3,1.4,.5,1)'});
  A(at(b, '.o'), [{transform: 'rotate(0)'}, {transform: 'rotate(360deg)'}], t, 3.0, {e: 'linear', it: 2, f: 'none'});
}
/* a pointer that hovers over a button, nearly presses, and backs away (can't decide to buy) */
function artHover(el, t, {ink = '#fff', btn = TC.blue} = {}) {
  const b = svgIn(el, `<rect x="16" y="40" width="68" height="22" rx="11" fill="${btn}"/><rect x="36" y="49" width="28" height="4" rx="2" fill="#fff" opacity=".8"/>
    <g class="c"><path d="M0 0 L0 22 L6 17 L10 26 L14 24 L10 15 L18 15 Z" fill="${ink}" stroke="${TC.black}" stroke-width="1.5" stroke-linejoin="round"/></g>`, {vb: '10 30 80 44', pad: .1});
  A(at(b, '.c'), [{transform: 'translate(80px,80px)'}, {transform: 'translate(52px,54px)', offset: .4}, {transform: 'translate(50px,52px)', offset: .5}, {transform: 'translate(54px,56px)', offset: .62}, {transform: 'translate(86px,88px)'}], t, 1.8, {e: 'ease-in-out'});
}
/* a row of people that fade away one by one (customers getting fewer) */
function artPeople(el, t, {ink = '#fff', n = 5, step = .28} = {}) {
  const b = svgIn(el, Array.from({length: n}, (_, i) => `<g class="p${i}"><circle cx="${12 + i * 19}" cy="14" r="6.5" fill="${ink}"/><path d="M${3 + i * 19} 40 a9 10 0 0 1 18 0 Z" fill="${ink}"/></g>`).join(''), {vb: '0 0 100 44', pad: .1});
  for (let i = 0; i < n; i++) { A(at(b, `.p${i}`), [{opacity: 0, transform: 'translateY(8px)'}, {opacity: 1, transform: 'none'}], t + i * .06, .4, {e: OUTX});
    if (i > 0) A(at(b, `.p${n - i}`), [{opacity: 1}, {opacity: .12}], t + .6 + i * step, .3, {f: 'forwards'}); }
}
/* tags raining down the tile (rushing to discount) */
function artTagRain(el, t0, t1, {ink = '#fff', n = 9} = {}) {
  const w = parseFloat(el.style.width), h = parseFloat(el.style.height);
  for (let i = 0; i < n; i++) { const s = 60 + (i * 37 % 50), x = (i * 97 % 100) / 100 * (w - s), d = div(`left:${x}px;top:0;width:${s}px;height:${s}px`, el,
    `<svg viewBox="0 0 100 100" width="${s}" height="${s}"><path d="M54 10 H86 a4 4 0 0 1 4 4 V46 L48 88 a5 5 0 0 1 -7 0 L12 59 a5 5 0 0 1 0 -7 Z" fill="${ink}"/><circle cx="72" cy="28" r="7" fill="${TC.red}"/></svg>`);
    const per = 1.0 + (i % 3) * .25; A(d, [{transform: `translateY(${-s}px) rotate(${i * 40}deg)`}, {transform: `translateY(${h}px) rotate(${i * 40 + 160}deg)`}], t0 + (i % 4) * .2, per, {e: 'linear', it: Math.ceil((t1 - t0) / per) + 1, f: 'none'}); }
}
/* a tag that gets crossed out, and a speech bubble with a tick that grows (not the discount — the answer) */
function artCross(el, t, {ink = '#fff', x = TC.black} = {}) {
  const b = svgIn(el, `<path d="M54 14 H86 a4 4 0 0 1 4 4 V46 L48 88 a5 5 0 0 1 -7 0 L12 59 a5 5 0 0 1 0 -7 Z" fill="${ink}" opacity=".9"/>
    <path class="x" d="M16 16 L84 84 M84 16 L16 84" stroke="${x}" stroke-width="9" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1"/>`);
  A(at(b, '.x'), [{strokeDashoffset: 1}, {strokeDashoffset: 0}], t, .45, {e: OUTX});
}
function artAnswer(el, t, {ink = '#fff', tick = TC.green} = {}) {
  const b = svgIn(el, `<g class="g" style="transform-origin:50px 50px"><path d="M14 18 H86 a8 8 0 0 1 8 8 V60 a8 8 0 0 1 -8 8 H46 L28 84 V68 H14 a8 8 0 0 1 -8 -8 V26 a8 8 0 0 1 8 -8 Z" fill="${ink}"/>
    <path class="k" d="M32 44 L45 56 L70 30" stroke="${tick}" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round" pathLength="1" stroke-dasharray="1 1"/></g>`);
  A(at(b, '.g'), [{transform: 'scale(.3)', opacity: 0}, {transform: 'scale(1.08)', opacity: 1, offset: .6}, {transform: 'scale(1)'}], t, .55, {e: 'ease-out'});
  A(at(b, '.k'), [{strokeDashoffset: 1}, {strokeDashoffset: 0}], t + .35, .4, {e: OUTX});
}
/* a dart that flies in and lands dead centre on a target, which pulses (fix it right on the spot) */
function artTarget(el, t, {ink = '#fff', hit = TC.red, bg = TC.lime} = {}) {
  const b = svgIn(el, `<g class="tg" style="transform-origin:46px 54px">${[38, 27, 16].map((r, i) => `<circle cx="46" cy="54" r="${r}" fill="${i % 2 ? bg : ink}"/>`).join('')}<circle cx="46" cy="54" r="7" fill="${hit}"/></g>
    <g class="dt"><path d="M46 54 L86 14" stroke="${ink}" stroke-width="5" stroke-linecap="round"/><path d="M80 10 L92 8 L90 20 Z" fill="${hit}"/></g>`);
  A(at(b, '.dt'), [{transform: 'translate(60px,-60px)', opacity: 0}, {transform: 'none', opacity: 1}], t, .35, {e: 'cubic-bezier(.5,0,.9,.6)'});
  A(at(b, '.tg'), [{transform: 'scale(1)'}, {transform: 'scale(1.1)'}, {transform: 'scale(1)'}], t + .35, .35, {e: 'ease-out', f: 'none'});
  const w = parseFloat(el.style.width), h = parseFloat(el.style.height), rg = div(`left:${w * .46 - 160}px;top:${h * .54 - 160}px;width:320px;height:320px;border-radius:50%;border:6px solid ${ink}`, el);
  A(rg, [{opacity: 0, transform: 'scale(.4)'}, {opacity: 1, transform: 'scale(.7)', offset: .2}, {opacity: 0, transform: 'scale(1.4)'}], t + .35, .8, {e: 'ease-out', f: 'forwards'}); rg.style.opacity = 0;
}
