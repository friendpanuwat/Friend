/* =====================================================================
   STYLE · gold-overlay (+ gold-overlay-big) — gold as widgets over the speaker (Friend 2026-11-11 "Ok" to style-rules/gold.md 8).
   Same look as `gold` (styles/gold.js: palette, glossy surfaces, motion, sound), only these change:
   1 frame    the speaker stays full screen; the picture's small form sits on the main black card with the orange glowing
              rim above the head, coming in with `pop` and leaving with `leave`
   5 words    the gold subtitle at chest height (small white lead + big gold key word), no dark band
   camera     a zoom cut to 1.08 on the key word, cut back when the card leaves (like card-overlay)
   ===================================================================== */
const GOLD_OV = {
  name: 'ทองส้มบนการ์ดดำ แบบ overlay',
  card: () => ({cls: 'gd gd-main', dark: true}),
  smallFrame(t0, t1, index, C) {
    const pad = 24, M = STYLES.gold.motion, root = div(`left:${C.x - pad}px;top:${C.y - pad}px;width:${C.w + 2 * pad}px;height:${C.h + 2 * pad}px;border-radius:40px`, SC);
    root.className = 'gd gd-main';
    A(root, M.pop.kf, t0, M.pop.d, {e: M.pop.e});
    A(root, M.leave.kf, t1 - M.leave.d, M.leave.d, {e: M.leave.e, f: 'forwards'});
    return {root, stage: div(`left:${pad}px;top:${pad}px;width:${C.w}px;height:${C.h}px`, root), dark: true};
  },
  sub(F, T, lead, key) {
    STYLES.gold.words(SC, {x: 70, y: OV.subTop, w: 860, h: 0}, false, [[lead, T.t0 + .15, 'l'], [key, T.hit, 'k']], T.t0, T.t1, true);
  },
  text(F, T, lead, key) {                            // a scene without a small form: the words inside the card
    if (lead) A(ovLine(F, lead, 'gd-l', 34), STYLES.gold.motion.lead.kf, T.t0 + .2, .25);
    if (key) A(ovLine(F, key, 'gd-k', 58), [{opacity: 0}, {opacity: 1}], T.hit, .3);
  },
  camera(T) {
    const z = 1.08, Z = `translate(${540 * (1 - z)}px,${700 * (1 - z)}px) scale(${z})`;
    A(V, [{transform: Z}, {transform: Z}], T.hit, T.t1 - T.hit, {f: 'none'});
  },
};
OVERLAY('gold-overlay', 'gold', GOLD_OV);
OVERLAY('gold-overlay-big', 'gold', {...GOLD_OV, name: 'ทองส้มบนการ์ดดำ แบบ overlay (ใหญ่ ย่อคนพูด)', size: 'big'});
