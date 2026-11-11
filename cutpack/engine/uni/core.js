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
  const small = (ST.overlay || ST.useSmall) && typeof SMALLS !== 'undefined' ? SMALLS[id] : null;   // an overlay (or a style that sets useSmall, ios) draws the scene's small form (overlay.js)
  (small || S.build)(kit(F, T), s, T);
  return F;
}

window.seek = async (t, src) => {
  if (!window.__fitted) { window.__fitted = true; FITS.forEach(f => f()); }
  if (src) {
    V.src = src; await V.decode();
    if (ST.blurred) { VB.src = src; await VB.decode(); }
  }
  ANIMS.forEach(a => { a.pause(); a.currentTime = ms(t); });
  for (const h of HOOKS) await h(t);
};
