/* =====================================================================
   CutPack · uni — one base set, many styles (test, Friend 2026-11-07)
   core: time, page, registries. A base scene (scenes/*.js) is written once with the kit (kit.js) and never names
   a colour, a font or a motion; a style (styles/*.js) is one rule file that answers the 7-item form:
   frame (layout) · surface (panels, badges) · how things are drawn (line, fill, glow) · colours · text · motion · sound.
   The page keeps the contract of core/render.js: window.seek(t, srcFrame) and window.SFX.
   ===================================================================== */
const ms = s => s * 1000;
const ANIMS = [], HOOKS = [], FITS = [], SFX = [];
const sfx = (s, t, db = -20) => SFX.push({s, t, db});
/* the sound rule (Friend 2026-11-05: frequent, repeated sounds were annoying; DECISIONS 3): sounds at least 2.5 s apart, none
   louder than −19 dB; inside any 2.5 s the strongest kind wins (the hit over the cut's whoosh), an earlier one on a tie */
const SFX_RANK = {sub: 5, stamp: 4, thud: 4, pop: 3.5, whoosh: 3, whoosh_long: 3, swipe: 2, softswish: 1, pop_lo: 1};
function calmSfx(list, gap = 2.5) {
  const order = [...list].sort((a, b) => (SFX_RANK[b.s] ?? 2) - (SFX_RANK[a.s] ?? 2) || a.t - b.t), kept = [];
  for (const c of order) if (kept.every(k => Math.abs(k.t - c.t) >= gap)) kept.push({...c, db: Math.min(c.db, -19)});
  return kept.sort((a, b) => a.t - b.t);
}
/* every animation is registered so a seek can set its time (finished fill:'none' ones drop out of document.getAnimations()) */
const A = (el, kf, t, d, o = {}) => {
  const a = el.animate(kf, {delay: ms(t), duration: ms(Math.max(d, .001)), easing: o.e ?? 'linear', fill: o.f ?? 'both', iterations: o.it ?? 1});
  ANIMS.push(a); return a;
};
const div = (css, parent, html = '') => { const d = document.createElement('div'); d.style.cssText = 'position:absolute;' + css; d.innerHTML = html; parent.appendChild(d); return d; };
const seg = new Intl.Segmenter('th', {granularity: 'grapheme'});
const graphemes = s => [...seg.segment(s)].map(x => x.segment);
/* easing curves any style may pick by name */
const EASE = Object.freeze({
  linear: 'linear', smooth: 'cubic-bezier(.2,.8,.2,1)', inout: 'cubic-bezier(.65,0,.35,1)', spring: 'cubic-bezier(.22,1.3,.36,1)',
  bounce: 'cubic-bezier(.34,1.56,.64,1)', soft: 'cubic-bezier(.25,1.12,.4,1)', calm: 'cubic-bezier(.45,.05,.25,1)',
  gentle: 'cubic-bezier(.3,.7,.3,1)', out: 'cubic-bezier(.45,0,.8,.6)',
});
const ease3 = p => 1 - Math.pow(1 - p, 3);
const easeIO = p => p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;

/* page layers: BG (style background) · v (speaker) · vb (blurred speaker) · SC (scenes) · TX (scene words) */
const BGL = document.getElementById('BG'), V = document.getElementById('v'), VB = document.getElementById('vb');
const SC = document.getElementById('SC'), TX = document.getElementById('TX');

const STYLES = {}, SCENES = {};
let ST = null;                                    // the style in use
function STYLE(id, def) { STYLES[id] = Object.assign({id}, def); }
/* SCENE(id, meta, build): meta = {name, story, slots: {name: {type, max, sample}}, beats: n}
   build(K, s, T): K = kit bound to the style, s = slot values, T = {t0, t1, hit, b: [beat times]} */
function SCENE(id, meta, build) { SCENES[id] = {meta, build}; }
/* MEANING(id, meta): what a sentence means (the AI picks this); several SCENEs (meta.meaning = id) are different pictures of it.
   meta = {name, when}. A scene without meta.meaning is its own meaning (the first six). */
const MEANINGS = {};
function MEANING(id, meta) { MEANINGS[id] = meta; }
function useStyle(id) {
  ST = STYLES[id]; if (!ST) throw new Error('unknown style ' + id);
  const css = document.createElement('style'); css.textContent = ST.css; document.head.appendChild(css);
  if (ST.setup) ST.setup();
}
/* beats: the story's moments inside [t0, t1] — evenly placed, the key word (hit) after the build-up */
function beatsOf(t0, t1, n = 4, at) {             // at: the key word's real time in a real clip (else the middle)
  const L = t1 - t0, hit = at ?? t0 + L * .5;
  const b = [t0 + .15]; for (let i = 1; i < n; i++) b.push(t0 + .15 + (hit - t0 - .15) * i / (n - 1));
  return {hit, b, after: hit + (t1 - hit) * .35};
}
/* play one base scene in the active style */
function play(id, t0, t1, slots = {}, opt = {}) {
  const S = SCENES[id]; if (!S) throw new Error('unknown scene ' + id);
  const s = {};
  for (const [k, spec] of Object.entries(S.meta.slots)) {
    s[k] = slots[k] ?? spec.sample;
    if (spec.max && typeof s[k] === 'string' && graphemes(s[k]).length > spec.max) throw new Error(`${id}: slot ${k} longer than ${spec.max}`);
    if (spec.type === 'icon' && !ICONS[s[k]]) throw new Error(`${id}: unknown icon ${s[k]}`);
  }
  const T = Object.assign({t0, t1}, beatsOf(t0, t1, S.meta.beats ?? 4, opt.hit), opt.T ?? {});
  const F = ST.frame(t0, t1, {index: opt.index ?? 0, scene: id, label: s.label});
  F.T = T;
  const small = (ST.overlay || ST.useSmall) && typeof SMALLS !== 'undefined' ? SMALLS[id] : null;   // an overlay (or a style that sets useSmall) draws the scene's small form (overlay.js)
  (small || S.build)(kit(F, T), s, T);
  CLIPWINS.push({t0, t1, F, T, index: opt.index ?? 0});
  return F;
}

/* REAL CLIPS for every style (system test 2026-11-12: Friend "ตัดต่อคลิปนี้ด้วยสไตล์ทั้ง 8"): a plan with CAPTIONS (every word of
   the clip, tools/clip_plan.py) is shown in each style's own subtitle look. A style with its own caption() (gold) keeps it.
   Each block goes where it is said: inside a scene in that scene's words place (ST.text with the scene's frame), on the speaker
   between scenes in the style's speakerFrame() at the subtitle height of faces.json, in an overlay style always as its
   chest subtitle (its sub(), without the key-word camera). A block is cut at a scene's edge; the scene's own words are empty. */
const CLIPWINS = [];
function subTop() { return typeof FACES !== 'undefined' && FACES.layout?.subtitleTop ? FACES.layout.subtitleTop : 1300; }
function clipCaption(c, j) {
  const n = c.parts.length, parts = c.parts.map(([w, t, k], i) => [w, t, k ?? (i === n - 1 ? 'k' : 'l')]);
  const lead = parts.filter(p => p[2] === 'l').map(p => p[0]).join(' '), key = parts.filter(p => p[2] === 'k').map(p => p[0]).join(' ');
  const kt = (parts.find(p => p[2] === 'k') ?? parts[0])[1];
  const w = CLIPWINS.find(x => c.t0 < x.t1 - .05 && c.t1 > x.t0 + .05);
  let a = c.t0, b = c.t1;
  if (w) { a = Math.max(a, w.t0); b = Math.min(b, w.t1); }
  else CLIPWINS.forEach(x => { if (x.t1 > a && x.t1 <= b && x.t0 < a) a = x.t1; if (x.t0 < b && x.t0 >= a) b = Math.min(b, x.t0); });
  if (b - a < .15) return;
  const sh = ST.capShift ?? .15;                               // how long after T.t0 the style's lead word comes in
  const T = {t0: a - sh, t1: b + (ST.capTail ?? 0), hit: Math.min(Math.max(kt, a + .05), b - .1), b: [a], after: b,   // capTail: a style that fades its words out early (split)
    clip: true, acc: !!c.acc, look: c.look, end: b};                // a real clip's block: accent word? the big word's look (editorial)
  let F, own = true;
  if (ST.overlay) { F = {small: true, big: true, index: w?.index ?? CLIPWINS.length}; own = false; T.cut = [a, b]; T.lead = a; }
  else if (w) F = w.F;
  else F = ST.speakerFrame ? ST.speakerFrame(a, b) : null;
  if (!F) return;
  const el = ST.text(F, T, lead, key);
  if (own && el) { A(el, [{visibility: 'hidden'}, {visibility: 'visible'}], a - .02, .001); A(el, [{visibility: 'visible'}, {visibility: 'hidden'}], b - .021, .001, {f: 'forwards'}); }
  if (el && !w && !ST.overlay) el.style.top = subTop() + 'px';
}
function clipCaptions() {
  if (typeof CAPTIONS === 'undefined' || ST.caption) return;
  CLIPWINS.forEach(x => (x.F.root ?? x.F.cam)?.classList.add('clip-scene'));
  /* editorial (card, card-overlay): the big word takes turns between bold Mitr (k) and handwritten Sriracha (i); a word the AI
     marked as mattering most gets the highlight box (hl) now and then (talking-head-editorial: "สลับคำสำคัญระหว่าง ตัวหนา Mitr
     กับ ลายมือ Sriracha ให้มีจังหวะ; ไฮไลต์กล่องสี (hl) ใช้กับคำที่เป็นการกระทำ/ตัวปัญหา") */
  let turn = 0, lastHl = -9;
  CAPTIONS.forEach((c, j) => {
    if (c.acc && j - lastHl >= 6) { c.look = 'hl'; lastHl = j; }
    else c.look = turn++ % 2 ? 'i' : 'k';
  });
  CAPTIONS.forEach(clipCaption);
  if (typeof ZOOMS !== 'undefined') camPlan();
}

/* CAMERA of a real clip (Friend 2026-11-12: "ซูมช้า 4–5 ครั้ง", the talking-head-motion way, plan in ZOOMS from clip_plan.py):
   slow pushes, eased in and out, and a soft breath between 1.0 and 1.014 so the frame never looks frozen (and never shows an
   edge). It moves the speaker's video only (the words and pictures do not zoom), about a point at the face (50% 45%), through
   the separate translate/scale properties so a style's own moves of the video (split's frame, an overlay that shrinks the
   speaker) still work under it. A push whose time meets an overlay that shrinks the speaker is left out. */
let CAM = null;
function camPlan() {
  const keys = [...ZOOMS].sort((x, y) => x.t - y.t), pairs = [];
  keys.forEach(k => { if (k.z > 1) pairs.push([k]); else if (pairs.length) pairs[pairs.length - 1].push(k); });
  const shrink = CLIPWINS.filter(x => x.F.big && !x.F.small && ST.overlay);
  CAM = pairs.filter(p => { const a = p[0].t, e = p[p.length - 1].t + p[p.length - 1].d; return !shrink.some(x => a < x.t1 && e > x.t0); }).flat();
}
function camAt(t) {
  let z = 1; for (const k of CAM) { if (t < k.t) break; z += (k.z - z) * easeIO(Math.min(1, (t - k.t) / k.d)); }
  return z * (1 + .007 * (1 + Math.sin(t * .3)));
}

window.seek = async (t, src) => {
  if (!window.__fitted) { window.__fitted = true; clipCaptions(); for (let i = 0; i < FITS.length; i++) FITS[i](); }   // (FITS may grow while it runs)
  if (src) {
    V.src = src; await V.decode();
    if (ST.blurred) { VB.src = src; await VB.decode(); }
  }
  ANIMS.forEach(a => { a.pause(); a.currentTime = ms(t); });
  if (CAM) { const z = camAt(t); V.style.translate = `${540 * (1 - z)}px ${864 * (1 - z)}px`; V.style.scale = String(z); }
  for (const h of HOOKS) await h(t);
};
