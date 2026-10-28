/* ===================== OVERLAY KIT (talking-head-overlay) =====================
   Inserted by build_scene.py between the engine and timeline.js.
   Style: the speaker stays on screen the whole clip (no full-screen scenes, no blur on the footage);
   small dark cards / chips / icons pop up in the empty part of the frame (usually above the head). */

/* line icons — viewBox 0 0 100 100, stroke only */
Object.assign(IC, {
  q:      'M36 36c0-10 6-17 14-17s14 6 14 15c0 12-14 13-14 26v4M50 80v1',            // question mark
  search: 'M68 42a26 26 0 1 1-52 0a26 26 0 1 1 52 0M61 61L84 84',                    // magnifier
  tag:    'M14 46V16H44L86 58L58 86ZM31 31v1',                                       // price tag
  box:    'M50 14L84 30V70L50 86L16 70V30ZM16 30L50 46L84 30M50 46V86',              // product box
  alert:  'M50 16a34 34 0 1 1 0 68a34 34 0 1 1 0-68M50 34v22M50 66v1',               // problem / warning
  shield: 'M50 12L82 24V48C82 68 68 82 50 90C32 82 18 68 18 48V24ZM36 50L46 60L66 40', // quality
  scale:  'M50 16V84M32 84H68M18 30H82M18 30L8 56H28ZM82 30L72 56H92Z',              // worth it / compare
  check:  'M22 52L42 72L80 30',
  down:   'M50 14V82M24 58L50 84L76 58',
  up:     'M50 86V18M24 42L50 16L76 42',
  cross:  'M28 28L72 72M72 28L28 72',
});
const QMARK = IC.q;
/* ICON(nameOrPath, sizePx, color = '#fff', strokeWidth = 6) → inline <svg> string */
const ICON = (d, size, color = '#fff', sw = 6) => `<svg width="${size}" height="${size}" viewBox="0 0 100 100" style="flex:none;overflow:visible"><path d="${IC[d] || d}" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

/* .mini = solid dark card (NO backdrop-filter → footage behind stays sharp) · .minichip = small capsule label */
document.head.insertAdjacentHTML('beforeend', `<style>
.mini{background:linear-gradient(160deg,rgba(24,32,50,.78),rgba(8,12,22,.70));border:1.5px solid rgba(255,255,255,.16);border-radius:32px;box-shadow:0 24px 60px rgba(0,0,0,.5),inset 0 1px 0 rgba(255,255,255,.14)}
.minichip{display:inline-flex;align-items:center;gap:12px;white-space:nowrap;padding:8px 22px 11px;border-radius:999px;border:1.5px solid var(--line);background:rgba(143,211,255,.12);font-family:BodyFont;font-size:30px;color:#fff}
</style>`);

/* widget(css, t0, t1, {card, round, sound}) — absolutely-positioned overlay that eases in over 0.8 s from t0 and blurs out over the 0.4 s before t1.
   card:false → no card background (for chips / icons that stand alone); round:true → circle card. Returns the element. */
function widget(css, t0, t1, {card = true, round = false, sound = true} = {}) {
  const w = div(css + ';opacity:0', G); if (card) w.className = 'mini';
  if (round) w.style.borderRadius = '50%';
  A(w, [{opacity: 0, transform: 'translateY(26px) scale(.9)', filter: 'blur(10px)'}, {opacity: 1, transform: 'none', filter: 'blur(0)'}], t0, .8, {e: SOFT});
  fadeOut(w, t1 - .4);
  if (sound) sfx('softswish', t0 - .03, -25, 1.2);
  return w;
}
/* popIn(el, t) — child element inside a widget eases up (el needs opacity:0 in its css) */
const popIn = (el, t, d = .7) => A(el, [{opacity: 0, transform: 'translateY(16px) scale(.92)'}, {opacity: 1, transform: 'none'}], t, d, {e: SOFT});

/* strikeChip(label, t0, t1, tCut, {top, size, icon}) — centred chip that gets crossed out at tCut ("not discounts", "not X") */
function strikeChip(label, t0, t1, tCut, {top = 300, size = 48, icon} = {}) {
  const w = widget(`left:0;width:1080px;top:${top}px;text-align:center`, t0, t1, {card: false});
  w.innerHTML = `<span class="minichip" style="font-size:${size}px;padding:${size * .27}px ${size * .75}px ${size * .35}px;position:relative;background:rgba(8,12,22,.75)">${icon ? ICON(icon, size * 1.05, '#fff', 7) : ''}${label}
    <svg viewBox="0 0 100 20" preserveAspectRatio="none" style="position:absolute;left:4%;top:42%;width:92%;height:${size * .5}px;overflow:visible"><path class="cut" d="M0 16L100 4" stroke="${BLUE}" stroke-width="${size / 6}" vector-effect="non-scaling-stroke" stroke-linecap="round" fill="none" style="filter:drop-shadow(0 0 8px ${BLUE})"/></svg></span>`;
  draw(w.querySelector('.cut'), tCut, .45);
  A(w.firstChild, [{opacity: 1}, {opacity: .5}], tCut + .3, .5, {f: 'forwards'});
  sfx('stamp', tCut + .03, -21);
  return w;
}
/* iconChip(icon, label, t, {size}) → element (not yet placed): a capsule with a drawn icon; put it in a flex row and fade it yourself */
function iconChip(icon, label, t, parent, {size = 42} = {}) {
  const c = div('position:relative;opacity:0', parent, `<span class="minichip" style="font-size:${size}px;padding:${size * .28}px ${size * .7}px ${size * .36}px;background:rgba(8,12,22,.75)">${ICON(icon, size * 1.2, BLUE, 7)}${label}</span>`);
  c.style.position = 'relative';
  A(c, [{opacity: 0, transform: 'translateY(26px) scale(.9)', filter: 'blur(10px)'}, {opacity: 1, transform: 'none', filter: 'blur(0)'}], t, .8, {e: SOFT});
  draw(c.querySelector('path'), t + .1, .8);
  sfx('softswish', t - .03, -25, 1.2);
  return c;
}
