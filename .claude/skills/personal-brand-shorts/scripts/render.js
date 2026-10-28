// Render frames of <project>/scene.html in headless Chromium (Playwright).
//   node render.js <project> check                  → load the scene once, print JS / FACE errors (exit 2 if any)
//   node render.js <project> preview t1,t2,...      → <project>/prev/p_TTT.TT.jpg
//   node render.js <project> range <start> <end>    → <project>/out_frames/oNNNNN.jpg for frames start..end-1 (30 fps)
// Every frame is computed from its time (window.seek), so frames render identically in any order or worker.
const { chromium } = require('playwright'); const path = require('path'); const fs = require('fs');
const [P0, mode, a, b] = process.argv.slice(2); const P = path.resolve(P0);
const src = f => `file://${P}/src_frames/s${String(f + 1).padStart(5, '0')}.jpg`;
(async () => {
  const br = await chromium.launch(); const pg = await br.newPage({viewport: {width: 1080, height: 1920}});
  const errs = [];
  pg.on('console', m => m.type() === 'error' && errs.push(m.text()));
  pg.on('pageerror', e => errs.push('JS ERROR: ' + e.message));
  await pg.goto(`file://${P}/scene.html`); await pg.evaluate(() => document.fonts.ready);
  const fail = () => { if (errs.length) { console.error(errs.join('\n')); process.exitCode = 2; return true; } return false; };
  if (!(await pg.evaluate(() => typeof window.seek === 'function'))) errs.push('scene did not load (window.seek missing) — see the JS error above');
  if (errs.length) { fail(); await br.close(); return; }
  if (mode === 'check') { await pg.evaluate(s => window.seek(0, s), src(0)); if (!fail()) console.log('scene OK'); }
  else if (mode === 'preview') {
    fs.rmSync(`${P}/prev`, {recursive: true, force: true}); fs.mkdirSync(`${P}/prev`);
    for (const t of a.split(',').map(Number)) {
      await pg.evaluate(([t, s]) => window.seek(t, s), [t, src(Math.round(t * 30))]);
      await pg.screenshot({path: `${P}/prev/p_${t.toFixed(2).padStart(6, '0')}.jpg`, type: 'jpeg', quality: 85}); }
    fail();
  } else if (mode === 'range') {
    fs.mkdirSync(`${P}/out_frames`, {recursive: true});
    for (let f = +a; f < +b; f++) {
      await pg.evaluate(([t, s]) => window.seek(t, s), [f / 30, src(f)]);
      if (f === +a && fail()) break;
      await pg.screenshot({path: `${P}/out_frames/o${String(f).padStart(5, '0')}.jpg`, type: 'jpeg', quality: 92}); }
    fail();
  } else { console.error('usage: render.js <project> check | preview t1,t2,... | range start end'); process.exitCode = 1; }
  await br.close();
})();
