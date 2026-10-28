/* ===================== OVERLAY KIT — the cut-out look on the clip itself (cinematic-cutout-shorts-overlay) =====================
   The speaker stays on screen the whole clip: no full-screen scenes. Titles and stickers live in the free space above the head
   and beside it; a title can sit BEHIND the head (the speaker is cut out of every frame of that window and laid back on top);
   a yellow haze can rise from the bottom with a line in it. Nothing ever covers the face. */
const OV = {gap: 30};
const headTop = (t0, t1) => { const f = faceAt(t0, t1); return f.length ? Math.min(...f.map(x => x.top)) : 600; };
/* a drawing surface in design px (x 60–1020 lands in the safe x 60–900, scale .875) whose top is at screen y `top` */
function surface(layer, top, h) {
  return div(`left:0;top:${top}px;width:1080px;height:${h / .875}px;transform-origin:540px 0;transform:translateX(-60px) scale(.875)`, layer);
}
function life_(el, t0, t1, {from = 'up'} = {}) {
  window_(el, t0, t1);
  // individual translate / scale: the surface's own transform (the squeeze into the safe area) stays untouched
  A(el, from === 'pop' ? [{opacity: 0, scale: '.85'}, {opacity: 1, scale: '1'}] : [{opacity: 0, translate: `0 ${from === 'up' ? 60 : -60}px`}, {opacity: 1, translate: '0 0'}], t0, .3, {e: SMOOTH});
  A(el, [{opacity: 1}, {opacity: 0}], t1 - .2, .2, {e: EXIT, f: 'forwards'});
}

/* above(t0, t1, draw, {h, behind, overlap}) — the space above the head, h screen px tall.
   draw(s) draws on the surface s (design px: x 540 = centre of the safe area, y 0 = top of the space).
   behind: true → the space reaches `overlap` px down into the head and the head passes in front of it
   (frames of the window are cut out at build time — a little slower to build). */
function above(t0, t1, draw, {h = 300, behind = false, overlap = 70, sound = true} = {}) {
  const head = headTop(t0, t1), bottom = behind ? head + overlap : head - OV.gap, top = Math.max(SAFE.t, bottom - h);
  if (bottom - top < 120) FACE_ERRORS.push(`above ${t0}-${t1}: only ${bottom - top} px between y ${SAFE.t} and the head — use side() or a shorter title`);
  const s = surface(behind ? B : Q, top, bottom - top);
  draw(s); life_(s, t0, t1, {from: behind ? 'up' : 'pop'});
  if (sound) sfx(behind ? 'softswish' : 'pop', t0 - .03, -28);
  if (behind) MATTES.push([t0, t1]);
  for (const k of s.children) guard(k, t0, t1, 'above', {face: !behind});
  return s;
}
/* side(t0, t1, html, {side, y, w, h, disc, rot}) — a sticker beside the head (left: x 60 → the ear · right: the ear → x 900),
   sized to the room there; y = centre height on screen (default: level with the eyes) */
function side(t0, t1, html, {side: sd = 'left', y, w = 300, h = 300, disc: dsc = true, rot = 0, edge = false} = {}) {
  const f = faceBox(t0), zone = sd === 'left' ? [SAFE.l, f.x0 - OV.gap] : [f.x1 + OV.gap, SAFE.r];
  const room = zone[1] - zone[0], s = Math.min(1, room / w), W = w * s, H = h * s, cx = (zone[0] + zone[1]) / 2, cy = y ?? f.top + (f.bottom - f.top) * .38;
  if (room < 140) FACE_ERRORS.push(`side ${t0}-${t1} (${sd}): only ${Math.round(room)} px beside the head — use above()`);
  const box = div(`left:0;top:0;width:1080px;height:1920px`, Q);
  if (dsc) disc(box, cx, cy, Math.max(W, H) * .62, t0, {t1});
  const st = sticker(box, html, {x: cx, y: cy, w: W, h: H, rot, t: t0 + .08, t1, edge});
  window_(box, t0, t1); A(box, [{opacity: 1}, {opacity: 0}], t1 - .2, .2, {e: EXIT, f: 'forwards'});
  guard(st, t0, t1, 'side');
  return box;
}
/* haze(t0, t1, draw, {top}) — warm yellow haze rolls up from the bottom; draw(s) puts a line inside it (design px, y 0 =
   haze top). The haze starts below the chin, so it never touches the face. Word captions pause while it is up. */
function haze(t0, t1, draw, {color = YEL} = {}) {
  const f = faceAt(t0, t1), chin = f.length ? Math.max(...f.map(x => x.bottom)) : 1050, top = chin + 50;
  const box = div(`left:0;top:${top}px;width:1080px;height:${1920 - top}px;overflow:hidden`, Q);
  const mist = div(`left:-100px;right:-100px;top:0;bottom:0;background:linear-gradient(180deg,${color}00 0%,${color}AA 22%,${color}EE 55%,${AMBER} 100%)`, box);
  const r = rnd(Math.round(t0 * 10) + 3);
  for (let i = 0; i < 6; i++) { const s = lerp(380, 640, r()); const b = div(`left:${lerp(-150, 950, r())}px;top:${lerp(40, 260, r())}px;width:${s}px;height:${s}px;border-radius:50%;background:radial-gradient(${HOT}CC,${color}00 70%);filter:blur(24px)`, mist);
    A(b, [{translate: '0 0'}, {translate: `${(r() - .5) * 120}px -40px`}], t0, t1 - t0, {e: 'linear'}); }
  A(mist, [{transform: 'translateY(100%)'}, {transform: 'none'}], t0, .4, {e: SMOOTH});
  sfx('swell', t0 - .2, -30);
  A(mist, [{opacity: 1}, {opacity: 0}], t1 - .25, .25, {e: EXIT, f: 'forwards'});
  window_(box, t0, t1);
  const s = surface(box, 40, 1920 - top - 260);   // keep the bottom 255 px for the platform's caption / buttons
  draw(s); A(s, [{opacity: 1}, {opacity: 0}], t1 - .2, .2, {e: EXIT, f: 'forwards'});
  capOff(t0, t1); for (const k of s.children) guard(k, t0, t1, 'haze');
  return box;
}
/* behindRain(t0, t1, make, opts) — small stickers falling BEHIND the speaker (rain() options; the head passes in front) */
function behindRain(t0, t1, make, opts = {}) {
  const box = div('left:0;top:0;width:1080px;height:1920px', B); window_(box, t0, t1);
  rain(box, make, {t0, t1, area: [60, SAFE.t - 200, 900, 1500], ...opts});
  A(box, [{opacity: 1}, {opacity: 0}], t1 - .25, .25, {e: EXIT, f: 'forwards'});
  MATTES.push([t0, t1]);
  return box;
}
