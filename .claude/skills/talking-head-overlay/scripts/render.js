// usage: node render.js <project_dir> preview t1,t2,...   — still frames to <project>/prev/
//        node render.js <project_dir> range <startFrame> <endFrame>   — frames to <project>/out_frames/
//        node render.js <project_dir> sfx   — dump the timeline's SFX cues to <project>/cues.json
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const FPS = 30;
(async () => {
  const [proj, mode, a, b] = process.argv.slice(2);
  const D = path.resolve(proj);
  const SRC = path.join(D, 'src_frames');
  const SRC_N = fs.existsSync(SRC) ? fs.readdirSync(SRC).length : 1;
  const srcFrame = f => 'file://' + path.join(SRC, `s${String(Math.min(f, SRC_N - 1) + 1).padStart(5, '0')}.jpg`);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  const errors = [];
  page.on('pageerror', e => { errors.push(e.message); console.error('PAGE ERROR', e.message); });
  await page.goto('file://' + path.join(D, 'scene.html'));
  await page.evaluate(() => document.fonts.ready);
  if (mode === 'sfx') {
    fs.writeFileSync(path.join(D, 'cues.json'), JSON.stringify(await page.evaluate(() => window.SFX), null, 1));
    console.log('cues', (await page.evaluate(() => window.SFX.length)));
  } else if (mode === 'preview') {
    fs.mkdirSync(path.join(D, 'prev'), { recursive: true });
    for (const ts of a.split(',')) {
      const t = parseFloat(ts), f = Math.round(t * FPS);
      await page.evaluate(([t, s]) => window.seek(t, s), [t, srcFrame(f)]);
      await page.screenshot({ path: path.join(D, 'prev', `p_${t.toFixed(2).padStart(6, '0')}.jpg`), type: 'jpeg', quality: 85 });
    }
  } else if (mode === 'range') {
    const out = path.join(D, 'out_frames');
    fs.mkdirSync(out, { recursive: true });
    for (let f = +a; f < +b; f++) {
      await page.evaluate(([t, s]) => window.seek(t, s), [f / FPS, srcFrame(f)]);
      await page.screenshot({ path: path.join(out, `o${String(f).padStart(5, '0')}.jpg`), type: 'jpeg', quality: 93 });
    }
  }
  await browser.close();
  if (errors.length) process.exit(2);
})();
