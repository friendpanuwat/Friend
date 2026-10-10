// Scripted player session through the real UI. node tools/uiflow.js outDir
const { chromium } = require('playwright');
const path = require('path');
const out = process.argv[2];
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1360, height: 900 } });
  const errors = [];
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  await page.goto('file://' + path.join(__dirname, '..', 'dist', 'runway.html'));
  await page.fill('#ng_name', 'ภูมิ'); await page.fill('#ng_company', 'Thaiflow'); await page.fill('#ng_seed', '777');
  await page.click('button[data-act="startGame"]');
  let shot = 1;
  const snap = async (name, full) => { await page.screenshot({ path: `${out}/${String(shot++).padStart(2, '0')}-${name}.png`, fullPage: !!full }); };
  const tab = async t => { await page.click(`.rail button[data-a='["${t}"]']`); await page.waitForTimeout(80); };
  let eventShots = 0;
  async function handleModals(pickFn) {
    for (let i = 0; i < 12; i++) {
      const modal = await page.$('.modal');
      if (!modal) return;
      const ok = await page.$('button[data-act="closeResult"]');
      if (ok) { await ok.click(); await page.waitForTimeout(60); continue; }
      const title = await page.$eval('.modal h2', e => e.textContent);
      if (eventShots < 6) { await snap('event-' + eventShots++); }
      const choices = await page.$$('.modal .choice:not([disabled])');
      const idx = pickFn ? pickFn(title, choices.length) : 0;
      await choices[Math.min(idx, choices.length - 1)].click();
      await page.waitForTimeout(80);
    }
  }
  const pick = (title, n) => (/กลับไปทำงาน|ลาออก|ปั๊ม|ปรับตัวเลข|ค่าน้ำร้อน|เงียบๆ/.test(title) ? Math.min(1, n - 1) : 0);
  async function week(n) { for (let i = 0; i < n; i++) { await handleModals(pick); await page.click('button[data-act="advance"][data-a=\'["week"]\']'); await page.waitForTimeout(30); } await handleModals(pick); }
  // register & focus
  await tab('company'); await page.click('button[data-act="register"]'); await page.click('button[data-act="assignIP"]');
  await tab('founder');
  await page.$eval('#sl_fFocus_discover', el => { el.value = 30; el.dispatchEvent(new Event('change', { bubbles: true })); });
  await page.waitForTimeout(80);
  await snap('founder-focus', true);
  await week(3);
  // hire an engineer
  await tab('team'); await page.click('button[data-act="teamSub"][data-a=\'["hire"]\']');
  await page.selectOption('#h_role', 'eng'); await page.selectOption('#h_level', '2'); await page.selectOption('#h_ch', 'linkedin');
  await page.click('button[data-act="openPos"]');
  await week(3);
  await tab('team'); await page.click('button[data-act="teamSub"][data-a=\'["hire"]\']');
  await snap('candidates', true);
  const offer = await page.$('button[data-act="makeOffer"]');
  if (offer) { await offer.click(); await page.waitForTimeout(100); }
  await snap('after-offer');
  await week(10);
  await tab('product'); await snap('product-later', true);
  // start a pre-seed raise
  await tab('funding'); await page.click('button[data-act="fundSub"][data-a=\'["raise"]\']');
  await page.click('button[data-act="startRaise"]');
  await page.waitForTimeout(100);
  await snap('raise-started', true);
  for (let i = 0; i < 12; i++) {
    await page.click('button[data-act="advance"][data-a=\'["week"]\']'); await page.waitForTimeout(40);
    const ts = await page.$('.modal h2');
    if (ts) { const t = await ts.textContent(); if (/ข้อเสนอ|Term Sheet/.test(t)) { await snap('termsheet'); } }
    await handleModals(pick);
  }
  await tab('funding'); await snap('funding-after', true);
  await week(20);
  await tab('overview'); await snap('overview-w40', true);
  await tab('finance'); await snap('finance-w40', true);
  await tab('growth'); await snap('growth-w40', true);
  await tab('market'); await snap('market-w40', true);
  console.log('errors:', errors.length ? errors.join('\n') : 'none');
  console.log('week', await page.$eval('.date', e => e.textContent));
  await browser.close();
})();
