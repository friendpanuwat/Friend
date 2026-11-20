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
     <dir>/job.json  {"seed", "keep"?, "hook"?, "scenes": [{"id", "t0", "t1", "hit", "pool": ["B06T.dial", …]}, …in clip order]}
     → stdout {"picks": {"<id>": "B06T.dial", …}, "sizes": {"<id>": [best %, picked %, kept, of]}, "hookFail"?: true}
   THE HOOK CHECK (2026-11-20, Friend: "1. ก" · "อนุญาตครับ แต่ต้องตั้งใจเขียนดีๆนะครับอย่าให้ผิดพลาด"): with "hook": true the first scene is
   the hook (clip_plan.py). A style with ST.hookOK(ar, t0, t1) says whether a drawing of shape ar has a speaker screen there; the first
   scene then picks only among the drawings that have one; none has → "hookFail": true (clip_plan.py plans the clip again without the
   hook). A style without hookOK: every drawing passes, the picks are exactly as before. */
const {chromium} = require('playwright'), fs = require('fs'), path = require('path'), {execFileSync} = require('child_process');
const {rng, hash} = require('./pick.js');
const [D, style] = process.argv.slice(2), UNI = path.resolve(__dirname, '..');
const job = JSON.parse(fs.readFileSync(path.join(D, 'job.json'), 'utf8')), keep = job.keep ?? .85;
fs.writeFileSync(path.join(D, 'pre.js'), `const FIT_R = {}; { const S0 = SENTENCE; SENTENCE = (id, r) => { FIT_R[id] = r; return S0(id, r); }; }\n`);
fs.writeFileSync(path.join(D, 'job.js'), `const FIT_JOB = ${JSON.stringify(job)};
window.FIT_DONE = false;
setTimeout(() => {
  const out = [], surf = ST.fitSurface ? ST.fitSurface() : document.body;   // the style's surface, so the colour check reads the right background
  const only = +new URLSearchParams(location.search).get('s');               // one picture per page (?s=k): 400 drawings in one page timed out (setT moves every drawing)
  for (const sc of FIT_JOB.scenes.filter((x, k) => k === only)) for (const v of sc.pool) {
    const [set, did] = v.split('.'), i = GL.cats[set]?.variants.findIndex(x => x.id === did), r = FIT_R[sc.id];
    if (i == null || i < 0 || !r) continue;
    const box = div('left:0;top:0;width:1000px;height:700px;visibility:hidden', surf);
    try { glowDraw({stage: box}, {b: [sc.t0], hit: sc.hit, t1: sc.t1}, set, i, calm(r)); out.push({id: sc.id, v, box}); } catch (e) {}
  }
  const wait = () => { if (window.GLOW_PENDING > 0) return setTimeout(wait, 50);
    window.FIT = out.map(({id, v, box}) => { const svg = box.querySelector('svg'), b = (svg?.getAttribute('viewBox') || '').split(/[\\s,]+/).map(Number);
      const ar = b.length === 4 && b[3] > 0 ? b[2] / b[3] : null, sc = FIT_JOB.scenes.find(x => x.id === id);
      let low = 0; try { box.style.visibility = 'visible'; low = glowCheckOne(box.querySelector('.glow-host')).filter(x => x.ratio < 3).length; box.style.visibility = 'hidden'; } catch (e) {}
      const hook = !(FIT_JOB.hook && sc === FIT_JOB.scenes[0] && typeof ST.hookOK === 'function') || (!!ar && !!ST.hookOK(ar, sc.t0, sc.t1));   // (the hook check, top)
      return {id, v, ar, low, hook, size: ar ? ST.fitSize(ar, sc.t0, sc.t1, typeof RUN !== 'undefined' && RUN.open === 'face' && sc.t0 < .3) : 0}; });
    window.FIT_DONE = true; };
  wait();
}, 0);
`);
execFileSync('python3', [path.join(UNI, 'build.py'), D, style, '-', '--extra', path.join(D, 'pre.js'), '--extra', path.join(D, 'plan.js'), '--extra', path.join(D, 'job.js')]);
(async () => {
  const b = await chromium.launch(), p = await b.newPage({viewport: {width: 1080, height: 1920}}), errs = [];
  p.on('pageerror', e => errs.push(e.message));
  const fit = [];
  for (let k = 0; k < job.scenes.length; k++) {
    /* a page that does not finish in 90 s is tried once more before its picture is left to pick.js: a machine busy with another
       render made one scene time out, and the same seed then gave that picture another drawing (2026-11-20, Friend: "จะให้หาต้นเหตุ
       และแก้เลยครับ") · a scene that still fails is named on stderr, and clip_plan.py prints it (it used to be silent) */
    for (let a = 0; a < 2; a++) {
      try {
        await p.goto('file://' + path.join(D, 'scene.html') + '?s=' + k, {waitUntil: 'domcontentloaded', timeout: 90000});
        await p.waitForFunction(() => window.FIT_DONE === true, null, {timeout: 90000, polling: 500});
        fit.push(...await p.evaluate(() => window.FIT));
        break;
      } catch (e) { console.error('picture', job.scenes[k].id, a ? 'not measured:' : 'not measured, trying once more:', e.name); }
    }
    if (process.env.FIT_LOG) console.error('scene', k, 'measured', fit.length);
  }
  await b.close();
  const used = new Set(), picks = {}, sizes = {};
  let hookFail = false;
  if (job.hook && job.scenes.length) {             // the hook check (top): the first scene keeps only the drawings with a speaker screen
    const id0 = job.scenes[0].id, all0 = fit.filter(f => f.id === id0);
    if (all0.length && !all0.some(f => f.hook)) hookFail = true;
    else if (all0.length) { const keep0 = new Set(all0.filter(f => f.hook)); for (let k = fit.length - 1; k >= 0; k--) if (fit[k].id === id0 && !keep0.has(fit[k])) fit.splice(k, 1); }
  }
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
  process.stdout.write(JSON.stringify(hookFail ? {picks, sizes, hookFail} : {picks, sizes}) + '\n');
})().catch(e => { console.error(e); process.exit(1); });
