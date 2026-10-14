/* ตัวเลขถูกต้อง: ตรงกับตัวคำนวณ PL2 · ใบเสร็จรวมได้เท่ากำไรที่เปลี่ยน · เงื่อนไขที่ทำให้คุ้มถึงจุดคุ้มจริง · คืนทุนตรงกับเงินสะสม
   · ค่าที่คิดมือของร้านกาแฟตัวอย่าง · ตัดสินใจแบบ "ไม่เปลี่ยนอะไร" ต้องได้ผลเท่าเดิม · รัน: node tests/unit.js (ต้อง ./build.sh ก่อน) */
const { load, genDec, sampleInp } = require('./cases');
const ctx = load();
const vm = require('vm');
const R = (c) => vm.runInContext(c, ctx);
let fails = 0, checks = 0;
function chk(cond, msg) { checks++; if (!cond) { fails++; console.log('  FAIL', msg); } }
function near(a, b, tol, msg) { chk(a !== null && b !== null && Math.abs(a - b) <= tol, msg + ` (${a} vs ${b})`); }
function ev(inp, m, T, d) { ctx.__x = { inp, m, T, d }; return R('(function(){var E=dEval(__x.inp,__x.m,__x.T,__x.d); if(E.ok) E.conds=dConds(E,__x.inp,__x.m,__x.T,__x.d); return E;})()'); }
function steadyP(inp, m, T, d) { ctx.__x = { inp, m, T, d }; return R('steady(__x.inp,__x.m,__x.T,__x.d).profit'); }

/* 1) ค่าที่คิดด้วยมือ: ร้านกาแฟตัวอย่าง (ราคา 65 ต้นทุน 22 ค่าธรรมเนียม 6% → เหลือแก้วละ 39.1 · ขาย 80 แก้ว/วัน 26 วัน) */
{
  const inp = sampleInp(ctx, 'unit');
  const h = ev(inp, 'unit', 'hire', { count: 1, salary: 12000, gain: 20, capAdd: 40, ramp: 1 });
  near(h.B.profit, 12328, 0.5, 'base profit');
  near(h.delta, 20 * 26 * 39.1 - 12000, 0.5, 'hire delta = 20×26×39.1 − 12,000');
  near(h.conds.find(c => c.id === 'need').value, 12, 0, 'hire need = ceil(12000/39.1/26) = 12');
  near(h.conds.find(c => c.id === 'room').value, 180 - 80, 0, 'room after hire = 140+40−80');
  const c = ev(inp, 'unit', 'channel', { cut: 30, chPrice: 75, chQty: 25, movePct: 20, extraCost: 3, chFee: 1500, ramp: 3 });
  near(c.conds.find(x => x.id === 'unit').value, 75 - 25 - 22.5, 0.01, 'channel profit per cup = 75 − 25 − 22.5');
  near(c.delta, 25 * 26 * 27.5 - 5 * 26 * 39.1 - 1500, 0.5, 'channel delta');
  near(c.conds.find(x => x.id === 'price').value, Math.ceil((39.1 + 25) / 0.7), 0, 'channel equal price = (39.1+25)/0.7');
  near(c.conds.find(x => x.id === 'move').value, Math.floor((25 * 26 * 27.5 - 1500) / (25 * 26 * 39.1) * 100), 0, 'channel max move %');
  const p = ev(inp, 'unit', 'place', { newRent: 26000, salesPct: 20 });
  near(p.delta, 16 * 26 * 39.1 - 8000, 0.5, 'place delta');
  near(p.conds.find(x => x.id === 'rent').value, 26000 + p.delta, 0.01, 'place max rent');
  near(p.conds.find(x => x.id === 'need').value, Math.ceil(80 + 8000 / 39.1 / 26), 0, 'place need volume');
  const e = ev(inp, 'unit', 'equip', { price: 120000, life: 5, eqGain: 15, costDown: 1, fixedChg: 800 });
  near(e.delta, 95 * 26 * 40.1 - 80 * 26 * 39.1 - 800 - 2000, 0.5, 'equip delta incl. depreciation 2,000');
  near(e.payback, 120000 / (95 * 26 * 40.1 - 80 * 26 * 39.1 - 800), 0.01, 'equip payback = price ÷ extra cash');
  const b = ev(inp, 'unit', 'branch', { setup: 400000, bRent: 15000, bStaff: 2, bSalary: 12000, bOther: 8000, bPct: 70 });
  near(b.delta, 56 * 26 * 39.1 - 47000, 0.5, 'branch delta');
  near(b.conds.find(x => x.id === 'need').value, Math.ceil(47000 / (39.1 * 26) / 80 * 100), 0, 'branch need %');
  near(b.payback, 400000 / b.delta, 0.01, 'branch payback (no ramp)');
  near(b.need, 400000 - 30000 - 0, 1, 'branch cash needed at start = 400,000 − 30,000');
}

/* 2) ทุกรูปแบบ × ทุกเรื่อง */
const models = R('MODEL_ORDER'), topics = R('TOPIC_ORDER');
for (const m of models) {
  const inp = sampleInp(ctx, m);
  ctx.__i = inp; ctx.__m = m;
  const base = R('compute(__i, __m)');
  for (const T of topics) {
    ctx.__t = T;
    if (!R('topicOk(__t, __m)')) continue;
    const d = genDec(ctx, T, inp, m);
    const E = ev(inp, m, T, d);
    chk(E.ok, `${m}/${T} not ok`);
    if (!E.ok) continue;
    near(E.B.profit, base.profit, 0.001, `${m}/${T} base profit = ตัวที่ 1`);
    ctx.__d = d;
    near(E.profit, R('JaruaCalc.calculateV4(dBuild(__i,__m,__t,__d,{lv:1,f:1}).v4).netProfitMonthly'), 0.001, `${m}/${T} profit = calculateV4`);
    near(E.ledger.reduce((a, l) => a + l.amount, 0), E.delta, 0.01, `${m}/${T} ledger sums to delta`);
    /* คืนทุน: เงินที่ได้เพิ่มสะสมถึงเงินลงทุนในเดือนที่บอก */
    if (E.one > 0 && E.payback !== null && E.payback <= 12) {
      const t = Math.ceil(E.payback - 1e-9);
      chk(E.rows[t - 1].cumExtra >= E.one - 0.01 && (t === 1 || E.rows[t - 2].cumExtra < E.one), `${m}/${T} payback month ${E.payback}`);
    }
    /* เงินในมือ = เงินเริ่ม − เงินก้อน + เงินเข้าออกสะสม */
    let bal = E.cashStart - E.one;
    E.rows.forEach(w => { bal += w.net; });
    near(E.rows[11].bal, bal, 0.01, `${m}/${T} cash balance`);
    near(E.need, Math.max(0, -Math.min(E.aStart, ...E.rows.map(w => w.bal))), 0.01, `${m}/${T} cash needed`);
    /* เงื่อนไขที่ทำให้คุ้ม: ใส่ตัวเลขตามเงื่อนไขแล้วกำไรไม่ต่ำกว่าตอนนี้ */
    const cur = inp[R('ROLE[__m].vol')] || 0;
    for (const c of E.conds) {
      if (c.value === null || c.value === 0) continue;
      let d2 = null;
      if (c.id === 'need' && (T === 'hire' || T === 'equip')) d2 = Object.assign({}, d, { [T === 'hire' ? 'gain' : 'eqGain']: c.value });
      if (c.id === 'need' && T === 'place') d2 = Object.assign({}, d, { salesPct: (c.value / cur - 1) * 100 });
      if (c.id === 'need' && T === 'channel') d2 = Object.assign({}, d, { chQty: c.value });
      if (c.id === 'need' && T === 'branch') d2 = Object.assign({}, d, { bPct: c.value });
      if (c.id === 'move') d2 = Object.assign({}, d, { movePct: c.value });
      if (c.id === 'rent') d2 = Object.assign({}, d, { newRent: c.value });
      if (!d2) continue;
      const p2 = steadyP(inp, m, T, d2);
      chk(p2 >= base.profit - 1, `${m}/${T} cond ${c.id}=${c.value} gives ${p2.toFixed(1)} < base ${base.profit.toFixed(1)}`);
    }
    /* ถ้าไม่เป็นอย่างที่คาด: แถวแรกเท่ากับผลหลัก */
    ctx.__d = d;
    const S = R('dScenarios(__i,__m,__t,__d)');
    if (S.length) near(S[0].profit, E.profit, 0.001, `${m}/${T} scenario 1 = main`);
    console.log(m.padEnd(12), T.padEnd(8), 'Δ', Math.round(E.delta), '| pay', E.payback === null ? '-' : E.payback.toFixed(1), '| need cash', Math.round(E.need),
      '| conds', E.conds.map(c => c.id + '=' + (c.value === null ? 'x' : Math.round(c.value * 10) / 10)).join(' '), '| scen', S.map(s => Math.round(s.profit)).join('/'));
  }
  /* ตัดสินใจแบบไม่เปลี่ยนอะไร ต้องได้กำไรเท่าเดิม */
  const zero = {
    hire: { count: 1, salary: 0 }, place: { newRent: inp.rent || 0, salesPct: 0 }, channel: { cut: 20, chQty: 0 },
    equip: { price: 0, life: 5 }, branch: { setup: 0, bPct: 0 }
  };
  for (const T of topics) {
    ctx.__t = T; if (!R('topicOk(__t, __m)')) continue;
    const E = ev(inp, m, T, zero[T]);
    chk(E.ok && Math.abs(E.delta) < 0.01, `${m}/${T} no-change delta = ${E.ok && E.delta}`);
  }
}
console.log(`${checks} checks`);
console.log(fails ? fails + ' FAILED' : 'ALL CHECKS PASSED');
process.exit(fails ? 1 : 0);
