/* ปุ่มย้อนกลับของมือถือ (history.back) ต้องพาไปที่เดียวกับปุ่มย้อนกลับในแอปทุกหน้า (แบบเดียวกับตัวที่ 1 และ 3)
   สินค้า → หน้าแรก · ช่องทาง → สินค้า · สัดส่วน → ช่องทาง · ช่องทางที่ k → ข้อก่อนหน้า · ค่าใช้จ่ายคงที่ k → ข้อก่อนหน้า
   ผล → หน้าแรก · รายละเอียด / แก้ตัวเลข / หาจุดที่ควรตรวจสอบ / จุดที่ควรตรวจสอบ → ผล · แก้ทีละส่วน → แก้ตัวเลข (ยังไม่ครบ = ยกเลิก ใช้ตัวเลขเดิม)
   หน้าแรก → ออกจากเครื่องมือ · ระหว่างจัดการปุ่มย้อนกลับต้องไม่เพิ่มประวัติ (Chrome บนมือถือข้ามขั้นที่เพิ่มแบบนี้)
   รัน: ./build.sh แล้ว node tests/back.js */
const path = require('path');
const { open } = require('./harness');
const TEST_URL = 'file://' + path.join(__dirname, '..', '.out', 'test.html');
let bad = 0;
const say = (ok, label, extra) => { if (!ok) bad++; console.log((ok ? 'ok  ' : 'BAD ') + label + (extra !== undefined ? ' → ' + (typeof extra === 'string' ? extra : JSON.stringify(extra)) : '')); };

(async () => {
  const { browser, page, errors } = await open({ w: 390, h: 844 });
  try {
  const view = () => page.evaluate(() => { if (!window.__lab4) return { gone: true }; const s = window.__lab4.state; return { v: s.view, k: s.k, editing: !!s.editing }; });
  const tap = async (sel, w) => { await page.click(sel); await page.waitForTimeout(w === undefined ? 110 : w); };
  const fill = async (sel, v) => { await page.fill(sel, String(v)); await page.waitForTimeout(110); };
  const phoneBack = async () => { await page.evaluate(() => history.back()); await page.waitForTimeout(260); };
  const appBack = async (sel) => { await tap(sel || '.bar [data-act="back"]', 200); };
  const same = (got, want) => Object.keys(want).every(k => got[k] === want[k]);
  async function expect(label, want) { await page.waitForTimeout(60); const got = await view(); say(same(got, want), label, got); return got; }
  async function installCounter() {
    await page.evaluate(() => {
      let inPop = false; window.__popPush = 0;
      window.addEventListener('popstate', () => { inPop = true; setTimeout(() => { inPop = false; }, 0); }, true);
      const o = history.pushState.bind(history);
      history.pushState = function () { if (inPop) window.__popPush++; return o.apply(null, arguments); };
    });
  }
  /* หน้าใหม่ที่ประวัติก่อนหน้าไม่ใช่เครื่องมือนี้ (ไว้ตรวจว่าย้อนกลับจากหน้าแรกออกจากเครื่องมือจริง) */
  async function fresh() {
    await page.goto(TEST_URL);
    await page.evaluate(() => { try { sessionStorage.clear(); } catch (e) { /* ignore */ } });
    await page.goto('about:blank'); await page.goto(TEST_URL);
    const left = await page.evaluate(() => JSON.stringify([window.__lab4.state.model, window.__lab4.state.pc]));
    if (left !== JSON.stringify([null, { items: [], rest: null, channels: [] }])) say(false, 'fresh page still has an old shop', left);
    await page.waitForFunction(() => window.__lab4 && window.__lab4.state); await page.waitForTimeout(150);
    await installCounter();
  }
  /* หน้าเดียวกัน: ย้อนกลับของมือถือ แล้วกลับมาหน้าเดิม แล้วกดย้อนกลับในแอป · ต้องไปที่เดียวกัน */
  async function both(label, reenter, want, appSel) {
    const before = await view();
    await phoneBack(); const a = await expect('phone back: ' + label, want);
    await reenter();
    const again = await view();
    if (!same(again, before)) say(false, '  re-enter for ' + label, again);
    await appBack(appSel); const b = await expect('app back:   ' + label, want);
    say(same(a, b), '  phone and app land on the same page (' + label + ')', [a, b]);
    await reenter();
  }
  const next = () => tap('#foot [data-act="step-next"]', 150);
  const popPush = async (label) => { const pp = await page.evaluate(() => window.__popPush); say(pp === 0, 'no history entries added while handling back (' + label + ')', pp); };
  async function leaves(label) {
    await phoneBack(); await page.waitForTimeout(250);
    const url = page.url(), gone = !/test\.html/.test(url) || (await page.evaluate(() => !window.__lab4));
    say(gone, 'phone back on start leaves the tool (' + label + ')', url);
  }

  /* ===== 1. กรอกเอง หลายช่องทาง: ขายของที่ทำเอง ทั้งหน้าร้านและออนไลน์ ===== */
  await fresh();
  await tap('[data-act="where"][data-v="both"]');
  await tap('[data-act="model"][data-m="unit"]'); await expect('model → items', { v: 'items', k: 0 });
  await both('items → start', () => tap('[data-act="model"][data-m="unit"]'), { v: 'start' });
  await fill('#f-inp-daysOpen', 26);
  await fill('#f-i-0-name', 'ลาเต้เย็น'); await fill('#f-i-0-price', 70); await fill('#f-i-0-cost', 24); await fill('#f-i-0-qty', 30);
  await tap('[data-act="item-add"]');
  await fill('#f-i-1-name', 'ครัวซองต์'); await fill('#f-i-1-price', 75); await fill('#f-i-1-cost', 40); await fill('#f-i-1-qty', 6);
  await tap('[data-act="pset"][data-path="r.on"][data-v="false"]');
  await next(); await expect('items → chpick', { v: 'chpick', k: 0 });
  await both('chpick → items', next, { v: 'items', k: 0 });
  await tap('[data-act="ch-toggle"][data-k="shop"]'); await tap('[data-act="ch-toggle"][data-k="grab"]');
  await next(); await expect('chpick → share', { v: 'share', k: 0 });
  await both('share → chpick', next, { v: 'chpick', k: 0 });
  await fill('#f-c-0-share', 70); await fill('#f-c-1-share', 30);
  await next(); await expect('share → ch 0', { v: 'ch', k: 0 });
  await both('ch 0 → share', next, { v: 'share', k: 0 });
  for (const k of ['fee', 'disc', 'perOrder', 'monthly']) if (await page.$(`[data-act="pset"][data-path="c.0.${k}"][data-v="0"]`)) await tap(`[data-act="pset"][data-path="c.0.${k}"][data-v="0"]`);
  await next(); await expect('ch 0 → ch 1', { v: 'ch', k: 1 });
  await both('ch 1 → ch 0 (bottom back button)', next, { v: 'ch', k: 0 }, '#foot [data-act="back"]');
  await tap('[data-act="pset"][data-path="c.1.priceMode"][data-v="up"]'); await fill('#f-c-1-markup', 15);
  await fill('#f-c-1-fee', 30); await tap('[data-act="pset"][data-path="c.1.vat"][data-v="ex"]');
  await tap('[data-act="pset"][data-path="c.1.disc"][data-v="0"]'); await fill('#f-c-1-perOrder', 6); await fill('#f-c-1-ipo', 1.5);
  await tap('[data-act="pset"][data-path="c.1.monthly"][data-v="0"]');
  await next(); await expect('ch 1 → fixed 0', { v: 'fixed', k: 0 });
  await both('fixed 0 → ch 1', next, { v: 'ch', k: 1 });
  await fill('#f-inp-staffCount', 1); await fill('#f-inp-staffSalary', 12000); await fill('#f-inp-ownerSalary', 15000);
  await next(); await expect('fixed 0 → fixed 1', { v: 'fixed', k: 1 });
  await both('fixed 1 → fixed 0', next, { v: 'fixed', k: 0 });
  await fill('#f-inp-rent', 18000); await fill('#f-inp-marketing', 3000); await fill('#f-inp-otherFixed', 9000);
  await next(); await expect('fixed 1 → fixed 2', { v: 'fixed', k: 2 });
  await both('fixed 2 → fixed 1', next, { v: 'fixed', k: 1 });
  await fill('#f-inp-cash', 30000);
  await next(); await expect('fixed 2 → result', { v: 'result' });
  await popPush('own flow steps');

  /* ผล → หน้าแรก (กลับมาด้วยปุ่ม "ดูผล" ที่หน้าแรก) */
  await both('result → start', () => tap('[data-act="result"]', 200), { v: 'start' }, '.bar [data-act="back"]');
  await expect('back on result', { v: 'result' });
  /* รายละเอียด → ผล */
  await tap('.rank4 .rk4'); await expect('result → prod', { v: 'prod' });
  await both('prod → result', () => tap('.rank4 .rk4'), { v: 'result' });
  await appBack();
  await tap('.tabs4 [data-v="c"]'); await tap('.chl4 .chc'); await expect('result → chan', { v: 'chan' });
  await both('chan → result', () => tap('.chl4 .chc'), { v: 'result' });
  await appBack();
  /* ลองปรับค้างไว้แล้วย้อนกลับ: ยังไม่ใช้ค่านี้ → ตัวเลขเดิม */
  await tap('.chl4 .chc');
  const fee0 = await page.evaluate(() => window.__lab4.state.pc.channels[window.__lab4.state.sel].fee);
  await tap('.stp[data-k="fee"]:not([data-d^="-"])', 200);
  await phoneBack(); await expect('phone back with an unsaved trial → result', { v: 'result' });
  const tr = await page.evaluate(() => [window.__lab4.state.trial, window.__lab4.state.pc.channels[window.__lab4.state.sel].fee]);
  say(tr[0] === null && tr[1] === fee0, 'unsaved trial is dropped', tr);
  /* แก้ตัวเลข → ผล */
  await tap('#foot [data-act="review"]'); await expect('result → review', { v: 'review' });
  await both('review → result', () => tap('#foot [data-act="review"]'), { v: 'result' });
  /* แก้ทีละส่วน → แก้ตัวเลข */
  for (const [v, k] of [['items', null], ['chpick', null], ['share', null], ['ch', '1'], ['fixed', '0'], ['fixed', '2']]) {
    const sel = `.rv-row[data-act="edit"][data-v="${v}"]` + (k !== null ? `[data-k="${k}"]` : '');
    await tap(sel); await expect('review → editing ' + v + (k || ''), { v, editing: true });
    await both('editing ' + v + (k || '') + ' → review', () => tap(sel), { v: 'review', editing: false });
    await appBack(); await expect('editing ' + v + ' app back again → review', { v: 'review' });
  }
  /* แก้ไม่ครบแล้วย้อนกลับ → ยกเลิก ใช้ตัวเลขเดิม (ทั้งสองปุ่ม) */
  const snapNums = () => page.evaluate(() => JSON.stringify([window.__lab4.state.pc, window.__lab4.state.inp]));
  const orig = await snapNums();
  for (const how of ['phone', 'app']) {
    for (const [sel, field, label] of [['.rv-row[data-v="items"]', '#f-i-0-price', 'clear item price'], ['.rv-row[data-v="ch"][data-k="1"]', '#f-c-1-fee', 'clear channel fee'], ['.rv-row[data-v="fixed"][data-k="1"]', '#f-inp-rent', 'clear rent'], ['.rv-row[data-v="share"]', '#f-c-0-share', 'clear a share']]) {
      await tap(sel); await fill(field, '');
      if (how === 'phone') await phoneBack(); else await appBack();
      await expect(how + ' back after "' + label + '" → review', { v: 'review', editing: false });
      const now = await snapNums();
      const toast = await page.evaluate(() => [...document.querySelectorAll('.toast')].map(t => t.textContent).join(''));
      say(now === orig, '  incomplete edit cancelled, numbers restored (' + how + ', ' + label + ')', now === orig ? toast : now.slice(0, 160));
    }
    /* ช่องทางที่เพิ่มแต่ยังไม่ได้ตอบ */
    await tap('.rv-row[data-v="chpick"]'); await tap('[data-act="ch-toggle"][data-k="lineman"]');
    if (how === 'phone') await phoneBack(); else await appBack();
    await expect(how + ' back after adding an unanswered channel → review', { v: 'review' });
    say((await snapNums()) === orig, '  half-added channel removed (' + how + ')');
  }
  /* แก้ครบแล้วย้อนกลับ: ทั้งสองปุ่มเหมือนกัน */
  await tap('.rv-row[data-v="items"]'); await fill('#f-i-0-price', 72); await phoneBack();
  const pPhone = await page.evaluate(() => window.__lab4.state.pc.items[0].price);
  await tap('.rv-row[data-v="items"]'); await fill('#f-i-0-price', 74); await appBack();
  const pApp = await page.evaluate(() => window.__lab4.state.pc.items[0].price);
  say((pPhone === 72) === (pApp === 74), 'complete edit + back: phone and app keep/drop the same way', { phone: pPhone, app: pApp });
  await tap('#foot [data-act="result"]', 200); await expect('review → result', { v: 'result' });
  /* หาจุดที่ควรตรวจสอบ → ผล */
  await tap('#foot [data-act="ask"]'); await expect('result → ask', { v: 'ask' });
  await both('ask q1 → result', () => tap('#foot [data-act="ask"]'), { v: 'result' });
  await appBack();
  await tap('#foot [data-act="ask"]');
  const q0 = await page.evaluate(() => window.__lab4.state.qidx);
  await tap('.ask-ans button[data-v="unsure"]', 350);
  const q1 = await page.evaluate(() => [window.__lab4.state.view, window.__lab4.state.qidx]);
  if (q1[0] === 'ask' && q1[1] > q0) await both('ask q' + (q1[1] + 1) + ' → result', () => tap('#foot [data-act="ask"]', 150), { v: 'result' });
  else say(q1[0] === 'points', 'answer moves on', q1);
  await phoneBack(); await expect('ask → result', { v: 'result' });
  /* จุดที่ควรตรวจสอบ → ผล */
  await tap('#foot [data-act="ask"]');
  for (let i = 0; i < 8 && (await view()).v === 'ask'; i++) await tap('.ask-ans button[data-v="unsure"]', 350);
  await expect('answer all → points', { v: 'points' });
  const toPoints = async () => { await tap('#foot [data-act="ask"]', 150); for (let i = 0; i < 8 && (await view()).v === 'ask'; i++) await tap('.ask-ans button[data-v="unsure"]', 350); };
  await both('points → result', toPoints, { v: 'result' });
  await appBack(); await expect('points → result', { v: 'result' });
  await popPush('own result pages');
  /* ผล → หน้าแรก → ออกจากเครื่องมือ */
  await phoneBack(); await expect('result → start', { v: 'start' });
  await popPush('own, before leaving');
  await leaves('own shop');

  /* ===== 2. ช่องทางเดียว: ช่องทาง → เลือกช่องทาง (ไม่มีหน้าสัดส่วน) · ร้านมีตัวเลขร้านแล้ว: ช่องทางสุดท้าย → ผล ===== */
  await fresh();
  await tap('[data-act="where"][data-v="online"]');
  await tap('[data-act="model"][data-m="service"]');
  await fill('#f-inp-daysOpen', 24);
  await fill('#f-i-0-name', 'สอนแต่งหน้าออนไลน์'); await fill('#f-i-0-price', 500); await fill('#f-i-0-cost', 50); await fill('#f-i-0-qty', 2);
  await tap('[data-act="pset"][data-path="r.on"][data-v="false"]');
  await next(); await tap('[data-act="ch-toggle"][data-k="web"]'); await next();
  await expect('single channel: chpick → ch 0', { v: 'ch', k: 0 });
  await both('single ch 0 → chpick', next, { v: 'chpick', k: 0 });
  await tap('[data-act="pset"][data-path="c.0.priceMode"][data-v="same"]');
  for (const k of ['fee', 'disc', 'perOrder', 'monthly']) if (await page.$(`[data-act="pset"][data-path="c.0.${k}"][data-v="0"]`)) await tap(`[data-act="pset"][data-path="c.0.${k}"][data-v="0"]`);
  await next(); await expect('single ch 0 → fixed 0', { v: 'fixed', k: 0 });
  await both('single fixed 0 → ch 0', next, { v: 'ch', k: 0 });
  for (const k of ['staffCount', 'ownerSalary']) await tap(`[data-act="pset"][data-path="inp.${k}"][data-v="0"]`);
  await next();
  for (const k of ['rent', 'marketing', 'otherFixed']) await tap(`[data-act="pset"][data-path="inp.${k}"][data-v="0"]`);
  await next(); await tap('[data-act="pset"][data-path="inp.cash"][data-v="0"]'); await next();
  await expect('single → result', { v: 'result' });
  /* เปิดใหม่ (ตัวเลขร้านครบแล้ว ไม่มีข้อค่าใช้จ่ายคงที่): แก้ช่องทาง → ย้อนกลับ */
  await tap('.bar [data-act="back"]', 200); await expect('result → start', { v: 'start' });
  await tap('[data-act="model"][data-m="service"]', 200); await expect('tile of the same model reopens the result', { v: 'result' });
  await phoneBack(); await expect('result → start', { v: 'start' });
  await popPush('single');
  await leaves('single channel');

  /* ===== 3. ร้านตัวอย่าง ===== */
  await fresh();
  await tap('[data-act="where"][data-v="shop"]');
  await tap('[data-act="sample"]', 200); await expect('sample → result', { v: 'result' });
  await both('sample result → start', () => tap('[data-act="sample"]', 200), { v: 'start' });
  await tap('.rank4 .rk4'); await both('sample prod → result', () => tap('.rank4 .rk4'), { v: 'result' }); await appBack();
  await tap('.tabs4 [data-v="g"]'); await tap('.grid4 td:not(.na) button');
  await expect('grid cell → prod', { v: 'prod' }); await phoneBack(); await expect('grid prod → result', { v: 'result' });
  await tap('#foot [data-act="review"]'); await tap('.rv-row[data-v="ch"][data-k="2"]');
  await both('sample editing ch 2 → review', () => tap('.rv-row[data-v="ch"][data-k="2"]'), { v: 'review' });
  await appBack(); await expect('sample review', { v: 'review' }); await phoneBack(); await expect('sample review → result', { v: 'result' });
  await phoneBack(); await expect('sample result → start', { v: 'start' });
  await popPush('sample');
  await leaves('sample');

  } catch (e) { say(false, 'crashed at ' + JSON.stringify(await page.evaluate(() => window.__lab4 && window.__lab4.state.view).catch(() => '?')), e.message.split('\n').slice(0, 3).join(' ')); }
  say(!errors.length, 'no console errors', errors.slice(0, 5));
  await browser.close();
  console.log(bad ? bad + ' PROBLEMS' : 'BACK OK');
  process.exit(bad ? 1 : 0);
})();
