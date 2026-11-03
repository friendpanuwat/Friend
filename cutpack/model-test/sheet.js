// Side-by-side sheets: one column per arm (model + effort), one row per second.
// usage: node sheet.js <models_dir> <out_dir> <dir with Mitr-*.ttf> <times>
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const [M, OUT, FONTS, TIMES] = process.argv.slice(2);
const times = TIMES.split(',').map(Number);
const font = f => 'data:font/ttf;base64,' + fs.readFileSync(path.join(FONTS, f)).toString('base64');
const map = Object.fromEntries(fs.readFileSync(path.join(M, 'MAPPING.txt'), 'utf8').trim().split('\n')
  .map(l => l.trim().split(/\s+/)).map(([k, m, e]) => [k, {m, e}]));
// columns ordered Sonnet low→high, then Opus low→high
const order = ['sonnet', 'opus'].flatMap(m => ['low', 'medium', 'high'].map(e => Object.keys(map).find(k => map[k].m === m && map[k].e === e)));
const DUR = 23.0;
const stats = k => {
  const js = fs.readFileSync(path.join(M, k, 'timeline.js'), 'utf8');
  const m = js.match(/cards\(\s*(\[[\s\S]*?\]\s*)\)\s*;/);
  let n = 0, cov = 0;
  if (m) { try { const w = eval(m[1]); n = w.length; cov = w.reduce((s, [a, b]) => s + (b - a), 0) / DUR; } catch (e) {} }
  return `การ์ด ${n} ใบ · ${Math.round(cov * 100)}% ของคลิป`;
};
const img = (k, t) => {
  const f = path.join(M, 'cmp', k, 'prev', `p_${t.toFixed(2).padStart(6, '0')}.jpg`);
  return fs.existsSync(f) ? 'data:image/jpeg;base64,' + fs.readFileSync(f).toString('base64') : '';
};
(async () => {
  const browser = await chromium.launch();
  const halves = [times.slice(0, Math.ceil(times.length / 2)), times.slice(Math.ceil(times.length / 2))];
  for (const [i, ts] of halves.entries()) {
    const cw = 200, ch = Math.round(cw * 16 / 9);
    const html = `<!doctype html><meta charset="utf-8"><style>
      @font-face{font-family:M;src:url(${font('Mitr-Regular.ttf')})} @font-face{font-family:MB;src:url(${font('Mitr-SemiBold.ttf')})}
      body{margin:0;background:#f4f4f2;font-family:M;color:#111;padding:24px;width:${6 * (cw + 12) + 60}px}
      h1{font-family:MB;font-size:28px;margin:0 0 4px} p{font-size:16px;margin:0 0 16px;color:#444;line-height:1.5}
      .row{display:flex;gap:12px;margin-bottom:12px;align-items:flex-start} .lab{width:48px;font-family:MB;font-size:15px;color:#666;padding-top:6px}
      .h{width:${cw}px;font-family:MB;font-size:18px;line-height:1.3} .h small{display:block;font-family:M;font-size:13px;color:#666}
      .gap{margin-left:14px} img{width:${cw}px;height:${ch}px;border-radius:8px;display:block;background:#000}</style>
      <h1>editorial: Sonnet กับ Opus ที่ effort ต่ำ กลาง สูง (${i + 1}/2)</h1>
      <p>บทพูดเรื่องเกษียณ 22 วินาที · ทุกแบบได้คำสั่ง บทพูด เวลา และคลิปเดียวกัน แล้วออกแบบเองตาม skill · ปากไม่ตรงเสียงเพราะใช้คลิปแทน</p>
      <div class="row"><div class="lab"></div>${order.map((k, j) => `<div class="h${j === 3 ? ' gap' : ''}">${map[k].m === 'opus' ? 'Opus' : 'Sonnet'} · ${map[k].e}<small>${stats(k)}</small></div>`).join('')}</div>
      ${ts.map(t => `<div class="row"><div class="lab">${t} วิ</div>${order.map((k, j) => `<img class="${j === 3 ? 'gap' : ''}" src="${img(k, t)}">`).join('')}</div>`).join('')}`;
    const page = await browser.newPage({viewport: {width: 400, height: 400}});
    await page.setContent(html, {waitUntil: 'load'});
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({path: path.join(OUT, `editorial_models_${i + 1}.jpg`), fullPage: true, type: 'jpeg', quality: 82});
    await page.close();
  }
  await browser.close();
})();
