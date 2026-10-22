/* ตัวเลขร้านชุดกลาง (sessionStorage 'lab-shop' ผ่าน LabShop) ของตัวที่ 2
   · ตัวที่ 2 เขียน inp พร้อม preOpen: 1 · เงินสด (cash) = เงินที่มี − เงินก่อนเปิดร้านทั้งหมด · อุปกรณ์ → equipValue / equipYears + advMode / advPick
   · ร้านตัวอย่างไม่เขียนเลย · มีตัวเลขร้านแบบเดียวกันแล้ว → ข้ามค่าใช้จ่ายทุกเดือน
   · ตัวเลขร้านเป็นแบบที่ตัวที่ 2 ยังไม่รองรับ (เช่น สมาชิก) → ใช้ร่วมเฉพาะค่าใช้จ่ายคงที่ ไม่เขียนทับร้านแบบนั้น
   รัน: ./build.sh แล้ว NODE_PATH=/opt/node22/lib/node_modules node tests/shared.js */
const path = require('path');
const { open } = require('./harness');
const TEST_URL = 'file://' + path.join(__dirname, '..', '.out', 'test.html');
let bad = 0, oks = 0;
const say = (ok, label, extra) => { if (!ok) bad++; else oks++; console.log((ok ? 'ok  ' : 'BAD ') + label + (extra !== undefined && !ok ? ' → ' + (typeof extra === 'string' ? extra : JSON.stringify(extra)) : '')); };

(async () => {
  const { browser, page, errors } = await open({ w: 390, h: 844 });
  const tap = async (sel, w) => { await page.click(sel); await page.waitForTimeout(w === undefined ? 100 : w); };
  const fill = async (sel, v) => { await page.fill(sel, String(v)); await page.waitForTimeout(100); };
  const chip = (p, v) => tap(`[data-act="pset"][data-path="${p}"][data-v="${v}"]`);
  const next = () => tap('#foot [data-act="step-next"]', 140);
  const view = () => page.evaluate(() => { const s = window.__labOpen.state; return { v: s.view, k: s.k }; });
  const shop = () => page.evaluate(() => JSON.parse(sessionStorage.getItem('lab-shop') || 'null'));
  const st = () => page.evaluate(() => JSON.parse(JSON.stringify({ inp: window.__labOpen.state.inp, op: window.__labOpen.state.op, model: window.__labOpen.state.model, link: window.__labOpen.state.link, askFixed: window.__labOpen.state.askFixed })));
  const totals = () => page.evaluate(() => suTotals(window.__labOpen.state.op, window.__labOpen.state.inp));
  /* เปิดหน้าใหม่ · keep = เก็บตัวเลขร้านชุดกลางไว้ (ตัวเลขของตัวที่ 2 เองหาย) · put = ใส่ชุดกลางเอง */
  async function reopen(o) {
    o = o || {};
    await page.evaluate(o => {
      const sh = sessionStorage.getItem('lab-shop'); sessionStorage.clear();
      if (o.put) sessionStorage.setItem('lab-shop', JSON.stringify(o.put)); else if (o.keep && sh) sessionStorage.setItem('lab-shop', sh);
    }, o);
    await page.goto(TEST_URL); await page.waitForFunction(() => window.__labOpen && window.__labOpen.state); await page.waitForTimeout(150);
  }
  const visited = [];
  async function walk(answers, label) {
    /* ตอบทีละขั้นจนถึงผล บันทึกขั้นที่ผ่าน */
    for (let i = 0; i < 12; i++) {
      const v = await view();
      if (v.v === 'result') return true;
      visited.push(v.v + (v.v === 'fixed' ? v.k : ''));
      const f = answers[v.v + (v.v === 'fixed' ? v.k : '')];
      if (!f) { say(false, label + ': no answers for step ' + v.v + v.k); return false; }
      await f(); await next();
    }
    say(false, label + ': did not reach the result'); return false;
  }
  const A = {
    sell: async () => { await fill('#f-inp-price', 60); await fill('#f-inp-unitCost', 22); await chip('inp.feePct', 0); },
    vol: async () => { if (await page.$('#f-inp-daysOpen')) await fill('#f-inp-daysOpen', 30); await fill('#f-inp-volume', 60); },
    open: async () => { await chip('op.fit', 1); await tap('[data-path="op.openMonth"][data-v="5"]'); await chip('op.seasonAsked', 'yes'); await tap('[data-act="ss-tog"][data-c="4"]'); await fill('#f-ss-highPct', 25); },
    ramp: () => tap('[data-act="ramp"][data-v="r3"]'),
    fixed0: async () => { await fill('#f-inp-staffCount', 1); await fill('#f-inp-staffSalary', 13000); await fill('#f-inp-ownerSalary', 15000); },
    fixed1: async () => { await fill('#f-inp-rent', 12000); await chip('inp.marketing', 0); await fill('#f-inp-otherFixed', 6000); },
    su: async () => {
      await chip('op.mode', 'items');
      await tap('[data-act="su-tog"][data-k="tools"]'); await fill('#f-su-0-amt', 60000);
      await tap('[data-act="su-tog"][data-k="pos"]'); await fill('#f-su-1-amt', 5000);
      await tap('[data-act="su-tog"][data-k="deposit"]'); await fill('#f-su-2-amt', 24000);
      await tap('[data-act="su-tog"][data-k="stock"]'); await fill('#f-su-3-amt', 10000);
    },
    save: () => fill('#f-op-savings', 220000)
  };

  try {
    /* ===== 1. ตัวที่ 2 เขียนตัวเลขร้านชุดกลาง ===== */
    await reopen();
    say((await shop()) === null, 'fresh session has no shared shop numbers');
    await tap('[data-act="where"][data-v="shop"]');
    say((await page.evaluate(() => JSON.parse(sessionStorage.getItem('lab-where')))) === 'shop', 'where is shared (lab-where = shop)');
    await tap('[data-act="model"][data-m="unit"]', 150);
    await A.sell(); await next();
    let sh = await shop();
    say(sh && sh.model === 'unit' && sh.inp.preOpen === 1 && sh.inp.price === 60, 'after the first step: shared numbers written with preOpen 1', sh);
    say(sh && sh.inp.cash === undefined, 'no cash before savings and startup money are answered', sh && sh.inp.cash);
    say(sh && sh.ok === false, 'shared numbers marked not complete yet', sh && sh.ok);
    await walk(A, 'own unit');
    sh = await shop(); let s = await st(), T = await totals();
    say(sh.model === 'unit' && sh.label === (await page.evaluate(() => MODELS.unit.tile)), 'model and label', [sh.model, sh.label]);
    say(sh.inp.preOpen === 1, 'preOpen 1');
    say(Math.abs(sh.inp.cash - (220000 - T.all)) < 0.01 && T.all === 99000 + 12000, 'cash = savings − startup total (incl. 1 month rent while fitting): ' + sh.inp.cash, { cash: sh.inp.cash, all: T.all });
    const ey = 65000 / (60000 / 5 + 5000 / 3);
    say(sh.inp.equipValue === 65000 && Math.abs(sh.inp.equipYears - ey) < 1e-9, 'equipValue 65000 and equipYears ' + ey, [sh.inp.equipValue, sh.inp.equipYears]);
    say(sh.inp.advMode === 'yes' && sh.inp.advPick.indexOf('adv-equip') >= 0 && sh.inp.advPick.indexOf('adv-season') >= 0, 'advMode yes with adv-equip and adv-season', [sh.inp.advMode, sh.inp.advPick]);
    say(JSON.stringify(sh.inp.season.high) === '[4]' && sh.inp.season.highPct === 25, 'season shared', sh.inp.season);
    say(sh.ok === true, 'shared numbers complete (ok) for the other tools', sh.ok);
    say(['price', 'unitCost', 'feePct', 'volume', 'daysOpen', 'staffCount', 'staffSalary', 'ownerSalary', 'rent', 'marketing', 'otherFixed'].every(k => sh.inp[k] === s.inp[k]), 'shared inp matches the tool');
    say(sh.inp.savings === undefined && sh.inp.items === undefined && sh.op === undefined, 'tool-2-only numbers (op) not in the shared numbers');
    /* tool 1 คำนวณได้จากชุดกลาง (กำไรเท่ากับที่ตัวที่ 2 แสดง) */
    const p1 = await page.evaluate(sh => { const S = compute(advNormalize(sh.inp, sh.model), sh.model); return [S.ok, S.profit, window.__labOpen.R0().S.profit]; }, sh);
    say(p1[0] && Math.abs(p1[1] - p1[2]) < 0.01, 'tool 1 profit from the shared numbers = tool 2 profit', p1);

    /* แก้เงินที่มี → เงินสดตาม */
    await tap('#foot [data-act="review"]'); await tap('.rv-row[data-v="save"]'); await fill('#f-op-savings', 300000); await tap('#foot [data-act="step-done"]', 150);
    sh = await shop();
    say(Math.abs(sh.inp.cash - (300000 - T.all)) < 0.01, 'savings edited → cash follows', sh.inp.cash);
    /* แก้ทีละส่วน: เดือนขายดีขายแย่ → ไม่มี */
    await tap('.rv-row[data-v="open"]'); await chip('op.seasonAsked', 'no'); await tap('#foot [data-act="step-done"]', 150);
    sh = await shop();
    say(!(sh.inp.season.high || []).length && !(sh.inp.season.low || []).length, 'season "no" clears the shared season');
    say(sh.inp.advPick.indexOf('adv-season') < 0, 'season "no" removes adv-season from advPick', sh.inp.advPick);
    say(sh.ok === true, 'shared numbers still complete after season "no"', { ok: sh.ok, adv: page && await page.evaluate(sh => advMissing(sh.inp, sh.model), sh) });
    /* อุปกรณ์ลบออกหมด → ไม่มีอุปกรณ์ในชุดกลาง */
    await tap('.rv-row[data-v="su"]'); await tap('[data-act="su-del"][data-j="0"]'); await tap('[data-act="su-del"][data-j="0"]'); await tap('#foot [data-act="step-done"]', 150);
    sh = await shop(); T = await totals();
    say(!sh.inp.equipValue && (sh.inp.advPick || []).indexOf('adv-equip') < 0, 'equipment removed → no equipValue / adv-equip in shared numbers', [sh.inp.equipValue, sh.inp.equipYears, sh.inp.advPick]);
    say(Math.abs(sh.inp.cash - (300000 - T.all)) < 0.01, 'cash follows the smaller startup total', [sh.inp.cash, 300000 - T.all]);
    /* ก้อนเดียว → ไม่มีอุปกรณ์ */
    await tap('.rv-row[data-v="su"]'); await tap('[data-act="su-tog"][data-k="tools"]'); await fill('#f-su-2-amt', 40000); await tap('#foot [data-act="step-done"]', 150);
    sh = await shop();
    say(sh.inp.equipValue === 40000 && sh.inp.equipYears === 5, 'tools added back → equipValue 40000 / 5 years', [sh.inp.equipValue, sh.inp.equipYears]);
    await tap('.rv-row[data-v="su"]'); await chip('op.mode', 'lump'); await tap('#foot [data-act="step-done"]', 150);
    sh = await shop(); T = await totals();
    say(!sh.inp.equipValue && (sh.inp.advPick || []).indexOf('adv-equip') < 0, 'lump mode → no equipment in shared numbers', [sh.inp.equipValue, sh.inp.advPick]);
    say(Math.abs(sh.inp.cash - (300000 - T.all)) < 0.01, 'lump mode: cash = savings − lump − rent while fitting', [sh.inp.cash, 300000 - T.all]);
    const dep = await page.evaluate(() => [window.__labOpen.R0().S.dep, (document.querySelector('#tiles .ovt:nth-child(4) .n') || {}).textContent]);
    say(!(dep[0] > 0.5), 'lump mode (no equipment listed): result does not set money aside for equipment', dep);
    await tap('#foot [data-act="result"]', 150);
    const ownShared = JSON.stringify(await shop());

    /* ===== 2. ร้านตัวอย่างไม่เขียน ===== */
    await tap('.bar [data-act="back"]', 200);
    await tap('[data-act="sample"]', 200);
    say((await view()).v === 'result' && (await page.evaluate(() => window.__labOpen.state.isSample)), 'sample opened over an own shop');
    await tap('#foot [data-act="review"]'); await tap('.rv-row[data-v="sell"]'); await fill('#f-inp-price', 99); await tap('#foot [data-act="step-done"]', 150);
    await tap('.rv-row[data-v="fixed"][data-k="1"]'); await fill('#f-inp-rent', 54321); await tap('#foot [data-act="step-done"]', 150);
    await tap('#foot [data-act="result"]', 150);
    await tap('[data-act="tstep"][data-k="volume"]:not([data-d^="-"])', 150); await tap('[data-act="t-use"]', 150);
    say(JSON.stringify(await shop()) === ownShared, 'sample (opened, edited, trial used) never touches the shared numbers');
    await tap('.banner4 [data-act="mine"]', 200);
    s = await st();
    say(s.model === 'unit' && s.inp.rent === 12000 && s.op.mode === 'lump', 'leaving the sample brings back the own shop', [s.model, s.inp.rent, s.op.mode]);
    say(JSON.stringify(await shop()) === ownShared, 'shared numbers unchanged after leaving the sample');
    await reopen();
    await tap('[data-act="sample1"][data-k="online"]', 200);
    await tap('[data-act="sc"][data-v="low"]');
    say((await shop()) === null, 'fresh session: one-tap sample writes no shared numbers', await shop());
    say((await page.evaluate(() => sessionStorage.getItem('lab-where'))) === null, 'fresh session: one-tap sample does not set "ขายที่ไหน" for the other tools');

    /* ===== 3. มีตัวเลขร้านแบบเดียวกัน (จากตัวที่ 1) → ข้ามค่าใช้จ่ายทุกเดือน ===== */
    const t1 = await page.evaluate(() => { const i = JSON.parse(JSON.stringify(MODELS.unit.sample)); i.advMode = 'yes'; i.advPick = ['adv-cap']; return { model: 'unit', inp: i, label: MODELS.unit.tile, ok: true }; });
    await reopen({ put: t1 });
    await tap('[data-act="where"][data-v="both"]');
    await tap('[data-act="model"][data-m="unit"]', 150);
    s = await st();
    say(s.inp.price === t1.inp.price && s.inp.rent === t1.inp.rent && s.inp.volume === t1.inp.volume, 'same model: shared numbers used (price, rent, volume)', [s.inp.price, s.inp.rent, s.inp.volume]);
    say(!s.askFixed, 'same model with fixed costs: fixed steps not asked', s.askFixed);
    const v3 = await view();
    say(v3.v === 'open', 'opens at the first unanswered step (open) — sell and vol already answered', v3);
    say((await page.evaluate(() => document.querySelectorAll('.prog i').length)) === 6, '6 steps (no fixed)');
    visited.length = 0;
    await walk(A, 'same model');
    say(visited.indexOf('fixed0') < 0 && visited.indexOf('fixed1') < 0, 'walked to the result without the fixed steps', visited);
    sh = await shop(); T = await totals();
    say(sh.model === 'unit' && sh.inp.preOpen === 1 && Math.abs(sh.inp.cash - (220000 - T.all)) < 0.01, 'tool 2 takes over: preOpen 1 and cash from savings', [sh.inp.preOpen, sh.inp.cash, 220000 - T.all]);
    say(sh.inp.capacity === t1.inp.capacity && sh.inp.advPick.indexOf('adv-cap') >= 0, 'tool-1 extras kept (capacity, adv-cap)', [sh.inp.capacity, sh.inp.advPick]);
    say(sh.inp.rent === t1.inp.rent && sh.inp.staffSalary === t1.inp.staffSalary, 'fixed costs unchanged');
    say(sh.ok === true, 'still complete for the other tools', sh.ok);
    /* ตัวที่ 1 แก้ค่าเช่าในชุดกลาง → กลับมาตัวที่ 2 ใช้ค่าใหม่ */
    await page.evaluate(() => { const d = JSON.parse(sessionStorage.getItem('lab-shop')); d.inp.rent = 15555; sessionStorage.setItem('lab-shop', JSON.stringify(d)); });
    await page.goto(TEST_URL); await page.waitForTimeout(200);
    s = await st();
    say(s.inp.rent === 15555 && (await view()).v === 'result', 'shared rent edited elsewhere → tool 2 picks it up on reopen, stays on the result', [s.inp.rent, await view()]);

    /* ===== 4. ร้านแบบที่ตัวที่ 2 ยังไม่รองรับ (สมาชิก) → ใช้ร่วมเฉพาะค่าใช้จ่ายคงที่ ===== */
    const sub = await page.evaluate(() => ({ model: 'subscription', inp: Object.assign(JSON.parse(JSON.stringify(MODELS.subscription.sample)), { advMode: 'no' }), label: MODELS.subscription.tile, ok: true }));
    await reopen({ put: sub });
    s = await st();
    say(!s.model, 'unsupported shared model: no model chosen on open', s.model);
    await tap('[data-act="where"][data-v="shop"]');
    const note = await page.evaluate(() => (document.querySelector('.fine4') || {}).textContent || '');
    say(note.indexOf('ซึ่งเครื่องมือนี้ยังไม่รองรับ') >= 0 && note.indexOf(sub.label) >= 0, 'start page says the shared shop type is not supported', note);
    await tap('[data-act="model"][data-m="service"]', 150);
    s = await st();
    say(s.link === 'local' && s.inp.rent === sub.inp.rent && s.inp.ownerSalary === sub.inp.ownerSalary && s.inp.staffCount === sub.inp.staffCount, 'fixed costs reused from the subscription shop', [s.link, s.inp.rent, s.inp.ownerSalary]);
    say(s.inp.price === undefined && s.inp.volume === undefined && s.inp.fee === undefined && s.inp.members === undefined, 'subscription sales numbers not reused', s.inp);
    say(!s.askFixed && (await view()).v === 'sell', 'fixed steps skipped, starts at sell', [s.askFixed, await view()]);
    visited.length = 0;
    await walk(Object.assign({}, A, { sell: async () => { await fill('#f-inp-price', 350); await fill('#f-inp-unitCost', 105); await chip('inp.feePct', 0); } }), 'unsupported');
    say(visited.indexOf('fixed0') < 0, 'no fixed steps in the walk', visited);
    sh = await shop();
    say(sh.model === 'subscription' && JSON.stringify(sh.inp) === JSON.stringify(sub.inp), 'subscription shop numbers left exactly as they were', sh);
    /* แก้ค่าเช่าในตัวที่ 2 → ชุดกลาง (สมาชิก) ได้ค่าเช่าใหม่ ส่วนอื่นเท่าเดิม */
    await tap('#foot [data-act="review"]'); await tap('.rv-row[data-v="fixed"][data-k="1"]'); await fill('#f-inp-rent', 33333); await tap('#foot [data-act="step-done"]', 150);
    sh = await shop();
    const restSame = Object.keys(sub.inp).filter(k => k !== 'rent').every(k => JSON.stringify(sh.inp[k]) === JSON.stringify(sub.inp[k]));
    say(sh.model === 'subscription' && sh.inp.rent === 33333 && restSame && sh.inp.preOpen === undefined && sh.inp.cash === sub.inp.cash, 'rent edited in tool 2 → shared subscription shop gets the new rent only (no preOpen, cash kept)', { model: sh.model, rent: sh.inp.rent, preOpen: sh.inp.preOpen, cash: sh.inp.cash });
    say(sh.ok === true, 'subscription shop still complete', sh.ok);
    /* เปิดใหม่ (ตัวเลขของตัวที่ 2 ยังอยู่ในแท็บ) → ยังเป็นร้านบริการ ค่าเช่าใหม่ */
    await page.goto(TEST_URL); await page.waitForTimeout(200);
    s = await st();
    say(s.model === 'service' && s.inp.rent === 33333 && s.link === 'local', 'reopen: still the service shop, linked to the shared fixed costs', [s.model, s.inp.rent, s.link]);

    /* ===== 5. จุดที่ผู้ตรวจอิสระเจอ ===== */
    /* แค่เปิดดูตัวที่ 2 ไม่ทำให้ตัวเลขของร้านที่เปิดแล้วขึ้นป้าย "ตัวเลขที่ตั้งใจไว้ก่อนเปิดร้าน" */
    await reopen({ put: t1 });
    await tap('[data-act="where"][data-v="shop"]');
    await tap('[data-act="model"][data-m="unit"]', 150);
    sh = await shop();
    say(sh.inp.preOpen === undefined && sh.inp.cash === t1.inp.cash, 'only opening tool 2 (no answers yet) → no preOpen, cash untouched', [sh.inp.preOpen, sh.inp.cash, t1.inp.cash]);
    /* ตอบครบ (ไม่มีเดือนขายดีขายแย่) → ตัวที่ 1 แก้ฤดูกาล อุปกรณ์ เงินสด → เปิดตัวที่ 2 อีกครั้ง ค่าที่แก้ต้องอยู่ */
    await walk(Object.assign({}, A, { open: async () => { await chip('op.fit', 1); await tap('[data-path="op.openMonth"][data-v="5"]'); await chip('op.seasonAsked', 'no'); } }), 'season no');
    sh = await shop();
    say(sh.inp.preOpen === 1, 'answered in tool 2 → preOpen 1', sh.inp.preOpen);
    await page.evaluate(() => { const d = JSON.parse(sessionStorage.getItem('lab-shop')); d.inp.season = { high: [12], low: [6], highPct: 30, lowPct: 20 }; d.inp.equipValue = 120000; d.inp.equipYears = 6; d.inp.cash = 90000; d.inp.advPick = (d.inp.advPick || []).concat(['adv-season']); sessionStorage.setItem('lab-shop', JSON.stringify(d)); });
    await page.goto(TEST_URL); await page.waitForTimeout(250);
    sh = await shop(); s = await st();
    say(sh.inp.equipValue === 120000 && sh.inp.equipYears === 6 && sh.inp.cash === 90000, 'reopen after tool-1 edits: equipment and cash not written back', [sh.inp.equipValue, sh.inp.equipYears, sh.inp.cash]);
    say(sh.inp.season && sh.inp.season.high.join() === '12' && s.op.seasonAsked === 'yes', 'season added in tool 1 kept, answer becomes "มี"', [sh.inp.season, s.op.seasonAsked]);
    /* ตัวที่ 2 เปลี่ยนเงินที่มี → เงินสดเขียนใหม่ */
    await tap('#foot [data-act="review"]'); await tap('.rv-row[data-v="save"]'); await fill('#f-op-savings', 250000); await tap('#foot [data-act="step-done"]', 150);
    sh = await shop(); T = await totals();
    say(Math.abs(sh.inp.cash - (250000 - T.all)) < 0.01 && sh.inp.equipValue === 120000, 'savings changed in tool 2 → cash rewritten; equipment (unchanged in tool 2) kept', [sh.inp.cash, 250000 - T.all, sh.inp.equipValue]);
  } catch (e) { say(false, 'crashed: ' + e.message.split('\n').slice(0, 3).join(' ')); }
  say(!errors.length, 'no console errors', errors.slice(0, 5));
  await browser.close();
  console.log(oks + ' ok · ' + bad + ' bad');
  console.log(bad ? bad + ' PROBLEMS' : 'SHARED OK');
  process.exit(bad ? 1 : 0);
})();
