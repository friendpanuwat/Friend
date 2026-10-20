/* ปุ่มย้อนกลับของมือถือ (page.goBack) ต้องพาไปที่เดียวกับปุ่มย้อนกลับในแอปทุกหน้า และไม่วนกันระหว่างแก้ตัวเลขกับภาพรวม
   รัน: node tests/back.js (ต้อง ./build.sh ก่อน) */
const { open } = require('./harness');
(async () => {
  const { browser, page, errors } = await open({ w: 390, h: 844 });
  let bad = 0;
  const view = () => page.evaluate(() => ({ v: window.__lab.state.view, s: window.__lab.state.step, e: window.__lab.state.editing }));
  async function expect(label, want) {
    await page.waitForTimeout(120);
    const got = await view();
    const ok = Object.keys(want).every(k => got[k] === want[k]);
    if (!ok) bad++;
    console.log((ok ? 'ok  ' : 'BAD ') + label + ' → ' + JSON.stringify(got));
  }
  const phoneBack = () => page.evaluate(() => history.back());
  const tap = async sel => { await page.click(sel); await page.waitForTimeout(80); };

  await page.evaluate(() => { sessionStorage.clear(); window.__lab.go('start'); });
  await tap('[data-act="sample-shop"]'); await expect('sample shop opens overview', { v: 'home' });

  await tap('#foot [data-act="review"]'); await expect('foot: edit numbers', { v: 'review' });
  await phoneBack(); await expect('phone back from edit numbers', { v: 'home' });
  await tap('#foot [data-act="review"]'); await tap('.bar [data-act="back"]'); await expect('app back from edit numbers', { v: 'home' });

  await tap('#foot [data-act="review"]'); await tap('.rv-row[data-i="1"]'); await expect('edit one answer', { v: 'wizard', e: true });
  await phoneBack(); await expect('phone back from one answer', { v: 'review' });
  await phoneBack(); await expect('phone back again', { v: 'home' });

  await tap('.frow'); await expect('open an issue', { v: 'finding' });
  await tap('.way[data-act="try"]'); await expect('try a number from the issue', { v: 'lab' });
  await phoneBack(); await expect('phone back from trial → issue', { v: 'finding' });
  await tap('.bar [data-act="back"]'); await expect('app back from issue', { v: 'home' });

  await tap('.panel [data-act="lab"]'); await expect('trial from overview', { v: 'lab' });
  await tap('.bar [data-act="back"]'); await expect('app back (done) from trial', { v: 'home' });

  await tap('#foot .btn:not(.ghost)'); await expect('foot: things worth checking', { v: 'ask' });
  await phoneBack(); await expect('phone back from questions', { v: 'home' });

  await phoneBack(); await expect('phone back from overview → start page', { v: 'start' });
  await tap('.bar [data-act="theme"]'); /* ยังอยู่หน้าแรก */
  await expect('still on start page', { v: 'start' });

  /* กรอกทีละข้อ: ย้อนทีละข้อ ข้อแรก → หน้าแรก */
  await page.evaluate(() => { const L = window.__lab; document.querySelector('[data-act="model"][data-m="service"]').click(); Object.assign(L.state.inp, window.__sample('service')); L.render(); });
  await expect('choose service', { v: 'wizard', s: 0 });
  await tap('#foot [data-act="next"]'); await tap('#foot [data-act="next"]'); await expect('two steps in', { v: 'wizard', s: 2 });
  await phoneBack(); await expect('phone back one step', { v: 'wizard', s: 1 });
  await tap('.bar [data-act="prev"]'); await expect('app back one step', { v: 'wizard', s: 0 });
  await phoneBack(); await expect('phone back from first step', { v: 'start' });

  /* หน้าแรกกดย้อนกลับ = ออกจากเครื่องมือ */
  const before = page.url();
  await phoneBack(); await page.waitForTimeout(300);
  const left = page.url() !== before;
  if (!left) bad++;
  console.log((left ? 'ok  ' : 'BAD ') + 'phone back on start page leaves the tool → ' + page.url());

  if (errors.length) { bad++; console.log('ERRORS', errors); }
  await browser.close();
  console.log(bad ? bad + ' PROBLEMS' : 'BACK OK');
  process.exit(bad ? 1 : 0);
})();
