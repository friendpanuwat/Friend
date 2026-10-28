/* ===================== OVERLAY KIT — minimal pop-up cards on the clip (minimal-talking-shorts-overlay) =====================
   The speaker stays on screen the whole clip: no full-screen scenes. Each picture is ONE small white card that pops up in the
   free space above the head (or beside the body), drawn inside with the minimal kit — solid black pictograms, thin outline
   objects, grey small type, bold black Thai, one red accent. One card at a time; each card is designed for its sentence. */
const POP = {top: SAFE.t, gap: 40};   // below the platform's top tabs (SAFE.t) · this far above the (zoomed) head
/* a card from t0 to t1, centred at x; top defaults to just above the head. Returns the drawing surface, w × h card px.
   When there is room the whole card grows (up to the safe width, ×1.15 at most) so type stays as big as the space allows. */
function pop(t0, t1, {w = 800, h = 240, x = SAFE.cx, y} = {}) {   // design size 800 × 240 fits between y 240 and most heads
  const heads = faceAt(t0, t1).map(f => f.top), head = heads.length ? Math.min(...heads) : 1e9;
  const room = (y === undefined ? head - POP.gap : 1e9) - Math.max(POP.top, y ?? POP.top);
  const s = clamp(Math.min(SAFE.w / w, room / h, 1.15), 1, 1.15), W = Math.round(w * s), H = Math.round(h * s);
  const top = y ?? Math.max(POP.top, head - POP.gap - H);
  if (top + H > head - 20) FACE_ERRORS.push(`pop ${t0}-${t1} (y ${top}-${top + H}) reaches the head (top ${head} when zoomed) — make it shorter or move it`);
  if (top < SAFE.t) FACE_ERRORS.push(`pop ${t0}-${t1} (y ${top}) starts above y ${SAFE.t} — the platform's top tabs cover it`);
  if (x - W / 2 < SAFE.l || x + W / 2 > SAFE.r) FACE_ERRORS.push(`pop ${t0}-${t1} (x ${x - W / 2}-${x + W / 2}) leaves the safe area x ${SAFE.l}-${SAFE.r}`);
  const box = div(`left:${x - W / 2}px;top:${top}px;width:${W}px;height:${H}px;border-radius:${Math.round(44 * s)}px;background:#fff;border:3.5px solid ${NIB};box-shadow:0 26px 60px rgba(0,0,0,.38);overflow:hidden;transform-origin:50% 100%`, Q);
  A(box, [{opacity: 0, transform: 'translateY(34px) scale(.86)'}, {opacity: 1, transform: 'none'}], t0, .42, {e: SPRING});
  A(box, [{opacity: 1, transform: 'none'}, {opacity: 0, transform: 'translateY(-14px) scale(.94)'}], t1 - .25, .25, {e: INOUT, f: 'forwards'});
  return div(`left:-3.5px;top:-3.5px;width:${w}px;height:${h}px;transform-origin:0 0;transform:scale(${s})`, box);   // drawing surface in design px
}
/* an svg the size of the card (card px), with the soft-shadow filter */
const cv = (box, inner) => { const w = parseFloat(box.style.width), h = parseFloat(box.style.height);
  return div(`left:0;top:0;width:${w}px;height:${h}px`, box, `<svg width="${w}" height="${h}" style="overflow:visible;display:block">${SHDEF}${inner}</svg>`); };
/* one beat inside a card: slides in from the right, out to the left (first / last skip the slide) */
function beat(box, t0, t1, {first = false, last = false} = {}) {
  const el = div('left:0;top:0;width:100%;height:100%', box);
  if (!first) A(el, [{opacity: 0, transform: 'translateX(120px)'}, {opacity: 1, transform: 'none'}], t0, .4, {e: EASE});
  if (!last) A(el, [{opacity: 1, transform: 'none'}, {opacity: 0, transform: 'translateX(-120px)'}], t1 - .28, .28, {e: 'cubic-bezier(.6,0,.9,.4)', f: 'forwards'});
  return el;
}
/* text in a card: left-aligned at (x, y) or centred on x with {center: true} */
const txt = (root, x, y, s, {size = 52, color = NIB, center = false, w = 640} = {}) =>
  div(`left:${center ? x - w / 2 : x}px;top:${y}px;${center ? `width:${w}px;text-align:center;` : ''}white-space:nowrap;${BOLD};font-size:${size}px;line-height:1.2;color:${color}`, root, s);
