#!/usr/bin/env node
/* check_timing.js — build every design of a category under many timings and report keys that would run out of order.
   usage: node scripts/check_timing.js B06            (any category with the TIMING block: B01–B06 …)
   Each category's kf() clamps a key that comes before the one ahead of it and counts it in GL.cats.Bxx.CLAMPS — 0 everywhere = safe.
   Timings: the category's default hit × .5 / .7 / 1 / 2 / 3.5, speed .5 / 2, a long sentence at speed .5, a short one at speed 2,
   and (for B05) an early "ไม่ใช่". Both SAMPLES and STRESS are drawn. Prints the timing each condition really used (M, H) too. */
const path = require('path'), fs = require('fs'), { execFileSync } = require('child_process');
let chromium; try { ({ chromium } = require('playwright')); } catch { ({ chromium } = require(path.join(execFileSync('npm', ['root', '-g']).toString().trim(), 'playwright'))); }
const SK = path.resolve(__dirname, '..'), CAT = (process.argv[2] || '').toUpperCase(), low = CAT.toLowerCase();
if (!/^B\d\d$/.test(CAT)) { console.error('usage: node scripts/check_timing.js B06'); process.exit(2); }
const dir = path.join(SK, 'examples', low), js = path.join(dir, low + '.js');
if (!fs.existsSync(js)) { console.error('no ' + js); process.exit(2); }
(async () => {
  const b = await chromium.launch(), pg = await b.newPage({ viewport: { width: 1080, height: 1920 } }), errs = [];
  pg.on('pageerror', e => errs.push(e.message));
  const html = `<!doctype html><html><head><meta charset="utf-8"><script src="file://${SK}/assets/glowline.js"></script><script src="${low}.js"></script></head><body><script>
    GL.run(() => { GL.stage(); const B = GL.cats.${CAT}, H0 = B.timing({}).H;
      const C = [1, .7, .5, 2, 3.5].map(k => ({ hit: +(H0 * k).toFixed(2) })).concat([{ hit: H0, speed: .5 }, { hit: H0, speed: 2 }, { hit: +(H0 * 2.5).toFixed(2), speed: .5 }, { hit: +(H0 * .6).toFixed(2), speed: 2 }]);
      if ('${CAT}' === 'B05') C.push({ hit: 3.5, no: .6 }, { hit: 1, no: .3 });
      const out = [];
      C.forEach(cd => { Object.keys(B.CLAMPS).forEach(k => delete B.CLAMPS[k]);
        B.variants.forEach((v, i) => [B.SAMPLES[i], B.STRESS[i]].forEach(d => d && B.draw(i, d, Object.assign({ x: 540, y: 960, s: .3, at: 0 }, cd))));
        out.push({ cond: cd, z: B.timing(cd), clamps: Object.assign({}, B.CLAMPS) }); });
      window.OUT = out; GL.finish({ hold: .5 }); });</script></body></html>`;
  const tmp = path.join(dir, '.check-timing.html'); fs.writeFileSync(tmp, html);
  try { await pg.goto('file://' + tmp); await pg.waitForFunction(() => window.READY || window.GL_ERROR, null, { timeout: 120000 }); }
  finally { fs.rmSync(tmp, { force: true }); }
  const out = await pg.evaluate(() => window.OUT || window.GL_ERROR); let bad = 0;
  if (!Array.isArray(out)) { console.log('ERROR', out); bad = 1; }
  else for (const o of out) { const n = Object.values(o.clamps).reduce((a, v) => a + v, 0); bad += n;
    console.log(CAT, JSON.stringify(o.cond).padEnd(30), 'M', o.z.M.toFixed(2), 'H', +o.z.H.toFixed(2), n ? '| CLAMPS ' + JSON.stringify(o.clamps) : '| ok'); }
  if (errs.length) { console.log('PAGE ERRORS', errs.slice(0, 5)); bad++; }
  await b.close(); console.log(bad ? `done — ${bad} problem(s)` : 'done — no key out of order'); process.exit(bad ? 1 : 0);
})();
