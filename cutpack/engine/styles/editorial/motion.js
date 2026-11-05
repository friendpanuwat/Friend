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
  fill:   {d: 1.0, e: INOUT},                   // NEW: a bar fills in one smooth run that ends on the key word (Friend: "วิ่งแบบสมูท")
  fly:    {d: .22, e: 'cubic-bezier(.5,0,1,1)'},  // an arrow flies in and lands (the skill's target() curve)
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
  /* NEW fill: scale an element along X (or Y) from f0 to f1 in one smooth run that ENDS at tEnd */
  fill:   (el, tEnd, f0, f1, axis = 'X') => A(el, [{transform: `scale${axis}(${f0})`}, {transform: `scale${axis}(${f1})`}], tEnd - MOTION.fill.d, MOTION.fill.d, {e: MOTION.fill.e}),
  fly:    (el, t, from) => A(el, [{opacity: 0, transform: from}, {opacity: 1, transform: 'translate(0,0)'}], t, MOTION.fly.d, {e: MOTION.fly.e}),
  /* NEW count: the text of `el` counts from `from` to `to`, recomputed on every seek (deterministic) */
  count:  (el, t, from, to, fmt = v => Math.round(v).toLocaleString('en-US')) => {
    const p = x => { const k = Math.min(1, Math.max(0, (x - t) / MOTION.count.d)); return 1 - Math.pow(1 - k, 3); };
    HOOKS.push(tt => { el.textContent = fmt(from + (to - from) * p(tt)); });
  },
  /* NEW ring: circle stroke fills to fraction f (0..1) */
  /* with = another motion's timing, e.g. MOTION.slide, so the ring moves in lockstep with that element */
  ring:   (circle, t, f, f0 = 0, w = MOTION.ring) => { circle.setAttribute('pathLength', 1); circle.style.strokeDasharray = 1;
    A(circle, [{strokeDashoffset: 1 - f0}, {strokeDashoffset: 1 - f}], t, w.d, {e: w.e}); },
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
  // dark card backgrounds are always 'glow' (Friend 2026-11-03): plain navy cards are not offered by any part
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
/* the app's right-hand buttons sit over x > 940 from y 860 to 1620. Text centred on 540 that may reach that height is at most
   SAFE_W wide, so it ends at x 940 (Friend 2026-11-04: shrink card text like the subtitles); longer text shrinks, never wraps mid-word. */
const STRIP = Object.freeze({x: 940, y0: 860, y1: 1620}), SAFE_W = 2 * (STRIP.x - 540);   // 800
/* card text in the skill's rhythm: lead line (small) + key line (big, accent on dark, navy-on-accent box on light) */
function cardText(c, T, lead, key, top = 1350, {keyStyle} = {}) {
  top = 1350;   // Friend 2026-11-04: text lower than the skill's 1200 band start — one height for every card, ends above the bottom 300 px
  const o = ON[T.bg], dark = o.ink === '#FFFFFF';
  const rows = [];
  if (lead) rows.push([[lead, 'l', T.t0 + .15, {color: o.ink}]]);
  if (key) rows.push([[key, keyStyle ?? (dark ? 'k' : 'hl'), T.hit, {}]]);
  const el = txt(c, rows, `top:${top}px`, {H: 380, W: SAFE_W});
  el.style.rowGap = '26px';             // Thai marks above the key word must clear the lead line (Friend 2026-11-03)
  if (key) snd('key', T.hit - .04);
  return el;
}

/* =====================================================================
   OVERLAY WIDGETS (editorial-overlay form): the same look and motion, as a small white card that pops up in the free
   space while the speaker stays on screen. Rules from the overlay skill: white card, ≤ ~600×380, ≤ 3 words of text,
   one main piece + ≤ 2 secondary, no glass, never over the face. Two sizes:
     short  — above the head (in Friend's sample clip that band is only ~190 px tall)
     narrow — beside the head (left of the head, ~210 px wide)
   WIDGET(cat, v, meta, build): build(vis, S, s, T, L) draws the main visual into an S×S box; the kit lays out the card
   and the text (s.wlead small, s.wkey big). meta needs name, slots, dur, hit (bgs is always the footage: ['clip']).
   ===================================================================== */
const WIN = Object.freeze({d: .48, e: BOUNCE, dy: 46, s: .78}), WOUT = Object.freeze({d: .16, s: .86});   // skill widget()
const WSIZE = Object.freeze({short: {W: 600, H: 190}, narrow: {W: 210, H: 380}});
const WAT = Object.freeze({short: {x: 240, y: 150}, narrow: {x: 36, y: 400}});    // free space in the sample clip
const WPARTS = {};
function WIDGET(cat, v, meta, build) { (WPARTS[cat] ??= {})[v] = {meta, build}; }
function wbox(css, t0, t1) {
  const w = div(css + ';opacity:0;background:#fff;border-radius:36px;box-shadow:0 24px 60px rgba(0,0,0,.45),0 4px 12px rgba(0,0,0,.25);overflow:hidden', G);
  A(w, [{opacity: 0, transform: `translateY(${WIN.dy}px) scale(${WIN.s})`}, {opacity: 1, transform: 'none'}], t0, WIN.d, {e: WIN.e});
  A(w, [{opacity: 1, transform: 'none'}, {opacity: 0, transform: `scale(${WOUT.s})`}], t1 - WOUT.d, WOUT.d, {f: 'forwards', e: 'ease-in'});
  sfx('softswish', t0 - .03, -25);
  return w;
}
/* place one widget: widgetAt('B01','v1','short', t0, t1, {hit, pos:{x,y}, ...slots}) */
function widgetAt(cat, v, kind, t0, t1, opts) {
  const P = WPARTS[cat]?.[v]; if (!P) throw new Error(`unknown widget ${cat}.${v}`);
  const L = Object.assign({kind}, WSIZE[kind]); if (!L.W) throw new Error(`widget size ${kind}?`);
  const {hit = t0 + .5, pos: at = WAT[kind], ...s} = opts;   // pos, not at: `at` is a slot (item times) in some categories
  for (const [k, spec] of Object.entries(P.meta.slots)) {
    if (spec.req && (s[k] == null || s[k] === '')) throw new Error(`${cat}.${v} widget: slot ${k} missing`);
    if (spec.type === 'icon' && s[k] && !ICONS[s[k]]) throw new Error(`${cat}.${v} widget: unknown icon ${s[k]}`);
  }
  const w = wbox(`left:${at.x}px;top:${at.y}px;width:${L.W}px;height:${L.H}px`, t0, t1);
  const short = kind === 'short', S = short ? L.H - 36 : L.W - 30;
  /* short size (Friend 2026-11-05: "พื้นที่ว่างด้านขวามากเกินไป ใช้พื้นที่ให้คุ้ม", packs first, then the base widgets too): the card
     shrinks to fit its text, centred where the full card would be; meta.wide makes the visual box wider than tall (L.VW).
     narrow size: the text is centred across the card (Friend 2026-11-05: "การ์ดแนวตั้งอยากให้ตัวหนังสืออยู่กึ่งกลาง") */
  const VW = short && P.meta.wide ? Math.round(S * P.meta.wide) : S; L.VW = VW;
  const vis = div(short ? `left:18px;top:18px;width:${VW}px;height:${S}px` : `left:15px;top:15px;width:${S}px;height:${S}px`, w);
  const T = {t0, t1, hit, kind};
  if (!P.meta.full) {
    const tb = div(short ? `left:${VW + 40}px;top:0;width:${L.W - VW - 64}px;height:${L.H}px;display:flex;flex-direction:column;justify-content:center;gap:12px`
                         : `left:14px;top:${S + 28}px;width:${L.W - 28}px;height:${L.H - S - 44}px;display:flex;flex-direction:column;justify-content:flex-start;align-items:center;text-align:center;gap:12px`, w);
    tb.dataset.wtext = 1;   // 12 px: the big word's upper marks (ซื้อ) touched the lead line at 4–6 px (found 2026-11-04)
    const lw = s.wlead ?? s.lead, kw = s.wkey ?? s.key;
    if (lw) { const l = div(`position:relative;font-family:CardSans;font-size:${short ? 34 : 30}px;line-height:1.25;color:${NAVY};opacity:0;white-space:nowrap${short ? ';align-self:flex-start' : ''}`, tb); l.textContent = lw; fitW(l, short ? L.W - VW - 64 : L.W - 28);   /* never break a Thai word: shrink instead */ mv.lead(l, t0 + .2); }
    if (kw) { const k = div(`position:relative;align-self:${short ? 'flex-start' : 'center'};font-family:KeySans;font-size:${short ? 58 : 44}px;line-height:1.15;letter-spacing:-1px;color:${INK};background:${ACC};border-radius:12px;padding:0 .14em .04em;opacity:0;white-space:nowrap`, tb); k.textContent = kw; fitW(k, short ? L.W - VW - 70 : L.W - 36); mv.key(k, hit); }
  }
  P.build(vis, S, s, T, L, w);
  if (short) FITS.push(() => {   // after the text has been shrunk to fit: card width = visual + text + margins (the text box is the kit's, or B14's own)
    const tb = w.querySelector('[data-wtext]'); if (!tb) return;
    const tw = Math.max(0, ...[...tb.children].map(e => e.offsetLeft + e.offsetWidth)), CW = Math.min(L.W, Math.ceil(tb.offsetLeft + tw + 32));
    // centred in its slot also when the plan gives the slot (Friend 2026-11-05: in real clips the card sat at the slot's left
    // edge, off the middle; the slot is centred on the face, and the card stays inside it, so it still keeps off the face)
    w.style.width = `${CW}px`; w.style.left = `${at.x + (L.W - CW) / 2}px`;
  });
  return w;
}

/* =====================================================================
   SUBTITLES on the talking head, in the skill's style: a sentence is cut into 3–4 short chunks shown one after another;
   each chunk = small lead words + ONE big word (Friend 2026-11-04: "แยกเป็น 3-4 ท่อน"). Thai is cut at word boundaries
   (Intl.Segmenter), never inside a word. Rows are spaced so the big word's upper marks clear the lead line.
   subtitle(text, t0, t1, {top, key, keyAt}) — key: the word to make big in its chunk; keyAt: when it is said.
   ===================================================================== */
const SUBTOP = 1300;   // Friend 2026-11-04: lower than the skill's 1150; real clips take it from the chin, never higher
const SUBMAX = 12;   // Friend 2026-11-04: short chunks, about 12 letters
const SUBW = SAFE_W;   // widest a subtitle row may be: centred on 540 it ends at x 940, left of the app's buttons (DECISIONS: nothing past 940); longer rows shrink
/* Chunks come from the caption step (Haiku groups the subtitle, the customer checks it): "lead big / lead big / …".
   Without '/', the engine only cuts at the writer's spaces (never inside a Thai word): greedy chunks of ≤ SUBMAX letters,
   a number keeps its unit, the key ends its chunk. The big word is the chunk's last spaced token. */
function subChunks(text, n, key) {
  if (text.includes('/')) return text.split('/').map(c => { const ts = [];   // given chunks; a number still keeps its unit
    c.trim().split(/\s+/).filter(Boolean).forEach(t => { if (ts.length && /^[\d.,%]+$/.test(ts.at(-1))) ts[ts.length - 1] += ' ' + t; else ts.push(t); });
    return ts.map((t, k) => (k ? ' ' : '') + t); }).filter(c => c.length);
  const L = w => graphemes(w.trim()).length;
  let tok = [];
  text.split(/\s+/).filter(Boolean).forEach(ph => {
    const parts = key && ph.includes(key) && ph !== key ? [ph.slice(0, ph.indexOf(key)), key, ph.slice(ph.indexOf(key) + key.length)].filter(Boolean) : [ph];
    parts.forEach((t, k) => tok.push({t, sp: k === 0}));
  });
  const m = [];
  tok.forEach(x => { const prev = m.at(-1); if (prev && /^[\d.,%]+$/.test(prev.t) && x.t !== key) prev.t += ' ' + x.t; else m.push({...x}); });
  const out = []; let cur = [], acc = 0;
  m.forEach(x => { if (cur.length && acc + L(x.t) > SUBMAX) { out.push(cur); cur = []; acc = 0; }
    cur.push(x); acc += L(x.t); if (x.t === key) { out.push(cur); cur = []; acc = 0; } });
  if (cur.length) out.push(cur);
  return out.map(c => c.map((x, k) => (k && x.sp ? ' ' : '') + x.t));
}
function subSplit(words) { return [words.slice(0, -1).join('').trim(), words.at(-1).trim()]; }
function subtitle(text, t0, t1, {top = SUBTOP, key, keyAt, n, punch = false} = {}) {   // no zoom per word (Friend 2026-11-04: too frequent); camera moves come from push()
  const chunks = subChunks(text, n, key), span = (t1 - t0) / chunks.length;
  chunks.forEach((words, i) => {
    const a = t0 + i * span, b = a + span;
    const ki = words.findIndex(w => w.trim() === key);
    const [lead, big] = subSplit(words);
    const tb = ki >= 0 && keyAt != null ? Math.min(b - .2, Math.max(a + .1, keyAt)) : a + Math.min(.35, span * .4);
    const rows = []; if (lead) rows.push([[lead, 'l', a]]); rows.push([[big, i % 2 ? 'i' : 'k', tb]]);
    const el = cap({t0: a, t1: b, top, maxH: 320, W: SUBW, lines: rows});
    el.style.rowGap = '26px';
    snd('key', tb - .04);
    if (punch) { zoom(tb, i % 2 ? 1.06 : 1.09); zoom(b - .001, 1); }
  });
}

/* =====================================================================
   CAMERA: the talking-head-motion way (Friend 2026-11-04 — "ซูมพร่ำเพรื่อเกินไป ใช้แบบ talking-head-motion")
   - few and slow: 4–5 push-ins per clip (about one per 10 s), at least 4 s apart, only on strong lines
   - push(t): ease in-out to 1.04–1.06 over 1–1.5 s; pull(t): back to 1.0 over ~1 s when a new topic starts,
     or leave it — a cut into a card hides the reset (pull(t, true) = instant, under the cut)
   - no zoom hit on key words (the soft key sound is enough), never above 1.08, a slow breathing drift all along
   ===================================================================== */
const CAM = Object.freeze({z: 1.05, d: 1.4, back: 1.0, gap: 4, max: 1.08, breath: .014});
window.BREATH = CAM.breath;
const PUSHES = [];
function push(t, z = CAM.z, d = CAM.d) {
  if (z > CAM.max) throw new Error(`push ${z} is above ${CAM.max}`);
  const prev = PUSHES.at(-1); if (prev != null && t - prev < CAM.gap) throw new Error(`push at ${t}s is closer than ${CAM.gap}s to the one at ${prev}s`);
  PUSHES.push(t); ZOOM.push({t, z, d, io: true});
}
function pull(t, cut = false) { ZOOM.push(cut ? {t, z: 1, d: .001} : {t, z: 1, d: CAM.back, io: true}); }

/* =====================================================================
   AI-WRITTEN SCENES (Friend 2026-11-04: on from day one, no fixed cap per clip). Used when no library part fits.
   The scene code is the body of (c, T) => {…} for a card or (vis, S, T) => {…} for a widget; engine/plan/custom_check.py
   lets it use only this kit (no window, document, camera, other scenes, network). Here it is wrapped like a library
   part — same card or widget frame, same lead/key text, same checks — and cleaned once more after it ran (and after
   its FITS), in case a string was put together to slip past the check: anything that could load or run something goes.
   ===================================================================== */
let CUSTOM_N = 0;
const CLEAN_TAGS = 'script,iframe,object,embed,img,image,use,a,foreignObject,link,style,video,audio,canvas,form,input,base,meta';
function cleanScene(root) {
  root.querySelectorAll(CLEAN_TAGS).forEach(e => e.remove());
  for (const e of [root, ...root.querySelectorAll('*')]) {
    for (const a of [...e.attributes]) {
      const n = a.name.toLowerCase(), v = a.value.toLowerCase();
      if (n.startsWith('on') || n === 'href' || n === 'xlink:href' || n === 'src' || n === 'srcset' || n === 'srcdoc' ||
          /url\s*\(|javascript:|file:|https?:|@import|expression\s*\(/.test(v)) e.removeAttribute(a.name);
    }
  }
}
function customPart(t0, t1, opts, build) {
  const v = `c${CUSTOM_N++}`;
  PART('CU', v, {name: 'AI-written', bgs: ['glow', 'white', 'cream'], slots: {lead: {type: 'text', max: 26}, key: {type: 'text', max: 14}}, dur: [1, 3.5], hit: 'AI-written'},
    (c, s, T) => { build(c, T); cleanScene(c); FITS.push(() => cleanScene(c)); if (s.lead || s.key) cardText(c, T, s.lead, s.key); });
  return part('CU', v, t0, t1, opts);
}
function customWidget(kind, t0, t1, opts, build) {
  const v = `c${CUSTOM_N++}`;
  WIDGET('CU', v, {name: 'AI-written', slots: {}, dur: [1, 3.5], hit: 'AI-written'},
    (vis, S, s, T) => { build(vis, S, T); cleanScene(vis); FITS.push(() => cleanScene(vis)); });
  return widgetAt('CU', v, kind, t0, t1, opts);
}
