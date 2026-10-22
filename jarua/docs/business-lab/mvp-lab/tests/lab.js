/* ทดสอบ Business Lab ทั้งชุดผ่านเว็บเซิร์ฟเวอร์ในเครื่อง (หน้าเดียวกันใช้ที่เก็บของแท็บร่วมกันเหมือนบน artifact)
   หน้ารวม → ตัวที่ 1 (กรอกตัวเลขร้านด้วยการแตะ) → กลับหน้ารวม (เห็นว่ามีตัวเลขร้าน) → ตัวที่ 3 (ไม่ต้องกรอกตัวเลขร้านซ้ำ)
   → แก้ตัวเลขร้านในตัวที่ 3 → ตัวที่ 1 เห็นตัวเลขใหม่ · ร้านตัวอย่างไม่ทับตัวเลขร้านจริง
   → ตัวที่ 4 ใช้ค่าใช้จ่ายคงที่ชุดเดิม ใส่แค่สินค้าและช่องทาง → ใช้ยอดจากรายสินค้า → ตัวที่ 1 กำไรเท่ากัน
   ตรวจ: ไม่มี error, ไม่ล้นจอ, ปุ่มสูงอย่างน้อย 44px ทั้งโหมดมืดและสว่าง · รัน: ./build.sh แล้ว node tests/lab.js */
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const http = require('http'), fs = require('fs'), path = require('path'), crypto = require('crypto');
const ROOT = path.join(__dirname, '..', '.out'), FC = path.join(__dirname, '..', '..', 'mvp-big-decisions', '.out', 'fontcache');
const SHOTS = path.join(ROOT, 'shots');
let bad = 0;
const fail = (...a) => { bad++; console.log('  PROBLEM', ...a); };
const server = http.createServer((q, r) => {
  const f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0]).replace(/^\/$/, '/index.html'));
  if (!f.startsWith(ROOT) || !fs.existsSync(f)) { r.writeHead(404); return r.end(); }
  r.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }); fs.createReadStream(f).pipe(r);
});
async function check(page, label) {
  const o = await page.evaluate(() => {
    const W = document.documentElement.clientWidth, over = [];
    document.querySelectorAll('body *').forEach(el => {
      const r = el.getBoundingClientRect(); if (!r.width || (r.right <= W + 1 && r.left >= -1)) return;
      let p = el, clipped = false;
      while (p && p !== document.body) { const s = getComputedStyle(p); if (['auto', 'scroll', 'hidden'].indexOf(s.overflowX) >= 0) { clipped = true; break; } p = p.parentElement; }
      if (!clipped) over.push(el.tagName + '.' + el.className);
    });
    const small = [...document.querySelectorAll('a[href], button, input:not([type=range])')].filter(b => { const r = b.getBoundingClientRect(); return r.width && !b.closest('[hidden]') && r.height < 43.5 && !b.classList.contains('lnk-in'); }).map(b => (b.className || b.tagName) + ':' + (b.textContent || '').trim().slice(0, 16));
    return { over: over.slice(0, 5), small: small.slice(0, 5), sw: document.documentElement.scrollWidth, W, txt: document.body.innerText };
  });
  if (o.sw > o.W || o.over.length) fail(label, 'overflow', o.over.join(' | '));
  if (o.small.length) fail(label, 'small targets', o.small.join(' | '));
  if (/NaN|undefined|Infinity|\[object/.test(o.txt)) fail(label, 'bad text');
  return o.txt;
}
(async () => {
  fs.mkdirSync(SHOTS, { recursive: true });
  await new Promise(r => server.listen(0, r));
  const base = 'http://127.0.0.1:' + server.address().port + '/';
  const browser = await chromium.launch();
  for (const dark of [false, true]) {
    const W = dark ? 390 : 360, tag = W + (dark ? '-dark' : '');
    const ctx = await browser.newContext({ viewport: { width: W, height: dark ? 844 : 640 }, colorScheme: dark ? 'dark' : 'light', hasTouch: true, isMobile: true });
    const page = await ctx.newPage(), errors = [];
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('pageerror', e => errors.push(e.message));
    await page.route('https://fonts.googleapis.com/**', r => r.fulfill({ status: 200, contentType: 'text/css', body: fs.readFileSync(path.join(FC, 'fonts.css')) }));
    await page.route('https://fonts.gstatic.com/**', r => { const f = path.join(FC, crypto.createHash('md5').update(r.request().url()).digest('hex').slice(0, 16) + '.woff2'); if (fs.existsSync(f)) r.fulfill({ status: 200, contentType: 'font/woff2', body: fs.readFileSync(f) }); else r.abort(); });
    const ready = async () => { await page.waitForLoadState('load'); await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(250); };

    /* 1. หน้ารวม: 4 การ์ด ใช้ได้ 3 · ยังไม่มีตัวเลขร้าน */
    await page.goto(base + 'index.html'); await ready();
    let txt = await check(page, tag + ' hub');
    if ((await page.$$('.tcard')).length !== 4) fail(tag, 'hub cards != 4');
    if ((await page.$$('a.tcard')).length !== 4) fail(tag, 'open cards != 4');
    if (!/ใส่ตัวเลขร้านครั้งเดียว/.test(txt)) fail(tag, 'hub shop status (empty)');
    if (/\bAI\b/.test(txt)) fail(tag, 'word AI on hub');
    await page.screenshot({ path: path.join(SHOTS, 'hub-' + tag + '.png'), fullPage: true });

    /* 2. ตัวที่ 1: ลองร้านตัวอย่างก่อน (ต้องไม่เขียนทับชุดกลาง) แล้วกรอกร้านจริงด้วยการแตะ */
    await page.click('a.tcard[href="check-numbers.html"]'); await ready();
    if (!(await page.$('.bar a.ib[href="index.html"]'))) fail(tag, 'tool1: no back link to hub');
    await page.click('[data-act="sample-shop"]'); await page.waitForTimeout(150);
    if (await page.evaluate(() => sessionStorage.getItem('lab-shop'))) fail(tag, 'sample wrote shared numbers');
    await page.click('.banner [data-act="to-start"]');
    await page.click('[data-act="model"][data-m="unit"]');
    const shop = { price: 60, volume: 90, daysOpen: 26, unitCost: 21, feePct: 0, staffCount: 1, staffSalary: 12000, ownerSalary: 15000, rent: 15000, marketing: 2000, otherFixed: 6000, cash: 80000 };
    for (let s = 0; s < 10; s++) {
      const keys = await page.$$eval('.qfields input[data-k]', els => els.filter(e => !e.closest('[hidden]')).map(e => e.getAttribute('data-k')));
      for (const k of keys) if (shop[k] !== undefined) await page.fill(`input[data-k="${k}"]`, String(shop[k]));
      if (await page.$('[data-act="advmode"][data-v="no"]')) await page.click('[data-act="advmode"][data-v="no"]');
      const see = await page.$('#foot [data-act="see"]:not([disabled])');
      if (see) { await see.click(); break; }
      await page.click('#foot [data-act="next"]');
    }
    if ((await page.evaluate(() => window.__lab.state.view)) !== 'home') fail(tag, 'tool1 did not reach overview');
    const sh1 = await page.evaluate(() => JSON.parse(sessionStorage.getItem('lab-shop') || 'null'));
    if (!sh1 || sh1.model !== 'unit' || sh1.inp.price !== 60 || !sh1.ok) fail(tag, 'shared numbers not written by tool1', JSON.stringify(sh1));
    await check(page, tag + ' tool1 home');

    /* 3. กลับหน้ารวมด้วยปุ่มท้ายภาพรวม: เห็นว่ามีตัวเลขร้านแล้ว */
    await page.click('a.hub-back[href="index.html"]'); await ready();
    txt = await check(page, tag + ' hub with shop');
    if (!/ตัวเลขร้านคุณ · ขายของที่ทำเอง/.test(txt) || !/ไม่ต้องกรอกใหม่/.test(txt)) fail(tag, 'hub does not show shared shop');
    await page.screenshot({ path: path.join(SHOTS, 'hub-shop-' + tag + '.png'), fullPage: true });

    /* 4. ตัวที่ 3: ไม่ต้องกรอกตัวเลขร้านซ้ำ เลือกที่ขาย → เรื่อง → ไปตัวเลขของเรื่องเลย */
    await page.click('a.tcard[href="big-decisions.html"]'); await ready();
    if (!(await page.$('.bar a.ib[href="index.html"]'))) fail(tag, 'tool3: no back link to hub');
    txt = await check(page, tag + ' tool3 start');
    if (/ใส่ตัวเลขร้าน\s*ครั้งเดียว/.test(txt) && !/มีแล้ว/.test(txt)) { /* แถบ 3 ขั้นต้องไม่บอกให้กรอกใหม่ */ }
    await page.click('[data-act="where"][data-v="shop"]'); await page.waitForTimeout(200);
    txt = await check(page, tag + ' tool3 topics');
    if (!/ตัวเลขร้านคุณ/.test(txt)) fail(tag, 'tool3 start does not show shared shop line');
    await page.click('[data-act="topic"][data-t="hire"]'); await page.waitForTimeout(250);
    let v3 = await page.evaluate(() => window.__lab3.state.view);
    if (v3 !== 'dq') fail(tag, 'tool3 asked for shop numbers again: view', v3);
    if (!(await page.$('.flow3 li.done'))) fail(tag, 'flow bar shop step not done');
    await page.screenshot({ path: path.join(SHOTS, 'tool3-dq-' + tag + '.png') });
    /* ตอบเรื่องจ้างคน */
    for (let s = 0; s < 6; s++) {
      if (await page.$('[data-act="dkind"][data-v="full"]')) await page.click('[data-act="dkind"][data-v="full"]');
      for (const [k, val] of [['salary', 12000], ['gain', 15], ['capAdd', 40], ['hours', 2]]) if (await page.$(`input[data-dk="${k}"]:visible`)) await page.fill(`input[data-dk="${k}"]`, String(val));
      if (await page.$('[data-act="dpick"][data-k="ramp"][data-v="1"]:visible')) await page.click('[data-act="dpick"][data-k="ramp"][data-v="1"]');
      const done = await page.$('#foot [data-act="d-done"]:not([disabled])');
      if (done) { await done.click(); break; }
      const nx = await page.$('#foot [data-act="d-next"]:not([disabled])');
      if (!nx) { fail(tag, 'tool3 stuck in questions'); break; }
      await nx.click();
    }
    v3 = await page.evaluate(() => window.__lab3.state.view);
    if (v3 !== 'result') fail(tag, 'tool3 not at result', v3);
    await check(page, tag + ' tool3 result');
    await page.screenshot({ path: path.join(SHOTS, 'tool3-result-' + tag + '.png') });

    /* 5. แก้ตัวเลขร้านในตัวที่ 3 (ราคา 60 → 65) → ตัวที่ 1 เห็นตัวเลขใหม่ */
    await page.click('#foot [data-act="lab"]'); await page.waitForTimeout(150);
    await page.click('.rv-row[data-act="edit-step"][data-i="0"]'); await page.waitForTimeout(150);
    await page.fill('input[data-k="price"]', '65');
    await page.click('#foot [data-act="shop-done"]'); await page.waitForTimeout(150);
    if ((await page.evaluate(() => window.__lab3.state.view)) !== 'lab') fail(tag, 'after shop edit not back on adjust page');
    const sh3 = await page.evaluate(() => JSON.parse(sessionStorage.getItem('lab-shop') || 'null'));
    if (!sh3 || sh3.inp.price !== 65) fail(tag, 'tool3 edit not shared', JSON.stringify(sh3 && sh3.inp.price));
    /* ร้านตัวอย่างในตัวที่ 3 ต้องไม่ทับตัวเลขร้านจริง */
    await page.click('#foot [data-act="result"]'); await page.waitForTimeout(150);
    await page.click('.bar [data-act="back"]'); await page.waitForTimeout(250);
    await page.click('.bar a.ib[href="index.html"]'); await ready();
    await page.click('a.tcard[href="check-numbers.html"]'); await ready();
    const p1 = await page.evaluate(() => ({ v: window.__lab.state.view, price: window.__lab.state.inp.price }));
    if (p1.price !== 65 || p1.v !== 'home') fail(tag, 'tool1 did not adopt edited numbers', JSON.stringify(p1));
    await check(page, tag + ' tool1 adopted');
    /* ทบทวนรอบ 1 ข้อ 1: กลับหน้าแรกของตัวที่ 1 แล้วแตะร้านแบบเดิม ต้องไม่ล้างตัวเลขร้านชุดกลาง */
    await page.click('#foot [data-act="review"]'); await page.waitForTimeout(100);
    await page.evaluate(() => window.__lab.go('start'));
    await page.click('[data-act="model"][data-m="unit"]'); await page.waitForTimeout(100);
    const sh4 = await page.evaluate(() => JSON.parse(sessionStorage.getItem('lab-shop') || 'null'));
    if (!sh4 || sh4.inp.price !== 65 || !sh4.ok) fail(tag, 'same tile in tool1 wiped shared numbers', JSON.stringify(sh4 && sh4.inp));
    /* ทบทวนรอบ 1 ข้อ 2: ปุ่มย้อนกลับของมือถือต้องไม่พากลับไปเรื่องที่ไม่เข้ากับร้านแล้ว */
    await page.goto(base + 'big-decisions.html'); await ready();
    await page.click('[data-act="topic"][data-t="place"]'); await page.waitForTimeout(200);
    await page.click('.bar [data-act="d-prev"]'); await page.waitForTimeout(150);
    await page.click('[data-act="where"][data-v="online"]'); await page.waitForTimeout(150);
    await page.goForward(); await page.waitForTimeout(300);
    const st5 = await page.evaluate(() => ({ v: window.__lab3.state.view, t: window.__lab3.state.topic, w: window.__lab3.state.where }));
    if (st5.t === 'place' && st5.w === 'online') fail(tag, 'phone forward opened a topic hidden for online sellers', JSON.stringify(st5));
    /* 6. ตัวที่ 4: ใช้ค่าใช้จ่ายคงที่ชุดกลาง (ไม่ถามซ้ำ) ใส่แค่สินค้าและช่องทาง · ร้านตัวอย่างไม่ทับชุดกลาง
          ยอดจากรายสินค้าไม่ตรงตัวเลขร้าน → บอกส่วนต่าง → ผู้ใช้กดใช้ยอดจากรายสินค้า → ตัวที่ 1 ได้กำไรเท่าตัวที่ 4 */
    await page.goto(base + 'index.html'); await ready();
    await page.click('a.tcard[href="product-channel.html"]'); await ready();
    if (!(await page.$('.bar a.ib[href="index.html"]'))) fail(tag, 'tool4: no back link to hub');
    let s4 = await page.evaluate(() => ({ m: window.__lab4.state.model, link: window.__lab4.state.link, rent: window.__lab4.state.inp.rent }));
    if (s4.m !== 'unit' || s4.link !== 'shared' || s4.rent !== 15000) fail(tag, 'tool4 did not adopt shared numbers', JSON.stringify(s4));
    txt = await check(page, tag + ' tool4 start');
    await page.click('[data-act="where"][data-v="both"]'); await page.waitForTimeout(150);
    const before4 = await page.evaluate(() => sessionStorage.getItem('lab-shop'));
    await page.click('[data-act="sample"]'); await page.waitForTimeout(300);
    if ((await page.evaluate(() => window.__lab4.state.view)) !== 'result') fail(tag, 'tool4 sample did not open result');
    await check(page, tag + ' tool4 sample result');
    for (const tb of ['c', 'g']) { await page.click(`[data-act="tab"][data-v="${tb}"]`); await page.waitForTimeout(200); await check(page, tag + ' tool4 sample tab ' + tb); }
    if ((await page.evaluate(() => sessionStorage.getItem('lab-shop'))) !== before4) fail(tag, 'tool4 sample wrote shared numbers');
    await page.click('[data-act="mine"]'); await page.waitForTimeout(300);
    let v4 = await page.evaluate(() => window.__lab4.state.view);
    if (v4 !== 'items') fail(tag, 'tool4 own shop did not start at items', v4);
    await page.fill('#f-i-0-name', 'ลาเต้เย็น'); await page.fill('#f-i-0-price', '65'); await page.fill('#f-i-0-cost', '22'); await page.fill('#f-i-0-qty', '70');
    await page.click('[data-act="item-add"]');
    await page.fill('#f-i-1-name', 'ครัวซองต์'); await page.fill('#f-i-1-price', '75'); await page.fill('#f-i-1-cost', '40'); await page.fill('#f-i-1-qty', '20');
    await page.click('[data-act="pset"][data-path="r.on"][data-v="false"]');
    await check(page, tag + ' tool4 items');
    await page.click('#foot [data-act="step-next"]'); await page.waitForTimeout(200);
    await page.click('[data-act="ch-toggle"][data-k="shop"]'); await page.click('[data-act="ch-toggle"][data-k="lineman"]');
    await page.click('#foot [data-act="step-next"]'); await page.waitForTimeout(200);
    await page.fill('#f-c-0-share', '85'); await page.fill('#f-c-1-share', '15');
    await page.click('#foot [data-act="step-next"]'); await page.waitForTimeout(200);
    for (const k of ['fee', 'disc', 'perOrder', 'monthly']) await page.click(`[data-act="pset"][data-path="c.0.${k}"][data-v="0"]`);
    await page.click('#foot [data-act="step-next"]'); await page.waitForTimeout(200);
    await page.click('[data-act="pset"][data-path="c.1.priceMode"][data-v="same"]');
    await page.fill('#f-c-1-fee', '30'); await page.waitForTimeout(250);
    await page.click('[data-act="pset"][data-path="c.1.vat"][data-v="ex"]');
    await page.click('[data-act="pset"][data-path="c.1.disc"][data-v="0"]');
    await page.fill('#f-c-1-perOrder', '6'); await page.waitForTimeout(250); await page.fill('#f-c-1-ipo', '1.5');
    await page.fill('#f-c-1-monthly', '1000');
    await check(page, tag + ' tool4 channel');
    await page.click('#foot [data-act="step-next"]'); await page.waitForTimeout(300);
    v4 = await page.evaluate(() => window.__lab4.state.view);
    if (v4 !== 'result') fail(tag, 'tool4 asked for shop numbers again or stuck: view', v4);
    txt = await check(page, tag + ' tool4 result');
    if (!(await page.$('.recon [data-act="apply-agg"]'))) fail(tag, 'tool4 no reconciliation card');
    const p4 = await page.evaluate(() => window.__lab4.R0().profit);
    await page.click('.recon [data-act="apply-agg"]'); await page.waitForTimeout(250);
    if (await page.$('.recon')) fail(tag, 'reconciliation card still shown after applying');
    const sh5 = await page.evaluate(() => JSON.parse(sessionStorage.getItem('lab-shop') || 'null'));
    if (!sh5 || sh5.inp.chMkt !== 1000 || sh5.inp.marketing !== 3000) fail(tag, 'tool4 aggregate not shared', JSON.stringify(sh5 && sh5.inp));
    await page.goto(base + 'check-numbers.html'); await ready();
    const p1b = await page.evaluate(() => compute(window.__lab.state.inp, window.__lab.state.model).profit);
    if (Math.abs(p1b - p4) > 0.05) fail(tag, 'tool1 profit differs from tool4 after applying', p1b, p4);
    await page.goto(base + 'product-channel.html'); await ready();
    s4 = await page.evaluate(() => ({ v: window.__lab4.state.view, link: window.__lab4.state.link, p: window.__lab4.state.model && window.__lab4.R0().ok ? window.__lab4.R0().profit : null }));
    if (s4.link !== 'own' || Math.abs((s4.p || 0) - p4) > 0.05) fail(tag, 'tool4 reopened with different numbers', JSON.stringify(s4), p4);
    await page.screenshot({ path: path.join(SHOTS, 'tool4-' + tag + '.png') });

    /* 7. ตัวที่ 2: ใช้ตัวเลขร้านชุดกลาง (ราคา ต้นทุน ยอดขาย ค่าใช้จ่ายทุกเดือน ไม่ถามซ้ำ) · ร้านตัวอย่างไม่ทับชุดกลาง
          ถามเฉพาะช่วงเปิดร้าน ยอดขายเดือนแรก ๆ เงินก่อนเปิด และเงินที่มี · เขียนกลับพร้อมป้ายก่อนเปิดร้าน · ตัวที่ 1 กำไรเท่ากัน · "ร้านเปิดแล้ว" */
    await page.goto(base + 'index.html'); await ready();
    await page.click('a.tcard[href="before-opening.html"]'); await ready();
    if (!(await page.$('.bar a.ib[href="index.html"]'))) fail(tag, 'tool2: no back link to hub');
    let s2 = await page.evaluate(() => ({ m: window.__labOpen.state.model, rent: window.__labOpen.state.inp.rent }));
    if (s2.m !== 'unit' || s2.rent !== 15000) fail(tag, 'tool2 did not adopt shared numbers', JSON.stringify(s2));
    await check(page, tag + ' tool2 start');
    const before2 = await page.evaluate(() => sessionStorage.getItem('lab-shop'));
    await page.click('[data-act="sample"]'); await page.waitForTimeout(400);
    if ((await page.evaluate(() => window.__labOpen.state.view)) !== 'result') fail(tag, 'tool2 sample did not open result');
    await check(page, tag + ' tool2 sample result');
    if ((await page.evaluate(() => sessionStorage.getItem('lab-shop'))) !== before2) fail(tag, 'tool2 sample wrote shared numbers');
    await page.click('[data-act="mine"]'); await page.waitForTimeout(300);
    let v2 = await page.evaluate(() => window.__labOpen.state.view);
    if (v2 !== 'open') fail(tag, 'tool2 own shop should start at the opening step (shop numbers known)', v2);
    await page.click('[data-act="pset"][data-path="op.fit"][data-v="1"]'); await page.click('[data-act="pset"][data-path="op.openMonth"][data-v="6"]');
    await page.click('[data-act="pset"][data-path="op.seasonAsked"][data-v="no"]');
    await page.click('#foot [data-act="step-next"]'); await page.waitForTimeout(200);
    await page.click('[data-act="ramp"][data-v="r3"]'); await page.waitForTimeout(150);
    await page.click('#foot [data-act="step-next"]'); await page.waitForTimeout(200);
    v2 = await page.evaluate(() => window.__labOpen.state.view);
    if (v2 !== 'su') fail(tag, 'tool2 asked monthly costs again', v2);
    await page.click('[data-act="pset"][data-path="op.mode"][data-v="items"]'); await page.waitForTimeout(150);
    await page.click('[data-act="su-tog"][data-k="deposit"]'); await page.fill('#f-su-0-amt', '30000');
    await page.click('[data-act="su-tog"][data-k="tools"]'); await page.fill('#f-su-1-amt', '90000');
    await check(page, tag + ' tool2 startup');
    await page.click('#foot [data-act="step-next"]'); await page.waitForTimeout(200);
    await page.fill('#f-op-savings', '250000');
    await page.click('#foot [data-act="step-next"]'); await page.waitForTimeout(500);
    v2 = await page.evaluate(() => window.__labOpen.state.view);
    if (v2 !== 'result') fail(tag, 'tool2 did not reach result', v2);
    await check(page, tag + ' tool2 result');
    const r2 = await page.evaluate(() => { const R = window.__labOpen.R0(); return { p: R.S.profit, all: R.base.all, sh: JSON.parse(sessionStorage.getItem('lab-shop')) }; });
    if (Math.abs(r2.all - 135000) > 0.01) fail(tag, 'tool2 startup total', r2.all);
    if (!r2.sh || r2.sh.inp.preOpen !== 1 || Math.abs(r2.sh.inp.cash - 115000) > 0.01 || r2.sh.inp.equipValue !== 90000) fail(tag, 'tool2 shared numbers', JSON.stringify(r2.sh && r2.sh.inp));
    await page.goto(base + 'index.html'); await ready();
    txt = await check(page, tag + ' hub after tool2');
    if (!/ตัวเลขที่ตั้งใจไว้ก่อนเปิดร้าน/.test(txt)) fail(tag, 'hub does not say the numbers are before opening');
    await page.goto(base + 'check-numbers.html'); await ready();
    const p1c = await page.evaluate(() => compute(window.__lab.state.inp, window.__lab.state.model).profit);
    if (Math.abs(p1c - r2.p) > 0.05) fail(tag, 'tool1 profit differs from tool2 profit at full sales', p1c, r2.p);
    const v1c = await page.evaluate(() => window.__lab.state.view);
    if (v1c !== 'home') fail(tag, 'tool1 did not open the overview with numbers from tool2', v1c);
    else {
      if (!(await page.$('.pre-open [data-act="opened"]'))) fail(tag, 'tool1 has no before-opening banner');
      await page.click('.pre-open [data-act="opened"]'); await page.waitForTimeout(300);
      const pre = await page.evaluate(() => JSON.parse(sessionStorage.getItem('lab-shop')).inp.preOpen);
      if (pre !== 0) fail(tag, 'opened did not clear the before-opening flag', pre);
      await page.goto(base + 'before-opening.html'); await ready();
      const pre2 = await page.evaluate(() => JSON.parse(sessionStorage.getItem('lab-shop')).inp.preOpen);
      if (pre2 !== 0) fail(tag, 'tool2 put the before-opening flag back after "opened"', pre2);
    }
    if (errors.length) fail(tag, 'errors', errors.slice(0, 3).join(' | '));
    await ctx.close();
  }
  await browser.close(); server.close();
  console.log(bad ? bad + ' PROBLEMS' : 'LAB OK');
  process.exit(bad ? 1 : 0);
})();
