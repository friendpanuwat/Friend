/* ทุกข้อต้องตอบ: กด "ถัดไป" หรือ "เสร็จ" ตอนยังไม่ครบแล้วไม่ไปต่อ และบอก (.need-msg) ที่ช่องนั้นช่องเดียว ([data-need] = ช่องที่ขาด)
   ขายอะไร (ราคา > 0 · ต้นทุนติดลบพิมพ์ไม่ได้ · ค่าธรรมเนียม < 100 · เมนู: ชื่อ ราคา ต้นทุน สัดส่วน รวม 100 · คิดค่าธรรมเนียม: สัดส่วน ≤ 100 อัตรา < 100)
   คาดว่าขายได้ (วันเปิด 1–31 · ยอดขาย > 0) · ช่วงเปิดร้าน (ตกแต่ง 0–24 เดือน · เดือนที่เปิด · มี/ไม่มีเดือนขายดีขายแย่ · เลือกเดือน · % ขายดี · % ขายแย่ < 100)
   ยอดขายเดือนแรก ๆ (เลือกแบบ) · ค่าใช้จ่ายทุกเดือน (เงินเดือนพนักงานเฉพาะเมื่อมีพนักงาน) · เงินก่อนเปิดร้าน (แบบ · อย่างน้อย 1 รายการ · ชื่อรายการอื่น · จำนวนเงิน · ปีของอุปกรณ์ · ยอดรวม)
   เงินที่มี · และเหมือนกันตอนแก้ตัวเลข ("เสร็จ") · ย้อนกลับตอนแก้ไม่ครบ = ตัวเลขเดิม
   รัน: ./build.sh แล้ว NODE_PATH=/opt/node22/lib/node_modules node tests/required.js */
const path = require('path');
const { open } = require('./harness');
const TEST_URL = 'file://' + path.join(__dirname, '..', '.out', 'test.html');
let bad = 0, oks = 0;
const say = (ok, label, extra) => { if (!ok) bad++; else oks++; console.log((ok ? 'ok  ' : 'BAD ') + label + (extra !== undefined ? ' → ' + (typeof extra === 'string' ? extra : JSON.stringify(extra)) : '')); };

(async () => {
  const { browser, page, errors } = await open({ w: 390, h: 844 });
  const tap = async (sel, w) => { await page.click(sel); await page.waitForTimeout(w === undefined ? 100 : w); };
  const fill = async (sel, v) => { await page.fill(sel, String(v)); await page.waitForTimeout(110); };
  const st = () => page.evaluate(() => {
    const s = window.__labOpen.state;
    return { v: s.view, k: s.k, editing: !!s.editing,
      need: [...document.querySelectorAll('.need-msg')].map(m => ({ path: (m.closest('[data-need]') || { getAttribute: () => null }).getAttribute('data-need'), t: m.textContent, marked: !!m.closest('.field.need'), visible: !!m.offsetParent })),
      toast: [...document.querySelectorAll('.toast')].map(t => t.textContent).join(' ') };
  });
  async function blocked(label, want, msg, act) {
    const b = await st();
    await page.evaluate(() => document.querySelectorAll('.toast').forEach(t => t.remove()));
    await tap(`#foot [data-act="${act || 'step-next'}"]`, 160);
    const a = await st();
    const n = a.need[0] || {};
    const ok = a.v === b.v && a.k === b.k && a.need.length === 1 && n.path === want && n.marked && n.visible && (!msg || n.t.indexOf(msg) >= 0);
    say(ok, label + ' — blocks and marks ' + want + (msg ? ' «' + msg + '»' : ''), ok ? n.t : a);
    return ok;
  }
  async function passes(label, v, k, act) {
    await tap(`#foot [data-act="${act || 'step-next'}"]`, 160);
    const a = await st();
    const ok = a.v === v && (k === undefined || a.k === k) && !a.need.length;
    say(ok, label + ' — moves on to ' + v + (k !== undefined ? '/' + k : ''), ok ? undefined : a);
    return ok;
  }
  const get = fn => page.evaluate(fn);
  async function chip(p, v, getter) {
    await tap(`[data-act="pset"][data-path="${p}"][data-v="${v}"]`);
    const r = await page.evaluate(([p, v]) => {
      const b = document.querySelector(`[data-act="pset"][data-path="${p}"][data-v="${v}"]`), inp = document.getElementById('f-' + p.replace(/\./g, '-'));
      return { pressed: b && b.getAttribute('aria-pressed'), shown: inp && inp.value };
    }, [p, v]);
    const val = await page.evaluate(getter);
    say(val === +v && r.pressed === 'true' && (r.shown === null || r.shown === String(v)), 'chip ' + p + ' = ' + v, { stored: val, ...r });
  }
  async function freshTo(where, m) {
    await page.goto(TEST_URL);
    await page.evaluate(() => { try { sessionStorage.clear(); } catch (e) { /* ignore */ } });
    await page.goto(TEST_URL); await page.waitForFunction(() => window.__labOpen && window.__labOpen.state); await page.waitForTimeout(150);
    await tap(`[data-act="where"][data-v="${where}"]`);
    await tap(`[data-act="model"][data-m="${m}"]`, 150);
  }

  try {
    await freshTo('both', 'unit');
    say((await st()).v === 'sell', 'unit/both opens the sell step');

    /* ===== ขายอะไร ราคาเท่าไร ===== */
    await blocked('sell empty', 'inp.price');
    await fill('#f-inp-price', 0); await blocked('price 0', 'inp.price', 'ราคาต้องมากกว่า 0');
    await fill('#f-inp-price', '-60');
    say((await get(() => window.__labOpen.state.inp.price)) === 60, 'typing a minus sign in price stores a positive number');
    await blocked('cost empty', 'inp.unitCost');
    await fill('#f-inp-unitCost', '-22');
    const c = await get(() => window.__labOpen.state.inp.unitCost);
    say(c === 22, 'cost cannot be negative (minus sign ignored)', c);
    await page.focus('#f-inp-price'); await page.waitForTimeout(80);
    say((await get(() => document.querySelector('#f-inp-unitCost').value)) === '22', 'cost box shows 22 after leaving it', await get(() => document.querySelector('#f-inp-unitCost').value));
    await fill('#f-inp-unitCost', 0);
    await blocked('fee empty (cost 0 is an answer)', 'inp.feePct');
    await fill('#f-inp-feePct', 100); await blocked('fee 100', 'inp.feePct', 'ต้องน้อยกว่า 100%');
    await fill('#f-inp-feePct', 150); await blocked('fee 150', 'inp.feePct', 'ต้องน้อยกว่า 100%');
    await chip('inp.feePct', 0, () => window.__labOpen.state.inp.feePct);
    /* เมนู */
    await tap('[data-act="mn-on"]');
    const m0 = await get(() => window.__labOpen.state.op.menu[0]);
    say(m0.price === 60 && m0.cost === 0 && m0.share === 100, 'menu starts with the typed price and cost at 100%', m0);
    await blocked('menu: name empty', 'mn.0.name');
    await fill('#f-mn-0-name', '   '); await blocked('menu: name spaces only', 'mn.0.name');
    await fill('#f-mn-0-name', 'ลาเต้เย็น');
    await fill('#f-mn-0-price', ''); await blocked('menu: price empty', 'mn.0.price');
    await fill('#f-mn-0-price', 0); await blocked('menu: price 0', 'mn.0.price');
    await fill('#f-mn-0-price', 65);
    await fill('#f-mn-0-cost', ''); await blocked('menu: cost empty', 'mn.0.cost');
    await fill('#f-mn-0-cost', 22);
    await fill('#f-mn-0-share', ''); await blocked('menu: share empty', 'mn.0.share');
    await fill('#f-mn-0-share', 0); await blocked('menu: share 0', 'mn.0.share');
    await fill('#f-mn-0-share', 60); await blocked('menu: shares total 60', 'menu-tot', 'ตอนนี้ได้ 60%');
    await tap('[data-act="mn-add"]');
    await blocked('menu: second item empty', 'mn.1.name');
    await fill('#f-mn-1-name', 'ครัวซองต์'); await fill('#f-mn-1-price', 75); await fill('#f-mn-1-cost', 38); await fill('#f-mn-1-share', 50);
    await blocked('menu: shares total 110', 'menu-tot', '110%');
    await fill('#f-mn-1-share', 40);
    const avg = await get(() => [window.__labOpen.state.inp.price, window.__labOpen.state.inp.unitCost]);
    say(avg[0] === 69 && avg[1] === 28.4, 'menu average price 69 and cost 28.4', avg);
    /* คิดค่าธรรมเนียมจากสัดส่วน */
    await tap('[data-act="fh-on"]');
    await blocked('fee helper: share empty', 'fh.share');
    await fill('#f-fh-share', 150); await blocked('fee helper: share 150', 'fh.share', 'ไม่เกิน 100%');
    await fill('#f-fh-share', 40);
    await blocked('fee helper: rate empty', 'fh.rate');
    await fill('#f-fh-rate', 100); await blocked('fee helper: rate 100', 'fh.rate');
    await fill('#f-fh-rate', 32.1);
    say((await get(() => window.__labOpen.state.inp.feePct)) === 12.84, 'fee helper: 40% × 32.1% = 12.84%');
    await passes('sell complete', 'vol');

    /* ===== คาดว่าจะขายได้เท่าไร ===== */
    await blocked('days empty', 'inp.daysOpen');
    await fill('#f-inp-daysOpen', 32); await blocked('days 32', 'inp.daysOpen', 'เดือนหนึ่งมีไม่เกิน 31 วัน');
    await fill('#f-inp-daysOpen', 0); await blocked('days 0', 'inp.daysOpen');
    await fill('#f-inp-daysOpen', 31);
    await blocked('volume empty', 'inp.volume');
    await fill('#f-inp-volume', 0); await blocked('volume 0', 'inp.volume', 'ใส่จำนวนที่คาดว่าจะขายได้เมื่อยอดขายเข้าที่');
    await fill('#f-inp-volume', 60);
    await passes('vol complete', 'open');

    /* ===== ช่วงเปิดร้าน ===== */
    await blocked('fit empty', 'op.fit');
    await fill('#f-op-fit', 25); await blocked('fit 25 months', 'op.fit', 'ไม่เกิน 24 เดือน');
    await chip('op.fit', 1, () => window.__labOpen.state.op.fit);
    await blocked('no opening month', 'op.openMonth');
    await tap('[data-path="op.openMonth"][data-v="3"]');
    await blocked('season not answered', 'op.seasonAsked');
    await tap('[data-act="pset"][data-path="op.seasonAsked"][data-v="yes"]');
    await blocked('season yes, no months', 'season', 'แตะเดือนที่ขายดีหรือขายแย่อย่างน้อย 1 เดือน');
    await tap('[data-act="ss-tog"][data-c="4"]');
    await blocked('high month, % empty', 'ss.highPct');
    await fill('#f-ss-highPct', 0); await blocked('high month, 0%', 'ss.highPct');
    await fill('#f-ss-highPct', 20);
    await tap('[data-act="ss-tog"][data-c="9"]'); await tap('[data-act="ss-tog"][data-c="9"]');
    await blocked('low month, % empty', 'ss.lowPct');
    await fill('#f-ss-lowPct', 100); await blocked('low month, 100%', 'ss.lowPct', 'ต้องน้อยกว่า 100%');
    await fill('#f-ss-lowPct', 30);
    /* ไม่มี → ไม่ถามเดือน · มี อีกครั้ง → เดือนเดิมยังอยู่ */
    await tap('[data-act="pset"][data-path="op.seasonAsked"][data-v="no"]');
    say(!(await page.$('[data-act="ss-tog"]')), 'season "no" hides the months');
    await tap('[data-act="pset"][data-path="op.seasonAsked"][data-v="yes"]');
    const kept = await get(() => window.__labOpen.state.inp.season);
    say(JSON.stringify(kept.high) === '[4]' && JSON.stringify(kept.low) === '[9]' && kept.highPct === 20 && kept.lowPct === 30, 'season "ไม่มี" then "มี" again keeps the months and % already answered', kept);
    if (!(kept.high || []).length) { await tap('[data-act="ss-tog"][data-c="4"]'); await fill('#f-ss-highPct', 20); }
    if (!(kept.low || []).length) { await tap('[data-act="ss-tog"][data-c="9"]'); await tap('[data-act="ss-tog"][data-c="9"]'); await fill('#f-ss-lowPct', 30); }
    await passes('open complete', 'ramp');

    /* ===== ยอดขายเดือนแรก ๆ ===== */
    await blocked('ramp not chosen', 'ramp');
    await tap('[data-act="ramp"][data-v="r6"]');
    await passes('ramp chosen', 'fixed', 0);

    /* ===== ค่าใช้จ่ายทุกเดือน ===== */
    await blocked('people empty', 'inp.staffCount');
    await chip('inp.staffCount', 0, () => window.__labOpen.state.inp.staffCount);
    say(!!(await page.$('[data-need="inp.staffSalary"][hidden]')), 'no staff: salary question hidden');
    await blocked('no staff: owner salary required', 'inp.ownerSalary');
    await fill('#f-inp-staffCount', 2);
    say(!(await page.$('[data-need="inp.staffSalary"][hidden]')), '2 staff: salary question shown');
    await blocked('2 staff: salary required', 'inp.staffSalary');
    await fill('#f-inp-staffSalary', 12000);
    await blocked('owner salary empty', 'inp.ownerSalary');
    await chip('inp.ownerSalary', 0, () => window.__labOpen.state.inp.ownerSalary);
    await passes('people complete', 'fixed', 1);
    await blocked('rent empty', 'inp.rent');
    await chip('inp.rent', 0, () => window.__labOpen.state.inp.rent);
    await blocked('marketing empty', 'inp.marketing');
    await fill('#f-inp-marketing', 2000);
    await blocked('other fixed empty', 'inp.otherFixed');
    await chip('inp.otherFixed', 0, () => window.__labOpen.state.inp.otherFixed);
    await passes('fixed complete', 'su');

    /* ===== เงินก่อนเปิดร้าน ===== */
    await blocked('su mode not chosen', 'op.mode');
    await tap('[data-act="pset"][data-path="op.mode"][data-v="items"]');
    await blocked('items: nothing picked', 'su-pick', 'เลือกอย่างน้อย 1 รายการ');
    await tap('[data-act="su-tog"][data-k="other"]');
    await blocked('other without a name', 'su.0.name');
    await fill('#f-su-0-name', '  '); await blocked('other name spaces only', 'su.0.name');
    await fill('#f-su-0-name', 'ค่าทดลองสูตร');
    await blocked('other: amount empty', 'su.0.amt');
    await fill('#f-su-0-amt', '-5000');
    say((await get(() => window.__labOpen.state.op.items[0].amt)) === 5000, 'startup amount cannot be negative');
    await tap('[data-act="su-tog"][data-k="tools"]');
    await blocked('equipment: price empty', 'su.1.amt');
    await fill('#f-su-1-amt', 60000);
    say((await get(() => window.__labOpen.state.op.items[1].y)) === 5, 'equipment starts with 5 years');
    await fill('#f-su-1-y', ''); await blocked('equipment without years', 'su.1.y');
    await fill('#f-su-1-y', 0); await blocked('equipment 0 years', 'su.1.y');
    await fill('#f-su-1-y', 4);
    await tap('[data-act="pset"][data-path="su.0.t"][data-v="equip"]');
    say((await get(() => window.__labOpen.state.op.items[0].y)) === 5, 'other set to equipment gets 5 years');
    await fill('#f-su-0-y', ''); await blocked('other as equipment without years', 'su.0.y');
    await tap('[data-act="pset"][data-path="su.0.t"][data-v="gone"]');
    await passes('items complete', 'save');
    await tap('#foot [data-act="back"]', 150);
    await tap('[data-act="pset"][data-path="op.mode"][data-v="lump"]');
    say((await get(() => window.__labOpen.state.op.lump)) === 65000, 'lump prefilled with the items total (rent while fitting excluded)', await get(() => window.__labOpen.state.op.lump));
    await fill('#f-op-lump', ''); await blocked('lump empty', 'op.lump');
    await fill('#f-op-lump', 70000);
    await passes('lump complete', 'save');

    /* ===== เงินที่มี ===== */
    await blocked('savings empty', 'op.savings');
    await fill('#f-op-savings', 200000);
    await passes('savings answered', 'result');

    /* ===== แก้ตัวเลข → "เสร็จ" ต้องไม่ผ่านถ้ายังไม่ครบ · ย้อนกลับ = ตัวเลขเดิม ===== */
    await tap('#foot [data-act="review"]');
    const nums = () => page.evaluate(() => JSON.stringify([window.__labOpen.state.inp, window.__labOpen.state.op]));
    const orig = await nums();
    const edits = [
      ['.rv-row[data-v="sell"]', () => fill('#f-fh-rate', 100), 'fh.rate'],
      ['.rv-row[data-v="sell"]', async () => { await tap('[data-act="fh-off"]'); await fill('#f-inp-feePct', 100); }, 'inp.feePct', 'ต้องน้อยกว่า 100%'],
      ['.rv-row[data-v="sell"]', async () => { await tap('[data-act="mn-off"]'); await fill('#f-inp-price', 0); }, 'inp.price', 'ราคาต้องมากกว่า 0'],
      ['.rv-row[data-v="sell"]', () => tap('[data-act="mn-add"]'), 'mn.2.name'],
      ['.rv-row[data-v="vol"]', () => fill('#f-inp-daysOpen', 32), 'inp.daysOpen', 'เดือนหนึ่งมีไม่เกิน 31 วัน'],
      ['.rv-row[data-v="vol"]', () => fill('#f-inp-volume', 0), 'inp.volume', 'ใส่จำนวนที่คาดว่าจะขายได้'],
      ['.rv-row[data-v="open"]', () => fill('#f-op-fit', 25), 'op.fit', 'ไม่เกิน 24 เดือน'],
      ['.rv-row[data-v="open"]', async () => { await tap('[data-act="ss-tog"][data-c="4"]'); await tap('[data-act="ss-tog"][data-c="4"]'); await tap('[data-act="ss-tog"][data-c="9"]'); }, 'season', 'อย่างน้อย 1 เดือน'],
      ['.rv-row[data-v="open"]', () => fill('#f-ss-lowPct', ''), 'ss.lowPct'],
      ['.rv-row[data-v="fixed"][data-k="0"]', () => fill('#f-inp-ownerSalary', ''), 'inp.ownerSalary'],
      ['.rv-row[data-v="fixed"][data-k="0"]', () => fill('#f-inp-staffSalary', ''), 'inp.staffSalary'],
      ['.rv-row[data-v="fixed"][data-k="1"]', () => fill('#f-inp-rent', ''), 'inp.rent'],
      ['.rv-row[data-v="su"]', () => fill('#f-op-lump', ''), 'op.lump'],
      ['.rv-row[data-v="su"]', async () => { await tap('[data-act="pset"][data-path="op.mode"][data-v="items"]'); await fill('#f-su-0-name', ''); }, 'su.0.name'],
      ['.rv-row[data-v="su"]', async () => { await tap('[data-act="pset"][data-path="op.mode"][data-v="items"]'); await fill('#f-su-1-y', ''); }, 'su.1.y'],
      ['.rv-row[data-v="su"]', async () => { await tap('[data-act="pset"][data-path="op.mode"][data-v="items"]'); await tap('[data-act="su-del"][data-j="0"]'); await tap('[data-act="su-del"][data-j="0"]'); }, 'su-pick', 'เลือกอย่างน้อย 1 รายการ'],
      ['.rv-row[data-v="save"]', () => fill('#f-op-savings', ''), 'op.savings']
    ];
    for (const [row, act, want, msg] of edits) {
      await tap(row);
      await act();
      await blocked('editing: ' + want + ' → เสร็จ', want, msg, 'step-done');
      await tap('.bar [data-act="back"]', 200);
      const a = await st();
      say(a.v === 'review' && !a.editing, '  back cancels the edit (' + want + ')', a.v === 'review' ? undefined : a);
      const now = await nums();
      say(now === orig, '  numbers restored (' + want + ')', now === orig ? undefined : now.slice(0, 160));
      if (a.v !== 'review' || now !== orig) {
        await page.evaluate(o => { const L = window.__labOpen, d = JSON.parse(o); L.state.inp = d[0]; L.state.op = d[1]; L.state.editing = false; L.state.edOrig = null; L.state.askFixed = false; L.go('review'); }, orig);
        await page.waitForTimeout(150);
      }
    }

    /* ===== ซื้อมาขายไป ออนไลน์ ต่อเดือน: ไม่ถามวันเปิด ===== */
    await freshTo('online', 'resell');
    await fill('#f-inp-price', 290); await fill('#f-inp-unitCost', 130); await fill('#f-inp-feePct', 99.9);
    await passes('fee 99.9 accepted', 'vol');
    say(!(await page.$('#f-inp-daysOpen')), 'per month: no days-open question');
    await blocked('per month: volume first', 'inp.volume');
    /* ต่อวัน → ถามวันเปิด (ใส่ 30 ให้ถ้ามียอดขายแล้ว) */
    await fill('#f-inp-volume', 300);
    await tap('[data-act="per"][data-v="day"]');
    const pd = await get(() => [window.__labOpen.state.inp.volume, window.__labOpen.state.inp.daysOpen]);
    say(pd[0] === 10 && pd[1] === 30, 'switch to per day: 300/month → 10/day, days open 30', pd);
    await fill('#f-inp-daysOpen', 45); await blocked('days 45 after switching', 'inp.daysOpen', 'ไม่เกิน 31');
    await fill('#f-inp-daysOpen', 26);
    await passes('vol per day', 'open');
    say((await get(() => document.querySelector('label[for="f-op-fit"]').textContent)).indexOf('เตรียมร้าน') === 0, 'online asks "เตรียมร้าน" (no rent while fitting)');
  } catch (e) { say(false, 'crashed: ' + e.message.split('\n').slice(0, 3).join(' ')); }
  say(!errors.length, 'no console errors', errors.slice(0, 5));
  await browser.close();
  console.log(oks + ' ok · ' + bad + ' bad');
  console.log(bad ? bad + ' PROBLEMS' : 'REQUIRED OK');
  process.exit(bad ? 1 : 0);
})();
