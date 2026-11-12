#!/usr/bin/env node
/* check_icons.js — every "-pro" rig must show NOTHING before its own start time.
   Places each icon alone with at=2 and counts bright pixels at t = 0 / 1 / 1.9. Prints only icons that leak.
   usage: node scripts/check_icons.js            (prints "done N" when finished) */
const path = require('path'), fs = require('fs'), os = require('os');
const { execFileSync } = require('child_process');
let chromium; try { ({ chromium } = require('playwright')); } catch { ({ chromium } = require(path.join(execFileSync('npm', ['root', '-g']).toString().trim(), 'playwright'))); }
const eng = 'file://' + path.resolve(__dirname, '../assets/glowline.js');
const f = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'glcheck-')), 'p.html');
fs.writeFileSync(f, `<!doctype html><html><head><meta charset="utf-8"><script src="${eng}"></script></head><body><script>
GL.run(() => { GL.stage({ w: 400, h: 400 }); const n = new URLSearchParams(location.search).get('n'); if (n) GL.art(GL.icons[n], { x: 200, y: 200, w: 300, at: 2 }); GL.finish({ hold: 1 }); });
</script></body></html>`);
(async () => {
  const b = await chromium.launch(), page = await b.newPage({ viewport: { width: 400, height: 400 } });
  await page.goto('file://' + f); await page.waitForFunction(() => window.READY || window.GL_ERROR);
  const names = await page.evaluate(() => Object.keys(GL.icons).filter(k => k.endsWith('-pro')));
  for (const n of names) {
    await page.goto('file://' + f + '?n=' + encodeURIComponent(n)); await page.waitForFunction(() => window.READY || window.GL_ERROR);
    const err = await page.evaluate(() => window.GL_ERROR); if (err) { console.log(n, 'ERROR', err); continue; }
    const res = [];
    for (const t of [0, 1, 1.9]) {
      await page.evaluate(t => setT(t), t); const buf = await page.screenshot();
      res.push(await page.evaluate(async b64 => { const img = new Image(); img.src = 'data:image/png;base64,' + b64; await img.decode();
        const c = document.createElement('canvas'); c.width = img.width; c.height = img.height; const x = c.getContext('2d'); x.drawImage(img, 0, 0);
        const d = x.getImageData(0, 0, c.width, c.height).data; let k = 0; for (let i = 0; i < d.length; i += 4) if (d[i] > 90) k++; return k; }, buf.toString('base64')));
    }
    if (res.some(v => v > 0)) console.log('LEAK', n, res.join(' '));
  }
  console.log('done', names.length); await b.close();
})();
