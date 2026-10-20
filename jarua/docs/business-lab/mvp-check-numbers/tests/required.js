/* ทุกช่องต้องตอบ: กด "ถัดไป" ตอนยังไม่ครบแล้วไม่ไปต่อ บอก "ยังไม่ได้ตอบข้อนี้" · ปุ่ม "ไม่มี" / "ยังไม่รู้" ตอบแทนได้
   ข้อสุดท้ายต้องตอบ มี / ไม่มี · ร้านตัวอย่างทุกรูปแบบตอบครบอยู่แล้ว · รัน: node tests/required.js (ต้อง ./build.sh ก่อน) */
const { open, shot } = require('./harness');
(async () => {
  const { browser, page, errors } = await open({ w: 390, h: 844 });
  let bad = 0;
  const say = (ok, label, extra) => { if (!ok) bad++; console.log((ok ? 'ok  ' : 'BAD ') + label + (extra !== undefined ? ' → ' + JSON.stringify(extra) : '')); };
  const st = () => page.evaluate(() => ({ v: window.__lab.state.view, s: window.__lab.state.step, need: [...document.querySelectorAll('.need-msg')].map(x => x.closest('.field') && x.closest('.field').getAttribute('data-f')) }));

  /* ร้านตัวอย่างทุกรูปแบบ: ครบทุกข้อ (รวมข้อสุดท้าย) */
  const samples = await page.evaluate(() => MODEL_ORDER.map(m => {
    const inp = advNormalize(JSON.parse(JSON.stringify(MODELS[m].sample)), m);
    return [m, advValid(inp, m), inp.advMode || '-'];
  }));
  for (const [m, ok, mode] of samples) say(ok, 'sample ' + m + ' complete (extra details: ' + mode + ')');

  /* กรอกเองตั้งแต่ข้อแรก: ร้านขายบริการ */
  await page.evaluate(() => { sessionStorage.clear(); window.__lab.go('start'); });
  await page.click('[data-act="model"][data-m="service"]');
  await page.click('#foot [data-act="next"]'); await page.waitForTimeout(150);
  let s = await st();
  say(s.v === 'wizard' && s.s === 0 && s.need.includes('price'), 'empty step 1: next stays and marks price', s);
  await page.fill('#f-price', '350'); await page.click('#foot [data-act="next"]'); await page.waitForTimeout(100);
  await page.fill('#f-volume', '14'); await page.fill('#f-daysOpen', '26'); await page.click('#foot [data-act="next"]'); await page.waitForTimeout(100);
  await page.fill('#f-unitCost', '60'); await page.click('#foot [data-act="next"]'); await page.waitForTimeout(150);
  s = await st();
  say(s.s === 2 && s.need.includes('feePct'), 'fee left empty: stays on cost step', s);
  await page.click('[data-act="fchip"][data-k="feePct"]'); await page.click('#foot [data-act="next"]'); await page.waitForTimeout(100);
  s = await st(); say(s.s === 3, '"ไม่มี" answers the fee', s);
  await page.click('#foot [data-act="next"]'); await page.waitForTimeout(150);
  s = await st(); say(s.s === 3 && s.need.includes('staffCount') && s.need.includes('ownerSalary'), 'people step: every empty box is marked', s);
  await page.click('[data-act="fchip"][data-k="staffCount"]'); await page.fill('#f-ownerSalary', '15000'); await page.click('#foot [data-act="next"]'); await page.waitForTimeout(100);
  for (const k of ['rent', 'marketing']) await page.click(`[data-act="fchip"][data-k="${k}"]`);
  await page.click('#foot [data-act="next"]'); await page.waitForTimeout(150);
  s = await st(); say(s.s === 4 && s.need.includes('otherFixed'), 'fixed costs: other costs still needed', s);
  await page.fill('#f-otherFixed', '6000'); await page.click('#foot [data-act="next"]'); await page.waitForTimeout(100);
  await page.click('#foot [data-act="next"]'); await page.waitForTimeout(150);
  s = await st(); say(s.s === 5 && s.need.includes('cash'), 'cash is required too', s);
  await page.fill('#f-cash', '50000'); await page.click('#foot [data-act="next"]'); await page.waitForTimeout(150);
  s = await st(); say(s.s === 6, 'reach the extra-details step', s);
  await page.click('#foot [data-act="see"]'); await page.waitForTimeout(150);
  s = await st(); say(s.v === 'wizard' && s.need.includes('advMode'), 'see results without Yes/No: asks for it', s);
  await page.click('[data-act="advmode"][data-v="yes"]'); await page.click('#foot [data-act="see"]'); await page.waitForTimeout(150);
  s = await st(); say(s.v === 'wizard' && s.need.includes('advPick'), 'Yes without a group: asks to pick one', s);
  await page.click('[data-act="advpick"][data-g="adv-grow"]'); await page.click('#foot [data-act="see"]'); await page.waitForTimeout(150);
  s = await st(); say(s.v === 'wizard' && s.need.includes('growth'), 'picked group: every number needed', s);
  await shot(page, 'req-adv-yes');
  await page.click('[data-act="fchip"][data-k="growth"]'); await page.click('[data-act="funk"][data-k="capacity"]');
  await page.click('#foot [data-act="see"]'); await page.waitForTimeout(200);
  s = await st(); say(s.v === 'home', '"เท่าเดิม" + "ยังไม่รู้" complete the group → results', s);
  const cap = await page.evaluate(() => [window.__lab.state.inp.capacity, window.__lab.state.inp.advUnk]);
  say(cap[0] === undefined && cap[1] && cap[1].capacity === true, '"ยังไม่รู้" leaves capacity unlimited', cap);
  await shot(page, 'req-home');

  /* เปลี่ยนเป็น "ไม่มี" แล้วตัวเลขในกลุ่มหาย */
  await page.evaluate(() => { const L = window.__lab; L.state.editing = true; L.state.step = 6; L.go('wizard'); });
  await page.click('[data-act="advmode"][data-v="no"]');
  const cleared = await page.evaluate(() => { const i = window.__lab.state.inp; return [i.growth, i.advPick, i.advUnk]; });
  say(cleared[0] === undefined && cleared[1].length === 0 && cleared[2] === undefined, '"No" clears the extra numbers', cleared);
  await page.click('#foot [data-act="see"]'); await page.waitForTimeout(150);
  s = await st(); say(s.v === 'home', 'No → results', s);

  /* ฤดูกาล: เลือกกลุ่มแต่ไม่ได้แตะเดือน → บอกที่ตารางเดือน */
  await page.evaluate(() => { const L = window.__lab; L.state.editing = true; L.state.step = 6; L.go('wizard'); });
  await page.click('[data-act="advmode"][data-v="yes"]'); await page.click('[data-act="advpick"][data-g="adv-season"]');
  await page.click('#foot [data-act="see"]'); await page.waitForTimeout(200);
  s = await st(); say(s.v === 'wizard' && s.need.includes('season'), 'season picked, no month: marks the month grid', s);
  /* ภาพรวมตอนตัวเลขไม่ครบ (เช่น ราคา 0) ยังมีปุ่มแก้ตัวเลข */
  await page.evaluate(() => { const L = window.__lab; L.state.inp.price = 0; L.state.view = 'home'; L.render(); });
  const foot = await page.$('#foot [data-act="review"]');
  say(!!foot, 'incomplete overview still has the แก้ตัวเลข button');

  if (errors.length) { bad++; console.log('ERRORS', errors); }
  await browser.close();
  console.log(bad ? bad + ' PROBLEMS' : 'REQUIRED OK');
  process.exit(bad ? 1 : 0);
})();
