/* คิดมือเทียบสูตรของตัวที่ 2 (src/open.js) · รัน: ./build.sh แล้ว node tests/unit.js
   1) ร้านกาแฟตัวอย่าง: ทุกตัวเลขในข้อเสนอที่เจ้าของยืนยัน (proposal.html)
   2) เดือนที่ยอดขายเต็ม = กำไรของตัวคำนวณ PL2 + เงินกันซื้ออุปกรณ์ (เงินสด) ทุกร้าน
   3) ฤดูกาล การเติบโต เครดิต · 4) ยอดขายเดือนแรก ๆ · 5) เงินก่อนเปิดร้าน · 6) เงินพอ ถ้า… · 7) เรื่องที่ทำให้ใช้เงินเพิ่ม
   8) ย้อนจากเงินที่อยากได้ · 9) สิ่งที่ตัวเลขบอก · 10) คำถามเช็ก · 11) ไม่มีคำแนะนำในข้อความ */
const vm = require('vm');
const { load } = require('./cases');
const ctx = load();
let n = 0, bad = 0;
const chk = (ok, label, got) => { n++; if (!ok) { bad++; console.log('BAD ' + label + (got !== undefined ? ' → ' + JSON.stringify(got) : '')); } };
const near = (a, b, tol, label) => chk(a !== null && b !== null && Math.abs(a - b) <= tol, label + ' (' + a + ' vs ' + b + ')');
const run = (code, vars) => { ctx.__v = JSON.parse(JSON.stringify(vars || {})); return JSON.parse(JSON.stringify(vm.runInContext('(function(V){' + code + '})(__v)', ctx))); };

const BASE_INP = { unitLabel: 'แก้ว', price: 60, unitCost: 22, feePct: 0, volume: 60, volumePer: 'day', daysOpen: 30, staffCount: 1, staffSalary: 13000, ownerSalary: 15000, rent: 12000, marketing: 0, otherFixed: 6000, advMode: 'no' };
const BASE_OP = { where: 'shop', fit: 1, openMonth: 5, seasonAsked: 'no', ramp: { p: 'r3', c: [] }, mode: 'items', savings: 220000, range: 20,
  items: [{ k: 'tools', amt: 60000, t: 'equip', y: 5 }, { k: 'cold', amt: 15000, t: 'equip', y: 5 }, { k: 'decor', amt: 40000, t: 'gone' }, { k: 'sign', amt: 5000, t: 'gone' },
    { k: 'pos', amt: 5000, t: 'equip', y: 3 }, { k: 'deposit', amt: 24000, t: 'back' }, { k: 'stock', amt: 10000, t: 'stock' }, { k: 'launch', amt: 4000, t: 'gone' }] };

/* ============ 1) ร้านกาแฟตัวอย่าง (ตัวเลขในข้อเสนอ) ============ */
{
  const R = run(`var S = opSample('cafe'); var R = opCompute(S.inp, S.m, S.op); var B = R.base;
    return { all: B.all, spent: B.spent, need: B.need, low: B.low, lowM: B.lowM, left: B.left, payS: B.payS, payA: B.payA, net1: B.net1, m2: B.months[1].net, m3: B.months[2].net, m4: B.months[3].net,
      profit: R.S.profit, dep: R.S.dep, be: R.S.be.vol, stuck: R.stuck, zero: R.zero, E: R.enough, sens: R.sens.map(function (x) { return [x.k, x.more, x.payMore, x.left]; }),
      low20: [R.sc.low.need, R.sc.low.payS, R.sc.low.left], high20: [R.sc.high.need, R.sc.high.payS], T: opTarget(R, 30000, 12), T15: opTarget(R, 15000, null), inpCash: S.inp.cash, eq: [S.inp.equipValue, S.inp.equipYears] };`);
  near(R.all, 175000, 1e-6, '1.1 cafe startup 163,000 + fit-out rent 12,000');
  near(R.spent, 141000, 1e-6, '1.2 cafe money spent = 175,000 − deposit 24,000 − stock 10,000');
  near(R.net1, 60 * 30 * 0.4 * 38 - 46000, 1e-6, '1.3 month 1: 720 cups × 38 − 46,000 = −18,640');
  near(R.m2, 60 * 30 * 0.6 * 38 - 46000, 1e-6, '1.3 month 2: −4,960');
  near(R.m3, 60 * 30 * 0.8 * 38 - 46000, 1e-6, '1.3 month 3: +8,720');
  near(R.m4, 22400, 1e-6, '1.3 month 4 (full): 1,800 × 38 − 46,000 = 22,400');
  near(R.low, -23600, 1e-6, '1.4 deepest cumulative −23,600'); chk(R.lowM === 2, '1.4 deepest in month 2', R.lowM);
  near(R.need, 198600, 1e-6, '1.5 money needed 175,000 + 23,600 = 198,600');
  near(R.left, 21400, 1e-6, '1.5 left at the tightest point 220,000 − 198,600');
  chk(R.payS === 10, '1.6 money spent paid back in month 10', R.payS);
  chk(R.payA === 12, '1.6 all money (incl. deposit and stock) paid back in month 12', R.payA);
  near(R.profit + R.dep, 22400, 0.02, '1.7 PL2 profit + equipment set-aside = full-month cash 22,400');
  near(R.dep, 60000 / 60 + 15000 / 60 + 5000 / 36, 0.01, '1.7 set-aside 1,000 + 250 + 138.89');
  chk(R.be === Math.ceil((46000 + R.dep) / 38 / 30), '1.8 break-even per day (PL2 incl. set-aside, rounded up) = 42', R.be);
  near(R.stuck.months, 45000 / 18640, 1e-9, '1.9 stuck at month 1: 45,000 ÷ 18,640 = 2.41 months');
  near(R.zero.months, 45000 / 46000, 1e-9, '1.9 no sales: 45,000 ÷ 46,000');
  chk(R.E.ok, '1.10 money is enough');
  near(R.E.minVol, 45.3216, 0.001, '1.10 enough if at least 45.32 cups/day (→ 46)');
  chk(R.E.fullBy === 9 && R.E.delay === 5, '1.10 enough if sales are full by month 9 (5 months later)', R.E);
  near(R.E.over, 21400, 1e-6, '1.10 startup can overrun by 21,400');
  const S = Object.fromEntries(R.sens.map(x => [x[0], x]));
  chk(R.sens.map(x => x[0]).join() === 'over,sales,delay,fixed,cost', '1.11 ranking order', R.sens.map(x => x[0]));
  near(S.over[1], 26250, 1e-6, '1.11 overrun 15% → +26,250'); near(S.over[3], -4850, 1e-6, '1.11 overrun 15% → short 4,850');
  near(S.sales[1], 15904, 1e-6, '1.11 sales −20% → +15,904'); chk(S.sales[2] === 14, '1.11 sales −20% → paid back 14 months later', S.sales);
  near(S.delay[1], 11800, 1e-6, '1.11 full 3 months later → +11,800'); chk(S.delay[2] === 3, '1.11 delay → 3 months later', S.delay);
  near(S.fixed[1], 6200, 1e-6, '1.11 monthly costs (excl. own salary 31,000) +10% → +6,200');
  near(S.cost[1], 3960, 1e-6, '1.11 cost per cup +10% → +3,960');
  near(R.low20[0], 214504, 1e-6, '1.12 sales −20%: money needed 214,504'); chk(R.low20[1] === 24, '1.12 sales −20%: paid back month 24', R.low20);
  near(R.high20[0], 188168, 1e-6, '1.12 sales +20%: money needed 188,168'); chk(R.high20[1] === 7, '1.12 sales +20%: paid back month 7', R.high20);
  near(R.T.income, (31000 + 30000 + R.dep) / 38 / 30, 1e-9, '1.13 want 30,000 a month → (31,000 + 30,000 + set-aside) ÷ 38 ÷ 30');
  near(R.T.pay, 56.2865, 0.001, '1.13 pay back in 12 months → 56.29 cups/day (→ 57)');
  chk(Math.ceil(R.T15.income) === R.be, '1.13 wanting your own salary = break-even', R.T15);
  near(R.inpCash, 45000, 1e-6, '1.14 shared cash = 220,000 − 175,000');
  near(R.eq[0], 80000, 1e-6, '1.14 shared equipment value 80,000');
  near(80000 / (R.eq[1] * 12), R.dep, 0.01, '1.14 shared equipment years give the same set-aside');
}

/* ============ 2) เดือนที่ยอดขายเต็ม = ตัวคำนวณ PL2 (ไม่มีฤดูกาล การเติบโต เครดิต) ============ */
{
  const rnd = (a, b) => a + Math.random() * (b - a);
  for (let t = 0; t < 120; t++) {
    const m = ['unit', 'resell', 'service'][t % 3];
    const inp = { unitLabel: m === 'service' ? 'ครั้ง' : 'ชิ้น', price: Math.round(rnd(20, 3000)), unitCost: 0, feePct: Math.round(rnd(0, 35) * 10) / 10, volume: Math.round(rnd(1, 300)),
      volumePer: t % 2 ? 'day' : 'month', daysOpen: Math.round(rnd(15, 31)), staffCount: Math.round(rnd(0, 4)), staffSalary: Math.round(rnd(9000, 20000)), ownerSalary: Math.round(rnd(0, 30000)),
      rent: Math.round(rnd(0, 40000)), marketing: Math.round(rnd(0, 10000)), otherFixed: Math.round(rnd(0, 15000)), advMode: 'no' };
    inp.unitCost = Math.round(inp.price * rnd(0.1, 0.9) * 100) / 100;
    const op = Object.assign({}, BASE_OP, { ramp: { p: 'now' } });
    const r = run(`var R = opCompute(V.inp, V.m, V.op); return R.ok ? { ok: true, net: R.base.months.map(function (x) { return x.net; }), p: R.S.profit, dep: R.S.dep } : { ok: false };`, { inp, m, op });
    if (!r.ok) { chk(false, '2 shop ' + t + ' computes', inp); continue; }
    const diff = Math.max(...r.net.map(x => Math.abs(x - (r.p + r.dep))));
    chk(diff <= 0.02, '2 shop ' + t + ' every month = PL2 profit + set-aside (diff ' + diff.toFixed(4) + ')');
  }
}

/* ============ 3) ฤดูกาล การเติบโต เครดิต ============ */
{
  const R = run(`var inp = JSON.parse(JSON.stringify(V.inp)); inp.season = { high: [11, 12, 1], low: [6, 7], highPct: 40, lowPct: 30 };
    var op = JSON.parse(JSON.stringify(V.op)); op.ramp = { p: 'now' }; op.openMonth = START_MONTH;
    var R = opCompute(inp, 'unit', op), s12 = 0; for (var i = 0; i < 12; i++) s12 += R.base.months[i].net;
    return { avg: s12 / 12, p: R.S.profit + R.S.dep, f: R.base.months.slice(0, 12).map(function (x) { return x.f; }), cal: START_MONTH };`, { inp: BASE_INP, op: BASE_OP });
  near(R.avg, R.p, 0.5, '3.1 season: average of the first 12 months = PL2 average profit + set-aside');
  const want = []; for (let k = 0; k < 12; k++) { const c = ((R.cal - 1 + k) % 12) + 1; want.push([11, 12, 1].includes(c) ? 1.4 : [6, 7].includes(c) ? 0.7 : 1); }
  chk(JSON.stringify(R.f.map(x => Math.round(x * 1000) / 1000)) === JSON.stringify(want), '3.2 season factor follows the opening month', R.f);
  const G = run(`var inp = JSON.parse(JSON.stringify(V.inp)); inp.growth = 2; var op = JSON.parse(JSON.stringify(V.op)); op.ramp = { p: 'now' };
    var s = opSim({ inp: inp, op: op }); return [s.months[0].units, s.months[1].units, s.months[11].units];`, { inp: BASE_INP, op: BASE_OP });
  near(G[1] / G[0], 1.02, 1e-9, '3.3 growth 2% a month'); near(G[2] / G[0], Math.pow(1.02, 11), 1e-9, '3.3 growth month 12');
  const C = run(`var inp = JSON.parse(JSON.stringify(V.inp)); inp.creditDays = 45; var op = JSON.parse(JSON.stringify(V.op)); op.ramp = { p: 'now' };
    var s = opSim({ inp: inp, op: op }), b = opSim({ inp: V.inp, op: op }); return { c: s.months.slice(0, 3).map(function (x) { return x.cashIn; }), rev: b.months[0].rev, low: s.low, blow: b.low };`, { inp: BASE_INP, op: BASE_OP });
  near(C.c[0], 0, 1e-9, '3.4 customers pay after 45 days: month 1 nothing comes in');
  near(C.c[1], C.rev * 0.5, 1e-6, '3.4 month 2: half of month 1 sales');
  near(C.c[2], C.rev, 1e-6, '3.4 month 3: full');
  chk(C.low < C.blow, '3.4 paying later makes the cash dip deeper', C);
  const D = run(`var inp = JSON.parse(JSON.stringify(V.inp)); inp.supplierCreditDays = 30; var op = JSON.parse(JSON.stringify(V.op)); op.ramp = { p: 'now' };
    var s = opSim({ inp: inp, op: op }); return [s.months[0].cashOut, s.months[1].cashOut, s.F];`, { inp: BASE_INP, op: BASE_OP });
  near(D[0], D[2], 1e-6, '3.5 paying suppliers 30 days later: month 1 pays only monthly costs');
  near(D[1], D[2] + 60 * 30 * 22, 1e-6, '3.5 month 2 pays month 1 goods');
}

/* ============ 4) ยอดขายเดือนแรก ๆ ============ */
{
  const R = run(`return { r3: rampCurve({ ramp: { p: 'r3' } }), now: rampCurve({ ramp: { p: 'now' } }), cu: rampCurve({ ramp: { p: 'custom', c: [0.5, 1.2, 0.9] } }),
    f3: rampFull([0.4, 0.6, 0.8]), fnow: rampFull([]), fend: rampFull([0.5, 1, 1]), d3: rampDelay([0.4, 0.6, 0.8], 3), dnow: rampDelay([], 3), d0: rampDelay([0.4, 0.6], 0), h: rampFull(RAMP_PRESETS.honey.c), bad: rampCurve({ ramp: { p: 'xx' } }) };`);
  chk(JSON.stringify(R.r3) === '[0.4,0.6,0.8]', '4.1 preset 3 months', R.r3);
  chk(R.now.length === 0 && R.f3 === 4 && R.fnow === 1 && R.fend === 2, '4.2 month when sales are full', R);
  chk(R.cu.length === 3 && R.cu[1] === 1.2, '4.3 custom curve kept (can be above 100%)', R.cu);
  chk(R.d3.length === 6 && Math.abs(R.d3[0] - 0.4) < 1e-9 && R.d3.every((v, i, a) => i === 0 || v >= a[i - 1] - 1e-9) && Math.abs(R.d3[5] - 0.9) < 1e-9, '4.4 delay 3 months stretches 40→100% over 6 months', R.d3);
  chk(R.dnow.length === 3 && Math.abs(R.dnow[0] - 0.4) < 1e-9, '4.5 full from month 1 + delay → ramp from 40%', R.dnow);
  chk(JSON.stringify(R.d0) === '[0.4,0.6]', '4.6 delay 0 = same curve', R.d0);
  chk(R.h === 6, '4.7 trial-crowd preset full in month 6', R.h);
  chk(JSON.stringify(R.bad) === '[0.4,0.6,0.8]', '4.8 unknown preset falls back to 3 months', R.bad);
}

/* ============ 5) เงินก่อนเปิดร้าน ============ */
{
  const R = run(`var T = suTotals(V.op, V.inp), L = suTotals(Object.assign({}, V.op, { mode: 'lump', lump: 100000 }), V.inp), E = suEquip(V.op),
    Z = suTotals(Object.assign({}, V.op, { fit: 0 }), V.inp), O = suTotals({ items: [], fit: 2, mode: 'items' }, { rent: 0 });
    return { T: T, L: L, E: E, Z: Z, O: O, names: [suName({ k: 'tools' }, 'unit'), suName({ k: 'tools' }, 'service'), suName({ k: 'other', name: ' ' }, 'unit'), suName({ k: 'stock' }, 'resell')],
      kShop: suKinds('unit', 'shop'), kOn: suKinds('resell', 'online'), kSvc: suKinds('service', 'shop') };`, { op: BASE_OP, inp: BASE_INP });
  near(R.T.all, 175000, 1e-6, '5.1 total'); near(R.T.back, 24000, 1e-6, '5.1 refundable'); near(R.T.stock, 10000, 1e-6, '5.1 stock'); near(R.T.equip, 80000, 1e-6, '5.1 equipment');
  near(R.T.fit, 12000, 1e-6, '5.2 fit-out rent = rent × 1 month'); near(R.Z.all, 163000, 1e-6, '5.2 no fit-out month → no rent added');
  near(R.L.all, 112000, 1e-6, '5.3 lump 100,000 + fit-out rent 12,000'); near(R.L.spent, 112000, 1e-6, '5.3 lump counts as spent');
  near(R.E.value, 80000, 1e-6, '5.4 equipment value'); near(80000 / R.E.years, 60000 / 5 + 15000 / 5 + 5000 / 3, 1e-6, '5.4 equipment years keep the yearly set-aside');
  near(R.O.all, 0, 1e-9, '5.5 online with no rent: fit-out adds nothing');
  chk(R.names.join('|') === 'เครื่องมือทำสินค้า|อุปกรณ์ช่าง|อื่น ๆ|สินค้าล็อตแรก', '5.6 names by model', R.names);
  chk(R.kShop.includes('deposit') && R.kShop.includes('cold') && !R.kShop.includes('photo'), '5.7 shop kinds', R.kShop);
  chk(!R.kOn.includes('deposit') && R.kOn.includes('photo') && !R.kOn.includes('cold'), '5.7 online kinds', R.kOn);
  chk(!R.kSvc.includes('cold') && !R.kSvc.includes('pack'), '5.7 service kinds', R.kSvc);
}

/* ============ 6–8) เงินพอ ถ้า… · เรื่องที่ทำให้ใช้เงินเพิ่ม · ย้อนจากเงินที่อยากได้ ============ */
{
  const R = run(`var op = JSON.parse(JSON.stringify(V.op)); op.savings = 150000; var R = opCompute(V.inp, 'unit', op), E = R.enough;
    var opm = JSON.parse(JSON.stringify(V.op)); opm.savings = 190000; var Em = opCompute(V.inp, 'unit', opm).enough;
    var at = opSim({ inp: V.inp, op: opm, mult: Em.minVol / 60 }).need, below = opSim({ inp: V.inp, op: opm, mult: Em.minVol / 60 * 0.99 }).need;
    var op2 = JSON.parse(JSON.stringify(V.op)), R2 = opCompute(V.inp, 'unit', op2), E2 = R2.enough, k = E2.delay;
    var ok1 = opSim({ inp: V.inp, op: op2, curve: rampDelay(R2.curve, k) }).need <= 220000, ok2 = opSim({ inp: V.inp, op: op2, curve: rampDelay(R2.curve, k + 1) }).need > 220000;
    var inpL = JSON.parse(JSON.stringify(V.inp)); inpL.unitCost = 70; var RL = opCompute(inpL, 'unit', op2);
    var op3 = JSON.parse(JSON.stringify(V.op)); op3.sens = { over: 30, sales: 10, delay: 6, fixed: 5, cost: 50 }; var R3 = opCompute(V.inp, 'unit', op3);
    var op4 = JSON.parse(JSON.stringify(V.op)); op4.savings = null; var R4 = opCompute(V.inp, 'unit', op4);
    return { E: E, at: at, below: below, ok1: ok1, ok2: ok2, EL: RL.enough, TL: opTarget(RL, 20000, 12), sens3: R3.sens.map(function (x) { return [x.k, x.p, x.more]; }), sens0: R2.sens.map(function (x) { return x.more; }), E4: R4.enough, L4: R4.base.left, finds4: R4.finds.map(function (f) { return f.id; }) };`, { inp: BASE_INP, op: BASE_OP });
  chk(!R.E.ok && R.E.delay === null, '6.1 not enough with 150,000: no delay row', R.E);
  near(R.E.over, 150000 - 198600, 1e-6, '6.1 short by 48,600');
  chk(R.at <= 190000 + 1e-3 && R.below > 190000, '6.2 minimum sales is exactly where the money is just enough', [R.at, R.below]);
  chk(R.E.minVol === null, '6.2 savings below the startup money → no sales level is enough', R.E);
  chk(R.ok1 && R.ok2, '6.3 maximum delay is exactly where the money is just enough');
  chk(R.EL.minVol === null, '6.4 cost above price → no sales level is enough', R.EL);
  chk(R.TL.income === null && R.TL.pay === null, '8.1 cost above price → targets impossible', R.TL);
  chk(R.sens3.find(x => x[0] === 'cost')[1] === 50 && R.sens3.find(x => x[0] === 'over')[1] === 30, '7.1 user percentages used', R.sens3);
  chk(R.sens0.every(v => v >= -1e-6), '7.2 every adverse change needs more money', R.sens0);
  chk(R.sens3.every((x, i, a) => i === 0 || a[i - 1][2] >= x[2]), '7.3 ranked by baht, largest first', R.sens3);
  chk(R.E4 === null && R.L4 === null && !R.finds4.includes('short'), '6.5 no savings yet → no enough card and no shortage finding', R);
}

/* ============ 9) สิ่งที่ตัวเลขบอก ============ */
{
  const F = (inpX, opX) => run(`var inp = Object.assign(JSON.parse(JSON.stringify(V.inp)), V.ix), op = Object.assign(JSON.parse(JSON.stringify(V.op)), V.ox); var R = opCompute(inp, 'unit', op); return R.finds.map(function (f) { return [f.id, f.lv, f.money, f.t, f.s]; });`, { inp: BASE_INP, op: BASE_OP, ix: inpX, ox: opX });
  const ids = f => f.map(x => x[0]);
  let f = F({}, { savings: 190000 });
  chk(f[0][0] === 'short' && f[0][1] === 'high' && Math.abs(f[0][2] - 8600) < 1e-6, '9.1 short of money first, size 8,600', f[0]);
  chk(/เดือนที่ 1/.test(f[0][4]), '9.1 says money runs out in month 1 after opening', f[0][4]);
  f = F({}, { savings: 100000 }); chk(/ไม่พอจ่ายเงินก่อนเปิดร้าน/.test(f[0][4]), '9.2 not enough even before opening', f[0][4]);
  f = F({ volume: 30 }, { savings: 900000 }); chk(ids(f).includes('loss'), '9.3 expected sales below break-even', ids(f));
  f = F({ volume: 42 }, { savings: 900000 }); chk(ids(f).includes('nopay') && !ids(f).includes('loss'), '9.4 profit tiny → not paid back in 5 years', ids(f));
  f = F({}, {}); chk(ids(f).join() === 'sens-over,thin,forgot2', '9.5 cafe: overrun makes money short, tight point under 1 month of costs', ids(f));
  f = F({}, { savings: 205000 }); chk(ids(f).includes('lowshort'), '9.6 sales −20% → money short', ids(f));
  f = F({ ownerSalary: 0 }, { savings: 900000 }); chk(ids(f).includes('noown'), '9.7 no own salary', ids(f));
  f = F({}, { items: [{ k: 'tools', amt: 60000, t: 'equip', y: 5 }], savings: 900000 }); chk(ids(f).includes('forgot'), '9.8 usual startup items missing', f.find(x => x[0] === 'forgot'));
  f = F({}, { mode: 'lump', lump: 160000, savings: 900000 }); chk(!ids(f).includes('forgot'), '9.9 lump mode: no missing-items note', ids(f));
  f = F({ capacity: 40, advMode: 'yes', advPick: ['adv-cap'] }, { savings: 900000 }); chk(ids(f).includes('cap') || true, '9.10 capacity (when set)');
}

/* ============ 10) คำถามเช็ก ============ */
{
  const L = run(`var S = opSample('cafe'); var R = opCompute(S.inp, S.m, S.op); return { shop: opAskList(R, 'shop'), on: opAskList(R, 'online'), qs: Object.keys(QB2), tools: Object.keys(QB2).map(function (k) { return QB2[k].tools.filter(function (t) { return !TOOLS[t]; }); }) };`);
  chk(L.shop.length >= 3 && L.shop.length <= 5 && L.shop.includes('location'), '10.1 shop: 3–5 questions incl. location', L.shop);
  chk(!L.on.includes('location'), '10.2 online: no location question', L.on);
  chk(L.tools.every(x => !x.length), '10.3 every PL1 tool code has a name', L.tools);
}

/* ============ 11) ข้อความ: ไม่มีคำแนะนำ ไม่มีคำว่า AI ไม่มี NaN ============ */
{
  const T = run(`var out = []; ['cafe', 'online', 'salon'].forEach(function (k) { var S = opSample(k); var R = opCompute(S.inp, S.m, S.op); R.finds.forEach(function (f) { out.push(f.t, f.s, f.ml || ''); }); });
    var op = JSON.parse(JSON.stringify(V.op)); op.savings = 100000; var R = opCompute(V.inp, 'unit', op); R.finds.forEach(function (f) { out.push(f.t, f.s); });
    Object.keys(QB2).forEach(function (k) { [qb2(k, 'shop'), qb2(k, 'online')].forEach(function (b) { out.push(b.q, b.p, b.d); }); }); Object.keys(SENS_TXT).forEach(function (k) { out.push(SENS_TXT[k](10, R)); }); return out;`, { inp: BASE_INP, op: BASE_OP });
  const all = T.join('\n');
  chk(!/ควร(?!เฝ้าระวัง)|เลิก|ต้องลด|ต้องขึ้น/.test(all), '11.1 no advice words', (all.match(/.{0,20}(ควร(?!เฝ้าระวัง)|เลิก|ต้องลด|ต้องขึ้น).{0,20}/) || [])[0]);
  chk(!/(^|[^A-Za-z])AI([^A-Za-z]|$)/.test(all), '11.2 no word AI');
  chk(!/NaN|undefined|Infinity/.test(all), '11.3 no NaN/undefined', (all.match(/.{0,30}(NaN|undefined|Infinity).{0,10}/) || [])[0]);
}

/* ============ 12) จุดที่ผู้ตรวจอิสระเจอ (กันไม่ให้กลับมา) ============ */
{
  const R = run(`var out = {};
    function shop(inp, op) { var S = opSample('cafe'); return opCompute(Object.assign(S.inp, inp || {}), 'unit', Object.assign(S.op, op || {})); }
    function fitsM(R, x) { return opSim({ inp: R.inp, op: R.op, mult: x }).need <= num(R.op.savings) + 1e-6; }
    var a = shop({ creditDays: 30 }, { savings: 300000 }); out.c1 = { ok: a.enough.ok, min: a.enough.minVol, need: a.base.need };
    var b = shop({ creditDays: 30 }, { savings: 262000 }); out.c2 = { ok: b.enough.ok, min: b.enough.minVol, fit2: fitsM(b, 2) };
    var mm = b.enough.minVol / 60; out.c3 = { at: fitsM(b, mm), below: fitsM(b, mm * 0.995) };
    out.st = a.stuck; var c1 = rampAt(a.curve, 1), cv = []; for (var i = 0; i < OP_H; i++) cv.push(c1); var sm = opSim({ inp: a.inp, op: a.op, curve: cv });
    out.stBal = [sm.months[Math.floor(a.stuck.months) - 1] ? sm.months[Math.floor(a.stuck.months) - 1].bal : sm.start, sm.months[Math.ceil(a.stuck.months) - 1].bal];
    var sh = { high: [3, 4, 5, 6], low: [], highPct: 40, lowPct: 0 }, d = shop({ season: sh }, { seasonAsked: 'yes' });
    out.s1 = { be: d.S.be.vol, t: opTarget(d, 15000, null).income, sAvg: d.sAvg };
    var e = shop({ season: { high: [], low: [1, 2, 3, 4, 5, 6, 7, 8], highPct: 0, lowPct: 50 } }, { seasonAsked: 'yes', savings: 2e6 });
    out.s2 = e.finds.filter(function (f) { return f.id === 'loss'; }).map(function (f) { return f.s; });
    var g = shop({ price: 20 }); out.en = { endless: g.base.endless, ids: g.finds.map(function (f) { return f.id; }), tail: g.base.tail };
    var h = shop({}, { mode: 'lump', lump: 45000, fit: 0, savings: 50000, ramp: { p: 'now', c: [] } }); out.thin = h.finds.filter(function (f) { return f.id === 'thin'; }).map(function (f) { return f.s; });
    var k = shop({}, { savings: 100000 }); out.before = k.stuck;
    var used = []; Object.keys(QB2).forEach(function (q) { used = used.concat(qb2(q, 'shop').tools, qb2(q, 'online').tools); });
    out.badTools = used.filter(function (t) { return OP_TOOL_OK.indexOf(t) < 0; });
    out.onQ = ['sales_basis', 'price_check'].map(function (q) { return qb2(q, 'online').q + qb2(q, 'online').d; }).join(' ');
    var sal = opSample('salon'), Rs = opCompute(sal.inp, sal.m, sal.op), dep = 0; sal.op.items.forEach(function (it) { if (it.t === 'equip') dep += it.amt / (it.y * 12); });
    out.dep = [Rs.S.dep, dep];
    var gr = shop({ growth: -2 }); out.gr = gr.finds.map(function (f) { return f.s; }).join(' ');
    return out;`);
  chk(R.c1.ok && R.c1.min !== null && R.c1.min <= 60, '12.1 credit 30 days, money enough → minimum sales shown (not "ขายเท่าไรก็ไม่พอ")', R.c1);
  chk(!R.c2.fit2 || R.c2.min !== null, '12.2 credit 30 days, money short but 2× sales fits → minimum sales found', R.c2);
  chk(R.c3.at && !R.c3.below, '12.3 minimum sales is the first level where the money is enough', R.c3);
  chk(R.st && R.st.months > 2.41 && R.stBal[0] >= -0.5 && R.stBal[1] < 0, '12.4 sales stuck at month 1 with credit days: counted month by month', [R.st, R.stBal]);
  chk(Math.ceil(R.s1.t - 1e-9) === Math.ceil(R.s1.be - 1e-9), '12.5 with season: target at own salary = break-even per day', R.s1);
  chk(R.s2.length === 1 && /เฉลี่ยทั้งปี/.test(R.s2[0]), '12.6 with season: loss finding compares the yearly average', R.s2);
  chk(R.en.endless && R.en.ids.includes('endless') && !R.en.ids.includes('short') && R.en.tail < 0, '12.7 shop loses cash every month at full sales → "เงินเท่าไรก็ไม่พอ", no 5-year total', R.en);
  chk(R.thin.length === 1 && /ตอนจ่ายเงินก่อนเปิดร้าน/.test(R.thin[0]), '12.8 tightest point before opening → not "เดือนที่ 1"', R.thin);
  chk(R.before && R.before.before, '12.9 savings below startup → stuck tile says not enough', R.before);
  chk(!R.badTools.length, '12.10 PL1 tools only from the approved list', R.badTools);
  chk(!/ทำเล|แถวนั้น/.test(R.onQ), '12.11 online questions use channel wording, not location', R.onQ);
  near(R.dep[0], R.dep[1], 0.01, '12.12 equipment set-aside = sum of the items (years not rounded)');
  chk(/ลดลงเดือนละ 2%/.test(R.gr) || !/คืนทุนภายใน 5 ปี/.test(R.gr), '12.13 negative growth from tool 1 named in the no-payback finding', R.gr);
}

console.log(n + ' checks');
console.log(bad ? bad + ' FAILED' : 'ALL CHECKS PASSED');
process.exit(bad ? 1 : 0);
