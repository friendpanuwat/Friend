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
/* การตัดสินใจตัวอย่างที่เข้ากับร้านแต่ละรูปแบบ (ใช้ใน test เท่านั้น) · ki = ลำดับของแบบย่อย (วนตามจำนวนแบบที่เรื่องนั้นมี) */
function kindsFor(ctx, T, inp, m) { ctx.__a = { inp, m, T }; return vm.runInContext('kindsOf(__a.T, __a.inp, __a.m).map(function (k) { return k[0]; })', ctx); }
function genDec(ctx, T, inp, m, ki) {
  const R = (c) => { ctx.__a = { inp, m }; return vm.runInContext(c, ctx); };
  const g = R('phGain(__a.inp, __a.m)'), fx = R('fixedTotal(__a.inp)');
  const rent = inp.rent || 0, sal = inp.staffSalary || 12000, price = inp.price || 100, uc = inp.unitCost || 30;
  const ks = kindsFor(ctx, T, inp, m), kind = ks.length ? ks[(ki || 0) % ks.length] : undefined;
  const K = (o) => (kind ? Object.assign({ kind }, o) : o);
  if (T === 'hire') return K(kind === 'part' ? { count: 1, partRate: 60, partHours: 5, partDays: 26, gain: g, ramp: 1, capAdd: 10, hours: 3 }
    : kind === 'piece' ? { pieceRate: Math.max(1, Math.round(price * 0.05)), pieceShare: 100, gain: g, ramp: 1 }
      : { count: 1, salary: sal, gain: g, ramp: 1, capAdd: 10, hours: 3 });
  if (T === 'price') return K({ raiseBy: Math.max(1, Math.round((inp.price || inp.fee || inp.projectValue || inp.pricePerPeriod || 100) * 0.08)), raiseShare: 50, lostPct: 5 });
  if (T === 'promo') return K({ discPct: 15, usePct: 40, giftCost: Math.max(1, Math.round(price * 0.05)), promoMonths: 2, lift: 25, afterPct: 5, promoCost: 2000 });
  if (T === 'newprod') return K({ npPrice: Math.round(price * 0.8), npCost: Math.round(uc * 0.8), npQty: g, npAttach: 15, npCanni: 20, npFixed: 500, npSetup: 10000, ramp: 1 });
  if (T === 'freeship') return K({ shipOrders: 100, shipCost: kind === 'part' ? 15 : 30, shipShare: 50, perOrder: kind === 'min' ? 1.5 : 1, shipLift: 10, ramp: 1 });
  if (T === 'ads') return K({ adBudget: 5000, adMgmt: 0, adSetup: 2000, adGain: g, ramp: 1 });
  if (T === 'freelance') return K({ flFee: 6000, flPct: 5, flGain: g, ramp: 1, hours: 2 });
  if (T === 'supplier') return K(kind === 'better' ? { newCost: uc * 1.1, supSales: 5, supStock: 30, supCredit: 15, switchCost: 0 } : { newCost: uc * 0.9, supSales: -3, switchCost: 3000 });
  if (T === 'place') return { newRent: Math.round(rent * 1.3) || 10000, salesPct: 15, moveCost: 100000, closedDays: 5, dipPct: 20, backMonths: 3 };
  if (T === 'channel') return K({ chName: 'ช่องทางทดสอบ', cut: 25, chQty: g, movePct: 20, chFee: 1000, extraCost: ['unit', 'service', 'resell'].includes(m) ? 2 : 0, ramp: 1 });
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
module.exports = { load, genDec, sampleInp, kindsFor };
