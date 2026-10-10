// Playwright smoke test of the built single-file game. node tools/uitest.js [outDir]
const { chromium } = require('playwright');
const path = require('path');
const out = process.argv[2] || 'shots';
const IND = process.argv[3] || 'saas';
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1360, height: 900 } });
  const errors = [];
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  await page.goto('file://' + path.join(__dirname, '..', 'dist', 'runway.html'));
  await page.waitForTimeout(500);
  await page.screenshot({ path: out + '/01-title.png', fullPage: true });
  await page.click(`button[data-act="ngSet"][data-a='["industry","${IND}"]']`);
  await page.waitForTimeout(100);
  await page.fill('#ng_name', 'ภูมิ');
  await page.fill('#ng_company', 'Thaiflow');
  await page.click('button[data-act="startGame"]');
  await page.waitForTimeout(300);
  await page.screenshot({ path: out + '/02-overview.png', fullPage: true });
  // close any modal
  async function clearModal() {
    for (let i = 0; i < 10; i++) {
      const c = await page.$('.modal .choice:not([disabled])');
      if (c) { await c.click(); await page.waitForTimeout(80); const ok = await page.$('button[data-act="closeResult"]'); if (ok) await ok.click(); await page.waitForTimeout(80); continue; }
      const ok = await page.$('button[data-act="closeResult"]'); if (ok) { await ok.click(); continue; }
      break;
    }
  }
  // register company
  await page.click('button[data-act="tab"][data-a=\'["company"]\']');
  await page.click('button[data-act="register"]');
  for (let i = 0; i < 20; i++) { await clearModal(); await page.click('button[data-act="advance"][data-a=\'["week"]\']'); await page.waitForTimeout(40); }
  if (process.env.SETUP) await page.evaluate(process.env.SETUP);
  await clearModal();
  const tabs = await page.$$eval('.rail button[data-act="tab"]', els => els.map(e => JSON.parse(e.getAttribute('data-a'))[0]));
  let n = 3;
  for (const t of tabs) {
    await page.click(`.rail button[data-a='["${t}"]']`);
    await page.waitForTimeout(120);
    await page.screenshot({ path: `${out}/${String(n++).padStart(2, '0')}-${t}.png`, fullPage: true });
  }
  // subtabs
  for (const [tab, act, vals] of (process.env.QUICK ? [] : [['team', 'teamSub', ['hire', 'policy']], ['finance', 'finSub', ['bs', 'cf', 'debt', 'tax']], ['funding', 'fundSub', ['raise', 'investors', 'exit']]])) {
    await page.click(`.rail button[data-a='["${tab}"]']`);
    for (const v of vals) {
      await page.click(`button[data-act="${act}"][data-a='["${v}"]']`);
      await page.waitForTimeout(100);
      await page.screenshot({ path: `${out}/${String(n++).padStart(2, '0')}-${tab}-${v}.png`, fullPage: true });
    }
  }
  // advance a lot by months
  for (let i = 0; i < 12; i++) { await clearModal(); await page.click('button[data-act="advance"][data-a=\'["month"]\']'); await page.waitForTimeout(40); }
  await clearModal();
  await page.click(`.rail button[data-a='["overview"]']`);
  await page.screenshot({ path: `${out}/${String(n++).padStart(2, '0')}-overview-later.png`, fullPage: true });
  // mobile
  await page.setViewportSize({ width: 400, height: 860 });
  await page.waitForTimeout(150);
  await page.screenshot({ path: `${out}/${String(n++).padStart(2, '0')}-mobile.png`, fullPage: false });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  console.log('mobile horizontal overflow px:', overflow);
  // dark
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.setViewportSize({ width: 1360, height: 900 });
  await page.screenshot({ path: `${out}/${String(n++).padStart(2, '0')}-dark.png`, fullPage: false });
  console.log('errors:', errors.length ? errors.join('\n') : 'none');
  await browser.close();
})();
