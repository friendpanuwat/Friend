/* ลองปรับในหน้ารายละเอียดสินค้า: ปรับได้ทุกตัวเลขของแถว "เงินไปไหน" (ของสินค้า + ของช่องทางที่เลือก)
   · ค่าที่ลองไว้ไม่หายเมื่อเปลี่ยนช่องทาง · ชิ้นต่อออร์เดอร์ขึ้น/หายตามค่าแพ็ก · "ใช้ค่านี้" ใช้ทุกค่าที่ลอง · "คืนค่าเดิม" ล้างทั้งหมด
   รัน: ./build.sh แล้ว node tests/trial.js */
const { open } = require('./harness');
let bad = 0;
const say = (ok, msg, x) => { if (!ok) bad++; console.log((ok ? 'ok  ' : 'BAD ') + msg + (ok || x === undefined ? '' : ' → ' + JSON.stringify(x))); };
(async () => {
  const { browser, page, errors } = await open({ w: 360, h: 640 });
  const S = () => page.evaluate(() => ({ trial: window.__lab4.state.trial, profit: window.__lab4.R0().profit, trialProfit: null,
    dl: (document.querySelector('#dl4') || {}).textContent || '', ids: [...document.querySelectorAll('[data-tv]')].map(x => x.id), dch: window.__lab4.state.dch }));
  const tap = async (sel, ms) => { await page.click(sel); await page.waitForTimeout(ms || 150); };
  await tap('[data-act="sample1"][data-k="online"]', 300);
  await tap('.rk4[data-i="3"]', 300);
  let a = await S();
  say(JSON.stringify(a.ids) === JSON.stringify(['tv-price', 'tv-cost', 'tv-markup', 'tv-disc', 'tv-fee', 'tv-perOrder', 'tv-ipo']), 'product page adjusts price, cost and every number of the channel', a.ids);
  say(await page.$('.try4 .tgn4') !== null, 'says the channel numbers count for every product on that channel');
  const p0 = a.profit;
  await tap('.stp[data-k="fee"]:not([data-d^="-"])');
  await tap('.stp[data-k="price"]:not([data-d^="-"])');
  a = await S();
  say(a.trial && a.trial.p[3].price === 795 && a.trial.c[0].fee === 19, 'product and channel trials kept together', a.trial);
  say(/ลดลง/.test(a.dl) && a.profit === p0, 'shop profit change shown, real numbers untouched', a);
  await tap('.chsel [data-act="dch"][data-v="2"]', 300);
  a = await S();
  say(a.trial && a.trial.c[0].fee === 19 && /รวมค่าที่ลองไว้ใน Shopee/.test(a.dl), 'switching channel keeps the trial and says so', a.dl);
  await page.fill('#tv-perOrder', '0'); await page.waitForTimeout(400);
  a = await S();
  say(a.ids.indexOf('tv-ipo') < 0 && a.trial.c[2].perOrder === 0, 'pack cost 0 hides items per order', a.ids);
  await page.fill('#tv-perOrder', '12'); await page.waitForTimeout(400);
  a = await S();
  say(a.ids.indexOf('tv-ipo') >= 0 && (await page.evaluate(() => document.activeElement && document.activeElement.id)) === 'tv-perOrder', 'pack cost > 0 shows items per order again, typing box keeps focus', a.ids);
  await tap('.stp[data-k="ipo"]:not([data-d^="-"])');
  a = await S();
  say(Math.abs(a.trial.c[2].ipo - 1.5) < 1e-9, 'items per order steps by 0.1', a.trial.c[2]);
  await tap('[data-act="t-reset"]');
  a = await S();
  say(a.trial === null && /เท่าเดิม/.test(a.dl), 'reset clears every tried value', a);
  await tap('.stp[data-k="disc"]:not([data-d^="-"])');
  await tap('.chsel [data-act="dch"][data-v="0"]', 300);
  await tap('.stp[data-k="markup"]:not([data-d^="-"])');
  await tap('[data-act="t-use"]', 300);
  const u = await page.evaluate(() => { const s = window.__lab4.state, c = s.pc.channels; return { trial: s.trial, d2: c[2].disc, m0: [c[0].priceMode, c[0].markup], profit: window.__lab4.R0().profit }; });
  say(u.trial === null && u.d2 === 1 && u.m0[0] === 'up' && u.m0[1] === 5, 'use applies the tried values on both channels', u);
  /* หน้าช่องทาง: ลองปรับยังใช้ได้ (มีค่าใช้จ่ายรายเดือนด้วย) */
  await tap('.bar [data-act="back"]', 300); await tap('.tabs4 [data-act="tab"][data-v="c"]'); await tap('.chc[data-j="1"]', 300);
  a = await S();
  say(a.ids.indexOf('tv-monthly') >= 0 && a.ids.indexOf('tv-price') < 0, 'channel page adjusts the channel numbers and its monthly cost', a.ids);
  say(!errors.length, 'no console errors', errors);
  await browser.close();
  console.log(bad ? bad + ' PROBLEMS' : 'TRIAL OK');
  process.exit(bad ? 1 : 0);
})();
