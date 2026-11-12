// Count elements in a built scene after the first seek (tests only).
// usage: node dom_probe.js <scene_dir> <t> <selector…>  → JSON {selector: count, errors: [...]}
const { chromium } = require('playwright');
const path = require('path');
const NO_NET = ['--proxy-server=http://127.0.0.1:9', '--proxy-bypass-list=<-loopback>', '--host-resolver-rules=MAP * ~NOTFOUND'];
(async () => {
  const [dir, t, ...sels] = process.argv.slice(2);
  const b = await chromium.launch({ args: NO_NET }), p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  const errors = []; p.on('pageerror', e => errors.push(e.message));
  await p.goto('file://' + path.join(path.resolve(dir), 'scene.html'));
  await p.evaluate(t => window.seek(+t), t).catch(e => errors.push(String(e)));
  const out = await p.evaluate(sels => Object.fromEntries(sels.map(s => [s, document.querySelectorAll(s).length])), sels);
  out.errors = errors; out.planErr = await p.evaluate(() => window.__planErr || []);
  console.log(JSON.stringify(out)); await b.close();
})();
