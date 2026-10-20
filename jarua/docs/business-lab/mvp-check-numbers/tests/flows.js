/* ไล่ทุกหน้าของทั้ง 8 รูปแบบบนจอมือถือ: กรอกทีละข้อ → ภาพรวม → รายละเอียดเรื่อง → ตอบคำถาม → จุดที่ควรเช็ก → หน้าทดลอง
   ตรวจ: ไม่มี error, ไม่มี NaN/undefined บนจอ, ไม่มีอะไรล้นจอ · รัน: node tests/flows.js (ต้อง ./build.sh ก่อน) */
const fs = require('fs'), path = require('path');
const { open, overflow } = require('./harness');
(async () => {
  fs.mkdirSync(path.join(__dirname, '..', '.out', 'shots'), { recursive: true });
  let bad = 0;
  for (const [w, h, dark] of [[360, 640, false], [390, 844, true]]) {
    const { browser, page, errors } = await open({ w, h, dark });
    for (const m of ['unit', 'service', 'resell', 'subscription', 'project', 'rental', 'commission', 'other']) {
      const res = await page.evaluate(async (m) => {
        const L = window.__lab, st = L.state;
        L.go('start'); document.querySelector(`[data-act="model"][data-m="${m}"]`).click();
        for (let i = 0; i < 12; i++) { st.step = i; L.render(); }
        Object.assign(st.inp, window.__sample(m)); st.answers = {};
        const steps = document.querySelectorAll('.prog i').length;
        L.go('review'); L.go('home');
        const F = [...document.querySelectorAll('.frow')].map(b => b.getAttribute('data-f'));
        for (const f of F) { st.fid = f; L.go('finding'); }
        L.go('lab');
        for (const r of document.querySelectorAll('input[type="range"]')) { r.value = r.max; r.dispatchEvent(new Event('input', { bubbles: true })); r.value = r.min; r.dispatchEvent(new Event('input', { bubbles: true })); }
        st.trial = {}; L.go('home');
        return { steps, F };
      }, m);
      await page.click('#foot .btn:not(.ghost)');
      let n = 0;
      while (await page.$('.ask-ans') && n < 10) { await page.click('.ask-ans button[data-v="yes"]'); await page.waitForTimeout(260); n++; }
      const txt = await page.evaluate(() => document.body.innerText);
      const o = await overflow(page);
      const ok = !/NaN|undefined|Infinity/.test(txt) && !o.bad.length && o.scrollW <= o.W;
      if (!ok) bad++;
      console.log(`${w}${dark ? ' dark' : ''} ${m.padEnd(12)} steps ${res.steps} · findings ${res.F.join(',') || '-'} · answered ${n} · ${ok ? 'ok' : 'PROBLEM ' + JSON.stringify(o.bad)}`);
    }
    if (errors.length) { bad++; console.log('ERRORS', errors); }
    await browser.close();
  }
  console.log(bad ? bad + ' PROBLEMS' : 'ALL FLOWS OK');
})();
