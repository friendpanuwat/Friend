// usage: node render.js <project_dir> stills [n,n,...]      — PNG per slide (settled end state) → <project>/slides/NN.png + layout QC
//        node render.js <project_dir> motion <worker> <of>   — 30 fps frames of every slide k with k % of == worker → <project>/motion/NN/
//        node render.js <project_dir> info                   — slide list + SFX cues → <project>/slides.json, cues.json
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const FPS = 30;
(async () => {
  const [proj, mode, a, b] = process.argv.slice(2);
  const D = path.resolve(proj);
  const [W, H] = (fs.existsSync(path.join(D, '.size')) ? fs.readFileSync(path.join(D, '.size'), 'utf8') : '1080x1080').trim().split('x').map(Number);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: W, height: H } });
  const errors = [];
  page.on('pageerror', e => { errors.push(e.message); console.error('PAGE ERROR', e.message); });
  page.on('requestfailed', r => { if (r.url().startsWith('file:')) { errors.push('missing file ' + r.url()); console.error('MISSING FILE', r.url().replace('file://', '')); } });
  await page.goto('file://' + path.join(D, 'deck.html'));
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => Promise.all([...document.images].map(i => i.decode().catch(() => {}))));
  const slides = await page.evaluate(() => window.SLIDES || []);
  if (!slides.length) { console.error('no slides — deck.js must call slide()'); process.exit(2); }
  const nn = n => String(n).padStart(2, '0');
  if (mode === 'info') {
    fs.writeFileSync(path.join(D, 'slides.json'), JSON.stringify(slides, null, 1));
    fs.writeFileSync(path.join(D, 'cues.json'), JSON.stringify(await page.evaluate(() => window.SFX), null, 1));
    console.log(slides.map(s => `${nn(s.n)}  ${s.dur}s`).join('\n'));
  } else if (mode === 'stills') {
    const out = path.join(D, 'slides'); fs.mkdirSync(out, { recursive: true });
    const want = a ? a.split(',').map(Number) : slides.map(s => s.n);
    let warn = 0;
    for (const s of slides.filter(s => want.includes(s.n))) {
      await page.evaluate(([t]) => window.seek(t, true), [s.t0 + s.still]);
      await page.screenshot({ path: path.join(out, `${nn(s.n)}.png`), type: 'png' });
      for (const q of await page.evaluate(n => window.qc(n), s.n)) { console.log(`QC slide ${nn(s.n)}: ${q}`); warn++; }
    }
    console.log(`stills: ${want.length} → ${out}` + (warn ? `  · ${warn} QC warning(s) — fix before delivering` : '  · QC clean'));
  } else if (mode === 'motion') {
    for (const s of slides.filter(s => (s.n - 1) % +b === +a)) {
      const out = path.join(D, 'motion', nn(s.n)); fs.rmSync(out, { recursive: true, force: true }); fs.mkdirSync(out, { recursive: true });
      const N = Math.round(s.dur * FPS);
      for (let f = 0; f < N; f++) {
        await page.evaluate(([t]) => window.seek(t), [s.t0 + Math.min(f / FPS, s.dur - .02)]);
        await page.screenshot({ path: path.join(out, `f${String(f + 1).padStart(5, '0')}.jpg`), type: 'jpeg', quality: 93 });
      }
    }
  }
  await browser.close();
  if (errors.length) process.exit(2);
})();
