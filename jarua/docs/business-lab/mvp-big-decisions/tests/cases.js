/* ตัวช่วยของ test: โหลดโค้ดชุดเดียวกับหน้าเว็บ (ตัวคำนวณ PL2 + ข้อมูลร้านของตัวที่ 1 + ตัวที่ 3) แล้วสร้างการตัดสินใจตัวอย่างของทุกรูปแบบ */
const fs = require('fs'), vm = require('vm'), path = require('path');
const D = path.join(__dirname, '..');
function load() {
  const ctx = { console, Math, Date, JSON, Object, Array, String, Number, isFinite, parseFloat, Map };
  vm.createContext(ctx);
  for (const f of ['.out/calc.js', '../mvp-check-numbers/src/data.js', '../mvp-check-numbers/src/engine.js', 'src/topics.js', 'src/decide.js'])
    vm.runInContext(fs.readFileSync(path.join(D, f), 'utf8'), ctx, { filename: f });
  return ctx;
}
/* การตัดสินใจตัวอย่างที่เข้ากับร้านแต่ละรูปแบบ (ใช้ใน test เท่านั้น) */
function genDec(ctx, T, inp, m) {
  const R = (c) => { ctx.__a = { inp, m }; return vm.runInContext(c, ctx); };
  const g = R('phGain(__a.inp, __a.m)'), fx = R('fixedTotal(__a.inp)');
  const rent = inp.rent || 0, sal = inp.staffSalary || 12000;
  if (T === 'hire') return { count: 1, salary: sal, gain: g, ramp: 1, capAdd: 10, hours: 3 };
  if (T === 'place') return { newRent: Math.round(rent * 1.3) || 10000, salesPct: 15, moveCost: 100000, closedDays: 5, dipPct: 20, backMonths: 3 };
  if (T === 'channel') return { chName: 'ช่องทางทดสอบ', cut: 25, chQty: g, movePct: 20, chFee: 1000, extraCost: ['unit', 'service', 'resell'].includes(m) ? 2 : 0, ramp: 1 };
  if (T === 'equip') return { price: 80000, life: 5, eqGain: g, costDown: 1, fixedChg: Math.min(500, fx), ramp: 1, eqCap: 10 };
  return { setup: 300000, bRent: rent || 10000, bStaff: 1, bSalary: 12000, bOther: 5000, bPct: 70, ramp: 3 };
}
function sampleInp(ctx, m) {
  const inp = JSON.parse(vm.runInContext(`JSON.stringify(MODELS['${m}'].sample)`, ctx));
  const per = vm.runInContext(`MODELS['${m}'].defPer`, ctx);
  if (per && !inp.volumePer) inp.volumePer = per;
  if (m === 'subscription' && !inp.cycle) inp.cycle = 1;
  if (m === 'rental' && !inp.periodKind) inp.periodKind = 'night';
  return inp;
}
module.exports = { load, genDec, sampleInp };
