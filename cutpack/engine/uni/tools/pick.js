/* =====================================================================
   CutPack · uni · pick the drawing of every picture of one run, at random (2026-11-17)
   Friend 2026-11-17: "ผมไม่อยากให้ฉากมันซ้ำกันทุกคลิปอ่ะต่อให้ user อัพคลิปเดิมลงไปแล้วกดรันอีกรอบนึงผมก็ไม่อยากให้มันออกมาเหมือนกัน
   เราทำเป็นระบบสุ่มฉากได้ไหม" + the plan Friend took (DECISIONS 3): pick once when the run is pressed, keep what was picked (the
   plan files: fixing one word later does not change the rest), stay away from what this customer's last 10 runs showed
   (DECISIONS 2026-11-03: 5–10 clips; a run of the same clip again counts too).
   Rules, in order, for each picture (the AI gave its category, the code picks the drawing):
     1. both glow-line sets take turns inside a category (Friend: "ทั้งสองชุด ... ระบบเลือกสลับกันไป"), the first set at random
     2. never a drawing this clip already showed
     3. not one of the customer's last 10 runs, while the set has others left (else the one shown longest ago)
     4. a drawing that fills a screen well (width / height 0.7–2.4, glow/shapes.json) before a very flat or very tall one
        (Friend 2026-11-17: "ทำไมโมชั่นกราฟฟิกเล็กจังเลยมันดูโล่งๆอ่ะ" — a 4.7 : 1 drawing came out at 6 % of the screen)
     5. among what is left: at random (seed of the run + the picture's id, so the same seed gives the same picks)
   usage: node tools/pick.js <in.json>   in = {"seed": 12345, "history": [{"picks": ["B04T.rail", …]}, …newest last],
                                               "scenes": [{"id": "s3", "cat": "B04", "only": "T"?}, …in clip order]}
          only "T" = the template set only (an overlay on the speaker)
          → stdout {"picks": {"s3": "B04T.rail", …}}
   ===================================================================== */
const fs = require('fs'), vm = require('vm'), path = require('path');
const {load} = require(path.join(__dirname, '..', 'drafts.js'));
const LAST = 10;
const SHAPES = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'glow', 'shapes.json'), 'utf8')), FITS = [.7, 2.4];

/* a small seeded random (mulberry32) */
function rng(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const hash = s => { let h = 2166136261; for (const c of String(s)) h = Math.imul(h ^ c.codePointAt(0), 16777619) >>> 0; return h; };

function pick({seed, history = [], scenes}) {
  const CATS = vm.runInContext('CATS', load());
  const past = history.slice(-LAST), age = new Map();                // drawing → how many runs ago it was last shown (1 = the last run)
  past.forEach((run, k) => (run.picks || []).forEach(id => age.set(id, past.length - k)));
  const used = new Set(), turn = {}, picks = {};
  for (const sc of scenes) {
    const all = CATS[sc.cat]?.variants.map(v => v.id) ?? [];
    if (!all.length) continue;
    const r = rng(seed ^ hash(sc.id));
    let sets = [...new Set(all.map(id => id.split('.')[0]))].sort();
    if (sc.only === 'T') sets = sets.filter(x => x.endsWith('T'));      // an overlay: the template set only (Friend 2026-11-17: "ห้ามใส่ชุดฐานปกติ")
    if (!sets.length) continue;
    if (!(sc.cat in turn)) turn[sc.cat] = Math.floor(r() * sets.length);   // 1. the first set of this category: at random
    const set = sets[turn[sc.cat]++ % sets.length];
    const mine = all.filter(id => sets.includes(id.split('.')[0]));
    let pool = mine.filter(id => id.startsWith(set + '.') && !used.has(id));   // 2. not shown in this clip
    if (!pool.length) pool = mine.filter(id => !used.has(id));
    if (!pool.length) pool = mine;
    const fresh = pool.filter(id => !age.has(id));                        // 3. not in the last runs
    if (fresh.length) pool = fresh;
    else { const oldest = Math.max(...pool.map(id => age.get(id))); pool = pool.filter(id => age.get(id) === oldest); }
    const good = pool.filter(id => SHAPES[id] >= FITS[0] && SHAPES[id] <= FITS[1]);   // 4. a shape that fills a screen
    if (good.length) pool = good;
    const id = pool[Math.floor(r() * pool.length)];                      // 5. at random
    used.add(id); picks[sc.id] = id;
  }
  return {picks};
}

if (require.main === module) process.stdout.write(JSON.stringify(pick(JSON.parse(fs.readFileSync(process.argv[2], 'utf8')))) + '\n');
module.exports = {pick, rng, hash};
