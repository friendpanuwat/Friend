/* =====================================================================
   CutPack · uni · the draft library as data, without a browser (2026-11-17)
   Loads scenes/*.js in the order build.py does, with stand-ins for the page-only calls (SCENE, MEANING, SMALL), so a tool
   can see which categories have drafts (ร่าง) and run the real picker of scenes/cats.js.
   2026-11-17 Friend deleted every old draft ("ลบชุดฐานเก่าทิ้งให้หมด เราจะใช้ชุดฐาน glow-line"): until the glow-line sets
   are connected every category has 0 drafts, and tools/clip_plan.py leaves the pictures of those categories out.
   usage: node drafts.js [more files…]       → {"B01": 0, …}  drafts per category
          require('./drafts').load([files])   → the context: CATS, pickVariant, PICKS, SENTENCE … (read a const with
                                                 vm.runInContext('CATS', ctx): top-level consts are not properties of ctx)
   ===================================================================== */
const fs = require('fs'), path = require('path'), vm = require('vm');

function load(extra = []) {
  const ctx = {SCENE() {}, MEANING() {}, SMALL() {}, LAYOUTS: {}, console};
  vm.createContext(ctx);
  const dir = path.join(__dirname, 'scenes');
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.js')).sort().map(f => path.join(dir, f)).concat(extra);
  for (const f of files) vm.runInContext(fs.readFileSync(f, 'utf8'), ctx, {filename: f});
  return ctx;
}

function counts(ctx) {
  return Object.fromEntries(Object.values(vm.runInContext('CATS', ctx)).map(c => [c.id, c.variants.length]));
}

if (require.main === module) process.stdout.write(JSON.stringify(counts(load(process.argv.slice(2)))) + '\n');
module.exports = {load, counts};
