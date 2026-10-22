/* ร้านสุ่ม 800 ร้าน + กรณีแปลก · ตรวจความสัมพันธ์ที่ต้องจริงเสมอ (ไม่ใช่ตัวเลขตายตัว) · รัน: ./build.sh แล้ว node tests/fuzz.js
   · เงินที่ต้องมี ≥ เงินก่อนเปิดร้าน · เงินในมือทุกเดือน = เงินที่มี − เงินก่อนเปิด + เงินสะสม · คืนเงินที่จ่ายหมดไป ≤ คืนเงินทั้งหมด
   · ขายได้น้อยลง → ต้องใช้เงินมากขึ้น · เรื่องที่แย่ลงทุกเรื่อง → ต้องใช้เงินไม่น้อยลง และเรียงจากมากไปน้อย
   · เงินพอ ถ้า…: ที่ยอดขายต่ำสุดเงินพอดีพอ · ไม่มี NaN ในข้อความ · เวลาคิดต่อครั้ง */
const vm = require('vm');
const { load } = require('./cases');
const ctx = load();
let bad = 0, runs = 0;
const seen = {};
const problem = (t, msg, x) => { bad++; if (bad < 40) console.log('PROBLEM ' + t + ' · ' + msg + (x !== undefined ? ' → ' + JSON.stringify(x).slice(0, 300) : '')); };
let seed = 7;
const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
const r = (a, b) => a + rnd() * (b - a);
const pick = a => a[Math.floor(rnd() * a.length)];
const n0c = v => (v ? +v : 0);
vm.runInContext(`function __fz(inp, m, op) {
  var R = opCompute(inp, m, op); if (!R.ok) return { ok: false };
  var B = R.base, out = { ok: true, need: B.need, all: B.all, spent: B.spent, low: B.low, left: B.left, save: B.save, payS: B.payS, payA: B.payA,
    cu: R.cu, lowN: R.sc.low.need, highN: R.sc.high.need, balOk: true, E: R.enough, sens: R.sens.map(function (x) { return [x.k, x.more]; }), txt: '' };
  B.months.forEach(function (x) { if (B.save !== null && Math.abs(x.bal - (B.save - B.all + x.cum)) > 1e-6) out.balOk = false; });
  if (R.enough && R.enough.minVol !== null && n0(inp.volume) > 0) {
    var f = R.enough.minVol / n0(inp.volume);
    out.atMin = opSim({ inp: inp, op: op, mult: f }).need; out.belowMin = f > 0.001 ? opSim({ inp: inp, op: op, mult: f * 0.98 }).need : null;
  }
  out.txt = R.finds.map(function (x) { return x.t + ' ' + x.s + ' ' + (x.ml || '') + ' ' + x.money; }).join('\\n');
  out.finds = R.finds.map(function (x) { return x.id.split('-')[0]; });
  out.T = opTarget(R, 20000, 18);
  return out;
}`, ctx);
const KINDS = ['deposit', 'decor', 'sign', 'tools', 'cold', 'furn', 'pos', 'photo', 'printer', 'stock', 'pack', 'util', 'train', 'brand', 'setup', 'launch', 'other'];
function shop(i) {
  const m = pick(['unit', 'resell', 'service']), where = pick(['shop', 'online', 'both']);
  const price = Math.round(r(15, 4000)), inp = {
    unitLabel: 'ชิ้น', price, unitCost: Math.round(price * r(0.05, 1.1) * 100) / 100, feePct: pick([0, 0, 3, 12, 20.33, 32.1]), volume: Math.round(r(0.5, 400) * 10) / 10,
    volumePer: pick(['day', 'month']), daysOpen: Math.round(r(10, 31)), staffCount: pick([0, 0, 1, 2, 5]), staffSalary: Math.round(r(8000, 25000)), ownerSalary: pick([0, 10000, 15000, 30000]),
    rent: where === 'online' ? pick([0, 0, 3000]) : Math.round(r(0, 60000)), marketing: Math.round(r(0, 20000)), otherFixed: Math.round(r(0, 20000)), advMode: 'no'
  };
  if (rnd() < 0.3) inp.season = { high: [pick([1, 2, 3, 4]), pick([10, 11, 12])], low: [pick([6, 7, 8])], highPct: Math.round(r(5, 80)), lowPct: Math.round(r(5, 90)) };
  if (rnd() < 0.2) inp.growth = Math.round(r(-3, 6) * 10) / 10;
  if (rnd() < 0.15) inp.creditDays = pick([7, 15, 30, 45, 60]);
  if (rnd() < 0.15) inp.supplierCreditDays = pick([7, 15, 30, 60]);
  const items = [];
  const nI = Math.floor(r(0, 9));
  for (let k = 0; k < nI; k++) {
    const kk = pick(KINDS), t = kk === 'deposit' || kk === 'util' ? 'back' : kk === 'stock' || kk === 'pack' ? 'stock' : ['tools', 'cold', 'furn', 'pos', 'photo', 'printer'].includes(kk) ? 'equip' : pick(['gone', 'back', 'stock', 'equip']);
    items.push({ id: 'z' + k, k: kk, name: kk === 'other' ? 'อื่น' : '', amt: Math.round(r(0, 300000)), t, y: t === 'equip' ? pick([1, 3, 5, 10]) : null });
  }
  const rampP = pick(['now', 'r3', 'r6', 'honey', 'custom']);
  const op = { where, fit: pick([0, 0, 1, 2, 6]), openMonth: Math.ceil(r(0, 12)) || 1, seasonAsked: inp.season ? 'yes' : 'no', mode: rnd() < 0.2 ? 'lump' : 'items', lump: Math.round(r(0, 500000)), items,
    ramp: { p: rampP, c: rampP === 'custom' ? Array.from({ length: Math.floor(r(0, 24)) }, () => Math.round(r(0, 15)) / 10) : [] },
    savings: rnd() < 0.1 ? null : Math.round(r(0, 1500000)), range: pick([10, 20, 30]), sens: rnd() < 0.3 ? { over: Math.round(r(1, 100)), sales: Math.round(r(1, 90)), delay: Math.round(r(1, 24)), fixed: Math.round(r(1, 100)), cost: Math.round(r(1, 100)) } : null };
  return { m, inp, op };
}
const odd = [
  { m: 'unit', inp: { price: 1, unitCost: 0, feePct: 0, volume: 1, volumePer: 'month', staffCount: 0, ownerSalary: 0, rent: 0, marketing: 0, otherFixed: 0, advMode: 'no' }, op: { fit: 0, openMonth: 1, seasonAsked: 'no', mode: 'items', items: [], ramp: { p: 'now' }, savings: 0 } },
  { m: 'unit', inp: { price: 100, unitCost: 100, feePct: 0, volume: 100, volumePer: 'day', daysOpen: 30, staffCount: 0, ownerSalary: 0, rent: 10000, marketing: 0, otherFixed: 0, advMode: 'no' }, op: { fit: 1, openMonth: 1, seasonAsked: 'no', mode: 'lump', lump: 50000, items: [], ramp: { p: 'r6' }, savings: 1000000 } },
  { m: 'resell', inp: { price: 99999999, unitCost: 1, feePct: 99, volume: 9999, volumePer: 'month', staffCount: 99, staffSalary: 999999, ownerSalary: 999999, rent: 9999999, marketing: 0, otherFixed: 0, advMode: 'no' }, op: { fit: 24, openMonth: 12, seasonAsked: 'no', mode: 'items', items: [{ k: 'tools', amt: 99999999, t: 'equip', y: 0.5 }], ramp: { p: 'custom', c: Array(24).fill(0) }, savings: 99999999999 } },
  { m: 'service', inp: { price: 300, unitCost: 50, feePct: 0, volume: 0.1, volumePer: 'day', daysOpen: 1, staffCount: 0, ownerSalary: 0, rent: 0, marketing: 0, otherFixed: 0, advMode: 'no', season: { high: [], low: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], lowPct: 99 } }, op: { fit: 0, openMonth: 6, seasonAsked: 'yes', mode: 'items', items: [{ k: 'deposit', amt: 0, t: 'back' }], ramp: { p: 'honey' }, savings: 5 } },
  { m: 'unit', inp: { price: 60, unitCost: 22, feePct: 0, volume: 60, volumePer: 'day', daysOpen: 30, staffCount: 1, staffSalary: 13000, ownerSalary: 15000, rent: 12000, marketing: 0, otherFixed: 6000, advMode: 'no', creditDays: 365, supplierCreditDays: 365 }, op: { fit: 1, openMonth: 5, seasonAsked: 'no', mode: 'items', items: [], ramp: { p: 'r3' }, savings: 220000 } }
];
const T0 = Date.now(), times = [];
const all = odd.concat(Array.from({ length: 800 }, (_, i) => shop(i)));
all.forEach((s, i) => {
  ctx.__s = JSON.parse(JSON.stringify(s));
  const t0 = process.hrtime.bigint();
  let o;
  try { o = JSON.parse(JSON.stringify(vm.runInContext('__fz(__s.inp, __s.m, __s.op)', ctx))); } catch (e) { problem(i, 'threw ' + e.message, s); return; }
  times.push(Number(process.hrtime.bigint() - t0) / 1e6);
  runs++;
  if (!o.ok) { problem(i, 'not computed', s); return; }
  (o.finds || []).forEach(f => { seen[f] = (seen[f] || 0) + 1; });
  const fin = v => v === null || (typeof v === 'number' && isFinite(v));
  ['need', 'all', 'spent', 'low', 'left', 'lowN', 'highN'].forEach(k => { if (!fin(o[k])) problem(i, k + ' not finite', o[k]); });
  if (o.need < o.all - 1e-6) problem(i, 'need < startup', [o.need, o.all]);
  if (o.low > 1e-9) problem(i, 'lowest cumulative above 0', o.low);
  if (o.spent > o.all + 1e-6 || o.spent < -1e-6) problem(i, 'spent outside 0..all', [o.spent, o.all]);
  if (!o.balOk) problem(i, 'cash balance ≠ savings − startup + cumulative');
  if (o.payS !== null && o.payA !== null && o.payS > o.payA) problem(i, 'paid back spent money after all money', [o.payS, o.payA]);
  if (o.payA !== null && o.payS === null) problem(i, 'all money paid back but spent money not', [o.payS, o.payA]);
  /* ขายแล้วเหลือเงินต่อชิ้น (เงินที่เหลือต่อชิ้น > 0): ขายน้อยลง ต้องใช้เงินมากขึ้น · ขายแล้วขาดทุนทุกชิ้น: กลับกัน (ถูกต้อง) */
  /* ลูกค้าจ่ายช้า: ขายมากขึ้นต้องมีเงินจมในยอดค้างรับมากขึ้นช่วงแรก (ถูกต้อง) จึงตรวจเฉพาะร้านที่ไม่มียอดค้างรับ */
  if (o.cu > 0 && !n0c(s.inp.creditDays)) {
    if (o.lowN < o.need - 1e-6 || o.highN > o.need + 1e-6) problem(i, 'selling less must not need less money', [o.lowN, o.need, o.highN]);
    o.sens.forEach(x => { if (x[1] < -1e-6) problem(i, 'adverse change needs less money: ' + x[0], x); });
  } else o.sens.forEach(x => { if (['over', 'fixed', 'cost'].includes(x[0]) && x[1] < -1e-6) problem(i, 'adverse cost change needs less money: ' + x[0], x); });
  for (let k = 1; k < o.sens.length; k++) if (o.sens[k - 1][1] < o.sens[k][1] - 1e-9) problem(i, 'ranking not sorted', o.sens);
  if (o.save !== null && Math.abs(o.left - (o.save - o.need)) > 1e-6) problem(i, 'left ≠ savings − need', [o.left, o.save, o.need]);
  if (o.E) {
    if (o.E.ok !== (o.need <= o.save + 1e-6)) problem(i, 'enough flag wrong', [o.E.ok, o.need, o.save]);
    if (o.atMin !== undefined && o.atMin > o.save + Math.max(1, o.save * 1e-6)) problem(i, 'not enough at the minimum sales', [o.atMin, o.save]);
    if (o.belowMin !== undefined && o.belowMin !== null && o.belowMin <= o.save - 1e-6 && o.E.minVol > 1e-6) problem(i, 'still enough below the minimum sales', [o.belowMin, o.save, o.E.minVol]);
    if (o.E.ok && (o.E.delay === null || o.E.delay < 0)) problem(i, 'enough but no delay value', o.E);
  } else if (o.save !== null) problem(i, 'savings given but no enough card');
  if (/NaN|undefined|Infinity|\[object/.test(o.txt)) problem(i, 'bad text', (o.txt.match(/.{0,30}(NaN|undefined|Infinity|\[object).{0,20}/) || [])[0]);
  if (o.T.income !== null && !(o.T.income >= 0)) problem(i, 'target income negative', o.T);
});
times.sort((a, b) => a - b);
console.log('findings seen: ' + Object.keys(seen).map(k => k + ' ' + seen[k]).join(' · '));
console.log(runs + ' runs · ' + bad + ' problems · ' + ((Date.now() - T0) / 1000).toFixed(1) + ' s');
console.log('timing opCompute (60 months, 3 scenarios, enough, 5 what-ifs): median ' + times[Math.floor(times.length / 2)].toFixed(1) + ' ms · p95 ' + times[Math.floor(times.length * 0.95)].toFixed(1) + ' ms');
console.log(bad ? 'FUZZ PROBLEMS' : 'FUZZ OK');
process.exit(bad ? 1 : 0);
