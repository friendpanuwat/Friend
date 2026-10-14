/* ตัวเลขถูกต้อง: ตรงกับตัวคำนวณ PL2 · กำไรเปลี่ยนเพราะอะไร รวมได้เท่ากำไรที่เปลี่ยน · จุดคุ้มถึงจุดคุ้มจริง · คืนทุนตรงกับเงินสะสม
   · ค่าที่คิดมือของร้านกาแฟตัวอย่าง · เงินที่จมกับลูกค้าค้างจ่ายและสต็อก · กรณีขอบ (ยิ่งขายยิ่งได้น้อยลง / เต็มกำลัง)
   · ตัดสินใจแบบ "ไม่เปลี่ยนอะไร" ต้องได้ผลเท่าเดิม · รัน: node tests/unit.js (ต้อง ./build.sh ก่อน) */
const { load, genDec, sampleInp } = require('./cases');
const ctx = load();
const vm = require('vm');
const R = (c) => vm.runInContext(c, ctx);
let fails = 0, checks = 0;
function chk(cond, msg) { checks++; if (!cond) { fails++; console.log('  FAIL', msg); } }
function near(a, b, tol, msg) { chk(a !== null && b !== null && a !== undefined && Math.abs(a - b) <= tol, msg + ` (${a} vs ${b})`); }
function ev(inp, m, T, d) { ctx.__x = { inp, m, T, d }; return R('(function(){var E=dEval(__x.inp,__x.m,__x.T,__x.d); if(E.ok){E.conds=dConds(E,__x.inp,__x.m,__x.T,__x.d); E.P=dPivot(__x.inp,__x.m,__x.T,__x.d);} return E;})()'); }
function steadyP(inp, m, T, d) { ctx.__x = { inp, m, T, d }; return R('steady(__x.inp,__x.m,__x.T,__x.d).profit'); }
const cond = (E, id) => E.conds.find(c => c.id === id);

/* 1) ค่าที่คิดด้วยมือ: ร้านกาแฟตัวอย่าง (ราคา 65 ต้นทุน 22 ค่าธรรมเนียม 6% → เหลือแก้วละ 39.1 · ขาย 80 แก้ว/วัน 26 วัน) */
{
  const inp = sampleInp(ctx, 'unit');
  const h = ev(inp, 'unit', 'hire', { count: 1, salary: 12000, gain: 20, capAdd: 40, ramp: 1 });
  near(h.B.profit, 12328, 0.5, 'base profit');
  near(h.delta, 20 * 26 * 39.1 - 12000, 0.5, 'hire delta = 20×26×39.1 − 12,000');
  near(cond(h, 'need').value, 12, 0, 'hire need = ceil(12000/39.1/26) = 12');
  near(h.P.need, 12000 / 39.1 / 26, 0.01, 'hire break-even (unrounded)');
  near(cond(h, 'room').value, 180 - 80, 0, 'room after hire = 140+40−80');
  /* ramp 1 เดือน: เดือนแรกได้ครึ่งเดียว */
  near(h.rows[0].profit - h.rows[0].bProfit, 10 * 26 * 39.1 - 12000, 0.5, 'ramp month 1 = half of expected');
  near(h.rows[1].profit - h.rows[1].bProfit, h.delta, 0.5, 'ramp month 2 = full');
  ctx.__d = { cut: 30, chPrice: 75, chQty: 25, movePct: 20, extraCost: 3, chFee: 1500, ramp: 3 };
  const cu = R("channelUnit(MODELS.unit.sample && " + JSON.stringify(inp) + ", 'unit', __d)");
  near(cu.ch, 75 - 25 - 22.5, 0.01, 'channel profit per cup = 75 − 25 − 22.5');
  near(cu.own, 39.1, 0.01, 'own profit per cup = 39.1');
  near(R("channelEqualPrice(" + JSON.stringify(inp) + ", 'unit', __d)"), Math.ceil((39.1 + 25) / 0.7), 0, 'channel equal price = (39.1+25)/0.7');
  const c = ev(inp, 'unit', 'channel', ctx.__d);
  near(c.delta, 25 * 26 * 27.5 - 5 * 26 * 39.1 - 1500, 0.5, 'channel delta');
  near(cond(c, 'move').value, Math.floor((25 * 26 * 27.5 - 1500) / (25 * 26 * 39.1) * 100), 0, 'channel max move %');
  near(c.P.need, 1500 / (27.5 - 0.2 * 39.1) / 26, 0.01, 'channel break-even orders/day');
  const p = ev(inp, 'unit', 'place', { newRent: 26000, salesPct: 20, moveCost: 0 });
  near(p.delta, 16 * 26 * 39.1 - 8000, 0.5, 'place delta');
  near(cond(p, 'rent').value, 26000 + p.delta, 0.01, 'place max rent');
  near(cond(p, 'need').value, Math.ceil(80 + 8000 / 39.1 / 26), 0, 'place need volume');
  const e = ev(inp, 'unit', 'equip', { price: 120000, life: 5, eqGain: 15, costDown: 1, fixedChg: 800 });
  near(e.delta, 95 * 26 * 40.1 - 80 * 26 * 39.1 - 800 - 2000, 0.5, 'equip delta incl. depreciation 2,000');
  near(e.payback, 120000 / (95 * 26 * 40.1 - 80 * 26 * 39.1 - 800), 0.01, 'equip payback = price ÷ extra cash');
  const b = ev(inp, 'unit', 'branch', { setup: 400000, bRent: 15000, bStaff: 2, bSalary: 12000, bOther: 8000, bPct: 70, ramp: 0 });
  near(b.delta, 56 * 26 * 39.1 - 47000, 0.5, 'branch delta');
  near(cond(b, 'need').value, Math.ceil(47000 / (39.1 * 26) / 80 * 100), 0, 'branch need %');
  near(b.payback, 400000 / b.delta, 0.01, 'branch payback (no ramp, beyond 12 months)');
  near(b.need, 400000 - 30000, 1, 'branch cash needed at start = 400,000 − 30,000');
  /* ลูกค้าจ่ายช้า 30 วัน: ยอดของสาขาทำให้เงินจมกับลูกค้า 1 เดือนของรายได้สาขา (ผู้ตรวจคิดแยกได้ 442,382) */
  const b2 = ev(Object.assign({}, inp, { creditDays: 30 }), 'unit', 'branch', { setup: 400000, bRent: 15000, bStaff: 2, bSalary: 12000, bOther: 8000, bPct: 70, ramp: 0 });
  near(b2.wc, 56 * 26 * 65, 0.5, 'working capital = one month of branch revenue');
  near(b2.need, 442382, 1, 'cash needed with 30 credit days');
  /* กรณีขอบ */
  const n1 = ev(inp, 'unit', 'channel', { cut: 95, chQty: 25, chFee: 0, movePct: 0, extraCost: 0 });
  chk(n1.P.be.kind === 'never' && cond(n1, 'need').status === 'short', 'channel cut 95%: never worth it (not "need 0")');
  const n2 = ev(inp, 'unit', 'channel', { cut: 30, chQty: 25, chFee: 0, movePct: 80, extraCost: 0 });
  chk(n2.delta < 0 && cond(n2, 'need').status === 'short', 'channel 80% cannibalized: flagged short');
  const n3 = ev(Object.assign({}, inp, { unitCost: 70 }), 'unit', 'place', { newRent: 10000, salesPct: 0, moveCost: 0 });
  chk(n3.P.be.kind === 'max' && cond(n3, 'need').status === 'ok', 'negative margin + lower rent: upper bound, ok');
  const n4 = ev(Object.assign(sampleInp(ctx, 'resell'), { rent: 80000 }), 'resell', 'place', { newRent: 5000, salesPct: 0, moveCost: 0 });
  chk(['zero', 'always'].includes(n4.P.be.kind) && cond(n4, 'need').status === 'ok', 'rent cut so large it pays at any sales level');
  const n5 = ev(Object.assign(sampleInp(ctx, 'rental'), { occupancy: 100 }), 'rental', 'hire', { count: 1, salary: 20000, gain: 10 });
  chk(n5.P.be.kind === 'never' && n5.P.be.why === 'flat', 'rental full: cannot add more guests');
  const n6 = ev(sampleInp(ctx, 'commission'), 'commission', 'hire', { count: 1, salary: 12000, gain: 0.25 });
  chk(n6.delta > 0 && cond(n6, 'need').status === 'ok', 'status judged on unrounded need');
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
    if (E.one > 0 && E.payback !== null && E.payback <= 12) {
      const t = Math.ceil(E.payback - 1e-9);
      chk(E.rows[t - 1].cumExtra >= E.one - 0.01 && (t === 1 || E.rows[t - 2].cumExtra < E.one), `${m}/${T} payback month ${E.payback}`);
    }
    let bal = E.cashStart - E.one;
    E.rows.forEach(w => { bal += w.net; });
    near(E.rows[11].bal, bal, 0.01, `${m}/${T} cash balance`);
    near(E.need, Math.max(0, -Math.min(E.aStart, ...E.rows.map(w => w.bal))), 0.01, `${m}/${T} cash needed`);
    /* จุดคุ้ม: ใส่ตัวเลขตามจุดคุ้มที่แสดงแล้วกำไรไม่ต่ำกว่าตอนนี้ */
    const nr = cond(E, 'need');
    if (nr.value !== null && nr.value > 0) {
      const P = E.P;
      const p2 = steadyP(inp, m, T, P.set(d, T === 'place' ? nr.value : nr.value));
      if (P.be.kind === 'value') chk(p2 >= base.profit - 1, `${m}/${T} need ${nr.value} gives ${p2.toFixed(1)} < base ${base.profit.toFixed(1)}`);
      if (P.be.kind === 'max') chk(p2 >= base.profit - 1, `${m}/${T} max ${nr.value} gives ${p2.toFixed(1)} < base`);
      chk(nr.status === ((P.be.kind === 'max' ? P.have <= P.be.x + 1e-6 : P.have >= P.need - 1e-6) ? 'ok' : 'short'), `${m}/${T} need status`);
    }
    for (const c of E.conds) {
      let d2 = null;
      if (c.id === 'move') d2 = Object.assign({}, d, { movePct: c.value });
      if (c.id === 'rent') d2 = Object.assign({}, d, { newRent: c.value });
      if (!d2) continue;
      const p2 = steadyP(inp, m, T, d2);
      chk(p2 >= base.profit - 1, `${m}/${T} cond ${c.id}=${c.value} gives ${p2.toFixed(1)} < base ${base.profit.toFixed(1)}`);
    }
    ctx.__d = d;
    const S = R('dScenarios(__i,__m,__t,__d)');
    const s1 = S.find(s => s.f === 1);
    if (S.length) near(s1 && s1.profit, E.profit, 0.001, `${m}/${T} scenario "as expected" = main`);
    console.log(m.padEnd(12), T.padEnd(8), 'Δ', Math.round(E.delta), '| pay', E.payback === null ? '-' : E.payback.toFixed(1), '| need cash', Math.round(E.need), '| wc', Math.round(E.wc),
      '| conds', E.conds.map(c => c.id + '=' + (c.value === null ? 'x' : Math.round(c.value * 10) / 10) + (c.status ? ':' + c.status : '')).join(' '), '| scen', S.map(s => Math.round(s.profit)).join('/'));
  }
  const zero = {
    hire: { count: 1, salary: 0 }, place: { newRent: inp.rent || 0, salesPct: 0, moveCost: 0 }, channel: { cut: 20, chQty: 0, chFee: 0, movePct: 0, extraCost: 0 },
    equip: { price: 0, life: 5 }, branch: { setup: 0, bPct: 0, bRent: 0, bStaff: 0, bOther: 0, ramp: 0 }
  };
  for (const T of topics) {
    ctx.__t = T; if (!R('topicOk(__t, __m)')) continue;
    const E = ev(inp, m, T, zero[T]);
    chk(E.ok && Math.abs(E.delta) < 0.01 && Math.abs(E.wc) < 0.01, `${m}/${T} no-change delta = ${E.ok && E.delta}`);
  }
}
/* ตัวเลขย่อ */
near(R('fmtCompact(99984) === "99,984" ? 1 : 0'), 1, 0, 'compact below 100k shows full digits');
chk(R('fmtCompact(999600)') === '1 ล้าน', 'compact rounds 9.99 แสน up to 1 ล้าน: ' + R('fmtCompact(999600)'));
chk(R('fmtCompact(-427360)') === '−4.3 แสน', 'compact negative: ' + R('fmtCompact(-427360)'));
console.log(`${checks} checks`);
console.log(fails ? fails + ' FAILED' : 'ALL CHECKS PASSED');
process.exit(fails ? 1 : 0);
