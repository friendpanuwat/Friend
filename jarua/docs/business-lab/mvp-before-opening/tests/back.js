/* ปุ่มย้อนกลับของมือถือ (history.back) ต้องพาไปที่เดียวกับปุ่มย้อนกลับในแอปทุกหน้า (แบบเดียวกับตัวที่ 1 3 4)
   ขายอะไร → หน้าแรก · ขั้นที่ k → ขั้นก่อนหน้า (รวมค่าใช้จ่ายทุกเดือน 2 ข้อ) · ผล → หน้าแรก
   แก้ตัวเลข / หาจุดที่ควรตรวจสอบ / จุดที่ควรตรวจสอบ → ผล · แก้ทีละส่วน → แก้ตัวเลข (ยังไม่ครบ = ยกเลิก ใช้ตัวเลขเดิม)
   หน้าแรก → ออกจากเครื่องมือ · ระหว่างจัดการปุ่มย้อนกลับต้องไม่เพิ่มประวัติ
   รัน: ./build.sh แล้ว NODE_PATH=/opt/node22/lib/node_modules node tests/back.js */
const path = require('path');
const { open } = require('./harness');
const TEST_URL = 'file://' + path.join(__dirname, '..', '.out', 'test.html');
let bad = 0, oks = 0;
const say = (ok, label, extra) => { if (!ok) bad++; else oks++; console.log((ok ? 'ok  ' : 'BAD ') + label + (extra !== undefined ? ' → ' + (typeof extra === 'string' ? extra : JSON.stringify(extra)) : '')); };

(async () => {
  const { browser, page, errors } = await open({ w: 390, h: 844 });
  try {
    const view = () => page.evaluate(() => { if (!window.__labOpen) return { gone: true }; const s = window.__labOpen.state; return { v: s.view, k: s.k, editing: !!s.editing }; });
    const tap = async (sel, w) => { await page.click(sel); await page.waitForTimeout(w === undefined ? 110 : w); };
    const fill = async (sel, v) => { await page.fill(sel, String(v)); await page.waitForTimeout(110); };
    const chip = (p, v) => tap(`[data-act="pset"][data-path="${p}"][data-v="${v}"]`);
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
    /* หน้าใหม่ที่ประวัติก่อนหน้าไม่ใช่เครื่องมือนี้ */
    async function fresh() {
      await page.goto(TEST_URL);
      await page.evaluate(() => { try { sessionStorage.clear(); } catch (e) { /* ignore */ } });
      await page.goto('about:blank'); await page.goto(TEST_URL);
      await page.waitForFunction(() => window.__labOpen && window.__labOpen.state); await page.waitForTimeout(150);
      const left = await page.evaluate(() => JSON.stringify([window.__labOpen.state.model, window.__labOpen.state.op.items, window.__labOpen.state.where]));
      if (left !== JSON.stringify([null, [], null])) say(false, 'fresh page still has an old shop', left);
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
      const url = page.url(), gone = !/test\.html/.test(url) || (await page.evaluate(() => !window.__labOpen));
      say(gone, 'phone back on start leaves the tool (' + label + ')', url);
    }
    const nums = () => page.evaluate(() => JSON.stringify([window.__labOpen.state.inp, window.__labOpen.state.op]));

    /* ===== 1. กรอกเอง ขายของที่ทำเอง หน้าร้าน (ถามค่าใช้จ่ายทุกเดือน) ===== */
    await fresh();
    await tap('[data-act="where"][data-v="shop"]');
    await tap('[data-act="model"][data-m="unit"]'); await expect('model → sell', { v: 'sell', k: 0 });
    await both('sell → start', () => tap('[data-act="model"][data-m="unit"]'), { v: 'start' });
    await fill('#f-inp-price', 60); await fill('#f-inp-unitCost', 22); await chip('inp.feePct', 0);
    await next(); await expect('sell → vol', { v: 'vol', k: 0 });
    await both('vol → sell', next, { v: 'sell', k: 0 });
    await fill('#f-inp-daysOpen', 30); await fill('#f-inp-volume', 60);
    await next(); await expect('vol → open', { v: 'open', k: 0 });
    await both('open → vol', next, { v: 'vol', k: 0 });
    await chip('op.fit', 1); await tap('[data-path="op.openMonth"][data-v="5"]'); await chip('op.seasonAsked', 'yes');
    await tap('[data-act="ss-tog"][data-c="4"]'); await fill('#f-ss-highPct', 20);
    await next(); await expect('open → ramp', { v: 'ramp', k: 0 });
    await both('ramp → open (bottom back button)', next, { v: 'open', k: 0 }, '#foot [data-act="back"]');
    await tap('[data-act="ramp"][data-v="r3"]');
    await next(); await expect('ramp → fixed 0', { v: 'fixed', k: 0 });
    await both('fixed 0 → ramp', next, { v: 'ramp', k: 0 });
    await fill('#f-inp-staffCount', 1); await fill('#f-inp-staffSalary', 13000); await fill('#f-inp-ownerSalary', 15000);
    await next(); await expect('fixed 0 → fixed 1', { v: 'fixed', k: 1 });
    await both('fixed 1 → fixed 0', next, { v: 'fixed', k: 0 });
    await fill('#f-inp-rent', 12000); await chip('inp.marketing', 0); await fill('#f-inp-otherFixed', 6000);
    await next(); await expect('fixed 1 → su', { v: 'su', k: 0 });
    await both('su → fixed 1', next, { v: 'fixed', k: 1 });
    await chip('op.mode', 'items');
    await tap('[data-act="su-tog"][data-k="tools"]'); await fill('#f-su-0-amt', 60000);
    await tap('[data-act="su-tog"][data-k="deposit"]'); await fill('#f-su-1-amt', 24000);
    await tap('[data-act="su-tog"][data-k="other"]'); await fill('#f-su-2-name', 'ค่าทดลองสูตร'); await fill('#f-su-2-amt', 5000);
    await next(); await expect('su → save', { v: 'save', k: 0 });
    await both('save → su', next, { v: 'su', k: 0 });
    await fill('#f-op-savings', 220000);
    await next(); await expect('save → result', { v: 'result' });
    await popPush('own flow steps');

    /* ผล → หน้าแรก (กลับมาด้วยปุ่ม "ดูผล" ที่หน้าแรก) */
    await both('result → start', () => tap('.shopline [data-act="result"]', 200), { v: 'start' });
    await expect('back on result', { v: 'result' });
    /* ลองปรับค้างไว้แล้วย้อนกลับ: ยังไม่ใช้ค่านี้ → ตัวเลขเดิม */
    const n0s = await nums();
    await tap('[data-act="tstep"][data-k="volume"]:not([data-d^="-"])', 200);
    await phoneBack(); await expect('phone back with an unsaved trial → start', { v: 'start' });
    const tr = await page.evaluate(() => window.__labOpen.state.trial);
    say(tr === null && (await nums()) === n0s, 'unsaved trial is dropped', tr);
    await tap('.shopline [data-act="result"]', 200);
    await tap('[data-act="tstep"][data-k="price"]:not([data-d^="-"])', 200);
    await appBack(); await expect('app back with an unsaved trial → start', { v: 'start' });
    say((await page.evaluate(() => window.__labOpen.state.trial)) === null && (await nums()) === n0s, 'unsaved trial is dropped (app back)');
    await tap('.shopline [data-act="result"]', 200); await expect('start → result', { v: 'result' });
    /* แก้ตัวเลข → ผล */
    await tap('#foot [data-act="review"]'); await expect('result → review', { v: 'review' });
    await both('review → result', () => tap('#foot [data-act="review"]'), { v: 'result' });
    /* แก้ทีละส่วน → แก้ตัวเลข */
    for (const [v, k] of [['sell', null], ['vol', null], ['open', null], ['ramp', null], ['fixed', '0'], ['fixed', '1'], ['su', null], ['save', null]]) {
      const sel = `.rv-row[data-act="edit"][data-v="${v}"]` + (k !== null ? `[data-k="${k}"]` : '');
      await tap(sel); await expect('review → editing ' + v + (k || ''), { v, editing: true });
      await both('editing ' + v + (k || '') + ' → review', () => tap(sel), { v: 'review', editing: false });
      await appBack(); await expect('editing ' + v + ' app back again → review', { v: 'review' });
    }
    /* แก้ไม่ครบแล้วย้อนกลับ → ยกเลิก ใช้ตัวเลขเดิม (ทั้งสองปุ่ม) */
    const orig = await nums();
    const EDITS = [
      ['.rv-row[data-v="sell"]', async () => fill('#f-inp-price', ''), 'clear price'],
      ['.rv-row[data-v="sell"]', async () => fill('#f-inp-feePct', 120), 'fee 120%'],
      ['.rv-row[data-v="vol"]', async () => fill('#f-inp-daysOpen', 40), 'days 40'],
      ['.rv-row[data-v="vol"]', async () => fill('#f-inp-volume', ''), 'clear volume'],
      ['.rv-row[data-v="open"]', async () => fill('#f-op-fit', 30), 'fit 30 months'],
      ['.rv-row[data-v="open"]', async () => { await tap('[data-act="ss-tog"][data-c="4"]'); await tap('[data-act="ss-tog"][data-c="4"]'); }, 'season month removed'],
      ['.rv-row[data-v="fixed"][data-k="0"]', async () => fill('#f-inp-ownerSalary', ''), 'clear owner salary'],
      ['.rv-row[data-v="fixed"][data-k="1"]', async () => fill('#f-inp-rent', ''), 'clear rent'],
      ['.rv-row[data-v="su"]', async () => fill('#f-su-2-name', ''), 'clear other name'],
      ['.rv-row[data-v="su"]', async () => { await tap('[data-act="su-del"][data-j="0"]'); await tap('[data-act="su-del"][data-j="0"]'); await tap('[data-act="su-del"][data-j="0"]'); }, 'delete every item'],
      ['.rv-row[data-v="save"]', async () => fill('#f-op-savings', ''), 'clear savings']
    ];
    for (const how of ['phone', 'app']) {
      for (const [sel, act, label] of EDITS) {
        await tap(sel); await act();
        if (how === 'phone') await phoneBack(); else await appBack();
        await expect(how + ' back after "' + label + '" → review', { v: 'review', editing: false });
        const now = await nums();
        const toast = await page.evaluate(() => [...document.querySelectorAll('.toast')].map(t => t.textContent).join(''));
        say(now === orig, '  incomplete edit cancelled, numbers restored (' + how + ', ' + label + ')', now === orig ? toast : now.slice(0, 200));
        say(/ยกเลิก/.test(toast), '  says the edit was cancelled (' + how + ', ' + label + ')', toast);
      }
    }
    /* แก้ครบแล้วย้อนกลับ: ทั้งสองปุ่มเหมือนกัน */
    await tap('.rv-row[data-v="sell"]'); await fill('#f-inp-price', 62); await phoneBack();
    const pPhone = await page.evaluate(() => window.__labOpen.state.inp.price);
    await tap('.rv-row[data-v="sell"]'); await fill('#f-inp-price', 64); await appBack();
    const pApp = await page.evaluate(() => window.__labOpen.state.inp.price);
    say((pPhone === 62) === (pApp === 64), 'complete edit + back: phone and app keep/drop the same way', { phone: pPhone, app: pApp });
    await tap('#foot [data-act="result"]', 200); await expect('review → result', { v: 'result' });
    /* หาจุดที่ควรตรวจสอบ → ผล */
    await tap('#foot [data-act="ask"]'); await expect('result → ask', { v: 'ask' });
    await both('ask q1 → result', () => tap('#foot [data-act="ask"]'), { v: 'result' });
    await appBack();
    await tap('#foot [data-act="ask"]');
    const q0 = await page.evaluate(() => window.__labOpen.state.qidx);
    await tap('.ask-ans button[data-v="unsure"]', 350);
    const q1 = await page.evaluate(() => [window.__labOpen.state.view, window.__labOpen.state.qidx]);
    if (q1[0] === 'ask' && q1[1] > q0) await both('ask q' + (q1[1] + 1) + ' → result', () => tap('#foot [data-act="ask"]', 150), { v: 'result' });
    else say(q1[0] === 'points', 'answer moves on', q1);
    const qBack = await page.evaluate(() => window.__labOpen.state.qidx);
    say(qBack === q1[1], 'reopening ask continues at the first unanswered question', [qBack, q1[1]]);
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

    /* ===== 2. ร้านที่มีตัวเลขร้านครบแล้ว (ไม่ถามค่าใช้จ่ายทุกเดือน): ขั้นเงินก่อนเปิด → ยอดขายเดือนแรก ๆ ===== */
    await page.goto(TEST_URL); await page.waitForTimeout(150);
    await page.evaluate(() => { const s = JSON.parse(sessionStorage.getItem('lab-shop')); sessionStorage.clear(); sessionStorage.setItem('lab-shop', JSON.stringify(s)); });
    await page.goto('about:blank'); await page.goto(TEST_URL); await page.waitForTimeout(150); await installCounter();
    await tap('[data-act="where"][data-v="online"]');
    await tap('[data-act="model"][data-m="unit"]', 200);
    let v2 = await view();
    say(v2.v === 'open', 'shared shop numbers: model opens at the first unanswered step (open)', v2);
    const nsteps = await page.evaluate(() => document.querySelectorAll('.prog i').length);
    say(nsteps === 6, 'shared fixed costs: 6 steps (no fixed)', nsteps);
    await both('open (first unanswered) → vol', next, { v: 'vol', k: 0 });
    await chip('op.fit', 0); await tap('[data-path="op.openMonth"][data-v="1"]'); await chip('op.seasonAsked', 'no');
    await next(); await tap('[data-act="ramp"][data-v="now"]'); await next();
    await expect('ramp → su (fixed skipped)', { v: 'su', k: 0 });
    await both('su → ramp (fixed skipped)', next, { v: 'ramp', k: 0 });
    await chip('op.mode', 'lump'); await fill('#f-op-lump', 50000); await next();
    await fill('#f-op-savings', 120000); await next();
    await expect('→ result', { v: 'result' });
    /* แก้ค่าใช้จ่ายทุกเดือนจากแก้ตัวเลข แล้วย้อนกลับ */
    await tap('#foot [data-act="review"]'); await tap('.rv-row[data-v="fixed"][data-k="1"]');
    await expect('review → editing fixed 1 (not asked in the flow)', { v: 'fixed', k: 1, editing: true });
    await both('editing fixed 1 → review', () => tap('.rv-row[data-v="fixed"][data-k="1"]'), { v: 'review' });
    await appBack(); await expect('review', { v: 'review' });
    await phoneBack(); await expect('review → result', { v: 'result' });
    await phoneBack(); await expect('result → start', { v: 'start' });
    /* tile ของรูปแบบเดิม → เปิดผลเลย */
    await tap('[data-act="model"][data-m="unit"]', 200); await expect('tile of the same model reopens the result', { v: 'result' });
    await phoneBack(); await expect('result → start', { v: 'start' });
    await popPush('shared');
    await leaves('shared shop');

    /* ===== 3. ร้านตัวอย่าง (แตะครั้งเดียวจากหน้าแรก) ===== */
    await fresh();
    await tap('[data-act="sample1"][data-k="salon"]', 200); await expect('sample → result', { v: 'result' });
    await both('sample result → start', () => tap('[data-act="sample"]', 200), { v: 'start' });
    await tap('#foot [data-act="review"]'); await tap('.rv-row[data-v="su"]');
    await both('sample editing su → review', () => tap('.rv-row[data-v="su"]'), { v: 'review' });
    await appBack(); await expect('sample review', { v: 'review' }); await phoneBack(); await expect('sample review → result', { v: 'result' });
    await tap('#foot [data-act="ask"]'); await phoneBack(); await expect('sample ask → result', { v: 'result' });
    await phoneBack(); await expect('sample result → start', { v: 'start' });
    say(await page.evaluate(() => window.__labOpen.state.isSample), 'start after the sample still offers the sample result');
    await popPush('sample');
    await leaves('sample');

    /* ===== 4. ร้านตัวอย่างหลังจากเลือกขายที่ไหน ===== */
    await fresh();
    await tap('[data-act="where"][data-v="online"]');
    await tap('[data-act="sample"]', 200); await expect('where online → sample', { v: 'result' });
    say((await page.evaluate(() => window.__labOpen.state.sampleKind)) === 'online', 'online → clothing sample');
    await appBack(); await expect('sample → start', { v: 'start' });
    await tap('[data-act="model"][data-m="service"]', 200); await expect('model tile on sample start → own sell', { v: 'sell' });
    await both('own sell after sample → start', () => tap('[data-act="model"][data-m="service"]', 200), { v: 'start' });
    await popPush('sample then own');
    await leaves('sample then own');
  } catch (e) { say(false, 'crashed at ' + JSON.stringify(await page.evaluate(() => window.__labOpen && window.__labOpen.state.view).catch(() => '?')), e.message.split('\n').slice(0, 3).join(' ')); }
  say(!errors.length, 'no console errors', errors.slice(0, 5));
  await browser.close();
  console.log(oks + ' ok · ' + bad + ' bad');
  console.log(bad ? bad + ' PROBLEMS' : 'BACK OK');
  process.exit(bad ? 1 : 0);
})();
