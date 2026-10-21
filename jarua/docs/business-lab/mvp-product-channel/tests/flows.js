/* ไล่ทุกหน้าบนจอมือถือ 360 สว่าง · 390 มืด · 390 สว่าง
   ร้านตัวอย่างทั้ง 2 ร้าน: ทุกแท็บ ทุกสินค้า ทุกช่องทาง ลองปรับ (คืนค่าเดิม / ใช้ค่านี้) หาจุดที่ควรตรวจสอบ → ตอบครบ → จุดที่ควรตรวจสอบ แก้ตัวเลข สลับโหมด
   กรอกเองด้วยการแตะ: 3 รูปแบบร้าน × ขายที่ไหน 3 แบบ × (ช่องทางเดียว / หลายช่องทาง) จนถึงหน้าผล รวมค่าใช้จ่ายคงที่
   ตรวจทุกหน้า: ไม่มี error · ไม่ล้นจอ · ปุ่ม ลิงก์ ช่องกรอก สูงอย่างน้อย 44px · ไม่มี NaN / undefined / Infinity / [object · ไม่มีคำว่า AI
   · หน้าผล รายละเอียด จุดที่ควรตรวจสอบ ไม่มีคำแนะนำ (ควร เลิก ต้องลด ต้องขึ้น) · ตัวเลขบนแผงดำ = กำไรของร้าน · ผลรวมรายสินค้า = เงินที่เหลือ
   รัน: ./build.sh แล้ว node tests/flows.js */
const fs = require('fs'), path = require('path');
const { open, overflow, shot } = require('./harness');
const TEST_URL = 'file://' + path.join(__dirname, '..', '.out', 'test.html');
fs.mkdirSync(path.join(__dirname, '..', '.out', 'shots'), { recursive: true });

let bad = 0, flows = 0, screens = 0;
const RESULTISH = ['result', 'prod', 'chan', 'ask', 'points'];
function problem(label, msg) { bad++; console.log('  PROBLEM ' + label + ' · ' + msg); }

/* ---------- ตรวจหน้าจอ ---------- */
async function check(env, label) {
  const { page, errors } = env;
  screens++;
  await page.waitForTimeout(40);
  const probs = [];
  const newErr = errors.slice(env.errAt); env.errAt = errors.length;
  if (newErr.length) probs.push('console ' + JSON.stringify(newErr.slice(0, 3)));
  const o = await overflow(page);
  if (o.bad.length || o.scrollW > o.W) probs.push('overflow scrollW=' + o.scrollW + ' W=' + o.W + ' ' + JSON.stringify(o.bad.slice(0, 4)));
  const info = await page.evaluate((RESULTISH) => {
    const view = window.__lab4 ? window.__lab4.state.view : '?';
    const small = [...document.querySelectorAll('button, a, input, select, textarea, [data-act]')].filter(b => {
      const r = b.getBoundingClientRect();
      if (!r.width || !r.height || b.closest('[hidden]')) return false;
      const cs = getComputedStyle(b); if (cs.visibility === 'hidden' || cs.display === 'none') return false;
      return r.height < 43.5;
    }).map(b => b.tagName.toLowerCase() + '.' + String(b.className).replace(/\s+/g, '.') + ' "' + (b.textContent || b.getAttribute('aria-label') || b.getAttribute('placeholder') || b.id || '').trim().slice(0, 24) + '" h=' + Math.round(b.getBoundingClientRect().height));
    const vis = document.body.innerText;
    const attrs = [...document.querySelectorAll('#app [aria-label], #app [placeholder], #app input')].map(e => (e.getAttribute('aria-label') || '') + ' ' + (e.getAttribute('placeholder') || '') + ' ' + (e.value || '')).join('\n');
    const all = [...document.querySelectorAll('#app, .toast, #sr-live')].map(e => e.textContent).join('\n') + '\n' + attrs;
    const badTxt = (all.match(/.{0,30}(NaN|undefined|Infinity|\[object).{0,20}/) || [null])[0];
    const ai = (all.match(/.{0,20}(^|[^A-Za-z])AI([^A-Za-z]|$).{0,20}/) || [null])[0];
    let advice = [];
    if (RESULTISH.indexOf(view) >= 0) {
      /* คำอธิบายเครื่องมือ PL1 (ชุดเดียวกับตัวที่ 1) บอกว่าเครื่องมือนั้นช่วยอะไร ไม่ใช่คำแนะนำของ Lab · ไม่นับ */
      const t = [...document.querySelectorAll('#app, .toast')].map(e => { const k = e.cloneNode(true); k.querySelectorAll('.tool').forEach(x => x.remove()); return k.textContent; }).join('\n').split('ควรเฝ้าระวัง').join('·').split('จุดที่ควรตรวจสอบ').join('·');
      for (const w of ['ควร', 'เลิก', 'ต้องลด', 'ต้องขึ้น']) { const m = t.match(new RegExp('.{0,24}' + w + '.{0,24}', 'g')); if (m) advice.push(...m.map(x => w + ' «' + x.replace(/\s+/g, ' ') + '»')); }
    }
    return { view, small, badTxt, ai, advice, visLen: vis.length };
  }, RESULTISH);
  if (info.small.length) probs.push('small targets ' + info.small.slice(0, 5).join(' | ') + (info.small.length > 5 ? ' (+' + (info.small.length - 5) + ')' : ''));
  if (info.badTxt) probs.push('bad text «' + info.badTxt + '»');
  if (info.ai) probs.push('word AI «' + info.ai + '»');
  if (info.advice.length) probs.push('advice words ' + [...new Set(info.advice)].slice(0, 4).join(' | '));
  if (!info.visLen) probs.push('empty page');
  for (const p of probs) problem(label + ' [' + info.view + ']', p);
  return probs.length;
}

/* ---------- ตัวเลขบนหน้าผล ---------- */
async function checkNumbers(env, label) {
  const { page } = env;
  await page.waitForTimeout(650); /* ตัวเลขวิ่ง 520ms */
  const out = await page.evaluate(() => {
    const L = window.__lab4, R = L.R0(), st = L.state, P = [];
    const parse = s => { s = String(s).replace(/ขาดทุน/g, '').replace(/[,\s]/g, ''); const neg = /^[−-]/.test(s); const v = parseFloat(s.replace(/^[−-]/, '').replace(/[^\d.]/g, '')); return neg ? -v : v; };
    const fmtR = v => { const r = Math.round(v); return (r < 0 ? '−' : '') + Math.abs(r).toLocaleString('th-TH'); };
    if (!R.ok) return ['R0 not ok'];
    /* แผงดำ */
    const big = document.querySelector('.res4 .bignum');
    if (!big) P.push('no dark panel');
    else {
      const t = [...big.childNodes].filter(n => !(n.classList && n.classList.contains('u'))).map(n => n.textContent).join('').trim();
      if (t !== fmtR(R.profit)) P.push('dark panel shows ' + t + ' but profit is ' + fmtR(R.profit) + ' (' + R.profit + ')');
      const eb = document.querySelector('.res4 .eyebrow').textContent;
      if (eb !== (R.profit < -0.5 ? 'ขาดทุนต่อเดือน' : 'กำไรต่อเดือน')) P.push('eyebrow ' + eb + ' for profit ' + R.profit);
    }
    /* บรรทัดใต้แผงดำต้องรวมกันได้กำไร */
    const walk = [...document.querySelectorAll('.res4 .walk > div')].map(d => [d.querySelector('span').textContent, parse(d.querySelector('b').textContent)]);
    const wl = walk.find(w => w[0] === 'เงินที่เหลือจากทุกสินค้า');
    if (!wl || Math.abs(wl[1] - R.left) > 0.51) P.push('walk left ' + (wl && wl[1]) + ' vs R.left ' + R.left);
    const wsum = walk.filter(w => w[0] !== 'ยอดขาย').reduce((s, w) => s + w[1], 0);
    if (Math.abs(wsum - R.profit) > walk.length * 0.5 + 0.5) P.push('walk lines add to ' + wsum + ' but profit ' + R.profit + ' ' + JSON.stringify(walk));
    /* ผลรวม */
    const sp = R.prods.reduce((s, p) => s + p.left, 0), sc = R.chans.reduce((s, c) => s + c.left, 0);
    if (Math.abs(sp - R.left) > 0.01) P.push('Σ products ' + sp + ' ≠ R.left ' + R.left);
    if (Math.abs(sc - R.left) > 0.01) P.push('Σ channels ' + sc + ' ≠ R.left ' + R.left);
    if (Math.abs(R.left - R.chMonthly - R.fixed - R.dep - R.profit) > 1) P.push('left − channel − fixed − dep = ' + (R.left - R.chMonthly - R.fixed - R.dep) + ' ≠ profit ' + R.profit);
    /* แท็บ */
    const nch = st.pc.channels.length, hasC = !!document.querySelector('.tabs4 [data-act="tab"][data-v="c"]');
    if (hasC !== (nch > 1)) P.push('channel tab ' + (hasC ? 'shown' : 'missing') + ' with ' + nch + ' channels');
    /* แถวรายสินค้าบนจอ */
    if (st.tab === 'p' || !R.many) {
      const rows = [...document.querySelectorAll('.rank4 .rk4')];
      if (rows.length !== R.prods.length) P.push('product rows ' + rows.length + ' vs ' + R.prods.length);
      let s = 0;
      rows.forEach((b, n) => {
        const v = parse(b.querySelector('.v').firstChild.textContent); s += v;
        const p = R.rank[n];
        if (!p || Math.abs(v - p.left) > 0.51) P.push('row ' + n + ' shows ' + v + ' vs ' + (p && p.left));
        if (p && +b.getAttribute('data-i') !== p.i) P.push('row ' + n + ' data-i ' + b.getAttribute('data-i') + ' vs ' + p.i);
      });
      if (Math.abs(s - R.left) > rows.length * 0.5 + 0.01) P.push('Σ product rows on screen ' + s + ' ≠ R.left ' + R.left);
    }
    if (st.tab === 'c' && R.many) {
      const rows = [...document.querySelectorAll('.chl4 .chc')];
      if (rows.length !== R.chans.length) P.push('channel rows ' + rows.length + ' vs ' + R.chans.length);
      let s = 0; rows.forEach(b => { s += parse(b.querySelector('.sub').firstChild.nextSibling.textContent); });
      if (Math.abs(s - R.left) > rows.length * 0.5 + 0.01) P.push('Σ channel rows on screen ' + s + ' ≠ R.left ' + R.left);
    }
    if (st.tab === 'g' && R.many) {
      const tds = document.querySelectorAll('.grid4 tbody td').length, na = document.querySelectorAll('.grid4 td.na').length;
      if (tds !== R.prods.length * R.chans.length) P.push('grid cells ' + tds);
      if (tds - na !== R.cells.length) P.push('grid sold cells ' + (tds - na) + ' vs ' + R.cells.length);
    }
    return P;
  });
  for (const p of out) problem(label, 'numbers: ' + p);
}
async function checkDetail(env, label) {
  const { page } = env;
  await page.waitForTimeout(650);
  const out = await page.evaluate(() => {
    const L = window.__lab4, R = L.R0(), st = L.state, P = [];
    const big = document.querySelector('#dpanel .bignum');
    if (!big) return ['no detail panel'];
    const t = [...big.childNodes].filter(n => !(n.classList && n.classList.contains('u'))).map(n => n.textContent).join('').trim();
    const v = st.view === 'prod' ? R.prods[st.sel].left : R.chans[st.sel].after;
    const want = (v < -0.5 ? '−' : '') + Math.abs(Math.round(v)).toLocaleString('th-TH');
    if (Math.abs(v) >= 10 && t !== want) P.push(st.view + ' ' + st.sel + ' panel ' + t + ' vs ' + want);
    if (document.querySelector('.bar .ttl').textContent.indexOf(st.view === 'prod' ? R.prods[st.sel].name : R.chans[st.sel].name) < 0) P.push('title does not name the ' + st.view);
    return P;
  });
  for (const p of out) problem(label, 'detail: ' + p);
}

/* ---------- ตัวช่วย ---------- */
const S = env => env.page.evaluate(() => { const s = window.__lab4.state; return { v: s.view, k: s.k, tab: s.tab, sel: s.sel, editing: s.editing, n: s.pc.channels.length }; });
async function tap(env, sel, wait) { await env.page.click(sel); await env.page.waitForTimeout(wait === undefined ? 90 : wait); }
async function fill(env, sel, v) { await env.page.fill(sel, String(v)); await env.page.waitForTimeout(110); }
async function expectView(env, label, v, k) {
  const s = await S(env);
  if (s.v !== v || (k !== undefined && s.k !== k)) {
    const need = await env.page.evaluate(() => [...document.querySelectorAll('.need-msg')].map(x => (x.closest('[data-need]') || {}).getAttribute('data-need') + ': ' + x.textContent).join(' · ') + ' toast: ' + [...document.querySelectorAll('.toast')].map(x => x.textContent).join(''));
    problem(label, 'expected ' + v + (k !== undefined ? '/' + k : '') + ' got ' + s.v + '/' + s.k + ' ' + need);
    return false;
  }
  return true;
}
async function fresh(env) {
  await env.page.evaluate(() => { try { sessionStorage.clear(); localStorage.removeItem('lab-theme'); } catch (e) { /* ignore */ } });
  await env.page.goto(TEST_URL);
  await env.page.evaluate(() => document.fonts.ready);
  await env.page.waitForTimeout(60);
}
async function snap(env, name) { if (env.shots) await shot(env.page, 'qa-' + env.tag + '-' + name, true); }

/* ---------- ร้านตัวอย่าง ---------- */
async function sampleFlow(env, where) {
  const { page } = env, kind = where === 'online' ? 'online' : 'cafe', L = env.tag + ' sample ' + kind + '(' + where + ')';
  await fresh(env);
  await check(env, L + ' start');
  await tap(env, `[data-act="where"][data-v="${where}"]`);
  await check(env, L + ' start+where');
  await tap(env, '[data-act="sample"]', 150);
  if (!(await expectView(env, L, 'result'))) return;
  const sk = await page.evaluate(() => [window.__lab4.state.sampleKind, (document.querySelector('.banner4') || {}).textContent || '']);
  if (sk[0] !== kind) problem(L, 'sample kind ' + sk[0] + ' for where ' + where);
  if (!/ตัวอย่าง/.test(sk[1])) problem(L, 'sample banner missing (.banner4) «' + sk[1] + '»');
  for (const t of ['p', 'c', 'g']) {
    if (!(await page.$(`.tabs4 [data-act="tab"][data-v="${t}"]`))) { problem(L, 'tab ' + t + ' missing'); continue; }
    await tap(env, `.tabs4 [data-act="tab"][data-v="${t}"]`);
    const s = await S(env); if (s.tab !== t) problem(L, 'tab ' + t + ' not selected');
    await check(env, L + ' tab ' + t); await checkNumbers(env, L + ' tab ' + t);
    await snap(env, kind + '-result-' + t);
    if (t === 'g') {
      /* แตะช่องในตาราง → รายละเอียดสินค้าที่ช่องทางนั้น */
      const cell = await page.$('.grid4 td:not(.na) button');
      if (cell) {
        const want = await cell.evaluate(b => [+b.getAttribute('data-i'), +b.getAttribute('data-c')]);
        await cell.click(); await page.waitForTimeout(120);
        const s2 = await page.evaluate(() => [window.__lab4.state.view, window.__lab4.state.sel, window.__lab4.state.dch]);
        if (s2[0] !== 'prod' || s2[1] !== want[0] || s2[2] !== want[1]) problem(L, 'grid cell → ' + JSON.stringify(s2) + ' want prod ' + want);
        await check(env, L + ' grid cell detail');
        await tap(env, '.bar [data-act="back"]', 150); await expectView(env, L + ' back from grid cell', 'result');
      }
    }
  }
  /* ทุกสินค้า */
  await tap(env, '.tabs4 [data-act="tab"][data-v="p"]');
  const np = await page.$$eval('.rank4 .rk4', a => a.length);
  for (let n = 0; n < np; n++) {
    const i = await page.$eval(`.rank4 .rk4:nth-child(${n + 1})`, b => +b.getAttribute('data-i'));
    await tap(env, `.rank4 .rk4:nth-child(${n + 1})`, 120);
    const s = await S(env);
    if (s.v !== 'prod' || s.sel !== i) { problem(L, 'product row ' + n + ' → ' + s.v + '/' + s.sel); continue; }
    await check(env, L + ' prod ' + i); await checkDetail(env, L + ' prod ' + i);
    if (n === 0) await snap(env, kind + '-prod');
    /* เลือกช่องทางอื่นของสินค้านี้ */
    const dchs = await page.$$eval('.chsel [data-act="dch"]', a => a.map(b => b.getAttribute('data-v')));
    for (const d of dchs) {
      await tap(env, `.chsel [data-act="dch"][data-v="${d}"]`, 60);
      const dd = await page.evaluate(() => window.__lab4.state.dch);
      if (String(dd) !== d) problem(L, 'channel pick ' + d + ' → dch ' + dd);
    }
    if (n === 0) await check(env, L + ' prod ' + i + ' after channel picks');
    await tap(env, '.bar [data-act="back"]', 150);
    await expectView(env, L + ' back from prod', 'result');
  }
  /* ลองปรับสินค้า: + ราคา → คืนค่าเดิม · + ราคา → ใช้ค่านี้ · พิมพ์ต้นทุน → คืนค่าเดิม */
  await tap(env, '.rank4 .rk4:nth-child(1)', 120);
  {
    const before = await page.evaluate(() => { const s = window.__lab4.state; return { price: s.pc.items[s.sel].price, cost: s.pc.items[s.sel].cost, profit: window.__lab4.R0().profit, i: s.sel, step: +document.querySelector('.stp[data-k="price"]:not([data-d^="-"])').getAttribute('data-d') }; });
    await tap(env, '.stp[data-k="price"]:not([data-d^="-"])', 200);
    const t1 = await page.evaluate(() => ({ trial: JSON.stringify(window.__lab4.state.trial), dl: document.querySelector('#dl4').textContent, btns: !!document.querySelector('[data-act="t-use"]') && !!document.querySelector('[data-act="t-reset"]'), tv: document.querySelector('#tv-price').value }));
    if (!/เพิ่มขึ้น/.test(t1.dl) || !t1.btns) problem(L, 'trial + price: delta «' + t1.dl + '» buttons ' + t1.btns);
    if (+t1.tv !== before.price + before.step) problem(L, 'trial input shows ' + t1.tv + ' want ' + (before.price + before.step));
    await check(env, L + ' prod trial');
    await snap(env, kind + '-prod-trial');
    await tap(env, '[data-act="t-reset"]', 150);
    const r1 = await page.evaluate(() => { const s = window.__lab4.state; return { trial: s.trial, price: s.pc.items[s.sel].price, dl: document.querySelector('#dl4').textContent, tv: document.querySelector('#tv-price').value, profit: window.__lab4.R0().profit }; });
    if (r1.trial !== null || r1.price !== before.price || !/เท่าเดิม/.test(r1.dl) || +r1.tv !== before.price || r1.profit !== before.profit) problem(L, 'reset did not restore: ' + JSON.stringify(r1));
    await page.fill('#tv-cost', String(before.cost + 5)); await page.waitForTimeout(250);
    const t2 = await page.evaluate(() => ({ dl: document.querySelector('#dl4').textContent, real: window.__lab4.state.pc.items[window.__lab4.state.sel].cost }));
    if (!/ลดลง/.test(t2.dl) || t2.real !== before.cost) problem(L, 'typed trial cost: ' + JSON.stringify(t2));
    await tap(env, '[data-act="t-reset"]', 150);
    await tap(env, '.stp[data-k="price"]:not([data-d^="-"])', 200);
    const expProfit = await page.evaluate(() => { const s = window.__lab4.state; return s.trial ? null : 'no trial'; });
    if (expProfit) problem(L, 'second trial not started');
    await tap(env, '[data-act="t-use"]', 200);
    const u1 = await page.evaluate(() => { const s = window.__lab4.state; return { trial: s.trial, price: s.pc.items[s.sel].price, profit: window.__lab4.R0().profit, toast: [...document.querySelectorAll('.toast')].map(x => x.textContent).join(''), btns: !!document.querySelector('[data-act="t-use"]') }; });
    if (u1.trial !== null || u1.price !== before.price + before.step || !(u1.profit > before.profit) || u1.btns) problem(L, 'use did not apply: ' + JSON.stringify(u1) + ' before ' + JSON.stringify(before));
    await check(env, L + ' prod after use');
    await checkDetail(env, L + ' prod after use');
    await tap(env, '.bar [data-act="back"]', 150);
    await checkNumbers(env, L + ' result after trial use');
  }
  /* ทุกช่องทาง + ลองปรับช่องทาง */
  await tap(env, '.tabs4 [data-act="tab"][data-v="c"]');
  const nc = await page.$$eval('.chl4 .chc', a => a.length);
  for (let n = 0; n < nc; n++) {
    const j = await page.$eval(`.chl4 .chc:nth-child(${n + 1})`, b => +b.getAttribute('data-j'));
    await tap(env, `.chl4 .chc:nth-child(${n + 1})`, 120);
    const s = await S(env);
    if (s.v !== 'chan' || s.sel !== j) { problem(L, 'channel row ' + n + ' → ' + s.v + '/' + s.sel); continue; }
    await check(env, L + ' chan ' + j); await checkDetail(env, L + ' chan ' + j);
    if (n === 0) {
      await snap(env, kind + '-chan');
      const before = await page.evaluate(() => { const s = window.__lab4.state; return { fee: s.pc.channels[s.sel].fee, profit: window.__lab4.R0().profit }; });
      await tap(env, '.stp[data-k="fee"]:not([data-d^="-"])', 200);
      const t = await page.evaluate(() => document.querySelector('#dl4').textContent);
      if (!/ลดลง|เท่าเดิม/.test(t)) problem(L, 'channel fee +1 delta «' + t + '»');
      await check(env, L + ' chan trial');
      await tap(env, '[data-act="t-reset"]', 150);
      const r = await page.evaluate(() => { const s = window.__lab4.state; return { trial: s.trial, fee: s.pc.channels[s.sel].fee, profit: window.__lab4.R0().profit }; });
      if (r.trial !== null || r.fee !== before.fee || r.profit !== before.profit) problem(L, 'channel reset: ' + JSON.stringify(r));
      await tap(env, '.stp[data-k="monthly"]:not([data-d^="-"])', 200);
      await tap(env, '[data-act="t-use"]', 200);
      const u = await page.evaluate(() => { const s = window.__lab4.state; return { trial: s.trial, monthly: s.pc.channels[s.sel].monthly, profit: window.__lab4.R0().profit }; });
      if (u.trial !== null || !(u.profit < before.profit - 99)) problem(L, 'channel use monthly +100: ' + JSON.stringify(u) + ' before ' + JSON.stringify(before));
      await check(env, L + ' chan after use');
    }
    await tap(env, '.bar [data-act="back"]', 150);
    await expectView(env, L + ' back from chan', 'result');
  }
  await checkNumbers(env, L + ' result after channel trial');
  /* สิ่งที่ตัวเลขบอก: แตะแต่ละข้อ */
  const nf = await page.$$eval('.flist .frow', a => a.length);
  for (let n = 0; n < nf; n++) {
    const isBtn = await page.$eval(`.flist .frow:nth-child(${n + 1})`, b => b.tagName === 'BUTTON');
    if (!isBtn) continue;
    await tap(env, `.flist .frow:nth-child(${n + 1})`, 120);
    const s = await S(env);
    if (s.v !== 'prod' && s.v !== 'chan') { problem(L, 'finding ' + n + ' → ' + s.v); continue; }
    await check(env, L + ' finding ' + n + ' → ' + s.v);
    await tap(env, '.bar [data-act="back"]', 150);
  }
  /* หาจุดที่ควรตรวจสอบ → ตอบครบ → จุดที่ควรตรวจสอบ */
  await tap(env, '#foot [data-act="ask"]', 120);
  if (await expectView(env, L + ' ask', 'ask')) {
    let k = 0, flagged = 0;
    while ((await S(env)).v === 'ask' && k < 8) {
      await check(env, L + ' ask q' + k);
      const q = await page.$eval('.ask-ans button', b => b.getAttribute('data-q'));
      const risk = await page.evaluate(q => QB4[q].risk || 'yes', q);
      const ans = k % 3 === 2 ? (risk === 'yes' ? 'no' : 'yes') : k % 3 === 1 ? 'unsure' : risk;
      if (ans !== (risk === 'yes' ? 'no' : 'yes')) flagged++;
      await tap(env, `.ask-ans button[data-v="${ans}"]`, 320); k++;
    }
    if (await expectView(env, L + ' after answers', 'points')) {
      await check(env, L + ' points');
      const pts = await page.$$eval('.point', a => a.length);
      if (pts !== flagged) problem(L, 'answered ' + k + ' (' + flagged + ' flagged) but ' + pts + ' points');
      await snap(env, kind + '-points');
      for (const b of (await page.$$('[data-act="tool"]')).slice(0, 1)) { await b.click(); await page.waitForTimeout(80); await check(env, L + ' tool toast'); }
      await tap(env, '#foot [data-act="result"]', 150); await expectView(env, L + ' points → result', 'result');
    }
  }
  /* แก้ตัวเลข */
  await tap(env, '#foot [data-act="review"]', 120);
  if (await expectView(env, L + ' review', 'review')) {
    await check(env, L + ' review'); await snap(env, kind + '-review');
    const rows = await page.$$eval('.rv-row[data-act="edit"]', a => a.map(b => [b.getAttribute('data-v'), b.getAttribute('data-k')]));
    for (const [v, k] of rows) {
      await tap(env, `.rv-row[data-act="edit"][data-v="${v}"]` + (k !== null ? `[data-k="${k}"]` : ''), 120);
      const s = await S(env);
      if (s.v !== v || !s.editing) { problem(L, 'edit ' + v + '/' + k + ' → ' + JSON.stringify(s)); continue; }
      await check(env, L + ' editing ' + v + (k !== null ? k : ''));
      await tap(env, '#foot [data-act="step-done"]', 150);
      await expectView(env, L + ' done ' + v + (k || ''), 'review');
    }
    await tap(env, '#foot [data-act="result"]', 150); await expectView(env, L + ' review → result', 'result');
  }
  /* สลับโหมดมืดและสว่าง */
  const th0 = await page.evaluate(() => [document.documentElement.getAttribute('data-theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'), getComputedStyle(document.body).backgroundColor]);
  await tap(env, '.bar [data-act="theme"]');
  const th1 = await page.evaluate(() => [document.documentElement.getAttribute('data-theme'), getComputedStyle(document.body).backgroundColor]);
  if (th1[0] === th0[0] || th1[1] === th0[1]) problem(L, 'theme toggle ' + JSON.stringify([th0, th1]));
  await check(env, L + ' toggled theme');
  await tap(env, '.bar [data-act="theme"]');
  const th2 = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
  if (th2 !== th0[0]) problem(L, 'theme toggle back → ' + th2);
  flows++;
  console.log('flow ' + L + ' done');
}

/* ---------- กรอกเอง ---------- */
const NAMES = { unit: ['ลาเต้เย็น', 'ชาไทยเย็น', 'ครัวซองต์'], resell: ['เสื้อยืด', 'กางเกงยีนส์', 'หมวก'], service: ['ตัดผมชาย', 'สระไดร์', 'ทำสีผม'] };
async function ownFlow(env, m, where, multi) {
  const { page } = env, L = env.tag + ' own ' + m + '/' + where + '/' + (multi ? 'multi' : 'single');
  await fresh(env);
  await tap(env, `[data-act="where"][data-v="${where}"]`);
  await check(env, L + ' start');
  await tap(env, `[data-act="model"][data-m="${m}"]`, 120);
  if (!(await expectView(env, L, 'items', 0))) return;
  const def = await page.evaluate(m => MODELS[m].defPer, m);
  /* ช่องทางเดียว: ใช้ต่อวัน/ต่อเดือนแบบที่ไม่ใช่ค่าเริ่มต้น */
  const per = multi ? def : (def === 'day' ? 'month' : 'day');
  if (per !== def) await tap(env, `[data-act="per"][data-v="${per}"]`);
  if (per === 'day') await fill(env, '#f-inp-daysOpen', 26);
  else if (await page.$('#f-inp-daysOpen')) problem(L, 'daysOpen shown for per month');
  const q = per === 'day' ? [30, 18, 6] : [400, 220, 90];
  const nItems = multi ? 3 : 2;
  for (let i = 0; i < nItems; i++) {
    if (i > 0) { await tap(env, '[data-act="item-add"]'); if (!(await page.$(`#f-i-${i}-name`))) { problem(L, 'item-add did not add item ' + i); break; } }
    await fill(env, `#f-i-${i}-name`, NAMES[m][i]);
    if (i === 1) { const u2 = await page.evaluate(m => MODELS[m].units[2], m); await tap(env, `[data-act="pset"][data-path="i.${i}.unit"][data-v="${u2}"]`); }
    await fill(env, `#f-i-${i}-price`, [80, 55, 120][i] * (m === 'service' ? 5 : m === 'resell' ? 4 : 1));
    if (!multi && i === 1) {
      /* แยกต้นทุนทีละอย่าง */
      await tap(env, `[data-act="part-open"][data-i="${i}"]`);
      await fill(env, `[data-path="pt.${i}.0.n"]`, 'วัตถุดิบ'); await fill(env, `[data-path="pt.${i}.0.v"]`, 12.5);
      await fill(env, `[data-path="pt.${i}.1.n"]`, 'บรรจุภัณฑ์'); await fill(env, `[data-path="pt.${i}.1.v"]`, 3);
      await tap(env, `[data-act="part-add"][data-i="${i}"]`);
      await fill(env, `[data-path="pt.${i}.2.n"]`, 'อื่น ๆ'); await fill(env, `[data-path="pt.${i}.2.v"]`, 1.25);
      const pc = await page.evaluate(i => [window.__lab4.state.pc.items[i].cost, document.querySelector(`#f-i-${i}-cost`).value, document.querySelector(`#f-i-${i}-cost`).readOnly, (document.querySelector(`.pi[data-item="${i}"] .part-f b`) || {}).textContent], i);
      if (pc[0] !== 16.75 || +pc[1] !== 16.75 || !pc[2] || pc[3] !== '16.75') problem(L, 'parts sum ' + JSON.stringify(pc));
      /* เพิ่มรายการแล้วลบทิ้ง: ยอดรวมกลับเท่าเดิม */
      await tap(env, `[data-act="part-add"][data-i="${i}"]`); await fill(env, `[data-path="pt.${i}.3.v"]`, 9);
      const c4 = await page.evaluate(i => window.__lab4.state.pc.items[i].cost, i);
      await tap(env, `[data-act="part-del"][data-i="${i}"][data-k="3"]`);
      const c3 = await page.evaluate(i => [window.__lab4.state.pc.items[i].cost, window.__lab4.state.pc.items[i].parts.length], i);
      if (c4 !== 25.75 || c3[0] !== 16.75 || c3[1] !== 3) problem(L, 'part add/delete ' + JSON.stringify([c4, c3]));
    } else await fill(env, `#f-i-${i}-cost`, [22, 19.5, 60][i] * (m === 'service' ? 3 : m === 'resell' ? 4 : 1));
    await fill(env, `#f-i-${i}-qty`, q[i]);
  }
  if (!multi) {
    /* เพิ่มสินค้าแล้วลบทิ้ง */
    await tap(env, '[data-act="item-add"]'); await fill(env, `#f-i-${nItems}-name`, 'ลบทิ้ง');
    await tap(env, `[data-act="item-del"][data-i="${nItems}"]`);
    const left = await page.evaluate(() => [window.__lab4.state.pc.items.map(p => p.name), [...document.querySelectorAll('.toast')].map(t => t.textContent).join('')]);
    if (left[0].length !== nItems || left[0].indexOf('ลบทิ้ง') >= 0 || !/ลบ/.test(left[1])) problem(L, 'item delete ' + JSON.stringify(left));
  }
  /* สินค้าอื่น ๆ: ช่องทางเดียว = มี · หลายช่องทาง = ไม่มี */
  await tap(env, `[data-act="pset"][data-path="r.on"][data-v="${!multi}"]`);
  if (!multi) { await fill(env, '#f-r-sales', per === 'day' ? 900 : 24000); await fill(env, '#f-r-costPct', 40); }
  else if (await page.$('#f-r-sales')) problem(L, 'rest fields shown when answered ไม่มี');
  await check(env, L + ' items');
  if (multi && m === 'unit' && where === 'both') await snap(env, 'items');
  if (!multi && m === 'unit' && where === 'shop') await snap(env, 'items-parts-rest');
  await tap(env, '#foot [data-act="step-next"]', 120);
  if (!(await expectView(env, L + ' items → chpick', 'chpick', 0))) return;
  /* ชิปช่องทางตรงกับ "ขายที่ไหน" */
  const kinds = await page.evaluate(([m, w]) => chKindsFor(m, w).filter(k => k !== 'other'), [m, where]);
  const shown = await page.$$eval('[data-act="ch-toggle"]', a => a.map(b => b.getAttribute('data-k')));
  if (JSON.stringify(kinds) !== JSON.stringify(shown)) problem(L, 'channel chips ' + shown + ' want ' + kinds);
  const pick = multi ? (where === 'shop' ? [kinds[0], kinds[1], 'other'] : [kinds[0], kinds[1], kinds[kinds.length - 1]]) : [kinds[where === 'online' ? kinds.length - 1 : 0]];
  for (const k of pick) {
    if (k === 'other') { await tap(env, '[data-act="ch-other"]'); await fill(env, '#f-c-2-name', 'ขายให้บริษัท'); }
    else await tap(env, `[data-act="ch-toggle"][data-k="${k}"]`);
  }
  const picked = await page.evaluate(() => window.__lab4.state.pc.channels.map(c => c.kind));
  if (JSON.stringify(picked) !== JSON.stringify(pick)) problem(L, 'picked ' + picked + ' want ' + pick);
  await check(env, L + ' chpick');
  await tap(env, '#foot [data-act="step-next"]', 120);
  if (multi) {
    if (!(await expectView(env, L + ' chpick → share', 'share', 0))) return;
    await fill(env, '#f-c-0-share', 55); await fill(env, '#f-c-1-share', 30);
    const fillBtn = await page.$('[data-act="share-fill"]');
    if (!fillBtn) problem(L, 'share-fill button missing with one empty channel');
    else { await tap(env, '[data-act="share-fill"]'); const v = await page.evaluate(() => window.__lab4.state.pc.channels[2].share); if (v !== 15) problem(L, 'share-fill set ' + v + ' want 15'); }
    if (!(await page.$('#tot4w .tot4 i'))) problem(L, 'share total does not show ✓ at 100%');
    await check(env, L + ' share');
    await tap(env, '#foot [data-act="step-next"]', 120);
  } else if ((await S(env)).v === 'share') problem(L, 'share step shown for a single channel');
  const nCh = pick.length;
  for (let j = 0; j < nCh; j++) {
    if (!(await expectView(env, L + ' channel ' + j, 'ch', j))) return;
    const c = '#f-c-' + j + '-', isShop = pick[j] === 'shop', cfg = multi ? j : 1;
    const hasPM = !!(await page.$(`[data-act="pset"][data-path="c.${j}.priceMode"]`));
    if (hasPM === isShop) problem(L, 'priceMode question ' + (hasPM ? 'shown on shop' : 'missing') + ' for ' + pick[j]);
    if (!isShop) {
      const pm = ['same', 'up', 'down'][cfg];
      await tap(env, `[data-act="pset"][data-path="c.${j}.priceMode"][data-v="${pm}"]`);
      if (pm !== 'same') await fill(env, c + 'markup', [0, 15, 5][cfg]);
      else if (await page.$(c + 'markup')) problem(L, 'markup shown for priceMode same');
    }
    if (cfg === 2) await tap(env, `[data-act="pset"][data-path="c.${j}.fee"][data-v="0"]`);
    else await fill(env, c + 'fee', [3, 30][cfg]);
    const hasVat = !!(await page.$(`[data-act="pset"][data-path="c.${j}.vat"]`));
    if (hasVat !== (cfg !== 2)) problem(L, 'VAT question ' + (hasVat ? 'shown with fee 0' : 'missing with fee > 0'));
    if (hasVat) await tap(env, `[data-act="pset"][data-path="c.${j}.vat"][data-v="${cfg === 1 ? 'ex' : 'in'}"]`);
    if (cfg === 1) await fill(env, c + 'disc', 10); else await tap(env, `[data-act="pset"][data-path="c.${j}.disc"][data-v="0"]`);
    /* ร้านขายบริการ: ไม่ถามค่าแพ็ก (ไปบริการนอกร้าน = ค่าเดินทางต่อครั้ง ไม่ถามจำนวนต่อออร์เดอร์) */
    const svc = m === 'service', hasPO = !!(await page.$(c + 'perOrder'));
    if (hasPO !== (!svc || pick[j] === 'onsite')) problem(L, 'pack/travel cost question ' + (hasPO ? 'shown' : 'missing') + ' on ' + pick[j]);
    if (hasPO) { if (cfg === 0) await tap(env, `[data-act="pset"][data-path="c.${j}.perOrder"][data-v="0"]`); else await fill(env, c + 'perOrder', [0, 6, 40][cfg]); }
    const hasIpo = !!(await page.$(c + 'ipo'));
    if (hasIpo !== (!svc && cfg !== 0)) problem(L, 'items-per-order question ' + (hasIpo ? 'shown with no pack cost' : 'missing with pack cost'));
    if (!hasIpo) {} else if (cfg === 1) await fill(env, c + 'ipo', 1.5); else if (cfg === 2) await tap(env, `[data-act="pset"][data-path="c.${j}.ipo"][data-v="1"]`);
    if (cfg === 1) await fill(env, c + 'monthly', 1500); else await tap(env, `[data-act="pset"][data-path="c.${j}.monthly"][data-v="0"]`);
    const offChips = await page.$$(`[data-act="ch-off"][data-j="${j}"]`);
    if (offChips.length !== (multi ? nItems : 0)) problem(L, 'product on/off chips ' + offChips.length + ' on channel ' + j);
    if (multi && j === 2) {
      /* ปิดสินค้าที่ 2 บนช่องทางนี้ */
      const id = await page.evaluate(() => window.__lab4.state.pc.items[1].id);
      await tap(env, `[data-act="ch-off"][data-j="${j}"][data-id="${id}"]`);
      const off = await page.evaluate(([j, id]) => [!!window.__lab4.state.pc.channels[j].off[id], document.querySelector(`[data-act="ch-off"][data-id="${id}"]`).getAttribute('aria-pressed')], [j, id]);
      if (!off[0] || off[1] !== 'false') problem(L, 'switch product off ' + JSON.stringify(off));
    }
    await check(env, L + ' channel ' + j);
    if (multi && m === 'unit' && where === 'both' && j === 1) await snap(env, 'channel');
    await tap(env, '#foot [data-act="step-next"]', 120);
  }
  /* ค่าใช้จ่ายคงที่ */
  const FX = multi ? { staffCount: 2, staffSalary: 12000, ownerSalary: '0', rent: '0', marketing: 2000, otherFixed: 5000, cash: 40000 }
    : { staffCount: '0', ownerSalary: 15000, rent: 8000, marketing: '0', otherFixed: 3000, cash: '0' };
  for (let k = 0; k < 3; k++) {
    if (!(await expectView(env, L + ' fixed ' + k, 'fixed', k))) return;
    const keys = await page.$$eval('.qfields [data-need^="inp."]', a => a.map(e => e.getAttribute('data-need').slice(4)));
    for (const key of keys) {
      const v = FX[key];
      if (v === undefined) { if (!(await page.$(`[data-need="inp.${key}"][hidden]`))) problem(L, key + ' visible but staffCount 0'); continue; }
      if (typeof v === 'string') await tap(env, `[data-act="pset"][data-path="inp.${key}"][data-v="${v}"]`);
      else await fill(env, '#f-inp-' + key, v);
    }
    if (multi && k === 0 && (await page.$('[data-need="inp.staffSalary"][hidden]'))) problem(L, 'staffSalary still hidden after staffCount 2');
    await check(env, L + ' fixed ' + k);
    await tap(env, '#foot [data-act="step-next"]', 150);
  }
  if (!(await expectView(env, L + ' → result', 'result'))) return;
  await check(env, L + ' result'); await checkNumbers(env, L + ' result');
  const inp = await page.evaluate(() => window.__lab4.state.inp);
  for (const [k, v] of Object.entries(FX)) if (k !== 'marketing' && +inp[k] !== +v) problem(L, 'shop number ' + k + ' = ' + inp[k] + ' want ' + v);
  if (multi) {
    for (const t of ['c', 'g']) { await tap(env, `.tabs4 [data-act="tab"][data-v="${t}"]`); await check(env, L + ' result tab ' + t); await checkNumbers(env, L + ' result tab ' + t); }
    const na = await page.$$eval('.grid4 td.na', a => a.length);
    if (na !== 1) problem(L, 'grid shows ' + na + ' "ไม่ขาย" cells, want 1 (item 2 off on channel 3)');
  } else {
    const rest = await page.evaluate(() => window.__lab4.R0().prods.some(p => p.rest));
    if (!rest) problem(L, 'สินค้าอื่น ๆ missing from results');
  }
  await tap(env, '.rank4 .rk4:nth-child(1), .tabs4 [data-v="p"]', 120);
  if ((await S(env)).v === 'result') await tap(env, '.rank4 .rk4:nth-child(1)', 120);
  if (await expectView(env, L + ' product detail', 'prod')) { await check(env, L + ' prod'); await checkDetail(env, L + ' prod'); }
  flows++;
  console.log('flow ' + L + ' done');
}

/* ---------- ร้านใหญ่สุด: 12 สินค้า × 6 ช่องทาง ชื่อยาวสุด (40 ตัว) ตัวเลขหลักล้าน มีคู่ที่ขาดทุน ---------- */
async function stressFlow(env) {
  const { page } = env, L = env.tag + ' stress 12×6';
  await fresh(env);
  await tap(env, '[data-act="where"][data-v="both"]');
  await page.evaluate(() => {
    const X = window.__lab4, st = X.state;
    X.chooseModel('unit');
    const long = ['คาราเมลมัคคิอาโต้เย็นปั่นวิปครีมพิเศษ XL', 'SuperLongEnglishProductNameWithoutSpaces', 'ชาเขียวมัทฉะลาเต้นมโอ๊ตหวานน้อยไซซ์ใหญ่'];
    st.inp = Object.assign(st.inp, { volumePer: 'day', daysOpen: 30, staffCount: 12, staffSalary: 25000, ownerSalary: 120000, rent: 1250000, marketing: 450000, otherFixed: 380000, cash: 9800000 });
    st.pc.items = Array.from({ length: 12 }, (_, i) => ({ id: 'sx' + i, name: (long[i % 3] || '').slice(0, 40 - String(i).length) + i, unit: ['แก้ว', 'จาน', 'ชิ้น', 'กล่อง'][i % 4],
      price: i === 0 ? 1250000 : 45 + i * 13, cost: i === 5 ? 210 : i === 0 ? 990000 : 12 + i * 4, qty: i === 0 ? 0.2 : 15 + i * 7 }));
    st.pc.rest = { on: true, sales: 98000, costPct: 45 };
    const kinds = ['shop', 'booth', 'wholesale', 'grab', 'lineman', 'other'], shares = [30, 10, 15, 20, 15, 10];
    st.pc.channels = kinds.map((k, j) => ({ id: 'sc' + j, kind: k, name: k === 'other' ? 'ขายส่งให้โรงแรมและร้านอาหารในเครือทั่วประเทศ'.slice(0, 40) : '', share: shares[j],
      priceMode: k === 'shop' ? 'same' : ['up', 'down', 'same'][j % 3], markup: k === 'shop' ? null : [25, 35, null][j % 3], fee: [0, 15, 8, 32, 30, 0][j], vat: [null, 'in', 'ex', 'ex', 'ex', null][j],
      disc: [0, 5, 0, 10, 20, 0][j], perOrder: [0, 8, 120, 7, 6, 350][j], ipo: [null, 1, 12, 1.5, 1.5, 24][j], monthly: [0, 4500, 0, 25000, 18000, 150000][j], off: j === 5 ? { sx1: true, sx3: true } : j === 2 ? { sx0: true } : {} }));
    st.askFixed = false; X.startFlow();
  });
  if (!(await expectView(env, L, 'result'))) { const d = await page.evaluate(() => JSON.stringify(window.__lab4.state.view)); problem(L, 'stuck ' + d); return; }
  const add = await page.evaluate(() => [window.__lab4.state.pc.items.length, document.querySelectorAll('[data-act="item-add"]').length]);
  for (const t of ['p', 'c', 'g']) { await tap(env, `.tabs4 [data-act="tab"][data-v="${t}"]`); await check(env, L + ' tab ' + t); await checkNumbers(env, L + ' tab ' + t); }
  await snap(env, 'stress-result-g');
  await tap(env, '.tabs4 [data-act="tab"][data-v="p"]');
  for (const n of [1, 2]) { await tap(env, `.rank4 .rk4:nth-child(${n})`, 120); await check(env, L + ' prod row ' + n); await checkDetail(env, L + ' prod row ' + n); await tap(env, '.bar [data-act="back"]', 150); }
  const last = await page.$$eval('.rank4 .rk4', a => a.length);
  await tap(env, `.rank4 .rk4:nth-child(${last})`, 120); await check(env, L + ' prod (lowest)'); await checkDetail(env, L + ' prod (lowest)'); await snap(env, 'stress-prod-lowest');
  await tap(env, '.bar [data-act="back"]', 150);
  await tap(env, '.tabs4 [data-act="tab"][data-v="c"]');
  for (let n = 1; n <= 6; n++) { await tap(env, `.chl4 .chc:nth-child(${n})`, 120); await check(env, L + ' chan row ' + n); await checkDetail(env, L + ' chan row ' + n); await tap(env, '.bar [data-act="back"]', 150); }
  await tap(env, '#foot [data-act="review"]'); await check(env, L + ' review');
  for (const sel of ['.rv-row[data-v="items"]', '.rv-row[data-v="chpick"]', '.rv-row[data-v="share"]', '.rv-row[data-v="ch"][data-k="5"]', '.rv-row[data-v="ch"][data-k="3"]']) {
    await tap(env, sel, 150); await check(env, L + ' editing ' + sel);
    if (sel.indexOf('items') >= 0 && (await page.$('[data-act="item-add"]'))) problem(L, 'เพิ่มสินค้า still offered at 12 items');
    if (sel.indexOf('chpick') >= 0) { const dis = await page.$$eval('[data-act="ch-toggle"][disabled]', a => a.length); const oth = await page.$('[data-act="ch-other"]'); if (!dis || oth) problem(L, 'at 6 channels: disabled chips ' + dis + ', other-channel link ' + !!oth); }
    await tap(env, '#foot [data-act="step-done"]', 150); await expectView(env, L + ' done', 'review');
  }
  await tap(env, '#foot [data-act="result"]', 150);
  await tap(env, '#foot [data-act="ask"]', 120);
  for (let k = 0; k < 8 && (await S(env)).v === 'ask'; k++) { await check(env, L + ' ask ' + k); await tap(env, '.ask-ans button[data-v="unsure"]', 320); }
  if (await expectView(env, L + ' points', 'points')) { await check(env, L + ' points'); await snap(env, 'stress-points'); }
  if (add[1]) problem(L, 'item-add button on the result? ' + add);
  flows++;
  console.log('flow ' + L + ' done');
}

(async () => {
  for (const [w, h, dark, shots] of [[360, 640, false, false], [390, 844, true, true], [390, 844, false, true]]) {
    const { browser, page, errors } = await open({ w, h, dark });
    const env = { page, errors, errAt: 0, tag: w + (dark ? '-dark' : '-light'), shots };
    try {
      /* ONLY=<regex> รันเฉพาะเส้นทางที่ชื่อตรง เช่น ONLY=stress หรือ ONLY='own unit' */
      const want = l => !process.env.ONLY || new RegExp(process.env.ONLY).test(l);
      if (want('sample cafe')) await sampleFlow(env, w === 360 ? 'shop' : 'both');
      if (want('sample online')) await sampleFlow(env, 'online');
      if (want('stress')) try { await stressFlow(env); } catch (e) { problem(env.tag + ' stress', 'crashed: ' + e.message.split('\n')[0]); }
      for (const m of ['unit', 'resell', 'service'])
        for (const where of ['shop', 'online', 'both'])
          for (const multi of [false, true]) {
            if (!want('own ' + m + '/' + where + '/' + (multi ? 'multi' : 'single'))) continue;
            try { await ownFlow(env, m, where, multi); } catch (e) { problem(env.tag + ' own ' + m + '/' + where + '/' + (multi ? 'multi' : 'single'), 'crashed: ' + e.message.split('\n')[0]); }
          }
    } catch (e) { problem(env.tag, 'crashed: ' + e.message.split('\n')[0]); }
    if (errors.length > env.errAt) problem(env.tag, 'console ' + JSON.stringify(errors.slice(env.errAt, env.errAt + 3)));
    await browser.close();
  }
  console.log(flows + ' flows · ' + screens + ' screens checked');
  console.log(bad ? bad + ' PROBLEMS' : 'ALL FLOWS OK');
  process.exit(bad ? 1 : 0);
})();
