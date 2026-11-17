/* =====================================================================
   CutPack · uni · glow index (2026-11-17): the list of glow-line designs, for the tools that run without a browser
   (drafts.js → tools/clip_plan.py, tools/pick.js). The designs themselves are read-only in the skill
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
  await b.close();
  if (errs.length) { console.error(errs); process.exit(1); }
  fs.writeFileSync(path.join(__dirname, 'index.json'), JSON.stringify(idx, null, 0).replace(/\],"/g, '],\n"') + '\n');
  console.log(Object.entries(idx).map(([k, v]) => `${k} ${v.length}`).join(' · '));
})();
