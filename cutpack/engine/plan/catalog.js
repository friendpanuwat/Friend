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
    // a content-pack part (meta.pack) carries its topic, its gallery code, what it is only for (use) and, for a hero part,
    // the sentence it shows (when; a widget takes it from its card). Packs not yet kept by Friend (PACKS[id].live) stay out.
    const strip = (m, c, v) => ({name: m.name, hit: m.hit, dur: m.dur, bgs: m.bgs, slots: m.slots,
      ...(m.pack ? {pack: m.pack, code: m.code, use: m.use, when: m.when ?? PARTS[c]?.[v]?.meta.when} : {})});
    const all = (reg, kind) => Object.entries(reg).flatMap(([c, vs]) => Object.entries(vs).filter(([v, P]) => !P.meta.pack || PACKS[P.meta.pack]?.live)
      .map(([v, P]) => ({id: `${c}.${v}`, kind, ...strip(P.meta, c, v)})))
      // base parts first, then pack parts, each in id order (pack widgets load before the base widgets, so the registry order differs)
      .sort((a, b) => (!!a.pack - !!b.pack) || (a.pack ?? '').localeCompare(b.pack ?? '') || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
    const packs = Object.fromEntries(Object.entries(PACKS).filter(([id, m]) => m.live).map(([id, m]) => [id, {name: m.name, when: m.when}]));
    return {cards: all(PARTS, 'card'), widgets: all(WPARTS, 'widget'), packs, widgetSizes: WSIZE, widgetAt: WAT, camera: CAM, subtitleTop: SUBTOP, subtitleMax: SUBMAX, icons: Object.keys(ICONS).sort()};
  });
  await b.close(); fs.rmSync(tmp, {recursive: true});
  fs.writeFileSync(out, JSON.stringify(cat, null, 1));
  console.log(`${cat.cards.length} cards, ${cat.widgets.length} widgets → ${out}`);
})();
