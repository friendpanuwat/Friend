/* ไล่ทุกหน้าบนจอมือถือ 360 สว่าง · 390 มืด · 390 สว่าง (แบบเดียวกับ tests/flows.js ของตัวที่ 4)
   ร้านตัวอย่างทั้ง 3 ร้าน (แตะครั้งเดียวจากหน้าแรก): ทุกแบบ "ถ้าขายได้" · เปลี่ยน % ที่ใช้ทดสอบ · ลองปรับ (คืนค่าเดิม / ใช้ค่านี้)
     · อยากได้เท่าไร (ปุ่ม + −) · หาจุดที่ควรตรวจสอบ → ตอบครบ → จุดที่ควรตรวจสอบ · แก้ตัวเลขทีละแถว → เสร็จ · สลับโหมดมืดและสว่าง
   กรอกเองด้วยการแตะ: 3 รูปแบบร้าน × ขายที่ไหน 3 แบบ × เงินก่อนเปิดร้าน (ทีละรายการ มีอื่น ๆ และอุปกรณ์ / ยอดรวมก้อนเดียว)
     × เดือนขายดีขายแย่ (มี / ไม่มี) × ยอดขายเดือนแรก ๆ ทุกแบบ (รวมปรับเองทีละเดือน) จนถึงหน้าผล
   ร้านใหญ่สุด: ชื่อยาวสุด 40 ตัว · เมนู 8 อย่าง · ปรับเอง 24 เดือน · เงินก่อนเปิดร้าน 17 รายการ · ตัวเลขหลักล้าน
   ตรวจทุกหน้า: ไม่มี error · ไม่ล้นจอ · ปุ่ม ลิงก์ ช่องกรอก สูงอย่างน้อย 44px · ไม่มี NaN / undefined / Infinity / [object (รวมในกราฟ) · ไม่มีคำว่า AI
   · หน้าผล หาจุดที่ควรตรวจสอบ จุดที่ควรตรวจสอบ ไม่มีคำแนะนำ (ควร เลิก ต้องลด ต้องขึ้น · ยกเว้น "ควรเฝ้าระวัง" "จุดที่ควรตรวจสอบ" และคำอธิบายเครื่องมือ .tool)
   · ตัวเลขบนหน้าผลตรงกับ R0(): แผงดำ = เงินที่ต้องมีของแบบที่เลือก · บรรทัดใต้แผง · จุดคุ้มทุน = ceil(S.be.vol) · คืนทุน · เงินพอ ถ้า… · เรียงเรื่องที่ทำให้ใช้เงินเพิ่มจากมากไปน้อย
   รัน: ./build.sh แล้ว NODE_PATH=/opt/node22/lib/node_modules node tests/flows.js
   ONLY=<regex> รันเฉพาะเส้นทางที่ชื่อตรง เช่น ONLY=stress หรือ ONLY='own unit' · FULL=1 กรอกเองครบทุกคู่ (36 เส้นทาง) ทุกขนาดจอ */
const fs = require('fs'), path = require('path');
const { open, overflow, shot } = require('./harness');
const TEST_URL = 'file://' + path.join(__dirname, '..', '.out', 'test.html');
fs.mkdirSync(path.join(__dirname, '..', '.out', 'shots'), { recursive: true });

let bad = 0, flows = 0, screens = 0;
const RESULTISH = ['result', 'ask', 'points'];
const T0 = Date.now();
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
    const view = window.__labOpen ? window.__labOpen.state.view : '?';
    const small = [...document.querySelectorAll('button, a, input, select, textarea, [data-act]')].filter(b => {
      const r = b.getBoundingClientRect();
      if (!r.width || !r.height || b.closest('[hidden]')) return false;
      const cs = getComputedStyle(b); if (cs.visibility === 'hidden' || cs.display === 'none') return false;
      return r.height < 43.5;
    }).map(b => b.tagName.toLowerCase() + '.' + String(b.className).replace(/\s+/g, '.') + '[' + (b.getAttribute('data-act') || '') + '] "' + (b.textContent || b.getAttribute('aria-label') || b.getAttribute('placeholder') || b.id || '').trim().slice(0, 24) + '" h=' + Math.round(b.getBoundingClientRect().height));
    const vis = document.body.innerText;
    const attrs = [...document.querySelectorAll('#app [aria-label], #app [placeholder], #app input')].map(e => (e.getAttribute('aria-label') || '') + ' ' + (e.getAttribute('placeholder') || '') + ' ' + (e.value || '')).join('\n');
    const all = [...document.querySelectorAll('#app, .toast, #sr-live')].map(e => e.textContent).join('\n') + '\n' + attrs;
    const badTxt = (all.match(/.{0,30}(NaN|undefined|Infinity|\[object).{0,20}/) || [null])[0];
    /* กราฟและแท่ง: ตัวเลขในรูปต้องไม่เพี้ยน */
    const svgBad = [...document.querySelectorAll('#app svg *, #app [style]')].map(e => [...e.attributes].map(a => a.value).join(' ')).find(s => /NaN|Infinity|undefined/.test(s)) || null;
    const ai = (all.match(/.{0,20}(^|[^A-Za-z])AI([^A-Za-z]|$).{0,20}/) || [null])[0];
    let advice = [];
    if (RESULTISH.indexOf(view) >= 0) {
      /* คำอธิบายเครื่องมือ PL1 บอกว่าเครื่องมือนั้นช่วยอะไร ไม่ใช่คำแนะนำของ Lab · ไม่นับ */
      const t = [...document.querySelectorAll('#app, .toast')].map(e => { const k = e.cloneNode(true); k.querySelectorAll('.tool').forEach(x => x.remove()); return k.textContent; }).join('\n').split('ควรเฝ้าระวัง').join('·').split('จุดที่ควรตรวจสอบ').join('·');
      for (const w of ['ควร', 'เลิก', 'ต้องลด', 'ต้องขึ้น']) { const m = t.match(new RegExp('.{0,24}' + w + '.{0,24}', 'g')); if (m) advice.push(...m.map(x => w + ' «' + x.replace(/\s+/g, ' ') + '»')); }
    }
    return { view, small, badTxt, svgBad, ai, advice, visLen: vis.length };
  }, RESULTISH);
  if (info.small.length) probs.push('small targets ' + info.small.slice(0, 5).join(' | ') + (info.small.length > 5 ? ' (+' + (info.small.length - 5) + ')' : ''));
  if (info.badTxt) probs.push('bad text «' + info.badTxt + '»');
  if (info.svgBad) probs.push('bad attribute «' + info.svgBad.slice(0, 80) + '»');
  if (info.ai) probs.push('word AI «' + info.ai + '»');
  if (info.advice.length) probs.push('advice words ' + [...new Set(info.advice)].slice(0, 4).join(' | '));
  if (!info.visLen) probs.push('empty page');
  for (const p of probs) problem(label + ' [' + info.view + ']', p);
  return probs.length;
}

/* ---------- ตัวเลขบนหน้าผล เทียบกับ R0() ---------- */
async function checkNumbers(env, label) {
  const { page } = env;
  await page.waitForTimeout(650); /* ตัวเลขวิ่ง 520ms */
  const out = await page.evaluate(() => {
    const L = window.__labOpen, R = L.R0(), st = L.state, P = [];
    if (!R.ok) return ['R0 not ok'];
    const B = R.sc[st.sc], S = R.S, inp = st.inp, u = U(inp, st.model);
    const txt = el => el ? el.textContent.replace(/\s+/g, ' ').trim() : null;
    const noU = el => el ? [...el.childNodes].filter(n => !(n.nodeType === 1 && (n.classList.contains('u') || n.tagName === 'SMALL'))).map(n => n.textContent).join('').trim() : null;
    const parse = s => { s = String(s).replace(/[,\s]/g, ''); const neg = /^[−-]/.test(s); const v = parseFloat(s.replace(/^[−-]/, '').replace(/[^\d.]/g, '')); return neg ? -v : v; };
    const ceilV = v => Math.ceil(v - 1e-9);
    /* แบบที่เลือก */
    const pressed = [...document.querySelectorAll('[data-act="sc"]')].filter(b => b.getAttribute('aria-pressed') === 'true').map(b => b.getAttribute('data-v'));
    if (pressed.length !== 1 || pressed[0] !== st.sc) P.push('scenario buttons pressed ' + pressed + ' state ' + st.sc);
    /* ความสัมพันธ์ในตัวเลขเอง */
    if (B.low > 1e-9) P.push('lowest point above 0: ' + B.low);
    if (Math.abs(B.need - (B.all - B.low)) > 0.01) P.push('need ' + B.need + ' ≠ all − low ' + (B.all - B.low));
    if (B.save !== null && Math.abs(B.left - (B.save - B.need)) > 0.01) P.push('left ≠ save − need');
    if (R.sc.low.need + 1e-6 < R.sc.mid.need || R.sc.mid.need + 1e-6 < R.sc.high.need) P.push('need not ordered low ≥ mid ≥ high: ' + [R.sc.low.need, R.sc.mid.need, R.sc.high.need]);
    const lowest = B.months.reduce((a, x) => Math.min(a, x.cum), 0);
    if (Math.abs(lowest - B.low) > 0.01) P.push('lowest cumulative ' + lowest + ' vs low ' + B.low);
    const pay = (() => { const x = B.months.find(x => x.cum >= B.spent - 1e-6); return x ? x.m : null; })();
    if (pay !== B.payS) P.push('payback recomputed ' + pay + ' vs payS ' + B.payS);
    /* แผงดำ */
    const big = document.querySelector('#rpanel .bignum');
    if (!big) P.push('no dark panel');
    else if (noU(big) !== fmtN(B.need)) P.push('panel shows ' + noU(big) + ' but need (' + st.sc + ') is ' + fmtN(B.need));
    const walk = [...document.querySelectorAll('#rpanel .walk > div')].map(d => [txt(d.querySelector('span')), txt(d.querySelector('b')), d.className]);
    const w0 = walk.find(w => w[0] === 'จ่ายก่อนเปิดร้าน');
    if (!w0 || w0[1] !== fmtN(B.all)) P.push('walk "จ่ายก่อนเปิดร้าน" ' + (w0 && w0[1]) + ' vs ' + fmtN(B.all));
    const w1 = walk.find(w => /^ควักเพิ่ม/.test(w[0]));
    if ((B.low < -0.5) !== !!w1) P.push('walk "ควักเพิ่ม" ' + (w1 ? 'shown' : 'missing') + ' with low ' + B.low);
    if (w1 && w1[1] !== fmtN(-B.low)) P.push('walk "ควักเพิ่ม" ' + w1[1] + ' vs ' + fmtN(-B.low));
    if (big && Math.abs(parse(w0 ? w0[1] : 0) + parse(w1 ? w1[1] : 0) - parse(noU(big))) > 1.01) P.push('walk lines do not add up to the panel: ' + JSON.stringify(walk));
    const wk = walk.find(w => w[2] === 'k');
    const short = B.left < -0.5;
    if (!wk) P.push('walk last line missing');
    else {
      if (wk[1] !== (short ? '−' : '') + fmtN(Math.abs(B.left))) P.push('walk left ' + wk[1] + ' vs ' + B.left);
      if (wk[0].indexOf('คุณมี ' + fmtN(B.save)) !== 0 || (short ? !/ขาดอีก/.test(wk[0]) : !/เหลือช่วงตึงที่สุด/.test(wk[0]))) P.push('walk last label «' + wk[0] + '» left ' + B.left);
    }
    /* 4 ช่อง */
    const tiles = [...document.querySelectorAll('#tiles .ovt')];
    if (tiles.length !== 4) P.push('tiles ' + tiles.length);
    else {
      const v = i => txt(tiles[i].querySelector('.v')), n = i => txt(tiles[i].querySelector('.n'));
      const beOk = S.be && !S.be.impossible ? S.be.vol : null;
      const wantBe = beOk === null ? 'ขายเท่าไรก็ขาดทุน' : fmtN(Math.ceil(beOk)) + u, wantBe2 = beOk === null ? wantBe : fmtN(ceilV(beOk)) + u;
      if (v(0) !== wantBe && v(0) !== wantBe2) P.push('break-even tile ' + v(0) + ' vs ceil(be.vol) ' + wantBe + ' (be.vol ' + (beOk) + ')');
      /* จุดคุ้มทุนจริง: ขายเท่านั้นไม่ขาดทุน ขายน้อยกว่า 1 ขาดทุน */
      if (beOk !== null && n0(inp.volume) > 0) {
        const b = ceilV(beOk), pAt = k => compute(scaleVol(inp, st.model, k / n0(inp.volume)), st.model).profit;
        if (pAt(b) < -0.5) P.push('selling the break-even ' + b + ' still loses ' + pAt(b));
        if (b > 1 && pAt(b - 1) > 0.5) P.push('selling ' + (b - 1) + ' (below break-even) makes a profit ' + pAt(b - 1));
      }
      const mult = st.sc === 'low' ? 1 - R.range / 100 : st.sc === 'high' ? 1 + R.range / 100 : 1;
      if (n(0) !== 'คาดไว้ ' + fmtN(n0(inp.volume) * mult, 1) + ' ' + u) P.push('break-even note «' + n(0) + '»');
      const pt = B.payS === null ? 'เกิน 5 ปี' : 'เดือนที่ ' + B.payS;
      if (v(1) !== pt) P.push('payback tile ' + v(1) + ' vs ' + pt);
      if (st.sc === 'mid' && v(3) !== (S.profit < -0.005 ? '−' : '') + fmtN(Math.abs(S.profit))) P.push('profit tile ' + v(3) + ' vs ' + S.profit);
      const stk = B.net1 >= 0 ? 'ไม่ขาดเงิน' : fmtN(Math.floor(Math.max(0, B.start) / -B.net1 * 10) / 10, 1) + 'เดือน';
      if (v(2) !== stk) P.push('stuck tile ' + v(2) + ' vs ' + stk);
    }
    /* กราฟ: เส้นเข้ม 1 + จาง 2 */
    const lines = document.querySelectorAll('#cashc path.line').length, ghosts = document.querySelectorAll('#cashc path.line.ghost').length;
    if (lines !== 3 || ghosts !== 2) P.push('chart lines ' + lines + '/' + ghosts);
    /* เงินพอ ถ้า… */
    const E = R.enough, en = document.querySelector('#enough');
    if (!E !== !en) P.push('enough card ' + (en ? 'shown' : 'missing') + ' with enough ' + JSON.stringify(E));
    if (E && en) {
      const rows = [...en.querySelectorAll('.en2')].map(r => [txt(r.querySelector('span')), txt(r.querySelector('b'))]);
      const h = txt(en.querySelector('h3'));
      if (h !== 'เงิน ' + fmtN(E.save) + ' บาท ' + (E.ok ? 'พอ ถ้า' : 'ยังไม่พอ')) P.push('enough heading «' + h + '»');
      if (E.ok !== (R.base.need <= E.save + 1e-6)) P.push('enough ok ' + E.ok + ' but need ' + R.base.need + ' save ' + E.save);
      const w0e = E.minVol === null ? 'ไม่พอ' : fmtN(ceilV(E.minVol)) + u;
      if (!rows[0] || rows[0][1] !== w0e) P.push('enough min sales ' + (rows[0] && rows[0][1]) + ' vs ' + w0e);
      if (E.minVol !== null) {
        /* ขายเท่ายอดนั้นแล้วเงินพอดีพอ · ปัดขึ้นแล้วพอ */
        const nAt = v => opSim({ inp, op: st.op, mult: v / n0(inp.volume) }).need;
        if (nAt(ceilV(E.minVol)) > E.save + 0.5) P.push('selling the enough-minimum ' + ceilV(E.minVol) + ' still needs ' + nAt(ceilV(E.minVol)) + ' > ' + E.save);
        if (E.minVol > 1e-6 && Math.abs(nAt(E.minVol) - E.save) > Math.max(1, E.save * 1e-6)) P.push('enough-minimum ' + E.minVol + ' needs ' + nAt(E.minVol) + ' not ≈ ' + E.save);
      }
      if (rows.length !== (E.ok ? 3 : 1)) P.push('enough rows ' + rows.length + ' with ok ' + E.ok);
      if (E.ok && rows.length === 3) {
        const fb = E.delayCapped ? 'เกิน 5 ปี' : 'เดือนที่ ' + E.fullBy;
        if (rows[1][1] !== fb) P.push('enough full-by ' + rows[1][1] + ' vs ' + fb);
        if (rows[2][1] !== fmtN(E.over) + 'บาท') P.push('enough over ' + rows[2][1] + ' vs ' + fmtN(E.over));
        if (Math.abs(E.over - R.base.left) > 0.01) P.push('enough over ' + E.over + ' ≠ base left ' + R.base.left);
        /* ช้าลงได้อีก delay เดือน: ช้าอีก 1 เดือนต้องไม่พอ */
        if (!E.delayCapped && opSim({ inp, op: st.op, curve: rampDelay(R.curve, E.delay + 1) }).need <= E.save + 1e-6) P.push('enough delay ' + E.delay + ' but one more month still fits');
        if (opSim({ inp, op: st.op, startupMult: 1 + E.over / Math.max(1, R.base.all) }).need > E.save + 1 && R.base.all > 0) P.push('startup over-budget ' + E.over + ' does not fit');
      }
    }
    /* เรียงเรื่องที่ทำให้ใช้เงินเพิ่ม */
    const rk = [...document.querySelectorAll('#sens .rk2')];
    const order = rk.map(r => r.getAttribute('data-sens'));
    if (JSON.stringify(order) !== JSON.stringify(R.sens.map(x => x.k))) P.push('ranking order ' + order + ' vs ' + R.sens.map(x => x.k));
    for (let i = 1; i < R.sens.length; i++) if (R.sens[i].more > R.sens[i - 1].more + 1e-6) P.push('ranking not descending at ' + i + ': ' + R.sens.map(x => Math.round(x.more)));
    const shownMore = rk.map(r => parse(txt(r.querySelector('em'))));
    for (let i = 1; i < shownMore.length; i++) if (shownMore[i] > shownMore[i - 1] + 0.5) P.push('ranking on screen not descending: ' + shownMore);
    const SP = Object.assign({}, SENS_DEF, st.op.sens || {});
    R.sens.forEach((x, i) => {
      if (rk[i] && txt(rk[i].querySelector('em')) !== (x.more >= 0 ? '+' : '−') + fmtN(Math.abs(x.more))) P.push('ranking row ' + x.k + ' shows ' + txt(rk[i].querySelector('em')) + ' vs ' + x.more);
      if (x.p !== SP[x.k]) P.push('ranking ' + x.k + ' tested at ' + x.p + ' vs setting ' + SP[x.k]);
      const o = { over: { startupMult: 1 + SP.over / 100 }, sales: { mult: Math.max(0, 1 - SP.sales / 100) }, delay: { curve: rampDelay(R.curve, Math.round(SP.delay)) }, fixed: { fixedMult: 1 + SP.fixed / 100 }, cost: { costMult: 1 + SP.cost / 100 } }[x.k];
      const more = opSim(Object.assign({ inp, op: st.op }, o)).need - R.base.need;
      if (Math.abs(more - x.more) > 0.01) P.push('ranking ' + x.k + ' more ' + x.more + ' recomputed ' + more);
      if (x.more < -0.01) P.push('ranking ' + x.k + ' makes the shop need less money: ' + x.more);
    });
    /* อยากได้เท่าไร */
    const t = st.op.target || {}, inc = t.income !== null && t.income !== undefined ? t.income : (n0(inp.ownerSalary) > 0 ? n0(inp.ownerSalary) : 15000), mo = pos(t.months) || 12;
    const A = opTarget(R, inc, mo);
    const tgt = [txt(document.querySelector('#ta1 b')), txt(document.querySelector('#ta2 b'))];
    const wt = v => v === null || v === undefined ? 'ไม่ได้' : fmtN(ceilV(v)) + u;
    if (tgt[0] !== wt(A.income)) P.push('target income row ' + tgt[0] + ' vs ' + wt(A.income));
    if (tgt[1] !== wt(A.pay)) P.push('target payback row ' + tgt[1] + ' vs ' + wt(A.pay));
    if (A.income !== null && A.income !== undefined && A.income > 0) {
      const pr = compute(Object.assign({}, inp, { ownerSalary: inc, volume: A.income }), st.model).profit;
      if (Math.abs(pr) > 1) P.push('selling the income target ' + A.income + ' gives profit ' + pr + ' not 0');
    }
    if (A.pay !== null && A.pay !== undefined) {
      const s = opSim({ inp, op: st.op, mult: ceilV(A.pay) / n0(inp.volume) });
      if (s.payS === null || s.payS > mo) P.push('selling the payback target ' + ceilV(A.pay) + ' pays back in ' + s.payS + ' > ' + mo);
    }
    const tv = [...document.querySelectorAll('#target .tv b')].map(txt);
    if (tv[0] !== fmtN(inc) || tv[1] !== fmtN(mo)) P.push('target steppers show ' + tv + ' vs ' + [inc, mo]);
    /* สิ่งที่ตัวเลขบอก */
    const fr = document.querySelectorAll('.flist .frow').length;
    if (fr !== R.finds.length) P.push('findings rows ' + fr + ' vs ' + R.finds.length);
    if (!R.finds.length && !document.querySelector('.block .ok-box')) P.push('no findings and no ok box');
    return P;
  });
  for (const p of out) problem(label, 'numbers: ' + p);
}

/* ---------- ตัวช่วย ---------- */
const S = env => env.page.evaluate(() => { const s = window.__labOpen.state; return { v: s.view, k: s.k, editing: s.editing, sc: s.sc, model: s.model, sample: s.isSample }; });
async function tap(env, sel, wait) { await env.page.click(sel); await env.page.waitForTimeout(wait === undefined ? 80 : wait); }
async function fill(env, sel, v) { await env.page.fill(sel, String(v)); await env.page.waitForTimeout(90); }
async function expectView(env, label, v, k) {
  const s = await S(env);
  if (s.v !== v || (k !== undefined && s.k !== k)) {
    const need = await env.page.evaluate(() => [...document.querySelectorAll('.need-msg')].map(x => (x.closest('[data-need]') || {}).getAttribute('data-need') + ': ' + x.textContent).join(' · ') + ' toast: ' + [...document.querySelectorAll('.toast')].map(x => x.textContent).join(''));
    problem(label, 'expected ' + v + (k !== undefined ? '/' + k : '') + ' got ' + s.v + '/' + s.k + ' ' + need);
    return false;
  }
  return true;
}
const next = (env, w) => tap(env, '#foot [data-act="step-next"]', w === undefined ? 120 : w);
const chip = (env, p, v) => tap(env, `[data-act="pset"][data-path="${p}"][data-v="${v}"]`);
async function fresh(env) {
  await env.page.evaluate(() => { try { sessionStorage.clear(); localStorage.removeItem('lab-theme'); } catch (e) { /* ignore */ } });
  await env.page.goto(TEST_URL);
  await env.page.evaluate(() => document.fonts.ready);
  await env.page.waitForTimeout(60);
}
async function snap(env, name) { if (env.shots) await shot(env.page, 'qa-' + env.tag + '-' + name, true); }
const val = (env, fn, arg) => env.page.evaluate(fn, arg);

/* ---------- หน้าผล: ทุกแบบ เปลี่ยน % ลองปรับ อยากได้เท่าไร ---------- */
async function resultTour(env, L, deep) {
  const { page } = env;
  for (const sc of ['low', 'high', 'mid']) {
    await tap(env, `[data-act="sc"][data-v="${sc}"]`, 60);
    const s = await S(env); if (s.sc !== sc) problem(L, 'scenario ' + sc + ' not selected');
    await check(env, L + ' result ' + sc); await checkNumbers(env, L + ' result ' + sc);
    if (sc === 'low' && deep) await snap(env, 'result-low');
  }
  if (!deep) return;
  /* เปลี่ยน % ที่ใช้ทดสอบ */
  await tap(env, '[data-act="sens-ed"]');
  if (!(await page.$('.sens-ed'))) problem(L, 'sens editor did not open');
  await check(env, L + ' sens editor');
  for (const k of ['over', 'sales', 'delay', 'fixed', 'cost']) {
    const b0 = await val(env, k => (window.__labOpen.state.op.sens || {})[k], k);
    await tap(env, `[data-act="sstep"][data-k="${k}"][data-d="1"]`, 60);
    await tap(env, `[data-act="sstep"][data-k="${k}"][data-d="1"]`, 60);
    const b1 = await val(env, k => [window.__labOpen.state.op.sens[k], document.querySelector(`.rk2[data-sens="${k}"] span`).textContent, (document.activeElement || {}).getAttribute && document.activeElement.getAttribute('data-k')], k);
    const want = (b0 === undefined ? await val(env, k => SENS_DEF[k], k) : b0) + 2;
    if (b1[0] !== want) problem(L, 'sens step ' + k + ' → ' + b1[0] + ' want ' + want);
    if (b1[2] !== k) problem(L, 'sens step ' + k + ' lost focus');
  }
  await checkNumbers(env, L + ' after sens edits');
  /* ขอบล่าง/บน: ขายได้น้อยกว่าที่คาดไม่เกิน 90 · เต็มช้าลงอย่างน้อย 1 */
  for (let i = 0; i < 4; i++) await tap(env, '[data-act="sstep"][data-k="delay"][data-d="-1"]', 30);
  const dmin = await val(env, () => window.__labOpen.state.op.sens.delay);
  if (dmin !== 1) problem(L, 'sens delay floor ' + dmin + ' want 1');
  await check(env, L + ' sens edited');
  await checkNumbers(env, L + ' sens delay 1');
  await tap(env, '[data-act="sens-ed"]');
  if (await page.$('.sens-ed')) problem(L, 'sens editor did not close');
  /* ลองปรับ: ยอดขาย + → คืนค่าเดิม */
  const before = await val(env, () => { const s = window.__labOpen.state, R = window.__labOpen.R0(); return { cu: R.cu, vol: s.inp.volume, price: s.inp.price, need: R.base.need, ramp: JSON.stringify(s.op.ramp), full: R.full, step: +document.querySelector('[data-act="tstep"][data-k="volume"][data-d]:not([data-d^="-"])').getAttribute('data-d'), pstep: +document.querySelector('[data-act="tstep"][data-k="price"]:not([data-d^="-"])').getAttribute('data-d') }; });
  await tap(env, '[data-act="tstep"][data-k="volume"]:not([data-d^="-"])', 200);
  const t1 = await val(env, () => { const s = window.__labOpen.state; const inp = Object.assign({}, s.inp, { volume: s.trial.volume }); const X = opCompute(inp, s.model, s.op); return { trial: s.trial, dl: document.querySelector('#dl4').textContent, tv: document.querySelector('#tv-volume').value, btns: !!document.querySelector('[data-act="t-use"]') && !!document.querySelector('[data-act="t-reset"]'), xneed: X.base.need, real: s.inp.volume, need: window.__labOpen.R0().base.need }; });
  if (!t1.trial || Math.abs(t1.trial.volume - (before.vol + before.step)) > 1e-9) problem(L, 'trial volume + → ' + JSON.stringify(t1.trial) + ' want ' + (before.vol + before.step));
  if (!t1.btns) problem(L, 'trial buttons missing');
  if (t1.real !== before.vol || t1.need !== before.need) problem(L, 'trial changed the real numbers');
  const dn = t1.xneed - before.need;
  if (Math.abs(dn) < 0.5 ? !/เท่าเดิม/.test(t1.dl) : t1.dl.indexOf((dn < 0 ? 'ลดลง ' : 'เพิ่มขึ้น ') + fmtNode(Math.abs(dn))) < 0 || t1.dl.indexOf('เป็น ' + fmtNode(t1.xneed)) < 0) problem(L, 'trial delta «' + t1.dl + '» want change ' + dn + ' to ' + t1.xneed);
  if (dn > 0.5 && before.cu > 0) problem(L, 'selling more needs more money? ' + dn);
  await check(env, L + ' trial volume');
  await snap(env, 'trial');
  await tap(env, '[data-act="t-reset"]', 150);
  const r1 = await val(env, () => { const s = window.__labOpen.state; return { trial: s.trial, dl: document.querySelector('#dl4').textContent, tv: document.querySelector('#tv-volume').value, btns: !!document.querySelector('.tbtns') }; });
  if (r1.trial !== null || !/ลองเปลี่ยนตัวเลข/.test(r1.dl) || r1.btns || Number(r1.tv.replace(/,/g, '')) !== Math.round(before.vol * 100) / 100) problem(L, 'trial reset ' + JSON.stringify(r1) + ' vol ' + before.vol);
  /* ราคา: พิมพ์เอง → คืนค่าเดิม */
  await page.fill('#tv-price', String(Math.round(before.price * 1.5))); await page.waitForTimeout(260);
  const t2 = await val(env, () => ({ trial: window.__labOpen.state.trial, dl: document.querySelector('#dl4').textContent, real: window.__labOpen.state.inp.price }));
  if (!t2.trial || t2.trial.price !== Math.round(before.price * 1.5) || t2.real !== before.price || !/ลดลง|เท่าเดิม/.test(t2.dl)) problem(L, 'typed trial price ' + JSON.stringify(t2));
  await tap(env, '[data-act="t-reset"]', 150);
  /* ราคา + และเต็มช้าลง + → ใช้ค่านี้ */
  await tap(env, '[data-act="tstep"][data-k="price"]:not([data-d^="-"])', 120);
  await tap(env, '[data-act="tstep"][data-k="delay"]:not([data-d^="-"])', 200);
  const t3 = await val(env, () => window.__labOpen.state.trial);
  if (!t3 || t3.delay !== 1 || Math.abs(t3.price - (before.price + before.pstep)) > 1e-9) problem(L, 'trial price+delay ' + JSON.stringify(t3));
  await check(env, L + ' trial price+delay');
  await tap(env, '[data-act="t-use"]', 200);
  const u1 = await val(env, () => { const s = window.__labOpen.state, R = window.__labOpen.R0(); return { trial: s.trial, price: s.inp.price, ramp: s.op.ramp, full: R.full, toast: [...document.querySelectorAll('.toast')].map(x => x.textContent).join(''), btns: !!document.querySelector('[data-act="t-use"]'), menu: s.op.menu }; });
  if (u1.trial !== null || Math.abs(u1.price - (before.price + before.pstep)) > 1e-9 || u1.btns || !/ใช้ค่านี้แล้ว/.test(u1.toast)) problem(L, 'trial use ' + JSON.stringify(u1));
  if (u1.ramp.p !== 'custom' || u1.full !== before.full + 1) problem(L, 'trial use delay 1: ramp ' + JSON.stringify(u1.ramp) + ' full ' + u1.full + ' was ' + before.full);
  if (u1.menu) problem(L, 'menu still on after using a tried price');
  await check(env, L + ' after trial use'); await checkNumbers(env, L + ' after trial use');
  /* อยากได้เท่าไร */
  const g0 = await val(env, () => JSON.stringify(window.__labOpen.state.op.target || {}));
  await tap(env, '[data-act="gstep"][data-k="income"]:not([data-d^="-"])', 80);
  await tap(env, '[data-act="gstep"][data-k="income"]:not([data-d^="-"])', 80);
  await tap(env, '[data-act="gstep"][data-k="months"][data-d^="-"]', 80);
  const g1 = await val(env, () => window.__labOpen.state.op.target);
  const inc0 = await val(env, () => n0(window.__labOpen.state.inp.ownerSalary) > 0 ? n0(window.__labOpen.state.inp.ownerSalary) : 15000);
  const g0o = JSON.parse(g0);
  const incBase = g0o.income !== null && g0o.income !== undefined ? g0o.income : inc0;
  if (g1.income !== incBase + 2000 || g1.months !== (g0o.months || 12) - 1) problem(L, 'target steppers ' + JSON.stringify(g1) + ' from ' + g0);
  await checkNumbers(env, L + ' target edited');
  for (let i = 0; i < 70; i++) { const b = await page.$('[data-act="gstep"][data-k="months"][data-d^="-"]'); await b.click(); }
  await page.waitForTimeout(80);
  const g2 = await val(env, () => window.__labOpen.state.op.target.months);
  if (g2 !== 1) problem(L, 'target months floor ' + g2);
  await check(env, L + ' target 1 month'); await checkNumbers(env, L + ' target 1 month');
}
/* fmtN ของหน้าเว็บ (th-TH) ในฝั่ง node */
function fmtNode(n) { const a = Math.abs(n), d = a < 10 && Math.round(a) !== a ? 1 : 0; return (n < 0 ? '−' : '') + a.toLocaleString('th-TH', { maximumFractionDigits: d }); }

async function askAndPoints(env, L) {
  const { page } = env;
  await tap(env, '#foot [data-act="ask"]', 120);
  if (!(await expectView(env, L + ' ask', 'ask'))) return;
  const list = await val(env, () => opAskList(window.__labOpen.R0(), window.__labOpen.state.where));
  let k = 0, flagged = 0;
  while ((await S(env)).v === 'ask' && k < 8) {
    await check(env, L + ' ask q' + k);
    if (k === 0) await snap(env, 'ask');
    const q = await page.$eval('.ask-ans button', b => b.getAttribute('data-q'));
    if (q !== list[k]) problem(L, 'ask q' + k + ' is ' + q + ' want ' + list[k]);
    const risk = await val(env, q => QB2[q].risk, q);
    const ans = k % 3 === 2 ? (risk === 'yes' ? 'no' : 'yes') : k % 3 === 1 ? 'unsure' : risk;
    if (ans !== (risk === 'yes' ? 'no' : 'yes')) flagged++;
    if (k === 1) {
      /* ข้อก่อนหน้า แล้วกลับมาข้อเดิม */
      await tap(env, '[data-act="q-prev"]', 100);
      const qi = await val(env, () => window.__labOpen.state.qidx);
      if (qi !== 0) problem(L, 'q-prev → ' + qi);
      await tap(env, `.ask-ans button[data-v="${await val(env, q => window.__labOpen.state.answers[q], list[0])}"]`, 320);
    }
    await tap(env, `.ask-ans button[data-v="${ans}"]`, 320); k++;
  }
  if (k !== list.length) problem(L, 'answered ' + k + ' questions, list has ' + list.length);
  if (await expectView(env, L + ' after answers', 'points')) {
    await check(env, L + ' points');
    const pts = await page.$$eval('.point', a => a.length);
    if (pts !== flagged) problem(L, 'answered ' + k + ' (' + flagged + ' flagged) but ' + pts + ' points');
    await snap(env, 'points');
    const b = await page.$('[data-act="tool"]');
    if (b) { await b.click(); await page.waitForTimeout(80); await check(env, L + ' tool toast'); }
    await tap(env, '#foot [data-act="result"]', 150); await expectView(env, L + ' points → result', 'result');
  }
}
async function reviewAll(env, L) {
  const { page } = env;
  await tap(env, '#foot [data-act="review"]', 120);
  if (!(await expectView(env, L + ' review', 'review'))) return;
  await check(env, L + ' review'); await snap(env, 'review');
  const rows = await page.$$eval('.rv-row[data-act="edit"]', a => a.map(b => [b.getAttribute('data-v'), b.getAttribute('data-k')]));
  const want = ['sell', 'vol', 'open', 'ramp', 'fixed', 'fixed', 'su', 'save'];
  if (JSON.stringify(rows.map(r => r[0])) !== JSON.stringify(want)) problem(L, 'review rows ' + rows.map(r => r[0]));
  const before = await val(env, () => JSON.stringify([window.__labOpen.state.inp, window.__labOpen.state.op]));
  for (const [v, k] of rows) {
    await tap(env, `.rv-row[data-act="edit"][data-v="${v}"]` + (k !== null ? `[data-k="${k}"]` : ''), 120);
    const s = await S(env);
    if (s.v !== v || !s.editing || (k !== null && s.k !== +k)) { problem(L, 'edit ' + v + '/' + k + ' → ' + JSON.stringify(s)); continue; }
    if (await page.$('.prog')) problem(L, 'editing ' + v + ' shows the progress dots');
    if (!(await page.$('#foot [data-act="step-done"]'))) problem(L, 'editing ' + v + ' has no เสร็จ button');
    await check(env, L + ' editing ' + v + (k !== null ? k : ''));
    await tap(env, '#foot [data-act="step-done"]', 150);
    await expectView(env, L + ' done ' + v + (k || ''), 'review');
  }
  const after = await val(env, () => JSON.stringify([window.__labOpen.state.inp, window.__labOpen.state.op]));
  if (after !== before) problem(L, 'opening and closing every row changed the numbers');
  await tap(env, '#foot [data-act="result"]', 150); await expectView(env, L + ' review → result', 'result');
}
async function themeToggle(env, L) {
  const { page } = env;
  const th0 = await val(env, () => [document.documentElement.getAttribute('data-theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'), getComputedStyle(document.body).backgroundColor]);
  await tap(env, '.bar [data-act="theme"]');
  const th1 = await val(env, () => [document.documentElement.getAttribute('data-theme'), getComputedStyle(document.body).backgroundColor]);
  if (th1[0] === th0[0] || th1[1] === th0[1]) problem(L, 'theme toggle ' + JSON.stringify([th0, th1]));
  await check(env, L + ' toggled theme');
  await snap(env, 'result-theme');
  await tap(env, '.bar [data-act="theme"]');
  const th2 = await val(env, () => document.documentElement.getAttribute('data-theme'));
  if (th2 !== th0[0]) problem(L, 'theme toggle back → ' + th2);
}

/* ---------- ร้านตัวอย่าง ---------- */
async function sampleFlow(env, k) {
  const { page } = env, L = env.tag + ' sample ' + k;
  await fresh(env);
  await check(env, L + ' start');
  if (k === 'cafe') await snap(env, 'start');
  await tap(env, `[data-act="sample1"][data-k="${k}"]`, 150);
  if (!(await expectView(env, L, 'result'))) return;
  const sk = await val(env, k => { const s = window.__labOpen.state; return [s.sampleKind, s.isSample, s.where, OP_SAMPLES[k].where, OP_SAMPLES[k].m, s.model, (document.querySelector('.banner4') || {}).textContent || '', document.querySelector('.bar .ttl small').textContent]; }, k);
  if (sk[0] !== k || !sk[1] || sk[2] !== sk[3] || sk[5] !== sk[4]) problem(L, 'sample state ' + JSON.stringify(sk));
  if (sk[6].indexOf(await val(env, k => OP_SAMPLES[k].name, k)) < 0 || !/ร้านตัวอย่าง/.test(sk[7])) problem(L, 'sample banner/bar «' + sk[6] + '» «' + sk[7] + '»');
  const shared = await val(env, () => sessionStorage.getItem('lab-shop'));
  if (shared) problem(L, 'sample wrote the shared shop numbers');
  await snap(env, 'sample-' + k);
  await resultTour(env, L, true);
  await askAndPoints(env, L);
  await reviewAll(env, L);
  await themeToggle(env, L);
  /* ใส่ตัวเลขร้านคุณ → หน้าแรก ยังไม่มีร้าน */
  await tap(env, '.banner4 [data-act="mine"]', 150);
  const m = await S(env);
  if (m.v !== 'start' || m.sample || m.model) problem(L, 'mine → ' + JSON.stringify(m));
  await check(env, L + ' after mine');
  flows++;
  console.log('flow ' + L + ' done');
}

/* ---------- กรอกเอง ---------- */
const RAMPS = ['now', 'r3', 'r6', 'honey', 'custom'];
async function ownFlow(env, m, where, su, season, ramp) {
  const { page } = env, L = env.tag + ' own ' + m + '/' + where + '/' + su + '/season-' + season + '/' + ramp;
  await fresh(env);
  await tap(env, `[data-act="where"][data-v="${where}"]`);
  await check(env, L + ' start');
  await tap(env, `[data-act="model"][data-m="${m}"]`, 120);
  if (!(await expectView(env, L, 'sell'))) return;
  const steps = await val(env, () => document.querySelectorAll('.prog i').length);
  if (steps !== 8) problem(L, 'progress dots ' + steps + ' want 8 (fixed steps asked)');
  /* ---- ขายอะไร ราคาเท่าไร ---- */
  const units = await val(env, m => MODELS[m].units, m);
  await chip(env, 'inp.unitLabel', units[1]);
  if ((await val(env, () => window.__labOpen.state.inp.unitLabel)) !== units[1]) problem(L, 'unit chip');
  let wantPrice, wantCost, wantFee;
  if (m === 'unit') {
    await tap(env, '[data-act="mn-on"]');
    await fill(env, '#f-mn-0-name', 'ลาเต้เย็น'); await fill(env, '#f-mn-0-price', 65); await fill(env, '#f-mn-0-cost', 22); await fill(env, '#f-mn-0-share', 60);
    await tap(env, '[data-act="mn-add"]');
    await fill(env, '#f-mn-1-name', 'ครัวซองต์'); await fill(env, '#f-mn-1-price', 75); await fill(env, '#f-mn-1-cost', 38.5); await fill(env, '#f-mn-1-share', 40);
    await tap(env, '[data-act="mn-add"]'); await fill(env, '#f-mn-2-name', 'ลบทิ้ง'); await fill(env, '#f-mn-2-price', 999);
    await tap(env, '[data-act="mn-del"][data-i="2"]');
    wantPrice = 69; wantCost = 28.6;
    const mp = await val(env, () => [window.__labOpen.state.inp.price, window.__labOpen.state.inp.unitCost, document.querySelector('#f-inp-price').value, document.querySelector('#f-inp-price').readOnly, window.__labOpen.state.op.menu.length, !!document.querySelector('#mtot i')]);
    if (mp[0] !== wantPrice || mp[1] !== wantCost || +mp[2] !== wantPrice || !mp[3] || mp[4] !== 2 || !mp[5]) problem(L, 'menu average ' + JSON.stringify(mp));
  } else {
    wantPrice = m === 'resell' ? 290 : 350; wantCost = m === 'resell' ? 130 : 105;
    await fill(env, '#f-inp-price', wantPrice); await fill(env, '#f-inp-unitCost', wantCost);
  }
  const fh = (m === 'unit' && where === 'online') || (m === 'resell' && where !== 'shop');
  if (fh) {
    await tap(env, '[data-act="fh-on"]');
    const [sh, rt] = m === 'unit' ? [40, 32.1] : [60, 20.33];
    await fill(env, '#f-fh-share', sh); await fill(env, '#f-fh-rate', rt);
    wantFee = Math.round(sh * rt) / 100;
    const fv = await val(env, () => [document.querySelector('#f-inp-feePct').value, document.querySelector('#f-inp-feePct').readOnly]);
    if (+fv[0] !== wantFee || !fv[1]) problem(L, 'fee helper shows ' + JSON.stringify(fv) + ' want ' + wantFee);
  } else if (m === 'service' || where === 'shop') { await chip(env, 'inp.feePct', 0); wantFee = 0; }
  else { await fill(env, '#f-inp-feePct', 6); wantFee = 6; }
  const sv = await val(env, () => { const i = window.__labOpen.state.inp; return [i.price, i.unitCost, i.feePct]; });
  if (sv[0] !== wantPrice || sv[1] !== wantCost || Math.abs(sv[2] - wantFee) > 1e-9) problem(L, 'sell numbers ' + sv + ' want ' + [wantPrice, wantCost, wantFee]);
  await check(env, L + ' sell');
  if (m === 'unit' && where === 'online' && env.shots) await snap(env, 'sell-menu-fee');
  await next(env);
  if (!(await expectView(env, L + ' sell → vol', 'vol'))) return;
  /* ---- คาดว่าจะขายได้ ---- */
  const def = await val(env, m => MODELS[m].defPer, m);
  const per = where === 'online' ? (def === 'day' ? 'month' : 'day') : def;
  if (per !== def) await tap(env, `[data-act="per"][data-v="${per}"]`);
  if (per === 'day') await fill(env, '#f-inp-daysOpen', 26);
  else if (await page.$('#f-inp-daysOpen')) problem(L, 'daysOpen shown for per month');
  const vol = per === 'day' ? { unit: 60, resell: 6, service: 10 }[m] : { unit: 1500, resell: 120, service: 250 }[m];
  await fill(env, '#f-inp-volume', vol);
  await check(env, L + ' vol');
  await next(env);
  if (!(await expectView(env, L + ' vol → open', 'open'))) return;
  /* ---- ช่วงเปิดร้าน ---- */
  if (where === 'online') await chip(env, 'op.fit', 0); else if (where === 'both') await chip(env, 'op.fit', 1); else await fill(env, '#f-op-fit', 2);
  const om = { unit: 3, resell: 7, service: 11 }[m];
  await tap(env, `[data-path="op.openMonth"][data-v="${om}"]`);
  await chip(env, 'op.seasonAsked', season);
  if (season === 'yes') {
    if (await page.$('[data-need="ss.highPct"]:not([hidden])')) problem(L, 'high % shown before any high month');
    await tap(env, '[data-act="ss-tog"][data-c="11"]'); await tap(env, '[data-act="ss-tog"][data-c="12"]');
    await tap(env, '[data-act="ss-tog"][data-c="6"]'); await tap(env, '[data-act="ss-tog"][data-c="6"]');
    await tap(env, '[data-act="ss-tog"][data-c="1"]'); await tap(env, '[data-act="ss-tog"][data-c="1"]'); await tap(env, '[data-act="ss-tog"][data-c="1"]');
    const ss = await val(env, () => [window.__labOpen.state.inp.season, document.querySelector('[data-act="ss-tog"][data-c="6"]').getAttribute('data-s'), document.querySelector('[data-act="ss-tog"][data-c="1"]').getAttribute('data-s')]);
    if (JSON.stringify(ss[0].high) !== '[11,12]' || JSON.stringify(ss[0].low) !== '[6]' || ss[1] !== 'low' || ss[2] !== 'n') problem(L, 'season toggles ' + JSON.stringify(ss));
    await fill(env, '#f-ss-highPct', 30); await fill(env, '#f-ss-lowPct', 25);
  } else if (await page.$('[data-act="ss-tog"]')) problem(L, 'season months shown for "no"');
  const opv = await val(env, () => { const s = window.__labOpen.state; return [s.op.fit, s.op.openMonth, s.op.seasonAsked]; });
  if (opv[0] !== (where === 'online' ? 0 : where === 'both' ? 1 : 2) || opv[1] !== om || opv[2] !== season) problem(L, 'open answers ' + opv);
  await check(env, L + ' open');
  if (season === 'yes' && env.shots && m === 'unit') await snap(env, 'open-season');
  await next(env);
  if (!(await expectView(env, L + ' open → ramp', 'ramp'))) return;
  /* ---- ยอดขายเดือนแรก ๆ ---- */
  if (await page.$('.rampv')) problem(L, 'ramp bars shown before choosing');
  await tap(env, `[data-act="ramp"][data-v="${ramp}"]`);
  let wantCurve = ramp === 'custom' ? [0.4, 0.6, 0.8] : await val(env, r => RAMP_PRESETS[r].c, ramp);
  if (ramp === 'custom') {
    await tap(env, '[data-act="rb"][data-m="0"]'); await tap(env, '[data-act="rstep"][data-d="-0.1"]');
    await tap(env, '[data-act="rb"][data-m="4"]'); await tap(env, '[data-act="rstep"][data-d="-0.1"]');
    await tap(env, '[data-act="rlen"][data-d="1"]'); await tap(env, '[data-act="rlen"][data-d="1"]'); await tap(env, '[data-act="rlen"][data-d="-1"]');
    await tap(env, '[data-act="rb"][data-m="2"]'); for (let i = 0; i < 9; i++) await tap(env, '[data-act="rstep"][data-d="0.1"]', 30);
    wantCurve = [0.3, 0.6, 1.5, 1, 0.9, 0.9];
  } else if (ramp === 'honey') {
    /* ปรับแท่งของแบบตั้งต้น → กลายเป็นปรับเอง */
    await tap(env, '[data-act="rb"][data-m="1"]'); await tap(env, '[data-act="rstep"][data-d="0.1"]');
    wantCurve = [0.9, 0.7, 0.7, 0.8, 0.9];
  }
  const rv = await val(env, () => { const s = window.__labOpen.state; return { p: s.op.ramp.p, c: rampCurve(s.op).map(x => Math.round(x * 100) / 100), full: document.querySelector('#rfull').textContent, bars: document.querySelectorAll('.rampv [data-act="rb"]').length, pre: !!document.querySelector('.rampv .rb.pre') }; });
  if (JSON.stringify(rv.c) !== JSON.stringify(wantCurve)) problem(L, 'ramp curve ' + JSON.stringify(rv.c) + ' want ' + JSON.stringify(wantCurve));
  const full = await val(env, c => rampFull(c), wantCurve);
  if (rv.full.indexOf(full <= 1 ? 'ยอดขายเต็มตั้งแต่เดือนแรก' : 'ยอดขายเต็มในเดือนที่ ' + full) !== 0) problem(L, 'ramp full text «' + rv.full + '» want month ' + full);
  if (rv.bars !== Math.max(wantCurve.length + 1, 6)) problem(L, 'ramp bars ' + rv.bars);
  if (rv.pre !== (where !== 'online')) problem(L, 'fit bar ' + rv.pre + ' with fit ' + opv[0]);
  await check(env, L + ' ramp');
  if (ramp === 'custom' && env.shots && m === 'unit') await snap(env, 'ramp-custom');
  await next(env);
  /* ---- ค่าใช้จ่ายทุกเดือน ---- */
  const staff = where === 'shop' ? 1 : 0, rent = where === 'online' ? 0 : 12000;
  if (!(await expectView(env, L + ' → fixed 0', 'fixed', 0))) return;
  if (staff) { await fill(env, '#f-inp-staffCount', 1); await fill(env, '#f-inp-staffSalary', 13000); }
  else { await chip(env, 'inp.staffCount', 0); if (await page.$('[data-need="inp.staffSalary"]:not([hidden])')) problem(L, 'staff salary shown with 0 staff'); }
  if (m === 'service') await chip(env, 'inp.ownerSalary', 0); else await fill(env, '#f-inp-ownerSalary', 15000);
  await check(env, L + ' fixed 0');
  await next(env);
  if (!(await expectView(env, L + ' → fixed 1', 'fixed', 1))) return;
  if (rent) await fill(env, '#f-inp-rent', rent); else await chip(env, 'inp.rent', 0);
  if (where === 'shop') await chip(env, 'inp.marketing', 0); else await fill(env, '#f-inp-marketing', 2000);
  await fill(env, '#f-inp-otherFixed', 5000);
  await check(env, L + ' fixed 1');
  await next(env);
  /* ---- เงินก่อนเปิดร้าน ---- */
  if (!(await expectView(env, L + ' → su', 'su'))) return;
  if (await page.$('[data-act="su-tog"]')) problem(L, 'su chips shown before choosing a mode');
  const fitRent = opv[0] * rent;
  let wantAll;
  if (su === 'items') {
    await chip(env, 'op.mode', 'items');
    const kinds = await val(env, ([m, w]) => suKinds(m, w), [m, where]);
    const chipsShown = await page.$$eval('[data-act="su-tog"]', a => a.map(b => b.getAttribute('data-k')));
    if (JSON.stringify(kinds) !== JSON.stringify(chipsShown)) problem(L, 'su chips ' + chipsShown + ' want ' + kinds);
    const extras = kinds.filter(k => ['tools', 'stock', 'other'].indexOf(k) < 0);
    const pick = [extras[0], 'tools', 'stock', extras[1], 'other'];
    const amts = [24000, 60000, 10000, 5000, 3000];
    const types = await val(env, p => p.map(k => SU_CAT[k].t), pick);
    const wantEquip = amts.reduce((a, v, i) => a + (types[i] === 'equip' || pick[i] === 'other' ? v : 0), 0);
    for (let i = 0; i < pick.length; i++) {
      await tap(env, `[data-act="su-tog"][data-k="${pick[i]}"]`);
      const foc = await val(env, () => document.activeElement && document.activeElement.id);
      if (foc !== 'f-su-' + i + '-' + (pick[i] === 'other' ? 'name' : 'amt')) problem(L, 'su chip ' + pick[i] + ' focus ' + foc);
      if (pick[i] === 'other') {
        await fill(env, `#f-su-${i}-name`, 'ค่าทดลองสูตร');
        await chip(env, `su.${i}.t`, 'equip');
        const y = await val(env, i => window.__labOpen.state.op.items[i].y, i);
        if (y !== 5) problem(L, 'other set to equipment: years ' + y + ' want 5');
        await fill(env, `#f-su-${i}-y`, 2);
      }
      await fill(env, `#f-su-${i}-amt`, amts[i]);
    }
    await fill(env, '#f-su-1-y', 4);
    /* เพิ่มแล้วลบ: ตู้ "อื่น ๆ" ชิ้นที่ 2 */
    await tap(env, '[data-act="su-tog"][data-k="other"]'); await fill(env, `#f-su-${pick.length}-name`, 'ลบทิ้ง'); await fill(env, `#f-su-${pick.length}-amt`, 777);
    await tap(env, `[data-act="su-del"][data-j="${pick.length}"]`);
    const del = await val(env, () => [window.__labOpen.state.op.items.length, [...document.querySelectorAll('.toast')].map(t => t.textContent).join('')]);
    if (del[0] !== pick.length || !/ลบ/.test(del[1])) problem(L, 'su delete ' + JSON.stringify(del));
    /* แตะชิปซ้ำ = เอาออก แล้วแตะอีกครั้งใส่ใหม่ */
    await tap(env, `[data-act="su-tog"][data-k="stock"]`);
    const has = await val(env, () => window.__labOpen.state.op.items.some(x => x.k === 'stock'));
    if (has) problem(L, 'tapping a picked su chip did not remove it');
    await tap(env, `[data-act="su-tog"][data-k="stock"]`); await fill(env, `#f-su-${pick.length - 1}-amt`, 10000);
    wantAll = amts.reduce((a, b) => a + b, 0) + fitRent;
    const tot = await val(env, () => [document.querySelector('#sutot b').textContent, (document.querySelector('#sutyp') || {}).textContent, suTotals(window.__labOpen.state.op, window.__labOpen.state.inp)]);
    if (tot[0] !== fmtNode(wantAll) || Math.abs(tot[2].all - wantAll) > 0.01) problem(L, 'su total ' + tot[0] + ' / ' + tot[2].all + ' want ' + wantAll);
    if (Math.abs(tot[2].equip - wantEquip) > 0.01) problem(L, 'equipment total ' + tot[2].equip + ' want ' + wantEquip + ' (incl. other set to equipment)');
    if (!tot[1] || tot[1].indexOf('อุปกรณ์ ' + fmtNode(wantEquip)) < 0) problem(L, 'type line «' + tot[1] + '»');
    /* สลับเป็นก้อนเดียว: ใส่ยอดรวมจากรายการให้ (ไม่รวมค่าเช่าช่วงตกแต่ง) แล้วสลับกลับ รายการยังอยู่ */
    await chip(env, 'op.mode', 'lump');
    const lp = await val(env, () => [window.__labOpen.state.op.lump, document.querySelector('#f-op-lump').value]);
    if (lp[0] !== wantAll - fitRent) problem(L, 'lump prefilled ' + JSON.stringify(lp) + ' want ' + (wantAll - fitRent));
    await chip(env, 'op.mode', 'items');
    if ((await val(env, () => window.__labOpen.state.op.items.length)) !== pick.length) problem(L, 'items lost after switching modes');
  } else {
    await chip(env, 'op.mode', 'lump');
    if (await page.$('[data-act="su-tog"]')) problem(L, 'su chips shown in lump mode');
    await fill(env, '#f-op-lump', 150000);
    wantAll = 150000 + fitRent;
    const tot = await val(env, () => document.querySelector('#sutot b').textContent);
    if (tot !== fmtNode(wantAll)) problem(L, 'lump total ' + tot + ' want ' + wantAll);
  }
  const fitRow = await page.$('.su2.auto');
  if (!!fitRow !== fitRent > 0) problem(L, 'fit rent row ' + !!fitRow + ' with fit rent ' + fitRent);
  await check(env, L + ' su');
  if (su === 'items' && m === 'unit' && env.shots) await snap(env, 'su-items');
  await next(env);
  if (!(await expectView(env, L + ' su → save', 'save'))) return;
  const savings = su === 'items' ? (where === 'online' ? 90000 : 260000) : 180000;
  await fill(env, '#f-op-savings', savings);
  const strip = await val(env, () => (document.querySelector('#strip .rs-v') || {}).textContent);
  await page.waitForTimeout(600);
  const strip2 = await val(env, () => [document.querySelector('#strip .rs-k').textContent, document.querySelector('#strip .rs-v').textContent, fmtN(window.__labOpen.R0().base.need)]);
  if (strip2[0] !== 'ต้องมีเงินทั้งหมด' || strip2[1] !== strip2[2] + 'บาท') problem(L, 'live strip on save ' + JSON.stringify(strip2) + ' was ' + strip);
  await check(env, L + ' save');
  const btn = await val(env, () => document.querySelector('#foot [data-act="step-next"]').textContent);
  if (!/ดูผล/.test(btn)) problem(L, 'last step button «' + btn + '»');
  await next(env, 150);
  if (!(await expectView(env, L + ' → result', 'result'))) return;
  const inp = await val(env, () => window.__labOpen.state.inp);
  const R = await val(env, () => { const R = window.__labOpen.R0(); return { all: R.base.all, save: R.base.save, fixed: fixedTotal(window.__labOpen.state.inp) }; });
  if (Math.abs(R.all - wantAll) > 0.01 || R.save !== savings) problem(L, 'result startup ' + R.all + ' / savings ' + R.save + ' want ' + wantAll + ' / ' + savings);
  const wantFixed = staff * 13000 + (m === 'service' ? 0 : 15000) + rent + (where === 'shop' ? 0 : 2000) + 5000;
  if (R.fixed !== wantFixed) problem(L, 'fixed total ' + R.fixed + ' want ' + wantFixed);
  if (inp.volumePer !== per || inp.volume !== vol) problem(L, 'volume ' + inp.volume + '/' + inp.volumePer);
  await resultTour(env, L, false);
  if (m === 'unit' && where === 'both' && env.shots) await snap(env, 'own-result-' + su);
  /* แก้ตัวเลขช่วงเปิดร้าน: เปลี่ยนเดือนที่เปิด → ตัวเลขยังตรง */
  await tap(env, '#foot [data-act="review"]');
  await tap(env, '.rv-row[data-v="open"]');
  await tap(env, `[data-path="op.openMonth"][data-v="${om === 12 ? 1 : om + 1}"]`);
  await tap(env, '#foot [data-act="step-done"]', 150);
  await expectView(env, L + ' edit open month', 'review');
  await tap(env, '#foot [data-act="result"]', 150);
  await check(env, L + ' result after edit'); await checkNumbers(env, L + ' result after edit');
  flows++;
  console.log('flow ' + L + ' done');
}

/* ---------- ร้านใหญ่สุด ---------- */
const LONG = ['คาราเมลมัคคิอาโต้เย็นปั่นวิปครีมพิเศษไซซ์', 'SuperLongEnglishProductNameWithoutSpaces', 'ชาเขียวมัทฉะลาเต้นมโอ๊ตหวานน้อยไซซ์ใหญ่มาก'];
const L40 = i => { const s = LONG[i % 3] + LONG[(i + 1) % 3]; return [...s].slice(0, 39).join('') + (i % 10); };
async function stressFlow(env) {
  const { page } = env, L = env.tag + ' stress';
  await fresh(env);
  await tap(env, '[data-act="where"][data-v="both"]');
  await tap(env, '[data-act="model"][data-m="unit"]', 120);
  /* เมนู 8 อย่าง ชื่อ 40 ตัว ราคาหลักล้าน */
  await tap(env, '[data-act="mn-on"]');
  for (let i = 0; i < 8; i++) {
    if (i > 0) await tap(env, '[data-act="mn-add"]', 60);
    await fill(env, `#f-mn-${i}-name`, L40(i));
    await fill(env, `#f-mn-${i}-price`, 1250000 + i * 10000); await fill(env, `#f-mn-${i}-cost`, 400000 + i * 1234.56); await fill(env, `#f-mn-${i}-share`, 12.5);
  }
  const mn = await val(env, () => [window.__labOpen.state.op.menu.map(x => x.name.length), !!document.querySelector('[data-act="mn-add"]')]);
  if (mn[0].some(n => n > 40)) problem(L, 'menu names longer than 40: ' + mn[0]);
  if (mn[1]) problem(L, 'mn-add still offered at 8');
  await fill(env, '#f-inp-feePct', 32.5);
  await check(env, L + ' sell');
  await snap(env, 'stress-sell');
  await next(env);
  await fill(env, '#f-inp-daysOpen', 31); await fill(env, '#f-inp-volume', 3.5);
  await next(env);
  await fill(env, '#f-op-fit', 24); await tap(env, '[data-path="op.openMonth"][data-v="12"]');
  await chip(env, 'op.seasonAsked', 'yes');
  for (let c = 1; c <= 12; c++) { await tap(env, `[data-act="ss-tog"][data-c="${c}"]`, 40); if (c % 2) await tap(env, `[data-act="ss-tog"][data-c="${c}"]`, 40); }
  await fill(env, '#f-ss-highPct', 150); await fill(env, '#f-ss-lowPct', 99);
  await check(env, L + ' open');
  await next(env);
  await tap(env, '[data-act="ramp"][data-v="custom"]');
  for (let i = 0; i < 30; i++) { const b = await page.$('[data-act="rlen"][data-d="1"]:not([disabled])'); if (!b) break; await b.click(); await page.waitForTimeout(25); }
  const rl = await val(env, () => [rampCurve(window.__labOpen.state.op).length, !!document.querySelector('[data-act="rlen"][data-d="1"][disabled]')]);
  if (rl[0] !== 24 || !rl[1]) problem(L, 'custom ramp stops at ' + rl[0] + ' (button disabled ' + rl[1] + ')');
  for (const mm of [0, 7, 23]) { await tap(env, `[data-act="rb"][data-m="${mm}"]`, 40); await tap(env, '[data-act="rstep"][data-d="-0.1"]', 40); }
  await check(env, L + ' ramp 24');
  await snap(env, 'stress-ramp');
  await next(env);
  await fill(env, '#f-inp-staffCount', 250); await fill(env, '#f-inp-staffSalary', 25000); await fill(env, '#f-inp-ownerSalary', 1200000);
  await next(env);
  await fill(env, '#f-inp-rent', 9500000); await fill(env, '#f-inp-marketing', 4500000); await fill(env, '#f-inp-otherFixed', 3800000);
  await next(env);
  await chip(env, 'op.mode', 'items');
  const kinds = await val(env, () => suKinds('unit', 'both'));
  if (kinds.length !== 17) problem(L, 'unit/both su kinds ' + kinds.length);
  for (let j = 0; j < kinds.length; j++) {
    await tap(env, `[data-act="su-tog"][data-k="${kinds[j]}"]`, 50);
    if (kinds[j] === 'other') await fill(env, `#f-su-${j}-name`, L40(j));
    await fill(env, `#f-su-${j}-amt`, 1000000 * (j + 1) + 123456);
  }
  const ni = await val(env, () => window.__labOpen.state.op.items.length);
  if (ni !== 17) problem(L, 'su items ' + ni + ' want 17');
  await check(env, L + ' su 17');
  await snap(env, 'stress-su');
  await next(env);
  await fill(env, '#f-op-savings', 980000000);
  await next(env, 200);
  if (!(await expectView(env, L + ' → result', 'result'))) return;
  await snap(env, 'stress-result');
  await resultTour(env, L, true);
  await askAndPoints(env, L);
  await reviewAll(env, L);
  flows++;
  console.log('flow ' + L + ' done');
}

(async () => {
  for (const [w, h, dark, shots] of [[360, 640, false, false], [390, 844, true, true], [390, 844, false, true]]) {
    const { browser, page, errors } = await open({ w, h, dark });
    const env = { page, errors, errAt: 0, tag: w + (dark ? '-dark' : '-light'), shots };
    const want = l => !process.env.ONLY || new RegExp(process.env.ONLY).test(l);
    try {
      for (const k of ['cafe', 'online', 'salon']) if (want('sample ' + k)) try { await sampleFlow(env, k); } catch (e) { problem(env.tag + ' sample ' + k, 'crashed: ' + e.message.split('\n')[0]); }
      if (want('stress')) try { await stressFlow(env); } catch (e) { problem(env.tag + ' stress', 'crashed: ' + e.message.split('\n')[0]); }
      /* กรอกเอง: ครบทุกคู่ (FULL=1 หรือจอ 390 สว่าง) · จออื่นใช้ชุดย่อที่ยังครอบคลุมทุกคู่ของ (เงินก่อนเปิด × ฤดูกาล) และทุกแบบของยอดขายเดือนแรก ๆ */
      const full = process.env.FULL || (w === 390 && !dark);
      let n = 0;
      for (const m of ['unit', 'resell', 'service'])
        for (const where of ['shop', 'online', 'both']) {
          const i = n++;
          const combos = full ? [['items', 'yes'], ['items', 'no'], ['lump', 'yes'], ['lump', 'no']] : [['items', i % 2 ? 'no' : 'yes'], ['lump', i % 2 ? 'yes' : 'no']];
          combos.forEach((c, j) => c.push(RAMPS[(i * combos.length + j) % RAMPS.length]));
          for (const [su, season, ramp] of combos) {
            const nm = 'own ' + m + '/' + where + '/' + su + '/season-' + season + '/' + ramp;
            if (!want(nm)) continue;
            try { await ownFlow(env, m, where, su, season, ramp); } catch (e) { problem(env.tag + ' ' + nm, 'crashed: ' + e.message.split('\n')[0]); }
          }
        }
    } catch (e) { problem(env.tag, 'crashed: ' + e.message.split('\n')[0]); }
    if (errors.length > env.errAt) problem(env.tag, 'console ' + JSON.stringify(errors.slice(env.errAt, env.errAt + 3)));
    await browser.close();
    console.log('-- ' + env.tag + ' finished at ' + Math.round((Date.now() - T0) / 1000) + 's');
  }
  console.log(flows + ' flows · ' + screens + ' screens checked · ' + Math.round((Date.now() - T0) / 1000) + 's');
  console.log(bad ? bad + ' PROBLEMS' : 'ALL FLOWS OK');
  process.exit(bad ? 1 : 0);
})();
