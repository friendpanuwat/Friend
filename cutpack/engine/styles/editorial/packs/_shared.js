/* =====================================================================
   Shared by the content packs (loads first: "_" sorts before the pack names).
   human(): a flat solid person with real proportions — head, neck, shoulders, waist, arms and legs — in place of the stick
   figure (Friend 2026-11-04: "อยากได้คนที่มันสมจริงกว่านี้"). Still one solid colour, never a photo.
   jointed(): the same person seen from the side, built from pivots (ankle → knee → hip → shoulder) so a move like a squat
   bends at the joints instead of squashing the whole figure. Poses turn the pivots with mv.slide only.
   ===================================================================== */
/* pose: 'stand' | 'up' (arms raised) | 'slouch' (head and shoulders forward, arms hanging) — viewBox 200×400 */
function human(parent, css, color, pose = 'stand') {
  const arms = {stand: 'M60 100 Q42 160 44 228 M140 100 Q158 160 156 228', up: 'M60 100 Q30 60 40 0 M140 100 Q170 60 160 0',
                slouch: 'M64 108 Q52 168 58 236 M136 108 Q148 168 142 236'}[pose];
  const head = pose === 'slouch' ? [108, 54] : [100, 44], tilt = pose === 'slouch' ? 'rotate(7 100 236)' : '';
  // a see-through colour would show every join where the shapes overlap: draw solid, fade the whole person instead
  const m = /rgba\(([^,]+),([^,]+),([^,]+),\s*([\d.]+)\)/.exec(color), fill = m ? `rgb(${m[1]},${m[2]},${m[3]})` : color, alpha = m ? m[4] : 1;
  return div(css, parent, `<svg width="100%" height="100%" viewBox="0 0 200 400" style="display:block;overflow:visible"><g opacity="${alpha}" fill="${fill}" stroke="${fill}" stroke-linecap="round" stroke-linejoin="round">
    <g transform="${tilt}"><circle cx="${head[0]}" cy="${head[1]}" r="31" stroke="none"/><rect x="88" y="70" width="24" height="24" rx="8" stroke="none" transform="translate(${head[0] - 100} 0)"/>
    <path d="M56 98 Q100 86 144 98 L136 212 Q100 220 64 212 Z" stroke-width="10"/><path d="${arms}" fill="none" stroke-width="26"/></g>
    <path d="M66 208 Q100 222 134 208 L138 246 L62 246 Z" stroke-width="8"/>
    <path d="M84 242 L80 382 M116 242 L120 382" fill="none" stroke-width="32"/><path d="M68 384 H92 M108 384 H132" fill="none" stroke-width="18"/></g></svg>`);
}
/* side view, facing right; (x, y) = the ankle on the floor. Returns {root, ankle, knee, hip, arm} pivots to turn. */
function jointed(parent, x, y, color, s = 1) {
  const P = (p, l, t) => div(`left:${l}px;top:${t}px;width:0;height:0;transform-origin:0 0`, p);
  const seg = (p, css) => div(`${css};background:${color}`, p);
  const root = div(`left:${x}px;top:${y}px;width:0;height:0;opacity:0`, parent);
  seg(root, `left:${-24 * s}px;top:${-10 * s}px;width:${100 * s}px;height:${26 * s}px;border-radius:${13 * s}px`);   // foot
  const ankle = P(root, 0, 0);
  seg(ankle, `left:${-23 * s}px;top:${-176 * s}px;width:${46 * s}px;height:${190 * s}px;border-radius:${23 * s}px`);   // shin
  const knee = P(ankle, 0, -170 * s);
  seg(knee, `left:${-28 * s}px;top:${-186 * s}px;width:${56 * s}px;height:${206 * s}px;border-radius:${28 * s}px`);   // thigh
  const hip = P(knee, 0, -180 * s);
  seg(hip, `left:${-44 * s}px;top:${-232 * s}px;width:${88 * s}px;height:${262 * s}px;border-radius:${40 * s}px ${44 * s}px ${30 * s}px ${30 * s}px`);   // torso
  seg(hip, `left:${-14 * s}px;top:${-262 * s}px;width:${28 * s}px;height:${40 * s}px;border-radius:${10 * s}px`);   // neck
  seg(hip, `left:${-38 * s}px;top:${-334 * s}px;width:${78 * s}px;height:${82 * s}px;border-radius:50%`);   // head
  const arm = P(hip, 6 * s, -210 * s);
  seg(arm, `left:${-17 * s}px;top:${-14 * s}px;width:${34 * s}px;height:${200 * s}px;border-radius:${17 * s}px`);   // arm, hanging
  return {root, ankle, knee, hip, arm};
}
/* one pose change on a jointed person, all joints together (degrees, each relative to its parent) */
function poseTo(J, t, from, to) {
  ['ankle', 'knee', 'hip', 'arm'].forEach(k => mv.slide(J[k], t, `rotate(${from[k] ?? 0}deg)`, `rotate(${to[k] ?? 0}deg)`));
}
const SQUAT = {ankle: 24, knee: -96, hip: 108, arm: -126};   // thighs near level, back leaning in, arms out front
