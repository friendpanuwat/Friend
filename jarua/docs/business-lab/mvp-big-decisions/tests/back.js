/* ปุ่มย้อนกลับของมือถือ (history.back) ต้องพาไปที่เดียวกับปุ่มย้อนกลับในแอปทุกหน้า (แบบเดียวกับตัวที่ 1)
   ผล → เลือกเรื่อง · เช็กความพร้อม / แก้ตัวเลข → ผล · ข้อคำถาม → ข้อก่อนหน้า · หน้าเลือกเรื่อง → ออกจากเครื่องมือ
   รัน: node tests/back.js (ต้อง ./build.sh ก่อน) */
const { open } = require('./harness');
(async () => {
  const { browser, page, errors } = await open({ w: 390, h: 844 });
  let bad = 0;
  const view = () => page.evaluate(() => { const s = window.__lab3.state; return { v: s.view, t: s.topic, s: s.step, d: s.dstep }; });
  async function expect(label, want) {
    await page.waitForTimeout(150);
    const got = await view();
    const ok = Object.keys(want).every(k => got[k] === want[k]);
    if (!ok) bad++;
    console.log((ok ? 'ok  ' : 'BAD ') + label + ' → ' + JSON.stringify(got));
  }
  const phoneBack = () => page.evaluate(() => history.back());
  const tap = async sel => { await page.click(sel); await page.waitForTimeout(100); };

  /* นับการเพิ่มประวัติระหว่างจัดการปุ่มย้อนกลับ (Chrome บนมือถือข้ามขั้นที่เพิ่มแบบนี้ แล้วออกจากเครื่องมือไปเลย) */
  await page.evaluate(() => {
    let inPop = false; window.__popPush = 0;
    window.addEventListener('popstate', () => { inPop = true; setTimeout(() => { inPop = false; }, 0); }, true);
    const o = history.pushState.bind(history);
    history.pushState = function () { if (inPop) window.__popPush++; return o.apply(null, arguments); };
  });

  /* ร้านตัวอย่าง: เลือกเรื่อง → ผล → เช็กความพร้อม / แก้ตัวเลข */
  await tap('[data-act="where"][data-v="both"]');
  await tap('[data-act="sample"]');
  await tap('[data-act="topic"][data-t="hire"]'); await expect('sample: topic opens result', { v: 'result', t: 'hire' });
  await tap('#foot [data-act="ask"]'); await expect('result → check readiness', { v: 'ask' });
  await tap('.ask-ans button[data-v="yes"]'); await page.waitForTimeout(300); await expect('answer moves to next question', { v: 'ask' });
  await phoneBack(); await expect('phone back from questions → result', { v: 'result' });
  await tap('#foot [data-act="ask"]'); await tap('.bar [data-act="back"]'); await expect('app back from questions → result', { v: 'result' });
  await tap('#foot [data-act="lab"]'); await expect('result → edit numbers', { v: 'lab' });
  await phoneBack(); await expect('phone back from edit numbers → result', { v: 'result' });
  await tap('#foot [data-act="lab"]'); await tap('.bar [data-act="back"]'); await expect('app back from edit numbers → result', { v: 'result' });
  await phoneBack(); await expect('phone back from result → topic list', { v: 'start', t: null });
  await tap('[data-act="topic"][data-t="price"]'); await expect('another topic', { v: 'result', t: 'price' });
  await tap('.bar [data-act="back"]'); await expect('app back from result → topic list', { v: 'start', t: null });
  const pp1 = await page.evaluate(() => window.__popPush);
  if (pp1) bad++;
  console.log((pp1 ? 'BAD ' : 'ok  ') + 'no history entries added while handling a back press (sample) → ' + pp1);
  await phoneBack(); await page.waitForTimeout(300);
  const left1 = !/test\.html/.test(page.url()) || (await page.evaluate(() => !window.__lab3));
  if (!left1) bad++;
  console.log((left1 ? 'ok  ' : 'BAD ') + 'phone back on topic list leaves the tool (not into the previous topic) → ' + page.url());

  /* กรอกเอง: เลือกเรื่อง → รูปแบบร้าน → ตัวเลขร้านทีละข้อ · ย้อนทีละข้อ แล้วออกไปหน้าเลือกเรื่อง */
  const testUrl = 'file://' + require('path').join(__dirname, '..', '.out', 'test.html');
  await page.goto(testUrl); await page.waitForFunction(() => window.__lab3 && window.__lab3.state); await page.waitForTimeout(200);
  await page.evaluate(() => {
    let inPop = false; window.__popPush = 0;
    window.addEventListener('popstate', () => { inPop = true; setTimeout(() => { inPop = false; }, 0); }, true);
    const o = history.pushState.bind(history);
    history.pushState = function () { if (inPop) window.__popPush++; return o.apply(null, arguments); };
  });
  await page.evaluate(() => { sessionStorage.clear(); const L = window.__lab3; L.state.model = null; L.state.inp = {}; L.state.ds = {}; L.state.topic = null; L.state.where = 'both'; L.state.isSample = false; L.go('start', false); });
  await tap('[data-act="topic"][data-t="hire"]'); await expect('own shop: topic opens shop type', { v: 'shop' });
  await tap('[data-act="model"][data-m="unit"]'); await expect('shop type → first question', { v: 'wizard', s: 0 });
  await page.fill('#f-price', '60'); await tap('#foot [data-act="next"]'); await expect('next question', { v: 'wizard', s: 1 });
  await phoneBack(); await expect('phone back one question', { v: 'wizard', s: 0 });
  await tap('.bar [data-act="prev"]'); await expect('app back from first question → shop type', { v: 'shop' });
  await phoneBack(); await expect('phone back from shop type → topic list', { v: 'start' });

  /* ตัวเลขร้านครบแล้ว: คำถามของเรื่องทีละข้อ ย้อนทีละข้อ ข้อแรก → หน้าเลือกเรื่อง */
  await page.evaluate(() => { const L = window.__lab3, st = L.state; L.chooseModel('unit', true); st.isSample = false; st.sampleKind = null; st.ds = {}; L.go('start', false); });
  await tap('[data-act="topic"][data-t="ads"]'); await expect('topic with own numbers → its first question', { v: 'dq', d: 0 });
  const tex = await page.$('.t-ex'); if (!tex) bad++; console.log((tex ? 'ok  ' : 'BAD ') + 'first question shows what the topic tells you');
  /* ตอบทุกข้อของเรื่องไว้ก่อน (ยังอยู่ข้อแรก) แล้วกดถัดไป */
  if (await page.$('[data-act="dkind"]')) await tap('[data-act="dkind"]');
  for (const el of await page.$$('.qfields input[data-dk]')) if (await el.isVisible()) await el.fill('1000');
  await tap('#foot [data-act="d-next"]');
  const s2 = await view();
  if (s2.v === 'dq' && s2.d === 1) {
    console.log('ok  second question → ' + JSON.stringify(s2));
    await phoneBack(); await expect('phone back to first question', { v: 'dq', d: 0 });
    const tex2 = await page.$('.t-ex'); if (!tex2) bad++; console.log((tex2 ? 'ok  ' : 'BAD ') + 'topic description still on first question');
  } else { bad++; console.log('BAD first question did not move on → ' + JSON.stringify(s2)); }
  await tap('.bar [data-act="d-prev"]'); await expect('app back from first question → topic list', { v: 'start' });

  const pp = await page.evaluate(() => window.__popPush);
  if (pp) bad++;
  console.log((pp ? 'BAD ' : 'ok  ') + 'no history entries added while handling a back press → ' + pp);
  if (errors.length) { bad++; console.log('ERRORS', errors); }
  await browser.close();
  console.log(bad ? bad + ' PROBLEMS' : 'BACK OK');
  process.exit(bad ? 1 : 0);
})();
