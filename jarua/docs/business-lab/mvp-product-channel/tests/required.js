/* ทุกช่องต้องตอบ: กด "ถัดไป" หรือ "เสร็จ" ตอนยังไม่ครบแล้วไม่ไปต่อ และบอก (.need-msg) ที่ช่องนั้นช่องเดียว
   สินค้า (ชื่อ ราคา > 0 ต้นทุน จำนวน) · วันที่เปิด (≤ 31) · สินค้าอื่น ๆ (ตอบ มี/ไม่มี · ยอดขาย · ต้นทุน < 100%)
   ช่องทาง (เลือกอย่างน้อย 1 · ชื่อช่องทางอื่น) · สัดส่วน (รวม 100) · ทีละช่องทาง (ราคา % ค่าธรรมเนียม < 100 VAT ส่วนลด ค่าแพ็ก ชิ้นต่อออร์เดอร์ ≥ 1 รายเดือน · เปิดสินค้าอย่างน้อย 1)
   สินค้าที่ไม่มีช่องทางให้ขายเลย · ค่าใช้จ่ายคงที่ (เงินเดือนพนักงานเฉพาะเมื่อมีพนักงาน) · ปุ่ม "ไม่มี" ใส่ 0 และนับว่าตอบแล้ว
   รัน: ./build.sh แล้ว node tests/required.js */
const path = require('path');
const { open, shot } = require('./harness');
const TEST_URL = 'file://' + path.join(__dirname, '..', '.out', 'test.html');
let bad = 0;
const say = (ok, label, extra) => { if (!ok) bad++; console.log((ok ? 'ok  ' : 'BAD ') + label + (extra !== undefined ? ' → ' + (typeof extra === 'string' ? extra : JSON.stringify(extra)) : '')); };

(async () => {
  const { browser, page, errors } = await open({ w: 390, h: 844 });
  const tap = async (sel, w) => { await page.click(sel); await page.waitForTimeout(w === undefined ? 110 : w); };
  const fill = async (sel, v) => { await page.fill(sel, String(v)); await page.waitForTimeout(120); };
  const st = () => page.evaluate(() => {
    const s = window.__lab4.state;
    return { v: s.view, k: s.k, editing: !!s.editing,
      need: [...document.querySelectorAll('.need-msg')].map(m => ({ path: (m.closest('[data-need]') || { getAttribute: () => null }).getAttribute('data-need'), t: m.textContent, marked: !!m.closest('.field.need'), visible: !!m.offsetParent })),
      toast: [...document.querySelectorAll('.toast')].map(t => t.textContent).join(' ') };
  });
  /* กดปุ่มแล้วต้องอยู่ที่เดิม และบอกที่ช่อง want (msg = ข้อความที่ต้องมี) */
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
    const ok = a.v === v && (k === undefined || a.k === k);
    say(ok, label + ' — moves on to ' + v + (k !== undefined ? '/' + k : ''), ok ? undefined : a);
    return ok;
  }
  /* ปุ่ม "ไม่มี": ใส่ 0 (หรือค่าบนปุ่ม) กดค้าง และช่องแสดง 0 */
  async function chip(path, v, getter) {
    await tap(`[data-act="pset"][data-path="${path}"][data-v="${v}"]`);
    const r = await page.evaluate(([path, v]) => {
      const b = document.querySelector(`[data-act="pset"][data-path="${path}"][data-v="${v}"]`), inp = document.getElementById('f-' + path.replace(/\./g, '-'));
      return { pressed: b && b.getAttribute('aria-pressed'), shown: inp && inp.value };
    }, [path, v]);
    const val = await page.evaluate(getter);
    say(val === +v && r.pressed === 'true' && r.shown === String(v), 'chip ' + path + ' = ' + v, { stored: val, ...r });
  }

  await page.evaluate(() => { try { sessionStorage.clear(); } catch (e) { /* ignore */ } });
  await page.goto(TEST_URL); await page.waitForFunction(() => window.__lab4 && window.__lab4.state); await page.waitForTimeout(150);
  await tap('[data-act="where"][data-v="both"]');
  await tap('[data-act="model"][data-m="unit"]');
  say((await st()).v === 'items', 'unit/both opens the items step');

  /* ===== สินค้า ===== */
  await blocked('items empty', 'inp.daysOpen');
  await fill('#f-inp-daysOpen', 40); await blocked('daysOpen 40', 'inp.daysOpen', 'ไม่เกิน 31');
  await fill('#f-inp-daysOpen', 0); await blocked('daysOpen 0', 'inp.daysOpen');
  await fill('#f-inp-daysOpen', 31);
  await blocked('item name empty', 'i.0.name');
  await fill('#f-i-0-name', '   '); await blocked('item name spaces only', 'i.0.name');
  await fill('#f-i-0-name', 'ลาเต้เย็น');
  await blocked('item price empty', 'i.0.price');
  await fill('#f-i-0-price', 0); await blocked('item price 0', 'i.0.price', 'ราคาต้องมากกว่า 0');
  await fill('#f-i-0-price', 65);
  await blocked('item cost empty', 'i.0.cost');
  await fill('#f-i-0-cost', 0);
  await blocked('item qty empty (cost 0 is an answer)', 'i.0.qty');
  await fill('#f-i-0-qty', 0); await blocked('item qty 0', 'i.0.qty', 'ใส่จำนวนที่ขายได้');
  await fill('#f-i-0-qty', 40); await fill('#f-i-0-cost', 22);
  await blocked('other products not answered', 'r.on');
  await tap('[data-act="item-add"]');
  await blocked('second item empty', 'i.1.name');
  await fill('#f-i-1-name', 'ครัวซองต์'); await fill('#f-i-1-price', 75);
  await tap('[data-act="part-open"][data-i="1"]');
  await blocked('cost split into parts, nothing entered', 'i.1.cost');
  await page.fill('[data-path="pt.1.0.v"]', '30'); await page.fill('[data-path="pt.1.1.v"]', '10'); await page.waitForTimeout(150);
  const pc = await page.evaluate(() => [window.__lab4.state.pc.items[1].cost, document.querySelector('#f-i-1-cost').value]);
  say(pc[0] === 40 && pc[1] === '40', 'parts add up into the cost', pc);
  await fill('#f-i-1-qty', 6);
  await blocked('other products still not answered', 'r.on');
  await tap('[data-act="pset"][data-path="r.on"][data-v="true"]');
  await blocked('other products: sales empty', 'r.sales');
  await fill('#f-r-sales', 0); await blocked('other products: sales 0', 'r.sales');
  await fill('#f-r-sales', 800);
  await blocked('other products: cost % empty', 'r.costPct');
  await fill('#f-r-costPct', 100); await blocked('other products: cost 100%', 'r.costPct', 'ต้องน้อยกว่า 100%');
  await fill('#f-r-costPct', 150); await blocked('other products: cost 150%', 'r.costPct', 'ต้องน้อยกว่า 100%');
  await fill('#f-r-costPct', 35);
  await passes('items complete', 'chpick', 0);

  /* ===== ช่องทาง ===== */
  await blocked('no channel chosen', 'chpick', 'เลือกอย่างน้อย 1 ช่องทาง');
  await tap('[data-act="ch-toggle"][data-k="shop"]'); await tap('[data-act="ch-toggle"][data-k="grab"]'); await tap('[data-act="ch-other"]');
  await blocked('other channel without a name', 'c.2.name');
  await fill('#f-c-2-name', '  '); await blocked('other channel name spaces only', 'c.2.name');
  await fill('#f-c-2-name', 'ขายให้บริษัท');
  await passes('channels chosen', 'share', 0);

  /* ===== สัดส่วน ===== */
  await blocked('shares empty', 'c.0.share');
  await fill('#f-c-0-share', 0); await blocked('share 0', 'c.0.share', 'ลบออก');
  await fill('#f-c-0-share', 50); await fill('#f-c-1-share', 30);
  await blocked('one share still empty', 'c.2.share');
  await fill('#f-c-2-share', 10); await blocked('shares total 90', 'share-tot', '90%');
  const tot = await page.evaluate(() => (document.querySelector('#tot4w .tot4') || {}).textContent);
  say(/ขาดอีก 10/.test(tot || ''), 'running total says 10% missing', tot);
  await fill('#f-c-2-share', 30); await blocked('shares total 110', 'share-tot', '110%');
  await fill('#f-c-2-share', '');
  const fb = await page.$('[data-act="share-fill"]');
  say(!!fb, 'one empty share: "fill the rest" button');
  if (fb) { await tap('[data-act="share-fill"]'); say((await page.evaluate(() => window.__lab4.state.pc.channels[2].share)) === 20, 'fill the rest puts 20%'); }
  else await fill('#f-c-2-share', 20);
  await passes('shares 100', 'ch', 0);

  /* ===== หน้าร้าน (ไม่มีคำถามราคา) ===== */
  say(!(await page.$('[data-path="c.0.priceMode"]')), 'shop channel has no price question');
  await blocked('shop: fee empty', 'c.0.fee');
  await fill('#f-c-0-fee', 100); await blocked('shop: fee 100', 'c.0.fee', 'ต้องน้อยกว่า 100%');
  await fill('#f-c-0-fee', 1.6);
  say(!!(await page.$('[data-need="c.0.vat"]')), 'fee > 0 asks about VAT');
  await blocked('shop: VAT not answered', 'c.0.vat');
  await tap('[data-act="pset"][data-path="c.0.vat"][data-v="in"]');
  await blocked('shop: discount empty', 'c.0.disc');
  await fill('#f-c-0-disc', 100); await blocked('shop: discount 100', 'c.0.disc', 'ต้องน้อยกว่า 100%');
  await chip('c.0.disc', 0, () => window.__lab4.state.pc.channels[0].disc);
  await blocked('shop: pack cost empty', 'c.0.perOrder');
  await fill('#f-c-0-perOrder', 3);
  say(!!(await page.$('[data-need="c.0.ipo"]')), 'pack cost > 0 asks items per order');
  await blocked('shop: items per order empty', 'c.0.ipo');
  await fill('#f-c-0-ipo', 0.5); await blocked('shop: items per order 0.5', 'c.0.ipo', 'อย่างน้อย 1');
  await tap('[data-act="pset"][data-path="c.0.ipo"][data-v="1"]');
  say((await page.evaluate(() => window.__lab4.state.pc.channels[0].ipo)) === 1, 'chip "1 แก้ว" sets 1 item per order');
  await blocked('shop: monthly empty', 'c.0.monthly');
  await chip('c.0.monthly', 0, () => window.__lab4.state.pc.channels[0].monthly);
  /* ปิดสินค้าทุกตัวบนช่องทางนี้ */
  const ids = await page.evaluate(() => window.__lab4.state.pc.items.map(p => p.id));
  for (const id of ids) await tap(`[data-act="ch-off"][data-j="0"][data-id="${id}"]`);
  await blocked('shop: every product switched off', 'c.0.off', 'เปิดอย่างน้อย 1 สินค้า');
  await tap(`[data-act="ch-off"][data-j="0"][data-id="${ids[0]}"]`); /* ครัวซองต์ยังปิดอยู่ */
  /* ปุ่ม "ไม่มี" ของค่าธรรมเนียม: 0 แล้วไม่ถาม VAT */
  await chip('c.0.fee', 0, () => window.__lab4.state.pc.channels[0].fee);
  say(!(await page.$('[data-need="c.0.vat"]')), 'fee "ไม่มี" removes the VAT question');
  await chip('c.0.perOrder', 0, () => window.__lab4.state.pc.channels[0].perOrder);
  say(!(await page.$('[data-need="c.0.ipo"]')), 'pack cost "ไม่มี" removes items per order');
  await passes('shop channel complete', 'ch', 1);

  /* ===== GrabFood ===== */
  await blocked('app: price compared not answered', 'c.1.priceMode');
  await tap('[data-act="pset"][data-path="c.1.priceMode"][data-v="up"]');
  await blocked('app: markup up empty', 'c.1.markup');
  await fill('#f-c-1-markup', 0); await blocked('app: markup up 0', 'c.1.markup');
  await tap('[data-act="pset"][data-path="c.1.priceMode"][data-v="down"]');
  await fill('#f-c-1-markup', 100); await blocked('app: markup down 100', 'c.1.markup', 'ต้องน้อยกว่า 100%');
  await fill('#f-c-1-markup', 10);
  await tap('[data-act="pset"][data-path="c.1.priceMode"][data-v="same"]');
  say((await page.evaluate(() => window.__lab4.state.pc.channels[1].markup)) === null && !(await page.$('#f-c-1-markup')), 'price "same" clears and hides the markup');
  await blocked('app: fee empty', 'c.1.fee');
  await fill('#f-c-1-fee', 120); await blocked('app: fee 120', 'c.1.fee', 'ต้องน้อยกว่า 100%');
  await fill('#f-c-1-fee', 30);
  await blocked('app: VAT not answered', 'c.1.vat');
  await tap('[data-act="pset"][data-path="c.1.vat"][data-v="ex"]');
  await chip('c.1.disc', 0, () => window.__lab4.state.pc.channels[1].disc);
  await fill('#f-c-1-perOrder', 6);
  await blocked('app: items per order empty', 'c.1.ipo');
  await fill('#f-c-1-ipo', 1.5);
  await blocked('app: monthly empty', 'c.1.monthly');
  await fill('#f-c-1-monthly', 500);
  await tap(`[data-act="ch-off"][data-j="1"][data-id="${ids[1]}"]`); /* ครัวซองต์ปิดบนช่องทางนี้ด้วย */
  await passes('app channel complete', 'ch', 2);

  /* ===== ช่องทางอื่น (ช่องทางสุดท้าย) · ครัวซองต์ไม่มีช่องทางให้ขาย ===== */
  await tap('[data-act="pset"][data-path="c.2.priceMode"][data-v="same"]');
  await chip('c.2.fee', 0, () => window.__lab4.state.pc.channels[2].fee);
  await chip('c.2.disc', 0, () => window.__lab4.state.pc.channels[2].disc);
  await chip('c.2.perOrder', 0, () => window.__lab4.state.pc.channels[2].perOrder);
  await chip('c.2.monthly', 0, () => window.__lab4.state.pc.channels[2].monthly);
  await tap(`[data-act="ch-off"][data-j="2"][data-id="${ids[1]}"]`);
  {
    await page.evaluate(() => document.querySelectorAll('.toast').forEach(t => t.remove()));
    await tap('#foot [data-act="step-next"]', 160);
    const a = await st();
    say(a.v === 'ch' && a.k === 2, 'product switched off on every channel: blocks on the last channel', a);
    say(a.need.length === 1 && /ครัวซองต์/.test(a.need[0].t), '  says which product has no channel', a.need);
    say(a.need.length === 1 && a.need[0].path === 'c.2.off' && a.need[0].visible, '  marks the product on/off chips with .need-msg', a.need);
  }
  await tap(`[data-act="ch-off"][data-j="2"][data-id="${ids[1]}"]`);
  await passes('every product has a channel', 'fixed', 0);

  /* ===== ค่าใช้จ่ายคงที่ ===== */
  await blocked('people empty', 'inp.staffCount');
  await chip('inp.staffCount', 0, () => window.__lab4.state.inp.staffCount);
  say(!!(await page.$('[data-need="inp.staffSalary"][hidden]')), 'no staff: salary question hidden');
  await blocked('no staff: salary not required, owner salary is', 'inp.ownerSalary');
  await fill('#f-inp-staffCount', 2); await page.waitForTimeout(100);
  say(!(await page.$('[data-need="inp.staffSalary"][hidden]')), '2 staff: salary question shown');
  await blocked('2 staff: salary required', 'inp.staffSalary');
  await fill('#f-inp-staffSalary', 12000);
  await blocked('owner salary empty', 'inp.ownerSalary');
  await chip('inp.ownerSalary', 0, () => window.__lab4.state.inp.ownerSalary);
  await passes('people complete', 'fixed', 1);
  const mk = await page.evaluate(() => [window.__lab4.state.inp.marketing, document.querySelector('#f-inp-marketing').value]);
  say(mk[1] === '', 'marketing is empty until answered (not pre-filled)', { stored: mk[0], shown: mk[1] });
  await blocked('fixed costs empty', 'inp.rent');
  await chip('inp.rent', 0, () => window.__lab4.state.inp.rent);
  await blocked('marketing not answered', 'inp.marketing');
  await fill('#f-inp-marketing', 2000);
  await blocked('other fixed costs empty', 'inp.otherFixed');
  await chip('inp.otherFixed', 0, () => window.__lab4.state.inp.otherFixed);
  await passes('fixed costs complete', 'fixed', 2);
  await blocked('cash empty', 'inp.cash');
  await chip('inp.cash', 0, () => window.__lab4.state.inp.cash);
  await passes('cash answered', 'result');

  /* ===== แก้ตัวเลข → "เสร็จ" ต้องไม่ผ่านถ้ายังไม่ครบ ===== */
  await tap('#foot [data-act="review"]');
  const edits = [
    ['.rv-row[data-v="items"]', '#f-i-0-qty', '', 'i.0.qty'],
    ['.rv-row[data-v="items"]', '#f-i-0-price', 0, 'i.0.price', 'ราคาต้องมากกว่า 0'],
    ['.rv-row[data-v="items"]', '#f-inp-daysOpen', 32, 'inp.daysOpen', 'ไม่เกิน 31'],
    ['.rv-row[data-v="chpick"]', '#f-c-2-name', '', 'c.2.name'],
    ['.rv-row[data-v="share"]', '#f-c-1-share', 45, 'share-tot', '115%'],
    ['.rv-row[data-v="ch"][data-k="1"]', '#f-c-1-fee', '', 'c.1.fee'],
    ['.rv-row[data-v="ch"][data-k="1"]', '#f-c-1-ipo', 0, 'c.1.ipo', 'อย่างน้อย 1'],
    ['.rv-row[data-v="fixed"][data-k="0"]', '#f-inp-staffSalary', '', 'inp.staffSalary'],
    ['.rv-row[data-v="fixed"][data-k="1"]', '#f-inp-rent', '', 'inp.rent'],
    ['.rv-row[data-v="fixed"][data-k="2"]', '#f-inp-cash', '', 'inp.cash']
  ];
  for (const [row, field, v, want, msg] of edits) {
    await tap(row);
    await fill(field, v);
    await blocked('editing: ' + want + ' = "' + v + '" → เสร็จ', want, msg, 'step-done');
    await tap('.bar [data-act="back"]', 200);
    say((await st()).v === 'review', '  back cancels the edit');
  }
  /* เพิ่มช่องทางระหว่างแก้: "เสร็จ" พาไปตอบช่องทางใหม่ */
  await tap('.rv-row[data-v="chpick"]'); await tap('[data-act="ch-toggle"][data-k="lineman"]');
  await tap('#foot [data-act="step-done"]', 200);
  let a = await st();
  say(a.v === 'share' || (a.v === 'ch' && a.k === 3), 'added channel while editing: เสร็จ goes to its first unanswered question', a);
  say(a.need.length === 1 && /ยังมีข้อที่ต้องตอบ/.test(a.toast), '  marks it and says there are questions left', a);
  await tap('.bar [data-act="back"]', 200);
  a = await st(); say(a.v === 'review', 'back from the half-added channel → review', a);
  await shot(page, 'qa-required-review');

  /* ===== ร้านซื้อมาขายไป ขายออนไลน์ ต่อเดือน: ไม่ถามวันเปิด · ช่องทางแรกถามราคา ===== */
  await page.evaluate(() => { try { sessionStorage.clear(); } catch (e) { /* ignore */ } });
  await page.goto(TEST_URL); await page.waitForFunction(() => window.__lab4 && window.__lab4.state); await page.waitForTimeout(150);
  await tap('[data-act="where"][data-v="online"]'); await tap('[data-act="model"][data-m="resell"]');
  say(!(await page.$('#f-inp-daysOpen')), 'per month: no days-open question');
  await blocked('resell: item name first', 'i.0.name');
  await fill('#f-i-0-name', 'เสื้อยืด'); await fill('#f-i-0-price', 199); await fill('#f-i-0-cost', 110); await fill('#f-i-0-qty', 240);
  await tap('[data-act="pset"][data-path="r.on"][data-v="false"]');
  await passes('resell items', 'chpick', 0);
  await tap('[data-act="ch-toggle"][data-k="shopee"]');
  await passes('one channel → no share step', 'ch', 0);
  await blocked('shopee: price compared first', 'c.0.priceMode');
  say(!(await page.$('[data-act="ch-off"]')), 'one channel: no product on/off chips');

  say(!errors.length, 'no console errors', errors.slice(0, 5));
  await browser.close();
  console.log(bad ? bad + ' PROBLEMS' : 'REQUIRED OK');
  process.exit(bad ? 1 : 0);
})().catch(e => { console.log('BAD crashed: ' + e.message.split('\n').slice(0, 3).join(' ')); console.log('1 PROBLEMS'); process.exit(1); });
