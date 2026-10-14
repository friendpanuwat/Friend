const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const DIR = __dirname, FC = path.join(DIR, '..', '.out', 'fontcache');
async function open(opts = {}) {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: opts.w || 390, height: opts.h || 844 }, deviceScaleFactor: opts.dpr || 1, colorScheme: opts.dark ? 'dark' : 'light', hasTouch: !!opts.touch, isMobile: !!opts.touch });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') errors.push(m.type() + ': ' + m.text()); });
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  await page.route('https://fonts.googleapis.com/**', r => r.fulfill({ status: 200, contentType: 'text/css', body: fs.readFileSync(path.join(FC, 'fonts.css')) }));
  await page.route('https://fonts.gstatic.com/**', r => {
    const f = path.join(FC, crypto.createHash('md5').update(r.request().url()).digest('hex').slice(0, 16) + '.woff2');
    if (fs.existsSync(f)) r.fulfill({ status: 200, contentType: 'font/woff2', body: fs.readFileSync(f) }); else r.abort();
  });
  await page.goto('file://' + path.join(DIR, '..', '.out', 'test.html'));
  await page.evaluate(() => document.fonts.ready);
  return { browser, page, errors };
}
async function overflow(page) {
  return page.evaluate(() => {
    const W = document.documentElement.clientWidth;
    const bad = [];
    document.querySelectorAll('body *').forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.width && (r.right > W + 1 || r.left < -1)) {
        let p = el, inScroll = false;
        while (p && p !== document.body) { const s = getComputedStyle(p); if (s.overflowX === 'auto' || s.overflowX === 'scroll' || s.overflowX === 'hidden') { inScroll = true; break; } p = p.parentElement; }
        if (!inScroll) bad.push(el.tagName + '.' + el.className + ' [' + Math.round(r.left) + ',' + Math.round(r.right) + '] ' + (el.textContent || '').slice(0, 40));
      }
    });
    return { scrollW: document.documentElement.scrollWidth, W, bad: bad.slice(0, 10) };
  });
}
module.exports = { open, overflow, shot: (p, name, full) => p.screenshot({ path: path.join(DIR, '..', '.out', 'shots', name + '.png'), fullPage: !!full }) };
