/* =====================================================================
   CutPack · editorial · LOCKED MOTION SET (v1)
   Every part (parts/*.js) moves only through `mv.*` and the kit helpers of engine_head.html
   (tile, panel, bars, trend, stars, target, cross, bubble, pill, num, txt, mood, curl, ripple), which already use
   these same curves. Parts never call A() / el.animate() / cubic-bezier() / Math.random() themselves:
   tools/check_parts.py rejects them. Values are the skill's own; the few motions the skill did not have yet
   (count, slide, dim, ring) are marked NEW and reuse its curves.
   ===================================================================== */
/* load every card font before the first measure (FITS): a font no visible text uses yet is not fetched,
   and text measured in the fallback face fits wrong (B01.v2 ring number, Friend 2026-11-03) */
['KeySans', 'KeySerif', 'Lead', 'CardSans'].forEach(f => div(`left:-9999px;top:0;font-family:${f}`, document.body, 'กขคฅ ึ่้ 0123'));

const MOTION = Object.freeze({
  cut:    {d: .45, e: SMOOTH, from: 1.035},    // card hard-cut in, stage settles 1.035 → 1        (skill card())
  lead:   {d: .20, e: SMOOTH},                 // small words fade up out of a blur               (skill chunk())
  key:    {d: .26, e: SMOOTH},                 // big word pops 1.16 → 1, blur → sharp            (skill chunk())
  type:   {step: .045, d: .12},                // typewriter, grapheme by grapheme                 (skill chunk o.type)
  pop:    {d: .50, e: BOUNCE},                 // icon / tile springs in with overshoot           (skill popIn)
  rise:   {d: .55, e: SPRING},                 // panel slides up 140 px                          (skill panel)
  chip:   {d: .32, e: SPRING},                 // pill rises 40 px                                (skill pill)
  grow:   {d: .55, e: BOUNCE, step: .07},      // bars grow from the floor                        (skill bars)
  fall:   {d: .50, e: SMOOTH, step: .06},      // bars move to new heights at the key word        (skill bars to/tTo)
  draw:   {d: .70, e: INOUT},                  // a line draws itself                             (skill draw/trend)
  stroke: {d: .18},                            // one stroke of a cross                           (skill cross)
  punch:  {d: .42, s: 1.14},                   // HIT: quick scale bump                           (skill punch)
  wobble: {d: .55, a: 9},                      // HIT: shake ±9°                                   (skill wobble)
  ripple: {d: .60},                            // HIT: accent ring spreads                        (skill ripple)
  float:  {a: .06, p: 1.7},                    // idle drift, amplitude = 6 % of the size         (skill float)
  stagger: .12,                                // gap between items of one group (0.1–0.2 in the skill)
  count:  {d: .70, e: SMOOTH},                 // NEW: number counts up to its value
  slide:  {d: .50, e: INOUT},                  // NEW: an element slides to a new place (before → after)
  dim:    {d: .30, e: SMOOTH, o: .32},         // NEW: the losing side fades back
  ring:   {d: .80, e: INOUT},                  // NEW: a progress ring fills (draw on a circle)
});
/* sound paired with each motion (the calm mix in engine_head keeps only the strongest cue per 0.9 s) */
const SOUND = Object.freeze({cut: ['whoosh', -24], pop: ['pop', -25], chip: ['pop_lo', -27], hit: ['thud', -16],
  cross: ['stamp', -21], swipe: ['swipe', -25], tick: ['tick', -26], key: ['softswish', -22], big: ['sub', -18]});
const snd = (name, t) => sfx(SOUND[name][0], t, SOUND[name][1]);

const mv = {
  pop:    (el, t, from = 'scale(0) rotate(-14deg)') => popIn(el, t, {d: MOTION.pop.d, from, e: MOTION.pop.e}),
  rise:   (el, t, dy = 140) => A(el, [{opacity: 0, transform: `translateY(${dy}px) scale(.96)`, filter: 'blur(10px)'}, {opacity: 1, transform: 'none', filter: 'blur(0)'}], t, MOTION.rise.d, {e: MOTION.rise.e}),
  chip:   (el, t) => A(el, [{opacity: 0, transform: 'translateY(40px) scale(.92)', filter: 'blur(8px)'}, {opacity: 1, transform: 'none', filter: 'blur(0)'}], t, MOTION.chip.d, {e: MOTION.chip.e}),
  lead:   (el, t) => A(el, [{opacity: 0, transform: 'translateY(16px)', filter: 'blur(7px)'}, {opacity: 1, transform: 'none', filter: 'blur(0)'}], t, MOTION.lead.d, {e: MOTION.lead.e}),
  key:    (el, t) => A(el, [{opacity: 0, transform: 'scale(1.16)', filter: 'blur(14px)'}, {opacity: 1, transform: 'scale(1)', filter: 'blur(0)'}], t, MOTION.key.d, {e: MOTION.key.e}),
  punch:  (el, t) => punch(el, t, MOTION.punch.s),
  wobble: (el, t) => wobble(el, t, {d: MOTION.wobble.d, a: MOTION.wobble.a}),
  draw:   (path, t, d = MOTION.draw.d) => draw(path, t, d),
  float:  (el, t0, t1, size) => float(el, t0, t1, {a: size * MOTION.float.a, p: MOTION.float.p}),
  grow:   (el, t, v, k = 0) => A(el, [{transform: 'scaleY(0)'}, {transform: `scaleY(${v})`}], t + k * MOTION.grow.step, MOTION.grow.d, {e: MOTION.grow.e}),
  growX:  (el, t, v, k = 0) => A(el, [{transform: 'scaleX(0)'}, {transform: `scaleX(${v})`}], t + k * MOTION.grow.step, MOTION.grow.d, {e: MOTION.grow.e}),
  fallTo: (el, t, v0, v1, k = 0, axis = 'Y') => A(el, [{transform: `scale${axis}(${v0})`}, {transform: `scale${axis}(${v1})`}], t + k * MOTION.fall.step, MOTION.fall.d, {e: MOTION.fall.e, f: 'forwards'}),
  slide:  (el, t, from, to) => A(el, [{transform: from}, {transform: to}], t, MOTION.slide.d, {e: MOTION.slide.e, f: 'forwards'}),
  dim:    (el, t) => A(el, [{opacity: 1, filter: 'saturate(1)'}, {opacity: MOTION.dim.o, filter: 'saturate(0)'}], t, MOTION.dim.d, {e: MOTION.dim.e, f: 'forwards'}),
  show:   (el, t) => A(el, [{opacity: 0}, {opacity: 1}], t, .12, {e: 'linear'}),
  /* NEW count: the text of `el` counts from `from` to `to`, recomputed on every seek (deterministic) */
  count:  (el, t, from, to, fmt = v => Math.round(v).toLocaleString('en-US')) => {
    const p = x => { const k = Math.min(1, Math.max(0, (x - t) / MOTION.count.d)); return 1 - Math.pow(1 - k, 3); };
    HOOKS.push(tt => { el.textContent = fmt(from + (to - from) * p(tt)); });
  },
  /* NEW ring: circle stroke fills to fraction f (0..1) */
  ring:   (circle, t, f, f0 = 0) => { circle.setAttribute('pathLength', 1); circle.style.strokeDasharray = 1;
    A(circle, [{strokeDashoffset: 1 - f0}, {strokeDashoffset: 1 - f}], t, MOTION.ring.d, {e: MOTION.ring.e}); },
};

/* =====================================================================
   PART REGISTRY. A part = one variant of one base category, built inside a full-screen card.
   meta: {name, bgs:[allowed card backgrounds], slots:{name:{type:'text'|'number'|'icon'|'list'|'choice', max, req, ...}},
          dur:[min,max] seconds, hit:'what happens at the key word'}
   build(c, s, T): c = card stage, s = slot values, T = {t0, t1, hit, bg}. Return nothing.
   ===================================================================== */
const PARTS = {};
function PART(cat, v, meta, build) { (PARTS[cat] ??= {})[v] = {meta, build}; }
/* place one part as a card: part('B01','v1', t0, t1, {hit, bg, ...slots}) — the timeline must list the window in cards() */
function part(cat, v, t0, t1, opts) {
  const P = PARTS[cat]?.[v]; if (!P) throw new Error(`unknown part ${cat}.${v}`);
  const {hit = t0 + .6, bg = P.meta.bgs[0], ...s} = opts;
  if (!P.meta.bgs.includes(bg)) throw new Error(`${cat}.${v}: background ${bg} not allowed (${P.meta.bgs})`);
  for (const [k, spec] of Object.entries(P.meta.slots)) {
    if (spec.req && (s[k] == null || s[k] === '')) throw new Error(`${cat}.${v}: slot ${k} missing`);
    if (spec.max && typeof s[k] === 'string' && graphemes(s[k]).length > spec.max) throw new Error(`${cat}.${v}: slot ${k} longer than ${spec.max}`);
    if (spec.type === 'icon' && s[k] && !ICONS[s[k]]) throw new Error(`${cat}.${v}: unknown icon ${s[k]}`);
  }
  const c = card(t0, t1, {bg: bg === 'glow' ? 'black' : bg, sound: SOUND.cut[0], db: SOUND.cut[1]});
  if (bg === 'glow') mood(c, {seed: (t0 * 7) % 3});
  // no curl() page corners on cream: Friend 2026-11-03 — the black corner crescents read as a stray edge
  P.build(c, s, {t0, t1, hit, bg});
  return c;
}
/* colours that read on each background: main ink, soft ink, solid tile, glass-or-solid secondary tile */
const ON = {
  glow:  {ink: '#FFFFFF', soft: 'rgba(255,255,255,.62)', tile: '#FFFFFF', tileInk: INK, sub: 'glass', track: 'rgba(255,255,255,.12)'},
  black: {ink: '#FFFFFF', soft: 'rgba(255,255,255,.62)', tile: '#FFFFFF', tileInk: INK, sub: '#1A1F2E', track: 'rgba(255,255,255,.12)'},
  navy:  {ink: '#FFFFFF', soft: 'rgba(255,255,255,.66)', tile: '#FFFFFF', tileInk: NAVY, sub: '#1B2A52', track: 'rgba(255,255,255,.14)'},
  white: {ink: NAVY, soft: 'rgba(20,33,61,.58)', tile: NAVY, tileInk: '#FFFFFF', sub: '#EEF0F4', track: 'rgba(20,33,61,.10)'},
  cream: {ink: NAVY, soft: 'rgba(20,33,61,.58)', tile: NAVY, tileInk: '#FFFFFF', sub: '#FFFFFF', track: 'rgba(20,33,61,.12)'},
};
/* card text in the skill's rhythm: lead line (small) + key line (big, accent on dark, navy-on-accent box on light) */
function cardText(c, T, lead, key, top = 1240, {keyStyle} = {}) {
  const o = ON[T.bg], dark = o.ink === '#FFFFFF';
  const rows = [];
  if (lead) rows.push([[lead, 'l', T.t0 + .15, {color: o.ink}]]);
  if (key) rows.push([[key, keyStyle ?? (dark ? 'k' : 'hl'), T.hit, {}]]);
  const el = txt(c, rows, `top:${top}px`, {H: 380});
  el.style.rowGap = '26px';             // Thai marks above the key word must clear the lead line (Friend 2026-11-03)
  if (key) snd('key', T.hit - .04);
  return el;
}
