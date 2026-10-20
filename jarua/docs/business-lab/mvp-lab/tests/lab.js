/* ทดสอบ Business Lab ทั้งชุดผ่านเว็บเซิร์ฟเวอร์ในเครื่อง (หน้าเดียวกันใช้ที่เก็บของแท็บร่วมกันเหมือนบน artifact)
   หน้ารวม → ตัวที่ 1 (กรอกตัวเลขร้านด้วยการแตะ) → กลับหน้ารวม (เห็นว่ามีตัวเลขร้าน) → ตัวที่ 3 (ไม่ต้องกรอกตัวเลขร้านซ้ำ)
   → แก้ตัวเลขร้านในตัวที่ 3 → ตัวที่ 1 เห็นตัวเลขใหม่ · ร้านตัวอย่างไม่ทับตัวเลขร้านจริง
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

    /* 1. หน้ารวม: 4 การ์ด ใช้ได้ 2 · ยังไม่มีตัวเลขร้าน */
    await page.goto(base + 'index.html'); await ready();
    let txt = await check(page, tag + ' hub');
    if ((await page.$$('.tcard')).length !== 4) fail(tag, 'hub cards != 4');
    if ((await page.$$('a.tcard')).length !== 2) fail(tag, 'open cards != 2');
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
    if (errors.length) fail(tag, 'errors', errors.slice(0, 3).join(' | '));
    await ctx.close();
  }
  await browser.close(); server.close();
  console.log(bad ? bad + ' PROBLEMS' : 'LAB OK');
  process.exit(bad ? 1 : 0);
})();
