/* ไล่ทุกหน้า ทุกรูปแบบร้าน × ทุกเรื่อง บนจอมือถือ ทั้งโหมดสว่าง (360) และมืด (390)
   ผล → ลากแถบจุดคุ้ม → ปรับตัวเลข (เลื่อนทุกแถบสุดซ้ายขวา) → เช็กความพร้อม → จุดที่ควรเช็ก · และกรอกจริงด้วยการแตะ 3 เส้นทาง
   ตรวจ: ไม่มี error, ไม่มี NaN/undefined/Infinity บนจอ, ไม่มีอะไรล้นจอ, ปุ่มสูงอย่างน้อย 44px · รัน: node tests/flows.js (ต้อง ./build.sh ก่อน) */
const fs = require('fs'), path = require('path');
const { open, overflow, shot } = require('./harness');
const { load, genDec, sampleInp } = require('./cases');
const ctx = load(), vm = require('vm');
const R = (c) => vm.runInContext(c, ctx);
const models = R('MODEL_ORDER'), topics = R('TOPIC_ORDER');
async function check(page, label) {
  const txt = await page.evaluate(() => document.body.innerText);
  const o = await overflow(page);
  const small = await page.evaluate(() => [...document.querySelectorAll('button, input:not([type=range])')].filter(b => {
    const r = b.getBoundingClientRect(); if (!r.width || b.closest('[hidden]')) return false;
    return r.height < 43.5 && !b.classList.contains('lnk-in');
  }).map(b => b.className + ':' + (b.textContent || b.getAttribute('aria-label') || '').trim().slice(0, 20) + ':' + Math.round(b.getBoundingClientRect().height)));
  const probs = [];
  /* หน้าผล: ป้ายผลบนแถบลากต้องตรงกับ ✓ ✕ ของเงื่อนไข · แถว "อย่างน้อย" ที่ได้ ✓ ต้องไม่มีคำว่า "น้อยกว่า" */
  const agree = await page.evaluate(() => {
    const pill = document.querySelector('.pr-r'); if (!pill) return [];
    const rows = [...document.querySelectorAll('.cklist li[data-id="need"], .cklist li[data-id="payneed"]')].filter(li => li.querySelector('.ck-t b'));
    const out = [];
    const extraShort = [...document.querySelectorAll('.cklist li[data-id="pay"] .ck, .cklist li[data-id="cap"] .ck, .cklist li[data-id="room"] .ck, .cklist li[data-id="total"] .ck, .cklist li[data-id="after"] .ck')].some(ck => ck.classList.contains('short'));
    const allOk = rows.every(li => li.querySelector('.ck').classList.contains('ok')) && !extraShort;
    const noPay = !!document.querySelector('.cklist li[data-id="payneed"]') && !document.querySelector('.cklist li[data-id="payneed"] .ck-t b');
    if (rows.length && pill.classList.contains('ok') !== (allOk && !noPay)) out.push('pill ' + pill.className + ' vs rows ' + rows.map(li => li.querySelector('.ck').className).join(','));
    rows.forEach(li => {
      const t = li.textContent, ok = li.querySelector('.ck').classList.contains('ok');
      if (/อย่างน้อย/.test(t) && ok && /น้อยกว่า/.test((li.querySelector('.ck-h') || {}).textContent || '')) out.push('✓ with น้อยกว่า: ' + t.slice(0, 60));
      if (/อย่างน้อย/.test(t) && !ok && /มากกว่า|พอดี/.test((li.querySelector('.ck-h') || {}).textContent || '')) out.push('✕ with มากกว่า: ' + t.slice(0, 60));
    });
    return out;
  });
  if (agree.length) probs.push('disagree ' + agree.slice(0, 2).join(' | '));
  if (/NaN|undefined|Infinity|\[object/.test(txt)) probs.push('bad text ' + (txt.match(/.{0,30}(NaN|undefined|Infinity|\[object).{0,20}/) || [''])[0]);
  if (o.bad.length || o.scrollW > o.W) probs.push('overflow ' + JSON.stringify(o.bad));
  if (small.length) probs.push('small targets ' + small.slice(0, 4).join(' | '));
  if (probs.length) console.log('  PROBLEM', label, probs.join(' · '));
  return probs.length;
}
(async () => {
  fs.mkdirSync(path.join(__dirname, '..', '.out', 'shots'), { recursive: true });
  let bad = 0, n = 0;
  for (const [w, h, dark] of [[360, 640, false], [390, 844, true]]) {
    const { browser, page, errors } = await open({ w, h, dark });
    bad += await check(page, w + ' start');
    for (const m of models) {
      for (const T of topics) {
        ctx.__t = T; ctx.__m = m;
        if (!R('topicOk(__t, __m)')) continue;
        const inp = sampleInp(ctx, m), d = genDec(ctx, T, inp, m, models.indexOf(m) + (dark ? 1 : 0));
        await page.evaluate(({ m, T, inp, d }) => {
          const L = window.__lab3, st = L.state;
          L.chooseModel(m, false); st.inp = inp; st.ds[T] = d; L.openTopic(T);
        }, { m, T, inp, d });
        const label = `${w}${dark ? ' dark' : ''} ${m}/${T}`;
        const view = await page.evaluate(() => window.__lab3.state.view);
        if (view !== 'result') { bad++; console.log('  PROBLEM', label, 'view', view); continue; }
        bad += await check(page, label + ' result');
        /* ลากแถบจุดคุ้มสุดซ้าย สุดขวา แล้วกดปุ่มกรณีต่าง ๆ */
        await page.evaluate(() => {
          const r = document.querySelector('#pvr');
          if (r) for (const v of [r.max, r.min, (+r.max + +r.min) / 2, +r.min + (+r.max - +r.min) * 0.37]) { r.value = v; r.dispatchEvent(new Event('input', { bubbles: true })); r.dispatchEvent(new Event('change', { bubbles: true })); }
        });
        await page.waitForTimeout(60);
        for (const b of await page.$$('.pv-chips .sc')) { await b.click(); await page.waitForTimeout(40); }
        bad += await check(page, label + ' result-whatif');
        await page.click('.lane-cta [data-act="lab"]');
        await page.evaluate(() => {
          for (const r of document.querySelectorAll('input[type="range"]')) {
            r.value = r.max; r.dispatchEvent(new Event('input', { bubbles: true }));
            r.value = r.min; r.dispatchEvent(new Event('input', { bubbles: true }));
          }
        });
        bad += await check(page, label + ' lab');
        await page.click('.bar [data-act="result"]');
        if (!(await page.$('[data-act="ask"]'))) { bad++; console.log('  PROBLEM', label, 'after lab: view', await page.evaluate(() => window.__lab3.state.view + ' ' + JSON.stringify(window.__lab3.state.ds[window.__lab3.state.topic]))); n++; continue; }
        await page.click('[data-act="ask"]');
        let k = 0;
        while (await page.$('.ask-ans') && k < 8) { await page.click('.ask-ans button[data-v="yes"]'); await page.waitForTimeout(240); k++; }
        bad += await check(page, label + ' points');
        const pts = await page.evaluate(() => document.querySelectorAll('.point').length);
        if (pts !== k) { bad++; console.log('  PROBLEM', label, 'answered', k, 'points', pts); }
        n++;
      }
    }
    /* กรอกจริงด้วยการแตะ */
    for (const [m, T] of [['subscription', 'hire'], ['rental', 'branch'], ['service', 'equip'], ['resell', 'freeship'], ['unit', 'promo'], ['resell', 'newprod']]) {
      await page.evaluate(() => { sessionStorage.clear(); const L = window.__lab3; L.state.model = null; L.state.inp = {}; L.state.ds = {}; L.state.topic = null; L.go('start'); });
      await page.click(`[data-act="topic"][data-t="${T}"]`);
      await page.click(`[data-act="model"][data-m="${m}"]`);
      const inp = sampleInp(ctx, m);
      for (let s = 0; s < 12; s++) {
        const keys = await page.$$eval('.qfields input[data-k]', els => els.filter(e => !e.closest('[hidden]')).map(e => e.getAttribute('data-k')));
        for (const kk of keys) if (typeof inp[kk] === 'number') await page.fill(`[data-k="${kk}"]`, String(inp[kk]));
        if (await page.$('#foot [data-act="shop-done"]:not([disabled])')) { await page.click('#foot [data-act="shop-done"]'); break; }
        await page.click('#foot [data-act="next"]');
      }
      const d = genDec(ctx, T, inp, m);
      for (let s = 0; s < 6; s++) {
        for (let pass = 0; pass < 2; pass++) {
          const keys = await page.$$eval('.qfields input[data-dk]', els => els.filter(e => !e.closest('[hidden]')).map(e => e.getAttribute('data-dk')));
          for (const kk of keys) if (typeof d[kk] === 'number') await page.fill(`[data-dk="${kk}"]`, String(d[kk]));
        }
        if (await page.$('[data-act="dkind"]')) await page.click('[data-act="dkind"]');
        if (await page.$('[data-act="dpick"][data-v="3"]')) await page.click('[data-act="dpick"][data-v="3"]');
        bad += await check(page, `${w} typed ${m}/${T} q${s}`);
        if (await page.$('#foot [data-act="d-done"]:not([disabled])')) { await page.click('#foot [data-act="d-done"]'); break; }
        if (!(await page.$('#foot [data-act="d-next"]:not([disabled])'))) {
          bad++; console.log('  PROBLEM typed', m, T, 'stuck at', await page.evaluate(() => document.querySelector('.q-head h1').textContent + ' · ' + JSON.stringify(window.__lab3.state.ds[window.__lab3.state.topic])));
          break;
        }
        await page.click('#foot [data-act="d-next"]');
      }
      const v = await page.evaluate(() => window.__lab3.state.view);
      if (v !== 'result') { bad++; console.log('  PROBLEM typed', m, T, 'ended at', v); }
      else bad += await check(page, `${w} typed ${m}/${T} result`);
      await shot(page, `typed-${m}-${T}-${w}`, true);
    }
    if (errors.length) { bad++; console.log('ERRORS', errors.slice(0, 5)); }
    await browser.close();
  }
  console.log(`${n} topic flows`);
  console.log(bad ? bad + ' PROBLEMS' : 'ALL FLOWS OK');
  process.exit(bad ? 1 : 0);
})();
