/* ============================================================
   ENGINE — ทุกตัวเลขคำนวณผ่าน JaruaCalc.calculateV4 (ตัวคำนวณของ PL2) ไม่มีสูตรกำไรของตัวเอง
   ส่วนที่คิดเพิ่มใน Lab: แปลงผลเป็นภาษาของร้าน · หาเรื่องที่ตัวเลขบอก · ขนาดเป็นเงิน
   ============================================================ */

var TH_MONTHS = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
var NOW = new Date();
var START_MONTH = NOW.getMonth() + 1;
var START_YEAR = NOW.getFullYear();

function num(v) {
  if (v === null || v === undefined || v === '') return null;
  var n = typeof v === 'number' ? v : parseFloat(String(v).replace(/[,\s]/g, ''));
  return isFinite(n) ? n : null;
}
function n0(v) { var n = num(v); return n === null ? 0 : n; }
function pos(v) { var n = num(v); return n !== null && n > 0 ? n : null; }
function hasSeason(i) { return !!(i.season && ((i.season.high && i.season.high.length) || (i.season.low && i.season.low.length))); }

/* เดือนที่ t ของแผน (1 = เดือนนี้) → ป้ายเดือนไทย */
function calOf(t) { return ((START_MONTH - 1 + t - 1) % 12 + 12) % 12 + 1; }
function yearOf(t) { return START_YEAR + Math.floor((START_MONTH - 1 + t - 1) / 12); }
function monthLabel(t, withYear) {
  var c = calOf(t);
  return TH_MONTHS[c - 1] + (withYear ? ' ' + String((yearOf(t) + 543) % 100).padStart(2, '0') : '');
}

function daysOf(inp) { return inp.volumePer === 'month' ? 30 : (pos(inp.daysOpen) || 30); }
function volMonthly(inp) {
  var v = num(inp.volume);
  if (v === null) return null;
  return inp.volumePer === 'month' ? v : v * daysOf(inp);
}
function fixedParts(inp) {
  return {
    staff: n0(inp.staffCount) * n0(inp.staffSalary),
    owner: n0(inp.ownerSalary),
    rent: n0(inp.rent),
    marketing: n0(inp.marketing),
    other: n0(inp.otherFixed)
  };
}
function fixedTotal(inp) { var p = fixedParts(inp); return p.staff + p.owner + p.rent + p.marketing + p.other; }

function missingFields(inp, model) {
  var miss = [];
  FIELDS.forEach(function (f) {
    if (!f.req) return;
    if (f.models && f.models.indexOf(model) < 0) return;
    if (f.show && !f.show(inp, model)) return;
    var v = f.k === 'volume' ? num(inp.volume) : num(inp[f.k]);
    if (v === null) miss.push(f.label(inp, model));
  });
  return miss;
}

function buildStream(inp, m) {
  var base = { id: 'main', name: 'รายได้หลัก', type: m, unitLabel: U(inp, m),
    growthRatePercentMonthly: num(inp.growth), creditDays: n0(inp.creditDays) };
  if (isVolModel(m)) {
    var days = daysOf(inp);
    var cap = pos(inp.capacity);
    var capPerDay = cap === null ? null : (inp.volumePer === 'month' ? cap / days : cap);
    var capMonth = cap === null ? null : (inp.volumePer === 'month' ? cap : cap * days);
    return Object.assign(base, {
      price: pos(inp.price), costPerUnit: num(inp.unitCost), unitsPerMonth: volMonthly(inp),
      variableCostPercent: n0(inp.feePct),
      productionType: m === 'resell' ? 'buys_to_resell' : 'makes_own',
      capacity: m === 'resell' ? { sourcedPerMonth: capMonth } : { producedPerDay: capPerDay },
      inventoryDays: n0(inp.stockDays), supplierCreditDays: n0(inp.supplierCreditDays),
      purchasesPerCustomerPerMonth: num(inp.repeatPerMonth), customerLifespanMonths: num(inp.lifespanMonths)
    });
  }
  if (m === 'subscription') return Object.assign(base, {
    unitLabel: 'คน', activeMembers: n0(inp.members), feePerCycle: n0(inp.fee), cycleMonths: pos(inp.cycle) || 1,
    newMembersPerMonth: n0(inp.newMembers), leavingMembersPerMonth: n0(inp.leaving), costPerMemberPerMonth: n0(inp.costPerMember),
    maxMembers: pos(inp.maxMembers), joinFee: n0(inp.joinFee), variableCostPercent: n0(inp.feePct), growthRatePercentMonthly: 0
  });
  if (m === 'project') return Object.assign(base, {
    unitLabel: 'งาน', avgProjectValue: n0(inp.projectValue), projectsPerYear: n0(inp.projectsPerYear),
    durationMonths: Math.max(1, n0(inp.durationMonths)), directCostPercent: n0(inp.directCostPct), depositPercent: n0(inp.depositPct),
    maxConcurrentProjects: pos(inp.maxConcurrent)
  });
  if (m === 'rental') return Object.assign(base, {
    rentableUnits: n0(inp.rentableUnits), pricePerPeriod: n0(inp.pricePerPeriod), periodsPerMonth: inp.periodKind === 'month' ? 1 : 30,
    occupancyPercent: n0(inp.occupancy), costPerOccupiedPeriod: n0(inp.costPerOccupied), avgPeriodsPerStay: pos(inp.avgStay),
    costPerStay: n0(inp.costPerStay), variableCostPercent: n0(inp.feePct)
  });
  if (m === 'commission') return Object.assign(base, {
    unitLabel: 'ดีล', dealsPerMonth: n0(inp.dealsPerMonth), avgDealValue: n0(inp.avgDealValue), commissionPercent: n0(inp.commissionPct),
    splitPercent: n0(inp.splitPct), maxDealsPerMonth: pos(inp.maxDeals)
  });
  return Object.assign(base, { unitLabel: 'บาท', amountPerMonth: n0(inp.amount), variableCostPercent: n0(inp.costPct) });
}

function seasonOf(inp) {
  if (!hasSeason(inp)) return null;
  return { highMonths: inp.season.high || [], lowMonths: inp.season.low || [],
    highPercent: n0(inp.season.highPct), lowPercent: n0(inp.season.lowPct) };
}

function v4Input(inp, m) {
  var assets = pos(inp.equipValue) && pos(inp.equipYears)
    ? [{ name: 'อุปกรณ์', purchasePrice: pos(inp.equipValue), usefulLifeYears: pos(inp.equipYears) }] : null;
  return {
    streams: [buildStream(inp, m)],
    fixedCostsMonthly: fixedTotal(inp),
    cashOnHand: num(inp.cash),
    daysOpenPerMonth: isVolModel(m) ? daysOf(inp) : null,
    planStartMonth: START_MONTH,
    seasonality: seasonOf(inp),
    marketingSpendMonthly: n0(inp.marketing),
    newCustomersPerMonth: m === 'subscription' ? num(inp.newMembers) : num(inp.newCustomers),
    assets: assets
  };
}

/* ---------- ปริมาณในภาษาของแต่ละรูปแบบ ---------- */
function volValue(inp, m) {
  if (isVolModel(m)) return num(inp.volume);
  return num(inp[ROLE[m].vol]);
}
function volUnitText(inp, m) {
  if (isVolModel(m)) return U(inp, m) + '/' + perWord(inp);
  return { subscription: 'คน', project: 'งาน/ปี', rental: '%', commission: 'ดีล/เดือน', other: 'บาท/เดือน' }[m];
}
function scaleVol(inp, m, f) {
  var o = Object.assign({}, inp);
  if (isVolModel(m)) o.volume = n0(inp.volume) * f;
  else if (m === 'subscription') { o.members = n0(inp.members) * f; o.newMembers = n0(inp.newMembers) * f; o.leaving = n0(inp.leaving) * f; }
  else o[ROLE[m].vol] = n0(inp[ROLE[m].vol]) * f;
  return o;
}

/* ---------- compute: เรียก v4 แล้วสรุปเป็นภาพของร้าน ---------- */
function compute(inp, m) {
  var miss = missingFields(inp, m);
  if (miss.length) return { ok: false, missing: miss };
  var r;
  try { r = JaruaCalc.calculateV4(v4Input(inp, m)); } catch (e) { return { ok: false, missing: [], error: String(e) }; }
  if (r.netProfitMonthly === null || r.revenueMonthly === null) return { ok: false, missing: [], r: r };

  var S = { ok: true, r: r, m: m };
  S.revenue = r.revenueMonthly;
  S.varCost = r.variableCostMonthly;
  S.contribution = S.revenue - S.varCost;
  S.fixed = r.fixedCostsMonthly;
  S.dep = r.depreciation.monthlyTotal;
  S.profit = r.netProfitMonthly;
  S.owner = n0(inp.ownerSalary);
  S.parts = fixedParts(inp);
  S.vol = volValue(inp, m);
  S.volMonth = isVolModel(m) ? volMonthly(inp) : null;
  S.days = isVolModel(m) ? daysOf(inp) : 30;

  /* จุดคุ้มทุน */
  S.be = null;
  if (r.breakeven.contributionNotPositive || S.contribution <= 0) {
    S.be = { impossible: true };
  } else if (isVolModel(m) && r.breakeven.unitsPerMonth !== null) {
    var beM = r.breakeven.unitsPerMonth;
    var bePer = inp.volumePer === 'month' ? beM : (r.perDay.breakevenUnits !== null ? r.perDay.breakevenUnits : beM / S.days);
    S.be = { vol: bePer, revenue: r.breakeven.revenueBaht, safety: S.volMonth > 0 ? (S.volMonth - beM) / S.volMonth : null };
  } else if (r.breakeven.revenueBaht !== null && S.revenue > 0) {
    var ratio = r.breakeven.revenueBaht / S.revenue;
    S.be = { vol: S.vol * ratio, revenue: r.breakeven.revenueBaht, safety: 1 - ratio };
  }

  /* เงินสด 12 เดือน */
  S.hasCash = num(inp.cash) !== null;
  S.cash = r.projection.map(function (p) { return { t: p.month, bal: p.cashBalance !== null ? p.cashBalance : p.cumulativeCashFlow, net: p.netCashFlow, profit: p.netProfitAccounting, rev: p.revenue }; });
  S.cashStart = S.hasCash ? num(inp.cash) : 0;
  S.lowest = null; S.lowestT = null; S.firstNegT = null;
  S.cash.forEach(function (c) {
    if (S.lowest === null || c.bal < S.lowest) { S.lowest = c.bal; S.lowestT = c.t; }
    if (S.hasCash && S.firstNegT === null && c.bal < 0) S.firstNegT = c.t;
  });
  S.cashEnd = S.cash.length ? S.cash[S.cash.length - 1].bal : null;
  S.profit12 = S.cash.length ? S.cash[S.cash.length - 1].profit : S.profit;

  /* เงิน 100 บาทที่ลูกค้าจ่าย */
  var feePctKey = m === 'other' ? null : 'feePct';
  var fee = feePctKey ? S.revenue * n0(inp.feePct) / 100 : 0;
  var direct = S.varCost - fee;
  var directLabel = { unit: 'ค่าวัตถุดิบและบรรจุภัณฑ์', service: 'ของที่ใช้และค่ามือช่าง', resell: 'ค่าของที่ซื้อมา',
    subscription: 'ของและบริการที่ให้สมาชิก', project: 'ต้นทุนของแต่ละงาน', rental: 'ค่าใช้จ่ายต่อ' + periodWord(inp),
    commission: 'ส่วนแบ่งให้ทีม', other: 'ต้นทุนของรายได้นี้' }[m];
  var items = [
    ['direct', directLabel, direct], ['fee', 'ค่าธรรมเนียม', fee],
    ['staff', 'เงินเดือนพนักงาน', S.parts.staff], ['owner', 'เงินเดือนคุณ', S.parts.owner], ['rent', 'ค่าเช่า', S.parts.rent],
    ['marketing', 'การตลาด', S.parts.marketing], ['other', 'ค่าใช้จ่ายอื่น', S.parts.other], ['dep', 'กันไว้ซื้ออุปกรณ์ใหม่', S.dep]
  ];
  S.split = items.filter(function (x) { return Math.abs(x[2]) > 0.5; }).map(function (x) {
    return { k: x[0], label: x[1], amount: x[2], per100: S.revenue > 0 ? x[2] / S.revenue * 100 : 0 };
  });
  S.keep100 = S.revenue > 0 ? S.profit / S.revenue * 100 : 0;

  /* กำลังรับ */
  S.util = null;
  if (isVolModel(m) && r.capacity.currentUtilizationPercent !== null) {
    var capM = r.capacity.maxUnitsPerMonth;
    S.util = { pct: r.capacity.currentUtilizationPercent, max: inp.volumePer === 'month' ? capM : capM / S.days, reachT: r.capacity.monthCapacityReached };
  } else if (m === 'subscription' && pos(inp.maxMembers)) {
    S.util = { pct: n0(inp.members) / pos(inp.maxMembers) * 100, max: pos(inp.maxMembers), reachT: null };
    for (var i = 0; i < r.projection.length; i++) if (r.projection[i].exceedsCapacity) { S.util.reachT = i + 1; break; }
  } else if (m === 'project' && pos(inp.maxConcurrent)) {
    var conc = n0(inp.projectsPerYear) / 12 * Math.max(1, n0(inp.durationMonths));
    S.util = { pct: conc / pos(inp.maxConcurrent) * 100, max: pos(inp.maxConcurrent), conc: conc, reachT: null };
  } else if (m === 'commission' && pos(inp.maxDeals)) {
    S.util = { pct: n0(inp.dealsPerMonth) / pos(inp.maxDeals) * 100, max: pos(inp.maxDeals), reachT: null };
  } else if (m === 'rental') {
    S.util = { pct: n0(inp.occupancy), max: 100, reachT: null, rental: true };
  }

  /* ลูกค้า 1 คน */
  S.cust = null;
  var ce = r.customerEconomics;
  if (isVolModel(m) && ce.profitPerCustomerLifetime !== null) {
    S.cust = { cac: ce.costToAcquireOneCustomer, ltvProfit: ce.profitPerCustomerLifetime, ratio: ce.profitToAcquisitionCostRatio, newPerMonth: num(inp.newCustomers) };
  } else if (m === 'subscription' && n0(inp.leaving) > 0 && n0(inp.members) > 0) {
    var cyc = pos(inp.cycle) || 1;
    var perMonth = n0(inp.fee) / cyc * (1 - n0(inp.feePct) / 100) - n0(inp.costPerMember);
    var life = n0(inp.members) / n0(inp.leaving);
    var cac = n0(inp.newMembers) > 0 ? n0(inp.marketing) / n0(inp.newMembers) : null;
    S.cust = { cac: cac, ltvProfit: perMonth * life, life: life, ratio: cac && cac > 0 ? perMonth * life / cac : null, newPerMonth: n0(inp.newMembers) };
  }
  return S;
}

function profitOf(inp, m) { var S = compute(inp, m); return S.ok ? S.profit : null; }
function withK(inp, k, v) { var o = Object.assign({}, inp); o[k] = v; return o; }
function roleKey(m, role) {
  if (role === 'vol') return ROLE[m].vol;
  if (role === 'price') return ROLE[m].price;
  if (role === 'cost') return ROLE[m].cost;
  return role;
}

/* ---------- ขนาดก้าวที่อ่านง่าย ---------- */
function niceStep(x) {
  if (!(x > 0)) return 1;
  var mag = Math.pow(10, Math.floor(Math.log10(x)));
  var f = x / mag;
  var s = f < 1.5 ? 1 : f < 3.5 ? 2 : f < 7.5 ? 5 : 10;
  return s * mag;
}
function leverStep(k, inp, m) {
  var v = Math.abs(n0(inp[k]));
  var pctKeys = { feePct: 1, directCostPct: 1, commissionPct: 1, splitPct: 1, costPct: 1, occupancy: 1 };
  if (pctKeys[k]) return k === 'commissionPct' ? 0.1 : 1;
  if (k === 'staffCount') return 1;
  if (k === 'volume') return inp.volumePer === 'month' ? Math.max(1, niceStep(v * 0.02)) : (v >= 200 ? niceStep(v * 0.02) : 1);
  if (k === 'members' || k === 'newMembers' || k === 'leaving') return 1;
  if (k === 'projectsPerYear') return 1;
  if (k === 'dealsPerMonth') return 0.5;
  if (k === 'price' || k === 'pricePerPeriod' || k === 'fee' || k === 'unitCost' || k === 'costPerMember' || k === 'costPerOccupied') return v < 100 ? 1 : niceStep(v * 0.01);
  if (k === 'staffSalary' || k === 'ownerSalary' || k === 'rent' || k === 'marketing' || k === 'otherFixed') return v > 0 ? Math.max(100, niceStep(v * 0.02)) : 500;
  return Math.max(1, niceStep(v * 0.01));
}
function leverRange(k, inp, m) {
  var v = n0(inp[k]);
  var st = leverStep(k, inp, m);
  var pctKeys = { feePct: 1, directCostPct: 1, splitPct: 1, costPct: 1, occupancy: 1 };
  var lo = 0, hi;
  if (pctKeys[k]) hi = Math.min(100, Math.max(v * 2, v + 20));
  else if (k === 'commissionPct') hi = Math.max(v * 2, 5);
  else if (k === 'staffCount') hi = Math.max(v + 5, v * 2);
  else if (k === 'price' || k === 'pricePerPeriod' || k === 'fee' || k === 'projectValue' || k === 'avgDealValue') { lo = Math.max(0, Math.floor(v * 0.5 / st) * st); hi = Math.ceil(v * 1.6 / st) * st; }
  else if (k === 'ownerSalary') hi = Math.max(v * 2, 50000);
  else if (k === 'marketing') hi = Math.max(v * 3, 30000);
  else if (k === 'leaving' || k === 'newMembers') hi = Math.max(v * 3, 20);
  else if (k === 'staffSalary') hi = Math.max(v * 2, 30000);
  else hi = Math.max(v * 2, st * 20);
  hi = Math.ceil(hi / st) * st;
  return [lo, Math.max(hi, lo + st)];
}

/* ผลของตัวเลขทีละก้าว → กำไรต่อเดือนเปลี่ยนเท่าไหร่ */
function leverEffect(k, inp, m, step) {
  var p0 = profitOf(inp, m);
  var p1 = profitOf(withK(inp, k, n0(inp[k]) + step), m);
  if (p0 === null || p1 === null) return null;
  return p1 - p0;
}

/* ตัวเลขที่ขยับ 10% แล้วกำไรเปลี่ยนมากที่สุด (ใช้ค่าจาก v4 เมื่อเป็นธุรกิจขายเป็นหน่วย) */
function sensitivity(S, inp, m) {
  var out = [];
  var u = U(inp, m);
  if (isVolModel(m) && S.r.sensitivity) {
    var name = { price: ['ราคาขาย', 'ขึ้นราคา 10%', 'price'], volume: [m === 'service' ? 'จำนวนลูกค้า' : 'จำนวนที่ขายได้', 'ขายได้เพิ่ม 10%', 'volume'],
      unitCost: ['ต้นทุนต่อ' + u, 'ต้นทุนลดลง 10%', 'unitCost'], fixedCosts: ['ค่าใช้จ่ายคงที่ทั้งหมด', 'ลดลง 10%', null] };
    S.r.sensitivity.forEach(function (s) { var n = name[s.key]; out.push({ label: n[0], how: n[1], gain: s.profitChangeIfImproved10Percent, lever: n[2] }); });
  } else {
    var R = ROLE[m];
    var items = [];
    if (R.price) items.push([R.price, 1.1, leverLabel(R.price, inp, m)[1], 'เพิ่มขึ้น 10%']);
    items.push([R.vol, 1.1, m === 'rental' ? 'คนเช่า' : leverLabel(R.vol, inp, m)[1], 'เพิ่มขึ้น 10%']);
    if (R.cost && n0(inp[R.cost]) > 0) items.push([R.cost, 0.9, leverLabel(R.cost, inp, m)[1], 'ลดลง 10%']);
    if (m === 'subscription' && n0(inp.leaving) > 0) items.push(['leaving', 0.9, 'สมาชิกที่เลิก', 'ลดลง 10% (ผลในเดือนที่ 12)']);
    items.forEach(function (it) {
      var alt = withK(inp, it[0], n0(inp[it[0]]) * it[1]);
      if (it[0] === 'members') alt = scaleVol(inp, m, 1.1);
      var S2 = compute(alt, m);
      if (!S2.ok) return;
      var gain = it[0] === 'leaving' ? S2.profit12 - S.profit12 : S2.profit - S.profit;
      out.push({ label: it[2], how: it[3], gain: gain, lever: it[0] });
    });
    var alt2 = Object.assign({}, inp);
    ['staffSalary', 'ownerSalary', 'rent', 'marketing', 'otherFixed'].forEach(function (k) { alt2[k] = n0(inp[k]) * 0.9; });
    var S3 = compute(alt2, m);
    if (S3.ok) out.push({ label: 'ค่าใช้จ่ายคงที่ทั้งหมด', how: 'ลดลง 10%', gain: S3.profit - S.profit, lever: null });
  }
  out.sort(function (a, b) { return b.gain - a.gain; });
  return out.filter(function (x) { return x.gain > 0.5; });
}

/* ---------- ทางที่ตัวเลขจะไปถึงเป้า (กำไรเพิ่ม need บาท/เดือน) ---------- */
function waysTo(need, S, inp, m, scaleF) {
  scaleF = scaleF || 1;
  var ways = [];
  var u = U(inp, m);
  var R = ROLE[m];
  /* ปริมาณ */
  if (S.contribution > 0 && S.vol) {
    var perVol = S.contribution * scaleF / S.vol;
    var targetVol = S.vol + need / perVol;
    {
      /* แสดงเป็นยอดปกติ (ก่อนตก) เสมอ: เป้าในโลกที่ยอดตก ÷ ตัวคูณ */
      var normT = targetVol / scaleF, normNow = S.vol / scaleF;
      var tv = R.vol === 'occupancy' || R.vol === 'amount' ? Math.ceil(normT) : (normNow < 30 ? Math.ceil(normT * 10) / 10 : Math.ceil(normT));
      var capNote = S.util && !S.util.rental && S.util.max && tv > S.util.max ? ' · เกินกำลังที่ทำได้ (สูงสุด ' + fmtN(S.util.max) + ')' : '';
      if (m === 'rental' && tv > 100) ways.push({ text: 'ต่อให้มีคนเช่าเต็ม 100% ก็ยังไม่พอ', lever: null });
      else if (R.vol === 'occupancy') ways.push({ text: (scaleF !== 1 ? 'ปกติ' : '') + volVerb(m) + ' <b>' + fmtN(tv) + '%</b> (ตอนนี้ ' + fmtN(normNow) + '%)', lever: R.vol, value: tv,
        label: (scaleF !== 1 ? 'ปกติ' : '') + volVerb(m), big: fmtN(tv) + '%', note: 'ตอนนี้ ' + fmtN(normNow) + '%' });
      else ways.push({ text: (scaleF !== 1 ? 'ปกติ' : '') + volVerb(m) + ' <b>' + fmtN(tv) + '</b> ' + volUnitText(inp, m) + ' (ตอนนี้ ' + fmtN(normNow) + ' · เพิ่ม ' + fmtPct((tv / normNow - 1) * 100) + ')' + capNote,
        lever: R.vol, value: tv, label: (scaleF !== 1 ? 'ปกติ' : '') + volVerb(m), big: fmtN(tv) + ' ' + volUnitText(inp, m),
        note: 'ตอนนี้ ' + fmtN(normNow) + ' · เพิ่ม ' + fmtPct((tv / normNow - 1) * 100) + capNote });
    }
  }
  /* ราคา */
  if (R.price) {
    var st = leverStep(R.price, inp, m);
    var eff = (profitOf(withK(scaleVol(inp, m, scaleF), R.price, n0(inp[R.price]) + st), m) - profitOf(scaleVol(inp, m, scaleF), m)) / st;
    if (eff > 0) {
      var tp = n0(inp[R.price]) + need / eff;
      tp = Math.ceil(tp / st) * st;
      var unitTxt = R.price === 'commissionPct' ? '%' : 'บาท';
      ways.push({ text: priceVerb(m) + ' <b>' + fmtN(tp) + '</b> ' + unitTxt + ' (ตอนนี้ ' + fmtN(n0(inp[R.price])) + ' · เพิ่ม ' + fmtPct((tp / n0(inp[R.price]) - 1) * 100) + ') โดย' + (m === 'rental' ? 'คนเช่า' : 'ลูกค้า') + 'เท่าเดิม',
        lever: R.price, value: tp, label: priceVerb(m), big: fmtN(tp) + (unitTxt === '%' ? '%' : ' บาท'),
        note: 'ตอนนี้ ' + fmtN(n0(inp[R.price])) + ' · เพิ่ม ' + fmtPct((tp / n0(inp[R.price]) - 1) * 100) + ' · ' + (m === 'rental' ? 'คนเช่า' : 'ลูกค้า') + 'เท่าเดิม' });
    }
  }
  /* ค่าใช้จ่ายคงที่ */
  var fx = S.fixed;
  if (fx > 0) {
    if (need >= fx) ways.push({ text: 'ต่อให้ค่าใช้จ่ายคงที่เป็น 0 ก็ยังไม่พอ', lever: null });
    else {
      /* ปุ่มลองดู: ใช้ก้อนค่าใช้จ่ายที่ไม่ใช่เงินเดือนคน ก้อนที่ใหญ่พอรับส่วนที่ต้องลด */
      var big = ['rent', 'otherFixed', 'marketing'].map(function (k) { return [k, n0(inp[k])]; })
        .filter(function (x) { return x[1] >= need; }).sort(function (a, b) { return b[1] - a[1]; })[0];
      var lv = null, val = null;
      if (big) { lv = big[0]; val = Math.max(0, Math.floor((big[1] - need) / 100) * 100); }
      ways.push({ text: 'ค่าใช้จ่ายคงที่ลดลง <b>' + fmtN(Math.ceil(need / 100) * 100) + '</b> บาท/เดือน (ตอนนี้ ' + fmtN(fx) + ')', lever: lv, value: val,
        label: 'ค่าใช้จ่ายคงที่ลดลง', big: fmtN(Math.ceil(need / 100) * 100) + ' บาท/เดือน', note: 'ตอนนี้ ' + fmtN(fx) + (lv ? ' · ลองดูจาก' + { rent: 'ค่าเช่า', otherFixed: 'ค่าใช้จ่ายอื่น', marketing: 'การตลาด' }[lv] : '') });
    }
  }
  return ways;
}
function volVerb(m) { return { unit: 'ขายให้ได้', service: 'มีลูกค้า', resell: 'ขายให้ได้', subscription: 'มีสมาชิก', project: 'ได้งาน', rental: 'มีคนเช่า', commission: 'ปิดดีลได้', other: 'ได้เงิน' }[m]; }
function priceVerb(m) { return { subscription: 'ค่าสมาชิกเป็น', project: 'ราคาต่องานเป็น', rental: 'ราคาเป็น', commission: 'ค่าคอมเป็น' }[m] || 'ราคาขายเป็น'; }

/* ---------- เรื่องที่ตัวเลขบอก ----------
   เกณฑ์ใช้ตัวเลขของร้านเอง ไม่เทียบร้านอื่น · เกณฑ์ที่ PL2 มีอยู่แล้วใช้ตัวเดียวกัน (ฉากแย่ −20% · ใช้กำลัง > 90% · ลูกค้า 1 คนกำไร < ค่าหา) */
var LV_ORDER = { high: 0, mid: 1, watch: 2, note: 3 };
function detect(S, inp, m) {
  var F = [];
  if (!S.ok) return F;
  var u = U(inp, m);
  var P = S.profit;

  /* เงินสดจะติดลบ */
  if (S.hasCash && S.lowest !== null && S.lowest < 0) {
    var short = -S.lowest;
    var timing = P >= 0;
    F.push({ id: 'cashout', lv: 'high', urgent: true,
      title: timing ? 'มีกำไร แต่เงินจะขาดมือ' : 'เงินสดจะหมด',
      money: short, unit: 'once', moneyText: fmtN(short) + ' บาท', moneyCap: 'เงินที่จะขาดในเดือน ' + monthLabel(S.lowestT, true) + ' (ช่วงที่เงินในมือต่ำที่สุด)',
      ev: [timing ? 'ทั้งปีร้านยังมีกำไร แต่เงินเข้าช้ากว่าเงินออก เงินในมือจะเริ่มติดลบเดือน ' + monthLabel(S.firstNegT, true)
                  : 'เงินที่มีตอนนี้ ' + fmtN(S.cashStart) + ' บาท จะหมดราวเดือน ' + monthLabel(S.firstNegT, true) + ' ถ้าตัวเลขยังเป็นแบบนี้'],
      q: P < 0 ? QSETS.gap[m].slice(0, 2).concat(QSETS.cash.all) : QSETS.cash.all, lever: 'cash' });
  }

  /* ขาดทุน */
  if (P < 0) {
    var neg = S.be && S.be.impossible;
    var ev = [];
    if (neg) ev.push('ราคาที่ได้ต่อ' + u + ' ยังไม่พอจ่ายต้นทุนที่เพิ่มตามยอดขาย ยิ่งขายมากยิ่งขาดทุนมาก');
    else if (S.be) ev.push('ต้อง' + volVerb(m) + 'อย่างน้อย ' + fmtN(S.be.vol, 1) + ' ' + volUnitText(inp, m) + ' ตอนนี้ ' + fmtN(S.vol) + ' ' + volUnitText(inp, m));
    if (S.owner > 0 && P + S.owner > 0) ev.push('ถ้าไม่นับเงินเดือนคุณ ร้านยังเหลือเงินเดือนละ ' + fmtN(P + S.owner) + ' บาท แปลว่าร้านจ่ายเงินเดือนคุณได้ ' + fmtN(P + S.owner) + ' จาก ' + fmtN(S.owner) + ' บาท');
    F.push({ id: 'loss', lv: 'high', title: neg ? 'ยิ่งขายมาก ยิ่งขาดทุน' : 'ร้านขาดทุนทุกเดือน',
      money: -P, unit: 'month', moneyText: fmtN(-P) + ' บาท/เดือน', moneyCap: 'ถ้าถึงจุดคุ้มทุน กำไรจะเพิ่มเท่านี้ (' + fmtN(-P * 12) + ' บาท/ปี)',
      ev: ev, ways: neg ? waysNeg(S, inp, m) : waysTo(-P, S, inp, m),
      waysTitle: neg ? 'ตัวเลขที่ทำให้ขายแล้วเริ่มมีเงินเหลือ (ขยับอย่างใดอย่างหนึ่ง)' : 'ตัวเลขที่ทำให้ไม่ขาดทุน (ขยับอย่างใดอย่างหนึ่ง)',
      q: neg ? QSETS.neg[m] : QSETS.gap[m] });
  }

  /* ยอดตก 20% ก็ขาดทุน (ฉาก "แย่" ของ PL2) */
  if (P >= 0 && S.be && !S.be.impossible) {
    var S20 = compute(scaleVol(inp, m, 0.8), m);
    if (S20.ok && S20.profit < 0) {
      F.push({ id: 'fragile', lv: 'mid', title: 'ยอดตกนิดเดียวก็ขาดทุน',
        money: -S20.profit, unit: 'month', moneyText: fmtN(-S20.profit) + ' บาท/เดือน',
        moneyCap: 'ขาดทุนต่อเดือน ถ้า' + (m === 'rental' ? 'คนเช่า' : 'ยอดขาย') + 'ลดลง 20% (เช่น เดือนที่ขายไม่ดี)',
        ev: ['ตอนนี้กำไรเดือนละ ' + fmtN(P) + ' บาท ' + (S.be.safety !== null ? ({ rental: 'คนเช่า', subscription: 'สมาชิก' }[m] || 'ยอดขาย') + 'ลดได้อีกแค่ ' + fmtPct(S.be.safety * 100) + ' ก่อนเริ่มขาดทุน' : '')],
        ways: waysTo(-S20.profit, S20, scaleVol(inp, m, 0.8), m, 0.8), waysTitle: 'ตัวเลขที่ทำให้ยอดตก 20% แล้วยังไม่ขาดทุน',
        q: QSETS.gap[m] });
    }
  }

  /* ยอดลดลงเรื่อยๆ / สมาชิกลดลง */
  if (S.cash.length === 12) {
    var rev1 = S.revenue, rev12 = S.cash[11].rev;
    var drop = S.profit - S.profit12;
    var declining = rev12 < rev1 * 0.95 && drop > 0 && !(hasSeason(inp) && n0(inp.growth) >= 0 && m !== 'subscription');
    if (m === 'subscription') declining = n0(inp.leaving) > n0(inp.newMembers) && drop > 0;
    if (declining) {
      var ev2 = m === 'subscription'
        ? ['สมาชิกเลิกเดือนละ ' + fmtN(n0(inp.leaving)) + ' คน แต่สมัครใหม่ ' + fmtN(n0(inp.newMembers)) + ' คน อีก 12 เดือนกำไรจะเหลือเดือนละ ' + fmtN(S.profit12) + ' บาท']
        : ['ยอดขายลดลงเดือนละ ' + fmtPct(-n0(inp.growth)) + ' อีก 12 เดือนกำไรจะเหลือเดือนละ ' + fmtN(S.profit12) + ' บาท'];
      if (m === 'subscription' && n0(inp.leaving) > 0) {
        var churn = n0(inp.leaving) / Math.max(1, n0(inp.members));
        ev2.push('ถ้าตัวเลขยังเป็นแบบนี้ สมาชิกจะลดลงไปนิ่งที่ราว ' + fmtN(n0(inp.newMembers) / churn) + ' คน');
      }
      F.push({ id: 'decline', lv: S.profit12 < 0 ? 'high' : 'mid', title: m === 'subscription' ? 'สมาชิกลดลงทุกเดือน' : 'ยอดขายลดลงเรื่อยๆ',
        money: drop, unit: 'month', moneyText: fmtN(drop) + ' บาท/เดือน', moneyCap: 'กำไรต่อเดือนที่จะหายไปภายใน 12 เดือน',
        ev: ev2, q: QSETS.decline[m] });
    }
  }

  /* ใกล้เต็มกำลัง */
  if (S.util && S.util.pct >= 90) {
    /* ปริมาณตอนนี้ในหน่วยเดียวกับเพดาน → กำไรที่ยังเพิ่มได้ = ที่ว่างที่เหลือ × กำไรต่อหน่วยของเพดาน */
    var curU = S.util.rental ? n0(inp.occupancy) : (S.util.conc || S.vol);
    var room = Math.max(0, S.util.max - curU);
    var headroom = curU > 0 && S.contribution > 0 ? room * S.contribution / curU : 0;
    var roomUnit = m === 'project' ? 'งานพร้อมกัน' : volUnitText(inp, m);
    F.push({ id: 'capacity', lv: 'watch', title: S.util.rental ? 'เกือบเต็มทุก' + periodWord(inp) + 'แล้ว' : 'ร้านใกล้เต็มกำลังรองรับแล้ว',
      money: headroom, unit: 'month', moneyText: fmtN(headroom) + ' บาท/เดือน', moneyCap: 'กำไรที่เพิ่มได้อีกไม่เกินนี้ ถ้ายังรับได้เท่าเดิม',
      ev: [S.util.rental ? 'มีคนเช่า ' + fmtPct(S.util.pct) + ' เหลือที่ว่างอีก ' + fmtPct(100 - S.util.pct)
        : 'ใช้กำลังไปแล้ว ' + fmtPct(S.util.pct) + ' รับเพิ่มได้อีก ' + fmtN(room, 1) + ' ' + roomUnit],
      q: QSETS.capacity.all });
  } else if (S.util && S.util.reachT) {
    var lost = 0;
    if (isVolModel(m) && S.r.projectionIfCapacityUnchanged) {
      S.r.projection.forEach(function (p, i) { lost += p.netCashFlow - S.r.projectionIfCapacityUnchanged[i].netCashFlow; });
    } else if (m === 'subscription') {
      var S4 = compute(withK(inp, 'maxMembers', null), m);
      if (S4.ok) S4.cash.forEach(function (c, i) { lost += c.net - S.cash[i].net; });
    }
    if (lost > 0) F.push({ id: 'capacity', lv: 'mid', title: 'ร้านจะเต็มกำลังรองรับภายใน 12 เดือน',
      money: lost / 12, unit: 'year', moneyText: fmtN(lost) + ' บาท', moneyCap: 'กำไรที่อาจพลาดไปใน 12 เดือน',
      ev: ['ถ้ายอดโตตามตัวเลขนี้ จะเต็มกำลังในเดือน ' + monthLabel(S.util.reachT, true)], q: QSETS.capacity.all });
  }

  /* ค่าหาลูกค้าใหม่แพงกว่ากำไรจากลูกค้าคนนั้น */
  if (S.cust && S.cust.ratio !== null && S.cust.ratio < 1 && S.cust.cac > 0 && S.cust.newPerMonth > 0) {
    var lossPer = S.cust.cac - S.cust.ltvProfit;
    F.push({ id: 'cac', lv: 'mid', title: 'ค่าหาลูกค้าใหม่แพงกว่ากำไรที่ได้จากลูกค้าคนนั้น',
      money: lossPer * S.cust.newPerMonth, unit: 'month', moneyText: fmtN(lossPer * S.cust.newPerMonth) + ' บาท/เดือน',
      moneyCap: 'เงินที่จ่ายเกินกำไรที่ลูกค้าใหม่สร้างให้ ทุกเดือน',
      ev: ['ได้ลูกค้าใหม่ 1 คน ใช้เงินการตลาด ' + fmtN(S.cust.cac) + ' บาท แต่ลูกค้าคนนั้นสร้างกำไรให้ ' + fmtN(S.cust.ltvProfit) + ' บาท ตลอดที่ซื้อกับคุณ'],
      q: QSETS.cac.all });
  }

  /* เงินสำรองบาง: เงินในมือช่วงต่ำสุด < ค่าใช้จ่ายคงที่ 1 เดือน */
  if (S.hasCash && S.lowest !== null && S.lowest >= 0 && S.lowest < S.fixed) {
    F.push({ id: 'thincash', lv: 'watch', title: 'เงินสำรองไม่พอจ่าย 1 เดือน',
      money: S.fixed - S.lowest, unit: 'once', moneyText: fmtN(S.fixed - S.lowest) + ' บาท',
      moneyCap: 'เงินที่ยังขาด ถึงจะมีเงินสำรองเท่าค่าใช้จ่ายคงที่ 1 เดือน (' + fmtN(S.fixed) + ' บาท)',
      ev: ['เงินในมือช่วงต่ำสุดเหลือ ' + fmtN(S.lowest) + ' บาท (' + monthLabel(S.lowestT, true) + ') ถ้าเดือนไหนขายไม่ได้ จะไม่พอจ่ายค่าใช้จ่ายคงที่'],
      q: QSETS.cash.all });
  }

  /* ยังไม่ได้ใส่เงินสด ทั้งที่เงินไหลออก */
  if (!S.hasCash && S.cash.some(function (c) { return c.net < 0; })) {
    F.push({ id: 'nocash', lv: 'note', title: 'ยังไม่รู้ว่าเงินพอใช้ถึงเดือนไหน', money: 0, unit: 'none',
      ev: ['มีเดือนที่เงินออกมากกว่าเงินเข้า ใส่เงินสดที่มีตอนนี้ เพื่อดูว่าเงินพอใช้ถึงเดือนไหน'], q: [] , editField: 'cash' });
  }

  /* ยังไม่นับเงินเดือนตัวเอง */
  if (S.owner === 0) {
    F.push({ id: 'nosalary', lv: 'note', title: 'กำไรนี้ยังไม่ได้หักเงินเดือนคุณ', money: 0, unit: 'none',
      ev: ['กำไร ' + fmtN(P) + ' บาทที่เห็น รวมค่าแรงของคุณไว้ด้วย ลองใส่เงินเดือนที่คุณควรได้ในส่วนทดลอง เพื่อดูกำไรจริงของร้าน'],
      q: [], tryLever: 'ownerSalary' });
  }

  F.forEach(function (f) {
    f.qs = (f.q || []).filter(function (id) { var b = QBANK[id]; return b && (!b.when || b.when(inp, m)); })
      .filter(function (id, i, a) { return a.indexOf(id) === i; }).slice(0, 5);
  });
  /* เรียง: เงินจะหมดก่อน → ระดับ → เงินต่อเดือน (เงินก้อนเดียวเทียบเป็นต่อเดือนไม่ได้ จึงเรียงตามระดับก่อน) */
  F.sort(function (a, b) {
    if (!!b.urgent !== !!a.urgent) return a.urgent ? -1 : 1;
    if (LV_ORDER[a.lv] !== LV_ORDER[b.lv]) return LV_ORDER[a.lv] - LV_ORDER[b.lv];
    return (b.unit === 'none' ? 0 : b.money) - (a.unit === 'none' ? 0 : a.money);
  });
  return F;
}

function waysNeg(S, inp, m) {
  var R = ROLE[m];
  var ways = [];
  /* หาค่าที่ทำให้เงินที่เหลือหลังต้นทุนผันแปรเริ่มเป็นบวก (เป็นเส้นตรง จึงใช้ 2 จุด) แล้วยืนยันด้วยการคำนวณจริง */
  function solve(k, dir) {
    var st = leverStep(k, inp, m), cur = n0(inp[k]);
    var S1 = compute(withK(inp, k, cur + st), m);
    if (!S1.ok) return null;
    var slope = (S1.contribution - S.contribution) / st;
    if ((dir > 0 && slope <= 0) || (dir < 0 && slope >= 0)) return null;
    var x = Math.round((cur - S.contribution / slope) * 1e6) / 1e6;
    x = dir > 0 ? Math.floor(x / st + 1) * st : Math.ceil(x / st - 1) * st;
    if (x < 0) return null;
    var S2 = compute(withK(inp, k, x), m);
    return S2.ok && S2.contribution > 0 ? x : null;
  }
  if (R.price) {
    var p = solve(R.price, 1);
    if (p !== null) ways.push({ text: priceVerb(m).replace('เป็น', '') + 'ต้องไม่ต่ำกว่า <b>' + fmtN(p) + '</b>' + (leverUnit(R.price, inp, m) === '%' ? '%' : ' บาท') + ' (ตอนนี้ ' + fmtN(n0(inp[R.price])) + ')', lever: R.price, value: p,
      label: priceVerb(m).replace('เป็น', '') + 'ต้องไม่ต่ำกว่า', big: fmtN(p) + (leverUnit(R.price, inp, m) === '%' ? '%' : ' บาท'), note: 'ตอนนี้ ' + fmtN(n0(inp[R.price])) });
  }
  if (R.cost) {
    var c = solve(R.cost, -1);
    var cname = { unit: 'ต้นทุนต่อ' + U(inp, m), service: 'ต้นทุนต่อ' + U(inp, m), resell: 'ราคาที่ซื้อมาต่อ' + U(inp, m), subscription: 'ต้นทุนต่อสมาชิก',
      project: 'ต้นทุนของแต่ละงาน', rental: 'ค่าใช้จ่ายต่อ' + periodWord(inp), commission: 'ส่วนแบ่งให้ทีม', other: 'ต้นทุน' }[m];
    var cunit = { project: '% ของมูลค่างาน', commission: '% ของค่าคอม', other: '% ของรายได้' }[m] || 'บาท';
    if (c !== null) ways.push({ text: cname + 'ต้องไม่เกิน <b>' + fmtN(c) + '</b>' + (cunit === 'บาท' ? ' บาท' : cunit) + ' (ตอนนี้ ' + fmtN(n0(inp[R.cost])) + ')', lever: R.cost, value: c,
      label: cname + 'ต้องไม่เกิน', big: fmtN(c) + (cunit === 'บาท' ? ' บาท' : cunit), note: 'ตอนนี้ ' + fmtN(n0(inp[R.cost])) });
  }
  if (n0(inp.feePct) > 0) {
    var f = solve('feePct', -1);
    if (f !== null) ways.push({ text: 'ค่าธรรมเนียมไม่เกิน <b>' + fmtN(f) + '%</b> ของยอดขาย (ตอนนี้ ' + fmtN(n0(inp.feePct)) + '%)', lever: 'feePct', value: f,
      label: 'ค่าธรรมเนียมต้องไม่เกิน', big: fmtN(f) + '% ของยอดขาย', note: 'ตอนนี้ ' + fmtN(n0(inp.feePct)) + '%' });
  }
  return ways;
}

/* ---------- ป้ายราคาของจุดที่ควรตรวจสอบ ---------- */
function pointTag(bankLever, S, inp, m) {
  if (!bankLever || !S.ok) return '';
  var k = roleKey(m, bankLever);
  if (!k) return '';
  var u = U(inp, m);
  var d, st;
  if (k === 'creditDays' || k === 'stockDays') {
    var cur = n0(inp[k]);
    if (cur <= 0) return '';
    var alt = withK(inp, k, Math.max(0, cur - 15));
    var S2 = compute(alt, m);
    if (!S2.ok) return '';
    d = S2.lowest - S.lowest;
    if (d < 1) return '';
    return (k === 'creditDays' ? 'ลูกค้าจ่ายเร็วขึ้น 15 วัน' : 'ของค้างสต็อกสั้นลง 15 วัน') + ' = เงินในมือช่วงต่ำสุดเพิ่มขึ้น <b>' + fmtN(d) + '</b> บาท';
  }
  if (k === 'rent' || k === 'otherFixed') {
    var v = n0(inp[k]);
    if (v <= 0 || S.revenue <= 0) return '';
    return (k === 'rent' ? 'ค่าเช่า' : 'ค่าใช้จ่ายอื่น') + ' ' + fmtN(v) + ' บาท/เดือน = <b>' + fmtN(v / S.revenue * 100, 1) + '</b> บาทจากทุก 100 บาทที่ลูกค้าจ่าย';
  }
  if (k === 'marketing') {
    var mk = n0(inp.marketing);
    if (mk <= 0 || S.contribution <= 0 || !S.vol) return '';
    var perVol = S.contribution / S.vol;
    return 'งบการตลาด ' + fmtN(mk) + ' บาท/เดือน ต้องพา' + volVerb(m).replace('ให้ได้', '') + 'เพิ่มอย่างน้อย <b>' + fmtN(mk / perVol, 1) + '</b> ' + volUnitText(inp, m) + ' ถึงจะคุ้มเงินที่จ่าย';
  }
  if (k === 'staffCount') {
    var sal = n0(inp.staffSalary);
    if (sal <= 0 || S.contribution <= 0 || !S.vol) return '';
    return 'พนักงาน 1 คน = ค่าใช้จ่าย ' + fmtN(sal) + ' บาท/เดือน = ต้อง' + volVerb(m) + 'เพิ่ม <b>' + fmtN(sal / (S.contribution / S.vol), 1) + '</b> ' + volUnitText(inp, m) + ' ถึงจะคุ้มค่าจ้าง';
  }
  if (k === 'leaving' || k === 'newMembers') {
    var S5 = compute(withK(inp, k, Math.max(0, n0(inp[k]) + (k === 'leaving' ? -1 : 1))), m);
    if (!S5.ok) return '';
    d = S5.profit12 - S.profit12;
    return (k === 'leaving' ? 'คนเลิกน้อยลงเดือนละ 1 คน' : 'สมาชิกใหม่เพิ่มเดือนละ 1 คน') + ' = อีก 12 เดือน กำไรเพิ่มเดือนละ <b>' + fmtN(d) + '</b> บาท';
  }
  var dir = (k === ROLE[m].cost || k === 'feePct') ? -1 : 1;
  st = leverStep(k, inp, m);
  if (k === 'occupancy') st = 5;
  if (dir < 0 && n0(inp[k]) < st) return '';
  d = leverEffect(k, inp, m, dir * st);
  if (d === null || Math.abs(d) < 0.5) return '';
  var stepTxt;
  var pctUnit = leverUnit(k, inp, m) === '%';
  if (k === 'volume') stepTxt = (m === 'service' ? 'ลูกค้าเพิ่ม' : 'ขายเพิ่ม') + (inp.volumePer === 'month' ? 'เดือนละ ' : 'วันละ ') + fmtN(st) + ' ' + u;
  else if (k === ROLE[m].price) stepTxt = 'ขึ้นราคาอีก ' + fmtN(st) + (pctUnit ? '%' : ' บาท') + ' โดยลูกค้าเท่าเดิม';
  else if (k === ROLE[m].cost) stepTxt = 'ต้นทุนลดลง ' + fmtN(st) + (pctUnit ? '%' : ' บาทต่อ' + u);
  else if (k === 'feePct') stepTxt = 'ค่าธรรมเนียมลดลง 1% ของยอดขาย';
  else if (k === 'occupancy') stepTxt = 'มีคนเช่าเพิ่ม 5%';
  else stepTxt = leverLabel(k, inp, m)[1] + ' +' + fmtN(st);
  return stepTxt + ' = กำไรเพิ่ม <b>' + fmtN(d) + '</b> บาท/เดือน';
}

/* ---------- คำอธิบายใต้ตัวเลขที่กำลังปรับ (เครื่องคิดเลขเล็กอยู่ตรงนี้) ---------- */
function leverInsight(k, base, trialInp, m, Sb, St) {
  if (!Sb.ok || !St.ok) return '';
  var u = U(base, m);
  var R = ROLE[m];
  var bv = n0(base[k]), tv = n0(trialInp[k]);
  if (k === R.price && R.price) {
    var F = St.fixed + St.dep;
    if (tv !== bv && St.contribution > 0) {
      var need = (Sb.profit + F) / St.contribution; /* ตัวคูณปริมาณที่ทำให้กำไรเท่าเดิม */
      var pct = (need - 1) * 100;
      var who = m === 'rental' ? 'คนเช่า' : m === 'subscription' ? 'สมาชิก' : 'ลูกค้า';
      if (tv > bv) {
        if (pct <= -100) return 'ขึ้นราคาเป็น ' + fmtN(tv) + ' แล้ว ' + who + 'หายไปเกือบหมดกำไรก็ยังเท่าเดิม';
        return 'ขึ้นราคาเป็น ' + fmtN(tv) + ' (' + fmtSignedPct((tv / bv - 1) * 100) + ') ' + who + 'ลดลงได้ถึง <b>' + fmtPct(-pct) + '</b> กำไรยังเท่าเดิม';
      }
      return 'ลดราคาเป็น ' + fmtN(tv) + ' (' + fmtSignedPct((tv / bv - 1) * 100) + ') ต้องขายเพิ่ม <b>' + fmtPct(pct) + '</b> ถึงจะได้กำไรเท่าเดิม';
    }
    if (tv < bv && St.contribution <= 0) return 'ราคานี้ขายเท่าไหร่ก็ขาดทุน เพราะต่ำกว่าต้นทุนที่เพิ่มตามยอดขาย';
    var e = leverEffect(k, trialInp, m, leverStep(k, base, m));
    return e !== null ? 'ขึ้นราคาทีละ ' + fmtN(leverStep(k, base, m)) + (R.price === 'commissionPct' ? '%' : ' บาท') + ' โดย' + (m === 'rental' ? 'คนเช่า' : 'ลูกค้า') + 'เท่าเดิม = กำไรเพิ่ม <b>' + fmtN(e) + '</b> บาท/เดือน' : '';
  }
  if (k === 'marketing') {
    var perVol = St.contribution > 0 && St.vol ? St.contribution / St.vol : null;
    if (!perVol) return '';
    if (tv !== bv) {
      var dv = (tv - bv) / perVol;
      if (tv > bv) return 'เพิ่มงบ ' + fmtN(tv - bv) + ' บาท ต้องพา' + (m === 'service' ? 'ลูกค้า' : 'ยอดขาย') + 'เพิ่มอย่างน้อย <b>' + fmtN(dv, 1) + '</b> ' + volUnitText(base, m) + ' ถึงจะคุ้ม';
      return 'ลดงบ ' + fmtN(bv - tv) + ' บาท ถ้ายอดหายไปไม่เกิน <b>' + fmtN(-dv, 1) + '</b> ' + volUnitText(base, m) + ' ยังได้กำไรมากกว่าเดิม';
    }
    return tv > 0 ? 'งบ ' + fmtN(tv) + ' บาท ต้องพายอดขายได้อย่างน้อย <b>' + fmtN(tv / perVol, 1) + '</b> ' + volUnitText(base, m) + ' ถึงจะคุ้มเงินที่จ่าย' : '';
  }
  if (k === 'ownerSalary') {
    return 'ถ้าไม่นับเงินเดือนคุณ ร้านเหลือเงินเดือนละ <b>' + fmtN(St.profit + n0(trialInp.ownerSalary)) + '</b> บาท';
  }
  if (k === 'staffCount' || k === 'staffSalary') {
    var sal = n0(trialInp.staffSalary);
    if (sal > 0 && St.contribution > 0 && St.vol) return 'พนักงาน 1 คน ต้อง' + volVerb(m) + 'เพิ่ม <b>' + fmtN(sal / (St.contribution / St.vol), 1) + '</b> ' + volUnitText(base, m) + ' ถึงจะคุ้มค่าจ้าง';
    return '';
  }
  if (k === 'rent' || k === 'otherFixed') {
    return St.revenue > 0 ? (k === 'rent' ? 'ค่าเช่า' : 'ค่าใช้จ่ายนี้') + ' = <b>' + fmtN(tv / St.revenue * 100, 1) + '</b> บาทจากทุก 100 บาทที่ลูกค้าจ่าย' : '';
  }
  if (k === 'leaving' || k === 'newMembers') {
    var churn = n0(trialInp.leaving) / Math.max(1, n0(trialInp.members));
    if (churn > 0) return 'ถ้าตัวเลขเป็นแบบนี้ สมาชิกจะไปนิ่งที่ราว <b>' + fmtN(n0(trialInp.newMembers) / churn) + '</b> คน (ตอนนี้ ' + fmtN(n0(trialInp.members)) + ')';
    return 'ไม่มีคนเลิก สมาชิกจะเพิ่มขึ้นเดือนละ ' + fmtN(n0(trialInp.newMembers)) + ' คน';
  }
  var st = leverStep(k, base, m);
  var dir = (k === R.cost || k === 'feePct') ? -1 : 1;
  if (k === 'volume' || k === R.vol) {
    var e2 = leverEffect(k, trialInp, m, st);
    var txt = e2 !== null ? volVerb(m).replace('ให้ได้', '') + 'เพิ่ม ' + fmtN(st) + ' ' + volUnitText(base, m) + ' = กำไรเพิ่ม <b>' + fmtN(e2) + '</b> บาท/เดือน' : '';
    if (St.util && St.util.max && !St.util.rental && k === 'volume') txt += ' · ทำได้สูงสุด ' + fmtN(St.util.max) + ' ' + volUnitText(base, m);
    return txt;
  }
  if (dir < 0 && tv < st) return '';
  var e3 = leverEffect(k, trialInp, m, dir * st);
  if (e3 === null) return '';
  return (dir < 0 ? 'ลดลง ' : 'เพิ่มขึ้น ') + fmtN(st) + ' ' + leverUnit(k, base, m) + ' = กำไรเปลี่ยน <b>' + fmtSigned(e3) + '</b> บาท/เดือน';
}

/* ---------- format ---------- */
function fmtN(n, dec) {
  if (n === null || n === undefined || !isFinite(n)) return '–';
  var a = Math.abs(n);
  var d = dec === undefined ? (a < 10 && Math.round(a) !== a ? 1 : 0) : (Math.round(a) === a ? 0 : dec);
  var s = a.toLocaleString('th-TH', { minimumFractionDigits: 0, maximumFractionDigits: d });
  return (n < 0 && s !== '0' ? '−' : '') + s;
}
function fmtSigned(n) { return (n > 0.5 ? '+' : '') + fmtN(n); }
function fmtPct(p) { return fmtN(p, Math.abs(p) < 10 ? 1 : 0) + '%'; }
function fmtSignedPct(p) { return (p > 0 ? '+' : '') + fmtPct(p); }
function compactTH(n) {
  var a = Math.abs(n), s = n < 0 ? '−' : '';
  function t(x) { return (Math.round(x * 10) / 10).toLocaleString('th-TH'); }
  if (a >= 1e6) return s + t(a / 1e6) + ' ล้าน';
  if (a >= 1e5) return s + t(a / 1e5) + ' แสน';
  if (a >= 1e4) return s + t(a / 1e4) + ' หมื่น';
  if (a >= 1e3) return s + t(a / 1e3) + ' พัน';
  return s + Math.round(a).toLocaleString('th-TH');
}
