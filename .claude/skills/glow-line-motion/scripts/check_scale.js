#!/usr/bin/env node
/* check_scale.js — an icon must look the same small and big ("เวลาย่อและขยายมันต้องไม่เปลี่ยน").
   Draws each "-pro" icon still (loop off) at w = 300 and at w = 80, shrinks the big one to the small size, and compares
   the silhouette (area the icon covers, dark fills included). A stroke that does not scale with the drawing (a thick body drawn as a line weight, a gap that
   eats the icon) makes the small copy much fatter than the big one → printed as BLOB with the ratio.
   usage: node scripts/check_scale.js                 every "-pro" icon     (prints "done N" at the end)
          node scripts/check_scale.js scissors-pro x-pro …   only these
          node scripts/check_scale.js --sheet out.png [names…]  also a contact sheet: big (top) / small blown up (bottom) per icon
   env ASSETS=<dir> checks another copy of assets/ (e.g. an old commit) · VERBOSE=1 prints big / small / ratio for every icon */
const path = require('path'), fs = require('fs'), os = require('os');
const { execFileSync } = require('child_process');
let chromium; try { ({ chromium } = require('playwright')); } catch { ({ chromium } = require(path.join(execFileSync('npm', ['root', '-g']).toString().trim(), 'playwright'))); }
const argv = process.argv.slice(2), si = argv.indexOf('--sheet'), SHEET = si >= 0 ? argv.splice(si, 2)[1] : null, ONLY = argv;
const LIMIT = 1.4;                                   // small ÷ big silhouette above this = BLOB (calibrated 2026-11-13: fixed set ≤ 1.25, old blobs ≥ 1.6)
const eng = 'file://' + path.resolve(process.env.ASSETS || path.join(__dirname, '../assets'), 'glowline.js');
const f = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'glscale-')), 'p.html');
fs.writeFileSync(f, `<!doctype html><html><head><meta charset="utf-8"><script src="${eng}"></script></head><body style="margin:0;background:#000"><script>
const Q = new URLSearchParams(location.search), n = Q.get('n'), w = +Q.get('w');
GL.run(() => { GL.stage({ w: 400, h: 400 }); if (n) GL.art(GL.icons[n], { x: 200, y: 200, w: w, at: 0, loop: false, filter: Q.get('g') ? 'glow' : null }); GL.finish({ hold: 1 }); });
</script></body></html>`);
(async () => {
  const b = await chromium.launch(), page = await b.newPage({ viewport: { width: 400, height: 400 } });
  await page.goto('file://' + f + '?w=1'); await page.waitForFunction(() => window.READY || window.GL_ERROR);
  const names = ONLY.length ? ONLY : await page.evaluate(() => Object.keys(GL.icons).filter(k => k.endsWith('-pro')));
  const shot = async (n, w) => { await page.goto('file://' + f + '?n=' + encodeURIComponent(n) + '&w=' + w); await page.waitForFunction(() => window.READY || window.GL_ERROR);
    const err = await page.evaluate(() => window.GL_ERROR); if (err) throw new Error(err); await page.evaluate(() => setT(3)); return (await page.screenshot()).toString('base64'); };
  /* silhouette of the icon (every pixel that is not background — white lines AND the dark fills), both read at 80 × 80:
     big shot (box ±150) shrunk, small shot (box ±40) as is. Drawn without glow so the edge is exact. */
  const area = (b64, h) => page.evaluate(async ([b64, h]) => { const img = new Image(); img.src = 'data:image/png;base64,' + b64; await img.decode();
    const c = document.createElement('canvas'); c.width = c.height = 80; const x = c.getContext('2d'); x.drawImage(img, 200 - h, 200 - h, 2 * h, 2 * h, 0, 0, 80, 80);
    const d = x.getImageData(0, 0, 80, 80).data, bg = d[0]; let k = 0; for (let i = 0; i < d.length; i += 4) if (Math.abs(d[i] - bg) > 6) k++; return k; }, [b64, h]);
  const rows = [], bad = [];
  for (const n of names) { try {
    const big = await shot(n, 300), small = await shot(n, 80);
    const a = await area(big, 150), s = await area(small, 40), r = s / Math.max(1, a);
    if (process.env.VERBOSE) console.log(n.padEnd(28), a.toFixed(1), s.toFixed(1), r.toFixed(2));
    if (r > LIMIT) { bad.push(n); console.log('BLOB', n, r.toFixed(2)); }
    if (SHEET) rows.push([n, big, small]);
  } catch (e) { console.log(n, 'ERROR', String(e.message).split('\n')[0]); } }
  if (SHEET) {                                      // contact sheet: per icon, big (300) above, small (80) blown up to the same size below
    const html = `<body style="margin:0;background:#000;display:flex;flex-wrap:wrap;width:1600px">${rows.map(([n, B, s]) =>
      `<div style="width:160px;font:11px sans-serif;color:${bad.includes(n) ? '#f55' : '#888'};text-align:center"><div style="height:160px;background:url(data:image/png;base64,${B}) center/213px"></div>` +
      `<div style="height:160px;background:url(data:image/png;base64,${s}) center/800px;image-rendering:auto"></div>${n}</div>`).join('')}</body>`;
    const p2 = await b.newPage({ viewport: { width: 1600, height: 400 } }); await p2.setContent(html); await p2.screenshot({ path: SHEET, fullPage: true });
  }
  console.log('done', names.length, bad.length ? '· BLOB ' + bad.length : ''); await b.close();
})();
