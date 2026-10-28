// Render frames of <project>/scene.html in headless Chromium (Playwright).
//   node render.js <project> check                  → load the scene, run every guard, print JS / FACE / CUT errors (exit 2 if any)
//   node render.js <project> info                   → <project>/mattes.json (ranges that need mattes) + cues.json (sound cues)
//   node render.js <project> preview t1,t2,...      → <project>/prev/p_TTT.TT.jpg
//   node render.js <project> range <start> <end>    → <project>/out_frames/oNNNNN.jpg for frames start..end-1 (30 fps)
// Every frame is computed from its time (window.seek), so frames render identically in any order or worker.
const { chromium } = require('playwright'); const path = require('path'); const fs = require('fs');
const [P0, mode, a, b] = process.argv.slice(2); const P = path.resolve(P0);
const pad = f => String(f).padStart(5, '0');
const src = f => `file://${P}/src_frames/s${pad(f + 1)}.jpg`;
// mattes go in as data: URIs — CSS masks refuse file:// images (CORS)
const matte = f => { const p = `${P}/mattes/m${pad(f)}.png`; return fs.existsSync(p) ? 'data:image/png;base64,' + fs.readFileSync(p).toString('base64') : null; };
const at = (pg, t) => { const f = Math.round(t * 30); return pg.evaluate(([t, s, m]) => window.seek(t, s, m), [t, src(f), matte(f)]); };
(async () => {
  const br = await chromium.launch(); const pg = await br.newPage({viewport: {width: 1080, height: 1920}});
  const errs = [];
  pg.on('console', m => m.type() === 'error' && errs.push(m.text()));
  pg.on('pageerror', e => errs.push('JS ERROR: ' + e.message));
  pg.on('requestfailed', r => errs.push('MISSING FILE: ' + r.url().replace(`file://${P}/`, '')));
  await pg.goto(`file://${P}/scene.html`); await pg.evaluate(() => document.fonts.ready);
  const fail = () => { if (errs.length) { console.error([...new Set(errs)].join('\n')); process.exitCode = 2; return true; } return false; };
  if (!(await pg.evaluate(() => typeof window.seek === 'function'))) errs.push('scene did not load (window.seek missing) — see the JS error above');
  if (errs.length) { fail(); await br.close(); return; }
  if (mode === 'check') {
    await at(pg, 0);
    for (const t of [...new Set(await pg.evaluate(() => window.guardTimes()))]) { await at(pg, t); await pg.evaluate(t => window.runGuards(t), t); }
    const fe = await pg.evaluate(() => window.FACE_ERRORS.splice(0)); fe.forEach(e => errs.push('FACE: ' + e));
    if (!fail()) console.log('scene OK');
  } else if (mode === 'info') {
    const {mattes, cues} = await pg.evaluate(() => ({mattes: window.MATTES, cues: window.SFX}));
    cues.sort((x, y) => x.t - y.t); const kept = cues.filter((c, i) => !cues.slice(0, i).some(d => Math.abs(d.t - c.t) < 1.2));   // never two cues within 1.2 s
    fs.writeFileSync(`${P}/mattes.json`, JSON.stringify(mattes)); fs.writeFileSync(`${P}/cues.json`, JSON.stringify(kept));
    console.log(`matte ranges: ${mattes.length} · sound cues: ${kept.length}`); fail();
  } else if (mode === 'preview') {
    fs.rmSync(`${P}/prev`, {recursive: true, force: true}); fs.mkdirSync(`${P}/prev`);
    for (const t of a.split(',').map(Number)) { await at(pg, t);
      await pg.screenshot({path: `${P}/prev/p_${t.toFixed(2).padStart(6, '0')}.jpg`, type: 'jpeg', quality: 85}); }
    fail();
  } else if (mode === 'range') {
    fs.mkdirSync(`${P}/out_frames`, {recursive: true});
    for (let f = +a; f < +b; f++) { await at(pg, f / 30);
      if (f === +a && fail()) break;
      await pg.screenshot({path: `${P}/out_frames/o${pad(f)}.jpg`, type: 'jpeg', quality: 92}); }
    fail();
  } else { console.error('usage: render.js <project> check | info | preview t1,t2,... | range start end'); process.exitCode = 1; }
  await br.close();
})();
