// Dump the library (every PART and WIDGET with its meta and slot specs) to catalog.json, straight from the engine.
// usage: node catalog.js <out.json>      (builds an empty scene with the editorial style pack and reads PARTS / WPARTS)
const { chromium } = require('playwright');
// no network in the render browser: AI-written scene code (plan/custom_check.py) can never reach anything outside the page
const NO_NET = ['--proxy-server=http://127.0.0.1:9', '--proxy-bypass-list=<-loopback>', '--host-resolver-rules=MAP * ~NOTFOUND'];
const fs = require('fs'), path = require('path'), os = require('os'), { execFileSync } = require('child_process');
(async () => {
  const out = path.resolve(process.argv[2] || path.join(__dirname, 'catalog.json'));
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'cat-')); fs.writeFileSync(path.join(tmp, 'timeline.js'), '');
  execFileSync('python3', [path.join(__dirname, '..', 'core', 'build_scene.py'), tmp], {stdio: 'ignore'});
  const b = await chromium.launch({ args: NO_NET }), p = await b.newPage();
  await p.goto('file://' + path.join(tmp, 'scene.html'));
  const cat = await p.evaluate(() => {
    const strip = m => ({name: m.name, hit: m.hit, dur: m.dur, bgs: m.bgs, slots: m.slots});
    // a pack part (meta.pack) stays out until Friend has picked it in the gallery and it is wired into plan D
    const all = (reg, kind) => Object.entries(reg).flatMap(([c, vs]) => Object.entries(vs).filter(([v, P]) => !P.meta.pack).map(([v, P]) => ({id: `${c}.${v}`, kind, ...strip(P.meta)})));
    return {cards: all(PARTS, 'card'), widgets: all(WPARTS, 'widget'), widgetSizes: WSIZE, widgetAt: WAT, camera: CAM, subtitleTop: SUBTOP, subtitleMax: SUBMAX, icons: Object.keys(ICONS).sort()};
  });
  await b.close(); fs.rmSync(tmp, {recursive: true});
  fs.writeFileSync(out, JSON.stringify(cat, null, 1));
  console.log(`${cat.cards.length} cards, ${cat.widgets.length} widgets → ${out}`);
})();
