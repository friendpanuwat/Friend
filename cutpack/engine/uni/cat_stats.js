/* =====================================================================
   CutPack · uni · what the category plans of many clips need (round 15, Friend 2026-11-08: "จะได้รู้ว่าหมวดไหนใช้บ่อย
   และยังขาดร่าง"). For every clip (an out dir of cat_ai.py check: sentences.js + report.json) it runs the real variant
   picker of scenes/cats.js on the clip's sentences in order and reports, per category:
     used      how many pictures of the category the AI wrote (all clips)
     clips     in how many clips it appears
     variants  how many variants the category has now
     repeats   pictures that had to reuse a variant already seen in the same clip (too few variants that fit)
     onefit    pictures that only one variant could draw (its slots fit no other variant)
   and the lines the AI said no category fits (cat "none" + what they need).
   usage: node cat_stats.js <out_dir>… > stats.json
   ===================================================================== */
const fs = require('fs'), path = require('path'), vm = require('vm');
const LIB = ['scenes/cats.js', 'scenes/lego_r2.js', 'scenes/lego_r3.js', 'scenes/lego_r4.js', 'scenes/lego_v2.js'];
const load = sentences => {
  const ctx = {SCENE() {}, LAYOUTS: {}, console};
  vm.createContext(ctx);
  for (const f of LIB) vm.runInContext(fs.readFileSync(path.join(__dirname, f), 'utf8'), ctx);
  vm.runInContext('this.LIST = []; SENTENCE = (id, r) => LIST.push([id, r]); for (const k in PICKS) delete PICKS[k];', ctx);
  vm.runInContext(fs.readFileSync(sentences, 'utf8'), ctx);
  vm.runInContext('this.RES = LIST.map(([id, r]) => { const fit = CATS[r.cat].variants.filter(v => v.fits(r)).map(v => v.id);' +
    ' const pick = fit.length ? pickVariant(r.cat, r, r.say.join(" ")).id : null; return {id, cat: r.cat, say: r.say, fit, pick}; });' +
    ' this.NV = Object.fromEntries(Object.values(CATS).map(c => [c.id, c.variants.length]));' +
    ' this.NAMES = Object.fromEntries(Object.values(CATS).map(c => [c.id, c.name]));', ctx);
  return ctx;
};
const dirs = process.argv.slice(2), clips = [], cats = {}, none = [];
let NV = {}, NAMES = {};
for (const d of dirs) {
  const ctx = load(path.join(d, 'sentences.js')); NV = ctx.NV; NAMES = ctx.NAMES;
  const seen = {}, rows = [];
  for (const r of ctx.RES) {
    const c = cats[r.cat] ?? (cats[r.cat] = {used: 0, clips: new Set(), repeats: 0, onefit: 0, nofit: 0});
    c.used++; c.clips.add(d);
    const used = seen[r.cat] ?? (seen[r.cat] = []);
    const repeat = r.pick != null && used.includes(r.pick);
    if (repeat) c.repeats++;
    if (r.fit.length === 1) c.onefit++;
    if (!r.fit.length) c.nofit++;
    used.push(r.pick); rows.push({...r, repeat});
  }
  const rep = JSON.parse(fs.readFileSync(path.join(d, 'report.json'), 'utf8'));
  rep.filter(x => x.cat === 'none').forEach(x => none.push({clip: path.basename(d), line: x.line, text: x.text, need: x.need}));
  clips.push({clip: path.basename(d), pictures: rows, failed: rep.filter(x => !x.ok).length});
}
const table = Object.keys(NV).sort().map(id => {
  const c = cats[id] ?? {used: 0, clips: new Set(), repeats: 0, onefit: 0, nofit: 0};
  return {id, name: NAMES[id], used: c.used, clips: c.clips.size, variants: NV[id], repeats: c.repeats, onefit: c.onefit, nofit: c.nofit};
});
process.stdout.write(JSON.stringify({clips: dirs.length, pictures: clips.reduce((a, c) => a + c.pictures.length, 0), table, none, perClip: clips}, null, 1) + '\n');
