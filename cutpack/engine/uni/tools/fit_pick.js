/* CutPack · uni · pick each picture's drawing by how well it fills the screen's free space (2026-11-18, the neon style's final)
   Friend: "ถ้าฉากไหน มีพื้นที่ว่างเยอะ ระบบจะทำการสุ่มเลือกโมชั่นกราฟิกที่มีขนาดใหญ่ ... motion graphic ที่ระบบจะสุ่มเลือกมาต้องเหมาะสมกับ
   พื้นที่ว่างที่มีอยู่" · "แต่ motion กราฟฟิก ต้องเลือกจากในคลังของเราเท่านั้นนะห้ามวาดใหม่เอง" · "ทดลองเฉพาะสไตล์นี้ก่อน" (RULES fitPick).
   For every picture, every drawing of its pool (tools/pick.js pools: the template set, not the customer's last runs) is drawn from the
   library with the clip's own words in a hidden page and measured (its real shape at its end, as the style fits it); the style says how
   much of the screen that shape can take in this stretch (ST.fitSize: the best screen the speaker's face leaves room for). Then, in clip
   order: the drawings this clip has not shown, those within `keep` (85 %) of the biggest (fewer than 5: the 5 biggest down to 70 %), one at
   random (seed + picture id).
   usage: NODE_PATH=$(npm root -g) node tools/fit_pick.js <dir> <style>
     <dir>/plan.js   RUN (seed, open) + FACES + the sentences (clip_plan.py writes it)
     <dir>/job.json  {"seed", "keep"?, "scenes": [{"id", "t0", "t1", "hit", "pool": ["B06T.dial", …]}, …in clip order]}
     → stdout {"picks": {"<id>": "B06T.dial", …}, "sizes": {"<id>": [best %, picked %, kept, of]}} */
const {chromium} = require('playwright'), fs = require('fs'), path = require('path'), {execFileSync} = require('child_process');
const {rng, hash} = require('./pick.js');
const [D, style] = process.argv.slice(2), UNI = path.resolve(__dirname, '..');
const job = JSON.parse(fs.readFileSync(path.join(D, 'job.json'), 'utf8')), keep = job.keep ?? .85;
fs.writeFileSync(path.join(D, 'pre.js'), `const FIT_R = {}; { const S0 = SENTENCE; SENTENCE = (id, r) => { FIT_R[id] = r; return S0(id, r); }; }\n`);
fs.writeFileSync(path.join(D, 'job.js'), `const FIT_JOB = ${JSON.stringify(job)};
window.FIT_DONE = false;
setTimeout(() => {
  const out = [], surf = ST.fitSurface ? ST.fitSurface() : document.body;   // the style's surface, so the colour check reads the right background
  for (const sc of FIT_JOB.scenes) for (const v of sc.pool) {
    const [set, did] = v.split('.'), i = GL.cats[set]?.variants.findIndex(x => x.id === did), r = FIT_R[sc.id];
    if (i == null || i < 0 || !r) continue;
    const box = div('left:0;top:0;width:1000px;height:700px;visibility:hidden', surf);
    try { glowDraw({stage: box}, {b: [sc.t0], hit: sc.hit, t1: sc.t1}, set, i, calm(r)); out.push({id: sc.id, v, box}); } catch (e) {}
  }
  const wait = () => { if (window.GLOW_PENDING > 0) return setTimeout(wait, 50);
    window.FIT = out.map(({id, v, box}) => { const svg = box.querySelector('svg'), b = (svg?.getAttribute('viewBox') || '').split(/[\\s,]+/).map(Number);
      const ar = b.length === 4 && b[3] > 0 ? b[2] / b[3] : null, sc = FIT_JOB.scenes.find(x => x.id === id);
      let low = 0; try { box.style.visibility = 'visible'; low = glowCheckOne(box.querySelector('.glow-host')).filter(x => x.ratio < 3).length; box.style.visibility = 'hidden'; } catch (e) {}
      return {id, v, ar, low, size: ar ? ST.fitSize(ar, sc.t0, sc.t1, typeof RUN !== 'undefined' && RUN.open === 'face' && sc.t0 < .3) : 0}; });
    window.FIT_DONE = true; };
  wait();
}, 0);
`);
execFileSync('python3', [path.join(UNI, 'build.py'), D, style, '-', '--extra', path.join(D, 'pre.js'), '--extra', path.join(D, 'plan.js'), '--extra', path.join(D, 'job.js')]);
(async () => {
  const b = await chromium.launch(), p = await b.newPage({viewport: {width: 1080, height: 1920}}), errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + path.join(D, 'scene.html'));
  await p.waitForFunction(() => window.FIT_DONE === true, null, {timeout: 600000, polling: 500});
  const fit = await p.evaluate(() => window.FIT); await b.close();
  const used = new Set(), picks = {}, sizes = {};
  for (const sc of job.scenes) {
    let c = fit.filter(f => f.id === sc.id && f.size > 0 && !used.has(f.v) && !f.low);   // (and its lines read: none under 3:1, Friend: "สีมันต้องตัดกันเสมอ")
    if (!c.length) c = fit.filter(f => f.id === sc.id && f.size > 0 && !used.has(f.v));
    if (!c.length) c = fit.filter(f => f.id === sc.id && !used.has(f.v));
    if (!c.length) continue;
    /* within `keep` of the biggest; fewer than 5 such: the 5 biggest, as long as they reach `floor` of it (so a run still has a choice) */
    const best = Math.max(...c.map(f => f.size)), r = rng(job.seed ^ hash(sc.id));
    let kept = c.filter(f => f.size >= keep * best);
    if (kept.length < 5) kept = [...c].sort((a, b) => b.size - a.size).slice(0, 5).filter(f => f.size >= (job.floor ?? .7) * best);
    const f = kept[Math.floor(r() * kept.length)]; used.add(f.v); picks[sc.id] = f.v;
    sizes[sc.id] = [Math.round(100 * best), Math.round(100 * f.size), kept.length, c.length];
  }
  if (errs.length) console.error(errs.slice(0, 3).join(' | '));
  process.stdout.write(JSON.stringify({picks, sizes}) + '\n');
})().catch(e => { console.error(e); process.exit(1); });
