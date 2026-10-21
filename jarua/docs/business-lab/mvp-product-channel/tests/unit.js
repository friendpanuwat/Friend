/* ตัวเลขถูกต้อง: ทุกค่าที่คาดไว้คิดด้วยมือ (บวกลบคูณหารธรรมดา ไม่เรียกตัวช่วยของหน้าเว็บ)
   · เงินที่เหลือรวมทีละสินค้า = รวมทีละช่องทาง = ทั้งร้าน · ยอดขายและกำไรตรงกับตัวคำนวณ PL2 · กำไรตรงกับตัวที่ 1
   · สิ่งที่ตัวเลขบอก (เกณฑ์แต่ละข้อ) · ไม่มีคำแนะนำในข้อความ · ตัวตรวจว่าตอบครบหรือยัง
   รัน: ./build.sh แล้ว node tests/unit.js */
const { load, call } = require('./cases');
const vm = require('vm');
const ctx = load();
const X = (c) => vm.runInContext(c, ctx);
let fails = 0, checks = 0;
function chk(cond, msg) { checks++; if (!cond) { fails++; console.log('  FAIL', msg); } }
function near(a, b, tol, msg) { chk(typeof a === 'number' && typeof b === 'number' && Math.abs(a - b) <= tol, msg + ` (${a} vs ${b})`); }
const pcC = (pc, inp, m) => call(ctx, 'pcCompute', pc, inp, m || 'unit');
const fn = (name, ...a) => call(ctx, name, ...a);

/* ---------- ตัวสร้างข้อมูล ---------- */
const INP0 = { volumePer: 'month', daysOpen: 30, staffCount: 0, staffSalary: 0, ownerSalary: 0, rent: 0, marketing: 0, otherFixed: 0, cash: 0 };
const inpOf = (o) => Object.assign({}, INP0, o || {});
const item = (id, price, cost, qty, o) => Object.assign({ id, name: 'สินค้า ' + id, unit: 'ชิ้น', price, cost, qty }, o || {});
const chan = (id, kind, o) => Object.assign({ id, kind, share: 100, priceMode: 'same', markup: 0, fee: 0, vat: 'in', disc: 0, perOrder: 0, ipo: 1, monthly: 0, off: {} }, o || {});
const pcOf = (items, channels, rest) => ({ items, channels, rest: rest || { on: false } });
const cell = (R, i, j) => R.cells.find((x) => x.i === i && x.j === j);
const sum = (a, f) => a.reduce((s, x) => s + f(x), 0);
const ALL_R = [];
const LV = { high: 0, mid: 1, watch: 2, note: 3 };

/* ตัวเลขรวมต้องเท่ากันทุกทาง + ตรงกับ PL2 */
function ident(R, label, tol) {
  tol = tol === undefined ? 0.01 : tol;
  chk(R.ok, label + ': computed');
  if (!R.ok) return;
  ALL_R.push([label, R]);
  near(sum(R.prods, (p) => p.left), R.left, tol, label + ': Σ product left = R.left');
  near(sum(R.chans, (c) => c.left), R.left, tol, label + ': Σ channel left = R.left');
  near(sum(R.cells, (x) => x.leftM), R.left, tol, label + ': Σ cell left = R.left');
  near(sum(R.cells, (x) => x.rev), R.rev, tol, label + ': Σ cell rev = R.rev');
  near(sum(R.prods, (p) => p.rev), R.rev, tol, label + ': Σ product rev = R.rev');
  near(sum(R.chans, (c) => c.rev), R.rev, tol, label + ': Σ channel rev = R.rev');
  /* ตัวคำนวณ PL2 ปัดยอดขายและต้นทุนของแต่ละทางรายได้เป็นสตางค์ → ต่างได้ไม่เกิน 2 สตางค์ต่อคู่สินค้า × ช่องทาง */
  const tolV4 = Math.max(tol, 0.02 * R.cells.length);
  near(R.rev, R.r.revenueMonthly, tolV4, label + ': R.rev = v4 revenueMonthly');
  chk(R.profit === R.r.netProfitMonthly, label + ': R.profit = v4 netProfitMonthly');
  near(R.left - R.fixed - R.chMonthly - R.dep, R.profit, tolV4, label + ': Σ left − fixed − channel monthly − depreciation = profit');
  near(sum(R.chans, (c) => c.after), R.left - R.chMonthly, tol, label + ': Σ channel after = left − channel monthly');
  for (let k = 1; k < R.finds.length; k++) {
    const a = R.finds[k - 1], b = R.finds[k];
    chk(LV[a.lv] < LV[b.lv] || (LV[a.lv] === LV[b.lv] && Math.abs(a.money || 0) >= Math.abs(b.money || 0)), label + ': finds sorted ' + a.id + ' before ' + b.id);
  }
}
const find = (R, kind) => R.finds.filter((f) => (f.kind || f.id) === kind);

/* ============ 1) ค่าที่คิดด้วยมือ ============ */
/* 1.1 GP 30% ยังไม่รวม VAT → หักจริง 32.1% ของราคา */
{
  const R = pcC(pcOf([item('a', 100, 40, 100)], [chan('c1', 'grab', { fee: 30, vat: 'ex', share: 77 })]), inpOf());
  const fee = 100 * 0.30 * 1.07, left = 100 - fee - 40;
  near(cell(R, 0, 0).fee, 32.1, 0.01, '1.1 GP 30% ex VAT: fee per unit 32.1');
  near(cell(R, 0, 0).fee / cell(R, 0, 0).net * 100, 32.1, 1e-9, '1.1 effective fee rate 32.1%');
  near(cell(R, 0, 0).left, left, 0.01, '1.1 left per unit 27.9');
  near(R.left, left * 100, 0.01, '1.1 left per month 2,790');
  near(R.rev, 10000, 0.01, '1.1 revenue 10,000');
  near(R.profit, 2790, 0.01, '1.1 profit 2,790 (no fixed costs)');
  near(cell(R, 0, 0).units, 100, 1e-9, '1.1 single channel: share 77 ignored, all 100 units');
  ident(R, '1.1');
}
/* 1.2 ค่าธรรมเนียมรวม VAT แล้ว: หัก 30% ตรง ๆ */
{
  const R = pcC(pcOf([item('a', 100, 40, 100)], [chan('c1', 'grab', { fee: 30, vat: 'in' })]), inpOf());
  near(cell(R, 0, 0).fee, 30, 0.01, '1.2 fee incl. VAT: 30 per unit');
  near(cell(R, 0, 0).left, 30, 0.01, '1.2 left per unit 30');
  ident(R, '1.2');
}
/* 1.3 ราคาบนแอปสูงกว่า 20% */
{
  const R = pcC(pcOf([item('a', 100, 40, 100)], [chan('c1', 'lineman', { priceMode: 'up', markup: 20, fee: 30, vat: 'ex' })]), inpOf());
  const list = 100 * 1.2, fee = list * 0.3 * 1.07;
  near(cell(R, 0, 0).list, 120, 0.01, '1.3 markup up 20%: list 120');
  near(cell(R, 0, 0).fee, fee, 0.01, '1.3 fee on 120 = 38.52');
  near(cell(R, 0, 0).left, list - fee - 40, 0.01, '1.3 left 41.48');
  near(R.rev, 12000, 0.01, '1.3 revenue at app price');
  ident(R, '1.3');
}
/* 1.4 ขายส่งถูกกว่า 10% · ค่าธรรมเนียม 0 กับ "ยังไม่รวม VAT" = ไม่มี VAT */
{
  const R = pcC(pcOf([item('a', 100, 40, 100)], [chan('c1', 'wholesale', { priceMode: 'down', markup: 10, fee: 0, vat: 'ex' })]), inpOf());
  near(cell(R, 0, 0).list, 90, 0.01, '1.4 markup down 10%: list 90');
  near(cell(R, 0, 0).fee, 0, 1e-12, '1.4 fee 0 with vat ex → no VAT added');
  near(cell(R, 0, 0).left, 50, 0.01, '1.4 left 50');
  ident(R, '1.4');
}
/* 1.5 ส่วนลดที่ร้านออก: ค่าธรรมเนียมคิดจากราคาหลังส่วนลด */
{
  const R = pcC(pcOf([item('a', 100, 40, 100)], [chan('c1', 'lineman', { priceMode: 'up', markup: 20, disc: 25, fee: 30, vat: 'ex' })]), inpOf());
  const list = 120, net = list * 0.75, fee = net * 0.321;
  near(cell(R, 0, 0).net, 90, 0.01, '1.5 shop-funded 25% off 120 → 90');
  near(cell(R, 0, 0).disc, 30, 0.01, '1.5 discount per unit 30');
  near(cell(R, 0, 0).fee, fee, 0.01, '1.5 fee on discounted price 28.89');
  near(cell(R, 0, 0).left, net - fee - 40, 0.01, '1.5 left 21.11');
  near(R.disc, 3000, 0.01, '1.5 discount per month 3,000');
  near(R.rev, 9000, 0.01, '1.5 revenue after discount 9,000');
  ident(R, '1.5');
}
/* 1.6 ค่าแพ็กต่อออร์เดอร์ 9 บาท ออร์เดอร์ละ 1.5 ชิ้น → ชิ้นละ 6 */
{
  const R = pcC(pcOf([item('a', 199, 110, 240)], [chan('c1', 'shopee', { fee: 18, vat: 'in', perOrder: 9, ipo: 1.5 })]), inpOf(), 'resell');
  const fee = 199 * 0.18, pack = 9 / 1.5, left = 199 - fee - 110 - pack;
  near(cell(R, 0, 0).pack, 6, 1e-9, '1.6 pack per unit = 9 / 1.5');
  near(cell(R, 0, 0).left, left, 0.01, '1.6 left 47.18');
  near(R.left, left * 240, 0.01, '1.6 left per month');
  near(R.chans[0].pack, 6 * 240, 0.01, '1.6 channel pack per month 1,440');
  ident(R, '1.6');
}
/* 1.7 ไม่มีค่าแพ็ก: จำนวนชิ้นต่อออร์เดอร์ไม่มีผล และไม่ต้องตอบ */
{
  const R = pcC(pcOf([item('a', 100, 40, 10)], [chan('c1', 'social', { perOrder: 0, ipo: 3 })]), inpOf());
  near(cell(R, 0, 0).pack, 0, 1e-12, '1.7 perOrder 0 → pack 0 regardless of ipo 3');
  near(cell(R, 0, 0).left, 60, 0.01, '1.7 left 60');
  chk(fn('chMissing', chan('c1', 'social', { perOrder: 0, ipo: '' }), pcOf([item('a', 100, 40, 10)], [{}])) === null, '1.7 perOrder 0: ipo not required');
  ident(R, '1.7');
}
/* 1.8 ยอดต่อวัน × วันเปิดร้าน = ยอดต่อเดือนเท่ากัน */
{
  const ch = [chan('c1', 'shop')];
  const Rd = pcC(pcOf([item('a', 60, 16, 22)], ch), inpOf({ volumePer: 'day', daysOpen: 26 }));
  const Rm = pcC(pcOf([item('a', 60, 16, 22 * 26)], ch), inpOf({ volumePer: 'month', daysOpen: '' }));
  near(Rd.prods[0].units, 572, 1e-9, '1.8 per day: 22 × 26 = 572 units');
  near(Rd.rev, 572 * 60, 0.01, '1.8 per day revenue 34,320');
  near(Rd.left, 572 * 44, 0.01, '1.8 per day left 25,168');
  near(Rm.prods[0].units, 572, 1e-9, '1.8 per month: 572 units');
  near(Rm.profit, Rd.profit, 0.001, '1.8 per day and per month give the same profit');
  ident(Rd, '1.8 day'); ident(Rm, '1.8 month');
}
/* 1.9 ปิดสินค้าในช่องทางหนึ่ง → แบ่งจำนวนใหม่เฉพาะช่องทางที่ขาย */
{
  const pc = pcOf([item('a', 100, 40, 100), item('b', 50, 10, 100)], [
    chan('c1', 'shop', { share: 50, off: { b: true } }),
    chan('c2', 'social', { share: 30, perOrder: 10, ipo: 2 }),
    chan('c3', 'web', { share: 20, fee: 3, vat: 'in' })]);
  const R = pcC(pc, inpOf());
  near(cell(R, 0, 0).units, 50, 1e-9, '1.9 A on shop 50%');
  near(cell(R, 0, 1).units, 30, 1e-9, '1.9 A on social 30%');
  near(cell(R, 0, 2).units, 20, 1e-9, '1.9 A on web 20%');
  chk(!cell(R, 1, 0), '1.9 B has no cell on shop (off)');
  near(cell(R, 1, 1).units, 100 * 30 / 50, 1e-9, '1.9 B on social = 30/(30+20) = 60');
  near(cell(R, 1, 2).units, 100 * 20 / 50, 1e-9, '1.9 B on web = 20/(30+20) = 40');
  const aL = 50 * 60 + 30 * (100 - 40 - 5) + 20 * (100 - 3 - 40), bL = 60 * (50 - 10 - 5) + 40 * (50 - 1.5 - 10);
  near(R.prods[0].left, aL, 0.01, '1.9 A left 5,790');
  near(R.prods[1].left, bL, 0.01, '1.9 B left 3,640');
  near(R.chans[0].left, 3000, 0.01, '1.9 shop left 3,000');
  near(R.chans[1].left, 30 * 55 + 60 * 35, 0.01, '1.9 social left 3,750');
  near(R.chans[2].left, 20 * 57 + 40 * 38.5, 0.01, '1.9 web left 2,680');
  near(R.chans[1].units, 90, 1e-9, '1.9 social units 90');
  ident(R, '1.9');
}
/* 1.10 ช่องทางเดียว: ไม่สนสัดส่วน */
{
  const pc = pcOf([item('a', 80, 30, 50)], [chan('c1', 'social', { share: 37 })]);
  const R = pcC(pc, inpOf());
  near(cell(R, 0, 0).units, 50, 1e-9, '1.10 single channel: share 37 ignored');
  chk(fn('sharesOk', pc) === true, '1.10 sharesOk true for a single channel with share 37');
  chk(R.many === false, '1.10 many = false');
  ident(R, '1.10');
}
/* 1.11 สินค้าอื่น ๆ: ราคาเฉลี่ยถ่วงด้วยจำนวน · จำนวน = ยอดขาย ÷ ราคาเฉลี่ย */
{
  const pc = pcOf([item('a', 60, 20, 20), item('b', 80, 30, 10)], [chan('c1', 'shop')], { on: true, sales: 1000, costPct: 40 });
  const R = pcC(pc, inpOf({ volumePer: 'day', daysOpen: 25 }));
  const avg = (60 * 500 + 80 * 250) / 750, units = 1000 * 25 / avg, cost = avg * 0.4;
  const rest = R.prods[2];
  chk(rest && rest.rest === true, '1.11 rest row present');
  near(rest.price, avg, 1e-9, '1.11 rest price = weighted avg 66.67');
  near(rest.units, 375, 1e-9, '1.11 rest units = 25,000 / 66.67 = 375');
  near(rest.cost, cost, 1e-9, '1.11 rest cost = 40% of avg');
  near(rest.rev, 25000, 0.01, '1.11 rest revenue = sales 1,000 × 25 days');
  near(rest.left, units * (avg - cost), 0.01, '1.11 rest left 15,000');
  near(R.left, 500 * 40 + 250 * 50 + 15000, 0.01, '1.11 total left 47,500');
  near(R.rev, 75000, 0.01, '1.11 total revenue 75,000');
  ident(R, '1.11');
  /* ไม่มีสินค้าที่ใส่: ราคาเฉลี่ย 100 */
  const R0 = pcC(pcOf([], [chan('c1', 'shop')], { on: true, sales: 5000, costPct: 30 }), inpOf());
  near(R0.prods[0].price, 100, 1e-9, '1.11 rest with no items: price 100');
  near(R0.prods[0].units, 50, 1e-9, '1.11 rest with no items: 50 units');
  near(R0.left, 5000 * 0.7, 0.01, '1.11 rest with no items: left 3,500');
  ident(R0, '1.11 no items');
}
/* 1.12 ค่าเสื่อม: อุปกรณ์ 120,000 ใช้ 5 ปี = 2,000/เดือน */
{
  const pc = pcOf([item('a', 100, 40, 1000)], [chan('c1', 'shop')]);
  const R = pcC(pc, inpOf({ staffCount: 2, staffSalary: 9000, ownerSalary: 15000, rent: 10000, equipValue: 120000, equipYears: 5 }));
  near(R.dep, 2000, 0.001, '1.12 depreciation 120,000 / 60 = 2,000');
  near(R.fixed, 18000 + 15000 + 10000, 0.001, '1.12 fixed 43,000');
  near(R.profit, 60000 - 43000 - 2000, 0.01, '1.12 profit 15,000');
  ident(R, '1.12');
}
/* 1.13 ค่าใช้จ่ายของช่องทางที่รวมไว้ในงบการตลาดแล้ว (chMkt) ไม่นับซ้ำ */
{
  const pc = pcOf([item('a', 100, 40, 100)], [chan('c1', 'grab', { fee: 30, vat: 'ex', monthly: 1500 })]);
  const R = pcC(pc, inpOf({ marketing: 5000, chMkt: 1500, rent: 2000 }));
  near(R.fixed, 5000 - 1500 + 2000, 0.001, '1.13 fixed excludes chMkt: 5,500');
  near(R.profit, 2790 - 5500 - 1500, 0.01, '1.13 profit 2,790 − 5,500 − 1,500');
  ident(R, '1.13');
  const R2 = pcC(pc, inpOf({ marketing: 5000, chMkt: 8000, rent: 2000 }));
  near(R2.fixed, 2000, 0.001, '1.13 chMkt above marketing: only marketing removed');
  ident(R2, '1.13 chMkt>marketing');
  /* ใช้ยอดจากรายสินค้าเป็นตัวเลขร้าน แล้วคิดซ้ำ ต้องได้กำไรเท่าเดิม และตัวที่ 1 ได้เท่ากัน */
  const inp = inpOf({ marketing: 5000, rent: 2000 });
  const R3 = pcC(pc, inp), agg = fn('pcAggregate', pc, inp, 'unit');
  near(agg.marketing, 6500, 0.001, '1.13 aggregate marketing = 5,000 + channel 1,500');
  near(agg.chMkt, 1500, 0.001, '1.13 aggregate remembers chMkt 1,500');
  near(pcC(pc, agg).profit, R3.profit, 0.001, '1.13 tool 4 on aggregated numbers: same profit');
  near(fn('compute', agg, 'unit').profit, R3.profit, 0.05, '1.13 tool 1 on aggregated numbers: same profit');
}
/* 1.14 ค่าใช้จ่ายรายเดือนของช่องทาง → เหลือจริง และกำไร */
{
  const R = pcC(pcOf([item('a', 100, 40, 100)], [chan('c1', 'grab', { fee: 30, vat: 'ex', monthly: 1000 })]), inpOf());
  near(R.chans[0].after, 2790 - 1000, 0.01, '1.14 channel after = 2,790 − 1,000');
  near(R.chMonthly, 1000, 1e-9, '1.14 chMonthly 1,000');
  near(R.profit, 1790, 0.01, '1.14 profit 1,790');
  ident(R, '1.14');
}
/* 1.15 หน้าร้าน: ไม่สนราคาสูงกว่า/ต่ำกว่า */
{
  const R = pcC(pcOf([item('a', 100, 40, 100)], [chan('c1', 'shop', { priceMode: 'up', markup: 50 })]), inpOf());
  near(cell(R, 0, 0).list, 100, 1e-9, '1.15 shop ignores priceMode up 50');
  const R2 = pcC(pcOf([item('a', 100, 40, 100)], [chan('c1', 'shop', { priceMode: 'down', markup: 30 })]), inpOf());
  near(cell(R2, 0, 0).list, 100, 1e-9, '1.15 shop ignores priceMode down 30');
  ident(R, '1.15'); ident(R2, '1.15 down');
}
/* 1.16 ร้านกาแฟตัวอย่าง: อเมริกาโน่บน GrabFood และครัวซองต์บน LINE MAN */
{
  const S = fn('pcSample', 'cafe'), R = pcC(S.pc, S.inp, S.m);
  const ame = cell(R, 0, 1), list = 65 * 1.15, fee = list * 0.321;
  near(ame.left, list - fee - 16 - 6 / 1.5, 0.01, '1.16 cafe americano on Grab: 74.75 − 23.995 − 16 − 4');
  near(ame.units, 22 * 26 * 0.16, 1e-9, '1.16 cafe americano on Grab: 22 × 26 × 16%');
  const cro = cell(R, 5, 2), net = 75 * 0.8;
  near(cro.left, net - net * 0.321 - 40 - 4, 0.01, '1.16 cafe croissant on LINE MAN: 60 − 19.26 − 40 − 4');
}

/* ============ 2) ร้านตัวอย่าง: ตัวที่ 1 ได้กำไรเท่าตัวที่ 4 ============ */
for (const k of ['cafe', 'online']) {
  const S = fn('pcSample', k), R = pcC(S.pc, S.inp, S.m);
  ident(R, '2 sample ' + k);
  const raw = JSON.parse(X(`JSON.stringify(PC_SAMPLES['${k}'].inp)`));
  raw.unitLabel = X(`MODELS['${S.m}'].defUnit`);
  const R0 = pcC(S.pc, raw, S.m);
  near(R0.profit, R.profit, 0.01, '2 sample ' + k + ': profit same before and after using totals as shop numbers');
  const agg = fn('pcAggregate', S.pc, raw, S.m), C = fn('compute', agg, S.m);
  chk(C.ok, '2 sample ' + k + ': tool 1 computes aggregated numbers');
  near(C.profit, R.profit, 0.05, '2 sample ' + k + ': tool 1 profit = tool 4 profit');
  near(C.revenue, R.rev, 0.05, '2 sample ' + k + ': tool 1 revenue = tool 4 revenue');
  chk(fn('pcDiff', S.pc, S.inp, S.m) === null, '2 sample ' + k + ': no difference reported against its own shop numbers');
}

/* ============ 3) ราคาที่ทำให้เหลือเงินตามเป้า (listPriceFor) ============ */
{
  const chs = [chan('c1', 'lineman', { fee: 30, vat: 'ex', disc: 20, perOrder: 6, ipo: 1.5 }),
    chan('c1', 'shopee', { fee: 18, vat: 'in', disc: 5, perOrder: 9, ipo: 1.3 }),
    chan('c1', 'shop'),
    chan('c1', 'grab', { priceMode: 'up', markup: 15, fee: 30, vat: 'ex', perOrder: 6, ipo: 1.5 })];
  const k0 = 0.8 * (1 - 0.3 * 1.07);
  near(fn('listPriceFor', chs[0], 40, 25), (25 + 40 + 4) / k0, 1e-6, '3 list price for target 25 on LINE MAN = 69 / 0.5432');
  for (const c of chs) for (const T of [0, 25, 100]) {
    const L = fn('listPriceFor', c, 40, T);
    const f = c.priceMode === 'up' ? 1 + c.markup / 100 : 1;
    const R = pcC(pcOf([item('a', L / f, 40, 10)], [c]), inpOf());
    near(cell(R, 0, 0).list, L, 1e-6, `3 ${c.kind} target ${T}: list price used`);
    near(cell(R, 0, 0).left, T, 0.01, `3 ${c.kind} target ${T}: round trip gives left = target`);
  }
  chk(fn('listPriceFor', chan('c', 'grab', { fee: 100 }), 40, 10) === null, '3 fee 100% → null');
  chk(fn('listPriceFor', chan('c', 'grab', { fee: 95, vat: 'ex' }), 40, 10) === null, '3 fee 95% + VAT (>100%) → null');
  chk(fn('listPriceFor', chan('c', 'grab', { disc: 100 }), 40, 10) === null, '3 discount 100% → null');
}

/* ============ 4) สิ่งที่ตัวเลขบอก ============ */
/* 4.1 ขาดทุนทุกชิ้น: 2 คู่ */
{
  const pc = pcOf([item('a', 50, 45, 100), item('b', 30, 25, 100)], [chan('c1', 'shop', { share: 50 }), chan('c2', 'grab', { share: 50, fee: 30, vat: 'in', perOrder: 2, ipo: 1 })]);
  const R = pcC(pc, inpOf());
  const L = find(R, 'loss');
  const money = 50 * (50 - 15 - 45 - 2) + 50 * (30 - 9 - 25 - 2);
  chk(L.length === 1 && L[0].lv === 'high', '4.1 loss finding, high');
  near(L.length && L[0].money, money, 0.01, '4.1 loss money = Σ leftM of negative cells (−900)');
  chk(L.length && L[0].cells.length === 2 && /2 คู่/.test(L[0].t), '4.1 loss covers 2 pairs: ' + (L[0] && L[0].t));
  chk(R.finds[0].id === 'loss', '4.1 loss is listed first');
  ident(R, '4.1');
  /* 1 คู่: บอกชื่อสินค้าและช่องทาง */
  const R1 = pcC(pcOf([item('a', 50, 45, 100), item('b', 30, 10, 100)], pc.channels), inpOf());
  const L1 = find(R1, 'loss');
  chk(L1.length === 1 && L1[0].t.indexOf('สินค้า a') >= 0 && L1[0].t.indexOf('GrabFood') >= 0, '4.1 single loss names product and channel: ' + (L1[0] && L1[0].t));
  near(L1.length && L1[0].money, 50 * (50 - 15 - 45 - 2), 0.01, '4.1 single loss money −600');
  ident(R1, '4.1 single');
}
/* 4.2 ค่าใช้จ่ายของช่องทางมากกว่าเงินที่เหลือ → high · 4.3 กินเกินครึ่ง → mid */
{
  const mk = (monthly) => pcC(pcOf([item('a', 100, 40, 100)], [chan('c1', 'grab', { fee: 30, vat: 'ex', perOrder: 5, ipo: 1, monthly })]), inpOf());
  const left = 100 * (100 - 32.1 - 40 - 5);
  const R = mk(5000), s = find(R, 'chshort');
  chk(s.length === 1 && s[0].lv === 'high', '4.2 channel after < 0 → chshort high');
  near(s.length && s[0].money, left - 5000, 0.01, '4.2 chshort money = after (−2,710)');
  chk(find(R, 'cheat').length === 0, '4.2 chshort is not also cheat');
  ident(R, '4.2');
  const R2 = mk(1500), h = find(R2, 'cheat');
  chk(h.length === 1 && h[0].lv === 'mid', '4.3 monthly 1,500 of 2,290 (>50%) → cheat mid');
  near(h.length && h[0].money, left - 1500, 0.01, '4.3 cheat money = after 790');
  chk(find(mk(1100), 'cheat').length === 0, '4.3 monthly 1,100 of 2,290 (<50%) → no cheat');
  chk(find(mk(1150), 'cheat').length === 1, '4.3 monthly 1,150 of 2,290 (>50%) → cheat');
  ident(R2, '4.3');
}
/* 4.4 ขายดีแต่เหลือเงินน้อย (gap) · 4.6 พึ่งสินค้าเดียว (conc) */
{
  const R = pcC(pcOf([item('a', 100, 90, 100), item('b', 100, 20, 100)], [chan('c1', 'shop')]), inpOf());
  const g = find(R, 'gap');
  const shop100 = 9000 / 20000 * 100, a100 = 1000 / 10000 * 100;
  chk(g.length === 1 && g[0].lv === 'mid' && g[0].prod === 0, '4.4 gap for product A (50% of sales, 11% of left), mid');
  near(g.length && g[0].money, 10000 * (shop100 - a100) / 100, 0.01, '4.4 gap money = 10,000 × (45 − 10) / 100 = 3,500');
  const c = find(R, 'conc');
  chk(c.length === 1 && c[0].lv === 'note' && c[0].prod === 1, '4.6 conc for product B (89% of left), note');
  near(c.length && c[0].money, 8000, 0.01, '4.6 conc money = B left 8,000');
  ident(R, '4.4');
  /* ยอดขายต่ำกว่า 10% ไม่นับ */
  const R2 = pcC(pcOf([item('a', 100, 90, 9), item('b', 100, 20, 91)], [chan('c1', 'shop')]), inpOf());
  chk(find(R2, 'gap').length === 0, '4.4 revShare 9% → no gap');
  /* leftShare ≥ 0.75 × revShare → ไม่นับ: A 50% ของยอดขาย, 40% ของเงินที่เหลือ (= 0.8×) */
  const R3 = pcC(pcOf([item('a', 100, 60, 100), item('b', 100, 40, 100)], [chan('c1', 'shop')]), inpOf());
  chk(find(R3, 'gap').length === 0, '4.4 leftShare 40% vs revShare 50% (0.8×) → no gap');
  const R4 = pcC(pcOf([item('a', 100, 70, 100), item('b', 100, 20, 100)], [chan('c1', 'shop')]), inpOf());
  chk(find(R4, 'gap').length === 1, '4.4 leftShare 27% vs revShare 50% (0.55×) → gap');
  ident(R2, '4.4 small'); ident(R3, '4.4 0.8x'); ident(R4, '4.4 0.55x');
  /* conc: 55% → ขึ้น · 50/50 → ไม่ขึ้น */
  const R5 = pcC(pcOf([item('a', 100, 55, 100), item('b', 100, 45, 100)], [chan('c1', 'shop')]), inpOf());
  const c5 = find(R5, 'conc');
  chk(c5.length === 1 && c5[0].prod === 1, '4.6 B with 55% of left → conc');
  near(c5.length && c5[0].money, 5500, 0.01, '4.6 conc money 5,500');
  chk(find(pcC(pcOf([item('a', 100, 50, 100), item('b', 100, 50, 100)], [chan('c1', 'shop')]), inpOf()), 'conc').length === 0, '4.6 50/50 → no conc');
  ident(R5, '4.6 55%');
}
/* 4.5 ช่องทางที่เหลือต่อ 100 บาทน้อยกว่าครึ่งของช่องทางที่ดีที่สุด → watch */
{
  const mk = (grab) => pcC(pcOf([item('a', 100, 40, 200)], [chan('c1', 'shop', { share: 50 }), chan('c2', 'grab', Object.assign({ share: 50, perOrder: 3, ipo: 1 }, grab))]), inpOf());
  const R = mk({ fee: 30, vat: 'ex' }), w = find(R, 'chlow');
  const g100 = 100 - 32.1 - 40 - 3;
  chk(w.length === 1 && w[0].lv === 'watch' && w[0].ch === 1 && w[0].best === 0, '4.5 chlow for Grab (24.9 vs 60), watch');
  near(w.length && w[0].money, 10000 * (60 - g100) / 100, 0.01, '4.5 chlow money = 10,000 × (60 − 24.9) / 100 = 3,510');
  chk(find(mk({ fee: 20, vat: 'in' }), 'chlow').length === 0, '4.5 Grab 37 vs 60 (> half) → no chlow');
  ident(R, '4.5');
}
/* 4.7 ต้นทุนที่อาจยังไม่ได้ใส่ */
{
  const pc = pcOf([item('a', 100, 40, 100)], [
    chan('c1', 'grab', { share: 20, fee: 0, perOrder: 0 }),
    chan('c2', 'social', { share: 20, fee: 0, perOrder: 0 }),
    chan('c3', 'shopee', { share: 20, fee: 5, perOrder: 10, ipo: 1 }),
    chan('c4', 'shop', { share: 20 }),
    chan('c5', 'wholesale', { share: 20, priceMode: 'same' })]);
  const R = pcC(pc, inpOf());
  const F = find(R, 'forgot'), by = (j) => F.find((f) => f.ch === j);
  chk(by(0) && by(0).lv === 'note' && by(0).money === null && /ค่าธรรมเนียม/.test(by(0).t) && /ค่าแพ็ก/.test(by(0).t), '4.7 app with fee 0 and pack 0 → forgot both: ' + (by(0) && by(0).t));
  chk(by(1) && !/ค่าธรรมเนียม/.test(by(1).t) && /ค่าแพ็ก/.test(by(1).t), '4.7 LINE/Facebook with pack 0 → forgot pack only: ' + (by(1) && by(1).t));
  chk(!by(2) && !by(3) && !by(4), '4.7 shopee with fee and pack, shop and wholesale → no forgot');
  const R2 = pcC(pcOf([item('a', 100, 40, 100)], [chan('c1', 'lazada', { fee: 0, perOrder: 10, ipo: 1 })]), inpOf());
  chk(find(R2, 'forgot').length === 1 && !/ค่าแพ็ก/.test(find(R2, 'forgot')[0].t), '4.7 marketplace fee 0 → forgot fee only');
  ident(R, '4.7'); ident(R2, '4.7 lazada');
}
/* 4.8 ไม่มีอะไรผิดปกติ: คำถามทั่วไป */
{
  const R = pcC(pcOf([item('a', 100, 40, 100)], [chan('c1', 'shop')]), inpOf());
  chk(R.finds.length === 0, '4.8 healthy single product: no findings');
  chk(JSON.stringify(fn('pcAskList', R)) === JSON.stringify(['p_price', 'p_pair', 'conc']), '4.8 default questions (single channel)');
  const R2 = pcC(pcOf([item('a', 100, 40, 100)], [chan('c1', 'shop', { share: 60 }), chan('c2', 'wholesale', { share: 40, priceMode: 'down', markup: 10 })]), inpOf());
  chk(R2.finds.length === 0, '4.8 shop + wholesale: no findings');
  chk(JSON.stringify(fn('pcAskList', R2)) === JSON.stringify(['loss_price', 'p_pair', 'f_pack']), '4.8 default questions (many channels)');
  ident(R, '4.8'); ident(R2, '4.8 many');
}

/* ============ 5) คำถามเช็ก และคำในข้อความ ============ */
const QB4 = JSON.parse(X('JSON.stringify(QB4)'));
for (const [label, R] of ALL_R) {
  const A = fn('pcAskList', R);
  chk(Array.isArray(A) && A.length >= 1 && A.length <= 5, label + ': ask list has 1–5 questions (' + A.length + ')');
  chk(new Set(A).size === A.length, label + ': ask list unique');
  chk(A.every((q) => QB4[q]), label + ': ask keys all in QB4 ' + A.join(','));
  for (const f of R.finds) {
    chk(typeof f.t === 'string' && f.t.trim().length > 0, label + ': finding has text ' + f.id);
    chk(f.money === null || (typeof f.money === 'number' && isFinite(f.money)), label + ': finding money numeric or null ' + f.id);
    chk((f.q || []).every((q) => QB4[q]), label + ': finding questions in QB4 ' + f.id);
  }
}
{
  /* ไม่บอกวิธีแก้: ห้าม ควร เลิก ตัด ต้อง · "ตัดสิน" (= ตัดสินใจ/พิจารณา) ไม่ใช่คำว่า "ตัด" จึงไม่นับ แต่พิมพ์บอกไว้ */
  const BAD = ['ควร', 'เลิก', 'ตัด', 'ต้อง'];
  const texts = [];
  for (const [label, R] of ALL_R) for (const f of R.finds) { texts.push(['find ' + label + ' ' + f.id + '.t', f.t]); texts.push(['find ' + label + ' ' + f.id + '.s', f.s]); }
  for (const [k, b] of Object.entries(QB4)) {
    texts.push(['QB4.' + k + '.q', b.q], ['QB4.' + k + '.p', b.p], ['QB4.' + k + '.d', b.d]);
    for (const [a, v] of Object.entries(b.ans || {})) texts.push(['QB4.' + k + '.ans.' + a, v]);
  }
  const hints = JSON.parse(X('JSON.stringify(CH_HINT)'));
  for (const [g, h] of Object.entries(hints)) for (const [k, v] of Object.entries(h)) texts.push(['CH_HINT.' + g + '.' + k, v]);
  const offenders = [], exempt = [];
  for (const [where, s] of texts) {
    const str = String(s || '');
    if (str.indexOf('ตัดสิน') >= 0) exempt.push(where + ': ' + str);
    const clean = str.replace(/ตัดสิน/g, '');
    for (const w of BAD) if (clean.indexOf(w) >= 0) offenders.push(where + ' [' + w + ']: ' + str);
  }
  offenders.forEach((o) => console.log('  ADVICE WORD', o));
  exempt.forEach((o) => console.log('  NOTE "ตัดสิน" (judge) not counted as "ตัด":', o));
  chk(offenders.length === 0, '5 no advice words in ' + texts.length + ' texts (' + offenders.length + ' offenders)');
}

/* ============ 6) ตัวตรวจว่าตอบครบหรือยัง ============ */
{
  const okItem = item('a', 100, 40, 10);
  chk(fn('itemOk', okItem) === true, '6 itemOk: complete item');
  chk(fn('itemOk', Object.assign({}, okItem, { name: '  ' })) === false, '6 itemOk: blank name');
  chk(fn('itemOk', Object.assign({}, okItem, { price: 0 })) === false, '6 itemOk: price 0');
  chk(fn('itemOk', Object.assign({}, okItem, { price: '' })) === false, '6 itemOk: price empty');
  chk(fn('itemOk', Object.assign({}, okItem, { cost: 0 })) === true, '6 itemOk: cost 0 is fine');
  chk(fn('itemOk', Object.assign({}, okItem, { cost: -1 })) === false, '6 itemOk: cost −1');
  chk(fn('itemOk', Object.assign({}, okItem, { cost: '' })) === false, '6 itemOk: cost empty');
  chk(fn('itemOk', Object.assign({}, okItem, { cost: 500 })) === true, '6 itemOk: cost above price is allowed');
  chk(fn('itemOk', Object.assign({}, okItem, { qty: 0 })) === false, '6 itemOk: qty 0');
  chk(fn('itemOk', Object.assign({}, okItem, { qty: '1,200' })) === true, '6 itemOk: qty "1,200"');

  /* chMissing: เติมทีละช่อง ต้องได้ช่องถัดไปตามลำดับ */
  const pc1 = pcOf([okItem], [{}]);
  const steps = [['name', { name: 'ตลาดเช้า' }], ['priceMode', { priceMode: 'up' }], ['markup', { markup: 10 }], ['fee', { fee: 20 }],
    ['vat', { vat: 'ex' }], ['disc', { disc: 0 }], ['perOrder', { perOrder: 5 }], ['ipo', { ipo: 2 }], ['monthly', { monthly: 0 }], [null, {}]];
  let c = { kind: 'other' };
  for (const [want, add] of steps) {
    const got = fn('chMissing', c, pc1);
    chk(got === want, '6 chMissing order: expected ' + want + ' got ' + got);
    c = Object.assign({}, c, add);
  }
  const base = chan('c1', 'grab', { fee: 30, vat: 'ex' });
  const miss = (o, pc) => fn('chMissing', Object.assign({}, base, o), pc || pc1);
  chk(miss({ priceMode: 'up', markup: 0 }) === 'markup', '6 chMissing: up with markup 0');
  chk(miss({ priceMode: 'down', markup: 100 }) === 'markup', '6 chMissing: down 100%');
  chk(miss({ priceMode: 'down', markup: 99 }) === null, '6 chMissing: down 99% allowed');
  chk(miss({ fee: 100 }) === 'fee', '6 chMissing: fee 100');
  chk(miss({ fee: -1 }) === 'fee', '6 chMissing: fee −1');
  chk(miss({ fee: 99 }) === null, '6 chMissing: fee 99 allowed');
  chk(miss({ fee: 0, vat: undefined }) === null, '6 chMissing: fee 0 needs no VAT answer');
  chk(miss({ disc: 100 }) === 'disc', '6 chMissing: disc 100');
  chk(miss({ disc: '' }) === 'disc', '6 chMissing: disc empty');
  chk(miss({ perOrder: -1 }) === 'perOrder', '6 chMissing: perOrder −1');
  chk(miss({ perOrder: 5, ipo: 0.5 }) === 'ipo', '6 chMissing: ipo 0.5');
  chk(miss({ perOrder: 5, ipo: 1.3 }) === null, '6 chMissing: ipo 1.3 allowed');
  chk(miss({ monthly: '' }) === 'monthly', '6 chMissing: monthly empty');
  chk(fn('chMissing', { kind: 'shop', fee: 0, disc: 0, perOrder: 0, monthly: 0 }, pc1) === null, '6 chMissing: shop needs no priceMode');
  const pc2 = pcOf([okItem, item('b', 50, 10, 5)], [Object.assign({}, base, { off: { a: true, b: true } }), chan('c2', 'shop')]);
  chk(fn('chMissing', pc2.channels[0], pc2) === 'off', '6 chMissing: every item off on this channel');
  chk(fn('chMissing', Object.assign({}, pc2.channels[0], { off: { a: true } }), pc2) === null, '6 chMissing: one item off is fine');
  /* ข้อสังเกต: หน้าร้านไม่ใช้ราคาสูงกว่า/ต่ำกว่า แต่ถ้ายังมีค่าเก่า "ต่ำกว่า 100%" ค้างอยู่ จะไม่ผ่าน (profit.js บรรทัด 66) */
  chk(fn('chMissing', { kind: 'shop', priceMode: 'down', markup: 100, fee: 0, disc: 0, perOrder: 0, monthly: 0 }, pc1) === null,
    '6 chMissing: shop with leftover priceMode down / markup 100 is not blocked (shop ignores priceMode)');

  /* sharesOk: รวม 100 ± 0.5 */
  const two = (a, b) => pcOf([okItem], [chan('c1', 'shop', { share: a }), chan('c2', 'social', { share: b })]);
  chk(fn('sharesOk', two(60, 40)) === true, '6 sharesOk 60+40');
  chk(fn('sharesOk', two(60, 40.5)) === true, '6 sharesOk 100.5');
  chk(fn('sharesOk', two(60, 39.5)) === true, '6 sharesOk 99.5');
  chk(fn('sharesOk', two(60, 40.6)) === false, '6 sharesOk 100.6 rejected');
  chk(fn('sharesOk', two(60, 39.4)) === false, '6 sharesOk 99.4 rejected');
  chk(fn('sharesOk', two(100, 0)) === false, '6 sharesOk share 0 rejected');
  chk(fn('sharesOk', two(60, '')) === false, '6 sharesOk share empty rejected');
  chk(fn('sharesOk', pcOf([okItem], [])) === false, '6 sharesOk no channels');

  /* itemsStepOk */
  const inpM = inpOf(), inpD = inpOf({ volumePer: 'day', daysOpen: 26 });
  chk(fn('itemsStepOk', pcOf([okItem], []), inpM) === true, '6 itemsStepOk: complete');
  chk(fn('itemsStepOk', { items: [okItem], channels: [] }, inpM) === false, '6 itemsStepOk: rest not answered');
  chk(fn('itemsStepOk', pcOf([], []), inpM) === false, '6 itemsStepOk: no items');
  chk(fn('itemsStepOk', pcOf([Object.assign({}, okItem, { qty: 0 })], []), inpM) === false, '6 itemsStepOk: zero qty');
  chk(fn('itemsStepOk', pcOf([okItem], [], { on: true, sales: 0, costPct: 30 }), inpM) === false, '6 itemsStepOk: rest sales 0');
  chk(fn('itemsStepOk', pcOf([okItem], [], { on: true, sales: 500, costPct: 100 }), inpM) === false, '6 itemsStepOk: rest cost 100%');
  chk(fn('itemsStepOk', pcOf([okItem], [], { on: true, sales: 500, costPct: 0 }), inpM) === true, '6 itemsStepOk: rest cost 0%');
  chk(fn('itemsStepOk', pcOf([okItem], []), inpD) === true, '6 itemsStepOk: per day 26 days');
  chk(fn('itemsStepOk', pcOf([okItem], []), inpOf({ volumePer: 'day', daysOpen: 32 })) === false, '6 itemsStepOk: 32 days');
  chk(fn('itemsStepOk', pcOf([okItem], []), inpOf({ volumePer: 'day', daysOpen: '' })) === false, '6 itemsStepOk: per day without days');
  chk(fn('itemsStepOk', pcOf([okItem], []), inpOf({ volumePer: undefined })) === false, '6 itemsStepOk: per day/month not answered');
  chk(fn('itemsStepOk', pcOf([okItem], []), inpOf({ volumePer: 'month', daysOpen: '' })) === true, '6 itemsStepOk: per month needs no days');

  /* channelsStepOk */
  const good = pcOf([okItem, item('b', 50, 10, 5)], [chan('c1', 'shop', { share: 70 }), chan('c2', 'grab', { share: 30, fee: 30, vat: 'ex', perOrder: 6, ipo: 1.5, off: { b: true } })]);
  chk(fn('channelsStepOk', good) === true, '6 channelsStepOk: complete');
  chk(fn('channelsStepOk', pcOf([okItem], [])) === false, '6 channelsStepOk: no channels');
  const badShare = JSON.parse(JSON.stringify(good)); badShare.channels[1].share = 20;
  chk(fn('channelsStepOk', badShare) === false, '6 channelsStepOk: shares total 90');
  const badVat = JSON.parse(JSON.stringify(good)); delete badVat.channels[1].vat;
  chk(fn('channelsStepOk', badVat) === false, '6 channelsStepOk: missing VAT answer');
  const noCh = JSON.parse(JSON.stringify(good)); noCh.channels[0].off = { b: true };
  chk(fn('channelsStepOk', noCh) === false, '6 channelsStepOk: product b off on every channel');
  const one = pcOf([okItem], [chan('c1', 'shop', { off: { a: true } })]);
  chk(fn('channelsStepOk', one) === false, '6 channelsStepOk: single channel with its only product off');

  /* fixedOk */
  const fx = { staffCount: 2, staffSalary: 12000, ownerSalary: 0, rent: 0, marketing: 0, otherFixed: 0, cash: 0 };
  chk(fn('fixedOk', fx) === true, '6 fixedOk: complete (zeros allowed)');
  chk(fn('fixedOk', Object.assign({}, fx, { staffCount: 0, staffSalary: '' })) === true, '6 fixedOk: no staff → salary not needed');
  chk(fn('fixedOk', Object.assign({}, fx, { staffSalary: '' })) === false, '6 fixedOk: staff without salary');
  chk(fn('fixedOk', Object.assign({}, fx, { rent: -1 })) === false, '6 fixedOk: rent −1');
  chk(fn('fixedOk', Object.assign({}, fx, { cash: undefined })) === false, '6 fixedOk: cash missing');
  chk(fn('fixedOk', Object.assign({}, fx, { marketing: '' })) === false, '6 fixedOk: marketing empty');
}

/* ============ 7) ตัวเลขร้านมีฤดูกาล (ตัวที่ 1 ส่วนเพิ่มเติม) ============
   ตัวคำนวณ PL2 ใช้ค่าเฉลี่ย 12 เดือนที่คิดฤดูกาลแล้ว → จำนวนของทุกคู่ปรับด้วยอัตราเดียวกัน ตารางรวมจึงเท่ากำไรของร้าน
   (ตัวคำนวณปัดยอดของแต่ละทางเป็นสตางค์ จึงยอมให้ต่างกันไม่เกิน 2 สตางค์ต่อคู่) · ต่อชิ้นไม่เปลี่ยน · ยอดรวมที่ส่งให้ตัวที่ 1 ใช้จำนวนเดือนปกติ */
{
  const S = fn('pcSample', 'cafe');
  const inp = Object.assign({}, S.inp, { season: { high: [11, 12], low: [6, 7], highPct: 40, lowPct: 50 } });
  const R = pcC(S.pc, inp, S.m);
  near(R.rev, R.r.revenueMonthly, 0.02 * R.cells.length, '7 season: Σ cell rev = v4 revenueMonthly');
  near(R.left - R.fixed - R.chMonthly - R.dep, R.profit, 0.02 * R.cells.length, '7 season: Σ left − fixed − channel monthly − dep = profit');
  const R0 = pcC(S.pc, S.inp, S.m);
  near(R.cells[0].left, R0.cells[0].left, 1e-9, '7 season: per-unit left unchanged');
  const A = fn('pcAggregate', S.pc, inp, S.m);
  near(A.volume, fn('pcAggregate', S.pc, S.inp, S.m).volume, 1e-6, '7 season: aggregate volume = normal-month volume');
  near(fn('compute', A, S.m).profit, R.profit, 0.05, '7 season: tool 1 profit from aggregate = tool 4 profit');
}

console.log(`${checks} checks`);
console.log(fails ? fails + ' FAILED' : 'ALL CHECKS PASSED');
process.exit(fails ? 1 : 0);
