/* CutPack · uni · the screen choice of a style without a clip, a browser or a render (2026-11-24, chat ccr-7eb7a684-kfdx3f: found the
   lime split-after-split hole and the window hook bug, which the 3 real test clips had missed by chance).
   Loads styles/common.js + styles/<style>.js in node with a fake page, gives them a face that stays put (close / normal / far) and a
   run of picture windows like clip_plan.py makes (1.5–7.5 s, often back to back), then calls ST.frame() for every picture, one run per
   seed, and counts what breaks a rule. Only the choice is real: nothing is drawn or measured on a page (use build_only.sh for that).
   usage: node tools/sim_frames.js <style> [seeds = 300] [--against <git rev>]
     --against: the same runs with the style files of that commit too, and how many runs choose differently (a change that should
     leave a scenario alone must print 0 there)
   prints per scenario: the screens taken · the first picture (the hook) · rule breaks: a split right after a split (a close-up group
   counts as one), the same screen twice, a picture without a standard size, a split shorter than 2.7 s (lime) */
const fs = require('fs'), vm = require('vm'), path = require('path'), os = require('os'), {execFileSync} = require('child_process');
const UNI = path.resolve(__dirname, '..');
const args = process.argv.slice(2), ai = args.indexOf('--against'), REV = ai >= 0 ? args.splice(ai, 2)[1] : null;
const [style, N = 300] = [args[0], +(args[1] || 300)];
if (!style) { console.error('usage: node tools/sim_frames.js <style> [seeds] [--against <git rev>]'); process.exit(1); }
const FACE = {close: [120, 420, 960, 1300], normal: [360, 470, 720, 940], far: [450, 620, 630, 860]};   // [x0, forehead, x1, chin] on 1080 × 1920

function el() {                                    // just enough of a page element for the styles' frame()
  return {style: {}, dataset: {}, className: '', classList: {add() {}}, appendChild(c) { return c; }, animate() { return {}; }, setAttribute() {},
    set innerHTML(v) {}, get innerHTML() { return ''; },
    querySelector() { return {getTotalLength: () => 2000, getPointAtLength: () => ({x: 0, y: 0}), setAttribute() {}}; }};
}
const rnd = a => () => { a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
function windows(seed, dur = 80) {                 // picture windows as clip_plan.py makes them: the hook at 2.48 s, then 1.5–7.5 s each
  const r = rnd(seed), sc = []; let t = 2.48;
  while (t < dur - 2) { const t1 = Math.min(dur, t + 1.5 + r() * (r() < .5 ? 2 : 6)); sc.push([+t.toFixed(2), +t1.toFixed(2)]); t = t1 + (r() < .45 ? 0 : 1 + r() * 4); }
  return sc;
}
function sources(rev) {                            // common.js + the style, from the work tree or from a commit
  const f = n => rev ? execFileSync('git', ['show', `${rev}:cutpack/engine/uni/styles/${n}.js`], {cwd: UNI, encoding: 'utf8', maxBuffer: 1 << 26}) : fs.readFileSync(path.join(UNI, 'styles', n + '.js'), 'utf8');
  return f('common') + '\n' + f(style);
}
function run(src, kind, seed) {
  const ctx = {console, Math, JSON, Object, Array, String, Number, Intl, Infinity, getComputedStyle: () => ({}),
    document: {createElement: el, getElementById: el, body: el(), documentElement: {clientWidth: 1080}}};
  vm.createContext(ctx);
  const sc = windows(seed), track = []; for (let t = 0; t <= 90; t += .5) track.push([t, FACE[kind]]);
  vm.runInContext(`
    const ANIMS = [], HOOKS = [], FITS = [], SFX = [], sfx = () => {}, A = () => ({});
    const div = (css, parent) => { const d = document.createElement('div'); if (parent) parent.appendChild(d); return d; };
    const EASE = new Proxy({}, {get: () => ''});
    const BGL = document.getElementById('BG'), V = document.getElementById('v'), SC = document.getElementById('SC');
    const STYLES = {}, SCENES = {}, CLIPWINS = []; let ST = null; function STYLE(id, def) { STYLES[id] = Object.assign({id}, def); }
    const RUN = ${JSON.stringify({seed, scenes: sc, hook: true})}, FACES = ${JSON.stringify({track})};
    ${src}
    ST = STYLES[${JSON.stringify(style)}]; ST.setup();
    var OUT = RUN.scenes.map(([t0, t1], i) => { SCENES['s' + i] = {meta: {}}; const F = ST.frame(t0, t1, {index: i, scene: 's' + i}); CLIPWINS.push({t0, t1, F, index: i});
      const g = typeof LIME !== 'undefined' && LIME.plan && LIME.plan[i];
      return {t0, t1, name: F.name, std: F.L && F.L.std, split: !!(F.L && F.L.split), group: g ? g.g.t0 : null}; });`, ctx);
  return ctx.OUT;
}
const now = sources(null), old = REV ? sources(REV) : null;
for (const kind of Object.keys(FACE)) {
  const names = {}, first = {}, bad = {}, add = (k, s) => { (bad[k] ??= []).push(s); };
  let moved = 0;
  for (let seed = 1; seed <= N; seed++) {
    const o = run(now, kind, seed);
    first[o[0].name] = (first[o[0].name] ?? 0) + 1;
    o.forEach((p, k) => { names[p.name] = (names[p.name] ?? 0) + 1; const q = o[k - 1], same = q && p.group != null && p.group === q.group;
      if (!p.std) add('a picture without a standard size', `seed ${seed} #${k} ${p.name}`);
      if (q && q.split && p.split && !same) add('a split right after a split', `seed ${seed} #${k - 1} ${q.name} → #${k} ${p.name} (${q.t1}–${p.t0} s)`);
      if (q && q.name === p.name && !same) add('the same screen twice (a last resort only: e.g. lime close-up, nothing but the dark screen after a split)', `seed ${seed} #${k} ${p.name}`);
      if (style === 'lime' && p.split && p.group == null && k > 0 && p.t1 - p.t0 < 2.7) add('a split shorter than 2.7 s', `seed ${seed} #${k}`); });
    if (old && JSON.stringify(o.map(p => [p.name, p.std])) !== JSON.stringify(run(old, kind, seed).map(p => [p.name, p.std]))) moved++;
  }
  console.log(`\n== ${style} · ${kind} · ${N} runs`);
  console.log('screens:', Object.entries(names).sort((a, b) => b[1] - a[1]).map(([n, v]) => `${n} ${v}`).join(' · '));
  console.log('first picture:', Object.entries(first).map(([n, v]) => `${n} ${v}`).join(' · '));
  for (const [k, v] of Object.entries(bad)) console.log(`  ${k}: ${v.length} · e.g. ${v.slice(0, 2).join(' | ')}`);
  if (old) console.log(`  against ${REV}: ${moved} of ${N} runs choose differently`);
}
