/* ===================== SCENES KIT — full-screen stages and the cuts between them (cinematic-cutout-shorts) ===================== */
/* stage(t0, t1, {look, enter, capY, sound}) → {root, c}
   look: 'dark' (main) · 'yellow' (the loud beat) · 'white' · 'orange' — mostly dark, yellow only where the line hits hardest.
   enter: 'cut' · 'whip' · 'rise' · 'fade' (pair a cut with flash() or smoke() for the reference's transitions).
   c = content stage in design px (x 60–1020 lands inside the safe area). Captions run over the stage at capY (null = none). */
function stage(t0, t1, {look = 'dark', enter = 'cut', capY = 1520, sound = true} = {}) {
  const sc = scene(t0, t1, {bg: INK, capY, enter, capInk: look === 'white' || look === 'yellow'});
  LOOK[look](sc.root);
  if (sound && enter !== 'cut') sfx('softswish', t0 - .05, -26);
  return sc;
}
/* beat(c, t0, t1, {first, last}) — one beat inside a stage: slides in from the right, out to the left (first / last skip it).
   Use beats to keep one stage on screen for 2–4 s while the picture still changes with the words. */
function beat(c, t0, t1, {first = false, last = false, dir = 1} = {}) {
  const el = div('left:0;top:0;width:1080px;height:1920px', c);
  // entrance holds only BEFORE it plays (fill backwards): a filter left on afterwards would clip the glow of what is inside
  if (!first) A(el, [{opacity: 0, transform: `translateX(${200 * dir}px)`, filter: 'blur(10px)'}, {opacity: 1, transform: 'none', filter: 'blur(0)'}], t0, .35, {f: 'backwards'});
  if (!last) A(el, [{opacity: 1, transform: 'none', filter: 'blur(0)'}, {opacity: 0, transform: `translateX(${-200 * dir}px)`, filter: 'blur(10px)'}], t1 - .25, .25, {e: EXIT, f: 'forwards'});
  return el;
}
/* flash(t) — warm light leak that blooms over the cut at t (orange → hot yellow → gone in ~0.5 s) */
function flash(t, {d = .5, sound = true} = {}) {
  const f = div(`inset:-200px;mix-blend-mode:screen;background:
    radial-gradient(ellipse 60% 45% at 30% 40%,${HOT} 0%,${EMBER}CC 35%,transparent 70%),
    radial-gradient(ellipse 50% 60% at 75% 65%,${GOLD}EE 0%,#FF3D00AA 40%,transparent 75%)`, X);
  A(f, [{opacity: 0, transform: 'translateX(-120px) scale(1.1)'}, {opacity: 1, transform: 'none', offset: .4}, {opacity: 0, transform: 'translateX(140px) scale(1.2)'}], t - d * .4, d, {e: 'ease-in-out', f: 'none'});
  f.style.opacity = 0;
  if (sound) sfx('swell', t - .35, -28);
}
/* smoke(t) — yellow smoke rolls up from the bottom, covers the frame at t, and clears upward (the cut hides inside it) */
function smoke(t, {color = YEL, d = .8, sound = true} = {}) {
  const r = rnd(Math.round(t * 100) + 11), box = div('inset:0', X);
  for (let i = 0; i < 9; i++) { const s = lerp(700, 1200, r()), x = lerp(-200, 1100, r());
    const b = div(`left:${x - s / 2}px;top:0;width:${s}px;height:${s}px;border-radius:50%;background:radial-gradient(circle,${i % 3 ? color : HOT} 0%,${color}EE 40%,${AMBER}00 72%);filter:blur(30px)`, box);
    A(b, [{transform: `translateY(2100px) scale(.7)`, opacity: 1}, {transform: `translateY(${lerp(500, 1300, r()) - s / 2}px) scale(1.25)`, opacity: 1, offset: .5}, {transform: `translateY(${-s - 200}px) scale(1.5)`, opacity: 0}], t - d * .5 + i * .02, d, {e: 'cubic-bezier(.4,0,.6,1)', f: 'none'});
    b.style.opacity = 0; }
  const veil = div(`inset:0;background:${color}`, box);   // a full cover for a split second so no frame edge shows
  A(veil, [{opacity: 0}, {opacity: 1, offset: .45}, {opacity: 1, offset: .55}, {opacity: 0}], t - d * .25, d * .5, {e: 'linear', f: 'none'}); veil.style.opacity = 0;
  if (sound) sfx('softswish', t - .3, -26);
}
