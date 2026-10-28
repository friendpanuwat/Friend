/* ===================== OVERLAY KIT — minimal pop-up cards on the clip (minimal-talking-shorts-overlay) =====================
   The speaker stays on screen the whole clip: no full-screen scenes. Each picture is ONE small white card that pops up in the
   free space above the head (or beside the body), drawn inside with the minimal kit — solid black pictograms, thin outline
   objects, grey small type, bold black Thai, one red accent. One card at a time; each card is designed for its sentence. */
const POP = {top: 170, gap: 40};   // keep below the platform's top tabs · keep this far above the (zoomed) head
/* a card from t0 to t1, centred at x; top defaults to just above the head. Returns the card (draw inside in card px). */
function pop(t0, t1, {w = 760, h = 330, x = SAFE.cx, y} = {}) {
  const heads = faceAt(t0, t1).map(f => f.top), head = heads.length ? Math.min(...heads) : 1e9;
  const top = y ?? Math.max(POP.top, head - POP.gap - h);
  if (top + h > head - 20) FACE_ERRORS.push(`pop ${t0}-${t1} (y ${top}-${top + h}) reaches the head (top ${head} when zoomed) — make it shorter or move it`);
  if (x - w / 2 < SAFE.l || x + w / 2 > SAFE.r) FACE_ERRORS.push(`pop ${t0}-${t1} (x ${x - w / 2}-${x + w / 2}) leaves the safe area x ${SAFE.l}-${SAFE.r}`);
  const box = div(`left:${x - w / 2}px;top:${top}px;width:${w}px;height:${h}px;border-radius:44px;background:#fff;border:3.5px solid ${NIB};box-shadow:0 26px 60px rgba(0,0,0,.38);overflow:hidden;transform-origin:50% 100%`, Q);
  A(box, [{opacity: 0, transform: 'translateY(34px) scale(.86)'}, {opacity: 1, transform: 'none'}], t0, .42, {e: SPRING});
  A(box, [{opacity: 1, transform: 'none'}, {opacity: 0, transform: 'translateY(-14px) scale(.94)'}], t1 - .25, .25, {e: INOUT, f: 'forwards'});
  return box;
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
