/* ===================== FACE KIT — where the head is, and pieces that sit BEHIND it =====================
   Layer B sits behind the speaker (the speaker is cut out of every frame and laid back on top) and moves less than the clip
   when the camera pushes: depth. Front pieces (layer Q) stay clear of the face. */
const headTopAt = (t0, t1) => Math.min(...faceAt(t0, t1).map(f => f.top));
const chinAt = (t0, t1) => Math.max(...faceAt(t0, t1).map(f => f.bottom));
const hd = t => headAt(t) ?? {x: 540, y: 800, r: 150};
/* a surface in design px squeezed into the safe area, its top at screen y — on layer B (behind) or Q (in front) */
function surface(behind, top, h = 900) {
  const s = div(`left:0;top:${top}px;width:1080px;height:${h}px;transform-origin:540px 0;transform:translateX(-60px) scale(.875)`, behind ? B : Q);
  return s;
}
const behindWin = (t0, t1) => MATTES.push([t0, t1]);

/* behindWord(t0, t1, word) — a giant beige word rises behind the head */
function behindWord(t0, t1, word, {size = 340, color = PAPER, lift = .62} = {}) {
  const h = hd(t0), s = surface(true, h.y - h.r * 1.25 - size * lift, size * 1.4); window_(s, t0, t1);
  reveal(s, 540, 0, word, t0, {size, weight: 700, color, align: 'center', w: 1000, track: -.035, lh: 1.05});
  fadeOut(s, t1); behindWin(t0, t1); sfx('softswish', t0 - .05, -28); return s;
}
/* behindHeadline(t0, t1, l1, l2) — a two-line headline set behind the head: line 2 sits in a paper box; the head overlaps it */
function behindHeadline(t0, t1, l1, l2, {t2 = t0 + .35, size = 110} = {}) {
  const h = hd(t0), top = Math.max(SAFE.t + 10, h.y - h.r * 1.25 - size * 1.7);   // low enough that the hair overlaps the box
  const s = surface(true, top, size * 3); window_(s, t0, t1);
  reveal(s, 540, 0, l1, t0, {size: size * .78, weight: 600, color: PAPER, align: 'center', w: 960});
  const bx = div(`left:540px;top:${size * 1.05}px;transform:translateX(-50%);padding:.05em .35em .16em;background:${PAPER};border-radius:16px;clip-path:inset(0 100% 0 0 round 16px)`, s);
  A(bx, [{clipPath: 'inset(0 100% 0 0 round 16px)'}, {clipPath: 'inset(0 0 0 0 round 16px)'}], t2, .55, {e: OUTX});
  const r = reveal(bx, 0, 0, l2, t2 + .12, {size, weight: 700, color: INK, w: 900}); r.style.position = 'relative'; r.style.width = 'auto';
  fadeOut(s, t1); behindWin(t0, t1); capOff(t0, t1); return s;
}
/* behindArcs(t0, t1) — quiet concentric arcs draw round the head, behind it */
function behindArcs(t0, t1, o = {}) {
  const h = hd(t0), box = div('left:0;top:0;width:1080px;height:1920px', B); window_(box, t0, t1);
  arcs(box, h.x, h.y, h.r * 1.9, t0, o); fadeOut(box, t1); behindWin(t0, t1); return box;
}
/* behindPanel(t0, t1, draw, {x, y, w, h}) — a paper panel behind the head and shoulders (the head overlaps its edge);
   draw(p) draws inside it in panel px. x, y, w, h are screen px. */
function behindPanel(t0, t1, draw, {x, y, w, h, r = 34} = {}) {
  const box = div('left:0;top:0;width:1080px;height:1920px', B); window_(box, t0, t1);
  const p = panel(box, x, y, w, h, t0, {r}); draw(p); fadeOut(box, t1); behindWin(t0, t1); return p;
}
/* lockOn(t0, t1) — four corner brackets snap onto the face and follow it */
function lockOn(t0, t1, {color = PAPER, pad = 30, arm = 64} = {}) {
  const box = div('left:0;top:0;width:0;height:0', Q); window_(box, t0, t1);
  const cs = [[0, 0], [1, 0], [0, 1], [1, 1]].map(([x, y]) => [div(`width:${arm}px;height:${arm}px;border-${x ? 'right' : 'left'}:6px solid ${color};border-${y ? 'bottom' : 'top'}:6px solid ${color}`, box), x, y]);
  HOOKS.push(t => { if (t < t0 || t > t1) return; const f = faceAtTracked(t, t)[0], p = clamp((t - t0) / .4), s = 1 + .55 * (1 - ease(p));
    const cx = (f.x0 + f.x1) / 2, cy = (f.top + f.bottom) / 2, hw = (f.x1 - f.x0) / 2 * s + pad, hh = (f.bottom - f.top) / 2 * s + pad;
    for (const [k, x, y] of cs) { k.style.left = (x ? cx + hw - arm : cx - hw) + 'px'; k.style.top = (y ? cy + hh - arm : cy - hh) + 'px'; k.style.opacity = p; } });
  fadeOut(box, t1); sfx('tick', t0, -28);
}
/* card(t0, t1, {x, y, w, h}) — a paper card in front, clear of the face (under the chin or beside the head) */
function card(t0, t1, {x, y, w, h, r = 34} = {}) {
  const box = div('left:0;top:0;width:1080px;height:1920px', Q); window_(box, t0, t1);
  const p = panel(box, x, y, w, h, t0, {r}); fadeOut(box, t1); guard(p, t0, t1, 'card'); return p;
}
/* checklist(t0, t1, items, {title}) — a paper list under the chin; each line ticks and writes itself when it is said */
function checklist(t0, t1, items, {title} = {}) {
  const rowH = 112, h = (title ? 100 : 34) + items.length * rowH + 16, y = Math.min(SAFE.b - h, chinAt(t0, t1) + 50);
  const p = card(t0, t1, {x: SAFE.l + 20, y, w: SAFE.w - 40, h});
  if (title) label(p, 44, 36, title, t0 + .15, {size: 36});
  items.forEach(([txt, t], i) => { const yy = (title ? 100 : 34) + i * rowH;
    const dot = div(`left:44px;top:${yy + 30}px;width:46px;height:46px;border-radius:50%;border:4px solid ${SAND}`, p);
    A(dot, [{background: 'transparent', borderColor: SAND}, {background: TAN, borderColor: TAN}], t, .3, {e: OUTQ});
    icon(dot, 'check', 19, 19, 30, t + .12, {color: PAPER, width: 12, dur: .35});
    reveal(p, 118, yy + 12, txt, t, {size: 62, weight: 600, w: SAFE.w - 220});
    if (i < items.length - 1) rule(p, 44, yy + rowH - 6, SAFE.w - 128, t + .2); });
  capOff(t0, t1); return p;
}
