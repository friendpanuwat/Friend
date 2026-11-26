/* =====================================================================
   CutPack · uni · glow index (2026-11-17): the list of glow-line designs, for the tools that run without a browser
   (drafts.js → tools/clip_plan.py, tools/pick.js), and glow/seven.json for the 7-size set (tools/pick.js --seven). The designs themselves are read-only in the skill
   (.claude/skills/glow-line-motion/examples/b??/ and b??t/); this writes glow/index.json = {"B04T": [{"id", "th"}, …], …}.
   Run it again whenever the skill gets new designs: NODE_PATH=$(npm root -g) node glow/index.js
   ===================================================================== */
const {chromium} = require('playwright'), fs = require('fs'), path = require('path');
const SKILL = path.resolve(__dirname, '../../../../.claude/skills/glow-line-motion'), EX = path.join(SKILL, 'examples');
const sets = fs.readdirSync(EX).filter(d => /^b\d\dt?$/.test(d) && fs.existsSync(path.join(EX, d, d + '.js'))).sort();
(async () => {
  const b = await chromium.launch(), p = await b.newPage(), errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.setContent('<!doctype html><meta charset=utf-8><body>');
  await p.addScriptTag({path: path.join(SKILL, 'assets', 'glowline.js')});
  for (const d of sets) await p.addScriptTag({path: path.join(EX, d, d + '.js')});
  const idx = await p.evaluate(() => Object.fromEntries(Object.entries(GL.cats).filter(([k]) => /^B\d\dT?$/.test(k)).sort()
    .map(([k, c]) => [k, c.variants.map(v => ({id: v.id, th: v.th}))])));
  /* the 7-size set (ชุด 3, 2026-11-26) → glow/seven.json = {"B01": designs a size, …} for tools/pick.js --seven: B01S–B12S (the same
     count at every size, checked here) and SG + S7G (B13–B22, one design a size; B22 is not a CutPack category yet) */
  for (const d of fs.readdirSync(EX).filter(d => /^b\d\ds$/.test(d)).sort().concat(['sg', 's7g']))
    if (fs.existsSync(path.join(EX, d, d + '.js'))) await p.addScriptTag({path: path.join(EX, d, d + '.js')});
  const seven = await p.evaluate(() => { const o = {};
    for (let n = 1; n <= 12; n++) { const k = 'B' + String(n).padStart(2, '0'), c = GL.cats[k + 'S']; if (!c?.S) continue;
      const per = [1, 2, 3, 4, 5, 6, 7].map(s => (c.S[s] || []).length); if (per.some(x => x !== per[0])) throw new Error(k + 'S: not the same count at every size ' + per);
      o[k] = per[0]; }
    if (GL.cats.SG && GL.cats.S7G) GL.cats.SG.D.forEach(d => { o[d.cat.slice(0, 3)] = 1; });
    return o; });
  await b.close();
  if (errs.length) { console.error(errs); process.exit(1); }
  fs.writeFileSync(path.join(__dirname, 'index.json'), JSON.stringify(idx, null, 0).replace(/\],"/g, '],\n"') + '\n');
  fs.writeFileSync(path.join(__dirname, 'seven.json'), JSON.stringify(seven) + '\n');
  console.log(Object.entries(idx).map(([k, v]) => `${k} ${v.length}`).join(' · '));
  console.log('7-size set: ' + Object.entries(seven).map(([k, v]) => `${k} ${v}`).join(' · '));
})();
